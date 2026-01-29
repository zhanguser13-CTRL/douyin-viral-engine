import React, { useRef, useState } from 'react';
import { Loader2, Video, X, Sparkles, Plus, Clipboard } from 'lucide-react';
import { MediaData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface InputSectionProps {
  value: string;
  mediaData: MediaData | null;
  onChange: (val: string) => void;
  onMediaUpload: (media: MediaData) => void;
  onMediaClear: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = React.memo(({
  value,
  mediaData,
  onChange,
  onMediaUpload,
  onMediaClear,
  onSubmit,
  isLoading
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('video') !== -1) {
        const file = items[i].getAsFile();
        if (file) processFile(file);
      }
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onMediaUpload({
          mimeType: file.type,
          data: (e.target.result as string).split(',')[1]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative group z-10 animate-scale-in">
      {/* Animated Glow Background */}
      <div className="absolute -inset-2 bg-gradient-to-r from-amber-700 via-red-600 to-amber-700 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-gradient"></div>

      <div
        className={`relative glass rounded-2xl p-2 shadow-2xl overflow-hidden transition-all duration-300 ${
          isDragOver ? 'border-amber-400 bg-red-900/30 scale-105' : 'border-amber-500/30'
        }`}
        onPaste={handlePaste}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Animated corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl group-hover:border-amber-400/50 transition-colors"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl group-hover:border-amber-400/50 transition-colors"></div>

        <textarea
          className="w-full h-40 bg-transparent text-rose-50 placeholder-red-200/30 p-6 text-lg outline-none resize-none font-medium leading-relaxed transition-all duration-300 focus:placeholder-red-200/50"
          placeholder={t.inputPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
        />

        {/* Media Preview / Drag Overlay */}
        {isDragOver && (
           <div className="absolute inset-0 bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-amber-400 border-2 border-dashed border-amber-500/50 rounded-xl m-2">
              <Plus className="w-10 h-10 mb-2 animate-bounce" />
              <p className="font-bold tracking-widest uppercase">{t.dragDrop}</p>
           </div>
        )}

        {/* Media Attachment Indicator */}
        {mediaData && (
          <div className="absolute top-4 right-4 bg-red-900/80 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-fade-in shadow-lg shadow-red-950/50">
            <Video className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-100">{t.mediaAttached}</span>
            <button 
              onClick={onMediaClear}
              className="hover:bg-red-800 rounded p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-red-300" />
            </button>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex justify-between items-center px-6 pb-4 pt-2">
          <button 
             onClick={() => fileInputRef.current?.click()}
             className="flex items-center gap-2 text-amber-500/80 hover:text-amber-300 transition-colors text-sm font-bold uppercase tracking-wider"
             disabled={isLoading}
          >
             <Clipboard className="w-4 h-4" />
             {t.uploadBtn}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,video/*"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} 
          />

          <button
            onClick={onSubmit}
            disabled={isLoading || (!value.trim() && !mediaData)}
            className={`
              relative px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-2 overflow-hidden group/btn
              ${isLoading
                ? 'bg-red-900/50 text-red-400 cursor-not-allowed border border-red-800'
                : 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-amber-500/50 hover:border-amber-400 hover:scale-105 animate-glow-pulse'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.generatingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200 group-hover/btn:animate-bounce" />
                <span className="relative z-10">{t.generateBtn}</span>
                {/* Multiple shine effects */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});