/**
 * Admin API - Add Team to Database
 */

import { syncTeamsToSheet } from '../../lib/sheets.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id, name, logo, country, league } = req.body;

        if (!id || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const team = {
            id: String(id),
            name,
            logo: logo || null,
            country: country || 'N/A',
            league: league || 'Manual'
        };

        const success = await syncTeamsToSheet([team]);

        if (success) {
            return res.status(200).json({ success: true, message: 'Team added successfully' });
        } else {
            return res.status(500).json({ success: false, error: 'Failed to add team' });
        }
    } catch (error) {
        console.error('Add team error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
