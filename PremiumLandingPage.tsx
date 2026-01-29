import React, { useState } from 'react';
import { Flame, Sparkles, TrendingUp, Zap, Shield, Users, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';

/**
 * 🏆 Awwwards 级别 - 融媒体级·爆款深度解析引擎
 * 专为 30-50 岁女性用户打造的高端 SaaS 落地页
 */

// ============================================
// 子组件：浮动装饰元素
// ============================================
const FloatingOrbs: React.FC = () => (
  <>
    {/* 左上角大光球 */}
    <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse" />

    {/* 右下角光球 */}
    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-red-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />

    {/* 中间小光点 */}
    <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
  </>
);

// ============================================
// 子组件：特性卡片
// ============================================
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = '0s' }) => (
  <div
    className="group relative bg-gradient-to-br from-[#2a0b0b]/80 to-[#1a0505]/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 hover:border-amber-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
    style={{ animationDelay: delay }}
  >
    {/* 悬停光效 */}
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

    <div className="relative z-10">
      {/* 图标容器 */}
      <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <div className="text-amber-400 group-hover:text-amber-300 transition-colors">
          {icon}
        </div>
      </div>

      {/* 标题 */}
      <h3 className="text-amber-50 font-bold text-lg mb-2 group-hover:text-amber-100 transition-colors">
        {title}
      </h3>

      {/* 描述 */}
      <p className="text-rose-200/60 text-sm leading-relaxed group-hover:text-rose-200/80 transition-colors">
        {description}
      </p>
    </div>
  </div>
);

