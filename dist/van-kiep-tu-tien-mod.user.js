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
  function waitForGame(onReady) {
    const timer = setInterval(() => {
      try {
        if (gWin.game && gWin.game.store) {
          clearInterval(timer);
          console.log("[VKTT MOD v3.0] K\u1EBFt n\u1ED1i th\xE0nh c\xF4ng t\u1EDBi Game Store!");
          onReady();
        }
      } catch (e) {
      }
    }, 400);
  }

  // src/ui/styles.ts
  var MOD_STYLES = `
/* ================= VKTT MOD v3.0 MOBILE-FIRST STYLES ================= */
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
  right: 18px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e5b869 0%, #996515 100%);
  color: #0b0d14;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
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
  height: 82vh;
  max-height: 85vh;
  background: linear-gradient(180deg, rgba(22, 27, 42, 0.98) 0%, rgba(11, 14, 22, 0.99) 100%);
  border-top: 2px solid #e5b869;
  border-radius: 20px 20px 0 0;
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
}

/* DESKTOP RESPONSIVE ADJUSTMENT */
@media (min-width: 769px) {
  #vktt-drawer {
    left: auto;
    right: 20px;
    bottom: 20px;
    width: 440px;
    height: 84vh;
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
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  padding-top: 6px;
}

.vktt-drag-bar {
  width: 44px;
  height: 5px;
  border-radius: 4px;
  background: rgba(229, 184, 105, 0.4);
}

/* HEADER */
.vktt-header {
  padding: 8px 16px 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(229, 184, 105, 0.25);
}

.vktt-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vktt-title {
  font-size: 15px;
  font-weight: 800;
  color: #e5b869;
  letter-spacing: 0.5px;
}

.vktt-badge {
  font-size: 10px;
  padding: 2px 6px;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
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
  background: rgba(14, 17, 27, 0.95);
  border-bottom: 1px solid #1e2438;
  padding: 4px 8px;
  gap: 4px;
}

.vktt-tabs::-webkit-scrollbar {
  display: none;
}

.vktt-tab-btn {
  flex: 0 0 auto;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 12.5px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.vktt-tab-btn.active {
  background: rgba(229, 184, 105, 0.18);
  color: #e5b869;
  border: 1px solid rgba(229, 184, 105, 0.35);
}

/* CONTENT CONTAINER */
.vktt-content {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
  -webkit-overflow-scrolling: touch;
}

/* CARD / SECTION */
.vktt-card {
  background: rgba(19, 23, 36, 0.85);
  border: 1px solid #232a42;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
}

.vktt-card-hdr {
  font-size: 13px;
  font-weight: 700;
  color: #ffd88a;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* FORMS & INPUTS */
.vktt-field {
  margin-bottom: 10px;
}

.vktt-field:last-child {
  margin-bottom: 0;
}

.vktt-label {
  display: block;
  font-size: 11.5px;
  color: #94a3b8;
  margin-bottom: 4px;
  font-weight: 600;
}

.vktt-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.vktt-input {
  flex: 1;
  height: 38px;
  background: #0f1320;
  border: 1px solid #2d3652;
  border-radius: 8px;
  padding: 0 10px;
  color: #f8fafc;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.vktt-input:focus {
  border-color: #e5b869;
  box-shadow: 0 0 8px rgba(229, 184, 105, 0.2);
}

.vktt-select {
  height: 38px;
  background: #0f1320;
  border: 1px solid #2d3652;
  border-radius: 8px;
  padding: 0 10px;
  color: #f8fafc;
  font-size: 13px;
  outline: none;
}

.vktt-select:focus {
  border-color: #e5b869;
}

/* BUTTONS */
.vktt-btn {
  height: 38px;
  padding: 0 14px;
  background: linear-gradient(135deg, #e5b869 0%, #b78438 100%);
  color: #0b0d14;
  border: none;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: filter 0.15s, transform 0.1s;
}

.vktt-btn:active {
  transform: scale(0.96);
  filter: brightness(1.15);
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

/* GRID 2 COLUMNS */
.vktt-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

/* SEARCH SUGGESTIONS */
.vktt-dropdown-list {
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #2d3652;
  border-radius: 8px;
  background: #0f1320;
  margin-top: 6px;
}

.vktt-dropdown-item {
  padding: 8px 10px;
  font-size: 12px;
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
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 700;
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
  function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  }
  function getItemInfo(itemId) {
    const normId = itemId.startsWith("item.") ? itemId : `item.${itemId}`;
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
      const itemObj = content.item || {};
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
          cat: itemData.loai || "V\u1EADt ph\u1EA9m",
          desc: itemData.mo_ta || itemData.desc || ""
        };
      }
    } catch (e) {
    }
    const parts = normId.replace("item.", "").split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    return {
      id: normId,
      name: parts.join(" "),
      quality: 1,
      cat: "T\u1EF1 do",
      desc: "V\u1EADt ph\u1EA9m t\u1EF1 do"
    };
  }
  var cachedAllItems = null;
  function getAllAvailableItems() {
    if (cachedAllItems) return cachedAllItems;
    const map = /* @__PURE__ */ new Map();
    for (const id in PRESET_ITEMS) {
      if (Object.prototype.hasOwnProperty.call(PRESET_ITEMS, id)) {
        const p = PRESET_ITEMS[id];
        map.set(id, {
          id,
          name: p.name,
          quality: p.quality,
          cat: p.cat,
          desc: p.desc
        });
      }
    }
    try {
      const state = getGameState();
      const content = state?.content || {};
      const itemObj = content.item || {};
      if (itemObj && typeof itemObj.forEach === "function") {
        itemObj.forEach((val, key) => {
          const fullId = key.startsWith("item.") ? key : `item.${key}`;
          if (!map.has(fullId)) {
            map.set(fullId, {
              id: fullId,
              name: val.ten || val.name || key,
              quality: val.pham_cap || val.phamCap || 1,
              cat: val.loai || "V\u1EADt ph\u1EA9m",
              desc: val.mo_ta || val.desc || ""
            });
          }
        });
      } else if (itemObj && typeof itemObj === "object") {
        for (const key of Object.keys(itemObj)) {
          const fullId = key.startsWith("item.") ? key : `item.${key}`;
          if (!map.has(fullId)) {
            const val = itemObj[key];
            map.set(fullId, {
              id: fullId,
              name: val?.ten || val?.name || key,
              quality: val?.pham_cap || val?.phamCap || 1,
              cat: val?.loai || "V\u1EADt ph\u1EA9m",
              desc: val?.mo_ta || val?.desc || ""
            });
          }
        }
      }
    } catch (e) {
    }
    cachedAllItems = Array.from(map.values()).sort((a, b) => {
      if (b.quality !== a.quality) return b.quality - a.quality;
      return a.name.localeCompare(b.name, "vi");
    });
    return cachedAllItems;
  }
  function searchItems(query, maxResults = 30) {
    const items = getAllAvailableItems();
    if (!query || !query.trim()) {
      return items.slice(0, maxResults);
    }
    const cleanQ = removeVietnameseTones(query.trim());
    const rawQ = query.trim().toLowerCase();
    const results = [];
    for (const item of items) {
      const nameNorm = removeVietnameseTones(item.name);
      const idNorm = item.id.toLowerCase();
      const catNorm = removeVietnameseTones(item.cat);
      let score = 0;
      if (nameNorm === cleanQ || idNorm === rawQ) score = 100;
      else if (nameNorm.startsWith(cleanQ) || idNorm.includes(rawQ)) score = 80;
      else if (nameNorm.includes(cleanQ)) score = 60;
      else if (catNorm.includes(cleanQ)) score = 40;
      if (score > 0) {
        results.push({ item, score: score + item.quality * 2 });
      }
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, maxResults).map((r) => r.item);
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
    setGameState({ run: mergeObj(state.run, { nhanVat: nextNv }) });
    return true;
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
      setGameState({ run: mergeObj(state.run, { nhanVat }) });
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
    setGameState({ run: mergeObj(state.run, { nhanVat }) });
    notify("\u{1F451} \u0110\xE3 k\xEDch ho\u1EA1t G\xD3I TH\u1EA6N \u0110\u1EA0O v3.0 (Trang b\u1ECB c\u1EF1c ph\u1EA9m Ph\u1EA9m 8-9 + 99 Th\u1EA7n D\u01B0\u1EE3c)!");
  }
  function unlockAllProfessions() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
    }
    const ngheNghiep = {
      luyen_dan: { cap: 5, kinhNghiem: 1e4 },
      luyen_khi: { cap: 5, kinhNghiem: 1e4 },
      che_phu: { cap: 5, kinhNghiem: 1e4 },
      tran_phap: { cap: 5, kinhNghiem: 1e4 },
      ngu_thu: { cap: 5, kinhNghiem: 1e4 },
      khoi_loi: { cap: 5, kinhNghiem: 1e4 }
    };
    updateNhanVat({ ngheNghiep });
    notify("\u{1F4DC} \u0110\xE3 th\xF4ng tu\u1EC7 TO\xC0N B\u1ED8 NGH\u1EC0 NGHI\u1EC6P C\u1EA4P 5 (T\xF4ng S\u01B0)!");
  }
  function unlockAllRecipes() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
    }
    const nhanVat = copyObj(state.run.nhanVat);
    const dp = copyObj(nhanVat.danPhuong || {});
    for (const r of ALL_RECIPES) {
      dp[r] = true;
    }
    updateNhanVat({ danPhuong: dp });
    notify(`\u{1F525} \u0110\xE3 l\u0129nh ng\u1ED9 to\xE0n b\u1ED9 ${ALL_RECIPES.length} \u0110AN PH\u01AF\u01A0NG & \u0110\u1ED2 PH\u1ED4!`);
  }
  function unlockAllSkills() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
    }
    const nhanVat = copyObj(state.run.nhanVat);
    const kp = copyObj(nhanVat.kyPhap || {});
    for (const s of ALL_TOP_SKILLS) {
      kp[s] = { cap: 10, tang: 10 };
    }
    updateNhanVat({ kyPhap: kp });
    notify(`\u26A1 \u0110\xE3 th\xF4ng th\u1EA1o ${ALL_TOP_SKILLS.length} C\xD4NG PH\xC1P & K\u1EF8 N\u0102NG \u0110\u1EA0I TH\xC0NH!`);
  }
  function unlockAllMeridians() {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify("\u26A0\uFE0F H\xE3y b\u01B0\u1EDBc v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
    }
    const nv = state.run.nhanVat;
    const tcKey = nv.theChat || "the_chat.pham_the";
    const tcData = THE_CHAT_DB[tcKey] || THE_CHAT_DB["the_chat.pham_the"];
    const rawLines = tcData.khuon.trim().split("\n");
    const lines = [];
    for (const r of rawLines) {
      const s = r.trim();
      if (s.length > 0) lines.push(s.split(/\s+/));
    }
    const vung = [];
    for (let r = 0; r < lines.length; r++) {
      for (let c = 0; c < lines[r].length; c++) {
        const ch = lines[r][c];
        if (ch === ".") vung.push(-1);
        else if (ch === "D") vung.push(0);
        else vung.push(1);
      }
    }
    const allHuyet = [];
    for (let i = 0; i < vung.length; i++) {
      if (vung[i] === 1) allHuyet.push(i);
    }
    const km = copyObj(nv.kinhMach || {});
    km.huyetThem = allHuyet;
    km.daKhaiThong = true;
    updateNhanVat({ kinhMach: km });
    notify(`\u{1F300} \u0110\xE3 \u0111\xE3 th\xF4ng TO\xC0N B\u1ED8 ${allHuyet.length} HUY\u1EC6T \u0110\u1EA0O KINH M\u1EA0CH (100% An To\xE0n)!`);
  }
  function setRealm(canhGioiIndex) {
    const REALM_MAP = {
      1: { ten: "Luy\u1EC7n Kh\xED", tuViMax: 100 },
      2: { ten: "Tr\xFAc C\u01A1", tuViMax: 500 },
      3: { ten: "Kim \u0110an", tuViMax: 2e3 },
      4: { ten: "Nguy\xEAn Anh", tuViMax: 8e3 },
      5: { ten: "H\xF3a Th\u1EA7n", tuViMax: 25e3 },
      6: { ten: "Luy\u1EC7n H\u01B0", tuViMax: 8e4 },
      7: { ten: "H\u1EE3p Th\u1EC3", tuViMax: 25e4 },
      8: { ten: "\u0110\u1EA1i Th\u1EEBa", tuViMax: 8e5 },
      9: { ten: "\u0110\u1ED9 Ki\u1EBFp", tuViMax: 3e6 }
    };
    const target = REALM_MAP[canhGioiIndex] || REALM_MAP[9];
    const patch = {
      canhGioi: { cap: canhGioiIndex, tang: 9, ten: target.ten },
      tuVi: target.tuViMax,
      tuViMax: target.tuViMax,
      kimDan: { pham: 9, ten: "C\u1EEDu Chuy\u1EC3n C\u1EF1c Ph\u1EA9m Kim \u0110an" },
      yCanh: { cap: 10, ten: "Vi\xEAn M\xE3n Ki\u1EBFm \xDD" },
      diTuong: "H\u1ED7n \u0110\u1ED9n S\u01A1 Khai"
    };
    updateNhanVat(patch);
    notify(`\u{1F31F} \u0110\xE3 \u0111\u1ED9t ph\xE1 t\u1EDBi C\u1EA2NH GI\u1EDAI: ${target.ten} \u0110\u1EC9nh Phong (C\u1EEDu Chuy\u1EC3n Kim \u0110an)!`);
  }
  function setPhysique(theChatKey) {
    const tc = THE_CHAT_DB[theChatKey];
    if (!tc) return;
    const patch = {
      theChat: theChatKey,
      linhCan: {
        loai: "thien_linh_can",
        ngu_hanh: ["kim", "moc", "thuy", "hoa", "tho"],
        do_tinh_thuan: 100
      }
    };
    updateNhanVat(patch);
    unlockAllMeridians();
    notify(`\u{1F525} \u0110\xE3 t\xE1i t\u1EA1o Th\u1EC3 Ch\u1EA5t: [${tc.ten}] & Thi\xEAn Linh C\u0103n Ng\u0169 H\xE0nh!`);
  }
  function unlockAllAchievementsAndFerrymen() {
    const state = getGameState();
    if (!state) return notify("\u26A0\uFE0F Ch\u01B0a k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c game store!");
    const profile = copyObj(state.profile || {});
    const moKhoa = copyObj(profile.moKhoa || {});
    for (const m of MO_KHOA_DATA) moKhoa[m] = true;
    const tt = copyObj(profile.thanhTuu || {});
    for (const a of ALL_THANH_TUU) tt[a] = true;
    profile.moKhoa = moKhoa;
    profile.thanhTuu = tt;
    profile.luanHoi = Math.max(profile.luanHoi || 0, 999);
    setGameState({ profile });
    notify(`\u{1F3C6} \u0110\xE3 m\u1EDF kh\xF3a ${MO_KHOA_DATA.length} L\xC3O \u0110\xD2 v\xE0 ${ALL_THANH_TUU.length} TH\xC0NH T\u1EF0U!`);
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
        const newBottom = Math.max(30, Math.min(window.innerHeight - 80, initialBottom + deltaY));
        fab.style.bottom = `${newBottom}px`;
      }
    }, { passive: true });
    fab.addEventListener("touchend", () => {
      if (isDragging) {
        initialBottom = parseInt(fab.style.bottom || "80", 10);
      }
    });
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
    return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F48E} T\xE0i Nguy\xEAn C\u01A1 B\u1EA3n</div>
      <div class="vktt-field">
        <label class="vktt-label">\u0110\u1EA1o Hi\u1EC7u</label>
        <div class="vktt-input-group">
          <input type="text" id="vktt-inp-ten" class="vktt-input" placeholder="Nh\u1EADp \u0111\u1EA1o hi\u1EC7u m\u1EDBi..." />
          <button id="vktt-btn-ten" class="vktt-btn">\u0110\u1ED5i</button>
        </div>
      </div>
      <div class="vktt-grid-2">
        <div class="vktt-field">
          <label class="vktt-label">Linh Th\u1EA1ch</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-lt" class="vktt-input" placeholder="999999" />
            <button id="vktt-btn-lt" class="vktt-btn">G\xE1n</button>
          </div>
        </div>
        <div class="vktt-field">
          <label class="vktt-label">Tu Vi</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-tv" class="vktt-input" placeholder="999999" />
            <button id="vktt-btn-tv" class="vktt-btn">G\xE1n</button>
          </div>
        </div>
      </div>
      <div class="vktt-grid-2">
        <div class="vktt-field">
          <label class="vktt-label">Th\u1ECD Nguy\xEAn Th\xEAm (N\u0103m)</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-tnt" class="vktt-input" placeholder="5000" />
            <button id="vktt-btn-tnt" class="vktt-btn">G\xE1n</button>
          </div>
        </div>
        <div class="vktt-field">
          <label class="vktt-label">Tu\u1ED5i</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-tuoi" class="vktt-input" placeholder="18" />
            <button id="vktt-btn-tuoi" class="vktt-btn">G\xE1n</button>
          </div>
        </div>
      </div>
      <div class="vktt-grid-2">
        <div class="vktt-field">
          <label class="vktt-label">C\u1ED1ng Hi\u1EBFn M\xF4n Ph\xE1i</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-ch" class="vktt-input" placeholder="99999" />
            <button id="vktt-btn-ch" class="vktt-btn">G\xE1n</button>
          </div>
        </div>
        <div class="vktt-field">
          <label class="vktt-label">C\xF4ng T\xEDch</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-ct" class="vktt-input" placeholder="99999" />
            <button id="vktt-btn-ct" class="vktt-btn">G\xE1n</button>
          </div>
        </div>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F31F} C\u1EA3nh Gi\u1EDBi & \u0110\u1ED9t Ph\xE1</div>
      <div class="vktt-field">
        <label class="vktt-label">Ch\u1ECDn C\u1EA3nh Gi\u1EDBi \u0110\u1EC9nh Phong</label>
        <div class="vktt-input-group">
          <select id="vktt-sel-cg" class="vktt-select" style="flex:1;">
            <option value="9">\u0110\u1ED9 Ki\u1EBFp \u0110\u1EC9nh Phong (Kim \u0110an Ph\u1EA9m 9)</option>
            <option value="8">\u0110\u1EA1i Th\u1EEBa \u0110\u1EC9nh Phong</option>
            <option value="7">H\u1EE3p Th\u1EC3 \u0110\u1EC9nh Phong</option>
            <option value="6">Luy\u1EC7n H\u01B0 \u0110\u1EC9nh Phong</option>
            <option value="5">H\xF3a Th\u1EA7n \u0110\u1EC9nh Phong</option>
            <option value="4">Nguy\xEAn Anh \u0110\u1EC9nh Phong</option>
            <option value="3">Kim \u0110an \u0110\u1EC9nh Phong</option>
            <option value="2">Tr\xFAc C\u01A1 \u0110\u1EC9nh Phong</option>
            <option value="1">Luy\u1EC7n Kh\xED</option>
          </select>
          <button id="vktt-btn-cg" class="vktt-btn vktt-btn-cyan">\u0110\u1ED9t Ph\xE1</button>
        </div>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F525} Th\u1EC3 Ch\u1EA5t & Linh C\u0103n</div>
      <div class="vktt-field">
        <label class="vktt-label">Ch\u1ECDn Th\u1EC3 Ch\u1EA5t T\u1ED1i Th\u01B0\u1EE3ng</label>
        <div class="vktt-input-group">
          <select id="vktt-sel-tc" class="vktt-select" style="flex:1;">
            <option value="the_chat.hon_don_dao_the">H\u1ED7n \u0110\u1ED9n \u0110\u1EA1o Th\u1EC3 (Khu\xF4n 10x10)</option>
            <option value="the_chat.tien_thien_thanh_the_dao_thai">Ti\xEAn Thi\xEAn Th\xE1nh Th\u1EC3 \u0110\u1EA1o Thai (10x10)</option>
            <option value="the_chat.thai_co_than_the">Th\xE1i C\u1ED5 Th\u1EA7n Th\u1EC3 (10x10)</option>
            <option value="the_chat.van_kiep_bat_diet_the">V\u1EA1n Ki\u1EBFp B\u1EA5t Di\u1EC7t Th\u1EC3 (10x10)</option>
            <option value="the_chat.am_duong_hon_don_the">\xC2m D\u01B0\u01A1ng H\u1ED7n \u0110\u1ED9n Th\u1EC3 (10x10)</option>
            <option value="the_chat.pham_the">Ph\xE0m Th\u1EC3 (M\u1EB7c \u0111\u1ECBnh)</option>
          </select>
          <button id="vktt-btn-tc" class="vktt-btn vktt-btn-purple">T\u1EA9y T\u1EE7y</button>
        </div>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F3C6} Lu\xE2n H\u1ED3i, L\xE3o \u0110\xF2 & Th\xE0nh T\u1EF1u</div>
      <button id="vktt-btn-all-achieve" class="vktt-btn vktt-btn-block">M\u1EDF Kh\xF3a To\xE0n B\u1ED9 17 L\xE3o \u0110\xF2 & 28 Th\xE0nh T\u1EF1u</button>
    </div>
  `;
  }
  function bindTabNhanVatEvents() {
    const btnTen = document.getElementById("vktt-btn-ten");
    if (btnTen) {
      btnTen.onclick = () => {
        const v = (document.getElementById("vktt-inp-ten")?.value || "").trim();
        if (v) {
          updateNhanVat({ ten: v });
          notify(`\u2705 \u0110\xE3 \u0111\u1ED5i \u0110\u1EA1o Hi\u1EC7u th\xE0nh: ${v}`);
        }
      };
    }
    const btnLt = document.getElementById("vktt-btn-lt");
    if (btnLt) {
      btnLt.onclick = () => {
        const v = parseInt(document.getElementById("vktt-inp-lt")?.value || "999999", 10);
        updateNhanVat({ linhThach: v });
        notify(`\u{1F48E} \u0110\xE3 g\xE1n Linh Th\u1EA1ch = ${v.toLocaleString()}!`);
      };
    }
    const btnTv = document.getElementById("vktt-btn-tv");
    if (btnTv) {
      btnTv.onclick = () => {
        const v = parseInt(document.getElementById("vktt-inp-tv")?.value || "999999", 10);
        updateNhanVat({ tuVi: v });
        notify(`\u2728 \u0110\xE3 g\xE1n Tu Vi = ${v.toLocaleString()}!`);
      };
    }
    const btnTnt = document.getElementById("vktt-btn-tnt");
    if (btnTnt) {
      btnTnt.onclick = () => {
        const v = parseInt(document.getElementById("vktt-inp-tnt")?.value || "5000", 10);
        updateNhanVat({ thoNguyenThem: v });
        notify(`\u23F3 \u0110\xE3 g\xE1n Th\u1ECD Nguy\xEAn Th\xEAm = +${v} n\u0103m!`);
      };
    }
    const btnTuoi = document.getElementById("vktt-btn-tuoi");
    if (btnTuoi) {
      btnTuoi.onclick = () => {
        const v = parseInt(document.getElementById("vktt-inp-tuoi")?.value || "18", 10);
        updateNhanVat({ tuoi: v });
        notify(`\u23F3 \u0110\xE3 g\xE1n Tu\u1ED5i = ${v}!`);
      };
    }
    const btnCh = document.getElementById("vktt-btn-ch");
    if (btnCh) {
      btnCh.onclick = () => {
        const v = parseInt(document.getElementById("vktt-inp-ch")?.value || "99999", 10);
        updateNhanVat({ congHien: v });
        notify(`\u{1F4DC} \u0110\xE3 g\xE1n C\u1ED1ng Hi\u1EBFn = ${v.toLocaleString()}!`);
      };
    }
    const btnCt = document.getElementById("vktt-btn-ct");
    if (btnCt) {
      btnCt.onclick = () => {
        const v = parseInt(document.getElementById("vktt-inp-ct")?.value || "99999", 10);
        const state = getGameState();
        if (!state || !state.run) return notify("\u26A0\uFE0F H\xE3y v\xE0o trong ki\u1EBFp tu ti\xEAn tr\u01B0\u1EDBc!");
        const run = copyObj(state.run);
        if (run.tongMon) run.tongMon = mergeObj(run.tongMon, { congTich: v });
        setGameState({ run });
        notify(`\u{1F3DB}\uFE0F \u0110\xE3 g\xE1n ${v.toLocaleString()} \u0111i\u1EC3m C\xF4ng T\xEDch! H\xE3y C\xE1o lui r\u1ED3i m\u1EDF l\u1EA1i Ch\u1EA5p s\u1EF1 \u0111\u01B0\u1EDDng.`);
      };
    }
    const btnCg = document.getElementById("vktt-btn-cg");
    if (btnCg) {
      btnCg.onclick = () => {
        const idx = parseInt(document.getElementById("vktt-sel-cg")?.value || "9", 10);
        setRealm(idx);
      };
    }
    const btnTc = document.getElementById("vktt-btn-tc");
    if (btnTc) {
      btnTc.onclick = () => {
        const tcKey = document.getElementById("vktt-sel-tc")?.value || "the_chat.hon_don_dao_the";
        setPhysique(tcKey);
      };
    }
    const btnAchieve = document.getElementById("vktt-btn-all-achieve");
    if (btnAchieve) {
      btnAchieve.onclick = unlockAllAchievementsAndFerrymen;
    }
  }
  function getTabKhoDoHtml() {
    return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u26A1 G\xF3i C\u1EF1c Ph\u1EA9m To\xE0n N\u0103ng</div>
      <button id="vktt-btn-godpack" class="vktt-btn vktt-btn-block" style="background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
        \u{1F451} K\xCDCH HO\u1EA0T G\xD3I TH\u1EA6N \u0110\u1EA0O (Ph\u1EA9m 8-9 + 99 Th\u1EA7n \u0110an)
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F50D} Th\xEAm V\u1EADt Ph\u1EA9m B\u1EA5t K\u1EF3</div>
      <div class="vktt-field">
        <label class="vktt-label">T\xECm theo t\xEAn ho\u1EB7c ID</label>
        <input type="text" id="vktt-search-item" class="vktt-input" placeholder="G\xF5 t\xEAn v\u1EADt ph\u1EA9m (Vd: b\xE0n \u0111\xE0o, ki\u1EBFm, ph\xF9...)" />
        <div id="vktt-item-results" class="vktt-dropdown-list" style="display:none;"></div>
      </div>
      <div class="vktt-field">
        <label class="vktt-label">ID V\u1EADt Ph\u1EA9m \u0110\xE3 Ch\u1ECDn</label>
        <input type="text" id="vktt-selected-item-id" class="vktt-input" placeholder="item.xxxx..." />
      </div>
      <div class="vktt-grid-2">
        <div class="vktt-field">
          <label class="vktt-label">S\u1ED1 L\u01B0\u1EE3ng</label>
          <input type="number" id="vktt-item-count" class="vktt-input" value="10" />
        </div>
        <div class="vktt-field" style="display:flex;align-items:flex-end;">
          <button id="vktt-btn-add-item" class="vktt-btn vktt-btn-cyan vktt-btn-block">Th\xEAm V\xE0o T\xFAi</button>
        </div>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F6E1}\uFE0F 6 \xD4 Trang B\u1ECB Chuy\xEAn D\u1EE5ng</div>
      <div class="vktt-grid-2">
        <button id="vktt-btn-eq-ring" class="vktt-btn vktt-btn-ghost">\u{1F48D} Nh\u1EABn C\xE0n Kh\xF4n</button>
        <button id="vktt-btn-eq-fire" class="vktt-btn vktt-btn-ghost">\u{1F525} C\u1EEDu U Ho\xE0ng H\u1ECFa</button>
        <button id="vktt-btn-eq-wing" class="vktt-btn vktt-btn-ghost">\u{1FABD} Ph\xF9 Di\xEAu S\xED</button>
        <button id="vktt-btn-eq-danlo" class="vktt-btn vktt-btn-ghost">\u2697\uFE0F \u0110an L\xF4 Ti\xEAn</button>
        <button id="vktt-btn-eq-pen" class="vktt-btn vktt-btn-ghost">\u{1F58C}\uFE0F Ph\xF9 B\xFAt Ti\xEAn</button>
        <button id="vktt-btn-eq-khi" class="vktt-btn vktt-btn-ghost">\u{1F528} Kh\xED L\xF4 Ti\xEAn</button>
      </div>
    </div>
  `;
  }
  function bindTabKhoDoEvents() {
    const btnGodPack = document.getElementById("vktt-btn-godpack");
    if (btnGodPack) btnGodPack.onclick = applyGodPack;
    const searchInp = document.getElementById("vktt-search-item");
    const resultsDiv = document.getElementById("vktt-item-results");
    const selectedIdInp = document.getElementById("vktt-selected-item-id");
    if (searchInp && resultsDiv && selectedIdInp) {
      let searchDebounce = null;
      searchInp.oninput = () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          const q = searchInp.value.trim();
          if (!q) {
            resultsDiv.style.display = "none";
            return;
          }
          const matches = searchItems(q, 25);
          if (matches.length === 0) {
            resultsDiv.innerHTML = '<div style="padding:10px;color:#94a3b8;font-size:12px;">Kh\xF4ng t\xECm th\u1EA5y v\u1EADt ph\u1EA9m n\xE0o.</div>';
            resultsDiv.style.display = "block";
            return;
          }
          resultsDiv.innerHTML = matches.map((item) => {
            const color = QUALITY_COLORS[item.quality] || "#a1a1aa";
            return `
            <div class="vktt-dropdown-item" data-id="${item.id}" data-name="${item.name}">
              <div>
                <span style="color:${color};font-weight:700;">${item.name}</span>
                <span style="color:#64748b;font-size:10px;margin-left:6px;">(${item.cat})</span>
              </div>
              <span class="vktt-quality-tag" style="background:${color};color:#000;">P.${item.quality}</span>
            </div>
          `;
          }).join("");
          resultsDiv.style.display = "block";
          resultsDiv.querySelectorAll(".vktt-dropdown-item").forEach((el) => {
            el.addEventListener("click", () => {
              const id = el.getAttribute("data-id") || "";
              const name = el.getAttribute("data-name") || "";
              selectedIdInp.value = id;
              searchInp.value = name;
              resultsDiv.style.display = "none";
            });
          });
        }, 150);
      };
    }
    const btnAdd = document.getElementById("vktt-btn-add-item");
    if (btnAdd && selectedIdInp) {
      btnAdd.onclick = () => {
        const id = selectedIdInp.value.trim();
        const count = parseInt(document.getElementById("vktt-item-count")?.value || "10", 10);
        addItem(id, count);
      };
    }
    const eqBtns = [
      ["vktt-btn-eq-ring", "tru_vat", "item.can_khon_gioi"],
      ["vktt-btn-eq-fire", "di_hoa", "item.cuu_u_hoang_hoa"],
      ["vktt-btn-eq-wing", "di_lai", "item.phu_dieu_si"],
      ["vktt-btn-eq-danlo", "luyen_dan", "item.dan_lo_tien"],
      ["vktt-btn-eq-pen", "che_phu", "item.phu_but_tien"],
      ["vktt-btn-eq-khi", "luyen_bao", "item.khi_lo_tien"]
    ];
    eqBtns.forEach(([btnId, slot, itemId]) => {
      const b = document.getElementById(btnId);
      if (b) {
        b.onclick = () => {
          const state = getGameState();
          if (!state?.run?.nhanVat) return notify("\u26A0\uFE0F Ch\u01B0a v\xE0o game!");
          const nhanVat = copyObj(state.run.nhanVat);
          const trangBi = copyObj(nhanVat.trangBi || {});
          trangBi[slot] = itemId;
          nhanVat.trangBi = trangBi;
          setGameState({ run: mergeObj(state.run, { nhanVat }) });
          notify(`\u{1F6E1}\uFE0F \u0110\xE3 trang b\u1ECB b\u1EA3o v\u1EADt: ${itemId}!`);
        };
      }
    });
  }
  function getTabKinhMachHtml() {
    return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F300} \u0110\xE3 Th\xF4ng Kinh M\u1EA1ch</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">
        T\u1EF1 \u0111\u1ED9ng t\xEDnh to\xE1n ma tr\u1EADn huy\u1EC7t \u0111\u1EA1o theo Th\u1EC3 Ch\u1EA5t hi\u1EC7n t\u1EA1i, m\u1EDF th\xF4ng to\xE0n b\u1ED9 m\xE0 kh\xF4ng g\xE2y crash h\xE0m <code>Lt(t, n)</code> c\u1EE7a game.
      </p>
      <button id="vktt-btn-meridian" class="vktt-btn vktt-btn-block" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%);">
        \u{1F300} \u0110\xC3 TH\xD4NG TO\xC0N B\u1ED8 HUY\u1EC6T \u0110\u1EA0O KINH M\u1EA0CH (100% An To\xE0n)
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F4DC} L\u0129nh Ng\u1ED9 To\xE0n Di\u1EC7n</div>
      <button id="vktt-btn-all-profs" class="vktt-btn vktt-btn-cyan vktt-btn-block" style="margin-bottom:8px;">
        \u2692\uFE0F H\u1ECDc To\xE0n B\u1ED9 Ngh\u1EC1 Nghi\u1EC7p C\u1EA5p 5 (T\xF4ng S\u01B0)
      </button>
      <button id="vktt-btn-all-recipes" class="vktt-btn vktt-btn-purple vktt-btn-block" style="margin-bottom:8px;">
        \u{1F525} L\u0129nh Ng\u1ED9 101 \u0110an Ph\u01B0\u01A1ng & \u0110\u1ED3 Ph\u1ED5
      </button>
      <button id="vktt-btn-all-skills" class="vktt-btn vktt-btn-block">
        \u26A1 H\u1ECDc 87 C\xF4ng Ph\xE1p & K\u1EF9 Ph\xE1p C\u1EF1c Ph\u1EA9m (C\u1EA5p 10)
      </button>
    </div>
  `;
  }
  function bindTabKinhMachEvents() {
    const btnM = document.getElementById("vktt-btn-meridian");
    if (btnM) btnM.onclick = unlockAllMeridians;
    const btnP = document.getElementById("vktt-btn-all-profs");
    if (btnP) btnP.onclick = unlockAllProfessions;
    const btnR = document.getElementById("vktt-btn-all-recipes");
    if (btnR) btnR.onclick = unlockAllRecipes;
    const btnS = document.getElementById("vktt-btn-all-skills");
    if (btnS) btnS.onclick = unlockAllSkills;
  }
  function getTabTuDongHtml() {
    const speed = getGameSpeed();
    const autoC = isAutoCultivateEnabled();
    const autoR = isAutoRecoveryEnabled();
    return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">\u26A1 T\u0103ng T\u1ED1c \u0110\u1ED9 Game (Speed Hack)</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        Tua nhanh t\u1ED1c \u0111\u1ED9 di chuy\u1EC3n tr\xEAn map v\xE0 v\xF2ng l\u1EB7p th\u1EDDi gian trong game.
      </p>
      <div class="vktt-grid-2" style="grid-template-columns: repeat(4, 1fr);gap:6px;">
        <button class="vktt-btn vktt-speed-btn ${speed === 1 ? "vktt-btn-cyan" : "vktt-btn-ghost"}" data-speed="1">1x (Chu\u1EA9n)</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 2 ? "vktt-btn-cyan" : "vktt-btn-ghost"}" data-speed="2">2x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 3 ? "vktt-btn-cyan" : "vktt-btn-ghost"}" data-speed="3">3x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 5 ? "vktt-btn-cyan" : "vktt-btn-ghost"}" data-speed="5">5x (Nhanh)</button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F9D8} T\u1EF1 \u0110\u1ED9ng Tu Luy\u1EC7n</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        T\u1EF1 \u0111\u1ED9ng t\u0103ng tu vi li\xEAn t\u1EE5c theo th\u1EDDi gian th\u1EF1c m\xE0 kh\xF4ng c\u1EA7n ng\u01B0\u1EDDi ch\u01A1i ph\u1EA3i canh b\u1EA5m.
      </p>
      <button id="vktt-btn-auto-cultivate" class="vktt-btn vktt-btn-block ${autoC ? "vktt-btn-red" : "vktt-btn-green"}">
        ${autoC ? "\u23F9\uFE0F D\u1EEANG T\u1EF1 \u0110\u1ED9ng Tu Luy\u1EC7n" : "\u25B6\uFE0F B\u1EAET \u0110\u1EA6U T\u1EF1 \u0110\u1ED9ng Tu Luy\u1EC7n"}
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F496} T\u1EF1 \u0110\u1ED9ng H\u1ED3i Ph\u1EE5c Sinh L\u1EF1c & Ch\xE2n Nguy\xEAn</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
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
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        T\u1EA3i to\xE0n b\u1ED9 ti\u1EBFn tr\xECnh tu ti\xEAn ra file JSON v\u1EC1 m\xE1y \u0111i\u1EC7n tho\u1EA1i c\u1EE7a b\u1EA1n.
      </p>
      <button id="vktt-btn-export-save" class="vktt-btn vktt-btn-cyan vktt-btn-block">
        \u{1F4E5} Xu\u1EA5t Save JSON V\u1EC1 M\xE1y
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">\u{1F4C2} N\u1EA1p File Save</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        Ch\u1ECDn file save JSON \u0111\xE3 xu\u1EA5t t\u1EEB tr\u01B0\u1EDBc \u0111\u1EC3 kh\xF4i ph\u1EE5c ti\u1EBFn tr\xECnh.
      </p>
      <input type="file" id="vktt-inp-save-file" accept=".json" style="display:none;" />
      <button id="vktt-btn-import-file" class="vktt-btn vktt-btn-purple vktt-btn-block" style="margin-bottom:8px;">
        \u{1F4E4} Ch\u1ECDn File Save JSON \u0110\u1EC3 N\u1EA1p
      </button>
      <div class="vktt-field">
        <label class="vktt-label">Ho\u1EB7c D\xE1n N\u1ED9i Dung Save JSON Tr\u1EF1c Ti\u1EBFp</label>
        <textarea id="vktt-txt-save" class="vktt-input" style="height:70px;padding:8px;font-size:11px;" placeholder='D\xE1n chu\u1ED7i JSON v\xE0o \u0111\xE2y...'></textarea>
        <button id="vktt-btn-import-text" class="vktt-btn vktt-btn-ghost vktt-btn-block" style="margin-top:6px;">
          Kh\xF4i Ph\u1EE5c T\u1EEB Chu\u1ED7i D\xE1n
        </button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr" style="color:#f87171;">\u26A0\uFE0F T\u1EA9y T\u1EE7y & Kh\xF4i Ph\u1EE5c Kh\u1EA9n C\u1EA5p</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
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
