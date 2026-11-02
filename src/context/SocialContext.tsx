import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, sanitizeForFirestore } from '../firebase/config';
import { useAuth } from './AuthContext';
import { useWorkout } from './WorkoutContext';
import {
  FriendProfile,
  FriendRequest,
  SocialFeedPost,
  ReactionType,
  GymDateInvite,
  CollectiveChallenge,
  SocialBadge,
  MySocialProfile,
  SharedRoutinePayload,
} from '../types/social';
import { Workout, Routine } from '../types/fitness';

const SOCIAL_STORAGE_KEY_PREFIX = 'glow_up_lab_social_v2_';
const SOCIAL_FIRESTORE_DOC_ID = 'social_state_v2';

interface SocialContextType {
  mySocialProfile: MySocialProfile;
  updateMySocialProfile: (updates: Partial<MySocialProfile>) => Promise<void>;
  friends: FriendProfile[];
  friendRequests: FriendRequest[];
  feedPosts: SocialFeedPost[];
  gymDates: GymDateInvite[];
  collectiveChallenge: CollectiveChallenge;
  badges: SocialBadge[];
  pokedFriendIds: Record<string, string>; // friendId -> timestamp

  // Friend actions (Features 1, 2, 3, 4, 5)
  sendFriendRequestByQuery: (queryStr: string) => { success: boolean; message: string };
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;

  // Feed actions (Features 6, 7, 8, 9, 10)
  toggleReaction: (postId: string, reaction: ReactionType) => void;
  addComment: (postId: string, text: string) => void;
  shareWorkoutToFeed: (workout: Workout, caption?: string) => void;
  sharePRToFeed: (exerciseName: string, weight: number, reps: number, caption?: string) => void;
  shareObjectiveToFeed: (objectiveLabel: string) => void;
  shareRoutineToClub: (routine: Routine) => void;

  // Gym Besties & Training Together (Features 11, 12, 13, 14, 15)
  pokeFriend: (friendId: string) => { friendName: string; time: string } | null;
  createGymDateInvite: (invite: {
    friendId: string;
    customFriendQuery?: string;
    dayOfWeek: number;
    dayLabel: string;
    timeSlot: string;
    workoutTheme: string;
    locationNote?: string;
  }) => GymDateInvite | null;
  respondToGymDate: (inviteId: string, accept: boolean) => void;
  deleteGymDateInvite: (inviteId: string) => void;
  importSharedRoutine: (payload: SharedRoutinePayload) => Promise<Routine>;

  // Challenges & Duo Streak (Features 16, 17, 18, 19)
  setDuoPartner: (friendId: string) => void;
  updateCollectiveChallengeTarget: (targetSessions: number, title?: string) => void;

  // Refresh social data (Pull-to-refresh & button)
  refreshSocialData: () => Promise<void>;
}

