import React, { useEffect, useRef, useState } from 'react';
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Zap,
  Timer,
  Award,
  ChevronRight,
  SkipForward,
  Sparkles,
} from 'lucide-react';
import { FinisherCategory, FinisherLog, FinisherPreset } from '../../types/fitness';
import { FINISHERS_CATALOG } from '../../data/programsAndFinishersData';
import { playFinisherBeep } from '../../utils/audio';

interface FinisherTimerModalProps {
  isOpen: boolean;
  initialPresetId?: string;
  isHotSuggestion?: boolean;
  lastExerciseName?: string;
  onClose: () => void;
  onCompleteFinisher: (log: FinisherLog, summaryText: string) => void;
  onSkipAndFinishWorkout?: () => void;
}

const FINISHER_RECORDS_STORAGE_KEY = 'glow_up_lab_finisher_records';

export const FinisherTimerModal: React.FC<FinisherTimerModalProps> = ({
  isOpen,
  initialPresetId,
  isHotSuggestion = false,
  lastExerciseName,
  onClose,
  onCompleteFinisher,
  onSkipAndFinishWorkout,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FinisherCategory>('abs');
  const [activePreset, setActivePreset] = useState<FinisherPreset | null>(() =>
    initialPresetId ? FINISHERS_CATALOG.find((f) => f.id === initialPresetId) || null : null
  );

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timer states (background-accurate using timestamps)
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Interval mode state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepElapsedSeconds, setStepElapsedSeconds] = useState(0);

  // Stopwatch / 100 Reps / Drop-Set state
  const [repCount, setRepCount] = useState(0);
  const [selectedChallengeExercise, setSelectedChallengeExercise] = useState<string>('');
  const [dropSetDoneCount, setDropSetDoneCount] = useState(0);
  const [dropSetRestRemaining, setDropSetRestRemaining] = useState<number | null>(null);

  // Personal Best storage for 100 Reps / Finishers
  const [bestRecords, setBestRecords] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(FINISHER_RECORDS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const lastTickTimestampRef = useRef<number | null>(null);
  const previousAnnouncedPhaseRef = useRef<number>(-1);
  const previousCountdownBeepRef = useRef<number>(-1);

  // Sync when modal opens or initialPresetId changes
  useEffect(() => {
    if (!isOpen) return;
    if (initialPresetId) {
      const found = FINISHERS_CATALOG.find((f) => f.id === initialPresetId) || null;
      setActivePreset(found);
      if (found) {
        setSelectedCategory(found.category);
        setSelectedChallengeExercise(
          found.selectableExercises?.[0] || lastExerciseName || 'Squats poids du corps'
        );
      }
    } else {
      setActivePreset(null);
    }
    resetExecutionState();
  }, [isOpen, initialPresetId, lastExerciseName]);

  const resetExecutionState = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setElapsedSeconds(0);
    setCurrentStepIndex(0);
    setStepElapsedSeconds(0);
    setRepCount(0);
    setDropSetDoneCount(0);
    setDropSetRestRemaining(null);
    lastTickTimestampRef.current = null;
    previousAnnouncedPhaseRef.current = -1;
    previousCountdownBeepRef.current = -1;
  };

  const selectPresetToRun = (preset: FinisherPreset) => {
    setActivePreset(preset);
    setSelectedChallengeExercise(
      preset.selectableExercises?.[0] || lastExerciseName || 'Glute Bridges au sol'
    );
    resetExecutionState();
  };

  // Main background-safe timer loop using Date.now() delta
  useEffect(() => {
    if (!isOpen || !isRunning || !activePreset || isCompleted) {
      lastTickTimestampRef.current = null;
      return;
    }

    lastTickTimestampRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const last = lastTickTimestampRef.current || now;
      const deltaSec = Math.floor((now - last) / 1000);
      if (deltaSec < 1) return;

      lastTickTimestampRef.current = last + deltaSec * 1000;

      // Handle Drop-Set 60s rest timer if active
      if (dropSetRestRemaining !== null && dropSetRestRemaining > 0) {
        const nextRest = Math.max(0, dropSetRestRemaining - deltaSec);
        setDropSetRestRemaining(nextRest === 0 ? null : nextRest);
        if (nextRest === 0 && soundEnabled) {
          playFinisherBeep('effort');
        }
      }

      if (activePreset.executionMode === 'interval' && activePreset.intervals) {
        const steps = activePreset.intervals;
        const currentStep = steps[currentStepIndex];
        if (!currentStep) return;

        const nextStepElapsed = stepElapsedSeconds + deltaSec;
        const nextTotalElapsed = elapsedSeconds + deltaSec;
        setElapsedSeconds(nextTotalElapsed);

        const remainingInStep = currentStep.durationSeconds - nextStepElapsed;
        if (
          remainingInStep > 0 &&
          remainingInStep <= 3 &&
          previousCountdownBeepRef.current !== remainingInStep
        ) {
          previousCountdownBeepRef.current = remainingInStep;
          if (soundEnabled) playFinisherBeep('countdown');
        }

        if (nextStepElapsed >= currentStep.durationSeconds) {
          // Advance to next interval step
          const nextIdx = currentStepIndex + 1;
          previousCountdownBeepRef.current = -1;
          if (nextIdx >= steps.length) {
            setIsRunning(false);
            setIsCompleted(true);
            if (soundEnabled) playFinisherBeep('complete');
          } else {
            setCurrentStepIndex(nextIdx);
            setStepElapsedSeconds(0);
            const upcoming = steps[nextIdx];
            if (soundEnabled) {
              playFinisherBeep(upcoming.type === 'effort' ? 'effort' : 'rest');
            }
          }
        } else {
          setStepElapsedSeconds(nextStepElapsed);
        }
      } else if (activePreset.executionMode === 'countdown') {
        const nextElapsed = elapsedSeconds + deltaSec;
        const remaining = activePreset.totalDurationSeconds - nextElapsed;

        // Check phase alerts (e.g. Plank side changes at 60s and 120s)
        if (activePreset.phaseAlerts) {
          for (const alert of activePreset.phaseAlerts) {
            if (
              alert.atElapsedSeconds > 0 &&
              nextElapsed >= alert.atElapsedSeconds &&
              previousAnnouncedPhaseRef.current < alert.atElapsedSeconds
            ) {
              previousAnnouncedPhaseRef.current = alert.atElapsedSeconds;
              if (soundEnabled) playFinisherBeep('transition');
            }
          }
        }

        if (remaining > 0 && remaining <= 3 && previousCountdownBeepRef.current !== remaining) {
          previousCountdownBeepRef.current = remaining;
          if (soundEnabled) playFinisherBeep('countdown');
        }

        if (nextElapsed >= activePreset.totalDurationSeconds) {
          setElapsedSeconds(activePreset.totalDurationSeconds);
          setIsRunning(false);
          setIsCompleted(true);
          if (soundEnabled) playFinisherBeep('complete');
        } else {
          setElapsedSeconds(nextElapsed);
        }
      } else {
        // Stopwatch mode (100 Reps / Drop-Set)
        setElapsedSeconds((prev) => prev + deltaSec);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [
    isOpen,
    isRunning,
    isCompleted,
    activePreset,
    currentStepIndex,
    stepElapsedSeconds,
    elapsedSeconds,
    soundEnabled,
    dropSetRestRemaining,
  ]);

  if (!isOpen) return null;

  const formatMMSS = (sec: number) => {
    const clamped = Math.max(0, Math.round(sec));
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggleStartPause = () => {
    if (!activePreset) return;
    if (!isRunning && elapsedSeconds === 0 && soundEnabled) {
      playFinisherBeep('effort');
    }
    setIsRunning((prev) => !prev);
  };

  const handleAddReps = (delta: number) => {
    if (!activePreset) return;
    if (!isRunning && !isCompleted) {
      setIsRunning(true);
    }
    const target = activePreset.targetReps || 100;
    const next = Math.min(target, repCount + delta);
    setRepCount(next);
    if (next >= target) {
      setIsRunning(false);
      setIsCompleted(true);
      if (soundEnabled) playFinisherBeep('complete');
    } else if (soundEnabled) {
      playFinisherBeep('countdown');
    }
  };

  const handleValidateDropSetSeries = () => {
    if (!activePreset) return;
    if (!isRunning && elapsedSeconds === 0) {
      setIsRunning(true);
    }
    const nextCount = dropSetDoneCount + 1;
    setDropSetDoneCount(nextCount);
    if (nextCount === 1) {
      setDropSetRestRemaining(activePreset.restBetweenSetsSeconds || 60);
      if (soundEnabled) playFinisherBeep('rest');
    } else if (nextCount >= (activePreset.targetSets || 2)) {
      setDropSetRestRemaining(null);
      setIsRunning(false);
      setIsCompleted(true);
      if (soundEnabled) playFinisherBeep('complete');
    }
  };

  const handleFinishAndRecord = () => {
    if (!activePreset) return;
    const finalDuration = Math.max(1, elapsedSeconds || activePreset.totalDurationSeconds);
    const prevBest = bestRecords[activePreset.id];
    const isNewRecord =
      activePreset.executionMode === 'stopwatch' && (!prevBest || finalDuration < prevBest);

    if (isNewRecord) {
      const updatedRecords = { ...bestRecords, [activePreset.id]: finalDuration };
      setBestRecords(updatedRecords);
      try {
        localStorage.setItem(FINISHER_RECORDS_STORAGE_KEY, JSON.stringify(updatedRecords));
      } catch {
        // ignore
      }
    }

    const log: FinisherLog = {
      presetId: activePreset.id,
      name: activePreset.name,
      category: activePreset.category,
      executionMode: activePreset.executionMode,
      completedAt: new Date().toISOString(),
      durationSeconds: finalDuration,
      repsCompleted: activePreset.targetReps ? Math.max(repCount, activePreset.targetReps) : undefined,
      selectedExercise: activePreset.selectableExercises ? selectedChallengeExercise : lastExerciseName,
      isNewRecord,
    };

    const summaryDetails =
      activePreset.id === 'finisher-challenge-100-reps'
        ? `${activePreset.name} (${selectedChallengeExercise} — ${formatMMSS(finalDuration)})`
        : `${activePreset.name} (${formatMMSS(finalDuration)} validé)`;

    onCompleteFinisher(log, summaryDetails);
  };

  const filteredPresets = FINISHERS_CATALOG.filter((f) => f.category === selectedCategory);

  // Determine current phase / interval visuals
  const currentIntervalStep =
    activePreset?.executionMode === 'interval' && activePreset.intervals
      ? activePreset.intervals[currentStepIndex]
      : null;

  const nextIntervalStep =
    activePreset?.executionMode === 'interval' && activePreset.intervals
      ? activePreset.intervals[currentStepIndex + 1]
      : null;

  const currentPhaseAlert =
    activePreset?.executionMode === 'countdown' && activePreset.phaseAlerts
      ? [...activePreset.phaseAlerts]
          .reverse()
          .find((a) => elapsedSeconds >= a.atElapsedSeconds) || activePreset.phaseAlerts[0]
      : null;

  const isEffortPhase =
    activePreset?.executionMode === 'interval'
      ? currentIntervalStep?.type === 'effort'
      : dropSetRestRemaining !== null
      ? false
      : true;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-[#12030D]/90 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#1F0718] border border-pink-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-white max-h-[92vh] flex flex-col">
        {/* Top Bar */}
        <div className="px-5 py-4 border-b border-pink-500/20 flex items-center justify-between bg-gradient-to-r from-[#2D0A22] to-[#1F0718]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 block">
                {isHotSuggestion && !activePreset ? 'Suggestion Dynamique à Chaud' : 'Module Finisher Interactif'}
              </span>
              <h3 className="text-base font-extrabold text-white leading-tight">
                {activePreset ? activePreset.name : 'Dernière ligne droite !'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activePreset && (
              <button
                type="button"
                onClick={() => setSoundEnabled((s) => !s)}
                className={`p-2 rounded-xl border transition-colors ${
                  soundEnabled
                    ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                    : 'bg-white/5 border-white/10 text-pink-200/40'
                }`}
                title={soundEnabled ? 'Bips sonores activés (compatible Spotify)' : 'Son coupé'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-pink-200/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: CATALOG PICKER / HOT SUGGESTION */}
          {!activePreset ? (
            <>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-600/25 via-rose-500/15 to-amber-500/10 border border-pink-500/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-extrabold text-white">
                      Séance presque terminée ! Envie de tout donner sur 5 minutes ? Choisis ton Finisher
                    </p>
                    <p className="text-xs text-pink-200/80 mt-1">
                      Un bloc haute intensité de 3 à 8 minutes avec chronomètre intelligent et signaux sonores compatibles avec votre musique Spotify.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Category Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'abs', label: 'Abdos & Gainage' },
                    { id: 'cardio', label: 'Cardio & Brûle-graisse' },
                    { id: 'pump', label: 'Pump & Congestion' },
                  ] as { id: FinisherCategory; label: string }[]
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all text-center ${
                      selectedCategory === cat.id
                        ? 'bg-pink-600 border-pink-400 text-white shadow-lg shadow-pink-600/25'
                        : 'bg-white/5 border-white/10 text-pink-200/70 hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Presets list */}
              <div className="space-y-3">
                {filteredPresets.map((preset) => {
                  const recordSec = bestRecords[preset.id];
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => selectPresetToRun(preset)}
                      className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-pink-500/15 border border-pink-500/20 hover:border-pink-400/50 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-extrabold text-white group-hover:text-pink-300 transition-colors">
                              {preset.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                              {preset.durationLabel}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-pink-100/80">
                              {preset.executionMode === 'interval'
                                ? 'Chrono Intervalle'
                                : preset.executionMode === 'countdown'
                                ? 'Compte à rebours'
                                : 'Chrono + Compteur'}
                            </span>
                          </div>
                          <p className="text-xs text-pink-200/75 leading-relaxed">{preset.summary}</p>
                          {recordSec && (
                            <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1 pt-1">
                              <Award className="w-3.5 h-3.5" /> Record perso : {formatMMSS(recordSec)}
                            </p>
                          )}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-pink-500/20 group-hover:bg-pink-500 text-pink-300 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action to skip and finish workout immediately */}
              {onSkipAndFinishWorkout && (
                <button
                  type="button"
                  onClick={onSkipAndFinishWorkout}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-pink-200/80 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  Passer et terminer la séance
                </button>
              )}
            </>
          ) : (
            /* STEP 2: ACTIVE FINISHER EXECUTION INTERFACE */
            <div className="space-y-4">
              {/* Switch finisher link */}
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    resetExecutionState();
                    setActivePreset(null);
                  }}
                  className="text-pink-300 hover:text-white font-bold underline underline-offset-4"
                >
                  ← Changer de Finisher
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-pink-200/80 font-semibold">
                  {activePreset.categoryLabel} · {activePreset.durationLabel}
                </span>
              </div>

              {/* MAIN VISUAL CHRONO PANEL */}
              <div
                className={`rounded-3xl p-6 border-2 transition-all duration-300 text-center relative overflow-hidden ${
                  isCompleted
                    ? 'bg-gradient-to-br from-emerald-600/30 to-teal-900/40 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : isRunning
                    ? isEffortPhase
                      ? 'bg-gradient-to-br from-emerald-600/25 via-emerald-900/30 to-[#1F0718] border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-gradient-to-br from-amber-500/25 via-amber-900/30 to-[#1F0718] border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-gradient-to-br from-pink-600/15 to-[#160410] border-pink-500/30'
                }`}
              >
                {/* Status Badge (Vert = Effort, Orange = Repos) */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 border border-white/20 bg-black/30">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-400'
                        : isRunning
                        ? isEffortPhase
                          ? 'bg-emerald-400 animate-ping'
                          : 'bg-amber-400 animate-pulse'
                        : 'bg-pink-400'
                    }`}
                  />
                  {isCompleted
                    ? 'FINISHER VALIDÉ !'
                    : activePreset.executionMode === 'interval' && currentIntervalStep
                    ? currentIntervalStep.type === 'effort'
                      ? 'EFFORT INTENSE (GO !)'
                      : 'RÉCUPÉRATION ACTIVE (REPOS)'
                    : dropSetRestRemaining !== null
                    ? 'REPOS ENTRE LES 2 SÉRIES (60S)'
                    : activePreset.executionMode === 'countdown'
                    ? 'MAINTIEN CONTINU SANS PAUSE'
                    : 'CHRONO TIME CAP EN COURS'}
                </div>

                {/* Current Step / Phase Title */}
                <h4 className="text-base sm:text-lg font-extrabold text-white mb-1">
                  {activePreset.executionMode === 'interval' && currentIntervalStep
                    ? currentIntervalStep.label
                    : activePreset.executionMode === 'countdown' && currentPhaseAlert
                    ? currentPhaseAlert.label
                    : activePreset.id === 'finisher-challenge-100-reps'
                    ? `Objectif : ${repCount} / ${activePreset.targetReps || 100} répétitions`
                    : `Drop-Set sur ${lastExerciseName || 'votre dernier exercice'}`}
                </h4>

                {/* Dynamic Coach Cue */}
                <p className="text-xs text-pink-100/85 max-w-md mx-auto mb-4 min-h-[2rem]">
                  {activePreset.executionMode === 'interval' && currentIntervalStep
                    ? currentIntervalStep.cue
                    : activePreset.executionMode === 'countdown' && currentPhaseAlert
                    ? currentPhaseAlert.cue
                    : activePreset.summary}
                </p>

                {/* Giant Digits */}
                <div className="font-mono text-6xl sm:text-7xl font-black tracking-tight text-white my-2 select-none">
                  {activePreset.executionMode === 'interval' && currentIntervalStep
                    ? formatMMSS(currentIntervalStep.durationSeconds - stepElapsedSeconds)
                    : activePreset.executionMode === 'countdown'
                    ? formatMMSS(activePreset.totalDurationSeconds - elapsedSeconds)
                    : dropSetRestRemaining !== null
                    ? formatMMSS(dropSetRestRemaining)
                    : formatMMSS(elapsedSeconds)}
                </div>

                {/* Progress Bar for Interval or Countdown */}
                {activePreset.executionMode !== 'stopwatch' && (
                  <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden mt-4 border border-white/10">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isEffortPhase ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((elapsedSeconds / Math.max(1, activePreset.totalDurationSeconds)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                )}

                {/* Next interval preview */}
                {activePreset.executionMode === 'interval' && nextIntervalStep && !isCompleted && (
                  <div className="mt-3 text-[11px] font-bold text-pink-200/80 flex items-center justify-center gap-1.5">
                    <span>Suivant :</span>
                    <span
                      className={
                        nextIntervalStep.type === 'effort' ? 'text-emerald-300' : 'text-amber-300'
                      }
                    >
                      {nextIntervalStep.label} ({nextIntervalStep.durationSeconds}s)
                    </span>
                  </div>
                )}

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-3 mt-5">
                  <button
                    type="button"
                    onClick={handleToggleStartPause}
                    className={`px-6 py-3 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition-all shadow-lg ${
                      isRunning
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />{' '}
                        {elapsedSeconds > 0 ? 'Reprendre' : 'Lancer le Chrono'}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetExecutionState}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-pink-200 transition-colors"
                    title="Réinitialiser"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* MODE COMPTEUR / TIME CAP SPECIFIC CONTROLS */}
              {activePreset.id === 'finisher-challenge-100-reps' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                      Exercice choisi pour les 100 reps
                    </label>
                    {bestRecords[activePreset.id] && (
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Record : {formatMMSS(bestRecords[activePreset.id])}
                      </span>
                    )}
                  </div>
                  <select
                    value={selectedChallengeExercise}
                    onChange={(e) => setSelectedChallengeExercise(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12030D] border border-pink-500/30 text-sm font-bold text-white focus:outline-none focus:border-pink-400"
                  >
                    {(activePreset.selectableExercises || []).map((exName) => (
                      <option key={exName} value={exName}>
                        {exName}
                      </option>
                    ))}
                  </select>

                  {/* Progress bar to 100 reps */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-extrabold">
                      <span className="text-pink-200">Progression du Challenge</span>
                      <span className="text-emerald-400">{repCount} / 100 reps</span>
                    </div>
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-emerald-400 transition-all duration-200"
                        style={{ width: `${Math.min(100, repCount)}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Rep Adder Buttons */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[5, 10, 20, 25].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => handleAddReps(inc)}
                        className="py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/35 border border-pink-500/40 text-xs font-extrabold text-pink-200 transition-all active:scale-95"
                      >
                        +{inc} reps
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePreset.id === 'finisher-drop-set-mecanique' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                      Suivi des 2 Séries à l’échec (-30% de charge)
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {dropSetDoneCount} / 2 séries validées
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleValidateDropSetSeries}
                    disabled={dropSetDoneCount >= 2}
                    className="w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-50 border border-emerald-400/40 text-emerald-200 text-xs font-extrabold flex items-center justify-center gap-2 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    {dropSetDoneCount === 0
                      ? 'Série 1 à l’échec terminée → Lancer les 60s de repos'
                      : dropSetDoneCount === 1
                      ? 'Valider la Série 2 à l’échec total'
                      : 'Les 2 séries Drop-Set sont complétées !'}
                  </button>
                </div>
              )}

              {/* Instructions Checklist */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5" /> Protocole d’exécution
                </p>
                <ul className="space-y-1.5">
                  {activePreset.instructions.map((inst, i) => (
                    <li key={i} className="text-xs text-pink-100/80 flex items-start gap-2">
                      <span className="text-pink-400 font-bold">•</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Primary Complete Button ("Terminé") */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleFinishAndRecord}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Terminé — Valider ce Finisher ({formatMMSS(elapsedSeconds || activePreset.totalDurationSeconds)})
                </button>

                {onSkipAndFinishWorkout && (
                  <button
                    type="button"
                    onClick={onSkipAndFinishWorkout}
                    className="py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-pink-200/80 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                    Passer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
