import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Flame, HelpCircle } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  streak?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onHelp?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  streak = 0,
  soundEnabled,
  onToggleSound,
  onHelp
}) => {
  return (
    <div className="h-14 px-4 flex items-center justify-between bg-[#13151f] border-b border-[#222536] text-white shrink-0 select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack ? (
          <button
            onClick={() => {
              audioManager.playClick();
              onBack?.();
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#202336] active:scale-95 transition-all"
            aria-label="Navigate back"
          >
            <ArrowLeft className="w-5 h-5 text-[#00ff88]" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88]/20 to-[#c084fc]/30 border border-[#00ff88]/40 flex items-center justify-center font-mono font-bold text-xs text-[#00ff88]">
            CQ
          </div>
        )}

        <div className="truncate">
          <h1 className="font-display text-sm font-bold tracking-tight text-white truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-mono truncate leading-none">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Streak indicator */}
        {streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff7700]/15 border border-[#ff7700]/40 text-[#ff9900] text-xs font-mono font-semibold animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-[#ff9900]" />
            <span>{streak}x</span>
          </div>
        )}

        {/* How to play trigger */}
        {onHelp && (
          <button
            onClick={() => {
              audioManager.playClick();
              onHelp();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#202336] transition-colors"
            title="How to Play"
            aria-label="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        {/* Sound toggle button */}
        <button
          onClick={() => {
            onToggleSound();
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            soundEnabled
              ? 'text-[#00ff88] hover:bg-[#00ff88]/10'
              : 'text-slate-500 hover:bg-slate-800'
          }`}
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#00ff88]" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>
    </div>
  );
};
