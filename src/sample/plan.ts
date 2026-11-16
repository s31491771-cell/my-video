import {CUES} from "../cues";

/**
 * 59.3 s documentary sample: cues 1-22 only.
 *
 * Scene starts sit 0.25 s before the first spoken cue, so the dissolve finishes
 * before the syllable lands. Every animation delay is measured from the same
 * cue clock, which keeps picture and narration locked together.
 */
export const SAMPLE_SECONDS = 59.3;
export const SAMPLE_FRAMES = 1779;
export const LEAD_SECONDS = 0.25;

export type Mood = "warm" | "cool" | "dark" | "green";
export type Camera = {from: [number, number, number]; to: [number, number, number]};

export type SceneKind =
  | "opening"
  | "friends"
  | "office"
  | "sameLife"
  | "year2025"
  | "rakib"
  | "sumanBeat"
  | "suman"
  | "question"
  | "answers"
  | "habit";

export type SampleScene = {
  id: string;
  kind: SceneKind;
  start: number;
  end: number;
  startFrame: number;
  durationInFrames: number;
  cueIds: number[];
  mood: Mood;
  chapter: string;
  chapterLabel: string;
  camera: Camera;
  data: Record<string, unknown>;
};

type SceneDef = Omit<SampleScene, "start" | "end" | "startFrame" | "durationInFrames">;

const DEFINITIONS: SceneDef[] = [
  {
    id: "P01",
    kind: "opening",
    cueIds: [1, 2],
    mood: "warm",
    chapter: "০১",
    chapterLabel: "২০১৫ · ঢাকার মিরপুর",
    camera: {from: [1.15, -34, -14], to: [1.02, 10, 6]},
    data: {year: "২০১৫", city: "ঢাকার মিরপুর", tag: "একটি সত্যি গল্পের শুরু"},
  },
  {
    id: "P02",
    kind: "friends",
    cueIds: [3, 4],
    mood: "warm",
    chapter: "০১",
    chapterLabel: "দুই বন্ধু",
    camera: {from: [1.03, 0, 8], to: [1.10, -16, -10]},
    data: {names: ["রাকিব", "সুমন"], age: "২৫ বছর", line: "একই বয়স, একই স্বপ্ন"},
  },
  {
    id: "P03",
    kind: "office",
    cueIds: [5, 6],
    mood: "cool",
    chapter: "০২",
    chapterLabel: "একই শুরু",
    camera: {from: [1.06, 22, 0], to: [1.01, -22, -8]},
    data: {
      kicker: "একই অফিস",
      title: "দুজনের গল্প এখানেই মিলে যায়",
      salary: "৩০,০০০",
      salaryNote: "মাসিক বেতন",
    },
  },
  {
    id: "P04",
    kind: "sameLife",
    cueIds: [7, 8],
    mood: "cool",
    chapter: "০২",
    chapterLabel: "একই জীবন",
    camera: {from: [1.03, -14, 12], to: [1.11, 20, -12]},
    data: {
      kicker: "তবুও একটি মিল",
      lines: ["একই শহর", "একই বেতন", "একই জীবনযাত্রা"],
      note: "২০১৫ থেকে ২০২৫ — শুরুটা ছিল হুবহু এক",
    },
  },
  {
    id: "P05",
    kind: "year2025",
    cueIds: [9, 10],
    mood: "dark",
    chapter: "০৩",
    chapterLabel: "দশ বছর পর",
    camera: {from: [1.02, 0, 0], to: [1.13, 0, -10]},
    data: {
      year: "২০২৫",
      kicker: "দশ বছর পর",
      headline: "একই আয়। একই শহর।",
      headline2: "তবু দুই জীবন আকাশ-পাতাল।",
    },
  },
  {
    id: "P06",
    kind: "rakib",
    cueIds: [11],
    mood: "dark",
    chapter: "০৩",
    chapterLabel: "রাকিব",
    camera: {from: [1.05, 16, 0], to: [1.11, -18, -6]},
    data: {
      name: "রাকিব",
      label: "রাকিবের ব্যাংক অ্যাকাউন্টে আজ",
      amount: "১৪,০০,০০০",
      caption: "দশ বছরের সঞ্চয় ও বিনিয়োগ",
    },
  },
  {
    id: "P07",
    kind: "sumanBeat",
    cueIds: [12],
    mood: "dark",
    chapter: "০৩",
    chapterLabel: "প্রশ্ন",
    camera: {from: [1.09, 0, 0], to: [1.17, 0, 0]},
    data: {text: "আর সুমন?", sub: "একই বেতন। একই শহর।"},
  },
  {
    id: "P08",
    kind: "suman",
    cueIds: [13, 14],
    mood: "dark",
    chapter: "০৩",
    chapterLabel: "সুমন",
    camera: {from: [1.04, -14, -8], to: [1.11, 14, 10]},
    data: {
      name: "সুমন",
      label: "অ্যাকাউন্টে আছে মাত্র",
      amount: "৮০,০০০",
      debt: "৩,০০,০০০",
      debtLabel: "ক্রেডিট কার্ডের ঋণ",
    },
  },
  {
    id: "P09",
    kind: "question",
    cueIds: [15, 16, 17],
    mood: "dark",
    chapter: "০৪",
    chapterLabel: "প্রশ্ন",
    camera: {from: [1.02, 0, 10], to: [1.09, 0, -10]},
    data: {
      kicker: "এখন প্রশ্ন হলো",
      lines: ["আয় যদি সমান ছিল,", "খরচ যদি প্রায় একই ছিল,"],
      payoff: "তাহলে ১৩ লাখ টাকার পার্থক্যটা কোথা থেকে এলো?",
    },
  },
  {
    id: "P10",
    kind: "answers",
    cueIds: [18, 19, 20],
    mood: "green",
    chapter: "০৫",
    chapterLabel: "উত্তর",
    camera: {from: [1.04, 16, 0], to: [1.02, -20, 0]},
    data: {
      kicker: "উত্তরটা খুব সহজ",
      nos: ["কোনো বিনিয়োগ টিপস নয়", "কোনো শেয়ার বাজারের গোপন সূত্র নয়"],
      answer: "একটি মাত্র অভ্যাস",
      note: "যেটা ৯৫% মানুষ জানে, কিন্তু করে না",
    },
  },
  {
    id: "P11",
    kind: "habit",
    cueIds: [21, 22],
    mood: "green",
    chapter: "০৫",
    chapterLabel: "আজ রাতেই",
    camera: {from: [1.02, 0, 4], to: [1.10, 0, -6]},
    data: {
      kicker: "এই ভিডিও শেষ হওয়ার পর",
      minutes: "১০",
      title: "মিনিটেই শুরু করতে পারবেন",
      note: "আজ রাতেই। কাল নয়। পরের মাসে নয়।",
      outro: "পরের পর্বে — কীভাবে শুরু করবেন",
    },
  },
];

