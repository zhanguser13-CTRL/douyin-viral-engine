import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

/**
 * WARNING: This is a demo implementation using in-memory storage.
 *
 * CRITICAL ISSUES FOR PRODUCTION:
 * 1. Data is lost when the serverless function cold starts
 * 2. Each function instance has its own memory (no data sharing)
 * 3. SHA256 is not secure for password hashing (use bcrypt)
 *
 * FOR PRODUCTION, USE:
 * - A proper database (PostgreSQL, MongoDB, etc.)
 * - Vercel KV, Upstash Redis, or PlanetScale
 * - bcrypt or argon2 for password hashing
 * - JWT with proper secret management
 */

// 简单的内存存储（生产环境应使用数据库）
// WARNING: This data will be lost on server restart and is not shared between function instances
const users = new Map<string, {
  id: string;
  email: string;
  password: string;
  credits: number;
  createdAt: string;
}>();

// 简单的会话存储
const sessions = new Map<string, {
  userId: string;
  expiresAt: number;
}>();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, email, password } = req.body;

    if (action === 'register') {
      // 注册
      if (!email || !password) {
        return res.status(400).json({ error: '邮箱和密码不能为空' });
      }

      if (users.has(email)) {
        return res.status(400).json({ error: '该邮箱已被注册' });
      }

      const userId = crypto.randomUUID();
      const hashedPassword = hashPassword(password);

      users.set(email, {
        id: userId,
        email,
        password: hashedPassword,
        credits: 10, // 新用户赠送10次使用次数
        createdAt: new Date().toISOString()
      });

      const token = generateToken();
      sessions.set(token, {
        userId,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天
      });

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: userId,
          email,
          credits: 10
        }
      });

    } else if (action === 'login') {
      // 登录
      if (!email || !password) {
        return res.status(400).json({ error: '邮箱和密码不能为空' });
      }

      const user = users.get(email);
      if (!user) {
        return res.status(401).json({ error: '邮箱或密码错误' });
      }

      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        return res.status(401).json({ error: '邮箱或密码错误' });
      }

      const token = generateToken();
      sessions.set(token, {
        userId: user.id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          credits: user.credits
        }
      });

    } else if (action === 'verify') {
      // 验证token
      const { token } = req.body;
      const session = sessions.get(token);

      if (!session || session.expiresAt < Date.now()) {
        return res.status(401).json({ error: 'Token无效或已过期' });
      }

      const user = Array.from(users.values()).find(u => u.id === session.userId);
      if (!user) {
        return res.status(401).json({ error: '用户不存在' });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          credits: user.credits
        }
      });

    } else {
      return res.status(400).json({ error: '无效的操作' });
    }

  } catch (error: any) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: error.message || '服务器错误' });
  }
}
