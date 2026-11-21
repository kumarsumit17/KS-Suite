// Applies the saved theme before the page is drawn, so there is no flash of the
// wrong theme. Loaded without defer; app.js handles the switch itself.
"use strict";
try {
  const theme = localStorage.getItem("ks-suite.theme");
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch { /* storage blocked: follow the system */ }
