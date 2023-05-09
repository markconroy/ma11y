// Add the styles
const style = document.createElement("link");
style.rel = "stylesheet";
style.href = "https://ma11y.mark.ie/ma11y/style.css";
const head = document.querySelector("head");
head.appendChild(style);

// Variables
const ma11yColorContrastDialog = `
  <dialog id="color-contrast" class="ma11y-dialog ma11y-dialog--contrast">
    <h2>Choose color contrast</h2>
    <div className="ma11y-buttons">
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-0" data-index="0" data-active="false">Default</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-1" data-index="1" data-active="false">Black/White</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-2" data-index="2" data-active="false">Yellow/Black</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-3" data-index="3" data-active="false">Red/White</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-4" data-index="4" data-active="false">Blue/White</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast ma11y-tools__button--contrast-5" data-index="5" data-active="false">Yellow/Blue</button>
    </div>
  <dialog>
`;

const body = document.querySelector("body");
const oldBody = body.innerHTML;
const newBody = `<div class="ma11y-container-body">${oldBody}</div>`;
body.innerHTML = newBody;

const ma11yToolbar = `
<div id="ma11y-tools" class="ma11y-tools">
  <div class="ma11y-container">
    <div class="ma11y-buttons">
      <button type="button" class="ma11y-tools__button ma11y-tools__button--play">Start</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--stop">Stop</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--selected">Read Selected Text</button>
      <button type="button" class="ma11y-tools__button ma11y-tools__button--color-contrast" data-dialog="color-contrast">Color Contrast</button>
    </div>
  </div>
</div>
`;
// Add the ma11yToolbar to the page
body.insertAdjacentHTML("afterbegin", ma11yToolbar);
body.insertAdjacentHTML("beforeend", ma11yColorContrastDialog);

const startButton = document.querySelector(".ma11y-tools__button--play");
const stopButton = document.querySelector(".ma11y-tools__button--stop");
const selectTextButton = document.querySelector(
  ".ma11y-tools__button--selected"
);
const dialogButtons = document.querySelectorAll('[data-dialog]');
if (dialogButtons) {
  dialogButtons.forEach((dialogButton) => {
    dialogButton.addEventListener('click', () => {
      const dialog = document.querySelector(`#${dialogButton.getAttribute('data-dialog')}`);
      dialog.showModal();
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
startButton.addEventListener("click", () => {
  readOutLoud(itemToRead);
});

stopButton.addEventListener("click", () => {
  window.speechSynthesis.cancel();
});

// Read selected text
selectTextButton.addEventListener("click", () => {
  const selectedText = window.getSelection().toString();
  readOutLoud(selectedText);
});

// Colour contrast
const colorContrastButtons = document.querySelectorAll('.ma11y-tools__button--contrast');
colorContrastButtons.forEach((colorContrastButton) => {
  colorContrastButton.addEventListener('click', () => {
    const index = colorContrastButton.getAttribute('data-index');
    contents.classList.add("ma11y-container-body--contrast");
    contents.removeAttribute('data-contrast');
    contents.setAttribute('data-contrast', index);
    colorContrastButtons.forEach((button) => {
      button.setAttribute('data-active', 'false');
    });
    colorContrastButton.setAttribute('data-active', 'true');
    if(index === '0') {
      contents.removeAttribute('data-contrast');
      contents.classList.remove("ma11y-container-body--contrast");
    }
  });
});