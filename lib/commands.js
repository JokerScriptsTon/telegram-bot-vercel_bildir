/**
 * Komut Handler'ları
 * 
 * Telegram bot komutlarını işler
 */

import { sendMessage, sendMessageWithKeyboard } from './telegram.js';
import { saveUser } from './sheets.js';
import { searchTeam, getTeamIdByName } from './football-api.js';
import { searchTeamSportsDB, getTeamLogo } from './sportsdb-api.js';
import { addTeam, removeTeam, getUserTeams } from './user-teams.js';

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
    const parts = text.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (command) {
        case '/start':
            await handleStart(chatId, user);
            break;

        case '/help':
        case '/yardim':
            await handleHelp(chatId, user);
            break;

        case '/ayarlar':
        case '/settings':
            await handleSettings(chatId, user);
            break;

        case '/takimekle':
            await handleAddTeam(chatId, user, args);
            break;

        case '/takimsil':
            await handleRemoveTeam(chatId, user, args);
            break;

        case '/takimlarim':
            await handleMyTeams(chatId, user);
            break;

        case '/takimara':
            await handleSearchTeam(chatId, user, args);
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
    const webAppUrl = 'https://telegram-bot-vercel-bildir.vercel.app/webapp.html';

    const keyboard = {
        inline_keyboard: [[
            {
                text: '⚽ Takım Yönetimi',
                web_app: { url: webAppUrl }
            }
        ]]
    };

    const message = `⚽ *Futbol Bildirim Botu*

Hoş geldin ${user.first_name}! 

Favori takımlarını ekle, maç bildirimleri al!

*📱 Takım Yönetimi (Web App):*
Aşağıdaki butona tıklayarak:
• 🔍 Takım ara ve ekle
• 📋 Favorilerini yönet
• 🔔 Bildirim ayarları
• 📊 Geçmiş maçlar
• ⚡ Hızlı ve kolay arayüz

*💬 Komutlar:*
/takimekle [takım] - Takım takip et
/takimsil [takım] - Takımı çıkar
/takimlarim - Takımlarını gör
/takimara [arama] - Takım ara
/ayarlar - Ayarlar menüsü
/help - Yardım

Başlamak için butona tıkla! 👇`;

    await sendMessageWithKeyboard(chatId, message, keyboard);
    // Log removed for optimization
}

/**
 * /help komutu
 */
async function handleHelp(chatId, user) {
    const message = `📖 *Yardım Menüsü*

*Takım Ekleme:*
\`\`\`/takimekle Beşiktaş\`\`\`
\`\`\`/takimekle Fenerbahçe\`\`\`

*Takım Çıkarma:*
\`\`\`/takimsil Beşiktaş\`\`\`

*Takımlarını Görme:*
\`\`\`/takimlarim\`\`\`

*Takım Arama:*
\`\`\`/takimara Galatasaray\`\`\`

*🔔 Bildirimler:*
Takımlarının maçları için:
• Maç başlangıç (15 dk önce)
• Goller ⚽
• Kartlar 🟨🟥
• Maç sonu

Sorularınız için: @destek`;

    await sendMessage(chatId, message);
    // Log removed for optimization
}

/**
 * /ayarlar komutu
 */
async function handleSettings(chatId, user) {
    const webAppUrl = 'https://telegram-bot-vercel-bildir.vercel.app/webapp.html';

    const keyboard = {
        inline_keyboard: [[
            {
                text: '🔧 Takım Ayarları',
                web_app: { url: webAppUrl }
            }
        ]]
    };

    const message = `⚙️ *Ayarlar*

Takımlarını kolayca yönetmek için butona tıkla!

Web arayüzünde:
• 🔍 Takım ara
• ➕ Takım ekle/çıkar
• 🔔 Bildirim ayarları
• ⚡ Hızlı ve kolay`;

    await sendMessageWithKeyboard(chatId, message, keyboard);
    // Log removed for optimization
}

/**
 * /takimekle komutu
 */
