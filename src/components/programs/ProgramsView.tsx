import React, { useState } from 'react';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Dumbbell,
  Flame,
  FolderPlus,
  Layers,
  Play,
  Plus,
  Share2,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Upload,
  X,
  CheckCircle2,
  TrendingUp,
  Award,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ProgramEquipmentTag,
  ProgramLevel,
  ProgramObjective,
  ProgramWeek,
  ProgramDayTemplate,
  TrainingProgram,
  ActivityType,
} from '../../types/fitness';
import {
  ALL_PROGRAM_EQUIPMENT_TAGS,
  FINISHERS_CATALOG,
  PROGRAM_OBJECTIVE_META,
} from '../../data/programsAndFinishersData';
import { useWorkout } from '../../context/WorkoutContext';

interface ProgramsViewProps {
  onStartWorkoutSession?: () => void;
  onNavigateToPlanning?: () => void;
}

const WEEKDAY_OPTIONS = [
  { dayOfWeek: 1, short: 'Lun', full: 'Lundi' },
  { dayOfWeek: 2, short: 'Mar', full: 'Mardi' },
  { dayOfWeek: 3, short: 'Mer', full: 'Mercredi' },
  { dayOfWeek: 4, short: 'Jeu', full: 'Jeudi' },
  { dayOfWeek: 5, short: 'Ven', full: 'Vendredi' },
  { dayOfWeek: 6, short: 'Sam', full: 'Samedi' },
  { dayOfWeek: 0, short: 'Dim', full: 'Dimanche' },
];

