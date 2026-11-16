#!/usr/bin/env python3
"""Rebuild src/cues.ts and src/story.ts from the supplied SRT.

The SRT is the timing source of truth. Cue text is never rendered as
subtitles; it only drives when a scene and its labels appear.
"""
import json
import re

C = {"blue": "#398CE5", "gold": "#FFC247", "coral": "#F16B75", "green": "#19B77A"}


def st(kicker, headline, sub=None, big=None, bigLabel=None, character=None, tone="light", accent="blue"):
    d = {"kicker": kicker, "headline": headline}
    if sub: d["sub"] = sub
    if big: d["big"] = big
    if bigLabel: d["bigLabel"] = bigLabel
    if character: d["character"] = character
    if tone != "light": d["tone"] = tone
    return ("statement", d, C[accent])


def q(kicker, question, answer, sub=None, accent="gold"):
    d = {"kicker": kicker, "question": question, "answer": answer}
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


def ledger(kicker, headline, salary, rows, remaining, remainingLabel="হাতে থাকল", accent="coral"):
    return ("ledger", {"kicker": kicker, "headline": headline, "salary": salary,
                       "rows": [{"label": a, "value": b} for a, b in rows],
                       "remaining": remaining, "remainingLabel": remainingLabel}, C[accent])


def seq(kicker, headline, steps, outcome=None, accent="gold", character=None):
    d = {"kicker": kicker, "headline": headline, "steps": steps}
    if outcome: d["outcome"] = outcome
    if character: d["character"] = character
    return ("sequence", d, C[accent])


def rule(kicker, headline, percent, sub=None, leftLabel="বিনিয়োগ", rightLabel="মাসের খরচ", accent="green"):
    d = {"kicker": kicker, "headline": headline, "percent": percent, "leftLabel": leftLabel, "rightLabel": rightLabel}
    if sub: d["sub"] = sub
    return ("rule", d, C[accent])


def tiers(kicker, headline, tiers_data, active, sub=None, accent="gold"):
    d = {"kicker": kicker, "headline": headline, "tiers": tiers_data, "active": active}
    if sub: d["sub"] = sub
    return ("tiers", d, C[accent])


def growth(kicker, headline, monthly, rate, total, own, profit, extra=None, accent="green"):
    d = {"kicker": kicker, "headline": headline, "monthly": monthly, "rate": rate,
         "total": total, "own": own, "profit": profit}
    if extra: d["extra"] = extra
    return ("growth", d, C[accent])


def trap(kicker, headline, steps, sub, mode="brain", accent="coral"):
    return ("trap", {"kicker": kicker, "headline": headline, "steps": steps, "sub": sub, "mode": mode}, C[accent])


def phone(kicker, headline, amount, income, steps, accent="blue"):
    return ("phone", {"kicker": kicker, "headline": headline, "amount": amount, "income": income, "steps": steps}, C[accent])


def wait(kicker, headline, excuses, sub, accent="coral"):
    return ("wait", {"kicker": kicker, "headline": headline, "excuses": excuses, "sub": sub}, C[accent])


def cta(kicker, headline, options, next_text, accent="green"):
    return ("cta", {"kicker": kicker, "headline": headline, "options": options, "next": next_text}, C[accent])


