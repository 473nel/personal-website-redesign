/* ==========================================================================
   Personal Website - JavaScript Enhancements
   --------------------------------------------------------------------------
   Five separate features live in this one external file:

     1. Dark / light mode toggle  (saved between visits with localStorage)
     2. Live clock + greeting     (uses the Date object and setInterval)
     3. Project search filter     (filters cards and counts the results)
     4. Contact form              (character counter, validation, message list)
     5. Back to top button        (created by JavaScript, appears on scroll)

   Two smaller scripts add the polish:
     6. Scroll reveal             (sections fade in with IntersectionObserver)
     7. Animated statistics       (numbers count up when they scroll into view)

   And two more that make the page feel finished:
     8. Scroll spy                (marks the current nav link with aria-current)
     9. Copy email button         (Clipboard API with an execCommand fallback)

   The final touch:
    10. Hero parallax             (title and captions drift at different speeds)

   Each feature lives in its own function so the file stays easy to follow.
   ========================================================================== */

"use strict";

/* The CSS hides .reveal elements only when this class is present, so the
   page still works with JavaScript turned off. */
document.documentElement.classList.add("js");

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

  // Clear the form, reset the counter and drop the saved draft.
  contactForm.reset();
  updateCharacterCount();
  clearDraft();
}

/* ---------- Draft autosave (part of the contact form) ----------
   While the visitor types, the three values are stored in localStorage as
   JSON. On the next visit they are put back, unless the form was already
   sent. This is handy on a phone where the tab can be closed by accident. */

var draftStatus = document.getElementById("draft-status");
var DRAFT_KEY = "johnel-contact-draft";
var draftSaveTimer = null;
var draftStatusTimer = null;

function showDraftStatus(text) {
  draftStatus.textContent = text;

  window.clearTimeout(draftStatusTimer);
  if (text !== "") {
    draftStatusTimer = window.setTimeout(function () {
      draftStatus.textContent = "";
    }, 2000);
  }
}

function saveDraft() {
  var draft = {
    name: contactForm.elements["name"].value,
    email: contactForm.elements["email"].value,
    message: messageField.value
  };

  // Ignore an empty form so an empty draft never hides an older one.
  if (draft.name === "" && draft.email === "" && draft.message === "") {
    return;
  }

  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    showDraftStatus("Draft saved");
  } catch (error) {
    console.warn("Draft was not saved:", error);
  }
}

function restoreDraft() {
  var savedDraft = null;

  try {
    savedDraft = localStorage.getItem(DRAFT_KEY);
  } catch (error) {
    savedDraft = null;
  }

  if (!savedDraft) {
    return;
  }

  try {
    var draft = JSON.parse(savedDraft);
    contactForm.elements["name"].value = draft.name || "";
    contactForm.elements["email"].value = draft.email || "";
    messageField.value = draft.message || "";

    updateCharacterCount();

    if (draft.name || draft.email || draft.message) {
      showDraftStatus("Draft restored");
    }
  } catch (error) {
    // A corrupt value should never break the page.
    localStorage.removeItem(DRAFT_KEY);
  }
}

function clearDraft() {
  showDraftStatus("");
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    // Storage can be blocked; nothing else to do.
  }
}

function scheduleDraftSave() {
  window.clearTimeout(draftSaveTimer);
  draftSaveTimer = window.setTimeout(saveDraft, 350);
}

