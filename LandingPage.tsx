import React, { useState } from 'react';

/**
 * 融媒体级·爆款深度解析引擎 - 登录页面组件
 * 专为 30-50 岁女性用户打造的爆款内容分析工具
 */

// 内联样式定义
const styles: { [key: string]: React.CSSProperties } = {
  // 主容器 - 深红色渐变背景
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a0505 0%, #2d0a0a 50%, #1a0505 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  // 主卡片容器
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(42, 11, 11, 0.9)',
    borderRadius: '24px',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    padding: '48px 40px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  // Logo图标容器
  logoContainer: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
  },
  // 火焰图标
  flameIcon: {
    width: '32px',
    height: '32px',
    color: 'white',
  },
  // 主标题
  title: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#fef3c7',
    textAlign: 'center' as const,
    marginBottom: '12px',
    letterSpacing: '0.5px',
  },
  // 副标题
  subtitle: {
    fontSize: '14px',
    color: 'rgba(254, 205, 211, 0.7)',
    textAlign: 'center' as const,
    marginBottom: '32px',
    lineHeight: 1.6,
  },
};

const LandingPage: React.FC = () => {
  // 表单状态管理
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 登录处理函数
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('请填写邮箱和密码');
      return;
    }
    setIsLoading(true);
    // 模拟登录请求
    setTimeout(() => {
      setIsLoading(false);
      alert(`登录成功！欢迎 ${email}`);
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo 图标 */}
        <div style={styles.logoContainer}>
          <svg style={styles.flameIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.5 1.5-4.5 3-6.5s3-4.5 3-7.5c0 3 1.5 5.5 3 7.5s3 4 3 6.5c0 3.866-3.134 7-7 7z"/>
            <path d="M12 23c-2.21 0-4-1.79-4-4 0-1.5.9-2.7 1.8-3.9.9-1.2 1.8-2.7 1.8-4.5 0 1.8.9 3.3 1.8 4.5.9 1.2 1.8 2.4 1.8 3.9 0 2.21-1.79 4-4 4z" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>

        {/* 主标题 */}
        <h1 style={styles.title}>融媒体级·爆款深度解析引擎</h1>

        {/* 副标题 */}
        <p style={styles.subtitle}>
          专为 30-50 岁女性用户打造<br/>
          AI驱动的爆款内容生成与分析平台
        </p>

        {/* 数据统计 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          marginBottom: '36px',
          paddingBottom: '28px',
          borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
        }}>
          {[
            { value: '10K+', label: '活跃用户' },
            { value: '98%', label: '满意度' },
            { value: '50M+', label: '内容生成' },
          ].map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#f59e0b',
                marginBottom: '4px',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'rgba(254, 205, 211, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleLogin}>
          {/* 邮箱输入框 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(245, 158, 11, 0.7)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              邮箱地址
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的邮箱"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '12px',
                color: '#fef3c7',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(245, 158, 11, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* 密码输入框 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(245, 158, 11, 0.7)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入您的密码"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '12px',
                color: '#fef3c7',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(245, 158, 11, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading
                ? 'rgba(245, 158, 11, 0.3)'
                : isHovered
                  ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                  : 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isHovered && !isLoading
                ? '0 10px 30px rgba(245, 158, 11, 0.4)'
                : '0 4px 15px rgba(245, 158, 11, 0.2)',
              transform: isHovered && !isLoading ? 'translateY(-2px)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isLoading ? (
              <>
                <svg
                  style={{
                    width: '20px',
                    height: '20px',
                    animation: 'spin 1s linear infinite'
                  }}
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="31.4 31.4"
                    strokeLinecap="round"
                  />
                </svg>
                登录中...
              </>
            ) : (
              <>
                <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                立即登录
              </>
            )}
          </button>
        </form>

        {/* 底部链接 */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '13px',
          color: 'rgba(254, 205, 211, 0.5)',
        }}>
          还没有账号？
          <a
            href="#"
            style={{
              color: '#f59e0b',
              textDecoration: 'none',
              marginLeft: '4px',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            立即注册
          </a>
        </div>
      </div>

      {/* 页脚 */}
      <div style={{
        marginTop: '32px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'rgba(254, 205, 211, 0.3)',
      }}>
        © 2026 爆款引擎 · Powered by AI
      </div>

      {/* 全局动画样式 */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(254, 205, 211, 0.3);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
