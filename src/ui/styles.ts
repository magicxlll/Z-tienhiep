export const MOD_STYLES = `
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
