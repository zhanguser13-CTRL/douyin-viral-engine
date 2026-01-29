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
    <div className="min-h-screen text-amber-50 font-sans selection:bg-amber-500/30">

      {/* Clean Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a0505]/90 backdrop-blur-md border-b border-amber-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm sm:text-base font-bold text-amber-50">{t.appTitle}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
             {user && (
               <>
                 <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                   <Zap className="w-3.5 h-3.5 text-amber-400" />
                   <span className="text-xs font-semibold text-amber-300">{user.credits}</span>
                 </div>
                 <button
                   onClick={() => setShowRechargeModal(true)}
                   className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-amber-400/70 hover:text-amber-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10"
                 >
                   <Wallet className="w-3.5 h-3.5" />
                   <span>充值</span>
                 </button>
                 <button
                   onClick={() => setShowRechargeModal(true)}
                   className="sm:hidden p-1.5 text-amber-400/70 hover:text-amber-300 rounded-lg hover:bg-amber-500/10"
                 >
                   <Wallet className="w-4 h-4" />
                 </button>
                 <button
                   onClick={handleLogout}
                   className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-red-400/70 hover:text-red-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-500/10"
                 >
                   <LogOut className="w-3.5 h-3.5" />
                   <span>退出</span>
                 </button>
                 <button
                   onClick={handleLogout}
                   className="sm:hidden p-1.5 text-red-400/70 hover:text-red-300 rounded-lg hover:bg-red-500/10"
                 >
                   <LogOut className="w-4 h-4" />
                 </button>
               </>
             )}
             <button
               onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
               className="p-1.5 text-amber-400/70 hover:text-amber-300 rounded-lg hover:bg-amber-500/10 transition-colors"
             >
               <Globe className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">

        {/* Clean Hero Section */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>AI 驱动的爆款内容生成器</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-50 mb-4 sm:mb-6 leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-red-200/60 text-base sm:text-lg max-w-xl mx-auto mb-8">
            {t.heroDesc}
          </p>

          {/* Minimal Stats */}
          <div className="flex justify-center gap-8 sm:gap-12 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-amber-400">10K+</div>
              <div className="text-xs text-red-200/50 mt-0.5">用户</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-amber-400">98%</div>
              <div className="text-xs text-red-200/50 mt-0.5">满意度</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-amber-400">50M+</div>
              <div className="text-xs text-red-200/50 mt-0.5">生成</div>
            </div>
          </div>
        </div>

        {/* Input Section */}
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
          <div className="mt-16 sm:mt-20 space-y-12 sm:space-y-16">

            {/* Section Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px bg-amber-900/30 flex-1"></div>
              <span className="text-xs font-medium text-amber-500/60 uppercase tracking-wider">生成结果</span>
              <div className="h-px bg-amber-900/30 flex-1"></div>
            </div>

            {/* Trend Analysis */}
            {state.result.trendAnalysis && (
              <TrendAnalysis
                analysisText={state.result.trendAnalysis}
                visualKeywords={state.result.visualKeywords}
              />
            )}

            {/* Title Options Grid */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-amber-50 mb-6">标题方案</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {state.result.options.map((option) => (
                  <ResultCard key={option.id} option={option} />
                ))}
              </div>
            </section>

            {/* Editing Guide */}
            {state.result.editingGuide && (
              <section>
                <EditingGuide guide={state.result.editingGuide} />
              </section>
            )}

            {/* Footer Copy & Tags */}
            {(state.result.footerCopy.length > 0 || state.result.tags.length > 0) && (
              <section>
                <FooterCopy
                  lines={state.result.footerCopy}
                  tags={state.result.tags}
                />
              </section>
            )}

            {/* Evolution Panel */}
            <section>
              <EvolutionPanel
                onFeedback={handleFeedback}
                evolutionLevel={state.history.length}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-900/20 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-red-200/40">
            © 2026 爆款引擎 · Powered by AI
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {}}
        onSuccess={handleAuthSuccess}
      />

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