/**
 * Admin API - Google Sheets Veritabanı Senkronizasyonu
 * 20 popüler ligden ~500+ takımı çeker ve Sheets'e kaydeder.
 */

import { getLeagueTeams } from '../../lib/sportsdb-api.js';
import { syncTeamsToSheet } from '../../lib/sheets.js';

const POPULAR_LEAGUES = [
    'English Premier League',
    'German Bundesliga',
    'Spanish La Liga',
    'Italian Serie A',
    'French Ligue 1',
    'Dutch Eredivisie',
    'Brazilian Serie A',
    'Portuguese Primeira Liga',
    'Mexican Liga MX',
    'Turkish Super League',
    'UEFA Champions League',
    'UEFA Europa League',
    'UEFA Europa Conference League',
    'Copa Libertadores',
    'Copa Sudamericana',
    'FIFA World Cup',
    'American MLS',
    'Saudi Pro League',
    'Belgian Pro League',
    'Scottish Premiership'
];

export default async function handler(req, res) {
    // Güvenlik: Admin anahtarı kontrolü (Opsiyonel ama önerilir)
    // const { adminKey } = req.query;
    // if (adminKey !== process.env.BOT_TOKEN) return res.status(403).json({ error: 'Unauthorized' });

    try {
        console.log('Database sync started...');
        let allTeams = [];

        for (const league of POPULAR_LEAGUES) {
            console.log(`Fetching league: ${league}`);
            const teams = await getLeagueTeams(league);

            if (teams && teams.length > 0) {
                const formatted = teams.map(t => ({
                    id: t.idTeam,
                    league: league,
                    name: t.strTeam,
                    country: t.strCountry,
                    logo: t.strTeamBadge
                }));
                allTeams = allTeams.concat(formatted);
            }
        }

        console.log(`Total teams fetched: ${allTeams.length}. Syncing to Google Sheets...`);

        const success = await syncTeamsToSheet(allTeams);

        if (success) {
            return res.status(200).json({
                success: true,
                message: `${allTeams.length} teams synced to database.`,
                count: allTeams.length
            });
        } else {
            return res.status(500).json({ error: 'Failed to sync to Google Sheets.' });
        }

    } catch (error) {
        console.error('Sync database error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
