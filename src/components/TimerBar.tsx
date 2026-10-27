import React from "react";
import { Clock } from "lucide-react";

interface TimerBarProps {
  timeRemaining: number;
  totalTime?: number;
  isPaused?: boolean;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  timeRemaining,
  totalTime = 20,
}) => {
  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  const isUrgent = timeRemaining <= 5;
  const isWarning = timeRemaining <= 10 && timeRemaining > 5;

  const colorClass = isUrgent
    ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
    : isWarning
    ? "bg-[#c084fc] shadow-[0_0_12px_rgba(192,132,252,0.5)]"
    : "bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.5)]";

  const textColorClass = isUrgent
    ? "text-rose-400 font-bold"
    : isWarning
    ? "text-purple-300 font-semibold"
    : "text-[#00ff88] font-semibold";

  return (
    <div className="w-full space-y-1.5 select-none">
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className={`w-3.5 h-3.5 ${isUrgent ? "text-rose-400 animate-bounce" : "text-slate-400"}`} />
          <span className="text-[11px] uppercase tracking-wider font-mono">Time Remaining</span>
        </div>
        <div className={`font-mono text-xs tabular-nums ${textColorClass}`}>
          {timeRemaining}s <span className="text-slate-500 text-[10px]">/ {totalTime}s</span>
        </div>
      </div>

      <div className="h-2 w-full bg-[#1b1d28] rounded-full overflow-hidden border border-[#2d3142]/60 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-linear ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
