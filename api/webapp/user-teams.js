/**
 * Web App API - Kullanıcı Takımları
 */

import { getUserTeams } from '../../lib/user-teams.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        // Kullanıcının takımlarını al
        const userTeams = await getUserTeams(userId);

        // Formatla
        const teams = userTeams.map(team => ({
            id: parseInt(team.teamId),
            name: team.teamName,
            icon: getTeamIcon(team.teamName),
            country: 'Turkey', // Varsayılan
            notificationType: team.notificationType || 'all'
        }));

        return res.status(200).json({ teams });

    } catch (error) {
        console.error('Get user teams error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Takım ikonları
function getTeamIcon(teamName) {
    const icons = {
        'beşiktaş': '🦅',
        'besiktas': '🦅',
        'galatasaray': '🦁',
        'fenerbahçe': '🐦',
        'fenerbahce': '🐦',
        'trabzonspor': '⚡',
        'başakşehir': '🔷',
        'basaksehir': '🔷'
    };

    const normalized = teamName.toLowerCase();
    return icons[normalized] || '⚽';
}
