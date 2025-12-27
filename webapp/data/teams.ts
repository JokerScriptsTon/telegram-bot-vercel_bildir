
import { Team, League } from '../types';

export const LEAGUES: League[] = [
  { id: 'l1', name: 'Süper Lig', country: 'Türkiye', logo: 'https://picsum.photos/seed/sl_logo/200', season: '2023/24' },
  { id: 'l2', name: 'La Liga', country: 'İspanya', logo: 'https://picsum.photos/seed/ll_logo/200', season: '2023/24' },
  { id: 'l3', name: 'Premier League', country: 'İngiltere', logo: 'https://picsum.photos/seed/pl_logo/200', season: '2023/24' },
  { id: 'l4', name: 'Bundesliga', country: 'Almanya', logo: 'https://picsum.photos/seed/bl_logo/200', season: '2023/24' },
  { id: 'l5', name: 'Serie A', country: 'İtalya', logo: 'https://picsum.photos/seed/sa_logo/200', season: '2023/24' },
];

export const TEAMS: Team[] = [
  { id: '1', name: 'Galatasaray', league: 'Süper Lig', city: 'İstanbul', logo: 'https://picsum.photos/seed/gs_logo/200', stadium: 'Ali Sami Yen Rams Park', founded: '1905', colors: ['#A90432', '#FDB912'] },
  { id: '2', name: 'Fenerbahçe', league: 'Süper Lig', city: 'İstanbul', logo: 'https://picsum.photos/seed/fb_logo/200', stadium: 'Ülker Stadyumu', founded: '1907', colors: ['#002B5C', '#FBED1C'] },
  { id: '3', name: 'Beşiktaş', league: 'Süper Lig', city: 'İstanbul', logo: 'https://picsum.photos/seed/bjk_logo/200', stadium: 'Tüpraş Stadyumu', founded: '1903', colors: ['#000000', '#FFFFFF'] },
  { id: '4', name: 'Trabzonspor', league: 'Süper Lig', city: 'Trabzon', logo: 'https://picsum.photos/seed/ts_logo/200', stadium: 'Papara Park', founded: '1967', colors: ['#800000', '#0099FF'] },
  { id: '5', name: 'Real Madrid', league: 'La Liga', city: 'Madrid', logo: 'https://picsum.photos/seed/rm_logo/200', stadium: 'Santiago Bernabéu', founded: '1902', colors: ['#FFFFFF', '#FEBE10'] },
  { id: '6', name: 'Barcelona', league: 'La Liga', city: 'Barcelona', logo: 'https://picsum.photos/seed/bar_logo/200', stadium: 'Spotify Camp Nou', founded: '1899', colors: ['#004D98', '#A50044'] },
  { id: '7', name: 'Manchester City', league: 'Premier League', city: 'Manchester', logo: 'https://picsum.photos/seed/mci_logo/200', stadium: 'Etihad Stadium', founded: '1880', colors: ['#6CABDD', '#1C2C5B'] },
  { id: '8', name: 'Liverpool', league: 'Premier League', city: 'Liverpool', logo: 'https://picsum.photos/seed/liv_logo/200', stadium: 'Anfield', founded: '1892', colors: ['#C8102E', '#00B2A9'] },
  { id: '9', name: 'Bayern München', league: 'Bundesliga', city: 'Münih', logo: 'https://picsum.photos/seed/bay_logo/200', stadium: 'Allianz Arena', founded: '1900', colors: ['#DC052D', '#0066B2'] },
  { id: '10', name: 'AC Milan', league: 'Serie A', city: 'Milano', logo: 'https://picsum.photos/seed/mil_logo/200', stadium: 'San Siro', founded: '1899', colors: ['#FB090B', '#000000'] },
];

export const MOCK_MATCHES: Record<string, any[]> = {
  '1': [
    { id: 'm1', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe', homeScore: 2, awayScore: 1, date: '12 May 2024', status: 'played' },
    { id: 'm2', homeTeam: 'Beşiktaş', awayTeam: 'Galatasaray', homeScore: 0, awayScore: 2, date: '5 May 2024', status: 'played' },
    { id: 'm3', homeTeam: 'Galatasaray', awayTeam: 'Trabzonspor', homeScore: 3, awayScore: 3, date: '28 Apr 2024', status: 'played' },
  ],
  'default': [
    { id: 'd1', homeTeam: 'Ev Sahibi', awayTeam: 'Deplasman', homeScore: 1, awayScore: 1, date: '10 May 2024', status: 'played' },
    { id: 'd2', homeTeam: 'Ev Sahibi', awayTeam: 'Deplasman', homeScore: 0, awayScore: 0, date: '15 May 2024', status: 'upcoming' },
  ]
};

export const MOCK_STANDINGS: Record<string, any[]> = {
  'Süper Lig': [
    { rank: 1, teamName: 'Galatasaray', played: 34, won: 30, drawn: 2, lost: 2, points: 92 },
    { rank: 2, teamName: 'Fenerbahçe', played: 34, won: 29, drawn: 3, lost: 2, points: 90 },
    { rank: 3, teamName: 'Trabzonspor', played: 34, won: 18, drawn: 8, lost: 8, points: 62 },
    { rank: 4, teamName: 'Beşiktaş', played: 34, won: 17, drawn: 7, lost: 10, points: 58 },
    { rank: 5, teamName: 'Kasımpaşa', played: 34, won: 15, drawn: 8, lost: 11, points: 53 },
    { rank: 6, teamName: 'Rizespor', played: 34, won: 14, drawn: 7, lost: 13, points: 49 },
  ],
  'La Liga': [
    { rank: 1, teamName: 'Real Madrid', played: 34, won: 27, drawn: 6, lost: 1, points: 87 },
    { rank: 2, teamName: 'Barcelona', played: 34, won: 22, drawn: 7, lost: 5, points: 73 },
    { rank: 3, teamName: 'Girona', played: 34, won: 21, drawn: 6, lost: 7, points: 69 },
    { rank: 4, teamName: 'Atletico Madrid', played: 34, won: 20, drawn: 4, lost: 10, points: 64 },
  ]
};
