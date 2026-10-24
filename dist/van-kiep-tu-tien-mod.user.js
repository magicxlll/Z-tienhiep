// ==UserScript==
// @name         Vạn Kiếp Tu Tiên - MOD Assistant Suite v3.0 (Mobile & Desktop)
// @namespace    https://github.com/magicxlll/Z-tienhiep
// @version      3.0.0
// @description  Bảng MOD & Tự Động Hóa Vạn Kiếp Tu Tiên - Giao diện Mobile-First tối ưu cho Edge Mobile (Violentmonkey) và Desktop (Tampermonkey)
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
  var MOD_STYLES = `
/* ================= VKTT MOD v3.0 MOBILE-FIRST STYLES ================= */
#vktt-drawer, #vktt-drawer *, #vktt-drawer *::before, #vktt-drawer *::after {
  box-sizing: border-box;
}

@keyframes vktt-gold-pulse {
  0% { box-shadow: 0 0 0 0 rgba(229, 184, 105, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(229, 184, 105, 0); }
  100% { box-shadow: 0 0 0 0 rgba(229, 184, 105, 0); }
}

@keyframes vktt-rainbow-text {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.vktt-rainbow {
  background: linear-gradient(90deg, #ff4d4d, #ffaf40, #fffa65, #32ff7e, #18dcff, #7d5fff, #ff4d4d);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: vktt-rainbow-text 3s ease infinite;
  font-weight: 800;
}

/* FLOATING ACTION BUTTON (FAB) */
#vktt-fab {
  position: fixed;
  bottom: 80px;
  right: 14px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e5b869 0%, #996515 100%);
  color: #0b0d14;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 900;
  cursor: pointer;
  z-index: 9999999;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 15px rgba(229, 184, 105, 0.5);
  border: 2px solid #ffd88a;
  animation: vktt-gold-pulse 3s infinite;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  transition: transform 0.15s ease, filter 0.15s ease;
}

#vktt-fab:active {
  transform: scale(0.92);
  filter: brightness(1.2);
}

/* BACKDROP */
#vktt-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 12, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9999998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.28s ease;
}

#vktt-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

/* BOTTOM SHEET DRAWER */
#vktt-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 100vw;
  height: 84vh;
  max-height: 86vh;
  background: linear-gradient(180deg, rgba(20, 24, 38, 0.99) 0%, rgba(10, 13, 20, 0.99) 100%);
  border-top: 2px solid #e5b869;
  border-radius: 18px 18px 0 0;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(229, 184, 105, 0.2);
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transform: translateY(100%);
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
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
    width: 420px;
    height: 85vh;
    border-radius: 16px;
    border: 1px solid #e5b869;
  }
}

#vktt-drawer.open {
  transform: translateY(0);
}

/* DRAG HANDLE */
.vktt-drag-handle {
  width: 100%;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  padding-top: 4px;
}

.vktt-drag-bar {
  width: 40px;
  height: 4px;
  border-radius: 3px;
  background: rgba(229, 184, 105, 0.4);
}

/* HEADER */
.vktt-header {
  padding: 6px 14px 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(229, 184, 105, 0.2);
}

.vktt-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vktt-title {
  font-size: 14.5px;
  font-weight: 800;
  color: #e5b869;
  letter-spacing: 0.4px;
}

.vktt-badge {
  font-size: 9.5px;
  padding: 2px 5px;
  background: rgba(229, 184, 105, 0.15);
  border: 1px solid rgba(229, 184, 105, 0.4);
  color: #e5b869;
  border-radius: 4px;
  font-weight: 700;
}

.vktt-close-btn {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #94a3b8;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.vktt-close-btn:hover, .vktt-close-btn:active {
  background: rgba(239, 68, 68, 0.25);
  color: #ef4444;
}

/* TAB BAR (TOUCH SCROLLABLE) */
.vktt-tabs {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  background: rgba(13, 16, 26, 0.98);
  border-bottom: 1px solid #1e2438;
  padding: 4px 6px;
  gap: 4px;
}

.vktt-tabs::-webkit-scrollbar {
  display: none;
}

.vktt-tab-btn {
  flex: 0 0 auto;
  padding: 7px 11px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  border-radius: 7px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.vktt-tab-btn.active {
  background: rgba(229, 184, 105, 0.18);
  color: #e5b869;
  border: 1px solid rgba(229, 184, 105, 0.35);
}

/* CONTENT CONTAINER */
.vktt-content {
  flex: 1;
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 12px;
  -webkit-overflow-scrolling: touch;
}

/* OVERVIEW STAT BOX */
.vktt-stat-overview {
  margin-bottom: 8px;
  background: linear-gradient(135deg, rgba(229, 184, 105, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%);
  border: 1px solid rgba(229, 184, 105, 0.25);
  padding: 7px 10px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 8px;
  font-size: 11px;
}

.vktt-stat-overview div {
  color: #94a3b8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vktt-stat-overview b {
  color: #f1f5f9;
}

/* CARD / SECTION */
.vktt-card {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  background: rgba(18, 22, 34, 0.9);
  border: 1px solid #232a42;
  border-radius: 9px;
  padding: 9px 10px;
  margin-bottom: 8px;
}

.vktt-card-hdr {
  font-size: 12.5px;
  font-weight: 700;
  color: #ffd88a;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* COMPACT RESPONSIVE ROW */
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
  min-width: 80px;
  color: #94a3b8;
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
  height: 33px;
  background: #0f1320;
  border: 1px solid #2d3652;
  border-radius: 6px;
  padding: 0 7px;
  color: #f8fafc;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s;
}

.vktt-inp:focus {
  border-color: #e5b869;
  box-shadow: 0 0 6px rgba(229, 184, 105, 0.2);
}

.vktt-select {
  height: 33px;
  background: #0f1320;
  border: 1px solid #2d3652;
  border-radius: 6px;
  padding: 0 6px;
  color: #f8fafc;
  font-size: 12px;
  outline: none;
  min-width: 0;
}

.vktt-select:focus {
  border-color: #e5b869;
}

.vktt-label {
  display: block;
  font-size: 11px;
  color: #94a3b8;
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

/* BUTTONS */
.vktt-btn {
  height: 33px;
  padding: 0 11px;
  background: linear-gradient(135deg, #e5b869 0%, #b78438 100%);
  color: #0b0d14;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-shrink: 0;
  transition: filter 0.15s, transform 0.1s;
}

.vktt-btn:active {
  transform: scale(0.96);
  filter: brightness(1.15);
}

.vktt-btn-sm {
  height: 31px;
  padding: 0 9px;
  font-size: 11.5px;
}

.vktt-btn-block {
  width: 100%;
}

.vktt-btn-cyan {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: #fff;
}

.vktt-btn-purple {
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  color: #fff;
}

.vktt-btn-green {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
}

.vktt-btn-red {
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  color: #fff;
}

.vktt-btn-ghost {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  border: 1px solid #334155;
}

/* LINH CAN GRID */
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
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  background: #131724;
  padding: 5px 2px;
  border-radius: 5px;
  border: 1px solid #232a3f;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}

.vktt-chk-label input {
  margin: 0;
  cursor: pointer;
}

/* STAT ROW WITH CHECKBOX */
.vktt-stat-row {
  display: flex;
  gap: 5px;
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
  gap: 4px;
  font-size: 11px;
  color: #cbd5e1;
  font-weight: 600;
  flex-shrink: 0;
  cursor: pointer;
  white-space: nowrap;
}

.vktt-stat-chk-wrap input {
  margin: 0;
  cursor: pointer;
}

/* GRID 2 COLUMNS (FLEXIBLE) */
.vktt-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  width: 100%;
}

/* SEARCH SUGGESTIONS */
.vktt-dropdown-list {
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #2d3652;
  border-radius: 8px;
  background: #0f1320;
  margin-top: 6px;
  width: 100%;
}

.vktt-dropdown-item {
  padding: 7px 9px;
  font-size: 11.5px;
  border-bottom: 1px solid #1a2033;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.15s;
}

.vktt-dropdown-item:hover, .vktt-dropdown-item:active {
  background: rgba(229, 184, 105, 0.15);
}

.vktt-quality-tag {
  font-size: 9.5px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 700;
}

/* SUB-TABS */
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
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  border: 1px solid #1e293b;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.vktt-subtab-btn.active {
  background: linear-gradient(135deg, rgba(229, 184, 105, 0.2) 0%, rgba(183, 132, 56, 0.25) 100%);
  color: #e5b869;
  border-color: #e5b869;
  font-weight: 700;
}

/* FILTER BARS & CONTROLS */
.vktt-filter-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  width: 100%;
  min-width: 0;
}

/* ITEM CATALOG */
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
  background: rgba(19, 23, 36, 0.85);
  border: 1px solid #232a3f;
  border-radius: 8px;
  padding: 6px 8px;
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
  font-size: 10px;
  color: #94a3b8;
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

/* RECIPE CARDS */
.vktt-recipe-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 440px;
  overflow-y: auto;
  padding-right: 2px;
}
.vktt-recipe-card {
  background: rgba(19, 23, 36, 0.9);
  border: 1px solid #283149;
  border-radius: 8px;
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
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
  padding-bottom: 4px;
}
.vktt-recipe-ing-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 10.5px;
  margin: 2px 0;
}
.vktt-ing-tag {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #334155;
  border-radius: 4px;
  padding: 2px 5px;
  color: #cbd5e1;
}
.vktt-ing-tag.has {
  border-color: #059669;
  color: #34d399;
}
.vktt-ing-tag.lack {
  border-color: #b91c1c;
  color: #f87171;
}
.vktt-recipe-actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
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
  var PRESET_ITEMS = { "item.huyen_hoang_tao_hoa_kinh": { "name": "Huy\u1EC1n Ho\xE0ng T\u1EA1o H\xF3a Kinh", "quality": 8, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 8 \xB7 V\xF4 th\u01B0\u1EE3ng \u0111\u1EA1i \u0111\u1EA1o ch\xE2n kinh ch\u01B0\u1EDFng kh\u1ED1ng huy\u1EC1n ho\xE0ng t\u1EA1o h\xF3a" }, "item.luan_hoi_chan_kinh": { "name": "Lu\xE2n H\u1ED3i Ch\xE2n Kinh", "quality": 8, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 8 \xB7 Tuy\u1EC7t th\u1EBF ch\xE2n kinh ch\u01B0\u1EDFng kh\u1ED1ng sinh t\u1EED lu\xE2n h\u1ED3i" }, "item.yeu_hoang_huyet_kinh": { "name": "Y\xEAu Ho\xE0ng Huy\u1EBFt Kinh", "quality": 8, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 8 \xB7 C\u1ED5 kinh huy\u1EBFt m\u1EA1ch Y\xEAu Ho\xE0ng th\u01B0\u1EE3ng c\u1ED5 b\xE1 tuy\u1EC7t thi\xEAn h\u1EA1" }, "item.cuu_u_hoang_hoa": { "name": "C\u1EEDu U Ho\xE0ng H\u1ECFa", "quality": 8, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 8 \xB7 \u0110\u1EBF h\u1ECFa C\u1EEDu U thi\xEAu r\u1EE5i v\u1EA1n c\u1ED5 th\u1EA7n ma" }, "item.bat_chiet_kiem": { "name": "B\u1EA5t Chi\u1EBFt Ki\u1EBFm", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 Th\u1EA7n ki\u1EBFm v\u1EA1n ki\u1EBFp b\u1EA5t chi\u1EBFt, ki\u1EBFm \xFD th\xF4ng thi\xEAn" }, "item.doan_thien_chien_ky": { "name": "\u0110o\u1EA1n Thi\xEAn Chi\u1EBFn K\u1EF3", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 Chi\u1EBFn k\u1EF3 th\u01B0\u1EE3ng c\u1ED5 ph\u1EA5t l\xEAn ch\xE9m \u0111\u1EE9t thi\xEAn l\u1ED9" }, "item.hon_thien_lang": { "name": "H\u1ED7n Thi\xEAn L\u0103ng", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 Ti\xEAn thi\xEAn ch\xED b\u1EA3o d\u1EA3i l\u1EE5a \u0111\u1ECF tr\xF3i bu\u1ED9c c\xE0n kh\xF4n v\u0169 tr\u1EE5" }, "item.nghich_lan_thuan": { "name": "Ngh\u1ECBch L\xE2n Thu\u1EABn", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 H\u1ED9 thu\u1EABn \u0111\xFAc t\u1EEB v\u1EA3y ng\u01B0\u1EE3c Ch\xE2n Long b\u1EA5t ho\u1EA1i" }, "item.phong_thien_an": { "name": "Phong Thi\xEAn \u1EA4n", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 C\u1ED5 \u1EA5n ch\xED t\xF4n phong t\u1ECFa thi\xEAn \u0111\u1ECBa c\xE0n kh\xF4n" }, "item.tam_sinh_thach": { "name": "Tam Sinh Th\u1EA1ch", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 C\u1ED5 v\u1EADt k\u1EF7 v\u1EADt tam sinh lu\xE2n h\u1ED3i, g\u1EAFn kinh m\u1EA1ch \u0111\u1EA1i ph\xFAc duy\xEAn" }, "item.thai_co_long_lan": { "name": "Th\xE1i C\u1ED5 Long L\xE2n", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 V\u1EA3y r\u1ED3ng Th\xE1i C\u1ED5 ch\xED b\u1EA3o h\u1ED9 th\xE2n v\u1EA1n ph\xE1p b\u1EA5t x\xE2m" }, "item.thai_hu_chu": { "name": "Th\xE1i H\u01B0 Ch\xE2u", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 Th\u1EA7n ch\xE2u \u1EA9n ch\u1EE9a h\u1ED7n \u0111\u1ED9n th\xE1i h\u01B0 v\xF4 c\u1EF1c" }, "item.toai_thien_kiem": { "name": "To\xE1i Thi\xEAn Ki\u1EBFm", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 Th\u1EA7n ki\u1EBFm ch\xE9m v\u1EE1 h\u01B0 kh\xF4ng c\u1EEDu thi\xEAn" }, "item.van_kiep_hon_dang": { "name": "V\u1EA1n Ki\u1EBFp H\u1ED3n \u0110\u0103ng", "quality": 8, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 8 \xB7 \u0110\xE8n th\u1EA7n b\u1EA5t di\u1EC7t qua v\u1EA1n ki\u1EBFp lu\xE2n h\u1ED3i" }, "item.can_khon_gioi": { "name": "C\xE0n Kh\xF4n Gi\u1EDBi", "quality": 8, "cat": "Tr\u1EEF V\u1EADt", "desc": "Ph\u1EA9m 8 \xB7 Nh\u1EABn tr\u1EEF v\u1EADt t\u1ED1i th\u01B0\u1EE3ng ch\u1EE9a c\u1EA3 c\xE0n kh\xF4n v\u0169 tr\u1EE5" }, "item.nghich_menh_dan": { "name": "Ngh\u1ECBch M\u1EC7nh \u0110an", "quality": 8, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 8 \xB7 Th\u1EA7n \u0111an c\u1EA3i thi\xEAn ngh\u1ECBch m\u1EC7nh, xoay chuy\u1EC3n c\xE0n kh\xF4n" }, "item.thien_dien_dan": { "name": "Thi\xEAn Di\u1EC5n \u0110an", "quality": 8, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 8 \xB7 Th\u1EA7n \u0111an suy di\u1EC5n thi\xEAn c\u01A1, \u0111\u1EA1i t\u0103ng to\xE0n di\u1EC7n c\u0103n c\u01A1" }, "item.canh_kim_chan_kinh": { "name": "Canh Kim Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 C\xF4ng ph\xE1p Kim h\u1EC7 ch\xED t\xF4n, s\xE1t ph\u1EA1t s\u1EAFc b\xE9n v\xF4 th\u01B0\u1EE3ng" }, "item.cuu_duong_chan_kinh": { "name": "C\u1EEDu D\u01B0\u01A1ng Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 Ch\xED d\u01B0\u01A1ng v\xF4 th\u01B0\u1EE3ng t\xE2m ph\xE1p, v\u1EA1n t\xE0 b\u1EA5t x\xE2m" }, "item.cuu_thien_cuong_phong": { "name": "C\u1EEDu Thi\xEAn C\u01B0\u01A1ng Phong", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 Gi\xF3 l\u1ED1c c\u1EEDu thi\xEAn x\xE9 tan m\u1ECDi ph\xF2ng ng\u1EF1" }, "item.huyen_hoang_chuong": { "name": "Huy\u1EC1n Ho\xE0ng Ch\u01B0\u1EDFng", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 Tuy\u1EC7t th\u1EBF ch\u01B0\u1EDFng ph\xE1p mang s\u1EE9c n\u1EB7ng c\u1EE7a m\u1EABu kh\xED huy\u1EC1n ho\xE0ng" }, "item.huyen_minh_chan_kinh": { "name": "Huy\u1EC1n Minh Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 C\u1EF1c h\xE0n huy\u1EC1n minh ch\xE2n quy\u1EBFt \u0111\xF3ng b\u0103ng v\u1EA1n v\u1EADt" }, "item.ngu_to_hop_dao_quyet": { "name": "Ng\u0169 T\u1ED5 H\u1EE3p \u0110\u1EA1o Quy\u1EBFt", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 Tuy\u1EC7t h\u1ECDc h\u1EE3p \u0111\u1EA1o ng\u0169 h\xE0nh quy nh\u1EA5t" }, "item.phan_thien_chan_hoa": { "name": "Ph\u1EA7n Thi\xEAn Ch\xE2n H\u1ECFa", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 H\u1ECFa \u0111\u1EA1o ch\xED t\xF4n thi\xEAu \u0111\u1ED1t b\xE1t hoang" }, "item.thai_thanh_tien_kinh": { "name": "Th\xE1i Thanh Ti\xEAn Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn kinh th\u01B0\u1EE3ng c\u1ED5 \u0111\u1EA1o gia huy\u1EC1n di\u1EC7u v\xF4 song" }, "item.thai_thuong_huyen_thuy_kinh": { "name": "Th\xE1i Th\u01B0\u1EE3ng Huy\u1EC1n Th\u1EE7y Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 Th\u1EE7y h\u1EC7 ch\xED cao t\xE2m ph\xE1p, nhu h\xF2a v\u1EA1n qu\xE2n" }, "item.thanh_de_truong_xuan_kinh": { "name": "Thanh \u0110\u1EBF Tr\u01B0\u1EDDng Xu\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn kinh M\u1ED9c \u0111\u1EA1o c\u1EE7a Thanh \u0110\u1EBF th\u01B0\u1EE3ng c\u1ED5, sinh c\u01A1 v\xF4 t\u1EADn" }, "item.thien_loi_chinh_phap": { "name": "Thi\xEAn L\xF4i Ch\xEDnh Ph\xE1p", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 L\xF4i ph\xE1p thi\xEAn \u0111\xECnh tr\u1EA5n di\u1EC7t t\xE0 ma" }, "item.truong_sinh_chan_kinh": { "name": "Tr\u01B0\u1EDDng Sinh Ch\xE2n Kinh", "quality": 7, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 7 \xB7 M\u1ED9c \u0111\u1EA1o ch\xE2n kinh tr\u01B0\u1EDDng sinh b\u1EA5t l\xE3o, sinh c\u01A1 b\u1EA5t t\u1EADn" }, "item.cuu_thien_huyen_bang_hoa": { "name": "C\u1EEDu Thi\xEAn Huy\u1EC1n B\u0103ng H\u1ECFa", "quality": 7, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 7 \xB7 D\u1ECB h\u1ECFa ch\xED h\xE0n thi\xEAu \u0111\u1ED1t c\u1EA3 nguy\xEAn th\u1EA7n" }, "item.ngu_sac_than_thach": { "name": "Ng\u0169 S\u1EAFc Th\u1EA7n Th\u1EA1ch", "quality": 7, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 7 \xB7 \u0110\xE1 th\u1EA7n n\u0103m m\xE0u N\u1EEF Oa v\xE1 tr\u1EDDi" }, "item.tuc_nhuong": { "name": "T\u1EE9c Nh\u01B0\u1EE1ng", "quality": 7, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 7 \xB7 Th\u1EA7n th\u1ED5 t\u1EF1 sinh tr\u01B0\u1EDFng v\xF4 t\u1EADn" }, "item.cuu_thien_bat_tu_thao": { "name": "C\u1EEDu Thi\xEAn B\u1EA5t T\u1EED Th\u1EA3o", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn th\u1EA3o c\u1EA3i t\u1EED ho\xE0n sinh n\u01A1i c\u1EEDu thi\xEAn" }, "item.hoang_trung_ly": { "name": "Ho\xE0ng Trung L\xFD", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn qu\u1EA3 th\u01B0\u1EE3ng c\u1ED5 ch\xEDn m\u1ED9t l\u1EA7n m\u1ED7i v\u1EA1n n\u0103m" }, "item.kien_moc_chi": { "name": "Ki\u1EBFn M\u1ED9c Chi", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 C\xE0nh c\xE2y th\u1EA7n th\u1EE5 Ki\u1EBFn M\u1ED9c ch\u1ED1ng tr\u1EDDi" }, "item.kien_moc_qua": { "name": "Ki\u1EBFn M\u1ED9c Qu\u1EA3", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Tr\xE1i c\u1EE7a th\u1EA7n th\u1EE5 Ki\u1EBFn M\u1ED9c th\xF4ng thi\xEAn" }, "item.ngo_dao_tra": { "name": "Ng\u1ED9 \u0110\u1EA1o Tr\xE0", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 L\xE1 tr\xE0 ti\xEAn thi\xEAn gi\xFAp \u0111\u1ED1n ng\u1ED9 \u0111\u1EA1i \u0111\u1EA1o, t\u0103ng m\u1EA1nh ng\u1ED9 t\xEDnh" }, "item.than_huyet_dang": { "name": "Th\u1EA7n Huy\u1EBFt \u0110\u1EB1ng", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 D\xE2y leo \u1EA9n ch\u1EE9a th\u1EA7n huy\u1EBFt th\u01B0\u1EE3ng c\u1ED5" }, "item.thien_nhat_chan_thuy": { "name": "Thi\xEAn Nh\u1EA5t Ch\xE2n Th\u1EE7y", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Gi\u1ECDt ch\xE2n th\u1EE7y kh\u1EDFi nguy\xEAn c\u1EE7a tr\u1EDDi \u0111\u1EA5t" }, "item.tuyet_long_sam": { "name": "Tuy\u1EBFt Long S\xE2m", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 B\u1EA3o s\xE2m h\xF3a h\xECnh r\u1ED3ng tuy\u1EBFt v\u1EA1n n\u0103m" }, "item.van_nien_ban_dao": { "name": "V\u1EA1n Ni\xEAn B\xE0n \u0110\xE0o", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn qu\u1EA3 B\xE0n \u0110\xE0o v\u1EA1n n\u0103m t\u0103ng \u0111\u1EA1i th\u1ECD nguy\xEAn" }, "item.van_tai_tuyet_lien": { "name": "V\u1EA1n T\u1EA3i Tuy\u1EBFt Li\xEAn", "quality": 7, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Sen tuy\u1EBFt v\u1EA1n n\u0103m n\u1EDF tr\xEAn \u0111\u1EC9nh b\u0103ng s\u01A1n" }, "item.dan_lo_tien": { "name": "\u0110an L\xF4 Ti\xEAn", "quality": 7, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn thi\xEAn \u0111an l\xF4 luy\u1EC7n ch\u1EBF th\u1EA7n \u0111an c\u1EF1c ph\u1EA9m" }, "item.khi_lo_tien": { "name": "Kh\xED L\xF4 Ti\xEAn", "quality": 7, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn thi\xEAn kh\xED l\xF4 r\xE8n \u0111\xFAc th\u1EA7n kh\xED ch\xED b\u1EA3o" }, "item.phu_but_tien": { "name": "Ph\xF9 B\xFAt Ti\xEAn", "quality": 7, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 7 \xB7 B\xFAt ti\xEAn v\u1EBD ph\xF9 th\xF4ng thi\xEAn \u0111\u1EA1t \u0111\u1ECBa" }, "item.ba_tieu_phien": { "name": "Ba Ti\xEAu Phi\xEAn", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Qu\u1EA1t th\u1EA7n Ba Ti\xEAu qu\u1EA1t t\u1EAFt thi\xEAn h\u1ECFa, n\u1ED5i b\xE3o c\u1EEDu thi\xEAn" }, "item.dinh_hai_chau": { "name": "\u0110\u1ECBnh H\u1EA3i Ch\xE2u", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Th\u1EA7n ch\xE2u ti\xEAn thi\xEAn \u0111\u1ECBnh tr\u1EE5 t\u1EE9 h\u1EA3i b\xE1t hoang" }, "item.hau_tho_than_bi": { "name": "H\u1EADu Th\u1ED5 Th\u1EA7n Bi", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Bia th\u1EA7n H\u1EADu Th\u1ED5 tr\u1EA5n \xE1p s\u01A1n h\xE0 \u0111\u1EA1i \u0111\u1ECBa" }, "item.hon_nguyen_chau": { "name": "H\u1ED7n Nguy\xEAn Ch\xE2u", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 B\u1EA3o ch\xE2u h\u1ED7n nguy\xEAn dung n\u1EA1p v\u1EA1n ph\xE1p" }, "item.kinh_hong_tien_kiem": { "name": "Kinh H\u1ED3ng Ti\xEAn Ki\u1EBFm", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn ki\u1EBFm l\u01B0\u1EDBt nhanh nh\u01B0 b\xF3ng kinh h\u1ED3ng, tr\u1EA3m tuy\u1EC7t h\u01B0 kh\xF4ng" }, "item.linh_lung_tran_nhac_thap": { "name": "Linh Lung Tr\u1EA5n Nh\u1EA1c Th\xE1p", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 B\u1EA3o th\xE1p Linh Lung tr\u1EA5n \xE1p v\u1EA1n d\u1EB7m s\u01A1n h\xE0" }, "item.luu_ly_tien_dang": { "name": "L\u01B0u Ly Ti\xEAn \u0110\u0103ng", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Ng\u1ECDn \u0111\xE8n l\u01B0u ly soi s\xE1ng ti\xEAn l\u1ED9" }, "item.ly_hoa_tien_kiem": { "name": "Ly H\u1ECFa Ti\xEAn Ki\u1EBFm", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn ki\u1EBFm r\u1EF1c ch\xE1y th\u1EA7n h\u1ECFa Nam Minh" }, "item.ngoc_tinh_binh": { "name": "Ng\u1ECDc T\u1ECBnh B\xECnh", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 B\xECnh ng\u1ECDc ch\u1EE9a thi\xEAn \u0111\u1ECBa cam l\u1ED9" }, "item.oanh_thien_loi_chuy": { "name": "Oanh Thi\xEAn L\xF4i Ch\xF9y", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 L\xF4i ch\xF9y oanh k\xEDch ch\u1EA5n v\u1EE1 thi\xEAn khung" }, "item.thong_ty_kim_con": { "name": "Th\xF4ng T\xFD Kim C\xF4n", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Th\u1EA7n c\xF4n kim tinh vung l\xEAn ch\u1EA5n n\xE1t th\u01B0\u01A1ng khung" }, "item.thua_anh_kiem": { "name": "Th\u1EEBa \u1EA2nh Ki\u1EBFm", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Th\u01B0\u1EE3ng c\u1ED5 danh ki\u1EBFm v\xF4 \u1EA3nh v\xF4 h\xECnh" }, "item.tru_tien_kiem": { "name": "Tru Ti\xEAn Ki\u1EBFm", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Tuy\u1EC7t th\u1EBF hung ki\u1EBFm tru s\xE1t ti\xEAn th\u1EA7n" }, "item.tu_thu_tien_y": { "name": "T\u1EED Th\u1EE5 Ti\xEAn Y", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn y h\u1ED9 th\u1EC3 b\u1EA5t ho\u1EA1i d\u1EC7t t\u1EEB h\xE0o quang t\xEDm" }, "item.tu_tieu_than_kiem": { "name": "T\u1EED Ti\xEAu Th\u1EA7n Ki\u1EBFm", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 Th\u1EA7n ki\u1EBFm s\u1EA5m s\xE9t T\u1EED Ti\xEAu Cung" }, "item.uan_anh_lien": { "name": "U\u1EA9n Anh Li\xEAn", "quality": 7, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 7 \xB7 B\u1EA3o li\xEAn u\u1EA9n d\u01B0\u1EE1ng Nguy\xEAn Anh b\u1EA5t di\u1EC7t" }, "item.phu_dieu_si": { "name": "Ph\xF9 Di\xEAu S\xED", "quality": 7, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Ph\u1EA9m 7 \xB7 C\xE1nh th\u1EA7n c\u01B0\u1EE1i gi\xF3 ch\xEDn v\u1EA1n d\u1EB7m" }, "item.tieu_can_khon_dai": { "name": "Ti\u1EC3u C\xE0n Kh\xF4n \u0110\u1EA1i", "quality": 7, "cat": "Tr\u1EEF V\u1EADt", "desc": "Ph\u1EA9m 7 \xB7 T\xFAi C\xE0n Kh\xF4n thu nh\u1ECF ch\u1EE9a mu\xF4n v\xE0n b\u1EA3o v\u1EADt" }, "item.cuu_chuyen_kim_dan": { "name": "C\u1EEDu Chuy\u1EC3n Kim \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn \u0111an c\u1EEDu chuy\u1EC3n \u0111o\u1EA1t thi\xEAn \u0111\u1ECBa t\u1EA1o h\xF3a" }, "item.duong_than_dan": { "name": "D\u01B0\u1EE1ng Th\u1EA7n \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 B\u1EA3o \u0111an \u0111\u1EA1i b\u1ED5 nguy\xEAn th\u1EA7n & th\u1EA7n th\u1EE9c" }, "item.pha_hu_dan": { "name": "Ph\xE1 H\u01B0 \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Tuy\u1EC7t ph\u1EA9m \u0111an d\u01B0\u1EE3c xung k\xEDch c\u1EA3nh gi\u1EDBi cao" }, "item.tao_hoa_dan": { "name": "T\u1EA1o H\xF3a \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn \u0111an \u0111o\u1EA1t thi\xEAn \u0111\u1ECBa t\u1EA1o h\xF3a, t\xE1i t\u1EA1o c\u0103n c\u01A1" }, "item.thai_hu_dan": { "name": "Th\xE1i H\u01B0 \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 B\u1EA3o \u0111an \u0111\u1ED9t ph\xE1 b\xECnh c\u1EA3nh H\xF3a Th\u1EA7n" }, "item.van_tho_dan": { "name": "V\u1EA1n Th\u1ECD \u0110an", "quality": 7, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 7 \xB7 Ti\xEAn \u0111an gia t\u0103ng th\u1ECD nguy\xEAn d\u1ED3i d\xE0o" }, "item.dp_duong_than_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: D\u01B0\u1EE1ng Th\u1EA7n \u0110an", "quality": 7, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 7 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF D\u01B0\u1EE1ng Th\u1EA7n \u0110an" }, "item.dp_tao_hoa_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: T\u1EA1o H\xF3a \u0110an", "quality": 7, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 7 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF T\u1EA1o H\xF3a \u0110an" }, "item.dp_van_tho_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: V\u1EA1n Th\u1ECD \u0110an", "quality": 7, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 7 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF V\u1EA1n Th\u1ECD \u0110an" }, "item.bich_lac_kinh": { "name": "B\xEDch L\u1EA1c Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 B\xED \u0111i\u1EC3n th\u01B0\u1EE3ng gi\u1EDBi d\u1EABn linh kh\xED ch\xEDn t\u1EA7ng tr\u1EDDi" }, "item.chuong_tam_loi": { "name": "Ch\u01B0\u1EDFng T\xE2m L\xF4i", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 Th\u1EA7n th\xF4ng l\xF4i ph\xE1p ph\xE1t ra t\u1EEB l\xF2ng b\xE0n tay" }, "item.cuu_tieu_ngu_loi_quyet": { "name": "C\u1EEDu Ti\xEAu Ng\u1EF1 L\xF4i Quy\u1EBFt", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 B\xED quy\u1EBFt d\u1EABn l\xF4i c\u1EEDu ti\xEAu oanh k\xEDch thi\xEAn \u0111\u1ECBa" }, "item.dai_thanh_kim_cot": { "name": "\u0110\u1EA1i Th\xE0nh Kim C\u1ED1t", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 Ph\xE1p m\xF4n t\xF4i luy\u1EC7n kim c\u1ED1t \u0111\u1EA1i th\xE0nh b\u1EA5t ho\u1EA1i" }, "item.hoa_tho_dong_nguyen_kinh": { "name": "H\u1ECFa Th\u1ED5 \u0110\u1ED3ng Nguy\xEAn Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 C\xF4ng ph\xE1p song tu H\u1ECFa - Th\u1ED5 t\u01B0\u01A1ng sinh" }, "item.hon_nguyen_luyen_the_kinh": { "name": "H\u1ED7n Nguy\xEAn Luy\u1EC7n Th\u1EC3 Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 B\xED ph\xE1p luy\u1EC7n th\u1EC3 h\u1ED7n nguy\xEAn kim cang b\u1EA5t ho\u1EA1i" }, "item.kim_than_phap_tuong": { "name": "Kim Th\xE2n Ph\xE1p T\u01B0\u1EDBng", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 Hi\u1EC3n h\xF3a kim th\xE2n ph\xE1p t\u01B0\u1EDBng uy nghi\xEAm b\u1EA5t ho\u1EA1i" }, "item.liet_duong_kiem_dien": { "name": "Li\u1EC7t D\u01B0\u01A1ng Ki\u1EBFm \u0110i\u1EC3n", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 Ki\u1EBFm \u0111i\u1EC3n ch\xED d\u01B0\u01A1ng r\u1EF1c ch\xE1y nh\u01B0 m\u1EB7t tr\u1EDDi" }, "item.loi_am_phan_tam_kinh": { "name": "L\xF4i \xC2m Ph\u1EA7n T\xE2m Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 C\xF4ng ph\xE1p dung h\u1EE3p thi\xEAn l\xF4i v\xE0 t\xE2m h\u1ECFa" }, "item.loi_hoa_pha_ta_chuong": { "name": "L\xF4i H\u1ECFa Ph\xE1 T\xE0 Ch\u01B0\u1EDFng", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 Ch\u01B0\u1EDFng ph\xE1p s\u1EA5m l\u1EEDa kh\u1EAFc ch\u1EBF t\xE0 ma ngo\u1EA1i \u0111\u1EA1o" }, "item.quy_hai_kinh": { "name": "Quy H\u1EA3i Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 H\u1EA3i tri\u1EC1u v\u1EA1n l\u01B0u quy t\xF4ng, ch\xE2n nguy\xEAn m\xEAnh m\xF4ng" }, "item.thanh_nang_duoc_kinh": { "name": "Thanh Nang D\u01B0\u1EE3c Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 D\u01B0\u1EE3c kinh th\u01B0\u1EE3ng c\u1ED5 tinh th\xF4ng y \u0111\u1EA1o v\xE0 luy\u1EC7n \u0111an" }, "item.tran_nhac_dinh_hon_kinh": { "name": "Tr\u1EA5n Nh\u1EA1c \u0110\u1ECBnh H\u1ED3n Kinh", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 T\xE2m ph\xE1p tr\u1EA5n gi\u1EEF th\u1EA7n h\u1ED3n v\u1EEFng nh\u01B0 th\xE1i s\u01A1n" }, "item.van_thu_trieu_phong": { "name": "V\u1EA1n Th\xFA Tri\u1EC1u Phong", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 B\xED ph\xE1p ng\u1EF1 th\xFA v\u1EA1n linh b\xE1i ph\u1EE5c" }, "item.vinh_trieu_chuong": { "name": "V\u0129nh Tri\u1EC1u Ch\u01B0\u1EDFng", "quality": 6, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 6 \xB7 Ch\u01B0\u1EDFng ph\xE1p s\xF3ng th\u1EA7n d\xE2ng tr\xE0o b\u1EA5t tuy\u1EC7t" }, "item.niet_ban_hoa": { "name": "Ni\u1EBFt B\xE0n H\u1ECFa", "quality": 6, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 6 \xB7 D\u1ECB h\u1ECFa t\xE1i sinh t\u1EEB tro t\xE0n ni\u1EBFt b\xE0n" }, "item.niet_ban_phuong_hoa": { "name": "Ni\u1EBFt B\xE0n Ph\u01B0\u1EE3ng H\u1ECFa", "quality": 6, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 6 \xB7 Ng\u1ECDn l\u1EEDa b\u1EA5t t\u1EED c\u1EE7a Ph\u01B0\u1EE3ng Ho\xE0ng ni\u1EBFt b\xE0n" }, "item.thai_duong_chan_hoa": { "name": "Th\xE1i D\u01B0\u01A1ng Ch\xE2n H\u1ECFa", "quality": 6, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 6 \xB7 Ch\xE2n h\u1ECFa m\u1EB7t tr\u1EDDi ch\xED d\u01B0\u01A1ng ch\xED c\u01B0\u01A1ng" }, "item.bang_vuong_han_tuy": { "name": "B\u0103ng V\u01B0\u01A1ng H\xE0n T\u1EE7y", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 H\xE0n t\u1EE7y k\u1EBFt tinh c\u1EE7a B\u0103ng V\u01B0\u01A1ng c\u1EF1c b\u1EAFc" }, "item.bang_vuong_linh_vu": { "name": "B\u0103ng V\u01B0\u01A1ng Linh V\u0169", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 L\xF4ng v\u0169 b\u0103ng tinh c\u1EE7a B\u0103ng V\u01B0\u01A1ng" }, "item.canh_kim_tinh": { "name": "Canh Kim Tinh", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 Tinh hoa Canh Kim c\u1EF1c k\u1EF3 s\u1EAFc b\xE9n" }, "item.cuu_vi_ho_hon": { "name": "C\u1EEDu V\u0129 H\u1ED3 H\u1ED3n", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 Tinh h\u1ED3n c\u1EE7a C\u1EEDu V\u0129 Thi\xEAn H\u1ED3" }, "item.huyen_quan_tuy": { "name": "Huy\u1EC1n Qu\xE2n T\u1EE7y", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 B\u1EA3o t\u1EE7y ng\u01B0ng k\u1EBFt trong l\xF2ng \u0111\u1EA5t s\xE2u" }, "item.thien_chu_mau_ty": { "name": "Thi\xEAn Chu M\u1EABu Ty", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 T\u01A1 c\u1EE7a Thi\xEAn Chu M\u1EABu c\u1EE9ng b\u1EC1n kh\xF4ng th\u1EC3 ch\xE9m \u0111\u1EE9t" }, "item.thien_lang_hon_tinh": { "name": "Thi\xEAn Lang H\u1ED3n Tinh", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 H\u1ED3n tinh k\u1EBFt t\u1EE5 c\u1EE7a Thi\xEAn Lang Tinh Th\xFA" }, "item.thien_lang_nguyet_phach": { "name": "Thi\xEAn Lang Nguy\u1EC7t Ph\xE1ch", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 Nguy\u1EC7t ph\xE1ch tinh hoa c\u1EE7a Thi\xEAn Lang" }, "item.thien_ngoai_van_thiet": { "name": "Thi\xEAn Ngo\u1EA1i V\xE2n Thi\u1EBFt", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 Th\u1EA7n thi\u1EBFt r\u01A1i xu\u1ED1ng t\u1EEB ngo\xE0i ch\xEDn t\u1EA7ng tr\u1EDDi" }, "item.tien_hac_tho_cot": { "name": "Ti\xEAn H\u1EA1c Th\u1ECD C\u1ED1t", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 X\u01B0\u01A1ng linh h\u1EA1c ng\xE0n n\u0103m mang kh\xED t\u1EE9c tr\u01B0\u1EDDng th\u1ECD" }, "item.yeu_dan_5": { "name": "Ng\u0169 Giai Y\xEAu \u0110an", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 Y\xEAu \u0111an \u0111\u1EA1i y\xEAu th\xFA b\u1EADc 5 (H\xF3a Th\u1EA7n)" }, "item.yeu_vuong_noi_dan": { "name": "Y\xEAu V\u01B0\u01A1ng N\u1ED9i \u0110an", "quality": 6, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 6 \xB7 N\u1ED9i \u0111an k\u1EBFt tinh c\u1EA3 \u0111\u1EDDi c\u1EE7a \u0110\u1EA1i Y\xEAu V\u01B0\u01A1ng" }, "item.bang_tam_thanh_lien": { "name": "B\u0103ng T\xE2m Thanh Li\xEAn", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Sen xanh b\u0103ng t\xE2m thanh l\u1ECDc t\xE2m ma" }, "item.bich_trieu_linh_tao": { "name": "B\xEDch Tri\u1EC1u Linh T\u1EA3o", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh t\u1EA3o bi\u1EC3n s\xE2u ch\u1EE9a th\u1EE7y linh tinh thu\u1EA7n" }, "item.cuu_diep_kiem_thao": { "name": "C\u1EEDu Di\u1EC7p Ki\u1EBFm Th\u1EA3o", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh th\u1EA3o ch\xEDn l\xE1 s\u1EAFc b\xE9n nh\u01B0 ki\u1EBFm \xFD" }, "item.huyet_bo_de": { "name": "Huy\u1EBFt B\u1ED3 \u0110\u1EC1", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Tr\xE1i B\u1ED3 \u0110\u1EC1 th\u1EA5m m\xE1u th\xE1nh t\u0103ng, \u0111\u1EA1i b\u1ED5 c\u0103n c\u01A1" }, "item.kim_o_qua": { "name": "Kim \xD4 Qu\u1EA3", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh qu\u1EA3 \u1EA9n ch\u1EE9a th\xE1i d\u01B0\u01A1ng ch\xE2n h\u1ECFa" }, "item.long_tien_thao": { "name": "Long Ti\xEAn Th\u1EA3o", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh th\u1EA3o th\u1EA5m n\u01B0\u1EDBc b\u1ECDt ch\xE2n long" }, "item.phu_tang_than_moc": { "name": "Ph\xF9 Tang Th\u1EA7n M\u1ED9c", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Nh\xE1nh c\xE2y th\u1EA7n Ph\xF9 Tang n\u01A1i m\u1EB7t tr\u1EDDi m\u1ECDc" }, "item.thai_tue": { "name": "Th\xE1i Tu\u1EBF", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Nh\u1EE5c linh chi v\u1EA1n n\u0103m t\u0103ng \u0111\u1EA1i th\u1ECD nguy\xEAn v\xE0 kh\xED huy\u1EBFt" }, "item.that_khieu_linh_ngau": { "name": "Th\u1EA5t Khi\u1EBFu Linh Ng\u1EABu", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 C\u1EE7 sen linh b\u1EA3y l\u1ED7 t\xE1i t\u1EA1o nh\u1EE5c th\xE2n" }, "item.thien_loi_moc_tam": { "name": "Thi\xEAn L\xF4i M\u1ED9c T\xE2m", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 L\xF5i g\u1ED7 c\u1ED5 th\u1EE5 \u1EA9n ch\u1EE9a thi\xEAn l\xF4i chi l\u1EF1c" }, "item.thien_nguyen_qua": { "name": "Thi\xEAn Nguy\xEAn Qu\u1EA3", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh qu\u1EA3 \u0111\u1EA1i b\u1ED5 thi\xEAn nguy\xEAn linh l\u1EF1c" }, "item.uan_anh_thao": { "name": "U\u1EA9n Anh Th\u1EA3o", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 D\u01B0\u1EE3c th\u1EA3o qu\xFD luy\u1EC7n \u0111an d\u01B0\u1EE1ng Nguy\xEAn Anh" }, "item.van_vu_co_tra": { "name": "V\xE2n V\u1EE5 C\u1ED5 Tr\xE0", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 C\u1ED5 tr\xE0 tr\xEAn \u0111\u1EC9nh n\xFAi m\xE2y m\xF9 gi\xFAp t\u0129nh t\xE2m ng\u1ED9 \u0111\u1EA1o" }, "item.xich_long_qua": { "name": "X\xEDch Long Qu\u1EA3", "quality": 6, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh qu\u1EA3 \u0111\u1ECF r\u1EF1c mang huy\u1EBFt kh\xED h\u1ECFa long" }, "item.dan_lo_thien": { "name": "\u0110an L\xF4 Thi\xEAn", "quality": 6, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 6 \xB7 Thi\xEAn c\u1EA5p \u0111an l\xF4 t\u0103ng cao t\u1EF7 l\u1EC7 ra \u0111an th\u01B0\u1EE3ng ph\u1EA9m" }, "item.ngu_to_te_dinh": { "name": "Ng\u0169 T\u1ED5 T\u1EBF \u0110\u1EC9nh", "quality": 6, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 6 \xB7 C\u1ED5 \u0111\u1EC9nh t\u1EBF l\u1EC5 c\u1EE7a Ng\u0169 T\u1ED5 th\u01B0\u1EE3ng c\u1ED5" }, "item.phu_but_thien": { "name": "Ph\xF9 B\xFAt Thi\xEAn", "quality": 6, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 6 \xB7 Thi\xEAn c\u1EA5p ph\xF9 b\xFAt h\u1ECDa ph\xF9 ng\u01B0ng t\u1EE5 thi\xEAn \u0111\u1ECBa linh uy" }, "item.toan_nghe_lu": { "name": "Toan Ngh\xEA L\u01B0", "quality": 6, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 6 \xB7 B\u1EA3o l\u01B0 ch\u1EA1m kh\u1EAFc th\u1EA7n th\xFA Toan Ngh\xEA" }, "item.uan_dan_lo": { "name": "U\u1EA9n \u0110an L\xF4", "quality": 6, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 6 \xB7 L\xF2 luy\u1EC7n \u0111an cao c\u1EA5p gi\u1EEF tr\u1ECDn d\u01B0\u1EE3c l\u1EF1c" }, "item.ban_son_an": { "name": "B\xE0n S\u01A1n \u1EA4n", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Ph\xE1p \u1EA5n d\u1EDDi n\xFAi l\u1EA5p bi\u1EC3n, uy l\u1EF1c ng\xE0n c\xE2n" }, "item.bat_bao_kim_chung": { "name": "B\xE1t B\u1EA3o Kim Chung", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Chu\xF4ng v\xE0ng t\xE1m b\xE1u h\u1ED9 th\u1EC3 to\xE0n di\u1EC7n" }, "item.bo_de_niem_chau": { "name": "B\u1ED3 \u0110\u1EC1 Ni\u1EC7m Ch\xE2u", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Chu\u1ED7i h\u1EA1t B\u1ED3 \u0110\u1EC1 \u0111\u1ECBnh t\xE2m tr\u1EEB ma" }, "item.cuu_long_hoa_trao": { "name": "C\u1EEDu Long H\u1ECFa Tr\u1EA3o", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Ph\xE1p b\u1EA3o ch\xEDn r\u1ED3ng l\u1EEDa v\xE2y kh\u1ED1n k\u1EBB \u0111\u1ECBch" }, "item.den_dong_co": { "name": "\u0110\xE8n \u0110\u1ED3ng C\u1ED5", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 C\u1ED5 \u0111\u0103ng b\u1EB1ng \u0111\u1ED3ng xanh \u1EA9n ch\u1EE9a b\xED l\u1EF1c" }, "item.hat_vuong_doc_thich": { "name": "H\u1EA1t V\u01B0\u01A1ng \u0110\u1ED9c Th\xEDch", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Gai \u0111\u1ED9c H\u1EA1t V\u01B0\u01A1ng xuy\xEAn gi\xE1p k\u1ECBch \u0111\u1ED9c" }, "item.huyet_ha_phien": { "name": "Huy\u1EBFt H\xE0 Phi\xEAn", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Ma phi\xEAn tri\u1EC7u h\u1ED3i d\xF2ng s\xF4ng m\xE1u" }, "item.khon_tien_thang": { "name": "Kh\u1ED1n Ti\xEAn Th\u1EB1ng", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 D\xE2y th\u1EA7n tr\xF3i bu\u1ED9c c\u1EA3 th\u1EA7n ti\xEAn" }, "item.kim_thiem_bao_chau": { "name": "Kim Thi\u1EC1m B\u1EA3o Ch\xE2u", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 B\u1EA3o ch\xE2u Kim Thi\u1EC1m t\u1EE5 t\xE0i h\u1ED9 m\u1EA1ch" }, "item.lang_nguyet_cau": { "name": "L\u0103ng Nguy\u1EC7t C\xE2u", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Song c\xE2u \xE1nh tr\u0103ng l\u1EA1nh l\u1EBDo s\u1EAFc b\xE9n" }, "item.liet_duong_than_kich": { "name": "Li\u1EC7t D\u01B0\u01A1ng Th\u1EA7n K\xEDch", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Chi\u1EBFn k\xEDch r\u1EF1c l\u1EEDa m\u1EB7t tr\u1EDDi" }, "item.lieu_nguyen_phien": { "name": "Li\xEAu Nguy\xEAn Phi\xEAn", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Qu\u1EA1t th\u1EA7n th\u1ED5i b\xF9ng bi\u1EC3n l\u1EEDa \u0111\u1ED1t \u0111\u1ED3ng" }, "item.loi_dinh_lenh": { "name": "L\xF4i \u0110\xECnh L\u1EC7nh", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 L\u1EC7nh b\xE0i tri\u1EC7u g\u1ECDi c\u1EEDu thi\xEAn l\xF4i \u0111\xECnh" }, "item.nhiep_hon_linh": { "name": "Nhi\u1EBFp H\u1ED3n Linh", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Ph\xE1p linh rung \u0111\u1ED9ng l\xE0m m\xEA lo\u1EA1n nguy\xEAn th\u1EA7n" }, "item.phi_liem_phong_y": { "name": "Phi Li\xEAm Phong Y", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Ph\xE1p y th\u1EA7n th\xFA Phi Li\xEAm gia t\u0103ng t\u1ED1c \u0111\u1ED9 c\u1EF1c h\u1EA1n" }, "item.phong_luan_phi_hoan": { "name": "Phong Lu\xE2n Phi Ho\xE0n", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 V\xF2ng xoay gi\xF3 l\u1ED1c truy k\xEDch li\xEAn ho\xE0n" }, "item.quy_loi_co": { "name": "Qu\u1EF3 L\xF4i C\u1ED5", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Tr\u1ED1ng da Qu\u1EF3 Ng\u01B0u vang r\u1EC1n s\u1EA5m s\xE9t" }, "item.thai_am_bang_luan": { "name": "Th\xE1i \xC2m B\u0103ng Lu\xE2n", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 B\xE1nh xe b\u0103ng Th\xE1i \xC2m c\u1EAFt l\xECa v\u1EA1n v\u1EADt" }, "item.thanh_moc_tu_linh_chau": { "name": "Thanh M\u1ED9c T\u1EE5 Linh Ch\xE2u", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Linh ch\xE2u h\u1EC7 M\u1ED9c t\u1EE5 thi\xEAn \u0111\u1ECBa nguy\xEAn kh\xED" }, "item.thanh_tieu_loi_truong": { "name": "Thanh Ti\xEAu L\xF4i Tr\u01B0\u1EE3ng", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Ph\xE1p tr\u01B0\u1EE3ng d\u1EABn l\xF4i \u0111\xECnh Thanh Ti\xEAu" }, "item.van_doc_phien": { "name": "V\u1EA1n \u0110\u1ED9c Phi\xEAn", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED9c phi\xEAn h\u1ED9i t\u1EE5 v\u1EA1n ch\u1EE7ng k\u1EF3 \u0111\u1ED9c" }, "item.van_hon_chu": { "name": "V\u1EA1n H\u1ED3n Ch\xE2u", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Ma ch\xE2u giam c\u1EA7m h\xE0ng v\u1EA1n o\xE1n h\u1ED3n" }, "item.van_yeu_phien": { "name": "V\u1EA1n Y\xEAu Phi\xEAn", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 C\u1ED5 phi\xEAn tri\u1EC7u t\u1EADp v\u1EA1n y\xEAu tr\u1EE3 chi\u1EBFn" }, "item.xich_huy_tien": { "name": "X\xEDch Huy Ti\xEAn", "quality": 6, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 6 \xB7 Roi th\u1EA7n r\u1EF1c \xE1nh x\xEDch quang" }, "item.na_di_phu": { "name": "Na Di Ph\xF9", "quality": 6, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 6 \xB7 B\u1EA3o ph\xF9 d\u1ECBch chuy\u1EC3n kh\xF4ng gian t\u1EE9c th\u1EDDi" }, "item.con_bang_si": { "name": "C\xF4n B\u1EB1ng S\xED", "quality": 6, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Ph\u1EA9m 6 \xB7 \u0110\xF4i c\xE1nh C\xF4n B\u1EB1ng v\u01B0\u1EE3t bi\u1EC3n m\xE2y" }, "item.dong_thien_gioi": { "name": "\u0110\u1ED9ng Thi\xEAn Gi\u1EDBi", "quality": 6, "cat": "Tr\u1EEF V\u1EADt", "desc": "Ph\u1EA9m 6 \xB7 Nh\u1EABn tr\u1EEF v\u1EADt \u1EA9n ch\u1EE9a m\u1ED9t ph\u01B0\u01A1ng \u0111\u1ED9ng thi\xEAn" }, "item.due_kim_dan": { "name": "Du\u1EC7 Kim \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh \u0111an t\u0103ng c\u01B0\u1EDDng s\xE1t l\u1EF1c h\u1EC7 Kim" }, "item.duong_anh_dan": { "name": "D\u01B0\u1EE1ng Anh \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 \u0110an d\u01B0\u1EE3c b\u1ED3i b\u1ED5 Nguy\xEAn Anh tinh thu\u1EA7n" }, "item.hoa_anh_dan": { "name": "H\xF3a Anh \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh \u0111an tr\u1EE3 l\u1EF1c ph\xE1 \u0111an th\xE0nh Anh" }, "item.hoa_long_dan": { "name": "H\xF3a Long \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 B\u1EA3o \u0111an tho\xE1t thai ho\xE1n c\u1ED1t nh\u01B0 c\xE1 ch\xE9p h\xF3a r\u1ED3ng" }, "item.hoan_hon_dan": { "name": "Ho\xE0n H\u1ED3n \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 C\u1EE9u m\u1EA1ng ho\xE0n h\u1ED3n, ch\u1EEFa l\xE0nh n\u1ED9i th\u01B0\u01A1ng n\u1EB7ng" }, "item.hoi_thien_dan": { "name": "H\u1ED3i Thi\xEAn \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 B\u1EA3o \u0111an ngh\u1ECBch chuy\u1EC3n th\u01B0\u01A1ng th\u1EBF th\u1EADp t\u1EED nh\u1EA5t sinh" }, "item.huyen_anh_dan": { "name": "Huy\u1EC1n Anh \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 B\u1EA3o \u0111an tr\u1EE3 l\u1EF1c k\u1EBFt th\xE0nh Nguy\xEAn Anh" }, "item.loi_am_dan": { "name": "L\xF4i \xC2m \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 \u0110an d\u01B0\u1EE3c r\xE8n luy\u1EC7n th\u1EA7n h\u1ED3n b\u1EB1ng l\xF4i \xE2m" }, "item.thong_huyen_dan": { "name": "Th\xF4ng Huy\u1EC1n \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh \u0111an khai th\xF4ng huy\u1EC1n quan tu vi" }, "item.thong_than_dan": { "name": "Th\xF4ng Th\u1EA7n \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 \u0110an d\u01B0\u1EE3c khai m\u1EDF th\u1EA7n th\u1EE9c v\xE0 huy\u1EC1n quan" }, "item.van_tam_dan": { "name": "V\u1EA5n T\xE2m \u0110an", "quality": 6, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 6 \xB7 Linh \u0111an g\u1ED9t r\u1EEDa t\xE2m ma, c\u1EE7ng c\u1ED1 \u0111\u1EA1o t\xE2m" }, "item.dp_con_bang_si": { "name": "\u0110\u1ED3 Ph\u1ED5: C\xF4n B\u1EB1ng S\xED", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED3 ph\u1ED5 luy\u1EC7n ch\u1EBF C\xF4n B\u1EB1ng S\xED" }, "item.dp_cuu_vi_huyen_dang": { "name": "\u0110\u1ED3 Ph\u1ED5: C\u1EEDu V\u0129 Huy\u1EC1n \u0110\u0103ng", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED3 ph\u1ED5 ch\u1EBF t\xE1c C\u1EEDu V\u0129 Huy\u1EC1n \u0110\u0103ng" }, "item.dp_due_kim_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Du\u1EC7 Kim \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Du\u1EC7 Kim \u0110an" }, "item.dp_hoa_long_truong": { "name": "\u0110\u1ED3 Ph\u1ED5: H\u1ECFa Long Tr\u01B0\u1EE3ng", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED3 ph\u1ED5 luy\u1EC7n ch\u1EBF H\u1ECFa Long Tr\u01B0\u1EE3ng" }, "item.dp_hoi_thien_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: H\u1ED3i Thi\xEAn \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF H\u1ED3i Thi\xEAn \u0110an" }, "item.dp_huyet_ha_phien": { "name": "\u0110\u1ED3 Ph\u1ED5: Huy\u1EBFt H\xE0 Phi\xEAn", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED3 ph\u1ED5 luy\u1EC7n ch\u1EBF Huy\u1EBFt H\xE0 Phi\xEAn" }, "item.dp_kim_o_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Kim \xD4 \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Kim \xD4 \u0110an" }, "item.dp_lang_nguyet_cau": { "name": "\u0110\u1ED3 Ph\u1ED5: L\u0103ng Nguy\u1EC7t C\xE2u", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED3 ph\u1ED5 luy\u1EC7n ch\u1EBF L\u0103ng Nguy\u1EC7t C\xE2u" }, "item.dp_linh_lung_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Linh Lung \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Linh Lung \u0110an" }, "item.dp_linh_lung_thap_nha": { "name": "\u0110\u1ED3 Ph\u1ED5: Linh Lung Th\xE1p Nh\xE3", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED3 ph\u1ED5 ch\u1EBF t\xE1c b\u1EA3o th\xE1p Linh Lung" }, "item.dp_loi_am_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: L\xF4i \xC2m \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF L\xF4i \xC2m \u0110an" }, "item.dp_quy_loi_co": { "name": "\u0110\u1ED3 Ph\u1ED5: Qu\u1EF3 L\xF4i C\u1ED5", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED3 ph\u1ED5 ch\u1EBF t\xE1c Qu\u1EF3 L\xF4i C\u1ED5" }, "item.dp_thien_bang_cung": { "name": "\u0110\u1ED3 Ph\u1ED5: Thi\xEAn B\u0103ng Cung", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED3 ph\u1ED5 luy\u1EC7n ch\u1EBF Thi\xEAn B\u0103ng Cung" }, "item.dp_thien_loi_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Thi\xEAn L\xF4i \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Thi\xEAn L\xF4i \u0110an" }, "item.dp_thien_nhat_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Thi\xEAn Nh\u1EA5t \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Thi\xEAn Nh\u1EA5t \u0110an" }, "item.dp_thong_than_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Th\xF4ng Th\u1EA7n \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Th\xF4ng Th\u1EA7n \u0110an" }, "item.dp_thuong_long_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Th\u01B0\u01A1ng Long \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Th\u01B0\u01A1ng Long \u0110an" }, "item.dp_tran_hon_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Tr\u1EA5n H\u1ED3n \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Tr\u1EA5n H\u1ED3n \u0110an" }, "item.dp_van_quy_phien": { "name": "\u0110\u1ED3 Ph\u1ED5: V\u1EA1n Qu\u1EF7 Phi\xEAn", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 \u0110\u1ED3 ph\u1ED5 luy\u1EC7n ch\u1EBF V\u1EA1n Qu\u1EF7 Phi\xEAn" }, "item.dp_van_tam_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: V\u1EA5n T\xE2m \u0110an", "quality": 6, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 6 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF V\u1EA5n T\xE2m \u0110an" }, "item.ban_thach_ho_the": { "name": "B\xE0n Th\u1EA1ch H\u1ED9 Th\u1EC3", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 C\xF4ng ph\xE1p ph\xF2ng ng\u1EF1 v\u1EEFng ch\u1EAFc nh\u01B0 \u0111\xE1 t\u1EA3ng" }, "item.canh_kim_quyet": { "name": "Canh Kim Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ph\xE1p quy\u1EBFt ng\u01B0ng t\u1EE5 Canh Kim chi kh\xED c\xF4ng ph\u1EA1t" }, "item.chan_loi_quyet": { "name": "Ch\u1EA5n L\xF4i Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ph\xE1p quy\u1EBFt s\u1EA5m s\xE9t ch\u1EA5n nhi\u1EBFp qu\u1EA7n t\xE0" }, "item.cuu_chuyen_huyen_hoa_cong": { "name": "C\u1EEDu Chuy\u1EC3n Huy\u1EC1n H\u1ECFa C\xF4ng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 H\u1ECFa c\xF4ng c\u1EEDu chuy\u1EC3n tinh luy\u1EC7n ch\xE2n nguy\xEAn" }, "item.dia_hoa_on_lo_kinh": { "name": "\u0110\u1ECBa H\u1ECFa \xD4n L\xF4 Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 T\xE2m ph\xE1p kh\u1ED1ng ch\u1EBF \u0111\u1ECBa h\u1ECFa \xF4n d\u01B0\u1EE1ng \u0111an l\xF4" }, "item.dia_mach_tu_linh_kinh": { "name": "\u0110\u1ECBa M\u1EA1ch T\u1EE5 Linh Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 H\u1EA5p thu linh kh\xED t\u1EEB long m\u1EA1ch \u0111\u1EA1i \u0111\u1ECBa" }, "item.han_bang_chuong": { "name": "H\xE0n B\u0103ng Ch\u01B0\u1EDFng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ch\u01B0\u1EDFng ph\xE1p b\u0103ng h\xE0n \u0111\xF3ng b\u0103ng kinh m\u1EA1ch" }, "item.hau_tho_quyet": { "name": "H\u1EADu Th\u1ED5 Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 T\xE2m ph\xE1p h\u1EC7 Th\u1ED5 h\u1EADu tr\u1ECDng b\u1EC1n b\u1EC9" }, "item.hoa_huyet_dai_phap": { "name": "H\xF3a Huy\u1EBFt \u0110\u1EA1i Ph\xE1p", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ma c\xF4ng th\xF4n ph\u1EC7 tinh huy\u1EBFt h\xF3a th\xE0nh tu vi" }, "item.hoang_chung_nhiep_phach": { "name": "Ho\xE0ng Chung Nhi\u1EBFp Ph\xE1ch", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ti\u1EBFng chu\xF4ng ch\u1EA5n \u0111\u1ED9ng th\u1EA7n h\u1ED3n" }, "item.hoi_phong_chuong": { "name": "H\u1ED3i Phong Ch\u01B0\u1EDFng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ch\u01B0\u1EDFng ph\xE1p cu\u1ED3ng phong cu\u1ED1n ng\u01B0\u1EE3c s\xE1t th\u01B0\u01A1ng" }, "item.huyen_bang_tam_kinh": { "name": "Huy\u1EC1n B\u0103ng T\xE2m Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 T\xE2m ph\xE1p b\u0103ng h\xE0n h\u1ED9 t\xE2m \u0111\u1ECBnh c\u1EA3nh" }, "item.huyet_ma_nghich_mach": { "name": "Huy\u1EBFt Ma Ngh\u1ECBch M\u1EA1ch", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 B\xED thu\u1EADt k\xEDch ph\xE1t huy\u1EBFt m\u1EA1ch cu\u1ED3ng b\u1EA1o" }, "item.kho_moc_phung_xuan_quyet": { "name": "Kh\xF4 M\u1ED9c Ph\xF9ng Xu\xE2n Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 B\xED thu\u1EADt c\xE2y kh\xF4 g\u1EB7p m\xF9a xu\xE2n, h\u1ED3i ph\u1EE5c k\u1EF3 di\u1EC7u" }, "item.kim_cang_quyet": { "name": "Kim Cang Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ph\u1EADt m\xF4n h\u1ED9 th\u1EC3 kim cang quy\u1EBFt" }, "item.kim_cot_ngoc_tuy": { "name": "Kim C\u1ED1t Ng\u1ECDc T\u1EE7y", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ph\xE1p m\xF4n r\xE8n x\u01B0\u01A1ng v\xE0ng t\u1EE7y ng\u1ECDc" }, "item.liet_dia_quyen": { "name": "Li\u1EC7t \u0110\u1ECBa Quy\u1EC1n", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Quy\u1EC1n ph\xE1p ch\u1EA5n n\u1EE9t m\u1EB7t \u0111\u1EA5t" }, "item.liet_hoa_doan_cot": { "name": "Li\u1EC7t H\u1ECFa \u0110o\xE1n C\u1ED1t", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 B\xED ph\xE1p d\xF9ng li\u1EC7t h\u1ECFa t\xF4i luy\u1EC7n x\u01B0\u01A1ng c\u1ED1t" }, "item.luu_van_quyet": { "name": "L\u01B0u V\xE2n Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Th\xE2n ph\xE1p uy\u1EC3n chuy\u1EC3n bi\u1EBFn \u1EA3o nh\u01B0 m\xE2y tr\xF4i" }, "item.nhiep_hon_dai_phap": { "name": "Nhi\u1EBFp H\u1ED3n \u0110\u1EA1i Ph\xE1p", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Th\u1EA7n th\xF4ng nhi\u1EBFp ph\xE1ch \u0111o\u1EA1t h\u1ED3n \u0111\u1ED1i th\u1EE7" }, "item.phan_nhac_kiem_quyet": { "name": "Ph\xE2n Nh\u1EA1c Ki\u1EBFm Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ki\u1EBFm quy\u1EBFt ch\u1EBB n\xFAi\u65ADs\u01A1n uy l\u1EF1c tr\u1EA7m h\xF9ng" }, "item.quy_tuc_cong": { "name": "Quy T\u1EE9c C\xF4ng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 B\xED ph\xE1p thu li\u1EC5m h\u01A1i th\u1EDF gi\u1EA3 ch\u1EBFt tr\xE1nh h\u1ECDa" }, "item.sinh_sinh_bat_tuc": { "name": "Sinh Sinh B\u1EA5t T\u1EE9c", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 B\xED ph\xE1p tu\u1EA7n ho\xE0n linh l\u1EF1c sinh s\xF4i kh\xF4ng ng\u1EEBng" }, "item.suong_nhan_ngung_than_kinh": { "name": "S\u01B0\u01A1ng Nh\u1EABn Ng\u01B0ng Th\u1EA7n Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 H\xE0n s\u01B0\u01A1ng ng\u01B0ng t\u1EE5 th\u1EA7n th\u1EE9c s\u1EAFc b\xE9n" }, "item.tai_than_tu_van_kinh": { "name": "T\xE0i Th\u1EA7n T\u1EE5 V\xE2n Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 B\xED ph\xE1p t\u1EE5 t\xE0i n\u1EA1p ph\xFAc, gia t\u0103ng kh\xED v\u1EADn" }, "item.tam_kiem_quyet": { "name": "T\xE2m Ki\u1EBFm Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 L\u1EA5y t\xE2m ng\u1EF1 ki\u1EBFm, ki\u1EBFm \xFD v\xF4 h\xECnh" }, "item.tam_nguyen_quy_nhat_cong": { "name": "Tam Nguy\xEAn Quy Nh\u1EA5t C\xF4ng", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 H\u1EE3p tinh - kh\xED - th\u1EA7n quy nh\u1EA5t" }, "item.thu_thuy_kiem_quyet": { "name": "Thu Th\u1EE7y Ki\u1EBFm Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ki\u1EBFm quy\u1EBFt li\xEAn mi\xEAn trong s\xE1ng nh\u01B0 l\xE0n n\u01B0\u1EDBc m\xF9a thu" }, "item.thuy_moc_truong_thanh_kinh": { "name": "Th\u1EE7y M\u1ED9c Tr\u01B0\u1EDDng Thanh Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 C\xF4ng ph\xE1p Th\u1EE7y d\u01B0\u1EE1ng M\u1ED9c tr\u01B0\u1EDDng thanh b\u1EA5t suy" }, "item.trong_son_quyet": { "name": "Tr\u1ECDng S\u01A1n Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 Ph\xE1p quy\u1EBFt t\u1EA1o tr\u1ECDng \xE1p ng\xE0n c\xE2n nh\u01B0 n\xFAi \u0111\xE8" }, "item.van_duoc_tam_kinh": { "name": "V\u1EA1n D\u01B0\u1EE3c T\xE2m Kinh", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 T\xE2m kinh c\u1EA3m \u1EE9ng v\u1EA1n th\u1EA3o linh d\u01B0\u1EE3c" }, "item.van_moc_truong_sinh_quyet": { "name": "V\u1EA1n M\u1ED9c Tr\u01B0\u1EDDng Sinh Quy\u1EBFt", "quality": 5, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 5 \xB7 M\u1ED9c quy\u1EBFt h\u1EA5p thu sinh kh\xED r\u1EEBng gi\xE0" }, "item.cot_linh_lanh_hoa": { "name": "C\u1ED1t Linh L\xE3nh H\u1ECFa", "quality": 5, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 5 \xB7 L\u1EEDa l\u1EA1nh th\u1EA5u x\u01B0\u01A1ng sinh ra t\u1EEB c\u1EF1c \u0111\u1ECBa" }, "item.cuu_u_am_hoa": { "name": "C\u1EEDu U \xC2m H\u1ECFa", "quality": 5, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 5 \xB7 \xC2m h\u1ECFa t\u1EEB ch\xEDn t\u1EA7ng \u0111\u1ECBa ng\u1EE5c" }, "item.tam_muoi_chan_hoa": { "name": "Tam Mu\u1ED9i Ch\xE2n H\u1ECFa", "quality": 5, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 5 \xB7 Ch\xE2n h\u1ECFa \u0111\u1EA1o gia tinh luy\u1EC7n v\u1EA1n v\u1EADt" }, "item.tu_loi_hoa": { "name": "T\u1EED L\xF4i H\u1ECFa", "quality": 5, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 5 \xB7 Ng\u1ECDn l\u1EEDa mang s\u1EE9c m\u1EA1nh s\u1EA5m s\xE9t t\xEDm" }, "item.bang_vu": { "name": "B\u0103ng V\u0169", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 L\xF4ng v\u0169 y\xEAu c\u1EA7m h\u1EC7 B\u0103ng" }, "item.co_khoi_hach": { "name": "C\u1ED5 Kh\xF4i H\u1EA1ch", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 L\xF5i n\u0103ng l\u01B0\u1EE3ng c\u1EE7a kh\xF4i l\u1ED7i c\u1ED5 \u0111\u1EA1i" }, "item.co_khoi_tan_giap": { "name": "C\u1ED5 Kh\xF4i T\xE0n Gi\xE1p", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 M\u1EA3nh gi\xE1p v\u1EE1 c\u1EE7a chi\u1EBFn kh\xF4i th\u01B0\u1EE3ng c\u1ED5" }, "item.cu_tuong_nha": { "name": "C\u1EF1 T\u01B0\u1EE3ng Nha", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Ng\xE0 c\u1EE7a H\u1ED3ng Hoang C\u1EF1 T\u01B0\u1EE3ng" }, "item.cuu_tiet_hat_vi": { "name": "C\u1EEDu Ti\u1EBFt H\u1EA1t V\u0129", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 \u0110u\xF4i b\u1ECD c\u1EA1p ch\xEDn \u0111\u1ED1t k\u1ECBch \u0111\u1ED9c" }, "item.giao_han_can": { "name": "Giao H\xE0n C\xE2n", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 G\xE2n giao long b\u0103ng h\xE0n c\u1EF1c k\u1EF3 d\u1EBBo dai" }, "item.giao_long_giac": { "name": "Giao Long Gi\xE1c", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 S\u1EEBng Giao Long ch\u1EE9a th\u1EE7y l\xF4i l\u1EF1c" }, "item.giao_long_lan": { "name": "Giao Long L\xE2n", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 V\u1EA3y Giao Long c\u1EE9ng c\xE1p" }, "item.giao_nhan_le": { "name": "Giao Nh\xE2n L\u1EC7", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 N\u01B0\u1EDBc m\u1EAFt giao nh\xE2n h\xF3a th\xE0nh tr\xE2n ch\xE2u" }, "item.hoa_tinh_chau": { "name": "H\u1ECFa Tinh Ch\xE2u", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 H\u1EA1t ch\xE2u ng\u01B0ng t\u1EE5 tinh hoa l\u1EEDa" }, "item.hu_linh_phach": { "name": "H\u01B0 Linh Ph\xE1ch", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Linh ph\xE1ch h\u01B0 \u1EA3o c\u1EE7a \xE2m h\u1ED3n c\u1ED5 \u0111\u1EA1i" }, "item.huyen_chu_ty": { "name": "Huy\u1EC1n Chu Ty", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 T\u01A1 nh\u1EC7n huy\u1EC1n \xE2m b\u1EC1n ch\u1EAFc" }, "item.huyen_giap_cao": { "name": "Huy\u1EC1n Gi\xE1p Cao", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Cao luy\u1EC7n t\u1EEB mai r\xF9a huy\u1EC1n gi\xE1p" }, "item.huyet_anh_tinh": { "name": "Huy\u1EBFt Anh Tinh", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Tinh th\u1EC3 k\u1EBFt t\u1EEB o\xE1n huy\u1EBFt nguy\xEAn anh" }, "item.kim_boi_hung_bi": { "name": "Kim B\u1ED1i H\xF9ng B\xEC", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Da g\u1EA5u l\u01B0ng v\xE0ng ph\xF2ng ng\u1EF1 c\u1EF1c cao" }, "item.kim_tue_mach": { "name": "Kim Tu\u1EC7 M\u1EA1ch", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 M\u1EA1ch qu\u1EB7ng v\xE0ng linh kh\xED d\u1ED3i d\xE0o" }, "item.lang_vuong_cot": { "name": "Lang V\u01B0\u01A1ng C\u1ED1t", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 X\u01B0\u01A1ng c\u1ED1t c\u1EE7a Y\xEAu Lang V\u01B0\u01A1ng" }, "item.loi_linh_chau": { "name": "L\xF4i Linh Ch\xE2u", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 H\u1EA1t ch\xE2u ng\u01B0ng t\u1EE5 tinh hoa s\u1EA5m s\xE9t" }, "item.manh_ngoi_trung_chau": { "name": "M\u1EA3nh Ng\xF3i Trung Ch\xE2u", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Di v\u1EADt c\u1ED5 x\u01B0a t\u1EEB Trung Ch\xE2u b\u1ECB ch\xECm" }, "item.suong_phach_tinh": { "name": "S\u01B0\u01A1ng Ph\xE1ch Tinh", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Tinh th\u1EC3 b\u0103ng s\u01B0\u01A1ng k\u1EBFt t\u1EE5 ban \u0111\xEAm" }, "item.thi_khoi_hach": { "name": "Thi Kh\xF4i H\u1EA1ch", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 L\xF5i k\u1EBFt tinh trong c\u01A1 th\u1EC3 thi kh\xF4i" }, "item.thien_lang_nhan": { "name": "Thi\xEAn Lang Nh\xE3n", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Con m\u1EAFt c\u1EE7a y\xEAu th\xFA Thi\xEAn Lang" }, "item.tu_kim": { "name": "T\u1EED Kim", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Kim lo\u1EA1i t\xEDm qu\xFD hi\u1EBFm d\xF9ng \u0111\xFAc ki\u1EBFm" }, "item.tuyet_bang_cot": { "name": "Tuy\u1EBFt B\u0103ng C\u1ED1t", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 X\u01B0\u01A1ng b\u0103ng tuy\u1EBFt l\u1EA1nh th\u1EA5u tim" }, "item.van_ti_chu_nang": { "name": "V\u1EA1n T\u01A1 Chu Nang", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 T\xFAi t\u01A1 c\u1EE7a y\xEAu nh\u1EC7n ng\xE0n n\u0103m" }, "item.xuyen_bich_giac": { "name": "Xuy\xEAn B\xEDch Gi\xE1c", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 S\u1EEBng t\xEA xuy\xEAn th\u1EE7ng v\xE1ch \u0111\xE1" }, "item.yeu_dan_4": { "name": "T\u1EE9 Giai Y\xEAu \u0110an", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 Y\xEAu \u0111an y\xEAu th\xFA b\u1EADc 4 (Nguy\xEAn Anh)" }, "item.yeu_huyet_mac": { "name": "Y\xEAu Huy\u1EBFt M\u1EB7c", "quality": 5, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 5 \xB7 M\u1EF1c pha ch\u1EBF t\u1EEB tinh huy\u1EBFt \u0111\u1EA1i y\xEAu d\xF9ng v\u1EBD ph\xF9 cao c\u1EA5p" }, "item.bang_tuy_chi": { "name": "B\u0103ng T\u1EE7y Chi", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 N\u1EA5m linh chi m\u1ECDc tr\xEAn b\u0103ng t\u1EE7y" }, "item.cuu_khuc_hoang_tinh": { "name": "C\u1EEDu Kh\xFAc Ho\xE0ng Tinh", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Ho\xE0ng tinh ch\xEDn kh\xFAc b\u1ED3i b\u1ED5 c\u0103n c\u1ED1t" }, "item.cuu_tiet_truc_tien": { "name": "C\u1EEDu Ti\u1EBFt Tr\xFAc Ti\xEAn", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Tr\xFAc ti\xEAn ch\xEDn \u0111\u1ED1t thanh l\u1ECDc t\xE2m th\u1EA7n" }, "item.cuu_tue_linh_dao": { "name": "C\u1EEDu Tu\u1EC7 Linh \u0110\u1EA1o", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 L\xFAa linh ch\xEDn b\xF4ng k\u1EBFt h\u1EA1t ng\u1ECDc" }, "item.han_nguyet_que": { "name": "H\xE0n Nguy\u1EC7t Qu\u1EBF", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Nh\xE1nh qu\u1EBF cung tr\u0103ng ng\u01B0ng t\u1EE5 h\xE0n kh\xED" }, "item.hoa_long_thao": { "name": "H\xF3a Long Th\u1EA3o", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Linh th\u1EA3o mang long kh\xED d\xF9ng luy\u1EC7n H\xF3a Long \u0110an" }, "item.huyet_linh_chi": { "name": "Huy\u1EBFt Linh Chi", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 N\u1EA5m linh chi \u0111\u1ECF th\u1EABm \u0111\u1EA1i b\u1ED5 huy\u1EBFt kh\xED" }, "item.long_tu_thao": { "name": "Long Tu Th\u1EA3o", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 C\u1ECF r\xE2u r\u1ED3ng qu\xFD hi\u1EBFm n\u01A1i th\xE2m s\u01A1n" }, "item.mach_hoa_thao": { "name": "M\u1EA1ch H\u1ECFa Th\u1EA3o", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Linh th\u1EA3o m\u1ECDc c\u1EA1nh m\u1EA1ch \u0111\u1ECBa h\u1ECFa" }, "item.mang_hon_chi": { "name": "M\xE3ng H\u1ED3n Chi", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Linh chi h\u1EA5p thu tinh h\u1ED3n c\u1EF1 m\xE3ng" }, "item.ngo_dong_chi": { "name": "Ng\xF4 \u0110\u1ED3ng Chi", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 C\xE0nh c\xE2y Ng\xF4 \u0110\u1ED3ng n\u01A1i ph\u01B0\u1EE3ng ho\xE0ng \u0111\u1EADu" }, "item.thuy_tien_can": { "name": "Th\u1EE7y Ti\xEAn C\u0103n", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 R\u1EC5 c\xE2y th\u1EE7y ti\xEAn ng\xE0n n\u0103m ch\u1EE9a th\u1EE7y linh kh\xED" }, "item.tram_huong": { "name": "Tr\u1EA7m H\u01B0\u01A1ng", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 G\u1ED7 tr\u1EA7m h\u01B0\u01A1ng linh m\u1ED9c \u0111\u1ECBnh t\xE2m an th\u1EA7n" }, "item.tu_van_linh_chi": { "name": "T\u1EED V\xE2n Linh Chi", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 N\u1EA5m linh chi m\xE2y t\xEDm ng\xE0n n\u0103m" }, "item.u_minh_lan": { "name": "U Minh Lan", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Hoa lan n\u1EDF n\u01A1i u minh \xE2m kh\xED" }, "item.van_nien_tung_chi": { "name": "V\u1EA1n Ni\xEAn T\xF9ng Chi", "quality": 5, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Nh\u1EF1a th\xF4ng v\u1EA1n n\u0103m k\u1EBFt tinh th\xE0nh h\u1ED5 ph\xE1ch" }, "item.dan_lo_huyen": { "name": "\u0110an L\xF4 Huy\u1EC1n", "quality": 5, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 5 \xB7 Huy\u1EC1n c\u1EA5p \u0111an l\xF4 \u1ED5n \u0111\u1ECBnh h\u1ECFa h\u1EA7u" }, "item.dia_sat_dinh": { "name": "\u0110\u1ECBa S\xE1t \u0110\u1EC9nh", "quality": 5, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 5 \xB7 B\u1EA3o \u0111\u1EC9nh d\u1EABn \u0111\u1ECBa s\xE1t chi kh\xED luy\u1EC7n b\u1EA3o" }, "item.khi_lo_huyen": { "name": "Kh\xED L\xF4 Huy\u1EC1n", "quality": 5, "cat": "L\xF2 \u0110\u1EC9nh & D\u1EE5ng C\u1EE5", "desc": "Ph\u1EA9m 5 \xB7 Huy\u1EC1n c\u1EA5p kh\xED l\xF4 nung ch\u1EA3y kim thi\u1EBFt b\u1EADc cao" }, "item.bac_minh_han_thuong": { "name": "B\u1EAFc Minh H\xE0n Th\u01B0\u01A1ng", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Tr\u01B0\u1EDDng th\u01B0\u01A1ng h\xE0n b\u0103ng B\u1EAFc Minh" }, "item.bang_phach_chau": { "name": "B\u0103ng Ph\xE1ch Ch\xE2u", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 B\u1EA3o ch\xE2u t\u1ECFa h\xE0n kh\xED b\u0103ng ph\xE1ch" }, "item.bich_ba_linh_tan": { "name": "B\xEDch Ba Linh T\xE1n", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 D\xF9 b\xEDch ba che ch\u1EAFn v\u1EA1n ph\xE1p" }, "item.bich_lan_doc_cham": { "name": "B\xEDch L\xE2n \u0110\u1ED9c Ch\xE2m", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Kim \u0111\u1ED9c B\xEDch L\xE2n v\xF4 \u1EA3nh v\xF4 h\xECnh" }, "item.cuu_tieu_bang_kiem": { "name": "C\u1EEDu Ti\xEAu B\u0103ng Ki\u1EBFm", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 H\xE0n ki\u1EBFm l\u1EA1nh th\u1EA5u ch\xEDn t\u1EA7ng m\xE2y" }, "item.dia_mach_linh_chau": { "name": "\u0110\u1ECBa M\u1EA1ch Linh Ch\xE2u", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Linh ch\xE2u k\u1EBFt t\u1EE5 t\u1EEB m\u1EA1ch \u0111\u1EA5t" }, "item.giao_chau_lien": { "name": "Giao Ch\xE2u Li\xEAn", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Chu\u1ED7i v\xF2ng k\u1EBFt t\u1EEB minh ch\xE2u d\u01B0\u1EDBi bi\u1EC3n" }, "item.giao_lan_giap": { "name": "Giao L\xE2n Gi\xE1p", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 B\u1EA3o gi\xE1p \u0111\xFAc t\u1EEB v\u1EA3y giao long" }, "item.giao_le_chau_lien": { "name": "Giao L\u1EC7 Ch\xE2u Li\xEAn", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 D\xE2y chuy\u1EC1n ng\u1ECDc trai n\u01B0\u1EDBc m\u1EAFt giao nh\xE2n" }, "item.han_suong_toa": { "name": "H\xE0n S\u01B0\u01A1ng T\u1ECFa", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Xi\u1EC1ng x\xEDch b\u0103ng s\u01B0\u01A1ng phong t\u1ECFa th\xE2n h\xECnh" }, "item.hau_tho_thuan": { "name": "H\u1EADu Th\u1ED5 Thu\u1EABn", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Khi\xEAn \u0111\u1EA5t d\xE0y n\u1EB7ng v\u1EEFng ch\xE3i" }, "item.ho_cot_dao": { "name": "H\u1ED5 C\u1ED1t \u0110ao", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Chi\u1EBFn \u0111ao r\xE8n t\u1EEB x\u01B0\u01A1ng m\xE3nh h\u1ED5 y\xEAu th\xFA" }, "item.ho_tam_noi_giap": { "name": "H\u1ED9 T\xE2m N\u1ED9i Gi\xE1p", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 N\u1ED9i gi\xE1p h\u1ED9 v\u1EC7 t\xE2m m\u1EA1ch kh\u1ECFi \u0111\xF2n ch\xED m\u1EA1ng" }, "item.hoa_van_chuong": { "name": "H\u1ECFa V\xE2n Ch\u01B0\u01A1ng", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 \u1EA4n ch\u01B0\u01A1ng t\u1EE5 m\xE2y l\u1EEDa c\xF4ng k\xEDch" }, "item.huyet_anh_dao": { "name": "Huy\u1EBFt \u1EA2nh \u0110ao", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Ma \u0111ao ch\xE9m ra b\xF3ng m\xE1u v\xF4 h\xECnh" }, "item.huyet_hon_linh": { "name": "Huy\u1EBFt H\u1ED3n Linh", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Chu\xF4ng m\xE1u nhi\u1EBFp lo\u1EA1n t\xE2m th\u1EA7n" }, "item.kim_giao_tien": { "name": "Kim Giao\u526A (Kim Giao Ti\u1EC5n)", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 K\xE9o v\xE0ng h\xF3a \u0111\xF4i giao long c\u1EAFt \u0111\u1EE9t ph\xE1p b\u1EA3o" }, "item.kim_mach_dao": { "name": "Kim M\u1EA1ch \u0110ao", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 B\u1EA3o \u0111ao ch\xE9m \u0111\u1EE9t kinh m\u1EA1ch" }, "item.lien_co_no": { "name": "Li\xEAn C\u01A1 N\u1ECF", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 N\u1ECF th\u1EA7n b\u1EAFn t\xEAn li\xEAn ho\xE0n" }, "item.liet_ho_dao": { "name": "Li\u1EC7t H\u1ED5 \u0110ao", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Chi\u1EBFn \u0111ao m\xE3nh h\u1ED5 v\u1ED3 m\u1ED3i" }, "item.liet_ho_kim_trao": { "name": "Li\u1EC7t H\u1ED5 Kim Tr\u1EA3o", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Tr\u1EA3o v\xE0ng x\xE9 x\xE1c nh\u01B0 m\xE3nh h\u1ED5" }, "item.ly_hoa_hoan_dao": { "name": "Ly H\u1ECFa Ho\xE0n \u0110ao", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 \u0110ao v\xF2ng r\u1EF1c l\u1EEDa Ly H\u1ECFa" }, "item.man_hoang_cot_mau": { "name": "Man Hoang C\u1ED1t M\xE2u", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Chi\u1EBFn m\xE2u b\u1EB1ng x\u01B0\u01A1ng c\u1EF1 th\xFA Man Hoang" }, "item.ngoc_lo_binh": { "name": "Ng\u1ECDc L\u1ED9 B\xECnh", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 B\xECnh ng\u1ECDc ch\u1EE9a linh l\u1ED9 h\u1ED3i ph\u1EE5c" }, "item.nhat_luan_hoa": { "name": "Nh\u1EADt Lu\xE2n Hoa", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Ph\xE1p b\u1EA3o h\xECnh b\xE1nh xe m\u1EB7t tr\u1EDDi" }, "item.pha_giap_toan": { "name": "Ph\xE1 Gi\xE1p Toan", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 M\u0169i khoan ph\xE1p kh\xED xuy\xEAn th\u1EE7ng h\u1ED9 gi\xE1p" }, "item.phan_thuy_thich": { "name": "Ph\xE2n Th\u1EE7y Th\xEDch", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 \u0110inh ba r\u1EBD n\u01B0\u1EDBc \u0111\xE1nh l\xE9n hi\u1EC3m h\xF3c" }, "item.phi_cuong_trao": { "name": "Phi C\u01B0\u01A1ng Tr\u1EA3o", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 M\xF3ng vu\u1ED1t Phi C\u01B0\u01A1ng s\u1EAFc b\xE9n k\u1ECBch \u0111\u1ED9c" }, "item.phuoc_tien_tac": { "name": "Ph\u01B0\u1EE3c Ti\xEAn T\xE1c", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 D\xE2y th\u1EEBng ph\xE1p b\u1EA3o tr\xF3i bu\u1ED9c linh l\u1EF1c" }, "item.te_giap_phien": { "name": "T\xEA Gi\xE1p Phi\xEAn", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Ph\xE1p b\u1EA3o ph\xF2ng ng\u1EF1 l\xE0m t\u1EEB gi\xE1p t\xEA ng\u01B0u" }, "item.thanh_moc_thuan": { "name": "Thanh M\u1ED9c Thu\u1EABn", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 L\xE1 ch\u1EAFn thanh m\u1ED9c t\u1EF1 h\u1ED3i ph\u1EE5c b\u1EC1n b\u1EC9" }, "item.thau_cot_cham": { "name": "Th\u1EA5u C\u1ED1t Ch\xE2m", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 \xC1m kh\xED kim ch\xE2m xuy\xEAn th\u1EA5u t\u1EADn x\u01B0\u01A1ng t\u1EE7y" }, "item.thiet_huyet_tan": { "name": "Thi\u1EBFt Huy\u1EBFt T\xE1n", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Chi\u1EBFc \xF4 s\u1EAFt nhu\u1ED1m m\xE1u c\xF4ng th\u1EE7 to\xE0n di\u1EC7n" }, "item.thuong_lan_kiem": { "name": "Th\u01B0\u01A1ng Lan Ki\u1EBFm", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 B\u1EA3o ki\u1EBFm s\xF3ng bi\u1EBFc Th\u01B0\u01A1ng Lan" }, "item.toa_long_thu": { "name": "T\u1ECFa Long Th\xF9", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 C\u1ED9t tr\u1EE5 tr\u1EA5n \xE1p long m\u1EA1ch" }, "item.tu_dien_thoa": { "name": "T\u1EED \u0110i\u1EC7n Thoa", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Tr\xE2m c\xE0i ph\xE1t ra tia ch\u1EDBp t\xEDm" }, "item.tu_kim_phi_kiem": { "name": "T\u1EED Kim Phi Ki\u1EBFm", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 Phi ki\u1EBFm \u0111\xFAc t\u1EEB T\u1EED Kim th\u01B0\u1EE3ng h\u1EA1ng" }, "item.xich_diem_ho_lo": { "name": "X\xEDch Di\u1EC5m H\u1ED3 L\xF4", "quality": 5, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 5 \xB7 H\u1ED3 l\xF4 phun l\u1EEDa x\xEDch di\u1EC5m thi\xEAu \u0111\u1ED1t" }, "item.bat_dong_phu": { "name": "B\u1EA5t \u0110\u1ED9ng Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 5 \xB7 Linh ph\xF9 ph\xF2ng ng\u1EF1 v\u1EEFng nh\u01B0 B\u1EA5t \u0110\u1ED9ng Minh V\u01B0\u01A1ng" }, "item.kim_lan_doc_phu": { "name": "Kim L\xE2n \u0110\u1ED9c Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 5 \xB7 Ph\xF9 l\u1EE5c ph\xE1t t\xE1n \u0111\u1ED9c kh\xED kim l\xE2n" }, "item.kim_thiem_phu": { "name": "Kim Thi\u1EC1m Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 5 \xB7 Linh ph\xF9 Kim Thi\u1EC1m chi\xEAu t\xE0i h\u1ED9 th\xE2n" }, "item.pha_quan_phu": { "name": "Ph\xE1 Qu\xE2n Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 5 \xB7 Chi\u1EBFn ph\xF9 ph\xE1 v\u1EE1 tr\u1EADn h\xECnh k\u1EBB \u0111\u1ECBch" }, "item.quy_tuc_phu": { "name": "Quy T\u1EE9c Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 5 \xB7 B\xED ph\xF9 \u1EA9n gi\u1EA5u to\xE0n b\u1ED9 kh\xED t\u1EE9c tu vi" }, "item.thien_loi_phu": { "name": "Thi\xEAn L\xF4i Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 5 \xB7 Linh ph\xF9 gi\xE1ng thi\xEAn l\xF4i uy l\u1EF1c l\u1EDBn" }, "item.tran_quy_phu": { "name": "Tr\u1EA5n Qu\u1EF7 Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 5 \xB7 Linh ph\xF9 tr\u1EA5n \xE1p t\xE0 ma qu\u1EF7 v\u1EADt" }, "item.tu_tieu_loi_phu": { "name": "T\u1EED Ti\xEAu L\xF4i Ph\xF9", "quality": 5, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 5 \xB7 Ph\xF9 l\u1EE5c tri\u1EC7u h\u1ED3i th\u1EA7n l\xF4i T\u1EED Ti\xEAu" }, "item.kim_bang_si": { "name": "Kim B\u1EB1ng S\xED", "quality": 5, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Ph\u1EA9m 5 \xB7 C\xE1nh Kim S\xED \u0110\u1EA1i B\u1EB1ng t\u1ED1c \u0111\u1ED9 c\u1EF1c nhanh" }, "item.tu_di_gioi": { "name": "Tu Di Gi\u1EDBi", "quality": 5, "cat": "Tr\u1EEF V\u1EADt", "desc": "Ph\u1EA9m 5 \xB7 Nh\u1EABn tr\u1EEF v\u1EADt gi\u1EDBi t\u1EED tu di" }, "item.bach_giai_dan": { "name": "B\xE1ch Gi\u1EA3i \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Linh \u0111an h\xF3a gi\u1EA3i tr\u0103m lo\u1EA1i k\u1EF3 \u0111\u1ED9c" }, "item.boi_nguyen_dan": { "name": "B\u1ED3i Nguy\xEAn \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110an d\u01B0\u1EE3c c\u1ED1 b\u1EA3n b\u1ED3i nguy\xEAn, t\u0103ng ti\u1EBFn tu vi" }, "item.co_co_dan": { "name": "C\u1ED1 C\u01A1 \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110an d\u01B0\u1EE3c c\u1EE7ng c\u1ED1 \u0111\u1EA1o c\u01A1 v\u1EEFng ch\u1EAFc" }, "item.dinh_than_dan": { "name": "\u0110\u1ECBnh Th\u1EA7n \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110an d\u01B0\u1EE3c \u1ED5n \u0111\u1ECBnh th\u1EE9c h\u1EA3i, ch\u1ED1ng t\xE2m ma" }, "item.duyen_tho_dan": { "name": "Duy\xEAn Th\u1ECD \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 Linh \u0111an k\xE9o d\xE0i tu\u1ED5i th\u1ECD cho tu s\u0129" }, "item.kim_lo_dan": { "name": "Kim L\u1ED9 \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110an d\u01B0\u1EE3c luy\u1EC7n t\u1EEB kim l\u1ED9 gi\xFAp h\u1ED3i ph\u1EE5c nhanh" }, "item.long_ho_dan": { "name": "Long H\u1ED5 \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110\u1EA1i \u0111an t\u0103ng c\u01B0\u1EDDng kh\xED huy\u1EBFt nh\u01B0 long tinh h\u1ED5 m\xE3nh" }, "item.luyen_cot_dan": { "name": "Luy\u1EC7n C\u1ED1t \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110an d\u01B0\u1EE3c c\u01B0\u1EDDng h\xF3a c\u0103n c\u1ED1t th\u1EC3 ph\xE1ch" }, "item.ngung_nguyen_dan": { "name": "Ng\u01B0ng Nguy\xEAn \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110an d\u01B0\u1EE3c ng\u01B0ng t\u1EE5 ch\xE2n nguy\xEAn K\u1EBFt \u0110an" }, "item.pha_chuong_dan": { "name": "Ph\xE1 Ch\u01B0\u1EDBng \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110an d\u01B0\u1EE3c ph\xE1 v\u1EE1 b\xECnh c\u1EA3nh tu luy\u1EC7n" }, "item.thanh_vu_dan": { "name": "Thanh V\u0169 \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110an d\u01B0\u1EE3c gi\xFAp th\xE2n th\u1EC3 nh\u1EB9 nh\xE0ng, t\u0103ng t\u1ED1c \u0111\u1ED9" }, "item.tinh_nguyen_dan": { "name": "T\u1ECBnh Nguy\xEAn \u0110an", "quality": 5, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 5 \xB7 \u0110an d\u01B0\u1EE3c thanh l\u1ECDc t\u1EA1p ch\u1EA5t trong linh l\u1EF1c" }, "item.dp_bat_dong_phu": { "name": "Ph\xF9 Ph\u01B0\u01A1ng: B\u1EA5t \u0110\u1ED9ng Ph\xF9", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 C\xF4ng th\u1EE9c ch\u1EBF t\xE1c B\u1EA5t \u0110\u1ED9ng Ph\xF9" }, "item.dp_giao_le_chau_lien": { "name": "\u0110\u1ED3 Ph\u1ED5: Giao L\u1EC7 Ch\xE2u Li\xEAn", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 \u0110\u1ED3 ph\u1ED5 ch\u1EBF t\xE1c Giao L\u1EC7 Ch\xE2u Li\xEAn" }, "item.dp_han_tuy_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: H\xE0n T\u1EE7y \u0110an", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF H\xE0n T\u1EE7y \u0110an" }, "item.dp_hat_vi_tien": { "name": "\u0110\u1ED3 Ph\u1ED5: H\u1EA1t V\u0129 Ti\xEAn", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 \u0110\u1ED3 ph\u1ED5 luy\u1EC7n ch\u1EBF H\u1EA1t V\u0129 Ti\xEAn" }, "item.dp_kim_lan_doc_phu": { "name": "Ph\xF9 Ph\u01B0\u01A1ng: Kim L\xE2n \u0110\u1ED9c Ph\xF9", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 C\xF4ng th\u1EE9c v\u1EBD Kim L\xE2n \u0110\u1ED9c Ph\xF9" }, "item.dp_kim_thiem_phu": { "name": "Ph\xF9 Ph\u01B0\u01A1ng: Kim Thi\u1EC1m Ph\xF9", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 C\xF4ng th\u1EE9c v\u1EBD Kim Thi\u1EC1m Ph\xF9" }, "item.dp_luyen_cot_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Luy\u1EC7n C\u1ED1t \u0110an", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Luy\u1EC7n C\u1ED1t \u0110an" }, "item.dp_phi_cuong_trao": { "name": "\u0110\u1ED3 Ph\u1ED5: Phi C\u01B0\u01A1ng Tr\u1EA3o", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 \u0110\u1ED3 ph\u1ED5 luy\u1EC7n ch\u1EBF Phi C\u01B0\u01A1ng Tr\u1EA3o" }, "item.dp_tran_quy_phu": { "name": "Ph\xF9 Ph\u01B0\u01A1ng: Tr\u1EA5n Qu\u1EF7 Ph\xF9", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 C\xF4ng th\u1EE9c v\u1EBD Tr\u1EA5n Qu\u1EF7 Ph\xF9" }, "item.dp_truong_xuan_dan": { "name": "\u0110an Ph\u01B0\u01A1ng: Tr\u01B0\u1EDDng Xu\xE2n \u0110an", "quality": 5, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 5 \xB7 Ph\u01B0\u01A1ng thu\u1ED1c luy\u1EC7n ch\u1EBF Tr\u01B0\u1EDDng Xu\xE2n \u0110an" }, "item.huyet_trao_cong": { "name": "Huy\u1EBFt Tr\u1EA3o C\xF4ng", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 4 \xB7 Tr\u1EA3o ph\xE1p s\u1EAFc b\xE9n nhu\u1ED1m m\xE1u" }, "item.lang_phong_quyet": { "name": "L\u0103ng Phong Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 4 \xB7 Th\xE2n ph\xE1p c\u01B0\u1EE1i gi\xF3 nh\u1EB9 nh\xE0ng" }, "item.thanh_loi_quyet": { "name": "Thanh L\xF4i Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 4 \xB7 L\xF4i quy\u1EBFt nh\u1EADp m\xF4n thanh ch\xEDnh" }, "item.thanh_van_kiem_quyet": { "name": "Thanh V\xE2n Ki\u1EBFm Quy\u1EBFt", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 4 \xB7 Ki\u1EBFm quy\u1EBFt ch\xEDnh th\u1ED1ng Thanh V\xE2n M\xF4n" }, "item.thiet_bo_sam": { "name": "Thi\u1EBFt B\u1ED1 Sam", "quality": 4, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 4 \xB7 Ngo\u1EA1i c\xF4ng luy\u1EC7n da th\u1ECBt c\u1EE9ng nh\u01B0 s\u1EAFt" }, "item.loi_sa_hoa": { "name": "L\xF4i Sa H\u1ECFa", "quality": 4, "cat": "D\u1ECB H\u1ECFa", "desc": "Ph\u1EA9m 4 \xB7 Linh h\u1ECFa c\xE1t s\u1EA5m n\u01A1i sa m\u1EA1c" }, "item.cuong_thi_nha": { "name": "C\u01B0\u01A1ng Thi Nha", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 R\u0103ng nanh c\u01B0\u01A1ng thi ch\u1EE9a thi \u0111\u1ED9c" }, "item.dong_khoi_hach": { "name": "\u0110\u1ED3ng Kh\xF4i H\u1EA1ch", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 L\xF5i c\u1EE7a kh\xF4i l\u1ED7i \u0111\u1ED3ng" }, "item.hac_cot": { "name": "H\u1EA1c C\u1ED1t", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 X\u01B0\u01A1ng linh h\u1EA1c nh\u1EB9 v\xE0 c\u1EE9ng" }, "item.hac_vu": { "name": "H\u1EA1c V\u0169", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 L\xF4ng v\u0169 linh h\u1EA1c d\xF9ng luy\u1EC7n phi h\xE0nh ph\xE1p kh\xED" }, "item.hat_giap": { "name": "H\u1EA1t Gi\xE1p", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 V\u1ECF gi\xE1p c\u1EE9ng c\u1EE7a y\xEAu b\u1ECD c\u1EA1p" }, "item.ho_vi": { "name": "H\u1ED3 V\u0129", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 \u0110u\xF4i h\u1ED3 ly ch\u1EE9a y\xEAu l\u1EF1c" }, "item.hung_dam": { "name": "H\xF9ng \u0110\u1EA3m", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 M\u1EADt g\u1EA5u y\xEAu th\xFA \u0111\u1EA1i b\u1ED5 kh\xED l\u1EF1c" }, "item.huy_lan": { "name": "H\u1EE7y L\xE2n", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 V\u1EA3y r\u1EAFn \u0111\u1ED9c H\u1EE7y X\xE0" }, "item.ngac_giap": { "name": "Ng\u1EA1c Gi\xE1p", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 Da gi\xE1p c\xE1 s\u1EA5u \u0111\u1EA7m l\u1EA7y" }, "item.ngo_cong_doc_nang": { "name": "Ng\xF4 C\xF4ng \u0110\u1ED9c Nang", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 T\xFAi \u0111\u1ED9c c\u1EE7a y\xEAu r\u1EBFt ng\xE0n ch\xE2n" }, "item.sa_trung_tam": { "name": "Sa Tr\xF9ng T\xE2m", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 Tim s\xE2u c\xE1t sa m\u1EA1c" }, "item.thanh_van_kiem_phoi": { "name": "Thanh V\xE2n Ki\u1EBFm Ph\xF4i", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 Ph\xF4i ki\u1EBFm c\u1ED5 d\xF9ng r\xE8n ph\xE1p ki\u1EBFm" }, "item.thiem_to": { "name": "Thi\u1EC1m T\xF4", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 Nh\u1EF1a c\xF3c \u0111\u1ED9c qu\xFD d\xF9ng trong luy\u1EC7n \u0111an" }, "item.yeu_dan_3": { "name": "Tam Giai Y\xEAu \u0110an", "quality": 4, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 4 \xB7 Y\xEAu \u0111an y\xEAu th\xFA b\u1EADc 3 (K\u1EBFt \u0110an)" }, "item.co_moc_tam": { "name": "C\u1ED5 M\u1ED9c T\xE2m", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 Tr\xE1i tim c\xE2y c\u1ED5 th\u1EE5 ng\xE0n n\u0103m" }, "item.han_ngoc_sam": { "name": "H\xE0n Ng\u1ECDc S\xE2m", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 Nh\xE2n s\xE2m ng\u1ECDc l\u1EA1nh d\u01B0\u1EE1ng \xE2m" }, "item.loi_kiep_truc": { "name": "L\xF4i Ki\u1EBFp Tr\xFAc", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 Th\xE2n tr\xFAc t\u1EEBng h\u1EE9ng ch\u1ECBu thi\xEAn l\xF4i" }, "item.thanh_phong_diep": { "name": "Thanh Phong Di\u1EC7p", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 L\xE1 c\xE2y thanh phong ch\u1EE9a phong linh kh\xED" }, "item.thien_nien_moc_tam": { "name": "Thi\xEAn Ni\xEAn M\u1ED9c T\xE2m", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 L\xF5i g\u1ED7 ng\xE0n n\u0103m tr\xE0n \u0111\u1EA7y m\u1ED9c kh\xED" }, "item.tram_uyen_tao": { "name": "Tr\u1EA7m Uy\xEAn T\u1EA3o", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 Rong linh d\u01B0\u1EDBi \u0111\xE1y v\u1EF1c s\xE2u" }, "item.tu_nham_hoa": { "name": "T\u1EED Nham Hoa", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 Hoa t\xEDm m\u1ECDc tr\xEAn v\xE1ch \u0111\xE1 hi\u1EC3m tr\u1EDF" }, "item.xich_tinh_qua": { "name": "X\xEDch Tinh Qu\u1EA3", "quality": 4, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 Qu\u1EA3 \u0111\u1ECF l\u1EA5p l\xE1nh nh\u01B0 sao l\u1EEDa" }, "item.am_binh_lenh": { "name": "\xC2m Binh L\u1EC7nh", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 4 \xB7 L\u1EC7nh b\xE0i \u0111i\u1EC1u khi\u1EC3n \xE2m binh qu\u1EF7 t\u1ED1t" }, "item.bach_hac_vu_y": { "name": "B\u1EA1ch H\u1EA1c V\u0169 Y", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 4 \xB7 \xC1o l\xF4ng h\u1EA1c tr\u1EAFng nh\u1EB9 nh\xE0ng linh ho\u1EA1t" }, "item.bang_phach_lien": { "name": "B\u0103ng Ph\xE1ch Li\xEAn", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 4 \xB7 D\xE2y chuy\u1EC1n b\u0103ng ph\xE1ch thanh t\xE2m" }, "item.huyen_thiet_ho_uyen": { "name": "Huy\u1EC1n Thi\u1EBFt H\u1ED9 Uy\u1EC3n", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 4 \xB7 V\xF2ng tay huy\u1EC1n thi\u1EBFt gia c\u1ED1 l\u1EF1c tay" }, "item.khai_son_dao": { "name": "Khai S\u01A1n \u0110ao", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 4 \xB7 \u0110\u1EA1i \u0111ao b\u1ED5 n\xFAi m\u1EDF \u0111\u01B0\u1EDDng" }, "item.khu_thi_linh": { "name": "Khu Thi Linh", "quality": 4, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 4 \xB7 Chu\xF4ng \u0111\u1ED3ng \u0111i\u1EC1u khi\u1EC3n c\u01B0\u01A1ng thi" }, "item.huyen_bang_phu": { "name": "Huy\u1EC1n B\u0103ng Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 4 \xB7 Linh ph\xF9 \u0111\xF3ng b\u0103ng \u0111\u1ED1i th\u1EE7" }, "item.thuong_lang_phu": { "name": "Th\u01B0\u01A1ng Lang Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 4 \xB7 Linh ph\xF9 tri\u1EC7u h\u1ED3i b\xF3ng s\xF3i xanh c\xF4ng k\xEDch" }, "item.toan_phong_phu": { "name": "To\xE0n Phong Ph\xF9", "quality": 4, "cat": "Ph\xF9 L\u1EE5c", "desc": "Ph\u1EA9m 4 \xB7 Linh ph\xF9 t\u1EA1o l\u1ED1c xo\xE1y cu\u1ED1n bay \u0111\u1ECBch" }, "item.thanh_bang_si": { "name": "Thanh B\u1EB1ng S\xED", "quality": 4, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Ph\u1EA9m 4 \xB7 C\xE1nh chim Thanh B\u1EB1ng phi h\xE0nh" }, "item.bach_bao_nang": { "name": "B\xE1ch B\u1EA3o Nang", "quality": 4, "cat": "Tr\u1EEF V\u1EADt", "desc": "Ph\u1EA9m 4 \xB7 T\xFAi g\u1EA5m tr\u0103m b\xE1u ti\u1EC7n d\u1EE5ng" }, "item.tru_vat_gioi": { "name": "Tr\u1EEF V\u1EADt Gi\u1EDBi", "quality": 4, "cat": "Tr\u1EEF V\u1EADt", "desc": "Ph\u1EA9m 4 \xB7 Nh\u1EABn tr\u1EEF v\u1EADt ph\u1ED5 th\xF4ng c\u1EE7a tu s\u0129" }, "item.bang_phach_dan": { "name": "B\u0103ng Ph\xE1ch \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 H\xE0n \u0111an t\u0103ng c\u01B0\u1EDDng linh l\u1EF1c h\u1EC7 B\u0103ng" }, "item.bo_khi_dan": { "name": "B\u1ED5 Kh\xED \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 \u0110an d\u01B0\u1EE3c b\u1ED5 sung linh kh\xED ti\xEAu hao" }, "item.sinh_co_dan": { "name": "Sinh C\u01A1 \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 \u0110an d\u01B0\u1EE3c k\xEDch th\xEDch sinh c\u01A1 h\u1ED3i ph\u1EE5c v\u1EBFt th\u01B0\u01A1ng" }, "item.tay_tuy_dan": { "name": "T\u1EA9y T\u1EE7y \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 \u0110an d\u01B0\u1EE3c t\u1EA9y r\u1EEDa t\u1EA1p ch\u1EA5t kinh m\u1EA1ch" }, "item.thong_mach_dan": { "name": "Th\xF4ng M\u1EA1ch \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 \u0110an d\u01B0\u1EE3c h\u1ED7 tr\u1EE3 \u0111\u1EA3 th\xF4ng kinh m\u1EA1ch" }, "item.tich_doc_dan": { "name": "T\u1ECBch \u0110\u1ED9c \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 \u0110an d\u01B0\u1EE3c ph\xF2ng ng\u1EEBa ch\u01B0\u1EDBng kh\xED v\xE0 \u0111\u1ED9c t\u1ED1" }, "item.trang_dam_dan": { "name": "Tr\xE1ng \u0110\u1EA3m \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 \u0110an d\u01B0\u1EE3c t\u0103ng c\u01B0\u1EDDng kh\xED ph\xE1ch v\xE0 d\u0169ng kh\xED" }, "item.truc_co_dan": { "name": "Tr\xFAc C\u01A1 \u0110an", "quality": 4, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 4 \xB7 Linh \u0111an thi\u1EBFt y\u1EBFu \u0111\u1EC3 \u0111\u1ED9t ph\xE1 Tr\xFAc C\u01A1" }, "item.dan_khi_quyet": { "name": "D\u1EABn Kh\xED Quy\u1EBFt", "quality": 3, "cat": "C\xF4ng Ph\xE1p", "desc": "Ph\u1EA9m 3 \xB7 C\xF4ng ph\xE1p d\u1EABn linh kh\xED nh\u1EADp th\u1EC3 c\u0103n b\u1EA3n" }, "item.bach_cot_phan": { "name": "B\u1EA1ch C\u1ED1t Ph\u1EA5n", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 B\u1ED9t x\u01B0\u01A1ng tr\u1EAFng d\xF9ng v\u1EBD t\xE0 ph\xF9" }, "item.chu_ty": { "name": "Chu Ty", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 T\u01A1 nh\u1EC7n y\xEAu th\xFA d\xF9ng ch\u1EBF t\xE1c gi\xE1p v\xE0 l\u01B0\u1EDBi" }, "item.cot_thu": { "name": "C\u1ED1t Th\xFA", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 X\u01B0\u01A1ng y\xEAu th\xFA nguy\xEAn li\u1EC7u luy\u1EC7n kh\xED" }, "item.diep_phan": { "name": "Di\u1EC7p Ph\u1EA5n", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 Ph\u1EA5n c\xE1nh b\u01B0\u1EDBm y\xEAu th\xFA d\xF9ng luy\u1EC7n \u0111an ch\u1EBF ph\xF9" }, "item.han_thiet": { "name": "H\xE0n Thi\u1EBFt", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 Qu\u1EB7ng s\u1EAFt l\u1EA1nh n\u01A1i b\u0103ng nguy\xEAn" }, "item.kim_giac": { "name": "Kim Gi\xE1c", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 S\u1EEBng v\xE0ng c\u1EE7a y\xEAu th\xFA" }, "item.lang_nha": { "name": "Lang Nha", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 R\u0103ng nanh s\xF3i y\xEAu s\u1EAFc nh\u1ECDn" }, "item.linh_ngu": { "name": "Linh Ng\u01B0", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 C\xE1 linh b\u01A1i trong su\u1ED1i linh kh\xED" }, "item.moc_khoi_hach": { "name": "M\u1ED9c Kh\xF4i H\u1EA1ch", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 L\xF5i c\u1EE7a m\u1ED9c nh\xE2n kh\xF4i l\u1ED7i" }, "item.ngu_chau": { "name": "Ng\u01B0 Ch\xE2u", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 H\u1EA1t ch\xE2u trong b\u1EE5ng c\xE1 linh" }, "item.oan_hon_ty": { "name": "O\xE1n H\u1ED3n Ty", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 S\u1EE3i t\u01A1 k\u1EBFt t\u1EEB o\xE1n kh\xED" }, "item.te_nguu_giac": { "name": "T\xEA Ng\u01B0u Gi\xE1c", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 S\u1EEBng Thi\u1EBFt B\u1ED1i T\xEA Ng\u01B0u" }, "item.thach_tuy_phan": { "name": "Th\u1EA1ch T\u1EE7y Ph\u1EA5n", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 B\u1ED9t t\u1EE7y \u0111\xE1 linh nguy\xEAn li\u1EC7u ch\u1EBF t\xE1c" }, "item.thi_mao": { "name": "Thi Mao", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 L\xF4ng mao c\u01B0\u01A1ng thi luy\u1EC7n t\xE0 kh\xED" }, "item.thiet_thuoc_bi": { "name": "Thi\u1EBFt Th\u01B0\u1EDBc B\xEC", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 Da y\xEAu th\xFA d\xE0y c\u1EE9ng nh\u01B0 s\u1EAFt" }, "item.thuy_hau_mao": { "name": "Th\u1EE7y H\u1EA7u Mao", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 L\xF4ng kh\u1EC9 n\u01B0\u1EDBc v\xF9ng s\xF4ng h\u1ED3" }, "item.tran_chau": { "name": "Tr\xE2n Ch\xE2u", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 Ng\u1ECDc trai linh kh\xED d\u01B0\u1EDBi \u0111\xE1y bi\u1EC3n" }, "item.xa_dam": { "name": "X\xE0 \u0110\u1EA3m", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 M\u1EADt r\u1EAFn y\xEAu th\xFA gi\xFAp s\xE1ng m\u1EAFt gi\u1EA3i \u0111\u1ED9c" }, "item.yeu_dan_2": { "name": "Nh\u1ECB Giai Y\xEAu \u0110an", "quality": 3, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 3 \xB7 Y\xEAu \u0111an y\xEAu th\xFA b\u1EADc 2 (Tr\xFAc C\u01A1)" }, "item.bach_cot_hoa": { "name": "B\u1EA1ch C\u1ED1t Hoa", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 Hoa m\u1ECDc tr\xEAn x\u01B0\u01A1ng tr\u1EAFng n\u01A1i c\u1ED5 chi\u1EBFn tr\u01B0\u1EDDng" }, "item.ha_diep_suong": { "name": "H\xE0 Di\u1EC7p S\u01B0\u01A1ng", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 S\u01B0\u01A1ng s\u1EDBm \u0111\u1ECDng tr\xEAn l\xE1 sen linh" }, "item.hoa_diep_dang": { "name": "H\u1ECFa Di\u1EC7p \u0110\u1EB1ng", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 D\xE2y leo l\xE1 l\u1EEDa d\xF9ng luy\u1EC7n \u0111an" }, "item.phong_mat": { "name": "Phong M\u1EADt", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 M\u1EADt ong linh d\u01B0\u1EE1ng kh\xED ho\xE0n th\u1EA7n" }, "item.son_sam": { "name": "S\u01A1n S\xE2m", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 Nh\xE2n s\xE2m n\xFAi gi\xE0 b\u1ED5 kh\xED huy\u1EBFt" }, "item.thanh_tam_thao": { "name": "Thanh T\xE2m Th\u1EA3o", "quality": 3, "cat": "Linh D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 C\u1ECF thanh t\xE2m nguy\xEAn li\u1EC7u luy\u1EC7n \u0111an c\u01A1 b\u1EA3n" }, "item.lang_nha_chuy": { "name": "Lang Nha Ch\xF9y", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 3 \xB7 Ch\xF9y gai s\xE1t th\u01B0\u01A1ng ngo\u1EA1i l\u1EF1c" }, "item.thanh_phong_kiem": { "name": "Thanh Phong Ki\u1EBFm", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 3 \xB7 Phi ki\u1EBFm thanh phong nh\u1EB9 b\xE9n" }, "item.thiet_kiem": { "name": "Thi\u1EBFt Ki\u1EBFm", "quality": 3, "cat": "Ph\xE1p Kh\xED", "desc": "Ph\u1EA9m 3 \xB7 Ki\u1EBFm s\u1EAFt r\xE8n \u0111\xFAc c\u01A1 b\u1EA3n c\u1EE7a tu s\u0129 c\u1EA5p th\u1EA5p" }, "item.bien_buc_si": { "name": "Bi\xEAn B\u1EE9c S\xED", "quality": 3, "cat": "Ph\u01B0\u01A1ng Ti\u1EC7n", "desc": "Ph\u1EA9m 3 \xB7 C\xE1nh d\u01A1i huy\u1EBFt tinh bay l\u01B0\u1EE3n \u0111\xEAm t\u1ED1i" }, "item.tru_vat_dai": { "name": "Tr\u1EEF V\u1EADt \u0110\u1EA1i", "quality": 3, "cat": "Tr\u1EEF V\u1EADt", "desc": "Ph\u1EA9m 3 \xB7 T\xFAi tr\u1EEF v\u1EADt c\u01A1 b\u1EA3n" }, "item.hoi_xuan_dan": { "name": "H\u1ED3i Xu\xE2n \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 \u0110an d\u01B0\u1EE3c tr\u1ECB th\u01B0\u01A1ng c\u01A1 b\u1EA3n" }, "item.kim_sang_duoc": { "name": "Kim Sang D\u01B0\u1EE3c", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 Thu\u1ED1c tr\u1ECB ngo\u1EA1i th\u01B0\u01A1ng th\xF4ng d\u1EE5ng" }, "item.ngung_khi_dan": { "name": "Ng\u01B0ng Kh\xED \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 \u0110an d\u01B0\u1EE3c t\u0103ng t\u1ED1c tu luy\u1EC7n Luy\u1EC7n Kh\xED" }, "item.thanh_tam_dan": { "name": "Thanh T\xE2m \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 \u0110an d\u01B0\u1EE3c t\u0129nh t\xE2m an th\u1EA7n, tr\u1EEB t\u1EA1p ni\u1EC7m" }, "item.tu_khi_dan": { "name": "T\u1EE5 Kh\xED \u0110an", "quality": 3, "cat": "\u0110an D\u01B0\u1EE3c", "desc": "Ph\u1EA9m 3 \xB7 \u0110an d\u01B0\u1EE3c t\u1EE5 t\u1EADp linh kh\xED h\u1ED7 tr\u1EE3 tu luy\u1EC7n" }, "item.dp_thiet_kiem": { "name": "\u0110\u1ED3 Ph\u1ED5: Thi\u1EBFt Ki\u1EBFm", "quality": 3, "cat": "\u0110an Ph\u01B0\u01A1ng", "desc": "Ph\u1EA9m 3 \xB7 \u0110\u1ED3 ph\u1ED5 r\xE8n \u0111\xFAc Thi\u1EBFt Ki\u1EBFm" }, "item.chu_sa": { "name": "Chu Sa", "quality": 2, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 2 \xB7 M\u1EF1c chu sa d\xF9ng v\u1EBD linh ph\xF9" }, "item.phu_chi": { "name": "Ph\xF9 Ch\u1EC9", "quality": 2, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 2 \xB7 Gi\u1EA5y v\xE0ng chuy\xEAn d\u1EE5ng \u0111\u1EC3 ch\u1EBF ph\xF9" }, "item.thiet_khoang": { "name": "Thi\u1EBFt Kho\xE1ng", "quality": 2, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 2 \xB7 Qu\u1EB7ng s\u1EAFt c\u01A1 b\u1EA3n \u0111\u1EC3 luy\u1EC7n kh\xED" }, "item.yeu_bi": { "name": "Y\xEAu B\xEC", "quality": 2, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 2 \xB7 Da y\xEAu th\xFA d\xF9ng ch\u1EBF gi\xE1p v\xE0 ph\xF9" }, "item.yeu_dan_1": { "name": "Nh\u1EA5t Giai Y\xEAu \u0110an", "quality": 2, "cat": "Kho\xE1ng Th\u1EA1ch & Y\xEAu \u0110an", "desc": "Ph\u1EA9m 2 \xB7 Y\xEAu \u0111an y\xEAu th\xFA b\u1EADc 1 (Luy\u1EC7n Kh\xED)" } };
  var THE_CHAT_DB = { "the_chat.hoang_co": { "id": "the_chat.hoang_co", "ten": "Hoang C\u1ED5 th\xE1nh th\u1EC3", "mo_ta": "Th\u1EC3 ch\u1EA5t th\u01B0\u1EE3ng c\u1ED5 ch\xED t\xF4n. Kinh m\u1EA1ch r\u1ED9ng nh\u01B0 \u0111\u1EA1i giang \u0111\u1EA1i h\xE0 (121 \xF4), kh\xF4ng huy\u1EC7t khi\u1EBFu.", "buff": "Kh\xED huy\u1EBFt +50% \xB7 Ph\u1EA3n ph\u1EC7 50% \xB7 T\u1ED1c \u0111\u1ED9 -15%", "icon": "\u{1F451}", "khuon": ". . 5 5 4 4 4 5 5 . .\n. 3 3 3 2 2 2 3 3 3 .\n5 3 2 2 1 1 1 2 2 3 5\n5 3 2 2 1 1 1 2 2 3 5\n4 2 1 1 0 0 0 1 1 2 4\n4 2 1 1 0 D 0 1 1 2 4\n4 2 1 1 0 0 0 1 1 2 4\n5 3 2 2 1 1 1 2 2 3 5\n5 3 2 2 1 1 1 2 2 3 5\n. 3 3 3 2 2 2 3 3 3 .\n. . 5 5 4 4 4 5 5 . .\n", "dac_tinh": { "khi_huyet": 0.5, "phan_phe": 0.5, "toc_do": -0.15 } }, "the_chat.cuu_am": { "id": "the_chat.cuu_am", "ten": "C\u1EEDu \xC2m tuy\u1EC7t m\u1EA1ch", "mo_ta": "\xC2m kh\xED t\u1EE5 trong ch\xEDn \u0111\u01B0\u1EDDng kinh m\u1EA1ch. 10 huy\u1EC7t khi\u1EBFu c\u1EF1c h\u1EA1n, 40% kinh m\u1EA1ch \xE9p sang B\u0103ng.", "buff": "10 Huy\u1EC7t khi\u1EBFu \xB7 \xC9p 40% B\u0103ng h\u1EC7 \xB7 C\u1EF1c m\u1EA1nh B\u0103ng Tu", "icon": "\u2744\uFE0F", "khuon": ". 5 4 e 4 5 .\nf d 2 b 2 3 5\n4 c 0 0 0 2 4\n4 1 0 D 0 1 e\n4 2 0 0 0 c 4\n5 3 2 b 2 3 5\n. 5 3 d 3 f .\n", "dac_tinh": { "ep_bang": 0.4, "tho_pham_nhan": 30 } }, "the_chat.kiem_cot": { "id": "the_chat.kiem_cot", "ten": "Ki\u1EBFm c\u1ED1t", "mo_ta": "X\u01B0\u01A1ng s\u1ED1ng th\u1EB3ng nh\u01B0 th\u1EA7n ki\u1EBFm, kinh m\u1EA1ch thanh tr\u01B0\u1EDDng. Tr\u1EDDi sinh ki\u1EBFm ti\xEAn v\xF4 song.", "buff": "Ki\u1EBFm uy l\u1EF1c +25% \xB7 Kinh l\u1ED9 t\u1ED1i \u0111a 7", "icon": "\u2694\uFE0F", "khuon": ". . f . .\n. 5 4 5 .\n5 4 e 4 5\n4 4 3 4 4\n4 3 d 3 4\n3 3 2 3 3\n3 2 c 2 3\n2 2 1 2 2\n2 1 b 1 2\n1 0 0 0 1\n1 0 D 0 1\n1 0 0 0 1\n. 1 1 1 .\n", "dac_tinh": { "kiem_uy_luc": 0.25, "kinh_lo_toi_da": 7 } }, "the_chat.bach_thao": { "id": "the_chat.bach_thao", "ten": "B\xE1ch Th\u1EA3o th\u1EC3", "mo_ta": "Huy\u1EBFt m\u1EA1ch sinh ra t\u1EEB linh d\u01B0\u1EE3c th\u1EA7n th\u1EA3o. Th\u1EA5m s\xE2u m\u1ECDi lo\u1EA1i \u0111an d\u01B0\u1EE3c, \u0111an \u0111\u1EA1o th\xE1nh th\u1EC3.", "buff": "D\u01B0\u1EE3c kh\xE1ng +20% \xB7 \u0110an d\u01B0\u1EE3c trong tr\u1EADn +25%", "icon": "\u{1F33F}", "khuon": ". . f 4 e 4 5 . .\n. d 3 2 2 2 3 3 .\n5 3 2 1 1 1 2 3 5\n4 2 1 0 0 0 1 c 4\n4 2 1 0 D 0 1 2 4\n4 2 1 0 0 0 1 2 4\n5 3 2 1 b 1 2 3 5\n. 3 3 2 2 2 3 3 .\n. . 5 4 e 4 5 . .\n", "dac_tinh": { "duoc_khang": 0.2, "dan_tran": 0.25 } }, "the_chat.thiet_cot": { "id": "the_chat.thiet_cot", "ten": "Thi\u1EBFt c\u1ED1t", "mo_ta": "G\xE2n c\u1ED1t \u0111\xFAc t\u1EEB huy\u1EC1n thi\u1EBFt, kinh m\u1EA1ch r\u1ED9ng l\u1EDBn, th\u1EC3 tu kim cang b\u1EA5t ho\u1EA1i.", "buff": "Kh\xED huy\u1EBFt +20% \xB7 Ph\xF2ng ng\u1EF1 d\u1EBBo dai", "icon": "\u{1F6E1}\uFE0F", "khuon": ". . f 5 4 4 4 5 5 . .\n. 3 3 3 2 2 2 3 3 3 .\n5 3 2 2 1 1 1 2 2 3 5\n4 2 1 1 0 0 0 1 1 c 4\n4 2 1 1 0 D 0 1 1 2 4\n4 2 1 1 0 0 0 1 1 2 4\n5 3 2 2 1 1 1 2 2 3 5\n. 3 3 3 2 2 2 3 3 3 .\n. . 5 5 4 e 4 5 5 . .\n", "dac_tinh": { "khi_huyet": 0.2 } }, "the_chat.pham_the": { "id": "the_chat.pham_the", "ten": "Ph\xE0m th\u1EC3", "mo_ta": "Th\xE2n x\xE1c ng\u01B0\u1EDDi ph\xE0m b\xECnh th\u01B0\u1EDDng.", "buff": "Kh\xF4ng c\xF3 buff \u0111\u1EB7c th\xF9", "icon": "\u{1F464}", "khuon": ". . f 4 e 4 5 . .\n. d 3 2 2 2 3 3 .\n5 3 2 1 1 1 2 3 5\n4 2 1 0 0 0 1 c 4\n4 2 1 0 D 0 1 2 4\n4 2 1 0 0 0 1 2 4\n5 3 2 1 b 1 2 3 5\n. 3 3 2 2 2 3 3 .\n. . 5 4 e 4 5 . .\n", "dac_tinh": {} } };
  var ALL_TOP_SKILLS = ["item.ba_tieu_phien", "item.bac_minh_han_thuong", "item.bat_bao_kim_chung", "item.bich_lac_kinh", "item.bich_lan_doc_cham", "item.bo_de_niem_chau", "item.canh_kim_chan_kinh", "item.canh_kim_quyet", "item.chan_loi_quyet", "item.chuong_tam_loi", "item.cot_thu", "item.cuu_duong_chan_kinh", "item.cuu_thien_cuong_phong", "item.dan_khi_quyet", "item.dia_mach_linh_chau", "item.dinh_hai_chau", "item.hau_tho_quyet", "item.hau_tho_than_bi", "item.hau_tho_thuan", "item.hoang_chung_nhiep_phach", "item.hon_nguyen_chau", "item.hon_nguyen_luyen_the_kinh", "item.hon_thien_lang", "item.huyen_bang_tam_kinh", "item.huyen_hoang_chuong", "item.huyen_hoang_tao_hoa_kinh", "item.huyen_minh_chan_kinh", "item.huyen_thiet_ho_uyen", "item.huyet_anh_dao", "item.huyet_trao_cong", "item.khai_son_dao", "item.khon_tien_thang", "item.kim_cang_quyet", "item.kim_cot_ngoc_tuy", "item.kim_giao_tien", "item.kim_than_phap_tuong", "item.kinh_hong_tien_kiem", "item.lang_nha_chuy", "item.liet_ho_dao", "item.linh_lung_tran_nhac_thap", "item.loi_dinh_lenh", "item.luan_hoi_chan_kinh", "item.luu_van_quyet", "item.ly_hoa_tien_kiem", "item.man_hoang_cot_mau", "item.ngoc_lo_binh", "item.ngoc_tinh_binh", "item.ngu_to_hop_dao_quyet", "item.nhiep_hon_dai_phap", "item.pha_giap_toan", "item.phan_thien_chan_hoa", "item.phan_thuy_thich", "item.phi_cuong_trao", "item.phi_liem_phong_y", "item.phong_luan_phi_hoan", "item.quy_hai_kinh", "item.quy_tuc_cong", "item.tai_than_tu_van_kinh", "item.tam_kiem_quyet", "item.tam_nguyen_quy_nhat_cong", "item.tam_sinh_thach", "item.thai_am_bang_luan", "item.thai_co_long_lan", "item.thai_thanh_tien_kinh", "item.thai_thuong_huyen_thuy_kinh", "item.thanh_de_truong_xuan_kinh", "item.thanh_loi_quyet", "item.thanh_moc_tu_linh_chau", "item.thanh_van_kiem_quyet", "item.thien_loi_chinh_phap", "item.thiet_bo_sam", "item.thong_ty_kim_con", "item.thu_thuy_kiem_quyet", "item.thua_anh_kiem", "item.thuong_lan_kiem", "item.trong_son_quyet", "item.tru_tien_kiem", "item.truong_sinh_chan_kinh", "item.tu_dien_thoa", "item.tu_kim_phi_kiem", "item.tu_thu_tien_y", "item.tu_tieu_than_kiem", "item.tuc_nhuong", "item.van_hon_chu", "item.van_kiep_hon_dang", "item.vinh_trieu_chuong", "item.yeu_hoang_huyet_kinh"];
  var ALL_RECIPES = ["dp.bach_giai_dan", "dp.bach_hac_vu_y", "dp.bang_phach_dan", "dp.bao_huyet_dan", "dp.bao_huyet_dan_mac", "dp.bich_lan_doc_cham", "dp.bo_khi_dan", "dp.boi_anh_dan", "dp.boi_nguyen_dan", "dp.bua_tru_ta", "dp.canh_kim_phu", "dp.chu_ty_vong", "dp.cuu_vi_huyen_dang", "dp.dan_lo_dia", "dp.dan_lo_dong", "dp.dan_loi_phu", "dp.dia_don_phu_vu", "dp.dinh_than_dan", "dp.dinh_than_phu", "dp.dinh_than_phu_diep", "dp.due_kim_dan", "dp.duong_khi_dan", "dp.duong_than_dan", "dp.giao_can_cung", "dp.giao_cot_cung", "dp.han_thiet_dao", "dp.hat_vi_tien", "dp.hau_tho_kim_cang_an", "dp.hau_tho_thuan_tuy", "dp.ho_cot_dao", "dp.hoa_dan_phu", "dp.hoa_long_truong", "dp.hoan_hon_dan", "dp.hoi_thien_dan", "dp.hoi_xuan_dan", "dp.hoi_xuan_dan_thuy", "dp.huyen_anh_dan", "dp.huyen_bang_phu", "dp.huyet_anh_dao", "dp.huyet_ha_phien", "dp.khai_nguyen_dan", "dp.khi_lo_hoang", "dp.khi_lo_huyen", "dp.khi_lo_pham", "dp.khu_thi_linh", "dp.kim_cuong_phu", "dp.kim_dan_phu", "dp.kim_lan_doc_phu", "dp.kim_lo_dan", "dp.kim_o_dan", "dp.kim_sang_duoc", "dp.lang_nguyet_cau", "dp.lang_nha_chuy", "dp.linh_lung_dan", "dp.linh_lung_thap_nha", "dp.loi_am_dan", "dp.ngung_khi_dan", "dp.ngung_nguyen_dan", "dp.pha_chuong_dan", "dp.pha_giap_toan_giac", "dp.phi_cuong_trao", "dp.phu_but_hoang_tho", "dp.phu_but_huyen", "dp.phu_but_pham", "dp.phu_but_thien", "dp.quy_giap_thuan_ngac", "dp.quy_loi_co", "dp.quy_tuc_phu", "dp.sinh_co_dan", "dp.tao_hoa_dan", "dp.tay_tuy_dan", "dp.thai_hu_dan", "dp.thanh_phong_phu", "dp.thanh_tam_dan", "dp.thanh_vu_dan", "dp.thien_bang_cung", "dp.thien_loi_dan", "dp.thien_loi_phu", "dp.thien_nhat_dan", "dp.thiet_kiem", "dp.thong_than_dan", "dp.thuong_long_dan", "dp.tich_doc_dan", "dp.tinh_nguyen_dan", "dp.toa_hon_phu", "dp.toan_phong_phu", "dp.tran_hon_dan", "dp.tran_quy_phu", "dp.trang_dam_dan", "dp.truc_co_dan", "dp.tu_khi_dan", "dp.tu_kim_phi_kiem", "dp.tu_kim_phi_kiem_nha", "dp.tu_linh_dan", "dp.tu_tieu_loi_phu", "dp.tuc_mach_cao", "dp.tuy_ha_dan", "dp.van_quy_phien", "dp.van_tam_dan", "dp.van_tho_dan", "dp.yeu_bi_giap"];
  var MO_KHOA_DATA = [{ "id": "mo_khoa.linh_can", "ten": "Linh C\u0103n", "max": 3, "desc": "T\u1ED1i \u0111a t\u1EF7 l\u1EC7 Thi\xEAn / Bi\u1EBFn D\u1ECB Linh C\u0103n" }, { "id": "mo_khoa.thien_tu", "ten": "Thi\xEAn T\u01B0", "max": 4, "desc": "S\xE0n ch\u1EC9 s\u1ED1 kh\u1EDFi \u0111\u1EA7u c\u1EF1c cao" }, { "id": "mo_khoa.tho", "ten": "Th\u1ECD Nguy\xEAn", "max": 3, "desc": "+15 n\u0103m th\u1ECD kh\u1EDFi \u0111\u1EA7u" }, { "id": "mo_khoa.tuc_tue", "ten": "T\xFAc Tu\u1EC7", "max": 3, "desc": "+30% t\u1ED1c \u0111\u1ED9 tu luy\u1EC7n" }, { "id": "mo_khoa.hanh_trang", "ten": "H\xE0nh Trang", "max": 3, "desc": "+100 Linh Th\u1EA1ch kh\u1EDFi \u0111\u1EA7u" }, { "id": "mo_khoa.tui", "ten": "T\xFAi \u0110\u1ED3", "max": 2, "desc": "+4 \xF4 t\xFAi \u0111\u1ED3" }, { "id": "mo_khoa.di_the", "ten": "D\u1ECB Th\u1EC3", "max": 2, "desc": "T\u0103ng g\u1EA5p \u0111\xF4i c\u01A1 h\u1ED9i Th\u1EA7n Th\u1EC3" }, { "id": "mo_khoa.dan_tam", "ten": "\u0110an T\xE2m", "max": 1, "desc": "Thu\u1ED9c s\u1EB5n H\u1ED3i Xu\xE2n \u0110an ph\u01B0\u01A1ng" }, { "id": "mo_khoa.phu_tam", "ten": "Ph\xF9 T\xE2m", "max": 1, "desc": "Thu\u1ED9c s\u1EB5n H\u1ECFa \u0110\u1EA1n Ph\xF9 ph\u01B0\u01A1ng" }, { "id": "mo_khoa.khi_tam", "ten": "Kh\xED T\xE2m", "max": 1, "desc": "Thu\u1ED9c s\u1EB5n Thi\u1EBFt Ki\u1EBFm \u0111\u1ED3 ph\u1ED5" }, { "id": "mo_khoa.chon_nuoc", "ten": "Thi\xEAn m\u1EC7nh: Ch\u1ECDn N\u01B0\u1EDBc", "max": 1, "desc": "Ch\u1ECDn n\u01B0\u1EDBc sinh ra" }, { "id": "mo_khoa.chon_xuat_than", "ten": "Thi\xEAn m\u1EC7nh: Ch\u1ECDn Xu\u1EA5t Th\xE2n", "max": 1, "desc": "Ch\u1ECDn xu\u1EA5t th\xE2n mong mu\u1ED1n" }, { "id": "mo_khoa.dinh_he", "ten": "Thi\xEAn m\u1EC7nh: \u0110\u1ECBnh 1 H\u1EC7", "max": 1, "desc": "Ch\u1EAFc ch\u1EAFn ra h\u1EC7 mong mu\u1ED1n" }, { "id": "mo_khoa.xuat_than.tan_tu", "ten": "M\u1EDF: T\xE1n Tu", "max": 1, "desc": "Xu\u1EA5t th\xE2n T\xE1n tu" }, { "id": "mo_khoa.xuat_than.hau_boi_tong_mon", "ten": "M\u1EDF: H\u1EADu B\u1ED1i T\xF4ng M\xF4n", "max": 1, "desc": "Xu\u1EA5t th\xE2n t\xF4ng m\xF4n" }, { "id": "mo_khoa.xuat_than.hoang_toc", "ten": "M\u1EDF: Ho\xE0ng T\u1ED9c", "max": 1, "desc": "Xu\u1EA5t th\xE2n ho\xE0ng gia" }, { "id": "mo_khoa.xuat_than.chuyen_the", "ten": "M\u1EDF: Chuy\u1EC3n Th\u1EBF", "max": 1, "desc": "H\u1ED3n m\u1EA1nh, nh\u1EDB ki\u1EBFp tr\u01B0\u1EDBc" }];
  var ALL_THANH_TUU = [{ "id": "thanh_tuu.canh_gioi.luyen_khi", "ten": "B\u01B0\u1EDBc l\xEAn ti\xEAn l\u1ED9 (Luy\u1EC7n Kh\xED)" }, { "id": "thanh_tuu.canh_gioi.truc_co", "ten": "Tr\xFAc c\u01A1 th\xE0nh c\xF4ng" }, { "id": "thanh_tuu.canh_gioi.ket_dan", "ten": "Ch\xE2n nh\xE2n (Kim \u0110an)" }, { "id": "thanh_tuu.canh_gioi.nguyen_anh", "ten": "L\xE3o t\u1ED5 (Nguy\xEAn Anh)" }, { "id": "thanh_tuu.canh_gioi.hoa_than", "ten": "\u0110\u1EA1i n\u0103ng (H\xF3a Th\u1EA7n)" }, { "id": "thanh_tuu.pham_chat.2", "ten": "\u0110\u1EA1o c\u01A1 Ho\xE0n M\u1EF9" }, { "id": "thanh_tuu.pham_chat.3", "ten": "Kim \u0111an Nh\u1EA5t ph\u1EA9m" }, { "id": "thanh_tuu.pham_chat.4", "ten": "D\u1ECB anh (D\u1ECB t\u01B0\u1EE3ng Nguy\xEAn Anh)" }, { "id": "thanh_tuu.tong_mon.chan_truyen", "ten": "Ch\xE2n truy\u1EC1n \u0111\u1EC7 t\u1EED" }, { "id": "thanh_tuu.tong_mon.truong_lao", "ten": "Tr\u01B0\u1EDFng l\xE3o m\xF4n ph\xE1i" }, { "id": "thanh_tuu.dao_lu", "ten": "K\u1EBFt l\xE0m \u0111\u1EA1o l\u1EEF" }, { "id": "thanh_tuu.ket_nghia", "ten": "K\u1EBFt ngh\u0129a kim lan" }, { "id": "thanh_tuu.thien_kieu_bang", "ten": "\u0110\u1EE9ng \u0111\u1EA7u Thi\xEAn Ki\xEAu B\u1EA3ng" }, { "id": "thanh_tuu.tam_ma", "ten": "Ch\xE9m t\xE2m ma" }, { "id": "thanh_tuu.nuoc.ung", "ten": "Tr\xFAc c\u01A1 \u1EDF \u0110\u1EA1i Ung" }, { "id": "thanh_tuu.nuoc.thinh", "ten": "Tr\xFAc c\u01A1 \u1EDF Th\u1ECBnh Qu\u1ED1c" }, { "id": "thanh_tuu.nuoc.luong", "ten": "Tr\xFAc c\u01A1 \u1EDF L\u01B0\u01A1ng Qu\u1ED1c" }, { "id": "thanh_tuu.nuoc.minh", "ten": "Tr\xFAc c\u01A1 \u1EDF B\u1EAFc Minh" }, { "id": "thanh_tuu.nuoc.viem", "ten": "Tr\xFAc c\u01A1 \u1EDF Vi\xEAm Qu\u1ED1c" }, { "id": "thanh_tuu.nghe.luyen_dan", "ten": "\u0110an s\u01B0 (M\u1EDF \u0110an T\xE2m)" }, { "id": "thanh_tuu.nghe.che_phu", "ten": "Ph\xF9 s\u01B0 (M\u1EDF Ph\xF9 T\xE2m)" }, { "id": "thanh_tuu.nghe.luyen_bao", "ten": "Kh\xED s\u01B0 (M\u1EDF Kh\xED T\xE2m)" }, { "id": "thanh_tuu.nghe.tong_su", "ten": "T\xF4ng s\u01B0 m\u1ED9t ngh\u1EC1" }, { "id": "thanh_tuu.chet.het_tho", "ten": "Th\u1ECD t\u1EADn" }, { "id": "thanh_tuu.chet.tu_tran", "ten": "T\u1EED tr\u1EADn" }, { "id": "thanh_tuu.chet.dot_pha", "ten": "Th\xE2n t\u1EED \u0111\u1EA1o ti\xEAu" }, { "id": "thanh_tuu.chet.tu_vong", "ten": "B\u1ECF m\u1EA1ng" }, { "id": "thanh_tuu.chet.tu_bo", "ten": "T\u1EF1 t\xE1n c\xF4ng" }];

  // src/data/items.ts
  var CATEGORY_NAMES = {
    all: "T\u1EA5t C\u1EA3 Lo\u1EA1i",
    cong_phap: "C\xF4ng Ph\xE1p",
    dan_duoc: "\u0110an D\u01B0\u1EE3c",
    phap_khi: "Ph\xE1p Kh\xED",
    linh_duoc: "Linh D\u01B0\u1EE3c",
    yeu_tai: "Y\xEAu T\xE0i",
    nguyen_lieu: "Nguy\xEAn Li\u1EC7u / Qu\u1EB7ng",
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
      background: rgba(19, 22, 34, 0.95);
      color: #f8fafc;
      padding: 10px 18px;
      border-radius: 20px;
      border: 1px solid #e5b869;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(229, 184, 105, 0.3);
      z-index: 99999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 600;
      transition: opacity 0.25s, transform 0.25s;
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
        t.style.transform = "translateX(-50%) translateY(-10px)";
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
        <span class="vktt-title vktt-rainbow">V\u1EA0N KI\u1EBEP TU TI\xCAN</span>
        <span class="vktt-badge">v3.0 PRO</span>
      </div>
      <button class="vktt-close-btn" id="vktt-btn-close">\u2715</button>
    </div>
    <div class="vktt-tabs">
      <button class="vktt-tab-btn active" data-tab="tab-nhan-vat">\u{1F451} Nh\xE2n V\u1EADt</button>
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

    <!-- KH\u1ED0I 3: TH\u1EC2 CH\u1EA4T (6 TH\u1EC2 CH\u1EA4T G\u1ED0C) & LINH C\u0102N -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F9EC} 3. Th\u1EC3 Ch\u1EA5t Chu\u1EA9n Game & Linh C\u0103n</div>
      <div class="vktt-row">
        <select id="vktt-sel-tc" class="vktt-select" style="flex:1;">
          <option value="the_chat.hoang_co" ${nv.theChat === "the_chat.hoang_co" ? "selected" : ""}>\u{1F451} Hoang C\u1ED5 Th\xE1nh Th\u1EC3 (121 \xF4)</option>
          <option value="the_chat.cuu_am" ${nv.theChat === "the_chat.cuu_am" ? "selected" : ""}>\u2744\uFE0F C\u1EEDu \xC2m Tuy\u1EC7t M\u1EA1ch (B\u0103ng)</option>
          <option value="the_chat.kiem_cot" ${nv.theChat === "the_chat.kiem_cot" ? "selected" : ""}>\u2694\uFE0F Ki\u1EBFm C\u1ED1t Th\u1EC3 (Ki\u1EBFm +25%)</option>
          <option value="the_chat.bach_thao" ${nv.theChat === "the_chat.bach_thao" ? "selected" : ""}>\u{1F33F} B\xE1ch Th\u1EA3o Th\u1EC3 (\u0110an tu)</option>
          <option value="the_chat.thiet_cot" ${nv.theChat === "the_chat.thiet_cot" ? "selected" : ""}>\u{1F6E1}\uFE0F Thi\u1EBFt C\u1ED1t Th\u1EC3 (Kh\xED huy\u1EBFt)</option>
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
        <button id="vktt-btn-all-recipes" class="vktt-btn vktt-btn-ghost">\u{1F525} H\u1ECDc 216 \u0110\u01A1n Ph\u01B0\u01A1ng</button>
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
        <button class="vktt-subtab-btn ${currentCraftType === "luyen_dan" ? "active" : ""}" data-craft="luyen_dan">\u{1F33F} Luy\u1EC7n \u0110an (69)</button>
        <button class="vktt-subtab-btn ${currentCraftType === "luyen_bao" ? "active" : ""}" data-craft="luyen_bao">\u2694\uFE0F Luy\u1EC7n B\u1EA3o / Kh\xED (112)</button>
        <button class="vktt-subtab-btn ${currentCraftType === "che_phu" ? "active" : ""}" data-craft="che_phu">\u{1F4DC} Ch\u1EBF Ph\xF9 (35)</button>
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
