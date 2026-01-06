import React, { useRef, useState } from 'react';
import { FileAttachment } from '../types';

interface FileUploaderProps {
  onFilesSelected: (files: FileAttachment[]) => void;
  attachments: FileAttachment[];
  onRemove: (index: number) => void;
  labels: {
    title: string;
    subtitle: string;
    support: string;
  };
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, attachments, onRemove, labels }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await processFiles(e.target.files);
  };

  const processFiles = async (fileList: FileList) => {
    const newAttachments: FileAttachment[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const base64 = await fileToBase64(file);
      newAttachments.push({ file, base64, mimeType: file.type, previewUrl: URL.createObjectURL(file) });
    }
    onFilesSelected(newAttachments);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => { setIsDragging(false); };
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) await processFiles(e.dataTransfer.files);
  };

  return (
    <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div 
        className={`relative border border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 ease-out group
          ${isDragging 
            ? 'border-ios-blue bg-blue-50/50 dark:bg-blue-900/10 scale-[1.02] shadow-xl shadow-blue-500/10' 
            : 'border-slate-300 dark:border-slate-700 hover:border-ios-blue hover:bg-slate-50/80 dark:hover:bg-slate-800/50 hover:shadow-lg'
          }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      >
        <input type="file" multiple accept="image/*,application/pdf" className="hidden" ref={inputRef} onChange={handleFileChange} />
        
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`
                w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500
                ${isDragging ? 'bg-ios-blue text-white scale-110 rotate-12' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-ios-blue group-hover:text-white group-hover:scale-110 group-hover:-rotate-6'}
            `}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                <span className="text-ios-blue font-semibold hover:underline">{labels.title}</span> {labels.subtitle}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{labels.support}</p>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4 animate-scale-in">
          {attachments.map((att, idx) => (
            <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800 transition-transform hover:scale-105">
              {att.mimeType.startsWith('image/') ? (
                <img src={att.previewUrl} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-1">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PDF</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                    className="p-2 bg-white/90 text-red-500 rounded-full transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-white"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};