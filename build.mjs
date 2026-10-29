import esbuild from 'esbuild';
import fs from 'fs';

const banner = `// ==UserScript==
// @name         Vạn Kiếp Tu Tiên - MOD Assistant Suite v3.5 (Ma Đạo & Ngự Linh)
// @namespace    https://github.com/magicxlll/Z-tienhiep
// @version      3.5.0
// @description  Bảng MOD & Tự Động Hóa Vạn Kiếp Tu Tiên - Cập nhật Ma Đạo, Linh Thú/Ngự Linh, 3 Thể Chất Mới, Trận Pháp & Redesign Giao Diện Cổ Phong Xianxia
// @author       Z-TienHiep & VKTT Team
// @match        https://van-kiep-tu-tien.vuhaiquan2k1.workers.dev/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/magicxlll/Z-tienhiep/main/dist/van-kiep-tu-tien-mod.user.js
// @downloadURL  https://raw.githubusercontent.com/magicxlll/Z-tienhiep/main/dist/van-kiep-tu-tien-mod.user.js
// ==/UserScript==
`;

async function build() {
  fs.mkdirSync('dist', { recursive: true });

  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/van-kiep-tu-tien-mod.user.js',
    banner: { js: banner },
    target: ['es2020'],
    format: 'iife',
    minify: false,
    sourcemap: false
  });

  console.log('✅ Build hoàn tất: dist/van-kiep-tu-tien-mod.user.js');
}

build().catch((err) => {
  console.error('❌ Build thất bại:', err);
  process.exit(1);
});
