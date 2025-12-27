/**
 * Web App API - Takımları Kaydet
 */

import { addTeam, removeTeam, getUserTeams, updateNotificationType } from '../../lib/user-teams.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, teams } = req.body;

        if (!userId || !teams) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Mevcut takımları al
        const currentTeams = await getUserTeams(userId);
        const currentTeamIds = currentTeams.map(t => parseInt(t.teamId));
        const newTeamIds = teams.map(t => t.id);

        // Çıkarılacak takımlar
        const teamsToRemove = currentTeams.filter(t => !newTeamIds.includes(parseInt(t.teamId)));
        for (const team of teamsToRemove) {
            await removeTeam(userId, team.teamId);
        }

        // Eklenecek veya güncellenecek takımlar
        for (const team of teams) {
            const exists = currentTeamIds.includes(team.id);

            if (!exists) {
                // Yeni takım ekle
                await addTeam(userId, team.id, team.name, team.notificationType || 'all');
            } else {
                // Bildirim tipini güncelle
                await updateNotificationType(userId, team.id, team.notificationType || 'all');
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Takımlar kaydedildi!',
            count: teams.length
        });

    } catch (error) {
        console.error('Save teams error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
