// Add the styles
// This function adds a stylesheet to the head of the page, which
// styles the toolbar and anything that the toolbar adds to the page.
// (e.g. the colour contrast settings).
function addMa11yStyles() {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "https://ma11y.mark.ie/ma11y/style.css";
  const head = document.querySelector("head");
  head.appendChild(style);
}
addMa11yStyles();

function handleState(item) {
  const state = item.dataset.active;
  if (state === "false") {
    item.setAttribute("data-active", "true");
  } else {
    item.setAttribute("data-active", "false");
  }
}

// HTML for the dialog when the colour contrast button is clicked.
const ma11yColorContrastDialog = `
  <dialog id="color-contrast" class="ma11y-dialog ma11y-dialog--contrast">
    <h2>Choose color contrast</h2>
    <div class="ma11y-buttons">
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-0" data-index="0" data-active="false">Default</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-1" data-index="1" data-active="false">Black/White</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-2" data-index="2" data-active="false">Yellow/Black</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-3" data-index="3" data-active="false">Red/White</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-4" data-index="4" data-active="false">Blue/White</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-5" data-index="5" data-active="false">Yellow/Blue</button>
    </div>
  <dialog>
`;

// HTML for the toolbar
const ma11yToolbar = `
<div id="ma11y-tools" class="ma11y-tools" data-active="false">
  <div class="ma11y-container ma11y-container--full-height padding-x">
    <div class="ma11y-buttons">
      <button type="button" class="ma11y-tools__button ma11y-tools__button--play" data-status="stopped">Play</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--stop">Stop</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--selected">Read Selected Text</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--text" data-active="false">Text Mode</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--color-contrast" data-ma11y-dialog="color-contrast">Color Contrast</button>
    </div>
  </div>
</div>
`;

// We take the current body that is on the site, then wrap the contents of that
// in a div so we can add the toolbar above this new div in the HTML order.
// We can then also add our dialogs after this new div.
const body = document.querySelector("body");
const oldBody = body.innerHTML;
const newBody = `<div class="ma11y-container-body">${oldBody}</div>`;
body.innerHTML = newBody;
body.classList.add("ma11y-body");
body.insertAdjacentHTML("afterbegin", ma11yToolbar);
body.insertAdjacentHTML("beforeend", ma11yColorContrastDialog);
const ma11yContainer = document.querySelector(".ma11y-container-body");
const ma11yToolbarElement = document.querySelector("#ma11y-tools");

const playButton = document.querySelector(".ma11y-tools__button--play");
const pauseButton = document.querySelector(".ma11y-tools__button--pause");
const stopButton = document.querySelector(".ma11y-tools__button--stop");
const selectTextButton = document.querySelector(
  ".ma11y-tools__button--selected"
);
const textModeButton = document.querySelector(".ma11y-tools__button--text");
const dialogButtons = document.querySelectorAll("[data-ma11y-dialog]");
if (dialogButtons) {
  dialogButtons.forEach((dialogButton) => {
    dialogButton.addEventListener("click", () => {
      const dialog = document.querySelector(
        `#${dialogButton.getAttribute("data-ma11y-dialog")}`
      );
      dialog.showModal();
    });
  });
}

// We create the activations buttons as an array, so people can have more than one
// activation button on their site. For example, they might want one in a header menu
// and also in a footer menu.
const ma11yToolbarActivationButtons = document.querySelectorAll(
  'a[href="#ma11y-tools"]'
);
if (ma11yToolbarActivationButtons) {
  ma11yToolbarActivationButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      handleState(ma11yToolbarElement);
    });
  });
}

// Read out loud function
function readOutLoud(message) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = message;
  speech.volume = 1;
  speech.rate = 0.9;
  speech.pitch = 1;
  speech.lang = "en-UK";
  window.speechSynthesis.speak(speech);
}

const contents = document.querySelector(".ma11y-container-body");
const contentsCopy = contents.cloneNode(true);
// Removing the script and noscript tags from the page as we don't want
// to read out things like Google Analytics id, or schema.org markup.
// Also removing style tags. Strangely, some sites have style tags in the
// body of the page.
let itemsToRemove = [];
const noScripts = Array.from(contentsCopy.querySelectorAll("noscript"));
const scripts = Array.from(contentsCopy.querySelectorAll("script"));
const styles = Array.from(contentsCopy.querySelectorAll("style"));

itemsToRemove = [...noScripts, ...scripts, ...styles];
itemsToRemove.forEach((item) => {
  item.remove();
});

const itemToRead = contentsCopy.textContent;

// Event listeners
playButton.addEventListener("click", () => {
  const playButtonState = playButton.getAttribute("data-status");
  if (playButtonState === "stopped") {
    playButton.setAttribute("data-status", "playing");
    playButton.textContent = "Pause";
    readOutLoud(itemToRead);
  } else if (playButtonState === "playing") {
    playButton.setAttribute("data-status", "paused");
    playButton.textContent = "Resume";
    window.speechSynthesis.pause();
  } else if (playButtonState === "paused") {
    playButton.setAttribute("data-status", "playing");
    playButton.textContent = "Pause";
    window.speechSynthesis.resume();
  }
});

function handleStopReadOutLoud() {
  window.speechSynthesis.cancel();
  playButton.setAttribute("data-status", "stopped");
  playButton.textContent = "Play";
}
stopButton.addEventListener("click", handleStopReadOutLoud);

// Read selected text.
selectTextButton.addEventListener("click", () => {
  handleStopReadOutLoud();
  const selectedText = window.getSelection().toString();
  readOutLoud(selectedText);
});

// Text mode
// This is a very basic text mode. It removes all stylesheets from the page.
textModeButton.addEventListener("click", () => {
  const textModeButtonState = textModeButton.getAttribute("data-active");
  const stylesheets = Array.from(
    document.querySelectorAll("link[rel=stylesheet]")
  );
  if (textModeButtonState === "false") {
    textModeButton.setAttribute("data-active", "true");
    stylesheets.forEach((sheet) => {
      const sheetHref = sheet.href;
      sheet.setAttribute("data-href", sheetHref);
      sheet.removeAttribute("href");
    });
    handleAddMa11yStyles();
  } else if (textModeButtonState === "true") {
    stylesheets.forEach((sheet) => {
      const sheetHref = sheet.getAttribute("data-href");
      sheet.setAttribute("href", sheetHref);
      sheet.removeAttribute("data-href");
    });
    textModeButton.setAttribute("data-active", "false");
  }
});

// Colour contrast
const colorContrastButtons = document.querySelectorAll(
  ".ma11y-tools__button--contrast"
);
colorContrastButtons.forEach((colorContrastButton) => {
  colorContrastButton.addEventListener("click", () => {
    const index = colorContrastButton.getAttribute("data-index");
    contents.classList.add("ma11y-container-body--contrast");
    contents.removeAttribute("data-contrast");
    contents.setAttribute("data-contrast", index);
    body.setAttribute("data-contrast", index);
    colorContrastButtons.forEach((button) => {
      button.setAttribute("data-active", "false");
    });
    colorContrastButton.setAttribute("data-active", "true");
    if (index === "0") {
      contents.removeAttribute("data-contrast");
      contents.classList.remove("ma11y-container-body--contrast");
      body.removeAttribute("data-contrast");
    }
  });
});
