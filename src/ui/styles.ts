export const MOD_STYLES = `
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
`;
