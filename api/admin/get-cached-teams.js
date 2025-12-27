/**
 * Admin API - Get Cached Teams
 */

import { getCachedTeams } from '../../lib/db-cache.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const teams = await getCachedTeams();
        return res.status(200).json({ teams, count: teams.length });
    } catch (error) {
        console.error('Get cached teams error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
