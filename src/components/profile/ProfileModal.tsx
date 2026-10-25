import React, { useState } from 'react';
import {
  X,
  LogOut,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StreamlineIcon } from '../ui/StreamlineIcon';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateUserProfile, logout, deleteAccount } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [spotifyUrl, setSpotifyUrl] = useState(profile?.spotifyUrl || '');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>(profile?.unitSystem || 'metric');
  const [defaultRestTime, setDefaultRestTime] = useState(profile?.defaultRestTime || 75);
  const [isSaved, setIsSaved] = useState(false);

  // Account deletion states (replaces window.confirm which is blocked in iframes)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [needsPasswordReauth, setNeedsPasswordReauth] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      displayName: displayName.trim(),
      spotifyUrl: spotifyUrl.trim(),
      unitSystem,
      defaultRestTime: Number(defaultRestTime),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleConfirmDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount(needsPasswordReauth ? reauthPassword : undefined);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'REQUIRES_PASSWORD_REAUTH') {
        setNeedsPasswordReauth(true);
        setDeleteError('Pour des raisons de sécurité, saisis ton mot de passe pour confirmer la suppression.');
      } else if (msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setDeleteError('Mot de passe incorrect. Veuillez réessayer.');
      } else {
        setDeleteError('Impossible de supprimer le compte pour le moment. Réessaie après t’être reconnectée.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3B0726]/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-[32px] bg-[#FCFBF9] p-6 shadow-2xl border border-[#E6E1D8] my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F5B8EE]">
          <div className="flex items-center gap-2">
            <StreamlineIcon name="user" className="w-5 h-5 text-[#EC4899] shrink-0" />
            <div>
              <h2 className="font-semibold text-[#3B0726] text-base font-display">
                Mon Profil & Paramètres
              </h2>
              <p className="text-[11px] text-[#6E6A63]">
                {profile?.email || 'Compte personnel'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6E6A63] hover:text-[#3B0726] rounded-full hover:bg-[#F2EFE9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs">
          {/* Preferences Form */}
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6E6A63] uppercase mb-1">
                Prénom ou Pseudonyme
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Votre prénom"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] focus:outline-hidden focus:border-[#3B0726]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6E6A63] uppercase mb-1">
                Lien de votre playlist Spotify
              </label>
              <input
                type="url"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F2EFE9] border border-[#E6E1D8] focus:outline-hidden focus:border-[#3B0726]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#6E6A63] uppercase mb-1">
                  Système d'unités
                </label>
                <select
                  value={unitSystem}
                  onChange={(e) => setUnitSystem(e.target.value as 'metric' | 'imperial')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E1D8] bg-[#F2EFE9]"
                >
                  <option value="metric">Métrique (kg / cm)</option>
                  <option value="imperial">Impérial (lbs / in)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6E6A63] uppercase mb-1">
                  Repos par défaut
                </label>
                <select
                  value={defaultRestTime}
                  onChange={(e) => setDefaultRestTime(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E1D8] bg-[#F2EFE9]"
                >
                  <option value={45}>45 secondes</option>
                  <option value={60}>60 secondes</option>
                  <option value={75}>75 secondes</option>
                  <option value={90}>90 secondes</option>
                  <option value={120}>2 minutes</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#F8A5F8] hover:bg-[#f58ef5] text-[#3B0726] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Enregistré !</span>
                </>
              ) : (
                <span>Sauvegarder mes préférences</span>
              )}
            </button>
          </form>

          {/* Account Actions */}
          <div className="pt-3 border-t border-[#F5B8EE] space-y-2.5">
            <button
              onClick={async () => {
                onClose();
                await logout();
              }}
              className="w-full py-2.5 rounded-full bg-[#831843] hover:bg-[#500724] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <LogOut className="w-4 h-4 text-[#FBCFE8]" />
              <span>Se déconnecter</span>
            </button>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setDeleteError(null);
                }}
                className="w-full py-2 rounded-full text-red-600 hover:bg-red-50 font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer mon compte et mes données</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-start gap-2 text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-red-900">
                      Supprimer définitivement ton compte ?
                    </p>
                    <p className="text-[11px] text-red-700 leading-relaxed">
                      Toutes tes séances, routines, mensurations et données personnelles seront effacées. Cette action est irréversible.
                    </p>
                  </div>
                </div>

                {needsPasswordReauth && (
                  <div className="pt-1">
                    <input
                      type="password"
                      value={reauthPassword}
                      onChange={(e) => setReauthPassword(e.target.value)}
                      placeholder="Ton mot de passe actuel"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-red-300 text-[#2B091C] focus:outline-hidden focus:border-red-600"
                    />
                  </div>
                )}

                {deleteError && (
                  <p className="text-[11px] font-medium text-red-600 bg-white/80 px-2.5 py-1.5 rounded-xl border border-red-200">
                    {deleteError}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setNeedsPasswordReauth(false);
                      setReauthPassword('');
                      setDeleteError(null);
                    }}
                    className="flex-1 py-2 rounded-full bg-white hover:bg-gray-100 text-[#3B0726] border border-[#E6E1D8] font-semibold text-[11px] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting || (needsPasswordReauth && !reauthPassword.trim())}
                    onClick={handleConfirmDeleteAccount}
                    className="flex-1 py-2 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isDeleting ? 'Suppression...' : 'Confirmer'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
