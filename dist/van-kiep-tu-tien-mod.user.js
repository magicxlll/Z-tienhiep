// ==UserScript==
// @name         Vạn Kiếp Tu Tiên - MOD Assistant Suite v3.5 (Ma Đạo & Ngự Linh)
// @namespace    https://github.com/magicxlll/Z-tienhiep
// @version      3.5.0
// @description  Bảng MOD & Tự Động Hóa Vạn Kiếp Tu Tiên - Cập nhật Ma Đạo, Linh Thú/Ngự Linh, 3 Thể Chất Mới, Trận Pháp & Redesign Giao Diện Cổ Phong Xianxia
// @author       Z-TienHiep & VKTT Team
// @match        https://van-kiep-tu-tien.vuhaiquan2k1.workers.dev/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/magicxlll/Z-tienhiep/main/dist/van-kiep-tu-tien-mod.user.js
// @downloadURL  https://raw.githubusercontent.com/magicxlll/Z-tienhiep/main/dist/van-kiep-tu-tien-mod.user.js
// ==/UserScript==

(() => {
  // src/core/bridge.ts
  var gWin = typeof window.unsafeWindow !== "undefined" ? window.unsafeWindow : window;
  function copyObj(src) {
    if (!src || typeof src !== "object") return src;
    if (Array.isArray(src)) return [...src];
    const out = {};
    for (const k in src) {
      if (Object.prototype.hasOwnProperty.call(src, k)) {
        out[k] = src[k];
      }
    }
    return out;
  }
  function mergeObj(a, b) {
    const out = copyObj(a);
    if (b && typeof b === "object") {
      for (const k in b) {
        if (Object.prototype.hasOwnProperty.call(b, k)) {
          out[k] = b[k];
        }
      }
    }
    return out;
  }
  function uniqueStrings(arr1, arr2) {
    const seen = {};
    const out = [];
    const list = (arr1 || []).concat(arr2 || []);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item !== void 0 && item !== null && item !== "" && !seen[item]) {
        seen[item] = true;
        out.push(item);
      }
    }
    return out;
  }
  function getGameState() {
    try {
      if (gWin.game && gWin.game.store) {
        return gWin.game.store.getState();
      }
    } catch (e) {
      console.error("[VKTT Bridge] Error reading state:", e);
    }
    return null;
  }
  function setGameState(partial) {
    try {
      if (gWin.game && gWin.game.store) {
        gWin.game.store.setState(partial);
      }
    } catch (e) {
      console.error("[VKTT Bridge] Error setting state:", e);
    }
  }
  function persistGameSave(run) {
    try {
      if (gWin.game) {
        const targetRun = run || gWin.game.store?.getState()?.run;
        if (targetRun && typeof gWin.game.saveNow === "function") {
          gWin.game.saveNow(targetRun);
        } else if (targetRun && typeof gWin.game.scheduleSave === "function") {
          gWin.game.scheduleSave(targetRun);
        }
      }
    } catch (e) {
      console.error("[VKTT Bridge] Error persisting run:", e);
    }
  }
  function persistGameMeta(updater) {
    try {
      if (gWin.game && typeof gWin.game.ben === "function") {
        gWin.game.ben((m) => {
          updater(m);
        });
        return;
      }
      const store = gWin.game?.store;
      if (store) {
        const state = store.getState();
        const meta = copyObj(state.meta || {});
        updater(meta);
        store.setState({ meta });
      }
    } catch (e) {
      console.error("[VKTT Bridge] Error persisting meta:", e);
    }
  }
  function waitForGame(onReady) {
    const timer = setInterval(() => {
      try {
        if (gWin.game && gWin.game.store) {
          clearInterval(timer);
          console.log("[VKTT MOD v3.0] K\u1EBFt n\u1ED1i th\xE0nh c\xF4ng t\u1EDBi Game Store & Engine!");
          onReady();
        }
      } catch (e) {
      }
    }, 400);
  }

  // src/ui/styles.ts
  var MOD_STYLES = `/* ==========================================================================
   V\u1EA0N KI\u1EBEP TU TI\xCAN MOD ASSISTANT - C\u1ED4 PHONG XIANXIA DESIGN SYSTEM
   Inspired by & Authentically Unified with Web Game "V\u1EA1n Ki\u1EBFp Tu Ti\xEAn"
   Aesthetics: M\u1EF1c Nho (Deep Inkstone), Gi\u1EA5y C\u1ED5 (Aged Parchment), Chu Sa (Cinnabar Vermilion), Ho\xE0ng Kim (Antique Gold), Thanh Ng\u1ECDc (Spiritual Jade)
   Typography: "Noto Serif", Times New Roman, serif
   ========================================================================== */

:root {
  --vktt-giay: #f0e9d6;
  --vktt-giay-dam: #eadfc6;
  --vktt-muc: #171310;
  --vktt-muc-panel: #1e1915;
  --vktt-muc-card: #27201a;
  --vktt-muc-input: #15110e;
  --vktt-chu-sang: #f4edd9;
  --vktt-chu-nhat: #a69c8b;
  --vktt-chu-do: #a31d1d;
  --vktt-chu-do-sang: #c93b3b;
  --vktt-vang-kim: #c89b3c;
  --vktt-vang-kim-nhat: #e8c77b;
  --vktt-ngoc-luc: #2f7a5c;
  --vktt-ngoc-sang: #44a880;
  --vktt-ma-dao: #7d1d2b;
  --vktt-ma-dao-sang: #a82e42;
  --vktt-vien: rgba(200, 155, 60, 0.28);
  --vktt-vien-dam: rgba(200, 155, 60, 0.45);
  --vktt-vien-subtle: rgba(74, 62, 53, 0.6);
  --vktt-font: "Noto Serif", "Times New Roman", serif;
}

#vktt-drawer, #vktt-drawer *, #vktt-drawer *::before, #vktt-drawer *::after {
  box-sizing: border-box;
  font-family: var(--vktt-font);
}

/* ================= SCROLLBAR ================= */
#vktt-drawer ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
#vktt-drawer ::-webkit-scrollbar-track {
  background: rgba(23, 19, 16, 0.5);
}
#vktt-drawer ::-webkit-scrollbar-thumb {
  background: rgba(166, 156, 139, 0.35);
  border-radius: 3px;
  border: 1px solid rgba(23, 19, 16, 0.8);
}
#vktt-drawer ::-webkit-scrollbar-thumb:hover {
  background: var(--vktt-chu-do);
}

/* ================= FLOATING ACTION BUTTON (FAB) ================= */
#vktt-fab {
  position: fixed;
  bottom: 80px;
  right: 14px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #2a221b 0%, #15110e 100%);
  color: var(--vktt-vang-kim);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  z-index: 9999999;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.8), inset 0 0 0 1.5px var(--vktt-vang-kim), 0 0 10px rgba(200, 155, 60, 0.3);
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
}

#vktt-fab:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.9), inset 0 0 0 2px var(--vktt-vang-kim-nhat), 0 0 14px rgba(200, 155, 60, 0.5);
}

#vktt-fab:active {
  transform: scale(0.92);
  filter: brightness(1.2);
}

/* ================= BACKDROP ================= */
#vktt-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 12, 10, 0.72);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  z-index: 9999998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

#vktt-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

/* ================= BOTTOM SHEET DRAWER ================= */
#vktt-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 100vw;
  height: 86vh;
  max-height: 88vh;
  background: var(--vktt-muc-panel);
  border-top: 2px solid var(--vktt-vang-kim);
  border-radius: 12px 12px 0 0;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.92), inset 0 1px 0 rgba(232, 199, 123, 0.4);
  color: var(--vktt-chu-sang);
  transform: translateY(100%);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  -webkit-user-select: none;
  overflow-x: hidden;
}

/* DESKTOP RESPONSIVE ADJUSTMENT */
@media (min-width: 769px) {
  #vktt-drawer {
    left: auto;
    right: 20px;
    bottom: 20px;
    width: 460px;
    height: 88vh;
    border-radius: 8px;
    border: 1px solid var(--vktt-vien-dam);
    border-top: 2px solid var(--vktt-vang-kim);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(232, 199, 123, 0.4);
  }
}

#vktt-drawer.open {
  transform: translateY(0);
}

/* DRAG HANDLE */
.vktt-drag-handle {
  width: 100%;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  padding-top: 4px;
}

.vktt-drag-bar {
  width: 36px;
  height: 3.5px;
  border-radius: 2px;
  background: rgba(200, 155, 60, 0.35);
}

/* HEADER */
.vktt-header {
  padding: 6px 14px 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--vktt-vien);
  background: rgba(23, 19, 16, 0.6);
}

.vktt-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vktt-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--vktt-vang-kim-nhat);
  letter-spacing: 0.8px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  gap: 6px;
}

.vktt-badge {
  font-size: 9.5px;
  padding: 2px 6px;
  background: rgba(163, 29, 29, 0.25);
  border: 1px solid rgba(163, 29, 29, 0.65);
  color: #f7a5a5;
  border-radius: 3px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.vktt-close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(200, 155, 60, 0.25);
  color: var(--vktt-chu-nhat);
  width: 28px;
  height: 28px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.16s ease;
}

.vktt-close-btn:hover, .vktt-close-btn:active {
  background: rgba(163, 29, 29, 0.35);
  color: #fff;
  border-color: var(--vktt-chu-do);
}

/* ================= TAB BAR (XIANXIA CALLIGRAPHY STRIP) ================= */
.vktt-tabs {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  background: rgba(18, 14, 12, 0.96);
  border-bottom: 1px solid var(--vktt-vien);
  padding: 2px 6px;
  gap: 2px;
}

.vktt-tabs::-webkit-scrollbar {
  display: none;
}

.vktt-tab-btn {
  flex: 0 0 auto;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--vktt-chu-nhat);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.16s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  letter-spacing: 0.3px;
}

.vktt-tab-btn:hover {
  color: var(--vktt-chu-sang);
}

.vktt-tab-btn.active {
  color: var(--vktt-vang-kim-nhat);
  border-bottom: 2px solid var(--vktt-chu-do);
  background: rgba(200, 155, 60, 0.08);
}

/* ================= CONTENT CONTAINER ================= */
.vktt-content {
  flex: 1;
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 12px;
  -webkit-overflow-scrolling: touch;
}

/* ================= STAT OVERVIEW ================= */
.vktt-stat-overview {
  margin-bottom: 8px;
  background: rgba(23, 19, 16, 0.85);
  border: 1px solid var(--vktt-vien);
  padding: 8px 10px;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 10px;
  font-size: 11.5px;
  position: relative;
}

.vktt-stat-overview div {
  color: var(--vktt-chu-nhat);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vktt-stat-overview b {
  color: var(--vktt-chu-sang);
  font-weight: 600;
}

/* ================= CARD / SECTION ================= */
.vktt-card {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  background: var(--vktt-muc-card);
  border: 1px solid var(--vktt-vien-subtle);
  border-radius: 5px;
  padding: 10px 11px;
  margin-bottom: 8px;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.vktt-card-hdr {
  font-size: 13px;
  font-weight: 700;
  color: var(--vktt-vang-kim-nhat);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: 0.3px;
  border-bottom: 1px dashed rgba(200, 155, 60, 0.2);
  padding-bottom: 4px;
}

/* MA DAO CARD VARIANT */
.vktt-card-madao {
  border-color: rgba(163, 29, 29, 0.5);
  background: linear-gradient(180deg, #2a1b1e 0%, #1c1417 100%);
}
.vktt-card-madao .vktt-card-hdr {
  color: #ff9e9e;
  border-bottom-color: rgba(163, 29, 29, 0.4);
}

/* NG\u1EF0 LINH CARD VARIANT */
.vktt-card-ngulinh {
  border-color: rgba(47, 122, 92, 0.45);
  background: linear-gradient(180deg, #1b2620 0%, #151d18 100%);
}
.vktt-card-ngulinh .vktt-card-hdr {
  color: #a7dfc9;
  border-bottom-color: rgba(47, 122, 92, 0.4);
}

/* ================= ROWS & INPUTS ================= */
.vktt-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;
  width: 100%;
  min-width: 0;
}

.vktt-row:last-child {
  margin-bottom: 0;
}

.vktt-lbl {
  width: 88px;
  min-width: 82px;
  color: var(--vktt-chu-nhat);
  font-size: 11.5px;
  font-weight: 600;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vktt-inp {
  flex: 1;
  min-width: 0;
  height: 34px;
  background: var(--vktt-muc-input);
  border: 1px solid var(--vktt-vien-subtle);
  border-radius: 4px;
  padding: 0 8px;
  color: var(--vktt-chu-sang);
  font-size: 12.5px;
  outline: none;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
}

.vktt-inp:focus {
  border-color: var(--vktt-vang-kim);
  box-shadow: 0 0 5px rgba(200, 155, 60, 0.25);
}

.vktt-select {
  height: 34px;
  background: var(--vktt-muc-input);
  border: 1px solid var(--vktt-vien-subtle);
  border-radius: 4px;
  padding: 0 8px;
  color: var(--vktt-chu-sang);
  font-size: 12px;
  outline: none;
  min-width: 0;
  cursor: pointer;
  transition: border-color 0.16s ease;
}

.vktt-select:focus {
  border-color: var(--vktt-vang-kim);
}

.vktt-label {
  display: block;
  font-size: 11px;
  color: var(--vktt-chu-nhat);
  margin-bottom: 4px;
  font-weight: 600;
}

.vktt-input-group {
  display: flex;
  gap: 6px;
  align-items: center;
  width: 100%;
  min-width: 0;
}

/* ================= BUTTONS ================= */
.vktt-btn {
  height: 34px;
  padding: 0 12px;
  background: var(--vktt-chu-do);
  color: #fff;
  border: 1px solid rgba(232, 199, 123, 0.4);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-shrink: 0;
  transition: filter 0.14s ease, transform 0.1s ease, background 0.14s ease;
  letter-spacing: 0.3px;
}

.vktt-btn:hover {
  filter: brightness(1.12);
}

.vktt-btn:active {
  transform: scale(0.97);
  filter: brightness(0.95);
}

.vktt-btn-sm {
  height: 30px;
  padding: 0 9px;
  font-size: 11.5px;
}

.vktt-btn-block {
  width: 100%;
}

/* Button Variants */
.vktt-btn-gold {
  background: var(--vktt-vang-kim);
  color: #171310;
  border-color: #f7e1a3;
  font-weight: 700;
}

.vktt-btn-jade {
  background: var(--vktt-ngoc-luc);
  color: #fff;
  border-color: #55c297;
}

.vktt-btn-madao {
  background: var(--vktt-ma-dao);
  color: #ffe6e6;
  border-color: #d1495b;
}

.vktt-btn-phu {
  background: rgba(43, 35, 29, 0.85);
  color: var(--vktt-chu-sang);
  border: 1px solid var(--vktt-vien-subtle);
}
.vktt-btn-phu:hover {
  background: rgba(58, 48, 40, 0.95);
  border-color: var(--vktt-vien);
}

.vktt-btn-ghost {
  background: transparent;
  color: var(--vktt-chu-nhat);
  border: 1px solid var(--vktt-vien-subtle);
}
.vktt-btn-ghost:hover {
  color: var(--vktt-chu-sang);
  border-color: var(--vktt-vien);
}

/* ================= LINH C\u0102N GRID ================= */
.vktt-linhcan-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin: 6px 0;
  width: 100%;
}

.vktt-chk-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11.5px;
  font-weight: 600;
  background: var(--vktt-muc-input);
  padding: 6px 4px;
  border-radius: 4px;
  border: 1px solid var(--vktt-vien-subtle);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  color: var(--vktt-chu-sang);
  transition: border-color 0.15s ease;
}

.vktt-chk-label:hover {
  border-color: var(--vktt-vang-kim);
}

.vktt-chk-label input {
  margin: 0;
  cursor: pointer;
  accent-color: var(--vktt-chu-do);
}

/* ================= STAT ROW WITH CHECKBOX ================= */
.vktt-stat-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 5px;
  width: 100%;
  min-width: 0;
}

.vktt-stat-row:last-child {
  margin-bottom: 0;
}

.vktt-stat-chk-wrap {
  width: 102px;
  min-width: 92px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--vktt-chu-sang);
  font-weight: 600;
  flex-shrink: 0;
  cursor: pointer;
  white-space: nowrap;
}

.vktt-stat-chk-wrap input {
  margin: 0;
  cursor: pointer;
  accent-color: var(--vktt-chu-do);
}

/* ================= GRID 2 COLUMNS ================= */
.vktt-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  width: 100%;
}

/* ================= DROPDOWN SEARCH SUGGESTIONS ================= */
.vktt-dropdown-list {
  max-height: 190px;
  overflow-y: auto;
  border: 1px solid var(--vktt-vien-dam);
  border-radius: 4px;
  background: var(--vktt-muc-input);
  margin-top: 6px;
  width: 100%;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.7);
}

.vktt-dropdown-item {
  padding: 7px 10px;
  font-size: 11.5px;
  border-bottom: 1px solid rgba(74, 62, 53, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.14s ease;
}

.vktt-dropdown-item:hover, .vktt-dropdown-item:active {
  background: rgba(200, 155, 60, 0.16);
}

.vktt-quality-tag {
  font-size: 9.5px;
  padding: 1px 5px;
  border-radius: 2px;
  font-weight: 700;
}

/* ================= SUB-TABS ================= */
.vktt-subtabs {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.vktt-subtabs::-webkit-scrollbar {
  display: none;
}

.vktt-subtab-btn {
  padding: 5px 10px;
  background: rgba(43, 35, 29, 0.6);
  color: var(--vktt-chu-nhat);
  border: 1px solid var(--vktt-vien-subtle);
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.vktt-subtab-btn:hover {
  color: var(--vktt-chu-sang);
}

.vktt-subtab-btn.active {
  background: rgba(163, 29, 29, 0.28);
  color: #fff;
  border-color: var(--vktt-chu-do);
  font-weight: 700;
}

/* ================= FILTER BARS ================= */
.vktt-filter-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  width: 100%;
  min-width: 0;
}

/* ================= ITEM CATALOG ================= */
.vktt-catalog-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 2px;
}

.vktt-catalog-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--vktt-muc-card);
  border: 1px solid var(--vktt-vien-subtle);
  border-radius: 4px;
  padding: 7px 9px;
  gap: 6px;
  min-width: 0;
}

.vktt-item-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.vktt-item-name {
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 5px;
}

.vktt-item-meta {
  font-size: 10.5px;
  color: var(--vktt-chu-nhat);
  display: flex;
  gap: 6px;
  margin-top: 2px;
  white-space: nowrap;
}

.vktt-item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

/* ================= RECIPE CARDS ================= */
.vktt-recipe-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 440px;
  overflow-y: auto;
  padding-right: 2px;
}

.vktt-recipe-card {
  background: var(--vktt-muc-card);
  border: 1px solid var(--vktt-vien-subtle);
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.vktt-recipe-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--vktt-vang-kim-nhat);
  border-bottom: 1px dashed rgba(200, 155, 60, 0.2);
  padding-bottom: 4px;
}

.vktt-recipe-ing-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 10.5px;
  margin: 3px 0;
}

.vktt-ing-tag {
  background: rgba(21, 17, 14, 0.85);
  border: 1px solid var(--vktt-vien-subtle);
  border-radius: 3px;
  padding: 2px 5px;
  color: var(--vktt-chu-nhat);
}

.vktt-ing-tag.has {
  border-color: var(--vktt-ngoc-luc);
  color: #5ce3af;
}

.vktt-ing-tag.lack {
  border-color: var(--vktt-chu-do);
  color: #ff8585;
}

.vktt-recipe-actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

/* ================= FAMILIAR / BEAST CARDS ================= */
.vktt-familiar-card {
  background: var(--vktt-muc-card);
  border: 1px solid var(--vktt-vien);
  border-radius: 4px;
  padding: 8px 10px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.vktt-familiar-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vktt-familiar-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--vktt-vang-kim-nhat);
  display: flex;
  align-items: center;
  gap: 5px;
}
.vktt-familiar-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
  color: var(--vktt-chu-nhat);
}
.vktt-familiar-actions {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}
`;

  // src/data/presets.ts
  var QUALITY_COLORS = {
    1: "#a1a1aa",
    2: "#4d8b31",
    3: "#3b71ca",
    4: "#38bdf8",
    5: "#f59e0b",
    6: "#d946ef",
    7: "#f43f5e",
    8: "rainbow",
    9: "#a855f7"
  };
  var PRESET_ITEMS = { "item.tho_nap_phap": { "name": "Th\u1ED5 N\u1EA1p Ph\xE1p", "quality": 1, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\xE9p h\xEDt th\u1EDF d\u01B0\u1EE1ng sinh c\u1EE7a lang trung th\xF4n qu\xEA. S\u1ED1ng l\xE2u h\u01A1n m\u1ED9t ch\xFAt, ch\u1EB3ng th\xE0nh ti\xEAn \u0111\u01B0\u1EE3c." }, "item.thiet_bo_sam": { "name": "Thi\u1EBFt B\u1ED1 Sam", "quality": 1, "cat": "C\xF4ng Ph\xE1p", "desc": "Ng\u1EA1nh c\xF4ng c\u1EE7a v\xF5 qu\xE1n, \u0111\xE1nh da th\u1ECBt c\u1EE9ng nh\u01B0 v\u1EA3i s\u1EAFt. Tu s\u0129 nh\xECn th\xEC c\u01B0\u1EDDi, nh\u01B0ng \u0111\u1EE1 \u0111\u01B0\u1EE3c v\xE0i \u0111\xF2n." }, "item.ngu_cam_hi": { "name": "Ng\u0169 C\u1EA7m H\xED", "quality": 1, "cat": "C\xF4ng Ph\xE1p", "desc": "B\u1EAFt ch\u01B0\u1EDBc h\u1ED5, h\u01B0\u01A1u, g\u1EA5u, v\u01B0\u1EE3n, chim m\xE0 v\u1EADn \u0111\u1ED9ng g\xE2n c\u1ED1t. Nh\u1EB9 ng\u01B0\u1EDDi, nhanh ch\xE2n." }, "item.dan_khi_quyet": { "name": "D\u1EABn Kh\xED Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Kh\u1EA9u quy\u1EBFt nh\u1EADp m\xF4n ai c\u0169ng h\u1ECDc, d\u1EABn linh kh\xED tr\u1EDDi \u0111\u1EA5t v\xE0o \u0111an \u0111i\u1EC1n. Kh\xF4ng thu\u1ED9c h\u1EC7 n\xE0o, nh\u01B0ng n\u1EC1n m\xF3ng \u0111\u1EB7t ngay ng\u1EAFn th\xEC l\xFAc ph\xE1 c\u1EA3nh b\u1EDBt ch\xF4ng ch\xEAnh." }, "item.thanh_moc_quyet": { "name": "Thanh M\u1ED9c Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1ED5 n\u1EA1p sinh kh\xED c\u1ECF c\xE2y, tu luy\u1EC7n \xEAm m\xE0 b\u1EC1n. R\u1EC5 \u0103n s\xE2u th\xEC c\xE2y l\xEAn cao kh\xF4ng \u0111\u1ED5." }, "item.liet_hoa_quyet": { "name": "Li\u1EC7t H\u1ECFa Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t linh kh\xED trong kinh m\u1EA1ch cho n\xF3ng l\xEAn. Nhanh, nh\u01B0ng kh\xF4 ng\u01B0\u1EDDi." }, "item.huyen_thuy_quyet": { "name": "Huy\u1EC1n Th\u1EE7y Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Linh kh\xED ch\u1EA3y nh\u01B0 n\u01B0\u1EDBc, th\u1EA5m d\u1EA7n v\xE0o kinh m\u1EA1ch." }, "item.canh_kim_quyet": { "name": "Canh Kim Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "M\xE0i linh kh\xED s\u1EAFc nh\u01B0 l\u01B0\u1EE1i ki\u1EBFm. Ki\u1EBFm tu \u0110\u1EA1i Ung ai c\u0169ng b\u1EAFt \u0111\u1EA7u t\u1EEB \u0111\xE2y." }, "item.hau_tho_quyet": { "name": "H\u1EADu Th\u1ED5 Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "N\xE9n linh kh\xED xu\u1ED1ng x\u01B0\u01A1ng c\u1ED1t, th\xE2n n\u1EB7ng nh\u01B0 \u0111\u1EA5t." }, "item.am_han_quyet": { "name": "\xC2m H\xE0n Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1EABn h\xE0n kh\xED theo kinh m\u1EA1ch. Ng\u01B0\u1EDDi th\u01B0\u1EDDng luy\u1EC7n th\xEC tay ch\xE2n l\u1EA1nh bu\u1ED1t; ng\u01B0\u1EDDi mang b\u0103ng linh c\u0103n th\xEC nh\u01B0 c\xE1 g\u1EB7p n\u01B0\u1EDBc." }, "item.truong_xuan_cong": { "name": "Tr\u01B0\u1EDDng Xu\xE2n C\xF4ng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "C\xF4ng ph\xE1p d\u01B0\u1EE1ng sinh c\u1EE7a \u0110an H\xE0 C\u1ED1c, linh kh\xED sinh s\xF4i kh\xF4ng d\u1EE9t." }, "item.xich_duong_cong": { "name": "X\xEDch D\u01B0\u01A1ng C\xF4ng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n linh kh\xED nh\u01B0 m\u1EB7t tr\u1EDDi gi\u1EEFa tr\u01B0a. H\u1ECFa tu \u1EDF bi\xEAn \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c truy\u1EC1n tay nhau." }, "item.bich_lac_kinh": { "name": "B\xEDch L\u1EA1c Kinh", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Qu\xE1n t\u01B0\u1EDFng tr\u1EDDi xanh v\xE0 bi\u1EC3n bi\u1EBFc, th\u1EA7n th\u1EE9c theo \u0111\xF3 m\xE0 trong. L\xF2ng trong th\xEC th\u1EA5y r\xF5 b\xECnh c\u1EA3nh n\u1EB1m \u1EDF \u0111\xE2u." }, "item.kim_cang_quyet": { "name": "Kim Cang Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\xE2n nh\u01B0 kim cang, kh\xED \u0111i m\u1ED9t \u0111\u01B0\u1EDDng th\u1EB3ng t\u1EAFp." }, "item.tho_linh_kinh": { "name": "Th\u1ED5 Linh Kinh", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh v\u0103n th\u1EC3 tu B\u1EAFc Minh. Ch\u1EADm, nh\u01B0ng ch\u1ECBu \u0111\xF2n nh\u01B0 t\u01B0\u1EDDng th\xE0nh." }, "item.dan_loi_quyet": { "name": "D\u1EABn L\xF4i Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1EABn s\u1EA5m v\xE0o kinh m\u1EA1ch. Kh\xF4ng c\xF3 l\xF4i linh c\u0103n th\xEC \u0111\u1EEBng th\u1EED." }, "item.thai_at_quy_nguyen": { "name": "Th\xE1i \u1EA4t Quy Nguy\xEAn C\xF4ng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy v\u1EA1n ph\xE1p v\u1EC1 m\u1ED9t, c\u1EE7ng c\u1ED1 c\u0103n c\u01A1 tr\u01B0\u1EDBc ng\xE0y ph\xE1 c\u1EA3nh. Kh\xF4ng thi\xEAn h\u1EC7 n\xE0o, h\u1EE3p v\u1EDBi ng\u01B0\u1EDDi linh c\u0103n h\u1ED7n t\u1EA1p." }, "item.cuu_chuyen_huyen_hoa_cong": { "name": "C\u1EEDu Chuy\u1EC3n Huy\u1EC1n H\u1ECFa C\xF4ng", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n linh h\u1ECFa ch\xEDn v\xF2ng trong kinh m\u1EA1ch, m\u1ED7i v\xF2ng \u0111\u1ED1t \u0111i m\u1ED9t l\u1EDBp t\u1EA1p ch\u1EA5t. Kinh m\u1EA1ch s\u1EA1ch th\xEC l\xFAc ph\xE1 c\u1EA3nh linh kh\xED x\xF4ng qua kh\xF4ng v\u01B0\u1EDBng." }, "item.van_moc_truong_sinh_quyet": { "name": "V\u1EA1n M\u1ED9c Tr\u01B0\u1EDDng Sinh Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p ch\xE2n truy\u1EC1n c\u1EE7a \u0110an H\xE0 C\u1ED1c. Sinh kh\xED c\u1ECF c\xE2y g\u1ED9t r\u1EEDa t\xE2m c\u1EA3nh, t\xE2m ma kh\xF3 b\xE1m." }, "item.thai_thuong_huyen_thuy_kinh": { "name": "Th\xE1i Th\u01B0\u1EE3ng Huy\u1EC1n Th\u1EE7y Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "B\u1EA3n ch\xE9p tay t\u1EEB Trung Ch\xE2u tr\u01B0\u1EDBc ng\xE0y ch\xECm. Linh kh\xED ch\u1EA3y nh\u01B0 s\xF4ng l\u1EDBn ra bi\u1EC3n, kh\xF4ng g\xEC c\u1EA3n n\u1ED5i." }, "item.thai_thanh_tien_kinh": { "name": "Th\xE1i Thanh Ti\xEAn Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ti\xEAn kinh ch\xE9p tr\xEAn ng\u1ECDc gi\u1EA3n Linh gi\u1EDBi. \u0110\u1ECDc m\u1ED9t ch\u1EEF, kinh m\u1EA1ch rung nh\u01B0 d\xE2y \u0111\xE0n b\u1ECB g\u1EA3y." }, "item.thanh_de_truong_xuan_kinh": { "name": "Thanh \u0110\u1EBF Tr\u01B0\u1EDDng Xu\xE2n Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p c\u1EE7a m\u1ED9t ti\xEAn nh\xE2n gi\u1EEF v\u01B0\u1EDDn Linh gi\u1EDBi, ch\xE9p tr\xEAn th\u1EBB g\u1ED7 kh\xF4ng bao gi\u1EDD m\u1EE5c. Luy\u1EC7n t\u1EDBi \u0111\xE2u, kinh m\u1EA1ch xanh nh\u01B0 c\xE0nh non t\u1EDBi \u0111\xF3." }, "item.huyen_hoang_tao_hoa_kinh": { "name": "Huy\u1EC1n Ho\xE0ng T\u1EA1o H\xF3a Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Kh\u1EAFc tr\xEAn v\xE1ch \u0111\xE1 m\u1ED9t ng\u1ECDn n\xFAi Trung Ch\xE2u c\xF2n nh\xF4 kh\u1ECFi m\u1EB7t bi\u1EC3n. Tr\u1EDDi \u0111en \u0111\u1EA5t v\xE0ng, ng\u01B0\u1EDDi luy\u1EC7n \u0111\u1EE9ng y\xEAn nh\u01B0 n\xFAi m\xE0 linh kh\xED t\u1EF1 t\xECm t\u1EDBi, b\xECnh c\u1EA3nh c\u0169ng t\u1EF1 m\xF2n." }, "item.ngu_to_hop_dao_quyet": { "name": "Ng\u0169 T\u1ED5 H\u1EE3p \u0110\u1EA1o Quy\u1EBFt", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p n\u0103m t\u1ED5 s\u01B0 c\xF9ng so\u1EA1n khi phong Thi\xEAn M\xF4n. V\xF4 s\u1EAFc, v\xEC n\xF3 dung \u0111\u01B0\u1EE3c c\u1EA3 ng\u0169 h\xE0nh." }, "item.luan_hoi_chan_kinh": { "name": "Lu\xE2n H\u1ED3i Ch\xE2n Kinh", "quality": 8, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh v\u0103n kh\xF4ng ch\xE9p tr\xEAn gi\u1EA5y m\xE0 kh\u1EAFc v\xE0o ch\xE2n linh. B\xE1t canh M\u1EA1nh B\xE0 x\xF3a \u0111\u01B0\u1EE3c t\xEAn h\u1ECD, kh\xF4ng x\xF3a \u0111\u01B0\u1EE3c n\xF3." }, "item.liet_diem_chuong": { "name": "Li\u1EC7t Di\u1EC5m Ch\u01B0\u1EDFng", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1ED3n linh kh\xED v\xE0o l\xF2ng b\xE0n tay m\xE0 \u0111\xE1nh ra, ch\u01B0\u1EDFng phong n\xF3ng r\xE1t. Luy\u1EC7n c\xE0ng s\xE2u, ch\u01B0\u1EDFng c\xE0ng n\u1EB7ng." }, "item.kim_chung_trao": { "name": "Kim Chung Tr\xE1o", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "V\u1EADn kh\xED th\xE0nh m\u1ED9t chi\u1EBFc chu\xF4ng v\xE0ng \xFAp quanh th\xE2n. H\xF2a th\u01B0\u1EE3ng kh\u1EA5t th\u1EF1c truy\u1EC1n cho ng\u01B0\u1EDDi n\xE0o ch\u1ECBu nghe kinh." }, "item.trien_ti_thu": { "name": "Tri\u1EC1n Ti Th\u1EE7", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Tay qu\u1EA5n nh\u01B0 d\xE2y leo, kh\xF3a kh\u1EDBp \u0111\u1ED1i th\u1EE7. V\xF5 qu\xE1n th\u1EBF t\u1EE5c c\u0169ng d\u1EA1y, nh\u01B0ng c\xF3 linh kh\xED th\xEC kh\xE1c h\u1EB3n." }, "item.bich_thuy_hoi_xuan": { "name": "B\xEDch Th\u1EE7y H\u1ED3i Xu\xE2n Thu\u1EADt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1EABn th\u1EE7y kh\xED ch\u1EA3y qua v\u1EBFt th\u01B0\u01A1ng, th\u1ECBt da li\u1EC1n l\u1EA1i. Lang trung c\xF3 tu vi hay d\xF9ng." }, "item.thanh_van_kiem_quyet": { "name": "Thanh V\xE2n Ki\u1EBFm Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm quy\u1EBFt Thanh V\xE2n M\xF4n. Kh\xF4ng c\u1EA7n ki\u1EBFm trong tay, ng\xF3n tay ch\u1EC9 t\u1EDBi \u0111\xE2u ki\u1EBFm kh\xED t\u1EDBi \u0111\xF3." }, "item.ban_thach_ho_the": { "name": "B\xE0n Th\u1EA1ch H\u1ED9 Th\u1EC3 C\xF4ng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EC3 tu B\u1EAFc Minh v\u1EADn c\xF4ng, da th\u1ECBt h\xF3a \u0111\xE1 trong ch\u1ED1c l\xE1t. \u0110ao ki\u1EBFm ch\xE9m v\xE0o t\xF3e l\u1EEDa." }, "item.liet_dia_quyen": { "name": "Li\u1EC7t \u0110\u1ECBa Quy\u1EC1n", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy\u1EC1n ph\xE1p th\u1EC3 tu Huy\u1EC1n V\u0169 M\xF4n \u0111\u1EC3 l\u1ECDt ra ngo\xE0i. M\u1ED9t quy\u1EC1n n\u1EC7n xu\u1ED1ng, \u0111\u1EA5t n\u1EE9t ba tr\u01B0\u1EE3ng, kh\xED l\u1EF1c c\xF2n d\u1ED3n l\u1EA1i trong n\u1EAFm tay." }, "item.thu_thuy_kiem_quyet": { "name": "Thu Th\u1EE7y Ki\u1EBFm Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm quy\u1EBFt c\u1EE7a m\u1ED9t ki\u1EBFm tu \u1EA9n c\u01B0 b\xEAn h\u1ED3 thu. Ki\u1EBFm kh\xED m\u1ECFng nh\u01B0 m\u1EB7t n\u01B0\u1EDBc, kim sinh th\u1EE7y n\xEAn c\xE0ng ch\xE9m c\xE0ng nhu\u1EA7n." }, "item.kho_moc_phung_xuan_quyet": { "name": "Kh\xF4 M\u1ED9c Ph\xF9ng Xu\xE2n Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "B\xED thu\u1EADt ch\u1EEFa th\u01B0\u01A1ng c\u1EE7a \u0110an H\xE0 C\u1ED1c. G\u1ED7 m\u1EE5c c\xF2n \u0111\xE2m ch\u1ED3i, hu\u1ED1ng h\u1ED3 th\xE2n ng\u01B0\u1EDDi." }, "item.vinh_trieu_chuong": { "name": "V\u0129nh Tri\u1EC1u Ch\u01B0\u1EDFng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xE9p t\u1EEB Trung Ch\xE2u, ng\u01B0\u1EDDi so\u1EA1n t\u1EADn m\u1EAFt th\u1EA5y bi\u1EC3n V\u0129nh Tri\u1EC1u nu\u1ED1t \u0111\u1EA5t. Ch\u01B0\u1EDFng ra t\u1EEBng l\u1EDBp nh\u01B0 s\xF3ng, l\u1EDBp sau n\u1EB7ng h\u01A1n l\u1EDBp tr\u01B0\u1EDBc." }, "item.cuu_tieu_ngu_loi_quyet": { "name": "C\u1EEDu Ti\xEAu Ng\u1EF1 L\xF4i Quy\u1EBFt", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\xE1p quy\u1EBFt l\xF4i tu Linh gi\u1EDBi, r\u01A1i xu\u1ED1ng Nh\xE2n gi\u1EDBi c\xF9ng tr\u1EADn s\xE9t cu\u1ED1i c\xF9ng tr\u01B0\u1EDBc ng\xE0y Thi\xEAn M\xF4n kh\xE9p. Ng\xF3n tay ch\u1EC9 l\xEAn tr\u1EDDi, ch\xEDn t\u1EA7ng m\xE2y tr\u1EA3 s\u1EA5m xu\u1ED1ng." }, "item.moc_hoa_thong_linh_quyet": { "name": "M\u1ED9c H\u1ECFa Th\xF4ng Linh Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "C\u1EE7i nu\xF4i l\u1EEDa, l\u1EEDa s\u01B0\u1EDFi r\u1EEBng. Hai lu\u1ED3ng linh kh\xED M\u1ED9c H\u1ECFa n\u1ED1i \u0111u\xF4i nhau ch\u1EA1y, ng\u01B0\u1EDDi song linh c\u0103n M\u1ED9c H\u1ECFa luy\u1EC7n th\xEC nh\u01B0 c\xE1 g\u1EB7p n\u01B0\u1EDBc." }, "item.loi_hoa_pha_ta_chuong": { "name": "L\xF4i H\u1ECFa Ph\xE1 T\xE0 Ch\u01B0\u1EDFng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u01B0\u1EDFng ph\xE1p c\u1EE7a c\xE1c ph\xE1i tr\u1EEB t\xE0, s\u1EA5m d\u1EABn \u0111\u01B0\u1EDDng, l\u1EEDa theo sau. \xC2m h\u1ED3n, c\u01B0\u01A1ng thi tr\xFAng ph\u1EA3i th\xEC tan th\xE0nh tro." }, "item.thuy_moc_truong_thanh_kinh": { "name": "Th\u1EE7y M\u1ED9c Tr\u01B0\u1EDDng Thanh Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "N\u01B0\u1EDBc t\u01B0\u1EDBi c\xE2y, c\xE2y gi\u1EEF n\u01B0\u1EDBc. Ng\u01B0\u1EDDi luy\u1EC7n da th\u1ECBt h\u1ED3ng h\xE0o, th\u01B0\u01A1ng t\xEDch l\xE0nh nhanh nh\u01B0 c\u1ECF xu\xE2n." }, "item.thuy_hoa_tuong_te_kinh": { "name": "Th\u1EE7y H\u1ECFa T\u01B0\u01A1ng T\u1EBF Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EE7y h\u1ECFa v\u1ED1n b\u1EA5t dung, c\u01B0\u1EE1ng \xE9p t\u01B0\u01A1ng t\u1EBF th\xEC linh l\u1EF1c cu\u1ED3n cu\u1ED9n, nh\u01B0ng kinh m\u1EA1ch nh\u01B0 n\u1ED3i n\u01B0\u1EDBc s\xF4i tr\xEAn l\u1EEDa, luy\u1EC7n th\xEC ph\u1EA3i g\xE1nh m\u1ED9t ph\u1EA7n ngh\u1ECBch kh\xED. C\xF4ng ph\xE1p c\xF3 th\xEAm M\u1ED9c th\xF4ng quan \u1EDF gi\u1EEFa th\xEC m\u1EDBi y\xEAn." }, "item.tam_nguyen_quy_nhat_cong": { "name": "Tam Nguy\xEAn Quy Nh\u1EA5t C\xF4ng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1EA5t sinh v\xE0ng, v\xE0ng sinh n\u01B0\u1EDBc, ba nguy\xEAn kh\xED n\u1ED1i th\xE0nh m\u1ED9t d\xF2ng, l\xFAc ph\xE1 c\u1EA3nh d\u1ED3n c\u1EA3 v\xE0o m\u1ED9t ch\u1ED7. Th\u1ED5 v\u1ED1n kh\u1EAFc Th\u1EE7y, c\xF3 Kim \u0111\u1EE9ng gi\u1EEFa th\xF4ng quan n\xEAn kh\xF4ng xung." }, "item.thanh_van_van_kiem_quyet": { "name": "Thanh V\xE2n V\u1EA1n Ki\u1EBFm Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u1EA5n ph\xE1i ki\u1EBFm quy\u1EBFt c\u1EE7a Thanh V\xE2n Ki\u1EBFm T\xF4ng. M\u1ED9t \xFD ni\u1EC7m sinh v\u1EA1n \u0111\u1EA1o ki\u1EBFm kh\xED, \u0111\u1EC7 t\u1EED ch\xE2n truy\u1EC1n m\u1EDBi \u0111\u01B0\u1EE3c ch\xE9p." }, "item.dan_ha_bat_diet_kinh": { "name": "\u0110an H\xE0 B\u1EA5t Di\u1EC7t Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u1EA5n ph\xE1i t\xE2m ph\xE1p c\u1EE7a \u0110an H\xE0 C\u1ED1c. L\u1EA5y th\xE2n l\xE0m l\xF2, l\u1EA5y ch\xE2n h\u1ECFa l\xE0m l\u1EEDa, th\u01B0\u01A1ng th\u1EBF t\u1EF1 luy\u1EC7n th\xE0nh sinh c\u01A1." }, "item.huyet_sat_phan_thien_cong": { "name": "Huy\u1EBFt S\xE1t Ph\u1EA7n Thi\xEAn C\xF4ng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u1EA5n ph\xE1i c\xF4ng ph\xE1p c\u1EE7a Huy\u1EBFt S\xE1t T\xF4ng. S\xE1t kh\xED ba tr\u0103m n\u0103m tr\u1EA5n \u1EA3i ng\u01B0ng th\xE0nh, kh\xF4ng m\xE0u, kh\xF4ng \u0111\xE1y, ch\u1EC9 bi\u1EBFt nu\u1ED1t." }, "item.huyen_vu_tran_hai_kinh": { "name": "Huy\u1EC1n V\u0169 Tr\u1EA5n H\u1EA3i Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u1EA5n ph\xE1i c\u1EE7a Huy\u1EC1n V\u0169 M\xF4n. Th\xE2n nh\u01B0 mai r\xF9a \u0111\u1ED9i n\xFAi, s\xF3ng B\u1EAFc Minh \u0111\u1EADp ng\xE0n n\u0103m kh\xF4ng m\xF2n." }, "item.kim_cuong_bat_hoai_than": { "name": "Kim C\u01B0\u01A1ng B\u1EA5t Ho\u1EA1i Th\xE2n", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u1EA5n t\u1EF1 chi ph\xE1p c\u1EE7a Kim C\u01B0\u01A1ng T\u1EF1. Th\xE2n th\xE0nh kim c\u01B0\u01A1ng th\xEC t\xE2m c\u0169ng nh\u01B0 kim c\u01B0\u01A1ng, ma ni\u1EC7m kh\xF4ng ch\u1ED7 b\xE1m." }, "item.minh_kinh_chi_thuy_quyet": { "name": "Minh K\xEDnh Ch\u1EC9 Th\u1EE7y Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "G\u01B0\u01A1ng \u0111\u1ED3ng lau s\xE1ng, n\u01B0\u1EDBc l\u1EB7ng kh\xF4ng g\u1EE3n. Ph\xF9 s\u01B0 luy\u1EC7n cho t\xE2m t\u0129nh, n\xE9t b\xFAt kh\xF4ng run; t\u1EA1p ni\u1EC7m tr\u1ED3i l\xEAn th\xEC soi \u0111\u01B0\u1EE3c ngay \u0111\xE1y." }, "item.xuan_vu_nhuan_mach_quyet": { "name": "Xu\xE2n V\u0169 Nhu\u1EADn M\u1EA1ch Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "M\u01B0a xu\xE2n th\u1EA5m \u0111\u1EA5t, r\u1EC5 c\xE2y u\u1ED1ng no. \u0110an s\u01B0 \u0110an H\xE0 C\u1ED1c d\u1EA1y \u0111\u1EC7 t\u1EED nh\u1EADp m\xF4n, kinh m\u1EA1ch nhu\u1EADn r\u1ED3i th\xEC ch\u1ECBu \u0111\u01B0\u1EE3c h\u01A1i l\xF2 n\xF3ng." }, "item.xich_nham_doan_the_quyet": { "name": "X\xEDch Nham \u0110o\xE1n Th\u1EC3 Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EC3 tu ng\u1ED3i tr\xEAn \u0111\xE1 n\xF3ng c\u1EA1nh mi\u1EC7ng n\xFAi l\u1EEDa, \u0111\u1EC3 h\u01A1i l\u1EEDa nung da r\u1ED3i \u0111\u1EA5t \u0111\xE1 ngu\u1ED9i d\u1EA7n trong th\u1ECBt. Luy\u1EC7n ba n\u0103m, \u0111ao th\u01B0\u1EDDng ch\xE9m v\xE0o ch\u1EC9 \u0111\u1EC3 v\u1EC7t tr\u1EAFng." }, "item.thach_trung_tang_kim_quyet": { "name": "Th\u1EA1ch Trung T\xE0ng Kim Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "V\xE0ng n\u1EB1m trong \u0111\xE1 ng\xE0n n\u0103m, \u0111\xE1 v\u1EE1 v\xE0ng c\xF2n. Tr\u1EADn s\u01B0 l\u1EA5y \u0111\u1EA5t nu\xF4i kim kh\xED trong x\u01B0\u01A1ng, \u0111\u1EE9ng gi\u1EEF m\u1EAFt tr\u1EADn c\u1EA3 \u0111\xEAm kh\xF4ng lay." }, "item.suong_nhan_ngung_than_kinh": { "name": "S\u01B0\u01A1ng Nh\u1EADn Ng\u01B0ng Th\u1EA7n Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm tu B\u1EAFc Minh luy\u1EC7n gi\u1EEFa tuy\u1EBFt, kim kh\xED \u1EDF gi\u1EEFa, h\xE0n kh\xED b\u1ECDc quanh nh\u01B0 s\u01B0\u01A1ng \u0111\xF3ng tr\xEAn l\u01B0\u1EE1i ki\u1EBFm. T\xE2m l\u1EA1nh th\xEC m\u1EAFt s\xE1ng, tay nhanh." }, "item.loi_am_phan_tam_kinh": { "name": "L\xF4i \xC2m Ph\u1EA7n T\xE2m Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh c\u1EE7a m\u1ED9t ch\xF9a tr\u1EEB t\xE0 n\u01B0\u1EDBc Vi\xEAm. Ti\u1EBFng s\u1EA5m g\u1ECDi t\xE2m ma ra, l\u1EEDa \u0111\u1ED1t n\xF3 \u0111i, s\u01B0 t\u0103ng t\u1EE5ng xong m\u1ED9t bi\u1EBFn th\xEC m\u1ED3 h\xF4i \u0111\u1EABm \xE1o m\xE0 l\xF2ng nh\u1EB9 b\u1EABng." }, "item.dia_hoa_on_lo_kinh": { "name": "\u0110\u1ECBa H\u1ECFa \xD4n L\xF4 Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n kh\xED s\u01B0 coi th\xE2n m\xECnh l\xE0 l\xF2, \u0111an \u0111i\u1EC1n l\xE0 \u0111\xE1y l\xF2 \u0111\u1EAFp \u0111\u1EA5t d\xE0y. L\u1EEDa gi\u1EEF \u1EA5m c\u1EA3 ng\xE0y kh\xF4ng t\u1EAFt, th\u1EA7n th\u1EE9c nghe \u0111\u01B0\u1EE3c ti\u1EBFng ph\xF4i s\u1EAFt n\xF3ng d\u1EA7n." }, "item.phi_sa_gian_kim_kinh": { "name": "Phi Sa Gi\u1EA3n Kim Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\xE3i c\xE1t t\xECm v\xE0ng, tr\u0103m \u0111\u1EA5u c\xE1t \u0111\u01B0\u1EE3c m\u1ED9t h\u1EA1t. Ng\u01B0\u1EDDi so\u1EA1n v\u1ED1n th\u1EE3 \u0111\xE3i v\xE0ng b\xEAn s\xF4ng, ng\u1ED9 ra tu luy\u1EC7n c\u0169ng l\xE0 g\u1EA1n b\u1ECF t\u1EA1p ch\u1EA5t, ch\u1ED7 c\xF2n l\u1EA1i m\u1EDBi \u0111\xE1ng gi\u1EEF." }, "item.lang_ba_ngu_phong_kinh": { "name": "L\u0103ng Ba Ng\u1EF1 Phong Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "B\u01B0\u1EDBc tr\xEAn s\xF3ng, c\u01B0\u1EE1i tr\xEAn gi\xF3. N\u01B0\u1EDBc n\xE2ng g\xF3t, gi\xF3 \u0111\u1EA9y l\u01B0ng, hai lu\u1ED3ng kh\xED \u0111an nhau nh\u01B0 v\u1EA3y c\xE1; ng\u01B0\u1EDDi luy\u1EC7n th\xE0nh \u0111i tr\xEAn m\u1EB7t h\u1ED3 kh\xF4ng \u01B0\u1EDBt gi\xE0y." }, "item.luyen_doc_quyet": { "name": "Luy\u1EC7n \u0110\u1ED9c Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "M\u1ED7i \u0111\xEAm nu\u1ED1t m\u1ED9t gi\u1ECDt n\u1ECDc r\u1EAFn pha r\u01B0\u1EE3u, d\u1EABn \u0111\u1ED9c ch\u1EA1y m\u1ED9t v\xF2ng kinh m\u1EA1ch r\u1ED3i \xE9p ra \u0111\u1EA7u ng\xF3n tay. Ba th\xE1ng sau m\xF3ng tay \u0111en l\u1EA1i, u\u1ED1ng nh\u1EA7m thu\u1ED1c chu\u1ED9t c\u0169ng kh\xF4ng ch\u1EBFt." }, "item.thuc_doc_tam_kinh": { "name": "Th\u1EF1c \u0110\u1ED9c T\xE2m Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "L\u1EA5y \u0111\u1ED9c l\xE0m c\u01A1m, l\u1EA5y c\u1ED5 l\xE0m thu\u1ED1c b\u1ED5, \u0111\u1ED9c v\xE0o b\u1EE5ng h\xF3a th\xE0nh ch\xE2n nguy\xEAn. H\u01A1i th\u1EDF ng\u01B0\u1EDDi tu l\xE2u l\u1EA1nh v\xE0 tanh nh\u01B0 \u0111\xE1y gi\u1EBFng, n\xEAn ma kh\xED tr\xEAn ng\u01B0\u1EDDi c\u0169ng b\u1ECB \xE1t \u0111i \xEDt nhi\u1EC1u." }, "item.hac_sa_doc_chuong": { "name": "H\u1EAFc Sa \u0110\u1ED9c Ch\u01B0\u1EDFng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n b\u1EB1ng c\xE1ch th\u1ECDc tay v\xE0o ch\u1EA3o c\xE1t s\u1EAFt tr\u1ED9n \u0111\u1ED9c r\u1EAFn, ng\xE0y tr\u0103m l\u1EA7n. Ch\u01B0\u1EDFng in l\xEAn ng\u1EF1c ai th\xEC \u0111\u1EC3 l\u1EA1i d\u1EA5u b\xE0n tay \u0111en; ma ni\u1EC7m ch\u1EE7 nh\xE2n c\xE0ng n\u1EB7ng, d\u1EA5u c\xE0ng l\xE2u tan." }, "item.phe_tam_doc_chi": { "name": "Ph\u1EC7 T\xE2m \u0110\u1ED9c Ch\u1EC9", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1ED3n \u0111\u1ED9c v\xE0o \u0111\u1EA7u ng\xF3n tay, \u0111i\u1EC3m tr\xFAng huy\u1EC7t n\xE0o th\xEC \u0111\u1ED9c theo huy\u1EC7t \u1EA5y ch\u1EA1y th\u1EB3ng v\u1EC1 tim. M\u1ED7i l\u1EA7n ra ch\u1EC9, ch\xFAt \u0111\u1ED9c kh\xED c\u0169ng ng\u1EA5m ng\u01B0\u1EE3c v\xE0o l\xF2ng k\u1EBB ra tay." }, "item.doc_long_tho_tuc": { "name": "\u0110\u1ED9c Long Th\u1ED5 T\u1EE9c", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "B\xED truy\u1EC1n c\u1EE7a C\u1ED5 Long Huy\u1EBFt T\xF4ng, n\xF3i t\u1ED5 s\u01B0 t\u1EEBng nu\u1ED1t t\xFAi \u0111\u1ED9c c\u1EE7a m\u1ED9t con giao long. \u0110\u1ED1t ma ni\u1EC7m trong l\u1ED3ng ng\u1EF1c r\u1ED3i phun ra m\u1ED9t l\xE0n kh\xF3i xanh, c\u1ECF c\xE2y n\u01A1i kh\xF3i qua h\xE9o r\u0169 trong ch\u1EDBp m\u1EAFt." }, "item.hoa_cot_than_chuong": { "name": "H\xF3a C\u1ED1t Th\u1EA7n Ch\u01B0\u1EDFng", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u01B0\u1EDFng nh\u1EB9 nh\u01B0 ph\u1EE7i b\u1EE5i, tr\xFAng ng\u01B0\u1EDDi kh\xF4ng th\u1EA5y v\u1EBFt. Ba ng\xE0y sau x\u01B0\u01A1ng k\u1EBB \u0111\xF3 m\u1EC1m nh\u01B0 b\xFAn, c\xF2n \u0111\u1ED9c kh\xED d\u1ED9i ng\u01B0\u1EE3c l\xE0m ma ni\u1EC7m ng\u01B0\u1EDDi ra ch\u01B0\u1EDFng d\xE0y th\xEAm." }, "item.hu_thuy_chuong": { "name": "H\u1EE7 Th\u1EE7y Ch\u01B0\u1EDFng", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n b\u1EB1ng c\xE1ch ng\xE2m hai tay trong n\u01B0\u1EDBc \u0111\u1EA7m th\u1ED1i, da tr\xF3c r\u1ED3i l\u1EA1i l\xE0nh, l\xE0nh r\u1ED3i l\u1EA1i tr\xF3c. Ch\u01B0\u1EDFng ra mang theo m\xF9i b\xF9n, tr\xFAng ai th\xEC v\u1EBFt b\u1EA7m loang nh\u01B0 r\xEAu." }, "item.lam_chuong_tam_kinh": { "name": "Lam Ch\u01B0\u1EDBng T\xE2m Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ng\u1ED3i gi\u1EEFa r\u1EEBng ch\u01B0\u1EDBng kh\xED mi\u1EC1n nam, h\xEDt kh\xED \u0111\u1ED9c b\u1ED1c l\xEAn t\u1EEB \u0111\u1EA5t \u1EA9m m\xE0 luy\u1EC7n th\xE0nh ch\xE2n nguy\xEAn. Ng\u01B0\u1EDDi tu l\xE2u da x\xE1m nh\u01B0 \u0111\u1EA5t, kh\xED \u0111\u1ED9c th\u1EA5m v\xE0o th\u1ECBt th\xE0nh m\u1ED9t l\u1EDBp gi\xE1p m\u1ECFng." }, "item.ngu_chuong_huyen_cong": { "name": "Ng\u0169 Ch\u01B0\u1EDBng Huy\u1EC1n C\xF4ng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Gom n\u0103m th\u1EE9 ch\u01B0\u1EDBng kh\xED c\u1EE7a \u0111\u1EA7m l\u1EA7y, n\xFAi \u0111\xE1, hang s\xE2u, r\u1EEBng gi\xE0, b\xE3i tha ma v\xE0o l\xF2ng b\xE0n tay r\u1ED3i vung ra th\xE0nh m\xE0n s\u01B0\u01A1ng v\xE0ng. Kh\xED \u0111\u1ED9c d\u1ED9i ng\u01B0\u1EE3c l\xE0m ma ni\u1EC7m ng\u01B0\u1EDDi vung d\xE0y th\xEAm." }, "item.kim_tam_tam_kinh": { "name": "Kim T\u1EB1m T\xE2m Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Nu\xF4i m\u1ED9t con Kim T\u1EB1m trong \u0111an \u0111i\u1EC1n, cho n\xF3 g\u1EB7m kim kh\xED m\xE0 nh\u1EA3 ra ch\xE2n nguy\xEAn. Ng\u01B0\u1EDDi tu l\xE2u nghe trong b\u1EE5ng c\xF3 ti\u1EBFng s\u1ED9t so\u1EA1t nh\u01B0 t\u1EB1m \u0103n l\xE1 d\xE2u." }, "item.phan_doc_chan_kinh": { "name": "Ph\u1EA7n \u0110\u1ED9c Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "L\u1EA5y l\u1EEDa \u0111\u1ED1t tr\u0103m \u0111\u1ED9c th\xE0nh tro, nu\u1ED1t tro v\xE0o luy\u1EC7n l\u1EA1i th\xE0nh l\u1EEDa. H\u01A1i th\u1EDF ng\u01B0\u1EDDi tu sau c\xF9ng c\xF3 m\xE0u xanh l\u1EE5c, th\u1ED5i t\u1EAFt \u0111\xE8n th\xEC b\u1EA5c \u0111\xE8n ch\xE1y \u0111en." }, "item.trien_xa_thu": { "name": "Tri\u1EC1n X\xE0 Th\u1EE7", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "C\xE1nh tay m\u1EC1m nh\u01B0 th\xE2n r\u1EAFn, qu\u1EA5n l\u1EA5y c\u1ED5 \u0111\u1ED1i th\u1EE7 m\xE0 si\u1EBFt, ng\xF3n tay b\u1EA5m \u0111\xFAng ch\u1ED7 m\u1EA1ch \u0111\u1EADp. K\u1EBB b\u1ECB qu\u1EA5n th\u1EA5y c\u1ED5 l\u1EA1nh bu\u1ED1t nh\u01B0 c\xF3 r\u1EAFn l\u1EE5c b\xF2 qua." }, "item.doc_bi_cong": { "name": "\u0110\u1ED9c B\xEC C\xF4ng", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "L\u0103n m\xECnh trong b\xF9n tr\u1ED9n nh\u1EF1a c\xE2y \u0111\u1ED9c, \u0111\u1EE3i da ph\u1ED3ng r\u1ED9p r\u1ED3i chai l\u1EA1i th\xE0nh m\u1ED9t l\u1EDBp s\u1EA7n nh\u01B0 da c\xF3c. V\u1EADn c\xF4ng th\xEC da r\u1ECBn nh\u1EDBt x\xE1m, quy\u1EC1n c\u01B0\u1EDBc \u0111\xE1nh v\xE0o tr\u01A1n tu\u1ED9t." }, "item.quy_nguyen_doc_kinh": { "name": "Quy Nguy\xEAn \u0110\u1ED9c Kinh", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Gom tr\u0103m th\u1EE9 \u0111\u1ED9c nu\u1ED1t v\xE0o trong n\u0103m v\u1EC1 m\u1ED9t ch\u1ED7 d\u01B0\u1EDBi r\u1ED1n, n\xE9n th\xE0nh m\u1ED9t gi\u1ECDt n\u01B0\u1EDBc \u0111en r\u1ED3i luy\u1EC7n d\u1EA7n th\xE0nh ch\xE2n nguy\xEAn. Ng\u01B0\u1EDDi tu tr\xE1n l\xFAc n\xE0o c\u0169ng r\u1ECBn m\u1ED3 h\xF4i l\u1EA1nh." }, "item.thuc_giap_tan": { "name": "Th\u1EF1c Gi\xE1p T\xE1n", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "B\u1ED9t nghi\u1EC1n t\u1EEB v\u1ECF m\u1ED9t lo\xE0i b\u1ECD \u0103n s\u1EAFt, r\u1EAFc l\xEAn gi\xE1p th\xEC gi\xE1p s\u1EE7i b\u1ECDt nh\u01B0 v\xF4i g\u1EB7p n\u01B0\u1EDBc. \u0110\u1ED1t ma ni\u1EC7m th\u1ED5i b\u1ED9t \u0111i, kh\xED \u0111\u1ED9c theo ch\u1ED7 gi\xE1p th\u1EE7ng m\xE0 v\xE0o th\u1ECBt." }, "item.thiem_to_cong": { "name": "Thi\u1EC1m T\xF4 C\xF4ng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "L\u1EA5y nh\u1EF1a tr\u1EAFng tr\xEAn l\u01B0ng c\xF3c \u0111\u1ED9c b\xF4i l\xEAn v\u1EBFt th\u01B0\u01A1ng, l\u1EA5y \u0111\u1ED9c \xE9p \u0111\u1ED9c, th\u1ECBt li\u1EC1n nhanh g\u1EA5p m\u1EA5y l\u1EA7n. \u0110au th\xEC nh\u01B0 l\u1EEDa \u0111\u1ED1t, m\xE0 m\u1ED7i l\u1EA7n b\xF4i, l\xF2ng l\u1EA1i t\xEA \u0111i m\u1ED9t ch\xFAt." }, "item.doc_hat_cong": { "name": "\u0110\u1ED9c H\u1EA1t C\xF4ng", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "H\u1ECDc theo b\u1ECD c\u1EA1p sa m\u1EA1c, ng\xF3n tay cong nh\u01B0 \u0111u\xF4i m\xF3c, \u0111i\u1EC3m tr\xFAng g\xE1y th\xEC c\u1EA3 ng\u01B0\u1EDDi c\u1EE9ng \u0111\u1EDD. \u0110\u1ED9c ch\u1EA1y v\xE0o m\xE1u n\xF3ng r\xE1t nh\u01B0 c\xE1t tr\u01B0a h\xE8, ng\u1EA5m ng\u01B0\u1EE3c c\u1EA3 v\xE0o ng\u01B0\u1EDDi ra tay." }, "item.huyet_co_bi_kinh": { "name": "Huy\u1EBFt C\u1ED5 B\xED Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Nu\xF4i c\u1ED5 tr\xF9ng b\u1EB1ng m\xE1u ch\xEDnh m\xECnh, \u0111\u1EBFn l\xFAc ra \u0111\xF2n th\xEC \u0111\u1ED1t ma ni\u1EC7m th\u1EA3 c\u1ED5 theo v\u1EBFt th\u01B0\u01A1ng chui v\xE0o. C\u1ED5 g\u1EB7m m\u1EA1ch m\xE1u t\u1EEB b\xEAn trong, m\xE1u r\u1EC9 ra mang m\xE0u t\xEDm." }, "item.van_trung_qua_canh": { "name": "V\u1EA1n Tr\xF9ng Qu\xE1 C\u1EA3nh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1ED5i m\u1ED9t ti\u1EBFng c\xF2i x\u01B0\u01A1ng, \u0111\u1ED1t ma ni\u1EC7m l\xE0m m\u1ED3i, tr\xF9ng \u0111\u1ED9c trong v\xF2ng m\u01B0\u1EDDi d\u1EB7m b\xF2 ra nh\u01B0 n\u01B0\u1EDBc v\u1EE1 b\u1EDD. B\u1EA7y tr\xF9ng \u0111i qua ch\u1ED7 n\xE0o, c\u1ECF ch\u1ED7 \u1EA5y tr\u1EE5i \u0111\u1EBFn g\u1ED1c." }, "item.van_doc_kim_than": { "name": "V\u1EA1n \u0110\u1ED9c Kim Th\xE2n", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED9c \u0103n v\xE0o x\u01B0\u01A1ng nhi\u1EC1u n\u0103m k\u1EBFt th\xE0nh m\u1ED9t l\u1EDBp v\u1EA3y \xE1nh kim d\u01B0\u1EDBi da. V\u1EADn c\xF4ng th\xEC v\u1EA3y n\u1ED5i l\xEAn, ki\u1EBFm ch\xE9m v\xE0o t\xF3e l\u1EEDa, c\xF2n ma ni\u1EC7m trong l\xF2ng l\u1EA1i d\xE0y th\xEAm m\u1ED9t l\u1EDBp." }, "item.hoa_van_kiem_phap": { "name": "H\u1ECFa V\xE2n Ki\u1EBFm Ph\xE1p", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm ph\xE1p nh\u1EADp m\xF4n c\u1EE7a ki\u1EBFm tu h\u1EC7 H\u1ECFa. L\u01B0\u1EE1i ki\u1EBFm vung qua k\xE9o theo m\u1ED9t v\u1EC7t m\xE2y \u0111\u1ECF, v\u1EBFt ch\xE9m ch\xE1y s\xE9m m\xE9p." }, "item.on_lo_quyet": { "name": "\xD4n L\xF4 Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Kh\u1EA9u quy\u1EBFt \u0111\u1ED3ng t\u1EED canh l\xF2 h\u1ECDc \u0111\u1EA7u ti\xEAn. Gi\u1EEF l\u1EEDa \u0111an \u0111i\u1EC1n \u1EA5m \u0111\u1EC1u nh\u01B0 l\u1EEDa than d\u01B0\u1EDBi \u0111\u1EC9nh, kh\xF4ng b\xF9ng kh\xF4ng t\u1EAFt, luy\u1EC7n l\xE2u th\xEC kh\xED s\u1EAFc h\u1ED3ng h\xE0o." }, "item.xich_tuoc_phu_luc": { "name": "X\xEDch T\u01B0\u1EDBc Ph\xF9 L\u1EE5c", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\xF9 s\u01B0 v\u1EBD ph\xF9 b\u1EB1ng \u0111\u1EA7u ng\xF3n tay ngay gi\u1EEFa kh\xF4ng trung, n\xE9t chu sa v\u1EEBa kh\xE9p th\xEC h\xF3a chim l\u1EEDa lao v\xE0o \u0111\u1ECBch. L\u1EEDa b\xE9n sang c\u1EA3 k\u1EBB \u0111\u1EE9ng c\u1EA1nh." }, "item.liet_duong_kiem_dien": { "name": "Li\u1EC7t D\u01B0\u01A1ng Ki\u1EBFm \u0110i\u1EC3n", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm \u0111i\u1EC3n ch\xE9p t\u1EEB m\u1ED9t t\u1EA5m bia \u1EDF bi\xEAn \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c, ch\u1EEF kh\u1EAFc \u0111\u1ECF nh\u01B0 \u0111\xE8n Li\u1EC7t D\u01B0\u01A1ng. Ki\u1EBFm ra nh\u01B0 m\u1EB7t tr\u1EDDi ngang tr\u1EDDi, v\u1EBFt th\u01B0\u01A1ng v\u1EEBa r\u1EC9 m\xE1u v\u1EEBa ch\xE1y." }, "item.doan_hoa_chan_kinh": { "name": "\u0110o\xE1n H\u1ECFa Ch\xE2n Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p c\u1EE7a luy\u1EC7n kh\xED s\u01B0, coi kinh m\u1EA1ch nh\u01B0 l\xF2 r\xE8n. Linh h\u1ECFa trong ng\u01B0\u1EDDi nung t\u1EDBi \u0111\xE2u, th\u1EA7n th\u1EE9c soi theo t\u1EDBi \u0111\xF3, t\u1EEBng v\u1EBFt r\u1EA1n trong ph\xF4i ki\u1EBFm hi\u1EC7n r\xF5." }, "item.hoa_tho_dong_nguyen_kinh": { "name": "H\u1ECFa Th\u1ED5 \u0110\u1ED3ng Nguy\xEAn Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "L\u1EEDa t\xE0n th\xE0nh tro, tro th\xE0nh \u0111\u1EA5t. Ng\u01B0\u1EDDi so\u1EA1n ng\u1ED3i b\xEAn mi\u1EC7ng n\xFAi l\u1EEDa tr\u0103m n\u0103m m\u1EDBi hi\u1EC3u H\u1ECFa sinh Th\u1ED5, linh kh\xED ch\u1EA3y m\u1ED9t v\xF2ng nh\u01B0 d\xF2ng nham th\u1EA1ch ngu\u1ED9i d\u1EA7n th\xE0nh \u0111\xE1." }, "item.huong_hoa_tam_kinh": { "name": "H\u01B0\u01A1ng H\u1ECFa T\xE2m Kinh", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh c\u1EE7a t\u0103ng gi\u1EEF \u0111\xE8n trong ch\xF9a tr\u1EEB t\xE0 Vi\xEAm Qu\u1ED1c. Ng\u1ED3i tr\u01B0\u1EDBc l\u01B0 h\u01B0\u01A1ng m\xE0 th\u1EDF theo kh\xF3i nhang, \u0111\u1ED1m l\u1EEDa \u0111\u1EA7u n\xE9n nhang gi\u1EEF cho t\xE2m ni\u1EC7m kh\u1ECFi t\u1EAFt, t\xE0 ni\u1EC7m l\u1EA1i h\xF3a tro." }, "item.liet_hoa_doan_cot": { "name": "Li\u1EC7t H\u1ECFa \u0110o\xE1n C\u1ED1t", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EC3 tu bi\xEAn \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c nung x\u01B0\u01A1ng b\u1EB1ng l\u1EEDa trong ng\u01B0\u1EDDi, nh\u01B0 th\u1EE3 r\xE8n nung ph\xF4i. M\u1ED7i l\u1EA7n luy\u1EC7n xong m\u1ED3 h\xF4i b\u1ED1c kh\xF3i, x\u01B0\u01A1ng n\u1EB7ng th\xEAm m\u1ED9t ph\u1EA7n." }, "item.hoa_phuong_niet_ban_kinh": { "name": "H\u1ECFa Ph\u01B0\u1EE3ng Ni\u1EBFt B\xE0n Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xE9p t\u1EEB l\xF4ng v\u0169 c\u1EE7a m\u1ED9t con h\u1ECFa ph\u01B0\u1EE3ng ch\u1EBFt trong n\xFAi l\u1EEDa, ch\u1EEF hi\u1EC7n ra khi h\u01A1 l\xEAn l\u1EEDa. Th\xE2n b\u1ECB th\u01B0\u01A1ng th\xEC l\u1EEDa trong ng\u01B0\u1EDDi \u0111\u1ED1t ch\u1ED7 h\u1ECFng, th\u1ECBt m\u1EDBi m\u1ECDc l\xEAn t\u1EEB tro." }, "item.bach_luyen_quyet": { "name": "B\xE1ch Luy\u1EC7n Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Kh\u1EA9u quy\u1EBFt th\u1EE3 r\xE8n c\xF3 tu vi, th\u1EDF theo nh\u1ECBp b\xFAa. S\u1EAFt nung tr\u0103m l\u1EA7n th\xE0nh th\xE9p, linh kh\xED luy\u1EC7n tr\u0103m l\u1EA7n th\xE0nh s\u1EAFc; luy\u1EC7n l\xE2u th\xEC nh\xECn ng\u1ECDn l\u1EEDa \u0111\xE3 bi\u1EBFt l\xF2 \u0111\u1EE7 \u0111\u1ED9." }, "item.kim_cot_ngoc_tuy": { "name": "Kim C\u1ED1t Ng\u1ECDc T\u1EE7y", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p th\u1EC3 tu luy\u1EC7n kim kh\xED v\xE0o x\u01B0\u01A1ng, x\u01B0\u01A1ng n\u1EB7ng nh\u01B0 s\u1EAFt m\xE0 t\u1EE7y trong nh\u01B0 ng\u1ECDc. G\xE3y tay m\u01B0\u1EDDi ng\xE0y l\u1EA1i li\u1EC1n, ch\u1ED7 li\u1EC1n c\u1EE9ng h\u01A1n ch\u1ED7 c\u0169." }, "item.hoang_chung_nhiep_phach": { "name": "Ho\xE0ng Chung Nhi\u1EBFp Ph\xE1ch", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Kh\xFAc ph\u1ED5 l\u1EA5y \xE2m Ho\xE0ng Chung, n\u1ED1t \u0111\u1EA7u trong m\u01B0\u1EDDi hai lu\u1EADt, g\xF5 b\u1EB1ng linh kh\xED. Ti\u1EBFng chu\xF4ng d\u1ED9i v\xE0o tai th\xEC h\u1ED3n ph\xE1ch theo \u0111\xF3 m\xE0 \u0111\u1EE9ng l\u1EB7ng, k\u1EBB \u0111\u1EE9ng g\u1EA7n c\u0169ng ch\u1EADm tay." }, "item.thien_la_loi_tran": { "name": "Thi\xEAn La L\xF4i Tr\u1EADn", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u1EADn quy\u1EBFt b\xE0y l\u01B0\u1EDBi s\xE9t gi\u1EEFa kh\xF4ng trung, c\u1EAFm n\u0103m \u0111i\u1EC3m tr\u1EADn nh\xE3n b\u1EB1ng linh kh\xED. S\xE9t \u0111\xE1nh ch\u01B0a n\u1EB7ng, nh\u01B0ng ai \u0111\xE3 v\xE0o l\u01B0\u1EDBi th\xEC mang d\u1EA5u s\xE9t, chi\xEAu l\xF4i sau theo d\u1EA5u \u1EA5y m\xE0 n\u1ED5." }, "item.thai_bach_kiem_tam": { "name": "Th\xE1i B\u1EA1ch Ki\u1EBFm T\xE2m", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p ki\u1EBFm tu nu\xF4i m\u1ED9t thanh ki\u1EBFm trong t\xE2m, th\u1EB3ng m\u1ED9t \u0111\u01B0\u1EDDng t\u1EEB \u0111an \u0111i\u1EC1n l\xEAn \u0111\u1EC9nh \u0111\u1EA7u. Ki\u1EBFm t\xE2m kh\xF4ng cong th\xEC ng\u01B0\u1EDDi kh\xF4ng l\xF9i, th\xE2n theo ki\u1EBFm m\xE0 nh\u1EB9." }, "item.do_kiep_loi_kinh": { "name": "\u0110\u1ED9 Ki\u1EBFp L\xF4i Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ng\u01B0\u1EDDi so\u1EA1n t\u1EEBng \u0111\u1EE9ng gi\u1EEFa ki\u1EBFp v\xE2n m\xE0 ghi l\u1EA1i \u0111\u01B0\u1EDDng s\xE9t \u0111i trong kinh m\u1EA1ch. Luy\u1EC7n theo th\xEC m\u1ED7i l\u1EA7n s\xE9t \u0111\xE1nh l\xE0 m\u1ED9t l\u1EA7n t\xF4i th\xE2n, t\u1EDBi ng\xE0y \u0111\u1ED9 ki\u1EBFp \u0111\xE3 quen m\xF9i kh\xE9t." }, "item.thanh_nang_duoc_kinh": { "name": "Thanh Nang D\u01B0\u1EE3c Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh c\u1EE7a m\u1ED9t d\u01B0\u1EE3c s\u01B0 \u0111\u1EDDi tr\u01B0\u1EDBc, ch\xE9p trong t\xFAi v\u1EA3i xanh c\xF9ng ba tr\u0103m ph\u01B0\u01A1ng thu\u1ED1c. Luy\u1EC7n t\u1EDBi \u0111\xE2u th\u1EA7n th\u1EE9c nh\u1EA1y t\u1EDBi \u0111\xF3, \u0111\u1EE9ng c\u1EA1nh l\xF2 \u0111an nghe \u0111\u01B0\u1EE3c thu\u1ED1c trong \u0111\u1EC9nh \u0111ang ch\xEDn hay kh\xE9t." }, "item.van_thu_trieu_phong": { "name": "V\u1EA1n Th\xFA Tri\u1EC1u Phong", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ti\u1EBFng h\xFA c\u1EE7a ng\u01B0\u1EDDi ng\u1EF1 th\xFA g\u1ECDi gi\xF3 v\u1EC1, gi\xF3 mang h\u01A1i ng\u01B0\u1EDDi t\u1EDBi t\u1EEBng con th\xFA trong b\u1EA7y. V\u1EBFt th\u01B0\u01A1ng b\u1EA7y th\xFA kh\xE9p l\u1EA1i, ch\xE2n c\u1EB3ng c\u1EA3 phe theo gi\xF3 m\xE0 nhanh l\xEAn." }, "item.trong_nhac_kiem_phap": { "name": "Tr\u1ECDng Nh\u1EA1c Ki\u1EBFm Ph\xE1p", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm ph\xE1p d\xF9ng ki\u1EBFm n\u1EB7ng kh\xF4ng m\xE0i l\u01B0\u1EE1i, ch\xE9m xu\u1ED1ng nh\u01B0 n\xFAi \u0111\u1ED5. Ch\u1EADm m\xE0 ch\u1EAFc, \u0111\u1EE1 \u0111\u01B0\u1EE3c nh\xE1t \u0111\u1EA7u c\u0169ng t\xEA c\u1EA3 c\xE1nh tay." }, "item.thach_cot_quyet": { "name": "Th\u1EA1ch C\u1ED1t Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EC3 tu m\u1EDBi nh\u1EADp m\xF4n ng\xE0y ng\xE0y v\xE1c \u0111\xE1 l\xEAn n\xFAi, v\u1EEBa \u0111i v\u1EEBa v\u1EADn kh\u1EA9u quy\u1EBFt n\xE0y. Ba n\u0103m sau x\u01B0\u01A1ng c\u1EE9ng nh\u01B0 \u0111\xE1, ng\xE3 t\u1EEB v\xE1ch xu\u1ED1ng ch\u1EC9 tr\u1EA7y da." }, "item.dia_tang_tam_kinh": { "name": "\u0110\u1ECBa T\u1EA1ng T\xE2m Kinh", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh nh\xE0 ch\xF9a d\u1EA1y ng\u1ED3i v\u1EEFng nh\u01B0 \u0111\u1EA5t. \u0110\u1EA5t ch\u1EDF mu\xF4n v\u1EADt m\xE0 kh\xF4ng \u0111\u1ED9ng, t\xE2m ni\u1EC7m n\xE0o kh\u1EDFi l\xEAn c\u0169ng ch\xECm xu\u1ED1ng nh\u01B0 h\u1EA1t b\u1EE5i r\u01A1i." }, "item.cuu_cung_tran_quyet": { "name": "C\u1EEDu Cung Tr\u1EADn Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u1EADn s\u01B0 c\u1EAFm ch\xEDn vi\xEAn \u0111\xE1 theo cung L\u1EA1c Th\u01B0 quanh ch\xE2n \u0111\u1ECBch. K\u1EBB b\u1ECB nh\u1ED1t th\u1EA5y \u0111\u01B0\u1EDDng n\xE0o c\u0169ng l\xE0 v\xE1ch \u0111\u1EA5t, loay hoay m\u1EA5t m\u1ED9t h\u1ED3i." }, "item.phan_nhac_kiem_quyet": { "name": "Ph\xE2n Nh\u1EA1c Ki\u1EBFm Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm quy\u1EBFt c\u1EE7a ki\u1EBFm tu \u1EA9n \u1EDF n\xFAi \u0111\xE1, t\u01B0\u01A1ng truy\u1EC1n t\u1ED5 s\u01B0 m\u1ED9t ki\u1EBFm ch\u1EBB \u0111\xF4i ng\u1ECDn \u0111\u1ED3i. Ki\u1EBFm kh\xED n\u1EB7ng nh\u01B0 \u0111\xE1 l\u1EDF, k\u1EBB \u0111\u1EE9ng s\xE1t b\xEAn c\u0169ng b\u1ECB cu\u1ED1n v\xE0o." }, "item.phuc_thu_an_quyet": { "name": "Ph\u1EE5c Th\xFA \u1EA4n Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "\u1EA4n quy\u1EBFt c\u1EE7a ng\u01B0\u1EDDi nu\xF4i y\xEAu th\xFA, \u1EA5n xu\u1ED1ng \u0111\u1EA5t l\xE0 m\xF9i n\xFAi r\u1EEBng lan ra. Th\xFA d\u1EEF c\u1EE5p tai tr\u01B0\u1EDBc ch\u1EE7, r\u1ED3i c\u1EA3 b\u1EA7y c\xF9ng h\u0103ng l\xEAn." }, "item.ngu_nhac_luyen_than_kinh": { "name": "Ng\u0169 Nh\u1EA1c Luy\u1EC7n Th\xE2n Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EC3 tu B\u1EAFc Minh \u0111\u1ED9i \u0111\xE1 \u0111\u1EE9ng d\u01B0\u1EDBi th\xE1c b\u0103ng m\xE0 luy\u1EC7n. N\u0103m ng\u1ECDn n\xFAi l\u1EDBn l\u1EA7n l\u01B0\u1EE3t \xE9p v\xE0o n\u0103m t\u1EA1ng, luy\u1EC7n th\xE0nh th\xEC th\xE2n n\u1EB7ng nh\u01B0 n\xFAi, m\xE1u \u0111\u1EB7c nh\u01B0 ch\xEC." }, "item.bat_dong_minh_vuong_kinh": { "name": "B\u1EA5t \u0110\u1ED9ng Minh V\u01B0\u01A1ng Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh h\u1ED9 ph\xE1p c\u1EE7a nh\xE0 ch\xF9a. Ng\u01B0\u1EDDi t\u1EE5ng hi\u1EC7n ph\xE1p t\u01B0\u1EDBng Minh V\u01B0\u01A1ng ng\u1ED3i x\u1EBFp b\u1EB1ng, \u0111\xE8 c\u1EA3 m\u1ED9t v\xF9ng xu\u1ED1ng \u0111\u1EA5t, \u0111ao ki\u1EBFm ch\xE9m v\xE0o nh\u01B0 ch\xE9m n\xFAi." }, "item.dia_mach_tu_linh_kinh": { "name": "\u0110\u1ECBa M\u1EA1ch T\u1EE5 Linh Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p coi \u0111an \u0111i\u1EC1n nh\u01B0 l\xF2ng ch\u1EA3o gi\u1EEFa n\xFAi, linh kh\xED b\u1ED1n ph\xEDa t\u1EF1 ch\u1EA3y v\u1EC1 \u0111\u1ECDng l\u1EA1i. Kh\xF4ng nhanh m\xE0 kh\xF4ng r\xF2, t\xEDch \u0111\u1EE7 th\xEC tr\xE0n qua c\u1EEDa \u1EA3i." }, "item.tran_nhac_dinh_hon_kinh": { "name": "Tr\u1EA5n Nh\u1EA1c \u0110\u1ECBnh H\u1ED3n Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u1EADn s\u01B0 \u0111\xF3ng m\u1ED9t c\u1ECDc \u0111\xE1 v\xE0o th\u1EE9c h\u1EA3i l\xE0m tr\u1EADn nh\xE3n, h\u1ED3n ph\xE1ch xoay quanh c\u1ECDc m\xE0 kh\xF4ng t\xE1n. Th\u1EA7n th\u1EE9c tr\u1EA3i ra nh\u01B0 tr\u1EADn \u0111\u1ED3, m\u1ED9t vi\xEAn s\u1ECFi l\u0103n c\u0169ng bi\u1EBFt." }, "item.lac_tuyet_kiem_quyet": { "name": "L\u1EA1c Tuy\u1EBFt Ki\u1EBFm Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm quy\u1EBFt c\u1EE7a ki\u1EBFm tu B\u1EAFc Minh, m\u1ED9t ki\u1EBFm vung ra t\xE1ch th\xE0nh tr\u0103m m\u0169i nh\u01B0 tuy\u1EBFt r\u01A1i. M\u0169i n\xE0o c\u0169ng nh\u1ECF, nh\u01B0ng tr\xFAng ch\u1ED7 n\xE0o l\xE0 ch\u1ED7 \u0111\xF3 t\xEA c\xF3ng." }, "item.ngung_thuy_phu_quyet": { "name": "Ng\u01B0ng Th\u1EE7y Ph\xF9 Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\xF9 s\u01B0 v\u1EBD ph\xF9 b\u1EB1ng h\u01A1i n\u01B0\u1EDBc tr\xEAn kh\xF4ng, kh\u1ECFi c\u1EA7n gi\u1EA5y son. \u0110\u1EA1o ph\xF9 tr\u01B0\u1EDBc d\xEDnh l\xEAn ng\u01B0\u1EDDi \u0111\u1ECBch ch\u01B0a tan, \u0111\u1EA1o ph\xF9 sau \u0111\xE1nh t\u1EDBi th\xEC n\u1ED5 c\u1EA3 hai." }, "item.chi_thuy_tam_kinh": { "name": "Ch\u1EC9 Th\u1EE7y T\xE2m Kinh", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\xF9 s\u01B0 t\u1EADp nh\xECn ch\u1EADu n\u01B0\u1EDBc t\u1EDBi khi m\u1EB7t n\u01B0\u1EDBc kh\xF4ng g\u1EE3n m\u1ED9t v\u1EB1n. T\xE2m l\u1EB7ng nh\u01B0 n\u01B0\u1EDBc \u0111\u1EE9ng th\xEC n\xE9t ph\xF9 kh\xF4ng run, v\u1EADt g\xEC r\u01A1i v\xE0o c\u0169ng soi th\u1EA5y \u0111\xE1y." }, "item.quan_trieu_kinh": { "name": "Quan Tri\u1EC1u Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "M\u1ED9t l\xE3o tu s\u0129 Th\u1ECBnh Qu\u1ED1c ng\u1ED3i tr\xEAn gh\u1EC1nh \u0111\xE1 xem tri\u1EC1u l\xEAn xu\u1ED1ng ba m\u01B0\u01A1i n\u0103m m\xE0 vi\u1EBFt. S\xF3ng t\u1EDBi r\u1ED3i lui, ph\xE1p l\xFD c\u0169ng th\u1EBF, \u0111\u1ECDc l\xE2u th\xEC th\u1EA5y ch\u1ED7 b\u1EBF t\u1EAFc t\u1EF1 th\xF4ng." }, "item.hop_hoan_tam_kinh": { "name": "H\u1EE3p Hoan T\xE2m Kinh", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy\u1EC3n s\xE1ch m\u1ECFng b\xECa \u0111\u1ECF, n\xE9t ch\u1EEF m\u1EC1m nh\u01B0 t\xF3c r\u1EE7. Luy\u1EC7n m\u1ED9t m\xECnh th\xEC t\u1EA7m th\u01B0\u1EDDng, c\xF3 ng\u01B0\u1EDDi c\xF9ng ng\u1ED3i th\xEC linh kh\xED ch\u1EA3y nh\u01B0 su\u1ED1i." }, "item.hoi_mau_thuat": { "name": "H\u1ED3i M\xE2u Thu\u1EADt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Ngo\u1EA3nh l\u1EA1i c\u01B0\u1EDDi m\u1ED9t c\xE1i, k\u1EBB \u0111\u1ED1i di\u1EC7n qu\xEAn c\u1EA3 gi\u01A1 tay. M\u1ED7i l\u1EA7n thi tri\u1EC3n, trong l\xF2ng ng\u01B0\u1EDDi d\xF9ng c\u0169ng nhen m\u1ED9t ch\xFAt l\u1EEDa kh\xF3 t\u1EAFt." }, "item.phong_nguyet_quyet": { "name": "Phong Nguy\u1EC7t Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p ch\xE9p tr\xEAn m\u1EB7t sau m\u1ED9t t\u1EDD thi\u1EBFp m\u1EDDi u\u1ED1ng r\u01B0\u1EE3u ng\u1EAFm tr\u0103ng. Ng\u01B0\u1EDDi luy\u1EC7n \u0111i \u0111\xE2u c\u0169ng hay g\u1EB7p may, nh\u1EA5t l\xE0 nh\u1EEFng cu\u1ED9c g\u1EB7p t\xECnh c\u1EDD." }, "item.phi_thoa_thuat": { "name": "Phi Thoa Thu\u1EADt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "R\xFAt c\xE2y tr\xE2m v\xE0ng tr\xEAn t\xF3c ph\xF3ng \u0111i, nhanh h\u01A1n \xE1nh m\u1EAFt. K\u1EBB tr\xFAng tr\xE2m th\u01B0\u1EDDng ch\u1EBFt l\xFAc c\xF2n \u0111ang m\u1EC9m c\u01B0\u1EDDi." }, "item.me_hon_huong_quyet": { "name": "M\xEA H\u1ED3n H\u01B0\u01A1ng Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\xFAc linh l\u1EF1c qua l\u1ED7 ch\xE2n l\xF4ng th\xE0nh m\u1ED9t l\xE0n h\u01B0\u01A1ng hoa h\u1EE3p hoan. Ng\u1EEDi ph\u1EA3i th\xEC ch\xE2n tay b\u1EE7n r\u1EE7n, \xE1o gi\xE1p m\u1EB7c tr\xEAn ng\u01B0\u1EDDi c\u0169ng nh\u01B0 l\u1ECFng ra." }, "item.tinh_hoa_kinh": { "name": "T\xECnh H\u1ECFa Kinh", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "L\u1EA5y l\u1EEDa t\xECnh l\xE0m c\u1EE7i, \u0111\u1ED1t cho linh l\u1EF1c ch\u1EA3y nhanh h\u01A1n ng\u01B0\u1EDDi. K\u1EBB luy\u1EC7n l\xE2u, kh\xF3e m\u1EAFt l\xFAc n\xE0o c\u0169ng \u1EEDng nh\u01B0 v\u1EEBa u\u1ED1ng r\u01B0\u1EE3u." }, "item.thai_hoa_quyet": { "name": "Th\xE1i Hoa Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "H\xE1i gi\u1ECDt s\u01B0\u01A1ng tr\xEAn c\xE1nh hoa \u0111em v\u1EC1 b\u1ED3i cho m\xECnh, v\u1EBFt th\u01B0\u01A1ng kh\xE9p l\u1EA1i tr\xF4ng th\u1EA5y. Hoa kh\xF4ng ph\u1EA3i hoa, s\u01B0\u01A1ng kh\xF4ng ph\u1EA3i s\u01B0\u01A1ng, s\xE1ch n\xF3i r\xF5 \u1EDF trang cu\u1ED1i." }, "item.bang_co_ngoc_cot": { "name": "B\u0103ng C\u01A1 Ng\u1ECDc C\u1ED1t", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1EADp l\u1EEDa trong l\xF2ng cho ngu\u1ED9i th\xE0nh m\u1ED9t l\u1EDBp b\u0103ng m\u1ECFng ph\u1EE7 da. \u0110ao ki\u1EBFm ch\u1EA1m v\xE0o tr\u01B0\u1EE3t \u0111i, k\u1EBB c\u1EA7m \u0111ao c\u0169ng th\u1EA5y tay l\u1EA1nh bu\u1ED1t." }, "item.am_duong_giao_thai_kinh": { "name": "\xC2m D\u01B0\u01A1ng Giao Th\xE1i Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh l\u1EA5y \xE2m d\u01B0\u01A1ng l\xE0m hai b\u1EDD, linh l\u1EF1c ch\u1EA3y qua l\u1EA1i nh\u01B0 n\u01B0\u1EDBc tri\u1EC1u. Ng\u01B0\u1EDDi luy\u1EC7n \u0111i \u0111\xE2u c\u0169ng c\xF3 k\u1EBB ngo\xE1i nh\xECn, ch\u1EB3ng r\xF5 v\xEC sao." }, "item.nghe_thuong_mi_vu": { "name": "Ngh\xEA Th\u01B0\u1EDDng M\u1ECB V\u0169", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "V\u0169 kh\xFAc xoay \xE1o l\u1EE5a b\u1EA3y m\xE0u, c\u1EA3 \u0111\xE1m ng\u01B0\u1EDDi xem \u0111\u1EE9ng ng\xE2y nh\u01B0 t\u01B0\u1EE3ng. Mu\u1ED1n m\xFAa tr\u1ECDn kh\xFAc ph\u1EA3i \u0111\u1ED1t b\u1EDBt l\u1EEDa trong l\xF2ng m\xE0 \u0111\u1ED5i l\u1EA5y." }, "item.huyen_tan_kinh": { "name": "Huy\u1EC1n T\u1EABn Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": 'L\u1EA5y c\xE2u "c\u1ED1c th\u1EA7n b\u1EA5t t\u1EED" l\xE0m g\u1ED1c, coi th\xE2n m\xECnh nh\u01B0 thung l\u0169ng nh\u1EADn n\u01B0\u1EDBc b\u1ED1n ph\u01B0\u01A1ng. Nh\u1EADn c\xE0ng nhi\u1EC1u, th\xE2n c\xE0ng d\xE0y, ch\u1EC9 kh\xF4ng bao gi\u1EDD tr\u1EA3 l\u1EA1i.' }, "item.dien_mau_quyet": { "name": "\u0110i\u1EC7n M\xE2u Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t l\u1EEDa l\xF2ng d\u1ED3n l\xEAn kh\xF3e m\u1EAFt, li\u1EBFc m\u1ED9t c\xE1i l\xE0 s\xE9t gi\xE1ng theo. Ng\u01B0\u1EDDi d\xF9ng th\xE2n nh\u1EB9 nh\u01B0 gi\xF3, \u0111\xE1nh xong \u0111\xE3 l\u01B0\u1EDBt t\u1EDBi ch\u1ED7 kh\xE1c." }, "item.hong_phan_kho_lau": { "name": "H\u1ED3ng Ph\u1EA5n Kh\xF4 L\xE2u", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Trong m\u1EAFt k\u1EBB tr\xFAng chi\xEAu l\xE0 giai nh\xE2n tuy\u1EC7t s\u1EAFc, trong m\u1EAFt ng\u01B0\u1EDDi d\xF9ng ch\u1EC9 l\xE0 b\u1ED9 x\u01B0\u01A1ng ph\u1EE7 ph\u1EA5n. Luy\u1EC7n l\xE2u, nh\xECn ai c\u0169ng th\u1EA5y x\u01B0\u01A1ng." }, "item.phuong_cau_hoang_quyet": { "name": "Ph\u01B0\u1EE3ng C\u1EA7u Ho\xE0ng Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "G\u1EA3y m\u1ED9t kh\xFAc c\u1EA7u ho\xE0ng, l\u1EEDa ph\u01B0\u1EE3ng theo ti\u1EBFng \u0111\xE0n qu\u1EA5n l\u1EA5y ng\u01B0\u1EDDi nghe. K\u1EBB tr\xFAng chi\xEAu v\u1EEBa b\u1ECFng v\u1EEBa say, qu\xEAn c\u1EA3 n\xE9." }, "item.nguyet_hoa_luyen_hinh": { "name": "Nguy\u1EC7t Hoa Luy\u1EC7n H\xECnh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\xEAm r\u1EB1m ng\u1ED3i d\u01B0\u1EDBi tr\u0103ng, h\xFAt \xE1nh nguy\u1EC7t hoa luy\u1EC7n v\xE0o da th\u1ECBt. Luy\u1EC7n t\u1EDBi n\u01A1i, \u0111\u1EE9ng trong b\xF3ng t\u1ED1i ng\u01B0\u1EDDi c\u0169ng t\u1EF1 s\xE1ng m\u1EDD nh\u01B0 ng\u1ECDc." }, "item.tang_kieu_quyet": { "name": "T\xE0ng Ki\u1EC1u Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1EF1ng m\u1ED9t gian nh\xE0 v\xE0ng b\u1EB1ng linh l\u1EF1c, gi\u1EA5u ng\u01B0\u1EDDi m\xECnh qu\xFD v\xE0o trong. Mu\u1ED1n gi\u1EEF nh\xE0 v\u1EEFng ph\u1EA3i nh\xF3m th\xEAm l\u1EEDa trong l\xF2ng, c\xE0ng th\u01B0\u01A1ng c\xE0ng kh\xF3 d\u1EADp." }, "item.thien_ho_mi_anh": { "name": "Thi\xEAn H\u1ED3 M\u1ECB \u1EA2nh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xE9p l\u1EA1i t\u1EEB thu\u1EADt c\u1EE7a m\u1ED9t con thi\xEAn h\u1ED3 ch\xEDn \u0111u\xF4i. Ch\xEDn b\xF3ng ng\u01B0\u1EDDi hi\u1EC7n quanh tr\u1EADn, k\u1EBB n\xE0o nh\xECn v\xE0o b\xF3ng n\xE0o c\u0169ng th\u1EA5y ng\u01B0\u1EDDi m\xECnh nh\u1EDB nh\u1EA5t." }, "item.van_hoa_quy_nguyen_kinh": { "name": "V\u1EA1n Hoa Quy Nguy\xEAn Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110i qua v\u1EA1n \u0111\xF3a hoa, m\u1ED7i \u0111\xF3a h\xE1i m\u1ED9t gi\u1ECDt s\u01B0\u01A1ng \u0111em v\u1EC1 t\u01B0\u1EDBi g\u1ED1c m\xECnh. Hoa sau \u0111\xF3 h\xE9o hay kh\xF4ng, kinh kh\xF4ng ch\xE9p." }, "item.hong_tran_nghiep_hoa": { "name": "H\u1ED3ng Tr\u1EA7n Nghi\u1EC7p H\u1ECFa", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "L\u1EEDa nh\xF3m t\u1EEB n\u1EE3 t\xECnh, ai t\u1EEBng \u0111\u1ED9ng l\xF2ng l\xE0 l\u1EEDa c\xF3 ch\u1ED7 b\xE1m. C\u1EA3 tr\u1EADn \u0111\u1ECF r\u1EF1c, k\u1EBB n\xE0o c\u0169ng th\u1EA5y l\u1EA1i ng\u01B0\u1EDDi c\u0169 trong ng\u1ECDn l\u1EEDa." }, "item.tang_khi_quyet": { "name": "T\xE0ng Kh\xED Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Kh\u1EA9u quy\u1EBFt c\u1EE7a d\xE2n tr\u1ED9m \u0111\xEAm, n\xE9n h\u01A1i th\u1EDF xu\u1ED1ng t\u1EADn \u0111an \u0111i\u1EC1n. Linh kh\xED v\xE0o ch\u1EADm, nh\u01B0ng ch\xF3 gi\u1EEF nh\xE0 c\u0169ng kh\xF4ng ng\u1EEDi ra." }, "item.tiem_lan_quyet": { "name": "Ti\u1EC1m L\xE2n Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "C\xE1 l\u1EDBn l\u1EB7n s\xE2u th\xEC m\u1EB7t n\u01B0\u1EDBc kh\xF4ng g\u1EE3n. Ng\u01B0\u1EDDi luy\u1EC7n thu linh kh\xED v\xE0o trong nh\u01B0 v\u1EA3y kh\xE9p, \u0111\u1EE9ng gi\u1EEFa ch\u1EE3 c\u0169ng ch\u1EB3ng ai li\u1EBFc t\u1EDBi." }, "item.an_anh_tam_kinh": { "name": "\u1EA8n \u1EA2nh T\xE2m Kinh", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p truy\u1EC1n mi\u1EC7ng trong gi\u1EDBi s\xE1t th\u1EE7. Kh\xED t\u1EE9c nh\u1EA1t nh\u01B0 b\xF3ng d\u01B0\u1EDBi m\xE1i hi\xEAn, b\u01B0\u1EDBc ch\xE2n c\u0169ng nh\u1EB9 theo." }, "item.bao_phac_quyet": { "name": "B\xE3o Ph\xE1c Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "\xD4m l\u1EA5y c\xE1i m\u1ED9c m\u1EA1c, gi\u1EA5u c\xE1i s\u1EAFc b\xE9n. Tu s\u0129 Tr\xFAc C\u01A1 luy\u1EC7n th\xE0nh th\xEC \u0111\u1EE9ng tr\u01B0\u1EDBc m\u1EB7t ng\u01B0\u1EDDi kh\xE1c ch\u1EC9 nh\u01B0 m\u1ED9t l\xE3o n\xF4ng v\u1EEBa xu\u1ED1ng ru\u1ED9ng." }, "item.quy_khu_tang_tuc_kinh": { "name": "Quy Kh\u01B0 T\xE0ng T\u1EE9c Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "M\u1ECDi d\xF2ng n\u01B0\u1EDBc \u0111\u1ED5 v\u1EC1 Quy Kh\u01B0 m\xE0 bi\u1EC3n kh\xF4ng \u0111\u1EA7y. Linh kh\xED trong ng\u01B0\u1EDDi c\u0169ng ch\xECm nh\u01B0 th\u1EBF, cao t\u0103ng Kim C\u01B0\u01A1ng T\u1EF1 nh\xECn th\u1EB3ng m\u1EB7t v\u1EABn kh\xF4ng nh\u1EADn ra." }, "item.nhiep_hon_dai_phap": { "name": "Nhi\u1EBFp H\u1ED3n \u0110\u1EA1i Ph\xE1p", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ma c\xF4ng nh\xECn th\u1EB3ng v\xE0o m\u1EAFt m\xE0 r\xFAt h\u1ED3n. K\u1EBB tr\xFAng \u0111\u1EE9ng nh\u01B0 t\u01B0\u1EE3ng g\u1ED7, trong m\u1EAFt c\xF2n in b\xF3ng ng\u01B0\u1EDDi thi ph\xE1p. Ma ni\u1EC7m s\u1EAFp tr\xE0n th\xEC c\xE1i nh\xECn \u1EA5y \u0111\u1EC3 l\u1EA1i d\u1EA5u h\u1ED3n kh\xF3 g\u1ED9t." }, "item.van_hon_chu": { "name": "V\u1EA1n H\u1ED3n Ch\xFA", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xFA v\u0103n g\u1ECDi h\u1ED3n oan quanh m\xECnh m\xE0 xua \u0111i c\u1EAFn ng\u01B0\u1EDDi. \u0110\u1ECDc xong m\u1ED9t c\xE2u, gi\xF3 l\u1EA1nh n\u1ED5i l\xEAn \u0111\u1EA7y ti\u1EBFng kh\xF3c, o\xE1n kh\xED c\u0169ng theo \u0111\xF3 d\u1ED3n v\xE0o l\xF2ng ng\u01B0\u1EDDi \u0111\u1ECDc." }, "item.quy_hoa_chu": { "name": "Qu\u1EF7 H\u1ECFa Ch\xFA", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "C\xE2u ch\xFA g\u1ECDi ma tr\u01A1i xanh ngo\xE0i b\xE3i tha ma b\xE1m l\xEAn ng\u01B0\u1EDDi kh\xE1c. L\u1EEDa kh\xF4ng n\xF3ng, ch\u1EC9 \u0111\u1EC3 l\u1EA1i d\u1EA5u h\u1ED3n l\u1EA1nh ng\u1EAFt." }, "item.toai_phach_chi": { "name": "To\xE1i Ph\xE1ch Ch\u1EC9", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u1EC9 ph\xE1p g\xF5 th\u1EB3ng v\xE0o ch\u1ED7 d\u1EA5u h\u1ED3n \u0111ang in, ti\u1EBFng v\u1EE1 nh\u01B0 s\u1EE9 n\u1EE9t. Ph\u1EA3i \u0111\u1ED1t ma ni\u1EC7m m\u1EDBi \u0111\u1EE7 l\u1EF1c xuy\xEAn." }, "item.quy_phong_quyet": { "name": "Qu\u1EF7 Phong Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Gi\xF3 \xE2m cu\u1ED1n t\u1EEB d\u01B0\u1EDBi \u0111\u1EA5t l\xEAn, mang theo ti\u1EBFng r\xEAn c\u1EE7a h\u1ED3n oan, k\u1EBB \u0111\u1EE9ng g\u1EA7n \u0111\u1EC1u kh\u1EF1ng l\u1EA1i. Ma ni\u1EC7m c\xE0ng \u0111\u1EA7y, gi\xF3 c\xE0ng in s\xE2u d\u1EA5u h\u1ED3n." }, "item.am_hoa_chan_kinh": { "name": "\xC2m H\u1ECFa Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh luy\u1EC7n l\u1EEDa \xE2m t\u1EEB ch\xEDnh h\u1ED3n ph\xE1ch \u0111\xE3 b\u1EAFt gi\u1EEF, \u0111\u1ED1t \u0111\xE2u ch\xE1y t\u1EADn g\u1ED1c th\u1EA7n h\u1ED3n. L\u1EEDa xanh l\xE9t b\u1EAFt v\xE0o d\u1EA5u h\u1ED3n n\xE0o l\xE0 n\u1ED5 tung ch\u1ED7 \u1EA5y." }, "item.minh_phach_quyet": { "name": "Minh Ph\xE1ch Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p nh\u1EADp m\xF4n c\u1EE7a qu\u1EF7 tu, n\u1EEDa \u0111\xEAm ng\u1ED3i gi\u1EEFa b\xE3i tha ma h\xEDt \xE2m kh\xED nu\xF4i h\u1ED3n ph\xE1ch. Luy\u1EC7n l\xE2u, kh\xF3e m\u1EAFt b\u1EAFt \u0111\u1EA7u th\u1EA5y b\xF3ng m\u1EDD l\u1EA3ng v\u1EA3ng." }, "item.quy_anh_bo": { "name": "Qu\u1EF7 \u1EA2nh B\u1ED9", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "B\u1ED9 ph\xE1p h\u1ECDc theo h\u1ED3n ma, ch\xE2n kh\xF4ng ch\u1EA1m \u0111\u1EA5t, th\xE2n h\xECnh l\xFAc m\u1EDD l\xFAc t\u1ECF. M\u1ED7i b\u01B0\u1EDBc l\xE0 m\u01B0\u1EE3n m\u1ED9t h\u01A1i \xE2m kh\xED, ma ni\u1EC7m theo \u0111\xF3 d\xE0y th\xEAm." }, "item.khon_hon_chu": { "name": "Kh\u1ED1n H\u1ED3n Ch\xFA", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "R\u1EAFc m\u1ED9t n\u1EAFm \u0111\u1EA5t m\u1ED9, ni\u1EC7m ch\xFA, b\xF3ng c\u1EE7a k\u1EBB \u0111\u1ECBch b\u1ECB \u0111\xF3ng xu\u1ED1ng \u0111\u1EA5t nh\u01B0 c\u1ECDc. Ma ni\u1EC7m s\u1EAFp tr\xE0n th\xEC ch\u1ED7 b\xF3ng b\u1ECB \u0111\xF3ng in l\u1EA1i d\u1EA5u h\u1ED3n." }, "item.thuc_hon_quyet": { "name": "Th\u1EF1c H\u1ED3n Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p m\u01B0\u1EE3n r\u1EC5 c\xE2y h\xF2e tr\xEAn m\u1ED9 h\xFAt t\xE0n h\u1ED3n d\u01B0\u1EDBi \u0111\u1EA5t v\u1EC1 nu\xF4i m\xECnh. Ng\u01B0\u1EDDi luy\u1EC7n da xanh t\xE1i, h\u01A1i th\u1EDF l\u1EA1nh nh\u01B0 gi\xF3 \u0111\xEAm." }, "item.han_phach_chu": { "name": "H\xE0n Ph\xE1ch Ch\xFA", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "X\u1EA3 ma ni\u1EC7m th\xE0nh m\u1ED9t tr\u1EADn s\u01B0\u01A1ng \xE2m, ai \u0111\u1EE9ng trong \u0111\xF3 l\u1EA1nh c\u1EE9ng t\u1EDBi t\u1EADn h\u1ED3n. Ch\xFA ph\u1EA3i \u0111\u1ED1t ma ni\u1EC7m m\u1EDBi th\xE0nh, \u0111\u1ED1t xong l\xF2ng ng\u01B0\u1EDDi \u0111\u1ECDc nh\u1EB9 \u0111i m\u1ED9t ch\xFAt." }, "item.thon_phach_cong": { "name": "Th\xF4n Ph\xE1ch C\xF4ng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "H\xE1 mi\u1EC7ng nu\u1ED1t t\xE0n h\u1ED3n tr\xF4i quanh tr\u1EADn m\xE0 v\xE1 th\u01B0\u01A1ng th\u1EBF cho m\xECnh. V\u1EBFt th\u01B0\u01A1ng li\u1EC1n nhanh, nh\u01B0ng m\u1ED7i ng\u1EE5m h\u1ED3n nu\u1ED1t v\xE0o l\u1EA1i k\xE8m m\u1ED9t ti\u1EBFng o\xE1n than." }, "item.luyen_phach_tam_kinh": { "name": "Luy\u1EC7n Ph\xE1ch T\xE2m Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t \xE2m h\u1ECFa trong th\u1EE9c h\u1EA3i m\xE0 t\xF4i luy\u1EC7n h\u1ED3n ph\xE1ch m\xECnh nh\u01B0 r\xE8n s\u1EAFt. Th\u1EA7n th\u1EE9c s\u1EAFc l\xEAn, \u0111\xEAm ng\u1EE7 th\u01B0\u1EDDng nghe ti\u1EBFng l\u1EEDa l\xE1ch t\xE1ch trong \u0111\u1EA7u." }, "item.vo_thuong_thu": { "name": "V\xF4 Th\u01B0\u1EDDng Th\u1EE7", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u01B0\u1EDFng ph\xE1p nh\xE1i tay qu\u1EF7 sai c\xE2u h\u1ED3n, n\u0103m ng\xF3n l\u1EA1nh nh\u01B0 m\xF3c s\u1EAFt. Tr\xFAng tay l\xE0 h\u1ED3n b\u1ECB in d\u1EA5u, k\u1EBB ra tay c\u0169ng nhu\u1ED1m th\xEAm ma ni\u1EC7m." }, "item.da_hanh_quyet": { "name": "D\u1EA1 H\xE0nh Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "G\xF5 m\xF5 g\u1ECDi \xE2m kh\xED d\u01B0\u1EDBi \u0111\u1EA5t l\xEAn n\xE2ng b\u01B0\u1EDBc cho c\u1EA3 phe m\xECnh, nh\u01B0 \u0111o\xE0n qu\u1EF7 \u0111i \u0111\xEAm. Ai \u0111\u01B0\u1EE3c n\xE2ng th\xEC nh\u1EB9 ng\u01B0\u1EDDi h\u1EB3n, c\xF2n k\u1EBB g\xF5 m\xF5 th\u1EA5y ma ni\u1EC7m d\xE2ng l\xEAn." }, "item.phong_do_chan_kinh": { "name": "Phong \u0110\xF4 Ch\xE2n Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xE9p l\u1EA1i t\u1EEB m\u1ED9t t\u1EA5m bia n\xF3i l\xE0 d\u1EF1ng \u1EDF c\u1EEDa Phong \u0110\xF4, k\u1EC3 c\xE1ch l\u1EA5y \xE2m kh\xED \u0111\u1ECBa ph\u1EE7 m\xE0 \u0111\xFAc th\xE2n h\u1ED3n. Ng\u01B0\u1EDDi luy\u1EC7n th\xE0nh b\xF3ng in d\u01B0\u1EDBi \u0111\xE8n nh\u1EA1t h\u01A1n ng\u01B0\u1EDDi th\u01B0\u1EDDng." }, "item.chan_hon_loi_phap": { "name": "Ch\u1EA5n H\u1ED3n L\xF4i Ph\xE1p", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "S\u1EA5m \xE2m kh\xF4ng ti\u1EBFng, \u0111\xE1nh xu\u1ED1ng th\xEC th\xE2n kh\xF4ng sao m\xE0 h\u1ED3n rung nh\u01B0 chu\xF4ng. Ma ni\u1EC7m s\u1EAFp tr\xE0n th\xEC k\u1EBB n\xE0o b\u1ECB s\u1EA5m qu\xE9t qua c\u0169ng mang d\u1EA5u h\u1ED3n." }, "item.quy_than_phu_the": { "name": "Qu\u1EF7 Th\u1EA7n Ph\u1EE5 Th\u1EC3", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t ma ni\u1EC7m m\u1EDDi \xE1c qu\u1EF7 nh\u1EADp v\xE0o tay m\xECnh trong m\u1ED9t chi\xEAu, c\xFA \u0111\xE1nh x\xE9 to\u1EA1c h\u1ED9 th\u1EC3 c\u1EE7a k\u1EBB tr\xFAng. Qu\u1EF7 \u0111i r\u1ED3i, l\xF2ng ng\u01B0\u1EDDi thi ph\xE1p nh\u1EB9 h\u1EB3n nh\u01B0 v\u1EEBa tr\xFAt g\xE1nh." }, "item.am_thi_trao": { "name": "\xC2m Thi Tr\u1EA3o", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "M\xE0i m\xF3ng tay trong \u0111\u1EA5t m\u1ED9 cho t\u1EDBi khi \u0111en b\xF3ng, c\xE0o tr\xFAng th\xEC th\u1ECBt t\xEDm l\u1EA1i. M\u1ED7i tr\u1EA3o l\xE0 m\u1ED9t ng\u1EE5m thi kh\xED nu\u1ED1t v\xE0o, ma ni\u1EC7m d\xE0y th\xEAm." }, "item.thi_doc_am_chuong": { "name": "Thi \u0110\u1ED9c \xC2m Ch\u01B0\u1EDFng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ng\xE2m tay trong n\u01B0\u1EDBc r\u1EEDa x\xE1c b\u1EA3y b\u1EA3y b\u1ED1n ch\xEDn ng\xE0y, b\xE0n tay t\xEDm b\u1EA7m, m\xF9i tanh kh\xF4ng r\u1EEDa s\u1EA1ch. Ch\u01B0\u1EDFng ph\u1EA3i \u0111\u1ED1t ma ni\u1EC7m m\u1EDBi ra, tr\xFAng th\xEC th\u1ECBt th\u1ED1i d\u1EA7n t\u1EEB trong ra." }, "item.thiet_giap_thi_cong": { "name": "Thi\u1EBFt Gi\xE1p Thi C\xF4ng", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n th\xE2n m\xECnh th\xE0nh thi\u1EBFt thi, \u0111ao ch\xE9m t\xF3e l\u1EEDa. Kh\u1EDBp x\u01B0\u01A1ng c\u1EE9ng l\u1EA1i, \u0111i \u0111\u1EE9ng ch\u1EADm ch\u1EA1p nh\u01B0 x\xE1c bi\u1EBFt \u0111i." }, "item.hac_sat_thi_giap": { "name": "H\u1EAFc S\xE1t Thi Gi\xE1p", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "G\u1ECDi thi kh\xED \u0111en k\u1EBFt th\xE0nh gi\xE1p ph\u1EE7 ngo\xE0i da, \u0111ao ch\xE9m v\xE0o k\xEAu nh\u01B0 g\xF5 v\xE1n quan t\xE0i. Ma ni\u1EC7m s\u1EAFp tr\xE0n th\xEC thi kh\xED tr\xE0n sang c\u1EA3 x\xE1c luy\u1EC7n quanh m\xECnh, v\u1EBFt th\u01B0\u01A1ng ch\xFAng kh\xE9p l\u1EA1i." }, "item.thi_vuong_quyen": { "name": "Thi V\u01B0\u01A1ng Quy\u1EC1n", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy\u1EC1n c\u1EE7a thi v\u01B0\u01A1ng trong c\u1ED5 m\u1ED9, \u0111\u1EA5m m\u1ED9t c\xE1i n\xE1t c\u1EA3 bia \u0111\xE1. \u0110\xE1nh h\u0103ng th\xEC thi kh\xED cu\u1ED9n ng\u01B0\u1EE3c v\xE0o l\xF2ng, ma ni\u1EC7m l\xEAn nhanh." }, "item.van_thi_doc_vu": { "name": "V\u1EA1n Thi \u0110\u1ED9c V\u1EE5", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t v\u1EA1n x\xE1c trong b\xE3i tha ma l\u1EA5y kh\xF3i l\xE0m \u0111\u1ED9c, s\u01B0\u01A1ng xanh tr\xE0n t\u1EDBi \u0111\xE2u c\u1ECF \xFAa t\u1EDBi \u0111\xF3. Ma ni\u1EC7m d\xE0y th\xEC x\xE1c luy\u1EC7n \u0111\u1EE9ng trong s\u01B0\u01A1ng l\u1EA1i h\u1ED3i s\u1EE9c." }, "item.thi_hong_cong": { "name": "Thi H\u1ED1ng C\xF4ng", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ti\u1EBFng g\xE0o c\u1EE7a thi v\u01B0\u01A1ng ng\xE0n n\u0103m, c\u1EA3 chi\u1EBFn tr\u01B0\u1EDDng run l\xEAn nh\u01B0 \u0111\u1EA5t m\u1ED9 s\u1EAFp n\u1EE9t. Ph\u1EA3i \u0111\u1ED1t m\u1ED9t m\u1EA3ng ma ni\u1EC7m l\u1EDBn m\u1EDBi g\xE0o n\u1ED5i m\u1ED9t ti\u1EBFng." }, "item.han_thi_chuong": { "name": "H\xE0n Thi Ch\u01B0\u1EDFng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\xE9p c\u1EE7a thi tu hang b\u0103ng, v\xF9i tay trong x\xE1c \u0111\xF4ng c\u1EE9ng cho t\u1EDBi khi m\xE1u c\u0169ng l\u1EA1nh. Ch\u01B0\u1EDFng tr\xFAng th\xEC kinh m\u1EA1ch \u0111\u1ED1i ph\u01B0\u01A1ng \u0111\xF4ng l\u1EA1i, m\u1ED7i ch\u01B0\u1EDFng h\xFAt th\xEAm m\u1ED9t ng\u1EE5m h\xE0n kh\xED v\xE0o l\xF2ng." }, "item.phan_thi_quyet": { "name": "Ph\u1EA7n Thi Quy\u1EBFt", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n l\u1EEDa t\u1EEB m\u1EE1 x\xE1c trong l\xF2 k\xEDn, l\u1EEDa \u0111en kh\xF4ng kh\xF3i, ch\u1EC9 ch\xE1y th\u1ECBt ng\u01B0\u1EDDi. Ph\u1EA3i \u0111\u1ED1t ma ni\u1EC7m l\xE0m b\u1EA5c m\u1EDBi th\u1EA3 \u0111\u01B0\u1EE3c m\u1ED9t tr\u1EADn l\u1EEDa." }, "item.thi_huyet_quyet": { "name": "Th\u1ECB Huy\u1EBFt Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Nh\u1EADp m\xF4n c\u1EE7a ma \u0111\u1EA1o, h\xFAt huy\u1EBFt kh\xED v\xE0o kinh m\u1EA1ch thay linh kh\xED. Tu nhanh h\u01A1n \u0111\u1ED3ng m\xF4n ch\xEDnh \u0111\u1EA1o, \u0111\xEAm ng\u1EE7 hay m\u01A1 th\u1EA5y m\xE1u." }, "item.huyet_diem_ma_trao": { "name": "Huy\u1EBFt Di\u1EC5m Ma Tr\u1EA3o", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "N\u0103m ng\xF3n nhu\u1ED9m l\u1EEDa m\xE1u, x\xE9 th\u1ECBt th\xEC v\u1EBFt th\u01B0\u01A1ng kh\xF4ng kh\xE9p. Ma ni\u1EC7m s\u1EAFp tr\xE0n th\xEC m\xE1u k\u1EBB tr\xFAng tr\u1EA3o ch\u1EA3y ng\u01B0\u1EE3c v\u1EC1 g\u1EA5p \u0111\xF4i. L\u1EA5y ch\u1ED7 t\u01B0\u01A1ng kh\u1EAFc trong kinh m\u1EA1ch l\xE0m l\xF2, l\xE2u ng\xE0y sinh t\xE2m ma." }, "item.doat_nguyen_ma_kinh": { "name": "\u0110o\u1EA1t Nguy\xEAn Ma Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110o\u1EA1t nguy\xEAn kh\xED c\u1EE7a k\u1EBB kh\xE1c luy\u1EC7n v\xE0o \u0111an \u0111i\u1EC1n m\xECnh. Tu nhanh h\u01A1n ng\u01B0\u1EDDi c\xF9ng ph\u1EA9m, nh\u01B0ng \u0111\u1EA1o t\xE2m m\xF2n d\u1EA7n nh\u01B0 \u0111\xE1 b\u1ECB n\u01B0\u1EDBc x\xF3i." }, "item.hoa_huyet_dai_phap": { "name": "H\xF3a Huy\u1EBFt \u0110\u1EA1i Ph\xE1p", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t m\xE1u m\xECnh l\xE0m l\u01B0\u1EE1i \u0111ao, ch\u1EA1m v\xE0o l\xE0 m\xE1u \u0111\u1ED1i ph\u01B0\u01A1ng c\u0169ng tan theo. M\u1ED7i chi\xEAu ph\u1EA3i \u0111\u1ED1t ma ni\u1EC7m l\xE0m c\u1EE7i. Ng\u01B0\u1EDDi luy\u1EC7n l\xE2u n\u0103m da t\xE1i nh\u01B0 gi\u1EA5y, \xEDt ai s\u1ED1ng th\u1ECD." }, "item.huyet_trieu_quyet": { "name": "Huy\u1EBFt Tri\u1EC1u Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1ED5 n\u1EA1p theo con n\u01B0\u1EDBc, tr\u0103ng tr\xF2n th\xEC m\xE1u trong ng\u01B0\u1EDDi d\xE2ng nh\u01B0 tri\u1EC1u. Tu nhanh, kh\xED huy\u1EBFt sung, nh\u01B0ng \u0111\xEAm tri\u1EC1u c\u01B0\u1EDDng l\xF2ng c\u0169ng cu\u1ED9n s\xF3ng." }, "item.tu_la_huyet_kinh": { "name": "Tu La Huy\u1EBFt Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh c\u1EE7a Tu La \u0111\u1EA1o, c\xE0ng gi\u1EBFt c\xE0ng tinh th\xE2m, s\xE1t kh\xED \u0111\u1ECDng th\xE0nh kim mang trong huy\u1EBFt m\u1EA1ch. Ch\u1EC9 v\u1EADn h\xE0nh gi\u1EEFa kinh m\u1EA1ch t\u01B0\u01A1ng kh\u1EAFc, t\xE2m ma theo nh\u01B0 b\xF3ng." }, "item.huyet_anh_chi": { "name": "Huy\u1EBFt \u1EA2nh Ch\u1EC9", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u1EC9 ph\xE1p \u0111\u1EA7u ti\xEAn ma tu d\u1EA1y \u0111\u1EC7 t\u1EED, m\xE0i \u0111\u1EA7u ng\xF3n tay tr\xEAn \u0111\xE1 t\u1EDBi b\u1EADt m\xE1u. Ch\u1EC9 phong \u0111\u1EC3 l\u1EA1i m\u1ED9t l\u1ED7 nh\u1ECF r\u1EC9 m\xE1u m\xE3i kh\xF4ng c\u1EA7m. M\u1ED7i ch\u1EC9 ph\xF3ng ra, ma ni\u1EC7m l\u1EA1i d\xE0y th\xEAm." }, "item.am_sat_quyet": { "name": "\xC2m S\xE1t Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ng\u1ED3i b\xEAn gi\u1EBFng c\u1EA1n n\u1EEDa \u0111\xEAm, h\xFAt s\xE1t kh\xED d\u01B0\u1EDBi \u0111\xE1y v\xE0o kinh m\u1EA1ch. Tu nhanh, m\u1EAFt nh\xECn xa trong t\u1ED1i, nh\u01B0ng tai hay nghe ti\u1EBFng g\u1ECDi t\xEAn m\xECnh." }, "item.cau_hon_toa": { "name": "C\xE2u H\u1ED3n T\u1ECFa", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t ma ni\u1EC7m k\u1EBFt th\xE0nh x\xEDch b\u0103ng, qu\u1EA5n v\xE0o ng\u01B0\u1EDDi l\xE0 si\u1EBFt t\u1EDBi h\u1ED3n. K\u1EBB tr\xFAng \u0111\u1EE9ng s\u1EEFng, m\xF4i t\xEDm l\u1EA1i nh\u01B0 v\u1EEBa v\u1EDBt kh\u1ECFi s\xF4ng m\xF9a \u0111\xF4ng." }, "item.huyet_ha_ma_kinh": { "name": "Huy\u1EBFt H\xE0 Ma Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n huy\u1EBFt kh\xED th\xE0nh m\u1ED9t d\xF2ng s\xF4ng n\xF3ng ch\u1EA3y quanh \u0111an \u0111i\u1EC1n. M\xE1u d\u1ED3i d\xE0o, tu vi l\xEAn nh\u01B0 n\u01B0\u1EDBc l\u0169, \u0111\u1ED9t ph\xE1 th\xEC t\xE2m ma theo d\xF2ng m\xE0 d\xE2ng." }, "item.huyet_than_tai_tao": { "name": "Huy\u1EBFt Th\u1EA7n T\xE1i T\u1EA1o", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ma c\xF4ng gi\u1EEF m\u1EA1ng, \u0111\u1ED1t ma ni\u1EC7m gom m\xE1u \u0111\xE3 \u0111\u1ED5 quanh m\xECnh m\xE0 \u0111\u1EAFp l\u1EA1i th\xE2n. V\u1EBFt ch\xE9m v\u1EEBa h\xE1 \u0111\xE3 kh\xE9p, ch\u1EC9 c\xF2n m\xF9i tanh \u0111\u1ECDng tr\xEAn \xE1o." }, "item.huyet_thu_ma_cong": { "name": "Huy\u1EBFt Th\u1EE5 Ma C\xF4ng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Gieo m\u1ED9t h\u1EA1t ma ch\u1EE7ng v\xE0o huy\u1EBFt m\u1EA1ch, l\u1EA5y m\xE1u m\xECnh nu\xF4i th\xE0nh c\xE2y. \u0110\u1ED1t ma ni\u1EC7m th\xEC r\u1EC5 \u0111\u1ECF \u0111\xE2m kh\u1ECFi \u0111\u1EA5t, xuy\xEAn ch\xE2n m\u1ECDi k\u1EBB \u0111\u1EE9ng g\u1EA7n m\xE0 h\xFAt." }, "item.cuu_u_han_ma_kinh": { "name": "C\u1EEDu U H\xE0n Ma Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xE9p t\u1EEB v\xE1ch hang C\u1EEDu U, n\u01A1i h\xE0n kh\xED l\u1EA1nh t\u1EDBi \u0111\xF4ng c\u1EA3 h\u1ED3n ng\u01B0\u1EDDi. Th\xE2n luy\u1EC7n c\u1EE9ng nh\u01B0 b\u0103ng \u0111\xE1, l\xF2ng c\u0169ng l\u1EA1nh d\u1EA7n, \u0111\xEAm \u0111\u1ED9t ph\xE1 hay th\u1EA5y m\xECnh \u0111\u1EE9ng gi\u1EEFa tuy\u1EBFt." }, "item.thon_huyet_ma_chuong": { "name": "Th\xF4n Huy\u1EBFt Ma Ch\u01B0\u1EDFng", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "L\xF2ng b\xE0n tay m\u1EDF m\u1ED9t mi\u1EC7ng m\xE1u, ch\u01B0\u1EDFng tr\xFAng l\xE0 nu\u1ED1t huy\u1EBFt kh\xED k\u1EBB \u0111\u1ECBch v\xE0o th\xE2n. Ma ni\u1EC7m c\xE0ng s\xE1t tr\u1EA7n, mi\u1EC7ng c\xE0ng h\xE1 r\u1ED9ng." }, "item.kim_huyet_ma_kinh": { "name": "Kim Huy\u1EBFt Ma Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n s\xE1t kh\xED trong m\xE1u th\xE0nh kim tinh, g\xE2n c\u1ED1t r\u1EAFn nh\u01B0 th\xE9p. Tu t\u1EDBi t\u1EA7ng cao, m\xE1u ch\u1EA3y ra \u0111\xF4ng th\xE0nh v\u1EE5n s\u1EAFt, l\xF2ng ng\u01B0\u1EDDi c\u0169ng ngu\u1ED9i nh\u01B0 s\u1EAFt." }, "item.thien_ma_chan_kinh": { "name": "Thi\xEAn Ma Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "G\u1ED1c c\u1EE7a m\u1ECDi ma c\xF4ng, t\u01B0\u01A1ng truy\u1EC1n do Thi\xEAn Ma ngo\xE0i c\xF5i \u0111\u1ECDc cho ng\u01B0\u1EDDi nghe. Th\u1EA7n th\u1EE9c ng\u01B0\u1EDDi luy\u1EC7n ph\u1EE7 c\u1EA3 tr\u0103m d\u1EB7m, nh\u01B0ng t\xE2m ma \u0111\xE3 ng\u1ED3i s\u1EB5n trong \u0111\xF3." }, "item.huyet_ma_thien_dao": { "name": "Huy\u1EBFt Ma Thi\xEAn \u0110ao", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t c\u1EA1n ma ni\u1EC7m t\xEDch trong l\xF2ng, \u0111ao kh\xED ch\xE9m ra nh\u01B0 s\xF3ng bi\u1EC3n \u0111\u1ECF. V\u1EBFt \u0111ao v\u1EEBa ch\u1EA3y m\xE1u v\u1EEBa th\u1ED1i r\u1EEFa, \u0111an d\u01B0\u1EE3c th\u01B0\u1EDDng kh\xF4ng c\u1EE9u k\u1ECBp." }, "item.huyet_ma_nghich_mach": { "name": "Huy\u1EBFt Ma Ngh\u1ECBch M\u1EA1ch C\xF4ng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "\xC9p linh kh\xED ch\u1EA1y ng\u01B0\u1EE3c, l\u1EA5y ch\u1ED7 t\u01B0\u01A1ng kh\u1EAFc l\xE0m l\xF2 luy\u1EC7n. Ch\u1EC9 v\u1EADn h\xE0nh khi k\u1EC1 m\u1EA3nh kh\u1EAFc n\xF3. L\xE2u ng\xE0y sinh t\xE2m ma." }, "item.huyet_trao_cong": { "name": "Huy\u1EBFt Tr\u1EA3o C\xF4ng", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u1EA3o c\xF4ng ma tu vi\u1EBFt b\u1EB1ng m\xE1u l\xEAn l\u1EE5a tr\u1EAFng. N\u0103m ng\xF3n c\xE0o qua, m\xE1u theo n\u0103m \u0111\u01B0\u1EDDng m\xE0 ch\u1EA3y kh\xF4ng d\u1EE9t, m\xF9i m\xE1u c\u0169ng theo \u0111\xF3 ng\u1EA5m v\xE0o l\xF2ng ng\u01B0\u1EDDi ra tr\u1EA3o." }, "item.huyet_mang_kinh": { "name": "Huy\u1EBFt Mang Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "\xC9p m\xE1u n\u01A1i \u0111\u1EA7u ng\xF3n th\xE0nh m\u1ED9t s\u1EE3i mang \u0111\u1ECF, \u0111\xE2m qua gi\xE1p nh\u01B0 kim qua l\u1EE5a. M\u1ED7i l\u1EA7n ph\xF3ng ra, ma ni\u1EC7m l\u1EA1i d\xE0y th\xEAm m\u1ED9t t\u1EA7ng." }, "item.huyet_phuoc_chu": { "name": "Huy\u1EBFt Ph\u01B0\u1EE3c Ch\xFA", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ni\u1EC7m ch\xFA th\xEC m\xE1u trong ng\u01B0\u1EDDi k\u1EBB \u0111\u1ECBch k\u1EBFt th\xE0nh t\u01A1, t\u1EF1 tr\xF3i l\u1EA5y g\xE2n c\u1ED1t. K\u1EBB tr\xFAng \u0111\u1EE9ng c\u1EE9ng, m\u1EA1ch m\xE1u n\u1ED5i l\u1EB1n \u0111\u1ECF d\u01B0\u1EDBi da." }, "item.huyet_giap_ma_cong": { "name": "Huy\u1EBFt Gi\xE1p Ma C\xF4ng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t ma ni\u1EC7m cho m\xE1u r\u1EC9 ra kh\u1EAFp da, \u0111\xF4ng l\u1EA1i th\xE0nh gi\xE1p \u0111\u1ECF s\u1EABm. L\xF2ng \u0111ang s\xF4i th\xEC ngu\u1ED9i b\u1EDBt, th\xE2n l\u1EA1i c\u1EE9ng nh\u01B0 s\u1EAFt nung." }, "item.xich_luyen_ma_dao": { "name": "X\xEDch Luy\u1EC7n Ma \u0110ao", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110ao ph\xE1p luy\u1EC7n b\u1EB1ng m\xE1u c\u1EE7a tr\u0103m k\u1EBB b\u1EA1i tr\u1EADn, l\u01B0\u1EE1i \u0111ao kh\xED \u0111\u1ECF nh\u01B0 s\u1EAFt m\u1EDBi ra l\xF2. Ch\xE9m m\u1ED9t nh\xE1t, m\xE1u k\u1EBB tr\xFAng v\xE0 ma ni\u1EC7m ng\u01B0\u1EDDi c\u1EA7m \u0111ao c\xF9ng tr\xE0o l\xEAn." }, "item.huyet_lao_ma_cong": { "name": "Huy\u1EBFt Lao Ma C\xF4ng", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Vung tay l\xE0 m\xE0n m\xE1u \u0111\u1ED5 xu\u1ED1ng th\xE0nh l\u1ED3ng, ch\u1EE5p c\u1EA3 m\u1EA5y k\u1EBB \u0111\u1EE9ng g\u1EA7n. Song l\u1ED3ng m\u1EC1m nh\u01B0 th\u1ECBt, c\xE0ng gi\xE3y c\xE0ng si\u1EBFt." }, "item.bat_tu_huyet_than": { "name": "B\u1EA5t T\u1EED Huy\u1EBFt Th\xE2n", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t ma ni\u1EC7m \u0111\u1ED5 v\xE0o huy\u1EBFt nh\u1EE5c, th\u1ECBt v\u1EEBa r\xE1ch \u0111\xE3 t\u1EF1 li\u1EC1n. \u0110ao ki\u1EBFm ch\xE9m v\xE0o nh\u01B0 ch\xE9m v\xE0o b\xF9n \u0111\u1ECF." }, "item.tu_la_sat_kiem": { "name": "Tu La S\xE1t Ki\u1EBFm", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm c\u1EE7a Tu La \u0111\u1EA1o, s\xE1t kh\xED t\xEDch bao nhi\xEAu tr\u1EADn th\xEC ki\u1EBFm n\u1EB7ng b\u1EA5y nhi\xEAu. Ki\u1EBFm ra kh\xF4ng \u0111\u1EC3 l\u1EA1i x\xE1c l\xE0nh, ma ni\u1EC7m ng\u01B0\u1EDDi c\u1EA7m c\u0169ng kh\xF4ng c\xF2n \u0111\u01B0\u1EDDng lui." }, "item.thien_ma_an": { "name": "Thi\xEAn Ma \u1EA4n", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "M\u1ED9t d\u1EA5u \u1EA5n \u0111en in th\u1EB3ng v\xE0o th\u1EA7n h\u1ED3n, k\u1EBB tr\xFAng th\u1EA5y b\xF3ng Thi\xEAn Ma \u0111\u1EE9ng sau l\u01B0ng m\xECnh. \u1EA4n m\u1EDF m\u1ED9t l\u1EA7n ph\u1EA3i \u0111\u1EE3i l\xE2u m\u1EDBi m\u1EDF l\u1EA1i." }, "item.huyet_son_ma_than": { "name": "Huy\u1EBFt S\u01A1n Ma Th\xE2n", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1ED1t ma ni\u1EC7m d\u1ED3n m\xE1u kh\u1EAFp ng\u01B0\u1EDDi v\u1EC1 m\u1ED9t ch\u1ED7, th\xE2n \u0111\u1EE9ng s\u1EEBng s\u1EEFng nh\u01B0 n\xFAi m\xE1u. \u0110\xF2n \u0111\xE1nh v\xE0o ch\u1EC9 l\xE0m g\u1EE3n m\u1EB7t m\xE1u r\u1ED3i l\u1EB7ng." }, "item.truong_sinh_huyet_kinh": { "name": "Tr\u01B0\u1EDDng Sinh Huy\u1EBFt Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "H\xFAt sinh kh\xED t\u1EEB m\xE1u \u0111\xE3 \u0111\u1ED5 quanh tr\u1EADn m\xE0 n\u1ED1i m\u1EA1ng m\xECnh. V\u1EBFt th\u01B0\u01A1ng kh\xE9p nhanh, ma ni\u1EC7m l\u1EA1i n\u1EB7ng th\xEAm nh\u01B0 v\u1EEBa u\u1ED1ng m\xE1u ng\u01B0\u1EDDi." }, "item.thanh_tinh_tam_kinh": { "name": "Thanh T\u1ECBnh T\xE2m Kinh", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh nh\u1EADp m\xF4n c\u1EE7a ti\u1EC3u sa di, t\u1EE5ng l\xFAc qu\xE9t s\xE2n ch\xF9a. M\u1ED7i nh\xE1t ch\u1ED5i m\u1ED9t h\u01A1i th\u1EDF, qu\xE9t xong s\xE2n th\xEC l\xE1 r\u01A1i kh\xF4ng c\xF2n l\xE0m l\xF2ng xao." }, "item.kim_cuong_chuong": { "name": "Kim C\u01B0\u01A1ng Ch\u01B0\u1EDFng", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u01B0\u1EDFng ph\xE1p v\xF5 t\u0103ng luy\u1EC7n tr\xEAn c\u1ECDc g\u1ED7 tr\u01B0\u1EDBc c\u1ED5ng ch\xF9a. B\xE0n tay v\u1EADn kh\xED \xE1nh m\xE0u \u0111\u1ED3ng, m\u1ED9t ch\u01B0\u1EDFng \u0111\u1EA9y ng\u01B0\u1EDDi l\xF9i ba b\u01B0\u1EDBc." }, "item.su_tu_hong": { "name": "S\u01B0 T\u1EED H\u1ED1ng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1ED3n linh kh\xED t\u1EEB \u0111an \u0111i\u1EC1n l\xEAn c\u1ED5 h\u1ECDng m\xE0 qu\xE1t m\u1ED9t ti\u1EBFng. K\u1EBB \u0111\u1EE9ng tr\u01B0\u1EDBc \xF9 tai hoa m\u1EAFt, \u0111\u1EE9ng g\u1EA7n c\u0169ng ph\u1EA3i l\u1EA3o \u0111\u1EA3o." }, "item.hang_ma_chuong": { "name": "H\xE0ng Ma Ch\u01B0\u1EDFng", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u01B0\u1EDFng c\u1EE7a t\u0103ng tr\u1EEB t\xE0 n\u01B0\u1EDBc Vi\xEAm, l\xF2ng b\xE0n tay ch\xE1y m\u1ED9t ng\u1ECDn l\u1EEDa v\xE0ng nh\u01B0 \u0111\xE8n tr\u01B0\u1EDBc t\u01B0\u1EE3ng. T\xE0 v\u1EADt tr\xFAng ch\u01B0\u1EDFng th\xEC l\u1EEDa b\xE1m kh\xF4ng t\u1EAFt." }, "item.bat_nha_tam_kinh": { "name": "B\xE1t Nh\xE3 T\xE2m Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh ng\u1EAFn hai tr\u0103m ch\u1EEF, cao t\u0103ng t\u1EE5ng c\u1EA3 \u0111\u1EDDi ch\u01B0a h\u1EBFt ngh\u0129a. Th\u1EA5y m\u1ECDi th\u1EE9 \u0111\u1EC1u kh\xF4ng, linh kh\xED qua kinh m\u1EA1ch nh\u01B0 gi\xF3 qua l\u1ED7 chu\xF4ng." }, "item.dai_bi_chu": { "name": "\u0110\u1EA1i Bi Ch\xFA", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xFA t\u1EE5ng b\xEAn gi\u01B0\u1EDDng ng\u01B0\u1EDDi b\u1EC7nh trong ch\xF9a. Ti\u1EBFng t\u1EE5ng tr\u1EA7m nh\u01B0 \u0111\u1EA5t, v\u1EBFt th\u01B0\u01A1ng c\u1EE7a ng\u01B0\u1EDDi nghe kh\xE9p l\u1EA1i theo t\u1EEBng c\xE2u." }, "item.thien_thu_phat_chuong": { "name": "Thi\xEAn Th\u1EE7 Ph\u1EADt Ch\u01B0\u1EDFng", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Sau l\u01B0ng ng\u01B0\u1EDDi thi ph\xE1p hi\u1EC7n ngh\xECn c\xE1nh tay v\xE0ng, m\u1ED7i tay m\u1ED9t ch\u01B0\u1EDFng. Ch\u01B0\u1EDFng phong r\u01A1i nh\u01B0 m\u01B0a, c\u1EA3 m\u1ED9t v\xF9ng kh\xF4ng ch\u1ED7 tr\xE1nh." }, "item.nhu_lai_tang_kinh": { "name": "Nh\u01B0 Lai T\u1EA1ng Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh n\xF3i trong m\u1ED7i ng\u01B0\u1EDDi v\u1ED1n c\xF3 m\u1ED9t h\u1EA1t Ph\u1EADt ch\u01B0a n\u1EA3y. Luy\u1EC7n t\u1EDBi c\xF9ng th\xEC t\xE2m s\xE1ng nh\u01B0 \u0111\xE8n l\u01B0u ly, t\xE2m ma t\u1EDBi g\u1EA7n t\u1EF1 tan." }, "item.dai_nhat_phat_an": { "name": "\u0110\u1EA1i Nh\u1EADt Ph\u1EADt \u1EA4n", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "\u1EA4n ph\xE1p k\u1EBFt b\u1EB1ng hai tay ch\u1EAFp tr\u01B0\u1EDBc ng\u1EF1c, m\u1EDF ra l\xE0 m\u1ED9t v\u1EA7ng m\u1EB7t tr\u1EDDi nh\u1ECF. \xC1nh s\xE1ng chi\u1EBFu t\u1EDBi \u0111\xE2u, ma kh\xED ch\xE1y x\xE8o t\u1EDBi \u0111\xF3." }, "item.quy_tuc_cong": { "name": "Quy T\u1EE9c C\xF4ng", "quality": 1, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EDF ch\u1EADm nh\u01B0 r\xF9a ng\u1EE7 \u0111\xF4ng, m\u1ED9t h\u01A1i d\xE0i b\u1EB1ng m\u01B0\u1EDDi h\u01A1i ng\u01B0\u1EDDi th\u01B0\u1EDDng. Ng\u01B0 ph\u1EE7 l\u1EB7n m\xF2 trai hay h\u1ECDc." }, "item.ngu_phong_quyet": { "name": "Ng\u1EF1 Phong Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Kh\u1EA9u quy\u1EBFt n\u01B0\u01A1ng gi\xF3 m\xE0 th\u1ED5 n\u1EA1p, gi\xF3 l\u1EB7ng th\xEC linh kh\xED c\u0169ng ch\u1EADm. B\u1EA3n ch\xE9p tay, l\u1EC1 s\xE1ch \u0111\u1EA7y ch\u1EEF ng\u01B0\u1EDDi tr\u01B0\u1EDBc s\u1EEDa." }, "item.chan_loi_quyet": { "name": "Ch\u1EA5n L\xF4i Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1ED3n linh kh\xED t\u1EEBng \u0111\u1EE3t nh\u01B0 s\u1EA5m r\u1EC1n, nhanh m\xE0 g\u1EAFt. Luy\u1EC7n sai nh\u1ECBp th\xEC tim \u0111\u1EADp lo\u1EA1n ba ng\xE0y." }, "item.phieu_phong_bo": { "name": "Phi\xEAu Phong B\u1ED9", "quality": 1, "cat": "C\xF4ng Ph\xE1p", "desc": "B\u1ED9 ph\xE1p c\u1EE7a g\xE1nh xi\u1EBFc rong, ch\xE2n l\u01B0\u1EDBt nh\u01B0 l\xE1 b\u1ECB gi\xF3 cu\u1ED1n. N\xE9 \u0111\u01B0\u1EE3c m\u1ED9t \u0111\xF2n l\xE0 l\u1EDDi." }, "item.bon_thach_quyen": { "name": "B\xF4n Th\u1EA1ch Quy\u1EC1n", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy\u1EC1n ph\u1ED5 v\xF5 qu\xE1n, d\u1ED3n s\u1EE9c nh\u01B0 \u0111\xE1 l\u0103n s\u01B0\u1EDDn n\xFAi. Ra \u0111\xF2n ch\u1EADm, tr\xFAng th\xEC g\xE3y x\u01B0\u01A1ng." }, "item.huyen_bang_chi": { "name": "Huy\u1EC1n B\u0103ng Ch\u1EC9", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "D\u1ED3n h\xE0n kh\xED ra \u0111\u1EA7u ng\xF3n tay m\xE0 \u0111i\u1EC3m, ch\u1ED7 tr\xFAng \u0111\xF3ng m\u1ED9t v\xF2ng b\u0103ng tr\u1EAFng. Tu s\u0129 B\u1EAFc Minh truy\u1EC1n ra ngo\xE0i t\u1EEB l\xE2u." }, "item.duong_thao_quyet": { "name": "D\u01B0\u1EE1ng Th\u1EA3o Quy\u1EBFt", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Kh\u1EA9u quy\u1EBFt kh\u1EAFc tr\xEAn th\u1EBB tre c\u1EAFm \u0111\u1EA7u lu\u1ED1ng thu\u1ED1c, d\u1EA1y th\u1EDF theo nh\u1ECBp c\u1ECF m\u1ECDc. Luy\u1EC7n l\xE2u th\xEC ng\u1EEDi l\xE1 \u0111\xE3 bi\u1EBFt c\xE2y n\xE0o \u0111\u1ED9c, th\xE2n c\u0169ng \xEDt \u1ED1m." }, "item.lang_phong_quyet": { "name": "L\u0103ng Phong Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p c\u1EE7a k\u1EBB \u0111i \u0111\u01B0\u1EDDng m\u1ED9t m\xECnh, th\u1EDF theo nh\u1ECBp gi\xF3. Luy\u1EC7n l\xE2u th\xEC b\u01B0\u1EDBc ch\xE2n nh\u1EB9, l\xE1 kh\xF4 d\u1EABm l\xEAn kh\xF4ng v\u1EE1." }, "item.han_bang_chuong": { "name": "H\xE0n B\u0103ng Ch\u01B0\u1EDFng", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u01B0\u1EDFng ph\xE1p v\u1EBD tr\xEAn da c\xE1, m\xE9p c\xF2n v\u1EA3y. \u0110\xE1nh tr\xFAng ng\u01B0\u1EDDi th\xEC in l\u1EA1i m\u1ED9t d\u1EA5u b\xE0n tay \u0111\xF3ng s\u01B0\u01A1ng." }, "item.phong_huyet_thu": { "name": "Phong Huy\u1EC7t Th\u1EE7", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ng\xF3n \u0111i\u1EC3m huy\u1EC7t nha m\xF4n truy\u1EC1n cho b\u1ED9 \u0111\u1EA7u, b\u1EAFt s\u1ED1ng \u0111\u01B0\u1EE3c th\xEC kh\u1ECFi ph\u1EA3i khi\xEAng x\xE1c v\u1EC1. Ng\xF3n tay ch\u1ECDc t\u1EDBi, c\u1EA3 n\u1EEDa ng\u01B0\u1EDDi c\u1EE9ng l\u1EA1i." }, "item.dang_la_thu": { "name": "\u0110\u1EB1ng La Th\u1EE7", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EE7 ph\xE1p ng\u01B0\u1EDDi gi\u1EEF v\u01B0\u1EDDn d\xF9ng b\u1EAFt d\u01B0\u1EE3c tinh, n\u0103m ng\xF3n nh\u01B0 n\u0103m s\u1EE3i d\xE2y leo. Qu\u1EA5n \u0111\u01B0\u1EE3c r\u1ED3i th\xEC c\u1EE7 s\xE2m mu\u1ED1n \u0111\u1ED9n th\u1ED5 c\u0169ng kh\xF4ng k\u1ECBp." }, "item.thanh_loi_quyet": { "name": "Thanh L\xF4i Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p d\u1EABn s\xE9t tr\u1EDDi v\xE0o kinh m\u1EA1ch, m\u1ED7i l\u1EA7n \u0111\u1ED9t ph\xE1 ph\u1EA3i \u0111\u1EE9ng gi\u1EEFa gi\xF4ng m\u01B0\u1EE3n s\xE9t \u0111\xE1nh v\u1EE1 b\xECnh c\u1EA3nh. Luy\u1EC7n th\xE0nh th\xEC t\xF3c g\xE1y lu\xF4n d\u1EF1ng, \u0111i \u0111\xE2u c\u0169ng nhanh h\u01A1n ng\u01B0\u1EDDi n\u1EEDa b\u01B0\u1EDBc." }, "item.huyen_bang_tam_kinh": { "name": "Huy\u1EC1n B\u0103ng T\xE2m Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh c\u1EE7a \u0111\u1EA1o nh\xE2n B\u1EAFc Minh ng\u1ED3i tr\xEAn b\u0103ng m\xE0 nh\u1EADp \u0111\u1ECBnh. L\xF2ng l\u1EA1nh nh\u01B0 b\u0103ng th\xEC t\xE2m ma kh\xF4ng c\xF3 ch\u1ED7 b\xE1m." }, "item.hoa_van_chuong": { "name": "H\u1ECFa V\xE2n Ch\u01B0\u1EDFng", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u01B0\u1EDFng ph\xE1p linh \u0111\u1ED3n L\u01B0\u01A1ng Qu\u1ED1c d\u1EA1y \u0111\u1EC3 \u0111\u1ED1t c\u1EA3 b\u1EA7y y\xEAu tr\xEAn \u1EA3i. M\u1ED9t ch\u01B0\u1EDFng ra l\xE0 m\u1ED9t \u0111\xE1m m\xE2y l\u1EEDa \u0111\xE8 xu\u1ED1ng." }, "item.trong_son_quyet": { "name": "Tr\u1ECDng S\u01A1n Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p luy\u1EC7n th\xE2n nh\u01B0 v\xE1c n\xFAi, m\u1ED7i ng\xE0y n\u1EB7ng th\xEAm m\u1ED9t c\xE2n \u0111\xE1. Ng\u01B0\u1EDDi luy\u1EC7n l\xE2u ng\xE3 t\u1EEB v\xE1ch n\xFAi xu\u1ED1ng ch\u1EC9 \u0111au l\u01B0ng." }, "item.toa_long_thu": { "name": "T\u1ECFa Long Th\u1EE7", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "C\u1EA7m n\xE3 th\u1EE7 c\u1EE7a ng\u01B0\u1EDDi b\u1EAFt giao long d\u01B0\u1EDBi bi\u1EC3n, tay m\u1EC1m nh\u01B0 n\u01B0\u1EDBc m\xE0 si\u1EBFt nh\u01B0 x\xEDch. N\u1EAFm \u0111\u01B0\u1EE3c c\u1ED5 tay th\xEC \u0111\u1EEBng mong r\xFAt ra." }, "item.hoi_phong_chuong": { "name": "H\u1ED3i Phong Ch\u01B0\u1EDFng", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u01B0\u1EDFng ph\xE1p \u0111\xE1nh theo gi\xF3 xo\xE1y, ch\u01B0\u1EDFng tr\u01B0\u1EDBc ch\u01B0a thu ch\u01B0\u1EDFng sau \u0111\xE3 t\u1EDBi. Gi\xF3 qu\u1EA9n quanh tay, c\xE1c th\u1EBF kh\xE1c c\u0169ng ra nhanh theo." }, "item.van_duoc_tam_kinh": { "name": "V\u1EA1n D\u01B0\u1EE3c T\xE2m Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m kinh c\u1EE7a ng\u01B0\u1EDDi l\u1EADp v\u01B0\u1EDDn thu\u1ED1c trong b\xED c\u1EA3nh, d\u1EA1y nu\xF4i linh kh\xED nh\u01B0 nu\xF4i c\xE2y. Luy\u1EC7n l\xE2u th\xEC kh\xED huy\u1EBFt d\u1ED3i d\xE0o nh\u01B0 r\u1EC5 gi\xE0 g\u1EB7p m\u01B0a." }, "item.tam_duong_kinh": { "name": "Tam D\u01B0\u01A1ng Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "M\u1ED9c sinh h\u1ECFa, h\u1ECFa sinh th\u1ED5, ba lu\u1ED3ng kh\xED ch\u1EA1y n\u1ED1i \u0111u\xF4i nhau kh\xF4ng \u0111\u1EE9t. T\xE1n tu \u1EA9n n\xFAi ch\xE9p l\u1EA1i t\u1EEB v\xE1ch m\u1ED9t \u0111\u1ED9ng ph\u1EE7 s\u1EADp." }, "item.luu_van_quyet": { "name": "L\u01B0u V\xE2n Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p theo m\xE2y tr\xF4i, kh\xF4ng \u0111\u1EE9ng y\xEAn m\u1ED9t ch\u1ED7 m\xE0 c\u0169ng kh\xF4ng v\u1ED9i. Ng\u01B0\u1EDDi luy\u1EC7n th\xE0nh \u0111i gi\u1EEFa m\u01B0a ki\u1EBFm nh\u01B0 \u0111i gi\u1EEFa m\u01B0a ph\xF9n." }, "item.chuong_tam_loi": { "name": "Ch\u01B0\u1EDFng T\xE2m L\xF4i", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "N\u1EAFm s\xE9t trong l\xF2ng b\xE0n tay r\u1ED3i v\u1ED7 v\xE0o ng\u01B0\u1EDDi. Ch\u1ED7 n\xE0o \u0111\xE3 c\xF3 d\u1EA5u s\xE9t, ch\u01B0\u1EDFng sau n\u1ED5 to g\u1EA5p \u0111\xF4i." }, "item.kim_than_phap_tuong": { "name": "Kim Th\xE2n Ph\xE1p T\u01B0\u1EDBng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\xE1p t\u01B0\u1EDBng v\xE0ng cao ba tr\u01B0\u1EE3ng hi\u1EC7n sau l\u01B0ng, \u0111\u1EE1 \u0111\xF2n thay th\xE2n th\u1EADt. Ch\u01B0\u1EDFng m\xF4n c\xE1c t\xF4ng gi\u1EEF k\xEDn, kh\xF4ng truy\u1EC1n cho \u0111\u1EC7 t\u1EED ngo\xE0i ch\xE2n truy\u1EC1n." }, "item.quy_hai_kinh": { "name": "Quy H\u1EA3i Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u0103m s\xF4ng \u0111\u1ED5 v\u1EC1 bi\u1EC3n, linh kh\xED \u0111\u1ED5 v\u1EC1 \u0111an \u0111i\u1EC1n, n\u01B0\u1EDBc d\xE2ng \u0111\u1EE7 th\xEC t\u1EF1 tr\xE0n qua \u0111\xEA b\xECnh c\u1EA3nh. Th\u1EA7n th\u1EE9c ng\u01B0\u1EDDi luy\u1EC7n m\u1EDF r\u1ED9ng nh\u01B0 m\u1EB7t bi\u1EC3n, gi\xF3 lay ng\u1ECDn c\u1ECF ngo\xE0i tr\u0103m tr\u01B0\u1EE3ng c\u0169ng nghe." }, "item.cuu_duong_chan_kinh": { "name": "C\u1EEDu D\u01B0\u01A1ng Ch\xE2n Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xEDn v\u1EA7ng m\u1EB7t tr\u1EDDi trong \u0111an \u0111i\u1EC1n, luy\u1EC7n t\u1EDBi t\u1EA7ng ch\xF3t th\xEC gi\u1EEFa m\xF9a \u0111\xF4ng c\u0169ng \u0111\u1ED5 m\u1ED3 h\xF4i. X\xEDch H\xE0 Ch\xE2n Qu\xE2n d\xF9ng n\xF3 \u0111\u1EC3 gi\u1EEF l\u1EEDa l\xF2." }, "item.huyen_minh_chan_kinh": { "name": "Huy\u1EC1n Minh Ch\xE2n Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xE2n kinh t\u01B0\u01A1ng truy\u1EC1n ch\xE9p t\u1EEB v\xE1ch b\u0103ng \u0111\xE1y bi\u1EC3n B\u1EAFc Minh. Ng\u01B0\u1EDDi luy\u1EC7n th\xE0nh ng\u1ED3i \u0111\xE2u, n\u01B0\u1EDBc quanh \u0111\xF3 \u0111\xF3ng b\u0103ng m\xE0 l\xF2ng kh\xF4ng g\u1EE3n s\xF3ng, ph\xE1 c\u1EA3nh c\u0169ng kh\xF4ng run tay." }, "item.tam_kiem_quyet": { "name": "T\xE2m Ki\u1EBFm Quy\u1EBFt", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFm kh\xF4ng \u1EDF tay m\xE0 \u1EDF l\xF2ng, m\u1EAFt nh\u1EAFm v\u1EABn ch\xE9m tr\xFAng. Ki\u1EBFm tu m\xF9 c\u1EA3 \u0111\u1EDDi ch\u1EC9 ghi l\u1EA1i \u0111\u01B0\u1EE3c m\u01B0\u1EDDi hai c\xE2u." }, "item.huyen_hoang_chuong": { "name": "Huy\u1EC1n Ho\xE0ng Ch\u01B0\u1EDFng", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\u01B0\u1EDFng n\u1EB7ng nh\u01B0 tr\u1EDDi \u0111\xE8 xu\u1ED1ng \u0111\u1EA5t, ba tr\u0103m n\u0103m ch\u01B0a ai \u0111\u1EE1 n\u1ED5i m\xE0 \u0111\u1EE9ng th\u1EB3ng. Tr\xFAng m\u1ED9t ch\u01B0\u1EDFng, hai ch\xE2n l\xFAn v\xE0o \u0111\xE1 t\u1EDBi g\u1ED1i." }, "item.sinh_sinh_bat_tuc": { "name": "Sinh Sinh B\u1EA5t T\u1EE9c", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Cu\u1ED1n kinh c\u1EE7a \u0111\u1EA1o s\u0129 \u0111\u1EBFn b\u1EAFt h\u1ED3 ly r\u1ED3i kh\xF4ng v\u1EC1, gi\u1EA5y c\xF2n m\xF9i ph\u1EA5n. Thi ph\xE1p th\xEC c\u1ECF m\u1ECDc l\xEAn quanh ch\xE2n, v\u1EBFt th\u01B0\u01A1ng theo \u0111\xF3 m\xE0 l\xE0nh." }, "item.canh_kim_chan_kinh": { "name": "Canh Kim Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Kim kh\xED s\u1EAFc nh\u1EA5t trong tr\u1EDDi \u0111\u1EA5t l\xE0 canh kim, luy\u1EC7n v\xE0o th\xE2n th\xEC da th\u1ECBt c\u0169ng th\xE0nh l\u01B0\u1EE1i ki\u1EBFm. T\u01B0\u01A1ng truy\u1EC1n m\u1ED9t v\u1ECB trong Ng\u0169 T\u1ED5 luy\u1EC7n n\xF3 su\u1ED1t nh\u1EEFng n\u0103m canh Thi\xEAn M\xF4n." }, "item.truong_sinh_chan_kinh": { "name": "Tr\u01B0\u1EDDng Sinh Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "N\u01B0\u1EDBc nu\xF4i c\xE2y, c\xE2y gi\u1EEF n\u01B0\u1EDBc, v\xF2ng sinh kh\xED trong ng\u01B0\u1EDDi ch\u1EA1y m\xE3i kh\xF4ng c\u1EA1n. V\xE2n Du Ch\xE2n Qu\xE2n \u0111i kh\u1EAFp thi\xEAn h\u1EA1, cu\u1ED1n n\xE0y kh\xF4ng r\u1EDDi tay \xE1o." }, "item.phan_thien_chan_hoa": { "name": "Ph\u1EA7n Thi\xEAn Ch\xE2n H\u1ECFa", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "L\u1EEDa luy\u1EC7n trong l\xF2 \u0111an ba tr\u0103m n\u0103m r\u1ED3i luy\u1EC7n v\xE0o ng\u01B0\u1EDDi. Th\u1EA3 ra m\u1ED9t l\u1EA7n, c\u1EA3 khe n\xFAi ch\xE1y tr\u1EE5i, \u0111\xE1 ch\u1EA3y th\xE0nh n\u01B0\u1EDBc." }, "item.thien_loi_chinh_phap": { "name": "Thi\xEAn L\xF4i Ch\xEDnh Ph\xE1p", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xEDnh ph\xE1p thay tr\u1EDDi gi\xE1ng s\xE9t, g\u1ECDi ch\xEDn \u0111\u1EA1o l\xF4i li\u1EC1n nhau. \u0110\u1EA1o tr\u01B0\u1EDBc \u0111\u1EC3 d\u1EA5u, \u0111\u1EA1o sau theo d\u1EA5u \u1EA5y m\xE0 xu\u1ED1ng." }, "item.cuu_thien_cuong_phong": { "name": "C\u1EEDu Thi\xEAn C\u01B0\u01A1ng Phong", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Gi\xF3 tr\xEAn ch\xEDn t\u1EA7ng tr\u1EDDi c\u1EE9ng nh\u01B0 \u0111ao, chim bay l\u1EA1c v\xE0o th\xE0nh m\u1ED9t n\u1EAFm l\xF4ng. D\u1EABn \u0111\u01B0\u1EE3c m\u1ED9t s\u1EE3i xu\u1ED1ng, c\u1EA3 phe theo gi\xF3 m\xE0 ra tay nhanh h\u01A1n." }, "item.thien_cuong_loi_quyet": { "name": "Thi\xEAn C\u01B0\u01A1ng L\xF4i Quy\u1EBFt", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p d\u1EABn s\xE9t ch\xEDn t\u1EA7ng tr\u1EDDi v\xE0o kinh m\u1EA1ch theo \u0111\u01B0\u1EDDng g\u1EA5p kh\xFAc, m\u1ED7i l\u1EA7n s\xE9t qua l\xE0 m\u1ED9t l\u1EA7n b\xECnh c\u1EA3nh n\u1EE9t th\xEAm." }, "item.thanh_minh_phong_kinh": { "name": "Thanh Minh Phong Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xE9p t\u1EEB gi\xF3 tr\xEAn t\u1EA7ng m\xE2y cao nh\u1EA5t, n\u01A1i chim c\u0169ng kh\xF4ng bay t\u1EDBi; luy\u1EC7n th\xE0nh th\xEC th\xE2n nh\u1EB9 nh\u01B0 t\u01A1 li\u1EC5u, gi\xF3 \u0111\u1ED5i chi\u1EC1u tr\u01B0\u1EDBc khi h\u1ECDa t\u1EDBi." }, "item.vo_tuong_chan_kinh": { "name": "V\xF4 T\u01B0\u1EDBng Ch\xE2n Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh kh\xF4ng c\xF3 h\xECnh, kh\xF4ng c\xF3 h\u1EC7, ng\u01B0\u1EDDi luy\u1EC7n qu\xEAn d\u1EA7n m\xECnh l\xE0 ai n\xEAn t\xE2m ma c\u0169ng ch\u1EB3ng bi\u1EBFt b\xE1m v\xE0o \u0111\xE2u." }, "item.ly_hoa_chan_luc": { "name": "Ly H\u1ECFa Ch\xE2n L\u1EE5c", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "L\u1EE5c ch\xE9p c\xE1ch gi\u1EEF m\u1ED9t ng\u1ECDn l\u1EEDa s\xE1ng trong t\xE2m, ngo\xE0i th\xEC \u0111\u1ED1t th\xE0nh t\u1EA7ng h\u1ECFa kh\xED b\u1ECDc th\xE2n, trong th\xEC soi r\xF5 th\u1EA7n th\u1EE9c." }, "item.huyen_nham_chan_kinh": { "name": "Huy\u1EC1n Nham Ch\xE2n Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Kh\u1EAFc tr\xEAn v\xE1ch \u0111\xE1 \u0111en d\u01B0\u1EDBi \u0111\xE1y m\u1ECF s\xE2u ngh\xECn tr\u01B0\u1EE3ng; ng\u01B0\u1EDDi luy\u1EC7n ng\u1ED3i l\xE2u th\xEC m\xE1u \u0111\u1EB7c nh\u01B0 nham th\u1EA1ch, l\xF2ng n\u1EB7ng nh\u01B0 n\xFAi." }, "item.nhuoc_thuy_huyen_kinh": { "name": "Nh\u01B0\u1EE3c Th\u1EE7y Huy\u1EC1n Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Nh\u01B0\u1EE3c th\u1EE7y l\xF4ng h\u1ED3ng kh\xF4ng n\u1ED5i, luy\u1EC7n theo th\xEC linh l\u1EF1c ch\xECm xu\u1ED1ng \u0111\xE1y \u0111an \u0111i\u1EC1n, t\u1EA1p ni\u1EC7m r\u01A1i v\xE0o c\u0169ng kh\xF4ng tr\u1ED3i l\xEAn \u0111\u01B0\u1EE3c." }, "item.chuc_dung_hoa_dien": { "name": "Ch\xFAc Dung H\u1ECFa \u0110i\u1EC3n", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110i\u1EC3n t\xEDch t\u01B0\u01A1ng truy\u1EC1n nh\u1EB7t trong tro m\u1ED9t ng\xF4i mi\u1EBFu H\u1ECFa th\u1EA7n \u1EDF Vi\xEAm, luy\u1EC7n t\u1EDBi \u0111\xE2u m\xE1u n\xF3ng nh\u01B0 than h\u1ED3ng t\u1EDBi \u0111\xF3." }, "item.khon_nguyen_than_kinh": { "name": "Kh\xF4n Nguy\xEAn Th\u1EA7n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EA7n kinh m\u01B0\u1EE3n h\u1EADu \u0111\u1EE9c c\u1EE7a \u0111\u1EA5t m\xE0 ch\u1EDF th\xE2n, ng\u01B0\u1EDDi luy\u1EC7n th\xE0nh \u0111\u1EE9ng \u0111\xE2u th\xEC m\u1EB7t \u0111\u1EA5t d\u01B0\u1EDBi ch\xE2n nh\u01B0 m\u1ED9t t\u1EA5m khi\xEAn." }, "item.tu_tieu_loi_dien": { "name": "T\u1EED Ti\xEAu L\xF4i \u0110i\u1EC3n", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "S\xE9t t\xEDm tr\xEAn t\u1EA7ng tr\u1EDDi cao nh\u1EA5t ch\u1EC9 \u0111\xE1nh k\u1EBB s\u1EAFp ph\xE1 c\u1EA3nh, \u0111i\u1EC3n n\xE0y d\u1EA1y c\xE1ch nu\u1ED1t l\u1EA5y n\xF3 thay v\xEC n\xE9." }, "item.con_bang_chan_quyet": { "name": "C\xF4n B\u1EB1ng Ch\xE2n Quy\u1EBFt", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xE9p theo h\u01A1i th\u1EDF c\u1EE7a C\xF4n B\u1EB1ng m\u1ED9t l\u1EA7n v\u1ED7 c\xE1nh ch\xEDn v\u1EA1n d\u1EB7m, ng\u01B0\u1EDDi luy\u1EC7n th\xE0nh nhanh t\u1EDBi m\u1EE9c t\xE2m ma \u0111u\u1ED5i kh\xF4ng k\u1ECBp." }, "item.thai_am_han_kinh": { "name": "Th\xE1i \xC2m H\xE0n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n d\u01B0\u1EDBi tr\u0103ng \u0111\xEAm \u0111\xF4ng tr\xEAn b\u0103ng nguy\xEAn B\u1EAFc Minh, h\xE0n kh\xED \u0111\xF4ng c\u1EA3 t\u1EA1p ni\u1EC7m, th\u1EA7n th\u1EE9c trong nh\u01B0 m\u1EB7t h\u1ED3 \u0111\xF3ng b\u0103ng." }, "item.kien_moc_thien_kinh": { "name": "Ki\u1EBFn M\u1ED9c Thi\xEAn Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ki\u1EBFn M\u1ED9c l\xE0 c\xE2y n\u1ED1i \u0111\u1EA5t v\u1EDBi tr\u1EDDi th\u1EDDi th\u01B0\u1EE3ng c\u1ED5; kinh n\xE0y h\u1ECDc n\xF3 \u0111\xE2m r\u1EC5 xu\u1ED1ng s\xE2u \u0111\u1EC3 v\u01B0\u01A1n ng\u1ECDn l\xEAn cao." }, "item.khai_bi_quyen": { "name": "Khai Bi Quy\u1EC1n", "quality": 2, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy\u1EC1n th\xF4 c\u1EE7a th\u1EE3 \u0111\xE1, luy\u1EC7n b\u1EB1ng c\xE1ch \u0111\u1EA5m v\xE0o bia \u0111\xE1 m\u1ED7i s\xE1ng. \u0110\u1EA5m n\u1EE9t \u0111\u01B0\u1EE3c m\u1ED9t t\u1EA5m bia th\xEC m\u1EDBi t\xEDnh l\xE0 nh\u1EADp m\xF4n." }, "item.phuc_ho_quyen": { "name": "Ph\u1EE5c H\u1ED5 Quy\u1EC1n", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy\u1EC1n ph\xE1p v\xF5 t\u0103ng Kim \u0110\u1EA1o T\u1EF1 d\u1EA1y \u0111\u1EC7 t\u1EED m\u1EDBi xu\u1ED1ng t\xF3c. T\u01B0\u01A1ng truy\u1EC1n v\u1ECB s\u01B0 t\u1ED5 s\xE1ng l\u1EADp t\u1EEBng \u0111\u1EA5m ch\u1EBFt m\u1ED9t con h\u1ED5 \u0111\xF3i \u1EDF c\u1ED5ng ch\xF9a." }, "item.cam_long_thu": { "name": "C\u1EA7m Long Th\u1EE7", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "C\u1EA7m n\xE3 th\u1EE7 c\u1EE7a tu\u1EA7n binh B\u1EAFc Minh, n\u0103m ng\xF3n tay kh\xF3a l\u1EA5y c\u1ED5 tay \u0111\u1ECBch nh\u01B0 g\u1ECDng k\xECm s\u1EAFt. B\u1ECB kh\xF3a r\u1ED3i, mu\u1ED1n b\u1EA5m quy\u1EBFt c\u0169ng kh\xF4ng \u0111\u01B0\u1EE3c." }, "item.dong_bi_thiet_cot": { "name": "\u0110\u1ED3ng B\xEC Thi\u1EBFt C\u1ED1t", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "V\u1EADn kh\xED huy\u1EBFt d\u1ED3n ra ngo\xE0i da, da s\u1EA1m nh\u01B0 \u0111\u1ED3ng, x\u01B0\u01A1ng c\u1EE9ng nh\u01B0 s\u1EAFt. \u0110ao ch\xE9m v\xE0o ch\u1EC9 \u0111\u1EC3 l\u1EA1i m\u1ED9t v\u1EC7t tr\u1EAFng." }, "item.tran_nhac_quyen": { "name": "Tr\u1EA5n Nh\u1EA1c Quy\u1EC1n", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy\u1EC1n ph\xE1p ch\xE2n truy\u1EC1n Huy\u1EC1n V\u0169 M\xF4n. M\u1ED7i quy\u1EC1n \u0111\xE1nh ra, kh\xED huy\u1EBFt c\xF2n \u0111\u1ECDng l\u1EA1i trong c\xE1nh tay, quy\u1EC1n sau n\u1EB7ng h\u01A1n quy\u1EC1n tr\u01B0\u1EDBc." }, "item.long_tuong_ba_the": { "name": "Long T\u01B0\u1EE3ng B\xE1 Th\u1EC3", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Luy\u1EC7n \u0111\u1EE7 s\u1EE9c m\u01B0\u1EDDi r\u1ED3ng m\u01B0\u1EDDi voi th\xEC th\xE2n nh\u01B0 t\u01B0\u1EDDng th\xE0nh. Ng\u01B0\u1EDDi luy\u1EC7n \u0111\u1EE9ng y\xEAn gi\u1EEFa tr\u1EADn, m\u1EB7c cho ph\xE1p thu\u1EADt d\u1ED9i v\xE0o." }, "item.toai_nhac_quyen": { "name": "To\xE1i Nh\u1EA1c Quy\u1EC1n", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy\u1EC1n ph\u1ED5 kh\u1EAFc tr\xEAn v\xE1ch m\u1ED9t ng\u1ECDn n\xFAi \u0111\xE3 b\u1ECB \u0111\u1EA5m s\u1EADp n\u1EEDa. Th\u1EC3 tu Nguy\xEAn Anh luy\u1EC7n t\u1EDBi ch\u1ED7 cao, m\u1ED9t quy\u1EC1n l\xE0m v\u1EE1 \u0111\u01B0\u1EE3c c\u1EA3 \u0111\u1EC9nh n\xFAi." }, "item.thai_son_ap_dinh": { "name": "Th\xE1i S\u01A1n \xC1p \u0110\u1EC9nh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Nh\u1EA3y l\xEAn r\u1ED3i r\u01A1i xu\u1ED1ng v\u1EDBi c\u1EA3 s\u1EE9c n\u1EB7ng kh\xED huy\u1EBFt d\u1ED3n v\xE0o hai vai. K\u1EBB b\u1ECB \u0111\xE8 tr\xFAng nh\u01B0 c\xF3 ng\u1ECDn n\xFAi \xFAp l\xEAn l\u01B0ng, kh\xF4ng nh\u1EA5c n\u1ED5i tay." }, "item.khai_thien_quyen": { "name": "Khai Thi\xEAn Quy\u1EC1n", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Quy\u1EC1n c\u1EE7a th\u1EC3 tu Trung Ch\xE2u tr\u01B0\u1EDBc ng\xE0y ch\xECm, ch\u1EC9 c\xF3 m\u1ED9t th\u1EE9c. Truy\u1EC1n r\u1EB1ng ng\u01B0\u1EDDi s\xE1ng quy\u1EC1n t\u1EEBng \u0111\u1EA5m th\u1EE7ng m\xE2y ki\u1EBFp, t\u1EF1 m\xECnh \u0111\xE1nh tan thi\xEAn l\xF4i." }, "item.bat_diet_kim_than": { "name": "B\u1EA5t Di\u1EC7t Kim Th\xE2n", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\xE1p m\xF4n t\u1ED1i th\u01B0\u1EE3ng c\u1EE7a Kim \u0110\u1EA1o T\u1EF1, c\u1EA3 ch\xF9a tr\u0103m n\u0103m m\u1EDBi c\xF3 m\u1ED9t ng\u01B0\u1EDDi luy\u1EC7n th\xE0nh. Th\xE2n ph\xE1t kim quang, \u0111ao ki\u1EBFm ph\xE1p b\u1EA3o ch\xE9m v\xE0o nh\u01B0 ch\xE9m t\u01B0\u1EE3ng \u0111\u1ED3ng." }, "item.huyen_quy_doan_the": { "name": "Huy\u1EC1n Quy \u0110o\xE1n Th\u1EC3", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Tr\u01B0\u1EDFng l\xE3o Huy\u1EC1n V\u0169 M\xF4n ng\xE2m m\xECnh d\u01B0\u1EDBi b\u0103ng bi\u1EC3n B\u1EAFc Minh, h\u1ECDc r\xF9a th\u1EDF m\u1ED7i ng\xE0y m\u1ED9t h\u01A1i. Luy\u1EC7n l\xE2u, da d\xE0y nh\u01B0 mai, m\xE1u ch\u1EA3y ch\u1EADm m\xE0 n\u1EB7ng." }, "item.kim_cuong_luyen_than": { "name": "Kim C\u01B0\u01A1ng Luy\u1EC7n Th\xE2n", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "V\xF5 t\u0103ng Kim \u0110\u1EA1o T\u1EF1 t\u1EE5ng kinh trong l\xFAc ch\u1ECBu g\u1EADy, m\u1ED7i ti\u1EBFng g\u1EADy l\xE0 m\u1ED9t c\xE2u kinh. Th\xE2n luy\u1EC7n t\u1EDBi \u0111\xE2u, t\xE2m t\u0129nh t\u1EDBi \u0111\xF3." }, "item.huyen_vu_chan_kinh": { "name": "Huy\u1EC1n V\u0169 Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ch\xE2n kinh Huy\u1EC1n V\u0169 L\xE3o T\u1ED5 ch\xE9p l\u1EA1i sau ba ngh\xECn n\u0103m luy\u1EC7n th\xE2n, ch\u1EC9 truy\u1EC1n ng\u01B0\u1EDDi k\u1EBF v\u1ECB. Luy\u1EC7n th\xE0nh th\xEC th\xE2n nh\u01B0 r\xF9a \u0111\u1ED9i n\xFAi, r\u1EAFn qu\u1EA5n bi\u1EC3n." }, "item.thai_co_luyen_than": { "name": "Th\xE1i C\u1ED5 Luy\u1EC7n Th\xE2n", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\xE1p luy\u1EC7n th\xE2n c\u1EE7a ng\u01B0\u1EDDi th\u1EDDi Th\xE1i C\u1ED5, khi tu s\u0129 ch\u01B0a bi\u1EBFt d\xF9ng ph\xE1p kh\xED m\xE0 ch\u1EC9 c\xF3 hai n\u1EAFm tay. M\xE1u luy\u1EC7n t\u1EDBi m\u1EE9c nh\u1ECF m\u1ED9t gi\u1ECDt xu\u1ED1ng \u0111\xE1, \u0111\xE1 c\u0169ng l\xF5m." }, "item.toa_vong_tam_kinh": { "name": "T\u1ECDa Vong T\xE2m Kinh", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "\u0110\u1EA1o s\u0129 ng\u1ED3i qu\xEAn th\xE2n, qu\xEAn t\xEAn, qu\xEAn c\u1EA3 m\xECnh \u0111ang ng\u1ED3i. Kh\xF4ng gi\u1EEF h\u1EC7 n\xE0o n\xEAn h\u1EC7 n\xE0o c\u0169ng ch\u1EA3y qua \u0111\u01B0\u1EE3c, t\u1EC9nh d\u1EADy th\u1EA5y \u0111\u1EA1o l\xFD c\u0169 s\xE1ng ra m\u1ED9t t\u1EA7ng." }, "item.tai_than_tu_van_kinh": { "name": "T\xE0i Th\u1EA7n T\u1EE5 V\u1EADn Kinh", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "T\xE2m ph\xE1p th\u01B0\u01A1ng h\u1ED9i Th\u1ECBnh Qu\u1ED1c truy\u1EC1n cho ng\u01B0\u1EDDi c\u1EA7m s\u1ED5, th\u1EDD \u1EDF \u0111\u1EA7u kinh l\xE0 t\u01B0\u1EE3ng T\xE0i th\u1EA7n. Linh kh\xED nh\u01B0 ti\u1EC1n, v\xE0o c\u1EEDa n\xE0o c\u0169ng nh\u1EADn, ng\u01B0\u1EDDi luy\u1EC7n \u0111i \u0111\xE2u c\u0169ng g\u1EB7p m\u1ED1i l\u1EE3i." }, "item.thai_hu_duong_than_kinh": { "name": "Th\xE1i H\u01B0 D\u01B0\u1EE1ng Th\u1EA7n Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Kinh d\u01B0\u1EE1ng th\u1EA7n c\u1EE7a \u0110\u1EA1i Ung, t\u01B0\u01A1ng truy\u1EC1n r\xFAt t\u1EEB l\u1EDDi gi\u1EA3ng c\u1EE7a m\u1ED9t trong Ng\u0169 T\u1ED5. Coi th\u1EE9c h\u1EA3i nh\u01B0 kho\u1EA3ng tr\u1EDDi tr\u1ED1ng, m\xE2y t\xE0 ni\u1EC7m bay qua kh\xF4ng \u0111\u1ECDng l\u1EA1i." }, "item.hon_nguyen_luyen_the_kinh": { "name": "H\u1ED7n Nguy\xEAn Luy\u1EC7n Th\u1EC3 Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Th\u1EC3 tu kh\xF4ng ch\u1ECDn h\u1EC7, l\u1EA5y kh\xED tr\u1EDDi \u0111\u1EA5t ch\u01B0a ph\xE2n m\xE0 luy\u1EC7n th\xE2n. Th\xE2n th\u1EC3 nh\u01B0 ph\xF4i ch\u01B0a \u0111\xFAc, \u0111\xE1nh ch\u1ED7 n\xE0o c\u0169ng d\xE0y ch\u1ED7 \u0111\xF3, m\xE1u \u0111\u1EB7c m\xE0 x\u01B0\u01A1ng d\u1EBBo." }, "item.thanh_vu_tra": { "name": "Thanh V\u1EE5 Linh Tr\xE0", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "B\xFAp ch\xE8 h\xE1i l\xFAc s\u01B0\u01A1ng m\xF9 ch\u01B0a tan tr\xEAn \u0111\u1ED3i cao, pha ra n\u01B0\u1EDBc xanh nh\u01B0 ng\u1ECDc. M\u1ED9t \u1EA5m l\xE0m l\xF2ng l\u1EB7ng xu\u1ED1ng, t\u1EA1p ni\u1EC7m tan b\u1EDBt." }, "item.van_vu_co_tra": { "name": "V\xE2n V\u1EE5 C\u1ED5 Tr\xE0", "quality": 3, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "L\xE1 c\u1EE7a g\u1ED1c ch\xE8 tr\u0103m tu\u1ED5i m\u1ECDc gi\u1EEFa m\xE2y. U\u1ED1ng v\xE0o linh \u0111\xE0i trong su\u1ED1t, t\xE2m ma lui h\u1EB3n, tu vi c\u0169ng nh\xEDch l\xEAn \u0111\xF4i ch\xFAt." }, "item.bach_hoa_tuu": { "name": "B\xE1ch Hoa Linh T\u1EEDu", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "R\u01B0\u1EE3u \u1EE7 t\u1EEB tr\u0103m th\u1EE9 hoa d\u1EA1i c\xF3 linh kh\xED, ng\u1ECDt m\xE0 say l\xE2u. U\u1ED1ng gi\u1EEFa tr\u1EADn, linh l\u1EF1c trong ng\u01B0\u1EDDi b\u1ED1c l\xEAn nh\u01B0 l\u1EEDa g\u1EB7p gi\xF3." }, "item.tram_nien_tran_nhuong": { "name": "Tr\u0103m N\u0103m Tr\u1EA7n Nh\u01B0\u1EE1ng", "quality": 3, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "R\u01B0\u1EE3u ch\xF4n d\u01B0\u1EDBi \u0111\u1EA5t tr\u0103m n\u0103m, \u0111\u1EB7c s\xE1nh nh\u01B0 m\u1EADt, linh kh\xED trong chum \u0111\xE3 ng\u01B0ng th\xE0nh t\u01A1. M\u1ED9t ch\xE9n \u1EA5m t\u1EEB \u0111an \u0111i\u1EC1n ra t\u1EDBi \u0111\u1EA7u ng\xF3n tay, ph\u1EA3i ng\u1ED3i luy\u1EC7n h\xF3a n\u1EEDa n\u0103m m\u1EDBi tan h\u1EBFt." }, "item.thanh_van_kiem_phoi": { "name": "Thanh V\xE2n Ki\u1EBFm Ph\xF4i", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "Ph\xF4i ki\u1EBFm ra l\xF2 d\u01B0\u1EDBi ch\xE2n Thanh V\xE2n, ch\u01B0a m\xE0i, ch\u01B0a khai phong, g\xF5 v\xE0o ng\xE2n nh\u01B0 chu\xF4ng. Th\xE9p Ung t\xF4i \u0111\xFAng ph\xE9p, n\u01B0\u1EDBc kh\xE1c tr\u1EA3 gi\xE1 g\u1EA5p \u0111\xF4i." }, "item.tung_yen_mac": { "name": "T\xF9ng Y\xEAn M\u1EB7c", "quality": 1, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "M\u1EF1c th\u1ECFi luy\u1EC7n t\u1EEB kh\xF3i th\xF4ng tr\u0103m n\u0103m, v\u0103n nh\xE2n \u0110\u1EA1i Ung m\xE0i \u0111\u1EC3 vi\u1EBFt s\u1EDB d\xE2ng T\u1ED5 mi\u1EBFu. Ph\xF9 s\u01B0 n\u01B0\u1EDBc kh\xE1c tranh nhau mua v\u1EC1 v\u1EBD b\xF9a." }, "item.ngu_to_te_dinh": { "name": "Ng\u0169 T\u1ED5 T\u1EBF \u0110\u1EC9nh", "quality": 3, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "\u0110\u1EC9nh \u0111\u1ED3ng ba ch\xE2n \u0111\xFAc theo ph\xE9p t\u1EBF Ng\u0169 T\u1ED5, \u0111\xE1y c\xF3 tri\u1EC7n L\u1EC5 b\u1ED9. \u1EDE Ung nh\xE0 n\xE0o c\u0169ng c\xF3, sang n\u01B0\u1EDBc kh\xE1c th\u1EBF gia mua b\xE0y ch\xEDnh s\u1EA3nh cho ra d\xE1ng ch\xEDnh th\u1ED1ng." }, "item.giao_tieu_sa": { "name": "Giao Ti\xEAu Sa", "quality": 3, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "L\u1EE5a m\u1ECFng nh\u01B0 kh\xF3i, nh\xFAng n\u01B0\u1EDBc nh\u1EA5c l\xEAn v\u1EABn kh\xF4. C\u1EA3ng th\u1ECB Th\u1ECBnh n\xF3i l\xE0 do giao nh\xE2n d\u1EC7t d\u01B0\u1EDBi \u0111\xE1y bi\u1EC3n, gi\xE1 ghi tr\xEAn kh\u1EBF \u01B0\u1EDBc ch\u1EE9 kh\xF4ng ghi tr\xEAn s\u1EA1p." }, "item.van_bao_tieu_hoan": { "name": "V\u1EA1n B\u1EA3o Ti\u1EC3u Ho\xE0n", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": '\u0110an c\u1EE7a l\xF2 l\u1EDBn V\u1EA1n B\u1EA3o Th\u01B0\u01A1ng H\u1ED9i, m\u1ED7i m\u1EBB c\u1EA3 v\u1EA1n vi\xEAn, v\u1ECF in ch\u1EEF "B\u1EA3o". \u1EDE Th\u1ECBnh r\u1EBB nh\u01B0 k\u1EB9o; nu\u1ED1t gi\u1EEFa tr\u1EADn, linh l\u1EF1c d\xE2ng l\xEAn m\u1ED9t \u0111\u1EE3t.' }, "item.thiet_thuoc_bi": { "name": "Thi\u1EBFt Thu\u1ED9c B\xEC", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "Da y\xEAu th\xFA thu\u1ED9c b\u1EB1ng v\u1ECF s\u1ED3i v\xE0 mu\u1ED1i m\xE1u theo ph\xE9p qu\xE2n doanh, \u0111ao th\u01B0\u1EDDng ch\xE9m kh\xF4ng r\xE1ch. L\u01B0\u01A1ng th\u1EEBa da, n\u01A1i kh\xE1c mua v\u1EC1 \u0111\xF3ng gi\xE1p m\u1EC1m." }, "item.thiet_huyet_tan": { "name": "Thi\u1EBFt Huy\u1EBFt T\xE1n", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "Thu\u1ED1c b\u1ED9t qu\xE2n y g\xF3i gi\u1EA5y d\u1EA7u, l\xEDnh \u1EA3i n\xE0o c\u0169ng gi\u1EAFt m\u1ED9t g\xF3i. R\u1EAFc l\xEAn v\u1EBFt th\u01B0\u01A1ng x\xF3t nh\u01B0 l\u1EEDa, m\xE1u c\u1EA7m ngay." }, "item.liet_duong_dang_du": { "name": "Li\u1EC7t D\u01B0\u01A1ng \u0110\u0103ng Du", "quality": 1, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "D\u1EA7u th\u1EAFp \u0111\xE8n \u0111\u1ECF \u1EDF ng\u01B0\u1EE1ng c\u1EEDa v\xF9ng quan \u1EA3i, ch\xE1y c\u1EA3 \u0111\xEAm kh\xF4ng kh\xF3i, gi\xF3 kh\xF4ng t\u1EAFt. Ng\u01B0\u1EDDi ngo\xE0i mua l\xE0m \u0111\xE8n canh; ng\u01B0\u1EDDi trong ngh\u1EC1 bi\u1EBFt n\xF3 c\xF2n l\xE0 \xE1m hi\u1EC7u." }, "item.bang_tam_ti": { "name": "B\u0103ng T\xE0m Ti", "quality": 3, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "T\u01A1 c\u1EE7a t\u1EB1m \u0103n l\xE1 d\xE2u m\u1ECDc d\u01B0\u1EDBi tuy\u1EBFt, c\u1EA7m l\xE2u bu\u1ED1t t\u1EDBi t\u1EADn x\u01B0\u01A1ng. M\u1ED9t cu\u1ED9n \u0111\u1EE7 d\u1EC7t m\u1ED9t t\u1EA5m ph\xE1p y, ra kh\u1ECFi B\u1EAFc Minh th\xEC ai c\u0169ng mu\u1ED1n." }, "item.bang_nguyen_co_tien": { "name": "B\u0103ng Nguy\xEAn C\u1ED5 Ti\u1EC1n", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "\u0110\u1ED3ng ti\u1EC1n \u0111\xFAc t\u1EEB thu\u1EDF Trung Ch\xE2u ch\u01B0a ch\xECm, ng\u01B0\u1EDDi B\u1EAFc Minh \u0111\xE0o \u0111\u01B0\u1EE3c d\u01B0\u1EDBi b\u0103ng c\u1EA3 r\u1ED5. K\u1EBB ch\u01A1i \u0111\u1ED3 c\u1ED5 ph\u01B0\u01A1ng nam tr\u1EA3 t\u1EEBng \u0111\u1ED3ng m\u1ED9t." }, "item.huyen_giap_cao": { "name": "Huy\u1EC1n Gi\xE1p Cao", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "Cao b\xF4i c\u1EE7a th\u1EC3 tu Huy\u1EC1n V\u0169 M\xF4n t\u1EF1 luy\u1EC7n, \u0111en nh\u01B0 h\u1EAFc \xEDn, m\xF9i tanh c\u1EE7a mai r\xF9a. Xoa l\xEAn da gi\u1EEFa tr\u1EADn, th\u1ECBt c\u1EE9ng l\u1EA1i nh\u01B0 gi\xE1p." }, "item.hoa_diep_dang": { "name": "H\u1ECFa Di\u1EC7p \u0110\u1EB1ng", "quality": 1, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "D\xE2y leo l\xE1 \u0111\u1ECF trong r\u1EEBng n\xF3ng Vi\xEAm, ph\u01A1i kh\xF4 b\xF3 th\xE0nh t\u1EEBng b\xF3. \u0110an s\u01B0 d\xF9ng l\xF3t l\xF2 cho l\u1EEDa \u0111\u1EC1u, \u1EDF Vi\xEAm th\xEC \u0111\u1ED1t thay c\u1EE7i." }, "item.xa_dam_hoan": { "name": "X\xE0 \u0110\u1EA3m Ho\xE0n", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "M\u1EADt r\u1EAFn r\u1EEBng vo v\u1EDBi l\xE1 ng\u1EA3i, \u0111\u1EAFng t\u1EDBi t\u1EADn \xF3c. Ng\u01B0\u1EDDi Vi\xEAm n\xF3i nu\u1ED1t m\u1ED9t vi\xEAn th\xEC t\xE0 ni\u1EC7m c\u0169ng ph\u1EA3i ch\u1ECBu \u0111\u1EAFng m\xE0 lui." }, "item.ky_nam_tram": { "name": "K\u1EF3 Nam Tr\u1EA7m", "quality": 3, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "L\xF5i tr\u1EA7m k\u1EBFt tr\u0103m n\u0103m trong th\xE2n d\xF3 b\u1ECB s\xE9t \u0111\xE1nh, \u0111en b\xF3ng, n\u1EB7ng ch\xECm n\u01B0\u1EDBc. M\u1ED9t m\u1EA9u b\u1EB1ng ng\xF3n tay \u0111\u1ED1t th\u01A1m c\u1EA3 gian nh\xE0 ba ng\xE0y, ch\xF9a l\u1EDBn ph\u01B0\u01A1ng xa mua b\u1EB1ng c\xE2n v\xE0ng." }, "item.linh_ngu": { "name": "Linh Ng\u01B0", "quality": 1, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "C\xE1 v\u1EA3y b\u1EA1c l\u1EDBn l\xEAn \u1EDF ch\u1ED7 n\u01B0\u1EDBc c\xF3 linh kh\xED, m\u1ED5 ra th\u1ECBt trong nh\u01B0 ng\u1ECDc. \u0110an s\u01B0 d\xF9ng l\xE0m d\u1EABn thu\u1ED1c, nh\xE0 gi\xE0u d\xF9ng \u0111\xE3i kh\xE1ch." }, "item.tran_chau": { "name": "Tr\xE2n Ch\xE2u", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "Ng\u1ECDc trai l\u1EB7n s\xE2u m\u1EDBi m\xF2 \u0111\u01B0\u1EE3c, tr\xF2n \u0111\u1EC1u, \xE1nh h\u1ED3ng. \u1EDE l\xE0ng ch\xE0i \u0111\u1ED5i \u0111\u01B0\u1EE3c g\u1EA1o, l\xEAn kinh \u0111\xF4 \u0111\u1ED5i \u0111\u01B0\u1EE3c nh\xE0." }, "item.den_dong_co": { "name": "\u0110\xE8n \u0110\u1ED3ng C\u1ED5", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "Ng\u1ECDn \u0111\xE8n \u0111\u1ED3ng ph\u1EE7 h\xE0, l\u01B0\u1EDBi ch\xE0i k\xE9o l\xEAn t\u1EEB \u0111\xE1y n\u01B0\u1EDBc. Th\xE2n \u0111\xE8n kh\u1EAFc m\u1ED9t d\xF2ng ch\u1EEF tri\u1EC7n kh\xF4ng ai \u0111\u1ECDc n\u1ED5i. K\u1EBB ch\u01A1i \u0111\u1ED3 c\u1ED5 tr\u1EA3 gi\xE1 cao." }, "item.tram_huong": { "name": "Tr\u1EA7m h\u01B0\u01A1ng mi\u1EBFu", "quality": 1, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "B\xF3 tr\u1EA7m \xF4ng t\u1EEB b\xF3 b\u1EB1ng l\u1EA1t tre, kh\xF3i \u0111i th\u1EB3ng nh\u01B0 s\u1EE3i ch\u1EC9. \u0110\u1ED1t l\xEAn ng\u1ED3i t\u0129nh m\u1ED9t l\xFAc, t\u1EA1p ni\u1EC7m l\u1EAFng xu\u1ED1ng." }, "item.lo_dan": { "name": "L\u1ED9 d\u1EABn", "quality": 1, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "Gi\u1EA5y th\xF4ng h\xE0nh c\u1EE7a tr\u1EA1m d\u1ECBch, c\xF3 tri\u1EC7n \u0111\u1ECF c\u1EE7a quan ph\u1EE7. Qua \u0111\u1ED3n bi\xEAn gi\u01A1 ra th\xEC l\xEDnh \u0111\u1EE1 h\u1ECFi han." }, "item.co_thu_tan_quyen": { "name": "T\xE0n quy\u1EC3n c\u1ED5 th\u01B0", "quality": 2, "cat": "\u0110\u1EB7c S\u1EA3n", "desc": "M\u1EA5y ch\u1EE5c trang s\xE1ch c\u0169 m\u1ED1i g\u1EB7m, ch\xE9p l\u1EDDi b\xE0n v\u1EC1 kh\xED m\u1EA1ch c\u1EE7a m\u1ED9t ng\u01B0\u1EDDi \u0111\u1ECDc s\xE1ch \u0111\u1EDDi tr\u01B0\u1EDBc. Ng\u1ED3i \u0111\u1ECDc k\u1EF9 c\u0169ng ng\u1ED9 ra \u0111\xF4i \u0111i\u1EC1u." }, "item.truc_co_dan": { "name": "Tr\xFAc C\u01A1 \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an d\u01B0\u1EE3c gi\xFAp tu s\u0129 Luy\u1EC7n Kh\xED vi\xEAn m\xE3n ng\u01B0ng t\u1EE5 \u0111\u1EA1o c\u01A1. T\u0103ng 15% t\u1EC9 l\u1EC7 \u0111\u1ED9t ph\xE1 Tr\xFAc C\u01A1." }, "item.ket_kim_dan": { "name": "K\u1EBFt Kim \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Gi\xFAp tu s\u0129 Tr\xFAc C\u01A1 vi\xEAn m\xE3n n\xE9n ch\xE2n nguy\xEAn th\xE0nh kim \u0111an. T\u0103ng 12% t\u1EC9 l\u1EC7 \u0111\u1ED9t ph\xE1 K\u1EBFt \u0110an." }, "item.duong_anh_dan": { "name": "D\u01B0\u1EE1ng Anh \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\xD4n d\u01B0\u1EE1ng kim \u0111an l\xFAc ph\xE1 v\u1ECF th\xE0nh anh, gi\u1EEF th\u1EA7n tr\xED kh\u1ECFi b\u1ECB t\xE2m ma cu\u1ED1n \u0111i. T\u0103ng 9% t\u1EC9 l\u1EC7 \u0111\u1ED9t ph\xE1 Nguy\xEAn Anh." }, "item.ngo_dao_tra": { "name": "Ng\u1ED9 \u0110\u1EA1o Tr\xE0", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "L\xE1 tr\xE0 m\u1ECDc d\u01B0\u1EDBi g\u1ED1c c\xE2y ng\u1ED9 \u0111\u1EA1o, m\u1ED9t ch\xE9n nh\xECn r\xF5 b\xECnh c\u1EA3nh. T\u0103ng 4% t\u1EC9 l\u1EC7 \u0111\u1ED9t ph\xE1 H\xF3a Th\u1EA7n." }, "item.thanh_tam_dan": { "name": "Thanh T\xE2m \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an t\u0129nh t\xE2m d\xF9ng l\xFAc xung k\xEDch b\xECnh c\u1EA3nh. T\u0103ng 3% t\u1EC9 l\u1EC7 \u0111\u1ED9t ph\xE1, t\xE2m ma kh\xF3 hi\u1EC7n h\xECnh h\u01A1n." }, "item.thien_nguyen_qua": { "name": "Thi\xEAn Nguy\xEAn Qu\u1EA3", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Linh qu\u1EA3 tr\u0103m n\u0103m m\u1EDBi ch\xEDn, \u0103n v\xE0o l\xFAc \u0111\u1ED9t ph\xE1 th\xEC c\u0103n c\u01A1 c\u1EA3nh gi\u1EDBi m\u1EDBi v\u1EEFng h\u01A1n m\u1ED9t b\u1EADc." }, "item.pha_chuong_dan": { "name": "Ph\xE1 Ch\u01B0\u1EDBng \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an x\xE1m c\xF3 v\xE2n nh\u01B0 v\u1EBFt n\u1EE9t. Tu s\u0129 Tr\xFAc C\u01A1 tu vi \u0111\xE3 \u0111\u1EA7y m\xE0 kh\xF4ng l\xEAn n\u1ED5i, nu\u1ED1t v\xE0o th\xEC v\xE1ch ch\xE2n kh\xED v\u1EE1 ra, b\u01B0\u1EDBc sang ti\u1EC3u c\u1EA3nh gi\u1EDBi k\u1EBF." }, "item.toai_bich_dan": { "name": "To\xE1i B\xEDch \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an n\xE2u n\u1EB7ng tay, l\u1EAFc nghe ti\u1EBFng \u0111\xE1 v\u1EE5n b\xEAn trong. Kim \u0111an ch\u1EA1m b\xECnh c\u1EA3nh u\u1ED1ng v\xE0o, v\xE1ch ch\u01B0\u1EDBng v\u1EE1 v\u1EE5n nh\u01B0 t\u01B0\u1EDDng \u0111\u1EA5t g\u1EB7p l\u0169." }, "item.thong_huyen_dan": { "name": "Th\xF4ng Huy\u1EC1n \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an t\xEDm s\u1EABm, soi l\xEAn th\u1EA5y m\u1ED9t s\u1EE3i ch\u1EC9 s\xE1ng xuy\xEAn qua l\xF5i. Nguy\xEAn anh ch\u1EA1m b\xECnh c\u1EA3nh theo s\u1EE3i ch\u1EC9 \u1EA5y m\xE0 \u0111i, c\u1EEDa \u1EA3i trong th\xE2n t\u1EF1 m\u1EDF." }, "item.pha_hu_dan": { "name": "Ph\xE1 H\u01B0 \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an trong nh\u01B0 gi\u1ECDt s\u01B0\u01A1ng, \u0111\u1EB7t tr\xEAn tay kh\xF4ng th\u1EA5y n\u1EB7ng. Nguy\xEAn th\u1EA7n H\xF3a Th\u1EA7n ch\u1EA1m b\xECnh c\u1EA3nh nu\u1ED1t v\xE0o, t\u1EA7ng h\u01B0 kh\xF4ng tr\u01B0\u1EDBc m\u1EAFt r\xE1ch ra m\u1ED9t \u0111\u01B0\u1EDDng." }, "item.on_co_dan": { "name": "\xD4n C\u01A1 \u0110an", "quality": 2, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an xanh nh\u1EA1t, \u1EA5m nh\u01B0 h\xF2n \u0111\xE1 ph\u01A1i n\u1EAFng. K\u1EBB xung Tr\xFAc C\u01A1 th\u1EA5t b\u1EA1i u\u1ED1ng v\xE0o, v\u1EBFt r\u1EA1n tr\xEAn \u0111\u1EA1o c\u01A1 \u0111\u01B0\u1EE3c d\u01B0\u1EE3c l\u1EF1c l\u1EA5p d\u1EA7n m\xE0 li\u1EC1n." }, "item.bo_khuyet_dan": { "name": "B\u1ED5 Khuy\u1EBFt \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an v\xE0ng \u0111\u1EE5c, m\u1EB7t c\xF3 v\xE2n nh\u01B0 \u0111\u1EA5t ru\u1ED9ng kh\xF4 g\u1EB7p m\u01B0a. Chuy\xEAn v\xE1 ch\u1ED7 \u0111\u1EA1o c\u01A1 n\u1EE9t v\u1EE1 khi k\u1EBFt \u0111an th\u1EA5t b\u1EA1i." }, "item.hoan_nguyen_dan": { "name": "Ho\xE0n Nguy\xEAn \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an m\xE0u h\u1ED5 ph\xE1ch, trong l\xF5i c\xF3 m\u1ED9t \u0111\u1ED1m s\xE1ng ch\u1EADm r\xE3i xoay. Kim \u0111an t\u1EEBng ph\xE1 anh kh\xF4ng th\xE0nh, nu\u1ED1t v\xE0o th\xEC v\u1EBFt ch\u1EA5n t\u1ED5n tr\xEAn \u0111\u1EA1o c\u01A1 kh\xE9p l\u1EA1i nh\u01B0 c\u0169." }, "item.bo_thien_dan": { "name": "B\u1ED5 Thi\xEAn \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an n\u0103m m\xE0u, c\u1EA7m l\xE2u th\u1EA5y l\xF2ng b\xE0n tay nh\u01B0 c\xF3 m\u1EA1ch \u0111\u1EADp. Nguy\xEAn anh h\xF3a th\u1EA7n th\u1EA5t b\u1EA1i, \u0111\u1EA1o c\u01A1 th\u1EE7ng m\u1ED9t l\u1ED7, ch\u1EC9 \u0111an n\xE0y v\xE1 \u0111\u01B0\u1EE3c." }, "item.co_co_dan": { "name": "C\u1ED1 C\u01A1 \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an v\xE0ng \u0111\u1EE5c, ng\u1EADm ba n\u0103m m\u1EDBi tan h\u1EBFt. \u0110\u1EA1o c\u01A1 Tr\xFAc C\u01A1 \u0111\xE3 l\u1EADp m\xE0 c\xF2n r\u1ED7, nh\u1EDD n\xF3 l\u1EA5p d\u1EA7n t\u1EEBng v\u1EBFt, ph\u1EA9m ch\u1EA5t l\xEAn m\u1ED9t b\u1EADc. M\u1ED7i c\u1EA3nh gi\u1EDBi ch\u1EC9 \xF4n d\u01B0\u1EE1ng m\u1ED9t l\u1EA7n, kh\xF4ng l\xEAn \u0111\u01B0\u1EE3c Ho\xE0n M\u1EF9." }, "item.uan_dan_lo": { "name": "U\u1EA9n \u0110an L\u1ED9", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "S\u01B0\u01A1ng \u0111\u1ECDng tr\xEAn l\xE1 kim linh tr\u0103m n\u0103m, m\u1ED7i ng\xE0y nh\u1ECF m\u1ED9t gi\u1ECDt l\xEAn \u0111an \u0111i\u1EC1n. T\xE1m n\u0103m t\u01B0\u1EDBi t\u1EAFm, kim \u0111an s\xE1ng th\xEAm m\u1ED9t t\u1EA7ng, ph\u1EA9m ch\u1EA5t l\xEAn m\u1ED9t b\u1EADc. M\u1ED7i c\u1EA3nh gi\u1EDBi ch\u1EC9 \xF4n d\u01B0\u1EE1ng m\u1ED9t l\u1EA7n, kh\xF4ng l\xEAn \u0111\u01B0\u1EE3c Ho\xE0n M\u1EF9." }, "item.uan_anh_lien": { "name": "U\u1EA9n Anh Li\xEAn", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Sen t\xEDm ch\xEDn c\xE1nh, c\xE1nh n\xE0o c\u0169ng t\u1ECFa h\u01A1i m\xE1t. Nguy\xEAn anh ng\u1ED3i tr\xEAn \u0111\xE0i sen hai m\u01B0\u01A1i n\u0103m, th\xE2n h\xECnh \u0111\u1EA7y \u0111\u1EB7n d\u1EA7n, ph\u1EA9m ch\u1EA5t l\xEAn m\u1ED9t b\u1EADc. M\u1ED7i c\u1EA3nh gi\u1EDBi ch\u1EC9 \xF4n d\u01B0\u1EE1ng m\u1ED9t l\u1EA7n, kh\xF4ng l\xEAn \u0111\u01B0\u1EE3c Ho\xE0n M\u1EF9." }, "item.hoi_xuan_dan": { "name": "H\u1ED3i Xu\xE2n \u0110an", "quality": 2, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ch\u1EEFa th\u01B0\u01A1ng nh\u1EB9. Gi\u1EEFa tr\u1EADn h\u1ED3i m\u1ED9t ph\u1EA7n t\u01B0 kh\xED huy\u1EBFt." }, "item.bo_khi_dan": { "name": "B\u1ED5 Kh\xED \u0110an", "quality": 2, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Nu\u1ED1t v\xE0o gi\u1EEFa tr\u1EADn, linh l\u1EF1c trong kinh m\u1EA1ch d\xE2ng l\xEAn nh\u01B0 \u0111\u01B0\u1EE3c th\xEAm hai h\u01A1i th\u1EDF." }, "item.bao_huyet_dan": { "name": "B\u1EA1o Huy\u1EBFt \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110\u1ED1t m\xE1u l\u1EA5y s\u1EE9c. Hai l\u01B0\u1EE3t ra \u0111\xF2n n\u1EB7ng g\u1EA5p r\u01B0\u1EE1i, xong tr\u1EADn th\xEC th\u01B0\u01A1ng th\u1EBF n\u1EB7ng th\xEAm." }, "item.tay_tuy_dan": { "name": "T\u1EA9y T\u1EE7y \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "T\u1EA9y kinh ph\u1EA1t t\u1EE7y, c\u0103n c\u1ED1t t\u0103ng l\xEAn, chuy\u1EC3n m\u1ED9t \u0111o\u1EA1n kinh m\u1EA1ch sang h\u1EC7 c\u1EE7a linh c\u0103n." }, "item.thong_mach_dan": { "name": "Th\xF4ng M\u1EA1ch \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110\u1EA3 th\xF4ng m\u1ED9t \u0111o\u1EA1n kinh m\u1EA1ch b\u1ECB t\u1EAFc (ch\u1ECDn tr\xEAn m\xE0n Kinh m\u1EA1ch)." }, "item.tuc_mach_cao": { "name": "T\u1EE5c M\u1EA1ch Cao", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Cao d\u01B0\u1EE3c n\u1ED1i l\u1EA1i kinh m\u1EA1ch \u0111\u1EE9t g\xE3y. \xD4 t\u1ED5n th\xE0nh \xF4 t\u1EAFc, c\u1EA7n \u0111\u1EA3 th\xF4ng l\u1EA1i." }, "item.kim_sang_duoc": { "name": "Kim Sang D\u01B0\u1EE3c", "quality": 1, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Thu\u1ED1c b\u1ED9t r\u1EAFc v\u1EBFt th\u01B0\u01A1ng c\u1EE7a v\xF5 qu\xE1n. Gi\u1EEFa tr\u1EADn c\u1EA7m m\xE1u \u0111\u01B0\u1EE3c \u0111\xF4i ch\xFAt." }, "item.sinh_co_dan": { "name": "Sinh C\u01A1 \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an d\u01B0\u1EE3c n\u1ED1i g\xE2n li\u1EC1n x\u01B0\u01A1ng. Ch\u1EEFa th\u01B0\u01A1ng n\u1EB7ng; gi\u1EEFa tr\u1EADn h\u1ED3i b\u1ED1n ph\u1EA7n kh\xED huy\u1EBFt." }, "item.tu_linh_dan": { "name": "T\u1EE5 Linh \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Gom linh kh\xED quanh th\xE2n v\u1EC1 \u0111an \u0111i\u1EC1n. Gi\u1EEFa tr\u1EADn linh l\u1EF1c d\xE2ng l\xEAn nh\u01B0 \u0111\u01B0\u1EE3c th\xEAm b\u1ED1n h\u01A1i th\u1EDF." }, "item.hoan_hon_dan": { "name": "Ho\xE0n H\u1ED3n \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "K\xE9o ng\u01B0\u1EDDi t\u1EEB c\u1EEDa t\u1EED v\u1EC1. Tr\u1ECDng th\u01B0\u01A1ng c\u0169ng l\xE0nh h\u1EB3n; gi\u1EEFa tr\u1EADn h\u1ED3i qu\xE1 n\u1EEDa kh\xED huy\u1EBFt." }, "item.ngung_nguyen_dan": { "name": "Ng\u01B0ng Nguy\xEAn \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Linh l\u1EF1c ng\u01B0ng nh\u01B0 th\u1EE7y ng\xE2n trong kinh m\u1EA1ch. Gi\u1EEFa tr\u1EADn th\xEAm s\xE1u h\u01A1i th\u1EDF linh l\u1EF1c." }, "item.duyen_tho_dan": { "name": "Duy\xEAn Th\u1ECD \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "K\xE9o d\xE0i th\u1ECD nguy\xEAn n\u0103m m\u01B0\u01A1i n\u0103m. M\u1ED7i ng\u01B0\u1EDDi ch\u1EC9 n\xEAn d\xF9ng v\xE0i vi\xEAn, c\xE0ng v\u1EC1 sau c\xE0ng nh\u1EA1t." }, "item.cuu_chuyen_kim_dan": { "name": "C\u1EEDu Chuy\u1EC3n Kim \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Luy\u1EC7n ch\xEDn l\u1EA7n m\u1EDBi th\xE0nh, v\xE0o mi\u1EC7ng h\xF3a d\xF2ng kim quang. Th\u01B0\u01A1ng th\u1EBF tan s\u1EA1ch, gi\u1EEFa tr\u1EADn h\u1ED3i s\xE1u ph\u1EA7n kh\xED huy\u1EBFt, th\xEAm t\xE1m m\u01B0\u01A1i n\u0103m th\u1ECD nguy\xEAn." }, "item.nghich_menh_dan": { "name": "Ngh\u1ECBch M\u1EC7nh \u0110an", "quality": 8, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "C\u01B0\u1EDBp ba tr\u0103m n\u0103m th\u1ECD nguy\xEAn t\u1EEB tay tr\u1EDDi, d\u01B0\u1EE3c kh\xE1ng c\u0169ng kh\xF4ng ng\u0103n \u0111\u01B0\u1EE3c. Nh\u01B0ng th\u1EE9 b\u1ECB c\u01B0\u1EDBp kh\xF4ng ch\u1ECBu \u0111\u1EC3 y\xEAn trong l\xF2ng ng\u01B0\u1EDDi d\xF9ng." }, "item.tich_doc_dan": { "name": "T\u1ECBch \u0110\u1ED9c \u0110an", "quality": 2, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "L\u1EA5y m\u1ED9t gi\u1ECDt m\u1EE7 c\xF3c l\xE0m \u0111\u1ED9c d\u1EABn \u0111\u1ED9c ra. Ngo\xE0i tr\u1EADn ch\u1EEFa th\u01B0\u01A1ng nh\u1EB9, gi\u1EEFa tr\u1EADn h\u1ED3i g\u1EA7n m\u1ED9t ph\u1EA7n ba kh\xED huy\u1EBFt." }, "item.trang_dam_dan": { "name": "Tr\xE1ng \u0110\u1EA3m \u0110an", "quality": 2, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an \u0111\u1EAFng nh\u01B0 m\u1EADt g\u1EA5u, nu\u1ED1t v\xE0o gan to b\u1EB1ng tr\u1EDDi. Gi\u1EEFa tr\u1EADn m\u1ED9t l\u01B0\u1EE3t ra \u0111\xF2n n\u1EB7ng g\u1EA5p r\u01B0\u1EE1i, h\u1ED3i ch\xFAt kh\xED huy\u1EBFt, kh\xF4ng h\u1EA1i th\xE2n." }, "item.thanh_vu_dan": { "name": "Thanh V\u1EE5 \u0110an", "quality": 2, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Linh tr\xE0 s\u01B0\u01A1ng m\xF9 c\xF4 l\u1EA1i th\xE0nh vi\xEAn, ng\u1EADm th\u1EA5y m\xE1t c\u1EA3 \u0111\u1EC9nh \u0111\u1EA7u. T\u1EA1p ni\u1EC7m l\u1EAFng xu\u1ED1ng, tu vi nh\xEDch l\xEAn ch\xFAt \xEDt." }, "item.tuy_ha_dan": { "name": "T\xFAy H\xE0 \u0110an", "quality": 2, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "B\xE1ch hoa t\u1EEDu n\u1EA5u c\u1EA1n c\xF2n l\u1EA1i vi\xEAn \u0111\u1ECF nh\u01B0 r\xE1ng chi\u1EC1u, th\u01A1m men. Gi\u1EEFa tr\u1EADn linh l\u1EF1c b\u1ED1c l\xEAn ba h\u01A1i th\u1EDF, m\xE1u c\u0169ng \u1EA5m l\u1EA1i \u0111\xF4i ch\xFAt." }, "item.bach_giai_dan": { "name": "B\xE1ch Gi\u1EA3i \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "M\u1EADt r\u1EAFn h\u1EA1 h\u1ECFa, n\u1ECDc b\u1ECD c\u1EA1p d\u1EABn \u0111\u01B0\u1EDDng, \u0111\u1ED9c g\xEC v\xE0o ng\u01B0\u1EDDi c\u0169ng b\u1ECB k\xE9o ra. Th\u01B0\u01A1ng n\u1EB7ng lui hai ph\u1EA7n, gi\u1EEFa tr\u1EADn h\u1ED3i b\u1ED1n ph\u1EA7n kh\xED huy\u1EBFt." }, "item.dinh_than_dan": { "name": "\u0110\u1ECBnh Th\u1EA7n \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Luy\u1EC7n t\u1EEB t\xE2m huy\u1EBFt v\u01B0\u1EE3n \u0111\xE3 nghe kinh tr\u0103m n\u0103m. M\u1ECB thu\u1EADt, \u1EA3o \xE2m kh\xF3 lay th\u1EA7n tr\xED, t\xE2m ma lui nhi\u1EC1u. Gi\u1EEFa tr\u1EADn linh l\u1EF1c th\xEAm ba h\u01A1i th\u1EDF." }, "item.bang_phach_dan": { "name": "B\u0103ng Ph\xE1ch \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Vi\xEAn \u0111an tr\u1EAFng \u0111\u1EE5c, c\u1EA7m l\xE2u tay t\xEA bu\u1ED1t. H\xE0n kh\xED \xE9p linh l\u1EF1c t\u1EA3n m\xE1t v\u1EC1 \u0111an \u0111i\u1EC1n, tu vi t\u0103ng m\u1ED9t \u0111o\u1EA1n, l\xF2ng c\u0169ng l\u1EA1nh l\u1EA1i." }, "item.duong_khi_dan": { "name": "D\u01B0\u1EE1ng Kh\xED \u0110an", "quality": 1, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Vi\xEAn thu\u1ED1c n\xE2u s\u1EABm, m\xF9i s\xE2m \u0111\u1EA5t. Ng\u01B0\u1EDDi ch\u01B0a nh\u1EADp \u0111\u1EA1o u\u1ED1ng l\xFAc ng\u1ED3i t\u0129nh t\u1ECDa, h\u01A1i th\u1EDF d\xE0i ra, kh\xED c\u1EA3m \u0111\u1EBFn s\u1EDBm h\u01A1n. B\u1EBF quan n\u0103m \u0111\u1EA7u nhanh th\xEAm m\u1ED9t ph\u1EA7n t\u01B0." }, "item.khai_nguyen_dan": { "name": "Khai Nguy\xEAn \u0110an", "quality": 2, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an xanh nh\u1EA1t, ng\u1EADm v\xE0o th\u1EA5y m\xE1t d\u1ECDc s\u1ED1ng l\u01B0ng nh\u01B0 c\xF3 d\xF2ng n\u01B0\u1EDBc ch\u1EA3y. Kinh m\u1EA1ch ph\xE0m thai m\u1EDF d\u1EA7n trong n\u0103m n\u0103m ng\u1ED3i \u0111\u1EA7u, tu luy\u1EC7n nhanh th\xEAm m\u1ED9t n\u1EEDa." }, "item.tu_khi_dan": { "name": "T\u1EE5 Kh\xED \u0110an", "quality": 2, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an ph\u1ED5 th\xF4ng nh\u1EA5t c\u1EE7a tu s\u0129 Luy\u1EC7n Kh\xED, vi\xEAn nh\u1ECF b\u1EB1ng h\u1EA1t \u0111\u1EADu. Gom linh kh\xED quanh ch\u1ED7 ng\u1ED3i v\u1EC1 \u0111an \u0111i\u1EC1n, n\u0103m b\u1EBF quan \u0111\u1EA7u nhanh th\xEAm ba ph\u1EA7n m\u01B0\u1EDDi." }, "item.ngung_khi_dan": { "name": "Ng\u01B0ng Kh\xED \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an tr\u1EAFng ng\xE0 c\xF3 v\xE2n l\xF4ng v\u0169. Linh kh\xED h\xFAt v\xE0o kh\xF4ng t\u1EA3n ra n\u1EEFa m\xE0 \u0111\u1ECDng l\u1EA1i th\xE0nh gi\u1ECDt. N\u0103m n\u0103m ng\u1ED3i \u0111\u1EA7u, tu luy\u1EC7n nhanh th\xEAm h\u01A1n m\u1ED9t n\u1EEDa." }, "item.boi_nguyen_dan": { "name": "B\u1ED3i Nguy\xEAn \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an m\xE0u l\xFAa ch\xEDn, tu s\u0129 Tr\xFAc C\u01A1 mang theo nh\u01B0 mang l\u01B0\u01A1ng kh\xF4. B\u1ED3i \u0111\u1EAFp ch\xE2n nguy\xEAn tr\xEAn \u0111\u1EA1o c\u01A1, m\u01B0\u1EDDi n\u0103m b\u1EBF quan \u0111\u1EA7u nhanh th\xEAm ba ph\u1EA7n m\u01B0\u1EDDi." }, "item.tinh_nguyen_dan": { "name": "Tinh Nguy\xEAn \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Trong vi\xEAn \u0111an xanh th\u1EABm th\u1EA5p tho\xE1ng m\u1ED9t v\u1EA9y r\u1ED3ng. Ch\xE2n nguy\xEAn luy\u1EC7n qua n\xF3 trong nh\u01B0 n\u01B0\u1EDBc gi\u1EBFng s\xE2u. Hai m\u01B0\u01A1i n\u0103m ng\u1ED3i \u0111\u1EA7u, tu luy\u1EC7n nhanh th\xEAm s\xE1u ph\u1EA7n m\u01B0\u1EDDi." }, "item.kim_lo_dan": { "name": "Kim L\u1ED9 \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an \u0111\u1ECF \u1ED1i, v\u1ECF r\u1ECBn m\u1ED9t l\u1EDBp s\u01B0\u01A1ng v\xE0ng. S\u01B0\u01A1ng \u1EA5y th\u1EA5m v\xE0o kim \u0111an nh\u01B0 n\u01B0\u1EDBc t\u01B0\u1EDBi \u0111\u1EA5t kh\xF4. Hai m\u01B0\u01A1i n\u0103m b\u1EBF quan \u0111\u1EA7u nhanh th\xEAm ba ph\u1EA7n m\u01B0\u1EDDi." }, "item.long_ho_dan": { "name": "Long H\u1ED5 \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "M\u1EB7t \u0111an c\xF3 hai v\xE2n xo\u1EAFn v\xE0o nhau, m\u1ED9t v\xE0ng m\u1ED9t tr\u1EAFng nh\u01B0 long h\u1ED5 qu\u1EA5n l\u1EA5y nhau. Kim \u0111an xoay nhanh nh\u01B0 c\xF3 ng\u01B0\u1EDDi quay h\u1ED9. N\u0103m m\u01B0\u01A1i n\u0103m ng\u1ED3i \u0111\u1EA7u, tu luy\u1EC7n nhanh th\xEAm s\xE1u ph\u1EA7n m\u01B0\u1EDDi." }, "item.boi_anh_dan": { "name": "B\u1ED3i Anh \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an m\xE0u l\xFAa non, th\u01A1m m\xF9i \u0111\xE0o ch\xEDn. Nguy\xEAn anh nu\u1ED1t d\u01B0\u1EE3c kh\xED l\u1EDBn nhanh nh\u01B0 tr\u1EBB \u0111\u01B0\u1EE3c b\xFA no. Tr\u0103m n\u0103m b\u1EBF quan \u0111\u1EA7u nhanh th\xEAm h\u01A1n ba ph\u1EA7n m\u01B0\u1EDDi." }, "item.huyen_anh_dan": { "name": "Huy\u1EC1n Anh \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an \u0111en tuy\u1EC1n, soi l\xEAn \u0111\xE8n th\u1EA5y m\u1ED9t b\xF3ng ng\u01B0\u1EDDi nh\u1ECF ng\u1ED3i x\u1EBFp b\u1EB1ng b\xEAn trong. Hai tr\u0103m n\u0103m ng\u1ED3i \u0111\u1EA7u, tu luy\u1EC7n nhanh th\xEAm h\u01A1n s\xE1u ph\u1EA7n m\u01B0\u1EDDi." }, "item.duong_than_dan": { "name": "D\u01B0\u1EE1ng Th\u1EA7n \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an \u1EA5m nh\u01B0 h\xF2n than v\xF9i tro, \u0111\u1EB7t l\xEAn tr\xE1n th\u1EA5y th\u1EA7n th\u1EE9c lan ra xa th\xEAm m\u1EA5y d\u1EB7m. Hai tr\u0103m n\u0103m b\u1EBF quan \u0111\u1EA7u nhanh th\xEAm h\u01A1n ba ph\u1EA7n m\u01B0\u1EDDi." }, "item.thai_hu_dan": { "name": "Th\xE1i H\u01B0 \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Vi\xEAn \u0111an trong su\u1ED1t, c\u1EA7m tr\xEAn tay m\xE0 nh\u01B0 kh\xF4ng c\u1EA7m g\xEC. U\u1ED1ng v\xE0o, nguy\xEAn th\u1EA7n nh\u01B0 tan ra c\xF9ng tr\u1EDDi \u0111\u1EA5t r\u1ED3i t\u1EE5 l\u1EA1i l\u1EDBn h\u01A1n. N\u0103m tr\u0103m n\u0103m ng\u1ED3i \u0111\u1EA7u, tu luy\u1EC7n nhanh th\xEAm b\u1EA3y ph\u1EA7n m\u01B0\u1EDDi." }, "item.loi_am_dan": { "name": "L\xF4i \xC2m \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an t\xEDm, l\u1EAFc b\xEAn tai nghe ti\u1EBFng s\u1EA5m nh\u1ECF. Nu\u1ED1t gi\u1EEFa tr\u1EADn, hai l\u01B0\u1EE3t ra \u0111\xF2n n\u1EB7ng g\u1EA5p r\u01B0\u1EE1i, linh l\u1EF1c th\xEAm b\u1ED1n h\u01A1i th\u1EDF, kh\xF4ng h\u1EA1i th\xE2n." }, "item.tinh_phach_dan": { "name": "T\u0129nh Ph\xE1ch \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Vi\xEAn \u0111an tr\u1EAFng xanh l\u1EA1nh nh\u01B0 h\u1EA1t m\u01B0a \u0111\xE1. Ng\u1EADm tan, t\u1EA1p ni\u1EC7m \u0111\xF4ng l\u1EA1i r\u1ED3i r\u01A1i r\u1EE5ng, t\xE2m ma lui h\u1EB3n m\u1ED9t kh\xFAc." }, "item.luyen_cot_dan": { "name": "Luy\u1EC7n C\u1ED1t \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Huy\u1EBFt b\u1ED3 \u0111\u1EC1 nung v\u1EDBi x\u01B0\u01A1ng s\xF3i v\u01B0\u01A1ng. U\u1ED1ng v\xE0o x\u01B0\u01A1ng c\u1ED1t k\xEAu r\u0103ng r\u1EAFc su\u1ED1t ba \u0111\xEAm, xong th\xEC c\u0103n c\u1ED1t d\xE0y l\xEAn, th\xE2n nh\u1EB9 nh\u01B0 s\xF3i." }, "item.truong_xuan_dan": { "name": "Tr\u01B0\u1EDDng Xu\xE2n \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an m\xE0u g\u1ED7 mun, m\xF9i \u0111\u1EA5t \u1EA9m sau m\u01B0a. T\xF3c b\u1EA1c \u0111en l\u1EA1i t\u1EEB ch\xE2n, th\xEAm b\u1EA3y m\u01B0\u01A1i l\u0103m n\u0103m th\u1ECD nguy\xEAn." }, "item.thong_than_dan": { "name": "Th\xF4ng Th\u1EA7n \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Trong l\xF2ng \u0111an c\xF3 m\u1ED9t \u0111\u1ED1m v\xE0ng nh\u01B0 con ng\u01B0\u01A1i \u01B0ng v\u01B0\u01A1ng. U\u1ED1ng xong nh\u1EAFm m\u1EAFt v\u1EABn th\u1EA5y r\xF5 t\u1EEBng chi\u1EBFc l\xE1 ngo\xE0i tr\u0103m tr\u01B0\u1EE3ng, th\u1EA7n th\u1EE9c t\u0103ng l\xEAn h\u1EB3n." }, "item.tran_hon_dan": { "name": "Tr\u1EA5n H\u1ED3n \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an l\u1EA1nh, \u0111\u1EB7t l\xEAn tr\xE1n th\u1EA5y h\u1ED3n nh\u01B0 b\u1ECB \u0111\xF3ng \u0111inh t\u1EA1i ch\u1ED7. D\xF9ng l\xFAc xung k\xEDch Nguy\xEAn Anh, t\u1EC9 l\u1EC7 \u0111\u1ED9t ph\xE1 th\xEAm 5%, t\xE2m ma kh\xF3 lay th\u1EA7n tr\xED." }, "item.hoa_anh_dan": { "name": "H\xF3a Anh \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an \u0111\u1ECF v\u1ECF s\u1EA7n nh\u01B0 v\u1EA3y r\u1ED3ng, n\xF3ng r\xE1t l\xF2ng b\xE0n tay. L\u1EEDa trong \u0111an nung v\u1ECF kim \u0111an cho n\u1EE9t. T\u0103ng 6% t\u1EC9 l\u1EC7 \u0111\u1ED9t ph\xE1 Nguy\xEAn Anh." }, "item.hoi_thien_dan": { "name": "H\u1ED3i Thi\xEAn \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an t\xEDm qu\u1EA5n m\u1ED9t s\u1EE3i t\u01A1 b\u1EA1c. T\u01A1 nh\u1EC7n m\u1EB9 kh\xE2u kinh m\u1EA1ch, linh chi n\u1ED1i th\u1ECBt, th\u01B0\u01A1ng th\u1EBF l\xE0nh h\u1EB3n, gi\u1EEFa tr\u1EADn h\u1ED3i g\u1EA7n b\u1EA3y ph\u1EA7n kh\xED huy\u1EBFt, linh l\u1EF1c th\xEAm s\xE1u h\u01A1i th\u1EDF." }, "item.han_tuy_dan": { "name": "H\xE0n T\u1EE7y \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an trong nh\u01B0 b\u0103ng, n\u1ED5i l\u01A1 l\u1EEDng m\u1ED9t chi\u1EBFc l\xF4ng tr\u1EAFng nh\u1ECF b\xEAn trong. H\xE0n kh\xED \xE9p ch\xE2n nguy\xEAn xu\u1ED1ng t\u1EADn t\u1EE7y, tu vi t\u0103ng m\u1ED9t \u0111o\u1EA1n d\xE0i, l\xF2ng l\u1EB7ng l\u1EA1i." }, "item.due_kim_dan": { "name": "Du\u1EC7 Kim \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an \u0111en b\xF3ng, \u0111\u1EA7u nh\u1ECDn nh\u01B0 gai h\u1EA1t v\u01B0\u01A1ng. Nu\u1ED1t gi\u1EEFa tr\u1EADn, ba l\u01B0\u1EE3t ra \u0111\xF2n n\u1EB7ng g\u1EA5p r\u01B0\u1EE1i, linh l\u1EF1c th\xEAm s\xE1u h\u01A1i th\u1EDF." }, "item.thuong_long_dan": { "name": "Th\u01B0\u01A1ng Long \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an xanh bi\u1EBFc, soi l\xEAn th\u1EA5y s\xF3ng ch\u1EA1y b\xEAn trong. Gi\u1EEFa tr\u1EADn linh l\u1EF1c tr\xE0o l\xEAn nh\u01B0 th\u1EE7y tri\u1EC1u, th\xEAm m\u01B0\u1EDDi l\u0103m h\u01A1i th\u1EDF, kh\xED huy\u1EBFt c\u0169ng h\u1ED3i ba ph\u1EA7n." }, "item.kim_o_dan": { "name": "Kim \xD4 \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an v\xE0ng ch\xF3i, n\xF3ng t\u1EDBi m\u1EE9c ph\u1EA3i \u0111\u1EF1ng trong h\u1ED9p ng\u1ECDc h\xE0n. Gi\u1EEFa tr\u1EADn ba l\u01B0\u1EE3t ra \u0111\xF2n n\u1EB7ng g\u1EA5p r\u01B0\u1EE1i, linh l\u1EF1c th\xEAm t\xE1m h\u01A1i th\u1EDF, kh\xED huy\u1EBFt h\u1ED3i b\u1ED1n ph\u1EA7n." }, "item.van_tho_dan": { "name": "V\u1EA1n Th\u1ECD \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Th\xE1i tu\u1EBF v\xE0 mai huy\u1EC1n quy luy\u1EC7n b\u1ED1n m\u01B0\u01A1i ch\xEDn ng\xE0y, vi\xEAn \u0111an n\u1EB7ng nh\u01B0 h\xF2n \u0111\xE1 cu\u1ED9i. Th\xEAm tr\u0103m b\u1ED1n m\u01B0\u01A1i n\u0103m th\u1ECD nguy\xEAn." }, "item.tao_hoa_dan": { "name": "T\u1EA1o H\xF3a \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an xanh n\u1EA3y m\u1ED9t m\u1EA7m non tr\xEAn v\u1ECF. Th\u01B0\u01A1ng th\u1EBF tan s\u1EA1ch, c\u0103n c\u1ED1t d\xE0y th\xEAm; gi\u1EEFa tr\u1EADn h\u1ED3i b\u1EA3y ph\u1EA7n kh\xED huy\u1EBFt, linh l\u1EF1c th\xEAm t\xE1m h\u01A1i th\u1EDF." }, "item.hoa_long_dan": { "name": "H\xF3a Long \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Trong \u0111an c\xF3 b\xF3ng r\u1ED3ng nh\u1ECF b\u01A1i v\xF2ng. U\u1ED1ng v\xE0o da n\u1ED5i v\xE2n v\u1EA3y ba ng\xE0y m\u1EDBi l\u1EB7n, c\u0103n c\u1ED1t v\xE0 th\xE2n ph\xE1p \u0111\u1EC1u l\xEAn m\u1ED9t b\u1EADc." }, "item.van_tam_dan": { "name": "V\u1EA5n T\xE2m \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an l\u1EA1nh nh\u01B0 s\xE2m tuy\u1EBFt, ng\u1EADm v\xE0o th\u1EA5y m\xECnh \u0111\u1EE9ng tr\u01B0\u1EDBc t\u1EA5m g\u01B0\u01A1ng b\u0103ng. T\u0103ng 4% t\u1EC9 l\u1EC7 \u0111\u1ED9t ph\xE1 H\xF3a Th\u1EA7n, t\xE2m ma kh\xF3 hi\u1EC7n h\xECnh h\u01A1n h\u1EB3n." }, "item.thien_nhat_dan": { "name": "Thi\xEAn Nh\u1EA5t \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "M\u1ED9t gi\u1ECDt ch\xE2n th\u1EE7y ng\u01B0ng th\xE0nh vi\xEAn, n\u1EB7ng tr\u0129u tay. Nguy\xEAn anh t\u1EAFm trong \u0111\xF3 nh\u01B0 c\xE1 v\u1EC1 bi\u1EC3n. T\u0103ng 6% t\u1EC9 l\u1EC7 \u0111\u1ED9t ph\xE1 H\xF3a Th\u1EA7n." }, "item.linh_lung_dan": { "name": "Linh Lung \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an trong su\u1ED1t c\xF3 b\u1EA3y l\u1ED7 nh\u1ECF xuy\xEAn qua, th\u1ED5i v\xE0o nghe ti\u1EBFng s\xE1o. U\u1ED1ng xong nh\u01B0 m\u1EDF th\xEAm m\u1ED9t khi\u1EBFu trong l\xF2ng, ng\u1ED9 t\xEDnh t\u0103ng h\u1EB3n." }, "item.thien_loi_dan": { "name": "Thi\xEAn L\xF4i \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "\u0110an \u0111en ch\xE1y x\xE9m, tia s\xE9t t\xEDm ch\u1EA1y quanh v\u1ECF. U\u1ED1ng l\xFAc \u0111\u1ED9t ph\xE1, l\xF4i kh\xED t\xF4i luy\u1EC7n c\u0103n c\u01A1 c\u1EA3nh gi\u1EDBi m\u1EDBi v\u1EEFng h\u01A1n m\u1ED9t b\u1EADc, t\u1EC9 l\u1EC7 th\xEAm 5%." }, "item.yeu_hoang_huyet_kinh": { "name": "Y\xEAu Ho\xE0ng Huy\u1EBFt Kinh", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "Kinh luy\u1EC7n huy\u1EBFt c\u1EE7a Y\xEAu Ho\xE0ng, ch\xE9p b\u1EB1ng m\xE1u l\xEAn v\xE1ch m\u1ED9t t\xF2a \u0111i\u1EC7n Trung Ch\xE2u. L\u1EEDa nung m\xE1u, \u0111\u1EA5t gi\u1EEF th\u1ECBt, kim \u0111\xFAc x\u01B0\u01A1ng; ng\u01B0\u1EDDi tu kh\xF4ng h\xF3a y\xEAu, nh\u01B0ng v\u1EBFt th\u01B0\u01A1ng li\u1EC1n nhanh nh\u01B0 y\xEAu." }, "item.phong_thien_an": { "name": "Phong Thi\xEAn \u1EA4n", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "\u1EA4n quy\u1EBFt n\u0103m t\u1ED5 s\u01B0 d\xF9ng \u0111\u1EC3 kh\xE9p Thi\xEAn M\xF4n, kh\u1EAFc tr\xEAn m\xE1i \u0111i\u1EC7n Trung Ch\xE2u d\u01B0\u1EDBi \u0111\xE1y bi\u1EC3n. \u1EA4n xu\u1ED1ng m\u1ED9t l\u1EA7n, linh l\u1EF1c \u0111\u1ED1i ph\u01B0\u01A1ng nh\u01B0 c\u1EEDa b\u1ECB ni\xEAm, nh\u1EA5t th\u1EDDi kh\xF4ng xoay n\u1ED5i." }, "item.bat_chiet_kiem": { "name": "B\u1EA5t Chi\u1EBFt Ki\u1EBFm", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "Ki\u1EBFm c\u1EE7a \u0110o\u1EA1n Thi\xEAn Chi\u1EBFn r\u01A1i xu\u1ED1ng \u0111\u1EA7m nh\u01B0 m\u01B0a, thanh n\xE0o c\u0169ng g\xE3y, ri\xEAng n\xF3 c\xF2n nguy\xEAn. Kh\xF4ng s\u1EAFc b\u1EB1ng To\xE1i Thi\xEAn, nh\u01B0ng ch\xE9m bao nhi\xEAu c\u0169ng kh\xF4ng m\u1EBB, ra chi\xEAu nh\u1EB9 tay h\u01A1n." }, "item.tam_sinh_thach": { "name": "Tam Sinh Th\u1EA1ch", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "H\xF2n \u0111\xE1 \u0111\u1EE9ng \u1EDF b\u1EADc Thi\xEAn M\xF4n, ng\u01B0\u1EDDi x\u01B0a qua c\u1EEDa \u0111\u1EC1u kh\u1EAFc t\xEAn l\xEAn \u0111\xF3. K\u1EBB \u0111\xE3 \u0111i qua nhi\u1EC1u ki\u1EBFp nh\xECn v\xE0o th\u1EA5y b\xF3ng m\xECnh ba \u0111\u1EDDi, l\xF2ng t\u1EF1 l\u1EB7ng, b\xECnh c\u1EA3nh t\u1EF1 m\u1ECFng." }, "item.thai_hu_chu": { "name": "Th\xE1i H\u01B0 Chu", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "Thuy\u1EC1n \u0111\u1EA7u r\u1ED3ng ch\u1EDF ng\u01B0\u1EDDi ch\u1EA1y kh\u1ECFi Trung Ch\xE2u l\xFAc \u0111\u1EA5t ch\xECm, r\u1ED3i m\u1EAFc l\u1EA1i gi\u1EEFa bi\u1EC3n. Th\xE2n g\u1ED7 kh\xF4ng m\u1EE5c, r\u1EBD s\xF3ng nh\u01B0 \u0111i tr\xEAn \u0111\u1EA5t b\u1EB1ng, \u0111\u1EE9ng m\u0169i thuy\u1EC1n nh\xECn t\u1EDBi t\u1EADn ch\xE2n tr\u1EDDi." }, "item.cuu_u_hoang_hoa": { "name": "C\u1EEDu U Ho\xE0ng H\u1ECFa", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "L\u1EEDa \u0111en ch\xE1y tr\xEAn x\u01B0\u01A1ng H\u1ED5 Ho\xE0ng, k\u1EBB theo Y\xEAu Ho\xE0ng t\u1EDBi tr\u1EADn cu\u1ED1i \u0110o\u1EA1n Thi\xEAn. Ba ngh\xECn n\u0103m kh\xF4ng t\u1EAFt; l\xF2 c\xF3 n\xF3, luy\u1EC7n m\xF3n g\xEC c\u0169ng nh\u01B0 th\xEAm m\u1ED9t b\xE0n tay gi\xE0." }, "item.thai_co_long_lan": { "name": "Th\xE1i C\u1ED5 Long L\xE2n", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "V\u1EA3y r\u1ED3ng r\u1EE5ng t\u1EEB th\u1EDDi Trung Ch\xE2u c\xF2n n\u1ED5i, Giao t\u1ED9c th\u1EDD l\xE0m th\xE1nh v\u1EADt su\u1ED1t ba ngh\xECn n\u0103m. \u0110eo s\xE1t ng\u01B0\u1EDDi, da c\u1EE9ng nh\u01B0 \u0111\xE1 ng\u1EA7m, m\xE1u d\xE0y nh\u01B0 n\u01B0\u1EDBc tri\u1EC1u." }, "item.doan_thien_chien_ky": { "name": "\u0110o\u1EA1n Thi\xEAn Chi\u1EBFn K\u1EF3", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "L\xE1 c\u1EDD li\xEAn qu\xE2n nh\xE2n t\u1ED9c c\u1EAFm tr\xEAn \u0111\xE0i \u0111\xE1 trong tr\u1EADn ch\xE9m Y\xEAu Ho\xE0ng, v\u1EA3i ch\xE1y x\xE9m m\xE0 ch\u01B0a r\xE1ch. Ph\u1EA5t l\xEAn m\u1ED9t l\u1EA7n, kim kh\xED v\xE0 l\u1EEDa tr\xFAt xu\u1ED1ng c\u1EA3 h\xE0ng \u0111\u1ECBch." }, "item.nghich_lan_thuan": { "name": "Ngh\u1ECBch L\xE2n Thu\u1EABn", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "Khi\xEAn \u0111\xFAc t\u1EEB v\u1EA3y ng\u01B0\u1EE3c d\u01B0\u1EDBi c\u1ED5 m\u1ED9t con giao th\u1EDDi Trung Ch\xE2u. \u0110\xF2n \u0111\xE1nh v\xE0o khi\xEAn d\u1ED9i l\u1EA1i th\xE0nh n\u1ED9 kh\xED, hai l\u01B0\u1EE3t sau ng\u01B0\u1EDDi c\u1EA7m ra tay n\u1EB7ng h\u01A1n." }, "item.thien_dien_dan": { "name": "Thi\xEAn Di\u1EC5n \u0110an", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "H\xE0 Ti\xEAn C\xF4 luy\u1EC7n cho ng\u01B0\u1EDDi s\u1EAFp qua Thi\xEAn M\xF4n, ch\u01B0a k\u1ECBp ph\xE1t th\xEC c\u1EEDa tr\u1EDDi \u0111\xE3 kh\xE9p. Nu\u1ED1t v\xE0o, ng\u1ED9 t\xEDnh v\xE0 th\u1EA7n th\u1EE9c m\u1EDF th\xEAm m\u1ED9t t\u1EA7ng, th\u1ECD th\xEAm tr\u0103m n\u0103m. D\u01B0\u1EE3c kh\xE1ng kh\xF4ng c\u1EA3n, ch\u1EC9 l\xF2ng h\u01A1i \u0111\u1ED9ng." }, "item.cam_lo_tinh_binh": { "name": "Cam L\u1ED9 T\u1ECBnh B\xECnh", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "B\xECnh ng\u1ECDc tr\u1EAFng c\u1EE7a m\u1ED9t ti\xEAn c\xF4 th\u1EDDi Trung Ch\xE2u, x\u01B0a h\u1EE9ng s\u01B0\u01A1ng \u0111\u1EC9nh n\xFAi t\u01B0\u1EDBi v\u01B0\u1EDDn thu\u1ED1c. N\u01B0\u1EDBc r\xF3t ra kh\xF4ng c\u1EA1n; t\u01B0\u1EDBi l\xEAn linh \u0111i\u1EC1n, c\xE2y l\xEAn nhanh nh\u01B0 \u0111\u01B0\u1EE3c th\xEAm m\xF9a. B\xECnh theo h\u1ED3n ch\u1EE7 qua c\u1EA7u, nh\u01B0 s\u01B0\u01A1ng v\u1EC1 l\u1EA1i \u0111\u1EC9nh n\xFAi." }, "item.than_nong_bach_thao_kinh": { "name": "Th\u1EA7n N\xF4ng B\xE1ch Th\u1EA3o Kinh", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "S\xE1ch thu\u1ED1c c\u1EE7a y gia Trung Ch\xE2u, ch\xE9p h\xECnh tr\u0103m lo\xE0i c\u1ECF v\xE0 n\u01A1i ch\xFAng m\u1ECDc. \u0110\u1EA5t ch\xECm, ng\u01B0\u1EDDi ch\xE9p ch\u1EA1y ra b\u1EDD nam, ch\xF4n s\xE1ch theo m\xECnh. Tu theo kinh, kh\xED huy\u1EBFt d\u1ED3i nh\u01B0 c\xE2y g\u1EB7p m\u01B0a; \u0111i h\xE1i thu\u1ED1c, m\u1EAFt tinh h\u01A1n ng\u01B0\u1EDDi." }, "item.hon_nguyen_dan_dinh": { "name": "H\u1ED7n Nguy\xEAn \u0110an \u0110\u1EC9nh", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "\u0110\u1EC9nh ba ch\xE2n c\u1EE7a \u0111an s\u01B0 Trung Ch\xE2u, t\u1EEBng luy\u1EC7n \u0111an cho ng\u01B0\u1EDDi s\u1EAFp qua Thi\xEAn M\xF4n. C\u1EEDa tr\u1EDDi kh\xE9p, ch\u1EE7 \u0111\u1EC9nh gi\u1EEF l\u1EEDa t\u1EDBi ch\u1EBFt. L\xF2 n\xE0y luy\u1EC7n \u0111\u01B0\u1EE3c m\u1ECDi ph\u1EA9m, m\u1EBB n\xE0o ra l\xF2 c\u0169ng d\u01B0 m\u1ED9t vi\xEAn." }, "item.tu_linh_chau": { "name": "T\u1EE5 Linh Ch\xE2u", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "H\u1EA1t ch\xE2u k\u1EBFt \u1EDF m\u1EAFt m\u1ED9t m\u1EA1ch linh kh\xED, to b\u1EB1ng tr\u1EE9ng ng\u1ED7ng, c\u1EA7m v\xE0o m\xE1t nh\u01B0 s\u01B0\u01A1ng s\u1EDBm. \u0110eo b\xEAn m\xECnh th\xEC linh l\u1EF1c d\u1ED3i; ng\u1ED3i b\u1EBF quan c\u1EA1nh n\xF3, linh kh\xED quanh ch\u1ED7 ng\u1ED3i \u0111\u1EB7c l\xEAn m\u1ED9t b\u1EADc." }, "item.tu_bao_bon": { "name": "T\u1EE5 B\u1EA3o B\u1ED3n", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "Ch\u1EADu \u0111\u1ED3ng c\u1EE7a th\u01B0\u01A1ng h\u1ED9i Trung Ch\xE2u, l\xF2ng ch\u1EADu kh\u1EAFc k\xEDn t\xEAn h\xE0ng v\xE0 gi\xE1. Mang theo ng\u01B0\u1EDDi \u0111i ch\u1EE3 th\xEC mua r\u1EBB b\xE1n \u0111\u1EAFt, h\xE0ng gi\u1EA3 h\xE0ng th\u1EADt li\u1EBFc qua l\xE0 bi\u1EBFt. Th\xEAm 50 \xF4 t\xFAi." }, "item.do_hon_linh": { "name": "\u0110\u1ED9 H\u1ED3n Linh", "quality": 8, "cat": "D\u1ECB B\u1EA3o", "desc": "Chu\xF4ng \u0111\u1ED3ng nh\u1ECF, c\xE1n bu\u1ED9c d\u1EA3i v\u1EA3i tr\u1EAFng \u0111\xE3 ng\u1EA3 v\xE0ng, t\u01B0\u01A1ng truy\u1EC1n r\u01A1i t\u1EEB tay ng\u01B0\u1EDDi ch\xE8o \u0111\xF2 b\u1EBFn Vong Xuy\xEAn. L\u1EAFc l\xEAn, h\u1ED3n k\u1EBB \u0111\u1ECBch kh\u1EF1ng l\u1EA1i. Ch\u1EBFt m\xE0 c\xF2n gi\u1EEF chu\xF4ng, n\xF3 t\u1EF1 theo ng\u01B0\u01A1i sang ki\u1EBFp sau, kh\xF4ng chi\u1EBFm ch\u1ED7 c\u1EE7a b\u1EA3o v\u1EADt n\xE0o kh\xE1c tr\xEAn \u0111\xF2." }, "item.huyen_vu_lenh": { "name": "Huy\u1EC1n V\u0169 L\u1EC7nh", "quality": 3, "cat": "L\u1EC7nh B\xE0i", "desc": "Th\u1EBB \u0111\u1ED3ng kh\u1EAFc r\xF9a \u0111en c\u1EE7a B\u1EAFc Minh. Thuy\u1EC1n tuy\u1EBFn Ngao D\u01B0\u01A1ng th\u1EA5y th\u1EBB l\xE0 cho l\xEAn, kh\xF4ng h\u1ECFi ti\u1EC1n." }, "item.van_bao_thong_hanh": { "name": "V\u1EA1n B\u1EA3o Th\xF4ng H\xE0nh", "quality": 3, "cat": "L\u1EC7nh B\xE0i", "desc": "Th\u1EBB ng\xE0 \u0111\xF3ng \u1EA5n V\u1EA1n B\u1EA3o Th\u01B0\u01A1ng H\u1ED9i. \u0110i tuy\u1EBFn V\u0129nh Tri\u1EC1u ch\u1EC9 tr\u1EA3 n\u1EEDa ti\u1EC1n v\xE9, ch\u1EA5p s\u1EF1 c\xF2n r\xF3t tr\xE0 m\u1EDDi." }, "item.huyet_linh_chi": { "name": "Huy\u1EBFt Linh Chi", "quality": 2, "cat": "Linh D\u01B0\u1EE3c", "desc": "" }, "item.thanh_tam_thao": { "name": "Thanh T\xE2m Th\u1EA3o", "quality": 2, "cat": "Linh D\u01B0\u1EE3c", "desc": "" }, "item.bang_phach_lien": { "name": "B\u0103ng Ph\xE1ch Li\xEAn", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "" }, "item.xich_tinh_qua": { "name": "X\xEDch Tinh Qu\u1EA3", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "" }, "item.han_thiet": { "name": "H\xE0n Thi\u1EBFt", "quality": 2, "cat": "Linh D\u01B0\u1EE3c", "desc": "" }, "item.son_sam": { "name": "S\u01A1n S\xE2m", "quality": 1, "cat": "Linh D\u01B0\u1EE3c", "desc": "Nh\xE2n s\xE2m m\u1ECDc hoang tr\xEAn n\xFAi. Ph\xE0m nh\xE2n qu\xFD nh\u01B0 v\xE0ng, tu s\u0129 ch\u1EC9 coi l\xE0 thu\u1ED1c b\u1ED5." }, "item.thiet_khoang": { "name": "Thi\u1EBFt Kho\xE1ng", "quality": 1, "cat": "Linh D\u01B0\u1EE3c", "desc": "Qu\u1EB7ng s\u1EAFt th\u01B0\u1EDDng. L\xF2 r\xE8n th\xF4n qu\xEA luy\u1EC7n ra Thi\u1EBFt Ki\u1EBFm t\u1EEB th\u1EE9 n\xE0y." }, "item.tu_kim": { "name": "T\u1EED Kim", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Kim lo\u1EA1i t\xEDm ch\u1EC9 c\xF3 \u1EDF m\u1EA1ch kho\xE1ng s\xE2u, nguy\xEAn li\u1EC7u ch\xEDnh c\u1EE7a T\u1EED Kim Phi Ki\u1EBFm." }, "item.van_nien_ban_dao": { "name": "V\u1EA1n Ni\xEAn B\xE0n \u0110\xE0o", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "\u0110\xE0o v\u1EA1n n\u0103m m\u1EDBi ch\xEDn, gi\u1ED1ng l\u1EA5y t\u1EEB Linh gi\u1EDBi tr\u01B0\u1EDBc ng\xE0y Thi\xEAn M\xF4n kh\xE9p. Linh kh\xED trong qu\u1EA3 \xF4n d\u01B0\u1EE1ng th\xE2n th\u1EC3, k\xE9o d\xE0i th\u1ECD nguy\xEAn; d\xF9ng nhi\u1EC1u th\xEC d\u01B0\u1EE3c l\u1EF1c y\u1EBFu d\u1EA7n." }, "item.cuu_thien_bat_tu_thao": { "name": "C\u1EEDu Thi\xEAn B\u1EA5t T\u1EED Th\u1EA3o", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1ECF ch\xEDn l\xE1 m\u1ECDc n\u01A1i linh kh\xED Nh\xE2n gi\u1EDBi \u0111\u1EADm nh\u1EA5t. H\xF3a Th\u1EA7n c\u0169ng ph\u1EA3i li\u1EC1u m\u1EA1ng tranh." }, "item.sa_can_thao": { "name": "Sa C\u0103n Th\u1EA3o", "quality": 1, "cat": "Linh D\u01B0\u1EE3c", "desc": "R\u1EC5 c\u1ECF \u0111\xE0o s\xE2u ba th\u01B0\u1EDBc d\u01B0\u1EDBi c\xE1t m\u1EDBi th\u1EA5y, nhai ch\xE1t nh\u01B0 v\u1ECF c\xE2y. L\xE1i bu\xF4n qua sa m\u1EA1c nhai s\u1ED1ng \u0111\u1EC3 c\u1EA7m m\xE1u v\u1EBFt r\xE1ch." }, "item.bach_cot_hoa": { "name": "B\u1EA1ch C\u1ED1t Hoa", "quality": 1, "cat": "Linh D\u01B0\u1EE3c", "desc": "Hoa tr\u1EAFng n\u1EDF tr\xEAn \u0111\u1ED1ng x\u01B0\u01A1ng y\xEAu th\xFA m\u1EE5c, c\xE1nh m\u1ECFng nh\u01B0 gi\u1EA5y. Lang t\u1ED9c kh\xF4ng \u0111\u1ED9ng t\u1EDBi, b\u1EA3o hoa \u1EA5y \u0103n ph\u1EA7n h\u1ED3n c\u1EE7a k\u1EBB \u0111\xE3 ch\u1EBFt." }, "item.mach_hoa_thao": { "name": "M\u1EA1ch Hoa Th\u1EA3o", "quality": 1, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1ECF th\u1EA5p m\u1ECDc trong k\u1EBD b\u0103ng, r\u1EC5 \u0111\u1ECF ch\u1EA1y ngo\u1EB1n ngo\xE8o nh\u01B0 m\u1EA1ch m\xE1u d\u01B0\u1EDBi da. B\u0103ng tan m\xF9a n\xE0o th\xEC n\xF3 n\u1EDF m\u1ED9t b\xF4ng hoa tr\u1EAFng b\u1EB1ng m\xF3ng tay, t\xE0n ngay trong ng\xE0y." }, "item.ha_diep_suong": { "name": "H\xE0 Di\u1EC7p S\u01B0\u01A1ng", "quality": 1, "cat": "Linh D\u01B0\u1EE3c", "desc": "S\u01B0\u01A1ng \u0111\u1ECDng tr\xEAn l\xE1 sen l\xFAc r\u1EA1ng \u0111\xF4ng, h\u1EE9ng b\u1EB1ng \u1ED1ng tre r\u1ED3i n\xE9n th\xE0nh vi\xEAn. H\u1ED3 n\xE0o c\u0169ng c\xF3, ch\u1EC9 ng\u01B0\u1EDDi d\u1EADy s\u1EDBm m\u1EDBi l\u1EA5y \u0111\u01B0\u1EE3c." }, "item.thuy_tien_can": { "name": "Th\u1EE7y Ti\xEAn C\u0103n", "quality": 2, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1EE7 th\u1EE7y ti\xEAn m\u1ECDc trong b\xF9n \u0111\xE1y h\u1ED3 n\u01B0\u1EDBc \u1EA5m. Ng\u01B0 d\xE2n d\xF9ng s\xE0o d\xE0i m\xF3c l\xEAn, l\xEAn kh\u1ECFi m\u1EB7t n\u01B0\u1EDBc m\u1ED9t canh gi\u1EDD l\xE0 h\xE9o." }, "item.hoa_mac_dang": { "name": "H\u1ECFa M\u1EA1c \u0110\u1EB1ng", "quality": 2, "cat": "Linh D\u01B0\u1EE3c", "desc": "D\xE2y leo \u0111\u1ECF nh\u01B0 g\xE2n tr\xE2u, b\xF2 lan tr\xEAn \u0111\xE1 n\xF3ng gi\u1EEFa tr\u01B0a. B\u1ECD c\u1EA1p n\u1EB1m r\xECnh d\u01B0\u1EDBi g\u1ED1c \u0111\u1EB1ng, ai th\xF2 tay v\xE0o h\xE1i l\xE0 b\u1ECB ch\xEDch." }, "item.kim_mach_dao": { "name": "Kim M\u1EA1ch \u0110\u1EA1o", "quality": 2, "cat": "Linh D\u01B0\u1EE3c", "desc": "L\xFAa d\u1EA1i m\u1ECDc tr\xEAn b\xE3i chi\u1EBFn tr\u01B0\u1EDDng c\u0169 \u0111\xE3 \u0111\xF3ng b\u0103ng, h\u1EA1t c\u1EE9ng v\xE0 s\u1EAFc nh\u01B0 m\u0169i kim. H\xE1i ph\u1EA3i \u0111eo g\u0103ng da, xay xong c\xF2n nghe ti\u1EBFng kim lo\u1EA1i r\xEDt trong c\u1ED1i." }, "item.mang_huyet_hoa": { "name": "M\xE3ng Huy\u1EBFt Hoa", "quality": 2, "cat": "Linh D\u01B0\u1EE3c", "desc": "Hoa \u0111\u1ECF n\u1EDF quanh hang \u0111\u1EA1i x\xE0, nh\u1EE5y r\u1EC9 nh\u1EF1a tanh nh\u01B0 m\xE1u. X\xE0 t\u1ED9c coi l\xE0 c\u1EE7a canh c\u1EEDa, r\u1EAFn n\u1EB1m s\u1EB5n d\u01B0\u1EDBi t\xE1n l\xE1." }, "item.tung_tam_chi": { "name": "T\xF9ng T\xE2m Chi", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "N\u1EA5m m\u1ECDc \u1EDF l\xF5i g\u1ED1c th\xF4ng ng\xE0n n\u0103m, ch\u1EB7t c\xE2y ra m\u1EDBi th\u1EA5y. Th\u01A1m m\xF9i nh\u1EF1a, b\u1EBB \u0111\xF4i c\xF2n r\u1EC9 n\u01B0\u1EDBc v\xE0ng." }, "item.co_moc_tam": { "name": "C\u1ED5 M\u1ED9c T\xE2m", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "L\xF5i g\u1ED7 c\u1EE7a c\u1ED5 th\u1EE5 \u0111\xE3 s\u1ED1ng qua ba tri\u1EC1u \u0111\u1EA1i, c\u1EE9ng nh\u01B0 \u0111\xE1 m\xE0 v\u1EABn \u1EA5m tay. Vi\xEAn t\u1ED9c tr\xE8o c\xE2y gi\u1EEF, ng\u01B0\u1EDDi l\u1EA1 l\u1EA1i g\u1EA7n th\xEC b\u1ECB n\xE9m qu\u1EA3." }, "item.kim_tue_mach": { "name": "Kim Tu\u1EC7 M\u1EA1ch", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "B\xF4ng l\xFAa v\xE0ng r\xF2ng m\u1ECDc xuy\xEAn l\u1EDBp b\u0103ng ng\xE0n n\u0103m ph\u1EE7 tr\xEAn b\xE3i x\u01B0\u01A1ng tr\u1EADn c\u1ED5. Gi\xF3 th\u1ED5i qua nghe l\xE1ch c\xE1ch nh\u01B0 ti\u1EC1n \u0111\u1ED3ng \u0111\u1ED5." }, "item.loi_sa_hoa": { "name": "L\xF4i Sa Hoa", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "Hoa n\u1EDF \u1EDF ch\u1ED7 s\xE9t \u0111\xE1nh xu\u1ED1ng c\xE1t, c\xE1t nung th\xE0nh th\u1EE7y tinh quanh r\u1EC5. Ch\u1EA1m v\xE0o t\xEA d\u1EA1i c\u1EA3 c\xE1nh tay." }, "item.tu_nham_hoa": { "name": "T\u1EED Nham Hoa", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Hoa t\xEDm m\u1ECDc t\u1EEB khe \u0111\xE1 c\u1EA1nh m\u1EA1ch t\u1EED kim, th\xE2n c\u1EE9ng nh\u01B0 s\u1EAFt. Ph\u1EA3i c\u1EADy c\u1EA3 m\u1EA3ng \u0111\xE1 m\u1EDBi l\u1EA5y \u0111\u01B0\u1EE3c r\u1EC5, g\xF5 v\xE0o k\xEAu leng keng." }, "item.tram_uyen_tao": { "name": "Tr\u1EA7m Uy\xEAn T\u1EA3o", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "T\u1EA3o xanh th\u1EABm m\u1ECDc d\u01B0\u1EDBi v\u1EF1c s\xE2u tr\u0103m tr\u01B0\u1EE3ng, ph\u1EA3i bu\u1ED9c \u0111\xE1 l\u1EB7n xu\u1ED1ng m\u1EDBi h\xE1i \u0111\u01B0\u1EE3c. Giao t\u1ED9c ng\u0103n ng\u01B0\u1EDDi l\u1EB7n, b\u1EA3o \u0111\xF3 l\xE0 rau trong v\u01B0\u1EDDn nh\xE0 h\u1ECD." }, "item.van_nien_tung_chi": { "name": "V\u1EA1n Ni\xEAn T\xF9ng Chi", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\xE0nh t\xF9ng m\u1ECDc n\u01A1i r\u1EEBng ch\u01B0a ai \u0111\u1EB7t ch\xE2n, m\u1ED7i tr\u0103m n\u0103m m\u1EDBi \u0111\xE2m m\u1ED9t \u0111\u1ED1t. Ch\u1EA1m v\xE0o nghe nh\u01B0 c\xF3 ng\u01B0\u1EDDi th\u1EDF d\xE0i trong g\u1ED7." }, "item.cuu_khuc_hoang_tinh": { "name": "C\u1EEDu Kh\xFAc Ho\xE0ng Tinh", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1EE7 ho\xE0ng tinh u\u1ED1n ch\xEDn kh\xFAc, n\u1EB1m s\xE2u trong \u0111\u1ED9ng \u0111\xE1 n\u01A1i \u0111\u1ECBa m\u1EA1ch giao nhau. \u0110\xE0o l\xEAn th\xEC c\u1EA3 qu\u1EA3 n\xFAi rung nh\u1EB9." }, "item.giao_chau_lien": { "name": "Giao Ch\xE2u Li\xEAn", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Sen n\u1EDF tr\xEAn \u0111\u1EA7m l\u1EA1nh, h\u1EA1t sen c\u1EE9ng nh\u01B0 ng\u1ECDc ch\xE2u. Giao t\u1ED9c l\u1EADp \u0111\xE0n canh quanh \u0111\u1EA7m, ngo\u1EA1i t\u1ED9c h\xE1i tr\u1ED9m b\u1ECB coi l\xE0 khinh m\u1EA1n t\u1ED5 ti\xEAn." }, "item.nhat_luan_hoa": { "name": "Nh\u1EADt Lu\xE2n Hoa", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Hoa v\xE0ng xoay theo m\u1EB7t tr\u1EDDi, \u0111\xEAm xu\u1ED1ng th\xEC ch\xE1y \xE2m \u1EC9 nh\u01B0 than. Ph\u1EA3i h\xE1i gi\u1EEFa tr\u01B0a, l\xFAc n\u1EAFng \u0111\u1ED5 l\u1EEDa xu\u1ED1ng \u0111\u1EA7u." }, "item.cuu_tue_linh_dao": { "name": "C\u1EEDu Tu\u1EC7 Linh \u0110\u1EA1o", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "L\xFAa ch\xEDn b\xF4ng tr\xEAn m\u1ED9t th\xE2n, m\u1ECDc n\u01A1i long m\u1EA1ch \u1EA5m ch\u1EA3y ng\u1EA7m d\u01B0\u1EDBi b\u0103ng. Quanh kho\u1EA3nh \u0111\u1EA5t \u1EA5y b\u0103ng kh\xF4ng bao gi\u1EDD \u0111\xF3ng; l\xE0ng n\xE0o gi\u1EEF \u0111\u01B0\u1EE3c th\xEC ba \u0111\u1EDDi kh\xF4ng \u0111\xF3i, v\xE0 ba \u0111\u1EDDi gi\u1EEF k\xEDn." }, "item.mang_hon_chi": { "name": "M\xE3ng H\u1ED3n Chi", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "N\u1EA5m \u0111\u1ECF m\u1ECDc tr\xEAn x\xE1c \u0111\u1EA1i m\xE3ng \u0111\xE3 h\xF3a \u0111\xE1, v\xE2n tr\xEAn m\u0169 nh\u01B0 v\u1EA3y r\u1EAFn. X\xE0 t\u1ED9c th\u1EDD n\xF3 ngang mi\u1EBFu th\u1EA7n." }, "item.loi_kiep_truc": { "name": "L\xF4i Ki\u1EBFp Tr\xFAc", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Tr\xFAc m\u1ECDc tr\xEAn \u0111\u1EC9nh n\xFAi tr\u1ECDc, m\u1ED7i \u0111\u1ED1t l\xE0 m\u1ED9t l\u1EA7n s\xE9t \u0111\xE1nh m\xE0 kh\xF4ng ch\u1EBFt. \u0110\xEAm gi\xF4ng, th\xE2n tr\xFAc l\xF3e tia t\xEDm ch\u1EA1y d\u1ECDc t\u1EEB g\u1ED1c l\xEAn ng\u1ECDn." }, "item.han_ngoc_sam": { "name": "H\xE0n Ng\u1ECDc S\xE2m", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "S\xE2m tr\u1EAFng trong nh\u01B0 ng\u1ECDc, r\u1EC5 c\u1EAFm xu\u1ED1ng b\u0103ng ch\u1EE9 kh\xF4ng xu\u1ED1ng \u0111\u1EA5t. \u0110\xE0o l\xEAn th\xEC c\u1EA3 c\u1EE7 t\u1ECFa \xE1nh lam nh\u1EA1t, c\u1EA7m l\xE2u t\xEA tay." }, "item.u_minh_lan": { "name": "U Minh Lan", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Lan \u0111en m\u1ECDc n\u01A1i \xE2m kh\xED t\u1EE5, ch\u1EC9 n\u1EDF l\xFAc n\u1EEDa \u0111\xEAm. C\xE1nh hoa ph\xE1t \xE1nh xanh l\u1EA1nh nh\u01B0 \u0111om \u0111\xF3m, qu\u1EF7 v\u1EADt quanh \u0111\xF3 coi n\xF3 l\xE0 c\u1EE7a m\xECnh." }, "item.xich_long_qua": { "name": "X\xEDch Long Qu\u1EA3", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Qu\u1EA3 \u0111\u1ECF v\u1ECF s\u1EA7n nh\u01B0 v\u1EA3y r\u1ED3ng, m\u1ECDc tr\xEAn v\xE1ch \u0111\xE1 n\xF3ng b\u1ECFng. B\u1ED5 ra, ru\u1ED9t \u0111\u1ECF r\u1EF1c nh\u01B0 than h\u1ED3ng, h\u01A1i n\xF3ng ph\u1EA3 l\xEAn m\u1EB7t." }, "item.van_tai_tuyet_lien": { "name": "V\u1EA1n T\xE1i Tuy\u1EBFt Li\xEAn", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Sen tuy\u1EBFt v\u1EA1n n\u0103m n\u1EDF m\u1ED9t l\u1EA7n, c\xE1nh trong nh\u01B0 b\u0103ng m\u1ECFng, gi\u1EEFa nh\u1EE5y s\xE1ng m\u1ED9t \u0111\u1ED1m lam. Ng\u1EADm m\u1ED9t c\xE1nh, l\xF2ng l\u1EB7ng nh\u01B0 m\u1EB7t h\u1ED3 \u0111\xF3ng b\u0103ng." }, "item.long_tien_thao": { "name": "Long Ti\xEAn Th\u1EA3o", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1ECF m\u1ECDc \u0111\xFAng ch\u1ED7 gi\u1ECDt n\u01B0\u1EDBc d\xE3i r\u1ED3ng r\u01A1i xu\u1ED1ng t\u1EEB th\u1EDDi tr\u01B0\u1EDBc Thi\xEAn M\xF4n. L\xE1 \u0111\u1ECF vi\u1EC1n v\xE0ng, \u0111\xEAm n\xE0o c\u0169ng ch\xE1y \xE2m \u1EC9 m\u1ED9t qu\u1EA7ng l\u1EEDa nh\u1ECF." }, "item.thai_tue": { "name": "Th\xE1i Tu\u1EBF", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Kh\u1ED1i th\u1ECBt s\u1ED1ng v\xF9i d\u01B0\u1EDBi \u0111\u1EA5t ngh\xECn n\u0103m, c\u1EAFt m\u1ED9t mi\u1EBFng th\xEC \u0111\xEAm sau t\u1EF1 li\u1EC1n. \xC1nh v\xE0ng \u0111\u1EE5c ng\u1EA5m ra qua l\u1EDBp \u0111\u1EA5t ph\u1EE7." }, "item.bich_trieu_linh_tao": { "name": "B\xEDch Tri\u1EC1u Linh T\u1EA3o", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "T\u1EA3o bi\u1EBFc d\xE0i tr\u0103m tr\u01B0\u1EE3ng m\u1ECDc d\u01B0\u1EDBi \u0111\xE1y v\u1EF1c n\u01B0\u1EDBc, \u0111ung \u0111\u01B0a theo con n\u01B0\u1EDBc ng\u1EA7m. V\u1EDBt l\xEAn v\u1EABn s\xE1ng xanh nh\u01B0 m\u1EB7t bi\u1EC3n c\xF3 tr\u0103ng." }, "item.thien_loi_moc_tam": { "name": "Thi\xEAn L\xF4i M\u1ED9c T\xE2m", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "L\xF5i c\xE2y c\u1ED5 th\u1EE5 b\u1ECB thi\xEAn l\xF4i \u0111\xE1nh tr\xFAng ch\xEDn l\u1EA7n, ngo\xE0i ch\xE1y th\xE0nh than, trong c\xF2n xanh. B\u1EBB ra, tia s\xE9t t\xEDm v\u1EABn ch\u1EA1y trong th\u1EDB g\u1ED7." }, "item.niet_ban_hoa": { "name": "Ni\u1EBFt B\xE0n Hoa", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Hoa t\u1EF1 b\u1ED1c ch\xE1y th\xE0nh tro r\u1ED3i t\u1EEB tro n\u1EDF l\u1EA1i, tr\u0103m n\u0103m m\u1ED9t v\xF2ng. H\xE1i \u0111\u01B0\u1EE3c \u0111\xFAng l\xFAc v\u1EEBa n\u1EDF, c\xE1nh hoa c\xF2n \u0111\u1ECF r\u1EF1c nh\u01B0 l\u1EEDa m\u1EDBi nh\xF3m." }, "item.bang_tam_thanh_lien": { "name": "B\u0103ng T\xE2m Th\xE1nh Li\xEAn", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Sen tr\u1EAFng m\u1ECDc gi\u1EEFa h\u1ED3 b\u0103ng kh\xF4ng bao gi\u1EDD tan, \xE1nh lam t\u1EEB l\xF5i hoa soi th\u1EA5u ba tr\u01B0\u1EE3ng n\u01B0\u1EDBc. Ng\u1EEDi m\u1ED9t h\u01A1i, t\u1EA1p ni\u1EC7m tan nh\u01B0 s\u01B0\u01A1ng s\u1EDBm." }, "item.hoang_trung_ly": { "name": "Ho\xE0ng Trung L\xFD", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "M\u1EADn v\xE0ng ba ngh\xECn n\u0103m m\u1EDBi ch\xEDn, qu\u1EA3 t\u1ECFa \xE1nh v\xE0ng \u1EA5m nh\u01B0 n\u1EAFng chi\u1EC1u. \u0102n m\u1ED9t qu\u1EA3 th\xEC x\u01B0\u01A1ng c\u1ED1t nh\u01B0 \u0111\u01B0\u1EE3c \u0111\xFAc l\u1EA1i." }, "item.thien_ngoai_van_thiet": { "name": "Thi\xEAn Ngo\u1EA1i V\u1EABn Thi\u1EBFt", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "S\u1EAFt r\u01A1i t\u1EEB tr\u1EDDi xu\u1ED1ng, v\u1ECF ch\xE1y \u0111en, trong l\xF5i \xE1nh b\u1EA1c l\u1EA1nh. L\xF2 th\u01B0\u1EDDng nung ba ng\xE0y kh\xF4ng \u0111\u1ECF." }, "item.canh_kim_tinh": { "name": "Canh Kim Tinh", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Tinh ch\u1EA5t kim kh\xED k\u1EBFt l\u1EA1i trong m\u1EA1ch kho\xE1ng v\u1EA1n n\u0103m, to b\u1EB1ng ng\xF3n tay m\xE0 n\u1EB7ng nh\u01B0 t\u1EA3ng \u0111\xE1. \xC1nh tr\u1EAFng s\u1EAFc \u0111\u1EBFn ch\xF3i m\u1EAFt." }, "item.ngu_sac_than_thach": { "name": "Ng\u0169 S\u1EAFc Th\u1EA7n Th\u1EA1ch", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "\u0110\xE1 n\u0103m m\xE0u, t\u01B0\u01A1ng truy\u1EC1n th\u1EEBa l\u1EA1i t\u1EEB l\xFAc Ng\u0169 T\u1ED5 v\xE1 phong \u1EA5n Thi\xEAn M\xF4n. N\u0103m v\u1EC7t s\xE1ng trong l\xF2ng \u0111\xE1 ch\u1EADm r\xE3i xoay quanh nhau." }, "item.thien_nien_ha_thu_o": { "name": "Thi\xEAn Ni\xEAn H\xE0 Th\u1EE7 \xD4", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1EE7 h\xE0 th\u1EE7 \xF4 ngh\xECn n\u0103m \u0111\xE3 m\u1ECDc th\xE0nh h\xECnh ng\u01B0\u1EDDi, c\xF3 \u0111\u1EE7 tay ch\xE2n. \u0110\xE0o l\xEAn ph\u1EA3i bu\u1ED9c ch\u1EC9 \u0111\u1ECF, kh\xF4ng th\xEC \u0111\xEAm n\xF3 t\u1EF1 chui xu\u1ED1ng \u0111\u1EA5t." }, "item.huyet_bo_de": { "name": "Huy\u1EBFt B\u1ED3 \u0110\u1EC1", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Qu\u1EA3 b\u1ED3 \u0111\u1EC1 \u0111\u1ECF s\u1EABm m\u1ECDc n\u01A1i y\xEAu th\xFA c\u1EAFn x\xE9 nhau, r\u1EC5 u\u1ED1ng m\xE1u m\xE0 l\u1EDBn. B\xF3p nh\u1EB9, v\u1ECF r\u1EC9 n\u01B0\u1EDBc \u0111\u1ECF c\xF2n \u1EA5m." }, "item.tu_van_linh_chi": { "name": "T\u1EED V\xE2n Linh Chi", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Linh chi t\xEDm m\u1ECDc d\u01B0\u1EDBi t\xE1n r\u1EEBng gi\xE0, tr\xEAn m\u0169 n\u1EA5m l\xFAc n\xE0o c\u0169ng v\u1EDDn m\u1ED9t d\u1EA3i m\xE2y t\xEDm m\u1ECFng. H\xE1i v\u1EC1, m\xE2y theo v\u1EC1 trong gi\u1ECF." }, "item.long_tu_thao": { "name": "Long Tu Th\u1EA3o", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1ECF n\u01B0\u1EDBc s\u1EE3i d\xE0i h\u01A1n ch\u1EE5c tr\u01B0\u1EE3ng, \u0111ung \u0111\u01B0a d\u01B0\u1EDBi \u0111\xE1y h\u1ED3 nh\u01B0 r\xE2u r\u1ED3ng. Nh\u1ED5 m\u1ED9t s\u1EE3i, c\u1EA3 \u0111\xE1m c\u1ECF quanh \u0111\xF3 co r\xFAt l\u1EA1i." }, "item.han_nguyet_que": { "name": "H\xE0n Nguy\u1EC7t Qu\u1EBF", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\xE2y qu\u1EBF l\xF9n m\u1ECDc trong khe b\u0103ng, hoa tr\u1EAFng ch\u1EC9 n\u1EDF \u0111\xEAm tr\u0103ng tr\xF2n. H\u01B0\u01A1ng l\u1EA1nh, ng\u1EEDi v\xE0o th\u1EA5y \u0111\u1EA7u \xF3c trong nh\u01B0 n\u01B0\u1EDBc gi\u1EBFng." }, "item.cuu_diep_kiem_thao": { "name": "C\u1EEDu Di\u1EC7p Ki\u1EBFm Th\u1EA3o", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1ECF ch\xEDn l\xE1 th\u1EB3ng nh\u01B0 ch\xEDn thanh ki\u1EBFm nh\u1ECF, m\u1ECDc tr\xEAn m\u1ED9 ki\u1EBFm kh\xE1ch gi\u1EEFa r\u1EEBng s\xE2u. L\xE1 c\u1EE9a \u0111\u1EE9t tay nh\u01B0 l\u01B0\u1EE1i th\xE9p." }, "item.that_khieu_linh_ngau": { "name": "Th\u1EA5t Khi\u1EBFu Linh Ng\u1EABu", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ng\xF3 sen tr\u1EAFng nh\u01B0 ng\u1ECDc, b\u1EBB ra c\xF3 \u0111\xFAng b\u1EA3y l\u1ED7 th\xF4ng nh\u01B0 b\u1EA3y khi\u1EBFu ng\u01B0\u1EDDi. Th\u1ED5i qua nghe ti\u1EBFng s\xE1o kh\u1EBD." }, "item.bang_tuy_chi": { "name": "B\u0103ng T\u1EE7y Chi", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "N\u1EA5m trong su\u1ED1t m\u1ECDc trong l\xF5i t\u1EA3ng b\u0103ng v\u1EA1n n\u0103m, ph\u1EA3i \u0111\u1EE5c c\u1EA3 kh\u1ED1i b\u0103ng m\u1EDBi l\u1EA5y ra \u0111\u01B0\u1EE3c. \u0110\u1EC3 ngo\xE0i tr\u1EDDi n\u1EAFng c\u0169ng kh\xF4ng tan." }, "item.hoa_long_thao": { "name": "H\xF3a Long Th\u1EA3o", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1ECF xanh lam m\u1ECDc n\u01A1i \u0111\u1EA1i x\xE0 l\u1ED9t x\xE1c l\u1EA7n cu\u1ED1i. X\xE0 t\u1ED9c tin r\u1EB1ng nu\u1ED1t \u0111\u01B0\u1EE3c n\xF3 th\xEC th\xE2n r\u1EAFn m\u1ECDc s\u1EEBng, \u0111\xE1nh nhau c\u1EA3 tr\u0103m n\u0103m \u0111\u1EC3 gi\u1EEF." }, "item.kim_o_qua": { "name": "Kim \xD4 Qu\u1EA3", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Qu\u1EA3 v\xE0ng r\u1EF1c m\u1ECDc tr\xEAn c\xE2y kh\xF4 gi\u1EEFa sa m\u1EA1c, v\u1ECF n\xF3ng nh\u01B0 h\xF2n than. Chim bay ngang qua t\xE1n c\xE2y th\xEC ch\xE1y x\xE9m l\xF4ng." }, "item.kien_moc_qua": { "name": "Ki\u1EBFn M\u1ED9c Qu\u1EA3", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Qu\u1EA3 c\u1EE7a m\u1ED9t nh\xE1nh Ki\u1EBFn M\u1ED9c c\xF2n s\xF3t l\u1EA1i t\u1EEB th\u1EDDi tr\u1EDDi \u0111\u1EA5t th\xF4ng nhau. H\u1EA1t qu\u1EA3 n\u1EA3y m\u1EA7m ngay trong l\xF2ng b\xE0n tay." }, "item.thien_nhat_chan_thuy": { "name": "Thi\xEAn Nh\u1EA5t Ch\xE2n Th\u1EE7y", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Gi\u1ECDt n\u01B0\u1EDBc \u0111\u1EA7u ti\xEAn c\u1EE7a tr\u1EDDi \u0111\u1EA5t, \u0111\u1ECDng d\u01B0\u1EDBi \u0111\xE1y h\u1ED3 s\xE2u ngh\xECn tr\u01B0\u1EE3ng. N\u1EB7ng nh\u01B0 th\u1EE7y ng\xE2n, r\xF3t v\xE0o ch\xE9n ng\u1ECDc th\xEC ch\xE9n n\u1EE9t." }, "item.tuyet_long_sam": { "name": "Tuy\u1EBFt Long S\xE2m", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "C\u1EE7 s\xE2m tr\u1EAFng cu\u1ED9n m\xECnh nh\u01B0 r\u1ED3ng ng\u1EE7 trong b\u0103ng, r\xE2u s\xE2m d\xE0i m\u1EA5y tr\u01B0\u1EE3ng. \u0110\xE0o l\xEAn, b\u0103ng quanh \u0111\xF3 n\u1EE9t to\xE1c th\xE0nh h\xECnh v\u1EA3y." }, "item.than_huyet_dang": { "name": "Th\u1EA7n Huy\u1EBFt \u0110\u1EB1ng", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "D\xE2y leo \u0111\u1ECF th\u1EABm qu\u1EA5n quanh h\xE0i c\u1ED1t m\u1ED9t v\u1ECB y\xEAu th\u1EA7n c\u1ED5, nh\u1EF1a \u0111\u1EB7c nh\u01B0 m\xE1u. Ch\u1EB7t m\u1ED9t \u0111o\u1EA1n, \u0111\u1EA7u d\xE2y c\u1EAFt r\u01B0\u1EDBn t\u1EDBi t\xECm ng\u01B0\u1EDDi." }, "item.phu_but_pham": { "name": "Tr\xFAc H\xE0o B\xFAt", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "C\xE1n tr\xFAc, ng\xF2i l\xF4ng d\xEA, \xF4ng t\u1EEB n\xE0o c\u0169ng c\xF3 m\u1ED9t c\xE2y. V\u1EBD \u0111\u01B0\u1EE3c ph\xF9 Ho\xE0ng ph\u1EA9m, cao h\u01A1n th\xEC n\xE9t run." }, "item.phu_but_hoang": { "name": "Lang H\xE0o B\xFAt", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\xF2i l\xF4ng g\xE1y s\xF3i y\xEAu, c\u1EE9ng m\xE0 \u0111\xE0n h\u1ED3i, gi\u1EEF \u0111\u01B0\u1EE3c linh l\u1EF1c trong n\xE9t. Ph\xF9 s\u01B0 ph\u01B0\u1EDDng th\u1ECB hay d\xF9ng." }, "item.phu_but_huyen": { "name": "H\u1EA1c V\u0169 Ph\xF9 B\xFAt", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\xF2i k\u1EBFt t\u1EEB l\xF4ng c\xE1nh h\u1EA1c ti\xEAn, c\xE1n ng\u1ECDc xanh. N\xE9t b\xFAt \u0111i t\u1EDBi \u0111\xE2u, gi\u1EA5y s\xE1ng t\u1EDBi \u0111\xF3." }, "item.phu_but_dia": { "name": "T\u1EED Ng\u1ECDc Ph\xF9 B\xFAt", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "C\xE1n t\u1EA1c t\u1EEB m\u1ED9t kh\u1ED1i t\u1EED ng\u1ECDc, ng\xF2i t\u1EA9m m\xE1u giao long. \u0110\u1EA1i ph\xF9 s\u01B0 d\xF9ng n\xF3 v\u1EBD ph\xF9 tr\u1EA5n t\xE0 cho c\u1EA3 m\u1ED9t th\xE0nh." }, "item.phu_but_thien": { "name": "B\u1ED3 \u0110\u1EC1 Ph\xF9 B\xFAt", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "C\xE1n g\u1ED7 b\u1ED3 \u0111\u1EC1 tr\u0103m n\u0103m l\xEAn n\u01B0\u1EDBc b\xF3ng nh\u01B0 ng\u1ECDc, ng\xF2i k\u1EBFt l\xF4ng \u0111u\xF4i b\u1EA1ch vi\xEAn. N\xE9t b\xFAt \u0111i t\u1EDBi \u0111\xE2u, gi\u1EA5y th\u01A1m m\xF9i tr\u1EA7m t\u1EDBi \u0111\xF3." }, "item.phu_but_tien": { "name": "L\xF4i M\u1ED9c Ph\xF9 B\xFAt", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "C\xE1n g\u1ED7 \u0111\xE0o b\u1ECB s\xE9t \u0111\xE1nh ngh\xECn n\u0103m, th\u1EDB g\u1ED7 c\xF2n ch\u1EA1y \xE1nh \u0111i\u1EC7n. Ng\xF2i k\u1EBFt l\xF4ng b\u1EB1ng v\u01B0\u01A1ng, h\u1EA1 m\u1ED9t n\xE9t l\xE0 t\u1EDD gi\u1EA5y rung nh\u01B0 m\u1EB7t tr\u1ED1ng." }, "item.chu_sa": { "name": "Chu Sa", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1ED9t son \u0111\u1ECF th\u1EABm, m\xE0i v\u1EDBi n\u01B0\u1EDBc th\xE0nh m\u1EF1c v\u1EBD b\xF9a. G\xF3i gi\u1EA5y d\u1EA7u, \u0111\u1EC3 \u1EA9m l\xE0 v\xF3n c\u1EE5c." }, "item.phu_chi": { "name": "Ph\xF9 Ch\u1EC9", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "X\u1EA5p gi\u1EA5y v\xE0ng c\u1EAFt s\u1EB5n kh\u1ED5 b\xF9a, nhu\u1ED9m n\u01B0\u1EDBc hoa h\xF2e. Gi\u1EA5y th\u01B0\u1EDDng th\xEC kh\xF4ng gi\u1EEF \u0111\u01B0\u1EE3c n\xE9t ph\xF9." }, "item.yeu_huyet_mac": { "name": "Y\xEAu Huy\u1EBFt M\u1EB7c", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1ECFi m\u1EF1c \u0111en \xE1nh \u0111\u1ECF, m\xE0i t\u1EEB huy\u1EBFt y\xEAu th\xFA tr\u1ED9n chu sa v\xE0 nh\u1EF1a t\xF9ng. Ph\xF9 \u0111\xE1nh tr\u1EADn ph\u1EA3i d\xF9ng m\u1EF1c n\xE0y m\u1EDBi c\xF3 l\u1EF1c." }, "item.dp_quy_tuc_phu": { "name": "Quy T\u1EE9c Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB ng\u1ECDc ch\xE9p ph\xF9 v\u1EC1 tr\u1EADn \u0111\xE3 bi\u1EBFt c\xF9ng Th\u1ED5, d\u1EB7n kh\xE9p n\xE9t cu\u1ED1i." }, "item.dp_na_di_phu": { "name": "Na Di Ph\xF9 ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB ng\u1ECDc ch\xE9p v\xF2ng ph\xF9 d\u1EDDi th\xE2n trong t\u1EA7m ba ngh\xECn d\u1EB7m." }, "item.dp_hoa_dan_phu": { "name": "H\u1ECFa \u0110\u1EA1n Ph\xF9 ph\u01B0\u01A1ng", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": 'T\u1EDD gi\u1EA5y b\u1EA3n v\u1EBD m\u1EABu m\u1ED9t v\xF2ng xo\xE1y, b\xEAn c\u1EA1nh ghi ba ch\u1EEF "ch\u1EDB d\u1EEBng b\xFAt".' }, "item.dp_bua_tru_ta": { "name": "B\xF9a tr\u1EEB t\xE0 ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "S\u1ED5 m\u1EABu b\xF9a c\u1EE7a \xF4ng t\u1EEB, gi\u1EA5y \xE1m kh\xF3i h\u01B0\u01A1ng. Trang \u0111\u1EA7u l\xE0 b\xF9a tr\u1EEB t\xE0, n\xE9t n\xE0o c\u0169ng t\xF4 \u0111i t\xF4 l\u1EA1i." }, "item.dp_canh_kim_phu": { "name": "Canh Kim Ph\xF9 ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc kh\u1EAFc m\u1EABu ph\xF9 kim, d\u1EB7n nghi\u1EC1n r\u0103ng s\xF3i th\u1EADt m\u1ECBn m\u1EDBi h\xF2a v\xE0o m\u1EF1c." }, "item.dp_dan_loi_phu": { "name": "D\u1EABn L\xF4i Ph\xF9 ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD ph\xF9 m\u1EABu c\u1EE7a \u0111\u1EA1o s\u0129 \u0111i \u0111\u01B0\u1EDDng, g\xF3c gi\u1EA5y ch\xE1y s\xE9m nh\u01B0 t\u1EEBng b\u1ECB s\xE9t li\u1EBFm." }, "item.dp_dinh_than_phu": { "name": "\u0110\u1ECBnh Th\xE2n Ph\xF9 ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh l\u1EE5a v\u1EBD m\u1EABu ph\xF9, m\xE9p c\xF3 v\u1EBFt \u1ED1 v\xE0ng c\u1EE7a m\u1EE7 c\xF3c. Ch\xE9p xong nh\u1EDB r\u1EEDa tay." }, "item.dp_kim_cuong_phu": { "name": "Kim C\u01B0\u01A1ng Ph\xF9 ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EABu ph\xF9 h\u1ED9 th\xE2n ch\xE9p t\u1EEB m\u1ED9t b\u1EA3n kinh nh\xE0 ch\xF9a, ch\u1EEF Ph\u1EA1n xen n\xE9t chu sa." }, "item.dp_than_hanh_phu": { "name": "Th\u1EA7n H\xE0nh Ph\xF9 ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD m\u1EABu nh\xE0u n\xE1t, phu ki\u1EC7u v\u1EDBi ti\xEAu s\u01B0 truy\u1EC1n tay nhau ch\xE9p l\u1EA1i." }, "item.dp_truyen_am_phu": { "name": "Truy\u1EC1n \xC2m Ph\xF9 ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD c\xE1ch g\u1EA5p h\u1EA1c gi\u1EA5y k\xE8m n\xE9t ph\xF9 d\u01B0\u1EDBi c\xE1nh. N\xE9t sai m\u1ED9t ch\u1ED7 l\xE0 h\u1EA1c bay l\u1EA1c." }, "item.dp_tam_lo_phu": { "name": "T\u1EA7m L\u1ED9 Ph\xF9 ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EABu ph\xF9 c\u1EE7a th\u01B0\u01A1ng \u0111o\xE0n \u0111i n\xFAi, m\u1EB7t sau v\u1EBD ngu\u1EC7ch ngo\u1EA1c m\u1ED9t t\u1EA5m b\u1EA3n \u0111\u1ED3 kh\xF4ng r\xF5 ch\u1ED7 n\xE0o." }, "item.dp_thanh_phong_phu": { "name": "Thanh Phong Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ghi m\u1EABu ph\xF9 gi\xF3, d\u1EB7n n\xE9t ph\u1EA3i nh\u1EB9 nh\u01B0 l\xF4ng, n\u1EB7ng tay l\xE0 gi\xF3 kh\xF4ng ra." }, "item.dp_thien_ti_phu": { "name": "Thi\xEAn Ti Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD m\u1ED9t m\u1EA1ng nh\u1EC7n ch\xEDn v\xF2ng, m\u1ED7i v\xF2ng l\xE0 m\u1ED9t n\xE9t ph\xF9." }, "item.dp_huyen_quy_phu": { "name": "Huy\u1EC1n Quy Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": 'Ng\u1ECDc gi\u1EA3n kh\u1EAFc v\xE2n mai r\xF9a. L\u1EDDi d\u1EB7n c\u1EE7a ng\u01B0\u1EDDi ch\xE9p, "ch\u1EADm th\xEC s\u1ED1ng, nhanh th\xEC v\u1EE1".' }, "item.dp_dia_don_phu": { "name": "\u0110\u1ECBa \u0110\u1ED9n Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n \u0111\u1EA5t s\xE9t nung, t\xE1n tu n\xE0o c\xF3 \u0111\u01B0\u1EE3c c\u0169ng gi\u1EA5u k\u1EF9. M\u1ED9t t\u1EDD ph\xF9 n\xE0y \u0111\u1ED5i \u0111\u01B0\u1EE3c m\u1ED9t c\xE1i m\u1EA1ng." }, "item.dp_huyen_bang_phu": { "name": "Huy\u1EC1n B\u0103ng Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n l\u1EA1nh bu\u1ED1t tay, m\u1EB7t kh\u1EAFc m\u1EABu ph\xF9 b\u0103ng c\u1EE7a ng\u01B0\u1EDDi B\u1EAFc Minh." }, "item.dp_tu_tieu_loi_phu": { "name": "T\u1EED Ti\xEAu L\xF4i Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n c\xF3 \u1EA5n s\u01A1n m\xF4n, m\u1EABu ph\xF9 tr\u1EA5n t\xE0 v\u1ED1n ch\u1EC9 truy\u1EC1n trong ph\xF9 \u0111\u01B0\u1EDDng, kh\xF4ng bi\u1EBFt sao l\u1EA1i l\u1ECDt ra ngo\xE0i." }, "item.dp_kim_thiem_phu": { "name": "Kim Thi\u1EC1m Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xE1 sen kh\xF4 c\xF3c y\xEAu gi\u1EEF d\u01B0\u1EDBi b\u1EE5ng, g\xE2n l\xE1 ch\xEDnh l\xE0 n\xE9t ph\xF9. M\xE9p l\xE1 c\xF2n nh\u1EDBt." }, "item.dp_cuu_tieu_phong_phu": { "name": "C\u1EEDu Ti\xEAu Phong Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF4ng h\u1EA1c d\xE0i, s\u1ED1ng l\xF4ng kh\u1EAFc ch\u1EEF nh\u1ECF nh\u01B0 s\u1EE3i t\xF3c. Th\u1ED5i nh\u1EB9 th\xEC ch\u1EEF s\xE1ng l\xEAn t\u1EEBng h\xE0ng." }, "item.dp_pha_quan_phu": { "name": "Ph\xE1 Qu\xE2n Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB b\xE0i \u0111\u1ED3ng c\u1EE7a m\u1ED9t ph\xF9 s\u01B0 \u0111\u1ED3n bi\xEAn L\u01B0\u01A1ng Qu\u1ED1c, m\u1EB7t sau kh\u1EAFc ph\u01B0\u01A1ng ph\xF9. B\u1ECB s\xF3i tha v\u1EC1 hang c\xF9ng ch\u1EE7." }, "item.dp_bat_dong_phu": { "name": "B\u1EA5t \u0110\u1ED9ng Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da g\u1EA5u c\u0169, c\xF3 ai \u0111\xF3 v\u1EBD ph\xF9 l\xEAn r\u1ED3i qu\xEAn. H\xF9ng t\u1ED9c gi\u1EEF nh\u01B0 gi\u1EEF l\u1EDDi th\u1EC1 c\u1EE7a ng\u01B0\u1EDDi x\u01B0a." }, "item.dp_kim_lan_doc_phu": { "name": "Kim L\xE2n \u0110\u1ED9c Ph\xF9 ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh \u0111en n\u1EB1m trong b\u1EE5ng m\xE3ng x\xE0, b\u1ECDc m\u1ED9t l\u1EDBp nh\u1EDBt ch\u01B0a kh\xF4. \u0110\u1ECDc xong tay t\xEA t\u1EDBi khu\u1EF7u." }, "item.dp_canh_kim_phu_nha": { "name": "Canh Kim Ph\xF9 ph\u01B0\u01A1ng (nanh l\u1EE3n)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD ph\xF9 m\u1EABu v\u1EBD tr\xEAn gi\u1EA5y th\xF4, g\xF3c d\xEDnh b\u1ED9t nanh tr\u1EAFng." }, "item.dp_dinh_than_phu_diep": { "name": "\u0110\u1ECBnh Th\xE2n Ph\xF9 ph\u01B0\u01A1ng (\u0111i\u1EC7p ph\u1EA5n)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD ph\xF9 m\u1EABu c\xF2n \xF3ng \xE1nh ph\u1EA5n b\u01B0\u1EDBm, nh\xECn l\xE2u th\u1EA5y hoa m\u1EAFt." }, "item.dp_na_di_phu_sa": { "name": "Na Di Ph\xF9 ph\u01B0\u01A1ng (sa linh)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\xFAi v\u1EA3i nh\u1ECF \u0111\u1EF1ng m\u1ED9t t\u1EDD ph\xF9 m\u1EABu, \u0111\xE1y t\xFAi c\xF2n m\u1EA5y h\u1EA1t c\xE1t v\xE0ng." }, "item.dp_dia_don_phu_vu": { "name": "\u0110\u1ECBa \u0110\u1ED9n Ph\xF9 ph\u01B0\u01A1ng (v\u1EE5 tinh)", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc \u1EA9m, c\u1EA7m l\xEAn tay th\u1EA5y m\xE1t nh\u01B0 v\u1EEBa qua s\u01B0\u01A1ng s\u1EDBm." }, "item.dp_huyen_bang_phu_chau": { "name": "Huy\u1EC1n B\u0103ng Ph\xF9 ph\u01B0\u01A1ng (b\u0103ng ph\xE1ch ch\xE2u)", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh lam, t\xF3c mai ng\u01B0\u1EDDi c\u1EA7m l\xE2u \u0111\u1ECDng s\u01B0\u01A1ng." }, "item.dp_thuong_lang_phu": { "name": "Th\u01B0\u01A1ng L\xE3ng Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tre ng\xE2m n\u01B0\u1EDBc l\xE2u n\u0103m, ch\u1EEF kh\u1EAFc v\u1EABn r\xF5." }, "item.dp_liet_diem_phu": { "name": "Li\u1EC7t Di\u1EC5m Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD ph\xF9 m\u1EABu tr\xEAn gi\u1EA5y d\xE0y, m\xE9p ch\xE1y s\xE9m." }, "item.dp_toan_phong_phu": { "name": "To\xE0n Phong Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD ph\xF9 m\u1EABu ch\u1EB7n b\u1EB1ng \u0111\xE1, l\u01A1i tay l\xE0 n\xF3 bay m\u1EA5t." }, "item.dp_thien_loi_phu": { "name": "Thi\xEAn L\xF4i Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xEDm, s\u1EDD v\xE0o t\xEA \u0111\u1EA7u ng\xF3n tay." }, "item.dp_toa_hon_phu": { "name": "T\u1ECFa H\u1ED3n Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y v\xE0ng ng\u1EA3 tro, ai c\u1EA7m l\xE2u c\u0169ng th\u1EA5y sau g\xE1y l\u1EA1nh." }, "item.dp_am_binh_phu": { "name": "\xC2m Binh Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": 'Th\u1EBB \u0111\u1ED3ng nh\u1ECF kh\u1EAFc m\u1EABu ph\xF9, m\u1EB7t sau c\xF3 ch\u1EEF "l\u1EC7nh" \u0111\xE3 m\xF2n.' }, "item.dp_tam_bao_phu": { "name": "T\u1EA7m B\u1EA3o Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD ph\xF9 m\u1EABu g\u1EA5p l\xE0m t\u01B0, m\u1EDF ra c\xF2n m\xF9i ch\u1ED3n." }, "item.dp_tran_quy_phu": { "name": "Tr\u1EA5n Qu\u1EF7 Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n l\u1EE5a \u0111en c\u1EE7a m\u1ED9t t\u0103ng nh\xE2n tr\u1EEB t\xE0, ch\u1EEF vi\u1EBFt b\u1EB1ng m\u1EF1c xanh l\xE9t." }, "item.dp_phi_cham_phu": { "name": "Phi Ch\xE2m Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD m\u1ED9t t\u1EDD ph\xF9 l\u1EA5m t\u1EA5m tr\u0103m ch\u1EA5m nh\u1ECF, ch\u1EA5m n\xE0o c\u0169ng s\xE1ng nh\u01B0 \u0111\u1EA7u kim." }, "item.dp_thanh_xa_phu": { "name": "Thanh X\xE0 Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD ph\xF9 m\u1EABu g\xF3i trong da r\u1EAFn l\u1ED9t, gi\u1EA5y ng\u1EA3 xanh nh\u01B0 r\xEAu." }, "item.dp_thanh_tuyen_phu": { "name": "Thanh Tuy\u1EC1n Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\xE1t l\u1EA1nh, \xE1p l\xEAn tr\xE1n nghe ti\u1EBFng su\u1ED1i r\xF3c r\xE1ch." }, "item.dp_cuong_huyet_phu": { "name": "Cu\u1ED3ng Huy\u1EBFt Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh l\u1EE5a \u0111\u1ECF ch\xE9p m\u1EABu ph\xF9, m\xE9p c\xF3 d\u1EA5u tay m\xE1u c\u1EE7a ng\u01B0\u1EDDi ch\xE9p." }, "item.dp_lien_chau_loi_phu": { "name": "Li\xEAn Ch\xE2u L\xF4i Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xEDm, m\u1EB7t kh\u1EAFc chu\u1ED7i h\u1EA1t s\u1EA5m n\u1ED1i nhau ch\xEDn v\xF2ng." }, "item.dp_toai_giap_phu": { "name": "To\xE1i Gi\xE1p Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB \u0111\u1ED3ng s\u1EE9t m\u1EBB, m\u1EABu ph\xF9 kh\u1EAFc s\xE2u nh\u01B0 v\u1EBFt \u0111\u1EE5c." }, "item.dp_nham_bich_phu": { "name": "Nham B\xEDch Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Phi\u1EBFn \u0111\xE1 m\u1ECFng kh\u1EAFc m\u1EABu ph\xF9 theo v\xE2n, n\u1EB7ng nh\u01B0 n\u1EEDa vi\xEAn g\u1EA1ch." }, "item.dp_sinh_co_phu": { "name": "Sinh C\u01A1 Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 c\u1ED5 m\u1ED9c ch\xE9p m\u1EABu ph\xF9, \u0111\u1EC3 ch\u1ED7 \u1EA9m th\xEC \u0111\xE2m ch\u1ED3i." }, "item.dp_thuy_don_phu": { "name": "Th\u1EE7y \u0110\u1ED9n Ph\xF9 ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ng\xE2m trong \u1ED1ng tr\xFAc \u0111\u1EA7y n\u01B0\u1EDBc, r\xFAt ra v\u1EABn kh\xF4." }, "item.dp_viem_vu_phu": { "name": "Vi\xEAm V\u0169 Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n \u0111\u1ECF \u1EA5m, nh\xECn l\xE2u th\u1EA5y l\u1EEDa l\u1EA5m t\u1EA5m r\u01A1i b\xEAn trong." }, "item.dp_cuong_phong_phu": { "name": "Cu\u1ED3ng Phong Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n bu\u1ED9c d\xE2y, th\u1EA3 tay l\xE0 n\xF3 t\u1EF1 xoay tr\xEAn b\xE0n." }, "item.dp_thien_nhan_phu": { "name": "Thi\xEAn Nh\u1EADn Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xECm th\u1EA5y trong m\u1ED9 ki\u1EBFm kh\xE1ch, c\u1EA7m l\xE2u r\u01B0\u1EDBm m\xE1u \u0111\u1EA7u ng\xF3n." }, "item.dp_khon_long_phu": { "name": "Kh\u1ED1n Long Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Phi\u1EBFn \u0111\xE1 x\xE1m kh\u1EAFc v\xF2ng x\xEDch ch\xEDn kh\xFAc, \u0111\u1EB7t xu\u1ED1ng l\xE0 d\xEDnh ch\u1EB7t m\u1EB7t b\xE0n." }, "item.dp_thanh_lien_phu": { "name": "Thanh Li\xEAn Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n h\xECnh c\xE1nh sen, \u0111\u1ECDc xong h\u01A1i th\u1EDF d\u1ECBu l\u1EA1i." }, "item.dp_loi_no_phu": { "name": "L\xF4i N\u1ED9 Ph\xF9 ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n s\xE9m \u0111en m\u1ED9t g\xF3c, ch\u1EA1m v\xE0o t\xF3c d\u1EF1ng ng\u01B0\u1EE3c." }, "item.dp_luu_tinh_phu": { "name": "L\u01B0u Tinh Ph\xF9 ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh thi\xEAn th\u1EA1ch m\xE0i ph\u1EB3ng, m\u1EABu ph\xF9 kh\u1EAFc nh\u01B0 v\u1EC7t sao b\u0103ng." }, "item.dp_tuyet_vuc_phu": { "name": "Tuy\u1EBFt V\u1EF1c Ph\xF9 ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ph\u1EE7 m\u1ED9t l\u1EDBp s\u01B0\u01A1ng kh\xF4ng bao gi\u1EDD tan." }, "item.dp_tam_muoi_hoa_phu": { "name": "Tam Mu\u1ED9i H\u1ECFa Ph\xF9 ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n \u0111\u1ECF r\u1EF1c, ph\u1EA3i b\u1ECDc v\u1EA3i m\u1EDBi c\u1EA7m \u0111\u01B0\u1EE3c." }, "item.dp_toa_tien_phu": { "name": "T\u1ECFa Ti\xEAn Ph\xF9 ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB \u0111\u1ED3ng chu\xF4ng c\u1ED5, l\u1EAFc nghe leng keng nh\u01B0 c\xF3 x\xEDch trong l\xF2ng." }, "item.dp_huyen_vu_phu": { "name": "Huy\u1EC1n V\u0169 Ph\xF9 ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh gi\xE1p \u0111en kh\u1EAFc r\xF9a r\u1EAFn qu\u1EA5n nhau, ph\xF9 s\u01B0 B\u1EAFc Minh gi\u1EEF trong mi\u1EBFu." }, "item.dp_hoan_sinh_phu": { "name": "Ho\xE0n Sinh Ph\xF9 ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh non, \u0111\u1EB7t l\xEAn c\u1ECF \xFAa th\xEC c\u1ECF t\u01B0\u01A1i l\u1EA1i." }, "item.dp_thai_hu_don_phu": { "name": "Th\xE1i H\u01B0 \u0110\u1ED9n Ph\xF9 ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\u1ECFng nh\u01B0 c\xE1nh ve, ph\u1EA3i \u0111eo v\xE0o c\u1ED5 k\u1EBBo gi\xF3 th\u1ED5i m\u1EA5t." }, "item.dp_tram_than_phu": { "name": "Tr\u1EA3m Th\u1EA7n Ph\xF9 ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n tr\u1EAFng ch\u1EC9 kh\u1EAFc m\u1ED9t \u0111\u01B0\u1EDDng th\u1EB3ng, nh\xECn l\xE2u m\u1EAFt cay nh\u01B0 b\u1ECB ki\u1EBFm ch\u1EC9 v\xE0o." }, "item.dp_cuu_thien_loi_phu": { "name": "C\u1EEDu Thi\xEAn L\xF4i Ph\xF9 ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xEDm th\u1EABm, \u0111\xEAm gi\xF4ng t\u1EF1 s\xE1ng ch\xEDn v\u1EC7t." }, "item.dp_diem_hai_phu": { "name": "Di\u1EC7m H\u1EA3i Ph\xF9 ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n n\xF3ng r\u1EABy trong h\u1ED9p h\xE0n ng\u1ECDc, m\u1EDF n\u1EAFp l\xE0 b\u1ED1c kh\xF3i." }, "item.dp_thuy_lao_phu": { "name": "Th\u1EE7y Lao Ph\xF9 ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Gi\u1ECDt n\u01B0\u1EDBc ng\u01B0ng th\xE0nh ng\u1ECDc, m\u1EABu ph\xF9 ch\xECm trong l\xF2ng gi\u1ECDt." }, "item.dp_thien_cuong_phu": { "name": "Thi\xEAn C\u01B0\u01A1ng Ph\xF9 ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m ng\xE0 kh\u1EAFc ba m\u01B0\u01A1i s\xE1u \u0111i\u1EC3m sao, \u1EA5n s\u01A1n m\xF4n m\u1ED9t \u0111\u1EA1i t\xF4ng \u0111\xE3 m\xE0i m\u1EDD." }, "item.dp_tao_hoa_phu": { "name": "T\u1EA1o H\xF3a Ph\xF9 ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh nh\u01B0 l\xE1 non, \u0111\u1EC3 trong t\xFAi l\xE2u ng\xE0y t\u1EF1 m\u1ECDc r\u1EC5 t\u01A1." }, "item.dia_tam_hoa": { "name": "\u0110\u1ECBa T\xE2m H\u1ECFa", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EEDa \u0111\u1ECF s\u1EABm m\xFAc t\u1EEB khe n\u1EE9t s\xE2u d\u01B0\u1EDBi l\xF2ng \u0111\u1EA5t, nh\u1ED1t trong b\xECnh \u0111\xE1. Ch\xE1y \u0111\u1EC1u, kh\xF4ng ng\u1EE3p kh\xF3i, l\xF2 n\xE0o c\u0169ng ch\u1ECBu." }, "item.cuu_u_minh_hoa": { "name": "C\u1EEDu U Minh H\u1ECFa", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDn l\u1EEDa xanh l\u1EA1nh nh\u01B0 n\u01B0\u1EDBc gi\u1EBFng, sinh n\u01A1i \xE2m kh\xED t\u1EE5 tr\u0103m n\u0103m. \u0110\u1ED1t li\u1EC7u kh\xF4ng ch\xE1y v\u1ECF m\xE0 ch\xEDn t\u1EADn l\xF5i." }, "item.tam_muoi_chan_hoa": { "name": "Tam Mu\u1ED9i Ch\xE2n H\u1ECFa", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u0110\u1ED1m l\u1EEDa tr\u1EAFng nh\u1ECF nh\u01B0 h\u1EA1t \u0111\u1EADu, \u0111\u1EB7t trong l\xF2 th\xEC c\u1EA3 l\xF2 im ph\u0103ng ph\u1EAFc. Truy\u1EC1n r\u1EB1ng sinh t\u1EEB t\xE2m h\u1ECFa c\u1EE7a m\u1ED9t y\xEAu v\u01B0\u01A1ng t\u1ECDa h\xF3a." }, "item.huyen_bang_diem": { "name": "Huy\u1EC1n B\u0103ng Di\u1EC5m", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EEDa m\xE0u lam tr\u1EAFng, ch\xE1y m\xE0 \u0111\xF3ng s\u01B0\u01A1ng quanh mi\u1EC7ng b\xECnh. Nung li\u1EC7u b\u0103ng h\xE0n kh\xF4ng l\xE0m n\xF3 tan, ch\u1EC9 l\xE0m n\xF3 ch\xEDn." }, "item.canh_kim_diem": { "name": "Canh Kim Di\u1EC5m", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDn l\u1EEDa tr\u1EAFng b\u1EA1c \xE1nh nh\u01B0 th\xE9p m\u1EDBi m\xE0i, m\xE9p l\u1EEDa s\u1EAFc nh\u01B0 l\u01B0\u1EE1i ki\u1EBFm. Qu\u1EB9t qua mi\u1EC7ng b\xECnh nghe keng m\u1ED9t ti\u1EBFng, s\u1EAFt th\xF4 v\xE0o l\xF2 ra kh\xF4ng c\xF2n m\u1ED9t v\u1EBFt r\u1ED7." }, "item.hau_tho_hoa": { "name": "H\u1EADu Th\u1ED5 H\u1ECFa", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EEDa v\xE0ng \u0111\u1EA5t \u0111\u1EB7c qu\xE1nh nh\u01B0 dung nham, n\u1EB7ng t\u1EDBi m\u1EE9c b\xECnh ng\u1ECDc ph\u1EA3i \xF4m b\u1EB1ng hai tay. Ch\xE1y ch\u1EADm m\xE0 kh\xF4ng bao gi\u1EDD t\u1EAFt, l\u1EEDa \u0111\u1EBFn \u0111\xE2u li\u1EC7u ch\u1EAFc l\u1EA1i \u0111\u1EBFn \u0111\xF3." }, "item.tu_loi_hoa": { "name": "T\u1EED L\xF4i H\u1ECFa", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EEDa t\xEDm sinh n\u01A1i s\xE9t \u0111\xE1nh xu\u1ED1ng \u0111\u1EA7m l\u1EA7y, ch\xE1y l\xE1ch t\xE1ch nh\u01B0 c\xF3 ng\xE0n tia \u0111i\u1EC7n nh\u1ECF. L\u1EEDa \u0111\u1EBFn \u0111\xE2u, t\u1EA1p ch\u1EA5t trong li\u1EC7u n\u1ED5 v\u1EE5n ra \u0111\u1EBFn \u0111\xF3." }, "item.cot_linh_lanh_hoa": { "name": "C\u1ED1t Linh L\xE3nh H\u1ECFa", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EEDa xanh l\u1EE5c b\u1ED1c l\xEAn t\u1EEB x\u01B0\u01A1ng c\u1ED1t t\xEDch \xE2m kh\xED tr\u0103m n\u0103m, ch\xE1y kh\xF4ng kh\xF3i, kh\xF4ng n\xF3ng. L\xF2 c\xF3 n\xF3 th\xEC luy\u1EC7n \u0111\xEAm n\xE0o c\u0169ng nghe ti\u1EBFng th\xEC th\u1EA7m." }, "item.cuong_phong_hoa": { "name": "C\u01B0\u01A1ng Phong H\u1ECFa", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EEDa xanh nh\u1EA1t xo\xE1y tr\xF2n nh\u01B0 c\u01A1n l\u1ED1c nh\u1ECF nh\u1ED1t trong b\xECnh, vang ti\u1EBFng gi\xF3 r\xEDt kh\xF4ng d\u1EE9t. Th\u1EA3 v\xE0o l\xF2, n\xF3 cu\u1ED1n li\u1EC7u quay \u0111\u1EC1u, l\u1EEDa ng\u1EA5m kh\u1EAFp m\u1ECDi m\u1EB7t." }, "item.thai_duong_chan_hoa": { "name": "Th\xE1i D\u01B0\u01A1ng Ch\xE2n H\u1ECFa", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EEDa v\xE0ng ch\xF3i nh\u01B0 m\u1EB7t tr\u1EDDi gi\u1EEFa tr\u01B0a, nh\u1ED1t trong b\xECnh \u0111\xE1 c\u0169ng l\xE0m b\xECnh \u0111\u1ECF r\u1EF1c. H\u1EA1n B\u1EA1t n\u1EB1m \u0111\xE2u l\xE0 v\xEC \u0111\xE3 nu\u1ED1t m\u1ED9t \u0111\u1ED1m l\u1EEDa n\xE0y." }, "item.niet_ban_phuong_hoa": { "name": "Ni\u1EBFt B\xE0n Ph\u01B0\u1EE3ng H\u1ECFa", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDn l\u1EEDa \u0111\u1ECF th\u1EAFm u\u1ED1n nh\u01B0 l\xF4ng ph\u01B0\u1EE3ng, t\u1EAFt r\u1ED3i t\u1EF1 b\xF9ng l\u1EA1i t\u1EEB tro. \u0110an ra t\u1EEB l\xF2 c\xF3 n\xF3 c\xF2n \u1EA5m su\u1ED1t ba ng\xE0y." }, "item.cuu_thien_huyen_bang_hoa": { "name": "C\u1EEDu Thi\xEAn Huy\u1EC1n B\u0103ng H\u1ECFa", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EEDa b\u0103ng r\u01A1i t\u1EEB t\u1EA7ng tr\u1EDDi th\u1EE9 ch\xEDn, T\xE0n B\u1EB1ng L\xE3o T\u1ED5 gi\u1EEF trong l\u1ED3ng ng\u1EF1c t\u1EEB tr\u1EADn \u0110o\u1EA1n Thi\xEAn. \u0110\u1EB7t v\xE0o l\xF2, l\xF2 k\u1EBFt b\u0103ng ngo\xE0i m\xE0 trong n\xF3ng nh\u01B0 l\xF2 r\xE8n." }, "item.moc_khoi_hach": { "name": "M\u1ED9c Kh\xF4i H\u1EA1ch", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF5i g\u1ED7 c\u1EE1 qu\u1EA3 \xF3c ch\xF3 kh\u1EAFc k\xEDn ph\xF9 v\u0103n, \u0111\u1EB7t trong h\u1ED1c b\u1EE5ng ng\u01B0\u1EDDi g\u1ED7. G\xF5 v\xE0o nghe r\u1ED7ng, \xE1p tai c\xF2n th\u1EA5y ti\u1EBFng t\xEDch t\u1EAFc." }, "item.dong_khoi_hach": { "name": "\u0110\u1ED3ng Kh\xF4i H\u1EA1ch", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Qu\u1EA3 c\u1EA7u \u0111\u1ED3ng xanh r\u1EC9, b\xEAn trong l\u1ED3ng ch\xEDn v\xF2ng xoay ng\u01B0\u1EE3c nhau. L\u1EA5y kh\u1ECFi x\xE1c kh\xF4i l\u1ED7i r\u1ED3i v\u1EABn c\xF2n quay ch\u1EADm th\xEAm m\u1EA5y ng\xE0y." }, "item.thi_khoi_hach": { "name": "Thi Kh\xF4i H\u1EA1ch", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Vi\xEAn l\xF5i \u0111en b\u1ECDc trong m\u1ED9t tr\xE1i tim kh\xF4, g\xE2n m\xE1u \u0111\xE3 h\xF3a s\u1EE3i s\u1EAFt. Ma t\xF4ng d\xF9ng n\xF3 \u0111\u1EC3 x\xE1c ch\u1EBFt nghe l\u1EC7nh." }, "item.co_khoi_tan_giap": { "name": "C\u1ED5 Kh\xF4i T\xE0n Gi\xE1p", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh gi\xE1p ng\u1EF1c c\u1EE7a kh\xF4i l\u1ED7i chi\u1EBFn tr\u1EADn th\u1EDDi \u0110o\u1EA1n Thi\xEAn, kim lo\u1EA1i kh\xF4ng r\xF5 t\xEAn, ba ngh\xECn n\u0103m kh\xF4ng g\u1EC9. M\u1EB7t trong kh\u1EAFc s\u1ED1 hi\u1EC7u \u0111\u1ED9i." }, "item.co_khoi_hach": { "name": "C\u1ED5 Kh\xF4i H\u1EA1ch", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF5i kh\xF4i l\u1ED7i th\u01B0\u1EE3ng c\u1ED5 to b\u1EB1ng n\u1EAFm tay, trong su\u1ED1t nh\u01B0 b\u0103ng, gi\u1EEFa c\xF3 m\u1ED9t tia s\xE9t nh\u1ECF b\u1ECB nh\u1ED1t. Th\u1EE3 kh\xF4i l\u1ED7i b\xE2y gi\u1EDD kh\xF4ng ai l\xE0m n\u1ED5i m\u1ED9t c\xE1i." }, "item.khoi_loi_do": { "name": "Kh\xF4i L\u1ED7i \u0110\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n gi\u1EA5y da v\u1EBD ng\u01B0\u1EDDi g\u1ED7 th\xE1o r\u1EDDi t\u1EEBng kh\u1EDBp, ch\xFA th\xEDch chi ch\xEDt b\u1EB1ng ch\u1EEF nh\u1ECF. M\xE9p cu\u1ED9n c\xF2n v\u1EBFt d\u1EA7u tay c\u1EE7a ng\u01B0\u1EDDi v\u1EBD." }, "item.thien_co_khoi_pho": { "name": "Thi\xEAn C\u01A1 Kh\xF4i Ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": 'S\xE1ch kh\xF4i l\u1ED7i b\xECa \u0111\u1ED3ng, ghi c\xE1ch \u0111\xFAc ng\u01B0\u1EDDi \u0111\u1ED3ng v\xE0 n\u1ED1i ch\xEDn v\xF2ng l\xF5i. Trang cu\u1ED1i b\u1ECB x\xE9, ch\u1EC9 c\xF2n ch\u1EEF "Thi".' }, "item.thu_hoan": { "name": "Th\xFA Ho\xE0n", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "V\xF2ng s\u1EAFt kh\u1EAFc ph\xF9 \u0111eo v\xE0o c\u1ED5 y\xEAu th\xFA, ch\u1EE7 ni\u1EC7m ch\xFA th\xEC v\xF2ng si\u1EBFt l\u1EA1i. Tr\xEAn v\xF2ng c\xF2n s\xF3t l\xF4ng s\xF3i \u0111\u1ECF." }, "item.ngu_thu_lenh": { "name": "Ng\u1EF1 Th\xFA L\u1EC7nh", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 mun kh\u1EAFc \u0111\u1EA7u th\xFA, th\u1ED5i v\xE0o l\u1ED7 \u1EDF chu\xF4i ra ti\u1EBFng tai ng\u01B0\u1EDDi kh\xF4ng nghe \u0111\u01B0\u1EE3c. Y\xEAu th\xFA \u0111\xE3 \u0111eo Th\xFA Ho\xE0n nghe ti\u1EBFng l\xE0 quay v\u1EC1." }, "item.co_trung_mau": { "name": "C\u1ED5 Tr\xF9ng M\u1EABu", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Con c\u1ED5 m\u1EB9 ng\u1EE7 trong \u1ED1ng tre b\u1ECBt s\xE1p, nu\xF4i b\u1EB1ng m\xE1u th\xEC \u0111\u1EBB ra c\u1ED5 con. B\xF3p nh\u1EB9 \u1ED1ng c\xF2n nghe n\xF3 c\u1EF1a." }, "item.luyen_thi_phu": { "name": "Luy\u1EC7n Thi Ph\xF9", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ph\xF9 v\xE0ng vi\u1EBFt b\u1EB1ng m\u1EF1c tr\u1ED9n m\xE1u, d\xE1n l\xEAn tr\xE1n x\xE1c l\xE0 x\xE1c \u0111\u1EE9ng d\u1EADy theo l\u1EC7nh. B\xF3c ra th\xEC x\xE1c \u0111\u1ED5, ph\xF9 ch\xE1y \u0111en m\u1ED9t g\xF3c." }, "item.khi_lo_pham": { "name": "Th\u1EA1ch \u0111\u1EC9nh", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u0110\u1EC9nh \u0111\xE1 ong nh\u1ECF, k\xE8m c\xE1i b\u1EC5 da tr\xE2u g\u1EA5p \u0111\u01B0\u1EE3c. Nung \u0111\u01B0\u1EE3c t\u1EDBi Ho\xE0ng ph\u1EA9m, qu\xE1 l\u1EEDa th\xEC \u0111\xE1 n\u1ED5 l\xE1ch t\xE1ch." }, "item.khi_lo_hoang": { "name": "Thi\u1EBFt \u0111\u1EC9nh", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u0110\u1EC9nh gang \u0111\xFAc li\u1EC1n kh\u1ED1i, l\xF2ng \u0111\u1EC9nh s\xE2u nh\u01B0 c\xE1i gi\u1EBFng. Luy\u1EC7n kh\xED s\u01B0 ph\u01B0\u1EDDng th\u1ECB hay v\xE1c theo, ch\u1ECBu \u0111\u01B0\u1EE3c l\u1EEDa Huy\u1EC1n ph\u1EA9m." }, "item.khi_lo_huyen": { "name": "X\xEDch Di\u1EC5m \u0111\u1EC9nh", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u0110\u1EC9nh \u0111\u1ED3ng \u0111\u1ECF kh\u1EAFc tr\u1EADn d\u1EABn h\u1ECFa, \u0111\u1EB7t xu\u1ED1ng \u0111\u1EA5t l\xE0 t\u1EF1 h\xFAt \u0111\u1ECBa kh\xED l\xE0m l\u1EEDa. Nung \u0111\u01B0\u1EE3c ph\xF4i \u0110\u1ECBa ph\u1EA9m." }, "item.khi_lo_dia": { "name": "\u0110\u1ECBa M\u1EA1ch \u0111\u1EC9nh", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u0110\u1EC9nh \u0111\u1ED3ng \u0111en to b\u1EB1ng chum, th\xE2n kh\u1EAFc c\u1EA3 m\u1ED9t b\u1EE9c \u0111\u1ECBa m\u1EA1ch \u0111\u1ED3. L\u1EEDa trong \u0111\u1EC9nh n\u1ED1i v\u1EDBi m\u1EA1ch \u0111\u1EA5t d\u01B0\u1EDBi ch\xE2n, Thi\xEAn ph\u1EA9m c\u0169ng nung \u0111\u01B0\u1EE3c." }, "item.khi_lo_thien": { "name": "C\u1EEDu Di\u1EC7u \u0111\u1EC9nh", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u0110\u1EC9nh c\u1ED5 ba ch\xE2n \u0111\xE0o l\xEAn t\u1EEB c\xE1t, quanh b\u1EE5ng kh\u1EA3m ch\xEDn vi\xEAn \u0111\xE1 sao. \u0110\u1ED1t l\u1EEDa th\xEC ch\xEDn \u0111\u1ED1m s\xE1ng l\u1EA7n l\u01B0\u1EE3t b\u1EEBng l\xEAn, l\u1EEDa Ti\xEAn ph\u1EA9m c\u0169ng ch\u1ECBu \u0111\u01B0\u1EE3c." }, "item.khi_lo_tien": { "name": "Th\xE1i S\u01A1 \u0111\u1EC9nh", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u0110\u1EC9nh \u0111\xFAc th\u1EDDi Ng\u0169 T\u1ED5, men xanh \u0111\xE3 h\xF3a ng\u1ECDc. L\u1EEDa trong \u0111\u1EC9nh kh\xF4ng c\u1EA7n c\u1EE7i, t\u1EF1 ch\xE1y b\u1EB1ng linh kh\xED tr\u1EDDi \u0111\u1EA5t, nung \u0111\u01B0\u1EE3c c\u1EA3 Th\u1EA7n ph\u1EA9m." }, "item.dp_thiet_kiem": { "name": "Thi\u1EBFt Ki\u1EBFm \u0111\u1ED3 ph\u1ED5", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m v\xE1n g\u1ED7 kh\u1EAFc h\xECnh thanh ki\u1EBFm v\xE0 m\u1EA5y d\xF2ng d\u1EB7n c\xE1ch quai b\xFAa. \u0110\u1ECDc xong l\xE0 v\xE0o ngh\u1EC1 luy\u1EC7n b\u1EA3o." }, "item.dp_thanh_phong_kiem": { "name": "Thanh Phong Ki\u1EBFm \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Gi\u1EA5y d\u1EA7u v\u1EBD thanh ki\u1EBFm m\u1EA3nh, ghi s\u1ED1 l\u1EA7n nung v\xE0 m\xE0u l\u1EEDa t\u1EEBng l\u1EA7n." }, "item.dp_han_thiet_dao": { "name": "H\xE0n Thi\u1EBFt \u0110ao \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD \u0111ao ch\xE9p tr\xEAn da thu\u1ED9c, g\xF3c c\xF2n d\xEDnh v\u1EBFt n\u01B0\u1EDBc tuy\u1EBFt kh\xF4." }, "item.dp_lang_nha_chuy": { "name": "Lang Nha Ch\u1EE7y \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tre bu\u1ED9c d\xE2y \u0111\u1ECF c\u1EE7a th\u1EE3 r\xE8n quan \u1EA3i, \u0111\xF3ng d\u1EA5u m\u1ED9t \u0111\u1ED3n bi\xEAn L\u01B0\u01A1ng Qu\u1ED1c." }, "item.dp_yeu_bi_giap": { "name": "Y\xEAu B\xEC Gi\xE1p \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y gai v\u1EBD c\xE1ch c\u1EAFt da v\xE0 kh\xE2u m\xE9p, ch\u1EEF ngh\u1EC7ch ngo\u1EA1c c\u1EE7a th\u1EE3 thu\u1ED9c da." }, "item.dp_chu_ty_vong": { "name": "Chu Ty V\xF5ng \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh l\u1EE5a v\u1EBD c\xE1ch \u0111an l\u01B0\u1EDBi theo h\xECnh m\u1EA1ng nh\u1EC7n, m\u1ED7i n\xFAt c\xF3 ghi s\u1ED1." }, "item.dp_huyen_quy_thuan": { "name": "Huy\u1EC1n Quy Thu\u1EABn \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD tr\u1EADn v\u0103n kh\u1EAFc tr\xEAn mai r\xF9a, k\xE8m c\xE1ch \u0111\u1ECDc v\xE2n n\u1EE9t s\u1EB5n c\xF3." }, "item.dp_thanh_suong_kiem": { "name": "Thanh S\u01B0\u01A1ng Ki\u1EBFm \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ch\xE9p l\u1EA1i c\xE1ch g\u1EA5p th\xE9p ch\xEDn l\u1EA7n c\u1EE7a ki\u1EBFm Thanh V\xE2n. Ng\u01B0\u1EDDi Thanh V\xE2n m\xE0 th\u1EA5y th\xEC kh\xF4ng vui." }, "item.dp_ho_vi_phat": { "name": "H\u1ED3 V\u0129 Ph\u1EA5t \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n th\u01A1m m\xF9i tr\u1EA7m, c\u1EA7m l\xE2u th\u1EA5y l\xE2ng l\xE2ng." }, "item.dp_giao_can_cung": { "name": "Giao C\xE2n Cung \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n l\u1EA1nh tay, v\u1EBD c\xE1ch c\u0103ng g\xE2n giao khi l\xF2 c\xF2n n\xF3ng." }, "item.dp_bach_hac_vu_y": { "name": "B\u1EA1ch H\u1EA1c V\u0169 Y \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n tr\u1EAFng, k\u1EB9p trong \u0111\xF3 m\u1ED9t chi\u1EBFc l\xF4ng h\u1EA1c \u0111\xE3 ng\u1EA3 v\xE0ng." }, "item.dp_tuyet_bang_kiem": { "name": "Tuy\u1EBFt B\u1EB1ng Ki\u1EBFm \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ph\u1EE7 m\u1ED9t l\u1EDBp s\u01B0\u01A1ng m\u1ECFng kh\xF4ng bao gi\u1EDD kh\xF4, v\u1EBD thanh ki\u1EBFm c\xF3 c\xE1nh." }, "item.dp_ho_cot_dao": { "name": "H\u1ED5 C\u1ED1t \u0110ao \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n kh\u1EAFc v\u1EB1n h\u1ED5, ch\xE9p c\xE1ch l\u1ED3ng x\u01B0\u01A1ng v\xE0o s\u1ED1ng \u0111ao." }, "item.dp_tu_kim_phi_kiem": { "name": "T\u1EED Kim Phi Ki\u1EBFm \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\xE0u t\xEDm, ghi c\xE1ch huy\u1EBFt luy\u1EC7n t\u1EED kim. Ki\u1EBFm tu Tr\xFAc C\u01A1 tr\u1EA3 gi\xE1 cao cho m\u1ED9t b\u1EA3n ch\xE9p." }, "item.dp_giao_lan_giap": { "name": "Giao L\xE2n Gi\xE1p \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh th\u1EABm v\u1EBD t\u1EEBng l\u1EDBp v\u1EA3y ch\u1ED3ng nhau, l\u1EDBp n\xE0o nung m\u1EA5y ng\xE0y ghi r\xF5." }, "item.dp_thuong_lan_kiem": { "name": "Th\u01B0\u01A1ng Lan Ki\u1EBFm c\u1ED5 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da d\xEA ng\u1EA3 m\xE0u, b\u1EA3n v\u1EBD c\u1EE7a m\u1ED9t l\xF2 r\xE8n th\u1EDDi c\xF2n Trung Ch\xE2u. M\xE9p da c\xF3 v\u1EBFt mu\u1ED1i bi\u1EC3n kh\xF4." }, "item.dp_van_yeu_phien": { "name": "V\u1EA1n Y\xEAu Phi\xEAn c\u1ED5 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n l\u1EE5a \u0111en ch\xE9p t\u1EEB h\u1EA7m \u0111\xE1 m\u1ED9t t\xF4ng \u0111\xE3 tan. M\u1EDF ra nghe nh\u01B0 c\xF3 ti\u1EBFng th\xFA g\u1EA7m r\u1EA5t xa." }, "item.dp_phuoc_tien_tac": { "name": "Ph\u01B0\u1EE3c Ti\xEAn T\xE1c \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m l\u1EE5a tr\u1EAFng d\xEDnh trong \u1ED5 nh\u1EC7n, ch\xE9p c\xE1ch b\u1EC7n t\u01A1 ch\xEDn s\u1EE3i. N\xE9t ch\u1EEF ng\u01B0\u1EDDi vi\u1EBFt run run, nh\u01B0 \u0111ang b\u1ECB treo ng\u01B0\u1EE3c." }, "item.dp_pha_giap_toan": { "name": "Ph\xE1 Gi\xE1p To\u1EA3n \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB \u0111\u1ED3ng chu\u1ED9t y\xEAu tha t\u1EEB m\u1ED9t m\u1ED9 c\u1ED5 v\u1EC1 hang, m\xE9p b\u1ECB g\u1EB7m nham nh\u1EDF. M\u1EB7t th\u1EBB kh\u1EAFc h\xECnh m\u0169i khoan v\xE0 c\xE1ch kh\u1EA3m r\u0103ng." }, "item.dp_giao_le_chau_lien": { "name": "Giao L\u1EC7 Ch\xE2u Li\xEAn \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "V\u1ECF \u1ED1c l\u1EDBn, \xE1p v\xE0o tai nghe gi\u1ECDng ng\u01B0\u1EDDi c\xE1 \u0111\u1ECDc c\xE1ch x\xE2u chu\u1ED7i ng\u1ECDc l\u1EC7." }, "item.dp_thong_ty_kim_con": { "name": "Th\xF4ng T\xFD Kim C\xF4n \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "V\u01B0\u1EE3n gi\xE0 ch\xE9p l\u1EA1i b\u1EA3n v\u1EBD c\u1EE7a th\u1EE3 r\xE8n tr\xEAn v\xE1ch \u0111\xE1, n\xE9t b\u1EAFt ch\u01B0\u1EDBc v\u1EE5ng m\xE0 \u0111\u1EE7. C\xF3 c\u1EA3 ch\u1EEF k\xFD ng\u01B0\u1EDDi th\u1EE3, ch\xE9p ng\u01B0\u1EE3c." }, "item.dp_huyen_vu_thuan": { "name": "Huy\u1EC1n V\u0169 Thu\u1EABn \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh mai r\xF9a kh\u1EAFc chi ch\xEDt ch\u1EEF c\u1ED5 th\u1EDDi Trung Ch\xE2u, \u0111\u1ECDc theo v\xE2n n\u1EE9t m\u1EDBi ra c\xE2u." }, "item.dp_liet_ho_dao": { "name": "Li\u1EC7t H\u1ED5 \u0110ao \u0111\u1ED3 ph\u1ED5", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da h\u1ED5 thu\u1ED9c, m\u1EB7t trong v\u1EBD thanh \u0111ao b\u1EB1ng m\xE1u kh\xF4. H\u1ED5 t\u1ED9c treo n\xF3 trong hang nh\u01B0 chi\u1EBFn l\u1EE3i ph\u1EA9m c\u1EE7a k\u1EBB r\xE8n \u0111\xE3 ch\u1EBFt." }, "item.dp_hoa_long_truong": { "name": "H\xF3a Long Tr\u01B0\u1EE3ng c\u1ED5 ph\u1ED5", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m v\u1EA3y giao l\u1EDBn b\u1EB1ng m\u1EB7t b\xE0n, ch\u1EEF kh\u1EAFc m\u1ECDc theo v\xE2n v\u1EA3y. Ng\xE2m trong n\u01B0\u1EDBc th\xEC ch\u1EEF ph\xE1t s\xE1ng." }, "item.dp_hat_vi_tien": { "name": "H\u1EA1t V\u0129 Ti\xEAn \u0111\u1ED3 ph\u1ED5", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB ng\u1ECDc v\xE0ng \u0111\u1EE5c l\u1EA5y t\u1EEB ph\u1EBF t\xEDch d\u01B0\u1EDBi c\xE1t, m\u1EB7t ng\u1ECDc l\u1ED1m \u0111\u1ED1m v\u1EBFt \u0111\u1ED9c \u0103n." }, "item.dp_thien_bang_cung": { "name": "Thi\xEAn B\u1EB1ng Cung \u0111\u1ED3 ph\u1ED5", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n b\u0103ng c\u1EE7a Tuy\u1EBFt B\u1EB1ng t\u1ED9c, kh\u1EAFc c\xE2y cung c\u1EE7a m\u1ED9t b\u1EB1ng v\u01B0\u01A1ng ch\u1EBFt tr\u1EADn \u0110o\u1EA1n Thi\xEAn. C\u1EA7m l\xE2u bu\u1ED1t t\u1EDBi khu\u1EF7u tay." }, "item.dp_cuu_vi_huyen_dang": { "name": "C\u1EEDu V\u0129 Huy\u1EC5n \u0110\u0103ng \u0111\u1ED3 ph\u1ED5", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Qu\u1EA1t l\u1EE5a h\u1ED3ng, m\u1EDF ra th\u1EA5y b\u1EA3n v\u1EBD c\xE2y \u0111\xE8n ch\xEDn \u0111u\xF4i. G\u1EA5p l\u1EA1i th\xEC qu\u1EA1t th\u01A1m nh\u01B0 ng\u01B0\u1EDDi v\u1EEBa c\u1EA7m." }, "item.dp_dan_lo_dia": { "name": "\u0110\u1ECBa H\u1ECFa \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD m\u1EB7t c\u1EAFt m\u1ED9t c\xE1i l\xF2, r\xE3nh d\u1EABn l\u1EEDa d\u01B0\u1EDBi \u0111\xE1y t\xF4 son \u0111\u1ECF. G\xF3c gi\u1EA3n kh\u1EAFc d\u1EA5u m\u1ED9t hi\u1EC7u l\xF2 r\xE8n \u1EDF kinh \u0111\xF4." }, "item.dp_phu_but_dia": { "name": "T\u1EED Ng\u1ECDc Ph\xF9 B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc d\xE0i, ghi c\xE1ch kho\xE9t c\xE1n ng\u1ECDc v\xE0 bu\u1ED9c ng\xF2i. M\u1EB7t sau c\xF3 d\xF2ng ch\u1EEF nh\u1ECF d\u1EB7n ng\xF2i ph\u1EA3i l\xE0 r\xE2u h\u1ED5 y\xEAu." }, "item.dp_dan_lo_thien": { "name": "C\u1EEDu Long \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n l\u1EE5a v\xE0ng c\xF3 \u1EA5n kh\xED ph\xF2ng s\u01A1n m\xF4n, v\u1EBD ch\xEDn con r\u1ED3ng qu\u1EA5n l\xF2, con n\xE0o ng\u1EADm l\u1EEDa \u1EDF \u0111\xE2u ghi r\xF5 t\u1EEBng ch\u1ED7." }, "item.dp_phu_but_thien": { "name": "B\u1ED3 \u0110\u1EC1 Ph\xF9 B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n c\xF3 \u1EA5n kh\xED ph\xF2ng s\u01A1n m\xF4n, ch\xE9p c\xE1ch d\xF9ng x\u01B0\u01A1ng h\u1EA1c ti\xEAn l\xE0m c\xE1n. L\u1EDDi d\u1EB7n cu\u1ED1i gi\u1EA3n vi\u1EBFt \u0111\u1EADm h\u01A1n c\u1EA3." }, "item.dp_dan_lo_tien": { "name": "Th\xE1i Th\u01B0\u1EE3ng \u0111an l\xF4 c\u1ED5 ph\u1ED5", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD kh\u1EAFc tr\xEAn t\u1EA5m \u0111\u1ED3ng xanh, n\xE9t kh\u1EAFc th\u1EDDi Ng\u0169 T\u1ED5. L\xF2 trong h\xECnh kh\xF4ng c\xF3 c\u1EEDa l\u1EEDa." }, "item.dp_phu_but_tien": { "name": "L\xF4i M\u1ED9c Ph\xF9 B\xFAt c\u1ED5 ph\u1ED5", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh g\u1ED7 ch\xE1y s\xE9m kh\u1EAFc ch\u1EEF, s\u1EDD v\xE0o t\xEA \u0111\u1EA7u ng\xF3n tay. Ch\xE9p c\xE1ch l\u1EA5y g\u1ED7 b\u1ECB s\xE9t \u0111\xE1nh l\xE0m c\xE1n b\xFAt." }, "item.dp_khi_lo_pham": { "name": "Th\u1EA1ch \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y b\u1EA3n v\u1EBD c\xE1i \u0111\u1EC9nh \u0111\xE1 c\xF3 \u0111ai s\u1EAFt, th\u1EE3 \u0111\xE1 n\xE0o c\u0169ng \u0111\u1ECDc \u0111\u01B0\u1EE3c." }, "item.dp_khi_lo_hoang": { "name": "Thi\u1EBFt \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 ghi t\u1EC9 l\u1EC7 pha gang v\u1EDBi h\xE0n thi\u1EBFt, m\xE9p th\u1EBB ch\xE1y x\xE9m v\xEC treo c\u1EA1nh l\xF2." }, "item.dp_khi_lo_huyen": { "name": "X\xEDch Di\u1EC5m \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n \u0111\u1ECF v\u1EBD tr\u1EADn d\u1EABn h\u1ECFa kh\u1EAFc quanh b\u1EE5ng \u0111\u1EC9nh, n\xE9t n\xE0o n\u1ED1i v\u1EDBi n\xE9t n\xE0o ghi s\u1ED1 r\xF5 r\xE0ng." }, "item.dp_khi_lo_dia": { "name": "\u0110\u1ECBa M\u1EA1ch \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n da v\u1EBD m\u1ED9t b\u1EE9c \u0111\u1ECBa m\u1EA1ch \u0111\u1ED3 thu nh\u1ECF, b\xEAn l\u1EC1 ch\xE9p c\xE1ch kh\u1EAFc n\xF3 l\xEAn th\xE2n \u0111\u1EC9nh." }, "item.dp_khi_lo_thien": { "name": "C\u1EEDu Di\u1EC7u \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n c\xF3 \u1EA5n kh\xED ph\xF2ng s\u01A1n m\xF4n, v\u1EBD ch\xEDn v\xEC sao quanh b\u1EE5ng \u0111\u1EC9nh, sao n\xE0o kh\u1EA3m tr\u01B0\u1EDBc ghi r\xF5." }, "item.dp_khi_lo_tien": { "name": "Th\xE1i S\u01A1 \u0111\u1EC9nh c\u1ED5 ph\u1ED5", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD kh\u1EAFc tr\xEAn t\u1EA5m \u0111\u1ED3ng xanh c\xF9ng b\u1ED9 v\u1EDBi c\u1ED5 ph\u1ED5 \u0111an l\xF4, n\xE9t kh\u1EAFc th\u1EDDi Ng\u0169 T\u1ED5. \u0110\u1EC9nh trong h\xECnh kh\xF4ng c\xF3 ch\u1ED7 \u0111\u1EB7t c\u1EE7i." }, "item.dp_dan_lo_dat": { "name": "\u0110an l\xF4 \u0111\u1EA5t nung \u0111\u1ED3 ph\u1ED5", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y d\u1EA7u c\u1EE7a th\u1EE3 g\u1ED1m, v\u1EBD c\xE1i l\xF2 \u0111\u1EA5t c\xF3 \u0111ai s\u1EAFt quanh mi\u1EC7ng cho kh\u1ECFi n\u1EE9t." }, "item.dp_dan_lo_dong": { "name": "\u0110\u1ED3ng \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc v\u1EBD l\xF2 ba ch\xE2n, ghi ch\u1ED7 kh\u1EAFc v\xE2n m\xE2y \u0111\u1EC3 kh\xF3i \u0111an tho\xE1t \u0111\u1EC1u." }, "item.dp_dan_lo_huyen": { "name": "T\u1EED V\u0103n \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xEDm ch\xE9p tr\u1EADn v\u0103n gi\u1EEF nhi\u1EC7t tr\xEAn th\xE0nh l\xF2, k\xE8m l\u1EDDi d\u1EB7n kh\u1EAFc l\xFAc \u0111\u1ED3ng c\xF2n \u1EA5m." }, "item.dp_phu_but_pham": { "name": "Tr\xFAc H\xE0o B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh gi\u1EA5y \xF4ng t\u1EEB ch\xE9p c\xE1ch b\u1ECBt \u0111\u1EA7u c\xE1n tr\xFAc b\u1EB1ng s\u1EAFt cho ng\xF2i kh\u1ECFi tu\u1ED9t." }, "item.dp_phu_but_hoang": { "name": "Lang H\xE0o B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 ghi c\xE1ch ch\u1ECDn r\xE2u y\xEAu th\xFA l\xE0m ng\xF2i, s\u1EE3i n\xE0o c\u1EE9ng gi\u1EEF, s\u1EE3i n\xE0o m\u1EC1m b\u1ECF." }, "item.dp_phu_but_huyen": { "name": "H\u1EA1c V\u0169 Ph\xF9 B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh v\u1EBD c\xE1ch k\u1EBFt l\xF4ng c\xE1nh h\u1EA1c th\xE0nh ng\xF2i, x\u01B0\u01A1ng h\u1EA1c l\xE0m c\xE1n." }, "item.dp_tran_but_pham": { "name": "Thi\u1EBFt Kh\u1EAFc B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh gi\u1EA5y th\u1EE3 r\xE8n v\u1EBD c\xE2y d\xF9i s\u1EAFt, ghi ch\u1ED7 qu\u1EA5n d\xE2y cho kh\u1ECFi tr\u01A1n tay." }, "item.dp_tran_but_hoang": { "name": "H\xE0n Thi\u1EBFt Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 ghi c\xE1ch t\xF4i m\u0169i b\xFAt h\xE0n thi\u1EBFt, n\u01B0\u1EDBc t\xF4i ph\u1EA3i l\u1EA5y t\u1EEB gi\u1EBFng s\xE2u." }, "item.dp_tran_but_huyen": { "name": "Thanh Ng\u1ECDc Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh v\u1EBD c\xE1ch b\u1ECDc m\u0169i \u0111\u1ED3ng v\xE0o c\xE1n ng\u1ECDc." }, "item.dp_tran_but_dia": { "name": "T\u1EED Kim Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc d\xE0i ghi c\xE1ch \u0111\xFAc t\u1EED kim li\u1EC1n kh\u1ED1i, m\u1EB7t sau d\u1EB7n m\u0169i b\xFAt ph\u1EA3i m\xE0i ba ng\xE0y." }, "item.dp_tran_but_thien": { "name": "Th\u1EA5t Tinh Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n c\xF3 \u1EA5n kh\xED ph\xF2ng s\u01A1n m\xF4n, v\u1EBD b\u1EA3y \u0111i\u1EC3m sao tr\xEAn th\xE2n b\xFAt, sao n\xE0o kh\u1EA3m tr\u01B0\u1EDBc ghi r\xF5." }, "item.dp_tran_but_tien": { "name": "Huy\u1EC1n C\u01A1 Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD kh\u1EAFc tr\xEAn t\u1EA5m \u0111\u1ED3ng xanh c\xF9ng b\u1ED9 v\u1EDBi c\u1ED5 ph\u1ED5 l\xF2 \u0111\u1EC9nh, n\xE9t kh\u1EAFc th\u1EDDi Ng\u0169 T\u1ED5. B\xFAt trong h\xECnh kh\xF4ng c\xF3 m\u0169i." }, "item.dp_pha_giap_toan_giac": { "name": "Ph\xE1 Gi\xE1p To\u1EA3n \u0111\u1ED3 ph\u1ED5 (kim gi\xE1c)", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD tr\xEAn da tr\xE2u, m\u0169i khoan v\u1EBD to b\u1EB1ng th\u1EADt." }, "item.dp_linh_lung_thap_nha": { "name": "Linh Lung Tr\u1EA5n Nh\u1EA1c Th\xE1p \u0111\u1ED3 ph\u1ED5 (c\u1EF1 t\u01B0\u1EE3ng nha)", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD th\xE1p b\u1EA3y t\u1EA7ng tr\xEAn t\u1EA5m ng\xE0 m\u1ECFng, n\xE9t kh\u1EAFc nh\u1ECF nh\u01B0 s\u1EE3i t\xF3c." }, "item.dp_linh_lung_thap_quy": { "name": "Linh Lung Tr\u1EA5n Nh\u1EA1c Th\xE1p \u0111\u1ED3 ph\u1ED5 (b\u1ED1i s\u01A1n quy gi\xE1p)", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m \u0111\xE1 m\u1ECFng kh\u1EAFc th\xE1p ng\u1ED3i tr\xEAn l\u01B0ng r\xF9a, r\xEAu c\xF2n b\xE1m k\u1EBD ch\u1EEF." }, "item.dp_than_hanh_ngoa_bao": { "name": "Th\u1EA7n H\xE0nh Ngoa \u0111\u1ED3 ph\u1ED5 (da b\xE1o)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EABu gi\xE0y v\u1EBD tr\xEAn gi\u1EA5y d\u1EA7u, ghi ch\u1ED7 kh\xE2u t\u1EEBng \u0111\u01B0\u1EDDng." }, "item.dp_phu_but_thien_bao": { "name": "B\u1ED3 \u0110\u1EC1 Ph\xF9 B\xFAt \u0111\u1ED3 ph\u1ED5 (l\xF4i v\u0103n b\xE1o b\xEC)", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xEDm, k\u1EB9p trong \u0111\xF3 m\u1ED9t s\u1EE3i l\xF4ng v\u1EB1n." }, "item.dp_van_doc_phien": { "name": "V\u1EA1n \u0110\u1ED9c Phi\xEAn \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n v\u1EA3i \u0111en th\xEAu tr\u0103m lo\xE0i \u0111\u1ED9c tr\xF9ng, m\xE9p v\u1EA3i \u0111\xE3 m\u1EE5c." }, "item.dp_quy_giap_thuan_ngac": { "name": "Quy Gi\xE1p Thu\u1EABn \u0111\u1ED3 ph\u1ED5 (v\u1EA3y c\xE1 s\u1EA5u)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD thu\u1EABn tr\xEAn gi\u1EA5y th\xF4, ghi ch\u1ED7 khoan l\u1ED7 quai." }, "item.dp_khi_lo_dia_du": { "name": "\u0110\u1ECBa M\u1EA1ch \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5 (k\xECnh du)", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n th\u1EA5m d\u1EA7u, c\u1EA7m tr\u01A1n tay, v\u1EBD m\u1EB7t c\u1EAFt m\u1ED9t c\xE1i \u0111\u1EC9nh." }, "item.dp_huyen_vu_thuan_ngac": { "name": "Huy\u1EC1n V\u0169 Thu\u1EABn \u0111\u1ED3 ph\u1ED5 (huy\u1EC1n ng\u1EA1c gi\xE1p)", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD tr\xEAn l\u1EE5a \u0111en, n\xE9t v\u1EBD b\u1EB1ng m\u1EF1c b\u1EA1c." }, "item.dp_phu_but_hoang_tho": { "name": "Ph\xF9 b\xFAt \u0111\u1ED3 ph\u1ED5 (l\xF4ng th\u1ECF ng\u1ECDc)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 ghi c\xE1ch ch\u1ECDn l\xF4ng th\u1ECF, s\u1EE3i n\xE0o t\u1EF1 s\xE1ng th\xEC gi\u1EEF." }, "item.dp_bich_ba_linh_tan": { "name": "B\xEDch Ba Linh T\xE1n \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD l\u1EE5a xanh v\u1EBD chi\u1EBFc \xF4, ch\xF3p \xF4 d\xE1n m\u1ED9t m\u1EA3nh v\u1EA3y c\xE1." }, "item.dp_luu_van_chu": { "name": "L\u01B0u V\xE2n Chu \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD thuy\u1EC1n bay tr\xEAn l\u1EE5a, m\u0169i thuy\u1EC1n v\u1EBD m\u1ED9t s\u1EE3i l\xF4ng xanh." }, "item.dp_tu_kim_phi_kiem_nha": { "name": "T\u1EED Kim Phi Ki\u1EBFm \u0111\u1ED3 ph\u1ED5 (th\u1EF1c thi\u1EBFt nha)", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD ki\u1EBFm tr\xEAn da, m\xE9p da c\xF3 v\u1EBFt r\u0103ng g\u1EB7m." }, "item.dp_moc_dang_tac": { "name": "M\u1ED9c \u0110\u1EB1ng T\xE1c \u0111\u1ED3 ph\u1ED5", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc ghi c\xE1ch b\u1EC7n ba s\u1EE3i, k\xE8m m\u1ED9t kh\xFAc d\xE2y m\u1EABu." }, "item.dp_bich_lan_doc_cham": { "name": "B\xEDch L\xE2n \u0110\u1ED9c Ch\xE2m \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc xanh, ch\u1EEF vi\u1EBFt nh\u1ECF, cu\u1ED1i th\u1EBB d\u1EB7n \u0111\u1EEBng li\u1EBFm ng\xF3n tay." }, "item.dp_nhiep_hon_linh": { "name": "Nhi\u1EBFp H\u1ED3n Linh \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD chu\xF4ng nh\u1ECF tr\xEAn gi\u1EA5y v\xE0ng, n\xE9t m\u1EF1c x\xE1m nh\u01B0 tro." }, "item.dp_thanh_moc_thuan": { "name": "Thanh M\u1ED9c Thu\u1EABn \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 c\xF2n v\xE2n xo\xE1y, \u0111\u1EC3 ch\u1ED7 \u1EA9m th\xEC m\u1ECDc r\u1EC5 t\u01A1." }, "item.dp_phu_tang_than_moc": { "name": "Ph\xF9 Tang Th\u1EA7n M\u1ED9c \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xE1 ng\xF4 \u0111\u1ED3ng \xE9p kh\xF4, g\xE2n l\xE1 kh\u1EAFc ch\u1EEF." }, "item.dp_hau_tho_thuan_tuy": { "name": "H\u1EADu Th\u1ED5 Thu\u1EABn \u0111\u1ED3 ph\u1ED5 (th\u1EA1ch t\u1EE7y)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh g\u1ED1m v\u1EBD khi\xEAn \u0111\xE1, g\xF5 v\xE0o k\xEAu nh\u01B0 s\u1EAFt." }, "item.dp_ban_son_an": { "name": "B\xE0n S\u01A1n \u1EA4n \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m \u0111\xE1 x\xE1m kh\u1EAFc m\u1EABu \u1EA5n, n\u1EB7ng h\u01A1n \u0111\xE1 th\u01B0\u1EDDng g\u1EA5p m\u1EA5y l\u1EA7n." }, "item.dp_dan_lo_huyen_dong": { "name": "T\u1EED V\u0103n \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5 (c\u1ED5 \u0111\u1ED3ng tinh)", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xEDm, kh\u1EAFc l\xF2 ba ch\xE2n, ch\xE2n l\xF2 t\xF4 m\xE0u \u0111\u1ED3ng xanh." }, "item.dp_thua_anh_kiem": { "name": "Th\u1EEBa \u1EA2nh Ki\u1EBFm \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD ki\u1EBFm tr\xEAn l\u1EE5a, ch\u1ED7 hai m\u1EA3nh n\u1ED1i nhau t\xF4 \u0111\u1ECF." }, "item.dp_hoi_am_thuan": { "name": "H\u1ED3i \xC2m Thu\u1EABn \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\xE0ng nh\u1EA1t, b\xFAng v\xE0o nghe ng\xE2n." }, "item.dp_hau_tho_kim_cang_an": { "name": "H\u1EADu Th\u1ED5 Kim Cang \u1EA4n \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\xFAi da \u0111\u1EF1ng b\u1EA3n v\u1EBD \u1EA5n, l\u1EAFc nghe ti\u1EBFng c\xE1t." }, "item.dp_dia_sat_dinh": { "name": "\u0110\u1ECBa S\xE1t \u0110inh \u0111\u1ED3 ph\u1ED5", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 \u0111\xE0o c\u1EE7a \u0111\u1EA1o s\u0129 tr\u1EEB t\xE0, v\u1EBD b\u1EA3y chi\u1EBFc \u0111inh." }, "item.dp_huyet_anh_dao": { "name": "Huy\u1EBFt \u1EA2nh \u0110ao \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD \u0111o\u1EA3n \u0111ao tr\xEAn gi\u1EA5y \u0111\u1ECF, m\xE9p gi\u1EA5y \u1ED1 v\xE0ng." }, "item.dp_khu_thi_linh": { "name": "Khu Thi Linh \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "S\xE1ch m\u1ECFng b\xECa \u0111en, trang n\xE0o c\u0169ng c\xF3 v\u1EBFt tay d\xEDnh d\u1EA7u." }, "item.dp_thien_dien_phap_y": { "name": "Thi\xEAn Di\u1EC7n Ph\xE1p Y \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n da m\u1ECFng, m\u1EDF ra th\u1EA5y n\u1EEDa khu\xF4n m\u1EB7t v\u1EBD r\u1ED3i b\u1ECF d\u1EDF." }, "item.dp_ho_tam_noi_giap": { "name": "H\u1ED9 T\xE2m N\u1ED9i Gi\xE1p \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD gi\xE1p l\xF3t \xE1o, ghi s\u1ED1 hi\u1EC7u \u0111\u1ED9i kh\xF4i l\u1ED7i c\u1ED5 \u1EDF g\xF3c." }, "item.dp_ly_hoa_hoan_dao": { "name": "Ly H\u1ECFa Ho\xE0n \u0110ao \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD \u0111ao tr\xEAn gi\u1EA5y da, l\u01B0ng \u0111ao v\u1EBD ch\xEDn v\xF2ng \u0111\xE1nh s\u1ED1." }, "item.dp_phi_cuong_trao": { "name": "Phi C\u01B0\u01A1ng Tr\u1EA3o \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da ng\u01B0\u1EDDi kh\xF4 v\u1EBD b\u1ED9 vu\u1ED1t, n\xE9t v\u1EBD b\u1EB1ng m\xE1u \u0111en." }, "item.dp_huyet_ha_phien": { "name": "Huy\u1EBFt H\xE0 Phi\xEAn \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n l\u1EE5a \u0111\u1ECF s\u1EABm, c\u1EA7m v\xE0o \u01B0\u1EDBt tay m\xE0 kh\xF4ng th\u1EA5y n\u01B0\u1EDBc." }, "item.dp_van_quy_phien": { "name": "V\u1EA1n Qu\u1EF7 Phi\xEAn \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "S\xE1ch b\xECa \u0111en ghi t\xEAn nh\u1EEFng ng\u01B0\u1EDDi \u0111\xE3 luy\u1EC7n c\u1EDD n\xE0y, d\xF2ng cu\u1ED1i c\xF2n \u0111\u1EC3 tr\u1ED1ng." }, "item.dp_xich_huy_tien": { "name": "X\xEDch H\u1EE7y Ti\xEAn \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB \u0111\xE1 kh\u1EAFc r\u1EAFn s\xE1u ch\xE2n, s\u1EDD v\xE0o \u1EA5m tay." }, "item.dp_bi_hi_tran_bi": { "name": "B\xED H\xED Tr\u1EA5n Bi \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n r\u1EADp ch\u1EEF kh\u1EAFc ng\u01B0\u1EE3c t\u1EEB m\u1ED9t t\u1EA5m bia c\u1ED5." }, "item.dp_phi_lan_tieu": { "name": "Phi L\xE2n Ti\xEAu \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y m\u1ECFng v\u1EBD b\u1EA3y phi ti\xEAu, gi\xF3 th\u1ED5i l\xE0 l\u1EADt trang." }, "item.dp_lieu_nguyen_phien": { "name": "Li\u1EC7u Nguy\xEAn Phi\u1EBFn \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF4ng h\u1EA1c \xE9p trong ng\u1ECDc gi\u1EA3n, \u0111\u1EA7u l\xF4ng c\xF2n \u0111\u1ECF." }, "item.dp_quy_loi_co": { "name": "Qu\u1EF3 L\xF4i C\u1ED5 \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD tr\u1ED1ng tr\xEAn da, g\xF5 ng\xF3n tay l\xEAn nghe s\u1EA5m xa." }, "item.dp_toan_nghe_lu": { "name": "Toan Ngh\xEA L\u01B0 \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n th\u01A1m m\xF9i tr\u1EA7m, \u0111\u1EC3 trong t\xFAi c\u1EA3 n\u0103m kh\xF4ng bay." }, "item.dp_phi_liem_phong_y": { "name": "Phi Li\xEAm Phong Y \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EE5a m\u1ECFng nh\u01B0 s\u01B0\u01A1ng, v\u1EBD \xE1o cho\xE0ng, ch\u1EB7n \u0111\xE1 m\u1EDBi \u0111\u1ECDc \u0111\u01B0\u1EE3c." }, "item.dp_cuu_anh_ho": { "name": "C\u1EEDu Anh H\u1ED3 \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n n\u1EEDa l\u1EA1nh n\u1EEDa \u1EA5m, ch\u1EEF hai n\u1EEDa vi\u1EBFt hai m\xE0u." }, "item.dp_cung_ky_dao": { "name": "C\xF9ng K\u1EF3 \u0110ao \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB s\u1EAFt kh\u1EAFc ch\u1EEF, ng\u01B0\u1EDDi l\u01B0\u01A1ng thi\u1EC7n c\u1EA7m l\xE2u bu\u1ED1t tay." }, "item.dp_thao_thiet_an": { "name": "Thao Thi\u1EBFt \u1EA4n \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n r\u1EADp v\xE2n th\xFA t\u1EEB m\u1ED9t \u0111\u1EC9nh \u0111\u1ED3ng c\u1ED5." }, "item.dp_ly_long_giap": { "name": "Ly Long Gi\xE1p \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EE5a xanh lam v\u1EBD b\u1ED9 gi\xE1p, m\xE9p \xE1nh v\xE0ng." }, "item.dp_hoa_lan_truong": { "name": "H\u1ECFa L\xE2n Tr\u01B0\u1EE3ng \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 t\u1EED \u0111\xE0n, \u0111\u1EA7u th\u1EBB ch\xE1y s\xE9m m\u1ED9t v\u1EC7t nh\u1ECF." }, "item.dp_tinh_dau_thuan": { "name": "Tinh \u0110\u1EA9u Thu\u1EABn \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n \u0111\u1ED3 sao b\u1EAFc \u0111\u1EA9u v\u1EBD tr\xEAn mai r\xF9a nh\u1ECF." }, "item.dp_hoa_loan_vu_y": { "name": "H\u1ECFa Loan V\u0169 Y \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\u1EE5a \u0111\u1ECF v\u1EBD \xE1o, g\xF3c l\u1EE5a c\xF3 v\u1EBFt ch\xE1y \u0111\xE3 l\xE0nh." }, "item.dp_thanh_loan_tram": { "name": "Thanh Loan Tr\xE2m \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh nh\u01B0 l\xE1 non, m\u1EB7t gi\u1EA3n v\u1EBD m\u1ED9t chi\u1EBFc tr\xE2m." }, "item.dp_lang_nguyet_cau": { "name": "Lang Nguy\u1EC7t C\xE2u \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Da s\xF3i kh\xF4 v\u1EBD \u0111\xF4i c\xE2u, \u0111\xEAm tr\u0103ng n\xE9t v\u1EBD t\u1EF1 s\xE1ng." }, "item.dp_van_tuong_dien": { "name": "V\u1EA1n T\u01B0\u1EDBng Di\u1EC7n \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m l\u1EE5a m\u1ECFng, nh\xECn nghi\xEAng th\u1EA5y th\u1EA5p tho\xE1ng m\u1ED9t khu\xF4n m\u1EB7t." }, "item.dp_long_huyet_thuong": { "name": "Long Huy\u1EBFt Th\u01B0\u01A1ng \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB x\u01B0\u01A1ng \u0111\u1ECF th\u1EABm kh\u1EAFc m\u1EABu th\u01B0\u01A1ng." }, "item.dp_phu_dieu_si": { "name": "Ph\xF9 Di\xEAu S\xED \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF4ng v\u0169 nh\u1ECF k\u1EB9p trong l\u1EE5a, bu\xF4ng tay th\xEC l\u01A1 l\u1EEDng." }, "item.dp_hung_tam_kinh": { "name": "H\xF9ng T\xE2m K\xEDnh \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n r\u1EADp th\u1EC7 \u1EA5n Tuy\u1EBFt B\u1EB1ng tr\xEAn gi\u1EA5y d\xE0y." }, "item.dp_bach_ho_dao": { "name": "B\u1EA1ch H\u1ED5 \u0110ao \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB \u0111\u1ED3ng kh\u1EAFc h\u1ED5 tr\u1EAFng, v\u1EB1n h\u1ED5 l\xE0 ch\u1EEF." }, "item.dp_tu_sa_doc_cham": { "name": "T\u1EED Sa \u0110\u1ED9c Ch\xE2m \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xEDm, th\u01A1m m\xF9i hoa, \u0111\u1EEBng ng\u1EEDi l\xE2u." }, "item.dp_vien_tam_moc_ngu": { "name": "Vi\xEAn T\xE2m M\u1ED9c Ng\u01B0 \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED1n kinh m\u1ECFng, trang cu\u1ED1i v\u1EBD chi\u1EBFc m\xF5." }, "item.dp_kim_thue_bao_y": { "name": "Kim Thu\u1EBF B\u1EA3o Y \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh v\u1EA3y v\xE0ng kh\u1EAFc ch\u1EEF, c\u1EE7a m\u1ED9t mi\u1EBFu l\xE0ng Vi\xEAm Qu\u1ED1c." }, "item.dp_liet_ung_cung": { "name": "Li\u1EC7t \u01AFng Cung \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 B\u1EAFc Minh v\u1EBD m\u0169i t\xEAn, \u0111u\xF4i t\xEAn t\xF4 v\xE0ng." }, "item.dp_thon_kim_dai": { "name": "Th\xF4n Kim \u0110\u1EA1i \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EA3n v\u1EBD c\u1EE7a m\u1ED9t th\u1EE3 ch\u1EE3 \u0111en, d\u1EB7n b\xE1n th\xEC \u0111\u1EEBng n\xF3i ra l\xF2." }, "item.dp_cuu_pham_lien_dai_thiem": { "name": "C\u1EEDu Ph\u1EA9m Li\xEAn \u0110\xE0i \u0111\u1ED3 ph\u1ED5 (thi\u1EC1m ch\xE2u)", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y v\u1EBD \u0111\xE0i sen, gi\u1EEFa \u0111\xE0i m\u1ED9t v\xF2ng tr\u0103ng tr\xF2n." }, "item.dp_tu_thu_tien_y_chu": { "name": "T\u1EED Th\u1EE5 Ti\xEAn Y \u0111\u1ED3 ph\u1ED5 (v\u1EA1n ti chu nang)", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n l\u1EE5a b\u1EA1c m\u1ECFng, \u0111\u1ECDc d\u01B0\u1EDBi \u0111\xE8n m\u1EDBi th\u1EA5y ch\u1EEF." }, "item.dp_dinh_hai_chau_ca": { "name": "\u0110\u1ECBnh H\u1EA3i Ch\xE2u \u0111\u1ED3 ph\u1ED5 (h\u1EA3i ca ch\xE2u)", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "V\u1ECF \u1ED1c l\u1EDBn, \xE1p tai nghe gi\u1ECDng ng\u01B0\u1EDDi \u0111\u1ECDc c\xE1ch luy\u1EC7n." }, "item.dp_hoi_xuan_dan": { "name": "H\u1ED3i Xu\xE2n \u0110an ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y b\u1EA3n \u1ED1 v\xE0ng, ch\xE9p tay n\xE9t ch\u1EEF th\u1EA7y lang. \u0110\u1ECDc l\xE0 thu\u1ED9c." }, "item.dp_bo_khi_dan": { "name": "B\u1ED5 Kh\xED \u0110an ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc bu\u1ED9c d\xE2y gai, ghi \u0111\u01A1n ph\u01B0\u01A1ng B\u1ED5 Kh\xED \u0110an v\xE0 c\xE1ch canh l\u1EEDa." }, "item.dp_sinh_co_dan": { "name": "Sinh C\u01A1 \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ghi \u0111\u01A1n ph\u01B0\u01A1ng Sinh C\u01A1 \u0110an. \u0110an \u0111\u1ED3 ch\u01B0a l\xEAn \u0111an s\u01B0 m\xE0 c\u1ED1 luy\u1EC7n th\xEC m\u01B0\u1EDDi l\xF2 h\u1ECFng ch\xEDn." }, "item.dp_tu_linh_dan": { "name": "T\u1EE5 Linh \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ghi \u0111\u01A1n ph\u01B0\u01A1ng T\u1EE5 Linh \u0110an, k\xE8m l\u1EDDi d\u1EB7n d\xF9ng m\xE3nh h\u1ECFa ph\xE1 v\u1ECF y\xEAu \u0111an." }, "item.dp_bao_huyet_dan": { "name": "B\u1EA1o Huy\u1EBFt \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\xE0u \u0111\u1ECF s\u1EABm. Ng\u01B0\u1EDDi ch\xE9p \u0111\u01A1n n\xE0y l\xFAc tr\u01B0\u1EDBc h\u1EB3n l\xE0 t\xE1n tu quen li\u1EC1u m\u1EA1ng." }, "item.dp_truc_co_dan": { "name": "Tr\xFAc C\u01A1 \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n c\xF3 \u1EA5n c\u1EE7a t\xF4ng m\xF4n. \u0110\u01A1n ph\u01B0\u01A1ng Tr\xFAc C\u01A1 \u0110an kh\xF4ng bao gi\u1EDD l\u1ECDt ra ph\u01B0\u1EDDng th\u1ECB." }, "item.dp_hoi_xuan_dan_thuy": { "name": "H\u1ED3i Xu\xE2n \u0110an ph\u01B0\u01A1ng (s\u01B0\u01A1ng sen)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD \u0111\u01A1n c\u1EE7a d\xE2n v\u1EA1n ch\xE0i, vi\u1EBFt b\u1EB1ng m\u1EF1c l\u1ECD n\u1ED3i, m\xE9p gi\u1EA5y \xE1m m\xF9i c\xE1." }, "item.dp_bo_khi_dan_cot": { "name": "B\u1ED5 Kh\xED \u0110an ph\u01B0\u01A1ng (c\u1ED1t hoa)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh da th\xFA kh\u1EAFc ch\u1EEF, th\u1EE3 s\u0103n truy\u1EC1n tay nhau, v\u1EBFt dao r\u1EA1ch c\xF2n m\u1EDBi." }, "item.dp_bao_huyet_dan_mac": { "name": "B\u1EA1o Huy\u1EBFt \u0110an ph\u01B0\u01A1ng (m\u1EA1c \u0111\u1EB1ng)", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n nhu\u1ED1m m\xE0u c\xE1t \u0111\u1ECF, ch\xE9p v\u1ED9i tr\xEAn \u0111\u01B0\u1EDDng v\u01B0\u1EE3t sa m\u1EA1c." }, "item.dp_kim_sang_duoc": { "name": "Kim Sang D\u01B0\u1EE3c ph\u01B0\u01A1ng", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y gai th\xF4, ch\xE9p tay ba d\xF2ng. Th\u1EA7y lang v\xF5 qu\xE1n n\xE0o c\u0169ng gi\u1EEF m\u1ED9t b\u1EA3n." }, "item.dp_thong_mach_dan": { "name": "Th\xF4ng M\u1EA1ch \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n kh\u1EAFc h\xECnh \u0111\u01B0\u1EDDng kinh m\u1EA1ch, b\xEAn l\u1EC1 c\xF3 ch\u1EEF d\u1EB7n nh\u1ECF v\u1EC1 l\u1EEDa." }, "item.dp_tay_tuy_dan": { "name": "T\u1EA9y T\u1EE7y \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n c\xF3 v\u1EC7t ch\xE1y x\xE9m \u1EDF g\xF3c, nh\u01B0 t\u1EEBng b\u1ECB s\xE9t li\u1EBFm qua." }, "item.dp_thanh_tam_dan": { "name": "Thanh T\xE2m \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc xanh, ch\u1EEF vi\u1EBFt ngay ng\u1EAFn, \u0111\u1ECDc xong th\u1EA5y l\xF2ng b\u1EDBt n\xF4n n\xF3ng." }, "item.dp_tuc_mach_cao": { "name": "T\u1EE5c M\u1EA1ch Cao ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n d\xE0y, k\xE8m h\xECnh v\u1EBD c\xE1ch v\u1EDBt b\u1ECDt cao b\u1EA3y l\u1EA7n." }, "item.dp_hoan_hon_dan": { "name": "Ho\xE0n H\u1ED3n \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n l\u1EA1nh tay, ng\u01B0\u1EDDi ch\xE9p \u0111\u01A1n n\xE0y h\u1EB3n \u0111\xE3 t\u1EEBng k\xE9o m\u1ED9t ng\u01B0\u1EDDi ch\u1EBFt s\u1ED1ng l\u1EA1i." }, "item.dp_ngung_nguyen_dan": { "name": "Ng\u01B0ng Nguy\xEAn \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\xE0u lam th\u1EABm, ch\xE9p r\xF5 c\xE1ch canh l\u1EEDa cho rong tan th\xE0nh gi\u1ECDt." }, "item.dp_duyen_tho_dan": { "name": "Duy\xEAn Th\u1ECD \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n c\xF3 \u1EA5n c\u1EE7a \u0111an ph\xF2ng \u0111\u1EA1i t\xF4ng. C\u1EA7m l\xEAn th\u1EA5y n\u1EB7ng h\u01A1n v\u1EBB ngo\xE0i." }, "item.dp_ket_kim_dan": { "name": "K\u1EBFt Kim \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\xE0ng nh\u1EA1t, c\xF3 \u1EA5n t\xF4ng m\xF4n. K\u1EBB n\xE0o c\u1EA7m n\xF3 th\xEC t\xF4ng m\xF4n coi nh\u01B0 \u0111\xE3 n\u1EAFm \u0111\u01B0\u1EE3c m\u1ED9t n\u1EEDa ng\u01B0\u1EDDi." }, "item.dp_duong_anh_dan": { "name": "D\u01B0\u1EE1ng Anh \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\u1ECFng nh\u01B0 c\xE1nh ve, ch\u1EEF ch\u1EC9 hi\u1EC7n khi r\xF3t linh l\u1EF1c v\xE0o." }, "item.dp_cuu_chuyen_kim_dan": { "name": "C\u1EEDu Chuy\u1EC3n Kim \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da c\u1ED5 nh\xF2e ch\u1EEF, ch\xEDn v\xF2ng tr\xF2n v\u1EBD li\u1EC1n nhau nh\u01B0 ch\xEDn l\u1EA7n luy\u1EC7n." }, "item.dp_pha_chuong_dan": { "name": "Ph\xE1 Ch\u01B0\u1EDBng \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc c\xF3 v\u1EBFt n\u1EE9t ch\u1EA1y d\u1ECDc, ch\u1EEF kh\u1EAFc n\xE9 v\u1EBFt n\u1EE9t m\xE0 \u0111i." }, "item.dp_toai_bich_dan": { "name": "To\xE1i B\xEDch \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Phi\u1EBFn \u0111\xE1 m\u1ECFng kh\u1EAFc ch\u1EEF, m\xE9p v\u1EE1 l\u1EDFm ch\u1EDFm nh\u01B0 v\u1EEBa \u0111\u1EADp ra t\u1EEB v\xE1ch n\xFAi." }, "item.dp_thong_huyen_dan": { "name": "Th\xF4ng Huy\u1EC1n \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xEDm, c\xF3 m\u1ED9t s\u1EE3i ch\u1EC9 b\u1EA1c xuy\xEAn t\u1EEB \u0111\u1EA7u n\xE0y sang \u0111\u1EA7u kia, ni\xEAm \u1EA5n \u0111an ph\xF2ng s\u01A1n m\xF4n." }, "item.dp_pha_hu_dan": { "name": "Ph\xE1 H\u01B0 \u0110an ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n trong su\u1ED1t, c\u1EA7m l\xEAn nh\u01B0 c\u1EA7m kho\u1EA3ng kh\xF4ng. Ch\u1EC9 tr\u01B0\u1EDFng l\xE3o \u0111an ph\xF2ng \u0111\u1EA1i t\xF4ng m\u1EDBi gi\u1EEF." }, "item.dp_on_co_dan": { "name": "\xD4n C\u01A1 \u0110an ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 t\xF9ng \u0111\xE3 s\u1EABm m\xE0u, c\u1EA7m l\xE2u v\u1EABn th\u1EA5y \u1EA5m tay." }, "item.dp_bo_khuyet_dan": { "name": "B\u1ED5 Khuy\u1EBFt \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da thu\u1ED9c r\xE1ch m\u1ED9t g\xF3c, ch\u1ED7 r\xE1ch \u0111\u01B0\u1EE3c kh\xE2u l\u1EA1i b\u1EB1ng ch\u1EC9 v\xE0ng." }, "item.dp_hoan_nguyen_dan": { "name": "Ho\xE0n Nguy\xEAn \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\xE0u h\u1ED5 ph\xE1ch, ni\xEAm \u1EA5n \u0111an ph\xF2ng s\u01A1n m\xF4n, m\u1EDF ra ph\u1EA3i c\xF3 tr\u01B0\u1EDFng l\xE3o g\u1EADt \u0111\u1EA7u." }, "item.dp_bo_thien_dan": { "name": "B\u1ED5 Thi\xEAn \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "N\u0103m m\u1EA3nh ng\u1ECDc n\u0103m m\xE0u gh\xE9p l\u1EA1i m\u1EDBi \u0111\u1ECDc \u0111\u01B0\u1EE3c tr\u1ECDn. \u0110\u1EA1i t\xF4ng chia cho n\u0103m tr\u01B0\u1EDFng l\xE3o gi\u1EEF, m\u1ED7i ng\u01B0\u1EDDi m\u1ED9t m\u1EA3nh." }, "item.dan_lo_dat": { "name": "\u0110an l\xF4 \u0111\u1EA5t nung", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF2 \u0111\u1EA5t c\u1EE7a th\u1EA7y lang, nung l\u1EEDa than. Luy\u1EC7n \u0111\u01B0\u1EE3c t\u1EDBi Ho\xE0ng ph\u1EA9m, l\u1EEDa l\u1EDBn th\xEC n\u1EE9t." }, "item.dan_lo_dong": { "name": "\u0110\u1ED3ng \u0111an l\xF4", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF2 \u0111\u1ED3ng ba ch\xE2n kh\u1EAFc v\xE2n m\xE2y, \u0111an s\u01B0 ph\u01B0\u1EDDng th\u1ECB hay d\xF9ng. Ch\u1ECBu \u0111\u01B0\u1EE3c l\u1EEDa Huy\u1EC1n ph\u1EA9m." }, "item.dan_lo_huyen": { "name": "T\u1EED V\u0103n \u0111an l\xF4", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF2 \u0111\xFAc pha t\u1EED kim, th\xE0nh l\xF2 c\xF3 tr\u1EADn v\u0103n gi\u1EEF nhi\u1EC7t. \u0110an s\u01B0 c\xF3 ti\u1EBFng m\u1EDBi s\u1EAFm n\u1ED5i." }, "item.dan_lo_dia": { "name": "\u0110\u1ECBa H\u1ECFa \u0111an l\xF4", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF2 \u0111\u1ED3ng \u0111en \u0111\xFAc li\u1EC1n t\u1EED kim, \u0111\xE1y kho\xE9t r\xE3nh d\u1EABn \u0111\u1ECBa h\u1ECFa. \u0110\u1EB7t l\xEAn m\u1EA1ch l\u1EEDa l\xE0 t\u1EF1 gi\u1EEF nhi\u1EC7t, \u0111an Thi\xEAn ph\u1EA9m c\u0169ng ch\u1ECBu \u0111\u01B0\u1EE3c." }, "item.dan_lo_thien": { "name": "C\u1EEDu Long \u0111an l\xF4", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ch\xEDn con r\u1ED3ng \u0111\xFAc qu\u1EA5n quanh th\xE2n l\xF2, kh\xF3i \u0111an tho\xE1t ra t\u1EEB mi\u1EC7ng r\u1ED3ng. L\u1EEDa gi\u1EEF b\u1EA3y ng\xE0y kh\xF4ng l\u1EC7ch m\u1ED9t ph\xE2n, luy\u1EC7n \u0111\u01B0\u1EE3c \u0111an Ti\xEAn ph\u1EA9m." }, "item.dan_lo_tien": { "name": "Th\xE1i Th\u01B0\u1EE3ng \u0111an l\xF4", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xF2 ba ch\xE2n b\u1EB1ng ng\u1ECDc \u0111en, n\u1EAFp kh\u1EAFc b\xE1t qu\xE1i m\xF2n nh\u1EB5n v\xEC tay ng\u01B0\u1EDDi m\u1EDF. Kh\xF4ng th\u1EA5y l\u1EEDa m\xE0 \u0111an v\u1EABn ch\xEDn, \u0111an Th\u1EA7n ph\u1EA9m c\u0169ng luy\u1EC7n \u0111\u01B0\u1EE3c." }, "item.dp_tich_doc_dan": { "name": "T\u1ECBch \u0110\u1ED9c \u0110an ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y b\u1EA3n th\u1EA7y lang ch\xE9p, g\xF3c gi\u1EA5y c\xF3 v\u1EBFt \u1ED1 v\xE0ng nh\u01B0 t\u1EEBng nh\u1ECF m\u1EE7 c\xF3c l\xEAn." }, "item.dp_trang_dam_dan": { "name": "Tr\xE1ng \u0110\u1EA3m \u0110an ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc bu\u1ED9c d\xE2y \u0111\u1ECF, ch\u1EEF vi\u1EBFt theo l\u1ED1i mi\u1EC1n nam Vi\xEAm Qu\u1ED1c." }, "item.dp_thanh_vu_dan": { "name": "Thanh V\u1EE5 \u0110an ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y g\xF3i tr\xE0 m\u1EB7t sau ch\xE9p \u0111\u01A1n, c\xF2n th\u01A1m m\xF9i ch\xE8 s\u01B0\u01A1ng." }, "item.dp_tuy_ha_dan": { "name": "T\xFAy H\xE0 \u0110an ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh l\u1EE5a lau chum r\u01B0\u1EE3u, ai \u0111\xF3 ch\xE9p \u0111\u01A1n l\xEAn b\u1EB1ng than, ch\u1EEF c\xF2n lem." }, "item.dp_bach_giai_dan": { "name": "B\xE1ch Gi\u1EA3i \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh r\xEAu, c\xF3 v\u1EBD th\u1EE9 t\u1EF1 b\u1ECF thu\u1ED1c b\u1EB1ng m\u0169i t\xEAn." }, "item.dp_dinh_than_dan": { "name": "\u0110\u1ECBnh Th\u1EA7n \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\xE1t tay, \u0111\u1EA7u gi\u1EA3n kh\u1EAFc m\u1ED9t ch\u1EEF V\u1EA1n nh\u1ECF." }, "item.dp_bang_phach_dan": { "name": "B\u0103ng Ph\xE1ch \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ph\u1EE7 m\u1ED9t l\u1EDBp s\u01B0\u01A1ng m\u1ECFng, \u0111\u1EC3 trong t\xFAi c\u1EA3 n\u0103m v\u1EABn kh\xF4ng tan." }, "item.dp_duong_khi_dan": { "name": "D\u01B0\u1EE1ng Kh\xED \u0110an ph\u01B0\u01A1ng", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y d\xE1n sau c\u1EEDa thi\u1EC1n ph\xF2ng, m\xE9p \u0111\xE3 ch\xE1y s\xE9m v\xEC h\u01B0\u01A1ng." }, "item.dp_khai_nguyen_dan": { "name": "Khai Nguy\xEAn \u0110an ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tre s\u01A1n xanh, m\u1EB7t sau v\u1EBD con c\xF3c ng\u1ED3i thi\u1EC1n." }, "item.dp_tu_khi_dan": { "name": "T\u1EE5 Kh\xED \u0110an ph\u01B0\u01A1ng", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n r\u1EBB ti\u1EC1n, ph\u01B0\u1EDDng th\u1ECB n\xE0o c\u0169ng c\xF3 b\xE1n, ch\u1EEF kh\u1EAFc n\xF4ng v\xEC ch\xE9p \u0111i ch\xE9p l\u1EA1i nhi\u1EC1u \u0111\u1EDDi." }, "item.dp_ngung_khi_dan": { "name": "Ng\u01B0ng Kh\xED \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n k\u1EB9p m\u1ED9t s\u1EE3i l\xF4ng h\u1EA1c tr\u1EAFng l\xE0m d\u1EA5u." }, "item.dp_boi_nguyen_dan": { "name": "B\u1ED3i Nguy\xEAn \u0110an ph\u01B0\u01A1ng", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\xE0u v\xE0ng \u0111\u1EA5t, g\xF3c kh\u1EAFc m\u1ED9t b\xF4ng l\xFAa." }, "item.dp_tinh_nguyen_dan": { "name": "Tinh Nguy\xEAn \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n l\u1EA1nh tay, \u0111\u1EA7u gi\u1EA3n kh\u1EAFc \u1EA5n \u0111an ph\xF2ng s\u01A1n m\xF4n." }, "item.dp_kim_lo_dan": { "name": "Kim L\u1ED9 \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n \u0111\u1ECF, c\u1EA7m l\xE2u th\u1EA5y r\u1ECBn m\u1ED9t l\u1EDBp \u1EA9m nh\u01B0 s\u01B0\u01A1ng." }, "item.dp_long_ho_dan": { "name": "Long H\u1ED5 \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n hai m\xE0u v\xE0ng tr\u1EAFng xo\u1EAFn nhau, ch\u1EC9 trao cho \u0111\u1EC7 t\u1EED \u0111\xE3 K\u1EBFt \u0110an." }, "item.dp_boi_anh_dan": { "name": "B\u1ED3i Anh \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n th\u01A1m m\xF9i \u0111\xE0o, ni\xEAm \u1EA5n tr\u01B0\u1EDFng l\xE3o \u0111an ph\xF2ng." }, "item.dp_huyen_anh_dan": { "name": "Huy\u1EC1n Anh \u0110an ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da th\xFA \u0111en, ch\u1EEF vi\u1EBFt b\u1EB1ng m\xE1u \u0111\xE3 kh\xF4 th\xE0nh n\xE2u." }, "item.dp_duong_than_dan": { "name": "D\u01B0\u1EE1ng Th\u1EA7n \u0110an ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xE1 v\xE0ng m\u1ECFng g\u1EA5p l\xE0m t\xE1m, m\u1EDF ra c\xF2n \u1EA5m nh\u01B0 v\u1EEBa ph\u01A1i n\u1EAFng." }, "item.dp_thai_hu_dan": { "name": "Th\xE1i H\u01B0 \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh \u0111\xE1 v\xE1ch \u0111\u1ED9ng c\u1EA1y ra, ch\u1EEF kh\u1EAFc s\xE2u n\u1EEDa \u0111\u1ED1t ng\xF3n tay, d\xF2ng cu\u1ED1i b\u1ECB \u0111\u1EE5c m\u1EA5t." }, "item.dp_loi_am_dan": { "name": "L\xF4i \xC2m \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ch\xE1y \u0111en m\u1ED9t g\xF3c, c\u1EA7m l\xEAn t\xF3c g\xE1y d\u1EF1ng \u0111\u1EE9ng." }, "item.dp_tinh_phach_dan": { "name": "T\u0129nh Ph\xE1ch \u0110an ph\u01B0\u01A1ng", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc ph\u1EE7 s\u01B0\u01A1ng, ch\u1EEF kh\u1EAFc b\u1EB1ng m\u0169i kim b\u0103ng." }, "item.dp_luyen_cot_dan": { "name": "Luy\u1EC7n C\u1ED1t \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh x\u01B0\u01A1ng s\xF3i m\xE0i ph\u1EB3ng, ch\u1EEF kh\u1EAFc theo l\u1ED1i th\u1EE3 s\u0103n Lang Hoang." }, "item.dp_truong_xuan_dan": { "name": "Tr\u01B0\u1EDDng Xu\xE2n \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Cu\u1ED9n l\u1EE5a v\xE0ng \u1ED1, trong k\u1EB9p m\u1ED9t s\u1EE3i t\xF3c b\u1EA1c \u0111\xE3 \u0111en l\u1EA1i n\u1EEDa ch\xE2n." }, "item.dp_thong_than_dan": { "name": "Th\xF4ng Th\u1EA7n \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n \u0111en, r\xF3t linh l\u1EF1c v\xE0o th\xEC ch\u1EEF hi\u1EC7n ra nh\u01B0 sao \u0111\xEAm." }, "item.dp_tran_hon_dan": { "name": "Tr\u1EA5n H\u1ED3n \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB ng\u1ECDc tr\u1EAFng l\u1EA1nh, m\u1EB7t sau kh\u1EAFc m\u1ED9t c\xE2y \u0111inh." }, "item.dp_hoa_anh_dan": { "name": "H\xF3a Anh \u0110an ph\u01B0\u01A1ng", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da r\u1EAFn \u0111\u1ECF ch\xE9p ch\u1EEF ngu\u1EC7ch ngo\u1EA1c, b\xEAn l\u1EC1 ghi b\u1EA3y l\u1EA7n h\u1ECFng l\xF2 tr\u01B0\u1EDBc khi th\xE0nh." }, "item.dp_hoi_thien_dan": { "name": "H\u1ED3i Thi\xEAn \u0110an ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n t\xEDm qu\u1EA5n t\u01A1 b\u1EA1c, m\u1EDF ra th\u01A1m m\xF9i n\u1EA5m r\u1EEBng." }, "item.dp_han_tuy_dan": { "name": "H\xE0n T\u1EE7y \u0110an ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Phi\u1EBFn b\u0103ng kh\xF4ng tan, ch\u1EEF \u0111\xF4ng trong l\xF2ng b\u0103ng nh\u01B0 c\xE1 d\u01B0\u1EDBi h\u1ED3." }, "item.dp_due_kim_dan": { "name": "Du\u1EC7 Kim \u0110an ph\u01B0\u01A1ng", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xE1 th\xE9p m\u1ECFng cu\u1ED9n tr\xF2n, m\xE9p s\u1EAFc, \u0111\u1ECDc ph\u1EA3i c\u1EA9n th\u1EADn k\u1EBBo \u0111\u1EE9t tay." }, "item.dp_thuong_long_dan": { "name": "Th\u01B0\u01A1ng Long \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "V\u1ECF \u1ED1c bi\u1EC3n kh\u1EAFc ch\u1EEF c\u1EA3 trong l\u1EABn ngo\xE0i, \xE1p tai nghe ti\u1EBFng s\xF3ng \u0111\u1ECDc \u0111\u01A1n." }, "item.dp_kim_o_dan": { "name": "Kim \xD4 \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u0110\u0129a \u0111\u1ED3ng v\u1EBD con qu\u1EA1 ba ch\xE2n gi\u1EEFa v\u1EA7ng m\u1EB7t tr\u1EDDi, n\xF3ng tay quanh n\u0103m." }, "item.dp_van_tho_dan": { "name": "V\u1EA1n Th\u1ECD \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh mai r\xF9a kh\u1EAFc ch\u1EEF, v\xE2n n\u1EE9t \u0111\xE3 ch\u1EA1y xuy\xEAn m\u1EA5y d\xF2ng." }, "item.dp_tao_hoa_dan": { "name": "T\u1EA1o H\xF3a \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Phi\u1EBFn g\u1ED7 xanh c\xF2n s\u1ED1ng, m\u1ED7i n\u0103m m\u1ECDc th\xEAm m\u1ED9t v\xF2ng v\xE2n quanh ch\u1EEF." }, "item.dp_hoa_long_dan": { "name": "H\xF3a Long \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da r\u1EAFn l\u1ED9t tr\u1ECDn v\u1EB9n, ch\u1EEF vi\u1EBFt d\u1ECDc theo s\u1ED1ng l\u01B0ng t\u1EEB \u0111\u1EA7u t\u1EDBi \u0111u\xF4i." }, "item.dp_van_tam_dan": { "name": "V\u1EA5n T\xE2m \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "G\u01B0\u01A1ng \u0111\u1ED3ng nh\u1ECF, ch\u1EEF ch\u1EC9 hi\u1EC7n khi ng\u01B0\u1EDDi soi \u0111\xE3 th\xF4i n\xF3ng ru\u1ED9t." }, "item.dp_thien_nhat_dan": { "name": "Thi\xEAn Nh\u1EA5t \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh ch\u1EC9 ghi ch\xEDn ch\u1EEF, \u0111\u1ECDc xong m\u1EDBi th\u1EA5y \u0111\u1EE7 c\u1EA3 \u0111\u01A1n." }, "item.dp_linh_lung_dan": { "name": "Linh Lung \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u1ED0ng s\xE1o ng\u1ECDc b\u1EA3y l\u1ED7, ch\u1EEF kh\u1EAFc v\xF2ng quanh th\xE2n s\xE1o." }, "item.dp_thien_loi_dan": { "name": "Thi\xEAn L\xF4i \u0110an ph\u01B0\u01A1ng", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 s\xE9t \u0111\xE1nh, ch\u1EEF l\xE0 v\u1EBFt ch\xE1y ch\u1EE9 kh\xF4ng ph\u1EA3i n\xE9t kh\u1EAFc." }, "item.dp_bach_giai_dan_giac": { "name": "B\xE1ch Gi\u1EA3i \u0110an ph\u01B0\u01A1ng (t\xEA gi\xE1c)", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc c\u1EE7a th\u1EA7y lang mi\u1EC1n n\xFAi, v\u1EBD con t\xEA gi\xE1c b\xEAn c\u1EA1nh v\u1ECB thu\u1ED1c." }, "item.dp_bo_khi_dan_mat": { "name": "B\u1ED5 Kh\xED \u0110an ph\u01B0\u01A1ng (phong m\u1EADt)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y d\u1EA7u d\xEDnh m\u1EADt, ch\u1EEF nh\xF2e m\xE0 v\u1EABn \u0111\u1ECDc \u0111\u01B0\u1EE3c." }, "item.dp_hoi_xuan_dan_dia": { "name": "H\u1ED3i Xu\xE2n \u0110an ph\u01B0\u01A1ng (\u0111\u1EC9a d\u1ECBch)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh gi\u1EA5y b\u1EA3n g\u1EA5p t\u01B0, n\xE9t ch\u1EEF c\u1EE7a m\u1ED9t lang trung v\xF9ng \u0111\u1EA7m." }, "item.dp_thong_mach_dan_giap": { "name": "Th\xF4ng M\u1EA1ch \u0110an ph\u01B0\u01A1ng (v\u1EA3y t\xEA t\xEA)", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 kh\u1EAFc h\xECnh con t\xEA t\xEA cu\u1ED9n tr\xF2n, m\u1EB7t sau ghi l\u1EEDa sao t\u1EEBng kh\u1EAFc." }, "item.dp_khai_nguyen_dan_nhung": { "name": "Khai Nguy\xEAn \u0110an ph\u01B0\u01A1ng (l\u1ED9c nhung)", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh nh\u1EA1t, \u0111\u1EA7u gi\u1EA3n kh\u1EAFc m\u1ED9t c\u1EB7p s\u1EEBng h\u01B0\u01A1u." }, "item.dp_dinh_than_dan_kinh": { "name": "\u0110\u1ECBnh Th\u1EA7n \u0110an ph\u01B0\u01A1ng (g\u01B0\u01A1ng c\u1ED5)", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n c\xF3 m\u1ED9t m\u1EB7t m\xE0i b\xF3ng nh\u01B0 g\u01B0\u01A1ng, ch\u1EEF hi\u1EC7n ng\u01B0\u1EE3c." }, "item.dp_thong_than_dan_tuy": { "name": "Th\xF4ng Th\u1EA7n \u0110an ph\u01B0\u01A1ng (ng\u1ECDc t\u1EE7y)", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n trong nh\u01B0 n\u01B0\u1EDBc, gi\u1EEFa gi\u1EA3n c\xF3 m\u1ED9t \u0111\u1ED1m xanh l\u1EE5c." }, "item.tran_but_pham": { "name": "Thi\u1EBFt Kh\u1EAFc B\xFAt", "quality": 1, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "D\xF9i s\u1EAFt m\xE0i nh\u1ECDn, c\xE1n qu\u1EA5n d\xE2y gai. Kh\u1EAFc \u0111\u01B0\u1EE3c tr\u1EADn b\xE0n Ho\xE0ng ph\u1EA9m, cao h\u01A1n th\xEC n\xE9t tr\u01B0\u1EE3t." }, "item.tran_but_hoang": { "name": "H\xE0n Thi\u1EBFt Tr\u1EADn B\xFAt", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\xE2n h\xE0n thi\u1EBFt l\u1EA1nh tay, m\u0169i t\xF4i trong n\u01B0\u1EDBc gi\u1EBFng s\xE2u. Tr\u1EADn s\u01B0 ph\u01B0\u1EDDng th\u1ECB hay d\xF9ng." }, "item.tran_but_huyen": { "name": "Thanh Ng\u1ECDc Tr\u1EADn B\xFAt", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "C\xE1n ng\u1ECDc xanh, m\u0169i b\u1ECDc tinh \u0111\u1ED3ng. N\xE9t kh\u1EAFc \u0111i t\u1EDBi \u0111\xE2u, linh quang ch\u1EA1y t\u1EDBi \u0111\xF3." }, "item.tran_but_dia": { "name": "T\u1EED Kim Tr\u1EADn B\xFAt", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "\u0110\xFAc nguy\xEAn kh\u1ED1i t\u1EED kim, n\u1EB7ng tay m\xE0 kh\xF4ng run. \u0110\u1EA1i tr\u1EADn s\u01B0 d\xF9ng n\xF3 kh\u1EAFc h\u1ED9 tr\u1EADn cho c\u1EA3 m\u1ED9t th\xE0nh." }, "item.tran_but_thien": { "name": "Th\u1EA5t Tinh Tr\u1EADn B\xFAt", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\xE2n v\u1EABn thi\u1EBFt kh\u1EA3m b\u1EA3y \u0111i\u1EC3m sao, kh\u1EAFc tr\u1EADn \u0111\xEAm th\xEC sao tr\xEAn th\xE2n s\xE1ng theo sao tr\xEAn tr\u1EDDi." }, "item.tran_but_tien": { "name": "Huy\u1EC1n C\u01A1 Tr\u1EADn B\xFAt", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "C\xE1n \u0111\u1ED3ng chu\xF4ng c\u1ED5, h\u01B0 linh ph\xE1ch nh\u1ED1t trong m\u0169i b\xFAt. N\xE9t kh\u1EAFc t\u1EF1 t\xECm ch\u1ED7 h\u1EDF c\u1EE7a tr\u1EADn, nh\u01B0 c\xF3 ng\u01B0\u1EDDi c\u1EA7m tay ch\u1EC9." }, "item.phoi_dao_moc": { "name": "\u0110\xE0o M\u1ED9c Ph\xF4i", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m g\u1ED7 \u0111\xE0o gi\xE0 c\u1EAFt vu\xF4ng, ph\u01A1i \u0111\u1EE7 ba m\xF9a cho kh\xF4 th\u1EDB. Ph\xF4i r\u1EBB nh\u1EA5t \u0111\u1EC3 kh\u1EAFc tr\u1EADn b\xE0n." }, "item.phoi_thanh_ngoc": { "name": "Thanh Ng\u1ECDc Ph\xF4i", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Phi\u1EBFn ng\u1ECDc xanh m\xE0i ph\u1EB3ng b\u1EB1ng b\xE0n tay, gi\u1EEF \u0111\u01B0\u1EE3c linh kh\xED trong n\xE9t kh\u1EAFc l\xE2u h\u01A1n g\u1ED7." }, "item.phoi_linh_cot": { "name": "Linh C\u1ED1t Ph\xF4i", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "X\u01B0\u01A1ng b\u1EA3 vai y\xEAu th\xFA l\u1EDBn c\u01B0a th\xE0nh t\u1EA5m, \u0111\xE3 lu\u1ED9c s\u1EA1ch t\u1EE7y. Tr\u1EADn v\u0103n kh\u1EAFc l\xEAn x\u01B0\u01A1ng th\xEC linh l\u1EF1c ch\u1EA1y theo th\u1EDB x\u01B0\u01A1ng." }, "item.phoi_han_ngoc": { "name": "H\xE0n Ng\u1ECDc Ph\xF4i", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "H\xE0n ng\u1ECDc \u0111\xE0o d\u01B0\u1EDBi tuy\u1EBFt s\xE2u, c\u1EA7m l\xE2u bu\u1ED1t tay. Tr\u1EADn v\u0103n kh\u1EAFc l\xEAn kh\xF4ng nh\xF2e, tr\u0103m n\u0103m v\u1EABn s\u1EAFc." }, "item.dp_tran_thach_bich": { "name": "Th\u1EA1ch B\xEDch tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 \u0111\xE0o ch\xE9p tr\u1EADn ph\xF2ng th\xE2n c\u1EE7a tr\u1EADn s\u01B0 ph\u01B0\u1EDDng th\u1ECB, n\xE9t kh\u1EAFc to b\u1EB1ng ng\xF3n tay." }, "item.dp_tran_dang_la": { "name": "\u0110\u1EB1ng La tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m gi\u1EA5y d\u1EA7u v\u1EBD m\u1ED9t v\xF2ng d\xE2y leo qu\u1EA5n ch\xEDn v\xF2ng, ch\u1ED7 th\u1EAFt n\xFAt \u0111\xE1nh d\u1EA5u son." }, "item.dp_tran_liem_tuc": { "name": "Li\u1EC5m T\u1EE9c tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc nh\u1ECF ch\xE9p tr\u1EADn gi\u1EA5u h\u01A1i th\u1EDF, m\u1EB7t sau d\u1EB7n kh\u1EAFc l\xFAc \u0111\xEAm kh\xF4ng tr\u0103ng." }, "item.dp_tran_tam_tai_kiem": { "name": "Tam T\xE0i Ki\u1EBFm tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 v\u1EBD ba thanh ki\u1EBFm x\u1EBFp h\xECnh ch\u1EEF ph\u1EA9m, ch\u1ED7 m\u0169i ki\u1EBFm c\xF3 v\u1EBFt dao kh\u1EAFc th\u1EED." }, "item.dp_tran_at_moc": { "name": "\u1EA4t M\u1ED9c tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "L\xE1 c\xE2y kh\xF4 \xE9p gi\u1EEFa hai thanh tre, g\xE2n l\xE1 ch\xEDnh l\xE0 n\xE9t tr\u1EADn." }, "item.dp_tran_ly_hoa": { "name": "Ly H\u1ECFa tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da m\u1ECFng v\u1EBD tr\u1EADn b\u1EB1ng m\u1EF1c \u0111\u1ECF, m\xE9p da s\xE9m l\u1EEDa." }, "item.dp_tran_pha_giap": { "name": "Ph\xE1 Gi\xE1p tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 v\u1EBD hai m\u0169i d\xF9i b\u1EAFt ch\xE9o, n\xE9t kh\u1EAFc s\xE2u t\u1EDBi m\u1EE9c th\u1EE7ng m\u1EB7t sau." }, "item.dp_tran_tan_linh": { "name": "T\xE1n Linh tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y b\u1EA3n v\u1EBD m\u1ED9t v\xF2ng xo\xE1y h\xFAt v\xE0o gi\u1EEFa, m\u1EF1c \u0111\xE3 ng\u1EA3 m\xE0u n\xE2u." }, "item.dp_tran_kho_moc": { "name": "Kh\xF4 M\u1ED9c tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 m\u1EE5c m\u1ED9t n\u1EEDa, n\u1EEDa c\xF2n l\u1EA1i ch\xE9p tr\u1EADn l\xE0m kh\xF4 h\xE9o sinh c\u01A1." }, "item.dp_tran_dan_linh": { "name": "D\u1EABn Linh tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB tr\xFAc v\u1EBD m\u1ED9t v\xF2ng tr\xF2n c\xF3 ch\xEDn \u0111\u01B0\u1EDDng t\u1ECFa ra nh\u01B0 nan qu\u1EA1t." }, "item.dp_tran_thanh_moc_duc_linh": { "name": "Thanh M\u1ED9c D\u1EE5c Linh tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y n\xF4ng gia ch\xE9p tr\u1EADn gi\u1EE5c c\xE2y, g\xF3c gi\u1EA5y c\xF3 v\u1EBFt b\xF9n ru\u1ED9ng." }, "item.dp_tran_suc_dia": { "name": "S\xFAc \u0110\u1ECBa tr\u1EADn \u0111\u1ED3", "quality": 2, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB g\u1ED7 kh\u1EAFc hai ch\u1EA5m n\u1ED1i nhau b\u1EB1ng m\u1ED9t \u0111\u01B0\u1EDDng g\u1EA5p kh\xFAc, nh\u01B0 t\u1EA5m \u0111\u1ECBa \u0111\u1ED3 g\u1EA5p l\u1EA1i." }, "item.dp_tran_huyen_quy": { "name": "Huy\u1EC1n Quy tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "M\u1EA3nh mai r\xF9a kh\u1EAFc ch\u1EEF nh\u1ECF li ti, \u0111\u1ECDc theo v\xF2ng xo\u1EAFn t\u1EEB ngo\xE0i v\xE0o trong." }, "item.dp_tran_van_vu": { "name": "V\xE2n V\u1EE5 M\xEA tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n m\u1EDD \u0111\u1EE5c nh\u01B0 c\xF3 s\u01B0\u01A1ng b\xEAn trong, \xE1p l\xEAn tr\xE1n m\u1EDBi th\u1EA5y n\xE9t tr\u1EADn." }, "item.dp_tran_lien_hoan_kiem": { "name": "Li\xEAn Ho\xE0n Ki\u1EBFm tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh v\u1EBD b\u1EA3y thanh ki\u1EBFm n\u1ED1i \u0111u\xF4i nhau th\xE0nh v\xF2ng, ki\u1EBFm sau ng\u1EADm chu\xF4i ki\u1EBFm tr\u01B0\u1EDBc." }, "item.dp_tran_canh_kim": { "name": "Canh Kim tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n tr\u1EAFng l\u1EA1nh tay, ch\xE9p tr\u1EADn d\u1EABn kim kh\xED v\xE0o \u0111\xF2n \u0111\xE1nh." }, "item.dp_tran_quy_thuy": { "name": "Qu\xFD Th\u1EE7y tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh lam, l\u1EADt nghi\xEAng th\u1EA5y n\xE9t tr\u1EADn nh\u01B0 n\u01B0\u1EDBc ch\u1EA3y b\xEAn trong." }, "item.dp_tran_mau_tho": { "name": "M\u1EADu Th\u1ED5 tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\xE0ng s\u1EABm, s\u1EDD v\xE0o th\u1EA5y nh\xE1m nh\u01B0 \u0111\xE1." }, "item.dp_tran_toai_bich": { "name": "To\xE1i B\xEDch tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD m\u1ED9t b\u1EE9c t\u01B0\u1EDDng n\u1EE9t t\u1EEB ch\xE2n l\xEAn, m\u1ED7i \u0111\u01B0\u1EDDng n\u1EE9t ghi m\u1ED9t ch\u1EEF." }, "item.dp_tran_phong_mach": { "name": "Phong M\u1EA1ch tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ch\xE9p tr\u1EADn phong m\u1EA1ch, m\u1EB7t gi\u1EA3n c\xF3 v\u1EBFt kh\u1EAFc nh\u01B0 \u0111\u01B0\u1EDDng \u0111\xEA." }, "item.dp_tran_tu_linh": { "name": "T\u1EE5 Linh tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh ch\xE9p tr\u1EADn t\u1EE5 linh kh\xED, tr\u1EADn s\u01B0 ph\u01B0\u1EDDng th\u1ECB n\xE0o c\u0169ng thu\u1ED9c." }, "item.dp_tran_thong_mach": { "name": "Th\xF4ng M\u1EA1ch tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD h\xECnh ng\u01B0\u1EDDi ng\u1ED3i thi\u1EC1n, kinh l\u1EA1c tr\xEAn ng\u01B0\u1EDDi l\xE0 n\xE9t tr\u1EADn." }, "item.dp_tran_van_ly": { "name": "V\u1EA1n L\xFD tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n kh\u1EAFc hai m\u1EB7t, m\u1EB7t tr\u01B0\u1EDBc l\xE0 tr\u1EADn \u0111i, m\u1EB7t sau l\xE0 tr\u1EADn \u0111\u1EBFn." }, "item.dp_tran_thien_la": { "name": "Thi\xEAn La Kh\u1ED1n tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m l\u1EE5a \u0111en d\u1EC7t th\u01B0a, nh\xECn k\u1EF9 m\u1ED7i m\u1EAFt l\u01B0\u1EDBi l\xE0 m\u1ED9t n\xE9t tr\u1EADn." }, "item.dp_tran_binh_hoa": { "name": "B\xEDnh H\u1ECFa tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n \u0111\u1ECF \u1EA5m nh\u01B0 than, \xE1p l\xE2u th\xEC n\xF3ng r\xE1t tay." }, "item.dp_tran_toa_linh": { "name": "T\u1ECFa Linh tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ch\xE9p tr\u1EADn kh\xF3a linh kh\xED, n\xE9t tr\u1EADn \u0111an nhau nh\u01B0 x\xEDch s\u1EAFt." }, "item.dp_tran_ngu_hanh_tu_linh": { "name": "Ng\u0169 H\xE0nh T\u1EE5 Linh tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n n\u0103m m\xE0u, m\u1ED7i m\xE0u ch\xE9p m\u1ED9t g\xF3c tr\u1EADn." }, "item.dp_tran_tuyet_sinh": { "name": "Tuy\u1EC7t Sinh tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n x\xE1m, quanh vi\u1EC1n m\u1ECDc m\u1ED9t l\u1EDBp m\u1ED1c \u0111en lau m\xE3i kh\xF4ng s\u1EA1ch." }, "item.dp_tran_doan_mach": { "name": "\u0110o\u1EA1n M\u1EA1ch tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ch\xE9p tr\u1EADn c\u1EAFt \u0111\u1EE9t linh m\u1EA1ch, n\xE9t tr\u1EADn \u0111\u1EE9t qu\xE3ng t\u1EEBng \u0111o\u1EA1n." }, "item.dp_tran_xich_diem_kiem": { "name": "X\xEDch Di\u1EC5m Ki\u1EBFm tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EDD gi\u1EA5y da v\u1EBD s\xE1u thanh ki\u1EBFm b\u1EB1ng m\u1EF1c \u0111\u1ECF, m\xE9p gi\u1EA5y ch\xE1y x\xE9m." }, "item.dp_tran_xuan_phong_hoa_vu": { "name": "Xu\xE2n Phong H\xF3a V\u0169 tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh m\xE1t, ch\xE9p tr\u1EADn g\u1ECDi gi\xF3 xu\xE2n m\u01B0a nh\u1ECF cho linh \u0111i\u1EC1n." }, "item.dp_tran_can_khon": { "name": "C\xE0n Kh\xF4n tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n kh\u1EAFc hai m\u1EB7t tr\u1EDDi \u0111\u1EA5t, gi\u1EEFa c\xF3 m\u1ED9t \u0111\u01B0\u1EDDng g\u1EA5p t\xE1m kh\xFAc." }, "item.dp_tran_cuu_cung_kiem": { "name": "C\u1EEDu Cung Ki\u1EBFm tr\u1EADn \u0111\u1ED3", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ch\xE9p ch\xEDn cung ki\u1EBFm tr\u1EADn, c\u1EA7m l\xEAn nghe ti\u1EBFng ki\u1EBFm ng\xE2n r\u1EA5t kh\u1EBD." }, "item.dp_tran_thai_bach": { "name": "Th\xE1i B\u1EA1ch tr\u1EADn \u0111\u1ED3", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n tr\u1EAFng nh\u01B0 sao Th\xE1i B\u1EA1ch, \u0111\u1EB7t d\u01B0\u1EDBi tr\u0103ng th\xEC ph\xE1t s\xE1ng." }, "item.dp_tran_thanh_de": { "name": "Thanh \u0110\u1EBF tr\u1EADn \u0111\u1ED3", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh bi\u1EBFc, l\xE2u l\xE2u n\u1EA3y ra m\u1ED9t ch\u1ED3i non r\u1ED3i h\xE9o." }, "item.dp_tran_hau_tho": { "name": "H\u1EADu Th\u1ED5 tr\u1EADn \u0111\u1ED3", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n n\u1EB7ng nh\u01B0 \u0111\xE1 t\u1EA3ng, ch\xE9p tr\u1EADn m\u01B0\u1EE3n th\u1ED5 kh\xED c\u1EE7a n\xFAi." }, "item.dp_tran_bat_quai_me_tung": { "name": "B\xE1t Qu\xE1i M\xEA Tung tr\u1EADn \u0111\u1ED3", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD b\xE1t qu\xE1i, m\u1ED7i l\u1EA7n nh\xECn th\u1EA5y c\xE1c qu\u1EBB \u0111\u1ED5i ch\u1ED7." }, "item.dp_tran_pha_quan": { "name": "Ph\xE1 Qu\xE2n tr\u1EADn \u0111\u1ED3", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ch\xE9p tr\u1EADn ph\xE1 thu\u1EABn c\u1EE7a binh gia, gi\u1EA3n c\xF3 v\u1EBFt gi\xE1o \u0111\xE2m th\u1EE7ng." }, "item.dp_tran_kim_cang": { "name": "Kim Cang H\u1ED9 tr\u1EADn \u0111\u1ED3", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\xE0ng ch\xE9p kinh v\xE0 tr\u1EADn xen nhau, ch\u1EEF kinh vi\u1EBFt to h\u01A1n ch\u1EEF tr\u1EADn." }, "item.dp_tran_chu_thien_tu_linh": { "name": "Chu Thi\xEAn T\u1EE5 Linh tr\u1EADn \u0111\u1ED3", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n \u0111en \u0111i\u1EC3m \xE1nh sao, ch\xE9p \u0111\u1EE7 tinh \u0111\u1ED3 m\u1ED9t n\u0103m." }, "item.dp_tran_thien_co": { "name": "Thi\xEAn C\u01A1 tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n kh\xF4ng ch\u1EEF, r\xF3t th\u1EA7n th\u1EE9c v\xE0o m\u1EDBi hi\u1EC7n n\xE9t tr\u1EADn, m\u1ED7i l\u1EA7n m\u1ED9t kh\xE1c." }, "item.dp_tran_van_moc_hoi_xuan": { "name": "V\u1EA1n M\u1ED9c H\u1ED3i Xu\xE2n tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh c\xF3 m\xF9i g\u1ED7 m\u1EDBi, c\u1EAFm xu\u1ED1ng \u0111\u1EA5t th\xEC \u0111\xE2m r\u1EC5." }, "item.dp_tran_toa_long": { "name": "T\u1ECFa Long tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD m\u1ED9t con r\u1ED3ng b\u1ECB ch\xEDn x\xEDch kh\xF3a, x\xEDch n\xE0o c\u0169ng ghi t\xEAn m\u1ED9t sao." }, "item.dp_tran_huyen_minh": { "name": "Huy\u1EC1n Minh tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n \u0111en s\xE2u nh\u01B0 n\u01B0\u1EDBc v\u1EF1c, nh\xECn v\xE0o th\u1EA5y b\xF3ng m\xECnh m\xE9o \u0111i." }, "item.dp_tran_tan_nguyen": { "name": "T\xE1n Nguy\xEAn tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n ch\xE9p tr\u1EADn t\xE1n nguy\xEAn kh\xED, n\xE9t xo\xE1y loe ra nh\u01B0 n\u01B0\u1EDBc r\xFAt kh\u1ECFi b\xE3i." }, "item.dp_tran_thien_cuong_toa_linh": { "name": "Thi\xEAn C\u01B0\u01A1ng T\u1ECFa Linh tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n kh\u1EAFc ba m\u01B0\u01A1i s\xE1u ch\u1EA5m sao n\u1ED1i b\u1EB1ng x\xEDch, ch\u1EA5m n\xE0o c\u0169ng c\xF3 l\u1ED7 \u0111inh." }, "item.dp_tran_tich_diet": { "name": "T\u1ECBch Di\u1EC7t tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n x\xE1m tro, c\u1EA7m l\xE2u m\xF3ng tay \u0111\u1ED5i m\xE0u." }, "item.dp_tran_cuu_tieu_loi": { "name": "C\u1EEDu Ti\xEAu L\xF4i tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n xanh t\xEDm, c\u1EA7m v\xE0o nghe t\xEA \u0111\u1EA7u ng\xF3n tay nh\u01B0 ch\u1EA1m s\xE9t." }, "item.dp_tran_van_tuong_tu_linh": { "name": "V\u1EA1n T\u01B0\u1EE3ng T\u1EE5 Linh tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD n\xFAi s\xF4ng thu nh\u1ECF, d\xF2ng s\xF4ng tr\xEAn gi\u1EA3n ch\u1EA3y th\u1EADt." }, "item.dp_tran_chu_tuoc": { "name": "Chu T\u01B0\u1EDBc tr\u1EADn \u0111\u1ED3", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m v\u0169 \u0111\u1ED3 \u0111\u1ECF r\u1EF1c v\u1EBD chim l\u1EEDa dang c\xE1nh, n\xE9t c\xE1nh l\xE0 n\xE9t tr\u1EADn." }, "item.dp_tran_van_nhac": { "name": "V\u1EA1n Nh\u1EA1c Tr\u1EA5n S\u01A1n tr\u1EADn \u0111\u1ED3", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m bia \u0111\xE1 thu nh\u1ECF kh\u1EAFc v\u1EA1n ng\u1ECDn n\xFAi, nh\u1EA5c l\xEAn n\u1EB7ng nh\u01B0 nh\u1EA5c c\u1EA3 d\xE3y n\xFAi." }, "item.dp_tran_tru_tien_kiem": { "name": "Tru Ti\xEAn Ki\u1EBFm tr\u1EADn \u0111\u1ED3", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "B\u1EE9c h\u1ECDa c\u1ED5 v\u1EBD b\u1ED1n thanh ki\u1EBFm treo tr\xEAn b\u1ED1n c\u1EEDa, m\xE9p gi\u1EA5y c\xF3 v\u1EBFt c\u1EAFt." }, "item.dp_tran_hon_nguyen_tu_linh": { "name": "H\u1ED7n Nguy\xEAn T\u1EE5 Linh tr\u1EADn \u0111\u1ED3", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Ng\u1ECDc gi\u1EA3n kh\xF4ng m\xE0u, trong nh\u01B0 n\u01B0\u1EDBc, nh\xECn l\xE2u th\u1EA5y tr\u1EDDi \u0111\u1EA5t m\u1EDBi m\u1EDF." }, "item.dp_tran_cau_hon": { "name": "C\xE2u H\u1ED3n tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "T\u1EA5m da ng\u01B0\u1EDDi thu\u1ED9c m\u1ECFng, ch\u1EEF vi\u1EBFt b\u1EB1ng m\u1EF1c \u0111en pha tro h\u01B0\u01A1ng." }, "item.dp_tran_huyet_te": { "name": "Huy\u1EBFt T\u1EBF tr\u1EADn \u0111\u1ED3", "quality": 3, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB x\u01B0\u01A1ng kh\u1EAFc ch\u1EEF, r\xE3nh ch\u1EEF c\xF2n \u0111\xF3ng c\u1EB7n m\xE1u kh\xF4." }, "item.dp_tran_tu_hon": { "name": "T\u1EE5 H\u1ED3n tr\u1EADn \u0111\u1ED3", "quality": 4, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB x\u01B0\u01A1ng \u0111en, ch\u1EEF kh\u1EAFc b\u1EB1ng m\xF3ng tay, \u0111\u1ECDc l\xEAn nghe l\u1EA1nh g\xE1y." }, "item.dp_tran_van_huyet": { "name": "V\u1EA1n Huy\u1EBFt tr\u1EADn \u0111\u1ED3", "quality": 5, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB x\u01B0\u01A1ng \u0111\u1ECF th\u1EABm, r\xE3nh ch\u1EEF \u1EE9a m\xE1u t\u01B0\u01A1i d\xF9 \u0111\xE3 kh\u1EAFc t\u1EEB l\xE2u." }, "item.dp_tran_cuu_u": { "name": "C\u1EEDu U tr\u1EADn \u0111\u1ED3", "quality": 6, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB x\u01B0\u01A1ng \u0111en c\xF3 ch\xEDn l\u1ED7, th\u1ED5i v\xE0o nghe nh\u01B0 gi\xF3 l\xF9a trong m\u1ED9." }, "item.dp_tran_huyet_hai": { "name": "Huy\u1EBFt H\u1EA3i tr\u1EADn \u0111\u1ED3", "quality": 7, "cat": "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF", "desc": "Th\u1EBB x\u01B0\u01A1ng ng\xE2m m\xE1u, \u0111\u1EB7t xu\u1ED1ng \u0111\xE2u l\xE0 ch\u1ED7 \u0111\xF3 loang \u0111\u1ECF." }, "item.ngu_thu_an": { "name": "Ng\u1EF1 Th\xFA \u1EA4n", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Th\u1EE7 \u1EA5n c\u1EE7a ng\u01B0\u1EDDi ch\u0103n y\xEAu, ng\xF3n c\xE1i b\u1EA5m v\xE0o l\xF2ng b\xE0n tay, ba nh\u1ECBp th\u1EDF th\xEC con th\xFA \u0111ang g\u1EA7m c\u0169ng c\xFAi \u0111\u1EA7u. \u0110\xE1nh cho n\xF3 ki\u1EC7t s\u1EE9c r\u1ED3i m\u1EDBi k\u1EBFt \u1EA5n, k\u1EBFt s\u1EDBm th\xEC n\xF3 c\u1EAFn g\xE3y tay." }, "item.nhiep_hach_thuat": { "name": "Nhi\u1EBFp H\u1EA1ch Thu\u1EADt", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Thu\u1EADt c\u1EE7a th\u1EE3 kh\xF4i l\u1ED7i, m\u1ED9t s\u1EE3i th\u1EA7n th\u1EE9c lu\u1ED3n v\xE0o h\u1EA1ch, kh\xF4i l\u1ED7i \u0111\u1ECBch \u0111\u1EE9ng kh\u1EF1ng nh\u01B0 b\u1ECB r\xFAt d\xE2y. Mu\u1ED1n l\u1EA5y nguy\xEAn th\xE2n th\xEC ph\u1EA3i \u0111\xE1nh g\xE3y tay ch\xE2n n\xF3 tr\u01B0\u1EDBc." }, "item.do_pho_moc_nhan": { "name": "\u0110\u1ED3 Ph\u1ED5 M\u1ED9c Nh\xE2n", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDc gi\u1EA3n th\xF4, v\u1EBD m\u1ED9t ng\u01B0\u1EDDi g\u1ED7 ch\u01B0a kh\u1EAFc m\u1EB7t, th\xE1o r\u1EDDi m\u01B0\u1EDDi hai kh\u1EDBp. B\xE0i nh\u1EADp m\xF4n c\u1EE7a th\u1EE3 kh\xF4i, g\u1ED7 th\u01B0\u1EDDng c\u0169ng r\xE1p \u0111\u01B0\u1EE3c." }, "item.do_pho_moc_hau": { "name": "\u0110\u1ED3 Ph\u1ED5 M\u1ED9c H\u1EA7u", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD con kh\u1EC9 g\u1ED7, \u0111u\xF4i l\xE0 s\u1EE3i x\xEDch \u0111\u1ED3ng, mi\u1EC7ng gi\u1EA5u \u1ED1ng t\xEAn. L\u1EDDi ch\xFA d\u1EB7n kh\u1EDBp vai ph\u1EA3i l\u1ECFng th\xEC n\xF3 m\u1EDBi leo \u0111\u01B0\u1EE3c x\xE0." }, "item.do_pho_moc_lang": { "name": "\u0110\u1ED3 Ph\u1ED5 M\u1ED9c Lang", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD s\xF3i g\u1ED7 thi\u1EBFt m\u1ED9c, r\u0103ng \u0111inh s\u1EAFt \u0111\xF3ng ng\u01B0\u1EE3c. B\xEAn l\u1EC1 c\xF3 h\xECnh b\xE1nh r\u0103ng trong b\u1EE5ng, ghi ph\u1EA3i l\u1EAFp xu\xF4i chi\u1EC1u m\u1EB7t tr\u1EDDi." }, "item.do_pho_dong_giap": { "name": "\u0110\u1ED3 Ph\u1ED5 \u0110\u1ED3ng Gi\xE1p", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDc gi\u1EA3n kh\u1EAFc ng\u01B0\u1EDDi \u0111\u1ED3ng canh c\u1EA5m ch\u1EBF, k\xE8m ph\xE9p \u0111\xFAc gi\xE1p li\u1EC1n th\xE2n. Th\u1EA7n th\u1EE9c d\xF2 v\xE0o nghe ti\u1EBFng b\xFAa g\xF5 \u0111\u1ED3ng v\u1ECDng ra." }, "item.do_pho_dong_hac": { "name": "\u0110\u1ED3 Ph\u1ED5 \u0110\u1ED3ng H\u1EA1c", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD h\u1EA1c \u0111\u1ED3ng s\u1EA3i c\xE1nh h\u01A1n tr\u01B0\u1EE3ng, t\u1EEBng chi\u1EBFc l\xF4ng l\xE0 m\u1ED9t l\u01B0\u1EE1i dao m\u1ECFng. N\u1EEDa gi\u1EA3n ghi c\xE1ch m\xE0i l\xF4ng cho nh\u1EB9 m\xE0 kh\xF4ng g\xE3y." }, "item.do_pho_thiet_thi": { "name": "\u0110\u1ED3 Ph\u1ED5 Thi\u1EBFt Thi", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDc gi\u1EA3n \u0111en c\u1EE7a ma t\xF4ng, v\u1EBD ch\xEDn ch\u1ED7 \u0111\xF3ng \u0111inh tr\xEAn kh\u1EDBp m\u1ED9t c\xE1i x\xE1c. C\u1EA7m l\xE2u th\u1EA5y l\u1EA1nh tay, nh\u01B0 c\xF3 ai n\u1EAFm l\u1EA1i." }, "item.do_pho_cu_khoi": { "name": "\u0110\u1ED3 Ph\u1ED5 C\u1EF1 Kh\xF4i", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDc gi\u1EA3n v\u1EBD ng\u01B0\u1EDDi \u0111\u1ED3ng cao hai tr\u01B0\u1EE3ng, gi\u1EEFa ng\u1EF1c l\xE0 m\u1ED9t l\xF2 \u0111\xFAc nh\u1ECF. Ch\xFA th\xEDch n\xF3i l\u1EEDa l\xF2 ph\u1EA3i m\u1ED3i b\u1EB1ng l\xF5i kh\xF4i, c\u1EE7i th\u01B0\u1EDDng kh\xF4ng ch\xE1y." }, "item.do_pho_khoi_binh": { "name": "\u0110\u1ED3 Ph\u1ED5 Kh\xF4i Binh", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDc gi\u1EA3n c\u1ED5 th\u1EDDi \u0110o\u1EA1n Thi\xEAn, v\u1EBD l\xEDnh kh\xF4i l\u1ED7i k\xE8m s\u1ED1 hi\u1EC7u \u0111\u1ED9i kh\u1EAFc tr\xEAn gi\xE1p. \u0110\u1ED3 ph\u1ED5 c\u1EE7a qu\xE2n doanh, n\xE9t v\u1EBD ngay h\xE0ng nh\u01B0 \u0111i\u1EC3m binh." }, "item.do_pho_khoi_tuong": { "name": "\u0110\u1ED3 Ph\u1ED5 Kh\xF4i T\u01B0\u1EDBng", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": 'Ng\u1ECDc gi\u1EA3n v\xE0ng s\u1EABm, v\u1EBD kh\xF4i l\u1ED7i \u0111\u1ED9i tr\u01B0\u1EDFng m\u0169 c\u1EAFm l\xF4ng \u0111\u1ECF. Ph\u1EA7n l\xF5i ch\u1EC9 v\u1EBD m\u1ED9t v\xF2ng tr\xF2n tr\u1ED1ng, ghi "d\xF9ng l\xF5i c\u1ED5, l\xF5i nay kh\xF4ng ch\u1ECBu n\u1ED5i".' }, "item.duong_hon_quyet": { "name": "D\u01B0\u1EE1ng H\u1ED3n Quy\u1EBFt", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Ph\xE1p nh\u1EADp m\xF4n c\u1EE7a qu\u1EF7 tu, l\u1EA5y h\u01A1i l\u1EA1nh trong \u0111an \u0111i\u1EC1n l\xE0m t\u1ED5 cho m\u1ED9t h\u1ED3n l\u1EA1c. \u0110\xEAm ng\u1ED3i thi\u1EC1n nghe c\xF3 ti\u1EBFng ai th\u1EDF b\xEAn tai." }, "item.luyen_hon_quyet": { "name": "Luy\u1EC7n H\u1ED3n Quy\u1EBFt", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "R\xE8n h\u1ED3n nh\u01B0 r\xE8n s\u1EAFt, m\u1ED7i \u0111\xEAm nh\xFAng h\u1ED3n nu\xF4i v\xE0o \xE2m kh\xED cho c\u1EE9ng l\u1EA1i. H\u1ED3n luy\u1EC7n xong kh\xF4ng tan d\u01B0\u1EDBi n\u1EAFng tr\u01B0a." }, "item.duong_quy_kinh": { "name": "D\u01B0\u1EE1ng Qu\u1EF7 Kinh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Kinh c\u1EE7a c\xE1c l\xE3o qu\u1EF7 tu, d\u1EA1y nu\xF4i hai h\u1ED3n c\xF9ng l\xFAc m\xE0 kh\xF4ng \u0111\u1EC3 ch\xFAng c\u1EAFn nhau. Ng\u01B0\u1EDDi luy\u1EC7n th\xE2n l\u1EA1nh nh\u01B0 n\u01B0\u1EDBc gi\u1EBFng." }, "item.bach_quy_chan_kinh": { "name": "B\xE1ch Qu\u1EF7 Ch\xE2n Kinh", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Ch\xE9p tr\xEAn da ng\u01B0\u1EDDi, ch\u1EEF vi\u1EBFt b\u1EB1ng tro h\u01B0\u01A1ng c\xFAng. Qu\u1EF7 trong tay k\u1EBB luy\u1EC7n th\xE0nh nghe l\u1EC7nh nh\u01B0 con nghe cha." }, "item.u_minh_quy_dien": { "name": "U Minh Qu\u1EF7 \u0110i\u1EC3n", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "T\u01B0\u01A1ng truy\u1EC1n ch\xE9p l\u1EA1i t\u1EEB l\u1EDDi U Minh Qu\u1EF7 M\u1EABu. Ng\u01B0\u1EDDi luy\u1EC7n th\xE0nh b\u01B0\u1EDBc qua b\xE3i tha ma, oan h\u1ED3n t\u1EF1 tr\xE1nh \u0111\u01B0\u1EDDng c\xFAi \u0111\u1EA7u." }, "item.hoang_tuyen_quy_kinh": { "name": "Ho\xE0ng Tuy\u1EC1n Qu\u1EF7 Kinh", "quality": 7, "cat": "Ng\u1EF1 Linh", "desc": "Kinh kh\u1EAFc tr\xEAn t\u1EA5m bia \u0111\xE1 v\u1EDBt l\xEAn t\u1EEB m\u1ED9t con s\xF4ng ng\u1EA7m ch\u1EA3y d\u01B0\u1EDBi ch\xEDn t\u1EA7ng \u0111\u1EA5t. Ng\u01B0\u1EDDi luy\u1EC7n t\u1EDBi t\u1EA7ng cu\u1ED1i, h\u01A1i th\u1EDF l\u1EA1nh nh\u01B0 n\u01B0\u1EDBc Ho\xE0ng Tuy\u1EC1n, qu\u1EF7 t\u1ED1t quanh m\xECnh \u0111\u1EC1u qu\u1EF3." }, "item.nhiep_hon_thuat": { "name": "Nhi\u1EBFp H\u1ED3n Thu\u1EADt", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Ng\xF3n tay v\u1EA1ch m\u1ED9t v\xF2ng \xE2m \u1EA5n l\xEAn tr\xE1n k\u1EBB s\u1EAFp ch\u1EBFt, h\u1ED3n v\u1EEBa l\xECa x\xE1c \u0111\xE3 b\u1ECB k\xE9o v\xE0o tay \xE1o. Ra tay s\u1EDBm th\xEC h\u1ED3n c\xF2n b\xE1m th\xE2n, ch\u1EC9 \u0111\xE1nh m\xE0 kh\xF4ng thu \u0111\u01B0\u1EE3c." }, "item.thieu_hon_quyet": { "name": "Thi\xEAu H\u1ED3n Quy\u1EBFt", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Ch\xE2m l\u1EEDa xanh v\xE0o h\u1ED3n nu\xF4i, \u0111\u1ED1t m\u1ED9t ph\u1EA7n \xE2m kh\xED c\u1EE7a n\xF3 truy\u1EC1n sang th\xE2n ch\u1EE7. H\u1ED3n r\xEDt l\xEAn nh\u01B0 gi\xF3 l\xF9a khe c\u1EEDa, v\u1EBFt th\u01B0\u01A1ng c\u1EE7a ch\u1EE7 li\u1EC1n l\u1EA1i." }, "item.quy_khoc_thuat": { "name": "Qu\u1EF7 Kh\u1ED1c Thu\u1EADt", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Ch\u1EE7 h\xFA m\u1ED9t ti\u1EBFng, m\u1ECDi h\u1ED3n nu\xF4i c\xF9ng kh\xF3c theo r\u1ED3i nh\xE0o v\xE0o m\u1ED9t ch\u1ED7. K\u1EBB b\u1ECB nh\u1EAFm nghe ti\u1EBFng kh\xF3c tr\u01B0\u1EDBc khi th\u1EA5y qu\u1EF7." }, "item.am_hon_cham": { "name": "\xC2m H\u1ED3n Ch\xE2m", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Kim b\u1EA1c ng\xE2m n\u01B0\u1EDBc gi\u1EBFng nh\xE0 c\xF3 ng\u01B0\u1EDDi treo c\u1ED5, \u0111\xE2m v\xE0o da th\xEC h\u01A1i l\u1EA1nh ch\u1EA1y th\u1EB3ng t\u1EDBi tim. M\u1ED7i m\u0169i \u0111\xE2m, h\u1ED3n trong kim l\u1EA1i r\xF3t ch\xFAt \xE2m kh\xED ng\u01B0\u1EE3c v\xE0o ng\u01B0\u1EDDi c\u1EA7m." }, "item.chieu_hon_linh": { "name": "Chi\xEAu H\u1ED3n Linh", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Chu\xF4ng \u0111\u1ED3ng nh\u1ECF treo \u1EDF c\u1EEDa nh\xE0 c\xF3 tang. M\u1ED7i ti\u1EBFng l\u1EAFc, h\u1ED3n nu\xF4i quanh ch\u1EE7 r\xEDt theo, ti\u1EBFng chu\xF4ng l\u1EA1nh th\xEAm m\u1ED9t ph\u1EA7n." }, "item.toai_hon_dinh": { "name": "To\xE1i H\u1ED3n \u0110inh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "B\u1EA3y c\xE2y \u0111inh quan t\xE0i r\xFAt t\u1EEB m\u1ED9 c\u1ED5. \u0110inh tr\xFAng k\u1EBB mang H\u1ED3n \u1EA5n th\xEC \u1EA5n v\u1EE1, h\u1ED3n k\u1EBB \u0111\xF3 rung nh\u01B0 chu\xF4ng n\u1EE9t." }, "item.bach_quy_phien": { "name": "B\xE1ch Qu\u1EF7 Phi\xEAn", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "C\u1EDD \u0111en th\xEAu tr\u0103m m\u1EB7t qu\u1EF7, c\xE0ng nhi\u1EC1u h\u1ED3n nu\xF4i quanh ch\u1EE7, m\u1EB7t qu\u1EF7 tr\xEAn c\u1EDD c\xE0ng m\u1EDF m\u1EAFt. Ph\u1EA5t l\xEAn th\xEC s\u01B0\u01A1ng \xE2m cu\u1ED1n t\u1EDBi nh\u01B0 \u0111o\xE0n \u0111\u01B0a ma." }, "item.tang_hon_chung": { "name": "T\xE1ng H\u1ED3n Chung", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "Chu\xF4ng \u0111\u1ED3ng treo trong mi\u1EBFu th\u1ED5 \u0111\u1ECBa m\u1ED9t l\xE0ng b\u1ECB \u0111\u1ED3 s\xE1t, d\xE2y chu\xF4ng b\u1EC7n b\u1EB1ng t\xF3c ng\u01B0\u1EDDi ch\u1EBFt. G\xF5 ch\xEDn ti\u1EBFng, H\u1ED3n \u1EA5n tr\xEAn ng\u01B0\u1EDDi k\u1EBB \u0111\u1ECBch v\u1EE1 theo t\u1EEBng ti\u1EBFng m\u1ED9t." }, "item.duong_hon_moc": { "name": "D\u01B0\u1EE1ng H\u1ED3n M\u1ED9c", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Kh\xFAc g\u1ED7 h\xF2e gi\xE0 m\u1ECDc tr\xEAn m\u1ED9, s\u1EDD v\xE0o m\xE1t l\u1EA1nh. H\u1ED3n nu\xF4i tr\xFA trong th\u1EDB g\u1ED7, m\u1ED7i nh\u1ECBp th\u1EDF l\u1EA1i \u0111\u1EB7c th\xEAm m\u1ED9t ch\xFAt." }, "item.tu_hon_binh": { "name": "T\u1EE5 H\u1ED3n B\xECnh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "B\xECnh s\u1EE9 tr\u1EAFng n\xFAt s\xE1p \u0111en, l\u1EAFc l\xEAn nghe trong c\xF3 ti\u1EBFng th\xEC th\u1EA7m. Th\xEAm m\u1ED9t h\u1ED3n \u1EDF l\u1EA1i b\xEAn ch\u1EE7, m\u1EDF n\xFAt l\xE0 h\u1ED3n ra ngay." }, "item.van_hon_phien": { "name": "V\u1EA1n H\u1ED3n Phi\xEAn", "quality": 7, "cat": "Ng\u1EF1 Linh", "desc": "C\u1EDD \u0111en nh\u1ED1t m\u01B0\u1EDDi v\u1EA1n oan h\u1ED3n, m\u1ED7i h\u1ED3n l\xE0 m\u1ED9t tu s\u0129 t\u1EEBng ch\u1EBFt d\u01B0\u1EDBi tay ch\u1EE7 c\u0169. Ph\u1EA5t l\xEAn, gi\xF3 \xE2m g\xE0o kh\u1EAFp tr\u1EADn, k\u1EBB nghe \u0111\u1EE9ng ch\u1EBFt l\u1EB7ng." }, "item.van_quy_phien": { "name": "V\u1EA1n Qu\u1EF7 Phi\xEAn", "quality": 7, "cat": "Ng\u1EF1 Linh", "desc": "C\u1EDD \u0111en c\u1EAFm tr\xEAn Qu\u1EF7 V\u01B0\u01A1ng \u1EA4n, m\u1EB7t c\u1EDD chi ch\xEDt t\xEAn ng\u01B0\u1EDDi ch\u1EBFt. Ph\u1EA5t c\u1EDD, \xE2m binh b\u1ED1n ph\xEDa k\xE9o \u0111\u1EBFn c\xFAi \u0111\u1EA7u r\u1ED3i x\xF4ng l\xEAn." }, "item.moc_khoi_quyet": { "name": "M\u1ED9c Kh\xF4i Quy\u1EBFt", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Kh\u1EA9u quy\u1EBFt nh\u1EADp m\xF4n c\u1EE7a th\u1EE3 kh\xF4i, d\u1EA1y n\u1ED1i th\u1EA7n th\u1EE9c v\xE0o h\u1EA1ch g\u1ED7 nh\u01B0 bu\u1ED9c d\xE2y di\u1EC1u. M\u1ED9t ng\u01B0\u1EDDi m\u1ED9t con, d\xE2y c\u0103ng th\xEC n\xF3 b\u01B0\u1EDBc, d\xE2y ch\xF9ng th\xEC n\xF3 \u0111\u1EE9ng." }, "item.huyen_ti_quyet": { "name": "Huy\u1EC1n Ti Quy\u1EBFt", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Luy\u1EC7n th\u1EA7n th\u1EE9c m\u1EA3nh nh\u01B0 t\u01A1, qu\u1EA5n v\xE0o m\u01B0\u1EDDi ng\xF3n r\u1ED3i bu\xF4ng ra t\u1EEBng s\u1EE3i. T\u01A1 c\xE0ng m\u1EA3nh c\xE0ng b\u1EC1n, con kh\xF4i \u0111i xa v\xE0i tr\u01B0\u1EE3ng v\u1EABn nghe tay ch\u1EE7." }, "item.bach_khoi_tam_kinh": { "name": "B\xE1ch Kh\xF4i T\xE2m Kinh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "T\xE2m kinh chia th\u1EA7n th\u1EE9c l\xE0m hai m\u1EA1ch, m\u1ED7i m\u1EA1ch gi\u1EEF m\u1ED9t con kh\xF4i m\xE0 kh\xF4ng r\u1ED1i nhau. Ng\u01B0\u1EDDi luy\u1EC7n l\xE2u ng\xE0y hai tay vi\u1EBFt hai ch\u1EEF kh\xE1c nhau m\u1ED9t l\xFAc." }, "item.tao_hoa_khoi_kinh": { "name": "T\u1EA1o H\xF3a Kh\xF4i Kinh", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Kinh c\u1EE7a m\u1ED9t \u0111\u1EDDi t\xF4ng s\u01B0 c\u01A1 quan, ch\xE9p c\xE1ch gieo m\u1ED9t \u0111i\u1EC3m linh t\xEDnh v\xE0o h\u1EA1ch \u0111\u1ED3ng. Kh\xF4i l\u1ED7i theo ng\u01B0\u1EDDi n\xE0y bi\u1EBFt n\xE9 \u0111\xF2n tr\u01B0\u1EDBc khi ch\u1EE7 k\u1ECBp ra l\u1EC7nh." }, "item.cuu_chuyen_khoi_dien": { "name": "C\u1EEDu Chuy\u1EC3n Kh\xF4i \u0110i\u1EC3n", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "\u0110i\u1EC3n t\u1ECBch kh\xF4i \u0111\u1EA1o th\u01B0\u1EE3ng c\u1ED5, ch\xEDn l\u1EA7n chuy\u1EC3n h\u1EA1ch l\xE0 ch\xEDn t\u1EA7ng th\u1EA7n th\u1EE9c n\u1ED1i li\u1EC1n. Truy\u1EC1n r\u1EB1ng ng\u01B0\u1EDDi luy\u1EC7n \u0111\u1EBFn c\xF9ng kh\xF4ng ph\xE2n \u0111\u01B0\u1EE3c \u0111\xE2u l\xE0 tay m\xECnh, \u0111\xE2u l\xE0 tay kh\xF4i." }, "item.khu_khoi_thuat": { "name": "Khu Kh\xF4i Thu\u1EADt", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Ch\u1EE7 ra \u0111\xF2n tr\u01B0\u1EDBc, m\u01B0\u1EDDi ng\xF3n gi\u1EADt d\xE2y m\u1ED9t nh\u1ECBp, c\u1EA3 b\u1EA7y kh\xF4i l\u1ED7i theo \u0111\xF3 \u0111\xE1nh v\xE0o c\xF9ng m\u1ED9t ch\u1ED7. Ti\u1EBFng kh\u1EDBp g\u1ED7 kh\u1EDBp \u0111\u1ED3ng nghi\u1EBFn l\xEAn nh\u01B0 m\u01B0a \u0111\xE1." }, "item.khoi_loi_hien_than": { "name": "Kh\xF4i L\u1ED7i Hi\u1EBFn Th\xE2n", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "R\xFAt linh l\u1EF1c trong h\u1EA1ch con kh\xF4i c\xF2n l\xE0nh nh\u1EA5t, d\u1ED3n ng\u01B0\u1EE3c v\u1EC1 th\xE2n ch\u1EE7. Con kh\xF4i r\u1EA1n m\u1EA5y \u0111\u01B0\u1EDDng, ng\u01B0\u1EDDi th\xEC \u0111\u1EE9ng d\u1EADy \u0111\u01B0\u1EE3c." }, "item.khoi_loi_ban": { "name": "Kh\xF4i L\u1ED7i B\xE0n", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "B\xE0n \u0111\u1ED3ng kh\u1EAFc ch\xEDn r\xE3nh, m\u1ED7i r\xE3nh n\u1ED1i m\u1ED9t s\u1EE3i t\u01A1 t\u1EDBi h\u1EA1ch kh\xF4i. Xoay b\xE0n th\xEC tia linh l\u1EF1c b\u1EAFn ra, kh\xF4i tr\xEAn s\xE2n c\xE0ng \u0111\xF4ng, r\xE3nh s\xE1ng c\xE0ng nhi\u1EC1u." }, "item.ngan_ti_khien_hoan": { "name": "Ng\xE2n Ti Khi\xEAn Ho\xE0n", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "M\u01B0\u1EDDi chi\u1EBFc nh\u1EABn b\u1EA1c n\u1ED1i t\u01A1 th\xE9p m\u1EA3nh h\u01A1n t\xF3c, \u0111eo \u0111\u1EE7 m\u01B0\u1EDDi ng\xF3n. T\u01A1 qu\u1EA5n l\u1EA5y \u0111\u1ECBch r\u1ED3i si\u1EBFt, m\u1ED7i con kh\xF4i tr\xEAn s\xE2n k\xE9o th\xEAm m\u1ED9t \u0111\u1EA7u d\xE2y." }, "item.khoi_loi_nang": { "name": "Kh\xF4i L\u1ED7i Nang", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "T\xFAi da kh\u1EAFc tr\u1EADn thu nh\u1ECF, kh\xF4i l\u1ED7i g\u1EA5p kh\u1EDBp n\u1EB1m g\u1ECDn b\xEAn trong. Gi\u1EADt mi\u1EC7ng t\xFAi m\u1ED9t c\xE1i l\xE0 con kh\xF4i bung ra, \u0111\u1EE1 t\u1ED1n c\xF4ng l\u1EAFp." }, "item.thien_cong_hap": { "name": "Thi\xEAn C\xF4ng H\u1EA1p", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "H\u1ED9p \u0111\u1ED3 ngh\u1EC1 c\u1EE7a th\u1EE3 kh\xF4i t\xF4ng s\u01B0, trong c\xF3 \u0111\u1EE5c, d\u0169a, ch\u1ED1t \u0111\u1ED3ng t\u1EF1 b\xF2 ra v\xE1 ch\u1ED7 h\u1ECFng. \u0110eo b\xEAn h\xF4ng th\xEC gi\u1EEF th\xEAm \u0111\u01B0\u1EE3c m\u1ED9t con, con n\xE0o n\u1EE9t c\u0169ng t\u1EF1 li\u1EC1n d\u1EA7n." }, "item.thao_khoi_quyet": { "name": "Th\u1EA3o Kh\xF4i Quy\u1EBFt", "quality": 1, "cat": "Ng\u1EF1 Linh", "desc": "B\xE0i v\u1EE1 l\xF2ng c\u1EE7a th\u1EE3 kh\xF4i, t\u1EADp tr\xEAn h\xECnh nh\xE2n b\u1EC7n r\u01A1m tr\u01B0\u1EDBc khi \u0111\u01B0\u1EE3c \u0111\u1EE5ng t\u1EDBi g\u1ED7. R\u01A1m ch\xE1y r\u1ED3i th\xEC t\u1EADp l\u1EA1i, th\u1EA7n th\u1EE9c v\u1EABn nh\u1EDB \u0111\u01B0\u1EDDng d\xE2y." }, "item.xich_dong_khoi_quyet": { "name": "X\xEDch \u0110\u1ED3ng Kh\xF4i Quy\u1EBFt", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Kh\u1EA9u quy\u1EBFt c\u1EE7a l\xF2 r\xE8n kh\xF4i, d\u1EA1y nung th\u1EA7n th\u1EE9c cho n\xF3ng r\u1ED3i m\u1EDBi r\xF3t v\xE0o h\u1EA1ch \u0111\u1ED3ng. Kh\xF4i theo quy\u1EBFt n\xE0y ch\u1EADm m\xE0 l\xEC, \u0111\u1EADp m\u1EA5y c\u0169ng ch\u01B0a ch\u1ECBu ng\xE3." }, "item.thuc_khoi_chi": { "name": "Th\xFAc Kh\xF4i Ch\u1EC9", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "B\xFAng ng\xF3n tay m\u1ED9t c\xE1i, t\u01A1 th\u1EA7n th\u1EE9c rung l\xEAn nh\u01B0 d\xE2y \u0111\xE0n. Kh\xF4i l\u1ED7i tr\xEAn s\xE2n nghe ti\u1EBFng th\xEC kh\u1EDBp si\u1EBFt ch\u1EB7t, \u0111\xF2n \u0111\xE1nh ra n\u1EB7ng th\xEAm m\u1EA5y ph\u1EA7n." }, "item.khoi_ti_thoa": { "name": "Kh\xF4i Ti Thoa", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Thoi d\u1EC7t b\u1EB1ng s\u1EAFt, \u0111u\xF4i bu\u1ED9c t\u01A1 n\u1ED1i sang h\u1EA1ch c\u1EE7a t\u1EEBng con kh\xF4i. Ph\xF3ng thoi ra th\xEC c\u1EA3 \u0111\xE0n c\xF9ng k\xE9o, m\u0169i thoi lao nhanh h\u01A1n tay ng\u01B0\u1EDDi n\xE9m." }, "item.van_co_no": { "name": "V\u1EA1n C\u01A1 N\u1ED7", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "N\u1ECF l\u1EDBn kh\xF4ng ai gi\u01B0\u01A1ng n\u1ED5i b\u1EB1ng tay, ph\u1EA3i \u0111\u1EC3 kh\xF4i l\u1ED7i k\xE9o d\xE2y v\xE0 n\u1EA1p t\xEAn. Kh\xF4i tr\xEAn s\xE2n c\xE0ng \u0111\xF4ng, m\u01B0a t\xEAn tr\xFAt xu\u1ED1ng c\xE0ng d\xE0y." }, "item.thien_la_khoi_vong": { "name": "Thi\xEAn La Kh\xF4i V\xF5ng", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "L\u01B0\u1EDBi t\u01A1 t\u1EB1m n\xFAi t\u1EA9m d\u1EA7u \u0111\u1ED3ng, b\u1ED1n g\xF3c bu\u1ED9c v\xE0o b\u1ED1n con kh\xF4i. Kh\xF4i ch\u1EA1y v\xE2y m\u1ED9t v\xF2ng l\xE0 l\u01B0\u1EDBi ch\u1EE5p xu\u1ED1ng, m\u1EAFt l\u01B0\u1EDBi c\u1EE9a r\xE1ch c\u1EA3 gi\xE1p h\u1ED9 th\xE2n." }, "item.linh_giao_binh": { "name": "Linh Giao B\xECnh", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "B\xECnh s\xE0nh \u0111\u1EF1ng keo n\u1EA5u t\u1EEB nh\u1EF1a t\xF9ng v\xE0 da c\xE1, m\xF9i h\u0103ng x\u1ED9c m\u0169i. Qu\xE9t m\u1ED9t l\u1EDBp v\xE0o kh\u1EDBp n\u1EE9t, \u0111\u1EC3 qua \u0111\xEAm l\xE0 con kh\xF4i \u0111i l\u1EA1i \u0111\u01B0\u1EE3c." }, "item.duong_hach_dang": { "name": "D\u01B0\u1EE1ng H\u1EA1ch \u0110\u0103ng", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDn \u0111\xE8n d\u1EA7u nh\u1ECF treo b\xEAn h\xF4ng, l\u1EEDa xanh kh\xF4ng t\u1EAFt trong gi\xF3. H\u01A1i \u1EA5m c\u1EE7a n\xF3 th\u1EA5m v\xE0o h\u1EA1ch kh\xF4i, ch\u1ED7 r\u1EA1n t\u1EF1 li\u1EC1n l\u1EA1i t\u1EEBng ch\xFAt gi\u1EEFa tr\u1EADn." }, "item.phan_than_khoi_an": { "name": "Ph\xE2n Th\u1EA7n Kh\xF4i \u1EA4n", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "\u1EA4n \u0111\xE1 kh\u1EAFc m\u1ED9t m\u1EA1ch th\u1EA7n th\u1EE9c \u0111\xE3 t\xE1ch s\u1EB5n, \xE9p l\xEAn tr\xE1n l\xE0 c\xF3 th\xEAm m\u1ED9t s\u1EE3i d\xE2y \u0111\u1EC3 bu\xF4ng. Ng\u01B0\u1EDDi \u0111eo l\xE2u hay n\xF3i m\u01A1 b\u1EB1ng hai gi\u1ECDng." }, "item.trung_sa_tich": { "name": "Tr\u1EE9ng Sa T\xEDch", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng v\u1ECF d\xE0y m\xE0u c\xE1t, v\xF9i trong c\xE1t n\xF3ng m\u1EDBi \u1EA5m. Th\u1EB1n l\u1EB1n n\u1EDF ra bi\u1EBFt l\u1EB7n xu\u1ED1ng c\xE1t tr\u01B0\u1EDBc khi bi\u1EBFt b\xF2." }, "item.trung_bang_so": { "name": "Tr\u1EE9ng B\u1EB1ng S\u1ED3", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng chim b\u1EB1ng to b\u1EB1ng n\u1EAFm tay, v\u1ECF l\u1ED1m \u0111\u1ED1m n\xE2u. \xC1p tai v\xE0o nghe ti\u1EBFng m\u1ECF g\xF5 l\u1ED1c c\u1ED1c t\u1EEB b\xEAn trong." }, "item.trung_hac_phong_bao": { "name": "Tr\u1EE9ng H\u1EAFc Phong B\xE1o", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng \u0111en b\xF3ng, s\u1EDD v\xE0o th\u1EA5y h\u01A1i gi\xF3 l\xF9a qua k\u1EBD tay. B\xE1o con n\u1EDF ra m\u1EAFt v\xE0ng, l\u1EDBn l\xEAn c\xF3 th\u1EC3 th\xE0nh V\xE2n \u1EA2nh B\xE1o hay Truy Phong \u01AFng." }, "item.trung_bach_ngac": { "name": "Tr\u1EE9ng B\u1EA1ch Ng\u1EA1c", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng tr\u1EAFng d\xE0i nh\u01B0 qu\u1EA3 b\u1EA7u nh\u1ECF, \u0111\xE0o t\u1EEB b\xE3i b\xF9n ven s\xF4ng. Ph\u1EA3i ng\xE2m n\u1EEDa n\u01B0\u1EDBc m\u1EDBi n\u1EDF." }, "item.trung_hoa_vu_ke": { "name": "Tr\u1EE9ng H\u1ECFa V\u0169 K\xEA", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng v\u1ECF \u0111\u1ECF, c\u1EA7m l\xE2u n\xF3ng r\xE1t tay. \u1ED4 r\u01A1m l\xF3t d\u01B0\u1EDBi n\xF3 l\xFAc n\xE0o c\u0169ng x\xE9m m\u1ED9t v\u1EC7t." }, "item.trung_thanh_vu_hac": { "name": "Tr\u1EE9ng Thanh V\u0169 H\u1EA1c", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng h\u1EA1c xanh nh\u1EA1t, nh\u1EB9 nh\u01B0 kh\xF4ng. \u0110\u1EB7t tr\xEAn b\xE0n, gi\xF3 th\u1ED5i qua c\u1EEDa l\xE0 n\xF3 l\u0103n v\u1EC1 ph\xEDa gi\xF3." }, "item.trung_thanh_van_quy": { "name": "Tr\u1EE9ng Thanh V\u0103n Quy", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng r\xF9a tr\xF2n, v\u1ECF \u0111\xE3 n\u1ED5i v\xE2n \xF4 nh\u01B0 b\xE0n c\u1EDD. N\u1EB7ng g\u1EA5p ba tr\u1EE9ng th\u01B0\u1EDDng, \u0111\u1EADp kh\xF4ng v\u1EE1." }, "item.trung_boi_son_quy": { "name": "Tr\u1EE9ng B\u1ED1i S\u01A1n Quy", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng r\xF9a to b\u1EB1ng chum n\u01B0\u1EDBc, v\u1ECF b\xE1m r\xEAu \u0111\xE1 nh\u01B0 h\xF2n cu\u1ED9i l\xE2u n\u0103m. \u1EA4p tr\u0103m ng\xE0y m\u1EDBi nghe ti\u1EBFng m\xF3ng c\xE0o." }, "item.trung_liet_khong_ung": { "name": "Tr\u1EE9ng Li\u1EC7t Kh\xF4ng \u01AFng", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng x\xE1m \xE1nh th\xE9p, g\xF5 v\xE0o k\xEAu nh\u01B0 g\xF5 l\u01B0\u1EE1i \u0111ao. \u0110\u1EB7t c\u1EA1nh c\u1EEDa s\u1ED5, n\xF3 l\u0103n v\u1EC1 ph\xEDa c\xF3 gi\xF3." }, "item.trung_phan_son_ho": { "name": "Tr\u1EE9ng Ph\u1EA7n S\u01A1n H\u1ED5", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng \u0111\u1ECF s\u1EABm v\u1EB1n \u0111en, \u0111\u1EB7t l\xEAn \u1ED5 r\u01A1m th\xEC r\u01A1m x\xE9m d\u1EA7n t\u1EEBng s\u1EE3i. Ph\u1EA3i k\xEA tr\xEAn \u0111\xE1 m\u1EDBi gi\u1EEF \u0111\u01B0\u1EE3c." }, "item.trung_bich_lan_mang": { "name": "Tr\u1EE9ng B\xEDch L\xE2n M\xE3ng", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng d\xE0i, v\u1ECF m\u1EC1m xanh nh\u01B0 l\xE1 non, c\xF3 r\u1EC5 nh\u1ECF b\xE1m ra ngo\xE0i. \u0110\u1EC3 l\xE2u tr\xEAn \u0111\u1EA5t, r\u1EC5 \u1EA5y t\u1EF1 c\u1EAFm xu\u1ED1ng." }, "item.trung_ngoc_tho": { "name": "Tr\u1EE9ng Ng\u1ECDc Th\u1ED1", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng tr\u1EAFng trong nh\u01B0 ng\u1ECDc, \u0111\xEAm tr\u0103ng tr\xF2n t\u1EF1 s\xE1ng l\xEAn m\u1ED9t qu\u1EA7ng m\u1EDD. \xD4m v\xE0o l\xF2ng th\u1EA5y m\xE1t nh\u01B0 s\u01B0\u01A1ng." }, "item.trung_cam_ly": { "name": "Tr\u1EE9ng C\u1EA9m L\xFD", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Ch\xF9m tr\u1EE9ng c\xE1 n\u0103m m\xE0u b\u1ECDc trong t\xFAi l\u1EE5a \u01B0\u1EDBt, ch\u1EC9 m\u1ED9t h\u1EA1t c\xF3 con. Nu\xF4i trong ch\u1EADu n\u01B0\u1EDBc su\u1ED1i, h\u1EA1t \u1EA5y t\u1EF1 qu\u1EABy." }, "item.trung_tam_bao_dieu": { "name": "Tr\u1EE9ng T\u1EA7m B\u1EA3o \u0110i\xEAu", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng nh\u1ECF v\u1ECF v\xE0ng s\u1EABm, \u0111\xE0o \u0111\u01B0\u1EE3c d\u01B0\u1EDBi m\u1ED9t h\u0169 b\u1EA1c ch\xF4n. \u0110\u1EC3 c\u1EA1nh t\xFAi linh th\u1EA1ch th\xEC n\xF3 l\u0103n s\xE1t v\xE0o." }, "item.trung_thanh_dieu": { "name": "Tr\u1EE9ng Thanh \u0110i\u1EC3u", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng chim xanh bi\u1EBFc, tr\xEAn v\u1ECF c\xF3 ba v\u1EC7t nh\u01B0 ba ng\xF3n ch\xE2n. Ti\xEAn nh\xE2n x\u01B0a nu\xF4i lo\xE0i n\xE0y \u0111\u1EC3 \u0111\u01B0a th\u01B0." }, "item.au_trung_kim_giap": { "name": "Kim Gi\xE1p \u1EA4u Tr\xF9ng", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Con s\xE2u tr\u1EAFng cu\u1ED9n trong \u1ED1ng tre, l\u01B0ng \u0111\xE3 nh\xFA v\u1ECF \xE1nh \u0111\u1ED3ng. R\u1EAFc v\u1EE5n s\u1EAFt v\xE0o l\xE0 nghe ti\u1EBFng g\u1EB7m r\xE0o r\u1EA1o." }, "item.au_trung_doc_ngo": { "name": "\u0110\u1ED9c Ng\xF4 \u1EA4u Tr\xF9ng", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "R\u1EBFt non d\xE0i b\u1EB1ng \u0111\u1ED1t tay, c\xF2n trong v\u1ECF tr\u1EE9ng m\u1ECFng nh\u01B0 gi\u1EA5y. N\u1EB1m tr\xEAn l\xE1 m\u1EE5c \u1EA9m th\xEC ch\xE2n m\u1EDBi c\u1EE9ng." }, "item.au_trung_hac_chu": { "name": "H\u1EAFc Chu \u1EA4u Tr\xF9ng", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "B\u1ECDc t\u01A1 \u0111en to b\u1EB1ng h\u1EA1t nh\xE3n, trong c\xF3 m\u1ED9t ch\u1EA5m \u0111\u1ECF. T\u01A1 b\u1ECDc d\xEDnh tay, g\u1EE1 ra m\u1EA5t c\u1EA3 bu\u1ED5i." }, "item.au_trung_bich_hat": { "name": "B\xEDch H\u1EA1t \u1EA4u Tr\xF9ng", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "B\u1ECD c\u1EA1p non xanh nh\u1EA1t n\u1EB1m d\u01B0\u1EDBi mi\u1EBFng \u0111\xE1 \u0111\u1EAFp r\xEAu trong h\u0169. \u0110u\xF4i ch\u01B0a c\xF3 ng\xF2i m\xE0 \u0111\xE3 bi\u1EBFt cong l\xEAn d\u1ECDa ng\u01B0\u1EDDi." }, "item.au_trung_huyet_co": { "name": "Huy\u1EBFt C\u1ED5 \u1EA4u Tr\xF9ng", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "M\u1EA5y s\u1EE3i ch\u1EC9 \u0111\u1ECF ng\u1ECD ngu\u1EADy trong \u1ED1ng s\u1EE9, \u1ED1ng lu\xF4n \u1EA5m nh\u01B0 h\u01A1i ng\u01B0\u1EDDi. C\u1ED5 s\u01B0 d\u1EB7n ch\u1EDB m\u1EDF n\u1EAFp khi tay c\xF3 v\u1EBFt x\u01B0\u1EDBc." }, "item.pham_thi": { "name": "Ph\xE0m Thi", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "X\xE1c ph\xE0m nh\xE2n qu\u1EA5n chi\u1EBFu, d\xE1n ph\xF9 v\xE0ng tr\xEAn tr\xE1n \u0111\u1EC3 gi\u1EEF kh\xF4ng r\u1EEFa. Luy\u1EC7n thi nh\u1EADp m\xF4n ai c\u0169ng b\u1EAFt \u0111\u1EA7u t\u1EEB m\u1ED9t c\u1ED7 nh\u01B0 th\u1EBF." }, "item.co_mo_bach_cot": { "name": "C\u1ED5 M\u1ED9 B\u1EA1ch C\u1ED1t", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "B\u1ED9 x\u01B0\u01A1ng nguy\xEAn v\u1EB9n \u0111\xE0o \u1EDF m\u1ED9 c\u1ED5, kh\u1EDBp x\u01B0\u01A1ng x\xE2u b\u1EB1ng d\xE2y \u0111\u1ED3ng. L\u1EAFc nh\u1EB9 c\xE1i b\u1ECDc l\xE0 nghe l\xE1ch c\xE1ch." }, "item.tram_ho_thi": { "name": "Tr\u1EA7m H\u1ED3 Thi", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "X\xE1c ch\u1EBFt \u0111u\u1ED1i v\u1EDBt d\u01B0\u1EDBi \u0111\xE1y h\u1ED3, b\u1ECDc trong t\u1EA5m l\u01B0\u1EDBi c\xE1 c\xF2n \u01B0\u1EDBt s\u0169ng. Ph\u01A1i bao l\xE2u tr\xEAn c\u1EA1n, l\u01B0\u1EDBi v\u1EABn r\u1EC9 n\u01B0\u1EDBc." }, "item.huyet_tri_cot": { "name": "Huy\u1EBFt Tr\xEC C\u1ED1t", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "B\u1ED9 x\u01B0\u01A1ng v\u1EDBt t\u1EEB ao m\xE1u d\u01B0\u1EDBi \u0111\xE0n t\u1EBF c\u0169, \u0111\u1ECF th\u1EABm t\u1EEB s\u1ECD t\u1EDBi g\xF3t. Lau m\u1EA5y c\u0169ng kh\xF4ng s\u1EA1ch m\xE0u." }, "item.tu_si_thi_hai": { "name": "Tu S\u0129 Thi H\xE0i", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "X\xE1c tu s\u0129 Luy\u1EC7n Kh\xED ch\u1EBFt \u0111\xE3 l\xE2u m\xE0 da ch\u1EC9 s\u1EA1m \u0111en, g\xF5 v\xE0o c\u1EE9ng nh\u01B0 g\u1ED7 lim. Linh kh\xED trong kinh m\u1EA1ch ch\u01B0a tan h\u1EBFt." }, "item.dang_trien_thi_hai": { "name": "\u0110\u1EB1ng Tri\u1EC1n Thi H\xE0i", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "X\xE1c c\u1EAFt ra t\u1EEB g\u1ED1c d\xE2y leo c\u1ED5 th\u1EE5, d\xE2y v\u1EABn qu\u1EA5n k\xEDn t\u1EEB c\u1ED5 t\u1EDBi ch\xE2n. \u0110\u1EC3 trong b\xF3ng r\xE2m v\xE0i h\xF4m, h\u1ED1c m\u1EAFt l\u1EA1i nh\xFA m\u1EA7m non." }, "item.han_bang_thi_quan": { "name": "H\xE0n B\u0103ng Thi Quan", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Quan t\xE0i b\u0103ng c\u1EAFt t\u1EEB v\xE1ch hang V\u1EA1n B\u0103ng Thi \u0110\u1ED9ng, x\xE1c b\xEAn trong n\u1EB1m th\u1EB3ng nh\u01B0 ng\u1EE7. Gi\u1EEFa tr\u01B0a h\xE8, m\u1EB7t quan v\u1EABn \u0111\u1ECDng s\u01B0\u01A1ng." }, "item.bach_mao_thi_quan": { "name": "B\u1EA1ch Mao Thi Quan", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Quan t\xE0i g\u1ED7 h\xF2e \u0111\xF3ng b\u1EA3y c\xE2y \u0111inh \u0111\u1ED3ng. Khe n\u1EAFp th\xF2 ra m\u1EA5y s\u1EE3i l\xF4ng tr\u1EAFng, m\u1ED7i n\u0103m l\u1EA1i d\xE0i th\xEAm m\u1ED9t \u0111\u1ED1t." }, "item.huyet_ngoc_quan": { "name": "Huy\u1EBFt Ng\u1ECDc Quan", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Quan t\xE0i ng\u1ECDc \u0111\u1ECF, x\xE1c n\u1EB1m trong nh\u1EB9 nh\u01B0 b\u1EA5c m\xE0 m\xF3ng tay d\xE0i cong. \u0110\xEAm kh\xF4ng tr\u0103ng, n\u1EAFp quan t\u1EF1 h\xE9 m\u1ED9t khe." }, "item.bat_hoa_dong_cot": { "name": "B\u1EA5t H\xF3a \u0110\u1ED3ng C\u1ED1t", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "B\u1ED9 x\u01B0\u01A1ng ngh\xECn n\u0103m \u0111\xE3 h\xF3a s\u1EAFc \u0111\u1ED3ng, g\xF5 v\xE0o ng\xE2n nh\u01B0 chu\xF4ng. B\u1EBB g\xE3y m\u1ED9t kh\xFAc, qua \u0111\xEAm l\u1EA1i t\u1EF1 li\u1EC1n." }, "item.toa_hon_ho_lo": { "name": "T\u1ECFa H\u1ED3n H\u1ED3 L\xF4", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "H\u1ED3 l\xF4 kh\xF4 b\u1ECBt n\xFAt s\xE1p, nh\u1ED1t m\u1ED9t h\u1ED3n ng\u01B0\u1EDDi ch\u1EBFt \u0111\xF3i. \xC1p tai v\xE0o nghe ti\u1EBFng ai h\xFAp ch\xE1o." }, "item.hon_phien_tan": { "name": "H\u1ED3n Phi\xEAn T\xE0n", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "L\xE1 phi\xEAn \u0111en r\xE1ch m\xE9p, c\xF2n gi\u1EEF m\u1ED9t \xE2m h\u1ED3n ch\u01B0a tan. Kh\xF4ng c\xF3 gi\xF3 m\xE0 v\u1EA1t v\u1EA3i v\u1EABn kh\u1EBD lay." }, "item.tram_hon_binh": { "name": "Tr\u1EA7m H\u1ED3n B\xECnh", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "B\xECnh g\u1ED1m s\u1EE9t mi\u1EC7ng n\xFAt b\u1EB1ng rong kh\xF4, nh\u1ED1t h\u1ED3n m\u1ED9t th\u1EE7y qu\u1EF7. L\u1EAFc l\xEAn nghe n\u01B0\u1EDBc \xF3c \xE1ch, d\xF9 trong b\xECnh kh\xF4ng c\xF3 gi\u1ECDt n\xE0o." }, "item.chien_hon_phien": { "name": "Chi\u1EBFn H\u1ED3n Phi\xEAn", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "L\xE1 c\u1EDD tr\u1EADn nh\u1EB7t \u1EDF c\u1ED5 chi\u1EBFn tr\u01B0\u1EDDng, v\u1EA3i m\u1EE5c m\xE0 c\xE1n s\u1EAFt c\xF2n ch\u1EAFc. C\u1EAFm xu\u1ED1ng \u0111\u1EA5t l\xE0 nghe ti\u1EBFng b\u01B0\u1EDBc ch\xE2n \u0111i \u0111\u1EC1u." }, "item.le_hon_phien": { "name": "L\u1EC7 H\u1ED3n Phi\xEAn", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Phi\xEAn tr\u1EAFng th\xEAu ch\u1EEF b\u1EB1ng t\xF3c ng\u01B0\u1EDDi, nh\u1ED1t m\u1ED9t l\u1EC7 qu\u1EF7 o\xE1n kh\xED ch\u01B0a tan. M\u1EDF cu\u1ED9n ra l\xE0 c\xF3 ti\u1EBFng kh\xF3c r\u1EC9 r\u1EA3." }, "item.u_minh_hon_phien": { "name": "U Minh H\u1ED3n Phi\xEAn", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Phi\xEAn l\u1EE5a \u0111en ch\xEDn t\u1EA7ng, t\u1EA7ng trong c\xF9ng c\xF3 gi\u1ECDng n\u1EEF h\xE1t ru. Ai c\u1EA7m l\xE2u th\xEC tay l\u1EA1nh t\u1EDBi khu\u1EF7u." }, "item.bach_quy_vuong_phien": { "name": "B\xE1ch Qu\u1EF7 V\u01B0\u01A1ng Phi\xEAn", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "Phi\xEAn \u0111en vi\u1EC1n x\u01B0\u01A1ng s\u1ECD, giam h\u1ED3n m\u1ED9t qu\u1EF7 v\u01B0\u01A1ng m\u1EA5t ngai. Gi\u01B0\u01A1ng l\xEAn gi\u1EEFa \u0111\xEAm, quanh ch\xE2n c\xF3 tr\u0103m b\xF3ng ng\u01B0\u1EDDi qu\u1EF3 xu\u1ED1ng." }, "item.linh_nhuc_can": { "name": "Linh Nh\u1EE5c Can", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Th\u1ECBt y\xEAu th\xFA c\u1EA5p th\u1EA5p ph\u01A1i kh\xF4 v\u1EDBi mu\u1ED1i linh th\u1EA3o. Th\xFA non ng\u1EEDi th\u1EA5y l\xE0 ch\u1EA1y t\u1EDBi c\u1ECD ch\xE2n." }, "item.yeu_lang_nhuc": { "name": "Y\xEAu Lang Nh\u1EE5c", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Th\u1ECBt s\xF3i y\xEAu \u01B0\u1EDBp huy\u1EBFt, g\xF3i l\xE1 chu\u1ED1i. Th\xFA \u0103n v\xE0o l\xF4ng m\u01B0\u1EE3t h\u1EB3n, \u0111\xEAm \u1EA5y ng\u1EE7 say kh\xF4ng \u0111\u1ED9ng." }, "item.bach_thu_cao": { "name": "B\xE1ch Th\xFA Cao", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Cao n\u1EA5u t\u1EEB x\u01B0\u01A1ng tr\u0103m lo\xE0i th\xFA, \u0111en s\xE1nh nh\u01B0 h\u1EAFc \xEDn. M\u1ED7i b\u1EEFa m\u1ED9t vi\xEAn b\u1EB1ng \u0111\u1EA7u ng\xF3n tay l\xE0 \u0111\u1EE7." }, "item.tu_lan_thao": { "name": "T\u1EED L\xE2n Th\u1EA3o", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "C\u1ECF t\xEDa l\xE1 nh\u01B0 v\u1EA3y c\xE1, m\u1ECDc n\u01A1i y\xEAu th\xFA l\u1EDBn hay n\u1EB1m. Th\xFA \u0103n r\u1ED3i da c\u1EE9ng l\xEAn, v\u1EA3y s\u1EEBng m\u1ECDc nhanh." }, "item.thu_vuong_tuy": { "name": "Th\xFA V\u01B0\u01A1ng T\u1EE7y", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "T\u1EE7y x\u01B0\u01A1ng y\xEAu v\u01B0\u01A1ng \u0111\xF4ng th\xE0nh kh\u1ED1i ng\xE0, \u0111\u1EF1ng trong h\u1ED9p ng\u1ECDc. M\u1ED9t kh\u1ED1i \u0111\u1EE7 th\xFA \u0103n ba th\xE1ng." }, "item.thai_co_thu_huyet": { "name": "Th\xE1i C\u1ED5 Th\xFA Huy\u1EBFt", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "M\u1ED9t gi\u1ECDt m\xE1u th\xFA th\u1EDDi th\xE1i c\u1ED5 phong trong h\u1ED5 ph\xE1ch. Th\xFA nh\u1ECF li\u1EBFm qua l\xE0 g\u1EA7m l\xEAn nh\u01B0 v\u1EEBa nh\u1EDB ra t\u1ED5 ti\xEAn m\xECnh." }, "item.am_thi_tho": { "name": "\xC2m Thi Th\u1ED5", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "\u0110\u1EA5t \u0111en l\u1EA5y d\u01B0\u1EDBi \u0111\xE1y huy\u1EC7t c\u0169, b\xF3p l\u1EA1i th\u1EA5y l\u1EA1nh v\xE0 nh\u1EDBt. R\u1EAFc l\xEAn x\xE1c luy\u1EC7n th\xEC da n\xF3 b\u1EDBt n\u1EE9t." }, "item.thi_am_chau": { "name": "Thi \xC2m Ch\xE2u", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "H\u1EA1t ch\xE2u x\xE1m k\u1EBFt t\u1EEB thi kh\xED trong mi\u1EC7ng x\xE1c l\xE2u n\u0103m. Nh\xE9t v\xE0o mi\u1EC7ng thi luy\u1EC7n, n\xF3 ng\u1EADm c\u1EA3 \u0111\xEAm kh\xF4ng nh\u1EA3." }, "item.thi_huyet_tinh": { "name": "Thi Huy\u1EBFt Tinh", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "M\xE1u \u0111en \u0111\xF4ng l\u1EA1i th\xE0nh tinh th\u1EC3 d\u01B0\u1EDBi tim c\u01B0\u01A1ng thi. Thi luy\u1EC7n nu\u1ED1t v\xE0o th\xEC m\xF3ng tay d\xE0i th\xEAm." }, "item.cuong_sat_tinh": { "name": "C\u01B0\u01A1ng S\xE1t Tinh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Kh\u1ED1i s\xE1t kh\xED \u0111\u1EB7c l\u1EA1i \u1EDF huy\u1EC7t d\u01B0\u1EE1ng thi tr\u0103m n\u0103m, s\u1EDD v\xE0o bu\u1ED1t nh\u01B0 b\u0103ng. Thi \u0103n v\xE0o th\xEC da c\u1EE9ng nh\u01B0 s\u1EAFt ngu\u1ED9i." }, "item.huyet_sat_chau": { "name": "Huy\u1EBFt S\xE1t Ch\xE2u", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "H\u1EA1t ch\xE2u \u0111\u1ECF s\u1EABm k\u1EBFt trong b\u1EE5ng phi c\u01B0\u01A1ng, b\xEAn trong nh\u01B0 c\xF3 m\xE1u cu\u1ED9n. C\u1EA7m l\xE2u th\xEC ng\xF3n tay t\xEA d\u1EA1i." }, "item.cuu_u_thi_hach": { "name": "C\u1EEDu U Thi H\u1EA1ch", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "H\u1EA1ch thi \u0111en tuy\u1EC1n l\u1EA5y t\u1EEB x\xE1c c\u1ED5 tu ch\xF4n d\u01B0\u1EDBi ch\xEDn t\u1EA7ng \u0111\u1EA5t. \u0110\u1EB7t xu\u1ED1ng \u0111\xE2u, c\u1ECF quanh \u0111\xF3 h\xE9o m\u1ED9t v\xF2ng." }, "item.hon_phach_tan": { "name": "H\u1ED3n Ph\xE1ch T\xE0n", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "M\u1EA3nh h\u1ED3n v\u1EE5n ch\u01B0a k\u1ECBp tan, ch\u1EADp ch\u1EDDn nh\u01B0 \u0111\u1ED1m l\xE2n tinh. B\u1ECF v\xE0o phi\xEAn, \xE2m h\u1ED3n b\xEAn trong nu\u1ED1t m\u1EA5t ngay." }, "item.am_phach_chau": { "name": "\xC2m Ph\xE1ch Ch\xE2u", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "H\u1EA1t ch\xE2u m\u1EDD \u0111\u1EE5c k\u1EBFt t\u1EEB \xE2m kh\xED n\u01A1i c\xF3 ng\u01B0\u1EDDi ch\u1EBFt oan. Soi l\xEAn \u0111\xE8n th\u1EA5y m\u1ED9t b\xF3ng ng\u01B0\u1EDDi nh\u1ECF \u0111\u1EE9ng b\xEAn trong." }, "item.oan_hon_tinh": { "name": "O\xE1n H\u1ED3n Tinh", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "O\xE1n kh\xED c\u1EE7a c\u1EA3 m\u1ED9t l\xE0ng ch\u1EBFt d\u1ECBch \u0111\u1ECDng l\u1EA1i th\xE0nh vi\xEAn \u0111\xE1 xanh. C\u1EA7m v\xE0o th\xEC b\xEAn tai c\xF3 ti\u1EBFng g\u1ECDi t\xEAn ai \u0111\xF3." }, "item.le_phach_tinh": { "name": "L\u1EC7 Ph\xE1ch Tinh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Gi\u1ECDt l\u1EC7 \u0111\xF4ng c\u1EE7a l\u1EC7 qu\u1EF7, trong nh\u01B0 th\u1EE7y tinh m\xE0 l\u1EA1nh nh\u01B0 b\u0103ng. H\u1ED3n phi\xEAn nu\u1ED1t v\xE0o th\xEC ti\u1EBFng kh\xF3c trong v\u1EA3i to h\u01A1n." }, "item.u_minh_hon_tinh": { "name": "U Minh H\u1ED3n Tinh", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "H\u1ED3n tinh l\u1EA5y t\u1EEB \xE2m \u0111\u1ECBa s\xE2u, t\u1ECFa \xE1nh xanh t\xEDm. \u0110\u1EB7t trong ph\xF2ng th\xEC \u0111\xE8n d\u1EA7u ch\xE1y th\u1EA5p h\u1EB3n xu\u1ED1ng." }, "item.cuu_u_hon_hach": { "name": "C\u1EEDu U H\u1ED3n H\u1EA1ch", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "H\u1EA1ch h\u1ED3n c\u1EE7a qu\u1EF7 v\u01B0\u01A1ng tan x\xE1c, n\u1EB7ng nh\u01B0 ch\xEC. Nghe k\u1EF9 trong \u0111\xF3 c\xF3 tr\u0103m gi\u1ECDng n\xF3i c\xF9ng l\xFAc." }, "item.thiet_moc_tiet": { "name": "Thi\u1EBFt M\u1ED9c Ti\u1EBFt", "quality": 1, "cat": "Ng\u1EF1 Linh", "desc": "\u0110o\u1EA1n g\u1ED7 thi\u1EBFt m\u1ED9c ph\u01A1i kh\xF4, g\xF5 k\xEAu nh\u01B0 s\u1EAFt, th\u1EE3 kh\xF4i \u0111\u1EBDo ra thay kh\u1EDBp g\xE3y." }, "item.thanh_dong_khau": { "name": "Thanh \u0110\u1ED3ng Kh\u1EA5u", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Ch\u1ED1t kh\u1EDBp \u0111\xFAc b\u1EB1ng thanh \u0111\u1ED3ng pha linh kim, l\u1EAFp v\xE0o l\xE0 tay kh\xF4i h\u1EBFt l\u1ECFng l\u1EBBo." }, "item.huyen_van_phan": { "name": "Huy\u1EC1n V\u0103n Ph\u1EA5n", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "B\u1ED9t \u0111\xE1 huy\u1EC1n v\u0103n tr\u1ED9n d\u1EA7u t\xF9ng, t\xF4 l\u1EA1i tr\u1EADn v\u0103n m\u1EDD tr\xEAn th\xE2n kh\xF4i th\xEC l\xF5i ch\u1EA1y \xEAm nh\u01B0 m\u1EDBi." }, "item.xich_kim_dich": { "name": "X\xEDch Kim D\u1ECBch", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Linh kim n\u1EA5u ch\u1EA3y gi\u1EEF trong \u1ED1ng ng\u1ECDc, r\xF3t v\xE0o v\u1EBFt n\u1EE9t tr\xEAn gi\xE1p kh\xF4i th\xEC li\u1EC1n l\u1EA1i kh\xF4ng th\u1EA5y v\u1EC7t." }, "item.tinh_than_sa": { "name": "Tinh Th\u1EA7n Sa", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "C\xE1t \u0111en nh\u1EB7t n\u01A1i sao b\u0103ng r\u01A1i, l\u1EA5p l\xE1nh nh\u01B0 tr\u1EDDi \u0111\xEAm, r\u1EAFc v\xE0o l\xF5i kh\xF4i th\xEC tr\u1EADn v\u0103n t\u1EF1 s\xE1ng l\u1EA1i." }, "item.hon_nguyen_kim_tuy": { "name": "H\u1ED7n Nguy\xEAn Kim T\u1EE7y", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "T\u1EE7y kim l\u1EA5y t\u1EEB l\xF2ng m\u1EA1ch kho\xE1ng v\u1EA1n n\u0103m, m\u1ED9t gi\u1ECDt n\u1EB7ng nh\u01B0 h\xF2n s\u1EAFt, \u0111\xFAc v\xE0o l\xF5i th\xEC kh\xF4i l\u1ED7i g\u1EA7n nh\u01B0 b\u1EA5t ho\u1EA1i." }, "item.phong_thao_nho": { "name": "Phong Th\u1EA3o Nh\u1ECF", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "C\u1ECF m\u1ECDc \u1EDF \u0111\u1EC9nh gi\xF3, th\xFA nh\u1ECF nhai v\xE0o th\xEC th\xE2n nh\u1EB9 nh\u01B0 l\xF4ng." }, "item.kim_tinh_phien": { "name": "Kim Tinh Phi\u1EBFn", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "M\u1EA3nh kho\xE1ng kim v\u1EE5n c\xF3 v\u1ECB tanh s\u1EAFt, lo\xE0i th\xFA \u01B0a c\u1EAFn x\xE9 r\u1EA5t th\xEDch g\u1EB7m." }, "item.linh_kim_vun": { "name": "Linh Kim V\u1EE5n", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Phoi linh kim v\u1EE5n c\xF2n s\xF3t khi \u0111\xFAc ph\xE1p kh\xED, \u0111\u1ED5 v\xE0o l\xF5i kh\xF4i l\u1ED7i th\xEC th\xE2n n\xF3 th\xEAm ch\u1EAFc." }, "item.thi_khi_nang": { "name": "Thi Kh\xED Nang", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "T\xFAi da b\u1ECDc thi kh\xED gom \u1EDF lo\u1EA1n t\xE1ng c\u01B0\u01A1ng, m\u1EDF n\xFAt ra l\xE0 m\xF9i m\u1ED9 c\u0169 x\u1ED9c l\xEAn." }, "item.huyet_tinh_yeu_thu": { "name": "Huy\u1EBFt Tinh Y\xEAu Th\xFA", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Gi\u1ECDt tinh huy\u1EBFt y\xEAu th\xFA \u0111\xE3 luy\u1EC7n k\u1EBFt, \u0111\u1ECF s\u1EABm. D\xF9ng l\xE0m li\u1EC7u nghi th\u1EE9c cho th\xFA t\u1EDBi b\xECnh c\u1EA3nh t\u1EA5n giai." }, "item.trung_ngan_giac_loc": { "name": "Tr\u1EE9ng Ng\xE2n Gi\xE1c L\u1ED9c", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Qu\u1EA3 tr\u1EE9ng tr\u1EAFng nh\u01B0 ng\u1ECDc, \u1EA5p c\u1EA1nh ng\u01B0\u1EDDi th\xEC v\u1ECF \u1EA5m d\u1EA7n. Nghe n\xF3i n\u1EDF ra h\u01B0\u01A1u nh\u1ECF c\xF3 \u0111\u1ED1m b\u1EA1c." }, "item.do_pho_moc_khoi": { "name": "\u0110\u1ED3 Ph\u1ED5 M\u1ED9c Kh\xF4i", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Ng\u1ECDc gi\u1EA3n kh\u1EAFc \u0111\u1ED3 ph\u1ED5 m\u1ED9t con kh\xF4i l\u1ED7i g\u1ED7, k\xE8m kh\u1EA9u quy\u1EBFt r\xE1p kh\u1EDBp. B\u1ECF v\xE0o nghi th\u1EE9c luy\u1EC7n kh\xF4i l\xE0 ra khu\xF4n m\u1ED9c kh\xF4i." }, "item.trung_giap_phien": { "name": "Tr\xF9ng Gi\xE1p Phi\u1EBFn", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "M\u1EA3nh v\u1ECF c\xE1nh tr\xF9ng \xE1nh v\xE0ng \u0111\u1ED3ng, g\xF5 v\xE0o nghe c\u1EA1ch nh\u01B0 s\u1EAFt. C\u1ED5 \u0103n kim g\u1EB7m c\u1EA3 m\u1EA3nh, th\u1EE3 r\xE8n m\xE0i b\u1ED9t tr\u1ED9n v\xE0o n\u01B0\u1EDBc t\xF4i." }, "item.thanh_doc_nang": { "name": "Thanh \u0110\u1ED9c Nang", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "T\xFAi \u0111\u1ED9c xanh d\u01B0\u1EDBi h\xE0m r\u1EBFt, to b\u1EB1ng h\u1EA1t \u0111\u1ED7. Nh\u1ECF m\u1ED9t gi\u1ECDt v\xE0o h\u0169, \u0111\xE0n c\u1ED5 non tranh nhau li\u1EBFm." }, "item.kim_giap_xac": { "name": "Kim Gi\xE1p X\xE1c", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "L\u1EDBp x\xE1c Ph\u1EC7 Kim Tr\xF9ng l\u1ED9t ra, c\xF2n nguy\xEAn h\xECnh con tr\xF9ng. M\u1EB7t trong l\u1EA5m t\u1EA5m v\u1EE5n s\u1EAFt n\xF3 ch\u01B0a ti\xEAu h\u1EBFt." }, "item.chu_doc_nang": { "name": "Chu \u0110\u1ED9c Nang", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "T\xFAi \u0111\u1ED9c nh\u1EC7n \u0111en, \u0111\u1EB7c nh\u01B0 m\u1EF1c. D\u01B0\u1EE3c s\u01B0 pha lo\xE3ng l\xE0m thu\u1ED1c t\xEA; c\u1ED5 s\u01B0 b\u1ECF v\xE0o h\u0169 cho c\u1ED5 t\u1EADp \u0103n \u0111\u1ED9c." }, "item.bich_hat_vi": { "name": "B\xEDch H\u1EA1t V\u0129", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Kh\xFAc \u0111u\xF4i b\u1ECD c\u1EA1p xanh bi\u1EBFc, ng\xF2i c\xF2n r\u1EC9 n\u01B0\u1EDBc. Ph\u01A1i kh\xF4 r\u1ED3i v\u1EABn ph\u1EA3i c\u1EA7m b\u1EB1ng k\u1EB9p tre." }, "item.co_huyet_tinh": { "name": "C\u1ED5 Huy\u1EBFt Tinh", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "H\u1EA1t m\xE1u \u0111\xF4ng k\u1EBFt trong b\u1EE5ng Huy\u1EBFt C\u1ED5, \u0111\u1ECF th\u1EABm v\xE0 \u1EA5m nh\u01B0 v\u1EEBa r\u1EDDi m\u1EA1ch. C\u1ED5 h\xFAt huy\u1EBFt ng\u1EEDi th\u1EA5y l\xE0 b\xF2 ra kh\u1ECFi h\u0169." }, "item.phe_kim_nha": { "name": "Ph\u1EC7 Kim Nha", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "C\u1EB7p h\xE0m tr\xF9ng c\u1EAFn th\u1EE7ng gi\xE1p s\u1EAFt, m\xE9p r\u0103ng m\xF2n th\xE0nh l\u01B0\u1EE1i c\u01B0a. Th\u1EE3 r\xE8n kh\u1EA3m v\xE0o m\u0169i d\xF9i ph\xE1 gi\xE1p." }, "item.ngu_doc_dich": { "name": "Ng\u0169 \u0110\u1ED9c D\u1ECBch", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "N\u01B0\u1EDBc \u0111\u1ED9c v\u1EAFt t\u1EEB Ng\u0169 \u0110\u1ED9c C\u1ED5, \u0111\u1ED5i m\xE0u theo g\xF3c nh\xECn. M\u1ED9t gi\u1ECDt trong h\u0169 \u0111\u1EE7 cho ba con c\u1ED5 \u0103n no m\u1ED9t th\xE1ng." }, "item.kim_trung_si": { "name": "Kim Tr\xF9ng S\xED", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "C\xE1nh s\u1EAFt c\u1EE7a kim tr\xF9ng, m\u1ECFng nh\u01B0 gi\u1EA5y m\xE0 ch\xE9m kh\xF4ng \u0111\u1EE9t. \u0110\u1EB7t l\xEAn ng\u1ECDn \u0111\xE8n kh\xF4ng ch\xE1y, ch\u1EC9 \u0111\u1ECF d\u1EA7n." }, "item.that_thai_doc_nang": { "name": "Th\u1EA5t Th\u1EA3i \u0110\u1ED9c Nang", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "T\xFAi \u0111\u1ED9c b\u1EA3y m\xE0u x\u1EBFp l\u1EDBp nh\u01B0 c\u1EA7u v\u1ED3ng. \u0110an s\u01B0 luy\u1EC7n k\u1EF3 \u0111\u1ED9c, ph\u1EA3i \u0111eo bao tay da c\xE1 ba l\u1EDBp m\u1EDBi d\xE1m m\u1ED5." }, "item.trung_vuong_giap": { "name": "Tr\xF9ng V\u01B0\u01A1ng Gi\xE1p", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Mai l\u01B0ng tr\xF9ng v\u01B0\u01A1ng, \xE1nh v\xE0ng s\u1EABm, \u0111\xE3 \u0103n qua tr\u0103m m\xF3n ph\xE1p kh\xED. Luy\u1EC7n kh\xED s\u01B0 \u0111\u1ED5i c\u1EA3 l\xF2 linh kim l\u1EA5y m\u1ED9t t\u1EA5m." }, "item.thien_tam_ti": { "name": "Thi\xEAn T\u1EB1m Ti", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "T\u01A1 c\u1ED5 m\u1EABu nh\u1EA3 ra, tr\u1EAFng m\xE0 \xE1nh \u0111\u1ECF nh\u01B0 c\xF3 m\xE1u ch\u1EA1y b\xEAn trong. D\u1EC7t \xE1o th\xEC \u0111ao ki\u1EBFm th\u01B0\u1EDDng ch\xE9m kh\xF4ng th\u1EE7ng." }, "item.ngu_doc_co_tam": { "name": "Ng\u0169 \u0110\u1ED9c C\u1ED5 T\xE2m", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "Qu\u1EA3 tim n\u0103m ng\u0103n c\u1EE7a C\u1ED5 V\u01B0\u01A1ng, m\u1ED7i ng\u0103n m\u1ED9t th\u1EE9 \u0111\u1ED9c, v\u1EABn c\xF2n \u0111\u1EADp ch\u1EADm trong h\u1ED9p ng\u1ECDc. C\u1ED5 s\u01B0 c\u1EA3 \u0111\u1EDDi ch\u1EC9 mong th\u1EA5y m\u1ED9t l\u1EA7n." }, "item.duong_thu_quyet": { "name": "D\u01B0\u1EE1ng Th\xFA Quy\u1EBFt", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Kh\u1EA9u quy\u1EBFt c\u1EE7a ng\u01B0\u1EDDi ch\u0103n y\xEAu \u1EDF b\xECa r\u1EEBng, th\u1EDF c\xF9ng nh\u1ECBp v\u1EDBi con th\xFA n\u1EB1m b\xEAn ch\xE2n. Nu\xF4i l\xE2u th\xEC n\xF3 nh\u1EADn h\u01A1i ng\u01B0\u1EDDi, g\u1ECDi l\xE0 t\u1EDBi." }, "item.bach_thu_thong_ngu": { "name": "B\xE1ch Th\xFA Th\xF4ng Ng\u1EEF", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "D\u1EA1y nghe ti\u1EBFng g\u1EA7m, ti\u1EBFng r\xEDt m\xE0 hi\u1EC3u \xFD. Con th\xFA bi\u1EBFt ng\u01B0\u1EDDi hi\u1EC3u n\xF3 th\xEC ch\u1ECBu theo xa h\u01A1n." }, "item.muc_yeu_kinh": { "name": "M\u1EE5c Y\xEAu Kinh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Kinh c\u1EE7a d\xE2n ch\u0103n y\xEAu \u1EDF hoang nguy\xEAn, ch\u0103n y\xEAu th\xFA nh\u01B0 ch\u0103n tr\xE2u, m\u1ED9t roi m\u1ED9t ti\u1EBFng hu\xFDt c\u1EA3 b\u1EA7y quay \u0111\u1EA7u." }, "item.van_thu_quy_tong": { "name": "V\u1EA1n Th\xFA Quy T\xF4ng", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Luy\u1EC7n th\xE0nh th\xEC tr\xEAn ng\u01B0\u1EDDi c\xF3 m\xF9i \u0111\u1EA7u \u0111\xE0n, y\xEAu th\xFA hoang g\u1EB7p ph\u1EA3i c\u1EE5p tai l\xF9i b\u01B0\u1EDBc. Con \u0111\xE3 nh\u1EADn ch\u1EE7 th\xEC li\u1EC1u ch\u1EBFt theo." }, "item.thu_hoang_chan_kinh": { "name": "Th\xFA Ho\xE0ng Ch\xE2n Kinh", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "T\u01B0\u01A1ng truy\u1EC1n ch\xE9p t\u1EEB v\u1EBFt m\xF3ng kh\u1EAFc tr\xEAn v\xE1ch hang m\u1ED9t \u0111\u1EA7u y\xEAu ho\xE0ng \u0111\xE3 h\xF3a h\xECnh. Ng\u01B0\u1EDDi luy\u1EC7n th\xE0nh, b\u1EA7y th\xFA coi nh\u01B0 vua." }, "item.bach_thu_cuong_hong": { "name": "B\xE1ch Th\xFA Cu\u1ED3ng H\u1ED1ng", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Ch\u1EE7 g\u1EA7m m\u1ED9t ti\u1EBFng t\u1EEB \u0111\xE1y b\u1EE5ng, c\u1EA3 b\u1EA7y d\u1EF1ng l\xF4ng theo, c\u1EAFn m\u1EA1nh h\u01A1n m\u1EA5y h\u1ED3i." }, "item.van_thu_te_minh": { "name": "V\u1EA1n Th\xFA T\u1EC1 Minh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Ch\u1EE7 ra \u0111\xF2n tr\u01B0\u1EDBc, b\u1EA7y th\xFA nghe hi\u1EC7u c\xF9ng lao v\xE0o m\u1ED9t ch\u1ED7. Kh\xF4ng c\xF3 con n\xE0o b\xEAn m\xECnh th\xEC ch\u1EC9 l\xE0 m\u1ED9t \u0111\xF2n th\u01B0\u1EDDng." }, "item.ngu_thu_hoan": { "name": "Ng\u1EF1 Th\xFA Ho\xE0n", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "V\xF2ng \u0111\u1ED3ng \u0111eo c\u1ED5 tay, g\xF5 l\xEAn l\xE0 con th\xFA n\xE0o c\u0169ng quay \u0111\u1EA7u. N\xE9m ra th\xEC \u0111\u1EADp tr\xFAng ch\u1ED7 b\u1EA7y th\xFA \u0111ang c\u1EAFn." }, "item.khu_yeu_tien": { "name": "Khu Y\xEAu Ti\xEAn", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Roi b\u1EC7n g\xE2n y\xEAu th\xFA, qu\u1EA5t m\u1ED9t ti\u1EBFng n\u1ED5 nh\u01B0 s\u1EA5m. B\u1EA7y th\xFA c\xE0ng \u0111\xF4ng, roi c\xE0ng h\u0103ng." }, "item.linh_thu_dai": { "name": "Linh Th\xFA \u0110\u1EA1i", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "T\xFAi da kh\u1EAFc tr\u1EADn, trong \u1EA5m nh\u01B0 hang, con th\xFA chui v\xE0o l\xE0 ng\u1EE7. \u0110eo b\xEAn h\xF4ng th\xEC d\u1EAFt th\xEAm \u0111\u01B0\u1EE3c m\u1ED9t con." }, "item.bach_thu_linh_bai": { "name": "B\xE1ch Th\xFA Linh B\xE0i", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Th\u1EBB g\u1ED7 \u0111\xE0o kh\u1EAFc d\u1EA5u m\xF3ng c\u1EE7a t\u1EEBng con, g\u1ECDi t\xEAn con n\xE0o th\xEC n\xF3 t\u1EDBi ngay, v\u1EBFt th\u01B0\u01A1ng c\u0169ng t\u1EF1 li\u1EC1n d\u1EA7n." }, "item.luyen_thi_bi_luc": { "name": "Luy\u1EC7n Thi B\xED L\u1EE5c", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "S\u1ED5 tay ch\xE9p c\xE1ch ng\xE2m x\xE1c trong n\u01B0\u1EDBc \xE2m, m\u1ED7i th\xE1ng thay n\u01B0\u1EDBc m\u1ED9t l\u1EA7n. X\xE1c ng\xE2m \u0111\u1EE7 ng\xE0y th\xEC da c\u1EE9ng nh\u01B0 v\u1ECF c\xE2y, nghe l\u1EC7nh kh\xF4ng sai." }, "item.thi_sat_chan_kinh": { "name": "Thi S\xE1t Ch\xE2n Kinh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Nu\xF4i s\xE1t kh\xED trong \u0111an \u0111i\u1EC1n r\u1ED3i chia cho x\xE1c d\u01B0\u1EDBi tay. Ch\u1EE7 v\u1EDBi x\xE1c chung m\u1ED9t lu\u1ED3ng kh\xED, x\xE1c c\xE0ng \u0111\xF4ng th\xEC ng\u01B0\u1EDDi c\xE0ng kh\xF3 ch\u1EBFt." }, "item.cuu_u_thi_kinh": { "name": "C\u1EEDu U Thi Kinh", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Ch\xE9p tr\xEAn v\xE1ch m\u1ED9 c\u1ED5 ch\xEDn t\u1EA7ng d\u01B0\u1EDBi \u0111\u1EA5t, \u0111\u1EA5t gi\u1EEF x\xE1c, n\u01B0\u1EDBc d\u01B0\u1EE1ng \xE2m. Thi luy\u1EC7n theo kinh n\xE0y ng\u1EE7 tr\u0103m n\u0103m kh\xF4ng m\u1EE5c." }, "item.bat_hu_thi_kinh": { "name": "B\u1EA5t H\u1EE7 Thi Kinh", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "T\u01B0\u01A1ng truy\u1EC1n l\xE0 b\xFAt t\xEDch c\u1EE7a m\u1ED9t \u0111\u1EDDi Thi V\u01B0\u01A1ng, luy\u1EC7n x\xE1c th\xE0nh th\xE2n b\u1EA5t ho\u1EA1i. Ng\u01B0\u1EDDi tu \u0111\u1EBFn t\u1EA7ng cu\u1ED1i th\xEC m\u1EA1ch \u0111\u1EADp ch\u1EADm nh\u01B0 x\xE1c d\u01B0\u1EDBi tay m\xECnh." }, "item.thu_thi_an": { "name": "Thu Thi \u1EA4n", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "\u1EA4n \u0111\u1EA5t \u0111\xE8 l\xEAn ng\u1EF1c k\u1EBB v\u1EEBa t\u1EAFt th\u1EDF, gi\u1EEF th\xE2n tr\u01B0\u1EDBc khi h\u1ED3n tan. Ph\u1EA3i \u0111\xE1nh cho ki\u1EC7t r\u1ED3i m\u1EDBi h\u1EA1 \u1EA5n, k\u1EBB c\xF2n s\u1EE9c th\xEC gi\xE3y v\u0103ng ra." }, "item.thi_no_chu": { "name": "Thi N\u1ED9 Ch\xFA", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "\u0110\u1ED1t m\xE1u \u0111\u1EA7u ng\xF3n tay ni\u1EC7m ch\xFA, m\u1EAFt x\xE1c d\u01B0\u1EDBi tay \u0111\u1ECF l\xEAn nh\u01B0 than. Trong v\xE0i h\u01A1i th\u1EDF ch\xFAng c\u1EAFn x\xE9 kh\xF4ng bi\u1EBFt \u0111au." }, "item.thi_vuong_hieu_lenh": { "name": "Thi V\u01B0\u01A1ng Hi\u1EC7u L\u1EC7nh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Ch\u1EE7 ra \u0111\xF2n tr\u01B0\u1EDBc, c\u1EA3 \u0111\xE0n x\xE1c lao theo c\xF9ng m\u1ED9t ch\u1ED7. L\u1EC7nh n\xE0y hao th\u1EA7n, m\u1ED9t tr\u1EADn kh\xF4ng h\xF4 \u0111\u01B0\u1EE3c nhi\u1EC1u l\u1EA7n." }, "item.thi_cot_tien": { "name": "Thi C\u1ED1t Ti\xEAn", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Roi k\u1EBFt t\u1EEB \u0111\u1ED1t s\u1ED1ng ng\u01B0\u1EDDi, qu\u1EA5t xu\u1ED1ng k\xEAu l\xE1ch c\xE1ch. Th\u1EE3 d\u1EABn x\xE1c d\xF9ng n\xF3 l\xF9a \u0111\xE0n, qu\u1EA5t ng\u01B0\u1EDDi c\u0169ng \u0111au nh\u01B0 qu\u1EA5t x\xE1c." }, "item.duong_thi_quan": { "name": "D\u01B0\u1EE1ng Thi Quan", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Quan t\xE0i g\u1ED7 \xE2m tr\u1EA7m thu nh\u1ECF b\u1EB1ng b\xE0n tay, n\xE9m ra h\xF3a l\u1EDBn nh\u01B0 n\xFAi \u0111\xE8 xu\u1ED1ng. X\xE1c n\u1EB1m trong \u0111\xF3 l\xE2u ng\xE0y, kh\xED \xE2m th\u1EA5m c\u1EA3 v\xE0o g\u1ED7." }, "item.thi_sat_trao": { "name": "Thi S\xE1t Tr\u1EA3o", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "B\xE0n tay kh\xF4 c\u1EE7a m\u1ED9t x\xE1c tr\u0103m n\u0103m, m\xF3ng \u0111en c\u1EE9ng nh\u01B0 s\u1EAFt. V\u1ED3 m\u1ED9t tr\u1EA3o l\xE0 s\xE1t kh\xED t\xEDch trong ng\u01B0\u1EDDi theo \u0111\xF3 tr\xFAt ra, x\xE1c d\u01B0\u1EDBi tr\u01B0\u1EDBng c\xF9ng v\u1ED3 theo." }, "item.thi_hoang_an": { "name": "Thi Ho\xE0ng \u1EA4n", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "\u1EA4n \u0111\xE1 \u0111en kh\u1EAFc \u0111\u1EA7u Thi V\u01B0\u01A1ng, \u0111\xE8 xu\u1ED1ng l\xE0 \u0111\u1ED1t s\u1EA1ch ma ni\u1EC7m d\u1ED3n th\xE0nh m\u1ED9t \u0111\xF2n. \u0110\xE1nh xong l\xF2ng b\xE0n tay c\xF2n b\u1ED1c kh\xF3i l\u1EA1nh." }, "item.thi_vuong_cot_truong": { "name": "Thi V\u01B0\u01A1ng C\u1ED1t Tr\u01B0\u1EE3ng", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "G\u1EADy ch\u1ED1ng l\xE0m t\u1EEB x\u01B0\u01A1ng s\u1ED1ng m\u1ED9t \u0111\u1EDDi Thi V\u01B0\u01A1ng, \u0111\u1EA7u g\u1EADy l\xE0 c\xE1i s\u1ECD c\xF2n nguy\xEAn r\u0103ng. N\u1EC7n xu\u1ED1ng \u0111\u1EA5t, \u0111\u1EA5t n\u1EE9t lan ra, x\xE1c d\u01B0\u1EDBi tr\u01B0\u1EDBng \u0111\u1ED3ng lo\u1EA1t ng\u1EA9ng \u0111\u1EA7u." }, "item.tu_am_bai": { "name": "T\u1EE5 \xC2m B\xE0i", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Th\u1EBB g\u1ED7 h\xF2e kh\u1EAFc tr\u1EADn t\u1EE5 \xE2m, \u0111eo b\xEAn h\xF4ng th\xEC x\xE1c g\u1ECDi ra \u0111\u1EE1 t\u1ED1n s\u1EE9c. \u0110\xEAm tr\u0103ng non th\u1EBB r\u1ECBn n\u01B0\u1EDBc l\u1EA1nh." }, "item.huyen_am_thi_dinh": { "name": "Huy\u1EC1n \xC2m Thi \u0110\u1EC9nh", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "\u0110\u1EC9nh \u0111\u1ED3ng ba ch\xE2n n\u1EA5u \xE2m kh\xED th\xE0nh s\u01B0\u01A1ng, x\xE1c \u0111\u1EE9ng trong s\u01B0\u01A1ng th\xEC v\u1EBFt th\u01B0\u01A1ng t\u1EF1 li\u1EC1n. Trong \u0111\u1EC9nh th\u01B0\u1EDDng ch\u1EE9a th\xEAm m\u1ED9t x\xE1c." }, "item.cuu_am_thi_quan": { "name": "C\u1EEDu \xC2m Thi Quan", "quality": 7, "cat": "Ng\u1EF1 Linh", "desc": "Quan t\xE0i \u0111\xE1 \u0111en kh\u1EAFc ch\xEDn t\u1EA7ng \xE2m ph\xF9, n\u1EAFp n\u1EB7ng ngh\xECn c\xE2n. X\xE1c n\u1EB1m trong \u0111\xF3 m\u1ED9t \u0111\xEAm, s\xE1ng ra th\u1ECBt n\xE1t \u0111\xE3 li\u1EC1n, m\xF3ng d\xE0i th\xEAm m\u1ED9t \u0111\u1ED1t." }, "item.duong_thi_quyet": { "name": "D\u01B0\u1EE1ng Thi Quy\u1EBFt", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Nu\xF4i \xE2m kh\xED trong th\xE2n nh\u01B0 nu\xF4i x\xE1c trong quan t\xE0i \u0111\u1EA5t. Da d\xE0y, m\xE1u ch\u1EADm, tim \u0111\u1EADp n\u1EEDa nh\u1ECBp ng\u01B0\u1EDDi th\u01B0\u1EDDng." }, "item.khu_thi_linh": { "name": "Khu Thi Linh", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Chu\xF4ng \u0111\u1ED3ng \u0111en treo l\xE1 ph\xF9 luy\u1EC7n thi, trong l\xF2ng chu\xF4ng l\xE0 m\u1ED9t c\u1EE5c thi kh\xED \u0111\xF4ng c\u1EE9ng. Ma tu l\u1EAFc n\xF3 \u0111\u1EC3 l\xF9a x\xE1c; ng\u01B0\u1EDDi s\u1ED1ng nghe th\xEC ch\xE2n tay c\u1EE9ng \u0111\u1EDD." }, "item.thu_thu_phu": { "name": "Thu Th\xFA Ph\xF9", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Gi\u1EA5y v\xE0ng v\u1EBD m\u1ED9t v\xF2ng d\xE2y leo kh\xE9p k\xEDn, n\xE9t cu\u1ED1i \u0111\u1EC3 h\u1EDF ch\u1EDD d\xE1n. Linh th\xFA \u0111\xE3 ki\u1EC7t s\u1EE9c m\xE0 tr\xFAng ph\xF9 th\xEC d\xE2y qu\u1EA5n l\u1EA1i, thu n\xF3 v\xE0o l\xE1 ph\xF9." }, "item.thu_linh_phu": { "name": "Thu Linh Ph\xF9", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Ph\xF9 s\u01B0 se t\u01A1 nh\u1EC7n y\xEAu v\xE0o n\xE9t d\xE2y leo, v\u1EBD ch\xEDn v\xF2ng l\u1ED3ng nhau. Linh th\xFA c\xF3 \u0111\u1EA1o h\u1EA1nh tr\xFAng ph\xF9 c\u0169ng kh\xF3 gi\xE3y, nh\u01B0ng ph\u1EA3i \u0111\xE1nh n\xF3 ki\u1EC7t tr\u01B0\u1EDBc." }, "item.dp_thu_thu_phu": { "name": "Thu Th\xFA Ph\xF9 ph\u01B0\u01A1ng", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Th\u1EBB tre c\u1EE7a th\u1EE3 s\u0103n linh th\xFA, ch\xE9p v\xF2ng d\xE2y leo \u0111\u1EC3 h\u1EDF m\u1ED9t n\xE9t." }, "item.dp_thu_linh_phu": { "name": "Thu Linh Ph\xF9 ph\u01B0\u01A1ng", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Cu\u1ED9n l\u1EE5a v\u1EBD ch\xEDn v\xF2ng d\xE2y leo l\u1ED3ng nhau, m\xE9p l\u1EE5a c\xF3 v\u1EBFt m\xF3ng th\xFA c\xE0o." }, "item.tran_van_giap_da": { "name": "Gi\xE1p Th\u1EA1ch Tr\u1EADn V\u0103n", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "T\u1EDD gi\u1EA5y da kh\u1EAFc v\u0103n tr\u1EADn h\xECnh mai r\xF9a, d\xE1n v\xE0o ng\u1EF1c kh\xF4i l\u1ED7i th\xEC th\xE2n n\xF3 ph\u1EE7 m\u1ED9t l\u1EDBp v\u1ECF \u0111\xE1 m\u1ECFng." }, "item.tran_van_yeu_nha": { "name": "Y\xEAu Nha Tr\u1EADn V\u0103n", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "V\u0103n tr\u1EADn v\u1EBD h\xE0m r\u0103ng l\u1EDFm ch\u1EDFm, kh\u1EAFc v\xE0o tay kh\xF4i l\u1ED7i th\xEC n\xF3 bi\u1EBFt c\u1EAFn x\xE9 nh\u01B0 y\xEAu th\xFA." }, "item.duong_co_quyet": { "name": "D\u01B0\u1EE1ng C\u1ED5 Quy\u1EBFt", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Nh\u1ECF m\xE1u \u0111\u1EA7u ng\xF3n tay v\xE0o h\u0169 s\xE0nh m\u1ED7i \u0111\xEAm, c\u1ED5 quen h\u01A1i ng\u01B0\u1EDDi th\xEC kh\xF4ng c\u1EAFn ch\u1EE7. Nh\u1EADp m\xF4n c\u1EE7a k\u1EBB nu\xF4i tr\xF9ng." }, "item.bach_trung_kinh": { "name": "B\xE1ch Tr\xF9ng Kinh", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Ghi t\u1EADp t\xEDnh tr\u0103m lo\xE0i tr\xF9ng \u0111\u1ED9c, con n\xE0o \u0103n g\xEC, s\u1EE3 g\xEC, \u0111\u1EBB m\xF9a n\xE0o. Thu\u1ED9c r\u1ED3i th\xEC nghe ti\u1EBFng r\u1EC9 r\u1EA3 c\u0169ng bi\u1EBFt \u1ED5 tr\xF9ng \u1EDF \u0111\xE2u." }, "item.doc_co_chan_kinh": { "name": "\u0110\u1ED9c C\u1ED5 Ch\xE2n Kinh", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "L\u1EA5y th\xE2n m\xECnh l\xE0m v\xF2, nu\xF4i hai \u1ED5 c\u1ED5 trong kinh m\u1EA1ch. C\u1ED5 m\u1EA1nh th\xEC ng\u01B0\u1EDDi m\u1EA1nh, ng\u01B0\u1EDDi y\u1EBFu th\xEC c\u1ED5 ph\u1EA3n ch\u1EE7." }, "item.co_mau_tam_kinh": { "name": "C\u1ED5 M\u1EABu T\xE2m Kinh", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Luy\u1EC7n t\xE2m m\xECnh th\xE0nh c\u1ED5 m\u1EABu, \u0111\xE0n con c\u1EA3m \u0111\u01B0\u1EE3c nh\u1ECBp tim ch\u1EE7 m\xE0 theo. Ch\u1EE7 c\xF2n th\u1EDF th\xEC \u0111\xE0n kh\xF4ng tan." }, "item.van_co_thien_kinh": { "name": "V\u1EA1n C\u1ED5 Thi\xEAn Kinh", "quality": 6, "cat": "Ng\u1EF1 Linh", "desc": "C\u1ED5 kinh truy\u1EC1n t\u1EEB mi\u1EBFu th\u1EDD trong r\u1EEBng s\xE2u \u0111\u1EA5t Vi\xEAm, n\xF3i v\u1EA1n c\u1ED5 \u0111\u1EC1u t\u1EEB m\u1ED9t m\u1EB9 sinh ra. Ng\u01B0\u1EDDi tu t\u1EDBi t\u1EA7ng cu\u1ED1i, tr\xF9ng \u0111\u1ED9c b\xF2 qua ch\xE2n kh\xF4ng d\xE1m ch\xEDch." }, "item.thu_co_an": { "name": "Thu C\u1ED5 \u1EA4n", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "\u1EA4n v\u1EBD b\u1EB1ng m\xE1u l\xEAn l\xF2ng b\xE0n tay, \u0111\xE8 xu\u1ED1ng l\xE0 \u0111\xE0n tr\xF9ng \u0111ang t\xE1n lo\u1EA1n co l\u1EA1i m\u1ED9t c\u1EE5c. Ph\u1EA3i gi\u1EBFt b\u1EDBt \u0111\xE0n tr\u01B0\u1EDBc, \u0111\xE0n c\xF2n \u0111\xF4ng th\xEC \u1EA5n v\u1EE1." }, "item.bach_co_phe_than": { "name": "B\xE1ch C\u1ED5 Ph\u1EC7 Th\xE2n", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "Ch\u1EE7 vung tay ch\u1EC9 m\u1ED9t ng\u01B0\u1EDDi, m\u1ECDi con c\u1ED5 tr\xEAn s\xE2n c\xF9ng lao v\xE0o g\u1EB7m. K\u1EBB tr\xFAng nghe ti\u1EBFng r\xE0o r\u1EA1o d\u01B0\u1EDBi da tr\u01B0\u1EDBc khi th\u1EA5y \u0111au." }, "item.co_huyet_phan_bo": { "name": "C\u1ED5 Huy\u1EBFt Ph\u1EA3n B\u1ED9", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "C\u1ED5 \u0103n m\xE1u ch\u1EE7 m\xE0 l\u1EDBn, l\xFAc ch\u1EE7 nguy th\xEC nh\u1EA3 m\xE1u tr\u1EA3 l\u1EA1i. Con kh\u1ECFe nh\u1EA5t trong \u0111\xE0n h\xE9o \u0111i m\u1ED9t v\xF2ng, v\u1EBFt th\u01B0\u01A1ng c\u1EE7a ch\u1EE7 li\u1EC1n da." }, "item.co_dinh": { "name": "C\u1ED5 \u0110\u1EC9nh", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "\u0110\u1EC9nh \u0111\u1ED3ng nh\u1ECF nu\xF4i tr\u0103m c\u1ED5 chung m\u1ED9t mi\u1EC7ng, m\u1EDF n\u1EAFp l\xE0 kh\xF3i \u0111\u1ED9c phun ra. \u0110\xE0n tr\xEAn s\xE2n c\xE0ng \u0111\xF4ng, kh\xF3i c\xE0ng \u0111\u1EB7c." }, "item.van_co_phien": { "name": "V\u1EA1n C\u1ED5 Phi\xEAn", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "C\u1EDD \u0111en d\u1EC7t t\u1EEB t\u01A1 c\u1EE7a v\u1EA1n con t\u1EB1m \u0111\u1ED9c, ph\u1EA5t m\u1ED9t c\xE1i l\xE0 m\xE2y tr\xF9ng \u1EE5p xu\u1ED1ng. C\xF3 \u0111\xE0n c\u1ED5 \u0111i k\xE8m th\xEC m\xE2y d\xE0y g\u1EA5p m\u1EA5y l\u1EA7n." }, "item.duong_co_ung": { "name": "D\u01B0\u1EE1ng C\u1ED5 Ung", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "V\xF2 s\xE0nh \u0111\u1EADy n\u1EAFp s\xE1p ong, trong \u1EE7 s\u1EB5n m\u1EADt \u0111\u1ED9c. C\u1ED5 ng\u1EE7 trong v\xF2, g\u1ECDi ra kh\xF4ng t\u1ED1n m\u1EA5y linh l\u1EF1c." }, "item.bach_co_sao": { "name": "B\xE1ch C\u1ED5 S\xE0o", "quality": 4, "cat": "Ng\u1EF1 Linh", "desc": "T\u1ED5 tr\xF9ng b\u1EB1ng g\u1ED7 tr\u1EA7m kho\xE9t tr\u0103m l\u1ED7, \u0111eo b\xEAn h\xF4ng. Th\xEAm ch\u1ED7 cho m\u1ED9t \u0111\xE0n, \u0111\xE0n n\xE0o b\u1ECB th\u01B0\u01A1ng c\u0169ng chui v\u1EC1 t\u1ED5 li\u1EBFm v\u1EBFt." }, "item.van_doc_phien": { "name": "V\u1EA1n \u0110\u1ED9c Phi\xEAn", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "C\u1EDD \u0111en th\xEAu tr\u0103m lo\xE0i \u0111\u1ED9c tr\xF9ng, c\xE1n l\xE0 x\u01B0\u01A1ng s\u1ED1ng m\u1ED9t con r\u1EBFt y\xEAu. Ph\u1EA5t m\u1ED9t l\u01B0\u1EE3t, kh\xF3i xanh lan kh\u1EAFp, c\u1ECF d\u01B0\u1EDBi ch\xE2n h\xE9o v\xE0ng." }, "item.trung_bach_linh_ho": { "name": "Tr\u1EE9ng B\u1EA1ch Linh H\u1ED3", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng tr\u1EAFng nh\u1ECF b\u1ECDc m\u1ED9t l\u1EDBp l\xF4ng t\u01A1 m\u1ECBn, s\u1EDD v\xE0o \u1EA5m nh\u01B0 m\xE1 ng\u01B0\u1EDDi. \u0110\xEAm tr\u0103ng, trong v\u1ECF c\xF3 ti\u1EBFng g\xE3i khe kh\u1EBD." }, "item.trung_kim_mao_thu": { "name": "Tr\u1EE9ng Kim Mao Th\u1EED", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng b\u1EB1ng \u0111\u1EA7u ng\xF3n c\xE1i, v\u1ECF l\u1EA5m t\u1EA5m v\xE0ng nh\u01B0 r\u1EAFc kim nh\u0169. B\u1ECF v\xE0o t\xFAi ti\u1EC1n, s\xE1ng ra n\xF3 \u0111\xE3 l\u0103n v\xE0o gi\u1EEFa \u0111\u1ED1ng b\u1EA1c v\u1EE5n." }, "item.trung_ngan_nguyet_au_lang": { "name": "Tr\u1EE9ng Ng\xE2n Nguy\u1EC7t Lang", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng x\xE1m b\u1EA1c, m\u1ED9t m\u1EB7t c\xF3 v\u1EC7t tr\u1EAFng cong nh\u01B0 tr\u0103ng non. \u0110\xEAm r\u1EB1m \u0111\u1EB7t ngo\xE0i s\xE2n, v\u1ECF tr\u1EE9ng t\u1EF1 l\u1EA1nh \u0111i nh\u01B0 ph\u1EE7 s\u01B0\u01A1ng." }, "item.trung_bach_van_au_ho": { "name": "Tr\u1EE9ng B\u1EA1ch V\u0103n H\u1ED5", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng tr\u1EAFng v\u1EB1n \u0111en nh\u01B0 da h\u1ED5, n\u1EB7ng tay h\u01A1n tr\xF4ng th\u1EA5y. Ch\xF3 m\xE8o trong nh\xE0 \u0111i ngang \u0111\u1EC1u n\xE9 th\u1EADt xa." }, "item.trung_thanh_ngoc_linh_xa": { "name": "Tr\u1EE9ng Thanh Ng\u1ECDc Linh X\xE0", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng r\u1EAFn d\xE0i, v\u1ECF m\u1EC1m xanh trong nh\u01B0 ng\u1ECDc. Soi \u0111\xE8n th\u1EA5y b\xF3ng r\u1EAFn con cu\u1ED9n tr\xF2n, \u0111\u1EA7u c\xF3 hai ch\u1EA5m nh\xF4 l\xEAn." }, "item.trung_bach_hac": { "name": "Tr\u1EE9ng B\u1EA1ch H\u1EA1c", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng h\u1EA1c tr\u1EAFng ng\xE0, thon d\xE0i, nh\u1EB9 nh\u01B0 c\u1EA7m m\u1ED9t n\u1EAFm m\xE2y. \u0110\u1EA1o qu\xE1n \u0110\u1EA1i Ung coi \u0111\u01B0\u1EE3c m\u1ED9t qu\u1EA3 l\xE0 \u0111i\u1EC1m l\xE0nh c\u1EA3 n\u0103m." }, "item.trung_hoa_nha": { "name": "Tr\u1EE9ng H\u1ECFa Nha", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng qu\u1EA1 \u0111en l\u1ED1m \u0111\u1ED1m \u0111\u1ECF, \u1ED5 r\u01A1m l\xF3t d\u01B0\u1EDBi ch\xE1y x\xE9m m\u1ED9t v\xF2ng. Ph\u1EA3i \u1EE7 trong tro b\u1EBFp, \u0111\u1EC3 ngu\u1ED9i th\xEC kh\xF4ng n\u1EDF." }, "item.trung_thanh_nguu": { "name": "Tr\u1EE9ng Thanh Ng\u01B0u", "quality": 3, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng to b\u1EB1ng c\xE1i \u0111\u1EA5u, v\u1ECF xanh m\xE0u \u0111\xE1 thanh, v\xE2n nh\u01B0 th\u1EDB \u0111\xE1 n\xFAi. \u0110\u1EB7t xu\u1ED1ng \u0111\u1EA5t, \u0111\u1EA5t quanh n\xF3 t\u01A1i ra nh\u01B0 v\u1EEBa c\xE0y." }, "item.trung_mac_ngoc_linh_mieu": { "name": "Tr\u1EE9ng M\u1EB7c Ng\u1ECDc Linh Mi\xEAu", "quality": 2, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng \u0111en b\xF3ng nh\u01B0 m\u1EF1c m\xE0i, tr\xEAn v\u1ECF c\xF3 hai \u0111\u1ED1m xanh nh\u01B0 hai con m\u1EAFt kh\xE9p. \u0110\u1EC3 g\u1EA7n ch\u1ED7 \xE2m kh\xED n\u1EB7ng th\xEC n\xF3 kh\u1EBD rung." }, "item.trung_ly_long": { "name": "Tr\u1EE9ng Ly Long", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng lam s\u1EABm, v\u1ECF m\u1EDD v\xE2n v\u1EA3y, \xF4m v\xE0o l\xE0 nghe ti\u1EBFng s\xF3ng. \u0110\u1EB7t xu\u1ED1ng ch\u1EADu n\u01B0\u1EDBc, n\u01B0\u1EDBc t\u1EF1 xoay quanh n\xF3 th\xE0nh xo\xE1y nh\u1ECF." }, "item.trung_hoa_lan": { "name": "Tr\u1EE9ng H\u1ECFa L\xE2n", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng \u0111\u1ECF nh\u01B0 than h\u1ED3ng, n\xF3ng m\xE0 kh\xF4ng b\u1ECFng tay ng\u01B0\u1EDDi l\u01B0\u01A1ng thi\u1EC7n. C\u1ECF l\xF3t d\u01B0\u1EDBi n\xF3 kh\xF4ng ch\xE1y, ch\u1EC9 kh\xF4 l\u1EA1i." }, "item.trung_huyen_quy": { "name": "Tr\u1EE9ng Huy\u1EC1n Quy", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng \u0111en n\u1EB7ng nh\u01B0 \u0111\xE1, v\u1ECF l\u1EA1nh bu\u1ED1t, m\u1EB7t c\xF3 b\u1EA3y ch\u1EA5m tr\u1EAFng x\u1EBFp h\xECnh sao b\u1EAFc \u0111\u1EA9u. Tr\u0103m n\u0103m m\u1EDBi n\u1EDF m\u1ED9t l\u1EE9a." }, "item.trung_hoa_loan": { "name": "Tr\u1EE9ng H\u1ECFa Loan", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng v\u1ECF \u0111\u1ECF son, m\u1ECFng nh\u01B0 s\u1EE9, soi l\xEAn th\u1EA5y b\xF3ng l\u1EEDa cu\u1ED9n b\xEAn trong. \u0110\u1EC3 g\u1EA7n ng\xF4 \u0111\u1ED3ng th\xEC v\u1ECF \u1EA5m h\u1EB3n l\xEAn." }, "item.trung_thanh_loan": { "name": "Tr\u1EE9ng Thanh Loan", "quality": 5, "cat": "Ng\u1EF1 Linh", "desc": "Tr\u1EE9ng xanh ng\u1ECDc, c\u1EA7m l\xEAn nghe nh\u01B0 c\xF3 ti\u1EBFng chim h\xF3t r\u1EA5t xa. \u0110\u1EB7t c\u1EA1nh c\xE2y kh\xF4 m\u1ED9t \u0111\xEAm, s\xE1ng ra c\xE0nh \u0111\xE3 nh\xFA l\u1ED9c." }, "item.thiet_kiem": { "name": "Thi\u1EBFt Ki\u1EBFm", "quality": 1, "cat": "Ph\xE1p Kh\xED", "desc": "Ki\u1EBFm s\u1EAFt l\xF2 r\xE8n \u0111\u1EA7u l\xE0ng. Ch\u01B0a qua linh h\u1ECFa, ch\xE9m ng\u01B0\u1EDDi th\xEC \u0111\u01B0\u1EE3c, ch\xE9m y\xEAu th\xFA th\xEC m\u1EBB." }, "item.hoa_duoc_dong": { "name": "H\u1ECFa D\u01B0\u1EE3c \u0110\u1ED3ng", "quality": 1, "cat": "Ph\xE1p Kh\xED", "desc": "\u1ED0ng tre nh\u1ED3i di\xEAm ti\xEAu v\xE0 l\u01B0u hu\u1EF3nh. Ti\u1EBFng n\u1ED5 d\u1ECDa ng\u01B0\u1EDDi h\u01A1n s\u1EE9c n\u1ED5." }, "item.xich_viem_phu": { "name": "X\xEDch Vi\xEAm \u1EA4n", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "\u1EA4n \u0111\u1ED3ng kh\u1EAFc v\u0103n chu sa, vung ra th\xE0nh m\u1ED9t qu\u1EA3 c\u1EA7u l\u1EEDa." }, "item.han_bang_phu": { "name": "H\xE0n B\u0103ng \u1EA4n", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xF4ng c\u1EE9ng ch\xE2n \u0111\u1ED1i th\u1EE7 trong ch\u1ED1c l\xE1t." }, "item.thanh_phong_kiem": { "name": "Thanh Phong Ki\u1EBFm", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Thanh ki\u1EBFm s\u1EAFt luy\u1EC7n qua linh h\u1ECFa, nh\u1EB9 nh\u01B0 gi\xF3." }, "item.moc_dang_tac": { "name": "M\u1ED9c \u0110\u1EB1ng T\xE1c", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "S\u1EE3i d\xE2y m\xE2y s\u1ED1ng, qu\u1EA5n ch\u1EB7t k\u1EBB \u0111\u1ECBch." }, "item.hau_tho_thuan": { "name": "H\u1EADu Th\u1ED5 Thu\u1EABn", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "T\u1EA5m khi\xEAn \u0111\xE1, d\u1EF1ng l\xEAn th\xE0nh t\u01B0\u1EDDng \u0111\u1EA5t." }, "item.huyen_thuy_chau": { "name": "Huy\u1EC1n Th\u1EE7y Ch\xE2u", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Vi\xEAn ng\u1ECDc xanh, linh kh\xED th\u1EE7y r\u1EC9 ra ch\u1EEFa l\xE0nh v\u1EBFt th\u01B0\u01A1ng." }, "item.cot_thu": { "name": "C\u1ED1t Th\u1EE9", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "M\u0169i gai m\xE0i t\u1EEB x\u01B0\u01A1ng y\xEAu th\xFA. Th\u1EE9 v\u0169 kh\xED c\u1EE7a t\xE1n tu ngh\xE8o." }, "item.liet_hoa_dao": { "name": "Li\u1EC7t H\u1ECFa \u0110ao", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Thanh \u0111ao l\u01B0\u1EE1i \u0111\u1ECF r\u1EF1c, ch\xE9m ra k\xE9o theo m\u1ED9t v\u1EC7t l\u1EEDa." }, "item.thanh_suong_kiem": { "name": "Thanh S\u01B0\u01A1ng Ki\u1EBFm", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Ki\u1EBFm Thanh V\xE2n \u0111\xFAc cho \u0111\u1EC7 t\u1EED n\u1ED9i m\xF4n. L\u01B0\u1EE1i ki\u1EBFm ph\u1EE7 m\u1ED9t l\u1EDBp s\u01B0\u01A1ng m\u1ECFng." }, "item.huyen_quy_thuan": { "name": "Huy\u1EC1n Quy Thu\u1EABn", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Mai r\xF9a kh\u1EAFc tr\u1EADn v\u0103n, Huy\u1EC1n V\u0169 M\xF4n chu\u1ED9ng d\xF9ng." }, "item.loi_am_an": { "name": "L\xF4i \xC2m \u1EA4n", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "\u1EA4n \u0111\u1ED3ng kh\u1EAFc s\u1EA5m, \u0111\u1EADp xu\u1ED1ng th\xEC ti\u1EBFng s\xE9t l\xE0m \u0111\u1ED1i th\u1EE7 cho\xE1ng v\xE1ng." }, "item.thanh_lien_phien": { "name": "Thanh Li\xEAn Phi\u1EBFn", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Qu\u1EA1t l\xE1 sen \u0111\u1EA7m ch\u01B0\u1EDBng kh\xED, m\u1ED7i l\u1EA7n ph\u1EA9y cu\u1ED1n theo nh\u1EEFng c\xE1nh sen s\u1EAFc nh\u01B0 dao. V\u1EBFt c\u1EAFt th\xE2m l\u1EA1i, l\xE2u ng\xE0y m\u1EDBi l\xE0nh." }, "item.tu_kim_phi_kiem": { "name": "T\u1EED Kim Phi Ki\u1EBFm", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Phi ki\u1EBFm \u0111\xFAc b\u1EB1ng t\u1EED kim, ki\u1EBFm tu Tr\xFAc C\u01A1 m\u01A1 c\u0169ng th\u1EA5y. Bay ra th\xE0nh m\u1ED9t v\u1EC7t c\u1EA7u v\u1ED3ng t\xEDm." }, "item.ly_hoa_hoan_dao": { "name": "Ly H\u1ECFa Ho\xE0n \u0110ao", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110ao l\u01B0ng g\u1EAFn ch\xEDn v\xF2ng \u0111\u1ED3ng, linh \u0111\u1ED3n bi\xEAn \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c r\xE8n cho gi\xE1o \xFAy. Vung l\xEAn ch\xEDn v\xF2ng c\xF9ng reo, m\u1ED7i v\xF2ng nh\u1EA3 m\u1ED9t l\u01B0\u1EE1i l\u1EEDa." }, "item.bac_minh_han_thuong": { "name": "B\u1EAFc Minh H\xE0n Th\u01B0\u01A1ng", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "M\u0169i th\u01B0\u01A1ng \u0111\u1EBDo t\u1EEB b\u0103ng ngh\xECn n\u0103m d\u01B0\u1EDBi \u0111\xE1y bi\u1EC3n B\u1EAFc Minh, kh\xF4ng bao gi\u1EDD tan. \u0110\xE2m tr\xFAng \u0111\xE2u, m\xE1u \u0111\xF4ng l\u1EA1i tr\xEAn m\u0169i th\u01B0\u01A1ng." }, "item.cuu_tiet_truc_tien": { "name": "C\u1EEDu Ti\u1EBFt Tr\xFAc Ti\xEAn", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Roi tr\xFAc t\xEDm ch\xEDn \u0111\u1ED1t, ch\u1EB7t trong r\u1EEBng thi\xEAng sau m\u1ED9t mi\u1EBFu th\u1EA7n Vi\xEAm Qu\u1ED1c. Qu\u1EA5t m\u1ED9t roi th\xE0nh ch\xEDn b\xF3ng roi, v\u1EBFt roi t\xEDm b\u1EA7m v\xEC \u0111\u1ED9c tr\xFAc ng\u1EA5m v\xE0o th\u1ECBt." }, "item.bich_ba_linh_tan": { "name": "B\xEDch Ba Linh T\xE1n", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "\xD4 l\u1EE5a xanh th\u1EE3 Th\u1ECBnh Qu\u1ED1c d\u1EC7t \u0111\u1EC3 d\xE2ng mi\u1EBFu H\u1EA3i th\u1EA7n. Bung \xF4 ra, m\u1ED9t m\xE0n n\u01B0\u1EDBc xoay tr\xF2n quanh th\xE2n." }, "item.nhiep_hon_linh": { "name": "Nhi\u1EBFp H\u1ED3n Linh", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Chu\xF4ng nh\u1ECF \u0111\xFAc b\u1EB1ng \u0111\u1ED3ng xanh \u0111\xE0o t\u1EEB m\u1ED9 c\u1ED5. L\u1EAFc m\u1ED9t ti\u1EBFng, h\u1ED3n k\u1EBB nghe ch\u1EADm l\u1EA1i n\u1EEDa nh\u1ECBp." }, "item.ban_son_an": { "name": "B\xE0n S\u01A1n \u1EA4n", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "\u1EA4n \u0111\xE1 \u0111\u1EBDo t\u1EEB ch\xE2n n\xFAi Trung Ch\xE2u tr\u01B0\u1EDBc ng\xE0y ch\xECm. N\xE9m ra th\xEC n\u1EB7ng nh\u01B0 c\u1EA3 qu\u1EA3 n\xFAi \u0111\xE8 xu\u1ED1ng." }, "item.liet_duong_than_kich": { "name": "Li\u1EC7t D\u01B0\u01A1ng Th\u1EA7n K\xEDch", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "K\xEDch c\u1EE7a m\u1ED9t \u0111\u1EA1i t\u01B0\u1EDBng L\u01B0\u01A1ng Qu\u1ED1c tr\u1EA5n \u1EA3i ba tr\u0103m n\u0103m. M\u0169i k\xEDch \u0111\u1ECF nh\u01B0 ng\u1ECDn \u0111\xE8n Li\u1EC7t D\u01B0\u01A1ng, \u0111\xE2m t\u1EDBi \u0111\xE2u l\u1EEDa ch\xE1y t\u1EDBi \u0111\xF3." }, "item.thanh_tieu_loi_truong": { "name": "Thanh Ti\xEAu L\xF4i Tr\u01B0\u1EE3ng", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Tr\u01B0\u1EE3ng g\u1ED7 t\u1EEB m\u1ED9t c\xE2y b\u1ECB s\xE9t \u0111\xE1nh ba l\u1EA7n m\xE0 kh\xF4ng ch\u1EBFt. Gi\u01A1 tr\u01B0\u1EE3ng l\xEAn tr\u1EDDi, s\u1EA5m theo \u0111\u1EA7u tr\u01B0\u1EE3ng gi\xE1ng xu\u1ED1ng." }, "item.bat_bao_kim_chung": { "name": "B\xE1t B\u1EA3o Kim Chung", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Chu\xF4ng v\xE0ng kh\u1EAFc t\xE1m b\xE1u v\u1EADt nh\xE0 Ph\u1EADt, m\u1ED9t ng\xF4i ch\xF9a c\u1ED5 Vi\xEAm Qu\u1ED1c th\u1EDD ba tr\u0103m n\u0103m. \xDAp xu\u1ED1ng th\xEC \u0111ao ki\u1EBFm ch\xE9m v\xE0o ch\u1EC9 nghe ti\u1EBFng ng\xE2n." }, "item.phu_tang_than_moc": { "name": "Ph\xF9 Tang Th\u1EA7n M\u1ED9c", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Nh\xE1nh c\xE2y ph\xF9 tang, t\u01B0\u01A1ng truy\u1EC1n m\u1EB7t tr\u1EDDi m\u1ECDc l\xEAn t\u1EEB g\u1ED1c c\xE2y \u1EA5y. L\xE1 xanh m\xE0 \u1EA5m, \xE1p v\xE0o v\u1EBFt th\u01B0\u01A1ng th\xEC th\u1ECBt da t\u1EF1 li\u1EC1n." }, "item.luu_ly_tien_dang": { "name": "L\u01B0u Ly Ti\xEAn \u0110\u0103ng", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xE8n l\u01B0u ly c\u1EE7a ti\xEAn nh\xE2n, l\u1EEDa trong \u0111\xE8n \u0111\u1ED1t t\xE0 kh\xED m\xE0 kh\xF4ng \u0111\u1ED1t ng\u01B0\u1EDDi." }, "item.kinh_hong_tien_kiem": { "name": "Kinh H\u1ED3ng Ti\xEAn Ki\u1EBFm", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Phi ki\u1EBFm m\u1ED9t ti\xEAn nh\xE2n Linh gi\u1EDBi \u0111\xE1nh r\u01A1i l\xFAc Thi\xEAn M\xF4n kh\xE9p. Bay ra nhanh nh\u01B0 chim h\u1ED3ng gi\u1EADt m\xECnh, ng\u01B0\u1EDDi tr\xFAng ki\u1EBFm ch\u01B0a k\u1ECBp nghe ti\u1EBFng gi\xF3." }, "item.cuu_long_hoa_trao": { "name": "C\u1EEDu Long H\u1ECFa Tr\xE1o", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "L\u1ED3ng \u0111\u1ED3ng ch\u1EA1m ch\xEDn con r\u1ED3ng, ch\u1EE5p xu\u1ED1ng th\xEC ch\xEDn mi\u1EC7ng r\u1ED3ng c\xF9ng nh\u1EA3 l\u1EEDa. \u0110\xFAc \u1EDF Trung Ch\xE2u, c\u1EA3 l\xF2 \u0111\xFAc gi\u1EDD n\u1EB1m d\u01B0\u1EDBi \u0111\xE1y bi\u1EC3n." }, "item.phan_thuy_thich": { "name": "Ph\xE2n Th\u1EE7y B\u0103ng Th\xEDch", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xF4i th\xEDch b\u0103ng v\u1EDBt d\u01B0\u1EDBi \u0111\xE1y V\u0129nh Tri\u1EC1u H\u1EA3i, ch\u1ED7 Trung Ch\xE2u ch\xECm. \u0110\xE2m m\u1ED9t nh\xE1t, n\u01B0\u1EDBc bi\u1EC3n r\u1EBD hai b\xEAn r\u1ED3i \u0111\xF4ng c\u1EE9ng l\u1EA1i." }, "item.linh_lung_tran_nhac_thap": { "name": "Linh Lung Tr\u1EA5n Nh\u1EA1c Th\xE1p", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Th\xE1p \u0111\xE1 b\u1EA3y t\u1EA7ng ti\xEAn nh\xE2n d\u1EF1ng \u0111\u1EC3 tr\u1EA5n m\u1ED9t ng\u1ECDn n\xFAi bi\u1EBFt \u0111i. M\u1EDF th\xE1p ra, b\u1EA3y t\u1EA7ng h\xE0o quang \xFAp xu\u1ED1ng che k\xEDn ng\u01B0\u1EDDi c\u1EA7m." }, "item.khon_tien_thang": { "name": "Kh\u1ED1n Ti\xEAn Th\u1EB1ng", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "D\xE2y b\u1EC7n t\u1EEB r\u1EC5 m\u1ED9t g\u1ED1c ti\xEAn \u0111\u1EB1ng Linh gi\u1EDBi, Ng\u0169 T\u1ED5 d\xF9ng \u0111\u1EC3 tr\xF3i ti\xEAn nh\xE2n tr\xE0n qua Thi\xEAn M\xF4n. Qu\u0103ng ra th\xEC t\u1EF1 t\xECm ng\u01B0\u1EDDi m\xE0 qu\u1EA5n." }, "item.tru_tien_kiem": { "name": "Tru Ti\xEAn Ki\u1EBFm", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Thanh ki\u1EBFm Ng\u0169 T\u1ED5 \u0111\xFAc \u0111\u1EC3 canh Thi\xEAn M\xF4n. Ch\xE9m \u0111\u01B0\u1EE3c c\u1EA3 ti\xEAn nh\xE2n Linh gi\u1EDBi tr\xE0n xu\u1ED1ng." }, "item.van_kiep_hon_dang": { "name": "V\u1EA1n Ki\u1EBFp H\u1ED3n \u0110\u0103ng", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xE8n th\u1EAFp b\u1EB1ng h\u1ED3n h\u1ECFa c\u1EE7a m\u1ED9t tu s\u0129 k\u1EB9t l\u1EA1i khi Thi\xEAn M\xF4n kh\xE9p. Ch\u1EE7 ch\u1EBFt, \u0111\xE8n kh\xF4ng t\u1EAFt; n\xF3 \u0111i theo h\u1ED3n qua c\u1EA7u N\u1EA1i H\xE0." }, "item.toai_thien_kiem": { "name": "To\xE1i Thi\xEAn Ki\u1EBFm", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "M\u1EA3nh ki\u1EBFm g\xE3y n\u0103m x\u01B0a t\u1EEBng ch\xE9m v\xE0o phong \u1EA5n Thi\xEAn M\xF4n. Kh\xF4ng theo ai qua ki\u1EBFp, nh\u01B0ng ki\u1EBFp n\xE0y c\u1EA7m n\xF3 th\xEC tr\u1EDDi c\u0169ng ph\u1EA3i tr\xE1nh \u0111\u01B0\u1EDDng." }, "item.tu_linh_boi": { "name": "T\u1EE5 Linh B\u1ED9i", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Ng\u1ECDc b\u1ED9i kh\u1EAFc tr\u1EADn t\u1EE5 linh nh\u1ECF, \u0111eo b\xEAn h\xF4ng th\xEC linh kh\xED quanh th\xE2n \u0111\u1EB7c h\u01A1n m\u1ED9t ch\xFAt." }, "item.ho_tam_kinh": { "name": "H\u1ED9 T\xE2m K\xEDnh", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "T\u1EA5m g\u01B0\u01A1ng \u0111\u1ED3ng che ng\u1EF1c. \u0110\xF2n \u0111\xE1nh v\xE0o b\u1ECB l\u1EC7ch \u0111i m\u1ED9t ph\u1EA7n." }, "item.thanh_tam_ngoc": { "name": "Thanh T\xE2m Ng\u1ECDc", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Ng\u1ECDc xanh m\xE1t l\u1EA1nh, ng\u1EADm trong mi\u1EC7ng th\xEC t\xE2m t\u0129nh, th\u1EA7n th\u1EE9c s\xE1ng." }, "item.thanh_moc_tu_linh_chau": { "name": "Thanh M\u1ED9c T\u1EE5 Linh Ch\xE2u", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "H\u1EA1t ch\xE2u k\u1EBFt t\u1EEB l\xF5i c\xE2y linh ng\xE0n n\u0103m, h\xFAt sinh kh\xED c\u1ECF c\xE2y quanh ng\u01B0\u1EDDi." }, "item.ngu_loi_phu": { "name": "Ng\u0169 L\xF4i \u1EA4n", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "\u1EA4n tr\u1EEB t\xE0 c\u1EE7a \u0111\u1EA1o s\u0129 giang h\u1ED3. \u0110\xE1nh ng\u01B0\u1EDDi th\xEC th\u01B0\u1EDDng, \u0111\xE1nh \xE2m h\u1ED3n ma v\u1EADt th\xEC nh\u01B0 s\xE9t gi\u1EEFa tr\u1EDDi quang." }, "item.phong_hoa_phien": { "name": "Phong H\u1ECFa Phi\u1EBFn", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Qu\u1EA1t l\xF4ng chim l\u1EEDa, ph\u1EA9y m\u1ED9t c\xE1i gi\xF3 \u0111\u01B0a l\u1EEDa \u0111i, l\u1EEDa n\u01B0\u01A1ng gi\xF3 m\xE0 l\u1EDBn." }, "item.hau_tho_kim_cang_an": { "name": "H\u1EADu Th\u1ED5 Kim Cang \u1EA4n", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "\u1EA4n \u0111\xE1 b\u1ECDc v\xE0ng, \u0111\u1EA5t d\xE0y nu\xF4i kim c\u1EE9ng. Gi\u01A1 l\xEAn th\xEC m\u1ED9t v\xF2ng s\xE1ng v\xE0ng \u0111\u1EA5t bao quanh th\xE2n." }, "item.thanh_xa_cham": { "name": "Thanh X\xE0 Ch\xE2m", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "M\u1ED9t \u1ED1ng tr\xFAc b\u1EA3y c\xE2y kim, m\u0169i kim ng\xE2m n\u1ECDc r\u1EAFn l\u1EE5c \u0111\u1EBFn xanh bi\u1EBFc. Ph\xF3ng ch\xE2m th\xEC nhanh, m\xE0 m\u1ED7i l\u1EA7n nh\xECn k\u1EBB tr\xFAng ch\xE2m co gi\u1EADt, l\xF2ng ng\u01B0\u1EDDi ph\xF3ng l\u1EA1i l\u1EA1nh th\xEAm m\u1ED9t ch\xFAt." }, "item.ham_doc_chau": { "name": "H\xE0m \u0110\u1ED9c Ch\xE2u", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "H\u1EA1t ch\xE2u x\xE1m l\u1EA5y t\u1EEB t\xFAi \u0111\u1ED9c c\u1EE7a r\u1EAFn gi\xE0, ng\u1EADm d\u01B0\u1EDBi l\u01B0\u1EE1i th\xEC \u0111\u1ED9c v\xE0o ng\u01B0\u1EDDi t\u1EE5 h\u1EBFt v\u1EC1 ch\xE2u. Ng\u1EADm l\xE2u, l\u01B0\u1EE1i t\xEA m\xE0 tai th\xEDnh l\u1EA1 th\u01B0\u1EDDng." }, "item.ngo_cong_cau": { "name": "Ng\xF4 C\xF4ng C\xE2u", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "M\xF3c c\xE2u \u0111\xFAc t\u1EEB v\u1ECF m\u1ED9t con r\u1EBFt tr\u0103m n\u0103m, l\u01B0\u1EE1i chia tr\u0103m \u0111\u1ED1t nh\u1ECF nh\u01B0 ch\xE2n r\u1EBFt. \u0110\u1ED1t ma ni\u1EC7m truy\u1EC1n v\xE0o, m\xF3c c\xE2u qu\u1EB1n qu\u1EA1i nh\u01B0 s\u1ED1ng l\u1EA1i, chui s\xE2u v\xE0o th\u1ECBt k\u1EBB tr\xFAng." }, "item.that_bo_doc_kiem": { "name": "Th\u1EA5t B\u1ED9 \u0110\u1ED9c Ki\u1EBFm", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ki\u1EBFm m\u1EA3nh, l\u01B0\u1EE1i t\u1EA9m \u0111\u1ED9c c\u1EE7a b\u1EA3y lo\xE0i tr\xF9ng, ng\u01B0\u1EDDi \u0111\u1EDDi \u0111\u1ED3n tr\xFAng ki\u1EBFm \u0111i b\u1EA3y b\u01B0\u1EDBc l\xE0 ng\xE3. Ma ni\u1EC7m ch\u1EE7 nh\xE2n s\xE1t tr\u1EA7n th\xEC \u0111\u1ED9c tr\xEAn l\u01B0\u1EE1i \u0111\u1EB7c l\u1EA1i, b\u1EA3y b\u01B0\u1EDBc th\xE0nh ba." }, "item.bich_thiem_boi": { "name": "B\xEDch Thi\u1EC1m B\u1ED9i", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ng\u1ECDc b\u1ED9i t\u1EA1c h\xECnh con c\xF3c xanh ba ch\xE2n, nghe n\xF3i giam h\u1ED3n m\u1ED9t con thi\u1EC1m \u0111\u1ED9c ngh\xECn n\u0103m. \u0110eo b\xEAn ng\u01B0\u1EDDi, kh\xED \u0111\u1ED9c quanh th\xE2n d\xE0y nh\u01B0 l\u1EDBp gi\xE1p, \u0111ao ki\u1EBFm ch\xE9m v\xE0o nh\u01B0 ch\xE9m xu\u1ED1ng b\xF9n." }, "item.cuu_doc_thien_la": { "name": "C\u1EEDu \u0110\u1ED9c Thi\xEAn La", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "L\u01B0\u1EDBi d\u1EC7t t\u1EEB t\u01A1 c\u1EE7a ch\xEDn con nh\u1EC7n ch\xFAa, m\u1ED7i s\u1EE3i ng\u1EADm m\u1ED9t th\u1EE9 \u0111\u1ED9c kh\xE1c nhau. Ch\u1EE7 nh\xE2n \u0111\u1ED1t ma ni\u1EC7m tung l\u01B0\u1EDBi, c\u1EA3 tr\u1EADn ph\u1EE7 m\u1ED9t m\xE0n s\u01B0\u01A1ng t\xEDm, k\u1EBB h\xEDt ph\u1EA3i th\u1EA5y ch\xEDn c\u01A1n \u0111au c\xF9ng l\xFAc." }, "item.hu_cot_ma_trao": { "name": "H\u1EE7 C\u1ED1t Ma Tr\u1EA3o", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "B\xE0n tay kh\xF4 c\u1EE7a m\u1ED9t l\xE3o ma, m\xF3ng t\u1EA9m thi \u0111\u1ED9c. C\xE0o tr\xFAng ch\u1ED7 n\xE0o, th\u1ECBt ch\u1ED7 \u1EA5y th\xE2m \u0111en r\u1ED3i m\u1EE7n ra, c\xF2n ma ni\u1EC7m c\u1EE7a k\u1EBB c\xE0o th\xEC d\xE0y th\xEAm m\u1ED9t l\u1EDBp." }, "item.doc_diem_lo": { "name": "\u0110\u1ED9c Di\u1EC5m L\xF4", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "L\xF2 \u0111\u1ED3ng nh\u1ECF b\u1EB1ng n\u1EAFm tay, trong \u0111\u1ED1t b\u1ED9t \u0111\u1ED9c tr\xF9ng tr\u1ED9n l\u01B0u hu\u1EF3nh. \u0110\u1ED1t ma ni\u1EC7m th\u1ED5i v\xE0o, l\xF2 phun m\u1ED9t l\xE0n kh\xF3i l\u1EEDa xanh l\u1EE5c, ai h\xEDt ph\u1EA3i ho ra m\xE1u \u0111en." }, "item.tho_phong_sao": { "name": "Th\u1ED5 Phong S\xE0o", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "T\u1ED5 ong \u0111\u1EA5t \u0111\xE0o nguy\xEAn kh\u1ED1i, b\u1ECDc trong t\xFAi da, g\xF5 m\u1ED9t c\xE1i l\xE0 c\u1EA3 b\u1EA7y v\xF9 ra. Ong \u0111\u1EA5t c\u1EAFn m\u1ED9t ph\xE1t \u0111\u1EE7 s\u01B0ng n\u1EEDa m\u1EB7t, m\xE0 nu\xF4i l\xE2u, ch\u1EE7 t\u1ED5 c\u0169ng c\xE1u b\u1EB3n nh\u01B0 ong." }, "item.ngu_co_dich": { "name": "Ng\u1EF1 C\u1ED5 \u0110\u1ECBch", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "S\xE1o x\u01B0\u01A1ng tr\u1EAFng, th\u1ED5i l\xEAn kh\xF4ng th\xE0nh ti\u1EBFng m\xE0 c\u1ED5 tr\xF9ng trong ng\u01B0\u1EDDi kh\xE1c nghe \u0111\u01B0\u1EE3c. \u0110\u1ED1t ma ni\u1EC7m th\u1ED5i m\u1ED9t kh\xFAc, c\u1ED5 \u0111\xE3 l\xE9n gieo trong m\xE1u k\u1EBB \u0111\u1ECBch c\u1EF1a m\xECnh, k\u1EBB \u0111\xF3 \u0111\u1EE9ng s\u1EEFng t\u1EA1i ch\u1ED7." }, "item.long_phuong_hong_chuc": { "name": "Long Ph\u01B0\u1EE3ng H\u1ED3ng Ch\xFAc", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "C\u1EB7p n\u1EBFn \u0111\u1ECF ch\u1EA1m r\u1ED3ng ph\u01B0\u1EE3ng, th\u1EE9 ng\u01B0\u1EDDi ta th\u1EAFp trong \u0111\xEAm \u0111\u1ED9ng ph\xF2ng. Ch\xE2m l\xEAn gi\u1EEFa tr\u1EADn, k\u1EBB \u0111\u1ECBch nh\xECn \xE1nh l\u1EEDa lay l\u1EAFt m\xE0 ng\u1EE1 m\xECnh \u0111ang \u1EDF h\u1EF7 \u0111\u01B0\u1EDDng." }, "item.hop_hoan_huong_nang": { "name": "H\u1EE3p Hoan H\u01B0\u01A1ng Nang", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "T\xFAi g\u1EA5m th\xEAu \u0111\xF4i hoa h\u1EE3p hoan, trong nh\u1ED3i c\xE1nh hoa ph\u01A1i kh\xF4. \u0110eo b\xEAn h\xF4ng, ng\u01B0\u1EDDi l\u1EA1 g\u1EB7p l\u1EA7n \u0111\u1EA7u c\u0169ng th\u1EA5y d\u1EC5 m\u1EBFn." }, "item.that_thai_hong_lang": { "name": "Th\u1EA5t Th\u1EA3i H\u1ED3ng L\u0103ng", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "D\u1EA3i l\u1EE5a b\u1EA3y m\xE0u d\xE0i ba tr\u01B0\u1EE3ng, qu\u1EA5n v\xE0o ng\u01B0\u1EDDi th\xEC m\u1EC1m m\xE0 kh\xF4ng g\u1EE1 ra \u0111\u01B0\u1EE3c. L\u1EE5a \u0103n l\u1EEDa l\xF2ng ng\u01B0\u1EDDi c\u1EA7m, \u0111\u1ED1t c\xE0ng nhi\u1EC1u c\xE0ng si\u1EBFt ch\u1EB7t." }, "item.lac_anh_cham": { "name": "L\u1EA1c Anh Ch\xE2m", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "M\u1ED9t h\u1ED9p kim b\u1EA1c m\u1EA3nh, \u0111\u1EA7u kim nhu\u1ED9m h\u1ED3ng nh\u01B0 c\xE1nh \u0111\xE0o. Vung tay m\u1ED9t c\xE1i, kim r\u01A1i nh\u01B0 m\u01B0a hoa, k\u1EBB \u0111\u1EE9ng g\u1EA7n \u0111\u1EC1u l\u0129nh v\xE0i c\xE2y." }, "item.uyen_uong_boi": { "name": "Uy\xEAn \u01AF\u01A1ng B\u1ED9i", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xF4i ng\u1ECDc b\u1ED9i kh\u1EAFc chim uy\xEAn \u01B0\u01A1ng, \u0111eo m\u1ED9t n\u1EEDa th\xEC kh\xED t\u1EE9c d\u1ECBu nh\u01B0 con g\xE1i nh\xE0 l\xE0nh. N\u1EEDa kia \u1EDF \u0111\xE2u, kh\xF4ng ai bi\u1EBFt." }, "item.tuy_huong_phong_linh": { "name": "T\xFAy H\u01B0\u01A1ng Phong Linh", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Chu\xF4ng gi\xF3 \u0111\u1ED3ng treo m\u1ED9t t\xFAi h\u01B0\u01A1ng nh\u1ECF, l\u1EAFc l\xEAn l\xE0 m\xF9i h\u01B0\u01A1ng theo gi\xF3 tr\xE0n kh\u1EAFp tr\u1EADn. K\u1EBB h\xEDt ph\u1EA3i m\u1EC1m c\u1EA3 x\u01B0\u01A1ng, \u0111\u1EE9ng c\xF2n kh\xF4ng v\u1EEFng." }, "item.me_tinh_kinh": { "name": "M\xEA T\xECnh K\xEDnh", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "G\u01B0\u01A1ng \u0111\u1ED3ng m\u1EB7t m\u1EDD h\u01A1i n\u01B0\u1EDBc, ai soi v\xE0o c\u0169ng th\u1EA5y m\xECnh \u0111\u1EB9p h\u01A1n. Gi\u01A1 l\xEAn gi\u1EEFa tr\u1EADn, c\u1EA3 \u0111\xE1m \u0111\u1ECBch qu\xEAn m\u1EA5t m\xECnh \u0111\u1EBFn \u0111\u1EC3 l\xE0m g\xEC." }, "item.giao_boi_ngoc_tran": { "name": "Giao B\xF4i Ng\u1ECDc Tr\u1EA3n", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xF4i ch\xE9n ng\u1ECDc d\xF9ng trong l\u1EC5 u\u1ED1ng r\u01B0\u1EE3u giao b\xF4i, r\xF3t m\u1ED9t l\u1EA7n l\xE0 \u0111\u1EA7y c\u1EA3 hai. Ng\u01B0\u1EDDi c\xF9ng u\u1ED1ng th\u1EA5y v\u1EBFt th\u01B0\u01A1ng \u1EA5m l\xEAn m\xE0 l\xE0nh, r\u01B0\u1EE3u \u1EA5y l\u1EA5y t\u1EEB \u0111\xE2u th\xEC \u0111\u1EEBng h\u1ECFi." }, "item.hong_loan_thien_ti": { "name": "H\u1ED3ng Loan Thi\xEAn Ti", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Cu\u1ED9n ch\u1EC9 \u0111\u1ECF se t\u1EEB t\xF3c c\u1EE7a tr\u0103m c\u1EB7p t\xECnh nh\xE2n. Bu\u1ED9c v\xE0o c\u1ED5 tay k\u1EBB \u0111\u1ECBch l\xE0 k\xE9o n\xF3 theo nh\u01B0 k\xE9o con r\u1ED1i." }, "item.noan_ngoc_huong_lo": { "name": "No\xE3n Ng\u1ECDc H\u01B0\u01A1ng L\xF4", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "L\u01B0 h\u01B0\u01A1ng b\u1EB1ng ng\u1ECDc \u1EA5m, kh\xF3i \u0111\u1ECF trong l\xF2 ch\u01B0a t\u1EEBng t\u1EAFt. Kh\xF3i qu\u1EA5n l\u1EA5y ng\u01B0\u1EDDi mang, che \u0111i c\u1EA3 m\xF9i m\xE1u l\u1EABn ma kh\xED." }, "item.dao_hoa_mi_phien": { "name": "\u0110\xE0o Hoa M\u1ECB Phi\u1EBFn", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Qu\u1EA1t x\u01B0\u01A1ng ng\xE0 c\u0103ng l\u1EE5a h\u1ED3ng, v\u1EBD m\u1ED9t c\xE2y \u0111\xE0o n\u1EDF tr\xE1i m\xF9a. Ph\u1EA9y m\u1ED9t c\xE1i, c\xE1nh \u0111\xE0o bay kh\u1EAFp tr\u1EADn, k\u1EBB \u0111\u1ECBch m\u1EC9m c\u01B0\u1EDDi bu\xF4ng binh kh\xED." }, "item.tang_khi_ngoc_boi": { "name": "T\xE0ng Kh\xED Ng\u1ECDc B\u1ED9i", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Mi\u1EBFng ng\u1ECDc xanh \u0111\u1EE5c, \u0111eo s\xE1t ng\u1EF1c th\xEC m\xE1t l\u1EA1nh. Linh kh\xED t\u1ECFa ra b\u1ECB n\xF3 h\xFAt v\xE0o nh\u01B0 m\u1EF1c th\u1EA5m gi\u1EA5y." }, "item.am_sa_bao": { "name": "\xC1m Sa B\xE0o", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o the x\xE1m d\u1EC7t l\u1EABn t\u01A1 nh\u1EC7n \u0111\xEAm, m\u1EB7c v\xE0o th\xEC ng\u01B0\u1EDDi nh\u01B0 nh\u1EA1t \u0111i m\u1ED9t n\u1EEDa. K\u1EBB tr\u1ED9m Luy\u1EC7n Kh\xED qu\xFD h\u01A1n c\u1EA3 ki\u1EBFm." }, "item.tang_phong_hoan": { "name": "T\xE0ng Phong Ho\xE0n", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Chi\u1EBFc nh\u1EABn s\u1EAFt \u0111en tr\u01A1n, m\u1EB7t trong kh\u1EAFc k\xEDn tr\u1EADn v\u0103n nh\u1ECF nh\u01B0 ch\xE2n ki\u1EBFn. \u0110eo v\xE0o th\xEC m\u0169i nh\u1ECDn trong ng\u01B0\u1EDDi c\u0169ng thu c\u1EA3 v\xE0o v\u1ECF." }, "item.huyen_am_sa_y": { "name": "Huy\u1EC1n \xC2m Sa Y", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o l\u1EE5a m\u1ECFng nhu\u1ED9m b\u1EB1ng n\u01B0\u1EDBc gi\u1EBFng \xE2m, s\u1EDD v\xE0o l\u1EA1nh nh\u01B0 s\u01B0\u01A1ng. S\xE1t th\u1EE7 m\u1EB7c n\xF3 \u0111\u1EE9ng sau l\u01B0ng ng\u01B0\u1EDDi c\u1EA3 n\xE9n nhang kh\xF4ng b\u1ECB ph\xE1t gi\xE1c." }, "item.an_linh_chau": { "name": "\u1EA8n Linh Ch\xE2u", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "H\u1EA1t ch\xE2u m\xE0u \u0111\u1EA5t, ng\u1EADm d\u01B0\u1EDBi l\u01B0\u1EE1i th\xEC linh kh\xED quanh th\xE2n l\u1EB7n xu\u1ED1ng nh\u01B0 n\u01B0\u1EDBc r\xFAt. Ma tu gi\u1EEF n\xF3 c\xF2n k\u1EF9 h\u01A1n gi\u1EEF m\u1EA1ng." }, "item.thien_huyen_dien_cu": { "name": "Thi\xEAn Huy\u1EC5n Di\u1EC7n C\u1EE5", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "M\u1EB7t n\u1EA1 g\u1ED7 m\u1ECFng nh\u01B0 v\u1ECF tr\u1EE9ng, \xE1p l\xEAn m\u1EB7t th\xEC li\u1EC1n v\xE0o da. Ng\u01B0\u1EDDi nh\xECn ch\u1EC9 th\u1EA5y m\u1ED9t khu\xF4n m\u1EB7t t\u1EA7m th\u01B0\u1EDDng, th\u1EA7n th\u1EE9c d\xF2 t\u1EDBi c\u0169ng tr\u01B0\u1EE3t \u0111i." }, "item.cau_hon_tac": { "name": "C\xE2u H\u1ED3n T\xE1c", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "S\u1EE3i x\xEDch \u0111en \u0111\u1EA7u m\xF3c c\xE2u, k\xE9o l\xEAn t\u1EEB gi\u1EBFng c\u1EA1n m\u1ED9t l\xE0ng ch\u1EBFt d\u1ECBch. M\xF3c v\xE0o ai, ng\u01B0\u1EDDi \u1EA5y l\u1EA1nh bu\u1ED1t nh\u01B0 b\u1ECB k\xE9o xu\u1ED1ng n\u01B0\u1EDBc; ch\u1EE7 nh\xE2n ma ni\u1EC7m c\xE0ng s\xE2u, x\xEDch c\xE0ng kh\u1EAFc s\xE2u d\u1EA5u h\u1ED3n." }, "item.huyet_hon_linh": { "name": "Huy\u1EBFt H\u1ED3n Linh", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Chi\u1EBFc chu\xF4ng \u0111\u1ED3ng \u0111\u1ECF, l\u01B0\u1EE1i chu\xF4ng l\xE0 m\u1ED9t \u0111\u1ED1t x\u01B0\u01A1ng ng\xF3n tay. L\u1EAFc m\u1ED9t ti\u1EBFng, k\u1EBB nghe th\u1EA5y \u0111\u1EE9ng s\u1EEFng nh\u01B0 b\u1ECB ai g\u1ECDi t\xEAn." }, "item.bich_lan_quy_dang": { "name": "B\xEDch L\xE2n Qu\u1EF7 \u0110\u0103ng", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Chi\u1EBFc \u0111\xE8n l\u1ED3ng da ng\u01B0\u1EDDi, b\u1EA5c l\xE0 m\u1ED9t nh\xFAm t\xF3c, ch\xE1y l\u1EEDa xanh l\xE2n tinh. \u0110\xE8n soi t\u1EDBi d\u1EA5u h\u1ED3n n\xE0o, h\u1ED3n \u1EA5y b\u1ECB k\xE9o ra m\xE0 \u0111\u1ED1t." }, "item.han_hon_kinh": { "name": "H\xE0n H\u1ED3n K\xEDnh", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "G\u01B0\u01A1ng \u0111\u1ED3ng m\u1EB7t ph\u1EE7 s\u01B0\u01A1ng gi\xE1, soi v\xE0o th\u1EA5y b\xF3ng m\xECnh \u0111\xF4ng c\u1EE9ng trong \u0111\xF3. K\u1EBB b\u1ECB soi l\u1EA1nh t\u1EDBi t\u1EADn h\u1ED3n, c\u1EED \u0111\u1ED9ng kh\xF4ng n\u1ED5i." }, "item.bach_cot_dich": { "name": "B\u1EA1ch C\u1ED1t \u0110\u1ECBch", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "\u1ED0ng s\xE1o kho\xE9t t\u1EEB x\u01B0\u01A1ng \u1ED1ng ch\xE2n ng\u01B0\u1EDDi, th\u1ED5i l\xEAn nghe nh\u01B0 ti\u1EBFng tr\u1EBB kh\xF3c. Ti\u1EBFng s\xE1o r\xE1t v\xE0o h\u1ED3n m\u1ECDi k\u1EBB quanh \u0111\xF3, th\u1ED5i l\xE2u th\xEC ng\u01B0\u1EDDi th\u1ED5i c\u0169ng th\u1EA5y l\xF2ng t\u1ED1i \u0111i." }, "item.toa_phach_ngoc": { "name": "T\u1ECFa Ph\xE1ch Ng\u1ECDc", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Mi\u1EBFng ng\u1ECDc l\u1EA1nh ng\u1EAFt m\xF3c t\u1EEB mi\u1EC7ng ng\u01B0\u1EDDi ch\u1EBFt, \u0111eo s\xE1t ng\u1EF1c th\xEC h\u1ED3n ph\xE1ch v\u1EEFng l\u1EA1i. Qu\u1EF7 tu nh\u1EADp m\xF4n ai c\u0169ng t\xECm m\u1ED9t mi\u1EBFng." }, "item.khoc_tang_bong": { "name": "Kh\u1ED1c Tang B\u1ED5ng", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "G\u1EADy tang qu\u1EA5n gi\u1EA5y tr\u1EAFng, c\u1EA7m \u0111i \u0111\u1EA7u \u0111\xE1m ma \u0111\u1EE7 ch\xEDn m\u01B0\u01A1i ch\xEDn l\u1EA7n. \u0110\u1ED1t ma ni\u1EC7m m\xE0 \u0111\xE1nh, g\u1EADy g\xF5 tr\xFAng \u0111\xE2u h\u1ED9 th\u1EC3 r\xE3 ra nh\u01B0 gi\u1EA5y \u01B0\u1EDBt." }, "item.le_quy_dien": { "name": "L\u1EC7 Qu\u1EF7 Di\u1EC7n", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "M\u1EB7t n\u1EA1 g\u1ED7 h\xF2e kh\u1EAFc m\u1EB7t l\u1EC7 qu\u1EF7 nhe nanh, \u0111eo v\xE0o th\xEC h\u01A1i ng\u01B0\u1EDDi l\u1EB7n m\u1EA5t, ch\u1EC9 c\xF2n \xE2m kh\xED. K\u1EBB \u0111\u1ED1i di\u1EC7n th\u1EA5y l\u1EA1nh g\xE1y m\xE0 kh\xF3 nh\xECn ra ng\u01B0\u1EDDi sau m\u1EB7t n\u1EA1." }, "item.phan_quan_but": { "name": "Ph\xE1n Quan B\xFAt", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "C\xE2y b\xFAt l\xF4ng \u0111en ch\u1EA5m m\u1EF1c pha m\xE1u, t\u01B0\u01A1ng truy\u1EC1n ch\xE9p t\u1EEB b\xFAt c\u1EE7a ph\xE1n quan d\u01B0\u1EDBi \xE2m ty. G\u1EA1ch m\u1ED9t n\xE9t l\xEAn d\u1EA5u h\u1ED3n c\u1EE7a ai, h\u1ED3n \u1EA5y r\xE1ch to\u1EA1c." }, "item.phi_cuong_trao": { "name": "Phi C\u01B0\u01A1ng Tr\u1EA3o", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "M\xF3ng vu\u1ED1t s\u1EAFt \u0111en, kh\u1EDBp n\u1ED1i b\u1EB1ng t\u1EE7y Phi C\u01B0\u01A1ng c\xF2n t\u1EF1 co du\u1ED7i. C\xE0o tr\xFAng ai, m\xE1u quanh v\u1EBFt th\u01B0\u01A1ng kh\xF4 l\u1EA1i th\xE0nh v\u1EA3y \u0111en." }, "item.am_hoe_con": { "name": "\xC2m H\xF2e C\xF4n", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "G\u1EADy ch\u1EB7t t\u1EEB c\xE2y h\xF2e m\u1ECDc tr\xEAn m\u1EA3, l\xF5i g\u1ED7 \u0111en nh\u01B0 ng\u1EA5m m\u1EF1c. N\u1EC7n xu\u1ED1ng \u0111\u1EA5t, r\u1EC5 h\xF2e tr\u1ED3i l\xEAn qu\u1EA5n ch\xE2n k\u1EBB \u0111\u1ECBch." }, "item.that_tinh_quan_dinh": { "name": "Th\u1EA5t Tinh Quan \u0110inh", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "B\u1EA3y c\xE2y \u0111inh s\u1EAFt r\xFAt t\u1EEB n\u1EAFp quan t\xE0i, \u0111\u1EA7u \u0111inh c\xF2n d\xEDnh v\u1EE5n g\u1ED7 m\u1EE5c. Ph\xF3ng ra xuy\xEAn qua x\u01B0\u01A1ng, gi\xE1p h\u1ED9 th\xE2n th\u1EE7ng m\u1ED9t l\u1ED7." }, "item.thi_du_dang": { "name": "Thi Du \u0110\u0103ng", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xE8n \u0111\u1ED3ng xanh \u0111\u1ED1t d\u1EA7u \xE9p t\u1EEB x\xE1c, l\u1EEDa m\xE0u l\u1EE5c kh\xF4ng t\u1ECFa h\u01A1i \u1EA5m. H\u1EA5t b\u1EA5c m\u1ED9t c\xE1i, l\u1EEDa b\u1EAFn ra b\xE1m v\xE0o da ng\u01B0\u1EDDi m\xE0 ch\xE1y." }, "item.bang_thi_cot_kiem": { "name": "B\u0103ng Thi C\u1ED1t Ki\u1EBFm", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "M\xE0i t\u1EEB x\u01B0\u01A1ng s\u1ED1ng m\u1ED9t b\u0103ng thi v\u1EA1n n\u0103m d\u01B0\u1EDBi \u0111\xE1y hang tuy\u1EBFt, th\xE2n ki\u1EBFm trong nh\u01B0 ng\u1ECDc m\xE0 l\u1EA1nh bu\u1ED1t tay. Ch\xE9m m\u1ED9t nh\xE1t, h\xE0n kh\xED ph\u1EE7 tr\u1EAFng c\u1EA3 chi\u1EBFn tr\u01B0\u1EDDng." }, "item.am_cot_kiem": { "name": "\xC2m C\u1ED1t Ki\u1EBFm", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Ki\u1EBFm m\xE0i t\u1EEB x\u01B0\u01A1ng \u1ED1ng ch\xE2n ng\u01B0\u1EDDi, ng\xE2m b\u1EA3y \u0111\xEAm trong n\u01B0\u1EDBc m\u1ED9. V\u1EBFt ch\xE9m tr\u1EAFng b\u1EC7ch, m\xE1u c\u1EE9 r\u1EC9 m\xE3i; ch\xE9m c\xE0ng nhi\u1EC1u, \xE2m kh\xED c\xE0ng ng\u1EA5m ng\u01B0\u1EE3c v\xE0o l\xF2ng ng\u01B0\u1EDDi c\u1EA7m." }, "item.huyet_hoa_cham": { "name": "Huy\u1EBFt H\u1ECFa Ch\xE2m", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "B\xF3 kim s\u1EAFt nung \u0111\u1ECF r\u1ED3i t\xF4i trong m\xE1u ch\xF3 m\u1EF1c. Kim c\u1EAFm v\xE0o th\u1ECBt l\xE0 m\xE1u s\xF4i quanh ch\xE2n kim, r\xFAt ra v\u1EABn r\u1EC9 m\xE3i." }, "item.thuc_huyet_liem": { "name": "Th\u1EF1c Huy\u1EBFt Li\xEAm", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "L\u01B0\u1EE1i li\u1EC1m g\u1EB7t l\xFAa \u0111em ng\xE2m m\xE1u g\xE0 \u0111en b\u1ED1n m\u01B0\u01A1i ch\xEDn ng\xE0y, s\u1ED1ng l\u01B0\u1EE1i \u0111\u1ECF nh\u01B0 g\u1EC9. C\u1EE9a qua c\u1ED5 ai l\xE0 m\xE1u theo r\xE3nh li\u1EC1m ch\u1EA3y v\u1EC1 tay ng\u01B0\u1EDDi c\u1EA7m." }, "item.huyet_dang_tien": { "name": "Huy\u1EBFt \u0110\u1EB1ng Ti\xEAn", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Roi b\u1EC7n t\u1EEB r\u1EC5 h\xF2e m\u1ECDc tr\xEAn b\xE3i tha ma, gai r\u1EC5 r\u1ED7ng nh\u01B0 v\xF2i \u0111\u1EC9a. Qu\u1EA5t tr\xFAng th\xEC gai c\u1EAFm v\xE0o da m\xE0 h\xFAt; ma ni\u1EC7m s\u1EAFp tr\xE0n th\xEC roi u\u1ED1ng m\xE1u g\u1EA5p \u0111\xF4i." }, "item.huyet_sat_phien": { "name": "Huy\u1EBFt S\xE1t Phi\xEAn", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "C\u1EDD v\u1EA3i nhu\u1ED9m m\xE1u ba tr\u0103m ng\u01B0\u1EDDi, ma tu d\xF9ng \u0111\u1EC3 luy\u1EC7n qu\xE2n. Ph\u1EA5t l\xEAn th\xEC \u0111\u1ED1t s\xE1t kh\xED trong l\xF2ng l\xE0m l\u1EEDa, gi\xF3 tanh cu\u1ED1n l\u1EEDa \u0111\u1ECF th\u1EABm kh\u1EAFp tr\u1EADn." }, "item.phe_huyet_ma_dao": { "name": "Ph\u1EC7 Huy\u1EBFt Ma \u0110ao", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110ao l\u01B0\u1EE1i \u0111\u1ECF s\u1EABm, u\u1ED1ng m\xE1u xong th\xEC n\xF3ng ran trong tay. Ch\xE9m m\u1ED9t \u0111ao, k\u1EBB c\u1EA7m \u0111ao h\u0103ng th\xEAm m\u1ED9t ph\u1EA7n; ma ni\u1EC7m s\xE1t tr\u1EA7n th\xEC \u0111ao h\xFAt m\xE1u g\u1EA5p \u0111\xF4i." }, "item.huyet_anh_thu": { "name": "Huy\u1EBFt \u1EA2nh Th\u1EE9", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Gai x\u01B0\u01A1ng d\xE0i m\u1ED9t gang, r\u1ED7ng ru\u1ED9t, trong ru\u1ED9t \u0111\u1ECDng m\u1ED9t s\u1EE3i m\xE1u kh\xF4ng kh\xF4. \u0110\xE2m ra th\xEC \u0111\u1ED1t ma ni\u1EC7m c\u1EE7a ch\u1EE7 nh\xE2n th\xE0nh m\u1ED9t v\u1EC7t \u0111\u1ECF, xuy\xEAn qua gi\xE1p nh\u01B0 xuy\xEAn gi\u1EA5y." }, "item.cuu_u_ma_chau": { "name": "C\u1EEDu U Ma Ch\xE2u", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "H\u1EA1t ch\xE2u \u0111en k\u1EBFt t\u1EEB \xE2m kh\xED d\u01B0\u1EDBi \u0111\xE1y m\u1ED9t h\u1ED1 ch\xF4n ng\u01B0\u1EDDi. C\u1EA7m l\xE2u th\xEC tay t\xEA l\u1EA1nh, m\xE0 linh l\u1EF1c trong ng\u01B0\u1EDDi d\u1ED3i d\xE0o l\u1EA1." }, "item.huyet_hai_ma_dinh": { "name": "Huy\u1EBFt H\u1EA3i Ma \u0110\u1EC9nh", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\u1EC9nh \u0111\u1ED3ng ba ch\xE2n, l\xF2ng \u0111\u1EC9nh kh\xF4ng bao gi\u1EDD kh\xF4 m\xE1u. M\u1EDF n\u1EAFp ph\u1EA3i \u0111\u1ED1t ma ni\u1EC7m l\xE0m l\u1EEDa, m\xE1u \u0111\u1ED5 kh\u1EAFp tr\u1EADn theo kh\xF3i \u0111\u1ECF ch\u1EA3y v\u1EC1 th\xE2n ng\u01B0\u1EDDi c\u1EA7m." }, "item.thi_huyet_ma_thuong": { "name": "Th\u1ECB Huy\u1EBFt Ma Th\u01B0\u01A1ng", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Th\u01B0\u01A1ng s\u1EAFt \u0111en, m\u0169i th\u01B0\u01A1ng c\xF3 r\xE3nh d\u1EABn m\xE1u ch\u1EA3y ng\u01B0\u1EE3c v\xE0o c\xE1n. M\u1ED7i l\u1EA7n \u0111\xE2m tr\xFAng, s\xE1t kh\xED theo m\xE1u d\u1ED9i v\xE0o l\xF2ng ng\u01B0\u1EDDi c\u1EA7m, \u0111\xE2m c\xE0ng nhi\u1EC1u c\xE0ng kh\xF3 bu\xF4ng." }, "item.nhiep_hon_ma_kinh": { "name": "Nhi\u1EBFp H\u1ED3n Ma K\xEDnh", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "G\u01B0\u01A1ng \u0111\u1ED3ng m\u1EB7t \u0111en, soi v\xE0o kh\xF4ng th\u1EA5y m\u1EB7t m\xECnh m\xE0 th\u1EA5y m\u1EB7t ng\u01B0\u1EDDi \u0111\xE3 ch\u1EBFt. Mang theo ng\u01B0\u1EDDi th\xEC nghe \u0111\u01B0\u1EE3c c\u1EA3 ti\u1EBFng b\u01B0\u1EDBc ch\xE2n sau l\u01B0ng." }, "item.xich_uyen_ma_kiem": { "name": "X\xEDch Uy\xEAn Ma Ki\u1EBFm", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ki\u1EBFm r\xE8n d\u01B0\u1EDBi \u0111\xE1y m\u1ED9t v\u1EF1c m\xE1u, n\u01A1i m\u1ED9t ma t\xF4ng c\u1ED5 t\u1EBF c\u1EA3 th\xE0nh ng\u01B0\u1EDDi. \u0110\u1ED1t ma ni\u1EC7m vung l\xEAn, m\xE1u trong ng\u01B0\u1EDDi k\u1EBB \u0111\u1ECBch tr\xE0o ra theo m\u0169i ki\u1EBFm nh\u01B0 n\u01B0\u1EDBc tri\u1EC1u." }, "item.huyet_tuyen_ma_binh": { "name": "Huy\u1EBFt Tuy\u1EC1n Ma B\xECnh", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "B\xECnh ng\u1ECDc \u0111en, d\u1ED1c ng\u01B0\u1EE3c m\xE0 m\xE1u trong b\xECnh ch\u01B0a t\u1EEBng c\u1EA1n. Nghi\xEAng b\xECnh l\xE0 m\u1ED9t d\xF2ng m\xE1u l\u1EA1nh x\u1ED1i th\u1EB3ng v\xE0o k\u1EBB \u0111\u1ECBch; m\u1ED7i l\u1EA7n d\u1ED1c, ma ni\u1EC7m l\u1EA1i \u0111\u1EA7y th\xEAm." }, "item.huyet_ha_phien": { "name": "Huy\u1EBFt H\xE0 Phi\xEAn", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "C\u1EDD l\u1EE5a nhu\u1ED9m b\u1EB1ng tinh huy\u1EBFt Huy\u1EBFt \u1EA2nh, ph\u1EA5t l\xEAn nh\u01B0 m\u1ED9t d\xF2ng s\xF4ng m\xE1u \u0111\u1ED5 xu\u1ED1ng. Ma \u0111\u1EA1o gi\u1EEF l\xE0m c\u1EE7a gia truy\u1EC1n, ch\xEDnh \u0111\u1EA1o th\u1EA5y l\xE0 \u0111\u1ED1t." }, "item.thiet_tich_truong": { "name": "Thi\u1EBFt T\xEDch Tr\u01B0\u1EE3ng", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Tr\u01B0\u1EE3ng s\u1EAFt c\u1EE7a t\u0103ng \u0111i kh\u1EA5t th\u1EF1c, \u0111\u1EA7u tr\u01B0\u1EE3ng treo s\xE1u v\xF2ng \u0111\u1ED3ng. Ch\u1ED1ng xu\u1ED1ng \u0111\u1EA5t th\xEC v\xF2ng reo, g\xF5 v\xE0o \u0111\u1EA7u th\xEC k\u1EBB c\u01B0\u1EDBp ng\xE3." }, "item.phan_am_moc_ngu": { "name": "Ph\u1EA1n \xC2m M\u1ED9c Ng\u01B0", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "M\xF5 g\u1ED7 long n\xE3o, g\xF5 s\xE1ng t\u1ED1i ba m\u01B0\u01A1i n\u0103m trong m\u1ED9t am n\xFAi Vi\xEAm Qu\u1ED1c. M\u1ED9t ti\u1EBFng m\xF5 v\u1ECDng v\xE0o tai, k\u1EBB \u0111\u1ECBch qu\xEAn m\u1EA5t m\xECnh \u0111\u1ECBnh ra tay." }, "item.tu_kim_bat_vu": { "name": "T\u1EED Kim B\xE1t Vu", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "B\xE1t kh\u1EA5t th\u1EF1c \u0111\xFAc b\u1EB1ng t\u1EED kim, tung l\xEAn th\xEC l\u1EDBn b\u1EB1ng c\xE1i chum. \xDAp xu\u1ED1ng, y\xEAu th\xFA trong b\xE1t g\u1EA7m m\u1EA5y c\u0169ng kh\xF4ng l\u1EADt n\u1ED5i." }, "item.kim_cang_phap_luan": { "name": "Kim Cang Ph\xE1p Lu\xE2n", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "B\xE1nh xe \u0111\u1ED3ng t\xE1m nan, m\u1ED7i nan kh\u1EAFc m\u1ED9t c\xE2u kinh. Xoay quanh th\xE2n th\xE0nh v\xF2ng s\xE1ng v\xE0ng, \u0111ao ch\xE9m v\xE0o b\u1ECB cu\u1ED1n l\u1EC7ch \u0111i." }, "item.la_han_kim_chau": { "name": "La H\xE1n Kim Ch\xE2u", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "M\u01B0\u1EDDi t\xE1m h\u1EA1t ch\xE2u v\xE0ng, m\u1ED7i h\u1EA1t t\u1EA1c m\u1EB7t m\u1ED9t v\u1ECB La H\xE1n. Bu\xF4ng tay, c\u1EA3 chu\u1ED7i tung ra nh\u01B0 m\u01B0a \u0111\xE1, h\u1EA1t n\xE0o c\u0169ng t\xECm \u0111\xFAng ng\u01B0\u1EDDi." }, "item.dai_bi_thien_truong": { "name": "\u0110\u1EA1i Bi Thi\u1EC1n Tr\u01B0\u1EE3ng", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Thi\u1EC1n tr\u01B0\u1EE3ng g\u1ED7 \u0111\xE0n h\u01B0\u01A1ng c\u1EE7a m\u1ED9t v\u1ECB ph\u01B0\u01A1ng tr\u01B0\u1EE3ng \u0111\u1EAFc \u0111\u1EA1o, c\u1EA7m l\xE2u tay c\xF2n th\u01A1m. G\xF5 xu\u1ED1ng \u0111\u1EA5t, m\u01B0a ph\xF9n r\u01A1i quanh, ai d\xEDnh m\u01B0a th\xEC v\u1EBFt th\u01B0\u01A1ng kh\xE9p mi\u1EC7ng." }, "item.dai_phan_thien_chung": { "name": "\u0110\u1EA1i Ph\u1EA1n Thi\xEAn Chung", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Chu\xF4ng \u0111\u1ED3ng cao b\u1EB1ng ba ng\u01B0\u1EDDi, x\u01B0a treo tr\xEAn l\u1EA7u chu\xF4ng m\u1ED9t ng\xF4i \u0111\u1EA1i t\u1EF1 Trung Ch\xE2u. \u0110\xE1nh m\u1ED9t ti\u1EBFng, c\u1EA3 tr\u1EADn \u0111\u1ECBa \u0111\u1EE9ng s\u1EEFng nh\u01B0 nghe s\u1EA5m gi\u1EEFa tr\u1EDDi quang." }, "item.kim_lan_ca_sa": { "name": "Kim Lan C\xE0 Sa", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o c\xE0 sa d\u1EC7t ch\u1EC9 v\xE0ng, tri\u1EC1u tr\u01B0\u1EDBc ban cho qu\u1ED1c s\u01B0. Kho\xE1c l\xEAn, phi ki\u1EBFm ch\u1EA1m v\xE0o \xE1o nh\u01B0 ch\xE9m xu\u1ED1ng n\u01B0\u1EDBc." }, "item.kim_than_xa_loi": { "name": "Kim Th\xE2n X\xE1 L\u1EE3i", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Vi\xEAn x\xE1 l\u1EE3i v\xE0ng s\u1EABm c\xF2n l\u1EA1i sau khi m\u1ED9t v\u1ECB cao t\u0103ng h\u1ECFa t\xE1ng ba ng\xE0y kh\xF4ng ch\xE1y h\u1EBFt. \u0110\u1EB7t tr\u01B0\u1EDBc m\u1EB7t nh\u1EADp \u0111\u1ECBnh, t\xE2m ma t\u1EDBi g\u1EA7n li\u1EC1n tan." }, "item.khai_son_dao": { "name": "Khai S\u01A1n \u0110ao", "quality": 1, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110ao b\u1EA3n d\xE0y c\u1EE7a ti\u1EC1u phu, s\u1ED1ng \u0111ao n\u1EB7ng nh\u01B0 b\xFAa. S\u01A1n t\u1EB7c th\xEDch th\u1EE9 n\xE0y v\xEC ch\xE9m c\u1EEDa c\u0169ng \u0111\u01B0\u1EE3c." }, "item.dang_bai": { "name": "\u0110\u1EB1ng B\xE0i", "quality": 1, "cat": "Ph\xE1p Kh\xED", "desc": "Khi\xEAn m\xE2y \u0111an ba l\u1EDBp, ng\xE2m d\u1EA7u tr\u1EA9u cho d\u1EBBo. L\xEDnh tr\u1EA5n bi\xEAn m\u1ED7i ng\u01B0\u1EDDi m\u1ED9t t\u1EA5m." }, "item.thau_cot_cham": { "name": "Th\u1EA5u C\u1ED1t Ch\xE2m", "quality": 1, "cat": "Ph\xE1p Kh\xED", "desc": "B\u1EA3y c\xE2y kim th\xE9p gi\u1EA5u trong \u1ED1ng tay \xE1o, \u0111\u1EA7u kim t\u1EA9m thu\u1ED1c t\xEA. Tr\xFAng huy\u1EC7t th\xEC c\u1EA3 c\xE1nh tay r\u0169 xu\u1ED1ng." }, "item.thiet_diep_giap": { "name": "Thi\u1EBFt Di\u1EC7p Gi\xE1p", "quality": 1, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o gi\xE1p l\xE1 s\u1EAFt k\u1EBFt b\u1EB1ng d\xE2y da, m\u1EB7c v\xE0o n\u1EB7ng tr\u0129u vai. H\u1ED9 v\u1EC7 th\u01B0\u01A1ng \u0111o\xE0n \u0111i \u0111\u01B0\u1EDDng xa \u0111\u1EC1u c\xF3." }, "item.truy_phong_tieu": { "name": "Truy Phong Ti\xEAu", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Phi ti\xEAu kh\u1EAFc m\u1ED9t \u0111\u01B0\u1EDDng phong v\u0103n, n\xE9m ra r\u1ED3i t\u1EF1 l\u01B0\u1EE3n v\u1EC1 tay. Th\u1EE9 \u01B0a d\xF9ng c\u1EE7a k\u1EBB \u0111\xE1nh l\xE9n." }, "item.bon_loi_chuy": { "name": "B\xF4n L\xF4i Ch\xF9y", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Ch\xF9y \u0111\u1ED3ng \u0111\xFAc l\xFAc tr\u1EDDi gi\xF4ng, c\xE1n c\xF2n v\u1EBFt ch\xE1y s\xE9t. \u0110\u1EADp tr\xFAng th\xEC t\xF3c d\u1EF1ng \u0111\u1EE9ng, tai \xF9 c\u1EA3 bu\u1ED5i." }, "item.han_thiet_dao": { "name": "H\xE0n Thi\u1EBFt \u0110ao", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110ao r\xE8n t\u1EEB h\xE0n thi\u1EBFt, t\xF4i trong n\u01B0\u1EDBc tuy\u1EBFt tan. L\u01B0\u1EE1i \u0111ao l\xFAc n\xE0o c\u0169ng \u0111\u1ECDng m\u1ED9t l\u1EDBp s\u01B0\u01A1ng." }, "item.quy_giap_thuan": { "name": "Quy Gi\xE1p Thu\u1EABn", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Mai r\xF9a y\xEAu vi\u1EC1n \u0111\u1ED3ng, quai da tr\xE2u. \u0110\u1EE1 \u0111\xF2n th\xEC nghe ti\u1EBFng n\u01B0\u1EDBc v\u1ED7, l\u1EF1c \u0111\xE1nh t\u1EA3n ra nh\u01B0 s\xF3ng." }, "item.bich_lan_doc_cham": { "name": "B\xEDch L\xE2n \u0110\u1ED9c Ch\xE2m", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Ba c\xE2y kim m\xE0i t\u1EEB v\u1EA3y r\u1EAFn xanh, ng\xE2m trong t\xFAi m\u1EADt c\u1EE7a ch\xEDnh con r\u1EAFn \u1EA5y. Ch\xE2m v\xE0o da kh\xF4ng \u0111au, n\u1EEDa n\xE9n h\u01B0\u01A1ng sau m\u1EDBi th\u1EA5y t\xEA." }, "item.huyen_thiet_ho_uyen": { "name": "Huy\u1EC1n Thi\u1EBFt H\u1ED9 Uy\u1EC3n", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xF4i bao c\u1ED5 tay huy\u1EC1n thi\u1EBFt, m\u1EB7t trong l\xF3t da tr\xE2u. G\u1EA1t \u0111\u01B0\u1EE3c l\u01B0\u1EE1i \u0111ao, r\u1ED3i c\xFA \u0111\u1EA5m k\u1EBF theo \u0111\xE0 \u1EA5y m\xE0 n\u1EB7ng g\u1EA5p \u0111\xF4i." }, "item.dia_sat_dinh": { "name": "\u0110\u1ECBa S\xE1t \u0110inh", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "B\u1EA3y chi\u1EBFc \u0111inh \u0111\u1ED3ng \u0111\u1EA1o s\u0129 \u0111\xF3ng v\xE0o ch\xE2n th\xE2y ma \u0111\u1EC3 n\xF3 kh\u1ECFi \u0111\u1EE9ng d\u1EADy. N\xE9m xu\u1ED1ng \u0111\u1EA5t, \u0111inh t\xECm b\xF3ng ng\u01B0\u1EDDi m\xE0 ghim." }, "item.huyet_phach_boi": { "name": "Huy\u1EBFt Ph\xE1ch B\u1ED9i", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Ng\u1ECDc b\u1ED9i \u0111\u1ECF s\u1EABm, l\xEDnh quan \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c truy\u1EC1n tay ng\u01B0\u1EDDi c\xF2n s\u1ED1ng. \u0110eo v\xE0o th\xEC ng\u1EF1c n\xF3ng nh\u01B0 v\u1EEBa u\u1ED1ng r\u01B0\u1EE3u m\u1EA1nh." }, "item.tu_dien_thoa": { "name": "T\u1EED \u0110i\u1EC7n Thoa", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "C\xE2y tr\xE2m t\xEDm c\u1EAFm t\xF3c, n\xE9m ra th\xE0nh m\u1ED9t tia s\xE9t m\u1EA3nh. Ch\u1ED7 tr\xFAng l\u1EA7n tr\u01B0\u1EDBc c\xF2n t\xEA, l\u1EA7n sau s\xE9t t\u1EF1 t\xECm v\u1EC1 \u0111\xF3." }, "item.han_suong_toa": { "name": "H\xE0n S\u01B0\u01A1ng T\u1ECFa", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "X\xEDch b\u0103ng m\u1EA3nh nh\u01B0 s\u1EE3i ch\u1EC9, qu\u1EA5n v\xE0o \u0111\xE2u th\xEC s\u01B0\u01A1ng tr\u1EAFng b\xF2 l\xEAn \u0111\xF3. Hai nh\u1ECBp th\u1EDF sau k\u1EBB b\u1ECB tr\xF3i m\u1EDBi c\u1EED \u0111\u1ED9ng \u0111\u01B0\u1EE3c ng\xF3n tay." }, "item.xich_diem_ho_lo": { "name": "X\xEDch Di\u1EC5m H\u1ED3 L\xF4", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Qu\u1EA3 b\u1EA7u \u0111\u1ECF treo b\xEAn l\xF2 \u0111an \u0111\u1EE7 tr\u0103m n\u0103m, ru\u1ED9t \u0111\xE3 h\xF3a th\xE0nh l\u1EEDa. M\u1EDF n\xFAt ra l\xE0 m\u1ED9t lu\u1ED3ng l\u1EEDa d\u1EBBo nh\u01B0 m\u1EADt, d\xEDnh \u0111\xE2u ch\xE1y \u0111\xF3." }, "item.ngoc_lo_binh": { "name": "Ng\u1ECDc L\u1ED9 B\xECnh", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "B\xECnh ng\u1ECDc c\u1ED5 d\xE0i, \u0111\xEAm n\xE0o \u0111\u1EB7t ngo\xE0i s\xE2n c\u0169ng t\u1EF1 \u0111\u1EA7y s\u01B0\u01A1ng. V\u1EA9y l\xEAn v\u1EBFt th\u01B0\u01A1ng, s\u01B0\u01A1ng th\u1EA5m v\xE0o th\xEC th\u1ECBt li\u1EC1n mi\u1EC7ng." }, "item.huyet_anh_dao": { "name": "Huy\u1EBFt \u1EA2nh \u0110ao", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110o\u1EA3n \u0111ao l\u01B0\u1EE1i m\u1ECFng, ch\xE9m xong kh\xF4ng d\xEDnh m\u1ED9t gi\u1ECDt m\xE1u. V\u1EBFt ch\xE9m th\xEC c\u1EE9 r\u1EC9 m\xE3i kh\xF4ng ch\u1ECBu kh\xE9p." }, "item.dia_mach_linh_chau": { "name": "\u0110\u1ECBa M\u1EA1ch Linh Ch\xE2u", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "H\u1EA1t ch\xE2u v\xE0ng \u0111\u1EE5c k\u1EBFt d\u01B0\u1EDBi m\u1EA1ch \u0111\u1EA5t, y\xEAu th\xFA hay ng\u1EADm khi ng\u1EE7 \u0111\xF4ng. C\u1EA7m trong tay nghe nh\u01B0 c\xF3 ti\u1EBFng tim \u0111\u1EADp r\u1EA5t ch\u1EADm." }, "item.phong_luan_phi_hoan": { "name": "Phong Lu\xE2n Phi Ho\xE0n", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "V\xF2ng th\xE9p r\xECa s\u1EAFc, kh\u1EAFc phong v\u0103n k\xEDn hai m\u1EB7t. N\xE9m ra n\xF3 l\u01B0\u1EE3n m\u1ED9t v\xF2ng c\u1EAFt qua m\u1ECDi c\u1ED5 tr\xEAn \u0111\u01B0\u1EDDng r\u1ED3i m\u1EDBi v\u1EC1 tay." }, "item.huyen_bang_bao_kinh": { "name": "Huy\u1EC1n B\u0103ng B\u1EA3o K\xEDnh", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "G\u01B0\u01A1ng m\xE0i t\u1EEB m\u1ED9t kh\u1ED1i b\u0103ng kh\xF4ng tan d\u01B0\u1EDBi \u0111\xE1y h\u1ED3 s\xE2u. Gi\u01A1 l\xEAn th\xEC m\u1ED9t b\u1EE9c t\u01B0\u1EDDng b\u0103ng m\u1ECDc tr\u01B0\u1EDBc m\u1EB7t, \u0111\u1EE9ng t\u1EDBi hai hi\u1EC7p m\u1EDBi n\u1EE9t." }, "item.bang_phach_than_cham": { "name": "B\u0103ng Ph\xE1ch Th\u1EA7n Ch\xE2m", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "B\u1EA3y c\xE2y kim b\u0103ng nu\xF4i trong t\u1EE7y m\u1ED9t con giao gi\xE0, ra n\u1EAFng kh\xF4ng tan. Kim chui v\xE0o th\u1ECBt r\u1ED3i h\xF3a h\xE0n kh\xED, k\u1EBB tr\xFAng c\xE0ng \u0111\xE1nh c\xE0ng run tay." }, "item.loi_dinh_lenh": { "name": "L\xF4i \u0110\xECnh L\u1EC7nh", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": 'L\u1EC7nh b\xE0i g\u1ED7 c\xE2y b\u1ECB s\xE9t \u0111\xE1nh, kh\u1EAFc ch\u1EEF "L\xF4i" b\u1EB1ng chu sa. Gi\u01A1 l\u1EC7nh l\xEAn, s\xE9t gi\xE1ng \u0111\xFAng \u0111\u1EA7u k\u1EBB b\u1ECB ch\u1EC9, ng\u01B0\u1EDDi tr\xFAng \u0111\u1EE9ng ng\xE2y ra.' }, "item.kim_giao_tien": { "name": "Kim Giao Ti\u1EC5n", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "C\xE2y k\xE9o v\xE0ng hai l\u01B0\u1EE1i \u0111\xFAc h\xECnh hai con giao qu\u1EA5n nhau. M\u1EDF ra l\xE0 hai giao lao t\u1EDBi, kh\xE9p l\u1EA1i th\xEC \u0111\u1EE9t c\u1EA3 x\xEDch s\u1EAFt." }, "item.tuc_nhuong": { "name": "T\u1EE9c Nh\u01B0\u1EE1ng", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "M\u1ED9t n\u1EAFm \u0111\u1EA5t t\u1EF1 l\u1EDBn, b\u1ED1c ra bao nhi\xEAu th\xEC \u0111\xEAm sau l\u1EA1i \u0111\u1EA7y b\u1EA5y nhi\xEAu. \u0110\u1EAFp l\xEAn v\u1EBFt th\u01B0\u01A1ng, \u0111\u1EA5t m\u1ECDc th\xE0nh th\u1ECBt." }, "item.bo_de_niem_chau": { "name": "B\u1ED3 \u0110\u1EC1 Ni\u1EC7m Ch\xE2u", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Chu\u1ED7i m\u1ED9t tr\u0103m l\u1EBB t\xE1m h\u1EA1t b\u1ED3 \u0111\u1EC1, cao t\u0103ng m\u1ED9t ch\xF9a c\u1ED5 Vi\xEAm Qu\u1ED1c l\u1EA7n qua tay s\xE1u m\u01B0\u01A1i n\u0103m. L\u1EA7n h\u1EA1t th\xEC t\xE2m ma nh\u01B0 n\u01B0\u1EDBc r\xFAt." }, "item.thai_am_bang_luan": { "name": "Th\xE1i \xC2m B\u0103ng Lu\xE2n", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "V\xF2ng b\u0103ng tr\u1EAFng nh\u01B0 tr\u0103ng r\u1EB1m, \u0111\xEAm kh\xF4ng tr\u0103ng th\xEC t\u1EF1 s\xE1ng. Tung l\xEAn, c\u1EA3 b\xE3i \u0111\u1EA5t d\u01B0\u1EDBi n\xF3 \u0111\xF3ng m\u1ED9t l\u1EDBp s\u01B0\u01A1ng d\xE0y ba t\u1EA5c." }, "item.oanh_thien_loi_chuy": { "name": "Oanh Thi\xEAn L\xF4i Ch\xF9y", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xF4i ch\xF9y \u0111\u1ED3ng \u0111\xFAc theo h\xECnh tr\u1ED1ng s\u1EA5m Linh gi\u1EDBi. \u0110\u1EADp hai ch\xF9y v\xE0o nhau, m\xE2y k\xE9o \u0111\u1EBFn trong m\u1ED9t nh\u1ECBp th\u1EDF." }, "item.ba_tieu_phien": { "name": "Ba Ti\xEAu Phi\u1EBFn", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Qu\u1EA1t l\xE1 chu\u1ED1i ti\xEAn, x\u1EBFp l\u1EA1i nh\u1ECF b\u1EB1ng b\xE0n tay. Qu\u1EA1t m\u1ED9t c\xE1i gi\xF3 cu\u1ED1n ng\u01B0\u1EDDi bay ba d\u1EB7m, ch\u01B0a \u0111\xE1p \u0111\u1EA5t \u0111\xE3 qu\xEAn \u0111\u01B0\u1EDDng v\u1EC1." }, "item.kien_moc_chi": { "name": "Ki\u1EBFn M\u1ED9c Chi", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "C\xE0nh g\xE3y t\u1EEB c\xE2y Ki\u1EBFn M\u1ED9c, c\xE2y n\u1ED1i tr\u1EDDi \u0111\u1EA5t th\u1EDDi tr\u01B0\u1EDBc Thi\xEAn M\xF4n. C\xE0nh ch\u1EBFt \u0111\xE3 ngh\xECn n\u0103m, c\u1EA7m v\xE0o v\u1EABn th\u1EA5y nh\u1EF1a ch\u1EA3y." }, "item.dinh_hai_chau": { "name": "\u0110\u1ECBnh H\u1EA3i Ch\xE2u", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Hai m\u01B0\u01A1i b\u1ED1n h\u1EA1t ch\xE2u xanh, t\u01B0\u01A1ng truy\u1EC1n Ng\u0169 T\u1ED5 d\xF9ng \u0111\u1EC3 gi\u1EEF b\u1EDD bi\u1EC3n l\xFAc Trung Ch\xE2u ch\xECm. R\u1EA3i quanh ng\u01B0\u1EDDi, s\xF3ng \u0111\xE1nh v\xE0o t\u1EF1 l\u1EB7ng." }, "item.ly_hoa_tien_kiem": { "name": "Ly H\u1ECFa Ti\xEAn Ki\u1EBFm", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Th\xE2n ki\u1EBFm trong su\u1ED1t nh\u01B0 th\u1EE7y tinh, b\xEAn trong m\u1ED9t ng\u1ECDn l\u1EEDa tr\u1EAFng ch\u1EA1y d\u1ECDc s\u1ED1ng ki\u1EBFm. R\xFAt kh\u1ECFi v\u1ECF th\xEC m\u1EB7t \u0111\u1EA5t quanh ch\xE2n n\u1EE9t n\u1EBB." }, "item.tu_thu_tien_y": { "name": "T\u1EED Th\u1EE5 Ti\xEAn Y", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o d\u1EC7t b\u1EB1ng s\u1EE3i t\u01A1 t\xEDm c\u1EE7a t\u1EB1m \u0103n l\xE1 c\xE2y ti\xEAn. Nh\u1EB9 nh\u01B0 kh\xF4ng m\u1EB7c, m\xE0 phi ki\u1EBFm \u0111\xE2m v\xE0o ch\u1EC9 \u0111\u1EC3 l\u1EA1i m\u1ED9t v\u1EBFt l\xF5m." }, "item.cuu_pham_lien_dai": { "name": "C\u1EEDu Ph\u1EA9m Li\xEAn \u0110\xE0i", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xE0i sen ch\xEDn t\u1EA7ng c\xE1nh, thu l\u1EA1i nh\u1ECF b\u1EB1ng n\u1EAFm tay. Ng\u1ED3i l\xEAn nh\u1EADp \u0111\u1ECBnh, linh kh\xED t\u1EF1 t\u1EE5 th\xE0nh s\u01B0\u01A1ng quanh c\xE1nh sen." }, "item.hon_thien_lang": { "name": "H\u1ED7n Thi\xEAn L\u0103ng", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "D\u1EA3i l\u1EE5a \u0111\u1ECF d\xE0i b\u1EA3y th\u01B0\u1EDBc, nh\xFAng xu\u1ED1ng s\xF4ng th\xEC c\u1EA3 kh\xFAc s\xF4ng s\xF4i. Qu\u0103ng ra n\xF3 t\u1EF1 qu\u1EA5n ng\u01B0\u1EDDi, c\xE0ng gi\xE3y c\xE0ng si\u1EBFt." }, "item.hau_tho_than_bi": { "name": "H\u1EADu Th\u1ED5 Th\u1EA7n Bi", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "T\u1EA5m bia \u0111\xE1 Ng\u0169 T\u1ED5 d\u1EF1ng \u1EDF ranh Nh\xE2n gi\u1EDBi, ch\u1EEF kh\u1EAFc \u0111\xE3 m\xF2n h\u1EBFt. C\u1EAFm bia xu\u1ED1ng, \u0111\u1EA5t trong v\xF2ng m\u01B0\u1EDDi tr\u01B0\u1EE3ng c\u1EE9ng nh\u01B0 s\u1EAFt." }, "item.tu_tieu_than_kiem": { "name": "T\u1EED Ti\xEAu Th\u1EA7n Ki\u1EBFm", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ki\u1EBFm t\xEDm luy\u1EC7n trong t\u1EA7ng m\xE2y n\u01A1i s\u1EA5m sinh ra. M\u1ED7i l\u1EA7n ra kh\u1ECFi v\u1ECF, tr\u1EDDi quang c\u0169ng c\xF3 ti\u1EBFng s\u1EA5m \u0111\xE1p l\u1EDDi." }, "item.ngoc_tinh_binh": { "name": "Ng\u1ECDc T\u1ECBnh B\xECnh", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "B\xECnh ng\u1ECDc tr\u1EAFng c\u1EAFm m\u1ED9t c\xE0nh d\u01B0\u01A1ng li\u1EC5u kh\xF4ng bao gi\u1EDD h\xE9o. V\u1EA9y c\xE0nh li\u1EC5u, gi\u1ECDt n\u01B0\u1EDBc n\xE0o r\u01A1i xu\u1ED1ng c\u0169ng l\xE0 m\u1ED9t gi\u1ECDt cam l\u1ED9." }, "item.hon_nguyen_chau": { "name": "H\u1ED7n Nguy\xEAn Ch\xE2u", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Vi\xEAn ch\xE2u x\xE1m \u0111\u1EE5c, nh\xECn k\u1EF9 th\u1EA5y b\xEAn trong n\u0103m m\xE0u cu\u1ED9n v\xE0o nhau ch\u01B0a t\xE1ch. \u0110\u1EB7t tr\u01B0\u1EDBc m\u1EB7t nh\u1EADp \u0111\u1ECBnh, linh kh\xED b\u1ED1n ph\xEDa t\u1EF1 \u0111\u1ED5 v\u1EC1 nh\u01B0 n\u01B0\u1EDBc xu\u1ED1ng tr\u0169ng." }, "item.lien_co_no": { "name": "Li\xEAn C\u01A1 N\u1ED7", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "C\xE2y n\u1ECF \u0111\u1ED3ng nh\u1ECF b\u1EB1ng b\xE0n tay, h\u1ED9p t\xEAn gi\u1EA5u trong b\xE1ng. B\xF3p m\u1ED9t l\u1EA7n, b\u1EA3y m\u0169i t\xEAn ra li\u1EC1n nhau, t\u1ECFa th\xE0nh h\xECnh qu\u1EA1t." }, "item.thien_co_hap": { "name": "Thi\xEAn C\u01A1 H\u1EA1p", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "H\u1ED9p g\u1ED7 \u0111en vu\xF4ng v\u1EE9c, s\xE1u m\u1EB7t khoan k\xEDn l\u1ED7 kim. M\u1EDF ch\u1ED1t l\xE0 kim bay ra c\u1EA3 s\xE1u ph\xEDa, n\u1EAFp h\u1ED9p t\u1EF1 \u0111\xF3ng l\u1EA1i v\xE0 n\u1EA1p kim m\u1EDBi." }, "item.ngung_huyet_chau": { "name": "Ng\u01B0ng Huy\u1EBFt Ch\xE2u", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Vi\xEAn ch\xE2u \u0111\u1ECF s\u1EADm k\u1EBFt d\u01B0\u1EDBi \u0111\xE1y ao m\xE1u tr\u0103m n\u0103m. \xC1p l\xEAn v\u1EBFt th\u01B0\u01A1ng, m\xE1u \u0111\xE3 ch\u1EA3y ra l\u1EA1i theo \u0111\u01B0\u1EDDng c\u0169 ch\u1EA3y v\u1EC1." }, "item.man_hoang_cot_mau": { "name": "Man Hoang C\u1ED1t M\xE2u", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "M\u0169i m\xE2u m\xE0i t\u1EEB nanh m\u1ED9t con hung th\xFA kh\xF4ng ai bi\u1EBFt t\xEAn, c\xE1n l\xE0 \u0111\u1ED1t s\u1ED1ng c\u1EE7a ch\xEDnh n\xF3. \u0110\xE2m v\xE0o gi\xE1p nh\u01B0 \u0111\xE2m v\xE0o \u0111\u1EA5t m\u1EC1m." }, "item.khai_son_chuy": { "name": "Khai S\u01A1n Ch\xF9y", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Ch\xF9y s\u1EAFt \u0111en n\u1EB7ng ba tr\u0103m c\xE2n, c\xE1n qu\u1EA5n da tr\xE2u. Ng\u01B0\u1EDDi kh\xF4ng luy\u1EC7n th\u1EC3 nh\u1EA5c l\xEAn \u0111\xE3 g\xE3y tay, th\u1EC3 tu vung l\xEAn th\xEC \u0111\xE1 n\xFAi v\u1EE1 v\u1EE5n." }, "item.huyen_thiet_quyen_sao": { "name": "Huy\u1EC1n Thi\u1EBFt Quy\u1EC1n S\xE1o", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xF4i bao tay huy\u1EC1n thi\u1EBFt, kh\u1EDBp ng\xF3n \u0111\xFAc gai nh\u1ECDn. \u0110\u1EA5m tr\xFAng th\xEC th\u1ECBt r\xE1ch t\u1EDBi x\u01B0\u01A1ng, m\xE1u ch\u1EA3y m\xE3i kh\xF4ng c\u1EA7m." }, "item.dao_hai_chuy": { "name": "\u0110\u1EA3o H\u1EA3i Ch\xF9y", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ch\xF9y \u0111\xF4i Huy\u1EC1n V\u0169 M\xF4n r\xE8n b\u1EB1ng s\u1EAFt v\u1EDBt d\u01B0\u1EDBi \u0111\xE1y bi\u1EC3n B\u1EAFc Minh. N\u1EC7n xu\u1ED1ng \u0111\u1EA5t, s\xF3ng kh\xED d\u1ED9i ra b\u1ED1n ph\xEDa nh\u01B0 bi\u1EC3n l\u1EADt." }, "item.o_kim_chien_giap": { "name": "\xD4 Kim Chi\u1EBFn Gi\xE1p", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Gi\xE1p v\u1EA3y \xF4 kim, m\u1EB7c v\xE0o n\u1EB7ng nh\u01B0 c\xF5ng m\u1ED9t ng\u01B0\u1EDDi. Ch\u1EC9 th\u1EC3 tu m\u1EDBi ch\u1ECBu n\u1ED5i s\u1EE9c n\u1EB7ng \u1EA5y, \u0111\u1ED5i l\u1EA1i \u0111ao ki\u1EBFm ch\xE9m v\xE0o tr\u01B0\u1EE3t \u0111i." }, "item.hang_ma_kim_xu": { "name": "H\xE0ng Ma Kim X\u1EED", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ch\xE0y kim c\u01B0\u01A1ng th\u1EE7 t\u1ECDa Kim \u0110\u1EA1o T\u1EF1 c\u1EA7m gi\u1EEF c\u1ED5ng ch\xF9a. Ma tu tr\xFAng m\u1ED9t ch\xE0y, ma kh\xED trong ng\u01B0\u1EDDi tan nh\u01B0 s\u01B0\u01A1ng g\u1EB7p n\u1EAFng." }, "item.huyen_vu_chien_giap": { "name": "Huy\u1EC1n V\u0169 Chi\u1EBFn Gi\xE1p", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Gi\xE1p \u0111\xFAc theo h\xECnh mai Huy\u1EC1n V\u0169, \u0111en b\xF3ng, v\xE2n nh\u01B0 s\xF3ng n\u01B0\u1EDBc. Tr\u01B0\u1EDFng l\xE3o Huy\u1EC1n V\u0169 M\xF4n m\u1EB7c ra tr\u1EADn ba tr\u0103m n\u0103m ch\u01B0a v\u1EE1 m\u1ED9t m\u1EA3nh." }, "item.tran_hai_than_chuy": { "name": "Tr\u1EA5n H\u1EA3i Th\u1EA7n Ch\xF9y", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ch\xF9y Huy\u1EC1n V\u0169 L\xE3o T\u1ED5 d\xF9ng tr\u1EA5n y\xEAu tri\u1EC1u B\u1EAFc c\u01B0\u01A1ng. M\u1ED9t ch\xF9y n\u1EC7n xu\u1ED1ng b\u0103ng bi\u1EC3n, s\xF3ng \u0111\xF4ng c\u1EE9ng l\u1EA1i th\xE0nh t\u01B0\u1EDDng d\xE0i m\u01B0\u1EDDi d\u1EB7m." }, "item.lang_nha_chuy": { "name": "Lang Nha Ch\u1EE7y", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Dao g\u0103m m\xE0i t\u1EEB nanh s\xF3i y\xEAu, chu\xF4i qu\u1EA5n da. L\xEDnh quan \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c gi\u1EAFt \u1EE7ng, \u0111\xE2m xuy\xEAn gi\xE1p l\xE1 nh\u01B0 \u0111\xE2m qua v\u1EA3i." }, "item.huyet_lang_chuy": { "name": "Huy\u1EBFt Lang Ch\u1EE7y", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Lang Nha Ch\u1EE7y ra l\xF2 g\u1EB7p l\xFAc huy\u1EBFt kh\xED s\xF3i c\xF2n ch\u01B0a tan, l\u01B0\u1EE1i \u0111\u1ECF nh\u01B0 v\u1EEBa u\u1ED1ng m\xE1u. \u0110\xEAm tr\u0103ng tr\xF2n n\xF3 t\u1EF1 rung trong v\u1ECF." }, "item.yeu_bi_giap": { "name": "Y\xEAu B\xEC Gi\xE1p", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "Hai l\u1EDBp da y\xEAu th\xFA kh\xE2u ch\u1ED3ng, t\u1EA9m d\u1EA7u t\xF9ng nung cho c\u1EE9ng. C\xF2n h\xF4i m\xF9i th\xFA, nh\u01B0ng vu\u1ED1t y\xEAu th\xFA c\xE0o v\xE0o th\xEC tr\u01B0\u1EE3t." }, "item.chu_ty_vong": { "name": "Chu Ty V\xF5ng", "quality": 2, "cat": "Ph\xE1p Kh\xED", "desc": "L\u01B0\u1EDBi \u0111an b\u1EB1ng t\u01A1 nh\u1EC7n r\u1EEBng, g\u1EA5p l\u1EA1i l\u1ECDt l\xF2ng b\xE0n tay. Tung ra th\xEC n\u1EDF r\u1ED9ng nh\u01B0 t\xE1n \xF4, d\xEDnh v\xE0o \u0111\xE2u l\xE0 g\u1EE1 kh\xF4ng ra." }, "item.thien_chu_vong": { "name": "Thi\xEAn Chu V\xF5ng", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "T\u01A1 trong l\u01B0\u1EDBi t\u1EF1 k\xE9o d\xE0i m\u1ED7i l\u1EA7n bung ra, gi\u0103ng k\xEDn m\u1ED9t kho\u1EA3ng tr\u1EDDi. Th\u1EE3 luy\u1EC7n c\u1EA3 \u0111\u1EDDi may l\u1EAFm m\u1EDBi ra \u0111\u01B0\u1EE3c m\u1ED9t t\u1EA5m." }, "item.ho_vi_phat": { "name": "H\u1ED3 V\u0129 Ph\u1EA5t", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA5t tr\u1EA7n c\xE1n ng\u1ECDc, t\xFAm l\xF4ng l\xE0 \u0111u\xF4i c\xE1o y\xEAu. Ph\u1EA9y qua m\u1EB7t ai, ng\u01B0\u1EDDi \u0111\xF3 tho\xE1ng ng\u1EEDi m\xF9i h\u01B0\u01A1ng l\u1EA1 r\u1ED3i \u0111\u1EE9ng ng\u1EA9n ra." }, "item.giao_can_cung": { "name": "Giao C\xE2n Cung", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "D\xE2y cung l\xE0 g\xE2n giao t\u1ED9c, l\u1EA1nh bu\u1ED1t ng\xF3n tay. Kh\xF4ng c\u1EA7n t\xEAn, k\xE9o c\u0103ng r\u1ED3i bu\xF4ng l\xE0 m\u1ED9t m\u0169i b\u0103ng bay ra." }, "item.bach_hac_vu_y": { "name": "B\u1EA1ch H\u1EA1c V\u0169 Y", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o cho\xE0ng k\u1EBFt l\xF4ng h\u1EA1c ti\xEAn, nh\u1EB9 nh\u01B0 kh\xF4ng. Ng\u01B0\u1EDDi \u0110\u1EA1i Ung th\u1EA5y ai m\u1EB7c th\xEC k\xEDnh m\xE0 xa, v\xEC kh\xF4ng bi\u1EBFt l\xF4ng \u1EA5y t\u1EEB \u0111\xE2u ra." }, "item.tuyet_bang_kiem": { "name": "Tuy\u1EBFt B\u1EB1ng Ki\u1EBFm", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Ki\u1EBFm m\u1ECFng, hai b\xEAn s\u1ED1ng c\xE0i l\xF4ng chim b\u1EB1ng nh\u01B0 \u0111\xF4i c\xE1nh. Bay ra kh\xF4ng m\u1ED9t ti\u1EBFng gi\xF3, t\u1EDBi c\u1ED5 r\u1ED3i m\u1EDBi th\u1EA5y l\u1EA1nh." }, "item.cuu_tieu_bang_kiem": { "name": "C\u1EEDu Ti\xEAu B\u1EB1ng Ki\u1EBFm", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "L\xF4ng b\u1EB1ng trong ki\u1EBFm c\xF2n gi\u1EEF \xFD ch\xED bay l\xEAn tr\u1EDDi. Ki\u1EBFm ra kh\u1ECFi v\u1ECF th\xEC r\xEDt nh\u01B0 chim b\u1EB1ng, ng\u01B0\u1EDDi B\u1EAFc Minh nghe ti\u1EBFng l\xE0 r\xFAt \u0111ao." }, "item.ho_cot_dao": { "name": "H\u1ED5 C\u1ED1t \u0110ao", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "S\u1ED1ng \u0111ao \u0111\xFAc l\u1ED3ng m\u1ED9t \u0111o\u1EA1n x\u01B0\u01A1ng h\u1ED5 gi\xE0. Ch\xE9m xu\u1ED1ng th\xEC nghe ti\u1EBFng g\u1EA7m trong l\u01B0\u1EE1i th\xE9p, ng\u1EF1a chi\u1EBFn c\u0169ng ch\xF9n ch\xE2n." }, "item.giao_lan_giap": { "name": "Giao L\xE2n Gi\xE1p", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "V\u1EA3y giao long k\u1EBFt t\u1EEBng l\u1EDBp nh\u01B0 v\u1EA3y c\xE1, m\u1EB7c v\xE0o m\xE1t nh\u01B0 ng\xE2m n\u01B0\u1EDBc. \u0110ao ki\u1EBFm ch\xE9m v\xE0o ch\u1EC9 \u0111\u1EC3 l\u1EA1i m\u1ED9t v\u1EC7t s\xE1ng." }, "item.thuong_lan_kiem": { "name": "Th\u01B0\u01A1ng Lan Ki\u1EBFm", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Ki\u1EBFm theo b\u1EA3n v\u1EBD th\u1EDDi Trung Ch\xE2u, s\u1ED1ng ki\u1EBFm b\u1ECDc v\u1EA3y giao long. Vung l\xEAn nghe ti\u1EBFng s\xF3ng c\u1EE7a m\u1ED9t v\xF9ng bi\u1EC3n gi\u1EDD \u0111\xE3 nu\u1ED1t c\u1EA3 \u0111\u1EA5t li\u1EC1n." }, "item.van_yeu_phien": { "name": "V\u1EA1n Y\xEAu Phi\xEAn", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "C\u1EDD \u0111en luy\u1EC7n quanh n\u1ED9i \u0111an m\u1ED9t y\xEAu v\u01B0\u01A1ng. Ph\u1EA5t c\u1EDD, b\xF3ng tr\u0103m y\xEAu th\xFA g\u1EA7m th\xE9t lao ra. Y\xEAu t\u1ED9c th\u1EA5y c\u1EDD n\xE0y th\xEC kh\xF4ng h\u1ECFi han g\xEC n\u1EEFa." }, "item.yeu_hoang_phien": { "name": "Y\xEAu Ho\xE0ng Phi\xEAn", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "N\u1ED9i \u0111an trong c\u1EDD ch\u01B0a ch\u1EBFt h\u1EB3n, n\xF3 nh\u1EADn ng\u01B0\u1EDDi luy\u1EC7n l\xE0m ch\u1EE7. Ph\u1EA5t c\u1EDD th\xEC b\xF3ng m\u1ED9t y\xEAu ho\xE0ng \u0111\u1EE9ng d\u1EADy sau l\u01B0ng, v\u1EA1n y\xEAu c\xFAi \u0111\u1EA7u." }, "item.phuoc_tien_tac": { "name": "Ph\u01B0\u1EE3c Ti\xEAn T\xE1c", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "D\xE2y th\u1EEBng b\u1EC7n t\u1EEB t\u01A1 nh\u1EC7n m\u1EB9, cu\u1ED9n l\u1EA1i ch\u1EC9 b\u1EB1ng n\u1EAFm tay. N\xE9m ra n\xF3 t\u1EF1 t\xECm c\u1ED5 tay c\u1ED5 ch\xE2n m\xE0 qu\u1EA5n, tu s\u0129 Tr\xFAc C\u01A1 c\u0169ng ph\u1EA3i \u0111\u1EE9ng im." }, "item.pha_giap_toan": { "name": "Ph\xE1 Gi\xE1p To\u1EA3n", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "M\u0169i khoan ng\u1EAFn kh\u1EA3m r\u0103ng chu\u1ED9t y\xEAu g\u1EB7m v\xE0ng. Ph\xF3ng ra th\xEC xo\xE1y t\xEDt, h\u1ED9 th\u1EC3 ph\xE1p quang g\u1EB7p n\xF3 nh\u01B0 gi\u1EA5y g\u1EB7p d\xF9i." }, "item.giao_le_chau_lien": { "name": "Giao L\u1EC7 Ch\xE2u Li\xEAn", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Chu\u1ED7i h\u1EA1t ng\u1ECDc lam k\u1EBFt t\u1EEB n\u01B0\u1EDBc m\u1EAFt ng\u01B0\u1EDDi c\xE1. \u0110eo l\xEAn c\u1ED5, tai nghe ti\u1EBFng s\xF3ng \u0111\u1EC1u \u0111\u1EC1u, l\xF2ng l\u1EB7ng nh\u01B0 m\u1EB7t bi\u1EC3n kh\xF4ng gi\xF3." }, "item.thong_ty_kim_con": { "name": "Th\xF4ng T\xFD Kim C\xF4n", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "C\xF4n \u0111\xFAc l\u1ED3ng x\u01B0\u01A1ng tay v\u01B0\u1EE3n th\xF4ng t\xFD, d\xE0i ng\u1EAFn t\xF9y \xFD ng\u01B0\u1EDDi c\u1EA7m. Qu\xE9t ngang m\u1ED9t v\xF2ng, \u0111\xE1 t\u1EA3ng b\xEAn \u0111\u01B0\u1EDDng v\u1EE1 th\xE0nh s\u1ECFi." }, "item.huyen_vu_thuan": { "name": "Huy\u1EC1n V\u0169 Thu\u1EABn", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Khi\xEAn tr\xF2n gh\xE9p t\u1EEB mai r\xF9a mang huy\u1EBFt m\u1EA1ch Huy\u1EC1n V\u0169, v\xE2n n\u1EE9t vi\u1EC1n b\u1EA1c. Ng\u01B0\u1EDDi B\u1EAFc Minh th\u1EA5y khi\xEAn n\xE0y th\xEC c\xFAi \u0111\u1EA7u tr\u01B0\u1EDBc, h\u1ECFi chuy\u1EC7n sau." }, "item.liet_ho_dao": { "name": "Li\u1EC7t H\u1ED5 \u0110ao", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "L\u01B0\u1EE1i \u0111ao r\xE8n t\u1EEB th\xE9p tr\u1EDDi r\u01A1i, s\u1ED1ng \u0111ao l\u1ED3ng vu\u1ED1t h\u1ED5 t\u01B0\u1EDBng. Ch\xE9m xu\u1ED1ng nghe ti\u1EBFng h\u1ED5 g\u1EA7m, v\u1EBFt th\u01B0\u01A1ng ba \u0111\u01B0\u1EDDng song song kh\xF4ng ch\u1ECBu kh\xE9p." }, "item.hoa_long_truong": { "name": "H\xF3a Long Tr\u01B0\u1EE3ng", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Tr\u01B0\u1EE3ng s\u1EEBng giao, \u0111\u1EA7u tr\u01B0\u1EE3ng ng\u1EADm vi\xEAn ch\xE2u c\xF3 b\xF3ng r\u1ED3ng b\u01A1i. D\u1ED9ng tr\u01B0\u1EE3ng xu\u1ED1ng, n\u01B0\u1EDBc \u1EDF \u0111\xE2u c\u0169ng d\u1EF1ng th\xE0nh s\xF3ng cu\u1ED9n v\u1EC1 ph\xEDa \u0111\u1ECBch." }, "item.hat_vi_tien": { "name": "H\u1EA1t V\u0129 Ti\xEAn", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Roi ch\xEDn \u0111\u1ED1t, \u0111\u1ED1t n\xE0o c\u0169ng l\xE0 m\u1ED9t \u0111\u1ED1t \u0111u\xF4i h\u1EA1t y\xEAu b\u1ECDc canh kim. Qu\u1EA5t tr\xFAng m\u1ED9t roi, \u0111\u1ED9c xanh theo m\xE1u ch\u1EA1y ng\u01B0\u1EE3c l\xEAn tim." }, "item.thien_bang_cung": { "name": "Thi\xEAn B\u1EB1ng Cung", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Th\xE2n cung l\xE0 \u1ED1ng t\u1EE7y chim b\u1EB1ng \u0111\xF4ng c\u1EE9ng, d\xE2y k\u1EBFt l\xF4ng b\u1EB1ng v\u01B0\u01A1ng. Bu\xF4ng d\xE2y l\xE0 m\u1ED9t m\u0169i b\u0103ng d\xE0i bay \u0111i, xa ng\xE0n tr\u01B0\u1EE3ng c\xF2n nghe gi\xF3 r\xEDt." }, "item.cuu_vi_huyen_dang": { "name": "C\u1EEDu V\u0129 Huy\u1EC5n \u0110\u0103ng", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xE8n l\u1ED3ng da c\xE1o, ng\u1ECDn l\u1EEDa h\u1ED3ng b\xEAn trong u\u1ED1n th\xE0nh ch\xEDn c\xE1i \u0111u\xF4i. Ai nh\xECn v\xE0o \xE1nh \u0111\xE8n s\u1EBD th\u1EA5y ng\u01B0\u1EDDi m\xECnh nh\u1EDB nh\u1EA5t, r\u1ED3i \u0111\u1EE9ng ng\xE2y ra." }, "item.thanh_moc_thuan": { "name": "Thanh M\u1ED9c Thu\u1EABn", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Thu\u1EABn tr\xF2n g\u1ECDt t\u1EEB l\xF5i c\xE2y ngh\xECn n\u0103m, m\u1EB7t c\xF2n v\xE2n xo\xE1y nh\u01B0 v\xE2n tay. \u0110\u1EC3 ch\u1ED7 \u1EA9m th\xEC m\xE9p thu\u1EABn t\u1EF1 m\u1ECDc r\u1EC5 t\u01A1, v\u1EBFt ch\xE9m tr\xEAn m\u1EB7t g\u1ED7 qua \u0111\xEAm l\xE0 li\u1EC1n." }, "item.hoi_am_thuan": { "name": "H\u1ED3i \xC2m Thu\u1EABn", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Thu\u1EABn \u0111\u1ED3ng xanh \u0111\xFAc l\u1EABn m\u1EA3nh chu\xF4ng ch\xF9a ngh\xECn n\u0103m. \u0110\xF2n \u0111\xE1nh v\xE0o l\xE0m thu\u1EABn ng\xE2n l\xEAn, ti\u1EBFng ng\xE2n d\u1ED9i ng\u01B0\u1EE3c v\xE0o tay k\u1EBB \u0111\xE1nh." }, "item.thua_anh_kiem": { "name": "Th\u1EEBa \u1EA2nh Ki\u1EBFm", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ki\u1EBFm r\xE8n t\u1EEB hai m\u1EA3nh ki\u1EBFm g\xE3y c\xF2n v\u01B0\u01A1ng ki\u1EBFm \xFD c\u1EE7a ch\u1EE7 c\u0169. R\xFAt ra gi\u1EEFa tr\u01B0a ch\u1EC9 th\u1EA5y b\xF3ng ki\u1EBFm tr\xEAn \u0111\u1EA5t, kh\xF4ng th\u1EA5y th\xE2n ki\u1EBFm." }, "item.thien_dien_phap_y": { "name": "Thi\xEAn Di\u1EC7n Ph\xE1p Y", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o l\xF3t b\u1EB1ng t\u1EA5m da v\u1EBD m\u1EB7t ng\u01B0\u1EDDi, ngo\xE0i kh\xE2u c\xE1nh d\u01A1i m\xE0ng \u0111\u1ECF. K\u1EBB nh\xECn th\u1EA5y ng\u01B0\u01A1i, m\u1ED7i l\u1EA7n nh\u1EDB l\u1EA1i l\xE0 m\u1ED9t khu\xF4n m\u1EB7t kh\xE1c." }, "item.ho_tam_noi_giap": { "name": "H\u1ED9 T\xE2m N\u1ED9i Gi\xE1p", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "M\u1EA3nh gi\xE1p ng\u1EF1c kh\xF4i l\u1ED7i c\u1ED5 l\xE0m t\u1EA5m h\u1ED9 t\xE2m, vi\u1EC1n l\xF4ng c\u01B0\u01A1ng thi d\u1EC7t d\xE0y nh\u01B0 n\u1EC9. M\u1EB7c d\u01B0\u1EDBi \xE1o, \u0111ao th\u01B0\u1EDDng ch\xE9m v\xE0o ch\u1EC9 tr\u01B0\u1EE3t \u0111i." }, "item.xich_huy_tien": { "name": "X\xEDch H\u1EE7y Ti\xEAn", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Roi gh\xE9p t\u1EEB v\u1EA3y r\u1EAFn s\xE1u ch\xE2n, n\xF3ng nh\u01B0 ng\xF3i ph\u01A1i tr\u01B0a h\xE8. Qu\u1EA5t qua \u0111\xE2u, c\u1ECF hai b\xEAn v\u1EC7t roi kh\xF4 ch\xE1y." }, "item.bi_hi_tran_bi": { "name": "B\xED H\xED Tr\u1EA5n Bi", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "T\u1EA5m bia \u0111\xE1 nh\u1ECF b\u1EB1ng b\xE0n tay, m\u1EB7t sau gh\xE9p mai long t\u1EED, ch\u1EEF kh\u1EAFc ng\u01B0\u1EE3c. D\u1EF1ng xu\u1ED1ng tr\u01B0\u1EDBc m\u1EB7t th\xEC n\u1EB7ng nh\u01B0 c\u1ED1i xay, \u0111\xF2n \u0111\xE1nh v\xE0o ch\u1EC9 l\xE0m bia rung." }, "item.phi_lan_tieu": { "name": "Phi L\xE2n Ti\xEAu", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "B\u1EA3y phi ti\xEAu m\u1ECFng m\xE0i t\u1EEB v\u1EA3y long t\u1EED ng\u1ED3i m\xE1i \u0111i\u1EC7n. N\xE9m ra kh\xF4ng r\u01A1i m\xE0 l\u01B0\u1EE3n, qua h\u1EBFt \u0111\xE1m \u0111\u1ECBch m\u1EDBi quay v\u1EC1 tay." }, "item.lieu_nguyen_phien": { "name": "Li\u1EC7u Nguy\xEAn Phi\u1EBFn", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Qu\u1EA1t k\u1EBFt l\xF4ng h\u1EA1c l\u1EEDa m\u1ED9t ch\xE2n, \u0111\u1EA7u l\xF4ng b\xE9n l\u1EEDa m\u1ED7i khi gi\xF3 qua. Ph\u1EA9y m\u1ED9t c\xE1i, gi\xF3 \u0111\u01B0a l\u1EEDa \u0111i kh\u1EAFp b\xE3i, ch\u1ED7 n\xE0o c\xF3 c\u1ECF ch\u1ED7 \u0111\xF3 ch\xE1y." }, "item.quy_loi_co": { "name": "Qu\u1EF3 L\xF4i C\u1ED5", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Tr\u1ED1ng b\u1ECBt da tr\xE2u m\u1ED9t ch\xE2n, g\xF5 m\u1ED9t ti\u1EBFng th\xEC s\u1EA5m r\u1EC1n n\u0103m d\u1EB7m. Ti\u1EBFng tr\u1ED1ng lan t\u1EDBi \u0111\xE2u, s\xE9t \u0111\xE1nh xu\u1ED1ng t\u1EDBi \u0111\xF3." }, "item.toan_nghe_lu": { "name": "Toan Ngh\xEA L\u01B0", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "L\u01B0 h\u01B0\u01A1ng \u0111\u1ED3ng nh\u1ECF, quai \u0111\xFAc h\xECnh s\u01B0 t\u1EED ng\u1ED3i, trong l\xF2ng l\u01B0 cu\u1ED9n r\xE2u long t\u1EED. Kh\xF4ng \u0111\u1ED1t tr\u1EA7m m\xE0 kh\xF3i th\u01A1m t\u1EF1 b\u1ED1c, ng\u1ED3i thi\u1EC1n c\u1EA1nh n\xF3 t\xE2m l\u1EB7ng nh\u01B0 n\u01B0\u1EDBc." }, "item.phi_liem_phong_y": { "name": "Phi Li\xEAm Phong Y", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o cho\xE0ng d\u1EC7t l\xF4ng c\xE1nh th\u1EA7n gi\xF3, m\u1ECFng nh\u01B0 s\u01B0\u01A1ng. M\u1EB7c v\xE0o quanh ng\u01B0\u1EDDi lu\xF4n c\xF3 gi\xF3 xo\xE1y nh\u1EB9, t\xEAn b\u1EAFn t\u1EDBi c\u0169ng l\u1EC7ch \u0111i." }, "item.liet_ung_cung": { "name": "Li\u1EC7t \u01AFng Cung", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Cung s\u1EEBng, m\u1ED7i m\u0169i t\xEAn c\u1EAFm m\u1ED9t l\xF4ng c\xE1nh \u01B0ng t\xF4n l\xE0m \u0111u\xF4i. T\xEAn bay kh\xF4ng nghe ti\u1EBFng gi\xF3, t\u1EDBi n\u01A1i m\u1EDBi nghe ti\u1EBFng \u01B0ng r\xEDt." }, "item.cuu_anh_ho": { "name": "C\u1EEDu Anh H\u1ED3", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "H\u1ED3 l\xF4 \u0111\xF4i luy\u1EC7n t\u1EEB m\u1EADt hung th\xFA ch\xEDn \u0111\u1EA7u, m\u1ED9t ng\u0103n l\u1EA1nh nh\u01B0 b\u0103ng, m\u1ED9t ng\u0103n n\xF3ng nh\u01B0 than. M\u1EDF n\xFAt, hai lu\u1ED3ng kh\xED \u0111\u1EA9y nhau phun ra." }, "item.cung_ky_dao": { "name": "C\xF9ng K\u1EF3 \u0110ao", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110ao b\u1EA3n r\u1ED9ng, s\u1ED1ng \u0111ao l\xE0 x\u01B0\u01A1ng c\xE1nh h\u1ED5 hung th\xFA, \u0111en nh\u01B0 s\u1EAFt ngu\u1ED9i. K\u1EBB \xE1c c\u1EA7m th\xEC th\u1EA5y \u1EA5m tay, ng\u01B0\u1EDDi l\u01B0\u01A1ng thi\u1EC7n c\u1EA7m l\xE2u bu\u1ED1t t\u1EADn x\u01B0\u01A1ng." }, "item.thao_thiet_an": { "name": "Thao Thi\u1EBFt \u1EA4n", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "\u1EA4n \u0111\u1ED3ng \u0111\xFAc quanh m\u1ED9t x\u01B0\u01A1ng h\xE0m th\u1EADt, v\xE2n Thao Thi\u1EBFt ph\u1EE7 k\xEDn b\u1ED1n m\u1EB7t. \u0110\u1EADp \u1EA5n xu\u1ED1ng, linh kh\xED quanh tr\u1EADn b\u1ECB h\xFAt s\u1EA1ch v\xE0o mi\u1EC7ng th\xFA kh\u1EAFc tr\xEAn \u1EA5n." }, "item.ly_long_giap": { "name": "Ly Long Gi\xE1p", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Gi\xE1p k\u1EBFt v\u1EA3y r\u1ED3ng kh\xF4ng s\u1EEBng, xanh lam \xE1nh v\xE0ng \u1EDF m\xE9p. \u0110\xF2n \u0111\xE1nh v\xE0o b\u1ECB d\xF2ng n\u01B0\u1EDBc xo\xE1y quanh v\u1EA3y cu\u1ED1n l\u1EC7ch \u0111i." }, "item.hoa_lan_truong": { "name": "H\u1ECFa L\xE2n Tr\u01B0\u1EE3ng", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Tr\u01B0\u1EE3ng g\u1ED7 t\u1EED \u0111\xE0n, \u0111\u1EA7u g\u1EAFn s\u1EEBng H\u1ECFa L\xE2n. L\u1EEDa \u0111\u1EA7u tr\u01B0\u1EE3ng kh\xF4ng l\xE0m b\u1ECFng tay ng\u01B0\u1EDDi hi\u1EC1n, ch\u1EC9 b\xE1m l\u1EA5y k\u1EBB mang s\xE1t \xFD." }, "item.tinh_dau_thuan": { "name": "Tinh \u0110\u1EA9u Thu\u1EABn", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Thu\u1EABn mai Huy\u1EC1n Quy, b\u1EA3y v\u1EBFt sao b\u1EAFc \u0111\u1EA9u tr\xEAn m\u1EB7t \u0111\xEAm n\xE0o c\u0169ng s\xE1ng m\u1EDD. Ng\u01B0\u1EDDi B\u1EAFc Minh tr\xF4ng th\u1EA5y th\xEC h\u1ECFi lai l\u1ECBch tr\u01B0\u1EDBc, h\u1ECFi gi\xE1 sau." }, "item.hoa_loan_vu_y": { "name": "H\u1ECFa Loan V\u0169 Y", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o d\u1EC7t l\xF4ng \u0111u\xF4i H\u1ECFa Loan, \u0111\u1ECF nh\u01B0 than h\u1ED3ng. \xC1o ch\xE1y r\xE1ch ch\u1ED7 n\xE0o, s\xE1ng h\xF4m sau ch\u1ED7 \u1EA5y m\u1ECDc l\u1EA1i l\xF4ng m\u1EDBi." }, "item.thanh_loan_tram": { "name": "Thanh Loan Tr\xE2m", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Tr\xE2m ng\u1ECDc c\xE0i m\u1ED9t s\u1EE3i l\xF4ng Thanh Loan xanh nh\u01B0 l\xE1 non. R\xFAt tr\xE2m v\u1EA9y m\u1ED9t v\xF2ng, v\u1EBFt th\u01B0\u01A1ng ng\u01B0\u1EDDi quanh m\xECnh kh\xE9p mi\u1EC7ng nh\u01B0 c\xE2y ra l\u1ED9c." }, "item.lang_nguyet_cau": { "name": "Lang Nguy\u1EC7t C\xE2u", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "\u0110\xF4i c\xE2u b\u1EA1c, gi\u1EEFa chu\xF4i kh\u1EA3m m\u1EAFt tr\xE1i c\u1EE7a Thi\xEAn Lang V\u01B0\u01A1ng. \u0110\xEAm tr\u0103ng l\u01B0\u1EE1i c\xE2u t\u1EF1 s\xE1ng, vung l\xEAn nghe nh\u01B0 c\u1EA3 b\u1EA7y s\xF3i c\xF9ng h\xFA." }, "item.van_tuong_dien": { "name": "V\u1EA1n T\u01B0\u1EDBng Di\u1EC7n", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "M\u1EB7t n\u1EA1 l\u1EE5a m\u1ECFng c\u1EE7a H\u1ED3 V\u01B0\u01A1ng, \u0111eo v\xE0o t\u1EF1 \xF4m kh\xEDt m\u1EB7t. Ng\u01B0\u1EDDi \u0111\u1ED1i di\u1EC7n th\u1EA5y ng\u01B0\u01A1i mang m\u1EB7t c\u1EE7a k\u1EBB h\u1ECD tin nh\u1EA5t." }, "item.long_huyet_thuong": { "name": "Long Huy\u1EBFt Th\u01B0\u01A1ng", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "C\xE1n th\u01B0\u01A1ng l\xE0 \u0111\u1ED1t s\u1ED1ng giao v\u01B0\u01A1ng ng\u1EA5m long huy\u1EBFt, \u0111\u1ECF th\u1EABm nh\u01B0 ng\xE2m m\xE1u. \u0110\xE2m xu\u1ED1ng s\xF4ng th\xEC c\u1EA3 kh\xFAc s\xF4ng s\xF4i l\u0103n t\u0103n." }, "item.hung_tam_kinh": { "name": "H\xF9ng T\xE2m K\xEDnh", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "G\u01B0\u01A1ng h\u1ED9 t\xE2m \u0111\xFAc quanh qu\u1EA3 tim H\xF9ng V\u01B0\u01A1ng \u0111\xE3 c\u1EE9ng nh\u01B0 s\u1EAFt. \u0110eo tr\u01B0\u1EDBc ng\u1EF1c, tim ng\u01B0\u1EDDi \u0111eo \u0111\u1EADp theo nh\u1ECBp tr\u1ED1ng tr\u1EADn, \u0111\xE1nh m\xE3i kh\xF4ng bi\u1EBFt m\u1EC7t." }, "item.bach_ho_dao": { "name": "B\u1EA1ch H\u1ED5 \u0110ao", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "L\u01B0\u1EE1i \u0111ao t\xF4i qua tinh huy\u1EBFt B\u1EA1ch H\u1ED5, tr\u1EAFng l\u1EA1nh nh\u01B0 s\u01B0\u01A1ng. Ch\xE9m ra \u0111\u1EC3 l\u1EA1i m\u1ED9t v\u1EC7t tr\u1EAFng gi\u1EEFa kh\xF4ng trung, m\xE3i m\u1EDBi tan." }, "item.tu_sa_doc_cham": { "name": "T\u1EED Sa \u0110\u1ED9c Ch\xE2m", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ch\xEDn c\xE2y kim ng\xE2m t\u1EE7y \u0111\u1ED9c c\u1EE7a H\u1EA1t V\u01B0\u01A1ng, \u0111\u1EA7u kim t\xEDm s\u1EABm, th\u01A1m m\xF9i hoa. Ch\xE2m r\u01A1i xu\u1ED1ng c\xE1t, c\xE1t quanh \u0111\xF3 t\xEDm \u0111i m\u1ED9t v\xF2ng." }, "item.vien_tam_moc_ngu": { "name": "Vi\xEAn T\xE2m M\u1ED9c Ng\u01B0", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "M\xF5 g\u1ED7 kh\u1EA3m vi\xEAn t\xE2m ng\u1ECDc c\u1EE7a v\u01B0\u1EE3n v\u01B0\u01A1ng nghe kinh ba tr\u0103m n\u0103m. G\xF5 m\u1ED9t ti\u1EBFng, t\u1EA1p ni\u1EC7m trong \u0111\u1EA7u l\u1EB7ng nh\u01B0 m\u1EB7t h\u1ED3 kh\xF4ng gi\xF3." }, "item.kim_thue_bao_y": { "name": "Kim Thu\u1EBF B\u1EA3o Y", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "\xC1o may t\u1EEB x\xE1c l\u1ED9t v\xE0ng \xF3ng c\u1EE7a X\xE0 V\u01B0\u01A1ng, c\xF2n v\u01B0\u01A1ng m\xF9i tr\u1EA7m c\u1EE7a tr\u0103m ng\xF4i mi\u1EBFu. Ng\u01B0\u1EDDi Vi\xEAm Qu\u1ED1c th\u1EA5y \xE1o n\xE0y th\xEC ch\u1EAFp tay v\xE1i tr\u01B0\u1EDBc khi nh\xECn ng\u01B0\u1EDDi m\u1EB7c." }, "item.quy_tuc_phu": { "name": "Quy T\u1EE9c Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "Tr\u1EADn v\u0103n \u1EA9n trong gi\u1EA5y ng\u1ECDc. \u0110\u1ED1t ph\xF9, th\xE2n h\xF3a linh quang r\u01A1i xu\u1ED1ng m\u1ED9t truy\u1EC1n t\u1ED1ng tr\u1EADn ng\u01B0\u01A1i \u0111\xE3 bi\u1EBFt, tr\u1EADn \u1EDF th\xE0nh l\u1EDBn hay tr\u1EADn ri\xEAng trong \u0111\u1ED9ng ph\u1EE7, mi\u1EC5n trong t\u1EA7m b\u1ED1n ngh\xECn d\u1EB7m. \u0110\u1ED1t k\xE8m linh th\u1EA1ch d\u1EABn tr\u1EADn, ph\xED t\u0103ng theo tu vi v\xE0 \u0111\u01B0\u1EDDng xa." }, "item.na_di_phu": { "name": "Na Di Ph\xF9", "quality": 2, "cat": "Ph\xF9 L\u1EE5c", "desc": "\u0110\u1ED1t ph\xF9, d\u1EDDi th\xE2n t\u1EDBi m\u1ED9t n\u01A1i ch\u1ED1n ng\u01B0\u01A1i t\u1EEBng \u0111\u1EB7t ch\xE2n t\u1EDBi, kh\xF4ng c\u1EA7n c\xF3 tr\u1EADn, mi\u1EC5n c\xF2n trong t\u1EA7m m\u1ED9t ngh\xECn d\u1EB7m. \u0110\u1ED1t k\xE8m linh th\u1EA1ch d\u1EABn tr\u1EADn, ph\xED t\u0103ng theo tu vi v\xE0 \u0111\u01B0\u1EDDng xa." }, "item.hoa_dan_phu": { "name": "H\u1ECFa \u0110\u1EA1n Ph\xF9", "quality": 1, "cat": "Ph\xF9 L\u1EE5c", "desc": "Gi\u1EA5y v\xE0ng, n\xE9t chu sa v\u1EBD m\u1ED9t v\xF2ng xo\xE1y. N\xE9m ra n\u1ED5 th\xE0nh m\u1ED9t qu\u1EA3 c\u1EA7u l\u1EEDa c\u1EE1 n\u1EAFm tay, \u0111\u1EE7 \u0111\u1ED1t l\xF4ng m\u1ED9t con s\xF3i." }, "item.bua_tru_ta": { "name": "B\xF9a tr\u1EEB t\xE0", "quality": 2, "cat": "Ph\xF9 L\u1EE5c", "desc": "Gi\u1EA5y v\xE0ng chu sa, n\xE9t b\xF9a v\u1EBD m\u1ED9t h\u01A1i kh\xF4ng \u0111\u1EE9t. D\xE1n l\xEAn binh kh\xED gi\u1EEFa tr\u1EADn, \u0111\xF2n \u0111\xE1nh mang theo d\u01B0\u01A1ng kh\xED." }, "item.canh_kim_phu": { "name": "Canh Kim Ph\xF9", "quality": 2, "cat": "Ph\xF9 L\u1EE5c", "desc": "Trong n\xE9t ph\xF9 c\xF3 nghi\u1EC1n r\u0103ng s\xF3i. K\xEDch ph\xE1t th\xEC h\xF3a m\u1ED9t m\u0169i kim quang, xuy\xEAn \u0111\u01B0\u1EE3c gi\xE1p da." }, "item.dan_loi_phu": { "name": "D\u1EABn L\xF4i Ph\xF9", "quality": 2, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\xF9 tr\u1EEB t\xE0 c\u1EE7a \u0111\u1EA1o s\u0129 \u0111i \u0111\u01B0\u1EDDng, v\u1EBD b\u1EB1ng m\u1EF1c pha huy\u1EBFt. Gi\u01A1 l\xEAn l\xE0 m\u1ED9t tia s\xE9t nh\u1ECF gi\xE1ng xu\u1ED1ng, t\xE0 v\u1EADt s\u1EE3 nh\u1EA5t." }, "item.dinh_than_phu": { "name": "\u0110\u1ECBnh Th\xE2n Ph\xF9", "quality": 2, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c pha m\u1EE7 c\xF3c y\xEAu, d\xE1n tr\xFAng ng\u01B0\u1EDDi th\xEC t\xEA c\u1EE9ng c\u1EA3 th\xE2n. Ch\u1EC9 gi\u1EEF \u0111\u01B0\u1EE3c m\u1ED9t l\xE1t, \u0111\u1EE7 cho ng\u01B0\u01A1i ra th\xEAm m\u1ED9t \u0111\xF2n." }, "item.kim_cuong_phu": { "name": "Kim C\u01B0\u01A1ng Ph\xF9", "quality": 2, "cat": "Ph\xF9 L\u1EE5c", "desc": "\u0110\u1ED1t l\xEAn th\xEC m\u1ED9t l\u1EDBp kim quang m\u1ECFng b\u1ECDc quanh th\xE2n, ch\u1ECBu \u0111\xF2n thay cho t\u1EDBi h\u1EBFt tr\u1EADn." }, "item.than_hanh_phu": { "name": "Th\u1EA7n H\xE0nh Ph\xF9", "quality": 2, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\xF9 bu\u1ED9c v\xE0o b\u1EAFp ch\xE2n, ng\u01B0\u1EDDi khi\xEAng ki\u1EC7u nh\xE0 gi\xE0u c\u0169ng hay mua. L\xFAc v\u1EA5p ph\u1EA3i hi\u1EC3m, ch\xE2n t\u1EF1 bi\u1EBFt nh\u1EA3y tr\xE1nh." }, "item.truyen_am_phu": { "name": "Truy\u1EC1n \xC2m Ph\xF9", "quality": 2, "cat": "Ph\xF9 L\u1EE5c", "desc": "G\u1EA5p th\xE0nh h\xECnh h\u1EA1c gi\u1EA5y, n\xF3i v\xE0o r\u1ED3i th\u1EA3 \u0111i. H\u1EA1c t\u1EF1 t\xECm t\u1EDBi ng\u01B0\u1EDDi b\u1EA1n l\xE2u ng\xE0y ch\u01B0a g\u1EB7p." }, "item.tam_lo_phu": { "name": "T\u1EA7m L\u1ED9 Ph\xF9", "quality": 2, "cat": "Ph\xF9 L\u1EE5c", "desc": "Tung l\xEAn th\xEC l\xE1 ph\xF9 bay v\xF2ng tr\xEAn cao, \u0111\u01B0\u1EDDng n\xFAi s\xF4ng quanh v\xF9ng hi\u1EC7n r\xF5 trong \u0111\u1EA7u ng\u01B0\u1EDDi tung." }, "item.thanh_phong_phu": { "name": "Thanh Phong Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "N\xE9t ph\xF9 v\u1EBD b\u1EB1ng l\xF4ng h\u1EA1c, gi\u1EA5y nh\u1EB9 t\u1EDBi m\u1EE9c \u0111\u1EC3 tr\xEAn b\xE0n c\u0169ng t\u1EF1 bay. K\xEDch ph\xE1t th\xE0nh m\u1ED9t l\u01B0\u1EE1i gi\xF3 xanh c\u1EAFt ngang." }, "item.thien_ti_phu": { "name": "Thi\xEAn Ti Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "T\u01A1 nh\u1EC7n y\xEAu se v\xE0o n\xE9t m\u1EF1c. N\xE9m ra th\xE0nh m\u1ED9t t\u1EA5m l\u01B0\u1EDBi b\u1EA1c tr\xF9m l\xEAn \u0111\u1ED1i th\u1EE7, gi\xE3y th\u1EBF n\xE0o c\u0169ng kh\xF4ng ra." }, "item.huyen_quy_phu": { "name": "Huy\u1EC1n Quy Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "V\u1EBD quanh m\u1ED9t m\u1EA3nh mai r\xF9a nghi\u1EC1n. K\xEDch ph\xE1t hi\u1EC7n b\xF3ng mai r\xF9a \u0111en m\u1EDD tr\xF9m l\xEAn ng\u01B0\u1EDDi, \u0111ao ch\xE9m v\xE0o nghe nh\u01B0 g\xF5 \u0111\xE1." }, "item.dia_don_phu": { "name": "\u0110\u1ECBa \u0110\u1ED9n Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\xF9 gi\u1EEF m\u1EA1ng c\u1EE7a t\xE1n tu. \u0110\u1EADp xu\u1ED1ng \u0111\u1EA5t l\xE0 ch\xECm v\xE0o l\xF2ng \u0111\u1EA5t m\xE0 \u0111i, k\u1EBB \u0111\u1ECBch \u0111\u1EE9ng nh\xECn c\xE1i h\u1ED1 tr\u1ED1ng." }, "item.huyen_bang_phu": { "name": "Huy\u1EC1n B\u0103ng Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c pha nh\u1EF1a b\u0103ng li\xEAn, gi\u1EA5y \u0111\u1EC3 l\xE2u t\u1EF1 \u0111\xF3ng m\u1ED9t l\u1EDBp s\u01B0\u01A1ng. K\xEDch ph\xE1t th\xEC m\u1ED9t c\u1ED9t b\u0103ng m\u1ECDc th\u1EB3ng d\u01B0\u1EDBi ch\xE2n \u0111\u1ED1i th\u1EE7." }, "item.tu_tieu_loi_phu": { "name": "T\u1EED Ti\xEAu L\xF4i Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\xF9 tr\u1EA5n t\xE0 c\u1EE7a \u0111\u1EA1i ph\xF9 s\u01B0, v\u1EBD ph\u1EA3i ch\u1ECDn \u0111\xEAm c\xF3 gi\xF4ng. K\xEDch ph\xE1t th\xEC m\u1ED9t \u0111\u1EA1o l\xF4i t\xEDm gi\xE1ng xu\u1ED1ng, m\u1EB7t \u0111\u1EA5t ch\xE1y \u0111en m\u1ED9t v\xF2ng." }, "item.kim_thiem_phu": { "name": "Kim Thi\u1EC1m Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c pha b\u1ED9t b\u1EA3o ch\xE2u c\xF3c y\xEAu, gi\u1EA5y v\xE0ng \xE1nh l\u1EE5c. D\xE1n tr\xFAng ai th\xEC ng\u01B0\u1EDDi \u0111\xF3 nh\u01B0 b\u1ECB c\xF3c l\u1EDBn ng\u1EADm v\xE0o mi\u1EC7ng, m\u1ED9t nh\u1ECBp th\u1EDF kh\xF4ng nh\xFAc nh\xEDch n\u1ED5i." }, "item.cuu_tieu_phong_phu": { "name": "C\u1EEDu Ti\xEAu Phong Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "N\xE9t ph\xF9 v\u1EBD b\u1EB1ng ng\xF2i x\u01B0\u01A1ng h\u1EA1c ti\xEAn, gi\u1EA5y c\u1EA7m l\xEAn t\u1EF1 bay. K\xEDch ph\xE1t th\xEC gi\xF3 t\u1EEB ch\xEDn t\u1EA7ng tr\u1EDDi gi\xE1ng xu\u1ED1ng th\xE0nh m\u1ED9t l\u01B0\u1EE1i \u0111ao xanh." }, "item.pha_quan_phu": { "name": "Ph\xE1 Qu\xE2n Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\xF9 quan \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c, m\u1EF1c \u0111\u1ECF th\u1EABm pha nanh s\xF3i tr\u0103ng m\xE1u. K\xEDch ph\xE1t h\xF3a m\u1ED9t b\xF3ng s\xF3i b\u1EA1c lao th\u1EB3ng v\xE0o ng\u1EF1c \u0111\u1ED1i th\u1EE7." }, "item.bat_dong_phu": { "name": "B\u1EA5t \u0110\u1ED9ng Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\xF9 v\u1EBD tr\xEAn da l\u01B0ng g\u1EA5u y\xEAu thay gi\u1EA5y. \u0110\u1ED1t l\xEAn th\xEC m\u1ED9t l\u1EDBp quang v\xE0ng \u0111\u1EA5t d\xE0y nh\u01B0 v\xE1ch n\xFAi b\u1ECDc l\u1EA5y ng\u01B0\u1EDDi, \u0111\u1EE9ng v\u1EEFng m\u1EA5y hi\u1EC7p li\u1EC1n." }, "item.kim_lan_doc_phu": { "name": "Kim L\xE2n \u0110\u1ED9c Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c pha m\u1EADt m\xE3ng x\xE0 v\u1EA3y v\xE0ng, gi\u1EA5y \u0111\u1EC3 l\xE2u t\u1EF1 ng\u1EA3 xanh. K\xEDch ph\xE1t th\xEC m\u1ED9t \u0111\u1EA1o kh\xED l\u1EE5c qu\u1EA5n l\u1EA5y \u0111\u1ED1i th\u1EE7, ch\u1ED7 n\xE0o ch\u1EA1m v\xE0o l\xE0 da th\u1ECBt th\xE2m \u0111en." }, "item.toa_hon_phu": { "name": "T\u1ECFa H\u1ED3n Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "V\u1EBD tr\xEAn gi\u1EA5y h\xECnh nh\xE2n c\u0169, m\u1EF1c pha n\u01B0\u1EDBc \u0111\u1ECDng n\u01A1i h\u1ED3n ch\u1EBFt \u0111u\u1ED1i. N\xE9m ra th\xEC b\xF3ng \u0111\u1ED1i th\u1EE7 b\u1ECB n\xEDu xu\u1ED1ng \u0111\u1EA5t, ng\u01B0\u1EDDi c\u0169ng \u0111\u1EE9ng ch\xF4n ch\xE2n theo." }, "item.tam_bao_phu": { "name": "T\u1EA7m B\u1EA3o Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c nghi\u1EC1n m\u0169i ch\u1ED3n t\u1EA7m b\u1EA3o, ph\xF9 g\u1EA5p l\u1EA1i c\xF2n kh\u1EBD gi\u1EADt v\u1EC1 ph\xEDa c\xF3 kim th\u1EA1ch. Tung l\xEAn th\xEC n\xFAi s\xF4ng quanh v\xF9ng hi\u1EC7n r\xF5, xa g\u1EA5p \u0111\xF4i T\u1EA7m L\u1ED9 Ph\xF9." }, "item.thuong_lang_phu": { "name": "Th\u01B0\u01A1ng L\xE3ng Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c m\xE0i t\u1EEB th\u1EE7y linh ch\xE2u, gi\u1EA5y c\u1EA7m l\xEAn nghe \xF3c \xE1ch nh\u01B0 t\xFAi n\u01B0\u1EDBc. K\xEDch ph\xE1t th\xEC m\u1ED9t con s\xF3ng b\u1EA1c \u0111\u1EADp ngang, ng\u01B0\u1EDDi tr\xFAng ng\xE3 nh\xE0o nh\u01B0 b\u1ECB \u0111\xE1 t\u1EA3ng va." }, "item.liet_diem_phu": { "name": "Li\u1EC7t Di\u1EC5m Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c c\xF3 b\u1ED9t h\u1ECFa tinh ch\xE2u, gi\u1EA5y c\u1EA7m l\xE2u \u1EA5m nh\u01B0 l\u01B0ng l\xF2. K\xEDch ph\xE1t th\xEC m\u1ED9t c\u1ED9t l\u1EEDa ph\u1EE5t th\u1EB3ng t\u1EEB \u0111\u1EA5t l\xEAn, cao ba tr\u01B0\u1EE3ng." }, "item.toan_phong_phu": { "name": "To\xE0n Phong Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "B\u1ED9t phong linh ch\xE2u r\u1EAFc v\xE0o n\xE9t m\u1EF1c, gi\u1EA5y \u0111\u1EC3 tr\xEAn b\xE0n c\u1EE9 xoay tr\xF2n. K\xEDch ph\xE1t th\xE0nh m\u1ED9t c\u1ED9t l\u1ED1c, cu\u1ED1n \u0111\u1ED1i th\u1EE7 l\xEAn r\u1ED3i qu\u1EADt xu\u1ED1ng." }, "item.am_binh_phu": { "name": "\xC2m Binh Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "C\u1ED1t ph\xF9 l\xE0 m\u1ED9t th\u1EBB l\u1EC7nh c\u1EE7a \u0111\u1EA1o qu\xE2n ch\u1EBFt tr\u1EADn. \u0110\u1ED1t ph\xF9 th\xEC nghe ti\u1EBFng gi\xE1p s\u1EAFt b\u01B0\u1EDBc \u0111\u1EC1u, m\u1ED9t h\xE0ng gi\xE1o b\xF3ng m\u1EDD \u0111\xE2m t\u1EDBi r\u1ED3i tan." }, "item.thien_loi_phu": { "name": "Thi\xEAn L\xF4i Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c c\xF3 hai h\u1EA1t l\xF4i linh ch\xE2u t\xE1n m\u1ECBn, gi\u1EA5y \u0111\u1EC3 g\u1EA7n s\u1EAFt l\xE0 s\u1EAFt rung. K\xEDch ph\xE1t th\xEC m\xE2y t\u1EE5 tr\xEAn \u0111\u1EA7u \u0111\u1ED1i th\u1EE7, s\xE9t \u0111\xE1nh xu\u1ED1ng ba l\u1EA7n li\u1EC1n." }, "item.tran_quy_phu": { "name": "Tr\u1EA5n Qu\u1EF7 Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "Th\u1EAFp C\u1EEDu U \xC2m H\u1ECFa l\xE0m \u0111\xE8n m\xE0 v\u1EBD, n\xE9t ph\xF9 xanh l\xE9t, c\u1EA7m v\xE0o l\u1EA1nh tay. K\xEDch ph\xE1t th\xEC l\u1EEDa xanh tr\xF9m l\xEAn \u0111\u1ED1i th\u1EE7, \u0111\u1ED1t c\u1EA3 th\u1ECBt l\u1EABn h\u1ED3n." }, "item.phi_cham_phu": { "name": "Phi Ch\xE2m Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "Trong n\xE9t ph\xF9 r\u1EAFc b\u1ED9t kim m\u1EA1ch \u0111\u1EA1o. K\xEDch ph\xE1t th\xEC t\u1EDD gi\u1EA5y n\u1ED5 th\xE0nh c\u1EA3 tr\u0103m m\u0169i kim s\xE1ng, b\u1EAFn t\u1EA1t v\xE0o \u0111\xE1m \u0111\u1ECBch tr\u01B0\u1EDBc m\u1EB7t." }, "item.thanh_xa_phu": { "name": "Thanh X\xE0 Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c m\xE0i v\u1EDBi b\xE0o t\u1EED n\u1EA5m \u0111\u1ED9c, n\xE9t ph\xF9 u\u1ED1n nh\u01B0 th\xE2n r\u1EAFn. N\xE9m ra h\xF3a con r\u1EAFn kh\xF3i xanh, c\u1EAFn tr\xFAng ch\u1ED7 n\xE0o l\xE0 ch\u1ED7 \u0111\xF3 t\xEDm b\u1EA7m." }, "item.thanh_tuyen_phu": { "name": "Thanh Tuy\u1EC1n Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "Gi\u1EA5y ph\xF9 ng\xE2m n\u01B0\u1EDBc r\u1EC5 th\u1EE7y ti\xEAn, c\u1EA7m l\xEAn m\xE1t tay. \u0110\u1ED1t \u0111i th\xEC m\u1ED9t d\xF2ng n\u01B0\u1EDBc trong ch\u1EA3y d\u1ECDc kinh m\u1EA1ch, v\u1EBFt th\u01B0\u01A1ng se mi\u1EC7ng." }, "item.cuong_huyet_phu": { "name": "Cu\u1ED3ng Huy\u1EBFt Ph\xF9", "quality": 3, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c tr\u1ED9n huy\u1EBFt linh chi, n\xE9t ph\xF9 \u0111\u1ECF nh\u01B0 m\xE1u t\u01B0\u01A1i. D\xE1n l\xEAn ng\u1EF1c th\xEC tim \u0111\u1EADp nh\u01B0 tr\u1ED1ng tr\u1EADn, ra \u0111\xF2n n\u1EB7ng h\u01A1n th\u01B0\u1EDDng." }, "item.lien_chau_loi_phu": { "name": "Li\xEAn Ch\xE2u L\xF4i Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\xF9 v\u1EBD m\u1ED9t chu\u1ED7i h\u1EA1t s\u1EA5m n\u1ED1i nhau, m\u1EF1c t\u1EA9m l\xF4i sa hoa. K\xEDch ph\xE1t th\xEC s\xE9t nh\u1EA3y t\u1EEB k\u1EBB n\xE0y sang k\u1EBB kh\xE1c, ti\u1EBFng n\u1ED5 li\u1EC1n nh\u01B0 ph\xE1o." }, "item.toai_giap_phu": { "name": "To\xE1i Gi\xE1p Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c c\xF3 b\u1ED9t s\u1EEBng t\xEA ng\u01B0u, n\xE9t ph\xF9 kh\u1EAFc nh\u01B0 v\u1EBFt \u0111\u1EE5c. \u0110\xE1nh tr\xFAng th\xEC gi\xE1p tr\u1EE5, v\u1EA3y c\u1EE9ng \u0111\u1EC1u n\u1EE9t to\xE1c, \u0111\xF2n sau \u0103n s\xE2u h\u01A1n." }, "item.nham_bich_phu": { "name": "Nham B\xEDch Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "V\u1EBD tr\xEAn n\u1EC1n b\u1ED9t linh v\u0103n th\u1EA1ch, t\u1EDD ph\xF9 n\u1EB7ng nh\u01B0 phi\u1EBFn \u0111\xE1 m\u1ECFng. \u0110\u1ED1t l\xEAn th\xEC m\u1ED9t v\xE1ch \u0111\xE1 x\xE1m d\u1EF1ng quanh ng\u01B0\u1EDDi, \u0111\u1EE9ng \u0111\u01B0\u1EE3c hai l\u01B0\u1EE3t." }, "item.sinh_co_phu": { "name": "Sinh C\u01A1 Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c m\xE0i t\u1EEB l\xF5i c\xE2y c\u1ED5 th\u1EE5, \u0111\u1EC3 l\xE2u gi\u1EA5y m\u1ECDc r\xEAu xanh. \u0110\u1ED1t \u0111i th\xEC m\u1EA7m xanh b\xF2 l\xEAn v\u1EBFt th\u01B0\u01A1ng, kh\xE9p mi\u1EC7ng r\u1ED3i c\xF2n d\u01B0\u1EE1ng th\xEAm v\xE0i l\u01B0\u1EE3t." }, "item.thuy_don_phu": { "name": "Th\u1EE7y \u0110\u1ED9n Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c h\xF2a th\u1EE7y linh ch\xE2u, gi\u1EA5y l\xFAc n\xE0o c\u0169ng \u1EA9m. B\xF3p n\xE1t th\xEC th\xE2n h\xF3a m\u1ED9t v\u0169ng n\u01B0\u1EDBc r\xFAt xu\u1ED1ng \u0111\u1EA5t, k\u1EBB \u0111\u1ECBch ch\u1EC9 c\xF2n \u0111\u1EE9ng gi\u1EEFa b\xE3i \u01B0\u1EDBt." }, "item.viem_vu_phu": { "name": "Vi\xEAm V\u0169 Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c c\xF3 c\xE1nh hoa nh\u1EADt lu\xE2n, gi\u1EA5y \u1EA5m nh\u01B0 v\u1EEBa ph\u01A1i n\u1EAFng. Tung l\xEAn th\xEC m\u01B0a l\u1EEDa r\u01A1i xu\u1ED1ng \u0111\xE1m \u0111\xF4ng, ch\u1ED7 n\xE0o c\u0169ng kh\xE9t." }, "item.cuong_phong_phu": { "name": "Cu\u1ED3ng Phong Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "N\xE9t ph\xF9 v\u1EBD b\u1EB1ng l\xF4ng thanh \u0111i\u1EC3u, ph\u1EA3i ch\u1EB7n \u0111\xE1 m\u1EDBi n\u1EB1m y\xEAn. K\xEDch ph\xE1t th\xEC gi\xF3 l\u1ED1c qu\xE9t c\u1EA3 b\xE3i, kh\xF4ng k\u1EBB \u0111\u1ECBch n\xE0o \u0111\u1EE9ng v\u1EEFng." }, "item.thien_nhan_phu": { "name": "Thi\xEAn Nh\u1EADn Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c nghi\u1EC1n t\u1EEB t\xE0n ki\u1EBFm \xFD trong m\u1ED9 ki\u1EBFm kh\xE1ch, ch\u1EA1m v\xE0o r\xE1t tay. K\xEDch ph\xE1t th\xE0nh ngh\xECn l\u01B0\u1EE1i dao m\u1ECFng, v\u1EBFt c\u1EAFt ch\u1EA3y m\xE1u m\xE3i kh\xF4ng c\u1EA7m." }, "item.khon_long_phu": { "name": "Kh\u1ED1n Long Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c tr\u1ED9n h\u1EA1ch s\u01A1n tinh, n\xE9t ph\xF9 cu\u1ED9n th\xE0nh m\u1ED9t v\xF2ng x\xEDch. N\xE9m tr\xFAng th\xEC \u0111\u1EA5t d\u01B0\u1EDBi ch\xE2n \u0111\u1ED1i th\u1EE7 d\u1EF1ng l\xEAn kh\xF3a ch\u1EB7t, gi\xE3y m\u1ED9t l\u01B0\u1EE3t m\u1EDBi ra." }, "item.thanh_lien_phu": { "name": "Thanh Li\xEAn Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "V\u1EBD quanh m\u1ED9t c\xE1nh giao ch\xE2u li\xEAn \xE9p kh\xF4. \u0110\u1ED1t l\xEAn th\xEC m\u1ED9t \u0111\xF3a sen xanh n\u1EDF d\u01B0\u1EDBi ch\xE2n, h\u01B0\u01A1ng sen theo h\u01A1i th\u1EDF h\xE0n g\u1EAFn kinh m\u1EA1ch." }, "item.loi_no_phu": { "name": "L\xF4i N\u1ED9 Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c t\xE1n t\u1EEB l\xF4i linh ch\xE2u, t\xF3c ng\u01B0\u1EDDi c\u1EA7m d\u1EF1ng ng\u01B0\u1EE3c. D\xE1n l\xEAn tr\xE1n th\xEC l\xF4i kh\xED ch\u1EA1y kh\u1EAFp ng\u01B0\u1EDDi hai l\u01B0\u1EE3t, \u0111\xF2n \u0111\xE1nh ra k\xE8m ti\u1EBFng s\u1EA5m." }, "item.luu_tinh_phu": { "name": "L\u01B0u Tinh Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c nghi\u1EC1n t\u1EEB thi\xEAn ngo\u1EA1i v\u1EABn thi\u1EBFt, t\u1EDD ph\xF9 n\u1EB7ng tr\u0129u tay. K\xEDch ph\xE1t th\xEC m\u1EA5y kh\u1ED1i sao b\u0103ng r\u1EF1c l\u1EEDa r\u01A1i xu\u1ED1ng, n\u1EC7n th\xE0nh h\u1ED1 gi\u1EEFa \u0111\xE1m \u0111\u1ECBch." }, "item.tuyet_vuc_phu": { "name": "Tuy\u1EBFt V\u1EF1c Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "V\u1EBD b\u1EB1ng nh\u1EF1a b\u0103ng t\u1EE7y chi, nghi\xEAn m\u1EF1c \u0111\xF3ng b\u0103ng sau m\u1ED7i n\xE9t. \u0110\u1ED1t l\xEAn th\xEC b\xE3o tuy\u1EBFt tr\xF9m c\u1EA3 tr\u1EADn, b\u0103ng nh\u1ECDn r\u01A1i l\xEAn m\u1ECDi k\u1EBB \u0111\u1ECBch." }, "item.tam_muoi_hoa_phu": { "name": "Tam Mu\u1ED9i H\u1ECFa Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c h\u01A1 qua l\u1EEDa \u0111\u1ED1t c\xE0nh ng\xF4 \u0111\u1ED3ng, gi\u1EA5y \u0111\u1ECF \u1EEDng nh\u01B0 than. Ng\u1ECDn l\u1EEDa ph\xF9 b\xE1m v\xE0o \u0111\xE2u ch\xE1y t\u1EDBi \u0111\xF3, n\u01B0\u1EDBc d\u1ED9i kh\xF4ng t\u1EAFt." }, "item.toa_tien_phu": { "name": "T\u1ECFa Ti\xEAn Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c c\xF3 b\u1ED9t \u0111\u1ED3ng chu\xF4ng c\u1ED5, l\u1EAFc t\u1EDD ph\xF9 nghe leng keng. N\xE9m ra h\xF3a ch\xEDn v\xF2ng x\xEDch v\xE0ng si\u1EBFt l\u1EA5y \u0111\u1ED1i th\u1EE7, hai l\u01B0\u1EE3t kh\xF4ng c\u1EF1a n\u1ED5i." }, "item.huyen_vu_phu": { "name": "Huy\u1EC1n V\u0169 Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\xF9 h\u1ED9 th\xE2n c\u1EE7a ng\u01B0\u1EDDi B\u1EAFc Minh, v\u1EBD tr\xEAn m\u1EA3nh gi\xE1p c\xE1 s\u1EA5u \u0111en. \u0110\u1ED1t l\xEAn th\xEC b\xF3ng r\xF9a r\u1EAFn kh\u1ED5ng l\u1ED3 cu\u1ED9n quanh ng\u01B0\u1EDDi, gi\u1EEF \u0111\u01B0\u1EE3c hai l\u01B0\u1EE3t." }, "item.hoan_sinh_phu": { "name": "Ho\xE0n Sinh Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c ng\xE2m linh th\u1EA3o ngh\xECn n\u0103m, gi\u1EA5y th\u01A1m m\xF9i c\u1ECF sau m\u01B0a. \u0110\u1ED1t l\xEAn th\xEC m\u01B0a b\u1EE5i xanh r\u01A1i xu\u1ED1ng c\u1EA3 b\xEAn m\xECnh, ai \u0111\u1EE9ng trong m\u01B0a c\u0169ng l\xE0nh d\u1EA7n." }, "item.thai_hu_don_phu": { "name": "Th\xE1i H\u01B0 \u0110\u1ED9n Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "N\xE9t ph\xF9 m\u1EA3nh nh\u01B0 t\u01A1, v\u1EBD xong ph\u1EA3i k\u1EB9p s\xE1ch k\u1EBBo bay. B\xF3p n\xE1t th\xEC th\xE2n tan v\xE0o gi\xF3, ch\u1ED7 c\u0169 ch\u1EC9 c\xF2n t\u1EDD gi\u1EA5y tr\u1EAFng bay l\u1EA3 t\u1EA3." }, "item.tram_than_phu": { "name": "Tr\u1EA3m Th\u1EA7n Ph\xF9", "quality": 7, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c m\xE0i t\u1EEB ng\xE0 c\u1EF1 t\u01B0\u1EE3ng tr\u1ED9n h\u01B0 linh ph\xE1ch, n\xE9t ph\xF9 th\u1EB3ng nh\u01B0 m\u1ED9t \u0111\u01B0\u1EDDng ki\u1EBFm. K\xEDch ph\xE1t th\xE0nh m\u1ED9t \u0111\u1EA1o ki\u1EBFm quang d\xE0i m\u01B0\u1EDDi tr\u01B0\u1EE3ng, ch\xE9m th\u1EB3ng m\u1ED9t ng\u01B0\u1EDDi." }, "item.cuu_thien_loi_phu": { "name": "C\u1EEDu Thi\xEAn L\xF4i Ph\xF9", "quality": 7, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA3i v\u1EBD tr\xEAn \u0111\u1EC9nh n\xFAi l\xFAc tr\u1EDDi gi\xF4ng, \u0111\xFAng ch\xEDn ti\u1EBFng s\u1EA5m h\u1EA1 ch\xEDn n\xE9t. K\xEDch ph\xE1t th\xEC ch\xEDn \u0111\u1EA1o l\xF4i gi\xE1ng xu\u1ED1ng \u0111\xE1m \u0111\u1ECBch, \u0111\u1EA5t ch\xE1y th\xE0nh k\xEDnh." }, "item.diem_hai_phu": { "name": "Di\u1EC7m H\u1EA3i Ph\xF9", "quality": 7, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c c\xF3 m\xE1u kim \xF4 qu\u1EA3, t\u1EDD ph\xF9 \u0111\u1EC3 trong h\u1ED9p ng\u1ECDc v\u1EABn s\xE9m n\u1EAFp. \u0110\u1ED1t l\xEAn th\xEC bi\u1EC3n l\u1EEDa tr\u1EA3i kh\u1EAFp tr\u1EADn, kh\xF4ng k\u1EBB \u0111\u1ECBch n\xE0o tho\xE1t." }, "item.thuy_lao_phu": { "name": "Th\u1EE7y Lao Ph\xF9", "quality": 7, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c h\xF2a m\u1ED9t gi\u1ECDt thi\xEAn nh\u1EA5t ch\xE2n th\u1EE7y, n\u1EB7ng nh\u01B0 th\u1EE7y ng\xE2n. N\xE9m ra th\xEC m\u1ED9t kh\u1ED1i n\u01B0\u1EDBc tr\xF9m l\u1EA5y \u0111\u1ED1i th\u1EE7 th\xE0nh ng\u1EE5c, hai l\u01B0\u1EE3t kh\xF4ng ph\xE1 n\u1ED5i." }, "item.thien_cuong_phu": { "name": "Thi\xEAn C\u01B0\u01A1ng Ph\xF9", "quality": 7, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\xF9 tr\u1EA5n tr\u1EADn c\u1EE7a \u0111\u1EA1i t\xF4ng, v\u1EBD tr\xEAn n\u1EC1n ng\xE0 c\u1EF1 t\u01B0\u1EE3ng. \u0110\u1ED1t l\xEAn th\xEC ba m\u01B0\u01A1i s\xE1u \u0111i\u1EC3m c\u01B0\u01A1ng kh\xED k\u1EBFt th\xE0nh v\xF2m, che c\u1EA3 b\xEAn m\xECnh hai l\u01B0\u1EE3t." }, "item.tao_hoa_phu": { "name": "T\u1EA1o H\xF3a Ph\xF9", "quality": 7, "cat": "Ph\xF9 L\u1EE5c", "desc": "M\u1EF1c ng\xE2m c\xE0nh ng\xF4 \u0111\u1ED3ng v\u1EDBi h\u01B0 linh ph\xE1ch, gi\u1EA5y c\u0169 \u0111\u1EC3 l\xE2u l\u1EA1i non nh\u01B0 l\xE1 m\u1EDBi. \u0110\u1ED1t l\xEAn th\xEC th\u1ECBt n\xE1t li\u1EC1n da, sinh c\u01A1 c\xF2n ch\u1EA3y m\u1EA5y l\u01B0\u1EE3t sau." }, "item.truy_phong_ngoa": { "name": "Truy Phong Ngoa", "quality": 1, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "\u0110\xF4i gi\xE0y v\u1EA3i \u0111\u1EBF gai, m\u0169i gi\xE0y th\xEAu hai \u0111\u1EA1o ph\xF9 gi\xF3. X\u1ECF v\xE0o th\xEC b\u01B0\u1EDBc nh\u1EB9 nh\u01B0 c\xF3 ng\u01B0\u1EDDi \u0111\u1EA9y sau l\u01B0ng, l\xFAc c\u1EA7n ch\u1EA1y th\xEC ch\u1EA1y tr\u01B0\u1EDBc ng\u01B0\u1EDDi ta m\u1ED9t b\u01B0\u1EDBc." }, "item.than_hanh_ngoa": { "name": "Th\u1EA7n H\xE0nh Ngoa", "quality": 2, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Gi\xE0y da h\u01B0\u01A1u, l\xF3t \u0111\u1EBF kh\u1EAFc tr\u1EADn v\u0103n, ph\u1EA3i r\xF3t linh l\u1EF1c v\xE0o m\u1EDBi ch\u1EA1y. M\u1ED9t ng\xE0y \u0111i b\u1EB1ng ng\u01B0\u1EDDi th\u01B0\u1EDDng ba ng\xE0y; k\u1EBB ch\u1EA1y tr\u1ED1n kh\xF3 m\xE0 c\u1EAFt \u0111u\xF4i." }, "item.thanh_phong_diep": { "name": "Thanh Phong Di\u1EC7p", "quality": 3, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Chi\u1EBFc l\xE1 ng\u1ECDc xanh d\xE0i h\u01A1n s\u1EA3i tay, \u0111\u1EE9ng l\xEAn l\xE0 n\xF3 n\xE2ng ng\u01B0\u1EDDi l\u01B0\u1EDBt theo gi\xF3, cao h\u01A1n ng\u1ECDn c\xE2y, qua s\xF4ng kh\xF4ng c\u1EA7n \u0111\xF2. K\u1EBB ph\u1EE5c b\xEAn \u0111\u01B0\u1EDDng \xEDt khi k\u1ECBp ng\u1EA9ng \u0111\u1EA7u." }, "item.luu_van_chu": { "name": "L\u01B0u V\xE2n Chu", "quality": 4, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Phi chu g\u1ED7 tr\u1EA7m d\xE0i hai tr\u01B0\u1EE3ng, m\u1EA1n thuy\u1EC1n kh\u1EAFc m\xE2y tr\xF4i. Bay v\u1EEFng, ch\u1EDF \u0111\u01B0\u1EE3c c\u1EA3 ng\u01B0\u1EDDi l\u1EABn h\xE0ng, c\u01B0\u01A1ng phong tr\xEAn bi\u1EC3n c\u0169ng kh\xF4ng l\u1EADt n\u1ED5i." }, "item.thanh_bang_si": { "name": "Thanh B\u1EB1ng S\xED", "quality": 4, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "\u0110\xF4i c\xE1nh luy\u1EC7n t\u1EEB l\xF4ng b\u1EB1ng, bu\u1ED9c sau l\u01B0ng l\xE0 t\u1EF1 v\u1ED7 theo linh l\u1EF1c. Bay cao th\xEC nh\xECn xa, gi\u1EEFa tr\u1EADn c\u0169ng n\xE9 \u0111\u01B0\u1EE3c nhanh h\u01A1n." }, "item.kim_bang_si": { "name": "Kim B\u1EB1ng S\xED", "quality": 5, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "C\xE1nh b\u1EB1ng l\u1EDBn, s\u1ED1ng c\xE1nh b\u1ECDc v\xE0ng r\xF2ng, v\u1ED7 m\u1ED9t c\xE1i v\u01B0\u1EE3t m\u1ED9t ng\u1ECDn n\xFAi." }, "item.con_bang_si": { "name": "C\xF4n B\u1EB1ng S\xED", "quality": 6, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "\u0110\xF4i c\xE1nh luy\u1EC7n theo d\xE1ng C\xF4n B\u1EB1ng th\u1EDDi \u0110o\u1EA1n Thi\xEAn, x\xF2e ra che k\xEDn n\u1EEDa tr\u1EDDi." }, "item.dp_thanh_bang_si": { "name": "Thanh B\u1EB1ng S\xED \u0111\u1ED3 ph\u1ED5", "quality": 4, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "T\u1EA5m l\u1EE5a v\u1EBD khung c\xE1nh, \u0111\xE1nh s\u1ED1 t\u1EEBng c\u1ECDng l\xF4ng theo th\u1EE9 t\u1EF1 c\u1EAFm. C\u1EAFm ng\u01B0\u1EE3c m\u1ED9t c\u1ECDng, c\xE1nh bay l\u1EC7ch." }, "item.dp_kim_bang_si": { "name": "Kim B\u1EB1ng S\xED \u0111\u1ED3 ph\u1ED5", "quality": 5, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Ng\u1ECDc gi\u1EA3n c\u1EE7a m\u1ED9t luy\u1EC7n kh\xED s\u01B0 B\u1EAFc Minh, ghi c\xE1ch d\xE1t v\xE0ng l\xEAn x\u01B0\u01A1ng c\xE1nh b\u1EB1ng m\xE0 kh\xF4ng l\xE0m g\xE3y." }, "item.dp_con_bang_si": { "name": "C\xF4n B\u1EB1ng S\xED c\u1ED5 ph\u1ED5", "quality": 6, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Ng\u1ECDc gi\u1EA3n b\u0103ng c\u1EE7a Tuy\u1EBFt B\u1EB1ng t\u1ED9c, kh\u1EAFc \u0111\xF4i c\xE1nh C\xF4n B\u1EB1ng t\u1EEB tr\u01B0\u1EDBc tr\u1EADn \u0110o\u1EA1n Thi\xEAn. \xC1p l\xEAn tr\xE1n nghe ti\u1EBFng gi\xF3 h\xFA." }, "item.phu_dieu_si": { "name": "Ph\xF9 Di\xEAu S\xED", "quality": 7, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "\u0110\xF4i c\xE1nh k\u1EBFt t\u1EEB l\xF4ng c\xE1nh ch\u1EE7 c\u1EE7a B\u1EB1ng V\u01B0\u01A1ng, kh\xF4ng c\xF3 gi\xF3 v\u1EABn t\u1EF1 l\u01A1 l\u1EEDng. X\xF2e ra l\xE0 gi\xF3 cu\u1ED9n l\xEAn \u0111\u1EE1 ng\u01B0\u1EDDi bay th\u1EB3ng t\u1EDBi ch\xEDn t\u1EA7ng m\xE2y." }, "item.nhan_cu": { "name": "Nh\u1EABn s\u1EAFt c\u0169", "quality": 1, "cat": "T\u1EA1p V\u1EADt", "desc": "Chi\u1EBFc nh\u1EABn g\u1EC9 s\xE9t, b\xEAn trong d\u01B0\u1EDDng nh\u01B0 c\xF3 th\u1EE9 g\xEC \u0111\xF3 \u0111ang ng\u1EE7." }, "item.manh_ngoi_trung_chau": { "name": "M\u1EA3nh ng\xF3i Trung Ch\xE2u", "quality": 2, "cat": "T\u1EA1p V\u1EADt", "desc": "M\u1EA3nh ng\xF3i l\u01B0u ly ng\u01B0 d\xE2n V\u1ECDng H\u1EA3i v\u1EDBt l\xEAn t\u1EEB \u0111\xE1y bi\u1EC3n. Hoa v\u0103n kh\xF4ng gi\u1ED1ng b\u1EA5t k\u1EF3 tri\u1EC1u n\xE0o c\xF2n l\u1EA1i." }, "item.do_gia": { "name": "\u0110\u1ED3 gi\u1EA3", "quality": 1, "cat": "T\u1EA1p V\u1EADt", "desc": "\u0110\u1ED3 gi\u1EA3 mua l\u1EA7m. Gi\u1EEF l\u1EA1i cho nh\u1EDB." }, "item.vat_la_phu_bui": { "name": "V\u1EADt l\u1EA1 ph\u1EE7 b\u1EE5i", "quality": 1, "cat": "T\u1EA1p V\u1EADt", "desc": "M\u1ED9t m\xF3n b\u1ECDc b\u1EE5i d\xE0y c\u1EA3 t\u1EA5c, g\xF5 v\xE0o nghe \u0111\u1EE5c, ch\u1EE7 s\u1EA1p c\u0169ng kh\xF4ng nh\u1EDB nh\u1EB7t \u0111\u01B0\u1EE3c \u1EDF \u0111\xE2u." }, "item.tran_ban_cau_hon": { "name": "C\xE2u H\u1ED3n Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n x\u01B0\u01A1ng ng\u01B0\u1EDDi m\xE0i ph\u1EB3ng, m\xF3c b\u1EA1c c\u1EAFm quanh m\xE9p; k\u1EBB n\xE0o ng\xE3 trong v\xF2ng tr\u1EADn th\xEC h\u1ED3n b\u1ECB m\xF3c l\u1EA1i, x\xE1c \u0111\u1EE9ng d\u1EADy quay \u0111\u1EA7u \u0111\xE1nh \u0111\u1ED3ng b\u1ECDn." }, "item.tran_ban_tu_hon": { "name": "T\u1EE5 H\u1ED3n Tr\u1EADn B\xE0n", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n g\u1ED7 h\xF2e \u0111en t\u1EA9m m\xE1u, chu\xF4ng \u0111\u1ED3ng nh\u1ECF treo b\u1ED1n g\xF3c t\u1EF1 rung khi c\xF3 ng\u01B0\u1EDDi ch\u1EBFt g\u1EA7n, g\u1ECDi x\xE1c k\u1EBB \u1EA5y \u0111\u1EE9ng d\u1EADy." }, "item.tran_ban_cuu_u": { "name": "C\u1EEDu U Tr\u1EADn B\xE0n", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\xE1 \xE2m l\u1EA1nh kh\u1EAFc ch\xEDn t\u1EA7ng \u0111\u1ECBa ng\u1EE5c, kh\xED \u0111en b\xF2 ra nh\u01B0 tay ng\u01B0\u1EDDi, k\xE9o k\u1EBB v\u1EEBa ng\xE3 \u0111\u1EE9ng d\u1EADy l\xE0m qu\u1EF7 t\u1ED1t." }, "item.tran_ban_dan_linh": { "name": "D\u1EABn Linh Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n tr\xFAc t\xEDm kh\u1EAFc nh\u1EEFng \u0111\u01B0\u1EDDng d\u1EABn nh\u01B0 r\xE3nh n\u01B0\u1EDBc, linh l\u1EF1c phe b\xE0y theo r\xE3nh ch\u1EA3y th\u1EB3ng v\xE0o ch\u1ED7 h\u1EDF c\u1EE7a \u0111\u1ECBch." }, "item.tran_ban_thong_mach": { "name": "Th\xF4ng M\u1EA1ch Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n ng\u1ECDc kh\u1EAFc h\xECnh kinh m\u1EA1ch ng\u01B0\u1EDDi, \u0111\u1EB7t xu\u1ED1ng th\xEC b\xF9a ch\xFA v\xE0 ph\xE9p tr\xF3i c\u1EE7a phe b\xE0y b\xE1m \u0111\u1ECBch ch\u1EAFc h\u01A1n." }, "item.tran_ban_thien_co": { "name": "Thi\xEAn C\u01A1 Tr\u1EADn B\xE0n", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n la b\xE0n b\u1EB1ng ng\u1ECDc \u1EA5m, kim xoay kh\xF4ng ng\u1EEBng ch\u1EC9 v\xE0o s\u01A1 h\u1EDF c\u1EE7a \u0111\u1ECBch; ph\xE9p hi\u1EC3m n\xE0o c\u1EE7a phe b\xE0y c\u0169ng kh\xF3 tr\u01B0\u1EE3t." }, "item.tran_ban_thanh_moc_duc_linh": { "name": "Thanh M\u1ED9c D\u1EE5c Linh Tr\u1EADn", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n g\u1ED7 xanh c\xF2n \u0111\xE2m ch\u1ED3i non \u1EDF m\xE9p, \u0111\u1EB7t c\u1EA1nh linh \u0111i\u1EC1n th\xEC \u0111\u1EA5t \u1EA9m v\xE0 th\u01A1m m\xF9i c\u1ECF." }, "item.tran_ban_xuan_phong_hoa_vu": { "name": "Xu\xE2n Phong H\xF3a V\u0169 Tr\u1EADn", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n ng\u1ECDc xanh l\u1EE5c lu\xF4n r\u1ECBn s\u01B0\u01A1ng, tr\xEAn linh \u0111i\u1EC1n gi\xF3 xu\xE2n th\u1ED5i v\xE0 m\u01B0a b\u1EE5i r\u01A1i quanh n\u0103m." }, "item.tran_ban_van_moc_hoi_xuan": { "name": "V\u1EA1n M\u1ED9c H\u1ED3i Xu\xE2n Tr\u1EADn", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n kh\u1EAFc t\u1EEB l\xF5i m\u1ED9t c\xE2y linh m\u1ED9c ngh\xECn n\u0103m, c\xE2y c\u1ECF quanh n\xF3 l\u1EDBn tr\xF4ng th\u1EA5y theo t\u1EEBng ng\xE0y." }, "item.tran_ban_huyet_te": { "name": "Huy\u1EBFt T\u1EBF Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\xE1 \u0111\u1ECF th\u1EABm c\xF3 r\xE3nh m\xE1u ch\u1EA1y v\xF2ng, m\xE1u ai \u0111\u1ED5 trong tr\u1EADn c\u0169ng theo r\xE3nh ch\u1EA3y v\u1EC1 ng\u01B0\u1EDDi b\xE0y th\xE0nh linh l\u1EF1c." }, "item.tran_ban_van_huyet": { "name": "V\u1EA1n Huy\u1EBFt Tr\u1EADn B\xE0n", "quality": 5, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\u1ED3ng \u0111\xFAc t\u1EEB binh kh\xED tr\xEAn chi\u1EBFn tr\u01B0\u1EDDng c\u0169, m\xF9i tanh kh\xF4ng bao gi\u1EDD tan; m\u1ED7i m\u1EA1ng ng\xE3 xu\u1ED1ng l\xE0 m\u1ED9t ng\u1EE5m linh l\u1EF1c cho k\u1EBB b\xE0y." }, "item.tran_ban_huyet_hai": { "name": "Huy\u1EBFt H\u1EA3i Tr\u1EADn B\xE0n", "quality": 7, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n huy\u1EBFt ng\u1ECDc l\xF5i s\xF3ng s\xE1nh nh\u01B0 ch\u1EE9a bi\u1EC3n m\xE1u, tr\u1EADn c\xE0ng nhi\u1EC1u ng\u01B0\u1EDDi ch\u1EBFt th\xEC k\u1EBB b\xE0y c\xE0ng d\u1ED3i d\xE0o linh l\u1EF1c." }, "item.tran_ban_dang_la": { "name": "\u0110\u1EB1ng La Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n g\u1ED7 qu\u1EA5n r\u1EC5 kh\xF4, b\xE0y ra th\xEC d\xE2y leo m\u1ECDc k\xEDn b\u1ED1n ph\xEDa, ch\u1EB7n m\u1ECDi l\u1ED1i tho\xE1t." }, "item.tran_ban_thien_la": { "name": "Thi\xEAn La Kh\u1ED1n Tr\u1EADn", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n b\u1EA1c \u0111an l\u01B0\u1EDBi t\u01A1 kim lo\u1EA1i, b\xE0y ra th\xEC tr\u1EDDi \u0111\u1EA5t nh\u01B0 b\u1ECB ch\u1EE5p trong m\u1ED9t t\u1EA5m l\u01B0\u1EDBi s\xE1ng." }, "item.tran_ban_toa_long": { "name": "T\u1ECFa Long Tr\u1EADn", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "Ch\xEDn s\u1EE3i x\xEDch huy\u1EC1n thi\u1EBFt kh\u1EAFc quanh b\xE0n, t\u01B0\u01A1ng truy\u1EC1n t\u1EEBng giam \u0111\u01B0\u1EE3c m\u1ED9t con giao long." }, "item.tran_ban_liem_tuc": { "name": "Li\u1EC5m T\u1EE9c Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n g\u1ED7 m\u1ECFng kh\u1EAFc tr\u1EADn v\u0103n ch\xECm, b\xE0y ra th\xEC h\u01A1i th\u1EDF v\xE0 linh kh\xED quanh ng\u01B0\u1EDDi l\u1EB7ng nh\u01B0 t\u1EAFt." }, "item.tran_ban_van_vu": { "name": "V\xE2n V\u1EE5 M\xEA Tr\u1EADn", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "M\u1EB7t b\xE0n ng\u1ECDc tr\u1EAFng lu\xF4n \u0111\u1ECDng m\u1ED9t l\u1EDBp h\u01A1i n\u01B0\u1EDBc, b\xE0y ra th\xEC s\u01B0\u01A1ng m\xF9 d\xE2ng k\xEDn, ng\u01B0\u1EDDi \u0111\u1EE9ng s\xE1t c\u0169ng kh\xF4ng th\u1EA5y m\u1EB7t." }, "item.tran_ban_bat_quai_me_tung": { "name": "B\xE1t Qu\xE1i M\xEA Tung Tr\u1EADn", "quality": 5, "cat": "Tr\u1EADn B\xE0n", "desc": "T\xE1m qu\u1EBB xoay ch\u1EADm quanh t\xE2m b\xE0n, k\u1EBB l\u1EA1c v\xE0o th\u1EA5y \u0111\u01B0\u1EDDng d\u01B0\u1EDBi ch\xE2n \u0111\u1ED5i h\u01B0\u1EDBng m\u1ED7i b\u01B0\u1EDBc." }, "item.tran_ban_canh_kim": { "name": "Canh Kim Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n th\xE9p tr\u1EAFng c\u1EAFm t\xE1m m\u0169i kim nh\u1ECF, kim kh\xED trong tr\u1EADn s\u1EAFc \u0111\u1EBFn r\xE1t da, \u0111\xF2n h\u1EC7 Kim c\u1EE7a phe b\xE0y c\xE0ng b\xE9n." }, "item.tran_ban_thai_bach": { "name": "Th\xE1i B\u1EA1ch Tr\u1EADn B\xE0n", "quality": 5, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n b\u1EA1c kh\u1EA3m m\u1ED9t m\u1EA3nh sao b\u0103ng, \u0111\xEAm n\xE0o c\u0169ng h\xFAt \xE1nh sao Th\xE1i B\u1EA1ch, khi\u1EBFn ki\u1EBFm kh\xED h\u1EC7 Kim trong v\xF2ng tr\u1EADn l\u1EA1nh bu\u1ED1t." }, "item.tran_ban_at_moc": { "name": "\u1EA4t M\u1ED9c Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n g\u1ED7 \u0111\xE0o c\xF2n n\u1EA3y m\u1EA7m non \u1EDF m\xE9p, m\u1ED9c kh\xED trong tr\u1EADn d\xE0y \u0111\u1EB7c, \u0111\xF2n h\u1EC7 M\u1ED9c c\u1EE7a phe b\xE0y m\u1EA1nh h\u01A1n." }, "item.tran_ban_thanh_de": { "name": "Thanh \u0110\u1EBF Tr\u1EADn B\xE0n", "quality": 5, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n ng\u1ECDc xanh kh\u1EAFc t\u01B0\u1EE3ng Thanh \u0110\u1EBF c\u1EA7m c\xE0nh li\u1EC5u, \u0111\u1EB7t xu\u1ED1ng \u0111\u1EA5t l\xE0 r\u1EC5 c\xE2y quanh \u0111\xF3 tr\u1ED3i l\xEAn, tr\u1EE3 s\u1EE9c \u0111\xF2n h\u1EC7 M\u1ED9c." }, "item.tran_ban_quy_thuy": { "name": "Qu\xFD Th\u1EE7y Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\xE1 lam l\xFAc n\xE0o c\u0169ng \u0111\u1ECDng h\u01A1i n\u01B0\u1EDBc, th\u1EE7y kh\xED trong tr\u1EADn n\u1EB7ng tr\u0129u, \u0111\xF2n h\u1EC7 Th\u1EE7y c\u1EE7a phe b\xE0y d\u1ED3n d\u1EADp h\u01A1n." }, "item.tran_ban_huyen_minh": { "name": "Huy\u1EC1n Minh Tr\u1EADn B\xE0n", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n b\u0103ng ng\u1ECDc v\u1EDBt t\u1EEB \u0111\xE1y bi\u1EC3n B\u1EAFc, n\u01B0\u1EDBc \u0111en cu\u1ED9n quanh v\xF2ng tr\u1EADn, \u0111\xF2n h\u1EC7 Th\u1EE7y n\u1EB7ng nh\u01B0 s\xF3ng tri\u1EC1u." }, "item.tran_ban_ly_hoa": { "name": "Ly H\u1ECFa Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\u1ED3ng \u0111\u1ECF kh\u1EAFc qu\u1EBB Ly, c\u1EA7m l\xE2u n\xF3ng b\u1ECFng tay, \u0111\xF2n h\u1EC7 H\u1ECFa c\u1EE7a phe b\xE0y trong tr\u1EADn ch\xE1y g\u1EAFt h\u01A1n." }, "item.tran_ban_binh_hoa": { "name": "B\xEDnh H\u1ECFa Tr\u1EADn B\xE0n", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n h\u1ECFa ng\u1ECDc gi\u1EEFa c\xF3 m\u1ED9t \u0111\u1ED1m l\u1EEDa kh\xF4ng t\u1EAFt, tr\u1EADn kh\u1EDFi th\xEC \u0111\u1EA5t trong v\xF2ng n\u1EE9t n\u1EBB, \u0111\xF2n h\u1EC7 H\u1ECFa b\xF9ng m\u1EA1nh." }, "item.tran_ban_chu_tuoc": { "name": "Chu T\u01B0\u1EDBc Tr\u1EADn B\xE0n", "quality": 7, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n kh\u1EA3m m\u1ED9t chi\u1EBFc l\xF4ng \u0111\u1ECF r\u1EF1c t\u01B0\u01A1ng truy\u1EC1n c\u1EE7a Chu T\u01B0\u1EDBc, tr\u1EADn kh\u1EDFi th\xEC b\xF3ng chim l\u1EEDa l\u01B0\u1EE3n tr\xEAn \u0111\u1EA7u, \u0111\xF2n h\u1EC7 H\u1ECFa thi\xEAu c\u1EA3 h\u01B0 kh\xF4ng." }, "item.tran_ban_mau_tho": { "name": "M\u1EADu Th\u1ED5 Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\u1EA5t v\xE0ng n\u1EC7n ch\u1EB7t n\u1EB7ng nh\u01B0 t\u1EA3ng \u0111\xE1, th\u1ED5 kh\xED trong tr\u1EADn d\xE0y, \u0111\xF2n h\u1EC7 Th\u1ED5 c\u1EE7a phe b\xE0y n\u1EC7n n\u1EB7ng h\u01A1n." }, "item.tran_ban_hau_tho": { "name": "H\u1EADu Th\u1ED5 Tr\u1EADn B\xE0n", "quality": 5, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\xE1 v\xE0ng kh\u1EAFc m\u1EA1ch n\xFAi ch\xEDn ch\xE2u, \u0111\u1EB7t xu\u1ED1ng th\xEC m\u1EB7t \u0111\u1EA5t trong v\xF2ng tr\u1EADn rung theo t\u1EEBng \u0111\xF2n h\u1EC7 Th\u1ED5." }, "item.tran_ban_pha_giap": { "name": "Ph\xE1 Gi\xE1p Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n s\u1EAFt \u0111en kh\u1EAFc chi ch\xEDt v\u1EBFt khoan, tr\u1EADn kh\u1EDFi th\xEC linh quang h\u1ED9 th\xE2n b\xEAn kia m\u1ECFng nh\u01B0 gi\u1EA5y." }, "item.tran_ban_toai_bich": { "name": "To\xE1i B\xEDch Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n ng\u1ECDc b\xEDch c\u1ED1 \xFD \u0111\u1EC3 r\u1EA1n m\u1ED9t \u0111\u01B0\u1EDDng gi\u1EEFa, l\xE1 ch\u1EAFn n\xE0o d\u1EF1ng trong v\xF2ng tr\u1EADn c\u0169ng r\u1EA1n theo \u0111\u01B0\u1EDDng \u1EA5y." }, "item.tran_ban_pha_quan": { "name": "Ph\xE1 Qu\xE2n Tr\u1EADn B\xE0n", "quality": 5, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\u1ED3ng c\u1ED5 kh\u1EAFc b\u1EA3y sao B\u1EAFc \u0110\u1EA9u, sao Ph\xE1 Qu\xE2n kh\u1EA3m h\u1ED3ng ng\u1ECDc; thu\u1EABn ph\xE1p b\xEAn kia v\u1EEBa d\u1EF1ng \u0111\xE3 v\u1EE1 qu\xE1 n\u1EEDa." }, "item.tran_ban_thach_bich": { "name": "Th\u1EA1ch B\xEDch Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "Phi\u1EBFn \u0111\xE1 x\xE1m kh\u1EAFc b\u1ED1n g\xF3c t\u01B0\u1EDDng, b\xE0y ra th\xEC quanh ng\u01B0\u1EDDi d\u1EF1ng m\u1ED9t v\xE1ch \u0111\u1EA5t m\u1EDD." }, "item.tran_ban_huyen_quy": { "name": "Huy\u1EC1n Quy Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n mai r\xF9a \u0111en, v\xE2n gi\xE1p chia m\u01B0\u1EDDi ba \xF4, b\xE0y ra th\xEC m\u1ED9t b\xF3ng r\xF9a l\u1EDBn ph\u1EE7 l\xEAn ch\u1ED7 ng\u1ED3i." }, "item.tran_ban_kim_cang": { "name": "Kim Cang H\u1ED9 Tr\u1EADn", "quality": 5, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\u1ED3ng v\xE0ng n\u1EB7ng nh\u01B0 n\xFAi, tr\u1EADn v\u0103n t\u1EE5 th\xE0nh m\u1ED9t ch\u1EEF Tr\u1EA5n, \u0111ao ki\u1EBFm ch\xE9m v\xE0o ch\u1EC9 t\xF3e l\u1EEDa." }, "item.tran_ban_van_nhac": { "name": "V\u1EA1n Nh\u1EA1c Tr\u1EA5n S\u01A1n Tr\u1EADn", "quality": 7, "cat": "Tr\u1EADn B\xE0n", "desc": "Trong b\xE0n ng\u1ECDc v\xE0ng in b\xF3ng v\u1EA1n ng\u1ECDn n\xFAi, b\xE0y ra th\xEC qu\u1EA7n s\u01A1n h\u01B0 \u1EA3nh \u0111\u1EE9ng ch\u1EAFn quanh ng\u01B0\u1EDDi." }, "item.tran_ban_tam_tai_kiem": { "name": "Tam T\xE0i Ki\u1EBFm Tr\u1EADn", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "Ba thanh ki\u1EBFm s\u1EAFt nh\u1ECF c\u1EAFm tr\xEAn b\xE0n g\u1ED7 theo th\u1EBF Thi\xEAn \u0110\u1ECBa Nh\xE2n, m\u1ED9t ki\u1EBFm \u0111\u1ED9ng th\xEC hai ki\u1EBFm kia c\xF9ng ng\xE2n." }, "item.tran_ban_lien_hoan_kiem": { "name": "Li\xEAn Ho\xE0n Ki\u1EBFm Tr\u1EADn", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\u1EA3y v\xF2ng ki\u1EBFm v\u0103n m\xF3c v\xE0o nhau nh\u01B0 x\xEDch, ki\u1EBFm kh\xED tr\xFAng m\u1ED9t ng\u01B0\u1EDDi l\xE0 v\u1EA1 l\xE2y k\u1EBB \u0111\u1EE9ng c\u1EA1nh." }, "item.tran_ban_xich_diem_kiem": { "name": "X\xEDch Di\u1EC5m Ki\u1EBFm Tr\u1EADn", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "S\xE1u thanh ki\u1EBFm nh\u1ECF kh\u1EAFc v\xE2n l\u1EEDa x\u1EBFp v\xF2ng tr\xEAn b\xE0n x\u01B0\u01A1ng, ki\u1EBFm kh\xED ch\xE9m ra k\xE9o theo l\u1EEDa b\xE9n sang k\u1EBB \u0111\u1EE9ng c\u1EA1nh." }, "item.tran_ban_cuu_cung_kiem": { "name": "C\u1EEDu Cung Ki\u1EBFm Tr\u1EADn", "quality": 5, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n th\xE9p chia ch\xEDn cung, m\u1ED7i cung gi\u1EA5u m\u1ED9t lu\u1ED3ng ki\u1EBFm kh\xED, b\xE0y ra th\xEC c\u1EA3 s\xE2n r\xEDt ti\u1EBFng ki\u1EBFm." }, "item.tran_ban_cuu_tieu_loi": { "name": "C\u1EEDu Ti\xEAu L\xF4i Tr\u1EADn", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "Ch\xEDn ch\u1ED1t g\u1ED7 ch\xE1y s\xE9t c\u1EAFm quanh b\xE0n h\xE0n ng\u1ECDc, s\u1EA5m \u0111\xE1nh tr\xFAng m\u1ED9t ng\u01B0\u1EDDi th\xEC tia \u0111i\u1EC7n nh\u1EA3y sang k\u1EBB \u0111\u1EE9ng g\u1EA7n." }, "item.tran_ban_tru_tien_kiem": { "name": "Tru Ti\xEAn Ki\u1EBFm Tr\u1EADn", "quality": 7, "cat": "Tr\u1EADn B\xE0n", "desc": "B\u1ED1n thanh ki\u1EBFm c\u1ED5 c\u1EAFm b\u1ED1n c\u1EEDa b\xE0n, s\xE1t kh\xED l\u1EA1nh t\u1EDBi m\u1EE9c s\u01B0\u01A1ng \u0111\u1ECDng tr\xEAn m\xE9p th\xE9p." }, "item.tran_ban_tan_linh": { "name": "T\xE1n Linh Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\u1EA5t nung \u0111\u1EE5c th\u1EE7ng ch\xEDn l\u1ED7, linh kh\xED quanh b\xEAn kia r\xF2 qua l\u1ED7 m\xE0 t\u1EA3n m\u1EA5t." }, "item.tran_ban_doan_mach": { "name": "\u0110o\u1EA1n M\u1EA1ch Tr\u1EADn B\xE0n", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\xE1 \u0111en kh\u1EAFc nh\u1EEFng \u0111\u01B0\u1EDDng tr\u1EADn v\u0103n c\u1EAFt ngang nhau, ch\u1EB7n m\u1EA1ch linh kh\xED ch\u1EA3y v\u1EC1 ph\xEDa \u0111\u1ECBch." }, "item.tran_ban_tan_nguyen": { "name": "T\xE1n Nguy\xEAn Tr\u1EADn B\xE0n", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n ng\u1ECDc l\u1EE5c xo\xE1y v\xE0o trong nh\u01B0 m\u1EAFt b\xE3o, k\u1EBB \u0111\u1EE9ng \u0111\u1ED1i di\u1EC7n th\u1ED5 n\u1EA1p bao nhi\xEAu c\u0169ng ch\u1EC9 gi\u1EEF l\u1EA1i \u0111\u01B0\u1EE3c m\u1ED9t \xEDt." }, "item.tran_ban_phong_mach": { "name": "Phong M\u1EA1ch Tr\u1EADn", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\xE1 kh\u1EAFc b\u1ED1n \u1EA5n phong b\u1ED1n h\u01B0\u1EDBng, b\xE0y ra th\xEC kh\xED m\u1EA1ch quanh s\xE2n \u0111\xF4ng c\u1EE9ng, ti\u1EBFng g\u1ECDi kh\xF4ng l\u1ECDt ra ngo\xE0i." }, "item.tran_ban_toa_linh": { "name": "T\u1ECFa Linh Tr\u1EADn", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "M\u01B0\u1EDDi hai chi\u1EBFc kh\xF3a \u0111\u1ED3ng nh\u1ECF treo quanh b\xE0n, b\xE0y ra th\xEC linh kh\xED trong s\xE2n nh\u01B0 b\u1ECB kh\xF3a l\u1EA1i." }, "item.tran_ban_thien_cuong_toa_linh": { "name": "Thi\xEAn C\u01B0\u01A1ng T\u1ECFa Linh Tr\u1EADn", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "Ba m\u01B0\u01A1i s\xE1u sao Thi\xEAn C\u01B0\u01A1ng \u0111i\u1EC3m tr\xEAn b\xE0n ng\u1ECDc \u0111en, k\u1EBFt th\xE0nh m\u1ED9t v\xF2m s\xE1ng ng\u0103n trong ngo\xE0i." }, "item.tran_ban_suc_dia": { "name": "S\xFAc \u0110\u1ECBa Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\xE1 xanh kh\u1EAFc ch\xEDn v\xF2ng tr\u1EADn v\u0103n, gi\u1EEFa kh\u1EA3m m\u1ED9t h\u1EA1t ng\u1ECDc v\xE0ng. \u0110\u1EB7t v\xE0o tr\u1EADn nh\xE3n \u0111\u1ED9ng ph\u1EE7 l\xE0 n\u1ED1i \u0111\u01B0\u1EE3c v\u1EDBi c\xE1c tr\u1EADn truy\u1EC1n t\u1ED1ng trong v\xF2ng m\u1ED9t n\u01B0\u1EDBc." }, "item.tran_ban_van_ly": { "name": "V\u1EA1n L\xFD Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n ng\u1ECDc \u0111en, tr\u1EADn v\u0103n ch\u1EA1y nh\u01B0 m\u1EA1ch n\u01B0\u1EDBc ng\u1EA7m, ch\u1EA1m tay th\u1EA5y \u0111\u1EA5t d\u01B0\u1EDBi ch\xE2n kh\u1EBD rung. \u0110\u1EB7t v\xE0o tr\u1EADn nh\xE3n \u0111\u1ED9ng ph\u1EE7, \u0111i kh\u1EAFp m\u1ED9t Th\u1ED5 kh\xF4ng c\u1EA7n c\u01B0\u1EE1i m\xE2y." }, "item.tran_ban_can_khon": { "name": "C\xE0n Kh\xF4n Tr\u1EADn B\xE0n", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "Hai n\u1EEDa b\xE0n b\u1EA1ch ng\u1ECDc \xFAp v\xE0o nhau, m\u1ED9t n\u1EEDa kh\u1EAFc n\xFAi, m\u1ED9t n\u1EEDa kh\u1EAFc bi\u1EC3n. \u0110\u1EB7t v\xE0o tr\u1EADn nh\xE3n \u0111\u1ED9ng ph\u1EE7, n\u1ED1i \u0111\u01B0\u1EE3c tr\u1EADn truy\u1EC1n t\u1ED1ng \u1EDF c\u1EA3 hai Th\u1ED5." }, "item.tran_ban_tu_linh": { "name": "T\u1EE5 Linh Tr\u1EADn B\xE0n", "quality": 3, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n ng\u1ECDc xanh kh\u1EA3m n\u0103m vi\xEAn linh th\u1EA1ch v\u1EE5n, b\xE0y ra th\xEC linh kh\xED quanh ch\u1ED7 ng\u1ED3i t\u1EE5 th\xE0nh s\u01B0\u01A1ng m\u1ECFng." }, "item.tran_ban_ngu_hanh_tu_linh": { "name": "Ng\u0169 H\xE0nh T\u1EE5 Linh Tr\u1EADn", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "N\u0103m g\xF3c b\xE0n kh\u1EA3m n\u0103m m\xE0u \u0111\xE1, linh kh\xED n\u0103m h\u1EC7 xoay v\xF2ng quanh ng\u01B0\u1EDDi ng\u1ED3i gi\u1EEFa." }, "item.tran_ban_chu_thien_tu_linh": { "name": "Chu Thi\xEAn T\u1EE5 Linh Tr\u1EADn", "quality": 5, "cat": "Tr\u1EADn B\xE0n", "desc": "M\u1EB7t b\xE0n kh\u1EAFc \u0111\u1EE7 ba tr\u0103m s\xE1u m\u01B0\u01A1i tinh v\u1ECB, \u0111\xEAm b\xE0y ra th\xEC \xE1nh sao r\xF3t th\u1EB3ng xu\u1ED1ng ch\u1ED7 ng\u1ED3i." }, "item.tran_ban_van_tuong_tu_linh": { "name": "V\u1EA1n T\u01B0\u1EE3ng T\u1EE5 Linh Tr\u1EADn", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "M\u1EB7t b\xE0n kh\u1EAFc n\xFAi s\xF4ng thu nh\u1ECF, \u0111\u1EB7t xu\u1ED1ng l\xE0 linh m\u1EA1ch quanh m\u01B0\u1EDDi d\u1EB7m nh\u01B0 nghi\xEAng c\u1EA3 v\u1EC1 ch\u1ED7 ng\u1ED3i." }, "item.tran_ban_hon_nguyen_tu_linh": { "name": "H\u1ED7n Nguy\xEAn T\u1EE5 Linh Tr\u1EADn", "quality": 7, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n ng\u1ECDc kh\xF4ng m\xE0u, nh\xECn l\xE2u th\u1EA5y b\xEAn trong nh\u01B0 c\xF3 tr\u1EDDi \u0111\u1EA5t m\u1EDBi m\u1EDF, linh kh\xED cu\u1ED9n v\u1EC1 th\xE0nh xo\xE1y." }, "item.tran_ban_kho_moc": { "name": "Kh\xF4 M\u1ED9c Tr\u1EADn B\xE0n", "quality": 2, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n g\u1ED7 kh\xF4 n\u1EE9t ch\xE2n chim, tr\u1EADn v\u0103n kh\u1EAFc theo v\xE2n c\xE2y ch\u1EBFt; trong v\xF2ng tr\u1EADn, v\u1EBFt th\u01B0\u01A1ng b\xEAn kia l\xE2u l\xE0nh h\u1EB3n." }, "item.tran_ban_tuyet_sinh": { "name": "Tuy\u1EC7t Sinh Tr\u1EADn B\xE0n", "quality": 4, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n \u0111\xE1 x\xE1m r\u1EC9 m\u1ED9t l\u1EDBp s\u01B0\u01A1ng l\u1EA1nh, c\xE2y c\u1ECF \u0111\u1EB7t c\u1EA1nh h\xE9o trong m\u1ED9t \u0111\xEAm; \u0111an d\u01B0\u1EE3c b\xEAn kia u\u1ED1ng v\xE0o nh\u01B0 n\u01B0\u1EDBc l\xE3." }, "item.tran_ban_tich_diet": { "name": "T\u1ECBch Di\u1EC7t Tr\u1EADn B\xE0n", "quality": 6, "cat": "Tr\u1EADn B\xE0n", "desc": "B\xE0n ng\u1ECDc tr\u1EAFng l\u1EB7ng nh\u01B0 t\u1EDD, tr\u1EADn kh\u1EDFi th\xEC sinh c\u01A1 trong v\xF2ng b\u1ECB r\xFAt c\u1EA1n, k\u1EBB b\xEAn kia h\u1ED3i ph\u1EE5c ch\u1EB3ng \u0111\u01B0\u1EE3c bao nhi\xEAu." }, "item.tru_vat_dai": { "name": "Tr\u1EEF V\u1EADt \u0110\u1EA1i", "quality": 2, "cat": "Tr\u1EEF V\u1EADt", "desc": "T\xFAi v\u1EA3i th\xEAu tr\u1EADn v\u0103n, b\xEAn trong r\u1ED9ng h\u01A1n b\xEAn ngo\xE0i. Th\xEAm 15 \xF4 t\xFAi." }, "item.bach_bao_nang": { "name": "B\xE1ch B\u1EA3o Nang", "quality": 3, "cat": "Tr\u1EEF V\u1EADt", "desc": "T\xFAi da giao long kh\xE2u ch\u1EC9 b\u1EA1c, mi\u1EC7ng t\xFAi th\u1EAFt ch\xEDn n\xFAt tr\u1EADn, b\u1ECF tr\u0103m m\xF3n v\u1EABn nh\u1EB9 nh\u01B0 kh\xF4ng. Th\xEAm 20 \xF4 t\xFAi." }, "item.tru_vat_gioi": { "name": "Tr\u1EEF V\u1EADt Gi\u1EDBi", "quality": 4, "cat": "Tr\u1EEF V\u1EADt", "desc": "Nh\u1EABn tr\u1EEF v\u1EADt, tu s\u0129 Tr\xFAc C\u01A1 tr\u1EDF l\xEAn m\u1EDBi luy\u1EC7n h\xF3a \u0111\u01B0\u1EE3c. Th\xEAm 25 \xF4 t\xFAi." }, "item.tu_di_gioi": { "name": "Tu Di Gi\u1EDBi", "quality": 5, "cat": "Tr\u1EEF V\u1EADt", "desc": "Nh\u1EABn ng\u1ECDc kh\u1EAFc kinh Tu Di, h\u1EA1t c\u1EA3i ch\u1EE9a n\xFAi, th\u1EA7n th\u1EE9c ch\u1EA1m v\xE0o l\xE0 th\u1EA5y m\u1ED9t gian kho \u0111\xE1. Th\xEAm 33 \xF4 t\xFAi." }, "item.dong_thien_gioi": { "name": "\u0110\u1ED9ng Thi\xEAn Gi\u1EDBi", "quality": 6, "cat": "Tr\u1EEF V\u1EADt", "desc": "Trong nh\u1EABn m\u1EDF m\u1ED9t \u0111\u1ED9ng thi\xEAn nh\u1ECF, c\xF3 v\xE1ch \u0111\xE1, c\xF3 m\u1EA1ch n\u01B0\u1EDBc, \u0111\u1ED3 c\u1EA5t v\xE0o kh\xF4ng b\xE1m b\u1EE5i th\u1EDDi gian. Th\xEAm 41 \xF4 t\xFAi." }, "item.tieu_can_khon_dai": { "name": "Ti\u1EC3u C\xE0n Kh\xF4n \u0110\u1EA1i", "quality": 7, "cat": "Tr\u1EEF V\u1EADt", "desc": "T\xFAi g\u1EA5m th\xEAu b\xE1t qu\xE1i, m\u1EDF mi\u1EC7ng ra l\xE0 m\u1ED9t g\xF3c tr\u1EDDi \u0111\u1EA5t ri\xEAng, gi\xF3 trong t\xFAi th\u1ED5i theo ph\xE9p c\u1EE7a ch\u1EE7. Th\xEAm 49 \xF4 t\xFAi." }, "item.can_khon_gioi": { "name": "C\xE0n Kh\xF4n Gi\u1EDBi", "quality": 8, "cat": "Tr\u1EEF V\u1EADt", "desc": "Chi\u1EBFc nh\u1EABn ch\u1EE9a c\u1EA3 m\u1ED9t ti\u1EC3u th\u1EBF gi\u1EDBi. N\xF3 theo h\u1ED3n qua c\u1EA7u N\u1EA1i H\xE0, nh\u01B0ng \u0111\u1ED3 b\xEAn trong th\xEC \u1EDF l\u1EA1i v\u1EDBi ki\u1EBFp c\u0169. Th\xEAm 60 \xF4 t\xFAi." }, "item.thon_kim_dai": { "name": "Th\xF4n Kim \u0110\u1EA1i", "quality": 6, "cat": "Tr\u1EEF V\u1EADt", "desc": "T\xFAi da kh\xE2u t\u1EEB t\xFAi m\xE1 chu\u1ED9t gi\xE0, mi\u1EC7ng t\xFAi bu\u1ED9c d\xE2y v\xE0ng, nu\u1ED1t v\xE0ng b\u1EA1c nh\u01B0 kh\xF4ng. Th\xEAm 41 \xF4 t\xFAi." }, "item.yeu_bi": { "name": "Y\xEAu B\xEC", "quality": 1, "cat": "Y\xEAu T\xE0i", "desc": "Da y\xEAu th\xFA \u0111\xE3 l\u1ED9t, c\xF2n v\u01B0\u01A1ng y\xEAu kh\xED. Th\u1EE3 may ph\xE1p y v\xE0 quan \u1EA3i \u0111\u1EC1u thu." }, "item.yeu_dan_1": { "name": "Nh\u1EA5t Giai Y\xEAu \u0110an", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "N\u1ED9i \u0111an to b\u1EB1ng h\u1EA1t sen c\u1EE7a y\xEAu th\xFA v\u1EEBa khai linh tr\xED, \u1EA5m nh\u01B0 than v\xF9i. Tu s\u0129 Luy\u1EC7n Kh\xED ng\u1ED3i luy\u1EC7n h\xF3a, y\xEAu l\u1EF1c tan v\xE0o kinh m\u1EA1ch th\xE0nh tu vi." }, "item.yeu_dan_2": { "name": "Nh\u1ECB Giai Y\xEAu \u0110an", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "N\u1ED9i \u0111an tr\xF2n tr\u1ECBa, s\u1EDD v\xE0o nghe y\xEAu kh\xED gi\u1EADt l\xEAn \u0111\u1EA7u ng\xF3n tay. H\u1EE3p cho tu s\u0129 Tr\xFAc C\u01A1 luy\u1EC7n h\xF3a l\xFAc b\u1EBF quan." }, "item.yeu_dan_3": { "name": "Tam Giai Y\xEAu \u0110an", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "Y\xEAu \u0111an \u0111\xE3 ng\u01B0ng th\xE0nh s\u1EAFc, soi ra s\xE1ng th\u1EA5y v\xE2n nh\u01B0 v\xE2n m\u1EAFt th\xFA. Tu s\u0129 K\u1EBFt \u0110an luy\u1EC7n h\xF3a, \u0111an \u0111i\u1EC1n \u0111\u1EA7y th\xEAm m\u1ED9t t\u1EA7ng." }, "item.yeu_dan_4": { "name": "T\u1EE9 Giai Y\xEAu \u0110an", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "N\u1ED9i \u0111an \u0111\u1EA1i y\xEAu, b\xEAn trong m\u01A1 h\u1ED3 c\xF3 h\xECnh con th\xFA cu\u1ED9n m\xECnh ng\u1EE7. Nguy\xEAn Anh luy\u1EC7n h\xF3a m\u1EDBi ch\u1ECBu n\u1ED5i y\xEAu l\u1EF1c c\u1EE7a n\xF3." }, "item.yeu_dan_5": { "name": "Ng\u0169 Giai Y\xEAu \u0110an", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Y\xEAu \u0111an c\u1EE7a y\xEAu th\xFA s\u1EAFp h\xF3a h\xECnh, n\u1EB7ng nh\u01B0 ch\xEC, t\u1ECFa uy \xE1p khi\u1EBFn th\xFA nh\u1ECF quanh \u0111\xF3 ph\u1EE7 ph\u1EE5c. Ch\u1EC9 H\xF3a Th\u1EA7n d\xE1m luy\u1EC7n h\xF3a." }, "item.giao_long_lan": { "name": "Giao Long L\xE2n", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "V\u1EA3y giao long s\u1EAFp h\xF3a r\u1ED3ng, \u0111ao ki\u1EBFm th\u01B0\u1EDDng ch\xE9m kh\xF4ng tr\u1EA7y. Luy\u1EC7n kh\xED s\u01B0 Tr\xFAc C\u01A1 tranh nhau mua." }, "item.yeu_vuong_noi_dan": { "name": "Y\xEAu V\u01B0\u01A1ng N\u1ED9i \u0110an", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "N\u1ED9i \u0111an y\xEAu v\u01B0\u01A1ng tr\u0103m n\u0103m, c\u1EA7m tr\xEAn tay c\xF2n nghe ti\u1EBFng g\u1EA7m. C\u1EA3 m\u1ED9t t\xF4ng m\xF4n c\xF3 th\u1EC3 v\xEC n\xF3 m\xE0 khai chi\u1EBFn." }, "item.khai_khieu_chau": { "name": "Khai Khi\u1EBFu Ch\xE2u", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t ch\xE2u \u0111\u1EE5c to b\u1EB1ng h\u1EA1t \u0111\u1EADu, n\u1EB1m trong s\u1ECD y\xEAu th\xFA v\u1EEBa qua m\u1ED9t l\u1EA7n b\xECnh c\u1EA3nh. Tu s\u0129 Tr\xFAc C\u01A1 ch\u1EA1m b\xECnh c\u1EA3nh nu\u1ED1t v\xE0o, v\xE1ch ch\xE2n kh\xED l\u1ECFng ra m\u1ED9t n\u1EEDa." }, "item.xuyen_bich_giac": { "name": "Xuy\xEAn B\xEDch Gi\xE1c", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EA9u s\u1EEBng xo\u1EAFn, \u0111\u1EA7u m\xF2n nh\u1EB5n nh\u01B0 t\u1EEBng h\xFAc th\u1EE7ng v\xE1ch \u0111\xE1. Tu s\u0129 K\u1EBFt \u0110an ch\u1EA1m b\xECnh c\u1EA3nh m\xE0i b\u1ED9t u\u1ED1ng, kim \u0111an xoay m\u1EA1nh l\xEAn, v\xE1ch ch\u01B0\u1EDBng n\u1EE9t m\u1ED9t n\u1EEDa." }, "item.huyen_quan_tuy": { "name": "Huy\u1EC1n Quan T\u1EE7y", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "T\u1EE7y l\u1EA5y t\u1EEB khe x\u01B0\u01A1ng s\u1ED1ng \u0111\u1EA1i y\xEAu, s\u1EC7t nh\u01B0 m\u1EADt, \xE1nh t\xEDm. Nguy\xEAn Anh ch\u1EA1m b\xECnh c\u1EA3nh nu\u1ED1t m\u1ED9t gi\u1ECDt, c\u1EEDa \u1EA3i trong th\xE2n m\u1EDF h\xE9 \u0111\u01B0\u1EE3c m\u1ED9t n\u1EEDa." }, "item.hu_linh_phach": { "name": "H\u01B0 Linh Ph\xE1ch", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "M\u1ED9t \u0111\u1ED1m s\xE1ng nh\u1EA1t kh\xF4ng c\xF3 h\xECnh, ph\u1EA3i nh\u1ED1t trong h\u1ED9p ng\u1ECDc m\u1EDBi gi\u1EEF \u0111\u01B0\u1EE3c. L\xE0 ch\xFAt th\u1EA7n ni\u1EC7m \u0111\u1EA1i y\xEAu H\xF3a Th\u1EA7n \u0111\u1EC3 l\u1EA1i; nguy\xEAn th\u1EA7n nu\u1ED1t v\xE0o, b\xECnh c\u1EA3nh tan \u0111i m\u1ED9t n\u1EEDa." }, "item.tru_nha": { "name": "Tr\u01B0 Nha", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "Nanh l\u1EE3n r\u1EEBng cong nh\u01B0 l\u01B0\u1EE1i li\u1EC1m, g\u1ED1c c\xF2n d\xEDnh m\xE1u kh\xF4. Th\u1EE3 r\xE8n m\xE0i l\xE0m m\u0169i gi\xE1o, ph\xF9 s\u01B0 nghi\u1EC1n b\u1ED9t tr\u1ED9n m\u1EF1c ph\xF9 ph\xE1 gi\xE1p." }, "item.te_nguu_giac": { "name": "T\xEA Ng\u01B0u Gi\xE1c", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "S\u1EEBng t\xEA \u0111en b\xF3ng, g\xF5 v\xE0o nghe nh\u01B0 g\xF5 s\u1EAFt. Luy\u1EC7n kh\xED s\u01B0 \u0111\xFAc v\xE0o m\u0169i th\u01B0\u01A1ng, \u0111\u1EA7u ch\xF9y; \u0111an s\u01B0 m\xE0i b\u1ED9t l\xE0m thu\u1ED1c h\u1EA1 nhi\u1EC7t \u0111\u1ED9c." }, "item.kim_giac": { "name": "Kim Gi\xE1c", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "S\u1EEBng v\xE0ng c\u1EE7a Kim Gi\xE1c T\xEA, n\u1EB7ng g\u1EA5p \u0111\xF4i s\u1EEBng th\u01B0\u1EDDng, \u0111\u1EA7u nh\u1ECDn c\u1EAFt \u0111\u01B0\u1EE3c \u0111\xE1. Luy\u1EC7n b\u1EA3o l\xE0m ph\xE1p kh\xED ph\xE1 ph\xF2ng, thu\u1EABn h\u1ED9 th\xE2n xuy\xEAn kh\xF4ng th\u1EE7ng." }, "item.cu_tuong_nha": { "name": "C\u1EF1 T\u01B0\u1EE3ng Nha", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Ng\xE0 voi H\u1ED3ng Hoang d\xE0i h\u01A1n th\xE2n ng\u01B0\u1EDDi, v\xE2n trong ng\xE0 nh\u01B0 v\xF2ng tu\u1ED5i c\xE2y c\u1ED5 th\u1EE5. L\xE0m c\u1ED1t ph\xE1p b\u1EA3o tr\u1EA5n n\xFAi, kh\u1EAFc tr\u1EADn b\xE0n gi\u1EEF \u0111\u1EA5t." }, "item.bao_bi": { "name": "B\xE1o B\xEC", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "Da b\xE1o \u0111en loang \u0111\u1ED1m kh\xF3i, m\u1EB7c v\xE0o \u0111i \u0111\xEAm kh\xF4ng nghe ti\u1EBFng s\u1ED9t so\u1EA1t. Th\u1EE3 may ph\xE1p y kh\xE2u \xE1o th\xE2n ph\xE1p, gi\xE0y nh\u1EB9." }, "item.loi_van_bao_bi": { "name": "L\xF4i V\u0103n B\xE1o B\xEC", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "Da b\xE1o c\xF3 v\u1EB1n t\xEDm nh\u01B0 tia ch\u1EDBp, ch\u1EA1m tay c\xF2n t\xEA. Luy\u1EC7n b\u1EA3o l\xE0m ph\xE1p y h\u1EC7 l\xF4i; ph\xF9 s\u01B0 c\u1EAFt s\u1EE3i l\xF4ng v\u1EB1n l\xE0m b\xFAt v\u1EBD L\xF4i ph\xF9." }, "item.phong_mat": { "name": "Phong M\u1EADt", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EADt ong \u0111\u1ED9c v\xE0ng s\u1EABm, ng\u1ECDt \u0111\u1EBFn g\u1EAFt c\u1ED5. \u0110an s\u01B0 d\xF9ng l\xE0m ch\u1EA5t k\u1EBFt vi\xEAn \u0111an, n\u1EA5u v\u1EDBi th\u1EA3o d\u01B0\u1EE3c th\xE0nh cao b\u1ED5 kh\xED." }, "item.diep_phan": { "name": "\u0110i\u1EC7p Ph\u1EA5n", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "Ph\u1EA5n c\xE1nh Huy\u1EC5n \u0110i\u1EC7p \xF3ng \xE1nh nh\u01B0 b\u1EE5i tr\u0103ng, h\xEDt ph\u1EA3i th\xEC m\u1EAFt hoa. Ph\xF9 s\u01B0 tr\u1ED9n v\xE0o m\u1EF1c v\u1EBD ph\xF9 m\xEA, \u0111an s\u01B0 l\xE0m h\u01B0\u01A1ng an th\u1EA7n." }, "item.ngo_cong_doc_nang": { "name": "Ng\xF4 C\xF4ng \u0110\u1ED9c Nang", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "T\xFAi \u0111\u1ED9c d\u01B0\u1EDBi h\xE0m r\u1EBFt s\xE1u c\xE1nh, b\xF3p nh\u1EB9 \u0111\xE3 r\u1EC9 n\u01B0\u1EDBc xanh. \u0110an s\u01B0 luy\u1EC7n \u0111\u1ED9c \u0111an v\xE0 thu\u1ED1c gi\u1EA3i; th\u1EE3 r\xE8n t\xF4i v\xE0o l\u01B0\u1EE1i dao." }, "item.huyet_dia_dich": { "name": "Huy\u1EBFt \u0110\u1EC9a D\u1ECBch", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "D\u1ECBch nh\u1EDBt trong b\u1EE5ng \u0111\u1EC9a \u0111\u1EA7m, b\xF4i l\xEAn v\u1EBFt th\u01B0\u01A1ng th\xEC m\xE1u ng\u1EEBng ch\u1EA3y. Lang trung, \u0111an s\u01B0 d\xF9ng l\xE0m thu\u1ED1c c\u1EA7m m\xE1u." }, "item.ngac_giap": { "name": "Ng\u1EA1c Gi\xE1p", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "V\u1EA3y l\u01B0ng c\xE1 s\u1EA5u tr\u1EAFng, d\xE0y nh\u01B0 ng\xF3i, ng\xE2m n\u01B0\u1EDBc tr\u0103m n\u0103m kh\xF4ng m\u1EE5c. Luy\u1EC7n b\u1EA3o l\xE0m h\u1ED9 gi\xE1p, thu\u1EABn nh\u1ECF cho tu s\u0129 m\u1EDBi v\xE0o ngh\u1EC1." }, "item.kinh_du": { "name": "K\xECnh Du", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "D\u1EA7u \xE9p t\u1EEB m\u1EE1 K\xECnh Ng\u01B0, m\u1ED9t b\xE1t th\u1EAFp \u0111\xE8n \u0111\u01B0\u1EE3c ba th\xE1ng kh\xF4ng t\u1EAFt. Luy\u1EC7n b\u1EA3o d\xF9ng b\xF4i tr\u01A1n l\xF2, gi\u1EEF l\u1EEDa \u0111\u1EC1u; \u0111an s\u01B0 l\xE0m cao h\u1ED9 m\u1EA1ch." }, "item.huyen_ngac_giap": { "name": "Huy\u1EC1n Ng\u1EA1c Gi\xE1p", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "Mai l\u01B0ng H\u1EAFc Th\u1EE7y Huy\u1EC1n Ng\u1EA1c, \u0111en nh\u01B0 m\u1EF1c, \u0111ao ki\u1EBFm ch\xE9m v\xE0o ch\u1EC9 t\xF3e l\u1EEDa. Luy\u1EC7n b\u1EA3o l\xE0m gi\xE1p, thu\u1EABn h\u1EC7 th\u1EE7y cho Nguy\xEAn Anh." }, "item.te_giap_phien": { "name": "T\xEA Gi\xE1p Phi\u1EBFn", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "V\u1EA3y t\xEA t\xEA x\u1EBFp l\u1EDBp nh\u01B0 ng\xF3i l\u1EE3p, l\u1EADt ng\u1EEDa th\u1EA5y c\xE1t c\xF2n k\u1EB9t trong k\u1EBD. Luy\u1EC7n b\u1EA3o gh\xE9p th\xE0nh h\u1ED9 gi\xE1p; nghi\u1EC1n b\u1ED9t l\xE0m \u0111an th\xF4ng kinh l\u1EA1c." }, "item.sa_trung_tam": { "name": "Sa Tr\xF9ng T\xE2m", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "Qu\u1EA3 tim sa tr\xF9ng to b\u1EB1ng n\u1EAFm tay, c\u1EE9ng nh\u01B0 \u0111\xE1, v\u1EABn c\xF2n \u1EA5m. \u0110an s\u01B0 luy\u1EC7n \u0111an th\u1ED5 h\u1EC7; luy\u1EC7n b\u1EA3o kh\u1EA3m v\xE0o ph\xE1p kh\xED \u0111\u1ED9n \u0111\u1ECBa." }, "item.hoa_ke_vu": { "name": "H\u1ECFa K\xEA V\u0169", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng \u0111u\xF4i g\xE0 l\u1EEDa \u0111\u1ECF r\u1EF1c, c\u1EAFm v\xE0o b\xF9i nh\xF9i l\xE0 b\xE9n l\u1EEDa. Ph\xF9 s\u01B0 l\xE0m b\xFAt v\u1EBD H\u1ECFa ph\xF9; \u0111an s\u01B0 d\xF9ng m\u1ED3i l\u1EEDa l\xF2." }, "item.bien_buc_si": { "name": "Bi\xEAn B\u1EE9c S\xED", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "C\xE1nh d\u01A1i m\xE0ng \u0111\u1ECF, soi l\xEAn \u0111\xE8n th\u1EA5y g\xE2n m\xE1u ch\u1EB1ng ch\u1ECBt. Luy\u1EC7n b\u1EA3o l\xE0m \xE1o cho\xE0ng \u1EA9n th\xE2n; \u0111an s\u01B0 l\u1EA5y m\xE1u kh\xF4 luy\u1EC7n \u0111an b\u1ED5 huy\u1EBFt." }, "item.loc_nhung": { "name": "L\u1ED9c Nhung", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "Nhung non tr\xEAn s\u1EEBng Ng\xE2n Gi\xE1c L\u1ED9c, m\u1EC1m nh\u01B0 l\u1EE5a, ph\u1EE7 l\xF4ng b\u1EA1c. \u0110an s\u01B0 qu\xFD nh\u01B0 v\xE0ng, luy\u1EC7n \u0111an b\u1ED5 nguy\xEAn kh\xED v\xE0 k\xE9o d\xE0i th\u1ECD." }, "item.ngoc_tho_mao": { "name": "Ng\u1ECDc Th\u1ED1 Mao", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng th\u1ECF ng\u1ECDc tr\u1EAFng nh\u01B0 tuy\u1EBFt, \u0111\xEAm tr\u0103ng t\u1EF1 ph\xE1t s\xE1ng m\u1EDD. Ph\xF9 s\u01B0 l\xE0m \u0111\u1EA7u b\xFAt; th\u1EE3 may d\u1EC7t v\xE0o ph\xE1p y gi\u1EEF \u1EA5m th\u1EA7n h\u1ED3n." }, "item.cam_ly_lan": { "name": "C\u1EA9m L\xFD L\xE2n", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "V\u1EA3y c\xE1 ch\xE9p g\u1EA5m \xE1nh n\u0103m m\xE0u, nghe n\xF3i con n\xE0o v\u01B0\u1EE3t \u0111\u01B0\u1EE3c Long M\xF4n th\xEC v\u1EA3y h\xF3a v\u1EA3y giao. Luy\u1EC7n b\u1EA3o l\xE0m h\u1ED9 ph\xF9 th\u1EE7y h\u1EC7; \u0111an s\u01B0 l\xE0m \u0111an \u0111\u1ED5i v\u1EADn." }, "item.thanh_dieu_vu": { "name": "Thanh \u0110i\u1EC3u V\u0169", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng v\u0169 xanh bi\u1EBFc c\u1EE7a chim \u0111\u01B0a tin ti\xEAn nh\xE2n, th\u1EA3 trong gi\xF3 th\xEC t\u1EF1 bay v\u1EC1 m\u1ED9t h\u01B0\u1EDBng. Ph\xF9 s\u01B0 l\xE0m Truy\u1EC1n T\xEDn ph\xF9; luy\u1EC7n b\u1EA3o l\xE0m ph\xE1p kh\xED phi h\xE0nh." }, "item.tam_bao_dieu_ti": { "name": "T\u1EA7m B\u1EA3o \u0110i\xEAu T\u1ECB", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "M\u0169i ch\u1ED3n t\u1EA7m b\u1EA3o ph\u01A1i kh\xF4, \u0111\u01B0a g\u1EA7n kim th\u1EA1ch c\xF2n kh\u1EBD gi\u1EADt. Luy\u1EC7n b\u1EA3o l\xE0m la b\xE0n d\xF2 di t\xEDch; ph\xF9 s\u01B0 nghi\u1EC1n v\xE0o m\u1EF1c T\u1EA7m B\u1EA3o ph\xF9." }, "item.thuc_thiet_nha": { "name": "Th\u1EF1c Thi\u1EBFt Nha", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "R\u0103ng c\u1EE7a th\xFA g\u1EB7m s\u1EAFt, m\xF2n b\xF3ng m\xE0 kh\xF4ng m\u1EBB. Luy\u1EC7n b\u1EA3o d\xF9ng l\xE0m \u0111\xE1 m\xE0i ph\xE1p kh\xED, \u0111\xFAc v\xE0o l\u01B0\u1EE1i ki\u1EBFm ch\xE9m s\u1EAFt nh\u01B0 ch\xE9m b\xF9n." }, "item.huy_lan": { "name": "H\u1EE7y L\xE2n", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "V\u1EA3y r\u1EAFn s\xE1u ch\xE2n, n\xF3ng nh\u01B0 ng\xF3i ph\u01A1i tr\u01B0a h\xE8. \u0110\u1EB7t tr\xEAn b\xE0n m\u1ED9t \u0111\xEAm th\xEC ch\xE9n n\u01B0\u1EDBc c\u1EA1nh n\xF3 kh\xF4 \u0111\xE1y." }, "item.bi_hi_giap": { "name": "B\xED H\xED Gi\xE1p", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EA3nh mai c\u1EE7a long t\u1EED \u0111\u1ED9i bia, n\u1EEDa \u0111\xE1 n\u1EEDa s\u1EEBng, m\u1EB7t trong c\xF2n h\u1EB1n ch\u1EEF kh\u1EAFc ng\u01B0\u1EE3c. M\u1ED9t m\u1EA3nh b\u1EB1ng b\xE0n tay n\u1EB7ng nh\u01B0 c\u1ED1i xay." }, "item.trao_phong_lan": { "name": "Tr\xE0o Phong L\xE2n", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "V\u1EA3y long t\u1EED ng\u1ED3i m\xE1i \u0111i\u1EC7n, m\u1ECFng v\xE0 cong nh\u01B0 l\xE1. Th\u1EA3 tay th\xEC n\xF3 kh\xF4ng r\u01A1i xu\u1ED1ng m\xE0 l\u01B0\u1EE3n m\u1ED9t v\xF2ng." }, "item.tat_phuong_vu": { "name": "T\u1EA5t Ph\u01B0\u01A1ng V\u0169", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng \u0111\u1ECF \u0111i\u1EC3m v\u1EB1n xanh c\u1EE7a h\u1EA1c l\u1EEDa m\u1ED9t ch\xE2n. Gi\xF3 th\u1ED5i qua th\xEC \u0111\u1EA7u l\xF4ng b\xE9n l\u1EEDa, gi\xF3 l\u1EB7ng l\u1EA1i t\u1EAFt." }, "item.quy_nguu_bi": { "name": "Qu\u1EF3 Ng\u01B0u B\xEC", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Da tr\xE2u m\u1ED9t ch\xE2n, xanh th\u1EABm nh\u01B0 m\xE2y tr\u01B0\u1EDBc gi\xF4ng. G\xF5 ng\xF3n tay l\xEAn l\xE0 nghe s\u1EA5m r\u1EC1n xa n\u0103m d\u1EB7m." }, "item.toan_nghe_tu": { "name": "Toan Ngh\xEA Tu", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "R\xE2u long t\u1EED ng\u1ED3i l\u01B0 h\u01B0\u01A1ng, m\u1EA3nh nh\u01B0 s\u1EE3i kh\xF3i m\xE0 k\xE9o kh\xF4ng \u0111\u1EE9t. \u0110\u1EA7u r\xE2u l\xFAc n\xE0o c\u0169ng t\u1ECFa m\xF9i tr\u1EA7m." }, "item.phi_liem_vu": { "name": "Phi Li\xEAm V\u0169", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng c\xE1nh th\u1EA7n gi\xF3, trong nh\u01B0 s\u01B0\u01A1ng m\u1ECFng. N\u1EAFm trong tay th\xEC quanh ng\u01B0\u1EDDi n\u1ED5i gi\xF3 xo\xE1y, b\u1EE5i kh\xF4ng b\xE1m v\xE0o \u0111\u01B0\u1EE3c." }, "item.cuu_anh_dam": { "name": "C\u1EEDu Anh \u0110\u1EA3m", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EADt c\u1EE7a hung th\xFA ch\xEDn \u0111\u1EA7u, m\u1ED9t n\u1EEDa l\u1EA1nh nh\u01B0 b\u0103ng, m\u1ED9t n\u1EEDa n\xF3ng nh\u01B0 than. Hai n\u1EEDa kh\xF4ng ch\u1ECBu n\u1EB1m y\xEAn, c\u1EE9 \u0111\u1EA9y nhau trong t\xFAi da." }, "item.cung_ky_si": { "name": "C\xF9ng K\u1EF3 S\xED", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "C\xE1nh h\u1ED5 hung th\xFA, x\u01B0\u01A1ng c\xE1nh \u0111en nh\u01B0 s\u1EAFt ngu\u1ED9i. K\u1EBB c\xF3 t\u1ED9i c\u1EA7m v\xE0o th\u1EA5y n\xF3 \u1EA5m, ng\u01B0\u1EDDi l\u01B0\u01A1ng thi\u1EC7n c\u1EA7m th\xEC bu\u1ED1t t\u1EADn x\u01B0\u01A1ng." }, "item.thao_thiet_van_cot": { "name": "Thao Thi\u1EBFt V\u0103n C\u1ED1t", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "X\u01B0\u01A1ng h\xE0m h\u1EADu du\u1EC7 Thao Thi\u1EBFt, v\xE2n kh\u1EAFc h\u1EC7t hoa v\u0103n tr\xEAn \u0111\u1EC9nh \u0111\u1ED3ng c\u1ED5. \u0110\u1EB7t \u0111an d\u01B0\u1EE3c c\u1EA1nh n\xF3, s\xE1ng ra vi\xEAn \u0111an \u0111\xE3 nh\u1EA1t m\xE0u." }, "item.ly_long_lan": { "name": "Ly Long L\xE2n", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "V\u1EA3y r\u1ED3ng kh\xF4ng s\u1EEBng, xanh lam \xE1nh v\xE0ng \u1EDF m\xE9p. Ng\xE2m v\xE0o ch\u1EADu n\u01B0\u1EDBc th\xEC n\u01B0\u1EDBc t\u1EF1 xoay th\xE0nh xo\xE1y." }, "item.hoa_lan_giac": { "name": "H\u1ECFa L\xE2n Gi\xE1c", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "S\u1EEBng m\u1ED9t nh\xE1nh c\u1EE7a H\u1ECFa L\xE2n, \u0111\u1EA7u s\u1EEBng b\u1ECDc th\u1ECBt m\u1EC1m, kh\xF4ng bao gi\u1EDD d\xF9ng \u0111\u1EC3 h\xFAc. L\u1EEDa trong l\xF5i s\u1EEBng kh\xF4ng \u0111\u1ED1t tay ng\u01B0\u1EDDi kh\xF4ng c\xF3 \xE1c \xFD." }, "item.huyen_vu_van_giap": { "name": "Huy\u1EC1n V\u0169 V\u0103n Gi\xE1p", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EA3nh mai Huy\u1EC1n Quy, v\xE2n tr\xEAn m\u1EB7t x\u1EBFp th\xE0nh h\xECnh sao b\u1EAFc \u0111\u1EA9u. Ng\u01B0\u1EDDi B\u1EAFc Minh tr\xF4ng th\u1EA5y th\xEC \u0111\xF2i bi\u1EBFt lai l\u1ECBch tr\u01B0\u1EDBc khi h\u1ECFi gi\xE1." }, "item.hoa_loan_vu": { "name": "H\u1ECFa Loan V\u0169", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng \u0111u\xF4i H\u1ECFa Loan d\xE0i ba th\u01B0\u1EDBc, \u0111\u1ECF nh\u01B0 than h\u1ED3ng. \u0110\u1ED1t ch\xE1y r\u1ED3i, s\xE1ng h\xF4m sau trong tro l\u1EA1i m\u1ECDc m\u1ED9t s\u1EE3i m\u1EDBi." }, "item.thanh_loan_vu": { "name": "Thanh Loan V\u0169", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng Thanh Loan xanh nh\u01B0 l\xE1 non \u0111\u1EA7u xu\xE2n. C\u1EAFm v\xE0o ch\u1EADu c\xE2y h\xE9o, ba ng\xE0y sau c\xE2y ra l\u1ED9c." }, "item.bang_vu": { "name": "B\u1EB1ng V\u0169", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng c\xE1nh chim b\u1EB1ng, l\u1EA1nh nh\u01B0 b\u0103ng m\u1ECFng. Luy\u1EC7n kh\xED s\u01B0 d\xF9ng l\xE0m c\xE1nh phi ki\u1EBFm, bay nhanh m\xE0 kh\xF4ng k\xEAu; ng\u01B0\u1EDDi B\u1EAFc Minh th\u1EA5y ai b\xE1n th\xEC h\u1ECFi l\xF4ng n\xE0y l\u1EA5y \u1EDF \u0111\xE2u." }, "item.hung_dam": { "name": "H\xF9ng \u0110\u1EA3m", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EADt g\u1EA5u ph\u01A1i kh\xF4, \u0111\u1EAFng ch\xE1t. \u0110an s\u01B0 d\xF9ng l\xE0m d\u1EABn thu\u1ED1c tr\u1ECB th\u01B0\u01A1ng, th\u1EA7y lang Vi\xEAm Qu\u1ED1c thu mua." }, "item.ho_cot": { "name": "H\u1ED5 C\u1ED1t", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "X\u01B0\u01A1ng h\u1ED5 gi\xE0, g\xF5 l\xEAn c\xF2n ng\xE2n. Ng\xE2m r\u01B0\u1EE3u b\u1ED5 kh\xED huy\u1EBFt; quan \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c \u0111\u1ED5i c\xF4ng hu\xE2n." }, "item.hat_doc_nang": { "name": "H\u1EA1t \u0110\u1ED9c Nang", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "T\xFAi \u0111\u1ED9c trong \u0111u\xF4i b\u1ECD c\u1EA1p, c\u1EAFt ra r\u1ED3i v\u1EABn c\xF2n nh\u1ECF gi\u1ECDt. Th\u1EE3 \u0111\u1ED9c t\u1EA9m \xE1m kh\xED, d\u01B0\u1EE3c s\u01B0 pha lo\xE3ng l\xE0m thu\u1ED1c m\xEA. C\u1EA7m sai tay l\xE0 m\u1EA5t tay." }, "item.vien_tam_huyet": { "name": "Vi\xEAn T\xE2m Huy\u1EBFt", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "Huy\u1EBFt tim v\u01B0\u1EE3n \u0111\xE3 nghe kinh tr\u0103m n\u0103m, trong m\xE0 \u1EA5m. \u0110an s\u01B0 d\xF9ng \u1ED5n \u0111\u1ECBnh t\xE2m th\u1EA7n, ch\xF9a Kim C\u01B0\u01A1ng kh\xF4ng mua nh\u01B0ng c\u0169ng kh\xF4ng c\u1EA5m." }, "item.chu_ty": { "name": "Chu Ty", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "T\u01A1 nh\u1EC7n r\u1EEBng, m\u1EA3nh m\xE0 dai. Th\u1EE3 may ph\xE1p y d\u1EC7t \xE1o ch\u1ED1ng \u0111ao, th\u01B0\u01A1ng \u0111o\xE0n mua \u0111\u1EC3 b\u1EC7n d\xE2y." }, "item.xa_dam": { "name": "X\xE0 \u0110\u1EA3m", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EADt r\u1EAFn xanh bi\u1EBFc. Gi\u1EA3i \u0111\u1ED9c, h\u1EA1 h\u1ECFa; mi\u1EBFu th\u1EA7n Vi\xEAm Qu\u1ED1c c\u1EA5m b\xE1n, ch\u1EE3 \u0111en tr\u1EA3 g\u1EA5p \u0111\xF4i." }, "item.bang_trao": { "name": "B\u1EB1ng Tr\u1EA3o", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "M\xF3ng chim b\u1EB1ng non, cong nh\u01B0 l\u01B0\u1EE1i li\u1EC1m, l\u1EA1nh bu\u1ED1t tay. Th\u1EE3 r\xE8n B\u1EAFc Minh m\xE0i l\xE0m m\xF3c leo v\xE1ch b\u0103ng." }, "item.tuyet_bang_cot": { "name": "Tuy\u1EBFt B\u1EB1ng C\u1ED1t", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "X\u01B0\u01A1ng c\xE1nh b\u1EB1ng l\u1EDBn, nh\u1EB9 m\xE0 c\u1EE9ng h\u01A1n th\xE9p, trong l\xF2ng \u0111\u1ECDng s\u01B0\u01A1ng kh\xF4ng tan. Luy\u1EC7n kh\xED s\u01B0 d\xF9ng l\xE0m s\u1ED1ng phi ki\u1EBFm, bay m\u1ED9t h\u01A1i ng\xE0n d\u1EB7m." }, "item.hung_chuong": { "name": "H\xF9ng Ch\u01B0\u1EDFng", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "B\xE0n tay g\u1EA5u y\xEAu, chai d\xE0y nh\u01B0 \u0111\xE1. Nh\xE0 gi\xE0u Vi\xEAm Qu\u1ED1c h\u1EA7m l\xE0m m\xF3n \u0111\xE3i kh\xE1ch, \u0111an s\u01B0 th\xEC l\u1EA5y g\xE2n trong \u0111\xF3." }, "item.huyen_hung_huyet": { "name": "Huy\u1EC1n H\xF9ng Huy\u1EBFt", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "M\xE1u tim g\u1EA5u \u0111en tu ng\xE0n n\u0103m, s\xE1nh nh\u01B0 m\u1EADt, \u0111\u1EC3 l\xE2u kh\xF4ng \u0111\xF4ng. U\u1ED1ng m\u1ED9t gi\u1ECDt th\xEC ba ng\xE0y kh\xF4ng bi\u1EBFt m\u1ECFi." }, "item.ho_cop_nha": { "name": "H\u1ED5 Nha", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "R\u0103ng nanh c\u1ECDp y\xEAu, d\xE0i b\u1EB1ng ng\xF3n tay. Ng\u01B0\u1EDDi Li\u1EC7t H\u1ED5 Hoang \u0111eo l\xE0m b\xF9a; ai \u0111eo nanh h\u1ED5 m\xE0 thua tr\u1EADn th\xEC b\u1ECB c\u01B0\u1EDDi c\u1EA3 \u0111\u1EDDi." }, "item.ho_vuong_tu": { "name": "H\u1ED5 V\u01B0\u01A1ng Tu", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "S\u1EE3i r\xE2u tr\u1EAFng c\u1EE7a h\u1ED5 v\u01B0\u01A1ng, c\u1EE9ng nh\u01B0 d\xE2y cung, ch\u1EA1m v\xE0o nghe s\xE1t kh\xED r\u1EA7n l\xEAn c\xE1nh tay. Luy\u1EC7n kh\xED s\u01B0 b\u1EC7n l\xE0m d\xE2y ph\xE1p kh\xED c\xF4ng ph\u1EA1t." }, "item.hat_giap": { "name": "H\u1EA1t Gi\xE1p", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "V\u1ECF b\u1ECD c\u1EA1p y\xEAu \u0111en b\xF3ng, g\xF5 k\xEAu nh\u01B0 s\u1EAFt. D\xE2n ven sa m\u1EA1c gh\xE9p l\xE0m khi\xEAn, nh\u1EB9 m\xE0 \u0111\u1EE1 \u0111\u01B0\u1EE3c t\xEAn." }, "item.kim_hat_vi_cham": { "name": "Kim H\u1EA1t V\u0129 Ch\xE2m", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "Ng\xF2i \u0111u\xF4i b\u1ECD c\u1EA1p v\xE0ng, s\xE1ng nh\u01B0 \u0111\xFAc b\u1EB1ng kim. Tr\xEDch m\u1ED9t v\u1EBFt v\xE0o \xE1o h\u1ED9 th\xE2n, \xE1o c\u0169ng th\u1EE7ng; H\u1EA1t t\u1ED9c truy k\u1EBB c\u1EA7m n\xF3 t\u1EDBi c\xF9ng." }, "item.vien_mao": { "name": "Vi\xEAn Mao", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng v\u01B0\u1EE3n x\xE1m d\xE0i, dai nh\u01B0 s\u1EE3i gai. Th\u1EE3 l\xE0m b\xFAt \u1EDF Vi\xEAm Qu\u1ED1c b\xF3 l\xE0m b\xFAt v\u1EBD ph\xF9, n\xE9t kh\xF4ng b\u1ECB x\u01A1." }, "item.linh_vien_xa_loi": { "name": "Linh Vi\xEAn X\xE1 L\u1EE3i", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "Vi\xEAn ng\u1ECDc tr\u1EAFng \u0111\u1ECDng trong x\u01B0\u01A1ng v\u01B0\u1EE3n \u0111\xE3 nghe kinh tr\u0103m n\u0103m, c\u1EA7m l\xEAn t\xE2m t\u1EF1 l\u1EB7ng. Ch\xF9a Kim C\u01B0\u01A1ng cho ng\u01B0\u1EDDi \u0111i chu\u1ED9c l\u1EA1i, kh\xF4ng h\u1ECFi gi\xE1." }, "item.xa_thue": { "name": "X\xE0 Thu\u1EBF", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "X\xE1c r\u1EAFn l\u1ED9t c\xF2n nguy\xEAn h\xECnh, m\u1ECFng nh\u01B0 gi\u1EA5y d\u1EA7u. Th\u1EA7y lang Vi\xEAm Qu\u1ED1c s\u1EAFc u\u1ED1ng tr\u1ECB kinh phong; ng\u01B0\u1EDDi trong l\xE0ng th\u1EA5y th\xEC v\xE1i tr\u01B0\u1EDBc khi nh\u1EB7t." }, "item.linh_xa_chau": { "name": "Linh X\xE0 Ch\xE2u", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "Vi\xEAn ch\xE2u xanh trong \u0111\u1EA7u r\u1EAFn y\xEAu \u0111\u01B0\u1EE3c h\u01B0\u01A1ng kh\xF3i nu\xF4i l\xE2u n\u0103m, ng\u1EEDi c\xF2n m\xF9i tr\u1EA7m. Mi\u1EBFu l\xE0ng n\xE0o m\u1EA5t n\xF3 th\xEC th\u1EA7n l\xE0ng c\u0169ng kh\xF4ng c\xF2n." }, "item.ung_vu": { "name": "\u01AFng V\u0169", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng c\xE1nh chim \u01B0ng v\xE1ch n\xFAi, c\u1EE9ng v\xE0 th\u1EB3ng. Th\u1EE3 t\xEAn l\u1EA5y l\xE0m \u0111u\xF4i t\xEAn, b\u1EAFn \u0111i kh\xF4ng l\u1EC7ch gi\xF3." }, "item.ung_nhan": { "name": "\u01AFng Nh\xE3n", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EAFt chim \u01B0ng y\xEAu, v\xE0ng nh\u01B0 h\u1ED5 ph\xE1ch. \u0110an s\u01B0 luy\u1EC7n thu\u1ED1c s\xE1ng m\u1EAFt; th\xE1m t\u1EED B\u1EAFc Minh tr\u1EA3 gi\xE1 cao \u0111\u1EC3 bi\u1EBFt n\xF3 t\u1EEBng nh\xECn th\u1EA5y g\xEC." }, "item.thu_tu": { "name": "Th\u1EED Tu", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "R\xE2u chu\u1ED9t y\xEAu \u0111\xE0o ph\u1EBF t\xEDch, ch\u1EA1m \u0111\u1EA5t l\xE0 run khi d\u01B0\u1EDBi \u0111\xF3 c\xF3 v\u1EADt c\u0169. K\u1EBB tr\u1ED9m m\u1ED9 bu\u1ED9c v\xE0o que l\xE0m c\u1EA7n d\xF2." }, "item.toan_dia_trao": { "name": "To\u1EA3n \u0110\u1ECBa Tr\u1EA3o", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "M\xF3ng vu\u1ED1t chu\u1ED9t y\xEAu, kho\xE9t \u0111\xE1 nh\u01B0 kho\xE9t \u0111\u1EA5t b\xF9n. Th\u1EE3 tr\u1EADn d\xF9ng kh\u1EAFc tr\u1EADn v\u0103n l\xEAn \u0111\xE1 c\u1EE9ng." }, "item.huyen_chu_ty": { "name": "Huy\u1EC1n Chu Ty", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "T\u01A1 nh\u1EC7n \u0111en c\u1EE7a chu y\xEAu gi\xE0, \u0111ao ch\xE9m kh\xF4ng \u0111\u1EE9t, l\u1EEDa th\u01B0\u1EDDng \u0111\u1ED1t kh\xF4ng ch\xE1y. M\u1ED9t cu\u1ED9n \u0111\u1EE7 d\u1EC7t n\u1EEDa t\u1EA5m ph\xE1p y." }, "item.phu_dieu_than_vu": { "name": "Ph\xF9 Di\xEAu Th\u1EA7n V\u0169", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng c\xE1nh ch\u1EE7 c\u1EE7a B\u1EB1ng V\u01B0\u01A1ng, d\xE0i b\u1EB1ng th\xE2n ng\u01B0\u1EDDi, kh\xF4ng c\xF3 gi\xF3 v\u1EABn t\u1EF1 l\u01A1 l\u1EEDng. C\u1EA7m n\xF3 \u0111\u1EE9ng tr\xEAn v\xE1ch n\xFAi, gi\xF3 t\u1EF1 v\xF2ng quanh ng\u01B0\u1EDDi." }, "item.thiet_the_hung_tam": { "name": "Thi\u1EBFt Th\u1EC7 H\xF9ng T\xE2m", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "Qu\u1EA3 tim c\u1EE7a H\xF9ng V\u01B0\u01A1ng \u0111\xE3 c\u1EE9ng nh\u01B0 s\u1EAFt, m\u1EB7t ngo\xE0i h\u1EB1n v\u1EBFt th\u1EC7 \u1EA5n Tuy\u1EBFt B\u1EB1ng. G\xF5 v\xE0o nghe ti\u1EBFng tr\u1EA7m nh\u01B0 tr\u1ED1ng tr\u1EADn, m\xE3i kh\xF4ng t\u1EAFt." }, "item.bach_ho_huyet_phach": { "name": "B\u1EA1ch H\u1ED5 Huy\u1EBFt Ph\xE1ch", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "Gi\u1ECDt B\u1EA1ch H\u1ED5 huy\u1EBFt trong m\u1EA1ch h\u1ED5 v\u01B0\u01A1ng \u0111\u1ECDng th\xE0nh tinh th\u1EC3 tr\u1EAFng, l\u1EA1nh v\xE0 s\u1EAFc. L\u01B0\u1EE1i \u0111ao t\xF4i qua n\xF3, ch\xE9m ra \u0111\u1EC3 l\u1EA1i v\u1EC7t tr\u1EAFng m\xE3i m\u1EDBi tan." }, "item.tu_sa_doc_tuy": { "name": "T\u1EED Sa \u0110\u1ED9c T\u1EE7y", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "T\u1EE7y t\xEDm trong \u1ED1ng \u0111\u1ED9c c\u1EE7a H\u1EA1t V\u01B0\u01A1ng, s\xE1nh nh\u01B0 m\u1EADt, ng\u1ECDt m\xF9i hoa. M\u1ED9t gi\u1ECDt r\u01A1i xu\u1ED1ng c\xE1t, c\xE1t quanh \u0111\xF3 t\xEDm \u0111i m\u1ED9t v\xF2ng b\u1EB1ng c\xE1i nia." }, "item.thinh_phap_vien_tam": { "name": "Th\xEDnh Ph\xE1p Vi\xEAn T\xE2m", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "Vi\xEAn ng\u1ECDc v\xE0ng nh\u1EA1t \u0111\u1ECDng \u1EDF ch\u1ED7 tim v\u01B0\u1EE3n v\u01B0\u01A1ng sau ba tr\u0103m n\u0103m nghe kinh. \xC1p tai v\xE0o nghe nh\u01B0 c\xF3 ti\u1EBFng m\xF5, c\u1EA7m l\xE2u t\xE2m t\u1EF1 l\u1EB7ng." }, "item.kim_than_xa_thue": { "name": "Kim Th\xE2n X\xE0 Thu\u1EBF", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "B\u1ED9 x\xE1c l\u1ED9t c\u1EE7a X\xE0 V\u01B0\u01A1ng v\xE0ng \xF3ng nh\u01B0 d\xE1t kim, c\xF2n v\u01B0\u01A1ng m\xF9i tr\u1EA7m c\u1EE7a tr\u0103m ng\xF4i mi\u1EBFu. Mi\u1EBFu l\xE0ng n\xE0o c\xF3 \u0111\u01B0\u1EE3c m\u1ED9t m\u1EA3nh \u0111\u1EC1u \u0111em th\u1EDD." }, "item.ung_ton_cuong_vu": { "name": "\u01AFng T\xF4n C\u01B0\u01A1ng V\u0169", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng c\xE1nh \u01B0ng t\xF4n c\u1EE9ng nh\u01B0 th\xE9p, m\xE9p s\u1EAFc c\u1EAFt \u0111\u1EE9t s\u1EE3i t\xF3c th\u1EA3 l\xEAn. Th\u1EE3 ch\u1EBF t\xEAn \u1EDF B\u1EAFc Minh tr\u1EA3 gi\xE1 cao \u0111\u1EC3 l\xE0m \u0111u\xF4i t\xEAn." }, "item.thon_kim_thu_nang": { "name": "Th\xF4n Kim Th\u1EED Nang", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "T\xFAi m\xE1 c\u1EE7a chu\u1ED9t gi\xE0, c\u0103ng ra ch\u1EE9a c\u1EA3 m\u1ED9t h\xF2m v\xE0ng m\xE0 v\u1EABn nh\u1EB9 nh\u01B0 kh\xF4ng. Luy\u1EC7n kh\xED s\u01B0 ch\u1EE3 \u0111en mua v\u1EC1 l\xE0m l\xF3t t\xFAi tr\u1EEF v\u1EADt." }, "item.van_ti_chu_nang": { "name": "V\u1EA1n Ti Chu Nang", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Tuy\u1EBFn t\u01A1 c\u1EE7a nh\u1EC7n m\u1EB9, b\xF3p nh\u1EB9 ra m\u1ED9t s\u1EE3i b\u1EA1c d\xE0i m\xE3i kh\xF4ng d\u1EE9t. Th\u1EE3 d\u1EC7t ph\xE1p y m\u1ED9t \u0111\u1EDDi may ra mua \u0111\u01B0\u1EE3c m\u1ED9t c\xE1i." }, "item.hoa_nha_vu": { "name": "H\u1ECFa Nha V\u0169", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng qu\u1EA1 \u0111en b\xF3ng, ch\xF3p l\xF4ng \u0111\u1ECF nh\u01B0 than ch\u01B0a t\u1EAFt. Th\u1EA3 v\xE0o b\u1EBFp ngu\u1ED9i, b\u1EBFp t\u1EF1 b\xE9n l\u1EEDa. Ph\xF9 s\u01B0 nghi\u1EC1n l\xE0m m\u1EF1c H\u1ECFa ph\xF9." }, "item.tam_tuc_nha_trao": { "name": "Tam T\xFAc Nha Tr\u1EA3o", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "M\xF3ng qu\u1EA1 ba ch\xE2n v\xE0ng s\u1EADm, c\u1EA7m l\xE2u n\xF3ng r\xE1t l\xF2ng b\xE0n tay. Luy\u1EC7n b\u1EA3o \u0111\xFAc v\xE0o m\xF3c c\xE2u, l\u01B0\u1EE1i \u0111ao \u0111\u1EC3 l\u01B0\u1EE1i mang h\u1ECFa \u0111\u1ED9c." }, "item.kim_o_vu": { "name": "Kim \xD4 V\u0169", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng v\u0169 v\xE0ng r\u1EF1c, \u0111\u1EB7t trong h\u1ED9p ng\u1ECDc m\xE0 n\u1EAFp h\u1ED9p v\u1EABn h\u1EAFt ra \xE1nh s\xE1ng nh\u01B0 b\xECnh minh. L\xE0m c\u1ED1t ph\xE1p b\u1EA3o h\u1ECFa h\u1EC7 h\u1EA1ng nh\u1EA5t." }, "item.thanh_nguu_giac": { "name": "Thanh Ng\u01B0u Gi\xE1c", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "S\u1EEBng ngh\xE9 xanh m\xE0u \u0111\xE1 thanh, g\xF5 v\xE0o nghe nh\u01B0 ti\u1EBFng kh\xE1nh. \u0110\u1EA1o s\u0129 l\xE0m c\xE1n ph\u1EA5t tr\u1EA7n; luy\u1EC7n b\u1EA3o l\xE0m l\xF5i ph\xE1p kh\xED th\u1ED5 h\u1EC7." }, "item.thanh_nguu_hoang": { "name": "Thanh Ng\u01B0u Ho\xE0ng", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "Ng\u01B0u ho\xE0ng xanh nh\u1EA1t k\u1EBFt trong m\u1EADt tr\xE2u xanh tr\u0103m n\u0103m, th\u01A1m m\xF9i c\u1ECF n\xFAi. \u0110an s\u01B0 m\xE0i v\xE0o \u0111an gi\u1EA3i \u0111\u1ED9c, an th\u1EA7n." }, "item.mac_mieu_tu": { "name": "M\u1EB7c Mi\xEAu Tu", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "S\u1EE3i r\xE2u m\xE8o \u0111en c\u1EE9ng nh\u01B0 kim, \u0111\xEAm t\u1ED1i h\u01A1i rung khi \xE2m kh\xED t\u1EDBi g\u1EA7n. Ph\xF9 s\u01B0 c\u1EAFm l\xE0m \u0111\u1EA7u b\xFAt v\u1EBD ph\xF9 tr\u1EEB t\xE0." }, "item.huyen_mieu_nhan": { "name": "Huy\u1EC1n Mi\xEAu Nh\xE3n", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EAFt m\xE8o h\xF3a \u0111\xE1, trong nh\u01B0 ng\u1ECDc b\xEDch, gi\u1EEFa c\xF3 m\u1ED9t v\u1EA1ch s\xE1ng \u0111\u1ED5i theo gi\u1EDD. Luy\u1EC7n b\u1EA3o l\xE0m g\u01B0\u01A1ng soi h\u1ED3n, th\u1EA5y \u0111\u01B0\u1EE3c qu\u1EF7 \u1EA9n h\xECnh." }, "item.thien_chu_mau_ty": { "name": "Thi\xEAn Chu M\u1EABu Ty", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "T\u01A1 c\u1EE7a nh\u1EC7n m\u1EB9, ch\u1EC9 nh\u1EA3 m\u1ED9t l\u1EA7n \u0111\u1EC3 b\u1ECDc tr\u1EE9ng. S\u1EE3i m\u1EA3nh h\u01A1n t\xF3c m\xE0 treo \u0111\u01B0\u1EE3c con tr\xE2u, d\u01B0\u1EDBi tr\u0103ng \xE1nh l\xEAn m\xE0u b\u1EA1c xanh." }, "item.ung_vuong_kim_dong": { "name": "\u01AFng V\u01B0\u01A1ng Kim \u0110\u1ED3ng", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EAFt \u01B0ng v\u01B0\u01A1ng kh\xF4 l\u1EA1i th\xE0nh h\u1EA1t ch\xE2u v\xE0ng, trong l\xF2ng v\u1EABn c\xF2n m\u1ED9t \u0111\u1ED1m s\xE1ng nh\u01B0 con ng\u01B0\u01A1i. Ph\u01B0\u01A1ng s\u0129 kh\u1EA3m v\xE0o ph\xE1p kh\xED \u0111\u1EC3 nh\xECn xuy\xEAn s\u01B0\u01A1ng m\xF9." }, "item.lang_vuong_cot": { "name": "Lang V\u01B0\u01A1ng C\u1ED1t", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "X\u01B0\u01A1ng s\u1ED1ng s\xF3i v\u01B0\u01A1ng, m\u1ED7i \u0111\u1ED1t kh\u1EAFc s\u1EB5n v\xE2n nh\u01B0 ch\u1EEF c\u1ED5. \u0110\xEAm tr\u0103ng, c\u1EA3 kh\xFAc x\u01B0\u01A1ng ph\xE1t \xE1nh xanh l\u1EA1nh v\xE0 rung l\xEAn nh\u01B0 mu\u1ED1n h\xFA." }, "item.thien_ho_tam": { "name": "Thi\xEAn H\u1ED3 T\xE2m", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "Tr\xE1i tim h\u1ED3 ly tu ng\xE0n n\u0103m \u0111\xF4ng l\u1EA1i th\xE0nh kh\u1ED1i ng\u1ECDc h\u1ED3ng, v\u1EABn \u1EA5m nh\u01B0 ng\u01B0\u1EDDi s\u1ED1ng. Nh\xECn l\xE2u v\xE0o \xE1nh h\u1ED3ng trong l\xF2ng ng\u1ECDc th\xEC hoa m\u1EAFt." }, "item.giao_long_giac": { "name": "Giao Long Gi\xE1c", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "S\u1EEBng giao m\u1ECDc khi \u0111\xE3 s\u1EAFp h\xF3a r\u1ED3ng, xo\u1EAFn ba v\xF2ng. Ng\xE2m xu\u1ED1ng n\u01B0\u1EDBc, c\u1EA3 ch\u1EADu \u0111\xF3ng b\u0103ng v\xE0 t\u1ECFa \xE1nh lam nh\u1EA1t." }, "item.bang_vuong_linh_vu": { "name": "B\u1EB1ng V\u01B0\u01A1ng Linh V\u0169", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng v\u0169 d\xE0i h\u01A1n ng\u01B0\u1EDDi c\u1EE7a Tuy\u1EBFt B\u1EB1ng v\u01B0\u01A1ng, s\u1ED1ng l\xF4ng tr\u1EAFng nh\u01B0 b\u0103ng. Th\u1EA3 ra kh\xF4ng r\u01A1i, c\u1EE9 l\u01A1 l\u1EEDng t\u1ECFa s\u01B0\u01A1ng l\u1EA1nh." }, "item.hat_vuong_doc_thich": { "name": "H\u1EA1t V\u01B0\u01A1ng \u0110\u1ED9c Th\xEDch", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "Gai \u0111\u1ED9c cu\u1ED1i \u0111u\xF4i h\u1EA1t v\u01B0\u01A1ng, \u0111en b\xF3ng, \u0111\u1EA7u gai \u1EE9a m\u1ED9t gi\u1ECDt \u0111\u1ED9c xanh kh\xF4ng bao gi\u1EDD kh\xF4. \u0110\u1EB7t l\xEAn b\xE0n g\u1ED7, m\u1EB7t g\u1ED7 m\u1EE5c ngay ch\u1ED7 \u1EA5y." }, "item.huyen_quy_long_giap": { "name": "Huy\u1EC1n Quy Long Gi\xE1p", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EA3nh mai r\xF9a gi\xE0 mang ch\xFAt huy\u1EBFt m\u1EA1ch Huy\u1EC1n V\u0169, v\xE2n n\u1EE9t nh\u01B0 s\xF3ng bi\u1EC3n. G\xF5 v\xE0o nghe ti\u1EBFng chu\xF4ng, \xE1nh l\u1EE5c th\u1EABm ch\u1EA1y theo \u0111\u01B0\u1EDDng v\xE2n." }, "item.bach_ho_sat_cot": { "name": "B\u1EA1ch H\u1ED5 S\xE1t C\u1ED1t", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "X\u01B0\u01A1ng vai h\u1ED5 t\xF4n, tr\u1EAFng nh\u01B0 ng\xE0, s\xE1t kh\xED ng\u1EA5m v\xE0o t\u1EDBi t\u1EE7y. C\u1EA7m l\xEAn th\xEC l\xF4ng tay d\u1EF1ng \u0111\u1EE9ng, quanh x\u01B0\u01A1ng l\xF3e \xE1nh tr\u1EAFng s\u1EAFc nh\u01B0 l\u01B0\u1EE1i \u0111ao." }, "item.dai_thanh_kim_cot": { "name": "\u0110\u1EA1i Th\xE1nh Kim C\u1ED1t", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "X\u01B0\u01A1ng tay vi\xEAn l\xE3o t\u1ED5, \u0111\xE3 h\xF3a v\xE0ng nh\u01B0 \u0111\u1ED3ng \u0111\xFAc. G\xF5 v\xE0o nghe ti\u1EBFng kim lo\u1EA1i, \xE1nh v\xE0ng ch\u1EA3y theo \u0111\u01B0\u1EDDng g\xE2n c\u0169." }, "item.xa_quan_nghich_lan": { "name": "X\xE0 Qu\xE2n Ngh\u1ECBch L\xE2n", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Chi\u1EBFc v\u1EA3y m\u1ECDc ng\u01B0\u1EE3c d\u01B0\u1EDBi c\u1ED5 x\xE0 qu\xE2n, ch\u1EA1m v\xE0o l\xE0 n\xF3 li\u1EC1u m\u1EA1ng. V\u1EA3y \u0111en \xE1nh xanh r\xEAu, m\xE9p s\u1EAFc nh\u01B0 dao c\u1EA1o." }, "item.hoa_long_chau": { "name": "H\xF3a Long Ch\xE2u", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "N\u1ED9i ch\xE2u c\u1EE7a giao gi\xE0 s\u1EAFp h\xF3a r\u1ED3ng m\xE0 ch\u01B0a h\xF3a \u0111\u01B0\u1EE3c. Vi\xEAn ch\xE2u to b\u1EB1ng n\u1EAFm tay, b\xEAn trong m\u1ED9t b\xF3ng r\u1ED3ng xanh lam b\u01A1i quanh." }, "item.thai_nhac_hung_dom": { "name": "Th\xE1i Nh\u1EA1c H\xF9ng \u0110\u1EDFm", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EADt g\u1EA5u n\xFAi \u0111\xE3 s\u1ED1ng ngh\xECn n\u0103m, n\u1EB7ng nh\u01B0 \u0111\xE1, v\u1ECF \xE1nh n\xE2u v\xE0ng. R\u1EA1ch m\u1ED9t \u0111\u01B0\u1EDDng, kh\xED \u0111\u1EA5t n\u1ED3ng nh\u01B0 m\xF9i n\xFAi sau m\u01B0a b\u1ED1c l\xEAn." }, "item.con_bang_tan_vu": { "name": "C\xF4n B\u1EB1ng T\xE0n V\u0169", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng c\xE1nh g\xE3y t\u1EEB tr\u1EADn \u0110o\u1EA1n Thi\xEAn, T\xE0n B\u1EB1ng L\xE3o T\u1ED5 gi\u1EEF b\xEAn m\xECnh m\u1EA5y ngh\xECn n\u0103m. S\u01B0\u01A1ng b\u0103ng quanh n\xF3 kh\xF4ng tan, gi\xF3 quanh n\xF3 kh\xF4ng l\u1EB7ng." }, "item.thien_lang_hon_tinh": { "name": "Thi\xEAn Lang H\u1ED3n Tinh", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "H\u1ED3n s\xF3i gi\xE0 k\u1EBFt th\xE0nh vi\xEAn tinh th\u1EC3 xanh tr\u1EAFng nh\u01B0 sao Thi\xEAn Lang. \u0110\xEAm kh\xF4ng tr\u0103ng, n\xF3 t\u1EF1 s\xE1ng thay tr\u0103ng." }, "item.kim_thiem_bao_chau": { "name": "Kim Thi\u1EC1m B\u1EA3o Ch\xE2u", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t ch\xE2u c\xF3c y\xEAu ng\u1EADm d\u01B0\u1EDBi l\u01B0\u1EE1i su\u1ED1t tr\u0103m n\u0103m, v\xE0ng \u0111\u1EE5c nh\u01B0 s\xE1p ong. \u0110\u1EB7t v\xE0o ch\u1EADu n\u01B0\u1EDBc, m\u1EB7t n\u01B0\u1EDBc l\u0103n t\u0103n \xE1nh l\u1EE5c r\u1ED3i \u0111\u1EB7c l\u1EA1i nh\u01B0 keo." }, "item.giao_nhan_le": { "name": "Giao Nh\xE2n L\u1EC7", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "N\u01B0\u1EDBc m\u1EAFt ng\u01B0\u1EDDi c\xE1 r\u01A1i xu\u1ED1ng \u0111\xE1 th\xEC \u0111\xF4ng th\xE0nh ng\u1ECDc, ch\u1EC9 khi kh\xF3c th\u1EADt. H\u1EA1t ng\u1ECDc lam trong, \xE1p v\xE0o tai nghe ti\u1EBFng s\xF3ng r\u1EA5t xa." }, "item.thuc_kim_thu_xi": { "name": "Th\u1EF1c Kim Th\u1EED X\u1EC9", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "R\u0103ng c\u1EEDa con chu\u1ED9t y\xEAu g\u1EB7m v\xE0ng \u0111\xE1 m\xE0 s\u1ED1ng, v\xE0ng \xF3ng nh\u01B0 \u0111\u1ED3ng thau. \u0110\u1EA7u r\u0103ng \xE1nh l\xEAn m\u1ED9t v\u1EC7t tr\u1EAFng s\u1EAFc, c\u1EA1 v\xE0o s\u1EAFt l\xE0 s\u1EAFt m\xF2n." }, "item.tien_hac_tho_cot": { "name": "Ti\xEAn H\u1EA1c Th\u1ECD C\u1ED1t", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "X\u01B0\u01A1ng c\xE1nh h\u1EA1c ti\xEAn \u0111\xE3 t\u1ECDa h\xF3a, r\u1ED7ng m\xE0 nh\u1EB9 nh\u01B0 \u1ED1ng tr\xFAc. Th\u1ED5i qua nghe ti\u1EBFng h\u1EA1c k\xEAu, quanh x\u01B0\u01A1ng c\xF3 l\xE0n gi\xF3 xanh nh\u1EA1t kh\xF4ng tan." }, "item.liet_ho_kim_trao": { "name": "Li\u1EC7t H\u1ED5 Kim Tr\u1EA3o", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "Vu\u1ED1t tr\u01B0\u1EDBc c\u1EE7a h\u1ED5 t\u01B0\u1EDBng, m\xF3c cong nh\u01B0 l\u01B0\u1EE1i li\u1EC1m, \xE1nh tr\u1EAFng kim lo\u1EA1i. \u0110\u1EC3 tr\xEAn b\xE0n qua \u0111\xEAm, s\xE1ng ra m\u1EB7t b\xE0n c\xF3 ba v\u1EBFt c\xE0o t\u1EF1 hi\u1EC7n." }, "item.kim_boi_hung_bi": { "name": "Kim B\u1ED1i H\xF9ng B\xEC", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "T\u1EA5m da l\u01B0ng g\u1EA5u y\xEAu, l\xF4ng v\xE0ng c\u1EE9ng nh\u01B0 kim \u0111\u1ED3ng. G\xF5 dao v\xE0o nghe keng m\u1ED9t ti\u1EBFng, \xE1nh v\xE0ng \u0111\u1EA5t ch\u1EA1y d\u1ECDc s\u1ED1ng l\u01B0ng r\u1ED3i l\u1EB7n." }, "item.thong_ty_vien_cot": { "name": "Th\xF4ng T\xFD Vi\xEAn C\u1ED1t", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "X\u01B0\u01A1ng tay v\u01B0\u1EE3n th\xF4ng t\xFD, d\xE0i g\u1EA7n b\u1EB1ng ng\u01B0\u1EDDi, hai \u0111\u1EA7u th\xF4ng nhau nh\u01B0 m\u1ED9t \u1ED1ng. C\u1EA7m m\u1ED9t \u0111\u1EA7u vung l\xEAn, \u0111\u1EA7u kia s\xE1ng v\xE0ng nh\u01B0 \u0111\u01B0\u1EE3c r\xF3t \u0111\u1ED3ng n\xF3ng." }, "item.kim_lan_mang_dom": { "name": "Kim L\xE2n M\xE3ng \u0110\u1EDFm", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EADt m\xE3ng x\xE0 v\u1EA3y v\xE0ng, xanh th\u1EABm nh\u01B0 ng\u1ECDc b\xEDch ng\xE2m r\u01B0\u1EE3u. Trong l\xF2ng m\u1EADt m\u1ED9t \u0111\u1ED1m l\u1EE5c s\xE1ng l\u1EEFng l\u1EDD tr\xF4i, ng\u1EEDi g\u1EA7n l\xE0 cho\xE1ng." }, "item.huyet_nguyet_lang_nha": { "name": "Huy\u1EBFt Nguy\u1EC7t Lang Nha", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "Nanh s\xF3i \u0111\u1EA7u \u0111\xE0n l\u1EDBn l\xEAn d\u01B0\u1EDBi tr\u0103ng m\xE1u, \u0111\u1ECF th\u1EABm t\u1EEB ch\xE2n t\u1EDBi m\u0169i. \u0110\xEAm tr\u0103ng tr\xF2n nanh t\u1EF1 \xE1nh l\xEAn s\u1EAFc b\u1EA1c l\u1EA1nh nh\u01B0 l\u01B0\u1EE1i \u0111ao." }, "item.cuu_tiet_hat_vi": { "name": "C\u1EEDu Ti\u1EBFt H\u1EA1t V\u0129", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "C\u1EA3 kh\xFAc \u0111u\xF4i ch\xEDn \u0111\u1ED1t c\u1EE7a h\u1EA1t y\xEAu Nguy\xEAn Anh, \u0111\u1ED1t n\xE0o c\u0169ng c\xF2n co du\u1ED7i. \u0110\u1ED9c xanh l\u1EE5c ch\u1EA3y ng\u1EA7m trong v\u1ECF, \u0111\xEAm t\u1ED1i nh\xECn th\u1EA5y nh\u01B0 s\xF4ng l\xE2n tinh." }, "item.bang_vuong_han_tuy": { "name": "B\u1EB1ng V\u01B0\u01A1ng H\xE0n T\u1EE7y", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "T\u1EE7y trong x\u01B0\u01A1ng c\xE1nh chim b\u1EB1ng gi\xE0, \u0111\xE3 \u0111\xF4ng th\xE0nh \u1ED1ng b\u0103ng xanh bi\u1EBFc. M\u1EDF n\xFAt ra, s\u01B0\u01A1ng l\u1EA1nh tr\xE0o nh\u01B0 su\u1ED1i, c\u1ECF quanh ch\xE2n b\u1EA1c tr\u1EAFng." }, "item.cuu_vi_ho_hon": { "name": "C\u1EEDu V\u0129 H\u1ED3 H\u1ED3n", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "M\u1ED9t s\u1EE3i h\u1ED3n h\u1ED3 ly ch\xEDn \u0111u\xF4i b\u1ECB nh\u1ED1t trong h\u1ED5 ph\xE1ch \u0111\u1ECF. Ng\u1ECDn l\u1EEDa h\u1ED3ng b\xEAn trong u\u1ED1n th\xE0nh ch\xEDn c\xE1i \u0111u\xF4i, nh\xECn l\xE2u th\u1EA5y n\xF3 nh\xECn l\u1EA1i." }, "item.oan_hon_ty": { "name": "O\xE1n H\u1ED3n Ty", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "S\u1EE3i kh\xF3i x\xE1m c\xF4 h\u1ED3n \u0111\u1EC3 l\u1EA1i, qu\u1EA5n quanh ng\xF3n tay th\xEC l\u1EA1nh bu\u1ED1t. Th\u1EA7y ph\xF9 tr\u1ED9n v\xE0o m\u1EF1c v\u1EBD b\xF9a d\u1EABn h\u1ED3n, ph\xF9 s\u01B0 tr\u1EEB t\xE0 l\u1EA1i mua v\u1EC1 \u0111\u1EC3 \u0111\u1ED1t th\u1EED b\xF9a." }, "item.thi_du": { "name": "Thi Du", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "D\u1EA7u v\xE0ng \u0111\u1EE5c \u1EE9a ra t\u1EEB x\xE1c \u0111i \u0111\xEAm, m\xF9i h\xF4i b\xE1m tay ba ng\xE0y kh\xF4ng h\u1EBFt. Ma tu th\u1EAFp \u0111\xE8n d\u1EABn thi, th\u1EE3 \u0111\u1ED9c n\u1EA5u chung v\u1EDBi c\u1ECF \u0111\u1ED9c l\xE0m thu\u1ED1c m\xEA." }, "item.am_thuy_chau": { "name": "\xC2m Th\u1EE7y Ch\xE2u", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t n\u01B0\u1EDBc \u0111\u1ECDng l\u1EA1i n\u01A1i h\u1ED3n ch\u1EBFt \u0111u\u1ED1i tan \u0111i, tr\xF2n nh\u01B0 ng\u1ECDc m\xE0 kh\xF4ng bao gi\u1EDD kh\xF4. C\u1EA7m l\xE2u th\u1EA5y ch\xE2n n\u1EB7ng nh\u01B0 c\xF3 ai n\xEDu. Ph\xF9 s\u01B0 d\xF9ng ch\u1EBF ph\xF9 tr\xF3i, \u0111an s\u01B0 d\xF9ng l\xE0m d\u1EABn thu\u1ED1c h\xE0n." }, "item.bach_cot_phan": { "name": "B\u1EA1ch C\u1ED1t Ph\u1EA5n", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "B\u1ED9t x\u01B0\u01A1ng kh\xF4 l\xE2u nghi\u1EC1n ra, tr\u1EAFng m\u1ECBn m\xE0 n\u1EB7ng tay. R\u1EAFc l\xEAn x\xE1c th\xEC x\xE1c g\u01B0\u1EE3ng d\u1EADy n\u1EEDa canh gi\u1EDD; ma tu luy\u1EC7n kh\xF4i l\u1ED7i x\u01B0\u01A1ng kh\xF4ng th\u1EC3 thi\u1EBFu." }, "item.cuong_thi_nha": { "name": "C\u01B0\u01A1ng Thi Nha", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "R\u0103ng nanh c\u01B0\u01A1ng thi, \u0111en b\xF3ng nh\u01B0 s\u1EEBng, ch\xE2n r\u0103ng c\xF2n r\u1EC9 thi \u0111\u1ED9c. Luy\u1EC7n kh\xED s\u01B0 ma \u0111\u1EA1o m\xE0i l\xE0m m\u0169i \u0111inh t\u1EA9m \u0111\u1ED9c; qu\xE1n thu\u1ED1c Vi\xEAm Qu\u1ED1c thu v\u1EC1 r\u1ED3i \u0111em ch\xF4n d\u01B0\u1EDBi mi\u1EBFu." }, "item.thi_hach": { "name": "Thi H\u1EA1ch", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "C\u1EE5c thi kh\xED \u0111\xF4ng c\u1EE9ng trong l\u1ED3ng ng\u1EF1c c\u01B0\u01A1ng thi, to b\u1EB1ng qu\u1EA3 tr\u1EE9ng, g\xF5 k\xEAu nh\u01B0 \u0111\xE1. \u0110\xE2y l\xE0 l\xF5i c\u1EE7a thi kh\xF4i, ma tu \u0111\u1EB7t n\xF3 v\xE0o x\xE1c l\xE0 x\xE1c bi\u1EBFt nghe l\u1EC7nh." }, "item.am_binh_lenh": { "name": "\xC2m Binh L\u1EC7nh", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": 'Th\u1EBB \u0111\u1ED3ng g\u1EC9 xanh c\u1EE7a \u0111\u1EA1o qu\xE2n ch\u1EBFt tr\u1EADn, m\u1EB7t kh\u1EAFc ch\u1EEF "l\u1EC7nh" \u0111\xE3 m\xF2n. \u0110\xEAm \u0111\u1EB7t xu\u1ED1ng \u0111\u1EA5t c\xF2n nghe ti\u1EBFng gi\xE1p s\u1EAFt b\u01B0\u1EDBc \u0111\u1EC1u. Ph\xF9 s\u01B0 l\u1EA5y l\xE0m c\u1ED1t ph\xF9 g\u1ECDi \xE2m binh.' }, "item.thi_mao": { "name": "Thi Mao", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng tr\u1EAFng m\u1ECDc tr\xEAn da Mao C\u01B0\u01A1ng, c\u1EE9ng nh\u01B0 kim, \u0111\u1ED1t kh\xF4ng ch\xE1y. Ma tu b\u1EC7n l\xE0m d\xE2y tr\xF3i h\u1ED3n; luy\u1EC7n kh\xED s\u01B0 d\u1EC7t v\xE0o n\u1ED9i gi\xE1p, \u0111ao th\u01B0\u1EDDng ch\xE9m tr\u01B0\u1EE3t." }, "item.hoa_bi": { "name": "H\u1ECDa B\xEC", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "T\u1EA5m da ng\u01B0\u1EDDi v\u1EBD m\u1EB7t m\u1EF9 nh\xE2n, m\u1ECFng nh\u01B0 gi\u1EA5y d\xF3, kho\xE1c l\xEAn l\xE0 th\xE0nh ng\u01B0\u1EDDi kh\xE1c. Ma tu d\xF9ng luy\u1EC7n ph\xE1p y \u1EA9n th\xE2n; ch\xF9a tr\u1EEB t\xE0 mua \u0111\u1EC3 \u0111\u1ED1t tr\u01B0\u1EDBc t\u01B0\u1EE3ng Ph\u1EADt." }, "item.phi_cuong_tuy": { "name": "Phi C\u01B0\u01A1ng T\u1EE7y", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "T\u1EE7y x\u01B0\u01A1ng Phi C\u01B0\u01A1ng, \u0111en \u0111\u1EB7c nh\u01B0 nh\u1EF1a, \u0111\u1EC3 trong h\u0169 v\u1EABn t\u1EF1 b\xF2 l\xEAn mi\u1EC7ng h\u0169. L\xF5i \u0111\u1EC3 luy\u1EC7n thi kh\xF4i bi\u1EBFt bay; \u0111an s\u01B0 ma \u0111\u1EA1o n\u1EA5u th\xE0nh \u0111\u1ED9c l\xE0m kh\xF4 m\xE1u." }, "item.huyet_anh_tinh": { "name": "Huy\u1EBFt \u1EA2nh Tinh", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Gi\u1ECDt m\xE1u \u0111\xF4ng th\xE0nh tinh th\u1EC3 \u0111\u1ECF s\u1EABm khi Huy\u1EBFt \u1EA2nh tan, soi l\xEAn \u0111\xE8n th\u1EA5y b\xF3ng ng\u01B0\u1EDDi qu\u1EB1n qu\u1EA1i b\xEAn trong. Ma \u0111\u1EA1o d\xF9ng luy\u1EC7n huy\u1EBFt b\u1EA3o; \u0111an s\u01B0 li\u1EC1u th\xEC luy\u1EC7n \u0111an \u0111\u1ED9c." }, "item.cuu_u_am_hoa": { "name": "C\u1EEDu U \xC2m H\u1ECFa", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Ng\u1ECDn l\u1EEDa xanh l\xE9t ch\xE1y trong h\u1ED1c m\u1EAFt qu\u1EF7 t\u1ED1t, nh\u1ED1t v\xE0o \u0111\xE8n \u0111\u1ED3ng m\xE0 v\u1EABn l\u1EA1nh tay. Luy\u1EC7n kh\xED s\u01B0 ma \u0111\u1EA1o d\xF9ng l\xE0m l\u1EEDa luy\u1EC7n \xE2m b\u1EA3o, ph\xF9 s\u01B0 th\u1EAFp n\xF3 v\u1EBD ph\xF9 tr\u1EA5n qu\u1EF7." }, "item.quy_vuong_an": { "name": "Qu\u1EF7 V\u01B0\u01A1ng \u1EA4n", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "\u1EA4n \u0111en c\u1EE7a Qu\u1EF7 V\u01B0\u01A1ng, n\u1EB7ng nh\u01B0 c\u1EA3 qu\u1EA3 n\xFAi, m\u1EB7t \u1EA5n kh\u1EAFc k\xEDn t\xEAn ng\u01B0\u1EDDi ch\u1EBFt. C\u1EA7m \u1EA5n th\xEC \xE2m binh quanh \u0111\xF3 c\xFAi \u0111\u1EA7u. Luy\u1EC7n b\u1EA3o ma \u0111\u1EA1o ph\u1EA9m cao, hay n\u1ED9p ch\xF9a \u0111\u1EC3 \u0111\u1ED5i m\u1ED9t l\u1EDDi h\u1EE9a c\u1EE7a cao t\u0103ng." }, "item.lang_nha": { "name": "Lang Nha", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "R\u0103ng nanh s\xF3i y\xEAu, c\u1EE9ng h\u01A1n x\u01B0\u01A1ng th\xFA th\u01B0\u1EDDng. L\xF2 r\xE8n L\u01B0\u01A1ng Qu\u1ED1c m\xE0i l\xE0m m\u0169i t\xEAn ph\xE1 gi\xE1p, l\xEDnh quan \u1EA3i \u0111eo m\u1ED9t chu\u1ED7i cho \u0111\u1EE7 kh\xED th\u1EBF." }, "item.ho_vi": { "name": "H\u1ED3 V\u0129", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "Chi\u1EBFc \u0111u\xF4i c\xE1o y\xEAu, l\xF4ng m\u1EC1m v\xE0 v\u01B0\u01A1ng h\u01B0\u01A1ng l\u1EA1. Th\u1EE3 may ph\xE1p y \u1EDF Th\u1ECBnh Qu\u1ED1c d\u1EC7t v\xE0o \xE1o cho kh\xE1ch sang; m\u1EB7c \u0111i b\xE0n chuy\u1EC7n l\xE0m \u0103n, ng\u01B0\u1EDDi \u0111\u1ED1i di\u1EC7n nghe g\xEC c\u0169ng d\u1EC5 g\u1EADt \u0111\u1EA7u." }, "item.giao_han_can": { "name": "Giao H\xE0n C\xE2n", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "G\xE2n c\u1EE7a giao t\u1ED9c, l\u1EA1nh bu\u1ED1t tay, k\xE9o d\xE3n m\xE0 kh\xF4ng \u0111\u1EE9t. Luy\u1EC7n kh\xED s\u01B0 d\xF9ng l\xE0m d\xE2y cung v\xE0 b\u1ECDc chu\xF4i ph\xE1p kh\xED h\u1EC7 b\u0103ng." }, "item.quy_giap": { "name": "Quy Gi\xE1p", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EA3nh mai r\xF9a y\xEAu, v\xE2n n\u1EE9t nh\u01B0 ch\u1EEF c\u1ED5. Ph\u01B0\u01A1ng s\u0129 \u0110\u1EA1i Ung d\xF9ng b\xF3i qu\u1EBB, luy\u1EC7n kh\xED s\u01B0 ch\u1EBF khi\xEAn. Ng\u01B0\u1EDDi B\u1EAFc Minh kh\xF4ng mua, v\xEC nh\u1EDB Huy\u1EC1n V\u0169." }, "item.ngu_chau": { "name": "Ng\u01B0 Ch\xE2u", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t ch\xE2u ng\u01B0 nh\xE2n k\u1EBFt trong c\u1ED5 h\u1ECDng, \xE1nh xanh nh\u01B0 n\u01B0\u1EDBc \u0111\u1EE5c. Th\u01B0\u01A1ng nh\xE2n ba tuy\u1EBFn thuy\u1EC1n thu l\xE0m v\u1EADt \u0111\u1ED5i, \u0111em soi \u0111\xE1y n\u01B0\u1EDBc th\xEC th\u1EA5y r\xF5 h\u01A1n \u0111\xE8n." }, "item.thiem_to": { "name": "Thi\u1EC1m T\xF4", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EE7 tr\u1EAFng n\u1EB7n t\u1EEB l\u01B0ng c\xF3c y\xEAu, \u0111\u1EB7c qu\xE1nh, m\xF9i h\u1EAFc. \u0110an s\u01B0 d\xF9ng m\u1ED9t gi\u1ECDt l\xE0m d\u1EABn d\u01B0\u1EE3c, d\xF9ng nhi\u1EC1u th\xEC th\xE0nh \u0111\u1ED9c." }, "item.hac_vu": { "name": "H\u1EA1c V\u0169", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng c\xE1nh h\u1EA1c ti\xEAn, nh\u1EB9 nh\u01B0 kh\xF4ng c\xF3. \u0110\u1EA1o s\u0129 c\u1EAFm tr\xEAn b\xFAi t\xF3c, ho\u1EB7c d\xF9ng l\xE0m ph\xF9 b\xFAt. H\u1ECFi mua th\xEC d\u1EC5, h\u1ECFi l\xF4ng n\xE0y c\u1EE7a con n\xE0o th\xEC \u0111\u1EEBng." }, "item.nguyet_lang_mao": { "name": "Nguy\u1EC7t Lang Mao", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "L\xF4ng b\u1EA1c tr\xEAn g\xE1y s\xF3i y\xEAu \u0111\xE3 tu qua m\u1EA5y ch\u1EE5c m\xF9a tr\u0103ng, \u0111\xEAm t\u1ED1i c\xF2n h\u1EAFt \xE1nh l\xE2n l\xE2n. L\xEDnh quan \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c l\xF3t v\xE0o \xE1o gi\xE1p m\xF9a \u0111\xF4ng." }, "item.thien_lang_nhan": { "name": "Thi\xEAn Lang Nh\xE3n", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "Con m\u1EAFt c\u1EE7a s\xF3i v\u01B0\u01A1ng, m\xF3c ra r\u1ED3i v\u1EABn kh\xF4ng kh\xE9p. Nh\xECn v\xE0o l\xE2u th\u1EA5y c\u1EA3 b\u1EA7y s\xF3i ch\u1EA1y trong \u0111\xF3; luy\u1EC7n kh\xED s\u01B0 g\u1EAFn l\xEAn ph\xE1p kh\xED \u0111\u1EC3 soi k\u1EBB \u1EA9n h\xECnh." }, "item.ho_bi": { "name": "H\u1ED3 B\xEC", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "Da c\xE1o y\xEAu c\xF2n nguy\xEAn l\xF4ng, m\u1EC1m nh\u01B0 l\u1EE5a. Ph\xFA th\u01B0\u01A1ng Th\u1ECBnh Qu\u1ED1c may \xE1o cho\xE0ng, m\u1EB7c v\xE0o ng\u01B0\u1EDDi kh\xE1c nh\xECn l\xE2u m\u1ED9t ch\xFAt." }, "item.mi_ho_chau": { "name": "M\u1ECB H\u1ED3 Ch\xE2u", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "Vi\xEAn ch\xE2u h\u1ED3ng ng\u1EADm trong mi\u1EC7ng c\xE1o y\xEAu h\xF3a h\xECnh, th\u01A1m nh\u01B0 ph\u1EA5n son. C\u1EA7m l\xEAn tay l\xE0 nghe ti\u1EBFng c\u01B0\u1EDDi kh\u1EBD b\xEAn tai." }, "item.giao_bi": { "name": "Giao B\xEC", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "Da giao non tr\u01A1n l\u1EA1nh, v\u1EA3y c\xF2n m\u1ECFng. Ng\xE2m n\u01B0\u1EDBc kh\xF4ng m\u1EE5c, th\u1EE3 thuy\u1EC1n ven bi\u1EC3n b\u1ECDc m\u0169i thuy\u1EC1n cho kh\u1ECFi b\u1ECB h\xE0 \u0103n." }, "item.quy_ban": { "name": "Quy B\u1EA3n", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "Y\u1EBFm r\xF9a y\xEAu, v\xE2n n\u1EE9t nh\u01B0 ch\u1EEF c\u1ED5. \u0110an s\u01B0 m\xE0i b\u1ED9t l\xE0m d\u1EABn thu\u1ED1c b\u1ED5 c\u1ED1t; \u1EDF B\u1EAFc Minh kh\xF4ng ai d\xE1m mua c\xF4ng khai." }, "item.hac_cot": { "name": "H\u1EA1c C\u1ED1t", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "X\u01B0\u01A1ng \u1ED1ng ch\xE2n h\u1EA1c, r\u1ED7ng v\xE0 nh\u1EB9 nh\u01B0 tr\xFAc. Th\u1ED5i qua nghe ti\u1EBFng s\xE1o; ng\u01B0\u1EDDi \u0110\u1EA1i Ung cho l\xE0 \u0111i\u1EC1m x\u1EA5u khi th\u1EA5y n\xF3 b\xE0y b\xE1n." }, "item.hac_dinh_hong": { "name": "H\u1EA1c \u0110\u1EC9nh H\u1ED3ng", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "M\xE0o \u0111\u1ECF tr\xEAn \u0111\u1EA7u h\u1EA1c ti\xEAn tr\u0103m tu\u1ED5i, \u0111\xE3 kh\xF4 v\u1EABn \u0111\u1ECF nh\u01B0 son. M\u1ED9t ch\xFAt b\u1ED9t \u0111\u1EE7 \u0111\u1ED9c ch\u1EBFt ng\u01B0\u1EDDi, pha \u0111\xFAng ph\xE9p l\u1EA1i l\xE0 thu\u1ED1c t\u1EA9y ma kh\xED." }, "item.kim_thiem_thiet": { "name": "Kim Thi\u1EC1m Thi\u1EC7t", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "L\u01B0\u1EE1i c\xF3c v\xE0ng trong \u0111\u1EA7m, d\xEDnh v\xE0 d\xE0i h\u01A1n th\xE2n. Ph\u01A1i kh\xF4 v\u1EABn c\xF2n h\xFAt \u0111\u01B0\u1EE3c b\u1EE5i linh kh\xED; \u0111an s\u01B0 d\xF9ng gom t\u1EA1p ch\u1EA5t trong l\xF2." }, "item.giao_tieu": { "name": "Giao Ti\xEAu", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "L\u1EE5a ng\u01B0\u1EDDi c\xE1 d\u1EC7t d\u01B0\u1EDBi n\u01B0\u1EDBc, m\u1ECFng nh\u01B0 kh\xF3i, xu\u1ED1ng n\u01B0\u1EDBc kh\xF4ng \u01B0\u1EDBt. Th\u01B0\u01A1ng thuy\u1EC1n Th\u1ECBnh Qu\u1ED1c \u0111\u1ED5i c\u1EA3 r\u01B0\u01A1ng ng\u1ECDc \u0111\u1EC3 l\u1EA5y m\u1ED9t x\u1EA5p." }, "item.thien_lang_nguyet_phach": { "name": "Thi\xEAn Lang Nguy\u1EC7t Ph\xE1ch", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "Con m\u1EAFt tr\xE1i c\u1EE7a Thi\xEAn Lang V\u01B0\u01A1ng h\xF3a th\xE0nh ng\u1ECDc tr\u1EAFng \u0111\u1EE5c, ban ng\xE0y nh\u01B0 \u0111\xE1 cu\u1ED9i. \u0110\xEAm tr\u0103ng n\xF3 t\u1EF1 s\xE1ng, s\xF3i trong tr\u0103m d\u1EB7m \u0111\u1EC1u ng\u1EA9ng \u0111\u1EA7u h\xFA theo." }, "item.van_tuong_ho_dien": { "name": "V\u1EA1n T\u01B0\u1EDBng H\u1ED3 Di\u1EC7n", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "T\u1EA5m m\u1EB7t ng\u01B0\u1EDDi m\u1ECFng nh\u01B0 l\u1EE5a m\xE0 H\u1ED3 V\u01B0\u01A1ng \u0111eo c\u1EA3 tr\u0103m n\u0103m, s\u1EDD v\xE0o c\xF2n \u1EA5m. Luy\u1EC7n kh\xED s\u01B0 n\xF3i n\xF3 nh\u1EDB \u0111\u01B0\u1EE3c m\u1ECDi khu\xF4n m\u1EB7t t\u1EEBng \u0111eo qua." }, "item.long_huyet_giao_cot": { "name": "Long Huy\u1EBFt Giao C\u1ED1t", "quality": 7, "cat": "Y\xEAu T\xE0i", "desc": "\u0110\u1ED1t s\u1ED1ng c\u1EE7a giao v\u01B0\u01A1ng \u0111\xE3 ng\u1EA5m long huy\u1EBFt, \u0111\u1ECF th\u1EABm nh\u01B0 ng\xE2m m\xE1u. Th\u1EA3 v\xE0o n\u01B0\u1EDBc l\u1EA1nh th\xEC n\u01B0\u1EDBc quanh n\xF3 s\xF4i l\u0103n t\u0103n." }, "item.boi_son_quy_giap": { "name": "B\u1ED1i S\u01A1n Quy Gi\xE1p", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EA3nh mai r\xF9a c\xF5ng n\xFAi, d\xE0y b\u1EB1ng b\xE0n tay, r\xEAu \u0111\xE1 c\xF2n b\xE1m \u1EDF m\u1EB7t ngo\xE0i. \u0110ao ch\xE9m v\xE0o n\u1EA3y ng\u01B0\u1EE3c l\u1EA1i, luy\u1EC7n kh\xED s\u01B0 ph\u1EA3i d\xF9ng l\u1EEDa ba ng\xE0y m\u1EDBi m\u1EC1m." }, "item.thon_nguyet_thiem_chau": { "name": "Th\xF4n Nguy\u1EC7t Thi\u1EC1m Ch\xE2u", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Vi\xEAn ch\xE2u v\xE0ng c\xF3c gi\xE0 ng\u1EADm d\u01B0\u1EDBi l\u01B0\u1EE1i, b\xEAn trong c\xF3 b\xF3ng tr\u0103ng tr\xF2n. \u0110\u1EC3 c\u1EA1nh lu\u1ED1ng linh d\u01B0\u1EE3c m\u1ED9t \u0111\xEAm, s\xE1ng ra l\xE1 xanh \u0111\u1EADm h\u1EB3n." }, "item.hai_ca_chau": { "name": "H\u1EA3i Ca Ch\xE2u", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Ng\u1ECDc trai xanh nh\u1EA1t ng\u01B0 c\u01A1 \u0111eo \u1EDF c\u1ED5, \xE1p tai v\xE0o nghe ti\u1EBFng h\xE1t xa x\u0103m. Nghe l\xE2u th\xEC ch\xE2n t\u1EF1 b\u01B0\u1EDBc v\u1EC1 ph\xEDa bi\u1EC3n." }, "item.thanh_dang_can": { "name": "Thanh \u0110\u1EB1ng C\xE2n", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "S\u1EE3i g\xE2n xanh r\xFAt t\u1EEB th\xE2n \u0110\u1EB1ng Y\xEAu, v\u1EB7n m\xE3i kh\xF4ng \u0111\u1EE9t. Th\u1EE3 b\u1EC7n d\xE2y tr\xF3i ph\xE1p kh\xED v\xE0 d\xE2y cung \u0111\u1EC1u mua." }, "item.thuc_nhan_hoa_nhuy": { "name": "Th\u1EF1c Nh\xE2n Hoa Nh\u1EE5y", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "Nh\u1EE5y hoa \u0111\u1ECF s\u1EABm, d\xEDnh nh\u1EDBp, m\xF9i ng\u1ECDt nh\u01B0 m\u1EADt m\xE0 n\u1ED3ng m\xF9i th\u1ECBt. \u0110an s\u01B0 l\u1EA5y l\xE0m \u0111\u1ED9c d\u1EABn, m\u1ED9t h\u1EA1t l\xE0m t\xEA c\u1EA3 c\xE1nh tay." }, "item.hoe_am_moc": { "name": "H\xF2e \xC2m M\u1ED9c", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "G\u1ED7 h\xF2e gi\xE0 \u0111en b\xF3ng, gi\u1EEFa tr\u01B0a c\u1EA7m v\u1EABn l\u1EA1nh tay. G\u1ED7 n\xE0y gi\u1EEF \u0111\u01B0\u1EE3c h\u1ED3n, ph\xF9 s\u01B0 kh\u1EAFc l\xE0m b\xE0i v\u1ECB, t\xE0 tu l\xE0m nh\xE0 cho qu\u1EF7." }, "item.thien_nien_moc_tam": { "name": "Thi\xEAn Ni\xEAn M\u1ED9c T\xE2m", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "L\xF5i c\xE2y ngh\xECn n\u0103m c\u1EE7a Th\u1EE5 Y\xEAu, v\xE2n g\u1ED7 xo\xE1y nh\u01B0 v\xE2n tay. \u0110\u1EB7t xu\u1ED1ng \u0111\u1EA5t \u1EA9m m\u1ED9t \u0111\xEAm th\xEC m\u1ECDc r\u1EC5 t\u01A1." }, "item.ngo_dong_chi": { "name": "Ng\xF4 \u0110\u1ED3ng Chi", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "C\xE0nh ng\xF4 \u0111\u1ED3ng n\u01A1i Ph\u01B0\u1EE3ng t\u1EEBng \u0111\u1EADu, v\u1ECF \xE1nh \u0111\u1ECF, h\u01A1 l\u1EEDa kh\xF4ng ch\xE1y m\xE0 \u1EA5m d\u1EA7n l\xEAn. Ng\u01B0\u1EDDi ta n\xF3i n\xF3 g\u1ECDi \u0111\u01B0\u1EE3c chim l\u1EEDa v\u1EC1." }, "item.thach_tuy_phan": { "name": "Th\u1EA1ch T\u1EE7y Ph\u1EA5n", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "B\u1ED9t tr\u1EAFng m\u1ECBn c\u1EA1o t\u1EEB l\xF2ng Th\u1EA1ch Qu\xE1i, r\u1EAFc l\xEAn \u0111\u1ED3 g\u1ED1m th\xEC g\u1ED1m c\u1EE9ng nh\u01B0 s\u1EAFt. Th\u1EE3 \u0111\xFAc khu\xF4n ph\xE1p kh\xED tr\u1ED9n v\xE0o \u0111\u1EA5t s\xE9t." }, "item.linh_van_thach": { "name": "Linh V\u0103n Th\u1EA1ch", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EA3nh \u0111\xE1 x\xE1m c\xF3 \u0111\u01B0\u1EDDng v\xE2n t\u1EF1 s\xE1ng m\u1EDD khi ch\u1EA1m linh kh\xED. Tr\u1EADn s\u01B0 m\xE0i l\xE0m m\u1EAFt tr\u1EADn, th\u1EE3 kh\xF4i l\u1ED7i kh\u1EA3m v\xE0o tim t\u01B0\u1EE3ng \u0111\xE1." }, "item.son_tinh_hach": { "name": "S\u01A1n Tinh H\u1EA1ch", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "L\xF5i \u0111\xE1 to b\u1EB1ng n\u1EAFm tay trong ng\u1EF1c S\u01A1n Tinh, n\u1EB7ng nh\u01B0 c\u1EA3 qu\u1EA3 n\xFAi thu l\u1EA1i. \u0110\u1EB7t tr\xEAn \u0111\u1EA5t th\xEC \u0111\u1EA5t quanh \u0111\xF3 l\xFAn xu\u1ED1ng." }, "item.ngoc_tuy": { "name": "Ng\u1ECDc T\u1EE7y", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "Gi\u1ECDt ng\u1ECDc l\u1ECFng trong su\u1ED1t, \u0111\u1ECDng l\u1EA1i th\xE0nh h\u1EA1t khi r\u1EDDi kh\u1ECFi Ng\u1ECDc T\u1EE7y Tinh. \u0110\xE1nh v\u1EE1 th\xE2n n\xF3 th\xEC t\u1EE7y ch\u1EA3y m\u1EA5t g\u1EA7n h\u1EBFt." }, "item.huyet_ngoc": { "name": "Huy\u1EBFt Ng\u1ECDc", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "Vi\xEAn ng\u1ECDc \u0111\u1ECF s\u1EABm, gi\u1EEFa l\xF2ng c\xF3 s\u1EE3i m\xE1u cu\u1ED9n nh\u01B0 \u0111ang ch\u1EA3y. \xC1p v\xE0o c\u1ED5 tay th\xEC nghe m\u1EA1ch m\xECnh \u0111\u1EADp ch\u1EADm l\u1EA1i." }, "item.thach_tuong_tam": { "name": "Th\u1EA1ch T\u01B0\u1EDBng T\xE2m", "quality": 6, "cat": "Y\xEAu T\xE0i", "desc": "Kh\u1ED1i \u0111\xE1 \u0111en h\xECnh tr\xE1i tim trong ng\u1EF1c Tr\u1EA5n M\xF4n Th\u1EA1ch T\u01B0\u1EDBng, kh\u1EAFc k\xEDn tr\u1EADn v\u0103n c\u1ED5. Th\u1EE3 kh\xF4i l\u1ED7i gi\u1ECFi nh\u1EA5t c\u0169ng ch\u1EC9 d\xE1m ch\xE9p l\u1EA1i n\u1EEDa \u0111\u01B0\u1EDDng v\xE2n." }, "item.duoc_linh_phach": { "name": "D\u01B0\u1EE3c Linh Ph\xE1ch", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "\u0110\u1ED1m s\xE1ng xanh l\u1EE5c to b\u1EB1ng h\u1EA1t \u0111\u1EADu, l\xE0 linh t\xEDnh c\u1EE7a c\xE2y thu\u1ED1c \u0111\xE3 th\xE0nh tinh. Th\u1EA3 v\xE0o lu\u1ED1ng thu\u1ED1c, c\u1EA3 lu\u1ED1ng th\u01A1m l\xEAn m\u1ED9t b\u1EADc." }, "item.am_phu_chi": { "name": "\xC2m Ph\xF9 Ch\u1EC9", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "X\u1EA5p gi\u1EA5y v\xE0ng \u0111\xE3 ng\u1EA3 m\xE0u tro, c\xF2n v\u1EBFt chu sa c\u1EE7a ng\u01B0\u1EDDi l\xE0m h\xECnh nh\xE2n. V\u1EBD ph\xF9 l\xEAn gi\u1EA5y n\xE0y, n\xE9t ph\xF9 t\u1EF1 ch\u1EA1y." }, "item.co_kinh_phien": { "name": "C\u1ED5 K\xEDnh Phi\u1EBFn", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EA3nh g\u01B0\u01A1ng \u0111\u1ED3ng v\u1EE1, soi v\xE0o th\u1EA5y m\u1EB7t m\xECnh ch\u1EADm h\u01A1n n\u1EEDa nh\u1ECBp. Ng\u01B0\u1EDDi ng\u1ED3i thi\u1EC1n tr\u01B0\u1EDBc n\xF3 d\u1EC5 th\u1EA5y r\xF5 t\xE2m ma." }, "item.co_dong_tinh": { "name": "C\u1ED5 \u0110\u1ED3ng Tinh", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "C\u1EE5c \u0111\u1ED3ng xanh g\u1EC9 n\u1EA1o t\u1EEB \u0111\xE1y \u0111\u1EC9nh th\xE0nh tinh, g\xF5 v\xE0o k\xEAu nh\u01B0 chu\xF4ng nh\u1ECF. Th\u1EE3 \u0111\xFAc l\xF2 luy\u1EC7n \u0111an tr\u1ED9n m\u1ED9t \xEDt th\xEC l\xF2 gi\u1EEF l\u1EEDa \u0111\u1EC1u." }, "item.tan_kiem_y": { "name": "T\xE0n Ki\u1EBFm \xDD", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "M\u1ED9t m\u1EA3nh ki\u1EBFm g\xE3y c\xF2n v\u01B0\u01A1ng ki\u1EBFm \xFD c\u1EE7a ch\u1EE7 c\u0169, c\u1EA7m l\xE2u th\xEC ng\xF3n tay r\u1EDBm m\xE1u. Ki\u1EBFm tu ng\u1ED3i tr\u01B0\u1EDBc n\xF3 c\xF3 khi ng\u1ED9 ra m\u1ED9t chi\xEAu." }, "item.co_chung_dong": { "name": "C\u1ED5 Chung \u0110\u1ED3ng", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "M\u1EA3nh \u0111\u1ED3ng v\u1EE1 t\u1EEB qu\u1EA3 chu\xF4ng ch\xF9a ngh\xECn n\u0103m, b\xFAng tay v\xE0o c\xF2n ng\xE2n c\u1EA3 bu\u1ED5i. \u0110\xFAc v\xE0o thu\u1EABn th\xEC ti\u1EBFng ng\xE2n d\u1ED9i ng\u01B0\u1EE3c \u0111\xF2n \u0111\xE1nh." }, "item.thuy_hau_mao": { "name": "Th\u1EE7y H\u1EA7u Mao", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "N\u1EAFm l\xF4ng xanh r\xEAu c\u1EE7a kh\u1EC9 n\u01B0\u1EDBc, v\u1EDBt l\xEAn kh\xF4 ngay kh\xF4ng \u0111\u1ECDng gi\u1ECDt n\xE0o. D\xE2n ch\xE0i b\u1EC7n v\xE0o l\u01B0\u1EDBi cho nh\u1EB9, th\u1EE3 may d\u1EC7t \xE1o tr\xE1nh n\u01B0\u1EDBc." }, "item.thuy_linh_chau": { "name": "Th\u1EE7y Linh Ch\xE2u", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t ch\xE2u trong nh\u01B0 gi\u1ECDt n\u01B0\u1EDBc \u0111\xF4ng, l\u1EAFc nghe \xF3c \xE1ch. Ph\xF9 s\u01B0 m\xE0i l\xE0m m\u1EF1c ph\xF9 th\u1EE7y, tr\u1EADn s\u01B0 \u0111\u1EB7t v\xE0o m\u1EAFt tr\u1EADn d\u1EABn n\u01B0\u1EDBc." }, "item.hoa_tinh_chau": { "name": "H\u1ECFa Tinh Ch\xE2u", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t ch\xE2u \u0111\u1ECF r\u1EF1c, gi\u1EEFa c\xF3 \u0111\u1ED1m l\u1EEDa kh\xF4ng t\u1EAFt. B\u1ECDc trong v\u1EA3i th\xEC v\u1EA3i ch\xE1y s\xE9m, ph\u1EA3i \u0111\u1EF1ng h\u1ED9p \u0111\xE1." }, "item.phong_linh_chau": { "name": "Phong Linh Ch\xE2u", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t ch\xE2u x\xE1m nh\u1EA1t nh\u1EB9 nh\u01B0 b\u1ECDt, bu\xF4ng tay th\xEC l\u01A1 l\u1EEDng ngang ng\u1EF1c. B\xEAn trong c\xF3 c\u01A1n l\u1ED1c nh\u1ECF quay m\xE3i." }, "item.suong_phach_tinh": { "name": "S\u01B0\u01A1ng Ph\xE1ch Tinh", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t s\u01B0\u01A1ng \u0111\xF4ng c\u1EE9ng to b\u1EB1ng h\u1EA1t \u0111\u1EADu, \u0111\u1EB7t tr\xEAn l\xF2ng b\xE0n tay m\xE3i kh\xF4ng tan. Ph\xF9 s\u01B0 nghi\u1EC1n ra pha m\u1EF1c v\u1EBD ph\xF9 h\xE0n." }, "item.bang_phach_chau": { "name": "B\u0103ng Ph\xE1ch Ch\xE2u", "quality": 3, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t ch\xE2u b\u0103ng xanh lam, \u0111\u1EC3 gi\u1EEFa tr\u01B0a h\xE8 c\u0169ng kh\xF4ng tan. C\u1EA7m l\xE2u th\xEC tay t\xEA, t\xF3c mai \u0111\u1ECDng s\u01B0\u01A1ng." }, "item.loi_linh_chau": { "name": "L\xF4i Linh Ch\xE2u", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "H\u1EA1t ch\xE2u t\xEDm, tia \u0111i\u1EC7n b\xF2 quanh v\u1ECF nh\u01B0 r\u1EAFn nh\u1ECF. L\u1EA1i g\u1EA7n nghe t\xF3c d\u1EF1ng l\xEAn, kim lo\u1EA1i trong t\xFAi t\u1EF1 rung." }, "item.loi_kich_moc": { "name": "L\xF4i K\xEDch M\u1ED9c", "quality": 5, "cat": "Y\xEAu T\xE0i", "desc": "\u0110o\u1EA1n g\u1ED7 ch\xE1y \u0111en t\u1EEB c\xE2y b\u1ECB s\xE9t \u0111\xE1nh tr\u0103m l\u1EA7n m\xE0 kh\xF4ng ch\u1EBFt, v\xE2n g\u1ED7 c\xF2n ch\u1EA1y tia \u0111i\u1EC7n t\xEDm. Ph\xF9 s\u01B0 L\xF4i ph\xE1p \u0111\u1ED5i c\u1EA3 th\xE1ng c\xF4ng \u0111\u1EC3 l\u1EA5y m\u1ED9t kh\xFAc." }, "item.vu_tinh": { "name": "V\u1EE5 Tinh", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "C\u1EE5c s\u01B0\u01A1ng \u0111\u1EB7c tr\u1EAFng \u0111\u1EE5c, nh\u1ED1t trong l\u1ECD th\xEC c\u1EE9 t\xECm khe h\u1EDF m\xE0 r\u1EC9 ra. Ph\xF9 s\u01B0 d\xF9ng v\u1EBD ph\xF9 \u1EA9n th\xE2n." }, "item.chuong_doc_tinh": { "name": "Ch\u01B0\u1EDBng \u0110\u1ED9c Tinh", "quality": 4, "cat": "Y\xEAu T\xE0i", "desc": "Kh\u1ED1i kh\xED \u0111\u1ED9c xanh v\xE0ng ng\u01B0ng l\u1EA1i trong b\xECnh ng\u1ECDc, n\xFAt g\u1ED7 m\u1EE5c d\u1EA7n t\u1EEB trong ra. \u0110an s\u01B0 luy\u1EC7n \u0111\u1ED9c \u0111an tranh nhau mua." }, "item.doc_khuan_bao": { "name": "\u0110\u1ED9c Khu\u1EA9n B\xE0o", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "T\xFAi b\xE0o t\u1EED n\xE2u t\xEDm c\u1EAFt t\u1EEB m\u0169 n\u1EA5m tinh, b\xF3p nh\u1EB9 l\xE0 ph\u1EE5t kh\xF3i. \u0110an s\u01B0 d\xF9ng l\xE0m \u0111\u1ED9c d\u1EABn, ng\u1EEDi ph\u1EA3i th\xEC ho ba ng\xE0y." }, "item.sa_linh_tinh": { "name": "Sa Linh Tinh", "quality": 2, "cat": "Y\xEAu T\xE0i", "desc": "N\u1EAFm c\xE1t v\xE0ng \xF3ng t\u1EE5 l\u1EA1i kh\xF4ng r\u1EDDi nhau, \u0111\u1ED5 ra b\xE0n v\u1EABn b\xF2 v\u1EC1 m\u1ED9t \u0111\u1ED1ng. Th\u1EE3 luy\u1EC7n b\u1EA3o tr\u1ED9n v\xE0o khu\xF4n \u0111\xFAc thu\u1EABn \u0111\u1EA5t." } };
  var THE_CHAT_DB = {
    "the_chat.hoang_co": {
      "id": "the_chat.hoang_co",
      "ten": "Hoang C\u1ED5 th\xE1nh th\u1EC3",
      "mo_ta": "Th\u1EC3 ch\u1EA5t th\u01B0\u1EE3ng c\u1ED5 ch\xED t\xF4n. Kinh m\u1EA1ch r\u1ED9ng nh\u01B0 \u0111\u1EA1i giang \u0111\u1EA1i h\xE0 (121 \xF4), kh\xF4ng huy\u1EC7t khi\u1EBFu.",
      "buff": "Kh\xED huy\u1EBFt +50% \xB7 Kh\xE1ng ph\u1EA3n ph\u1EC7 50% \xB7 T\u1ED1c \u0111\u1ED9 -15%",
      "icon": "\u{1F451}",
      "khuon": ". . 5 5 4 4 4 5 5 . .\n. 3 3 3 2 2 2 3 3 3 .\n5 3 2 2 1 1 1 2 2 3 5\n5 3 2 2 1 1 1 2 2 3 5\n4 2 1 1 0 0 0 1 1 2 4\n4 2 1 1 0 D 0 1 1 2 4\n4 2 1 1 0 0 0 1 1 2 4\n5 3 2 2 1 1 1 2 2 3 5\n5 3 2 2 1 1 1 2 2 3 5\n. 3 3 3 2 2 2 3 3 3 .\n. . 5 5 4 4 4 5 5 . .\n",
      "dac_tinh": {
        "khi_huyet": 0.5,
        "phan_phe": 0.5,
        "toc_do": -0.15
      }
    },
    "the_chat.cuu_am": {
      "id": "the_chat.cuu_am",
      "ten": "C\u1EEDu \xC2m tuy\u1EC7t m\u1EA1ch",
      "mo_ta": "\xC2m kh\xED t\u1EE5 trong ch\xEDn \u0111\u01B0\u1EDDng kinh m\u1EA1ch. 10 huy\u1EC7t khi\u1EBFu c\u1EF1c h\u1EA1n, 40% kinh m\u1EA1ch \xE9p sang B\u0103ng.",
      "buff": "10 Huy\u1EC7t khi\u1EBFu \xB7 \xC9p 40% B\u0103ng h\u1EC7 \xB7 C\u1EF1c m\u1EA1nh B\u0103ng Tu",
      "icon": "\u2744\uFE0F",
      "khuon": ". 5 4 e 4 5 .\nf d 2 b 2 3 5\n4 c 0 0 0 2 4\n4 1 0 D 0 1 e\n4 2 0 0 0 c 4\n5 3 2 b 2 3 5\n. 5 3 d 3 f .\n",
      "dac_tinh": {
        "ep_bang": 0.4,
        "tho_pham_nhan": 30
      }
    },
    "the_chat.kiem_cot": {
      "id": "the_chat.kiem_cot",
      "ten": "Ki\u1EBFm c\u1ED1t",
      "mo_ta": "X\u01B0\u01A1ng s\u1ED1ng th\u1EB3ng nh\u01B0 th\u1EA7n ki\u1EBFm, kinh m\u1EA1ch thanh tr\u01B0\u1EDDng. Tr\u1EDDi sinh ki\u1EBFm ti\xEAn v\xF4 song.",
      "buff": "Ki\u1EBFm uy l\u1EF1c +25% \xB7 Kinh l\u1ED9 t\u1ED1i \u0111a 7",
      "icon": "\u2694\uFE0F",
      "khuon": ". . f . .\n. 5 4 5 .\n5 4 e 4 5\n4 4 3 4 4\n4 3 d 3 4\n3 3 2 3 3\n3 2 c 2 3\n2 2 1 2 2\n2 1 b 1 2\n1 0 0 0 1\n1 0 D 0 1\n1 0 0 0 1\n. 1 1 1 .\n",
      "dac_tinh": {
        "kiem_uy_luc": 0.25,
        "kinh_lo_toi_da": 7
      }
    },
    "the_chat.bach_thao": {
      "id": "the_chat.bach_thao",
      "ten": "B\xE1ch Th\u1EA3o th\u1EC3",
      "mo_ta": "Huy\u1EBFt m\u1EA1ch sinh ra t\u1EEB linh d\u01B0\u1EE3c th\u1EA7n th\u1EA3o. Th\u1EA5m s\xE2u m\u1ECDi lo\u1EA1i \u0111an d\u01B0\u1EE3c, \u0111an \u0111\u1EA1o th\xE1nh th\u1EC3.",
      "buff": "D\u01B0\u1EE3c kh\xE1ng +30% \xB7 \u0110an d\u01B0\u1EE3c trong tr\u1EADn +50% \xB7 Kh\xED huy\u1EBFt +10%",
      "icon": "\u{1F33F}",
      "khuon": ". . f 4 e 4 5 . .\n. d 3 2 2 2 3 3 .\n5 3 2 1 1 1 2 3 5\n4 2 1 0 0 0 1 c 4\n4 2 1 0 D 0 1 2 4\n4 2 1 0 0 0 1 2 4\n5 3 2 1 b 1 2 3 5\n. 3 3 2 2 2 3 3 .\n. . 5 4 e 4 5 . .\n",
      "dac_tinh": {
        "duoc_khang": 0.3,
        "dan_tran": 0.5,
        "khi_huyet": 0.1
      }
    },
    "the_chat.thiet_cot": {
      "id": "the_chat.thiet_cot",
      "ten": "Thi\u1EBFt c\u1ED1t",
      "mo_ta": "G\xE2n c\u1ED1t \u0111\xFAc t\u1EEB huy\u1EC1n thi\u1EBFt, kinh m\u1EA1ch r\u1ED9ng l\u1EDBn, th\u1EC3 tu kim cang b\u1EA5t ho\u1EA1i.",
      "buff": "Kh\xED huy\u1EBFt +30% \xB7 H\u1ED9 th\u1EC3 +5% \xB7 Th\u1EC3 uy l\u1EF1c +15%",
      "icon": "\u{1F6E1}\uFE0F",
      "khuon": ". . f 5 4 4 4 5 5 . .\n. 3 3 3 2 2 2 3 3 3 .\n5 3 2 2 1 1 1 2 2 3 5\n4 2 1 1 0 0 0 1 1 c 4\n4 2 1 1 0 D 0 1 1 2 4\n4 2 1 1 0 0 0 1 1 2 4\n5 3 2 2 1 1 1 2 2 3 5\n. 3 3 3 2 2 2 3 3 3 .\n. . 5 5 4 e 4 5 5 . .\n",
      "dac_tinh": {
        "khi_huyet": 0.3,
        "ho_the": 0.05,
        "the_uy_luc": 0.15
      }
    },
    "the_chat.pham_the": {
      "id": "the_chat.pham_the",
      "ten": "Ph\xE0m th\u1EC3",
      "mo_ta": "Th\xE2n x\xE1c ng\u01B0\u1EDDi ph\xE0m b\xECnh th\u01B0\u1EDDng, kinh m\u1EA1ch c\xE2n \u0111\u1ED1i.",
      "buff": "Kinh m\u1EA1ch chu\u1EA9n m\u1EF1c \xB7 Kh\xF4ng ch\u1ECBu t\xE1c d\u1EE5ng ph\u1EE5",
      "icon": "\u{1F464}",
      "khuon": ". . f 4 e 4 5 . .\n. d 3 2 2 2 3 3 .\n5 3 2 1 1 1 2 3 5\n4 2 1 0 0 0 1 c 4\n4 2 1 0 D 0 1 2 4\n4 2 1 0 0 0 1 2 4\n5 3 2 1 b 1 2 3 5\n. 3 3 2 2 2 3 3 .\n. . 5 4 e 4 5 . .\n",
      "dac_tinh": {}
    },
    "the_chat.am_hon": {
      "id": "the_chat.am_hon",
      "ten": "\xC2m H\u1ED3n th\u1EC3",
      "mo_ta": "H\u1ED3n ph\xE1ch n\u1EB7ng h\u01A1n th\xE2n x\xE1c, sinh ra \u0111\xE3 nghe \u0111\u01B0\u1EE3c ti\u1EBFng qu\u1EF7 th\u1EA7n. Chuy\xEAn tu Luy\u1EC7n Thi, Qu\u1EF7 H\u1ED3n, Kh\xF4i L\u1ED7i.",
      "buff": "Th\xEAm 1 slot Thi Kh\xF4i / Qu\u1EF7 H\u1ED3n \xB7 Kh\xED huy\u1EBFt -20%",
      "icon": "\u{1F47B}",
      "khuon": ". . . 5 f 5 . . .\n. . 4 4 e 4 4 . .\n. 5 3 2 2 2 3 d .\n5 3 2 1 1 1 2 3 5\ne 2 1 0 0 0 1 2 4\n4 c 1 0 D 0 1 c 4\n5 3 2 0 0 0 2 3 5\n. 4 b 1 1 1 2 4 .\n. . 3 2 . 2 3 . .\n. . . 5 . 5 . . .\n",
      "dac_tinh": {
        "khi_huyet": -0.2
      }
    },
    "the_chat.huyen_vu": {
      "id": "the_chat.huyen_vu",
      "ten": "Huy\u1EC1n V\u0169 th\u1EC3",
      "mo_ta": "Th\xE2n nh\u01B0 mai r\xF9a, kinh m\u1EA1ch tr\xF2n k\xEDn, g\u1EA7n nh\u01B0 kh\xF4ng m\u1ED9t huy\u1EC7t khi\u1EBFu. Ch\u1ECBu \u0111\xF2n c\u1EF1c gi\u1ECFi, t\xE0 c\xF4ng kh\xF3 ph\u1EA3n ph\u1EC7.",
      "buff": "Kh\xED huy\u1EBFt +50% \xB7 Kh\xE1ng ph\u1EA3n ph\u1EC7 ma c\xF4ng 50% \xB7 H\u1ED9 th\u1EC3 +10% \xB7 T\u1ED1c \u0111\u1ED9 -15%",
      "icon": "\u{1F422}",
      "khuon": ". . . 5 4 4 4 5 . . .\n. . 5 3 3 3 3 3 5 . .\n. 4 3 2 2 2 2 2 3 4 .\n5 3 2 1 1 1 1 1 2 3 5\n4 3 2 1 0 0 0 1 2 c 4\n4 2 1 1 0 D 0 1 1 2 4\n4 3 2 1 0 0 0 1 2 3 4\n5 3 2 1 1 1 1 1 2 3 5\n. 4 3 2 2 2 2 2 3 4 .\n. . 5 3 3 3 3 3 5 . .\n. . . 5 4 e 4 5 . . .\n",
      "dac_tinh": {
        "khi_huyet": 0.5,
        "phan_phe": 0.5,
        "toc_do": -0.15,
        "ho_the": 0.1,
        "ho_the_tran": 0.05
      }
    },
    "the_chat.liet_duong": {
      "id": "the_chat.liet_duong",
      "ten": "Li\u1EC7t D\u01B0\u01A1ng th\u1EC3",
      "mo_ta": "D\u01B0\u01A1ng kh\xED trong ng\u01B0\u1EDDi ch\xE1y r\u1EF1c nh\u01B0 m\u1EB7t tr\u1EDDi gi\u1EEFa tr\u01B0a. Kinh m\u1EA1ch nh\u1ECF m\xE0 tu luy\u1EC7n c\u1EF1c nhanh, h\u1ECFa c\xF4ng v\xF4 \u0111\u1ECBch.",
      "buff": "T\u1ED1c \u0111\u1ED9 tu luy\u1EC7n +25% \xB7 H\u1ECFa uy l\u1EF1c +25% \xB7 T\xE0 c\xF4ng ph\u1EA3n ph\u1EC7 t\u0103ng 150%",
      "icon": "\u2600\uFE0F",
      "khuon": ". . . . . 5 . . . . .\n. . . . . f . . . . .\n. . . 4 3 3 3 4 . . .\n. . 3 2 1 1 1 2 3 . .\n. 4 2 1 0 0 0 1 2 4 .\n5 d 3 1 0 D 0 1 3 e 5\n. 4 2 1 0 0 0 1 2 4 .\n. . 3 2 1 b 1 2 3 . .\n. . . 4 3 3 3 4 . . .\n. . . . . c . . . . .\n. . . . . 5 . . . . .\n",
      "dac_tinh": {
        "toc_do": 0.25,
        "phan_phe": 1.5,
        "uy_luc_he": {
          "hoa": 0.25
        }
      }
    }
  };
  var ALL_TOP_SKILLS = ["item.am_duong_giao_thai_kinh", "item.am_han_quyet", "item.am_hoa_chan_kinh", "item.am_sat_quyet", "item.am_thi_trao", "item.an_anh_tam_kinh", "item.bach_luyen_quyet", "item.ban_thach_ho_the", "item.bang_co_ngoc_cot", "item.bao_phac_quyet", "item.bat_diet_kim_than", "item.bat_dong_minh_vuong_kinh", "item.bat_nha_tam_kinh", "item.bat_tu_huyet_than", "item.bich_lac_kinh", "item.bich_thuy_hoi_xuan", "item.bon_thach_quyen", "item.cam_long_thu", "item.canh_kim_chan_kinh", "item.canh_kim_quyet", "item.cau_hon_toa", "item.chan_hon_loi_phap", "item.chan_loi_quyet", "item.chi_thuy_tam_kinh", "item.chuc_dung_hoa_dien", "item.chuong_tam_loi", "item.con_bang_chan_quyet", "item.cuu_chuyen_huyen_hoa_cong", "item.cuu_cung_tran_quyet", "item.cuu_duong_chan_kinh", "item.cuu_thien_cuong_phong", "item.cuu_tieu_ngu_loi_quyet", "item.cuu_u_han_ma_kinh", "item.da_hanh_quyet", "item.dai_bi_chu", "item.dai_nhat_phat_an", "item.dan_ha_bat_diet_kinh", "item.dan_khi_quyet", "item.dan_loi_quyet", "item.dang_la_thu", "item.dia_hoa_on_lo_kinh", "item.dia_mach_tu_linh_kinh", "item.dia_tang_tam_kinh", "item.dien_mau_quyet", "item.do_kiep_loi_kinh", "item.doan_hoa_chan_kinh", "item.doat_nguyen_ma_kinh", "item.doc_bi_cong", "item.doc_hat_cong", "item.doc_long_tho_tuc", "item.dong_bi_thiet_cot", "item.duong_thao_quyet", "item.hac_sa_doc_chuong", "item.hac_sat_thi_giap", "item.han_bang_chuong", "item.han_phach_chu", "item.han_thi_chuong", "item.hang_ma_chuong", "item.hau_tho_quyet", "item.hoa_cot_than_chuong", "item.hoa_huyet_dai_phap", "item.hoa_phuong_niet_ban_kinh", "item.hoa_tho_dong_nguyen_kinh", "item.hoa_van_chuong", "item.hoa_van_kiem_phap", "item.hoang_chung_nhiep_phach", "item.hoi_mau_thuat", "item.hoi_phong_chuong", "item.hon_nguyen_luyen_the_kinh", "item.hong_phan_kho_lau", "item.hong_tran_nghiep_hoa", "item.hop_hoan_tam_kinh", "item.hu_thuy_chuong", "item.huong_hoa_tam_kinh", "item.huyen_bang_chi", "item.huyen_bang_tam_kinh", "item.huyen_hoang_chuong", "item.huyen_hoang_tao_hoa_kinh", "item.huyen_minh_chan_kinh", "item.huyen_nham_chan_kinh", "item.huyen_quy_doan_the", "item.huyen_tan_kinh", "item.huyen_thuy_quyet", "item.huyen_vu_chan_kinh", "item.huyen_vu_tran_hai_kinh", "item.huyet_anh_chi", "item.huyet_co_bi_kinh", "item.huyet_diem_ma_trao", "item.huyet_giap_ma_cong", "item.huyet_ha_ma_kinh", "item.huyet_lao_ma_cong", "item.huyet_ma_nghich_mach", "item.huyet_ma_thien_dao", "item.huyet_mang_kinh", "item.huyet_phuoc_chu", "item.huyet_sat_phan_thien_cong", "item.huyet_son_ma_than", "item.huyet_than_tai_tao", "item.huyet_thu_ma_cong", "item.huyet_trao_cong", "item.huyet_trieu_quyet", "item.khai_bi_quyen", "item.khai_thien_quyen", "item.kho_moc_phung_xuan_quyet", "item.khon_hon_chu", "item.khon_nguyen_than_kinh", "item.kien_moc_thien_kinh", "item.kim_cang_quyet", "item.kim_chung_trao", "item.kim_cot_ngoc_tuy", "item.kim_cuong_bat_hoai_than", "item.kim_cuong_chuong", "item.kim_cuong_luyen_than", "item.kim_huyet_ma_kinh", "item.kim_tam_tam_kinh", "item.kim_than_phap_tuong", "item.lac_tuyet_kiem_quyet", "item.lam_chuong_tam_kinh", "item.lang_ba_ngu_phong_kinh", "item.lang_phong_quyet", "item.liet_dia_quyen", "item.liet_diem_chuong", "item.liet_duong_kiem_dien", "item.liet_hoa_doan_cot", "item.liet_hoa_quyet", "item.loi_am_phan_tam_kinh", "item.loi_hoa_pha_ta_chuong", "item.long_tuong_ba_the", "item.luan_hoi_chan_kinh", "item.luu_van_quyet", "item.luyen_doc_quyet", "item.luyen_phach_tam_kinh", "item.ly_hoa_chan_luc", "item.me_hon_huong_quyet", "item.minh_kinh_chi_thuy_quyet", "item.minh_phach_quyet", "item.moc_hoa_thong_linh_quyet", "item.nghe_thuong_mi_vu", "item.ngu_cam_hi", "item.ngu_chuong_huyen_cong", "item.ngu_nhac_luyen_than_kinh", "item.ngu_phong_quyet", "item.ngu_to_hop_dao_quyet", "item.ngung_thuy_phu_quyet", "item.nguyet_hoa_luyen_hinh", "item.nhiep_hon_dai_phap", "item.nhu_lai_tang_kinh", "item.nhuoc_thuy_huyen_kinh", "item.on_lo_quyet", "item.phan_doc_chan_kinh", "item.phan_nhac_kiem_quyet", "item.phan_thi_quyet", "item.phan_thien_chan_hoa", "item.phe_tam_doc_chi", "item.phi_sa_gian_kim_kinh", "item.phi_thoa_thuat", "item.phieu_phong_bo", "item.phong_do_chan_kinh", "item.phong_huyet_thu", "item.phong_nguyet_quyet", "item.phuc_ho_quyen", "item.phuc_thu_an_quyet", "item.phuong_cau_hoang_quyet", "item.quan_trieu_kinh", "item.quy_anh_bo", "item.quy_hai_kinh", "item.quy_hoa_chu", "item.quy_khu_tang_tuc_kinh", "item.quy_nguyen_doc_kinh", "item.quy_phong_quyet", "item.quy_than_phu_the", "item.quy_tuc_cong", "item.sinh_sinh_bat_tuc", "item.su_tu_hong", "item.suong_nhan_ngung_than_kinh", "item.tai_than_tu_van_kinh", "item.tam_duong_kinh", "item.tam_kiem_quyet", "item.tam_nguyen_quy_nhat_cong", "item.tang_khi_quyet", "item.tang_kieu_quyet", "item.thach_cot_quyet", "item.thach_trung_tang_kim_quyet", "item.thai_am_han_kinh", "item.thai_at_quy_nguyen", "item.thai_bach_kiem_tam", "item.thai_co_luyen_than", "item.thai_hoa_quyet", "item.thai_hu_duong_than_kinh", "item.thai_son_ap_dinh", "item.thai_thanh_tien_kinh", "item.thai_thuong_huyen_thuy_kinh", "item.thanh_de_truong_xuan_kinh", "item.thanh_loi_quyet", "item.thanh_minh_phong_kinh", "item.thanh_moc_quyet", "item.thanh_nang_duoc_kinh", "item.thanh_tinh_tam_kinh", "item.thanh_van_kiem_quyet", "item.thanh_van_van_kiem_quyet", "item.thi_doc_am_chuong", "item.thi_hong_cong", "item.thi_huyet_quyet", "item.thi_vuong_quyen", "item.thiem_to_cong", "item.thien_cuong_loi_quyet", "item.thien_ho_mi_anh", "item.thien_la_loi_tran", "item.thien_loi_chinh_phap", "item.thien_ma_an", "item.thien_ma_chan_kinh", "item.thien_thu_phat_chuong", "item.thiet_bo_sam", "item.thiet_giap_thi_cong", "item.tho_linh_kinh", "item.tho_nap_phap", "item.thon_huyet_ma_chuong", "item.thon_phach_cong", "item.thu_thuy_kiem_quyet", "item.thuc_doc_tam_kinh", "item.thuc_giap_tan", "item.thuc_hon_quyet", "item.thuy_hoa_tuong_te_kinh", "item.thuy_moc_truong_thanh_kinh", "item.tiem_lan_quyet", "item.tinh_hoa_kinh", "item.toa_long_thu", "item.toa_vong_tam_kinh", "item.toai_nhac_quyen", "item.toai_phach_chi", "item.tran_nhac_dinh_hon_kinh", "item.tran_nhac_quyen", "item.trien_ti_thu", "item.trien_xa_thu", "item.trong_nhac_kiem_phap", "item.trong_son_quyet", "item.truong_sinh_chan_kinh", "item.truong_sinh_huyet_kinh", "item.truong_xuan_cong", "item.tu_la_huyet_kinh", "item.tu_la_sat_kiem", "item.tu_tieu_loi_dien", "item.van_doc_kim_than", "item.van_duoc_tam_kinh", "item.van_hoa_quy_nguyen_kinh", "item.van_hon_chu", "item.van_moc_truong_sinh_quyet", "item.van_thi_doc_vu", "item.van_thu_trieu_phong", "item.van_trung_qua_canh", "item.vinh_trieu_chuong", "item.vo_thuong_thu", "item.vo_tuong_chan_kinh", "item.xich_duong_cong", "item.xich_luyen_ma_dao", "item.xich_nham_doan_the_quyet", "item.xich_tuoc_phu_luc", "item.xuan_vu_nhuan_mach_quyet"];
  var ALL_RECIPES = ["dp.am_binh_phu", "dp.bach_giai_dan", "dp.bach_giai_dan_giac", "dp.bach_hac_vu_y", "dp.bach_ho_dao", "dp.ban_son_an", "dp.bang_phach_dan", "dp.bao_huyet_dan", "dp.bao_huyet_dan_mac", "dp.bat_dong_phu", "dp.bi_hi_tran_bi", "dp.bich_ba_linh_tan", "dp.bich_lan_doc_cham", "dp.bo_khi_dan", "dp.bo_khi_dan_cot", "dp.bo_khi_dan_mat", "dp.bo_khuyet_dan", "dp.bo_thien_dan", "dp.boi_anh_dan", "dp.boi_nguyen_dan", "dp.bua_tru_ta", "dp.canh_kim_phu", "dp.canh_kim_phu_nha", "dp.chu_ty_vong", "dp.con_bang_si", "dp.cung_ky_dao", "dp.cuong_huyet_phu", "dp.cuong_phong_phu", "dp.cuu_anh_ho", "dp.cuu_chuyen_kim_dan", "dp.cuu_pham_lien_dai_thiem", "dp.cuu_thien_loi_phu", "dp.cuu_tieu_phong_phu", "dp.cuu_vi_huyen_dang", "dp.dan_lo_dat", "dp.dan_lo_dia", "dp.dan_lo_dong", "dp.dan_lo_huyen", "dp.dan_lo_huyen_dong", "dp.dan_lo_thien", "dp.dan_lo_tien", "dp.dan_loi_phu", "dp.dia_don_phu", "dp.dia_don_phu_vu", "dp.dia_sat_dinh", "dp.diem_hai_phu", "dp.dinh_hai_chau_ca", "dp.dinh_than_dan", "dp.dinh_than_dan_kinh", "dp.dinh_than_phu", "dp.dinh_than_phu_diep", "dp.due_kim_dan", "dp.duong_anh_dan", "dp.duong_khi_dan", "dp.duong_than_dan", "dp.duyen_tho_dan", "dp.giao_can_cung", "dp.giao_lan_giap", "dp.giao_le_chau_lien", "dp.han_thiet_dao", "dp.han_tuy_dan", "dp.hat_vi_tien", "dp.hau_tho_kim_cang_an", "dp.hau_tho_thuan_tuy", "dp.ho_cot_dao", "dp.ho_tam_noi_giap", "dp.ho_vi_phat", "dp.hoa_anh_dan", "dp.hoa_dan_phu", "dp.hoa_lan_truong", "dp.hoa_loan_vu_y", "dp.hoa_long_dan", "dp.hoa_long_truong", "dp.hoan_hon_dan", "dp.hoan_nguyen_dan", "dp.hoan_sinh_phu", "dp.hoi_am_thuan", "dp.hoi_thien_dan", "dp.hoi_xuan_dan", "dp.hoi_xuan_dan_dia", "dp.hoi_xuan_dan_thuy", "dp.hung_tam_kinh", "dp.huyen_anh_dan", "dp.huyen_bang_phu", "dp.huyen_bang_phu_chau", "dp.huyen_quy_phu", "dp.huyen_quy_thuan", "dp.huyen_thiet_ho_uyen", "dp.huyen_vu_phu", "dp.huyen_vu_thuan", "dp.huyen_vu_thuan_ngac", "dp.huyet_anh_dao", "dp.huyet_ha_phien", "dp.ket_kim_dan", "dp.khai_nguyen_dan", "dp.khai_nguyen_dan_nhung", "dp.khi_lo_dia", "dp.khi_lo_dia_du", "dp.khi_lo_hoang", "dp.khi_lo_huyen", "dp.khi_lo_pham", "dp.khi_lo_thien", "dp.khi_lo_tien", "dp.khon_long_phu", "dp.khu_thi_linh", "dp.kim_bang_si", "dp.kim_cuong_phu", "dp.kim_lan_doc_phu", "dp.kim_lo_dan", "dp.kim_o_dan", "dp.kim_sang_duoc", "dp.kim_thiem_phu", "dp.kim_thue_bao_y", "dp.lang_nguyet_cau", "dp.lang_nha_chuy", "dp.lien_chau_loi_phu", "dp.liet_diem_phu", "dp.liet_ho_dao", "dp.liet_ung_cung", "dp.lieu_nguyen_phien", "dp.linh_lung_dan", "dp.linh_lung_thap_nha", "dp.linh_lung_thap_quy", "dp.loi_am_dan", "dp.loi_no_phu", "dp.long_ho_dan", "dp.long_huyet_thuong", "dp.luu_tinh_phu", "dp.luu_van_chu", "dp.luyen_cot_dan", "dp.ly_hoa_hoan_dao", "dp.ly_long_giap", "dp.moc_dang_tac", "dp.na_di_phu", "dp.na_di_phu_sa", "dp.ngung_khi_dan", "dp.ngung_nguyen_dan", "dp.nham_bich_phu", "dp.nhiep_hon_linh", "dp.oanh_thien_loi_chuy", "dp.on_co_dan", "dp.pha_chuong_dan", "dp.pha_giap_toan", "dp.pha_giap_toan_giac", "dp.pha_hu_dan", "dp.pha_quan_phu", "dp.phi_cham_phu", "dp.phi_cuong_trao", "dp.phi_lan_tieu", "dp.phi_liem_phong_y", "dp.phu_but_dia", "dp.phu_but_hoang", "dp.phu_but_hoang_tho", "dp.phu_but_huyen", "dp.phu_but_pham", "dp.phu_but_thien", "dp.phu_but_thien_bao", "dp.phu_but_tien", "dp.phu_dieu_si", "dp.phu_tang_than_moc", "dp.phuoc_tien_tac", "dp.quy_giap_thuan_ngac", "dp.quy_loi_co", "dp.quy_tuc_phu", "dp.sinh_co_dan", "dp.sinh_co_phu", "dp.tam_bao_phu", "dp.tam_lo_phu", "dp.tam_muoi_hoa_phu", "dp.tao_hoa_dan", "dp.tao_hoa_phu", "dp.tay_tuy_dan", "dp.thai_hu_dan", "dp.thai_hu_don_phu", "dp.than_hanh_ngoa_bao", "dp.than_hanh_phu", "dp.thanh_bang_si", "dp.thanh_lien_phu", "dp.thanh_loan_tram", "dp.thanh_moc_thuan", "dp.thanh_phong_kiem", "dp.thanh_phong_phu", "dp.thanh_suong_kiem", "dp.thanh_tam_dan", "dp.thanh_tuyen_phu", "dp.thanh_vu_dan", "dp.thanh_xa_phu", "dp.thao_thiet_an", "dp.thien_bang_cung", "dp.thien_cuong_phu", "dp.thien_dien_phap_y", "dp.thien_loi_dan", "dp.thien_loi_phu", "dp.thien_nhan_phu", "dp.thien_nhat_dan", "dp.thien_ti_phu", "dp.thiet_kiem", "dp.thon_kim_dai", "dp.thong_huyen_dan", "dp.thong_mach_dan", "dp.thong_mach_dan_giap", "dp.thong_than_dan", "dp.thong_than_dan_tuy", "dp.thong_ty_kim_con", "dp.thu_linh_phu", "dp.thu_thu_phu", "dp.thua_anh_kiem", "dp.thuong_lan_kiem", "dp.thuong_lang_phu", "dp.thuong_long_dan", "dp.thuy_don_phu", "dp.thuy_lao_phu", "dp.tich_doc_dan", "dp.tinh_dau_thuan", "dp.tinh_nguyen_dan", "dp.tinh_phach_dan", "dp.toa_hon_phu", "dp.toa_tien_phu", "dp.toai_bich_dan", "dp.toai_giap_phu", "dp.toan_nghe_lu", "dp.toan_phong_phu", "dp.tram_than_phu", "dp.tran_at_moc", "dp.tran_bat_quai_me_tung", "dp.tran_binh_hoa", "dp.tran_but_dia", "dp.tran_but_hoang", "dp.tran_but_huyen", "dp.tran_but_pham", "dp.tran_but_thien", "dp.tran_but_tien", "dp.tran_can_khon", "dp.tran_canh_kim", "dp.tran_cau_hon", "dp.tran_chu_thien_tu_linh", "dp.tran_chu_tuoc", "dp.tran_cuu_cung_kiem", "dp.tran_cuu_tieu_loi", "dp.tran_cuu_u", "dp.tran_dan_linh", "dp.tran_dang_la", "dp.tran_doan_mach", "dp.tran_hau_tho", "dp.tran_hon_dan", "dp.tran_hon_nguyen_tu_linh", "dp.tran_huyen_minh", "dp.tran_huyen_quy", "dp.tran_huyet_hai", "dp.tran_huyet_te", "dp.tran_kho_moc", "dp.tran_kim_cang", "dp.tran_liem_tuc", "dp.tran_lien_hoan_kiem", "dp.tran_ly_hoa", "dp.tran_mau_tho", "dp.tran_ngu_hanh_tu_linh", "dp.tran_pha_giap", "dp.tran_pha_quan", "dp.tran_phong_mach", "dp.tran_quy_phu", "dp.tran_quy_thuy", "dp.tran_suc_dia", "dp.tran_tam_tai_kiem", "dp.tran_tan_linh", "dp.tran_tan_nguyen", "dp.tran_thach_bich", "dp.tran_thai_bach", "dp.tran_thanh_de", "dp.tran_thanh_moc_duc_linh", "dp.tran_thien_co", "dp.tran_thien_cuong_toa_linh", "dp.tran_thien_la", "dp.tran_thong_mach", "dp.tran_tich_diet", "dp.tran_toa_linh", "dp.tran_toa_long", "dp.tran_toai_bich", "dp.tran_tru_tien_kiem", "dp.tran_tu_hon", "dp.tran_tu_linh", "dp.tran_tuyet_sinh", "dp.tran_van_huyet", "dp.tran_van_ly", "dp.tran_van_moc_hoi_xuan", "dp.tran_van_nhac", "dp.tran_van_tuong_tu_linh", "dp.tran_van_vu", "dp.tran_xich_diem_kiem", "dp.tran_xuan_phong_hoa_vu", "dp.trang_dam_dan", "dp.truc_co_dan", "dp.truong_xuan_dan", "dp.truyen_am_phu", "dp.tu_khi_dan", "dp.tu_kim_phi_kiem", "dp.tu_kim_phi_kiem_nha", "dp.tu_linh_dan", "dp.tu_sa_doc_cham", "dp.tu_thu_tien_y_chu", "dp.tu_tieu_loi_phu", "dp.tuc_mach_cao", "dp.tuy_ha_dan", "dp.tuyet_bang_kiem", "dp.tuyet_vuc_phu", "dp.van_doc_phien", "dp.van_quy_phien", "dp.van_tam_dan", "dp.van_tho_dan", "dp.van_tuong_dien", "dp.van_yeu_phien", "dp.viem_vu_phu", "dp.vien_tam_moc_ngu", "dp.xich_huy_tien", "dp.yeu_bi_giap"];
  var MO_KHOA_DATA = [{ "id": "mo_khoa.linh_can", "ten": "Linh C\u0103n", "max": 3, "desc": "T\u1ED1i \u0111a t\u1EF7 l\u1EC7 Thi\xEAn / Bi\u1EBFn D\u1ECB Linh C\u0103n" }, { "id": "mo_khoa.thien_tu", "ten": "Thi\xEAn T\u01B0", "max": 4, "desc": "S\xE0n ch\u1EC9 s\u1ED1 kh\u1EDFi \u0111\u1EA7u c\u1EF1c cao" }, { "id": "mo_khoa.tho", "ten": "Th\u1ECD Nguy\xEAn", "max": 3, "desc": "+15 n\u0103m th\u1ECD kh\u1EDFi \u0111\u1EA7u" }, { "id": "mo_khoa.tuc_tue", "ten": "T\xFAc Tu\u1EC7", "max": 3, "desc": "+30% t\u1ED1c \u0111\u1ED9 tu luy\u1EC7n" }, { "id": "mo_khoa.hanh_trang", "ten": "H\xE0nh Trang", "max": 3, "desc": "+100 Linh Th\u1EA1ch kh\u1EDFi \u0111\u1EA7u" }, { "id": "mo_khoa.tui", "ten": "T\xFAi \u0110\u1ED3", "max": 2, "desc": "+4 \xF4 t\xFAi \u0111\u1ED3" }, { "id": "mo_khoa.di_the", "ten": "D\u1ECB Th\u1EC3", "max": 2, "desc": "T\u0103ng g\u1EA5p \u0111\xF4i c\u01A1 h\u1ED9i Th\u1EA7n Th\u1EC3" }, { "id": "mo_khoa.dan_tam", "ten": "\u0110an T\xE2m", "max": 1, "desc": "Thu\u1ED9c s\u1EB5n H\u1ED3i Xu\xE2n \u0110an ph\u01B0\u01A1ng" }, { "id": "mo_khoa.phu_tam", "ten": "Ph\xF9 T\xE2m", "max": 1, "desc": "Thu\u1ED9c s\u1EB5n H\u1ECFa \u0110\u1EA1n Ph\xF9 ph\u01B0\u01A1ng" }, { "id": "mo_khoa.khi_tam", "ten": "Kh\xED T\xE2m", "max": 1, "desc": "Thu\u1ED9c s\u1EB5n Thi\u1EBFt Ki\u1EBFm \u0111\u1ED3 ph\u1ED5" }, { "id": "mo_khoa.chon_nuoc", "ten": "Thi\xEAn m\u1EC7nh: Ch\u1ECDn N\u01B0\u1EDBc", "max": 1, "desc": "Ch\u1ECDn n\u01B0\u1EDBc sinh ra" }, { "id": "mo_khoa.chon_xuat_than", "ten": "Thi\xEAn m\u1EC7nh: Ch\u1ECDn Xu\u1EA5t Th\xE2n", "max": 1, "desc": "Ch\u1ECDn xu\u1EA5t th\xE2n mong mu\u1ED1n" }, { "id": "mo_khoa.dinh_he", "ten": "Thi\xEAn m\u1EC7nh: \u0110\u1ECBnh 1 H\u1EC7", "max": 1, "desc": "Ch\u1EAFc ch\u1EAFn ra h\u1EC7 mong mu\u1ED1n" }, { "id": "mo_khoa.xuat_than.tan_tu", "ten": "M\u1EDF: T\xE1n Tu", "max": 1, "desc": "Xu\u1EA5t th\xE2n T\xE1n tu" }, { "id": "mo_khoa.xuat_than.hau_boi_tong_mon", "ten": "M\u1EDF: H\u1EADu B\u1ED1i T\xF4ng M\xF4n", "max": 1, "desc": "Xu\u1EA5t th\xE2n t\xF4ng m\xF4n" }, { "id": "mo_khoa.xuat_than.hoang_toc", "ten": "M\u1EDF: Ho\xE0ng T\u1ED9c", "max": 1, "desc": "Xu\u1EA5t th\xE2n ho\xE0ng gia" }, { "id": "mo_khoa.xuat_than.chuyen_the", "ten": "M\u1EDF: Chuy\u1EC3n Th\u1EBF", "max": 1, "desc": "H\u1ED3n m\u1EA1nh, nh\u1EDB ki\u1EBFp tr\u01B0\u1EDBc" }];
  var ALL_THANH_TUU = [{ "id": "thanh_tuu.canh_gioi.luyen_khi", "ten": "B\u01B0\u1EDBc l\xEAn ti\xEAn l\u1ED9 (Luy\u1EC7n Kh\xED)" }, { "id": "thanh_tuu.canh_gioi.truc_co", "ten": "Tr\xFAc c\u01A1 th\xE0nh c\xF4ng" }, { "id": "thanh_tuu.canh_gioi.ket_dan", "ten": "Ch\xE2n nh\xE2n (Kim \u0110an)" }, { "id": "thanh_tuu.canh_gioi.nguyen_anh", "ten": "L\xE3o t\u1ED5 (Nguy\xEAn Anh)" }, { "id": "thanh_tuu.canh_gioi.hoa_than", "ten": "\u0110\u1EA1i n\u0103ng (H\xF3a Th\u1EA7n)" }, { "id": "thanh_tuu.pham_chat.2", "ten": "\u0110\u1EA1o c\u01A1 Ho\xE0n M\u1EF9" }, { "id": "thanh_tuu.pham_chat.3", "ten": "Kim \u0111an Nh\u1EA5t ph\u1EA9m" }, { "id": "thanh_tuu.pham_chat.4", "ten": "D\u1ECB anh (D\u1ECB t\u01B0\u1EE3ng Nguy\xEAn Anh)" }, { "id": "thanh_tuu.tong_mon.chan_truyen", "ten": "Ch\xE2n truy\u1EC1n \u0111\u1EC7 t\u1EED" }, { "id": "thanh_tuu.tong_mon.truong_lao", "ten": "Tr\u01B0\u1EDFng l\xE3o m\xF4n ph\xE1i" }, { "id": "thanh_tuu.dao_lu", "ten": "K\u1EBFt l\xE0m \u0111\u1EA1o l\u1EEF" }, { "id": "thanh_tuu.ket_nghia", "ten": "K\u1EBFt ngh\u0129a kim lan" }, { "id": "thanh_tuu.thien_kieu_bang", "ten": "\u0110\u1EE9ng \u0111\u1EA7u Thi\xEAn Ki\xEAu B\u1EA3ng" }, { "id": "thanh_tuu.tam_ma", "ten": "Ch\xE9m t\xE2m ma" }, { "id": "thanh_tuu.nuoc.ung", "ten": "Tr\xFAc c\u01A1 \u1EDF \u0110\u1EA1i Ung" }, { "id": "thanh_tuu.nuoc.thinh", "ten": "Tr\xFAc c\u01A1 \u1EDF Th\u1ECBnh Qu\u1ED1c" }, { "id": "thanh_tuu.nuoc.luong", "ten": "Tr\xFAc c\u01A1 \u1EDF L\u01B0\u01A1ng Qu\u1ED1c" }, { "id": "thanh_tuu.nuoc.minh", "ten": "Tr\xFAc c\u01A1 \u1EDF B\u1EAFc Minh" }, { "id": "thanh_tuu.nuoc.viem", "ten": "Tr\xFAc c\u01A1 \u1EDF Vi\xEAm Qu\u1ED1c" }, { "id": "thanh_tuu.nghe.luyen_dan", "ten": "\u0110an s\u01B0 (M\u1EDF \u0110an T\xE2m)" }, { "id": "thanh_tuu.nghe.che_phu", "ten": "Ph\xF9 s\u01B0 (M\u1EDF Ph\xF9 T\xE2m)" }, { "id": "thanh_tuu.nghe.luyen_bao", "ten": "Kh\xED s\u01B0 (M\u1EDF Kh\xED T\xE2m)" }, { "id": "thanh_tuu.nghe.tong_su", "ten": "T\xF4ng s\u01B0 m\u1ED9t ngh\u1EC1" }, { "id": "thanh_tuu.chet.het_tho", "ten": "Th\u1ECD t\u1EADn" }, { "id": "thanh_tuu.chet.tu_tran", "ten": "T\u1EED tr\u1EADn" }, { "id": "thanh_tuu.chet.dot_pha", "ten": "Th\xE2n t\u1EED \u0111\u1EA1o ti\xEAu" }, { "id": "thanh_tuu.chet.tu_vong", "ten": "B\u1ECF m\u1EA1ng" }, { "id": "thanh_tuu.chet.tu_bo", "ten": "T\u1EF1 t\xE1n c\xF4ng" }];
  var FAMILIAR_PRESETS = [
    {
      "id": "bach_trach",
      "name": "B\u1EA1ch Tr\u1EA1ch",
      "kind": "linh_thu",
      "template": "enemy.bach_trach",
      "element": "moc",
      "realm": 4,
      "stage": 3,
      "aptitude": 5,
      "temper": "hien",
      "icon": "\u{1F98C}",
      "desc": "Th\u1EA7n th\xFA th\u01B0\u1EE3ng c\u1ED5 B\u1EA1ch Tr\u1EA1ch, th\xF4ng tu\u1EC7 v\u1EA1n v\u1EADt \u0111\u1EA5t tr\u1EDDi, h\u1ED9 m\u1EC7nh ph\xFAc tr\u1EA1ch v\xF4 bi\xEAn."
    },
    {
      "id": "thuc_thiet_thu",
      "name": "Th\u1EF1c Thi\u1EBFt Th\xFA",
      "kind": "linh_thu",
      "template": "enemy.thuc_thiet_thu",
      "element": "kim",
      "realm": 3,
      "stage": 3,
      "aptitude": 5,
      "temper": "tham_an",
      "icon": "\u{1F43C}",
      "desc": "Th\u01B0\u1EE3ng c\u1ED5 chi\u1EBFn th\xFA c\u1EE7a Xi V\u01B0u, \u0103n s\u1EAFt ng\u1EADm \u0111\xE1, s\u1EE9c m\u1EA1nh kinh thi\xEAn \u0111\u1ED9ng \u0111\u1ECBa."
    },
    {
      "id": "kim_o_huyet_due",
      "name": "Kim \xD4 Huy\u1EBFt Du\u1EC7",
      "kind": "linh_thu",
      "template": "enemy.kim_o_huyet_due",
      "element": "hoa",
      "realm": 5,
      "stage": 3,
      "aptitude": 5,
      "temper": "kieu",
      "icon": "\u{1F985}",
      "desc": "Huy\u1EBFt du\u1EC7 Kim \xD4 Th\xE1i D\u01B0\u01A1ng Th\u1EA7n \u0110i\u1EC3u, thi\xEAu r\u1EE5i h\u01B0 kh\xF4ng b\u1EB1ng Th\xE1i D\u01B0\u01A1ng Ch\xE2n H\u1ECFa."
    },
    {
      "id": "cam_ly",
      "name": "C\u1EA9m L\xFD Ti\xEAn Ng\u01B0",
      "kind": "linh_thu",
      "template": "enemy.cam_ly",
      "element": "thuy",
      "realm": 3,
      "stage": 3,
      "aptitude": 5,
      "temper": "hien",
      "icon": "\u{1F41F}",
      "desc": "C\u1EA9m L\xFD ng\u1EADm ng\u1ECDc, t\u0103ng \u0111\u1EA1i ph\xFAc duy\xEAn, kh\xED v\u1EADn hanh th\xF4ng, s\u1EAFp h\xF3a Long m\xF4n."
    },
    {
      "id": "tam_vi_linh_ho",
      "name": "Tam V\u0129 Linh H\u1ED3",
      "kind": "linh_thu",
      "template": "enemy.tam_vi_linh_ho",
      "element": "hoa",
      "realm": 3,
      "stage": 3,
      "aptitude": 5,
      "temper": "nghich",
      "icon": "\u{1F98A}",
      "desc": "Linh h\u1ED3 ba \u0111u\xF4i m\u1ECB l\u1EF1c kinh ng\u01B0\u1EDDi, nhanh nh\u1EB9n bi\u1EBFn \u1EA3o, chi\xEAu th\u1EE9c r\u1EF1c l\u1EEDa."
    },
    {
      "id": "cuu_menh_huyen_mieu",
      "name": "C\u1EEDu M\u1EC7nh Huy\u1EC1n Mi\xEAu",
      "kind": "linh_thu",
      "template": "enemy.cuu_menh_huyen_mieu",
      "element": "thuy",
      "realm": 3,
      "stage": 3,
      "aptitude": 5,
      "temper": "kieu",
      "icon": "\u{1F431}",
      "desc": "Huy\u1EC1n Mi\xEAu mang ch\xEDn m\u1EA1ng, tr\xE1nh n\xE9 tuy\u1EC7t \u0111\u1ED1i \u0111\xF2n ch\xED t\u1EED, h\xE0nh tung tho\u1EAFt \u1EA9n tho\u1EAFt hi\u1EC7n."
    },
    {
      "id": "co_chien_khoi_loi",
      "name": "C\u1ED5 Chi\u1EBFn Kh\xF4i L\u1ED7i",
      "kind": "khoi_loi",
      "template": "enemy.co_chien_khoi_loi",
      "element": "kim",
      "realm": 5,
      "stage": 3,
      "aptitude": 5,
      "icon": "\u{1F916}",
      "desc": "Chi\u1EBFn kh\xF4i th\u01B0\u1EE3ng c\u1ED5 r\xE8n t\u1EEB Thi\xEAn Ngo\u1EA1i Th\u1EA7n Thi\u1EBFt, m\xECnh \u0111\u1ED3ng da s\u1EAFt, c\xF4ng ph\u1EA1t l\xF4i \u0111\xECnh."
    },
    {
      "id": "han_bat",
      "name": "H\u1EA1n B\u1EA1t Thi V\u01B0\u01A1ng",
      "kind": "thi",
      "template": "enemy.han_bat",
      "element": "hoa",
      "realm": 4,
      "stage": 3,
      "aptitude": 5,
      "icon": "\u{1F9DF}",
      "desc": "Thi v\u01B0\u01A1ng H\u1EA1n B\u1EA1t xu\u1EA5t th\u1EBF, v\u1EA1n d\u1EB7m kh\xF4 c\u1EB1n, ch\xE2n h\u1ECFa thi\xEAu \u0111\u1ED1t m\u1ECDi ph\xF2ng ng\u1EF1."
    },
    {
      "id": "cuong_thi_tuong",
      "name": "C\u01B0\u01A1ng Thi T\u01B0\u1EDBng",
      "kind": "thi",
      "template": "enemy.cuong_thi_tuong",
      "element": "tho",
      "realm": 3,
      "stage": 3,
      "aptitude": 5,
      "icon": "\u{1F9CC}",
      "desc": "Thi t\u01B0\u1EDBng ng\xE0n n\u0103m trong c\u1ED5 m\u1ED9, th\xE2n th\u1EC3 nh\u01B0 kh\u1ED1i th\xE9p, h\u1ED9 ch\u1EE7 trung th\xE0nh tuy\u1EC7t \u0111\u1ED1i."
    },
    {
      "id": "u_minh_quy_mau",
      "name": "U Minh Qu\u1EF7 M\u1EABu",
      "kind": "hon",
      "template": "enemy.quy_mau",
      "element": "thuy",
      "realm": 4,
      "stage": 3,
      "aptitude": 5,
      "icon": "\u{1F47B}",
      "desc": "Ch\xFAa t\u1EC3 U Minh \xE2m gi\u1EDBi, c\xE2u h\u1ED3n nhi\u1EBFp ph\xE1ch, tri\u1EC7u h\u1ED3i v\u1EA1n qu\u1EF7 c\u1EAFn x\xE9 nguy\xEAn th\u1EA7n."
    },
    {
      "id": "kim_tam_co",
      "name": "Kim T\u1EB1m C\u1ED5 V\u01B0\u01A1ng",
      "kind": "trung",
      "template": "enemy.kim_tam_co",
      "element": "kim",
      "realm": 3,
      "stage": 3,
      "aptitude": 5,
      "icon": "\u{1F41B}",
      "desc": "Vua c\u1EE7a c\xE1c lo\xE0i c\u1ED5 tr\xF9ng, c\u1EAFn th\u1EE7ng ch\xE2n nguy\xEAn h\u1ED9 th\u1EC3, k\u1ECBch \u0111\u1ED9c v\xF4 ph\u01B0\u01A1ng c\u1EE9u ch\u1EEFa."
    }
  ];

  // src/data/items.ts
  var CATEGORY_NAMES = {
    all: "T\u1EA5t C\u1EA3 Lo\u1EA1i",
    cong_phap: "C\xF4ng Ph\xE1p",
    dan_duoc: "\u0110an D\u01B0\u1EE3c",
    phap_khi: "Ph\xE1p Kh\xED",
    tran_ban: "Tr\u1EADn B\xE0n / Tr\u1EADn \u0110\u1ED3",
    ngu_linh: "Ng\u1EF1 Linh / Kh\xF4i L\u1ED7i",
    linh_duoc: "Linh D\u01B0\u1EE3c",
    yeu_tai: "Y\xEAu T\xE0i",
    luyen_che: "Nguy\xEAn Li\u1EC7u Luy\u1EC7n Ch\u1EBF",
    nguyen_lieu: "Kho\xE1ng Th\u1EA1ch / Kim Lo\u1EA1i",
    phu_luc: "Ph\xF9 L\u1EE5c",
    di_hoa: "D\u1ECB H\u1ECFa",
    dung_cu: "D\u1EE5ng C\u1EE5 Luy\u1EC7n Ch\u1EBF",
    phuong_tien: "Ph\u01B0\u01A1ng Ti\u1EC7n",
    tru_vat: "Tr\u1EEF V\u1EADt",
    don_phuong: "\u0110\u01A1n Ph\u01B0\u01A1ng / \u0110\u1ED3 Ph\u1ED5",
    di_bao: "D\u1ECB B\u1EA3o",
    lenh_bai: "L\u1EC7nh B\xE0i",
    dac_san: "\u0110\u1EB7c S\u1EA3n",
    tap_vat: "T\u1EA1p V\u1EADt"
  };
  function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  }
  function getItemInfo(itemId) {
    const normId = itemId.startsWith("item.") ? itemId : `item.${itemId}`;
    try {
      const liveItems = gWin.game?.env?.content?.items;
      if (liveItems && typeof liveItems.get === "function") {
        const liveData = liveItems.get(normId);
        if (liveData) {
          return {
            id: normId,
            name: liveData.ten || liveData.name || normId.replace("item.", ""),
            quality: liveData.pham_cap || liveData.phamCap || 1,
            cat: liveData.loai || "khac",
            he: liveData.he || [],
            hinh: liveData.hinh || [],
            desc: liveData.mo_ta || liveData.desc || "",
            isShaped: !!(liveData.hinh && liveData.hinh.length)
          };
        }
      }
    } catch (e) {
    }
    if (PRESET_ITEMS[normId]) {
      const p = PRESET_ITEMS[normId];
      return {
        id: normId,
        name: p.name,
        quality: p.quality || 1,
        cat: p.cat || "V\u1EADt ph\u1EA9m",
        desc: p.desc
      };
    }
    try {
      const state = getGameState();
      const content = state?.content || {};
      const itemObj = content.items || content.item || {};
      const rawKey = normId.replace("item.", "");
      let itemData = null;
      if (typeof itemObj.get === "function") {
        itemData = itemObj.get(normId) || itemObj.get(rawKey);
      } else {
        itemData = itemObj[normId] || itemObj[rawKey];
      }
      if (itemData) {
        return {
          id: normId,
          name: itemData.ten || itemData.name || rawKey,
          quality: itemData.pham_cap || itemData.phamCap || 1,
          cat: itemData.loai || "khac",
          he: itemData.he || [],
          hinh: itemData.hinh || [],
          desc: itemData.mo_ta || itemData.desc || "",
          isShaped: !!(itemData.hinh && itemData.hinh.length)
        };
      }
    } catch (e) {
    }
    const parts = normId.replace("item.", "").split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    return {
      id: normId,
      name: parts.join(" "),
      quality: 1,
      cat: "khac",
      desc: "V\u1EADt ph\u1EA9m tu ti\xEAn"
    };
  }
  var cachedAllItems = null;
  var lastCacheTime = 0;
  function getAllAvailableItems() {
    const now = Date.now();
    if (cachedAllItems && now - lastCacheTime < 1e4) return cachedAllItems;
    const map = /* @__PURE__ */ new Map();
    try {
      const liveItems = gWin.game?.env?.content?.items;
      if (liveItems && typeof liveItems.forEach === "function") {
        liveItems.forEach((val, key) => {
          const fullId = key.startsWith("item.") ? key : `item.${key}`;
          map.set(fullId, {
            id: fullId,
            name: val.ten || val.name || key,
            quality: val.pham_cap || val.phamCap || 1,
            cat: val.loai || "khac",
            he: val.he || [],
            hinh: val.hinh || [],
            desc: val.mo_ta || val.desc || "",
            isShaped: !!(val.hinh && val.hinh.length)
          });
        });
      }
    } catch (e) {
    }
    try {
      const state = getGameState();
      const content = state?.content || {};
      const itemObj = content.items || content.item || {};
      if (itemObj && typeof itemObj.forEach === "function") {
        itemObj.forEach((val, key) => {
          const fullId = key.startsWith("item.") ? key : `item.${key}`;
          if (!map.has(fullId)) {
            map.set(fullId, {
              id: fullId,
              name: val.ten || val.name || key,
              quality: val.pham_cap || val.phamCap || 1,
              cat: val.loai || "khac",
              he: val.he || [],
              hinh: val.hinh || [],
              desc: val.mo_ta || val.desc || "",
              isShaped: !!(val.hinh && val.hinh.length)
            });
          }
        });
      }
    } catch (e) {
    }
    for (const id in PRESET_ITEMS) {
      if (Object.prototype.hasOwnProperty.call(PRESET_ITEMS, id)) {
        if (!map.has(id)) {
          const p = PRESET_ITEMS[id];
          map.set(id, {
            id,
            name: p.name,
            quality: p.quality || 1,
            cat: p.cat || "khac",
            desc: p.desc
          });
        }
      }
    }
    cachedAllItems = Array.from(map.values()).sort((a, b) => {
      if (b.quality !== a.quality) return b.quality - a.quality;
      return a.name.localeCompare(b.name, "vi");
    });
    lastCacheTime = now;
    return cachedAllItems;
  }
  function filterItems(catFilter = "all", qualityFilter = -1, searchQuery = "", offset = 0, limit = 50) {
    let list = getAllAvailableItems();
    if (catFilter && catFilter !== "all") {
      list = list.filter((it) => it.cat === catFilter);
    }
    if (qualityFilter > 0) {
      list = list.filter((it) => it.quality === qualityFilter);
    }
    if (searchQuery && searchQuery.trim()) {
      const cleanQ = removeVietnameseTones(searchQuery.trim());
      const rawQ = searchQuery.trim().toLowerCase();
      list = list.filter((it) => {
        const nameNorm = removeVietnameseTones(it.name);
        const idNorm = it.id.toLowerCase();
        return nameNorm.includes(cleanQ) || idNorm.includes(rawQ);
      });
    }
    const total = list.length;
    const items = list.slice(offset, offset + limit);
    return { items, total };
  }

  // src/core/mutator.ts
  var toastTimer = null;
  function notify(msg) {
    let t = document.getElementById("vktt-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "vktt-toast";
      t.style.cssText = `
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(28, 24, 21, 0.96);
      color: #f0e9d6;
      padding: 9px 18px;
      border-radius: 4px;
      border: 1px solid #a31d1d;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.85), inset 0 0 0 1px rgba(212, 163, 75, 0.35);
      z-index: 99999999;
      font-family: "Noto Serif", "Times New Roman", serif;
      font-size: 13.5px;
      letter-spacing: 0.2px;
      transition: opacity 0.22s ease, transform 0.22s ease;
      opacity: 0;
      pointer-events: none;
      max-width: 90vw;
      text-align: center;
    `;
      document.body.appendChild(t);
    }
    t.innerText = msg;
    t.style.opacity = "1";
    t.style.transform = "translateX(-50%) translateY(0px)";
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (t) {
        t.style.opacity = "0";
        t.style.transform = "translateX(-50%) translateY(-8px)";
      }
    }, 2600);
  }
  function updateNhanVat(patchObj) {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return false;
    }
    const nextNv = mergeObj(state.run.nhanVat, patchObj);
    const nextRun = mergeObj(state.run, { nhanVat: nextNv });
    setGameState({ run: nextRun });
    persistGameSave(nextRun);
    return true;
  }
  function updateChiSo(k, v) {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const cs = copyObj(state.run.nhanVat.chiSo || {});
    cs[k] = v;
    updateNhanVat({ chiSo: cs });
  }
  function updateBatchChiSo(statsObj) {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const cs = copyObj(state.run.nhanVat.chiSo || {});
    for (const k in statsObj) {
      cs[k] = statsObj[k];
    }
    updateNhanVat({ chiSo: cs });
  }
  function updateTongMon(congTich, capBac) {
    const state = getGameState();
    if (!state || !state.run) {
      notify("\u26A0\uFE0F H\xE3y v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const run = copyObj(state.run);
    function recursiveAddCongTich(obj) {
      if (!obj || typeof obj !== "object") return;
      if (Object.prototype.hasOwnProperty.call(obj, "congTich") && typeof obj.congTich === "number") {
        obj.congTich = congTich;
      }
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === "object" && obj[key] !== null) {
          recursiveAddCongTich(obj[key]);
        }
      }
    }
    recursiveAddCongTich(run);
    const tmPatch = { congTich };
    if (capBac !== void 0) tmPatch.capBac = capBac;
    run.tongMon = mergeObj(run.tongMon || { slot: "slot.1115", congTich: 5e3 }, tmPatch);
    setGameState({ run });
    persistGameSave(run);
  }
  function buildSyncedXepTui(oldXep, tuiDo) {
    const out = [];
    const seen = {};
    if (Array.isArray(oldXep)) {
      for (const id of oldXep) {
        if (tuiDo[id] > 0 && !seen[id]) {
          seen[id] = true;
          out.push(id);
        }
      }
    }
    for (const id in tuiDo) {
      if (Object.prototype.hasOwnProperty.call(tuiDo, id) && tuiDo[id] > 0 && !seen[id]) {
        seen[id] = true;
        out.push(id);
      }
    }
    return out;
  }
  function addItem(itemId, count = 1) {
    let cleanId = itemId.trim();
    if (!cleanId) return notify("\u26A0\uFE0F Vui l\xF2ng nh\u1EADp ID ho\u1EB7c ch\u1ECDn v\u1EADt ph\u1EA9m!");
    if (!cleanId.startsWith("item.")) cleanId = "item." + cleanId;
    try {
      const state = getGameState();
      if (!state || !state.run || !state.run.nhanVat) {
        return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      }
      const nhanVat = copyObj(state.run.nhanVat);
      const tuiDo = copyObj(nhanVat.tuiDo || {});
      tuiDo[cleanId] = (tuiDo[cleanId] || 0) + count;
      nhanVat.tuiDo = tuiDo;
      nhanVat.oTuiThem = Math.max(nhanVat.oTuiThem || 0, 150);
      nhanVat.xepTui = buildSyncedXepTui(nhanVat.xepTui, tuiDo);
      updateNhanVat(nhanVat);
      const info = getItemInfo(cleanId);
      notify(`\u{1F381} \u0110\xE3 th\xEAm +${count} [${info.name}] v\xE0o t\xFAi \u0111\u1ED3!`);
    } catch (e) {
      notify("\u274C Th\xEAm v\u1EADt ph\u1EA9m th\u1EA5t b\u1EA1i!");
    }
  }
  function applyGodPack() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
    }
    const nhanVat = copyObj(state.run.nhanVat);
    const tuiDo = copyObj(nhanVat.tuiDo || {});
    for (const id in PRESET_ITEMS) {
      if (Object.prototype.hasOwnProperty.call(PRESET_ITEMS, id)) {
        const info = PRESET_ITEMS[id];
        if (info.quality >= 7) {
          const q = info.cat === "\u0110an D\u01B0\u1EE3c" || info.cat === "Linh D\u01B0\u1EE3c" || info.cat === "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an" ? 99 : 1;
          tuiDo[id] = Math.max(tuiDo[id] || 0, q);
        }
      }
    }
    nhanVat.tuiDo = tuiDo;
    nhanVat.oTuiThem = Math.max(nhanVat.oTuiThem || 0, 180);
    nhanVat.xepTui = buildSyncedXepTui(nhanVat.xepTui, tuiDo);
    nhanVat.trangBi = mergeObj(nhanVat.trangBi || {}, {
      tru_vat: "item.can_khon_gioi",
      di_hoa: "item.cuu_u_hoang_hoa",
      di_lai: "item.phu_dieu_si",
      luyen_dan: "item.dan_lo_tien",
      che_phu: "item.phu_but_tien",
      luyen_bao: "item.khi_lo_tien"
    });
    updateNhanVat(nhanVat);
    notify("\u{1F451} \u0110\xE3 k\xEDch ho\u1EA1t G\xD3I TH\u1EA6N \u0110\u1EA0O v3.0 (Trang b\u1ECB c\u1EF1c ph\u1EA9m Ph\u1EA9m 8-9 + 99 Th\u1EA7n D\u01B0\u1EE3c)!");
  }
  function unlockAllProfessions() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
    }
    const nghe = {
      luyen_dan: { bac: 4, kinhNghiem: 9999 },
      che_phu: { bac: 4, kinhNghiem: 9999 },
      luyen_bao: { bac: 4, kinhNghiem: 9999 }
    };
    updateNhanVat({ nghe });
    notify("\u{1F4DC} \u0110\xE3 l\xEAn T\xF4ng S\u01B0 3 Ngh\u1EC1 (Luy\u1EC7n \u0110an, Ch\u1EBF Ph\xF9, Luy\u1EC7n Kh\xED)!");
  }
  function unlockAllRecipes() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
    }
    const nhanVat = copyObj(state.run.nhanVat);
    const updatedDonPhuong = uniqueStrings(nhanVat.donPhuong || [], ALL_RECIPES);
    updateNhanVat({ donPhuong: updatedDonPhuong });
    notify(`\u{1F525} \u0110\xE3 l\u0129nh ng\u1ED9 to\xE0n b\u1ED9 ${ALL_RECIPES.length} \u0110AN PH\u01AF\u01A0NG & \u0110\u1ED2 PH\u1ED4!`);
  }
  function unlockAllSkills() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
    }
    const nhanVat = copyObj(state.run.nhanVat);
    const oldKm = copyObj(nhanVat.kinhMach || {});
    oldKm.daLinhNgo = uniqueStrings(oldKm.daLinhNgo || [], ALL_TOP_SKILLS);
    updateNhanVat({ kinhMach: oldKm });
    notify(`\u26A1 \u0110\xE3 th\xF4ng th\u1EA1o ${ALL_TOP_SKILLS.length} C\xD4NG PH\xC1P & K\u1EF8 N\u0102NG C\u1EF0C PH\u1EA8M!`);
  }
  function parseKhuonFallback(khuonStr) {
    const rawLines = khuonStr.replace(/^\s+|\s+$/g, "").split("\n");
    const lines = [];
    for (let i = 0; i < rawLines.length; i++) {
      const rowStr = rawLines[i].replace(/^\s+|\s+$/g, "");
      if (rowStr.length > 0) lines.push(rowStr.split(/\s+/));
    }
    const rong = lines[0] ? lines[0].length : 11;
    const cao = lines.length;
    const vung = [];
    for (let r = 0; r < cao; r++) {
      for (let c = 0; c < rong; c++) {
        const ch = lines[r][c];
        if (ch === "D") vung.push(0);
        else if (ch === ".") vung.push(-1);
        else if (/^[0-5]$/.test(ch)) vung.push(Number(ch));
        else if (/^[a-f]$/.test(ch)) vung.push(ch.charCodeAt(0) - 97);
        else vung.push(-1);
      }
    }
    return { rong, cao, vung };
  }
  function unlockAllMeridians() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
    }
    const nv = copyObj(state.run.nhanVat);
    const oldKm = copyObj(nv.kinhMach || {});
    const trangThai = [];
    if (oldKm.trangThai && oldKm.trangThai.length) {
      for (let i = 0; i < oldKm.trangThai.length; i++) trangThai.push("thong");
    }
    const mau = oldKm.mau ? [...oldKm.mau] : [];
    const heList = nv.linhCan && nv.linhCan.he && nv.linhCan.he.length ? nv.linhCan.he : ["kim"];
    for (let j = 0; j < mau.length; j++) {
      if (mau[j] === "vo_sac") mau[j] = heList[j % heList.length];
    }
    oldKm.mau = mau;
    oldKm.trangThai = trangThai;
    oldKm.daLinhNgo = uniqueStrings(oldKm.daLinhNgo || [], ALL_TOP_SKILLS);
    oldKm.cho = { mo: 99, doiMau: 99 };
    nv.kinhMach = oldKm;
    updateNhanVat(nv);
    notify("\u{1F300} \u0110\xE3 m\u1EDF th\xF4ng to\xE0n b\u1ED9 Kinh M\u1EA1ch (99 L\u01B0\u1EE3t) & l\u0129nh ng\u1ED9 87 K\u1EF9 Ph\xE1p!");
  }
  function setRealm(canhGioiIndex, tieuCanhGioiIndex = 3) {
    const cg = Math.max(0, Math.min(5, Math.floor(canhGioiIndex)));
    const tcg = Math.max(0, Math.min(3, Math.floor(tieuCanhGioiIndex)));
    const REALM_NAMES = {
      0: "Ph\xE0m Nh\xE2n",
      1: "Luy\u1EC7n Kh\xED",
      2: "Tr\xFAc C\u01A1",
      3: "K\u1EBFt \u0110an",
      4: "Nguy\xEAn Anh",
      5: "H\xF3a Th\u1EA7n"
    };
    const SUB_REALM_NAMES = {
      0: "S\u01A1 k\u1EF3",
      1: "Trung k\u1EF3",
      2: "H\u1EADu k\u1EF3",
      3: "\u0110\u1EA1i vi\xEAn m\xE3n"
    };
    updateNhanVat({
      canhGioi: cg,
      tieuCanhGioi: tcg,
      binhCanh: 0
    });
    notify(`\u{1F4C8} \u0110\xE3 chuy\u1EC3n C\u1EA3nh Gi\u1EDBi: ${REALM_NAMES[cg]} - ${SUB_REALM_NAMES[tcg]} (X\xF3a b\xECnh c\u1EA3nh)!`);
  }
  function setExtraRealm(kimDan, yCanh, diTuong, tucTue) {
    const patch = {
      kimDan: Math.max(1, Math.min(5, kimDan || 1)),
      yCanh: yCanh || "Ki\u1EBFm \xFD",
      diTuong: diTuong || "kim"
    };
    if (tucTue !== void 0 && !isNaN(tucTue)) {
      patch.tucTue = tucTue;
    }
    updateNhanVat(patch);
    notify(`\u2728 \u0110\xE3 l\u01B0u Kim \u0110an Ph\u1EA9m ${patch.kimDan}, ${patch.yCanh}, D\u1ECB T\u01B0\u1EE3ng (${patch.diTuong})!`);
  }
  function setPhysique(theChatKey) {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const content = state.content;
    const updatedNhanVat = copyObj(state.run.nhanVat);
    const oldKm = copyObj(updatedNhanVat.kinhMach || {});
    updatedNhanVat.theChat = theChatKey;
    try {
      let tcData = null;
      if (content && content.theChat) {
        tcData = typeof content.theChat.get === "function" ? content.theChat.get(theChatKey) : content.theChat[theChatKey];
      }
      let vungArr = [];
      let rong = 11, cao = 11;
      if (tcData) {
        const tcBase = typeof gWin.Kg === "function" ? gWin.Kg(tcData) : tcData;
        vungArr = tcBase.vung || tcData.vung || [];
        rong = tcBase.rong || tcData.rong || 11;
        cao = tcBase.cao || tcData.cao || 11;
        if (tcBase.thienPhu || tcData.thienPhu) {
          updatedNhanVat.thienPhuTheChat = tcBase.thienPhu || tcData.thienPhu;
        }
      }
      if (!vungArr.length && THE_CHAT_DB[theChatKey]) {
        const fb = parseKhuonFallback(THE_CHAT_DB[theChatKey].khuon);
        vungArr = fb.vung;
        rong = fb.rong;
        cao = fb.cao;
      }
      if (vungArr.length) {
        const heList = updatedNhanVat.linhCan && updatedNhanVat.linhCan.he && updatedNhanVat.linhCan.he.length ? updatedNhanVat.linhCan.he : ["vo_sac"];
        const newTrangThai = [];
        const newMau = [];
        for (let i = 0; i < vungArr.length; i++) {
          newTrangThai.push("thong");
          newMau.push(vungArr[i] < 0 ? "vo_sac" : heList[i % heList.length]);
        }
        const keptManh = [];
        if (oldKm.manh && oldKm.manh.length) {
          for (let mi = 0; mi < oldKm.manh.length; mi++) {
            const m = oldKm.manh[mi];
            if (m.x < rong && m.y < cao) keptManh.push(m);
          }
        }
        const keptSkills = uniqueStrings(oldKm.daLinhNgo || [], ALL_TOP_SKILLS);
        updatedNhanVat.kinhMach = {
          mau: newMau,
          trangThai: newTrangThai,
          huyetThem: oldKm.huyetThem || [],
          manh: keptManh,
          daLinhNgo: keptSkills,
          cho: { mo: 99, doiMau: 99 }
        };
      }
    } catch (err) {
      console.error("L\u1ED7i khi thi\u1EBFt l\u1EADp th\u1EC3 ch\u1EA5t:", err);
    }
    updateNhanVat(updatedNhanVat);
    const tcName = THE_CHAT_DB[theChatKey]?.ten || theChatKey;
    notify(`\u{1F9EC} \u0110\xE3 g\xE1n [${tcName}], th\xF4ng to\xE0n b\u1ED9 Kinh M\u1EA1ch & b\u1EA3o to\xE0n K\u1EF9 Ph\xE1p!`);
  }
  function setLinhCan(selectedHe) {
    if (!selectedHe || selectedHe.length === 0) {
      notify("\u26A0\uFE0F Ch\u1ECDn \xEDt nh\u1EA5t 1 h\u1EC7 Linh C\u0103n!");
      return;
    }
    let isBienDi = false;
    for (const h of selectedHe) {
      if (h === "bang" || h === "phong" || h === "loi") isBienDi = true;
    }
    let pham = "tap", tuLuyen = 1, dotPha = 0;
    if (isBienDi) {
      pham = "bien_di";
      tuLuyen = 1.2;
      dotPha = 0.05;
    } else if (selectedHe.length === 1) {
      pham = "thien";
      tuLuyen = 1.3;
      dotPha = 0.1;
    } else if (selectedHe.length === 2) {
      pham = "song";
      tuLuyen = 1;
    } else {
      pham = "tap";
      tuLuyen = 0.8;
      dotPha = -0.05;
    }
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const nv = copyObj(state.run.nhanVat);
    if (nv.kinhMach && nv.kinhMach.mau) {
      const km = copyObj(nv.kinhMach);
      const newMau = [];
      for (let mi = 0; mi < km.mau.length; mi++) {
        newMau.push(km.mau[mi] === "vo_sac" ? "vo_sac" : selectedHe[mi % selectedHe.length]);
      }
      km.mau = newMau;
      nv.kinhMach = km;
    }
    nv.linhCan = mergeObj(nv.linhCan || {}, {
      pham,
      he: selectedHe,
      isBienDi,
      tuLuyen,
      dotPha
    });
    updateNhanVat(nv);
    notify(`\u{1F331} \u0110\xE3 g\xE1n Linh C\u0103n ${pham.toUpperCase()} (${selectedHe.join(", ")}) & \u0111\u1ED3ng b\u1ED9 m\xE0u m\u1EA1ch!`);
  }
  function resetLinhCan() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) return;
    const nv = copyObj(state.run.nhanVat);
    nv.linhCan = mergeObj(nv.linhCan || {}, {
      pham: "vo",
      he: [],
      isBienDi: false,
      tuLuyen: 0.5,
      dotPha: 0
    });
    updateNhanVat(nv);
    notify("\u{1F331} \u0110\xE3 g\u1EE1 v\u1EC1 V\xF4 Linh C\u0103n!");
  }
  function updateMetaLuanHoi(diem, kiep) {
    persistGameMeta((meta) => {
      meta.diemLuanHoi = diem;
      meta.diemTong = Math.max(meta.diemTong || 0, diem);
      if (kiep !== void 0) {
        meta.kiep = kiep;
      }
    });
    if (kiep !== void 0) {
      const state = getGameState();
      if (state?.run) {
        const run = copyObj(state.run);
        run.kiep = kiep;
        setGameState({ run });
        persistGameSave(run);
      }
    }
    notify(`\u{1F30C} \u0110\xE3 g\xE1n \u0110i\u1EC3m Lu\xE2n H\u1ED3i = ${diem.toLocaleString()}${kiep !== void 0 ? `, S\u1ED1 Ki\u1EBFp = ${kiep}` : ""}!`);
  }
  function unlockAllAchievementsAndFerrymen() {
    const state = getGameState();
    if (!state) return notify("\u26A0\uFE0F Ch\u01B0a k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c game store!");
    persistGameMeta((meta) => {
      meta.diemLuanHoi = 999999;
      meta.diemTong = Math.max(meta.diemTong || 0, 999999);
      const moKhoa = copyObj(meta.moKhoa || {});
      for (const m of MO_KHOA_DATA) {
        moKhoa[m.id] = m.max;
      }
      meta.moKhoa = moKhoa;
      const ttIds = ALL_THANH_TUU.map((a) => a.id);
      meta.tienLo = mergeObj(meta.tienLo || {}, { thanhTuu: ttIds });
    });
    notify(`\u{1F3C6} \u0110\xE3 Max 999,999 \u0110i\u1EC3m Lu\xE2n H\u1ED3i + M\u1EDF Kh\xF3a 17 L\xE3o \u0110\xF2 & 28 Th\xE0nh T\u1EF1u!`);
  }
  function healAllFamiliars() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const nv = copyObj(state.run.nhanVat);
    const familiars = nv.familiars || [];
    if (!familiars.length) {
      notify("\u2139\uFE0F Hi\u1EC7n ch\u01B0a c\xF3 linh th\xFA / kh\xF4i l\u1ED7i n\xE0o trong \u0111\u1ED9i h\xECnh!");
      return;
    }
    familiars.forEach((f) => {
      delete f.injury;
      if (f.state === "down") f.state = "field";
    });
    updateNhanVat({ familiars });
    notify(`\u{1F496} \u0110\xE3 ch\u1EEFa l\xE0nh to\xE0n b\u1ED9 ${familiars.length} linh th\xFA, kh\xF4i l\u1ED7i, thi kh\xF4i v\u1EC1 tr\u1EA1ng th\xE1i ho\xE0n m\u1EF9!`);
  }
  function maxBondAllFamiliars() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const nv = copyObj(state.run.nhanVat);
    const familiars = nv.familiars || [];
    if (!familiars.length) {
      notify("\u2139\uFE0F Hi\u1EC7n ch\u01B0a c\xF3 linh th\xFA n\xE0o trong \u0111\u1ED9i h\xECnh!");
      return;
    }
    familiars.forEach((f) => {
      f.bond = 100;
    });
    updateNhanVat({ familiars });
    notify(`\u{1F31F} \u0110\xE3 k\xEDch ho\u1EA1t \u0110\u1ED9 Th\xE2n M\u1EADt T\u1ED1i \u0110a (100) cho to\xE0n b\u1ED9 linh th\xFA!`);
  }
  function upgradeAllFamiliars() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const nv = copyObj(state.run.nhanVat);
    const familiars = nv.familiars || [];
    if (!familiars.length) {
      notify("\u2139\uFE0F Hi\u1EC7n ch\u01B0a c\xF3 linh th\xFA n\xE0o trong \u0111\u1ED9i h\xECnh!");
      return;
    }
    const hostRealm = nv.canhGioi || 0;
    familiars.forEach((f) => {
      f.aptitude = 5;
      f.realm = Math.max(f.realm || 0, hostRealm);
      f.stage = 3;
      f.exp = 999999;
      f.bond = 100;
      delete f.injury;
    });
    updateNhanVat({ familiars });
    notify(`\u26A1 To\xE0n b\u1ED9 th\xFA c\u01B0ng th\u0103ng hoa l\xEAn Th\u1EA7n Huy\u1EBFt / Ph\u1EA9m 5 & C\u1EA3nh gi\u1EDBi \u0111\u1EA1i vi\xEAn m\xE3n!`);
  }
  function addQuickFamiliar(preset) {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const nv = copyObj(state.run.nhanVat);
    const familiars = nv.familiars || [];
    const famId = `fam_${Math.floor(Math.random() * 2176782336).toString(36).padStart(6, "0")}`;
    const hostRealm = nv.canhGioi || 0;
    const newFam = {
      id: famId,
      name: preset.name,
      kind: preset.kind,
      template: preset.template,
      realm: preset.realm !== void 0 ? preset.realm : hostRealm,
      stage: preset.stage !== void 0 ? preset.stage : 3,
      exp: 0,
      aptitude: preset.aptitude || 5,
      element: preset.element || "vo_sac",
      skills: [],
      traits: ["ho_chu", "dong_tam"],
      skillSlots: 4,
      traitSlots: 2,
      state: "field"
    };
    if (preset.kind === "linh_thu" || preset.kind === "thu") {
      newFam.bond = 100;
      newFam.temper = preset.temper || "hien";
    }
    familiars.push(newFam);
    const updates = { familiars };
    if (!nv.petSlot && (preset.kind === "linh_thu" || preset.kind === "thu")) {
      updates.petSlot = famId;
    }
    if (!nv.familiarSlots || !Array.isArray(nv.familiarSlots)) {
      updates.familiarSlots = [famId];
    } else if (!nv.familiarSlots.includes(famId)) {
      const slots = [...nv.familiarSlots];
      const emptyIdx = slots.indexOf(null);
      if (emptyIdx !== -1) {
        slots[emptyIdx] = famId;
      } else {
        slots.push(famId);
      }
      updates.familiarSlots = slots;
    }
    updateNhanVat(updates);
    notify(`\u{1F43E} \u0110\xE3 kh\u1EBF \u01B0\u1EDBc & xu\u1EA5t chi\u1EBFn [${preset.name}] th\xE0nh c\xF4ng!`);
  }
  function removeFamiliar(famId) {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return;
    }
    const nv = copyObj(state.run.nhanVat);
    let familiars = nv.familiars || [];
    familiars = familiars.filter((f) => f.id !== famId);
    const updates = { familiars };
    if (nv.petSlot === famId) updates.petSlot = null;
    if (Array.isArray(nv.familiarSlots)) {
      updates.familiarSlots = nv.familiarSlots.map((id) => id === famId ? null : id);
    }
    updateNhanVat(updates);
    notify("\u{1F343} \u0110\xE3 gi\u1EA3i tr\u1EEB kh\u1EBF \u01B0\u1EDBc linh th\xFA.");
  }
  function addFamiliarFoodPack() {
    const itemsToAdd = [
      { id: "item.yeu_dan_5", count: 99 },
      { id: "item.yeu_dan_4", count: 99 },
      { id: "item.co_khoi_hach", count: 99 },
      { id: "item.thi_khoi_hach", count: 99 },
      { id: "item.hu_linh_phach", count: 99 },
      { id: "item.linh_thach", count: 99999 }
    ];
    for (const it of itemsToAdd) {
      addItem(it.id, it.count);
    }
    notify("\u{1F371} \u0110\xE3 nh\u1EADn T\xFAi D\u01B0\u1EE1ng Linh Th\xFA (x99 Y\xEAu \u0110an 5, Kh\xF4i H\u1EA1ch, H\u1ED3n Ph\xE1ch, 99,999 Linh Th\u1EA1ch)!");
  }

  // src/modules/optimizer.ts
  var FALLBACK_KHUON = {
    "the_chat.hoang_co": `
. . 5 5 4 4 4 5 5 . .
. 3 3 3 2 2 2 3 3 3 .
5 3 2 2 1 1 1 2 2 3 5
5 3 2 2 1 1 1 2 2 3 5
4 2 1 1 0 0 0 1 1 2 4
4 2 1 1 0 D 0 1 1 2 4
4 2 1 1 0 0 0 1 1 2 4
5 3 2 2 1 1 1 2 2 3 5
5 3 2 2 1 1 1 2 2 3 5
. 3 3 3 2 2 2 3 3 3 .
. . 5 5 4 4 4 5 5 . .
`,
    "the_chat.kiem_cot": `
. . f . .
. 5 4 5 .
5 4 e 4 5
4 4 3 4 4
4 3 d 3 4
3 3 2 3 3
3 2 c 2 3
2 2 1 2 2
2 1 b 1 2
1 0 0 0 1
1 0 D 0 1
1 0 0 0 1
. 1 1 1 .
`,
    "the_chat.thiet_cot": `
. . f 5 4 4 4 5 5 . .
. 3 3 3 2 2 2 3 3 3 .
5 3 2 2 1 1 1 2 2 3 5
4 2 1 1 0 0 0 1 1 c 4
4 2 1 1 0 D 0 1 1 2 4
4 2 1 1 0 0 0 1 1 2 4
5 3 2 2 1 1 1 2 2 3 5
. 3 3 3 2 2 2 3 3 3 .
. . 5 5 4 e 4 5 5 . .
`,
    "the_chat.bach_thao": `
. . f 4 e 4 5 . .
. d 3 2 2 2 3 3 .
5 3 2 1 1 1 2 3 5
4 2 1 0 0 0 1 c 4
4 2 1 0 D 0 1 2 4
4 2 1 0 0 0 1 2 4
5 3 2 1 b 1 2 3 5
. 3 3 2 2 2 3 3 .
. . 5 4 e 4 5 . .
`,
    "the_chat.pham_the": `
. . f 4 e 4 5 . .
. d 3 2 2 2 3 3 .
5 3 2 1 1 1 2 3 5
4 2 1 0 0 0 1 c 4
4 2 1 0 D 0 1 2 4
4 2 1 0 0 0 1 2 4
5 3 2 1 b 1 2 3 5
. 3 3 2 2 2 3 3 .
. . 5 4 e 4 5 . .
`,
    "the_chat.cuu_am": `
. 5 4 e 4 5 .
f d 2 b 2 3 5
4 c 0 0 0 2 4
4 1 0 D 0 1 e
4 2 0 0 0 c 4
5 3 2 b 2 3 5
. 5 3 d 3 f .
`,
    "the_chat.am_hon": `
. . . 5 f 5 . . .
. . 4 4 e 4 4 . .
. 5 3 2 2 2 3 d .
5 3 2 1 1 1 2 3 5
e 2 1 0 0 0 1 2 4
4 c 1 0 D 0 1 c 4
5 3 2 0 0 0 2 3 5
. 4 b 1 1 1 2 4 .
. . 3 2 . 2 3 . .
. . . 5 . 5 . . .
`,
    "the_chat.huyen_vu": `
. . . 5 4 4 4 5 . . .
. . 5 3 3 3 3 3 5 . .
. 4 3 2 2 2 2 2 3 4 .
5 3 2 1 1 1 1 1 2 3 5
4 3 2 1 0 0 0 1 2 c 4
4 2 1 1 0 D 0 1 1 2 4
4 3 2 1 0 0 0 1 2 3 4
5 3 2 1 1 1 1 1 2 3 5
. 4 3 2 2 2 2 2 3 4 .
. . 5 3 3 3 3 3 5 . .
. . . 5 4 e 4 5 . . .
`,
    "the_chat.liet_duong": `
. . . . . 5 . . . . .
. . . . . f . . . . .
. . . 4 3 3 3 4 . . .
. . 3 2 1 1 1 2 3 . .
. 4 2 1 0 0 0 1 2 4 .
5 d 3 1 0 D 0 1 3 e 5
. 4 2 1 0 0 0 1 2 4 .
. . 3 2 1 b 1 2 3 . .
. . . 4 3 3 3 4 . . .
. . . . . c . . . . .
. . . . . 5 . . . . .
`
  };
  function parseKhuon(khuonStr) {
    const lines = khuonStr.trim().split("\n").map((l) => l.trim().split(/\s+/));
    const cao = lines.length;
    const rong = lines[0].length;
    const vung = [];
    let danDien = -1;
    lines.forEach((row, y) => {
      row.forEach((cell, x) => {
        const idx = y * rong + x;
        if (cell === "D") {
          danDien = idx;
          vung.push(0);
        } else if (cell === ".") {
          vung.push(-1);
        } else {
          vung.push(parseInt(cell, 16) || 0);
        }
      });
    });
    return { rong, cao, danDien, vung };
  }
  function getMeridianLayout(physiqueId) {
    try {
      const liveTc = gWin.game?.env?.content?.theChat?.get(physiqueId);
      if (liveTc && liveTc.khuon) {
        return parseKhuon(liveTc.khuon);
      }
    } catch (e) {
    }
    const fbStr = FALLBACK_KHUON[physiqueId] || FALLBACK_KHUON["the_chat.pham_the"];
    return parseKhuon(fbStr);
  }
  function qg(t, n) {
    const e = n % t.rong;
    const i = Math.floor(n / t.rong);
    const o = [];
    if (e > 0) o.push(n - 1);
    if (e < t.rong - 1) o.push(n + 1);
    if (i > 0) o.push(n - t.rong);
    if (i < t.cao - 1) o.push(n + t.rong);
    return o.filter((a) => t.vung[a] >= 0);
  }
  var EX = { loi: "moc", phong: "moc", bang: "thuy" };
  var LX = { moc: "hoa", hoa: "tho", tho: "kim", kim: "thuy", thuy: "moc" };
  var DX = { kim: "moc", moc: "tho", tho: "thuy", thuy: "hoa", hoa: "kim" };
  var xi = (t) => EX[t] || t;
  var isSinh = (t, n) => t !== "vo_sac" && n !== "vo_sac" && LX[xi(t)] === xi(n);
  var isKhac = (t, n) => t !== "vo_sac" && n !== "vo_sac" && DX[xi(t)] === xi(n);
  function getOffsets(hinh, rot) {
    let pts = [];
    hinh.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch !== ".") pts.push([x, y]);
      });
    });
    for (let i = 0; i < (rot % 4 + 4) % 4; i++) {
      pts = pts.map(([x, y]) => [-y, x]);
    }
    const minX = Math.min(...pts.map((p) => p[0]));
    const minY = Math.min(...pts.map((p) => p[1]));
    return pts.map(([x, y]) => [x - minX, y - minY]);
  }
  function packShards(layout, candidates, maxCount = 10) {
    const congPhaps = candidates.filter((c) => c.cat === "cong_phap").sort((a, b) => (b.quality || 0) - (a.quality || 0));
    const phapKhis = candidates.filter((c) => c.cat !== "cong_phap").sort((a, b) => (b.quality || 0) - (a.quality || 0));
    const orderedCandidates = [];
    orderedCandidates.push(...congPhaps.slice(0, 3));
    let cpIdx = 3, pkIdx = 0;
    while (cpIdx < congPhaps.length || pkIdx < phapKhis.length) {
      if (pkIdx < phapKhis.length) orderedCandidates.push(phapKhis[pkIdx++]);
      if (cpIdx < congPhaps.length) orderedCandidates.push(congPhaps[cpIdx++]);
    }
    const placed = [];
    const cellOccupant = layout.vung.map(() => -1);
    cellOccupant[layout.danDien] = -999;
    const connectionSources = /* @__PURE__ */ new Set([layout.danDien]);
    for (const item of orderedCandidates) {
      if (placed.length >= maxCount) break;
      if (!item.hinh || !item.hinh.length) continue;
      if (placed.some((p) => p.item === item.id)) continue;
      const isCP = item.cat === "cong_phap";
      const itemEl = item.he && item.he.length && item.he[0] !== "vo_sac" ? item.he[0] : "vo_sac";
      let bestPlacement = null;
      let bestScore = -999999;
      for (let rot = 0; rot < 4; rot++) {
        const offsets = getOffsets(item.hinh, rot);
        const w = Math.max(...offsets.map((p) => p[0])) + 1;
        const h = Math.max(...offsets.map((p) => p[1])) + 1;
        for (let y = 0; y <= layout.cao - h; y++) {
          for (let x = 0; x <= layout.rong - w; x++) {
            const cells = [];
            let fits = true;
            let touchesConnection = false;
            let hasConflict = false;
            let sinhScore = 0;
            for (const [ox, oy] of offsets) {
              const cx = x + ox;
              const cy = y + oy;
              const cIdx = cy * layout.rong + cx;
              if (cx < 0 || cy < 0 || cx >= layout.rong || cy >= layout.cao || layout.vung[cIdx] < 0 || cellOccupant[cIdx] !== -1) {
                fits = false;
                break;
              }
              cells.push(cIdx);
            }
            if (!fits) continue;
            for (const cIdx of cells) {
              const neighbors = qg(layout, cIdx);
              for (const nIdx of neighbors) {
                if (connectionSources.has(nIdx)) {
                  touchesConnection = true;
                }
                const nbrShardIdx = cellOccupant[nIdx];
                if (nbrShardIdx >= 0) {
                  const nbrShard = placed[nbrShardIdx];
                  const nbrEl = nbrShard.element;
                  if (isKhac(itemEl, nbrEl) || isKhac(nbrEl, itemEl)) {
                    hasConflict = true;
                    break;
                  }
                  if (isSinh(itemEl, nbrEl) || isSinh(nbrEl, itemEl)) {
                    sinhScore += 150;
                  } else if (itemEl === nbrEl && itemEl !== "vo_sac") {
                    sinhScore += 40;
                  }
                }
              }
              if (hasConflict) break;
            }
            if (!touchesConnection || hasConflict) continue;
            const ddX = layout.danDien % layout.rong;
            const ddY = Math.floor(layout.danDien / layout.rong);
            const avgX = cells.reduce((s, c) => s + c % layout.rong, 0) / cells.length;
            const avgY = cells.reduce((s, c) => s + Math.floor(c / layout.rong), 0) / cells.length;
            const distScore = -Math.hypot(avgX - ddX, avgY - ddY) * 10;
            const totalScore = sinhScore + distScore + (item.quality || 1) * 20;
            if (totalScore > bestScore) {
              bestScore = totalScore;
              bestPlacement = {
                item: item.id,
                name: item.name,
                loai: item.cat,
                x,
                y,
                xoay: rot,
                cells,
                element: itemEl
              };
            }
          }
        }
      }
      if (bestPlacement) {
        const shardIdx = placed.length;
        placed.push(bestPlacement);
        for (const c of bestPlacement.cells) {
          cellOccupant[c] = shardIdx;
          if (isCP) {
            connectionSources.add(c);
          }
        }
      }
    }
    return placed;
  }
  function evaluatePlacedShards(layout, placed) {
    const r = placed.map((p) => {
      const it = getItemInfo(p.item);
      return {
        item: it,
        o: p.cells,
        he: p.element || it.he?.[0] || "vo_sac",
        heO: p.cells.map(() => p.element || it.he?.[0] || "vo_sac"),
        thong: false
      };
    });
    const h = layout.vung.map(() => -1);
    r.forEach((shard, sIdx) => shard.o.forEach((c) => h[c] = sIdx));
    const l = r.map(() => /* @__PURE__ */ new Set());
    const d = r.map(() => false);
    const g = r.map(() => /* @__PURE__ */ new Map());
    r.forEach((C, S) => {
      C.o.forEach((cellIdx, eIdx) => {
        for (const neighbor of qg(layout, cellIdx)) {
          if (neighbor === layout.danDien) {
            d[S] = true;
          } else if (h[neighbor] >= 0 && h[neighbor] !== S) {
            l[S].add(h[neighbor]);
            const pairs = g[S].get(h[neighbor]) ?? [];
            pairs.push([C.heO[eIdx], r[h[neighbor]].heO[r[h[neighbor]].o.indexOf(neighbor)]]);
            g[S].set(h[neighbor], pairs);
          }
        }
      });
    });
    const isCP = (C) => r[C]?.item.cat === "cong_phap";
    const queue = r.map((C, S) => S).filter((C) => d[C] && isCP(C));
    for (const C of queue) r[C].thong = true;
    while (queue.length > 0) {
      const C = queue.shift();
      for (const nbr of l[C]) {
        if (!r[nbr].thong && isCP(nbr)) {
          r[nbr].thong = true;
          queue.push(nbr);
        }
      }
    }
    r.forEach((C, S) => {
      if (C && C.item.cat !== "cong_phap") {
        C.thong = d[S] || [...l[S]].some((P) => isCP(P) && r[P].thong);
      }
    });
    let greenBorders = 0;
    let redBorders = 0;
    r.forEach((C, S) => {
      if (C.thong) {
        for (const nbr of l[S]) {
          if (nbr > S && r[nbr].thong) {
            const pairs = g[S].get(nbr) || [];
            const hasSinh = pairs.some(([e1, e2]) => isSinh(e1, e2) || isSinh(e2, e1));
            const hasKhac = pairs.some(([e1, e2]) => isKhac(e1, e2) || isKhac(e2, e1));
            if (hasKhac) redBorders++;
            if (hasSinh) greenBorders++;
          }
        }
      }
    });
    return { total: r.length, thong: r.filter((s) => s.thong).length, green: greenBorders, red: redBorders };
  }
  var TOP_EQUIPMENT = {
    tru_vat: "item.can_khon_gioi",
    // Phẩm 8, Càn Khôn Giới (+1000 ô)
    di_hoa: "item.cuu_u_hoang_hoa",
    // Phẩm 8, Cửu U Hoàng Hỏa
    luyen_dan: "item.dan_lo_tien",
    // Phẩm 6, Thái Thượng đan lô
    che_phu: "item.phu_but_tien",
    // Phẩm 6, Lôi Mộc Phù Bút
    luyen_bao: "item.khi_lo_tien",
    // Phẩm 6, Thái Sơ đỉnh
    di_lai: "item.thai_hu_chu"
    // Phẩm 8, Thái Hư Chu
  };
  var ELEMENT_BUILDS = {
    kim: {
      name: "\u2694\uFE0F Ki\u1EBFm T\xF4ng / Kim Tu",
      elements: ["kim", "thuy", "tho"],
      linhCanPham: "thien",
      items: [
        "item.yeu_hoang_huyet_kinh",
        "item.huyet_ma_thien_dao",
        "item.canh_kim_chan_kinh",
        "item.truong_sinh_chan_kinh",
        "item.khon_nguyen_than_kinh",
        "item.bat_diet_kim_than",
        "item.huyen_vu_chan_kinh",
        "item.bat_chiet_kiem",
        "item.thai_co_long_lan",
        "item.doan_thien_chien_ky",
        "item.nghich_lan_thuan",
        "item.toai_thien_kiem",
        "item.tru_tien_kiem",
        "item.dai_phan_thien_chung"
      ]
    },
    hoa: {
      name: "\u{1F525} H\u1ECFa Tu / Vi\xEAm \u0110\u1EBF",
      elements: ["hoa", "moc", "tho"],
      linhCanPham: "thien",
      items: [
        "item.yeu_hoang_huyet_kinh",
        "item.dai_nhat_phat_an",
        "item.truong_sinh_chan_kinh",
        "item.phan_thien_chan_hoa",
        "item.chuc_dung_hoa_dien",
        "item.khon_nguyen_than_kinh",
        "item.kien_moc_thien_kinh",
        "item.thai_co_long_lan",
        "item.doan_thien_chien_ky",
        "item.hon_thien_lang",
        "item.hau_tho_than_bi",
        "item.hat_vi_tien",
        "item.cuu_vi_huyen_dang",
        "item.hoa_lan_truong"
      ]
    },
    thuy: {
      name: "\u2744\uFE0F Th\u1EE7y / B\u0103ng Tu",
      elements: ["thuy", "bang", "kim"],
      linhCanPham: "thien",
      items: [
        "item.yeu_hoang_huyet_kinh",
        "item.huyet_ma_thien_dao",
        "item.canh_kim_chan_kinh",
        "item.truong_sinh_chan_kinh",
        "item.thai_am_han_kinh",
        "item.bat_diet_kim_than",
        "item.huyen_vu_chan_kinh",
        "item.bat_chiet_kiem",
        "item.thai_co_long_lan",
        "item.doan_thien_chien_ky",
        "item.nghich_lan_thuan",
        "item.toai_thien_kiem",
        "item.tru_tien_kiem",
        "item.dai_phan_thien_chung"
      ]
    },
    moc: {
      name: "\u{1F33F} M\u1ED9c Tu / Tr\u01B0\u1EDDng Sinh",
      elements: ["moc", "phong", "thuy"],
      linhCanPham: "thien",
      items: [
        "item.truong_sinh_chan_kinh",
        "item.cuu_thien_cuong_phong",
        "item.con_bang_chan_quyet",
        "item.kien_moc_thien_kinh",
        "item.huyen_vu_chan_kinh",
        "item.thanh_de_truong_xuan_kinh",
        "item.van_thi_doc_vu",
        "item.thai_co_long_lan",
        "item.nghich_lan_thuan",
        "item.van_hon_phien",
        "item.ngoc_tinh_binh",
        "item.tran_hai_than_chuy",
        "item.hoa_long_truong",
        "item.hat_vi_tien"
      ]
    },
    tho: {
      name: "\u26F0\uFE0F Th\u1ED5 Tu / B\u1EA5t Di\u1EC7t",
      elements: ["tho", "hoa", "kim"],
      linhCanPham: "thien",
      items: [
        "item.yeu_hoang_huyet_kinh",
        "item.huyet_ma_thien_dao",
        "item.dai_nhat_phat_an",
        "item.canh_kim_chan_kinh",
        "item.phan_thien_chan_hoa",
        "item.chuc_dung_hoa_dien",
        "item.khon_nguyen_than_kinh",
        "item.bat_chiet_kiem",
        "item.thai_co_long_lan",
        "item.doan_thien_chien_ky",
        "item.toai_thien_kiem",
        "item.tru_tien_kiem",
        "item.dai_phan_thien_chung",
        "item.hon_thien_lang"
      ]
    },
    loi_phong: {
      name: "\u26A1 L\xF4i / Phong Tu (Cu\u1ED3ng B\u1EA1o)",
      elements: ["loi", "phong", "thuy"],
      linhCanPham: "bien_di",
      items: [
        "item.truong_sinh_chan_kinh",
        "item.thien_loi_chinh_phap",
        "item.cuu_thien_cuong_phong",
        "item.tu_tieu_loi_dien",
        "item.con_bang_chan_quyet",
        "item.huyen_vu_chan_kinh",
        "item.cuu_tieu_ngu_loi_quyet",
        "item.thai_co_long_lan",
        "item.nghich_lan_thuan",
        "item.van_hon_phien",
        "item.tu_tieu_than_kiem",
        "item.ngoc_tinh_binh",
        "item.tran_hai_than_chuy",
        "item.hoa_long_truong"
      ]
    },
    toan_nang: {
      name: "\u{1F31F} To\xE0n N\u0103ng Th\u1EA7n C\u1EA5p (Top Ph\u1EA9m 8)",
      elements: ["kim", "moc", "thuy", "hoa", "tho", "bang", "phong", "loi"],
      linhCanPham: "thien",
      items: [
        "item.luan_hoi_chan_kinh",
        "item.yeu_hoang_huyet_kinh",
        "item.phong_thien_an",
        "item.ngu_to_hop_dao_quyet",
        "item.thien_ma_chan_kinh",
        "item.huyet_ma_thien_dao",
        "item.nhu_lai_tang_kinh",
        "item.bat_chiet_kiem",
        "item.tam_sinh_thach",
        "item.thai_co_long_lan",
        "item.doan_thien_chien_ky",
        "item.nghich_lan_thuan",
        "item.van_kiep_hon_dang",
        "item.toai_thien_kiem"
      ]
    },
    ma_dao: {
      name: "\u{1FA78} Huy\u1EBFt Ma / Ma Tu (Ma \u0110\u1EA1o T\u1ED1i Th\u01B0\u1EE3ng)",
      elements: ["hoa", "kim", "thuy"],
      linhCanPham: "bien_di",
      items: [
        "item.thien_ma_chan_kinh",
        "item.huyet_ma_thien_dao",
        "item.huyet_ma_nghich_mach",
        "item.hoa_huyet_dai_phap",
        "item.nhiep_hon_dai_phap",
        "item.yeu_hoang_huyet_kinh",
        "item.cuu_u_am_hoa",
        "item.huyet_ha_phien",
        "item.van_hon_chu",
        "item.nhiep_hon_linh",
        "item.phe_huyet_ma_dao",
        "item.van_doc_phien",
        "item.van_kiep_hon_dang",
        "item.toai_thien_kiem"
      ]
    },
    ngu_linh: {
      name: "\u{1F43E} Ng\u1EF1 Linh / V\u1EA1n Th\xFA (Th\u1EA7n Th\xFA Tri\u1EC1u Ph\u1EE5ng)",
      elements: ["moc", "thuy", "tho"],
      linhCanPham: "thien",
      items: [
        "item.van_thu_trieu_phong",
        "item.kien_moc_thien_kinh",
        "item.truong_sinh_chan_kinh",
        "item.thanh_de_truong_xuan_kinh",
        "item.huyen_vu_chan_kinh",
        "item.yeu_hoang_huyet_kinh",
        "item.ngu_to_hop_dao_quyet",
        "item.ngu_thu_hoan",
        "item.ngu_thu_lenh",
        "item.van_yeu_phien",
        "item.thanh_moc_tu_linh_chau",
        "item.thai_co_long_lan",
        "item.hon_thien_lang",
        "item.nghich_lan_thuan"
      ]
    },
    luyen_thi: {
      name: "\u{1F9DF} Thi Kh\xF4i / Qu\u1EF7 \u0110\u1EA1o (Luy\u1EC7n Thi & C\xE2u H\u1ED3n)",
      elements: ["tho", "kim", "bang"],
      linhCanPham: "bien_di",
      items: [
        "item.thiet_thi_khoi",
        "item.cuong_thi_tuong",
        "item.nhiep_hon_dai_phap",
        "item.bat_diet_kim_than",
        "item.huyen_vu_chan_kinh",
        "item.khon_nguyen_than_kinh",
        "item.luan_hoi_chan_kinh",
        "item.nhan_cu",
        "item.thi_khoi_hach",
        "item.hu_linh_phach",
        "item.ban_son_an",
        "item.nghich_lan_thuan",
        "item.thai_co_long_lan",
        "item.van_kiep_hon_dang"
      ]
    }
  };
  function autoOptimizeFromBag() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return false;
    }
    const nv = copyObj(state.run.nhanVat);
    const tuiDo = copyObj(nv.tuiDo || {});
    const layout = getMeridianLayout(nv.theChat || "the_chat.pham_the");
    const candidateItems = [];
    for (const itemId in tuiDo) {
      if (tuiDo[itemId] > 0) {
        const info = getItemInfo(itemId);
        if (info.isShaped && info.hinh && info.hinh.length) {
          candidateItems.push(info);
        }
      }
    }
    if (candidateItems.length === 0) {
      notify("\u26A0\uFE0F Trong t\xFAi ch\u01B0a c\xF3 c\xF4ng ph\xE1p ho\u1EB7c ph\xE1p kh\xED c\xF3 m\u1EA3nh gh\xE9p \u0111\u1EC3 b\u1ED1 tr\xED!");
      return false;
    }
    const placed = packShards(layout, candidateItems, 10);
    if (placed.length === 0) {
      notify("\u26A0\uFE0F Kh\xF4ng t\xECm \u0111\u01B0\u1EE3c v\u1ECB tr\xED h\u1EE3p l\u1EC7 k\u1EBFt n\u1ED1i v\u1EDBi \u0110an \u0110i\u1EC1n cho c\xE1c m\u1EA3nh hi\u1EC7n c\xF3!");
      return false;
    }
    const oldKm = copyObj(nv.kinhMach || {});
    const totalCells = layout.rong * layout.cao;
    const mau = oldKm.mau && oldKm.mau.length === totalCells ? [...oldKm.mau] : new Array(totalCells).fill("vo_sac");
    const trangThai = new Array(totalCells).fill("an");
    for (let i = 0; i < totalCells; i++) {
      if (layout.vung[i] >= 0) {
        trangThai[i] = "thong";
      }
    }
    placed.forEach((p) => {
      p.cells.forEach((idx) => {
        mau[idx] = p.element;
      });
    });
    const newManh = placed.map((p) => ({
      item: p.item,
      x: p.x,
      y: p.y,
      xoay: p.xoay
    }));
    oldKm.manh = newManh;
    oldKm.mau = mau;
    oldKm.trangThai = trangThai;
    oldKm.cho = { mo: 99, doiMau: 99 };
    nv.kinhMach = oldKm;
    const currentTrangBi = copyObj(nv.trangBi || {});
    const allAvailable = getAllAvailableItems();
    const slotItems = {
      tru_vat: [],
      di_hoa: [],
      luyen_dan: [],
      che_phu: [],
      luyen_bao: [],
      di_lai: []
    };
    allAvailable.forEach((it) => {
      if ((tuiDo[it.id] || 0) > 0) {
        if (it.cat === "tru_vat") slotItems.tru_vat.push(it);
        else if (it.cat === "di_hoa") slotItems.di_hoa.push(it);
        else if (it.cat === "dung_cu") {
          if (it.id.includes("dan_lo")) slotItems.luyen_dan.push(it);
          else if (it.id.includes("phu_but")) slotItems.che_phu.push(it);
          else if (it.id.includes("khi_lo")) slotItems.luyen_bao.push(it);
        } else if (it.cat === "phuong_tien") slotItems.di_lai.push(it);
      }
    });
    for (const slotKey in slotItems) {
      const list = slotItems[slotKey].sort((a, b) => b.quality - a.quality);
      if (list.length > 0) {
        currentTrangBi[slotKey] = list[0].id;
      }
    }
    nv.trangBi = currentTrangBi;
    const nextRun = copyObj(state.run);
    nextRun.nhanVat = nv;
    setGameState({ run: nextRun });
    persistGameSave(nextRun);
    const ev = evaluatePlacedShards(layout, placed);
    notify(`\u26A1 B\u1ED1 tr\xED ${ev.thong}/${ev.total} m\u1EA3nh th\xF4ng m\u1EA1ch (${ev.green} vi\u1EC1n t\u01B0\u01A1ng sinh, ${ev.red} vi\u1EC1n kh\u1EAFc) & trang b\u1ECB 6 m\xF3n \u0111\u1ED3 t\u1EEB t\xFAi!`);
    return true;
  }
  function applyElementalBuild(buildKey) {
    const build = ELEMENT_BUILDS[buildKey];
    if (!build) {
      notify("\u26A0\uFE0F Kh\xF4ng t\xECm th\u1EA5y c\u1EA5u h\xECnh h\u1EC7 n\xE0y!");
      return false;
    }
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return false;
    }
    const nv = copyObj(state.run.nhanVat);
    const tuiDo = copyObj(nv.tuiDo || {});
    const layout = getMeridianLayout(nv.theChat || "the_chat.pham_the");
    build.items.forEach((id) => {
      tuiDo[id] = Math.max(tuiDo[id] || 0, 1);
    });
    const currentTrangBi = copyObj(nv.trangBi || {});
    for (const [slot, id] of Object.entries(TOP_EQUIPMENT)) {
      tuiDo[id] = Math.max(tuiDo[id] || 0, 1);
      currentTrangBi[slot] = id;
    }
    nv.trangBi = currentTrangBi;
    const candidateItems = build.items.map((id) => getItemInfo(id)).filter((it) => it.isShaped);
    const placed = packShards(layout, candidateItems, 10);
    const totalCells = layout.rong * layout.cao;
    const primaryEl = build.elements[0] || "kim";
    const mau = new Array(totalCells).fill(primaryEl);
    const trangThai = new Array(totalCells).fill("an");
    for (let i = 0; i < totalCells; i++) {
      if (layout.vung[i] >= 0) {
        trangThai[i] = "thong";
      }
    }
    placed.forEach((p) => {
      p.cells.forEach((idx) => {
        mau[idx] = p.element;
      });
    });
    const oldKm = copyObj(nv.kinhMach || {});
    oldKm.manh = placed.map((p) => ({
      item: p.item,
      x: p.x,
      y: p.y,
      xoay: p.xoay
    }));
    oldKm.mau = mau;
    oldKm.trangThai = trangThai;
    oldKm.cho = { mo: 99, doiMau: 99 };
    nv.kinhMach = oldKm;
    nv.linhCan = {
      pham: build.linhCanPham || "thien",
      he: [...build.elements]
    };
    nv.tuiDo = tuiDo;
    nv.oTuiThem = Math.max(nv.oTuiThem || 0, Object.keys(tuiDo).length + 80);
    nv.xepTui = buildSyncedXepTui(nv.xepTui, tuiDo);
    const nextRun = copyObj(state.run);
    nextRun.nhanVat = nv;
    setGameState({ run: nextRun });
    persistGameSave(nextRun);
    const ev = evaluatePlacedShards(layout, placed);
    notify(`\u{1F680} \u0110\xE3 \xE1p d\u1EE5ng ${build.name}: ${ev.thong}/${ev.total} m\u1EA3nh th\xF4ng m\u1EA1ch (${ev.green} vi\u1EC1n t\u01B0\u01A1ng sinh, 0 vi\u1EC1n kh\u1EAFc)!`);
    return true;
  }

  // src/data/recipes.ts
  var FALLBACK_RECIPES = [
    {
      "id": "dp.hoi_xuan_dan",
      "nghe": "luyen_dan",
      "ten": "H\u1ED3i Xu\xE2n \u0110an ph\u01B0\u01A1ng",
      "ra": "item.hoi_xuan_dan",
      "chu": [
        {
          "id": "item.son_sam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 2,
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng nh\u1EADp m\xF4n, th\u1EA7y lang n\xE0o c\u0169ng thu\u1ED9c. S\xE2m n\xFAi ph\u1EA3i ninh l\u1EEDa nh\u1ECF, l\u1EEDa to th\xEC d\u01B0\u1EE3c t\xEDnh bay h\u1EBFt."
    },
    {
      "id": "dp.bo_khi_dan",
      "nghe": "luyen_dan",
      "ten": "B\u1ED5 Kh\xED \u0110an ph\u01B0\u01A1ng",
      "ra": "item.bo_khi_dan",
      "chu": [
        {
          "id": "item.thanh_tam_thao",
          "so": 1
        }
      ],
      "phu": [],
      "mo_ta": "M\u1ED9t v\u1ECB Thanh T\xE2m Th\u1EA3o, kh\xF4ng k\xE9n l\u1EEDa. \u0110an \u0111\u1ED3 th\u01B0\u1EDDng luy\u1EC7n \u0111\u01A1n n\xE0y t\u1EDBi m\xF2n tay \u0111\u1EC3 t\u1EADp canh l\xF2."
    },
    {
      "id": "dp.sinh_co_dan",
      "nghe": "luyen_dan",
      "ten": "Sinh C\u01A1 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.sinh_co_dan",
      "chu": [
        {
          "id": "item.huyet_linh_chi",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "pham": 2,
          "so": 1
        }
      ],
      "hoa": "van",
      "mo_ta": "Huy\u1EBFt Linh Chi l\xE0m ch\u1EE7, th\xEAm m\u1ED9t v\u1ECB linh d\u01B0\u1EE3c h\u1EC7 m\u1ED9c l\xE0m ph\u1EE5. Ph\u1EA3i l\u1EEDa v\u0103n \u1EE7 ba ng\xE0y, n\xF3ng v\u1ED9i th\xEC \u0111an n\u1EE9t."
    },
    {
      "id": "dp.tu_linh_dan",
      "nghe": "luyen_dan",
      "ten": "T\u1EE5 Linh \u0110an ph\u01B0\u01A1ng",
      "ra": "item.tu_linh_dan",
      "chu": [
        {
          "id": "item.yeu_dan_1",
          "so": 3
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "L\u1EA5y y\xEAu \u0111an l\xE0m l\xF5i. V\u1ECF y\xEAu \u0111an c\u1EE9ng, ph\u1EA3i m\xE3nh h\u1ECFa m\u1EDBi ph\xE1 \u0111\u01B0\u1EE3c, linh kh\xED b\xEAn trong m\u1EDBi ch\u1ECBu tan ra."
    },
    {
      "id": "dp.bao_huyet_dan",
      "nghe": "luyen_dan",
      "ten": "B\u1EA1o Huy\u1EBFt \u0110an ph\u01B0\u01A1ng",
      "ra": "item.bao_huyet_dan",
      "chu": [
        {
          "id": "item.huyet_linh_chi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "C\xF9ng m\u1ED9t v\u1ECB Huy\u1EBFt Linh Chi v\u1EDBi Sinh C\u01A1 \u0110an, nh\u01B0ng \u0111\u1ED1t b\u1EB1ng l\u1EEDa v\u0169 cho huy\u1EBFt kh\xED s\xF4i l\xEAn. \u0110an ra \u0111\u1ECF nh\u01B0 than h\u1ED3ng."
    },
    {
      "id": "dp.truc_co_dan",
      "nghe": "luyen_dan",
      "ten": "Tr\xFAc C\u01A1 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.truc_co_dan",
      "chu": [
        {
          "id": "item.huyet_linh_chi",
          "so": 1
        },
        {
          "id": "item.thanh_tam_thao",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng t\xF4ng m\xF4n gi\u1EEF k\xEDn, kh\xF4ng truy\u1EC1n ra ph\u01B0\u1EDDng th\u1ECB. M\u1ED7i l\xF2 ch\u1EC9 ra m\u1ED9t vi\xEAn, may l\u1EAFm m\u1EDBi \u0111\u01B0\u1EE3c hai."
    },
    {
      "id": "dp.kim_sang_duoc",
      "nghe": "luyen_dan",
      "ten": "Kim Sang D\u01B0\u1EE3c ph\u01B0\u01A1ng",
      "ra": "item.kim_sang_duoc",
      "chu": [
        {
          "id": "item.sa_can_thao",
          "so": 1
        }
      ],
      "phu": [],
      "mo_ta": "R\u1EC5 c\u1ECF c\xE1t gi\xE3 n\xE1t, sao kh\xF4, t\xE1n b\u1ED9t. Kh\xF4ng k\xE9n l\u1EEDa, ch\u1EC9 k\xE9n tay, gi\xE3 kh\xF4ng nhuy\u1EC5n th\xEC r\u1EAFc v\xE0o v\u1EBFt th\u01B0\u01A1ng th\u1EA5y x\xF3t."
    },
    {
      "id": "dp.hoi_xuan_dan_thuy",
      "nghe": "luyen_dan",
      "ten": "H\u1ED3i Xu\xE2n \u0110an ph\u01B0\u01A1ng (s\u01B0\u01A1ng sen)",
      "ra": "item.hoi_xuan_dan",
      "chu": [
        {
          "id": "item.ha_diep_suong",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 2,
      "mo_ta": "B\u1EA3n \u0111\u01A1n ph\u01B0\u01A1ng c\u1EE7a d\xE2n v\u1EA1n ch\xE0i, l\u1EA5y s\u01B0\u01A1ng l\xE1 sen thay s\xE2m n\xFAi. L\u1EEDa ph\u1EA3i nh\u1ECF h\u01A1n c\u1EA3 \u0111om \u0111\xF3m, s\u01B0\u01A1ng g\u1EB7p n\xF3ng l\xE0 bay."
    },
    {
      "id": "dp.bo_khi_dan_cot",
      "nghe": "luyen_dan",
      "ten": "B\u1ED5 Kh\xED \u0110an ph\u01B0\u01A1ng (c\u1ED1t hoa)",
      "ra": "item.bo_khi_dan",
      "chu": [
        {
          "id": "item.bach_cot_hoa",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 3,
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng c\u1EE7a th\u1EE3 s\u0103n Lang Hoang, d\xF9ng hoa m\u1ECDc tr\xEAn x\u01B0\u01A1ng y\xEAu. Ph\u1EA3i \u0111\u1ED1t l\u1EEDa m\u1EA1nh cho tan \xE2m kh\xED, kh\xF4ng th\xEC u\u1ED1ng v\xE0o l\u1EA1nh b\u1EE5ng."
    },
    {
      "id": "dp.bao_huyet_dan_mac",
      "nghe": "luyen_dan",
      "ten": "B\u1EA1o Huy\u1EBFt \u0110an ph\u01B0\u01A1ng (m\u1EA1c \u0111\u1EB1ng)",
      "ra": "item.bao_huyet_dan",
      "chu": [
        {
          "id": "item.hoa_mac_dang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng c\u1EE7a \u0111\u1ED9i l\u1EA1c \u0111\xE0 v\u01B0\u1EE3t sa m\u1EA1c. D\xE2y \u0111\u1EB1ng \u0111\xE3 mang l\u1EEDa s\u1EB5n, th\xEAm l\u1EEDa v\u0169 n\u1EEFa th\xEC \u0111an d\u1EC5 n\u1ED5 l\xF2."
    },
    {
      "id": "dp.thong_mach_dan",
      "nghe": "luyen_dan",
      "ten": "Th\xF4ng M\u1EA1ch \u0110an ph\u01B0\u01A1ng",
      "ra": "item.thong_mach_dan",
      "chu": [
        {
          "id": "item.kim_mach_dao",
          "so": 1
        },
        {
          "id": "item.mach_hoa_thao",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 6,
      "mo_ta": "H\u1EA1t l\xFAa kim s\u1EAFc l\xE0m m\u0169i nh\u1ECDn, hoa d\u1EA1i l\xE0m ch\u1EA5t d\u1EABn. Ph\u1EA3i d\xF9ng l\u1EEDa m\u1EA1nh cho h\u1EA1t m\u1EC1m ra, l\u1EEDa y\u1EBFu th\xEC \u0111an c\xF2n gai, u\u1ED1ng v\xE0o \u0111\xE2m kinh m\u1EA1ch."
    },
    {
      "id": "dp.tay_tuy_dan",
      "nghe": "luyen_dan",
      "ten": "T\u1EA9y T\u1EE7y \u0110an ph\u01B0\u01A1ng",
      "ra": "item.tay_tuy_dan",
      "chu": [
        {
          "id": "item.loi_sa_hoa",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 8,
      "mo_ta": "D\xF9ng hoa tr\xFAng s\xE9t \u0111\u1EC3 ph\u1EA1t t\u1EE7y. L\u1EEDa ph\u1EA3i g\u1EA5p, hoa g\u1EB7p l\u1EEDa ch\u1EADm s\u1EBD t\u1EAFt d\u01B0 l\xF4i, \u0111an ra ch\u1EC9 c\xF2n l\xE0 c\xE1nh hoa kh\xF4."
    },
    {
      "id": "dp.thanh_tam_dan",
      "nghe": "luyen_dan",
      "ten": "Thanh T\xE2m \u0110an ph\u01B0\u01A1ng",
      "ra": "item.thanh_tam_dan",
      "chu": [
        {
          "id": "item.thanh_tam_thao",
          "so": 2
        },
        {
          "id": "item.thuy_tien_can",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 8,
      "mo_ta": "C\u1ECF t\u0129nh t\xE2m th\xEAm c\u1EE7 th\u1EE7y ti\xEAn ng\xE2m l\u1EA1nh. Ng\u01B0\u1EDDi luy\u1EC7n m\xE0 n\xF3ng l\xF2ng th\xEC \u0111an c\u0169ng n\xF3ng, \u0111\xFAng c\xE1i b\u1EC7nh n\xF3 \u0111\u1ECBnh ch\u1EEFa."
    },
    {
      "id": "dp.tuc_mach_cao",
      "nghe": "luyen_dan",
      "ten": "T\u1EE5c M\u1EA1ch Cao ph\u01B0\u01A1ng",
      "ra": "item.tuc_mach_cao",
      "chu": [
        {
          "id": "item.tung_tam_chi",
          "so": 1
        },
        {
          "id": "item.mang_huyet_hoa",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "N\u1EA5m t\xF9ng v\u1EDBi hoa huy\u1EBFt, ninh th\xE0nh cao \u0111\u1EB7c nh\u01B0 nh\u1EF1a. L\u1EEDa v\u0103n \u1EE7 ba ng\xE0y, v\u1EDBt b\u1ECDt \u0111\u1EE7 b\u1EA3y l\u1EA7n, b\u1ECF s\xF3t m\u1ED9t l\u1EA7n l\xE0 cao n\u1ED5i c\u1EB7n."
    },
    {
      "id": "dp.hoan_hon_dan",
      "nghe": "luyen_dan",
      "ten": "Ho\xE0n H\u1ED3n \u0110an ph\u01B0\u01A1ng",
      "ra": "item.hoan_hon_dan",
      "chu": [
        {
          "id": "item.co_moc_tam",
          "so": 1
        },
        {
          "id": "item.mang_huyet_hoa",
          "so": 1
        },
        {
          "id": "item.yeu_dan_2",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "L\xF5i g\u1ED7 gi\xE0 gi\u1EEF h\u1ED3n, hoa huy\u1EBFt gi\u1EEF kh\xED, y\xEAu \u0111an l\xE0m c\u1EA7u n\u1ED1i. Ba v\u1ECB t\xEDnh kh\xE1c nhau, l\u1EEDa ph\u1EA3i \u0111\u1EC1u nh\u01B0 nh\u1ECBp th\u1EDF ng\u01B0\u1EDDi ng\u1EE7."
    },
    {
      "id": "dp.ngung_nguyen_dan",
      "nghe": "luyen_dan",
      "ten": "Ng\u01B0ng Nguy\xEAn \u0110an ph\u01B0\u01A1ng",
      "ra": "item.ngung_nguyen_dan",
      "chu": [
        {
          "id": "item.tram_uyen_tao",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "Rong v\u1EF1c s\xE2u n\xE9n th\xE0nh gi\u1ECDt th\u1EE7y ng\xE2n. L\u1EEDa v\u0103n, l\u1EEDa n\xE0o m\u1EA1nh qu\xE1 l\xE0 rong cu\u1ED9n l\u1EA1i th\xE0nh c\u1EE5c, kh\xF4ng tan n\u1EEFa."
    },
    {
      "id": "dp.duyen_tho_dan",
      "nghe": "luyen_dan",
      "ten": "Duy\xEAn Th\u1ECD \u0110an ph\u01B0\u01A1ng",
      "ra": "item.duyen_tho_dan",
      "chu": [
        {
          "id": "item.co_moc_tam",
          "so": 1
        },
        {
          "id": "item.kim_tue_mach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng c\u1EE7a \u0111an ph\xF2ng c\xE1c \u0111\u1EA1i t\xF4ng, ng\u01B0\u1EDDi ngo\xE0i c\u1EA7u c\u1EA3 \u0111\u1EDDi kh\xF4ng \u0111\u01B0\u1EE3c. L\xF5i c\xE2y s\u1ED1ng qua ba tri\u1EC1u, b\xF4ng l\xFAa m\u1ECDc xuy\xEAn b\u0103ng, l\u1EEDa v\u0103n ph\u1EA3i gi\u1EEF su\u1ED1t b\u1EA3y ng\xE0y b\u1EA3y \u0111\xEAm."
    },
    {
      "id": "dp.ket_kim_dan",
      "nghe": "luyen_dan",
      "ten": "K\u1EBFt Kim \u0110an ph\u01B0\u01A1ng",
      "ra": "item.ket_kim_dan",
      "chu": [
        {
          "id": "item.tu_nham_hoa",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 40,
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng t\xF4ng m\xF4n ch\u1EC9 trao cho \u0111\u1EC7 t\u1EED \u0111\xE3 s\u1EAFp K\u1EBFt \u0110an. Hoa \u0111\xE1 kh\xF3 th\u1EA5m l\u1EEDa, l\u1EEDa v\u0103n ph\u1EA3i nung l\xE2u cho th\u1EA5u t\u1EADn l\xF5i, v\u1ED9i m\u1ED9t kh\u1EAFc l\xE0 h\u1ECFng c\u1EA3 l\xF2."
    },
    {
      "id": "dp.duong_anh_dan",
      "nghe": "luyen_dan",
      "ten": "D\u01B0\u1EE1ng Anh \u0110an ph\u01B0\u01A1ng",
      "ra": "item.duong_anh_dan",
      "chu": [
        {
          "id": "item.giao_chau_lien",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "tho"
          ],
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "H\u1EA1t sen giao l\xE0m ch\u1EE7, m\u1ED9t v\u1ECB th\u1ED5 linh d\u01B0\u1EE3c l\xE0m n\u1EC1n \u0111\u1EC3 gi\u1EEF anh kh\u1ECFi tr\xF4i. Ph\u1EA3i l\xE0 \u0110an t\xF4ng s\u01B0 m\u1EDBi d\xE1m nh\xF3m l\xF2, l\u1EEDa l\u1EC7ch m\u1ED9t t\u01A1 l\xE0 u\u1ED5ng c\u1EA3 h\u1EA1t sen."
    },
    {
      "id": "dp.cuu_chuyen_kim_dan",
      "nghe": "luyen_dan",
      "ten": "C\u1EEDu Chuy\u1EC3n Kim \u0110an ph\u01B0\u01A1ng",
      "ra": "item.cuu_chuyen_kim_dan",
      "chu": [
        {
          "id": "item.van_nien_tung_chi",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "hoa"
          ],
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 50,
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng c\u1ED5 truy\u1EC1n t\u1EEB tr\u01B0\u1EDBc Thi\xEAn M\xF4n kh\xE9p, n\xE9t ch\u1EEF \u0111\xE3 nh\xF2e \u1EDF hai ch\u1ED7. Luy\u1EC7n ch\xEDn l\u1EA7n, m\u1ED7i l\u1EA7n \u0111\u1ED5i l\u1EEDa m\u1ED9t nh\u1ECBp, ng\u01B0\u1EDDi n\xE0o \u0111\u1EE9t h\u01A1i gi\u1EEFa ch\u1EEBng th\xEC l\xF2 h\u1ECFng."
    },
    {
      "id": "dp.pha_chuong_dan",
      "nghe": "luyen_dan",
      "ten": "Ph\xE1 Ch\u01B0\u1EDBng \u0110an ph\u01B0\u01A1ng",
      "ra": "item.pha_chuong_dan",
      "chu": [
        {
          "id": "item.khai_khieu_chau",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 20,
      "mo_ta": "M\u1ED9t h\u1EA1t Khai Khi\u1EBFu Ch\xE2u, l\u1EEDa v\u0169 nung cho v\u1ECF ch\xE2u n\u1EE9t r\u1ED3i m\u1EDBi h\u1EA1 l\u1EEDa. V\u1ECF ch\u01B0a n\u1EE9t m\xE0 h\u1EA1 l\u1EEDa th\xEC \u0111an ra ch\u1EC9 l\xE0 h\xF2n s\u1ECFi."
    },
    {
      "id": "dp.toai_bich_dan",
      "nghe": "luyen_dan",
      "ten": "To\xE1i B\xEDch \u0110an ph\u01B0\u01A1ng",
      "ra": "item.toai_bich_dan",
      "chu": [
        {
          "id": "item.xuyen_bich_giac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 60,
      "mo_ta": "S\u1EEBng Xuy\xEAn B\xEDch m\xE0i th\xE0nh b\u1ED9t, l\u1EEDa v\u0169 \u0111\u1ED1t ba ng\xE0y cho b\u1ED9t ch\u1EA3y th\xE0nh n\u01B0\u1EDBc \u0111\xE1. L\xF2 ph\u1EA3i d\xE0y, s\u1EEBng c\xF2n gi\u1EEF s\u1EE9c h\xFAc, l\xF2 m\u1ECFng l\xE0 th\u1EE7ng."
    },
    {
      "id": "dp.thong_huyen_dan",
      "nghe": "luyen_dan",
      "ten": "Th\xF4ng Huy\u1EC1n \u0110an ph\u01B0\u01A1ng",
      "ra": "item.thong_huyen_dan",
      "chu": [
        {
          "id": "item.huyen_quan_tuy",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "M\u1ED9t gi\u1ECDt Huy\u1EC1n Quan T\u1EE7y, l\u1EEDa v\u0103n \u1EE7 b\u1ED1n m\u01B0\u01A1i ch\xEDn ng\xE0y cho t\u1EE7y k\u1EBFt th\xE0nh s\u1EE3i. L\u1EEDa m\u1EA1nh th\xEC s\u1EE3i \u0111\u1EE9t, \u0111an ra ch\u1EC9 c\xF2n m\xE0u t\xEDm."
    },
    {
      "id": "dp.pha_hu_dan",
      "nghe": "luyen_dan",
      "ten": "Ph\xE1 H\u01B0 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.pha_hu_dan",
      "chu": [
        {
          "id": "item.hu_linh_phach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "M\u1EDF h\u1ED9p ng\u1ECDc ngay tr\xEAn mi\u1EC7ng l\xF2 cho H\u01B0 Linh Ph\xE1ch r\u01A1i v\xE0o, ch\u1EADm m\u1ED9t h\u01A1i l\xE0 n\xF3 tan m\u1EA5t. L\u1EEDa v\u0103n gi\u1EEF ba th\xE1ng, kh\xF4ng \u0111\u01B0\u1EE3c nh\xECn v\xE0o l\xF2."
    },
    {
      "id": "dp.on_co_dan",
      "nghe": "luyen_dan",
      "ten": "\xD4n C\u01A1 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.on_co_dan",
      "chu": [
        {
          "id": "item.huyet_linh_chi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "M\u1ED9t c\xE2y Huy\u1EBFt Linh Chi, l\u1EEDa v\u0103n liu riu cho nh\u1EF1a \u0111\u1ECF ch\u1EA3y h\u1EBFt v\xE0o l\xF5i. L\u1EEDa to th\xEC nh\u1EF1a ch\xE1y kh\xE9t, \u0111an \u0111\u1EAFng m\xE0 v\xF4 d\u1EE5ng."
    },
    {
      "id": "dp.bo_khuyet_dan",
      "nghe": "luyen_dan",
      "ten": "B\u1ED5 Khuy\u1EBFt \u0110an ph\u01B0\u01A1ng",
      "ra": "item.bo_khuyet_dan",
      "chu": [
        {
          "id": "item.co_moc_tam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "M\u1ED9t kh\xFAc C\u1ED5 M\u1ED9c T\xE2m nghi\u1EC1n nh\u1ECF, l\u1EEDa v\u0103n hun \u0111\u1EBFn khi b\u1ED9t d\xEDnh th\xE0nh keo. Keo c\xF2n r\u1EDDi l\xE0 ch\u01B0a \u0111\u1EE7 l\u1EEDa, \u0111an ra kh\xF4ng v\xE1 n\u1ED5i ch\u1ED7 n\u1EE9t."
    },
    {
      "id": "dp.hoan_nguyen_dan",
      "nghe": "luyen_dan",
      "ten": "Ho\xE0n Nguy\xEAn \u0110an ph\u01B0\u01A1ng",
      "ra": "item.hoan_nguyen_dan",
      "chu": [
        {
          "id": "item.thien_nien_ha_thu_o",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "tho"
          ],
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 80,
      "mo_ta": "Thi\xEAn Ni\xEAn H\xE0 Th\u1EE7 \xD4 l\xE0m ch\u1EE7, m\u1ED9t v\u1ECB th\u1ED5 linh d\u01B0\u1EE3c gi\u1EEF cho d\u01B0\u1EE3c l\u1EF1c l\u1EAFng xu\u1ED1ng. L\u1EEDa v\u0103n \u1EE7 ba m\u01B0\u01A1i s\xE1u ng\xE0y, m\u1EDF l\xF2 s\u1EDBm m\u1ED9t ng\xE0y l\xE0 \u0111an v\u1EE1."
    },
    {
      "id": "dp.bo_thien_dan",
      "nghe": "luyen_dan",
      "ten": "B\u1ED5 Thi\xEAn \u0110an ph\u01B0\u01A1ng",
      "ra": "item.bo_thien_dan",
      "chu": [
        {
          "id": "item.that_khieu_linh_ngau",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "Th\u1EA5t Khi\u1EBFu Linh Ng\u1EABu b\u1ECF nguy\xEAn c\u1EE7 v\xE0o l\xF2, l\u1EEDa v\u0103n th\u1ED5i qua b\u1EA3y l\u1ED7 cho ti\u1EBFng s\xE1o \u0111\u1EC1u. Gi\u1EEF tr\u0103m ng\xE0y, ti\u1EBFng s\xE1o t\u1EAFt gi\u1EEFa ch\u1EEBng l\xE0 h\u1ECFng c\u1EA3 l\xF2."
    },
    {
      "id": "dp.tich_doc_dan",
      "nghe": "luyen_dan",
      "ten": "T\u1ECBch \u0110\u1ED9c \u0110an ph\u01B0\u01A1ng",
      "ra": "item.tich_doc_dan",
      "chu": [
        {
          "id": "item.thiem_to",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 3,
      "mo_ta": "M\u1ED9t gi\u1ECDt m\u1EE7 c\xF3c pha v\xE0o n\u01B0\u1EDBc thu\u1ED1c, l\u1EEDa v\u0103n ninh t\u1EDBi khi h\u1EBFt m\xF9i h\u1EAFc. C\xF2n m\xF9i m\xE0 \u0111\xE3 v\xEA vi\xEAn th\xEC \u0111an th\xE0nh thu\u1ED1c \u0111\u1ED9c."
    },
    {
      "id": "dp.trang_dam_dan",
      "nghe": "luyen_dan",
      "ten": "Tr\xE1ng \u0110\u1EA3m \u0110an ph\u01B0\u01A1ng",
      "ra": "item.trang_dam_dan",
      "chu": [
        {
          "id": "item.hung_dam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 4,
      "mo_ta": "\u0110\u01A1n c\u1EE7a th\u1EA7y lang Vi\xEAm Qu\u1ED1c. M\u1EADt g\u1EA5u kh\xF4 c\u1EE9ng nh\u01B0 \u0111\xE1, ph\u1EA3i v\u0169 h\u1ECFa n\u01B0\u1EDBng cho n\u1EE9t r\u1ED3i m\u1EDBi ninh."
    },
    {
      "id": "dp.thanh_vu_dan",
      "nghe": "luyen_dan",
      "ten": "Thanh V\u1EE5 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.thanh_vu_dan",
      "chu": [
        {
          "id": "item.thanh_vu_tra",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 2,
      "mo_ta": "\u0110\u01A1n c\u1EE7a tr\xE0 trang, c\xF4 m\u1ED9t v\xF2 Thanh V\u1EE5 tr\xE0 th\xE0nh hai vi\xEAn. L\u1EEDa to th\xEC tr\xE0 kh\xE9t, \u0111an ra \u0111\u1EAFng m\xE0 kh\xF4ng c\xF2n t\xE1c d\u1EE5ng."
    },
    {
      "id": "dp.tuy_ha_dan",
      "nghe": "luyen_dan",
      "ten": "T\xFAy H\xE0 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.tuy_ha_dan",
      "chu": [
        {
          "id": "item.bach_hoa_tuu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 2,
      "mo_ta": "\u0110\u01A1n c\u1EE7a t\u1EEDu ph\u01B0\u1EDDng, n\u1EA5u B\xE1ch Hoa t\u1EEDu b\u1EB1ng l\u1EEDa m\u1EA1nh cho bay h\u1EBFt h\u01A1i r\u01B0\u1EE3u, gi\u1EEF l\u1EA1i men linh kh\xED. L\u1EEDa nh\u1ECF th\xEC \u0111an ra c\xF2n say."
    },
    {
      "id": "dp.bach_giai_dan",
      "nghe": "luyen_dan",
      "ten": "B\xE1ch Gi\u1EA3i \u0110an ph\u01B0\u01A1ng",
      "ra": "item.bach_giai_dan",
      "chu": [
        {
          "id": "item.xa_dam",
          "so": 1
        },
        {
          "id": "item.hat_doc_nang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 5,
      "mo_ta": "L\u1EA5y \u0111\u1ED9c c\xF4ng \u0111\u1ED9c: n\u1ECDc b\u1ECD c\u1EA1p m\u1EDF \u0111\u01B0\u1EDDng, m\u1EADt r\u1EAFn theo sau m\xE0 gi\u1EA3i. L\u1EEDa v\u0103n, th\u1EE9 t\u1EF1 b\u1ECF thu\u1ED1c sai m\u1ED9t b\u01B0\u1EDBc l\xE0 luy\u1EC7n ra \u0111\u1ED9c d\u01B0\u1EE3c."
    },
    {
      "id": "dp.dinh_than_dan",
      "nghe": "luyen_dan",
      "ten": "\u0110\u1ECBnh Th\u1EA7n \u0110an ph\u01B0\u01A1ng",
      "ra": "item.dinh_than_dan",
      "chu": [
        {
          "id": "item.vien_tam_huyet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 5,
      "mo_ta": "\u0110\u01A1n do m\u1ED9t v\u1ECB s\u01B0 ch\xF9a Kim C\u01B0\u01A1ng ch\xE9p l\u1EA1i. T\xE2m huy\u1EBFt v\u01B0\u1EE3n g\u1EB7p l\u1EEDa m\u1EA1nh th\xEC s\xF4i, \u0111an ra l\xE0m ng\u01B0\u1EDDi u\u1ED1ng n\xF3ng n\u1EA3y h\u01A1n tr\u01B0\u1EDBc."
    },
    {
      "id": "dp.bang_phach_dan",
      "nghe": "luyen_dan",
      "ten": "B\u0103ng Ph\xE1ch \u0110an ph\u01B0\u01A1ng",
      "ra": "item.bang_phach_dan",
      "chu": [
        {
          "id": "item.bang_phach_lien",
          "so": 2
        },
        {
          "id": "item.ngu_chau",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "Sen b\u0103ng l\xE0m ch\u1EE7, ng\u01B0 ch\xE2u gi\u1EEF h\xE0n kh\xED kh\u1ECFi tan. L\u1EEDa ph\u1EA3i nh\u1ECF m\xE0 \u0111\u1EC1u, l\xF2 n\xF3ng qu\xE1 th\xEC sen ch\u1EA3y th\xE0nh n\u01B0\u1EDBc l\xE3."
    },
    {
      "id": "dp.duong_khi_dan",
      "nghe": "luyen_dan",
      "ten": "D\u01B0\u1EE1ng Kh\xED \u0110an ph\u01B0\u01A1ng",
      "ra": "item.duong_khi_dan",
      "chu": [
        {
          "id": "item.son_sam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 2,
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng c\u1EE7a ng\u01B0\u1EDDi gi\u1EEF ch\xF9a, ch\xE9p cho k\u1EBB mu\u1ED1n t\u1EADp ng\u1ED3i thi\u1EC1n. S\xE2m n\xFAi ninh l\u1EEDa nh\u1ECF t\u1EDBi khi n\u01B0\u1EDBc \u0111\u1EB7c nh\u01B0 m\u1EADt."
    },
    {
      "id": "dp.khai_nguyen_dan",
      "nghe": "luyen_dan",
      "ten": "Khai Nguy\xEAn \u0110an ph\u01B0\u01A1ng",
      "ra": "item.khai_nguyen_dan",
      "chu": [
        {
          "id": "item.thiem_to",
          "so": 1
        },
        {
          "id": "item.thanh_tam_thao",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 4,
      "mo_ta": "M\u1EE7 c\xF3c m\u1EDF kinh, c\u1ECF t\u0129nh t\xE2m gi\u1EEF kh\xED. Ph\u1EA3i ninh t\u1EDBi khi h\u1EBFt m\xF9i h\u1EAFc, c\xF2n m\xF9i th\xEC ng\u01B0\u1EDDi u\u1ED1ng \u0111au b\u1EE5ng ba ng\xE0y."
    },
    {
      "id": "dp.tu_khi_dan",
      "nghe": "luyen_dan",
      "ten": "T\u1EE5 Kh\xED \u0110an ph\u01B0\u01A1ng",
      "ra": "item.tu_khi_dan",
      "chu": [
        {
          "id": "item.mach_hoa_thao",
          "so": 2
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 2,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 4,
      "mo_ta": "Hoa d\u1EA1i l\xE0m n\u1EC1n, m\u1ED9t m\xF3n y\xEAu t\xE0i b\u1EA5t k\u1EF3 l\xE0m l\xF5i gom kh\xED. \u0110an s\u01B0 ph\u01B0\u1EDDng th\u1ECB luy\u1EC7n \u0111\u01A1n n\xE0y nhi\u1EC1u h\u01A1n c\u01A1m \u0103n."
    },
    {
      "id": "dp.ngung_khi_dan",
      "nghe": "luyen_dan",
      "ten": "Ng\u01B0ng Kh\xED \u0110an ph\u01B0\u01A1ng",
      "ra": "item.ngung_khi_dan",
      "chu": [
        {
          "id": "item.hac_vu",
          "so": 1
        },
        {
          "id": "item.thuy_tien_can",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "L\xF4ng h\u1EA1c \u0111\u1ED1t th\xE0nh tro, h\xF2a v\u1EDBi n\u01B0\u1EDBc c\u1EE7 th\u1EE7y ti\xEAn. L\u1EEDa v\u0103n, l\xF2 ph\u1EA3i \u0111\u1EADy k\xEDn, h\u1EDF m\u1ED9t khe l\xE0 linh kh\xED theo kh\xF3i bay m\u1EA5t."
    },
    {
      "id": "dp.boi_nguyen_dan",
      "nghe": "luyen_dan",
      "ten": "B\u1ED3i Nguy\xEAn \u0110an ph\u01B0\u01A1ng",
      "ra": "item.boi_nguyen_dan",
      "chu": [
        {
          "id": "item.kim_tue_mach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "M\u1ED9t b\xF4ng l\xFAa kim tu\u1EC7, l\u1EEDa v\u0103n \u1EE7 \u0111\u1EE7 ch\xEDn ng\xE0y. \u0110\u01A1n d\u1EC5, c\xE1i kh\xF3 l\xE0 ki\u1EBFm \u0111\u01B0\u1EE3c l\xFAa."
    },
    {
      "id": "dp.tinh_nguyen_dan",
      "nghe": "luyen_dan",
      "ten": "Tinh Nguy\xEAn \u0110an ph\u01B0\u01A1ng",
      "ra": "item.tinh_nguyen_dan",
      "chu": [
        {
          "id": "item.giao_long_lan",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "thuy"
          ],
          "pham": 2,
          "so": 1
        }
      ],
      "hoa": "van",
      "mo_ta": "V\u1EA9y giao long ng\xE2m trong n\u01B0\u1EDBc linh d\u01B0\u1EE3c h\u1EC7 th\u1EE7y b\u1EA3y ng\xE0y cho m\u1EC1m r\u1ED3i m\u1EDBi v\xE0o l\xF2. V\u1EA9y ch\u01B0a m\u1EC1m m\xE0 nh\xF3m l\u1EEDa th\xEC n\u1EE9t l\xF2."
    },
    {
      "id": "dp.kim_lo_dan",
      "nghe": "luyen_dan",
      "ten": "Kim L\u1ED9 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.kim_lo_dan",
      "chu": [
        {
          "id": "item.xich_tinh_qua",
          "so": 2
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 20,
      "mo_ta": "Hai qu\u1EA3 x\xEDch tinh \xE9p l\u1EA5y n\u01B0\u1EDBc, m\u1ED9t m\xF3n y\xEAu t\xE0i l\xE0m l\xF5i. L\u1EEDa v\u0169 c\xF4 t\u1EDBi khi m\u1EB7t n\u01B0\u1EDBc n\u1ED5i s\u01B0\u01A1ng v\xE0ng th\xEC t\u1EAFt l\xF2."
    },
    {
      "id": "dp.long_ho_dan",
      "nghe": "luyen_dan",
      "ten": "Long H\u1ED5 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.long_ho_dan",
      "chu": [
        {
          "id": "item.cuu_khuc_hoang_tinh",
          "so": 1
        },
        {
          "id": "item.tu_kim",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 50,
      "mo_ta": "Ho\xE0ng tinh l\xE0m long, t\u1EED kim l\xE0m h\u1ED5. Hai v\u1ECB ph\u1EA3i v\xE0o l\xF2 c\xF9ng m\u1ED9t h\u01A1i th\u1EDF, l\u1EC7ch nhau l\xE0 m\u1ED9t v\u1ECB nu\u1ED1t m\u1EA5t v\u1ECB kia."
    },
    {
      "id": "dp.boi_anh_dan",
      "nghe": "luyen_dan",
      "ten": "B\u1ED3i Anh \u0110an ph\u01B0\u01A1ng",
      "ra": "item.boi_anh_dan",
      "chu": [
        {
          "id": "item.cuu_tue_linh_dao",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "pham": 2,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 80,
      "mo_ta": "\u0110\xE0o ch\xEDn tu\u1EC7 l\xE0m ch\u1EE7, m\u1ED9t v\u1ECB m\u1ED9c linh d\u01B0\u1EE3c d\u1EABn d\u01B0\u1EE3c kh\xED. L\u1EEDa v\u0103n \u1EE7 b\u1ED1n m\u01B0\u01A1i ch\xEDn ng\xE0y, ng\u01B0\u1EDDi canh l\xF2 kh\xF4ng \u0111\u01B0\u1EE3c r\u1EDDi n\u1EEDa b\u01B0\u1EDBc."
    },
    {
      "id": "dp.huyen_anh_dan",
      "nghe": "luyen_dan",
      "ten": "Huy\u1EC1n Anh \u0110an ph\u01B0\u01A1ng",
      "ra": "item.huyen_anh_dan",
      "chu": [
        {
          "id": "item.yeu_vuong_noi_dan",
          "so": 1
        },
        {
          "id": "item.mang_hon_chi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng c\u1ED5, vi\u1EBFt r\u1EB1ng n\u1ED9i \u0111an y\xEAu v\u01B0\u01A1ng c\xF2n gi\u1EEF ch\xFAt linh tr\xED, ph\u1EA3i l\u1EEDa v\u0169 \u0111\u1ED1t s\u1EA1ch r\u1ED3i m\u1EDBi d\xE1m cho nguy\xEAn anh nu\u1ED1t."
    },
    {
      "id": "dp.duong_than_dan",
      "nghe": "luyen_dan",
      "ten": "D\u01B0\u1EE1ng Th\u1EA7n \u0110an ph\u01B0\u01A1ng",
      "ra": "item.duong_than_dan",
      "chu": [
        {
          "id": "item.yeu_vuong_noi_dan",
          "so": 1
        },
        {
          "id": "item.nhat_luan_hoa",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "Hoa m\u1EB7t tr\u1EDDi v\xE0 n\u1ED9i \u0111an y\xEAu v\u01B0\u01A1ng, m\u1ED9t d\u01B0\u01A1ng m\u1ED9t \xE2m. L\u1EEDa v\u0103n gi\u1EEF ba th\xE1ng, \u0111an ra \u1EA5m m\xE0 kh\xF4ng b\u1ECFng tay m\u1EDBi l\xE0 th\xE0nh."
    },
    {
      "id": "dp.thai_hu_dan",
      "nghe": "luyen_dan",
      "ten": "Th\xE1i H\u01B0 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.thai_hu_dan",
      "chu": [
        {
          "id": "item.van_nien_ban_dao",
          "so": 1
        },
        {
          "id": "item.yeu_vuong_noi_dan",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "\u0110\u01A1n ph\u01B0\u01A1ng ch\xE9p tr\xEAn v\xE1ch \u0111\xE1 m\u1ED9t \u0111\u1ED9ng ph\u1EE7 c\u1ED5, ch\u1EEF cu\u1ED1i b\u1ECB \u0111\u1EE5c m\u1EA5t. B\xE0n \u0111\xE0o v\u1EA1n n\u0103m l\xE0m ch\u1EE7, l\xF2 ph\u1EA3i \u0111\u1ED1t su\u1ED1t m\u1ED9t n\u0103m kh\xF4ng t\u1EAFt."
    },
    {
      "id": "dp.loi_am_dan",
      "nghe": "luyen_dan",
      "ten": "L\xF4i \xC2m \u0110an ph\u01B0\u01A1ng",
      "ra": "item.loi_am_dan",
      "chu": [
        {
          "id": "item.loi_kiep_truc",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 40,
      "mo_ta": "\u0110\u1ED1t tr\xFAc tr\xFAng s\xE9t b\u1EB1ng l\u1EEDa v\u0169 cho d\u01B0 l\xF4i b\u1EADt ra, m\u1ED9t v\u1ECB m\u1ED9c linh d\u01B0\u1EE3c gi\u1EEF l\u1EA1i trong l\xF2. L\u1EEDa v\u0103n th\xEC s\xE9t t\u1EAFt, \u0111an ra ch\u1EC9 l\xE0 than tr\xFAc."
    },
    {
      "id": "dp.tinh_phach_dan",
      "nghe": "luyen_dan",
      "ten": "T\u0129nh Ph\xE1ch \u0110an ph\u01B0\u01A1ng",
      "ra": "item.tinh_phach_dan",
      "chu": [
        {
          "id": "item.han_ngoc_sam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "S\xE2m b\u0103ng ninh l\u1EEDa nh\u1ECF trong n\u1ED3i \u0111\u1EA5t k\xEA tr\xEAn tuy\u1EBFt. L\xF2 n\xF3ng qu\xE1 th\xEC h\xE0n kh\xED b\u1ED1c h\u1EBFt, \u0111an ra ch\u1EC9 c\xF2n v\u1ECB \u0111\u1EAFng."
    },
    {
      "id": "dp.luyen_cot_dan",
      "nghe": "luyen_dan",
      "ten": "Luy\u1EC7n C\u1ED1t \u0110an ph\u01B0\u01A1ng",
      "ra": "item.luyen_cot_dan",
      "chu": [
        {
          "id": "item.huyet_bo_de",
          "so": 1
        },
        {
          "id": "item.lang_vuong_cot",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 50,
      "mo_ta": "X\u01B0\u01A1ng s\xF3i v\u01B0\u01A1ng nung \u0111\u1ECF, r\u01B0\u1EDBi n\u01B0\u1EDBc huy\u1EBFt b\u1ED3 \u0111\u1EC1 l\xEAn cho x\u01B0\u01A1ng m\u1EC1m ra. L\u1EEDa v\u0169 li\u1EC1n b\u1EA3y ng\xE0y, x\u01B0\u01A1ng ch\u01B0a m\u1EC1m m\xE0 h\u1EA1 l\u1EEDa th\xEC \u0111an \u0111\u1EA7y s\u1EA1n."
    },
    {
      "id": "dp.truong_xuan_dan",
      "nghe": "luyen_dan",
      "ten": "Tr\u01B0\u1EDDng Xu\xE2n \u0110an ph\u01B0\u01A1ng",
      "ra": "item.truong_xuan_dan",
      "chu": [
        {
          "id": "item.thien_nien_ha_thu_o",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 60,
      "mo_ta": "Hai c\u1EE7 h\xE0 th\u1EE7 \xF4 ngh\xECn n\u0103m, m\u1ED9t \u0111\u1EF1c m\u1ED9t c\xE1i, ninh chung l\u1EEDa v\u0103n ch\xEDn ng\xE0y. Thi\u1EBFu m\u1ED9t c\u1EE7 th\xEC \u0111an ra ch\u1EC9 \u0111en t\xF3c, kh\xF4ng th\xEAm tu\u1ED5i."
    },
    {
      "id": "dp.thong_than_dan",
      "nghe": "luyen_dan",
      "ten": "Th\xF4ng Th\u1EA7n \u0110an ph\u01B0\u01A1ng",
      "ra": "item.thong_than_dan",
      "chu": [
        {
          "id": "item.u_minh_lan",
          "so": 1
        },
        {
          "id": "item.ung_vuong_kim_dong",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 50,
      "mo_ta": "Lan \xE2m m\u1EDF th\u1EA7n th\u1EE9c, m\u1EAFt \u01B0ng v\u01B0\u01A1ng d\u1EABn \u0111\u01B0\u1EDDng. Ph\u1EA3i luy\u1EC7n l\xFAc n\u1EEDa \u0111\xEAm khi lan c\xF2n s\xE1ng, \u0111\u1EE3i t\u1EDBi s\xE1ng th\xEC hoa t\u1EAFt, c\xF4ng c\u1ED1c."
    },
    {
      "id": "dp.tran_hon_dan",
      "nghe": "luyen_dan",
      "ten": "Tr\u1EA5n H\u1ED3n \u0110an ph\u01B0\u01A1ng",
      "ra": "item.tran_hon_dan",
      "chu": [
        {
          "id": "item.han_nguyet_que",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 50,
      "mo_ta": "Hoa qu\u1EBF b\u0103ng ch\u01B0ng c\xE1ch th\u1EE7y su\u1ED1t m\u1ED9t tu\u1EA7n tr\u0103ng. L\u1EEDa v\u0103n gi\u1EEF \u0111\u1EC1u, ng\xE0y tr\u0103ng tr\xF2n m\u1EDBi m\u1EDF l\xF2."
    },
    {
      "id": "dp.hoa_anh_dan",
      "nghe": "luyen_dan",
      "ten": "H\xF3a Anh \u0110an ph\u01B0\u01A1ng",
      "ra": "item.hoa_anh_dan",
      "chu": [
        {
          "id": "item.xich_long_qua",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 30,
      "mo_ta": "\u0110\u01A1n c\u1EE7a m\u1ED9t t\xE1n tu kh\xF4ng c\xF3 t\xF4ng m\xF4n ch\u1ED1ng l\u01B0ng, t\u1EF1 m\xF2 ra c\xE1ch thay D\u01B0\u1EE1ng Anh \u0110an. Qu\u1EA3 r\u1ED3ng \u0111\u1ECF ph\u1EA3i l\u1EEDa v\u0169 m\u1EDBi v\u1EE1 v\u1ECF, k\xE9m h\u01A1n \u0111\u01A1n t\xF4ng m\xF4n nh\u01B0ng ai c\u0169ng luy\u1EC7n \u0111\u01B0\u1EE3c."
    },
    {
      "id": "dp.hoi_thien_dan",
      "nghe": "luyen_dan",
      "ten": "H\u1ED3i Thi\xEAn \u0110an ph\u01B0\u01A1ng",
      "ra": "item.hoi_thien_dan",
      "chu": [
        {
          "id": "item.tu_van_linh_chi",
          "so": 1
        },
        {
          "id": "item.thien_chu_mau_ty",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "pham": 4,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "Linh chi t\xEDm l\xE0m ch\u1EE7, t\u01A1 nh\u1EC7n m\u1EB9 qu\u1EA5n quanh cho d\u01B0\u1EE3c l\u1EF1c kh\u1ECFi tan, th\xEAm m\u1ED9t v\u1ECB m\u1ED9c linh d\u01B0\u1EE3c \u0110\u1ECBa ph\u1EA9m tr\u1EDF l\xEAn. T\u01A1 ch\xE1y l\xE0 h\u1ECFng, l\u1EEDa kh\xF4ng \u0111\u01B0\u1EE3c l\u1EDBn h\u01A1n ng\u1ECDn n\u1EBFn."
    },
    {
      "id": "dp.han_tuy_dan",
      "nghe": "luyen_dan",
      "ten": "H\xE0n T\u1EE7y \u0110an ph\u01B0\u01A1ng",
      "ra": "item.han_tuy_dan",
      "chu": [
        {
          "id": "item.bang_tuy_chi",
          "so": 1
        },
        {
          "id": "item.bang_vuong_linh_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "N\u1EA5m l\xF5i b\u0103ng v\u1EDBi l\xF4ng b\u1EB1ng v\u01B0\u01A1ng. L\xF2 ph\u1EA3i \u0111\u1EB7t tr\xEAn tuy\u1EBFt, l\u1EEDa v\u0103n \u0111\u1ED1t t\u1EEB tr\xEAn xu\u1ED1ng, ng\u01B0\u1EE3c h\u1EB3n l\u1ED1i th\u01B0\u1EDDng."
    },
    {
      "id": "dp.due_kim_dan",
      "nghe": "luyen_dan",
      "ten": "Du\u1EC7 Kim \u0110an ph\u01B0\u01A1ng",
      "ra": "item.due_kim_dan",
      "chu": [
        {
          "id": "item.cuu_diep_kiem_thao",
          "so": 1
        },
        {
          "id": "item.hat_vuong_doc_thich",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "\u0110\u01A1n c\u1EE7a s\xE1t th\u1EE7, ch\xEDn l\xE1 ki\u1EBFm th\u1EA3o v\xE0 gai \u0111\u1ED9c h\u1EA1t v\u01B0\u01A1ng. L\u1EEDa v\u0169 \u0111\u1ED1t cho \u0111\u1ED9c tan v\xE0o l\xE1, \u0111\u1ED9c ch\u01B0a tan h\u1EBFt m\xE0 v\xEA vi\xEAn th\xEC ng\u01B0\u1EDDi u\u1ED1ng ch\u1EBFt tr\u01B0\u1EDBc k\u1EBB \u0111\u1ECBch."
    },
    {
      "id": "dp.thuong_long_dan",
      "nghe": "luyen_dan",
      "ten": "Th\u01B0\u01A1ng Long \u0110an ph\u01B0\u01A1ng",
      "ra": "item.thuong_long_dan",
      "chu": [
        {
          "id": "item.bich_trieu_linh_tao",
          "so": 1
        },
        {
          "id": "item.giao_long_giac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "T\u1EA3o bi\u1EBFc ng\xE2m c\xF9ng s\u1EEBng giao trong n\u01B0\u1EDBc bi\u1EC3n b\u1EA3y ng\xE0y r\u1ED3i m\u1EDBi v\xE0o l\xF2. L\u1EEDa v\u0103n, n\u01B0\u1EDBc trong l\xF2 ph\u1EA3i s\xF4i l\u0103n t\u0103n nh\u01B0 con n\u01B0\u1EDBc ng\u1EA7m."
    },
    {
      "id": "dp.kim_o_dan",
      "nghe": "luyen_dan",
      "ten": "Kim \xD4 \u0110an ph\u01B0\u01A1ng",
      "ra": "item.kim_o_dan",
      "chu": [
        {
          "id": "item.kim_o_qua",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "hoa"
          ],
          "pham": 5,
          "so": 1
        },
        {
          "loai": "yeu_tai",
          "pham": 5,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 300,
      "mo_ta": "Qu\u1EA3 m\u1EB7t tr\u1EDDi l\xE0m ch\u1EE7, th\xEAm m\u1ED9t v\u1ECB h\u1ECFa linh d\u01B0\u1EE3c v\xE0 m\u1ED9t m\xF3n y\xEAu t\xE0i \u0111\u1EA1i y\xEAu cho l\u1EEDa c\xF3 ch\u1ED7 b\xE1m. L\u1EEDa v\u0169 \u0111\u1ED1t ba ng\xE0y, l\xF2 \u0111\u1ECF r\u1EF1c nh\u01B0 m\u1EB7t tr\u1EDDi l\u1EB7n."
    },
    {
      "id": "dp.van_tho_dan",
      "nghe": "luyen_dan",
      "ten": "V\u1EA1n Th\u1ECD \u0110an ph\u01B0\u01A1ng",
      "ra": "item.van_tho_dan",
      "chu": [
        {
          "id": "item.thai_tue",
          "so": 1
        },
        {
          "id": "item.huyen_quy_long_giap",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "Th\xE1i tu\u1EBF th\u1ECBt s\u1ED1ng, mai r\xF9a tr\u0103m v\u1EA1n n\u0103m. Th\xE1i tu\u1EBF t\u1EF1 li\u1EC1n th\u1ECBt, ph\u1EA3i l\u1EA5y mai r\xF9a \u0111\xE8 l\xEAn n\xF3 su\u1ED1t b\u1ED1n m\u01B0\u01A1i ch\xEDn ng\xE0y l\u1EEDa v\u0103n."
    },
    {
      "id": "dp.tao_hoa_dan",
      "nghe": "luyen_dan",
      "ten": "T\u1EA1o H\xF3a \u0110an ph\u01B0\u01A1ng",
      "ra": "item.tao_hoa_dan",
      "chu": [
        {
          "id": "item.kien_moc_qua",
          "so": 1
        },
        {
          "id": "item.thai_nhac_hung_dom",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "Qu\u1EA3 Ki\u1EBFn M\u1ED9c gieo v\xE0o m\u1EADt g\u1EA5u n\xFAi ngh\xECn n\u0103m, \u0111\u1EE3i m\u1EA7m n\u1EA3y m\u1EDBi nh\xF3m l\xF2. L\u1EEDa v\u0103n, m\u1EA7m h\xE9o l\xFAc n\xE0o l\xE0 ph\u1EA3i t\u1EAFt l\u1EEDa l\xFAc \u1EA5y."
    },
    {
      "id": "dp.hoa_long_dan",
      "nghe": "luyen_dan",
      "ten": "H\xF3a Long \u0110an ph\u01B0\u01A1ng",
      "ra": "item.hoa_long_dan",
      "chu": [
        {
          "id": "item.hoa_long_thao",
          "so": 1
        },
        {
          "id": "item.than_huyet_dang",
          "so": 1
        },
        {
          "id": "item.hoa_long_chau",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 500,
      "mo_ta": "C\u1ECF h\xF3a long, m\xE1u y\xEAu th\u1EA7n v\xE0 n\u1ED9i ch\xE2u giao gi\xE0, ba th\u1EE9 x\xE0 t\u1ED9c li\u1EC1u m\u1EA1ng gi\u1EEF. L\u1EEDa v\u0169 \u0111\u1ED1t t\u1EDBi khi b\xF3ng r\u1ED3ng trong ch\xE2u ch\u1ECBu b\u01A1i sang \u0111an."
    },
    {
      "id": "dp.van_tam_dan",
      "nghe": "luyen_dan",
      "ten": "V\u1EA5n T\xE2m \u0110an ph\u01B0\u01A1ng",
      "ra": "item.van_tam_dan",
      "chu": [
        {
          "id": "item.tuyet_long_sam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "S\xE2m r\u1ED3ng tuy\u1EBFt luy\u1EC7n trong l\xF2 b\u0103ng, ng\u01B0\u1EDDi canh l\xF2 ph\u1EA3i ng\u1ED3i tr\u01B0\u1EDBc l\xF2 h\u1ECFi l\xF2ng m\xECnh su\u1ED1t ch\xEDn ng\xE0y. Ai n\xF3ng ru\u1ED9t b\u1ECF \u0111i th\xEC l\xF2 ngu\u1ED9i."
    },
    {
      "id": "dp.thien_nhat_dan",
      "nghe": "luyen_dan",
      "ten": "Thi\xEAn Nh\u1EA5t \u0110an ph\u01B0\u01A1ng",
      "ra": "item.thien_nhat_dan",
      "chu": [
        {
          "id": "item.thien_nhat_chan_thuy",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "M\u1ED9t gi\u1ECDt ch\xE2n th\u1EE7y, kh\xF4ng th\xEAm v\u1ECB n\xE0o. C\xE1i kh\xF3 l\xE0 gi\u1EEF cho gi\u1ECDt n\u01B0\u1EDBc n\u1EB7ng nh\u01B0 th\u1EE7y ng\xE2n \u1EA5y kh\xF4ng xuy\xEAn th\u1EE7ng \u0111\xE1y l\xF2."
    },
    {
      "id": "dp.linh_lung_dan",
      "nghe": "luyen_dan",
      "ten": "Linh Lung \u0110an ph\u01B0\u01A1ng",
      "ra": "item.linh_lung_dan",
      "chu": [
        {
          "id": "item.that_khieu_linh_ngau",
          "so": 1
        },
        {
          "id": "item.thien_ho_tam",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "thuy"
          ],
          "pham": 5,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "Ng\xF3 sen b\u1EA3y khi\u1EBFu, tim h\u1ED3 ng\xE0n n\u0103m v\xE0 m\u1ED9t v\u1ECB th\u1EE7y linh d\u01B0\u1EE3c Thi\xEAn ph\u1EA9m. Th\u1ED5i h\u01A1i qua b\u1EA3y l\u1ED7 ng\xF3 sen cho d\u01B0\u1EE3c kh\xED \u0111i \u0111\u1EC1u r\u1ED3i m\u1EDBi \u0111\u1EADy n\u1EAFp l\xF2."
    },
    {
      "id": "dp.thien_loi_dan",
      "nghe": "luyen_dan",
      "ten": "Thi\xEAn L\xF4i \u0110an ph\u01B0\u01A1ng",
      "ra": "item.thien_loi_dan",
      "chu": [
        {
          "id": "item.thien_loi_moc_tam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 500,
      "mo_ta": "L\xF5i g\u1ED7 ch\xEDn l\u1EA7n tr\xFAng s\xE9t, ch\u1EBB l\xE0m ba, \u0111\u1ED1t t\u1EEBng ph\u1EA7n trong \u0111\xEAm gi\xF4ng. Ph\u1EA3i m\u1EDF n\u1EAFp l\xF2 \u0111\xFAng l\xFAc s\xE9t \u0111\xE1nh xu\u1ED1ng th\xEC l\xF4i kh\xED m\u1EDBi v\xE0o \u0111an."
    },
    {
      "id": "dp.bach_giai_dan_giac",
      "nghe": "luyen_dan",
      "ten": "B\xE1ch Gi\u1EA3i \u0110an ph\u01B0\u01A1ng (t\xEA gi\xE1c)",
      "ra": "item.bach_giai_dan",
      "chu": [
        {
          "id": "item.te_nguu_giac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 5,
      "mo_ta": "S\u1EEBng t\xEA m\xE0i b\u1ED9t, s\u1EAFc v\u1EDBi n\u01B0\u1EDBc su\u1ED1i t\u1EDBi khi n\u01B0\u1EDBc \u0111en l\u1EA1i. S\u1EEBng h\xFAt \u0111\u1ED9c n\xF3ng, l\u1EEDa v\u0103n gi\u1EEF cho b\u1ED9t kh\u1ECFi ch\xE1y."
    },
    {
      "id": "dp.bo_khi_dan_mat",
      "nghe": "luyen_dan",
      "ten": "B\u1ED5 Kh\xED \u0110an ph\u01B0\u01A1ng (phong m\u1EADt)",
      "ra": "item.bo_khi_dan",
      "chu": [
        {
          "id": "item.phong_mat",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 2,
      "mo_ta": "M\u1EADt ong \u0111\u1ED9c n\u1EA5u t\u1EDBi khi h\u1EBFt g\u1EAFt, l\xE0m ch\u1EA5t k\u1EBFt cho vi\xEAn \u0111an. N\u1EA5u non th\xEC \u0111an d\xEDnh tay, n\u1EA5u gi\xE0 th\xEC \u0111an \u0111\u1EAFng."
    },
    {
      "id": "dp.hoi_xuan_dan_dia",
      "nghe": "luyen_dan",
      "ten": "H\u1ED3i Xu\xE2n \u0110an ph\u01B0\u01A1ng (\u0111\u1EC9a d\u1ECBch)",
      "ra": "item.hoi_xuan_dan",
      "chu": [
        {
          "id": "item.huyet_dia_dich",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 1,
      "mo_ta": "D\u1ECBch \u0111\u1EC9a \u0111\u1EA7m c\u1EA7m m\xE1u, s\xEAn l\u1EEDa nh\u1ECF cho bay h\u1EBFt m\xF9i tanh. Lang trung ngh\xE8o hay luy\u1EC7n thay s\xE2m n\xFAi."
    },
    {
      "id": "dp.thong_mach_dan_giap",
      "nghe": "luyen_dan",
      "ten": "Th\xF4ng M\u1EA1ch \u0110an ph\u01B0\u01A1ng (v\u1EA3y t\xEA t\xEA)",
      "ra": "item.thong_mach_dan",
      "chu": [
        {
          "id": "item.te_giap_phien",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 8,
      "mo_ta": "V\u1EA3y t\xEA t\xEA sao v\xE0ng t\xE1n b\u1ED9t: v\u1ECB thu\u1ED1c chui \u0111\u01B0\u1EE3c qua \u0111\u1EA5t th\xEC chui \u0111\u01B0\u1EE3c qua kinh m\u1EA1ch t\u1EAFc. Sao ch\xE1y l\xE0 m\u1EA5t t\xEDnh."
    },
    {
      "id": "dp.khai_nguyen_dan_nhung",
      "nghe": "luyen_dan",
      "ten": "Khai Nguy\xEAn \u0110an ph\u01B0\u01A1ng (l\u1ED9c nhung)",
      "ra": "item.khai_nguyen_dan",
      "chu": [
        {
          "id": "item.loc_nhung",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 4,
      "mo_ta": "Nhung non th\xE1i m\u1ECFng nh\u01B0 gi\u1EA5y, ng\xE2m r\u01B0\u1EE3u m\u1ED9t \u0111\xEAm r\u1ED3i m\u1EDBi v\xE0o l\xF2. Nhung ch\xE1y l\xE0 ph\xED c\u1EA3 con h\u01B0\u01A1u."
    },
    {
      "id": "dp.dinh_than_dan_kinh",
      "nghe": "luyen_dan",
      "ten": "\u0110\u1ECBnh Th\u1EA7n \u0110an ph\u01B0\u01A1ng (g\u01B0\u01A1ng c\u1ED5)",
      "ra": "item.dinh_than_dan",
      "chu": [
        {
          "id": "item.co_kinh_phien",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 5,
      "mo_ta": "M\u1EA3nh g\u01B0\u01A1ng c\u1ED5 nung \u0111\u1ECF r\u1ED3i t\xF4i v\xE0o n\u01B0\u1EDBc thu\u1ED1c, c\xE1i b\xF3ng ch\u1EADm n\u1EEDa nh\u1ECBp trong g\u01B0\u01A1ng tan v\xE0o \u0111an. Ng\u01B0\u1EDDi luy\u1EC7n kh\xF4ng \u0111\u01B0\u1EE3c soi v\xE0o l\xF2."
    },
    {
      "id": "dp.thong_than_dan_tuy",
      "nghe": "luyen_dan",
      "ten": "Th\xF4ng Th\u1EA7n \u0110an ph\u01B0\u01A1ng (ng\u1ECDc t\u1EE7y)",
      "ra": "item.thong_than_dan",
      "chu": [
        {
          "id": "item.ngoc_tuy",
          "so": 2
        },
        {
          "id": "item.duoc_linh_phach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 60,
      "mo_ta": "Hai gi\u1ECDt ng\u1ECDc t\u1EE7y l\xE0m v\u1ECF, m\u1ED9t \u0111\u1ED1m d\u01B0\u1EE3c linh l\xE0m nh\xE2n. L\u1EEDa v\u0103n gi\u1EEF l\xE2u, t\u1EE7y \u0111\xF4ng l\u1EA1i trong su\u1ED1t m\u1EDBi \u0111\u01B0\u1EE3c m\u1EDF l\xF2."
    },
    {
      "id": "dp.thiet_kiem",
      "nghe": "luyen_bao",
      "ten": "Thi\u1EBFt Ki\u1EBFm \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thiet_kiem",
      "chu": [
        {
          "id": "item.thiet_khoang",
          "so": 1
        }
      ],
      "phu": [],
      "linh_thach": 1,
      "mo_ta": "B\u1EA3n v\u1EBD nh\u1EADp m\xF4n, th\u1EE3 r\xE8n n\xE0o c\u0169ng thu\u1ED9c. M\u1ED9t c\u1EE5c qu\u1EB7ng, m\u1ED9t bu\u1ED5i quai b\xFAa, ra m\u1ED9t thanh ki\u1EBFm s\u1EAFt."
    },
    {
      "id": "dp.thanh_phong_kiem",
      "nghe": "luyen_bao",
      "ten": "Thanh Phong Ki\u1EBFm \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thanh_phong_kiem",
      "chu": [
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "H\xE0n thi\u1EBFt ph\u1EA3i nung l\xE2u cho t\u1EA1p ch\u1EA5t ch\u1EA3y h\u1EBFt, l\u01B0\u1EE1i ki\u1EBFm m\u1EDBi nh\u1EB9 nh\u01B0 gi\xF3. N\xF3ng v\u1ED9i th\xEC ki\u1EBFm gi\xF2n, ch\xE9m \u0111\xE1 l\xE0 m\u1EBB."
    },
    {
      "id": "dp.han_thiet_dao",
      "nghe": "luyen_bao",
      "ten": "H\xE0n Thi\u1EBFt \u0110ao \u0111\u1ED3 ph\u1ED5",
      "ra": "item.han_thiet_dao",
      "chu": [
        {
          "id": "item.han_thiet",
          "so": 1
        },
        {
          "id": "item.thiet_khoang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "S\u1EAFt th\u01B0\u1EDDng l\xE0m s\u1ED1ng, h\xE0n thi\u1EBFt l\xE0m l\u01B0\u1EE1i. Ph\u1EA3i l\u1EEDa m\u1EA1nh cho hai th\u1EE9 ch\u1EA3y v\xE0o nhau, r\u1ED3i t\xF4i m\u1ED9t l\u1EA7n trong n\u01B0\u1EDBc tuy\u1EBFt."
    },
    {
      "id": "dp.huyen_quy_thuan",
      "nghe": "luyen_bao",
      "ten": "Huy\u1EC1n Quy Thu\u1EABn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.huyen_quy_thuan",
      "chu": [
        {
          "id": "item.quy_giap",
          "so": 1
        },
        {
          "id": "item.thiet_khoang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "Mai r\xF9a y\xEAu kh\u1EAFc tr\u1EADn v\u0103n theo v\xE2n n\u1EE9t c\xF3 s\u1EB5n, vi\u1EC1n s\u1EAFt quanh m\xE9p. Kh\u1EAFc sai m\u1ED9t n\xE9t, mai v\u1EE1 \u0111\xF4i."
    },
    {
      "id": "dp.thanh_suong_kiem",
      "nghe": "luyen_bao",
      "ten": "Thanh S\u01B0\u01A1ng Ki\u1EBFm \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thanh_suong_kiem",
      "chu": [
        {
          "id": "item.han_thiet",
          "so": 2
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 2,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "B\u1EA3n ch\xE9p l\u1EA1i t\u1EEB ki\u1EBFm Thanh V\xE2n. Hai kh\u1ED1i h\xE0n thi\u1EBFt g\u1EA5p l\u1EA1i ch\xEDn l\u1EA7n, th\xEAm m\u1ED9t v\u1ECB y\xEAu t\xE0i cho l\u01B0\u1EE1i ki\u1EBFm c\xF3 linh t\xEDnh."
    },
    {
      "id": "dp.tu_kim_phi_kiem",
      "nghe": "luyen_bao",
      "ten": "T\u1EED Kim Phi Ki\u1EBFm \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tu_kim_phi_kiem",
      "chu": [
        {
          "id": "item.tu_kim",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "T\u1EED kim c\u1EE9ng h\u01A1n m\u1ECDi th\u1EE9 s\u1EAFt \u0111\xE1, l\u1EEDa nh\u1ECF nung c\u1EA3 n\u0103m kh\xF4ng m\u1EC1m. Ph\u1EA3i huy\u1EBFt luy\u1EC7n, \u0111\u1ED5 c\u1EA3 tinh huy\u1EBFt v\xE0o l\xF2 m\u1EDBi \xE9p n\xF3 th\xE0nh ki\u1EBFm."
    },
    {
      "id": "dp.lang_nha_chuy",
      "nghe": "luyen_bao",
      "ten": "Lang Nha Ch\u1EE7y \u0111\u1ED3 ph\u1ED5",
      "ra": "item.lang_nha_chuy",
      "ra_cuc": "item.huyet_lang_chuy",
      "chu": [
        {
          "id": "item.lang_nha",
          "so": 1
        },
        {
          "id": "item.thiet_khoang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "\u0110\u01A1n c\u1EE7a th\u1EE3 r\xE8n quan \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c. Nanh s\xF3i m\xE0i th\xE0nh l\u01B0\u1EE1i, \u0111\xFAc chu\xF4i s\u1EAFt b\u1ECDc l\u1EA5y. Huy\u1EBFt kh\xED s\xF3i c\xF2n trong nanh th\xEC l\u1EEDa m\u1EA1nh m\u1EDBi gi\u1EEF \u0111\u01B0\u1EE3c."
    },
    {
      "id": "dp.yeu_bi_giap",
      "nghe": "luyen_bao",
      "ten": "Y\xEAu B\xEC Gi\xE1p \u0111\u1ED3 ph\u1ED5",
      "ra": "item.yeu_bi_giap",
      "chu": [
        {
          "id": "item.yeu_bi",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 2,
      "mo_ta": "Hai t\u1EA5m da y\xEAu th\xFA, m\u1ED9t th\xF9ng d\u1EA7u t\xF9ng. Nung l\xE2u cho d\u1EA7u ng\u1EA5m t\u1EADn th\u1EDB, l\u1EEDa to th\xEC da co l\u1EA1i nh\u01B0 v\u1ECF c\xE2y kh\xF4."
    },
    {
      "id": "dp.chu_ty_vong",
      "nghe": "luyen_bao",
      "ten": "Chu Ty V\xF5ng \u0111\u1ED3 ph\u1ED5",
      "ra": "item.chu_ty_vong",
      "ra_cuc": "item.thien_chu_vong",
      "chu": [
        {
          "id": "item.chu_ty",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "T\u01A1 nh\u1EC7n h\u01A1 tr\xEAn l\u1EEDa nh\u1ECF cho b\u1EDBt d\xEDnh r\u1ED3i m\u1EDBi \u0111an. Th\u1EE3 Vi\xEAm Qu\u1ED1c \u0111an l\u01B0\u1EDBi n\xE0y b\xE1n cho th\u01B0\u01A1ng \u0111o\xE0n b\u1EAFt k\u1EBB c\u01B0\u1EDBp s\u1ED1ng."
    },
    {
      "id": "dp.ho_vi_phat",
      "nghe": "luyen_bao",
      "ten": "H\u1ED3 V\u0129 Ph\u1EA5t \u0111\u1ED3 ph\u1ED5",
      "ra": "item.ho_vi_phat",
      "chu": [
        {
          "id": "item.ho_vi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "\u0110u\xF4i c\xE1o ph\u1EA3i hong tr\xEAn l\u1EEDa tr\u1EA7m b\u1EA3y ng\xE0y, m\u1ECB kh\xED m\u1EDBi th\u1EA5m v\xE0o c\xE1n. H\u01B0\u01A1ng tr\u1EA7m ti\u1EC1n nhi\u1EC1u h\u01A1n ti\u1EC1n l\u1EEDa."
    },
    {
      "id": "dp.giao_can_cung",
      "nghe": "luyen_bao",
      "ten": "Giao C\xE2n Cung \u0111\u1ED3 ph\u1ED5",
      "ra": "item.giao_can_cung",
      "chu": [
        {
          "id": "item.giao_han_can",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "nguyen_lieu",
          "he": [
            "kim"
          ],
          "so": 1
        }
      ],
      "mo_ta": "G\xE2n giao l\xE0m d\xE2y, m\u1ED9t kh\u1ED1i kim thi\u1EBFt \u0111\xFAc th\xE2n cung. G\xE2n l\u1EA1nh m\xE0 l\xF2 n\xF3ng, c\u0103ng d\xE2y l\xFAc n\xE0o l\xE0 c\u1EA3 c\xE1i ngh\u1EC1."
    },
    {
      "id": "dp.bach_hac_vu_y",
      "nghe": "luyen_bao",
      "ten": "B\u1EA1ch H\u1EA1c V\u0169 Y \u0111\u1ED3 ph\u1ED5",
      "ra": "item.bach_hac_vu_y",
      "chu": [
        {
          "id": "item.hac_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": 'L\xF4ng h\u1EA1c k\u1EBFt b\u1EB1ng t\u01A1 t\u1EB1m tr\xEAn khung l\u1EEDa \u1EA5m. B\u1EA3n v\u1EBD ghi th\xEAm m\u1ED9t d\xF2ng nh\u1ECF d\u01B0\u1EDBi g\xF3c, n\xE9t run run, "l\xF4ng nh\u1EB7t, ch\u1EDB gi\u1EBFt".'
    },
    {
      "id": "dp.tuyet_bang_kiem",
      "nghe": "luyen_bao",
      "ten": "Tuy\u1EBFt B\u1EB1ng Ki\u1EBFm \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tuyet_bang_kiem",
      "ra_cuc": "item.cuu_tieu_bang_kiem",
      "chu": [
        {
          "id": "item.bang_vu",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "L\xF4ng b\u1EB1ng c\xE0i hai b\xEAn s\u1ED1ng ki\u1EBFm h\xE0n thi\u1EBFt. L\u1EEDa to th\xEC l\xF4ng ch\xE1y, l\u1EEDa nh\u1ECF th\xEC l\xF4ng kh\xF4ng ch\u1ECBu b\xE1m v\xE0o th\xE9p."
    },
    {
      "id": "dp.ho_cot_dao",
      "nghe": "luyen_bao",
      "ten": "H\u1ED5 C\u1ED1t \u0110ao \u0111\u1ED3 ph\u1ED5",
      "ra": "item.ho_cot_dao",
      "chu": [
        {
          "id": "item.ho_cot",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "X\u01B0\u01A1ng h\u1ED5 gi\xE0 l\u1ED3ng trong s\u1ED1ng \u0111ao. H\u1ED5 t\xF4n k\u1EBB m\u1EA1nh, x\u01B0\u01A1ng c\u0169ng th\u1EBF, l\u1EEDa y\u1EBFu th\xEC n\xF3 kh\xF4ng ch\u1ECBu nh\u1EADn l\u01B0\u1EE1i th\xE9p."
    },
    {
      "id": "dp.giao_lan_giap",
      "nghe": "luyen_bao",
      "ten": "Giao L\xE2n Gi\xE1p \u0111\u1ED3 ph\u1ED5",
      "ra": "item.giao_lan_giap",
      "chu": [
        {
          "id": "item.giao_long_lan",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "van",
      "mo_ta": "V\u1EA3y giao long x\u1EBFp t\u1EEBng l\u1EDBp, th\xEAm m\u1ED9t v\u1ECB y\xEAu t\xE0i l\xE0m keo. M\u1ED9t t\u1EA5m v\u1EA3y nung ba ng\xE0y m\u1EDBi m\u1EC1m ra \u0111\u1EE7 \u0111\u1EC3 kh\xE2u."
    },
    {
      "id": "dp.thuong_lan_kiem",
      "nghe": "luyen_bao",
      "ten": "Th\u01B0\u01A1ng Lan Ki\u1EBFm c\u1ED5 ph\u1ED5",
      "ra": "item.thuong_lan_kiem",
      "chu": [
        {
          "id": "item.han_thiet",
          "so": 3
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 4,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 20,
      "mo_ta": "B\u1EA3n v\u1EBD tr\xEAn da d\xEA t\u1EEB th\u1EDDi c\xF2n Trung Ch\xE2u. Ba kh\u1ED1i h\xE0n thi\u1EBFt l\xE0m th\xE2n, m\u1ED9t t\u1EA5m v\u1EA3y y\xEAu th\xFA c\u1EA5p cao b\u1ECDc s\u1ED1ng, kh\xF4ng th\xEC ki\u1EBFm n\u1EE9t ngay khi ra l\xF2."
    },
    {
      "id": "dp.van_yeu_phien",
      "nghe": "luyen_bao",
      "ten": "V\u1EA1n Y\xEAu Phi\xEAn c\u1ED5 ph\u1ED5",
      "ra": "item.van_yeu_phien",
      "ra_cuc": "item.yeu_hoang_phien",
      "chu": [
        {
          "id": "item.yeu_vuong_noi_dan",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "vu",
      "mo_ta": "Kh\xED ph\u1ED5 c\u1EE7a m\u1ED9t t\xF4ng \u0111\xE3 tan, ch\xE9p t\u1EEB h\u1EA7m \u0111\xE1. L\u1EA5y n\u1ED9i \u0111an y\xEAu v\u01B0\u01A1ng l\xE0m l\xF5i, m\xE1u ng\u01B0\u1EDDi luy\u1EC7n l\xE0m m\u1EF1c v\u1EBD c\u1EDD. L\u1EEDa nh\u1ECF th\xEC n\u1ED9i \u0111an t\u1EC9nh d\u1EADy tr\u01B0\u1EDBc khi k\u1ECBp tr\u1EA5n."
    },
    {
      "id": "dp.phuoc_tien_tac",
      "nghe": "luyen_bao",
      "ten": "Ph\u01B0\u1EE3c Ti\xEAn T\xE1c \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phuoc_tien_tac",
      "chu": [
        {
          "id": "item.thien_chu_mau_ty",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "T\u01A1 nh\u1EC7n m\u1EB9 ph\u1EA3i h\u01A1 tr\xEAn l\u1EEDa nh\u1ECF b\u1EA3y ng\xE0y cho h\u1EBFt d\xEDnh, r\u1ED3i b\u1EC7n ch\xEDn s\u1EE3i l\xE0m m\u1ED9t. L\u1EEDa to th\xEC t\u01A1 co l\u1EA1i nh\u01B0 t\xF3c ch\xE1y."
    },
    {
      "id": "dp.pha_giap_toan",
      "nghe": "luyen_bao",
      "ten": "Ph\xE1 Gi\xE1p To\u1EA3n \u0111\u1ED3 ph\u1ED5",
      "ra": "item.pha_giap_toan",
      "chu": [
        {
          "id": "item.thuc_kim_thu_xi",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "R\u0103ng chu\u1ED9t g\u1EB7m v\xE0ng kh\u1EA3m v\xE0o m\u0169i khoan h\xE0n thi\u1EBFt. R\u0103ng c\u1EE9ng h\u01A1n th\xE9p, ph\u1EA3i l\u1EEDa m\u1EA1nh m\u1EDBi \xE9p th\xE9p \xF4m \u0111\u01B0\u1EE3c r\u0103ng."
    },
    {
      "id": "dp.giao_le_chau_lien",
      "nghe": "luyen_bao",
      "ten": "Giao L\u1EC7 Ch\xE2u Li\xEAn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.giao_le_chau_lien",
      "chu": [
        {
          "id": "item.giao_nhan_le",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "N\u01B0\u1EDBc m\u1EAFt ng\u01B0\u1EDDi c\xE1 g\u1EB7p l\u1EEDa to l\xE0 v\u1EE1. Nung trong n\u1ED3i n\u01B0\u1EDBc bi\u1EC3n, l\u1EEDa liu riu c\u1EA3 th\xE1ng, ng\u1ECDc m\u1EDBi m\u1EC1m ra \u0111\u1EE7 \u0111\u1EC3 x\xE2u."
    },
    {
      "id": "dp.thong_ty_kim_con",
      "nghe": "luyen_bao",
      "ten": "Th\xF4ng T\xFD Kim C\xF4n \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thong_ty_kim_con",
      "chu": [
        {
          "id": "item.thong_ty_vien_cot",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 50,
      "mo_ta": "\u0110\u1ED5 \u0111\u1ED3ng n\xF3ng v\xE0o l\xF2ng x\u01B0\u01A1ng tay v\u01B0\u1EE3n, m\u1ED9t h\u01A1i cho \u0111\u1EA7y. Ng\u1EADp ng\u1EEBng n\u1EEDa nh\u1ECBp th\xEC \u0111\u1ED3ng ngu\u1ED9i gi\u1EEFa ch\u1EEBng, c\xF4n g\xE3y \u0111\xF4i."
    },
    {
      "id": "dp.huyen_vu_thuan",
      "nghe": "luyen_bao",
      "ten": "Huy\u1EC1n V\u0169 Thu\u1EABn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.huyen_vu_thuan",
      "chu": [
        {
          "id": "item.huyen_quy_long_giap",
          "so": 1
        },
        {
          "id": "item.quy_giap",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "M\u1EA3nh mai mang huy\u1EBFt Huy\u1EC1n V\u0169 l\xE0m l\xF2ng khi\xEAn, mai r\xF9a th\u01B0\u1EDDng l\xE0m vi\u1EC1n. Kh\u1EAFc tr\u1EADn theo v\xE2n s\xF3ng, m\u1ED7i n\xE9t nung m\u1ED9t ng\xE0y."
    },
    {
      "id": "dp.liet_ho_dao",
      "nghe": "luyen_bao",
      "ten": "Li\u1EC7t H\u1ED5 \u0110ao \u0111\u1ED3 ph\u1ED5",
      "ra": "item.liet_ho_dao",
      "chu": [
        {
          "id": "item.liet_ho_kim_trao",
          "so": 1
        },
        {
          "id": "item.thien_ngoai_van_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 100,
      "mo_ta": "Th\xE9p tr\u1EDDi r\u01A1i l\xF2 th\u01B0\u1EDDng kh\xF4ng nung \u0111\u1ECF, ph\u1EA3i huy\u1EBFt luy\u1EC7n. Vu\u1ED1t h\u1ED5 t\u01B0\u1EDBng \u0111\u1EB7t v\xE0o s\u1ED1ng \u0111ao l\xFAc th\xE9p c\xF2n s\xF4i, h\u1ED5 kh\xED m\u1EDBi ch\u1ECBu nh\u1EADp."
    },
    {
      "id": "dp.hoa_long_truong",
      "nghe": "luyen_bao",
      "ten": "H\xF3a Long Tr\u01B0\u1EE3ng c\u1ED5 ph\u1ED5",
      "ra": "item.hoa_long_truong",
      "chu": [
        {
          "id": "item.hoa_long_chau",
          "so": 1
        },
        {
          "id": "item.giao_long_giac",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 5,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "\u0110\u01A1n c\u1EE7a Giao t\u1ED9c ch\xE9p tr\xEAn v\u1EA3y, t\u1EEB th\u1EDDi c\xF2n canh m\u1ED9 Trung Ch\xE2u. N\u1ED9i ch\xE2u ph\u1EA3i nung ba n\u0103m trong s\u1EEBng m\u1EDBi ch\u1ECBu \u1EDF y\xEAn."
    },
    {
      "id": "dp.hat_vi_tien",
      "nghe": "luyen_bao",
      "ten": "H\u1EA1t V\u0129 Ti\xEAn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.hat_vi_tien",
      "chu": [
        {
          "id": "item.cuu_tiet_hat_vi",
          "so": 1
        },
        {
          "id": "item.canh_kim_tinh",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "M\u1ED7i \u0111\u1ED1t \u0111u\xF4i b\u1ECDc m\u1ED9t l\u1EDBp canh kim m\u1ECFng nh\u01B0 l\xE1. \u0110u\xF4i h\u1EA1t c\xF2n s\u1ED1ng, l\u1EEDa nh\u1ECF th\xEC n\xF3 qu\u1EABy v\u1EE1 khu\xF4n."
    },
    {
      "id": "dp.thien_bang_cung",
      "nghe": "luyen_bao",
      "ten": "Thi\xEAn B\u1EB1ng Cung \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thien_bang_cung",
      "chu": [
        {
          "id": "item.bang_vuong_han_tuy",
          "so": 1
        },
        {
          "id": "item.bang_vuong_linh_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "T\u1EE7y b\u0103ng ph\u1EA3i nung trong l\u1EEDa \xE2m, \u1EA5m d\u1EA7n t\u1EEBng ch\xFAt nh\u01B0 \u1EE7 tr\u1EE9ng. N\xF3ng qu\xE1 m\u1ED9t kh\u1EAFc l\xE0 t\u1EE7y ch\u1EA3y th\xE0nh n\u01B0\u1EDBc."
    },
    {
      "id": "dp.cuu_vi_huyen_dang",
      "nghe": "luyen_bao",
      "ten": "C\u1EEDu V\u0129 Huy\u1EC5n \u0110\u0103ng \u0111\u1ED3 ph\u1ED5",
      "ra": "item.cuu_vi_huyen_dang",
      "chu": [
        {
          "id": "item.cuu_vi_ho_hon",
          "so": 1
        },
        {
          "id": "item.thien_ho_tam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "Tim h\u1ED3 ly l\xE0m b\u1EA5c, h\u1ED3n h\u1ED3 ly l\xE0m l\u1EEDa. Ng\u01B0\u1EDDi luy\u1EC7n ph\u1EA3i nh\xECn th\u1EB3ng v\xE0o l\u1EEDa su\u1ED1t b\u1EA3y ng\xE0y m\xE0 kh\xF4ng b\u1ECB n\xF3 m\xEA."
    },
    {
      "id": "dp.thanh_bang_si",
      "nghe": "luyen_bao",
      "ten": "Thanh B\u1EB1ng S\xED \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thanh_bang_si",
      "chu": [
        {
          "id": "item.bang_vu",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 60,
      "mo_ta": "L\xF4ng b\u1EB1ng l\xE0m c\xE1nh ch\xEDnh, th\xEAm m\u1ED9t m\xF3n l\xF4ng v\u0169 kh\xE1c l\xE0m c\xE1nh ph\u1EE5 (l\xF4ng h\u1EA1c c\u0169ng \u0111\u01B0\u1EE3c). L\u1EEDa nh\u1ECF nung l\xE2u, l\xF4ng m\u1EDBi gi\u1EEF gi\xF3."
    },
    {
      "id": "dp.kim_bang_si",
      "nghe": "luyen_bao",
      "ten": "Kim B\u1EB1ng S\xED \u0111\u1ED3 ph\u1ED5",
      "ra": "item.kim_bang_si",
      "chu": [
        {
          "id": "item.tuyet_bang_cot",
          "so": 1
        },
        {
          "id": "item.bang_vu",
          "so": 2
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 4,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "X\u01B0\u01A1ng c\xE1nh b\u1EB1ng l\xE0m s\u1ED1ng, d\xE1t v\xE0ng khi x\u01B0\u01A1ng c\xF2n \u0111\u1ECF l\u1EEDa r\u1ED3i c\u1EAFm l\xF4ng. L\u1EEDa m\u1EA1nh m\xE0 nhanh, ch\u1EADm tay th\xEC x\u01B0\u01A1ng ngu\u1ED9i n\u1EE9t."
    },
    {
      "id": "dp.con_bang_si",
      "nghe": "luyen_bao",
      "ten": "C\xF4n B\u1EB1ng S\xED c\u1ED5 ph\u1ED5",
      "ra": "item.con_bang_si",
      "chu": [
        {
          "id": "item.bang_vuong_linh_vu",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "Hai c\u1ECDng l\xF4ng b\u1EB1ng v\u01B0\u01A1ng l\xE0m c\u1ED1t, nung trong l\u1EEDa \xE2m b\u1ED1n m\u01B0\u01A1i ch\xEDn ng\xE0y. C\xE1nh th\xE0nh th\xEC t\u1EF1 v\u1ED7, ng\u01B0\u1EDDi luy\u1EC7n ph\u1EA3i gi\u1EEF ch\u1EB7t k\u1EBBo n\xF3 bay m\u1EA5t."
    },
    {
      "id": "dp.dan_lo_dia",
      "nghe": "luyen_bao",
      "ten": "\u0110\u1ECBa H\u1ECFa \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5",
      "ra": "item.dan_lo_dia",
      "chu": [
        {
          "id": "item.tu_kim",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 2,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 40,
      "mo_ta": "T\u1EED kim \u0111\xFAc th\xE2n l\xF2, m\u1ED9t v\u1ECB y\xEAu t\xE0i h\xF2a v\xE0o \u0111\u1ED3ng cho l\xF2 bi\u1EBFt gi\u1EEF l\u1EEDa. L\u1EEDa m\u1EA1nh m\xE0 \u0111\u1EC1u tay, \u0111\xE1y l\xF2 m\u1EDBi ra r\xE3nh d\u1EABn li\u1EC1n m\u1EA1ch."
    },
    {
      "id": "dp.phu_but_dia",
      "nghe": "luyen_bao",
      "ten": "T\u1EED Ng\u1ECDc Ph\xF9 B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phu_but_dia",
      "chu": [
        {
          "id": "item.ho_vuong_tu",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 2,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "R\xE2u h\u1ED5 v\u01B0\u01A1ng h\u01A1 l\u1EEDa nh\u1ECF cho m\u1EC1m, b\xF3 l\u1EA1i l\xE0m ng\xF2i r\u1ED3i c\u1EAFm v\xE0o c\xE1n. L\u1EEDa to th\xEC r\xE2u xo\u0103n l\u1EA1i, ng\xF2i b\xFAt x\xF2e nh\u01B0 ch\u1ED5i."
    },
    {
      "id": "dp.dan_lo_thien",
      "nghe": "luyen_bao",
      "ten": "C\u1EEDu Long \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5",
      "ra": "item.dan_lo_thien",
      "chu": [
        {
          "id": "item.thien_ngoai_van_thiet",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 30,
      "mo_ta": "V\u1EABn thi\u1EBFt t\u1EEB tr\u1EDDi r\u01A1i xu\u1ED1ng, ph\u1EA3i l\u1EEDa m\u1EA1nh nh\u1EA5t m\u1EDBi ch\u1EA3y. \u0110\xFAc ch\xEDn con r\u1ED3ng m\u1ED9t l\u1EA7n, con n\xE0o ngu\u1ED9i tr\u01B0\u1EDBc l\xE0 c\u1EA3 l\xF2 n\u1EE9t."
    },
    {
      "id": "dp.phu_but_thien",
      "nghe": "luyen_bao",
      "ten": "B\u1ED3 \u0110\u1EC1 Ph\xF9 B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phu_but_thien",
      "chu": [
        {
          "id": "item.tien_hac_tho_cot",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "X\u01B0\u01A1ng h\u1EA1c ti\xEAn l\xE0m l\xF5i c\xE1n, ngo\xE0i b\u1ECDc g\u1ED7 b\u1ED3 \u0111\u1EC1. L\u1EEDa nh\u1ECF hong b\u1ED1n m\u01B0\u01A1i ng\xE0y cho x\u01B0\u01A1ng v\u1EDBi g\u1ED7 \u0103n v\xE0o nhau."
    },
    {
      "id": "dp.dan_lo_tien",
      "nghe": "luyen_bao",
      "ten": "Th\xE1i Th\u01B0\u1EE3ng \u0111an l\xF4 c\u1ED5 ph\u1ED5",
      "ra": "item.dan_lo_tien",
      "chu": [
        {
          "id": "item.hu_linh_phach",
          "so": 1
        },
        {
          "id": "item.thien_ngoai_van_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 50,
      "mo_ta": "V\u1EABn thi\u1EBFt l\xE0m v\u1ECF, H\u01B0 Linh Ph\xE1ch nh\u1ED1t v\xE0o l\xF2ng l\xF2 thay cho l\u1EEDa. Ph\xE1ch t\u1EC9nh d\u1EADy l\xFAc l\xF2 ch\u01B0a k\xEDn l\xE0 n\xF3 tr\u1ED1n m\u1EA5t."
    },
    {
      "id": "dp.phu_but_tien",
      "nghe": "luyen_bao",
      "ten": "L\xF4i M\u1ED9c Ph\xF9 B\xFAt c\u1ED5 ph\u1ED5",
      "ra": "item.phu_but_tien",
      "chu": [
        {
          "id": "item.bang_vuong_linh_vu",
          "so": 1
        },
        {
          "id": "item.hu_linh_phach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "L\xF4ng b\u1EB1ng v\u01B0\u01A1ng l\xE0m ng\xF2i, H\u01B0 Linh Ph\xE1ch luy\u1EC7n v\xE0o c\xE1n g\u1ED7 s\xE9t \u0111\xE1nh cho b\xFAt c\xF3 linh. L\u1EEDa nh\u1ECF nung l\xE2u, l\u1EEDa g\u1EAFt th\xEC l\xF4ng ch\xE1y tr\u01B0\u1EDBc khi ph\xE1ch k\u1ECBp nh\u1EADp."
    },
    {
      "id": "dp.khi_lo_pham",
      "nghe": "luyen_bao",
      "ten": "Th\u1EA1ch \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5",
      "ra": "item.khi_lo_pham",
      "chu": [
        {
          "id": "item.thiet_khoang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 4,
      "mo_ta": "\u0110\u1EBDo \u0111\xE1 ong th\xE0nh l\xF2ng \u0111\u1EC9nh, nung m\u1ED9t c\u1EE5c s\u1EAFt l\xE0m \u0111ai b\xF3 quanh mi\u1EC7ng. L\u1EEDa v\u1EEBa ph\u1EA3i, qu\xE1 tay th\xEC \u0111\xE1 n\u1ED5."
    },
    {
      "id": "dp.khi_lo_hoang",
      "nghe": "luyen_bao",
      "ten": "Thi\u1EBFt \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5",
      "ra": "item.khi_lo_hoang",
      "chu": [
        {
          "id": "item.han_thiet",
          "so": 1
        },
        {
          "id": "item.thiet_khoang",
          "so": 4
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 20,
      "mo_ta": "B\u1ED1n c\u1EE5c s\u1EAFt n\u1EA5u th\xE0nh gang, m\u1ED9t kh\u1ED1i h\xE0n thi\u1EBFt l\xE0m l\xF2ng \u0111\u1EC9nh. \u0110\u1ED5 khu\xF4n m\u1ED9t l\u1EA7n cho li\u1EC1n kh\u1ED1i, ngu\u1ED9i d\u1EDF l\xE0 n\u1EE9t."
    },
    {
      "id": "dp.khi_lo_huyen",
      "nghe": "luyen_bao",
      "ten": "X\xEDch Di\u1EC5m \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5",
      "ra": "item.khi_lo_huyen",
      "chu": [
        {
          "id": "item.han_thiet",
          "so": 2
        },
        {
          "id": "item.hoa_diep_dang",
          "so": 2
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 60,
      "mo_ta": "D\xE2y H\u1ECFa Di\u1EC7p \u0110\u1EB1ng \u0111\u1ED1t c\xF9ng h\xE0n thi\u1EBFt cho kim lo\u1EA1i ng\u1EA3 \u0111\u1ECF, m\u1ED9t v\u1ECB y\xEAu t\xE0i l\xE0m m\u1EAFt tr\u1EADn d\u1EABn h\u1ECFa. Kh\u1EAFc tr\u1EADn l\xFAc \u0111\u1EC9nh c\xF2n r\u1EF1c."
    },
    {
      "id": "dp.khi_lo_dia",
      "nghe": "luyen_bao",
      "ten": "\u0110\u1ECBa M\u1EA1ch \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5",
      "ra": "item.khi_lo_dia",
      "chu": [
        {
          "id": "item.tu_kim",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "T\u1EED kim pha \u0111\u1ED3ng \u0111en \u0111\xFAc th\xE2n, kh\u1EAFc \u0111\u1ECBa m\u1EA1ch \u0111\u1ED3 khi \u0111\u1EC9nh c\xF2n m\u1EC1m. L\u1EEDa nh\u1ECF gi\u1EEF l\xE2u, n\xE9t kh\u1EAFc m\u1EDBi \u0103n s\xE2u v\xE0o th\u1EDB kim."
    },
    {
      "id": "dp.khi_lo_thien",
      "nghe": "luyen_bao",
      "ten": "C\u1EEDu Di\u1EC7u \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5",
      "ra": "item.khi_lo_thien",
      "chu": [
        {
          "id": "item.thien_ngoai_van_thiet",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 50,
      "mo_ta": "V\u1EABn thi\u1EBFt \u0111\xFAc th\xE2n \u0111\u1EC9nh, ch\xEDn \u0111\u1ED1m s\xE1ng kh\u1EA3m theo \u0111\xFAng v\u1ECB sao. L\u1EEDa m\u1EA1nh m\u1ED9t h\u01A1i, kh\u1EA3m l\u1EC7ch m\u1ED9t v\xEC l\xE0 c\u1EA3 \u0111\u1EC9nh c\xE2m."
    },
    {
      "id": "dp.khi_lo_tien",
      "nghe": "luyen_bao",
      "ten": "Th\xE1i S\u01A1 \u0111\u1EC9nh c\u1ED5 ph\u1ED5",
      "ra": "item.khi_lo_tien",
      "chu": [
        {
          "id": "item.yeu_dan_5",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "Ng\u0169 Giai Y\xEAu \u0110an luy\u1EC7n tan v\xE0o men \u0111\u1EC9nh l\xE0m h\u1ECFa ch\u1EE7ng, t\u1EEB \u0111\xF3 \u0111\u1EC9nh t\u1EF1 ch\xE1y b\u1EB1ng linh kh\xED. L\u1EEDa nh\u1ECF nung tr\u0103m ng\xE0y cho men h\xF3a ng\u1ECDc."
    },
    {
      "id": "dp.dan_lo_dat",
      "nghe": "luyen_bao",
      "ten": "\u0110an l\xF4 \u0111\u1EA5t nung \u0111\u1ED3 ph\u1ED5",
      "ra": "item.dan_lo_dat",
      "chu": [
        {
          "id": "item.thiet_khoang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 3,
      "mo_ta": "N\u1EB7n l\xF2 b\u1EB1ng \u0111\u1EA5t s\xE9t, nung m\u1ED9t c\u1EE5c s\u1EAFt l\xE0m \u0111ai quanh mi\u1EC7ng. L\u1EEDa than nh\u1ECF, nung m\u1ED9t \u0111\xEAm l\xE0 xong."
    },
    {
      "id": "dp.dan_lo_dong",
      "nghe": "luyen_bao",
      "ten": "\u0110\u1ED3ng \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5",
      "ra": "item.dan_lo_dong",
      "chu": [
        {
          "id": "item.han_thiet",
          "so": 1
        },
        {
          "id": "item.thiet_khoang",
          "so": 3
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 15,
      "mo_ta": "\u0110\xFAc l\xF2 ba ch\xE2n, h\xE0n thi\u1EBFt l\xF3t l\xF2ng cho ch\u1ECBu \u0111\u01B0\u1EE3c l\u1EEDa Huy\u1EC1n ph\u1EA9m. Kh\u1EAFc v\xE2n m\xE2y tr\u01B0\u1EDBc khi \u0111\u1ED3ng ngu\u1ED9i h\u1EB3n."
    },
    {
      "id": "dp.dan_lo_huyen",
      "nghe": "luyen_bao",
      "ten": "T\u1EED V\u0103n \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5",
      "ra": "item.dan_lo_huyen",
      "chu": [
        {
          "id": "item.han_thiet",
          "so": 2
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 70,
      "mo_ta": "H\xE0n thi\u1EBFt pha m\u1ED9t v\u1ECB y\xEAu t\xE0i cho kim ng\u1EA3 t\xEDm, kh\u1EAFc tr\u1EADn v\u0103n gi\u1EEF nhi\u1EC7t l\xEAn th\xE0nh l\xF2. L\u1EEDa nh\u1ECF, kh\u1EAFc ch\u1EADm, sai n\xE9t l\xE0 l\xF2 r\xF2 h\u01A1i."
    },
    {
      "id": "dp.phu_but_pham",
      "nghe": "luyen_bao",
      "ten": "Tr\xFAc H\xE0o B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phu_but_pham",
      "chu": [
        {
          "id": "item.thiet_khoang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 1,
      "mo_ta": "R\xE8n m\u1ED9t kh\xE2u s\u1EAFt nh\u1ECF b\u1ECBt \u0111\u1EA7u c\xE1n tr\xFAc, k\u1EB9p l\xF4ng d\xEA l\xE0m ng\xF2i. Vi\u1EC7c c\u1EE7a bu\u1ED5i chi\u1EC1u."
    },
    {
      "id": "dp.phu_but_hoang",
      "nghe": "luyen_bao",
      "ten": "Lang H\xE0o B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phu_but_hoang",
      "chu": [
        {
          "id": "item.thu_tu",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 15,
      "mo_ta": "L\xF4ng g\xE1y s\xF3i y\xEAu kh\xF3 ki\u1EBFm, r\xE2u chu\u1ED9t y\xEAu thay c\u0169ng \u0111\u01B0\u1EE3c. H\u01A1 l\u1EEDa nh\u1ECF cho th\u1EB3ng, b\xF3 ch\u1EB7t l\xE0m ng\xF2i, c\u1EE9ng m\xE0 \u0111\xE0n h\u1ED3i."
    },
    {
      "id": "dp.phu_but_huyen",
      "nghe": "luyen_bao",
      "ten": "H\u1EA1c V\u0169 Ph\xF9 B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phu_but_huyen",
      "chu": [
        {
          "id": "item.hac_vu",
          "so": 1
        },
        {
          "id": "item.hac_cot",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 70,
      "mo_ta": "L\xF4ng c\xE1nh h\u1EA1c k\u1EBFt th\xE0nh ng\xF2i, x\u01B0\u01A1ng h\u1EA1c m\xE0i l\xE0m l\xF5i c\xE1n. L\u1EEDa nh\u1ECF hong cho l\xF4ng v\u1EDBi x\u01B0\u01A1ng quen h\u01A1i nhau."
    },
    {
      "id": "dp.tran_but_pham",
      "nghe": "luyen_bao",
      "ten": "Thi\u1EBFt Kh\u1EAFc B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tran_but_pham",
      "chu": [
        {
          "id": "item.thiet_khoang",
          "so": 1
        }
      ],
      "phu": [],
      "linh_thach": 1,
      "mo_ta": "M\u1ED9t c\u1EE5c thi\u1EBFt kho\xE1ng nung \u0111\u1ECF, r\xE8n d\xE0i ra r\u1ED3i m\xE0i nh\u1ECDn. Th\u1EE3 r\xE8n n\xE0o c\u0169ng l\xE0m \u0111\u01B0\u1EE3c."
    },
    {
      "id": "dp.tran_but_hoang",
      "nghe": "luyen_bao",
      "ten": "H\xE0n Thi\u1EBFt Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tran_but_hoang",
      "chu": [
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 2,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 10,
      "mo_ta": "H\xE0n thi\u1EBFt r\xE8n th\xE0nh th\xE2n b\xFAt, m\u1ED9t v\u1ECB y\xEAu t\xE0i t\xF4i v\xE0o m\u0169i cho c\u1EE9ng. L\u1EEDa m\u1EA1nh, t\xF4i m\u1ED9t l\u1EA7n l\xE0 xong."
    },
    {
      "id": "dp.tran_but_huyen",
      "nghe": "luyen_bao",
      "ten": "Thanh Ng\u1ECDc Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tran_but_huyen",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.co_dong_tinh",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "Ph\xF4i thanh ng\u1ECDc ti\u1EC7n l\xE0m c\xE1n, tinh \u0111\u1ED3ng c\u1ED5 b\u1ECDc m\u0169i. L\u1EEDa nh\u1ECF hong l\xE2u cho ng\u1ECDc v\u1EDBi \u0111\u1ED3ng quen h\u01A1i nhau."
    },
    {
      "id": "dp.tran_but_dia",
      "nghe": "luyen_bao",
      "ten": "T\u1EED Kim Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tran_but_dia",
      "chu": [
        {
          "id": "item.tu_kim",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 40,
      "mo_ta": "T\u1EED kim \u0111\xFAc li\u1EC1n th\xE2n b\xFAt m\u1ED9t l\u1EA7n, l\u1EEDa m\u1EA1nh m\xE0 \u0111\u1EC1u tay. Ngu\u1ED9i r\u1ED3i m\u1EDBi m\xE0i m\u0169i."
    },
    {
      "id": "dp.tran_but_thien",
      "nghe": "luyen_bao",
      "ten": "Th\u1EA5t Tinh Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tran_but_thien",
      "chu": [
        {
          "id": "item.thien_ngoai_van_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "V\u1EABn thi\u1EBFt t\u1EEB tr\u1EDDi r\u01A1i xu\u1ED1ng, ph\u1EA3i l\u1EEDa m\u1EA1nh nh\u1EA5t m\u1EDBi ch\u1EA3y. B\u1EA3y \u0111i\u1EC3m sao kh\u1EA3m khi th\xE2n b\xFAt c\xF2n \u0111\u1ECF."
    },
    {
      "id": "dp.tran_but_tien",
      "nghe": "luyen_bao",
      "ten": "Huy\u1EC1n C\u01A1 Tr\u1EADn B\xFAt \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tran_but_tien",
      "chu": [
        {
          "id": "item.co_chung_dong",
          "so": 1
        },
        {
          "id": "item.hu_linh_phach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "\u0110\u1ED3ng chu\xF4ng c\u1ED5 \u0111\xFAc c\xE1n, h\u01B0 linh ph\xE1ch luy\u1EC7n v\xE0o m\u0169i cho b\xFAt c\xF3 linh. L\u1EEDa nh\u1ECF nung l\xE2u, ph\xE1ch t\u1EC9nh tr\u01B0\u1EDBc khi \u0111\u1ED3ng k\xEDn l\xE0 n\xF3 tr\u1ED1n."
    },
    {
      "id": "dp.pha_giap_toan_giac",
      "nghe": "luyen_bao",
      "ten": "Ph\xE1 Gi\xE1p To\u1EA3n \u0111\u1ED3 ph\u1ED5 (kim gi\xE1c)",
      "ra": "item.pha_giap_toan",
      "chu": [
        {
          "id": "item.kim_giac",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 20,
      "mo_ta": "\u0110\u1EA7u s\u1EEBng Kim Gi\xE1c T\xEA m\xE0i th\xE0nh m\u0169i khoan, h\xE0n thi\u1EBFt b\u1ECDc th\xE2n. L\u1EEDa v\u0169 nung s\u1EEBng cho t\u1EDBi khi s\u1EEBng ng\u1EA3 m\xE0u v\xE0ng \u0111\u1EADm."
    },
    {
      "id": "dp.linh_lung_thap_nha",
      "nghe": "luyen_bao",
      "ten": "Linh Lung Tr\u1EA5n Nh\u1EA1c Th\xE1p \u0111\u1ED3 ph\u1ED5 (c\u1EF1 t\u01B0\u1EE3ng nha)",
      "ra": "item.linh_lung_tran_nhac_thap",
      "chu": [
        {
          "id": "item.cu_tuong_nha",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "Ph\u1ECFng th\xE1p ti\xEAn nh\xE2n, l\u1EA5y ng\xE0 voi H\u1ED3ng Hoang l\xE0m c\u1ED1t b\u1EA3y t\u1EA7ng. M\u1ED7i t\u1EA7ng kh\u1EAFc m\u1ED9t v\xF2ng tu\u1ED5i c\u1EE7a ng\xE0, kh\u1EAFc sai th\xEC th\xE1p nghi\xEAng."
    },
    {
      "id": "dp.linh_lung_thap_quy",
      "nghe": "luyen_bao",
      "ten": "Linh Lung Tr\u1EA5n Nh\u1EA1c Th\xE1p \u0111\u1ED3 ph\u1ED5 (b\u1ED1i s\u01A1n quy gi\xE1p)",
      "ra": "item.linh_lung_tran_nhac_thap",
      "chu": [
        {
          "id": "item.boi_son_quy_giap",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "Mai r\xF9a c\xF5ng n\xFAi l\xE0 n\xFAi bi\u1EBFt \u0111i, \u0111em tr\u1EA5n v\xE0o \u0111\xE1y th\xE1p th\xEC th\xE1p n\u1EB7ng nh\u01B0 n\xFAi. L\u1EEDa v\u0103n ba ng\xE0y cho mai m\u1EC1m r\u1ED3i m\u1EDBi gh\xE9p."
    },
    {
      "id": "dp.than_hanh_ngoa_bao",
      "nghe": "luyen_bao",
      "ten": "Th\u1EA7n H\xE0nh Ngoa \u0111\u1ED3 ph\u1ED5 (da b\xE1o)",
      "ra": "item.than_hanh_ngoa",
      "chu": [
        {
          "id": "item.bao_bi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 15,
      "mo_ta": "Da b\xE1o \u0111en thay da h\u01B0\u01A1u, \u0111i \u0111\xEAm kh\xF4ng nghe ti\u1EBFng s\u1ED9t so\u1EA1t. Kh\u1EAFc tr\u1EADn v\u0103n l\xF3t \u0111\u1EBF b\u1EB1ng l\u1EEDa nh\u1ECF."
    },
    {
      "id": "dp.phu_but_thien_bao",
      "nghe": "luyen_bao",
      "ten": "B\u1ED3 \u0110\u1EC1 Ph\xF9 B\xFAt \u0111\u1ED3 ph\u1ED5 (l\xF4i v\u0103n b\xE1o b\xEC)",
      "ra": "item.phu_but_thien",
      "chu": [
        {
          "id": "item.loi_van_bao_bi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 150,
      "mo_ta": "C\u1EAFt s\u1EE3i l\xF4ng v\u1EB1n t\xEDm tr\xEAn da b\xE1o l\xE0m ng\xF2i, c\xE1n b\xFAt b\u1ECDc ph\u1EA7n da c\xF2n l\u1EA1i. Ng\xF2i t\u1EF1 t\xEA, v\u1EBD l\xF4i ph\xF9 kh\xF4ng c\u1EA7n g\u1ECDi s\xE9t."
    },
    {
      "id": "dp.van_doc_phien",
      "nghe": "luyen_bao",
      "ten": "V\u1EA1n \u0110\u1ED9c Phi\xEAn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.van_doc_phien",
      "chu": [
        {
          "id": "item.chuong_doc_tinh",
          "so": 2
        },
        {
          "id": "item.ngo_cong_doc_nang",
          "so": 1
        },
        {
          "id": "item.co_trung_mau",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 150,
      "mo_ta": "Th\u1EA3 c\u1ED5 m\u1EB9 v\xE0o b\xECnh ch\u01B0\u1EDBng kh\xED cho n\xF3 \u0103n \u0111\u1ED9c, r\u1ED3i t\u1EA9m c\u1EA3 b\xECnh v\xE0o c\u1EDD. T\xFAi \u0111\u1ED9c r\u1EBFt l\xE0m m\u1EF1c th\xEAu, ng\u01B0\u1EDDi luy\u1EC7n ph\u1EA3i ng\u1EADm gi\u1EA3i \u0111\u1ED9c \u0111an."
    },
    {
      "id": "dp.quy_giap_thuan_ngac",
      "nghe": "luyen_bao",
      "ten": "Quy Gi\xE1p Thu\u1EABn \u0111\u1ED3 ph\u1ED5 (v\u1EA3y c\xE1 s\u1EA5u)",
      "ra": "item.quy_giap_thuan",
      "chu": [
        {
          "id": "item.ngac_giap",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 2,
      "mo_ta": "V\u1EA3y l\u01B0ng c\xE1 s\u1EA5u tr\u1EAFng thay mai r\xF9a, vi\u1EC1n \u0111\u1ED3ng, quai da tr\xE2u. Ng\xE2m n\u01B0\u1EDBc m\u1ED9t \u0111\xEAm tr\u01B0\u1EDBc khi nung cho v\u1EA3y kh\u1ECFi n\u1EE9t."
    },
    {
      "id": "dp.khi_lo_dia_du",
      "nghe": "luyen_bao",
      "ten": "\u0110\u1ECBa M\u1EA1ch \u0111\u1EC9nh \u0111\u1ED3 ph\u1ED5 (k\xECnh du)",
      "ra": "item.khi_lo_dia",
      "chu": [
        {
          "id": "item.kinh_du",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 80,
      "mo_ta": "\u0110\xFAc \u0111\u1EC9nh b\u1EB1ng h\xE0n thi\u1EBFt, l\xF2ng \u0111\u1EC9nh qu\xE9t d\u1EA7u K\xECnh Ng\u01B0 cho l\u1EEDa \u0111\u1EC1u v\xE0 kim kh\xF4ng b\xE1m th\xE0nh. L\u1EEDa v\u0103n, qu\xE9t ba l\u1EDBp d\u1EA7u."
    },
    {
      "id": "dp.huyen_vu_thuan_ngac",
      "nghe": "luyen_bao",
      "ten": "Huy\u1EC1n V\u0169 Thu\u1EABn \u0111\u1ED3 ph\u1ED5 (huy\u1EC1n ng\u1EA1c gi\xE1p)",
      "ra": "item.huyen_vu_thuan",
      "chu": [
        {
          "id": "item.huyen_ngac_giap",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "Mai H\u1EAFc Th\u1EE7y Huy\u1EC1n Ng\u1EA1c thay mai quy long, \u0111en nh\u01B0 m\u1EF1c m\xE0 nh\u1EB9 h\u01A1n. Kh\u1EAFc tr\u1EADn v\u0103n th\u1EE7y h\u1EC7 d\u1ECDc v\xE2n mai."
    },
    {
      "id": "dp.phu_but_hoang_tho",
      "nghe": "luyen_bao",
      "ten": "Ph\xF9 b\xFAt \u0111\u1ED3 ph\u1ED5 (l\xF4ng th\u1ECF ng\u1ECDc)",
      "ra": "item.phu_but_hoang",
      "chu": [
        {
          "id": "item.ngoc_tho_mao",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "L\xF4ng th\u1ECF ng\u1ECDc b\xF3 l\xE0m \u0111\u1EA7u b\xFAt, \u0111\xEAm tr\u0103ng ng\xF2i t\u1EF1 s\xE1ng m\u1EDD. B\xF3 ch\u1EB7t, ng\xF2i m\u1EC1m m\xE0 kh\xF4ng x\u01A1."
    },
    {
      "id": "dp.bich_ba_linh_tan",
      "nghe": "luyen_bao",
      "ten": "B\xEDch Ba Linh T\xE1n \u0111\u1ED3 ph\u1ED5",
      "ra": "item.bich_ba_linh_tan",
      "chu": [
        {
          "id": "item.cam_ly_lan",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "Hai m\u1EA3nh v\u1EA3y c\xE1 ch\xE9p g\u1EA5m gh\xE9p l\xE0m ch\xF3p \xF4, l\u1EE5a xanh c\u0103ng quanh. V\u1EA3y n\u0103m m\xE0u gi\u1EEF m\xE0n n\u01B0\u1EDBc quanh th\xE2n."
    },
    {
      "id": "dp.luu_van_chu",
      "nghe": "luyen_bao",
      "ten": "L\u01B0u V\xE2n Chu \u0111\u1ED3 ph\u1ED5",
      "ra": "item.luu_van_chu",
      "chu": [
        {
          "id": "item.thanh_dieu_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "L\xF4ng chim xanh c\u1EE7a ti\xEAn nh\xE2n c\u1EAFm \u1EDF m\u0169i thuy\u1EC1n, th\u1EA3 gi\xF3 l\xE0 thuy\u1EC1n t\u1EF1 bi\u1EBFt h\u01B0\u1EDBng. G\u1ED7 tr\u1EA7m \u0111\u1EBDo theo d\xE1ng m\xE2y tr\xF4i."
    },
    {
      "id": "dp.tu_kim_phi_kiem_nha",
      "nghe": "luyen_bao",
      "ten": "T\u1EED Kim Phi Ki\u1EBFm \u0111\u1ED3 ph\u1ED5 (th\u1EF1c thi\u1EBFt nha)",
      "ra": "item.tu_kim_phi_kiem",
      "chu": [
        {
          "id": "item.thuc_thiet_nha",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 20,
      "mo_ta": "R\u0103ng th\xFA g\u1EB7m s\u1EAFt m\xE0i l\u01B0\u1EE1i, h\xE0n thi\u1EBFt l\xE0m th\xE2n. M\xE0i \u0111\u1EBFn khi l\u01B0\u1EE1i c\u1EAFt \u0111\u01B0\u1EE3c s\u1EE3i t\xF3c th\u1EA3 tr\xEAn m\u1EB7t n\u01B0\u1EDBc."
    },
    {
      "id": "dp.moc_dang_tac",
      "nghe": "luyen_bao",
      "ten": "M\u1ED9c \u0110\u1EB1ng T\xE1c \u0111\u1ED3 ph\u1ED5",
      "ra": "item.moc_dang_tac",
      "chu": [
        {
          "id": "item.thanh_dang_can",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 3,
      "mo_ta": "G\xE2n \u0110\u1EB1ng Y\xEAu b\u1EC7n ba s\u1EE3i th\xE0nh d\xE2y, ng\xE2m n\u01B0\u1EDBc thu\u1ED1c cho d\xE2y c\xF2n s\u1ED1ng. D\xE2y s\u1ED1ng th\xEC t\u1EF1 bi\u1EBFt qu\u1EA5n."
    },
    {
      "id": "dp.bich_lan_doc_cham",
      "nghe": "luyen_bao",
      "ten": "B\xEDch L\xE2n \u0110\u1ED9c Ch\xE2m \u0111\u1ED3 ph\u1ED5",
      "ra": "item.bich_lan_doc_cham",
      "chu": [
        {
          "id": "item.thuc_nhan_hoa_nhuy",
          "so": 1
        },
        {
          "id": "item.doc_khuan_bao",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 10,
      "mo_ta": "R\xE8n ba c\xE2y kim h\xE0n thi\u1EBFt, ng\xE2m v\xE0o nh\u1EE5y hoa \u0103n th\u1ECBt v\u1EDBi b\xE0o t\u1EED n\u1EA5m \u0111\u1ED9c cho ng\u1EA5m \u0111\u1EC1u. Ng\u01B0\u1EDDi r\xE8n \u0111eo bao tay da."
    },
    {
      "id": "dp.nhiep_hon_linh",
      "nghe": "luyen_bao",
      "ten": "Nhi\u1EBFp H\u1ED3n Linh \u0111\u1ED3 ph\u1ED5",
      "ra": "item.nhiep_hon_linh",
      "chu": [
        {
          "id": "item.hoe_am_moc",
          "so": 2
        },
        {
          "id": "item.oan_hon_ty",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 60,
      "mo_ta": "G\u1ED7 h\xF2e gi\u1EEF h\u1ED3n l\xE0m qu\u1EA3 l\u1EAFc, s\u1EE3i kh\xF3i oan h\u1ED3n qu\u1EA5n quanh d\xE2y treo. L\u1EAFc m\u1ED9t ti\u1EBFng l\xE0 h\u1ED3n k\u1EBB nghe ch\u1EADm l\u1EA1i."
    },
    {
      "id": "dp.thanh_moc_thuan",
      "nghe": "luyen_bao",
      "ten": "Thanh M\u1ED9c Thu\u1EABn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thanh_moc_thuan",
      "chu": [
        {
          "id": "item.thien_nien_moc_tam",
          "so": 1
        },
        {
          "id": "item.thanh_dang_can",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "L\xF5i c\xE2y ngh\xECn n\u0103m g\u1ECDt th\xE0nh thu\u1EABn tr\xF2n, g\xE2n \u0110\u1EB1ng Y\xEAu b\u1EC7n l\xE0m quai. L\u1EEDa v\u0103n hong, g\u1ED7 c\xF2n s\u1ED1ng th\xEC thu\u1EABn t\u1EF1 li\u1EC1n v\u1EBFt ch\xE9m."
    },
    {
      "id": "dp.phu_tang_than_moc",
      "nghe": "luyen_bao",
      "ten": "Ph\xF9 Tang Th\u1EA7n M\u1ED9c \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phu_tang_than_moc",
      "chu": [
        {
          "id": "item.ngo_dong_chi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "C\xE0nh ng\xF4 \u0111\u1ED3ng n\u01A1i Ph\u01B0\u1EE3ng \u0111\u1EADu, h\u01A1 l\u1EEDa v\u0103n \u0111\u1EBFn khi \u1EA5m nh\u01B0 n\u1EAFng s\u1EDBm. Kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 ch\xE1y, ch\xE1y l\xE0 m\u1EA5t sinh kh\xED."
    },
    {
      "id": "dp.hau_tho_thuan_tuy",
      "nghe": "luyen_bao",
      "ten": "H\u1EADu Th\u1ED5 Thu\u1EABn \u0111\u1ED3 ph\u1ED5 (th\u1EA1ch t\u1EE7y)",
      "ra": "item.hau_tho_thuan",
      "chu": [
        {
          "id": "item.thach_tuy_phan",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 5,
      "mo_ta": "R\u1EAFc b\u1ED9t th\u1EA1ch t\u1EE7y v\xE0o \u0111\u1EA5t s\xE9t \u0111\xFAc khi\xEAn, nung xong c\u1EE9ng nh\u01B0 s\u1EAFt. L\u1EEDa v\u0103n, nung m\u1ED9t ng\xE0y."
    },
    {
      "id": "dp.ban_son_an",
      "nghe": "luyen_bao",
      "ten": "B\xE0n S\u01A1n \u1EA4n \u0111\u1ED3 ph\u1ED5",
      "ra": "item.ban_son_an",
      "chu": [
        {
          "id": "item.son_tinh_hach",
          "so": 2
        },
        {
          "id": "item.linh_van_thach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 50,
      "mo_ta": "Hai l\xF5i S\u01A1n Tinh \xE9p l\xE0m th\xE2n \u1EA5n, m\u1EAFt tr\u1EADn b\u1EB1ng \u0111\xE1 linh v\u0103n \u0111\u1EB7t gi\u1EEFa m\u1EB7t \u1EA5n. \u1EA4n th\xE0nh th\xEC \u0111\u1EB7t xu\u1ED1ng \u0111\u1EA5t l\xE0 \u0111\u1EA5t l\xFAn."
    },
    {
      "id": "dp.dan_lo_huyen_dong",
      "nghe": "luyen_bao",
      "ten": "T\u1EED V\u0103n \u0111an l\xF4 \u0111\u1ED3 ph\u1ED5 (c\u1ED5 \u0111\u1ED3ng tinh)",
      "ra": "item.dan_lo_huyen",
      "chu": [
        {
          "id": "item.co_dong_tinh",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "Tr\u1ED9n \u0111\u1ED3ng g\u1EC9 c\u1EE7a \u0111\u1EC9nh th\xE0nh tinh v\xE0o h\xE0n thi\u1EBFt, l\xF2 gi\u1EEF l\u1EEDa \u0111\u1EC1u m\xE0 kh\u1ECFi kh\u1EAFc nhi\u1EC1u tr\u1EADn v\u0103n. G\xF5 th\u1EED nghe ng\xE2n nh\u01B0 chu\xF4ng nh\u1ECF l\xE0 \u0111\u01B0\u1EE3c."
    },
    {
      "id": "dp.thua_anh_kiem",
      "nghe": "luyen_bao",
      "ten": "Th\u1EEBa \u1EA2nh Ki\u1EBFm \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thua_anh_kiem",
      "chu": [
        {
          "id": "item.tan_kiem_y",
          "so": 2
        },
        {
          "id": "item.han_thiet",
          "so": 3
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 60,
      "mo_ta": "Hai m\u1EA3nh ki\u1EBFm g\xE3y c\xF2n ki\u1EBFm \xFD, gh\xE9p v\xE0o th\xE2n h\xE0n thi\u1EBFt. Ki\u1EBFm \xFD kh\xF4ng ch\u1ECBu nhau th\xEC r\xE8n m\xE3i kh\xF4ng li\u1EC1n, ph\u1EA3i \u0111\u1EC3 ng\u01B0\u1EDDi r\xE8n ng\u1ED3i tr\u01B0\u1EDBc ki\u1EBFm m\u1ED9t \u0111\xEAm."
    },
    {
      "id": "dp.hoi_am_thuan",
      "nghe": "luyen_bao",
      "ten": "H\u1ED3i \xC2m Thu\u1EABn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.hoi_am_thuan",
      "chu": [
        {
          "id": "item.co_chung_dong",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 3
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "\u0110\xFAc m\u1EA3nh chu\xF4ng ch\xF9a v\xE0o gi\u1EEFa m\u1EB7t thu\u1EABn h\xE0n thi\u1EBFt. \u0110\xFAc xong b\xFAng tay th\u1EED, ng\xE2n h\u1EBFt m\u1ED9t n\xE9n h\u01B0\u01A1ng m\u1EDBi \u0111\u1EA1t."
    },
    {
      "id": "dp.hau_tho_kim_cang_an",
      "nghe": "luyen_bao",
      "ten": "H\u1EADu Th\u1ED5 Kim Cang \u1EA4n \u0111\u1ED3 ph\u1ED5",
      "ra": "item.hau_tho_kim_cang_an",
      "chu": [
        {
          "id": "item.sa_trung_tam",
          "so": 2
        },
        {
          "id": "item.sa_linh_tinh",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "Tim sa tr\xF9ng l\xE0m l\xF5i \u1EA5n, c\xE1t linh \u0111\xFAc v\u1ECF ngo\xE0i. \u0110\u1EB7t \u1EA5n v\xE0o l\xF2, c\xE1t t\u1EF1 b\xF2 v\u1EC1 b\u1ECDc k\xEDn l\xF5i."
    },
    {
      "id": "dp.dia_sat_dinh",
      "nghe": "luyen_bao",
      "ten": "\u0110\u1ECBa S\xE1t \u0110inh \u0111\u1ED3 ph\u1ED5",
      "ra": "item.dia_sat_dinh",
      "chu": [
        {
          "id": "item.bach_cot_phan",
          "so": 1
        },
        {
          "id": "item.thi_du",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 5,
      "mo_ta": "R\xE8n b\u1EA3y \u0111inh h\xE0n thi\u1EBFt, t\xF4i trong d\u1EA7u thi r\u1ED3i l\u0103n qua b\u1ED9t x\u01B0\u01A1ng. L\u1EA5y \u0111\u1ED9c tr\u1ECB \u0111\u1ED9c, \u0111inh nh\u1EDB m\xF9i x\xE1c m\xE0 ghim."
    },
    {
      "id": "dp.huyet_anh_dao",
      "nghe": "luyen_bao",
      "ten": "Huy\u1EBFt \u1EA2nh \u0110ao \u0111\u1ED3 ph\u1ED5",
      "ra": "item.huyet_anh_dao",
      "chu": [
        {
          "id": "item.cuong_thi_nha",
          "so": 1
        },
        {
          "id": "item.thi_du",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 20,
      "mo_ta": "R\u0103ng c\u01B0\u01A1ng thi m\xE0i l\u01B0\u1EE1i, thi du t\xF4i l\u1EEDa, h\xE0n thi\u1EBFt l\xE0m s\u1ED1ng. Thi \u0111\u1ED9c trong l\u01B0\u1EE1i l\xE0m v\u1EBFt ch\xE9m kh\xF4ng ch\u1ECBu kh\xE9p."
    },
    {
      "id": "dp.khu_thi_linh",
      "nghe": "luyen_bao",
      "ten": "Khu Thi Linh \u0111\u1ED3 ph\u1ED5",
      "ra": "item.khu_thi_linh",
      "chu": [
        {
          "id": "item.thi_hach",
          "so": 1
        },
        {
          "id": "item.luyen_thi_phu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 50,
      "mo_ta": "Treo thi h\u1EA1ch trong l\xF2ng chu\xF4ng \u0111\u1ED3ng, d\xE1n l\xE1 ph\xF9 luy\u1EC7n thi l\xEAn quai. L\u1EEDa v\u0103n, chu\xF4ng ngu\u1ED9i r\u1ED3i m\u1EDBi g\u1EAFn l\u01B0\u1EE1i."
    },
    {
      "id": "dp.thien_dien_phap_y",
      "nghe": "luyen_bao",
      "ten": "Thi\xEAn Di\u1EC7n Ph\xE1p Y \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thien_dien_phap_y",
      "chu": [
        {
          "id": "item.hoa_bi",
          "so": 1
        },
        {
          "id": "item.bien_buc_si",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 50,
      "mo_ta": "T\u1EA5m h\u1ECDa b\xEC l\xE0m l\u1EDBp l\xF3t, c\xE1nh d\u01A1i m\xE0ng \u0111\u1ECF kh\xE2u l\u1EDBp ngo\xE0i. Kh\xE2u trong b\xF3ng t\u1ED1i, \u0111\u1EEBng nh\xECn v\xE0o m\u1EB7t v\u1EBD tr\xEAn da."
    },
    {
      "id": "dp.ho_tam_noi_giap",
      "nghe": "luyen_bao",
      "ten": "H\u1ED9 T\xE2m N\u1ED9i Gi\xE1p \u0111\u1ED3 ph\u1ED5",
      "ra": "item.ho_tam_noi_giap",
      "chu": [
        {
          "id": "item.thi_mao",
          "so": 1
        },
        {
          "id": "item.co_khoi_tan_giap",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "M\u1EA3nh gi\xE1p kh\xF4i l\u1ED7i c\u1ED5 c\u1EAFt l\xE0m t\u1EA5m h\u1ED9 t\xE2m, l\xF4ng Mao C\u01B0\u01A1ng d\u1EC7t quanh vi\u1EC1n. L\xF4ng c\u1EE9ng nh\u01B0 kim, ph\u1EA3i nung \u0111\u1ECF m\u1EDBi u\u1ED1n \u0111\u01B0\u1EE3c."
    },
    {
      "id": "dp.huyen_thiet_ho_uyen",
      "nghe": "luyen_bao",
      "ten": "Huy\u1EC1n Thi\u1EBFt H\u1ED9 Uy\u1EC3n \u0111\u1ED3 ph\u1ED5",
      "ra": "item.huyen_thiet_ho_uyen",
      "chu": [
        {
          "id": "item.moc_khoi_hach",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 5,
      "mo_ta": "L\xF5i kh\xF4i l\u1ED7i g\u1ED7 kh\u1EA3m trong bao c\u1ED5 tay, nh\u01B0 kh\u1EDBp tay ng\u01B0\u1EDDi g\u1ED7: g\u1EA1t \u0111ao xong, l\xF5i b\u1EADt l\u1EA1i \u0111\u1EA9y c\xFA \u0111\u1EA5m theo \u0111\xE0."
    },
    {
      "id": "dp.ly_hoa_hoan_dao",
      "nghe": "luyen_bao",
      "ten": "Ly H\u1ECFa Ho\xE0n \u0110ao \u0111\u1ED3 ph\u1ED5",
      "ra": "item.ly_hoa_hoan_dao",
      "chu": [
        {
          "id": "item.dong_khoi_hach",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 20,
      "mo_ta": "Th\xE1o ch\xEDn v\xF2ng xoay trong l\xF5i kh\xF4i l\u1ED7i \u0111\u1ED3ng, g\u1EAFn l\xEAn l\u01B0ng \u0111ao. V\xF2ng c\xF2n t\u1EF1 quay th\xEC m\u1ED7i nh\xE1t ch\xE9m ch\xEDn v\xF2ng c\xF9ng reo."
    },
    {
      "id": "dp.oanh_thien_loi_chuy",
      "nghe": "luyen_bao",
      "ten": "Oanh Thi\xEAn L\xF4i Ch\xF9y \u0111\u1ED3 ph\u1ED5",
      "ra": "item.oanh_thien_loi_chuy",
      "chu": [
        {
          "id": "item.co_khoi_hach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 100,
      "mo_ta": "\u0110\u1EADp v\u1EE1 v\u1ECF C\u1ED5 Kh\xF4i H\u1EA1ch, chia tia s\xE9t b\u1ECB nh\u1ED1t l\xE0m \u0111\xF4i, \u0111\xFAc v\xE0o hai \u0111\u1EA7u ch\xF9y. L\u1EEDa v\u0169, \u0111\xFAc d\u01B0\u1EDBi tr\u1EDDi gi\xF4ng."
    },
    {
      "id": "dp.phi_cuong_trao",
      "nghe": "luyen_bao",
      "ten": "Phi C\u01B0\u01A1ng Tr\u1EA3o \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phi_cuong_trao",
      "chu": [
        {
          "id": "item.phi_cuong_tuy",
          "so": 1
        },
        {
          "id": "item.thi_khoi_hach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "L\u1EA5y l\xF5i thi kh\xF4i l\xE0m kh\u1EDBp, t\u1EE7y Phi C\u01B0\u01A1ng r\xF3t v\xE0o l\xE0m g\xE2n. Vu\u1ED1t r\xE8n xong c\xF2n t\u1EF1 co du\u1ED7i, \u0111\u1EB7t trong h\u1ED9p s\u1EAFt."
    },
    {
      "id": "dp.huyet_ha_phien",
      "nghe": "luyen_bao",
      "ten": "Huy\u1EBFt H\xE0 Phi\xEAn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.huyet_ha_phien",
      "chu": [
        {
          "id": "item.huyet_anh_tinh",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "Tan Huy\u1EBFt \u1EA2nh Tinh v\xE0o ch\u1EADu n\u01B0\u1EDBc thu\u1ED1c, nh\xFAng l\u1EE5a tr\u1EAFng b\u1EA3y l\u1EA7n. L\u1EE5a \u0111\u1ECF th\u1EABm m\xE0 kh\xF4ng kh\xF4 th\xEC c\u1EDD \u0111\xE3 th\xE0nh."
    },
    {
      "id": "dp.van_quy_phien",
      "nghe": "luyen_bao",
      "ten": "V\u1EA1n Qu\u1EF7 Phi\xEAn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.van_quy_phien",
      "chu": [
        {
          "id": "item.quy_vuong_an",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "C\u1EAFm c\xE1n c\u1EDD v\xE0o Qu\u1EF7 V\u01B0\u01A1ng \u1EA4n, th\u1EAFp \xE2m h\u1ECFa b\u1EA3y \u0111\xEAm cho t\xEAn ng\u01B0\u1EDDi ch\u1EBFt tr\xEAn \u1EA5n b\xF2 l\xEAn m\u1EB7t c\u1EDD."
    },
    {
      "id": "dp.xich_huy_tien",
      "nghe": "luyen_bao",
      "ten": "X\xEDch H\u1EE7y Ti\xEAn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.xich_huy_tien",
      "chu": [
        {
          "id": "item.huy_lan",
          "so": 1
        },
        {
          "id": "item.han_thiet",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 80,
      "mo_ta": "V\u1EA3y H\u1EE7y gh\xE9p l\xEAn l\xF5i h\xE0n thi\u1EBFt nh\u01B0 v\u1EA3y r\u1EAFn th\u1EADt. L\u1EEDa v\u0169, v\u1EA3y n\xF3ng s\u1EB5n n\xEAn l\xF2 d\u1EC5 qu\xE1 l\u1EEDa."
    },
    {
      "id": "dp.bi_hi_tran_bi",
      "nghe": "luyen_bao",
      "ten": "B\xED H\xED Tr\u1EA5n Bi \u0111\u1ED3 ph\u1ED5",
      "ra": "item.bi_hi_tran_bi",
      "chu": [
        {
          "id": "item.bi_hi_giap",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "M\xE0i mai long t\u1EED th\xE0nh bia, kh\u1EAFc ng\u01B0\u1EE3c ch\u1EEF c\u0169 cho xu\xF4i l\u1EA1i. Ch\u1EEF xu\xF4i th\xEC bia m\u1EDBi ch\u1ECBu \u0111\u1EE9ng."
    },
    {
      "id": "dp.phi_lan_tieu",
      "nghe": "luyen_bao",
      "ten": "Phi L\xE2n Ti\xEAu \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phi_lan_tieu",
      "chu": [
        {
          "id": "item.trao_phong_lan",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 80,
      "mo_ta": "Chia v\u1EA3y long t\u1EED l\xE0m b\u1EA3y, m\xE0i m\u1ECFng nh\u01B0 l\xE1. Th\u1EA3 th\u1EED t\u1EEB m\xE1i nh\xE0, m\u1EA3nh n\xE0o l\u01B0\u1EE3n \u0111\u1EE7 m\u1ED9t v\xF2ng m\u1EDBi gi\u1EEF."
    },
    {
      "id": "dp.lieu_nguyen_phien",
      "nghe": "luyen_bao",
      "ten": "Li\u1EC7u Nguy\xEAn Phi\u1EBFn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.lieu_nguyen_phien",
      "chu": [
        {
          "id": "item.tat_phuong_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 100,
      "mo_ta": "K\u1EBFt l\xF4ng h\u1EA1c l\u1EEDa th\xE0nh qu\u1EA1t trong gian k\xEDn gi\xF3. C\xF3 gi\xF3 l\u1ECDt v\xE0o l\xE0 l\xF4ng b\xE9n l\u1EEDa, c\u1EA3 l\xF2 ch\xE1y theo."
    },
    {
      "id": "dp.quy_loi_co",
      "nghe": "luyen_bao",
      "ten": "Qu\u1EF3 L\xF4i C\u1ED5 \u0111\u1ED3 ph\u1ED5",
      "ra": "item.quy_loi_co",
      "chu": [
        {
          "id": "item.quy_nguu_bi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "C\u0103ng da tr\xE2u m\u1ED9t ch\xE2n l\xEAn tang tr\u1ED1ng \u0111\u1ED3ng, \u0111\xE1nh th\u1EED ba ti\u1EBFng d\u01B0\u1EDBi tr\u1EDDi gi\xF4ng. S\xE9t \u0111\xE1p l\u1EDDi th\xEC tr\u1ED1ng th\xE0nh."
    },
    {
      "id": "dp.toan_nghe_lu",
      "nghe": "luyen_bao",
      "ten": "Toan Ngh\xEA L\u01B0 \u0111\u1ED3 ph\u1ED5",
      "ra": "item.toan_nghe_lu",
      "chu": [
        {
          "id": "item.toan_nghe_tu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "Cu\u1ED9n r\xE2u long t\u1EED trong l\xF2ng l\u01B0 \u0111\u1ED3ng, l\u1EEDa v\u0103n hong ba ng\xE0y cho r\xE2u nh\u1EA3 m\xF9i tr\u1EA7m."
    },
    {
      "id": "dp.phi_liem_phong_y",
      "nghe": "luyen_bao",
      "ten": "Phi Li\xEAm Phong Y \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phi_liem_phong_y",
      "chu": [
        {
          "id": "item.phi_liem_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "D\u1EC7t l\xF4ng c\xE1nh th\u1EA7n gi\xF3 th\xE0nh \xE1o, khung d\u1EC7t ph\u1EA3i ch\u1EB7n \u0111\xE1. Bu\xF4ng tay l\xE0 s\u1EE3i bay m\u1EA5t."
    },
    {
      "id": "dp.cuu_anh_ho",
      "nghe": "luyen_bao",
      "ten": "C\u1EEDu Anh H\u1ED3 \u0111\u1ED3 ph\u1ED5",
      "ra": "item.cuu_anh_ho",
      "chu": [
        {
          "id": "item.cuu_anh_dam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "Chia m\u1EADt hung th\xFA l\xE0m \u0111\xF4i theo \u0111\u01B0\u1EDDng n\xF3ng l\u1EA1nh, m\u1ED7i n\u1EEDa m\u1ED9t ng\u0103n h\u1ED3 l\xF4. Hai ng\u0103n ph\u1EA3i ng\u0103n b\u1EB1ng ng\u1ECDc, sai m\u1ED9t khe l\xE0 n\u1ED5 l\xF2."
    },
    {
      "id": "dp.cung_ky_dao",
      "nghe": "luyen_bao",
      "ten": "C\xF9ng K\u1EF3 \u0110ao \u0111\u1ED3 ph\u1ED5",
      "ra": "item.cung_ky_dao",
      "chu": [
        {
          "id": "item.cung_ky_si",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "X\u01B0\u01A1ng c\xE1nh h\u1ED5 hung th\xFA l\xE0m s\u1ED1ng \u0111ao, r\xE8n b\u1EB1ng l\u1EEDa v\u0169. Ng\u01B0\u1EDDi r\xE8n c\xF3 t\u1ED9i th\xEC x\u01B0\u01A1ng \u1EA5m tay, r\xE8n d\u1EC5 h\u01A1n."
    },
    {
      "id": "dp.thao_thiet_an",
      "nghe": "luyen_bao",
      "ten": "Thao Thi\u1EBFt \u1EA4n \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thao_thiet_an",
      "chu": [
        {
          "id": "item.thao_thiet_van_cot",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "\u0110\xFAc \u0111\u1ED3ng quanh x\u01B0\u01A1ng h\xE0m Thao Thi\u1EBFt, gi\u1EEF nguy\xEAn v\xE2n c\u0169. \u0110\u1EEBng \u0111\u1EC3 \u0111an d\u01B0\u1EE3c trong gian luy\u1EC7n, x\u01B0\u01A1ng h\xFAt h\u1EBFt."
    },
    {
      "id": "dp.ly_long_giap",
      "nghe": "luyen_bao",
      "ten": "Ly Long Gi\xE1p \u0111\u1ED3 ph\u1ED5",
      "ra": "item.ly_long_giap",
      "chu": [
        {
          "id": "item.ly_long_lan",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "Ng\xE2m v\u1EA3y r\u1ED3ng trong ch\u1EADu n\u01B0\u1EDBc cho t\u1EDBi khi n\u01B0\u1EDBc th\xF4i xo\xE1y, r\u1ED3i m\u1EDBi k\u1EBFt gi\xE1p. V\u1EA3y c\xF2n xo\xE1y l\xE0 ch\u01B0a thu\u1EA7n."
    },
    {
      "id": "dp.hoa_lan_truong",
      "nghe": "luyen_bao",
      "ten": "H\u1ECFa L\xE2n Tr\u01B0\u1EE3ng \u0111\u1ED3 ph\u1ED5",
      "ra": "item.hoa_lan_truong",
      "chu": [
        {
          "id": "item.hoa_lan_giac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "G\u1EAFn s\u1EEBng H\u1ECFa L\xE2n l\xEAn \u0111\u1EA7u tr\u01B0\u1EE3ng t\u1EED \u0111\xE0n. Ng\u01B0\u1EDDi luy\u1EC7n ph\u1EA3i kh\xF4ng mang s\xE1t \xFD, l\u1EEDa trong s\u1EEBng m\u1EDBi ch\u1ECBu n\u1EB1m y\xEAn."
    },
    {
      "id": "dp.tinh_dau_thuan",
      "nghe": "luyen_bao",
      "ten": "Tinh \u0110\u1EA9u Thu\u1EABn \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tinh_dau_thuan",
      "chu": [
        {
          "id": "item.huyen_vu_van_giap",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "Gi\u1EEF nguy\xEAn v\xE2n sao tr\xEAn mai Huy\u1EC1n Quy, vi\u1EC1n \u0111\u1ED3ng \u0111en. Luy\u1EC7n d\u01B0\u1EDBi tr\u1EDDi sao, \u0111\xEAm c\xF3 m\xE2y th\xEC ngh\u1EC9."
    },
    {
      "id": "dp.hoa_loan_vu_y",
      "nghe": "luyen_bao",
      "ten": "H\u1ECFa Loan V\u0169 Y \u0111\u1ED3 ph\u1ED5",
      "ra": "item.hoa_loan_vu_y",
      "chu": [
        {
          "id": "item.hoa_loan_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "D\u1EC7t l\xF4ng \u0111u\xF4i H\u1ECFa Loan, l\u1EEDa v\u0103n hong su\u1ED1t. L\xF4ng ch\xE1y th\xEC \u0111\u1EE3i s\xE1ng h\xF4m sau m\u1ECDc l\u1EA1i r\u1ED3i d\u1EC7t ti\u1EBFp."
    },
    {
      "id": "dp.thanh_loan_tram",
      "nghe": "luyen_bao",
      "ten": "Thanh Loan Tr\xE2m \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thanh_loan_tram",
      "chu": [
        {
          "id": "item.thanh_loan_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "C\xE0i l\xF4ng Thanh Loan v\xE0o tr\xE2m ng\u1ECDc, c\u1EAFm tr\xE2m v\xE0o ch\u1EADu c\xE2y ba ng\xE0y. C\xE2y ra l\u1ED9c th\xEC tr\xE2m \u0111\xE3 th\xE0nh."
    },
    {
      "id": "dp.lang_nguyet_cau",
      "nghe": "luyen_bao",
      "ten": "Lang Nguy\u1EC7t C\xE2u \u0111\u1ED3 ph\u1ED5",
      "ra": "item.lang_nguyet_cau",
      "chu": [
        {
          "id": "item.thien_lang_nguyet_phach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "Kh\u1EA3m m\u1EAFt Thi\xEAn Lang v\xE0o chu\xF4i c\xE2u b\u1EA1c, luy\u1EC7n trong \u0111\xEAm tr\u0103ng tr\xF2n. S\xF3i quanh \u0111\xF3 h\xFA th\xEC ph\u1EA3i d\u1EEBng tay ch\u1EDD ch\xFAng im."
    },
    {
      "id": "dp.van_tuong_dien",
      "nghe": "luyen_bao",
      "ten": "V\u1EA1n T\u01B0\u1EDBng Di\u1EC7n \u0111\u1ED3 ph\u1ED5",
      "ra": "item.van_tuong_dien",
      "chu": [
        {
          "id": "item.van_tuong_ho_dien",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "Ph\u1EE7 m\u1EB7t ng\u01B0\u1EDDi H\u1ED3 V\u01B0\u01A1ng l\xEAn khu\xF4n ng\u1ECDc, l\u1EEDa v\u0103n hong cho m\u1EB7t qu\xEAn ch\u1EE7 c\u0169. Ng\u01B0\u1EDDi luy\u1EC7n \u0111\u1EEBng soi g\u01B0\u01A1ng trong l\xFAc \u1EA5y."
    },
    {
      "id": "dp.long_huyet_thuong",
      "nghe": "luyen_bao",
      "ten": "Long Huy\u1EBFt Th\u01B0\u01A1ng \u0111\u1ED3 ph\u1ED5",
      "ra": "item.long_huyet_thuong",
      "chu": [
        {
          "id": "item.long_huyet_giao_cot",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "\u0110\u1ED1t s\u1ED1ng giao v\u01B0\u01A1ng n\u1ED1i l\xE0m c\xE1n th\u01B0\u01A1ng, r\xE8n trong n\u01B0\u1EDBc l\u1EA1nh. N\u01B0\u1EDBc quanh c\xE1n s\xF4i h\u1EBFt ba v\u1EA1c m\u1EDBi th\xE0nh."
    },
    {
      "id": "dp.phu_dieu_si",
      "nghe": "luyen_bao",
      "ten": "Ph\xF9 Di\xEAu S\xED \u0111\u1ED3 ph\u1ED5",
      "ra": "item.phu_dieu_si",
      "chu": [
        {
          "id": "item.phu_dieu_than_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "K\u1EBFt l\xF4ng c\xE1nh ch\u1EE7 B\u1EB1ng V\u01B0\u01A1ng th\xE0nh \u0111\xF4i c\xE1nh, luy\u1EC7n tr\xEAn \u0111\u1EC9nh n\xFAi c\xF3 gi\xF3 l\u1EDBn. L\xF4ng t\u1EF1 l\u01A1 l\u1EEDng, khung ph\u1EA3i ch\u1EB1ng d\xE2y."
    },
    {
      "id": "dp.hung_tam_kinh",
      "nghe": "luyen_bao",
      "ten": "H\xF9ng T\xE2m K\xEDnh \u0111\u1ED3 ph\u1ED5",
      "ra": "item.hung_tam_kinh",
      "chu": [
        {
          "id": "item.thiet_the_hung_tam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "\u0110\xFAc \u0111\u1ED3ng quanh qu\u1EA3 tim H\xF9ng V\u01B0\u01A1ng th\xE0nh g\u01B0\u01A1ng h\u1ED9 t\xE2m, gi\u1EEF nguy\xEAn v\u1EBFt th\u1EC7 \u1EA5n \u1EDF m\u1EB7t sau."
    },
    {
      "id": "dp.bach_ho_dao",
      "nghe": "luyen_bao",
      "ten": "B\u1EA1ch H\u1ED5 \u0110ao \u0111\u1ED3 ph\u1ED5",
      "ra": "item.bach_ho_dao",
      "chu": [
        {
          "id": "item.bach_ho_huyet_phach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "Nung l\u01B0\u1EE1i \u0111ao \u0111\u1ECF r\u1ED3i t\xF4i qua tinh huy\u1EBFt B\u1EA1ch H\u1ED5 b\u1EA3y l\u1EA7n. L\u01B0\u1EE1i tr\u1EAFng nh\u01B0 s\u01B0\u01A1ng l\xE0 xong."
    },
    {
      "id": "dp.tu_sa_doc_cham",
      "nghe": "luyen_bao",
      "ten": "T\u1EED Sa \u0110\u1ED9c Ch\xE2m \u0111\u1ED3 ph\u1ED5",
      "ra": "item.tu_sa_doc_cham",
      "chu": [
        {
          "id": "item.tu_sa_doc_tuy",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "Ng\xE2m ch\xEDn c\xE2y kim trong t\u1EE7y \u0111\u1ED9c H\u1EA1t V\u01B0\u01A1ng b\u1ED1n m\u01B0\u01A1i ch\xEDn ng\xE0y. B\xECnh ng\xE2m ph\u1EA3i l\xE0 ng\u1ECDc, \u0111\u1ED3 s\u1EE9 b\u1ECB \u0103n th\u1EE7ng."
    },
    {
      "id": "dp.vien_tam_moc_ngu",
      "nghe": "luyen_bao",
      "ten": "Vi\xEAn T\xE2m M\u1ED9c Ng\u01B0 \u0111\u1ED3 ph\u1ED5",
      "ra": "item.vien_tam_moc_ngu",
      "chu": [
        {
          "id": "item.thinh_phap_vien_tam",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "Kho\xE9t m\xF5 g\u1ED7, kh\u1EA3m vi\xEAn t\xE2m ng\u1ECDc v\xE0o l\xF2ng m\xF5. Luy\u1EC7n v\u1EEBa luy\u1EC7n v\u1EEBa t\u1EE5ng kinh, \u0111\u1EE9t ti\u1EBFng t\u1EE5ng l\xE0 ng\u1ECDc n\u1EE9t."
    },
    {
      "id": "dp.kim_thue_bao_y",
      "nghe": "luyen_bao",
      "ten": "Kim Thu\u1EBF B\u1EA3o Y \u0111\u1ED3 ph\u1ED5",
      "ra": "item.kim_thue_bao_y",
      "chu": [
        {
          "id": "item.kim_than_xa_thue",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "C\u1EAFt x\xE1c l\u1ED9t X\xE0 V\u01B0\u01A1ng may \xE1o, gi\u1EEF nguy\xEAn l\u1EDBp v\u1EA3y v\xE0ng. Luy\u1EC7n xong ph\u1EA3i \u0111em qua m\u1ED9t ng\xF4i mi\u1EBFu cho h\u01B0\u01A1ng kh\xF3i \xE1m v\xE0o."
    },
    {
      "id": "dp.liet_ung_cung",
      "nghe": "luyen_bao",
      "ten": "Li\u1EC7t \u01AFng Cung \u0111\u1ED3 ph\u1ED5",
      "ra": "item.liet_ung_cung",
      "chu": [
        {
          "id": "item.ung_ton_cuong_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 300,
      "mo_ta": "L\xF4ng c\xE1nh \u01B0ng t\xF4n c\u1EAFt l\xE0m \u0111u\xF4i t\xEAn, s\u1EEBng th\xFA l\xE0m th\xE2n cung. M\xE9p l\xF4ng s\u1EAFc, c\u1EAFm \u0111u\xF4i t\xEAn ph\u1EA3i \u0111eo bao tay."
    },
    {
      "id": "dp.thon_kim_dai",
      "nghe": "luyen_bao",
      "ten": "Th\xF4n Kim \u0110\u1EA1i \u0111\u1ED3 ph\u1ED5",
      "ra": "item.thon_kim_dai",
      "chu": [
        {
          "id": "item.thon_kim_thu_nang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "L\u1ED9n t\xFAi m\xE1 chu\u1ED9t gi\xE0, kh\xE2u mi\u1EC7ng b\u1EB1ng ch\u1EC9 v\xE0ng, kh\u1EAFc tr\u1EADn v\u0103n thu n\u1EA1p l\xEAn l\u1EDBp l\xF3t."
    },
    {
      "id": "dp.cuu_pham_lien_dai_thiem",
      "nghe": "luyen_bao",
      "ten": "C\u1EEDu Ph\u1EA9m Li\xEAn \u0110\xE0i \u0111\u1ED3 ph\u1ED5 (thi\u1EC1m ch\xE2u)",
      "ra": "item.cuu_pham_lien_dai",
      "chu": [
        {
          "id": "item.thon_nguyet_thiem_chau",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "\u0110\u1EB7t thi\u1EC1m ch\xE2u gi\u1EEFa \u0111\xE0i sen ch\xEDn t\u1EA7ng c\xE1nh, b\xF3ng tr\u0103ng trong ch\xE2u t\u1EE5 linh kh\xED th\xE0nh s\u01B0\u01A1ng. L\u1EEDa v\u0103n, luy\u1EC7n ba \u0111\xEAm tr\u0103ng."
    },
    {
      "id": "dp.tu_thu_tien_y_chu",
      "nghe": "luyen_bao",
      "ten": "T\u1EED Th\u1EE5 Ti\xEAn Y \u0111\u1ED3 ph\u1ED5 (v\u1EA1n ti chu nang)",
      "ra": "item.tu_thu_tien_y",
      "chu": [
        {
          "id": "item.van_ti_chu_nang",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "B\xF3p tuy\u1EBFn t\u01A1 nh\u1EC7n m\u1EB9 l\u1EA5y s\u1EE3i b\u1EA1c, d\u1EC7t li\u1EC1n kh\xF4ng n\u1ED1i. Th\u1EE3 d\u1EC7t ng\u1ED3i khung m\u1ED9t m\u1EA1ch \u0111\u1EBFn khi h\u1EBFt t\u01A1."
    },
    {
      "id": "dp.dinh_hai_chau_ca",
      "nghe": "luyen_bao",
      "ten": "\u0110\u1ECBnh H\u1EA3i Ch\xE2u \u0111\u1ED3 ph\u1ED5 (h\u1EA3i ca ch\xE2u)",
      "ra": "item.dinh_hai_chau",
      "chu": [
        {
          "id": "item.hai_ca_chau",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "L\u1EA5y ng\u1ECDc trai ng\u01B0 c\u01A1 l\xE0m h\u1EA1t c\xE1i, t\u1EE5 n\u01B0\u1EDBc bi\u1EC3n quanh th\xE0nh chu\u1ED7i ch\xE2u. Ng\u01B0\u1EDDi luy\u1EC7n b\u1ECBt tai, nghe ti\u1EBFng h\xE1t l\xE0 l\u1EA1c tay."
    },
    {
      "id": "dp.quy_tuc_phu",
      "nghe": "che_phu",
      "ten": "Quy T\u1EE9c Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.quy_tuc_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "Kh\xE9p tr\u1EADn v\u0103n trong gi\u1EA5y ng\u1ECDc \u0111\u1EC3 t\xECm l\u1EA1i tr\u1EADn \u0111\xE3 bi\u1EBFt c\xF9ng Th\u1ED5."
    },
    {
      "id": "dp.na_di_phu",
      "nghe": "che_phu",
      "ten": "Na Di Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.na_di_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "V\u1EBD v\xF2ng ph\xF9 li\u1EC1n n\xE9t, d\u1EDDi th\xE2n trong t\u1EA7m ba ngh\xECn d\u1EB7m."
    },
    {
      "id": "dp.hoa_dan_phu",
      "nghe": "che_phu",
      "ten": "H\u1ECFa \u0110\u1EA1n Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.hoa_dan_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 2,
      "mo_ta": "Ph\xF9 t\u1EADp tay c\u1EE7a ph\xF9 \u0111\u1ED3. V\xF2ng xo\xE1y ph\u1EA3i v\u1EBD m\u1ED9t h\u01A1i, d\u1EEBng b\xFAt gi\u1EEFa ch\u1EEBng th\xEC l\u1EEDa t\u1EAFt trong gi\u1EA5y."
    },
    {
      "id": "dp.bua_tru_ta",
      "nghe": "che_phu",
      "ten": "B\xF9a tr\u1EEB t\xE0 ph\u01B0\u01A1ng",
      "ra": "item.bua_tru_ta",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 6,
      "mo_ta": "M\u1EF1c chu sa h\xF2a n\u01B0\u1EDBc l\xE1 c\xE2y s\u1EAFc \u0111\u1EB7c. \xD4ng t\u1EEB d\u1EB7n v\u1EBD m\u1ED9t h\u01A1i kh\xF4ng \u0111\u1EE9t, n\xE9t \u0111\u1EE9t th\xEC d\u01B0\u01A1ng kh\xED r\xF2 ra."
    },
    {
      "id": "dp.canh_kim_phu",
      "nghe": "che_phu",
      "ten": "Canh Kim Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.canh_kim_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.lang_nha",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "R\u0103ng s\xF3i nghi\u1EC1n m\u1ECBn tr\u1ED9n v\xE0o chu sa. N\xE9t ph\xF9 s\u1EAFc nh\u01B0 v\u1EBFt dao, ph\u1EA3i h\u1EA1 b\xFAt d\u1EE9t kho\xE1t."
    },
    {
      "id": "dp.dan_loi_phu",
      "nghe": "che_phu",
      "ten": "D\u1EABn L\xF4i Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.dan_loi_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 8,
      "mo_ta": "Ph\u1EA3i v\u1EBD l\xFAc tr\u1EDDi oi, m\u1EF1c y\xEAu huy\u1EBFt m\u1EDBi b\u1EAFt \u0111\u01B0\u1EE3c l\xF4i kh\xED. N\xE9t ng\u1EADp ng\u1EEBng th\xEC s\xE9t \u0111\xE1nh ng\u01B0\u1EE3c v\xE0o tay."
    },
    {
      "id": "dp.dinh_than_phu",
      "nghe": "che_phu",
      "ten": "\u0110\u1ECBnh Th\xE2n Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.dinh_than_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.thiem_to",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 8,
      "mo_ta": "M\u1ED9t gi\u1ECDt m\u1EE7 c\xF3c y\xEAu h\xF2a v\xE0o m\u1EF1c. Ph\u1EA3i v\u1EBD ch\u1EADm, n\xE9t cu\u1ED1i kh\xE9p v\xF2ng m\u1EDBi gi\u1EEF \u0111\u01B0\u1EE3c ng\u01B0\u1EDDi."
    },
    {
      "id": "dp.kim_cuong_phu",
      "nghe": "che_phu",
      "ten": "Kim C\u01B0\u01A1ng Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.kim_cuong_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "tho"
          ],
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 5,
      "mo_ta": "Ph\xF9 h\u1ED9 th\xE2n ch\xE9p t\u1EEB kinh nh\xE0 ch\xF9a. N\xE9t d\xE0y, ch\u1EADm, \u0111\u1EC1u tay nh\u01B0 t\u1EE5ng kinh."
    },
    {
      "id": "dp.than_hanh_phu",
      "nghe": "che_phu",
      "ten": "Th\u1EA7n H\xE0nh Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.than_hanh_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "so": 1
        }
      ],
      "linh_thach": 5,
      "mo_ta": "M\u1EF1c ng\xE2m m\u1ED9t v\u1ECB th\u1EA3o d\u01B0\u1EE3c h\u1EC7 m\u1ED9c cho nh\u1EB9 ch\xE2n. Kh\xF4ng k\xE9n n\xE9t b\xFAt, ph\xF9 \u0111\u1ED3 n\xE0o c\u0169ng v\u1EBD \u0111\u01B0\u1EE3c."
    },
    {
      "id": "dp.truyen_am_phu",
      "nghe": "che_phu",
      "ten": "Truy\u1EC1n \xC2m Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.truyen_am_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "thuy"
          ],
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 3,
      "mo_ta": "N\u01B0\u1EDBc m\xE0i m\u1EF1c ph\u1EA3i l\xE0 n\u01B0\u1EDBc s\u01B0\u01A1ng c\u1EE7a m\u1ED9t v\u1ECB linh d\u01B0\u1EE3c h\u1EC7 th\u1EE7y, ti\u1EBFng n\xF3i m\u1EDBi th\u1EA5m v\xE0o gi\u1EA5y. G\u1EA5p h\u1EA1c cho ch\u1EADm."
    },
    {
      "id": "dp.tam_lo_phu",
      "nghe": "che_phu",
      "ten": "T\u1EA7m L\u1ED9 Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.tam_lo_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 2
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "tho"
          ],
          "so": 1
        }
      ],
      "linh_thach": 5,
      "mo_ta": "R\u1EAFc b\u1ED9t r\u1EC5 c\xE2y h\u1EC7 th\u1ED5 l\xEAn gi\u1EA5y tr\u01B0\u1EDBc khi v\u1EBD, ph\xF9 m\u1EDBi nh\u1EADn ra \u0111\u1EA5t. Hai l\u1EDBp gi\u1EA5y d\xE1n ch\u1ED3ng cho bay \u0111\u01B0\u1EE3c xa."
    },
    {
      "id": "dp.thanh_phong_phu",
      "nghe": "che_phu",
      "ten": "Thanh Phong Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thanh_phong_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 2
        },
        {
          "id": "item.hac_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "L\xF4ng h\u1EA1c \u0111\u1ED1t th\xE0nh tro h\xF2a v\xE0o m\u1EF1c. N\xE9t ph\u1EA3i nh\u1EB9 nh\u01B0 l\xF4ng, n\u1EB7ng tay m\u1ED9t ch\xFAt l\xE0 gi\xF3 kh\xF4ng ra."
    },
    {
      "id": "dp.thien_ti_phu",
      "nghe": "che_phu",
      "ten": "Thi\xEAn Ti Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thien_ti_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 2
        },
        {
          "id": "item.chu_ty",
          "so": 2
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "Se t\u01A1 nh\u1EC7n y\xEAu v\xE0o t\u1EEBng n\xE9t, ch\xEDn v\xF2ng l\u01B0\u1EDBi kh\xF4ng v\xF2ng n\xE0o \u0111\u01B0\u1EE3c \u0111\u1EE9t. Ai n\xF3ng v\u1ED9i th\xEC t\u01A1 r\u1ED1i th\xE0nh c\u1EE5c."
    },
    {
      "id": "dp.huyen_quy_phu",
      "nghe": "che_phu",
      "ten": "Huy\u1EC1n Quy Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.huyen_quy_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 2
        },
        {
          "id": "item.quy_giap",
          "so": 1
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "Mai r\xF9a nghi\u1EC1n l\xE0m n\u1EC1n, n\xE9t ph\xF9 v\u1EBD theo v\xE2n mai. Ch\u1EADm th\xEC s\u1ED1ng, nhanh th\xEC v\u1EE1."
    },
    {
      "id": "dp.dia_don_phu",
      "nghe": "che_phu",
      "ten": "\u0110\u1ECBa \u0110\u1ED9n Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.dia_don_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 2
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "tho"
          ],
          "so": 2
        }
      ],
      "linh_thach": 25,
      "mo_ta": "M\u1EF1c h\xF2a \u0111\u1EA5t l\u1EA5y t\u1EEB \u0111\xE1y gi\u1EBFng s\xE2u c\xF9ng hai v\u1ECB linh d\u01B0\u1EE3c h\u1EC7 th\u1ED5. Ph\xF9 gi\u1EEF m\u1EA1ng, t\xE1n tu n\xE0o c\xF3 \u0111\u01A1n n\xE0y c\u0169ng gi\u1EA5u k\u1EF9."
    },
    {
      "id": "dp.huyen_bang_phu",
      "nghe": "che_phu",
      "ten": "Huy\u1EC1n B\u0103ng Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.huyen_bang_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.bang_vu",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "bang",
            "thuy"
          ],
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "van",
      "mo_ta": "L\xF4ng chim b\u1EB1ng l\xE0m ng\xF2i ph\u1EE5, m\u1EF1c pha nh\u1EF1a linh d\u01B0\u1EE3c h\xE0n th\u1EE7y. Ph\u1EA3i v\u1EBD trong gian l\u1EA1nh, m\u1EF1c \u1EA5m l\xE0 b\u0103ng kh\xF4ng k\u1EBFt."
    },
    {
      "id": "dp.tu_tieu_loi_phu",
      "nghe": "che_phu",
      "ten": "T\u1EED Ti\xEAu L\xF4i Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.tu_tieu_loi_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "loi"
          ],
          "pham": 3,
          "so": 2
        }
      ],
      "hoa": "vu",
      "linh_thach": 80,
      "mo_ta": "V\u1EBD trong \u0111\xEAm gi\xF4ng, m\u1ED9t h\u01A1i t\u1EEB \u0111\u1EA7u t\u1EDBi cu\u1ED1i, \u0111\u1EE3i s\xE9t \u0111\xE1nh xu\u1ED1ng m\u1EDBi h\u1EA1 n\xE9t ch\xF3t. Ch\u1EADm m\u1ED9t nh\u1ECBp l\xE0 l\xF4i kh\xED tan."
    },
    {
      "id": "dp.kim_thiem_phu",
      "nghe": "che_phu",
      "ten": "Kim Thi\u1EC1m Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.kim_thiem_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        },
        {
          "id": "item.kim_thiem_bao_chau",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "B\u1EA3o ch\xE2u c\xF3c y\xEAu m\xE0i th\xE0nh b\u1ED9t h\xF2a v\xE0o m\u1EF1c. V\u1EBD ch\u1EADm, n\xE9t cu\u1ED1i th\u1EAFt l\u1EA1i nh\u01B0 mi\u1EC7ng c\xF3c kh\xE9p."
    },
    {
      "id": "dp.cuu_tieu_phong_phu",
      "nghe": "che_phu",
      "ten": "C\u1EEDu Ti\xEAu Phong Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.cuu_tieu_phong_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.tien_hac_tho_cot",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "X\u01B0\u01A1ng h\u1EA1c ti\xEAn l\xE0m c\xE1n ng\xF2i ph\u1EE5, gi\xF3 trong x\u01B0\u01A1ng th\u1ED5i theo n\xE9t. V\u1EBD m\u1ED9t h\u01A1i t\u1EEB d\u01B0\u1EDBi l\xEAn nh\u01B0 h\u1EA1c c\u1EA5t c\xE1nh."
    },
    {
      "id": "dp.pha_quan_phu",
      "nghe": "che_phu",
      "ten": "Ph\xE1 Qu\xE2n Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.pha_quan_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        },
        {
          "id": "item.huyet_nguyet_lang_nha",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "Ph\xF9 c\u1EE7a th\u1EE3 ph\xF9 quan \u1EA3i L\u01B0\u01A1ng Qu\u1ED1c, nghi\u1EC1n nanh s\xF3i tr\u0103ng m\xE1u v\xE0o chu sa. N\xE9t ph\xF9 s\u1EAFc nh\u01B0 v\u1EBFt ch\xE9m, h\u1EA1 b\xFAt kh\xF4ng \u0111\u01B0\u1EE3c ngo\xE1i l\u1EA1i."
    },
    {
      "id": "dp.bat_dong_phu",
      "nghe": "che_phu",
      "ten": "B\u1EA5t \u0110\u1ED9ng Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.bat_dong_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        },
        {
          "id": "item.kim_boi_hung_bi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "Da l\u01B0ng g\u1EA5u y\xEAu c\u1EAFt th\xE0nh t\u1EA5m m\u1ECFng l\xE0m n\u1EC1n ph\xF9 thay gi\u1EA5y. N\xE9t d\xE0y v\xE0 ch\u1EADm, nh\u01B0 ng\u01B0\u1EDDi \u0111\u1EAFp \u0111\xEA."
    },
    {
      "id": "dp.kim_lan_doc_phu",
      "nghe": "che_phu",
      "ten": "Kim L\xE2n \u0110\u1ED9c Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.kim_lan_doc_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.kim_lan_mang_dom",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "yeu_tai",
          "pham": 5,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 50,
      "mo_ta": "M\u1EADt m\xE3ng x\xE0 pha m\u1EF1c, th\xEAm m\u1ED9t v\u1ECB y\xEAu t\xE0i c\u1EA5p cao cho \u0111\u1ED9c kh\u1ECFi c\u1EAFn ng\u01B0\u1EE3c. Ng\u01B0\u1EDDi v\u1EBD ng\u1EADm gi\u1EA3i \u0111\u1ED9c \u0111an, m\u1ED7i n\xE9t th\u1EDF m\u1ED9t h\u01A1i."
    },
    {
      "id": "dp.canh_kim_phu_nha",
      "nghe": "che_phu",
      "ten": "Canh Kim Ph\xF9 ph\u01B0\u01A1ng (nanh l\u1EE3n)",
      "ra": "item.canh_kim_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.tru_nha",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "Nanh l\u1EE3n r\u1EEBng nghi\u1EC1n b\u1ED9t tr\u1ED9n v\xE0o chu sa, n\xE9t ph\xF9 c\u1EE9ng nh\u01B0 m\u0169i gi\xE1o. V\u1EBD m\u1ED9t h\u01A1i, \u0111\u1EEBng nh\u1EA5c b\xFAt gi\u1EEFa ch\u1EEBng."
    },
    {
      "id": "dp.dinh_than_phu_diep",
      "nghe": "che_phu",
      "ten": "\u0110\u1ECBnh Th\xE2n Ph\xF9 ph\u01B0\u01A1ng (\u0111i\u1EC7p ph\u1EA5n)",
      "ra": "item.dinh_than_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.diep_phan",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "Ph\u1EA5n c\xE1nh b\u01B0\u1EDBm r\u1EAFc l\xEAn m\u1EF1c c\xF2n \u01B0\u1EDBt, n\xE9t ph\xF9 \xF3ng \xE1nh nh\u01B0 b\u1EE5i tr\u0103ng. Ng\u01B0\u1EDDi v\u1EBD ph\u1EA3i b\u1ECBt m\u0169i."
    },
    {
      "id": "dp.na_di_phu_sa",
      "nghe": "che_phu",
      "ten": "Na Di Ph\xF9 ph\u01B0\u01A1ng (sa linh)",
      "ra": "item.na_di_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.sa_linh_tinh",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "C\xE1t linh lu\xF4n b\xF2 v\u1EC1 m\u1ED9t \u0111\u1ED1ng, tr\u1ED9n v\xE0o m\u1EF1c th\xEC ph\xF9 c\u0169ng bi\u1EBFt \u0111\u01B0\u1EDDng v\u1EC1 ch\u1ED7 c\u0169. R\u1EAFc c\xE1t l\xEAn gi\u1EA5y tr\u01B0\u1EDBc khi v\u1EBD."
    },
    {
      "id": "dp.dia_don_phu_vu",
      "nghe": "che_phu",
      "ten": "\u0110\u1ECBa \u0110\u1ED9n Ph\xF9 ph\u01B0\u01A1ng (v\u1EE5 tinh)",
      "ra": "item.dia_don_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 2
        },
        {
          "id": "item.vu_tinh",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "M\u1EDF n\u1EAFp l\u1ECD s\u01B0\u01A1ng trong gian k\xEDn, \u0111\u1EC3 s\u01B0\u01A1ng th\u1EA5m v\xE0o gi\u1EA5y r\u1ED3i m\u1EDBi v\u1EBD. Ph\xF9 \u0111\u1ED9n k\xE8m m\u1ED9t l\xE0n s\u01B0\u01A1ng, k\u1EBB \u0111\u1ECBch kh\xF4ng th\u1EA5y ng\u01B0\u1EDDi ch\xECm xu\u1ED1ng \u0111\xE2u."
    },
    {
      "id": "dp.huyen_bang_phu_chau",
      "nghe": "che_phu",
      "ten": "Huy\u1EC1n B\u0103ng Ph\xF9 ph\u01B0\u01A1ng (b\u0103ng ph\xE1ch ch\xE2u)",
      "ra": "item.huyen_bang_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.bang_phach_chau",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "Hai h\u1EA1t b\u0103ng ph\xE1ch ch\xE2u m\xE0i trong nghi\xEAn \u0111\xE1 l\u1EA1nh, m\u1EF1c \u0111\u1EB7c nh\u01B0 s\u01B0\u01A1ng \u0111\xF4ng. V\u1EBD xong ph\u1EA3i \u0111\u1EC3 ph\xF9 trong h\u1ED9p \u0111\xE1."
    },
    {
      "id": "dp.thuong_lang_phu",
      "nghe": "che_phu",
      "ten": "Th\u01B0\u01A1ng L\xE3ng Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thuong_lang_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.thuy_linh_chau",
          "so": 2
        },
        {
          "id": "item.thuy_hau_mao",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "Th\u1EE7y linh ch\xE2u m\xE0i l\xE0m m\u1EF1c, l\xF4ng kh\u1EC9 n\u01B0\u1EDBc b\u1EC7n l\xE0m ng\xF2i cho n\xE9t ph\xF9 tr\u01A1n nh\u01B0 n\u01B0\u1EDBc ch\u1EA3y. V\u1EBD b\xEAn b\u1EDD s\xF4ng th\xEC d\u1EC5 th\xE0nh."
    },
    {
      "id": "dp.liet_diem_phu",
      "nghe": "che_phu",
      "ten": "Li\u1EC7t Di\u1EC5m Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.liet_diem_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.hoa_tinh_chau",
          "so": 2
        },
        {
          "id": "item.hoa_ke_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "H\u1ECFa tinh ch\xE2u t\xE1n b\u1ED9t tr\u1ED9n chu sa, l\xF4ng \u0111u\xF4i g\xE0 l\u1EEDa l\xE0m ng\xF2i. Ng\xF2i b\xE9n l\u1EEDa th\xEC ph\u1EA3i v\u1EBD nhanh tr\u01B0\u1EDBc khi ch\xE1y h\u1EBFt."
    },
    {
      "id": "dp.toan_phong_phu",
      "nghe": "che_phu",
      "ten": "To\xE0n Phong Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.toan_phong_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.phong_linh_chau",
          "so": 2
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "Phong linh ch\xE2u nghi\u1EC1n trong l\u1ECD k\xEDn, m\u1EDF ra l\xE0 b\u1ED9t bay. \u0110\xF3ng c\u1EEDa gian v\u1EBD, v\u1EBD n\xE9t xo\xE1y t\u1EEB ngo\xE0i v\xE0o trong."
    },
    {
      "id": "dp.thien_loi_phu",
      "nghe": "che_phu",
      "ten": "Thi\xEAn L\xF4i Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thien_loi_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.loi_linh_chau",
          "so": 2
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 50,
      "mo_ta": "Hai h\u1EA1t l\xF4i linh ch\xE2u t\xE1n trong c\u1ED1i \u0111\xE1, tay ng\u01B0\u1EDDi t\xE1n ph\u1EA3i b\u1ECDc v\u1EA3i. V\u1EBD d\u01B0\u1EDBi tr\u1EDDi gi\xF4ng, n\xE9t ch\xF3t h\u1EA1 \u0111\xFAng l\xFAc s\u1EA5m n\u1ED5."
    },
    {
      "id": "dp.toa_hon_phu",
      "nghe": "che_phu",
      "ten": "T\u1ECFa H\u1ED3n Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.toa_hon_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.am_phu_chi",
          "so": 1
        },
        {
          "id": "item.am_thuy_chau",
          "so": 1
        },
        {
          "id": "item.oan_hon_ty",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "Gi\u1EA5y h\xECnh nh\xE2n c\u0169 l\xE0m gi\u1EA5y ph\xF9, n\u01B0\u1EDBc ch\xE2u \xE2m th\u1EE7y l\xE0m m\u1EF1c, s\u1EE3i kh\xF3i oan h\u1ED3n qu\u1EA5n v\xE0o n\xE9t ch\xF3t. V\u1EBD l\xFAc n\u1EEDa \u0111\xEAm, \u0111\u1EEBng quay \u0111\u1EA7u."
    },
    {
      "id": "dp.am_binh_phu",
      "nghe": "che_phu",
      "ten": "\xC2m Binh Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.am_binh_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.am_binh_lenh",
          "so": 1
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "\u0110\u1EB7t th\u1EBB l\u1EC7nh \xE2m binh gi\u1EEFa gi\u1EA5y, v\u1EBD ph\xF9 v\xF2ng quanh r\u1ED3i \xE9p th\u1EBB v\xE0o. Ng\xF2i b\xFAt d\u1EEBng l\xE0 nghe ti\u1EBFng gi\xE1p s\u1EAFt."
    },
    {
      "id": "dp.tam_bao_phu",
      "nghe": "che_phu",
      "ten": "T\u1EA7m B\u1EA3o Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.tam_bao_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.tam_bao_dieu_ti",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "M\u0169i ch\u1ED3n t\u1EA7m b\u1EA3o ph\u01A1i kh\xF4 nghi\u1EC1n v\xE0o m\u1EF1c, ng\xF2i b\xFAt t\u1EF1 k\xE9o v\u1EC1 ph\xEDa c\xF3 kim th\u1EA1ch. C\u1EE9 \u0111\u1EC3 tay theo ng\xF2i m\xE0 v\u1EBD."
    },
    {
      "id": "dp.tran_quy_phu",
      "nghe": "che_phu",
      "ten": "Tr\u1EA5n Qu\u1EF7 Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.tran_quy_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.cuu_u_am_hoa",
          "so": 1
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "Nh\u1ED1t \xE2m h\u1ECFa v\xE0o \u0111\xE8n \u0111\u1ED3ng, v\u1EBD d\u01B0\u1EDBi \xE1nh l\u1EEDa xanh. M\u1EF1c ph\u1EA3i h\u01A1 qua l\u1EEDa \u1EA5y, n\xE9t ph\xF9 m\u1EDBi c\u1EAFn \u0111\u01B0\u1EE3c h\u1ED3n."
    },
    {
      "id": "dp.phi_cham_phu",
      "nghe": "che_phu",
      "ten": "Phi Ch\xE2m Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.phi_cham_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 2
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 1
        },
        {
          "id": "item.kim_mach_dao",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 30,
      "mo_ta": "H\u1EA1t kim m\u1EA1ch \u0111\u1EA1o nghi\u1EC1n m\u1ECBn r\u1EAFc l\xEAn m\u1EF1c c\xF2n \u01B0\u1EDBt. Ch\u1EA5m tr\u0103m ch\u1EA5m li\u1EC1n m\u1ED9t h\u01A1i, ch\u1EA5m n\xE0o c\u0169ng ph\u1EA3i nh\u1ECDn."
    },
    {
      "id": "dp.thanh_xa_phu",
      "nghe": "che_phu",
      "ten": "Thanh X\xE0 Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thanh_xa_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 2
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 1
        },
        {
          "id": "item.doc_khuan_bao",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 40,
      "mo_ta": "B\xE0o t\u1EED n\u1EA5m \u0111\u1ED9c ng\xE2m v\xE0o m\u1EF1c ba ng\xE0y. N\xE9t ph\xF9 u\u1ED1n ch\u1EADm nh\u01B0 r\u1EAFn b\xF2, ng\u01B0\u1EDDi v\u1EBD ph\u1EA3i b\u1ECBt m\u1EB7t."
    },
    {
      "id": "dp.thanh_tuyen_phu",
      "nghe": "che_phu",
      "ten": "Thanh Tuy\u1EC1n Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thanh_tuyen_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 2
        },
        {
          "id": "item.thuy_tien_can",
          "so": 2
        },
        {
          "id": "item.vu_tinh",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "R\u1EC5 th\u1EE7y ti\xEAn gi\xE3 l\u1EA5y n\u01B0\u1EDBc m\xE0i m\u1EF1c, gi\u1EA5y hong trong s\u01B0\u01A1ng cho ng\u1EA5m. N\xE9t \u0111i ch\u1EADm nh\u01B0 su\u1ED1i ch\u1EA3y, g\u1EA5p g\xE1p l\xE0 n\u01B0\u1EDBc \u0111\u1EE5c."
    },
    {
      "id": "dp.cuong_huyet_phu",
      "nghe": "che_phu",
      "ten": "Cu\u1ED3ng Huy\u1EBFt Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.cuong_huyet_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        },
        {
          "id": "item.huyet_linh_chi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 30,
      "mo_ta": "Huy\u1EBFt linh chi v\u1EAFt l\u1EA5y nh\u1EF1a \u0111\u1ECF tr\u1ED9n v\u1EDBi y\xEAu huy\u1EBFt m\u1EB7c. V\u1EBD m\u1ED9t h\u01A1i l\xFAc m\u1EA1ch \u0111ang \u0111\u1EADp nhanh, ph\xF9 m\u1EDBi c\xF3 kh\xED."
    },
    {
      "id": "dp.lien_chau_loi_phu",
      "nghe": "che_phu",
      "ten": "Li\xEAn Ch\xE2u L\xF4i Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.lien_chau_loi_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        },
        {
          "id": "item.loi_sa_hoa",
          "so": 3
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 100,
      "mo_ta": "Ba \u0111\xF3a l\xF4i sa hoa t\xE1n v\xE0o m\u1EF1c, v\u1EBD chu\u1ED7i h\u1EA1t s\u1EA5m n\u1ED1i nhau kh\xF4ng nh\u1EA5c b\xFAt. \u0110\u1EE9t m\u1ED9t h\u1EA1t l\xE0 c\u1EA3 chu\u1ED7i t\u1EAFt."
    },
    {
      "id": "dp.toai_giap_phu",
      "nghe": "che_phu",
      "ten": "To\xE1i Gi\xE1p Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.toai_giap_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        },
        {
          "id": "item.te_nguu_giac",
          "so": 1
        },
        {
          "id": "item.kim_tue_mach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 40,
      "mo_ta": "S\u1EEBng t\xEA ng\u01B0u m\xE0i c\xF9ng h\u1EA1t kim tu\u1EC7 m\u1EA1ch th\xE0nh b\u1ED9t. H\u1EA1 n\xE9t nh\u01B0 \u0111\u1EE5c \u0111\xE1, d\u1EE9t kho\xE1t t\u1EEBng nh\xE1t."
    },
    {
      "id": "dp.nham_bich_phu",
      "nghe": "che_phu",
      "ten": "Nham B\xEDch Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.nham_bich_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        },
        {
          "id": "item.linh_van_thach",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 80,
      "mo_ta": "Linh v\u0103n th\u1EA1ch nghi\u1EC1n l\xE0m n\u1EC1n, n\xE9t ph\xF9 v\u1EBD theo v\xE2n \u0111\xE1. \u0110\u1EAFp t\u1EEBng l\u1EDBp ch\u1EADm r\xE3i nh\u01B0 x\xE2y t\u01B0\u1EDDng."
    },
    {
      "id": "dp.sinh_co_phu",
      "nghe": "che_phu",
      "ten": "Sinh C\u01A1 Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.sinh_co_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.co_moc_tam",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "pham": 4,
          "so": 1
        }
      ],
      "hoa": "van",
      "mo_ta": "L\xF5i c\u1ED5 m\u1ED9c ng\xE2m v\u1EDBi m\u1ED9t v\u1ECB linh d\u01B0\u1EE3c h\u1EC7 m\u1ED9c cho ra nh\u1EF1a xanh. V\u1EBD l\xFAc s\xE1ng s\u1EDBm, n\xE9t m\u1EC1m nh\u01B0 ch\u1ED3i non."
    },
    {
      "id": "dp.thuy_don_phu",
      "nghe": "che_phu",
      "ten": "Th\u1EE7y \u0110\u1ED9n Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thuy_don_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 2
        },
        {
          "id": "item.thuy_linh_chau",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "Hai h\u1EA1t th\u1EE7y linh ch\xE2u ng\xE2m trong nghi\xEAn qua \u0111\xEAm, m\u1EF1c lo\xE3ng nh\u01B0 n\u01B0\u1EDBc. V\u1EBD tr\xEAn gi\u1EA5y \u01B0\u1EDBt, n\xE9t nh\xF2e m\xE0 kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EE9t."
    },
    {
      "id": "dp.viem_vu_phu",
      "nghe": "che_phu",
      "ten": "Vi\xEAm V\u0169 Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.viem_vu_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.nhat_luan_hoa",
          "so": 1
        },
        {
          "id": "item.hoa_tinh_chau",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 300,
      "mo_ta": "C\xE1nh nh\u1EADt lu\xE2n hoa ph\u01A1i gi\u1EEFa tr\u01B0a r\u1ED3i t\xE1n c\xF9ng h\u1ECFa tinh ch\xE2u. Ch\u1EA5m m\u1EF1c nh\u01B0 m\u01B0a r\u01A1i, nhanh tay k\u1EBBo m\u1EF1c b\xE9n l\u1EEDa."
    },
    {
      "id": "dp.cuong_phong_phu",
      "nghe": "che_phu",
      "ten": "Cu\u1ED3ng Phong Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.cuong_phong_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.thanh_dieu_vu",
          "so": 2
        },
        {
          "id": "item.phong_linh_chau",
          "so": 3
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 400,
      "mo_ta": "L\xF4ng thanh \u0111i\u1EC3u l\xE0m ng\xF2i, ba h\u1EA1t phong linh ch\xE2u t\xE1n v\xE0o m\u1EF1c. \u0110\xF3ng k\xEDn c\u1EEDa, v\u1EBD n\xE9t xo\xE1y t\u1EEB t\xE2m ra, gi\xF3 n\u1ED5i trong ph\xF2ng l\xE0 th\xE0nh."
    },
    {
      "id": "dp.thien_nhan_phu",
      "nghe": "che_phu",
      "ten": "Thi\xEAn Nh\u1EADn Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thien_nhan_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.tan_kiem_y",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "T\xE0n ki\u1EBFm \xFD phong v\xE0o nghi\xEAn m\u1EF1c, m\u1EF1c r\u1EA1ch gi\u1EA5y th\xE0nh v\u1EBFt. N\xE9t n\xE0o c\u0169ng ph\u1EA3i s\u1EAFc nh\u01B0 l\u01B0\u1EE1i dao, run tay l\xE0 \u0111\u1EE9t gi\u1EA5y."
    },
    {
      "id": "dp.khon_long_phu",
      "nghe": "che_phu",
      "ten": "Kh\u1ED1n Long Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.khon_long_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.son_tinh_hach",
          "so": 2
        },
        {
          "id": "item.cuu_khuc_hoang_tinh",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "H\u1EA1ch s\u01A1n tinh v\u1EDBi r\u1EC5 c\u1EEDu kh\xFAc ho\xE0ng tinh n\u1EA5u th\xE0nh m\u1EF1c \u0111\u1EB7c s\u1EC7t. V\xF2ng x\xEDch ch\xEDn kh\xFAc v\u1EBD ch\u1EADm, kh\xE9p \u0111\u1EE7 ch\xEDn kh\xFAc m\u1EDBi kh\xF3a \u0111\u01B0\u1EE3c."
    },
    {
      "id": "dp.thanh_lien_phu",
      "nghe": "che_phu",
      "ten": "Thanh Li\xEAn Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thanh_lien_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.giao_chau_lien",
          "so": 1
        },
        {
          "id": "item.ngoc_tuy",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "\xC9p m\u1ED9t c\xE1nh giao ch\xE2u li\xEAn gi\u1EEFa hai t\u1EDD gi\u1EA5y, ng\u1ECDc t\u1EE7y h\xF2a l\xE0m m\u1EF1c. V\u1EBD c\xE1nh sen t\u1EEB trong ra, m\u1ED7i c\xE1nh m\u1ED9t h\u01A1i th\u1EDF."
    },
    {
      "id": "dp.loi_no_phu",
      "nghe": "che_phu",
      "ten": "L\xF4i N\u1ED9 Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.loi_no_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.loi_linh_chau",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 300,
      "mo_ta": "Hai h\u1EA1t l\xF4i linh ch\xE2u t\xE1n m\u1ECBn, r\u1EAFc l\xEAn m\u1EF1c l\xFAc tr\u1EDDi g\u1EA7m. N\xE9t ph\xF9 nh\u01B0 tia ch\u1EDBp, ch\u1EA7n ch\u1EEB m\u1ED9t nh\u1ECBp l\xE0 l\xF4i kh\xED \u0111\xE1nh ng\u01B0\u1EE3c."
    },
    {
      "id": "dp.luu_tinh_phu",
      "nghe": "che_phu",
      "ten": "L\u01B0u Tinh Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.luu_tinh_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.thien_ngoai_van_thiet",
          "so": 1
        },
        {
          "id": "item.huyen_quan_tuy",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 400,
      "mo_ta": "V\u1EABn thi\u1EBFt r\u01A1i t\u1EEB tr\u1EDDi ph\u1EA3i nung b\u1EA3y ng\xE0y m\u1EDBi m\xE0i ra b\u1ED9t. V\u1EBD t\u1EEB tr\xEAn xu\u1ED1ng m\u1ED9t m\u1EA1ch, nh\u01B0 sao b\u0103ng r\u1EA1ch tr\u1EDDi."
    },
    {
      "id": "dp.tuyet_vuc_phu",
      "nghe": "che_phu",
      "ten": "Tuy\u1EBFt V\u1EF1c Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.tuyet_vuc_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.bang_tuy_chi",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "Nh\u1EF1a b\u0103ng t\u1EE7y chi l\xE0m m\u1EF1c, v\u1EBD trong hang b\u0103ng. M\u1ED7i n\xE9t ph\u1EA3i \u0111\u1EE3i m\u1EF1c \u0111\xF4ng r\u1ED3i m\u1EDBi h\u1EA1 n\xE9t k\u1EBF."
    },
    {
      "id": "dp.tam_muoi_hoa_phu",
      "nghe": "che_phu",
      "ten": "Tam Mu\u1ED9i H\u1ECFa Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.tam_muoi_hoa_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.ngo_dong_chi",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "\u0110\u1ED1t hai c\xE0nh ng\xF4 \u0111\u1ED3ng l\u1EA5y l\u1EEDa h\u01A1 m\u1EF1c t\u1EDBi khi m\u1EF1c \u0111\u1ECF r\u1EF1c. V\u1EBD m\u1ED9t h\u01A1i tr\u01B0\u1EDBc khi l\u1EEDa trong m\u1EF1c ngu\u1ED9i."
    },
    {
      "id": "dp.toa_tien_phu",
      "nghe": "che_phu",
      "ten": "T\u1ECFa Ti\xEAn Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.toa_tien_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.co_chung_dong",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "\u0110\u1ED3ng chu\xF4ng c\u1ED5 gi\u0169a th\xE0nh b\u1ED9t, r\u1EAFc l\xEAn ch\xEDn v\xF2ng x\xEDch v\u1EBD s\u1EB5n. Kh\xE9p v\xF2ng cu\u1ED1i th\xEC nghe chu\xF4ng ng\xE2n, ch\u01B0a ng\xE2n l\xE0 h\u1ECFng."
    },
    {
      "id": "dp.huyen_vu_phu",
      "nghe": "che_phu",
      "ten": "Huy\u1EC1n V\u0169 Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.huyen_vu_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.huyen_ngac_giap",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 600,
      "mo_ta": "Ph\xF9 s\u01B0 B\u1EAFc Minh v\u1EBD th\u1EB3ng l\xEAn gi\xE1p c\xE1 s\u1EA5u \u0111en thay gi\u1EA5y. R\xF9a v\u1EBD tr\u01B0\u1EDBc, r\u1EAFn qu\u1EA5n sau, n\xE9t ch\u1EADm v\xE0 d\xE0y nh\u01B0 t\u1EE5ng kinh."
    },
    {
      "id": "dp.hoan_sinh_phu",
      "nghe": "che_phu",
      "ten": "Ho\xE0n Sinh Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.hoan_sinh_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "pham": 6,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 300,
      "mo_ta": "M\u1ED9t v\u1ECB linh th\u1EA3o m\u1ED9c ngh\xECn n\u0103m gi\xE3 l\u1EA5y n\u01B0\u1EDBc, ng\xE2m gi\u1EA5y ba ng\xE0y. V\u1EBD d\u01B0\u1EDBi m\u01B0a ph\xF9n, m\u01B0a t\u1EA1nh th\xEC d\u1EEBng b\xFAt."
    },
    {
      "id": "dp.thai_hu_don_phu",
      "nghe": "che_phu",
      "ten": "Th\xE1i H\u01B0 \u0110\u1ED9n Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thai_hu_don_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.huyen_quan_tuy",
          "so": 2
        },
        {
          "id": "item.thanh_dieu_vu",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 400,
      "mo_ta": "L\xF4ng thanh \u0111i\u1EC3u ch\u1EBB l\xE0m ng\xF2i, n\xE9t ph\xF9 m\u1EA3nh nh\u01B0 t\u01A1. V\u1EBD ngo\xE0i gi\xF3, n\xE9t n\xE0o gi\xF3 cu\u1ED1n \u0111i th\xEC v\u1EBD l\u1EA1i."
    },
    {
      "id": "dp.tram_than_phu",
      "nghe": "che_phu",
      "ten": "Tr\u1EA3m Th\u1EA7n Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.tram_than_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.cu_tuong_nha",
          "so": 1
        },
        {
          "id": "item.hu_linh_phach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "Ng\xE0 c\u1EF1 t\u01B0\u1EE3ng m\xE0i v\u1EDBi h\u01B0 linh ph\xE1ch th\xE0nh m\u1EF1c tr\u1EAFng. C\u1EA3 t\u1EDD ch\u1EC9 m\u1ED9t n\xE9t th\u1EB3ng, v\u1EBD l\u1EC7ch m\u1ED9t s\u1EE3i t\xF3c l\xE0 b\u1ECF."
    },
    {
      "id": "dp.cuu_thien_loi_phu",
      "nghe": "che_phu",
      "ten": "C\u1EEDu Thi\xEAn L\xF4i Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.cuu_thien_loi_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.hu_linh_phach",
          "so": 1
        },
        {
          "id": "item.loi_linh_chau",
          "so": 4
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 1e3,
      "mo_ta": "L\xEAn \u0111\u1EC9nh n\xFAi \u0111\u1EE3i gi\xF4ng, m\u1ED7i ti\u1EBFng s\u1EA5m h\u1EA1 m\u1ED9t n\xE9t. \u0110\u1EE7 ch\xEDn n\xE9t m\xE0 tr\u1EDDi t\u1EA1nh tr\u01B0\u1EDBc th\xEC t\u1EDD ph\xF9 th\xE0nh gi\u1EA5y l\u1ED9n."
    },
    {
      "id": "dp.diem_hai_phu",
      "nghe": "che_phu",
      "ten": "Di\u1EC7m H\u1EA3i Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.diem_hai_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.kim_o_qua",
          "so": 1
        },
        {
          "id": "item.hoa_tinh_chau",
          "so": 5
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "B\u1ED5 kim \xF4 qu\u1EA3 l\u1EA5y n\u01B0\u1EDBc \u0111\u1ECF nh\u01B0 m\xE1u, h\xF2a n\u0103m h\u1EA1t h\u1ECFa tinh ch\xE2u. V\u1EBD tr\xEAn \u0111\xE1 nung, gi\u1EA5y b\xE9n l\u1EEDa l\xE0 ph\u1EA3i xong."
    },
    {
      "id": "dp.thuy_lao_phu",
      "nghe": "che_phu",
      "ten": "Th\u1EE7y Lao Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thuy_lao_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.thien_nhat_chan_thuy",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "M\u1ED9t gi\u1ECDt thi\xEAn nh\u1EA5t ch\xE2n th\u1EE7y nh\u1ECF v\xE0o nghi\xEAn, m\u1EF1c n\u1EB7ng t\u1EDBi m\u1EE9c b\xFAt tr\u0129u tay. V\u1EBD b\u1ED1n b\u1EE9c t\u01B0\u1EDDng n\u01B0\u1EDBc kh\xE9p k\xEDn, ch\u1EADm m\xE0 kh\xF4ng ng\u1EEBng."
    },
    {
      "id": "dp.thien_cuong_phu",
      "nghe": "che_phu",
      "ten": "Thi\xEAn C\u01B0\u01A1ng Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thien_cuong_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.cu_tuong_nha",
          "so": 1
        },
        {
          "id": "item.son_tinh_hach",
          "so": 4
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 500,
      "mo_ta": "Ng\xE0 c\u1EF1 t\u01B0\u1EE3ng c\u01B0a th\xE0nh t\u1EA5m l\xE0m n\u1EC1n, b\u1ED9t s\u01A1n tinh h\u1EA1ch l\xE0m m\u1EF1c. Ba m\u01B0\u01A1i s\xE1u \u0111i\u1EC3m c\u01B0\u01A1ng kh\xED ch\u1EA5m theo sao, sai ch\u1ED7 l\xE0 v\xF2m s\u1EE5p."
    },
    {
      "id": "dp.tao_hoa_phu",
      "nghe": "che_phu",
      "ten": "T\u1EA1o H\xF3a Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.tao_hoa_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 3
        },
        {
          "id": "item.phu_chi",
          "so": 3
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 3
        },
        {
          "id": "item.hu_linh_phach",
          "so": 1
        },
        {
          "id": "item.ngo_dong_chi",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 1e3,
      "mo_ta": "C\xE0nh ng\xF4 \u0111\u1ED3ng ng\xE2m v\u1EDBi h\u01B0 linh ph\xE1ch t\u1EDBi khi n\u1EA3y m\u1EA7m. V\u1EBD ph\xF9 theo \u0111\u01B0\u1EDDng m\u1EA7m m\u1ECDc, m\u1EA7m ng\u1EEBng th\xEC b\xFAt ng\u1EEBng."
    },
    {
      "id": "dp.thu_thu_phu",
      "nghe": "che_phu",
      "ten": "Thu Th\xFA Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thu_thu_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 1
        },
        {
          "id": "item.phu_chi",
          "so": 1
        },
        {
          "id": "item.chu_ty",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "Se t\u01A1 nh\u1EC7n v\xE0o n\xE9t d\xE2y leo, v\xF2ng cu\u1ED1i \u0111\u1EC3 h\u1EDF, d\xE1n tr\xFAng m\u1EDBi kh\xE9p."
    },
    {
      "id": "dp.thu_linh_phu",
      "nghe": "che_phu",
      "ten": "Thu Linh Ph\xF9 ph\u01B0\u01A1ng",
      "ra": "item.thu_linh_phu",
      "chu": [
        {
          "id": "item.chu_sa",
          "so": 2
        },
        {
          "id": "item.phu_chi",
          "so": 2
        },
        {
          "id": "item.chu_ty",
          "so": 2
        },
        {
          "id": "item.yeu_huyet_mac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "Ch\xEDn v\xF2ng d\xE2y leo l\u1ED3ng nhau, v\xF2ng n\xE0o \u0111\u1EE9t n\xE9t l\xE0 ph\xF9 kh\xF4ng gi\u1EEF n\u1ED5i th\xFA."
    },
    {
      "id": "dp.tran_thach_bich",
      "nghe": "tran_phap",
      "ten": "Th\u1EA1ch B\xEDch tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_thach_bich",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.thach_tuy_phan",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 10,
      "mo_ta": "B\u1ED9t th\u1EA1ch t\u1EE7y r\u1EAFc theo n\xE9t kh\u1EAFc cho tr\u1EADn v\u0103n b\xE1m ch\u1EB7t v\xE0o g\u1ED7. Kh\u1EAFc ch\u1EADm t\u1EEBng v\xF2ng, v\xF2ng n\xE0o h\u1EDF l\xE0 t\u01B0\u1EDDng \u0111\xE1 c\xF3 khe."
    },
    {
      "id": "dp.tran_dang_la",
      "nghe": "tran_phap",
      "ten": "\u0110\u1EB1ng La tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_dang_la",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.thanh_dang_can",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 12,
      "mo_ta": "G\xE2n d\xE2y leo tinh quai ng\xE2m n\u01B0\u1EDBc r\u1ED3i qu\u1EA5n quanh m\xE9p ph\xF4i. Kh\u1EAFc ch\u1EADm, \u0111\u1EC3 d\xE2y k\u1ECBp b\xE9n theo tr\u1EADn v\u0103n."
    },
    {
      "id": "dp.tran_liem_tuc",
      "nghe": "tran_phap",
      "ten": "Li\u1EC5m T\u1EE9c tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_liem_tuc",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.diep_phan",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "Ph\u1EA5n c\xE1nh b\u01B0\u1EDBm y\xEAu h\xF2a n\u01B0\u1EDBc, qu\xE9t m\u1ECFng l\xEAn m\u1EB7t ph\xF4i. Kh\u1EAFc nh\u1EB9 tay, n\xE9t s\xE2u qu\xE1 th\xEC h\u01A1i ng\u01B0\u1EDDi l\u1EA1i l\u1ECDt ra."
    },
    {
      "id": "dp.tran_tam_tai_kiem",
      "nghe": "tran_phap",
      "ten": "Tam T\xE0i Ki\u1EBFm tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_tam_tai_kiem",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.lang_nha",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 12,
      "mo_ta": "R\u0103ng s\xF3i m\xE0i th\xE0nh ba m\u0169i c\u1EAFm v\xE0o ba g\xF3c ph\xF4i l\xE0m tr\u1EADn nh\xE3n. N\xE9t ki\u1EBFm ph\u1EA3i kh\u1EAFc m\u1ED9t h\u01A1i, ng\u1EADp ng\u1EEBng l\xE0 ki\u1EBFm kh\xED c\xF9n."
    },
    {
      "id": "dp.tran_at_moc",
      "nghe": "tran_phap",
      "ten": "\u1EA4t M\u1ED9c tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_at_moc",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.thanh_dang_can",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "pham": 2,
          "so": 1
        }
      ],
      "mo_ta": "N\u01B0\u1EDBc m\u1ED9t v\u1ECB linh th\u1EA3o m\u1ED9c ng\xE2m v\xE0o th\u1EDB g\u1ED7 \u0111\xE0o, g\xE2n d\xE2y leo kh\u1EAFc theo v\xE2n g\u1ED7. G\u1ED7 u\u1ED1ng no linh kh\xED th\xEC tr\u1EADn m\u1EDBi xanh."
    },
    {
      "id": "dp.tran_ly_hoa",
      "nghe": "tran_phap",
      "ten": "Ly H\u1ECFa tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_ly_hoa",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.hoa_ke_vu",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 8,
      "mo_ta": "L\xF4ng g\xE0 l\u1EEDa \u0111\u1ED1t th\xE0nh than, than \u1EA5y l\xE0m m\u1EF1c v\u1EA1ch tr\u1EADn. Kh\u1EAFc nhanh l\xFAc than c\xF2n \u1EA5m, ngu\u1ED9i r\u1ED3i th\xEC l\u1EEDa trong tr\u1EADn c\u0169ng t\u1EAFt."
    },
    {
      "id": "dp.tran_pha_giap",
      "nghe": "tran_phap",
      "ten": "Ph\xE1 Gi\xE1p tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_pha_giap",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.tru_nha",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 12,
      "mo_ta": "Hai chi\u1EBFc nanh l\u1EE3n y\xEAu \u0111\xF3ng ch\xE9o gi\u1EEFa ph\xF4i l\xE0m m\u0169i d\xF9i. Kh\u1EAFc d\u1EE9t kho\xE1t, tr\u1EADn v\u0103n ph\u1EA3i s\u1EAFc nh\u01B0 m\u0169i khoan."
    },
    {
      "id": "dp.tran_tan_linh",
      "nghe": "tran_phap",
      "ten": "T\xE1n Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_tan_linh",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.huyet_dia_dich",
          "so": 2
        }
      ],
      "phu": [],
      "linh_thach": 15,
      "mo_ta": "D\u1ECBch \u0111\u1EC9a y\xEAu b\xF4i v\xE0o r\xE3nh tr\u1EADn, tr\u1EADn v\u0103n s\u1EBD h\xFAt linh l\u1EF1c nh\u01B0 \u0111\u1EC9a h\xFAt m\xE1u. B\xF4i xong ph\u1EA3i r\u1EEDa tay ngay."
    },
    {
      "id": "dp.tran_kho_moc",
      "nghe": "tran_phap",
      "ten": "Kh\xF4 M\u1ED9c tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_kho_moc",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.doc_khuan_bao",
          "so": 1
        }
      ],
      "phu": [],
      "linh_thach": 8,
      "mo_ta": "B\xE0o t\u1EED n\u1EA5m \u0111\u1ED9c r\u1EAFc v\xE0o th\u1EDB g\u1ED7, g\u1ED7 \u0111\xE0o m\u1EE5c d\u1EA7n theo n\xE9t kh\u1EAFc. Tr\u1EADn th\xE0nh th\xEC c\u1EA7m v\xE0o th\u1EA5y tay kh\xF4 r\xE1p."
    },
    {
      "id": "dp.tran_dan_linh",
      "nghe": "tran_phap",
      "ten": "D\u1EABn Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_dan_linh",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.yeu_dan_1",
          "so": 1
        }
      ],
      "phu": [],
      "linh_thach": 15,
      "mo_ta": "M\u1ED9t vi\xEAn y\xEAu \u0111an nh\u1ECF kh\u1EA3m gi\u1EEFa ph\xF4i l\xE0m tr\u1EADn nh\xE3n, tr\u1EADn v\u0103n t\u1ECFa ra nh\u01B0 r\u1EC5 c\xE2y. N\xE9t n\xE0o n\u1ED1i v\xE0o y\xEAu \u0111an ph\u1EA3i li\u1EC1n."
    },
    {
      "id": "dp.tran_thanh_moc_duc_linh",
      "nghe": "tran_phap",
      "ten": "Thanh M\u1ED9c D\u1EE5c Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_thanh_moc_duc_linh",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "pham": 2,
          "so": 2
        }
      ],
      "hoa": "van",
      "mo_ta": "Hai v\u1ECB linh th\u1EA3o m\u1ED9c gi\xE3 nhuy\u1EC5n tr\xE1t l\xEAn m\u1EB7t ph\xF4i, kh\u1EAFc tr\u1EADn khi l\u1EDBp thu\u1ED1c c\xF2n \u01B0\u1EDBt. Kh\u1EAFc ch\u1EADm cho thu\u1ED1c ng\u1EA5m."
    },
    {
      "id": "dp.tran_suc_dia",
      "nghe": "tran_phap",
      "ten": "S\xFAc \u0110\u1ECBa tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_suc_dia",
      "chu": [
        {
          "id": "item.phoi_dao_moc",
          "so": 1
        },
        {
          "id": "item.ung_vu",
          "so": 1
        }
      ],
      "phu": [],
      "linh_thach": 10,
      "mo_ta": "L\xF4ng \u01B0ng y\xEAu c\u1EAFm \u1EDF tr\u1EADn nh\xE3n ch\u1EC9 h\u01B0\u1EDBng, tr\u1EADn v\u0103n g\u1EA5p \u0111\u01B0\u1EDDng xa th\xE0nh m\u1ED9t b\u01B0\u1EDBc. Kh\u1EAFc sai m\u1ED9t n\xE9t l\xE0 \u0111i l\u1EA1c."
    },
    {
      "id": "dp.tran_huyen_quy",
      "nghe": "tran_phap",
      "ten": "Huy\u1EC1n Quy tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_huyen_quy",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.quy_giap",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 30,
      "mo_ta": "M\u1EA3nh gi\xE1p r\xF9a y\xEAu m\xE0i m\u1ECFng d\xE1n d\u01B0\u1EDBi ph\xF4i ng\u1ECDc, tr\u1EADn v\u0103n kh\u1EAFc theo v\xE2n gi\xE1p. Kh\u1EAFc ch\u1EADm, v\xE2n gi\xE1p \u0111i \u0111\xE2u n\xE9t theo \u0111\xF3."
    },
    {
      "id": "dp.tran_van_vu",
      "nghe": "tran_phap",
      "ten": "V\xE2n V\u1EE5 M\xEA tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_van_vu",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.vu_tinh",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 40,
      "mo_ta": "Hai vi\xEAn v\u1EE5 tinh b\xF3p v\u1EE1 tr\xEAn m\u1EB7t ng\u1ECDc, s\u01B0\u01A1ng t\u1ECFa t\u1EDBi \u0111\xE2u kh\u1EAFc t\u1EDBi \u0111\xF3. Kh\u1EAFc ch\u1EADm, s\u01B0\u01A1ng tan l\xE0 ph\u1EA3i \u0111\u1EE3i vi\xEAn kh\xE1c."
    },
    {
      "id": "dp.tran_lien_hoan_kiem",
      "nghe": "tran_phap",
      "ten": "Li\xEAn Ho\xE0n Ki\u1EBFm tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_lien_hoan_kiem",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.co_dong_tinh",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "Tinh \u0111\u1ED3ng c\u1ED5 nung ch\u1EA3y \u0111\u1ED5 v\xE0o r\xE3nh tr\u1EADn l\xE0m l\u01B0\u1EE1i ki\u1EBFm. \u0110\u1ED3ng ngu\u1ED9i r\u1EA5t nhanh, kh\u1EAFc li\u1EC1n m\u1ED9t h\u01A1i c\u1EA3 b\u1EA3y l\u01B0\u1EE1i."
    },
    {
      "id": "dp.tran_canh_kim",
      "nghe": "tran_phap",
      "ten": "Canh Kim tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_canh_kim",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "kim"
          ],
          "pham": 3,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 10,
      "mo_ta": "M\u1ED9t v\u1ECB linh d\u01B0\u1EE3c h\u1EC7 kim \u0111\u1ED1t th\xE0nh tro tr\u1EAFng, r\u1EA3i v\xE0o n\xE9t tr\u1EADn cho kim kh\xED ng\u01B0ng. Kh\u1EAFc nhanh tr\u01B0\u1EDBc khi tro bay."
    },
    {
      "id": "dp.tran_quy_thuy",
      "nghe": "tran_phap",
      "ten": "Qu\xFD Th\u1EE7y tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_quy_thuy",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.thuy_linh_chau",
          "so": 1
        }
      ],
      "phu": [],
      "mo_ta": "Th\u1EE7y linh ch\xE2u \u0111\u1EB7t \u1EDF tr\u1EADn nh\xE3n, n\u01B0\u1EDBc trong ch\xE2u theo n\xE9t kh\u1EAFc ch\u1EA3y quanh m\xE9p ph\xF4i. N\xE9t n\xE0o \u0111\u1ECDng n\u01B0\u1EDBc l\xE0 kh\u1EAFc sai."
    },
    {
      "id": "dp.tran_mau_tho",
      "nghe": "tran_phap",
      "ten": "M\u1EADu Th\u1ED5 tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_mau_tho",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.linh_van_thach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 20,
      "mo_ta": "Linh v\u0103n th\u1EA1ch nghi\u1EC1n m\u1ECBn tr\u1ED9n v\u1EDBi n\u01B0\u1EDBc gi\u1EBFng, tr\xE1t th\xE0nh m\u1ED9t l\u1EDBp d\xE0y r\u1ED3i m\u1EDBi kh\u1EAFc. Kh\u1EAFc ch\u1EADm cho \u0111\u1EA5t k\u1ECBp \u0111\xF4ng."
    },
    {
      "id": "dp.tran_toai_bich",
      "nghe": "tran_phap",
      "ten": "To\xE1i B\xEDch tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_toai_bich",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.phe_kim_nha",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "R\u0103ng tr\xF9ng \u0103n kim c\u1EAFm v\xE0o tr\u1EADn nh\xE3n, tr\u1EADn v\u0103n kh\u1EAFc th\xE0nh h\xECnh r\u0103ng c\u01B0a. Ph\u1EA3i kh\u1EAFc m\u1ED9t h\u01A1i, ch\u1EADm th\xEC r\u0103ng c\xF9n."
    },
    {
      "id": "dp.tran_phong_mach",
      "nghe": "tran_phap",
      "ten": "Phong M\u1EA1ch tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_phong_mach",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.linh_van_thach",
          "so": 1
        },
        {
          "id": "item.sa_linh_tinh",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "Linh v\u0103n th\u1EA1ch l\xE0m \u0111\xE1y, sa linh tinh r\u1EAFc quanh m\xE9p nh\u01B0 \u0111\u1EAFp \u0111\xEA ch\u1EB7n linh m\u1EA1ch. Kh\u1EAFc ch\u1EADm, m\u1ED9t khe h\u1EDF l\xE0 linh kh\xED l\u1ECDt."
    },
    {
      "id": "dp.tran_tu_linh",
      "nghe": "tran_phap",
      "ten": "T\u1EE5 Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_tu_linh",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.yeu_dan_2",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 60,
      "mo_ta": "Y\xEAu \u0111an kh\u1EA3m gi\u1EEFa, n\u0103m vi\xEAn linh th\u1EA1ch v\u1EE5n kh\u1EA3m quanh l\xE0m tr\u1EADn nh\xE3n ph\u1EE5. Kh\u1EAFc ch\u1EADm, n\xE9t n\xE0o c\u0169ng ph\u1EA3i d\u1EABn v\u1EC1 gi\u1EEFa."
    },
    {
      "id": "dp.tran_thong_mach",
      "nghe": "tran_phap",
      "ten": "Th\xF4ng M\u1EA1ch tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_thong_mach",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.khai_khieu_chau",
          "so": 1
        }
      ],
      "phu": [],
      "linh_thach": 30,
      "mo_ta": "Khai khi\u1EBFu ch\xE2u kh\u1EA3m \u1EDF tr\u1EADn nh\xE3n, tr\u1EADn v\u0103n kh\u1EAFc th\xE0nh m\u1EA1ch nh\u01B0 kinh l\u1EA1c ng\u01B0\u1EDDi. Kh\u1EAFc \u0111\u1EE7 m\u01B0\u1EDDi hai m\u1EA1ch m\u1EDBi kh\xE9p tr\u1EADn."
    },
    {
      "id": "dp.tran_van_ly",
      "nghe": "tran_phap",
      "ten": "V\u1EA1n L\xFD tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_van_ly",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.phong_linh_chau",
          "so": 1
        }
      ],
      "phu": [],
      "mo_ta": "Phong linh ch\xE2u \u0111\u1EB7t \u1EDF tr\u1EADn nh\xE3n, tr\u1EADn v\u0103n g\u1EA5p kh\xFAc nh\u01B0 \u0111\u01B0\u1EDDng gi\xF3 th\u1ED5i. Hai m\u1EB7t ph\xF4i kh\u1EAFc hai tr\u1EADn soi nhau."
    },
    {
      "id": "dp.tran_thien_la",
      "nghe": "tran_phap",
      "ten": "Thi\xEAn La Kh\u1ED1n tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_thien_la",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.huyen_chu_ty",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "T\u01A1 nh\u1EC7n huy\u1EC1n chu c\u0103ng ngang d\u1ECDc tr\xEAn ph\xF4i x\u01B0\u01A1ng th\xE0nh l\u01B0\u1EDBi. Kh\u1EAFc ch\u1EADm theo t\u1EEBng s\u1EE3i, \u0111\u1EE9t m\u1ED9t s\u1EE3i l\xE0 l\u01B0\u1EDBi c\xF3 l\u1ED7."
    },
    {
      "id": "dp.tran_binh_hoa",
      "nghe": "tran_phap",
      "ten": "B\xEDnh H\u1ECFa tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_binh_hoa",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.hoa_tinh_chau",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "Hai vi\xEAn h\u1ECFa tinh ch\xE2u nung \u0111\u1ECF \xE9p v\xE0o ph\xF4i, tr\u1EADn v\u0103n kh\u1EAFc tr\xEAn v\u1EBFt ch\xE1y. Kh\u1EAFc g\u1EA5p khi x\u01B0\u01A1ng c\xF2n b\u1ED1c kh\xF3i."
    },
    {
      "id": "dp.tran_toa_linh",
      "nghe": "tran_phap",
      "ten": "T\u1ECFa Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_toa_linh",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.co_kinh_phien",
          "so": 1
        },
        {
          "id": "item.linh_van_thach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "M\u1EA3nh g\u01B0\u01A1ng c\u1ED5 \xFAp \u1EDF tr\u1EADn nh\xE3n, linh v\u0103n th\u1EA1ch l\xF3t \u0111\xE1y. G\u01B0\u01A1ng soi t\u1EDBi \u0111\xE2u linh kh\xED \u0111\xF3ng b\u0103ng t\u1EDBi \u0111\xF3."
    },
    {
      "id": "dp.tran_ngu_hanh_tu_linh",
      "nghe": "tran_phap",
      "ten": "Ng\u0169 H\xE0nh T\u1EE5 Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_ngu_hanh_tu_linh",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.yeu_dan_3",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "Tam giai y\xEAu \u0111an \u0111\u1EB7t gi\u1EEFa, n\u0103m g\xF3c ph\xF4i kh\u1EAFc n\u0103m tr\u1EADn nh\u1ECF theo ng\u0169 h\xE0nh. Kh\u1EAFc ch\u1EADm, \u0111\u1EE7 m\u1ED9t v\xF2ng t\u01B0\u01A1ng sinh m\u1EDBi kh\xE9p."
    },
    {
      "id": "dp.tran_tuyet_sinh",
      "nghe": "tran_phap",
      "ten": "Tuy\u1EC7t Sinh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_tuyet_sinh",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.ngo_cong_doc_nang",
          "so": 1
        },
        {
          "id": "item.ngu_doc_dich",
          "so": 1
        }
      ],
      "phu": [],
      "mo_ta": "T\xFAi \u0111\u1ED9c r\u1EBFt v\xE0 ng\u0169 \u0111\u1ED9c d\u1ECBch \u0111\u1ED5 v\xE0o r\xE3nh tr\u1EADn. Kh\u1EAFc ph\u1EA3i b\u1ECBt m\u1EB7t, h\u01A1i \u0111\u1ED9c b\u1ED1c l\xEAn l\xE0m c\u1ECF quanh ch\u1ED7 ng\u1ED3i h\xE9o r\u0169."
    },
    {
      "id": "dp.tran_doan_mach",
      "nghe": "tran_phap",
      "ten": "\u0110o\u1EA1n M\u1EA1ch tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_doan_mach",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.bien_buc_si",
          "so": 2
        }
      ],
      "phu": [],
      "mo_ta": "C\xE1nh d\u01A1i y\xEAu c\u0103ng hai b\xEAn ph\xF4i, tr\u1EADn v\u0103n kh\u1EAFc nh\u01B0 m\u1EA1ch m\xE1u b\u1ECB c\u1EAFt ngang. Tr\u1EADn th\xE0nh th\xEC \u0111\u1EB7t g\u1EA7n ai, ng\u01B0\u1EDDi \u0111\xF3 th\u1EA5y tay ch\xE2n r\u1EDDi r\xE3."
    },
    {
      "id": "dp.tran_xich_diem_kiem",
      "nghe": "tran_phap",
      "ten": "X\xEDch Di\u1EC5m Ki\u1EBFm tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_xich_diem_kiem",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.hoa_tinh_chau",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 50,
      "mo_ta": "Hai vi\xEAn h\u1ECFa tinh ch\xE2u t\xE1n b\u1ED9t tr\u1ED9n l\xE0m m\u1EF1c, kh\u1EAFc s\xE1u thanh ki\u1EBFm quanh ph\xF4i x\u01B0\u01A1ng. L\u1EEDa ph\u1EA3i gi\u1EEF \u0111\u1ECF su\u1ED1t l\xFAc kh\u1EAFc, ngu\u1ED9i m\u1ED9t ki\u1EBFm l\xE0 c\u1EA3 v\xF2ng t\u1EAFt."
    },
    {
      "id": "dp.tran_xuan_phong_hoa_vu",
      "nghe": "tran_phap",
      "ten": "Xu\xE2n Phong H\xF3a V\u0169 tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_xuan_phong_hoa_vu",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.hoe_am_moc",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "thuy"
          ],
          "pham": 2,
          "so": 1
        }
      ],
      "hoa": "van",
      "linh_thach": 50,
      "mo_ta": "G\u1ED7 h\xF2e \xE2m l\xE0m n\u1EC1n, n\u01B0\u1EDBc m\u1ED9t v\u1ECB linh th\u1EA3o th\u1EE7y t\u01B0\u1EDBi l\xEAn m\u1ED7i n\xE9t. Kh\u1EAFc ch\u1EADm nh\u01B0 m\u01B0a xu\xE2n, v\u1ED9i th\xEC \u0111\u1EA5t \xFAng."
    },
    {
      "id": "dp.tran_can_khon",
      "nghe": "tran_phap",
      "ten": "C\xE0n Kh\xF4n tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_can_khon",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.bang_vu",
          "so": 1
        },
        {
          "id": "item.phong_linh_chau",
          "so": 1
        }
      ],
      "phu": [],
      "mo_ta": "L\xF4ng b\u1EB1ng y\xEAu v\xE0 phong linh ch\xE2u \u0111\u1EB7t hai \u0111\u1EA7u ph\xF4i l\xE0m \u0111\xF4i tr\u1EADn nh\xE3n. Tr\u1EADn v\u0103n g\u1EA5p t\xE1m l\u1EA7n, m\u1ED7i l\u1EA7n l\xE0 m\u1ED9t ch\xE2u xa."
    },
    {
      "id": "dp.tran_cuu_cung_kiem",
      "nghe": "tran_phap",
      "ten": "C\u1EEDu Cung Ki\u1EBFm tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_cuu_cung_kiem",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 1
        },
        {
          "id": "item.tan_kiem_y",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 200,
      "mo_ta": "Ki\u1EBFm \xFD t\xE0n trong m\u1EA3nh ki\u1EBFm g\xE3y \u0111\u01B0\u1EE3c d\u1EABn v\xE0o ch\xEDn cung tr\xEAn ph\xF4i ng\u1ECDc. Kh\u1EAFc m\u1ED9t h\u01A1i ch\xEDn cung, ng\u1EAFt gi\u1EEFa ch\u1EEBng l\xE0 ki\u1EBFm \xFD tan."
    },
    {
      "id": "dp.tran_thai_bach",
      "nghe": "tran_phap",
      "ten": "Th\xE1i B\u1EA1ch tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_thai_bach",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 1
        },
        {
          "id": "item.tu_kim",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 150,
      "mo_ta": "T\u1EED kim n\u1EA5u ch\u1EA3y r\xF3t v\xE0o r\xE3nh tr\u1EADn tr\xEAn h\xE0n ng\u1ECDc, kim g\u1EB7p l\u1EA1nh \u0111\xF4ng th\xE0nh s\u1EE3i. Kh\u1EAFc nhanh tr\u01B0\u1EDBc khi kim ngu\u1ED9i."
    },
    {
      "id": "dp.tran_thanh_de",
      "nghe": "tran_phap",
      "ten": "Thanh \u0110\u1EBF tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_thanh_de",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 1
        },
        {
          "id": "item.thien_nien_moc_tam",
          "so": 1
        }
      ],
      "phu": [],
      "linh_thach": 150,
      "mo_ta": "L\xF5i m\u1ED9c ngh\xECn n\u0103m c\u1EAFt th\xE0nh l\xE1t m\u1ECFng l\xF3t d\u01B0\u1EDBi ph\xF4i, tr\u1EADn v\u0103n kh\u1EAFc theo v\xF2ng tu\u1ED5i c\xE2y."
    },
    {
      "id": "dp.tran_hau_tho",
      "nghe": "tran_phap",
      "ten": "H\u1EADu Th\u1ED5 tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_hau_tho",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 1
        },
        {
          "id": "item.son_tinh_hach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 150,
      "mo_ta": "H\u1EA1ch s\u01A1n tinh ch\xF4n d\u01B0\u1EDBi ph\xF4i ng\u1ECDc, tr\u1EADn v\u0103n kh\u1EAFc th\xE0nh h\xECnh n\xFAi ch\u1ED3ng n\xFAi. Kh\u1EAFc ch\u1EADm, n\xFAi n\xE0o c\u0169ng ph\u1EA3i c\xF3 ch\xE2n."
    },
    {
      "id": "dp.tran_bat_quai_me_tung",
      "nghe": "tran_phap",
      "ten": "B\xE1t Qu\xE1i M\xEA Tung tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_bat_quai_me_tung",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 1
        },
        {
          "id": "item.mi_ho_chau",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 150,
      "mo_ta": "M\u1ECB h\u1ED3 ch\xE2u \u0111\u1EB7t \u1EDF tr\u1EADn nh\xE3n, t\xE1m qu\u1EBB kh\u1EAFc quanh nh\u01B0 t\xE1m c\u1EEDa. Kh\u1EAFc ch\u1EADm, c\u1EEDa sinh c\u1EEDa t\u1EED m\xE0 l\u1EABn l\xE0 ng\u01B0\u1EDDi b\xE0y c\u0169ng l\u1EA1c."
    },
    {
      "id": "dp.tran_pha_quan",
      "nghe": "tran_phap",
      "ten": "Ph\xE1 Qu\xE2n tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_pha_quan",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 1
        },
        {
          "id": "item.thuc_thiet_nha",
          "so": 1
        },
        {
          "id": "item.xuyen_bich_giac",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "vu",
      "mo_ta": "R\u0103ng \u0103n s\u1EAFt v\xE0 s\u1EEBng xuy\xEAn v\xE1ch c\u1EAFm hai \u0111\u1EA7u ph\xF4i, tr\u1EADn v\u0103n kh\u1EAFc th\u1EB3ng nh\u01B0 ng\u1ECDn gi\xE1o. M\u1ED9t h\u01A1i t\u1EEB \u0111\u1EA7u t\u1EDBi cu\u1ED1i."
    },
    {
      "id": "dp.tran_kim_cang",
      "nghe": "tran_phap",
      "ten": "Kim Cang H\u1ED9 tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_kim_cang",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 1
        },
        {
          "id": "item.ngoc_tuy",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 100,
      "mo_ta": "Ng\u1ECDc t\u1EE7y \u0111\u1ED5 \u0111\u1EA7y r\xE3nh tr\u1EADn, \u0111\xF4ng l\u1EA1i c\u1EE9ng nh\u01B0 kim c\u01B0\u01A1ng. Kh\u1EAFc ch\u1EADm, n\xE9t n\xE0o c\u0169ng t\u1EE5ng m\u1ED9t c\xE2u kinh h\u1ED9 th\xE2n."
    },
    {
      "id": "dp.tran_chu_thien_tu_linh",
      "nghe": "tran_phap",
      "ten": "Chu Thi\xEAn T\u1EE5 Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_chu_thien_tu_linh",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 1
        },
        {
          "id": "item.yeu_dan_3",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 200,
      "mo_ta": "Hai vi\xEAn y\xEAu \u0111an \u0111\u1EB7t hai c\u1EF1c, ba tr\u0103m s\xE1u m\u01B0\u01A1i tinh v\u1ECB kh\u1EAFc quanh. Ph\u1EA3i kh\u1EAFc v\xE0o \u0111\xEAm, sao n\xE0o l\xEAn th\xEC kh\u1EAFc sao \u1EA5y."
    },
    {
      "id": "dp.tran_thien_co",
      "nghe": "tran_phap",
      "ten": "Thi\xEAn C\u01A1 tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_thien_co",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.yeu_dan_4",
          "so": 1
        }
      ],
      "phu": [],
      "linh_thach": 600,
      "mo_ta": "T\u1EE9 giai y\xEAu \u0111an \u0111\u1EB7t gi\u1EEFa hai ph\xF4i h\xE0n ng\u1ECDc ch\u1ED3ng l\xEAn nhau, tr\u1EADn v\u0103n kh\u1EAFc xuy\xEAn c\u1EA3 hai t\u1EA7ng. M\u1ED9t n\xE9t sai l\xE0 \u0111an v\u1EE1."
    },
    {
      "id": "dp.tran_van_moc_hoi_xuan",
      "nghe": "tran_phap",
      "ten": "V\u1EA1n M\u1ED9c H\u1ED3i Xu\xE2n tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_van_moc_hoi_xuan",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.ngo_dong_chi",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "moc"
          ],
          "pham": 5,
          "so": 1
        }
      ],
      "hoa": "van",
      "mo_ta": "C\xE0nh ng\xF4 \u0111\u1ED3ng gh\xE9p v\u1EDBi m\u1ED9t v\u1ECB linh m\u1ED9c ngh\xECn n\u0103m l\xE0m tr\u1EADn nh\xE3n. Kh\u1EAFc ch\u1EADm, c\xE0nh n\u1EA3y l\xE1 th\xEC tr\u1EADn \u0111\xE3 th\xE0nh."
    },
    {
      "id": "dp.tran_toa_long",
      "nghe": "tran_phap",
      "ten": "T\u1ECFa Long tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_toa_long",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.thien_tam_ti",
          "so": 1
        },
        {
          "id": "item.co_chung_dong",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "mo_ta": "T\u01A1 t\u1EB1m tr\u1EDDi luy\u1EC7n v\u1EDBi \u0111\u1ED3ng chu\xF4ng c\u1ED5 th\xE0nh ch\xEDn s\u1EE3i x\xEDch. Kh\u1EAFc ch\u1EADm, m\u1ED7i s\u1EE3i x\xEDch kh\u1EAFc m\u1ED9t ng\xE0y, kh\xF3a c\u1EA3 r\u1ED3ng."
    },
    {
      "id": "dp.tran_huyen_minh",
      "nghe": "tran_phap",
      "ten": "Huy\u1EC1n Minh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_huyen_minh",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.huyen_ngac_giap",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "thuy"
          ],
          "pham": 5,
          "so": 1
        }
      ],
      "mo_ta": "Gi\xE1p c\xE1 s\u1EA5u \u0111en l\xE0m \u0111\xE1y, n\u01B0\u1EDBc m\u1ED9t v\u1ECB linh th\u1EE7y tr\u0103m n\u0103m t\u01B0\u1EDBi v\xE0o tr\u1EADn v\u0103n. N\u01B0\u1EDBc \u0111\u1ECDng kh\xF4ng tan, \u0111en nh\u01B0 m\u1EF1c."
    },
    {
      "id": "dp.tran_tan_nguyen",
      "nghe": "tran_phap",
      "ten": "T\xE1n Nguy\xEAn tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_tan_nguyen",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.huyen_quan_tuy",
          "so": 1
        },
        {
          "id": "item.yeu_dan_4",
          "so": 1
        }
      ],
      "phu": [],
      "mo_ta": "T\u1EE7y huy\u1EC1n quan b\xF4i l\xEAn y\xEAu \u0111an r\u1ED3i \u0111\u1EB7t ng\u01B0\u1EE3c v\xE0o tr\u1EADn nh\xE3n, tr\u1EADn v\u0103n xo\xE1y ra ngo\xE0i. Linh kh\xED quanh \u0111\xF3 tan nh\u01B0 kh\xF3i."
    },
    {
      "id": "dp.tran_thien_cuong_toa_linh",
      "nghe": "tran_phap",
      "ten": "Thi\xEAn C\u01B0\u01A1ng T\u1ECFa Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_thien_cuong_toa_linh",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.thien_ngoai_van_thiet",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 400,
      "mo_ta": "V\u1EABn thi\u1EBFt r\xE8n th\xE0nh ba m\u01B0\u01A1i s\xE1u \u0111inh, \u0111\xF3ng theo v\u1ECB tr\xED thi\xEAn c\u01B0\u01A1ng. Kh\u1EAFc ch\u1EADm, \u0111inh n\xE0o l\u1EC7ch l\xE0 tr\u1EADn h\u1EDF."
    },
    {
      "id": "dp.tran_tich_diet",
      "nghe": "tran_phap",
      "ten": "T\u1ECBch Di\u1EC7t tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_tich_diet",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.that_thai_doc_nang",
          "so": 2
        },
        {
          "id": "item.chuong_doc_tinh",
          "so": 2
        }
      ],
      "phu": [],
      "linh_thach": 300,
      "mo_ta": "T\xFAi \u0111\u1ED9c b\u1EA3y m\xE0u v\xE0 tinh ch\u01B0\u1EDBng \u0111\u1ED9c tr\u1ED9n l\xE0m m\u1EF1c, kh\u1EAFc tr\xEAn \u0111\xE1 h\xE0n ng\u1ECDc. Tr\u1EADn th\xE0nh th\xEC \u0111\u1EA5t quanh ba tr\u01B0\u1EE3ng kh\xF4ng m\u1ECDc n\u1ED5i c\u1ECF."
    },
    {
      "id": "dp.tran_cuu_tieu_loi",
      "nghe": "tran_phap",
      "ten": "C\u1EEDu Ti\xEAu L\xF4i tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_cuu_tieu_loi",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.loi_kich_moc",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 300,
      "mo_ta": "Hai kh\xFAc g\u1ED7 b\u1ECB s\xE9t \u0111\xE1nh ch\u1EBB th\xE0nh ch\xEDn ch\u1ED1t, c\u1EAFm quanh hai ph\xF4i h\xE0n ng\u1ECDc l\xE0m tr\u1EADn nh\xE3n. Kh\u1EAFc v\xE0o \u0111\xEAm gi\xF4ng, s\xE9t \u0111\xE1nh xu\u1ED1ng m\u1EDBi \u0111\xF3ng ch\u1ED1t."
    },
    {
      "id": "dp.tran_van_tuong_tu_linh",
      "nghe": "tran_phap",
      "ten": "V\u1EA1n T\u01B0\u1EE3ng T\u1EE5 Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_van_tuong_tu_linh",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.yeu_dan_4",
          "so": 1
        },
        {
          "id": "item.linh_xa_chau",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 800,
      "mo_ta": "T\u1EE9 giai y\xEAu \u0111an \u1EDF tr\u1EADn nh\xE3n, linh x\xE0 ch\xE2u d\u1EABn linh m\u1EA1ch theo \u0111\u01B0\u1EDDng r\u1EAFn b\xF2. Kh\u1EAFc ch\u1EADm, n\xFAi s\xF4ng tr\xEAn b\xE0n ph\u1EA3i kh\u1EDBp n\xFAi s\xF4ng ngo\xE0i tr\u1EDDi."
    },
    {
      "id": "dp.tran_chu_tuoc",
      "nghe": "tran_phap",
      "ten": "Chu T\u01B0\u1EDBc tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_chu_tuoc",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 3
        },
        {
          "id": "item.kim_o_vu",
          "so": 1
        }
      ],
      "phu": [
        {
          "loai": "linh_duoc",
          "he": [
            "hoa"
          ],
          "pham": 5,
          "so": 1
        }
      ],
      "hoa": "vu",
      "linh_thach": 600,
      "mo_ta": "L\xF4ng kim \xF4 \u0111\u1ED1t l\u1EA5y l\u1EEDa, m\u1ED9t v\u1ECB linh h\u1ECFa tr\u0103m n\u0103m l\xE0m d\u1EA7u, kh\u1EAFc tr\u1EADn trong l\u1EEDa. Kh\u1EAFc g\u1EA5p, l\u1EEDa ng\u1EEBng m\u1ED9t nh\u1ECBp l\xE0 ph\xF4i n\u1EE9t."
    },
    {
      "id": "dp.tran_van_nhac",
      "nghe": "tran_phap",
      "ten": "V\u1EA1n Nh\u1EA1c Tr\u1EA5n S\u01A1n tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_van_nhac",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 3
        },
        {
          "id": "item.boi_son_quy_giap",
          "so": 1
        },
        {
          "id": "item.huyen_quy_long_giap",
          "so": 1
        },
        {
          "id": "item.son_tinh_hach",
          "so": 2
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 1e3,
      "mo_ta": "Gi\xE1p r\xF9a c\xF5ng n\xFAi l\xE0m n\u1EC1n, gi\xE1p r\xF9a r\u1ED3ng l\xE0m v\xE1ch, hai h\u1EA1ch s\u01A1n tinh l\xE0m tr\u1EADn nh\xE3n. Kh\u1EAFc ch\u1EADm, m\u1ED9t n\xE9t m\u1ED9t ng\u1ECDn n\xFAi."
    },
    {
      "id": "dp.tran_tru_tien_kiem",
      "nghe": "tran_phap",
      "ten": "Tru Ti\xEAn Ki\u1EBFm tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_tru_tien_kiem",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 3
        },
        {
          "id": "item.canh_kim_tinh",
          "so": 1
        },
        {
          "id": "item.tan_kiem_y",
          "so": 4
        }
      ],
      "phu": [],
      "hoa": "vu",
      "linh_thach": 1e3,
      "mo_ta": "Canh kim tinh r\xE8n th\xE0nh b\u1ED1n thanh ki\u1EBFm nh\u1ECF, b\u1ED1n m\u1EA3nh ki\u1EBFm \xFD t\xE0n d\u1EABn v\xE0o b\u1ED1n c\u1EEDa. Kh\u1EAFc li\u1EC1n m\u1ED9t h\u01A1i, ch\u1EADm th\xEC ki\u1EBFm \xFD quay \u0111\u1EA7u ch\xE9m ng\u01B0\u1EDDi kh\u1EAFc."
    },
    {
      "id": "dp.tran_hon_nguyen_tu_linh",
      "nghe": "tran_phap",
      "ten": "H\u1ED7n Nguy\xEAn T\u1EE5 Linh tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_hon_nguyen_tu_linh",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 3
        },
        {
          "id": "item.yeu_dan_5",
          "so": 1
        },
        {
          "id": "item.hu_linh_phach",
          "so": 1
        }
      ],
      "phu": [],
      "hoa": "van",
      "linh_thach": 1600,
      "mo_ta": "Ng\u0169 giai y\xEAu \u0111an v\xE0 h\u01B0 linh ph\xE1ch \u0111\u1EB7t ch\u1ED3ng \u1EDF tr\u1EADn nh\xE3n, tr\u1EADn v\u0103n kh\u1EAFc th\xE0nh xo\xE1y kh\xF4ng \u0111\u1EA7u kh\xF4ng cu\u1ED1i. Kh\u1EAFc ch\u1EADm t\u1EDBi khi kh\xF4ng c\xF2n th\u1EA5y n\xE9t."
    },
    {
      "id": "dp.tran_cau_hon",
      "nghe": "tran_phap",
      "ten": "C\xE2u H\u1ED3n tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_cau_hon",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.am_phu_chi",
          "so": 1
        },
        {
          "id": "item.oan_hon_ty",
          "so": 2
        }
      ],
      "phu": [],
      "linh_thach": 40,
      "mo_ta": "T\u01A1 o\xE1n h\u1ED3n se th\xE0nh m\xF3c, gi\u1EA5y \xE2m ph\xF9 d\xE1n quanh m\xE9p. Kh\u1EAFc l\xFAc n\u1EEDa \u0111\xEAm, b\xEAn tai s\u1EBD c\xF3 ti\u1EBFng g\u1ECDi t\xEAn, \u0111\u1EEBng th\u01B0a."
    },
    {
      "id": "dp.tran_huyet_te",
      "nghe": "tran_phap",
      "ten": "Huy\u1EBFt T\u1EBF tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_huyet_te",
      "chu": [
        {
          "id": "item.phoi_thanh_ngoc",
          "so": 1
        },
        {
          "id": "item.bach_cot_phan",
          "so": 1
        },
        {
          "id": "item.huyet_dia_dich",
          "so": 2
        }
      ],
      "phu": [],
      "linh_thach": 40,
      "mo_ta": "B\u1ED9t x\u01B0\u01A1ng tr\u1EAFng tr\u1ED9n d\u1ECBch \u0111\u1EC9a l\xE0m m\u1EF1c, tr\u1EADn v\u0103n v\u1EBD th\xE0nh h\xECnh mi\u1EC7ng h\xE1. Tr\u1EADn th\xE0nh th\xEC m\u1EB7t ng\u1ECDc \u1EEDng \u0111\u1ECF nh\u01B0 v\u1EEBa u\u1ED1ng m\xE1u."
    },
    {
      "id": "dp.tran_tu_hon",
      "nghe": "tran_phap",
      "ten": "T\u1EE5 H\u1ED3n tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_tu_hon",
      "chu": [
        {
          "id": "item.phoi_linh_cot",
          "so": 1
        },
        {
          "id": "item.am_thuy_chau",
          "so": 2
        },
        {
          "id": "item.oan_hon_ty",
          "so": 2
        }
      ],
      "phu": [],
      "linh_thach": 40,
      "mo_ta": "Hai vi\xEAn \xE2m th\u1EE7y ch\xE2u ch\xF4n d\u01B0\u1EDBi ph\xF4i x\u01B0\u01A1ng, t\u01A1 o\xE1n h\u1ED3n qu\u1EA5n quanh th\xE0nh l\u1ED3ng. Kh\u1EAFc trong m\u1ED9 c\u1ED5 m\u1EDBi \u0111\u1EE7 \xE2m kh\xED."
    },
    {
      "id": "dp.tran_van_huyet",
      "nghe": "tran_phap",
      "ten": "V\u1EA1n Huy\u1EBFt tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_van_huyet",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 1
        },
        {
          "id": "item.thi_hach",
          "so": 1
        },
        {
          "id": "item.cuong_thi_nha",
          "so": 1
        }
      ],
      "phu": [],
      "mo_ta": "H\u1EA1ch thi v\xE0 nanh c\u01B0\u01A1ng thi nghi\u1EC1n l\xE0m m\u1EF1c, tr\u1EADn v\u0103n v\u1EBD th\xE0nh v\u1EA1n gi\u1ECDt m\xE1u. Tr\u1EADn th\xE0nh th\xEC h\xE0n ng\u1ECDc \u0111\u1ECF nh\u01B0 son."
    },
    {
      "id": "dp.tran_cuu_u",
      "nghe": "tran_phap",
      "ten": "C\u1EEDu U tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_cuu_u",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 2
        },
        {
          "id": "item.thi_mao",
          "so": 1
        },
        {
          "id": "item.am_binh_lenh",
          "so": 2
        }
      ],
      "phu": [],
      "linh_thach": 300,
      "mo_ta": "L\xF4ng thi v\xE0 hai t\u1EA5m \xE2m binh l\u1EC7nh ch\xF4n d\u01B0\u1EDBi ph\xF4i, kh\u1EAFc tr\u1EADn \u1EDF n\u01A1i ch\xEDn t\u1EA7ng \xE2m kh\xED. Xong tr\u1EADn th\xEC b\xEAn tai kh\xF4ng d\u1EE9t ti\u1EBFng kh\xF3c."
    },
    {
      "id": "dp.tran_huyet_hai",
      "nghe": "tran_phap",
      "ten": "Huy\u1EBFt H\u1EA3i tr\u1EADn \u0111\u1ED3",
      "ra": "item.tran_ban_huyet_hai",
      "chu": [
        {
          "id": "item.phoi_han_ngoc",
          "so": 3
        },
        {
          "id": "item.huyet_anh_tinh",
          "so": 1
        },
        {
          "id": "item.cuu_u_am_hoa",
          "so": 1
        }
      ],
      "phu": [],
      "mo_ta": "Huy\u1EBFt \u1EA3nh tinh tan trong c\u1EEDu u \xE2m h\u1ECFa th\xE0nh m\u1ED9t v\u0169ng m\xE1u s\xF4i, ba ph\xF4i ng\u1ECDc ng\xE2m v\xE0o t\u1EDBi khi \u0111\u1ECF su\u1ED1t. Tr\u1EADn v\u0103n t\u1EF1 hi\u1EC7n, ng\u01B0\u1EDDi kh\u1EAFc ch\u1EC9 vi\u1EC7c \u0111\u1EEBng ch\u1EBFt."
    }
  ];
  function getAllRecipes() {
    try {
      const liveDp = gWin.game?.env?.content?.donPhuong;
      if (liveDp && typeof liveDp.values === "function") {
        const list = [];
        for (const r of liveDp.values()) {
          list.push({
            id: r.id,
            nghe: r.nghe,
            ten: r.ten,
            ra: r.ra,
            ra_cuc: r.ra_cuc,
            chu: r.chu || [],
            phu: r.phu || [],
            hoa: r.hoa,
            linh_thach: r.linh_thach,
            mo_ta: r.mo_ta
          });
        }
        if (list.length > 0) return list;
      }
    } catch (e) {
    }
    return FALLBACK_RECIPES;
  }
  function getRecipeById(id) {
    const all = getAllRecipes();
    return all.find((r) => r.id === id);
  }
  function findMatchingItemForPhu(p) {
    if (p.id) return p.id;
    const items = getAllAvailableItems();
    const match = items.find((it) => {
      if (p.loai && it.cat !== p.loai) return false;
      if (p.pham !== void 0 && it.quality !== p.pham) return false;
      return true;
    });
    return match ? match.id : null;
  }
  function giveIngredientsForRecipe(recipeId, multiplier = 10) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) {
      notify("\u26A0\uFE0F Kh\xF4ng t\xECm th\u1EA5y c\xF4ng th\u1EE9c n\xE0y!");
      return false;
    }
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return false;
    }
    const nv = copyObj(state.run.nhanVat);
    const tuiDo = copyObj(nv.tuiDo || {});
    const addedList = [];
    for (const c of recipe.chu || []) {
      if (c.id) {
        const needed = (c.so || 1) * multiplier;
        tuiDo[c.id] = (tuiDo[c.id] || 0) + needed;
        const info = getItemInfo(c.id);
        addedList.push(`${info.name} x${needed}`);
      }
    }
    for (const p of recipe.phu || []) {
      const itemId = findMatchingItemForPhu(p);
      if (itemId) {
        const needed = (p.so || 1) * multiplier;
        tuiDo[itemId] = (tuiDo[itemId] || 0) + needed;
        const info = getItemInfo(itemId);
        addedList.push(`${info.name} x${needed}`);
      }
    }
    nv.tuiDo = tuiDo;
    nv.oTuiThem = Math.max(nv.oTuiThem || 0, Object.keys(tuiDo).length + 50);
    nv.xepTui = buildSyncedXepTui(nv.xepTui, tuiDo);
    const nextRun = copyObj(state.run);
    nextRun.nhanVat = nv;
    setGameState({ run: nextRun });
    persistGameSave(nextRun);
    notify(`\u{1F4E6} \u0110\xE3 th\xEAm nguy\xEAn li\u1EC7u ch\u1EBF t\xE1c x${multiplier}: ${addedList.slice(0, 2).join(", ")}...`);
    return true;
  }
  function giveCraftedProduct(recipeId, count = 5) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) {
      notify("\u26A0\uFE0F Kh\xF4ng t\xECm th\u1EA5y c\xF4ng th\u1EE9c n\xE0y!");
      return false;
    }
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
      return false;
    }
    const nv = copyObj(state.run.nhanVat);
    const tuiDo = copyObj(nv.tuiDo || {});
    const targetId = recipe.ra;
    tuiDo[targetId] = (tuiDo[targetId] || 0) + count;
    nv.tuiDo = tuiDo;
    nv.oTuiThem = Math.max(nv.oTuiThem || 0, Object.keys(tuiDo).length + 50);
    nv.xepTui = buildSyncedXepTui(nv.xepTui, tuiDo);
    const nextRun = copyObj(state.run);
    nextRun.nhanVat = nv;
    setGameState({ run: nextRun });
    persistGameSave(nextRun);
    const info = getItemInfo(targetId);
    notify(`\u2728 \u0110\xE3 nh\u1EADn th\xE0nh ph\u1EA9m: ${info.name} x${count}!`);
    return true;
  }

  // src/modules/automation.ts
  var originalSetTimeout = gWin.setTimeout;
  var originalSetInterval = gWin.setInterval;
  var currentSpeedMultiplier = 1;
  var isSpeedHackHooked = false;
  function setGameSpeed(multiplier) {
    currentSpeedMultiplier = Math.max(1, Math.min(10, multiplier));
    if (!isSpeedHackHooked && currentSpeedMultiplier > 1) {
      hookSpeedTimers();
    }
    notify(`\u26A1 T\u1ED1c \u0111\u1ED9 game \u0111\xE3 \u0111\u1EB7t th\xE0nh: ${currentSpeedMultiplier}x!`);
  }
  function getGameSpeed() {
    return currentSpeedMultiplier;
  }
  function hookSpeedTimers() {
    if (isSpeedHackHooked) return;
    isSpeedHackHooked = true;
    gWin.setTimeout = function(fn, delay, ...args) {
      const scaledDelay = currentSpeedMultiplier > 1 && typeof delay === "number" && delay > 10 ? Math.max(4, Math.round(delay / currentSpeedMultiplier)) : delay;
      return originalSetTimeout.call(gWin, fn, scaledDelay, ...args);
    };
    gWin.setInterval = function(fn, delay, ...args) {
      const scaledDelay = currentSpeedMultiplier > 1 && typeof delay === "number" && delay > 10 ? Math.max(10, Math.round(delay / currentSpeedMultiplier)) : delay;
      return originalSetInterval.call(gWin, fn, scaledDelay, ...args);
    };
    console.log("[VKTT MOD v3.0] \u0110\xE3 g\u1EAFn Speed Hack v\xE0o h\u1EC7 th\u1ED1ng timer!");
  }
  var autoCultivateTimer = null;
  var isAutoCultivateActive = false;
  function toggleAutoCultivate(enable) {
    if (enable !== void 0) {
      isAutoCultivateActive = enable;
    } else {
      isAutoCultivateActive = !isAutoCultivateActive;
    }
    if (isAutoCultivateActive) {
      if (autoCultivateTimer) clearInterval(autoCultivateTimer);
      autoCultivateTimer = setInterval(runAutoCultivateStep, 1e3);
      notify("\u{1F9D8} \u0110\xE3 B\u1EACT T\u1EF1 \u0110\u1ED9ng Tu Luy\u1EC7n!");
    } else {
      if (autoCultivateTimer) {
        clearInterval(autoCultivateTimer);
        autoCultivateTimer = null;
      }
      notify("\u23F8\uFE0F \u0110\xE3 T\u1EAET T\u1EF1 \u0110\u1ED9ng Tu Luy\u1EC7n!");
    }
    return isAutoCultivateActive;
  }
  function isAutoCultivateEnabled() {
    return isAutoCultivateActive;
  }
  function runAutoCultivateStep() {
    try {
      const state = getGameState();
      if (!state || !state.run || !state.run.nhanVat) return;
      const nv = state.run.nhanVat;
      const currentTuVi = nv.tuVi || 0;
      const maxTuVi = nv.tuViMax || 1e5;
      if (currentTuVi < maxTuVi) {
        const inc = Math.max(50, Math.floor(maxTuVi * 0.05));
        updateNhanVat({ tuVi: Math.min(maxTuVi, currentTuVi + inc) });
      }
    } catch (e) {
    }
  }
  var autoRecoveryTimer = null;
  var isAutoRecoveryActive = false;
  function toggleAutoRecovery(enable) {
    if (enable !== void 0) {
      isAutoRecoveryActive = enable;
    } else {
      isAutoRecoveryActive = !isAutoRecoveryActive;
    }
    if (isAutoRecoveryActive) {
      if (autoRecoveryTimer) clearInterval(autoRecoveryTimer);
      autoRecoveryTimer = setInterval(runAutoRecoveryStep, 800);
      notify("\u{1F496} \u0110\xE3 B\u1EACT T\u1EF1 \u0110\u1ED9ng H\u1ED3i Ph\u1EE5c Sinh L\u1EF1c & Ch\xE2n Nguy\xEAn!");
    } else {
      if (autoRecoveryTimer) {
        clearInterval(autoRecoveryTimer);
        autoRecoveryTimer = null;
      }
      notify("\u23F8\uFE0F \u0110\xE3 T\u1EAET T\u1EF1 \u0110\u1ED9ng H\u1ED3i Ph\u1EE5c!");
    }
    return isAutoRecoveryActive;
  }
  function isAutoRecoveryEnabled() {
    return isAutoRecoveryActive;
  }
  function runAutoRecoveryStep() {
    try {
      const state = getGameState();
      if (!state || !state.run || !state.run.nhanVat) return;
      const nv = state.run.nhanVat;
      const cs = nv.chiSo || {};
      const maxHp = cs.khiHuyetMax || 1e3;
      const curHp = cs.khiHuyet || 0;
      const maxMp = cs.chanNguyenMax || 1e3;
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
    } catch (e) {
    }
  }

  // src/modules/backup.ts
  function exportSaveFile() {
    try {
      const saveData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("tu-tien:") || key === "vktt_custom_items")) {
          const val = localStorage.getItem(key);
          if (val !== null) saveData[key] = val;
        }
      }
      if (Object.keys(saveData).length === 0) {
        return notify("\u26A0\uFE0F Kh\xF4ng t\xECm th\u1EA5y d\u1EEF li\u1EC7u l\u01B0u c\u1EE7a game trong tr\xECnh duy\u1EC7t!");
      }
      let charName = "DaoHuu";
      try {
        const meta = JSON.parse(saveData["tu-tien:meta"] || "{}");
        if (meta.ten) charName = meta.ten.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, "_");
      } catch (e) {
      }
      const jsonStr = JSON.stringify(saveData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      a.href = url;
      a.download = `VKTT-Save-${charName}-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notify("\u{1F4BE} \u0110\xE3 xu\u1EA5t file Save th\xE0nh c\xF4ng v\xE0 t\u1EA3i v\u1EC1 m\xE1y!");
    } catch (err) {
      notify("\u274C L\u1ED7i khi xu\u1EA5t Save: " + err.message);
    }
  }
  function importSaveJson(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== "object") {
        notify("\u274C File Save kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng JSON!");
        return false;
      }
      let count = 0;
      for (const k of Object.keys(data)) {
        if (k.startsWith("tu-tien:") || k === "vktt_custom_items") {
          localStorage.setItem(k, data[k]);
          count++;
        }
      }
      if (count === 0) {
        notify("\u26A0\uFE0F Kh\xF4ng c\xF3 m\u1EE5c d\u1EEF li\u1EC7u game h\u1EE3p l\u1EC7 trong file!");
        return false;
      }
      notify(`\u2705 \u0110\xE3 n\u1EA1p th\xE0nh c\xF4ng ${count} m\u1EE5c save! Trang s\u1EBD t\u1EA3i l\u1EA1i sau 1.5 gi\xE2y...`);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return true;
    } catch (e) {
      notify("\u274C L\u1ED7i n\u1EA1p Save: " + e.message);
      return false;
    }
  }
  function clearGameCache() {
    if (!confirm("\u26A0\uFE0F B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n T\u1EA8Y T\u1EE6Y (X\xF3a to\xE0n b\u1ED9 Save v\xE0 d\u1EEF li\u1EC7u \u0111\u1EC7m c\u1EE7a game tr\xEAn tr\xECnh duy\u1EC7t n\xE0y)?")) {
      return;
    }
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith("tu-tien:")) {
        localStorage.removeItem(k);
      }
    }
    notify("\u{1F300} \u0110\xE3 t\u1EA9y t\u1EE7y to\xE0n b\u1ED9 d\u1EEF li\u1EC7u. \u0110ang t\u1EA3i l\u1EA1i trang...");
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  }

  // src/ui/app.ts
  function initUI() {
    const styleEl = document.createElement("style");
    styleEl.innerText = MOD_STYLES;
    document.head.appendChild(styleEl);
    const fab = document.createElement("div");
    fab.id = "vktt-fab";
    fab.innerHTML = "\u262F";
    fab.title = "V\u1EA1n Ki\u1EBFp Tu Ti\xEAn MOD v3.0";
    document.body.appendChild(fab);
    const backdrop = document.createElement("div");
    backdrop.id = "vktt-backdrop";
    document.body.appendChild(backdrop);
    const drawer = document.createElement("div");
    drawer.id = "vktt-drawer";
    drawer.innerHTML = `
    <div class="vktt-drag-handle">
      <div class="vktt-drag-bar"></div>
    </div>
    <div class="vktt-header">
      <div class="vktt-title-wrap">
        <span class="vktt-title">\u262F V\u1EA0N KI\u1EBEP TU TI\xCAN</span>
        <span class="vktt-badge">v3.5 PHI\xCAN B\u1EA2N M\u1EDAI</span>
      </div>
      <button class="vktt-close-btn" id="vktt-btn-close">\u2715</button>
    </div>
    <div class="vktt-tabs">
      <button class="vktt-tab-btn active" data-tab="tab-nhan-vat">\u{1F451} Tu Ti\xEAn</button>
      <button class="vktt-tab-btn" data-tab="tab-ngu-linh">\u{1F43E} Ng\u1EF1 Linh</button>
      <button class="vktt-tab-btn" data-tab="tab-kho-do">\u{1F392} Kho \u0110\u1ED3</button>
      <button class="vktt-tab-btn" data-tab="tab-kinh-mach">\u{1F4DC} Kinh M\u1EA1ch</button>
      <button class="vktt-tab-btn" data-tab="tab-tu-dong">\u26A1 T\u1EF1 \u0110\u1ED9ng</button>
      <button class="vktt-tab-btn" data-tab="tab-sao-luu">\u{1F4BE} Sao L\u01B0u</button>
    </div>
    <div class="vktt-content" id="vktt-tab-content">
      <!-- DYNAMIC TAB PANELS WILL BE RENDERED HERE -->
    </div>
  `;
    document.body.appendChild(drawer);
    setupFabTouchDrag(fab);
    function openDrawer() {
      drawer.classList.add("open");
      backdrop.classList.add("open");
      const activeTab = drawer.querySelector(".vktt-tab-btn.active")?.getAttribute("data-tab") || "tab-nhan-vat";
      renderTabContent(activeTab);
    }
    function closeDrawer() {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
    }
    fab.onclick = (e) => {
      e.stopPropagation();
      if (drawer.classList.contains("open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };
    backdrop.onclick = closeDrawer;
    const closeBtn = document.getElementById("vktt-btn-close");
    if (closeBtn) closeBtn.onclick = closeDrawer;
    const tabBtns = drawer.querySelectorAll(".vktt-tab-btn");
    tabBtns.forEach((btn) => {
      btn.onclick = () => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        renderTabContent(tabId || "tab-nhan-vat");
      };
    });
    renderTabContent("tab-nhan-vat");
  }
  function setupFabTouchDrag(fab) {
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let initialBottom = 80;
    fab.addEventListener("touchstart", (e) => {
      isDragging = false;
      startY = e.touches[0].clientY;
    }, { passive: true });
    fab.addEventListener("touchmove", (e) => {
      currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      if (Math.abs(deltaY) > 8) {
        isDragging = true;
        const newBottom = Math.max(20, Math.min(window.innerHeight - 70, initialBottom + deltaY));
        fab.style.bottom = `${newBottom}px`;
      }
    }, { passive: true });
    fab.addEventListener("touchend", () => {
      if (isDragging) {
        initialBottom = parseInt(fab.style.bottom || "80", 10);
      }
    });
  }
  function readInputOrPlaceholder(id, fallbackVal) {
    const el = document.getElementById(id);
    if (!el) return fallbackVal;
    const v = parseInt(el.value, 10);
    if (!isNaN(v)) return v;
    const p = parseInt(el.placeholder, 10);
    return !isNaN(p) ? p : fallbackVal;
  }
  function renderTabContent(tabId) {
    const container = document.getElementById("vktt-tab-content");
    if (!container) return;
    if (tabId === "tab-nhan-vat") {
      container.innerHTML = getTabNhanVatHtml();
      bindTabNhanVatEvents();
    } else if (tabId === "tab-ngu-linh") {
      container.innerHTML = getTabNguLinhHtml();
      bindTabNguLinhEvents();
    } else if (tabId === "tab-kho-do") {
      container.innerHTML = getTabKhoDoHtml();
      bindTabKhoDoEvents();
    } else if (tabId === "tab-kinh-mach") {
      container.innerHTML = getTabKinhMachHtml();
      bindTabKinhMachEvents();
    } else if (tabId === "tab-tu-dong") {
      container.innerHTML = getTabTuDongHtml();
      bindTabTuDongEvents();
    } else if (tabId === "tab-sao-luu") {
      container.innerHTML = getTabSaoLuuHtml();
      bindTabSaoLuuEvents();
    }
  }
  function getTabNhanVatHtml() {
    const state = getGameState();
    const nv = state?.run?.nhanVat || {};
    const meta = state?.meta || {};
    const cs = nv.chiSo || {};
    const REALM_NAMES = {
      0: "Ph\xE0m Nh\xE2n",
      1: "Luy\u1EC7n Kh\xED",
      2: "Tr\xFAc C\u01A1",
      3: "K\u1EBFt \u0110an",
      4: "Nguy\xEAn Anh",
      5: "H\xF3a Th\u1EA7n"
    };
    const SUB_NAMES = {
      0: "S\u01A1 k\u1EF3",
      1: "Trung k\u1EF3",
      2: "H\u1EADu k\u1EF3",
      3: "\u0110\u1EA1i vi\xEAn m\xE3n"
    };
    const realmStr = `${REALM_NAMES[nv.canhGioi] || "Ch\u01B0a r\xF5"} (${SUB_NAMES[nv.tieuCanhGioi] || "0"})`;
    const tcName = THE_CHAT_DB[nv.theChat]?.ten || nv.theChat || "Ph\xE0m th\u1EC3";
    const lcPham = (nv.linhCan?.pham || "Ch\u01B0a c\xF3").toUpperCase();
    const lcHe = nv.linhCan?.he && nv.linhCan.he.length ? nv.linhCan.he.join("/") : "V\xF4";
    const congTichVal = state?.run?.tongMon?.congTich ?? 0;
    return `
    <!-- B\u1EA2NG T\u1ED4NG QUAN CH\u1EC8 S\u1ED0 NH\xC2N V\u1EACT HI\u1EC6N T\u1EA0I -->
    <div class="vktt-stat-overview">
      <div>\u{1F48E} Linh Th\u1EA1ch: <b>${(nv.linhThach || 0).toLocaleString()}</b></div>
      <div>\u2728 Tu Vi: <b>${Math.floor(nv.tuVi || 0).toLocaleString()}</b></div>
      <div>\u26A1 C\u1EA3nh Gi\u1EDBi: <b style="color:#e5b869;">${realmStr}</b></div>
      <div>\u23F3 Tu\u1ED5i: <b>${Math.floor(nv.tuoi || 18)}</b></div>
      <div>\u{1F4DC} C\u1ED1ng Hi\u1EBFn: <b>${(nv.congHien || 0).toLocaleString()}</b></div>
      <div>\u{1F3DB}\uFE0F C\xF4ng T\xEDch: <b style="color:#38bdf8;">${congTichVal.toLocaleString()}</b></div>
      <div style="grid-column: span 2;">\u{1F9EC} Th\u1EC3 Ch\u1EA5t: <b style="color:#e5b869;">${tcName}</b></div>
      <div style="grid-column: span 2;">\u{1F331} Linh C\u0103n: <b style="color:#38bdf8;">${lcPham} (${lcHe})</b></div>
    </div>

    <!-- N\xDAT BUFF NHANH TO\xC0N DI\u1EC6N -->
    <div style="display:flex;gap:6px;margin-bottom:8px;">
      <button id="vktt-btn-all-in-one" class="vktt-btn" style="flex:1;">\u{1F680} Si\xEAu Buff To\xE0n Di\u1EC7n 1-Click</button>
      <button id="vktt-btn-clear-binh-canh" class="vktt-btn vktt-btn-cyan">\u{1F48A} X\xF3a B\xECnh C\u1EA3nh</button>
    </div>

    <!-- KH\u1ED0I 1: T\xC0I NGUY\xCAN & M\xD4N PH\xC1I -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F4B0} 1. T\xE0i Nguy\xEAn, Tu\u1ED5i Th\u1ECD & M\xF4n Ph\xE1i</div>
      <div class="vktt-row">
        <span class="vktt-lbl">\u0110\u1EA1o Hi\u1EC7u:</span>
        <input type="text" id="vktt-inp-ten" class="vktt-inp" placeholder="${nv.ten || "\u0110\u1EA1o H\u1EEFu"}" />
        <button id="vktt-btn-ten" class="vktt-btn vktt-btn-sm">\u0110\u1ED5i</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Linh Th\u1EA1ch:</span>
        <input type="number" id="vktt-inp-lt" class="vktt-inp" placeholder="${nv.linhThach || 999999}" />
        <button id="vktt-btn-lt" class="vktt-btn vktt-btn-sm">G\xE1n</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Tu Vi:</span>
        <input type="number" id="vktt-inp-tv" class="vktt-inp" placeholder="${Math.floor(nv.tuVi || 999999)}" />
        <button id="vktt-btn-tv" class="vktt-btn vktt-btn-sm">G\xE1n</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Th\u1ECD Nguy\xEAn+:</span>
        <input type="number" id="vktt-inp-tnt" class="vktt-inp" placeholder="${nv.thoNguyenThem || 5e3}" />
        <button id="vktt-btn-tnt" class="vktt-btn vktt-btn-sm">G\xE1n</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Tu\u1ED5i:</span>
        <input type="number" id="vktt-inp-tuoi" class="vktt-inp" placeholder="${Math.floor(nv.tuoi || 18)}" />
        <button id="vktt-btn-tuoi" class="vktt-btn vktt-btn-sm">G\xE1n</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">C\u1ED1ng Hi\u1EBFn:</span>
        <input type="number" id="vktt-inp-ch" class="vktt-inp" placeholder="${nv.congHien || 99999}" />
        <button id="vktt-btn-ch" class="vktt-btn vktt-btn-sm">G\xE1n</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">C\xF4ng T\xEDch:</span>
        <input type="number" id="vktt-inp-ct" class="vktt-inp" placeholder="${congTichVal || 99999}" />
        <button id="vktt-btn-ct" class="vktt-btn vktt-btn-sm">G\xE1n</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Ch\u1EE9c V\u1ECB Ph\xE1i:</span>
        <select id="vktt-sel-capbac" class="vktt-select" style="flex:1;">
          <option value="0">0 - Ngo\u1EA1i M\xF4n / T\xE1n Tu</option>
          <option value="1">1 - \u0110\u1EC7 T\u1EED N\u1ED9i M\xF4n</option>
          <option value="2">2 - Ch\xE2n Truy\u1EC1n \u0110\u1EC7 T\u1EED</option>
          <option value="3">3 - Ch\u1EA5p S\u1EF1 / \u0110\u01B0\u1EDDng Ch\u1EE7</option>
          <option value="4" selected>4 - Tr\u01B0\u1EDFng L\xE3o</option>
          <option value="5">5 - Th\xE1i Th\u01B0\u1EE3ng Tr\u01B0\u1EDFng L\xE3o</option>
        </select>
        <button id="vktt-btn-capbac" class="vktt-btn vktt-btn-sm">G\xE1n</button>
      </div>
    </div>

    <!-- KH\u1ED0I 2: C\u1EA2NH GI\u1EDAI, KIM \u0110AN, \xDD C\u1EA2NH & D\u1ECA T\u01AF\u1EE2NG -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F31F} 2. C\u1EA3nh Gi\u1EDBi & \u0110\u1ED9t Ph\xE1</div>
      <div class="vktt-row">
        <span class="vktt-lbl">\u0110\u1EA1i C\u1EA3nh Gi\u1EDBi:</span>
        <select id="vktt-sel-cg" class="vktt-select" style="flex:1;">
          <option value="5" ${nv.canhGioi === 5 ? "selected" : ""}>5 - H\xF3a Th\u1EA7n</option>
          <option value="4" ${nv.canhGioi === 4 ? "selected" : ""}>4 - Nguy\xEAn Anh</option>
          <option value="3" ${nv.canhGioi === 3 ? "selected" : ""}>3 - K\u1EBFt \u0110an (Kim \u0110an)</option>
          <option value="2" ${nv.canhGioi === 2 ? "selected" : ""}>2 - Tr\xFAc C\u01A1</option>
          <option value="1" ${nv.canhGioi === 1 ? "selected" : ""}>1 - Luy\u1EC7n Kh\xED</option>
          <option value="0" ${nv.canhGioi === 0 ? "selected" : ""}>0 - Ph\xE0m Nh\xE2n</option>
        </select>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Ti\u1EC3u C\u1EA3nh Gi\u1EDBi:</span>
        <select id="vktt-sel-tcg" class="vktt-select" style="flex:1;">
          <option value="3" ${nv.tieuCanhGioi === 3 ? "selected" : ""}>3 - \u0110\u1EA1i vi\xEAn m\xE3n</option>
          <option value="2" ${nv.tieuCanhGioi === 2 ? "selected" : ""}>2 - H\u1EADu k\u1EF3</option>
          <option value="1" ${nv.tieuCanhGioi === 1 ? "selected" : ""}>1 - Trung k\u1EF3</option>
          <option value="0" ${nv.tieuCanhGioi === 0 ? "selected" : ""}>0 - S\u01A1 k\u1EF3</option>
        </select>
        <button id="vktt-btn-cg" class="vktt-btn vktt-btn-cyan vktt-btn-sm">\u0110\u1ED9t Ph\xE1</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Kim \u0110an / \xDD:</span>
        <select id="vktt-sel-kimdan" class="vktt-select" style="flex:1;">
          <option value="1" ${nv.kimDan === 1 ? "selected" : ""}>Kim \u0110an Nh\u1EA5t Ph\u1EA9m</option>
          <option value="2" ${nv.kimDan === 2 ? "selected" : ""}>Nh\u1ECB Ph\u1EA9m</option>
          <option value="3" ${nv.kimDan === 3 ? "selected" : ""}>Tam Ph\u1EA9m</option>
          <option value="4" ${nv.kimDan === 4 ? "selected" : ""}>T\u1EE9 Ph\u1EA9m</option>
          <option value="5" ${nv.kimDan === 5 ? "selected" : ""}>Ng\u0169 Ph\u1EA9m</option>
        </select>
        <select id="vktt-sel-ycanh" class="vktt-select" style="flex:1;">
          <option value="Ki\u1EBFm \xFD" ${nv.yCanh === "Ki\u1EBFm \xFD" ? "selected" : ""}>Ki\u1EBFm \xFD</option>
          <option value="L\xF4i \xFD" ${nv.yCanh === "L\xF4i \xFD" ? "selected" : ""}>L\xF4i \xFD</option>
          <option value="B\u0103ng \xFD" ${nv.yCanh === "B\u0103ng \xFD" ? "selected" : ""}>B\u0103ng \xFD</option>
          <option value="Phong \xFD" ${nv.yCanh === "Phong \xFD" ? "selected" : ""}>Phong \xFD</option>
          <option value="T\u1EEB bi" ${nv.yCanh === "T\u1EEB bi" ? "selected" : ""}>T\u1EEB bi</option>
          <option value="H\u01B0 v\xF4 \xFD" ${nv.yCanh === "H\u01B0 v\xF4 \xFD" ? "selected" : ""}>H\u01B0 v\xF4 \xFD</option>
          <option value="H\u1ECFa \xFD" ${nv.yCanh === "H\u1ECFa \xFD" ? "selected" : ""}>H\u1ECFa \xFD</option>
        </select>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">D\u1ECB T\u01B0\u1EE3ng / T\xFAc:</span>
        <select id="vktt-sel-dituong" class="vktt-select" style="flex:1;">
          <option value="kim" ${nv.diTuong === "kim" ? "selected" : ""}>Ki\u1EBFm Anh (Kim)</option>
          <option value="loi" ${nv.diTuong === "loi" ? "selected" : ""}>L\xF4i Anh (L\xF4i)</option>
          <option value="bang" ${nv.diTuong === "bang" ? "selected" : ""}>B\u0103ng Anh (B\u0103ng)</option>
          <option value="phong" ${nv.diTuong === "phong" ? "selected" : ""}>Phong Anh</option>
          <option value="hoa" ${nv.diTuong === "hoa" ? "selected" : ""}>X\xEDch Di\u1EC5m Anh</option>
          <option value="moc" ${nv.diTuong === "moc" ? "selected" : ""}>Thanh Li\xEAn Anh</option>
          <option value="thuy" ${nv.diTuong === "thuy" ? "selected" : ""}>Huy\u1EC1n Th\u1EE7y Anh</option>
          <option value="tho" ${nv.diTuong === "tho" ? "selected" : ""}>H\u1EADu Th\u1ED5 Anh</option>
        </select>
        <input type="number" id="vktt-inp-tuctue" class="vktt-inp" step="0.1" placeholder="${nv.tucTue || 1}" style="width:50px;flex:none;" />
        <button id="vktt-btn-extra-realm" class="vktt-btn vktt-btn-sm">L\u01B0u</button>
      </div>
    </div>

    
    <!-- KH\u1ED0I MA \u0110\u1EA0O (T\xC0 TU / CH\xCDNH \u0110\u1EA0O) -->
    <div class="vktt-card vktt-card-madao">
      <div class="vktt-card-hdr">
        <span>\u262F \u0110\u1EA1o C\u01A1: Ch\xEDnh \u0110\u1EA1o \u21CB Ma \u0110\u1EA1o (T\xE0 Tu)</span>
        <span class="vktt-badge" style="${nv.path === "ta" ? "background:rgba(163,29,29,0.3);color:#ff9e9e;" : "background:rgba(47,122,92,0.3);color:#a7dfc9;"}">
          ${nv.path === "ta" ? "\u{1FA78} T\xE0 Tu (Ma \u0110\u1EA1o)" : "\u2728 Ch\xEDnh \u0110\u1EA1o"}
        </span>
      </div>
      <div style="font-size:11.5px;color:var(--vktt-chu-nhat);margin-bottom:8px;line-height:1.4;">
        C\u01A1 ch\u1EBF: Khi l\xE0 <b>T\xE0 Tu</b>, T\xE2m Ma bi\u1EBFn th\xE0nh <b>Ma Ni\u1EC7m</b> buff uy l\u1EF1c chi\xEAu th\u1EE9c. \u0110\u1EA1o T\xE2m gi\u1EEF b\u1EA3n t\xE2m kh\xF4ng b\u1ECB ph\u1EA3n ph\u1EC7.
      </div>
      <div class="vktt-row" style="margin-bottom:6px;">
        <button id="vktt-btn-path-ta" class="vktt-btn vktt-btn-madao" style="flex:1;">\u{1FA78} Nh\u1EADp Ma \u0110\u1EA1o (T\xE0 Tu)</button>
        <button id="vktt-btn-path-chinh" class="vktt-btn vktt-btn-jade" style="flex:1;">\u2728 Quy Y Ch\xEDnh \u0110\u1EA1o</button>
      </div>
      <div class="vktt-row">
        <button id="vktt-btn-max-demon" class="vktt-btn vktt-btn-madao" style="flex:1;">\u{1F525} Max Ma Ni\u1EC7m (600) + B\u1EA5t Ho\u1EA1i (600 \u0110\u1EA1o T\xE2m)</button>
        <button id="vktt-btn-purify-demon" class="vktt-btn vktt-btn-phu" style="flex:1;">\u{1F54A}\uFE0F T\u1ECBnh H\xF3a Ma Ni\u1EC7m</button>
      </div>
    </div>

    <!-- KH\u1ED0I 3: TH\u1EC2 CH\u1EA4T (9 TH\u1EC2 CH\u1EA4T CHU\u1EA8N) & LINH C\u0102N -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F9EC} 3. Th\u1EC3 Ch\u1EA5t Chu\u1EA9n Game & Linh C\u0103n</div>
      <div class="vktt-row">
        <select id="vktt-sel-tc" class="vktt-select" style="flex:1;">
          <option value="the_chat.hoang_co" ${nv.theChat === "the_chat.hoang_co" ? "selected" : ""}>\u{1F451} Hoang C\u1ED5 Th\xE1nh Th\u1EC3 (121 \xF4)</option>
          <option value="the_chat.cuu_am" ${nv.theChat === "the_chat.cuu_am" ? "selected" : ""}>\u2744\uFE0F C\u1EEDu \xC2m Tuy\u1EC7t M\u1EA1ch (B\u0103ng)</option>
          <option value="the_chat.kiem_cot" ${nv.theChat === "the_chat.kiem_cot" ? "selected" : ""}>\u2694\uFE0F Ki\u1EBFm C\u1ED1t Th\u1EC3 (Ki\u1EBFm +25%)</option>
          <option value="the_chat.bach_thao" ${nv.theChat === "the_chat.bach_thao" ? "selected" : ""}>\u{1F33F} B\xE1ch Th\u1EA3o Th\u1EC3 (\u0110an tu)</option>
          <option value="the_chat.thiet_cot" ${nv.theChat === "the_chat.thiet_cot" ? "selected" : ""}>\u{1F6E1}\uFE0F Thi\u1EBFt C\u1ED1t Th\u1EC3 (Kh\xED huy\u1EBFt)</option>
          <option value="the_chat.am_hon" ${nv.theChat === "the_chat.am_hon" ? "selected" : ""}>\u{1F47B} \xC2m H\u1ED3n Th\u1EC3 (+1 Slot Thi/Qu\u1EF7 - M\u1EDBi)</option>
          <option value="the_chat.huyen_vu" ${nv.theChat === "the_chat.huyen_vu" ? "selected" : ""}>\u{1F422} Huy\u1EC1n V\u0169 Th\u1EC3 (Kh\xE1ng Ph\u1EA3n Ph\u1EC7 50% - M\u1EDBi)</option>
          <option value="the_chat.liet_duong" ${nv.theChat === "the_chat.liet_duong" ? "selected" : ""}>\u2600\uFE0F Li\u1EC7t D\u01B0\u01A1ng Th\u1EC3 (Tu Luy\u1EC7n +25%, H\u1ECFa +25% - M\u1EDBi)</option>
          <option value="the_chat.pham_the" ${nv.theChat === "the_chat.pham_the" ? "selected" : ""}>\u{1F464} Ph\xE0m Th\u1EC3</option>
        </select>
        <button id="vktt-btn-tc" class="vktt-btn vktt-btn-purple vktt-btn-sm">G\xE1n Th\u1EC3 Ch\u1EA5t</button>
      </div>

      <div style="margin-top:6px;padding-top:6px;border-top:1px dashed rgba(229,184,105,0.25);">
        <label class="vktt-label">T\xEDch ch\u1ECDn H\u1EC7 Linh C\u0103n:</label>
        <div class="vktt-linhcan-grid">
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="kim" ${nv.linhCan?.he?.includes("kim") ? "checked" : ""}> \u2694\uFE0FKim</label>
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="moc" ${nv.linhCan?.he?.includes("moc") ? "checked" : ""}> \u{1F33F}M\u1ED9c</label>
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="thuy" ${nv.linhCan?.he?.includes("thuy") ? "checked" : ""}> \u{1F4A7}Th\u1EE7y</label>
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="hoa" ${nv.linhCan?.he?.includes("hoa") ? "checked" : ""}> \u{1F525}H\u1ECFa</label>
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="tho" ${nv.linhCan?.he?.includes("tho") ? "checked" : ""}> \u26F0\uFE0FTh\u1ED5</label>
          <label class="vktt-chk-label" style="color:#70dbff;"><input type="checkbox" name="vktt-lc-he" value="bang" ${nv.linhCan?.he?.includes("bang") ? "checked" : ""}> \u2744\uFE0FB\u0103ng</label>
          <label class="vktt-chk-label" style="color:#aaffaa;"><input type="checkbox" name="vktt-lc-he" value="phong" ${nv.linhCan?.he?.includes("phong") ? "checked" : ""}> \u{1F32A}\uFE0FPhong</label>
          <label class="vktt-chk-label" style="color:#ffff70;"><input type="checkbox" name="vktt-lc-he" value="loi" ${nv.linhCan?.he?.includes("loi") ? "checked" : ""}> \u26A1L\xF4i</label>
        </div>
        <div style="display:flex;gap:6px;margin-top:6px;">
          <button id="vktt-btn-gan-lc" class="vktt-btn vktt-btn-green vktt-btn-sm" style="flex:1;">\u{1F331} G\xE1n Linh C\u0103n \u0110\xE3 T\xEDch</button>
          <button id="vktt-btn-go-lc" class="vktt-btn vktt-btn-ghost vktt-btn-sm">G\u1EE1 (V\xF4)</button>
        </div>

        <!-- M\u1EAAU LINH C\u0102N C\xD3 S\u1EB4N (PRESETS) -->
        <div style="margin-top:8px;padding-top:6px;border-top:1px dashed rgba(229,184,105,0.25);">
          <label class="vktt-label">\u{1F4CB} M\u1EABu Linh C\u0103n C\xF3 S\u1EB5n (Song Linh, Bi\u1EBFn D\u1ECB, Ng\u0169 H\xE0nh...):</label>
          <div class="vktt-row">
            <select id="vktt-sel-lc-preset" class="vktt-select" style="flex:1;">
              <option value="">-- Ch\u1ECDn M\u1EABu Linh C\u0103n --</option>
              <optgroup label="\u{1F31F} To\xE0n H\u1EC7 & Ng\u0169 H\xE0nh">
                <option value="bat_hoang">\u{1F31F} B\xE1t Hoang Ti\xEAn C\u0103n (To\xE0n B\u1ED9 8 H\u1EC7)</option>
                <option value="ngu_hanh">\u262F\uFE0F Ng\u0169 H\xE0nh Linh C\u0103n (Kim M\u1ED9c Th\u1EE7y H\u1ECFa Th\u1ED5)</option>
              </optgroup>
              <optgroup label="\u26A1 Bi\u1EBFn D\u1ECB Linh C\u0103n">
                <option value="loi">\u26A1 Thi\xEAn L\xF4i Linh C\u0103n</option>
                <option value="bang">\u2744\uFE0F Thi\xEAn B\u0103ng Linh C\u0103n</option>
                <option value="phong">\u{1F32A}\uFE0F Thi\xEAn Phong Linh C\u0103n</option>
                <option value="tam_di">\u26A1\u2744\uFE0F\u{1F32A}\uFE0F Tam D\u1ECB Linh C\u0103n (L\xF4i + B\u0103ng + Phong)</option>
              </optgroup>
              <optgroup label="\u{1F451} Thi\xEAn Linh C\u0103n (Thu\u1EA7n H\u1EC7)">
                <option value="kim">\u2694\uFE0F Thi\xEAn Kim Linh C\u0103n</option>
                <option value="moc">\u{1F33F} Thi\xEAn M\u1ED9c Linh C\u0103n</option>
                <option value="thuy">\u{1F30A} Thi\xEAn Th\u1EE7y Linh C\u0103n</option>
                <option value="hoa">\u{1F525} Thi\xEAn H\u1ECFa Linh C\u0103n</option>
                <option value="tho">\u26F0\uFE0F Thi\xEAn Th\u1ED5 Linh C\u0103n</option>
              </optgroup>
              <optgroup label="\u{1F91D} Song Linh C\u0103n (T\u01B0\u01A1ng Sinh T\u1ED1i \u01AFu)">
                <option value="kim_thuy">\u2694\uFE0F\u{1F30A} Kim Th\u1EE7y Song Linh (Kim sinh Th\u1EE7y)</option>
                <option value="thuy_moc">\u{1F30A}\u{1F33F} Th\u1EE7y M\u1ED9c Song Linh (Th\u1EE7y sinh M\u1ED9c)</option>
                <option value="moc_hoa">\u{1F33F}\u{1F525} M\u1ED9c H\u1ECFa Song Linh (M\u1ED9c sinh H\u1ECFa)</option>
                <option value="hoa_tho">\u{1F525}\u26F0\uFE0F H\u1ECFa Th\u1ED5 Song Linh (H\u1ECFa sinh Th\u1ED5)</option>
                <option value="tho_kim">\u26F0\uFE0F\u2694\uFE0F Th\u1ED5 Kim Song Linh (Th\u1ED5 sinh Kim)</option>
              </optgroup>
            </select>
            <button id="vktt-btn-apply-lc-preset" class="vktt-btn vktt-btn-cyan vktt-btn-sm">G\xE1n M\u1EABu</button>
          </div>
        </div>
      </div>
    </div>

    <!-- KH\u1ED0I 4: TH\u1EA4T \u0110\u1EA0I CH\u1EC8 S\u1ED0 TU CH\xC2N (T\xCDCH CH\u1ECCN THU\u1ED8C T\xCDNH) -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">
        <span>\u{1F4CA} 4. Th\u1EA5t \u0110\u1EA1i Ch\u1EC9 S\u1ED1 Tu Ch\xE2n</span>
        <button id="vktt-btn-toggle-all-stat" class="vktt-btn vktt-btn-ghost" style="height:24px;padding:0 7px;font-size:10.5px;">T\xEDch T\u1EA5t C\u1EA3</button>
      </div>

      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="ngo_tinh" checked> \u{1F4A1} Ng\u1ED9 t\xEDnh:</label>
        <input type="number" id="vktt-inp-ngo-tinh" class="vktt-inp" placeholder="${cs.ngo_tinh || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="ngo_tinh">G\xE1n</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="can_cot" checked> \u{1F9B4} C\u0103n c\u1ED1t:</label>
        <input type="number" id="vktt-inp-can-cot" class="vktt-inp" placeholder="${cs.can_cot || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="can_cot">G\xE1n</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="dao_tam" checked> \u{1F9D8} \u0110\u1EA1o t\xE2m:</label>
        <input type="number" id="vktt-inp-dao-tam" class="vktt-inp" placeholder="${cs.dao_tam || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="dao_tam">G\xE1n</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="than_phap" checked> \u26A1 Th\xE2n ph\xE1p:</label>
        <input type="number" id="vktt-inp-than-phap" class="vktt-inp" placeholder="${cs.than_phap || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="than_phap">G\xE1n</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="khi_van" checked> \u{1F340} Kh\xED v\u1EADn:</label>
        <input type="number" id="vktt-inp-khi-van" class="vktt-inp" placeholder="${cs.khi_van || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="khi_van">G\xE1n</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="tam_ma"> \u{1F479} T\xE2m ma:</label>
        <input type="number" id="vktt-inp-tam-ma" class="vktt-inp" placeholder="${cs.tam_ma || 0}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="tam_ma">G\xE1n</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="than_thuc" checked> \u{1F441}\uFE0F Th\u1EA7n th\u1EE9c:</label>
        <input type="number" id="vktt-inp-than-thuc" class="vktt-inp" placeholder="${cs.than_thuc || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="than_thuc">G\xE1n</button>
      </div>

      <div style="display:flex;gap:6px;margin-top:8px;">
        <button id="vktt-btn-stat-200" class="vktt-btn vktt-btn-cyan vktt-btn-sm" style="flex:1;">\u26A1 \u0110\xE3 T\xEDch = 200</button>
        <button id="vktt-btn-stat-600" class="vktt-btn vktt-btn-sm" style="flex:1;">\u{1F525} \u0110\xE3 T\xEDch = 600</button>
      </div>
      <button id="vktt-btn-clear-tam-ma" class="vktt-btn vktt-btn-ghost vktt-btn-block" style="margin-top:5px;height:30px;font-size:11px;">
        \u{1F9F9} X\xF3a S\u1EA1ch T\xE2m Ma (= 0)
      </button>
    </div>

    <!-- KH\u1ED0I 5: LU\xC2N H\u1ED2I, L\xC3O \u0110\xD2 & TH\xC0NH T\u1EF0U -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F30C} 5. \u0110i\u1EC3m Lu\xE2n H\u1ED3i, L\xE3o \u0110\xF2 & Th\xE0nh T\u1EF1u</div>
      <div class="vktt-row">
        <span class="vktt-lbl">\u0110i\u1EC3m Lu\xE2n H\u1ED3i:</span>
        <input type="number" id="vktt-inp-dlh" class="vktt-inp" placeholder="${meta.diemLuanHoi || 999999}" />
        <button id="vktt-btn-dlh" class="vktt-btn vktt-btn-sm">G\xE1n</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">S\u1ED1 Ki\u1EBFp:</span>
        <input type="number" id="vktt-inp-kiep" class="vktt-inp" placeholder="${meta.kiep || 38}" />
        <button id="vktt-btn-kiep" class="vktt-btn vktt-btn-sm">G\xE1n</button>
      </div>
      <button id="vktt-btn-all-achieve" class="vktt-btn vktt-btn-purple vktt-btn-block" style="margin-top:6px;">
        \u{1F30C} Max 999,999 \u0110i\u1EC3m + M\u1EDF Kh\xF3a 17 L\xE3o \u0110\xF2 & 28 Th\xE0nh T\u1EF1u
      </button>
    </div>
  `;
  }
  function bindTabNhanVatEvents() {
    const btnTen = document.getElementById("vktt-btn-ten");
    if (btnTen) {
      btnTen.onclick = () => {
        const inp = document.getElementById("vktt-inp-ten");
        const v = (inp?.value || inp?.placeholder || "").trim();
        if (v) {
          updateNhanVat({ ten: v });
          notify(`\u2705 \u0110\xE3 \u0111\u1ED5i \u0110\u1EA1o Hi\u1EC7u th\xE0nh: ${v}`);
          renderTabContent("tab-nhan-vat");
        }
      };
    }
    const btnLt = document.getElementById("vktt-btn-lt");
    if (btnLt) {
      btnLt.onclick = () => {
        const v = readInputOrPlaceholder("vktt-inp-lt", 999999);
        updateNhanVat({ linhThach: v });
        notify(`\u{1F48E} \u0110\xE3 g\xE1n Linh Th\u1EA1ch = ${v.toLocaleString()}!`);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnTv = document.getElementById("vktt-btn-tv");
    if (btnTv) {
      btnTv.onclick = () => {
        const v = readInputOrPlaceholder("vktt-inp-tv", 999999);
        updateNhanVat({ tuVi: v });
        notify(`\u2728 \u0110\xE3 g\xE1n Tu Vi = ${v.toLocaleString()}!`);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnTnt = document.getElementById("vktt-btn-tnt");
    if (btnTnt) {
      btnTnt.onclick = () => {
        const v = readInputOrPlaceholder("vktt-inp-tnt", 5e3);
        updateNhanVat({ thoNguyenThem: v });
        notify(`\u23F3 \u0110\xE3 g\xE1n Th\u1ECD Nguy\xEAn Th\xEAm = +${v} n\u0103m!`);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnTuoi = document.getElementById("vktt-btn-tuoi");
    if (btnTuoi) {
      btnTuoi.onclick = () => {
        const v = readInputOrPlaceholder("vktt-inp-tuoi", 18);
        updateNhanVat({ tuoi: v });
        notify(`\u23F3 \u0110\xE3 g\xE1n Tu\u1ED5i = ${v}!`);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnCh = document.getElementById("vktt-btn-ch");
    if (btnCh) {
      btnCh.onclick = () => {
        const v = readInputOrPlaceholder("vktt-inp-ch", 99999);
        updateNhanVat({ congHien: v });
        notify(`\u{1F4DC} \u0110\xE3 g\xE1n C\u1ED1ng Hi\u1EBFn = ${v.toLocaleString()}!`);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnCt = document.getElementById("vktt-btn-ct");
    if (btnCt) {
      btnCt.onclick = () => {
        const v = readInputOrPlaceholder("vktt-inp-ct", 99999);
        updateTongMon(v);
        notify(`\u{1F3DB}\uFE0F \u0110\xE3 g\xE1n ${v.toLocaleString()} \u0111i\u1EC3m C\xF4ng T\xEDch! H\xE3y C\xE1o lui r\u1ED3i m\u1EDF l\u1EA1i Ch\u1EA5p s\u1EF1 \u0111\u01B0\u1EDDng.`);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnCapbac = document.getElementById("vktt-btn-capbac");
    if (btnCapbac) {
      btnCapbac.onclick = () => {
        const sel = document.getElementById("vktt-sel-capbac");
        const cb = parseInt(sel?.value || "4", 10);
        const curCt = readInputOrPlaceholder("vktt-inp-ct", 5e3);
        updateTongMon(curCt, cb);
        notify(`\u{1F3DB}\uFE0F \u0110\xE3 g\xE1n Ch\u1EE9c V\u1ECB T\xF4ng M\xF4n = C\u1EA5p ${cb}!`);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnCg = document.getElementById("vktt-btn-cg");
    if (btnCg) {
      btnCg.onclick = () => {
        const cg = parseInt(document.getElementById("vktt-sel-cg")?.value || "5", 10);
        const tcg = parseInt(document.getElementById("vktt-sel-tcg")?.value || "3", 10);
        setRealm(cg, tcg);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnExtraRealm = document.getElementById("vktt-btn-extra-realm");
    if (btnExtraRealm) {
      btnExtraRealm.onclick = () => {
        const kd = parseInt(document.getElementById("vktt-sel-kimdan")?.value || "1", 10);
        const yc = document.getElementById("vktt-sel-ycanh")?.value || "Ki\u1EBFm \xFD";
        const dt = document.getElementById("vktt-sel-dituong")?.value || "kim";
        const tt = parseFloat(document.getElementById("vktt-inp-tuctue")?.value || "1.0");
        setExtraRealm(kd, yc, dt, tt);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnClearBinhCanh = document.getElementById("vktt-btn-clear-binh-canh");
    if (btnClearBinhCanh) {
      btnClearBinhCanh.onclick = () => {
        updateNhanVat({ binhCanh: 0, thuongThe: 0 });
        notify("\u{1F48A} \u0110\xE3 x\xF3a s\u1EA1ch B\xECnh C\u1EA3nh & Th\u01B0\u01A1ng Th\u1EBF!");
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnTc = document.getElementById("vktt-btn-tc");
    if (btnTc) {
      btnTc.onclick = () => {
        const tcKey = document.getElementById("vktt-sel-tc")?.value || "the_chat.hoang_co";
        setPhysique(tcKey);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnGanLc = document.getElementById("vktt-btn-gan-lc");
    if (btnGanLc) {
      btnGanLc.onclick = () => {
        const chks = document.querySelectorAll('input[name="vktt-lc-he"]:checked');
        const sel = [];
        chks.forEach((c) => sel.push(c.value));
        setLinhCan(sel);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnGoLc = document.getElementById("vktt-btn-go-lc");
    if (btnGoLc) {
      btnGoLc.onclick = () => {
        resetLinhCan();
        renderTabContent("tab-nhan-vat");
      };
    }
    const LC_PRESETS = {
      bat_hoang: { name: "B\xE1t Hoang Ti\xEAn C\u0103n (8 H\u1EC7)", elements: ["kim", "moc", "thuy", "hoa", "tho", "bang", "phong", "loi"] },
      ngu_hanh: { name: "Ng\u0169 H\xE0nh Linh C\u0103n", elements: ["kim", "moc", "thuy", "hoa", "tho"] },
      loi: { name: "Thi\xEAn L\xF4i Linh C\u0103n", elements: ["loi"] },
      bang: { name: "Thi\xEAn B\u0103ng Linh C\u0103n", elements: ["bang"] },
      phong: { name: "Thi\xEAn Phong Linh C\u0103n", elements: ["phong"] },
      tam_di: { name: "Tam D\u1ECB Linh C\u0103n", elements: ["loi", "bang", "phong"] },
      kim: { name: "Thi\xEAn Kim Linh C\u0103n", elements: ["kim"] },
      moc: { name: "Thi\xEAn M\u1ED9c Linh C\u0103n", elements: ["moc"] },
      thuy: { name: "Thi\xEAn Th\u1EE7y Linh C\u0103n", elements: ["thuy"] },
      hoa: { name: "Thi\xEAn H\u1ECFa Linh C\u0103n", elements: ["hoa"] },
      tho: { name: "Thi\xEAn Th\u1ED5 Linh C\u0103n", elements: ["tho"] },
      kim_thuy: { name: "Kim Th\u1EE7y Song Linh", elements: ["kim", "thuy"] },
      thuy_moc: { name: "Th\u1EE7y M\u1ED9c Song Linh", elements: ["thuy", "moc"] },
      moc_hoa: { name: "M\u1ED9c H\u1ECFa Song Linh", elements: ["moc", "hoa"] },
      hoa_tho: { name: "H\u1ECFa Th\u1ED5 Song Linh", elements: ["hoa", "tho"] },
      tho_kim: { name: "Th\u1ED5 Kim Song Linh", elements: ["tho", "kim"] }
    };
    const btnApplyLcPreset = document.getElementById("vktt-btn-apply-lc-preset");
    if (btnApplyLcPreset) {
      btnApplyLcPreset.onclick = () => {
        const sel = document.getElementById("vktt-sel-lc-preset")?.value;
        if (!sel || !LC_PRESETS[sel]) {
          return notify("\u26A0\uFE0F Vui l\xF2ng ch\u1ECDn m\u1ED9t m\u1EABu linh c\u0103n t\u1EEB danh s\xE1ch!");
        }
        const preset = LC_PRESETS[sel];
        setLinhCan(preset.elements);
        notify(`\u{1F331} \u0110\xE3 g\xE1n th\xE0nh c\xF4ng: ${preset.name}!`);
        renderTabContent("tab-nhan-vat");
      };
    }
    const statBtns = document.querySelectorAll(".vktt-btn-set-stat");
    statBtns.forEach((btn) => {
      btn.onclick = () => {
        const statKey = btn.getAttribute("data-stat");
        if (!statKey) return;
        const domKey = statKey.replace("_", "-");
        const v = readInputOrPlaceholder(`vktt-inp-${domKey}`, statKey === "tam_ma" ? 0 : 500);
        updateChiSo(statKey, v);
        notify(`\u{1F4CA} \u0110\xE3 g\xE1n ${statKey} = ${v}!`);
        renderTabContent("tab-nhan-vat");
      };
    });
    const btnToggleAllStat = document.getElementById("vktt-btn-toggle-all-stat");
    if (btnToggleAllStat) {
      let allCheckedState = false;
      btnToggleAllStat.onclick = () => {
        const chks = document.querySelectorAll(".vktt-stat-chk");
        allCheckedState = !allCheckedState;
        chks.forEach((c) => c.checked = allCheckedState);
        btnToggleAllStat.innerText = allCheckedState ? "B\u1ECF T\xEDch H\u1EBFt" : "T\xEDch T\u1EA5t C\u1EA3";
      };
    }
    function applyCheckedStats(val) {
      const chks = document.querySelectorAll(".vktt-stat-chk:checked");
      if (!chks.length) {
        return notify("\u26A0\uFE0F H\xE3y t\xEDch ch\u1ECDn \xEDt nh\u1EA5t 1 thu\u1ED9c t\xEDnh \u0111\u1EC3 g\xE1n!");
      }
      const patch = {};
      chks.forEach((c) => {
        const stat = c.getAttribute("data-stat");
        if (stat) patch[stat] = stat === "tam_ma" ? 0 : val;
      });
      updateBatchChiSo(patch);
      notify(`\u26A1 \u0110\xE3 g\xE1n ${Object.keys(patch).length} ch\u1EC9 s\u1ED1 \u0111\xE3 t\xEDch = ${val}!`);
      renderTabContent("tab-nhan-vat");
    }
    const btnStat200 = document.getElementById("vktt-btn-stat-200");
    if (btnStat200) btnStat200.onclick = () => applyCheckedStats(200);
    const btnStat600 = document.getElementById("vktt-btn-stat-600");
    if (btnStat600) btnStat600.onclick = () => applyCheckedStats(600);
    const btnClearTamMa = document.getElementById("vktt-btn-clear-tam-ma");
    if (btnClearTamMa) {
      btnClearTamMa.onclick = () => {
        updateChiSo("tam_ma", 0);
        notify("\u{1F9F9} \u0110\xE3 x\xF3a s\u1EA1ch T\xE2m Ma = 0!");
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnDlh = document.getElementById("vktt-btn-dlh");
    if (btnDlh) {
      btnDlh.onclick = () => {
        const v = readInputOrPlaceholder("vktt-inp-dlh", 999999);
        updateMetaLuanHoi(v);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnKiep = document.getElementById("vktt-btn-kiep");
    if (btnKiep) {
      btnKiep.onclick = () => {
        const state = getGameState();
        const curDiem = state?.meta?.diemLuanHoi || 999999;
        const v = readInputOrPlaceholder("vktt-inp-kiep", 38);
        updateMetaLuanHoi(curDiem, v);
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnAchieve = document.getElementById("vktt-btn-all-achieve");
    if (btnAchieve) {
      btnAchieve.onclick = () => {
        unlockAllAchievementsAndFerrymen();
        renderTabContent("tab-nhan-vat");
      };
    }
    const btnAllInOne = document.getElementById("vktt-btn-all-in-one");
    if (btnAllInOne) {
      btnAllInOne.onclick = () => {
        updateNhanVat({
          linhThach: 999999999,
          tuVi: 999999999,
          thoNguyenThem: 9999,
          congHien: 999999,
          binhCanh: 0,
          thuongThe: 0,
          chiSo: {
            ngo_tinh: 600,
            can_cot: 600,
            dao_tam: 600,
            than_phap: 600,
            khi_van: 600,
            than_thuc: 600,
            tam_ma: 0
          }
        });
        unlockAllMeridians();
        unlockAllProfessions();
        unlockAllRecipes();
        unlockAllSkills();
        unlockAllAchievementsAndFerrymen();
        notify("\u{1F680} SI\xCAU BUFF TO\xC0N DI\u1EC6N TH\xC0NH C\xD4NG! \u0110\u1EA7y \u0111\u1EE7 linh th\u1EA1ch, tu vi, ch\u1EC9 s\u1ED1 600, ngh\u1EC1, \u0111an ph\u01B0\u01A1ng, kinh m\u1EA1ch & th\xE0nh t\u1EF1u!");
        renderTabContent("tab-nhan-vat");
      };
    }
  }
  function getTabNguLinhHtml() {
    const state = getGameState();
    const nv = state?.run?.nhanVat || {};
    const familiars = nv.familiars || [];
    const petSlot = nv.petSlot;
    const KIND_NAMES = {
      linh_thu: "Linh Th\xFA",
      thu: "Ng\u1EF1 Th\xFA",
      trung: "C\u1ED5 Tr\xF9ng",
      khoi_loi: "Kh\xF4i L\u1ED7i",
      thi: "Thi Kh\xF4i",
      hon: "Qu\u1EF7 H\u1ED3n"
    };
    const REALM_NAMES = {
      0: "Nh\u1EA5t Giai",
      1: "Nh\u1ECB Giai",
      2: "Tam Giai",
      3: "T\u1EE9 Giai",
      4: "Ng\u0169 Giai",
      5: "L\u1EE5c Giai"
    };
    const STAGE_NAMES = {
      0: "S\u01A1 k\u1EF3",
      1: "Trung k\u1EF3",
      2: "H\u1EADu k\u1EF3",
      3: "\u0110\u1EA1i vi\xEAn m\xE3n"
    };
    const APTITUDE_NAMES = {
      1: "Ph\xE0m Huy\u1EBFt / H\u1EA1",
      2: "Linh Huy\u1EBFt / Trung",
      3: "D\u1ECB Huy\u1EBFt / Th\u01B0\u1EE3ng",
      4: "Ch\xE2n Huy\u1EBFt / C\u1EF1c",
      5: "Th\u1EA7n Huy\u1EBFt / Ho\xE0n M\u1EF9"
    };
    const INJURY_DESC = ["L\xE0nh l\u1EB7n 100%", "Th\u01B0\u01A1ng nh\u1EB9", "Th\u01B0\u01A1ng n\u1EB7ng", "Tr\u1ECDng th\u01B0\u01A1ng", "H\u1EA5p h\u1ED1i"];
    return `
    <!-- KH\u1ED0I T\u1ED4NG QUAN NG\u1EF0 LINH -->
    <div class="vktt-stat-overview">
      <div>\u{1F43E} S\u1ED1 l\u01B0\u1EE3ng linh s\u1EE7ng: <b>${familiars.length}</b></div>
      <div>\u2694\uFE0F Tr\u1EA1ng th\xE1i: <b style="color:#5ce3af;">${familiars.some((f) => f.state === "field") ? "\u0110ang Xu\u1EA5t Tr\u1EADn" : "Trong T\xFAi"}</b></div>
      <div style="grid-column: span 2;">\u{1F31F} Linh th\xFA b\u1EA3n m\u1EC7nh: <b style="color:var(--vktt-vang-kim-nhat);">${familiars.find((f) => f.id === petSlot)?.name || "Ch\u01B0a g\xE1n"}</b></div>
    </div>

    <!-- C\xC1C THAO T\xC1C 1-CLICK -->
    <div class="vktt-card vktt-card-ngulinh">
      <div class="vktt-card-hdr">\u26A1 Thao T\xE1c Th\u1EA7n T\u1ED1c To\xE0n B\u1ED9 Ng\u1EF1 Linh</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
        <button id="vktt-btn-heal-familiars" class="vktt-btn vktt-btn-jade">\u{1F496} Ch\u1EEFa L\xE0nh 100%</button>
        <button id="vktt-btn-bond-familiars" class="vktt-btn vktt-btn-gold">\u{1F31F} Max Th\xE2n M\u1EADt (100)</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <button id="vktt-btn-upgrade-familiars" class="vktt-btn vktt-btn-block">\u26A1 L\xEAn Th\u1EA7n Huy\u1EBFt (Ph\u1EA9m 5)</button>
        <button id="vktt-btn-feed-familiars" class="vktt-btn vktt-btn-phu">\u{1F371} T\xFAi Th\u1EE9c \u0102n (x99)</button>
      </div>
    </div>

    <!-- KH\u1ED0I KH\u1EBE \u01AF\u1EDAC NHANH LINH TH\xDA / MA THI / QU\u1EF6 H\u1ED2N -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u2728 Kh\u1EBF \u01AF\u1EDBc Nhanh Th\u1EA7n Th\xFA / Kh\xF4i L\u1ED7i / Ma Thi / Qu\u1EF7 H\u1ED3n</div>
      <div class="vktt-row">
        <select id="vktt-sel-quick-familiar" class="vktt-select" style="flex:1;">
          ${FAMILIAR_PRESETS.map((p, idx) => `
            <option value="${idx}">${p.icon} ${p.name} [${KIND_NAMES[p.kind] || p.kind} - ${p.element.toUpperCase()}]</option>
          `).join("")}
        </select>
        <button id="vktt-btn-add-quick-fam" class="vktt-btn vktt-btn-jade vktt-btn-sm">+ Kh\u1EBF \u01AF\u1EDBc</button>
      </div>
      <div id="vktt-fam-preset-desc" style="font-size:11px;color:var(--vktt-chu-nhat);margin-top:4px;">
        ${FAMILIAR_PRESETS[0]?.desc || ""}
      </div>
    </div>

    <!-- DANH S\xC1CH LINH TH\xDA HI\u1EC6N T\u1EA0I -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">
        <span>\u{1F4CB} Danh S\xE1ch Ng\u1EF1 Linh \u0110ang Nu\xF4i (${familiars.length})</span>
      </div>
      <div id="vktt-familiar-list">
        ${familiars.length === 0 ? `
          <div style="font-size:12px;color:var(--vktt-chu-nhat);text-align:center;padding:16px;">
            \u0110\u1EA1o h\u1EEFu ch\u01B0a c\xF3 linh th\xFA hay kh\xF4i l\u1ED7i n\xE0o. H\xE3y ch\u1ECDn m\u1EE5c "Kh\u1EBF \u01AF\u1EDBc Nhanh" ph\xEDa tr\xEAn \u0111\u1EC3 tri\u1EC7u h\u1ED3i!
          </div>
        ` : familiars.map((f) => {
      const kindName = KIND_NAMES[f.kind] || f.kind;
      const realmName = REALM_NAMES[f.realm] || `${f.realm} Giai`;
      const stageName = STAGE_NAMES[f.stage] || "";
      const aptName = APTITUDE_NAMES[f.aptitude] || `Ph\u1EA9m ${f.aptitude}`;
      const injuryLvl = f.injury?.level || 0;
      const isMain = petSlot === f.id;
      return `
            <div class="vktt-familiar-card">
              <div class="vktt-familiar-hdr">
                <span class="vktt-familiar-title">
                  ${isMain ? "\u{1F451} " : "\u{1F43E} "}${f.name || f.template}
                  <span class="vktt-badge" style="margin-left:4px;">${kindName}</span>
                </span>
                <span style="font-size:10.5px;color:${injuryLvl > 0 ? "#ff8585" : "#5ce3af"};">
                  ${INJURY_DESC[injuryLvl] || "L\xE0nh l\u1EB7n"}
                </span>
              </div>
              <div class="vktt-familiar-meta">
                <span>C\u1EA3nh Gi\u1EDBi: <b>${realmName} ${stageName}</b></span>
                <span>Huy\u1EBFt M\u1EA1ch: <b style="color:var(--vktt-vang-kim);">${aptName}</b></span>
                <span>H\u1EC7: <b>${(f.element || "v\xF4 s\u1EAFc").toUpperCase()}</b></span>
                ${f.bond !== void 0 ? `<span>Th\xE2n M\u1EADt: <b>${f.bond}/100</b></span>` : ""}
                ${f.temper ? `<span>T\xEDnh c\xE1ch: <b>${f.temper}</b></span>` : ""}
              </div>
              <div class="vktt-familiar-actions">
                <button class="vktt-btn vktt-btn-sm vktt-btn-phu vktt-act-fam-heal" data-id="${f.id}">\u{1F496} Tr\u1ECB Th\u01B0\u01A1ng</button>
                <button class="vktt-btn vktt-btn-sm vktt-btn-phu vktt-act-fam-max" data-id="${f.id}">\u{1F31F} Th\u1EA7n Huy\u1EBFt</button>
                ${!isMain && (f.kind === "linh_thu" || f.kind === "thu") ? `
                  <button class="vktt-btn vktt-btn-sm vktt-btn-gold vktt-act-fam-setmain" data-id="${f.id}">\u{1F451} \u0110\u1EB7t Ch\u1EE7 L\u1EF1c</button>
                ` : ""}
                <button class="vktt-btn vktt-btn-sm vktt-btn-ghost vktt-act-fam-del" data-id="${f.id}" style="color:#ff8585;margin-left:auto;">Th\u1EA3 V\u1EC1 R\u1EEBng</button>
              </div>
            </div>
          `;
    }).join("")}
      </div>
    </div>
  `;
  }
  function bindTabNguLinhEvents() {
    const selPreset = document.getElementById("vktt-sel-quick-familiar");
    const descEl = document.getElementById("vktt-fam-preset-desc");
    if (selPreset && descEl) {
      selPreset.onchange = () => {
        const idx = parseInt(selPreset.value, 10);
        if (FAMILIAR_PRESETS[idx]) {
          descEl.innerText = FAMILIAR_PRESETS[idx].desc;
        }
      };
    }
    const btnAddQuick = document.getElementById("vktt-btn-add-quick-fam");
    if (btnAddQuick && selPreset) {
      btnAddQuick.onclick = () => {
        const idx = parseInt(selPreset.value, 10);
        const p = FAMILIAR_PRESETS[idx];
        if (p) {
          addQuickFamiliar({
            name: p.name,
            kind: p.kind,
            template: p.template,
            element: p.element,
            realm: p.realm,
            stage: p.stage,
            aptitude: p.aptitude,
            temper: p.temper
          });
          renderTabContent("tab-ngu-linh");
        }
      };
    }
    const btnHealAll = document.getElementById("vktt-btn-heal-familiars");
    if (btnHealAll) {
      btnHealAll.onclick = () => {
        healAllFamiliars();
        renderTabContent("tab-ngu-linh");
      };
    }
    const btnBondAll = document.getElementById("vktt-btn-bond-familiars");
    if (btnBondAll) {
      btnBondAll.onclick = () => {
        maxBondAllFamiliars();
        renderTabContent("tab-ngu-linh");
      };
    }
    const btnUpgradeAll = document.getElementById("vktt-btn-upgrade-familiars");
    if (btnUpgradeAll) {
      btnUpgradeAll.onclick = () => {
        upgradeAllFamiliars();
        renderTabContent("tab-ngu-linh");
      };
    }
    const btnFeed = document.getElementById("vktt-btn-feed-familiars");
    if (btnFeed) {
      btnFeed.onclick = () => {
        addFamiliarFoodPack();
      };
    }
    document.querySelectorAll(".vktt-act-fam-heal").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (!id) return;
        const state = getGameState();
        const nv = state?.run?.nhanVat;
        if (!nv) return;
        const fam = (nv.familiars || []).find((f) => f.id === id);
        if (fam) {
          delete fam.injury;
          if (fam.state === "down") fam.state = "field";
          updateNhanVat({ familiars: nv.familiars });
          notify(`\u{1F496} \u0110\xE3 ch\u1EEFa l\xE0nh cho ${fam.name || id}!`);
          renderTabContent("tab-ngu-linh");
        }
      };
    });
    document.querySelectorAll(".vktt-act-fam-max").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (!id) return;
        const state = getGameState();
        const nv = state?.run?.nhanVat;
        if (!nv) return;
        const fam = (nv.familiars || []).find((f) => f.id === id);
        if (fam) {
          fam.aptitude = 5;
          fam.stage = 3;
          fam.exp = 999999;
          fam.bond = 100;
          delete fam.injury;
          updateNhanVat({ familiars: nv.familiars });
          notify(`\u{1F31F} ${fam.name || id} \u0111\xE3 th\u1EE9c t\u1EC9nh Th\u1EA7n Huy\u1EBFt ph\u1EA9m 5 & \u0110\u1EA1i vi\xEAn m\xE3n!`);
          renderTabContent("tab-ngu-linh");
        }
      };
    });
    document.querySelectorAll(".vktt-act-fam-setmain").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (!id) return;
        updateNhanVat({ petSlot: id });
        notify("\u{1F451} \u0110\xE3 \u0111\u1EB7t l\xE0m linh th\xFA b\u1EA3n m\u1EC7nh!");
        renderTabContent("tab-ngu-linh");
      };
    });
    document.querySelectorAll(".vktt-act-fam-del").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (!id) return;
        removeFamiliar(id);
        renderTabContent("tab-ngu-linh");
      };
    });
  }
  var catalogCatFilter = "all";
  var catalogQualityFilter = 0;
  var catalogSearchQuery = "";
  var catalogOffset = 0;
  var CATALOG_LIMIT = 30;
  function renderCatalogCards(append = false) {
    const listEl = document.getElementById("vktt-catalog-list");
    const moreBtn = document.getElementById("vktt-btn-catalog-more");
    const badgeEl = document.getElementById("vktt-catalog-total-badge");
    if (!listEl) return;
    const { items, total } = filterItems(
      catalogCatFilter,
      catalogQualityFilter,
      catalogSearchQuery,
      catalogOffset,
      CATALOG_LIMIT
    );
    if (badgeEl) {
      badgeEl.innerText = `(${total.toLocaleString()} m\xF3n)`;
    }
    if (!append) {
      listEl.innerHTML = "";
    }
    if (items.length === 0 && !append) {
      listEl.innerHTML = '<div style="padding:14px;text-align:center;color:#64748b;font-size:12px;">Kh\xF4ng t\xECm th\u1EA5y v\u1EADt ph\u1EA9m n\xE0o ph\xF9 h\u1EE3p.</div>';
      if (moreBtn) moreBtn.style.display = "none";
      return;
    }
    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const color = QUALITY_COLORS[item.quality] || "#94a3b8";
      const catName = CATEGORY_NAMES[item.cat] || item.cat;
      const elStr = item.he && item.he.length ? `[${item.he.join("/")}]` : "";
      const card = document.createElement("div");
      card.className = "vktt-catalog-item";
      card.innerHTML = `
      <div class="vktt-item-main">
        <div class="vktt-item-name" style="color:${color};">
          <span class="vktt-quality-tag" style="background:${color};color:#000;">P.${item.quality}</span>
          <span>${item.name}</span>
        </div>
        <div class="vktt-item-meta">
          <span>${catName}</span>
          ${elStr ? `<span style="color:#38bdf8;">${elStr}</span>` : ""}
          ${item.desc ? `<span style="color:#64748b;max-width:140px;overflow:hidden;text-overflow:ellipsis;" title="${item.desc}">${item.desc}</span>` : ""}
        </div>
      </div>
      <div class="vktt-item-actions">
        <button class="vktt-btn vktt-btn-sm vktt-btn-ghost vktt-btn-fast-add" data-id="${item.id}" data-count="1">+1</button>
        <button class="vktt-btn vktt-btn-sm vktt-btn-cyan vktt-btn-fast-add" data-id="${item.id}" data-count="10">+10</button>
        <button class="vktt-btn vktt-btn-sm vktt-btn-purple vktt-btn-fast-add" data-id="${item.id}" data-count="99">+99</button>
      </div>
    `;
      card.querySelectorAll(".vktt-btn-fast-add").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id") || "";
          const count = parseInt(btn.getAttribute("data-count") || "1", 10);
          addItem(id, count);
        };
      });
      fragment.appendChild(card);
    });
    listEl.appendChild(fragment);
    if (moreBtn) {
      const remaining = total - (catalogOffset + items.length);
      if (remaining > 0) {
        moreBtn.style.display = "block";
        moreBtn.innerText = `Xem th\xEAm (${remaining.toLocaleString()} m\xF3n c\xF2n l\u1EA1i)...`;
      } else {
        moreBtn.style.display = "none";
      }
    }
  }
  function getTabKhoDoHtml() {
    return `
    <!-- KH\u1ED0I 1: B\u1ED0 TR\xCD KINH M\u1EA0CH & TRANG B\u1ECA T\u1ED0I \u01AFU -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u26A1 T\u1EF1 \u0110\u1ED9ng B\u1ED1 Tr\xED Kinh M\u1EA1ch & Trang B\u1ECB</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Thu\u1EADt to\xE1n k\u1EBFt n\u1ED1i m\u1EA1ch t\u1EEB \u0110an \u0110i\u1EC1n: 100% th\xF4ng m\u1EA1ch (\u0111\u01B0\u1EDDng d\u1EABn kh\xED m\xE0u tr\u1EAFng, KH\xD4NG b\u1ECB hatch ch\xE9o), t\u1EF1 \u0111\u1ED9ng gh\xE9p c\u1EB7p t\u01B0\u01A1ng sinh (vi\u1EC1n xanh l\xE1 buff c\u1EF1c \u0111\u1EA1i), tri\u1EC7t ti\xEAu 100% t\u01B0\u01A1ng kh\u1EAFc (KH\xD4NG c\xF3 vi\u1EC1n \u0111\u1ECF) v\xE0 t\u1EF1 \u0111\u1ED9ng trang b\u1ECB 6 m\xF3n \u0111\u1ED3 t\u1ED1t nh\u1EA5t.
      </p>
      <button id="vktt-btn-auto-opt-bag" class="vktt-btn vktt-btn-green vktt-btn-block" style="margin-bottom:8px;">
        \u26A1 B\u1ED0 TR\xCD M\u1EA2NH T\u1EEA T\xDAI L\xCAN NG\u01AF\u1EDCI T\u1ED0I \u01AFU NH\u1EA4T
      </button>

      <div style="padding-top:6px;border-top:1px dashed rgba(229,184,105,0.25);">
        <label class="vktt-label">\u{1F3AF} Ho\u1EB7c T\u1EF1 \u0110\u1ED9ng G\xE1n & B\u1ED1 Tr\xED Theo H\u1EC7 T\xF9y Ch\u1ECDn:</label>
        <div class="vktt-row">
          <select id="vktt-sel-opt-build" class="vktt-select" style="flex:1;">
            <option value="toan_nang">\u{1F31F} To\xE0n N\u0103ng Th\u1EA7n C\u1EA5p (Top 10 Ph\u1EA9m 8 To\xE0n Game)</option>
            <option value="kim">\u2694\uFE0F Ki\u1EBFm T\xF4ng / Kim Tu (Full Kim/L\xF4i Ph\u1EA9m 7-8)</option>
            <option value="hoa">\u{1F525} H\u1ECFa Tu / Vi\xEAm \u0110\u1EBF (Full H\u1ECFa Ph\u1EA9m 7-8)</option>
            <option value="thuy">\u2744\uFE0F Th\u1EE7y / B\u0103ng Tu (Full Th\u1EE7y/B\u0103ng Ph\u1EA9m 7-8)</option>
            <option value="moc">\u{1F33F} M\u1ED9c Tu / Tr\u01B0\u1EDDng Sinh (Full M\u1ED9c/Phong Ph\u1EA9m 7-8)</option>
            <option value="tho">\u26F0\uFE0F Th\u1ED5 Tu / B\u1EA5t Di\u1EC7t (Full Th\u1ED5 Ph\u1EA9m 7-8)</option>
            <option value="loi_phong">\u26A1 L\xF4i / Phong Tu (Full Bi\u1EBFn D\u1ECB Ph\u1EA9m 7)</option>
            <option value="ma_dao">\u{1FA78} Huy\u1EBFt Ma / Ma Tu (Ma \u0110\u1EA1o T\u1ED1i Th\u01B0\u1EE3ng)</option>
            <option value="ngu_linh">\u{1F43E} Ng\u1EF1 Linh / V\u1EA1n Th\xFA (Th\u1EA7n Th\xFA Tri\u1EC1u Ph\u1EE5ng)</option>
            <option value="luyen_thi">\u{1F9DF} Thi Kh\xF4i / Qu\u1EF7 \u0110\u1EA1o (Luy\u1EC7n Thi & C\xE2u H\u1ED3n)</option>
          </select>
          <button id="vktt-btn-apply-opt-build" class="vktt-btn vktt-btn-cyan vktt-btn-sm">G\xE1n Build</button>
        </div>
      </div>
    </div>

    <!-- KH\u1ED0I 2: G\xD3I C\u1EF0C PH\u1EA8M TO\xC0N N\u0102NG & TH\xCAM NHANH -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F381} G\xF3i C\u1EF1c Ph\u1EA9m & Nh\u1EADn Nhanh</div>
      <button id="vktt-btn-godpack" class="vktt-btn vktt-btn-block" style="background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
        \u{1F451} K\xCDCH HO\u1EA0T G\xD3I TH\u1EA6N \u0110\u1EA0O (Ph\u1EA9m 8-9 + 99 Th\u1EA7n \u0110an)
      </button>
      <div style="display:flex;gap:6px;margin-top:6px;">
        <button id="vktt-btn-all-items" class="vktt-btn vktt-btn-cyan" style="flex:1;">\u{1F31F} Nh\u1EADn 422+ V\u1EADt Ph\u1EA9m</button>
        <button id="vktt-btn-bag-99" class="vktt-btn vktt-btn-ghost" style="flex:1;">\u{1F522} M\u1ECDi \u0110\u1ED3 x99</button>
      </div>
    </div>

    <!-- KH\u1ED0I 3: DANH M\u1EE4C TO\xC0N B\u1ED8 V\u1EACT PH\u1EA8M GAME H\u1ED6 TR\u1EE2 -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">
        <span>\u{1F4CB} Danh M\u1EE5c To\xE0n B\u1ED9 V\u1EADt Ph\u1EA9m Game</span>
        <span id="vktt-catalog-total-badge" style="font-size:10.5px;color:#e5b869;">(\u0110ang t\u1EA3i...)</span>
      </div>
      <div class="vktt-filter-bar">
        <select id="vktt-cat-filter" class="vktt-select" style="flex:1;">
          <option value="all">T\u1EA5t C\u1EA3 Lo\u1EA1i</option>
          <option value="cong_phap">C\xF4ng Ph\xE1p</option>
          <option value="dan_duoc">\u0110an D\u01B0\u1EE3c</option>
          <option value="phap_khi">Ph\xE1p Kh\xED</option>
          <option value="linh_duoc">Linh D\u01B0\u1EE3c</option>
          <option value="yeu_tai">Y\xEAu T\xE0i</option>
          <option value="nguyen_lieu">Nguy\xEAn Li\u1EC7u / Qu\u1EB7ng</option>
          <option value="phu_luc">Ph\xF9 L\u1EE5c</option>
          <option value="di_hoa">D\u1ECB H\u1ECFa</option>
          <option value="dung_cu">D\u1EE5ng C\u1EE5 Luy\u1EC7n Ch\u1EBF</option>
          <option value="phuong_tien">Ph\u01B0\u01A1ng Ti\u1EC7n</option>
          <option value="tru_vat">Tr\u1EEF V\u1EADt</option>
          <option value="don_phuong">\u0110\u01A1n Ph\u01B0\u01A1ng / \u0110\u1ED3 Ph\u1ED5</option>
          <option value="di_bao">D\u1ECB B\u1EA3o</option>
          <option value="lenh_bai">L\u1EC7nh B\xE0i</option>
          <option value="dac_san">\u0110\u1EB7c S\u1EA3n</option>
        </select>
        <select id="vktt-quality-filter" class="vktt-select" style="width:110px;flex:none;">
          <option value="0">T\u1EA5t C\u1EA3 Ph\u1EA9m</option>
          <option value="8">\u{1F31F} Ph\u1EA9m 8</option>
          <option value="7">\u{1F451} Ph\u1EA9m 7</option>
          <option value="6">\u2728 Ph\u1EA9m 6</option>
          <option value="5">\u{1F48E} Ph\u1EA9m 5</option>
          <option value="4">\u{1F33F} Ph\u1EA9m 4</option>
          <option value="3">\u{1F539} Ph\u1EA9m 3</option>
          <option value="2">\u{1F538} Ph\u1EA9m 2</option>
          <option value="1">\u26AA Ph\u1EA9m 1</option>
        </select>
      </div>
      <div style="margin-bottom:6px;">
        <input type="text" id="vktt-catalog-search" class="vktt-inp" placeholder="\u{1F50D} T\xECm theo t\xEAn ho\u1EB7c ID (g\xF5 kh\xF4ng d\u1EA5u)..." style="width:100%;" />
      </div>
      <div id="vktt-catalog-list" class="vktt-catalog-list">
        <!-- Rendered items with +1, +10, +99 -->
      </div>
      <button id="vktt-btn-catalog-more" class="vktt-btn vktt-btn-ghost vktt-btn-block" style="margin-top:6px;display:none;">
        Xem th\xEAm v\u1EADt ph\u1EA9m...
      </button>
    </div>

    <!-- KH\u1ED0I 4: TH\xCAM NHANH THEO ID T\u1EF0 DO -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F50D} Nh\u1EADp ID T\u1EF1 Do</div>
      <div class="vktt-row">
        <input type="text" id="vktt-custom-item-id" class="vktt-inp" placeholder="item.xxxx..." style="flex:1;" />
        <input type="number" id="vktt-custom-item-count" class="vktt-inp" value="10" style="width:65px;flex:none;" />
        <button id="vktt-btn-add-custom-item" class="vktt-btn vktt-btn-sm vktt-btn-cyan">Th\xEAm</button>
      </div>
    </div>
  `;
  }
  function bindTabKhoDoEvents() {
    const btnAutoOpt = document.getElementById("vktt-btn-auto-opt-bag");
    if (btnAutoOpt) {
      btnAutoOpt.onclick = () => {
        autoOptimizeFromBag();
      };
    }
    const btnApplyBuild = document.getElementById("vktt-btn-apply-opt-build");
    if (btnApplyBuild) {
      btnApplyBuild.onclick = () => {
        const buildKey = document.getElementById("vktt-sel-opt-build")?.value || "toan_nang";
        applyElementalBuild(buildKey);
      };
    }
    const btnGodPack = document.getElementById("vktt-btn-godpack");
    if (btnGodPack) btnGodPack.onclick = applyGodPack;
    const btnAllItems = document.getElementById("vktt-btn-all-items");
    if (btnAllItems) {
      btnAllItems.onclick = () => {
        const state = getGameState();
        if (!state?.run?.nhanVat) return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
        const nhanVat = copyObj(state.run.nhanVat);
        const tuiDo = copyObj(nhanVat.tuiDo || {});
        for (const id in PRESET_ITEMS) {
          const info = PRESET_ITEMS[id];
          const q = info.cat === "\u0110an D\u01B0\u1EE3c" || info.cat === "Linh D\u01B0\u1EE3c" || info.cat === "Ph\xF9 L\u1EE5c" || info.cat === "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an" ? 50 : 1;
          tuiDo[id] = Math.max(tuiDo[id] || 0, q);
        }
        nhanVat.tuiDo = tuiDo;
        nhanVat.oTuiThem = Math.max(nhanVat.oTuiThem || 0, 350);
        updateNhanVat(nhanVat);
        notify("\u{1F31F} \u0110\xE3 th\xEAm tr\u1ECDn b\u1ED9 422+ v\u1EADt ph\u1EA9m v\xE0o t\xFAi \u0111\u1ED3 (+350 \xF4 t\xFAi)!");
      };
    }
    const btnBag99 = document.getElementById("vktt-btn-bag-99");
    if (btnBag99) {
      btnBag99.onclick = () => {
        const state = getGameState();
        if (!state?.run?.nhanVat) return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
        const nhanVat = copyObj(state.run.nhanVat);
        const tuiDo = copyObj(nhanVat.tuiDo || {});
        for (const k in tuiDo) {
          tuiDo[k] = 99;
        }
        nhanVat.tuiDo = tuiDo;
        updateNhanVat(nhanVat);
        notify("\u{1F522} \u0110\xE3 \u0111\u1EB7t s\u1ED1 l\u01B0\u1EE3ng m\u1ECDi v\u1EADt ph\u1EA9m trong t\xFAi = 99!");
      };
    }
    catalogOffset = 0;
    renderCatalogCards(false);
    const catFilterSel = document.getElementById("vktt-cat-filter");
    if (catFilterSel) {
      catFilterSel.value = catalogCatFilter;
      catFilterSel.onchange = () => {
        catalogCatFilter = catFilterSel.value;
        catalogOffset = 0;
        renderCatalogCards(false);
      };
    }
    const qualityFilterSel = document.getElementById("vktt-quality-filter");
    if (qualityFilterSel) {
      qualityFilterSel.value = String(catalogQualityFilter);
      qualityFilterSel.onchange = () => {
        catalogQualityFilter = parseInt(qualityFilterSel.value, 10) || 0;
        catalogOffset = 0;
        renderCatalogCards(false);
      };
    }
    const catalogSearchInp = document.getElementById("vktt-catalog-search");
    if (catalogSearchInp) {
      catalogSearchInp.value = catalogSearchQuery;
      let deb = null;
      catalogSearchInp.oninput = () => {
        clearTimeout(deb);
        deb = setTimeout(() => {
          catalogSearchQuery = catalogSearchInp.value.trim();
          catalogOffset = 0;
          renderCatalogCards(false);
        }, 180);
      };
    }
    const catalogMoreBtn = document.getElementById("vktt-btn-catalog-more");
    if (catalogMoreBtn) {
      catalogMoreBtn.onclick = () => {
        catalogOffset += CATALOG_LIMIT;
        renderCatalogCards(true);
      };
    }
    const btnCustomAdd = document.getElementById("vktt-btn-add-custom-item");
    if (btnCustomAdd) {
      btnCustomAdd.onclick = () => {
        const idInp = document.getElementById("vktt-custom-item-id");
        const cntInp = document.getElementById("vktt-custom-item-count");
        const id = idInp?.value?.trim() || "";
        const count = parseInt(cntInp?.value || "10", 10);
        if (!id) return notify("\u26A0\uFE0F Vui l\xF2ng nh\u1EADp ID v\u1EADt ph\u1EA9m!");
        addItem(id, count);
      };
    }
  }
  var currentCraftType = "luyen_dan";
  var recipeSearchQuery = "";
  function renderRecipeList() {
    const container = document.getElementById("vktt-recipe-list");
    if (!container) return;
    const state = getGameState();
    const tuiDo = state?.run?.nhanVat?.tuiDo || {};
    const allRecipes = getAllRecipes();
    let filtered = allRecipes.filter((r) => r.nghe === currentCraftType);
    if (recipeSearchQuery && recipeSearchQuery.trim()) {
      const qNorm = recipeSearchQuery.trim().toLowerCase();
      filtered = filtered.filter((r) => {
        const outInfo = getItemInfo(r.ra);
        const nameMatch = r.ten.toLowerCase().includes(qNorm);
        const outMatch = outInfo.name.toLowerCase().includes(qNorm);
        const idMatch = r.id.toLowerCase().includes(qNorm) || r.ra.toLowerCase().includes(qNorm);
        return nameMatch || outMatch || idMatch;
      });
    }
    if (filtered.length === 0) {
      container.innerHTML = '<div style="padding:14px;text-align:center;color:#64748b;font-size:12px;">Kh\xF4ng t\xECm th\u1EA5y c\xF4ng th\u1EE9c n\xE0o.</div>';
      return;
    }
    container.innerHTML = filtered.map((recipe) => {
      const outItem = getItemInfo(recipe.ra);
      const color = QUALITY_COLORS[outItem.quality] || "#94a3b8";
      const chuTags = (recipe.chu || []).map((c) => {
        const cInfo = getItemInfo(c.id);
        const stock = tuiDo[c.id] || 0;
        const hasEnough = stock >= c.so;
        return `<span class="vktt-ing-tag ${hasEnough ? "has" : "lack"}">
        ${cInfo.name} x${c.so} (${stock}/${c.so})
      </span>`;
      }).join("");
      const phuTags = (recipe.phu || []).map((p) => {
        const typeStr = CATEGORY_NAMES[p.loai || ""] || p.loai || "V\u1EADt ph\u1EA9m";
        const elStr = p.he && p.he.length ? `[${p.he.join("/")}]` : "";
        const phamStr = p.pham ? `P.${p.pham}` : "";
        return `<span class="vktt-ing-tag" style="border-color:#38bdf8;color:#7dd3fc;">
        Ph\u1EE5: ${typeStr} ${elStr} ${phamStr} x${p.so || 1}
      </span>`;
      }).join("");
      const hoaStr = recipe.hoa === "van" ? "V\u0103n H\u1ECFa" : recipe.hoa === "vu" ? "V\u0169 H\u1ECFa" : "";
      const ltStr = recipe.linh_thach ? `\u{1F48E} ${recipe.linh_thach} LT` : "";
      return `
      <div class="vktt-recipe-card">
        <div class="vktt-recipe-hdr">
          <span style="color:${color};font-size:12.5px;">
            <span class="vktt-quality-tag" style="background:${color};color:#000;">P.${outItem.quality}</span>
            <b>${outItem.name}</b> <small style="color:#94a3b8;font-weight:400;">(${recipe.ten})</small>
          </span>
          <span style="font-size:10.5px;color:#cbd5e1;">${[hoaStr, ltStr].filter(Boolean).join(" \xB7 ")}</span>
        </div>
        ${recipe.mo_ta ? `<div style="font-size:10.5px;color:#94a3b8;font-style:italic;">${recipe.mo_ta}</div>` : ""}
        <div class="vktt-recipe-ing-list">
          ${chuTags}
          ${phuTags}
        </div>
        <div class="vktt-recipe-actions">
          <button class="vktt-btn vktt-btn-sm vktt-btn-cyan vktt-btn-give-ing" data-recipe-id="${recipe.id}" style="flex:1;">
            \u{1F4E6} Nh\u1EADn \u0110\u1EE7 Nguy\xEAn Li\u1EC7u (x10)
          </button>
          <button class="vktt-btn vktt-btn-sm vktt-btn-ghost vktt-btn-craft-product" data-recipe-id="${recipe.id}" style="flex:1;">
            \u2728 Nh\u1EADn Th\xE0nh Ph\u1EA9m (x5)
          </button>
        </div>
      </div>
    `;
    }).join("");
    container.querySelectorAll(".vktt-btn-give-ing").forEach((btn) => {
      btn.onclick = () => {
        const rId = btn.getAttribute("data-recipe-id");
        if (rId) {
          giveIngredientsForRecipe(rId, 10);
          renderRecipeList();
        }
      };
    });
    container.querySelectorAll(".vktt-btn-craft-product").forEach((btn) => {
      btn.onclick = () => {
        const rId = btn.getAttribute("data-recipe-id");
        if (rId) {
          giveCraftedProduct(rId, 5);
          renderRecipeList();
        }
      };
    });
  }
  function getTabKinhMachHtml() {
    return `
    <!-- KH\u1ED0I 1: \u0110\xC3 TH\xD4NG KINH M\u1EA0CH & NGH\u1EC0 -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F300} \u0110\xE3 Th\xF4ng Kinh M\u1EA1ch & \u0110\u1ED9t Ph\xE1 Ngh\u1EC1</div>
      <div style="display:flex;gap:6px;margin-bottom:6px;">
        <button id="vktt-btn-meridian" class="vktt-btn vktt-btn-block" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%);flex:1;">
          \u{1F300} \u0110\xC3 TH\xD4NG KINH M\u1EA0CH (100% AN TO\xC0N)
        </button>
        <button id="vktt-btn-km-auto-opt" class="vktt-btn vktt-btn-cyan" style="flex:1;">
          \u26A1 B\u1ED0 TR\xCD T\xDAI L\xCAN NG\u01AF\u1EDCI
        </button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <button id="vktt-btn-all-profs" class="vktt-btn vktt-btn-ghost">\u2692\uFE0F T\xF4ng S\u01B0 3 Ngh\u1EC1</button>
        <button id="vktt-btn-all-recipes" class="vktt-btn vktt-btn-ghost">\u{1F525} H\u1ECDc 315 \u0110\u01A1n Ph\u01B0\u01A1ng & Tr\u1EADn \u0110\u1ED3</button>
      </div>
      <button id="vktt-btn-all-skills" class="vktt-btn vktt-btn-block" style="margin-top:6px;">
        \u26A1 H\u1ECDc To\xE0n B\u1ED9 87 K\u1EF9 Ph\xE1p & C\xF4ng Ph\xE1p C\u1EF1c Ph\u1EA9m
      </button>
    </div>

    <!-- KH\u1ED0I 2: S\u1ED4 TAY CH\u1EBE T\xC1C (LUY\u1EC6N \u0110AN, LUY\u1EC6N KH\xCD, CH\u1EBE PH\xD9) -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">
        <span>\u{1F4D6} S\u1ED5 Tay Ch\u1EBF T\xE1c (Luy\u1EC7n \u0110an, Luy\u1EC7n Kh\xED, Ch\u1EBF Ph\xF9)</span>
      </div>
      <!-- 3 SUB-TABS -->
      <div class="vktt-subtabs" id="vktt-craft-subtabs">
        <button class="vktt-subtab-btn ${currentCraftType === "luyen_dan" ? "active" : ""}" data-craft="luyen_dan">\u{1F33F} Luy\u1EC7n \u0110an (73)</button>
        <button class="vktt-subtab-btn ${currentCraftType === "luyen_bao" ? "active" : ""}" data-craft="luyen_bao">\u2694\uFE0F Luy\u1EC7n Kh\xED (118)</button>
        <button class="vktt-subtab-btn ${currentCraftType === "che_phu" ? "active" : ""}" data-craft="che_phu">\u{1F4DC} Ch\u1EBF Ph\xF9 (65)</button>
        <button class="vktt-subtab-btn ${currentCraftType === "tran_phap" ? "active" : ""}" data-craft="tran_phap">\u{1F52F} Tr\u1EADn Ph\xE1p (59)</button>
      </div>

      <div style="margin-bottom:6px;">
        <input type="text" id="vktt-recipe-search" class="vktt-inp" placeholder="\u{1F50D} T\xECm c\xF4ng th\u1EE9c ho\u1EB7c th\xE0nh ph\u1EA9m..." style="width:100%;" />
      </div>

      <div id="vktt-recipe-list" class="vktt-recipe-list">
        <!-- Recipe cards dynamically populated -->
      </div>
    </div>
  `;
  }
  function bindTabKinhMachEvents() {
    const btnM = document.getElementById("vktt-btn-meridian");
    if (btnM) btnM.onclick = unlockAllMeridians;
    const btnOpt = document.getElementById("vktt-btn-km-auto-opt");
    if (btnOpt) {
      btnOpt.onclick = () => {
        autoOptimizeFromBag();
      };
    }
    const btnP = document.getElementById("vktt-btn-all-profs");
    if (btnP) btnP.onclick = unlockAllProfessions;
    const btnR = document.getElementById("vktt-btn-all-recipes");
    if (btnR) btnR.onclick = unlockAllRecipes;
    const btnS = document.getElementById("vktt-btn-all-skills");
    if (btnS) btnS.onclick = unlockAllSkills;
    const subtabBtns = document.querySelectorAll("#vktt-craft-subtabs .vktt-subtab-btn");
    subtabBtns.forEach((btn) => {
      btn.onclick = () => {
        subtabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCraftType = btn.getAttribute("data-craft") || "luyen_dan";
        renderRecipeList();
      };
    });
    const recipeSearchInp = document.getElementById("vktt-recipe-search");
    if (recipeSearchInp) {
      recipeSearchInp.value = recipeSearchQuery;
      let rDeb = null;
      recipeSearchInp.oninput = () => {
        clearTimeout(rDeb);
        rDeb = setTimeout(() => {
          recipeSearchQuery = recipeSearchInp.value.trim();
          renderRecipeList();
        }, 180);
      };
    }
    renderRecipeList();
  }
  function getTabTuDongHtml() {
    const speed = getGameSpeed();
    const autoC = isAutoCultivateEnabled();
    const autoR = isAutoRecoveryEnabled();
    return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u26A1 T\u0103ng T\u1ED1c \u0110\u1ED9 Game (Speed Hack)</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Tua nhanh t\u1ED1c \u0111\u1ED9 di chuy\u1EC3n v\xE0 v\xF2ng l\u1EB7p th\u1EDDi gian trong game.
      </p>
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:5px;">
        <button class="vktt-btn vktt-speed-btn ${speed === 1 ? "vktt-btn-cyan" : "vktt-btn-ghost"}" data-speed="1">1x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 2 ? "vktt-btn-cyan" : "vktt-btn-ghost"}" data-speed="2">2x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 3 ? "vktt-btn-cyan" : "vktt-btn-ghost"}" data-speed="3">3x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 5 ? "vktt-btn-cyan" : "vktt-btn-ghost"}" data-speed="5">5x</button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F9D8} T\u1EF1 \u0110\u1ED9ng Tu Luy\u1EC7n</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        T\u1EF1 \u0111\u1ED9ng t\u0103ng tu vi li\xEAn t\u1EE5c theo th\u1EDDi gian th\u1EF1c m\xE0 kh\xF4ng c\u1EA7n ng\u01B0\u1EDDi ch\u01A1i ph\u1EA3i canh b\u1EA5m.
      </p>
      <button id="vktt-btn-auto-cultivate" class="vktt-btn vktt-btn-block ${autoC ? "vktt-btn-red" : "vktt-btn-green"}">
        ${autoC ? "\u23F9\uFE0F D\u1EEANG T\u1EF1 \u0110\u1ED9ng Tu Luy\u1EC7n" : "\u25B6\uFE0F B\u1EAET \u0110\u1EA6U T\u1EF1 \u0110\u1ED9ng Tu Luy\u1EC7n"}
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F496} T\u1EF1 \u0110\u1ED9ng H\u1ED3i Ph\u1EE5c Sinh L\u1EF1c & Ch\xE2n Nguy\xEAn</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Khi Kh\xED Huy\u1EBFt ho\u1EB7c Ch\xE2n Nguy\xEAn gi\u1EA3m d\u01B0\u1EDBi 60%, t\u1EF1 \u0111\u1ED9ng h\u1ED3i ph\u1EE5c v\u1EC1 m\u1EE9c t\u1ED1i \u0111a ngay l\u1EADp t\u1EE9c.
      </p>
      <button id="vktt-btn-auto-recovery" class="vktt-btn vktt-btn-block ${autoR ? "vktt-btn-red" : "vktt-btn-green"}">
        ${autoR ? "\u23F9\uFE0F D\u1EEANG T\u1EF1 \u0110\u1ED9ng H\u1ED3i Ph\u1EE5c" : "\u25B6\uFE0F B\u1EAET \u0110\u1EA6U T\u1EF1 \u0110\u1ED9ng H\u1ED3i Ph\u1EE5c"}
      </button>
    </div>
  `;
  }
  function bindTabTuDongEvents() {
    const speedBtns = document.querySelectorAll(".vktt-speed-btn");
    speedBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const spd = parseInt(btn.getAttribute("data-speed") || "1", 10);
        setGameSpeed(spd);
        renderTabContent("tab-tu-dong");
      });
    });
    const btnAutoC = document.getElementById("vktt-btn-auto-cultivate");
    if (btnAutoC) {
      btnAutoC.onclick = () => {
        toggleAutoCultivate();
        renderTabContent("tab-tu-dong");
      };
    }
    const btnAutoR = document.getElementById("vktt-btn-auto-recovery");
    if (btnAutoR) {
      btnAutoR.onclick = () => {
        toggleAutoRecovery();
        renderTabContent("tab-tu-dong");
      };
    }
  }
  function getTabSaoLuuHtml() {
    return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F4BE} Xu\u1EA5t File Save</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        T\u1EA3i to\xE0n b\u1ED9 ti\u1EBFn tr\xECnh tu ti\xEAn ra file JSON v\u1EC1 m\xE1y \u0111i\u1EC7n tho\u1EA1i c\u1EE7a b\u1EA1n.
      </p>
      <button id="vktt-btn-export-save" class="vktt-btn vktt-btn-cyan vktt-btn-block">
        \u{1F4E5} Xu\u1EA5t Save JSON V\u1EC1 M\xE1y
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F4C2} N\u1EA1p File Save</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Ch\u1ECDn file save JSON \u0111\xE3 xu\u1EA5t t\u1EEB tr\u01B0\u1EDBc \u0111\u1EC3 kh\xF4i ph\u1EE5c ti\u1EBFn tr\xECnh.
      </p>
      <input type="file" id="vktt-inp-save-file" accept=".json" style="display:none;" />
      <button id="vktt-btn-import-file" class="vktt-btn vktt-btn-purple vktt-btn-block" style="margin-bottom:6px;">
        \u{1F4E4} Ch\u1ECDn File Save JSON \u0110\u1EC3 N\u1EA1p
      </button>
      <div class="vktt-field">
        <label class="vktt-label">Ho\u1EB7c D\xE1n N\u1ED9i Dung Save JSON Tr\u1EF1c Ti\u1EBFp</label>
        <textarea id="vktt-txt-save" class="vktt-inp" style="height:65px;padding:6px;font-size:11px;width:100%;" placeholder='D\xE1n chu\u1ED7i JSON v\xE0o \u0111\xE2y...'></textarea>
        <button id="vktt-btn-import-text" class="vktt-btn vktt-btn-ghost vktt-btn-block" style="margin-top:5px;">
          Kh\xF4i Ph\u1EE5c T\u1EEB Chu\u1ED7i D\xE1n
        </button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr" style="color:#f87171;">\u26A0\uFE0F T\u1EA9y T\u1EE7y & Kh\xF4i Ph\u1EE5c Kh\u1EA9n C\u1EA5p</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        X\xF3a to\xE0n b\u1ED9 b\u1ED9 nh\u1EDB \u0111\u1EC7m game \u0111\u1EC3 kh\u1EAFc ph\u1EE5c m\xE0n h\xECnh crash/\u0111\u01A1.
      </p>
      <button id="vktt-btn-clear-cache" class="vktt-btn vktt-btn-red vktt-btn-block">
        \u{1F300} T\u1EA8Y T\u1EE6Y (X\xD3A CACHE & T\u1EA2I L\u1EA0I TRANG)
      </button>
    </div>
  `;
  }
  function bindTabSaoLuuEvents() {
    const btnExp = document.getElementById("vktt-btn-export-save");
    if (btnExp) btnExp.onclick = exportSaveFile;
    const btnImpFile = document.getElementById("vktt-btn-import-file");
    const fileInp = document.getElementById("vktt-inp-save-file");
    if (btnImpFile && fileInp) {
      btnImpFile.onclick = () => fileInp.click();
      fileInp.onchange = () => {
        const file = fileInp.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (text) importSaveJson(text);
        };
        reader.readAsText(file);
      };
    }
    const btnImpText = document.getElementById("vktt-btn-import-text");
    if (btnImpText) {
      btnImpText.onclick = () => {
        const text = document.getElementById("vktt-txt-save")?.value || "";
        if (text.trim()) importSaveJson(text);
      };
    }
    const btnClear = document.getElementById("vktt-btn-clear-cache");
    if (btnClear) btnClear.onclick = clearGameCache;
  }

  // src/index.ts
  (function() {
    "use strict";
    if (typeof window.WScript !== "undefined") {
      window.WScript.Echo("\u0110\xE2y l\xE0 file Userscript d\xE0nh cho tr\xECnh duy\u1EC7t web (Violentmonkey / Tampermonkey).");
      window.WScript.Quit(0);
      return;
    }
    console.log("[VKTT MOD v3.0] Kh\u1EDFi \u0111\u1ED9ng tr\xECnh h\u1ED7 tr\u1EE3 V\u1EA1n Ki\u1EBFp Tu Ti\xEAn...");
    waitForGame(() => {
      initUI();
      notify("\u2728 V\u1EA0N KI\u1EBEP TU TI\xCAN MOD v3.0 \u0111\xE3 k\xEDch ho\u1EA1t! B\u1EA5m bi\u1EC3u t\u01B0\u1EE3ng \u262F \u1EDF g\xF3c m\xE0n h\xECnh.");
    });
  })();
})();
