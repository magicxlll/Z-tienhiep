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

// 4-DIRECTION ADJACENT NEIGHBORS
export function qg(t: MeridianLayout, n: number): number[] {
  const e = n % t.rong;
  const i = Math.floor(n / t.rong);
  const o: number[] = [];
  if (e > 0) o.push(n - 1);
  if (e < t.rong - 1) o.push(n + 1);
  if (i > 0) o.push(n - t.rong);
  if (i < t.cao - 1) o.push(n + t.rong);
  return o.filter(a => t.vung[a] >= 0);
}

// TƯƠNG SINH - TƯƠNG KHẮC CYCLE RULES
const EX: Record<string, string> = { loi: 'moc', phong: 'moc', bang: 'thuy' };
const LX: Record<string, string> = { moc: 'hoa', hoa: 'tho', tho: 'kim', kim: 'thuy', thuy: 'moc' };
const DX: Record<string, string> = { kim: 'moc', moc: 'tho', tho: 'thuy', thuy: 'hoa', hoa: 'kim' };

export const xi = (t: string): string => EX[t] || t;
export const isSinh = (t: string, n: string): boolean => t !== 'vo_sac' && n !== 'vo_sac' && LX[xi(t)] === xi(n);
export const isKhac = (t: string, n: string): boolean => t !== 'vo_sac' && n !== 'vo_sac' && DX[xi(t)] === xi(n);

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
  name?: string;
  loai?: string;
  x: number;
  y: number;
  xoay: number;
  cells: number[];
  element: string;
}

/**
 * Smart packing algorithm:
 * 1. Prioritizes Cong Phap first to build unbroken vascular conduits out from Dan Dien.
 * 2. Ensures EVERY placed shard touches Dan Dien or touches a connected Cong Phap (100% thong, zero hatch cheo).
 * 3. STRICT ZERO CONFLICT: Reject any position where any adjacent cell triggers isKhac (zero red borders).
 * 4. MAXIMUM RESONANCE: Score bonus (+150) for adjacent cells triggering isSinh (green borders).
 */
