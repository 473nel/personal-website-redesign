# Personal Website

## Description
A personal website for Johnel Murray with a hero, About, Projects and Contact sections. It started as a plain HTML page, became responsive in the CSS assignment, gained five JavaScript features in the JavaScript assignment, and was then restyled with a calmer, Apple-inspired interface and gentle animations.

## Technologies Used
- HTML5 (semantic elements and ARIA attributes)
- CSS3 (custom properties, grid, flexbox, media queries, transitions, keyframes)
- JavaScript (external file, DOM, events, `IntersectionObserver`, `requestAnimationFrame`, `localStorage`, Clipboard API)
- Git and GitHub

## Visual Design
- One accent colour (blue), soft greys and lots of space, in the style of the Apple website.
- A sticky "glass" navigation bar that blurs the content behind it.
- Large display type in the hero with a short statement and two clear buttons.
- Rounded cards with a soft shadow; they lift slightly and their photo zooms when hovered.
- A full dark theme that switches instantly and is remembered.

## JavaScript Enhancements
1. **Dark / light mode toggle** – a button in the navigation switches the whole site between a light and a dark theme. The choice is saved in `localStorage` and the first visit follows the operating system setting.
2. **Live clock and greeting** – the hero shows the current time, updated every second, with a greeting that changes with the hour.
3. **Project search filter** – typing in the search box filters the project cards by keyword. A live label reports how many match, and a "no results" message is created and removed with JavaScript.
4. **Contact form with validation and character counter** – the message box counts down from 300 characters. On submit each invalid field gets an error message created in JavaScript, and a valid message is added to a list below the form (nothing is sent to a server).
5. **Back to top button** – created by JavaScript, inserted into the page, faded in after 250 pixels of scrolling and scrolls smoothly to the top when clicked.

## Animation Polish
6. **Scroll reveal** – an `IntersectionObserver` adds a class when a section scrolls into view, and CSS fades and lifts it into place. Elements are only watched once, so the effect does not loop.
7. **Animated statistics** – the three numbers in the About section count up from zero with `requestAnimationFrame` and an ease-out curve the first time they are seen.

All animation is disabled automatically for visitors who turn on "reduce motion" in their operating system.

## Extra Interactions
8. **Scroll spy navigation** – an `IntersectionObserver` with a narrow middle band marks the nav link for the section currently being read, using `aria-current` so assistive technology gets the same cue.
9. **Draft autosave** – while the visitor types, the contact form is stored as JSON in `localStorage` (debounced by 350 ms). Reloading the page brings the draft back, and sending the message clears it.
10. **Copy email button** – `navigator.clipboard.writeText()` copies the address, with an `execCommand("copy")` fallback for plain `http` pages. The button changes to "Copied" for a moment and a live region announces the result.

## Folder Structure
```
personal-website-redesign/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
    ├── favicon.svg
    └── profile.svg
```

## How to Run
1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. No build tools are needed. The project images load from an online placeholder service.

## GitHub Pages
https://473nel.github.io/personal-website-redesign/

## Responsive Testing
Checked at mobile (390px), tablet (768px) and desktop (1280px). Navigation collapses to the monogram and theme button on small screens, the project cards go from one column to two and then three, and the contact section stacks into a single column.

## Reflection
For the final version of this website I wanted it to look and feel calmer, so I rebuilt the layout around one accent colour, large type and plenty of space. I learned a lot about CSS custom properties: because every colour is a variable, the dark theme only needs one attribute changed on the `<html>` element. The sticky navigation uses `backdrop-filter` to blur the content behind it, which I had only seen on Apple's site before. On the JavaScript side, the biggest new idea was `IntersectionObserver`. Instead of checking `scrollY` on every scroll event, it tells me exactly when a section enters the screen. I reused it twice: to fade sections in and to start the counting animation. The counting uses `requestAnimationFrame` and an ease-out curve, so the numbers slow down as they reach the target, and the scroll spy uses the same observer with a narrow band in the middle of the window. Two smaller jobs taught me about state and the browser: the form saves a draft in `localStorage` while I type and restores it after a refresh, and the copy button uses the Clipboard API with an older fallback. Both needed careful error handling, because storage and the clipboard can be blocked. The hardest part was keeping everything accessible while adding motion, which is why animations stop for reduced motion and the skip link and focus outlines remain. Testing in the console and at three screen sizes caught the small problems before they reached the live site.
