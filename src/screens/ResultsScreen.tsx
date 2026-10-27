import React, { useState, useEffect } from "react";
import { Trophy, Flame, Target, RotateCcw, Play, CheckCircle2, XCircle, ArrowLeft, Bug, ChevronDown, ChevronUp } from "lucide-react";
import { GameSession, PlayerStats } from "../types/game";
import { audioManager } from "../utils/audio";

interface ResultsScreenProps {
  session: GameSession;
  stats: PlayerStats;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  onRestartLevel: () => void;
  onBackToHome: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  session,
  stats,
  isNewHighScore,
  onPlayAgain,
  onRestartLevel,
  onBackToHome
}) => {
  const [showReview, setShowReview] = useState<boolean>(false);

  useEffect(() => {
    audioManager.playVictory();
  }, []);

  const totalQuestions = session.questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((session.correctAnswers / totalQuestions) * 100) : 0;

  const getGrade = () => {
    if (accuracy >= 90) return { letter: "S", color: "text-[#00ff88]", bg: "bg-[#00ff88]/15", border: "border-[#00ff88]/40", title: "Grandmaster Debugger" };
    if (accuracy >= 80) return { letter: "A", color: "text-emerald-400", bg: "bg-emerald-400/15", border: "border-emerald-400/40", title: "Senior Exterminator" };
    if (accuracy >= 65) return { letter: "B", color: "text-[#c084fc]", bg: "bg-[#c084fc]/15", border: "border-[#c084fc]/40", title: "Skilled Code Hunter" };
    if (accuracy >= 50) return { letter: "C", color: "text-amber-400", bg: "bg-amber-400/15", border: "border-amber-400/40", title: "Apprentice Hunter" };
    return { letter: "D", color: "text-rose-400", bg: "bg-rose-400/15", border: "border-rose-400/40", title: "Needs More Practice" };
  };

  const grade = getGrade();

  return (
    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto space-y-4 select-none">
      <div className="text-center pt-2 space-y-2">
        {isNewHighScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/50 text-[#00ff88] text-xs font-mono font-bold animate-pulse">
            <Trophy className="w-3.5 h-3.5" />
            <span>NEW HIGH SCORE RECORD!</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display text-4xl font-extrabold border shadow-lg ${grade.bg} ${grade.border} ${grade.color}`}>
            {grade.letter}
          </div>
          <div className="text-left">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Mission Debrief</span>
            <h2 className="font-display text-2xl font-bold text-white leading-tight">
              {grade.title}
            </h2>
            <p className="text-xs text-slate-400">
              Level: <span className="text-[#c084fc] font-mono capitalize">{session.difficulty}</span> · Stack: <span className="text-[#00ff88] font-mono capitalize">{session.topic}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-gradient-to-b from-[#161826] to-[#11131e] border border-[#26293d] shadow-lg text-center relative overflow-hidden">
        <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">
          Final Hunt Score
        </span>
        <div className="font-mono text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#86efac] to-[#c084fc] my-1 tabular-nums">
          {session.score.toLocaleString()}
        </div>
        <p className="text-xs text-slate-400">
          All-time High: <span className="font-mono text-[#00ff88] font-semibold">{stats.highScore.toLocaleString()}</span>
        </p>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#23263b]">
          <div>
            <div className="flex items-center justify-center gap-1 text-[#00ff88] mb-0.5">
              <Bug className="w-3.5 h-3.5" />
              <span className="font-mono text-base font-bold text-white tabular-nums">
                {session.correctAnswers}/{totalQuestions}
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Squashed</span>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[#c084fc] mb-0.5">
              <Target className="w-3.5 h-3.5" />
              <span className="font-mono text-base font-bold text-white tabular-nums">
                {accuracy}%
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Accuracy</span>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[#ff7700] mb-0.5">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-mono text-base font-bold text-white tabular-nums">
                {session.bestStreakInSession}x
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Max Streak</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => {
            audioManager.playClick();
            setShowReview(!showReview);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-[#141624] border border-[#24283d] text-xs font-medium text-slate-300 flex items-center justify-between hover:bg-[#1a1d2e] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-[#00ff88]" />
            <span>Review All {totalQuestions} Bugs & Explanations</span>
          </div>
          {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showReview && (
          <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1 animate-in fade-in duration-200">
            {session.questions.map((q, idx) => {
              const h = session.history[idx];
              const isCorrect = h?.isCorrect ?? false;
              const isTimeout = h?.selectedOption === -1;

              return (
                <div
                  key={q.id}
                  className="p-3 rounded-xl bg-[#10121b] border border-[#212435] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-200">
                      #{idx + 1}. {q.title}
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-[#00ff88] text-[11px] font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>+{h.pointsEarned}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 text-[11px] font-mono">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{isTimeout ? "Timed out" : "Missed"}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 text-[11px]">
                    Correct answer: <span className="text-[#00ff88] font-mono">{q.options[q.correctIndex]}</span>
                  </p>
                  <p className="text-slate-400 text-[11px] bg-[#161825] p-2 rounded border border-[#24273a] leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            audioManager.playClick();
            onPlayAgain();
          }}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d672] text-[#05140b] font-display font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,255,136,0.3)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer m3-ripple"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>PLAY AGAIN</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              audioManager.playClick();
              onRestartLevel();
            }}
            className="py-2.5 px-3 rounded-xl bg-[#161928] hover:bg-[#1d2136] border border-[#282c44] text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>Restart Level</span>
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onBackToHome();
            }}
            className="py-2.5 px-3 rounded-xl bg-[#161928] hover:bg-[#1d2136] border border-[#282c44] text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Back to HQ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
