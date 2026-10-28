import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkout } from '../../context/WorkoutContext';
import { getDailyAffirmation } from '../../data/affirmations';
import { MuscleCategory, WeeklyPlanDay, ActivityType } from '../../types/fitness';
import { WEEK_DAYS_TEMPLATE } from '../planning/PlanningView';
import {
  StreamlineIcon,
  getActivityStreamlineIcon,
  getCategoryStreamlineIcon,
} from '../ui/StreamlineIcon';

interface HomeViewProps {
  onNavigateTab: (tab: 'exercises' | 'workouts' | 'planning' | 'progress') => void;
  onOpenCategory: (cat: MuscleCategory) => void;
  onOpenMeasurements: () => void;
  onStartActiveMode: () => void;
}

const formatCompactActivityLabel = (activity: string): string => {
  const cleaned = activity
    .replace(/^Séance\s+/i, '')
    .replace(/^Circuit\s+/i, '')
    .replace(/\(Tapis\s*\/\s*Escalier\)/i, 'Tapis')
    .trim();
  return cleaned || activity;
};

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTab,
  onOpenCategory,
  onOpenMeasurements,
  onStartActiveMode,
}) => {
  const { profile, user, updateUserProfile } = useAuth();
  const {
    weeklyPlans,
    routines,
    startWorkout,
    workouts,
    measurements,
  } = useWorkout();

  const completedWorkouts = (workouts || []).filter(
    (w) => w && (w.status === 'completed' || !w.status)
  );

  const lastWorkout = completedWorkouts.slice().sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  )[0];

  const workoutsThisWeek = completedWorkouts.filter((w) => {
    if (!w.date) return false;
    const d = new Date(w.date);
    const now = new Date();
    const day = now.getDay();
    const diffToMon = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon);
    monday.setHours(0, 0, 0, 0);
    return d >= monday;
  }).length;

  const latestMeasurement =
    measurements && measurements.length > 0
      ? measurements.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null;

  const formatRelativeDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const [prénomInput, setPrénomInput] = useState('');
  const [isSavingPrénom, setIsSavingPrénom] = useState(false);

  const todayJsDay = new Date().getDay();
  const todayDayOfWeek = todayJsDay === 0 ? 7 : todayJsDay;
  const [selectedDayNum, setSelectedDayNum] = useState<number>(todayDayOfWeek);

  // Chrono state
  const [chronoSeconds, setChronoSeconds] = useState(0);
  const [isChronoRunning, setIsChronoRunning] = useState(false);
  const chronoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const rawName = profile?.displayName || user?.displayName || '';
  const displayName = rawName.trim();
  const dailyAffirmation = getDailyAffirmation();

  const todayFormatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  useEffect(() => {
    if (isChronoRunning) {
      chronoIntervalRef.current = setInterval(() => {
        setChronoSeconds((sec) => sec + 1);
      }, 1000);
    } else if (chronoIntervalRef.current) {
      clearInterval(chronoIntervalRef.current);
    }
    return () => {
      if (chronoIntervalRef.current) clearInterval(chronoIntervalRef.current);
    };
  }, [isChronoRunning]);

  const handleResetChrono = () => {
    setIsChronoRunning(false);
    setChronoSeconds(0);
  };

  const formatChrono = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Build only the 3 upcoming days (Aujourd'hui, Demain, J+2)
  const upcomingThreeDays: (WeeklyPlanDay & {
    dayNumber: number;
    monthShort: string;
    shortLabel: string;
    relativeLabel: string;
  })[] = [0, 1, 2].map((offset) => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + offset);
    const jsDay = dateObj.getDay();
    const dayOfWeekNum = jsDay === 0 ? 7 : jsDay;

    const tmpl =
      WEEK_DAYS_TEMPLATE.find((t) => t.dayOfWeek === dayOfWeekNum) || WEEK_DAYS_TEMPLATE[0];
    const existing = weeklyPlans.find(
      (d) =>
        Number(d.dayOfWeek) === dayOfWeekNum ||
        (dayOfWeekNum === 7 && Number(d.dayOfWeek) === 0)
    );

    const base: WeeklyPlanDay = existing || {
      dayOfWeek: dayOfWeekNum,
      dayName: tmpl.dayName,
      date: dateObj.toISOString().split('T')[0],
      activity: 'Repos',
      activities: ['Repos'],
      finisherType: 'none',
      status: 'rest',
    };

    const relativeLabel =
      offset === 0 ? 'Aujourd’hui' : offset === 1 ? 'Demain' : tmpl.dayName;
    const monthShort = dateObj.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');

    return {
      ...base,
      dayOfWeek: dayOfWeekNum,
      dayName: tmpl.dayName,
      dayNumber: dateObj.getDate(),
      monthShort,
      shortLabel: tmpl.dayName.slice(0, 3),
      relativeLabel,
    };
  });

  const selectedDayPlan =
    upcomingThreeDays.find((d) => Number(d.dayOfWeek) === selectedDayNum) ||
    upcomingThreeDays[0];

  const selectedActivities: ActivityType[] =
    selectedDayPlan.activities && selectedDayPlan.activities.length > 0
      ? selectedDayPlan.activities
      : [selectedDayPlan.activity || 'Repos'];
  const primaryActivity = selectedActivities[0] || 'Repos';
  const isSelectedToday = Number(selectedDayPlan.dayOfWeek) === todayDayOfWeek;

  const launchRoutine = (routine: (typeof routines)[0]) => {
    const clonedExercises = routine.exercises.map((ex, exIdx) => ({
      ...ex,
      id: `ex_${Date.now()}_${exIdx}`,
      sets: ex.sets.map((s, sIdx) => ({
        ...s,
        id: `s_${Date.now()}_${sIdx}`,
        completed: false,
        actualWeight: s.targetWeight,
        actualReps: s.targetReps,
      })),
    }));
    startWorkout({
      name: routine.name,
      exercises: clonedExercises,
      finisher: routine.finisher,
      notes: routine.notes,
    });
    onStartActiveMode();
  };

  const handleStartTodayWorkout = () => {
    if (selectedDayPlan.routineId) {
      const linked = routines.find((r) => r.id === selectedDayPlan.routineId);
      if (linked) {
        launchRoutine(linked);
        return;
      }
    }
    const actLower = primaryActivity.toLowerCase();
    const matchedRoutine = routines.find((r) => {
      if (actLower.includes('fessier') && (r.targetZone === 'glutes' || r.id.includes('glutes'))) return true;
      if (actLower.includes('bas du corps') && r.targetZone === 'lower-body') return true;
      if (actLower.includes('dos') && r.targetZone === 'back') return true;
      if (actLower.includes('bras') && r.targetZone === 'arms') return true;
      if (actLower.includes('abdo') && r.targetZone === 'abs') return true;
      if (actLower.includes('cardio') && r.targetZone === 'cardio') return true;
      return false;
    });

    if (matchedRoutine) {
      launchRoutine(matchedRoutine);
    } else {
      onNavigateTab('workouts');
    }
  };

  const exercisePills: {
    category: MuscleCategory;
    title: string;
  }[] = [
    { category: 'lower-body', title: 'Bas du corps' },
    { category: 'back', title: 'Dos' },
    { category: 'arms', title: 'Bras & Épaules' },
    { category: 'abs', title: 'Abdos & Gainage' },
    { category: 'cardio', title: 'Cardio & Circuits' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Optional Prénom prompt if missing */}
      {!displayName && (
        <div className="p-4 rounded-[26px] bg-[#F6EDF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white text-[#831843] flex items-center justify-center shrink-0">
              <StreamlineIcon name="user" className="w-5 h-5 text-[#831843]" />
            </span>
            <div>
              <p className="font-display font-bold text-sm text-[#2B091C]">
                Quel est ton prénom ?
              </p>
              <p className="text-xs text-[#7A616F]">Pour personnaliser ton espace</p>
            </div>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!prénomInput.trim()) return;
              setIsSavingPrénom(true);
              try {
                await updateUserProfile({ displayName: prénomInput.trim() });
              } finally {
                setIsSavingPrénom(false);
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              required
              value={prénomInput}
              onChange={(e) => setPrénomInput(e.target.value)}
              placeholder="Ton prénom..."
              className="px-3.5 py-2 text-xs rounded-full bg-white text-[#2B091C] font-semibold focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={isSavingPrénom}
              className="px-4 py-2 rounded-full bg-[#831843] text-white font-bold text-xs shrink-0"
            >
              {isSavingPrénom ? '...' : 'OK'}
            </button>
          </form>
        </div>
      )}

      {/* 1. Editorial Screen Header (iOS Health/Fitness style) */}
      <div className="pt-1">
        <span className="font-compact text-[11px] font-semibold uppercase tracking-wider text-[#831843] block">
          {todayFormatted}
        </span>
        <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-[#2B091C] mt-0.5">
          {displayName ? `Bonjour ${displayName}` : 'Accueil'}
        </h1>
      </div>

      {/* 2. Planning : 3 prochains jours (sans troncature du mot Aujourd'hui ni débordement du titre) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-[#7A616F]">
            3 prochains jours
          </span>
          <button
            onClick={() => onNavigateTab('planning')}
            className="text-xs font-semibold text-[#831843] hover:underline flex items-center gap-0.5"
          >
            <span>Planning complet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {upcomingThreeDays.map((day) => {
            const isToday = Number(day.dayOfWeek) === todayDayOfWeek;
            const isSelected = Number(day.dayOfWeek) === Number(selectedDayPlan.dayOfWeek);
            const dayAct =
              day.activities && day.activities.length > 0
                ? day.activities[0]
                : day.activity || 'Repos';
            const compactLabel = formatCompactActivityLabel(dayAct);

            return (
              <button
                key={day.dayOfWeek}
                onClick={() => setSelectedDayNum(Number(day.dayOfWeek))}
                className={`p-3.5 sm:p-4 rounded-[24px] text-left flex flex-col justify-between transition-all active:scale-97 min-h-[156px] overflow-hidden ${
                  isSelected
                    ? 'bg-[#831843] text-white shadow-sm'
                    : isToday
                    ? 'bg-[#FCE7F3] text-[#831843] ring-1.5 ring-[#EC4899]/30'
                    : 'bg-[#F6EDF2] text-[#2B091C] hover:bg-[#F1E2EA]'
                }`}
              >
                {/* Top section: Day label, Date, and Large Icon underneath */}
                <div className="w-full">
                  <span
                    className={`font-compact text-xs sm:text-[13px] font-bold block leading-none whitespace-nowrap mb-1.5 ${
                      isSelected ? 'text-[#FBCFE8]' : isToday ? 'text-[#831843]' : 'text-[#7A616F]'
                    }`}
                  >
                    {day.relativeLabel}
                  </span>

                  {/* Date line: day number + month short */}
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`font-display text-2xl sm:text-3xl font-extrabold tabular-nums leading-none tracking-tight ${
                        isSelected ? 'text-white' : isToday ? 'text-[#831843]' : 'text-[#2B091C]'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    <span
                      className={`font-compact text-xs sm:text-sm font-semibold uppercase tracking-wider leading-none ${
                        isSelected ? 'text-[#FBCFE8]' : isToday ? 'text-[#9D174D]' : 'text-[#8C6D7E]'
                      }`}
                    >
                      {day.monthShort}
                    </span>
                  </div>

                  {/* Icon in large format directly below the date */}
                  <div className="mt-2.5">
                    <span
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : isToday
                          ? 'bg-white text-[#831843] ring-1.5 ring-[#EC4899]/30'
                          : 'bg-white text-[#831843]'
                      }`}
                    >
                      <StreamlineIcon
                        name={getActivityStreamlineIcon(dayAct)}
                        className="w-5 h-5 sm:w-5.5 sm:h-5.5"
                      />
                    </span>
                  </div>
                </div>

                {/* Bottom: Clean activity title without truncation/overflow */}
                <span
                  className={`font-display font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 break-words w-full mt-2 ${
                    isSelected ? 'text-white' : 'text-[#2B091C]'
                  }`}
                >
                  {compactLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bannière Photo focus du jour sélectionné + CTA Commencer la séance */}
      <div className="relative overflow-hidden rounded-[32px] min-h-[196px] sm:min-h-[204px] border border-[#EC4899]/30 shadow-xl group flex flex-col justify-between p-5 sm:p-6 text-white">
        {/* Background Photo (/assets/aistudio/image_e3f9d7d9.png) */}
        <img
          src="/assets/aistudio/image_e3f9d7d9.png"
          alt="Équipement fitness"
          className="absolute inset-0 w-full h-full object-cover object-[center_35%] scale-100 group-hover:scale-104 transition-transform duration-700 ease-out"
        />

        {/* High-contrast gradient overlay ensuring razor-sharp typography and button visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0314]/94 via-[#2D0621]/82 to-[#1A0314]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0314]/85 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 h-full">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#831843]/85 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <StreamlineIcon
                name={getActivityStreamlineIcon(primaryActivity)}
                className="w-7 h-7 sm:w-8 sm:h-8 text-[#FBCFE8]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EC4899] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                  {isSelectedToday ? 'Aujourd’hui' : selectedDayPlan.dayName}
                </span>
                {selectedDayPlan.finisherType && selectedDayPlan.finisherType !== 'none' && (
                  <span className="text-xs text-[#FBCFE8] font-semibold drop-shadow-xs">
                    + {selectedDayPlan.finisherType === 'cardio' ? 'Cardio' : 'Abdos'}
                  </span>
                )}
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight tracking-tight mt-1.5 drop-shadow-md">
                {primaryActivity}
              </h2>
              {selectedActivities.length > 1 && (
                <p className="text-xs text-[#FBCFE8] font-medium truncate mt-0.5 drop-shadow-xs">
                  + {selectedActivities.slice(1).join(' · ')}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleStartTodayWorkout}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#FDF2F8] text-[#831843] hover:text-[#2B091C] font-display font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-black/35 transition-all active:scale-95 shrink-0 min-h-[48px]"
          >
            <span>Commencer la séance</span>
            <ChevronRight className="w-4 h-4 stroke-[2.75]" />
          </button>
        </div>
      </div>

      {/* 4. Section "Exercices" sous forme de bannière unique */}
      <section className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-display font-bold text-[#2B091C]">
            Exercices
          </h2>
          <button
            onClick={() => onNavigateTab('exercises')}
            className="text-xs font-semibold text-[#831843] hover:underline"
          >
            Tout voir
          </button>
        </div>

        <div
          onClick={() => onNavigateTab('exercises')}
          className="relative overflow-hidden rounded-[28px] bg-grainy-pink p-5 cursor-pointer transition-all hover:shadow-xs active:scale-99"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/40 blur-xl" />
          <div className="pointer-events-none absolute right-14 -bottom-10 w-28 h-28 rounded-full bg-[#F472B6]/20 blur-lg" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="space-y-3 flex-1 min-w-0">
              <div>
                <span className="font-compact text-[11px] font-semibold uppercase tracking-wider text-[#831843] block">
                  Bibliothèque & Réglages
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#2B091C] leading-snug mt-0.5">
                  Tous tes exercices par zone
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {exercisePills.map((pill) => (
                  <button
                    key={pill.category}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCategory(pill.category);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#2B091C] text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                  >
                    <StreamlineIcon
                      name={getCategoryStreamlineIcon(pill.category)}
                      className="w-3.5 h-3.5 text-[#831843]"
                    />
                    <span>{pill.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateTab('exercises');
              }}
              aria-label="Ouvrir les exercices"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#831843] hover:bg-[#3B0726] text-white flex flex-col items-center justify-center shrink-0 shadow-md transition-transform active:scale-95"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span className="font-compact text-[9px] font-bold mt-0.5">Voir</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Section "Suivi" (Minimaliste & Épurée) */}
      <section className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-display font-bold text-[#2B091C]">
            Suivi
          </h2>
          <button
            onClick={() => onNavigateTab('progress')}
            className="text-xs font-semibold text-[#831843] hover:underline flex items-center gap-1"
          >
            <span>Détails</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          onClick={() => onNavigateTab('progress')}
          className="p-4 sm:p-5 rounded-[26px] bg-[#F6EDF2] hover:bg-[#F1E2EA] transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-99 border border-[#F2E4EC]"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#831843] shrink-0">
              <StreamlineIcon name="heart-pulse" className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base sm:text-lg text-[#2B091C] leading-none">
                  {completedWorkouts.length} {completedWorkouts.length > 1 ? 'séances terminées' : 'séance terminée'}
                </span>
                {workoutsThisWeek > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FCE7F3] text-[#831843] text-[10px] font-bold font-compact shrink-0">
                    {workoutsThisWeek} cette semaine
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7A616F] truncate mt-1">
                {lastWorkout
                  ? `Dernière : ${lastWorkout.name} (${formatRelativeDate(lastWorkout.date)})`
                  : 'Aucune séance enregistrée pour l’instant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {latestMeasurement?.weight && (
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-bold text-[#7A616F] block uppercase tracking-wider">
                  Poids
                </span>
                <span className="font-mono font-bold text-sm text-[#2B091C]">
                  {latestMeasurement.weight} kg
                </span>
              </div>
            )}
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#831843] shadow-2xs">
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </section>

      {/* 6. Chrono & Mensurations en ligne compacte */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-4 rounded-[26px] bg-[#F6EDF2] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChronoRunning(!isChronoRunning)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 shrink-0 ${
                isChronoRunning
                  ? 'bg-[#EC4899] text-white'
                  : 'bg-white text-[#831843] shadow-2xs'
              }`}
              aria-label={isChronoRunning ? 'Pause' : 'Lancer'}
            >
              {isChronoRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 fill-[#831843]" />
              )}
            </button>
            <div>
              <span className="text-xs font-semibold text-[#7A616F] block">
                Chrono rapide
              </span>
              <span className="font-mono font-bold text-xl text-[#2B091C] tabular-nums">
                {formatChrono(chronoSeconds)}
              </span>
            </div>
          </div>

          {chronoSeconds > 0 && (
            <button
              onClick={handleResetChrono}
              className="w-9 h-9 rounded-full bg-white text-[#831843] hover:text-[#2B091C] flex items-center justify-center shadow-2xs"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onOpenMeasurements}
          className="p-4 rounded-[26px] bg-[#F6EDF2] hover:bg-[#F1E2EA] transition-all flex items-center justify-between gap-3.5 text-left active:scale-99"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#831843] shrink-0">
              <StreamlineIcon name="body" className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-semibold text-sm text-[#2B091C] block">
                Mes mensurations
              </span>
              <span className="text-xs text-[#7A616F]">Suivre mon évolution</span>
            </div>
          </div>
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#831843] shrink-0">
            <ChevronRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* 6. Phrase du jour (New York serif italic) */}
      <div className="p-4 rounded-[24px] bg-[#F6EDF2]/70 text-center">
        <p className="font-serif-ny text-xs sm:text-sm italic text-[#7A616F]">
          « {dailyAffirmation} »
        </p>
      </div>
    </div>
  );
};

