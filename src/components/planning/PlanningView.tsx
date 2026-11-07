import React, { useState } from 'react';
import {
  Play,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Flame,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import {
  WeeklyPlanDay,
  WorkoutExerciseItem,
  ActivityType,
  PLANNING_ACTIVITIES,
} from '../../types/fitness';
import { ABDOS_CIRCUITS, CARDIO_CIRCUITS } from '../../data/exercisesData';
import { StreamlineIcon, StreamlineIconName, getActivityStreamlineIcon } from '../ui/StreamlineIcon';
import { BottomSheet } from '../ui/BottomSheet';

interface PlanningViewProps {
  onStartActiveMode: () => void;
}

export const WEEK_DAYS_TEMPLATE: { dayOfWeek: number; dayName: string }[] = [
  { dayOfWeek: 1, dayName: 'Lundi' },
  { dayOfWeek: 2, dayName: 'Mardi' },
  { dayOfWeek: 3, dayName: 'Mercredi' },
  { dayOfWeek: 4, dayName: 'Jeudi' },
  { dayOfWeek: 5, dayName: 'Vendredi' },
  { dayOfWeek: 6, dayName: 'Samedi' },
  { dayOfWeek: 0, dayName: 'Dimanche' },
];

export const ACTIVITY_CONFIG: Record<
  string,
  {
    label: string;
    icon: StreamlineIconName;
    colorClass: string;
    defaultSession: string;
    defaultRoutineId?: string;
  }
> = {
  'Séance Bas du corps': {
    label: 'Séance Bas du corps',
    icon: 'weightlifter',
    colorClass: 'bg-[#FCE7F3] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Séance Bas du corps : Quads, Ischios & Presse',
    defaultRoutineId: 'routine-lower-complete',
  },
  'Séance Fessiers': {
    label: 'Séance Fessiers',
    icon: 'kettlebell',
    colorClass: 'bg-[#FCE7F3] text-[#9D174D] border-[#F472B6]/50',
    defaultSession: 'Booty Sculpt : Hip Thrust, Kickback & Abduction',
    defaultRoutineId: 'routine-glutes-focus',
  },
  'Séance Dos': {
    label: 'Séance Dos',
    icon: 'dumbbell',
    colorClass: 'bg-[#FCE7F3] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Dos Dessiné sans l’Élargir (Ordre 1-2-3-4)',
    defaultRoutineId: 'routine-back-sculpt-no-widen',
  },
  'Séance Dos / Pecs': {
    label: 'Séance Dos / Pecs',
    icon: 'dumbbell',
    colorClass: 'bg-[#FCE7F3] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Combo Dos / Pecs (Upper Body Dessiné & Galbe)',
    defaultRoutineId: 'routine-dos-pecs-antagonist',
  },
  'Séance Pecs / Bras': {
    label: 'Séance Pecs / Bras',
    icon: 'biceps',
    colorClass: 'bg-[#FDF2F8] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Combo Pecs / Bras (Buste Tonique & Bras Fermes)',
    defaultRoutineId: 'routine-pecs-arms-push',
  },
  'Séance Pecs': {
    label: 'Séance Pecs',
    icon: 'dumbbell',
    colorClass: 'bg-[#FCE7F3] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Focus Pecs & Maintien du Buste (4 exos)',
    defaultRoutineId: 'routine-pecs-sculpt',
  },
  'Séance Bras': {
    label: 'Séance Bras',
    icon: 'biceps',
    colorClass: 'bg-[#FDF2F8] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Séance Bras & Épaules Galbées',
    defaultRoutineId: 'routine-upper-sculpt',
  },
  Repos: {
    label: 'Repos',
    icon: 'water',
    colorClass: 'bg-[#FFF0F5] text-[#7A616F] border-[#FBCFE8]',
    defaultSession: 'Repos total ou récupération active',
  },
  TSE: {
    label: 'TSE',
    icon: 'stretch',
    colorClass: 'bg-[#FDF2F8] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Séance TSE (Training Spécifique)',
  },
  Pilates: {
    label: 'Pilates',
    icon: 'stretch',
    colorClass: 'bg-[#FDF2F8] text-[#9D174D] border-[#FBCFE8]',
    defaultSession: 'Pilates Flow, Posture & Gainage profond',
  },
  Course: {
    label: 'Course',
    icon: 'runner',
    colorClass: 'bg-[#FCE7F3] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Course à pied / Footing endurance',
  },
  Cardio: {
    label: 'Cardio',
    icon: 'runner',
    colorClass: 'bg-[#FCE7F3] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Marche inclinée 12-5-30 ou StairMaster',
    defaultRoutineId: 'routine-cardio-incline-walk',
  },
  Abdos: {
    label: 'Abdos',
    icon: 'stretch',
    colorClass: 'bg-[#FDF2F8] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Circuit Abdos & Gainage',
    defaultRoutineId: 'routine-abs-standing-weighted',
  },
  Autre: {
    label: 'Autre',
    icon: 'bike',
    colorClass: 'bg-[#FFF0F5] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Activité personnalisée au choix',
  },
  Musculation: {
    label: 'Séance Bas du corps',
    icon: 'weightlifter',
    colorClass: 'bg-[#FCE7F3] text-[#831843] border-[#FBCFE8]',
    defaultSession: 'Séance Bas du corps / Fessiers ou Dos',
  },
};

export const CARDIO_FINISHER_PRESETS = [
  ...CARDIO_CIRCUITS.map(
    (c) => `${c.name.replace(/^\d+\.\s*/, '')} (${c.machine} · ${c.durationMinutes} min)`
  ),
  'Marche inclinée Débutant : Inclinaison 6 · Vitesse 4,5 · 20 min',
  'Marche inclinée Intermédiaire : Inclinaison 10 · Vitesse 4,5 · 30 min',
  'Marche inclinée Confirmée 12-5-30 : Inclinaison 12 · Vitesse 5 · 30 min',
];

export const ABDOS_FINISHER_PRESETS = [
  ...ABDOS_CIRCUITS.map(
    (c) => `${c.name.replace(/^\d+\.\s*/, '')} (${c.durationMinutes} min · ${c.focus})`
  ),
  'Stomach Vacuum (5 x 20s) + Planche active 60s',
];

interface ProgramPreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  days: Record<
    number,
    {
      activity: ActivityType;
      workoutName?: string;
      routineId?: string;
      finisherType?: 'none' | 'cardio' | 'abs';
      finisher?: string;
    }
  >;
}

