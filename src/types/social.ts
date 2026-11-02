import { WorkoutExerciseItem } from './fitness';

export type ReactionType = 'fire' | 'muscle' | 'flower' | 'clap';

export interface SocialComment {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatarColor: string;
  text: string;
  createdAt: string;
}

export interface SharedRoutinePayload {
  name: string;
  targetZone: string;
  description?: string;
  finisher?: string;
  exercises: WorkoutExerciseItem[];
}

export interface SocialFeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatarColor: string;
  type: 'workout' | 'pr' | 'objective' | 'routine_share' | 'wizz' | 'gym_date';
  createdAt: string;
  workoutName?: string;
  durationMinutes?: number;
  exercisesSummary?: {
    name: string;
    setsCount: number;
    reps: string;
    topWeight?: number;
  }[];
  hideWeights?: boolean;
  prExerciseName?: string;
  prWeight?: number;
  prReps?: number;
  objectiveLabel?: string;
  sharedRoutine?: SharedRoutinePayload;
  wizzTargetName?: string;
  wizzTargetHandle?: string;
  gymDateSummary?: {
    friendName: string;
    dayLabel: string;
    timeSlot: string;
    workoutTheme: string;
    locationNote?: string;
  };
  caption?: string;
  reactions: Record<ReactionType, string[]>; // list of userIds who reacted
  comments: SocialComment[];
}

export interface FriendDaySchedule {
  dayOfWeek: number; // 1 = Lundi ... 0 = Dimanche
  dayName: string;
  activity: string;
  workoutName?: string;
  isTraining: boolean;
}

export interface FriendProfile {
  id: string;
  displayName: string;
  handle: string; // e.g. @lea.glow
  friendCode: string; // e.g. GLOW-29A
  avatarColor: string;
  bioStatus: string;
  favoriteExercise: string;
  weeklySessionsDone: number;
  weeklySessionsTarget: number;
  streakWeeks: number;
  totalWorkouts: number;
  hideWeights: boolean;
  badges: string[];
  objectivesDoneCount: number;
  todayActivity: string;
  todayWorkoutName?: string;
  isTrainingToday: boolean;
  weeklySchedule: FriendDaySchedule[];
  sharedRoutines: SharedRoutinePayload[];
  lastPokedAt?: string;
}

export interface FriendRequest {
  id: string;
  fromUser: FriendProfile;
  direction: 'incoming' | 'outgoing';
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface GymDateInvite {
  id: string;
  friendId: string;
  friendName: string;
  friendHandle: string;
  friendAvatarColor: string;
  dayOfWeek: number;
  dayLabel: string;
  timeSlot: string;
  workoutTheme: string;
  locationNote?: string;
  direction: 'incoming' | 'outgoing';
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface CollectiveChallenge {
  id: string;
  title: string;
  description: string;
  targetSessions: number;
  weekLabel: string;
  contributions: {
    userId: string;
    name: string;
    avatarColor: string;
    sessionsCount: number;
  }[];
}

export interface SocialBadge {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'sparkle' | 'heart-pulse' | 'kettlebell' | 'biceps' | 'weightlifter';
  unlocked: boolean;
  progressText: string;
}

export interface MySocialProfile {
  handle: string;
  friendCode: string;
  avatarColor: string;
  bioStatus: string;
  favoriteExercise: string;
  hideWeights: boolean;
  duoPartnerId: string;
  duoStreakWeeks: number;
}
