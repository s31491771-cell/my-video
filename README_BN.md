# বাংলা ফাইন্যান্স ভিডিও — পেই ইওরসেলফ ফার্স্ট

৪৯.৪৪ সেকেন্ডের বাংলা ভয়েসওভার থেকে তৈরি 2D ভেক্টর এক্সপ্লেইনার ভিডিওর প্রজেক্ট।
ফ্রেম: **1920×1080 (16:9)**, **30 fps**, H.264 MP4 + AAC।

## এই ফোল্ডারে কী আছে

```text
src/                 Remotion সোর্স (১০টি দৃশ্য)
public/audio/        ভয়েসওভার + ৯টি কোড-জেনারেটেড SFX
public/fonts/        Noto Sans Bengali (OFL)
assets/              মূল অডিও, মূল SRT, SFX কপি, ফন্ট লাইসেন্স
scene-plan.json      দৃশ্য পরিকল্পনা ও SFX টাইমিং
manifest.json        রেন্ডার সেটিংস ও সোর্স তালিকা
job_state.json       কাজের অবস্থা (resume-এর জন্য)
scripts/             SFX জেনারেটর
```

## রেন্ডার করার নিয়ম

ফোনে (Termux) রেন্ডার ধরা হয়নি — Chromium ও Remotion দরকার। ক্লাউড মেশিনে:

```bash
npm install
npm run render        # out/final-video.mp4
```

শুধু প্রিভিউ দেখতে: `npm run studio`।

## GitHub Actions দিয়ে রেন্ডার (কোনো কম্পিউটার ছাড়াই)

১. GitHub-এ নতুন রিপোজিটরি খুলুন, তারপর:

```bash
cd bengali-finance-video
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

২. রিপোর **Actions** ট্যাবে যান → **Render Bengali Explainer** → **Run workflow**।
   চাইলে concurrency, CRF বদলানো যায়; "make_release" টিক দিলে GitHub Release-ও তৈরি হবে।

৩. শেষ হলে **Artifacts → render-N**-এ পাবেন:
   `final-video.mp4`, ৬টি প্রিভিউ স্টিল, `QC_REPORT.md`, সম্পূর্ণ ডেলিভারি ZIP।

ওয়ার্কফ্লো নিজেই রেন্ডার → QC → ZIP → (ঐচ্ছিক) Release করে; QC ফেল করলে জব ফেল দেখাবে।

## গুরুত্বপূর্ণ নিয়ম

- ভয়েসওভার অপরিবর্তিত (মূল ফাইল `assets/original-voiceover.wav`)।
- SRT শুধু টাইমিং রেফারেন্স — ভিডিওতে সাবটাইটেল বার্ন করা নেই।
- কোনো ছবি ব্যবহার হয়নি; সব ভিজ্যুয়াল মূল ভেক্টর গ্রাফিক/চার্ট।
- SFX ১৯টি, প্রতিটি দৃশ্যের দৃশ্যমান ঘটনার সাথে মিলিয়ে বসানো।
