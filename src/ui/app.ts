import { MOD_STYLES } from './styles';
import { 
  notify, 
  updateNhanVat, 
  updateChiSo, 
  updateBatchChiSo,
  updateTongMon,
  addItem, 
  applyGodPack, 
  unlockAllProfessions, 
  unlockAllRecipes, 
  unlockAllSkills, 
  unlockAllMeridians, 
  setRealm, 
  setExtraRealm,
  setPhysique, 
  setLinhCan,
  resetLinhCan,
  updateMetaLuanHoi,
  unlockAllAchievementsAndFerrymen 
} from '../core/mutator';
import { searchItems } from '../data/items';
import { QUALITY_COLORS, THE_CHAT_DB, PRESET_ITEMS } from '../data/presets';
import { 
  setGameSpeed, 
  getGameSpeed, 
  toggleAutoCultivate, 
  isAutoCultivateEnabled, 
  toggleAutoRecovery, 
  isAutoRecoveryEnabled 
} from '../modules/automation';
import { exportSaveFile, importSaveJson, clearGameCache } from '../modules/backup';
import { getGameState, copyObj, mergeObj, setGameState, persistGameSave } from '../core/bridge';

export function initUI(): void {
  // 1. Inject Styles
  const styleEl = document.createElement('style');
  styleEl.innerText = MOD_STYLES;
  document.head.appendChild(styleEl);

  // 2. Inject FAB
  const fab = document.createElement('div');
  fab.id = 'vktt-fab';
  fab.innerHTML = '☯';
  fab.title = 'Vạn Kiếp Tu Tiên MOD v3.0';
  document.body.appendChild(fab);

  // 3. Inject Backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'vktt-backdrop';
  document.body.appendChild(backdrop);

  // 4. Inject Bottom Sheet Drawer
  const drawer = document.createElement('div');
  drawer.id = 'vktt-drawer';
  drawer.innerHTML = `
    <div class="vktt-drag-handle">
      <div class="vktt-drag-bar"></div>
    </div>
    <div class="vktt-header">
      <div class="vktt-title-wrap">
        <span class="vktt-title vktt-rainbow">VẠN KIẾP TU TIÊN</span>
        <span class="vktt-badge">v3.0 PRO</span>
      </div>
      <button class="vktt-close-btn" id="vktt-btn-close">✕</button>
    </div>
    <div class="vktt-tabs">
      <button class="vktt-tab-btn active" data-tab="tab-nhan-vat">👑 Nhân Vật</button>
      <button class="vktt-tab-btn" data-tab="tab-kho-do">🎒 Kho Đồ</button>
      <button class="vktt-tab-btn" data-tab="tab-kinh-mach">📜 Kinh Mạch</button>
      <button class="vktt-tab-btn" data-tab="tab-tu-dong">⚡ Tự Động</button>
      <button class="vktt-tab-btn" data-tab="tab-sao-luu">💾 Sao Lưu</button>
    </div>
    <div class="vktt-content" id="vktt-tab-content">
      <!-- DYNAMIC TAB PANELS WILL BE RENDERED HERE -->
    </div>
  `;
  document.body.appendChild(drawer);

  // Setup FAB touch dragging along edges
  setupFabTouchDrag(fab);

  // Toggle Drawer
  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    const activeTab = drawer.querySelector('.vktt-tab-btn.active')?.getAttribute('data-tab') || 'tab-nhan-vat';
    renderTabContent(activeTab);
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }

  fab.onclick = (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  backdrop.onclick = closeDrawer;
  const closeBtn = document.getElementById('vktt-btn-close');
  if (closeBtn) closeBtn.onclick = closeDrawer;

  // Setup Tabs
  const tabBtns = drawer.querySelectorAll<HTMLButtonElement>('.vktt-tab-btn');
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      renderTabContent(tabId || 'tab-nhan-vat');
    };
  });

  // Render initial tab
  renderTabContent('tab-nhan-vat');
}

function setupFabTouchDrag(fab: HTMLElement) {
  let isDragging = false;
  let startY = 0;
  let currentY = 0;
  let initialBottom = 80;

  fab.addEventListener('touchstart', (e) => {
    isDragging = false;
    startY = e.touches[0].clientY;
  }, { passive: true });

  fab.addEventListener('touchmove', (e) => {
    currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    if (Math.abs(deltaY) > 8) {
      isDragging = true;
      const newBottom = Math.max(20, Math.min(window.innerHeight - 70, initialBottom + deltaY));
      fab.style.bottom = `${newBottom}px`;
    }
  }, { passive: true });

  fab.addEventListener('touchend', () => {
    if (isDragging) {
      initialBottom = parseInt(fab.style.bottom || '80', 10);
    }
  });
}

function readInputOrPlaceholder(id: string, fallbackVal: number): number {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (!el) return fallbackVal;
  const v = parseInt(el.value, 10);
  if (!isNaN(v)) return v;
  const p = parseInt(el.placeholder, 10);
  return !isNaN(p) ? p : fallbackVal;
}

function renderTabContent(tabId: string): void {
  const container = document.getElementById('vktt-tab-content');
  if (!container) return;

  if (tabId === 'tab-nhan-vat') {
    container.innerHTML = getTabNhanVatHtml();
    bindTabNhanVatEvents();
  } else if (tabId === 'tab-kho-do') {
    container.innerHTML = getTabKhoDoHtml();
    bindTabKhoDoEvents();
  } else if (tabId === 'tab-kinh-mach') {
    container.innerHTML = getTabKinhMachHtml();
    bindTabKinhMachEvents();
  } else if (tabId === 'tab-tu-dong') {
    container.innerHTML = getTabTuDongHtml();
    bindTabTuDongEvents();
  } else if (tabId === 'tab-sao-luu') {
    container.innerHTML = getTabSaoLuuHtml();
    bindTabSaoLuuEvents();
  }
}

