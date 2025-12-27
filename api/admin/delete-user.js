/**
 * Admin API - Delete User
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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const doc = await getDoc();

        // Kullanıcıyı sil
        const usersSheet = doc.sheetsByTitle['Kullanıcılar'];
        if (usersSheet) {
            await usersSheet.loadHeaderRow();
            const rows = await usersSheet.getRows();
            const userRow = rows.find(row => row.get('User ID') === String(userId));
            if (userRow) {
                await userRow.delete();
            }
        }

        // Kullanıcının takım takiplerini sil
        const teamsSheet = doc.sheetsByTitle['Takım Takipleri'];
        if (teamsSheet) {
            await teamsSheet.loadHeaderRow();
            const rows = await teamsSheet.getRows();
            const userTeams = rows.filter(row => row.get('User ID') === String(userId));
            for (const row of userTeams) {
                await row.delete();
            }
        }

        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
