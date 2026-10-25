import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  Play,
  Pause,
  Music,
  X,
  RotateCcw,
  Lightbulb,
  Plus,
  Minus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Workout, WorkoutExerciseItem, ExerciseSet } from '../../types/fitness';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { playRestCompleteSound } from '../../utils/audio';
import { getEquipmentBadge } from '../../utils/equipmentBadge';
import { WarmupAndStretchingGuide } from './WarmupAndStretchingGuide';
import { StreamlineIcon } from '../ui/StreamlineIcon';
import { BottomSheet } from '../ui/BottomSheet';
import { CARDIO_FINISHER_PRESETS, ABDOS_FINISHER_PRESETS } from '../planning/PlanningView';

interface ActiveWorkoutViewProps {
  onFinishWorkout: () => void;
  onExit: () => void;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({ onFinishWorkout, onExit }) => {
  const {
    activeWorkout,
    updateActiveWorkout,
    finishActiveWorkout,
    cancelActiveWorkout,
    getPreviousPerformance,
    getPersonalRecords,
  } = useWorkout();
  const { profile, updateUserProfile } = useAuth();

  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 1-tap Finisher, Water, Rating & Notes directly accessible
  const [finisherTypeChoice, setFinisherTypeChoice] = useState<'none' | 'cardio' | 'abs'>(
    activeWorkout?.finisher ? 'cardio' : 'none'
  );
  const [finisherChoice, setFinisherChoice] = useState<string>(activeWorkout?.finisher || '');
  const [notesInput, setNotesInput] = useState(activeWorkout?.notes || '');
  const [sessionRating, setSessionRating] = useState<number>(activeWorkout?.rating || 5);

  const [showWarmupModal, setShowWarmupModal] = useState(false);
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);
  const [customSpotifyUrl, setCustomSpotifyUrl] = useState(profile?.spotifyUrl || '');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  // Hydration state & 10-minute reminder
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [waterPrompt, setWaterPrompt] = useState(false);
  const [workoutSecondsElapsed, setWorkoutSecondsElapsed] = useState(0);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    workoutTimerRef.current = setInterval(() => {
      setWorkoutSecondsElapsed((sec) => {
        const next = sec + 1;
        if (next % 600 === 0) {
          setWaterPrompt(true);
        }
        return next;
      });
    }, 1000);

