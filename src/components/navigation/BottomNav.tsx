import React from 'react';
import { Plus, Music, User as UserIcon, LogOut, X } from 'lucide-react';
import { StreamlineIcon, StreamlineIconName } from '../ui/StreamlineIcon';
import { AppLogo } from '../ui/AppLogo';

export type NavTab = 'home' | 'exercises' | 'workouts' | 'planning' | 'progress' | 'running';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  hasActiveWorkout?: boolean;
  onOpenActiveWorkout?: () => void;
  onCancelActiveWorkout?: () => void;
  displayName?: string;
  spotifyUrl?: string;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  isLoggedIn?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  hasActiveWorkout,
  onOpenActiveWorkout,
  onCancelActiveWorkout,
  displayName = 'Mon Espace',
  spotifyUrl = 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
  onOpenProfile,
  onLogout,
  isDarkMode = false,
  isLoggedIn = false,
}) => {
  const mainTabs: { id: NavTab; label: string; icon: StreamlineIconName; special?: boolean }[] = [
    { id: 'home', label: 'Accueil', icon: 'home' },
    { id: 'exercises', label: 'Exercices', icon: 'dumbbell' },
    ...(isLoggedIn ? [{ id: 'running' as NavTab, label: 'Running', icon: 'runner' as StreamlineIconName, special: true }] : []),
    { id: 'planning', label: 'Planning', icon: 'calendar' },
    { id: 'progress', label: 'Suivi', icon: 'heart-pulse' },
  ];

  const allDesktopTabs: { id: NavTab; label: string; icon: StreamlineIconName; special?: boolean }[] = [
    { id: 'home', label: 'Accueil', icon: 'home' },
    { id: 'exercises', label: 'Exercices', icon: 'dumbbell' },
    { id: 'workouts', label: 'Séances', icon: 'weightlifter' },
    ...(isLoggedIn ? [{ id: 'running' as NavTab, label: 'Running (⚡ Spécial)', icon: 'runner' as StreamlineIconName, special: true }] : []),
    { id: 'planning', label: 'Planning', icon: 'calendar' },
    { id: 'progress', label: 'Suivi', icon: 'heart-pulse' },
  ];

  return (
    <>
      {/* Desktop Left Sidebar (lg+) */}
      <aside
        className={`hidden lg:flex flex-col w-60 shrink-0 fixed top-0 bottom-0 left-0 z-30 p-5 justify-between transition-colors duration-300 ${
          isDarkMode
            ? 'bg-[#180413] border-r border-[#380A28] text-white'
            : 'bg-white border-r border-[#F3E5ED] text-[#2B091C]'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header (Click returns to Home) */}
          <button
            onClick={() => onTabChange('home')}
            className="w-full text-left flex items-center justify-between px-2 pt-1 group transition-transform active:scale-98"
            title="Retour à l'accueil"
          >
            <div>
              <span
                className={`font-display font-bold text-lg tracking-tight block leading-none transition-colors ${
                  isDarkMode
                    ? 'text-white group-hover:text-[#FBCFE8]'
                    : 'text-[#2B091C] group-hover:text-[#831843]'
                }`}
              >
                Glow Up Lab
              </span>
              <span
                className={`text-xs font-medium truncate block mt-1 ${
                  isDarkMode ? 'text-[#C29DB2]' : 'text-[#8C6D7E]'
                }`}
              >
                {displayName}
              </span>
            </div>
            <span className="w-9 h-9 rounded-2xl overflow-hidden shrink-0 shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10">
              <AppLogo size={36} variant="badge" />
            </span>
          </button>

          {/* Primary CTA on Desktop Sidebar */}
          <button
            onClick={() => onTabChange('workouts')}
            className="w-full py-3 px-4 rounded-full bg-[#831843] hover:bg-[#3B0726] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 min-h-[44px] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nouvelle séance</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {allDesktopTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all min-h-[44px] ${
                    isActive
                      ? isDarkMode
                        ? 'bg-[#831843] text-white shadow-xs'
                        : 'bg-[#F8EEF3] text-[#831843]'
                      : isDarkMode
                      ? 'text-[#C29DB2] hover:text-white hover:bg-[#280820]'
                      : 'text-[#7A616F] hover:text-[#2B091C] hover:bg-[#FAF5F8]'
                  }`}
                >
                  <StreamlineIcon
                    name={tab.icon}
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? isDarkMode
                          ? 'text-white'
                          : 'text-[#831843]'
                        : isDarkMode
                        ? 'text-[#EC4899]'
                        : 'text-[#EC4899]'
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Workout Resume on Desktop ONLY if active */}
          {hasActiveWorkout && onOpenActiveWorkout && (
            <div
              className={`p-3.5 rounded-2xl border space-y-2 ${
                isDarkMode
                  ? 'bg-[#26081D] border-[#5B1348] text-white'
                  : 'bg-[#F8EEF3] border-[#FBCFE8] text-[#2B091C]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold ${
                    isDarkMode ? 'text-[#FBCFE8]' : 'text-[#831843]'
                  }`}
                >
                  Séance en cours
                </span>
                {onCancelActiveWorkout && (
                  <button
                    onClick={onCancelActiveWorkout}
                    className="p-1 text-[#8C6D7E] hover:text-[#EC4899] rounded-full"
                    title="Terminer / Fermer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={onOpenActiveWorkout}
                className="w-full py-2 px-3 rounded-full bg-[#831843] hover:bg-[#9D174D] text-white text-xs font-semibold active:scale-98 transition-all"
              >
                Reprendre →
              </button>
            </div>
          )}
        </div>

        {/* Bottom User Profile & Quick Actions */}
        <div
          className={`pt-4 border-t flex items-center gap-2 ${
            isDarkMode ? 'border-[#380A28]' : 'border-[#F3E5ED]'
          }`}
        >
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className={`flex-1 py-2.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[42px] ${
                isDarkMode
                  ? 'bg-[#28071E] hover:bg-[#3B0726] text-[#FDF2F8]'
                  : 'bg-[#F8EEF3] hover:bg-[#F3E2EC] text-[#3B0726]'
              }`}
            >
              <UserIcon
                className={`w-3.5 h-3.5 ${
                  isDarkMode ? 'text-[#EC4899]' : 'text-[#831843]'
                }`}
              />
              <span className="truncate">Profil</span>
            </button>
          )}
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              isDarkMode
                ? 'bg-[#28071E] hover:bg-[#3B0726] text-[#EC4899]'
                : 'bg-[#F8EEF3] hover:bg-[#F3E2EC] text-[#831843]'
            }`}
            title="Playlist Spotify"
          >
            <Music className="w-4 h-4" />
          </a>
          {onLogout && (
            <button
              onClick={onLogout}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                isDarkMode
                  ? 'bg-[#28071E] hover:bg-[#3B0726] text-[#EC4899]'
                  : 'bg-[#F8EEF3] hover:bg-[#F3E2EC] text-[#831843]'
              }`}
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Floating Dock (Inspired by Reference: Left Pill Dock + Right Circular Action Button) */}
      <nav
        aria-label="Navigation principale"
        className="lg:hidden fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto flex items-center justify-between gap-3 pointer-events-none mb-[env(safe-area-inset-bottom)]"
      >
        {/* Left Pill Bar: Accueil, Exercices, Planning, Suivi */}
        <div className="pointer-events-auto flex-1 h-15 rounded-full bg-[#831843]/90 backdrop-blur-md border border-white/15 text-white px-2 flex items-center justify-around shadow-xl shadow-[#3B0726]/25">
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-12 rounded-full transition-all active:scale-95 cursor-pointer ${
                  isActive ? 'text-white' : 'text-[#FBCFE8]/75 hover:text-white'
                }`}
              >
                <StreamlineIcon
                  name={tab.icon}
                  className={`w-5 h-5 transition-transform ${isActive ? 'scale-105' : ''}`}
                />
                <span className="text-[10px] font-semibold tracking-tight mt-0.5 leading-none">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-white mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Detached Circular Button: Séance (+) */}
        <button
          onClick={() => {
            if (hasActiveWorkout && onOpenActiveWorkout) {
              onOpenActiveWorkout();
            } else {
              onTabChange('workouts');
            }
          }}
          aria-label="Séance"
          className={`pointer-events-auto w-15 h-15 rounded-full flex flex-col items-center justify-center shadow-xl transition-all active:scale-92 shrink-0 border border-white/20 cursor-pointer ${
            activeTab === 'workouts'
              ? 'bg-[#3B0726] text-white shadow-[#3B0726]/30'
              : 'bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-[#EC4899]/35'
          }`}
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
          <span className="text-[9px] font-bold leading-none mt-0.5">Séance</span>
        </button>
      </nav>
    </>
  );
};
