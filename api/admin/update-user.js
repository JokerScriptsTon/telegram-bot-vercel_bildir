/**
 * Admin API - Update User
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
        const { userId, name, username } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['Kullanıcılar'];

        if (!sheet) {
            return res.status(404).json({ error: 'Users sheet not found' });
        }

        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();
        const userRow = rows.find(row => row.get('User ID') === String(userId));

        if (!userRow) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields
        if (name) userRow.set('İsim', name);
        if (username) userRow.set('Username', username);

        await userRow.save();

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: {
                userId: userRow.get('User ID'),
                name: userRow.get('İsim'),
                username: userRow.get('Username')
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
