import React, { useState, useMemo, useRef } from 'react';
import {
  UserPlus,
  Copy,
  Check,
  EyeOff,
  Eye,
  MessageCircle,
  Send,
  Calendar,
  Download,
  Sparkles,
  Flame,
  Trophy,
  Zap,
  Edit3,
  X,
  RefreshCw,
  ArrowDown,
  Trash2,
  Share2,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { StreamlineIcon } from '../ui/StreamlineIcon';
import { BottomSheet } from '../ui/BottomSheet';
import { StoryRecapModal } from './StoryRecapModal';
import { FriendProfile, ReactionType, SharedRoutinePayload } from '../../types/social';

type SocialSubTab = 'feed' | 'besties' | 'challenges' | 'friends';

const REACTION_META: {
  key: ReactionType;
  emoji: string;
  label: string;
}[] = [
  { key: 'fire', emoji: '🔥', label: 'En feu' },
  { key: 'muscle', emoji: '💪', label: 'Solide' },
  { key: 'flower', emoji: '🌸', label: 'Glow up' },
  { key: 'clap', emoji: '👏', label: 'Bravo' },
];

export const SocialView: React.FC = () => {
  const { user, profile } = useAuth();
  const { workouts, routines, weeklyPlans } = useWorkout();
  const {
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
    renameFriend,
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
  } = useSocial();

  const currentUid = user?.uid || 'guest';
  const myDisplayName = profile?.displayName || user?.displayName || 'Mon Espace';

  const [subTab, setSubTab] = useState<SocialSubTab>('feed');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pull-to-refresh & Manual Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartYRef = useRef<number | null>(null);
  const PULL_THRESHOLD = 65;

  // Wizz animation state
  const [wizzBanner, setWizzBanner] = useState<{ friendName: string; time: string } | null>(null);
  const [isWizzShaking, setIsWizzShaking] = useState(false);

  // Highlight newly created gym date
  const [highlightedInviteId, setHighlightedInviteId] = useState<string | null>(null);
  const gymDatesSectionRef = useRef<HTMLDivElement | null>(null);

  // Feed comment inputs
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>('post-1');

  // Modals & Filter state
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [selectedFriendProfile, setSelectedFriendProfile] = useState<FriendProfile | null>(null);
  const [feedFilter, setFeedFilter] = useState<'all' | 'friends' | 'mine'>('all');

  // Rename Friend state
  const [renamingFriend, setRenamingFriend] = useState<FriendProfile | null>(null);
  const [renameDisplayName, setRenameDisplayName] = useState('');
  const [renameHandle, setRenameHandle] = useState('');
  const [renameBio, setRenameBio] = useState('');

  // PR form state
  const [prExerciseName, setPrExerciseName] = useState('Hip Thrust à la barre');
  const [prWeight, setPrWeight] = useState('90');
  const [prReps, setPrReps] = useState('8');
  const [prCaption, setPrCaption] = useState('');

  // Besties tab state (Schedule Comparator & Gym Date Invite)
  const [compareFriendId, setCompareFriendId] = useState<string>(
    friends[0]?.id || ''
  );
  const [inviteFriendId, setInviteFriendId] = useState<string>(friends[0]?.id || '');
  const [customInviteFriendQuery, setCustomInviteFriendQuery] = useState<string>('');
  const [inviteDayOfWeek, setInviteDayOfWeek] = useState<number>(5);
  const [inviteTimeSlot, setInviteTimeSlot] = useState<string>('18h00');
  const [inviteTheme, setInviteTheme] = useState<string>('Leg Day & Fessiers (4 exos)');
  const [inviteNote, setInviteNote] = useState<string>(
    'On pense à nos sangles de cheville et notre gourde !'
  );
  const [importedRoutineNames, setImportedRoutineNames] = useState<Record<string, boolean>>({});

  // Friends & Profile tab state
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [friendCustomNameInput, setFriendCustomNameInput] = useState('');
  const [isEditingMyCard, setIsEditingMyCard] = useState(false);
  const [editHandle, setEditHandle] = useState(mySocialProfile.handle);
  const [editBio, setEditBio] = useState(mySocialProfile.bioStatus);
  const [editFavExercise, setEditFavExercise] = useState(mySocialProfile.favoriteExercise);

  // Challenge target editor
  const [isEditingChallenge, setIsEditingChallenge] = useState(false);
  const [customTargetInput, setCustomTargetInput] = useState(
    String(collectiveChallenge.targetSessions)
  );

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3600);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await refreshSocialData();
      await new Promise((r) => setTimeout(r, 450));
      triggerToast('Fil, amies et invitations actualisés ✓');
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 10 && !isRefreshing) {
      touchStartYRef.current = e.touches[0].clientY;
    } else {
      touchStartYRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || isRefreshing) return;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0 && window.scrollY <= 10) {
      const damped = Math.min(110, Math.round(deltaY * 0.5));
      setPullDistance(damped);
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartYRef.current === null) return;
    touchStartYRef.current = null;
    if (pullDistance >= PULL_THRESHOLD) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
  };

  const handleTriggerWizz = (friend: FriendProfile) => {
    const res = pokeFriend(friend.id);
    const friendName = res?.friendName || friend.displayName;
    const time = res?.time || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    setIsWizzShaking(true);
    setWizzBanner({ friendName, time });
    triggerToast(
      `⚡ WIZZ envoyé à ${friendName} ! Retrouve son retour dans le Fil & Activité.`
    );

    setTimeout(() => setIsWizzShaking(false), 700);
    setTimeout(() => setWizzBanner(null), 4500);
  };

  const pendingIncomingRequests = useMemo(
    () => friendRequests.filter((r) => r.status === 'pending' && r.direction === 'incoming'),
    [friendRequests]
  );

  const comparedFriend = useMemo(
    () => friends.find((f) => f.id === compareFriendId) || friends[0],
    [friends, compareFriendId]
  );

  const duoPartner = useMemo(
    () => friends.find((f) => f.id === mySocialProfile.duoPartnerId) || friends[0],
    [friends, mySocialProfile.duoPartnerId]
  );

  // Total collective challenge progress
  const totalSquadSessions = useMemo(
    () => collectiveChallenge.contributions.reduce((acc, c) => acc + c.sessionsCount, 0),
    [collectiveChallenge]
  );
  const squadProgressPct = Math.min(
    100,
    Math.round((totalSquadSessions / Math.max(1, collectiveChallenge.targetSessions)) * 100)
  );

  // Podium de régularité bienveillant (Feature #18)
  const regularityLeaderboard = useMemo(() => {
    const completedWorkoutsCount = Math.max(
      2,
      workouts.filter((w) => w.status === 'completed').length || 2
    );
    const entries = [
      {
        id: currentUid,
        name: `${myDisplayName} (Toi)`,
        handle: mySocialProfile.handle,
        avatarColor: mySocialProfile.avatarColor,
        sessionsDone: completedWorkoutsCount,
        sessionsTarget: 3,
        streakWeeks: mySocialProfile.duoStreakWeeks,
        objectivesDone: 3,
        score: Math.min(100, Math.round((completedWorkoutsCount / 3) * 100)),
      },
      ...friends.map((f) => ({
        id: f.id,
        name: f.displayName,
        handle: f.handle,
        avatarColor: f.avatarColor,
        sessionsDone: f.weeklySessionsDone,
        sessionsTarget: f.weeklySessionsTarget,
        streakWeeks: f.streakWeeks,
        objectivesDone: f.objectivesDoneCount,
        score: Math.min(
          100,
          Math.round((f.weeklySessionsDone / Math.max(1, f.weeklySessionsTarget)) * 100)
        ),
      })),
    ];
    return entries.sort((a, b) => b.score - a.score || b.streakWeeks - a.streakWeeks);
  }, [workouts, currentUid, myDisplayName, mySocialProfile, friends]);

  const handleImportRoutine = async (payload: SharedRoutinePayload) => {
    await importSharedRoutine(payload);
    setImportedRoutineNames((prev) => ({ ...prev, [payload.name]: true }));
    triggerToast(`La séance « ${payload.name} » a été ajoutée à tes routines !`);
  };

  const handleCopyInviteLink = () => {
    const url = `${window.location.origin}/?invite=${mySocialProfile.friendCode}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    triggerToast(`Lien d’invitation copié (${mySocialProfile.friendCode}) !`);
  };

  const handleShareValidatedObjectives = () => {
    let label = 'Réaliser mes 3 séances complètes de la semaine';
    try {
      const saved = localStorage.getItem('glowup_suivi_objectives_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const completedObj = parsed.find((o) => o.completed) || parsed[0];
          if (completedObj?.label) label = completedObj.label;
        }
      }
    } catch {
      // ignore
    }
    shareObjectiveToFeed(label);
    triggerToast('Ton objectif du moment a été partagé dans le Fil !');
  };

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = sendFriendRequestByQuery(friendSearchQuery, friendCustomNameInput);
    triggerToast(res.message);
    if (res.success) {
      setFriendSearchQuery('');
      setFriendCustomNameInput('');
    }
  };

  const handleOpenRenameFriend = (friend: FriendProfile) => {
    setRenamingFriend(friend);
    setRenameDisplayName(friend.displayName);
    setRenameHandle(friend.handle);
    setRenameBio(friend.bioStatus);
  };

  const handleSaveRenamedFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingFriend || !renameDisplayName.trim()) return;
    renameFriend(renamingFriend.id, renameDisplayName.trim(), renameHandle.trim(), renameBio.trim());
    if (selectedFriendProfile?.id === renamingFriend.id) {
      setSelectedFriendProfile({
        ...selectedFriendProfile,
        displayName: renameDisplayName.trim(),
        handle: renameHandle.trim().startsWith('@')
          ? renameHandle.trim()
          : `@${renameHandle.trim()}`,
        bioStatus: renameBio.trim() || selectedFriendProfile.bioStatus,
      });
    }
    triggerToast(`Prénom / surnom mis à jour : ${renameDisplayName.trim()} ✨`);
    setRenamingFriend(null);
  };

  const filteredFeedPosts = useMemo(() => {
    if (feedFilter === 'friends') {
      return feedPosts.filter((p) => p.authorId !== currentUid);
    }
    if (feedFilter === 'mine') {
      return feedPosts.filter((p) => p.authorId === currentUid);
    }
    return feedPosts;
  }, [feedPosts, feedFilter, currentUid]);

  const handleSaveMyCard = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMySocialProfile({
      handle: editHandle.trim() || mySocialProfile.handle,
      bioStatus: editBio.trim() || mySocialProfile.bioStatus,
      favoriteExercise: editFavExercise.trim() || mySocialProfile.favoriteExercise,
    });
    setIsEditingMyCard(false);
    triggerToast('Ta carte de profil sportif a été mise à jour !');
  };

  const handleCreateGymDate = (e: React.FormEvent) => {
    e.preventDefault();
    const dayNames: Record<number, string> = {
      1: 'Lundi',
      2: 'Mardi',
      3: 'Mercredi',
      4: 'Jeudi',
      5: 'Vendredi',
      6: 'Samedi',
      0: 'Dimanche',
    };
    const created = createGymDateInvite({
      friendId: inviteFriendId || friends[0]?.id || '',
      customFriendQuery: customInviteFriendQuery,
      dayOfWeek: inviteDayOfWeek,
      dayLabel: dayNames[inviteDayOfWeek] || 'Vendredi',
      timeSlot: inviteTimeSlot,
      workoutTheme: inviteTheme,
      locationNote: inviteNote,
    });

    if (!created) {
      triggerToast('Entre le @pseudo d’une amie ou ajoute une Gym Bestie pour envoyer l’invitation !');
      return;
    }

    setCustomInviteFriendQuery('');
    setHighlightedInviteId(created.id);
    triggerToast(
      `📅 Invitation envoyée à ${created.friendName} (${created.dayLabel} à ${created.timeSlot}) ! Visible dans « Séances communes programmées » et dans le Fil.`
    );
    setTimeout(() => {
      gymDatesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    setTimeout(() => setHighlightedInviteId(null), 5000);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`space-y-5 animate-in fade-in duration-150 transition-transform ${
        isWizzShaking ? 'translate-x-1 -translate-y-0.5' : ''
      }`}
    >
      {/* Pull-to-refresh visual indicator (glisser vers le bas et relâcher) */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="overflow-hidden transition-all duration-200 flex items-center justify-center"
          style={{ height: isRefreshing ? 52 : pullDistance }}
        >
          <div className="px-4 py-2 rounded-full bg-[#FCE7F3] border border-[#F472B6]/40 text-[#831843] text-xs font-bold flex items-center gap-2 shadow-2xs">
            {isRefreshing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Actualisation du Club en cours...</span>
              </>
            ) : pullDistance >= PULL_THRESHOLD ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 rotate-180 transition-transform" />
                <span>Relâche pour actualiser ↑</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Glisse vers le bas pour actualiser ↓</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Editorial Header */}
      <div className="pt-1 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="font-compact text-[11px] font-semibold uppercase tracking-wider text-[#831843] block">
            Le Club · Gym Besties & Motivation
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-[#2B091C] mt-0.5">
            Social & Amies
          </h1>
        </div>

        {/* Quick top actions: Refresh + Privacy Badge (#5) + QR Code (#3) + Story Recap (#20) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-full bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#831843] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            title="Actualiser le fil, les amies et les invitations (ou glisser vers le bas)"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              updateMySocialProfile({ hideWeights: !mySocialProfile.hideWeights }).then(() =>
                triggerToast(
                  !mySocialProfile.hideWeights
                    ? 'Mode Confidentialité activé : tes charges (kg) sont masquées.'
                    : 'Tes charges (kg) sont de nouveau visibles pour tes amies.'
                )
              )
            }
            className={`px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mySocialProfile.hideWeights
                ? 'bg-[#831843] text-white shadow-2xs'
                : 'bg-[#F6EDF2] text-[#831843] hover:bg-[#FCE7F3]'
            }`}
            title="Activer ou désactiver le masquage de tes charges en kg"
          >
            {mySocialProfile.hideWeights ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            <span>{mySocialProfile.hideWeights ? 'Charges masquées' : 'Charges visibles'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(mySocialProfile.friendCode).catch(() => {});
              triggerToast(`Code ami ${mySocialProfile.friendCode} copié dans le presse-papiers !`);
            }}
            className="px-3 py-2 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] text-[#831843] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Cliquer pour copier ton code ami"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copier Code : {mySocialProfile.friendCode}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsStoryModalOpen(true)}
            className="px-3.5 py-2 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FBCFE8]" />
            <span>Story Récap</span>
          </button>
        </div>
      </div>

      {/* Wizz Celebration Flash Banner */}
      {wizzBanner && (
        <div className="p-4 rounded-[24px] bg-gradient-to-r from-[#831843] via-[#BE185D] to-[#EC4899] text-white shadow-md flex items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#FBCFE8]" />
            </span>
            <div>
              <p className="font-display font-extrabold text-sm">
                ⚡ WIZZ ENVOYÉ À {wizzBanner.friendName.toUpperCase()} ({wizzBanner.time}) !
              </p>
              <p className="text-xs text-white/90">
                Vibration + boost de motivation envoyés ! Ton Wizz et sa réponse sont affichés dans le Fil d’activité.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWizzBanner(null)}
            className="text-white/80 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-[#831843] text-white text-xs font-bold flex items-center justify-between gap-2 shadow-md animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#FBCFE8] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Sub-tabs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-[24px] bg-[#F6EDF2]">
        {(
          [
            { id: 'feed', label: 'Fil & Activité', badge: feedPosts.length },
            {
              id: 'besties',
              label: 'Gym Besties & RDV',
              badge: gymDates.length > 0 ? gymDates.length : undefined,
            },
            { id: 'challenges', label: 'Défis & Podium', badge: undefined },
            {
              id: 'friends',
              label: 'Amies & Profil',
              badge:
                pendingIncomingRequests.length > 0
                  ? pendingIncomingRequests.length
                  : friends.length > 0
                  ? friends.length
                  : undefined,
            },
          ] as const
        ).map((tab) => {
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`py-2.5 px-3 rounded-[18px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                active
                  ? 'bg-[#831843] text-white shadow-xs'
                  : 'text-[#7A616F] hover:text-[#2B091C] hover:bg-white/60'
              }`}
            >
              <span className="truncate">{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                    active ? 'bg-white/20 text-white' : 'bg-[#FCE7F3] text-[#831843]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          SUB-TAB 1: FIL D'ACTUALITÉ & QUI S'ENTRAÎNE AUJOURD'HUI (#6, #7, #8, #9, #10, #11, #13)
         ===================================================================== */}
      {subTab === 'feed' && (
        <div className="space-y-5">
          {/* Feature #11: Vue « Qui s'entraîne aujourd'hui ? » + Feature #13: Bouton Poke / Motivation */}
          <div className="p-4 sm:p-5 rounded-[28px] bg-grainy-pink border border-[#F472B6]/30 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                  En direct du planning
                </span>
                <h2 className="font-display font-bold text-base sm:text-lg text-[#2B091C]">
                  Qui s’entraîne aujourd’hui ?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSubTab('besties')}
                className="text-xs font-bold text-[#831843] hover:underline"
              >
                Comparer nos plannings →
              </button>
            </div>

            {friends.length === 0 ? (
              <div className="p-4 rounded-[22px] bg-white/90 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <p className="font-display font-bold text-sm text-[#2B091C]">
                    Tu n’as pas encore de Gym Bestie dans ton cercle 🌸
                  </p>
                  <p className="text-xs text-[#7A616F] mt-0.5">
                    Ajoute une amie avec son @pseudo ou partage-lui ton code{' '}
                    <strong className="text-[#831843]">{mySocialProfile.friendCode}</strong> pour voir ses séances du jour !
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubTab('friends')}
                  className="px-4 py-2 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Ajouter une amie</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {friends.map((friend) => {
                  const pokedTime = pokedFriendIds[friend.id] || friend.lastPokedAt;
                  return (
                    <div
                      key={friend.id}
                      className="p-3.5 rounded-[22px] bg-white/90 border border-white flex flex-col justify-between gap-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedFriendProfile(friend)}
                          className="flex items-center gap-2.5 text-left min-w-0 cursor-pointer"
                        >
                          <span
                            className="w-9 h-9 rounded-2xl text-white font-display font-bold text-sm flex items-center justify-center shrink-0"
                            style={{ backgroundColor: friend.avatarColor }}
                          >
                            {friend.displayName.charAt(0)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-display font-bold text-xs sm:text-sm text-[#2B091C] truncate">
                              {friend.displayName}
                            </p>
                            <p className="text-[11px] text-[#7A616F] truncate">{friend.handle}</p>
                          </div>
                        </button>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            friend.isTrainingToday
                              ? 'bg-[#FCE7F3] text-[#831843]'
                              : 'bg-[#F6EDF2] text-[#7A616F]'
                          }`}
                        >
                          {friend.isTrainingToday ? 'À la salle' : 'Repos'}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#2B091C] truncate">
                          {friend.todayActivity}
                        </p>
                        {friend.todayWorkoutName && (
                          <p className="text-[11px] text-[#7A616F] truncate">
                            {friend.todayWorkoutName}
                          </p>
                        )}
                      </div>

                      {/* Feature #13: Bouton Wizz / Poke Motivation */}
                      <button
                        type="button"
                        onClick={() => handleTriggerWizz(friend)}
                        className={`w-full py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                          pokedTime
                            ? 'bg-[#FCE7F3] text-[#831843] border border-[#F472B6]/40'
                            : 'bg-[#831843] hover:bg-[#500724] text-white shadow-2xs'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>
                          {pokedTime
                            ? `⚡ Wizz envoyé (${pokedTime}) · Relancer`
                            : '⚡ Envoyer un Wizz motivation'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Encart visible dans le Fil : Mes Invitations de séance & RDV Salle programmés */}
          {gymDates.length > 0 && (
            <div className="p-4 sm:p-5 rounded-[28px] bg-white border-2 border-[#F472B6]/45 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-2xl bg-[#FCE7F3] text-[#831843] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                      Rendez-vous « On s’entraîne ensemble ? »
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#2B091C]">
                      Tes invitations de séance programmées ({gymDates.length})
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSubTab('besties')}
                  className="px-3 py-1.5 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] text-[#831843] text-xs font-bold shrink-0 cursor-pointer"
                >
                  Gérer dans RDV →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {gymDates.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-2xl bg-[#FAF5F8] border border-[#F3E5ED] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-9 h-9 rounded-xl text-white font-display font-bold text-xs flex items-center justify-center shrink-0"
                        style={{ backgroundColor: d.friendAvatarColor }}
                      >
                        {d.friendName.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-xs sm:text-sm text-[#2B091C] truncate">
                          Avec {d.friendName} · {d.dayLabel} à {d.timeSlot}
                        </p>
                        <p className="text-[11px] font-semibold text-[#831843] truncate">
                          {d.workoutTheme}
                        </p>
                        {d.locationNote && (
                          <p className="text-[10px] text-[#7A616F] truncate italic">
                            « {d.locationNote} »
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-[#FCE7F3] text-[#831843] text-[10px] font-bold">
                        {d.status === 'accepted' ? 'Envoyée ✓' : 'En attente'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          deleteGymDateInvite(d.id);
                          triggerToast('Invitation de séance retirée.');
                        }}
                        className="p-1.5 rounded-full text-[#8C6D7E] hover:text-[#831843] hover:bg-white cursor-pointer"
                        title="Annuler ce RDV"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Share Bar: Share Workout (#6), Celebrate PR (#9), Share 3 Objectives (#10), Story (#20) */}
          <div className="p-4 rounded-[26px] bg-[#F6EDF2] flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-xs font-bold text-[#2B091C]">
              Partager avec tes amies :
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const latest = workouts[0];
                  if (latest) {
                    shareWorkoutToFeed(latest);
                    triggerToast(`Ta séance « ${latest.name} » est publiée dans le Club !`);
                  } else {
                    setIsStoryModalOpen(true);
                  }
                }}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FCE7F3] text-[#831843] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <StreamlineIcon name="weightlifter" className="w-3.5 h-3.5" />
                <span>Ma dernière séance</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPRModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FCE7F3] text-[#831843] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>Célébrer un PR</span>
              </button>

              <button
                type="button"
                onClick={handleShareValidatedObjectives}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FCE7F3] text-[#831843] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>Mes 3 objectifs</span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab('besties')}
                className="px-3 py-1.5 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#FBCFE8]" />
                <span>Inviter en séance</span>
              </button>
            </div>
          </div>

          {/* Feed Filter Bar: See Friends' Workouts vs All vs Mine */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: 'all', label: `Tout le fil (${feedPosts.length})` },
                  {
                    id: 'friends',
                    label: `Séances des amies (${feedPosts.filter((p) => p.authorId !== currentUid).length})`,
                  },
                  {
                    id: 'mine',
                    label: `Mes publications (${feedPosts.filter((p) => p.authorId === currentUid).length})`,
                  },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFeedFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    feedFilter === f.id
                      ? 'bg-[#831843] text-white'
                      : 'bg-[#F6EDF2] text-[#7A616F] hover:text-[#2B091C]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feature #6: Fil d'activité des amies */}
          <div className="space-y-4">
            {filteredFeedPosts.map((post) => {
              const isCommentsOpen = openCommentsPostId === post.id;
              return (
                <article
                  key={post.id}
                  className="p-4 sm:p-5 rounded-[28px] bg-white border border-[#F3E5ED] shadow-2xs space-y-3.5"
                >
                  {/* Post Author Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-2xl text-white font-display font-bold text-sm flex items-center justify-center shrink-0"
                        style={{ backgroundColor: post.authorAvatarColor }}
                      >
                        {post.authorName.charAt(0)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-[#2B091C]">
                            {post.authorName}
                          </span>
                          <span className="text-xs text-[#7A616F]">{post.authorHandle}</span>
                        </div>
                        <span className="text-[11px] text-[#8C6D7E] block">{post.createdAt}</span>
                      </div>
                    </div>

                    {/* Post Type Pill */}
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        post.type === 'pr' || post.type === 'wizz'
                          ? 'bg-grainy-pink text-[#831843] border border-[#F472B6]/40'
                          : post.type === 'objective' || post.type === 'gym_date'
                          ? 'bg-[#FCE7F3] text-[#831843]'
                          : 'bg-[#F6EDF2] text-[#831843]'
                      }`}
                    >
                      {post.type === 'pr' && '🏆 Record Personnel (PR)'}
                      {post.type === 'workout' && `🏋️‍♀️ Séance · ${post.durationMinutes || 45} min`}
                      {post.type === 'objective' && '🎯 Objectif coché'}
                      {post.type === 'routine_share' && '📋 Routine partagée'}
                      {post.type === 'wizz' && '⚡ Wizz Motivation'}
                      {post.type === 'gym_date' && '📅 Invitation de séance'}
                    </span>
                  </div>

                  {/* Feature #13 in Feed: Wizz Motivation Card */}
                  {post.type === 'wizz' && (
                    <div className="p-3.5 rounded-2xl bg-grainy-pink border border-[#F472B6]/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-[#831843] text-white flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5 text-[#FBCFE8]" />
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                            Boost d’énergie envoyé
                          </span>
                          <p className="font-display font-bold text-xs sm:text-sm text-[#2B091C]">
                            Wizz envoyé à {post.wizzTargetName || 'ta Gym Bestie'}{' '}
                            {post.wizzTargetHandle ? `(${post.wizzTargetHandle})` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white text-[#831843] font-mono font-bold text-[11px] shrink-0 shadow-2xs">
                        ⚡ Vibrations
                      </span>
                    </div>
                  )}

                  {/* Feature #14 in Feed: Gym Date Invitation Card */}
                  {post.type === 'gym_date' && post.gymDateSummary && (
                    <div className="p-3.5 rounded-2xl bg-[#FAF5F8] border border-[#FBCFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-[#831843] text-white flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-[#FBCFE8]" />
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                            RDV Salle programmé
                          </span>
                          <p className="font-display font-bold text-xs sm:text-sm text-[#2B091C]">
                            Avec {post.gymDateSummary.friendName} · {post.gymDateSummary.dayLabel} à{' '}
                            {post.gymDateSummary.timeSlot}
                          </p>
                          <p className="text-xs font-semibold text-[#831843]">
                            {post.gymDateSummary.workoutTheme}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSubTab('besties')}
                        className="px-3 py-1.5 rounded-full bg-[#FCE7F3] text-[#831843] text-xs font-bold shrink-0 cursor-pointer"
                      >
                        Voir mes RDV →
                      </button>
                    </div>
                  )}

                  {/* Feature #9: Alerte & Célébration de Record Personnel (PR) */}
                  {post.type === 'pr' && post.prExerciseName && (
                    <div className="p-3.5 rounded-2xl bg-grainy-pink border border-[#F472B6]/35 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-[#831843] text-white flex items-center justify-center shrink-0">
                          <StreamlineIcon name="trophy" className="w-5 h-5 text-[#FBCFE8]" />
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                            Nouveau Record Battu
                          </span>
                          <p className="font-display font-bold text-sm sm:text-base text-[#2B091C]">
                            {post.prExerciseName}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-white text-[#831843] font-mono font-extrabold text-xs sm:text-sm shrink-0 shadow-2xs">
                        {post.hideWeights
                          ? `${post.prReps || 8} reps (Charge masquée)`
                          : `${post.prWeight} kg × ${post.prReps || 8}`}
                      </span>
                    </div>
                  )}

                  {/* Feature #10: Partage des 3 objectifs cochés */}
                  {post.type === 'objective' && post.objectiveLabel && (
                    <div className="p-3.5 rounded-2xl bg-[#F6EDF2] border border-[#FBCFE8] flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#831843] text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                          Objectif Suivi validé
                        </span>
                        <p className="font-display font-bold text-xs sm:text-sm text-[#2B091C]">
                          {post.objectiveLabel}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Workout 4 exercises summary */}
                  {post.exercisesSummary && post.exercisesSummary.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-[#FAF5F8] space-y-2">
                      {post.workoutName && (
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs sm:text-sm text-[#2B091C]">
                            {post.workoutName}
                          </span>
                          {post.hideWeights && (
                            <span className="text-[10px] font-semibold text-[#831843] flex items-center gap-1">
                              <EyeOff className="w-3 h-3" /> Charges masquées
                            </span>
                          )}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {post.exercisesSummary.map((ex, i) => (
                          <div
                            key={i}
                            className="px-3 py-2 rounded-xl bg-white flex items-center justify-between text-xs border border-[#F3E5ED]"
                          >
                            <span className="font-semibold text-[#2B091C] truncate pr-2">
                              {i + 1}. {ex.name}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-[#831843] shrink-0">
                              {post.hideWeights || !ex.topWeight
                                ? `${ex.setsCount}×${ex.reps}`
                                : `${ex.setsCount}×${ex.reps} · ${ex.topWeight}kg`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shared Routine in Feed (#15) */}
                  {post.sharedRoutine && (
                    <div className="p-3.5 rounded-2xl bg-[#F6EDF2] flex items-center justify-between gap-3">
                      <div>
                        <p className="font-display font-bold text-xs sm:text-sm text-[#2B091C]">
                          {post.sharedRoutine.name}
                        </p>
                        <p className="text-[11px] text-[#7A616F]">
                          {post.sharedRoutine.exercises.length} exercices structurés
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleImportRoutine(post.sharedRoutine!)}
                        className="px-3 py-2 rounded-full bg-[#831843] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Importer</span>
                      </button>
                    </div>
                  )}

                  {/* Caption */}
                  {post.caption && (
                    <p className="text-xs sm:text-sm text-[#2B091C] leading-relaxed">
                      {post.caption}
                    </p>
                  )}

                  {/* Feature #7: Réactions rapides sur les séances */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[#F3E5ED]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {REACTION_META.map((r) => {
                        const reactors = post.reactions[r.key] || [];
                        const hasReacted = reactors.includes(currentUid);
                        return (
                          <button
                            key={r.key}
                            type="button"
                            onClick={() => toggleReaction(post.id, r.key)}
                            className={`px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                              hasReacted
                                ? 'bg-[#831843] text-white shadow-2xs'
                                : 'bg-[#F6EDF2] hover:bg-[#FCE7F3] text-[#2B091C]'
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span className="text-[11px]">{r.label}</span>
                            {reactors.length > 0 && (
                              <span
                                className={`font-mono text-[10px] px-1 rounded-full ${
                                  hasReacted ? 'bg-white/20 text-white' : 'text-[#831843]'
                                }`}
                              >
                                {reactors.length}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenCommentsPostId(isCommentsOpen ? null : post.id)
                      }
                      className="px-3 py-1.5 rounded-full bg-[#FAF5F8] hover:bg-[#F6EDF2] text-xs font-bold text-[#7A616F] flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#831843]" />
                      <span>
                        {post.comments.length > 0
                          ? `${post.comments.length} mot${post.comments.length > 1 ? 's' : ''}`
                          : 'Encourager'}
                      </span>
                    </button>
                  </div>

                  {/* Feature #8: Commentaires courts d'encouragement */}
                  {isCommentsOpen && (
                    <div className="pt-2 space-y-2.5">
                      {post.comments.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-2xl bg-[#FAF5F8] flex items-start justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#831843] mr-1.5">
                              {c.authorName}
                            </span>
                            <span className="text-[#2B091C]">{c.text}</span>
                          </div>
                          <span className="text-[10px] text-[#8C6D7E] shrink-0">
                            {c.createdAt}
                          </span>
                        </div>
                      ))}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const val = commentInputs[post.id] || '';
                          if (!val.trim()) return;
                          addComment(post.id, val);
                          setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
                        }}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder={`Écrire un mot d’encouragement à ${post.authorName}...`}
                          className="flex-1 px-3.5 py-2 rounded-full bg-[#F6EDF2] text-xs text-[#2B091C] font-medium focus:outline-hidden"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 rounded-full bg-[#831843] text-white text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              );
            })}
            {feedPosts.length === 0 && (
              <div className="p-6 rounded-[28px] bg-white border border-[#F3E5ED] text-center space-y-2 shadow-2xs">
                <p className="font-display font-bold text-sm text-[#2B091C]">
                  Le fil d’activité est encore vierge ✨
                </p>
                <p className="text-xs text-[#7A616F] max-w-md mx-auto">
                  Ajoute tes amies, envoie un Wizz ou publie ta dernière séance, un record personnel (PR) ou une invitation de séance pour inaugurer le Club !
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 2: GYM BESTIES — COMPARATEUR PLANNING, RDV SALLE & PARTAGE SÉANCES (#12, #14, #15)
         ===================================================================== */}
      {subTab === 'besties' && (
        <div className="space-y-5">
          {/* Feature #12: Comparateur de planning hebdomadaire */}
          <div className="p-5 rounded-[28px] bg-white border border-[#F3E5ED] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                  Trouver vos créneaux communs
                </span>
                <h2 className="font-display font-bold text-base sm:text-lg text-[#2B091C]">
                  Comparateur de planning 7 jours
                </h2>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {friends.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCompareFriendId(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      comparedFriend?.id === f.id
                        ? 'bg-[#831843] text-white'
                        : 'bg-[#F6EDF2] text-[#7A616F] hover:text-[#2B091C]'
                    }`}
                  >
                    Avec {f.displayName}
                  </button>
                ))}
              </div>
            </div>

            {!comparedFriend ? (
              <div className="p-4 rounded-2xl bg-[#FAF5F8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-[#7A616F]">
                  Ajoute une amie pour comparer vos plannings 7 jours et repérer vos créneaux d’entraînement communs.
                </p>
                <button
                  type="button"
                  onClick={() => setSubTab('friends')}
                  className="px-3.5 py-2 rounded-full bg-[#831843] text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  Ajouter une amie
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
                  const myDay = weeklyPlans.find((d) => Number(d.dayOfWeek) === dayNum);
                  const friendDay = comparedFriend.weeklySchedule.find(
                    (d) => Number(d.dayOfWeek) === dayNum
                  );
                  const myAct = myDay?.activity || 'Repos';
                  const friendAct = friendDay?.activity || 'Repos';
                  const myIsTraining = myAct !== 'Repos' && myDay?.status !== 'rest';
                  const friendIsTraining = !!friendDay?.isTraining && friendAct !== 'Repos';
                  const isCommonSlot = myIsTraining && friendIsTraining;

                  return (
                    <div
                      key={dayNum}
                      className={`p-3 rounded-2xl grid grid-cols-12 items-center gap-2 text-xs border ${
                        isCommonSlot
                          ? 'bg-grainy-pink border-[#F472B6]/40'
                          : 'bg-[#FAF5F8] border-transparent'
                      }`}
                    >
                      <div className="col-span-3 sm:col-span-2 font-display font-bold text-[#2B091C] flex items-center gap-1.5">
                        <span>{myDay?.dayName || friendDay?.dayName}</span>
                      </div>

                      <div className="col-span-4 sm:col-span-4">
                        <span className="text-[10px] font-semibold text-[#7A616F] block">
                          Toi
                        </span>
                        <span className="font-bold text-[#2B091C] truncate block">
                          {myAct}
                        </span>
                      </div>

                      <div className="col-span-5 sm:col-span-4">
                        <span className="text-[10px] font-semibold text-[#7A616F] block">
                          {comparedFriend.displayName}
                        </span>
                        <span className="font-bold text-[#831843] truncate block">
                          {friendAct}
                        </span>
                      </div>

                      <div className="col-span-12 sm:col-span-2 flex sm:justify-end">
                        {isCommonSlot ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#831843] text-white text-[10px] font-bold inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#FBCFE8]" /> Match !
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8C6D7E]">Décalé</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Feature #14: Invitation « On s'entraîne ensemble ? » */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-[28px] bg-[#F6EDF2] space-y-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                  Rendez-vous à la salle
                </span>
                <h3 className="font-display font-bold text-base text-[#2B091C]">
                  Proposer « On s’entraîne ensemble ? »
                </h3>
              </div>

              <form onSubmit={handleCreateGymDate} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#7A616F] block mb-1">
                      Gym Bestie
                    </label>
                    {friends.length > 0 ? (
                      <select
                        value={inviteFriendId || friends[0]?.id || ''}
                        onChange={(e) => setInviteFriendId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white text-xs font-bold text-[#2B091C]"
                      >
                        {friends.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.displayName} ({f.handle})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={customInviteFriendQuery}
                        onChange={(e) => setCustomInviteFriendQuery(e.target.value)}
                        placeholder="Prénom ou @pseudo (ex: @lea.glow)"
                        className="w-full px-3 py-2 rounded-xl bg-white text-xs font-bold text-[#2B091C]"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7A616F] block mb-1">
                      Jour & Heure
                    </label>
                    <div className="flex gap-1.5">
                      <select
                        value={inviteDayOfWeek}
                        onChange={(e) => setInviteDayOfWeek(Number(e.target.value))}
                        className="flex-1 px-2.5 py-2 rounded-xl bg-white text-xs font-bold text-[#2B091C]"
                      >
                        <option value={1}>Lundi</option>
                        <option value={2}>Mardi</option>
                        <option value={3}>Mercredi</option>
                        <option value={4}>Jeudi</option>
                        <option value={5}>Vendredi</option>
                        <option value={6}>Samedi</option>
                        <option value={0}>Dimanche</option>
                      </select>
                      <input
                        type="text"
                        value={inviteTimeSlot}
                        onChange={(e) => setInviteTimeSlot(e.target.value)}
                        className="w-18 px-2.5 py-2 rounded-xl bg-white text-xs font-bold text-[#2B091C]"
                        placeholder="18h00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7A616F] block mb-1">
                    Séance prévue ensemble
                  </label>
                  <input
                    type="text"
                    value={inviteTheme}
                    onChange={(e) => setInviteTheme(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white text-xs font-semibold text-[#2B091C]"
                    placeholder="Ex: Leg Day & Fessiers (4 exos)"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#7A616F] block mb-1">
                    Petit rappel matériel / note
                  </label>
                  <input
                    type="text"
                    value={inviteNote}
                    onChange={(e) => setInviteNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white text-xs text-[#5C3A4D]"
                    placeholder="Ex: N'oublie pas tes sangles de cheville !"
                  />
                </div>

                <button
                  type="submit"
                  disabled={friends.length === 0 && !customInviteFriendQuery.trim()}
                  className="w-full py-2.5 px-4 rounded-full bg-[#831843] hover:bg-[#500724] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {friends.length === 0 && !customInviteFriendQuery.trim()
                      ? 'Entre le @pseudo d’une amie ci-dessus pour inviter'
                      : 'Envoyer l’invitation de séance'}
                  </span>
                </button>
              </form>
            </div>

            {/* Active & Pending Gym Dates list */}
            <div
              ref={gymDatesSectionRef}
              className="p-5 rounded-[28px] bg-white border border-[#F3E5ED] space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                    Vos créneaux à deux (affichés ici & dans le Fil)
                  </span>
                  <h3 className="font-display font-bold text-base text-[#2B091C]">
                    Séances communes programmées ({gymDates.length})
                  </h3>
                </div>
                {gymDates.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-[#FCE7F3] text-[#831843] font-mono text-xs font-bold">
                    {gymDates.length} RDV
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {gymDates.length === 0 && (
                  <p className="text-xs text-[#7A616F] py-4 text-center">
                    Aucune séance commune programmée pour le moment. Remplis le formulaire à gauche pour envoyer une invitation !
                  </p>
                )}
                {gymDates.map((d) => {
                  const isHighlighted = highlightedInviteId === d.id;
                  return (
                    <div
                      key={d.id}
                      className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
                        isHighlighted
                          ? 'bg-grainy-pink border-[#831843] ring-2 ring-[#F472B6]/50 shadow-sm'
                          : 'bg-[#FAF5F8] border-[#F3E5ED]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-8 h-8 rounded-xl text-white font-display font-bold text-xs flex items-center justify-center shrink-0"
                            style={{ backgroundColor: d.friendAvatarColor }}
                          >
                            {d.friendName.charAt(0)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-display font-bold text-xs sm:text-sm text-[#2B091C] truncate">
                              Avec {d.friendName} · {d.dayLabel} à {d.timeSlot}
                            </p>
                            <p className="text-[11px] font-semibold text-[#831843] truncate">
                              {d.workoutTheme}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              d.status === 'accepted'
                                ? 'bg-[#FCE7F3] text-[#831843]'
                                : d.status === 'declined'
                                ? 'bg-gray-100 text-gray-500'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {d.status === 'accepted'
                              ? 'Invitation envoyée ✓'
                              : d.status === 'declined'
                              ? 'Reporté'
                              : 'En attente'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              deleteGymDateInvite(d.id);
                              triggerToast('Invitation de séance annulée.');
                            }}
                            className="p-1.5 rounded-full text-[#8C6D7E] hover:text-[#831843] hover:bg-white cursor-pointer"
                            title="Supprimer cette invitation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {d.locationNote && (
                        <p className="text-[11px] text-[#7A616F] italic">
                          « {d.locationNote} »
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-[#8C6D7E]">
                        <span>{d.createdAt}</span>
                        <span>Visible aussi dans l’onglet Fil & Activité</span>
                      </div>

                      {d.status === 'pending' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              respondToGymDate(d.id, true);
                              triggerToast(`Séance de ${d.dayLabel} confirmée avec ${d.friendName} !`);
                            }}
                            className="flex-1 py-2 rounded-full bg-[#831843] text-white text-xs font-bold cursor-pointer"
                          >
                            Accepter le RDV
                          </button>
                          <button
                            type="button"
                            onClick={() => respondToGymDate(d.id, false)}
                            className="px-3 py-2 rounded-full bg-white text-[#7A616F] text-xs font-bold cursor-pointer"
                          >
                            Plus tard
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feature #15: Partage & Import de séances personnalisées */}
          <div className="p-5 rounded-[28px] bg-white border border-[#F3E5ED] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                  Bibliothèque entre amies
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#2B091C]">
                  Séances personnalisées partagées par tes amies
                </h3>
              </div>
            </div>

            {friends.flatMap((f) => f.sharedRoutines).length === 0 ? (
              <p className="text-xs text-[#7A616F] py-3">
                Dès qu’une amie rejoint ton cercle et partage une de ses séances en 4 exercices, tu pourras l’importer ici en 1 clic.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {friends
                  .flatMap((f) =>
                    f.sharedRoutines.map((sr) => ({ friend: f, routine: sr }))
                  )
                  .map(({ friend, routine }) => {
                    const isImported = !!importedRoutineNames[routine.name];
                    return (
                      <div
                        key={routine.name}
                        className="p-4 rounded-[24px] bg-[#FAF5F8] border border-[#F3E5ED] flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FCE7F3] text-[#831843] text-[10px] font-bold">
                              Par {friend.displayName} ({friend.handle})
                            </span>
                            <span className="text-[11px] font-mono font-bold text-[#7A616F]">
                              {routine.exercises.length} exercices
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-sm sm:text-base text-[#2B091C]">
                            {routine.name}
                          </h4>
                          {routine.description && (
                            <p className="text-xs text-[#7A616F]">{routine.description}</p>
                          )}
                          <div className="space-y-1 pt-1">
                            {routine.exercises.map((ex, i) => (
                              <p key={ex.id} className="text-xs font-medium text-[#2B091C]">
                                <strong className="text-[#831843]">{i + 1}.</strong>{' '}
                                {ex.exerciseName} ({ex.sets.length} séries)
                              </p>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleImportRoutine(routine)}
                          className={`w-full py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isImported
                              ? 'bg-[#FCE7F3] text-[#831843]'
                              : 'bg-[#831843] hover:bg-[#500724] text-white'
                          }`}
                        >
                          {isImported ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Ajoutée dans tes séances</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>Importer dans mes séances</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Share one of MY routines to friends */}
            <div className="pt-2 border-t border-[#F3E5ED] flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#7A616F]">
                Envoyer une de tes routines au Club :
              </span>
              <div className="flex flex-wrap gap-2">
                {routines.slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      shareRoutineToClub(r);
                      triggerToast(`Ta routine « ${r.name} » a été partagée à tes amies !`);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] text-[#831843] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>{r.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 3: DÉFIS BIENVEILLANTS, DUO STREAK, PODIUM & BADGES (#16, #17, #18, #19)
         ===================================================================== */}
      {subTab === 'challenges' && (
        <div className="space-y-5">
          {/* Feature #16: Duo Streak (Série de régularité à deux) */}
          <div className="p-5 rounded-[28px] bg-grainy-pink border border-[#F472B6]/35 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#831843] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Flame className="w-6 h-6 text-[#FBCFE8]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                    Série de régularité en binôme
                  </span>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-[#2B091C]">
                    {duoPartner
                      ? `Duo Streak : ${mySocialProfile.duoStreakWeeks} semaines d’affilée 🔥`
                      : 'Duo Streak : Aucun binôme actif'}
                  </h2>
                  <p className="text-xs text-[#5C3A4D]">
                    {duoPartner ? (
                      <>
                        En binôme avec <strong>{duoPartner.displayName}</strong> — vous avez toutes les deux tenu votre planning !
                      </>
                    ) : (
                      'Ajoute une Gym Bestie pour démarrer votre série de régularité à deux !'
                    )}
                  </p>
                </div>
              </div>

              {friends.length > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#831843]">Binôme :</span>
                  {friends.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setDuoPartner(f.id);
                        triggerToast(`${f.displayName} est maintenant ton binôme Duo Streak !`);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        duoPartner?.id === f.id
                          ? 'bg-[#831843] text-white shadow-2xs'
                          : 'bg-white/80 text-[#831843] hover:bg-white'
                      }`}
                    >
                      {f.displayName}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSubTab('friends')}
                  className="px-3.5 py-2 rounded-full bg-[#831843] text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  Ajouter une amie
                </button>
              )}
            </div>
          </div>

          {/* Feature #17: Défi collectif hebdomadaire (Cagnotte de séances) */}
          <div className="p-5 rounded-[28px] bg-white border border-[#F3E5ED] shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                  Défi collectif hebdomadaire
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#2B091C]">
                  {collectiveChallenge.title}
                </h3>
                <p className="text-xs text-[#7A616F] mt-0.5">
                  {collectiveChallenge.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingChallenge((v) => !v)}
                className="px-3 py-1.5 rounded-full bg-[#F6EDF2] text-[#831843] text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Objectif</span>
              </button>
            </div>

            {isEditingChallenge && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const num = parseInt(customTargetInput, 10) || 12;
                  updateCollectiveChallengeTarget(num);
                  setIsEditingChallenge(false);
                  triggerToast(`Cagnotte mise à jour : ${num} séances collectives !`);
                }}
                className="p-3 rounded-2xl bg-[#F6EDF2] flex items-center gap-2"
              >
                <span className="text-xs font-bold text-[#2B091C]">
                  Cible de séances cette semaine :
                </span>
                <input
                  type="number"
                  min={3}
                  max={40}
                  value={customTargetInput}
                  onChange={(e) => setCustomTargetInput(e.target.value)}
                  className="w-20 px-3 py-1.5 rounded-xl bg-white text-xs font-mono font-bold text-[#831843]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-full bg-[#831843] text-white text-xs font-bold cursor-pointer"
                >
                  Valider
                </button>
              </form>
            )}

            {/* Shared Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-extrabold text-xl text-[#831843]">
                  {totalSquadSessions} / {collectiveChallenge.targetSessions} séances
                </span>
                <span className="text-xs font-bold text-[#7A616F]">
                  {squadProgressPct}% de la cagnotte
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#F6EDF2] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#831843] to-[#EC4899] transition-all duration-500"
                  style={{ width: `${squadProgressPct}%` }}
                />
              </div>
            </div>

            {/* Individual Contributions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {collectiveChallenge.contributions.map((c) => (
                <div
                  key={c.userId}
                  className="p-3 rounded-2xl bg-[#FAF5F8] border border-[#F3E5ED] flex items-center gap-2.5"
                >
                  <span
                    className="w-8 h-8 rounded-xl text-white font-display font-bold text-xs flex items-center justify-center shrink-0"
                    style={{ backgroundColor: c.avatarColor }}
                  >
                    {c.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-xs text-[#2B091C] truncate">
                      {c.name}
                    </p>
                    <p className="font-mono text-[11px] font-bold text-[#831843]">
                      +{c.sessionsCount} séances
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature #18: Podium de régularité bienveillant */}
          <div className="p-5 rounded-[28px] bg-white border border-[#F3E5ED] shadow-2xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                100 % basé sur l’assiduité · Zéro comparaison de poids
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#2B091C]">
                Podium de régularité bienveillant
              </h3>
            </div>

            <div className="space-y-2.5">
              {regularityLeaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 ${
                    index === 0
                      ? 'bg-grainy-pink border border-[#F472B6]/40'
                      : 'bg-[#FAF5F8] border border-[#F3E5ED]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-white text-[#831843] font-mono font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      #{index + 1}
                    </span>
                    <span
                      className="w-9 h-9 rounded-2xl text-white font-display font-bold text-sm flex items-center justify-center shrink-0"
                      style={{ backgroundColor: entry.avatarColor }}
                    >
                      {entry.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-xs sm:text-sm text-[#2B091C] truncate">
                        {entry.name}
                      </p>
                      <p className="text-[11px] text-[#7A616F]">
                        {entry.sessionsDone}/{entry.sessionsTarget} séances · Série de{' '}
                        {entry.streakWeeks} sem.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-3 py-1 rounded-full bg-white text-[#831843] font-mono font-bold text-xs shadow-2xs">
                      {entry.score}% régulière
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature #19: Badges sociaux déblocables */}
          <div className="p-5 rounded-[28px] bg-[#F6EDF2] space-y-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                Tes trophées Glow Up Lab
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#2B091C]">
                Badges sociaux & régularité ({badges.filter((b) => b.unlocked).length}/
                {badges.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-[22px] border flex flex-col justify-between gap-2 ${
                    b.unlocked
                      ? 'bg-white border-[#FBCFE8] shadow-2xs'
                      : 'bg-white/50 border-transparent opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        b.unlocked
                          ? 'bg-[#FCE7F3] text-[#831843]'
                          : 'bg-[#F6EDF2] text-[#8C6D7E]'
                      }`}
                    >
                      <StreamlineIcon name={b.icon} className="w-5 h-5" />
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.unlocked
                          ? 'bg-[#831843] text-white'
                          : 'bg-[#F6EDF2] text-[#7A616F]'
                      }`}
                    >
                      {b.unlocked ? 'Débloqué ✓' : 'En cours'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#2B091C]">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-[#7A616F] mt-0.5">{b.description}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#831843]">
                    {b.progressText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 4: AMIES, DEMANDES D'AMIS & MON PROFIL PUBLIC (#1, #2, #3, #4, #5)
         ===================================================================== */}
      {subTab === 'friends' && (
        <div className="space-y-5">
          {/* Feature #4 + #1 + #5: Ma Carte de profil sportif public */}
          <div className="p-5 rounded-[28px] bg-grainy-pink border border-[#F472B6]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <span className="w-14 h-14 rounded-2xl bg-[#831843] text-white font-display font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm">
                  {myDisplayName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-bold text-lg text-[#2B091C]">
                      {myDisplayName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/85 text-[#831843] font-mono font-bold text-xs">
                      {mySocialProfile.handle}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#831843] text-white font-mono font-bold text-[11px]">
                      Code : {mySocialProfile.friendCode}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C3A4D] mt-1">{mySocialProfile.bioStatus}</p>
                  <p className="text-[11px] font-semibold text-[#831843] mt-0.5">
                    Exercice favori : <strong>{mySocialProfile.favoriteExercise}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditHandle(mySocialProfile.handle);
                    setEditBio(mySocialProfile.bioStatus);
                    setEditFavExercise(mySocialProfile.favoriteExercise);
                    setIsEditingMyCard((v) => !v);
                  }}
                  className="px-3.5 py-2 rounded-full bg-white text-[#831843] text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Personnaliser</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="px-3.5 py-2 rounded-full bg-[#831843] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier mon lien d’invitation</span>
                </button>
              </div>
            </div>

            {isEditingMyCard && (
              <form
                onSubmit={handleSaveMyCard}
                className="p-4 rounded-2xl bg-white/90 space-y-3 border border-white"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#7A616F] block mb-1">
                      Ton @pseudo unique
                    </label>
                    <input
                      type="text"
                      value={editHandle}
                      onChange={(e) => setEditHandle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6EDF2] text-xs font-bold text-[#2B091C]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#7A616F] block mb-1">
                      Ton exercice favori
                    </label>
                    <input
                      type="text"
                      value={editFavExercise}
                      onChange={(e) => setEditFavExercise(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F6EDF2] text-xs font-bold text-[#2B091C]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#7A616F] block mb-1">
                    Statut motivant (visible par tes amies)
                  </label>
                  <input
                    type="text"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6EDF2] text-xs text-[#2B091C]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingMyCard(false)}
                    className="px-3.5 py-1.5 rounded-full bg-[#F6EDF2] text-xs font-bold text-[#7A616F]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-[#831843] text-white text-xs font-bold"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            )}

            {/* Feature #5: Privacy Switch inside Profile Card */}
            <div className="p-3.5 rounded-2xl bg-white/85 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {mySocialProfile.hideWeights ? (
                  <EyeOff className="w-4 h-4 text-[#831843]" />
                ) : (
                  <Eye className="w-4 h-4 text-[#831843]" />
                )}
                <div>
                  <p className="text-xs font-bold text-[#2B091C]">
                    Mode Confidentialité (« Masquer mes charges »)
                  </p>
                  <p className="text-[11px] text-[#7A616F]">
                    Tes mensurations restent toujours 100 % privées. Active cette option pour partager tes séances sans afficher les kg.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateMySocialProfile({ hideWeights: !mySocialProfile.hideWeights })
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  mySocialProfile.hideWeights
                    ? 'bg-[#831843] text-white'
                    : 'bg-[#F6EDF2] text-[#831843]'
                }`}
              >
                {mySocialProfile.hideWeights ? 'Activé 🔒' : 'Désactivé'}
              </button>
            </div>
          </div>

          {/* Feature #1 & #2: Ajouter une amie par @pseudo ou Code Ami */}
          <div className="p-5 rounded-[28px] bg-white border border-[#F3E5ED] shadow-2xs space-y-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843] block">
                Ajouter une Gym Bestie
              </span>
              <h3 className="font-display font-bold text-base text-[#2B091C]">
                Ajoute une amie et choisis comment tu veux l’appeler
              </h3>
            </div>

            <form
              onSubmit={handleAddFriendSubmit}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2"
            >
              <input
                type="text"
                value={friendCustomNameInput}
                onChange={(e) => setFriendCustomNameInput(e.target.value)}
                placeholder="Son prénom ou surnom (ex: Ma Chloé, Camille...)"
                className="sm:col-span-5 px-4 py-2.5 rounded-full bg-[#F6EDF2] text-xs font-semibold text-[#2B091C] focus:outline-hidden"
              />
              <input
                type="text"
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
                placeholder="@pseudo ou Code Ami (ex: @chloe ou GLOW-53M)..."
                className="sm:col-span-5 px-4 py-2.5 rounded-full bg-[#F6EDF2] text-xs font-semibold text-[#2B091C] focus:outline-hidden"
              />
              <button
                type="submit"
                className="sm:col-span-2 px-4 py-2.5 rounded-full bg-[#831843] hover:bg-[#500724] text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </form>

            {/* Feature #2: Demandes d'amis en attente */}
            {pendingIncomingRequests.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-[#831843] block">
                  Demandes d’amies reçues ({pendingIncomingRequests.length})
                </span>
                {pendingIncomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-[#FCE7F3]/60 border border-[#FBCFE8] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-2xl text-white font-display font-bold text-sm flex items-center justify-center shrink-0"
                        style={{ backgroundColor: req.fromUser.avatarColor }}
                      >
                        {req.fromUser.displayName.charAt(0)}
                      </span>
                      <div>
                        <p className="font-display font-bold text-xs sm:text-sm text-[#2B091C]">
                          {req.fromUser.displayName}{' '}
                          <span className="text-[#7A616F] font-normal">
                            ({req.fromUser.handle})
                          </span>
                        </p>
                        <p className="text-[11px] text-[#7A616F]">{req.fromUser.bioStatus}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          acceptFriendRequest(req.id);
                          triggerToast(
                            `${req.fromUser.displayName} fait maintenant partie de tes amies !`
                          );
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-[#831843] text-white text-xs font-bold cursor-pointer"
                      >
                        Accepter
                      </button>
                      <button
                        type="button"
                        onClick={() => declineFriendRequest(req.id)}
                        className="px-3 py-1.5 rounded-full bg-white text-[#7A616F] text-xs font-bold cursor-pointer"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Liste de mes amies (#4 Carte de profil sportif au clic) */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base text-[#2B091C] px-1">
              Mes Gym Besties ({friends.length})
            </h3>
            {friends.length === 0 ? (
              <div className="p-6 rounded-[26px] bg-white border border-[#F3E5ED] shadow-2xs text-center space-y-2">
                <p className="font-display font-bold text-sm text-[#2B091C]">
                  Aucune amie dans ton cercle pour l’instant 🌸
                </p>
                <p className="text-xs text-[#7A616F] max-w-md mx-auto">
                  Utilise la barre de recherche ci-dessus pour ajouter une amie avec son @pseudo ou son code GLOW-XXX, ou partage ton QR Code !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-4 rounded-[26px] bg-white border border-[#F3E5ED] shadow-2xs flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-11 h-11 rounded-2xl text-white font-display font-bold text-base flex items-center justify-center shrink-0"
                            style={{ backgroundColor: friend.avatarColor }}
                          >
                            {friend.displayName.charAt(0)}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-display font-bold text-sm text-[#2B091C]">
                                {friend.displayName}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleOpenRenameFriend(friend)}
                                className="p-1 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] text-[#831843] cursor-pointer"
                                title="Renommer cette amie comme tu veux"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs text-[#7A616F]">{friend.handle}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#F6EDF2] text-[#831843] font-mono text-[10px] font-bold">
                          {friend.totalWorkouts} séances
                        </span>
                      </div>

                      <p className="text-xs text-[#5C3A4D]">{friend.bioStatus}</p>
                      <p className="text-[11px] text-[#7A616F]">
                        Ex. favori :{' '}
                        <strong className="text-[#831843]">{friend.favoriteExercise}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenRenameFriend(friend)}
                        className="px-3 py-2 rounded-full bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#831843] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Choisir son nom / surnom"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Renommer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFriendProfile(friend)}
                        className="flex-1 py-2 rounded-full bg-[#F6EDF2] hover:bg-[#FCE7F3] text-[#831843] text-xs font-bold cursor-pointer"
                      >
                        Carte
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTriggerWizz(friend)}
                        className={`px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                          pokedFriendIds[friend.id] || friend.lastPokedAt
                            ? 'bg-[#FCE7F3] text-[#831843] border border-[#F472B6]/40'
                            : 'bg-[#831843] hover:bg-[#500724] text-white'
                        }`}
                        title="Envoyer un Wizz motivation"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Wizz ⚡</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALS: STORY RECAP (#20), QR CODE INVITE (#3), CELEBRATE PR (#9), FRIEND CARD (#4)
         ===================================================================== */}
      <StoryRecapModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        workout={workouts[0] || null}
      />

      {/* Modal Renommer une amie comme on veut */}
      <BottomSheet
        isOpen={!!renamingFriend}
        onClose={() => setRenamingFriend(null)}
        title={renamingFriend ? `Renommer ${renamingFriend.displayName}` : 'Renommer mon amie'}
        subtitle="Choisis le prénom, surnom ou pseudo que tu veux afficher pour elle"
      >
        {renamingFriend && (
          <form onSubmit={handleSaveRenamedFriend} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-[#2B091C] block mb-1">
                Prénom ou surnom affiché *
              </label>
              <input
                type="text"
                required
                value={renameDisplayName}
                onChange={(e) => setRenameDisplayName(e.target.value)}
                placeholder="Ex: Ma Chloé, Camille, Sarah Bestie..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs font-bold text-[#2B091C]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2B091C] block mb-1">
                Son @pseudo
              </label>
              <input
                type="text"
                value={renameHandle}
                onChange={(e) => setRenameHandle(e.target.value)}
                placeholder="@chloe.glow"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs font-semibold text-[#831843]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2B091C] block mb-1">
                Petite bio / note sur sa carte
              </label>
              <input
                type="text"
                value={renameBio}
                onChange={(e) => setRenameBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs text-[#2B091C]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#831843] text-white text-xs font-bold cursor-pointer"
            >
              Enregistrer son nouveau nom ✨
            </button>
          </form>
        )}
      </BottomSheet>

      {/* Feature #9: Modal Célébrer un Record Personnel (PR) */}
      <BottomSheet
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        title="Célébrer un Record Personnel (PR)"
        subtitle="Partage ta victoire avec tes Gym Besties"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sharePRToFeed(
              prExerciseName,
              parseFloat(prWeight) || 80,
              parseInt(prReps, 10) || 8,
              prCaption
            );
            setIsPRModalOpen(false);
            setPrCaption('');
            triggerToast('Ton nouveau PR a été publié dans le Fil ! 🏆');
          }}
          className="space-y-3.5"
        >
          <div>
            <label className="text-xs font-bold text-[#2B091C] block mb-1">
              Exercice
            </label>
            <input
              type="text"
              required
              value={prExerciseName}
              onChange={(e) => setPrExerciseName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs font-bold text-[#2B091C]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2B091C] block mb-1">
                Charge record (kg)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={prWeight}
                onChange={(e) => setPrWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs font-mono font-bold text-[#831843]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2B091C] block mb-1">
                Répétitions
              </label>
              <input
                type="number"
                required
                value={prReps}
                onChange={(e) => setPrReps(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs font-mono font-bold text-[#831843]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#2B091C] block mb-1">
              Petit mot (optionnel)
            </label>
            <input
              type="text"
              value={prCaption}
              onChange={(e) => setPrCaption(e.target.value)}
              placeholder="Ex: Trop fière, la barre est montée super vite !"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6EDF2] text-xs text-[#2B091C]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#831843] text-white text-xs font-bold cursor-pointer"
          >
            Publier mon Record Personnel 🏆
          </button>
        </form>
      </BottomSheet>

      {/* Feature #4: Carte de profil sportif public d'une amie */}
      <BottomSheet
        isOpen={!!selectedFriendProfile}
        onClose={() => setSelectedFriendProfile(null)}
        title={selectedFriendProfile ? `Profil de ${selectedFriendProfile.displayName}` : 'Profil'}
        subtitle={selectedFriendProfile?.handle}
      >
        {selectedFriendProfile && (
          <div className="space-y-4">
            <div className="p-4 rounded-[26px] bg-grainy-pink border border-[#F472B6]/35 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <span
                    className="w-14 h-14 rounded-2xl text-white font-display font-extrabold text-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: selectedFriendProfile.avatarColor }}
                  >
                    {selectedFriendProfile.displayName.charAt(0)}
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-lg text-[#2B091C]">
                      {selectedFriendProfile.displayName}
                    </h4>
                    <p className="text-xs text-[#5C3A4D]">{selectedFriendProfile.bioStatus}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenRenameFriend(selectedFriendProfile)}
                  className="px-3 py-1.5 rounded-full bg-white text-[#831843] text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Renommer</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-white/85">
                  <span className="font-mono font-extrabold text-base text-[#831843] block">
                    {selectedFriendProfile.totalWorkouts}
                  </span>
                  <span className="text-[10px] font-bold text-[#7A616F]">Séances</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/85">
                  <span className="font-mono font-extrabold text-base text-[#831843] block">
                    {selectedFriendProfile.streakWeeks} sem.
                  </span>
                  <span className="text-[10px] font-bold text-[#7A616F]">Régularité</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/85">
                  <span className="font-mono font-extrabold text-base text-[#831843] block">
                    {selectedFriendProfile.objectivesDoneCount}/3
                  </span>
                  <span className="text-[10px] font-bold text-[#7A616F]">Objectifs</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/85 text-xs">
                <span className="text-[#7A616F] font-semibold">Exercice favori : </span>
                <strong className="text-[#831843]">
                  {selectedFriendProfile.favoriteExercise}
                </strong>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedFriendProfile.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-1 rounded-full bg-[#831843] text-white text-[10px] font-bold"
                  >
                    🏅 {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  handleTriggerWizz(selectedFriendProfile);
                  setSelectedFriendProfile(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-full bg-gradient-to-r from-[#831843] to-[#EC4899] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Envoyer un Wizz ⚡</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCompareFriendId(selectedFriendProfile.id);
                  setInviteFriendId(selectedFriendProfile.id);
                  setSelectedFriendProfile(null);
                  setSubTab('besties');
                }}
                className="flex-1 py-2.5 px-3 rounded-full bg-[#831843] text-white text-xs font-bold cursor-pointer"
              >
                Inviter / Planning
              </button>
              <button
                type="button"
                onClick={() => {
                  removeFriend(selectedFriendProfile.id);
                  setSelectedFriendProfile(null);
                  triggerToast(`${selectedFriendProfile.displayName} a été retirée de ta liste.`);
                }}
                className="px-4 py-2.5 rounded-full bg-[#F6EDF2] text-[#7A616F] text-xs font-bold cursor-pointer"
              >
                Retirer
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
