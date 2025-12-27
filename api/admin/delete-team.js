/**
 * Admin API - Delete Team from Database
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
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Team ID required' });
        }

        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['Veritabanı'];

        if (!sheet) {
            return res.status(404).json({ error: 'Database sheet not found' });
        }

        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();
        const teamRow = rows.find(row => row.get('ID') === String(id));

        if (!teamRow) {
            return res.status(404).json({ error: 'Team not found' });
        }

        await teamRow.delete();

        return res.status(200).json({ success: true, message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Delete team error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
