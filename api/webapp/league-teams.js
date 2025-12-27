/**
 * Web App API - Lig Takımları
 * TheSportsDB kullanıyor (ücretsiz)
 */

import { getLeagueTeams } from '../../lib/sportsdb-api.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { league } = req.query;

        if (!league) {
            return res.status(400).json({ error: 'League name required' });
        }

        // Lig takımlarını al
        const results = await getLeagueTeams(league);

        // Sonuçları formatla
        const teams = results.map(team => ({
            id: team.idTeam,
            name: team.strTeam,
            icon: '⚽',
            country: team.strCountry || 'N/A',
            logo: team.strTeamBadge
        }));

        return res.status(200).json({ teams });

    } catch (error) {
        console.error('Get league teams error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
