/**
 * Web App API - Kullanıcı Takımları
 */

import { getUserTeams } from '../../lib/user-teams.js';
import { getCachedTeams } from '../../lib/db-cache.js';

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

        // Cache'den tüm takımları al (logo bilgisi için)
        const cachedTeams = await getCachedTeams();

        // Takımları zenginleştir (logo ve country bilgisi ekle)
        const teams = userTeams.map(team => {
            const cachedTeam = cachedTeams.find(ct => ct.id === String(team.id));
            return {
                ...team,
                logo: cachedTeam?.logo || null,
                country: cachedTeam?.country || 'N/A'
            };
        });

        return res.status(200).json({ teams });

    } catch (error) {
        console.error('Get user teams error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
