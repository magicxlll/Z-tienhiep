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
| **2026-10-23 (Phiên 2)** | - Xác thực Git thành công với Personal Access Token của người dùng.<br>- Khởi tạo môi trường TypeScript + esbuild.<br>- Chuyển đổi mã nguồn tham chiếu sang kiến trúc Modular TypeScript (`src/core`, `src/data`, `src/modules`, `src/ui`).<br>- Bổ sung tính năng mới: Mobile-First Floating Action Button (FAB) kéo thả theo mép màn hình, Bottom Sheet Drawer 80vh, Speed Hack (1x-5x), Auto Tu Luyện, Auto Hồi Phục, Xuất/Nhập file Save JSON.<br>- Xây dựng bộ tìm kiếm vật phẩm thông minh hỗ trợ tiếng Việt có dấu/không dấu.<br>- Biên dịch ra sản phẩm hoàn chỉnh: `dist/van-kiep-tu-tien-mod.user.js`.<br>- Soạn thảo `README.md` hướng dẫn cài đặt trên Edge Mobile.<br>- Commit và push thành công toàn bộ lên GitHub `main`. | **Hoàn thành** |
| **2026-10-23 (Phiên 3)** | - **Fix lỗi không lưu dữ liệu (Reset khi thoát)**: Phân tích máy ảo `vgn` trong bundle `index-ORJYTlDX.js`, phát hiện cơ chế mã hóa và seal dữ liệu `FG(t)` + `Em(storage, 'tu-tien:run', run)`. Tích hợp `persistGameSave` và `persistGameMeta` gọi trực tiếp `game.saveNow(run)` và `game.ben(meta)` để ghi đè an toàn vào `localStorage`.<br>- **Fix lỗi Thể chất không đổi được**: Bóc tách bundle `content-BV_BaKWN.js`, xác định chính xác 6 thể chất hợp lệ của game (`the_chat.hoang_co`, `the_chat.cuu_am`, `the_chat.kiem_cot`, `the_chat.bach_thao`, `the_chat.thiet_cot`, `the_chat.pham_the`). Xóa bỏ các ID hư cấu; bổ sung thuật toán `parseKhuonFallback` tái tạo ma trận kinh mạch, gán hệ màu theo linh căn và giữ nguyên kỹ pháp/mảnh ghép đã học.<br>- **Fix lỗi "Thiên đạo rối loạn" khi đổi cảnh giới**: Phát hiện hàm `rn(canhGioi)` trong React chỉ nhận số nguyên `0..5` và tiểu cảnh giới `0..3`. Đã sửa `setRealm` truyền số nguyên chuẩn hóa và bổ sung `setExtraRealm` (Kim đan 1-5, Ý cảnh, Dị tượng, Túc tuệ, Xóa bình cảnh).<br>- **Bổ sung lựa chọn đổi Linh Căn**: Thêm 8 ô tích chọn hệ Linh Căn (Kim, Mộc, Thủy, Hỏa, Thổ, Băng, Phong, Lôi), tự động tính phẩm (Thiên, Song, Tạp, Biến dị) và tô màu toàn bộ mạch.<br>- **Bổ sung bảng tích chọn Thất Đại Chỉ Số Tu Chân**: Thêm giao diện quản lý Ngộ tính, Căn cốt, Đạo tâm, Thân pháp, Khí vận, Tâm ma, Thần thức; hỗ trợ tích chọn linh hoạt từng thuộc tính và nút gán hàng loạt (200, 600, xóa sạch Tâm ma).<br>- **Fix hoàn toàn lỗi tràn layout 2 bên trên Mobile**: Bổ sung `box-sizing: border-box`, chuyển đổi từ layout 2 cột chật hẹp sang các hàng `.vktt-row` chuẩn Flexbox co giãn mượt mà (`min-width: 0`), khớp 100% màn hình điện thoại từ 360px trở lên. | **Hoàn thành xuất sắc & Đã build** |
| **2026-10-23 (Phiên 4)** | - **Bổ sung 16 Preset gán Linh Căn nhanh**: Cung cấp danh sách mẫu linh căn toàn diện: Bát Hoang Tiên Căn (8 hệ), Ngũ Hành (Kim Mộc Thủy Hỏa Thổ), Biến Dị (Thiên Lôi, Thiên Băng, Thiên Phong, Tam Dị), Thiên Linh Căn (Thuần Kim, Thuần Mộc, Thuần Thủy, Thuần Hỏa, Thuần Thổ), Song Linh Tương Sinh (Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim). Tự động cập nhật giao diện, tính toán phẩm chất và lưu tức thì.<br>- **Engine Bố trí Kinh Mạch & Trang Bị Tối Ưu (`optimizer.ts`)**: Giải mã thuật toán `fr(hinh, xoay)`, `al(t,n,e)` và tính điểm cộng hưởng `VX(shard.he, cellColor)`. Xây dựng thuật toán 2D greedy packing tự động xếp kín các mảnh phẩm cao nhất từ túi đồ lên lưới kinh mạch mà không đè lên Đan Điền (`danDien`), tự động đổi màu ô kinh mạch match 100% với hệ của mảnh đặt lên (Resonance = 1.0, 0 điểm nghịch, buff cực đại), đả thông toàn bộ kinh mạch và tự động trang bị 6 món đồ tốt nhất từ túi.<br>- **Tự động gán vật phẩm tối ưu theo hệ tùy chọn**: Cung cấp 7 bộ Build chuyên biệt (Kiếm Tông/Kim Tu, Viêm Đế/Hỏa Tu, Thủy/Băng Tu, Mộc/Trường Sinh Tu, Thổ/Bất Diệt Tu, Lôi/Phong Tu, Toàn Năng Phẩm 8 Thần Thoại). 1-Click tự động đưa mảnh và 6 thần khí vào túi, xếp mảnh tối ưu, chỉnh màu mạch, gán linh căn và trang bị đầy đủ.<br>- **Danh mục 988+ Vật phẩm Game Hỗ trợ**: Tự động scan toàn bộ vật phẩm từ `window.game.env.content.items`, phân loại theo 16 nhóm (Công Pháp, Đan Dược, Pháp Khí, Linh Dược, Yêu Tài, Quặng, Phù, Dị Hỏa, Dụng Cụ, Phương Tiện, Trữ Vật...), lọc theo 8 phẩm cấp, tìm kiếm tiếng Việt không dấu, hiển thị chi tiết và nút thêm nhanh `+1`, `+10`, `+99`.<br>- **Sổ tay chế tác Luyện Đan, Luyện Khí, Chế Phù (`recipes.ts`)**: Tích hợp toàn bộ 216 công thức chuẩn game (Luyện Đan 69, Luyện Khí/Bảo 112, Chế Phù 35), hiển thị chi tiết nguyên liệu chính (`chu`), nguyên liệu phụ (`phu`) kèm kiểm tra tồn kho túi đồ thời gian thực (`[x/need]`). Bổ sung nút 1-Click: `[Nhận Đủ Nguyên Liệu (x10)]` và `[Nhận Thành Phẩm (x5)]`. | **Hoàn thành xuất sắc & Đã build** |
| **2026-10-24 (Phiên 5)** | - **Nâng cấp toàn diện thuật toán Bố trí Kinh Mạch chuẩn hóa cơ chế game**: Bóc tách chi tiết hàm kiểm tra mạch `Hk`, `qg`, `ipn` (`km-dong`), `H4` (`var(--sinh)`, `var(--khac)`). Phát hiện: (1) Chỉ có **Công Pháp** mới là đường dẫn khí từ Đan Điền (`danDien`) và lan truyền mạch sang các mảnh lân cận; Pháp Khí chỉ nhận khí khi chạm trực tiếp Đan Điền hoặc chạm Công Pháp đã thông mạch. (2) Nếu đặt mảnh rời rạc không nối mạch sẽ bị gắn cờ `tat` và hiển thị hatch chéo (đứt mạch). (3) Nếu đặt 2 mảnh tương khắc (`Ei`) cạnh nhau sẽ sinh viền đỏ (`var(--khac)`), phạt chỉ số nặng và tăng `diemNghich`. (4) Nếu đặt 2 mảnh tương sinh (`Ji`) cạnh nhau sẽ kích hoạt **viền xanh lá (`var(--sinh)`)**, buff chỉ số `sinhKhac` vượt bậc.<br>- **Thiết kế lại Thuật toán Graph-Connected Vascular Packing**: (1) Bắt đầu mở mạch từ Đan Điền bằng các Công Pháp phẩm cao nhất, tạo mạng lưới huyết mạch liên tục. (2) Đảm bảo 100% mảnh đặt lên đều kết nối thông mạch (`thong: true`, có đường dẫn khí màu trắng `km-dong`, tuyệt đối không bị hatch chéo). (3) Kiểm tra nghiêm ngặt `isKhac` trên mọi ô tiếp giáp: loại trừ hoàn toàn các vị trí gây tương khắc (0 viền đỏ). (4) Thưởng điểm tương sinh `isSinh` (+150): ưu tiên tối đa các vị trí sinh ra viền xanh lá (từ 8 đến 12 viền xanh). Cân bằng danh mục 14 vật phẩm (7 Công Pháp + 7 Pháp Khí) cho mỗi Build hệ.<br>- **Đã kiểm nghiệm trên toàn bộ 6 Thể chất**: Đạt kết quả hoàn mỹ 10/10 thông mạch, 0 viền đỏ, nhiều viền xanh trên Phàm Thể, Hoang Cổ, Thiết Cốt, Kiếm Cốt, Bách Thảo, Cửu Âm. | **Hoàn thành xuất sắc & Đã build** |

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
