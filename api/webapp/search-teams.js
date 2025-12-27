/**
 * Web App API - Takım Arama
 * TheSportsDB kullanıyor (ücretsiz, sınırsız)
 */

import { searchTeamsInCache } from '../../lib/db-cache.js';
import { searchTeamSportsDB } from '../../lib/sportsdb-api.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({ error: 'Query too short' });
        }

        // 1. Önce Google Sheets cache'ine bak
        let teams = await searchTeamsInCache(q);

        // 2. Eğer cache'te bulunamadıysa (veya az bulunduysa) TheSportsDB'ye git
        if (!teams || teams.length === 0) {
            console.log('Cache miss, searching TheSportsDB...');
            const results = await searchTeamSportsDB(q);
            teams = results.slice(0, 10).map(team => ({
                id: team.idTeam,
                name: team.strTeam,
                country: team.strCountry || 'N/A',
                logo: team.strTeamBadge
            }));
        }

        return res.status(200).json({ teams });

    } catch (error) {
        console.error('Search teams error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Takım ikonları (emoji)
function getTeamIcon(teamName) {
    const icons = {
        'besiktas': '🦅',
        'beşiktaş': '🦅',
        'galatasaray': '🦁',
        'fenerbahce': '🐦',
        'fenerbahçe': '🐦',
        'trabzonspor': '⚡',
        'basaksehir': '🔷',
        'başakşehir': '🔷',
        'barcelona': '🔵',
        'real madrid': '⚪',
        'manchester united': '🔴',
        'liverpool': '🔴',
        'bayern munich': '🔴'
    };

    const normalized = teamName.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
        if (normalized.includes(key)) return icon;
    }
    return '⚽';
}
