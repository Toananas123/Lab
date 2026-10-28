import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { TopHeader } from './components/navigation/TopHeader';
import { BottomNav, NavTab } from './components/navigation/BottomNav';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { HomeView } from './components/home/HomeView';
import { ExercisesView } from './components/exercises/ExercisesView';
import { WorkoutsView } from './components/workouts/WorkoutsView';
import { ActiveWorkoutView } from './components/workouts/ActiveWorkoutView';
import { PlanningView } from './components/planning/PlanningView';
import { ProgressView } from './components/progress/ProgressView';
import { MeasurementsView } from './components/measurements/MeasurementsView';
import { ProfileModal } from './components/profile/ProfileModal';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { MuscleCategory } from './types/fitness';
import { StreamlineIcon } from './components/ui/StreamlineIcon';
import { X } from 'lucide-react';

const AuthenticatedApp: React.FC = () => {
  const { activeWorkout, cancelActiveWorkout } = useWorkout();
  const { user, profile, logout } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavTab | 'measurements' | 'active_workout'>('home');
  const [exercisesFilterCategory, setExercisesFilterCategory] = useState<MuscleCategory | 'favorites'>('lower-body');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const displayName = profile?.displayName || user?.displayName || 'Mon Espace';
  const spotifyUrl = profile?.spotifyUrl || 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM';

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenCategory = (cat: MuscleCategory) => {
    setExercisesFilterCategory(cat);
    setCurrentTab('exercises');
  };

  const handleOpenMeasurements = () => {
    setCurrentTab('measurements');
  };

  const handleStartActiveMode = () => {
    setCurrentTab('active_workout');
  };

  const showActiveWorkoutBanner = !!activeWorkout && currentTab !== 'active_workout';
  const isDarkWorkoutMode = !!activeWorkout;

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row font-sans relative overflow-x-hidden transition-colors duration-300 ${
        isDarkWorkoutMode
          ? 'bg-[#12030D] text-[#FDF2F8] selection:bg-[#EC4899] selection:text-white'
          : 'bg-[#FDFBFD] text-[#2B091C] selection:bg-[#FBCFE8] selection:text-[#831843]'
      }`}
    >
      <OfflineIndicator />

      {/* Minimal Mobile Top Bar */}
      <TopHeader
        onGoHome={() => setCurrentTab('home')}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAuth={() => handleOpenAuth('login')}
        isDarkMode={isDarkWorkoutMode}
      />

      {/* Desktop Left Sidebar + Mobile Floating Bottom Pill Bar */}
      <BottomNav
        activeTab={
          currentTab === 'measurements'
            ? 'progress'
            : currentTab === 'active_workout'
            ? 'workouts'
            : currentTab
        }
        onTabChange={(tab) => setCurrentTab(tab)}
        hasActiveWorkout={showActiveWorkoutBanner}
        onOpenActiveWorkout={() => setCurrentTab('active_workout')}
        onCancelActiveWorkout={cancelActiveWorkout}
        displayName={displayName}
        spotifyUrl={spotifyUrl}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={logout}
        isDarkMode={isDarkWorkoutMode}
        isLoggedIn={!!user}
      />

      {/* Main Content Area (no z-10 stacking trap so modals sit cleanly on top) */}
      <main className="flex-1 w-full lg:pl-60">
        {/* Static "Séance en cours" Banner right below the header (ONLY rendered if a workout is in progress and user is outside active tab) */}
        {showActiveWorkoutBanner && activeWorkout && (
          <div className="w-full bg-[#831843] text-white border-b border-[#9D174D]/40 shadow-sm">
            <div className="max-w-xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
              <button
                onClick={handleStartActiveMode}
                className="flex items-center gap-2.5 text-left flex-1 min-w-0"
              >
                <span className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <StreamlineIcon name="weightlifter" className="w-4 h-4 text-[#FBCFE8]" />
                </span>
                <div className="min-w-0">
                  <span className="font-compact text-[10px] font-semibold uppercase tracking-wider text-[#FBCFE8] block leading-none">
                    Séance en cours
                  </span>
                  <span className="font-display font-bold text-xs sm:text-sm text-white truncate block mt-0.5">
                    {activeWorkout.name}
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleStartActiveMode}
                  className="px-3.5 py-1.5 rounded-full bg-white text-[#831843] text-xs font-bold active:scale-95 transition-transform"
                >
                  Reprendre
                </button>
                <button
                  onClick={cancelActiveWorkout}
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                  title="Fermer la séance"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-xl lg:max-w-4xl mx-auto px-4 sm:px-6 pt-2 lg:pt-8 pb-28 lg:pb-14">
          <div key={currentTab} className="liquid-tab-enter">
            {currentTab === 'home' && (
              <HomeView
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenCategory={handleOpenCategory}
                onOpenMeasurements={handleOpenMeasurements}
                onStartActiveMode={handleStartActiveMode}
              />
            )}

            {currentTab === 'exercises' && (
              <ExercisesView
                initialCategory={exercisesFilterCategory}
                onAddToActiveWorkout={() => setCurrentTab('active_workout')}
              />
            )}

            {currentTab === 'workouts' && (
              <WorkoutsView onStartActiveMode={handleStartActiveMode} />
            )}

            {currentTab === 'active_workout' && (
              <ActiveWorkoutView
                onFinishWorkout={() => setCurrentTab('home')}
                onExit={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'planning' && (
              <PlanningView onStartActiveMode={handleStartActiveMode} />
            )}

            {currentTab === 'progress' && (
              <ProgressView onOpenMeasurements={handleOpenMeasurements} />
            )}

            {currentTab === 'measurements' && (
              <MeasurementsView onBackToProgress={() => setCurrentTab('progress')} />
            )}
          </div>
        </div>
      </main>

      {/* Modals / Bottom Sheets */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
};

const AppRoot: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <div className="h-9 w-40 rounded-2xl bg-[#F6EDF2] animate-pulse" />
          <div className="h-32 rounded-[28px] bg-[#F6EDF2] animate-pulse" />
          <div className="space-y-3">
            <div className="h-20 rounded-[24px] bg-[#F6EDF2] animate-pulse" />
            <div className="h-20 rounded-[24px] bg-[#F6EDF2] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => handleOpenAuth('login')}
          onOpenRegister={() => handleOpenAuth('register')}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      </>
    );
  }

  return (
    <WorkoutProvider>
      <AuthenticatedApp />
    </WorkoutProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  );
}
