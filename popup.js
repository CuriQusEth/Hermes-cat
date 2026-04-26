// Hermes Cat Gatekeeper - Popup Script

const limitSlider = document.getElementById("limitSlider");
const breakSlider = document.getElementById("breakSlider");
const limitVal = document.getElementById("limitVal");
const breakVal = document.getElementById("breakVal");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const enabledToggle = document.getElementById("enabledToggle");
const progressFill = document.getElementById("progressFill");
const progressTime = document.getElementById("progressTime");
const toast = document.getElementById("toast");

// Load current settings + status
chrome.storage.sync.get({ limitMinutes: 60, breakMinutes: 5, enabled: true }, (data) => {
  limitSlider.value = data.limitMinutes;
  breakSlider.value = data.breakMinutes;
  limitVal.textContent = `${data.limitMinutes} min`;
  breakVal.textContent = `${data.breakMinutes} min`;
  enabledToggle.checked = data.enabled;
});

// Fetch current session progress from background
chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
  if (!response) return;
  updateProgress(response.secondsActive, response.limitSeconds);
});

// Live-update progress every second while popup is open
const progressInterval = setInterval(() => {
  chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
    if (!response) return;
    updateProgress(response.secondsActive, response.limitSeconds);
  });
}, 1000);

window.addEventListener("unload", () => clearInterval(progressInterval));

function updateProgress(secondsActive, limitSeconds) {
  const pct = Math.min((secondsActive / limitSeconds) * 100, 100);
  progressFill.style.width = `${pct}%`;
  progressTime.textContent = `${formatTime(secondsActive)} / ${formatTime(limitSeconds)}`;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Slider listeners
limitSlider.addEventListener("input", () => {
  limitVal.textContent = `${limitSlider.value} min`;
});

breakSlider.addEventListener("input", () => {
  breakVal.textContent = `${breakSlider.value} min`;
});

// Save button
saveBtn.addEventListener("click", () => {
  const limitMinutes = parseInt(limitSlider.value);
  const breakMinutes = parseInt(breakSlider.value);
  const enabled = enabledToggle.checked;

  chrome.runtime.sendMessage({
    action: "updateSettings",
    limitMinutes,
    breakMinutes,
    enabled
  }, () => {
    showToast("✅ Settings saved! Timer reset.");
  });
});

// Reset timer
resetBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "resetTimer" }, () => {
    showToast("↺ Timer reset!");
    updateProgress(0, parseInt(limitSlider.value) * 60);
  });
});

// Toggle enabled
enabledToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledToggle.checked });
  chrome.runtime.sendMessage({
    action: "updateSettings",
    enabled: enabledToggle.checked
  });
  showToast(enabledToggle.checked ? "🐱 Guardian activated!" : "😴 Guardian paused.");
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
