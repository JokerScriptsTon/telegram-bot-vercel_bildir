/**
 * Admin API - Update Team in Database
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
        const { id, name, logo, country, league } = req.body;

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

        // Update fields
        if (name) teamRow.set('Takım Adı', name);
        if (logo !== undefined) teamRow.set('Logo URL', logo);
        if (country) teamRow.set('Ülke', country);
        if (league) teamRow.set('Lig', league);

        await teamRow.save();

        return res.status(200).json({
            success: true,
            message: 'Team updated successfully',
            team: {
                id: teamRow.get('ID'),
                name: teamRow.get('Takım Adı'),
                logo: teamRow.get('Logo URL'),
                country: teamRow.get('Ülke'),
                league: teamRow.get('Lig')
            }
        });
    } catch (error) {
        console.error('Update team error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
