import { PRESET_ITEMS, QUALITY_COLORS } from './presets';
import { getGameState } from '../core/bridge';

export interface ItemInfo {
  id: string;
  name: string;
  quality: number;
  cat: string;
  desc?: string;
}

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

  // Fallback to game dynamic content
  try {
    const state = getGameState();
    const content = state?.content || {};
    const itemObj = content.item || {};
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
        cat: itemData.loai || 'Vật phẩm',
        desc: itemData.mo_ta || itemData.desc || ''
      };
    }
  } catch (e) {}

  // Pretty format id
  const parts = normId.replace('item.', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
  return {
    id: normId,
    name: parts.join(' '),
    quality: 1,
    cat: 'Tự do',
    desc: 'Vật phẩm tự do'
  };
}

let cachedAllItems: ItemInfo[] | null = null;

export function getAllAvailableItems(): ItemInfo[] {
  if (cachedAllItems) return cachedAllItems;

  const map = new Map<string, ItemInfo>();

  // 1. Add all presets
  for (const id in PRESET_ITEMS) {
    if (Object.prototype.hasOwnProperty.call(PRESET_ITEMS, id)) {
      const p = PRESET_ITEMS[id];
      map.set(id, {
        id,
        name: p.name,
        quality: p.quality,
        cat: p.cat,
        desc: p.desc
      });
    }
  }

  // 2. Scan dynamic items from game.content.item
  try {
    const state = getGameState();
    const content = state?.content || {};
    const itemObj = content.item || {};

    if (itemObj && typeof itemObj.forEach === 'function') {
      itemObj.forEach((val: any, key: string) => {
        const fullId = key.startsWith('item.') ? key : `item.${key}`;
        if (!map.has(fullId)) {
          map.set(fullId, {
            id: fullId,
            name: val.ten || val.name || key,
            quality: val.pham_cap || val.phamCap || 1,
            cat: val.loai || 'Vật phẩm',
            desc: val.mo_ta || val.desc || ''
          });
        }
      });
    } else if (itemObj && typeof itemObj === 'object') {
      for (const key of Object.keys(itemObj)) {
        const fullId = key.startsWith('item.') ? key : `item.${key}`;
        if (!map.has(fullId)) {
          const val = itemObj[key];
          map.set(fullId, {
            id: fullId,
            name: val?.ten || val?.name || key,
            quality: val?.pham_cap || val?.phamCap || 1,
            cat: val?.loai || 'Vật phẩm',
            desc: val?.mo_ta || val?.desc || ''
          });
        }
      }
    }
  } catch (e) {}

  cachedAllItems = Array.from(map.values()).sort((a, b) => {
    if (b.quality !== a.quality) return b.quality - a.quality;
    return a.name.localeCompare(b.name, 'vi');
  });

  return cachedAllItems;
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
