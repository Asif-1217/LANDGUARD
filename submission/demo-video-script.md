# LANDGUARD Demo Video Script
## Maximum 3 Minutes

---

**Target audience:** Hackathon judges, land technology professionals

**Tools you need:** Screen recording software (e.g., OBS Studio, Loom, Windows Game Bar `Win+G`, or any screen recorder)

**Recommended resolution:** 1080p (1920×1080) or higher

---

## Before You Record

- Open `http://localhost:8080` in a clean browser window (no other tabs visible)
- Set browser zoom to 100%
- Close notification popups and set browser to full screen (`F11`)
- Have a script cue card ready off-screen
- Do a 30-second test recording to check audio levels

---

## SCRIPT

---

### [0:00 – 0:20] INTRODUCTION

**[Screen: Dashboard — full view]**

> "Hi, I'm [Your Name], and this is LANDGUARD — a Land Conflict Intelligence System prototype for the Land Technology Innovation Hackathon.
>
> LANDGUARD inspects synthetic land records to surface potential inconsistencies through transparent, rule-based checks.
>
> All demonstration records are entirely fictional. The system makes no legal determinations and accesses no real citizen data.
>
> The dashboard displays live metrics computed from our demo dataset: six plots, three potential conflicts, and four incomplete records."

---

### [0:20 – 0:45] SCENARIO 1 — CONSISTENT RECORDS

**[Click: Demo Scenarios in sidebar → Scenario 1 → PLT-2001 → Replay →]**

> "First, a clean baseline: plot PLT-2001.
>
> In the comparison table, deed and mutation records agree on owner Amara Nwosu. There is a single active deed, an approved mutation, and zero triggered rules.
>
> The risk score is zero: 'No Conflict Detected'. This demonstrates how consistent records appear."

---

### [0:45 – 1:25] SCENARIO 2 — OWNERSHIP MISMATCH

**[Click: Demo Scenarios → Scenario 2 → PLT-2002 → Replay →]**

> "Next is Scenario 2: plot PLT-2002, demonstrating an ownership mismatch.
>
> The comparison table highlights the conflict: the registered deed lists Fatima Okonkwo, but the revenue mutation records Emmanuel Tarfa.
>
> This triggers Rule 1 with forty points, placing this plot in High Risk.
>
> The chronological timeline reveals two separate transactions in 2015 pointing to different buyers.
>
> Crucially, LANDGUARD does not accuse anyone of fraud. It states: 'Potential ownership conflict detected. Manual verification recommended.'"

---

### [1:25 – 2:00] SCENARIO 3 — DUPLICATE ACTIVE DEEDS

**[Click: Demo Scenarios → Scenario 3 → PLT-2003 → Replay →]**

> "Scenario 3 represents duplicate active deeds on plot PLT-2003.
>
> Two active deeds exist simultaneously: Deed 9901 from 2012, and Deed 9902 from 2018. Only one active deed should exist per parcel.
>
> This triggers Rule 2 for forty-five points. Along with missing mutation links and an unverified deed status, the total score reaches seventy-five: High Risk.
>
> The timeline shows an unexplained second deed appearing years later without a recorded transfer chain."

---

### [2:00 – 2:30] RISK EXPLANATION PANEL

**[Click: View Full Risk Explanation button]**

**[Screen: Risk Panel for PLT-2003]**

> "In the Risk Explanation panel, every score is completely transparent.
>
> Each point is tied to an explicit rule, specific record fields, and documented evidence. There is no black-box AI.
>
> The system also provides concrete next steps: obtain certified registry copies and consult a qualified legal professional before proceeding with any transaction."

---

### [2:30 – 2:55] CLOSING

**[Click: About & Rules in sidebar]**

**[Screen: About page — rules table]**

> "All seven rules, weights, and severity levels are published directly in the application for complete reproducibility.
>
> LANDGUARD proves that conflict detection can be explainable, responsible, and practical for preliminary due diligence."

---

### [2:55 – 3:00] END CARD

**[Screen: Dashboard — full view, disclaimer footer visible]**

> "LANDGUARD: Land Conflict Intelligence. Thank you."

---

## Recording Tips

- Speak at a measured pace — do not rush
- Move the mouse slowly and deliberately to each element you describe
- Pause briefly (1–2 seconds) before clicking a new section to give viewers time to orient
- If you make a mistake, pause, take a breath, and continue — you can edit it out
- Keep total runtime under 3 minutes; aim for 2:50 to be safe
- Add captions if your recording tool supports it (improves accessibility for judges)

---

## Tools for Recording (Windows)

| Tool | Cost | Notes |
|---|---|---|
| Windows Game Bar (`Win+G`) | Free | Built-in; records screen and audio |
| OBS Studio | Free | Professional, powerful |
| Loom | Free (basic) | Uploads to web, easy sharing |
| Clipchamp | Free | Built-in on Windows 11 |

---

*LANDGUARD Demo Video Script — Land Technology Innovation Hackathon, October 2026*
