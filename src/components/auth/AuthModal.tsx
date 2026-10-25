import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StreamlineIcon } from '../ui/StreamlineIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthWarning, setOauthWarning] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
      setErrorMsg(null);
      setSuccessMsg(null);
      setOauthWarning(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setOauthWarning(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        onClose();
      } else if (mode === 'register') {
        const trimmedFirstname = displayName.trim();
        if (!trimmedFirstname) {
          setErrorMsg('Veuillez renseigner votre prénom pour créer votre compte.');
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, trimmedFirstname);
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Un e-mail de réinitialisation vous a été envoyé.');
      }
    } catch (err: unknown) {
      const errString = err instanceof Error ? err.message : String(err);
      if (
        errString.includes('auth/invalid-credential') ||
        errString.includes('auth/wrong-password') ||
        errString.includes('auth/user-not-found')
      ) {
        setErrorMsg('Adresse e-mail ou mot de passe incorrect.');
      } else if (errString.includes('auth/email-already-in-use')) {
        setErrorMsg('Cette adresse e-mail possède déjà un compte. Connecte-toi directement.');
      } else if (errString.includes('auth/weak-password')) {
        setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      } else {
        setErrorMsg('Une erreur est survenue. Vérifie tes identifiants.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setOauthWarning(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : String(err);
      console.warn('Google sign-in prevented or failed:', errStr);
      setOauthWarning(
        'La connexion Google n’a pas pu aboutir dans cet environnement. Utilise la connexion par e-mail ci-dessous.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#3B0726]/45 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-[36px] sm:rounded-[36px] bg-[#FFF8FB] p-6 sm:p-8 shadow-2xl border-t sm:border border-[#FBCFE8] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle on mobile */}
        <div className="w-12 h-1.5 rounded-full bg-[#F472B6]/40 mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="font-display text-2xl font-bold text-[#3B0726] tracking-tight">
            {mode === 'login' ? (
              'Mon compte'
            ) : mode === 'register' ? (
              'Créer mon compte'
            ) : (
              'Mot de passe oublié'
            )}
          </h2>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FCE7F3]/70 hover:bg-[#FCE7F3] text-[#831843] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Control: Se connecter / Créer un compte */}
        {mode !== 'forgot' && (
          <div className="flex items-center p-1 rounded-full bg-[#FCE7F3]/70 border border-[#FBCFE8]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setOauthWarning(null);
              }}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#831843] text-white shadow-xs'
                  : 'text-[#831843]/75 hover:text-[#3B0726]'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setOauthWarning(null);
              }}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#831843] text-white shadow-xs'
                  : 'text-[#831843]/75 hover:text-[#3B0726]'
              }`}
            >
              Créer un compte
            </button>
          </div>
        )}

        {/* Alerts */}
        {oauthWarning && (
          <div className="p-3 rounded-2xl bg-[#FFF0F5] border border-[#F472B6] text-[#831843] text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#EC4899] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">{oauthWarning}</p>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 text-red-800 border border-red-200 text-xs font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
            {successMsg}
          </div>
        )}

        {/* Minimal Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div className="relative">
              <User className="w-4 h-4 text-[#EC4899] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ton prénom (ex: Chloé)"
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-[#FBCFE8] text-[#3B0726] font-semibold placeholder:text-[#9D7A8C] focus:outline-hidden focus:border-[#831843]"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="w-4 h-4 text-[#EC4899] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-[#FBCFE8] text-[#3B0726] font-semibold placeholder:text-[#9D7A8C] focus:outline-hidden focus:border-[#831843]"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="relative">
                <Lock className="w-4 h-4 text-[#EC4899] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-[#FBCFE8] text-[#3B0726] font-semibold placeholder:text-[#9D7A8C] focus:outline-hidden focus:border-[#831843]"
                />
              </div>
              {mode === 'login' && (
                <div className="flex justify-end pr-2">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#831843] font-bold hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Large Pill Primary Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[50px] py-3.5 px-6 rounded-full bg-gradient-to-r from-[#EC4899] via-[#DB2777] to-[#831843] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-60"
          >
            <span>
              {isSubmitting
                ? 'Chargement...'
                : mode === 'login'
                ? 'Se connecter'
                : mode === 'register'
                ? 'Créer mon compte'
                : 'Envoyer le lien'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Secondary Google Pill Button */}
        {mode !== 'forgot' ? (
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full min-h-[46px] py-3 px-5 rounded-full border border-[#FBCFE8] bg-white hover:bg-[#FFF0F5] text-[#3B0726] font-bold text-xs flex items-center justify-center gap-2.5 active:scale-98 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuer avec Google</span>
          </button>
        ) : (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-xs font-bold text-[#831843] hover:underline"
            >
              ← Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
