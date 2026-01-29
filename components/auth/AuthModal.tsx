import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-[#2a0b0b] to-[#1a0505] rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-red-900/50 animate-fade-in-up">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-amber-500/60 hover:text-amber-300 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 sm:pb-6 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/50">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400">
            {isLogin ? '欢迎回来' : '创建账号'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-red-200/60">
            {isLogin ? '登录以继续使用爆款引擎' : '注册即送10次免费使用'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-bold text-amber-500/80 mb-2">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2" />
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-amber-500/30 rounded-lg text-sm sm:text-base text-amber-50 placeholder-red-200/30 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-amber-500/80 mb-2">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2" />
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-amber-500/30 rounded-lg text-sm sm:text-base text-amber-50 placeholder-red-200/30 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-black text-sm sm:text-base rounded-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs sm:text-sm text-amber-500/60 hover:text-amber-300 transition-colors"
            >
              {isLogin ? '还没有账号？立即注册' : '已有账号？立即登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