const PROGRAM_PRESETS: ProgramPreset[] = [
  {
    id: 'split-3j-sculpt',
    title: 'Split 3 Jours : Fessiers · Dos (1-2-3-4) · Pecs/Bras',
    subtitle: 'Lundi Bas du corps, Mercredi Dos Dessiné, Vendredi Pecs & Bras',
    badge: '3 séances / sem',
    days: {
      1: {
        activity: 'Séance Fessiers',
        workoutName: 'Focus Fessiers Galbe & Volume (Ordre 1-2-3-4)',
        routineId: 'routine-glutes-focus',
        finisherType: 'abs',
        finisher: ABDOS_FINISHER_PRESETS[0],
      },
      2: { activity: 'Repos' },
      3: {
        activity: 'Séance Dos',
        workoutName: 'Dos Dessiné sans l’Élargir (Ordre 1-2-3-4)',
        routineId: 'routine-back-sculpt-no-widen',
        finisherType: 'cardio',
        finisher: CARDIO_FINISHER_PRESETS[0],
      },
      4: { activity: 'Repos' },
      5: {
        activity: 'Séance Pecs / Bras',
        workoutName: 'Séance Pecs / Bras (Buste Tonique & Bras Fermes)',
        routineId: 'routine-pecs-arms-push',
        finisherType: 'abs',
        finisher: ABDOS_FINISHER_PRESETS[1],
      },
      6: { activity: 'Repos' },
      0: { activity: 'Repos' },
    },
  },
  {
    id: 'split-4j-combos',
    title: 'Split 4 Jours : 2 Bas du corps + Dos/Pecs + Pecs/Bras',
    subtitle: 'Lundi Fessiers, Mardi Dos/Pecs, Jeudi Jambes, Vendredi Pecs/Bras',
    badge: '4 séances / sem',
    days: {
      1: {
        activity: 'Séance Fessiers',
        workoutName: 'Focus Fessiers Galbe & Volume',
        routineId: 'routine-glutes-focus',
        finisherType: 'abs',
        finisher: ABDOS_FINISHER_PRESETS[0],
      },
      2: {
        activity: 'Séance Dos / Pecs',
        workoutName: 'Séance Dos / Pecs (Upper Body Dessiné & Galbe)',
        routineId: 'routine-dos-pecs-antagonist',
        finisherType: 'cardio',
        finisher: CARDIO_FINISHER_PRESETS[0],
      },
      3: { activity: 'Repos' },
      4: {
        activity: 'Séance Bas du corps',
        workoutName: 'Bas du Corps Complet & Galbe',
        routineId: 'routine-lower-complete',
        finisherType: 'none',
      },
      5: {
        activity: 'Séance Pecs / Bras',
        workoutName: 'Séance Pecs / Bras (Buste Tonique & Bras Fermes)',
        routineId: 'routine-pecs-arms-push',
        finisherType: 'abs',
        finisher: ABDOS_FINISHER_PRESETS[2],
      },
      6: { activity: 'Repos' },
      0: { activity: 'Repos' },
    },
  },
  {
    id: 'free-mode',
    title: 'Mode Libre (Sans programme fixe)',
    subtitle: 'Remet tous les jours en libre / repos : tu lances tes séances quand tu veux !',
    badge: 'Zéro contrainte',
    days: {
      1: { activity: 'Repos' },
      2: { activity: 'Repos' },
      3: { activity: 'Repos' },
      4: { activity: 'Repos' },
      5: { activity: 'Repos' },
      6: { activity: 'Repos' },
      0: { activity: 'Repos' },
    },
  },
];

