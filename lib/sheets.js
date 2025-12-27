/**
 * Google Sheets Wrapper
 * 
 * Google Sheets API ile veri işlemleri
 * Optimize edilmiş: Sadece kullanıcı ve takım verileri
 */

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_ID = process.env.SHEET_ID;

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
        let sheet = doc.sheetsByTitle['Kullanıcılar'];

        if (!sheet) {
            sheet = await doc.addSheet({
                title: 'Kullanıcılar',
                headerValues: ['User ID', 'Username', 'İsim', 'Kayıt Tarihi', 'Son Aktivite', 'Aktif']
            });
        }

        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();
        const existingRow = rows.find(row => row.get('User ID') == user.id);

        const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
        const username = user.username ? `@${user.username}` : user.first_name;

        if (existingRow) {
            // Kullanıcı var, bilgileri güncelle
            existingRow.set('Username', username);
            existingRow.set('İsim', user.first_name || '');
            existingRow.set('Son Aktivite', now);
            existingRow.set('Aktif', 'true');
            await existingRow.save();
            console.log(`User ${user.id} updated`);
        } else {
            // Yeni kullanıcı ekle
            await sheet.addRow({
                'User ID': user.id,
                'Username': username,
                'İsim': user.first_name || '',
                'Kayıt Tarihi': now,
                'Son Aktivite': now,
                'Aktif': 'true'
            });
            console.log(`User ${user.id} added`);
        }

    } catch (error) {
        console.error('saveUser error:', error.message);
    }
}

/**
 * Kullanıcı istatistiklerini al
 */
export async function getUserStats() {
    try {
        const doc = await getDoc();
        const usersSheet = doc.sheetsByTitle['Kullanıcılar'];
        const teamsSheet = doc.sheetsByTitle['Takım Takipleri'];

        if (!usersSheet) return { totalUsers: 0, activeUsers: 0, totalTeamFollows: 0 };

        await usersSheet.loadHeaderRow();
        const users = await usersSheet.getRows();

        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.get('Aktif') === 'true').length;

        let totalTeamFollows = 0;
        if (teamsSheet) {
            await teamsSheet.loadHeaderRow();
            const teams = await teamsSheet.getRows();
            totalTeamFollows = teams.length;
        }

        return { totalUsers, activeUsers, totalTeamFollows };
    } catch (error) {
        console.error('getUserStats error:', error.message);
        return { totalUsers: 0, activeUsers: 0, totalTeamFollows: 0 };
    }
}

/**
 * Veritabanı (Cache) sheet'inden tüm takımları al
 */
export async function getCachedTeams() {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['Veritabanı'];
        if (!sheet) return [];

        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();
        return rows.map(row => ({
            id: row.get('ID'),
            league: row.get('Lig'),
            name: row.get('Takım Adı'),
            country: row.get('Ülke'),
            logo: row.get('Logo URL')
        }));
    } catch (error) {
        console.error('getCachedTeams error:', error.message);
        return [];
    }
}

/**
 * Veritabanı sheet'ine toplu takım ekle/güncelle
 */
export async function syncTeamsToSheet(teams) {
    try {
        const doc = await getDoc();
        let sheet = doc.sheetsByTitle['Veritabanı'];

        if (!sheet) {
            sheet = await doc.addSheet({
                title: 'Veritabanı',
                headerValues: ['ID', 'Lig', 'Takım Adı', 'Ülke', 'Logo URL']
            });
        }

        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();

        // Mevcut ID'leri bir Set içinde topla (hızlı kontrol için)
        const existingIds = new Set(rows.map(row => row.get('ID')));

        const newRows = [];
        for (const team of teams) {
            if (!existingIds.has(String(team.id))) {
                newRows.push({
                    'ID': String(team.id),
                    'Lig': team.league,
                    'Takım Adı': team.name,
                    'Ülke': team.country,
                    'Logo URL': team.logo
                });
            }
        }

        if (newRows.length > 0) {
            // Büyük veriyi parçalar halinde ekle (Google API limiti)
            const chunkSize = 50;
            for (let i = 0; i < newRows.length; i += chunkSize) {
                await sheet.addRows(newRows.slice(i, i + chunkSize));
                console.log(`Synced ${Math.min(i + chunkSize, newRows.length)} / ${newRows.length} teams...`);
            }
        }

        return true;
    } catch (error) {
        console.error('syncTeamsToSheet error:', error.message);
        return false;
    }
}
