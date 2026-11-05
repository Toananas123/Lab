/**
 * Web Audio API synthesize pleasant bell/chime tones
 * and navigator.vibrate for mobile rest timer notifications.
 */
export function playRestCompleteSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play a gentle two-tone chime (F5 -> A5)
    const now = ctx.currentTime;
    
    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, now); // F5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Tone 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.15); // A5
    gain2.gain.setValueAtTime(0.2, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.8);

    // Mobile vibration if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([150, 80, 250]);
    }
  } catch (err) {
    console.debug('Audio feedback not permitted or error', err);
  }
}

/**
 * Short non-intrusive Web Audio API beeps for Finisher intervals (Tabata, Pyramide, Plank transitions)
 * Designed not to pause or interrupt background Spotify playback.
 */
export function playFinisherBeep(type: 'countdown' | 'effort' | 'rest' | 'transition' | 'complete') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const triggerTone = (freq: number, startOffset: number, duration: number, gainVal = 0.14) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + startOffset);
      gain.gain.setValueAtTime(gainVal, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration);
    };

    if (type === 'countdown') {
      triggerTone(587.33, 0, 0.12, 0.1); // D5 short tick
    } else if (type === 'effort') {
      triggerTone(880, 0, 0.15, 0.18); // A5
      triggerTone(1046.5, 0.14, 0.28, 0.22); // C6 GO!
      if ('vibrate' in navigator) navigator.vibrate([120, 60, 180]);
    } else if (type === 'rest') {
      triggerTone(659.25, 0, 0.18, 0.16); // E5
      triggerTone(523.25, 0.16, 0.3, 0.16); // C5 Rest
      if ('vibrate' in navigator) navigator.vibrate(150);
    } else if (type === 'transition') {
      triggerTone(783.99, 0, 0.14, 0.18); // G5
      triggerTone(783.99, 0.18, 0.24, 0.18); // G5 double beep for plank side switch
      if ('vibrate' in navigator) navigator.vibrate([100, 60, 100]);
    } else if (type === 'complete') {
      triggerTone(523.25, 0, 0.15, 0.18); // C5
      triggerTone(659.25, 0.14, 0.15, 0.18); // E5
      triggerTone(783.99, 0.28, 0.15, 0.18); // G5
      triggerTone(1046.5, 0.42, 0.5, 0.24); // C6 Victory!
      if ('vibrate' in navigator) navigator.vibrate([180, 80, 180, 80, 350]);
    }
  } catch (err) {
    console.debug('Finisher audio beep error', err);
  }
}

