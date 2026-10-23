// BRIDGE TO GAME CONTEXT
export const gWin: any = typeof (window as any).unsafeWindow !== 'undefined' 
  ? (window as any).unsafeWindow 
  : window;

export function copyObj<T>(src: T): T {
  if (!src || typeof src !== 'object') return src;
  if (Array.isArray(src)) return [...src] as any;
  const out: any = {};
  for (const k in src) {
    if (Object.prototype.hasOwnProperty.call(src, k)) {
      out[k] = (src as any)[k];
    }
  }
  return out;
}

export function mergeObj<T, U>(a: T, b: U): T & U {
  const out = copyObj(a) as any;
  if (b && typeof b === 'object') {
    for (const k in b) {
      if (Object.prototype.hasOwnProperty.call(b, k)) {
        out[k] = (b as any)[k];
      }
    }
  }
  return out;
}

export function getGameState(): any {
  try {
    if (gWin.game && gWin.game.store) {
      return gWin.game.store.getState();
    }
  } catch (e) {
    console.error('[VKTT Bridge] Error reading state:', e);
  }
  return null;
}

export function setGameState(partial: any): void {
  try {
    if (gWin.game && gWin.game.store) {
      gWin.game.store.setState(partial);
    }
  } catch (e) {
    console.error('[VKTT Bridge] Error setting state:', e);
  }
}

export function waitForGame(onReady: () => void): void {
  const timer = setInterval(() => {
    try {
      if (gWin.game && gWin.game.store) {
        clearInterval(timer);
        console.log('[VKTT MOD v3.0] Kết nối thành công tới Game Store!');
        onReady();
      }
    } catch (e) {}
  }, 400);
}
