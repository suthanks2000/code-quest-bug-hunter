/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { AndroidFrame } from "./components/AndroidFrame";
import { TopAppBar } from "./components/TopAppBar";
import { NavigationBar } from "./components/NavigationBar";
import { HomeScreen } from "./screens/HomeScreen";
import { GameScreen } from "./screens/GameScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { HowToPlayScreen } from "./screens/HowToPlayScreen";
import { ExplorerScreen } from "./screens/ExplorerScreen";
import { KotlinCodeScreen } from "./screens/KotlinCodeScreen";
import { GameScreenType, GameSession, Difficulty, Topic, PlayerStats } from "./types/game";
import { QUESTION_BANK } from "./data/questionBank";
import { loadPlayerStats, savePlayerStats, updateStatsAfterGame } from "./utils/storage";
import { audioManager } from "./utils/audio";

export default function App() {
  const [stats, setStats] = useState<PlayerStats>(loadPlayerStats);
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>("home");
  const [session, setSession] = useState<GameSession | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Sync sound settings on boot
  useEffect(() => {
    audioManager.setMuted(!stats.soundEnabled);
  }, [stats.soundEnabled]);

  const toggleSound = () => {
    const isMuted = audioManager.toggleMute();
    const updated = { ...stats, soundEnabled: !isMuted };
    setStats(updated);
    savePlayerStats(updated);
  };

  // Launch a new hunt session
  const startGame = useCallback((difficulty: Difficulty | "all" = "all", topic: Topic | "all" = "all") => {
    let pool = [...QUESTION_BANK];

    if (difficulty !== "all") {
      pool = pool.filter((q) => q.difficulty === difficulty);
    }
    if (topic !== "all") {
      pool = pool.filter((q) => q.topic === topic);
    }

    if (pool.length === 0) {
      pool = [...QUESTION_BANK];
    }

    // Shuffle pool
    const shuffled = pool.sort(() => Math.random() - 0.5);
    // 10 questions per mission run
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    const newSession: GameSession = {
      difficulty,
      topic,
      questions: selected,
      currentIndex: 0,
      score: 0,
      streak: 0,
      bestStreakInSession: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeRemaining: 20,
      totalTimeTaken: 0,
      isAnswered: false,
      selectedAnswerIndex: null,
      history: []
    };

    setSession(newSession);
    setIsNewHighScore(false);
    setCurrentScreen("game");
  }, []);

  // Restart level with the exact same questions
  const restartLevel = useCallback(() => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        currentIndex: 0,
        score: 0,
        streak: 0,
        timeRemaining: 20,
        isAnswered: false,
        selectedAnswerIndex: null,
        history: [],
        correctAnswers: 0,
        wrongAnswers: 0,
        totalTimeTaken: 0
      };
    });
    setCurrentScreen("game");
  }, [session]);

  // Play again with fresh questions
  const playAgain = useCallback(() => {
    const diff = session?.difficulty ?? "all";
    const top = session?.topic ?? "all";
    startGame(diff, top);
  }, [session, startGame]);

  // Finish game session
  const finishGame = useCallback(() => {
    if (!session) return;
    const isNewHigh = session.score > stats.highScore;
    setIsNewHighScore(isNewHigh);

    const updated = updateStatsAfterGame(
      stats,
      session.score,
      session.bestStreakInSession,
      session.questions.length,
      session.correctAnswers
    );
    setStats(updated);
    setCurrentScreen("results");
  }, [session, stats]);

  // Screen Title & Subtitle for Material 3 TopAppBar
  const getScreenMeta = () => {
    switch (currentScreen) {
      case "game":
        return {
          title: "Bug Hunter Arena",
          subtitle: session ? `Level: ${session.difficulty} · ${session.topic}` : "Debugging...",
          showBack: true,
          onBack: () => setCurrentScreen("home")
        };
      case "results":
        return {
          title: "Mission Debrief",
          subtitle: "Performance Evaluation",
          showBack: true,
          onBack: () => setCurrentScreen("home")
        };
      case "how-to-play":
        return {
          title: "Hunter Field Manual",
          subtitle: "Rules & Multiplier Scoring",
          showBack: true,
          onBack: () => setCurrentScreen("home")
        };
      case "explorer":
        return {
          title: "50-Bug Bank Explorer",
          subtitle: "Offline Knowledge Base",
          showBack: false,
          onBack: undefined
        };
      case "kotlin-code":
        return {
          title: "Jetpack Compose M3",
          subtitle: "Native Android Studio Code",
          showBack: false,
          onBack: undefined
        };
      case "home":
      default:
        return {
          title: "Code Quest: Bug Hunter",
          subtitle: "Kotlin · Jetpack Compose · M3",
          showBack: false,
          onBack: undefined
        };
    }
  };

  const meta = getScreenMeta();

  return (
    <AndroidFrame>
      {/* Material 3 TopAppBar */}
      <TopAppBar
        title={meta.title}
        subtitle={meta.subtitle}
        showBack={meta.showBack}
        onBack={meta.onBack}
        streak={session?.streak ?? 0}
        soundEnabled={stats.soundEnabled}
        onToggleSound={toggleSound}
        onHelp={() => setCurrentScreen("how-to-play")}
      />

      {/* Primary Screen Body */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {currentScreen === "home" && (
          <HomeScreen
            stats={stats}
            onStartGame={startGame}
            onOpenHowToPlay={() => setCurrentScreen("how-to-play")}
            onOpenExplorer={() => setCurrentScreen("explorer")}
          />
        )}

        {currentScreen === "game" && session && (
          <GameScreen
            session={session}
            onUpdateSession={(updater) => setSession((prev) => (prev ? updater(prev) : null))}
            onFinishGame={finishGame}
            onRestartLevel={restartLevel}
            onExitGame={() => setCurrentScreen("home")}
          />
        )}

        {currentScreen === "results" && session && (
          <ResultsScreen
            session={session}
            stats={stats}
            isNewHighScore={isNewHighScore}
            onPlayAgain={playAgain}
            onRestartLevel={restartLevel}
            onBackToHome={() => setCurrentScreen("home")}
          />
        )}

        {currentScreen === "how-to-play" && (
          <HowToPlayScreen
            onBack={() => setCurrentScreen("home")}
            onStartGame={() => startGame("all", "all")}
          />
        )}

        {currentScreen === "explorer" && <ExplorerScreen />}

        {currentScreen === "kotlin-code" && <KotlinCodeScreen />}
      </main>

      {/* Material 3 Bottom NavigationBar */}
      <NavigationBar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          if (screen === "game" && !session) {
            startGame("all", "all");
          } else {
            setCurrentScreen(screen);
          }
        }}
        isGameActive={Boolean(session && currentScreen === "game")}
      />
    </AndroidFrame>
  );
}
