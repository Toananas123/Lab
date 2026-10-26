export type MuscleCategory = 'lower-body' | 'back' | 'arms' | 'abs' | 'cardio';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'cardio_machine';

export type ActivityType =
  | 'Séance Bas du corps'
  | 'Séance Fessiers'
  | 'Séance Bras'
  | 'Séance Dos'
  | 'Repos'
  | 'TSE'
  | 'Pilates'
  | 'Course'
  | 'Cardio'
  | 'Abdos'
  | 'Autre'
  | 'Musculation'
  | 'Yoga'
  | 'Danse'
  | 'Natation'
  | 'Vélo'
  | 'Marche'
  | 'HIIT'
  | 'Stretching'
  | 'Boxe'
  | 'Randonnée'
  | 'Activité libre';

export const PLANNING_ACTIVITIES: ActivityType[] = [
  'Séance Bas du corps',
  'Séance Fessiers',
  'Séance Bras',
  'Séance Dos',
  'Repos',
  'TSE',
  'Pilates',
  'Course',
  'Cardio',
  'Abdos',
  'Autre',
];

export const ALL_ACTIVITIES: ActivityType[] = [
  'Séance Bas du corps',
  'Séance Fessiers',
  'Séance Bras',
  'Séance Dos',
  'Repos',
  'TSE',
  'Pilates',
  'Course',
  'Cardio',
  'Abdos',
  'Autre',
  'Musculation',
  'Yoga',
  'Danse',
  'Natation',
  'Vélo',
  'Marche',
  'HIIT',
  'Stretching',
  'Boxe',
  'Randonnée',
];

export type SpecificMuscleGroup =
  | 'fessiers'
  | 'quadriceps'
  | 'ischios'
  | 'adducteurs'
  | 'grand-dorsal'
  | 'milieu-dos'
  | 'lombaires'
  | 'trapezes-arriere-epaule'
  | 'epaule-avant'
  | 'epaule-cote'
  | 'epaule-arriere'
  | 'biceps'
  | 'triceps'
  | 'abdos'
  | 'cardio';

export interface SpecificMuscleMeta {
  id: SpecificMuscleGroup;
  label: string;
  category: MuscleCategory;
}

export const SPECIFIC_MUSCLE_GROUPS: SpecificMuscleMeta[] = [
  { id: 'fessiers', label: 'Fessiers', category: 'lower-body' },
  { id: 'quadriceps', label: 'Quadriceps', category: 'lower-body' },
  { id: 'ischios', label: 'Ischios', category: 'lower-body' },
  { id: 'adducteurs', label: 'Adducteurs', category: 'lower-body' },
  { id: 'grand-dorsal', label: 'Grand dorsal', category: 'back' },
  { id: 'milieu-dos', label: 'Milieu du dos', category: 'back' },
  { id: 'lombaires', label: 'Lombaires', category: 'back' },
  { id: 'trapezes-arriere-epaule', label: 'Trapèze / Arrière épaule', category: 'back' },
  { id: 'epaule-avant', label: 'Épaule (avant)', category: 'arms' },
  { id: 'epaule-cote', label: 'Épaule (côté)', category: 'arms' },
  { id: 'epaule-arriere', label: 'Épaule (arrière)', category: 'arms' },
  { id: 'biceps', label: 'Biceps', category: 'arms' },
  { id: 'triceps', label: 'Triceps', category: 'arms' },
  { id: 'abdos', label: 'Abdominaux & Gainage', category: 'abs' },
  { id: 'cardio', label: 'Cardio & Circuits', category: 'cardio' },
];

export interface Exercise {
  id: string;
  name: string;
  category: MuscleCategory;
  specificMuscle?: SpecificMuscleGroup;
  primaryMuscle: string;
  secondaryMuscles?: string[];
  equipment: EquipmentType;
  description: string;
  startingPosition?: string;
  steps: string[];
  breathing?: string;
  formTips?: string[];
  commonMistakes?: string[];
  avoidTips?: string[]; // Consignes « À éviter »
  defaultSets: number;
  defaultReps: string; // e.g., "10-12" or "60s"
  defaultRestSeconds: number;
  isCustom?: boolean;
  userId?: string;
  imageUrl?: string;
  hasFootPlacementGuide?: boolean;
  machineSetup?: {
    diagramType?: 'leg_press' | 'bench_incline' | 'bench_flat' | 'cable_high' | 'cable_low' | 'seated_row' | 'squat_rack' | 'standing_free';
    seatSetting?: string;
    footPosition?: string;
    gripWidth?: string;
    safetyCue?: string;
  };
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  targetReps: number;
  targetWeight: number; // in kg or lbs
  actualReps?: number;
  actualWeight?: number;
  completed: boolean;
  notes?: string;
  isPR?: boolean;
}

export interface WorkoutExerciseItem {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: MuscleCategory;
  equipment: EquipmentType;
  restSeconds: number;
  sets: ExerciseSet[];
  notes?: string;
  userSettings?: string; // ex: "siège cran 4"
  replacedFrom?: string; // Nom de l'exercice d'origine si remplacé en cours de séance
}

export type WorkoutStatus = 'draft' | 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface Workout {
  id: string;
  userId: string;
  name: string;
  date: string; // YYYY-MM-DD
  status: WorkoutStatus;
  durationMinutes?: number;
  exercises: WorkoutExerciseItem[];
  finisher?: string;
  notes?: string;
  rating?: number; // Ressenti de 1 à 5 🔥
  startedAt?: string;
  completedAt?: string;
  updatedAt?: string;
  sharedCode?: string;
}

export interface Routine {
  id: string;
  userId?: string;
  name: string;
  targetZone: string;
  description?: string;
  exercises: WorkoutExerciseItem[];
  finisher?: string;
  notes?: string;
  isDefault?: boolean;
  createdAt?: string;
  warmup?: string[];
  cooldown?: string[];
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weight?: number;
  waist?: number;
  hips?: number;
  thighs?: number;
  arms?: number;
  chest?: number;
  notes?: string;
  unit: 'metric' | 'imperial';
  createdAt: string;
}

export interface WeeklyPlanDay {
  dayOfWeek: number; // 0 = Dimanche, 1 = Lundi, ... 6 = Samedi
  dayName: string;
  date: string; // YYYY-MM-DD
  routineId?: string;
  workoutName?: string;
  targetZone?: string;
  activity?: ActivityType;
  activities?: ActivityType[];
  finisherType?: 'none' | 'cardio' | 'abs';
  finisher?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'postponed' | 'cancelled' | 'rest';
  notes?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  spotifyUrl?: string;
  unitSystem: 'metric' | 'imperial';
  defaultRestTime: number; // in seconds
  createdAt: string;
  updatedAt?: string;
}
