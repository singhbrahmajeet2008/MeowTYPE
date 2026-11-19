// ==========================================================================
// meow-typing - Hacker Terminal Audio Synthesizer (Web Audio API)
// 100% Offline, Zero Latency - Crisp Tactile Keystrokes & Cyber Chimes
// ==========================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.5;
    this.errorAudioBuffer = null;
    this.errorAudioElement = null;

    // Background Typing Music (Uploaded Cat Meme BGM)
    this.bgmAudioElement = null;
    this.musicEnabled = true;
    this.musicVolume = 0.45;

    this.initAudioContext();
    this.loadErrorSound();
    this.loadBgmSound();
  }

  initAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx && !this.ctx) {
      this.ctx = new AudioCtx();
    }
  }

  loadBgmSound() {
    try {
      this.bgmAudioElement = new Audio('assets/typing-bgm.mp3');
      this.bgmAudioElement.loop = true;
      this.bgmAudioElement.volume = this.musicVolume;
      this.bgmAudioElement.preload = 'auto';
    } catch (e) {
      console.warn('Could not initialize BGM audio element:', e);
    }
  }

  startBgm() {
    if (!this.musicEnabled) return;
    this.resume();
    if (!this.bgmAudioElement) {
      this.loadBgmSound();
    }
    if (this.bgmAudioElement) {
      try {
        this.bgmAudioElement.currentTime = 0;
        this.bgmAudioElement.volume = this.musicVolume;
        const playPromise = this.bgmAudioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('BGM playback notice (requires user interaction):', err.message);
          });
        }
      } catch (err) {
        console.warn('BGM play error:', err);
      }
    }
  }

  stopBgm() {
    if (this.bgmAudioElement) {
      try {
        this.bgmAudioElement.pause();
        this.bgmAudioElement.currentTime = 0;
      } catch (err) {}
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopBgm();
    }
    return this.musicEnabled;
  }

  setMusicVolume(vol) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudioElement) {
      this.bgmAudioElement.volume = this.musicVolume;
    }
  }

  loadErrorSound() {
    try {
      this.errorAudioElement = new Audio('assets/error-sound.mp3');
      this.errorAudioElement.preload = 'auto';
    } catch (e) {}

    if (typeof fetch !== 'undefined' && typeof window !== 'undefined') {
      fetch('assets/error-sound.mp3')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.arrayBuffer();
        })
        .then(buf => {
          if (this.ctx && this.ctx.decodeAudioData) {
            return this.ctx.decodeAudioData(buf).then(decoded => {
              this.errorAudioBuffer = decoded;
            });
          }
        })
        .catch(() => {});
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.errorAudioBuffer && typeof fetch !== 'undefined') {
      this.loadErrorSound();
    }
  }

  // Crisp mechanical terminal keystroke
  playKey(key = '') {
    if (!this.enabled) return;
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const isSpace = key === ' ';
    const isEnter = key === 'Enter';
    const isBackspace = key === 'Backspace';
    const jitter = 0.95 + Math.random() * 0.1;

    // High tactile frequency click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    let freq = 1800 * jitter;
    if (isSpace) freq = 1200 * jitter;
    if (isBackspace) freq = 900 * jitter;

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.022);

    gain.gain.setValueAtTime(this.volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.022);

    // Deep low bottom-out thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const subFilter = this.ctx.createBiquadFilter();

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(isSpace ? 110 : 150 * jitter, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.045);

    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(800, now);

    subGain.gain.setValueAtTime(this.volume * 0.45, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.05);
  }

  // Error sound: Plays uploaded meme scream audio + fallback buzz
  playError() {
    if (!this.enabled) return;
    this.resume();

    // 1. Zero-latency Web Audio API buffer playback (supports rapid polyphonic overlapping)
    if (this.ctx && this.errorAudioBuffer) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.errorAudioBuffer;
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(this.volume * 0.75, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return;
      } catch (err) {}
    }

    // 2. HTML5 Audio fallback
    if (this.errorAudioElement) {
      try {
        const clone = this.errorAudioElement.cloneNode();
        clone.volume = Math.max(0, Math.min(1, this.volume * 0.75));
        clone.currentTime = 0;
        const p = clone.play();
        if (p !== undefined) p.catch(() => {});
        return;
      } catch (err) {}
    }

    // 3. Synthesizer fallback if audio file is still loading or unavailable
    if (this.ctx) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.08);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  // Victory fanfare for completed test
  playVictoryFanfare() {
    if (!this.enabled) return;
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 440.0, t: 0.00, d: 0.12 }, // A4
      { f: 554.37, t: 0.10, d: 0.12 }, // C#5
      { f: 659.25, t: 0.20, d: 0.12 }, // E5
      { f: 880.0, t: 0.32, d: 0.35 }  // A5
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(this.volume * 0.3, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }
}

window.soundEngine = new SoundEngine();
