import React, { useState } from 'react';
import { Play, Trophy, Flame, Target, Bug, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Difficulty, Topic, PlayerStats } from '../types/game';
import { audioManager } from '../utils/audio';

interface HomeScreenProps {
  stats: PlayerStats;
  onStartGame: (difficulty: Difficulty | 'all', topic: Topic | 'all') => void;
  onOpenHowToPlay: () => void;
  onOpenExplorer: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onStartGame,
  onOpenHowToPlay,
  onOpenExplorer
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<Topic | 'all'>('all');

  const accuracy = stats.totalQuestionsAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100)
    : 0;

  // Hunter Rank title based on squashed bugs
  const getHunterRank = (bugs: number) => {
    if (bugs >= 100) return { title: 'Grandmaster Debugger', color: 'text-[#c084fc]', border: 'border-[#c084fc]/40' };
    if (bugs >= 50) return { title: 'Senior Bug Hunter', color: 'text-[#00ff88]', border: 'border-[#00ff88]/40' };
    if (bugs >= 20) return { title: 'Code Ranger', color: 'text-amber-400', border: 'border-amber-400/40' };
    if (bugs >= 5) return { title: 'Junior Exterminator', color: 'text-blue-400', border: 'border-blue-400/40' };
    return { title: 'Rookie Hunter', color: 'text-slate-300', border: 'border-slate-600' };
  };

  const rank = getHunterRank(stats.totalBugsSquashed);

  const topics: { id: Topic | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Stacks', icon: '⚡' },
    { id: 'javascript', label: 'JavaScript', icon: 'JS' },
    { id: 'react', label: 'React.js', icon: '⚛' },
    { id: 'nodejs', label: 'Node.js', icon: '🟢' },
  ];

  const difficulties: { id: Difficulty | 'all'; label: string; badge: string; color: string }[] = [
    { id: 'all', label: 'Adaptive', badge: 'All Levels', color: 'text-[#00ff88]' },
    { id: 'easy', label: 'Level 1', badge: 'Easy', color: 'text-emerald-400' },
    { id: 'medium', label: 'Level 2', badge: 'Medium', color: 'text-purple-400' },
    { id: 'hard', label: 'Level 3', badge: 'Hard', color: 'text-rose-400' },
  ];

  const handleLaunch = () => {
    audioManager.playClick();
    onStartGame(selectedDifficulty, selectedTopic);
  };

  return (
    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto space-y-5">
      {/* Hero Banner / Radar Header */}
      <div className="relative rounded-2xl p-4 bg-gradient-to-b from-[#181a27] to-[#12141e] border border-[#272b3d] shadow-lg overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#00ff88] font-mono tracking-wider uppercase mb-1">
              <Bug className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>Jetpack Compose · M3 Dark</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-white">
              Code Quest
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hunt 50 authentic programming bugs before timer expires!
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">High Score</span>
            <span className="font-mono text-xl font-bold text-[#00ff88] tabular-nums">
              {stats.highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Player Hunter Badge */}
        <div className="mt-4 pt-3 border-t border-[#232738] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#1a1d2e] border ${rank.border} ${rank.color}`}>
              {rank.title}
            </div>
            <span className="text-slate-400 text-[11px]">Rank Level</span>
          </div>
          <div className="text-slate-400 text-xs font-mono">
            Squashed: <span className="text-white font-semibold">{stats.totalBugsSquashed}</span>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-3 gap-2 text-center select-none">
        <div className="p-2.5 rounded-xl bg-[#141622] border border-[#232638]">
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-base font-bold text-white tabular-nums">
            {stats.highScore}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
            Best Score
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141622] border border-[#232638]">
          <div className="flex items-center justify-center text-[#ff7700] mb-1">
            <Flame className="w-4 h-4 text-[#ff7700]" />
          </div>
          <div className="font-mono text-base font-bold text-white tabular-nums">
            {stats.overallBestStreak}x
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
            Top Streak
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141622] border border-[#232638]">
          <div className="flex items-center justify-center text-[#00ff88] mb-1">
            <Target className="w-4 h-4 text-[#00ff88]" />
          </div>
          <div className="font-mono text-base font-bold text-white tabular-nums">
            {accuracy}%
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
            Accuracy
          </div>
        </div>
      </div>

      {/* Select Topic Segmented Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px] font-mono">
            1. Select Tech Stack
          </span>
          <span className="text-slate-500 text-[10px] font-mono">50 Questions Offline</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#12141f] rounded-xl border border-[#212436]">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                audioManager.playClick();
                setSelectedTopic(t.id);
              }}
              className={`py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                selectedTopic === t.id
                  ? 'bg-[#22253a] text-[#00ff88] font-semibold border border-[#00ff88]/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a28]'
              }`}
            >
              <span className="text-sm">{t.icon}</span>
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Select Difficulty Segmented Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px] font-mono">
            2. Mission Difficulty
          </span>
          <span className="text-slate-500 text-[10px] font-mono">20s per question</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#12141f] rounded-xl border border-[#212436]">
          {difficulties.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                audioManager.playClick();
                setSelectedDifficulty(d.id);
              }}
              className={`py-2 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center ${
                selectedDifficulty === d.id
                  ? 'bg-[#22253a] text-[#c084fc] font-semibold border border-[#c084fc]/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a28]'
              }`}
            >
              <span>{d.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Launch Action & Extra Nav Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleLaunch}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#00ff88] to-[#00d672] text-[#05140b] font-display font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,255,136,0.3)] hover:shadow-[0_4px_25px_rgba(0,255,136,0.45)] active:scale-[0.98] transition-all cursor-pointer m3-ripple"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>START BUG HUNT</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenHowToPlay();
            }}
            className="py-2.5 px-3 rounded-xl bg-[#141622] hover:bg-[#1b1e2e] border border-[#26293d] text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>How to Play</span>
          </button>
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenExplorer();
            }}
            className="py-2.5 px-3 rounded-xl bg-[#141622] hover:bg-[#1b1e2e] border border-[#26293d] text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#00ff88]" />
            <span>50-Bug Bank</span>
          </button>
        </div>
      </div>
    </div>
  );
};
