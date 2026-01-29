import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * WARNING: This is a demo implementation.
 *
 * CRITICAL ISSUES:
 * 1. These Maps are separate instances from auth.ts - they don't share data!
 * 2. No actual payment processing - just simulates adding credits
 * 3. Data is lost on server restart
 *
 * FOR PRODUCTION:
 * - Use a shared database for user data
 * - Integrate with a real payment provider (Stripe, Alipay, WeChat Pay)
 * - Implement proper payment verification webhooks
 */

// WARNING: These Maps are NOT shared with auth.ts!
// In production, use a database to share user data between API endpoints
const users = new Map<string, {
  id: string;
  email: string;
  password: string;
  credits: number;
  createdAt: string;
}>();

const sessions = new Map<string, {
  userId: string;
  expiresAt: number;
}>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '未登录' });
    }

    const session = sessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
      return res.status(401).json({ error: 'Token无效或已过期' });
    }

    const user = Array.from(users.values()).find(u => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '充值金额无效' });
    }

    // 充值套餐
    const packages: { [key: number]: number } = {
      10: 100,   // 10元 = 100次
      30: 350,   // 30元 = 350次
      50: 600,   // 50元 = 600次
      100: 1300  // 100元 = 1300次
    };

    const credits = packages[amount];
    if (!credits) {
      return res.status(400).json({ error: '无效的充值套餐' });
    }

    // 模拟支付成功，增加积分
    user.credits += credits;

    return res.status(200).json({
      success: true,
      credits: user.credits,
      message: `充值成功！获得 ${credits} 次使用次数`
    });

  } catch (error: any) {
    console.error('Recharge error:', error);
    return res.status(500).json({ error: error.message || '服务器错误' });
  }
}
