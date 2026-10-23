import { gWin, copyObj, mergeObj, getGameState, setGameState } from './bridge';
import { PRESET_ITEMS, THE_CHAT_DB, ALL_TOP_SKILLS, ALL_RECIPES, MO_KHOA_DATA, ALL_THANH_TUU } from '../data/presets';
import { getItemInfo } from '../data/items';

let toastTimer: any = null;
export function notify(msg: string): void {
  let t = document.getElementById('vktt-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'vktt-toast';
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
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0px)';
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    if (t) {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(-10px)';
    }
  }, 2600);
}

export function updateNhanVat(patchObj: Record<string, any>): boolean {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
    return false;
  }
  const nextNv = mergeObj(state.run.nhanVat, patchObj);
  setGameState({ run: mergeObj(state.run, { nhanVat: nextNv }) });
  return true;
}

export function updateChiSo(k: string, v: number): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
    return;
  }
  const cs = copyObj(state.run.nhanVat.chiSo || {});
  cs[k] = v;
  updateNhanVat({ chiSo: cs });
}

export function buildSyncedXepTui(oldXep: string[] | undefined, tuiDo: Record<string, number>): string[] {
  const out: string[] = [];
  const seen: Record<string, boolean> = {};

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

export function addItem(itemId: string, count: number = 1): void {
  let cleanId = itemId.trim();
  if (!cleanId) return notify('⚠️ Vui lòng nhập ID hoặc chọn vật phẩm!');
  if (!cleanId.startsWith('item.')) cleanId = 'item.' + cleanId;

  try {
    const state = getGameState();
    if (!state || !state.run || !state.run.nhanVat) {
      return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
    }
    const nhanVat = copyObj(state.run.nhanVat);
    const tuiDo = copyObj(nhanVat.tuiDo || {});

    tuiDo[cleanId] = (tuiDo[cleanId] || 0) + count;
    nhanVat.tuiDo = tuiDo;
    nhanVat.oTuiThem = Math.max(nhanVat.oTuiThem || 0, 150);
    nhanVat.xepTui = buildSyncedXepTui(nhanVat.xepTui, tuiDo);

    setGameState({ run: mergeObj(state.run, { nhanVat }) });
    const info = getItemInfo(cleanId);
    notify(`🎁 Đã thêm +${count} [${info.name}] vào túi đồ!`);
  } catch (e) {
    notify('❌ Thêm vật phẩm thất bại!');
  }
}

export function applyGodPack(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
  }

  const nhanVat = copyObj(state.run.nhanVat);
  const tuiDo = copyObj(nhanVat.tuiDo || {});

  for (const id in PRESET_ITEMS) {
    if (Object.prototype.hasOwnProperty.call(PRESET_ITEMS, id)) {
      const info = PRESET_ITEMS[id];
      if (info.quality >= 7) {
        const q = (info.cat === 'Đan Dược' || info.cat === 'Linh Dược' || info.cat === 'Khoáng Thạch & Yêu Đan') ? 99 : 1;
        tuiDo[id] = Math.max(tuiDo[id] || 0, q);
      }
    }
  }

  nhanVat.tuiDo = tuiDo;
  nhanVat.oTuiThem = Math.max(nhanVat.oTuiThem || 0, 180);
  nhanVat.xepTui = buildSyncedXepTui(nhanVat.xepTui, tuiDo);

  nhanVat.trangBi = mergeObj(nhanVat.trangBi || {}, {
    tru_vat: 'item.can_khon_gioi',
    di_hoa: 'item.cuu_u_hoang_hoa',
    di_lai: 'item.phu_dieu_si',
    luyen_dan: 'item.dan_lo_tien',
    che_phu: 'item.phu_but_tien',
    luyen_bao: 'item.khi_lo_tien'
  });

  setGameState({ run: mergeObj(state.run, { nhanVat }) });
  notify('👑 Đã kích hoạt GÓI THẦN ĐẠO v3.0 (Trang bị cực phẩm Phẩm 8-9 + 99 Thần Dược)!');
}

export function unlockAllProfessions(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
  }
  const ngheNghiep = {
    luyen_dan: { cap: 5, kinhNghiem: 10000 },
    luyen_khi: { cap: 5, kinhNghiem: 10000 },
    che_phu: { cap: 5, kinhNghiem: 10000 },
    tran_phap: { cap: 5, kinhNghiem: 10000 },
    ngu_thu: { cap: 5, kinhNghiem: 10000 },
    khoi_loi: { cap: 5, kinhNghiem: 10000 }
  };
  updateNhanVat({ ngheNghiep });
  notify('📜 Đã thông tuệ TOÀN BỘ NGHỀ NGHIỆP CẤP 5 (Tông Sư)!');
}

export function unlockAllRecipes(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
  }
  const nhanVat = copyObj(state.run.nhanVat);
  const dp = copyObj(nhanVat.danPhuong || {});
  for (const r of ALL_RECIPES) {
    dp[r] = true;
  }
  updateNhanVat({ danPhuong: dp });
  notify(`🔥 Đã lĩnh ngộ toàn bộ ${ALL_RECIPES.length} ĐAN PHƯƠNG & ĐỒ PHỔ!`);
}