// ============================================
// 子组件：统计数据卡片
// ============================================
interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => (
  <div className="relative group">
    {/* 背景光晕 */}
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative bg-gradient-to-br from-[#2a0b0b]/90 to-[#1a0505]/70 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 hover:border-amber-400/60 transition-all duration-300">
      {/* 图标 */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-amber-400/60 group-hover:text-amber-400 transition-colors">
          {icon}
        </div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      </div>

      {/* 数值 */}
      <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 mb-1">
        {value}
      </div>

      {/* 标签 */}
      <div className="text-xs text-rose-200/50 uppercase tracking-wider font-semibold">
        {label}
      </div>
    </div>
  </div>
);

// ============================================
// 主组件：Premium Landing Page
// ============================================
interface PremiumLandingPageProps {
  onSuccess: (token: string, user: any) => void;
}

const PremiumLandingPage: React.FC<PremiumLandingPageProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('请填写完整信息');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '操作失败');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0202] via-[#1a0505] to-[#0a0202] relative overflow-hidden">

      {/* ============================================ */}
      {/* 背景装饰层 */}
      {/* ============================================ */}
      <FloatingOrbs />

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* ============================================ */}
      {/* 顶部导航栏 */}
      {/* ============================================ */}
      <nav className="relative z-50 border-b border-amber-500/10 backdrop-blur-xl bg-[#1a0505]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all duration-300 group-hover:scale-110">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-amber-50 font-black text-lg tracking-tight group-hover:text-amber-100 transition-colors">
              爆款引擎
            </span>
          </div>

          {/* 右侧按钮 */}
          <div className="flex items-center gap-4">
            <button className="text-sm text-rose-200/60 hover:text-amber-400 transition-colors font-medium">
              产品介绍
            </button>
            <button className="text-sm text-rose-200/60 hover:text-amber-400 transition-colors font-medium">
              定价方案
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105">
              免费试用
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* 主内容区域 */}
      {/* ============================================ */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ============================================ */}
          {/* 左侧：品牌展示区 */}
          {/* ============================================ */}
          <div className="space-y-8 animate-fade-in">

            {/* 标签徽章 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                AI 驱动 · 数据赋能
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>

            {/* 主标题 */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 drop-shadow-2xl">
                  融媒体级
                </span>
                <br />
                <span className="text-amber-50">
                  爆款深度解析引擎
                </span>
              </h1>

              {/* 副标题 */}
              <p className="text-xl text-rose-200/70 leading-relaxed max-w-xl">
                专为 <span className="text-amber-400 font-bold">30-50 岁女性用户</span> 打造的智能内容分析平台
                <br />
                <span className="text-rose-200/50 text-base">
                  让每一条内容都成为爆款，让每一次创作都充满价值
                </span>
              </p>
            </div>

            {/* 统计数据网格 */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <StatCard
                value="10K+"
                label="活跃用户"
                icon={<Users className="w-5 h-5" />}
              />
              <StatCard
                value="98%"
                label="满意度"
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <StatCard
                value="50M+"
                label="内容生成"
                icon={<Zap className="w-5 h-5" />}
              />
            </div>

            {/* 特性列表 */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="数据安全"
                description="企业级加密，保护您的每一份创作"
                delay="0s"
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                title="AI 智能"
                description="深度学习算法，精准预测爆款趋势"
                delay="0.1s"
              />
            </div>

            {/* 信任标识 */}
            <div className="flex items-center gap-6 pt-4 border-t border-amber-500/10">
              <div className="flex items-center gap-2 text-rose-200/50 text-sm">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>ISO 27001 认证</span>
              </div>
              <div className="flex items-center gap-2 text-rose-200/50 text-sm">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>99.9% 可用性</span>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* 右侧：登录表单卡片 */}
          {/* ============================================ */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            {/* 卡片背景光晕 */}
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/5 rounded-3xl blur-2xl opacity-50" />

            {/* 主卡片 */}
            <div className="relative bg-gradient-to-br from-[#2a0b0b]/95 to-[#1a0505]/90 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-10 shadow-2xl">

              {/* 装饰性顶部边框 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full" />

              {/* 表单头部 */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg shadow-amber-500/50">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-amber-50 mb-2">
                  {isLogin ? '欢迎回来' : '创建账号'}
                </h2>
                <p className="text-rose-200/60 text-sm">
                  {isLogin ? '登录您的账户，继续创作之旅' : '注册即送10次免费使用'}
                </p>
              </div>

              {/* 登录表单 */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* 错误提示 */}
                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* 邮箱输入框 */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-amber-400/80 uppercase tracking-wider">
                    邮箱地址
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl blur-sm transition-opacity duration-300 ${focusedInput === 'email' ? 'opacity-100' : 'opacity-0'}`} />
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-5 h-5 text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-4 bg-black/30 border border-amber-500/20 rounded-xl text-amber-50 placeholder-rose-200/30 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* 密码输入框 */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-amber-400/80 uppercase tracking-wider">
                    密码
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl blur-sm transition-opacity duration-300 ${focusedInput === 'password' ? 'opacity-100' : 'opacity-0'}`} />
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 w-5 h-5 text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-black/30 border border-amber-500/20 rounded-xl text-amber-50 placeholder-rose-200/30 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-amber-400/60 hover:text-amber-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 记住我 & 忘记密码 */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-amber-500/30 bg-black/30 text-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    <span className="text-rose-200/60 group-hover:text-rose-200/80 transition-colors">
                      记住我
                    </span>
                  </label>
                  <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                    忘记密码？
                  </a>
                </div>

                {/* 登录按钮 */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-[1.02]"
                >
                  {/* 按钮光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isLogin ? '登录中...' : '注册中...'}
                      </>
                    ) : (
                      <>
                        {isLogin ? '立即登录' : '立即注册'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                {/* 分隔线 */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-500/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-xs text-rose-200/40 bg-[#2a0b0b]">
                      或使用以下方式登录
                    </span>
                  </div>
                </div>

                {/* 第三方登录 */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 bg-black/30 border border-amber-500/20 rounded-xl text-rose-200/70 hover:border-amber-500/40 hover:text-amber-50 transition-all duration-300 group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    <span className="text-sm font-medium">GitHub</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 bg-black/30 border border-amber-500/20 rounded-xl text-rose-200/70 hover:border-amber-500/40 hover:text-amber-50 transition-all duration-300 group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm font-medium">Google</span>
                  </button>
                </div>
              </form>

              {/* 注册/登录切换链接 */}
              <div className="mt-6 text-center text-sm text-rose-200/60">
                {isLogin ? '还没有账号？' : '已有账号？'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="ml-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  {isLogin ? '立即注册' : '立即登录'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================ */}
      {/* 底部装饰 */}
      {/* ============================================ */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      {/* 页脚 */}
      <footer className="relative z-10 border-t border-amber-500/10 backdrop-blur-xl bg-[#1a0505]/50 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-rose-200/40 text-sm">
            © 2026 爆款引擎 · Powered by AI ·
            <span className="text-amber-400/60 ml-2">让每一次创作都充满价值</span>
          </p>
        </div>
      </footer>

      {/* ============================================ */}
      {/* 全局动画样式 */}
      {/* ============================================ */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PremiumLandingPage;
