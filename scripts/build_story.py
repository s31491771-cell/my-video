#!/usr/bin/env python3
"""Rebuild src/cues.ts and src/story.ts from the supplied SRT.

The SRT is the timing source of truth. Cue text is never rendered as
subtitles; it only drives when a scene and its labels appear.

Scene boundaries always fall on a cue start, and every visual element carries
an explicit `beats` entry naming the cue that actually speaks it. That is what
keeps each card/number in step with the voiceover instead of revealing the
next sentence's conclusion early.
"""
import json
import re

C = {"blue": "#398CE5", "gold": "#FFC247", "coral": "#F16B75", "green": "#19B77A"}


def st(kicker, headline, sub=None, foot=None, note=None, big=None, bigLabel=None,
       character=None, tone="light", sideNote=None, accent="blue"):
    d = {"kicker": kicker, "headline": headline}
    if sub: d["sub"] = sub
    if foot: d["foot"] = foot
    if note: d["note"] = note
    if big: d["big"] = big
    if bigLabel: d["bigLabel"] = bigLabel
    if character: d["character"] = character
    if sideNote: d["sideNote"] = sideNote
    if tone != "light": d["tone"] = tone
    return ("statement", d, C[accent])


def q(kicker, question, answer=None, note=None, sub=None, accent="gold"):
    d = {"kicker": kicker, "question": question}
    if answer: d["answer"] = answer
    if note: d["note"] = note
    if sub: d["sub"] = sub
    return ("question", d, C[accent])


def cmp(kicker, headline, lname, lval, lnote, rname, rval, rnote, chip=None, accent="green"):
    d = {"kicker": kicker, "headline": headline,
         "left": {"name": lname, "value": lval, "note": lnote, "color": C["green"], "mood": "happy"},
         "right": {"name": rname, "value": rval, "note": rnote, "color": C["coral"], "mood": "worried"}}
    if chip: d["chip"] = chip
    return ("compare", d, C[accent])


def habit(percent, kicker, headline, sub, cta, accent="coral"):
    return ("habit", {"kicker": kicker, "percent": percent, "headline": headline, "sub": sub, "cta": cta}, C[accent])


def engine(kicker, headline, sub, lt, lv, rt, rv, accent="blue"):
    return ("engine", {"kicker": kicker, "headline": headline, "sub": sub,
                       "leftTitle": lt, "leftValue": lv, "rightTitle": rt, "rightValue": rv}, C[accent])


def ledger(kicker, headline, salary, rows, remaining=None, remainingLabel="হাতে থাকল", salaryLabel="বেতন এলো", accent="coral"):
    d = {"kicker": kicker, "headline": headline,
         "rows": [{"label": a, "value": b} for a, b in rows],
         "remainingLabel": remainingLabel, "salaryLabel": salaryLabel}
    if salary: d["salary"] = salary
    if remaining: d["remaining"] = remaining
    return ("ledger", d, C[accent])


def seq(kicker, headline, steps, outcome=None, accent="gold", character=None):
    d = {"kicker": kicker, "headline": headline, "steps": steps}
    if outcome: d["outcome"] = outcome
    if character: d["character"] = character
    return ("sequence", d, C[accent])


def rule(kicker, headline, percent, sub=None, leftLabel="বিনিয়োগ", rightLabel="মাসের খরচ", accent="green"):
    d = {"kicker": kicker, "headline": headline, "percent": percent, "leftLabel": leftLabel, "rightLabel": rightLabel}
    if sub: d["sub"] = sub
    return ("rule", d, C[accent])


def tiers(kicker, headline, tiers_data, active, sub=None, note=None, accent="gold"):
    d = {"kicker": kicker, "headline": headline, "tiers": tiers_data, "active": active}
    if sub: d["sub"] = sub
    if note: d["note"] = note
    return ("tiers", d, C[accent])


def growth(kicker, headline, monthly, rate, total, own, profit, extra=None, chips=None, accent="green"):
    d = {"kicker": kicker, "headline": headline}
    if monthly: d["monthly"] = monthly
    if rate: d["rate"] = rate
    if total: d["total"] = total
    if own: d["own"] = own
    if profit: d["profit"] = profit
    if extra: d["extra"] = extra
    if chips: d["chips"] = chips
    return ("growth", d, C[accent])


def trap(kicker, headline, steps, sub=None, mode="brain", accent="coral"):
    d = {"kicker": kicker, "headline": headline, "steps": steps, "mode": mode}
    if sub: d["sub"] = sub
    return ("trap", d, C[accent])


def phone(kicker, headline, amount, income, steps, accent="blue"):
    return ("phone", {"kicker": kicker, "headline": headline, "amount": amount, "income": income, "steps": steps}, C[accent])


def wait(kicker, headline, excuses, sub, accent="coral"):
    return ("wait", {"kicker": kicker, "headline": headline, "excuses": excuses, "sub": sub}, C[accent])


def cta(kicker, headline, options, next_text, accent="green"):
    return ("cta", {"kicker": kicker, "headline": headline, "options": options, "next": next_text}, C[accent])


