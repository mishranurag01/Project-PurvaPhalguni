// Subtle Web Audio API chime synthesizer for ethereal feedback
class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = true; // muted by default for tranquility

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCelestialChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Gentle chord: F#5 (740 Hz), A#5 (932 Hz), C#6 (1108 Hz)
      const freqs = [739.99, 932.33, 1108.73];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // Very soft bell envelope
        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.04, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + idx * 0.08 + 1.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.8);
      });
    } catch {
      // Audio autoplay policy or unavailable, fail quietly
    }
  }

  playSoftTap() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Silent fail
    }
  }
}

export const soundSynth = new SoundSynthesizer();