export const ProgramsView: React.FC<ProgramsViewProps> = ({
  onStartWorkoutSession,
  onNavigateToPlanning,
}) => {
  const {
    programs,
    activeProgram,
    routines,
    measurements,
    workouts,
    createCustomProgram,
    deleteCustomProgram,
    startProgram,
    stopActiveProgram,
    exportProgramCode,
    importProgramFromCode,
    startWorkout,
  } = useWorkout();

  // Filters
  const [selectedObjective, setSelectedObjective] = useState<ProgramObjective | 'all'>('all');
  const [selectedEquipmentTag, setSelectedEquipmentTag] = useState<ProgramEquipmentTag | 'all'>('all');

  // Detail & Accordion state
  const [detailProgram, setDetailProgram] = useState<TrainingProgram | null>(null);
  const [openAccordionWeeks, setOpenAccordionWeeks] = useState<Record<string, number>>({});

  // Onboarding Modal ("Démarrer ce programme")
  const [onboardingProgram, setOnboardingProgram] = useState<TrainingProgram | null>(null);
  const [preferredDays, setPreferredDays] = useState<number[]>([1, 3, 5]);
  const [programStartDate, setProgramStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Custom Program Creator Modal ("Créer mon programme")
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newObjective, setNewObjective] = useState<ProgramObjective>('hypertrophy');
  const [newDurationWeeks, setNewDurationWeeks] = useState<number>(6);
  const [newSessionsPerWeek, setNewSessionsPerWeek] = useState<number>(3);
  const [newLevel, setNewLevel] = useState<ProgramLevel>('Intermédiaire');
  const [newEquipment, setNewEquipment] = useState<ProgramEquipmentTag[]>(['Haltères', 'Machines']);
  const [newDescription, setNewDescription] = useState('');
  const [builderActiveWeek, setBuilderActiveWeek] = useState<number>(1);
  const [builderWeeks, setBuilderWeeks] = useState<ProgramWeek[]>(() =>
    buildInitialWeeks(6, 3, routines[0]?.id || 'routine-glutes-focus')
  );

  // Share & Import Modal
  const [shareModalProgram, setShareModalProgram] = useState<TrainingProgram | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importInputCode, setImportInputCode] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Program Summary / Bilan Modal
  const [showBilanModal, setShowBilanModal] = useState(false);

  function buildInitialWeeks(
    weeksCount: number,
    sessionsCount: number,
    defaultRoutineId: string
  ): ProgramWeek[] {
    return Array.from({ length: weeksCount }, (_, wIdx) => {
      const weekNum = wIdx + 1;
      const days: ProgramDayTemplate[] = Array.from({ length: 7 }, (__, dIdx) => {
        const dayNum = dIdx + 1;
        const isTrainingDay = dIdx < sessionsCount;
        return {
          id: `custom_w${weekNum}_d${dayNum}`,
          dayNumber: dayNum,
          label: isTrainingDay ? `Jour ${dayNum} — Séance ${dayNum}` : `Jour ${dayNum} — Repos`,
          isRest: !isTrainingDay,
          activityType: isTrainingDay ? 'Musculation' : 'Repos',
          routineId: isTrainingDay ? defaultRoutineId : undefined,
          workoutTitle: isTrainingDay ? `Séance Jour ${dayNum}` : 'Repos',
          durationMinutes: isTrainingDay ? 45 : undefined,
          finisherPresetId: isTrainingDay ? 'finisher-tabata-core-30-15' : undefined,
        };
      });
      return {
        weekNumber: weekNum,
        title: `Semaine ${weekNum} — Progression`,
        focusNote:
          weekNum === 1
            ? 'Trouvez vos charges de référence avec une technique parfaite.'
            : 'Ajoutez +2 kg ou +1 à 2 répétitions par rapport à la semaine précédente.',
        days,
      };
    });
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredPrograms = programs.filter((prog) => {
    if (selectedObjective !== 'all' && prog.objective !== selectedObjective) return false;
    if (selectedEquipmentTag !== 'all' && !prog.equipment.includes(selectedEquipmentTag)) {
      return false;
    }
    return true;
  });

  const handleOpenOnboarding = (prog: TrainingProgram) => {
    setOnboardingProgram(prog);
    // Default preferred days matching prog.sessionsPerWeek
    if (prog.sessionsPerWeek === 4) {
      setPreferredDays([1, 2, 4, 5]); // Lun, Mar, Jeu, Ven
    } else if (prog.sessionsPerWeek >= 5) {
      setPreferredDays([1, 2, 3, 5, 6]);
    } else {
      setPreferredDays([1, 3, 5]); // Lun, Mer, Ven
    }
  };

  const handleConfirmStartProgram = async () => {
    if (!onboardingProgram) return;
    if (preferredDays.length === 0) {
      triggerToast('Sélectionnez au moins un jour d’entraînement dans la semaine.');
      return;
    }
    await startProgram(onboardingProgram.id, preferredDays, programStartDate);
    setOnboardingProgram(null);
    setDetailProgram(null);
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#EC4899', '#831843', '#FBCFE8'],
    });
    triggerToast(
      `Programme "${onboardingProgram.title}" activé ! Vos séances ont été planifiées dans le Calendrier.`
    );
  };

  const handleLaunchProgramDayWorkout = (prog: TrainingProgram, day: ProgramDayTemplate, weekNum: number) => {
    const matchedRoutine =
      routines.find((r) => r.id === day.routineId) || routines[0];
    const presetFinisher = day.finisherPresetId
      ? FINISHERS_CATALOG.find((f) => f.id === day.finisherPresetId)
      : undefined;

    const clonedExercises = (day.exercises || matchedRoutine?.exercises || []).map((ex, i) => ({
      ...ex,
      id: `prog_ex_${Date.now()}_${i}`,
      sets: ex.sets.map((s, sIdx) => ({
        ...s,
        id: `prog_set_${Date.now()}_${i}_${sIdx}`,
        completed: false,
      })),
    }));

    startWorkout({
      name: `${day.workoutTitle || day.label} (${prog.title} · Sem. ${weekNum})`,
      exercises: clonedExercises,
      finisher: presetFinisher
        ? `${presetFinisher.name} — ${presetFinisher.summary}`
        : matchedRoutine?.finisher,
      finisherPresetId: day.finisherPresetId,
      programId: prog.id,
      programWeekNumber: weekNum,
      programDayId: day.id,
      notes: `Programme ${prog.title} — Semaine ${weekNum}/${prog.durationWeeks}`,
    });

    if (onStartWorkoutSession) {
      onStartWorkoutSession();
    }
  };

  // Builder helpers
  const handleChangeDurationOrFreq = (weeksCount: number, sessionsCount: number) => {
    setNewDurationWeeks(weeksCount);
    setNewSessionsPerWeek(sessionsCount);
    setBuilderWeeks(buildInitialWeeks(weeksCount, sessionsCount, routines[0]?.id || 'routine-glutes-focus'));
    setBuilderActiveWeek(1);
  };

  const handleUpdateBuilderDay = (
    weekNumber: number,
    dayIndex: number,
    updates: Partial<ProgramDayTemplate>
  ) => {
    setBuilderWeeks((prev) =>
      prev.map((w) => {
        if (w.weekNumber !== weekNumber) return w;
        const nextDays = [...w.days];
        nextDays[dayIndex] = { ...nextDays[dayIndex], ...updates };
        return { ...w, days: nextDays };
      })
    );
  };

  const handleDuplicateWeekToAll = (sourceWeekNumber: number) => {
    const sourceWeek = builderWeeks.find((w) => w.weekNumber === sourceWeekNumber);
    if (!sourceWeek) return;
    setBuilderWeeks((prev) =>
      prev.map((w) => {
        if (w.weekNumber === sourceWeekNumber) return w;
        return {
          ...w,
          days: sourceWeek.days.map((d, idx) => ({
            ...d,
            id: `custom_w${w.weekNumber}_d${idx + 1}`,
          })),
        };
      })
    );
    triggerToast(`La structure de la Semaine ${sourceWeekNumber} a été dupliquée sur toutes les semaines !`);
  };

  const handleSaveCustomProgram = async () => {
    if (!newTitle.trim()) {
      triggerToast('Donnez un nom à votre programme personnalisé.');
      return;
    }
    const objMeta = PROGRAM_OBJECTIVE_META[newObjective];
    const created = await createCustomProgram({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || `${newDurationWeeks} semaines · ${newSessionsPerWeek} séances/semaine`,
      objective: newObjective,
      objectiveLabel: objMeta.label,
      durationWeeks: newDurationWeeks,
      sessionsPerWeek: newSessionsPerWeek,
      level: newLevel,
      coverImage:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
      equipment: newEquipment.length > 0 ? newEquipment : ['Haltères'],
      description:
        newDescription.trim() ||
        `Programme sur-mesure conçu sur GlowUpLab (${newDurationWeeks} semaines, objectif ${objMeta.shortLabel}).`,
      coachTips: [
        'Suivez les recommandations de surcharge progressive (+2 kg ou +1 à 2 reps chaque semaine).',
      ],
      weeks: builderWeeks,
    });
    setShowCreatorModal(false);
    setNewTitle('');
    setNewSubtitle('');
    triggerToast(`Programme "${created.title}" créé avec succès !`);
  };

  const handleImportSubmit = async () => {
    if (!importInputCode.trim()) return;
    const imported = await importProgramFromCode(importInputCode);
    if (imported) {
      setShowImportModal(false);
      setImportInputCode('');
      triggerToast(`Programme "${imported.title}" importé avec succès !`);
    } else {
      triggerToast('Code ou JSON de programme invalide.');
    }
  };

  // Measurement evolution helper for Écran de Bilan
  const latestMeas = measurements[0];
  const initialMeas = activeProgram?.initialMeasurements || measurements[measurements.length - 1];

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-[90] max-w-md bg-[#2B091C] text-white px-4 py-3 rounded-2xl shadow-2xl border border-pink-500/40 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="rounded-[32px] bg-gradient-to-br from-[#3B0726] via-[#590D3B] to-[#831843] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-pink-200 text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" /> Architecture & Surcharge Progressive
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
              Programmes d’Entraînement
            </h1>
            <p className="text-xs sm:text-sm text-pink-100/85 leading-relaxed">
              Choisissez un programme clé en main par objectif ou créez votre propre cycle sur-mesure avec planification automatique dans votre calendrier.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowCreatorModal(true)}
              className="px-4 py-3 rounded-2xl bg-[#EC4899] hover:bg-pink-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Créer mon programme</span>
            </button>
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Importer</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE PROGRAM WIDGET BANNER (IF ACTIVE) */}
      {activeProgram && (
        <div className="rounded-[28px] bg-white border-2 border-[#EC4899]/40 p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FCE7F3] text-[#831843] text-[10px] font-extrabold uppercase tracking-wider">
                  Programme Actif
                </span>
                <span className="text-xs font-bold text-[#7A616F]">
                  {activeProgram.objectiveLabel}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-[#2B091C] font-display">
                {activeProgram.programTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowBilanModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#FCE7F3] hover:bg-pink-200 text-[#831843] text-xs font-extrabold flex items-center gap-1.5 transition-colors"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Écran de Bilan</span>
              </button>
              {onNavigateToPlanning && (
                <button
                  type="button"
                  onClick={onNavigateToPlanning}
                  className="px-3.5 py-2 rounded-xl bg-[#2B091C] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>Voir Planning</span>
                </button>
              )}
              <button
                type="button"
                onClick={stopActiveProgram}
                className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-700 text-xs font-semibold transition-colors"
              >
                Arrêter
              </button>
            </div>
          </div>

          {/* Progress Bar ("Semaine 3/8 — 42% complété") */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-[#831843]">
                Semaine {activeProgram.currentWeek}/{activeProgram.durationWeeks} —{' '}
                {activeProgram.progressPercent}% complété
              </span>
              <span className="text-[#7A616F]">
                {activeProgram.completedSessionCount}/{activeProgram.totalSessionsPlanned} séances validées ·{' '}
                {activeProgram.totalVolumeKg.toLocaleString('fr-FR')} kg soulevés
              </span>
            </div>
            <div className="w-full h-3 bg-[#F6EDF2] rounded-full overflow-hidden border border-[#FBCFE8]">
              <div
                className="h-full bg-gradient-to-r from-[#831843] to-[#EC4899] transition-all duration-500"
                style={{ width: `${Math.max(4, activeProgram.progressPercent)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* A. FILTRES PAR OBJECTIFS (4 CATÉGORIES) + FILTRE MATÉRIEL INTERACTIF */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedObjective('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border ${
              selectedObjective === 'all'
                ? 'bg-[#831843] text-white border-[#831843] shadow-sm'
                : 'bg-white text-[#593E4C] border-[#FBCFE8] hover:bg-[#FCE7F3]/50'
            }`}
          >
            Tous les objectifs ({programs.length})
          </button>
          {(Object.keys(PROGRAM_OBJECTIVE_META) as ProgramObjective[]).map((objKey) => {
            const meta = PROGRAM_OBJECTIVE_META[objKey];
            const isSelected = selectedObjective === objKey;
            return (
              <button
                key={objKey}
                type="button"
                onClick={() => setSelectedObjective(objKey)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#831843] text-white border-[#831843] shadow-sm'
                    : 'bg-white text-[#593E4C] border-[#FBCFE8] hover:bg-[#FCE7F3]/50'
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Equipment Tags Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-[#7A616F] flex items-center gap-1 pr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#831843]" /> Matériel :
          </span>
          <button
            type="button"
            onClick={() => setSelectedEquipmentTag('all')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all ${
              selectedEquipmentTag === 'all'
                ? 'bg-[#FCE7F3] text-[#831843] border-[#EC4899]'
                : 'bg-white text-[#7A616F] border-[#E6D5DF]'
            }`}
          >
            Tout voir
          </button>
          {ALL_PROGRAM_EQUIPMENT_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setSelectedEquipmentTag(selectedEquipmentTag === tag ? 'all' : tag)
              }
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all ${
                selectedEquipmentTag === tag
                  ? 'bg-[#FCE7F3] text-[#831843] border-[#EC4899]'
                  : 'bg-white text-[#7A616F] border-[#E6D5DF] hover:border-[#EC4899]/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* CATALOGUE DE CARTES PROGRAMMES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPrograms.map((prog) => {
          const objMeta = PROGRAM_OBJECTIVE_META[prog.objective] || PROGRAM_OBJECTIVE_META.hypertrophy;
          const isCurrentlyActive = activeProgram?.programId === prog.id && !activeProgram.isCompleted;
          const expandedWeek = openAccordionWeeks[prog.id] ?? 0;

          return (
            <div
              key={prog.id}
              className={`rounded-[30px] bg-white border transition-all overflow-hidden shadow-sm hover:shadow-md flex flex-col ${
                isCurrentlyActive ? 'border-2 border-[#EC4899]' : 'border-[#FBCFE8]'
              }`}
            >
              {/* Cover Image & Objective Badge */}
              <div className="relative h-48 w-full overflow-hidden bg-[#2B091C]">
                <img
                  src={prog.coverImage}
                  alt={prog.title}
                  className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E0513] via-[#1E0513]/40 to-transparent" />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#831843] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    {objMeta.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isCurrentlyActive && (
                      <span className="px-2.5 py-1 rounded-full bg-[#EC4899] text-white text-[10px] font-extrabold">
                        EN COURS
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShareModalProgram(prog)}
                      className="p-2 rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
                      title="Partager ou exporter ce programme"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {prog.isCustom && (
                      <button
                        type="button"
                        onClick={() => deleteCustomProgram(prog.id)}
                        className="p-2 rounded-full bg-black/45 hover:bg-rose-600 text-white backdrop-blur-xs transition-colors"
                        title="Supprimer ce programme personnalisé"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <h3 className="text-lg sm:text-xl font-extrabold font-display leading-tight">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-pink-100/90 line-clamp-1 mt-0.5">{prog.subtitle}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  {/* Metadata Pills: Durée, Fréquence, Niveau */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8]">
                      <span className="text-[10px] font-bold text-[#7A616F] uppercase block">Durée</span>
                      <span className="text-xs font-extrabold text-[#831843]">
                        {prog.durationWeeks} semaines
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8]">
                      <span className="text-[10px] font-bold text-[#7A616F] uppercase block">Fréquence</span>
                      <span className="text-xs font-extrabold text-[#831843]">
                        {prog.sessionsPerWeek} séances/sem
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8]">
                      <span className="text-[10px] font-bold text-[#7A616F] uppercase block">Niveau</span>
                      <span className="text-xs font-extrabold text-[#831843]">{prog.level}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#593E4C] leading-relaxed">{prog.description}</p>

                  {/* Interactive Equipment Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A616F] block">
                      Matériel requis :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {prog.equipment.map((eq) => (
                        <button
                          key={eq}
                          type="button"
                          onClick={() =>
                            setSelectedEquipmentTag(selectedEquipmentTag === eq ? 'all' : eq)
                          }
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                            selectedEquipmentTag === eq
                              ? 'bg-[#831843] text-white border-[#831843]'
                              : 'bg-[#F6EDF2] text-[#831843] border-[#FBCFE8] hover:bg-[#FCE7F3]'
                          }`}
                        >
                          {eq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Week-by-Week Structure Accordion Preview */}
                  <div className="rounded-2xl border border-[#FBCFE8] bg-[#FCFBF9] overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordionWeeks((prev) => ({
                          ...prev,
                          [prog.id]: expandedWeek === 1 ? 0 : 1,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-extrabold text-[#3B0726] hover:bg-[#FCE7F3]/40 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#EC4899]" />
                        <span>Aperçu semaine par semaine ({prog.weeks.length} semaines)</span>
                      </span>
                      {expandedWeek === 1 ? (
                        <ChevronUp className="w-4 h-4 text-[#831843]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#831843]" />
                      )}
                    </button>

                    {expandedWeek === 1 && prog.weeks[0] && (
                      <div className="p-3 border-t border-[#FBCFE8] space-y-2 bg-white">
                        <p className="text-[11px] font-bold text-[#831843]">
                          {prog.weeks[0].title}
                        </p>
                        <div className="space-y-1.5">
                          {prog.weeks[0].days.map((d) => (
                            <div
                              key={d.id}
                              className={`px-2.5 py-1.5 rounded-xl text-[11px] flex items-center justify-between gap-2 ${
                                d.isRest
                                  ? 'bg-neutral-50 text-neutral-400'
                                  : 'bg-[#FDF2F8] text-[#3B0726] font-semibold'
                              }`}
                            >
                              <span className="truncate">{d.label}</span>
                              {!d.isRest && (
                                <button
                                  type="button"
                                  onClick={() => handleLaunchProgramDayWorkout(prog, d, 1)}
                                  className="px-2 py-0.5 rounded-lg bg-[#831843] text-white text-[10px] font-bold shrink-0 hover:bg-[#EC4899]"
                                >
                                  Lancer
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailProgram(prog)}
                    className="py-3 px-4 rounded-2xl bg-[#FCE7F3] hover:bg-pink-200 text-[#831843] font-extrabold text-xs transition-colors"
                  >
                    Détails & Semaines
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenOnboarding(prog)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#831843] to-[#EC4899] hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>
                      {isCurrentlyActive ? 'Reconfigurer les jours' : 'Démarrer ce programme'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* MODAL 1 : VUE DÉTAIL DU PROGRAMME (ACCORDÉON TOUTES LES SEMAINES) */}
      {/* ================================================================= */}
      {detailProgram && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2B091C]/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-[32px] border border-[#FBCFE8] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="relative h-44 bg-[#2B091C] shrink-0">
              <img
                src={detailProgram.coverImage}
                alt={detailProgram.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E0513] via-[#1E0513]/40 to-transparent" />
              <button
                type="button"
                onClick={() => setDetailProgram(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EC4899] text-[10px] font-extrabold uppercase">
                  {detailProgram.objectiveLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold font-display mt-1">
                  {detailProgram.title}
                </h2>
                <p className="text-xs text-pink-100">{detailProgram.subtitle}</p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {detailProgram.coachTips && detailProgram.coachTips.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8] space-y-1.5">
                  <span className="text-xs font-extrabold text-[#831843] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#EC4899]" /> Conseils Coach & Surcharge Progressive
                  </span>
                  {detailProgram.coachTips.map((tip, i) => (
                    <p key={i} className="text-xs text-[#593E4C]">
                      • {tip}
                    </p>
                  ))}
                </div>
              )}

              <div className="space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#831843]">
                  Structure complète ({detailProgram.weeks.length} semaines)
                </h3>
                {detailProgram.weeks.map((week) => {
                  const isOpen =
                    (openAccordionWeeks[`detail_${detailProgram.id}`] ?? 1) === week.weekNumber;
                  return (
                    <div
                      key={week.weekNumber}
                      className="rounded-2xl border border-[#FBCFE8] overflow-hidden bg-[#FCFBF9]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAccordionWeeks((prev) => ({
                            ...prev,
                            [`detail_${detailProgram.id}`]: isOpen ? 0 : week.weekNumber,
                          }))
                        }
                        className="w-full px-4 py-3 text-left flex items-center justify-between bg-white hover:bg-[#FDF2F8] transition-colors"
                      >
                        <div>
                          <span className="text-xs font-extrabold text-[#2B091C] block">
                            {week.title}
                          </span>
                          {week.focusNote && (
                            <span className="text-[11px] text-[#7A616F]">{week.focusNote}</span>
                          )}
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#831843]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#831843]" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-3.5 border-t border-[#FBCFE8] space-y-2 bg-[#FCFBF9]">
                          {week.days.map((d) => {
                            const fin = d.finisherPresetId
                              ? FINISHERS_CATALOG.find((f) => f.id === d.finisherPresetId)
                              : undefined;
                            return (
                              <div
                                key={d.id}
                                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                                  d.isRest
                                    ? 'bg-neutral-50 border-neutral-200/70 text-neutral-400'
                                    : 'bg-white border-[#FBCFE8] text-[#2B091C]'
                                }`}
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-bold truncate">{d.label}</p>
                                  {!d.isRest && (
                                    <p className="text-[11px] text-[#7A616F] mt-0.5">
                                      {d.workoutTitle}
                                      {fin ? ` · Finisher : ${fin.name}` : ''}
                                    </p>
                                  )}
                                </div>
                                {!d.isRest && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDetailProgram(null);
                                      handleLaunchProgramDayWorkout(
                                        detailProgram,
                                        d,
                                        week.weekNumber
                                      );
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-[#831843] hover:bg-[#EC4899] text-white text-xs font-bold shrink-0 flex items-center gap-1"
                                  >
                                    <Play className="w-3 h-3 fill-white" />
                                    <span>Démarrer</span>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-[#FBCFE8] bg-[#FDF2F8] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDetailProgram(null)}
                className="px-4 py-2.5 rounded-xl bg-white text-[#593E4C] text-xs font-bold border border-[#FBCFE8]"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  const prog = detailProgram;
                  setDetailProgram(null);
                  handleOpenOnboarding(prog);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#831843] to-[#EC4899] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Planifier dans mon Calendrier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2 : ONBOARDING & PLANIFICATION AUTOMATIQUE DANS LE PLANNING */}
      {/* ================================================================= */}
      {onboardingProgram && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-[#2B091C]/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-[32px] border border-[#FBCFE8] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EC4899] block">
                  Planification Automatique
                </span>
                <h3 className="text-lg font-extrabold text-[#2B091C] font-display">
                  Démarrer « {onboardingProgram.title} »
                </h3>
                <p className="text-xs text-[#7A616F] mt-0.5">
                  Fréquence recommandée :{' '}
                  <strong>{onboardingProgram.sessionsPerWeek} séances / semaine</strong> pendant{' '}
                  {onboardingProgram.durationWeeks} semaines.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOnboardingProgram(null)}
                className="p-1.5 rounded-full bg-[#FDF2F8] text-[#831843]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#2B091C] block">
                1. Sélectionnez vos jours d’entraînement préférés ({preferredDays.length} choisis)
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {WEEKDAY_OPTIONS.map((d) => {
                  const isSelected = preferredDays.includes(d.dayOfWeek);
                  return (
                    <button
                      key={d.dayOfWeek}
                      type="button"
                      onClick={() =>
                        setPreferredDays((prev) =>
                          prev.includes(d.dayOfWeek)
                            ? prev.filter((x) => x !== d.dayOfWeek)
                            : [...prev, d.dayOfWeek]
                        )
                      }
                      className={`py-3 rounded-2xl text-xs font-extrabold border transition-all ${
                        isSelected
                          ? 'bg-[#831843] text-white border-[#831843] shadow-sm'
                          : 'bg-[#FDF2F8] text-[#7A616F] border-[#FBCFE8]'
                      }`}
                    >
                      {d.short}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#7A616F]">
                Les jours non sélectionnés seront automatiquement configurés en jours de repos recommandés dans votre Planning.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#2B091C] block">
                2. Date de début du programme
              </label>
              <input
                type="date"
                value={programStartDate}
                onChange={(e) => setProgramStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#FBCFE8] bg-[#FDF2F8] text-xs font-bold text-[#2B091C]"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
              <p className="font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Synchronisation Calendrier & Accueil
              </p>
              <p>
                Vos séances et Finishers seront automatiquement injectés dans votre Planning Hebdomadaire et dans le widget « 3 prochains jours » de l’accueil.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setOnboardingProgram(null)}
                className="px-4 py-3 rounded-2xl bg-neutral-100 text-neutral-700 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmStartProgram}
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#831843] to-[#EC4899] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Activer & Planifier mes séances</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3 : CRÉATEUR DE PROGRAMME PERSONNALISÉ (CONSTRUCTEUR A à Z) */}
      {/* ================================================================= */}
      {showCreatorModal && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-[#2B091C]/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-[32px] border border-[#FBCFE8] p-6 shadow-2xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#FBCFE8]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EC4899] block">
                  Constructeur Sur-Mesure
                </span>
                <h3 className="text-lg font-extrabold text-[#2B091C] font-display">
                  Créer mon Programme d’Entraînement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreatorModal(false)}
                className="p-2 rounded-full bg-[#FDF2F8] text-[#831843]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B091C]">Nom du programme *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="ex: Mon Cycle Booty & Core"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FBCFE8] bg-[#FDF2F8] font-bold text-[#2B091C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#2B091C]">Objectif principal</label>
                  <select
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value as ProgramObjective)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FBCFE8] bg-[#FDF2F8] font-bold text-[#2B091C]"
                  >
                    {(Object.keys(PROGRAM_OBJECTIVE_META) as ProgramObjective[]).map((k) => (
                      <option key={k} value={k}>
                        {PROGRAM_OBJECTIVE_META[k].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B091C]">Durée (Semaines)</label>
                  <select
                    value={newDurationWeeks}
                    onChange={(e) =>
                      handleChangeDurationOrFreq(Number(e.target.value), newSessionsPerWeek)
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#FBCFE8] bg-[#FDF2F8] font-bold text-[#2B091C]"
                  >
                    {[4, 6, 8, 12].map((w) => (
                      <option key={w} value={w}>
                        {w} semaines
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#2B091C]">Séances / semaine</label>
                  <select
                    value={newSessionsPerWeek}
                    onChange={(e) =>
                      handleChangeDurationOrFreq(newDurationWeeks, Number(e.target.value))
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#FBCFE8] bg-[#FDF2F8] font-bold text-[#2B091C]"
                  >
                    {[2, 3, 4, 5, 6].map((s) => (
                      <option key={s} value={s}>
                        {s} séances / sem
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#2B091C]">Niveau</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as ProgramLevel)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#FBCFE8] bg-[#FDF2F8] font-bold text-[#2B091C]"
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>
              </div>

              {/* Equipment Multi-Select */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#2B091C] block">Matériel requis</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_PROGRAM_EQUIPMENT_TAGS.map((tag) => {
                    const active = newEquipment.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setNewEquipment((prev) =>
                            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                          active
                            ? 'bg-[#831843] text-white border-[#831843]'
                            : 'bg-white text-[#7A616F] border-[#FBCFE8]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CONSTRUCTEUR DE SEMAINES + DUPLIQUER LA SEMAINE */}
              <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#FBCFE8] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold text-[#2B091C] uppercase tracking-wider">
                    Constructeur de Semaines (Semaine {builderActiveWeek}/{newDurationWeeks})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDuplicateWeekToAll(builderActiveWeek)}
                    className="px-3 py-1.5 rounded-xl bg-[#FCE7F3] hover:bg-pink-200 text-[#831843] font-extrabold text-[11px] flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Dupliquer la Semaine {builderActiveWeek} sur tout le programme</span>
                  </button>
                </div>

                {/* Week Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {builderWeeks.map((w) => (
                    <button
                      key={w.weekNumber}
                      type="button"
                      onClick={() => setBuilderActiveWeek(w.weekNumber)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap ${
                        builderActiveWeek === w.weekNumber
                          ? 'bg-[#831843] text-white'
                          : 'bg-white text-[#7A616F] border border-[#FBCFE8]'
                      }`}
                    >
                      Sem. {w.weekNumber}
                    </button>
                  ))}
                </div>

                {/* Days of selected week */}
                {(() => {
                  const currentW = builderWeeks.find((w) => w.weekNumber === builderActiveWeek);
                  if (!currentW) return null;
                  return (
                    <div className="space-y-2">
                      {currentW.days.map((day, dIdx) => (
                        <div
                          key={day.id}
                          className="p-3 rounded-xl bg-white border border-[#FBCFE8] grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                        >
                          <div className="sm:col-span-3 flex items-center justify-between sm:justify-start gap-2">
                            <span className="font-extrabold text-[#831843]">
                              Jour {day.dayNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateBuilderDay(builderActiveWeek, dIdx, {
                                  isRest: !day.isRest,
                                  label: !day.isRest
                                    ? `Jour ${day.dayNumber} — Repos`
                                    : `Jour ${day.dayNumber} — Séance`,
                                })
                              }
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                day.isRest
                                  ? 'bg-neutral-200 text-neutral-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {day.isRest ? 'Repos' : 'Entraînement'}
                            </button>
                          </div>

                          {!day.isRest ? (
                            <>
                              <div className="sm:col-span-5">
                                <select
                                  value={day.routineId || ''}
                                  onChange={(e) => {
                                    const r = routines.find((rt) => rt.id === e.target.value);
                                    handleUpdateBuilderDay(builderActiveWeek, dIdx, {
                                      routineId: e.target.value,
                                      workoutTitle: r ? r.name : day.workoutTitle,
                                      label: `Jour ${day.dayNumber} — ${r ? r.name : 'Séance'}`,
                                    });
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#FBCFE8] bg-[#FDF2F8] text-[11px] font-bold text-[#2B091C]"
                                >
                                  {routines.map((rt) => (
                                    <option key={rt.id} value={rt.id}>
                                      {rt.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="sm:col-span-4">
                                <select
                                  value={day.finisherPresetId || ''}
                                  onChange={(e) =>
                                    handleUpdateBuilderDay(builderActiveWeek, dIdx, {
                                      finisherPresetId: e.target.value || undefined,
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#FBCFE8] bg-white text-[11px] font-semibold text-[#593E4C]"
                                >
                                  <option value="">Sans Finisher</option>
                                  {FINISHERS_CATALOG.map((fin) => (
                                    <option key={fin.id} value={fin.id}>
                                      🔥 {fin.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </>
                          ) : (
                            <div className="sm:col-span-9 text-[11px] text-neutral-400 italic">
                              Journée de récupération musculaire ou mobilité douce
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="pt-3 border-t border-[#FBCFE8] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreatorModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveCustomProgram}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#831843] to-[#EC4899] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Enregistrer mon programme</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 4 : PARTAGE & EXPORT DE PROGRAMME (CODE / JSON / FICHE)     */}
      {/* ================================================================= */}
      {shareModalProgram && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-[#2B091C]/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-[32px] border border-[#FBCFE8] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#2B091C] font-display">
                Partager « {shareModalProgram.title} »
              </h3>
              <button
                type="button"
                onClick={() => setShareModalProgram(null)}
                className="p-1.5 rounded-full bg-[#FDF2F8] text-[#831843]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#7A616F]">
              Partagez ce code unique ou le fichier JSON avec une amie ou votre coach pour qu’elle puisse importer l’intégralité des {shareModalProgram.durationWeeks} semaines.
            </p>

            <div className="p-3 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8]">
              <p className="text-[10px] font-mono text-[#831843] break-all line-clamp-3">
                {exportProgramCode(shareModalProgram)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={async () => {
                  const code = exportProgramCode(shareModalProgram);
                  if (navigator.clipboard) await navigator.clipboard.writeText(code);
                  triggerToast('Code de partage copié dans le presse-papiers !');
                }}
                className="py-3 px-3 rounded-2xl bg-[#831843] text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le Code</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  const jsonStr = JSON.stringify(shareModalProgram, null, 2);
                  if (navigator.clipboard) await navigator.clipboard.writeText(jsonStr);
                  triggerToast('Structure JSON copiée dans le presse-papiers !');
                }}
                className="py-3 px-3 rounded-2xl bg-[#FCE7F3] text-[#831843] text-xs font-extrabold flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copier JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 5 : IMPORTER UN PROGRAMME D'UN AMI OU COACH                 */}
      {/* ================================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-[#2B091C]/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-[32px] border border-[#FBCFE8] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#2B091C] font-display">
                Importer un Programme (Code ou JSON)
              </h3>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="p-1.5 rounded-full bg-[#FDF2F8] text-[#831843]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={4}
              value={importInputCode}
              onChange={(e) => setImportInputCode(e.target.value)}
              placeholder="Collez ici le code de partage GlowUpLab ou le JSON du programme..."
              className="w-full p-3.5 rounded-2xl border border-[#FBCFE8] bg-[#FDF2F8] text-xs font-mono text-[#2B091C]"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-5 py-2.5 rounded-xl bg-[#831843] text-white text-xs font-extrabold flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Importer dans mon catalogue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 6 : ÉCRAN DE BILAN DU PROGRAMME (VOLUME, SÉANCES, MENSURATIONS) */}
      {/* ================================================================= */}
      {showBilanModal && activeProgram && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#12030D]/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-gradient-to-b from-[#2B091C] to-[#160410] border border-pink-500/40 rounded-[32px] p-6 text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400 block">
                    Bilan Officiel GlowUpLab
                  </span>
                  <h3 className="text-xl font-extrabold font-display">
                    {activeProgram.programTitle}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBilanModal(false)}
                className="p-2 rounded-full bg-white/10 text-pink-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key KPI Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-500/25">
                <Dumbbell className="w-4 h-4 text-pink-400 mx-auto mb-1" />
                <span className="text-lg font-black block">
                  {activeProgram.totalVolumeKg.toLocaleString('fr-FR')} kg
                </span>
                <span className="text-[10px] text-pink-200/70 uppercase font-bold">
                  Volume Total Soulevé
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-500/25">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-lg font-black block">
                  {activeProgram.completedSessionCount} / {activeProgram.totalSessionsPlanned}
                </span>
                <span className="text-[10px] text-pink-200/70 uppercase font-bold">
                  Séances Validées
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-500/25">
                <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-lg font-black block">{activeProgram.progressPercent}%</span>
                <span className="text-[10px] text-pink-200/70 uppercase font-bold">
                  Achèvement Global
                </span>
              </div>
            </div>

            {/* Évolution des Mensurations entre le Jour 1 et Aujourd'hui */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Évolution des Mensurations (Jour 1 → Aujourd’hui)
                </span>
              </div>

              {initialMeas && latestMeas ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  {[
                    { label: 'Poids', start: initialMeas.weight, end: latestMeas.weight, unit: 'kg' },
                    { label: 'Taille', start: initialMeas.waist, end: latestMeas.waist, unit: 'cm' },
                    { label: 'Hanches / Fessiers', start: initialMeas.hips, end: latestMeas.hips, unit: 'cm' },
                    { label: 'Cuisses', start: initialMeas.thighs, end: latestMeas.thighs, unit: 'cm' },
                  ].map((item) => {
                    const diff =
                      item.start !== undefined && item.end !== undefined
                        ? Number((item.end - item.start).toFixed(1))
                        : null;
                    return (
                      <div key={item.label} className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                        <span className="text-[10px] text-pink-200/70 font-bold block">
                          {item.label}
                        </span>
                        <span className="text-xs font-extrabold text-white block mt-0.5">
                          {item.end !== undefined ? `${item.end} ${item.unit}` : '—'}
                        </span>
                        {diff !== null && (
                          <span
                            className={`text-[10px] font-bold block ${
                              diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-pink-400' : 'text-white/50'
                            }`}
                          >
                            {diff > 0 ? `+${diff}` : diff} {item.unit}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-pink-200/75">
                  Ajoutez vos mensurations dans l’onglet « Progrès » pour visualiser automatiquement votre comparatif Jour 1 vs Dernier jour.
                </p>
              )}
            </div>

            {/* Finishers completed count */}
            <div className="p-3.5 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-between text-xs">
              <span className="font-bold text-pink-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Finishers relevés en fin de séance :
              </span>
              <span className="font-extrabold text-white">
                {workouts.filter((w) => w.finisherLog || w.finisher).length} Finishers validés
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowBilanModal(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#831843] text-white font-extrabold text-xs"
            >
              Continuer ma progression GlowUpLab
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
