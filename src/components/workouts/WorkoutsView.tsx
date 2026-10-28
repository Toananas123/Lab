import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  Play,
  RotateCcw,
  Trash2,
  Edit2,
  Share2,
  Check,
  X,
  Copy,
  Link,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { Workout, Routine, WorkoutExerciseItem } from '../../types/fitness';
import {
  ABDOS_CIRCUITS,
  CARDIO_CIRCUITS,
  AbdoCircuit,
  CardioCircuit,
} from '../../data/exercisesData';
import { WorkoutGeneratorModal } from './WorkoutGeneratorModal';
import { WorkoutEditorModal } from './WorkoutEditorModal';
import { WarmupAndStretchingGuide } from './WarmupAndStretchingGuide';
import { PersonalGearReminder } from '../common/PersonalGearReminder';
import { StreamlineIcon, StreamlineIconName } from '../ui/StreamlineIcon';
import { BottomSheet } from '../ui/BottomSheet';

interface WorkoutsViewProps {
  onStartActiveMode: () => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({ onStartActiveMode }) => {
  const {
    routines,
    workouts,
    startWorkout,
    createRoutine,
    deleteRoutine,
    deleteWorkout,
    updateWorkout,
    duplicateWorkoutAsNew,
    sharedTemplateWorkout,
    setSharedTemplateWorkout,
    loadSharedWorkout,
    createShareCode,
  } = useWorkout();

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'routines' | 'history'>('routines');
  const [routineFilter, setRoutineFilter] = useState<'all' | 'strength' | 'abs' | 'cardio'>('all');

  // Preview modal for a specific Abdo or Cardio circuit
  const [selectedAbdoCircuit, setSelectedAbdoCircuit] = useState<AbdoCircuit | null>(null);
  const [selectedCardioCircuit, setSelectedCardioCircuit] = useState<CardioCircuit | null>(null);

  // Shared paste modal
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteCodeInput, setPasteCodeInput] = useState('');
  const [pasteError, setPasteError] = useState('');