SPEC = [
    ((1, 4), ("opening", {"year": "২০১৫", "city": "ঢাকার মিরপুর", "names": ["রাকিব", "সুমন"], "age": "২৫ বছর"}, C["blue"])),
    ((5, 6), st("একই অফিস", "দুজনের বেতনই মাসে ৩০,০০০ টাকা", "একই বয়স, একই চাকরি", "৳ ৩০,০০০", "মাসিক বেতন", "both", accent="blue")),
    ((7, 9), st("একই শুরু", "একই শহর, একই বেতন, একই জীবনযাত্রা", "কিন্তু ২০১৫ থেকে ২০২৫ — ফল এক নয়", accent="gold")),
    ((10, 11), st("২০২৫", "এই দুই বন্ধুর আর্থিক অবস্থা আকাশ-পাতাল তফাত", "রাকিবের অ্যাকাউন্টে আজ", "৳ ১৪,০০,০০০", accent="green", character="rakib")),
    ((12, 14), cmp("প্রশ্ন", "আর সুমন?", "রাকিব", "৳ ১৪,০০,০০০", "১০ বছরের সঞ্চয়", "সুমন", "৳ ৮০,০০০", "+ ৩ লাখ টাকা ঋণ", "পার্থক্য ১৩ লাখ ২০ হাজার", accent="coral")),
    ((15, 16), q("এখন প্রশ্ন", "আয় সমান, খরচও প্রায় সমান — তাহলে পার্থক্য কোথায়?", "১৩ লাখ টাকা", "উত্তরটা অভ্যাসে, আয়ে নয়", accent="gold")),
    ((17, 18), q("খুঁজে দেখুন", "এই ১৩ লাখ টাকার পার্থক্য কোথা থেকে এলো?", "কোনো বিনিয়োগ টিপস নয়", accent="coral")),
    ((19, 20), q("সত্যি কথা", "কোনো শেয়ার বাজারের গোপন সূত্র?", "একটি মাত্র অভ্যাস", accent="green")),
    ((21, 22), st("সমাধান", "এমন অভ্যাস, যা আজ রাতেই শুরু করা যায়", "এই ভিডিও শেষ হওয়ার ১০ মিনিটের মধ্যে", accent="blue")),
    ((23, 25), habit(95, "কিন্তু একটা সমস্যা", "৯৫% মানুষ এই অভ্যাসটা জানে", "আপনিও সম্ভবত জানেন", "জানা ≠ করা")),
    ((26, 28), habit(95, "তবুও করেন না", "কেন করেন না, সেটা বুঝলেই", "আপনার ১০ বছরের আর্থিক জীবন বদলে যাবে", "কারণটাই আসল")),
    ((29, 31), st("আজকের রহস্য", "আপনি নিশ্চয়ই ভাবছেন — SIP, মিউচুয়াল ফান্ড বা শেয়ার বাজার", "না। আজ কোনো বিনিয়োগের কথাই বলব না।", accent="coral")),
    ((32, 35), engine("আসল কথা", "বিনিয়োগ হলো গাড়ির ইঞ্জিন", "ইঞ্জিন যত শক্তিশালীই হোক...", "ইঞ্জিন", "যত শক্তিশালীই হোক", "তেল", "না থাকলে গাড়ি নড়ে না", accent="blue")),
    ((36, 37), engine("তুলনা", "ফেরারি হোক আর ল্যাম্বরগিনি", "তেল না থাকলে...", "ফেরারি", "শক্তিশালী ইঞ্জিন", "ল্যাম্বরগিনি", "তবু তেল লাগবে", accent="gold")),
    ((38, 40), st("আজকের অভ্যাস", "এই অভ্যাসটাই সেই তেল ভরার অভ্যাস", "শেয়ার, সোনা, রিয়েল এস্টেট — যতই ভালো হোক", "তেল ছাড়া ইঞ্জিন নয়", tone="dark", accent="green")),
    ((41, 42), st("১০ বছর পর", "এই অভ্যাস ছাড়া আপনি সুমনের মতোই থাকবেন", "৮০,০০০ টাকা আর ৩ লাখ টাকা ঋণ", tone="dark", accent="coral", character="suman")),
    ((43, 44), trap("কঠিন সত্য", "শুরু করার আগে একটা সত্যি মেনে নিতে হবে", ["৮০,০০০ টাকা সঞ্চয়", "৩ লাখ টাকা ঋণ", "১০ বছর পরও একই অবস্থা"], "এই ভিডিওটা সেই সত্যি থেকে বের করার পথ", "brain", accent="coral")),
    ((45, 46), st("সত্যি কথা", "আপনি এখন যেভাবে টাকা ম্যানেজ করছেন — সেটা ভুল", "শুনতে খারাপ লাগছে, জানি", tone="dark", accent="coral")),
    ((47, 49), ("quote", {"quote": "“আমি তো ঠিকই চালাচ্ছি।", "sub": "মাস শেষে টাকাও তো থাকে।”"}, C["gold"])),
    ((50, 52), st("পরের ৬০ সেকেন্ড", "আমি প্রমাণ করে দেখাব আপনার টাকা কোথায় যাচ্ছে", "শেষে আপনি নিজেই অবাক হবেন", accent="blue")),
    ((53, 54), ledger("সুমনের মাস", "চলুন সুমনের এক মাসের পুরো হিসাব দেখি", "৳ ৩০,০০০", [], "৳ ৩০,০০০", "মাসের ১ তারিখে বেতন", accent="coral")),
    ((55, 56), ledger("মাসের ১ তারিখ", "বেতন এলো ৩০,০০০ টাকা — সুমন খুশি", "৳ ৩০,০০০", [], "৳ ৩০,০০০", "পকেটে টাকা", accent="green")),
    ((57, 59), ledger("খরচ শুরু", "আগে যা খুশি, পরে যা থাকে জমানোর চেষ্টা", "৳ ৩০,০০০", [("ভাড়া", "৮,০০০"), ("খাবার", "৬,০০০")], "৳ ১৬,০০০", "এখনো হাতে", accent="coral")),
    ((60, 62), ledger("খরচ চলছে", "ছোট ছোট খরচে বড় অংশ বেরিয়ে যাচ্ছে", "৳ ৩০,০০০", [("যাতায়াত", "৩,০০০"), ("মোবাইল + ইন্টারনেট", "১,০০০"), ("আড্ডা + রেস্টুরেন্ট", "৩,০০০")], "৳ ৯,০০০", "বাকি আছে", accent="coral")),
    ((63, 65), ledger("আরও খরচ", "জামা-কাপড় আর অনলাইন অর্ডারে দিন শেষ", "৳ ৩০,০০০", [("নতুন জামাকাপড়", "২,০০০"), ("অনলাইন অর্ডার", "২,০০০")], "৳ ৫,০০০", "মাসের ২৫ তারিখে", accent="coral")),
    ((66, 67), ledger("শেষ ভরসা", "সুমন ভাবল — এই ৫,০০০ টাকা জমিয়ে রাখি", "৳ ৩০,০০০", [], "৳ ৫,০০০", "জমানোর ইচ্ছা", accent="gold")),
    ((68, 69), trap("কিন্তু...", "মাসের ২৭ তারিখে হঠাৎ ফোনটা পড়ে গেল", ["স্ক্রিন ভেঙে গেল", "রিপেয়ার লাগবে", "জমানোর টাকা যাবে"], "পরিকল্পনা নেই বলে হঠাৎ খরচেই সব শেষ", "brain", accent="coral")),
    ((70, 71), ledger("শেষ ফল", "রিপেয়ার ৩,০০০ — বাকি ২,০০০ পার্টিতে", "৳ ৩০,০০০", [("ফোন রিপেয়ার", "৩,০০০"), ("জন্মদিনের পার্টি", "২,০০০")], "৳ ০", "মাস শেষে", accent="coral")),
    ((72, 74), st("শূন্য", "প্রতি মাসে শূন্য", "১২ মাসে শূন্য", "০", "সঞ্চয়", tone="dark", accent="coral")),
    ((75, 77), cmp("১০ বছর পর", "এখন রাকিবের দিকে তাকান", "রাকিব", "৳ ১৪,০০,০০০", "একই আয়, একই খরচ", "সুমন", "৳ ০", "১০ বছরে সঞ্চয়", "পার্থক্য কোথায়?", accent="green")),
    ((78, 79), st("রাকিবের নিয়ম", "বেতন আসার মাত্র ১০ মিনিটের মধ্যে একটা কাজ করেন", "সেই কাজটাই সব বদলে দেয়", accent="green", character="rakib")),
    ((80, 81), growth("১০ মিনিটের কাজ", "১০ বছরে তাকে ১৪ লাখ টাকা এনে দিয়েছে", "৬,০০০", "১২%", "১৪,০০,০০০", "৭,২০,০০০", "৬,৮০,০০০", "কিন্তু কী সেই কাজ?", accent="green")),
    ((82, 84), q("আগে বুঝুন", "কেন সুমনের মতো মানুষ প্রতি মাসে শূন্য হয়ে যায়?", "আয় কম নয় — অভ্যাস আলাদা", "অথচ তার আয়ও ৩০,০০০", accent="coral")),
    ((85, 87), q("সমস্যা কোথায়?", "সুমনের আয়ে? না। বেতনে? না।", "সমস্যাটা সিকোয়েন্সে", "অর্থাৎ টাকা খরচের ক্রমে", accent="gold")),
    ((88, 89), seq("সিকোয়েন্স", "টাকার ক্রম বদলালে ফল বদলায়", ["আয়", "খরচ", "যা থাকে জমা"], "সুমনের ক্রম", "coral", "suman")),
    ((90, 92), seq("সুমন কী করে?", "প্রথমে আয়, তারপর খরচ, শেষে যা থাকে জমা", ["আয়", "খরচ", "যা থাকে জমা"], "প্রতি মাসে শূন্য", "coral", "suman")),
    ((93, 95), seq("রাকিব কী করে?", "প্রথমে আয়, তারপর নিজেকে টাকা, শেষে খরচ", ["আয়", "নিজেকে আগে", "বাকি দিয়ে খরচ"], "প্রতি মাসে ৬,০০০ জমা", "green", "rakib")),
    ((96, 98), st("এটাই অভ্যাস", "Pay Yourself First", "বাংলায় — নিজেকে আগে টাকা দিন", "PYF", "একটি লাইন, ১০ বছরের ফল", tone="dark", accent="gold")),
    ((99, 101), st("মানে কী?", "বেতন আসার সাথে সাথে, খরচের আগে", "আয়ের অন্তত ২০% আলাদা করুন", "২০%", "প্রথম কাজ", accent="green")),
    ((102, 104), rule("২০/৮০ নিয়ম", "২০% বিনিয়োগ, ৮০% দিয়ে মাস চালান", 20, "খরচের আগেই টাকা সরিয়ে রাখুন", "বিনিয়োগ", "মাসের খরচ", accent="green")),
    ((105, 107), cmp("এক লাইনের পার্থক্য", "সুমন ভাবে — খরচের পর যা থাকবে, জমাব", "সুমন", "খরচ → জমানো", "যা থাকে", "রাকিব", "জমানো → খরচ", "যা থাকে", "ক্রম বদলালেই ফল বদলায়", accent="gold")),
    ((108, 109), st("এক লাইন", "এই এক লাইন ১০ বছরে ১৩ লাখ টাকার পার্থক্য তৈরি করে", "একই আয়, একই খরচ — শুধু ক্রম আলাদা", "১৩ লাখ", "পার্থক্য", accent="green")),
    ((110, 112), q("বড় প্রশ্ন", "৩০,০০০-এ ২৫,০০০ খরচ হয়েই যায় — ২০% আলাদা করব কীভাবে?", "প্রশ্নটা একদম সঠিক", "উত্তরেই লুকিয়ে আছে আসল ট্রিক", accent="coral")),
    ((113, 115), q("স্বীকার করুন", "২০% দিয়ে শুরু করা সত্যিই কঠিন", "বিশেষ করে যদি আয় কম হয়", "তাই এক ধাপে নয় — তিন ধাপে", accent="gold")),
    ((116, 118), st("মিথ্যা বলব না", "২০% দিয়ে শুরু করা কঠিন", "বিশেষ করে কম আয়ে", "কঠিন, কিন্তু অসম্ভব নয়", tone="dark", accent="coral")),
    ((119, 120), tiers("তিন স্তরের ফর্মুলা", "যেকোনো আয়ের মানুষ ব্যবহার করতে পারবে", [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], -1, "এক ধাপে ২০% নয় — ধীরে ধীরে বাড়ান", accent="gold")),
    ((121, 123), tiers("স্তর ১", "প্রথম তিন মাস — মাত্র ১০% দিয়ে শুরু", [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], 0, "মাসে মাত্র ৩,০০০ টাকা", accent="green")),
    ((124, 125), st("দিনে ১০০ টাকা", "এক কাপ চা আর একটা সিগারেট কম খেলেই ৩,০০০", "দিনে ১০০ টাকা × ৩০ দিন", "১০০", "টাকা / দিন", accent="gold")),
    ((126, 127), phone("স্তর ১ → ২", "বেতন আসার দিনই আলাদা অ্যাকাউন্টে পাঠান", "৩,০০০", "২৭,০০০", ["বেতন আসে", "৩,০০০ আলাদা", "বাকি ২৭,০০০ খরচ"], accent="green")),
    ((128, 129), tiers("স্তর ২", "৪–৬ মাস — ১৫% এ উঠুন", [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], 1, "১০% অভ্যাস হয়ে গেলে আরও ৫% বাড়ান", accent="gold")),
    ((130, 132), tiers("লাভ কী?", "জীবনযাত্রা বদলায় না, ব্যাংক বাড়ে", [{"title": "স্তর ১", "pct": "১০%", "amount": "৩,০০০", "note": "প্রথম ৩ মাস"}, {"title": "স্তর ২", "pct": "১৫%", "amount": "৪,৫০০", "note": "৪–৬ মাস"}, {"title": "স্তর ৩", "pct": "২০%", "amount": "৬,০০০", "note": "৭ মাস থেকে"}], 2, "৭ মাস থেকে — ২০% বা তার বেশি", accent="green")),
    ((133, 134), st("স্তর ৩", "২০% বা তার বেশি — মাসে ৬,০০০ টাকা", "এখন এই টাকা কাজে লাগান", "২০%", "মাসিক বিনিয়োগ", accent="green")),
    ((135, 136), growth("১০ বছরের হিসাব", "প্রতি মাসে ৬,০০০, ১২% রিটার্নে", "৬,০০০", "১২%", "১৪,০০,০০০", "৭,২০,০০০", "৬,৮০,০০০", "নিজের টাকা মাত্র ৭ লাখ ২০ হাজার", accent="green")),
    ((137, 139), growth("কম্পাউন্ডিং", "বাকি ৬ লাখ ৮০ হাজার শুধু লাভ", "৬,০০০", "১২%", "১৪,০০,০০০", "৭,২০,০০০", "৬,৮০,০০০", "এই লাভটাই কম্পাউন্ডিংয়ের জাদু", accent="gold")),
    ((140, 142), growth("আরও ভালো", "আয় বাড়লে বিনিয়োগও বাড়ান", "৮,০০০ → ১০,০০০", "১২%", "২০,০০,০০০+", "৮,০০,০০০", "১২,০০,০০০+", "৩ বছরে ৮,০০০ · ৫ বছরে ১০,০০০", accent="blue")),
    ((143, 145), trap("ফাঁদ", "রাকিব ঠিক এটাই করেছে — কিন্তু এখানে একটা ফাঁদ আছে", ["৯০% মানুষ ৩ মাসেই ছেড়ে দেয়", "কারণটা জানলে বাঁচা যায়", "না জানলে আপনিও ছেড়ে দেবেন"], "ফাঁদটা হলো — হাতে টাকা দেখলেই খরচ", "brain", accent="coral")),
    ((146, 148), trap("কেন ছেড়ে দেয়?", "লোকে টাকা দেখলে খরচ করে ফেলে", ["৬,০০০ আলাদা করলাম", "কিন্তু মূল অ্যাকাউন্টেই রইল", "মস্তিষ্ক বলল — টাকা তো আছেই"], "এটা আপনার দোষ নয় — মস্তিষ্কের ডিজাইন", "brain", accent="coral")),
    ((149, 152), trap("মস্তিষ্কের ফাঁদ", "মূল অ্যাকাউন্টে টাকা থাকলে খরচের প্রলোভন বাড়ে", ["২০ তারিখে অ্যাপ খুললেন", "অ্যাকাউন্টে টাকা আছে", "নতুন জুতা কিনে ফেললেন"], "দোষ নয় — এটাই মানুষের মস্তিষ্ক", "brain", accent="coral")),
    ((153, 155), trap("সমাধান", "এই ফাঁদ থেকে বাঁচার একটাই উপায় — অটোমেশন", ["টাকা মূল অ্যাকাউন্টে নয়", "আলাদা বিনিয়োগ অ্যাকাউন্টে", "খরচের আগেই চলে যাবে"], "চোখের আড়ালে থাকলে খরচও আড়ালে", "automation", accent="green")),
    ((156, 157), st("অটোমেশন", "বেতন আসার দিনই অটোমেটিক ট্রান্সফার", "আপনার ব্যাংক অ্যাপে স্ট্যান্ডিং ইনস্ট্রাকশন দিন", accent="blue")),
    ((158, 159), phone("স্ট্যান্ডিং ইনস্ট্রাকশন", "প্রতি মাসের ১ তারিখে ৬,০০০ টাকা", "৬,০০০", "২৪,০০০", ["১ তারিখে বেতন", "৬,০০০ অটো ট্রান্সফার", "বাকি ২৪,০০০ খরচ"], accent="blue")),
    ((160, 161), phone("টাকা দেখবেনই না", "টাকা সরাসরি বিনিয়োগ অ্যাকাউন্টে চলে যাবে", "৬,০০০", "২৪,০০০", ["বেতন ৩০,০০০", "অটো ট্রান্সফার ৬,০০০", "বিনিয়োগ অ্যাকাউন্ট"], accent="green")),
    ((162, 164), phone("মস্তিষ্কের হিসাব", "দেখবেন না মানে খরচের প্রশ্নই আসে না", "৬,০০০", "২৪,০০০", ["আমার আয় ২৪,০০০", "এই দিয়েই মাস চালাব", "৬,০০০ বিনিয়োগে"], accent="gold")),
    ((165, 166), st("সিস্টেম vs ইচ্ছাশক্তি", "এটা ইচ্ছাশক্তির খেলা নয় — সিস্টেমের খেলা", "ইচ্ছাশক্তি একদিন শেষ হয়, সিস্টেম কখনো শেষ হয় না", "সিস্টেম", "সবচেয়ে শক্তিশালী অভ্যাস", tone="dark", accent="green")),
    ((167, 169), habit(95, "শুরুতে বলেছিলাম", "৯৫% মানুষ এই অভ্যাসটা জানে, তবুও করে না", "ইচ্ছাশক্তি নয় — সিস্টেম দরকার", "জানা ≠ করা")),
    ((170, 172), wait("কেন করে না?", "কারণ তারা অপেক্ষা করে", ["“পরের মাস থেকে শুরু করব”", "“বেতন বাড়লে করব”", "“বছরের শুরু থেকে করব”"], "এই অপেক্ষাই সবচেয়ে বড় ক্ষতি", accent="coral")),
    ((173, 174), st("সেই পরের মাস", "সেই পরের মাস কখনো আসে না", "তাই আজকের সবচেয়ে গুরুত্বপূর্ণ কথা শুনুন", accent="coral")),
    ((175, 177), phone("এখনই", "ফোন হাতে নিন, ব্যাংক অ্যাপ খুলুন", "৩,০০০", "২৭,০০০", ["অ্যাপ খুলুন", "১০% অটো-ট্রান্সফার", "১০ মিনিটের কাজ"], accent="green")),
    ((178, 180), st("১০ মিনিট", "১০ মিনিট লাগবে — কিন্তু ১০ বছর বদলে দেবে", "এই ভিডিওটা যদি চোখ খুলে দেয়...", "১০", "মিনিট", tone="dark", accent="gold")),
    ((181, 183), cta("আপনার পালা", "লাইক দিন, কমেন্টে লিখুন — কত শতাংশ দিয়ে শুরু করবেন?", ["১০%", "১৫%", "২০%"], "আপনার সিদ্ধান্তটা লিখুন", accent="coral")),
    ((184, 185), cta("ধন্যবাদ", "আমি প্রত্যেকের কমেন্ট পড়ব", ["১০%", "১৫%", "২০%"], "এই ভিডিওতে শিখলেন — টাকা কীভাবে জমাবেন", accent="gold")),
    ((186, 187), q("পরের প্রশ্ন", "জমানো টাকা কোথায় বিনিয়োগ করলে সবচেয়ে বেশি লাভ?", "ব্যাংক? শেয়ার বাজার? নাকি সোনা?", "উত্তরটা পরের ভিডিওতে", accent="blue")),
    ((188, 190), st("পরের ভিডিও", "একটা ক্যালকুলেশন দেখাব — মাথা ঘুরে যাবে", "ব্যাংকে টাকা রাখলে প্রতি বছর কত হারাচ্ছেন?", accent="blue")),
    ((191, 193), cta("মিস করবেন না", "সাবস্ক্রাইব করুন, বেল আইকন অন রাখুন", ["সাবস্ক্রাইব", "বেল আইকন", "পরের ভিডিও"], "যাতে পরের ভিডিওটা মিস না হয়", accent="coral")),
    ((194, 195), ("outro", {"headline": "দেখা হচ্ছে পরের ভিডিওতে", "sub": "ততক্ষণ — নিজেকে আগে টাকা দিন", "signature": "Pay Yourself First"}, C["green"])),
]

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

    add("whoosh" if index in ACT_STARTS else "pop", scene["start"] + 0.02)

    if typ == "opening":
        for cid in ids[1:4]:
            add("tick", cues[cid][0])
    elif typ in ("statement", "quote", "outro"):
        if typ == "outro":
            add("riser", scene["start"] + 0.1)
        add("ding", cues[ids[-1]][0])
    elif typ == "compare":
        if len(ids) > 1:
            add("swipe", cues[ids[1]][0])
        if data.get("chip"):
            add("ding", cues[ids[-1]][0])
    elif typ == "question":
        add("tick", cues[ids[0]][0])
        if len(ids) > 1:
            add("pop", cues[ids[1]][0])
    elif typ == "habit":
        add("tick", cues[ids[0]][0])
        add("ding", cues[ids[-1]][0])
    elif typ == "engine":
        if len(ids) > 1:
            add("swipe", cues[ids[1]][0])
    elif typ == "ledger":
        for cid in ids[:-1]:
            add("click", cues[cid][0])
        add("coin", cues[ids[-1]][0])
    elif typ == "sequence":
        for cid in ids[1:]:
            add("pop", cues[cid][0])
        add("coin", cues[ids[-1]][0] + 0.05)
    elif typ == "rule":
        if len(ids) > 1:
            add("swipe", cues[ids[1]][0])
    elif typ == "tiers":
        for cid in ids:
            add("pop", cues[cid][0])
    elif typ == "growth":
        if len(ids) > 1:
            add("riser", max(scene["start"] + 0.1, cues[ids[1]][0] - 0.35))
        add("coin", cues[ids[-1]][0])
    elif typ == "trap":
        add("warn", scene["start"] + 0.05)
        for cid in ids[:-1]:
            add("click", cues[cid][0])
    elif typ == "phone":
        add("click", cues[ids[0]][0])
        add("ding", cues[ids[-1]][0])
    elif typ == "wait":
        add("warn", scene["start"] + 0.05)
        for cid in ids[:-1]:
            add("tick", cues[cid][0])
    elif typ == "cta":
        add("ding", cues[ids[-1]][0])

plan.sort()
final_plan = []
for at, sound, gain in plan:
    if at < 0.0 or at > AUDIO - 0.6:
        continue
    if final_plan and at - final_plan[-1][0] < 0.30:
        continue
    final_plan.append((at, sound, gain))

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
for at, sound, gain in final_plan:
    timing.append(f'  {{sound: "{sound}", atSeconds: {at}, gain: {gain}}},')
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
