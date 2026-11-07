import React, { useState } from 'react';
import { RefreshCw, Play, Save, Flame, Sparkles, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Exercise, WorkoutExerciseItem } from '../../types/fitness';
import { useWorkout } from '../../context/WorkoutContext';
import { CARDIO_CIRCUITS, ABDOS_CIRCUITS, WARMUP_COOLDOWN_GUIDES } from '../../data/exercisesData';
import { StreamlineIcon, StreamlineIconName } from '../ui/StreamlineIcon';
import { BottomSheet } from '../ui/BottomSheet';
import { PersonalGearReminder } from '../common/PersonalGearReminder';
import { buildStructuredLegWorkout, LEG_DAY_PHASES } from '../../utils/legDayPhases';

interface WorkoutGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchWorkout: (workout: { name: string; exercises: WorkoutExerciseItem[]; finisher?: string; notes?: string }) => void;
  onSaveAsRoutine: (routine: { name: string; targetZone: string; exercises: WorkoutExerciseItem[]; finisher?: string; notes?: string }) => void;
}

type GeneratorZoneId =
  | 'glutes'
  | 'lower'
  | 'back_sculpt_order'
  | 'dos_pecs'
  | 'pecs_bras'
  | 'pecs'
  | 'posterior'
  | 'quads_adductors'
  | 'back'
  | 'arms'
  | 'fullbody'
  | 'abs'
  | 'cardio';

