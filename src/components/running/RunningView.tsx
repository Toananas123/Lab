import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Heart,
  Timer,
  TrendingUp,
  Award,
  Calendar,
  AlertCircle,
  HelpCircle,
  Settings2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StreamlineIcon } from '../ui/StreamlineIcon';
import { BottomSheet } from '../ui/BottomSheet';
import { RunningActivity, StravaAthlete, StravaRawActivity, PaceZone } from '../../types/running';

// App runtime URL for OAuth redirect
const APP_DEV_URL = 'https://ais-dev-u4r26fkw4kr2i65wqrmczt-458343688922.europe-west2.run.app';
const STRAVA_CALLBACK_PATH = '/auth/strava/callback';

export const RunningView: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'guest';

  // Persistence keys
  const activitiesStorageKey = `glowup_running_activities_${userId}`;
  const stravaTokenStorageKey = `glowup_strava_token_${userId}`;
  const stravaAthleteStorageKey = `glowup_strava_athlete_${userId}`;
  const stravaConfigKey = `glowup_strava_config_${userId}`;

  // Activities state
  const [activities, setActivities] = useState<RunningActivity[]>(() => {
    try {
      const saved = localStorage.getItem(activitiesStorageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Initial sample run to welcome user
    return [
      {
        id: 'init_run_1',
        name: 'Footing aérobie & lignes droites',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        distanceKm: 7.2,
        durationMinutes: 42,
        averagePace: '5:50',
        elevationGain: 48,
        avgHeartRate: 142,
        cadence: 170,
        source: 'manual',
        perceivedEffort: 3,
        shoes: 'Nike Pegasus',
        notes: 'Très bonnes sensations en endurance fondamentale, 4 accélérations progressives sur la fin.',
      },
    ];
  });

  // Strava integration state
  const [stravaToken, setStravaToken] = useState<string | null>(() => {
    return localStorage.getItem(stravaTokenStorageKey);
  });
  const [stravaAthlete, setStravaAthlete] = useState<StravaAthlete | null>(() => {
    try {
      const saved = localStorage.getItem(stravaAthleteStorageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [stravaClientId, setStravaClientId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(stravaConfigKey);
      if (saved) return JSON.parse(saved).clientId || '';
    } catch {}
    return '';
  });
  const [stravaClientSecret, setStravaClientSecret] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(stravaConfigKey);
      if (saved) return JSON.parse(saved).clientSecret || '';
    } catch {}
    return '';
  });

  const [isLoadingStrava, setIsLoadingStrava] = useState(false);
  const [stravaError, setStravaError] = useState<string | null>(null);
  const [stravaRawActivities, setStravaRawActivities] = useState<StravaRawActivity[]>([]);
  const [showStravaModal, setShowStravaModal] = useState(false);
  const [showStravaConfig, setShowStravaConfig] = useState(false);
  const [showAddManualModal, setShowAddManualModal] = useState(false);

  // Manual run form state
  const [manualName, setManualName] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualDistance, setManualDistance] = useState<string>('5.0');
  const [manualDuration, setManualDuration] = useState<string>('30');
  const [manualElevation, setManualElevation] = useState<string>('');
  const [manualHeartRate, setManualHeartRate] = useState<string>('');
  const [manualCadence, setManualCadence] = useState<string>('172');
  const [manualEffort, setManualEffort] = useState<number>(3);
  const [manualShoes, setManualShoes] = useState<string>('');
  const [manualNotes, setManualNotes] = useState<string>('');

  // Pace & VMA Calculator state
  const [vmaInput, setVmaInput] = useState<number>(12); // km/h
  const [calcMode, setCalcMode] = useState<'vma' | 'time5k' | 'time10k'>('vma');
  const [raceTime5kMinutes, setRaceTime5kMinutes] = useState<number>(26);
  const [raceTime10kMinutes, setRaceTime10kMinutes] = useState<number>(54);

  // Cadence Metronome state
  const [metronomeBpm, setMetronomeBpm] = useState<number>(172);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState<boolean>(false);
  const [metronomeFlash, setMetronomeFlash] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active interval plan runner state
  const [activePlan, setActivePlan] = useState<{
    title: string;
    description: string;
    duration: string;
    steps: { label: string; durationSec: number; target: string; intensity: 'warmup' | 'fast' | 'slow' | 'cooldown' }[];
  } | null>(null);
  const [planStepIndex, setPlanStepIndex] = useState(0);
  const [planSecondsLeft, setPlanSecondsLeft] = useState(0);
  const [isPlanRunning, setIsPlanRunning] = useState(false);
  const planTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save activities to localStorage
  useEffect(() => {
    localStorage.setItem(activitiesStorageKey, JSON.stringify(activities));
  }, [activities, activitiesStorageKey]);

  // Save Strava config to localStorage
  useEffect(() => {
    localStorage.setItem(stravaConfigKey, JSON.stringify({ clientId: stravaClientId, clientSecret: stravaClientSecret }));
  }, [stravaClientId, stravaClientSecret, stravaConfigKey]);

  // Listen for OAuth postMessage from popup (conforming to OAuth integration skill)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      if (event.data?.type === 'STRAVA_AUTH_SUCCESS') {
        const code = event.data.code;
        if (code) {
          await handleExchangeStravaCode(code);
        } else if (event.data.error) {
          setStravaError(`Connexion annulée : ${event.data.error}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [stravaClientId, stravaClientSecret]);

  // Metronome sound engine
  const playMetronomeTick = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High tick
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);

      setMetronomeFlash(true);
      setTimeout(() => setMetronomeFlash(false), 90);
    } catch {}
  };

  useEffect(() => {
    if (isMetronomePlaying) {
      const intervalMs = (60 / metronomeBpm) * 1000;
      playMetronomeTick();
      metronomeIntervalRef.current = setInterval(() => {
        playMetronomeTick();
      }, intervalMs);
    } else {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    }

    return () => {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, [isMetronomePlaying, metronomeBpm]);

  // Interval plan timer
  useEffect(() => {
    if (isPlanRunning && activePlan) {
      planTimerRef.current = setInterval(() => {
        setPlanSecondsLeft((prev) => {
          if (prev <= 1) {
            // Next step
            if (planStepIndex + 1 < activePlan.steps.length) {
              const nextIdx = planStepIndex + 1;
              setPlanStepIndex(nextIdx);
              playMetronomeTick();
              return activePlan.steps[nextIdx].durationSec;
            } else {
              setIsPlanRunning(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (planTimerRef.current) clearInterval(planTimerRef.current);
    }

    return () => {
      if (planTimerRef.current) clearInterval(planTimerRef.current);
    };
  }, [isPlanRunning, activePlan, planStepIndex]);

  // Calculate target pace zones based on VMA
  const currentVMA =
    calcMode === 'vma'
      ? vmaInput
      : calcMode === 'time5k'
      ? Number(((5 / (raceTime5kMinutes / 60)) * 1.05).toFixed(1))
      : Number(((10 / (raceTime10kMinutes / 60)) * 1.1).toFixed(1));

  const formatPaceFromSpeed = (speedKmh: number): string => {
    if (speedKmh <= 0) return '0:00';
    const totalMinutesPerKm = 60 / speedKmh;
    const mins = Math.floor(totalMinutesPerKm);
    const secs = Math.round((totalMinutesPerKm - mins) * 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const paceZones: PaceZone[] = [
    {
      name: 'Endurance Fondamentale (EF)',
      label: 'Footing aérobie & régénération',
      percentage: '65 - 75% VMA',
      speedKmh: Number((currentVMA * 0.7).toFixed(1)),
      paceMinKm: formatPaceFromSpeed(currentVMA * 0.7),
      purpose: 'Aisance respiratoire totale, papotage possible, brûle les graisses et renforce le cœur.',
      color: '#10B981',
    },
    {
      name: 'Allure Sortie Longue / Marathon',
      label: 'Endurance active',
      percentage: '75 - 80% VMA',
      speedKmh: Number((currentVMA * 0.77).toFixed(1)),
      paceMinKm: formatPaceFromSpeed(currentVMA * 0.77),
      purpose: 'Rythme de croisière pour les sorties de 50 min et plus, développe le volume d’éjection.',
      color: '#06B6D4',
    },
    {
      name: 'Allure Seuil / Tempo',
      label: 'Résistance douce',
      percentage: '80 - 88% VMA',
      speedKmh: Number((currentVMA * 0.85).toFixed(1)),
      paceMinKm: formatPaceFromSpeed(currentVMA * 0.85),
      purpose: 'Effort confortablement dur, repousse l’acidité musculaire et optimise le souffle.',
      color: '#F59E0B',
    },
    {
      name: 'Allure Spécifique 10 km',
      label: 'Rythme compétition',
      percentage: '88 - 92% VMA',
      speedKmh: Number((currentVMA * 0.9).toFixed(1)),
      paceMinKm: formatPaceFromSpeed(currentVMA * 0.9),
      purpose: 'Maintien de la vitesse avec concentration et gestion du mental sur la distance.',
      color: '#EC4899',
    },
    {
      name: 'VMA & Fractionné Court',
      label: 'Vitesse maximale aérobie (30/30)',
      percentage: '100 - 105% VMA',
      speedKmh: Number((currentVMA * 1.0).toFixed(1)),
      paceMinKm: formatPaceFromSpeed(currentVMA * 1.0),
      purpose: 'Intervalles rapides pour booster la VO2max, la foulée dynamique et la relance.',
      color: '#831843',
    },
  ];

  // Strava OAuth Trigger (Popup-based conforming to skill)
  const handleConnectStrava = () => {
    setStravaError(null);
    const redirectUri = `${window.location.origin}${STRAVA_CALLBACK_PATH}`;
    const effectiveClientId = stravaClientId.trim() || '12345'; // Fallback demo ID if unset

    // Construct authorization URL as mandated by the skill
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${effectiveClientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=read,activity:read_all&approval_prompt=auto`;

    // Open popup
    const popup = window.open(authUrl, 'strava_oauth_popup', 'width=600,height=720,scrollbars=yes');
    if (!popup) {
      setStravaError('Le bloqueur de fenêtres a bloqué l’ouverture de Strava. Autorise les popups pour ce site.');
    }
  };

  // Exchange code for Strava token
  const handleExchangeStravaCode = async (code: string) => {
    setIsLoadingStrava(true);
    setStravaError(null);
    try {
      const res = await fetch('/api/strava/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          clientId: stravaClientId.trim(),
          clientSecret: stravaClientSecret.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Échange du code Strava échoué');
      }

      const data = await res.json();
      if (data.access_token) {
        setStravaToken(data.access_token);
        localStorage.setItem(stravaTokenStorageKey, data.access_token);
        if (data.athlete) {
          setStravaAthlete(data.athlete);
          localStorage.setItem(stravaAthleteStorageKey, JSON.stringify(data.athlete));
        }
        await fetchStravaActivities(data.access_token);
      }
    } catch {
      // In development or when using mock/demo Strava mode:
      setStravaError('Impossible de contacter le serveur Strava avec ces clés. Tu peux tester avec le mode Démo Strava ci-dessous.');
    } finally {
      setIsLoadingStrava(false);
    }
  };

  // Fetch activities from Strava
  const fetchStravaActivities = async (token: string) => {
    setIsLoadingStrava(true);
    setStravaError(null);
    try {
      const res = await fetch('/api/strava/activities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la récupération des activités Strava');
      const data: StravaRawActivity[] = await res.json();
      // Filter for Run or TrailRun activities only
      const runsOnly = data.filter((act) => act.type === 'Run' || act.sport_type === 'Run' || act.type === 'TrailRun');
      setStravaRawActivities(runsOnly);
      setShowStravaModal(true);
    } catch (err) {
      setStravaError('Impossible de charger les activités Strava. Vérifie la connexion.');
    } finally {
      setIsLoadingStrava(false);
    }
  };

  // Disconnect Strava
  const handleDisconnectStrava = () => {
    setStravaToken(null);
    setStravaAthlete(null);
    setStravaRawActivities([]);
    localStorage.removeItem(stravaTokenStorageKey);
    localStorage.removeItem(stravaAthleteStorageKey);
  };

  // Activate Demo Strava Run Mode (One-click realistic sample for testing before OAuth keys setup)
  const handleLoadDemoStravaData = () => {
    const demoAthlete: StravaAthlete = {
      id: 9876543,
      firstname: user?.displayName?.split(' ')[0] || 'Sportive',
      lastname: 'Running',
      city: 'Paris',
      country: 'France',
      profile: '',
    };
    const demoActivities: StravaRawActivity[] = [
      {
        id: 101,
        name: 'Footing matinal Quai de Seine 🌅',
        type: 'Run',
        distance: 10240, // 10.24 km
        moving_time: 3340, // 55m 40s
        elapsed_time: 3420,
        total_elevation_gain: 35,
        start_date_local: new Date().toISOString(),
        average_speed: 3.06, // ~5:27 /km
        average_heartrate: 146,
        average_cadence: 174,
      },
      {
        id: 102,
        name: 'Séance Fractionné 8x (30/30) au parc ⚡',
        type: 'Run',
        distance: 6800, // 6.8 km
        moving_time: 2160, // 36m
        elapsed_time: 2400,
        total_elevation_gain: 22,
        start_date_local: new Date(Date.now() - 86400000 * 3).toISOString(),
        average_speed: 3.15, // ~5:17 /km
        average_heartrate: 168,
        average_cadence: 178,
      },
      {
        id: 103,
        name: 'Sortie longue dominicale en forêt 🌲',
        type: 'Run',
        distance: 14500, // 14.5 km
        moving_time: 5100, // 1h25
        elapsed_time: 5280,
        total_elevation_gain: 140,
        start_date_local: new Date(Date.now() - 86400000 * 6).toISOString(),
        average_speed: 2.84, // ~5:52 /km
        average_heartrate: 152,
        average_cadence: 172,
      },
    ];

    setStravaAthlete(demoAthlete);
    setStravaToken('demo_token');
    setStravaRawActivities(demoActivities);
    setShowStravaModal(true);
  };

  // Convert raw Strava activity into RunningActivity with user approval
  const handleImportStravaActivity = (stravaAct: StravaRawActivity) => {
    const distKm = Number((stravaAct.distance / 1000).toFixed(2));
    const durationMins = Math.round(stravaAct.moving_time / 60);

    // Calculate pace
    const secPerKm = stravaAct.distance > 0 ? stravaAct.moving_time / (stravaAct.distance / 1000) : 0;
    const paceMins = Math.floor(secPerKm / 60);
    const paceSecs = Math.round(secPerKm % 60);
    const paceStr = `${paceMins}:${paceSecs < 10 ? '0' : ''}${paceSecs}`;

    const newActivity: RunningActivity = {
      id: `strava_${stravaAct.id}`,
      name: stravaAct.name,
      date: stravaAct.start_date_local,
      distanceKm: distKm,
      durationMinutes: durationMins,
      averagePace: paceStr,
      elevationGain: Math.round(stravaAct.total_elevation_gain || 0),
      avgHeartRate: stravaAct.average_heartrate ? Math.round(stravaAct.average_heartrate) : undefined,
      cadence: stravaAct.average_cadence ? Math.round(stravaAct.average_cadence * 2) : undefined, // Strava reports single leg cadence
      source: 'strava',
      stravaActivityId: stravaAct.id,
      perceivedEffort: 3,
      notes: `Importé automatiquement de Strava (${distKm} km · ${paceStr} /km)`,
    };

    setActivities((prev) => {
      // Avoid duplicate import
      const filtered = prev.filter((a) => a.stravaActivityId !== stravaAct.id);
      return [newActivity, ...filtered];
    });
  };

  // Manual run submit
  const handleAddManualRun = (e: React.FormEvent) => {
    e.preventDefault();
    const dist = parseFloat(manualDistance) || 5;
    const dur = parseInt(manualDuration, 10) || 30;

    const secPerKm = dist > 0 ? (dur * 60) / dist : 0;
    const paceMins = Math.floor(secPerKm / 60);
    const paceSecs = Math.round(secPerKm % 60);
    const paceStr = `${paceMins}:${paceSecs < 10 ? '0' : ''}${paceSecs}`;

    const newAct: RunningActivity = {
      id: `manual_${Date.now()}`,
      name: manualName.trim() || 'Sortie running',
      date: new Date(manualDate).toISOString(),
      distanceKm: dist,
      durationMinutes: dur,
      averagePace: paceStr,
      elevationGain: manualElevation ? parseInt(manualElevation, 10) : undefined,
      avgHeartRate: manualHeartRate ? parseInt(manualHeartRate, 10) : undefined,
      cadence: manualCadence ? parseInt(manualCadence, 10) : 172,
      source: 'manual',
      perceivedEffort: manualEffort,
      shoes: manualShoes.trim() || undefined,
      notes: manualNotes.trim() || undefined,
    };

    setActivities((prev) => [newAct, ...prev]);
    setShowAddManualModal(false);
    // Reset form
    setManualName('');
    setManualDistance('5.0');
    setManualDuration('30');
    setManualElevation('');
    setManualHeartRate('');
    setManualNotes('');
  };

  // Delete run
  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  // Cumulative stats
  const totalKm = activities.reduce((sum, a) => sum + a.distanceKm, 0);
  const totalDurationMin = activities.reduce((sum, a) => sum + a.durationMinutes, 0);
  const totalElev = activities.reduce((sum, a) => sum + (a.elevationGain || 0), 0);
  const overallAvgPace = totalKm > 0 ? formatPaceFromSpeed(totalKm / (totalDurationMin / 60)) : '0:00';

  // Running interval presets
  const RUNNING_WORKOUT_PRESETS = [
    {
      title: 'Fractionné 8× (30/30s) VMA',
      description: 'Idéal pour booster le cardio et la VO2max sans s’épuiser.',
      duration: '32 min',
      steps: [
        { label: 'Échauffement en endurance fondamentale', durationSec: 600, target: 'Allure EF (aisance)', intensity: 'warmup' as const },
        { label: 'Série 1 - Vitesse rapide 100% VMA', durationSec: 30, target: 'Accélération soutenue', intensity: 'fast' as const },
        { label: 'Récupération trot très lent', durationSec: 30, target: 'Respiration profonde', intensity: 'slow' as const },
        { label: 'Série 2 - Vitesse rapide 100% VMA', durationSec: 30, target: 'Foulée dynamique', intensity: 'fast' as const },
        { label: 'Récupération trot très lent', durationSec: 30, target: 'Relâchement épaules', intensity: 'slow' as const },
        { label: 'Série 3 - Vitesse rapide 100% VMA', durationSec: 30, target: 'Buste droit', intensity: 'fast' as const },
        { label: 'Récupération trot très lent', durationSec: 30, target: 'Récupération', intensity: 'slow' as const },
        { label: 'Retour au calme & trot doux', durationSec: 480, target: 'Retour au calme', intensity: 'cooldown' as const },
      ],
    },
    {
      title: 'Tempo & Seuil 3 × 8 min',
      description: 'Habitue le corps à repousser la fatigue et l’accumulation d’acide lactique.',
      duration: '45 min',
      steps: [
        { label: 'Échauffement aérobie progressif', durationSec: 900, target: 'Aisance totale', intensity: 'warmup' as const },
        { label: 'Bloc 1 - Allure Seuil (confortablement dur)', durationSec: 480, target: 'Allure seuil 85%', intensity: 'fast' as const },
        { label: 'Récupération active en trot', durationSec: 150, target: 'Trot récupération', intensity: 'slow' as const },
        { label: 'Bloc 2 - Allure Seuil constante', durationSec: 480, target: 'Rythme régulier', intensity: 'fast' as const },
        { label: 'Récupération active en trot', durationSec: 150, target: 'Trot récupération', intensity: 'slow' as const },
        { label: 'Retour au calme trot léger', durationSec: 600, target: 'Marche & trot très doux', intensity: 'cooldown' as const },
      ],
    },
    {
      title: 'Sortie Longue Progressive 50 min',
      description: 'Développe l’endurance aérobie, le réseau capillaire et la confiance.',
      duration: '50 min',
      steps: [
        { label: 'Partie 1 : Endurance Fondamentale (aisance)', durationSec: 1800, target: 'Aisance respiratoire', intensity: 'warmup' as const },
        { label: 'Partie 2 : 15 min à allure cible (semi/10k)', durationSec: 900, target: 'Allure spécifique', intensity: 'fast' as const },
        { label: 'Partie 3 : Retour au calme', durationSec: 300, target: 'Trot léger & marche', intensity: 'cooldown' as const },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* 1. Header Hero Spécial Running (Saisonnière & Temporaire) */}
      <div className="rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#2B091C] via-[#500724] to-[#831843] text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EC4899]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#F472B6]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#FBCFE8] border border-white/20 text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
              <span>Section Temporaire · Édition Running & Cardio</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Course à Pied & Synchronisation Strava
            </h1>
            <p className="text-xs sm:text-sm text-[#FBCFE8] max-w-xl leading-relaxed">
              Calcule tes allures d’entraînement, cale ta cadence au métronome et importe automatiquement tes sorties Strava avec ton approbation.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
            <button
              onClick={() => setShowAddManualModal(true)}
              className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#FBCFE8]" />
              <span>Ajouter manuellement</span>
            </button>
            <button
              onClick={() => (stravaToken ? setShowStravaModal(true) : handleConnectStrava())}
              className={`px-4 py-2.5 rounded-full bg-[#FC4C02] hover:bg-[#E34402] text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md ${
                !stravaToken ? 'animate-pulse ring-4 ring-[#FC4C02]/30' : ''
              }`}
            >
              <StreamlineIcon name="runner" className="w-4 h-4 text-white" />
              <span>{stravaToken ? 'Ouvrir Strava' : 'Connecter Strava'}</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FBCFE8] block">Distance Totale</span>
            <span className="font-mono font-bold text-lg sm:text-xl text-white">{totalKm.toFixed(1)} km</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FBCFE8] block">Sorties Réalisées</span>
            <span className="font-mono font-bold text-lg sm:text-xl text-white">{activities.length} runs</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FBCFE8] block">Allure Moyenne</span>
            <span className="font-mono font-bold text-lg sm:text-xl text-white">{overallAvgPace} /km</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FBCFE8] block">Dénivelé Cumulé</span>
            <span className="font-mono font-bold text-lg sm:text-xl text-white">+{totalElev} m</span>
          </div>
        </div>
      </div>

      {/* Bento Card de Synthèse : 5 dernières activités & Évolution de la distance */}
      {(() => {
        const last5 = activities.slice(0, 5);
        const last5Km = last5.reduce((acc, r) => acc + r.distanceKm, 0);
        const chrono5 = [...last5].reverse();
        const maxDist = Math.max(...chrono5.map((r) => r.distanceKm), 10);

        return (
          <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-[#FBCFE8] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 space-y-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EC4899] block">
                  Carte de synthèse Running
                </span>
                <h2 className="font-display font-bold text-lg text-[#2B091C]">
                  Bilan sur les 5 dernières activités
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8]">
                  <span className="text-[10px] font-bold text-[#7A616F] uppercase block">
                    Kilomètres (5 runs)
                  </span>
                  <span className="font-mono font-extrabold text-xl text-[#831843] tabular-nums">
                    {last5Km.toFixed(1)} km
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8]">
                  <span className="text-[10px] font-bold text-[#7A616F] uppercase block">
                    Sorties effectuées
                  </span>
                  <span className="font-mono font-extrabold text-xl text-[#2B091C] tabular-nums">
                    {last5.length} / 5
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 p-4 rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#831843]">
                  Évolution de la distance parcourue (5 dernières sorties)
                </span>
                <span className="text-[11px] font-mono text-[#7A616F]">km / sortie</span>
              </div>

              <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2">
                {chrono5.map((run, idx) => {
                  const heightPct = Math.max(18, Math.round((run.distanceKm / maxDist) * 100));
                  return (
                    <div key={run.id || idx} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="font-mono font-bold text-[10px] text-[#831843]">
                        {run.distanceKm.toFixed(1)}k
                      </span>
                      <div className="w-full h-16 bg-[#F6EDF2] rounded-xl flex items-end overflow-hidden p-0.5">
                        <div
                          className="w-full rounded-lg bg-gradient-to-t from-[#831843] to-[#EC4899] transition-all duration-300"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-[#7A616F] truncate max-w-[60px]">
                        {new Date(run.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. Strava Integration Banner & Card */}
      <div className="p-5 rounded-[28px] bg-white border border-[#FBCFE8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FC4C02]/10 border border-[#FC4C02]/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FC4C02">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.925 15.645h4.17" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[#2B091C]">Synchronisation Strava</h3>
                {stravaToken ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                    Connecté
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                    Déconnecté
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6E4F5D]">
                {stravaAthlete
                  ? `Compte associé : ${stravaAthlete.firstname} ${stravaAthlete.lastname}`
                  : 'Récupère tes dernières sorties GPS et choisis celles que tu souhaites ajouter à ton journal.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowStravaConfig(!showStravaConfig)}
              className="p-2 rounded-full text-[#6E4F5D] hover:text-[#2B091C] hover:bg-[#FFF0F5] transition-colors"
              title="Paramètres API Strava"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {stravaToken ? (
              <>
                <button
                  type="button"
                  onClick={() => fetchStravaActivities(stravaToken)}
                  disabled={isLoadingStrava}
                  className="px-3.5 py-2 rounded-full bg-[#FC4C02] hover:bg-[#E34402] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingStrava ? 'Actualisation...' : 'Voir mes courses Strava'}
                </button>
                <button
                  type="button"
                  onClick={handleDisconnectStrava}
                  className="px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-semibold transition-colors"
                >
                  Déconnecter
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleConnectStrava}
                  className="px-4 py-2 rounded-full bg-[#FC4C02] hover:bg-[#E34402] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Connexion Strava</span>
                </button>
                <button
                  type="button"
                  onClick={handleLoadDemoStravaData}
                  className="px-3 py-2 rounded-full bg-[#FFF0F5] border border-[#FBCFE8] text-[#831843] text-xs font-bold hover:bg-[#FCE7F3] transition-colors cursor-pointer"
                  title="Prévisualise l'intégration sans configurer de clé Strava"
                >
                  Mode Démo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Optional Strava API Setup Drawer */}
        {showStravaConfig && (
          <div className="p-4 rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-[#831843] block">Configuration des identifiants Strava (Optionnel)</span>
                <p className="text-[11px] text-[#6E4F5D]">
                  Tu peux renseigner ton propre <strong>Client ID</strong> et <strong>Client Secret</strong> (créés sur{' '}
                  <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener noreferrer" className="underline text-[#FC4C02]">
                    strava.com/settings/api
                  </a>
                  ) ou utiliser directement le mode démo.
                </p>
              </div>
              <button onClick={() => setShowStravaConfig(false)} className="text-[#6E4F5D] hover:text-[#2B091C]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#6E4F5D] uppercase block mb-1">Strava Client ID</label>
                <input
                  type="text"
                  value={stravaClientId}
                  onChange={(e) => setStravaClientId(e.target.value)}
                  placeholder="ex: 123456"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#6E4F5D] uppercase block mb-1">Strava Client Secret</label>
                <input
                  type="password"
                  value={stravaClientSecret}
                  onChange={(e) => setStravaClientSecret(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FBCFE8] text-xs"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#FBCFE8]/60 text-[11px] text-[#6E4F5D]">
              <strong>URL de Callback à renseigner sur Strava :</strong>
              <code className="block mt-1 p-1 bg-[#FFF0F5] rounded text-[#831843] font-mono select-all">
                {window.location.origin}/auth/strava/callback
              </code>
            </div>
          </div>
        )}

        {stravaError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{stravaError}</span>
            </div>
            <button
              onClick={handleLoadDemoStravaData}
              className="text-[11px] font-bold underline shrink-0 hover:text-rose-950"
            >
              Lancer avec données démo
            </button>
          </div>
        )}
      </div>

      {/* 3. Calculateur d'Allures & VMA Intercatif */}
      <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-[#FBCFE8] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#EC4899]" />
              <h3 className="font-display font-bold text-lg text-[#2B091C]">Calculateur d’Allures & Zones VMA</h3>
            </div>
            <p className="text-xs text-[#6E4F5D]">
              Estime tes allures exactes d’endurance, de tempo et de fractionné pour courir au bon rythme sans te blesser.
            </p>
          </div>

          <div className="flex items-center p-1 rounded-full bg-[#FFF0F5] border border-[#FBCFE8] text-xs font-bold">
            <button
              onClick={() => setCalcMode('vma')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                calcMode === 'vma' ? 'bg-[#831843] text-white shadow-xs' : 'text-[#831843]'
              }`}
            >
              Par VMA
            </button>
            <button
              onClick={() => setCalcMode('time5k')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                calcMode === 'time5k' ? 'bg-[#831843] text-white shadow-xs' : 'text-[#831843]'
              }`}
            >
              Chrono 5 km
            </button>
            <button
              onClick={() => setCalcMode('time10k')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                calcMode === 'time10k' ? 'bg-[#831843] text-white shadow-xs' : 'text-[#831843]'
              }`}
            >
              Chrono 10 km
            </button>
          </div>
        </div>

        {/* Input slider according to mode */}
        <div className="p-4 rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-2/3 space-y-1.5">
            {calcMode === 'vma' ? (
              <>
                <div className="flex justify-between text-xs font-semibold text-[#2B091C]">
                  <span>VMA Estimée</span>
                  <span className="font-mono text-sm text-[#831843] font-bold">{vmaInput} km/h</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="18"
                  step="0.5"
                  value={vmaInput}
                  onChange={(e) => setVmaInput(parseFloat(e.target.value))}
                  className="w-full accent-[#831843] cursor-pointer"
                />
              </>
            ) : calcMode === 'time5k' ? (
              <>
                <div className="flex justify-between text-xs font-semibold text-[#2B091C]">
                  <span>Temps de référence sur 5 km</span>
                  <span className="font-mono text-sm text-[#831843] font-bold">{raceTime5kMinutes} min</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="45"
                  step="1"
                  value={raceTime5kMinutes}
                  onChange={(e) => setRaceTime5kMinutes(parseInt(e.target.value, 10))}
                  className="w-full accent-[#831843] cursor-pointer"
                />
              </>
            ) : (
              <>
                <div className="flex justify-between text-xs font-semibold text-[#2B091C]">
                  <span>Temps de référence sur 10 km</span>
                  <span className="font-mono text-sm text-[#831843] font-bold">{raceTime10kMinutes} min</span>
                </div>
                <input
                  type="range"
                  min="38"
                  max="75"
                  step="1"
                  value={raceTime10kMinutes}
                  onChange={(e) => setRaceTime10kMinutes(parseInt(e.target.value, 10))}
                  className="w-full accent-[#831843] cursor-pointer"
                />
              </>
            )}
          </div>

          <div className="px-5 py-3 rounded-2xl bg-white border border-[#FBCFE8] text-center shrink-0">
            <span className="text-[10px] font-bold uppercase text-[#831843] block">VMA Calculée</span>
            <span className="font-display font-extrabold text-xl text-[#2B091C]">{currentVMA} km/h</span>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {paceZones.map((z) => (
            <div key={z.name} className="p-3.5 rounded-2xl bg-white border border-[#FBCFE8] space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EC4899] block truncate">
                {z.percentage}
              </span>
              <div className="flex items-baseline justify-between gap-1">
                <span className="font-mono font-bold text-lg text-[#2B091C]">{z.paceMinKm}</span>
                <span className="text-[10px] text-[#7A616F]">/km</span>
              </div>
              <span className="text-xs font-bold text-[#3B0726] block truncate">{z.name.split('(')[0]}</span>
              <p className="text-[10px] text-[#6E4F5D] leading-tight line-clamp-2">{z.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Métronome de Cadence Sonore (Foulée 160-185 ppm) */}
      <div className="p-5 sm:p-6 rounded-[28px] bg-[#FFF0F5] border border-[#FBCFE8] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                metronomeFlash
                  ? 'bg-[#EC4899] text-white scale-110 shadow-md'
                  : 'bg-white text-[#831843] border border-[#FBCFE8]'
              }`}
            >
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[#2B091C]">Métronome de Cadence (Foulée)</h3>
                <span className="px-2 py-0.5 rounded-full bg-white text-[#831843] text-[10px] font-bold border border-[#FBCFE8]">
                  Protection genoux
                </span>
              </div>
              <p className="text-xs text-[#6E4F5D]">
                Une cadence élevée (170-180 ppm) réduit l’impact articulaire sur le genou et favorise une pose médio-pied.
              </p>
            </div>
          </div>

          {/* Start/Stop Button */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-mono font-extrabold text-xl sm:text-2xl text-[#831843] block leading-none">
                {metronomeBpm}
              </span>
              <span className="text-[10px] text-[#7A616F] font-semibold">pas / min (PPM)</span>
            </div>

            <button
              type="button"
              onClick={() => setIsMetronomePlaying(!isMetronomePlaying)}
              className={`h-11 px-5 rounded-full text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md ${
                isMetronomePlaying
                  ? 'bg-[#831843] text-white ring-2 ring-[#EC4899]'
                  : 'bg-white text-[#831843] hover:bg-[#FCE7F3] border border-[#FBCFE8]'
              }`}
            >
              {isMetronomePlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Arrêter</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-[#831843]" />
                  <span>Démarrer le bip</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* BPM Quick Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-[#7A616F] mr-1">Rythmes recommandés :</span>
          {[165, 170, 172, 176, 180].map((bpm) => (
            <button
              key={bpm}
              onClick={() => setMetronomeBpm(bpm)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                metronomeBpm === bpm
                  ? 'bg-[#831843] text-white shadow-2xs'
                  : 'bg-white text-[#6E4F5D] border border-[#FBCFE8] hover:bg-[#FCE7F3]'
              }`}
            >
              {bpm} ppm
            </button>
          ))}
        </div>
      </div>

      {/* 5. Plans de Séances Types & Fractionnés Clés */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#EC4899]" />
            <h3 className="font-display font-bold text-lg text-[#2B091C]">Séances Clés & Fractionnés Prêts à Courir</h3>
          </div>
          <span className="text-xs text-[#7A616F]">3 entraînements types</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RUNNING_WORKOUT_PRESETS.map((preset) => (
            <div
              key={preset.title}
              className="p-5 rounded-[28px] bg-white border border-[#FBCFE8] flex flex-col justify-between space-y-4 shadow-2xs hover:border-[#F472B6] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#FFF0F5] text-[#831843] text-[10px] font-mono font-bold border border-[#FBCFE8]">
                    {preset.duration}
                  </span>
                  <span className="text-[11px] text-[#EC4899] font-bold">{preset.steps.length} blocs</span>
                </div>
                <h4 className="font-display font-bold text-base text-[#2B091C]">{preset.title}</h4>
                <p className="text-xs text-[#6E4F5D] leading-relaxed">{preset.description}</p>
              </div>

              <div className="pt-2 border-t border-[#FBCFE8]/60 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#831843]">Guidage pas à pas</span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePlan(preset);
                    setPlanStepIndex(0);
                    setPlanSecondsLeft(preset.steps[0].durationSec);
                    setIsPlanRunning(true);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Lancer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Workout Timer Modal if a plan is running */}
      {activePlan && (
        <div className="p-5 rounded-[28px] bg-[#180413] text-white border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] animate-pulse" />
              <span className="text-xs font-bold text-[#FBCFE8] uppercase tracking-wider">
                Séance guidée : {activePlan.title}
              </span>
            </div>
            <button
              onClick={() => {
                setIsPlanRunning(false);
                setActivePlan(null);
              }}
              className="text-[#C29DB2] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center py-2 space-y-1">
            <span className="text-xs text-[#FBCFE8] font-bold block">
              Bloc {planStepIndex + 1} sur {activePlan.steps.length} : {activePlan.steps[planStepIndex].label}
            </span>
            <div className="font-mono text-4xl sm:text-5xl font-extrabold text-white tabular-nums">
              {Math.floor(planSecondsLeft / 60)}:
              {planSecondsLeft % 60 < 10 ? `0${planSecondsLeft % 60}` : planSecondsLeft % 60}
            </div>
            <span className="text-xs text-[#EC4899] font-semibold block">
              Consigne : {activePlan.steps[planStepIndex].target}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsPlanRunning(!isPlanRunning)}
              className="px-6 py-2.5 rounded-full bg-white text-[#831843] font-bold text-xs flex items-center gap-2"
            >
              {isPlanRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-[#831843]" />}
              <span>{isPlanRunning ? 'Pause' : 'Reprendre'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (planStepIndex + 1 < activePlan.steps.length) {
                  const nextIdx = planStepIndex + 1;
                  setPlanStepIndex(nextIdx);
                  setPlanSecondsLeft(activePlan.steps[nextIdx].durationSec);
                }
              }}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <span>Suivant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Journal des Sorties (Historique & Import Strava) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#EC4899]" />
            <h3 className="font-display font-bold text-lg text-[#2B091C]">Journal des Courses</h3>
          </div>
          <span className="text-xs text-[#7A616F]">{activities.length} sorties enregistrées</span>
        </div>

        {activities.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-[28px] border border-[#FBCFE8] space-y-3">
            <StreamlineIcon name="runner" className="w-8 h-8 text-[#831843] mx-auto" />
            <h4 className="font-display font-bold text-sm text-[#2B091C]">Aucune course enregistrée</h4>
            <p className="text-xs text-[#6E4F5D] max-w-sm mx-auto">
              Connecte ton compte Strava ou ajoute ta première sortie manuelle pour suivre ta progression.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => setShowAddManualModal(true)}
                className="px-4 py-2 rounded-full bg-[#831843] text-white text-xs font-bold"
              >
                Ajouter une course
              </button>
              <button
                onClick={handleLoadDemoStravaData}
                className="px-4 py-2 rounded-full bg-[#FFF0F5] text-[#831843] border border-[#FBCFE8] text-xs font-bold"
              >
                Importer démo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-4 sm:p-5 rounded-[24px] bg-white border border-[#FBCFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-[#F472B6] transition-all"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] flex items-center justify-center shrink-0 text-[#831843]">
                    <StreamlineIcon name="runner" className="w-5 h-5 text-[#EC4899]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-[#2B091C] truncate">{act.name}</h4>
                      {act.source === 'strava' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FC4C02]/10 text-[#FC4C02] text-[9px] font-bold uppercase tracking-wider shrink-0">
                          Strava
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#7A616F] block mt-0.5">
                      {new Date(act.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                      {act.shoes ? ` · Chaussures : ${act.shoes}` : ''}
                    </span>
                    {act.notes && <p className="text-xs text-[#5C3A4D] mt-1 line-clamp-1 italic">« {act.notes} »</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#FBCFE8]/60">
                  <div className="text-left sm:text-right">
                    <span className="font-mono font-bold text-base text-[#2B091C] block leading-none">
                      {act.distanceKm} km
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#831843] mt-0.5 block">
                      {act.averagePace} /km · {act.durationMinutes} min
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteActivity(act.id)}
                    className="p-2 rounded-full text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Supprimer la sortie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. BottomSheet Strava Import (Choix et Approbation par l'utilisateur) */}
      <BottomSheet
        isOpen={showStravaModal}
        onClose={() => setShowStravaModal(false)}
        title={
          <span className="flex items-center gap-2">
            <span className="text-[#FC4C02] font-extrabold">STRAVA</span>
            <span>Courses Détectées</span>
          </span>
        }
        subtitle="Choisis et valide les activités que tu souhaites importer dans ton journal de bord"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {stravaRawActivities.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <p className="text-xs text-[#6E4F5D]">Aucune sortie de course à pied trouvée sur Strava récemment.</p>
              <button
                onClick={handleLoadDemoStravaData}
                className="px-4 py-2 rounded-full bg-[#FFF0F5] text-[#831843] border border-[#FBCFE8] text-xs font-bold"
              >
                Charger des courses de test (Démo)
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {stravaRawActivities.map((raw) => {
                const isAlreadyImported = activities.some((a) => a.stravaActivityId === raw.id);
                const distKm = (raw.distance / 1000).toFixed(2);
                const durMin = Math.round(raw.moving_time / 60);

                const secPerKm = raw.distance > 0 ? raw.moving_time / (raw.distance / 1000) : 0;
                const paceMins = Math.floor(secPerKm / 60);
                const paceSecs = Math.round(secPerKm % 60);
                const paceStr = `${paceMins}:${paceSecs < 10 ? '0' : ''}${paceSecs}`;

                return (
                  <div
                    key={raw.id}
                    className="p-4 rounded-2xl bg-white border border-[#FBCFE8] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-[#2B091C] truncate">{raw.name}</span>
                        <span className="text-[10px] text-[#FC4C02] font-semibold">GPS</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6E4F5D] mt-0.5 font-mono">
                        <span>{distKm} km</span>
                        <span>·</span>
                        <span>{durMin} min</span>
                        <span>·</span>
                        <span className="text-[#831843] font-bold">{paceStr} /km</span>
                        {raw.total_elevation_gain > 0 && <span>· +{Math.round(raw.total_elevation_gain)}m D+</span>}
                      </div>
                      <span className="text-[10px] text-[#7A616F] block mt-0.5">
                        {new Date(raw.start_date_local).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div>
                      {isAlreadyImported ? (
                        <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Importée</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleImportStravaActivity(raw)}
                          className="px-3.5 py-1.5 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                          Importer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t border-[#FBCFE8]/60 flex justify-between items-center text-xs">
            <span className="text-[#6E4F5D]">
              {activities.filter((a) => a.source === 'strava').length} courses Strava synchronisées au total
            </span>
            <button
              type="button"
              onClick={() => setShowStravaModal(false)}
              className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-bold"
            >
              Terminé
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* 8. BottomSheet Ajout Manuel d'une Course */}
      <BottomSheet
        isOpen={showAddManualModal}
        onClose={() => setShowAddManualModal(false)}
        title="Ajouter une sortie de course"
        subtitle="Enregistre tes kilomètres même sans montre connectée"
      >
        <form onSubmit={handleAddManualRun} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-[#6E4F5D] uppercase block mb-1">Titre de la sortie</label>
            <input
              type="text"
              required
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="ex: Footing au parc, Sortie longue..."
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] text-[#2B091C] font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#6E4F5D] uppercase block mb-1">Distance (km)</label>
              <input
                type="number"
                step="0.01"
                required
                value={manualDistance}
                onChange={(e) => setManualDistance(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] text-[#2B091C] font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#6E4F5D] uppercase block mb-1">Durée (minutes)</label>
              <input
                type="number"
                required
                value={manualDuration}
                onChange={(e) => setManualDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] text-[#2B091C] font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#6E4F5D] uppercase block mb-1">Date</label>
              <input
                type="date"
                required
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] text-[#2B091C]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#6E4F5D] uppercase block mb-1">Dénivelé + (m)</label>
              <input
                type="number"
                value={manualElevation}
                onChange={(e) => setManualElevation(e.target.value)}
                placeholder="Optionnel (ex: 45)"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] text-[#2B091C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#6E4F5D] uppercase block mb-1">Chaussures utilisées</label>
              <input
                type="text"
                value={manualShoes}
                onChange={(e) => setManualShoes(e.target.value)}
                placeholder="ex: Asics Novablast"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] text-[#2B091C]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#6E4F5D] uppercase block mb-1">FC Moyenne (bpm)</label>
              <input
                type="number"
                value={manualHeartRate}
                onChange={(e) => setManualHeartRate(e.target.value)}
                placeholder="Optionnel (ex: 148)"
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] text-[#2B091C]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#6E4F5D] uppercase block mb-1">Ressenti de l’effort (1 à 5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setManualEffort(lvl)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    manualEffort >= lvl ? 'bg-[#EC4899] text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#6E4F5D] uppercase block mb-1">Notes & sensations</label>
            <textarea
              rows={2}
              value={manualNotes}
              onChange={(e) => setManualNotes(e.target.value)}
              placeholder="Sensations, météo, parcours..."
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#FFF9FC] border border-[#FBCFE8] text-[#2B091C]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#831843] hover:bg-[#500724] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Enregistrer ma course
          </button>
        </form>
      </BottomSheet>
    </div>
  );
};
