import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Globe, Bell, Check, X, ChevronDown, ListFilter, Trash2 } from 'lucide-react';

// --- Mock Data / Config ---
const LEAGUES = [
    { id: 'uefa_cl', name: 'UEFA Champions League', icon: '🏆', dbName: 'UEFA Champions League' },
    { id: 'eng_pl', name: 'Premier League', icon: '🦁', dbName: 'English Premier League' },
    { id: 'tr_sl', name: 'Trendyol Süper Lig', icon: '🇹🇷', dbName: 'Turkish Super League' },
    { id: 'es_ll', name: 'La Liga', icon: '🇪🇸', dbName: 'Spanish La Liga' },
];

function App() {
    const [user, setUser] = useState({ id: 123456, first_name: 'Misafir' });
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeLeague, setActiveLeague] = useState(null);
    const [leagueTeams, setLeagueTeams] = useState({});
    const [isLoadingLeagues, setIsLoadingLeagues] = useState({});

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.expand();
            tg.ready();
            if (tg.initDataUnsafe?.user) {
                setUser(tg.initDataUnsafe.user);
            }
            loadUserTeams(tg.initDataUnsafe?.user?.id || 123456);

            tg.MainButton.setText('DEĞİŞİKLİKLERİ KAYDET');
            tg.MainButton.setParams({ color: '#6366f1' });
            tg.MainButton.show();
            tg.MainButton.onClick(saveChanges);
        }
    }, []);

    const loadUserTeams = async (userId) => {
        try {
            const res = await fetch(`/api/webapp/user-teams?userId=${userId}`);
            const data = await res.json();
            if (data.teams) setSelectedTeams(data.teams);
        } catch (err) { console.error('Load Error:', err); }
    };

    const saveChanges = async () => {
        const tg = window.Telegram.WebApp;
        tg.MainButton.showProgress();
        try {
            const res = await fetch('/api/webapp/save-teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, teams: selectedTeams })
            });
            if (res.ok) tg.close();
        } catch (err) {
            tg.showAlert('Kaydetme hatası!');
        } finally {
            tg.MainButton.hideProgress();
        }
    };

    const handleSearch = async (val) => {
        setSearchTerm(val);
        if (val.length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await fetch(`/api/webapp/search-teams?q=${encodeURIComponent(val)}`);
            const data = await res.json();
            setSearchResults(data.teams || []);
        } catch (err) { console.error('Search Error:', err); }
        finally { setIsSearching(false); }
    };

    const toggleLeague = async (league) => {
        if (activeLeague === league.id) {
            setActiveLeague(null);
            return;
        }
        setActiveLeague(league.id);
        if (!leagueTeams[league.id]) {
            setIsLoadingLeagues(prev => ({ ...prev, [league.id]: true }));
            try {
                const res = await fetch(`/api/webapp/league-teams?league=${encodeURIComponent(league.dbName)}`);
                const data = await res.json();
                setLeagueTeams(prev => ({ ...prev, [league.id]: data.teams || [] }));
            } catch (err) { console.error('League Error:', err); }
            finally { setIsLoadingLeagues(prev => ({ ...prev, [league.id]: false })); }
        }
    };

    const toggleTeam = (team) => {
        const exists = selectedTeams.find(t => t.id === team.id);
        if (exists) {
            setSelectedTeams(prev => prev.filter(t => t.id !== team.id));
        } else {
            setSelectedTeams(prev => [...prev, { ...team, notificationType: 'all' }]);
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        }
    };

    const setNotifType = (id, type) => {
        setSelectedTeams(prev => prev.map(t => t.id === id ? { ...t, notificationType: type } : t));
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    };

    return (
        <div className="min-h-screen pb-24 text-slate-100 bg-[#0f172a]">
            {/* Header */}
            <header className="relative py-8 px-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-b-[40px] shadow-2xl overflow-hidden mb-6">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_-20%,#ffffff,transparent)]" />
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Takım Yönetimi</h1>
                    <p className="text-indigo-100/80 font-light">Favorilerini seç, bildirimleri yönet</p>
                </motion.div>
            </header>

            <div className="px-5 space-y-8">
                {/* Search */}
                <section className="-mt-12 relative z-20">
                    <div className="relative glass-premium rounded-2xl flex items-center px-4">
                        <Search className="w-5 h-5 text-indigo-400 opacity-60" />
                        <input
                            type="text"
                            placeholder="Dünya çapında takım ara..."
                            className="w-full bg-transparent border-none py-4 px-3 focus:outline-none text-white placeholder:text-slate-500"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {isSearching && <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mr-2" />}
                    </div>
                </section>

                {/* Search Results */}
                {searchTerm.length >= 2 && (
                    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <ListFilter className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-lg font-semibold tracking-wide">Arama Sonuçları</h2>
                        </div>
                        <div className="grid gap-3">
                            {searchResults.length > 0 ? (
                                searchResults.map(team => <TeamCard key={team.id} team={team} isSelected={selectedTeams.some(t => t.id === team.id)} onToggle={() => toggleTeam(team)} />)
                            ) : !isSearching && <p className="text-center py-4 opacity-50">Sonuç bulunamadı.</p>}
                        </div>
                    </motion.section>
                )}

                {/* Favorites */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <h2 className="text-lg font-semibold">Favorilerim</h2>
                        </div>
                        <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
                            {selectedTeams.length} Takım
                        </span>
                    </div>
                    <div className="space-y-4">
                        {selectedTeams.length > 0 ? (
                            selectedTeams.map(team => (
                                <div key={team.id} className="glass-premium rounded-[24px] overflow-hidden">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                                <img src={team.logo || '⚽'} className="w-10 h-10 object-contain" onError={(e) => e.target.src = '⚽'} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-100 leading-tight">{team.name}</h3>
                                                <p className="text-xs text-slate-500 mt-1">{team.country}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => toggleTeam(team)} className="p-2 text-red-400/50 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex gap-1 p-1 bg-white/5 border-t border-white/5">
                                        <button
                                            onClick={() => setNotifType(team.id, 'all')}
                                            className={`flex-1 py-3 text-xs font-semibold rounded-2xl transition-all ${team.notificationType === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-40'}`}
                                        >
                                            Tüm Bildirimler
                                        </button>
                                        <button
                                            onClick={() => setNotifType(team.id, 'goals')}
                                            className={`flex-1 py-3 text-xs font-semibold rounded-2xl transition-all ${team.notificationType === 'goals' ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-40'}`}
                                        >
                                            Sadece Goller
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 glass rounded-3xl opacity-40">
                                <Globe className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Henüz bir takım eklenmedi</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Global Leagues */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Globe className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-lg font-semibold tracking-wide">Popüler Ligler</h2>
                    </div>
                    <div className="space-y-3">
                        {LEAGUES.map(league => (
                            <div key={league.id} className="glass-premium rounded-2xl overflow-hidden transition-all duration-300">
                                <button
                                    onClick={() => toggleLeague(league)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-white/5 active:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{league.icon}</span>
                                        <span className="font-semibold tracking-tight">{league.name}</span>
                                    </div>
                                    <motion.div animate={{ rotate: activeLeague === league.id ? 180 : 0 }}>
                                        <ChevronDown className="w-4 h-4 opacity-40" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {activeLeague === league.id && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-black/10">
                                            <div className="p-3 grid gap-2">
                                                {isLoadingLeagues[league.id] ? (
                                                    <div className="p-8 flex items-center justify-center opacity-30">
                                                        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent animate-spin rounded-full" />
                                                    </div>
                                                ) : leagueTeams[league.id]?.map(team => (
                                                    <TeamCard
                                                        key={team.id}
                                                        team={team}
                                                        isSelected={selectedTeams.some(t => t.id === team.id)}
                                                        onToggle={() => toggleTeam(team)}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function TeamCard({ team, isSelected, onToggle }) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onToggle}
            className={`p-4 rounded-3xl flex items-center gap-4 transition-all duration-300 border ${isSelected ? 'bg-indigo-600/10 border-indigo-500/40 opacity-100' : 'glass border-white/5 opacity-80'}`}
        >
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0">
                <img
                    src={team.logo || '⚽'}
                    className="w-10 h-10 object-contain"
                    onError={(e) => e.target.src = '⚽'}
                />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-slate-100 truncate">{team.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-widest">{team.country}</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/5 text-slate-600'}`}>
                {isSelected ? <Check className="w-4 h-4" /> : <Star className="w-4 h-4" />}
            </div>
        </motion.div>
    );
}

export default App;
