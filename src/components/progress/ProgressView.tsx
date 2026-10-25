import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Trash2,
  Edit3,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import {
  Workout,
  BodyMeasurement,
  MuscleCategory,
} from '../../types/fitness';
import { StreamlineIcon, getCategoryStreamlineIcon } from '../ui/StreamlineIcon';
import { BottomSheet } from '../ui/BottomSheet';

interface ProgressViewProps {
  onOpenMeasurements?: () => void;
}

type SuiviSubTab = 'overview' | 'loads' | 'body' | 'history';
type TimeRange = '7d' | '30d' | '90d' | 'all';
type LoadChartMetric = 'maxWeight' | 'est1RM' | 'volume';
type BodyMetricKey = 'weight' | 'waist' | 'hips' | 'thighs' | 'arms' | 'chest';

const BODY_METRICS: { key: BodyMetricKey; label: string; unit: string }[] = [
  { key: 'hips', label: 'Hanches / Fessiers', unit: 'cm' },
  { key: 'waist', label: 'Tour de taille', unit: 'cm' },
  { key: 'weight', label: 'Poids', unit: 'kg' },
  { key: 'thighs', label: 'Cuisses', unit: 'cm' },
  { key: 'arms', label: 'Bras', unit: 'cm' },
  { key: 'chest', label: 'Poitrine', unit: 'cm' },
];

