export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Voiceover is 49.44 s. 1484 frames = 49.467 s (single-frame tolerance). */
export const DURATION_IN_FRAMES = 1484;

export type SceneTiming = {
  id: string;
  startFrame: number;
  durationInFrames: number;
  accent: string;
};

/**
 * Scene boundaries are measured from the actual voiceover, not the SRT.
 * Silence analysis (ffmpeg silencedetect + 20 ms RMS envelope) shows speech
 * starts 0.2-0.6 s later than the SRT cue times, so cue-based cuts drifted.
 *
 * Each boundary sits in the pause just before the next spoken sentence
 * (about 0.2 s of lead-in) so the new scene appears on the first syllable.
 *
 *   S01  0.000 -  5.733  (cue 1-2)
 *   S02  5.733 - 12.600  (cue 3-4)
 *   S03 12.600 - 18.600  (cue 5-7)
 *   S04 18.600 - 24.433  (cue 8-9)
 *   S05 24.433 - 30.933  (cue 10-12)
 *   S06 30.933 - 35.667  (cue 13)
 *   S07 35.667 - 39.833  (cue 14)
 *   S08 39.833 - 44.033  (cue 15-16)
 *   S09 44.033 - 46.000  (cue 17)
 *   S10 46.000 - 49.467  (cue 18-19)
 */
export const SCENES: SceneTiming[] = [
  {id: "S01", startFrame: 0, durationInFrames: 172, accent: "#398CE5"},
  {id: "S02", startFrame: 172, durationInFrames: 206, accent: "#FFC247"},
  {id: "S03", startFrame: 378, durationInFrames: 180, accent: "#F16B75"},
  {id: "S04", startFrame: 558, durationInFrames: 175, accent: "#19B77A"},
  {id: "S05", startFrame: 733, durationInFrames: 195, accent: "#FFC247"},
  {id: "S06", startFrame: 928, durationInFrames: 142, accent: "#398CE5"},
  {id: "S07", startFrame: 1070, durationInFrames: 125, accent: "#19B77A"},
  {id: "S08", startFrame: 1195, durationInFrames: 126, accent: "#398CE5"},
  {id: "S09", startFrame: 1321, durationInFrames: 59, accent: "#FFC247"},
  {id: "S10", startFrame: 1380, durationInFrames: 104, accent: "#19B77A"},
];

export type SfxCue = {
  sound:
    | "whoosh"
    | "swipe"
    | "pop"
    | "tick"
    | "click"
    | "ding"
    | "coin"
    | "riser"
    | "warn";
  atSeconds: number;
  gain: number;
};

/**
 * SFX are measured against the real voiceover too: each cue fires on the
 * syllable where its visual event happens. Voiceover peak is -0.4 dBFS, so
 * these gains keep effects roughly 12-18 dB under the narration.
 */
export const SFX_CUES: SfxCue[] = [
  {sound: "pop", atSeconds: 0.3, gain: 0.26},
  {sound: "tick", atSeconds: 2.88, gain: 0.24},
  {sound: "riser", atSeconds: 5.8, gain: 0.3},
  {sound: "ding", atSeconds: 6.12, gain: 0.34},
  {sound: "coin", atSeconds: 8.36, gain: 0.34},
  {sound: "warn", atSeconds: 9.96, gain: 0.34},
  {sound: "swipe", atSeconds: 12.88, gain: 0.3},
  {sound: "pop", atSeconds: 14.26, gain: 0.26},
  {sound: "swipe", atSeconds: 18.82, gain: 0.3},
  {sound: "coin", atSeconds: 22.0, gain: 0.34},
  {sound: "ding", atSeconds: 27.68, gain: 0.34},
  {sound: "riser", atSeconds: 31.05, gain: 0.3},
  {sound: "coin", atSeconds: 34.1, gain: 0.34},
  {sound: "whoosh", atSeconds: 35.7, gain: 0.3},
  {sound: "ding", atSeconds: 37.66, gain: 0.34},
  {sound: "click", atSeconds: 41.03, gain: 0.26},
  {sound: "riser", atSeconds: 44.1, gain: 0.3},
  {sound: "ding", atSeconds: 44.27, gain: 0.34},
  {sound: "swipe", atSeconds: 46.24, gain: 0.3},
];
