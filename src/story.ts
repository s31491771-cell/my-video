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
    data: {"year": "২০১৫", "city": "ঢাকার মিরপুর", "names": ["রাকিব", "সুমন"], "age": "২৫ বছর"},
  },
  {
    id: "S02", type: "statement", start: 7.27, end: 12.6,
    startFrame: 218, durationInFrames: 160,
    accent: "#398CE5", cueIds: [5, 6],
    data: {"kicker": "একই অফিস", "headline": "দুজনের বেতনই মাসে ৩০,০০০ টাকা", "sub": "একই বয়স, একই চাকরি", "big": "৳ ৩০,০০০", "bigLabel": "মাসিক বেতন", "character": "both"},
  },
  {
    id: "S03", type: "statement", start: 12.6, end: 19.51,
    startFrame: 378, durationInFrames: 207,
    accent: "#FFC247", cueIds: [7, 8, 9],
    data: {"kicker": "একই শুরু", "headline": "একই শহর, একই বেতন, একই জীবনযাত্রা", "sub": "কিন্তু ২০১৫ থেকে ২০২৫ — ফল এক নয়"},
  },
  {
    id: "S04", type: "statement", start: 19.51, end: 27.11,
    startFrame: 585, durationInFrames: 228,
    accent: "#19B77A", cueIds: [10, 11],
    data: {"kicker": "২০২৫", "headline": "এই দুই বন্ধুর আর্থিক অবস্থা আকাশ-পাতাল তফাত", "sub": "রাকিবের অ্যাকাউন্টে আজ", "big": "৳ ১৪,০০,০০০", "character": "rakib"},
  },
  {
    id: "S05", type: "compare", start: 27.11, end: 35.27,
    startFrame: 813, durationInFrames: 245,
    accent: "#F16B75", cueIds: [12, 13, 14],
    data: {"kicker": "প্রশ্ন", "headline": "আর সুমন?", "left": {"name": "রাকিব", "value": "৳ ১৪,০০,০০০", "note": "১০ বছরের সঞ্চয়", "color": "#19B77A", "mood": "happy"}, "right": {"name": "সুমন", "value": "৳ ৮০,০০০", "note": "+ ৩ লাখ টাকা ঋণ", "color": "#F16B75", "mood": "worried"}, "chip": "পার্থক্য ১৩ লাখ ২০ হাজার"},
  },
  {
    id: "S06", type: "question", start: 35.27, end: 40.78,
    startFrame: 1058, durationInFrames: 165,
    accent: "#FFC247", cueIds: [15, 16],
    data: {"kicker": "এখন প্রশ্ন", "question": "আয় সমান, খরচও প্রায় সমান — তাহলে পার্থক্য কোথায়?", "answer": "১৩ লাখ টাকা", "sub": "উত্তরটা অভ্যাসে, আয়ে নয়"},
  },
  {
    id: "S07", type: "question", start: 40.78, end: 46.79,
    startFrame: 1223, durationInFrames: 181,
    accent: "#F16B75", cueIds: [17, 18],
    data: {"kicker": "খুঁজে দেখুন", "question": "এই ১৩ লাখ টাকার পার্থক্য কোথা থেকে এলো?", "answer": "কোনো বিনিয়োগ টিপস নয়"},
  },
  {
    id: "S08", type: "question", start: 46.79, end: 52.09,
    startFrame: 1404, durationInFrames: 159,
    accent: "#19B77A", cueIds: [19, 20],
    data: {"kicker": "সত্যি কথা", "question": "কোনো শেয়ার বাজারের গোপন সূত্র?", "answer": "একটি মাত্র অভ্যাস"},
  },
  {
    id: "S09", type: "statement", start: 52.09, end: 59.18,
    startFrame: 1563, durationInFrames: 212,
    accent: "#398CE5", cueIds: [21, 22],
    data: {"kicker": "সমাধান", "headline": "এমন অভ্যাস, যা আজ রাতেই শুরু করা যায়", "sub": "এই ভিডিও শেষ হওয়ার ১০ মিনিটের মধ্যে"},
  },
  {
    id: "S10", type: "habit", start: 59.18, end: 66.21,
    startFrame: 1775, durationInFrames: 211,
    accent: "#F16B75", cueIds: [23, 24, 25],
    data: {"kicker": "কিন্তু একটা সমস্যা", "percent": 95, "headline": "৯৫% মানুষ এই অভ্যাসটা জানে", "sub": "আপনিও সম্ভবত জানেন", "cta": "জানা ≠ করা"},
  },
  {
    id: "S11", type: "habit", start: 66.21, end: 73.69,
    startFrame: 1986, durationInFrames: 225,
    accent: "#F16B75", cueIds: [26, 27, 28],
    data: {"kicker": "তবুও করেন না", "percent": 95, "headline": "কেন করেন না, সেটা বুঝলেই", "sub": "আপনার ১০ বছরের আর্থিক জীবন বদলে যাবে", "cta": "কারণটাই আসল"},
  },
  {
    id: "S12", type: "statement", start: 73.69, end: 82.86,
    startFrame: 2211, durationInFrames: 275,
    accent: "#F16B75", cueIds: [29, 30, 31],
    data: {"kicker": "আজকের রহস্য", "headline": "আপনি নিশ্চয়ই ভাবছেন — SIP, মিউচুয়াল ফান্ড বা শেয়ার বাজার", "sub": "না। আজ কোনো বিনিয়োগের কথাই বলব না।"},
  },
  {
    id: "S13", type: "engine", start: 82.86, end: 90.62,
    startFrame: 2486, durationInFrames: 233,
    accent: "#398CE5", cueIds: [32, 33, 34, 35],
    data: {"kicker": "আসল কথা", "headline": "বিনিয়োগ হলো গাড়ির ইঞ্জিন", "sub": "ইঞ্জিন যত শক্তিশালীই হোক...", "leftTitle": "ইঞ্জিন", "leftValue": "যত শক্তিশালীই হোক", "rightTitle": "তেল", "rightValue": "না থাকলে গাড়ি নড়ে না"},
  },
  {
    id: "S14", type: "engine", start: 90.62, end: 95.85,
    startFrame: 2719, durationInFrames: 157,
    accent: "#FFC247", cueIds: [36, 37],
    data: {"kicker": "তুলনা", "headline": "ফেরারি হোক আর ল্যাম্বরগিনি", "sub": "তেল না থাকলে...", "leftTitle": "ফেরারি", "leftValue": "শক্তিশালী ইঞ্জিন", "rightTitle": "ল্যাম্বরগিনি", "rightValue": "তবু তেল লাগবে"},
  },
  {
    id: "S15", type: "statement", start: 95.85, end: 103.03,
    startFrame: 2876, durationInFrames: 215,
    accent: "#19B77A", cueIds: [38, 39, 40],
    data: {"kicker": "আজকের অভ্যাস", "headline": "এই অভ্যাসটাই সেই তেল ভরার অভ্যাস", "sub": "শেয়ার, সোনা, রিয়েল এস্টেট — যতই ভালো হোক", "big": "তেল ছাড়া ইঞ্জিন নয়", "tone": "dark"},
  },
  {
    id: "S16", type: "statement", start: 103.03, end: 107.93,
    startFrame: 3091, durationInFrames: 147,
    accent: "#F16B75", cueIds: [41, 42],
    data: {"kicker": "১০ বছর পর", "headline": "এই অভ্যাস ছাড়া আপনি সুমনের মতোই থাকবেন", "sub": "৮০,০০০ টাকা আর ৩ লাখ টাকা ঋণ", "character": "suman", "tone": "dark"},
  },
  {
    id: "S17", type: "trap", start: 107.93, end: 115.04,
    startFrame: 3238, durationInFrames: 213,
    accent: "#F16B75", cueIds: [43, 44],
    data: {"kicker": "কঠিন সত্য", "headline": "শুরু করার আগে একটা সত্যি মেনে নিতে হবে", "steps": ["৮০,০০০ টাকা সঞ্চয়", "৩ লাখ টাকা ঋণ", "১০ বছর পরও একই অবস্থা"], "sub": "এই ভিডিওটা সেই সত্যি থেকে বের করার পথ", "mode": "brain"},
  },
  {
    id: "S18", type: "statement", start: 115.04, end: 121.81,
    startFrame: 3451, durationInFrames: 203,
    accent: "#F16B75", cueIds: [45, 46],
    data: {"kicker": "সত্যি কথা", "headline": "আপনি এখন যেভাবে টাকা ম্যানেজ করছেন — সেটা ভুল", "sub": "শুনতে খারাপ লাগছে, জানি", "tone": "dark"},
  },
  {
    id: "S19", type: "quote", start: 121.81, end: 127.69,
    startFrame: 3654, durationInFrames: 177,
    accent: "#FFC247", cueIds: [47, 48, 49],
    data: {"quote": "“আমি তো ঠিকই চালাচ্ছি।", "sub": "মাস শেষে টাকাও তো থাকে।”"},
  },
  {
    id: "S20", type: "statement", start: 127.69, end: 135.17,
    startFrame: 3831, durationInFrames: 224,
    accent: "#398CE5", cueIds: [50, 51, 52],
    data: {"kicker": "পরের ৬০ সেকেন্ড", "headline": "আমি প্রমাণ করে দেখাব আপনার টাকা কোথায় যাচ্ছে", "sub": "শেষে আপনি নিজেই অবাক হবেন"},
  },
  {
    id: "S21", type: "ledger", start: 135.17, end: 140.84,
    startFrame: 4055, durationInFrames: 170,
    accent: "#F16B75", cueIds: [53, 54],
    data: {"kicker": "সুমনের মাস", "headline": "চলুন সুমনের এক মাসের পুরো হিসাব দেখি", "salary": "৳ ৩০,০০০", "rows": [], "remaining": "৳ ৩০,০০০", "remainingLabel": "মাসের ১ তারিখে বেতন"},
  },
  {
    id: "S22", type: "ledger", start: 140.84, end: 147.49,
    startFrame: 4225, durationInFrames: 200,
    accent: "#19B77A", cueIds: [55, 56],
    data: {"kicker": "মাসের ১ তারিখ", "headline": "বেতন এলো ৩০,০০০ টাকা — সুমন খুশি", "salary": "৳ ৩০,০০০", "rows": [], "remaining": "৳ ৩০,০০০", "remainingLabel": "পকেটে টাকা"},
  },
  {
    id: "S23", type: "ledger", start: 147.49, end: 152.76,
    startFrame: 4425, durationInFrames: 158,
    accent: "#F16B75", cueIds: [57, 58, 59],
    data: {"kicker": "খরচ শুরু", "headline": "আগে যা খুশি, পরে যা থাকে জমানোর চেষ্টা", "salary": "৳ ৩০,০০০", "rows": [{"label": "ভাড়া", "value": "৮,০০০"}, {"label": "খাবার", "value": "৬,০০০"}], "remaining": "৳ ১৬,০০০", "remainingLabel": "এখনো হাতে"},
  },
  {
    id: "S24", type: "ledger", start: 152.76, end: 160.89,
    startFrame: 4583, durationInFrames: 244,
    accent: "#F16B75", cueIds: [60, 61, 62],
    data: {"kicker": "খরচ চলছে", "headline": "ছোট ছোট খরচে বড় অংশ বেরিয়ে যাচ্ছে", "salary": "৳ ৩০,০০০", "rows": [{"label": "যাতায়াত", "value": "৩,০০০"}, {"label": "মোবাইল + ইন্টারনেট", "value": "১,০০০"}, {"label": "আড্ডা + রেস্টুরেন্ট", "value": "৩,০০০"}], "remaining": "৳ ৯,০০০", "remainingLabel": "বাকি আছে"},
  },
  {
    id: "S25", type: "ledger", start: 160.89, end: 167.57,
    startFrame: 4827, durationInFrames: 200,
    accent: "#F16B75", cueIds: [63, 64, 65],
    data: {"kicker": "আরও খরচ", "headline": "জামা-কাপড় আর অনলাইন অর্ডারে দিন শেষ", "salary": "৳ ৩০,০০০", "rows": [{"label": "নতুন জামাকাপড়", "value": "২,০০০"}, {"label": "অনলাইন অর্ডার", "value": "২,০০০"}], "remaining": "৳ ৫,০০০", "remainingLabel": "মাসের ২৫ তারিখে"},
  },
  {
    id: "S26", type: "ledger", start: 167.57, end: 173.0,
    startFrame: 5027, durationInFrames: 163,
    accent: "#FFC247", cueIds: [66, 67],
    data: {"kicker": "শেষ ভরসা", "headline": "সুমন ভাবল — এই ৫,০০০ টাকা জমিয়ে রাখি", "salary": "৳ ৩০,০০০", "rows": [], "remaining": "৳ ৫,০০০", "remainingLabel": "জমানোর ইচ্ছা"},
  },
  {
    id: "S27", type: "trap", start: 173.0, end: 179.14,
    startFrame: 5190, durationInFrames: 184,
    accent: "#F16B75", cueIds: [68, 69],
    data: {"kicker": "কিন্তু...", "headline": "মাসের ২৭ তারিখে হঠাৎ ফোনটা পড়ে গেল", "steps": ["স্ক্রিন ভেঙে গেল", "রিপেয়ার লাগবে", "জমানোর টাকা যাবে"], "sub": "পরিকল্পনা নেই বলে হঠাৎ খরচেই সব শেষ", "mode": "brain"},
  },
  {
    id: "S28", type: "ledger", start: 179.14, end: 185.14,
    startFrame: 5374, durationInFrames: 180,
    accent: "#F16B75", cueIds: [70, 71],
    data: {"kicker": "শেষ ফল", "headline": "রিপেয়ার ৩,০০০ — বাকি ২,০০০ পার্টিতে", "salary": "৳ ৩০,০০০", "rows": [{"label": "ফোন রিপেয়ার", "value": "৩,০০০"}, {"label": "জন্মদিনের পার্টি", "value": "২,০০০"}], "remaining": "৳ ০", "remainingLabel": "মাস শেষে"},
  },
  {
    id: "S29", type: "statement", start: 185.14, end: 190.68,
    startFrame: 5554, durationInFrames: 166,
    accent: "#F16B75", cueIds: [72, 73, 74],
    data: {"kicker": "শূন্য", "headline": "প্রতি মাসে শূন্য", "sub": "১২ মাসে শূন্য", "big": "০", "bigLabel": "সঞ্চয়", "tone": "dark"},
  },
  {
    id: "S30", type: "compare", start: 190.68, end: 199.35,
    startFrame: 5720, durationInFrames: 260,
    accent: "#19B77A", cueIds: [75, 76, 77],
    data: {"kicker": "১০ বছর পর", "headline": "এখন রাকিবের দিকে তাকান", "left": {"name": "রাকিব", "value": "৳ ১৪,০০,০০০", "note": "একই আয়, একই খরচ", "color": "#19B77A", "mood": "happy"}, "right": {"name": "সুমন", "value": "৳ ০", "note": "১০ বছরে সঞ্চয়", "color": "#F16B75", "mood": "worried"}, "chip": "পার্থক্য কোথায়?"},
  },
  {
    id: "S31", type: "statement", start: 199.35, end: 204.94,
    startFrame: 5980, durationInFrames: 168,
    accent: "#19B77A", cueIds: [78, 79],
    data: {"kicker": "রাকিবের নিয়ম", "headline": "বেতন আসার মাত্র ১০ মিনিটের মধ্যে একটা কাজ করেন", "sub": "সেই কাজটাই সব বদলে দেয়", "character": "rakib"},
  },
  {
    id: "S32", type: "growth", start: 204.94, end: 212.36,
    startFrame: 6148, durationInFrames: 223,
    accent: "#19B77A", cueIds: [80, 81],
    data: {"kicker": "১০ মিনিটের কাজ", "headline": "১০ বছরে তাকে ১৪ লাখ টাকা এনে দিয়েছে", "monthly": "৬,০০০", "rate": "১২%", "total": "১৪,০০,০০০", "own": "৭,২০,০০০", "profit": "৬,৮০,০০০", "extra": "কিন্তু কী সেই কাজ?"},
  },
  {
    id: "S33", type: "question", start: 212.36, end: 220.22,
    startFrame: 6371, durationInFrames: 236,
    accent: "#F16B75", cueIds: [82, 83, 84],
    data: {"kicker": "আগে বুঝুন", "question": "কেন সুমনের মতো মানুষ প্রতি মাসে শূন্য হয়ে যায়?", "answer": "আয় কম নয় — অভ্যাস আলাদা", "sub": "অথচ তার আয়ও ৩০,০০০"},
  },
  {
    id: "S34", type: "question", start: 220.22, end: 226.72,
    startFrame: 6607, durationInFrames: 195,
    accent: "#FFC247", cueIds: [85, 86, 87],
    data: {"kicker": "সমস্যা কোথায়?", "question": "সুমনের আয়ে? না। বেতনে? না।", "answer": "সমস্যাটা সিকোয়েন্সে", "sub": "অর্থাৎ টাকা খরচের ক্রমে"},
  },
  {
    id: "S35", type: "sequence", start: 226.72, end: 232.23,
    startFrame: 6802, durationInFrames: 165,
    accent: "#F16B75", cueIds: [88, 89],
    data: {"kicker": "সিকোয়েন্স", "headline": "টাকার ক্রম বদলালে ফল বদলায়", "steps": ["আয়", "খরচ", "যা থাকে জমা"], "outcome": "সুমনের ক্রম", "character": "suman"},
  },
  {
    id: "S36", type: "sequence", start: 232.23, end: 239.69,
    startFrame: 6967, durationInFrames: 224,
    accent: "#F16B75", cueIds: [90, 91, 92],
    data: {"kicker": "সুমন কী করে?", "headline": "প্রথমে আয়, তারপর খরচ, শেষে যা থাকে জমা", "steps": ["আয়", "খরচ", "যা থাকে জমা"], "outcome": "প্রতি মাসে শূন্য", "character": "suman"},
  },
  {
    id: "S37", type: "sequence", start: 239.69, end: 245.59,
    startFrame: 7191, durationInFrames: 177,
    accent: "#19B77A", cueIds: [93, 94, 95],
    data: {"kicker": "রাকিব কী করে?", "headline": "প্রথমে আয়, তারপর নিজেকে টাকা, শেষে খরচ", "steps": ["আয়", "নিজেকে আগে", "বাকি দিয়ে খরচ"], "outcome": "প্রতি মাসে ৬,০০০ জমা", "character": "rakib"},
  },
  {
    id: "S38", type: "statement", start: 245.59, end: 252.73,
    startFrame: 7368, durationInFrames: 214,
    accent: "#FFC247", cueIds: [96, 97, 98],
    data: {"kicker": "এটাই অভ্যাস", "headline": "Pay Yourself First", "sub": "বাংলায় — নিজেকে আগে টাকা দিন", "big": "PYF", "bigLabel": "একটি লাইন, ১০ বছরের ফল", "tone": "dark"},
  },
  {
    id: "S39", type: "statement", start: 252.73, end: 259.6,
    startFrame: 7582, durationInFrames: 206,
    accent: "#19B77A", cueIds: [99, 100, 101],
    data: {"kicker": "মানে কী?", "headline": "বেতন আসার সাথে সাথে, খরচের আগে", "sub": "আয়ের অন্তত ২০% আলাদা করুন", "big": "২০%", "bigLabel": "প্রথম কাজ"},
  },
  {
    id: "S40", type: "rule", start: 259.6, end: 269.26,
    startFrame: 7788, durationInFrames: 290,
    accent: "#19B77A", cueIds: [102, 103, 104],
    data: {"kicker": "২০/৮০ নিয়ম", "headline": "২০% বিনিয়োগ, ৮০% দিয়ে মাস চালান", "percent": 20, "leftLabel": "বিনিয়োগ", "rightLabel": "মাসের খরচ", "sub": "খরচের আগেই টাকা সরিয়ে রাখুন"},
  },
  {
    id: "S41", type: "compare", start: 269.26, end: 277.97,
    startFrame: 8078, durationInFrames: 261,
    accent: "#FFC247", cueIds: [105, 106, 107],
    data: {"kicker": "এক লাইনের পার্থক্য", "headline": "সুমন ভাবে — খরচের পর যা থাকবে, জমাব", "left": {"name": "সুমন", "value": "খরচ → জমানো", "note": "যা থাকে", "color": "#19B77A", "mood": "happy"}, "right": {"name": "রাকিব", "value": "জমানো → খরচ", "note": "যা থাকে", "color": "#F16B75", "mood": "worried"}, "chip": "ক্রম বদলালেই ফল বদলায়"},
  },
  {
    id: "S42", type: "statement", start: 277.97, end: 284.67,
    startFrame: 8339, durationInFrames: 201,
    accent: "#19B77A", cueIds: [108, 109],
    data: {"kicker": "এক লাইন", "headline": "এই এক লাইন ১০ বছরে ১৩ লাখ টাকার পার্থক্য তৈরি করে", "sub": "একই আয়, একই খরচ — শুধু ক্রম আলাদা", "big": "১৩ লাখ", "bigLabel": "পার্থক্য"},
  },
  {
    id: "S43", type: "question", start: 284.67, end: 292.81,
    startFrame: 8540, durationInFrames: 244,
    accent: "#F16B75", cueIds: [110, 111, 112],
    data: {"kicker": "বড় প্রশ্ন", "question": "৩০,০০০-এ ২৫,০০০ খরচ হয়েই যায় — ২০% আলাদা করব কীভাবে?", "answer": "প্রশ্নটা একদম সঠিক", "sub": "উত্তরেই লুকিয়ে আছে আসল ট্রিক"},
  },
  {
    id: "S44", type: "question", start: 292.81, end: 301.53,
    startFrame: 8784, durationInFrames: 262,
    accent: "#FFC247", cueIds: [113, 114, 115],
    data: {"kicker": "স্বীকার করুন", "question": "২০% দিয়ে শুরু করা সত্যিই কঠিন", "answer": "বিশেষ করে যদি আয় কম হয়", "sub": "তাই এক ধাপে নয় — তিন ধাপে"},
  },
  {
    id: "S45", type: "statement", start: 301.53, end: 308.11,
    startFrame: 9046, durationInFrames: 197,
    accent: "#F16B75", cueIds: [116, 117, 118],
    data: {"kicker": "মিথ্যা বলব না", "headline": "২০% দিয়ে শুরু করা কঠিন", "sub": "বিশেষ করে কম আয়ে", "big": "কঠিন, কিন্তু অসম্ভব নয়", "tone": "dark"},
  },
  {
    id: "S46", type: "tiers", start: 308.11, end: 313.73,
    startFrame: 9243, durationInFrames: 169,
    accent: "#FFC247", cueIds: [119, 120],
    data: {"kicker": "তিন স্তরের ফর্মুলা", "headline": "যেকোনো আয়ের মানুষ ব্যবহার করতে পারবে", "tiers": [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], "active": -1, "sub": "এক ধাপে ২০% নয় — ধীরে ধীরে বাড়ান"},
  },
  {
    id: "S47", type: "tiers", start: 313.73, end: 320.82,
    startFrame: 9412, durationInFrames: 213,
    accent: "#19B77A", cueIds: [121, 122, 123],
    data: {"kicker": "স্তর ১", "headline": "প্রথম তিন মাস — মাত্র ১০% দিয়ে শুরু", "tiers": [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], "active": 0, "sub": "মাসে মাত্র ৩,০০০ টাকা"},
  },
  {
    id: "S48", type: "statement", start: 320.82, end: 327.18,
    startFrame: 9625, durationInFrames: 190,
    accent: "#FFC247", cueIds: [124, 125],
    data: {"kicker": "দিনে ১০০ টাকা", "headline": "এক কাপ চা আর একটা সিগারেট কম খেলেই ৩,০০০", "sub": "দিনে ১০০ টাকা × ৩০ দিন", "big": "১০০", "bigLabel": "টাকা / দিন"},
  },
  {
    id: "S49", type: "phone", start: 327.18, end: 335.21,
    startFrame: 9815, durationInFrames: 241,
    accent: "#19B77A", cueIds: [126, 127],
    data: {"kicker": "স্তর ১ → ২", "headline": "বেতন আসার দিনই আলাদা অ্যাকাউন্টে পাঠান", "amount": "৩,০০০", "income": "২৭,০০০", "steps": ["বেতন আসে", "৩,০০০ আলাদা", "বাকি ২৭,০০০ খরচ"]},
  },
  {
    id: "S50", type: "tiers", start: 335.21, end: 342.17,
    startFrame: 10056, durationInFrames: 209,
    accent: "#FFC247", cueIds: [128, 129],
    data: {"kicker": "স্তর ২", "headline": "৪–৬ মাস — ১৫% এ উঠুন", "tiers": [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], "active": 1, "sub": "১০% অভ্যাস হয়ে গেলে আরও ৫% বাড়ান"},
  },
  {
    id: "S51", type: "tiers", start: 342.17, end: 350.04,
    startFrame: 10265, durationInFrames: 236,
    accent: "#19B77A", cueIds: [130, 131, 132],
    data: {"kicker": "লাভ কী?", "headline": "জীবনযাত্রা বদলায় না, ব্যাংক বাড়ে", "tiers": [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], "active": 2, "sub": "৭ মাস থেকে — ২০% বা তার বেশি"},
  },
  {
    id: "S52", type: "statement", start: 350.04, end: 357.27,
    startFrame: 10501, durationInFrames: 217,
    accent: "#19B77A", cueIds: [133, 134],
    data: {"kicker": "স্তর ৩", "headline": "২০% বা তার বেশি — মাসে ৬,০০০ টাকা", "sub": "এখন এই টাকা কাজে লাগান", "big": "২০%", "bigLabel": "মাসিক বিনিয়োগ"},
  },
  {
    id: "S53", type: "growth", start: 357.27, end: 364.54,
    startFrame: 10718, durationInFrames: 218,
    accent: "#19B77A", cueIds: [135, 136],
    data: {"kicker": "১০ বছরের হিসাব", "headline": "প্রতি মাসে ৬,০০০, ১২% রিটার্নে", "monthly": "৬,০০০", "rate": "১২%", "total": "১৪,০০,০০০", "own": "৭,২০,০০০", "profit": "৬,৮০,০০০", "extra": "নিজের টাকা মাত্র ৭ লাখ ২০ হাজার"},
  },
  {
    id: "S54", type: "growth", start: 364.54, end: 371.73,
    startFrame: 10936, durationInFrames: 216,
    accent: "#FFC247", cueIds: [137, 138, 139],
    data: {"kicker": "কম্পাউন্ডিং", "headline": "বাকি ৬ লাখ ৮০ হাজার শুধু লাভ", "monthly": "৬,০০০", "rate": "১২%", "total": "১৪,০০,০০০", "own": "৭,২০,০০০", "profit": "৬,৮০,০০০", "extra": "এই লাভটাই কম্পাউন্ডিংয়ের জাদু"},
  },
  {
    id: "S55", type: "growth", start: 371.73, end: 379.62,
    startFrame: 11152, durationInFrames: 237,
    accent: "#398CE5", cueIds: [140, 141, 142],
    data: {"kicker": "আরও ভালো", "headline": "আয় বাড়লে বিনিয়োগও বাড়ান", "monthly": "৮,০০০ → ১০,০০০", "rate": "১২%", "total": "২০,০০,০০০+", "own": "৮,০০,০০০", "profit": "১২,০০,০০০+", "extra": "৩ বছরে ৮,০০০ · ৫ বছরে ১০,০০০"},
  },
  {
    id: "S56", type: "trap", start: 379.62, end: 390.05,
    startFrame: 11389, durationInFrames: 313,
    accent: "#F16B75", cueIds: [143, 144, 145],
    data: {"kicker": "ফাঁদ", "headline": "রাকিব ঠিক এটাই করেছে — কিন্তু এখানে একটা ফাঁদ আছে", "steps": ["৯০% মানুষ ৩ মাসেই ছেড়ে দেয়", "কারণটা জানলে বাঁচা যায়", "না জানলে আপনিও ছেড়ে দেবেন"], "sub": "ফাঁদটা হলো — হাতে টাকা দেখলেই খরচ", "mode": "brain"},
  },
  {
    id: "S57", type: "trap", start: 390.05, end: 397.64,
    startFrame: 11702, durationInFrames: 227,
    accent: "#F16B75", cueIds: [146, 147, 148],
    data: {"kicker": "কেন ছেড়ে দেয়?", "headline": "লোকে টাকা দেখলে খরচ করে ফেলে", "steps": ["৬,০০০ আলাদা করলাম", "কিন্তু মূল অ্যাকাউন্টেই রইল", "মস্তিষ্ক বলল — টাকা তো আছেই"], "sub": "এটা আপনার দোষ নয় — মস্তিষ্কের ডিজাইন", "mode": "brain"},
  },
  {
    id: "S58", type: "trap", start: 397.64, end: 407.23,
    startFrame: 11929, durationInFrames: 288,
    accent: "#F16B75", cueIds: [149, 150, 151, 152],
    data: {"kicker": "মস্তিষ্কের ফাঁদ", "headline": "মূল অ্যাকাউন্টে টাকা থাকলে খরচের প্রলোভন বাড়ে", "steps": ["২০ তারিখে অ্যাপ খুললেন", "অ্যাকাউন্টে টাকা আছে", "নতুন জুতা কিনে ফেললেন"], "sub": "দোষ নয় — এটাই মানুষের মস্তিষ্ক", "mode": "brain"},
  },
  {
    id: "S59", type: "trap", start: 407.23, end: 414.82,
    startFrame: 12217, durationInFrames: 228,
    accent: "#19B77A", cueIds: [153, 154, 155],
    data: {"kicker": "সমাধান", "headline": "এই ফাঁদ থেকে বাঁচার একটাই উপায় — অটোমেশন", "steps": ["টাকা মূল অ্যাকাউন্টে নয়", "আলাদা বিনিয়োগ অ্যাকাউন্টে", "খরচের আগেই চলে যাবে"], "sub": "চোখের আড়ালে থাকলে খরচও আড়ালে", "mode": "automation"},
  },
  {
    id: "S60", type: "statement", start: 414.82, end: 420.76,
    startFrame: 12445, durationInFrames: 178,
    accent: "#398CE5", cueIds: [156, 157],
    data: {"kicker": "অটোমেশন", "headline": "বেতন আসার দিনই অটোমেটিক ট্রান্সফার", "sub": "আপনার ব্যাংক অ্যাপে স্ট্যান্ডিং ইনস্ট্রাকশন দিন"},
  },
  {
    id: "S61", type: "phone", start: 420.76, end: 427.52,
    startFrame: 12623, durationInFrames: 203,
    accent: "#398CE5", cueIds: [158, 159],
    data: {"kicker": "স্ট্যান্ডিং ইনস্ট্রাকশন", "headline": "প্রতি মাসের ১ তারিখে ৬,০০০ টাকা", "amount": "৬,০০০", "income": "২৪,০০০", "steps": ["১ তারিখে বেতন", "৬,০০০ অটো ট্রান্সফার", "বাকি ২৪,০০০ খরচ"]},
  },
  {
    id: "S62", type: "phone", start: 427.52, end: 433.4,
    startFrame: 12826, durationInFrames: 176,
    accent: "#19B77A", cueIds: [160, 161],
    data: {"kicker": "টাকা দেখবেনই না", "headline": "টাকা সরাসরি বিনিয়োগ অ্যাকাউন্টে চলে যাবে", "amount": "৬,০০০", "income": "২৪,০০০", "steps": ["বেতন ৩০,০০০", "অটো ট্রান্সফার ৬,০০০", "বিনিয়োগ অ্যাকাউন্ট"]},
  },
  {
    id: "S63", type: "phone", start: 433.4, end: 441.41,
    startFrame: 13002, durationInFrames: 240,
    accent: "#FFC247", cueIds: [162, 163, 164],
    data: {"kicker": "মস্তিষ্কের হিসাব", "headline": "দেখবেন না মানে খরচের প্রশ্নই আসে না", "amount": "৬,০০০", "income": "২৪,০০০", "steps": ["আমার আয় ২৪,০০০", "এই দিয়েই মাস চালাব", "৬,০০০ বিনিয়োগে"]},
  },
  {
    id: "S64", type: "statement", start: 441.41, end: 448.95,
    startFrame: 13242, durationInFrames: 226,
    accent: "#19B77A", cueIds: [165, 166],
    data: {"kicker": "সিস্টেম vs ইচ্ছাশক্তি", "headline": "এটা ইচ্ছাশক্তির খেলা নয় — সিস্টেমের খেলা", "sub": "ইচ্ছাশক্তি একদিন শেষ হয়, সিস্টেম কখনো শেষ হয় না", "big": "সিস্টেম", "bigLabel": "সবচেয়ে শক্তিশালী অভ্যাস", "tone": "dark"},
  },
  {
    id: "S65", type: "habit", start: 448.95, end: 458.63,
    startFrame: 13468, durationInFrames: 291,
    accent: "#F16B75", cueIds: [167, 168, 169],
    data: {"kicker": "শুরুতে বলেছিলাম", "percent": 95, "headline": "৯৫% মানুষ এই অভ্যাসটা জানে, তবুও করে না", "sub": "ইচ্ছাশক্তি নয় — সিস্টেম দরকার", "cta": "জানা ≠ করা"},
  },
  {
    id: "S66", type: "wait", start: 458.63, end: 465.6,
    startFrame: 13759, durationInFrames: 209,
    accent: "#F16B75", cueIds: [170, 171, 172],
    data: {"kicker": "কেন করে না?", "headline": "কারণ তারা অপেক্ষা করে", "excuses": ["“পরের মাস থেকে শুরু করব”", "“বেতন বাড়লে করব”", "“বছরের শুরু থেকে করব”"], "sub": "এই অপেক্ষাই সবচেয়ে বড় ক্ষতি"},
  },
  {
    id: "S67", type: "statement", start: 465.6, end: 472.79,
    startFrame: 13968, durationInFrames: 216,
    accent: "#F16B75", cueIds: [173, 174],
    data: {"kicker": "সেই পরের মাস", "headline": "সেই পরের মাস কখনো আসে না", "sub": "তাই আজকের সবচেয়ে গুরুত্বপূর্ণ কথা শুনুন"},
  },
  {
    id: "S68", type: "phone", start: 472.79, end: 480.7,
    startFrame: 14184, durationInFrames: 237,
    accent: "#19B77A", cueIds: [175, 176, 177],
    data: {"kicker": "এখনই", "headline": "ফোন হাতে নিন, ব্যাংক অ্যাপ খুলুন", "amount": "৩,০০০", "income": "২৭,০০০", "steps": ["অ্যাপ খুলুন", "১০% অটো-ট্রান্সফার", "১০ মিনিটের কাজ"]},
  },
  {
    id: "S69", type: "statement", start: 480.7, end: 488.36,
    startFrame: 14421, durationInFrames: 230,
    accent: "#FFC247", cueIds: [178, 179, 180],
    data: {"kicker": "১০ মিনিট", "headline": "১০ মিনিট লাগবে — কিন্তু ১০ বছর বদলে দেবে", "sub": "এই ভিডিওটা যদি চোখ খুলে দেয়...", "big": "১০", "bigLabel": "মিনিট", "tone": "dark"},
  },
  {
    id: "S70", type: "cta", start: 488.36, end: 496.94,
    startFrame: 14651, durationInFrames: 257,
    accent: "#F16B75", cueIds: [181, 182, 183],
    data: {"kicker": "আপনার পালা", "headline": "লাইক দিন, কমেন্টে লিখুন — কত শতাংশ দিয়ে শুরু করবেন?", "options": ["১০%", "১৫%", "২০%"], "next": "আপনার সিদ্ধান্তটা লিখুন"},
  },
  {
    id: "S71", type: "cta", start: 496.94, end: 503.21,
    startFrame: 14908, durationInFrames: 188,
    accent: "#FFC247", cueIds: [184, 185],
    data: {"kicker": "ধন্যবাদ", "headline": "আমি প্রত্যেকের কমেন্ট পড়ব", "options": ["১০%", "১৫%", "২০%"], "next": "এই ভিডিওতে শিখলেন — টাকা কীভাবে জমাবেন"},
  },
  {
    id: "S72", type: "question", start: 503.21, end: 510.84,
    startFrame: 15096, durationInFrames: 229,
    accent: "#398CE5", cueIds: [186, 187],
    data: {"kicker": "পরের প্রশ্ন", "question": "জমানো টাকা কোথায় বিনিয়োগ করলে সবচেয়ে বেশি লাভ?", "answer": "ব্যাংক? শেয়ার বাজার? নাকি সোনা?", "sub": "উত্তরটা পরের ভিডিওতে"},
  },
  {
    id: "S73", type: "statement", start: 510.84, end: 519.42,
    startFrame: 15325, durationInFrames: 258,
    accent: "#398CE5", cueIds: [188, 189, 190],
    data: {"kicker": "পরের ভিডিও", "headline": "একটা ক্যালকুলেশন দেখাব — মাথা ঘুরে যাবে", "sub": "ব্যাংকে টাকা রাখলে প্রতি বছর কত হারাচ্ছেন?"},
  },
  {
    id: "S74", type: "cta", start: 519.42, end: 527.9,
    startFrame: 15583, durationInFrames: 254,
    accent: "#F16B75", cueIds: [191, 192, 193],
    data: {"kicker": "মিস করবেন না", "headline": "সাবস্ক্রাইব করুন, বেল আইকন অন রাখুন", "options": ["সাবস্ক্রাইব", "বেল আইকন", "পরের ভিডিও"], "next": "যাতে পরের ভিডিওটা মিস না হয়"},
  },
  {
    id: "S75", type: "outro", start: 527.9, end: 531.96,
    startFrame: 15837, durationInFrames: 122,
    accent: "#19B77A", cueIds: [194, 195],
    data: {"headline": "দেখা হচ্ছে পরের ভিডিওতে", "sub": "ততক্ষণ — নিজেকে আগে টাকা দিন", "signature": "Pay Yourself First"},
  },
];
