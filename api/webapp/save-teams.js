/**
 * Web App API - Takımları Kaydet
 */

import { addTeam, removeTeam, getUserTeams, updateNotificationSettings } from '../../lib/user-teams.js';
import { saveUser } from '../../lib/sheets.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, teams, user } = req.body;

        if (!userId || !teams) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Kullanıcı bilgisini kaydet
        if (user) {
            await saveUser(user);
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
                await addTeam(userId, team.id, team.name, team.settings);
            } else {
                // Bildirim ayarlarını güncelle
                await updateNotificationSettings(userId, team.id, team.settings);
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
