/**
 * Web App API - Takım Ara
 */

import { searchTeamSportsDB } from '../../lib/sportsdb-api.js';
import { getCachedTeams } from '../../lib/db-cache.js';

// URL temizleme fonksiyonu
function cleanUrl(url) {
    if (!url) return null;
    return String(url).replace(/\\\//g, '/');
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({ error: 'Query too short' });
        }

        // Önce cache'den ara
        const cachedTeams = await getCachedTeams();
        const cachedResults = cachedTeams.filter(team =>
            team.name.toLowerCase().includes(q.toLowerCase())
        );

        // Cache'de bulunduysa direkt dön
        if (cachedResults.length > 0) {
            const teams = cachedResults.map(team => ({
                id: parseInt(team.id),
                name: team.name,
                logo: cleanUrl(team.logo),
                country: team.country,
                league: team.league
            }));
            return res.status(200).json({ teams, source: 'cache' });
        }

        // Cache'de yoksa API'den ara
        const apiResults = await searchTeamSportsDB(q);
        const teams = apiResults.map(team => ({
            id: parseInt(team.idTeam),
            name: team.strTeam,
            logo: cleanUrl(team.strTeamBadge),
            country: team.strCountry,
            league: team.strLeague
        }));

        return res.status(200).json({ teams, source: 'api' });

    } catch (error) {
        console.error('Search teams error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
