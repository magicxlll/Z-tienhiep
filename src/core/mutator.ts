import { gWin, copyObj, mergeObj, uniqueStrings, getGameState, setGameState, persistGameSave, persistGameMeta } from './bridge';
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
  const nextRun = mergeObj(state.run, { nhanVat: nextNv });
  setGameState({ run: nextRun });
  persistGameSave(nextRun);
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

export function updateBatchChiSo(statsObj: Record<string, number>): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
    return;
  }
  const cs = copyObj(state.run.nhanVat.chiSo || {});
  for (const k in statsObj) {
    cs[k] = statsObj[k];
  }
  updateNhanVat({ chiSo: cs });
}

export function updateTongMon(congTich: number, capBac?: number): void {
  const state = getGameState();
  if (!state || !state.run) {
    notify('⚠️ Hãy vào trong kiếp tu tiên trước!');
    return;
  }
  const run = copyObj(state.run);
  
  function recursiveAddCongTich(obj: any): void {
    if (!obj || typeof obj !== 'object') return;
    if (Object.prototype.hasOwnProperty.call(obj, 'congTich') && typeof obj.congTich === 'number') {
      obj.congTich = congTich;
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === 'object' && obj[key] !== null) {
        recursiveAddCongTich(obj[key]);
      }
    }
  }
  recursiveAddCongTich(run);

  const tmPatch: any = { congTich };
  if (capBac !== undefined) tmPatch.capBac = capBac;
  run.tongMon = mergeObj(run.tongMon || { slot: "slot.1115", congTich: 5000 }, tmPatch);

  setGameState({ run });
  persistGameSave(run);
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

    updateNhanVat(nhanVat);
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

  updateNhanVat(nhanVat);
  notify('👑 Đã kích hoạt GÓI THẦN ĐẠO v3.0 (Trang bị cực phẩm Phẩm 8-9 + 99 Thần Dược)!');
}

export function unlockAllProfessions(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
  }
  const nghe = {
    luyen_dan: { bac: 4, kinhNghiem: 9999 },
    che_phu: { bac: 4, kinhNghiem: 9999 },
    luyen_bao: { bac: 4, kinhNghiem: 9999 }
  };
  updateNhanVat({ nghe });
  notify('📜 Đã lên Tông Sư 3 Nghề (Luyện Đan, Chế Phù, Luyện Khí)!');
}

export function unlockAllRecipes(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
  }
  const nhanVat = copyObj(state.run.nhanVat);
  const updatedDonPhuong = uniqueStrings(nhanVat.donPhuong || [], ALL_RECIPES);
  updateNhanVat({ donPhuong: updatedDonPhuong });
  notify(`🔥 Đã lĩnh ngộ toàn bộ ${ALL_RECIPES.length} ĐAN PHƯƠNG & ĐỒ PHỔ!`);
}

export function unlockAllSkills(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
  }
  const nhanVat = copyObj(state.run.nhanVat);
  const oldKm = copyObj(nhanVat.kinhMach || {});
  oldKm.daLinhNgo = uniqueStrings(oldKm.daLinhNgo || [], ALL_TOP_SKILLS);
  updateNhanVat({ kinhMach: oldKm });
  notify(`⚡ Đã thông thạo ${ALL_TOP_SKILLS.length} CÔNG PHÁP & KỸ NĂNG CỰC PHẨM!`);
}

export function parseKhuonFallback(khuonStr: string): { rong: number; cao: number; vung: number[] } {
  const rawLines = khuonStr.replace(/^\s+|\s+$/g, '').split('\n');
  const lines: string[][] = [];
  for (let i = 0; i < rawLines.length; i++) {
    const rowStr = rawLines[i].replace(/^\s+|\s+$/g, '');
    if (rowStr.length > 0) lines.push(rowStr.split(/\s+/));
  }
  const rong = lines[0] ? lines[0].length : 11;
  const cao = lines.length;
  const vung: number[] = [];
  for (let r = 0; r < cao; r++) {
    for (let c = 0; c < rong; c++) {
      const ch = lines[r][c];
      if (ch === 'D') vung.push(0);
      else if (ch === '.') vung.push(-1);
      else if (/^[0-5]$/.test(ch)) vung.push(Number(ch));
      else if (/^[a-f]$/.test(ch)) vung.push(ch.charCodeAt(0) - 97);
      else vung.push(-1);
    }
  }
  return { rong, cao, vung };
}

