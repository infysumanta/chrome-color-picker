/**
 * The color variable stores the hexadecimal value of the color.
 * @type {string}
 */
let color = "#4a90e2";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
});