export function unlockAllSkills(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
  }
  const nhanVat = copyObj(state.run.nhanVat);
  const kp = copyObj(nhanVat.kyPhap || {});
  for (const s of ALL_TOP_SKILLS) {
    kp[s] = { cap: 10, tang: 10 };
  }
  updateNhanVat({ kyPhap: kp });
  notify(`⚡ Đã thông thạo ${ALL_TOP_SKILLS.length} CÔNG PHÁP & KỸ NĂNG ĐẠI THÀNH!`);
}

export function unlockAllMeridians(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
  }

  const nv = state.run.nhanVat;
  const tcKey = nv.theChat || 'the_chat.pham_the';
  const tcData = THE_CHAT_DB[tcKey] || THE_CHAT_DB['the_chat.pham_the'];

  const rawLines = tcData.khuon.trim().split('\n');
  const lines: string[][] = [];
  for (const r of rawLines) {
    const s = r.trim();
    if (s.length > 0) lines.push(s.split(/\s+/));
  }

  const vung: number[] = [];
  for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      const ch = lines[r][c];
      if (ch === '.') vung.push(-1);
      else if (ch === 'D') vung.push(0);
      else vung.push(1);
    }
  }

  const allHuyet: number[] = [];
  for (let i = 0; i < vung.length; i++) {
    if (vung[i] === 1) allHuyet.push(i);
  }

  const km = copyObj(nv.kinhMach || {});
  km.huyetThem = allHuyet;
  km.daKhaiThong = true;
  updateNhanVat({ kinhMach: km });
  notify(`🌀 Đã đã thông TOÀN BỘ ${allHuyet.length} HUYỆT ĐẠO KINH MẠCH (100% An Toàn)!`);
}

export function setRealm(canhGioiIndex: number): void {
  const REALM_MAP: Record<number, { ten: string; tuViMax: number }> = {
    1: { ten: 'Luyện Khí', tuViMax: 100 },
    2: { ten: 'Trúc Cơ', tuViMax: 500 },
    3: { ten: 'Kim Đan', tuViMax: 2000 },
    4: { ten: 'Nguyên Anh', tuViMax: 8000 },
    5: { ten: 'Hóa Thần', tuViMax: 25000 },
    6: { ten: 'Luyện Hư', tuViMax: 80000 },
    7: { ten: 'Hợp Thể', tuViMax: 250000 },
    8: { ten: 'Đại Thừa', tuViMax: 800000 },
    9: { ten: 'Độ Kiếp', tuViMax: 3000000 }
  };

  const target = REALM_MAP[canhGioiIndex] || REALM_MAP[9];
  const patch: any = {
    canhGioi: { cap: canhGioiIndex, tang: 9, ten: target.ten },
    tuVi: target.tuViMax,
    tuViMax: target.tuViMax,
    kimDan: { pham: 9, ten: 'Cửu Chuyển Cực Phẩm Kim Đan' },
    yCanh: { cap: 10, ten: 'Viên Mãn Kiếm Ý' },
    diTuong: 'Hỗn Độn Sơ Khai'
  };

  updateNhanVat(patch);
  notify(`🌟 Đã đột phá tới CẢNH GIỚI: ${target.ten} Đỉnh Phong (Cửu Chuyển Kim Đan)!`);
}

export function setPhysique(theChatKey: string): void {
  const tc = THE_CHAT_DB[theChatKey];
  if (!tc) return;

  const patch: any = {
    theChat: theChatKey,
    linhCan: {
      loai: 'thien_linh_can',
      ngu_hanh: ['kim', 'moc', 'thuy', 'hoa', 'tho'],
      do_tinh_thuan: 100
    }
  };

  updateNhanVat(patch);
  unlockAllMeridians();
  notify(`🔥 Đã tái tạo Thể Chất: [${tc.ten}] & Thiên Linh Căn Ngũ Hành!`);
}

export function unlockAllAchievementsAndFerrymen(): void {
  const state = getGameState();
  if (!state) return notify('⚠️ Chưa kết nối được game store!');

  // Update profile
  const profile = copyObj(state.profile || {});
  const moKhoa = copyObj(profile.moKhoa || {});
  for (const m of MO_KHOA_DATA) moKhoa[m] = true;

  const tt = copyObj(profile.thanhTuu || {});
  for (const a of ALL_THANH_TUU) tt[a] = true;

  profile.moKhoa = moKhoa;
  profile.thanhTuu = tt;
  profile.luanHoi = Math.max(profile.luanHoi || 0, 999);

  setGameState({ profile });
  notify(`🏆 Đã mở khóa ${MO_KHOA_DATA.length} LÃO ĐÒ và ${ALL_THANH_TUU.length} THÀNH TỰU!`);
}
