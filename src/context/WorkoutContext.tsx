import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, sanitizeForFirestore } from '../firebase/config';
import { useAuth } from './AuthContext';
import {
  Exercise,
  Workout,
  Routine,
  BodyMeasurement,
  WeeklyPlanDay,
  WorkoutExerciseItem,
} from '../types/fitness';
import { DEFAULT_EXERCISES, STARTER_ROUTINES } from '../data/exercisesData';

const ACTIVE_WORKOUT_STORAGE_KEY = 'glow_up_lab_active_workout';
const LOCAL_DATA_PREFIX = 'glow_up_lab_local_';

interface WorkoutContextType {
  allExercises: Exercise[];
  customExercises: Exercise[];
  favorites: string[];
  routines: Routine[];
  workouts: Workout[];
  activeWorkout: Workout | null;
  measurements: BodyMeasurement[];
  weeklyPlans: WeeklyPlanDay[];
  loading: boolean;
  
  // Custom Exercises
  addCustomExercise: (ex: Omit<Exercise, 'id' | 'isCustom' | 'userId'>) => Promise<void>;
  deleteCustomExercise: (id: string) => Promise<void>;
  
  // Favorites
  toggleFavorite: (exerciseId: string) => Promise<void>;
  isFavorite: (exerciseId: string) => boolean;
  
  // Routines
  createRoutine: (routine: Omit<Routine, 'id'>) => Promise<Routine>;
  updateRoutine: (id: string, routine: Partial<Routine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  
  // Active Workout
  startWorkout: (workoutData: { name: string; exercises: WorkoutExerciseItem[]; finisher?: string; notes?: string; rating?: number; finisherType?: 'none' | 'cardio' | 'abs' }) => Workout;
  updateActiveWorkout: (updated: Workout) => void;
  finishActiveWorkout: (completedNotes?: string, finalFinisher?: string, rating?: number) => Promise<Workout>;
  cancelActiveWorkout: () => void;
  
  // Historical Workouts
  deleteWorkout: (id: string) => Promise<void>;
  updateWorkout: (id: string, updates: Partial<Workout>) => Promise<void>;
  duplicateWorkoutAsNew: (workout: Workout) => Workout;
  getPreviousPerformance: (exerciseId: string) => { weight: number; reps: number; date: string } | null;
  getPersonalRecords: () => Record<string, { maxWeight: number; reps: number; date: string }>;
  
  // Exercise Settings ("Mes réglages")
  exerciseSettings: Record<string, string>;
  updateExerciseSettings: (exerciseId: string, settings: string) => Promise<void>;

  // Shared Workouts
  sharedTemplateWorkout: Workout | null;
  setSharedTemplateWorkout: (w: Workout | null) => void;
  loadSharedWorkout: (inputStr: string) => boolean;
  createShareCode: (workout: Workout) => string;

  // Measurements
  addMeasurement: (measurement: Omit<BodyMeasurement, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteMeasurement: (id: string) => Promise<void>;
  
  // Weekly Planning
  updateWeeklyPlanDay: (dayOfWeek: number, updates: Partial<WeeklyPlanDay>) => Promise<void>;
  
  // Backup & Restore
  exportAllDataJSON: () => string;
  exportWorkoutsCSV: () => string;
  importAllDataJSON: (jsonString: string) => Promise<{ success: boolean; message: string }>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const currentUid = user ? user.uid : null;

  // Initialize weekly plan default structure (7 days: Lundi -> Dimanche)
  const getDefaultWeeklyPlan = (): WeeklyPlanDay[] => {
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    return [1, 2, 3, 4, 5, 6, 0].map((dayIndex, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + idx);
      const isoDate = d.toISOString().split('T')[0];

      let workoutName: string | undefined = undefined;
      let routineId: string | undefined = undefined;
      let activity: WeeklyPlanDay['activity'] = 'Repos';
      let finisherType: WeeklyPlanDay['finisherType'] = 'none';
      let finisher: string | undefined = undefined;
      let status: WeeklyPlanDay['status'] = 'rest';

      if (dayIndex === 1) { // Lundi
        activity = 'Séance Fessiers';
        workoutName = 'Booty Sculpt & Hypertrophie';
        routineId = 'routine-glutes-focus';
        finisherType = 'cardio';
        finisher = 'Marche inclinée Intermédiaire : Inclinaison 10 · Vitesse 4,5 · 30 min';
        status = 'planned';
      } else if (dayIndex === 3) { // Mercredi
        activity = 'Séance Dos';
        workoutName = 'Upper Body Glow & Dos en V';
        routineId = 'routine-upper-sculpt';
        finisherType = 'abs';
        finisher = 'Circuit Abdos Debout avec Charge (3 tours)';
        status = 'planned';
      } else if (dayIndex === 5) { // Vendredi
        activity = 'Séance Bas du corps';
        workoutName = 'Séance Bas du corps & Circuit Abdos';
        routineId = 'routine-abs-3x10-plank';
        finisherType = 'abs';
        finisher = 'Circuit Abdos 3x10 & Planche Lestée 60s';
        status = 'planned';
      }

      return sanitizeForFirestore({
        dayOfWeek: dayIndex,
        dayName: dayNames[dayIndex],
        date: isoDate,
        activity,
        activities: [activity],
        workoutName,
        routineId,
        finisherType,
        finisher,
        status,
      });
    });
  };

  const stripLeadingEmojis = (str?: string): string | undefined => {
    if (!str) return str;
    return str.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/gu, '').trim();
  };