export const ProgressView: React.FC<ProgressViewProps> = () => {
  const {
    workouts,
    getPersonalRecords,
    allExercises,
    duplicateWorkoutAsNew,
    updateWorkout,
    deleteWorkout,
    measurements,
    addMeasurement,
    deleteMeasurement,
  } = useWorkout();

  const [subTab, setSubTab] = useState<SuiviSubTab>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  // Loads & PRs state
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [loadMetric, setLoadMetric] = useState<LoadChartMetric>('maxWeight');
  const [prCategoryFilter, setPrCategoryFilter] = useState<MuscleCategory | 'all'>('all');

  // Body measurements state
  const [selectedBodyMetric, setSelectedBodyMetric] = useState<BodyMetricKey>('hips');
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);
  const [compareDateA, setCompareDateA] = useState<string>('');
  const [compareDateB, setCompareDateB] = useState<string>('');

  // New Measurement form state
  const [mDate, setMDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mWeight, setMWeight] = useState<string>('');
  const [mWaist, setMWaist] = useState<string>('');
  const [mHips, setMHips] = useState<string>('');
  const [mThighs, setMThighs] = useState<string>('');
  const [mArms, setMArms] = useState<string>('');
  const [mChest, setMChest] = useState<string>('');
  const [mNotes, setMNotes] = useState<string>('');

  // History state
  const [historySearch, setHistorySearch] = useState('');
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [shareFeedbackId, setShareFeedbackId] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const completedWorkouts = useMemo(
    () =>
      (workouts || [])
        .filter((w) => w && (w.status === 'completed' || !w.status))
        .sort(
          (a, b) =>
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        ),
    [workouts]
  );

  const filteredWorkoutsByRange = useMemo(() => {
    if (timeRange === 'all') return completedWorkouts;
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return completedWorkouts.filter(
      (w) => new Date(w.date || 0).getTime() >= cutoff
    );
  }, [completedWorkouts, timeRange]);

  // Convert Record<string, { maxWeight, reps, date }> from getPersonalRecords() into a safe array
  const personalRecords = useMemo(() => {
    const rawRecords = getPersonalRecords ? getPersonalRecords() : {};
    if (!rawRecords || typeof rawRecords !== 'object') return [];

    // Handle both Record<string, ...> and potential Array shapes safely
    if (Array.isArray(rawRecords)) {
      return rawRecords.map((item) => {
        const ref = (allExercises || []).find((e) => e.id === item.exerciseId);
        return {
          exerciseId: item.exerciseId || '',
          exerciseName: item.exerciseName || ref?.name || 'Exercice',
          category: (ref?.category || 'lower-body') as MuscleCategory,
          maxWeight: Number(item.maxWeight) || 0,
          repsAtMax: Number(item.repsAtMax ?? item.reps) || 0,
          date: item.date || new Date().toISOString(),
        };
      });
    }

    return Object.entries(rawRecords)
      .map(([exerciseId, data]) => {
        const ref = (allExercises || []).find((e) => e.id === exerciseId);
        // Also search workout history for exerciseName if custom/missing
        let fallbackName = ref?.name || '';
        if (!fallbackName) {
          for (const w of completedWorkouts) {
            const foundEx = (w.exercises || []).find(
              (ex) => ex.exerciseId === exerciseId
            );
            if (foundEx?.exerciseName) {
              fallbackName = foundEx.exerciseName;
              break;
            }
          }
        }
        return {
          exerciseId,
          exerciseName: fallbackName || 'Exercice',
          category: (ref?.category || 'lower-body') as MuscleCategory,
          maxWeight: Number(data?.maxWeight) || 0,
          repsAtMax: Number(data?.reps) || 0,
          date: data?.date || new Date().toISOString(),
        };
      })
      .filter((pr) => pr.maxWeight > 0)
      .sort((a, b) => b.maxWeight - a.maxWeight);
  }, [getPersonalRecords, allExercises, completedWorkouts]);

  // Global KPIs for selected time range
  const overviewStats = useMemo(() => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    let totalMinutes = 0;
    let ratingSum = 0;
    let ratedCount = 0;

    const categorySets: Record<MuscleCategory, number> = {
      'lower-body': 0,
      back: 0,
      arms: 0,
      abs: 0,
      cardio: 0,
    };

    filteredWorkoutsByRange.forEach((w) => {
      totalMinutes += w.durationMinutes || 45;
      if (w.rating && w.rating > 0) {
        ratingSum += w.rating;
        ratedCount += 1;
      }
      if (w.finisher && typeof w.finisher === 'string' && w.finisher.trim()) {
        const finLower = w.finisher.toLowerCase();
        if (finLower.includes('abdo') || finLower.includes('gainage') || finLower.includes('planche')) {
          categorySets.abs += 3;
        } else {
          categorySets.cardio += 3;
        }
      }
      (w.exercises || []).forEach((ex) => {
        const refEx = (allExercises || []).find((e) => e.id === ex.exerciseId);
        const cat: MuscleCategory = ex.category || refEx?.category || 'lower-body';
        const setsArr = Array.isArray(ex.sets) ? ex.sets : [];
        const validSets = setsArr.filter((s) => s.completed);
        const setsToUse = validSets.length > 0 ? validSets : setsArr;

        setsToUse.forEach((s) => {
          const weight = Number(s.actualWeight ?? s.targetWeight ?? 0);
          const reps = Number(s.actualReps ?? s.targetReps ?? 0);
          totalVolume += weight * reps;
          totalSets += 1;
          totalReps += reps;
          categorySets[cat] = (categorySets[cat] || 0) + 1;
        });
      });
    });

    const totalCatSets =
      Object.values(categorySets).reduce((acc, v) => acc + v, 0) || 1;

    return {
      sessionsCount: filteredWorkoutsByRange.length,
      totalVolume,
      totalSets,
      totalReps,
      totalMinutes,
      avgRating: ratedCount > 0 ? (ratingSum / ratedCount).toFixed(1) : '—',
      categoryBreakdown: [
        {
          category: 'lower-body' as MuscleCategory,
          label: 'Bas du corps & Fessiers',
          sets: categorySets['lower-body'],
          pct: Math.round((categorySets['lower-body'] / totalCatSets) * 100),
        },
        {
          category: 'back' as MuscleCategory,
          label: 'Dos & Posture',
          sets: categorySets.back,
          pct: Math.round((categorySets.back / totalCatSets) * 100),
        },
        {
          category: 'arms' as MuscleCategory,
          label: 'Bras & Épaules',
          sets: categorySets.arms,
          pct: Math.round((categorySets.arms / totalCatSets) * 100),
        },
        {
          category: 'abs' as MuscleCategory,
          label: 'Abdos & Gainage',
          sets: categorySets.abs,
          pct: Math.round((categorySets.abs / totalCatSets) * 100),
        },
        {
          category: 'cardio' as MuscleCategory,
          label: 'Cardio & Finisher',
          sets: categorySets.cardio,
          pct: Math.round((categorySets.cardio / totalCatSets) * 100),
        },
      ],
    };
  }, [filteredWorkoutsByRange, allExercises]);

  // 28-day consistency calendar
  const last28Days = useMemo(() => {
    const workoutDates = new Set(
      completedWorkouts
        .map((w) => (typeof w.date === 'string' ? w.date.split('T')[0] : ''))
        .filter(Boolean)
    );
    const days: { dateStr: string; dayNum: number; hasWorkout: boolean; isToday: boolean }[] = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      days.push({
        dateStr: iso,
        dayNum: d.getDate(),
        hasWorkout: workoutDates.has(iso),
        isToday: i === 0,
      });
    }
    return days;
  }, [completedWorkouts]);

  // Practiced exercises list
  const practicedExercises = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number; category: MuscleCategory }>();
    completedWorkouts.forEach((w) => {
      (w.exercises || []).forEach((ex) => {
        if (!ex?.exerciseId) return;
        const ref = (allExercises || []).find((e) => e.id === ex.exerciseId);
        const existing = map.get(ex.exerciseId);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(ex.exerciseId, {
            id: ex.exerciseId,
            name: ex.exerciseName || ref?.name || 'Exercice',
            count: 1,
            category: ex.category || ref?.category || 'lower-body',
          });
        }
      });
    });
    const arr = Array.from(map.values()).sort((a, b) => b.count - a.count);
    if (arr.length === 0) {
      return (allExercises || []).slice(0, 12).map((e) => ({
        id: e.id,
        name: e.name,
        count: 0,
        category: e.category,
      }));
    }
    return arr;
  }, [completedWorkouts, allExercises]);

  const activeExerciseId = selectedExerciseId || practicedExercises[0]?.id || '';

  // Progression points for selected exercise (maxWeight, est1RM, volume)
  const exerciseHistoryPoints = useMemo(() => {
    if (!activeExerciseId) return [];
    const points: {
      date: string;
      maxWeight: number;
      bestReps: number;
      est1RM: number;
      volume: number;
    }[] = [];

    const chronological = [...completedWorkouts].reverse();
    chronological.forEach((w) => {
      const found = (w.exercises || []).find((e) => e.exerciseId === activeExerciseId);
      if (found && Array.isArray(found.sets) && found.sets.length > 0) {
        let maxW = 0;
        let bestR = 0;
        let max1RM = 0;
        let vol = 0;

        found.sets.forEach((s) => {
          const weight = Number(s.actualWeight ?? s.targetWeight ?? 0);
          const reps = Number(s.actualReps ?? s.targetReps ?? 0);
          vol += weight * reps;
          const epley1RM = weight > 0 ? Math.round(weight * (1 + reps / 30)) : 0;
          if (weight > maxW || (weight === maxW && reps > bestR)) {
            maxW = weight;
            bestR = reps;
          }
          if (epley1RM > max1RM) {
            max1RM = epley1RM;
          }
        });

        if (maxW > 0 || vol > 0) {
          points.push({
            date: w.date || new Date().toISOString(),
            maxWeight: maxW,
            bestReps: bestR,
            est1RM: max1RM,
            volume: vol,
          });
        }
      }
    });

    return points;
  }, [activeExerciseId, completedWorkouts]);

  // Sorted measurements chronological
  const chronologicalMeasurements = useMemo(
    () =>
      [...(measurements || [])].sort(
        (a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
      ),
    [measurements]
  );

  const latestMeasurement =
    chronologicalMeasurements.length > 0
      ? chronologicalMeasurements[chronologicalMeasurements.length - 1]
      : null;
  const firstMeasurement =
    chronologicalMeasurements.length > 0 ? chronologicalMeasurements[0] : null;

  // Waist-to-hip ratio (Indice Sablier)
  const waistToHipRatio = useMemo(() => {
    if (!latestMeasurement?.waist || !latestMeasurement?.hips) return null;
    if (latestMeasurement.hips <= 0) return null;
    return (latestMeasurement.waist / latestMeasurement.hips).toFixed(2);
  }, [latestMeasurement]);

  const bodyChartPoints = useMemo(() => {
    return chronologicalMeasurements
      .filter(
        (m) =>
          typeof m[selectedBodyMetric] === 'number' &&
          (m[selectedBodyMetric] as number) > 0
      )
      .map((m) => ({
        date: m.date,
        value: m[selectedBodyMetric] as number,
      }));
  }, [chronologicalMeasurements, selectedBodyMetric]);

  // Smooth SVG Bézier path builder
  const buildSmoothSvgPath = (
    values: number[],
    width = 360,
    height = 130,
    padX = 20,
    padY = 20
  ) => {
    if (values.length === 0) return { linePath: '', areaPath: '', coords: [] };
    if (values.length === 1) {
      const cx = width / 2;
      const cy = height / 2;
      return {
        linePath: `M ${padX} ${cy} L ${width - padX} ${cy}`,
        areaPath: `M ${padX} ${cy} L ${width - padX} ${cy} L ${width - padX} ${height} L ${padX} ${height} Z`,
        coords: [{ x: cx, y: cy, val: values[0] }],
      };
    }

    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const range = maxV - minV || 1;

    const coords = values.map((val, idx) => {
      const x = padX + (idx / (values.length - 1)) * (width - padX * 2);
      const y = height - padY - ((val - minV) / range) * (height - padY * 2);
      return { x, y, val };
    });

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const ctrlX1 = curr.x + (next.x - curr.x) / 2;
      const ctrlY1 = curr.y;
      const ctrlX2 = curr.x + (next.x - curr.x) / 2;
      const ctrlY2 = next.y;
      d += ` C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${next.x} ${next.y}`;
    }

    const areaPath = `${d} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;
    return { linePath: d, areaPath, coords };
  };

  const handleOpenAddMeasurement = () => {
    setMDate(new Date().toISOString().split('T')[0]);
    setMWeight(latestMeasurement?.weight ? String(latestMeasurement.weight) : '');
    setMWaist(latestMeasurement?.waist ? String(latestMeasurement.waist) : '');
    setMHips(latestMeasurement?.hips ? String(latestMeasurement.hips) : '');
    setMThighs(latestMeasurement?.thighs ? String(latestMeasurement.thighs) : '');
    setMArms(latestMeasurement?.arms ? String(latestMeasurement.arms) : '');
    setMChest(latestMeasurement?.chest ? String(latestMeasurement.chest) : '');
    setMNotes('');
    setIsAddMeasurementOpen(true);
  };

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<BodyMeasurement, 'id' | 'userId' | 'createdAt'> = {
      date: mDate,
      weight: mWeight ? Number(mWeight) : undefined,
      waist: mWaist ? Number(mWaist) : undefined,
      hips: mHips ? Number(mHips) : undefined,
      thighs: mThighs ? Number(mThighs) : undefined,
      arms: mArms ? Number(mArms) : undefined,
      chest: mChest ? Number(mChest) : undefined,
      notes: mNotes.trim() || undefined,
      unit: 'metric',
    };
    await addMeasurement(payload);
    setIsAddMeasurementOpen(false);
  };

  const handleShareWorkout = async (workout: Workout) => {
    const lines = [
      `Glow Up Lab — ${workout.name} (${new Date(workout.date).toLocaleDateString('fr-FR')})`,
      ...(workout.exercises || []).map((ex) => {
        const setsArr = Array.isArray(ex.sets) ? ex.sets : [];
        const bestSet = setsArr.reduce((best, s) => {
          const w = Number(s.actualWeight ?? s.targetWeight ?? 0);
          return w > best ? w : best;
        }, 0);
        return `• ${ex.exerciseName} : ${setsArr.length} séries (Max ${bestSet} kg)`;
      }),
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setShareFeedbackId(workout.id);
      setTimeout(() => setShareFeedbackId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleSaveEditedWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkout) return;
    await updateWorkout(editingWorkout.id, {
      name: editingWorkout.name,
      exercises: editingWorkout.exercises,
      notes: editingWorkout.notes,
      finisher: editingWorkout.finisher,
    });
    setEditingWorkout(null);
  };

  // Filtered PRs
  const filteredPRs = useMemo(() => {
    return personalRecords.filter((pr) => {
      if (prCategoryFilter === 'all') return true;
      return pr.category === prCategoryFilter;
    });
  }, [personalRecords, prCategoryFilter]);

  // Filtered workouts for Journal
  const filteredJournalWorkouts = useMemo(() => {
    if (!historySearch.trim()) return completedWorkouts;
    const q = historySearch.toLowerCase();
    return completedWorkouts.filter(
      (w) =>
        (w.name || '').toLowerCase().includes(q) ||
        (w.exercises || []).some((ex) =>
          (ex.exerciseName || '').toLowerCase().includes(q)
        ) ||
        (w.notes && w.notes.toLowerCase().includes(q))
    );
  }, [completedWorkouts, historySearch]);

  // Comparison measurements
  const compA = useMemo(() => {
    if (compareDateA) {
      return (
        chronologicalMeasurements.find((m) => m.id === compareDateA) ||
        firstMeasurement
      );
    }
    return firstMeasurement;
  }, [compareDateA, chronologicalMeasurements, firstMeasurement]);

  const compB = useMemo(() => {
    if (compareDateB) {
      return (
        chronologicalMeasurements.find((m) => m.id === compareDateB) ||
        latestMeasurement
      );
    }
    return latestMeasurement;
  }, [compareDateB, chronologicalMeasurements, latestMeasurement]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header Title + Quick Add Measurement CTA */}
      <div className="flex items-end justify-between gap-3 pt-1">
        <div>
          <span className="font-compact text-[11px] font-semibold uppercase tracking-wider text-[#831843] block">
            Analyses & Évolution
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-[#2B091C] mt-0.5">
            Mon <span className="font-serif-ny italic font-normal text-[#831843]">suivi</span>
          </h1>
        </div>

        <button
          onClick={handleOpenAddMeasurement}
          className="px-4 py-2.5 rounded-full bg-[#831843] hover:bg-[#3B0726] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouvelle mesure</span>
        </button>
      </div>

      {/* 4 Sub-Tabs Segmented Control */}
      <div className="p-1 rounded-2xl bg-[#F6EDF2] grid grid-cols-4 gap-1">
        {(
          [
            { id: 'overview', label: 'Bilan' },
            { id: 'loads', label: 'Charges & PRs' },
            { id: 'body', label: 'Silhouette' },
            { id: 'history', label: 'Journal' },
          ] as { id: SuiviSubTab; label: string }[]
        ).map((tab) => {
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all truncate ${
                active
                  ? 'bg-white text-[#831843] shadow-2xs font-bold'
                  : 'text-[#7A616F] hover:text-[#2B091C]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: BILAN & RÉGULARITÉ (OVERVIEW)
      ===================================================================== */}
      {subTab === 'overview' && (
        <div className="space-y-4">
          {/* Period Filter Pills */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#7A616F]">Période analysée</span>
            <div className="inline-flex p-1 rounded-full bg-[#F6EDF2] gap-1">
              {(
                [
                  { id: '7d', label: '7j' },
                  { id: '30d', label: '30j' },
                  { id: '90d', label: '3 mois' },
                  { id: 'all', label: 'Tout' },
                ] as { id: TimeRange; label: string }[]
              ).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setTimeRange(r.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    timeRange === r.id
                      ? 'bg-[#831843] text-white'
                      : 'text-[#7A616F] hover:text-[#2B091C]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-4 rounded-[24px] bg-[#F6EDF2] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-compact text-[11px] font-semibold uppercase tracking-wider text-[#7A616F]">
                  Séances
                </span>
                <StreamlineIcon name="weightlifter" className="w-4 h-4 text-[#831843]" />
              </div>
              <p className="font-mono text-2xl font-bold text-[#2B091C] tabular-nums">
                {overviewStats.sessionsCount}
              </p>
              <span className="text-[11px] text-[#7A616F] block">
                Note moy. : {overviewStats.avgRating}/5
              </span>
            </div>

            <div className="p-4 rounded-[24px] bg-[#F6EDF2] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-compact text-[11px] font-semibold uppercase tracking-wider text-[#7A616F]">
                  Volume total
                </span>
                <StreamlineIcon name="kettlebell" className="w-4 h-4 text-[#831843]" />
              </div>
              <p className="font-mono text-2xl font-bold text-[#831843] tabular-nums">
                {overviewStats.totalVolume >= 1000
                  ? `${(overviewStats.totalVolume / 1000).toFixed(1)}t`
                  : `${overviewStats.totalVolume}kg`}
              </p>
              <span className="text-[11px] text-[#7A616F] block">
                {overviewStats.totalVolume.toLocaleString('fr-FR')} kg soulevés
              </span>
            </div>

            <div className="p-4 rounded-[24px] bg-[#F6EDF2] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-compact text-[11px] font-semibold uppercase tracking-wider text-[#7A616F]">
                  Séries
                </span>
                <StreamlineIcon name="dumbbell" className="w-4 h-4 text-[#831843]" />
              </div>
              <p className="font-mono text-2xl font-bold text-[#2B091C] tabular-nums">
                {overviewStats.totalSets}
              </p>
              <span className="text-[11px] text-[#7A616F] block">
                {overviewStats.totalReps} répétitions
              </span>
            </div>

            <div className="p-4 rounded-[24px] bg-[#F6EDF2] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-compact text-[11px] font-semibold uppercase tracking-wider text-[#7A616F]">
                  Durée cumulée
                </span>
                <StreamlineIcon name="stopwatch" className="w-4 h-4 text-[#831843]" />
              </div>
              <p className="font-mono text-2xl font-bold text-[#2B091C] tabular-nums">
                {overviewStats.totalMinutes >= 60
                  ? `${Math.floor(overviewStats.totalMinutes / 60)}h${
                      overviewStats.totalMinutes % 60 > 0
                        ? String(overviewStats.totalMinutes % 60).padStart(2, '0')
                        : ''
                    }`
                  : `${overviewStats.totalMinutes}m`}
              </p>
              <span className="text-[11px] text-[#7A616F] block">
                {personalRecords.length} records établis
              </span>
            </div>
          </div>

          {/* 28-Day Consistency Heatmap */}
          <div className="p-5 rounded-[28px] bg-[#F6EDF2] space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-compact text-[10px] font-semibold uppercase tracking-wider text-[#831843] block">
                  Assiduité sur 4 semaines
                </span>
                <h2 className="font-display font-bold text-base text-[#2B091C]">
                  Calendrier de régularité (28 jours)
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-white text-[#831843] font-mono text-xs font-bold">
                {last28Days.filter((d) => d.hasWorkout).length} j actifs
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {last28Days.map((d) => (
                <div
                  key={d.dateStr}
                  title={d.dateStr}
                  className={`h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center text-xs font-mono font-bold transition-all ${
                    d.hasWorkout
                      ? 'bg-[#831843] text-white shadow-2xs'
                      : d.isToday
                      ? 'bg-[#FCE7F3] text-[#831843] border border-[#F472B6]'
                      : 'bg-white/80 text-[#7A616F]'
                  }`}
                >
                  <span>{d.dayNum}</span>
                  {d.hasWorkout && (
                    <span className="w-1 h-1 rounded-full bg-[#FBCFE8] mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Muscle Zone Breakdown */}
          <div className="p-5 rounded-[28px] bg-[#F6EDF2] space-y-3.5">
            <div>
              <span className="font-compact text-[10px] font-semibold uppercase tracking-wider text-[#831843] block">
                Équilibre d’entraînement
              </span>
              <h2 className="font-display font-bold text-base text-[#2B091C]">
                Répartition par zone musculaire
              </h2>
            </div>

            <div className="space-y-3">
              {overviewStats.categoryBreakdown.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2B091C] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-white text-[#831843] flex items-center justify-center">
                        <StreamlineIcon
                          name={getCategoryStreamlineIcon(item.category)}
                          className="w-3.5 h-3.5"
                        />
                      </span>
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono font-bold text-[#831843]">
                      {item.sets} séries ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#831843] to-[#EC4899] transition-all duration-300"
                      style={{ width: `${Math.max(item.pct, item.sets > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: CHARGES & RECORDS PERSONNELS (LOADS & PRs)
      ===================================================================== */}
      {subTab === 'loads' && (
        <div className="space-y-5">
          {/* Interactive Exercise Progression Curve Card */}
          <div className="p-5 rounded-[28px] bg-grainy-pink space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span className="font-compact text-[10px] font-semibold uppercase tracking-wider text-[#831843] block">
                  Courbe de surcharge progressive
                </span>
                <h2 className="font-display font-bold text-lg text-[#2B091C]">
                  Évolution par exercice
                </h2>
              </div>

              <select
                value={activeExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-full bg-white text-[#2B091C] font-semibold focus:outline-hidden shadow-2xs max-w-full sm:max-w-[230px] truncate"
              >
                {practicedExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} {ex.count > 0 ? `(${ex.count} séances)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Selector Pills: Charge Max | 1RM Estimé | Volume */}
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'maxWeight', label: 'Charge Max (kg)' },
                  { id: 'est1RM', label: '1RM Estimé (kg)' },
                  { id: 'volume', label: 'Volume Séance (kg)' },
                ] as { id: LoadChartMetric; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setLoadMetric(m.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    loadMetric === m.id
                      ? 'bg-[#831843] text-white shadow-2xs'
                      : 'bg-white/80 text-[#7A616F] hover:bg-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {exerciseHistoryPoints.length > 0 ? (
              (() => {
                const values = exerciseHistoryPoints.map((p) => p[loadMetric]);
                const firstVal = values[0];
                const lastVal = values[values.length - 1];
                const bestVal = Math.max(...values);
                const diff = lastVal - firstVal;
                const { linePath, areaPath, coords } = buildSmoothSvgPath(values);

                return (
                  <div className="space-y-3">
                    {/* Quick Summary Numbers */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-2xl bg-white/85">
                        <span className="text-[10px] font-semibold text-[#7A616F] block">
                          Dernière séance
                        </span>
                        <span className="font-mono text-lg font-bold text-[#2B091C]">
                          {lastVal} kg
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/85">
                        <span className="text-[10px] font-semibold text-[#7A616F] block">
                          Record absolu
                        </span>
                        <span className="font-mono text-lg font-bold text-[#831843]">
                          {bestVal} kg
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/85">
                        <span className="text-[10px] font-semibold text-[#7A616F] block">
                          Progression
                        </span>
                        <span className="font-mono text-lg font-bold text-[#EC4899]">
                          {diff >= 0 ? `+${diff}` : diff} kg
                        </span>
                      </div>
                    </div>

                    {/* Smooth Bézier SVG */}
                    <div className="w-full overflow-hidden rounded-2xl bg-white/75 p-3">
                      <svg viewBox="0 0 360 130" className="w-full h-32 overflow-visible">
                        <defs>
                          <linearGradient id="loadFillGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d={areaPath} fill="url(#loadFillGrad)" />
                        <path
                          d={linePath}
                          fill="none"
                          stroke="#831843"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {coords.map((pt, i) => (
                          <g key={i}>
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="4.5"
                              fill="#FFFFFF"
                              stroke="#831843"
                              strokeWidth="2.5"
                            />
                            <text
                              x={pt.x}
                              y={pt.y - 9}
                              textAnchor="middle"
                              className="text-[10px] font-mono font-bold fill-[#2B091C]"
                            >
                              {pt.val}
                            </text>
                          </g>
                        ))}
                      </svg>
                      <div className="flex justify-between text-[10px] font-semibold text-[#7A616F] px-1 mt-1">
                        <span>
                          {new Date(exerciseHistoryPoints[0].date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                        <span>{exerciseHistoryPoints.length} séance(s) enregistrée(s)</span>
                        <span>
                          {new Date(
                            exerciseHistoryPoints[exerciseHistoryPoints.length - 1].date
                          ).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="py-8 text-center text-xs text-[#7A616F] bg-white/60 rounded-2xl">
                Valide une séance contenant cet exercice pour afficher ta courbe de progression.
              </div>
            )}
          </div>

          {/* All Personal Records (PRs) Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <h2 className="font-display font-bold text-base text-[#2B091C] flex items-center gap-2">
                <StreamlineIcon name="trophy" className="w-4 h-4 text-[#831843]" />
                <span>Tous mes Records Personnels ({filteredPRs.length})</span>
              </h2>

              <div className="flex flex-wrap gap-1">
                {(
                  [
                    { id: 'all', label: 'Tous' },
                    { id: 'lower-body', label: 'Bas du corps' },
                    { id: 'back', label: 'Dos' },
                    { id: 'arms', label: 'Bras' },
                  ] as { id: MuscleCategory | 'all'; label: string }[]
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setPrCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      prCategoryFilter === cat.id
                        ? 'bg-[#831843] text-white'
                        : 'bg-[#F6EDF2] text-[#7A616F] hover:text-[#2B091C]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredPRs.length === 0 ? (
              <div className="p-6 rounded-[24px] bg-[#F6EDF2] text-center text-xs text-[#7A616F]">
                Aucun record enregistré dans cette catégorie pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredPRs.map((pr) => {
                  const est1RM = Math.round(pr.maxWeight * (1 + pr.repsAtMax / 30));
                  return (
                    <button
                      key={pr.exerciseId}
                      onClick={() => setSelectedExerciseId(pr.exerciseId)}
                      className={`p-4 rounded-[24px] text-left transition-all flex items-center justify-between gap-3 ${
                        activeExerciseId === pr.exerciseId
                          ? 'bg-[#FCE7F3] border border-[#F472B6]'
                          : 'bg-[#F6EDF2] hover:bg-[#F1E2EA]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-display font-bold text-sm text-[#2B091C] block truncate">
                          {pr.exerciseName}
                        </span>
                        <span className="text-[11px] text-[#7A616F] block mt-0.5">
                          1RM théorique : <strong className="font-mono text-[#831843]">{est1RM} kg</strong> ·{' '}
                          {new Date(pr.date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-3 py-1 rounded-full bg-white text-[#831843] font-mono font-bold text-xs block shadow-2xs">
                          {pr.maxWeight} kg × {pr.repsAtMax}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: SILHOUETTE & MENSURATIONS (BODY)
      ===================================================================== */}
      {subTab === 'body' && (
        <div className="space-y-5">
          {/* Top KPI & Ratio Sablier */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-4 rounded-[24px] bg-[#F6EDF2] space-y-1">
              <span className="font-compact text-[10px] font-semibold uppercase tracking-wider text-[#831843] block">
                Indice Sablier (Taille/Hanches)
              </span>
              <p className="font-mono text-2xl font-bold text-[#2B091C]">
                {waistToHipRatio || '—'}
              </p>
              <span className="text-[11px] text-[#7A616F] block">
                {waistToHipRatio
                  ? 'Harmonie taille / fessiers'
                  : 'Renseigne taille + hanches'}
              </span>
            </div>

            <div className="p-4 rounded-[24px] bg-[#F6EDF2] space-y-1">
              <span className="font-compact text-[10px] font-semibold uppercase tracking-wider text-[#831843] block">
                Hanches / Fessiers
              </span>
              <p className="font-mono text-2xl font-bold text-[#831843]">
                {latestMeasurement?.hips ? `${latestMeasurement.hips} cm` : '—'}
              </p>
              <span className="text-[11px] text-[#7A616F] block">
                {firstMeasurement?.hips && latestMeasurement?.hips
                  ? `${
                      latestMeasurement.hips - firstMeasurement.hips >= 0 ? '+' : ''
                    }${(latestMeasurement.hips - firstMeasurement.hips).toFixed(1)} cm depuis le début`
                  : 'Dernière mesure'}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-[24px] bg-[#F6EDF2] space-y-1">
              <span className="font-compact text-[10px] font-semibold uppercase tracking-wider text-[#831843] block">
                Tour de taille
              </span>
              <p className="font-mono text-2xl font-bold text-[#2B091C]">
                {latestMeasurement?.waist ? `${latestMeasurement.waist} cm` : '—'}
              </p>
              <span className="text-[11px] text-[#7A616F] block">
                {firstMeasurement?.waist && latestMeasurement?.waist
                  ? `${
                      latestMeasurement.waist - firstMeasurement.waist >= 0 ? '+' : ''
                    }${(latestMeasurement.waist - firstMeasurement.waist).toFixed(1)} cm depuis le début`
                  : 'Dernière mesure'}
              </span>
            </div>
          </div>

          {/* Interactive Body Metric Curve */}
          <div className="p-5 rounded-[28px] bg-grainy-pink space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-compact text-[10px] font-semibold uppercase tracking-wider text-[#831843] block">
                  Suivi morphologique
                </span>
                <h2 className="font-display font-bold text-lg text-[#2B091C]">
                  Courbe de mes mensurations
                </h2>
              </div>
              <button
                onClick={handleOpenAddMeasurement}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#831843] text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une mesure</span>
              </button>
            </div>

            {/* Body Metric Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {BODY_METRICS.map((bm) => (
                <button
                  key={bm.key}
                  onClick={() => setSelectedBodyMetric(bm.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedBodyMetric === bm.key
                      ? 'bg-[#831843] text-white shadow-2xs'
                      : 'bg-white/85 text-[#7A616F] hover:bg-white'
                  }`}
                >
                  {bm.label}
                </button>
              ))}
            </div>

            {bodyChartPoints.length > 0 ? (
              (() => {
                const values = bodyChartPoints.map((p) => p.value);
                const unit =
                  BODY_METRICS.find((b) => b.key === selectedBodyMetric)?.unit || 'cm';
                const { linePath, areaPath, coords } = buildSmoothSvgPath(values);

                return (
                  <div className="w-full overflow-hidden rounded-2xl bg-white/80 p-3">
                    <svg viewBox="0 0 360 130" className="w-full h-32 overflow-visible">
                      <defs>
                        <linearGradient id="bodyFillGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#831843" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#831843" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill="url(#bodyFillGrad)" />
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#831843"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {coords.map((pt, i) => (
                        <g key={i}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="4.5"
                            fill="#FFFFFF"
                            stroke="#EC4899"
                            strokeWidth="2.5"
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 9}
                            textAnchor="middle"
                            className="text-[10px] font-mono font-bold fill-[#2B091C]"
                          >
                            {pt.val}
                            {unit}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                );
              })()
            ) : (
              <div className="py-8 text-center text-xs text-[#7A616F] bg-white/60 rounded-2xl">
                Aucune donnée pour cette mesure. Clique sur « Nouvelle mesure » pour commencer.
              </div>
            )}
          </div>

          {/* Date-to-Date Comparator */}
          {chronologicalMeasurements.length >= 2 && compA && compB && (
            <div className="p-5 rounded-[28px] bg-[#F6EDF2] space-y-3.5">
              <div>
                <span className="font-compact text-[10px] font-semibold uppercase tracking-wider text-[#831843] block">
                  Avant / Après
                </span>
                <h3 className="font-display font-bold text-base text-[#2B091C]">
                  Comparateur entre deux dates
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold text-[#7A616F] uppercase block mb-1">
                    Date de départ
                  </label>
                  <select
                    value={compA.id}
                    onChange={(e) => setCompareDateA(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white text-xs font-semibold text-[#2B091C]"
                  >
                    {chronologicalMeasurements.map((m) => (
                      <option key={m.id} value={m.id}>
                        {new Date(m.date).toLocaleDateString('fr-FR')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[#7A616F] uppercase block mb-1">
                    Date comparée
                  </label>
                  <select
                    value={compB.id}
                    onChange={(e) => setCompareDateB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white text-xs font-semibold text-[#2B091C]"
                  >
                    {chronologicalMeasurements.map((m) => (
                      <option key={m.id} value={m.id}>
                        {new Date(m.date).toLocaleDateString('fr-FR')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BODY_METRICS.map((bm) => {
                  const valA = compA[bm.key];
                  const valB = compB[bm.key];
                  if (typeof valA !== 'number' && typeof valB !== 'number') return null;
                  const delta =
                    typeof valA === 'number' && typeof valB === 'number'
                      ? Number((valB - valA).toFixed(1))
                      : null;

                  return (
                    <div key={bm.key} className="p-3 rounded-2xl bg-white space-y-0.5">
                      <span className="text-[11px] font-semibold text-[#7A616F] block">
                        {bm.label}
                      </span>
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-mono font-bold text-sm text-[#2B091C]">
                          {valB ?? '—'} {bm.unit}
                        </span>
                        {delta !== null && (
                          <span
                            className={`font-mono text-xs font-bold ${
                              delta > 0
                                ? 'text-[#831843]'
                                : delta < 0
                                ? 'text-[#EC4899]'
                                : 'text-[#7A616F]'
                            }`}
                          >
                            {delta > 0 ? `+${delta}` : delta} {bm.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chronological Measurement History */}
          <div className="space-y-2.5">
            <h3 className="font-display font-bold text-base text-[#2B091C] px-1">
              Historique des relevés ({(measurements || []).length})
            </h3>
            {(measurements || []).length === 0 ? (
              <div className="p-6 rounded-[24px] bg-[#F6EDF2] text-center text-xs text-[#7A616F]">
                Aucun relevé enregistré. Ajoute tes mensurations pour suivre l’évolution de ta silhouette.
              </div>
            ) : (
              <div className="space-y-2">
                {[...chronologicalMeasurements].reverse().map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-[24px] bg-[#F6EDF2] flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="font-display font-bold text-xs text-[#831843] block">
                        {new Date(m.date).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs font-mono text-[#2B091C]">
                        {m.hips && <span>Hanches: <strong>{m.hips}cm</strong></span>}
                        {m.waist && <span>Taille: <strong>{m.waist}cm</strong></span>}
                        {m.weight && <span>Poids: <strong>{m.weight}kg</strong></span>}
                        {m.thighs && <span>Cuisses: <strong>{m.thighs}cm</strong></span>}
                        {m.arms && <span>Bras: <strong>{m.arms}cm</strong></span>}
                        {m.chest && <span>Poitrine: <strong>{m.chest}cm</strong></span>}
                      </div>
                      {m.notes && (
                        <p className="text-[11px] text-[#7A616F] italic">{m.notes}</p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteMeasurement(m.id)}
                      className="w-8 h-8 rounded-full bg-white text-[#7A616F] hover:text-red-600 flex items-center justify-center shrink-0"
                      title="Supprimer ce relevé"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: JOURNAL DÉTAILLÉ DES SÉANCES (HISTORY)
      ===================================================================== */}
      {subTab === 'history' && (
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A616F] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Rechercher une séance ou un exercice..."
              className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F6EDF2] text-xs font-semibold text-[#2B091C] placeholder:text-[#7A616F] focus:outline-hidden"
            />
          </div>

          {filteredJournalWorkouts.length === 0 ? (
            <div className="p-8 rounded-[28px] bg-[#F6EDF2] text-center text-xs text-[#7A616F]">
              Aucune séance terminée ne correspond à ta recherche.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJournalWorkouts.map((workout) => {
                const isExpanded = expandedWorkoutId === workout.id;
                let sessionVolume = 0;
                let sessionSets = 0;
                (workout.exercises || []).forEach((ex) => {
                  (ex.sets || []).forEach((s) => {
                    const w = Number(s.actualWeight ?? s.targetWeight ?? 0);
                    const r = Number(s.actualReps ?? s.targetReps ?? 0);
                    sessionVolume += w * r;
                    sessionSets += 1;
                  });
                });

                return (
                  <div
                    key={workout.id}
                    className="p-4 sm:p-5 rounded-[26px] bg-[#F6EDF2] space-y-3 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedWorkoutId(isExpanded ? null : workout.id)
                        }
                        className="text-left min-w-0 flex-1"
                      >
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#831843]">
                          <span>
                            {new Date(workout.date).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                          <span>·</span>
                          <span className="font-mono">{workout.durationMinutes || 45} min</span>
                          <span>·</span>
                          <span className="font-mono">{sessionVolume} kg</span>
                        </div>
                        <h3 className="font-display font-bold text-base text-[#2B091C] truncate mt-0.5">
                          {workout.name}
                        </h3>
                        <p className="text-xs text-[#7A616F] truncate mt-0.5">
                          {(workout.exercises || []).length} exercices · {sessionSets} séries
                          {workout.finisher && typeof workout.finisher === 'string'
                            ? ` · + ${workout.finisher}`
                            : ''}
                        </p>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => duplicateWorkoutAsNew(workout)}
                          className="px-3 py-1.5 rounded-full bg-[#831843] text-white text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-transform"
                          title="Refaire cette séance"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Refaire</span>
                        </button>
                        <button
                          onClick={() =>
                            setExpandedWorkoutId(isExpanded ? null : workout.id)
                          }
                          className="w-8 h-8 rounded-full bg-white text-[#831843] flex items-center justify-center"
                          aria-label="Voir les détails"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded exercise & set details */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-[#E6D5DF] space-y-3 animate-in fade-in duration-150">
                        <div className="space-y-2">
                          {(workout.exercises || []).map((ex) => (
                            <div
                              key={ex.id}
                              className="p-3 rounded-2xl bg-white space-y-1.5"
                            >
                              <span className="font-display font-bold text-xs text-[#2B091C] block">
                                {ex.exerciseName}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {(ex.sets || []).map((s, idx) => (
                                  <span
                                    key={s.id || idx}
                                    className="px-2.5 py-1 rounded-lg bg-[#F6EDF2] font-mono text-[11px] font-semibold text-[#831843]"
                                  >
                                    S{idx + 1}: {s.actualWeight ?? s.targetWeight}kg ×{' '}
                                    {s.actualReps ?? s.targetReps}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {workout.notes && (
                          <p className="text-xs text-[#7A616F] italic bg-white/70 p-3 rounded-xl">
                            Note : {workout.notes}
                          </p>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleShareWorkout(workout)}
                            className="px-3 py-1.5 rounded-full bg-white text-[#831843] text-xs font-semibold flex items-center gap-1"
                          >
                            <StreamlineIcon name="share" className="w-3.5 h-3.5" />
                            <span>
                              {shareFeedbackId === workout.id ? 'Copié !' : 'Partager'}
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              setEditingWorkout(JSON.parse(JSON.stringify(workout)))
                            }
                            className="px-3 py-1.5 rounded-full bg-white text-[#2B091C] text-xs font-semibold flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Modifier</span>
                          </button>
                          <button
                            onClick={() => deleteWorkout(workout.id)}
                            className="px-3 py-1.5 rounded-full bg-white text-red-600 text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          BOTTOM SHEET: ADD NEW MEASUREMENT
      ===================================================================== */}
      <BottomSheet
        isOpen={isAddMeasurementOpen}
        onClose={() => setIsAddMeasurementOpen(false)}
        title="Nouvelle mesure"
        subtitle="Enregistre tes mensurations du jour"
      >
        <form onSubmit={handleSaveMeasurement} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#7A616F] uppercase mb-1">
              Date du relevé
            </label>
            <input
              type="date"
              required
              value={mDate}
              onChange={(e) => setMDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] font-semibold text-[#2B091C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#7A616F] uppercase mb-1">
                Hanches / Fessiers (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={mHips}
                onChange={(e) => setMHips(e.target.value)}
                placeholder="Ex: 98"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] font-mono font-bold text-[#2B091C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#7A616F] uppercase mb-1">
                Tour de taille (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={mWaist}
                onChange={(e) => setMWaist(e.target.value)}
                placeholder="Ex: 66"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] font-mono font-bold text-[#2B091C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#7A616F] uppercase mb-1">
                Poids (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={mWeight}
                onChange={(e) => setMWeight(e.target.value)}
                placeholder="Ex: 58.5"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] font-mono font-bold text-[#2B091C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#7A616F] uppercase mb-1">
                Cuisses (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={mThighs}
                onChange={(e) => setMThighs(e.target.value)}
                placeholder="Ex: 56"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] font-mono font-bold text-[#2B091C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#7A616F] uppercase mb-1">
                Bras (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={mArms}
                onChange={(e) => setMArms(e.target.value)}
                placeholder="Ex: 28"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] font-mono font-bold text-[#2B091C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#7A616F] uppercase mb-1">
                Poitrine (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={mChest}
                onChange={(e) => setMChest(e.target.value)}
                placeholder="Ex: 88"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] font-mono font-bold text-[#2B091C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#7A616F] uppercase mb-1">
              Note ou ressenti (optionnel)
            </label>
            <input
              type="text"
              value={mNotes}
              onChange={(e) => setMNotes(e.target.value)}
              placeholder="Ex: Prise de mesure à jeun..."
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] font-medium text-[#2B091C]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#831843] text-white font-bold text-xs min-h-[46px]"
          >
            Enregistrer mes mensurations
          </button>
        </form>
      </BottomSheet>

      {/* =====================================================================
          BOTTOM SHEET: EDIT PAST WORKOUT
      ===================================================================== */}
      <BottomSheet
        isOpen={!!editingWorkout}
        onClose={() => setEditingWorkout(null)}
        title="Modifier la séance"
        subtitle="Ajuste tes charges ou répétitions"
      >
        {editingWorkout && (
          <form onSubmit={handleSaveEditedWorkout} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#7A616F] uppercase mb-1">
                Nom de la séance
              </label>
              <input
                type="text"
                required
                value={editingWorkout.name}
                onChange={(e) =>
                  setEditingWorkout({ ...editingWorkout, name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#F6EDF2] font-bold text-[#2B091C]"
              />
            </div>

            <div className="space-y-3">
              {(editingWorkout.exercises || []).map((ex, exIdx) => (
                <div key={ex.id} className="p-3.5 rounded-2xl bg-[#F6EDF2] space-y-2">
                  <span className="font-bold text-xs text-[#2B091C] block">
                    {ex.exerciseName}
                  </span>
                  <div className="space-y-2">
                    {(ex.sets || []).map((s, sIdx) => {
                      const weightVal = Number(s.actualWeight ?? s.targetWeight ?? 0);
                      const repsVal = Number(s.actualReps ?? s.targetReps ?? 0);
                      return (
                        <div
                          key={s.id || sIdx}
                          className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl text-xs"
                        >
                          <span className="font-bold text-[#831843] w-8">#{sIdx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...editingWorkout.exercises];
                                updated[exIdx].sets[sIdx].actualWeight = Math.max(
                                  0,
                                  weightVal - 2.5
                                );
                                setEditingWorkout({ ...editingWorkout, exercises: updated });
                              }}
                              className="w-7 h-7 rounded-full bg-[#F6EDF2] flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-14 text-center font-mono font-bold">
                              {weightVal}kg
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...editingWorkout.exercises];
                                updated[exIdx].sets[sIdx].actualWeight = weightVal + 2.5;
                                setEditingWorkout({ ...editingWorkout, exercises: updated });
                              }}
                              className="w-7 h-7 rounded-full bg-[#F6EDF2] flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...editingWorkout.exercises];
                                updated[exIdx].sets[sIdx].actualReps = Math.max(1, repsVal - 1);
                                setEditingWorkout({ ...editingWorkout, exercises: updated });
                              }}
                              className="w-7 h-7 rounded-full bg-[#F6EDF2] flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-12 text-center font-mono font-bold">
                              {repsVal}r
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...editingWorkout.exercises];
                                updated[exIdx].sets[sIdx].actualReps = repsVal + 1;
                                setEditingWorkout({ ...editingWorkout, exercises: updated });
                              }}
                              className="w-7 h-7 rounded-full bg-[#F6EDF2] flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#831843] text-white font-bold text-xs min-h-[46px]"
            >
              Enregistrer les modifications
            </button>
          </form>
        )}
      </BottomSheet>
    </div>
  );
};
