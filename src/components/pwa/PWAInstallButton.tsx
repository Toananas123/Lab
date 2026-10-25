import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { StreamlineIcon } from '../ui/StreamlineIcon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (deferredPrompt) {
    return (
      <button
        onClick={handleInstallClick}
        className={
          compact
            ? 'w-9 h-9 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] border border-[#EFE1E8] text-[#831843] flex items-center justify-center transition-all active:scale-95 shrink-0'
            : 'flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#3B0726] bg-[#F3E3F5] hover:bg-[#EBD2EE] rounded-full transition-all active:scale-95'
        }
        title="Installer l'application"
        aria-label="Installer l'application"
      >
        <Download className="w-4 h-4 text-[#831843]" />
        {!compact && <span className="whitespace-nowrap">Installer</span>}
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={
            compact
              ? 'w-9 h-9 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] border border-[#EFE1E8] text-[#831843] flex items-center justify-center transition-all active:scale-95 shrink-0'
              : 'flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#3B0726] bg-[#F3E3F5] hover:bg-[#EBD2EE] rounded-full transition-all active:scale-95'
          }
          title="Installer sur iPhone"
          aria-label="Installer sur iPhone"
        >
          <Smartphone className="w-4 h-4 text-[#831843]" />
          {!compact && <span className="whitespace-nowrap">Installer</span>}
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B091C]/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-[28px] bg-[#FDFBFD] p-6 shadow-2xl border border-[#FBCFE8] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#F3E6EC]">
                <div className="flex items-center gap-2">
                  <StreamlineIcon name="sparkle" className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <h3 className="font-display font-bold text-[#2B091C] text-sm">
                    Installer sur iPhone / iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-[#7A616F] hover:text-[#2B091C] rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-[#7A616F] leading-relaxed">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F6EDF2]">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#831843] text-white font-bold text-[10px] shrink-0">
                    1
                  </span>
                  <p>
                    Touchez le bouton <strong>Partager</strong> dans la barre Safari.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F6EDF2]">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#831843] text-white font-bold text-[10px] shrink-0">
                    2
                  </span>
                  <p>
                    Faites défiler et appuyez sur <strong>« Sur l’écran d’accueil »</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F6EDF2]">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#831843] text-white font-bold text-[10px] shrink-0">
                    3
                  </span>
                  <p>
                    Appuyez sur <strong>Ajouter</strong> en haut à droite.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-full bg-[#831843] text-white text-xs font-bold transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
