// A bookmarklet to load the ma11y tool.
// We are keeping this separate from the main script so that the main script
// can be updated independently of the bookmarklet.

const ma11yBookmarkletScript = document.createElement("script");
ma11yBookmarkletScript.src = "https://ma11y.mark.ie/ma11y/script.js";

const ma11yBookmarkletBody = document.querySelector("body");
ma11yBookmarkletBody.appendChild(ma11yBookmarkletScript);

// Add a small delay to ensure the script has loaded before we try to activate
// it.
setTimeout(() => {
  document.querySelector("#ma11y-tools").setAttribute("data-active", "true");
}, 250);
