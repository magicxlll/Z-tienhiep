// MERIDIAN & EQUIPMENT OPTIMIZER ENGINE
import { getGameState, copyObj, setGameState, persistGameSave, gWin } from '../core/bridge';
import { getItemInfo, getAllAvailableItems, ItemInfo } from '../data/items';
import { notify, buildSyncedXepTui } from '../core/mutator';

export const FALLBACK_KHUON: Record<string, string> = {
  'the_chat.hoang_co': `
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
  'the_chat.kiem_cot': `
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
  'the_chat.thiet_cot': `
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
  'the_chat.bach_thao': `
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
  'the_chat.pham_the': `
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
  'the_chat.cuu_am': `
. 5 4 e 4 5 .
f d 2 b 2 3 5
4 c 0 0 0 2 4
4 1 0 D 0 1 e
4 2 0 0 0 c 4
5 3 2 b 2 3 5
. 5 3 d 3 f .
`
};

export interface MeridianLayout {
  rong: number;
  cao: number;
  danDien: number;
  vung: number[];
}

export function parseKhuon(khuonStr: string): MeridianLayout {
  const lines = khuonStr.trim().split('\n').map(l => l.trim().split(/\s+/));
  const cao = lines.length;
  const rong = lines[0].length;
  const vung: number[] = [];
  let danDien = -1;

  lines.forEach((row, y) => {
    row.forEach((cell, x) => {
      const idx = y * rong + x;
      if (cell === 'D') {
        danDien = idx;
        vung.push(0);
      } else if (cell === '.') {
        vung.push(-1);
      } else {
        vung.push(parseInt(cell, 16) || 0);
      }
    });
  });

  return { rong, cao, danDien, vung };
}

export function getMeridianLayout(physiqueId: string): MeridianLayout {
  try {
    const liveTc = gWin.game?.env?.content?.theChat?.get(physiqueId);
    if (liveTc && liveTc.khuon) {
      return parseKhuon(liveTc.khuon);
    }
  } catch (e) {}

  const fbStr = FALLBACK_KHUON[physiqueId] || FALLBACK_KHUON['the_chat.pham_the'];
  return parseKhuon(fbStr);
}

export function getOffsets(hinh: string[], rot: number): [number, number][] {
  let pts: [number, number][] = [];
  hinh.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch !== '.') pts.push([x, y]);
    });
  });

  for (let i = 0; i < (rot % 4 + 4) % 4; i++) {
    pts = pts.map(([x, y]) => [-y, x]);
  }

  const minX = Math.min(...pts.map(p => p[0]));
  const minY = Math.min(...pts.map(p => p[1]));
  return pts.map(([x, y]) => [x - minX, y - minY]);
}

export interface PlacedShard {
  item: string;
  x: number;
  y: number;
  xoay: number;
  cells: number[];
  element: string;
}

export function packShards(
  layout: MeridianLayout,
  candidates: ItemInfo[],
  maxCount: number = 12
): PlacedShard[] {
  const placed: PlacedShard[] = [];
  const occupied = new Set<number>();
  if (layout.danDien >= 0) {
    occupied.add(layout.danDien);
  }

  // Sort candidates by quality descending, then isShaped
  const sorted = [...candidates].sort((a, b) => {
    if (b.quality !== a.quality) return b.quality - a.quality;
    return (b.hinh?.length || 0) - (a.hinh?.length || 0);
  });

  for (const item of sorted) {
    if (!item.hinh || !item.hinh.length) continue;
    if (placed.some(p => p.item === item.id)) continue;

    let bestPos: { x: number; y: number; rot: number; cells: number[] } | null = null;

    // Try all 4 rotations
    for (let rot = 0; rot < 4 && !bestPos; rot++) {
      const offsets = getOffsets(item.hinh, rot);
      const w = Math.max(...offsets.map(p => p[0])) + 1;
      const h = Math.max(...offsets.map(p => p[1])) + 1;

      for (let y = 0; y <= layout.cao - h; y++) {
        for (let x = 0; x <= layout.rong - w; x++) {
          let valid = true;
          const cellIndices: number[] = [];

          for (const [ox, oy] of offsets) {
            const cx = x + ox;
            const cy = y + oy;
            const idx = cy * layout.rong + cx;

            if (
              cx < 0 || cy < 0 ||
              cx >= layout.rong || cy >= layout.cao ||
              layout.vung[idx] < 0 ||
              occupied.has(idx)
            ) {
              valid = false;
              break;
            }
            cellIndices.push(idx);
          }

          if (valid) {
            bestPos = { x, y, rot, cells: cellIndices };
            break;
          }
        }
        if (bestPos) break;
      }
    }

    if (bestPos) {
      const primaryEl = (item.he && item.he.length && item.he[0] !== 'vo_sac')
        ? item.he[0]
        : 'kim';

      placed.push({
        item: item.id,
        x: bestPos.x,
        y: bestPos.y,
        xoay: bestPos.rot,
        cells: bestPos.cells,
        element: primaryEl
      });

      bestPos.cells.forEach(idx => occupied.add(idx));
      if (placed.length >= maxCount) break;
    }
  }

  return placed;
}

// 6 DIVINE EQUIPMENT ITEMS
export const TOP_EQUIPMENT = {
  tru_vat: 'item.can_khon_gioi',      // Phẩm 8, Càn Khôn Giới (+1000 ô)
  di_hoa: 'item.cuu_u_hoang_hoa',     // Phẩm 8, Cửu U Hoàng Hỏa
  luyen_dan: 'item.dan_lo_tien',       // Phẩm 6, Thái Thượng đan lô
  che_phu: 'item.phu_but_tien',        // Phẩm 6, Lôi Mộc Phù Bút
  luyen_bao: 'item.khi_lo_tien',       // Phẩm 6, Thái Sơ đỉnh
  di_lai: 'item.thai_hu_chu'          // Phẩm 8, Thái Hư Chu
};

// PRESET BUILDS BY ELEMENT
export const ELEMENT_BUILDS: Record<string, {
  name: string;
  elements: string[];
  linhCanPham: string;
  items: string[];
}> = {
  kim: {
    name: '⚔️ Kiếm Tông / Kim Tu',
    elements: ['kim', 'loi'],
    linhCanPham: 'thien',
    items: [
      'item.yeu_hoang_huyet_kinh',
      'item.bat_chiet_kiem',
      'item.doan_thien_chien_ky',
      'item.toai_thien_kiem',
      'item.huyet_ma_thien_dao',
      'item.canh_kim_chan_kinh',
      'item.thien_loi_chinh_phap',
      'item.tu_tieu_loi_dien',
      'item.bat_diet_kim_than',
      'item.tru_tien_kiem'
    ]
  },
  hoa: {
    name: '🔥 Hỏa Tu / Viêm Đế',
    elements: ['hoa', 'moc'],
    linhCanPham: 'thien',
    items: [
      'item.yeu_hoang_huyet_kinh',
      'item.doan_thien_chien_ky',
      'item.dai_nhat_phat_an',
      'item.phan_thien_chan_hoa',
      'item.chuc_dung_hoa_dien',
      'item.hon_thien_lang',
      'item.cuu_vi_huyen_dang',
      'item.hoa_lan_truong',
      'item.hoa_loan_vu_y',
      'item.van_tuong_dien'
    ]
  },
  thuy: {
    name: '❄️ Thủy / Băng Tu',
    elements: ['thuy', 'bang'],
    linhCanPham: 'thien',
    items: [
      'item.thai_co_long_lan',
      'item.nghich_lan_thuan',
      'item.truong_sinh_chan_kinh',
      'item.thai_am_han_kinh',
      'item.huyen_vu_chan_kinh',
      'item.ngoc_tinh_binh',
      'item.tran_hai_than_chuy',
      'item.hoa_long_truong',
      'item.thien_bang_cung',
      'item.ly_long_giap'
    ]
  },
  moc: {
    name: '🌿 Mộc Tu / Trường Sinh',
    elements: ['moc', 'phong'],
    linhCanPham: 'thien',
    items: [
      'item.truong_sinh_chan_kinh',
      'item.cuu_thien_cuong_phong',
      'item.con_bang_chan_quyet',
      'item.kien_moc_thien_kinh',
      'item.van_hon_phien',
      'item.hat_vi_tien',
      'item.thanh_loan_tram',
      'item.tu_sa_doc_cham',
      'item.thanh_de_truong_xuan_kinh',
      'item.van_thi_doc_vu'
    ]
  },
  tho: {
    name: '⛰️ Thổ Tu / Bất Diệt',
    elements: ['tho', 'kim'],
    linhCanPham: 'thien',
    items: [
      'item.yeu_hoang_huyet_kinh',
      'item.thai_co_long_lan',
      'item.khon_nguyen_than_kinh',
      'item.hau_tho_than_bi',
      'item.hung_tam_kinh',
      'item.vien_tam_moc_ngu',
      'item.huyen_hoang_tao_hoa_kinh',
      'item.huyen_hoang_chuong',
      'item.huyen_nham_chan_kinh',
      'item.thai_son_ap_dinh'
    ]
  },
  loi_phong: {
    name: '⚡ Lôi / Phong Tu (Cuồng Bạo)',
    elements: ['loi', 'phong'],
    linhCanPham: 'bien_di',
    items: [
      'item.thien_loi_chinh_phap',
      'item.cuu_thien_cuong_phong',
      'item.tu_tieu_loi_dien',
      'item.con_bang_chan_quyet',
      'item.van_hon_phien',
      'item.tu_tieu_than_kiem',
      'item.cuu_tieu_ngu_loi_quyet',
      'item.thien_cuong_loi_quyet',
      'item.thanh_minh_phong_kinh',
      'item.oanh_thien_loi_chuy'
    ]
  },
  toan_nang: {
    name: '🌟 Toàn Năng Thần Cấp (Top Phẩm 8)',
    elements: ['kim', 'moc', 'thuy', 'hoa', 'tho', 'bang', 'phong', 'loi'],
    linhCanPham: 'thien',
    items: [
      'item.luan_hoi_chan_kinh',
      'item.yeu_hoang_huyet_kinh',
      'item.phong_thien_an',
      'item.bat_chiet_kiem',
      'item.tam_sinh_thach',
      'item.thai_co_long_lan',
      'item.doan_thien_chien_ky',
      'item.nghich_lan_thuan',
      'item.van_kiep_hon_dang',
      'item.toai_thien_kiem'
    ]
  }
};

/**
 * Auto-optimize meridian shard placement from player's existing inventory
 * Tunes meridian colors to match shard elements (100% resonance, zero conflict)
 * Automatically equips best 6 items in trangBi from inventory
 */
export function autoOptimizeFromBag(): boolean {
  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
    return false;
  }

  const nv = copyObj(state.run.nhanVat);
  const tuiDo = copyObj(nv.tuiDo || {});
  const layout = getMeridianLayout(nv.theChat || 'the_chat.pham_the');

  // 1. Gather all placeable shards from bag
  const candidateItems: ItemInfo[] = [];
  for (const itemId in tuiDo) {
    if (tuiDo[itemId] > 0) {
      const info = getItemInfo(itemId);
      if (info.isShaped && info.hinh && info.hinh.length) {
        candidateItems.push(info);
      }
    }
  }

  if (candidateItems.length === 0) {
    notify('⚠️ Trong túi chưa có công pháp hoặc pháp khí có mảnh ghép để bố trí!');
    return false;
  }

  // 2. Pack shards onto grid
  const placed = packShards(layout, candidateItems, 12);
  if (placed.length === 0) {
    notify('⚠️ Không tìm được vị trí hợp lệ để đặt các mảnh hiện có!');
    return false;
  }

  // 3. Update kinhMach
  const oldKm = copyObj(nv.kinhMach || {});
  const totalCells = layout.rong * layout.cao;

  // Initialize colors and states
  const mau: string[] = oldKm.mau && oldKm.mau.length === totalCells
    ? [...oldKm.mau]
    : new Array(totalCells).fill('kim');

  const trangThai: string[] = new Array(totalCells).fill('an');
  for (let i = 0; i < totalCells; i++) {
    if (layout.vung[i] >= 0) {
      trangThai[i] = 'thong'; // Đả thông all valid cells
    }
  }

  // Set colors under placed shards to 100% match shard element (Zero conflict, 100% buff)
  placed.forEach(p => {
    p.cells.forEach(idx => {
      mau[idx] = p.element;
    });
  });

  const newManh = placed.map(p => ({
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

  // 4. Equip best gear from bag into trangBi (6 slots)
  const currentTrangBi = copyObj(nv.trangBi || {});
  const allAvailable = getAllAvailableItems();

  const slotItems: Record<string, ItemInfo[]> = {
    tru_vat: [],
    di_hoa: [],
    luyen_dan: [],
    che_phu: [],
    luyen_bao: [],
    di_lai: []
  };

  allAvailable.forEach(it => {
    if ((tuiDo[it.id] || 0) > 0) {
      if (it.cat === 'tru_vat') slotItems.tru_vat.push(it);
      else if (it.cat === 'di_hoa') slotItems.di_hoa.push(it);
      else if (it.cat === 'dung_cu') {
        if (it.id.includes('dan_lo')) slotItems.luyen_dan.push(it);
        else if (it.id.includes('phu_but')) slotItems.che_phu.push(it);
        else if (it.id.includes('khi_lo')) slotItems.luyen_bao.push(it);
      } else if (it.cat === 'phuong_tien') slotItems.di_lai.push(it);
    }
  });

  for (const slotKey in slotItems) {
    const list = slotItems[slotKey].sort((a, b) => b.quality - a.quality);
    if (list.length > 0) {
      currentTrangBi[slotKey] = list[0].id;
    }
  }
  nv.trangBi = currentTrangBi;

  // 5. Commit and save
  const nextRun = copyObj(state.run);
  nextRun.nhanVat = nv;
  setGameState({ run: nextRun });
  persistGameSave(nextRun);

  notify(`⚡ Bố trí thành công ${placed.length} mảnh tối ưu & trang bị 6 món đồ từ túi!`);
  return true;
}

/**
 * Apply a specialized elemental build:
 * Injects top shards & 6 divine equipment into bag
 * Places them on meridian with 100% resonance and zero conflict
 * Tunes linhCan and meridian cell colors
 * Equips divine gear into trangBi
 */
export function applyElementalBuild(buildKey: string): boolean {
  const build = ELEMENT_BUILDS[buildKey];
  if (!build) {
    notify('⚠️ Không tìm thấy cấu hình hệ này!');
    return false;
  }

  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
    return false;
  }

  const nv = copyObj(state.run.nhanVat);
  const tuiDo = copyObj(nv.tuiDo || {});
  const layout = getMeridianLayout(nv.theChat || 'the_chat.pham_the');

  // 1. Inject build shards into bag
  build.items.forEach(id => {
    tuiDo[id] = Math.max(tuiDo[id] || 0, 1);
  });

  // 2. Inject 6 divine gear into bag and equip
  const currentTrangBi = copyObj(nv.trangBi || {});
  for (const [slot, id] of Object.entries(TOP_EQUIPMENT)) {
    tuiDo[id] = Math.max(tuiDo[id] || 0, 1);
    currentTrangBi[slot] = id;
  }
  nv.trangBi = currentTrangBi;

  // 3. Pack shards onto grid
  const candidateItems = build.items.map(id => getItemInfo(id)).filter(it => it.isShaped);
  const placed = packShards(layout, candidateItems, 12);

  // 4. Update meridian colors and states
  const totalCells = layout.rong * layout.cao;
  const primaryEl = build.elements[0] || 'kim';
  const mau: string[] = new Array(totalCells).fill(primaryEl);
  const trangThai: string[] = new Array(totalCells).fill('an');

  for (let i = 0; i < totalCells; i++) {
    if (layout.vung[i] >= 0) {
      trangThai[i] = 'thong';
    }
  }

  // Match cell colors to placed shards
  placed.forEach(p => {
    p.cells.forEach(idx => {
      mau[idx] = p.element;
    });
  });

  const oldKm = copyObj(nv.kinhMach || {});
  oldKm.manh = placed.map(p => ({
    item: p.item,
    x: p.x,
    y: p.y,
    xoay: p.xoay
  }));
  oldKm.mau = mau;
  oldKm.trangThai = trangThai;
  oldKm.cho = { mo: 99, doiMau: 99 };
  nv.kinhMach = oldKm;

  // 5. Update Linh Can to match build
  nv.linhCan = {
    pham: build.linhCanPham || 'thien',
    he: [...build.elements]
  };

  // 6. Update bag sync & slots
  nv.tuiDo = tuiDo;
  nv.oTuiThem = Math.max(nv.oTuiThem || 0, Object.keys(tuiDo).length + 80);
  nv.xepTui = buildSyncedXepTui(nv.xepTui, tuiDo);

  // 7. Commit and save
  const nextRun = copyObj(state.run);
  nextRun.nhanVat = nv;
  setGameState({ run: nextRun });
  persistGameSave(nextRun);

  notify(`🚀 Đã áp dụng ${build.name}: Bố trí ${placed.length} mảnh cực phẩm, trang bị 6 thần khí!`);
  return true;
}