function initContactForm() {
  messageField.addEventListener("input", updateCharacterCount);
  contactForm.addEventListener("submit", handleFormSubmit);
  updateCharacterCount();

  // Save a draft shortly after the visitor stops typing.
  contactForm.addEventListener("input", scheduleDraftSave);
  restoreDraft();
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
  // A simple arrow glyph; the real label is the aria-label below.
  backToTopButton.textContent = "\u2191";
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
   6. SCROLL REVEAL
   IntersectionObserver tells us when a section enters the screen, then the
   CSS transition in style.css fades it up. Each element is only watched
   once, so the animation does not repeat while scrolling up and down.
   ========================================================================== */

var revealObserver = null;

function initScrollReveal() {
  var revealItems = document.querySelectorAll(".reveal");

  // Very old browsers, or reduced motion: show everything straight away.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });
}

/* ==========================================================================
   7. ANIMATED STATISTICS
   Each number counts from zero to the value stored in data-count. The
   animation runs with requestAnimationFrame, which redraws smoothly and
   stops on its own when it reaches the end.
   ========================================================================== */

var counterObserver = null;
var COUNT_DURATION = 1100;

function countUp(element) {
  var target = parseInt(element.getAttribute("data-count"), 10) || 0;
  var startTime = null;

  function step(timestamp) {
    if (startTime === null) {
      startTime = timestamp;
    }

    var progress = Math.min((timestamp - startTime) / COUNT_DURATION, 1);
    // Ease out: fast at the start, slow at the end.
    var eased = 1 - Math.pow(1 - progress, 3);

    element.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

function initCounters() {
  var numbers = document.querySelectorAll(".stat-number");

  if (numbers.length === 0) {
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    numbers.forEach(function (number) {
      number.textContent = number.getAttribute("data-count");
    });
    return;
  }

  counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }
      countUp(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  numbers.forEach(function (number) {
    counterObserver.observe(number);
  });
}

/* ==========================================================================
   8. SCROLL SPY
   The same IntersectionObserver idea as the reveal, but here it watches the
   three sections and marks the navigation link for the section on screen
   with aria-current. The observer's root is squeezed into a thin band in
   the middle of the window, so a section only counts while it is being read.
   ========================================================================== */

function initScrollSpy() {
  var links = document.querySelectorAll(".site-nav a[href^='#']");

  if (links.length === 0 || !("IntersectionObserver" in window)) {
    return;
  }

  var items = [];

  links.forEach(function (link) {
    var section = document.querySelector(link.getAttribute("href"));
    if (section) {
      items.push({ link: link, section: section });
    }
  });

  function setActive(activeSection) {
    items.forEach(function (item) {
      var isActive = item.section === activeSection;
      item.link.classList.toggle("is-active", isActive);

      if (isActive) {
        item.link.setAttribute("aria-current", "true");
      } else {
        item.link.removeAttribute("aria-current");
      }
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActive(entry.target);
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  items.forEach(function (item) {
    observer.observe(item.section);
  });
}

/* ==========================================================================
   9. COPY EMAIL BUTTON
   navigator.clipboard is the modern way to copy text. It only works on
   https or localhost, so there is a fallback that selects the text and uses
   the older execCommand("copy"). The button label confirms the result.
   ========================================================================== */

var EMAIL_ADDRESS = "JohnelM6579@TAMCC.EDU.GD";
var copyButton = document.getElementById("copy-email");
var copyStatus = document.getElementById("copy-status");
var copyResetTimer = null;

function showCopyResult(message) {
  copyStatus.textContent = message;
  copyButton.textContent = message === "Copied!" ? "Copied" : "Copy";

  window.clearTimeout(copyResetTimer);
  copyResetTimer = window.setTimeout(function () {
    copyStatus.textContent = "";
    copyButton.textContent = "Copy";
  }, 1800);
}

function copyEmailFallback() {
  var temp = document.createElement("textarea");
  temp.value = EMAIL_ADDRESS;
  temp.setAttribute("readonly", "");
  temp.style.position = "fixed";
  temp.style.opacity = "0";
  document.body.appendChild(temp);

  temp.select();
  var worked = false;

  try {
    worked = document.execCommand("copy");
  } catch (error) {
    worked = false;
  }

  temp.remove();
  showCopyResult(worked ? "Copied!" : "Copy failed, please select the address.");
}

function initCopyEmail() {
  if (!copyButton) {
    return;
  }

  copyButton.addEventListener("click", function () {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(EMAIL_ADDRESS).then(function () {
        showCopyResult("Copied!");
      }, function () {
        // Permission refused: try the older method instead.
        copyEmailFallback();
      });
      return;
    }

    copyEmailFallback();
  });
}

/* ==========================================================================
   10. HERO PARALLAX
   As the page scrolls the big title and the corner captions move at
   slightly different speeds, which adds depth without a library. The work
   is done inside requestAnimationFrame so the browser only recalculates
   once per frame, and the movement is capped so the text never drifts away.
   ========================================================================== */

var heroTitle = document.querySelector(".hero-title");
var heroNotes = document.querySelectorAll(".hero-note");
var parallaxTicking = false;

function updateHeroParallax() {
  // At most 600px of scrolling counts, then the movement stops.
  var offset = Math.min(window.scrollY, 600);

  if (heroTitle) {
    heroTitle.style.transform = "translate3d(0, " + (offset * 0.12) + "px, 0)";
  }

  heroNotes.forEach(function (note) {
    note.style.transform = "translate3d(0, " + (offset * 0.24) + "px, 0)";
  });

  parallaxTicking = false;
}

function initHeroParallax() {
  if (!heroTitle) {
    return;
  }

  // Skip the effect entirely for visitors who prefer reduced motion.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  window.addEventListener("scroll", function () {
    if (parallaxTicking) {
      return;
    }
    parallaxTicking = true;
    window.requestAnimationFrame(updateHeroParallax);
  }, { passive: true });
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
initScrollReveal();
initCounters();
initScrollSpy();
initCopyEmail();
initHeroParallax();
