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

export const WorkoutGeneratorModal: React.FC<WorkoutGeneratorModalProps> = ({
  isOpen,
  onClose,
  onLaunchWorkout,
  onSaveAsRoutine,
}) => {
  const { allExercises, favorites, getPreviousPerformance } = useWorkout();

  const [selectedZone, setSelectedZone] = useState<
    'glutes' | 'lower' | 'posterior' | 'quads_adductors' | 'back' | 'back_thick' | 'arms' | 'fullbody' | 'abs' | 'cardio'
  >('glutes');
  const [selectedCardioIndex, setSelectedCardioIndex] = useState(0);
  const [selectedAbdoIndex, setSelectedAbdoIndex] = useState(0);

  const [generatedExercises, setGeneratedExercises] = useState<WorkoutExerciseItem[]>([]);
  const [finisher, setFinisher] = useState<string>('');
  const [generatedName, setGeneratedName] = useState<string>('');
  const [showWarmupGuide, setShowWarmupGuide] = useState(false);
  const [step, setStep] = useState<'pick_goal' | 'review'>('pick_goal');

  if (!isOpen) return null;

  const zones: { id: string; label: string; desc: string; icon: StreamlineIconName }[] = [
    { id: 'glutes', label: 'Fessiers uniquement (Booty Focus)', desc: 'Hip thrust, kickback poulie, abduction & fentes bulgares', icon: 'kettlebell' },
    { id: 'lower', label: 'Bas du corps complet (Équilibre)', desc: 'Presse 45°, RDL, hack squat & leg curl', icon: 'kettlebell' },
    { id: 'abs', label: 'Circuits Abdos & Gainage (8 circuits)', desc: 'Debout avec charge, Planche lestée 60s, Over-Unders, 360°, Vacuum...', icon: 'stretch' },
    { id: 'cardio', label: 'Circuits Cardio Guidés (11 séances)', desc: 'Marche inclinée 12-5-30, StairMaster, Rameur, Elliptique, HIIT...', icon: 'runner' },
    { id: 'posterior', label: 'Chaîne postérieure (Fessiers & Ischios)', desc: 'RDL haltères, hip thrust, leg curl assis & banc lombaires', icon: 'kettlebell' },
    { id: 'quads_adductors', label: 'Quads Sculpt & Adducteurs Fermes', desc: 'Presse à cuisses, machine adducteurs, leg extension & squat sumo', icon: 'kettlebell' },
    { id: 'back', label: 'Dos & Silhouette V-Shape', desc: 'Tirage vertical poitrine, pull-over corde, seated row & face pulls', icon: 'dumbbell' },
    { id: 'back_thick', label: 'Dos Épais & Posture Altière', desc: 'T-Bar row, chest-supported row, tirage prise neutre & face pulls', icon: 'dumbbell' },
    { id: 'arms', label: 'Épaules Galbées & Bras Toniques', desc: 'Élévations latérales, développé militaire, triceps corde & curl incliné', icon: 'biceps' },
    { id: 'fullbody', label: 'Full Body Glow & Tonique', desc: 'Séance complète 4 mouvements polyarticulaires majeurs', icon: 'weightlifter' },
  ];

  const generateWorkout = (zoneId: typeof selectedZone) => {
    // Special handling for Abdos & Cardio circuits so the exact chosen circuit is generated
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

    const isLower = zoneId === 'glutes' || zoneId === 'lower' || zoneId === 'posterior' || zoneId === 'quads_adductors';

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
        defaultFinisher = 'Hyperextensions au banc 45° (3 x 15 reps)';
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
    } else {
      let pool: Exercise[] = [];

      if (zoneId === 'back') {
        workoutName = 'Dos & Silhouette V-Shape';
        defaultFinisher = 'Face Pulls corde en brûlure (3 x 15 reps)';
        pool = allExercises.filter((ex) => ex.category === 'back');
      } else if (zoneId === 'back_thick') {
        workoutName = 'Dos Épais & Posture Altière';
        defaultFinisher = 'Pull-over à la corde (3 x 15 reps)';
        pool = allExercises.filter(
          (ex) => ex.specificMuscle === 'milieu-dos' || ex.specificMuscle === 'grand-dorsal' || ex.specificMuscle === 'trapezes-arriere-epaule'
        );
      } else if (zoneId === 'arms') {
        workoutName = 'Épaules Galbées & Bras Toniques';
        defaultFinisher = 'Extensions triceps à la corde (3 x 15 reps)';
        pool = allExercises.filter((ex) => ex.category === 'arms');
      } else if (zoneId === 'fullbody') {
        workoutName = 'Full Body Glow & Tonification Totale';
        defaultFinisher = '60 secondes de planche active ou 5 min de marche en côte';
        const fessier = allExercises.find((e) => e.specificMuscle === 'fessiers') || allExercises[0];
        const dos = allExercises.find((e) => e.specificMuscle === 'grand-dorsal') || allExercises[1];
        const epaule = allExercises.find((e) => e.specificMuscle === 'epaule-cote') || allExercises[2];
        const core = allExercises.find((e) => e.specificMuscle === 'abdos') || allExercises[3];
        pool = [fessier, dos, epaule, core].filter(Boolean) as Exercise[];
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
      const targetWeight = prev ? prev.weight : ex.equipment === 'dumbbell' ? 6 : ex.equipment === 'barbell' ? 30 : 20;
      const setsCount = ex.defaultSets || 3;

      const sets = Array.from({ length: setsCount }, (_, sIdx) => ({
        id: `gen_set_${Date.now()}_${idx}_${sIdx}`,
        setNumber: sIdx + 1,
        targetReps: parseInt(ex.defaultReps, 10) || 10,
        targetWeight,
        completed: false,
      }));

      return {
        id: `gen_item_${Date.now()}_${idx}`,
        exerciseId: ex.id,
        exerciseName: ex.name,
        category: ex.category,
        equipment: ex.equipment,
        restSeconds: ex.defaultRestSeconds || 60,
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
    selectedZone === 'glutes' || selectedZone === 'lower' || selectedZone === 'posterior' || selectedZone === 'quads_adductors'
      ? WARMUP_COOLDOWN_GUIDES['lower-body']
      : selectedZone === 'back' || selectedZone === 'back_thick'
      ? WARMUP_COOLDOWN_GUIDES['back']
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
          ? 'Choisis ta zone cible ou un circuit guidé'
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
                  onClick={() => setSelectedZone(z.id as any)}
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
                {generatedExercises.length} étapes prévues
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

          {/* Matériel personnel à prévoir avant de commencer */}
          <PersonalGearReminder exercises={generatedExercises} variant="banner" />

          {/* Warm-up & Cooldown Collapsible Guide */}
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
                {showWarmupGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                    {ex.notes && ex.notes.startsWith('Phase') && (
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
