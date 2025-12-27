/**
 * Database Cache Manager
 * Google Sheets'teki "Veritabanı" sheet'ini kullanarak hızlı veri servisi sağlar.
 */

import { getCachedTeams as getTeamsFromSheets } from './sheets.js';

let teamCache = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 dakika

/**
 * Tüm kayıtlı takımları al (bellekte tutarak hızlandırır)
 */
export async function getCachedTeams() {
    const now = Date.now();

    // Eğer bellek boşsa veya cache süresi dolmuşsa Sheets'ten çek
    if (!teamCache || (now - lastUpdate) > CACHE_DURATION) {
        console.log('Fetching teams from Google Sheets cache...');
        teamCache = await getTeamsFromSheets();
        lastUpdate = now;
    }

    return teamCache || [];
}

// Eski fonksiyon adı için alias
export async function getTeamsFromCache() {
    return await getCachedTeams();
}

/**
 * Cache'te takım ara
 */
export async function searchTeamsInCache(query) {
    const teams = await getCachedTeams();
    if (!teams || teams.length === 0) return null;

    const normalized = query.toLowerCase();
    return teams.filter(t =>
        t.name.toLowerCase().includes(normalized) ||
        (t.alternateName && t.alternateName.toLowerCase().includes(normalized))
    ).slice(0, 15);
}

/**
 * Belirli bir ligdeki takımları cache'ten al
 */
export async function getLeagueTeamsFromCache(leagueName) {
    const teams = await getCachedTeams();
    if (!teams || teams.length === 0) return null;

    return teams.filter(t => t.league === leagueName);
}
