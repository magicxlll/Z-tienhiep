import { MOD_STYLES } from './styles';
import { 
  notify, 
  updateNhanVat, 
  updateChiSo, 
  addItem, 
  applyGodPack, 
  unlockAllProfessions, 
  unlockAllRecipes, 
  unlockAllSkills, 
  unlockAllMeridians, 
  setRealm, 
  setPhysique, 
  unlockAllAchievementsAndFerrymen 
} from '../core/mutator';
import { searchItems, ItemInfo } from '../data/items';
import { QUALITY_COLORS, THE_CHAT_DB } from '../data/presets';
import { 
  setGameSpeed, 
  getGameSpeed, 
  toggleAutoCultivate, 
  isAutoCultivateEnabled, 
  toggleAutoRecovery, 
  isAutoRecoveryEnabled 
} from '../modules/automation';
import { exportSaveFile, importSaveJson, clearGameCache } from '../modules/backup';
import { getGameState, copyObj, mergeObj, setGameState } from '../core/bridge';

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
      const newBottom = Math.max(30, Math.min(window.innerHeight - 80, initialBottom + deltaY));
      fab.style.bottom = `${newBottom}px`;
    }
  }, { passive: true });

  fab.addEventListener('touchend', () => {
    if (isDragging) {
      initialBottom = parseInt(fab.style.bottom || '80', 10);
    }
  });
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
  return `
    <div class="vktt-card">
      <div class="vktt-card-hdr">💎 Tài Nguyên Cơ Bản</div>
      <div class="vktt-field">
        <label class="vktt-label">Đạo Hiệu</label>
        <div class="vktt-input-group">
          <input type="text" id="vktt-inp-ten" class="vktt-input" placeholder="Nhập đạo hiệu mới..." />
          <button id="vktt-btn-ten" class="vktt-btn">Đổi</button>
        </div>
      </div>
      <div class="vktt-grid-2">
        <div class="vktt-field">
          <label class="vktt-label">Linh Thạch</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-lt" class="vktt-input" placeholder="999999" />
            <button id="vktt-btn-lt" class="vktt-btn">Gán</button>
          </div>
        </div>
        <div class="vktt-field">
          <label class="vktt-label">Tu Vi</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-tv" class="vktt-input" placeholder="999999" />
            <button id="vktt-btn-tv" class="vktt-btn">Gán</button>
          </div>
        </div>
      </div>
      <div class="vktt-grid-2">
        <div class="vktt-field">
          <label class="vktt-label">Thọ Nguyên Thêm (Năm)</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-tnt" class="vktt-input" placeholder="5000" />
            <button id="vktt-btn-tnt" class="vktt-btn">Gán</button>
          </div>
        </div>
        <div class="vktt-field">
          <label class="vktt-label">Tuổi</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-tuoi" class="vktt-input" placeholder="18" />
            <button id="vktt-btn-tuoi" class="vktt-btn">Gán</button>
          </div>
        </div>
      </div>
      <div class="vktt-grid-2">
        <div class="vktt-field">
          <label class="vktt-label">Cống Hiến Môn Phái</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-ch" class="vktt-input" placeholder="99999" />
            <button id="vktt-btn-ch" class="vktt-btn">Gán</button>
          </div>
        </div>
        <div class="vktt-field">
          <label class="vktt-label">Công Tích</label>
          <div class="vktt-input-group">
            <input type="number" id="vktt-inp-ct" class="vktt-input" placeholder="99999" />
            <button id="vktt-btn-ct" class="vktt-btn">Gán</button>
          </div>
        </div>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">🌟 Cảnh Giới & Đột Phá</div>
      <div class="vktt-field">
        <label class="vktt-label">Chọn Cảnh Giới Đỉnh Phong</label>
        <div class="vktt-input-group">
          <select id="vktt-sel-cg" class="vktt-select" style="flex:1;">
            <option value="9">Độ Kiếp Đỉnh Phong (Kim Đan Phẩm 9)</option>
            <option value="8">Đại Thừa Đỉnh Phong</option>
            <option value="7">Hợp Thể Đỉnh Phong</option>
            <option value="6">Luyện Hư Đỉnh Phong</option>
            <option value="5">Hóa Thần Đỉnh Phong</option>
            <option value="4">Nguyên Anh Đỉnh Phong</option>
            <option value="3">Kim Đan Đỉnh Phong</option>
            <option value="2">Trúc Cơ Đỉnh Phong</option>
            <option value="1">Luyện Khí</option>
          </select>
          <button id="vktt-btn-cg" class="vktt-btn vktt-btn-cyan">Đột Phá</button>
        </div>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">🔥 Thể Chất & Linh Căn</div>
      <div class="vktt-field">
        <label class="vktt-label">Chọn Thể Chất Tối Thượng</label>
        <div class="vktt-input-group">
          <select id="vktt-sel-tc" class="vktt-select" style="flex:1;">
            <option value="the_chat.hon_don_dao_the">Hỗn Độn Đạo Thể (Khuôn 10x10)</option>
            <option value="the_chat.tien_thien_thanh_the_dao_thai">Tiên Thiên Thánh Thể Đạo Thai (10x10)</option>
            <option value="the_chat.thai_co_than_the">Thái Cổ Thần Thể (10x10)</option>
            <option value="the_chat.van_kiep_bat_diet_the">Vạn Kiếp Bất Diệt Thể (10x10)</option>
            <option value="the_chat.am_duong_hon_don_the">Âm Dương Hỗn Độn Thể (10x10)</option>
            <option value="the_chat.pham_the">Phàm Thể (Mặc định)</option>
          </select>
          <button id="vktt-btn-tc" class="vktt-btn vktt-btn-purple">Tẩy Tủy</button>
        </div>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">🏆 Luân Hồi, Lão Đò & Thành Tựu</div>
      <button id="vktt-btn-all-achieve" class="vktt-btn vktt-btn-block">Mở Khóa Toàn Bộ 17 Lão Đò & 28 Thành Tựu</button>
    </div>
  `;
}

