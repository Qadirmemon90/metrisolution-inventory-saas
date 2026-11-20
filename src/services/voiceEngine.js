/**
 * MetriSolution Inventory ERP SaaS - Audible Voice Simulation Engine
 * Employs Web Audio API and Speech Synthesis for realistic in-browser voice note playback.
 */

class VoiceEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.duration = 4.8; // seconds
    this.currentTime = 0;
    this.timerId = null;
    this.onProgressCallback = null;
    this.onStateChangeCallback = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Generates realistic voice formant audio harmonic pulses using Web Audio API
   */
  playSyntheticFormants(duration) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // F0 Fundamental voice pitch around 140Hz (Male Pakistani speaker)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(145, ctx.currentTime);
    // Melodic inflection matching Urdu phrase cadence
    osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.8); // "Abdul Qadir"
    osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 1.4);
    osc.frequency.linearRampToValueAtTime(165, ctx.currentTime + 2.2); // "meri shop par"
    osc.frequency.linearRampToValueAtTime(190, ctx.currentTime + 3.2); // "door lock ke"
    osc.frequency.linearRampToValueAtTime(210, ctx.currentTime + 3.8); // "25 boxes"
    osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 4.5); // "bhejwa do"

    // Vowel formant bandpass filter around 750Hz (Urdu vowel resonance)
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, ctx.currentTime);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    // Dynamic amplitude envelope
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + duration - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  /**
   * Attempts native speech synthesis if voices are ready, while playing Web Audio formants
   */
  speakUrduSample(text = "Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do.") {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        // Search for ur-PK, hi-IN, or en-PK voices if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('ur') || v.lang.includes('hi') || v.lang.includes('PK'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis note fallback:', err);
      }
    }
  }

  play(onProgress, onStateChange) {
    this.onProgressCallback = onProgress;
    this.onStateChangeCallback = onStateChange;

    if (this.isPlaying) {
      this.pause();
      return;
    }

    this.isPlaying = true;
    if (this.onStateChangeCallback) this.onStateChangeCallback(true);

    // Trigger audible audio
    this.playSyntheticFormants(this.duration);
    this.speakUrduSample("Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do.");

    const stepMs = 50;
    this.timerId = setInterval(() => {
      this.currentTime += stepMs / 1000;
      if (this.currentTime >= this.duration) {
        this.currentTime = this.duration;
        this.pause(true); // completed
      }
      if (this.onProgressCallback) {
        this.onProgressCallback(this.currentTime, this.duration);
      }
    }, stepMs);
  }

  pause(completed = false) {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (completed) {
      this.currentTime = 0;
    }
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(false);
    }
    if (this.onProgressCallback) {
      this.onProgressCallback(this.currentTime, this.duration);
    }
  }
}

export const voiceEngine = new VoiceEngine();
