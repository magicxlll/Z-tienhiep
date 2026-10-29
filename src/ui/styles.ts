export const MOD_STYLES = `/* ==========================================================================
   VẠN KIẾP TU TIÊN MOD ASSISTANT - CỔ PHONG XIANXIA DESIGN SYSTEM
   Inspired by & Authentically Unified with Web Game "Vạn Kiếp Tu Tiên"
   Aesthetics: Mực Nho (Deep Inkstone), Giấy Cổ (Aged Parchment), Chu Sa (Cinnabar Vermilion), Hoàng Kim (Antique Gold), Thanh Ngọc (Spiritual Jade)
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

/* NGỰ LINH CARD VARIANT */
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

/* ================= LINH CĂN GRID ================= */
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
