import React, { useState, useEffect } from 'react';
import { Team, League, Notification, TeamPreference } from './types';

// API Base URL
const API_BASE = '';

// --- API Functions ---
async function fetchTeams(query: string = ''): Promise<Team[]> {
  try {
    const url = query ? `/api/webapp/search-teams?q=${encodeURIComponent(query)}` : '/api/webapp/search-teams?q=';
    const res = await fetch(url);
    const data = await res.json();
    return (data.teams || []).map((t: any) => ({
      id: String(t.id),
      name: t.name,
      logo: t.logo,
      league: t.league || 'N/A',
      city: t.country || 'N/A',
      stadium: 'Stadium',
      founded: '1900',
      colors: ['#2481cc', '#1a5fa0']
    }));
  } catch (error) {
    console.error('fetchTeams error:', error);
    return [];
  }
}

async function fetchLeagueTeams(league: string): Promise<Team[]> {
  try {
    const res = await fetch(`/api/webapp/league-teams?league=${encodeURIComponent(league)}`);
    const data = await res.json();
    return (data.teams || []).map((t: any) => ({
      id: String(t.id),
      name: t.name,
      logo: t.logo,
      league: t.league || league,
      city: t.country || 'N/A',
      stadium: 'Stadium',
      founded: '1900',
      colors: ['#2481cc', '#1a5fa0']
    }));
  } catch (error) {
    console.error('fetchLeagueTeams error:', error);
    return [];
  }
}

async function fetchUserTeams(userId: string): Promise<{ teams: Team[], preferences: Record<string, TeamPreference> }> {
  try {
    const res = await fetch(`/api/webapp/user-teams?userId=${userId}`);
    const data = await res.json();
    const teams: Team[] = (data.teams || []).map((t: any) => ({
      id: String(t.id),
      name: t.name,
      logo: t.logo,
      league: t.league || 'N/A',
      city: t.country || 'N/A',
      stadium: 'Stadium',
      founded: '1900',
      colors: ['#2481cc', '#1a5fa0']
    }));

    const preferences: Record<string, TeamPreference> = {};
    (data.teams || []).forEach((t: any) => {
      if (t.settings) {
        preferences[String(t.id)] = {
          teamId: String(t.id),
          goals: t.settings.goals || false,
          transfers: t.settings.before1h || false,
          news: t.settings.matchStart || false
        };
      }
    });

    return { teams, preferences };
  } catch (error) {
    console.error('fetchUserTeams error:', error);
    return { teams: [], preferences: {} };
  }
}

async function saveUserTeams(userId: string, user: any, teams: Team[], preferences: Record<string, TeamPreference>): Promise<boolean> {
  try {
    const selectedTeams = teams.map(t => ({
      id: parseInt(t.id),
      name: t.name,
      logo: t.logo,
      country: t.city,
      league: t.league,
      settings: preferences[t.id] || { goals: true, transfers: true, news: true }
    }));

    const res = await fetch('/api/webapp/save-teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, user, selectedTeams })
    });

    return res.ok;
  } catch (error) {
    console.error('saveUserTeams error:', error);
    return false;
  }
}

// Mock leagues data
const LEAGUES: League[] = [
  { id: 'l1', name: 'Turkish Super League', country: 'Türkiye', logo: 'https://www.thesportsdb.com/images/media/league/badge/x1va771565372556.png', season: '2024/25' },
  { id: 'l2', name: 'English Premier League', country: 'İngiltere', logo: 'https://www.thesportsdb.com/images/media/league/badge/i6o0kh1549879062.png', season: '2024/25' },
  { id: 'l3', name: 'Spanish La Liga', country: 'İspanya', logo: 'https://www.thesportsdb.com/images/media/league/badge/7onmyv1534768460.png', season: '2024/25' },
  { id: 'l4', name: 'German Bundesliga', country: 'Almanya', logo: 'https://www.thesportsdb.com/images/media/league/badge/0j55yv1534764799.png', season: '2024/25' },
  { id: 'l5', name: 'Italian Serie A', country: 'İtalya', logo: 'https://www.thesportsdb.com/images/media/league/badge/7onmyv1534768460.png', season: '2024/25' },
];