export const WorkoutGeneratorModal: React.FC<WorkoutGeneratorModalProps> = ({
  isOpen,
  onClose,
  onLaunchWorkout,
  onSaveAsRoutine,
}) => {
  const { allExercises, favorites, getPreviousPerformance } = useWorkout();

  const [selectedZone, setSelectedZone] = useState<GeneratorZoneId>('back_sculpt_order');
  const [selectedCardioIndex, setSelectedCardioIndex] = useState(0);
  const [selectedAbdoIndex, setSelectedAbdoIndex] = useState(0);

  const [generatedExercises, setGeneratedExercises] = useState<WorkoutExerciseItem[]>([]);
  const [finisher, setFinisher] = useState<string>('');
  const [generatedName, setGeneratedName] = useState<string>('');
  const [showWarmupGuide, setShowWarmupGuide] = useState(false);
  const [step, setStep] = useState<'pick_goal' | 'review'>('pick_goal');

  if (!isOpen) return null;

  const zones: { id: GeneratorZoneId; label: string; desc: string; icon: StreamlineIconName }[] = [
    {
      id: 'back_sculpt_order',
      label: 'Dos Dessiné sans l’Élargir (Ordre 1-2-3-4)',
      desc: '1. Milieu du dos · 2. Grand dorsal · 3. Arrière d’épaule · 4. Lombaires (Back Extension)',
      icon: 'dumbbell',
    },
    {
      id: 'dos_pecs',
      label: 'Séance Dos / Pecs (Upper Body Antagoniste)',
      desc: 'Combo haut du corps : 2 exos Dos + 2 exos Pecs pour une posture sculptée',
      icon: 'dumbbell',
    },
    {
      id: 'pecs_bras',
      label: 'Séance Pecs / Bras (Buste Tonique & Bras Fermes)',
      desc: 'Combo Push & Galbe : 2 exos Pecs + 2 exos Bras & Épaules',
      icon: 'biceps',
    },
    {
      id: 'pecs',
      label: 'Focus Pecs & Maintien du Buste',
      desc: 'Développé incliné, Chest Press, Pec-Deck Butterfly & Poulie vis-à-vis',
      icon: 'dumbbell',
    },
    {
      id: 'glutes',
      label: 'Fessiers uniquement (Booty Focus)',
      desc: 'Hip thrust, kickback poulie, abduction & fentes bulgares',
      icon: 'kettlebell',
    },
    {
      id: 'lower',
      label: 'Bas du corps complet (Ordre 1-2-3-4)',
      desc: 'Polyarticulaire lourd, unilatéral, ischios/quads & isolation fessiers',
      icon: 'kettlebell',
    },
    {
      id: 'abs',
      label: 'Circuits Abdos & Gainage (8 circuits)',
      desc: 'Debout avec charge, Planche lestée 60s, Over-Unders, 360°, Vacuum...',
      icon: 'stretch',
    },
    {
      id: 'cardio',
      label: 'Circuits Cardio Guidés (11 séances)',
      desc: 'Marche inclinée 12-5-30, StairMaster, Rameur, Elliptique, HIIT...',
      icon: 'runner',
    },
    {
      id: 'posterior',
      label: 'Chaîne postérieure (Fessiers & Ischios)',
      desc: 'RDL haltères, hip thrust, leg curl assis & banc lombaires',
      icon: 'kettlebell',
    },
    {
      id: 'quads_adductors',
      label: 'Quads Sculpt & Adducteurs Fermes',
      desc: 'Presse à cuisses, machine adducteurs, leg extension & squat sumo',
      icon: 'kettlebell',
    },
    {
      id: 'arms',
      label: 'Épaules Galbées & Bras Toniques',
      desc: 'Élévations latérales, développé militaire, triceps corde & curl incliné',
      icon: 'biceps',
    },
    {
      id: 'fullbody',
      label: 'Full Body Glow & Tonique',
      desc: 'Séance complète 4 mouvements polyarticulaires majeurs',
      icon: 'weightlifter',
    },
  ];

  const pickOne = (pool: Exercise[], fallback: Exercise): Exercise => {
    if (pool.length === 0) return fallback;
    const sorted = [...pool].sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return Math.random() < 0.7 ? -1 : 1;
      if (!aFav && bFav) return Math.random() < 0.7 ? 1 : -1;
      return 0.5 - Math.random();
    });
    return sorted[0];
  };

  const generateWorkout = (zoneId: GeneratorZoneId) => {
    if (zoneId === 'abs') {
      const circuit = ABDOS_CIRCUITS[selectedAbdoIndex] || ABDOS_CIRCUITS[0];
      const abdoItems: WorkoutExerciseItem[] = circuit.exercises.map((ex, idx) => {
        const parsedReps = parseInt(ex.reps.replace(/[^0-9]/g, ''), 10) || 12;
        return {
          id: `gen_abdo_${Date.now()}_${idx}`,
          exerciseId: `circuit_${circuit.id}_${idx}`,
          exerciseName: `${ex.name} (${ex.reps})`,
          category: 'abs',
          equipment: 'bodyweight',
          restSeconds: 25,
          sets: [
            { id: `gen_s1_${idx}`, setNumber: 1, targetReps: parsedReps, targetWeight: 0, completed: false },
            { id: `gen_s2_${idx}`, setNumber: 2, targetReps: parsedReps, targetWeight: 0, completed: false },
            { id: `gen_s3_${idx}`, setNumber: 3, targetReps: parsedReps, targetWeight: 0, completed: false },
          ],
        };
      });
      setGeneratedExercises(abdoItems);
      setFinisher('Planche active statique finale (60 sec)');
      setGeneratedName(circuit.name.replace(/^\d+\.\s*/, ''));
      setStep('review');
      return;
    }

    if (zoneId === 'cardio') {
      const circuit = CARDIO_CIRCUITS[selectedCardioIndex] || CARDIO_CIRCUITS[0];
      const cardioItems: WorkoutExerciseItem[] = circuit.intervals.map((interval, idx) => ({
        id: `gen_cardio_${Date.now()}_${idx}`,
        exerciseId: `circuit_${circuit.id}_${idx}`,
        exerciseName: `${interval.time} · ${interval.instruction}`,
        category: 'cardio',
        equipment: 'cardio_machine',
        restSeconds: 0,
        sets: [
          {
            id: `gen_cs1_${idx}`,
            setNumber: 1,
            targetReps: circuit.durationMinutes,
            targetWeight: 0,
            completed: false,
          },
        ],
      }));
      setGeneratedExercises(cardioItems);
      setFinisher('5 min de marche retour au calme & hydratation');
      setGeneratedName(`${circuit.name.replace(/^\d+\.\s*/, '')} (${circuit.machine})`);
      setStep('review');
      return;
    }

    const isLower =
      zoneId === 'glutes' ||
      zoneId === 'lower' ||
      zoneId === 'posterior' ||
      zoneId === 'quads_adductors';

    let workoutName = '';
    let defaultFinisher = '';
    let selectedWithMeta: { exercise: Exercise; phaseTag?: string }[] = [];

    if (isLower) {
      if (zoneId === 'glutes') {
        workoutName = 'Glow Glutes Focus (Fessiers)';
        defaultFinisher = 'Abduction machine en drop-set (3 x 20 reps)';
      } else if (zoneId === 'lower') {
        workoutName = 'Bas du Corps Complet (Jambes Fermes)';
        defaultFinisher = 'Leg Extension tempo brûlure (2 x 15 reps)';
      } else if (zoneId === 'posterior') {
        workoutName = 'Chaîne Postérieure (Fessiers & Ischios)';
        defaultFinisher = 'Back Extension au banc 45° (3 x 15 reps)';
      } else if (zoneId === 'quads_adductors') {
        workoutName = 'Quads Sculpt & Adducteurs Fermes';
        defaultFinisher = 'Goblet Squat tempo lent (2 x 15 reps)';
      }

      const structuredItems = buildStructuredLegWorkout(allExercises, favorites, zoneId);
      selectedWithMeta = structuredItems.map((item) => {
        const meta = LEG_DAY_PHASES.find((p) => p.id === item.phase);
        return {
          exercise: item.exercise,
          phaseTag: meta ? `Phase ${meta.id} · ${meta.name}` : undefined,
        };
      });
    } else if (zoneId === 'back_sculpt_order' || zoneId === 'back') {
      // Exact 1-2-3-4 order from Blandine's screenshots
      workoutName = 'Dos Dessiné sans l’Élargir (Ordre 1-2-3-4)';
      defaultFinisher = 'Gainage Stomach Vacuum (4 x 20s) + Marche inclinée 10 min';

      const milieuPool = allExercises.filter((e) => e.specificMuscle === 'milieu-dos');
      const dorsalPool = allExercises.filter((e) => e.specificMuscle === 'grand-dorsal');
      const rearDeltPool = allExercises.filter(
        (e) => e.specificMuscle === 'trapezes-arriere-epaule' || e.specificMuscle === 'epaule-arriere'
      );
      const backExt =
        allExercises.find((e) => e.id === 'hyperextensions-bench') ||
        allExercises.find((e) => e.specificMuscle === 'lombaires') ||
        allExercises[0];

      const step1A = pickOne(milieuPool, allExercises[0]);
      const step1B = pickOne(
        milieuPool.filter((e) => e.id !== step1A.id),
        step1A
      );
      const step2 = pickOne(dorsalPool, allExercises[0]);
      const step3 = pickOne(rearDeltPool, allExercises[0]);

      selectedWithMeta = [
        { exercise: step1A, phaseTag: '1. Milieu du dos (1/2)' },
        ...(step1B.id !== step1A.id
          ? [{ exercise: step1B, phaseTag: '1. Milieu du dos (2/2)' }]
          : []),
        { exercise: step2, phaseTag: '2. Grand dorsal (1 exo)' },
        { exercise: step3, phaseTag: '3. Arrière d’épaule (1 exo)' },
        { exercise: backExt, phaseTag: '4. Lombaires · Back Extension' },
      ];
    } else if (zoneId === 'dos_pecs') {
      workoutName = 'Séance Dos / Pecs (Upper Body Dessiné & Galbe)';
      defaultFinisher = 'Face Pulls corde (3 x 15) + Planche active 60s';

      const pecsPool = allExercises.filter((e) => e.category === 'pecs');
      const backMilieu = allExercises.filter((e) => e.specificMuscle === 'milieu-dos');
      const backDorsal = allExercises.filter((e) => e.specificMuscle === 'grand-dorsal');

      const pec1 = pickOne(
        pecsPool.filter((e) => e.specificMuscle !== 'pecs-isolation'),
        pecsPool[0] || allExercises[0]
      );
      const back1 = pickOne(backMilieu, allExercises[0]);
      const pec2 = pickOne(
        pecsPool.filter((e) => e.id !== pec1.id),
        pecsPool[0] || allExercises[0]
      );
      const back2 = pickOne(backDorsal, allExercises[0]);

      selectedWithMeta = [
        { exercise: back1, phaseTag: 'Dos · Milieu du dos' },
        { exercise: pec1, phaseTag: 'Pecs · Haut & Galbe' },
        { exercise: back2, phaseTag: 'Dos · Grand dorsal' },
        { exercise: pec2, phaseTag: 'Pecs · Isolation & Dessin' },
      ];
    } else if (zoneId === 'pecs_bras') {
      workoutName = 'Séance Pecs / Bras (Buste Tonique & Bras Fermes)';
      defaultFinisher = 'Extensions triceps corde en drop-set (2 x 15 reps)';

      const pecsPool = allExercises.filter((e) => e.category === 'pecs');
      const tricepsPool = allExercises.filter((e) => e.specificMuscle === 'triceps');
      const bicepsOrDeltPool = allExercises.filter(
        (e) => e.specificMuscle === 'biceps' || e.specificMuscle === 'epaule-cote'
      );

      const pec1 = pickOne(
        pecsPool.filter((e) => e.specificMuscle === 'pecs-haut'),
        pecsPool[0] || allExercises[0]
      );
      const pec2 = pickOne(
        pecsPool.filter((e) => e.id !== pec1.id),
        pecsPool[1] || pec1
      );
      const arm1 = pickOne(tricepsPool, allExercises[0]);
      const arm2 = pickOne(bicepsOrDeltPool, allExercises[0]);

      selectedWithMeta = [
        { exercise: pec1, phaseTag: 'Pecs · Polyarticulaire' },
        { exercise: pec2, phaseTag: 'Pecs · Isolation Buste' },
        { exercise: arm1, phaseTag: 'Bras · Triceps Fermeté' },
        { exercise: arm2, phaseTag: 'Bras · Biceps / Épaules' },
      ];
    } else if (zoneId === 'pecs') {
      workoutName = 'Focus Pecs & Maintien du Buste';
      defaultFinisher = 'Pompes inclinées sur banc au poids du corps (2 x max)';
      const pecsPool = allExercises.filter((e) => e.category === 'pecs');
      selectedWithMeta = pecsPool.slice(0, 4).map((ex) => ({
        exercise: ex,
        phaseTag: ex.primaryMuscle,
      }));
    } else {
      let pool: Exercise[] = [];

      if (zoneId === 'arms') {
        workoutName = 'Épaules Galbées & Bras Toniques';
        defaultFinisher = 'Extensions triceps à la corde (3 x 15 reps)';
        pool = allExercises.filter((ex) => ex.category === 'arms');
      } else if (zoneId === 'fullbody') {
        workoutName = 'Full Body Glow & Tonification Totale';
        defaultFinisher = '60 secondes de planche active ou 10 min de marche en côte';
        const fessier = allExercises.find((e) => e.specificMuscle === 'fessiers') || allExercises[0];
        const dos = allExercises.find((e) => e.specificMuscle === 'milieu-dos') || allExercises[1];
        const pec = allExercises.find((e) => e.category === 'pecs') || allExercises[2];
        const core = allExercises.find((e) => e.specificMuscle === 'abdos') || allExercises[3];
        pool = [fessier, dos, pec, core].filter(Boolean) as Exercise[];
      }

      const sorted = [...pool].sort((a, b) => {
        const aFav = favorites.includes(a.id);
        const bFav = favorites.includes(b.id);
        if (aFav && !bFav) return Math.random() < 0.67 ? -1 : 1;
        if (!aFav && bFav) return Math.random() < 0.67 ? 1 : -1;
        return 0.5 - Math.random();
      });

      selectedWithMeta = sorted.slice(0, 4).map((ex) => ({ exercise: ex }));
    }

    const exerciseItems: WorkoutExerciseItem[] = selectedWithMeta.map((item, idx) => {
      const ex = item.exercise;
      const prev = getPreviousPerformance(ex.id);
      const targetWeight = prev
        ? prev.weight
        : ex.equipment === 'dumbbell'
        ? 8
        : ex.equipment === 'barbell'
        ? 25
        : ex.equipment === 'bodyweight'
        ? 0
        : 20;
      const setsCount = ex.defaultSets || 3;

      const sets = Array.from({ length: setsCount }, (_, sIdx) => ({
        id: `gen_set_${Date.now()}_${idx}_${sIdx}`,
        setNumber: sIdx + 1,
        targetReps: parseInt(ex.defaultReps, 10) || 12,
        targetWeight,
        completed: false,
      }));

      return {
        id: `gen_item_${Date.now()}_${idx}`,
        exerciseId: ex.id,
        exerciseName: ex.name,
        category: ex.category,
        equipment: ex.equipment,
        restSeconds: ex.defaultRestSeconds || 75,
        sets,
        notes: item.phaseTag,
      };
    });

    setGeneratedExercises(exerciseItems);
    setFinisher(defaultFinisher);
    setGeneratedName(workoutName);
    setStep('review');
  };

  const currentWarmupGuide =
    selectedZone === 'glutes' ||
    selectedZone === 'lower' ||
    selectedZone === 'posterior' ||
    selectedZone === 'quads_adductors'
      ? WARMUP_COOLDOWN_GUIDES['lower-body']
      : selectedZone === 'back' ||
        selectedZone === 'back_sculpt_order' ||
        selectedZone === 'dos_pecs'
      ? WARMUP_COOLDOWN_GUIDES['back']
      : selectedZone === 'pecs' || selectedZone === 'pecs_bras'
      ? WARMUP_COOLDOWN_GUIDES['pecs']
      : selectedZone === 'arms'
      ? WARMUP_COOLDOWN_GUIDES['arms']
      : selectedZone === 'abs'
      ? WARMUP_COOLDOWN_GUIDES['abs']
      : WARMUP_COOLDOWN_GUIDES['cardio'];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'pick_goal' ? 'Séances Proposées & Circuits' : 'Ta séance proposée'}
      subtitle={
        step === 'pick_goal'
          ? 'Choisis ta séance (Dos 1-2-3-4, Dos/Pecs, Pecs/Bras, Bas du corps...)'
          : 'Vérifie les exercices avant de démarrer'
      }
      footer={
        <div className="flex items-center gap-2">
          {step === 'pick_goal' ? (
            <button
              onClick={() => generateWorkout(selectedZone)}
              className="w-full py-3.5 px-4 rounded-full bg-[#831843] hover:bg-[#3B0726] text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all min-h-[48px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Proposer cette séance</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setStep('pick_goal')}
                className="py-3.5 px-4 rounded-full bg-[#F6EDF2] text-[#2B091C] font-bold text-xs transition-colors min-h-[48px]"
              >
                Retour
              </button>

              <button
                onClick={() => {
                  onSaveAsRoutine({
                    name: generatedName,
                    targetZone: selectedZone,
                    exercises: generatedExercises,
                    finisher,
                    notes: 'Séance personnalisée générée par Glow Up Lab',
                  });
                  onClose();
                }}
                className="py-3.5 px-4 rounded-full bg-[#FCE7F3] text-[#831843] font-bold text-xs flex items-center gap-1.5 transition-colors min-h-[48px]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Sauvegarder</span>
              </button>

              <button
                onClick={() => {
                  onLaunchWorkout({
                    name: generatedName,
                    exercises: generatedExercises,
                    finisher,
                  });
                  onClose();
                }}
                className="flex-1 py-3.5 px-4 rounded-full bg-[#831843] text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all min-h-[48px]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Démarrer</span>
              </button>
            </>
          )}
        </div>
      }
    >
      {step === 'pick_goal' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {zones.map((z) => {
              const isSelected = selectedZone === z.id;
              return (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`w-full p-3.5 rounded-[22px] text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#831843] text-white'
                      : 'bg-[#F6EDF2] text-[#2B091C] hover:bg-[#F1E2EA]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/15 text-[#FBCFE8]' : 'bg-white text-[#831843]'
                      }`}
                    >
                      <StreamlineIcon name={z.icon} className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <span className="font-display font-bold text-xs sm:text-sm block truncate">
                        {z.label}
                      </span>
                      <span
                        className={`text-[11px] block truncate mt-0.5 ${
                          isSelected ? 'text-[#FBCFE8]/90' : 'text-[#7A616F]'
                        }`}
                      >
                        {z.desc}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#FBCFE8] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Interactive Selector for Abdos Circuits */}
          {selectedZone === 'abs' && (
            <div className="p-4 rounded-[24px] bg-[#FCE7F3]/70 space-y-2.5">
              <span className="block text-xs font-bold text-[#831843]">
                Choisis ton circuit d’abdos & gainage ({ABDOS_CIRCUITS.length} disponibles) :
              </span>
              <div className="space-y-1.5">
                {ABDOS_CIRCUITS.map((c, i) => {
                  const active = selectedAbdoIndex === i;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedAbdoIndex(i)}
                      className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-2 ${
                        active
                          ? 'bg-[#831843] text-white font-bold'
                          : 'bg-white text-[#2B091C] hover:bg-[#FDFBFD]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-xs block truncate">{c.name}</span>
                        <span
                          className={`text-[10px] block truncate ${
                            active ? 'text-[#FBCFE8]' : 'text-[#7A616F]'
                          }`}
                        >
                          {c.durationMinutes} min · {c.focus}
                        </span>
                      </div>
                      {active && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Selector for Cardio Circuits */}
          {selectedZone === 'cardio' && (
            <div className="p-4 rounded-[24px] bg-[#FCE7F3]/70 space-y-2.5">
              <span className="block text-xs font-bold text-[#831843]">
                Choisis ta séance cardio guidée ({CARDIO_CIRCUITS.length} disponibles) :
              </span>
              <div className="space-y-1.5">
                {CARDIO_CIRCUITS.map((c, i) => {
                  const active = selectedCardioIndex === i;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCardioIndex(i)}
                      className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-2 ${
                        active
                          ? 'bg-[#831843] text-white font-bold'
                          : 'bg-white text-[#2B091C] hover:bg-[#FDFBFD]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-xs block truncate">{c.name}</span>
                        <span
                          className={`text-[10px] block truncate ${
                            active ? 'text-[#FBCFE8]' : 'text-[#7A616F]'
                          }`}
                        >
                          {c.machine} · {c.durationMinutes} min · {c.intensity}
                        </span>
                      </div>
                      {active && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FCE7F3] text-[#2B091C] flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base">{generatedName}</h3>
              <p className="text-xs text-[#831843] font-medium">
                {generatedExercises.length} exercices structurés dans l’ordre
              </p>
            </div>
            {selectedZone !== 'abs' && selectedZone !== 'cardio' && (
              <button
                onClick={() => generateWorkout(selectedZone)}
                className="p-2.5 rounded-full bg-white text-[#831843] transition-colors"
                title="Régénérer d'autres exercices"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          <PersonalGearReminder exercises={generatedExercises} variant="banner" />

          {currentWarmupGuide && (
            <div className="rounded-2xl bg-[#F6EDF2] overflow-hidden">
              <button
                onClick={() => setShowWarmupGuide(!showWarmupGuide)}
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs text-[#2B091C]"
              >
                <span className="flex items-center gap-2">
                  <StreamlineIcon name="stretch" className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <span>Échauffement & Étirements adaptés</span>
                </span>
                {showWarmupGuide ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showWarmupGuide && (
                <div className="p-3.5 pt-0 space-y-3 text-xs text-[#2B091C]">
                  <div>
                    <span className="font-bold block mb-1">Échauffement :</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[#7A616F]">
                      {currentWarmupGuide.warmup.map((w, idx) => (
                        <li key={`w-${idx}`}>{w}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold block mb-1">Retour au calme :</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[#7A616F]">
                      {currentWarmupGuide.cooldown.map((c, idx) => (
                        <li key={`c-${idx}`}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Exercises List */}
          <div className="space-y-2">
            {generatedExercises.map((ex, idx) => (
              <div
                key={ex.id}
                className="p-3.5 rounded-2xl bg-[#F6EDF2] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="font-display font-bold text-xs text-[#2B091C] block truncate">
                    {idx + 1}. {ex.exerciseName}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[11px] text-[#7A616F]">
                      {ex.sets.length} {ex.sets.length > 1 ? 'séries' : 'bloc'}
                      {ex.restSeconds > 0 ? ` · Repos ${ex.restSeconds}s` : ''}
                    </span>
                    {ex.notes && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCE7F3] text-[#831843]">
                        {ex.notes}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-mono font-bold text-[#831843] text-xs shrink-0 bg-white px-2.5 py-1 rounded-full">
                  {ex.sets[0]?.targetWeight ? `${ex.sets[0].targetWeight} kg` : 'PDC'}
                </span>
              </div>
            ))}
          </div>

          {finisher && (
            <div className="p-3.5 rounded-2xl bg-[#FCE7F3]/70 text-xs text-[#831843] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#EC4899] shrink-0" />
              <span>
                <strong>Finisher :</strong> {finisher}
              </span>
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
};
