/**
 * LANDGUARD — Land Conflict Intelligence System
 * Main Application Controller (Bilingual, Animated, SaaS Grade)
 *
 * Fully integrated with I18n engine and ThemeManager.
 */

// ─────────────────────────────────────────────────────────────────────────────
// APP STATE
// ─────────────────────────────────────────────────────────────────────────────
const App = {
  currentPage: "dashboard",
  currentPlot: null,
  currentAnalysis: null,
  allPlots: LANDGUARD_DATA.plots
};

// ─────────────────────────────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Theme and Language
  if (typeof ThemeManager !== "undefined") ThemeManager.init();
  if (typeof I18n !== "undefined") I18n.init();

  initNavigation();
  initLanguageToggles();
  initThemeToggles();
  initSearch();
  initScenarioButtons();
  setupKeyboardNav();

  // Initial full render in active language
  renderAllStaticText();
  renderDashboard();
  populateScenarioCards();

  // Listen to language changes and re-render current view dynamically
  window.addEventListener("landguard_lang_changed", e => {
    updateLanguageControls(e.detail.lang);
    renderAllStaticText();
    reRenderActiveView();
  });

  // Ensure Bengali fonts are fully loaded before final layout calculation
  if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add("fonts-ready");
      if (typeof I18n !== "undefined" && I18n.getLang() === "bn") {
        reRenderActiveView();
      }
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BILINGUAL & THEME CONTROLS INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────
function initLanguageToggles() {
  const bnBtn = document.getElementById("lang-btn-bn");
  const enBtn = document.getElementById("lang-btn-en");

  if (bnBtn) {
    bnBtn.addEventListener("click", () => I18n.setLang("bn"));
  }
  if (enBtn) {
    enBtn.addEventListener("click", () => I18n.setLang("en"));
  }

  updateLanguageControls(I18n.getLang());
}

function updateLanguageControls(lang) {
  const bnBtn = document.getElementById("lang-btn-bn");
  const enBtn = document.getElementById("lang-btn-en");
  if (bnBtn) {
    bnBtn.classList.toggle("active", lang === "bn");
    bnBtn.setAttribute("aria-pressed", lang === "bn");
  }
  if (enBtn) {
    enBtn.classList.toggle("active", lang === "en");
    enBtn.setAttribute("aria-pressed", lang === "en");
  }
}

function initThemeToggles() {
  document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (typeof ThemeManager !== "undefined") ThemeManager.toggleTheme();
    });
  });
}

function renderAllStaticText() {
  // Translate all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      el.textContent = I18n.t(key);
    }
  });

  // Search input placeholders
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.placeholder = I18n.t("searchPlaceholder");

  const dashSearchInput = document.getElementById("dash-search-input");
  if (dashSearchInput) dashSearchInput.placeholder = I18n.t("heroSearchPlaceholder");

  const searchBtn = document.getElementById("search-btn");
  if (searchBtn) searchBtn.textContent = I18n.t("searchBtn");

  const dashSearchBtn = document.getElementById("dash-search-btn");
  if (dashSearchBtn) dashSearchBtn.textContent = I18n.t("searchBtn");

  // Footer year
  document.querySelectorAll("#footer-year, #disclaimer-year").forEach(el => {
    el.textContent = I18n.formatNumber(new Date().getFullYear());
  });

  // Localize empty-state scenario buttons
  const isBn = I18n.getLang() === "bn";
  document.querySelectorAll("[data-scenario-plot]").forEach(btn => {
    const pid = btn.getAttribute("data-scenario-plot");
    if (pid === "PLT-2001") btn.textContent = isBn ? "PLT-2001 (সামঞ্জস্যপূর্ণ)" : "PLT-2001 (Consistent)";
    else if (pid === "PLT-2002") btn.textContent = isBn ? "PLT-2002 (মালিকানার অমিল)" : "PLT-2002 (Mismatch)";
    else if (pid === "PLT-2003") btn.textContent = isBn ? "PLT-2003 (দ্বৈত দলিল)" : "PLT-2003 (Duplicate Deeds)";
    else if (pid === "PLT-2004") btn.textContent = isBn ? "PLT-2004 (অসম্পূর্ণ)" : "PLT-2004 (Incomplete)";
    else if (pid === "PLT-2007") btn.textContent = isBn ? "PLT-2007 (মাঝারি ঝুঁকি)" : "PLT-2007 (Medium Risk)";
  });

  // Dynamically render About page rules in active language
  renderAboutRules();
}

function reRenderActiveView() {
  populateScenarioCards();
  renderAboutRules();
  renderDashboard();

  if (App.currentPage === "plot-detail" && App.currentPlot) {
    loadPlotDetail(App.currentPlot.plotId);
  } else if (App.currentPage === "conflict-replay" && App.currentPlot) {
    loadConflictReplay(App.currentPlot.plotId);
  } else if (App.currentPage === "risk-panel" && App.currentPlot) {
    loadRiskPanel(App.currentPlot.plotId);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────
function initNavigation() {
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navigateTo(link.dataset.nav);
    });
  });
}

function navigateTo(pageId, plotId = null) {
  // Hide all pages
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  // Show target page
  const page = document.getElementById(`page-${pageId}`);
  if (page) {
    page.classList.add("active");
    App.currentPage = pageId;
  }

  // Update nav active state
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === pageId);
  });

  // Context-aware page loading
  if (pageId === "plot-detail") {
    if (plotId) {
      loadPlotDetail(plotId);
    } else if (App.currentPlot) {
      loadPlotDetail(App.currentPlot.plotId);
    }
  } else if (pageId === "conflict-replay") {
    if (plotId) {
      loadConflictReplay(plotId);
    } else if (App.currentPlot) {
      loadConflictReplay(App.currentPlot.plotId);
    }
  } else if (pageId === "risk-panel") {
    if (plotId) {
      loadRiskPanel(plotId);
    } else if (App.currentPlot) {
      loadRiskPanel(App.currentPlot.plotId);
    }
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function renderDashboard() {
  const stats = RiskEngine.computeDashboardStats(App.allPlots);

  animateCounter("stat-total", stats.totalPlots);
  animateCounter("stat-conflicts", stats.potentialConflicts);
  animateCounter("stat-incomplete", stats.incompleteRecords);
  animateCounter("stat-reviewed", stats.reviewed);

  renderQuickScenarioStrip();
  renderDashboardCharts(stats);
  renderRecentCases(stats.recent);
}

function animateCounter(elementId, targetValue) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.floor(targetValue / 15));
  const timer = setInterval(() => {
    current = Math.min(current + step, targetValue);
    el.textContent = I18n.formatNumber(current);
    if (current >= targetValue) clearInterval(timer);
  }, 50);
}

function renderQuickScenarioStrip() {
  const container = document.getElementById("quick-scenarios-strip");
  if (!container) return;

  const quickScenarios = [
    { id: "scenario-1", plotId: "PLT-2001", icon: "✅", title: I18n.t("scenario1Title"), tag: I18n.t("riskLow") },
    { id: "scenario-5", plotId: "PLT-2007", icon: "🟠", title: I18n.t("scenario5Title"), tag: I18n.t("riskMedium") },
    { id: "scenario-2", plotId: "PLT-2002", icon: "⚠️", title: I18n.t("scenario2Title"), tag: I18n.t("riskHigh") },
    { id: "scenario-3", plotId: "PLT-2003", icon: "🔴", title: I18n.t("scenario3Title"), tag: I18n.t("riskHigh") },
    { id: "scenario-4", plotId: "PLT-2004", icon: "⚪", title: I18n.t("scenario4Title"), tag: I18n.t("riskIncomplete") }
  ];

  container.innerHTML = quickScenarios.map(qs => {
    const isActive = App.currentPlot && App.currentPlot.scenarioId === qs.id;
    return `
      <button class="quick-scenario-btn ${isActive ? 'active' : ''}"
              onclick="navigateTo('conflict-replay', '${qs.plotId}')"
              aria-label="Inspect ${qs.title}">
        <div class="qs-title">
          <span>${qs.icon}</span>
          <span>${qs.plotId}</span>
          ${isActive ? `<span class="prototype-badge" style="font-size:0.65rem;padding:1px 5px;">${I18n.t("activeScenarioBadge")}</span>` : ''}
        </div>
        <div class="qs-desc">${qs.tag}</div>
      </button>
    `;
  }).join("");
}