# Cue ranges are contiguous and cover all 195 cues exactly once. Every range
# starts on the first sentence that belongs to the scene, so a hard cut never
# lands in the middle of a spoken thought.
SPEC = [
    ((1, 4), ("opening", {"year": "২০১৫", "city": "ঢাকার মিরপুর", "names": ["রাকিব", "সুমন"], "age": "২৫ বছর"}, C["blue"])),
    ((5, 6), st("একই অফিস", "দুজনের বেতন মাসে ৩০,০০০ টাকা।", "দুজনেই একই অফিসে চাকরি করে।", big="৳ ৩০,০০০", bigLabel="মাসিক বেতন", character="both", accent="blue")),
    ((7, 8), st("একই শুরু", "একই শহর, একই বেতন,", foot="একই জীবনযাত্রা।", accent="gold")),
    ((9, 11), st("২০২৫ সাল", "এই দুই বন্ধুর আর্থিক অবস্থা আকাশ-পাতাল তফাত", "রাকিবের ব্যাংক অ্যাকাউন্টে আজ", big="৳ ১৪,০০,০০০", bigLabel="আজ অ্যাকাউন্টে", character="rakib", accent="green")),
    ((12, 14), cmp("প্রশ্ন", "আর সুমন?", "রাকিব", "৳ ১৪,০০,০০০", "১০ বছরের সঞ্চয়", "সুমন", "৳ ৮০,০০০", "অ্যাকাউন্টে আছে", "+ ৩ লাখ টাকার ঋণ", accent="coral")),
    ((15, 16), q("এখন প্রশ্ন", "খরচ যদি প্রায় একই ছিল — তাহলে পার্থক্য কোথায়?", note="দুজনের আয় যদি সমান ছিল,", accent="gold")),
    ((17, 18), q("খুঁজে দেখুন", "তাহলে এই ১৩ লাখ টাকার পার্থক্যটা কোথা থেকে এলো?", answer="উত্তরটা কোনো বিনিয়োগ টিপস নয়", accent="coral")),
    ((19, 20), q("সত্যি কথা", "কোনো শেয়ার বাজারের গোপন সূত্র না।", answer="উত্তরটা হলো একটি মাত্র অভ্যাস", accent="green")),
    ((21, 22), st("সমাধান", "এমন একটি অভ্যাস, যেটা আপনি আজ রাতেই", "এই ভিডিও শেষ হওয়ার ১০ মিনিটের মধ্যে শুরু করতে পারবেন।", accent="blue")),
    ((23, 25), habit(95, "কিন্তু একটা সমস্যা", "৯৫% মানুষ এই অভ্যাসটা জানে।", "হ্যাঁ, আপনিও সম্ভবত জানেন।", "জানা ≠ করা")),
    ((26, 29), st("তবুও করেন না", "কেন করেন না, সেটা বুঝলেই", "আপনার ১০ বছরের আর্থিক জীবন বদলে যাবে।", foot="আর সেটাই আজকের ভিডিওর আসল রহস্য।", tone="dark", accent="coral")),
    ((30, 33), st("আজকের রহস্য", "নিশ্চয়ই এসআইপি (SIP), মিউচুয়াল ফান্ড বা শেয়ার বাজারের কথা বলবে।", foot="তাই না? না।", sub="আজ কোনো বিনিয়োগের কথাই বলব না।", accent="coral")),
    ((34, 35), engine("আসল কথা", "কারণ বিনিয়োগ হলো গাড়ির ইঞ্জিন।", "ইঞ্জিন যত শক্তিশালীই হোক,", "ইঞ্জিন", "বিনিয়োগ", "তেল", "না থাকলে গাড়ি নড়ে না", accent="blue")),
    ((36, 37), engine("তুলনা", "ফেরারির ইঞ্জিন হোক আর ল্যাম্বরগিনির,", "তেল না থাকলে গাড়ি এক ইঞ্চিও নড়বে না।", "ফেরারি", "শক্তিশালী ইঞ্জিন", "ল্যাম্বরগিনি", "তবু তেল লাগবে", accent="gold")),
    ((38, 41), st("আজকের অভ্যাস", "আজকের অভ্যাসটা হলো সেই তেল ভরার অভ্যাস।", "আপনি যতই ভালো শেয়ার কিনুন, যতই সোনা জমান,", foot="এই অভ্যাসটা না থাকলে,", big="তেল ছাড়া ইঞ্জিন নয়", bigLabel="গাড়ি চলবে না", tone="dark", accent="green")),
    ((42, 42), st("১০ বছর পর", "এই অভ্যাস ছাড়া আপনি সুমনের মতোই থাকবেন", tone="dark", character="suman", accent="coral")),
    ((43, 44), trap("কঠিন সত্য", "৮০,০০০ টাকা আর ৩ লাখ ঋণ।", ["৮০,০০০ টাকা সঞ্চয়", "৩ লাখ টাকা ঋণ", "১০ বছর পরও একই অবস্থা"], "আর এই অভ্যাসটা শুরু করার আগে একটা কঠিন সত্যি মেনে নিতে হবে।", "brain", accent="coral")),
    ((45, 46), st("সত্যি কথা", "সত্যিটা হলো, আপনি এখন যেভাবে টাকা ম্যানেজ করছেন — সেটা ভুল।", "আমি জানি, কথাটা শুনতে খারাপ লাগছে।", tone="dark", accent="coral")),
    ((47, 49), ("quote", {"kicker": "আপনি হয়তো ভাবছেন", "quote": "“আমি তো ঠিকই চালাচ্ছি।", "sub": "মাস শেষে টাকাও তো থাকে।”"}, C["gold"])),
    ((50, 52), st("পরের ৬০ সেকেন্ড", "আমি আপনাকে প্রমাণ করে দেখাব", "আপনার টাকা কোথায় যাচ্ছে।", foot="আর আপনি নিজেই অবাক হয়ে যাবেন।", accent="blue")),
    ((53, 53), ledger("সুমনের মাস", "চলুন, সুমনের একটা মাসের পুরো হিসাব দেখি।", None, [], accent="coral")),
    ((54, 56), ledger("মাসের ১ তারিখ", "বেতন এলো ৩০,০০০ টাকা।", "৳ ৩০,০০০", [], "৳ ৩০,০০০", "পকেতে টাকা", accent="green")),
    ((57, 59), ledger("খরচ শুরু", "এবার কী করল সুমন?", "৳ ৩০,০০০", [("ভাড়া", "৮,০০০"), ("খাবার", "৬,০০০")], "৳ ১৬,০০০", "এখনো হাতে", accent="coral")),
    ((60, 62), ledger("খরচ চলছে", "যাতায়াত ৩,০০০।", "৳ ৩০,০০০", [("মোবাইল + ইন্টারনেট", "১,০০০"), ("আড্ডা + রেস্টুরেন্ট", "৩,০০০")], "৳ ৯,০০০", "বাকি আছে", accent="coral")),
    ((63, 66), ledger("আরও খরচ", "নতুন জামাকাপড় ২,০০০।", "৳ ৩০,০০০", [("অনলাইন অর্ডার", "২,০০০")], "৳ ৫,০০০", "মাসের ২৫ তারিখে", accent="coral")),
    ((67, 67), ledger("শেষ ভরসা", "সুমন ভাবল — এই ৫,০০০ টাকা জমিয়ে রাখি।", "৳ ৫,০০০", [], "৳ ৫,০০০", "হাতে আছে", accent="gold")),
    ((68, 69), trap("কিন্তু...", "মাসের ২৭ তারিখে হঠাৎ ফোনটা হাত থেকে পড়ে স্ক্রিন ভেঙে গেল।", ["ফোন পড়ে গেল", "স্ক্রিন ভেঙে গেল", "পরিকল্পনা ছিল না"], None, "brain", accent="coral")),
    ((70, 71), ledger("শেষ ফল", "রিপেয়ারে গেল ৩,০০০ টাকা।", "৳ ৩০,০০০", [("জন্মদিনের পার্টি", "২,০০০")], "৳ ০", "মাস শেষে", accent="coral")),
    ((72, 75), st("শূন্য", "প্রতি মাসে শূন্য।", "১০ বছরে শূন্য।", foot="১২ মাসে শূন্য।", tone="dark", sideNote="১০ বছরে শূন্য", accent="coral")),
    ((76, 77), cmp("১০ বছর পর", "এখন রাকিবের দিকে তাকান।", "রাকিব", "৳ ১৪,০০,০০০", "আয় ৳ ৩০,০০০, খরচ প্রায় একই", "সুমন", "৳ ০", "১০ বছরে সঞ্চয়", "পার্থক্য কোথায়?", accent="green")),
    ((78, 79), st("রাকিবের নিয়ম", "মাসের ১ তারিখে বেতন আসার", "মাত্র ১০ মিনিটের মধ্যে একটা কাজ করে।", character="rakib", accent="green")),
    ((80, 81), growth("১০ মিনিটের কাজ", "আর এই ১০ মিনিটের কাজটাই ১০ বছরে তাকে ১৪ লাখ টাকা এনে দিয়েছে।", None, None, "১৪,০০,০০০", None, None, extra="কিন্তু কী সেই ১০ মিনিটের কাজ?", accent="green")),
    ((82, 84), q("আগে বুঝুন", "কেন সুমনের মতো মানুষ প্রতি মাসে শূন্য হয়ে যায়,", answer="অথচ তার আয় তো কম না?", accent="coral")),
    ((85, 87), q("সমস্যা কোথায়?", "সমস্যাটা সুমনের আয়ে না।", answer="সমস্যাটা সুমনের বেতনেও না।", accent="gold")),
    ((88, 89), seq("সিকোয়েন্স", "সমস্যাটা হলো সুমনের সিকোয়েন্সে।", [], "মানে টাকা খরচের ক্রমে।", "gold", "suman")),
    ((90, 92), seq("সুমন কী করে?", "সুমন প্রথমে আয় করে, তারপর খরচ করে,", ["আয়", "খরচ", "যা থাকে জমা"], None, "coral", "suman")),
    ((93, 96), seq("রাকিব কী করে?", "রাকিব প্রথমে আয় করে,", ["আয়", "নিজেকে আগে", "বাকি দিয়ে খরচ"], None, "green", "rakib")),
    ((97, 99), st("এটাই অভ্যাস", "ইংরেজিতে বলে ‘Pay Yourself First’।", "বাংলায় বলি — নিজেকে আগে টাকা দিন।", big="PYF", bigLabel="একটি লাইন, ১০ বছরের ফল", tone="dark", accent="gold")),
    ((100, 101), st("মানে কী?", "মানে হলো, বেতন আসার সাথে সাথে", accent="green")),
    ((102, 104), rule("২০/৮০ নিয়ম", "আপনার আয়ের অন্তত ২০ শতাংশ আলাদা করে বিনিয়োগ অ্যাকাউন্টে পাঠিয়ে দিন।", 20, "তারপর বাকি ৮০ শতাংশ দিয়ে মাস চালান।", "বিনিয়োগ", "মাসের খরচ", accent="green")),
    ((105, 107), cmp("পার্থক্যটা বুঝছেন?", "সুমন ভাবে — খরচের পর যা থাকবে, জমাব।", "সুমন", "খরচ → জমানো", "খরচের পরে যা থাকে", "রাকিব", "জমানো → খরচ", "জমানোর পরে যা থাকে", None, accent="gold")),
    ((108, 109), st("এক লাইন", "এই এক লাইনের পার্থক্য।", "এই এক লাইন ১০ বছরে ১৩ লাখ টাকার পার্থক্য তৈরি করে।", big="১৩ লাখ", bigLabel="পার্থক্য", accent="green")),
    ((110, 113), q("বড় প্রশ্ন", "“ভাই, আমার তো ৩০,০০০-এর মধ্যে ২৫,০০০ খরচ হয়েই যায়।", note="আপনি হয়তো এখন ভাবছেন,", answer="২০ শতাংশ আলাদা করলে তো মাস চালাতে পারব না।”", accent="coral")),
    ((114, 115), q("স্বীকার করুন", "এই প্রশ্নটা একদম সঠিক।", answer="আর এই প্রশ্নের উত্তরেই লুকিয়ে আছে আসল ট্রিকটা।", accent="gold")),
    ((116, 118), st("মিথ্যা বলব না", "২০ শতাংশ দিয়ে শুরু করা কঠিন।", "বিশেষ করে যদি আপনার আয় কম হয়।", big="২০%", bigLabel="দিয়ে শুরু করা কঠিন", tone="dark", accent="coral")),
    ((119, 120), tiers("তিন স্তরের ফর্মুলা", "তাই আমি আপনাকে একটা তিন স্তরের ফর্মুলা দিচ্ছি,", [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], -1, "যেকোনো আয়ের মানুষ ব্যবহার করতে পারবে।", accent="gold")),
    ((121, 123), tiers("স্তর ১", "স্তর ১: প্রথম তিন মাস।", [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], 0, "মাত্র ১০ শতাংশ দিয়ে শুরু করুন।", "হ্যাঁ, মাত্র ৩,০০০ টাকা।", accent="green")),
    ((124, 125), st("স্তর ১ থেকে", "দিনে ১০০ টাকা।", "এক কাপ চা আর একটা সিগারেট কম খেলেই এই টাকা বেরিয়ে আসবে।", big="১০০", bigLabel="টাকা / দিন", accent="gold")),
    ((126, 126), phone("স্তর ১ → ২", "এই ৩,০০০ টাকা বেতন আসার দিনই একটা আলাদা অ্যাকাউন্টে পাঠিয়ে দিন।", "৩,০০০", "২৭,০০০", ["বেতন আসার দিনই", "৩,০০০ আলাদা অ্যাকাউন্টে", "বাকি ২৭,০০০ দিয়ে খরচ"], accent="green")),
    ((127, 129), tiers("স্তর ২", "স্তর ২: ৪ থেকে ৬ মাস।", [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], 1, "১৫ শতাংশে উঠুন।", "১০% অভ্যাস হয়ে গেলে আরও ৫ শতাংশ বাড়ান।", accent="gold")),
    ((130, 132), tiers("লাভ কী?", "দেখবেন আপনার জীবনযাত্রায় কোনো পরিবর্তন আসেনি,", [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], 2, "কিন্তু ব্যাংকে টাকা জমছে।", "স্তর ৩: ৭ মাস থেকে—", accent="green")),
    ((133, 134), st("স্তর ৩", "২০ শতাংশ বা তার বেশি।", "৬,০০০ টাকা প্রতি মাসে ১২% রিটার্নে", big="২০%", bigLabel="মাসিক বিনিয়োগ", accent="green")),
    ((135, 136), growth("১০ বছরের হিসাব", "তাহলে ১০ বছর পর আপনার অ্যাকাউন্টে থাকবে প্রায় ১৪ লাখ টাকা।", "৬,০০০", "১২%", "১৪,০০,০০০", "৭,২০,০০০", None, accent="green")),
    ((137, 138), growth("কম্পাউন্ডিং", "বাকি ৬ লাখ ৮০ হাজার টাকা হলো শুধু লাভ—", None, None, None, None, "৬,৮০,০০০", "কম্পাউন্ডিংয়ের জাদু।", accent="gold")),
    ((139, 142), growth("আরও ভালো", "আর যদি আয় বাড়ার সাথে সাথে বিনিয়োগও বাড়ান—", None, "১২%", "২০ লাখ", None, None, extra="১০ বছরে ২০ লাখ ছাড়িয়ে যাওয়া একদম সম্ভব।", chips=["তিন বছর পর ৮,০০০,", "পাঁচ বছর পর ১০,০০০—"], accent="blue")),
    ((143, 145), trap("ফাঁদ", "রাকিব ঠিক এটাই করেছে।", ["১০ মিনিটের কাজ", "কিন্তু একটা ফাঁদ আছে", "৯০% মানুষ তিন মাসেই ছেড়ে দেয়"], None, "brain", accent="coral")),
    ((146, 148), trap("কেন ছেড়ে দেয়?", "আপনিও হয়তো ছেড়ে দেবেন,", ["আপনিও হয়তো ছেড়ে দেবেন", "যদি এই ফাঁদটা না জানেন"], "ফাঁদটা হলো— মানুষ হাতে টাকা দেখলে খরচ করে ফেলে।", "brain", accent="coral")),
    ((149, 152), trap("মস্তিষ্কের ফাঁদ", "এটা আপনার দোষ না,", ["আপনি ৬,০০০ টাকা আলাদা করলেন,", "কিন্তু সেটা মূল ব্যাংক অ্যাকাউন্টেই পড়ে থাকে,"], "এটা মানুষের মস্তিষ্কের ডিজাইন।", "brain", accent="coral")),
    ((153, 156), trap("২০ তারিখে", "তাহলে মাসের ২০ তারিখে যখন অ্যাপ খুলে দেখবেন", ["অ্যাকাউন্টে টাকা আছে,", "তখন মস্তিষ্ক বলবে — “আরে টাকা তো আছেই,", "একটা নতুন জুতা কিনে ফেলি।”"], None, "brain", accent="coral")),
    ((157, 157), st("সমাধান", "এই ফাঁদ থেকে বাঁচার একটাই উপায়— অটোমেশন।", tone="dark", accent="green")),
    ((158, 159), phone("স্ট্যান্ডিং ইনস্ট্রাকশন", "বেতন আসার দিনই অটোমেটিক ট্রান্সফার সেট করুন।", "৬,০০০", "২৪,০০০", ["বেতন আসার দিনই", "অটো ট্রান্সফার সেট করুন", "স্ট্যান্ডিং ইনস্ট্রাকশন দিন"], accent="blue")),
    ((160, 161), phone("টাকা দেখবেনই না", "প্রতি মাসের ১ তারিখে ৬,০০০ টাকা", "৬,০০০", "২৪,০০০", ["১ তারিখে", "৬,০০০ অটো ট্রান্সফার", "বিনিয়োগ অ্যাকাউন্টে চলে যাবে"], accent="green")),
    ((162, 164), phone("মস্তিষ্কের হিসাব", "আপনি টাকাটা দেখবেনই না।", "৬,০০০", "২৪,০০০", ["টাকা দেখবেন না", "খরচের প্রশ্নই আসে না", "আয় ২৪,০০০"], accent="gold")),
    ((165, 166), st("সিস্টেম vs ইচ্ছাশক্তি", "এটা কোনো ইচ্ছাশক্তির খেলা না, এটা সিস্টেমের খেলা।", "আর সেই ২৪,০০০ দিয়েই আপনি দিব্যি মাস চালাবেন।", big="সিস্টেম", bigLabel="সবচেয়ে শক্তিশালী অভ্যাস", tone="dark", accent="green")),
    ((167, 169), habit(95, "শুরুতে বলেছিলাম", "৯৫ শতাংশ মানুষ এই অভ্যাসটা জানে, তবুও করে না।", "ইচ্ছাশক্তি একদিন শেষ হয়, সিস্টেম কখনো শেষ হয় না।", "ভিডিওর শুরুতে বলেছিলাম—")),
    ((170, 172), wait("কেন করে না?", "কারণ তারা অপেক্ষা করে।", ["“পরের মাস থেকে শুরু করব”", "“বেতন বাড়লে করব”", "“বছরের শুরু থেকে করব”"], "এই অপেক্ষাই সবচেয়ে বড় ক্ষতি", accent="coral")),
    ((173, 174), st("সেই পরের মাস", "আর সেই পরের মাস কখনো আসে না।", "তাই আজকের ভিডিওর সবচেয়ে গুরুত্বপূর্ণ কথা শুনুন।", accent="coral")),
    ((175, 177), phone("এই ভিডিও শেষ হওয়ার পর", "ফোনটা হাতে নিন, ব্যাংক অ্যাপ খুলুন,", "৩,০০০", "২৭,০০০", ["ফোনটা হাতে নিন", "ব্যাংক অ্যাপ খুলুন", "১০% অটো-ট্রান্সফার সেট করুন"], accent="green")),
    ((178, 180), st("১০ মিনিট", "১০ মিনিট লাগবে।", "এই ভিডিওটা যদি আপনার চোখ খুলে দিয়ে থাকে,", foot="এই ১০ মিনিট আপনার ১০ বছর বদলে দেবে।", sideNote="এই ১০ মিনিট আপনার ১০ বছর বদলে দেবে।", accent="green")),
    ((181, 183), cta("আপনার পালা", "তাহলে লাইক দিন— এটা আমাকে অনেক সাহায্য করে।", ["১০%", "১৫%", "২০%"], "আর কমেন্টে লিখুন আপনি কত শতাংশ দিয়ে শুরু করবেন—", accent="coral")),
    ((184, 185), cta("ধন্যবাদ", "আমি প্রত্যেকের কমেন্ট পড়ব।", ["১০%", "১৫%", "২০%"], "আর সবশেষে, এই ভিডিওতে শিখলেন টাকা কীভাবে জমাবেন।", accent="gold")),
    ((186, 187), q("পরের প্রশ্ন", "জমানো টাকাটা কোথায় বিনিয়োগ করলে সবচেয়ে বেশি লাভ হবে?", answer="ব্যাংকে রাখলে, শেয়ার বাজারে, নাকি সোনায়?", accent="blue")),
    ((188, 191), st("পরের ভিডিও", "পরের ভিডিওতে আমি একটা ক্যালকুলেশন দেখাব,", "কারণ ব্যাংকে টাকা রাখলে আপনি প্রতি বছর কত টাকা হারাচ্ছেন,", foot="যেটা দেখলে আপনার মাথা ঘুরে যাবে।", note="সেটা জানলে আপনি আর একদিনও টাকা ব্যাংকে রাখবেন না।", accent="blue")),
    ((192, 193), cta("মিস করবেন না", "তাই সাবস্ক্রাইব করে বেল আইকনটা অন করে রাখুন,", ["সাবস্ক্রাইব", "বেল আইকন", "পরের ভিডিও"], "যাতে পরের ভিডিওটা মিস না হয়।", accent="coral")),
    ((194, 195), ("outro", {"headline": "দেখা হচ্ছে পরের ভিডিওতে।", "sub": "ততক্ষণ— নিজেকে আগে টাকা দিন।", "signature": "Pay Yourself First"}, C["green"])),
]

