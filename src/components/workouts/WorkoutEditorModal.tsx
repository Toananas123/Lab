import React, { useState, useMemo } from 'react';
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
  Search,
  Sparkles,
} from 'lucide-react';
import { Exercise, WorkoutExerciseItem, ExerciseSet, MuscleCategory } from '../../types/fitness';
import { useWorkout } from '../../context/WorkoutContext';
import { getEquipmentBadge } from '../../utils/equipmentBadge';
import { WarmupAndStretchingGuide } from './WarmupAndStretchingGuide';
import { StreamlineIcon } from '../ui/StreamlineIcon';
import { ABDOS_CIRCUITS, CARDIO_CIRCUITS, AbdoCircuit, CardioCircuit } from '../../data/exercisesData';
import { CustomExerciseModal } from '../exercises/CustomExerciseModal';

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
  const { allExercises, favorites, getPreviousPerformance } = useWorkout();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('Ma Séance Sur-Mesure');
  const [exercises, setExercises] = useState<WorkoutExerciseItem[]>([]);

  // Predictive Autocomplete Exercise Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState<'all' | 'favs' | MuscleCategory>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [customModalInitialName, setCustomModalInitialName] = useState<string | null>(null);

  // Finisher selection: 'none' | 'cardio' | 'abs'
  const [finisherType, setFinisherType] = useState<'none' | 'cardio' | 'abs'>('none');
  const [finisher, setFinisher] = useState('');
  const [finisherSourceTab, setFinisherSourceTab] = useState<'circuits' | 'quick'>('circuits');
  const [selectedAbdoCircuitId, setSelectedAbdoCircuitId] = useState<string>(ABDOS_CIRCUITS[0]?.id || '');
  const [selectedCardioCircuitId, setSelectedCardioCircuitId] = useState<string>(CARDIO_CIRCUITS[0]?.id || '');
  const [incorporatedCircuitToast, setIncorporatedCircuitToast] = useState<string | null>(null);

  // Rating (1 to 5 🔥) & Notes
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState('');

  // Drawers
  const [showWarmupGuide, setShowWarmupGuide] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Filtered autocomplete suggestions based on typed letters + category chip
  const filteredSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...allExercises]
      .filter((ex) => {
        if (selectedCategoryChip === 'favs' && !favorites.includes(ex.id)) return false;
        if (
          selectedCategoryChip !== 'all' &&
          selectedCategoryChip !== 'favs' &&
          ex.category !== selectedCategoryChip
        ) {
          return false;
        }
        if (!q) return true;
        return (
          ex.name.toLowerCase().includes(q) ||
          ex.primaryMuscle.toLowerCase().includes(q) ||
          (ex.specificMuscle || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const aStarts = q && a.name.toLowerCase().startsWith(q) ? 1 : 0;
        const bStarts = q && b.name.toLowerCase().startsWith(q) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;
        const aFav = favorites.includes(a.id) ? 1 : 0;
        const bFav = favorites.includes(b.id) ? 1 : 0;
        return bFav - aFav;
      })
      .slice(0, q ? 12 : 8);
  }, [allExercises, favorites, searchQuery, selectedCategoryChip]);

  if (!isOpen) return null;

  const handleAddExercise = (ex: Exercise) => {
    const prev = getPreviousPerformance(ex.id);
    const weight = prev
      ? prev.weight
      : ex.equipment === 'dumbbell'
      ? 8
      : ex.equipment === 'barbell'
      ? 30
      : ex.equipment === 'bodyweight' || ex.equipment === 'cardio_machine'
      ? 0
      : 20;

    const defaultSets: ExerciseSet[] = Array.from({ length: ex.defaultSets || 3 }, (_, i) => ({
      id: `s_${Date.now()}_${i}`,
      setNumber: i + 1,
      targetReps: parseInt(ex.defaultReps, 10) || 10,
      targetWeight: weight,
      completed: false,
    }));

    const newItem: WorkoutExerciseItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      exerciseId: ex.id,
      exerciseName: ex.name,
      category: ex.category,
      equipment: ex.equipment,
      restSeconds: ex.defaultRestSeconds || 60,
      sets: defaultSets,
    };

    setExercises((prevList) => [...prevList, newItem]);
    setSearchQuery('');
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
    const updatedSets = target.sets
      .filter((_, idx) => idx !== setIndex)
      .map((s, idx) => ({
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

  const cardioQuickSuggestions = [
    '15 min Marche inclinée 12-5-30 (12% pente, 5 km/h)',
    '12 min StairMaster fessiers tempo régulier (sans se tenir)',
    '10 min Rameur fractionné 30s sprint / 30s récup',
    '15 min Vélo elliptique pyramide résistances',
    '20 min Marche inclinée brûle-graisse (pente 8-10%, 5.2 km/h)',
    '12 min HIIT Vélo : 20s sprint max / 40s souple',
    '10 min Corde à sauter / Jumping Jacks (45s effort / 15s repos)',
    '15 min Escalier (StairMaster) pas croisés & kickbacks',
  ];

  const absQuickSuggestions = [
    'Circuit Gainage Global & Obliques 7 min (Planche + Commando)',
    'Stomach Vacuum (5 x 20s) + Deadbug contrôlé (3 x 12)',
    'Hollow Body Hold & Crunchs contrôlés (3 x 15 reps)',
    'Relevés de bassin au sol & Chandelles (3 x 12 reps)',
    'Circuit Pilates Core : Deadbug, Bird-Dog & Planche latérale',
    'Russian Twists avec disque 5kg & Planche lestée 45s',
    'Crunch poulie haute à genoux (3 x 15) + Gainage 60s',
  ];

  const handleSelectFinisherType = (type: 'none' | 'cardio' | 'abs') => {
    setFinisherType(type);
    if (type === 'none') {
      setFinisher('');
    } else if (type === 'cardio') {
      const firstCircuit = CARDIO_CIRCUITS[0];
      if (firstCircuit) {
        setSelectedCardioCircuitId(firstCircuit.id);
        setFinisher(
          `${firstCircuit.name.replace(/^\d+\.\s*/, '')} (${firstCircuit.machine} · ${firstCircuit.durationMinutes} min)`
        );
      } else {
        setFinisher(cardioQuickSuggestions[0]);
      }
    } else if (type === 'abs') {
      const firstAbdo = ABDOS_CIRCUITS[0];
      if (firstAbdo) {
        setSelectedAbdoCircuitId(firstAbdo.id);
        setFinisher(
          `${firstAbdo.name.replace(/^\d+\.\s*/, '')} (${firstAbdo.durationMinutes} min · ${firstAbdo.exercises.map((e) => e.name).join(' + ')})`
        );
      } else {
        setFinisher(absQuickSuggestions[0]);
      }
    }
  };

  const handlePickAbdoCircuit = (circuit: AbdoCircuit) => {
    setSelectedAbdoCircuitId(circuit.id);
    setFinisher(
      `${circuit.name.replace(/^\d+\.\s*/, '')} (${circuit.durationMinutes} min : ${circuit.exercises
        .map((e) => `${e.name} ${e.reps}`)
        .join(', ')})`
    );
  };

  const handlePickCardioCircuit = (circuit: CardioCircuit) => {
    setSelectedCardioCircuitId(circuit.id);
    setFinisher(
      `${circuit.name.replace(/^\d+\.\s*/, '')} (${circuit.machine} · ${circuit.durationMinutes} min · Intensité ${circuit.intensity})`
    );
  };

  const handleIncorporateAbdoCircuitIntoExercises = (circuit: AbdoCircuit) => {
    const newItems: WorkoutExerciseItem[] = circuit.exercises.map((ex, idx) => {
      const parsedReps = parseInt(ex.reps.replace(/[^0-9]/g, ''), 10) || 12;
      return {
        id: `inc_abdo_${Date.now()}_${idx}`,
        exerciseId: `circuit_${circuit.id}_${idx}`,
        exerciseName: `[Circuit Abdos] ${ex.name} (${ex.reps})`,
        category: 'abs',
        equipment: 'bodyweight',
        restSeconds: 25,
        sets: [
          { id: `s1_${Date.now()}_${idx}`, setNumber: 1, targetReps: parsedReps, targetWeight: 0, completed: false },
          { id: `s2_${Date.now()}_${idx}`, setNumber: 2, targetReps: parsedReps, targetWeight: 0, completed: false },
          { id: `s3_${Date.now()}_${idx}`, setNumber: 3, targetReps: parsedReps, targetWeight: 0, completed: false },
        ],
      };
    });
    setExercises((prev) => [...prev, ...newItems]);
    setIncorporatedCircuitToast(`Les ${circuit.exercises.length} exercices du circuit « ${circuit.name.replace(/^\d+\.\s*/, '')} » ont été ajoutés à ta séance !`);
    setTimeout(() => setIncorporatedCircuitToast(null), 3500);
  };

  const handleIncorporateCardioCircuitIntoExercises = (circuit: CardioCircuit) => {
    const newItems: WorkoutExerciseItem[] = circuit.intervals.map((step, idx) => ({
      id: `inc_cardio_${Date.now()}_${idx}`,
      exerciseId: `circuit_${circuit.id}_${idx}`,
      exerciseName: `[${circuit.machine}] ${step.time} · ${step.instruction}`,
      category: 'cardio',
      equipment: 'cardio_machine',
      restSeconds: 0,
      sets: [
        {
          id: `sc_${Date.now()}_${idx}`,
          setNumber: 1,
          targetReps: circuit.durationMinutes,
          targetWeight: 0,
          completed: false,
        },
      ],
    }));
    setExercises((prev) => [...prev, ...newItems]);
    setIncorporatedCircuitToast(`Les étapes du circuit « ${circuit.name.replace(/^\d+\.\s*/, '')} » ont été ajoutées à ta séance !`);
    setTimeout(() => setIncorporatedCircuitToast(null), 3500);
  };

  const handleShareWorkout = async () => {
    const summaryLines = [
      `Séance Glow Up Lab : ${name}`,
      `Date : ${date}`,
      `Intensité souhaitée : ${rating}/5`,
      `Exercices (${exercises.length}) :`,
      ...exercises.map(
        (e, idx) =>
          `  ${idx + 1}. ${e.exerciseName} - ${e.sets.length} séries (${e.sets
            .map((s) => `${s.targetWeight}kg x${s.targetReps}`)
            .join(', ')})`
      ),
      finisherType !== 'none' && finisher ? `Finisher : ${finisher}` : 'Finisher : Aucun',
      notes ? `Notes : ${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

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

  const activeAbdoCircuit = ABDOS_CIRCUITS.find((c) => c.id === selectedAbdoCircuitId) || ABDOS_CIRCUITS[0];
  const activeCardioCircuit = CARDIO_CIRCUITS.find((c) => c.id === selectedCardioCircuitId) || CARDIO_CIRCUITS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3B0726]/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-[32px] bg-[#FCFBF9] p-5 sm:p-6 shadow-2xl border border-[#E6E2D8] my-4 max-h-[93vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F5B8EE]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2B091C] font-display">
              Saisir & Personnaliser ma Séance
            </h2>
            <p className="text-xs text-[#7A616F] font-medium">
              Tape quelques lettres pour ajouter tes exos et choisis ton circuit Finisher
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShareWorkout}
              className="p-2 rounded-full text-[#831843] bg-[#FCE7F3] hover:bg-[#FBCFE8] transition-colors flex items-center gap-1 text-xs font-bold"
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
            <span>Séance et résumé copiés dans le presse-papiers !</span>
          </div>
        )}

        {incorporatedCircuitToast && (
          <div className="mt-2 p-2.5 rounded-xl bg-[#FCE7F3] border border-[#FBCFE8] text-[#831843] text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#EC4899] shrink-0" />
            <span>{incorporatedCircuitToast}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 text-xs leading-relaxed text-[#2B091C]">
          {/* Workout Name & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-[#831843]">Nom de la séance</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Séance Dos / Pecs, Leg Day Fessiers..."
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E5D4DF] bg-white text-[#2B091C] font-semibold focus:outline-hidden focus:border-[#831843]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#831843]">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E5D4DF] bg-white text-[#2B091C] font-semibold"
              />
            </div>
          </div>

          {/* PREDICTIVE AUTOCOMPLETE EXERCISE SEARCH BAR (Replaces old dropdown/modal) */}
          <div className="p-4 rounded-[26px] bg-[#F6EDF2] border border-[#E5D4DF] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#831843] text-white flex items-center justify-center shrink-0">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-display font-bold text-xs text-[#2B091C] block">
                    Ajouter un exercice (Saisie intelligente)
                  </span>
                  <span className="text-[10px] text-[#7A616F] block">
                    Tape quelques lettres (ex: « hip », « tir », « pec », « fent ») et clique sur une proposition
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-[11px] font-bold text-[#831843] px-2.5 py-1 rounded-full bg-white hover:bg-[#FCE7F3]"
              >
                {isSearchOpen ? 'Réduire' : 'Ouvrir'}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#831843] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Écris les premières lettres d'un exercice (ex: tirage, hip thrust, développé, curl...)"
                className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-white border-2 border-[#FBCFE8] focus:border-[#831843] focus:outline-hidden text-xs font-semibold text-[#2B091C] placeholder:text-[#8C6D7E]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C6D7E] hover:text-[#2B091C]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isSearchOpen && (
              <div className="space-y-2.5 animate-in fade-in duration-150">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                  {(
                    [
                      { id: 'all', label: 'Tous' },
                      { id: 'favs', label: '⭐ Favoris' },
                      { id: 'lower-body', label: 'Bas du corps' },
                      { id: 'back', label: 'Dos' },
                      { id: 'pecs', label: 'Pecs' },
                      { id: 'arms', label: 'Bras & Épaules' },
                      { id: 'abs', label: 'Abdos' },
                      { id: 'cardio', label: 'Cardio' },
                    ] as const
                  ).map((chip) => {
                    const active = selectedCategoryChip === chip.id;
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => setSelectedCategoryChip(chip.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                          active
                            ? 'bg-[#831843] text-white'
                            : 'bg-white text-[#7A616F] hover:text-[#2B091C]'
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>

                {/* Live Proposals List */}
                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                  {filteredSuggestions.map((ex) => {
                    const isFav = favorites.includes(ex.id);
                    const equipBadge = getEquipmentBadge(ex.equipment);
                    const alreadyAdded = exercises.some((item) => item.exerciseId === ex.id);
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => handleAddExercise(ex)}
                        className="w-full p-2.5 rounded-2xl bg-white hover:bg-[#FCE7F3]/70 border border-[#E5D4DF] text-left flex items-center justify-between gap-2 transition-all active:scale-99"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#2B091C] truncate">
                              {ex.name}
                            </span>
                            {isFav && (
                              <Star className="w-3 h-3 fill-[#EC4899] text-[#EC4899] shrink-0" />
                            )}
                            {alreadyAdded && (
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                                Déjà ajouté
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[10px] font-semibold text-[#831843]">
                              {ex.primaryMuscle}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full ${equipBadge.badgeClass}`}
                            >
                              {equipBadge.label}
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-full bg-[#831843] text-white text-[11px] font-bold shrink-0">
                          + Ajouter
                        </span>
                      </button>
                    );
                  })}

                  {/* Create custom exercise with full fiche on the fly */}
                  {searchQuery.trim().length >= 2 && (
                    <button
                      type="button"
                      onClick={() => setCustomModalInitialName(searchQuery.trim())}
                      className="w-full p-3 rounded-2xl bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#831843] text-left flex items-center justify-between gap-2 font-bold text-xs transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#EC4899] shrink-0" />
                        <span>
                          Créer l’exercice « {searchQuery.trim()} » (avec sa fiche complète)
                        </span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#831843] text-white text-[10px]">
                        + Créer
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
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
              {showWarmupGuide ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {showWarmupGuide && (
              <div className="p-2 bg-white">
                <WarmupAndStretchingGuide category={exercises[0]?.category || 'lower-body'} />
              </div>
            )}
          </div>

          {/* Selected Exercises List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#2B091C] uppercase tracking-wider">
                Exercices sélectionnés ({exercises.length})
              </span>
              <button
                type="button"
                onClick={() => setCustomModalInitialName('')}
                className="text-[11px] font-bold text-[#831843] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Créer un nouvel exo perso</span>
              </button>
            </div>

            {exercises.length === 0 ? (
              <div className="p-5 rounded-2xl bg-[#FCFBF9] text-center space-y-1.5 border border-dashed border-[#E5D4DF]">
                <p className="text-xs text-[#7A616F] font-medium">
                  Tape quelques lettres dans la barre ci-dessus ou clique sur un exercice proposé pour construire ta séance.
                </p>
              </div>
            ) : (
              exercises.map((item, exIdx) => {
                const prev = getPreviousPerformance(item.exerciseId);
                const overloadDiff = item.equipment === 'dumbbell' ? 1 : 2.5;
                const suggestedOverload = prev
                  ? Number((prev.weight + overloadDiff).toFixed(1))
                  : null;
                const equipBadge = getEquipmentBadge(item.equipment);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-[#E5D4DF] space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-display text-[#2B091C] text-sm">
                            {exIdx + 1}. {item.exerciseName}
                          </span>
                          {favorites.includes(item.exerciseId) && (
                            <Star className="w-3.5 h-3.5 fill-[#EC4899] text-[#EC4899]" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full ${equipBadge.badgeClass}`}
                          >
                            {equipBadge.label}
                          </span>
                          <span className="text-[11px] text-[#7A616F]">
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
                      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[#FCE7F3]/60 text-[11px] text-[#2B091C]">
                        <div className="flex items-center gap-1 font-medium">
                          <History className="w-3 h-3 text-[#831843]" />
                          <span>
                            Dernière charge : <strong>{prev.weight} kg</strong> ({prev.reps} reps)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleReprendrePrevious(exIdx, prev.weight, prev.reps)}
                          className="px-2 py-0.5 rounded-full bg-white font-bold text-[10px] text-[#831843] hover:bg-[#FCE7F3] flex items-center gap-1"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Reprendre</span>
                        </button>
                        {suggestedOverload && (
                          <button
                            type="button"
                            onClick={() => handleApplyOverload(exIdx, suggestedOverload)}
                            className="px-2 py-0.5 rounded-full bg-[#831843] font-bold text-[10px] text-white flex items-center gap-1"
                          >
                            <Lightbulb className="w-2.5 h-2.5 text-[#FBCFE8]" />
                            <span>Essayer {suggestedOverload} kg</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Sets List */}
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-[#7A616F] uppercase px-1">
                        <span className="col-span-2">Série</span>
                        <span className="col-span-5">Reps</span>
                        <span className="col-span-4">Charge (kg)</span>
                        <span className="col-span-1"></span>
                      </div>

                      {item.sets.map((set, setIdx) => (
                        <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                          <span className="col-span-2 font-display font-bold text-[#831843] pl-1">
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
                              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5D4DF] bg-[#FCFBF9] text-center font-mono font-semibold"
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
                              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E5D4DF] bg-[#FCFBF9] text-center font-mono font-bold text-[#2B091C]"
                            />
                          </div>
                          <div className="col-span-1 text-center">
                            {item.sets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSetFromExercise(exIdx, setIdx)}
                                className="text-neutral-400 hover:text-red-500 font-bold"
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
                        className="text-[11px] font-bold text-[#831843] hover:underline"
                      >
                        + Ajouter une série
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* EXPANDED FINISHER SECTION: Incorporates all 8 Abdos Circuits & 11 Cardio Circuits + Quick Suggestions */}
          <div className="space-y-3 p-4 rounded-[26px] bg-[#F6EDF2] border border-[#E5D4DF]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B091C]">
                <Flame className="w-4 h-4 text-[#EC4899]" />
                <span>Option Finisher : Circuits Abdos, Cardio ou Idées Rapides</span>
              </div>
              <span className="text-[10px] font-semibold text-[#831843]">
                {ABDOS_CIRCUITS.length} circuits Abdos · {CARDIO_CIRCUITS.length} Cardio
              </span>
            </div>

            {/* 3 Main Type Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectFinisherType('none')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${
                  finisherType === 'none'
                    ? 'bg-[#2B091C] text-white shadow-xs'
                    : 'bg-white text-[#7A616F] hover:bg-[#FCE7F3] border border-[#E5D4DF]'
                }`}
              >
                Aucun
              </button>
              <button
                type="button"
                onClick={() => handleSelectFinisherType('abs')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  finisherType === 'abs'
                    ? 'bg-[#831843] text-white shadow-xs'
                    : 'bg-white text-[#7A616F] hover:bg-[#FCE7F3] border border-[#E5D4DF]'
                }`}
              >
                <StreamlineIcon name="stretch" className="w-3.5 h-3.5 shrink-0" />
                <span>Abdos & Circuits</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectFinisherType('cardio')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  finisherType === 'cardio'
                    ? 'bg-[#EC4899] text-white shadow-xs'
                    : 'bg-white text-[#7A616F] hover:bg-[#FCE7F3] border border-[#E5D4DF]'
                }`}
              >
                <StreamlineIcon name="runner" className="w-3.5 h-3.5 shrink-0" />
                <span>Cardio & Circuits</span>
              </button>
            </div>

            {/* Sub-tabs when Cardio or Abs is active: Circuits Proposés vs Suggestions Rapides */}
            {finisherType !== 'none' && (
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setFinisherSourceTab('circuits')}
                  className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-bold transition-all ${
                    finisherSourceTab === 'circuits'
                      ? 'bg-[#FCE7F3] text-[#831843] border border-[#FBCFE8]'
                      : 'bg-white text-[#7A616F]'
                  }`}
                >
                  {finisherType === 'abs'
                    ? `🔥 Les ${ABDOS_CIRCUITS.length} Circuits Abdos de l'appli`
                    : `🏃‍♀️ Les ${CARDIO_CIRCUITS.length} Circuits Cardio guidés`}
                </button>
                <button
                  type="button"
                  onClick={() => setFinisherSourceTab('quick')}
                  className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-bold transition-all ${
                    finisherSourceTab === 'quick'
                      ? 'bg-[#FCE7F3] text-[#831843] border border-[#FBCFE8]'
                      : 'bg-white text-[#7A616F]'
                  }`}
                >
                  ⚡ Autres idées rapides
                </button>
              </div>
            )}

            {/* ABDOS FINISHER PANEL */}
            {finisherType === 'abs' && (
              <div className="space-y-2.5 pt-1 animate-in fade-in">
                {finisherSourceTab === 'circuits' ? (
                  <div className="space-y-2">
                    <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                      {ABDOS_CIRCUITS.map((c) => {
                        const isSelected = selectedAbdoCircuitId === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handlePickAbdoCircuit(c)}
                            className={`w-full p-2.5 rounded-2xl text-left transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-[#831843] text-white'
                                : 'bg-white text-[#2B091C] hover:bg-[#FCE7F3]/50 border border-[#E5D4DF]'
                            }`}
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-xs block truncate">
                                {c.name.replace(/^\d+\.\s*/, '')}
                              </span>
                              <span
                                className={`text-[10px] block truncate ${
                                  isSelected ? 'text-[#FBCFE8]' : 'text-[#7A616F]'
                                }`}
                              >
                                {c.durationMinutes} min · {c.focus}
                              </span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Preview of the chosen Abdo Circuit + Incorporate Button */}
                    {activeAbdoCircuit && (
                      <div className="p-3 rounded-2xl bg-white border border-[#FBCFE8] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[11px] text-[#831843]">
                            Détail du circuit sélectionné ({activeAbdoCircuit.exercises.length} exos) :
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncorporateAbdoCircuitIntoExercises(activeAbdoCircuit)}
                            className="px-2.5 py-1 rounded-full bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#831843] font-bold text-[10px] flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Incorporer les exos dans la séance</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {activeAbdoCircuit.exercises.map((ex, i) => (
                            <div
                              key={i}
                              className="px-2.5 py-1.5 rounded-xl bg-[#F6EDF2] text-[10px] flex items-center justify-between gap-1"
                            >
                              <span className="font-semibold text-[#2B091C] truncate">
                                {i + 1}. {ex.name}
                              </span>
                              <span className="font-mono font-bold text-[#831843] shrink-0">
                                {ex.reps}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {absQuickSuggestions.map((a, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFinisher(a)}
                        className={`px-2.5 py-1.5 rounded-full text-[10px] font-semibold border transition-colors ${
                          finisher === a
                            ? 'bg-[#831843] text-white border-[#831843]'
                            : 'bg-white text-[#2B091C] border-[#E5D4DF] hover:bg-[#FCE7F3]'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  value={finisher}
                  onChange={(e) => setFinisher(e.target.value)}
                  placeholder="Ou personnalise librement ton Finisher Abdos..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5D4DF] bg-white text-[#2B091C] font-medium"
                />
              </div>
            )}

            {/* CARDIO FINISHER PANEL */}
            {finisherType === 'cardio' && (
              <div className="space-y-2.5 pt-1 animate-in fade-in">
                {finisherSourceTab === 'circuits' ? (
                  <div className="space-y-2">
                    <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                      {CARDIO_CIRCUITS.map((c) => {
                        const isSelected = selectedCardioCircuitId === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handlePickCardioCircuit(c)}
                            className={`w-full p-2.5 rounded-2xl text-left transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-[#831843] text-white'
                                : 'bg-white text-[#2B091C] hover:bg-[#FCE7F3]/50 border border-[#E5D4DF]'
                            }`}
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-xs block truncate">
                                {c.name.replace(/^\d+\.\s*/, '')}
                              </span>
                              <span
                                className={`text-[10px] block truncate ${
                                  isSelected ? 'text-[#FBCFE8]' : 'text-[#7A616F]'
                                }`}
                              >
                                {c.machine} · {c.durationMinutes} min · Intensité {c.intensity}
                              </span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Preview of the chosen Cardio Circuit + Incorporate Button */}
                    {activeCardioCircuit && (
                      <div className="p-3 rounded-2xl bg-white border border-[#FBCFE8] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[11px] text-[#831843]">
                            Étapes du circuit ({activeCardioCircuit.machine}) :
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncorporateCardioCircuitIntoExercises(activeCardioCircuit)}
                            className="px-2.5 py-1 rounded-full bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#831843] font-bold text-[10px] flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Incorporer les paliers dans la séance</span>
                          </button>
                        </div>
                        <div className="space-y-1">
                          {activeCardioCircuit.intervals.map((step, i) => (
                            <div
                              key={i}
                              className="px-2.5 py-1 rounded-xl bg-[#F6EDF2] text-[10px] flex items-center justify-between gap-2"
                            >
                              <span className="font-mono font-bold text-[#831843] shrink-0">
                                {step.time}
                              </span>
                              <span className="text-[#2B091C] truncate flex-1 text-right">
                                {step.instruction}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {cardioQuickSuggestions.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFinisher(c)}
                        className={`px-2.5 py-1.5 rounded-full text-[10px] font-semibold border transition-colors ${
                          finisher === c
                            ? 'bg-[#831843] text-white border-[#831843]'
                            : 'bg-white text-[#2B091C] border-[#E5D4DF] hover:bg-[#FCE7F3]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  value={finisher}
                  onChange={(e) => setFinisher(e.target.value)}
                  placeholder="Ou écris ton Finisher Cardio sur-mesure..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5D4DF] bg-white text-[#2B091C] font-medium"
                />
              </div>
            )}

            {finisherType === 'none' && (
              <p className="text-[11px] text-[#7A616F] italic pt-0.5">
                Aucun finisher sélectionné. Clique sur « Abdos & Circuits » ou « Cardio & Circuits » pour choisir parmi tous les circuits de l’application.
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
                setIsSearchOpen(true);
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
            className="py-3 px-4 rounded-full bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#831843] font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer routine</span>
          </button>

          <button
            type="button"
            onClick={handleShareWorkout}
            className="py-3 px-3.5 rounded-full bg-[#F6EDF2] hover:bg-[#F1E2EA] text-[#2B091C] font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#831843]" />
            <span>Partager</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (exercises.length === 0) {
                setIsSearchOpen(true);
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
            className="flex-1 py-3 px-4 rounded-full bg-[#831843] hover:bg-[#5B0E2D] text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Démarrer la séance active</span>
          </button>
        </div>
      </div>

      {/* Custom Exercise Modal (when creating a custom exercise with full fiche from the editor) */}
      <CustomExerciseModal
        isOpen={customModalInitialName !== null}
        onClose={() => setCustomModalInitialName(null)}
        initialName={customModalInitialName || ''}
        onExerciseCreated={(createdEx) => {
          handleAddExercise(createdEx);
          setCustomModalInitialName(null);
        }}
      />
    </div>
  );
};
