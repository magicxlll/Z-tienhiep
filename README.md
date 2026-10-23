# ☯ Z-TIENHIEP: VẠN KIẾP TU TIÊN - MOD ASSISTANT SUITE v3.0

> **Bảng MOD, Trợ thủ & Tự Động Hóa Thế Giới Tu Tiên**
> Tối ưu hóa đặc biệt cho **Microsoft Edge Mobile** (Android/iOS) thông qua **Violentmonkey**, đồng thời tương thích 100% với trình duyệt máy tính (Chrome, Edge, Brave, Firefox) qua Tampermonkey / Violentmonkey.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & SỬ DỤNG TRÊN ĐIỆN THOẠI (EDGE MOBILE)

### Cách 1: Cài đặt trực tiếp qua Violentmonkey (Tự động cập nhật - KHUYÊN DÙNG)
1. Mở trình duyệt **Microsoft Edge** trên điện thoại.
2. Vào phần Cài đặt -> **Tiện ích mở rộng (Extensions)** -> Cài đặt tiện ích **Violentmonkey**.
3. Bấm trực tiếp vào đường link cài đặt script bên dưới:
   👉 **[Cài đặt Vạn Kiếp Tu Tiên MOD v3.0 (Raw Link)](https://raw.githubusercontent.com/magicxlll/Z-tienhiep/main/dist/van-kiep-tu-tien-mod.user.js)**
4. Violentmonkey sẽ tự động mở màn hình xác nhận -> Bấm **Cài đặt (Install)**.
5. Truy cập trang web game: [https://van-kiep-tu-tien.vuhaiquan2k1.workers.dev/](https://van-kiep-tu-tien.vuhaiquan2k1.workers.dev/)
6. Bạn sẽ thấy biểu tượng tròn **☯** phát sáng màu vàng kim ở góc phải màn hình. Chạm vào biểu tượng để mở bảng điều khiển!

---

### Cách 2: Cài đặt thủ công (Dán mã trực tiếp)
1. Mở file [dist/van-kiep-tu-tien-mod.user.js](dist/van-kiep-tu-tien-mod.user.js) trên GitHub và copy toàn bộ nội dung mã.
2. Mở Violentmonkey trên Edge -> Chọn **Thêm script mới (+)**.
3. Dán toàn bộ mã vừa copy và bấm **Lưu (Save)**.

---

## 🌟 TÍNH NĂNG NỔI BẬT TRÊN BẢN v3.0

### 1. Giao diện Mobile-First hoàn toàn mới
- **Floating Action Button (FAB)**: Biểu tượng Bát Quái `☯` nhỏ gọn, có thể chạm kéo thả di chuyển dọc mép màn hình để không che khuất game.
- **Bottom Sheet Drawer**: Bảng điều khiển vuốt trượt từ đáy màn hình lên, chiếm 80% chiều cao màn hình, thiết kế tối ưu cho thao tác bằng một tay.
- **5 Tab chuyên biệt**:
  - 👑 **Nhân Vật**: Đổi Đạo hiệu, Linh thạch, Tu vi, Thọ nguyên, Tuổi thọ, Cống hiến, Đột phá Cảnh giới (Luyện Khí -> Độ Kiếp), Thể chất tối thượng (Hỗn Độn Đạo Thể), Mở khóa Lão đò & Thành tựu.
  - 🎒 **Kho Đồ**: 
    - ⚡ **Gói Thần Đạo v3.0**: Trang bị ngay full bộ bảo vật Phẩm 8-9 + 99 Thần Dược.
    - Tìm kiếm vật phẩm thông minh (gõ tiếng Việt có dấu hoặc không dấu), lọc theo phẩm cấp 1-9.
    - Thêm số lượng vật phẩm tùy ý, trang bị 6 ô bảo vật chuyên dụng.
  - 📜 **Kinh Mạch & Nghề**:
    - **Đã thông toàn bộ huyệt đạo kinh mạch 100% an toàn** theo thể chất (chống crash hàm `Lt` của game).
    - Học toàn bộ Nghề nghiệp Cấp 5 (Tông Sư).
    - Lĩnh ngộ 101 Đan phương & Đồ phổ, 87 Công pháp & Kỹ năng cực phẩm.
  - ⚡ **Tự Động Hóa (Automation & Hacks)**:
    - **Speed Hack (Tua tốc độ game)**: Lựa chọn tốc độ 1x, 2x, 3x, 5x để di chuyển và qua lượt siêu nhanh.
    - **Auto Tu Luyện**: Tự động tăng tu vi liên tục theo thời gian thực.
    - **Auto Hồi Phục**: Tự động hồi phục Khí Huyết và Chân Nguyên khi tụt dưới 60%.
  - 💾 **Sao Lưu & Hệ Thống**:
    - Xuất toàn bộ tiến trình tu tiên thành file `.json` tải về điện thoại.
    - Nạp lại file `.json` hoặc dán mã save để khôi phục mọi lúc mọi nơi.
    - Nút Tẩy Tủy khẩn cấp để khắc phục lỗi màn hình game.

---

## 🛠️ DÀNH CHO NHÀ PHÁT TRIỂN (DEVELOPMENT)

Dự án được viết bằng **TypeScript** chuẩn, chia module sạch và đóng gói siêu tốc bằng **esbuild**:

```bash
# Cài đặt thư viện phát triển
npm install

# Biên dịch ra file Userscript hoàn chỉnh
npm run build

# Chế độ theo dõi thay đổi và tự build lại
npm run watch
```

---

## 📄 BỘ TÀI LIỆU DỰ ÁN
- [Memory.md](Memory.md): Bộ nhớ dài hạn và nhật ký tiến độ dự án.
- [docs/SPEC.md](docs/SPEC.md): Đặc tả kỹ thuật & phân tích mã nguồn.
- [docs/PLAN.md](docs/PLAN.md): Lộ trình phát triển & hướng dẫn sao lưu.
