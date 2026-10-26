import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Star,
  ChevronRight,
} from 'lucide-react';
import {
  Exercise,
  MuscleCategory,
  SpecificMuscleGroup,
  SPECIFIC_MUSCLE_GROUPS,
} from '../../types/fitness';
import { useWorkout } from '../../context/WorkoutContext';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { LegPressGuideModal, LegPressInlineGuide } from './LegPressGuideModal';
import { CustomExerciseModal } from './CustomExerciseModal';
import { MachineIllustration } from './MachineIllustration';
import { getEquipmentBadge } from '../../utils/equipmentBadge';
import { StreamlineIcon, getCategoryStreamlineIcon } from '../ui/StreamlineIcon';

interface ExercisesViewProps {
  initialCategory?: MuscleCategory | 'favorites';
  onAddToActiveWorkout?: (exercise: Exercise) => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  initialCategory = 'lower-body',
  onAddToActiveWorkout,
}) => {
  const {
    allExercises,
    favorites,
    toggleFavorite,
    isFavorite,
    getPreviousPerformance,
    deleteCustomExercise,
  } = useWorkout();

  const [selectedCategory, setSelectedCategory] = useState<MuscleCategory | 'all'>(
    initialCategory === 'favorites' ? 'all' : initialCategory
  );
  const [selectedSpecificMuscle, setSelectedSpecificMuscle] = useState<SpecificMuscleGroup | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(initialCategory === 'favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isLegPressGuideOpen, setIsLegPressGuideOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const categories: { id: MuscleCategory | 'all' | 'fav'; label: string; count: number }[] = [
    {
      id: 'lower-body',
      label: 'Bas du corps',
      count: allExercises.filter((e) => e.category === 'lower-body').length,
    },
    {
      id: 'back',
      label: 'Dos',
      count: allExercises.filter((e) => e.category === 'back').length,
    },
    {
      id: 'arms',
      label: 'Bras',
      count: allExercises.filter((e) => e.category === 'arms').length,
    },
    {
      id: 'abs',
      label: 'Abdos',
      count: allExercises.filter((e) => e.category === 'abs').length,
    },
    {
      id: 'cardio',
      label: 'Cardio',
      count: allExercises.filter((e) => e.category === 'cardio').length,
    },
    {
      id: 'fav',
      label: 'Favoris',
      count: favorites.length,
    },
  ];

  const availableSpecificMuscles =
    selectedCategory === 'all'
      ? []
      : SPECIFIC_MUSCLE_GROUPS.filter((m) => m.category === selectedCategory);

  const filteredExercises = allExercises.filter((ex) => {
    const matchesFav = !onlyFavorites || favorites.includes(ex.id);
    const matchesCat = onlyFavorites || selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSpecific =
      selectedSpecificMuscle === 'all' || ex.specificMuscle === selectedSpecificMuscle;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ex.name.toLowerCase().includes(q) ||
      ex.primaryMuscle.toLowerCase().includes(q) ||
      ex.description.toLowerCase().includes(q);

    return matchesFav && matchesCat && matchesSpecific && matchesSearch;
  });

  const handleDeleteExercise = async (e: React.MouseEvent, ex: Exercise) => {
    e.stopPropagation();
    await deleteCustomExercise(ex.id);
    if (selectedExercise?.id === ex.id) {
      setSelectedExercise(null);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* 1. Large Bold Header + Top-Right Circular Icon Action */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[#2B091C]">
          Exercices
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[#831843] hover:bg-[#3B0726] text-white flex items-center justify-center transition-colors"
            title="Ajouter un exercice"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Clean Inline Tabs with Count Pills */}
      <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none border-b border-[#F1E4EC]">
        {categories.map((cat) => {
          const isSelected =
            cat.id === 'fav'
              ? onlyFavorites
              : !onlyFavorites && selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'fav') {
                  setOnlyFavorites(true);
                  setSelectedSpecificMuscle('all');
                } else {
                  setOnlyFavorites(false);
                  setSelectedCategory(cat.id as MuscleCategory);
                  setSelectedSpecificMuscle('all');
                }
              }}
              className={`pb-2.5 flex items-center gap-1.5 whitespace-nowrap text-sm transition-colors border-b-2 -mb-[1px] ${
                isSelected
                  ? 'border-[#831843] font-bold text-[#2B091C]'
                  : 'border-transparent font-medium text-[#8C6D7E] hover:text-[#2B091C]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                  isSelected
                    ? 'bg-[#FCE7F3] text-[#831843]'
                    : 'bg-[#F6EDF2] text-[#8C6D7E]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Simple Search & Sub-muscle Chips */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C6D7E] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un exercice..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full bg-[#F6EDF2] text-[#2B091C] placeholder:text-[#8C6D7E] focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#FBCFE8]"
          />
        </div>

        {!onlyFavorites && availableSpecificMuscles.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={() => setSelectedSpecificMuscle('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecificMuscle === 'all'
                  ? 'bg-[#831843] text-white'
                  : 'bg-[#F6EDF2] text-[#7A616F] hover:bg-[#F1E2EA]'
              }`}
            >
              Tous
            </button>
            {availableSpecificMuscles.map((muscle) => {
              const isSelected = selectedSpecificMuscle === muscle.id;
              return (
                <button
                  key={muscle.id}
                  onClick={() => setSelectedSpecificMuscle(muscle.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#831843] text-white'
                      : 'bg-[#F6EDF2] text-[#7A616F] hover:bg-[#F1E2EA]'
                  }`}
                >
                  {muscle.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Guide intégré à l'intérieur de la section « Bas du corps » */}
      {!onlyFavorites && selectedCategory === 'lower-body' && (
        <LegPressInlineGuide />
      )}

      {/* 4. Clean Soft List Cards */}
      <div className="space-y-2.5">
        {filteredExercises.length === 0 ? (
          <div className="p-8 rounded-[28px] bg-[#F6EDF2] text-center space-y-3">
            <p className="text-sm font-semibold text-[#2B091C]">
              Aucun exercice trouvé
            </p>
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#831843] text-white font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un exercice</span>
            </button>
          </div>
        ) : (
          filteredExercises.map((ex) => {
            const fav = isFavorite(ex.id);
            const prev = getPreviousPerformance(ex.id);
            const equipBadge = getEquipmentBadge(ex.equipment);
            const specificMeta = SPECIFIC_MUSCLE_GROUPS.find((m) => m.id === ex.specificMuscle);

            return (
              <div
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className="group p-3.5 sm:p-4 rounded-[26px] bg-[#F6EDF2] hover:bg-[#F1E2EA] transition-all flex items-center justify-between gap-3.5 cursor-pointer active:scale-99"
              >
                {/* Left Thumbnail Box + Center Title & Metadata Row */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#831843] shrink-0">
                    <StreamlineIcon
                      name={getCategoryStreamlineIcon(ex.category)}
                      className="w-6 h-6"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="font-display font-semibold text-[15px] text-[#2B091C] leading-snug truncate">
                      {ex.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#7A616F]">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#831843]">
                        <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                        <span>{specificMeta?.label || ex.primaryMuscle}</span>
                      </span>
                      <span>·</span>
                      <span>{equipBadge.label}</span>
                      <span>·</span>
                      <span className="font-mono font-semibold text-[#2B091C] tabular-nums">
                        {prev ? `${prev.weight} kg` : `${ex.defaultSets}×${ex.defaultReps}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions: Favorite + Circular White Chevron */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {ex.isCustom && (
                    <button
                      onClick={(e) => handleDeleteExercise(e, ex)}
                      className="w-8 h-8 rounded-full text-[#8C6D7E] hover:text-red-600 flex items-center justify-center"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(ex.id);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#831843]"
                    title="Favori"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        fav ? 'fill-[#EC4899] text-[#EC4899]' : 'text-[#B89BAC]'
                      }`}
                    />
                  </button>

                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#831843] shadow-2xs">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Sheet (Styled after Right Screen of Reference Image) */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
        onOpenLegPressGuide={() => {
          setSelectedExercise(null);
          setIsLegPressGuideOpen(true);
        }}
        onAddToWorkout={onAddToActiveWorkout}
      />

      <LegPressGuideModal
        isOpen={isLegPressGuideOpen}
        onClose={() => setIsLegPressGuideOpen(false)}
      />

      <CustomExerciseModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />
    </div>
  );
};
