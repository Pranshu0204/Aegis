import { Language, ModuleId, Role } from '../types';

export const TRANSLATIONS: Record<Language, any> = {
  English: {
    appTitle: "AEGIS",
    subtitle: "Multimodal Clinical Intelligence",
    role: "Role",
    language: "Language",
    modulesHeader: "Modules",
    modules: {
      [ModuleId.TRIAGE]: { title: "AI Triage", desc: "Symptom analysis & risk flagging" },
      [ModuleId.DISCHARGE]: { title: "Discharge Simplifier", desc: "Translate complex docs for patients" },
      [ModuleId.INTAKE]: { title: "Note Drafter", desc: "Pre-visit SOAP note generation" },
      [ModuleId.CAREGIVER]: { title: "Caregiver Log", desc: "Timeline synthesis from mixed inputs" },
      [ModuleId.CHATBOT]: { title: "Medical Chatbot", desc: "Chat with Gemini 3.0 Pro" },
      [ModuleId.LIVE]: { title: "Voice Conversation", desc: "Real-time talk with Gemini 2.5" },
    },
    context: "View",
    decisionSupport: "Decision Support Only",
    dataInput: "Data",
    aiOutput: "AI Output",
    copy: "Copy",
    waiting: "Waiting for input...",
    processing: "Processing...",
    runAnalysis: "Run Analysis",
    uploadTitle: "Click to upload",
    uploadSubtitle: "images, reports, or PDFs",
    uploadSupport: "Supports PNG, JPEG, PDF",
    tips: {
      [ModuleId.TRIAGE]: "Upload lab PDFs or photos of medication bottles for better accuracy.",
      [ModuleId.DISCHARGE]: "Take a clear photo of the hospital letter. We will identify the medication list.",
      [ModuleId.INTAKE]: "Patients can upload prior clinic letters to auto-populate history.",
      [ModuleId.CAREGIVER]: "Upload multiple photos of notes and pill boxes to create a single timeline.",
      [ModuleId.CHATBOT]: "Ask complex medical questions or request explanations.",
      [ModuleId.LIVE]: "Use for hands-free consultation or patient interviews."
    },
    placeholders: {
      [ModuleId.TRIAGE]: "Describe symptoms & history...",
      [ModuleId.DISCHARGE]: "Paste text or additional notes (optional)...",
      [ModuleId.INTAKE]: "Additional details or notes...",
      [ModuleId.CAREGIVER]: "Enter caregiver notes...",
      [ModuleId.CHATBOT]: "Ask a question...",
      [ModuleId.LIVE]: "Start speaking..."
    },
    roles: {
      [Role.CLINICIAN]: "Clinician",
      [Role.PATIENT]: "Patient",
      [Role.CAREGIVER]: "Caregiver"
    },
    disclaimer: "MEDICAL DISCLAIMER: This system utilizes Artificial Intelligence. It is NOT a diagnostic tool. All outputs are for documentation and workflow assistance only and must be reviewed by a qualified clinician.",
    live: {
        start: "Start Conversation",
        stop: "End Conversation",
        listening: "Listening...",
        speaking: "Speaking...",
        error: "Connection Error"
    }
  },
  Hindi: {
    appTitle: "AEGIS",
    subtitle: "मल्टीमोडल क्लिनिकल इंटेलिजेंस",
    role: "भूमिका",
    language: "भाषा",
    modulesHeader: "मॉड्यूल",
    modules: {
      [ModuleId.TRIAGE]: { title: "AI ट्राइएज", desc: "लक्षण विश्लेषण और जोखिम पहचान" },
      [ModuleId.DISCHARGE]: { title: "डिस्चार्ज सिंपलीफायर", desc: "मरीजों के लिए जटिल दस्तावेजों का अनुवाद" },
      [ModuleId.INTAKE]: { title: "नोट ड्राफ्टर", desc: "प्री-विज़िट SOAP नोट बनाना" },
      [ModuleId.CAREGIVER]: { title: "केयरगिवर लॉग", desc: "मिश्रित इनपुट से समयरेखा संश्लेषण" },
      [ModuleId.CHATBOT]: { title: "मेडिकल चैटबॉट", desc: "Gemini 3.0 Pro के साथ चैट करें" },
      [ModuleId.LIVE]: { title: "वॉयस वार्तालाप", desc: "Gemini 2.5 के साथ रीयल-टाइम बात" },
    },
    context: "दृश्य",
    decisionSupport: "केवल निर्णय सहायता",
    dataInput: "डेटा",
    aiOutput: "AI परिणाम",
    copy: "कॉपी",
    waiting: "इनपुट की प्रतीक्षा है...",
    processing: "प्रक्रिया जारी है...",
    runAnalysis: "विश्लेषण करें",
    uploadTitle: "अपलोड करने के लिए क्लिक करें",
    uploadSubtitle: "चित्र, रिपोर्ट या पीडीएफ",
    uploadSupport: "PNG, JPEG, PDF समर्थित",
    tips: {
      [ModuleId.TRIAGE]: "बेहतर सटीकता के लिए लैब पीडीएफ या दवा की बोतलों की तस्वीरें अपलोड करें।",
      [ModuleId.DISCHARGE]: "अस्पताल के पत्र की स्पष्ट तस्वीर लें।",
      [ModuleId.INTAKE]: "रोगी इतिहास भरने के लिए पुराने क्लिनिक पत्र अपलोड कर सकते हैं।",
      [ModuleId.CAREGIVER]: "एक समयरेखा बनाने के लिए नोट्स और गोली के बक्से की कई तस्वीरें अपलोड करें।",
      [ModuleId.CHATBOT]: "जटिल चिकित्सा प्रश्न पूछें।",
      [ModuleId.LIVE]: "हैंड्स-फ्री परामर्श के लिए उपयोग करें।"
    },
    placeholders: {
      [ModuleId.TRIAGE]: "लक्षण और इतिहास का वर्णन करें...",
      [ModuleId.DISCHARGE]: "पाठ या अतिरिक्त नोट्स पेस्ट करें (वैकल्पिक)...",
      [ModuleId.INTAKE]: "अतिरिक्त विवरण या नोट्स...",
      [ModuleId.CAREGIVER]: "केयरगिवर नोट्स दर्ज करें...",
      [ModuleId.CHATBOT]: "एक प्रश्न पूछें...",
      [ModuleId.LIVE]: "बोलना शुरू करें..."
    },
    roles: {
      [Role.CLINICIAN]: "चिकित्सक",
      [Role.PATIENT]: "रोगी",
      [Role.CAREGIVER]: "देखभालकर्ता"
    },
    disclaimer: "चिकित्सा अस्वीकरण: यह प्रणाली कृत्रिम बुद्धिमत्ता का उपयोग करती है। यह निदान उपकरण नहीं है। सभी आउटपुट केवल प्रलेखन सहायता के लिए हैं।",
    live: {
        start: "बातचीत शुरू करें",
        stop: "बातचीत समाप्त करें",
        listening: "सुन रहा हूँ...",
        speaking: "बोल रहा हूँ...",
        error: "कनेक्शन त्रुटि"
    }
  },
  Spanish: {
    appTitle: "AEGIS",
    subtitle: "Inteligencia Clínica Multimodal",
    role: "Rol",
    language: "Idioma",
    modulesHeader: "Módulos",
    modules: {
      [ModuleId.TRIAGE]: { title: "Triaje IA", desc: "Análisis de síntomas y riesgos" },
      [ModuleId.DISCHARGE]: { title: "Simplificador de Alta", desc: "Traducir documentos complejos" },
      [ModuleId.INTAKE]: { title: "Borrador de Notas", desc: "Generación de notas SOAP" },
      [ModuleId.CAREGIVER]: { title: "Registro de Cuidadores", desc: "Síntesis de línea de tiempo" },
      [ModuleId.CHATBOT]: { title: "Chatbot Médico", desc: "Chatea con Gemini 3.0 Pro" },
      [ModuleId.LIVE]: { title: "Conversación de Voz", desc: "Habla en tiempo real con Gemini 2.5" },
    },
    context: "Vista",
    decisionSupport: "Solo Apoyo a la Decisión",
    dataInput: "Datos",
    aiOutput: "Salida de IA",
    copy: "Copiar",
    waiting: "Esperando entrada...",
    processing: "Procesando...",
    runAnalysis: "Ejecutar Análisis",
    uploadTitle: "Haga clic para subir",
    uploadSubtitle: "imágenes, informes o PDF",
    uploadSupport: "Soporta PNG, JPEG, PDF",
    tips: {
      [ModuleId.TRIAGE]: "Suba archivos PDF de laboratorio o fotos de medicamentos.",
      [ModuleId.DISCHARGE]: "Tome una foto clara de la carta del hospital.",
      [ModuleId.INTAKE]: "Los pacientes pueden subir cartas clínicas previas.",
      [ModuleId.CAREGIVER]: "Suba varias fotos de notas y pastilleros.",
      [ModuleId.CHATBOT]: "Haga preguntas médicas complejas.",
      [ModuleId.LIVE]: "Úselo para consultas manos libres."
    },
    placeholders: {
      [ModuleId.TRIAGE]: "Describa síntomas e historia...",
      [ModuleId.DISCHARGE]: "Pegue texto o notas adicionales...",
      [ModuleId.INTAKE]: "Detalles o notas adicionales...",
      [ModuleId.CAREGIVER]: "Ingrese notas del cuidador...",
      [ModuleId.CHATBOT]: "Haz una pregunta...",
      [ModuleId.LIVE]: "Empiece a hablar..."
    },
    roles: {
      [Role.CLINICIAN]: "Clínico",
      [Role.PATIENT]: "Paciente",
      [Role.CAREGIVER]: "Cuidador"
    },
    disclaimer: "AVISO MÉDICO: Este sistema utiliza IA. NO es una herramienta de diagnóstico. Todas las salidas son solo para asistencia.",
    live: {
        start: "Iniciar conversación",
        stop: "Terminar conversación",
        listening: "Escuchando...",
        speaking: "Hablando...",
        error: "Error de conexión"
    }
  },
  French: {
     appTitle: "AEGIS",
    subtitle: "Intelligence Clinique Multimodale",
    role: "Rôle",
    language: "Langue",
    modulesHeader: "Modules",
    modules: {
      [ModuleId.TRIAGE]: { title: "Triage IA", desc: "Analyse des symptômes" },
      [ModuleId.DISCHARGE]: { title: "Simplificateur", desc: "Traduire des documents complexes" },
      [ModuleId.INTAKE]: { title: "Brouillon de Note", desc: "Génération de notes SOAP" },
      [ModuleId.CAREGIVER]: { title: "Journal Aidant", desc: "Synthèse chronologique" },
      [ModuleId.CHATBOT]: { title: "Chatbot Médical", desc: "Discutez avec Gemini 3.0 Pro" },
      [ModuleId.LIVE]: { title: "Conversation Vocale", desc: "Parlez en temps réel avec Gemini 2.5" },
    },
    context: "Vue",
    decisionSupport: "Aide à la Décision Uniquement",
    dataInput: "Données",
    aiOutput: "Sortie IA",
    copy: "Copier",
    waiting: "En attente d'entrée...",
    processing: "Traitement...",
    runAnalysis: "Lancer l'Analyse",
    uploadTitle: "Cliquez pour télécharger",
    uploadSubtitle: "images, rapports ou PDF",
    uploadSupport: "Supporte PNG, JPEG, PDF",
    tips: {
      [ModuleId.TRIAGE]: "Téléchargez des PDF de labo ou photos de médicaments.",
      [ModuleId.DISCHARGE]: "Prenez une photo claire de la lettre de l'hôpital.",
      [ModuleId.INTAKE]: "Téléchargez les lettres cliniques précédentes.",
      [ModuleId.CAREGIVER]: "Téléchargez plusieurs photos de notes.",
      [ModuleId.CHATBOT]: "Posez des questions médicales complexes.",
      [ModuleId.LIVE]: "Utilisez pour une consultation mains libres."
    },
    placeholders: {
      [ModuleId.TRIAGE]: "Décrivez les symptômes et l'histoire...",
      [ModuleId.DISCHARGE]: "Collez du texte ou des notes...",
      [ModuleId.INTAKE]: "Détails supplémentaires...",
      [ModuleId.CAREGIVER]: "Entrez les notes de l'aidant...",
      [ModuleId.CHATBOT]: "Poser une question...",
      [ModuleId.LIVE]: "Commencez à parler..."
    },
    roles: {
      [Role.CLINICIAN]: "Clinicien",
      [Role.PATIENT]: "Patient",
      [Role.CAREGIVER]: "Aidant"
    },
    disclaimer: "AVIS MÉDICAL : Ce système utilise l'IA. Ce n'est PAS un outil de diagnostic. Sorties pour assistance uniquement.",
    live: {
        start: "Démarrer la conversation",
        stop: "Terminer la conversation",
        listening: "Écoute...",
        speaking: "Parle...",
        error: "Erreur de connexion"
    }
  },
  Arabic: {
    appTitle: "AEGIS",
    subtitle: "الذكاء السريري متعدد الوسائط",
    role: "الدور",
    language: "اللغة",
    modulesHeader: "الوحدات",
    modules: {
      [ModuleId.TRIAGE]: { title: "فرز الذكاء الاصطناعي", desc: "تحليل الأعراض وتحديد المخاطر" },
      [ModuleId.DISCHARGE]: { title: "مبسط الخروج", desc: "ترجمة المستندات المعقدة" },
      [ModuleId.INTAKE]: { title: "مسودة الملاحظات", desc: "إنشاء ملاحظات SOAP" },
      [ModuleId.CAREGIVER]: { title: "سجل مقدم الرعاية", desc: "توليف الجدول الزمني" },
      [ModuleId.CHATBOT]: { title: "الدردشة الطبية", desc: "الدردشة مع Gemini 3.0 Pro" },
      [ModuleId.LIVE]: { title: "محادثة صوتية", desc: "تحدث في الوقت الفعلي مع Gemini 2.5" },
    },
    context: "عرض",
    decisionSupport: "دعم القرار فقط",
    dataInput: "البيانات",
    aiOutput: "مخرجات الذكاء الاصطناعي",
    copy: "نسخ",
    waiting: "في انتظار الإدخال...",
    processing: "جارٍ المعالجة...",
    runAnalysis: "تشغيل التحليل",
    uploadTitle: "انقر للتحميل",
    uploadSubtitle: "صور، تقارير أو PDF",
    uploadSupport: "يدعم PNG, JPEG, PDF",
    tips: {
      [ModuleId.TRIAGE]: "قم بتحميل ملفات PDF للمختبر أو صور الأدوية.",
      [ModuleId.DISCHARGE]: "التقط صورة واضحة لرسالة المستشفى.",
      [ModuleId.INTAKE]: "يمكن للمرضى تحميل الرسائل السابقة.",
      [ModuleId.CAREGIVER]: "قم بتحميل صور متعددة للملاحظات.",
      [ModuleId.CHATBOT]: "اطرح أسئلة طبية معقدة.",
      [ModuleId.LIVE]: "استخدم للاستشارة بدون استخدام اليدين."
    },
    placeholders: {
      [ModuleId.TRIAGE]: "صف الأعراض والتاريخ...",
      [ModuleId.DISCHARGE]: "لصق النص أو الملاحظات...",
      [ModuleId.INTAKE]: "تفاصيل إضافية...",
      [ModuleId.CAREGIVER]: "أدخل ملاحظات مقدم الرعاية...",
      [ModuleId.CHATBOT]: "طرح سؤال...",
      [ModuleId.LIVE]: "ابدأ التحدث..."
    },
    roles: {
      [Role.CLINICIAN]: "طبيب",
      [Role.PATIENT]: "مريض",
      [Role.CAREGIVER]: "مقدم رعاية"
    },
    disclaimer: "إخلاء مسؤولية طبي: يستخدم هذا النظام الذكاء الاصطناعي. إنها ليست أداة تشخيص.",
    live: {
        start: "بدء المحادثة",
        stop: "إنهاء المحادثة",
        listening: "استماع...",
        speaking: "تحدث...",
        error: "خطأ في الاتصال"
    }
  },
  Mandarin: {
    appTitle: "AEGIS",
    subtitle: "多模态临床智能",
    role: "角色",
    language: "语言",
    modulesHeader: "模块",
    modules: {
      [ModuleId.TRIAGE]: { title: "AI 分诊", desc: "症状分析与风险标记" },
      [ModuleId.DISCHARGE]: { title: "出院简化器", desc: "翻译复杂的医疗文档" },
      [ModuleId.INTAKE]: { title: "笔记起草", desc: "生成 SOAP 笔记" },
      [ModuleId.CAREGIVER]: { title: "护理日志", desc: "时间线综合" },
      [ModuleId.CHATBOT]: { title: "医疗聊天机器人", desc: "与 Gemini 3.0 Pro 聊天" },
      [ModuleId.LIVE]: { title: "语音对话", desc: "与 Gemini 2.5 实时通话" },
    },
    context: "视图",
    decisionSupport: "仅供决策支持",
    dataInput: "数据",
    aiOutput: "AI 输出",
    copy: "复制",
    waiting: "等待输入...",
    processing: "处理中...",
    runAnalysis: "运行分析",
    uploadTitle: "点击上传",
    uploadSubtitle: "图片、报告或 PDF",
    uploadSupport: "支持 PNG, JPEG, PDF",
    tips: {
      [ModuleId.TRIAGE]: "上传实验室 PDF 或药瓶照片以提高准确性。",
      [ModuleId.DISCHARGE]: "拍摄清晰的医院信件照片。",
      [ModuleId.INTAKE]: "患者可以上传之前的临床信件。",
      [ModuleId.CAREGIVER]: "上传多张笔记和药盒照片。",
      [ModuleId.CHATBOT]: "询问复杂的医疗问题。",
      [ModuleId.LIVE]: "用于免提咨询。"
    },
    placeholders: {
      [ModuleId.TRIAGE]: "描述症状和病史...",
      [ModuleId.DISCHARGE]: "粘贴文本或附加说明...",
      [ModuleId.INTAKE]: "更多细节...",
      [ModuleId.CAREGIVER]: "输入护理笔记...",
      [ModuleId.CHATBOT]: "问一个问题...",
      [ModuleId.LIVE]: "开始说话..."
    },
    roles: {
      [Role.CLINICIAN]: "临床医生",
      [Role.PATIENT]: "患者",
      [Role.CAREGIVER]: "护理人员"
    },
    disclaimer: "医疗免责声明：本系统使用人工智能。它不是诊断工具。所有输出仅供参考。",
    live: {
        start: "开始对话",
        stop: "结束对话",
        listening: "聆听中...",
        speaking: "说话中...",
        error: "连接错误"
    }
  },
  German: {
    appTitle: "AEGIS",
    subtitle: "Multimodale klinische Intelligenz",
    role: "Rolle",
    language: "Sprache",
    modulesHeader: "Module",
    modules: {
      [ModuleId.TRIAGE]: { title: "KI-Triage", desc: "Symptomanalyse & Risiko" },
      [ModuleId.DISCHARGE]: { title: "Entlassungshelfer", desc: "Komplexe Dokumente übersetzen" },
      [ModuleId.INTAKE]: { title: "Notiz-Entwurf", desc: "SOAP-Notizen erstellen" },
      [ModuleId.CAREGIVER]: { title: "Pflege-Log", desc: "Zeitstrahl-Synthese" },
      [ModuleId.CHATBOT]: { title: "Medizinischer Chatbot", desc: "Chatten Sie mit Gemini 3.0 Pro" },
      [ModuleId.LIVE]: { title: "Sprachkonversation", desc: "Echtzeitgespräch mit Gemini 2.5" },
    },
    context: "Ansicht",
    decisionSupport: "Nur Entscheidungshilfe",
    dataInput: "Daten",
    aiOutput: "KI-Ausgabe",
    copy: "Kopieren",
    waiting: "Warte auf Eingabe...",
    processing: "Verarbeitung...",
    runAnalysis: "Analyse starten",
    uploadTitle: "Zum Hochladen klicken",
    uploadSubtitle: "Bilder, Berichte oder PDFs",
    uploadSupport: "Unterstützt PNG, JPEG, PDF",
    tips: {
      [ModuleId.TRIAGE]: "Laden Sie Labor-PDFs oder Fotos hoch.",
      [ModuleId.DISCHARGE]: "Machen Sie ein klares Foto des Arztbriefes.",
      [ModuleId.INTAKE]: "Patienten können frühere Briefe hochladen.",
      [ModuleId.CAREGIVER]: "Mehrere Fotos von Notizen hochladen.",
      [ModuleId.CHATBOT]: "Stellen Sie komplexe medizinische Fragen.",
      [ModuleId.LIVE]: "Für freihändige Beratung."
    },
    placeholders: {
      [ModuleId.TRIAGE]: "Symptome und Geschichte beschreiben...",
      [ModuleId.DISCHARGE]: "Text oder Notizen einfügen...",
      [ModuleId.INTAKE]: "Weitere Details...",
      [ModuleId.CAREGIVER]: "Pflegenotizen eingeben...",
      [ModuleId.CHATBOT]: "Eine Frage stellen...",
      [ModuleId.LIVE]: "Fangen Sie an zu sprechen..."
    },
    roles: {
      [Role.CLINICIAN]: "Arzt",
      [Role.PATIENT]: "Patient",
      [Role.CAREGIVER]: "Pfleger"
    },
    disclaimer: "MEDIZINISCHER HAFTUNGSAUSSCHLUSS: Dieses System nutzt KI. Es ist KEIN Diagnosewerkzeug.",
    live: {
        start: "Gespräch beginnen",
        stop: "Gespräch beenden",
        listening: "Zuhören...",
        speaking: "Sprechen...",
        error: "Verbindungsfehler"
    }
  },
  Italian: {
    appTitle: "AEGIS",
    subtitle: "Intelligenza Clinica Multimodale",
    role: "Ruolo",
    language: "Lingua",
    modulesHeader: "Moduli",
    modules: {
      [ModuleId.TRIAGE]: { title: "Triage IA", desc: "Analisi sintomi e rischi" },
      [ModuleId.DISCHARGE]: { title: "Semplifica Dimissioni", desc: "Tradurre documenti complessi" },
      [ModuleId.INTAKE]: { title: "Bozza Note", desc: "Generazione note SOAP" },
      [ModuleId.CAREGIVER]: { title: "Registro Caregiver", desc: "Sintesi temporale" },
      [ModuleId.CHATBOT]: { title: "Chatbot Medico", desc: "Chatta con Gemini 3.0 Pro" },
      [ModuleId.LIVE]: { title: "Conversazione Vocale", desc: "Parla in tempo reale con Gemini 2.5" },
    },
    context: "Vista",
    decisionSupport: "Solo Supporto Decisionale",
    dataInput: "Dati",
    aiOutput: "Output IA",
    copy: "Copia",
    waiting: "In attesa di input...",
    processing: "Elaborazione...",
    runAnalysis: "Avvia Analisi",
    uploadTitle: "Clicca per caricare",
    uploadSubtitle: "immagini, report o PDF",
    uploadSupport: "Supporta PNG, JPEG, PDF",
    tips: {
      [ModuleId.TRIAGE]: "Carica PDF di laboratorio o foto di farmaci.",
      [ModuleId.DISCHARGE]: "Fai una foto chiara della lettera.",
      [ModuleId.INTAKE]: "Caricare lettere cliniche precedenti.",
      [ModuleId.CAREGIVER]: "Carica più foto di note.",
      [ModuleId.CHATBOT]: "Poni domande mediche complesse.",
      [ModuleId.LIVE]: "Usa per consultazioni a mani libere."
    },
    placeholders: {
      [ModuleId.TRIAGE]: "Descrivi sintomi e storia...",
      [ModuleId.DISCHARGE]: "Incolla testo o note...",
      [ModuleId.INTAKE]: "Dettagli aggiuntivi...",
      [ModuleId.CAREGIVER]: "Inserisci note caregiver...",
      [ModuleId.CHATBOT]: "Fai una domanda...",
      [ModuleId.LIVE]: "Inizia a parlare..."
    },
    roles: {
      [Role.CLINICIAN]: "Clinico",
      [Role.PATIENT]: "Paziente",
      [Role.CAREGIVER]: "Caregiver"
    },
    disclaimer: "DISCLAIMER MEDICO: Questo sistema utilizza l'IA. NON è uno strumento diagnostico.",
    live: {
        start: "Inizia conversazione",
        stop: "Termina conversazione",
        listening: "Ascoltando...",
        speaking: "Parlando...",
        error: "Errore di connessione"
    }
  },
  Portuguese: {
    appTitle: "AEGIS",
    subtitle: "Inteligência Clínica Multimodal",
    role: "Papel",
    language: "Idioma",
    modulesHeader: "Módulos",
    modules: {
      [ModuleId.TRIAGE]: { title: "Triagem IA", desc: "Análise de sintomas e riscos" },
      [ModuleId.DISCHARGE]: { title: "Simplificador de Alta", desc: "Traduzir documentos complexos" },
      [ModuleId.INTAKE]: { title: "Rascunho de Notas", desc: "Geração de notas SOAP" },
      [ModuleId.CAREGIVER]: { title: "Registro de Cuidador", desc: "Síntese de linha do tempo" },
      [ModuleId.CHATBOT]: { title: "Chatbot Médico", desc: "Converse com Gemini 3.0 Pro" },
      [ModuleId.LIVE]: { title: "Conversa de Voz", desc: "Fale em tempo real com Gemini 2.5" },
    },
    context: "Visualização",
    decisionSupport: "Apenas Suporte à Decisão",
    dataInput: "Dados",
    aiOutput: "Saída da IA",
    copy: "Copiar",
    waiting: "Aguardando entrada...",
    processing: "Processando...",
    runAnalysis: "Executar Análise",
    uploadTitle: "Clique para enviar",
    uploadSubtitle: "imagens, relatórios ou PDFs",
    uploadSupport: "Suporta PNG, JPEG, PDF",
    tips: {
      [ModuleId.TRIAGE]: "Envie PDFs de laboratório ou fotos de medicamentos.",
      [ModuleId.DISCHARGE]: "Tire uma foto clara da carta hospitalar.",
      [ModuleId.INTAKE]: "Pacientes podem enviar cartas clínicas anteriores.",
      [ModuleId.CAREGIVER]: "Envie várias fotos de anotações.",
      [ModuleId.CHATBOT]: "Faça perguntas médicas complexas.",
      [ModuleId.LIVE]: "Use para consultas sem as mãos."
    },
    placeholders: {
      [ModuleId.TRIAGE]: "Descreva sintomas e histórico...",
      [ModuleId.DISCHARGE]: "Cole texto ou notas...",
      [ModuleId.INTAKE]: "Detalhes adicionais...",
      [ModuleId.CAREGIVER]: "Insira notas do cuidador...",
      [ModuleId.CHATBOT]: "Faça uma pergunta...",
      [ModuleId.LIVE]: "Comece a falar..."
    },
    roles: {
      [Role.CLINICIAN]: "Clínico",
      [Role.PATIENT]: "Paciente",
      [Role.CAREGIVER]: "Cuidador"
    },
    disclaimer: "AVISO MÉDICO: Este sistema usa IA. NÃO é uma ferramenta de diagnóstico.",
    live: {
        start: "Iniciar conversa",
        stop: "Terminar conversa",
        listening: "Ouvindo...",
        speaking: "Falando...",
        error: "Erro de conexão"
    }
  }
};