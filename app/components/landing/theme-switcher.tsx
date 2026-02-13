"use client";

import { useTheme } from "@/app/lib/theme-context";
import { Palette } from "lucide-react";
import { useState } from "react";

const THEME_COLORS: Record<string, string> = {
  "blue-steel": "bg-blue-600",
  "gradient-glass": "bg-gradient-to-r from-blue-600 to-purple-600",
  "burnt-orange": "bg-orange-500",
  "dark-navy": "bg-[#0B1426]",
  "midnight-aurora": "bg-gradient-to-r from-teal-500 to-rose-500",
  "rose-gold": "bg-gradient-to-r from-rose-500 to-pink-600",
  "forest-emerald": "bg-gradient-to-r from-emerald-600 to-teal-700",
};

export function ThemeSwitcher() {
  const { theme, setTheme, allThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Theme panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 mb-2 w-64 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Switch Theme
          </p>
          <div className="space-y-1.5">
            {allThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  theme.id === t.id
                    ? "bg-slate-100 ring-2 ring-slate-900"
                    : "hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex-shrink-0 ${THEME_COLORS[t.id]} ring-2 ring-white shadow`}
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-800 transition-colors hover:scale-105 active:scale-95"
        aria-label="Switch theme"
      >
        <Palette className="h-5 w-5" />
      </button>
    </div>
  );
}