# Per-element cue beats. Keys are element names used by src/full/scenes.tsx.
# Values are absolute SRT cue ids and must fall inside the scene's own range.
# Every visible element is bound to the exact cue that speaks it, so a card,
# number or line appears on the syllable the voice says it.
BEATS = {
    "S01": {"year": 1, "city": 2, "names": 3, "age": 4},
    "S02": {"kicker": 5, "sub": 5, "character": 5, "headline": 6, "big": 6, "side": 6},
    "S03": {"kicker": 7, "headline": 7, "foot": 8},
    "S04": {"kicker": 9, "headline": 10, "sub": 11, "big": 11, "character": 11, "side": 11},
    "S05": {"kicker": 12, "headline": 12, "left": 12, "right": 13, "chip": 14},
    "S06": {"kicker": 15, "question": 15, "note": 16},
    "S07": {"kicker": 17, "question": 17, "answer": 18},
    "S08": {"kicker": 19, "question": 19, "answer": 20},
    "S09": {"kicker": 21, "headline": 21, "sub": 22},
    "S10": {"kicker": 23, "percent": 24, "headline": 24, "sub": 25, "cta": 25},
    "S11": {"kicker": 26, "headline": 27, "sub": 28, "foot": 29},
    "S12": {"kicker": 30, "headline": 31, "foot": 32, "sub": 33},
    "S13": {"kicker": 34, "headline": 34, "left": 34, "sub": 35, "right": 35},
    "S14": {"kicker": 36, "headline": 36, "left": 36, "sub": 37, "right": 37},
    "S15": {"kicker": 38, "headline": 38, "foot": 39, "sub": 40, "big": 41},
    "S16": {"kicker": 42, "headline": 42, "character": 42},
    "S17": {"kicker": 43, "headline": 43, "step0": 43, "step1": 43, "step2": 44, "sub": 44},
    "S18": {"kicker": 45, "headline": 45, "sub": 46},
    "S19": {"kicker": 47, "quote": 48, "sub": 49},
    "S20": {"kicker": 50, "headline": 50, "sub": 51, "foot": 52},
    "S21": {"kicker": 53, "headline": 53, "book": 53},
    "S22": {"kicker": 54, "headline": 55, "salary": 55, "remainingLabel": 56, "remaining": 56},
    "S23": {"kicker": 57, "headline": 57, "salary": 57, "row0": 58, "row1": 59, "remaining": 59},
    "S24": {"kicker": 60, "headline": 60, "salary": 60, "row0": 61, "row1": 62, "remaining": 62},
    "S25": {"kicker": 63, "headline": 63, "salary": 63, "row0": 64, "remainingLabel": 65, "remaining": 66},
    "S26": {"kicker": 67, "headline": 67, "salary": 67, "remaining": 67, "book": 67},
    "S27": {"kicker": 68, "headline": 69, "step0": 69, "step1": 69, "step2": 69},
    "S28": {"kicker": 70, "headline": 70, "salary": 70, "row0": 71, "remaining": 71},
    "S29": {"kicker": 72, "headline": 73, "foot": 74, "sub": 75, "side": 75},
    "S30": {"kicker": 76, "headline": 76, "left": 76, "right": 77, "chip": 77},
    "S31": {"kicker": 78, "headline": 78, "sub": 79, "character": 79},
    "S32": {"kicker": 80, "headline": 80, "total": 80, "extra": 81},
    "S33": {"kicker": 82, "question": 83, "answer": 84},
    "S34": {"kicker": 85, "question": 86, "answer": 87},
    "S35": {"kicker": 88, "headline": 88, "outcome": 89},
    "S36": {"kicker": 90, "headline": 91, "step0": 91, "step1": 91, "step2": 92},
    "S37": {"kicker": 93, "headline": 94, "step0": 94, "step1": 95, "step2": 96},
    "S38": {"kicker": 97, "headline": 98, "big": 98, "side": 98, "sub": 99},
    "S39": {"kicker": 100, "headline": 101},
    "S40": {"kicker": 102, "headline": 103, "bar": 103, "sub": 104},
    "S41": {"kicker": 105, "headline": 106, "left": 106, "right": 107},
    "S42": {"kicker": 108, "headline": 108, "sub": 109, "big": 109, "side": 109},
    "S43": {"kicker": 110, "note": 111, "question": 112, "answer": 113},
    "S44": {"kicker": 114, "question": 114, "answer": 115},
    "S45": {"kicker": 116, "headline": 117, "sub": 118, "big": 118},
    "S46": {"kicker": 119, "headline": 119, "tier0": 119, "tier1": 120, "tier2": 120, "sub": 120},
    "S47": {"kicker": 121, "headline": 121, "tier0": 121, "tier1": 121, "tier2": 121, "sub": 122, "note": 123},
    "S48": {"kicker": 124, "headline": 124, "big": 124, "sub": 125},
    "S49": {"kicker": 126, "headline": 126, "step0": 126, "step1": 126, "step2": 126, "phone": 126},
    "S50": {"kicker": 127, "headline": 127, "tier1": 127, "sub": 128, "note": 129},
    "S51": {"kicker": 130, "headline": 130, "sub": 131, "tier2": 132, "note": 132},
    "S52": {"kicker": 133, "headline": 133, "big": 133, "sub": 134},
    "S53": {"kicker": 135, "headline": 135, "total": 135, "chips": 135, "own": 136},
    "S54": {"kicker": 137, "headline": 137, "profit": 137, "extra": 138},
    "S55": {"kicker": 139, "headline": 139, "chip0": 140, "chip1": 141, "total": 142, "extra": 142},
    "S56": {"kicker": 143, "headline": 143, "step0": 143, "step1": 144, "step2": 145},
    "S57": {"kicker": 146, "headline": 146, "step0": 146, "step1": 147, "sub": 148},
    "S58": {"kicker": 149, "headline": 149, "sub": 150, "step0": 151, "step1": 152},
    "S59": {"kicker": 153, "headline": 153, "step0": 154, "step1": 155, "step2": 156},
    "S60": {"kicker": 157, "headline": 157, "side": 157},
    "S61": {"kicker": 158, "headline": 158, "step0": 158, "step1": 158, "step2": 159, "phone": 158},
    "S62": {"kicker": 160, "headline": 160, "step0": 160, "step1": 160, "step2": 161, "phone": 161},
    "S63": {"kicker": 162, "headline": 162, "step0": 162, "step1": 163, "step2": 164, "phone": 164},
    "S64": {"kicker": 165, "sub": 165, "headline": 166, "big": 166, "side": 166},
    "S65": {"kicker": 167, "sub": 167, "cta": 168, "percent": 169, "headline": 169},
    "S66": {"kicker": 170, "headline": 170, "excuse0": 171, "excuse1": 171, "excuse2": 172, "sub": 172},
    "S67": {"kicker": 173, "headline": 173, "side": 173, "sub": 174},
    "S68": {"kicker": 175, "headline": 176, "step0": 176, "step1": 176, "step2": 177, "phone": 177},
    "S69": {"kicker": 178, "headline": 178, "side": 178, "foot": 179, "sub": 180},
    "S70": {"kicker": 181, "headline": 181, "next": 182, "options": 183},
    "S71": {"kicker": 184, "headline": 184, "options": 184, "next": 185},
    "S72": {"kicker": 186, "question": 186, "answer": 187},
    "S73": {"kicker": 188, "headline": 188, "foot": 189, "sub": 190, "note": 191},
    "S74": {"kicker": 192, "headline": 192, "options": 192, "next": 193},
    "S75": {"kicker": 194, "headline": 194, "sub": 195, "signature": 195},
}

