import React, { useState } from 'react';
import { Database, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface EvolutionPanelProps {
  onFeedback: (feedback: string) => void;
  evolutionLevel: number;
}

export const EvolutionPanel: React.FC<EvolutionPanelProps> = ({ onFeedback, evolutionLevel }) => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = () => {
    if (!input.trim()) return;
    setStatus('submitting');
    setTimeout(() => {
      onFeedback(input);
      setStatus('success');
      setInput('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 800);
  };

  return (
    <div className="mt-12 sm:mt-20 border-t border-amber-500/10 pt-8 sm:pt-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="space-y-1.5 sm:space-y-2 max-w-md">
               <h3 className="text-amber-50 font-bold text-base sm:text-lg flex items-center gap-2">
                 <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                 {t.evolutionTitle}
                 <span className="text-[9px] sm:text-[10px] text-amber-400 bg-red-950/50 border border-amber-500/20 px-1.5 sm:px-2 py-0.5 rounded font-mono">v4.0</span>
               </h3>
               <p className="text-red-200/50 text-xs sm:text-sm leading-relaxed">
                  {t.evolutionDesc}
               </p>
            </div>

            <div className="flex-1 w-full relative group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Feedback..."
                    className="w-full bg-red-950/30 border border-amber-900/50 rounded-full py-2.5 sm:py-3 pl-4 sm:pl-6 pr-28 sm:pr-36 text-xs sm:text-sm text-amber-100 focus:border-amber-500/50 outline-none transition-colors placeholder-red-900/50"
                />
                <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || status !== 'idle'}
                    className="absolute right-1 sm:right-1.5 top-1 sm:top-1.5 bottom-1 sm:bottom-1.5 px-3 sm:px-4 bg-amber-700/80 hover:bg-amber-600 text-white rounded-full text-[10px] sm:text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2 border border-amber-500/20"
                >
                    {status === 'submitting' ? (
                       <span>{t.calibrating}</span>
                    ) : status === 'success' ? (
                       <span className="text-emerald-300">{t.success}</span>
                    ) : (
                       <>
                         <span>{t.submitEvolution}</span>
                         <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                       </>
                    )}
                </button>
            </div>

            <div className="hidden md:block text-right">
               <div className="text-[9px] sm:text-[10px] text-amber-500/50 font-bold uppercase tracking-wider mb-1">{t.evolutionLevel}</div>
               <div className="flex gap-1 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < evolutionLevel ? 'bg-amber-500' : 'bg-red-950'}`}></div>
                  ))}
               </div>
            </div>
        </div>
    </div>
  );
};