  // Dedicated Share BottomSheet
  const [shareModalData, setShareModalData] = useState<{
    title: string;
    formattedText: string;
    shareUrl: string;
    shareCode: string;
  } | null>(null);
  const [copiedType, setCopiedType] = useState<'text' | 'link' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit past workout BottomSheet
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editRating, setEditRating] = useState<number>(5);
  const [editFinisher, setEditFinisher] = useState('');
  const [editFinisherType, setEditFinisherType] = useState<'none' | 'cardio' | 'abs'>('none');
  const [showWarmupModal, setShowWarmupModal] = useState(false);

  const completedWorkouts = workouts.filter((w) => w.status === 'completed');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartRoutine = (routine: Routine) => {
    const clonedExercises: WorkoutExerciseItem[] = routine.exercises.map((ex, exIdx) => ({
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

  const handleLaunchAbdoCircuit = (circuit: AbdoCircuit) => {
    const items: WorkoutExerciseItem[] = circuit.exercises.map((ex, idx) => {
      const parsedReps = parseInt(ex.reps.replace(/[^0-9]/g, ''), 10) || 12;
      return {
        id: `abdo_ex_${Date.now()}_${idx}`,
        exerciseId: `circuit_${circuit.id}_${idx}`,
        exerciseName: `${ex.name} (${ex.reps})`,
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 25,
        sets: [
          { id: `s1_${idx}`, setNumber: 1, targetReps: parsedReps, targetWeight: 0, completed: false },
          { id: `s2_${idx}`, setNumber: 2, targetReps: parsedReps, targetWeight: 0, completed: false },
          { id: `s3_${idx}`, setNumber: 3, targetReps: parsedReps, targetWeight: 0, completed: false },
        ],
      };
    });

    startWorkout({
      name: circuit.name.replace(/^\d+\.\s*/, ''),
      exercises: items,
      finisher: 'Gainage actif final (45 sec)',
      notes: `Focus : ${circuit.focus}`,
    });
    setSelectedAbdoCircuit(null);
    onStartActiveMode();
  };

  const handleLaunchCardioCircuit = (circuit: CardioCircuit) => {
    const items: WorkoutExerciseItem[] = circuit.intervals.map((step, idx) => ({
      id: `cardio_ex_${Date.now()}_${idx}`,
      exerciseId: `circuit_${circuit.id}_${idx}`,
      exerciseName: `${step.time} · ${step.instruction}`,
      category: 'cardio',
      equipment: 'cardio_machine',
      restSeconds: 0,
      sets: [
        {
          id: `s1_${idx}`,
          setNumber: 1,
          targetReps: circuit.durationMinutes,
          targetWeight: 0,
          completed: false,
        },
      ],
    }));

    startWorkout({
      name: `${circuit.name.replace(/^\d+\.\s*/, '')} (${circuit.machine})`,
      exercises: items,
      finisher: 'Retour au calme & hydratation',
      notes: circuit.description,
    });
    setSelectedCardioCircuit(null);
    onStartActiveMode();
  };

  const handleDuplicateWorkout = (w: Workout) => {
    duplicateWorkoutAsNew(w);
    onStartActiveMode();
  };

  const buildWorkoutSharePayload = (w: Workout, isRoutineModel = false) => {
    const code = createShareCode(w);
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const shareUrl = `${baseUrl}?share=${encodeURIComponent(code)}`;

    const exLines = w.exercises
      .map((ex, i) => {
        const setsDetail = ex.sets
          .map((s) => {
            const weight = s.actualWeight ?? s.targetWeight ?? 0;
            const reps = s.actualReps ?? s.targetReps ?? 10;
            return `${reps} reps${weight > 0 ? ` @ ${weight}kg` : ''}`;
          })
          .join(', ');
        return `  ${i + 1}. ${ex.exerciseName} (${ex.sets.length} séries : ${setsDetail})`;
      })
      .join('\n');

    const formattedText = [
      `${isRoutineModel ? 'Routine Glow Up Lab' : 'Séance Terminée Glow Up Lab'} : ${w.name}`,
      !isRoutineModel ? `Date : ${w.date} · Durée : ${w.durationMinutes || 45} min` : null,
      !isRoutineModel && w.rating ? `Ressenti : ${w.rating}/5` : null,
      ``,
      `Détail des exercices (${w.exercises.length}) :`,
      exLines,
      w.finisher ? `\nFinisher : ${w.finisher}` : null,
      w.notes ? `Notes : ${w.notes}` : null,
      ``,
      `Lien pour ouvrir ou importer la séance :`,
      shareUrl,
    ]
      .filter((line) => line !== null)
      .join('\n');

    return {
      title: w.name,
      formattedText,
      shareUrl,
      shareCode: code,
    };
  };

  const handleShareWorkout = (w: Workout) => {
    const payload = buildWorkoutSharePayload(w, false);
    setCopiedType(null);
    setShareModalData(payload);
  };

  const handleShareRoutine = (r: Routine) => {
    const dummyWorkout: Workout = {
      id: `share_routine_${Date.now()}`,
      userId: 'guest',
      name: r.name,
      date: new Date().toISOString().split('T')[0],
      status: 'planned',
      exercises: r.exercises,
      finisher: r.finisher,
      notes: r.notes,
    };
    const payload = buildWorkoutSharePayload(dummyWorkout, true);
    setCopiedType(null);
    setShareModalData(payload);
  };

  const handleCopyShareItem = async (type: 'text' | 'link', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 3000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (!shareModalData) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Séance Glow Up Lab : ${shareModalData.title}`,
          text: shareModalData.formattedText,
          url: shareModalData.shareUrl,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    await handleCopyShareItem('text', shareModalData.formattedText);
  };

  const handleImportPastedCode = () => {
    setPasteError('');
    const success = loadSharedWorkout(pasteCodeInput);
    if (success) {
      setShowPasteModal(false);
      setPasteCodeInput('');
      showToast('Séance partagée chargée avec succès !');
    } else {
      setPasteError('Lien ou code de partage invalide.');
    }
  };

  const handleOpenEditWorkout = (w: Workout) => {
    setEditingWorkout(w);
    setEditName(w.name);
    setEditDate(w.date);
    setEditNotes(w.notes || '');
    setEditRating(w.rating || 5);
    setEditFinisher(w.finisher || '');
    setEditFinisherType(
      w.finisher
        ? w.finisher.toLowerCase().includes('abdo') || w.finisher.toLowerCase().includes('gainage')
          ? 'abs'
          : 'cardio'
        : 'none'
    );
  };

  const handleSaveEditedWorkout = async () => {
    if (!editingWorkout) return;
    await updateWorkout(editingWorkout.id, {
      name: editName.trim() || editingWorkout.name,
      date: editDate,
      notes: editNotes.trim(),
      rating: editRating,
      finisher: editFinisherType !== 'none' ? editFinisher.trim() : undefined,
    });
    setEditingWorkout(null);
  };

  const getRoutineIcon = (targetZone: string): StreamlineIconName => {
    if (targetZone === 'abs') return 'stretch';
    if (targetZone === 'cardio') return 'runner';
    if (targetZone === 'arms') return 'biceps';
    if (targetZone === 'back') return 'dumbbell';
    return 'weightlifter';
  };

  const getRoutineBadgeLabel = (targetZone: string): string => {
    if (targetZone === 'abs') return 'Circuit Abdos';
    if (targetZone === 'cardio') return 'Circuit Cardio';
    if (targetZone === 'arms') return 'Bras & Épaules';
    if (targetZone === 'back') return 'Dos';
    if (targetZone === 'fullbody') return 'Full Body';
    return 'Bas du corps';
  };

  const filteredRoutines = routines.filter((r) => {
    if (routineFilter === 'all') return true;
    if (routineFilter === 'abs') return r.targetZone === 'abs';
    if (routineFilter === 'cardio') return r.targetZone === 'cardio';
    return r.targetZone !== 'abs' && r.targetZone !== 'cardio';
  });

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* 1. Large Bold Header + Top-Right Circular Icons */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[#2B091C]">
          Séances
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPasteModal(true)}
            className="w-10 h-10 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] text-[#831843] flex items-center justify-center transition-colors"
            title="Importer une séance partagée"
          >
            <StreamlineIcon name="share" className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowWarmupModal(true)}
            className="w-10 h-10 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] text-[#831843] flex items-center justify-center transition-colors"
            title="Échauffement & Étirements"
          >
            <StreamlineIcon name="stretch" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Dual Primary Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          onClick={() => setIsEditorOpen(true)}
          className="p-4 rounded-[26px] bg-[#831843] hover:bg-[#3B0726] text-white text-left flex items-center justify-between gap-3.5 transition-all active:scale-99"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0">
              <Plus className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-[15px] text-white leading-snug">
                Saisir une séance
              </h2>
              <p className="text-xs text-[#FBCFE8]/90 truncate">
                Créer ma séance sur mesure
              </p>
            </div>
          </div>
          <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0">
            <ChevronRight className="w-4 h-4" />
          </span>
        </button>

        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="p-4 rounded-[26px] bg-[#F6EDF2] hover:bg-[#F1E2EA] text-[#2B091C] text-left flex items-center justify-between gap-3.5 transition-all active:scale-99"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#EC4899] shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-[15px] text-[#2B091C] leading-snug">
                Propose-moi une séance
              </h2>
              <p className="text-xs text-[#7A616F] truncate">
                Muscu, circuits abdos & cardio
              </p>
            </div>
          </div>
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#831843] shrink-0">
            <ChevronRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shared Template Reception Banner */}
      {sharedTemplateWorkout && (
        <div className="p-4 rounded-[26px] bg-[#FCE7F3] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843]">
                Séance partagée reçue
              </span>
              <h3 className="font-display font-bold text-base text-[#2B091C]">
                {sharedTemplateWorkout.name}
              </h3>
            </div>
            <button
              onClick={() => setSharedTemplateWorkout(null)}
              className="p-1 text-[#7A616F] hover:text-[#2B091C] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                startWorkout({
                  name: sharedTemplateWorkout.name,
                  exercises: sharedTemplateWorkout.exercises,
                  finisher: sharedTemplateWorkout.finisher,
                  notes: sharedTemplateWorkout.notes,
                });
                setSharedTemplateWorkout(null);
                onStartActiveMode();
              }}
              className="px-4 py-2 rounded-full bg-[#831843] text-white font-bold text-xs"
            >
              Démarrer
            </button>
            <button
              onClick={async () => {
                await createRoutine({
                  name: sharedTemplateWorkout.name,
                  targetZone: sharedTemplateWorkout.exercises[0]?.category || 'lower-body',
                  exercises: sharedTemplateWorkout.exercises,
                  finisher: sharedTemplateWorkout.finisher,
                  notes: sharedTemplateWorkout.notes,
                });
                setSharedTemplateWorkout(null);
                showToast('Routine sauvegardée !');
              }}
              className="px-4 py-2 rounded-full bg-white text-[#831843] font-bold text-xs"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {/* 3. Clean Inline Tabs with Count Pills */}
      <div className="flex items-center gap-6 border-b border-[#F1E4EC] pt-1">
        <button
          onClick={() => setActiveTab('routines')}
          className={`pb-2.5 flex items-center gap-1.5 text-sm transition-colors border-b-2 -mb-[1px] ${
            activeTab === 'routines'
              ? 'border-[#831843] font-bold text-[#2B091C]'
              : 'border-transparent font-medium text-[#8C6D7E] hover:text-[#2B091C]'
          }`}
        >
          <span>Séances proposées</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
              activeTab === 'routines'
                ? 'bg-[#FCE7F3] text-[#831843]'
                : 'bg-[#F6EDF2] text-[#8C6D7E]'
            }`}
          >
            {routines.length + ABDOS_CIRCUITS.length + CARDIO_CIRCUITS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 flex items-center gap-1.5 text-sm transition-colors border-b-2 -mb-[1px] ${
            activeTab === 'history'
              ? 'border-[#831843] font-bold text-[#2B091C]'
              : 'border-transparent font-medium text-[#8C6D7E] hover:text-[#2B091C]'
          }`}
        >
          <span>Historique</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
              activeTab === 'history'
                ? 'bg-[#FCE7F3] text-[#831843]'
                : 'bg-[#F6EDF2] text-[#8C6D7E]'
            }`}
          >
            {completedWorkouts.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Séances proposées (Routines + Circuits Abdos + Circuits Cardio) */}
      {activeTab === 'routines' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {(
              [
                { id: 'all', label: 'Toutes' },
                { id: 'strength', label: 'Musculation' },
                { id: 'abs', label: 'Circuits Abdos' },
                { id: 'cardio', label: 'Circuits Cardio' },
              ] as const
            ).map((f) => {
              const active = routineFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setRoutineFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    active
                      ? 'bg-[#831843] text-white'
                      : 'bg-[#F6EDF2] text-[#7A616F] hover:text-[#2B091C]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Routines List */}
          <div className="space-y-2.5">
            {filteredRoutines.map((routine) => {
              const totalSets = routine.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
              const badgeLabel = getRoutineBadgeLabel(routine.targetZone);
              const iconName = getRoutineIcon(routine.targetZone);

              return (
                <div
                  key={routine.id}
                  onClick={() => handleStartRoutine(routine)}
                  className="p-3.5 sm:p-4 rounded-[26px] bg-[#F6EDF2] hover:bg-[#F1E2EA] transition-all flex items-center justify-between gap-3.5 cursor-pointer active:scale-99"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#831843] shrink-0">
                      <StreamlineIcon name={iconName} className="w-6 h-6" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="font-compact text-[10px] font-bold uppercase tracking-wider text-[#831843] block leading-none">
                        {badgeLabel}
                      </span>
                      <h3 className="font-display font-semibold text-[15px] text-[#2B091C] leading-snug truncate">
                        {routine.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#7A616F]">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#831843]">
                          <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                          <span>{routine.exercises.length} exercices</span>
                        </span>
                        <span>·</span>
                        <span>{totalSets} séries</span>
                      </div>
                      <PersonalGearReminder exercises={routine.exercises} variant="pill-list" className="pt-0.5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!routine.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRoutine(routine.id);
                        }}
                        className="w-8 h-8 rounded-full text-[#8C6D7E] hover:text-red-600 flex items-center justify-center"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareRoutine(routine);
                      }}
                      className="w-8 h-8 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs"
                      title="Partager"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 h-8 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs">
                      <Play className="w-3.5 h-3.5 fill-[#831843]" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dedicated Circuits Abdos Section (shown when filter is 'all' or 'abs') */}
          {(routineFilter === 'all' || routineFilter === 'abs') && (
            <section className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-display font-bold text-[#2B091C]">
                  Circuits Abdos & Gainage ({ABDOS_CIRCUITS.length})
                </h2>
              </div>

              <div className="space-y-2.5">
                {ABDOS_CIRCUITS.map((circuit) => (
                  <div
                    key={circuit.id}
                    onClick={() => setSelectedAbdoCircuit(circuit)}
                    className="p-3.5 sm:p-4 rounded-[26px] bg-[#F6EDF2] hover:bg-[#F1E2EA] transition-all flex items-center justify-between gap-3.5 cursor-pointer active:scale-99"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#831843] shrink-0">
                        <StreamlineIcon name="stretch" className="w-6 h-6" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="font-compact text-[10px] font-bold uppercase tracking-wider text-[#EC4899] block leading-none">
                          Circuit Abdos · {circuit.durationMinutes} min
                        </span>
                        <h3 className="font-display font-semibold text-[15px] text-[#2B091C] leading-snug truncate">
                          {circuit.name.replace(/^\d+\.\s*/, '')}
                        </h3>
                        <p className="text-xs text-[#7A616F] truncate">
                          {circuit.exercises.length} mouvements · {circuit.focus}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchAbdoCircuit(circuit);
                      }}
                      className="w-9 h-9 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs shrink-0"
                      title="Lancer ce circuit"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#831843]" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dedicated Circuits Cardio Section (shown when filter is 'all' or 'cardio') */}
          {(routineFilter === 'all' || routineFilter === 'cardio') && (
            <section className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-display font-bold text-[#2B091C]">
                  Circuits Cardio Guidés ({CARDIO_CIRCUITS.length})
                </h2>
              </div>

              <div className="space-y-2.5">
                {CARDIO_CIRCUITS.map((circuit) => (
                  <div
                    key={circuit.id}
                    onClick={() => setSelectedCardioCircuit(circuit)}
                    className="p-3.5 sm:p-4 rounded-[26px] bg-[#F6EDF2] hover:bg-[#F1E2EA] transition-all flex items-center justify-between gap-3.5 cursor-pointer active:scale-99"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#831843] shrink-0">
                        <StreamlineIcon name="runner" className="w-6 h-6" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="font-compact text-[10px] font-bold uppercase tracking-wider text-[#831843] block leading-none">
                          {circuit.machine} · {circuit.durationMinutes} min · {circuit.intensity}
                        </span>
                        <h3 className="font-display font-semibold text-[15px] text-[#2B091C] leading-snug truncate">
                          {circuit.name.replace(/^\d+\.\s*/, '')}
                        </h3>
                        <p className="text-xs text-[#7A616F] truncate">
                          {circuit.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchCardioCircuit(circuit);
                      }}
                      className="w-9 h-9 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs shrink-0"
                      title="Lancer ce circuit"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#831843]" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Tab 2: Clean List of History Cards */}
      {activeTab === 'history' && (
        <div className="space-y-2.5">
          {completedWorkouts.length === 0 ? (
            <div className="p-8 rounded-[28px] bg-[#F6EDF2] text-center space-y-2">
              <h3 className="font-bold font-display text-[#2B091C] text-base">
                Aucune séance terminée
              </h3>
              <p className="text-xs text-[#7A616F]">
                Lance une routine ci-dessus pour démarrer ton historique.
              </p>
            </div>
          ) : (
            completedWorkouts.map((w) => (
              <div
                key={w.id}
                className="p-3.5 sm:p-4 rounded-[26px] bg-[#F6EDF2] flex items-center justify-between gap-3.5"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#831843] shrink-0">
                    <StreamlineIcon name="weightlifter" className="w-6 h-6" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="font-display font-semibold text-[15px] text-[#2B091C] leading-snug truncate">
                      {w.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#7A616F]">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#831843]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>{w.date}</span>
                      </span>
                      <span>·</span>
                      <span>{w.exercises.length} exercices</span>
                      {w.rating && (
                        <>
                          <span>·</span>
                          <span>{w.rating}/5</span>
                        </>
                      )}
                    </div>
                    {w.exercises.some((ex) => ex.replacedFrom) && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {w.exercises
                          .filter((ex) => ex.replacedFrom)
                          .map((ex) => (
                            <span
                              key={ex.id}
                              className="inline-block px-2 py-0.5 rounded-full bg-white text-[#831843] text-[10px] font-semibold"
                            >
                              {ex.replacedFrom} remplacé par {ex.exerciseName}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleShareWorkout(w)}
                    className="w-8 h-8 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs"
                    title="Partager"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEditWorkout(w)}
                    className="w-8 h-8 rounded-full bg-white text-[#831843] flex items-center justify-center shadow-2xs"
                    title="Modifier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicateWorkout(w)}
                    className="h-8 px-3 rounded-full bg-[#831843] text-white text-xs font-semibold flex items-center gap-1"
                    title="Refaire cette séance"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Refaire</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Abdo Circuit Detail BottomSheet */}
      <BottomSheet
        isOpen={!!selectedAbdoCircuit}
        onClose={() => setSelectedAbdoCircuit(null)}
        title={selectedAbdoCircuit?.name.replace(/^\d+\.\s*/, '')}
        subtitle={
          selectedAbdoCircuit
            ? `${selectedAbdoCircuit.durationMinutes} min · ${selectedAbdoCircuit.focus}`
            : ''
        }
      >
        {selectedAbdoCircuit && (
          <div className="space-y-4">
            <div className="space-y-2.5">
              {selectedAbdoCircuit.exercises.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#F6EDF2] space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-xs text-[#2B091C]">
                      {idx + 1}. {step.name}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#831843] bg-white px-2.5 py-0.5 rounded-full shrink-0">
                      {step.reps}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A616F] leading-relaxed">{step.position}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleLaunchAbdoCircuit(selectedAbdoCircuit)}
              className="w-full py-3.5 rounded-full bg-[#831843] text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Démarrer ce circuit abdos</span>
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Cardio Circuit Detail BottomSheet */}
      <BottomSheet
        isOpen={!!selectedCardioCircuit}
        onClose={() => setSelectedCardioCircuit(null)}
        title={selectedCardioCircuit?.name.replace(/^\d+\.\s*/, '')}
        subtitle={
          selectedCardioCircuit
            ? `${selectedCardioCircuit.machine} · ${selectedCardioCircuit.durationMinutes} min · Intensité ${selectedCardioCircuit.intensity}`
            : ''
        }
      >
        {selectedCardioCircuit && (
          <div className="space-y-4">
            <p className="text-xs text-[#7A616F] leading-relaxed">
              {selectedCardioCircuit.description}
            </p>

            <div className="space-y-2">
              {selectedCardioCircuit.intervals.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F6EDF2] flex items-start gap-3"
                >
                  <span className="font-mono font-bold text-[11px] text-[#831843] bg-white px-2.5 py-1 rounded-xl shrink-0">
                    {step.time}
                  </span>
                  <span className="text-xs text-[#2B091C] font-medium leading-relaxed">
                    {step.instruction}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleLaunchCardioCircuit(selectedCardioCircuit)}
              className="w-full py-3.5 rounded-full bg-[#831843] text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Démarrer ce circuit cardio</span>
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Share BottomSheet */}
      <BottomSheet
        isOpen={!!shareModalData}
        onClose={() => setShareModalData(null)}
        title="Partager la séance"
        subtitle={shareModalData?.title}
      >
        {shareModalData && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#F6EDF2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2B091C] flex items-center gap-1.5 text-xs">
                  <Link className="w-3.5 h-3.5 text-[#831843]" />
                  <span>Lien direct</span>
                </span>
                <button
                  onClick={() => handleCopyShareItem('link', shareModalData.shareUrl)}
                  className="px-3 py-1.5 rounded-full bg-[#831843] text-white font-bold text-[11px] flex items-center gap-1"
                >
                  {copiedType === 'link' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'link' ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={shareModalData.shareUrl}
                className="w-full px-3 py-2 rounded-xl bg-white font-mono text-[10px] text-[#2B091C]"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6EDF2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2B091C] flex items-center gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-[#831843]" />
                  <span>Résumé texte</span>
                </span>
                <button
                  onClick={() => handleCopyShareItem('text', shareModalData.formattedText)}
                  className="px-3 py-1.5 rounded-full bg-[#EC4899] text-white font-bold text-[11px] flex items-center gap-1"
                >
                  {copiedType === 'text' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'text' ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-white font-sans text-[11px] text-[#2B091C] whitespace-pre-wrap max-h-40 overflow-y-auto">
                {shareModalData.formattedText}
              </pre>
            </div>

            <button
              onClick={handleNativeShare}
              className="w-full py-3.5 rounded-full bg-[#831843] text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Share2 className="w-4 h-4" />
              <span>Envoyer</span>
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Paste Shared Workout BottomSheet */}
      <BottomSheet
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        title="Importer une séance"
        subtitle="Colle le lien ou le code reçu"
      >
        <div className="space-y-3">
          <textarea
            value={pasteCodeInput}
            onChange={(e) => setPasteCodeInput(e.target.value)}
            placeholder="Colle ici le lien ?share=... ou le code..."
            rows={3}
            className="w-full p-3 rounded-2xl bg-[#F6EDF2] text-xs font-mono text-[#2B091C]"
          />
          {pasteError && <p className="text-xs text-red-600 font-bold">{pasteError}</p>}
          <button
            onClick={handleImportPastedCode}
            className="w-full py-3.5 rounded-full bg-[#831843] text-white font-bold text-xs min-h-[48px]"
          >
            Charger la séance
          </button>
        </div>
      </BottomSheet>

      {/* Edit Past Workout BottomSheet */}
      <BottomSheet
        isOpen={!!editingWorkout}
        onClose={() => setEditingWorkout(null)}
        title="Modifier la séance"
      >
        {editingWorkout && (
          <div className="space-y-3.5">
            <div>
              <label className="block font-bold text-[#2B091C] text-[11px] mb-1">Nom de la séance</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs font-bold text-[#2B091C]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2B091C] text-[11px] mb-1">Date</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs font-bold text-[#2B091C]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2B091C] text-[11px] mb-1">
                Ressenti ({editRating}/5)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEditRating(lvl)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      editRating >= lvl
                        ? 'bg-[#EC4899] text-white'
                        : 'bg-[#F6EDF2] text-[#8C6D7E]'
                    }`}
                  >
                    <StreamlineIcon name="heart-pulse" className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-bold text-[#2B091C] text-[11px] mb-1">Notes</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-2xl bg-[#F6EDF2] text-xs text-[#2B091C]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  deleteWorkout(editingWorkout.id);
                  setEditingWorkout(null);
                }}
                className="px-4 py-3.5 rounded-full bg-red-50 text-red-700 font-bold text-xs"
              >
                Supprimer
              </button>
              <button
                onClick={handleSaveEditedWorkout}
                className="flex-1 py-3.5 rounded-full bg-[#831843] text-white font-bold text-xs"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Warmup & Stretching BottomSheet */}
      <BottomSheet
        isOpen={showWarmupModal}
        onClose={() => setShowWarmupModal(false)}
        title="Échauffement & Étirements"
      >
        <WarmupAndStretchingGuide category="lower-body" />
      </BottomSheet>

      {/* Generator & Editor Modals */}
      <WorkoutGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onLaunchWorkout={(w) => {
          startWorkout(w);
          onStartActiveMode();
        }}
        onSaveAsRoutine={(r) => {
          createRoutine(r);
          showToast('Routine sauvegardée !');
        }}
      />

      <WorkoutEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onLaunchWorkout={(w) => {
          startWorkout(w);
          onStartActiveMode();
        }}
        onSaveRoutine={(r) => {
          createRoutine(r);
          showToast('Routine enregistrée !');
        }}
      />
    </div>
  );
};
