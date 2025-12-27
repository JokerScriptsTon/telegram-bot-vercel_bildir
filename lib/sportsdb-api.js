/**
 * TheSportsDB API Wrapper
 * Ücretsiz, sınırsız - Takım logoları, detaylar, statik veriler için
 */

import axios from 'axios';

const SPORTSDB_API = 'https://www.thesportsdb.com/api/v1/json/3';

/**
 * URL'deki escaped slash'leri temizle
 */
function cleanUrl(url) {
    if (!url) return null;
    // \/ şeklindeki escaped slash'leri normal / ile değiştir
    return String(url).replace(/\\\//g, '/');
}

/**
 * Takım ara (TheSportsDB)
 */
export async function searchTeamSportsDB(query) {
    try {
        const response = await axios.get(`${SPORTSDB_API}/searchteams.php`, {
            params: { t: query }
        });

        return response.data.teams || [];
    } catch (error) {
        console.error('searchTeamSportsDB error:', error.message);
        return [];
    }
}

/**
 * Takım detaylarını al (logo, renk, stadyum vs.)
 */
export async function getTeamDetails(teamName) {
    try {
        const response = await axios.get(`${SPORTSDB_API}/searchteams.php`, {
            params: { t: teamName }
        });

        const team = response.data.teams?.[0];
        if (!team) return null;

        return {
            id: team.idTeam,
            name: team.strTeam,
            alternateName: team.strAlternate,
            league: team.strLeague,
            stadium: team.strStadium,
            location: team.strStadiumLocation,
            capacity: team.intStadiumCapacity,
            logo: cleanUrl(team.strTeamBadge),
            banner: cleanUrl(team.strTeamBanner),
            jersey: cleanUrl(team.strTeamJersey),
            description: team.strDescriptionEN,
            website: team.strWebsite,
            facebook: team.strFacebook,
            twitter: team.strTwitter,
            instagram: team.strInstagram,
            youtube: team.strYoutube
        };
    } catch (error) {
        console.error('getTeamDetails error:', error.message);
        return null;
    }
}

/**
 * Lig takımlarını al
 */
export async function getLeagueTeams(leagueName) {
    try {
        const response = await axios.get(`${SPORTSDB_API}/search_all_teams.php`, {
            params: { l: leagueName }
        });

        return response.data.teams || [];
    } catch (error) {
        console.error('getLeagueTeams error:', error.message);
        return [];
    }
}

/**
 * Türk Süper Lig takımlarını al
 */
export async function getTurkishSuperLigTeams() {
    return await getLeagueTeams('Turkish Super League');
}

/**
 * Takım ID'sinden detay al
 */
export async function getTeamById(teamId) {
    try {
        const response = await axios.get(`${SPORTSDB_API}/lookupteam.php`, {
            params: { id: teamId }
        });

        const team = response.data.teams?.[0];
        if (!team) return null;

        return {
            id: team.idTeam,
            name: team.strTeam,
            logo: cleanUrl(team.strTeamBadge),
            banner: cleanUrl(team.strTeamBanner),
            league: team.strLeague,
            stadium: team.strStadium,
            description: team.strDescriptionEN
        };
    } catch (error) {
        console.error('getTeamById error:', error.message);
        return null;
    }
}

/**
 * Popüler Türk takımları (TheSportsDB ID'leri ile)
 */
export const TURKISH_TEAMS_SPORTSDB = {
    'beşiktaş': { id: '133610', name: 'Besiktas', logo: 'https://www.thesportsdb.com/images/media/team/badge/rqwrrt1420567462.png' },
    'galatasaray': { id: '133612', name: 'Galatasaray', logo: 'https://www.thesportsdb.com/images/media/team/badge/vwxwqt1420567354.png' },
    'fenerbahçe': { id: '133611', name: 'Fenerbahce', logo: 'https://www.thesportsdb.com/images/media/team/badge/xyqxqt1420567397.png' },
    'trabzonspor': { id: '133613', name: 'Trabzonspor', logo: 'https://www.thesportsdb.com/images/media/team/badge/sxqxvt1420567531.png' }
};

/**
 * Takım logosu al
 */
export function getTeamLogo(teamName) {
    const normalized = teamName.toLowerCase();
    return TURKISH_TEAMS_SPORTSDB[normalized]?.logo || null;
}
