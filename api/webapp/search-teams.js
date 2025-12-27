/**
 * Web App API - Takım Arama
 * TheSportsDB kullanıyor (ücretsiz, sınırsız)
 */

import { searchTeamSportsDB, getTeamLogo } from '../../lib/sportsdb-api.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { q, userId } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({ error: 'Query too short' });
        }

        // TheSportsDB'den takım ara (ücretsiz!)
        const results = await searchTeamSportsDB(q);

        // Sonuçları formatla
        const teams = results.slice(0, 10).map(team => ({
            id: team.idTeam,
            name: team.strTeam,
            icon: getTeamIcon(team.strTeam),
            country: team.strCountry || team.strLeague || 'N/A',
            logo: team.strTeamBadge // Logo URL'i ekle
        }));

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
