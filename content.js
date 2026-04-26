.hermes-cat-img {
  animation: breathing 3.5s ease-in-out infinite, subtleTilt 7s ease-in-out infinite, blink 5s ease-in-out infinite;
}

@keyframes breathing {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes subtleTilt {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

@keyframes blink {
  0%, 10%, 12%, 100% { clip-path: inset(0); }
  11%, 11.5% { clip-path: inset(35% 0 35% 0); }
}

@keyframes pawWiggle {
  0%, 100% { transform: rotate(-12deg) scale(1); }
  25% { transform: rotate(-12deg) scale(1.15); }
  50% { transform: rotate(12deg) scale(1); }
  75% { transform: rotate(12deg) scale(1.15); }
}

@keyframes tailWag {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}

@keyframes floatParticle {
  0% { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
}

@keyframes hermesIn {
  from { opacity: 0; transform: scale(0.92) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 40px rgba(255, 180, 0, 0.4), 0 0 80px rgba(255, 100, 0, 0.2); }
  50% { box-shadow: 0 0 60px rgba(255, 180, 0, 0.7), 0 0 120px rgba(255, 100, 0, 0.4); }
}

@keyframes countdownPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(-1deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
}

function spawnParticles() {
  const emojis = [ '🐾', '🐱', '😸', '💤', '✨', '🧶' ];
  for (let i = 0; i < 8; i++) {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    // Create particle with random emoji
  }
}