const cueStart = (id: number): number => {
  const cue = CUES[id - 1];
  if (!cue || cue.id !== id) throw new Error(`Missing cue ${id}`);
  return cue.start;
};

const built = DEFINITIONS.map((definition, index) => {
  const start =
    index === 0 ? 0 : Math.max(0, Math.round((cueStart(definition.cueIds[0]) - LEAD_SECONDS) * 1000) / 1000);
  return {...definition, start};
});

export const SAMPLE_SCENES: SampleScene[] = built.map((scene, index) => {
  const end = index + 1 < built.length ? built[index + 1].start : SAMPLE_SECONDS;
  const startFrame = Math.round(scene.start * 30);
  const nextStartFrame = index + 1 < built.length ? Math.round(built[index + 1].start * 30) : SAMPLE_FRAMES;
  return {
    ...scene,
    end,
    startFrame,
    durationInFrames: nextStartFrame - startFrame,
  };
});

/** Absolute SRT time of a cue. */
export const cueTime = (id: number): number => cueStart(id);

/** Frames from a sample scene's zero to its cue, for animation delays. */
export const cueFrame = (scene: SampleScene, id: number): number =>
  Math.max(0, Math.round((cueStart(id) - scene.start) * 30));

export const sceneById = (id: string): SampleScene => {
  const scene = SAMPLE_SCENES.find((item) => item.id === id);
  if (!scene) throw new Error(`Missing scene ${id}`);
  return scene;
};