// --- Components ---

const Header: React.FC<{ onBack?: () => void, title?: string, rightAction?: React.ReactNode }> = ({ onBack, title, rightAction }) => (
  <header className="bg-white/80 backdrop-blur-md text-gray-900 p-4 sticky top-0 z-50 border-b border-gray-100 flex items-center justify-between shadow-sm">
    <div className="flex items-center space-x-3">
      {onBack && (
        <button onClick={onBack} className="p-1 -ml-1 text-[#2481cc]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      <h1 className={`font-black text-xl tracking-tight ${onBack ? 'text-lg' : ''}`}>
        {title || 'GOLLAPP'}
      </h1>
    </div>
    <div className="flex items-center">
      {rightAction}
    </div>
  </header>
);

const LeagueDetail: React.FC<{
  league: League,
  onBack: () => void,
  onTeamClick: (team: Team) => void
}> = ({ league, onBack, onTeamClick }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      const data = await fetchLeagueTeams(league.name);
      setTeams(data);
      setLoading(false);
    };
    loadTeams();
  }, [league.id]);

  return (
    <div className="animate-in slide-in-from-right duration-300 min-h-screen bg-white pb-24">
      <Header onBack={onBack} title={league.name} />

      {/* League Hero */}
      <div className="p-8 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <img src={league.logo} className="w-48 h-48 rotate-12" alt="" />
        </div>
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl mb-4">
            <img src={league.logo} alt={league.name} className="w-20 h-20 object-contain" />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">{league.name}</h2>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">{league.country}</span>
            <span className="text-xs bg-[#2481cc] px-3 py-1 rounded-full font-bold uppercase tracking-widest">{league.season}</span>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="px-4 mt-8">
        <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4 text-gray-900 px-2">Ligdeki Takımlar</h3>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Yükleniyor...</div>
        ) : teams.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Takım bulunamadı</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {teams.map(team => (
              <div
                key={team.id}
                onClick={() => onTeamClick(team)}
                className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center text-center space-y-2 active:scale-95 transition-all cursor-pointer"
              >
                <img src={team.logo} className="w-12 h-12 rounded-xl shadow-sm" alt="" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><text y="36" font-size="36">⚽</text></svg>'; }} />
                <span className="text-xs font-black uppercase italic text-gray-800">{team.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TeamDetail: React.FC<{
  team: Team,
  onBack: () => void,
  isFavorite: boolean,
  preferences?: TeamPreference,
  onOpenPrefModal: (e: React.MouseEvent, team: Team) => void,
  onRemoveFavorite: (e: React.MouseEvent, teamId: string) => void
}> = ({ team, onBack, isFavorite, preferences, onOpenPrefModal, onRemoveFavorite }) => {
  const [activeSubTab, setActiveSubTab] = useState<'info'>('info');

  return (
    <div className="animate-in slide-in-from-right duration-300 min-h-screen bg-white pb-24">
      <Header
        onBack={onBack}
        title={team.name}
        rightAction={
          <button
            onClick={(e) => isFavorite ? onRemoveFavorite(e, team.id) : onOpenPrefModal(e, team)}
            className={`p-2 rounded-full transition-all ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400'}`}
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </button>
        }
      />

      {/* Hero Section */}
      <div className="p-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${team.colors[0]} 0%, ${team.colors[1]} 100%)` }}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <img src={team.logo} className="w-32 h-32 grayscale" alt="" />
        </div>
        <div className="flex items-center space-x-6 relative z-10">
          <div className="bg-white p-2 rounded-3xl shadow-2xl">
            <img src={team.logo} alt={team.name} className="w-20 h-20 rounded-2xl object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><text y="60" font-size="60">⚽</text></svg>'; }} />
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-black uppercase italic">{team.name}</h2>
            <div className="flex items-center space-x-2 text-white/80 text-sm mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              <span>{team.city}</span>
            </div>
            <p className="text-xs mt-2 bg-black/20 px-2 py-1 rounded inline-block font-bold uppercase tracking-widest">{team.league}</p>
          </div>
        </div>
      </div>

      {/* Preferences Status */}
      <div className="px-4 mt-4">
        {isFavorite ? (
          <button
            onClick={(e) => onOpenPrefModal(e, team)}
            className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between group active:scale-95 transition-all"
          >
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Takip Ayarları</p>
              <div className="flex gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${preferences?.goals ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>GOL</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${preferences?.transfers ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>1H ÖNCE</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${preferences?.news ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>BAŞLANGIÇ</span>
              </div>
            </div>
            <div className="text-blue-500 font-bold text-xs flex items-center">
              DÜZENLE
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>
        ) : (
          <button
            onClick={(e) => onOpenPrefModal(e, team)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center space-x-3 group active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <span className="font-bold text-gray-600">Favorilere Ekle & Bildirimleri Ayarla</span>
          </button>
        )}
      </div>

      {/* Club Info */}
      <div className="px-4 mt-6">
        <div className="bg-gray-50 p-6 rounded-3xl space-y-5">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Stadyum</p>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🏟️</span>
              <p className="font-bold text-gray-800">{team.stadium}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Kuruluş</p>
              <div className="flex items-center space-x-2">
                <span className="text-lg">📅</span>
                <p className="font-bold text-gray-800">{team.founded}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Renkler</p>
              <div className="flex space-x-2 mt-1">
                {team.colors.map(c => <div key={c} className="w-8 h-8 rounded-xl border border-white shadow-md" style={{ backgroundColor: c }} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Record<string, TeamPreference>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'teams' | 'leagues' | 'favorites' | 'alerts'>('teams');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [tempPrefs, setTempPrefs] = useState<Omit<TeamPreference, 'teamId'>>({
    goals: true, transfers: true, news: true
  });

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      if (tg.expand) tg.expand();

      const initDataUnsafe = tg.initDataUnsafe;
      if (initDataUnsafe?.user) {
        const telegramUser = initDataUnsafe.user;
        setUserId(String(telegramUser.id));
        setUser({
          id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          username: telegramUser.username
        });

        // Load user's teams
        fetchUserTeams(String(telegramUser.id)).then(({ teams, preferences: prefs }) => {
          setFavorites(teams.map(t => t.id));
          setPreferences(prefs);
        });
      }
    }

    // Load initial teams
    fetchTeams('').then(setAllTeams);
  }, []);

  const openPrefModal = (e: React.MouseEvent, team: Team) => {
    e.stopPropagation();
    setEditingTeam(team);
    const existing = preferences[team.id];
    setTempPrefs(existing ? { goals: existing.goals, transfers: existing.transfers, news: existing.news } : { goals: true, transfers: true, news: true });
    setIsModalOpen(true);
    if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  };

  const savePreferences = async () => {
    if (!editingTeam) return;
    const teamId = editingTeam.id;

    const newPrefs = { ...preferences, [teamId]: { teamId, ...tempPrefs } };
    setPreferences(newPrefs);

    let newFavorites = favorites;
    if (!favorites.includes(teamId)) {
      newFavorites = [...favorites, teamId];
      setFavorites(newFavorites);
    }

    // Save to backend
    const favoriteTeams = allTeams.filter(t => newFavorites.includes(t.id) || t.id === teamId);
    if (!favoriteTeams.find(t => t.id === teamId)) {
      favoriteTeams.push(editingTeam);
    }

    await saveUserTeams(userId, user, favoriteTeams, newPrefs);

    setIsModalOpen(false);
    setEditingTeam(null);
    if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  };

  const removeFavorite = async (e: React.MouseEvent, teamId: string) => {
    e.stopPropagation();
    const performRemoval = async () => {
      const newFavorites = favorites.filter(id => id !== teamId);
      const newPrefs = { ...preferences };
      delete newPrefs[teamId];

      setFavorites(newFavorites);
      setPreferences(newPrefs);

      // Save to backend
      const favoriteTeams = allTeams.filter(t => newFavorites.includes(t.id));
      await saveUserTeams(userId, user, favoriteTeams, newPrefs);

      if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    };
    const tg = window.Telegram?.WebApp;
    if (tg?.showConfirm) {
      tg.showConfirm("Favorilerden çıkarılsın mı?", (ok) => ok && performRemoval());
    } else if (window.confirm("Favorilerden çıkarılsın mı?")) performRemoval();
  };

  // Search teams
  useEffect(() => {
    if (activeTab === 'teams' && searchTerm.length >= 2) {
      setLoading(true);
      fetchTeams(searchTerm).then(teams => {
        setAllTeams(teams);
        setLoading(false);
      });
    } else if (activeTab === 'teams' && searchTerm.length === 0) {
      setLoading(true);
      fetchTeams('').then(teams => {
        setAllTeams(teams);
        setLoading(false);
      });
    }
  }, [searchTerm, activeTab]);

  const filteredTeams = allTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) || team.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeagues = LEAGUES.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteTeams = allTeams.filter(team => favorites.includes(team.id));

  // Breadcrumb/Navigation Logic
  if (selectedTeam) {
    return (
      <TeamDetail
        team={selectedTeam}
        onBack={() => setSelectedTeam(null)}
        isFavorite={favorites.includes(selectedTeam.id)}
        preferences={preferences[selectedTeam.id]}
        onOpenPrefModal={openPrefModal}
        onRemoveFavorite={removeFavorite}
      />
    );
  }

  if (selectedLeague) {
    return (
      <LeagueDetail
        league={selectedLeague}
        onBack={() => setSelectedLeague(null)}
        onTeamClick={(team) => { setSelectedLeague(null); setSelectedTeam(team); }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white pb-24">
      <Header />
      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Universal Search Bar */}
        {(activeTab === 'teams' || activeTab === 'leagues') && (
          <div className="relative group mb-6">
            <input
              type="text"
              placeholder={activeTab === 'teams' ? "Takım, Lig veya Şehir..." : "Lig veya Ülke ara..."}
              className="w-full p-4 pl-12 rounded-[2rem] border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-50 shadow-sm bg-gray-50 transition-all text-gray-800 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#2481cc]">🔍</span>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-black italic uppercase text-gray-900 tracking-tighter">Takımlar</h2>
            </div>
            {loading ? (
              <div className="text-center py-10 text-gray-400">Yükleniyor...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredTeams.map(team => (
                  <div
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className="group bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-1 rounded-2xl bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <img src={team.logo} alt={team.name} className="w-14 h-14 rounded-xl object-cover shadow-inner" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><text y="42" font-size="42">⚽</text></svg>'; }} />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 leading-tight uppercase italic">{team.name}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{team.league}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => openPrefModal(e, team)}
                        className={`p-3 rounded-2xl transition-all ${favorites.includes(team.id) ? 'text-red-500 bg-red-50' : 'text-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leagues' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-black italic uppercase text-gray-900 tracking-tighter">Ligler</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {filteredLeagues.map(league => (
                <div
                  key={league.id}
                  onClick={() => setSelectedLeague(league)}
                  className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-blue-300 transition-all cursor-pointer active:scale-95 group"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                    <img src={league.logo} className="w-12 h-12 object-contain" alt="" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><text y="36" font-size="36">🏆</text></svg>'; }} />
                  </div>
                  <h3 className="font-black text-gray-900 italic uppercase leading-tight mb-1">{league.name}</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{league.country}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">Favoriler</h2>
            {favoriteTeams.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200 text-gray-400 italic">
                <p className="mb-2 text-6xl opacity-10">🏟️</p>
                <p className="mb-2">Takip edilen takım yok.</p>
                <button onClick={() => setActiveTab('teams')} className="text-[#2481cc] font-bold underline">Keşfetmeye başla</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {favoriteTeams.map(team => (
                  <div key={team.id} onClick={() => setSelectedTeam(team)} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-95 transition-all">
                    <div className="flex items-center space-x-4">
                      <img src={team.logo} alt={team.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><text y="42" font-size="42">⚽</text></svg>'; }} />
                      <div>
                        <h3 className="font-black text-gray-900 italic uppercase">{team.name}</h3>
                        <div className="flex gap-1 mt-1">
                          {preferences[team.id]?.goals && <span className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase font-black">Gol</span>}
                          {preferences[team.id]?.transfers && <span className="text-[8px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full uppercase font-black">1h Önce</span>}
                          {preferences[team.id]?.news && <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full uppercase font-black">Başlangıç</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button onClick={(e) => openPrefModal(e, team)} className="p-3 bg-blue-50 text-[#2481cc] rounded-2xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                      </button>
                      <button onClick={(e) => removeFavorite(e, team.id)} className="p-2 text-gray-200 hover:text-red-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">Bildirimler</h2>
              <button onClick={() => setNotifications([])} className="text-xs bg-red-50 text-red-500 font-black px-3 py-1 rounded-full uppercase tracking-tighter">TEMİZLE</button>
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 rounded-[3rem] text-gray-400">
                <p className="text-6xl mb-4 opacity-10">🔔</p>
                <p className="font-bold uppercase tracking-widest text-xs">Yeni bildirim bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map(notif => (
                  <div key={notif.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 border-l-8 border-blue-500 group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">{notif.teamName}</span>
                      <span className="text-[10px] text-gray-300 font-bold">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-800 text-sm font-semibold leading-relaxed">"{notif.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Preference Modal */}
      {isModalOpen && editingTeam && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-top duration-300">
            <div className="p-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="p-2 bg-gray-50 rounded-[2rem] shadow-inner">
                  <img src={editingTeam.logo} className="w-16 h-16 rounded-2xl" alt="" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text y="48" font-size="48">⚽</text></svg>'; }} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase italic leading-none">{editingTeam.name}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Bildirim Ayarları</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'goals', label: 'Goller', icon: '⚽', color: 'bg-green-50' },
                  { id: 'transfers', label: '1 Saat Önce', icon: '⏰', color: 'bg-orange-50' },
                  { id: 'news', label: 'Maç Başlangıcı', icon: '🎯', color: 'bg-blue-50' }
                ].map(pref => (
                  <label key={pref.id} className={`flex items-center justify-between p-4 ${pref.color} rounded-[2rem] cursor-pointer hover:opacity-80 transition-all border border-transparent active:scale-95`}>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{pref.icon}</span>
                      <span className="font-black text-gray-700 uppercase italic tracking-tighter">{pref.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={(tempPrefs as any)[pref.id]}
                      onChange={(e) => setTempPrefs({ ...tempPrefs, [pref.id]: e.target.checked })}
                      className="w-8 h-8 rounded-full border-gray-200 text-[#2481cc] focus:ring-offset-0"
                    />
                  </label>
                ))}
              </div>

              <div className="flex space-x-4 mt-10">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 px-4 rounded-[2rem] font-black uppercase text-gray-400 tracking-widest text-[10px] active:scale-95 transition-all"
                >
                  VAZGEÇ
                </button>
                <button
                  onClick={savePreferences}
                  className="flex-2 py-4 px-8 rounded-[2rem] font-black uppercase text-white bg-[#2481cc] tracking-widest text-[10px] shadow-xl shadow-blue-100 active:scale-95 transition-all"
                >
                  KAYDET
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Bar */}
      <nav className="fixed bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur-xl rounded-[2.5rem] flex justify-around p-2 z-50 shadow-2xl border border-white/10 overflow-hidden">
        {[
          { id: 'teams', label: 'TAKIM', icon: (active: boolean) => <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
          { id: 'leagues', label: 'LİG', icon: (active: boolean) => <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { id: 'favorites', label: 'FAV', icon: (active: boolean) => <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
          { id: 'alerts', label: 'ZİL', icon: (active: boolean) => <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id as any); setSelectedTeam(null); setSelectedLeague(null); }}
            className={`flex flex-col items-center px-4 py-2 rounded-[1.5rem] transition-all flex-1 ${activeTab === item.id ? 'bg-[#2481cc] text-white' : 'text-gray-500'}`}
          >
            {item.icon(activeTab === item.id)}
            <span className="text-[7px] mt-1 font-black tracking-[0.1em]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