AUDIO = 531.96
FRAMES = 15959
SRT = "assets/subtitles-new.srt"


def srt_time(s):
    h, m, rest = s.split(":")
    sec, ms = rest.split(",")
    return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000


txt = open(SRT, encoding="utf-8-sig").read()
cues = {}
cue_text = {}
for block in re.split(r"\n\s*\n", txt.strip()):
    lines = block.splitlines()
    m = re.match(r"(\S+)\s*-->\s*(\S+)", lines[1])
    number = int(lines[0])
    cues[number] = (srt_time(m.group(1)), srt_time(m.group(2)))
    cue_text[number] = " ".join(lines[2:]).strip()

# Fail loudly if the cue ranges ever leave a gap or overlap.
covered = [c for a, b in (item[0] for item in SPEC) for c in range(a, b + 1)]
assert covered == list(range(1, 196)), "SPEC cue ranges must cover 1..195 exactly once"
assert len(SPEC) == 75, f"expected 75 scenes, got {len(SPEC)}"

scenes = []
prev_end = 0.0
for i, ((a, b), (typ, data, accent)) in enumerate(SPEC, 1):
    first = cues[a][0]
    start = 0.0 if i == 1 else max(prev_end, round(first - 0.12, 3))
    scenes.append({"id": f"S{i:02d}", "type": typ, "start": start, "cues": list(range(a, b + 1)), "accent": accent, "data": data})
    prev_end = round(cues[b][1], 3)
