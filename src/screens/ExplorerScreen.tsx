import React, { useState } from "react";
import { Search, Bug, ChevronDown, ChevronUp } from "lucide-react";
import { QUESTION_BANK } from "../data/questionBank";
import { Topic, Difficulty } from "../types/game";
import { CodeSnippet } from "../components/CodeSnippet";
import { audioManager } from "../utils/audio";

export const ExplorerScreen: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredQuestions = QUESTION_BANK.filter((q) => {
    if (selectedTopic !== "all" && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchQuestion = q.question.toLowerCase().includes(query);
      const matchBug = q.bugType.toLowerCase().includes(query);
      const matchCode = q.codeSnippet?.toLowerCase().includes(query);
      return matchTitle || matchQuestion || matchBug || matchCode;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    audioManager.playClick();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-5 flex flex-col overflow-y-auto space-y-3.5 select-none">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#00ff88] font-mono uppercase">
            <Bug className="w-3.5 h-3.5" />
            <span>Bug Database ({filteredQuestions.length}/50)</span>
          </div>
        </div>
        <h2 className="font-display text-lg font-bold text-white mt-0.5">
          50-Question Offline Bank
        </h2>
        <p className="text-xs text-slate-400">
          Search and study all coding bugs, code snippets, and explanations.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bugs by keyword, topic, or code..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141624] border border-[#25293d] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff88] transition-colors"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Stack:</span>
        {(["all", "javascript", "react", "nodejs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              audioManager.playClick();
              setSelectedTopic(t);
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-xs whitespace-nowrap shrink-0 transition-colors ${
              selectedTopic === t
                ? "bg-[#00ff88]/20 border border-[#00ff88]/50 text-[#00ff88] font-semibold"
                : "bg-[#141624] border border-[#222638] text-slate-400 hover:text-white"
            }`}
          >
            {t === "all" ? "All Stacks" : t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Level:</span>
        {(["all", "easy", "medium", "hard"] as const).map((d) => (
          <button
            key={d}
            onClick={() => {
              audioManager.playClick();
              setSelectedDifficulty(d);
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-xs capitalize whitespace-nowrap shrink-0 transition-colors ${
              selectedDifficulty === d
                ? "bg-[#c084fc]/20 border border-[#c084fc]/50 text-[#c084fc] font-semibold"
                : "bg-[#141624] border border-[#222638] text-slate-400 hover:text-white"
            }`}
          >
            {d === "all" ? "All Levels" : d}
          </button>
        ))}
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No matching bugs found. Try another search query.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="rounded-xl border border-[#212435] bg-[#12141f] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleExpand(q.id)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-[#181a28] transition-colors cursor-pointer"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#00ff88] font-bold">
                        #{idx + 1}
                      </span>
                      <span className="font-display font-semibold text-xs text-white">
                        {q.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span className="text-[#c084fc] uppercase">{q.topic}</span>
                      <span>·</span>
                      <span className="capitalize text-slate-400">{q.difficulty}</span>
                      <span>·</span>
                      <span className="text-slate-500">{q.bugType}</span>
                    </div>
                  </div>

                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-3 pt-0 space-y-2.5 border-t border-[#1e2133] mt-1 bg-[#0f111a] text-xs">
                    {q.codeSnippet && (
                      <div className="pt-2">
                        <CodeSnippet
                          code={q.codeSnippet}
                          language={q.codeLanguage}
                          bugType={q.bugType}
                        />
                      </div>
                    )}

                    <p className="text-slate-200 font-medium pt-1">
                      {q.question}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg font-mono text-[11px] flex items-center justify-between border ${
                            oIdx === q.correctIndex
                              ? "bg-[#00ff88]/15 border-[#00ff88]/40 text-[#00ff88] font-semibold"
                              : "bg-[#141622] border-[#222538] text-slate-400"
                          }`}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {oIdx === q.correctIndex && (
                            <span className="text-[10px] uppercase font-bold text-[#00ff88]">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#141624] border border-[#23273d] text-[11px] text-slate-300 leading-relaxed font-sans">
                      <span className="text-slate-400 font-mono text-[10px] uppercase block font-semibold mb-0.5">
                        Root Cause & Explanation:
                      </span>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
