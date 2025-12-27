/**
 * Admin API - Get Users
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

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const doc = await getDoc();
        const usersSheet = doc.sheetsByTitle['Kullanıcılar'];
        const teamsSheet = doc.sheetsByTitle['Takım Takipleri'];

        if (!usersSheet) {
            return res.status(200).json({ users: [] });
        }

        await usersSheet.loadHeaderRow();
        const rows = await usersSheet.getRows();

        // Get team counts
        let teamCounts = {};
        if (teamsSheet) {
            await teamsSheet.loadHeaderRow();
            const teamRows = await teamsSheet.getRows();
            teamRows.forEach(row => {
                const userId = row.get('User ID');
                teamCounts[userId] = (teamCounts[userId] || 0) + 1;
            });
        }

        const users = rows.map(row => ({
            userId: row.get('User ID'),
            name: row.get('İsim') || row.get('Username'),
            registeredAt: row.get('Kayıt Tarihi'),
            teamCount: teamCounts[row.get('User ID')] || 0
        }));

        return res.status(200).json({ users, count: users.length });
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