for i, scene in enumerate(scenes):
    scene["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else AUDIO
    scene["startFrame"] = round(scene["start"] * 30)
for i, scene in enumerate(scenes):
    nxt = scenes[i + 1]["startFrame"] if i + 1 < len(scenes) else FRAMES
    scene["durationInFrames"] = nxt - scene["startFrame"]
assert scenes[-1]["startFrame"] + scenes[-1]["durationInFrames"] == FRAMES

for scene in scenes:
    beats = BEATS.get(scene["id"], {})
    for key, cue_id in beats.items():
        assert cue_id in scene["cues"], f"{scene['id']} beat {key}={cue_id} is outside {scene['cues'][0]}..{scene['cues'][-1]}"
    scene["data"]["beats"] = beats


def dump(value):
    return json.dumps(value, ensure_ascii=False)


out = [
    "// Story timeline generated from the supplied SRT. Times are the SRT cue times;",
    "// the SRT is a timing reference only and is never rendered as subtitles.",
    'import {CUES} from "./cues";',
    "",
    "export type SceneType =",
    '  | "opening" | "statement" | "compare" | "question" | "habit" | "engine"',
    '  | "ledger" | "sequence" | "rule" | "tiers" | "growth" | "trap"',
    '  | "phone" | "wait" | "cta" | "outro" | "quote";',
    "",
    "export type StoryScene = {",
    "  id: string;",
    "  type: SceneType;",
    "  start: number;",
    "  end: number;",
    "  startFrame: number;",
    "  durationInFrames: number;",
    "  accent: string;",
    "  cueIds: number[];",
    "  data: Record<string, unknown>;",
    "};",
    "",
    "export const AUDIO_SECONDS = 531.96;",
    "export const TOTAL_FRAMES = 15959;",
    "",
    "export const cueById = (id: number) => {",
    "  const cue = CUES[id - 1];",
    "  if (!cue || cue.id !== id) throw new Error(`Missing cue ${id}`);",
    "  return cue;",
    "};",
    "",
    "/** Frames from a scene's local zero to an absolute SRT cue time. */",
    "export const cueFrame = (scene: StoryScene, cueId: number): number =>",
    "  Math.max(0, Math.round((cueById(cueId).start - scene.start) * 30));",
    "",
    "export const SCENES: StoryScene[] = [",
]
for scene in scenes:
    out += [
        "  {",
        f'    id: {dump(scene["id"])}, type: {dump(scene["type"])}, start: {scene["start"]}, end: {scene["end"]},',
        f'    startFrame: {scene["startFrame"]}, durationInFrames: {scene["durationInFrames"]},',
        f'    accent: {dump(scene["accent"])}, cueIds: {dump(scene["cues"])},',
        f'    data: {dump(scene["data"])},',
        "  },",
    ]
out.append("];")
open("src/story.ts", "w", encoding="utf-8").write("\n".join(out) + "\n")
print(f"wrote {len(scenes)} scenes / {sum(s['durationInFrames'] for s in scenes)} frames")


# --------------------------------------------------------------------------- #
# SFX plan: one accent per visual beat, always inside its own scene, mixed low
# under the narration. Code-synthesized library in public/audio/sfx.
# --------------------------------------------------------------------------- #
GAIN = {
    "pop": 0.10,
    "tick": 0.10,
    "click": 0.09,
    "swipe": 0.15,
    "whoosh": 0.17,
    "coin": 0.16,
    "ding": 0.17,
    "riser": 0.15,
    "warn": 0.13,
}

ACT_STARTS = {0, 15, 30, 45, 60, len(scenes) - 1}
plan = []


def add(sound, at, gain=None):
    plan.append((round(max(0.0, at), 3), sound, gain if gain is not None else GAIN[sound]))


for index, scene in enumerate(scenes):
    ids = scene["cues"]
    typ = scene["type"]
    data = scene["data"]
    beats = data.get("beats", {})

    add("whoosh" if index in ACT_STARTS else "pop", scene["start"] + 0.02)

    def at(key, fallback_cue):
        cue_id = beats.get(key, fallback_cue)
        return cues[cue_id][0]

    if typ == "opening":
        for key in ("city", "names", "age"):
            add("tick", at(key, ids[min(1, len(ids) - 1)]))
    elif typ in ("statement", "quote", "outro"):
        if typ == "outro":
            add("riser", scene["start"] + 0.1)
        add("ding", at("headline", ids[-1]))
    elif typ == "compare":
        add("swipe", at("right", ids[min(1, len(ids) - 1)]))
        if data.get("chip"):
            add("ding", at("chip", ids[-1]))
    elif typ == "question":
        add("tick", at("question", ids[0]))
        if data.get("answer"):
            add("pop", at("answer", ids[min(1, len(ids) - 1)]))
    elif typ == "habit":
        add("tick", at("percent", ids[0]))
        add("ding", at("cta", ids[-1]))
    elif typ == "engine":
        add("swipe", at("right", ids[min(1, len(ids) - 1)]))
    elif typ == "ledger":
        for i in range(len(data.get("rows", []))):
            add("click", at(f"row{i}", ids[min(i + 1, len(ids) - 1)]))
        if data.get("remaining"):
            add("coin", at("remaining", ids[-1]))
    elif typ == "sequence":
        for i in range(len(data.get("steps", []))):
            add("pop", at(f"step{i}", ids[min(i, len(ids) - 1)]))
        add("coin", at("outcome", ids[-1]) + 0.05)
    elif typ == "rule":
        add("swipe", at("bar", ids[min(1, len(ids) - 1)]))
    elif typ == "tiers":
        add("pop", at("headline", ids[0]))
    elif typ == "growth":
        add("riser", max(scene["start"] + 0.1, at("total", ids[0]) - 0.35))
        add("coin", at("total", ids[-1]))
    elif typ == "trap":
        add("warn", scene["start"] + 0.05)
        for i in range(len(data.get("steps", []))):
            add("click", at(f"step{i}", ids[min(i, len(ids) - 1)]))
    elif typ == "phone":
        add("click", at("phone", ids[0]))
        add("ding", at("headline", ids[-1]))
    elif typ == "wait":
        add("warn", scene["start"] + 0.05)
        for i in range(len(data.get("excuses", []))):
            add("tick", at(f"excuse{i}", ids[min(i, len(ids) - 1)]))
    elif typ == "cta":
        add("ding", at("next", ids[-1]))

plan.sort()
final_plan = []
for at_seconds, sound, gain in plan:
    if at_seconds < 0.0 or at_seconds > AUDIO - 0.6:
        continue
    if final_plan and at_seconds - final_plan[-1][0] < 0.30:
        continue
    final_plan.append((at_seconds, sound, gain))

timing = [
    "// Generated by scripts/build_story.py — do not edit by hand.",
    "// Voiceover is the supplied 8:52 narration, used untouched.",
    "",
    "export const FPS = 30;",
    "export const WIDTH = 1920;",
    "export const HEIGHT = 1080;",
    f"export const AUDIO_SECONDS = {AUDIO};",
    f"export const DURATION_IN_FRAMES = {FRAMES};",
    "",
    "export type SfxSound =",
    '  | "whoosh" | "swipe" | "pop" | "tick" | "click"',
    '  | "ding" | "coin" | "riser" | "warn";',
    "",
    "export type SfxCue = {sound: SfxSound; atSeconds: number; gain: number};",
    "",
    "/**",
    " * Every cue is placed on an SRT beat, i.e. on the syllable where the matching",
    " * visual event appears. Gains stay 14-20 dB under the -0.1 dBFS voice peak so",
    " * the narration always dominates.",
    " */",
    "export const SFX_CUES: SfxCue[] = [",
]
for at_seconds, sound, gain in final_plan:
    timing.append(f'  {{sound: "{sound}", atSeconds: {at_seconds}, gain: {gain}}},')
timing.append("];")
open("src/timing.ts", "w", encoding="utf-8").write("\n".join(timing) + "\n")

# --------------------------------------------------------------------------- #
# scene-plan.json (human-readable production plan)
# --------------------------------------------------------------------------- #
scene_plan = {
    "project": "bengali-finance-video",
    "composition_id": "PayYourselfFirst",
    "aspect_ratio": "16:9",
    "resolution": "1920x1080",
    "fps": 30,
    "total_frames": FRAMES,
    "voiceover_duration_seconds": AUDIO,
    "subtitles": "none",
    "sfx_enabled": True,
    "timing_source": "SRT cue times (assets/subtitles-new.srt); measured speech offset median +0.02 s",
    "scenes": [],
}
for index, scene in enumerate(scenes):
    ids = scene["cues"]
    scene_sfx = [
        {"sound": sound, "at_seconds": at, "gain": gain}
        for at, sound, gain in final_plan
        if scene["start"] <= at < scene["end"]
    ]
    scene_plan["scenes"].append(
        {
            "scene_id": scene["id"],
            "type": scene["type"],
            "start_seconds": scene["start"],
            "end_seconds": scene["end"],
            "start_frame": scene["startFrame"],
            "duration_in_frames": scene["durationInFrames"],
            "srt_cue_ids": ids,
            "narration": " / ".join(cue_text[c] for c in ids),
            "visual_data": scene["data"],
            "accent": scene["accent"],
            "sfx": scene_sfx,
        }
    )
open("scene-plan.json", "w", encoding="utf-8").write(json.dumps(scene_plan, ensure_ascii=False, indent=2) + "\n")

print(f"wrote src/timing.ts with {len(final_plan)} SFX cues")
print(f"wrote scene-plan.json with {len(scene_plan['scenes'])} scenes")
