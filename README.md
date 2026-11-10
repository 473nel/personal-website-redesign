# Personal Website Redesign

## Description
A simple personal website for Johnel Murray with About, Projects and Contact sections. I redesigned it with semantic HTML and responsive CSS so it works on mobile, tablet and desktop screens. In the second assignment I enhanced the same website with five interactive JavaScript features.

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES5/ES6, external file)
- Git and GitHub

## JavaScript Enhancements
1. **Dark / light mode toggle** – a button in the header switches the whole site between a light and a dark colour theme. The choice is saved in `localStorage`, so it is remembered on the next visit. If the visitor has never chosen, the page follows the operating system setting.
2. **Live clock and greeting** – the header shows the current time updating every second and a greeting that changes with the hour ("Good morning", "Good afternoon" or "Good evening").
3. **Project search filter** – typing in the search box filters the project cards by keyword. A live label reports how many projects match, and a "no results" message is created and removed dynamically.
4. **Contact form with validation and character counter** – the message box counts down from 300 characters as the visitor types. On submit the form is checked, error messages are added under any invalid field, and a valid message is added to a list under the form (nothing is sent to a server).
5. **Back to top button** – the button is created by JavaScript and inserted into the page. It fades in after the visitor scrolls 250 pixels and scrolls smoothly back to the top when clicked.

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
    └── profile.svg
```

## How to Run
1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. No build tools or internet connection are required (the project images load from an online placeholder service).

## GitHub Pages
The website is published at: https://473nel.github.io/personal-website-redesign/

## Redesign Changes (first assignment)
- Replaced generic `<div>` elements with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` and `<footer>`.
- Added responsive CSS for mobile, tablet and desktop using media queries.
- Moved the CSS into a `css/` folder and the images into an `images/` folder.
- Added one local image and one online image, both with alt text.
- Added comments in the HTML and CSS to explain each part.

## JavaScript Changes (this assignment)
- Created a `js/` folder with one external file, `js/script.js`, linked with `defer` so the page parses first.
- Added new controls to the existing sections instead of building new pages, so the site still feels like the original design.
- Styled the new controls in `css/style.css` and added colour variables so the dark theme only changes one attribute on the `<html>` element.
- Kept the mobile, tablet and desktop breakpoints working and tested every feature in the browser console.

## Reflection
For this assignment I added five interactive features to my existing personal website using one external JavaScript file. The dark mode toggle was the most interesting because it also needed CSS variables, and I learned that changing one attribute on the `<html>` element can restyle the whole page. The clock taught me how `setInterval` and the `Date` object work together. Building the project filter made me practise `querySelectorAll`, `dataset` and the `hidden` attribute, and I finally understood how to create a new element with `document.createElement` and remove it again with `.remove()`. The contact form was the hardest part: I had to read values with `form.elements`, keep a live character count, show inline errors, and build each message row in JavaScript instead of HTML. Testing in the browser console caught a few problems, mostly elements being found before the page loaded, which is why the script now uses `defer`. Using a feature branch and a Pull Request again felt much easier this time, and writing small commits helped me see each feature as a separate step.
