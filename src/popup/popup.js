/**
 * Selecting the necessary elements from the DOM.
 */
const body = document.body;

const btn = document.querySelector(".changeColorBtn");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");
const copyBtn = document.querySelector(".copyBtn");
const notify = document.querySelector(".notify");
const selectedColor = document.querySelector(".selectedColor");

/**
 * Retrieve the color value from Chrome storage and update the UI.
 */
chrome.storage.sync.get("color", ({ color }) => {
  colorGrid.style.backgroundColor = color;
  colorValue.innerText = color;
  colorValue.style.color = color;
  copyBtn.style.display = "block";
  copyBtn.style.backgroundColor = color;
  notify.style.color = color;
  body.style.backgroundColor = color;
});

/**
 * Event listener for the "Change Color" button click.
 * Opens the color picker and saves the selected color to Chrome storage.
 */
btn.addEventListener("click", async () => {
  try {
    chrome.storage.sync.get("color", ({ color }) => {
      console.log("color: ", color);
    });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: pickColor,
      },
      async (injectionResults) => {
        const [data] = injectionResults;
        if (data.result) {
          const color = data.result.sRGBHex;
          colorGrid.style.backgroundColor = color;
          colorValue.innerText = color;
          colorValue.style.color = color;
          copyBtn.style.backgroundColor = color;
          notify.style.color = color;
          body.style.backgroundColor = color;
          // save the value in local storage
          chrome.storage.sync.set({ color });
        }
      },
    );
  } catch (error) {
    console.error(error);
  }
});

/**
 * Event listener for the "Copy" button click.
 * Copies the color value to the clipboard and shows a notification.
 */
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(colorValue.innerText);
    notify.style.display = "block";
    setTimeout(() => {
      notify.style.display = "none";
    }, 2000);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Picks a color using the EyeDropper tool.
 * @returns {Promise<string>} A promise that resolves to the picked color.
 */
async function pickColor() {
  try {
    // Picker
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.error(err);
  }
}
