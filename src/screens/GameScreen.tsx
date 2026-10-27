import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, RotateCcw, Pause, Play, Sparkles, Trophy, Flame } from 'lucide-react';
import { Question, GameSession, Difficulty } from '../types/game';
import { CodeSnippet } from '../components/CodeSnippet';
import { TimerBar } from '../components/TimerBar';
import { audioManager } from '../utils/audio';

interface GameScreenProps {
  session: GameSession;
  onUpdateSession: (updater: (prev: GameSession) => GameSession) => void;
  onFinishGame: () => void;
  onRestartLevel: () => void;
  onExitGame: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  session,
  onUpdateSession,
  onFinishGame,
  onRestartLevel,
  onExitGame
}) => {
  const currentQuestion: Question | undefined = session.questions[session.currentIndex];
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lastEarnedPoints, setLastEarnedPoints] = useState<number | null>(null);

  // Timer reference to strictly clear on unmount or pause
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer safely
  const clearActiveTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Timer loop effect: counts down from 20 to 0
  useEffect(() => {
    if (session.isAnswered || isPaused || !currentQuestion) {
      clearActiveTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      onUpdateSession((prev) => {
        if (prev.isAnswered || prev.timeRemaining <= 0) {
          return prev;
        }

        const nextTime = prev.timeRemaining - 1;

        // Audio tick in final 5 seconds
        if (nextTime <= 5 && nextTime > 0) {
          audioManager.playTick(nextTime <= 3);
        }

        // Handle timer expiry at 0
        if (nextTime <= 0) {
          audioManager.playWrong();
          return {
            ...prev,
            timeRemaining: 0,
            isAnswered: true,
            selectedAnswerIndex: -1, // -1 denotes timeout
            streak: 0,
            wrongAnswers: prev.wrongAnswers + 1,
            history: [
              ...prev.history,
              {
                questionId: currentQuestion.id,
                selectedOption: -1,
                correctOption: currentQuestion.correctIndex,
                isCorrect: false,
                timeTaken: 20,
                pointsEarned: 0
              }
            ]
          };
        }

        return {
          ...prev,
          timeRemaining: nextTime,
          totalTimeTaken: prev.totalTimeTaken + 1
        };
      });
    }, 1000);

    return () => clearActiveTimer();
  }, [session.currentIndex, session.isAnswered, isPaused, currentQuestion?.id]);

  // Handle player answer selection (strictly locks against double-scoring)
  const handleSelectOption = (index: number) => {
    if (session.isAnswered || isPaused || !currentQuestion) return;

    clearActiveTimer();
    const isCorrect = index === currentQuestion.correctIndex;
    const timeTaken = 20 - session.timeRemaining;

    // Calculate score
    let points = 0;
    let newStreak = session.streak;

    if (isCorrect) {
      newStreak += 1;
      // Difficulty base points
      const basePoints = currentQuestion.difficulty === 'hard' ? 300 : currentQuestion.difficulty === 'medium' ? 200 : 100;
      // Time bonus: fast answers earn more!
      const timeBonus = session.timeRemaining * 10;
      // Multiplier based on streak
      const multiplier = newStreak >= 10 ? 3.0 : newStreak >= 5 ? 2.0 : newStreak >= 3 ? 1.5 : 1.0;

      points = Math.round((basePoints + timeBonus) * multiplier);
      setLastEarnedPoints(points);
      audioManager.playCorrect(newStreak);
    } else {
      newStreak = 0;
      setLastEarnedPoints(0);
      audioManager.playWrong();
    }

    onUpdateSession((prev) => ({
      ...prev,
      isAnswered: true,
      selectedAnswerIndex: index,
      score: prev.score + points,
      streak: newStreak,
      bestStreakInSession: Math.max(prev.bestStreakInSession, newStreak),
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      wrongAnswers: isCorrect ? prev.wrongAnswers : prev.wrongAnswers + 1,
      history: [
        ...prev.history,
        {
          questionId: currentQuestion.id,
          selectedOption: index,
          correctOption: currentQuestion.correctIndex,
          isCorrect,
          timeTaken,
          pointsEarned: points
        }
      ]
    }));
  };

  // Next question or finish
  const handleNextQuestion = () => {
    audioManager.playClick();
    setLastEarnedPoints(null);
    clearActiveTimer();

    if (session.currentIndex + 1 >= session.questions.length) {
      onFinishGame();
    } else {
      onUpdateSession((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        timeRemaining: 20,
        isAnswered: false,
        selectedAnswerIndex: null
      }));
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
        <h3 className="text-lg font-bold text-white">No Questions in Session</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">Please return to HQ and select a topic.</p>
        <button
          onClick={onExitGame}
          className="px-4 py-2 rounded-xl bg-[#00ff88] text-[#05140b] font-bold text-xs"
        >
          Return to HQ
        </button>
      </div>
    );
  }

  const isLastQuestion = session.currentIndex + 1 >= session.questions.length;
  const isTimeout = session.isAnswered && session.selectedAnswerIndex === -1;
  const isSelectedCorrect = session.isAnswered && session.selectedAnswerIndex === currentQuestion.correctIndex;

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-5 overflow-y-auto space-y-3.5 select-none relative">
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1f2233]">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-full bg-[#1c1f2e] border border-[#2b2f45] text-slate-300 font-mono text-[11px] font-semibold">
            BUG #{session.currentIndex + 1} <span className="text-slate-500">/ {session.questions.length}</span>
          </div>
          <span className="text-[11px] font-mono text-[#c084fc] uppercase">
            {currentQuestion.topic}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Score */}
          <div className="text-right">
            <span className="font-mono text-xs text-slate-400">Score: </span>
            <span className="font-mono font-bold text-[#00ff88] text-sm tabular-nums">
              {session.score}
            </span>
          </div>

          {/* Pause Button */}
          <button
            onClick={() => {
              audioManager.playClick();
              setIsPaused(!isPaused);
            }}
            className="w-7 h-7 rounded-lg bg-[#181a28] border border-[#25283c] flex items-center justify-center text-slate-400 hover:text-white"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current text-[#00ff88]" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 20-Second Countdown Timer Bar */}
      <TimerBar
        timeRemaining={session.timeRemaining}
        totalTime={20}
        isPaused={isPaused}
      />

      {/* Pause Modal Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-30 bg-[#090b10]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1b1e2f] border border-[#2d3148] flex items-center justify-center mb-3 text-[#00ff88]">
            <Pause className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Mission Paused</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6 max-w-xs">
            Timer is frozen. Resume to continue debugging or restart this level.
          </p>
          <div className="w-full max-w-xs space-y-2">
            <button
              onClick={() => setIsPaused(false)}
              className="w-full py-2.5 rounded-xl bg-[#00ff88] text-[#05140b] font-bold text-xs flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Mission</span>
            </button>
            <button
              onClick={() => {
                setIsPaused(false);
                onRestartLevel();
              }}
              className="w-full py-2.5 rounded-xl bg-[#1a1d2c] border border-[#2a2d42] text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#23273b]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Level</span>
            </button>
            <button
              onClick={onExitGame}
              className="w-full py-2 text-slate-400 text-xs hover:text-rose-400 transition-colors"
            >
              Quit to HQ
            </button>
          </div>
        </div>
      )}

      {/* Question Title & Code Snippet */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white font-display leading-snug">
            {currentQuestion.title}
          </h2>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold border ${
            currentQuestion.difficulty === 'hard'
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
              : currentQuestion.difficulty === 'medium'
              ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
              : 'text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/30'
          }`}>
            {currentQuestion.difficulty}
          </span>
        </div>

        {currentQuestion.codeSnippet && (
          <CodeSnippet
            code={currentQuestion.codeSnippet}
            language={currentQuestion.codeLanguage}
            bugType={currentQuestion.bugType}
          />
        )}

        <p className="text-xs sm:text-sm text-slate-200 font-medium pt-1">
          {currentQuestion.question}
        </p>
      </div>

      {/* Multiple-Choice Options */}
      <div className="space-y-2 pt-1">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = session.selectedAnswerIndex === idx;
          const isCorrectAnswer = idx === currentQuestion.correctIndex;

          let btnStyle = 'bg-[#151724] border-[#25283a] text-slate-200 hover:border-[#383d54] hover:bg-[#1a1d2e]';

          if (session.isAnswered) {
            if (isCorrectAnswer) {
              btnStyle = 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] font-semibold shadow-[0_0_15px_rgba(0,255,136,0.25)]';
            } else if (isSelected) {
              btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold';
            } else {
              btnStyle = 'bg-[#11131c] border-[#1e202e] text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              disabled={session.isAnswered || isPaused}
              onClick={() => handleSelectOption(idx)}
              className={`w-full min-h-[48px] p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle} ${
                !session.isAnswered ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                  session.isAnswered && isCorrectAnswer
                    ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                    : session.isAnswered && isSelected
                    ? 'border-rose-400 text-rose-400 bg-rose-500/10'
                    : 'border-[#2d3145] text-slate-400 bg-[#1a1d2b]'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-mono text-xs leading-tight text-slate-200">
                  {option}
                </span>
              </div>

              {session.isAnswered && (
                <div className="shrink-0">
                  {isCorrectAnswer ? (
                    <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Feedback & In-depth Explanation Card */}
      {session.isAnswered && (
        <div className="rounded-2xl p-3.5 bg-[#141724] border border-[#2b3047] space-y-2.5 animate-in fade-in duration-200 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSelectedCorrect ? (
                <div className="flex items-center gap-1.5 text-[#00ff88] font-bold text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                  <span>BUG SQUASHED!</span>
                </div>
              ) : isTimeout ? (
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>TIME EXPIRED! BUG ESCAPED</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs font-mono">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>WRONG FIX! BUG REMAINED</span>
                </div>
              )}
            </div>

            {isSelectedCorrect && lastEarnedPoints !== null && (
              <span className="font-mono text-xs font-bold text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 px-2 py-0.5 rounded-full">
                +{lastEarnedPoints} PTS
              </span>
            )}
          </div>

          {/* Explanation Text */}
          <div className="text-xs text-slate-300 leading-relaxed font-sans bg-[#0c0d15] p-2.5 rounded-xl border border-[#202436]">
            <p className="text-slate-400 font-mono text-[10px] uppercase font-semibold mb-1">
              Bug Analysis & Resolution:
            </p>
            {currentQuestion.explanation}
          </div>

          {/* Advance Action Button */}
          <button
            onClick={handleNextQuestion}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d672] text-[#05140b] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer m3-ripple"
          >
            <span>{isLastQuestion ? 'SEE HUNT RESULTS' : 'NEXT BUG'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