/* ================= TAB 1: NHÂN VẬT ================= */
function getTabNhanVatHtml(): string {
  const state = getGameState();
  const nv = state?.run?.nhanVat || {};
  const meta = state?.meta || {};
  const cs = nv.chiSo || {};

  const REALM_NAMES: Record<number, string> = {
    0: 'Phàm Nhân', 1: 'Luyện Khí', 2: 'Trúc Cơ', 3: 'Kết Đan', 4: 'Nguyên Anh', 5: 'Hóa Thần'
  };
  const SUB_NAMES: Record<number, string> = {
    0: 'Sơ kỳ', 1: 'Trung kỳ', 2: 'Hậu kỳ', 3: 'Đại viên mãn'
  };

  const realmStr = `${REALM_NAMES[nv.canhGioi] || 'Chưa rõ'} (${SUB_NAMES[nv.tieuCanhGioi] || '0'})`;
  const tcName = THE_CHAT_DB[nv.theChat]?.ten || nv.theChat || 'Phàm thể';
  const lcPham = (nv.linhCan?.pham || 'Chưa có').toUpperCase();
  const lcHe = (nv.linhCan?.he && nv.linhCan.he.length) ? nv.linhCan.he.join('/') : 'Vô';
  const congTichVal = state?.run?.tongMon?.congTich ?? 0;

  return `
    <!-- BẢNG TỔNG QUAN CHỈ SỐ NHÂN VẬT HIỆN TẠI -->
    <div class="vktt-stat-overview">
      <div>💎 Linh Thạch: <b>${(nv.linhThach || 0).toLocaleString()}</b></div>
      <div>✨ Tu Vi: <b>${Math.floor(nv.tuVi || 0).toLocaleString()}</b></div>
      <div>⚡ Cảnh Giới: <b style="color:#e5b869;">${realmStr}</b></div>
      <div>⏳ Tuổi: <b>${Math.floor(nv.tuoi || 18)}</b></div>
      <div>📜 Cống Hiến: <b>${(nv.congHien || 0).toLocaleString()}</b></div>
      <div>🏛️ Công Tích: <b style="color:#38bdf8;">${congTichVal.toLocaleString()}</b></div>
      <div style="grid-column: span 2;">🧬 Thể Chất: <b style="color:#e5b869;">${tcName}</b></div>
      <div style="grid-column: span 2;">🌱 Linh Căn: <b style="color:#38bdf8;">${lcPham} (${lcHe})</b></div>
    </div>

    <!-- NÚT BUFF NHANH TOÀN DIỆN -->
    <div style="display:flex;gap:6px;margin-bottom:8px;">
      <button id="vktt-btn-all-in-one" class="vktt-btn" style="flex:1;">🚀 Siêu Buff Toàn Diện 1-Click</button>
      <button id="vktt-btn-clear-binh-canh" class="vktt-btn vktt-btn-cyan">💊 Xóa Bình Cảnh</button>
    </div>

    <!-- KHỐI 1: TÀI NGUYÊN & MÔN PHÁI -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">💰 1. Tài Nguyên, Tuổi Thọ & Môn Phái</div>
      <div class="vktt-row">
        <span class="vktt-lbl">Đạo Hiệu:</span>
        <input type="text" id="vktt-inp-ten" class="vktt-inp" placeholder="${nv.ten || 'Đạo Hữu'}" />
        <button id="vktt-btn-ten" class="vktt-btn vktt-btn-sm">Đổi</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Linh Thạch:</span>
        <input type="number" id="vktt-inp-lt" class="vktt-inp" placeholder="${nv.linhThach || 999999}" />
        <button id="vktt-btn-lt" class="vktt-btn vktt-btn-sm">Gán</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Tu Vi:</span>
        <input type="number" id="vktt-inp-tv" class="vktt-inp" placeholder="${Math.floor(nv.tuVi || 999999)}" />
        <button id="vktt-btn-tv" class="vktt-btn vktt-btn-sm">Gán</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Thọ Nguyên+:</span>
        <input type="number" id="vktt-inp-tnt" class="vktt-inp" placeholder="${nv.thoNguyenThem || 5000}" />
        <button id="vktt-btn-tnt" class="vktt-btn vktt-btn-sm">Gán</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Tuổi:</span>
        <input type="number" id="vktt-inp-tuoi" class="vktt-inp" placeholder="${Math.floor(nv.tuoi || 18)}" />
        <button id="vktt-btn-tuoi" class="vktt-btn vktt-btn-sm">Gán</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Cống Hiến:</span>
        <input type="number" id="vktt-inp-ch" class="vktt-inp" placeholder="${nv.congHien || 99999}" />
        <button id="vktt-btn-ch" class="vktt-btn vktt-btn-sm">Gán</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Công Tích:</span>
        <input type="number" id="vktt-inp-ct" class="vktt-inp" placeholder="${congTichVal || 99999}" />
        <button id="vktt-btn-ct" class="vktt-btn vktt-btn-sm">Gán</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Chức Vị Phái:</span>
        <select id="vktt-sel-capbac" class="vktt-select" style="flex:1;">
          <option value="0">0 - Ngoại Môn / Tán Tu</option>
          <option value="1">1 - Đệ Tử Nội Môn</option>
          <option value="2">2 - Chân Truyền Đệ Tử</option>
          <option value="3">3 - Chấp Sự / Đường Chủ</option>
          <option value="4" selected>4 - Trưởng Lão</option>
          <option value="5">5 - Thái Thượng Trưởng Lão</option>
        </select>
        <button id="vktt-btn-capbac" class="vktt-btn vktt-btn-sm">Gán</button>
      </div>
    </div>

    <!-- KHỐI 2: CẢNH GIỚI, KIM ĐAN, Ý CẢNH & DỊ TƯỢNG -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">🌟 2. Cảnh Giới & Đột Phá</div>
      <div class="vktt-row">
        <span class="vktt-lbl">Đại Cảnh Giới:</span>
        <select id="vktt-sel-cg" class="vktt-select" style="flex:1;">
          <option value="5" ${nv.canhGioi === 5 ? 'selected' : ''}>5 - Hóa Thần</option>
          <option value="4" ${nv.canhGioi === 4 ? 'selected' : ''}>4 - Nguyên Anh</option>
          <option value="3" ${nv.canhGioi === 3 ? 'selected' : ''}>3 - Kết Đan (Kim Đan)</option>
          <option value="2" ${nv.canhGioi === 2 ? 'selected' : ''}>2 - Trúc Cơ</option>
          <option value="1" ${nv.canhGioi === 1 ? 'selected' : ''}>1 - Luyện Khí</option>
          <option value="0" ${nv.canhGioi === 0 ? 'selected' : ''}>0 - Phàm Nhân</option>
        </select>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Tiểu Cảnh Giới:</span>
        <select id="vktt-sel-tcg" class="vktt-select" style="flex:1;">
          <option value="3" ${nv.tieuCanhGioi === 3 ? 'selected' : ''}>3 - Đại viên mãn</option>
          <option value="2" ${nv.tieuCanhGioi === 2 ? 'selected' : ''}>2 - Hậu kỳ</option>
          <option value="1" ${nv.tieuCanhGioi === 1 ? 'selected' : ''}>1 - Trung kỳ</option>
          <option value="0" ${nv.tieuCanhGioi === 0 ? 'selected' : ''}>0 - Sơ kỳ</option>
        </select>
        <button id="vktt-btn-cg" class="vktt-btn vktt-btn-cyan vktt-btn-sm">Đột Phá</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Kim Đan / Ý:</span>
        <select id="vktt-sel-kimdan" class="vktt-select" style="flex:1;">
          <option value="1" ${nv.kimDan === 1 ? 'selected' : ''}>Kim Đan Nhất Phẩm</option>
          <option value="2" ${nv.kimDan === 2 ? 'selected' : ''}>Nhị Phẩm</option>
          <option value="3" ${nv.kimDan === 3 ? 'selected' : ''}>Tam Phẩm</option>
          <option value="4" ${nv.kimDan === 4 ? 'selected' : ''}>Tứ Phẩm</option>
          <option value="5" ${nv.kimDan === 5 ? 'selected' : ''}>Ngũ Phẩm</option>
        </select>
        <select id="vktt-sel-ycanh" class="vktt-select" style="flex:1;">
          <option value="Kiếm ý" ${nv.yCanh === 'Kiếm ý' ? 'selected' : ''}>Kiếm ý</option>
          <option value="Lôi ý" ${nv.yCanh === 'Lôi ý' ? 'selected' : ''}>Lôi ý</option>
          <option value="Băng ý" ${nv.yCanh === 'Băng ý' ? 'selected' : ''}>Băng ý</option>
          <option value="Phong ý" ${nv.yCanh === 'Phong ý' ? 'selected' : ''}>Phong ý</option>
          <option value="Từ bi" ${nv.yCanh === 'Từ bi' ? 'selected' : ''}>Từ bi</option>
          <option value="Hư vô ý" ${nv.yCanh === 'Hư vô ý' ? 'selected' : ''}>Hư vô ý</option>
          <option value="Hỏa ý" ${nv.yCanh === 'Hỏa ý' ? 'selected' : ''}>Hỏa ý</option>
        </select>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Dị Tượng / Túc:</span>
        <select id="vktt-sel-dituong" class="vktt-select" style="flex:1;">
          <option value="kim" ${nv.diTuong === 'kim' ? 'selected' : ''}>Kiếm Anh (Kim)</option>
          <option value="loi" ${nv.diTuong === 'loi' ? 'selected' : ''}>Lôi Anh (Lôi)</option>
          <option value="bang" ${nv.diTuong === 'bang' ? 'selected' : ''}>Băng Anh (Băng)</option>
          <option value="phong" ${nv.diTuong === 'phong' ? 'selected' : ''}>Phong Anh</option>
          <option value="hoa" ${nv.diTuong === 'hoa' ? 'selected' : ''}>Xích Diễm Anh</option>
          <option value="moc" ${nv.diTuong === 'moc' ? 'selected' : ''}>Thanh Liên Anh</option>
          <option value="thuy" ${nv.diTuong === 'thuy' ? 'selected' : ''}>Huyền Thủy Anh</option>
          <option value="tho" ${nv.diTuong === 'tho' ? 'selected' : ''}>Hậu Thổ Anh</option>
        </select>
        <input type="number" id="vktt-inp-tuctue" class="vktt-inp" step="0.1" placeholder="${nv.tucTue || 1.0}" style="width:50px;flex:none;" />
        <button id="vktt-btn-extra-realm" class="vktt-btn vktt-btn-sm">Lưu</button>
      </div>
    </div>

    <!-- KHỐI 3: THỂ CHẤT (6 THỂ CHẤT GỐC) & LINH CĂN -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">🧬 3. Thể Chất Chuẩn Game & Linh Căn</div>
      <div class="vktt-row">
        <select id="vktt-sel-tc" class="vktt-select" style="flex:1;">
          <option value="the_chat.hoang_co" ${nv.theChat === 'the_chat.hoang_co' ? 'selected' : ''}>👑 Hoang Cổ Thánh Thể (121 ô)</option>
          <option value="the_chat.cuu_am" ${nv.theChat === 'the_chat.cuu_am' ? 'selected' : ''}>❄️ Cửu Âm Tuyệt Mạch (Băng)</option>
          <option value="the_chat.kiem_cot" ${nv.theChat === 'the_chat.kiem_cot' ? 'selected' : ''}>⚔️ Kiếm Cốt Thể (Kiếm +25%)</option>
          <option value="the_chat.bach_thao" ${nv.theChat === 'the_chat.bach_thao' ? 'selected' : ''}>🌿 Bách Thảo Thể (Đan tu)</option>
          <option value="the_chat.thiet_cot" ${nv.theChat === 'the_chat.thiet_cot' ? 'selected' : ''}>🛡️ Thiết Cốt Thể (Khí huyết)</option>
          <option value="the_chat.pham_the" ${nv.theChat === 'the_chat.pham_the' ? 'selected' : ''}>👤 Phàm Thể</option>
        </select>
        <button id="vktt-btn-tc" class="vktt-btn vktt-btn-purple vktt-btn-sm">Gán Thể Chất</button>
      </div>

      <div style="margin-top:6px;padding-top:6px;border-top:1px dashed rgba(229,184,105,0.25);">
        <label class="vktt-label">Tích chọn Hệ Linh Căn:</label>
        <div class="vktt-linhcan-grid">
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="kim" ${nv.linhCan?.he?.includes('kim') ? 'checked' : ''}> ⚔️Kim</label>
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="moc" ${nv.linhCan?.he?.includes('moc') ? 'checked' : ''}> 🌿Mộc</label>
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="thuy" ${nv.linhCan?.he?.includes('thuy') ? 'checked' : ''}> 💧Thủy</label>
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="hoa" ${nv.linhCan?.he?.includes('hoa') ? 'checked' : ''}> 🔥Hỏa</label>
          <label class="vktt-chk-label"><input type="checkbox" name="vktt-lc-he" value="tho" ${nv.linhCan?.he?.includes('tho') ? 'checked' : ''}> ⛰️Thổ</label>
          <label class="vktt-chk-label" style="color:#70dbff;"><input type="checkbox" name="vktt-lc-he" value="bang" ${nv.linhCan?.he?.includes('bang') ? 'checked' : ''}> ❄️Băng</label>
          <label class="vktt-chk-label" style="color:#aaffaa;"><input type="checkbox" name="vktt-lc-he" value="phong" ${nv.linhCan?.he?.includes('phong') ? 'checked' : ''}> 🌪️Phong</label>
          <label class="vktt-chk-label" style="color:#ffff70;"><input type="checkbox" name="vktt-lc-he" value="loi" ${nv.linhCan?.he?.includes('loi') ? 'checked' : ''}> ⚡Lôi</label>
        </div>
        <div style="display:flex;gap:6px;margin-top:6px;">
          <button id="vktt-btn-gan-lc" class="vktt-btn vktt-btn-green vktt-btn-sm" style="flex:1;">🌱 Gán Linh Căn & Màu Mạch</button>
          <button id="vktt-btn-go-lc" class="vktt-btn vktt-btn-ghost vktt-btn-sm">Gỡ (Vô)</button>
        </div>
      </div>
    </div>

    <!-- KHỐI 4: THẤT ĐẠI CHỈ SỐ TU CHÂN (TÍCH CHỌN THUỘC TÍNH) -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">
        <span>📊 4. Thất Đại Chỉ Số Tu Chân</span>
        <button id="vktt-btn-toggle-all-stat" class="vktt-btn vktt-btn-ghost" style="height:24px;padding:0 7px;font-size:10.5px;">Tích Tất Cả</button>
      </div>

      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="ngo_tinh" checked> 💡 Ngộ tính:</label>
        <input type="number" id="vktt-inp-ngo-tinh" class="vktt-inp" placeholder="${cs.ngo_tinh || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="ngo_tinh">Gán</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="can_cot" checked> 🦴 Căn cốt:</label>
        <input type="number" id="vktt-inp-can-cot" class="vktt-inp" placeholder="${cs.can_cot || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="can_cot">Gán</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="dao_tam" checked> 🧘 Đạo tâm:</label>
        <input type="number" id="vktt-inp-dao-tam" class="vktt-inp" placeholder="${cs.dao_tam || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="dao_tam">Gán</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="than_phap" checked> ⚡ Thân pháp:</label>
        <input type="number" id="vktt-inp-than-phap" class="vktt-inp" placeholder="${cs.than_phap || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="than_phap">Gán</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="khi_van" checked> 🍀 Khí vận:</label>
        <input type="number" id="vktt-inp-khi-van" class="vktt-inp" placeholder="${cs.khi_van || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="khi_van">Gán</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="tam_ma"> 👹 Tâm ma:</label>
        <input type="number" id="vktt-inp-tam-ma" class="vktt-inp" placeholder="${cs.tam_ma || 0}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="tam_ma">Gán</button>
      </div>
      <div class="vktt-stat-row">
        <label class="vktt-stat-chk-wrap"><input type="checkbox" class="vktt-stat-chk" data-stat="than_thuc" checked> 👁️ Thần thức:</label>
        <input type="number" id="vktt-inp-than-thuc" class="vktt-inp" placeholder="${cs.than_thuc || 500}">
        <button class="vktt-btn vktt-btn-sm vktt-btn-set-stat" data-stat="than_thuc">Gán</button>
      </div>

      <div style="display:flex;gap:6px;margin-top:8px;">
        <button id="vktt-btn-stat-200" class="vktt-btn vktt-btn-cyan vktt-btn-sm" style="flex:1;">⚡ Đã Tích = 200</button>
        <button id="vktt-btn-stat-600" class="vktt-btn vktt-btn-sm" style="flex:1;">🔥 Đã Tích = 600</button>
      </div>
      <button id="vktt-btn-clear-tam-ma" class="vktt-btn vktt-btn-ghost vktt-btn-block" style="margin-top:5px;height:30px;font-size:11px;">
        🧹 Xóa Sạch Tâm Ma (= 0)
      </button>
    </div>

    <!-- KHỐI 5: LUÂN HỒI, LÃO ĐÒ & THÀNH TỰU -->
    <div class="vktt-card">
      <div class="vktt-card-hdr">🌌 5. Điểm Luân Hồi, Lão Đò & Thành Tựu</div>
      <div class="vktt-row">
        <span class="vktt-lbl">Điểm Luân Hồi:</span>
        <input type="number" id="vktt-inp-dlh" class="vktt-inp" placeholder="${meta.diemLuanHoi || 999999}" />
        <button id="vktt-btn-dlh" class="vktt-btn vktt-btn-sm">Gán</button>
      </div>
      <div class="vktt-row">
        <span class="vktt-lbl">Số Kiếp:</span>
        <input type="number" id="vktt-inp-kiep" class="vktt-inp" placeholder="${meta.kiep || 38}" />
        <button id="vktt-btn-kiep" class="vktt-btn vktt-btn-sm">Gán</button>
      </div>
      <button id="vktt-btn-all-achieve" class="vktt-btn vktt-btn-purple vktt-btn-block" style="margin-top:6px;">
        🌌 Max 999,999 Điểm + Mở Khóa 17 Lão Đò & 28 Thành Tựu
      </button>
    </div>
  `;
}

