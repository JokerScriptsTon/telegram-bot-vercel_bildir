/**
 * Telegram API Wrapper
 * 
 * Telegram Bot API ile iletişim için fonksiyonlar
 */

import axios from 'axios';

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Telegram'a mesaj gönderir
 */
export async function sendMessage(chatId, text, parseMode = 'Markdown') {
    try {
        const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: parseMode
        });

        console.log('Message sent successfully');
        return response.data;

    } catch (error) {
        console.error('sendMessage error:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Inline keyboard ile mesaj gönderir
 */
export async function sendMessageWithKeyboard(chatId, text, keyboard, parseMode = 'Markdown') {
    try {
        const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: parseMode,
            reply_markup: keyboard
        });

        console.log('Message with keyboard sent successfully');
        return response.data;

    } catch (error) {
        console.error('sendMessageWithKeyboard error:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Webhook kurar
 */
export async function setWebhook(url) {
    try {
        const response = await axios.post(`${TELEGRAM_API}/setWebhook`, {
            url: url,
            drop_pending_updates: true
        });

        console.log('Webhook set:', response.data);
        return response.data;

    } catch (error) {
        console.error('setWebhook error:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Webhook bilgilerini alır
 */
export async function getWebhookInfo() {
    try {
        const response = await axios.get(`${TELEGRAM_API}/getWebhookInfo`);
        return response.data;
    } catch (error) {
        console.error('getWebhookInfo error:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Webhook'u siler
 */
export async function deleteWebhook() {
    try {
        const response = await axios.get(`${TELEGRAM_API}/deleteWebhook`);
        return response.data;
    } catch (error) {
        console.error('deleteWebhook error:', error.response?.data || error.message);
        return null;
    }
}
