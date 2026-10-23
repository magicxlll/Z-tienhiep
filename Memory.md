# MEMORY - BỘ NHỚ DÀI HẠN DỰ ÁN Z-TIENHIEP

> **Lưu ý cho AI Agent ở tất cả các phiên làm việc**:
> Tệp này là *nguồn chân lý dài hạn* (Long-Term Memory) của dự án **Z-tienhiep**. Trước khi thực hiện bất kỳ tác vụ nào, hãy đọc kỹ tệp này để nắm toàn bộ ngữ cảnh, tiến độ, kiến trúc và quyết định kỹ thuật đã thống nhất. Sau khi hoàn thành một phiên làm việc hoặc một mốc quan trọng, **bắt buộc phải cập nhật lại tệp này** và commit/push lên Git.

---

## 1. THÔNG TIN CHUNG DỰ ÁN

- **Tên dự án**: Z-tienhiep (Bộ công cụ & MOD trợ thủ / tự động hóa Web Game "Vạn Kiếp Tu Tiên")
- **Kho lưu trữ (Git)**: [https://github.com/magicxlll/Z-tienhiep.git](https://github.com/magicxlll/Z-tienhiep.git)
- **Mục tiêu chính**:
  1. Xây dựng bộ công cụ MOD / Assistant mở rộng từ phiên bản tiền nhiệm `Vạn Kiếp Tu Tiên v2.3.js`.
  2. Tối ưu hóa trải nghiệm trên trình duyệt di động (đặc biệt là **Microsoft Edge Mobile** sử dụng extension **Violentmonkey**) và máy tính.
  3. Bổ sung các tính năng tự động hóa (Auto tu luyện, Auto tầm bảo/khám phá, Auto chiến đấu/dùng đồ, Speed hack, Quản lý túi đồ/đan dược thông minh, Sao lưu/Khôi phục Save data).
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
  - `rea observe-web-execution`: Kết nối qua Chrome DevTools Protocol (CDP) để theo dõi các hàm được gọi khi thực hiện thao tác trong game, trích xuất chính xác cấu trúc action và hàm tính toán tỷ lệ đan dược, chiến đấu, kinh mạch.

### 2.3. Mã nguồn tham chiếu hiện tại (`.orca/drops/Vạn Kiếp Tu Tiên v2.3.js`)
- Dạng tệp: Tampermonkey / Violentmonkey Userscript đơn lẻ (1187 dòng mã gộp chung).
- Cơ chế hoạt động:
  - Can thiệp qua `unsafeWindow` / `window.game.store`.
  - Chứa sẵn một từ điển dữ liệu tĩnh gồm 422 vật phẩm, 6 thể chất, đan phương, kinh mạch...
  - Tạo giao diện nổi `#tu-tien-floating-panel` với CSS Accordion để chỉnh sửa thông số nhân vật (Linh thạch, Tu vi, Thể chất, Cảnh giới, Túi đồ, Kinh mạch).
- Nhược điểm cần cải tiến:
  - Mã nguồn nguyên khối khó bảo trì, dữ liệu tĩnh dễ bị lỗi thời khi game cập nhật.
  - Chưa tối ưu cho màn hình cảm ứng di động (giao diện kéo thả/accordion kiểu desktop).
  - Thiếu các tính năng tự động hóa (Auto-farming / Auto-battle / Loop actions) và Speed hack.

---

## 3. KIẾN TRÚC ĐỀ XUẤT CHO DỰ ÁN

### 3.1. Mô hình phát triển: Modular TypeScript & Build Pipeline
Thay vì viết trực tiếp một file JS khổng lồ, dự án sẽ được tổ chức thành cấu trúc module hóa:
```
Z-tienhiep/
├── docs/                     # Tài liệu thiết kế (Specs, ADRs, Guides)
├── src/
│   ├── core/                 # Quản lý vòng đời script, hook window.game.store, event bus
│   ├── game-api/             # Wrapper giao tiếp sạch với Game (State Reader/Writer, Action invokers)
│   ├── data/                 # Dynamic data loader (tự sync từ game.content + presets)
│   ├── modules/              # Các phân hệ chức năng:
│   │   ├── stats/            # Chỉnh sửa chỉ số, cảnh giới, linh thạch, tuổi thọ
│   │   ├── inventory/        # Thêm/bớt vật phẩm, trang bị, God Pack, tối ưu túi đồ
│   │   ├── cultivation/      # Tự động hóa tu luyện, hấp thu linh khí, đột phá
│   │   ├── alchemy/          # Tự động/tối ưu luyện đan, chế phù, luyện khí
│   │   ├── battle/           # Trợ lý chiến đấu, tự động dùng kỹ pháp/bảo vật
│   │   ├── meridian/         # Mở huyệt đạo an toàn theo thể chất
│   │   └── backup/           # Xuất/Nhập save JSON, đồng bộ đám mây cá nhân
│   ├── ui/                   # Giao diện người dùng Mobile-First:
│   │   ├── components/       # Drawer, BottomSheet, Toggle, Searchable Dropdown
│   │   ├── theme/            # Phong cách Tu Tiên hiện đại (Dark gold / Cyber-immortal)
│   │   └── view/             # Các tab điều khiển
│   └── index.ts              # Entry point của Userscript
├── scripts/                  # Script trích xuất dữ liệu từ game qua REA / AST parser
├── Memory.md                 # Bộ nhớ dài hạn của dự án (luôn duy trì)
├── package.json
└── vite.config.ts / build.ts # Build ra 1 file dist/van-kiep-tu-tien-mod.user.js
```

### 3.2. Vì sao Userscript (Violentmonkey trên Edge Mobile) là tối ưu nhất?
- **Khả năng tương thích**: Violentmonkey chạy mượt mà trên Edge Mobile (Android) và Kiwi Browser mà không yêu cầu đóng gói ký số phức tạp như WebExtension APK.
- **Can thiệp trực tiếp**: Userscript chạy cùng context với DOM, dễ dàng truy cập `unsafeWindow.game.store` với độ trễ 0ms.
- **Hỗ trợ cập nhật tự động**: Có thể cấu hình `@updateURL` và `@downloadURL` trỏ về GitHub Releases để người dùng trên điện thoại tự nhận bản cập nhật mới mỗi khi git push!

---

## 4. NHẬT KÝ TIẾN ĐỘ & TRẠNG THÁI (SESSION LOGS)

| Phiên (Date) | Nội dung thực hiện | Trạng thái |
| :--- | :--- | :--- |
| **2026-10-23** | - Khởi tạo Git repo và remote `origin` tới GitHub: `https://github.com/magicxlll/Z-tienhiep.git`<br>- Tạo `Memory.md` làm nền tảng ngữ cảnh dài hạn.<br>- Tải và giải mã cấu trúc `morluto/rea`, xác định các module phân tích web (`export-web-scripts`, `analyze-web-bundle`).<br>- Tải và phân tích cấu trúc Web Game (`index.js` 1.4MB, `content.js` 2.4MB, React 18 + Zustand Store).<br>- Phân tích mã tham chiếu `Vạn Kiếp Tu Tiên v2.3.js` (hook `window.game.store`, dropdown, 422 item presets).<br>- Lập đề xuất kiến trúc & giải pháp tối ưu cho dự án. | Hoàn thành nghiên cứu & thiết lập nền móng |

---

## 5. HƯỚNG DẪN DÀNH CHO CÁC PHIÊN LÀM VIỆC TIẾP THEO

1. **Trước khi bắt đầu phiên mới**:
   - Chạy `git status` và `git pull origin main` (nếu cần).
   - Đọc kỹ `Memory.md` để nắm các tính năng đang dang dở.
2. **Trong quá trình làm việc**:
   - Mọi module mới phải được phân tách rõ ràng trong thư mục `src/`.
   - Giữ mã tương thích với ES6/Modern JS và kiểm tra kỹ việc can thiệp vào `window.game.store` để tránh gây crash hàm render của game.
3. **Kết thúc mỗi phiên**:
   - Cập nhật bảng nhật ký tại Mục 4 của `Memory.md`.
   - Thực hiện commit và push lên remote `https://github.com/magicxlll/Z-tienhiep.git`.
