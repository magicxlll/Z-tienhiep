import { notify } from '../core/mutator';

export function exportSaveFile(): void {
  try {
    const saveData: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('tu-tien:') || key === 'vktt_custom_items')) {
        const val = localStorage.getItem(key);
        if (val !== null) saveData[key] = val;
      }
    }

    if (Object.keys(saveData).length === 0) {
      return notify('⚠️ Không tìm thấy dữ liệu lưu của game trong trình duyệt!');
    }

    let charName = 'DaoHuu';
    try {
      const meta = JSON.parse(saveData['tu-tien:meta'] || '{}');
      if (meta.ten) charName = meta.ten.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
    } catch (e) {}

    const jsonStr = JSON.stringify(saveData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `VKTT-Save-${charName}-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    notify('💾 Đã xuất file Save thành công và tải về máy!');
  } catch (err: any) {
    notify('❌ Lỗi khi xuất Save: ' + err.message);
  }
}

export function importSaveJson(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object') {
      notify('❌ File Save không đúng định dạng JSON!');
      return false;
    }

    let count = 0;
    for (const k of Object.keys(data)) {
      if (k.startsWith('tu-tien:') || k === 'vktt_custom_items') {
        localStorage.setItem(k, data[k]);
        count++;
      }
    }

    if (count === 0) {
      notify('⚠️ Không có mục dữ liệu game hợp lệ trong file!');
      return false;
    }

    notify(`✅ Đã nạp thành công ${count} mục save! Trang sẽ tải lại sau 1.5 giây...`);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
    return true;
  } catch (e: any) {
    notify('❌ Lỗi nạp Save: ' + e.message);
    return false;
  }
}

export function clearGameCache(): void {
  if (!confirm('⚠️ Bạn có chắc chắn muốn TẨY TỦY (Xóa toàn bộ Save và dữ liệu đệm của game trên trình duyệt này)?')) {
    return;
  }
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && k.startsWith('tu-tien:')) {
      localStorage.removeItem(k);
    }
  }
  notify('🌀 Đã tẩy tủy toàn bộ dữ liệu. Đang tải lại trang...');
  setTimeout(() => {
    window.location.reload();
  }, 1200);
}
