/**
 * Kullanıcı Takım Yönetimi
 * Google Sheets ile takım takibi
 */

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_ID = process.env.SHEET_ID;

async function getDoc() {
    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
}

/**
 * Kullanıcıya takım ekle
 */
export async function addTeam(userId, teamId, teamName, settings) {
    try {
        const doc = await getDoc();
        let sheet = doc.sheetsByTitle['Takım Takipleri'];

        if (!sheet) {
            sheet = await doc.addSheet({
                title: 'Takım Takipleri',
                headerValues: ['User ID', 'Takım ID', 'Takım Adı', '1h_Once', '15m_Once', 'Baslangic', 'Goller', 'Kartlar', 'DevreArasi', 'MacSonu', 'Eklenme Tarihi']
            });
        }

        await sheet.loadHeaderRow();

        // Zaten takip ediyor mu kontrol et
        const rows = await sheet.getRows();
        const existing = rows.find(row =>
            row.get('User ID') == userId && row.get('Takım ID') == teamId
        );

        if (existing) {
            return { success: false, message: 'Bu takımı zaten takip ediyorsunuz!' };
        }

        const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
        const s = settings || { before1h: true, before15m: true, matchStart: true, goals: true, cards: true, halfTime: true, fullTime: true };

        await sheet.addRow({
            'User ID': userId,
            'Takım ID': teamId,
            'Takım Adı': teamName,
            '1h_Once': String(s.before1h ?? true),
            '15m_Once': String(s.before15m ?? true),
            'Baslangic': String(s.matchStart ?? true),
            'Goller': String(s.goals ?? true),
            'Kartlar': String(s.cards ?? true),
            'DevreArasi': String(s.halfTime ?? true),
            'MacSonu': String(s.fullTime ?? true),
            'Eklenme Tarihi': now
        });

        console.log(`Team ${teamId} added for user ${userId} with granular settings`);
        return { success: true, message: `${teamName} takip listene eklendi!` };

    } catch (error) {
        console.error('addTeam error:', error.message);
        return { success: false, message: 'Bir hata oluştu!' };
    }
}

/**
 * Kullanıcıdan takım sil
 */
export async function removeTeam(userId, teamId) {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['Takım Takipleri'];

        if (!sheet) {
            return { success: false, message: 'Henüz takım eklemediniz!' };
        }

        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();

        const teamRow = rows.find(row =>
            row.get('User ID') == userId && row.get('Takım ID') == teamId
        );

        if (!teamRow) {
            return { success: false, message: 'Bu takımı takip etmiyorsunuz!' };
        }

        const teamName = teamRow.get('Takım Adı');
        await teamRow.delete();

        console.log(`Team ${teamId} removed for user ${userId}`);
        return { success: true, message: `${teamName} takip listenden çıkarıldı!` };

    } catch (error) {
        console.error('removeTeam error:', error.message);
        return { success: false, message: 'Bir hata oluştu!' };
    }
}

/**
 * Kullanıcının takımlarını getir
 */
export async function getUserTeams(userId) {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['Takım Takipleri'];

        if (!sheet) {
            return [];
        }

        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();

        const userTeams = rows
            .filter(row => row.get('User ID') == userId)
            .map(row => ({
                id: parseInt(row.get('Takım ID')),
                name: row.get('Takım Adı'),
                settings: {
                    before1h: row.get('1h_Once') === 'true',
                    before15m: row.get('15m_Once') === 'true',
                    matchStart: row.get('Baslangic') === 'true',
                    goals: row.get('Goller') === 'true',
                    cards: row.get('Kartlar') === 'true',
                    halfTime: row.get('DevreArasi') === 'true',
                    fullTime: row.get('MacSonu') === 'true'
                }
            }));

        return userTeams;

    } catch (error) {
        console.error('getUserTeams error:', error.message);
        return [];
    }
}

/**
 * Takımı takip eden kullanıcıları getir
 */
export async function getTeamFollowers(teamId) {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['Takım Takipleri'];

        if (!sheet) {
            return [];
        }

        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();

        const followers = rows
            .filter(row => row.get('Takım ID') == teamId)
            .map(row => ({
                userId: row.get('User ID'),
                notificationType: row.get('Bildirim Tipi')
            }));

        return followers;

    } catch (error) {
        console.error('getTeamFollowers error:', error.message);
        return [];
    }
}

/**
 * Kullanıcının bildirim tipini güncelle
 */
export async function updateNotificationSettings(userId, teamId, settings) {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['Takım Takipleri'];

        if (!sheet) {
            return { success: false, message: 'Takım bulunamadı!' };
        }

        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();

        const teamRow = rows.find(row =>
            row.get('User ID') == userId && row.get('Takım ID') == teamId
        );

        if (!teamRow) {
            return { success: false, message: 'Bu takımı takip etmiyorsunuz!' };
        }

        teamRow.set('1h_Once', String(settings.before1h ?? true));
        teamRow.set('15m_Once', String(settings.before15m ?? true));
        teamRow.set('Baslangic', String(settings.matchStart ?? true));
        teamRow.set('Goller', String(settings.goals ?? true));
        teamRow.set('Kartlar', String(settings.cards ?? true));
        teamRow.set('DevreArasi', String(settings.halfTime ?? true));
        teamRow.set('MacSonu', String(settings.fullTime ?? true));

        await teamRow.save();

        return { success: true, message: 'Bildirim ayarları güncellendi!' };

    } catch (error) {
        console.error('updateNotificationType error:', error.message);
        return { success: false, message: 'Bir hata oluştu!' };
    }
}
