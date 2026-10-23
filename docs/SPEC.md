# TÀI LIỆU ĐẶC TẢ DỰ ÁN (SPECIFICATION) - Z-TIENHIEP

---

## 1. TỔNG QUAN DỰ ÁN

- **Tên dự án**: **Z-tienhiep**
- **Mục tiêu**: Xây dựng bộ công cụ MOD, Hỗ trợ và Tự động hóa (Assistant & Automation Suite) hoàn chỉnh cho Web Game **"Vạn Kiếp Tu Tiên"** ([https://van-kiep-tu-tien.vuhaiquan2k1.workers.dev/](https://van-kiep-tu-tien.vuhaiquan2k1.workers.dev/)).
- **Nền tảng mục tiêu hàng đầu**: **Microsoft Edge Mobile** trên điện thoại thông minh (sử dụng tiện ích mở rộng **Violentmonkey**), đồng thời hỗ trợ đầy đủ mọi trình duyệt Desktop (Edge, Chrome, Brave, Firefox) có cài Tampermonkey hoặc Violentmonkey.
- **Mã nguồn tiền nhiệm**: File tham chiếu `.orca/drops/Vạn Kiếp Tu Tiên v2.3.js` (Bản MOD trực tiếp bằng Userscript).
- **Công cụ dịch ngược đồng hành**: **REA** ([https://github.com/morluto/rea.git](https://github.com/morluto/rea.git)).

---

## 2. PHÂN TÍCH CHUYÊN SÂU CÁC THÀNH PHẦN

### 2.1. Phân tích công cụ dịch ngược REA (`morluto/rea`)
**REA (Reverse Engineer Anything)** là một nền tảng MCP và CLI chuyên dụng cho việc bóc tách, dịch ngược và phân tích hành vi thời gian thực của các ứng dụng, nhị phân, và ứng dụng Web.

1. **Khả năng đối với Web Application & JavaScript**:
   - `rea analyze-web-bundle`: Phân tích tĩnh gói JavaScript mà không cần thực thi, bóc tách các AST nodes, chunk edges, vendor fingerprint, endpoint và state model.
   - `rea observe-web-execution`: Kết nối thông qua Chrome DevTools Protocol (CDP port 9222) vào trình duyệt thật, đo lường độ phủ thực thi (V8 code coverage), ánh xạ chính xác hàm nào trong bundle xử lý hành động người dùng (click nút tu luyện, đột phá, luyện đan).
   - `rea inspect-web-page`: Xuất toàn bộ DOM tree, trạng thái Storage (localStorage, IndexedDB), cây Accessibility và metadata tài nguyên.
   - `rea export-web-scripts`: Trích xuất toàn bộ file mã nguồn JS/TS (kèm sourcemap nếu có) về thư mục cục bộ để decompile/beautify.
2. **Quy trình áp dụng REA vào dự án Z-tienhiep**:
   - Bước 1: Dùng REA hoặc script trích xuất tải toàn bộ các tệp tài nguyên của game:
     - `index-*.js`: Chứa toàn bộ máy ảo game, logic loop, logic chiến đấu, Zustand store và React HUD.
     - `content-*.js`: Chứa toàn bộ database của game (hơn 400 vật phẩm, toàn bộ đan phương, công pháp, kỳ ngộ, thể chất, bản đồ).
   - Bước 2: Tự động chạy AST parser (hoặc REA script) để tạo ra tệp TypeScript Type Definitions và Database tự cập nhật, không cần phải nhập tay 422 vật phẩm như bản cũ.

---

### 2.2. Phân tích kiến trúc Web Game "Vạn Kiếp Tu Tiên"
- **Host**: Cloudflare Workers (`van-kiep-tu-tien.vuhaiquan2k1.workers.dev`).
- **Mô hình hoạt động**: **100% Client-Side Simulation** (Không có server game thời gian thực, không gửi action lên API để kiểm tra hay trừ tài nguyên).
- **Công nghệ Frontend**:
  - Giao diện: React 18 (`react-81gy0lK_.js`), render vào DOM element `#hud`.
  - Bản đồ thế giới: Canvas 2D + DOM tương tác `#map`.
  - Quản lý trạng thái: **Zustand store** tại `window.game.store`.
  - Dữ liệu tĩnh: `window.game.content` chứa:
    - `item`: Danh sách toàn bộ vật phẩm (tên, phẩm cấp, loại, mô tả, hiệu quả).
    - `theChat`: Dữ liệu thể chất và khuôn huyệt đạo (`khuon`: ma trận chuỗi điểm huyệt và đan điền).
    - `danPhuong`: Công thức luyện chế đan dược.
    - `congPhap`: Các bộ bí kíp tu tiên, tâm pháp.
    - `kyNang`: Kỹ pháp môn phái và tán tu.
    - `monPhai`: Danh sách các tông môn, chức vị, nhiệm vụ.
  - Dữ liệu động của lượt chơi hiện tại: `window.game.store.getState().run`:
    - `nhanVat`: Chứa toàn bộ thông tin nhân vật (tuổi, thọ nguyên, tu vi, linh thạch, điểm cống hiến, công tích, túi đồ `tuiDo`, trang bị `trangBi`, kinh mạch `kinhMach`, thể chất `theChat`, linh căn `linhCan`, cảnh giới `canhGioi`, chỉ số `chiSo`).
    - `tongMon`: Dữ liệu môn phái mà nhân vật đang gia nhập.
    - `theGioi`: Trạng thái thế giới, các NPC, các địa điểm đã khám phá.
- **Cơ chế lưu & tính toàn vẹn (Integrity)**:
  - Game tự động đồng bộ `store.getState().run` vào `localStorage.setItem('tu-tien:run', ...)`.
  - Không có chữ ký số (HMAC / Cryptographic hash) bảo vệ save. Vì vậy, bất kỳ can thiệp nào vào `window.game.store.setState(...)` đều hợp lệ và được lưu vĩnh viễn!

---

### 2.3. Mổ xẻ chi tiết mã tham chiếu `Vạn Kiếp Tu Tiên v2.3.js`
1. **Điểm mạnh của v2.3**:
   - Tác động trực tiếp vào `window.game.store.setState(...)`, đảm bảo game cập nhật giao diện ngay lập tức mà không cần reload trang.
   - Có cơ chế chống crash hàm `Lt(t, n)` khi kích hoạt kinh mạch: kiểm tra khuôn thể chất trước khi ghi mảng `huyetThem`.
   - Cung cấp đầy đủ các nút chỉnh sửa nhanh cho tài nguyên cơ bản và bộ preset "Gói Thần Đạo" (God Pack).
2. **Điểm yếu & Hạn chế lớn**:
   - **Mã nguồn khổng lồ trong 1 file (Monolithic)**: Gộp CSS chuỗi thô, data dictionary tĩnh 400+ items, DOM binding và logic game vào một file dài 1187 dòng, cực kỳ khó đọc và không thể test.
   - **Từ điển tĩnh bị lỗi thời**: Nếu tác giả game cập nhật thêm vật phẩm mới (phẩm 9, sự kiện mới), script v2.3 sẽ không nhận diện được và phải thêm tay.
   - **Giao diện không thân thiện với điện thoại di động (Edge Mobile)**:
     - Panel dạng cố định kích thước 355px, nằm lệch góc màn hình, các nút bấm quá nhỏ khiến thao tác trên màn hình cảm ứng rất khó khăn, dễ bấm nhầm.
     - Chiếm hết không gian hiển thị của game trên màn hình điện thoại có chiều rộng hẹp (360px - 412px).
   - **Thiếu tính năng tự động hóa (Automation)**: Toàn bộ là nút can thiệp thủ công (bấm để cộng đồ, cộng tiền). Người chơi vẫn phải tự click tay hàng nghìn lần để khám phá map, tu luyện, đánh quái, luyện đan.

---

## 3. SO SÁNH & ĐỀ XUẤT GIẢI PHÁP TỐI ƯU NHẤT

| Tiêu chí so sánh | Giải pháp 1: Userscript (Violentmonkey / Tampermonkey) | Giải pháp 2: Browser Extension riêng biệt (CRX) | Giải pháp 3: Web Proxy / Clone Game riêng | Giải pháp 4: Headless Bot (Node.js/Puppeteer) |
| :--- | :--- | :--- | :--- | :--- |
| **Cài trên Edge Mobile** | **Rất dễ dàng** (Edge Mobile hỗ trợ Violentmonkey trực tiếp qua Addons) | Rất khó (Edge Mobile giới hạn cài file crx ngoài, chỉ hỗ trợ danh sách duyệt) | Không cần cài, chỉ vào web | Không dùng được trên điện thoại trực tiếp |
| **Quyền can thiệp game** | **Hoàn toàn trực tiếp** (`unsafeWindow.game`) | Phải qua content script bridge (`postMessage`) | Trực tiếp sửa mã HTML/JS | Giả lập browser từ xa |
| **Độ trễ & Hiệu năng** | **Tức thì (0ms)** | Thêm độ trễ serialize JSON | Tức thì | Trễ do network |
| **Cập nhật tính năng** | **Tự động** qua `@updateURL` từ GitHub | Phải build và nạp lại crx | Phải deploy lại web host | Phải update mã server |
| **Độ phức tạp bảo trì** | **Thấp - Trung bình** | Trung bình - Cao | Cao (cần duy trì server/hosting) | Cao |

> [!IMPORTANT]
> **KẾT LUẬN & ĐỀ XUẤT CHIẾN LƯỢC TỐI ƯU:**
> **Giải pháp tối ưu nhất là: Xây dựng bộ công cụ theo mô hình "Modern TypeScript Modular Userscript"**.
> 
> - **Cách thức**: Dự án được viết bằng **TypeScript** chuẩn, chia thành các module độc lập (`core`, `game-api`, `data`, `modules`, `ui`). Dùng **Vite** hoặc **Rollup** để biên dịch ra một tệp duy nhất `dist/van-kiep-tu-tien-mod.user.js`.
> - **Phân phối**: Tệp `.user.js` được host trực tiếp trên GitHub Releases / raw branch của repo `https://github.com/magicxlll/Z-tienhiep.git`. Khi người dùng cài đặt qua Violentmonkey trên Edge Mobile, script sẽ có khả năng **TỰ ĐỘNG CẬP NHẬT (Auto-Update)** mỗi khi có phiên bản mới mà không cần copy/paste thủ công!
> - **Giao diện di động (Mobile-First UI)**: Thiết kế nút tròn nổi (Floating Action Button - FAB) có thể thu gọn thành một icon nhỏ ở góc màn hình; khi bấm vào sẽ mở rộng thành một **Bottom Sheet / Drawer** trượt từ dưới lên, bố trí nút bấm to, rõ, dễ vuốt chạm trên điện thoại.

---

## 4. DANH SÁCH TÍNH NĂNG ĐẶC TẢ CHI TIẾT (FEATURE SET)

### Phân hệ 1: Game API Wrapper & Dynamic Content
1. **Dynamic Item Dictionary**: Tự động đọc danh mục vật phẩm từ `window.game.content.item` tại thời điểm chạy. Không cần hardcode tĩnh. Bất kỳ vật phẩm mới nào tác giả thêm vào game đều tự động hiển thị trong thanh tìm kiếm.
2. **Safe State Mutator**: Cung cấp các helper chuẩn hóa để ghi đè `nhanVat`, `tuiDo`, `kinhMach` mà không làm vỡ các tham chiếu nội tại của React.

### Phân hệ 2: Quản lý Nhân Vật & Tài Nguyên (Core Cheats)
1. Chỉnh sửa tùy ý: Đạo hiệu, Linh thạch, Tu vi, Cống hiến tông môn, Công tích, Thọ nguyên, Tuổi thọ.
2. Thiết lập Cảnh giới: Luyện Khí -> Trúc Cơ -> Kim Đan -> Nguyên Anh -> Hóa Thần -> Luyện Hư -> Hợp Thể -> Đại Thừa -> Độ Kiếp.
3. Thiết lập Kim đan phẩm cấp (Cửu Chuyển Kim Đan), Ý cảnh viên mãn, Dị tượng thiên địa.
4. Thể chất & Linh căn: Lựa chọn thể chất tối thượng (Hỗn Độn Đạo Thể, Tiên Thiên Thánh Thể...) và tự động mở toàn bộ huyệt đạo tương ứng an toàn 100%.

### Phân hệ 3: Kho Đồ & Trang Bị (Inventory & Equipment)
1. Thêm bất kỳ vật phẩm nào với số lượng tùy chọn (có ô tìm kiếm gõ tiếng Việt có dấu/không dấu, lọc theo phẩm cấp 1-9, loại vật phẩm).
2. Nút "Gói Thần Đạo (God Pack) v3.0": Trang bị ngay bộ bảo vật phẩm 8-9 (Càn Khôn Giới, Cửu U Hoàng Hỏa, Phù Diêu Sí, Đan Lô Tiên, Phù Bút Tiên, Khí Lô Tiên), 99 viên thần đan và dược liệu cực phẩm.
3. Tự động dọn dẹp / Sắp xếp túi đồ: Tự động gom nhóm, gộp slot và mở rộng ô túi đồ tối đa.

### Phân hệ 4: Tự Động Hóa & Trợ Thủ (Automation & Assistant - TÍNH NĂNG MỚI)
1. **Auto Tu Luyện / Hấp Thu**: Tự động click tu luyện khi đầy chân nguyên hoặc theo chu kỳ tick thời gian.
2. **Speed Hack (Tăng tốc thời gian)**: Can thiệp vào `window.setInterval` / `requestAnimationFrame` của game để tăng tốc độ di chuyển, luyện tập từ 2x đến 10x.
3. **Auto Khám Phá Bản Đồ (Auto Explorer)**: Tự động đi tới các ô chưa mở trên bản đồ `window.map`, tự động thu thập thảo dược và khoáng thạch.
4. **Auto Chiến Đấu Thông Minh (Auto Combat)**: Tự động dùng kỹ pháp có sát thương cao nhất, tự động cắn thuốc khi máu/chân nguyên xuống dưới 30%, tự động chạy trốn khi gặp Boss quá mạnh.
5. **Auto Luyện Đan / Chế Phù 100%**: Đảm bảo tỷ lệ thành công luôn đạt Cực Phẩm, tự động nạp nguyên liệu cần thiết từ hư không nếu thiếu.

### Phân hệ 5: Sao Lưu & Khôi Phục Dữ Liệu (Backup & Save Management)
1. **Export Save to JSON**: Xuất toàn bộ tiến trình tu tiên ra file JSON lưu về máy điện thoại.
2. **Import Save from JSON**: Khôi phục tiến trình từ file JSON bất kỳ lúc nào.
3. **Multi-Slot Local Save**: Lưu trữ nhiều bản save khác nhau trong cùng trình duyệt để người chơi thử nghiệm các nhánh tu tiên khác nhau mà không sợ mất acc.

---

## 5. TIÊU CHUẨN THIẾT KẾ GIAO DIỆN DI ĐỘNG (MOBILE UI DESIGN)

1. **Floating Trigger**: Nút tròn nhỏ kích thước 44x44px có thể kéo thả di chuyển dọc mép màn hình.
2. **Bottom Sheet Drawer**: Vuốt trượt từ dưới lên, chiều rộng 100% chiều ngang màn hình, chiều cao tùy chỉnh 60-80% màn hình điện thoại.
3. **Tab Navigation mượt mà**:
   - Tab 1: 👑 Nhân Vật & Cảnh Giới
   - Tab 2: 🎒 Túi Đồ & Trang Bị
   - Tab 3: ⚡ Tự Động Hóa (Auto)
   - Tab 4: 📜 Đan Phương & Kinh Mạch
   - Tab 5: 💾 Sao Lưu & Hệ Thống
4. **Phong cách thị giác (Theme)**: Dark Gold Tu Tiên — Nền tối huyền bí (`#0f111a`), viền vàng kim (`#e5b869`), font chữ tối ưu hiển thị tiếng Việt rõ ràng trên mobile.
