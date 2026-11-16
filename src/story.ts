// Story timeline generated from the supplied SRT. Times are the SRT cue times;
// the SRT is a timing reference only and is never rendered as subtitles.
import {CUES} from "./cues";

export type SceneType =
  | "opening" | "statement" | "compare" | "question" | "habit" | "engine"
  | "ledger" | "sequence" | "rule" | "tiers" | "growth" | "trap"
  | "phone" | "wait" | "cta" | "outro" | "quote";

export type StoryScene = {
  id: string;
  type: SceneType;
  start: number;
  end: number;
  startFrame: number;
  durationInFrames: number;
  accent: string;
  cueIds: number[];
  data: Record<string, unknown>;
};

export const AUDIO_SECONDS = 531.96;
export const TOTAL_FRAMES = 15959;

export const cueById = (id: number) => {
  const cue = CUES[id - 1];
  if (!cue || cue.id !== id) throw new Error(`Missing cue ${id}`);
  return cue;
};

/** Frames from a scene's local zero to an absolute SRT cue time. */
export const cueFrame = (scene: StoryScene, cueId: number): number =>
  Math.max(0, Math.round((cueById(cueId).start - scene.start) * 30));

export const SCENES: StoryScene[] = [
  {
    id: "S01", type: "opening", start: 0.0, end: 7.27,
    startFrame: 0, durationInFrames: 218,
    accent: "#398CE5", cueIds: [1, 2, 3, 4],
    data: {"year": "২০১৫", "city": "ঢাকার মিরপুর", "names": ["রাকিব", "সুমন"], "age": "২৫ বছর", "beats": {"year": 1, "city": 2, "names": 3, "age": 4}},
  },
  {
    id: "S02", type: "statement", start: 7.27, end: 12.6,
    startFrame: 218, durationInFrames: 160,
    accent: "#398CE5", cueIds: [5, 6],
    data: {"kicker": "একই অফিস", "headline": "দুজনের বেতন মাসে ৩০,০০০ টাকা।", "sub": "দুজনেই একই অফিসে চাকরি করে।", "big": "৳ ৩০,০০০", "bigLabel": "মাসিক বেতন", "character": "both", "beats": {"kicker": 5, "sub": 5, "character": 5, "headline": 6, "big": 6, "side": 6}},
  },
  {
    id: "S03", type: "statement", start: 12.6, end: 16.79,
    startFrame: 378, durationInFrames: 126,
    accent: "#FFC247", cueIds: [7, 8],
    data: {"kicker": "একই শুরু", "headline": "একই শহর, একই বেতন,", "foot": "একই জীবনযাত্রা।", "beats": {"kicker": 7, "headline": 7, "foot": 8}},
  },
  {
    id: "S04", type: "statement", start: 16.79, end: 27.11,
    startFrame: 504, durationInFrames: 309,
    accent: "#19B77A", cueIds: [9, 10, 11],
    data: {"kicker": "২০২৫ সাল", "headline": "এই দুই বন্ধুর আর্থিক অবস্থা আকাশ-পাতাল তফাত", "sub": "রাকিবের ব্যাংক অ্যাকাউন্টে আজ", "big": "৳ ১৪,০০,০০০", "bigLabel": "আজ অ্যাকাউন্টে", "character": "rakib", "beats": {"kicker": 9, "headline": 10, "sub": 11, "big": 11, "character": 11, "side": 11}},
  },
  {
    id: "S05", type: "compare", start: 27.11, end: 35.27,
    startFrame: 813, durationInFrames: 245,
    accent: "#F16B75", cueIds: [12, 13, 14],
    data: {"kicker": "প্রশ্ন", "headline": "আর সুমন?", "left": {"name": "রাকিব", "value": "৳ ১৪,০০,০০০", "note": "১০ বছরের সঞ্চয়", "color": "#19B77A", "mood": "happy"}, "right": {"name": "সুমন", "value": "৳ ৮০,০০০", "note": "অ্যাকাউন্টে আছে", "color": "#F16B75", "mood": "worried"}, "chip": "+ ৩ লাখ টাকার ঋণ", "beats": {"kicker": 12, "headline": 12, "left": 12, "right": 13, "chip": 14}},
  },
  {
    id: "S06", type: "question", start: 35.27, end: 40.78,
    startFrame: 1058, durationInFrames: 165,
    accent: "#FFC247", cueIds: [15, 16],
    data: {"kicker": "এখন প্রশ্ন", "question": "খরচ যদি প্রায় একই ছিল — তাহলে পার্থক্য কোথায়?", "note": "দুজনের আয় যদি সমান ছিল,", "beats": {"kicker": 15, "question": 15, "note": 16}},
  },
  {
    id: "S07", type: "question", start: 40.78, end: 46.79,
    startFrame: 1223, durationInFrames: 181,
    accent: "#F16B75", cueIds: [17, 18],
    data: {"kicker": "খুঁজে দেখুন", "question": "তাহলে এই ১৩ লাখ টাকার পার্থক্যটা কোথা থেকে এলো?", "answer": "উত্তরটা কোনো বিনিয়োগ টিপস নয়", "beats": {"kicker": 17, "question": 17, "answer": 18}},
  },
  {
    id: "S08", type: "question", start: 46.79, end: 52.09,
    startFrame: 1404, durationInFrames: 159,
    accent: "#19B77A", cueIds: [19, 20],
    data: {"kicker": "সত্যি কথা", "question": "কোনো শেয়ার বাজারের গোপন সূত্র না।", "answer": "উত্তরটা হলো একটি মাত্র অভ্যাস", "beats": {"kicker": 19, "question": 19, "answer": 20}},
  },
  {
    id: "S09", type: "statement", start: 52.09, end: 59.18,
    startFrame: 1563, durationInFrames: 212,
    accent: "#398CE5", cueIds: [21, 22],
    data: {"kicker": "সমাধান", "headline": "এমন একটি অভ্যাস, যেটা আপনি আজ রাতেই", "sub": "এই ভিডিও শেষ হওয়ার ১০ মিনিটের মধ্যে শুরু করতে পারবেন।", "beats": {"kicker": 21, "headline": 21, "sub": 22}},
  },
  {
    id: "S10", type: "habit", start: 59.18, end: 66.21,
    startFrame: 1775, durationInFrames: 211,
    accent: "#F16B75", cueIds: [23, 24, 25],
    data: {"kicker": "কিন্তু একটা সমস্যা", "percent": 95, "headline": "৯৫% মানুষ এই অভ্যাসটা জানে।", "sub": "হ্যাঁ, আপনিও সম্ভবত জানেন।", "cta": "জানা ≠ করা", "beats": {"kicker": 23, "percent": 24, "headline": 24, "sub": 25, "cta": 25}},
  },
  {
    id: "S11", type: "statement", start: 66.21, end: 76.62,
    startFrame: 1986, durationInFrames: 313,
    accent: "#F16B75", cueIds: [26, 27, 28, 29],
    data: {"kicker": "তবুও করেন না", "headline": "কেন করেন না, সেটা বুঝলেই", "sub": "আপনার ১০ বছরের আর্থিক জীবন বদলে যাবে।", "foot": "আর সেটাই আজকের ভিডিওর আসল রহস্য।", "tone": "dark", "beats": {"kicker": 26, "headline": 27, "sub": 28, "foot": 29}},
  },
  {
    id: "S12", type: "statement", start: 76.62, end: 86.47,
    startFrame: 2299, durationInFrames: 295,
    accent: "#F16B75", cueIds: [30, 31, 32, 33],
    data: {"kicker": "আজকের রহস্য", "headline": "নিশ্চয়ই এসআইপি (SIP), মিউচুয়াল ফান্ড বা শেয়ার বাজারের কথা বলবে।", "sub": "আজ কোনো বিনিয়োগের কথাই বলব না।", "foot": "তাই না? না।", "beats": {"kicker": 30, "headline": 31, "foot": 32, "sub": 33}},
  },
  {
    id: "S13", type: "engine", start: 86.47, end: 90.62,
    startFrame: 2594, durationInFrames: 125,
    accent: "#398CE5", cueIds: [34, 35],
    data: {"kicker": "আসল কথা", "headline": "কারণ বিনিয়োগ হলো গাড়ির ইঞ্জিন।", "sub": "ইঞ্জিন যত শক্তিশালীই হোক,", "leftTitle": "ইঞ্জিন", "leftValue": "বিনিয়োগ", "rightTitle": "তেল", "rightValue": "না থাকলে গাড়ি নড়ে না", "beats": {"kicker": 34, "headline": 34, "left": 34, "sub": 35, "right": 35}},
  },
  {
    id: "S14", type: "engine", start: 90.62, end: 95.85,
    startFrame: 2719, durationInFrames: 157,
    accent: "#FFC247", cueIds: [36, 37],
    data: {"kicker": "তুলনা", "headline": "ফেরারির ইঞ্জিন হোক আর ল্যাম্বরগিনির,", "sub": "তেল না থাকলে গাড়ি এক ইঞ্চিও নড়বে না।", "leftTitle": "ফেরারি", "leftValue": "শক্তিশালী ইঞ্জিন", "rightTitle": "ল্যাম্বরগিনি", "rightValue": "তবু তেল লাগবে", "beats": {"kicker": 36, "headline": 36, "left": 36, "sub": 37, "right": 37}},
  },
  {
    id: "S15", type: "statement", start: 95.85, end: 105.08,
    startFrame: 2876, durationInFrames: 276,
    accent: "#19B77A", cueIds: [38, 39, 40, 41],
    data: {"kicker": "আজকের অভ্যাস", "headline": "আজকের অভ্যাসটা হলো সেই তেল ভরার অভ্যাস।", "sub": "আপনি যতই ভালো শেয়ার কিনুন, যতই সোনা জমান,", "foot": "এই অভ্যাসটা না থাকলে,", "big": "তেল ছাড়া ইঞ্জিন নয়", "bigLabel": "গাড়ি চলবে না", "tone": "dark", "beats": {"kicker": 38, "headline": 38, "foot": 39, "sub": 40, "big": 41}},
  },
  {
    id: "S16", type: "statement", start: 105.08, end: 107.93,
    startFrame: 3152, durationInFrames: 86,
    accent: "#F16B75", cueIds: [42],
    data: {"kicker": "১০ বছর পর", "headline": "এই অভ্যাস ছাড়া আপনি সুমনের মতোই থাকবেন", "character": "suman", "tone": "dark", "beats": {"kicker": 42, "headline": 42, "character": 42}},
  },
  {
    id: "S17", type: "trap", start: 107.93, end: 115.04,
    startFrame: 3238, durationInFrames: 213,
    accent: "#F16B75", cueIds: [43, 44],
    data: {"kicker": "কঠিন সত্য", "headline": "৮০,০০০ টাকা আর ৩ লাখ ঋণ।", "steps": ["৮০,০০০ টাকা সঞ্চয়", "৩ লাখ টাকা ঋণ", "১০ বছর পরও একই অবস্থা"], "mode": "brain", "sub": "আর এই অভ্যাসটা শুরু করার আগে একটা কঠিন সত্যি মেনে নিতে হবে।", "beats": {"kicker": 43, "headline": 43, "step0": 43, "step1": 43, "step2": 44, "sub": 44}},
  },
  {
    id: "S18", type: "statement", start: 115.04, end: 121.81,
    startFrame: 3451, durationInFrames: 203,
    accent: "#F16B75", cueIds: [45, 46],
    data: {"kicker": "সত্যি কথা", "headline": "সত্যিটা হলো, আপনি এখন যেভাবে টাকা ম্যানেজ করছেন — সেটা ভুল।", "sub": "আমি জানি, কথাটা শুনতে খারাপ লাগছে।", "tone": "dark", "beats": {"kicker": 45, "headline": 45, "sub": 46}},
  },
  {
    id: "S19", type: "quote", start: 121.81, end: 127.69,
    startFrame: 3654, durationInFrames: 177,
    accent: "#FFC247", cueIds: [47, 48, 49],
    data: {"kicker": "আপনি হয়তো ভাবছেন", "quote": "“আমি তো ঠিকই চালাচ্ছি।", "sub": "মাস শেষে টাকাও তো থাকে।”", "beats": {"kicker": 47, "quote": 48, "sub": 49}},
  },
  {
    id: "S20", type: "statement", start: 127.69, end: 135.17,
    startFrame: 3831, durationInFrames: 224,
    accent: "#398CE5", cueIds: [50, 51, 52],
    data: {"kicker": "পরের ৬০ সেকেন্ড", "headline": "আমি আপনাকে প্রমাণ করে দেখাব", "sub": "আপনার টাকা কোথায় যাচ্ছে।", "foot": "আর আপনি নিজেই অবাক হয়ে যাবেন।", "beats": {"kicker": 50, "headline": 50, "sub": 51, "foot": 52}},
  },
  {
    id: "S21", type: "ledger", start: 135.17, end: 138.99,
    startFrame: 4055, durationInFrames: 115,
    accent: "#F16B75", cueIds: [53],
    data: {"kicker": "সুমনের মাস", "headline": "চলুন, সুমনের একটা মাসের পুরো হিসাব দেখি।", "rows": [], "remainingLabel": "হাতে থাকল", "salaryLabel": "বেতন এলো", "beats": {"kicker": 53, "headline": 53, "book": 53}},
  },
  {
    id: "S22", type: "ledger", start: 138.99, end: 147.49,
    startFrame: 4170, durationInFrames: 255,
    accent: "#19B77A", cueIds: [54, 55, 56],
    data: {"kicker": "মাসের ১ তারিখ", "headline": "বেতন এলো ৩০,০০০ টাকা।", "rows": [], "remainingLabel": "পকেতে টাকা", "salaryLabel": "বেতন এলো", "salary": "৳ ৩০,০০০", "remaining": "৳ ৩০,০০০", "beats": {"kicker": 54, "headline": 55, "salary": 55, "remainingLabel": 56, "remaining": 56}},
  },
  {
    id: "S23", type: "ledger", start: 147.49, end: 152.76,
    startFrame: 4425, durationInFrames: 158,
    accent: "#F16B75", cueIds: [57, 58, 59],
    data: {"kicker": "খরচ শুরু", "headline": "এবার কী করল সুমন?", "rows": [{"label": "ভাড়া", "value": "৮,০০০"}, {"label": "খাবার", "value": "৬,০০০"}], "remainingLabel": "এখনো হাতে", "salaryLabel": "বেতন এলো", "salary": "৳ ৩০,০০০", "remaining": "৳ ১৬,০০০", "beats": {"kicker": 57, "headline": 57, "salary": 57, "row0": 58, "row1": 59, "remaining": 59}},
  },
  {
    id: "S24", type: "ledger", start: 152.76, end: 160.89,
    startFrame: 4583, durationInFrames: 244,
    accent: "#F16B75", cueIds: [60, 61, 62],
    data: {"kicker": "খরচ চলছে", "headline": "যাতায়াত ৩,০০০।", "rows": [{"label": "মোবাইল + ইন্টারনেট", "value": "১,০০০"}, {"label": "আড্ডা + রেস্টুরেন্ট", "value": "৩,০০০"}], "remainingLabel": "বাকি আছে", "salaryLabel": "বেতন এলো", "salary": "৳ ৩০,০০০", "remaining": "৳ ৯,০০০", "beats": {"kicker": 60, "headline": 60, "salary": 60, "row0": 61, "row1": 62, "remaining": 62}},
  },
  {
    id: "S25", type: "ledger", start: 160.89, end: 169.48,
    startFrame: 4827, durationInFrames: 257,
    accent: "#F16B75", cueIds: [63, 64, 65, 66],
    data: {"kicker": "আরও খরচ", "headline": "নতুন জামাকাপড় ২,০০০।", "rows": [{"label": "অনলাইন অর্ডার", "value": "২,০০০"}], "remainingLabel": "মাসের ২৫ তারিখে", "salaryLabel": "বেতন এলো", "salary": "৳ ৩০,০০০", "remaining": "৳ ৫,০০০", "beats": {"kicker": 63, "headline": 63, "salary": 63, "row0": 64, "remainingLabel": 65, "remaining": 66}},
  },
  {
    id: "S26", type: "ledger", start: 169.48, end: 173.0,
    startFrame: 5084, durationInFrames: 106,
    accent: "#FFC247", cueIds: [67],
    data: {"kicker": "শেষ ভরসা", "headline": "সুমন ভাবল — এই ৫,০০০ টাকা জমিয়ে রাখি।", "rows": [], "remainingLabel": "হাতে আছে", "salaryLabel": "বেতন এলো", "salary": "৳ ৫,০০০", "remaining": "৳ ৫,০০০", "beats": {"kicker": 67, "headline": 67, "salary": 67, "remaining": 67, "book": 67}},
  },
  {
    id: "S27", type: "trap", start: 173.0, end: 179.14,
    startFrame: 5190, durationInFrames: 184,
    accent: "#F16B75", cueIds: [68, 69],
    data: {"kicker": "কিন্তু...", "headline": "মাসের ২৭ তারিখে হঠাৎ ফোনটা হাত থেকে পড়ে স্ক্রিন ভেঙে গেল।", "steps": ["ফোন পড়ে গেল", "স্ক্রিন ভেঙে গেল", "পরিকল্পনা ছিল না"], "mode": "brain", "beats": {"kicker": 68, "headline": 69, "step0": 69, "step1": 69, "step2": 69}},
  },
  {
    id: "S28", type: "ledger", start: 179.14, end: 185.14,
    startFrame: 5374, durationInFrames: 180,
    accent: "#F16B75", cueIds: [70, 71],
    data: {"kicker": "শেষ ফল", "headline": "রিপেয়ারে গেল ৩,০০০ টাকা।", "rows": [{"label": "জন্মদিনের পার্টি", "value": "২,০০০"}], "remainingLabel": "মাস শেষে", "salaryLabel": "বেতন এলো", "salary": "৳ ৩০,০০০", "remaining": "৳ ০", "beats": {"kicker": 70, "headline": 70, "salary": 70, "row0": 71, "remaining": 71}},
  },
  {
    id: "S29", type: "statement", start: 185.14, end: 193.69,
    startFrame: 5554, durationInFrames: 257,
    accent: "#F16B75", cueIds: [72, 73, 74, 75],
    data: {"kicker": "শূন্য", "headline": "প্রতি মাসে শূন্য।", "sub": "১০ বছরে শূন্য।", "foot": "১২ মাসে শূন্য।", "sideNote": "১০ বছরে শূন্য", "tone": "dark", "beats": {"kicker": 72, "headline": 73, "foot": 74, "sub": 75, "side": 75}},
  },
  {
    id: "S30", type: "compare", start: 193.69, end: 199.35,
    startFrame: 5811, durationInFrames: 169,
    accent: "#19B77A", cueIds: [76, 77],
    data: {"kicker": "১০ বছর পর", "headline": "এখন রাকিবের দিকে তাকান।", "left": {"name": "রাকিব", "value": "৳ ১৪,০০,০০০", "note": "আয় ৳ ৩০,০০০, খরচ প্রায় একই", "color": "#19B77A", "mood": "happy"}, "right": {"name": "সুমন", "value": "৳ ০", "note": "১০ বছরে সঞ্চয়", "color": "#F16B75", "mood": "worried"}, "chip": "পার্থক্য কোথায়?", "beats": {"kicker": 76, "headline": 76, "left": 76, "right": 77, "chip": 77}},
  },
  {
    id: "S31", type: "statement", start: 199.35, end: 204.94,
    startFrame: 5980, durationInFrames: 168,
    accent: "#19B77A", cueIds: [78, 79],
    data: {"kicker": "রাকিবের নিয়ম", "headline": "মাসের ১ তারিখে বেতন আসার", "sub": "মাত্র ১০ মিনিটের মধ্যে একটা কাজ করে।", "character": "rakib", "beats": {"kicker": 78, "headline": 78, "sub": 79, "character": 79}},
  },
  {
    id: "S32", type: "growth", start: 204.94, end: 212.36,
    startFrame: 6148, durationInFrames: 223,
    accent: "#19B77A", cueIds: [80, 81],
    data: {"kicker": "১০ মিনিটের কাজ", "headline": "আর এই ১০ মিনিটের কাজটাই ১০ বছরে তাকে ১৪ লাখ টাকা এনে দিয়েছে।", "total": "১৪,০০,০০০", "extra": "কিন্তু কী সেই ১০ মিনিটের কাজ?", "beats": {"kicker": 80, "headline": 80, "total": 80, "extra": 81}},
  },
  {
    id: "S33", type: "question", start: 212.36, end: 220.22,
    startFrame: 6371, durationInFrames: 236,
    accent: "#F16B75", cueIds: [82, 83, 84],
    data: {"kicker": "আগে বুঝুন", "question": "কেন সুমনের মতো মানুষ প্রতি মাসে শূন্য হয়ে যায়,", "answer": "অথচ তার আয় তো কম না?", "beats": {"kicker": 82, "question": 83, "answer": 84}},
  },
  {
    id: "S34", type: "question", start: 220.22, end: 226.72,
    startFrame: 6607, durationInFrames: 195,
    accent: "#FFC247", cueIds: [85, 86, 87],
    data: {"kicker": "সমস্যা কোথায়?", "question": "সমস্যাটা সুমনের আয়ে না।", "answer": "সমস্যাটা সুমনের বেতনেও না।", "beats": {"kicker": 85, "question": 86, "answer": 87}},
  },
  {
    id: "S35", type: "sequence", start: 226.72, end: 232.23,
    startFrame: 6802, durationInFrames: 165,
    accent: "#FFC247", cueIds: [88, 89],
    data: {"kicker": "সিকোয়েন্স", "headline": "সমস্যাটা হলো সুমনের সিকোয়েন্সে।", "steps": [], "outcome": "মানে টাকা খরচের ক্রমে।", "character": "suman", "beats": {"kicker": 88, "headline": 88, "outcome": 89}},
  },
  {
    id: "S36", type: "sequence", start: 232.23, end: 239.69,
    startFrame: 6967, durationInFrames: 224,
    accent: "#F16B75", cueIds: [90, 91, 92],
    data: {"kicker": "সুমন কী করে?", "headline": "সুমন প্রথমে আয় করে, তারপর খরচ করে,", "steps": ["আয়", "খরচ", "যা থাকে জমা"], "character": "suman", "beats": {"kicker": 90, "headline": 91, "step0": 91, "step1": 91, "step2": 92}},
  },
  {
    id: "S37", type: "sequence", start: 239.69, end: 248.06,
    startFrame: 7191, durationInFrames: 251,
    accent: "#19B77A", cueIds: [93, 94, 95, 96],
    data: {"kicker": "রাকিব কী করে?", "headline": "রাকিব প্রথমে আয় করে,", "steps": ["আয়", "নিজেকে আগে", "বাকি দিয়ে খরচ"], "character": "rakib", "beats": {"kicker": 93, "headline": 94, "step0": 94, "step1": 95, "step2": 96}},
  },
  {
    id: "S38", type: "statement", start: 248.06, end: 255.87,
    startFrame: 7442, durationInFrames: 234,
    accent: "#FFC247", cueIds: [97, 98, 99],
    data: {"kicker": "এটাই অভ্যাস", "headline": "ইংরেজিতে বলে ‘Pay Yourself First’।", "sub": "বাংলায় বলি — নিজেকে আগে টাকা দিন।", "big": "PYF", "bigLabel": "একটি লাইন, ১০ বছরের ফল", "tone": "dark", "beats": {"kicker": 97, "headline": 98, "big": 98, "side": 98, "sub": 99}},
  },
  {
    id: "S39", type: "statement", start: 255.87, end: 259.6,
    startFrame: 7676, durationInFrames: 112,
    accent: "#19B77A", cueIds: [100, 101],
    data: {"kicker": "মানে কী?", "headline": "মানে হলো, বেতন আসার সাথে সাথে", "beats": {"kicker": 100, "headline": 101}},
  },
  {
    id: "S40", type: "rule", start: 259.6, end: 269.26,
    startFrame: 7788, durationInFrames: 290,
    accent: "#19B77A", cueIds: [102, 103, 104],
    data: {"kicker": "২০/৮০ নিয়ম", "headline": "আপনার আয়ের অন্তত ২০ শতাংশ আলাদা করে বিনিয়োগ অ্যাকাউন্টে পাঠিয়ে দিন।", "percent": 20, "leftLabel": "বিনিয়োগ", "rightLabel": "মাসের খরচ", "sub": "তারপর বাকি ৮০ শতাংশ দিয়ে মাস চালান।", "beats": {"kicker": 102, "headline": 103, "bar": 103, "sub": 104}},
  },
  {
    id: "S41", type: "compare", start: 269.26, end: 277.97,
    startFrame: 8078, durationInFrames: 261,
    accent: "#FFC247", cueIds: [105, 106, 107],
    data: {"kicker": "পার্থক্যটা বুঝছেন?", "headline": "সুমন ভাবে — খরচের পর যা থাকবে, জমাব।", "left": {"name": "সুমন", "value": "খরচ → জমানো", "note": "খরচের পরে যা থাকে", "color": "#19B77A", "mood": "happy"}, "right": {"name": "রাকিব", "value": "জমানো → খরচ", "note": "জমানোর পরে যা থাকে", "color": "#F16B75", "mood": "worried"}, "beats": {"kicker": 105, "headline": 106, "left": 106, "right": 107}},
  },
  {
    id: "S42", type: "statement", start: 277.97, end: 284.67,
    startFrame: 8339, durationInFrames: 201,
    accent: "#19B77A", cueIds: [108, 109],
    data: {"kicker": "এক লাইন", "headline": "এই এক লাইনের পার্থক্য।", "sub": "এই এক লাইন ১০ বছরে ১৩ লাখ টাকার পার্থক্য তৈরি করে।", "big": "১৩ লাখ", "bigLabel": "পার্থক্য", "beats": {"kicker": 108, "headline": 108, "sub": 109, "big": 109, "side": 109}},
  },
  {
    id: "S43", type: "question", start: 284.67, end: 296.03,
    startFrame: 8540, durationInFrames: 341,
    accent: "#F16B75", cueIds: [110, 111, 112, 113],
    data: {"kicker": "বড় প্রশ্ন", "question": "“ভাই, আমার তো ৩০,০০০-এর মধ্যে ২৫,০০০ খরচ হয়েই যায়।", "answer": "২০ শতাংশ আলাদা করলে তো মাস চালাতে পারব না।”", "note": "আপনি হয়তো এখন ভাবছেন,", "beats": {"kicker": 110, "note": 111, "question": 112, "answer": 113}},
  },
  {
    id: "S44", type: "question", start: 296.03, end: 301.53,
    startFrame: 8881, durationInFrames: 165,
    accent: "#FFC247", cueIds: [114, 115],
    data: {"kicker": "স্বীকার করুন", "question": "এই প্রশ্নটা একদম সঠিক।", "answer": "আর এই প্রশ্নের উত্তরেই লুকিয়ে আছে আসল ট্রিকটা।", "beats": {"kicker": 114, "question": 114, "answer": 115}},
  },
  {
    id: "S45", type: "statement", start: 301.53, end: 308.11,
    startFrame: 9046, durationInFrames: 197,
    accent: "#F16B75", cueIds: [116, 117, 118],
    data: {"kicker": "মিথ্যা বলব না", "headline": "২০ শতাংশ দিয়ে শুরু করা কঠিন।", "sub": "বিশেষ করে যদি আপনার আয় কম হয়।", "big": "২০%", "bigLabel": "দিয়ে শুরু করা কঠিন", "tone": "dark", "beats": {"kicker": 116, "headline": 117, "sub": 118, "big": 118}},
  },
  {
    id: "S46", type: "tiers", start: 308.11, end: 313.73,
    startFrame: 9243, durationInFrames: 169,
    accent: "#FFC247", cueIds: [119, 120],
    data: {"kicker": "তিন স্তরের ফর্মুলা", "headline": "তাই আমি আপনাকে একটা তিন স্তরের ফর্মুলা দিচ্ছি,", "tiers": [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], "active": -1, "sub": "যেকোনো আয়ের মানুষ ব্যবহার করতে পারবে।", "beats": {"kicker": 119, "headline": 119, "tier0": 119, "tier1": 120, "tier2": 120, "sub": 120}},
  },
  {
    id: "S47", type: "tiers", start: 313.73, end: 320.82,
    startFrame: 9412, durationInFrames: 213,
    accent: "#19B77A", cueIds: [121, 122, 123],
    data: {"kicker": "স্তর ১", "headline": "স্তর ১: প্রথম তিন মাস।", "tiers": [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], "active": 0, "sub": "মাত্র ১০ শতাংশ দিয়ে শুরু করুন।", "note": "হ্যাঁ, মাত্র ৩,০০০ টাকা।", "beats": {"kicker": 121, "headline": 121, "tier0": 121, "tier1": 121, "tier2": 121, "sub": 122, "note": 123}},
  },
  {
    id: "S48", type: "statement", start: 320.82, end: 327.18,
    startFrame: 9625, durationInFrames: 190,
    accent: "#FFC247", cueIds: [124, 125],
    data: {"kicker": "স্তর ১ থেকে", "headline": "দিনে ১০০ টাকা।", "sub": "এক কাপ চা আর একটা সিগারেট কম খেলেই এই টাকা বেরিয়ে আসবে।", "big": "১০০", "bigLabel": "টাকা / দিন", "beats": {"kicker": 124, "headline": 124, "big": 124, "sub": 125}},
  },
  {
    id: "S49", type: "phone", start: 327.18, end: 332.36,
    startFrame: 9815, durationInFrames: 156,
    accent: "#19B77A", cueIds: [126],
    data: {"kicker": "স্তর ১ → ২", "headline": "এই ৩,০০০ টাকা বেতন আসার দিনই একটা আলাদা অ্যাকাউন্টে পাঠিয়ে দিন।", "amount": "৩,০০০", "income": "২৭,০০০", "steps": ["বেতন আসার দিনই", "৩,০০০ আলাদা অ্যাকাউন্টে", "বাকি ২৭,০০০ দিয়ে খরচ"], "beats": {"kicker": 126, "headline": 126, "step0": 126, "step1": 126, "step2": 126, "phone": 126}},
  },
  {
    id: "S50", type: "tiers", start: 332.36, end: 342.17,
    startFrame: 9971, durationInFrames: 294,
    accent: "#FFC247", cueIds: [127, 128, 129],
    data: {"kicker": "স্তর ২", "headline": "স্তর ২: ৪ থেকে ৬ মাস।", "tiers": [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], "active": 1, "sub": "১৫ শতাংশে উঠুন।", "note": "১০% অভ্যাস হয়ে গেলে আরও ৫ শতাংশ বাড়ান।", "beats": {"kicker": 127, "headline": 127, "tier1": 127, "sub": 128, "note": 129}},
  },
  {
    id: "S51", type: "tiers", start: 342.17, end: 350.04,
    startFrame: 10265, durationInFrames: 236,
    accent: "#19B77A", cueIds: [130, 131, 132],
    data: {"kicker": "লাভ কী?", "headline": "দেখবেন আপনার জীবনযাত্রায় কোনো পরিবর্তন আসেনি,", "tiers": [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], "active": 2, "sub": "কিন্তু ব্যাংকে টাকা জমছে।", "note": "স্তর ৩: ৭ মাস থেকে—", "beats": {"kicker": 130, "headline": 130, "sub": 131, "tier2": 132, "note": 132}},
  },
  {
    id: "S52", type: "statement", start: 350.04, end: 357.27,
    startFrame: 10501, durationInFrames: 217,
    accent: "#19B77A", cueIds: [133, 134],
    data: {"kicker": "স্তর ৩", "headline": "২০ শতাংশ বা তার বেশি।", "sub": "৬,০০০ টাকা প্রতি মাসে ১২% রিটার্নে", "big": "২০%", "bigLabel": "মাসিক বিনিয়োগ", "beats": {"kicker": 133, "headline": 133, "big": 133, "sub": 134}},
  },
  {
    id: "S53", type: "growth", start: 357.27, end: 364.54,
    startFrame: 10718, durationInFrames: 218,
    accent: "#19B77A", cueIds: [135, 136],
    data: {"kicker": "১০ বছরের হিসাব", "headline": "তাহলে ১০ বছর পর আপনার অ্যাকাউন্টে থাকবে প্রায় ১৪ লাখ টাকা।", "monthly": "৬,০০০", "rate": "১২%", "total": "১৪,০০,০০০", "own": "৭,২০,০০০", "beats": {"kicker": 135, "headline": 135, "total": 135, "chips": 135, "own": 136}},
  },
  {
    id: "S54", type: "growth", start: 364.54, end: 368.74,
    startFrame: 10936, durationInFrames: 126,
    accent: "#FFC247", cueIds: [137, 138],
    data: {"kicker": "কম্পাউন্ডিং", "headline": "বাকি ৬ লাখ ৮০ হাজার টাকা হলো শুধু লাভ—", "profit": "৬,৮০,০০০", "extra": "কম্পাউন্ডিংয়ের জাদু।", "beats": {"kicker": 137, "headline": 137, "profit": 137, "extra": 138}},
  },
  {
    id: "S55", type: "growth", start: 368.74, end: 379.62,
    startFrame: 11062, durationInFrames: 327,
    accent: "#398CE5", cueIds: [139, 140, 141, 142],
    data: {"kicker": "আরও ভালো", "headline": "আর যদি আয় বাড়ার সাথে সাথে বিনিয়োগও বাড়ান—", "rate": "১২%", "total": "২০ লাখ", "extra": "১০ বছরে ২০ লাখ ছাড়িয়ে যাওয়া একদম সম্ভব।", "chips": ["তিন বছর পর ৮,০০০,", "পাঁচ বছর পর ১০,০০০—"], "beats": {"kicker": 139, "headline": 139, "chip0": 140, "chip1": 141, "total": 142, "extra": 142}},
  },
  {
    id: "S56", type: "trap", start: 379.62, end: 390.05,
    startFrame: 11389, durationInFrames: 313,
    accent: "#F16B75", cueIds: [143, 144, 145],
    data: {"kicker": "ফাঁদ", "headline": "রাকিব ঠিক এটাই করেছে।", "steps": ["১০ মিনিটের কাজ", "কিন্তু একটা ফাঁদ আছে", "৯০% মানুষ তিন মাসেই ছেড়ে দেয়"], "mode": "brain", "beats": {"kicker": 143, "headline": 143, "step0": 143, "step1": 144, "step2": 145}},
  },
  {
    id: "S57", type: "trap", start: 390.05, end: 397.64,
    startFrame: 11702, durationInFrames: 227,
    accent: "#F16B75", cueIds: [146, 147, 148],
    data: {"kicker": "কেন ছেড়ে দেয়?", "headline": "আপনিও হয়তো ছেড়ে দেবেন,", "steps": ["আপনিও হয়তো ছেড়ে দেবেন", "যদি এই ফাঁদটা না জানেন"], "mode": "brain", "sub": "ফাঁদটা হলো— মানুষ হাতে টাকা দেখলে খরচ করে ফেলে।", "beats": {"kicker": 146, "headline": 146, "step0": 146, "step1": 147, "sub": 148}},
  },
  {
    id: "S58", type: "trap", start: 397.64, end: 407.23,
    startFrame: 11929, durationInFrames: 288,
    accent: "#F16B75", cueIds: [149, 150, 151, 152],
    data: {"kicker": "মস্তিষ্কের ফাঁদ", "headline": "এটা আপনার দোষ না,", "steps": ["আপনি ৬,০০০ টাকা আলাদা করলেন,", "কিন্তু সেটা মূল ব্যাংক অ্যাকাউন্টেই পড়ে থাকে,"], "mode": "brain", "sub": "এটা মানুষের মস্তিষ্কের ডিজাইন।", "beats": {"kicker": 149, "headline": 149, "sub": 150, "step0": 151, "step1": 152}},
  },
  {
    id: "S59", type: "trap", start: 407.23, end: 417.0,
    startFrame: 12217, durationInFrames: 293,
    accent: "#F16B75", cueIds: [153, 154, 155, 156],
    data: {"kicker": "২০ তারিখে", "headline": "তাহলে মাসের ২০ তারিখে যখন অ্যাপ খুলে দেখবেন", "steps": ["অ্যাকাউন্টে টাকা আছে,", "তখন মস্তিষ্ক বলবে — “আরে টাকা তো আছেই,", "একটা নতুন জুতা কিনে ফেলি।”"], "mode": "brain", "beats": {"kicker": 153, "headline": 153, "step0": 154, "step1": 155, "step2": 156}},
  },
  {
    id: "S60", type: "statement", start: 417.0, end: 420.76,
    startFrame: 12510, durationInFrames: 113,
    accent: "#19B77A", cueIds: [157],
    data: {"kicker": "সমাধান", "headline": "এই ফাঁদ থেকে বাঁচার একটাই উপায়— অটোমেশন।", "tone": "dark", "beats": {"kicker": 157, "headline": 157, "side": 157}},
  },
  {
    id: "S61", type: "phone", start: 420.76, end: 427.52,
    startFrame: 12623, durationInFrames: 203,
    accent: "#398CE5", cueIds: [158, 159],
    data: {"kicker": "স্ট্যান্ডিং ইনস্ট্রাকশন", "headline": "বেতন আসার দিনই অটোমেটিক ট্রান্সফার সেট করুন।", "amount": "৬,০০০", "income": "২৪,০০০", "steps": ["বেতন আসার দিনই", "অটো ট্রান্সফার সেট করুন", "স্ট্যান্ডিং ইনস্ট্রাকশন দিন"], "beats": {"kicker": 158, "headline": 158, "step0": 158, "step1": 158, "step2": 159, "phone": 158}},
  },
  {
    id: "S62", type: "phone", start: 427.52, end: 433.4,
    startFrame: 12826, durationInFrames: 176,
    accent: "#19B77A", cueIds: [160, 161],
    data: {"kicker": "টাকা দেখবেনই না", "headline": "প্রতি মাসের ১ তারিখে ৬,০০০ টাকা", "amount": "৬,০০০", "income": "২৪,০০০", "steps": ["১ তারিখে", "৬,০০০ অটো ট্রান্সফার", "বিনিয়োগ অ্যাকাউন্টে চলে যাবে"], "beats": {"kicker": 160, "headline": 160, "step0": 160, "step1": 160, "step2": 161, "phone": 161}},
  },
  {
    id: "S63", type: "phone", start: 433.4, end: 441.41,
    startFrame: 13002, durationInFrames: 240,
    accent: "#FFC247", cueIds: [162, 163, 164],
    data: {"kicker": "মস্তিষ্কের হিসাব", "headline": "আপনি টাকাটা দেখবেনই না।", "amount": "৬,০০০", "income": "২৪,০০০", "steps": ["টাকা দেখবেন না", "খরচের প্রশ্নই আসে না", "আয় ২৪,০০০"], "beats": {"kicker": 162, "headline": 162, "step0": 162, "step1": 163, "step2": 164, "phone": 164}},
  },
  {
    id: "S64", type: "statement", start: 441.41, end: 448.95,
    startFrame: 13242, durationInFrames: 226,
    accent: "#19B77A", cueIds: [165, 166],
    data: {"kicker": "সিস্টেম vs ইচ্ছাশক্তি", "headline": "এটা কোনো ইচ্ছাশক্তির খেলা না, এটা সিস্টেমের খেলা।", "sub": "আর সেই ২৪,০০০ দিয়েই আপনি দিব্যি মাস চালাবেন।", "big": "সিস্টেম", "bigLabel": "সবচেয়ে শক্তিশালী অভ্যাস", "tone": "dark", "beats": {"kicker": 165, "sub": 165, "headline": 166, "big": 166, "side": 166}},
  },
  {
    id: "S65", type: "habit", start: 448.95, end: 458.63,
    startFrame: 13468, durationInFrames: 291,
    accent: "#F16B75", cueIds: [167, 168, 169],
    data: {"kicker": "শুরুতে বলেছিলাম", "percent": 95, "headline": "৯৫ শতাংশ মানুষ এই অভ্যাসটা জানে, তবুও করে না।", "sub": "ইচ্ছাশক্তি একদিন শেষ হয়, সিস্টেম কখনো শেষ হয় না।", "cta": "ভিডিওর শুরুতে বলেছিলাম—", "beats": {"kicker": 167, "sub": 167, "cta": 168, "percent": 169, "headline": 169}},
  },
  {
    id: "S66", type: "wait", start: 458.63, end: 465.6,
    startFrame: 13759, durationInFrames: 209,
    accent: "#F16B75", cueIds: [170, 171, 172],
    data: {"kicker": "কেন করে না?", "headline": "কারণ তারা অপেক্ষা করে।", "excuses": ["“পরের মাস থেকে শুরু করব”", "“বেতন বাড়লে করব”", "“বছরের শুরু থেকে করব”"], "sub": "এই অপেক্ষাই সবচেয়ে বড় ক্ষতি", "beats": {"kicker": 170, "headline": 170, "excuse0": 171, "excuse1": 171, "excuse2": 172, "sub": 172}},
  },
  {
    id: "S67", type: "statement", start: 465.6, end: 472.79,
    startFrame: 13968, durationInFrames: 216,
    accent: "#F16B75", cueIds: [173, 174],
    data: {"kicker": "সেই পরের মাস", "headline": "আর সেই পরের মাস কখনো আসে না।", "sub": "তাই আজকের ভিডিওর সবচেয়ে গুরুত্বপূর্ণ কথা শুনুন।", "beats": {"kicker": 173, "headline": 173, "side": 173, "sub": 174}},
  },
  {
    id: "S68", type: "phone", start: 472.79, end: 480.7,
    startFrame: 14184, durationInFrames: 237,
    accent: "#19B77A", cueIds: [175, 176, 177],
    data: {"kicker": "এই ভিডিও শেষ হওয়ার পর", "headline": "ফোনটা হাতে নিন, ব্যাংক অ্যাপ খুলুন,", "amount": "৩,০০০", "income": "২৭,০০০", "steps": ["ফোনটা হাতে নিন", "ব্যাংক অ্যাপ খুলুন", "১০% অটো-ট্রান্সফার সেট করুন"], "beats": {"kicker": 175, "headline": 176, "step0": 176, "step1": 176, "step2": 177, "phone": 177}},
  },
  {
    id: "S69", type: "statement", start: 480.7, end: 488.36,
    startFrame: 14421, durationInFrames: 230,
    accent: "#19B77A", cueIds: [178, 179, 180],
    data: {"kicker": "১০ মিনিট", "headline": "১০ মিনিট লাগবে।", "sub": "এই ভিডিওটা যদি আপনার চোখ খুলে দিয়ে থাকে,", "foot": "এই ১০ মিনিট আপনার ১০ বছর বদলে দেবে।", "sideNote": "এই ১০ মিনিট আপনার ১০ বছর বদলে দেবে।", "beats": {"kicker": 178, "headline": 178, "side": 178, "foot": 179, "sub": 180}},
  },
  {
    id: "S70", type: "cta", start: 488.36, end: 496.94,
    startFrame: 14651, durationInFrames: 257,
    accent: "#F16B75", cueIds: [181, 182, 183],
    data: {"kicker": "আপনার পালা", "headline": "তাহলে লাইক দিন— এটা আমাকে অনেক সাহায্য করে।", "options": ["১০%", "১৫%", "২০%"], "next": "আর কমেন্টে লিখুন আপনি কত শতাংশ দিয়ে শুরু করবেন—", "beats": {"kicker": 181, "headline": 181, "next": 182, "options": 183}},
  },
  {
    id: "S71", type: "cta", start: 496.94, end: 503.21,
    startFrame: 14908, durationInFrames: 188,
    accent: "#FFC247", cueIds: [184, 185],
    data: {"kicker": "ধন্যবাদ", "headline": "আমি প্রত্যেকের কমেন্ট পড়ব।", "options": ["১০%", "১৫%", "২০%"], "next": "আর সবশেষে, এই ভিডিওতে শিখলেন টাকা কীভাবে জমাবেন।", "beats": {"kicker": 184, "headline": 184, "options": 184, "next": 185}},
  },
  {
    id: "S72", type: "question", start: 503.21, end: 510.84,
    startFrame: 15096, durationInFrames: 229,
    accent: "#398CE5", cueIds: [186, 187],
    data: {"kicker": "পরের প্রশ্ন", "question": "জমানো টাকাটা কোথায় বিনিয়োগ করলে সবচেয়ে বেশি লাভ হবে?", "answer": "ব্যাংকে রাখলে, শেয়ার বাজারে, নাকি সোনায়?", "beats": {"kicker": 186, "question": 186, "answer": 187}},
  },
  {
    id: "S73", type: "statement", start: 510.84, end: 522.87,
    startFrame: 15325, durationInFrames: 361,
    accent: "#398CE5", cueIds: [188, 189, 190, 191],
    data: {"kicker": "পরের ভিডিও", "headline": "পরের ভিডিওতে আমি একটা ক্যালকুলেশন দেখাব,", "sub": "কারণ ব্যাংকে টাকা রাখলে আপনি প্রতি বছর কত টাকা হারাচ্ছেন,", "foot": "যেটা দেখলে আপনার মাথা ঘুরে যাবে।", "note": "সেটা জানলে আপনি আর একদিনও টাকা ব্যাংকে রাখবেন না।", "beats": {"kicker": 188, "headline": 188, "foot": 189, "sub": 190, "note": 191}},
  },
  {
    id: "S74", type: "cta", start: 522.87, end: 527.9,
    startFrame: 15686, durationInFrames: 151,
    accent: "#F16B75", cueIds: [192, 193],
    data: {"kicker": "মিস করবেন না", "headline": "তাই সাবস্ক্রাইব করে বেল আইকনটা অন করে রাখুন,", "options": ["সাবস্ক্রাইব", "বেল আইকন", "পরের ভিডিও"], "next": "যাতে পরের ভিডিওটা মিস না হয়।", "beats": {"kicker": 192, "headline": 192, "options": 192, "next": 193}},
  },
  {
    id: "S75", type: "outro", start: 527.9, end: 531.96,
    startFrame: 15837, durationInFrames: 122,
    accent: "#19B77A", cueIds: [194, 195],
    data: {"headline": "দেখা হচ্ছে পরের ভিডিওতে।", "sub": "ততক্ষণ— নিজেকে আগে টাকা দিন।", "signature": "Pay Yourself First", "beats": {"kicker": 194, "headline": 194, "sub": 195, "signature": 195}},
  },
];