async function handleAddTeam(chatId, user, teamName) {
    if (!teamName) {
        await sendMessage(chatId, '❌ Takım adı belirtmelisiniz!\n\nÖrnek: /takimekle Beşiktaş');
        return;
    }

    // Önce bilinen takımlardan kontrol et
    let teamId = getTeamIdByName(teamName);
    let finalTeamName = teamName;

    if (!teamId) {
        // API'den ara
        const teams = await searchTeam(teamName);

        if (teams.length === 0) {
            await sendMessage(chatId, `❌ "${teamName}" takımı bulunamadı!\n\n/takimara ${teamName} ile arama yapabilirsiniz.`);
            return;
        }

        // İlk sonucu al
        teamId = teams[0].team.id;
        finalTeamName = teams[0].team.name;
    }

    const result = await addTeam(user.id, teamId, finalTeamName);

    const emoji = result.success ? '✅' : '❌';
    await sendMessage(chatId, `${emoji} ${result.message}`);
    // Log removed for optimization
}

/**
 * /takimsil komutu
 */
async function handleRemoveTeam(chatId, user, teamName) {
    if (!teamName) {
        await sendMessage(chatId, '❌ Takım adı belirtmelisiniz!\n\nÖrnek: /takimsil Beşiktaş');
        return;
    }

    const teams = await getUserTeams(user.id);
    const team = teams.find(t => t.teamName.toLowerCase().includes(teamName.toLowerCase()));

    if (!team) {
        await sendMessage(chatId, `❌ "${teamName}" takımını takip etmiyorsunuz!`);
        return;
    }

    const result = await removeTeam(user.id, team.teamId);

    const emoji = result.success ? '✅' : '❌';
    await sendMessage(chatId, `${emoji} ${result.message}`);
    // Log removed for optimization
}

/**
 * /takimlarim komutu
 */
async function handleMyTeams(chatId, user) {
    const teams = await getUserTeams(user.id);

    if (teams.length === 0) {
        await sendMessage(chatId, '📋 Henüz takım eklemediniz!\n\n/takimekle Beşiktaş ile başlayabilirsiniz.');
        return;
    }

    let message = `⚽ *Takımlarınız (${teams.length})*\n\n`;

    teams.forEach((team, index) => {
        const notifIcon = team.notificationType === 'all' ? '🔔' : '⚽';
        message += `${index + 1}. ${notifIcon} ${team.teamName}\n`;
    });

    message += `\n_Takım çıkarmak için:_\n/takimsil [takım adı]`;

    await sendMessage(chatId, message);
    // Log removed for optimization
}

/**
 * /takimara komutu - TheSportsDB kullanıyor (ücretsiz!)
 */
async function handleSearchTeam(chatId, user, query) {
    if (!query) {
        await sendMessage(chatId, '❌ Arama kelimesi belirtmelisiniz!\n\nÖrnek: /takimara Galatasaray');
        return;
    }

    // TheSportsDB'den ara (API limiti yok!)
    const teams = await searchTeamSportsDB(query);

    if (teams.length === 0) {
        await sendMessage(chatId, `❌ "${query}" için sonuç bulunamadı!`);
        return;
    }

    let message = `🔍 *Arama Sonuçları: "${query}"*\n\n`;

    teams.slice(0, 10).forEach((team, index) => {
        message += `${index + 1}. ${team.strTeam}\n`;
        message += `   🏆 ${team.strLeague || team.strCountry || 'N/A'}\n\n`;
    });

    message += `_Eklemek için:_\n/takimekle [takım adı]`;

    await sendMessage(chatId, message);
    // Log removed for optimization
}

/**
 * Bilinmeyen komut
 */
async function handleUnknown(chatId, user, text) {
    const message = `❓ *Bilinmeyen komut.*

Kullanılabilir komutlar için /help yazın.`;

    await sendMessage(chatId, message);
    // Log removed for optimization
}

/**
 * Normal metin mesajı
 */
async function handleTextMessage(chatId, text, user) {
    const message = `💬 Mesajınız alındı!

Komutlar için /help yazın.`;

    await sendMessage(chatId, message);
    // Log removed for optimization
}
