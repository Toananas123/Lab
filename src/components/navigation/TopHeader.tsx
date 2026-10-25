import React from 'react';
import { Music, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppLogo } from '../ui/AppLogo';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { StreamlineIcon } from '../ui/StreamlineIcon';

interface TopHeaderProps {
  onGoHome: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  isDarkMode?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onGoHome,
  onOpenProfile,
  onOpenAuth,
  isDarkMode = false,
}) => {
  const { user, profile } = useAuth();
  const rawName = profile?.displayName || user?.displayName || '';
  const displayName = rawName.trim();
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '';
  const spotifyUrl =
    profile?.spotifyUrl || 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM';

  return (
    <header
      className={`lg:hidden sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#180413]/90 border-[#380A28]'
          : 'bg-[#FDFBFD]/90 border-[#F2E4EC]/80'
      }`}
    >
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Left: Official App Logo (Click returns to Home) */}
        <button
          onClick={onGoHome}
          className="w-9 h-9 rounded-2xl overflow-hidden shadow-2xs shrink-0 active:scale-95 transition-transform flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10"
          title="Retour à l'accueil"
          aria-label="Accueil"
        >
          <AppLogo size={36} variant="badge" />
        </button>

        {/* Right: Actions + Unique Login/Profile Button */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton compact />

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
              isDarkMode
                ? 'bg-[#28071E] hover:bg-[#3B0726] border-[#4A1035] text-[#EC4899]'
                : 'bg-[#F6EDF2] hover:bg-[#FCE7F3] border-[#EFE1E8] text-[#831843]'
            }`}
            title="Playlist Spotify"
            aria-label="Playlist Spotify"
          >
            <Music className="w-4 h-4" />
          </a>

          <button
            onClick={user ? onOpenProfile : onOpenAuth}
            className={`h-9 pl-1.5 pr-3 rounded-full border flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isDarkMode
                ? 'bg-[#28071E] hover:bg-[#3B0726] border-[#4A1035] text-[#FDF2F8]'
                : 'bg-[#F6EDF2] hover:bg-[#FCE7F3] border-[#EFE1E8] text-[#2B091C]'
            }`}
            title={user ? 'Mon profil et réglages' : 'Mon compte'}
            aria-label={user ? 'Mon profil et réglages' : 'Mon compte'}
          >
            <span className="w-6 h-6 rounded-full bg-[#831843] text-white font-display font-bold text-[11px] flex items-center justify-center shrink-0">
              {initial || <StreamlineIcon name="user" className="w-3.5 h-3.5 text-[#FBCFE8]" />}
            </span>
            <span className="text-xs font-semibold max-w-[90px] truncate">
              {user ? displayName || 'Profil' : 'Mon compte'}
            </span>
            {user && (
              <SlidersHorizontal
                className={`w-3 h-3 shrink-0 ${
                  isDarkMode ? 'text-[#EC4899]' : 'text-[#831843]'
                }`}
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
