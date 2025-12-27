
export interface Team {
  id: string;
  name: string;
  logo: string;
  league: string;
  city: string;
  stadium: string;
  founded: string;
  colors: string[]; // [primary, secondary]
}

export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
  season: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  status: 'played' | 'upcoming';
}

export interface StandingEntry {
  rank: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Notification {
  id: string;
  teamId: string;
  teamName: string;
  message: string;
  timestamp: number;
  type: 'goal' | 'transfer' | 'news';
}

export interface TeamPreference {
  teamId: string;
  goals: boolean;
  transfers: boolean;
  news: boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback: (ok: boolean) => void) => void;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
        };
      };
    };
  }
}