export function unlockAllMeridians(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
  }

  const nv = copyObj(state.run.nhanVat);
  const oldKm = copyObj(nv.kinhMach || {});
  const trangThai: string[] = [];
  if (oldKm.trangThai && oldKm.trangThai.length) {
    for (let i = 0; i < oldKm.trangThai.length; i++) trangThai.push('thong');
  }
  const mau = oldKm.mau ? [...oldKm.mau] : [];
  const heList = (nv.linhCan && nv.linhCan.he && nv.linhCan.he.length) ? nv.linhCan.he : ['kim'];
  for (let j = 0; j < mau.length; j++) {
    if (mau[j] === 'vo_sac') mau[j] = heList[j % heList.length];
  }
  oldKm.mau = mau;
  oldKm.trangThai = trangThai;
  oldKm.daLinhNgo = uniqueStrings(oldKm.daLinhNgo || [], ALL_TOP_SKILLS);
  oldKm.cho = { mo: 99, doiMau: 99 };
  nv.kinhMach = oldKm;

  updateNhanVat(nv);
  notify('🌀 Đã mở thông toàn bộ Kinh Mạch (99 Lượt) & lĩnh ngộ 87 Kỹ Pháp!');
}

export function setRealm(canhGioiIndex: number, tieuCanhGioiIndex: number = 3): void {
  const cg = Math.max(0, Math.min(5, Math.floor(canhGioiIndex)));
  const tcg = Math.max(0, Math.min(3, Math.floor(tieuCanhGioiIndex)));

  const REALM_NAMES: Record<number, string> = {
    0: 'Phàm Nhân',
    1: 'Luyện Khí',
    2: 'Trúc Cơ',
    3: 'Kết Đan',
    4: 'Nguyên Anh',
    5: 'Hóa Thần'
  };

  const SUB_REALM_NAMES: Record<number, string> = {
    0: 'Sơ kỳ',
    1: 'Trung kỳ',
    2: 'Hậu kỳ',
    3: 'Đại viên mãn'
  };

  updateNhanVat({
    canhGioi: cg,
    tieuCanhGioi: tcg,
    binhCanh: 0
  });

  notify(`📈 Đã chuyển Cảnh Giới: ${REALM_NAMES[cg]} - ${SUB_REALM_NAMES[tcg]} (Xóa bình cảnh)!`);
}

export function setExtraRealm(kimDan: number, yCanh: string, diTuong: string, tucTue?: number): void {
  const patch: any = {
    kimDan: Math.max(1, Math.min(5, kimDan || 1)),
    yCanh: yCanh || 'Kiếm ý',
    diTuong: diTuong || 'kim'
  };
  if (tucTue !== undefined && !isNaN(tucTue)) {
    patch.tucTue = tucTue;
  }
  updateNhanVat(patch);
  notify(`✨ Đã lưu Kim Đan Phẩm ${patch.kimDan}, ${patch.yCanh}, Dị Tượng (${patch.diTuong})!`);
}

export function setPhysique(theChatKey: string): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
    return;
  }

  const content = state.content;
  const updatedNhanVat = copyObj(state.run.nhanVat);
  const oldKm = copyObj(updatedNhanVat.kinhMach || {});
  updatedNhanVat.theChat = theChatKey;

  try {
    let tcData: any = null;
    if (content && content.theChat) {
      tcData = typeof content.theChat.get === 'function' ? content.theChat.get(theChatKey) : content.theChat[theChatKey];
    }

    let vungArr: number[] = [];
    let rong = 11, cao = 11;
    if (tcData) {
      const tcBase = (typeof gWin.Kg === 'function') ? gWin.Kg(tcData) : tcData;
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
      const heList = (updatedNhanVat.linhCan && updatedNhanVat.linhCan.he && updatedNhanVat.linhCan.he.length)
        ? updatedNhanVat.linhCan.he
        : ['vo_sac'];
      const newTrangThai: string[] = [];
      const newMau: string[] = [];
      for (let i = 0; i < vungArr.length; i++) {
        newTrangThai.push("thong");
        newMau.push(vungArr[i] < 0 ? "vo_sac" : heList[i % heList.length]);
      }

      const keptManh: any[] = [];
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
    console.error('Lỗi khi thiết lập thể chất:', err);
  }

  updateNhanVat(updatedNhanVat);
  const tcName = THE_CHAT_DB[theChatKey]?.ten || theChatKey;
  notify(`🧬 Đã gán [${tcName}], thông toàn bộ Kinh Mạch & bảo toàn Kỹ Pháp!`);
}

