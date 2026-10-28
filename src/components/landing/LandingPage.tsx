import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Timer, Sparkles, Calendar, TrendingUp, Trophy } from 'lucide-react';
import { StreamlineIcon, StreamlineIconName } from '../ui/StreamlineIcon';
import { AppLogo } from '../ui/AppLogo';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

const HERO_PILLARS: {
  id: 'workout' | 'planning' | 'progress';
  label: string;
  tabLabel: string;
}[] = [
  { id: 'workout', label: 'Musculation', tabLabel: 'Mode Séance' },
  { id: 'planning', label: 'Planning hebdomadaire', tabLabel: 'Planning 7j' },
  { id: 'progress', label: 'Suivi des charges', tabLabel: 'Suivi & PR' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenRegister }) => {
  const [previewTab, setPreviewTab] = useState<'workout' | 'planning' | 'progress'>('workout');
  const [autoCycle, setAutoCycle] = useState(true);
  const [demoSets, setDemoSets] = useState([
    { id: 1, weight: 80, reps: 10, done: true },
    { id: 2, weight: 85, reps: 10, done: true },
    { id: 3, weight: 85, reps: 10, done: false },
  ]);

  // Smooth auto-cycling across the 3 pillars unless user interacts manually
  useEffect(() => {
    if (!autoCycle) return;
    const order: ('workout' | 'planning' | 'progress')[] = ['workout', 'planning', 'progress'];
    const interval = setInterval(() => {
      setPreviewTab((current) => {
        const nextIdx = (order.indexOf(current) + 1) % order.length;
        return order[nextIdx];
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [autoCycle]);

  const handleSelectPillar = (tab: 'workout' | 'planning' | 'progress') => {
    setAutoCycle(false);
    setPreviewTab(tab);
  };

  const toggleDemoSet = (id: number) => {
    setAutoCycle(false);
    setDemoSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  };

  const weekDays: {
    day: string;
    short: string;
    activity: string;
    detail: string;
    icon: StreamlineIconName;
    isRest?: boolean;
  }[] = [
    { day: 'Lundi', short: 'Lun', activity: 'Focus Fessiers', detail: '4 exercices · 50 min', icon: 'kettlebell' },
    { day: 'Mardi', short: 'Mar', activity: 'Pilates & Core', detail: 'Mobilité · 35 min', icon: 'stretch' },
    { day: 'Mercredi', short: 'Mer', activity: 'Dos & Posture', detail: '4 exercices · 45 min', icon: 'dumbbell' },
    { day: 'Jeudi', short: 'Jeu', activity: 'Récupération', detail: 'Marche & Eau', icon: 'water', isRest: true },
    { day: 'Vendredi', short: 'Ven', activity: 'Bas du corps', detail: 'Presse · 55 min', icon: 'weightlifter' },
    { day: 'Samedi', short: 'Sam', activity: 'Cardio 12-3-30', detail: 'Tapis · 30 min', icon: 'runner' },
    { day: 'Dimanche', short: 'Dim', activity: 'Repos complet', detail: 'Recharge', icon: 'stretch', isRest: true },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFF7FA] text-[#2B091C] flex flex-col font-sans selection:bg-[#FBCFE8] selection:text-[#831843]">
      {/* HERO WRAPPER WITH BACKGROUND IMAGE COVERING HEADER DOWN TO THE BUTTONS */}
      <div className="relative w-full overflow-hidden pb-12 sm:pb-16 mb-4">
        {/* Full-bleed background photo covering entire section on PC and mobile */}
        <img
          src="/assets/aistudio/image_47ca33cb.png"
          alt="Ambiance dégradé rose"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        {/* Soft bottom fade to blend with page content */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FFF7FA] pointer-events-none" />

        {/* 1. HEADER (Transparent, sits over the background image) */}
        <header className="relative z-20 w-full border-b border-[#FBCFE8]/50">
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 shadow-2xs ring-1 ring-black/5 flex items-center justify-center bg-white/70 backdrop-blur-xs">
              <AppLogo size={40} variant="badge" />
            </div>

            <button
              onClick={onOpenLogin}
              className="h-10 pl-2.5 pr-4 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <StreamlineIcon name="user" className="w-3.5 h-3.5 text-white" />
              </span>
              <span>Mon compte</span>
            </button>
          </div>
        </header>

        {/* 2. MAIN HERO CENTRÉ */}
        <section className="relative z-20 w-full max-w-6xl mx-auto pt-10 sm:pt-14 px-4 sm:px-6 text-center">
          <div className="w-full space-y-5">
            <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#2B091C] tracking-tight leading-[1.18] sm:leading-[1.15]">
              <span className="block sm:inline">Planifie.</span>{' '}
              <span className="block sm:inline">Entraîne-toi.</span>{' '}
              <span className="block sm:inline-block font-extrabold italic bg-gradient-to-r from-[#831843] to-[#EC4899] bg-clip-text text-transparent pr-2.5 pb-1">
                Progresse.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-[#5C3A4D] font-medium max-w-2xl mx-auto leading-relaxed">
              Toute ta routine au même endroit : prépare ta semaine, valide tes séries en un geste et suis l’évolution de tes charges sans effort.
            </p>

            {/* Boutons alignés avec la même taille */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-56 h-11 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 group cursor-pointer"
              >
                <span>Démarrer gratuitement</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenLogin}
                className="w-full sm:w-56 h-11 rounded-full bg-white hover:bg-[#FFF0F5] border border-[#FBCFE8] text-[#831843] text-xs sm:text-sm font-bold flex items-center justify-center transition-all active:scale-95 shadow-2xs cursor-pointer"
              >
                <span>J’ai déjà un compte</span>
              </button>
            </div>

            {/* Photo de Donald Trump sur la page d'accueil */}
            <div className="pt-4 flex justify-center">
              <div className="inline-flex items-center gap-4 p-3 pr-5 rounded-[26px] bg-white/90 border border-[#FBCFE8] shadow-sm text-left">
                <img
                  src="/assets/trump.jpg"
                  alt="Donald Trump"
                  className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl object-cover object-top shrink-0 border border-[#FBCFE8]"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] bg-[#FCE7F3] px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Accueil
                  </span>
                  <p className="font-display font-bold text-sm sm:text-base text-[#2B091C]">
                    Donald Trump
                  </p>
                  <p className="text-xs text-[#7A616F]">
                    Portrait officiel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. GRAND ÉCRAN INTERACTIF EN THÈME JOUR (SOUS LE HERO, même largeur max-w-6xl que le header) */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Sélecteur des 3 vues : Mode Séance · Planning 7j · Suivi & PR */}
        <div className="flex justify-center mb-5">
          <div className="p-1.5 rounded-full bg-white border border-[#FBCFE8] shadow-xs inline-flex items-center gap-1">
            {HERO_PILLARS.map((tab) => {
              const active = previewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectPillar(tab.id)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    active
                      ? 'bg-[#831843] text-white shadow-xs'
                      : 'text-[#6E4F5D] hover:text-[#831843] hover:bg-[#FFF0F5]'
                  }`}
                >
                  {tab.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grand Écran Day Theme */}
        <div className="w-full rounded-[36px] bg-white border-2 border-[#FBCFE8] shadow-xl shadow-[#831843]/5 p-5 sm:p-8 lg:p-10 transition-all">
          {/* VUE 1 : MODE SÉANCE (Day Theme grand format) */}
          {previewTab === 'workout' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Barre supérieure de la séance */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#FBCFE8]/70">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-[#FCE7F3] text-[#831843] flex items-center justify-center shrink-0">
                    <StreamlineIcon name="weightlifter" className="w-5 h-5 text-[#831843]" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#EC4899] block">
                      Séance en direct
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#2B091C]">
                      Focus Fessiers & Galbe
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-[#831843]">
                    <Timer className="w-4 h-4 text-[#EC4899]" />
                    <span>Repos · 01:15</span>
                  </div>
                  <span className="px-3.5 py-2 rounded-2xl bg-[#FCE7F3] text-[#831843] text-xs font-mono font-bold">
                    {demoSets.filter((s) => s.done).length}/{demoSets.length} séries
                  </span>
                </div>
              </div>

              {/* Corps de la séance en 2 colonnes sur grand écran */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Exercice principal interactif */}
                <div className="lg:col-span-7 p-5 sm:p-6 rounded-[28px] bg-[#FFF9FC] border border-[#FBCFE8] space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#831843]">Exercice 1 sur 4</span>
                      <h4 className="font-display font-bold text-base sm:text-lg text-[#2B091C]">
                        Hip Thrust à la barre
                      </h4>
                      <p className="text-xs text-[#7A616F] mt-0.5">
                        Dernière performance : <strong className="text-[#831843] font-mono">80 kg × 10</strong> · Banc bas, pause 1s en haut
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {demoSets.map((set, idx) => (
                      <button
                        key={set.id}
                        type="button"
                        onClick={() => toggleDemoSet(set.id)}
                        className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm transition-all active:scale-99 cursor-pointer ${
                          set.done
                            ? 'bg-[#FCE7F3]/80 border border-[#F472B6] text-[#2B091C]'
                            : 'bg-white border border-[#FBCFE8] text-[#5C3A4D] hover:border-[#F472B6]'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold text-[#831843]">
                          Série {idx + 1}
                        </span>
                        <div className="flex items-center gap-4 font-mono font-bold text-sm">
                          <span>{set.weight} kg</span>
                          <span className="text-[#EC4899]">×</span>
                          <span>{set.reps} reps</span>
                        </div>
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                            set.done
                              ? 'bg-[#831843] text-white'
                              : 'bg-[#FFF0F5] text-[#831843]/40 border border-[#FBCFE8]'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-[#831843] font-medium text-center">
                     Touche une série pour tester la validation en direct
                  </p>
                </div>

                {/* Aperçu de la suite de la séance */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="p-4 rounded-2xl bg-white border border-[#FBCFE8] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#831843]">Exercice suivant</span>
                      <span className="font-mono font-bold text-[#6E4F5D]">4 × 12 reps</span>
                    </div>
                    <h5 className="font-display font-bold text-sm text-[#2B091C]">
                      Presse à cuisses inclinée
                    </h5>
                    <p className="text-xs text-[#7A616F]">
                      Réglage mémorisé : Siège cran 3 · Pieds hauts écartés
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#FBCFE8] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#831843]">Exercice 3</span>
                      <span className="font-mono font-bold text-[#6E4F5D]">3 × 10 / jambe</span>
                    </div>
                    <h5 className="font-display font-bold text-sm text-[#2B091C]">
                      Fentes bulgares aux haltères
                    </h5>
                    <p className="text-xs text-[#7A616F]">
                      Dernière charge : 14 kg par main
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#EC4899] block">
                        Finisher Cardio
                      </span>
                      <span className="text-xs font-bold text-[#2B091C]">
                        Marche inclinée · Inclinaison 10 · 15 min
                      </span>
                    </div>
                    <StreamlineIcon name="runner" className="w-5 h-5 text-[#831843]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VUE 2 : PLANNING 7J (Day Theme grand format sur 7 colonnes) */}
          {previewTab === 'planning' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#FBCFE8]/70">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-[#FCE7F3] text-[#831843] flex items-center justify-center shrink-0">
                    <StreamlineIcon name="calendar" className="w-5 h-5 text-[#831843]" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#EC4899] block">
                      Organisation hebdomadaire
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#2B091C]">
                      Ma semaine d’entraînement sur 7 jours
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#831843] bg-[#FFF0F5] border border-[#FBCFE8] px-3.5 py-1.5 rounded-full">
                  4 séances · 1 cardio · 2 repos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {weekDays.map((item) => (
                  <div
                    key={item.day}
                    className={`p-4 rounded-[24px] border flex flex-row sm:flex-col items-center sm:items-start justify-between gap-3 transition-all ${
                      item.isRest
                        ? 'bg-[#FFF9FC] border-[#FBCFE8]/60 text-[#7A616F]'
                        : 'bg-gradient-to-b from-[#FFF0F5]/80 to-white border-[#FBCFE8] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:w-full sm:justify-between">
                      <span className="text-xs font-display font-bold text-[#831843]">
                        {item.day}
                      </span>
                      <span className="w-8 h-8 rounded-xl bg-white border border-[#FBCFE8] text-[#831843] flex items-center justify-center shrink-0">
                        <StreamlineIcon name={item.icon} className="w-4 h-4 text-[#831843]" />
                      </span>
                    </div>
                    <div className="text-right sm:text-left">
                      <span className="text-xs font-bold text-[#2B091C] block leading-snug">
                        {item.activity}
                      </span>
                      <span className="text-[10px] text-[#7A616F] block mt-0.5">
                        {item.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VUE 3 : SUIVI & PR (Day Theme grand format) */}
          {previewTab === 'progress' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#FBCFE8]/70">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-[#FCE7F3] text-[#831843] flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5 text-[#831843]" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#EC4899] block">
                      Surcharge progressive
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#2B091C]">
                      Records personnels & évolution des mensurations
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#15803D] bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                  Progression constante sur 8 semaines
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Hip Thrust à la barre',
                    start: '70 kg × 10',
                    current: '90 kg × 10',
                    gain: '+20 kg',
                  },
                  {
                    name: 'Presse à cuisses inclinée',
                    start: '100 kg × 12',
                    current: '130 kg × 12',
                    gain: '+30 kg',
                  },
                  {
                    name: 'Tirage vertical poitrine',
                    start: '35 kg × 10',
                    current: '45 kg × 10',
                    gain: '+10 kg',
                  },
                ].map((pr) => (
                  <div
                    key={pr.name}
                    className="p-5 rounded-[24px] bg-[#FFF9FC] border border-[#FBCFE8] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#831843]">Record battu</span>
                      <span className="font-mono text-xs font-bold text-[#15803D] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {pr.gain}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base text-[#2B091C]">
                      {pr.name}
                    </h4>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#FBCFE8]/60">
                      <span className="text-[#7A616F]">Départ : {pr.start}</span>
                      <span className="font-mono font-bold text-[#2B091C]">
                        Actuel : {pr.current}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. LES 4 KEY FEATURES (Thème Jour harmonieux, même largeur max-w-6xl que le header) */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 pb-16 sm:pb-24 space-y-8">
        <div className="text-center sm:text-left">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#2B091C]">
            L’essentiel pour tes séances,{' '}
            <span className="text-[#831843] italic">sans le superflu.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Key Feature 1 */}
          <div className="rounded-[28px] bg-white border border-[#FBCFE8] p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] flex items-center justify-center text-[#831843]">
              <Timer className="w-5 h-5 text-[#EC4899]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#2B091C]">
                Suivi de Séance & Chrono Intégré
              </h3>
              <p className="text-xs sm:text-sm text-[#5C3A4D] leading-relaxed">
                Valide tes séries en un geste, ajuste tes charges avec les boutons rapides et lance automatiquement ton temps de repos entre chaque série.
              </p>
            </div>
          </div>

          {/* Key Feature 2 */}
          <div className="rounded-[28px] bg-white border border-[#FBCFE8] p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] flex items-center justify-center text-[#831843]">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#2B091C]">
                Planning 7 Jours & Séances Sur-Mesure
              </h3>
              <p className="text-xs sm:text-sm text-[#5C3A4D] leading-relaxed">
                Organise ta semaine en quelques secondes ou utilise « Propose-moi une séance » pour générer un entraînement adapté à ton temps et ton matériel.
              </p>
            </div>
          </div>

          {/* Key Feature 3 */}
          <div className="rounded-[28px] bg-white border border-[#FBCFE8] p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] flex items-center justify-center text-[#831843]">
              <Sparkles className="w-5 h-5 text-[#EC4899]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#2B091C]">
                Exercices Guidés & Réglages Mémorisés
              </h3>
              <p className="text-xs sm:text-sm text-[#5C3A4D] leading-relaxed">
                Consulte les consignes de posture, le guide interactif des pieds à la presse et sauvegarde tes réglages de siège ou de poulie sur chaque machine.
              </p>
            </div>
          </div>

          {/* Key Feature 4 */}
          <div className="rounded-[28px] bg-gradient-to-br from-[#FCE7F3]/80 via-[#FFF0F5] to-white border border-[#FBCFE8] p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#FBCFE8] flex items-center justify-center text-[#831843]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#2B091C]">
                Suivi des Charges & Mensurations
              </h3>
              <p className="text-xs sm:text-sm text-[#5C3A4D] leading-relaxed">
                Retrouve automatiquement ta dernière performance sous chaque exercice pour progresser d’une séance à l’autre et suis tes records personnels.
              </p>
            </div>
          </div>
        </div>

        {/* Bannière Photo & CTA Direct */}
        <div className="relative rounded-[32px] overflow-hidden p-7 sm:p-10 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <img
            src="/assets/aistudio/image_e3f9d7d9.png"
            alt="Entraînement"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0314]/95 via-[#2B091C]/88 to-[#831843]/75" />

          <div className="relative z-10 space-y-1.5 text-center sm:text-left max-w-lg">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow-xs">
              Prête pour ta prochaine séance ?
            </h3>
            <p className="text-xs sm:text-sm text-[#FBCFE8] font-medium">
              Accès gratuit, sans publicité, sur téléphone et ordinateur.
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="relative z-10 h-10 px-6 rounded-full bg-white text-[#831843] hover:bg-[#FFF0F5] text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Créer mon compte</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#EC4899]" />
          </button>
        </div>
      </section>

      {/* 5. FOOTER MINIMALISTE */}
      <footer className="w-full py-6 px-4 border-t border-[#FBCFE8]/60 text-center mt-auto">
        <div className="flex items-center justify-center gap-2.5">
          <AppLogo size={24} variant="badge" className="rounded-lg" />
          <span className="text-[11px] font-semibold text-[#831843]/80 tracking-wide">
            Discipline · Posture · Progression
          </span>
        </div>
      </footer>
    </div>
  );
};
