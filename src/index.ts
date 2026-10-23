import { waitForGame } from './core/bridge';
import { initUI } from './ui/app';
import { notify } from './core/mutator';

(function() {
  'use strict';

  // Windows Script Host protection (for when clicked on Windows explorer)
  if (typeof (window as any).WScript !== 'undefined') {
    (window as any).WScript.Echo("Đây là file Userscript dành cho trình duyệt web (Violentmonkey / Tampermonkey).");
    (window as any).WScript.Quit(0);
    return;
  }

  console.log('[VKTT MOD v3.0] Khởi động trình hỗ trợ Vạn Kiếp Tu Tiên...');

  waitForGame(() => {
    initUI();
    notify('✨ VẠN KIẾP TU TIÊN MOD v3.0 đã kích hoạt! Bấm biểu tượng ☯ ở góc màn hình.');
  });
})();