  const normalizeWeeklyPlan = (existing?: WeeklyPlanDay[] | null): WeeklyPlanDay[] => {
    const base = getDefaultWeeklyPlan();
    if (!Array.isArray(existing) || existing.length === 0) {
      return base;
    }
    return base.map((defaultDay) => {
      const found = existing.find((item) => item && Number(item.dayOfWeek) === defaultDay.dayOfWeek);
      if (!found) return defaultDay;
      return {
        ...defaultDay,
        ...found,
        workoutName: stripLeadingEmojis(found.workoutName),
        dayOfWeek: defaultDay.dayOfWeek,
        dayName: defaultDay.dayName,
        date: found.date || defaultDay.date,
      };
    });
  };

  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [routines, setRoutines] = useState<Routine[]>(STARTER_ROUTINES);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlanDay[]>(() => getDefaultWeeklyPlan());
  const [exerciseSettings, setExerciseSettings] = useState<Record<string, string>>({});
  const [sharedTemplateWorkout, setSharedTemplateWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  // Load active workout from local storage & check ?share= URL link on mount
  useEffect(() => {
    const savedActive = localStorage.getItem(ACTIVE_WORKOUT_STORAGE_KEY);
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        const todayIso = new Date().toISOString().split('T')[0];
        if (
          parsed &&
          parsed.status === 'in_progress' &&
          Array.isArray(parsed.exercises) &&
          parsed.exercises.length > 0 &&
          parsed.date === todayIso
        ) {
          setActiveWorkout(parsed);
        } else {
          localStorage.removeItem(ACTIVE_WORKOUT_STORAGE_KEY);
        }
      } catch (err) {
        localStorage.removeItem(ACTIVE_WORKOUT_STORAGE_KEY);
      }
    }

    // Check URL for shared workout link (?share=...)
    try {
      const params = new URLSearchParams(window.location.search);
      const shareParam = params.get('share');
      if (shareParam) {
        const decoded = decodeURIComponent(escape(atob(shareParam.trim())));
        const parsed = JSON.parse(decoded);
        if (parsed && (parsed.exercises || parsed.name)) {
          setSharedTemplateWorkout(parsed);
        }
      }
    } catch {
      // Ignore invalid share param
    }
  }, []);

  // Sync / Load data whenever user/demo status changes
  useEffect(() => {
    if (!currentUid) {
      setWeeklyPlans((prev) => normalizeWeeklyPlan(prev));
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      setLoading(true);

      // Check local cache first for instant render
      const localCustom = localStorage.getItem(`${LOCAL_DATA_PREFIX}custom_${currentUid}`);
      if (localCustom) setCustomExercises(JSON.parse(localCustom));
      const localFavs = localStorage.getItem(`${LOCAL_DATA_PREFIX}favs_${currentUid}`);
      if (localFavs) setFavorites(JSON.parse(localFavs));
      const localRoutines = localStorage.getItem(`${LOCAL_DATA_PREFIX}routines_${currentUid}`);
      if (localRoutines) {
        try {
          const parsedRoutines = JSON.parse(localRoutines) as Routine[];
          const cleaned = parsedRoutines.map((r) => ({ ...r, name: stripLeadingEmojis(r.name) || r.name }));
          const merged = [...STARTER_ROUTINES];
          cleaned.forEach((r) => {
            if (!merged.some((existing) => existing.id === r.id)) {
              merged.push(r);
            }
          });
          setRoutines(merged);
        } catch {
          setRoutines(STARTER_ROUTINES);
        }
      } else {
        setRoutines(STARTER_ROUTINES);
      }
      const localWorkouts = localStorage.getItem(`${LOCAL_DATA_PREFIX}workouts_${currentUid}`);
      if (localWorkouts) {
        try {
          const parsedWorkouts = JSON.parse(localWorkouts) as Workout[];
          setWorkouts(parsedWorkouts.map((w) => ({ ...w, name: stripLeadingEmojis(w.name) || w.name })));
        } catch {
          setWorkouts([]);
        }
      }
      const localMeasurements = localStorage.getItem(`${LOCAL_DATA_PREFIX}measurements_${currentUid}`);
      if (localMeasurements) setMeasurements(JSON.parse(localMeasurements));
      const localPlans = localStorage.getItem(`${LOCAL_DATA_PREFIX}plans_${currentUid}`);
      if (localPlans) {
        try {
          setWeeklyPlans(normalizeWeeklyPlan(JSON.parse(localPlans)));
        } catch {
          setWeeklyPlans(getDefaultWeeklyPlan());
        }
      } else {
        setWeeklyPlans(getDefaultWeeklyPlan());
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch remote custom exercises
        const exCol = collection(db, 'users', currentUid, 'exercises');
        const exSnap = await getDocs(exCol);
        const remoteCustom: Exercise[] = [];
        exSnap.forEach((doc) => remoteCustom.push(doc.data() as Exercise));
        setCustomExercises(remoteCustom);
        localStorage.setItem(`${LOCAL_DATA_PREFIX}custom_${currentUid}`, JSON.stringify(remoteCustom));

        // Fetch favorites
        const favCol = collection(db, 'users', currentUid, 'favorites');
        const favSnap = await getDocs(favCol);
        const remoteFavs: string[] = [];
        favSnap.forEach((doc) => remoteFavs.push((doc.data() as { exerciseId: string }).exerciseId));
        setFavorites(remoteFavs);
        localStorage.setItem(`${LOCAL_DATA_PREFIX}favs_${currentUid}`, JSON.stringify(remoteFavs));

        // Fetch routines
        const routineCol = collection(db, 'users', currentUid, 'routines');
        const routineSnap = await getDocs(routineCol);
        const remoteRoutines: Routine[] = [...STARTER_ROUTINES];
        routineSnap.forEach((doc) => {
          const r = doc.data() as Routine;
          const cleanRoutine = { ...r, name: stripLeadingEmojis(r.name) || r.name };
          if (!remoteRoutines.some(existing => existing.id === cleanRoutine.id)) {
            remoteRoutines.push(cleanRoutine);
          }
        });
        setRoutines(remoteRoutines);
        localStorage.setItem(`${LOCAL_DATA_PREFIX}routines_${currentUid}`, JSON.stringify(remoteRoutines));

        // Fetch workouts
        const workoutsCol = collection(db, 'users', currentUid, 'workouts');
        const qWorkouts = query(workoutsCol, orderBy('date', 'desc'));
        const workoutSnap = await getDocs(qWorkouts);
        const remoteWorkouts: Workout[] = [];
        workoutSnap.forEach((doc) => remoteWorkouts.push(doc.data() as Workout));
        setWorkouts(remoteWorkouts);
        localStorage.setItem(`${LOCAL_DATA_PREFIX}workouts_${currentUid}`, JSON.stringify(remoteWorkouts));

        // Fetch measurements
        const measCol = collection(db, 'users', currentUid, 'measurements');
        const qMeas = query(measCol, orderBy('date', 'desc'));
        const measSnap = await getDocs(qMeas);
        const remoteMeas: BodyMeasurement[] = [];
        measSnap.forEach((doc) => remoteMeas.push(doc.data() as BodyMeasurement));
        setMeasurements(remoteMeas);
        localStorage.setItem(`${LOCAL_DATA_PREFIX}measurements_${currentUid}`, JSON.stringify(remoteMeas));

        // Fetch weekly plans
        const planCol = collection(db, 'users', currentUid, 'weekly_plans');
        const planSnap = await getDocs(planCol);
        if (!planSnap.empty) {
          const remotePlans: WeeklyPlanDay[] = [];
          planSnap.forEach((doc) => remotePlans.push(doc.data() as WeeklyPlanDay));
          const normalized = normalizeWeeklyPlan(remotePlans);
          setWeeklyPlans(normalized);
          localStorage.setItem(`${LOCAL_DATA_PREFIX}plans_${currentUid}`, JSON.stringify(normalized));
        } else {
          const defaultPlan = getDefaultWeeklyPlan();
          setWeeklyPlans(defaultPlan);
          localStorage.setItem(`${LOCAL_DATA_PREFIX}plans_${currentUid}`, JSON.stringify(defaultPlan));
          for (const day of defaultPlan) {
            await setDoc(doc(db, 'users', currentUid, 'weekly_plans', `day_${day.dayOfWeek}`), sanitizeForFirestore(day));
          }
        }
      } catch (err) {
        console.warn('Network offline or error loading remote documents; maintaining cached store', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUid, user]);

  const allExercises = [...DEFAULT_EXERCISES, ...customExercises];

  // Custom Exercise
  const addCustomExercise = async (ex: Omit<Exercise, 'id' | 'isCustom' | 'userId'>) => {
    if (!currentUid) return;
    const newEx: Exercise = {
      ...ex,
      id: `custom_${Date.now()}`,
      isCustom: true,
      userId: currentUid,
    };
    const updated = [newEx, ...customExercises];
    setCustomExercises(updated);
    localStorage.setItem(`${LOCAL_DATA_PREFIX}custom_${currentUid}`, JSON.stringify(updated));

    if (user) {
      try {
        await setDoc(doc(db, 'users', currentUid, 'exercises', newEx.id), sanitizeForFirestore(newEx));
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${currentUid}/exercises/${newEx.id}`);
      }
    }
  };

  const deleteCustomExercise = async (id: string) => {
    if (!currentUid) return;
    const updated = customExercises.filter((e) => e.id !== id);
    setCustomExercises(updated);
    localStorage.setItem(`${LOCAL_DATA_PREFIX}custom_${currentUid}`, JSON.stringify(updated));

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', currentUid, 'exercises', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUid}/exercises/${id}`);
      }
    }
  };

  // Favorites
  const toggleFavorite = async (exerciseId: string) => {
    if (!currentUid) return;
    const isFav = favorites.includes(exerciseId);
    const updated = isFav ? favorites.filter((id) => id !== exerciseId) : [...favorites, exerciseId];
    setFavorites(updated);
    localStorage.setItem(`${LOCAL_DATA_PREFIX}favs_${currentUid}`, JSON.stringify(updated));

    if (user) {
      const favRef = doc(db, 'users', currentUid, 'favorites', exerciseId);
      try {
        if (isFav) {
          await deleteDoc(favRef);
        } else {
          await setDoc(favRef, { exerciseId, createdAt: new Date().toISOString() });
        }
      } catch (err) {
        handleFirestoreError(err, isFav ? OperationType.DELETE : OperationType.WRITE, `users/${currentUid}/favorites/${exerciseId}`);
      }
    }
  };

  const isFavorite = (exerciseId: string) => favorites.includes(exerciseId);

  // Routines
  const createRoutine = async (routine: Omit<Routine, 'id'>): Promise<Routine> => {
    const id = `routine_${Date.now()}`;
    const newRoutine: Routine = {
      ...routine,
      id,
      userId: currentUid || 'guest',
      createdAt: new Date().toISOString(),
    };
    const updated = [newRoutine, ...routines];
    setRoutines(updated);
    if (currentUid) {
      localStorage.setItem(`${LOCAL_DATA_PREFIX}routines_${currentUid}`, JSON.stringify(updated));
      if (user) {
        try {
          await setDoc(doc(db, 'users', currentUid, 'routines', id), sanitizeForFirestore(newRoutine));
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUid}/routines/${id}`);
        }
      }
    }
    return newRoutine;
  };

  const updateRoutine = async (id: string, updates: Partial<Routine>) => {
    const updated = routines.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setRoutines(updated);
    if (currentUid) {
      localStorage.setItem(`${LOCAL_DATA_PREFIX}routines_${currentUid}`, JSON.stringify(updated));
      if (user) {
        try {
          await setDoc(doc(db, 'users', currentUid, 'routines', id), sanitizeForFirestore(updates), { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${currentUid}/routines/${id}`);
        }
      }
    }
  };

  const deleteRoutine = async (id: string) => {
    const updated = routines.filter((r) => r.id !== id);
    setRoutines(updated);
    if (currentUid) {
      localStorage.setItem(`${LOCAL_DATA_PREFIX}routines_${currentUid}`, JSON.stringify(updated));
      if (user) {
        try {
          await deleteDoc(doc(db, 'users', currentUid, 'routines', id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `users/${currentUid}/routines/${id}`);
        }
      }
    }
  };

  // Active Workout Management
  const startWorkout = (workoutData: { name: string; exercises: WorkoutExerciseItem[]; finisher?: string; notes?: string; rating?: number; finisherType?: 'none' | 'cardio' | 'abs' }): Workout => {
    const id = `workout_${Date.now()}`;
    const newWorkout: Workout = {
      id,
      userId: currentUid || 'guest',
      name: workoutData.name,
      date: new Date().toISOString().split('T')[0],
      status: 'in_progress',
      exercises: workoutData.exercises,
      finisher: workoutData.finisher,
      notes: workoutData.notes,
      rating: workoutData.rating ?? 5,
      startedAt: new Date().toISOString(),
    };
    setActiveWorkout(newWorkout);
    localStorage.setItem(ACTIVE_WORKOUT_STORAGE_KEY, JSON.stringify(newWorkout));
    return newWorkout;
  };

  const updateActiveWorkout = (updated: Workout) => {
    setActiveWorkout(updated);
    localStorage.setItem(ACTIVE_WORKOUT_STORAGE_KEY, JSON.stringify(updated));
  };

  const finishActiveWorkout = async (completedNotes?: string, finalFinisher?: string, rating?: number): Promise<Workout> => {
    if (!activeWorkout) throw new Error('Aucune séance active à terminer');
    
    // Calculate total duration in minutes
    let duration = 45;
    if (activeWorkout.startedAt) {
      const start = new Date(activeWorkout.startedAt).getTime();
      const end = Date.now();
      duration = Math.max(1, Math.round((end - start) / (1000 * 60)));
    }

    const finishedWorkout: Workout = {
      ...activeWorkout,
      status: 'completed',
      durationMinutes: duration,
      completedAt: new Date().toISOString(),
      notes: completedNotes !== undefined ? completedNotes : activeWorkout.notes,
      finisher: finalFinisher !== undefined ? finalFinisher : activeWorkout.finisher,
      rating: rating !== undefined ? rating : activeWorkout.rating,
    };

    // Save to historical workouts list
    const updatedList = [finishedWorkout, ...workouts];
    setWorkouts(updatedList);
    setActiveWorkout(null);
    localStorage.removeItem(ACTIVE_WORKOUT_STORAGE_KEY);

    // Also mark today in weekly plans as completed
    const todayDayOfWeek = new Date().getDay();
    const updatedWeekly = weeklyPlans.map((p) =>
      p.dayOfWeek === todayDayOfWeek && p.status !== 'rest'
        ? { ...p, status: 'completed' as const, workoutName: p.workoutName || finishedWorkout.name }
        : p
    );
    setWeeklyPlans(updatedWeekly);

    if (currentUid) {
      localStorage.setItem(`${LOCAL_DATA_PREFIX}workouts_${currentUid}`, JSON.stringify(updatedList));
      localStorage.setItem(`${LOCAL_DATA_PREFIX}weekly_${currentUid}`, JSON.stringify(updatedWeekly));
      if (user) {
        try {
          await setDoc(doc(db, 'users', currentUid, 'workouts', finishedWorkout.id), sanitizeForFirestore(finishedWorkout));
          const todayPlan = updatedWeekly.find((p) => p.dayOfWeek === todayDayOfWeek);
          if (todayPlan) {
            await setDoc(doc(db, 'users', currentUid, 'weekly_plans', `day_${todayDayOfWeek}`), sanitizeForFirestore(todayPlan));
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUid}/workouts/${finishedWorkout.id}`);
        }
      }
    }

    return finishedWorkout;
  };

  const cancelActiveWorkout = () => {
    setActiveWorkout(null);
    localStorage.removeItem(ACTIVE_WORKOUT_STORAGE_KEY);
  };

  const deleteWorkout = async (id: string) => {
    const updated = workouts.filter((w) => w.id !== id);
    setWorkouts(updated);
    if (currentUid) {
      localStorage.setItem(`${LOCAL_DATA_PREFIX}workouts_${currentUid}`, JSON.stringify(updated));
      if (user) {
        try {
          await deleteDoc(doc(db, 'users', currentUid, 'workouts', id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `users/${currentUid}/workouts/${id}`);
        }
      }
    }
  };

  const updateWorkout = async (id: string, updates: Partial<Workout>) => {
    const updated = workouts.map((w) => (w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w));
    setWorkouts(updated);
    if (currentUid) {
      localStorage.setItem(`${LOCAL_DATA_PREFIX}workouts_${currentUid}`, JSON.stringify(updated));
      if (user) {
        try {
          await setDoc(doc(db, 'users', currentUid, 'workouts', id), sanitizeForFirestore(updates), { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${currentUid}/workouts/${id}`);
        }
      }
    }
  };

  const updateExerciseSettings = async (exerciseId: string, settings: string) => {
    const updated = { ...exerciseSettings, [exerciseId]: settings };
    setExerciseSettings(updated);
    if (currentUid) {
      localStorage.setItem(`${LOCAL_DATA_PREFIX}settings_${currentUid}`, JSON.stringify(updated));
      if (user) {
        try {
          await setDoc(doc(db, 'users', currentUid, 'profile', 'exercise_settings'), updated, { merge: true });
        } catch {
          // offline
        }
      }
    }
  };

  const loadSharedWorkout = (inputStr: string): boolean => {
    try {
      let clean = inputStr.trim();
      // If user pasted a full URL or text containing ?share=...
      const shareMatch = clean.match(/[?&]share=([A-Za-z0-9+/=_-]+)/);
      if (shareMatch && shareMatch[1]) {
        clean = decodeURIComponent(shareMatch[1]);
      }
      let parsed: Workout;
      if (clean.startsWith('{')) {
        parsed = JSON.parse(clean);
      } else {
        const decoded = decodeURIComponent(escape(atob(clean)));
        parsed = JSON.parse(decoded);
      }
      if (parsed && (parsed.exercises || parsed.name)) {
        setSharedTemplateWorkout(parsed);
        return true;
      }
    } catch (e) {
      console.warn('Failed to parse shared workout', e);
    }
    return false;
  };

  const createShareCode = (workout: Workout): string => {
    try {
      const miniData = {
        name: workout.name,
        exercises: workout.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) => ({
            ...s,
            completed: false,
          })),
        })),
        finisher: workout.finisher,
        notes: workout.notes,
      };
      return btoa(unescape(encodeURIComponent(JSON.stringify(miniData))));
    } catch {
      return JSON.stringify(workout);
    }
  };

  const duplicateWorkoutAsNew = (workout: Workout): Workout => {
    // Clones the exercises structure but resets completion states for a new live session
    const clonedExercises: WorkoutExerciseItem[] = workout.exercises.map((ex, exIdx) => ({
      ...ex,
      id: `ex_${Date.now()}_${exIdx}`,
      sets: ex.sets.map((s, sIdx) => ({
        ...s,
        id: `s_${Date.now()}_${sIdx}`,
        completed: false,
        actualReps: undefined,
        actualWeight: s.actualWeight ?? s.targetWeight,
      })),
    }));

    return startWorkout({
      name: `${workout.name} (Copie)`,
      exercises: clonedExercises,
      finisher: workout.finisher,
      notes: workout.notes,
    });
  };

  // Performance Memory & PR Calculations
  const getPreviousPerformance = (exerciseId: string): { weight: number; reps: number; date: string } | null => {
    // Scan completed workouts from newest to oldest
    for (const w of workouts) {
      if (w.status !== 'completed') continue;
      const matchingEx = w.exercises.find((e) => e.exerciseId === exerciseId);
      if (matchingEx) {
        // Find best or last completed set with weight
        const validSets = matchingEx.sets.filter((s) => s.completed && (s.actualWeight !== undefined || s.targetWeight > 0));
        if (validSets.length > 0) {
          const lastSet = validSets[validSets.length - 1];
          return {
            weight: lastSet.actualWeight ?? lastSet.targetWeight,
            reps: lastSet.actualReps ?? lastSet.targetReps,
            date: w.date,
          };
        }
      }
    }
    return null;
  };

  const getPersonalRecords = (): Record<string, { maxWeight: number; reps: number; date: string }> => {
    const prs: Record<string, { maxWeight: number; reps: number; date: string }> = {};
    for (const w of workouts) {
      if (w.status !== 'completed') continue;
      for (const ex of w.exercises) {
        for (const s of ex.sets) {
          if (s.completed && s.actualWeight && s.actualWeight > 0) {
            const currentRecord = prs[ex.exerciseId];
            if (!currentRecord || s.actualWeight > currentRecord.maxWeight) {
              prs[ex.exerciseId] = {
                maxWeight: s.actualWeight,
                reps: s.actualReps || s.targetReps,
                date: w.date,
              };
            }
          }
        }
      }
    }
    return prs;
  };

  // Measurements
  const addMeasurement = async (meas: Omit<BodyMeasurement, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUid) return;
    const id = `meas_${Date.now()}`;
    const newMeas: BodyMeasurement = {
      ...meas,
      id,
      userId: currentUid,
      createdAt: new Date().toISOString(),
    };
    const updated = [newMeas, ...measurements].sort((a, b) => b.date.localeCompare(a.date));
    setMeasurements(updated);
    localStorage.setItem(`${LOCAL_DATA_PREFIX}measurements_${currentUid}`, JSON.stringify(updated));

    if (user) {
      try {
        await setDoc(doc(db, 'users', currentUid, 'measurements', id), sanitizeForFirestore(newMeas));
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${currentUid}/measurements/${id}`);
      }
    }
  };

  const deleteMeasurement = async (id: string) => {
    if (!currentUid) return;
    const updated = measurements.filter((m) => m.id !== id);
    setMeasurements(updated);
    localStorage.setItem(`${LOCAL_DATA_PREFIX}measurements_${currentUid}`, JSON.stringify(updated));

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', currentUid, 'measurements', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUid}/measurements/${id}`);
      }
    }
  };

  // Weekly Planning
  const updateWeeklyPlanDay = async (dayOfWeek: number, updates: Partial<WeeklyPlanDay>) => {
    const basePlans = normalizeWeeklyPlan(weeklyPlans);
    const updated = basePlans.map((d) =>
      d.dayOfWeek === dayOfWeek ? sanitizeForFirestore({ ...d, ...updates }) : d
    );
    setWeeklyPlans(updated);
    const targetDay = updated.find((d) => d.dayOfWeek === dayOfWeek);
    if (currentUid) {
      localStorage.setItem(`${LOCAL_DATA_PREFIX}plans_${currentUid}`, JSON.stringify(updated));
      if (user && targetDay) {
        try {
          await setDoc(
            doc(db, 'users', currentUid, 'weekly_plans', `day_${dayOfWeek}`),
            sanitizeForFirestore(targetDay)
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${currentUid}/weekly_plans/day_${dayOfWeek}`);
        }
      }
    }
  };

  // Export / Import
  const exportAllDataJSON = (): string => {
    const exportBundle = {
      app: 'Glow Up Lab',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      customExercises,
      favorites,
      routines,
      workouts,
      measurements,
      weeklyPlans,
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const exportWorkoutsCSV = (): string => {
    const headers = ['Date', 'Séance', 'Durée (min)', 'Exercice', 'Série', 'Charge (kg)', 'Répétitions', 'Complétée', 'Notes'];
    const rows: string[][] = [headers];

    workouts.forEach((w) => {
      w.exercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          rows.push([
            w.date,
            `"${w.name.replace(/"/g, '""')}"`,
            w.durationMinutes ? String(w.durationMinutes) : '',
            `"${ex.exerciseName.replace(/"/g, '""')}"`,
            String(s.setNumber),
            String(s.actualWeight ?? s.targetWeight),
            String(s.actualReps ?? s.targetReps),
            s.completed ? 'Oui' : 'Non',
            `"${(s.notes || w.notes || '').replace(/"/g, '""')}"`,
          ]);
        });
      });
    });

    return rows.map((r) => r.join(',')).join('\n');
  };

  const importAllDataJSON = async (jsonString: string): Promise<{ success: boolean; message: string }> => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Format de fichier invalide.' };
      }

      if (Array.isArray(data.customExercises)) setCustomExercises(data.customExercises);
      if (Array.isArray(data.favorites)) setFavorites(data.favorites);
      if (Array.isArray(data.routines)) setRoutines(data.routines);
      if (Array.isArray(data.workouts)) setWorkouts(data.workouts);
      if (Array.isArray(data.measurements)) setMeasurements(data.measurements);
      if (Array.isArray(data.weeklyPlans)) setWeeklyPlans(data.weeklyPlans);

      if (currentUid) {
        if (data.customExercises) localStorage.setItem(`${LOCAL_DATA_PREFIX}custom_${currentUid}`, JSON.stringify(data.customExercises));
        if (data.favorites) localStorage.setItem(`${LOCAL_DATA_PREFIX}favs_${currentUid}`, JSON.stringify(data.favorites));
        if (data.routines) localStorage.setItem(`${LOCAL_DATA_PREFIX}routines_${currentUid}`, JSON.stringify(data.routines));
        if (data.workouts) localStorage.setItem(`${LOCAL_DATA_PREFIX}workouts_${currentUid}`, JSON.stringify(data.workouts));
        if (data.measurements) localStorage.setItem(`${LOCAL_DATA_PREFIX}measurements_${currentUid}`, JSON.stringify(data.measurements));
        if (data.weeklyPlans) localStorage.setItem(`${LOCAL_DATA_PREFIX}plans_${currentUid}`, JSON.stringify(data.weeklyPlans));
      }

      return { success: true, message: 'Données restaurées avec succès !' };
    } catch (err) {
      return { success: false, message: 'Erreur lors de la lecture du fichier JSON.' };
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        allExercises,
        customExercises,
        favorites,
        routines,
        workouts,
        activeWorkout,
        measurements,
        weeklyPlans,
        loading,
        addCustomExercise,
        deleteCustomExercise,
        toggleFavorite,
        isFavorite,
        createRoutine,
        updateRoutine,
        deleteRoutine,
        startWorkout,
        updateActiveWorkout,
        finishActiveWorkout,
        cancelActiveWorkout,
        deleteWorkout,
        updateWorkout,
        duplicateWorkoutAsNew,
        getPreviousPerformance,
        getPersonalRecords,
        exerciseSettings,
        updateExerciseSettings,
        sharedTemplateWorkout,
        setSharedTemplateWorkout,
        loadSharedWorkout,
        createShareCode,
        addMeasurement,
        deleteMeasurement,
        updateWeeklyPlanDay,
        exportAllDataJSON,
        exportWorkoutsCSV,
        importAllDataJSON,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within a WorkoutProvider');
  return context;
};
