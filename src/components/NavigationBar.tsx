import React from 'react';
import { Radar, PlayCircle, Database, Code2 } from 'lucide-react';
import { GameScreenType } from '../types/game';
import { audioManager } from '../utils/audio';

interface NavigationBarProps {
  currentScreen: GameScreenType;
  onNavigate: (screen: GameScreenType) => void;
  isGameActive: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentScreen,
  onNavigate,
  isGameActive
}) => {
  const tabs = [
    {
      id: 'home' as GameScreenType,
      label: 'HQ Radar',
      icon: Radar
    },
    {
      id: 'game' as GameScreenType,
      label: isGameActive ? 'Hunt Arena' : 'New Hunt',
      icon: PlayCircle,
      highlight: isGameActive
    },
    {
      id: 'explorer' as GameScreenType,
      label: 'Bug Bank',
      icon: Database
    },
    {
      id: 'kotlin-code' as GameScreenType,
      label: 'Compose M3',
      icon: Code2
    }
  ];

  return (
    <nav className="h-16 bg-[#11131c] border-t border-[#1f2233] px-2 flex items-center justify-around shrink-0 select-none safe-pb">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              audioManager.playClick();
              onNavigate(tab.id);
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              isActive
                ? 'text-[#00ff88]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active Pill Indicator in Material 3 style */}
            <div
              className={`w-12 h-7 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#00ff88]/15 border border-[#00ff88]/30 shadow-[0_0_12px_rgba(0,255,136,0.2)]'
                  : tab.highlight
                  ? 'bg-[#c084fc]/15 border border-[#c084fc]/30'
                  : 'bg-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#00ff88]' : tab.highlight ? 'text-[#c084fc]' : 'text-slate-400'}`} />
            </div>

            <span className={`text-[10px] tracking-tight font-medium mt-1 ${isActive ? 'text-[#00ff88] font-semibold' : 'text-slate-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
