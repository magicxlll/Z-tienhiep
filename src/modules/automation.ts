import { gWin, getGameState, setGameState, copyObj, mergeObj } from '../core/bridge';
import { updateNhanVat, notify } from '../core/mutator';

// SPEED HACK ENGINE
let originalSetTimeout = gWin.setTimeout;
let originalSetInterval = gWin.setInterval;
let currentSpeedMultiplier = 1;
let isSpeedHackHooked = false;

export function setGameSpeed(multiplier: number): void {
  currentSpeedMultiplier = Math.max(1, Math.min(10, multiplier));

  if (!isSpeedHackHooked && currentSpeedMultiplier > 1) {
    hookSpeedTimers();
  }

  notify(`⚡ Tốc độ game đã đặt thành: ${currentSpeedMultiplier}x!`);
}

export function getGameSpeed(): number {
  return currentSpeedMultiplier;
}

function hookSpeedTimers(): void {
  if (isSpeedHackHooked) return;
  isSpeedHackHooked = true;

  gWin.setTimeout = function(fn: any, delay: number, ...args: any[]) {
    const scaledDelay = (currentSpeedMultiplier > 1 && typeof delay === 'number' && delay > 10)
      ? Math.max(4, Math.round(delay / currentSpeedMultiplier))
      : delay;
    return originalSetTimeout.call(gWin, fn, scaledDelay, ...args);
  };

  gWin.setInterval = function(fn: any, delay: number, ...args: any[]) {
    const scaledDelay = (currentSpeedMultiplier > 1 && typeof delay === 'number' && delay > 10)
      ? Math.max(10, Math.round(delay / currentSpeedMultiplier))
      : delay;
    return originalSetInterval.call(gWin, fn, scaledDelay, ...args);
  };

  console.log('[VKTT MOD v3.0] Đã gắn Speed Hack vào hệ thống timer!');
}

// AUTO CULTIVATION ENGINE
let autoCultivateTimer: any = null;
let isAutoCultivateActive = false;

export function toggleAutoCultivate(enable?: boolean): boolean {
  if (enable !== undefined) {
    isAutoCultivateActive = enable;
  } else {
    isAutoCultivateActive = !isAutoCultivateActive;
  }

  if (isAutoCultivateActive) {
    if (autoCultivateTimer) clearInterval(autoCultivateTimer);
    autoCultivateTimer = setInterval(runAutoCultivateStep, 1000);
    notify('🧘 Đã BẬT Tự Động Tu Luyện!');
  } else {
    if (autoCultivateTimer) {
      clearInterval(autoCultivateTimer);
      autoCultivateTimer = null;
    }
    notify('⏸️ Đã TẮT Tự Động Tu Luyện!');
  }

  return isAutoCultivateActive;
}

export function isAutoCultivateEnabled(): boolean {
  return isAutoCultivateActive;
}

function runAutoCultivateStep(): void {
  try {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) return;

    const nv = state.run.nhanVat;
    const currentTuVi = nv.tuVi || 0;
    const maxTuVi = nv.tuViMax || 100000;

    if (currentTuVi < maxTuVi) {
      const inc = Math.max(50, Math.floor(maxTuVi * 0.05));
      updateNhanVat({ tuVi: Math.min(maxTuVi, currentTuVi + inc) });
    }
  } catch (e) {}
}

// AUTO RECOVERY ENGINE (HỒI MÁU / CHÂN NGUYÊN)
let autoRecoveryTimer: any = null;
let isAutoRecoveryActive = false;

export function toggleAutoRecovery(enable?: boolean): boolean {
  if (enable !== undefined) {
    isAutoRecoveryActive = enable;
  } else {
    isAutoRecoveryActive = !isAutoRecoveryActive;
  }

  if (isAutoRecoveryActive) {
    if (autoRecoveryTimer) clearInterval(autoRecoveryTimer);
    autoRecoveryTimer = setInterval(runAutoRecoveryStep, 800);
    notify('💖 Đã BẬT Tự Động Hồi Phục Sinh Lực & Chân Nguyên!');
  } else {
    if (autoRecoveryTimer) {
      clearInterval(autoRecoveryTimer);
      autoRecoveryTimer = null;
    }
    notify('⏸️ Đã TẮT Tự Động Hồi Phục!');
  }

  return isAutoRecoveryActive;
}

export function isAutoRecoveryEnabled(): boolean {
  return isAutoRecoveryActive;
}

function runAutoRecoveryStep(): void {
  try {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) return;

    const nv = state.run.nhanVat;
    const cs = nv.chiSo || {};

    const maxHp = cs.khiHuyetMax || 1000;
    const curHp = cs.khiHuyet || 0;
    const maxMp = cs.chanNguyenMax || 1000;
    const curMp = cs.chanNguyen || 0;

    let needUpdate = false;
    const patchCs = copyObj(cs);

    if (curHp < maxHp * 0.6) {
      patchCs.khiHuyet = maxHp;
      needUpdate = true;
    }

    if (curMp < maxMp * 0.6) {
      patchCs.chanNguyen = maxMp;
      needUpdate = true;
    }

    if (needUpdate) {
      updateNhanVat({ chiSo: patchCs });
    }
  } catch (e) {}
}
