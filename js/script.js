/* ==========================================================================
   Personal Website - JavaScript Enhancements
   --------------------------------------------------------------------------
   Five separate features live in this one external file:

     1. Dark / light mode toggle  (saved between visits with localStorage)
     2. Live clock + greeting     (uses the Date object and setInterval)
     3. Project search filter     (filters cards and counts the results)
     4. Contact form              (character counter, validation, message list)
     5. Back to top button        (created by JavaScript, appears on scroll)

   Each feature lives in its own function so the file stays easy to follow.
   ========================================================================== */

"use strict";

/* ==========================================================================
   1. DARK / LIGHT MODE
   The chosen theme is stored in localStorage so it survives a page reload.
   ========================================================================== */

var STORAGE_KEY = "johnel-theme";
var root = document.documentElement;
var themeButton = document.getElementById("theme-toggle");

function applyTheme(theme) {
  var isDark = theme === "dark";

  // The CSS in style.css reads this attribute to swap its colour variables.
  root.setAttribute("data-theme", theme);
  themeButton.textContent = isDark ? "Light mode" : "Dark mode";
  themeButton.setAttribute("aria-pressed", String(isDark));

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    // Storage can be blocked in private browsing; the page still works.
    console.warn("Theme preference was not saved:", error);
  }
}

function initThemeToggle() {
  var savedTheme = null;

  try {
    savedTheme = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    savedTheme = null;
  }

  // First visit: follow the operating system preference.
  if (!savedTheme) {
    savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  applyTheme(savedTheme);

  themeButton.addEventListener("click", function () {
    var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

/* ==========================================================================
   2. LIVE CLOCK AND GREETING
   The clock updates once every second and the greeting follows the hour.
   ========================================================================== */

var clockElement = document.getElementById("clock");
var greetingElement = document.getElementById("greeting");

function greetingForHour(hour) {
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

function updateClock() {
  var now = new Date();
  var timeText = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  clockElement.textContent = timeText;
  // A machine readable value is useful for later features and screen readers.
  clockElement.setAttribute("datetime", now.toISOString());
  greetingElement.textContent = greetingForHour(now.getHours());
}

function initClock() {
  updateClock();
  // 1000 ms = update once per second.
  window.setInterval(updateClock, 1000);
}

/* ==========================================================================
   START EVERYTHING
   The script uses "defer", so the full HTML already exists when it runs.
   ========================================================================== */

initThemeToggle();
initClock();
