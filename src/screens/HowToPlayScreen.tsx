import React from 'react';
import { Timer, Award, Flame, Bug, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface HowToPlayScreenProps {
  onBack: () => void;
  onStartGame: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ onBack, onStartGame }) => {
  return (
    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto space-y-4 select-none">
      <div className="space-y-4">
        {/* Intro */}
        <div className="rounded-2xl p-4 bg-[#141624] border border-[#262a40] space-y-2">
          <div className="flex items-center gap-2 text-[#00ff88]">
            <Bug className="w-5 h-5" />
            <h2 className="font-display text-lg font-bold text-white">How Bug Hunter Works</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Welcome to <span className="text-[#00ff88] font-semibold">Code Quest: Bug Hunter</span>. Your mission is to analyze real-world programming code snippets, pinpoint critical runtime bugs or language quirks, and choose the correct fix before the timer runs out!
          </p>
        </div>

        {/* 4 Core Mechanics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-[#11131e] border border-[#212437] space-y-1">
            <div className="flex items-center gap-2 text-[#00ff88]">
              <Timer className="w-4 h-4" />
              <h3 className="font-mono text-xs font-bold text-white">20-Second Ticking Clock</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Each question has an individual 20-second timer. The bar turns purple at 10s and red at 5s with audio warning ticks. If time reaches 0, the bug escapes!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#11131e] border border-[#212437] space-y-1">
            <div className="flex items-center gap-2 text-[#c084fc]">
              <Award className="w-4 h-4" />
              <h3 className="font-mono text-xs font-bold text-white">Points & Speed Bonus</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Base points scale with difficulty: Easy (100 pts), Medium (200 pts), Hard (300 pts). Plus +10 bonus points for every second left on the clock!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#11131e] border border-[#212437] space-y-1">
            <div className="flex items-center gap-2 text-[#ff7700]">
              <Flame className="w-4 h-4" />
              <h3 className="font-mono text-xs font-bold text-white">Streak Multipliers</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              String together consecutive correct answers to activate multipliers: 3+ bugs = 1.5x, 5+ bugs = 2.0x, and 10+ bugs = 3.0x score boost!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#11131e] border border-[#212437] space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="font-mono text-xs font-bold text-white">Instant Explanations</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Every answer is followed immediately by a detailed technical breakdown of why the bug happens and best-practice solutions.
            </p>
          </div>
        </div>

        {/* Tech Stack Coverage */}
        <div className="p-3.5 rounded-xl bg-[#11131e] border border-[#212437] space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#00ff88]" />
            50-Question Bank Topics
          </h3>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <span className="font-mono text-[#00ff88] font-bold">JavaScript:</span>
              <span>Type coercion, closures, event loop microtasks, hoisting, NaN comparison, WeakMap.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-[#c084fc] font-bold">React.js:</span>
              <span>Hooks rules, stale closures, dependency arrays, key prop reconciliation, RSC, batching.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">Node.js:</span>
              <span>process.nextTick, libuv threadpool, stream backpressure, cluster workers, memory leaks.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            audioManager.playClick();
            onStartGame();
          }}
          className="w-full h-11 rounded-xl bg-[#00ff88] text-[#05140b] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer m3-ripple"
        >
          <span>START PLAYING NOW</span>
        </button>

        <button
          onClick={() => {
            audioManager.playClick();
            onBack();
          }}
          className="w-full py-2.5 rounded-xl bg-[#161825] border border-[#23263a] text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 hover:bg-[#1d2033]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span>Back to HQ</span>
        </button>
      </div>
    </div>
  );
};
