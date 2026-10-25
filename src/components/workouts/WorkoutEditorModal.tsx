import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Play,
  Save,
  Star,
  History,
  Lightbulb,
  RotateCcw,
  Flame,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Exercise, WorkoutExerciseItem, ExerciseSet } from '../../types/fitness';
import { useWorkout } from '../../context/WorkoutContext';
import { getEquipmentBadge } from '../../utils/equipmentBadge';
import { WarmupAndStretchingGuide } from './WarmupAndStretchingGuide';
import { StreamlineIcon } from '../ui/StreamlineIcon';

interface WorkoutEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchWorkout: (workout: {
    name: string;
    exercises: WorkoutExerciseItem[];
    finisher?: string;
    notes?: string;
    rating?: number;
    finisherType?: 'none' | 'cardio' | 'abs';
  }) => void;
  onSaveRoutine: (routine: {
    name: string;
    targetZone: string;
    exercises: WorkoutExerciseItem[];
    finisher?: string;
    notes?: string;
  }) => void;
}

export const WorkoutEditorModal: React.FC<WorkoutEditorModalProps> = ({
  isOpen,
  onClose,
  onLaunchWorkout,
  onSaveRoutine,
}) => {
  const { allExercises, favorites, getPreviousPerformance, createShareCode } = useWorkout();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('Ma Séance Sur-Mesure');
  const [exercises, setExercises] = useState<WorkoutExerciseItem[]>([]);
  
  // Finisher selection: 'none' | 'cardio' | 'abs'
  const [finisherType, setFinisherType] = useState<'none' | 'cardio' | 'abs'>('none');
  const [finisher, setFinisher] = useState('');
  
  // Rating (1 to 5 🔥) & Notes
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState('');

  // Modals & Drawers
  const [showPicker, setShowPicker] = useState(false);
  const [manualExerciseName, setManualExerciseName] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [showWarmupGuide, setShowWarmupGuide] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  if (!isOpen) return null;

  // Sort exercises with favorites first
  const sortedExercises = [...allExercises].sort((a, b) => {
    const aFav = favorites.includes(a.id) ? 1 : 0;
    const bFav = favorites.includes(b.id) ? 1 : 0;
    return bFav - aFav;
  });

  const handleAddExercise = (ex: Exercise) => {
    const prev = getPreviousPerformance(ex.id);
    const weight = prev ? prev.weight : (ex.equipment === 'dumbbell' ? 8 : (ex.equipment === 'barbell' ? 30 : 20));

    const defaultSets: ExerciseSet[] = Array.from({ length: ex.defaultSets || 3 }, (_, i) => ({
      id: `s_${Date.now()}_${i}`,
      setNumber: i + 1,
      targetReps: parseInt(ex.defaultReps, 10) || 10,
      targetWeight: weight,
      completed: false,
    }));

    const newItem: WorkoutExerciseItem = {
      id: `item_${Date.now()}`,
      exerciseId: ex.id,
      exerciseName: ex.name,
      category: ex.category,
      equipment: ex.equipment,
      restSeconds: ex.defaultRestSeconds || 60,
      sets: defaultSets,
    };

    setExercises([...exercises, newItem]);
    setShowPicker(false);
  };

  const handleAddManualExercise = () => {
    if (!manualExerciseName.trim()) return;
    const newItem: WorkoutExerciseItem = {
      id: `item_manual_${Date.now()}`,
      exerciseId: `custom_${Date.now()}`,
      exerciseName: manualExerciseName.trim(),
      category: 'lower-body',
      equipment: 'dumbbell',
      restSeconds: 60,
      sets: [
        { id: `s_${Date.now()}_0`, setNumber: 1, targetReps: 10, targetWeight: 10, completed: false },
        { id: `s_${Date.now()}_1`, setNumber: 2, targetReps: 10, targetWeight: 10, completed: false },
        { id: `s_${Date.now()}_2`, setNumber: 3, targetReps: 10, targetWeight: 10, completed: false },
      ],
    };
    setExercises([...exercises, newItem]);
    setManualExerciseName('');
    setShowManualInput(false);
    setShowPicker(false);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const addSetToExercise = (exIndex: number) => {
    const target = exercises[exIndex];
    const lastSet = target.sets[target.sets.length - 1];
    const newSet: ExerciseSet = {
      id: `s_${Date.now()}_${target.sets.length}`,
      setNumber: target.sets.length + 1,
      targetReps: lastSet ? lastSet.targetReps : 10,
      targetWeight: lastSet ? lastSet.targetWeight : 15,
      completed: false,
    };

    const updated = [...exercises];
    updated[exIndex] = { ...target, sets: [...target.sets, newSet] };
    setExercises(updated);
  };

  const removeSetFromExercise = (exIndex: number, setIndex: number) => {
    const target = exercises[exIndex];
    if (target.sets.length <= 1) return;
    const updatedSets = target.sets.filter((_, idx) => idx !== setIndex).map((s, idx) => ({
      ...s,
      setNumber: idx + 1,
    }));
    const updated = [...exercises];
    updated[exIndex] = { ...target, sets: updatedSets };
    setExercises(updated);
  };

  const updateSetValues = (exIndex: number, setIndex: number, reps: number, weight: number) => {
    const target = exercises[exIndex];
    const updatedSets = [...target.sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      targetReps: reps,
      targetWeight: weight,
    };
    const updated = [...exercises];
    updated[exIndex] = { ...target, sets: updatedSets };
    setExercises(updated);
  };

  const handleApplyOverload = (exIndex: number, suggestedWeight: number) => {
    const target = exercises[exIndex];
    const updatedSets = target.sets.map((s) => ({
      ...s,
      targetWeight: suggestedWeight,
    }));
    const updated = [...exercises];
    updated[exIndex] = { ...target, sets: updatedSets };
    setExercises(updated);
  };

  const handleReprendrePrevious = (exIndex: number, prevWeight: number, prevReps: number) => {
    const target = exercises[exIndex];
    const updatedSets = target.sets.map((s) => ({
      ...s,
      targetWeight: prevWeight,
      targetReps: prevReps,
    }));
    const updated = [...exercises];
    updated[exIndex] = { ...target, sets: updatedSets };
    setExercises(updated);
  };

  const cardioSuggestions = [
    '15 min Tapis de course 12-5-30 (12% pente, 5 km/h)',
    '12 min StairMaster fessiers tempo régulier',
    '10 min Rameur fractionné 30s sprint / 30s récup',
    '15 min Vélo elliptique pyramide résistances',
    '15 min Marche en côte active 10% pente',
    '12 min HIIT vélo d’appartement',
  ];

  const absSuggestions = [
    'Circuit Gainage Global & Obliques 7 min (Planche + Commando)',
    'Hollow Rock & Crunchs contrôlés 3 x 15 reps',
    'Relevés de bassin suspendu & Chandelles 3 x 12 reps',
    'Circuit Pilates Core : Deadbug, Bird-Dog & Vacuum',
    'Russian Twists avec petit disque & Gainage latéral',
  ];

  const handleSelectFinisherType = (type: 'none' | 'cardio' | 'abs') => {
    setFinisherType(type);
    if (type === 'none') {
      setFinisher('');
    } else if (type === 'cardio' && !finisher) {
      setFinisher(cardioSuggestions[0]);
    } else if (type === 'abs' && !finisher) {
      setFinisher(absSuggestions[0]);
    }
  };

  const handleShareWorkout = async () => {
    const summaryLines = [
      `Séance Glow Up Lab : ${name}`,
      `Date : ${date}`,
      `Intensité souhaitée : ${rating}/5`,
      `Exercices (${exercises.length}) :`,
      ...exercises.map((e, idx) => `  ${idx + 1}. ${e.exerciseName} - ${e.sets.length} séries (${e.sets.map((s) => `${s.targetWeight}kg x${s.targetReps}`).join(', ')})`),
      finisherType !== 'none' && finisher ? `Finisher : ${finisher}` : 'Finisher : Aucun',
      notes ? `Notes : ${notes}` : '',
    ].filter(Boolean).join('\n');

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(summaryLines);
      }
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 3000);
    } catch {
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3B0726]/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-[32px] bg-[#FCFBF9] p-6 shadow-2xl border border-[#E6E2D8] my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F5B8EE]">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#3B0726] font-display">
              Saisir & Personnaliser ma Séance
            </h2>
            <p className="text-xs text-[#6E6A63] font-medium">
              Exercices, séries, charges, finisher et ressenti
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShareWorkout}
              className="p-2 rounded-full text-[#3B0726] bg-[#F3E3F5] hover:bg-[#F8A5F8] transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Partager cette séance"
            >
              {sharedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Partager</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#6E6A63] hover:text-[#3B0726] rounded-full hover:bg-[#F2EFE9]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {sharedToast && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Séance et résumé copiés dans le presse-papiers avec succès !</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 text-xs leading-relaxed text-[#3B0726]">
          {/* Workout Name & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-neutral-600">Nom de la séance</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Fessiers Galbe & Ischios"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E2D8] bg-white text-[#3B0726] font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-600">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E2D8] bg-white text-[#3B0726] font-medium"
              />
            </div>
          </div>

          {/* Warmup & Stretching Drawer Toggle */}
          <div className="rounded-2xl border border-[#E6E2D8] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowWarmupGuide(!showWarmupGuide)}
              className="w-full p-3 bg-[#F2EFE9] text-left flex items-center justify-between font-semibold text-xs text-[#3B0726]"
            >
              <div className="flex items-center gap-2">
                <StreamlineIcon name="stretch" className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>Protocole conseillé : Échauffement dynamique & Étirements</span>
              </div>
              {showWarmupGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showWarmupGuide && (
              <div className="p-2 bg-white">
                <WarmupAndStretchingGuide category={exercises[0]?.category || 'lower-body'} />
              </div>
            )}
          </div>

          {/* Exercises List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#3B0726] uppercase tracking-wider">
                Exercices de la séance ({exercises.length})
              </span>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="px-3 py-1.5 rounded-full bg-[#3B0726] text-white font-semibold text-xs hover:bg-[#3B0726] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un exercice</span>
              </button>
            </div>

            {exercises.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#F2EFE9] text-center space-y-2 border border-dashed border-[#E6E2D8]">
                <div className="w-10 h-10 rounded-2xl bg-white text-[#EC4899] flex items-center justify-center mx-auto">
                  <StreamlineIcon name="weightlifter" className="w-5 h-5" />
                </div>
                <p className="text-xs text-neutral-600 font-medium">Aucun exercice pour le moment.</p>
                <button
                  type="button"
                  onClick={() => setShowPicker(true)}
                  className="px-4 py-2 rounded-full bg-[#F8A5F8] text-[#3B0726] font-semibold text-xs inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Choisir un exercice (menu avec favoris)</span>
                </button>
              </div>
            ) : (
              exercises.map((item, exIdx) => {
                const prev = getPreviousPerformance(item.exerciseId);
                const overloadDiff = item.equipment === 'dumbbell' ? 1 : 2.5;
                const suggestedOverload = prev ? Number((prev.weight + overloadDiff).toFixed(1)) : null;
                const equipBadge = getEquipmentBadge(item.equipment);

                return (
                  <div key={item.id} className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E6E2D8] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-display text-[#3B0726] text-sm">
                            {exIdx + 1}. {item.exerciseName}
                          </span>
                          {favorites.includes(item.exerciseId) && (
                            <Star className="w-3.5 h-3.5 fill-[#EC4899] text-[#EC4899]" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full ${equipBadge.badgeClass}`}>
                            {equipBadge.label}
                          </span>
                          <span className="text-[11px] text-[#6E6A63]">
                            Repos {item.restSeconds}s
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeExercise(exIdx)}
                        className="p-1 text-neutral-400 hover:text-red-600 rounded-full hover:bg-[#F2EFE9]"
                        title="Supprimer cet exercice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Previous performance & Overload suggestion strip */}
                    {prev && (
                      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[#F3E3F5] text-[11px] text-[#3B0726]">
                        <div className="flex items-center gap-1 font-medium">
                          <History className="w-3 h-3 text-[#3B0726]" />
                          <span>Dernière charge : <strong>{prev.weight} kg</strong> ({prev.reps} reps)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleReprendrePrevious(exIdx, prev.weight, prev.reps)}
                          className="px-2 py-0.5 rounded-full bg-white font-semibold text-[10px] text-[#3B0726] hover:bg-[#F8A5F8] flex items-center gap-1"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Reprendre</span>
                        </button>
                        {suggestedOverload && (
                          <button
                            type="button"
                            onClick={() => handleApplyOverload(exIdx, suggestedOverload)}
                            className="px-2 py-0.5 rounded-full bg-[#3B0726] font-semibold text-[10px] text-white hover:bg-[#3B0726] flex items-center gap-1"
                          >
                            <Lightbulb className="w-2.5 h-2.5 text-[#F8A5F8]" />
                            <span>Essayer {suggestedOverload} kg</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Sets List */}
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-neutral-500 uppercase px-1">
                        <span className="col-span-2">Série</span>
                        <span className="col-span-5">Reps</span>
                        <span className="col-span-4">Charge (kg)</span>
                        <span className="col-span-1"></span>
                      </div>

                      {item.sets.map((set, setIdx) => (
                        <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                          <span className="col-span-2 font-display font-semibold text-[#3B0726] pl-1">
                            #{setIdx + 1}
                          </span>
                          <div className="col-span-5">
                            <input
                              type="number"
                              min="1"
                              value={set.targetReps}
                              onChange={(e) =>
                                updateSetValues(
                                  exIdx,
                                  setIdx,
                                  parseInt(e.target.value, 10) || 0,
                                  set.targetWeight
                                )
                              }
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E6E2D8] bg-white text-center font-mono font-medium"
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={set.targetWeight}
                              onChange={(e) =>
                                updateSetValues(
                                  exIdx,
                                  setIdx,
                                  set.targetReps,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E6E2D8] bg-white text-center font-mono font-bold text-[#3B0726]"
                            />
                          </div>
                          <div className="col-span-1 text-center">
                            {item.sets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSetFromExercise(exIdx, setIdx)}
                                className="text-neutral-400 hover:text-red-500"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex justify-start">
                      <button
                        type="button"
                        onClick={() => addSetToExercise(exIdx)}
                        className="text-[11px] font-semibold text-[#3B0726] hover:underline"
                      >
                        + Ajouter une série
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Finisher Optionnel : 3 choix explicites (Rien / Cardio / Abdos) */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#F2EFE9] border border-[#E6E2D8]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3B0726]">
                <Flame className="w-3.5 h-3.5 text-[#3B0726]" />
                <span>Option Finisher : Sélectionnez votre choix</span>
              </div>
              <span className="text-[10px] text-neutral-500">Cardio, Abdos ou Aucun</span>
            </div>

            {/* 3 boutons de sélection */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectFinisherType('none')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  finisherType === 'none'
                    ? 'bg-[#3B0726] text-white shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-[#F3E3F5] border border-[#E6E2D8]'
                }`}
              >
                Rien (Aucun)
              </button>
              <button
                type="button"
                onClick={() => handleSelectFinisherType('cardio')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  finisherType === 'cardio'
                    ? 'bg-[#EC4899] text-white shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-[#F3E3F5] border border-[#E6E2D8]'
                }`}
              >
                <StreamlineIcon name="runner" className="w-3.5 h-3.5 shrink-0" />
                <span>Cardio</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectFinisherType('abs')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  finisherType === 'abs'
                    ? 'bg-[#3B0726] text-[#F8A5F8] shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-[#F3E3F5] border border-[#E6E2D8]'
                }`}
              >
                <StreamlineIcon name="stretch" className="w-3.5 h-3.5 shrink-0" />
                <span>Abdos</span>
              </button>
            </div>

            {/* If Cardio chosen */}
            {finisherType === 'cardio' && (
              <div className="space-y-2 pt-1 animate-in fade-in">
                <span className="text-[11px] font-semibold text-[#3B0726] block">
                  Suggestions Cardio populaires :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cardioSuggestions.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFinisher(c)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                        finisher === c
                          ? 'bg-[#3B0726] text-white border-[#3B0726]'
                          : 'bg-white text-neutral-700 border-[#E6E2D8] hover:bg-[#F3E3F5]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={finisher}
                  onChange={(e) => setFinisher(e.target.value)}
                  placeholder="Ou écrivez votre séance cardio sur-mesure..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E2D8] bg-white text-[#3B0726]"
                />
              </div>
            )}

            {/* If Abs chosen */}
            {finisherType === 'abs' && (
              <div className="space-y-2 pt-1 animate-in fade-in">
                <span className="text-[11px] font-semibold text-[#3B0726] block">
                  Suggestions Circuits Abdos & Gainage :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {absSuggestions.map((a, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFinisher(a)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                        finisher === a
                          ? 'bg-[#3B0726] text-white border-[#3B0726]'
                          : 'bg-white text-neutral-700 border-[#E6E2D8] hover:bg-[#F3E3F5]'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={finisher}
                  onChange={(e) => setFinisher(e.target.value)}
                  placeholder="Ou écrivez votre circuit abdos personnalisé..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E2D8] bg-white text-[#3B0726]"
                />
              </div>
            )}

            {finisherType === 'none' && (
              <p className="text-[11px] text-neutral-500 italic pt-1">
                Aucun finisher sélectionné : focus total sur la musculation et la récupération.
              </p>
            )}
          </div>

          {/* Rating (1 to 5) & Notes */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#FCFBF9] border border-[#E6E2D8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <label className="text-xs font-semibold text-[#3B0726] flex items-center gap-1.5">
                  <span>Ressenti d'intensité : {rating}/5</span>
                  <StreamlineIcon name="heart-pulse" className="w-3.5 h-3.5 text-[#EC4899]" />
                </label>
                <span className="text-[10px] text-neutral-500">
                  {rating === 1 && 'Doux · Récupération active'}
                  {rating === 2 && 'Modéré · Échauffement et mobilité'}
                  {rating === 3 && 'Équilibré · Bon engagement musculaire'}
                  {rating === 4 && 'Intense · Brûlure et congestion profonde'}
                  {rating === 5 && 'Record · Effort maximal et dépassement !'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setRating(lvl)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                      rating >= lvl
                        ? 'bg-[#F8A5F8] text-[#3B0726] scale-110 shadow-xs'
                        : 'bg-white text-neutral-400 opacity-60 border border-[#E6E2D8]'
                    }`}
                  >
                    <StreamlineIcon name="heart-pulse" className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Notes personnelles en bas de séance
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ressenti, énergie, réglages machines à mémoriser..."
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E2D8] bg-white text-[#3B0726]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#F5B8EE] flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (exercises.length === 0) {
                setShowPicker(true);
                return;
              }
              onSaveRoutine({
                name,
                targetZone: exercises[0]?.category || 'lower-body',
                exercises,
                finisher: finisherType !== 'none' ? finisher : undefined,
                notes,
              });
              onClose();
            }}
            className="py-3 px-4 rounded-full bg-[#F3E3F5] hover:bg-[#F8A5F8] text-[#3B0726] font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer routine</span>
          </button>

          <button
            type="button"
            onClick={handleShareWorkout}
            className="py-3 px-3.5 rounded-full bg-[#F2EFE9] hover:bg-[#EAE6DE] text-neutral-800 font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#3B0726]" />
            <span>Partager</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (exercises.length === 0) {
                setShowPicker(true);
                return;
              }
              onLaunchWorkout({
                name,
                exercises,
                finisher: finisherType !== 'none' ? finisher : undefined,
                notes,
                rating,
                finisherType,
              });
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-full bg-[#3B0726] hover:bg-[#3B0726] text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Démarrer la séance active</span>
          </button>
        </div>
      </div>

      {/* Exercise Picker Modal Overlay with Favorites first & Manual input */}
      {showPicker && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-[#FCFBF9] p-5 shadow-2xl border border-[#E6E2D8] space-y-3 max-h-[82vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
              <div>
                <h3 className="font-display font-semibold text-[#3B0726] text-sm">
                  Choisir un exercice
                </h3>
                <p className="text-[10px] text-neutral-500">Favoris en tête de liste</p>
              </div>
              <button onClick={() => setShowPicker(false)} className="p-1 text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Manual Exercise Input Toggle */}
            <div className="p-2.5 rounded-xl bg-[#F2EFE9] space-y-2">
              <button
                type="button"
                onClick={() => setShowManualInput(!showManualInput)}
                className="w-full text-left text-xs font-semibold text-[#3B0726] flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <StreamlineIcon name="dumbbell" className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span>Option : Autre exercice (à écrire à la main)</span>
                </span>
                {showManualInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showManualInput && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={manualExerciseName}
                    onChange={(e) => setManualExerciseName(e.target.value)}
                    placeholder="Nom de l'exercice personnalisé..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-[#E6E2D8]"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualExercise}
                    className="px-3 py-1.5 bg-[#3B0726] text-white rounded-xl text-xs font-semibold"
                  >
                    Ajouter
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {sortedExercises.map((ex) => {
                const isFav = favorites.includes(ex.id);
                const equipBadge = getEquipmentBadge(ex.equipment);
                return (
                  <button
                    key={ex.id}
                    onClick={() => handleAddExercise(ex)}
                    className="w-full p-2.5 rounded-xl bg-white hover:bg-[#F3E3F5] border border-[#E6E2D8] text-left flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#3B0726]">{ex.name}</span>
                        {isFav && <Star className="w-3 h-3 fill-[#EC4899] text-[#EC4899]" />}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-[#6E6A63]">{ex.primaryMuscle}</span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded-full ${equipBadge.badgeClass}`}>
                          {equipBadge.label}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#3B0726]">+ Choisir</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
