import { PRESET_ITEMS, QUALITY_COLORS } from './presets';
import { getGameState, gWin } from '../core/bridge';

export interface ItemInfo {
  id: string;
  name: string;
  quality: number;
  cat: string;
  he?: string[];
  hinh?: string[];
  desc?: string;
  isShaped?: boolean;
}

export const CATEGORY_NAMES: Record<string, string> = {
  all: 'Tất Cả Loại',
  cong_phap: 'Công Pháp',
  dan_duoc: 'Đan Dược',
  phap_khi: 'Pháp Khí',
  tran_ban: 'Trận Bàn / Trận Đồ',
  ngu_linh: 'Ngự Linh / Khôi Lỗi',
  linh_duoc: 'Linh Dược',
  yeu_tai: 'Yêu Tài',
  luyen_che: 'Nguyên Liệu Luyện Chế',
  nguyen_lieu: 'Khoáng Thạch / Kim Loại',
  phu_luc: 'Phù Lục',
  di_hoa: 'Dị Hỏa',
  dung_cu: 'Dụng Cụ Luyện Chế',
  phuong_tien: 'Phương Tiện',
  tru_vat: 'Trữ Vật',
  don_phuong: 'Đơn Phương / Đồ Phổ',
  di_bao: 'Dị Bảo',
  lenh_bai: 'Lệnh Bài',
  dac_san: 'Đặc Sản',
  tap_vat: 'Tạp Vật',
};

export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function getItemInfo(itemId: string): ItemInfo {
  const normId = itemId.startsWith('item.') ? itemId : `item.${itemId}`;
  
  // 1. Try runtime live game content first for 100% precision
  try {
    const liveItems = gWin.game?.env?.content?.items;
    if (liveItems && typeof liveItems.get === 'function') {
      const liveData = liveItems.get(normId);
      if (liveData) {
        return {
          id: normId,
          name: liveData.ten || liveData.name || normId.replace('item.', ''),
          quality: liveData.pham_cap || liveData.phamCap || 1,
          cat: liveData.loai || 'khac',
          he: liveData.he || [],
          hinh: liveData.hinh || [],
          desc: liveData.mo_ta || liveData.desc || '',
          isShaped: !!(liveData.hinh && liveData.hinh.length)
        };
      }
    }
  } catch (e) {}

  // 2. Preset items
  if (PRESET_ITEMS[normId]) {
    const p = PRESET_ITEMS[normId];
    return {
      id: normId,
      name: p.name,
      quality: p.quality || 1,
      cat: p.cat || 'Vật phẩm',
      desc: p.desc
    };
  }

  // 3. Fallback to state.content
  try {
    const state = getGameState();
    const content = state?.content || {};
    const itemObj = content.items || content.item || {};
    const rawKey = normId.replace('item.', '');

    let itemData: any = null;
    if (typeof itemObj.get === 'function') {
      itemData = itemObj.get(normId) || itemObj.get(rawKey);
    } else {
      itemData = itemObj[normId] || itemObj[rawKey];
    }

    if (itemData) {
      return {
        id: normId,
        name: itemData.ten || itemData.name || rawKey,
        quality: itemData.pham_cap || itemData.phamCap || 1,
        cat: itemData.loai || 'khac',
        he: itemData.he || [],
        hinh: itemData.hinh || [],
        desc: itemData.mo_ta || itemData.desc || '',
        isShaped: !!(itemData.hinh && itemData.hinh.length)
      };
    }
  } catch (e) {}

  // Pretty format fallback
  const parts = normId.replace('item.', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
  return {
    id: normId,
    name: parts.join(' '),
    quality: 1,
    cat: 'khac',
    desc: 'Vật phẩm tu tiên'
  };
}

let cachedAllItems: ItemInfo[] | null = null;
let lastCacheTime = 0;

export function getAllAvailableItems(): ItemInfo[] {
  const now = Date.now();
  // Invalidate cache every 10s to pick up newly unlocked or dynamic game items
  if (cachedAllItems && (now - lastCacheTime < 10000)) return cachedAllItems;

  const map = new Map<string, ItemInfo>();

  // 1. Scan dynamic items from live game environment (988 items)
  try {
    const liveItems = gWin.game?.env?.content?.items;
    if (liveItems && typeof liveItems.forEach === 'function') {
      liveItems.forEach((val: any, key: string) => {
        const fullId = key.startsWith('item.') ? key : `item.${key}`;
        map.set(fullId, {
          id: fullId,
          name: val.ten || val.name || key,
          quality: val.pham_cap || val.phamCap || 1,
          cat: val.loai || 'khac',
          he: val.he || [],
          hinh: val.hinh || [],
          desc: val.mo_ta || val.desc || '',
          isShaped: !!(val.hinh && val.hinh.length)
        });
      });
    }
  } catch (e) {}

  // 2. Scan from store state if any
  try {
    const state = getGameState();
    const content = state?.content || {};
    const itemObj = content.items || content.item || {};

    if (itemObj && typeof itemObj.forEach === 'function') {
      itemObj.forEach((val: any, key: string) => {
        const fullId = key.startsWith('item.') ? key : `item.${key}`;
        if (!map.has(fullId)) {
          map.set(fullId, {
            id: fullId,
            name: val.ten || val.name || key,
            quality: val.pham_cap || val.phamCap || 1,
            cat: val.loai || 'khac',
            he: val.he || [],
            hinh: val.hinh || [],
            desc: val.mo_ta || val.desc || '',
            isShaped: !!(val.hinh && val.hinh.length)
          });
        }
      });
    }
  } catch (e) {}

  // 3. Fallback presets
  for (const id in PRESET_ITEMS) {
    if (Object.prototype.hasOwnProperty.call(PRESET_ITEMS, id)) {
      if (!map.has(id)) {
        const p = PRESET_ITEMS[id];
        map.set(id, {
          id,
          name: p.name,
          quality: p.quality || 1,
          cat: p.cat || 'khac',
          desc: p.desc
        });
      }
    }
  }

  cachedAllItems = Array.from(map.values()).sort((a, b) => {
    if (b.quality !== a.quality) return b.quality - a.quality;
    return a.name.localeCompare(b.name, 'vi');
  });

  lastCacheTime = now;
  return cachedAllItems;
}

export function filterItems(
  catFilter: string = 'all',
  qualityFilter: number = -1,
  searchQuery: string = '',
  offset: number = 0,
  limit: number = 50
): { items: ItemInfo[]; total: number } {
  let list = getAllAvailableItems();

  if (catFilter && catFilter !== 'all') {
    list = list.filter(it => it.cat === catFilter);
  }

  if (qualityFilter > 0) {
    list = list.filter(it => it.quality === qualityFilter);
  }

  if (searchQuery && searchQuery.trim()) {
    const cleanQ = removeVietnameseTones(searchQuery.trim());
    const rawQ = searchQuery.trim().toLowerCase();
    list = list.filter(it => {
      const nameNorm = removeVietnameseTones(it.name);
      const idNorm = it.id.toLowerCase();
      return nameNorm.includes(cleanQ) || idNorm.includes(rawQ);
    });
  }

  const total = list.length;
  const items = list.slice(offset, offset + limit);
  return { items, total };
}

export function searchItems(query: string, maxResults = 30): ItemInfo[] {
  const items = getAllAvailableItems();
  if (!query || !query.trim()) {
    return items.slice(0, maxResults);
  }

  const cleanQ = removeVietnameseTones(query.trim());
  const rawQ = query.trim().toLowerCase();

  const results: { item: ItemInfo; score: number }[] = [];

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
  return results.slice(0, maxResults).map(r => r.item);
}
