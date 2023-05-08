// Add the styles
const style = document.createElement("link");
style.rel = "stylesheet";
style.href = "https://ma11y.mark.ie/ma11y/style.css";
const head = document.querySelector("head");
head.appendChild(style);

// Variables
const body = document.querySelector("body");
const oldBody = body.innerHTML;
const newBody = `<div class="ma11y-container-body">${oldBody}</div>`;
body.innerHTML = newBody;

const container = `
  <div id="ma11y-tools" class="ma11y-tools">
    <div class="ma11y-container">
      <div class="ma11y-buttons">
        <button type="button" class="ma11y-tools__button ma11y-tools__button--play">Start</button>
        <button type="button" class="ma11y-tools__button ma11y-tools__button--stop">Stop</button>
        <button type="button" class="ma11y-tools__button ma11y-tools__button--selected">Read Selected Text</button>
        <button type="button" class="ma11y-tools__button ma11y-tools__button--contrast">Colour Contrast</button>
      </div>
    </div>
  </div>
`;
// Add the container to the page
body.insertAdjacentHTML("afterbegin", container);

const startButton = document.querySelector(".ma11y-tools__button--play");
const stopButton = document.querySelector(".ma11y-tools__button--stop");
const selectTextButton = document.querySelector(
  ".ma11y-tools__button--selected"
);

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
let itemsToRemove = [];
const noScripts = Array.from(contentsCopy.querySelectorAll("noscript"));
const scripts = Array.from(contentsCopy.querySelectorAll("script"));

itemsToRemove = [...noScripts, ...scripts];
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
const contrastButton = document.querySelector(".ma11y-tools__button--contrast");
contrastButton.addEventListener("click", () => {
  contents.classList.toggle("ma11y-container-body--contrast");
});
