/**
 * Web App API - Lig Takımları
 */

import { getLeagueTeams } from '../../lib/sportsdb-api.js';
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
        const { league } = req.query;

        if (!league) {
            return res.status(400).json({ error: 'League name required' });
        }

        // Önce cache'den al
        const cachedTeams = await getCachedTeams();
        const leagueTeams = cachedTeams.filter(team =>
            team.league && team.league.toLowerCase() === league.toLowerCase()
        );

        if (leagueTeams.length > 0) {
            const teams = leagueTeams.map(team => ({
                id: parseInt(team.id),
                name: team.name,
                logo: cleanUrl(team.logo),
                country: team.country,
                league: team.league
            }));
            return res.status(200).json({ teams, source: 'cache' });
        }

        // Cache'de yoksa API'den al
        const apiTeams = await getLeagueTeams(league);
        const teams = apiTeams.map(team => ({
            id: parseInt(team.idTeam),
            name: team.strTeam,
            logo: cleanUrl(team.strTeamBadge),
            country: team.strCountry,
            league: team.strLeague
        }));

        return res.status(200).json({ teams, source: 'api' });

    } catch (error) {
        console.error('League teams error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
