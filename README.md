# Personal Website

## Description
A personal website for Johnel Murray with a hero, About, Projects and Contact sections. It started as a plain HTML page, became responsive in the CSS assignment, gained five JavaScript features in the JavaScript assignment, and was then restyled with a calmer, Apple-inspired interface and gentle animations.

## Technologies Used
- HTML5 (semantic elements and ARIA attributes)
- CSS3 (custom properties, grid, flexbox, media queries, transitions, keyframes)
- JavaScript (external file, DOM, events, `IntersectionObserver`, `requestAnimationFrame`)
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
For the final version of this website I wanted it to look and feel calmer, so I rebuilt the layout around one accent colour, large type and plenty of space. I learned a lot about CSS custom properties: because every colour is a variable, the dark theme only needs one attribute changed on the `<html>` element and everything follows. The sticky navigation uses `backdrop-filter` to blur the content behind it, which I had only seen on Apple's site before. On the JavaScript side, the biggest new idea was `IntersectionObserver`. Instead of checking `scrollY` for every scroll event, it tells me exactly when a section enters the screen, which is better for performance. I reused that idea twice: once to fade sections in, and once to start the counting animation on the statistics. The counting itself uses `requestAnimationFrame` and an ease-out curve, so the numbers slow down as they reach the target. The hardest part was keeping everything accessible while adding motion, which is why animations are turned off for visitors who prefer reduced motion and the skip link, focus outlines and live regions are all still there. Testing each feature in the browser console, and at three screen sizes, caught the small layout problems before they reached the live site.
