// Applies the saved theme and the current view before the page is drawn, so there
// is no flash of the wrong theme or of the hidden apps. Loaded without defer; app.js handles the switch itself.
"use strict";
try {
  const theme = localStorage.getItem("ks-suite.theme");
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch { /* storage blocked: follow the system */ }

// The apps (and install notes) show only when the address ends in #apps.
// Without JavaScript this never runs, so everything stays visible.
document.documentElement.dataset.view = location.hash === "#apps" ? "apps" : "home";