export const PlanningView: React.FC<PlanningViewProps> = ({ onStartActiveMode }) => {
  const { weeklyPlans, updateWeeklyPlanDay, routines, workouts, startWorkout } = useWorkout();

  const orderedDays: WeeklyPlanDay[] = WEEK_DAYS_TEMPLATE.map((tmpl, idx) => {
    const existing = weeklyPlans.find((d) => Number(d.dayOfWeek) === tmpl.dayOfWeek);
    if (existing) return existing;
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + idx);
    return {
      dayOfWeek: tmpl.dayOfWeek,
      dayName: tmpl.dayName,
      date: d.toISOString().split('T')[0],
      activity: 'Repos',
      activities: ['Repos'],
      finisherType: 'none',
      status: 'rest',
    };
  });

  const [viewTab, setViewTab] = useState<'week' | 'month'>('week');
  const [editingDay, setEditingDay] = useState<WeeklyPlanDay | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<ActivityType[]>(['Séance Bas du corps']);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('');
  const [customWorkoutName, setCustomWorkoutName] = useState<string>('');
  const [finisherType, setFinisherType] = useState<'none' | 'cardio' | 'abs'>('none');
  const [finisherText, setFinisherText] = useState<string>('');
  const [dayStatus, setDayStatus] = useState<WeeklyPlanDay['status']>('planned');
  const [presetToast, setPresetToast] = useState<string | null>(null);
  const [isApplyingPreset, setIsApplyingPreset] = useState(false);

  // Monthly calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthName = calendarDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDay = (firstDayOfMonth + 6) % 7;
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const completedWorkouts = workouts.filter((w) => w.status === 'completed');
  const workoutsByDate: Record<string, { count: number; maxRating: number; names: string[] }> = {};
  completedWorkouts.forEach((w) => {
    if (!workoutsByDate[w.date]) {
      workoutsByDate[w.date] = { count: 0, maxRating: 0, names: [] };
    }
    workoutsByDate[w.date].count += 1;
    workoutsByDate[w.date].maxRating = Math.max(workoutsByDate[w.date].maxRating, w.rating || 4);
    workoutsByDate[w.date].names.push(w.name);
  });

  const handleApplyProgramPreset = async (preset: ProgramPreset) => {
    if (isApplyingPreset) return;
    setIsApplyingPreset(true);
    try {
      for (const tmpl of WEEK_DAYS_TEMPLATE) {
        const dayCfg = preset.days[tmpl.dayOfWeek] || { activity: 'Repos' as ActivityType };
        const isRest = dayCfg.activity === 'Repos';
        await updateWeeklyPlanDay(tmpl.dayOfWeek, {
          activity: dayCfg.activity,
          activities: [dayCfg.activity],
          workoutName: isRest ? undefined : dayCfg.workoutName,
          routineId: isRest ? undefined : dayCfg.routineId,
          finisherType: isRest ? 'none' : dayCfg.finisherType || 'none',
          finisher: isRest ? undefined : dayCfg.finisher,
          status: isRest ? 'rest' : 'planned',
        });
      }
      setPresetToast(`✨ « ${preset.title} » appliqué à ta semaine !`);
      setTimeout(() => setPresetToast(null), 3500);
    } finally {
      setIsApplyingPreset(false);
    }
  };

  const handleOpenEdit = (day: WeeklyPlanDay) => {
    setEditingDay(day);
    const acts: ActivityType[] =
      day.activities && day.activities.length > 0
        ? day.activities
        : [day.activity || 'Repos'];
    setSelectedActivities(acts);
    setSelectedRoutineId(day.routineId || '');
    setCustomWorkoutName(day.workoutName || '');
    setFinisherType(day.finisherType || (day.finisher ? 'cardio' : 'none'));
    setFinisherText(day.finisher || '');
    setDayStatus(day.status);
  };

  const toggleActivityInSelection = (act: ActivityType) => {
    if (act === 'Repos') {
      setSelectedActivities(['Repos']);
      return;
    }
    const withoutRepos = selectedActivities.filter((a) => a !== 'Repos');
    if (withoutRepos.includes(act)) {
      const next = withoutRepos.filter((a) => a !== act);
      setSelectedActivities(next.length > 0 ? next : ['Repos']);
    } else {
      setSelectedActivities([...withoutRepos, act]);
    }
  };

  const handleSaveDay = async () => {
    if (!editingDay) return;
    const primaryAct = selectedActivities[0] || 'Repos';
    const isRest = primaryAct === 'Repos';
    const cfg = ACTIVITY_CONFIG[primaryAct] || ACTIVITY_CONFIG['Séance Bas du corps'];

    let finalName = customWorkoutName.trim();
    if (!isRest && !finalName) {
      if (selectedRoutineId) {
        const r = routines.find((item) => item.id === selectedRoutineId);
        if (r) finalName = r.name;
      } else {
        finalName = selectedActivities.join(' + ');
      }
    }

    await updateWeeklyPlanDay(editingDay.dayOfWeek, {
      activity: primaryAct,
      activities: selectedActivities,
      routineId: isRest ? undefined : selectedRoutineId || cfg.defaultRoutineId || undefined,
      workoutName: isRest ? undefined : finalName || undefined,
      finisherType: isRest ? 'none' : finisherType,
      finisher: isRest || finisherType === 'none' ? undefined : finisherText.trim() || undefined,
      status: isRest ? 'rest' : dayStatus === 'rest' ? 'planned' : dayStatus,
    });

    setEditingDay(null);
  };

  const handleToggleDayComplete = async (day: WeeklyPlanDay, e: React.MouseEvent) => {
    e.stopPropagation();
    if (day.status === 'rest' || day.activity === 'Repos') return;
    const nextStatus = day.status === 'completed' ? 'planned' : 'completed';
    await updateWeeklyPlanDay(day.dayOfWeek, { status: nextStatus });
  };

  const handleLaunchPlannedWorkout = (day: WeeklyPlanDay, e: React.MouseEvent) => {
    e.stopPropagation();
    const act = day.activity || 'Séance Bas du corps';
    const cfg = ACTIVITY_CONFIG[act] || ACTIVITY_CONFIG['Séance Bas du corps'];
    const targetRoutineId = day.routineId || cfg.defaultRoutineId;
    const targetRoutine = routines.find((r) => r.id === targetRoutineId) || routines[0];

    if (targetRoutine) {
      const clonedExercises: WorkoutExerciseItem[] = targetRoutine.exercises.map((ex, idx) => ({
        ...ex,
        id: `plan_ex_${Date.now()}_${idx}`,
        sets: ex.sets.map((s, sIdx) => ({
          ...s,
          id: `plan_s_${Date.now()}_${sIdx}`,
          completed: false,
          actualWeight: s.targetWeight,
          actualReps: s.targetReps,
        })),
      }));

      startWorkout({
        name: day.workoutName || targetRoutine.name,
        exercises: clonedExercises,
        finisher: day.finisher || targetRoutine.finisher,
      });
      onStartActiveMode();
    }
  };

  const getIntensityCircleClass = (rating: number) => {
    if (rating >= 5) return 'bg-[#831843] text-white font-bold';
    if (rating >= 4) return 'bg-[#EC4899] text-white font-bold';
    return 'bg-[#FCE7F3] text-[#831843] font-bold';
  };

  const activeDaysCount = orderedDays.filter((d) => (d.activity || 'Repos') !== 'Repos').length;

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-1">
        <div>
          <span className="font-compact text-[11px] font-semibold uppercase tracking-wider text-[#831843] block">
            À la carte ou structuré · 100 % modulable
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[#2B091C]">
            Planning & Rythme
          </h1>
        </div>
        {activeDaysCount > 0 && (
          <button
            type="button"
            onClick={() => handleApplyProgramPreset(PROGRAM_PRESETS[2])}
            className="self-start sm:self-auto px-3.5 py-2 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] text-[#831843] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Passer en Mode Libre (vider la semaine)</span>
          </button>
        )}
      </div>

      {presetToast && (
        <div className="p-3.5 rounded-2xl bg-[#FCE7F3] border border-[#FBCFE8] text-[#831843] text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#831843] shrink-0" />
          <span>{presetToast}</span>
        </div>
      )}

      {/* 2. Clean Inline Tabs (Semaine / Calendrier) */}
      <div className="flex items-center gap-6 border-b border-[#F1E4EC]">
        <button
          onClick={() => setViewTab('week')}
          className={`pb-2.5 flex items-center gap-1.5 text-sm transition-colors border-b-2 -mb-[1px] ${
            viewTab === 'week'
              ? 'border-[#831843] font-bold text-[#2B091C]'
              : 'border-transparent font-medium text-[#8C6D7E] hover:text-[#2B091C]'
          }`}
        >
          <span>Ma semaine</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
              viewTab === 'week'
                ? 'bg-[#FCE7F3] text-[#831843]'
                : 'bg-[#F6EDF2] text-[#8C6D7E]'
            }`}
          >
            {activeDaysCount === 0 ? 'Libre' : `${activeDaysCount}j`}
          </span>
        </button>

        <button
          onClick={() => setViewTab('month')}
          className={`pb-2.5 flex items-center gap-1.5 text-sm transition-colors border-b-2 -mb-[1px] ${
            viewTab === 'month'
              ? 'border-[#831843] font-bold text-[#2B091C]'
              : 'border-transparent font-medium text-[#8C6D7E] hover:text-[#2B091C]'
          }`}
        >
          <span>Calendrier d’assiduité</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
              viewTab === 'month'
                ? 'bg-[#FCE7F3] text-[#831843]'
                : 'bg-[#F6EDF2] text-[#8C6D7E]'
            }`}
          >
            {Object.keys(workoutsByDate).length}
          </span>
        </button>
      </div>

      {/* View 1: Weekly Clean Cards + 1-Click Templates */}
      {viewTab === 'week' && (
        <div className="space-y-4">
          {/* 1-Click Weekly Templates */}
          <div className="p-4 rounded-[26px] bg-grainy-pink border border-[#F472B6]/35 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs sm:text-sm text-[#2B091C] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#831843]" />
                <span>Modèles de semaine en 1 clic (ou personnalise jour par jour) :</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PROGRAM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isApplyingPreset}
                  onClick={() => handleApplyProgramPreset(preset)}
                  className="p-3 rounded-2xl bg-white/90 hover:bg-white border border-white text-left flex flex-col justify-between gap-2 transition-all active:scale-99 shadow-2xs"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#FCE7F3] text-[#831843] text-[10px] font-bold">
                      {preset.badge}
                    </span>
                    <h3 className="font-display font-bold text-xs text-[#2B091C] leading-snug">
                      {preset.title}
                    </h3>
                    <p className="text-[10px] text-[#7A616F] leading-relaxed">
                      {preset.subtitle}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#831843]">
                    Appliquer →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 7 Days Stack */}
          <section className="space-y-2.5">
            {orderedDays.map((day) => {
              const acts: ActivityType[] =
                day.activities && day.activities.length > 0
                  ? day.activities
                  : [day.activity || 'Repos'];
              const primaryAct = acts[0] || 'Repos';
              const isRest = primaryAct === 'Repos';
              const isCompleted = day.status === 'completed';

              return (
                <div
                  key={day.dayOfWeek}
                  onClick={() => handleOpenEdit(day)}
                  className="p-3.5 sm:p-4 rounded-[26px] bg-[#F6EDF2] hover:bg-[#F1E2EA] transition-all cursor-pointer flex items-center justify-between gap-3.5 active:scale-99"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#831843] shrink-0">
                      <StreamlineIcon name={getActivityStreamlineIcon(primaryAct)} className="w-6 h-6" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-[15px] text-[#2B091C] leading-snug truncate">
                          {day.dayName}
                        </h3>
                        {day.workoutName && !isRest && (
                          <span className="text-[11px] text-[#7A616F] truncate hidden sm:inline">
                            · {day.workoutName}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#7A616F]">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#831843]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-500'
                                : isRest
                                ? 'bg-[#C8B2BF]'
                                : 'bg-[#EC4899]'
                            }`}
                          />
                          <span>{isRest ? 'Jour libre / Repos' : acts.join(' + ')}</span>
                        </span>

                        {day.finisherType && day.finisherType !== 'none' && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[200px]">
                              + {day.finisher || (day.finisherType === 'cardio' ? 'Cardio' : 'Abdos')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isRest && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleToggleDayComplete(day, e)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white text-[#8C6D7E] hover:text-[#831843]'
                          }`}
                          title="Marquer comme fait"
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleLaunchPlannedWorkout(day, e)}
                          className="w-8 h-8 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs"
                          title="Démarrer la séance"
                        >
                          <Play className="w-3.5 h-3.5 fill-[#831843]" />
                        </button>
                      </>
                    )}

                    <span className="w-8 h-8 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      )}

      {/* View 2: Monthly Calendar */}
      {viewTab === 'month' && (
        <section className="p-5 rounded-[28px] bg-[#F6EDF2] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-[#2B091C] capitalize">
              {monthName}
            </h2>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                className="w-9 h-9 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs"
                title="Mois précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                className="w-9 h-9 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs"
                title="Mois suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#7A616F] uppercase">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`blank-${i}`} className="h-10" />
            ))}

            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayWorkout = workoutsByDate[dateStr];
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div key={`cal-${dayNum}`} className="flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs tabular-nums ${
                      dayWorkout
                        ? getIntensityCircleClass(dayWorkout.maxRating)
                        : isToday
                        ? 'bg-white text-[#831843] ring-2 ring-[#EC4899] font-bold'
                        : 'text-[#2B091C] font-medium'
                    }`}
                  >
                    {dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* BottomSheet: Edit Day Activities & Finisher Circuits */}
      <BottomSheet
        isOpen={!!editingDay}
        onClose={() => setEditingDay(null)}
        title={editingDay ? editingDay.dayName : 'Planifier le jour'}
        subtitle="Sélectionne ta séance (Dos/Pecs, Pecs/Bras, Bas du corps...) et ton circuit Finisher"
        footer={
          <button
            type="button"
            onClick={handleSaveDay}
            className="w-full py-3.5 rounded-full bg-[#831843] text-white font-bold text-xs min-h-[48px]"
          >
            Enregistrer ce jour
          </button>
        }
      >
        {editingDay && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {PLANNING_ACTIVITIES.map((act) => {
                const isSelected = selectedActivities.includes(act);
                return (
                  <button
                    key={act}
                    type="button"
                    onClick={() => toggleActivityInSelection(act)}
                    className={`p-3 rounded-2xl text-left text-xs font-semibold flex items-center justify-between gap-2 transition-all min-h-[46px] ${
                      isSelected
                        ? 'bg-[#831843] text-white'
                        : 'bg-[#F6EDF2] text-[#2B091C] hover:bg-[#F1E2EA]'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <StreamlineIcon
                        name={getActivityStreamlineIcon(act)}
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-[#FBCFE8]' : 'text-[#831843]'
                        }`}
                      />
                      <span className="truncate">{act}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {!selectedActivities.includes('Repos') && (
              <div className="space-y-3 pt-2 border-t border-[#F1E4EC]">
                <div>
                  <label className="block font-bold text-[#2B091C] text-xs mb-1.5">
                    Routine associée (optionnel)
                  </label>
                  <select
                    value={selectedRoutineId}
                    onChange={(e) => setSelectedRoutineId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs font-bold text-[#2B091C]"
                  >
                    <option value="">Séance automatique selon l’activité choisie</option>
                    {routines.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-[#2B091C] text-xs flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#EC4899]" />
                    <span>Circuit Finisher (Abdos ou Cardio)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'none', label: 'Aucun' },
                        { id: 'abs', label: 'Circuit Abdos' },
                        { id: 'cardio', label: 'Circuit Cardio' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setFinisherType(opt.id);
                          if (opt.id === 'none') setFinisherText('');
                          if (opt.id === 'cardio') setFinisherText(CARDIO_FINISHER_PRESETS[0]);
                          if (opt.id === 'abs') setFinisherText(ABDOS_FINISHER_PRESETS[0]);
                        }}
                        className={`py-2.5 px-3 rounded-2xl text-xs font-bold ${
                          finisherType === opt.id
                            ? 'bg-[#831843] text-white'
                            : 'bg-[#F6EDF2] text-[#7A616F]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {finisherType !== 'none' && (
                    <select
                      value={finisherText}
                      onChange={(e) => setFinisherText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FCE7F3]/70 text-xs font-bold text-[#831843]"
                    >
                      {(finisherType === 'abs'
                        ? ABDOS_FINISHER_PRESETS
                        : CARDIO_FINISHER_PRESETS
                      ).map((preset, idx) => (
                        <option key={idx} value={preset}>
                          {preset}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
