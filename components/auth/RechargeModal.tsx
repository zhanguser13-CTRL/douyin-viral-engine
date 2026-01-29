import React, { useState } from 'react';
import { X, Zap, Check, CreditCard } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  onSuccess: (newCredits: number) => void;
}

const packages = [
  { amount: 10, credits: 100, popular: false },
  { amount: 30, credits: 350, popular: true },
  { amount: 50, credits: 600, popular: false },
  { amount: 100, credits: 1300, popular: false },
];

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  currentCredits,
  onSuccess
}) => {
  const [selectedAmount, setSelectedAmount] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRecharge = async () => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: selectedAmount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '充值失败');
      }

      onSuccess(data.credits);
      alert(data.message);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="relative w-full max-w-2xl mx-auto bg-gradient-to-br from-[#2a0b0b] to-[#1a0505] rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-red-900/50 animate-fade-in-up">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-amber-500/60 hover:text-amber-300 transition-colors z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 sm:pb-6 text-center border-b border-amber-500/10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/50">
            <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400">
            充值使用次数
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-red-200/60">
            当前剩余：<span className="text-amber-400 font-bold">{currentCredits}</span> 次
          </p>
        </div>

        {/* Packages */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {packages.map((pkg) => (
              <button
                key={pkg.amount}
                onClick={() => setSelectedAmount(pkg.amount)}
                className={`relative p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${
                  selectedAmount === pkg.amount
                    ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'border-amber-500/20 bg-black/20 hover:border-amber-500/40'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-amber-600 to-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full">
                    最受欢迎
                  </div>
                )}

                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-1 sm:mb-2">
                    ¥{pkg.amount}
                  </div>
                  <div className="text-xs sm:text-sm text-red-200/60 mb-2 sm:mb-3">
                    {pkg.credits} 次使用
                  </div>
                  <div className="text-[10px] sm:text-xs text-amber-500/80">
                    ¥{(pkg.amount / pkg.credits).toFixed(2)}/次
                  </div>
                </div>

                {selectedAmount === pkg.amount && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Payment Button */}
          <button
            onClick={handleRecharge}
            disabled={loading}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-black text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            {loading ? '处理中...' : `支付 ¥${selectedAmount}`}
          </button>

          <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-center text-red-200/40">
            * 这是演示版本，实际不会扣费
          </p>
        </div>
      </div>
    </div>
  );
};
