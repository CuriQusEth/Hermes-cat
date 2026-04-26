// Hermes Cat Gatekeeper - Background Service Worker
// Tracks active tab time and triggers cat overlay when limit is reached

const DEFAULT_SETTINGS = {
  limitMinutes: 60,
  breakMinutes: 5,
  enabled: true
};

let settings = { ...DEFAULT_SETTINGS };
let secondsActive = 0;
let isOnBreak = false;
let lastActiveTabId = null;

// Load settings from storage on startup
chrome.storage.sync.get(DEFAULT_SETTINGS, (data) => {
  settings = {
    limitMinutes: data.limitMinutes,
    breakMinutes: data.breakMinutes,
    enabled: data.enabled
  };
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.limitMinutes) settings.limitMinutes = changes.limitMinutes.newValue;
  if (changes.breakMinutes) settings.breakMinutes = changes.breakMinutes.newValue;
  if (changes.enabled !== undefined) settings.enabled = changes.enabled.newValue;
});

// Track time via alarm (fires every minute)
chrome.alarms.create("trackTime", { periodInMinutes: 1 / 60 }); // every ~1 second

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "trackTime") return;
  if (!settings.enabled || isOnBreak) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) return;
    const tab = tabs[0];

    // Skip chrome internal pages
    if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) return;

    lastActiveTabId = tab.id;
    secondsActive++;

    const limitSeconds = settings.limitMinutes * 60;

    // Broadcast progress to popup if open
    chrome.runtime.sendMessage({
      action: "progressUpdate",
      secondsActive,
      limitSeconds
    }).catch(() => {}); // Popup may not be open, ignore error

    if (secondsActive >= limitSeconds) {
      triggerCatOverlay(tab.id);
    }
  });
});

function triggerCatOverlay(tabId) {
  isOnBreak = true;
  chrome.tabs.sendMessage(tabId, {
    action: "showCat",
    breakMinutes: settings.breakMinutes
  }).catch(() => {
    // Tab may not have content script (e.g. new tab), reset anyway
    isOnBreak = false;
    secondsActive = 0;
  });
}

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.action) {
    case "breakDone":
      isOnBreak = false;
      secondsActive = 0;
      sendResponse({ success: true });
      break;

    case "resetTimer":
      secondsActive = 0;
      isOnBreak = false;
      sendResponse({ success: true });
      break;

    case "getStatus":
      sendResponse({
        secondsActive,
        limitSeconds: settings.limitMinutes * 60,
        isOnBreak,
        settings
      });
      break;

    case "updateSettings":
      settings.limitMinutes = msg.limitMinutes || settings.limitMinutes;
      settings.breakMinutes = msg.breakMinutes || settings.breakMinutes;
      if (msg.enabled !== undefined) settings.enabled = msg.enabled;
      chrome.storage.sync.set({
        limitMinutes: settings.limitMinutes,
        breakMinutes: settings.breakMinutes,
        enabled: settings.enabled
      });
      secondsActive = 0;
      sendResponse({ success: true });
      break;
  }
  return true; // Keep message channel open for async response
});
