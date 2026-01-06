import { GoogleGenAI, GenerateContentResponse, Chat, Modality, LiveServerMessage, Blob } from "@google/genai";
import { FileAttachment } from "../types";

// Initialize Gemini Client
// In the provided environment, process.env.API_KEY is guaranteed to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DEFAULT_MODEL = 'gemini-2.5-flash';
const CHAT_MODEL = 'gemini-3-pro-preview';
const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-09-2025';

interface GenerationRequest {
  systemInstruction: string;
  prompt: string;
  attachments: FileAttachment[];
  responseMimeType?: string;
}

/**
 * Generic function to generate content from Gemini with multimodal inputs.
 */
export const generateGeminiResponse = async ({
  systemInstruction,
  prompt,
  attachments,
  responseMimeType = "text/plain"
}: GenerationRequest): Promise<string> => {
  try {
    const parts: any[] = [];

    // Add attachments (images/PDFs)
    for (const att of attachments) {
      // Clean base64 string if it contains metadata header
      const base64Data = att.base64.split(',')[1];
      parts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: base64Data
        }
      });
    }

    // Add text prompt
    parts.push({ text: prompt });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: responseMimeType,
        temperature: 0.4, // Lower temperature for clinical accuracy
      },
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate response. Please check your connection or inputs.");
  }
};

/**
 * Create a new Chat Session with Gemini 3.0 Pro
 */
export const createChatSession = (systemInstruction: string) => {
  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction,
      temperature: 0.7
    }
  });
};

/**
 * Live API Client Class
 */
export class LiveClient {
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private session: any = null;
  private stream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;

  constructor(private onStatusChange: (status: string) => void) {}

  async connect(systemInstruction: string) {
    try {
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: LIVE_MODEL,
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: systemInstruction,
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
        },
        callbacks: {
          onopen: () => {
            this.onStatusChange("connected");
            this.setupAudioInput(sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Audio Output
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio) {
                 await this.playAudio(base64Audio);
             }
             
             // Handle interruptions
             if (message.serverContent?.interrupted) {
                 this.stopAudioPlayback();
             }
          },
          onclose: () => {
             this.onStatusChange("disconnected");
          },
          onerror: (e) => {
             console.error("Live API Error", e);
             this.onStatusChange("error");
          }
        }
      });
      
      this.session = sessionPromise; // Store promise to ensure we can close later if needed by API updates (currently close() is on session object, not promise, but API might vary)
      return sessionPromise;
    } catch (err) {
      console.error(err);
      this.onStatusChange("error");
      throw err;
    }
  }

  private setupAudioInput(sessionPromise: Promise<any>) {
    if (!this.inputAudioContext || !this.stream) return;

    this.inputSource = this.inputAudioContext.createMediaStreamSource(this.stream);
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    this.scriptProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = this.createPcmBlob(inputData);
        
        sessionPromise.then((session) => {
            session.sendRealtimeInput({ media: pcmBlob });
        });
    };

    this.inputSource.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioContext.destination);
  }

  private createPcmBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    const uint8 = new Uint8Array(int16.buffer);
    let binary = '';
    const len = uint8.byteLength;
    for(let i=0; i<len; i++) {
        binary += String.fromCharCode(uint8[i]);
    }
    const base64 = btoa(binary);

    return {
        data: base64,
        mimeType: 'audio/pcm;rate=16000'
    };
  }

  private async playAudio(base64String: string) {
    if (!this.outputAudioContext) return;
    
    // Decode Base64 to Uint8Array
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Convert raw PCM to AudioBuffer
    // Assuming 24000Hz 1 channel as per standard Gemini Live output
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = this.outputAudioContext.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for(let i=0; i<dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }

    // Schedule playback
    const source = this.outputAudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.outputAudioContext.destination);
    
    // Simple queueing logic
    const currentTime = this.outputAudioContext.currentTime;
    const startTime = Math.max(currentTime, this.nextStartTime);
    source.start(startTime);
    this.nextStartTime = startTime + buffer.duration;
    
    source.onended = () => {
        this.sources.delete(source);
    };
    this.sources.add(source);
  }

  private stopAudioPlayback() {
     this.sources.forEach(source => {
         try { source.stop(); } catch(e) {}
     });
     this.sources.clear();
     if (this.outputAudioContext) {
         this.nextStartTime = this.outputAudioContext.currentTime;
     }
  }

  async disconnect() {
    if (this.session) {
        // Resolve promise to get session object then close
        const s = await this.session;
        s.close(); 
    }
    
    this.stopAudioPlayback();

    if (this.inputSource) this.inputSource.disconnect();
    if (this.scriptProcessor) this.scriptProcessor.disconnect();
    
    if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
    }
    
    if (this.inputAudioContext) await this.inputAudioContext.close();
    if (this.outputAudioContext) await this.outputAudioContext.close();
    
    this.session = null;
    this.onStatusChange("disconnected");
  }
}

/**
 * Module-specific System Instructions
 */

export const SYSTEM_PROMPTS = {
  TRIAGE: `You are an AI Medical Triage Copilot. 
  Your Role: Analyze symptoms and attached reports to provide a triage summary.
  Safety: NEVER diagnose. Always say "Decision Support Only".
  Output Format: JSON with keys: 
  - 'chief_complaint'
  - 'history_of_present_illness'
  - 'medications'
  - 'abnormal_findings'
  - 'urgency_level' (Emergency, Same-day, Routine, Self-care)
  - 'red_flags' (array of strings, list ONLY critical risk factors)
  - 'clinical_summary'.
  For Clinician View: Use medical terminology.
  For Patient View: Use simple language.`,

  DISCHARGE: `You are a Discharge Summary Simplifier.
  Your Role: Convert clinical discharge documents into patient-friendly language (6th-grade reading level).
  Task: Explain medical terms, create a checklist.
  Output Format: Markdown. Sections: "Summary of Stay", "New Medications" (with timing), "Things to Watch For", "Follow-up Actions".
  Preserve all clinical meaning but remove jargon.`,

  INTAKE: `You are a Clinical Encounter Note Drafter.
  Your Role: Synthesize patient pre-visit input into a structured SOAP note draft.
  Output Format: Markdown.
  Structure: 
  - **S (Subjective):** Patient narrative.
  - **O (Objective):** Extracted data from files (vitals, labs).
  - **A (Assessment):** Potential problem list (differential).
  - **P (Plan):** Leave blank with placeholders [ ] for clinician.
  - **Suggested Questions:** A list of 3-5 clarifying questions.`,

  CAREGIVER: `You are a Caregiver Communication Copilot.
  Your Role: Aggregate mixed inputs (notes, pillbox photos) into a timeline.
  Output Format: Markdown timeline. Sort chronologically. Highlight "Open Questions" for the doctor at the end.`,

  CHATBOT: `You are a versatile Medical AI Assistant powered by Gemini 3.0 Pro.
  Your Role: Answer medical questions, explain concepts, and assist with clinical reasoning.
  Style: Professional, empathetic, and precise.
  Disclaimer: Always include a brief disclaimer if providing medical advice.`,

  LIVE: `You are a Voice-First Clinical Assistant.
  Your Role: Engage in a natural, spoken conversation to gather history or answer questions.
  Style: Conversational, concise (suitable for audio), and empathetic. Keep responses under 40 words unless asked for detail.`
};