function bindTabNhanVatEvents(): void {
  const btnTen = document.getElementById('vktt-btn-ten');
  if (btnTen) {
    btnTen.onclick = () => {
      const v = ((document.getElementById('vktt-inp-ten') as HTMLInputElement)?.value || '').trim();
      if (v) { updateNhanVat({ ten: v }); notify(`✅ Đã đổi Đạo Hiệu thành: ${v}`); }
    };
  }

  const btnLt = document.getElementById('vktt-btn-lt');
  if (btnLt) {
    btnLt.onclick = () => {
      const v = parseInt((document.getElementById('vktt-inp-lt') as HTMLInputElement)?.value || '999999', 10);
      updateNhanVat({ linhThach: v });
      notify(`💎 Đã gán Linh Thạch = ${v.toLocaleString()}!`);
    };
  }

  const btnTv = document.getElementById('vktt-btn-tv');
  if (btnTv) {
    btnTv.onclick = () => {
      const v = parseInt((document.getElementById('vktt-inp-tv') as HTMLInputElement)?.value || '999999', 10);
      updateNhanVat({ tuVi: v });
      notify(`✨ Đã gán Tu Vi = ${v.toLocaleString()}!`);
    };
  }

  const btnTnt = document.getElementById('vktt-btn-tnt');
  if (btnTnt) {
    btnTnt.onclick = () => {
      const v = parseInt((document.getElementById('vktt-inp-tnt') as HTMLInputElement)?.value || '5000', 10);
      updateNhanVat({ thoNguyenThem: v });
      notify(`⏳ Đã gán Thọ Nguyên Thêm = +${v} năm!`);
    };
  }

  const btnTuoi = document.getElementById('vktt-btn-tuoi');
  if (btnTuoi) {
    btnTuoi.onclick = () => {
      const v = parseInt((document.getElementById('vktt-inp-tuoi') as HTMLInputElement)?.value || '18', 10);
      updateNhanVat({ tuoi: v });
      notify(`⏳ Đã gán Tuổi = ${v}!`);
    };
  }

  const btnCh = document.getElementById('vktt-btn-ch');
  if (btnCh) {
    btnCh.onclick = () => {
      const v = parseInt((document.getElementById('vktt-inp-ch') as HTMLInputElement)?.value || '99999', 10);
      updateNhanVat({ congHien: v });
      notify(`📜 Đã gán Cống Hiến = ${v.toLocaleString()}!`);
    };
  }

  const btnCt = document.getElementById('vktt-btn-ct');
  if (btnCt) {
    btnCt.onclick = () => {
      const v = parseInt((document.getElementById('vktt-inp-ct') as HTMLInputElement)?.value || '99999', 10);
      const state = getGameState();
      if (!state || !state.run) return notify('⚠️ Hãy vào trong kiếp tu tiên trước!');
      const run = copyObj(state.run);
      if (run.tongMon) run.tongMon = mergeObj(run.tongMon, { congTich: v });
      setGameState({ run });
      notify(`🏛️ Đã gán ${v.toLocaleString()} điểm Công Tích! Hãy Cáo lui rồi mở lại Chấp sự đường.`);
    };
  }

  const btnCg = document.getElementById('vktt-btn-cg');
  if (btnCg) {
    btnCg.onclick = () => {
      const idx = parseInt((document.getElementById('vktt-sel-cg') as HTMLSelectElement)?.value || '9', 10);
      setRealm(idx);
    };
  }

  const btnTc = document.getElementById('vktt-btn-tc');
  if (btnTc) {
    btnTc.onclick = () => {
      const tcKey = (document.getElementById('vktt-sel-tc') as HTMLSelectElement)?.value || 'the_chat.hon_don_dao_the';
      setPhysique(tcKey);
    };
  }

  const btnAchieve = document.getElementById('vktt-btn-all-achieve');
  if (btnAchieve) {
    btnAchieve.onclick = unlockAllAchievementsAndFerrymen;
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
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">🔍 Thêm Vật Phẩm Bất Kỳ</div>
      <div class="vktt-field">
        <label class="vktt-label">Tìm theo tên hoặc ID</label>
        <input type="text" id="vktt-search-item" class="vktt-input" placeholder="Gõ tên vật phẩm (Vd: bàn đào, kiếm, phù...)" />
        <div id="vktt-item-results" class="vktt-dropdown-list" style="display:none;"></div>
      </div>
      <div class="vktt-field">
        <label class="vktt-label">ID Vật Phẩm Đã Chọn</label>
        <input type="text" id="vktt-selected-item-id" class="vktt-input" placeholder="item.xxxx..." />
      </div>
      <div class="vktt-grid-2">
        <div class="vktt-field">
          <label class="vktt-label">Số Lượng</label>
          <input type="number" id="vktt-item-count" class="vktt-input" value="10" />
        </div>
        <div class="vktt-field" style="display:flex;align-items:flex-end;">
          <button id="vktt-btn-add-item" class="vktt-btn vktt-btn-cyan vktt-btn-block">Thêm Vào Túi</button>
        </div>
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
        setGameState({ run: mergeObj(state.run, { nhanVat }) });
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
      <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">
        Tự động tính toán ma trận huyệt đạo theo Thể Chất hiện tại, mở thông toàn bộ mà không gây crash hàm <code>Lt(t, n)</code> của game.
      </p>
      <button id="vktt-btn-meridian" class="vktt-btn vktt-btn-block" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%);">
        🌀 ĐÃ THÔNG TOÀN BỘ HUYỆT ĐẠO KINH MẠCH (100% An Toàn)
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">📜 Lĩnh Ngộ Toàn Diện</div>
      <button id="vktt-btn-all-profs" class="vktt-btn vktt-btn-cyan vktt-btn-block" style="margin-bottom:8px;">
        ⚒️ Học Toàn Bộ Nghề Nghiệp Cấp 5 (Tông Sư)
      </button>
      <button id="vktt-btn-all-recipes" class="vktt-btn vktt-btn-purple vktt-btn-block" style="margin-bottom:8px;">
        🔥 Lĩnh Ngộ 101 Đan Phương & Đồ Phổ
      </button>
      <button id="vktt-btn-all-skills" class="vktt-btn vktt-btn-block">
        ⚡ Học 87 Công Pháp & Kỹ Pháp Cực Phẩm (Cấp 10)
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
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        Tua nhanh tốc độ di chuyển trên map và vòng lặp thời gian trong game.
      </p>
      <div class="vktt-grid-2" style="grid-template-columns: repeat(4, 1fr);gap:6px;">
        <button class="vktt-btn vktt-speed-btn ${speed === 1 ? 'vktt-btn-cyan' : 'vktt-btn-ghost'}" data-speed="1">1x (Chuẩn)</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 2 ? 'vktt-btn-cyan' : 'vktt-btn-ghost'}" data-speed="2">2x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 3 ? 'vktt-btn-cyan' : 'vktt-btn-ghost'}" data-speed="3">3x</button>
        <button class="vktt-btn vktt-speed-btn ${speed === 5 ? 'vktt-btn-cyan' : 'vktt-btn-ghost'}" data-speed="5">5x (Nhanh)</button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">🧘 Tự Động Tu Luyện</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        Tự động tăng tu vi liên tục theo thời gian thực mà không cần người chơi phải canh bấm.
      </p>
      <button id="vktt-btn-auto-cultivate" class="vktt-btn vktt-btn-block ${autoC ? 'vktt-btn-red' : 'vktt-btn-green'}">
        ${autoC ? '⏹️ DỪNG Tự Động Tu Luyện' : '▶️ BẮT ĐẦU Tự Động Tu Luyện'}
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">💖 Tự Động Hồi Phục Sinh Lực & Chân Nguyên</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
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
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        Tải toàn bộ tiến trình tu tiên ra file JSON về máy điện thoại của bạn.
      </p>
      <button id="vktt-btn-export-save" class="vktt-btn vktt-btn-cyan vktt-btn-block">
        📥 Xuất Save JSON Về Máy
      </button>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr">📂 Nạp File Save</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
        Chọn file save JSON đã xuất từ trước để khôi phục tiến trình.
      </p>
      <input type="file" id="vktt-inp-save-file" accept=".json" style="display:none;" />
      <button id="vktt-btn-import-file" class="vktt-btn vktt-btn-purple vktt-btn-block" style="margin-bottom:8px;">
        📤 Chọn File Save JSON Để Nạp
      </button>
      <div class="vktt-field">
        <label class="vktt-label">Hoặc Dán Nội Dung Save JSON Trực Tiếp</label>
        <textarea id="vktt-txt-save" class="vktt-input" style="height:70px;padding:8px;font-size:11px;" placeholder='Dán chuỗi JSON vào đây...'></textarea>
        <button id="vktt-btn-import-text" class="vktt-btn vktt-btn-ghost vktt-btn-block" style="margin-top:6px;">
          Khôi Phục Từ Chuỗi Dán
        </button>
      </div>
    </div>

    <div class="vktt-card">
      <div class="vktt-card-hdr" style="color:#f87171;">⚠️ Tẩy Tủy & Khôi Phục Khẩn Cấp</div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
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
