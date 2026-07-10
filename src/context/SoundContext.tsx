"use client";

import * as React from "react";

export type SoundName = "click" | "success" | "notification" | "invoiceGenerated" | "paymentReceived";

interface SoundContextValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  play: (name: SoundName) => void;
}

const SoundContext = React.createContext<SoundContextValue | null>(null);
const STORAGE_KEY = "ivoxa-sound-enabled";

/** Short synthesized tones (Web Audio oscillators) — no external audio
 * files to fetch or maintain. Each entry is a tiny sequence of
 * frequency/duration/gain steps rendered on a shared AudioContext. */
const SOUND_RECIPES: Record<
  SoundName,
  { freq: number; duration: number; type: OscillatorType; gain?: number }[]
> = {
  click: [{ freq: 720, duration: 0.03, type: "sine", gain: 0.05 }],
  notification: [
    { freq: 660, duration: 0.06, type: "sine", gain: 0.06 },
    { freq: 880, duration: 0.08, type: "sine", gain: 0.05 },
  ],
  success: [
    { freq: 523.25, duration: 0.08, type: "sine", gain: 0.06 },
    { freq: 783.99, duration: 0.12, type: "sine", gain: 0.06 },
  ],
  invoiceGenerated: [
    { freq: 587.33, duration: 0.07, type: "sine", gain: 0.05 },
    { freq: 880, duration: 0.1, type: "sine", gain: 0.05 },
  ],
  paymentReceived: [
    { freq: 523.25, duration: 0.07, type: "sine", gain: 0.06 },
    { freq: 659.25, duration: 0.07, type: "sine", gain: 0.06 },
    { freq: 987.77, duration: 0.14, type: "sine", gain: 0.06 },
  ],
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = React.useState(false);
  const enabledRef = React.useRef(false);
  const audioCtxRef = React.useRef<AudioContext | null>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) === "true";
    enabledRef.current = stored;
    setEnabledState(stored);
  }, []);

  const setEnabled = React.useCallback((next: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(next));
    enabledRef.current = next;
    setEnabledState(next);
  }, []);

  const play = React.useCallback((name: SoundName) => {
    if (!enabledRef.current || typeof window === "undefined") return;
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") void ctx.resume();

    let t = ctx.currentTime;
    for (const step of SOUND_RECIPES[name]) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = step.type;
      osc.frequency.setValueAtTime(step.freq, t);
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(step.gain ?? 0.05, t + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + step.duration);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + step.duration + 0.02);
      t += step.duration * 0.85;
    }
  }, []);

  return (
    <SoundContext.Provider value={{ enabled, setEnabled, play }}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = React.useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within <SoundProvider>");
  return ctx;
}
