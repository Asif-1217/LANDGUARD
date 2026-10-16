/**
 * LANDGUARD — Date Formatting Regression Test
 * Tests the timezone-safe date parsing and Bengali/English formatting
 * by directly exercising the same logic as I18n.formatDate().
 */
"use strict";

// ── Reproduce the formatDate logic (same as js/i18n.js) ──────────────────────

const bnNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function formatNumber(num, lang) {
  if (num === null || num === undefined) return "";
  const str = String(num);
  if (lang !== "bn") return str;
  return str.replace(/[0-9]/g, d => bnNumerals[parseInt(d, 10)]);
}

function formatDate(dateStr, lang) {
  if (!dateStr) return lang === "bn" ? "রেকর্ড নেই" : "Not recorded";
  try {
    let year, month, day;
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.test(String(dateStr).trim());
    if (dateOnlyMatch) {
      const parts = String(dateStr).trim().split("-");
      year  = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day   = parseInt(parts[2], 10);
    } else {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      year  = d.getFullYear();
      month = d.getMonth() + 1;
      day   = d.getDate();
    }

    if (lang === "bn") {
      const bnMonths = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
      ];
      return `${formatNumber(day, "bn")} ${bnMonths[month - 1]}, ${formatNumber(year, "bn")}`;
    } else {
      const localDate = new Date(year, month - 1, day);
      return localDate.toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric"
      });
    }
  } catch {
    return String(dateStr);
  }
}

// ── Test Runner ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(description, actual, expected) {
  if (actual === expected) {
    console.log(`  ✅ ${description}`);
    passed++;
  } else {
    console.log(`  ❌ ${description}`);
    console.log(`     Expected: "${expected}"`);
    console.log(`     Actual:   "${actual}"`);
    failed++;
  }
}

console.log("\n📅 LANDGUARD Date Formatting Tests\n");

console.log("── Bengali Mode ─────────────────────────────────────────────");
test("2015-07-22 in bn → ২২ জুলাই, ২০১৫",
  formatDate("2015-07-22", "bn"),
  "২২ জুলাই, ২০১৫");

test("2026-10-15 in bn → ১৫ অক্টোবর, ২০২৬",
  formatDate("2026-10-15", "bn"),
  "১৫ অক্টোবর, ২০২৬");

test("2018-01-05 in bn → ৫ জানুয়ারি, ২০১৮",
  formatDate("2018-01-05", "bn"),
  "৫ জানুয়ারি, ২০১৮");

test("2022-12-31 in bn → ৩১ ডিসেম্বর, ২০২২",
  formatDate("2022-12-31", "bn"),
  "৩১ ডিসেম্বর, ২০২২");

test("2010-06-01 in bn → ১ জুন, ২০১০",
  formatDate("2010-06-01", "bn"),
  "১ জুন, ২০১০");

test("null in bn → রেকর্ড নেই",
  formatDate(null, "bn"),
  "রেকর্ড নেই");

test("empty string in bn → রেকর্ড নেই",
  formatDate("", "bn"),
  "রেকর্ড নেই");

test("undefined in bn → রেকর্ড নেই",
  formatDate(undefined, "bn"),
  "রেকর্ড নেই");

console.log("\n── English Mode ─────────────────────────────────────────────");
test("2015-07-22 in en → 22 July 2015",
  formatDate("2015-07-22", "en"),
  "22 July 2015");

test("2026-10-15 in en → 15 October 2026",
  formatDate("2026-10-15", "en"),
  "15 October 2026");

test("2018-01-05 in en → 5 January 2018",
  formatDate("2018-01-05", "en"),
  "5 January 2018");

test("2022-12-31 in en → 31 December 2022",
  formatDate("2022-12-31", "en"),
  "31 December 2022");

test("null in en → Not recorded",
  formatDate(null, "en"),
  "Not recorded");

test("empty string in en → Not recorded",
  formatDate("", "en"),
  "Not recorded");

console.log("\n── Timezone Safety ──────────────────────────────────────────");
// The main timezone bug: new Date("2015-07-22") in UTC+6 gives July 22 correctly
// but in UTC-5 it would give July 21. Our fix always gives the correct calendar date.
test("2015-01-01 never becomes Dec 31 previous year (timezone-safe)",
  formatDate("2015-01-01", "bn").includes("জানুয়ারি"),
  true);

test("2015-07-22 day component is ২২ not ২১ (timezone-safe)",
  formatDate("2015-07-22", "bn").startsWith("২২"),
  true);

console.log("\n── Edge Cases ───────────────────────────────────────────────");
test("Invalid date string passed through gracefully",
  formatDate("not-a-date", "en"),
  "not-a-date");

// Summary
console.log(`\n${"─".repeat(55)}`);
console.log(`Total: ${passed + failed}  ✅ Passed: ${passed}  ❌ Failed: ${failed}`);
if (failed === 0) {
  console.log("🎉 All date formatting tests passed!\n");
  process.exit(0);
} else {
  console.log("⚠️  Some tests failed — review output above.\n");
  process.exit(1);
}
