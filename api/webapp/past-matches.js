/**
 * Web App API - Geçmiş Maçlar
 * TheSportsDB kullanıyor (ücretsiz)
 */

import axios from 'axios';

const SPORTSDB_API = 'https://www.thesportsdb.com/api/v1/json/3';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { teamId } = req.query;

        if (!teamId) {
            return res.status(400).json({ error: 'Team ID required' });
        }

        // TheSportsDB'den son 5 maçı al
        const response = await axios.get(`${SPORTSDB_API}/eventslast.php`, {
            params: { id: teamId }
        });

        const events = response.data.results || [];

        // Maçları formatla
        const matches = events.slice(0, 5).map(event => ({
            id: event.idEvent,
            date: event.dateEvent,
            time: event.strTime,
            homeTeam: event.strHomeTeam,
            awayTeam: event.strAwayTeam,
            homeScore: event.intHomeScore,
            awayScore: event.intAwayScore,
            league: event.strLeague,
            status: event.strStatus
        }));

        return res.status(200).json({ matches });

    } catch (error) {
        console.error('Get past matches error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
