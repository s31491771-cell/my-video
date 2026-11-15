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
 * Scene boundaries follow the SRT narration blocks. Frames are rounded to the
 * nearest frame at 30 fps so every cut lands inside the gap between cues.
 */
export const SCENES: SceneTiming[] = [
  {id: "S01", startFrame: 0, durationInFrames: 156, accent: "#398CE5"},
  {id: "S02", startFrame: 156, durationInFrames: 229, accent: "#FFC247"},
  {id: "S03", startFrame: 385, durationInFrames: 178, accent: "#F16B75"},
  {id: "S04", startFrame: 563, durationInFrames: 174, accent: "#19B77A"},
  {id: "S05", startFrame: 737, durationInFrames: 140, accent: "#FFC247"},
  {id: "S06", startFrame: 877, durationInFrames: 190, accent: "#398CE5"},
  {id: "S07", startFrame: 1067, durationInFrames: 121, accent: "#19B77A"},
  {id: "S08", startFrame: 1188, durationInFrames: 137, accent: "#398CE5"},
  {id: "S09", startFrame: 1325, durationInFrames: 83, accent: "#FFC247"},
  {id: "S10", startFrame: 1408, durationInFrames: 76, accent: "#19B77A"},
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
 * SFX land on visible events, not random timestamps. Voiceover peak is -0.4 dBFS,
 * so these gains put every effect roughly 12-18 dB under the narration peaks.
 */
export const SFX_CUES: SfxCue[] = [
  {sound: "pop", atSeconds: 1.2, gain: 0.26},
  {sound: "tick", atSeconds: 2.81, gain: 0.24},
  {sound: "riser", atSeconds: 5.45, gain: 0.3},
  {sound: "ding", atSeconds: 6.55, gain: 0.34},
  {sound: "coin", atSeconds: 7.6, gain: 0.34},
  {sound: "warn", atSeconds: 9.95, gain: 0.34},
  {sound: "swipe", atSeconds: 12.84, gain: 0.3},
  {sound: "pop", atSeconds: 15.13, gain: 0.26},
  {sound: "swipe", atSeconds: 18.77, gain: 0.3},
  {sound: "coin", atSeconds: 21.9, gain: 0.34},
  {sound: "ding", atSeconds: 26.5, gain: 0.34},
  {sound: "riser", atSeconds: 30.99, gain: 0.3},
  {sound: "coin", atSeconds: 33.4, gain: 0.34},
  {sound: "whoosh", atSeconds: 35.57, gain: 0.3},
  {sound: "ding", atSeconds: 37.6, gain: 0.34},
  {sound: "click", atSeconds: 39.6, gain: 0.26},
  {sound: "riser", atSeconds: 44.18, gain: 0.3},
  {sound: "ding", atSeconds: 45.1, gain: 0.34},
  {sound: "swipe", atSeconds: 46.94, gain: 0.3},
];