export function packShards(
  layout: MeridianLayout,
  candidates: ItemInfo[],
  maxCount: number = 10
): PlacedShard[] {
  // Separate Cong Phap (conduits) and Phap Khi
  const congPhaps = candidates.filter(c => c.cat === 'cong_phap').sort((a, b) => (b.quality || 0) - (a.quality || 0));
  const phapKhis = candidates.filter(c => c.cat !== 'cong_phap').sort((a, b) => (b.quality || 0) - (a.quality || 0));

  // Interleave to establish vascular network from Dan Dien
  const orderedCandidates: ItemInfo[] = [];
  orderedCandidates.push(...congPhaps.slice(0, 3));
  let cpIdx = 3, pkIdx = 0;
  while (cpIdx < congPhaps.length || pkIdx < phapKhis.length) {
    if (pkIdx < phapKhis.length) orderedCandidates.push(phapKhis[pkIdx++]);
    if (cpIdx < congPhaps.length) orderedCandidates.push(congPhaps[cpIdx++]);
  }

  const placed: PlacedShard[] = [];
  const cellOccupant = layout.vung.map(() => -1);
  cellOccupant[layout.danDien] = -999; // Dan Dien reserved

  // Energy connection sources: Dan Dien + all cells of placed connected Cong Phap
  const connectionSources = new Set<number>([layout.danDien]);

  for (const item of orderedCandidates) {
    if (placed.length >= maxCount) break;
    if (!item.hinh || !item.hinh.length) continue;
    if (placed.some(p => p.item === item.id)) continue;

    const isCP = item.cat === 'cong_phap';
    const itemEl = item.he && item.he.length && item.he[0] !== 'vo_sac' ? item.he[0] : 'vo_sac';

    let bestPlacement: PlacedShard | null = null;
    let bestScore = -999999;

    for (let rot = 0; rot < 4; rot++) {
      const offsets = getOffsets(item.hinh, rot);
      const w = Math.max(...offsets.map(p => p[0])) + 1;
      const h = Math.max(...offsets.map(p => p[1])) + 1;

      for (let y = 0; y <= layout.cao - h; y++) {
        for (let x = 0; x <= layout.rong - w; x++) {
          const cells: number[] = [];
          let fits = true;
          let touchesConnection = false;
          let hasConflict = false;
          let sinhScore = 0;

          for (const [ox, oy] of offsets) {
            const cx = x + ox;
            const cy = y + oy;
            const cIdx = cy * layout.rong + cx;
            if (
              cx < 0 || cy < 0 ||
              cx >= layout.rong || cy >= layout.cao ||
              layout.vung[cIdx] < 0 ||
              cellOccupant[cIdx] !== -1
            ) {
              fits = false;
              break;
            }
            cells.push(cIdx);
          }

          if (!fits) continue;

          // Check connectivity and neighbors
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

                // STRICT: ZERO TƯƠNG KHẮC (NO RED BORDERS)
                if (isKhac(itemEl, nbrEl) || isKhac(nbrEl, itemEl)) {
                  hasConflict = true;
                  break;
                }

                // TƯƠNG SINH BONUS (GREEN BORDERS)
                if (isSinh(itemEl, nbrEl) || isSinh(nbrEl, itemEl)) {
                  sinhScore += 150;
                } else if (itemEl === nbrEl && itemEl !== 'vo_sac') {
                  sinhScore += 40; // Same element resonance
                }
              }
            }
            if (hasConflict) break;
          }

          // Shard MUST connect to Dan Dien / Cong Phap network, and MUST NOT cause conflict
          if (!touchesConnection || hasConflict) continue;

          // Clustered closeness to Dan Dien
          const ddX = layout.danDien % layout.rong;
          const ddY = Math.floor(layout.danDien / layout.rong);
          const avgX = cells.reduce((s, c) => s + (c % layout.rong), 0) / cells.length;
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

// EVALUATION HELPER: Mirror of game engine Hk function
export function evaluatePlacedShards(
  layout: MeridianLayout,
  placed: PlacedShard[]
): { total: number; thong: number; green: number; red: number } {
  const r = placed.map(p => {
    const it = getItemInfo(p.item);
    return {
      item: it,
      o: p.cells,
      he: p.element || it.he?.[0] || 'vo_sac',
      heO: p.cells.map(() => p.element || it.he?.[0] || 'vo_sac'),
      thong: false
    };
  });

  const h = layout.vung.map(() => -1);
  r.forEach((shard, sIdx) => shard.o.forEach(c => h[c] = sIdx));
  const l = r.map(() => new Set<number>());
  const d = r.map(() => false);
  const g = r.map(() => new Map<number, [string, string][]>());

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

  const isCP = (C: number) => r[C]?.item.cat === 'cong_phap';
  const queue = r.map((C, S) => S).filter(C => d[C] && isCP(C));
  for (const C of queue) r[C].thong = true;
  while (queue.length > 0) {
    const C = queue.shift()!;
    for (const nbr of l[C]) {
      if (!r[nbr].thong && isCP(nbr)) {
        r[nbr].thong = true;
        queue.push(nbr);
      }
    }
  }

  r.forEach((C, S) => {
    if (C && C.item.cat !== 'cong_phap') {
      C.thong = d[S] || [...l[S]].some(P => isCP(P) && r[P].thong);
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

  return { total: r.length, thong: r.filter(s => s.thong).length, green: greenBorders, red: redBorders };
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

// PRESET BUILDS BY ELEMENT: BALANCED CP (CONDUITS) & PK (ARTIFACTS)
export const ELEMENT_BUILDS: Record<string, {
  name: string;
  elements: string[];
  linhCanPham: string;
  items: string[];
}> = {
  kim: {
    name: '⚔️ Kiếm Tông / Kim Tu',
    elements: ['kim', 'thuy', 'tho'],
    linhCanPham: 'thien',
    items: [
      'item.yeu_hoang_huyet_kinh',
      'item.huyet_ma_thien_dao',
      'item.canh_kim_chan_kinh',
      'item.truong_sinh_chan_kinh',
      'item.khon_nguyen_than_kinh',
      'item.bat_diet_kim_than',
      'item.huyen_vu_chan_kinh',
      'item.bat_chiet_kiem',
      'item.thai_co_long_lan',
      'item.doan_thien_chien_ky',
      'item.nghich_lan_thuan',
      'item.toai_thien_kiem',
      'item.tru_tien_kiem',
      'item.dai_phan_thien_chung'
    ]
  },
  hoa: {
    name: '🔥 Hỏa Tu / Viêm Đế',
    elements: ['hoa', 'moc', 'tho'],
    linhCanPham: 'thien',
    items: [
      'item.yeu_hoang_huyet_kinh',
      'item.dai_nhat_phat_an',
      'item.truong_sinh_chan_kinh',
      'item.phan_thien_chan_hoa',
      'item.chuc_dung_hoa_dien',
      'item.khon_nguyen_than_kinh',
      'item.kien_moc_thien_kinh',
      'item.thai_co_long_lan',
      'item.doan_thien_chien_ky',
      'item.hon_thien_lang',
      'item.hau_tho_than_bi',
      'item.hat_vi_tien',
      'item.cuu_vi_huyen_dang',
      'item.hoa_lan_truong'
    ]
  },
  thuy: {
    name: '❄️ Thủy / Băng Tu',
    elements: ['thuy', 'bang', 'kim'],
    linhCanPham: 'thien',
    items: [
      'item.yeu_hoang_huyet_kinh',
      'item.huyet_ma_thien_dao',
      'item.canh_kim_chan_kinh',
      'item.truong_sinh_chan_kinh',
      'item.thai_am_han_kinh',
      'item.bat_diet_kim_than',
      'item.huyen_vu_chan_kinh',
      'item.bat_chiet_kiem',
      'item.thai_co_long_lan',
      'item.doan_thien_chien_ky',
      'item.nghich_lan_thuan',
      'item.toai_thien_kiem',
      'item.tru_tien_kiem',
      'item.dai_phan_thien_chung'
    ]
  },
  moc: {
    name: '🌿 Mộc Tu / Trường Sinh',
    elements: ['moc', 'phong', 'thuy'],
    linhCanPham: 'thien',
    items: [
      'item.truong_sinh_chan_kinh',
      'item.cuu_thien_cuong_phong',
      'item.con_bang_chan_quyet',
      'item.kien_moc_thien_kinh',
      'item.huyen_vu_chan_kinh',
      'item.thanh_de_truong_xuan_kinh',
      'item.van_thi_doc_vu',
      'item.thai_co_long_lan',
      'item.nghich_lan_thuan',
      'item.van_hon_phien',
      'item.ngoc_tinh_binh',
      'item.tran_hai_than_chuy',
      'item.hoa_long_truong',
      'item.hat_vi_tien'
    ]
  },
  tho: {
    name: '⛰️ Thổ Tu / Bất Diệt',
    elements: ['tho', 'hoa', 'kim'],
    linhCanPham: 'thien',
    items: [
      'item.yeu_hoang_huyet_kinh',
      'item.huyet_ma_thien_dao',
      'item.dai_nhat_phat_an',
      'item.canh_kim_chan_kinh',
      'item.phan_thien_chan_hoa',
      'item.chuc_dung_hoa_dien',
      'item.khon_nguyen_than_kinh',
      'item.bat_chiet_kiem',
      'item.thai_co_long_lan',
      'item.doan_thien_chien_ky',
      'item.toai_thien_kiem',
      'item.tru_tien_kiem',
      'item.dai_phan_thien_chung',
      'item.hon_thien_lang'
    ]
  },
  loi_phong: {
    name: '⚡ Lôi / Phong Tu (Cuồng Bạo)',
    elements: ['loi', 'phong', 'thuy'],
    linhCanPham: 'bien_di',
    items: [
      'item.truong_sinh_chan_kinh',
      'item.thien_loi_chinh_phap',
      'item.cuu_thien_cuong_phong',
      'item.tu_tieu_loi_dien',
      'item.con_bang_chan_quyet',
      'item.huyen_vu_chan_kinh',
      'item.cuu_tieu_ngu_loi_quyet',
      'item.thai_co_long_lan',
      'item.nghich_lan_thuan',
      'item.van_hon_phien',
      'item.tu_tieu_than_kiem',
      'item.ngoc_tinh_binh',
      'item.tran_hai_than_chuy',
      'item.hoa_long_truong'
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
      'item.ngu_to_hop_dao_quyet',
      'item.thien_ma_chan_kinh',
      'item.huyet_ma_thien_dao',
      'item.nhu_lai_tang_kinh',
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

  // 2. Pack shards onto grid with strict connectivity & zero conflict
  const placed = packShards(layout, candidateItems, 10);
  if (placed.length === 0) {
    notify('⚠️ Không tìm được vị trí hợp lệ kết nối với Đan Điền cho các mảnh hiện có!');
    return false;
  }

  // 3. Update kinhMach
  const oldKm = copyObj(nv.kinhMach || {});
  const totalCells = layout.rong * layout.cao;

  // Initialize colors and states
  const mau: string[] = oldKm.mau && oldKm.mau.length === totalCells
    ? [...oldKm.mau]
    : new Array(totalCells).fill('vo_sac');

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

  const ev = evaluatePlacedShards(layout, placed);
  notify(`⚡ Bố trí ${ev.thong}/${ev.total} mảnh thông mạch (${ev.green} viền tương sinh, ${ev.red} viền khắc) & trang bị 6 món đồ từ túi!`);
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

  // 3. Pack shards onto grid with vascular network & zero conflict
  const candidateItems = build.items.map(id => getItemInfo(id)).filter(it => it.isShaped);
  const placed = packShards(layout, candidateItems, 10);

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

  const ev = evaluatePlacedShards(layout, placed);
  notify(`🚀 Đã áp dụng ${build.name}: ${ev.thong}/${ev.total} mảnh thông mạch (${ev.green} viền tương sinh, 0 viền khắc)!`);
  return true;
}
