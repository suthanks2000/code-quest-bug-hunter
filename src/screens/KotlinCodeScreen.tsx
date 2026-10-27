import React, { useState } from "react";
import { Copy, Check, Code2, FileCode, Download } from "lucide-react";
import { audioManager } from "../utils/audio";

const KOTLIN_FILES: Record<string, { filename: string; path: string; description: string; code: string }> = {
  mainActivity: {
    filename: "MainActivity.kt",
    path: "app/src/main/java/com/codequest/bughunter/MainActivity.kt",
    description: "Android Entry Point with ComponentActivity, Edge-to-Edge and Compose setContent",
    code: `package com.codequest.bughunter

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.codequest.bughunter.ui.BugHunterApp
import com.codequest.bughunter.ui.theme.BugHunterTheme
import com.codequest.bughunter.viewmodel.GameViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BugHunterTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val gameViewModel: GameViewModel = viewModel()
                    BugHunterApp(viewModel = gameViewModel)
                }
            }
        }
    }
}`
  },

  theme: {
    filename: "Theme.kt",
    path: "app/src/main/java/com/codequest/bughunter/ui/theme/Theme.kt",
    description: "Material 3 Dark Theme with Neon Green (#00FF88) and Neon Purple (#C084FC) Accents",
    code: `package com.codequest.bughunter.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val NeonGreen = Color(0xFF00FF88)
val NeonPurple = Color(0xFFC084FC)
val DarkBackground = Color(0xFF0C0D12)
val DarkSurface = Color(0xFF13151F)
val DarkSurfaceContainer = Color(0xFF1A1D2B)
val ErrorRed = Color(0xFFEF4444)
val TextPrimary = Color(0xFFE2E8F0)

private val DarkColorScheme = darkColorScheme(
    primary = NeonGreen,
    onPrimary = Color(0xFF05140B),
    secondary = NeonPurple,
    onSecondary = Color(0xFF1A092E),
    background = DarkBackground,
    onBackground = TextPrimary,
    surface = DarkSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkSurfaceContainer,
    error = ErrorRed
)

@Composable
fun BugHunterTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}`
  },

  viewModel: {
    filename: "GameViewModel.kt",
    path: "app/src/main/java/com/codequest/bughunter/viewmodel/GameViewModel.kt",
    description: "Jetpack ViewModel managing 20s Coroutine Timer, Scoring, Streaks and Local Persistence",
    code: `package com.codequest.bughunter.viewmodel

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.codequest.bughunter.data.Question
import com.codequest.bughunter.data.QuestionBank
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class GameUiState(
    val currentScreen: String = "home",
    val questions: List<Question> = emptyList(),
    val currentIndex: Int = 0,
    val score: Int = 0,
    val streak: Int = 0,
    val bestStreak: Int = 0,
    val timeRemaining: Int = 20,
    val isAnswered: Boolean = false,
    val selectedOptionIndex: Int? = null,
    val isCorrect: Boolean = false,
    val highScore: Int = 0,
    val totalBugsSquashed: Int = 0
)

class GameViewModel(application: Application) : AndroidViewModel(application) {
    private val prefs = application.getSharedPreferences("bug_hunter_prefs", Context.MODE_PRIVATE)

    private val _uiState = MutableStateFlow(
        GameUiState(
            highScore = prefs.getInt("high_score", 0),
            totalBugsSquashed = prefs.getInt("total_squashed", 0)
        )
    )
    val uiState: StateFlow<GameUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null

    fun startGame(difficulty: String = "all", topic: String = "all") {
        val filtered = QuestionBank.getQuestions(difficulty, topic).shuffled().take(10)
        _uiState.update {
            it.copy(
                currentScreen = "game",
                questions = filtered,
                currentIndex = 0,
                score = 0,
                streak = 0,
                timeRemaining = 20,
                isAnswered = false,
                selectedOptionIndex = null
            )
        }
        startTimer()
    }

    private fun startTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (_uiState.value.timeRemaining > 0 && !_uiState.value.isAnswered) {
                delay(1000L)
                _uiState.update { it.copy(timeRemaining = it.timeRemaining - 1) }
            }
            if (_uiState.value.timeRemaining <= 0 && !_uiState.value.isAnswered) {
                handleTimeout()
            }
        }
    }

    fun submitAnswer(optionIndex: Int) {
        if (_uiState.value.isAnswered) return
        timerJob?.cancel()

        val state = _uiState.value
        val question = state.questions[state.currentIndex]
        val isCorrect = optionIndex == question.correctIndex

        val pointsEarned = if (isCorrect) {
            val base = if (question.difficulty == "hard") 300 else if (question.difficulty == "medium") 200 else 100
            val speedBonus = state.timeRemaining * 10
            val mult = if (state.streak >= 4) 2.0 else if (state.streak >= 2) 1.5 else 1.0
            ((base + speedBonus) * mult).toInt()
        } else 0

        val newStreak = if (isCorrect) state.streak + 1 else 0

        _uiState.update {
            it.copy(
                isAnswered = true,
                selectedOptionIndex = optionIndex,
                isCorrect = isCorrect,
                score = it.score + pointsEarned,
                streak = newStreak,
                bestStreak = maxOf(it.bestStreak, newStreak),
                totalBugsSquashed = if (isCorrect) it.totalBugsSquashed + 1 else it.totalBugsSquashed
            )
        }
    }

    private fun handleTimeout() {
        _uiState.update {
            it.copy(
                isAnswered = true,
                selectedOptionIndex = -1,
                isCorrect = false,
                streak = 0
            )
        }
    }

    fun nextQuestion() {
        val state = _uiState.value
        if (state.currentIndex + 1 >= state.questions.size) {
            finishGame()
        } else {
            _uiState.update {
                it.copy(
                    currentIndex = it.currentIndex + 1,
                    timeRemaining = 20,
                    isAnswered = false,
                    selectedOptionIndex = null
                )
            }
            startTimer()
        }
    }

    private fun finishGame() {
        val currentScore = _uiState.value.score
        val prevHigh = _uiState.value.highScore
        val newHigh = maxOf(currentScore, prevHigh)

        prefs.edit()
            .putInt("high_score", newHigh)
            .putInt("total_squashed", _uiState.value.totalBugsSquashed)
            .apply()

        _uiState.update { it.copy(currentScreen = "results", highScore = newHigh) }
    }

    fun restartLevel() {
        _uiState.update {
            it.copy(
                currentScreen = "game",
                currentIndex = 0,
                score = 0,
                streak = 0,
                timeRemaining = 20,
                isAnswered = false,
                selectedOptionIndex = null
            )
        }
        startTimer()
    }
}`
  },

  composeApp: {
    filename: "BugHunterApp.kt",
    path: "app/src/main/java/com/codequest/bughunter/ui/BugHunterApp.kt",
    description: "Jetpack Compose Scaffold with Material 3 TopAppBar, NavigationBar, and Game Arena",
    code: `package com.codequest.bughunter.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.codequest.bughunter.ui.theme.NeonGreen
import com.codequest.bughunter.viewmodel.GameViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BugHunterApp(viewModel: GameViewModel) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Code Quest: Bug Hunter") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface,
                    titleContentColor = NeonGreen
                )
            )
        },
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                NavigationBarItem(
                    selected = state.currentScreen == "home",
                    onClick = { viewModel.startGame() },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("HQ Radar") }
                )
                NavigationBarItem(
                    selected = state.currentScreen == "game",
                    onClick = { viewModel.restartLevel() },
                    icon = { Icon(Icons.Default.PlayArrow, contentDescription = "Game") },
                    label = { Text("Arena") }
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Interactive Material 3 Game Views
        }
    }
}`
  },

  gradle: {
    filename: "build.gradle.kts",
    path: "app/build.gradle.kts",
    description: "Gradle KTS Configuration with Jetpack Compose BOM and Material 3 Dependencies",
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.codequest.bughunter"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.codequest.bughunter"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.10.01")
    implementation(composeBom)
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.core:core-ktx:1.15.0")
}`
  }
};

export const KotlinCodeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("mainActivity");
  const [copied, setCopied] = useState<boolean>(false);

  const current = KOTLIN_FILES[activeTab];

  const handleCopy = () => {
    audioManager.playClick();
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-5 flex flex-col overflow-y-auto space-y-3.5 select-none">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-[#c084fc] font-mono uppercase">
          <Code2 className="w-3.5 h-3.5" />
          <span>Native Kotlin & Jetpack Compose</span>
        </div>
        <h2 className="font-display text-lg font-bold text-white mt-0.5">
          Android Studio Codebase
        </h2>
        <p className="text-xs text-slate-400">
          Native Android Material 3 implementation matching this game engine.
        </p>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {Object.entries(KOTLIN_FILES).map(([key, item]) => (
          <button
            key={key}
            onClick={() => {
              audioManager.playClick();
              setActiveTab(key);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap shrink-0 transition-colors ${
              activeTab === key
                ? "bg-[#c084fc]/20 border border-[#c084fc]/50 text-[#c084fc] font-semibold"
                : "bg-[#141624] border border-[#222538] text-slate-400 hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{item.filename}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-[#12141f] border border-[#212435] overflow-hidden flex-1 flex flex-col">
        <div className="p-3 bg-[#171926] border-b border-[#212435] flex items-center justify-between text-xs">
          <div>
            <div className="font-mono text-slate-200 text-xs font-semibold">{current.path}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{current.description}</div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/code-quest-bug-hunter.zip"
              download="code-quest-bug-hunter.zip"
              onClick={() => audioManager.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#00ff88]/15 hover:bg-[#00ff88]/25 border border-[#00ff88]/40 text-[#00ff88] transition-colors"
              title="Download complete project as ZIP archive"
            >
              <Download className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>Download ZIP</span>
            </a>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                copied
                  ? "bg-[#00ff88]/20 border border-[#00ff88] text-[#00ff88]"
                  : "bg-[#222638] hover:bg-[#2c3149] text-slate-300"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00ff88]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
        </div>

        <pre className="flex-1 p-3.5 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#0b0c13] selection:bg-[#c084fc]/30">
          <code>{current.code}</code>
        </pre>
      </div>
    </div>
  );
};
