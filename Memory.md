# MEMORY - BỘ NHỚ DÀI HẠN DỰ ÁN Z-TIENHIEP

> **Lưu ý cho AI Agent ở tất cả các phiên làm việc**:
> Tệp này là *nguồn chân lý dài hạn* (Long-Term Memory) của dự án **Z-tienhiep**. Trước khi thực hiện bất kỳ tác vụ nào, hãy đọc kỹ tệp này để nắm toàn bộ ngữ cảnh, tiến độ, kiến trúc và quyết định kỹ thuật đã thống nhất. Sau khi hoàn thành một phiên làm việc hoặc một mốc quan trọng, **bắt buộc phải cập nhật lại tệp này** và commit/push lên Git.

---

## 1. THÔNG TIN CHUNG DỰ ÁN

- **Tên dự án**: Z-tienhiep (Bộ công cụ & MOD trợ thủ / tự động hóa Web Game "Vạn Kiếp Tu Tiên")
- **Kho lưu trữ (Git)**: [https://github.com/magicxlll/Z-tienhiep.git](https://github.com/magicxlll/Z-tienhiep.git)
- **Tệp cài đặt Userscript chính thức**: `https://raw.githubusercontent.com/magicxlll/Z-tienhiep/main/dist/van-kiep-tu-tien-mod.user.js`
- **Mục tiêu chính**:
  1. Xây dựng bộ công cụ MOD / Assistant mở rộng từ phiên bản tiền nhiệm `Vạn Kiếp Tu Tiên v2.3.js`.
  2. Tối ưu hóa trải nghiệm trên trình duyệt di động (đặc biệt là **Microsoft Edge Mobile** sử dụng extension **Violentmonkey**) và máy tính.
  3. Bổ sung các tính năng tự động hóa (Speed hack 1x-5x, Auto tu luyện, Auto hồi phục, Quản lý túi đồ/đan dược thông minh, Xuất/Nhập Save data JSON).
  4. Sử dụng công cụ dịch ngược (Reverse Engineering) **REA** (`morluto/rea`) để liên tục bóc tách dữ liệu và cập nhật API theo các phiên bản mới của game.

---

## 2. ĐỐI TƯỢNG PHÂN TÍCH & KIẾN TRÚC MỤC TIÊU

### 2.1. Web Game: Vạn Kiếp Tu Tiên
- **URL**: `https://van-kiep-tu-tien.vuhaiquan2k1.workers.dev/`
- **Nền tảng & Công nghệ**:
  - Frontend: **React 18** + **Vite** đóng gói ES Modules (`/assets/index-*.js`, `/assets/react-*.js`, `/assets/content-*.js`).
  - Đồ họa / Bản đồ: Canvas 2D + DOM tương tác (`#map`, `#hud`).
  - Quản lý trạng thái (State Management): **Zustand store** được gán trực tiếp vào biến toàn cục:
    ```javascript
    window.game.store.getState() // Lấy toàn bộ state ({ run, content, profile, ... })
    window.game.store.setState(...) // Cập nhật state phản ứng tức thì (reactive re-render)
    ```
  - Biến toàn cục được game export sẵn: `window.game` (logic cốt lõi), `window.map` (bản đồ thế giới), `window.__tuTienReady`.
  - Cơ chế lưu trữ (Save): Toàn bộ logic chạy hoàn toàn phía Client (Offline-first SPA trên Cloudflare Workers). Dữ liệu nhân vật lưu tại `localStorage` với các key `tu-tien:run` và `tu-tien:meta`.
  - **Không có Anti-Cheat / Server-side verification**: Mọi thay đổi vào `window.game.store` đều có hiệu lực ngay lập tức và được tự động đồng bộ vào save.

### 2.2. Công cụ REA (Reverse Engineer Anything)
- **Repo**: `https://github.com/morluto/rea.git`
- **Bản chất**: Bộ công cụ MCP & CLI phục vụ phân tích dịch ngược toàn diện (Native, .NET, Electron, Web JS).
- **Ứng dụng vào dự án**:
  - `rea export-web-scripts`: Bóc tách và xuất toàn bộ mã nguồn JS / Sourcemap từ trang game.
  - `rea analyze-web-bundle`: Phân tích tĩnh bundle game để dò tìm các route, endpoint, cấu trúc store và model dữ liệu.
  - `rea observe-web-execution`: Kết nối qua Chrome DevTools Protocol (CDP) để theo dõi các hàm được gọi khi thực hiện thao tác trong game.

### 2.3. Cấu trúc Source Code Modular (TypeScript)
```
Z-tienhiep/
├── docs/                     # Tài liệu thiết kế (SPEC.md, PLAN.md)
├── src/
│   ├── core/
│   │   ├── bridge.ts         # Quản lý window.game.store, unsafeWindow, event loop
│   │   └── mutator.ts        # Helper an toàn ghi đè nhanVat, túi đồ, kinh mạch, cảnh giới
│   ├── data/
│   │   ├── presets.ts        # 422 vật phẩm, 6 thể chất, 101 đan phương, 87 công pháp
│   │   └── items.ts          # Bộ tìm kiếm vật phẩm tiếng Việt thông minh + dynamic scanner
│   ├── modules/
│   │   ├── automation.ts     # Speed hack (1x-5x), Auto Tu Luyện, Auto Hồi Phục
│   │   └── backup.ts         # Xuất/Nhập file Save JSON trực tiếp trên điện thoại
│   ├── ui/
│   │   ├── styles.ts         # Bộ style Mobile-First (Dark Gold, FAB, Bottom Sheet Drawer)
│   │   └── app.ts            # Quản lý sự kiện, touch drag FAB và 5 tab chức năng
│   └── index.ts              # Entry point của Userscript
├── dist/
│   └── van-kiep-tu-tien-mod.user.js  # Bản build hoàn chỉnh để cài vào Violentmonkey
├── build.mjs                 # Script đóng gói siêu tốc bằng esbuild
├── package.json
├── README.md                 # Hướng dẫn chi tiết cho người dùng cuối
└── Memory.md                 # Bộ nhớ dài hạn dự án
```

---

## 3. NHẬT KÝ TIẾN ĐỘ & TRẠNG THÁI (SESSION LOGS)

| Phiên (Date) | Nội dung thực hiện | Trạng thái |
| :--- | :--- | :--- |
| **2026-10-23 (Phiên 1)** | - Khởi tạo Git repo và remote `origin` tới GitHub: `https://github.com/magicxlll/Z-tienhiep.git`<br>- Tạo `Memory.md`, `docs/SPEC.md`, `docs/PLAN.md`.<br>- Tải và giải mã cấu trúc `morluto/rea`, xác định các module phân tích web (`export-web-scripts`, `analyze-web-bundle`).<br>- Tải và phân tích cấu trúc Web Game (`index.js` 1.4MB, `content.js` 2.4MB, React 18 + Zustand Store).<br>- Phân tích mã tham chiếu `Vạn Kiếp Tu Tiên v2.3.js`. | Hoàn thành |
| **2026-10-23 (Phiên 2)** | - Xác thực Git thành công với Personal Access Token của người dùng.<br>- Khởi tạo môi trường TypeScript + esbuild.<br>- Chuyển đổi mã nguồn tham chiếu sang kiến trúc Modular TypeScript (`src/core`, `src/data`, `src/modules`, `src/ui`).<br>- Bổ sung tính năng mới: Mobile-First Floating Action Button (FAB) kéo thả theo mép màn hình, Bottom Sheet Drawer 80vh, Speed Hack (1x-5x), Auto Tu Luyện, Auto Hồi Phục, Xuất/Nhập file Save JSON.<br>- Xây dựng bộ tìm kiếm vật phẩm thông minh hỗ trợ tiếng Việt có dấu/không dấu.<br>- Biên dịch ra sản phẩm hoàn chỉnh: `dist/van-kiep-tu-tien-mod.user.js`.<br>- Soạn thảo `README.md` hướng dẫn cài đặt trên Edge Mobile.<br>- Commit và push thành công toàn bộ lên GitHub `main`. | **Hoàn thành xuất sắc & Sẵn sàng test** |

---

## 4. HƯỚNG DẪN DÀNH CHO CÁC PHIÊN LÀM VIỆC TIẾP THEO

1. **Trước khi bắt đầu phiên mới**:
   - Chạy `git pull origin main`.
   - Đọc kỹ `Memory.md` để nắm các tính năng hiện có.
2. **Khi phát triển tính năng mới**:
   - Viết code trong `src/modules/` tương ứng.
   - Chạy `npm run build` để cập nhật `dist/van-kiep-tu-tien-mod.user.js`.
3. **Kết thúc phiên**:
   - Cập nhật Mục 3 của `Memory.md`.
   - Chạy `git add . && git commit -m "feat/fix: ..." && git push origin main`.
