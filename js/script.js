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
   3. PROJECT SEARCH FILTER
   Typing in the search box hides the project cards that do not match.
   When nothing matches, a new paragraph is created and added to the list.
   ========================================================================== */

var searchInput = document.getElementById("project-search");
var filterStatus = document.getElementById("filter-status");
var projectList = document.getElementById("project-list");
var projectCards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
var noResultsMessage = null;

function filterProjects() {
  var query = searchInput.value.trim().toLowerCase();
  var visibleCount = 0;

  projectCards.forEach(function (card) {
    // Keywords are stored in data-keywords, but the visible text counts too.
    var searchableText = (card.getAttribute("data-keywords") || "") + " " + card.textContent;
    var matches = searchableText.toLowerCase().indexOf(query) !== -1;

    // The hidden attribute removes the card from the page and the tab order.
    card.hidden = !matches;

    if (matches) {
      visibleCount = visibleCount + 1;
    }
  });

  if (query === "") {
    filterStatus.textContent = "Showing all " + projectCards.length + " projects.";
  } else {
    filterStatus.textContent =
      'Showing ' + visibleCount + " of " + projectCards.length + ' projects for "' + query + '".';
  }

  // Create the empty state only once, then remove it when cards come back.
  if (visibleCount === 0 && noResultsMessage === null) {
    noResultsMessage = document.createElement("p");
    noResultsMessage.className = "no-results";
    noResultsMessage.textContent = "No projects match that search. Try a different keyword.";
    projectList.appendChild(noResultsMessage);
  } else if (visibleCount > 0 && noResultsMessage !== null) {
    noResultsMessage.remove();
    noResultsMessage = null;
  }
}

function initProjectFilter() {
  searchInput.addEventListener("input", filterProjects);
  filterProjects();
}

/* ==========================================================================
   4. CONTACT FORM
   Counts the message characters, checks the form and lists every message
   sent during this visit. Nothing is sent to a server.
   ========================================================================== */

var contactForm = document.getElementById("contact-form");
var messageField = document.getElementById("message");
var charCount = document.getElementById("char-count");
var formFeedback = document.getElementById("form-feedback");
var sentMessages = document.getElementById("sent-messages");
var maxMessageLength = Number(messageField.getAttribute("maxlength")) || 300;

function updateCharacterCount() {
  var remaining = maxMessageLength - messageField.value.length;
  // Pluralise correctly: 1 character left, 2 characters left.
  charCount.textContent = remaining + (remaining === 1 ? " character left" : " characters left");
  // Turn the counter orange when the writer is nearly out of room.
  charCount.classList.toggle("is-low", remaining <= 30);
}

// Every error message is a new paragraph placed after its field.
function setFieldError(field, text) {
  clearFieldError(field);

  var error = document.createElement("p");
  error.className = "field-error";
  error.id = field.id + "-error";
  error.textContent = text;
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", error.id);
  field.parentElement.appendChild(error);
}

function clearFieldError(field) {
  var existingError = document.getElementById(field.id + "-error");

  if (existingError !== null) {
    existingError.remove();
  }

  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
}

function isValidEmail(value) {
  // Simple check: text, then @, then text, then a dot and more text.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm() {
  var nameField = contactForm.elements["name"];
  var emailField = contactForm.elements["email"];
  var isValid = true;

  clearFieldError(nameField);
  clearFieldError(emailField);
  clearFieldError(messageField);

  if (nameField.value.trim() === "") {
    setFieldError(nameField, "Please enter your name.");
    isValid = false;
  }

  if (emailField.value.trim() === "") {
    setFieldError(emailField, "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(emailField.value.trim())) {
    setFieldError(emailField, "Please enter a valid email address, for example name@example.com.");
    isValid = false;
  }

  if (messageField.value.trim() === "") {
    setFieldError(messageField, "Please write a short message.");
    isValid = false;
  }

  return isValid;
}

// Add the submitted values to the list under the form.
function addSentMessage(name, email, message) {
  var item = document.createElement("li");
  var heading = document.createElement("strong");
  var details = document.createElement("span");

  item.className = "sent-message";
  heading.textContent = name + " (" + email + ")";
  details.textContent =
    message + " - sent at " +
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  item.appendChild(heading);
  item.appendChild(details);
  sentMessages.appendChild(item);
}

function handleFormSubmit(event) {
  // Stop the browser from reloading the page.
  event.preventDefault();

  if (!validateForm()) {
    formFeedback.textContent = "Please fix the highlighted fields and try again.";
    formFeedback.className = "form-feedback is-error";
    return;
  }

  var name = contactForm.elements["name"].value.trim();
  var email = contactForm.elements["email"].value.trim();
  var message = messageField.value.trim();

  addSentMessage(name, email, message);

  formFeedback.textContent = "Thanks " + name + "! Your message has been added below.";
  formFeedback.className = "form-feedback is-success";

  // Clear the form and reset the counter.
  contactForm.reset();
  updateCharacterCount();
}

function initContactForm() {
  messageField.addEventListener("input", updateCharacterCount);
  contactForm.addEventListener("submit", handleFormSubmit);
  updateCharacterCount();
}

/* ==========================================================================
   5. BACK TO TOP BUTTON
   The button does not exist in the HTML. JavaScript creates it, appends it
   to the body, and shows it only after the visitor has scrolled down.
   ========================================================================== */

var backToTopButton = document.createElement("button");
var SCROLL_THRESHOLD = 250;

function initBackToTop() {
  backToTopButton.type = "button";
  backToTopButton.className = "back-to-top";
  backToTopButton.textContent = "Top";
  backToTopButton.setAttribute("aria-label", "Back to top");
  backToTopButton.setAttribute("aria-hidden", "true");
  document.body.appendChild(backToTopButton);

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();
}

function toggleBackToTop() {
  var isScrolled = window.scrollY > SCROLL_THRESHOLD;

  backToTopButton.classList.toggle("is-visible", isScrolled);
  backToTopButton.setAttribute("aria-hidden", String(!isScrolled));
}

/* ==========================================================================
   START EVERYTHING
   The script uses "defer", so the full HTML already exists when it runs.
   ========================================================================== */

initThemeToggle();
initClock();
initProjectFilter();
initContactForm();
initBackToTop();