export function setLinhCan(selectedHe: string[]): void {
  if (!selectedHe || selectedHe.length === 0) {
    notify('⚠️ Chọn ít nhất 1 hệ Linh Căn!');
    return;
  }

  let isBienDi = false;
  for (const h of selectedHe) {
    if (h === 'bang' || h === 'phong' || h === 'loi') isBienDi = true;
  }

  let pham = 'tap', tuLuyen = 1.0, dotPha = 0;
  if (isBienDi) {
    pham = 'bien_di';
    tuLuyen = 1.2;
    dotPha = 0.05;
  } else if (selectedHe.length === 1) {
    pham = 'thien';
    tuLuyen = 1.3;
    dotPha = 0.1;
  } else if (selectedHe.length === 2) {
    pham = 'song';
    tuLuyen = 1.0;
  } else {
    pham = 'tap';
    tuLuyen = 0.8;
    dotPha = -0.05;
  }

  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
    return;
  }

  const nv = copyObj(state.run.nhanVat);
  if (nv.kinhMach && nv.kinhMach.mau) {
    const km = copyObj(nv.kinhMach);
    const newMau: string[] = [];
    for (let mi = 0; mi < km.mau.length; mi++) {
      newMau.push(km.mau[mi] === 'vo_sac' ? 'vo_sac' : selectedHe[mi % selectedHe.length]);
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
  notify(`🌱 Đã gán Linh Căn ${pham.toUpperCase()} (${selectedHe.join(', ')}) & đồng bộ màu mạch!`);
}

export function resetLinhCan(): void {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) return;
  const nv = copyObj(state.run.nhanVat);
  nv.linhCan = mergeObj(nv.linhCan || {}, {
    pham: 'vo',
    he: [],
    isBienDi: false,
    tuLuyen: 0.5,
    dotPha: 0
  });
  updateNhanVat(nv);
  notify('🌱 Đã gỡ về Vô Linh Căn!');
}

export function updateMetaLuanHoi(diem: number, kiep?: number): void {
  persistGameMeta((meta: any) => {
    meta.diemLuanHoi = diem;
    meta.diemTong = Math.max(meta.diemTong || 0, diem);
    if (kiep !== undefined) {
      meta.kiep = kiep;
    }
  });

  if (kiep !== undefined) {
    const state = getGameState();
    if (state?.run) {
      const run = copyObj(state.run);
      run.kiep = kiep;
      setGameState({ run });
      persistGameSave(run);
    }
  }

  notify(`🌌 Đã gán Điểm Luân Hồi = ${diem.toLocaleString()}${kiep !== undefined ? `, Số Kiếp = ${kiep}` : ''}!`);
}

export function unlockAllAchievementsAndFerrymen(): void {
  const state = getGameState();
  if (!state) return notify('⚠️ Chưa kết nối được game store!');

  persistGameMeta((meta: any) => {
    meta.diemLuanHoi = 999999;
    meta.diemTong = Math.max(meta.diemTong || 0, 999999);

    const moKhoa = copyObj(meta.moKhoa || {});
    for (const m of MO_KHOA_DATA) {
      moKhoa[m.id] = m.max;
    }
    meta.moKhoa = moKhoa;

    const ttIds = ALL_THANH_TUU.map(a => a.id);
    meta.tienLo = mergeObj(meta.tienLo || {}, { thanhTuu: ttIds });
  });

  notify(`🏆 Đã Max 999,999 Điểm Luân Hồi + Mở Khóa 17 Lão Đò & 28 Thành Tựu!`);
}
