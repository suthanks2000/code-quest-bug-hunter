import { PlayerStats } from '../types/game';

const STORAGE_KEY = 'codequest_bughunter_stats_v1';

export const DEFAULT_STATS: PlayerStats = {
  highScore: 0,
  totalGamesPlayed: 0,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  overallBestStreak: 0,
  totalBugsSquashed: 0,
  soundEnabled: true,
  hapticsEnabled: true,
  unlockedLevels: ['easy', 'medium', 'hard']
};

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage quota or private mode fallback
  }
}

export function updateStatsAfterGame(
  currentStats: PlayerStats,
  sessionScore: number,
  sessionStreak: number,
  sessionQuestions: number,
  sessionCorrect: number
): PlayerStats {
  const updated: PlayerStats = {
    ...currentStats,
    highScore: Math.max(currentStats.highScore, sessionScore),
    totalGamesPlayed: currentStats.totalGamesPlayed + 1,
    totalQuestionsAnswered: currentStats.totalQuestionsAnswered + sessionQuestions,
    totalCorrect: currentStats.totalCorrect + sessionCorrect,
    overallBestStreak: Math.max(currentStats.overallBestStreak, sessionStreak),
    totalBugsSquashed: currentStats.totalBugsSquashed + sessionCorrect
  };
  savePlayerStats(updated);
  return updated;
}
