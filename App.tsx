import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { generateViralCopy } from './services/geminiService';
import { parseGeminiOutput } from './utils/parser';
import { InputSection } from './components/InputSection';
import { ResultCard } from './components/ResultCard';
import { FooterCopy } from './components/FooterCopy';
import { EvolutionPanel } from './components/EvolutionPanel';
import { TrendAnalysis } from './components/TrendAnalysis';
import { EditingGuide } from './components/EditingGuide';
import { AuthModal } from './components/auth/AuthModal';
import { RechargeModal } from './components/auth/RechargeModal';
import { AppState, MediaData } from './types';
import { Zap, Globe, Flame, LogOut, Wallet } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [state, setState] = useState<AppState>({
    inputText: '',
    mediaData: null,
    isLoading: false,
    result: null,
    history: [],
    showFeedback: false,
  });

  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (token: string, userData: any) => {
    setUser(userData);
  };

  const handleRechargeSuccess = (newCredits: number) => {
    setUser((prev: any) => ({ ...prev, credits: newCredits }));
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    savedUser.credits = newCredits;
    localStorage.setItem('user', JSON.stringify(savedUser));
  };

  const handleGenerate = useCallback(async () => {
    if (!state.inputText.trim() && !state.mediaData) return;

    // 检查次数
    if (user && user.credits <= 0) {
      alert('使用次数不足，请充值！');
      setShowRechargeModal(true);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, result: null }));

    try {
      const rawText = await generateViralCopy(state.inputText, state.mediaData, state.history);
      const parsedResult = parseGeminiOutput(rawText);

      // 扣除次数
      if (user) {
        const newCredits = user.credits - 1;
        setUser((prev: any) => ({ ...prev, credits: newCredits }));
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        savedUser.credits = newCredits;
        localStorage.setItem('user', JSON.stringify(savedUser));
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        result: parsedResult,
        showFeedback: false
      }));
    } catch (error: any) {
      console.error("Generation error:", error);
      const errorMsg = error?.message || '未知错误';

      let userMessage = '算法连接失败。';
      if (errorMsg.includes('API key')) {
        userMessage = 'API密钥无效或已过期，请联系管理员。';
      } else if (errorMsg.includes('quota') || errorMsg.includes('limit')) {
        userMessage = 'API调用次数已达上限，请稍后再试。';
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('Failed to fetch')) {
        userMessage = '网络连接失败。如果您在中国大陆，可能需要使用VPN访问Google服务。';
      } else if (errorMsg.includes('CORS') || errorMsg.includes('blocked')) {
        userMessage = '跨域请求被阻止，请检查网络设置。';
      } else if (errorMsg.includes('model')) {
        userMessage = 'AI模型暂时不可用，请稍后再试。';
      } else {
        userMessage = `连接失败: ${errorMsg}`;
      }

      alert(userMessage);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.inputText, state.mediaData, state.history, user]);

  const handleFeedback = useCallback((feedback: string) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, feedback],
    }));
  }, []);

  const handleMediaUpload = useCallback((media: MediaData) => {
    setState(prev => ({ ...prev, mediaData: media }));
  }, []);

  const handleMediaClear = useCallback(() => {
    setState(prev => ({ ...prev, mediaData: null }));
  }, []);

  const handleInputChange = useCallback((val: string) => {
    setState(prev => ({ ...prev, inputText: val }));
  }, []);

  return (
    <div className="min-h-screen text-amber-50 pb-32 font-sans selection:bg-amber-500/30">
      
      {/* Festive Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#2a0404]/95 backdrop-blur-xl border-b border-amber-500/10 transition-all duration-300 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 group cursor-default">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-xl shadow-lg shadow-orange-900/50 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xs sm:text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400 leading-none">
                {t.appTitle}
              </h1>
              <span className="hidden sm:block text-[10px] text-amber-500/80 font-mono mt-1 tracking-[0.2em] uppercase">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             {user && (
               <>
                 <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
                   <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                   <span className="text-xs font-bold text-amber-300">{user.credits}</span>
                 </div>
                 <button
                   onClick={() => setShowRechargeModal(true)}
                   className="hidden sm:flex items-center gap-2 text-xs font-bold text-amber-500/60 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-full hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20"
                 >
                   <Wallet className="w-3.5 h-3.5" />
                   <span>充值</span>
                 </button>
                 <button
                   onClick={() => setShowRechargeModal(true)}
                   className="sm:hidden p-2 text-amber-500/60 hover:text-amber-300 transition-colors rounded-full hover:bg-amber-500/10"
                 >
                   <Wallet className="w-4 h-4" />
                 </button>
                 <button
                   onClick={handleLogout}
                   className="hidden sm:flex items-center gap-2 text-xs font-bold text-red-500/60 hover:text-red-300 transition-colors px-3 py-1.5 rounded-full hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                 >
                   <LogOut className="w-3.5 h-3.5" />
                   <span>退出</span>
                 </button>
                 <button
                   onClick={handleLogout}
                   className="sm:hidden p-2 text-red-500/60 hover:text-red-300 transition-colors rounded-full hover:bg-red-500/10"
                 >
                   <LogOut className="w-4 h-4" />
                 </button>
               </>
             )}
             <button
               onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
               className="hidden sm:flex items-center gap-2 text-xs font-bold text-amber-500/60 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-full hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20"
             >
               <Globe className="w-3.5 h-3.5" />
               <span className="uppercase tracking-wider">{language === 'zh' ? 'EN' : '中文'}</span>
             </button>
             <button
               onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
               className="sm:hidden p-2 text-amber-500/60 hover:text-amber-300 transition-colors rounded-full hover:bg-amber-500/10"
             >
               <Globe className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 md:pt-36">
        
        {/* Festive Hero Section */}
        <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto space-y-4 sm:space-y-6 relative">
           {/* Floating decorative elements */}
           <div className="absolute -top-20 -left-20 w-32 h-32 sm:w-40 sm:h-40 bg-amber-500/10 rounded-full blur-3xl animate-float"></div>
           <div className="absolute -top-10 -right-20 w-48 h-48 sm:w-60 sm:h-60 bg-red-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

           <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-red-950/50 to-amber-950/50 border border-red-800/50 text-red-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 sm:mb-6 shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-bounce-in backdrop-blur-sm">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="relative text-[9px] sm:text-xs">
                2026 Year of the Horse Special Edition
                <span className="absolute inset-0 animate-shimmer"></span>
              </span>
           </div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black gradient-text tracking-tight leading-tight drop-shadow-2xl animate-scale-in relative px-4">
            {t.heroTitle}
            <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 -z-10"></div>
          </h2>

          <p className="text-red-200/70 text-base sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium animate-fade-in-up stagger-1 relative z-10 px-4">
             {t.heroDesc}
          </p>

          {/* Animated stats */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-8 mt-6 sm:mt-8 animate-fade-in-up stagger-2 px-4">
            <div className="text-center glass rounded-xl px-4 sm:px-6 py-3 sm:py-4 hover-lift min-w-[90px] sm:min-w-0">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 animate-bounce-in">10K+</div>
              <div className="text-[10px] sm:text-xs text-red-200/60 mt-1">用户使用</div>
            </div>
            <div className="text-center glass rounded-xl px-4 sm:px-6 py-3 sm:py-4 hover-lift min-w-[90px] sm:min-w-0">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 animate-bounce-in stagger-1">98%</div>
              <div className="text-[10px] sm:text-xs text-red-200/60 mt-1">满意度</div>
            </div>
            <div className="text-center glass rounded-xl px-4 sm:px-6 py-3 sm:py-4 hover-lift min-w-[90px] sm:min-w-0">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 animate-bounce-in stagger-2">50M+</div>
              <div className="text-[10px] sm:text-xs text-red-200/60 mt-1">爆款生成</div>
            </div>
          </div>
        </div>

        {/* Input */}
        <InputSection
          value={state.inputText}
          mediaData={state.mediaData}
          onChange={handleInputChange}
          onMediaUpload={handleMediaUpload}
          onMediaClear={handleMediaClear}
          onSubmit={handleGenerate}
          isLoading={state.isLoading}
        />

        {/* Results */}
        {state.result && (
          <div className="animate-fade-in space-y-10 sm:space-y-16 mt-12 sm:mt-20">

            {/* Trend Analysis Section */}
            {state.result.trendAnalysis && (
              <TrendAnalysis
                analysisText={state.result.trendAnalysis}
                visualKeywords={state.result.visualKeywords}
              />
            )}

            {/* Grid for Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
              {state.result.options.map((option) => (
                <ResultCard key={option.id} option={option} />
              ))}
            </div>

            {/* Editing Guide */}
            {state.result.editingGuide && (
               <div className="px-4 sm:px-0">
                 <EditingGuide guide={state.result.editingGuide} />
               </div>
            )}

            {/* Emotional Copy Section + Tags */}
            {(state.result.footerCopy.length > 0 || state.result.tags.length > 0) && (
              <div className="px-4 sm:px-0">
                <FooterCopy
                  lines={state.result.footerCopy}
                  tags={state.result.tags}
                />
              </div>
            )}

            {/* Evolution Panel */}
            <div className="px-4 sm:px-0">
              <EvolutionPanel
                onFeedback={handleFeedback}
                evolutionLevel={state.history.length}
              />
            </div>

          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {}}
        onSuccess={handleAuthSuccess}
      />

      {/* Recharge Modal */}
      {user && (
        <RechargeModal
          isOpen={showRechargeModal}
          onClose={() => setShowRechargeModal(false)}
          currentCredits={user.credits}
          onSuccess={handleRechargeSuccess}
        />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;