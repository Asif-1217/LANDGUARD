# LANDGUARD — Final Submission Checklist

Use this checklist before submitting your project. Check off each item.

---

## 1. Code & Application

- [ ] `index.html` opens correctly in Chrome/Edge/Firefox
- [ ] **Bangla-first bilingual support:** Default language is Bangla (`bn`); toggling `বাংলা | EN` translates the interface instantly
- [ ] **Light & Dark theme:** Sun/Moon toggle switches cleanly between Light and Dark modes without layout flash
- [ ] All 6 sidebar navigation links work (Dashboard, Scenarios, Plot Records, Conflict Replay, Risk Panel, About)
- [ ] Dashboard stats show correct numbers (6 plots, 3 conflicts, 4 incomplete, 6 reviewed) with Bengali numerals in Bangla mode
- [ ] SVG visualizations render correctly (Risk Distribution Donut and Land Use Bar Chart)
- [ ] Quick Demo Scenarios strip allows 1-click jump to any test case
- [ ] Plot search by ID works: try PLT-2001, PLT-2002, PLT-2003, PLT-2004
- [ ] Searching for an unknown ID (e.g. PLT-9999) shows the "Not Found" empty state
- [ ] Pressing Enter in the search box triggers the search
- [ ] All "Replay →" buttons on the Scenarios page open the Conflict Replay for the correct plot
- [ ] "View Land Conflict Replay" button on Plot Detail page works
- [ ] "View Risk Explanation" button on Plot Detail page works
- [ ] "Next Demo Scenario →" button cycles through test cases cleanly
- [ ] "Back" navigation buttons return to the correct pages
- [ ] Escape key returns to Dashboard from any inner page
- [ ] Automated tests pass: `node test/validate.js` (9/9) and `node test/e2e-audit.js` (50/50)
- [ ] No JavaScript errors in the browser console (press F12 → Console)
- [ ] The responsible-use disclaimer is visible on the dashboard and footer

## 2. Scenario Testing

- [ ] **PLT-2001 (Consistent):** Risk level "No Conflict Detected", score 0, all-clear message shown
- [ ] **PLT-2005 (Consistent):** Same as above — no rules triggered
- [ ] **PLT-2002 (Ownership Mismatch):** RULE-01 triggered, comparison table highlights mismatched owner names in red
- [ ] **PLT-2006 (Ownership Mismatch):** Same pattern — RULE-01 triggered
- [ ] **PLT-2003 (Duplicate Deeds):** RULE-02 triggered, both active deed IDs shown, risk "High"
- [ ] **PLT-2004 (Incomplete):** Risk "Incomplete Data", missing fields listed, no mutation warning shown

## 3. UI / Responsive

- [ ] Application looks correct at full desktop width (1280px+)
- [ ] Application is usable at tablet width (768px) — stats grid shifts to 2 columns
- [ ] Mobile menu button appears on narrow screens
- [ ] No horizontal scrollbar on any page at 768px width
- [ ] All text is readable (sufficient contrast)
- [ ] Focus indicators visible when using Tab key to navigate

## 4. Project Files

- [ ] `index.html` present and valid
- [ ] `css/styles.css` present
- [ ] `js/risk-engine.js` present
- [ ] `js/app.js` present
- [ ] `data/demo-data.js` present (6 plots, all scenarios)
- [ ] `README.md` present and complete
- [ ] `submission/concept-note.md` present (≤ 4 pages when printed)
- [ ] `submission/demo-video-script.md` present
- [ ] `submission/final-submission-checklist.md` present (this file)
- [ ] `.gitignore` present

## 5. AI Disclosure

- [ ] README `AI Assistance Disclosure` section is honestly completed with the tools you actually used
- [ ] You can explain every part of the code to a judge or interviewer

## 6. Screenshots

- [ ] Screenshots folder created
- [ ] Dashboard screenshot captured
- [ ] Conflict Replay (PLT-2002) screenshot captured
- [ ] Conflict Replay (PLT-2003) screenshot captured
- [ ] Risk Explanation panel screenshot captured
- [ ] Screenshots referenced (or added) to README

## 7. Concept Note

- [ ] `submission/concept-note.md` reviewed for accuracy
- [ ] No invented statistics, fake user research, or false partnerships claimed
- [ ] Concept note does not exceed 4 printed pages
- [ ] If converting to PDF: open in browser → File → Print → Save as PDF → save as `submission/concept-note.pdf`

## 8. Demo Video

- [ ] Demo video recorded following `submission/demo-video-script.md`
- [ ] Video duration ≤ 3 minutes
- [ ] Video clearly shows: Dashboard, Scenario 1 (consistent), Scenario 2 (mismatch), Scenario 3 (duplicate deeds), Risk Explanation panel, Disclaimer
- [ ] Audio is clear and audible
- [ ] Video saved in a widely supported format (MP4 recommended)
- [ ] Video filename is descriptive (e.g. `LANDGUARD-demo-video.mp4`)

## 9. GitHub Repository (if required)

- [ ] Repository created on GitHub (do this manually — the agent does NOT push without your permission)
- [ ] Run these commands in the project folder to initialise and push:
  ```bash
  cd "d:\Landtech Hackathon"
  git init
  git add .
  git commit -m "Initial commit: LANDGUARD Land Conflict Intelligence System"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
  git push -u origin main
  ```
- [ ] Repository is set to Public (or as required by hackathon rules)
- [ ] README is visible on the repository homepage
- [ ] No sensitive files, credentials, or private data in the repository (verify with `.gitignore`)
- [ ] Repository URL noted for submission form

## 10. Final Submission

- [ ] All submission materials assembled and verified
- [ ] Submission form on hackathon platform completed with:
  - Project name: LANDGUARD — Land Conflict Intelligence System
  - GitHub / project link
  - Demo video link or upload
  - Concept note PDF upload
  - Team name / individual name
- [ ] Submitted before the deadline: **October 18, 2026**

---

## Submission Items Summary

| Item | File/Location | Status |
|---|---|---|
| Application | `index.html` + `css/` + `js/` + `data/` | ☐ |
| README | `README.md` | ☐ |
| Concept Note (Markdown) | `submission/concept-note.md` | ☐ |
| Concept Note (PDF) | `submission/concept-note.pdf` | ☐ Manual step |
| Demo Video Script | `submission/demo-video-script.md` | ☐ |
| Demo Video | `LANDGUARD-demo-video.mp4` | ☐ Manual step |
| This Checklist | `submission/final-submission-checklist.md` | ☐ |
| Screenshots | `screenshots/` folder | ☐ Manual step |
| .gitignore | `.gitignore` | ☐ |

> **Manual steps** (items the agent cannot do for you):
> 1. Record and save the demo video
> 2. Convert the concept note to PDF
> 3. Capture screenshots
> 4. Create the GitHub repository and push (requires your credentials)
> 5. Submit on the hackathon platform

---

*Good luck with your submission! — LANDGUARD, October 2026*
