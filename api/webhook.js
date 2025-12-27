/**
 * Vercel Serverless Function - Telegram Webhook Handler
 * 
 * Bu dosya Telegram'dan gelen webhook isteklerini yakalar
 * URL: https://YOUR_VERCEL_URL/api/webhook
 */

import { handleUpdate } from '../lib/commands.js';

export default async function handler(req, res) {
  // GET isteği - Bot durumunu kontrol et
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Telegram Bot is running on Vercel!' 
    });
  }

  // Sadece POST isteklerini işle
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = req.body;
    
    console.log('Received update:', JSON.stringify(update));
    
    // Telegram update'ini işle
    await handleUpdate(update);
    
    // Telegram'a 200 OK dön (önemli!)
    return res.status(200).json({ ok: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    
    // Hata olsa bile 200 dön (Telegram tekrar denemesin)
    return res.status(200).json({ ok: true });
  }
}
