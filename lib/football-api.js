/**
 * Football API Wrapper
 * API-Football (RapidAPI) entegrasyonu
 */

import axios from 'axios';

const API_KEY = process.env.FOOTBALL_API_KEY;
const API_HOST = 'api-football-v1.p.rapidapi.com';
const API_URL = `https://${API_HOST}/v3`;

const headers = {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST
};

/**
 * Takım ara
 */
export async function searchTeam(query) {
    try {
        const response = await axios.get(`${API_URL}/teams`, {
            headers,
            params: {
                search: query,
                country: 'Turkey' // Önce Türk takımlarını ara
            }
        });

        return response.data.response || [];
    } catch (error) {
        console.error('searchTeam error:', error.message);
        return [];
    }
}

/**
 * Takım bilgisi al
 */
export async function getTeam(teamId) {
    try {
        const response = await axios.get(`${API_URL}/teams`, {
            headers,
            params: { id: teamId }
        });

        return response.data.response?.[0] || null;
    } catch (error) {
        console.error('getTeam error:', error.message);
        return null;
    }
}

/**
 * Canlı maçları getir
 */
export async function getLiveMatches() {
    try {
        const response = await axios.get(`${API_URL}/fixtures`, {
            headers,
            params: { live: 'all' }
        });

        return response.data.response || [];
    } catch (error) {
        console.error('getLiveMatches error:', error.message);
        return [];
    }
}

/**
 * Takımın maçlarını getir
 */
export async function getTeamMatches(teamId, date = null) {
    try {
        const params = {
            team: teamId,
            season: new Date().getFullYear()
        };

        if (date) {
            params.date = date; // YYYY-MM-DD
        }

        const response = await axios.get(`${API_URL}/fixtures`, {
            headers,
            params
        });

        return response.data.response || [];
    } catch (error) {
        console.error('getTeamMatches error:', error.message);
        return [];
    }
}

/**
 * Maç detaylarını getir
 */
export async function getMatchDetails(fixtureId) {
    try {
        const response = await axios.get(`${API_URL}/fixtures`, {
            headers,
            params: { id: fixtureId }
        });

        return response.data.response?.[0] || null;
    } catch (error) {
        console.error('getMatchDetails error:', error.message);
        return null;
    }
}

/**
 * Maç olaylarını getir (goller, kartlar vs.)
 */
export async function getMatchEvents(fixtureId) {
    try {
        const response = await axios.get(`${API_URL}/fixtures/events`, {
            headers,
            params: { fixture: fixtureId }
        });

        return response.data.response || [];
    } catch (error) {
        console.error('getMatchEvents error:', error.message);
        return [];
    }
}

/**
 * Bugünün maçlarını getir
 */
export async function getTodayMatches() {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const response = await axios.get(`${API_URL}/fixtures`, {
            headers,
            params: { date: today }
        });

        return response.data.response || [];
    } catch (error) {
        console.error('getTodayMatches error:', error.message);
        return [];
    }
}

/**
 * Popüler Türk takımları
 */
export const TURKISH_TEAMS = {
    'beşiktaş': 645,
    'fenerbahçe': 610,
    'galatasaray': 548,
    'trabzonspor': 609,
    'başakşehir': 635,
    'konyaspor': 3569,
    'sivasspor': 3568,
    'alanyaspor': 3573,
    'kasımpaşa': 3570,
    'ankaragücü': 3571
};

/**
 * Takım ID'sini al (isimden)
 */
export function getTeamIdByName(name) {
    const normalized = name.toLowerCase().trim();
    return TURKISH_TEAMS[normalized] || null;
}
