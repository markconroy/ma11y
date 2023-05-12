const ma11yBmScript = document.createElement("script");
ma11yBmScript.src = "https://ma11y.mark.ie/ma11y/script.js";
const ma11yBmBody = document.querySelector("body");
ma11yBmBody.appendChild(ma11yBmScript);
setTimeout(() => {
  document.querySelector("#ma11y-tools").setAttribute('data-active', 'true');
}, 250);