function renderDashboardCharts(stats) {
  const container = document.getElementById("dashboard-charts-container");
  if (!container) return;

  // 1. Dynamic risk distribution calculated directly from App.allPlots using RiskEngine
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  let incompCount = 0;

  App.allPlots.forEach(p => {
    const analysis = RiskEngine.analysePlot(p);
    const rLevel = analysis.riskLevel;
    if (rLevel === "High") {
      highCount++;
    } else if (rLevel === "Medium") {
      mediumCount++;
    } else if (rLevel === "Incomplete Data") {
      incompCount++;
    } else {
      // "Low" or "No Conflict Detected"
      lowCount++;
    }
  });

  const total = App.allPlots.length;
  const circumference = 2 * Math.PI * 40; // ~251.327

  const clearStroke = total > 0 ? (lowCount / total) * circumference : 0;
  const medStroke = total > 0 ? (mediumCount / total) * circumference : 0;
  const highStroke = total > 0 ? (highCount / total) * circumference : 0;
  const incompStroke = total > 0 ? (incompCount / total) * circumference : 0;

  const lowPct = total > 0 ? Math.round((lowCount / total) * 100) : 0;
  const medPct = total > 0 ? Math.round((mediumCount / total) * 100) : 0;
  const highPct = total > 0 ? Math.round((highCount / total) * 100) : 0;
  const incompPct = total > 0 ? Math.round((incompCount / total) * 100) : 0;

  // 2. Land use counts from data
  const landUseCounts = { Residential: 0, MixedUse: 0, Commercial: 0, Agricultural: 0 };
  App.allPlots.forEach(p => {
    const lu = p.landUse ? p.landUse.toLowerCase() : "";
    if (lu.includes("residential")) landUseCounts.Residential++;
    else if (lu.includes("mixed")) landUseCounts.MixedUse++;
    else if (lu.includes("commercial")) landUseCounts.Commercial++;
    else if (lu.includes("agricultural")) landUseCounts.Agricultural++;
  });

  const luLabels = {
    Residential: I18n.getLang() === "bn" ? "আবাসিক" : "Residential",
    MixedUse: I18n.getLang() === "bn" ? "মিশ্র ব্যবহার" : "Mixed Use",
    Commercial: I18n.getLang() === "bn" ? "বাণিজ্যিক" : "Commercial",
    Agricultural: I18n.getLang() === "bn" ? "কৃষি" : "Agricultural"
  };

  container.innerHTML = `
    <!-- Donut Chart: Risk Distribution -->
    <div class="chart-card">
      <div class="chart-header">
        <span>${I18n.t("riskDistributionTitle")}</span>
        <span class="status-badge status-active">${I18n.formatNumber(total)} ${I18n.t("statTotalPlots")}</span>
      </div>
      <div class="chart-container">
        <svg class="donut-svg" viewBox="0 0 100 100" role="img" aria-label="Risk distribution chart">
          <!-- Background track -->
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--bg-muted)" stroke-width="14" />
          <!-- Clear/Low risk slice (Green) -->
          <circle class="donut-slice" cx="50" cy="50" r="40" stroke="#10b981"
                  stroke-dasharray="${clearStroke} ${circumference}"
                  stroke-dashoffset="0" />
          <!-- Medium risk slice (Amber) -->
          <circle class="donut-slice" cx="50" cy="50" r="40" stroke="#f59e0b"
                  stroke-dasharray="${medStroke} ${circumference}"
                  stroke-dashoffset="-${clearStroke}" />
          <!-- High risk slice (Red) -->
          <circle class="donut-slice" cx="50" cy="50" r="40" stroke="#ef4444"
                  stroke-dasharray="${highStroke} ${circumference}"
                  stroke-dashoffset="-${clearStroke + medStroke}" />
          <!-- Incomplete slice (Slate) -->
          <circle class="donut-slice" cx="50" cy="50" r="40" stroke="#94a3b8"
                  stroke-dasharray="${incompStroke} ${circumference}"
                  stroke-dashoffset="-${clearStroke + medStroke + highStroke}" />
        </svg>

        <div class="chart-legend">
          <div class="legend-row">
            <span style="display:flex;align-items:center;gap:0.4rem;">
              <span class="legend-color-dot" style="background:#ef4444;"></span>
              <span>${I18n.t("riskHigh")}</span>
            </span>
            <strong>${I18n.formatNumber(highCount)} (${I18n.formatNumber(highPct)}%)</strong>
          </div>
          <div class="legend-row">
            <span style="display:flex;align-items:center;gap:0.4rem;">
              <span class="legend-color-dot" style="background:#f59e0b;"></span>
              <span>${I18n.t("riskMedium")}</span>
            </span>
            <strong>${I18n.formatNumber(mediumCount)} (${I18n.formatNumber(medPct)}%)</strong>
          </div>
          <div class="legend-row">
            <span style="display:flex;align-items:center;gap:0.4rem;">
              <span class="legend-color-dot" style="background:#10b981;"></span>
              <span>${I18n.t("riskLow")}</span>
            </span>
            <strong>${I18n.formatNumber(lowCount)} (${I18n.formatNumber(lowPct)}%)</strong>
          </div>
          ${incompCount > 0 ? `
          <div class="legend-row">
            <span style="display:flex;align-items:center;gap:0.4rem;">
              <span class="legend-color-dot" style="background:#94a3b8;"></span>
              <span>${I18n.t("riskIncomplete")}</span>
            </span>
            <strong>${I18n.formatNumber(incompCount)} (${I18n.formatNumber(incompPct)}%)</strong>
          </div>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- Bar Chart: Land Classification -->
    <div class="chart-card">
      <div class="chart-header">
        <span>${I18n.t("landUseBreakdownTitle")}</span>
      </div>
      <div class="bar-chart-container">
        ${Object.keys(landUseCounts).map(k => {
          const count = landUseCounts[k];
          const pct = Math.round((count / total) * 100);
          return `
            <div class="bar-row">
              <div class="bar-label-group">
                <span>${luLabels[k]}</span>
                <strong>${I18n.formatNumber(count)} (${I18n.formatNumber(pct)}%)</strong>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderRecentCases(cases) {
  const container = document.getElementById("recent-cases");
  if (!container) return;

  container.innerHTML = cases.map(c => `
    <div class="case-row" role="button" tabindex="0"
         onclick="navigateTo('plot-detail', '${c.plotId}')"
         onkeydown="if(event.key==='Enter'){navigateTo('plot-detail', '${c.plotId}')}"
         aria-label="${c.plotId}, ${translateRiskLevel(c.riskLevel)}">
      <div class="case-id">
        <span class="plot-badge">${c.plotId}</span>
      </div>
      <div class="case-location">${I18n.translateLocation(c.location)}</div>
      <div class="case-scenario">${translateScenarioLabel(c.scenarioLabel)}</div>
      <div class="case-risk">
        <span class="risk-badge risk-${riskClass(c.riskLevel)}">${translateRiskLevel(c.riskLevel)}</span>
      </div>
      <div class="case-action">
        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation();navigateTo('conflict-replay', '${c.plotId}')">
          ${I18n.t("actionReplay")}
        </button>
      </div>
    </div>
  `).join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById("search-input");
  const btn = document.getElementById("search-btn");
  const dashInput = document.getElementById("dash-search-input");
  const dashBtn = document.getElementById("dash-search-btn");

  if (btn) btn.addEventListener("click", () => doSearch(input ? input.value : ""));
  if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(input.value); });

  if (dashBtn) dashBtn.addEventListener("click", () => doSearch(dashInput ? dashInput.value : ""));
  if (dashInput) dashInput.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(dashInput.value); });

  // Live suggestions
  if (input) {
    input.addEventListener("input", () => {
      const val = input.value.trim().toUpperCase();
      const suggestions = document.getElementById("search-suggestions");
      if (!suggestions) return;
      if (val.length < 2) { suggestions.innerHTML = ""; return; }
      const matches = App.allPlots.filter(p => p.plotId.toUpperCase().includes(val));
      suggestions.innerHTML = matches.slice(0, 5).map(p =>
        `<div class="suggestion-item" tabindex="0" role="option"
              onclick="selectSuggestion('${p.plotId}')"
              onkeydown="if(event.key==='Enter'){selectSuggestion('${p.plotId}')}">
          <strong>${p.plotId}</strong> — ${I18n.translateLocation(p.location)}
        </div>`
      ).join("");
    });
  }

  // Dismiss suggestions dropdown when clicking outside
  document.addEventListener("click", e => {
    const searchContainer = document.querySelector(".header-search");
    const suggestions = document.getElementById("search-suggestions");
    if (suggestions && searchContainer && !searchContainer.contains(e.target)) {
      suggestions.innerHTML = "";
    }
  });
}

function selectSuggestion(plotId) {
  const searchInput = document.getElementById("search-input");
  const suggestions = document.getElementById("search-suggestions");
  if (searchInput) searchInput.value = plotId;
  if (suggestions) suggestions.innerHTML = "";
  doSearch(plotId);
}

function doSearch(val) {
  const id = val ? val.trim().toUpperCase() : "";
  if (!id) return;
  const plot = App.allPlots.find(p => p.plotId.toUpperCase() === id);
  navigateTo("plot-detail");
  if (plot) {
    loadPlotDetail(plot.plotId);
  } else {
    showNotFound(id);
  }
}

function showNotFound(id) {
  const container = document.getElementById("plot-detail-content");
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon" aria-hidden="true">🔍</div>
      <h2>${I18n.t("plotNotFoundTitle")}</h2>
      <p>${I18n.t("plotNotFoundDesc")} <strong>${escapeHtml(id)}</strong></p>
      <p>${I18n.t("plotNotFoundSuggestions")} <strong>PLT-2001, PLT-2002, PLT-2003, PLT-2004, PLT-2005, PLT-2006, PLT-2007</strong></p>
      <button class="btn btn-primary" onclick="navigateTo('scenarios')">${I18n.t("browseAllScenariosBtn")}</button>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLOT DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────────────
function loadPlotDetail(plotId) {
  const plot = App.allPlots.find(p => p.plotId === plotId);
  const container = document.getElementById("plot-detail-content");
  if (!container) return;

  if (!plot) { showNotFound(plotId); return; }

  App.currentPlot = plot;
  App.currentAnalysis = RiskEngine.analysePlot(plot);

  container.innerHTML = `
    ${renderPlotHeader(plot, App.currentAnalysis)}
    ${renderPlotOverview(plot)}
    ${renderDeedRecords(plot)}
    ${renderMutationRecords(plot)}
    ${renderTransferHistory(plot)}
    <div class="detail-action-bar">
      <button class="btn btn-primary btn-lg" onclick="navigateTo('conflict-replay', '${plot.plotId}')">
        ${I18n.t("btnViewConflictReplay")}
      </button>
      <button class="btn btn-outline btn-lg" onclick="navigateTo('risk-panel', '${plot.plotId}')">
        ${I18n.t("btnViewRiskPanel")}
      </button>
    </div>
  `;
}

function renderPlotHeader(plot, analysis) {
  return `
    <div class="plot-header">
      <div class="plot-header-left">
        <div class="breadcrumb">
          <span onclick="navigateTo('dashboard')" style="cursor:pointer;color:var(--teal)">${I18n.t("navDashboard")}</span>
          <span> / ${I18n.t("navPlotDetail")}</span>
        </div>
        <h1 class="plot-title">${plot.plotId}</h1>
        <p class="plot-subtitle">${I18n.translateLocation(plot.location)}</p>
      </div>
      <div class="plot-header-right">
        <div class="risk-summary-badge risk-${riskClass(analysis.riskLevel)}">
          <div class="risk-label">${I18n.t("scoreGaugeLabel")}</div>
          <div class="risk-value">${translateRiskLevel(analysis.riskLevel)}</div>
          <div class="risk-score">${I18n.formatNumber(analysis.score)} / ${I18n.formatNumber(analysis.scoreMax)}</div>
        </div>
      </div>
    </div>
  `;
}

function renderPlotOverview(plot) {
  const isBn = I18n.getLang() === "bn";
  const loc = I18n.translateLocation(plot.location);
  const area = plot.area ? I18n.translateArea(plot.area) : `<em class='missing'>${isBn ? 'রেকর্ড নেই' : 'Not recorded'}</em>`;
  const owner = I18n.translateOwner(plot.currentOwner);
  const desc = I18n.translatePlotDescription(plot.plotId, plot.description);
  const missing = (plot.missingFields || []).map(f => I18n.translateMissingField(f));

  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${I18n.t("plotOverviewTitle")}</h2>
        <span class="status-badge status-${plot.status.toLowerCase().replace(/\s|\//g,'-')}">${translateStatus(plot.status)}</span>
      </div>
      <div class="info-grid">
        ${infoRow(I18n.t("fieldPlotId"), plot.plotId)}
        ${infoRow(I18n.t("fieldLocation"), loc)}
        ${infoRow(I18n.t("fieldArea"), area)}
        ${infoRow(I18n.t("fieldLandUse"), translateLandUse(plot.landUse))}
        ${infoRow(I18n.t("fieldRegDate"), I18n.formatDate(plot.registrationDate))}
        ${infoRow(I18n.t("fieldCurrentOwner"), owner)}
        ${infoRow(I18n.t("fieldCompleteness"), `<span class="completeness-badge completeness-${plot.dataCompleteness.toLowerCase().replace(" ","-")}">${translateCompleteness(plot.dataCompleteness)}</span>`)}
        ${infoRow(I18n.t("fieldScenario"), translateScenarioLabel(plot.scenarioLabel))}
      </div>
      ${desc ? `<p class="plot-description">${desc}</p>` : ""}
      ${missing.length > 0 ? `
        <div class="missing-fields-box">
          <strong>⚠ ${I18n.t("missingFieldsAlert")}</strong>
          <ul>${missing.map(f => `<li>${f}</li>`).join("")}</ul>
        </div>` : ""}
    </div>
  `;
}

function renderDeedRecords(plot) {
  const isBn = I18n.getLang() === "bn";
  if (plot.deeds.length === 0) {
    return `<div class="card"><div class="card-header"><h2 class="card-title">${I18n.t("deedRecordsTitle")}</h2></div>
      <div class="empty-state-inline">${I18n.t("noDeedsFound")}</div></div>`;
  }

  const rows = plot.deeds.map(d => `
    <div class="record-card ${d.status === 'Active' && plot.deeds.filter(x=>x.status==='Active').length > 1 ? 'record-card--conflict' : ''}">
      <div class="record-card-header">
        <span class="record-id">${d.deedId}</span>
        <span class="deed-status-badge deed-${d.status.toLowerCase().replace(" ","-")}">${translateStatus(d.status)}</span>
        ${d.status === 'Active' && plot.deeds.filter(x=>x.status==='Active').length > 1
          ? `<span class="conflict-flag" title="Multiple active deeds detected">⚠ ${isBn ? 'দ্বৈত সক্রিয় দলিল' : 'Duplicate Active Deed'}</span>` : ''}
      </div>
      <div class="info-grid">
        ${infoRow(I18n.t("fieldCurrentOwner"), `<strong>${escapeHtml(d.registeredOwner)}</strong>`)}
        ${infoRow(I18n.t("fieldDeedType"), I18n.translateDeedType(d.deedType))}
        ${infoRow(I18n.t("fieldRegDate"), I18n.formatDate(d.registrationDate))}
        ${infoRow(I18n.t("fieldDeedOffice"), I18n.translateDeedOffice(d.registrationOffice))}
        ${infoRow(I18n.t("fieldConsideration"), d.considerationAmount ? I18n.formatCurrency(d.considerationAmount) : `<em class="missing">${isBn ? 'রেকর্ড নেই' : 'Not recorded'}</em>`)}
        ${infoRow(I18n.t("fieldWitness"), d.witnessName || `<em class="missing">${isBn ? 'রেকর্ড নেই' : 'Not recorded'}</em>`)}
        ${infoRow(I18n.t("fieldVerification"), `<span class="verify-badge verify-${(d.verificationStatus||'').toLowerCase().replace(" ","-")}">${translateVerification(d.verificationStatus)}</span>`)}
      </div>
    </div>
  `).join("");

  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${I18n.t("deedRecordsTitle")} <span class="count-badge">${I18n.formatNumber(plot.deeds.length)}</span></h2>
      </div>
      ${rows}
    </div>
  `;
}

function renderMutationRecords(plot) {
  const isBn = I18n.getLang() === "bn";
  if (plot.mutations.length === 0) {
    return `<div class="card">
      <div class="card-header"><h2 class="card-title">${I18n.t("mutationRecordsTitle")}</h2></div>
      <div class="missing-fields-box">
        <strong>⚠ ${I18n.t("noMutationsFound")}</strong>
      </div>
    </div>`;
  }

  const rows = plot.mutations.map(m => `
    <div class="record-card">
      <div class="record-card-header">
        <span class="record-id">${m.mutationId}</span>
        <span class="mutation-status-badge mutation-${m.status.toLowerCase()}">${translateStatus(m.status)}</span>
      </div>
      <div class="info-grid">
        ${infoRow(I18n.t("fieldRecordedOwner"), `<strong>${escapeHtml(m.recordedOwner)}</strong>`)}
        ${infoRow(I18n.t("fieldPreviousOwner"), escapeHtml(m.previousOwner || (isBn ? 'রেকর্ড নেই' : 'Not recorded')))}
        ${infoRow(I18n.t("fieldMutationDate"), I18n.formatDate(m.mutationDate))}
        ${infoRow(I18n.t("fieldMutationReason"), I18n.translateMutationReason(m.mutationReason))}
        ${infoRow(I18n.t("fieldApprovedBy"), escapeHtml(I18n.translateApprovedBy(m.approvedBy) || (isBn ? 'রেকর্ড নেই' : 'Not recorded')))}
        ${infoRow(I18n.t("fieldMutationStatus"), translateStatus(m.status))}
      </div>
    </div>
  `).join("");

  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${I18n.t("mutationRecordsTitle")} <span class="count-badge">${I18n.formatNumber(plot.mutations.length)}</span></h2>
      </div>
      ${rows}
    </div>
  `;
}

function renderTransferHistory(plot) {
  const isBn = I18n.getLang() === "bn";
  if (plot.transferHistory.length === 0) {
    return `<div class="card"><div class="card-header"><h2 class="card-title">${I18n.t("transferHistoryTitle")}</h2></div>
      <div class="empty-state-inline">${I18n.t("noTransfersFound")}</div></div>`;
  }

  const timelineItems = plot.transferHistory.map((t, i) => `
    <div class="timeline-item ${(!t.deedRef || !t.mutationRef) ? 'timeline-item--warning' : ''}">
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span class="timeline-id">${t.transferId}</span>
          <span class="timeline-date">${I18n.formatDate(t.date)}</span>
          <span class="transfer-type-badge">${I18n.translateTransferType(t.transferType)}</span>
        </div>
        <div class="timeline-parties">
          <span class="from-owner">${t.fromOwner ? I18n.translateOwner(t.fromOwner) : `<em>${isBn ? 'রেকর্ড নেই' : 'Not recorded'}</em>`}</span>
          <span class="arrow" aria-hidden="true"> → </span>
          <span class="to-owner"><strong>${escapeHtml(t.toOwner)}</strong></span>
        </div>
        <div class="timeline-refs">
          ${t.deedRef ? `<span class="ref-badge ref-deed">${isBn ? 'দলিল' : 'Deed'}: ${t.deedRef}</span>` : `<span class="ref-badge ref-missing">${isBn ? 'দলিলের তথ্যসূত্র অনুপস্থিত' : 'No deed reference'}</span>`}
          ${t.mutationRef ? `<span class="ref-badge ref-mutation">${isBn ? 'নামজারি' : 'Mutation'}: ${t.mutationRef}</span>` : `<span class="ref-badge ref-missing">${isBn ? 'নামজারির তথ্যসূত্র অনুপস্থিত' : 'No mutation ref'}</span>`}
        </div>
        ${t.notes ? `<p class="timeline-notes">${escapeHtml(I18n.translateTransferNote(t.notes, t.transferId))}</p>` : ""}
      </div>
    </div>
  `).join("");

  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${I18n.t("transferHistoryTitle")}</h2>
      </div>
      <div class="timeline">${timelineItems}</div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFLICT REPLAY PAGE (CENTRAL DIFFERENTIATOR UPGRADE)
// ─────────────────────────────────────────────────────────────────────────────
function loadConflictReplay(plotId) {
  const plot = App.allPlots.find(p => p.plotId === plotId);
  const container = document.getElementById("conflict-replay-content");
  if (!container || !plot) return;

  App.currentPlot = plot;
  App.currentAnalysis = RiskEngine.analysePlot(plot);
  const analysis = App.currentAnalysis;

  const nextPlotId = getNextScenarioPlotId(plot.plotId);

  container.innerHTML = `
    <div class="replay-header">
      <div>
        <div class="breadcrumb">
          <span onclick="navigateTo('dashboard')" style="cursor:pointer;color:var(--teal)">${I18n.t("navDashboard")}</span>
          <span> / </span>
          <span onclick="navigateTo('plot-detail', '${plot.plotId}')" style="cursor:pointer;color:var(--teal)">${plot.plotId}</span>
          <span> / ${I18n.t("navConflictReplay")}</span>
        </div>
        <h1>${I18n.t("conflictReplayTitle")} — ${plot.plotId}</h1>
        <p class="subtitle">${I18n.translateLocation(plot.location)}</p>
      </div>
      <div class="risk-summary-badge risk-${riskClass(analysis.riskLevel)} risk-badge-lg">
        <div class="risk-label">${I18n.t("scoreGaugeLabel")}</div>
        <div class="risk-value">${translateRiskLevel(analysis.riskLevel)}</div>
        <div class="risk-score">${I18n.formatNumber(analysis.score)} / ${I18n.formatNumber(100)}</div>
      </div>
    </div>

    <div class="inference-notice">
      ${I18n.t("inferenceNotice")}
    </div>

    ${renderOwnerComparisonTable(plot, analysis)}
    ${renderConflictTimeline(plot, analysis)}
    ${renderTriggeredRules(analysis)}
    ${renderRelationshipGraph(plot)}

    <div class="detail-action-bar" style="justify-content: space-between; align-items: center;">
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="navigateTo('risk-panel', '${plot.plotId}')">
          ${I18n.t("btnViewRiskPanel")}
        </button>
        <button class="btn btn-outline" onclick="navigateTo('plot-detail', '${plot.plotId}')">
          ${I18n.t("btnBackToPlotDetail")}
        </button>
      </div>
      <button class="btn btn-outline" style="border-color:var(--teal);color:var(--teal);" onclick="loadConflictReplay('${nextPlotId}')">
        ${I18n.t("btnNextScenario")} (${nextPlotId})
      </button>
    </div>
  `;
}

function getNextScenarioPlotId(currentPlotId) {
  const sequence = ["PLT-2001", "PLT-2007", "PLT-2002", "PLT-2003", "PLT-2004", "PLT-2005", "PLT-2006"];
  const idx = sequence.indexOf(currentPlotId);
  if (idx === -1 || idx === sequence.length - 1) return sequence[0];
  return sequence[idx + 1];
}

function renderOwnerComparisonTable(plot, analysis) {
  const ownerMismatchEvidence = analysis.evidence.find(e => e.rule === "RULE-01");
  const dupDeedEvidence = analysis.evidence.find(e => e.rule === "RULE-02");

  const activeDeeds = plot.deeds.filter(d => d.status === "Active");
  const latestMutation = plot.mutations.length > 0 ? plot.mutations[plot.mutations.length - 1] : null;

  if (activeDeeds.length === 0 && !latestMutation) {
    return `<div class="card"><div class="card-header"><h2 class="card-title">${I18n.t("recordComparisonTitle")}</h2></div>
      <div class="empty-state-inline">${I18n.t("noDeedsFound")}</div></div>`;
  }

  const deedOwner = activeDeeds.length > 0 ? activeDeeds[0].registeredOwner : null;
  const mutOwner = latestMutation ? latestMutation.recordedOwner : null;

  const ownerMismatch = deedOwner && mutOwner &&
    deedOwner.trim().toLowerCase() !== mutOwner.trim().toLowerCase();

  let rows = `
    <tr>
      <td class="field-name">${I18n.t("fieldCurrentOwner")}</td>
      <td class="${ownerMismatch ? 'cell-mismatch' : 'cell-match'}">
        ${deedOwner ? `<strong>${escapeHtml(deedOwner)}</strong>` : `<em class="missing">${I18n.getLang() === 'bn' ? 'সক্রিয় দলিল নেই' : 'No active deed'}</em>`}
        ${activeDeeds.length > 1 ? `<span class="conflict-flag">+${I18n.formatNumber(activeDeeds.length-1)} ${I18n.getLang() === 'bn' ? 'টি দলিল' : 'more'}</span>` : ""}
      </td>
      <td class="${ownerMismatch ? 'cell-mismatch' : 'cell-match'}">
        ${mutOwner ? `<strong>${escapeHtml(mutOwner)}</strong>` : `<em class="missing">${I18n.getLang() === 'bn' ? 'নামজারি নেই' : 'No mutation'}</em>`}
      </td>
      <td>
        ${ownerMismatch
          ? `<span class="mismatch-indicator">⚠ ${I18n.getLang() === 'bn' ? 'মালিকানা নামের গরমিল (RULE-01)' : 'Names differ — RULE-01'}</span>`
          : deedOwner && mutOwner
            ? `<span class="match-indicator">✓ ${I18n.getLang() === 'bn' ? 'মালিকের নাম মিল রয়েছে' : 'Names match'}</span>`
            : `<span class="incomplete-indicator">⚪ ${I18n.t("riskIncomplete")}</span>`}
      </td>
    </tr>
  `;

  rows += `
    <tr>
      <td class="field-name">${I18n.getLang() === 'bn' ? 'সক্রিয় দলিলের সংখ্যা' : 'Active Deed Count'}</td>
      <td colspan="2" class="${dupDeedEvidence ? 'cell-mismatch' : 'cell-match'}">
        ${I18n.formatNumber(activeDeeds.length)} ${I18n.getLang() === 'bn' ? 'টি সক্রিয় দলিল' : 'active deed(s)'}: ${activeDeeds.map(d => d.deedId).join(", ") || (I18n.getLang() === 'bn' ? 'নেই' : 'None')}
      </td>
      <td>
        ${dupDeedEvidence
          ? `<span class="mismatch-indicator">⚠ ${I18n.getLang() === 'bn' ? 'দ্বৈত সক্রিয় দলিল শনাক্ত' : 'Duplicate active deeds'}</span>`
          : `<span class="match-indicator">✓ ${I18n.getLang() === 'bn' ? 'একক সক্রিয় দলিল' : 'Single active deed'}</span>`}
      </td>
    </tr>
  `;

  rows += `
    <tr>
      <td class="field-name">${I18n.t("mutationRecordsTitle")}</td>
      <td colspan="2" class="${plot.mutations.length === 0 ? 'cell-warning' : 'cell-match'}">
        ${plot.mutations.length > 0
          ? plot.mutations.map(m => `${m.mutationId} (${translateStatus(m.status)})`).join(", ")
          : `<em class='missing'>${I18n.t("noMutationsFound")}</em>`}
      </td>
      <td>
        ${plot.mutations.length === 0
          ? `<span class="mismatch-indicator">⚠ ${I18n.getLang() === 'bn' ? 'নামজারি খতিয়ান অনুপস্থিত' : 'Missing mutation'}</span>`
          : `<span class="match-indicator">✓ ${I18n.getLang() === 'bn' ? 'নথিভুক্ত আছে' : 'Present'}</span>`}
      </td>
    </tr>
  `;

  rows += `
    <tr>
      <td class="field-name">${I18n.t("fieldVerification")}</td>
      <td colspan="2">
        ${plot.deeds.map(d => `${d.deedId}: ${translateVerification(d.verificationStatus)}`).join(" | ") || `<em class='missing'>${I18n.t("noDeedsFound")}</em>`}
      </td>
      <td>
        ${plot.deeds.some(d => d.verificationStatus !== "Verified")
          ? `<span class="mismatch-indicator">⚠ ${I18n.getLang() === 'bn' ? 'অযাচাইকৃত দলিল বিদ্যমান' : 'Unverified deed(s)'}</span>`
          : `<span class="match-indicator">✓ ${I18n.getLang() === 'bn' ? 'সকল দলিল যাচাইকৃত' : 'All verified'}</span>`}
      </td>
    </tr>
  `;

  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${I18n.t("recordComparisonTitle")}</h2>
        <span class="card-subtitle">${I18n.t("recordComparisonSub")}</span>
      </div>
      <div class="table-wrapper">
        <table class="comparison-table" role="table" aria-label="Record comparison table">
          <thead>
            <tr>
              <th>${I18n.t("colAction")}</th>
              <th>${I18n.t("colDeedRecord")}</th>
              <th>${I18n.t("colMutationRecord")}</th>
              <th>${I18n.t("colAssessment")}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${ownerMismatch ? `
        <div class="conflict-callout conflict-callout--high">
          <strong>⚠ ${I18n.t("mismatchOwnerAlert")}</strong>
        </div>` : ""}
      ${dupDeedEvidence ? `
        <div class="conflict-callout conflict-callout--high">
          <strong>⚠ ${I18n.t("duplicateDeedAlert")}</strong>
        </div>` : ""}
    </div>
  `;
}

function renderConflictTimeline(plot, analysis) {
  const isBn = I18n.getLang() === "bn";
  const events = [];

  plot.deeds.forEach(d => {
    const deedType = I18n.translateDeedType(d.deedType);
    const office = I18n.translateDeedOffice(d.registrationOffice);
    events.push({
      date: d.registrationDate,
      type: "deed",
      label: `${isBn ? 'দলিল রেজিস্ট্রেশন' : 'Deed Registered'}: ${d.deedId}`,
      detail: `${isBn ? 'মালিক' : 'Owner'}: ${d.registeredOwner} | ${deedType} | ${office}`,
      status: d.status,
      conflict: analysis.evidence.some(e => e.rule === "RULE-02") && d.status === "Active" && plot.deeds.filter(x=>x.status==="Active").length > 1
    });
  });

  plot.mutations.forEach(m => {
    const reason = I18n.translateMutationReason(m.mutationReason);
    const approved = I18n.translateApprovedBy(m.approvedBy);
    events.push({
      date: m.mutationDate,
      type: "mutation",
      label: `${isBn ? 'নামজারি সম্পন্ন' : 'Mutation Recorded'}: ${m.mutationId}`,
      detail: `${isBn ? 'মালিক' : 'Owner'}: ${m.recordedOwner} | ${reason} | ${approved}`,
      status: m.status,
      conflict: analysis.evidence.some(e => e.rule === "RULE-01")
    });
  });

  plot.encumbrances.forEach(enc => {
    const encTr = I18n.translateEncumbrance(enc);
    events.push({
      date: enc.raisedDate,
      type: "encumbrance",
      label: `${isBn ? 'দায় বা বিরোধ সতর্কতা' : 'Encumbrance'}: ${encTr.type}`,
      detail: `${encTr.raisedBy} | ${encTr.notes}`,
      status: "Alert",
      conflict: true
    });
  });

  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  const items = events.map(ev => `
    <div class="replay-timeline-item replay-timeline-item--${ev.type} ${ev.conflict ? 'replay-timeline-item--conflict' : ''}">
      <div class="rtp-dot" aria-hidden="true"></div>
      <div class="rtp-content">
        <div class="rtp-header">
          <span class="rtp-date">${I18n.formatDate(ev.date)}</span>
          <span class="rtp-type-badge rtp-type-${ev.type}">${isBn ? (ev.type === 'deed' ? 'দলিল' : ev.type === 'mutation' ? 'নামজারি' : 'সতর্কতা') : ev.type.toUpperCase()}</span>
          ${ev.conflict ? `<span class="conflict-marker" title="Potential conflict indicator">⚠ ${isBn ? 'অসংগতি সূচক' : 'Conflict Indicator'}</span>` : ''}
        </div>
        <div class="rtp-label">${ev.label}</div>
        <div class="rtp-detail">${ev.detail}</div>
      </div>
    </div>
  `).join("");

  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${I18n.t("timelineTitle")}</h2>
      </div>
      <div class="replay-timeline">
        ${items.length > 0 ? items : `<div class="empty-state-inline">${I18n.t("noTransfersFound")}</div>`}
      </div>
    </div>
  `;
}

function renderTriggeredRules(analysis) {
  const isBn = I18n.getLang() === "bn";
  if (analysis.triggeredRules.length === 0) {
    const passedChecks = isBn ? [
      { title: "মালিকানা সামঞ্জস্যতা", desc: "দলিলের নিবন্ধিত ক্রেতা/মালিকের নামের সাথে নামজারি রেকর্ডের মালিকের নাম সম্পূর্ণ মিলে গেছে।" },
      { title: "একক সক্রিয় দলিল", desc: "এই প্লটের বিপরীতে শুধুমাত্র একটি কার্যকর দলিল নিবন্ধিত রয়েছে (কোনো দ্বৈত দলিল নেই)।" },
      { title: "নামজারি খতিয়ান অনুমোদন", desc: "রাজস্ব কর্তৃপক্ষ কর্তৃক নামজারি জমা-খারিজ আনুষ্ঠানিকভাবে অনুমোদিত ও হালনাগাদ।" },
      { title: "হস্তান্তর ইতিহাসের ধারাবাহিকতা", desc: "ঐতিহাসিক হস্তান্তরের সমস্ত রেকর্ডে দলিল ও নামজারির স্পষ্ট যোগসূত্র সংরক্ষিত আছে।" },
      { title: "তথ্যের পূর্ণাঙ্গতা", desc: "জমির পরিমাণ, সাব-রেজিস্ট্রি অফিস এবং দলিলের মূল্যের মতো আবশ্যক ক্ষেত্রসমূহ সম্পূর্ণ।" },
      { title: "কালানুক্রমিক সঠিকতা", desc: "মালিকানা হস্তান্তর ও রেজিস্ট্রেশনের তারিখসমূহ সঠিক কালানুক্রমিক ধারাবাহিকতা মেনে চলেছে।" }
    ] : [
      { title: "Owner Consistency", desc: "Deed registered owner matches mutation recorded owner without discrepancy." },
      { title: "Active Deed Singularity", desc: "Only one active deed is registered for this parcel (no duplicate active deeds detected)." },
      { title: "Mutation Record Approval", desc: "Mutation is officially approved by the relevant land revenue authority." },
      { title: "Transfer History Linkage", desc: "All historical transfer records have verified deed and mutation cross-references." },
      { title: "Data Completeness", desc: "Critical attributes including plot area, registration office, and consideration amount are complete." },
      { title: "Chronological Validity", desc: "Historical transfers and deed registration dates follow a valid chronological sequence." }
    ];

    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">${I18n.t("allClearTitle")} (${I18n.formatNumber(6)}/${I18n.formatNumber(6)} ${isBn ? 'উত্তীর্ণ' : 'Passed'})</h2>
          <span class="status-badge status-active">${isBn ? 'সকল পরীক্ষায় উত্তীর্ণ' : 'ALL CHECKS PASSED'}</span>
        </div>
        <div class="all-clear" style="margin-bottom: 1rem;">
          <span class="all-clear-icon" aria-hidden="true">✓</span>
          <p style="font-size: 1.05rem; font-weight: 600; color: var(--risk-clear); margin:0;">
            ${I18n.t("allClearDesc")}
          </p>
        </div>
        <div class="passed-checks-list" style="display: grid; gap: 0.6rem; margin-top: 0.75rem;">
          ${passedChecks.map(c => `
            <div class="passed-check-item" style="display:flex; align-items:flex-start; gap:0.6rem; padding: 0.65rem 0.85rem; background: var(--bg-muted); border-radius: var(--radius-sm); border-left: 3px solid var(--risk-clear);">
              <span style="color: var(--risk-clear); font-weight: 700;">✓</span>
              <div><strong>${c.title}:</strong> ${c.desc}</div>
            </div>
          `).join("")}
        </div>
        <div class="all-clear-note" style="margin-top: 1rem; padding: 0.75rem 1rem; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.88rem; color: var(--text-secondary);">
          <strong>${isBn ? 'সতর্কতা:' : 'Note:'}</strong> ${I18n.t("allClearNote")}
        </div>
      </div>
    `;
  }

  const ruleCards = analysis.evidence.map(ev => {
    const rule = RiskEngine.RULES[ev.rule];
    const ruleName = isBn && rule.nameBn ? rule.nameBn : rule.name;
    const ruleDesc = isBn && rule.descriptionBn ? rule.descriptionBn : rule.description;
    const points = ev.rule === "RULE-07" ? (ev.pointsAdded || rule.points) : rule.points;
    const detail = isBn && ev.detailBn ? ev.detailBn : I18n.translateEvidenceDetail(ev);
    const sev = I18n.translateSeverity(rule.severity);

    return `
      <div class="rule-card rule-card--${rule.severity.toLowerCase()}">
        <div class="rule-card-header">
          <span class="rule-id-badge">${rule.id}</span>
          <span class="rule-name">${ruleName}</span>
          <span class="rule-severity rule-severity--${rule.severity.toLowerCase()}">${sev}</span>
          <span class="rule-points">+${I18n.formatNumber(points)} ${isBn ? 'স্কোর' : 'pts'}</span>
        </div>
        <p class="rule-description">${ruleDesc}</p>
        <div class="rule-evidence">
          <strong>${isBn ? 'পর্যবেক্ষিত প্রমাণ:' : 'Evidence from demo data:'}</strong>
          <p>${escapeHtml(detail)}</p>
          ${ev.deedValue ? `<div class="evidence-row"><span class="evidence-label">${isBn ? 'দলিল রেকর্ডে:' : 'Deed record shows:'}</span> <span class="evidence-value evidence-conflict">${escapeHtml(ev.deedValue)}</span></div>` : ""}
          ${ev.mutationValue ? `<div class="evidence-row"><span class="evidence-label">${isBn ? 'নামজারি রেকর্ডে:' : 'Mutation record shows:'}</span> <span class="evidence-value evidence-conflict">${escapeHtml(ev.mutationValue)}</span></div>` : ""}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${I18n.t("rulesTriggeredTitle")} (${I18n.formatNumber(analysis.triggeredRules.length)})</h2>
        <span class="score-display">${I18n.t("scoreGaugeLabel")}: <strong>${I18n.formatNumber(analysis.score)} / ${I18n.formatNumber(100)}</strong></span>
      </div>
      ${ruleCards}
    </div>
  `;
}

function renderRelationshipGraph(plot) {
  const owners = new Set();
  plot.transferHistory.forEach(t => {
    if (t.fromOwner) owners.add(t.fromOwner);
    if (t.toOwner) owners.add(t.toOwner);
  });

  if (owners.size === 0) {
    return `<div class="card"><div class="card-header"><h2 class="card-title">${I18n.t("relationshipTitle")}</h2></div>
      <div class="empty-state-inline">${I18n.t("noTransfersFound")}</div></div>`;
  }

  const nodes = Array.from(owners);
  const links = plot.transferHistory.map(t => ({
    from: t.fromOwner, to: t.toOwner, type: t.transferType,
    conflict: !t.deedRef || !t.mutationRef
  }));

  const nodeBoxes = nodes.map(name => {
    const isConflicted = plot.currentOwner === "Disputed" && (name === "Disputed" || links.some(l => l.to === name && l.conflict));
    return `
      <div class="graph-node ${name === "Unknown / Not Recorded" ? 'graph-node--unknown' : ''} ${isConflicted ? 'graph-node--conflict' : ''}">
        <div class="graph-node-icon" aria-hidden="true">👤</div>
        <div class="graph-node-name">${escapeHtml(I18n.translateOwner(name))}</div>
      </div>
    `;
  }).join('<div class="graph-arrow" aria-hidden="true">→</div>');

  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${I18n.t("relationshipTitle")}</h2>
        <span class="card-subtitle">${I18n.t("relationshipSub")}</span>
      </div>
      <div class="graph-container" role="img" aria-label="Ownership chain diagram">
        ${nodeBoxes}
      </div>
      <div class="graph-legend">
        <span class="legend-item"><span class="graph-node-sample"></span> ${I18n.t("relationshipLegendOwner")}</span>
        <span class="legend-item"><span class="graph-node-sample graph-node-sample--conflict"></span> ${I18n.t("relationshipLegendConflict")}</span>
        <span class="legend-item"><span class="graph-node-sample graph-node-sample--unknown"></span> ${I18n.t("relationshipLegendUnknown")}</span>
      </div>
      <p class="graph-disclaimer">${I18n.t("relationshipDisclaimer")}</p>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// RISK PANEL PAGE
// ─────────────────────────────────────────────────────────────────────────────
function loadRiskPanel(plotId) {
  const plot = App.allPlots.find(p => p.plotId === plotId);
  const container = document.getElementById("risk-panel-content");
  if (!container || !plot) return;

  App.currentPlot = plot;
  App.currentAnalysis = RiskEngine.analysePlot(plot);
  const analysis = App.currentAnalysis;

  container.innerHTML = `
    <div class="replay-header">
      <div>
        <div class="breadcrumb">
          <span onclick="navigateTo('dashboard')" style="cursor:pointer;color:var(--teal)">${I18n.t("navDashboard")}</span>
          <span> / </span>
          <span onclick="navigateTo('plot-detail', '${plot.plotId}')" style="cursor:pointer;color:var(--teal)">${plot.plotId}</span>
          <span> / ${I18n.t("navRiskPanel")}</span>
        </div>
        <h1>${I18n.t("riskExplanationTitle")} — ${plot.plotId}</h1>
      </div>
    </div>

    ${renderRiskSummaryCard(analysis, plot)}
    ${renderScoreBreakdown(analysis)}
    ${renderMissingInfo(analysis)}
    ${renderNextSteps(analysis)}
    ${renderAllRulesReference()}

    <div class="detail-action-bar">
      <button class="btn btn-outline" onclick="navigateTo('conflict-replay', '${plot.plotId}')">
        ${I18n.t("btnBackToReplay")}
      </button>
    </div>
  `;
}

function renderRiskSummaryCard(analysis, plot) {
  return `
    <div class="card risk-summary-card risk-summary-card--${riskClass(analysis.riskLevel)}">
      <div class="risk-summary-main">
        <div class="risk-level-display">
          <div class="risk-level-icon" aria-hidden="true">${riskIcon(analysis.riskLevel)}</div>
          <div>
            <div class="risk-level-label">${I18n.t("colRiskLevel")}</div>
            <div class="risk-level-value">${translateRiskLevel(analysis.riskLevel)}</div>
          </div>
        </div>
        <div class="score-gauge">
          <div class="score-gauge-label">${I18n.t("scoreGaugeLabel")}</div>
          <div class="score-gauge-bar">
            <div class="score-gauge-fill" style="width: ${analysis.score}%; background: ${gaugeColor(analysis.score)}" role="progressbar" aria-valuenow="${analysis.score}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <div class="score-gauge-value">${I18n.formatNumber(analysis.score)} / ${I18n.formatNumber(100)}</div>
        </div>
      </div>
      <div class="risk-summary-meta">
        <span>${I18n.t("fieldCurrentOwner")}: <strong>${plot ? escapeHtml(I18n.translateOwner(plot.currentOwner)) : ""}</strong></span>
        <span>${I18n.t("fieldCompleteness")}: <strong>${translateCompleteness(analysis.dataCompleteness)}</strong></span>
        <span>${I18n.t("rulesTriggeredTitle")}: <strong>${I18n.formatNumber(analysis.triggeredRules.length)}</strong></span>
        <span>${I18n.t("fieldPlotId")}: <strong>${analysis.plotId}</strong></span>
      </div>
      ${plot && plot.description ? `
        <div class="risk-explanation-summary" style="margin-top:1rem;padding-top:0.85rem;border-top:1px solid var(--border-color);font-size:0.95rem;line-height:1.5;">
          <strong style="color:var(--text-primary);">${I18n.t("assessmentSummaryLabel")}:</strong> ${escapeHtml(I18n.translatePlotDescription(plot.plotId, plot.description))}
        </div>
      ` : ""}
    </div>
  `;
}

function renderScoreBreakdown(analysis) {
  const isBn = I18n.getLang() === "bn";

  if (analysis.triggeredRules.length === 0) {
    const passedList = isBn ? [
      "RULE-01 যাচাই: মালিকানা রেকর্ডের সামঞ্জস্যতা (উত্তীর্ণ — দলিল ও নামজারি মালিকের নাম মিলেছে)",
      "RULE-02 যাচাই: একক সক্রিয় দলিল বৈধতা (উত্তীর্ণ — ঠিক একটি সক্রিয় দলিল বিদ্যমান)",
      "RULE-03 যাচাই: নামজারি রেকর্ডের উপস্থিতি (উত্তীর্ণ — অনুমোদিত নামজারি সংরক্ষিত)",
      "RULE-04 যাচাই: হস্তান্তর শৃঙ্খল ক্রস-রেফারেন্স (উত্তীর্ণ — সকল হস্তান্তর সম্পূর্ণ সংযুক্ত)",
      "RULE-05 যাচাই: দলিল যাচাইকরণ অবস্থা (উত্তীর্ণ — সরকারি স্ট্যাটাস যাচাইকৃত)",
      "RULE-06 যাচাই: কালানুক্রমিক সময়ক্রম (উত্তীর্ণ — সময়রেখার ধারাবাহিকতা সঠিক)",
      "RULE-07 যাচাই: গুরুত্বপূর্ণ তথ্যের পূর্ণাঙ্গতা (উত্তীর্ণ — কোনো তথ্যক্ষেত্র অনুপস্থিত নেই)"
    ] : [
      "Checked RULE-01: Ownership record consistency (Passed — Deed and mutation owners match)",
      "Checked RULE-02: Single active deed validation (Passed — Exactly one active deed)",
      "Checked RULE-03: Mutation record existence (Passed — Approved mutation present)",
      "Checked RULE-04: Ownership transfer cross-references (Passed — All transfers fully linked)",
      "Checked RULE-05: Deed verification status (Passed — Official status Verified)",
      "Checked RULE-06: Chronological event ordering (Passed — Timestamps sequential)",
      "Checked RULE-07: Critical fields & data completeness (Passed — 0 missing fields)"
    ];

    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">${I18n.t("scoreBreakdownTitle")}</h2>
          <span class="status-badge status-active">${isBn ? '০ পয়েন্ট (ঝুঁকিমুক্ত)' : '0 Points (Clear)'}</span>
        </div>
        <p style="margin-bottom:0.75rem; color:var(--text-secondary);">
          ${I18n.t("allClearDesc")} ${I18n.t("scoreGaugeLabel")}: <strong>${I18n.formatNumber(0)} / ${I18n.formatNumber(100)}</strong>.
        </p>
        <div class="passed-checks-list" style="display: grid; gap: 0.5rem; margin-top: 0.75rem;">
          ${passedList.map(text => `
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.9rem; color:var(--text-primary); padding:0.4rem 0.6rem; background:var(--bg-muted); border-radius:var(--radius-sm);">
              <span style="color: var(--risk-clear); font-weight: 700;">✓</span> ${text}
            </div>
          `).join("")}
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem 1rem; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.88rem; color: var(--text-secondary);">
          <strong>${isBn ? 'সতর্কতা:' : 'Note:'}</strong> ${I18n.t("allClearNote")}
        </div>
      </div>
    `;
  }

  const rows = analysis.evidence.map(ev => {
    const rule = RiskEngine.RULES[ev.rule];
    const ruleName = isBn && rule.nameBn ? rule.nameBn : rule.name;
    const pts = ev.rule === "RULE-07" ? (ev.pointsAdded || rule.points) : rule.points;
    const detailText = isBn && ev.detailBn ? ev.detailBn : I18n.translateEvidenceDetail(ev);
    return `
      <tr>
        <td><span class="rule-id-badge rule-id-badge--sm">${rule.id}</span></td>
        <td>${ruleName}</td>
        <td><span class="severity-badge severity-${rule.severity.toLowerCase()}">${I18n.translateSeverity(rule.severity)}</span></td>
        <td class="points-cell">+${I18n.formatNumber(pts)}</td>
        <td class="evidence-cell">${escapeHtml(detailText.substring(0, 120))}${detailText.length > 120 ? "…" : ""}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="card">
      <div class="card-header"><h2 class="card-title">${I18n.t("scoreBreakdownTitle")}</h2></div>
      <div class="table-wrapper">
        <table class="score-table" aria-label="Score breakdown table">
          <thead>
            <tr>
              <th>${I18n.t("colRuleId")}</th>
              <th>${I18n.t("colRuleName")}</th>
              <th>${I18n.t("colSeverity")}</th>
              <th>${I18n.t("colPoints")}</th>
              <th>${I18n.t("colEvidence")}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>${I18n.t("totalScoreLabel")}</strong></td>
              <td class="points-cell"><strong>${I18n.formatNumber(analysis.score)}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

function renderMissingInfo(analysis) {
  const isBn = I18n.getLang() === "bn";
  const items = isBn && analysis.missingInfoBn
    ? analysis.missingInfoBn
    : (analysis.missingInfo || []).map(m => I18n.translateMissingField(m));

  return `
    <div class="card">
      <div class="card-header"><h2 class="card-title">${I18n.t("missingInfoTitle")}</h2></div>
      <ul class="missing-list">
        ${items.map(m => `<li>${escapeHtml(m)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderNextSteps(analysis) {
  const isBn = I18n.getLang() === "bn";
  const steps = isBn && analysis.nextStepsBn ? analysis.nextStepsBn : analysis.nextSteps;

  return `
    <div class="card">
      <div class="card-header"><h2 class="card-title">${I18n.t("nextStepsTitle")}</h2></div>
      <div class="steps-disclaimer">
        ${I18n.t("nextStepsNotice")}
      </div>
      <ol class="next-steps-list">
        ${steps.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
      </ol>
    </div>
  `;
}

function renderAllRulesReference() {
  const isBn = I18n.getLang() === "bn";
  const rules = RiskEngine.getAllRules();

  const rows = rules.map(r => {
    const name = isBn && r.nameBn ? r.nameBn : r.name;
    const desc = isBn && r.descriptionBn ? r.descriptionBn : r.description;
    const pts = r.id === "RULE-07" ? (isBn ? "+৫ প্রতি ক্ষেত্রে (সর্বোচ্চ ২০)" : "+5 per field (max 20)") : "+" + I18n.formatNumber(r.points);

    return `
      <tr>
        <td><span class="rule-id-badge rule-id-badge--sm">${r.id}</span></td>
        <td><strong>${name}</strong></td>
        <td><span class="severity-badge severity-${r.severity.toLowerCase()}">${I18n.translateSeverity(r.severity)}</span></td>
        <td class="points-cell">${pts}</td>
        <td>${desc}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${I18n.t("allRulesRefTitle")}</h2>
        <span class="card-subtitle">${I18n.t("allRulesRefSub")}</span>
      </div>
      <div class="table-wrapper">
        <table class="score-table" aria-label="All rules reference table">
          <thead>
            <tr>
              <th>${I18n.t("colRuleId")}</th>
              <th>${I18n.t("colRuleName")}</th>
              <th>${I18n.t("colSeverity")}</th>
              <th>${I18n.t("colPoints")}</th>
              <th>${I18n.t("colDescription")}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAboutRules() {
  const tbody = document.getElementById("about-rules-tbody");
  if (!tbody || typeof RiskEngine === "undefined") return;
  const isBn = I18n.getLang() === "bn";
  const rules = RiskEngine.getAllRules();
  tbody.innerHTML = rules.map(r => {
    const name = isBn && r.nameBn ? r.nameBn : r.name;
    const desc = isBn && r.descriptionBn ? r.descriptionBn : r.description;
    const pts = r.id === "RULE-07"
      ? (isBn ? "+৫/ক্ষেত্র (সর্বোচ্চ ২০)" : "+5/field (max 20)")
      : "+" + I18n.formatNumber(r.points);
    return `
      <tr>
        <td><span class="rule-id-badge rule-id-badge--sm">${r.id}</span></td>
        <td><strong>${name}</strong></td>
        <td><span class="severity-badge severity-${r.severity.toLowerCase()}">${I18n.translateSeverity(r.severity)}</span></td>
        <td class="points-cell">${pts}</td>
        <td style="font-size:0.82rem">${desc}</td>
      </tr>
    `;
  }).join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIOS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function populateScenarioCards() {
  const container = document.getElementById("scenarios-container");
  if (!container) return;

  const scenarios = [
    {
      id: "scenario-1",
      title: I18n.t("scenario1Title"),
      icon: "✅",
      description: I18n.t("scenario1Desc"),
      plotIds: App.allPlots.filter(p => p.scenarioId === "scenario-1").map(p => p.plotId),
      riskLevel: "No Conflict Detected",
      highlight: `${I18n.t("whatToLookFor")} ${I18n.t("scenario1Highlight")}`
    },
    {
      id: "scenario-2",
      title: I18n.t("scenario2Title"),
      icon: "⚠",
      description: I18n.t("scenario2Desc"),
      plotIds: App.allPlots.filter(p => p.scenarioId === "scenario-2").map(p => p.plotId),
      riskLevel: "High",
      highlight: `${I18n.t("whatToLookFor")} ${I18n.t("scenario2Highlight")}`
    },
    {
      id: "scenario-3",
      title: I18n.t("scenario3Title"),
      icon: "🔴",
      description: I18n.t("scenario3Desc"),
      plotIds: App.allPlots.filter(p => p.scenarioId === "scenario-3").map(p => p.plotId),
      riskLevel: "High",
      highlight: `${I18n.t("whatToLookFor")} ${I18n.t("scenario3Highlight")}`
    },
    {
      id: "scenario-4",
      title: I18n.t("scenario4Title"),
      icon: "⚪",
      description: I18n.t("scenario4Desc"),
      plotIds: App.allPlots.filter(p => p.scenarioId === "scenario-4").map(p => p.plotId),
      riskLevel: "Incomplete Data",
      highlight: `${I18n.t("whatToLookFor")} ${I18n.t("scenario4Highlight")}`
    },
    {
      id: "scenario-5",
      title: I18n.t("scenario5Title"),
      icon: "🟠",
      description: I18n.t("scenario5Desc"),
      plotIds: App.allPlots.filter(p => p.scenarioId === "scenario-5").map(p => p.plotId),
      riskLevel: "Medium",
      highlight: `${I18n.t("whatToLookFor")} ${I18n.t("scenario5Highlight")}`
    }
  ];

  container.innerHTML = scenarios.map(sc => `
    <div class="scenario-card" id="${sc.id}">
      <div class="scenario-card-header">
        <span class="scenario-icon" aria-hidden="true">${sc.icon}</span>
        <h2 class="scenario-title">${sc.title}</h2>
        <span class="risk-badge risk-${riskClass(sc.riskLevel)}">${translateRiskLevel(sc.riskLevel)}</span>
      </div>
      <p class="scenario-description">${sc.description}</p>
      <div class="scenario-highlight">${sc.highlight}</div>
      <div class="scenario-plots">
        <strong>${I18n.t("demoPlotsLabel")}</strong>
        ${sc.plotIds.map(pid => `
          <button class="btn btn-sm btn-outline scenario-plot-btn" onclick="navigateTo('plot-detail', '${pid}')">
            ${pid}
          </button>
          <button class="btn btn-sm btn-primary scenario-plot-btn" onclick="navigateTo('conflict-replay', '${pid}')">
            ${I18n.t("actionReplay")}
          </button>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function initScenarioButtons() {
  const exploreBtn = document.getElementById("explore-demo-btn");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => navigateTo("scenarios"));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATION HELPERS FOR DYNAMIC ATTRIBUTES
// ─────────────────────────────────────────────────────────────────────────────
function translateRiskLevel(level) {
  if (level === "Low" || level === "No Conflict Detected") return I18n.t("riskLow");
  if (level === "Medium") return I18n.t("riskMedium");
  if (level === "High") return I18n.t("riskHigh");
  if (level === "Incomplete Data") return I18n.t("riskIncomplete");
  return level;
}

function translateStatus(status) {
  const isBn = I18n.getLang() === "bn";
  if (!isBn) return status;
  switch (status) {
    case "Active": return I18n.t("statusActive");
    case "Under Review": return I18n.t("statusUnderReview");
    case "Inactive / Legacy": return I18n.t("statusLegacy");
    case "Approved": return I18n.t("statusApproved");
    case "Pending Review": return I18n.t("statusPending");
    case "Unknown": return I18n.getLang() === 'bn' ? 'অজ্ঞাত' : 'Unknown';
    default: return status;
  }
}

function translateVerification(status) {
  const isBn = I18n.getLang() === "bn";
  if (!isBn) return status || "Unknown";
  switch (status) {
    case "Verified": return I18n.t("statusVerified");
    case "Pending Review": return I18n.t("statusPending");
    case "Unverified": return I18n.t("statusUnverified");
    default: return status || "অজ্ঞাত";
  }
}

function translateCompleteness(comp) {
  const isBn = I18n.getLang() === "bn";
  if (!isBn) return comp;
  switch (comp) {
    case "Complete": return I18n.t("compComplete");
    case "Partial": return I18n.t("compPartial");
    case "Incomplete": return I18n.t("compIncomplete");
    default: return comp;
  }
}

function translateLandUse(lu) {
  const isBn = I18n.getLang() === "bn";
  if (!isBn || !lu) return lu;
  switch (lu) {
    case "Residential": return "আবাসিক";
    case "Mixed Use": return "মিশ্র ব্যবহার";
    case "Commercial": return "বাণিজ্যিক";
    case "Agricultural": return "কৃষি";
    default: return lu;
  }
}

function translateScenarioLabel(label) {
  const isBn = I18n.getLang() === "bn";
  if (!isBn || !label) return label;
  switch (label) {
    case "Consistent Ownership Records":
    case "Consistent Records": return "সামঞ্জস্যপূর্ণ রেকর্ড";
    case "Ownership Mismatch": return "মালিকানা নামের গরমিল";
    case "Duplicate Active Deeds": return "দ্বৈত সক্রিয় দলিল";
    case "Incomplete Records": return "অসম্পূর্ণ রেকর্ড";
    case "Medium Risk — Incomplete Ownership History": return "মাঝারি ঝুঁকি — অসম্পূর্ণ হস্তান্তরের ইতিহাস";
    default: return label;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
function infoRow(label, value) {
  return `
    <div class="info-row">
      <dt class="info-label">${label}</dt>
      <dd class="info-value">${value}</dd>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function riskClass(level) {
  const map = {
    "No Conflict Detected": "clear",
    "Low": "low",
    "Medium": "medium",
    "High": "high",
    "Incomplete Data": "incomplete"
  };
  return map[level] || "incomplete";
}

function riskIcon(level) {
  const map = {
    "No Conflict Detected": "✅",
    "Low": "✅",
    "Medium": "🟠",
    "High": "🔴",
    "Incomplete Data": "⚪"
  };
  return map[level] || "⚪";
}

function gaugeColor(score) {
  if (score < 20) return "#22c55e";
  if (score < 50) return "#f59e0b";
  return "#ef4444";
}

function setupKeyboardNav() {
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && App.currentPage !== "dashboard") {
      navigateTo("dashboard");
    }
  });
}
