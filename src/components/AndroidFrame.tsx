import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 transition-all">
      {/* Top Desktop Controls Bar (Only visible on tablet/desktop) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md md:max-w-xl lg:max-w-2xl mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="font-mono text-[11px] text-slate-300">Android 14 · Jetpack Compose Material 3</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#141620] border border-[#262838] p-1 rounded-lg">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              isPhoneFrame
                ? 'bg-[#25283b] text-[#00ff88] font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="View in Android Phone Frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone Frame</span>
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              !isPhoneFrame
                ? 'bg-[#25283b] text-[#c084fc] font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="View in Expanded Responsive Layout"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Expanded</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isPhoneFrame
            ? 'sm:max-w-[420px] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[44px] sm:border-[8px] sm:border-[#202230] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,255,136,0.06)]'
            : 'max-w-3xl sm:rounded-2xl sm:border sm:border-[#222536] min-h-screen sm:min-h-[820px] shadow-2xl'
        } bg-[#0e1017] overflow-hidden`}
      >
        {/* Android Status Bar (Always present for authentic native feeling) */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 pt-2 pb-1 bg-[#0e1017]/95 backdrop-blur-md select-none shrink-0 border-b border-[#1c1f2e]">
          {/* Status Bar Left: Dynamic Time */}
          <span className="font-mono text-xs font-semibold tracking-tight text-slate-300">
            {currentTime}
          </span>

          {/* Camera Punch-Hole (In Phone Frame mode) */}
          {isPhoneFrame && (
            <div className="w-3.5 h-3.5 rounded-full bg-[#050608] border border-[#222536] shadow-inner" />
          )}

          {/* Status Bar Right: 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono font-medium text-slate-400">98%</span>
              <BatteryMedium className="w-4 h-4 text-[#00ff88]" />
            </div>
          </div>
        </header>

        {/* Screen Content Body */}
        <div className="flex-1 flex flex-col overflow-y-auto relative bg-[#0e1017]">
          {children}
        </div>

        {/* Android Bottom Navigation Gesture Pill */}
        <div className="bg-[#0e1017] pt-1 pb-2 flex items-center justify-center select-none shrink-0 border-t border-[#181a26]">
          <div className="w-32 h-1 rounded-full bg-slate-500/40 hover:bg-slate-400/60 transition-colors" />
        </div>
      </div>
    </div>
  );
};