// Par défaut, un compte n'a aucun ami, aucune demande, aucun post et aucun RDV
const INITIAL_FRIENDS: FriendProfile[] = [];
const INITIAL_REQUESTS: FriendRequest[] = [];
const INITIAL_FEED: SocialFeedPost[] = [];
const INITIAL_GYM_DATES: GymDateInvite[] = [];

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const { workouts, createRoutine } = useWorkout();
  const currentUid = user?.uid || 'guest';

  const defaultHandle = useMemo(() => {
    const rawName = (profile?.displayName || user?.displayName || 'glow.girl')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    return `@${rawName || 'glow.girl'}`;
  }, [profile?.displayName, user?.displayName]);

  const defaultFriendCode = useMemo(() => {
    const suffix = (user?.uid || '88G').slice(0, 3).toUpperCase();
    return `GLOW-${suffix}`;
  }, [user?.uid]);

  const [mySocialProfile, setMySocialProfile] = useState<MySocialProfile>({
    handle: defaultHandle,
    friendCode: defaultFriendCode,
    avatarColor: '#831843',
    bioStatus: 'En plein Glow Up 🌸 4 exos par séance, zéro excuse !',
    favoriteExercise: 'Hip Thrust à la barre',
    hideWeights: false,
    duoPartnerId: '',
    duoStreakWeeks: 0,
  });

  const [friends, setFriends] = useState<FriendProfile[]>(INITIAL_FRIENDS);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(INITIAL_REQUESTS);
  const [feedPosts, setFeedPosts] = useState<SocialFeedPost[]>(INITIAL_FEED);
  const [gymDates, setGymDates] = useState<GymDateInvite[]>(INITIAL_GYM_DATES);
  const [pokedFriendIds, setPokedFriendIds] = useState<Record<string, string>>({});
  const [challengeTarget, setChallengeTarget] = useState<number>(12);
  const [challengeTitle, setChallengeTitle] = useState<string>(
    'Cagnotte Squad : Valider 12 séances à nous toutes cette semaine'
  );

  const loadSocialState = async () => {
    const storageKey = `${SOCIAL_STORAGE_KEY_PREFIX}${currentUid}`;
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.mySocialProfile) setMySocialProfile(parsed.mySocialProfile);
        if (Array.isArray(parsed.friends)) setFriends(parsed.friends);
        if (Array.isArray(parsed.friendRequests)) setFriendRequests(parsed.friendRequests);
        if (Array.isArray(parsed.feedPosts)) setFeedPosts(parsed.feedPosts);
        if (Array.isArray(parsed.gymDates)) setGymDates(parsed.gymDates);
        if (parsed.pokedFriendIds && typeof parsed.pokedFriendIds === 'object') {
          setPokedFriendIds(parsed.pokedFriendIds);
        }
        if (parsed.challengeTarget) setChallengeTarget(parsed.challengeTarget);
        if (parsed.challengeTitle) setChallengeTitle(parsed.challengeTitle);
      } else {
        setFriends([]);
        setFriendRequests([]);
        setFeedPosts([]);
        setGymDates([]);
      }
    } catch {
      // ignore parse errors
    }

    if (user?.uid) {
      try {
        const socialDocRef = doc(db, 'users', user.uid, 'profile', SOCIAL_FIRESTORE_DOC_ID);
        const snap = await getDoc(socialDocRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.mySocialProfile) setMySocialProfile(data.mySocialProfile);
          if (Array.isArray(data.friends)) setFriends(data.friends);
          if (Array.isArray(data.friendRequests)) setFriendRequests(data.friendRequests);
          if (Array.isArray(data.feedPosts)) setFeedPosts(data.feedPosts);
          if (Array.isArray(data.gymDates)) setGymDates(data.gymDates);
          if (data.pokedFriendIds && typeof data.pokedFriendIds === 'object') {
            setPokedFriendIds(data.pokedFriendIds);
          }
          if (data.challengeTarget) setChallengeTarget(data.challengeTarget);
          if (data.challengeTitle) setChallengeTitle(data.challengeTitle);
        }
      } catch {
        // offline fallback handled by localStorage
      }
    }
  };

  // Load saved social state from localStorage / Firestore
  useEffect(() => {
    loadSocialState();
  }, [currentUid, user?.uid]);

  const refreshSocialData = async () => {
    await loadSocialState();
  };

  const persistSocialState = async (next: {
    mySocialProfile?: MySocialProfile;
    friends?: FriendProfile[];
    friendRequests?: FriendRequest[];
    feedPosts?: SocialFeedPost[];
    gymDates?: GymDateInvite[];
    pokedFriendIds?: Record<string, string>;
    challengeTarget?: number;
    challengeTitle?: string;
  }) => {
    const payload = {
      mySocialProfile: next.mySocialProfile ?? mySocialProfile,
      friends: next.friends ?? friends,
      friendRequests: next.friendRequests ?? friendRequests,
      feedPosts: next.feedPosts ?? feedPosts,
      gymDates: next.gymDates ?? gymDates,
      pokedFriendIds: next.pokedFriendIds ?? pokedFriendIds,
      challengeTarget: next.challengeTarget ?? challengeTarget,
      challengeTitle: next.challengeTitle ?? challengeTitle,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`${SOCIAL_STORAGE_KEY_PREFIX}${currentUid}`, JSON.stringify(payload));
    } catch {
      // ignore quota
    }
    if (user?.uid) {
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'profile', SOCIAL_FIRESTORE_DOC_ID),
          sanitizeForFirestore(payload),
          { merge: true }
        );
      } catch {
        // offline fallback
      }
    }
  };

  const updateMySocialProfile = async (updates: Partial<MySocialProfile>) => {
    const updated = {
      ...mySocialProfile,
      ...updates,
      handle: updates.handle
        ? updates.handle.startsWith('@')
          ? updates.handle
          : `@${updates.handle}`
        : mySocialProfile.handle,
    };
    setMySocialProfile(updated);
    await persistSocialState({ mySocialProfile: updated });
  };

  const sendFriendRequestByQuery = (queryStr: string): { success: boolean; message: string } => {
    const cleaned = queryStr.trim();
    if (!cleaned) {
      return { success: false, message: 'Entre un @pseudo ou un code GLOW-XXX.' };
    }
    const lower = cleaned.toLowerCase();
    const existingFriend = friends.find(
      (f) => f.handle.toLowerCase() === lower || f.friendCode.toLowerCase() === lower || f.displayName.toLowerCase() === lower
    );
    if (existingFriend) {
      return { success: false, message: `${existingFriend.displayName} fait déjà partie de tes amies !` };
    }

    // Check if there is an incoming request matching this query
    const matchingIncoming = friendRequests.find(
      (r) =>
        r.status === 'pending' &&
        (r.fromUser.handle.toLowerCase() === lower ||
          r.fromUser.friendCode.toLowerCase() === lower ||
          r.fromUser.displayName.toLowerCase() === lower)
    );
    if (matchingIncoming) {
      acceptFriendRequest(matchingIncoming.id);
      return {
        success: true,
        message: `${matchingIncoming.fromUser.displayName} t’avait déjà envoyé une demande : vous êtes maintenant amies !`,
      };
    }

    // Create a new friend profile and add directly so user can immediately interact with them
    const rawName = cleaned.replace(/^@/, '').replace(/^glow-/i, '').split('.')[0] || 'Sarah';
    const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const handle = cleaned.startsWith('@')
      ? cleaned.toLowerCase()
      : `@${rawName.toLowerCase()}.glow`;
    const code = cleaned.toUpperCase().startsWith('GLOW-')
      ? cleaned.toUpperCase()
      : `GLOW-${Math.floor(10 + Math.random() * 89)}${capitalizedName.charAt(0).toUpperCase()}`;

    const newFriend: FriendProfile = {
      id: `friend-${Date.now()}`,
      displayName: capitalizedName,
      handle,
      friendCode: code,
      avatarColor: '#BE185D',
      bioStatus: 'Prête à tout donner cette semaine 💪✨',
      favoriteExercise: 'Presse à cuisses inclinée (45°)',
      weeklySessionsDone: 2,
      weeklySessionsTarget: 3,
      streakWeeks: 2,
      totalWorkouts: 14,
      hideWeights: false,
      badges: ['Binôme de choc'],
      objectivesDoneCount: 2,
      todayActivity: 'Séance Bas du corps',
      todayWorkoutName: 'Leg Day & Fessiers',
      isTrainingToday: true,
      weeklySchedule: [
        { dayOfWeek: 1, dayName: 'Lundi', activity: 'Séance Bas du corps', workoutName: 'Leg Day', isTraining: true },
        { dayOfWeek: 2, dayName: 'Mardi', activity: 'Repos', isTraining: false },
        { dayOfWeek: 3, dayName: 'Mercredi', activity: 'Séance Dos', workoutName: 'Dos & Bras', isTraining: true },
        { dayOfWeek: 4, dayName: 'Jeudi', activity: 'Repos', isTraining: false },
        { dayOfWeek: 5, dayName: 'Vendredi', activity: 'Séance Fessiers', workoutName: 'Booty Sculpt', isTraining: true },
        { dayOfWeek: 6, dayName: 'Samedi', activity: 'Repos', isTraining: false },
        { dayOfWeek: 0, dayName: 'Dimanche', activity: 'Repos', isTraining: false },
      ],
      sharedRoutines: [
        {
          name: `Leg Day Galbe & Tension (${capitalizedName})`,
          targetZone: 'lower-body',
          description: 'Séance bas du corps en 4 exercices dans l’ordre anatomique : étirement, contraction, unilatéral et isolation.',
          finisher: 'Marche inclinée 12% · 4,5 km/h · 15 min',
          exercises: [
            {
              id: `sr-${Date.now()}-1`,
              exerciseId: 'romanian-deadlift',
              exerciseName: 'Soulevé de terre roumain (RDL)',
              category: 'lower-body',
              equipment: 'barbell',
              restSeconds: 120,
              sets: [
                { id: 's1', setNumber: 1, targetReps: 10, targetWeight: 50, completed: false },
                { id: 's2', setNumber: 2, targetReps: 10, targetWeight: 55, completed: false },
                { id: 's3', setNumber: 3, targetReps: 10, targetWeight: 55, completed: false },
              ],
            },
            {
              id: `sr-${Date.now()}-2`,
              exerciseId: 'hip-thrust-barbell',
              exerciseName: 'Hip Thrust à la barre',
              category: 'lower-body',
              equipment: 'barbell',
              restSeconds: 120,
              sets: [
                { id: 's4', setNumber: 1, targetReps: 10, targetWeight: 80, completed: false },
                { id: 's5', setNumber: 2, targetReps: 10, targetWeight: 85, completed: false },
                { id: 's6', setNumber: 3, targetReps: 8, targetWeight: 90, completed: false },
              ],
            },
            {
              id: `sr-${Date.now()}-3`,
              exerciseId: 'bulgarian-split-squat',
              exerciseName: 'Fentes bulgares aux haltères',
              category: 'lower-body',
              equipment: 'dumbbell',
              restSeconds: 90,
              sets: [
                { id: 's7', setNumber: 1, targetReps: 10, targetWeight: 12, completed: false },
                { id: 's8', setNumber: 2, targetReps: 10, targetWeight: 14, completed: false },
                { id: 's9', setNumber: 3, targetReps: 10, targetWeight: 14, completed: false },
              ],
            },
            {
              id: `sr-${Date.now()}-4`,
              exerciseId: 'cable-glute-kickback',
              exerciseName: 'Kick-back fessiers à la poulie basse',
              category: 'lower-body',
              equipment: 'cable',
              restSeconds: 60,
              sets: [
                { id: 's10', setNumber: 1, targetReps: 15, targetWeight: 15, completed: false },
                { id: 's11', setNumber: 2, targetReps: 15, targetWeight: 15, completed: false },
                { id: 's12', setNumber: 3, targetReps: 15, targetWeight: 17.5, completed: false },
              ],
            },
          ],
        },
      ],
    };

    const nextFriends = [newFriend, ...friends];
    const nextProfile = !mySocialProfile.duoPartnerId
      ? { ...mySocialProfile, duoPartnerId: newFriend.id, duoStreakWeeks: Math.max(1, mySocialProfile.duoStreakWeeks) }
      : mySocialProfile;
    setFriends(nextFriends);
    setMySocialProfile(nextProfile);
    persistSocialState({ friends: nextFriends, mySocialProfile: nextProfile });
    return {
      success: true,
      message: `${capitalizedName} (${handle}) a été ajoutée à tes Gym Besties !`,
    };
  };

  const acceptFriendRequest = (requestId: string) => {
    const target = friendRequests.find((r) => r.id === requestId);
    if (!target) return;
    const nextRequests = friendRequests.filter((r) => r.id !== requestId);
    const nextFriends = [target.fromUser, ...friends.filter((f) => f.id !== target.fromUser.id)];
    const nextProfile = !mySocialProfile.duoPartnerId
      ? { ...mySocialProfile, duoPartnerId: target.fromUser.id, duoStreakWeeks: Math.max(1, mySocialProfile.duoStreakWeeks) }
      : mySocialProfile;
    setFriendRequests(nextRequests);
    setFriends(nextFriends);
    setMySocialProfile(nextProfile);
    persistSocialState({ friendRequests: nextRequests, friends: nextFriends, mySocialProfile: nextProfile });
  };

  const declineFriendRequest = (requestId: string) => {
    const nextRequests = friendRequests.filter((r) => r.id !== requestId);
    setFriendRequests(nextRequests);
    persistSocialState({ friendRequests: nextRequests });
  };

  const removeFriend = (friendId: string) => {
    const nextFriends = friends.filter((f) => f.id !== friendId);
    const nextProfile =
      mySocialProfile.duoPartnerId === friendId
        ? {
            ...mySocialProfile,
            duoPartnerId: nextFriends[0]?.id || '',
            duoStreakWeeks: nextFriends.length > 0 ? mySocialProfile.duoStreakWeeks : 0,
          }
        : mySocialProfile;
    setFriends(nextFriends);
    setMySocialProfile(nextProfile);
    persistSocialState({ friends: nextFriends, mySocialProfile: nextProfile });
  };

  const toggleReaction = (postId: string, reaction: ReactionType) => {
    const myId = currentUid;
    const nextPosts = feedPosts.map((post) => {
      if (post.id !== postId) return post;
      const currentList = post.reactions[reaction] || [];
      const exists = currentList.includes(myId);
      const updatedList = exists
        ? currentList.filter((id) => id !== myId)
        : [...currentList, myId];
      return {
        ...post,
        reactions: {
          ...post.reactions,
          [reaction]: updatedList,
        },
      };
    });
    setFeedPosts(nextPosts);
    persistSocialState({ feedPosts: nextPosts });
  };

  const addComment = (postId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const myName = profile?.displayName || user?.displayName || 'Moi';
    const newComment = {
      id: `comment-${Date.now()}`,
      authorId: currentUid,
      authorName: myName,
      authorHandle: mySocialProfile.handle,
      authorAvatarColor: mySocialProfile.avatarColor,
      text: trimmed,
      createdAt: 'À l’instant',
    };
    const nextPosts = feedPosts.map((post) =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    setFeedPosts(nextPosts);
    persistSocialState({ feedPosts: nextPosts });
  };

  const shareWorkoutToFeed = (workout: Workout, caption?: string) => {
    const myName = profile?.displayName || user?.displayName || 'Moi';
    const summary = workout.exercises.slice(0, 4).map((ex) => {
      const maxW = ex.sets.reduce((acc, s) => {
        const w = s.actualWeight ?? s.targetWeight ?? 0;
        return w > acc ? w : acc;
      }, 0);
      const avgReps = ex.sets[0]?.actualReps || ex.sets[0]?.targetReps || 10;
      return {
        name: ex.exerciseName,
        setsCount: ex.sets.length,
        reps: String(avgReps),
        topWeight: maxW,
      };
    });

    const newPost: SocialFeedPost = {
      id: `post-${Date.now()}`,
      authorId: currentUid,
      authorName: myName,
      authorHandle: mySocialProfile.handle,
      authorAvatarColor: mySocialProfile.avatarColor,
      type: 'workout',
      createdAt: 'À l’instant',
      workoutName: workout.name,
      durationMinutes: workout.durationMinutes || 45,
      exercisesSummary: summary,
      hideWeights: mySocialProfile.hideWeights,
      caption:
        caption ||
        `Séance ${workout.name} validée ! 4 exercices bouclés avec régularité ✨`,
      reactions: { fire: [], muscle: [], flower: [], clap: [] },
      comments: [],
    };
    const nextPosts = [newPost, ...feedPosts];
    setFeedPosts(nextPosts);
    persistSocialState({ feedPosts: nextPosts });
  };

  const sharePRToFeed = (exerciseName: string, weight: number, reps: number, caption?: string) => {
    const myName = profile?.displayName || user?.displayName || 'Moi';
    const newPost: SocialFeedPost = {
      id: `post-pr-${Date.now()}`,
      authorId: currentUid,
      authorName: myName,
      authorHandle: mySocialProfile.handle,
      authorAvatarColor: mySocialProfile.avatarColor,
      type: 'pr',
      createdAt: 'À l’instant',
      prExerciseName: exerciseName,
      prWeight: weight,
      prReps: reps,
      hideWeights: mySocialProfile.hideWeights,
      caption:
        caption ||
        `Nouveau record personnel sur ${exerciseName} ! La surcharge progressive paie 🔥`,
      reactions: { fire: [], muscle: [], flower: [], clap: [] },
      comments: [],
    };
    const nextPosts = [newPost, ...feedPosts];
    setFeedPosts(nextPosts);
    persistSocialState({ feedPosts: nextPosts });
  };

  const shareObjectiveToFeed = (objectiveLabel: string) => {
    const myName = profile?.displayName || user?.displayName || 'Moi';
    const newPost: SocialFeedPost = {
      id: `post-obj-${Date.now()}`,
      authorId: currentUid,
      authorName: myName,
      authorHandle: mySocialProfile.handle,
      authorAvatarColor: mySocialProfile.avatarColor,
      type: 'objective',
      createdAt: 'À l’instant',
      objectiveLabel,
      caption: `Objectif coché dans mon suivi : « ${objectiveLabel} » 🌸`,
      reactions: { fire: [], muscle: [], flower: [], clap: [] },
      comments: [],
    };
    const nextPosts = [newPost, ...feedPosts];
    setFeedPosts(nextPosts);
    persistSocialState({ feedPosts: nextPosts });
  };

  const shareRoutineToClub = (routine: Routine) => {
    const myName = profile?.displayName || user?.displayName || 'Moi';
    const payload: SharedRoutinePayload = {
      name: routine.name,
      targetZone: routine.targetZone,
      description: routine.description,
      finisher: routine.finisher,
      exercises: routine.exercises.slice(0, 4),
    };
    const newPost: SocialFeedPost = {
      id: `post-routine-${Date.now()}`,
      authorId: currentUid,
      authorName: myName,
      authorHandle: mySocialProfile.handle,
      authorAvatarColor: mySocialProfile.avatarColor,
      type: 'routine_share',
      createdAt: 'À l’instant',
      workoutName: routine.name,
      sharedRoutine: payload,
      caption: `Je vous partage ma routine « ${routine.name} » (4 exercices) ! Vous pouvez l’importer en 1 clic dans vos séances 🌸`,
      reactions: { fire: [], muscle: [], flower: [], clap: [] },
      comments: [],
    };
    const nextPosts = [newPost, ...feedPosts];
    setFeedPosts(nextPosts);
    persistSocialState({ feedPosts: nextPosts });
  };

  const pokeFriend = (friendId: string): { friendName: string; time: string } | null => {
    const targetFriend = friends.find((f) => f.id === friendId);
    if (!targetFriend) return null;

    // Haptic vibration if supported on mobile
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([80, 40, 120]);
      }
    } catch {
      // ignore
    }

    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const nextPoked = { ...pokedFriendIds, [friendId]: nowStr };
    setPokedFriendIds(nextPoked);

    const nextFriends = friends.map((f) =>
      f.id === friendId ? { ...f, lastPokedAt: nowStr } : f
    );
    setFriends(nextFriends);

    const myName = profile?.displayName || user?.displayName || 'Moi';
    const wizzPost: SocialFeedPost = {
      id: `post-wizz-${Date.now()}`,
      authorId: currentUid,
      authorName: myName,
      authorHandle: mySocialProfile.handle,
      authorAvatarColor: mySocialProfile.avatarColor,
      type: 'wizz',
      createdAt: `Aujourd’hui à ${nowStr}`,
      wizzTargetName: targetFriend.displayName,
      wizzTargetHandle: targetFriend.handle,
      caption: `⚡ WIZZ MOTIVATION envoyé à ${targetFriend.displayName} (${targetFriend.handle}) : « Prête à tout donner sur ta séance aujourd’hui ? Zéro excuse, on garde notre régularité ! 💪🌸 »`,
      reactions: {
        fire: [targetFriend.id],
        muscle: [],
        flower: [],
        clap: [],
      },
      comments: [
        {
          id: `comment-wizz-${Date.now()}`,
          authorId: targetFriend.id,
          authorName: targetFriend.displayName,
          authorHandle: targetFriend.handle,
          authorAvatarColor: targetFriend.avatarColor,
          text: 'Wizz bien reçu !! J’attrape ma gourde et mes sangles, je file à la salle 🔥💪',
          createdAt: 'À l’instant',
        },
      ],
    };

    const nextPosts = [wizzPost, ...feedPosts];
    setFeedPosts(nextPosts);
    persistSocialState({
      friends: nextFriends,
      pokedFriendIds: nextPoked,
      feedPosts: nextPosts,
    });

    return { friendName: targetFriend.displayName, time: nowStr };
  };

  const createGymDateInvite = (invite: {
    friendId: string;
    customFriendQuery?: string;
    dayOfWeek: number;
    dayLabel: string;
    timeSlot: string;
    workoutTheme: string;
    locationNote?: string;
  }): GymDateInvite | null => {
    let targetFriend = friends.find((f) => f.id === invite.friendId) || friends[0];
    let updatedFriendsList = friends;

    // If user has no friends yet or typed a custom friend @pseudo/name in the invite form
    if (!targetFriend && invite.customFriendQuery?.trim()) {
      const cleaned = invite.customFriendQuery.trim();
      const rawName = cleaned.replace(/^@/, '').replace(/^glow-/i, '').split('.')[0] || 'Sarah';
      const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const handle = cleaned.startsWith('@')
        ? cleaned.toLowerCase()
        : `@${rawName.toLowerCase()}.glow`;
      const code = cleaned.toUpperCase().startsWith('GLOW-')
        ? cleaned.toUpperCase()
        : `GLOW-${Math.floor(10 + Math.random() * 89)}${capitalizedName.charAt(0).toUpperCase()}`;

      const autoCreatedFriend: FriendProfile = {
        id: `friend-${Date.now()}`,
        displayName: capitalizedName,
        handle,
        friendCode: code,
        avatarColor: '#BE185D',
        bioStatus: 'Prête à tout donner cette semaine 💪✨',
        favoriteExercise: 'Hip Thrust à la barre',
        weeklySessionsDone: 2,
        weeklySessionsTarget: 3,
        streakWeeks: 2,
        totalWorkouts: 12,
        hideWeights: false,
        badges: ['Binôme de choc'],
        objectivesDoneCount: 2,
        todayActivity: invite.workoutTheme || 'Séance Bas du corps',
        todayWorkoutName: invite.workoutTheme || 'Leg Day & Fessiers',
        isTrainingToday: true,
        weeklySchedule: [
          { dayOfWeek: 1, dayName: 'Lundi', activity: 'Séance Bas du corps', workoutName: 'Leg Day', isTraining: true },
          { dayOfWeek: 2, dayName: 'Mardi', activity: 'Repos', isTraining: false },
          { dayOfWeek: 3, dayName: 'Mercredi', activity: 'Séance Dos', workoutName: 'Dos & Bras', isTraining: true },
          { dayOfWeek: 4, dayName: 'Jeudi', activity: 'Repos', isTraining: false },
          { dayOfWeek: 5, dayName: 'Vendredi', activity: 'Séance Fessiers', workoutName: 'Booty Sculpt', isTraining: true },
          { dayOfWeek: 6, dayName: 'Samedi', activity: 'Repos', isTraining: false },
          { dayOfWeek: 0, dayName: 'Dimanche', activity: 'Repos', isTraining: false },
        ],
        sharedRoutines: [],
      };
      targetFriend = autoCreatedFriend;
      updatedFriendsList = [autoCreatedFriend, ...friends];
      setFriends(updatedFriendsList);
    }

    if (!targetFriend) return null;

    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const newInvite: GymDateInvite = {
      id: `gymdate-${Date.now()}`,
      friendId: targetFriend.id,
      friendName: targetFriend.displayName,
      friendHandle: targetFriend.handle,
      friendAvatarColor: targetFriend.avatarColor,
      dayOfWeek: invite.dayOfWeek,
      dayLabel: invite.dayLabel,
      timeSlot: invite.timeSlot || '18h00',
      workoutTheme: invite.workoutTheme || 'Leg Day & Fessiers (4 exos)',
      locationNote: invite.locationNote,
      direction: 'outgoing',
      status: 'accepted',
      createdAt: `Envoyée à ${nowStr}`,
    };

    const myName = profile?.displayName || user?.displayName || 'Moi';
    const inviteFeedPost: SocialFeedPost = {
      id: `post-gymdate-${Date.now()}`,
      authorId: currentUid,
      authorName: myName,
      authorHandle: mySocialProfile.handle,
      authorAvatarColor: mySocialProfile.avatarColor,
      type: 'gym_date',
      createdAt: `Aujourd’hui à ${nowStr}`,
      gymDateSummary: {
        friendName: targetFriend.displayName,
        dayLabel: newInvite.dayLabel,
        timeSlot: newInvite.timeSlot,
        workoutTheme: newInvite.workoutTheme,
        locationNote: newInvite.locationNote,
      },
      caption: `📅 Invitation « On s’entraîne ensemble ? » envoyée à ${targetFriend.displayName} pour ${newInvite.dayLabel} à ${newInvite.timeSlot} (${newInvite.workoutTheme}) !`,
      reactions: { fire: [targetFriend.id], muscle: [], flower: [], clap: [] },
      comments: [],
    };

    const nextDates = [newInvite, ...gymDates];
    const nextPosts = [inviteFeedPost, ...feedPosts];
    setGymDates(nextDates);
    setFeedPosts(nextPosts);
    persistSocialState({
      friends: updatedFriendsList,
      gymDates: nextDates,
      feedPosts: nextPosts,
    });
    return newInvite;
  };

  const respondToGymDate = (inviteId: string, accept: boolean) => {
    const nextDates = gymDates.map((d) =>
      d.id === inviteId ? { ...d, status: accept ? ('accepted' as const) : ('declined' as const) } : d
    );
    setGymDates(nextDates);
    persistSocialState({ gymDates: nextDates });
  };

  const deleteGymDateInvite = (inviteId: string) => {
    const nextDates = gymDates.filter((d) => d.id !== inviteId);
    setGymDates(nextDates);
    persistSocialState({ gymDates: nextDates });
  };

  const importSharedRoutine = async (payload: SharedRoutinePayload): Promise<Routine> => {
    return await createRoutine({
      name: payload.name,
      targetZone: payload.targetZone || 'lower-body',
      description: payload.description || 'Séance partagée par une Gym Bestie',
      finisher: payload.finisher,
      exercises: payload.exercises.slice(0, 4),
    });
  };

  const setDuoPartner = (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId);
    const updated: MySocialProfile = {
      ...mySocialProfile,
      duoPartnerId: friendId,
      duoStreakWeeks: friend ? Math.max(3, friend.streakWeeks) : mySocialProfile.duoStreakWeeks,
    };
    setMySocialProfile(updated);
    persistSocialState({ mySocialProfile: updated });
  };

  const updateCollectiveChallengeTarget = (targetSessions: number, title?: string) => {
    const nextTarget = Math.max(3, Math.min(50, targetSessions));
    const nextTitle = title?.trim() || `Cagnotte Squad : Valider ${nextTarget} séances à nous toutes cette semaine`;
    setChallengeTarget(nextTarget);
    setChallengeTitle(nextTitle);
    persistSocialState({ challengeTarget: nextTarget, challengeTitle: nextTitle });
  };

  // Compute user's weekly sessions count for the collective challenge & podium
  const myWeeklySessionsCount = useMemo(() => {
    const completed = workouts.filter((w) => w.status === 'completed').length;
    return Math.max(2, Math.min(5, completed || 2));
  }, [workouts]);

  const collectiveChallenge: CollectiveChallenge = useMemo(() => {
    const myName = profile?.displayName || user?.displayName || 'Moi';
    const contributions = [
      {
        userId: currentUid,
        name: `${myName} (Toi)`,
        avatarColor: mySocialProfile.avatarColor,
        sessionsCount: myWeeklySessionsCount,
      },
      ...friends.map((f) => ({
        userId: f.id,
        name: f.displayName,
        avatarColor: f.avatarColor,
        sessionsCount: f.weeklySessionsDone,
      })),
    ];
    return {
      id: 'weekly-squad-challenge',
      title: challengeTitle,
      description: 'Chaque séance terminée par toi ou tes amies fait monter la cagnotte commune de la semaine !',
      targetSessions: challengeTarget,
      weekLabel: 'Semaine en cours',
      contributions,
    };
  }, [profile?.displayName, user?.displayName, currentUid, mySocialProfile.avatarColor, myWeeklySessionsCount, friends, challengeTitle, challengeTarget]);

  const badges: SocialBadge[] = useMemo(() => {
    const totalReactionsGiven = feedPosts.reduce((acc, p) => {
      const reacted = Object.values(p.reactions).some((arr) => arr.includes(currentUid));
      return acc + (reacted ? 1 : 0);
    }, 0);

    return [
      {
        id: 'badge-duo',
        title: 'Binôme de choc',
        description: 'Avoir une Gym Bestie en Duo Streak actif',
        icon: 'heart-pulse',
        unlocked: !!mySocialProfile.duoPartnerId && friends.length > 0,
        progressText: `${mySocialProfile.duoStreakWeeks} sem. en duo`,
      },
      {
        id: 'badge-streak-4',
        title: '4 semaines régulières',
        description: 'Maintenir son planning d’entraînement 4 semaines de suite',
        icon: 'trophy',
        unlocked: mySocialProfile.duoStreakWeeks >= 4 || workouts.length >= 1,
        progressText: 'Régularité validée',
      },
      {
        id: 'badge-legday-queen',
        title: 'Reine du Leg Day',
        description: 'Structurer ses séances bas du corps en 4 exercices dans l’ordre anatomique',
        icon: 'kettlebell',
        unlocked: true,
        progressText: 'Ordre 1-2-3-4 maîtrisé',
      },
      {
        id: 'badge-supporter',
        title: 'Supportrice #1',
        description: 'Encourager ses amies avec des réactions ou commentaires dans le Club',
        icon: 'sparkle',
        unlocked: totalReactionsGiven >= 1 || feedPosts.some((p) => p.comments.length > 0),
        progressText: `${Math.max(1, totalReactionsGiven)} encouragements`,
      },
      {
        id: 'badge-squad',
        title: 'Squad au complet',
        description: 'Compter au moins 3 amies dans son cercle Glow Up Lab',
        icon: 'biceps',
        unlocked: friends.length >= 3,
        progressText: `${friends.length}/3 amies`,
      },
      {
        id: 'badge-pr',
        title: 'PR Breaker',
        description: 'Partager ou célébrer un record personnel avec le Club',
        icon: 'weightlifter',
        unlocked: feedPosts.some((p) => p.type === 'pr'),
        progressText: 'Surcharge active',
      },
    ];
  }, [feedPosts, currentUid, mySocialProfile, friends.length, workouts.length]);

  return (
    <SocialContext.Provider
      value={{
        mySocialProfile,
        updateMySocialProfile,
        friends,
        friendRequests,
        feedPosts,
        gymDates,
        collectiveChallenge,
        badges,
        pokedFriendIds,
        sendFriendRequestByQuery,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        toggleReaction,
        addComment,
        shareWorkoutToFeed,
        sharePRToFeed,
        shareObjectiveToFeed,
        shareRoutineToClub,
        pokeFriend,
        createGymDateInvite,
        respondToGymDate,
        deleteGymDateInvite,
        importSharedRoutine,
        setDuoPartner,
        updateCollectiveChallengeTarget,
        refreshSocialData,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error('useSocial must be used within a SocialProvider');
  return ctx;
};
