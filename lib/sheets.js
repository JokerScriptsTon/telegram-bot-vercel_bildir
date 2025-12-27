/**
 * Google Sheets Wrapper
 * 
 * Google Sheets API ile veri işlemleri
 */

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_ID = process.env.SHEET_ID;

/**
 * Google Sheets dökümanına bağlan
 */
async function getDoc() {
    try {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        return doc;
    } catch (error) {
        console.error('getDoc error:', error.message);
        throw error;
    }
}

/**
 * Kullanıcıyı kaydeder veya günceller
 */
export async function saveUser(user) {
    try {
        const doc = await getDoc();

        // "Kullanıcılar" sheet'ini al veya oluştur
        let sheet = doc.sheetsByTitle['Kullanıcılar'];
        if (!sheet) {
            sheet = await doc.addSheet({
                title: 'Kullanıcılar',
                headerValues: ['User ID', 'Kullanıcı Adı', 'İsim', 'Soyisim', 'Kayıt Tarihi', 'Son Aktivite']
            });
        }

        await sheet.loadHeaderRow();

        // Mevcut kullanıcıları kontrol et
        const rows = await sheet.getRows();
        const existingRow = rows.find(row => row.get('User ID') == user.id);

        const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
        const username = user.username ? `@${user.username}` : user.first_name;

        if (existingRow) {
            // Kullanıcı var, son aktiviteyi güncelle
            existingRow.set('Son Aktivite', now);
            await existingRow.save();
            console.log(`User ${user.id} updated`);
        } else {
            // Yeni kullanıcı ekle
            await sheet.addRow({
                'User ID': user.id,
                'Kullanıcı Adı': username,
                'İsim': user.first_name || '',
                'Soyisim': user.last_name || '',
                'Kayıt Tarihi': now,
                'Son Aktivite': now
            });
            console.log(`User ${user.id} added`);
        }

    } catch (error) {
        console.error('saveUser error:', error.message);
    }
}

/**
 * Mesajı loglar
 */
export async function logMessage(userId, username, message, response) {
    try {
        const doc = await getDoc();

        // "Loglar" sheet'ini al veya oluştur
        let sheet = doc.sheetsByTitle['Loglar'];
        if (!sheet) {
            sheet = await doc.addSheet({
                title: 'Loglar',
                headerValues: ['Tarih', 'User ID', 'Kullanıcı Adı', 'Komut/Mesaj', 'Bot Cevabı']
            });
        }

        await sheet.loadHeaderRow();

        const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

        await sheet.addRow({
            'Tarih': now,
            'User ID': userId,
            'Kullanıcı Adı': username,
            'Komut/Mesaj': message,
            'Bot Cevabı': response
        });

        console.log(`Message logged for user ${userId}`);

    } catch (error) {
        console.error('logMessage error:', error.message);
    }
}