    return () => {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTimerRunning && restTimerSeconds !== null && restTimerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            playRestCompleteSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restTimerSeconds === 0) {
      setIsTimerRunning(false);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, restTimerSeconds]);

  if (!activeWorkout || activeWorkout.exercises.length === 0) {
    return (
      <div className="p-8 text-center space-y-4 bg-white rounded-[32px] border border-[#FBCFE8] max-w-md mx-auto my-8 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] text-[#831843] flex items-center justify-center mx-auto">
          <StreamlineIcon name="weightlifter" className="w-6 h-6 text-[#831843]" />
        </div>
        <h2 className="font-display font-bold text-[#3B0726] text-base">Aucune séance active</h2>
        <p className="text-xs text-[#7A616F]">Démarre une séance depuis tes routines ou l'accueil.</p>
        <button
          onClick={onExit}
          className="px-6 py-3 bg-[#831843] text-white rounded-full text-xs font-bold"
        >
          Retour aux séances
        </button>
      </div>
    );
  }

  const prs = getPersonalRecords();

  const totalSets = activeWorkout.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const completedSets = activeWorkout.exercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const handleStartRestTimer = (seconds: number) => {
    setRestTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  // Toggle set completion with animated checkmark + auto rest timer
  const toggleSetComplete = (exIndex: number, setIndex: number) => {
    const updatedExercises = [...activeWorkout.exercises];
    const targetExercise = { ...updatedExercises[exIndex] };
    const setsCopy = [...targetExercise.sets];
    const targetSet = setsCopy[setIndex];

    const isNowCompleted = !targetSet.completed;
    setsCopy[setIndex] = {
      ...targetSet,
      completed: isNowCompleted,
      actualWeight: targetSet.actualWeight ?? targetSet.targetWeight,
      actualReps: targetSet.actualReps ?? targetSet.targetReps,
    };

    targetExercise.sets = setsCopy;
    updatedExercises[exIndex] = targetExercise;

    updateActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises,
    });

    if (isNowCompleted) {
      handleStartRestTimer(targetExercise.restSeconds || profile?.defaultRestTime || 75);
    }
  };

  // Update weight or reps via + / - steppers or direct input
  const updateSetValues = (exIndex: number, setIndex: number, weight: number, reps: number) => {
    const updatedExercises = [...activeWorkout.exercises];
    const targetExercise = { ...updatedExercises[exIndex] };
    const setsCopy = [...targetExercise.sets];

    const cleanWeight = Math.max(0, Number(weight.toFixed(1)));
    const cleanReps = Math.max(1, Math.round(reps));

    setsCopy[setIndex] = {
      ...setsCopy[setIndex],
      targetWeight: cleanWeight,
      actualWeight: cleanWeight,
      targetReps: cleanReps,
      actualReps: cleanReps,
    };

    targetExercise.sets = setsCopy;
    updatedExercises[exIndex] = targetExercise;
    updateActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  // + / - Series stepper per exercise card
  const handleAddSet = (exIndex: number) => {
    const updatedExercises = [...activeWorkout.exercises];
    const targetExercise = { ...updatedExercises[exIndex] };
    const lastSet = targetExercise.sets[targetExercise.sets.length - 1];
    const newSet: ExerciseSet = {
      id: `set_${Date.now()}_${targetExercise.sets.length + 1}`,
      setNumber: targetExercise.sets.length + 1,
      targetReps: lastSet ? lastSet.actualReps ?? lastSet.targetReps : 10,
      targetWeight: lastSet ? lastSet.actualWeight ?? lastSet.targetWeight : 20,
      actualReps: lastSet ? lastSet.actualReps ?? lastSet.targetReps : 10,
      actualWeight: lastSet ? lastSet.actualWeight ?? lastSet.targetWeight : 20,
      completed: false,
    };
    targetExercise.sets = [...targetExercise.sets, newSet];
    updatedExercises[exIndex] = targetExercise;
    updateActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  const handleRemoveSet = (exIndex: number) => {
    const updatedExercises = [...activeWorkout.exercises];
    const targetExercise = { ...updatedExercises[exIndex] };
    if (targetExercise.sets.length <= 1) return;
    targetExercise.sets = targetExercise.sets.slice(0, -1);
    updatedExercises[exIndex] = targetExercise;
    updateActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  const applyWeightToAllSets = (exIndex: number, weight: number, reps?: number) => {
    const updatedExercises = [...activeWorkout.exercises];
    const targetExercise = { ...updatedExercises[exIndex] };
    targetExercise.sets = targetExercise.sets.map((s) => ({
      ...s,
      targetWeight: weight,
      actualWeight: weight,
      targetReps: reps ?? s.targetReps,
      actualReps: reps ?? s.actualReps ?? s.targetReps,
    }));
    updatedExercises[exIndex] = targetExercise;
    updateActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  const handleSelectFinisherOneTap = (type: 'none' | 'cardio' | 'abs') => {
    setFinisherTypeChoice(type);
    if (type === 'none') {
      setFinisherChoice('');
    } else if (type === 'cardio') {
      setFinisherChoice(CARDIO_FINISHER_PRESETS[0]);
    } else if (type === 'abs') {
      setFinisherChoice(ABDOS_FINISHER_PRESETS[0]);
    }
  };

  const handleFinishSession = async () => {
    try {
      await finishActiveWorkout(
        notesInput,
        finisherTypeChoice !== 'none' ? finisherChoice : undefined,
        sessionRating
      );
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F8A5F8', '#831843', '#EC4899', '#FBCFE8'],
      });
      onFinishWorkout();
    } catch (err) {
      console.error('Error finishing workout', err);
    }
  };

  const handleSaveSpotifyUrl = async () => {
    await updateUserProfile({ spotifyUrl: customSpotifyUrl.trim() });
    setShowSpotifyModal(false);
  };

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="space-y-4 pb-32 animate-in fade-in duration-200">
      {/* Top Bar: Épurée, fluide & minimaliste */}
      <div className="flex items-center justify-between gap-3 bg-[#13030E]/90 backdrop-blur-xl p-3 sm:p-3.5 rounded-2xl sm:rounded-full border border-white/8 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-3 py-1 rounded-full bg-[#EC4899] text-white text-[11px] font-extrabold tabular-nums">
            {progressPercent}%
          </span>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-sm sm:text-base text-white truncate">
              {activeWorkout.name}
            </h1>
            <span className="text-[11px] text-[#A88096] font-mono tabular-nums block leading-none mt-0.5">
              {formatElapsed(workoutSecondsElapsed)} · {completedSets}/{totalSets} séries
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Water Button */}
          <button
            type="button"
            onClick={() => setWaterGlasses((v) => v + 1)}
            className="h-9 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95"
            title="Eau +1"
          >
            <StreamlineIcon name="water" className="w-3.5 h-3.5 text-[#EC4899]" />
            <span className="tabular-nums">{waterGlasses}</span>
          </button>

          {/* Warmup BottomSheet Trigger */}
          <button
            type="button"
            onClick={() => setShowWarmupModal(true)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#EC4899] flex items-center justify-center transition-colors"
            title="Échauffement"
          >
            <StreamlineIcon name="stretch" className="w-3.5 h-3.5" />
          </button>

          {/* Spotify Link */}
          <button
            type="button"
            onClick={() => setShowSpotifyModal(true)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#EC4899] flex items-center justify-center transition-colors"
            title="Spotify"
          >
            <Music className="w-3.5 h-3.5" />
          </button>

          {/* Quit / Close */}
          <button
            type="button"
            onClick={() => setConfirmCancelOpen(true)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#C29DB2] hover:text-white flex items-center justify-center transition-colors"
            title="Quitter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Rest Timer Banner if active (Épuré) */}
      {restTimerSeconds !== null && restTimerSeconds > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#1C0515] border border-[#EC4899]/30 text-white flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#EC4899]">
              <StreamlineIcon name="stopwatch" className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C29DB2] block">
                Récupération
              </span>
              <span className="font-mono font-extrabold text-xl sm:text-2xl tabular-nums text-white">
                {Math.floor(restTimerSeconds / 60)}:{String(restTimerSeconds % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRestTimerSeconds((s) => (s ? s + 15 : 15))}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold"
            >
              +15s
            </button>
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-9 h-9 rounded-full bg-[#EC4899] text-white flex items-center justify-center"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setRestTimerSeconds(null);
                setIsTimerRunning(false);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#A88096] hover:text-white"
            >
              Passer
            </button>
          </div>
        </div>
      )}

      {/* Hydration Reminder Banner */}
      {waterPrompt && (
        <div className="p-3 rounded-2xl bg-[#1F0417] border border-[#EC4899]/30 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <StreamlineIcon name="water" className="w-4 h-4 text-[#EC4899] shrink-0" />
            <p className="text-xs text-[#FDF2F8]">
              Pause hydratation : bois quelques gorgées d'eau !
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setWaterGlasses((g) => g + 1);
              setWaterPrompt(false);
            }}
            className="px-3 py-1.5 rounded-full bg-[#EC4899] text-white text-xs font-bold shrink-0 min-h-[36px]"
          >
            +1 verre
          </button>
        </div>
      )}

      {/* Exercise Cards List (Épurée) */}
      <div className="space-y-3.5">
        {activeWorkout.exercises.map((exerciseItem, exIdx) => {
          const prevPerf = getPreviousPerformance(exerciseItem.exerciseId);
          const exPR = prs[exerciseItem.exerciseId];
          const maxCurrentWeight = Math.max(
            ...exerciseItem.sets.map((s) => s.actualWeight ?? s.targetWeight ?? 0)
          );
          const isBeatingPR = exPR && maxCurrentWeight > exPR.maxWeight;
          const overloadWeight = prevPerf
            ? Number((prevPerf.weight + (exerciseItem.equipment === 'dumbbell' ? 1 : 2.5)).toFixed(1))
            : null;
          const allDone = exerciseItem.sets.every((s) => s.completed);

          return (
            <div
              key={exerciseItem.id}
              className={`p-4 sm:p-5 rounded-[26px] border transition-all space-y-3 shadow-xs ${
                allDone
                  ? 'bg-[#1D0417]/95 border-[#EC4899]/40'
                  : 'bg-[#150310] border-white/8'
              }`}
            >
              {/* Card Header: Minimal Title + Series count */}
              <div className="flex items-center justify-between gap-2.5 pb-2.5 border-b border-white/6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-[#EC4899] uppercase tracking-wider">
                      Ex {exIdx + 1}
                    </span>
                    <span className="text-[11px] text-[#A88096] truncate">
                      · {getEquipmentBadge(exerciseItem.equipment).label}
                      {exerciseItem.restSeconds > 0 ? ` · ${exerciseItem.restSeconds}s` : ''}
                    </span>
                    {isBeatingPR && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EC4899] text-white text-[9px] font-extrabold">
                        <StreamlineIcon name="sparkle" className="w-2.5 h-2.5 text-white" />
                        <span>Record</span>
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-base sm:text-lg text-white mt-0.5 truncate">
                    {exerciseItem.exerciseName}
                  </h2>
                </div>

                {/* Stepper to adjust series count */}
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveSet(exIdx)}
                    disabled={exerciseItem.sets.length <= 1}
                    className="w-6 h-6 rounded-full text-[#C29DB2] hover:text-white flex items-center justify-center disabled:opacity-30 active:scale-90"
                    title="Retirer une série"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] font-bold text-white px-1 tabular-nums">
                    {exerciseItem.sets.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddSet(exIdx)}
                    className="w-6 h-6 rounded-full text-white hover:text-[#EC4899] flex items-center justify-center active:scale-90"
                    title="Ajouter une série"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Minimalist previous performance reminder */}
              {prevPerf && (
                <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] text-[11px] text-[#C29DB2]">
                  <span>
                    Dernière fois : <strong className="text-white">{prevPerf.weight} kg × {prevPerf.reps}</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyWeightToAllSets(exIdx, prevPerf.weight, prevPerf.reps)}
                      className="text-[#EC4899] hover:underline font-bold"
                    >
                      Appliquer
                    </button>
                    {overloadWeight && (
                      <button
                        type="button"
                        onClick={() => applyWeightToAllSets(exIdx, overloadWeight)}
                        className="text-white bg-[#EC4899] px-2 py-0.5 rounded-md text-[10px] font-bold"
                      >
                        +{overloadWeight} kg
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Sets Checklist with Clean Steppers */}
              <div className="space-y-2">
                {exerciseItem.sets.map((set, setIdx) => {
                  const weightVal = set.actualWeight ?? set.targetWeight ?? 0;
                  const repsVal = set.actualReps ?? set.targetReps ?? 10;
                  const weightStep = exerciseItem.equipment === 'dumbbell' ? 1 : 2.5;

                  return (
                    <div
                      key={set.id}
                      className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                        set.completed
                          ? 'bg-[#EC4899]/15 border-[#EC4899]/40'
                          : 'bg-white/[0.03] border-white/6'
                      }`}
                    >
                      {/* Left: Checkmark & Set Number */}
                      <button
                        type="button"
                        onClick={() => toggleSetComplete(exIdx, setIdx)}
                        className="flex items-center gap-2.5 min-h-[38px] text-left group"
                      >
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            set.completed
                              ? 'bg-[#EC4899] text-white shadow-xs'
                              : 'bg-white/5 border border-white/20 text-transparent group-hover:border-[#EC4899]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        <div>
                          <span className="font-display font-bold text-xs text-white block leading-none">
                            Série {setIdx + 1}
                          </span>
                          <span className="text-[10px] text-[#A88096] block mt-0.5">
                            {set.completed ? 'Validée' : 'En attente'}
                          </span>
                        </div>
                      </button>

                      {/* Right: Clean Steppers for Reps & Weight */}
                      <div className="flex items-center gap-2">
                        {/* Reps */}
                        <div className="flex items-center bg-white/5 rounded-xl border border-white/8 p-0.5">
                          <button
                            type="button"
                            onClick={() => updateSetValues(exIdx, setIdx, weightVal, repsVal - 1)}
                            className="w-7 h-7 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center active:scale-90"
                            aria-label="-1 rep"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs text-white px-2 tabular-nums">
                            {repsVal}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateSetValues(exIdx, setIdx, weightVal, repsVal + 1)}
                            className="w-7 h-7 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center active:scale-90"
                            aria-label="+1 rep"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Weight */}
                        <div className="flex items-center bg-white/5 rounded-xl border border-white/8 p-0.5">
                          <button
                            type="button"
                            onClick={() => updateSetValues(exIdx, setIdx, weightVal - weightStep, repsVal)}
                            className="w-7 h-7 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center active:scale-90"
                            aria-label="-charge"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs text-[#EC4899] px-2 tabular-nums">
                            {weightVal}k
                          </span>
                          <button
                            type="button"
                            onClick={() => updateSetValues(exIdx, setIdx, weightVal + weightStep, repsVal)}
                            className="w-7 h-7 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center active:scale-90"
                            aria-label="+charge"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 1-Tap Finisher (Cardio / Abdos) & Session Rating Card (Épuré) */}
      <div className="p-4 sm:p-5 rounded-[26px] bg-[#14030E] border border-white/8 space-y-3.5 text-white">
        <div className="space-y-2">
          <span className="font-compact text-[11px] font-bold text-[#C29DB2] uppercase tracking-wider block">
            Finisher (optionnel)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSelectFinisherOneTap('none')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                finisherTypeChoice === 'none'
                  ? 'bg-white text-[#180312]'
                  : 'bg-white/5 text-[#A88096] hover:text-white'
              }`}
            >
              Aucun
            </button>
            <button
              type="button"
              onClick={() => handleSelectFinisherOneTap('cardio')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
                finisherTypeChoice === 'cardio'
                  ? 'bg-[#EC4899] text-white'
                  : 'bg-white/5 text-[#A88096] hover:text-white'
              }`}
            >
              <StreamlineIcon name="runner" className="w-3.5 h-3.5 shrink-0" />
              <span>Cardio</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectFinisherOneTap('abs')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
                finisherTypeChoice === 'abs'
                  ? 'bg-[#831843] text-white'
                  : 'bg-white/5 text-[#A88096] hover:text-white'
              }`}
            >
              <StreamlineIcon name="stretch" className="w-3.5 h-3.5 shrink-0" />
              <span>Abdos</span>
            </button>
          </div>

          {finisherTypeChoice !== 'none' && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(finisherTypeChoice === 'cardio' ? CARDIO_FINISHER_PRESETS : ABDOS_FINISHER_PRESETS)
                .slice(0, 5)
                .map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFinisherChoice(preset)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                      finisherChoice === preset
                        ? 'bg-[#EC4899] text-white'
                        : 'bg-white/5 text-[#FDF2F8] hover:bg-white/10'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Ressenti & Notes */}
        <div className="pt-2 border-t border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <span className="font-display font-bold text-xs text-white block">
              Ressenti : {sessionRating}/5
            </span>
            <span className="text-[11px] text-[#A88096]">
              {sessionRating <= 2 ? 'Modéré' : sessionRating === 3 ? 'Bon engagement' : 'Intense'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSessionRating(lvl)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  sessionRating >= lvl
                    ? 'bg-[#EC4899] text-white scale-105 shadow-2xs'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                <StreamlineIcon name="heart-pulse" className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={notesInput}
          onChange={(e) => setNotesInput(e.target.value)}
          placeholder="Note rapide (optionnel)..."
          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-hidden focus:border-[#EC4899]"
        />
      </div>

      {/* Sticky Bottom Button: Terminer la séance (Épuré) */}
      <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-72 lg:right-8 z-30 max-w-xl mx-auto">
        <button
          type="button"
          onClick={handleFinishSession}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#831843] via-[#BE185D] to-[#EC4899] hover:opacity-95 text-white font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-black/40 active:scale-98 transition-all min-h-[50px]"
        >
          <Check className="w-4 h-4 stroke-[2.75]" />
          <span>Terminer la séance ({completedSets}/{totalSets})</span>
        </button>
      </div>

      {/* Warmup & Stretching BottomSheet */}
      <BottomSheet
        isOpen={showWarmupModal}
        onClose={() => setShowWarmupModal(false)}
        title={
          <span className="flex items-center gap-2">
            <StreamlineIcon name="stretch" className="w-5 h-5 text-[#EC4899]" />
            <span>Échauffement & Étirements</span>
          </span>
        }
      >
        <WarmupAndStretchingGuide category={activeWorkout.exercises[0]?.category || 'lower-body'} />
      </BottomSheet>

      {/* Spotify BottomSheet */}
      <BottomSheet
        isOpen={showSpotifyModal}
        onClose={() => setShowSpotifyModal(false)}
        title="Ma Playlist d'entraînement"
        subtitle="Accède à ta musique sans quitter ta séance"
      >
        <div className="space-y-3">
          <input
            type="url"
            value={customSpotifyUrl}
            onChange={(e) => setCustomSpotifyUrl(e.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            className="w-full px-4 py-3 text-xs rounded-2xl border border-[#FBCFE8] bg-[#FFF0F5] text-[#3B0726]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveSpotifyUrl}
              className="flex-1 py-3 rounded-full bg-[#FCE7F3] text-[#831843] font-bold text-xs min-h-[44px]"
            >
              Enregistrer le lien
            </button>
            <a
              href={customSpotifyUrl || 'https://open.spotify.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-full bg-[#831843] text-white font-bold text-xs text-center flex items-center justify-center min-h-[44px]"
            >
              Ouvrir Spotify ↗
            </a>
          </div>
        </div>
      </BottomSheet>

      {/* Cancel Confirmation BottomSheet */}
      <BottomSheet
        isOpen={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        title="Quitter la séance en cours ?"
        subtitle="Les séries non validées ne seront pas enregistrées dans ton historique."
      >
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setConfirmCancelOpen(false)}
            className="flex-1 py-3 rounded-full bg-[#FFF0F5] text-[#3B0726] font-bold text-xs min-h-[44px]"
          >
            Continuer ma séance
          </button>
          <button
            type="button"
            onClick={() => {
              cancelActiveWorkout();
              setConfirmCancelOpen(false);
              onExit();
            }}
            className="flex-1 py-3 rounded-full bg-[#831843] text-white font-bold text-xs min-h-[44px]"
          >
            Abandonner
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};
