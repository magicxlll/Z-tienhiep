# KẾ HOẠCH TRIỂN KHAI DỰ ÁN (PROJECT PLAN) - Z-TIENHIEP

---

## 1. MỤC TIÊU VÀ NGUYÊN TẮC THỰC HIỆN

- **Mục tiêu**: Xây dựng phiên bản **Z-tienhiep Mod Suite v3.0** hoàn thiện, modular, tối ưu cho Microsoft Edge Mobile (Violentmonkey) và sao lưu định kỳ lên Git repository `https://github.com/magicxlll/Z-tienhiep.git`.
- **Nguyên tắc**:
  1. Luôn duy trì và cập nhật `Memory.md` sau mỗi phiên làm việc.
  2. Codebase phân tách theo module, không viết mã nhồi nhét vào một file duy nhất trong quá trình phát triển.
  3. Kiểm tra tính tương thích và an toàn của state trước khi xuất bản bản build `.user.js`.
  4. Git commit rõ ràng theo chuẩn Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`).

---

## 2. LỘ TRÌNH TRIỂN KHAI CHI TIẾT (ROADMAP)

### Giai đoạn 1: Nền tảng dự án & Công cụ dịch ngược REA (Hoàn tất nền móng)
- [x] Tạo `Memory.md` lưu trữ ngữ cảnh dài hạn.
- [x] Thiết lập Git remote: `https://github.com/magicxlll/Z-tienhiep.git`.
- [x] Soạn thảo đặc tả `docs/SPEC.md` và kế hoạch `docs/PLAN.md`.
- [x] Nghiên cứu cấu trúc repo `morluto/rea` và tệp tham chiếu `.orca/drops/Vạn Kiếp Tu Tiên v2.3.js`.
- [ ] Thiết lập môi trường dự án TypeScript: `package.json`, `tsconfig.json`, `vite.config.ts` (cấu hình plugin build Userscript).
- [ ] Tạo kịch bản script tự động bóc tách dữ liệu game (Extractor) dựa trên `content-*.js` và `index-*.js`.

### Giai đoạn 2: Xây dựng Core API Wrapper & State Controller
- [ ] Xây dựng `src/core/game-bridge.ts`: Phát hiện `window.game.store` và `unsafeWindow` an toàn, lắng nghe sự kiện game sẵn sàng.
- [ ] Xây dựng `src/core/state-mutator.ts`: Các hàm đọc/ghi đè state không làm crash React tree (`uN`, `uNV`, `uC`, `uTuiDo`).
- [ ] Xây dựng `src/data/item-db.ts`: Trình phân giải vật phẩm động (Dynamic Item Resolver) tự động đồng bộ từ `game.content.item` kết hợp từ điển mô tả tiếng Việt.
- [ ] Xây dựng `src/modules/meridian.ts`: Logic mở huyệt đạo và phòng chống lỗi hàm `Lt(t, n)`.

### Giai đoạn 3: Tái thiết kế Giao diện người dùng Mobile-First (UI/UX)
- [ ] Xây dựng `src/ui/theme.css`: Bộ phong cách Tu Tiên huyền ảo tối ưu hiển thị trên màn hình OLED điện thoại.
- [ ] Xây dựng `FloatingActionButton (FAB)`: Nút tròn nổi kéo thả mượt mà, bấm để bật/tắt menu.
- [ ] Xây dựng `BottomSheetDrawer`: Khung trượt từ dưới lên, chiếm 75% chiều cao màn hình điện thoại, hỗ trợ vuốt xuống để đóng.
- [ ] Xây dựng hệ thống 5 Tab điều khiển:
  - Tab 1: **Nhân Vật**: Đổi tên, Linh thạch, Tu vi, Thọ nguyên, Cảnh giới, Thể chất, Linh căn.
  - Tab 2: **Kho Đồ**: Tìm kiếm vật phẩm theo tên gõ tiếng Việt, thêm số lượng tùy ý, nút kích hoạt God Pack.
  - Tab 3: **Kinh Mạch & Nghề**: Đồ ma trận huyệt đạo trực quan, học tất cả nghề, đan phương.
  - Tab 4: **Tự Động Hóa (Auto)**: Bật/tắt Auto Tu Luyện, Auto Chiến Đấu, Speed Hack.
  - Tab 5: **Sao Lưu (Backup)**: Nút Xuất file Save JSON, Nạp file Save JSON.

### Giai đoạn 4: Phát triển tính năng Tự Động Hóa (Automation & Helpers)
- [ ] **Speed Hack Module**: Hook `window.setTimeout` / `setInterval` / `requestAnimationFrame` có slider điều chỉnh tốc độ từ 1x đến 5x.
- [ ] **Auto Tu Luyện Module**: Tự động kích hoạt hành động tu luyện khi chân nguyên hồi phục.
- [ ] **Auto Khám Phá & Tầm Bảo**: Hỗ trợ đi nhanh trên bản đồ và gom tài nguyên.
- [ ] **Auto Luyện Đan Cực Phẩm**: Can thiệp logic luyện đan để luôn đạt đan dược phẩm chất cao nhất.

### Giai đoạn 5: Đóng gói bản Build & Tự động cập nhật
- [ ] Cấu hình Header Userscript với `@name`, `@version`, `@match`, `@updateURL`, `@downloadURL`.
- [ ] Xuất bản tệp hoàn chỉnh: `dist/van-kiep-tu-tien-mod.user.js`.
- [ ] Kiểm thử cài đặt trực tiếp trên trình duyệt Microsoft Edge Mobile bằng Violentmonkey.
- [ ] Tạo hướng dẫn chi tiết kèm hình ảnh minh họa cho người dùng cách cài đặt trên điện thoại.

---

## 3. QUY TRÌNH SAO LƯU ĐỊNH KỲ LÊN GIT

Mỗi khi kết thúc một mốc công việc hoặc cuối phiên làm việc:
1. Kiểm tra trạng thái: `git status`
2. Cập nhật `Memory.md` ghi nhận các công việc đã hoàn thành.
3. Thêm các tệp thay đổi: `git add .`
4. Tạo commit theo quy ước:
   ```bash
   git commit -m "feat(ui): implement mobile bottom sheet and fab controller"
   ```
5. Đẩy mã nguồn lên kho lưu trữ GitHub:
   ```bash
   git push origin main
   ```
