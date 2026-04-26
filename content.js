// Hermes Cat Gatekeeper - Content Script
// Injects the cat overlay when triggered by background service worker

let catOverlay = null;
let breakInterval = null;

const CAT_IMAGES = [
  "https://cataas.com/cat",
  "https://cataas.com/cat/cute",
  "https://cataas.com/cat/funny"
];

const BREAK_MESSAGES = [
  "Hermes has taken over. Time to rest! 😼",
  "Hermes says: Step away from the keyboard! 🐾",
  "Your cat overlord demands a break! 👑",
  "Even Hermes needs you to rest. Break time! 🧶",
  "Screen locked by Hermes. Go get some water! 💧"
];

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "showCat") {
    showCatOverlay(msg.breakMinutes || 5);
  }
});

function showCatOverlay(breakMinutes) {
  if (catOverlay) return;

  const message = BREAK_MESSAGES[Math.floor(Math.random() * BREAK_MESSAGES.length)];
  const catImageUrl = CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)];
  let timeLeft = breakMinutes * 60;

  catOverlay = document.createElement("div");
  catOverlay.id = "hermes-cat-overlay";

  const styles = `
    #hermes-cat-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1025 50%, #0d1a2e 100%);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: white;
      font-family: 'Georgia', serif;
      animation: hermesIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes hermesIn {
      from { opacity: 0; transform: scale(1.05); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(-1deg); }
      50% { transform: translateY(-12px) rotate(1deg); }
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 40px rgba(255, 180, 0, 0.4), 0 0 80px rgba(255, 100, 0, 0.2); }
      50% { box-shadow: 0 0 60px rgba(255, 180, 0, 0.7), 0 0 120px rgba(255, 100, 0, 0.4); }
    }

    @keyframes countdown-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    #hermes-cat-frame {
      position: relative;
      animation: float 4s ease-in-out infinite;
    }

    #hermes-cat-img {
      width: min(420px, 70vw);
      height: min(420px, 70vw);
      object-fit: cover;
      border-radius: 24px;
      animation: pulse-glow 3s ease-in-out infinite;
      border: 3px solid rgba(255, 180, 0, 0.5);
    }

    #hermes-paw-badge {
      position: absolute;
      top: -15px; right: -15px;
      width: 50px; height: 50px;
      background: linear-gradient(135deg, #ffb400, #ff6a00);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px;
      box-shadow: 0 4px 15px rgba(255, 100, 0, 0.6);
    }

    #hermes-title {
      margin: 28px 0 8px;
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: bold;
      background: linear-gradient(90deg, #ffb400, #ff6a00, #ff4d6d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: center;
      padding: 0 20px;
      letter-spacing: -0.5px;
    }

    #hermes-subtitle {
      font-size: clamp(0.9rem, 2.5vw, 1.1rem);
      color: rgba(255,255,255,0.55);
      margin: 0 0 24px;
      text-align: center;
      padding: 0 20px;
      font-style: italic;
    }

    #hermes-countdown-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
    }

    #hermes-countdown-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: rgba(255,255,255,0.4);
      margin-bottom: 8px;
    }

    #hermes-countdown {
      font-size: clamp(2.5rem, 8vw, 4rem);
      font-weight: bold;
      color: #ffb400;
      font-variant-numeric: tabular-nums;
      animation: countdown-pulse 1s ease-in-out infinite;
      min-width: 120px;
      text-align: center;
    }

    #hermes-progress-bar-wrap {
      width: min(380px, 65vw);
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 28px;
    }

    #hermes-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #ffb400, #ff6a00);
      border-radius: 3px;
      transition: width 1s linear;
      width: 100%;
    }

    #hermes-done-btn {
      padding: 14px 40px;
      font-size: 1rem;
      background: linear-gradient(135deg, #ffb400, #ff6a00);
      color: #0a0a0f;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: all 0.2s ease;
      box-shadow: 0 6px 25px rgba(255, 140, 0, 0.4);
      font-family: inherit;
    }

    #hermes-done-btn:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 10px 35px rgba(255, 140, 0, 0.6);
    }

    #hermes-done-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }

    #hermes-skip-note {
      margin-top: 14px;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.25);
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;

  const totalSeconds = breakMinutes * 60;

  catOverlay.innerHTML = `
    <div id="hermes-cat-frame">
      <img id="hermes-cat-img" src="${catImageUrl}" alt="Hermes the Cat" onerror="this.src='https://placekitten.com/420/420'">
      <div id="hermes-paw-badge">🐾</div>
    </div>
    <h1 id="hermes-title">${message}</h1>
    <p id="hermes-subtitle">Come back after your break. Hermes will be watching.</p>
    <div id="hermes-countdown-wrap">
      <div id="hermes-countdown-label">break ends in</div>
      <div id="hermes-countdown">${formatTime(timeLeft)}</div>
    </div>
    <div id="hermes-progress-bar-wrap">
      <div id="hermes-progress-bar" style="width: 100%"></div>
    </div>
    <button id="hermes-done-btn" disabled>✅ I'm rested, let me back in!</button>
    <p id="hermes-skip-note">Button unlocks when your break is done 🔒</p>
  `;

  document.head.appendChild(styleEl);
  document.body.appendChild(catOverlay);

  const countdownEl = catOverlay.querySelector("#hermes-countdown");
  const progressBar = catOverlay.querySelector("#hermes-progress-bar");
  const doneBtn = catOverlay.querySelector("#hermes-done-btn");
  const skipNote = catOverlay.querySelector("#hermes-skip-note");

  breakInterval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = formatTime(timeLeft);
    const pct = (timeLeft / totalSeconds) * 100;
    progressBar.style.width = `${pct}%`;

    if (timeLeft <= 0) {
      clearInterval(breakInterval);
      breakInterval = null;
      doneBtn.disabled = false;
      skipNote.textContent = "Break complete! Ready to work? 🐾";
      countdownEl.textContent = "Done!";
    }
  }, 1000);

  doneBtn.addEventListener("click", closeOverlay);
}

function closeOverlay() {
  if (breakInterval) {
    clearInterval(breakInterval);
    breakInterval = null;
  }
  if (catOverlay) {
    catOverlay.style.animation = "none";
    catOverlay.style.opacity = "0";
    catOverlay.style.transition = "opacity 0.4s ease";
    setTimeout(() => {
      catOverlay?.remove();
      catOverlay = null;
    }, 400);
  }
  chrome.runtime.sendMessage({ action: "breakDone" }).catch(() => {});
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}
