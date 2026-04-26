# 🐱 Hermes Cat Gatekeeper

> *A Chrome extension that unleashes Hermes the cat when you've been working too long. Your feline productivity guardian.*

![Version](https://img.shields.io/badge/version-1.0.0-ffb400?style=flat-square)
![Manifest](https://img.shields.io/badge/manifest-v3-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## What is this?

Hermes Cat Gatekeeper is a Chrome extension that monitors how long you've been working and **locks your screen** with a fullscreen cat overlay when your session limit is reached. Hermes won't let you back in until you've taken your break.

No more skipping breaks. Hermes decides.

---

## Features

- 🐾 **Fullscreen cat takeover** — Hermes blocks your entire screen when it's break time
- ⏱️ **Customizable work limit** — Set anywhere from 5 to 180 minutes
- 😴 **Customizable break duration** — Set 1 to 30 minutes
- 📊 **Live session progress** — See how much time you have left in the popup
- 🔒 **Break enforcement** — The "I'm rested" button is locked until your break is done
- 🎲 **Random cat images & messages** — A different cat every time
- 🔔 **Pause/resume** — Toggle the guardian on or off any time
- 💾 **Settings persist** — Your preferences are saved across sessions

---

## Installation (Developer Mode)

Chrome extensions not on the Web Store can be loaded manually in Developer Mode. This takes about 60 seconds.

### Step 1 — Download the extension

**Option A: Clone with Git**
```bash
git clone https://github.com/YOUR_USERNAME/hermes-cat-gatekeeper.git
```

**Option B: Download ZIP**  
Click the green **Code** button → **Download ZIP** → Extract the folder.

---

### Step 2 — Generate placeholder icons

The extension needs icon files. Run this script once (requires Python 3):

```bash
cd hermes-cat-gatekeeper
python3 generate_icons.py
```

This creates the `icons/` folder with placeholder icons. You can replace them with real cat images later.

---

### Step 3 — Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Turn on **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select the `hermes-cat-gatekeeper` folder
5. Done! 🐱 The Hermes icon will appear in your toolbar

---

## Usage

1. Click the **Hermes Cat Gatekeeper** icon in your toolbar
2. Set your **Work Limit** (default: 60 min) and **Break Duration** (default: 5 min)
3. Click **Save Settings**
4. Work normally — Hermes tracks your active tab time
5. When your limit is reached, **Hermes takes over the screen**
6. Wait out the break timer — then click the unlock button to resume

---

## Popup Controls

| Control | Description |
|---|---|
| Guardian active toggle | Pause or resume tracking |
| Session Progress bar | Shows current session time vs limit |
| Work Limit slider | How long until Hermes appears |
| Break Duration slider | How long the overlay lasts |
| Save Settings | Saves and resets the timer |
| ↺ Reset | Resets the session timer |

---

## File Structure

```
hermes-cat-gatekeeper/
├── manifest.json       # Extension config (Manifest V3)
├── background.js       # Service worker — tracks time, triggers overlay
├── content.js          # Injected into pages — renders the cat overlay
├── popup.html          # Popup UI
├── popup.js            # Popup logic
├── generate_icons.py   # One-time icon generator script
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## Customization

### Change the cat images

In `content.js`, edit the `CAT_IMAGES` array:

```js
const CAT_IMAGES = [
  "https://cataas.com/cat",
  "https://cataas.com/cat/cute",
  "https://your-custom-image.com/cat.jpg"
];
```

### Change the break messages

In `content.js`, edit the `BREAK_MESSAGES` array:

```js
const BREAK_MESSAGES = [
  "Hermes has taken over. Time to rest! 😼",
  "Your own custom message here...",
];
```

### Use a real cat photo as the icon

Replace the files in the `icons/` folder with your own PNG images:
- `icon16.png` — 16×16 px
- `icon48.png` — 48×48 px  
- `icon128.png` — 128×128 px

---

## How It Works

```
Active Tab Detected
        ↓
Background Service Worker counts seconds
        ↓
Seconds ≥ Work Limit × 60?
        ↓ YES
Sends "showCat" message to active tab
        ↓
Content Script renders fullscreen overlay
        ↓
Countdown timer runs for Break Duration
        ↓
Timer ends → unlock button activates
        ↓
User clicks "I'm rested" → overlay removed
        ↓
Session timer resets → back to work
```

---

## Contributing

Pull requests are welcome! Ideas for future features:

- [ ] Site-specific blocking (only track certain URLs)
- [ ] Sound effects when Hermes appears
- [ ] Statistics dashboard (how many breaks taken)
- [ ] Custom cat image upload
- [ ] Pomodoro mode

---

## License

MIT License — do whatever you want with it. 

---

*Made with 🧡 and the supervision of Hermes the cat.*
