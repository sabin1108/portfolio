type Direction = -1 | 0 | 1;
const INTENT_THRESHOLD = 44;
const TRANSITION_LOCK_MS = 650;
const GESTURE_GAP_MS = 180;

export function wheelPixels(delta: number, mode: number, pageHeight: number) {
  return delta * (mode === 1 ? 16 : mode === 2 ? pageHeight : 1);
}

export function createWheelNavigation() {
  let lastInput = -Infinity;
  let lastMove = -Infinity;
  let intent = 0;
  let locked = false;

  return {
    push(delta: number, now: number): Direction {
      if (!Number.isFinite(delta) || delta === 0) return 0;
      const freshGesture = now - lastInput >= GESTURE_GAP_MS;
      lastInput = now;
      if (freshGesture) intent = 0;
      if (locked) {
        // Waiting for silence as well as time prevents a long inertia tail skipping pages.
        if (!freshGesture || now - lastMove < TRANSITION_LOCK_MS) return 0;
        locked = false;
      }
      if (Math.sign(intent) !== Math.sign(delta)) intent = 0;
      intent += delta;
      if (Math.abs(intent) < INTENT_THRESHOLD) return 0;
      const direction = Math.sign(intent) as -1 | 1;
      intent = 0;
      lastMove = now;
      locked = true;
      return direction;
    },
    allowReading(now: number) {
      const transitionHeld = now - lastMove < TRANSITION_LOCK_MS;
      const inertiaHeld = locked && lastMove !== -Infinity && now - lastInput < GESTURE_GAP_MS;
      lastInput = now;
      intent = 0;
      if (transitionHeld || inertiaHeld) return false;
      lastMove = -Infinity;
      locked = true;
      return true;
    },
    lock(now: number) {
      lastInput = now;
      lastMove = now;
      intent = 0;
      locked = true;
    },
    reset() {
      lastInput = -Infinity;
      lastMove = -Infinity;
      intent = 0;
      locked = false;
    },
  };
}
