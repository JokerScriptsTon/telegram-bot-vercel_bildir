/**
 * Komut Handler'ları
 * 
 * Telegram bot komutlarını işler
 */

import { sendMessage } from './telegram.js';
import { saveUser, logMessage } from './sheets.js';

/**
 * Telegram update'ini işler
 */
export async function handleUpdate(update) {
    if (!update.message) return;

    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text || '';
    const user = message.from;

    console.log(`Processing message from user ${user.id}: ${text}`);

    // Kullanıcıyı kaydet
    await saveUser(user);

    // Komut kontrolü
    if (text.startsWith('/')) {
        await handleCommand(chatId, text, user);
    } else {
        await handleTextMessage(chatId, text, user);
    }
}

/**
 * Komutları ilgili handler'a yönlendirir
 */
async function handleCommand(chatId, text, user) {
    const command = text.split(' ')[0].toLowerCase();

    switch (command) {
        case '/start':
            await handleStart(chatId, user);
            break;

        case '/star':
            await handleStar(chatId, user);
            break;

        default:
            await handleUnknown(chatId, user, text);
            break;
    }
}

/**
 * /start komutu
 */
async function handleStart(chatId, user) {
    const message = `🤖 *Uygulama başlatıldı!*

Hoş geldiniz ${user.first_name}! Bot aktif ve hazır.

*Kullanılabilir komutlar:*
/start - Botu başlat
/star - Özel mesaj`;

    await sendMessage(chatId, message);

    const username = user.username || user.first_name;
    await logMessage(user.id, username, '/start', 'Uygulama başlatıldı');
}

/**
 * /star komutu
 */
async function handleStar(chatId, user) {
    const message = `⭐ *Özel mesaj!*

Merhaba ${user.first_name}!

Bu komut gelecekte özelleştirilecek.`;

    await sendMessage(chatId, message);

    const username = user.username || user.first_name;
    await logMessage(user.id, username, '/star', 'Özel mesaj');
}

/**
 * Bilinmeyen komut
 */
async function handleUnknown(chatId, user, text) {
    const message = `❓ *Bilinmeyen komut.*

Kullanılabilir komutlar için /start yazın.`;

    await sendMessage(chatId, message);

    const username = user.username || user.first_name;
    await logMessage(user.id, username, text, 'Bilinmeyen komut');
}

/**
 * Normal metin mesajı
 */
async function handleTextMessage(chatId, text, user) {
    const message = `💬 Mesajınız alındı!

Komutlar için /start yazın.`;

    await sendMessage(chatId, message);

    const username = user.username || user.first_name;
    await logMessage(user.id, username, text, 'Mesaj alındı');
}
