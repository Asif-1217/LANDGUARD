# LANDGUARD — Land Conflict Intelligence System

## Concept Note

---

### Project Title

**LANDGUARD — Land Conflict Intelligence System**

---

### Concise Summary

LANDGUARD is an educational web prototype that helps users inspect synthetic land records and identify potential inconsistencies — such as ownership mismatches and duplicate active deeds — through a transparent, rule-based analysis engine. It is built for the Land Technology Innovation Hackathon to demonstrate how responsible, explainable technology can assist in surfacing land record anomalies before a professional investigation.

> **Important:** LANDGUARD operates on entirely fictional, synthetic demonstration data. It is not connected to any government land registry, does not access real records, and does not constitute a legal opinion or proof of fraud.

---

### Problem Statement

Land ownership conflicts are a persistent challenge in many regions. Before a property transaction, prospective buyers and professionals may face:

- **Inconsistent records** across multiple administrative systems (deed registry, mutation records, transfer history).
- **Duplicate or suspicious deed indicators** where more than one active deed claims ownership of the same plot.
- **Incomplete historical records**, particularly for older or legacy parcels.
- **Difficulty tracing the ownership chain** across multiple transfers over time.

These issues, if undetected before a transaction, can lead to prolonged legal disputes, financial losses, and social harm. There is a clear need for accessible tools that help stakeholders *understand* and *visualise* what potential red flags in land records look like — and what to do about them.

---

### Proposed Solution

LANDGUARD addresses this problem through three key elements:

1. **Structured Data Inspection:** Users can search for a demo plot by ID and view all associated synthetic records — deed details, mutation entries, transfer history, and data completeness status — in a clean, readable interface.

2. **Land Conflict Replay:** The central feature of the system. For a selected plot, LANDGUARD compares records side by side, highlights mismatched fields, and provides a chronological timeline of ownership-related events. When a potential conflict indicator is found, the system shows exactly which records are involved and explains, in plain language, why the rule was triggered.

3. **Transparent Risk Explanation:** LANDGUARD uses a fully documented, rule-based scoring system. Every point in the risk score is traceable to a specific rule, a specific field, and specific evidence from the demo data. No black-box scoring is used; the methodology is publicly readable in the application and the README.

---

### Target Users and Expected Impact

**Primary users (in a real-world scenario):**
- Prospective land buyers conducting due diligence
- Legal professionals reviewing land transaction documents
- Land administrators auditing record consistency
- Students learning about land record management

**Expected impact (if extended beyond prototype):**
- Faster identification of records warranting closer investigation
- Improved public understanding of what land conflict indicators look like
- A demonstration framework for responsible, explainable land-tech tooling

---

### Main Features and Workflow

| Feature | Description |
|---|---|
| Dashboard | Summary stats from the demo dataset; recent cases table; quick search |
| Plot Search | Search by Plot ID; view deed, mutation, and transfer records |
| Land Conflict Replay | Side-by-side record comparison; triggered rules; conflict timeline; ownership graph |
| Risk Explanation | Risk level, score breakdown, triggered rules with evidence, recommended next steps |
| Demo Scenarios | Four ready-to-run cases: consistent records, ownership mismatch, duplicate deeds, incomplete data |
| About & Rules | Full rule reference, scoring methodology, responsible-use context |

**Typical workflow:**
1. User opens the dashboard and sees summary statistics for the demo dataset.
2. User selects a demo scenario or searches for a Plot ID.
3. User views the Plot Records page — deed, mutation, and transfer details.
4. User launches the **Land Conflict Replay** to see side-by-side comparisons and triggered rules.
5. User opens the **Risk Explanation** panel to understand the score, evidence, and next steps.

---

### What Differentiates LANDGUARD

- **Explainability first:** Every risk indicator is tied to a named, documented rule with a clear description. No ambiguous "AI score."
- **Conflict Replay as a learning tool:** The step-by-step replay with chronological timelines makes it easy to understand *how* an inconsistency develops over time.
- **Responsible language:** The system never calls a person a fraudster or makes legal determinations. It uses language like "potential ownership conflict detected" and "manual verification recommended."
- **Zero dependencies:** Built with only HTML, CSS, and vanilla JavaScript — runnable in any browser, no installation needed.
- **Transparent data:** The entire demo dataset is in a single readable file. Anyone can inspect, modify, or extend the demo records.

---

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Data | Local JavaScript data file (`data/demo-data.js`) |
| Backend | None (fully client-side) |
| Server | Any static server (`python -m http.server` or VS Code Live Server) |
| Dependencies | Zero external libraries |

---

### Synthetic Data and Responsible Use Approach

All data in LANDGUARD is entirely fictional:
- Plot IDs, deed IDs, and mutation IDs are invented identifiers.
- Owner names are invented fictitious names.
- Locations, dates, and consideration amounts are synthetic.
- No real person's name, property, or record is used.

The system explicitly labels itself as an educational prototype throughout the interface, including:
- A prominent disclaimer on the dashboard
- A note in the sidebar footer on every page
- A clear disclaimer in the footer of every page
- A dedicated "What LANDGUARD Cannot Do" section in the About page

---

### Limitations and Future Scope

**Current limitations:**
- Works only on the six synthetic demo plots included in the prototype.
- No backend, no persistent storage, no user authentication.
- Does not connect to or simulate any real government data source.
- Risk score is illustrative; it has not been validated against real-world cases.
- Ownership graph is text-based; more complex lineage would need a proper graph library.

**Potential future improvements:**
- Integration with authorised public land record APIs (where legally available and permitted).
- Expanded rule set co-developed with legal and land administration experts.
- Multi-language support for local language land records.
- Export of conflict reports as PDF for professional review.
- Backend with a proper database to support real institutional data (with appropriate privacy and legal frameworks).
- Accessibility audit and WCAG 2.1 AA compliance testing.

---

*This concept note was prepared as part of the Land Technology Innovation Hackathon submission for LANDGUARD. October 2026.*