function bindTabNhanVatEvents(): void {
  // 1. Tài nguyên
  const btnTen = document.getElementById('vktt-btn-ten');
  if (btnTen) {
    btnTen.onclick = () => {
      const inp = document.getElementById('vktt-inp-ten') as HTMLInputElement;
      const v = (inp?.value || inp?.placeholder || '').trim();
      if (v) { updateNhanVat({ ten: v }); notify(`✅ Đã đổi Đạo Hiệu thành: ${v}`); renderTabContent('tab-nhan-vat'); }
    };
  }

  const btnLt = document.getElementById('vktt-btn-lt');
  if (btnLt) {
    btnLt.onclick = () => {
      const v = readInputOrPlaceholder('vktt-inp-lt', 999999);
      updateNhanVat({ linhThach: v });
      notify(`💎 Đã gán Linh Thạch = ${v.toLocaleString()}!`);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnTv = document.getElementById('vktt-btn-tv');
  if (btnTv) {
    btnTv.onclick = () => {
      const v = readInputOrPlaceholder('vktt-inp-tv', 999999);
      updateNhanVat({ tuVi: v });
      notify(`✨ Đã gán Tu Vi = ${v.toLocaleString()}!`);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnTnt = document.getElementById('vktt-btn-tnt');
  if (btnTnt) {
    btnTnt.onclick = () => {
      const v = readInputOrPlaceholder('vktt-inp-tnt', 5000);
      updateNhanVat({ thoNguyenThem: v });
      notify(`⏳ Đã gán Thọ Nguyên Thêm = +${v} năm!`);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnTuoi = document.getElementById('vktt-btn-tuoi');
  if (btnTuoi) {
    btnTuoi.onclick = () => {
      const v = readInputOrPlaceholder('vktt-inp-tuoi', 18);
      updateNhanVat({ tuoi: v });
      notify(`⏳ Đã gán Tuổi = ${v}!`);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnCh = document.getElementById('vktt-btn-ch');
  if (btnCh) {
    btnCh.onclick = () => {
      const v = readInputOrPlaceholder('vktt-inp-ch', 99999);
      updateNhanVat({ congHien: v });
      notify(`📜 Đã gán Cống Hiến = ${v.toLocaleString()}!`);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnCt = document.getElementById('vktt-btn-ct');
  if (btnCt) {
    btnCt.onclick = () => {
      const v = readInputOrPlaceholder('vktt-inp-ct', 99999);
      updateTongMon(v);
      notify(`🏛️ Đã gán ${v.toLocaleString()} điểm Công Tích! Hãy Cáo lui rồi mở lại Chấp sự đường.`);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnCapbac = document.getElementById('vktt-btn-capbac');
  if (btnCapbac) {
    btnCapbac.onclick = () => {
      const sel = document.getElementById('vktt-sel-capbac') as HTMLSelectElement;
      const cb = parseInt(sel?.value || '4', 10);
      const curCt = readInputOrPlaceholder('vktt-inp-ct', 5000);
      updateTongMon(curCt, cb);
      notify(`🏛️ Đã gán Chức Vị Tông Môn = Cấp ${cb}!`);
      renderTabContent('tab-nhan-vat');
    };
  }

  // 2. Cảnh Giới
  const btnCg = document.getElementById('vktt-btn-cg');
  if (btnCg) {
    btnCg.onclick = () => {
      const cg = parseInt((document.getElementById('vktt-sel-cg') as HTMLSelectElement)?.value || '5', 10);
      const tcg = parseInt((document.getElementById('vktt-sel-tcg') as HTMLSelectElement)?.value || '3', 10);
      setRealm(cg, tcg);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnExtraRealm = document.getElementById('vktt-btn-extra-realm');
  if (btnExtraRealm) {
    btnExtraRealm.onclick = () => {
      const kd = parseInt((document.getElementById('vktt-sel-kimdan') as HTMLSelectElement)?.value || '1', 10);
      const yc = (document.getElementById('vktt-sel-ycanh') as HTMLSelectElement)?.value || 'Kiếm ý';
      const dt = (document.getElementById('vktt-sel-dituong') as HTMLSelectElement)?.value || 'kim';
      const tt = parseFloat((document.getElementById('vktt-inp-tuctue') as HTMLInputElement)?.value || '1.0');
      setExtraRealm(kd, yc, dt, tt);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnClearBinhCanh = document.getElementById('vktt-btn-clear-binh-canh');
  if (btnClearBinhCanh) {
    btnClearBinhCanh.onclick = () => {
      updateNhanVat({ binhCanh: 0, thuongThe: 0 });
      notify('💊 Đã xóa sạch Bình Cảnh & Thương Thế!');
      renderTabContent('tab-nhan-vat');
    };
  }

  // 3. Thể Chất & Linh Căn
  const btnTc = document.getElementById('vktt-btn-tc');
  if (btnTc) {
    btnTc.onclick = () => {
      const tcKey = (document.getElementById('vktt-sel-tc') as HTMLSelectElement)?.value || 'the_chat.hoang_co';
      setPhysique(tcKey);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnGanLc = document.getElementById('vktt-btn-gan-lc');
  if (btnGanLc) {
    btnGanLc.onclick = () => {
      const chks = document.querySelectorAll<HTMLInputElement>('input[name="vktt-lc-he"]:checked');
      const sel: string[] = [];
      chks.forEach(c => sel.push(c.value));
      setLinhCan(sel);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnGoLc = document.getElementById('vktt-btn-go-lc');
  if (btnGoLc) {
    btnGoLc.onclick = () => {
      resetLinhCan();
      renderTabContent('tab-nhan-vat');
    };
  }

  // 4. Thất Đại Chỉ Số
  const statBtns = document.querySelectorAll<HTMLButtonElement>('.vktt-btn-set-stat');
  statBtns.forEach(btn => {
    btn.onclick = () => {
      const statKey = btn.getAttribute('data-stat');
      if (!statKey) return;
      const domKey = statKey.replace('_', '-');
      const v = readInputOrPlaceholder(`vktt-inp-${domKey}`, statKey === 'tam_ma' ? 0 : 500);
      updateChiSo(statKey, v);
      notify(`📊 Đã gán ${statKey} = ${v}!`);
      renderTabContent('tab-nhan-vat');
    };
  });

  const btnToggleAllStat = document.getElementById('vktt-btn-toggle-all-stat');
  if (btnToggleAllStat) {
    let allCheckedState = false;
    btnToggleAllStat.onclick = () => {
      const chks = document.querySelectorAll<HTMLInputElement>('.vktt-stat-chk');
      allCheckedState = !allCheckedState;
      chks.forEach(c => c.checked = allCheckedState);
      btnToggleAllStat.innerText = allCheckedState ? 'Bỏ Tích Hết' : 'Tích Tất Cả';
    };
  }

  function applyCheckedStats(val: number) {
    const chks = document.querySelectorAll<HTMLInputElement>('.vktt-stat-chk:checked');
    if (!chks.length) {
      return notify('⚠️ Hãy tích chọn ít nhất 1 thuộc tính để gán!');
    }
    const patch: Record<string, number> = {};
    chks.forEach(c => {
      const stat = c.getAttribute('data-stat');
      if (stat) patch[stat] = (stat === 'tam_ma' ? 0 : val);
    });
    updateBatchChiSo(patch);
    notify(`⚡ Đã gán ${Object.keys(patch).length} chỉ số đã tích = ${val}!`);
    renderTabContent('tab-nhan-vat');
  }

  const btnStat200 = document.getElementById('vktt-btn-stat-200');
  if (btnStat200) btnStat200.onclick = () => applyCheckedStats(200);

  const btnStat600 = document.getElementById('vktt-btn-stat-600');
  if (btnStat600) btnStat600.onclick = () => applyCheckedStats(600);

  const btnClearTamMa = document.getElementById('vktt-btn-clear-tam-ma');
  if (btnClearTamMa) {
    btnClearTamMa.onclick = () => {
      updateChiSo('tam_ma', 0);
      notify('🧹 Đã xóa sạch Tâm Ma = 0!');
      renderTabContent('tab-nhan-vat');
    };
  }

  // 5. Luân Hồi, Lão Đò & Thành Tựu
  const btnDlh = document.getElementById('vktt-btn-dlh');
  if (btnDlh) {
    btnDlh.onclick = () => {
      const v = readInputOrPlaceholder('vktt-inp-dlh', 999999);
      updateMetaLuanHoi(v);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnKiep = document.getElementById('vktt-btn-kiep');
  if (btnKiep) {
    btnKiep.onclick = () => {
      const state = getGameState();
      const curDiem = state?.meta?.diemLuanHoi || 999999;
      const v = readInputOrPlaceholder('vktt-inp-kiep', 38);
      updateMetaLuanHoi(curDiem, v);
      renderTabContent('tab-nhan-vat');
    };
  }

  const btnAchieve = document.getElementById('vktt-btn-all-achieve');
  if (btnAchieve) {
    btnAchieve.onclick = () => {
      unlockAllAchievementsAndFerrymen();
      renderTabContent('tab-nhan-vat');
    };
  }

  // 6. Siêu Buff Toàn Diện
  const btnAllInOne = document.getElementById('vktt-btn-all-in-one');
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
      notify('🚀 SIÊU BUFF TOÀN DIỆN THÀNH CÔNG! Đầy đủ linh thạch, tu vi, chỉ số 600, nghề, đan phương, kinh mạch & thành tựu!');
      renderTabContent('tab-nhan-vat');
    };
  }
}

/* ================= TAB 2: KHO ĐỒ ================= */
function getTabKhoDoHtml(): string {
  return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">⚡ Gói Cực Phẩm Toàn Năng</div>
      <button id="vktt-btn-godpack" class="vktt-btn vktt-btn-block" style="background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
        👑 KÍCH HOẠT GÓI THẦN ĐẠO (Phẩm 8-9 + 99 Thần Đan)
      </button>
      <div style="display:flex;gap:6px;margin-top:6px;">
        <button id="vktt-btn-all-items" class="vktt-btn vktt-btn-cyan" style="flex:1;">🌟 Nhận 422+ Vật Phẩm</button>
        <button id="vktt-btn-bag-99" class="vktt-btn vktt-btn-ghost" style="flex:1;">🔢 Mọi Đồ x99</button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">🔍 Thêm Vật Phẩm Bất Kỳ</div>
      <div class="vktt-field">
        <label class="vktt-label">Tìm theo tên hoặc ID</label>
        <input type="text" id="vktt-search-item" class="vktt-inp" placeholder="Gõ tên vật phẩm (Vd: bàn đào, kiếm, phù...)" style="width:100%;" />
        <div id="vktt-item-results" class="vktt-dropdown-list" style="display:none;"></div>
      </div>
      <div class="vktt-field" style="margin-top:6px;">
        <label class="vktt-label">ID Vật Phẩm Đã Chọn</label>
        <input type="text" id="vktt-selected-item-id" class="vktt-inp" placeholder="item.xxxx..." style="width:100%;" />
      </div>
      <div style="display:flex;gap:6px;align-items:center;margin-top:6px;">
        <span class="vktt-lbl" style="width:65px;">Số Lượng:</span>
        <input type="number" id="vktt-item-count" class="vktt-inp" value="10" style="width:70px;flex:none;" />
        <button id="vktt-btn-add-item" class="vktt-btn vktt-btn-cyan vktt-btn-sm" style="flex:1;">Thêm Vào Túi</button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">🛡️ 6 Ô Trang Bị Chuyên Dụng</div>
      <div class="vktt-grid-2">
        <button id="vktt-btn-eq-ring" class="vktt-btn vktt-btn-ghost">💍 Nhẫn Càn Khôn</button>
        <button id="vktt-btn-eq-fire" class="vktt-btn vktt-btn-ghost">🔥 Cửu U Hoàng Hỏa</button>
        <button id="vktt-btn-eq-wing" class="vktt-btn vktt-btn-ghost">🪽 Phù Diêu Sí</button>
        <button id="vktt-btn-eq-danlo" class="vktt-btn vktt-btn-ghost">⚗️ Đan Lô Tiên</button>
        <button id="vktt-btn-eq-pen" class="vktt-btn vktt-btn-ghost">🖌️ Phù Bút Tiên</button>
        <button id="vktt-btn-eq-khi" class="vktt-btn vktt-btn-ghost">🔨 Khí Lô Tiên</button>
      </div>
    </div>
  `;
}

function bindTabKhoDoEvents(): void {
  const btnGodPack = document.getElementById('vktt-btn-godpack');
  if (btnGodPack) btnGodPack.onclick = applyGodPack;

  const btnAllItems = document.getElementById('vktt-btn-all-items');
  if (btnAllItems) {
    btnAllItems.onclick = () => {
      const state = getGameState();
      if (!state?.run?.nhanVat) return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
      const nhanVat = copyObj(state.run.nhanVat);
      const tuiDo = copyObj(nhanVat.tuiDo || {});

      for (const id in PRESET_ITEMS) {
        const info = PRESET_ITEMS[id];
        const q = (info.cat === 'Đan Dược' || info.cat === 'Linh Dược' || info.cat === 'Phù Lục' || info.cat === 'Khoáng Thạch & Yêu Đan') ? 50 : 1;
        tuiDo[id] = Math.max(tuiDo[id] || 0, q);
      }
      nhanVat.tuiDo = tuiDo;
      nhanVat.oTuiThem = Math.max(nhanVat.oTuiThem || 0, 350);
      updateNhanVat(nhanVat);
      notify('🌟 Đã thêm trọn bộ 422+ vật phẩm vào túi đồ (+350 ô túi)!');
    };
  }

  const btnBag99 = document.getElementById('vktt-btn-bag-99');
  if (btnBag99) {
    btnBag99.onclick = () => {
      const state = getGameState();
      if (!state?.run?.nhanVat) return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
      const nhanVat = copyObj(state.run.nhanVat);
      const tuiDo = copyObj(nhanVat.tuiDo || {});
      for (const k in tuiDo) {
        tuiDo[k] = 99;
      }
      nhanVat.tuiDo = tuiDo;
      updateNhanVat(nhanVat);
      notify('🔢 Đã đặt số lượng mọi vật phẩm trong túi = 99!');
    };
  }

  const searchInp = document.getElementById('vktt-search-item') as HTMLInputElement;
  const resultsDiv = document.getElementById('vktt-item-results');
  const selectedIdInp = document.getElementById('vktt-selected-item-id') as HTMLInputElement;

  if (searchInp && resultsDiv && selectedIdInp) {
    let searchDebounce: any = null;
    searchInp.oninput = () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        const q = searchInp.value.trim();
        if (!q) {
          resultsDiv.style.display = 'none';
          return;
        }
        const matches = searchItems(q, 25);
        if (matches.length === 0) {
          resultsDiv.innerHTML = '<div style="padding:10px;color:#94a3b8;font-size:12px;">Không tìm thấy vật phẩm nào.</div>';
          resultsDiv.style.display = 'block';
          return;
        }

        resultsDiv.innerHTML = matches.map(item => {
          const color = QUALITY_COLORS[item.quality] || '#a1a1aa';
          return `
            <div class="vktt-dropdown-item" data-id="${item.id}" data-name="${item.name}">
              <div>
                <span style="color:${color};font-weight:700;">${item.name}</span>
                <span style="color:#64748b;font-size:10px;margin-left:6px;">(${item.cat})</span>
              </div>
              <span class="vktt-quality-tag" style="background:${color};color:#000;">P.${item.quality}</span>
            </div>
          `;
        }).join('');

        resultsDiv.style.display = 'block';

        resultsDiv.querySelectorAll('.vktt-dropdown-item').forEach(el => {
          el.addEventListener('click', () => {
            const id = el.getAttribute('data-id') || '';
            const name = el.getAttribute('data-name') || '';
            selectedIdInp.value = id;
            searchInp.value = name;
            resultsDiv.style.display = 'none';
          });
        });
      }, 150);
    };
  }

  const btnAdd = document.getElementById('vktt-btn-add-item');
  if (btnAdd && selectedIdInp) {
    btnAdd.onclick = () => {
      const id = selectedIdInp.value.trim();
      const count = parseInt((document.getElementById('vktt-item-count') as HTMLInputElement)?.value || '10', 10);
      addItem(id, count);
    };
  }

  // Equipment helpers
  const eqBtns: [string, string, string][] = [
    ['vktt-btn-eq-ring', 'tru_vat', 'item.can_khon_gioi'],
    ['vktt-btn-eq-fire', 'di_hoa', 'item.cuu_u_hoang_hoa'],
    ['vktt-btn-eq-wing', 'di_lai', 'item.phu_dieu_si'],
    ['vktt-btn-eq-danlo', 'luyen_dan', 'item.dan_lo_tien'],
    ['vktt-btn-eq-pen', 'che_phu', 'item.phu_but_tien'],
    ['vktt-btn-eq-khi', 'luyen_bao', 'item.khi_lo_tien']
  ];

  eqBtns.forEach(([btnId, slot, itemId]) => {
    const b = document.getElementById(btnId);
    if (b) {
      b.onclick = () => {
        const state = getGameState();
        if (!state?.run?.nhanVat) return notify('⚠️ Chưa vào game!');
        const nhanVat = copyObj(state.run.nhanVat);
        const trangBi = copyObj(nhanVat.trangBi || {});
        trangBi[slot] = itemId;
        nhanVat.trangBi = trangBi;
        updateNhanVat(nhanVat);
        notify(`🛡️ Đã trang bị bảo vật: ${itemId}!`);
      };
    }
  });
}

/* ================= TAB 3: KINH MẠCH & NGHỀ ================= */
function getTabKinhMachHtml(): string {
  return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">🌀 Đã Thông Kinh Mạch</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Mở toàn bộ kinh mạch, đồng bộ màu theo hệ Linh Căn và bảo toàn các mảnh ghép hiện có mà không gây crash game.
      </p>
      <button id="vktt-btn-meridian" class="vktt-btn vktt-btn-block" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%);">
        🌀 ĐÃ THÔNG TOÀN BỘ KINH MẠCH (100% AN TOÀN)
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">📜 Lĩnh Ngộ Toàn Diện</div>
      <button id="vktt-btn-all-profs" class="vktt-btn vktt-btn-cyan vktt-btn-block" style="margin-bottom:6px;">
        ⚒️ Lên Tông Sư 3 Nghề (Đan, Phù, Bảo)
      </button>
      <button id="vktt-btn-all-recipes" class="vktt-btn vktt-btn-purple vktt-btn-block" style="margin-bottom:6px;">
        🔥 Lĩnh Ngộ Toàn Bộ 101 Đan Phương & Đồ Phổ
      </button>
      <button id="vktt-btn-all-skills" class="vktt-btn vktt-btn-block">
        ⚡ Học Toàn Bộ 87 Kỹ Pháp & Công Pháp Cực Phẩm
      </button>
    </div>
  `;
}

function bindTabKinhMachEvents(): void {
  const btnM = document.getElementById('vktt-btn-meridian');
  if (btnM) btnM.onclick = unlockAllMeridians;

  const btnP = document.getElementById('vktt-btn-all-profs');
  if (btnP) btnP.onclick = unlockAllProfessions;

  const btnR = document.getElementById('vktt-btn-all-recipes');
  if (btnR) btnR.onclick = unlockAllRecipes;

  const btnS = document.getElementById('vktt-btn-all-skills');
  if (btnS) btnS.onclick = unlockAllSkills;
}

/* ================= TAB 4: TỰ ĐỘNG HÓA ================= */
function getTabTuDongHtml(): string {
  const speed = getGameSpeed();
  const autoC = isAutoCultivateEnabled();
  const autoR = isAutoRecoveryEnabled();

  return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">⚡ Tăng Tốc Độ Game (Speed Hack)</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Tua nhanh tốc độ di chuyển và vòng lặp thời gian trong game.
      </p>
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:5px;">
        <button class="vktt-btn vktt-speed-btn ${speed === 1 ? 'vktt-btn-cyan' : 'vktt-btn-ghost'}" data-speed="1">1x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 2 ? 'vktt-btn-cyan' : 'vktt-btn-ghost'}" data-speed="2">2x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 3 ? 'vktt-btn-cyan' : 'vktt-btn-ghost'}" data-speed="3">3x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 5 ? 'vktt-btn-cyan' : 'vktt-btn-ghost'}" data-speed="5">5x</button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">🧘 Tự Động Tu Luyện</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Tự động tăng tu vi liên tục theo thời gian thực mà không cần người chơi phải canh bấm.
      </p>
      <button id="vktt-btn-auto-cultivate" class="vktt-btn vktt-btn-block ${autoC ? 'vktt-btn-red' : 'vktt-btn-green'}">
        ${autoC ? '⏹️ DỪNG Tự Động Tu Luyện' : '▶️ BẮT ĐẦU Tự Động Tu Luyện'}
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">💖 Tự Động Hồi Phục Sinh Lực & Chân Nguyên</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Khi Khí Huyết hoặc Chân Nguyên giảm dưới 60%, tự động hồi phục về mức tối đa ngay lập tức.
      </p>
      <button id="vktt-btn-auto-recovery" class="vktt-btn vktt-btn-block ${autoR ? 'vktt-btn-red' : 'vktt-btn-green'}">
        ${autoR ? '⏹️ DỪNG Tự Động Hồi Phục' : '▶️ BẮT ĐẦU Tự Động Hồi Phục'}
      </button>
    </div>
  `;
}

function bindTabTuDongEvents(): void {
  const speedBtns = document.querySelectorAll('.vktt-speed-btn');
  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const spd = parseInt(btn.getAttribute('data-speed') || '1', 10);
      setGameSpeed(spd);
      renderTabContent('tab-tu-dong');
    });
  });

  const btnAutoC = document.getElementById('vktt-btn-auto-cultivate');
  if (btnAutoC) {
    btnAutoC.onclick = () => {
      toggleAutoCultivate();
      renderTabContent('tab-tu-dong');
    };
  }

  const btnAutoR = document.getElementById('vktt-btn-auto-recovery');
  if (btnAutoR) {
    btnAutoR.onclick = () => {
      toggleAutoRecovery();
      renderTabContent('tab-tu-dong');
    };
  }
}

/* ================= TAB 5: SAO LƯU & HỆ THỐNG ================= */
function getTabSaoLuuHtml(): string {
  return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">💾 Xuất File Save</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Tải toàn bộ tiến trình tu tiên ra file JSON về máy điện thoại của bạn.
      </p>
      <button id="vktt-btn-export-save" class="vktt-btn vktt-btn-cyan vktt-btn-block">
        📥 Xuất Save JSON Về Máy
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">📂 Nạp File Save</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Chọn file save JSON đã xuất từ trước để khôi phục tiến trình.
      </p>
      <input type="file" id="vktt-inp-save-file" accept=".json" style="display:none;" />
      <button id="vktt-btn-import-file" class="vktt-btn vktt-btn-purple vktt-btn-block" style="margin-bottom:6px;">
        📤 Chọn File Save JSON Để Nạp
      </button>
      <div class="vktt-field">
        <label class="vktt-label">Hoặc Dán Nội Dung Save JSON Trực Tiếp</label>
        <textarea id="vktt-txt-save" class="vktt-inp" style="height:65px;padding:6px;font-size:11px;width:100%;" placeholder='Dán chuỗi JSON vào đây...'></textarea>
        <button id="vktt-btn-import-text" class="vktt-btn vktt-btn-ghost vktt-btn-block" style="margin-top:5px;">
          Khôi Phục Từ Chuỗi Dán
        </button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr" style="color:#f87171;">⚠️ Tẩy Tủy & Khôi Phục Khẩn Cấp</div>
      <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">
        Xóa toàn bộ bộ nhớ đệm game để khắc phục màn hình crash/đơ.
      </p>
      <button id="vktt-btn-clear-cache" class="vktt-btn vktt-btn-red vktt-btn-block">
        🌀 TẨY TỦY (XÓA CACHE & TẢI LẠI TRANG)
      </button>
    </div>
  `;
}

function bindTabSaoLuuEvents(): void {
  const btnExp = document.getElementById('vktt-btn-export-save');
  if (btnExp) btnExp.onclick = exportSaveFile;

  const btnImpFile = document.getElementById('vktt-btn-import-file');
  const fileInp = document.getElementById('vktt-inp-save-file') as HTMLInputElement;

  if (btnImpFile && fileInp) {
    btnImpFile.onclick = () => fileInp.click();
    fileInp.onchange = () => {
      const file = fileInp.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) importSaveJson(text);
      };
      reader.readAsText(file);
    };
  }

  const btnImpText = document.getElementById('vktt-btn-import-text');
  if (btnImpText) {
    btnImpText.onclick = () => {
      const text = (document.getElementById('vktt-txt-save') as HTMLTextAreaElement)?.value || '';
      if (text.trim()) importSaveJson(text);
    };
  }

  const btnClear = document.getElementById('vktt-btn-clear-cache');
  if (btnClear) btnClear.onclick = clearGameCache;
}
