/**
 * Admin API - Stats
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
        const teamsSheet = doc.sheetsByTitle['Takım Takipleri'];

        let totalFollows = 0;
        if (teamsSheet) {
            await teamsSheet.loadHeaderRow();
            const rows = await teamsSheet.getRows();
            totalFollows = rows.length;
        }

        return res.status(200).json({ totalFollows });
    } catch (error) {
        console.error('Get stats error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
