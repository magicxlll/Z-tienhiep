// ==UserScript==
// @name         Vạn Kiếp Tu Tiên - MOD Panel v2.3
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Bảng MOD Trực Tiếp 
// @author       VKTT
// @match        https://van-kiep-tu-tien.vuhaiquan2k1.workers.dev/*
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    /* 0. BẢO VỆ KHI NGƯỜI DÙNG BẤM ĐÚP FILE .JS TRỰC TIẾP TRÊN WINDOWS (WINDOWS SCRIPT HOST) */
    if (typeof WScript !== 'undefined') {
        var copiedOk = false;
        try {
            var sh = WScript.CreateObject('WScript.Shell');
            var p = WScript.ScriptFullName;
            sh.Run('powershell -NoProfile -WindowStyle Hidden -Command "Get-Content -LiteralPath \'' + p.replace(/'/g, "''") + '\' -Encoding UTF8 | Set-Clipboard"', 0, true);
            copiedOk = true;
        } catch (e) {}

        var msg = (copiedOk ? "✅ ĐÃ TỰ ĐỘNG COPY TOÀN BỘ MÃ MOD VÀO BỘ NHỚ TẠM (CLIPBOARD)!\n\n" : "") +
            "⚠️ Lưu ý: File .js này là Script chạy trong Trình Duyệt Web (không phải phần mềm .exe mở trực tiếp trên Windows).\n\n" +
            "👉 CÁCH 1 (Nhanh nhất - Chạy ngay trong 5 giây):\n" +
            "1. Mở trang Web Game Vạn Kiếp Tu Tiên trên trình duyệt (Edge / Chrome).\n" +
            "2. Bấm phím F12 (hoặc chuột phải chọn Kiểm tra / Inspect) -> chuyển sang tab 'Console'.\n" +
            "3. Bấm Ctrl + V để dán mã (đã được tự động Copy sẵn) rồi nhấn Enter là Bảng MOD hiện ra ngay!\n\n" +
            "👉 CÁCH 2 (Dùng Tampermonkey - Tự động chạy mỗi khi vào game):\n" +
            "1. Bấm vào biểu tượng tiện ích Tampermonkey trên trình duyệt -> chọn 'Tạo script mới' (Create a new script).\n" +
            "2. Xóa mã mặc định, bấm Ctrl + V để dán mã này vào -> bấm Ctrl + S để Lưu!";
        WScript.Echo(msg);
        WScript.Quit(0); return;
    }
    /* 1. KẾT NỐI TRỰC TIẾP VỚI WINDOW CỦA GAME (GIỮ NGUYÊN CƠ CHẾ GỐC V3.8/V4.9) */
    var gWin = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    /* Hàm tiện ích gộp Object & Mảng (Tương thích 100% mọi trình duyệt & công cụ) */
    function copyObj(src) {
        var out = {};
        if (src && typeof src === 'object') {
            for (var k in src) {
                if (Object.prototype.hasOwnProperty.call(src, k)) {
                    out[k] = src[k];
                }
            }
        }
        return out;
    }

    function mergeObj(a, b) {
        var out = copyObj(a);
        if (b && typeof b === 'object') {
            for (var k in b) {
                if (Object.prototype.hasOwnProperty.call(b, k)) {
                    out[k] = b[k];
                }
            }
        }
        return out;
    }

    function uniqueStrings(arr1, arr2) {
        var seen = {};
        var out = [];
        var list = (arr1 || []).concat(arr2 || []);
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item !== undefined && item !== null && item !== '' && !seen[item]) {
                seen[item] = true;
                out.push(item);
            }
        }
        return out;
    }

    var QUALITY_COLORS = {
        1: '#a1a1aa',
        2: '#4d8b31',
        3: '#3b71ca',
        4: '#38bdf8',
        5: '#f59e0b',
        6: '#d946ef',
        7: '#f43f5e',
        8: 'rainbow',
        9: '#a855f7'
    };
    /* 2. KHO 422 VẬT PHẨM, 6 THỂ CHẤT, 87 KỸ PHÁP, 101 ĐAN PHƯƠNG, 17 LÃO ĐÒ & 28 THÀNH TỰU */
    var PRESET_ITEMS = {"item.huyen_hoang_tao_hoa_kinh": {"name": "Huyền Hoàng Tạo Hóa Kinh", "quality": 8, "cat": "Công Pháp", "desc": "Phẩm 8 · Vô thượng đại đạo chân kinh chưởng khống huyền hoàng tạo hóa"}, "item.luan_hoi_chan_kinh": {"name": "Luân Hồi Chân Kinh", "quality": 8, "cat": "Công Pháp", "desc": "Phẩm 8 · Tuyệt thế chân kinh chưởng khống sinh tử luân hồi"}, "item.yeu_hoang_huyet_kinh": {"name": "Yêu Hoàng Huyết Kinh", "quality": 8, "cat": "Công Pháp", "desc": "Phẩm 8 · Cổ kinh huyết mạch Yêu Hoàng thượng cổ bá tuyệt thiên hạ"}, "item.cuu_u_hoang_hoa": {"name": "Cửu U Hoàng Hỏa", "quality": 8, "cat": "Dị Hỏa", "desc": "Phẩm 8 · Đế hỏa Cửu U thiêu rụi vạn cổ thần ma"}, "item.bat_chiet_kiem": {"name": "Bất Chiết Kiếm", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Thần kiếm vạn kiếp bất chiết, kiếm ý thông thiên"}, "item.doan_thien_chien_ky": {"name": "Đoạn Thiên Chiến Kỳ", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Chiến kỳ thượng cổ phất lên chém đứt thiên lộ"}, "item.hon_thien_lang": {"name": "Hỗn Thiên Lăng", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Tiên thiên chí bảo dải lụa đỏ trói buộc càn khôn vũ trụ"}, "item.nghich_lan_thuan": {"name": "Nghịch Lân Thuẫn", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Hộ thuẫn đúc từ vảy ngược Chân Long bất hoại"}, "item.phong_thien_an": {"name": "Phong Thiên Ấn", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Cổ ấn chí tôn phong tỏa thiên địa càn khôn"}, "item.tam_sinh_thach": {"name": "Tam Sinh Thạch", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Cổ vật kỷ vật tam sinh luân hồi, gắn kinh mạch đại phúc duyên"}, "item.thai_co_long_lan": {"name": "Thái Cổ Long Lân", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Vảy rồng Thái Cổ chí bảo hộ thân vạn pháp bất xâm"}, "item.thai_hu_chu": {"name": "Thái Hư Châu", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Thần châu ẩn chứa hỗn độn thái hư vô cực"}, "item.toai_thien_kiem": {"name": "Toái Thiên Kiếm", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Thần kiếm chém vỡ hư không cửu thiên"}, "item.van_kiep_hon_dang": {"name": "Vạn Kiếp Hồn Đăng", "quality": 8, "cat": "Pháp Khí", "desc": "Phẩm 8 · Đèn thần bất diệt qua vạn kiếp luân hồi"}, "item.can_khon_gioi": {"name": "Càn Khôn Giới", "quality": 8, "cat": "Trữ Vật", "desc": "Phẩm 8 · Nhẫn trữ vật tối thượng chứa cả càn khôn vũ trụ"}, "item.nghich_menh_dan": {"name": "Nghịch Mệnh Đan", "quality": 8, "cat": "Đan Dược", "desc": "Phẩm 8 · Thần đan cải thiên nghịch mệnh, xoay chuyển càn khôn"}, "item.thien_dien_dan": {"name": "Thiên Diễn Đan", "quality": 8, "cat": "Đan Dược", "desc": "Phẩm 8 · Thần đan suy diễn thiên cơ, đại tăng toàn diện căn cơ"}, "item.canh_kim_chan_kinh": {"name": "Canh Kim Chân Kinh", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Công pháp Kim hệ chí tôn, sát phạt sắc bén vô thượng"}, "item.cuu_duong_chan_kinh": {"name": "Cửu Dương Chân Kinh", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Chí dương vô thượng tâm pháp, vạn tà bất xâm"}, "item.cuu_thien_cuong_phong": {"name": "Cửu Thiên Cương Phong", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Gió lốc cửu thiên xé tan mọi phòng ngự"}, "item.huyen_hoang_chuong": {"name": "Huyền Hoàng Chưởng", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Tuyệt thế chưởng pháp mang sức nặng của mẫu khí huyền hoàng"}, "item.huyen_minh_chan_kinh": {"name": "Huyền Minh Chân Kinh", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Cực hàn huyền minh chân quyết đóng băng vạn vật"}, "item.ngu_to_hop_dao_quyet": {"name": "Ngũ Tổ Hợp Đạo Quyết", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Tuyệt học hợp đạo ngũ hành quy nhất"}, "item.phan_thien_chan_hoa": {"name": "Phần Thiên Chân Hỏa", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Hỏa đạo chí tôn thiêu đốt bát hoang"}, "item.thai_thanh_tien_kinh": {"name": "Thái Thanh Tiên Kinh", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Tiên kinh thượng cổ đạo gia huyền diệu vô song"}, "item.thai_thuong_huyen_thuy_kinh": {"name": "Thái Thượng Huyền Thủy Kinh", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Thủy hệ chí cao tâm pháp, nhu hòa vạn quân"}, "item.thanh_de_truong_xuan_kinh": {"name": "Thanh Đế Trường Xuân Kinh", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Tiên kinh Mộc đạo của Thanh Đế thượng cổ, sinh cơ vô tận"}, "item.thien_loi_chinh_phap": {"name": "Thiên Lôi Chính Pháp", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Lôi pháp thiên đình trấn diệt tà ma"}, "item.truong_sinh_chan_kinh": {"name": "Trường Sinh Chân Kinh", "quality": 7, "cat": "Công Pháp", "desc": "Phẩm 7 · Mộc đạo chân kinh trường sinh bất lão, sinh cơ bất tận"}, "item.cuu_thien_huyen_bang_hoa": {"name": "Cửu Thiên Huyền Băng Hỏa", "quality": 7, "cat": "Dị Hỏa", "desc": "Phẩm 7 · Dị hỏa chí hàn thiêu đốt cả nguyên thần"}, "item.ngu_sac_than_thach": {"name": "Ngũ Sắc Thần Thạch", "quality": 7, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 7 · Đá thần năm màu Nữ Oa vá trời"}, "item.tuc_nhuong": {"name": "Tức Nhưỡng", "quality": 7, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 7 · Thần thổ tự sinh trưởng vô tận"}, "item.cuu_thien_bat_tu_thao": {"name": "Cửu Thiên Bất Tử Thảo", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Tiên thảo cải tử hoàn sinh nơi cửu thiên"}, "item.hoang_trung_ly": {"name": "Hoàng Trung Lý", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Tiên quả thượng cổ chín một lần mỗi vạn năm"}, "item.kien_moc_chi": {"name": "Kiến Mộc Chi", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Cành cây thần thụ Kiến Mộc chống trời"}, "item.kien_moc_qua": {"name": "Kiến Mộc Quả", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Trái của thần thụ Kiến Mộc thông thiên"}, "item.ngo_dao_tra": {"name": "Ngộ Đạo Trà", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Lá trà tiên thiên giúp đốn ngộ đại đạo, tăng mạnh ngộ tính"}, "item.than_huyet_dang": {"name": "Thần Huyết Đằng", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Dây leo ẩn chứa thần huyết thượng cổ"}, "item.thien_nhat_chan_thuy": {"name": "Thiên Nhất Chân Thủy", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Giọt chân thủy khởi nguyên của trời đất"}, "item.tuyet_long_sam": {"name": "Tuyết Long Sâm", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Bảo sâm hóa hình rồng tuyết vạn năm"}, "item.van_nien_ban_dao": {"name": "Vạn Niên Bàn Đào", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Tiên quả Bàn Đào vạn năm tăng đại thọ nguyên"}, "item.van_tai_tuyet_lien": {"name": "Vạn Tải Tuyết Liên", "quality": 7, "cat": "Linh Dược", "desc": "Phẩm 7 · Sen tuyết vạn năm nở trên đỉnh băng sơn"}, "item.dan_lo_tien": {"name": "Đan Lô Tiên", "quality": 7, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 7 · Tiên thiên đan lô luyện chế thần đan cực phẩm"}, "item.khi_lo_tien": {"name": "Khí Lô Tiên", "quality": 7, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 7 · Tiên thiên khí lô rèn đúc thần khí chí bảo"}, "item.phu_but_tien": {"name": "Phù Bút Tiên", "quality": 7, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 7 · Bút tiên vẽ phù thông thiên đạt địa"}, "item.ba_tieu_phien": {"name": "Ba Tiêu Phiên", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Quạt thần Ba Tiêu quạt tắt thiên hỏa, nổi bão cửu thiên"}, "item.dinh_hai_chau": {"name": "Định Hải Châu", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Thần châu tiên thiên định trụ tứ hải bát hoang"}, "item.hau_tho_than_bi": {"name": "Hậu Thổ Thần Bi", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Bia thần Hậu Thổ trấn áp sơn hà đại địa"}, "item.hon_nguyen_chau": {"name": "Hỗn Nguyên Châu", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Bảo châu hỗn nguyên dung nạp vạn pháp"}, "item.kinh_hong_tien_kiem": {"name": "Kinh Hồng Tiên Kiếm", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Tiên kiếm lướt nhanh như bóng kinh hồng, trảm tuyệt hư không"}, "item.linh_lung_tran_nhac_thap": {"name": "Linh Lung Trấn Nhạc Tháp", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Bảo tháp Linh Lung trấn áp vạn dặm sơn hà"}, "item.luu_ly_tien_dang": {"name": "Lưu Ly Tiên Đăng", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Ngọn đèn lưu ly soi sáng tiên lộ"}, "item.ly_hoa_tien_kiem": {"name": "Ly Hỏa Tiên Kiếm", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Tiên kiếm rực cháy thần hỏa Nam Minh"}, "item.ngoc_tinh_binh": {"name": "Ngọc Tịnh Bình", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Bình ngọc chứa thiên địa cam lộ"}, "item.oanh_thien_loi_chuy": {"name": "Oanh Thiên Lôi Chùy", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Lôi chùy oanh kích chấn vỡ thiên khung"}, "item.thong_ty_kim_con": {"name": "Thông Tý Kim Côn", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Thần côn kim tinh vung lên chấn nát thương khung"}, "item.thua_anh_kiem": {"name": "Thừa Ảnh Kiếm", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Thượng cổ danh kiếm vô ảnh vô hình"}, "item.tru_tien_kiem": {"name": "Tru Tiên Kiếm", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Tuyệt thế hung kiếm tru sát tiên thần"}, "item.tu_thu_tien_y": {"name": "Tử Thụ Tiên Y", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Tiên y hộ thể bất hoại dệt từ hào quang tím"}, "item.tu_tieu_than_kiem": {"name": "Tử Tiêu Thần Kiếm", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Thần kiếm sấm sét Tử Tiêu Cung"}, "item.uan_anh_lien": {"name": "Uẩn Anh Liên", "quality": 7, "cat": "Pháp Khí", "desc": "Phẩm 7 · Bảo liên uẩn dưỡng Nguyên Anh bất diệt"}, "item.phu_dieu_si": {"name": "Phù Diêu Sí", "quality": 7, "cat": "Phương Tiện", "desc": "Phẩm 7 · Cánh thần cưỡi gió chín vạn dặm"}, "item.tieu_can_khon_dai": {"name": "Tiểu Càn Khôn Đại", "quality": 7, "cat": "Trữ Vật", "desc": "Phẩm 7 · Túi Càn Khôn thu nhỏ chứa muôn vàn bảo vật"}, "item.cuu_chuyen_kim_dan": {"name": "Cửu Chuyển Kim Đan", "quality": 7, "cat": "Đan Dược", "desc": "Phẩm 7 · Tiên đan cửu chuyển đoạt thiên địa tạo hóa"}, "item.duong_than_dan": {"name": "Dưỡng Thần Đan", "quality": 7, "cat": "Đan Dược", "desc": "Phẩm 7 · Bảo đan đại bổ nguyên thần & thần thức"}, "item.pha_hu_dan": {"name": "Phá Hư Đan", "quality": 7, "cat": "Đan Dược", "desc": "Phẩm 7 · Tuyệt phẩm đan dược xung kích cảnh giới cao"}, "item.tao_hoa_dan": {"name": "Tạo Hóa Đan", "quality": 7, "cat": "Đan Dược", "desc": "Phẩm 7 · Tiên đan đoạt thiên địa tạo hóa, tái tạo căn cơ"}, "item.thai_hu_dan": {"name": "Thái Hư Đan", "quality": 7, "cat": "Đan Dược", "desc": "Phẩm 7 · Bảo đan đột phá bình cảnh Hóa Thần"}, "item.van_tho_dan": {"name": "Vạn Thọ Đan", "quality": 7, "cat": "Đan Dược", "desc": "Phẩm 7 · Tiên đan gia tăng thọ nguyên dồi dào"}, "item.dp_duong_than_dan": {"name": "Đan Phương: Dưỡng Thần Đan", "quality": 7, "cat": "Đan Phương", "desc": "Phẩm 7 · Phương thuốc luyện chế Dưỡng Thần Đan"}, "item.dp_tao_hoa_dan": {"name": "Đan Phương: Tạo Hóa Đan", "quality": 7, "cat": "Đan Phương", "desc": "Phẩm 7 · Phương thuốc luyện chế Tạo Hóa Đan"}, "item.dp_van_tho_dan": {"name": "Đan Phương: Vạn Thọ Đan", "quality": 7, "cat": "Đan Phương", "desc": "Phẩm 7 · Phương thuốc luyện chế Vạn Thọ Đan"}, "item.bich_lac_kinh": {"name": "Bích Lạc Kinh", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Bí điển thượng giới dẫn linh khí chín tầng trời"}, "item.chuong_tam_loi": {"name": "Chưởng Tâm Lôi", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Thần thông lôi pháp phát ra từ lòng bàn tay"}, "item.cuu_tieu_ngu_loi_quyet": {"name": "Cửu Tiêu Ngự Lôi Quyết", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Bí quyết dẫn lôi cửu tiêu oanh kích thiên địa"}, "item.dai_thanh_kim_cot": {"name": "Đại Thành Kim Cốt", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Pháp môn tôi luyện kim cốt đại thành bất hoại"}, "item.hoa_tho_dong_nguyen_kinh": {"name": "Hỏa Thổ Đồng Nguyên Kinh", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Công pháp song tu Hỏa - Thổ tương sinh"}, "item.hon_nguyen_luyen_the_kinh": {"name": "Hỗn Nguyên Luyện Thể Kinh", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Bí pháp luyện thể hỗn nguyên kim cang bất hoại"}, "item.kim_than_phap_tuong": {"name": "Kim Thân Pháp Tướng", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Hiển hóa kim thân pháp tướng uy nghiêm bất hoại"}, "item.liet_duong_kiem_dien": {"name": "Liệt Dương Kiếm Điển", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Kiếm điển chí dương rực cháy như mặt trời"}, "item.loi_am_phan_tam_kinh": {"name": "Lôi Âm Phần Tâm Kinh", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Công pháp dung hợp thiên lôi và tâm hỏa"}, "item.loi_hoa_pha_ta_chuong": {"name": "Lôi Hỏa Phá Tà Chưởng", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Chưởng pháp sấm lửa khắc chế tà ma ngoại đạo"}, "item.quy_hai_kinh": {"name": "Quy Hải Kinh", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Hải triều vạn lưu quy tông, chân nguyên mênh mông"}, "item.thanh_nang_duoc_kinh": {"name": "Thanh Nang Dược Kinh", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Dược kinh thượng cổ tinh thông y đạo và luyện đan"}, "item.tran_nhac_dinh_hon_kinh": {"name": "Trấn Nhạc Định Hồn Kinh", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Tâm pháp trấn giữ thần hồn vững như thái sơn"}, "item.van_thu_trieu_phong": {"name": "Vạn Thú Triều Phong", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Bí pháp ngự thú vạn linh bái phục"}, "item.vinh_trieu_chuong": {"name": "Vĩnh Triều Chưởng", "quality": 6, "cat": "Công Pháp", "desc": "Phẩm 6 · Chưởng pháp sóng thần dâng trào bất tuyệt"}, "item.niet_ban_hoa": {"name": "Niết Bàn Hỏa", "quality": 6, "cat": "Dị Hỏa", "desc": "Phẩm 6 · Dị hỏa tái sinh từ tro tàn niết bàn"}, "item.niet_ban_phuong_hoa": {"name": "Niết Bàn Phượng Hỏa", "quality": 6, "cat": "Dị Hỏa", "desc": "Phẩm 6 · Ngọn lửa bất tử của Phượng Hoàng niết bàn"}, "item.thai_duong_chan_hoa": {"name": "Thái Dương Chân Hỏa", "quality": 6, "cat": "Dị Hỏa", "desc": "Phẩm 6 · Chân hỏa mặt trời chí dương chí cương"}, "item.bang_vuong_han_tuy": {"name": "Băng Vương Hàn Tủy", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Hàn tủy kết tinh của Băng Vương cực bắc"}, "item.bang_vuong_linh_vu": {"name": "Băng Vương Linh Vũ", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Lông vũ băng tinh của Băng Vương"}, "item.canh_kim_tinh": {"name": "Canh Kim Tinh", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Tinh hoa Canh Kim cực kỳ sắc bén"}, "item.cuu_vi_ho_hon": {"name": "Cửu Vĩ Hồ Hồn", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Tinh hồn của Cửu Vĩ Thiên Hồ"}, "item.huyen_quan_tuy": {"name": "Huyền Quân Tủy", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Bảo tủy ngưng kết trong lòng đất sâu"}, "item.thien_chu_mau_ty": {"name": "Thiên Chu Mẫu Ty", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Tơ của Thiên Chu Mẫu cứng bền không thể chém đứt"}, "item.thien_lang_hon_tinh": {"name": "Thiên Lang Hồn Tinh", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Hồn tinh kết tụ của Thiên Lang Tinh Thú"}, "item.thien_lang_nguyet_phach": {"name": "Thiên Lang Nguyệt Phách", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Nguyệt phách tinh hoa của Thiên Lang"}, "item.thien_ngoai_van_thiet": {"name": "Thiên Ngoại Vân Thiết", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Thần thiết rơi xuống từ ngoài chín tầng trời"}, "item.tien_hac_tho_cot": {"name": "Tiên Hạc Thọ Cốt", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Xương linh hạc ngàn năm mang khí tức trường thọ"}, "item.yeu_dan_5": {"name": "Ngũ Giai Yêu Đan", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Yêu đan đại yêu thú bậc 5 (Hóa Thần)"}, "item.yeu_vuong_noi_dan": {"name": "Yêu Vương Nội Đan", "quality": 6, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 6 · Nội đan kết tinh cả đời của Đại Yêu Vương"}, "item.bang_tam_thanh_lien": {"name": "Băng Tâm Thanh Liên", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Sen xanh băng tâm thanh lọc tâm ma"}, "item.bich_trieu_linh_tao": {"name": "Bích Triều Linh Tảo", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Linh tảo biển sâu chứa thủy linh tinh thuần"}, "item.cuu_diep_kiem_thao": {"name": "Cửu Diệp Kiếm Thảo", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Linh thảo chín lá sắc bén như kiếm ý"}, "item.huyet_bo_de": {"name": "Huyết Bồ Đề", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Trái Bồ Đề thấm máu thánh tăng, đại bổ căn cơ"}, "item.kim_o_qua": {"name": "Kim Ô Quả", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Linh quả ẩn chứa thái dương chân hỏa"}, "item.long_tien_thao": {"name": "Long Tiên Thảo", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Linh thảo thấm nước bọt chân long"}, "item.phu_tang_than_moc": {"name": "Phù Tang Thần Mộc", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Nhánh cây thần Phù Tang nơi mặt trời mọc"}, "item.thai_tue": {"name": "Thái Tuế", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Nhục linh chi vạn năm tăng đại thọ nguyên và khí huyết"}, "item.that_khieu_linh_ngau": {"name": "Thất Khiếu Linh Ngẫu", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Củ sen linh bảy lỗ tái tạo nhục thân"}, "item.thien_loi_moc_tam": {"name": "Thiên Lôi Mộc Tâm", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Lõi gỗ cổ thụ ẩn chứa thiên lôi chi lực"}, "item.thien_nguyen_qua": {"name": "Thiên Nguyên Quả", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Linh quả đại bổ thiên nguyên linh lực"}, "item.uan_anh_thao": {"name": "Uẩn Anh Thảo", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Dược thảo quý luyện đan dưỡng Nguyên Anh"}, "item.van_vu_co_tra": {"name": "Vân Vụ Cổ Trà", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Cổ trà trên đỉnh núi mây mù giúp tĩnh tâm ngộ đạo"}, "item.xich_long_qua": {"name": "Xích Long Quả", "quality": 6, "cat": "Linh Dược", "desc": "Phẩm 6 · Linh quả đỏ rực mang huyết khí hỏa long"}, "item.dan_lo_thien": {"name": "Đan Lô Thiên", "quality": 6, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 6 · Thiên cấp đan lô tăng cao tỷ lệ ra đan thượng phẩm"}, "item.ngu_to_te_dinh": {"name": "Ngũ Tổ Tế Đỉnh", "quality": 6, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 6 · Cổ đỉnh tế lễ của Ngũ Tổ thượng cổ"}, "item.phu_but_thien": {"name": "Phù Bút Thiên", "quality": 6, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 6 · Thiên cấp phù bút họa phù ngưng tụ thiên địa linh uy"}, "item.toan_nghe_lu": {"name": "Toan Nghê Lư", "quality": 6, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 6 · Bảo lư chạm khắc thần thú Toan Nghê"}, "item.uan_dan_lo": {"name": "Uẩn Đan Lô", "quality": 6, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 6 · Lò luyện đan cao cấp giữ trọn dược lực"}, "item.ban_son_an": {"name": "Bàn Sơn Ấn", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Pháp ấn dời núi lấp biển, uy lực ngàn cân"}, "item.bat_bao_kim_chung": {"name": "Bát Bảo Kim Chung", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Chuông vàng tám báu hộ thể toàn diện"}, "item.bo_de_niem_chau": {"name": "Bồ Đề Niệm Châu", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Chuỗi hạt Bồ Đề định tâm trừ ma"}, "item.cuu_long_hoa_trao": {"name": "Cửu Long Hỏa Trảo", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Pháp bảo chín rồng lửa vây khốn kẻ địch"}, "item.den_dong_co": {"name": "Đèn Đồng Cổ", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Cổ đăng bằng đồng xanh ẩn chứa bí lực"}, "item.hat_vuong_doc_thich": {"name": "Hạt Vương Độc Thích", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Gai độc Hạt Vương xuyên giáp kịch độc"}, "item.huyet_ha_phien": {"name": "Huyết Hà Phiên", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Ma phiên triệu hồi dòng sông máu"}, "item.khon_tien_thang": {"name": "Khốn Tiên Thằng", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Dây thần trói buộc cả thần tiên"}, "item.kim_thiem_bao_chau": {"name": "Kim Thiềm Bảo Châu", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Bảo châu Kim Thiềm tụ tài hộ mạch"}, "item.lang_nguyet_cau": {"name": "Lăng Nguyệt Câu", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Song câu ánh trăng lạnh lẽo sắc bén"}, "item.liet_duong_than_kich": {"name": "Liệt Dương Thần Kích", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Chiến kích rực lửa mặt trời"}, "item.lieu_nguyen_phien": {"name": "Liêu Nguyên Phiên", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Quạt thần thổi bùng biển lửa đốt đồng"}, "item.loi_dinh_lenh": {"name": "Lôi Đình Lệnh", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Lệnh bài triệu gọi cửu thiên lôi đình"}, "item.nhiep_hon_linh": {"name": "Nhiếp Hồn Linh", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Pháp linh rung động làm mê loạn nguyên thần"}, "item.phi_liem_phong_y": {"name": "Phi Liêm Phong Y", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Pháp y thần thú Phi Liêm gia tăng tốc độ cực hạn"}, "item.phong_luan_phi_hoan": {"name": "Phong Luân Phi Hoàn", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Vòng xoay gió lốc truy kích liên hoàn"}, "item.quy_loi_co": {"name": "Quỳ Lôi Cổ", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Trống da Quỳ Ngưu vang rền sấm sét"}, "item.thai_am_bang_luan": {"name": "Thái Âm Băng Luân", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Bánh xe băng Thái Âm cắt lìa vạn vật"}, "item.thanh_moc_tu_linh_chau": {"name": "Thanh Mộc Tụ Linh Châu", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Linh châu hệ Mộc tụ thiên địa nguyên khí"}, "item.thanh_tieu_loi_truong": {"name": "Thanh Tiêu Lôi Trượng", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Pháp trượng dẫn lôi đình Thanh Tiêu"}, "item.van_doc_phien": {"name": "Vạn Độc Phiên", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Độc phiên hội tụ vạn chủng kỳ độc"}, "item.van_hon_chu": {"name": "Vạn Hồn Châu", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Ma châu giam cầm hàng vạn oán hồn"}, "item.van_yeu_phien": {"name": "Vạn Yêu Phiên", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Cổ phiên triệu tập vạn yêu trợ chiến"}, "item.xich_huy_tien": {"name": "Xích Huy Tiên", "quality": 6, "cat": "Pháp Khí", "desc": "Phẩm 6 · Roi thần rực ánh xích quang"}, "item.na_di_phu": {"name": "Na Di Phù", "quality": 6, "cat": "Phù Lục", "desc": "Phẩm 6 · Bảo phù dịch chuyển không gian tức thời"}, "item.con_bang_si": {"name": "Côn Bằng Sí", "quality": 6, "cat": "Phương Tiện", "desc": "Phẩm 6 · Đôi cánh Côn Bằng vượt biển mây"}, "item.dong_thien_gioi": {"name": "Động Thiên Giới", "quality": 6, "cat": "Trữ Vật", "desc": "Phẩm 6 · Nhẫn trữ vật ẩn chứa một phương động thiên"}, "item.due_kim_dan": {"name": "Duệ Kim Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Linh đan tăng cường sát lực hệ Kim"}, "item.duong_anh_dan": {"name": "Dưỡng Anh Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Đan dược bồi bổ Nguyên Anh tinh thuần"}, "item.hoa_anh_dan": {"name": "Hóa Anh Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Linh đan trợ lực phá đan thành Anh"}, "item.hoa_long_dan": {"name": "Hóa Long Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Bảo đan thoát thai hoán cốt như cá chép hóa rồng"}, "item.hoan_hon_dan": {"name": "Hoàn Hồn Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Cứu mạng hoàn hồn, chữa lành nội thương nặng"}, "item.hoi_thien_dan": {"name": "Hồi Thiên Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Bảo đan nghịch chuyển thương thế thập tử nhất sinh"}, "item.huyen_anh_dan": {"name": "Huyền Anh Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Bảo đan trợ lực kết thành Nguyên Anh"}, "item.loi_am_dan": {"name": "Lôi Âm Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Đan dược rèn luyện thần hồn bằng lôi âm"}, "item.thong_huyen_dan": {"name": "Thông Huyền Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Linh đan khai thông huyền quan tu vi"}, "item.thong_than_dan": {"name": "Thông Thần Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Đan dược khai mở thần thức và huyền quan"}, "item.van_tam_dan": {"name": "Vấn Tâm Đan", "quality": 6, "cat": "Đan Dược", "desc": "Phẩm 6 · Linh đan gột rửa tâm ma, củng cố đạo tâm"}, "item.dp_con_bang_si": {"name": "Đồ Phổ: Côn Bằng Sí", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Đồ phổ luyện chế Côn Bằng Sí"}, "item.dp_cuu_vi_huyen_dang": {"name": "Đồ Phổ: Cửu Vĩ Huyền Đăng", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Đồ phổ chế tác Cửu Vĩ Huyền Đăng"}, "item.dp_due_kim_dan": {"name": "Đan Phương: Duệ Kim Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Duệ Kim Đan"}, "item.dp_hoa_long_truong": {"name": "Đồ Phổ: Hỏa Long Trượng", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Đồ phổ luyện chế Hỏa Long Trượng"}, "item.dp_hoi_thien_dan": {"name": "Đan Phương: Hồi Thiên Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Hồi Thiên Đan"}, "item.dp_huyet_ha_phien": {"name": "Đồ Phổ: Huyết Hà Phiên", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Đồ phổ luyện chế Huyết Hà Phiên"}, "item.dp_kim_o_dan": {"name": "Đan Phương: Kim Ô Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Kim Ô Đan"}, "item.dp_lang_nguyet_cau": {"name": "Đồ Phổ: Lăng Nguyệt Câu", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Đồ phổ luyện chế Lăng Nguyệt Câu"}, "item.dp_linh_lung_dan": {"name": "Đan Phương: Linh Lung Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Linh Lung Đan"}, "item.dp_linh_lung_thap_nha": {"name": "Đồ Phổ: Linh Lung Tháp Nhã", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Đồ phổ chế tác bảo tháp Linh Lung"}, "item.dp_loi_am_dan": {"name": "Đan Phương: Lôi Âm Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Lôi Âm Đan"}, "item.dp_quy_loi_co": {"name": "Đồ Phổ: Quỳ Lôi Cổ", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Đồ phổ chế tác Quỳ Lôi Cổ"}, "item.dp_thien_bang_cung": {"name": "Đồ Phổ: Thiên Băng Cung", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Đồ phổ luyện chế Thiên Băng Cung"}, "item.dp_thien_loi_dan": {"name": "Đan Phương: Thiên Lôi Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Thiên Lôi Đan"}, "item.dp_thien_nhat_dan": {"name": "Đan Phương: Thiên Nhất Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Thiên Nhất Đan"}, "item.dp_thong_than_dan": {"name": "Đan Phương: Thông Thần Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Thông Thần Đan"}, "item.dp_thuong_long_dan": {"name": "Đan Phương: Thương Long Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Thương Long Đan"}, "item.dp_tran_hon_dan": {"name": "Đan Phương: Trấn Hồn Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Trấn Hồn Đan"}, "item.dp_van_quy_phien": {"name": "Đồ Phổ: Vạn Quỷ Phiên", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Đồ phổ luyện chế Vạn Quỷ Phiên"}, "item.dp_van_tam_dan": {"name": "Đan Phương: Vấn Tâm Đan", "quality": 6, "cat": "Đan Phương", "desc": "Phẩm 6 · Phương thuốc luyện chế Vấn Tâm Đan"}, "item.ban_thach_ho_the": {"name": "Bàn Thạch Hộ Thể", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Công pháp phòng ngự vững chắc như đá tảng"}, "item.canh_kim_quyet": {"name": "Canh Kim Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Pháp quyết ngưng tụ Canh Kim chi khí công phạt"}, "item.chan_loi_quyet": {"name": "Chấn Lôi Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Pháp quyết sấm sét chấn nhiếp quần tà"}, "item.cuu_chuyen_huyen_hoa_cong": {"name": "Cửu Chuyển Huyền Hỏa Công", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Hỏa công cửu chuyển tinh luyện chân nguyên"}, "item.dia_hoa_on_lo_kinh": {"name": "Địa Hỏa Ôn Lô Kinh", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Tâm pháp khống chế địa hỏa ôn dưỡng đan lô"}, "item.dia_mach_tu_linh_kinh": {"name": "Địa Mạch Tụ Linh Kinh", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Hấp thu linh khí từ long mạch đại địa"}, "item.han_bang_chuong": {"name": "Hàn Băng Chưởng", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Chưởng pháp băng hàn đóng băng kinh mạch"}, "item.hau_tho_quyet": {"name": "Hậu Thổ Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Tâm pháp hệ Thổ hậu trọng bền bỉ"}, "item.hoa_huyet_dai_phap": {"name": "Hóa Huyết Đại Pháp", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Ma công thôn phệ tinh huyết hóa thành tu vi"}, "item.hoang_chung_nhiep_phach": {"name": "Hoàng Chung Nhiếp Phách", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Tiếng chuông chấn động thần hồn"}, "item.hoi_phong_chuong": {"name": "Hồi Phong Chưởng", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Chưởng pháp cuồng phong cuốn ngược sát thương"}, "item.huyen_bang_tam_kinh": {"name": "Huyền Băng Tâm Kinh", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Tâm pháp băng hàn hộ tâm định cảnh"}, "item.huyet_ma_nghich_mach": {"name": "Huyết Ma Nghịch Mạch", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Bí thuật kích phát huyết mạch cuồng bạo"}, "item.kho_moc_phung_xuan_quyet": {"name": "Khô Mộc Phùng Xuân Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Bí thuật cây khô gặp mùa xuân, hồi phục kỳ diệu"}, "item.kim_cang_quyet": {"name": "Kim Cang Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Phật môn hộ thể kim cang quyết"}, "item.kim_cot_ngoc_tuy": {"name": "Kim Cốt Ngọc Tủy", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Pháp môn rèn xương vàng tủy ngọc"}, "item.liet_dia_quyen": {"name": "Liệt Địa Quyền", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Quyền pháp chấn nứt mặt đất"}, "item.liet_hoa_doan_cot": {"name": "Liệt Hỏa Đoán Cốt", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Bí pháp dùng liệt hỏa tôi luyện xương cốt"}, "item.luu_van_quyet": {"name": "Lưu Vân Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Thân pháp uyển chuyển biến ảo như mây trôi"}, "item.nhiep_hon_dai_phap": {"name": "Nhiếp Hồn Đại Pháp", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Thần thông nhiếp phách đoạt hồn đối thủ"}, "item.phan_nhac_kiem_quyet": {"name": "Phân Nhạc Kiếm Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Kiếm quyết chẻ núi断sơn uy lực trầm hùng"}, "item.quy_tuc_cong": {"name": "Quy Tức Công", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Bí pháp thu liễm hơi thở giả chết tránh họa"}, "item.sinh_sinh_bat_tuc": {"name": "Sinh Sinh Bất Tức", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Bí pháp tuần hoàn linh lực sinh sôi không ngừng"}, "item.suong_nhan_ngung_than_kinh": {"name": "Sương Nhẫn Ngưng Thần Kinh", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Hàn sương ngưng tụ thần thức sắc bén"}, "item.tai_than_tu_van_kinh": {"name": "Tài Thần Tụ Vân Kinh", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Bí pháp tụ tài nạp phúc, gia tăng khí vận"}, "item.tam_kiem_quyet": {"name": "Tâm Kiếm Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Lấy tâm ngự kiếm, kiếm ý vô hình"}, "item.tam_nguyen_quy_nhat_cong": {"name": "Tam Nguyên Quy Nhất Công", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Hợp tinh - khí - thần quy nhất"}, "item.thu_thuy_kiem_quyet": {"name": "Thu Thủy Kiếm Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Kiếm quyết liên miên trong sáng như làn nước mùa thu"}, "item.thuy_moc_truong_thanh_kinh": {"name": "Thủy Mộc Trường Thanh Kinh", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Công pháp Thủy dưỡng Mộc trường thanh bất suy"}, "item.trong_son_quyet": {"name": "Trọng Sơn Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Pháp quyết tạo trọng áp ngàn cân như núi đè"}, "item.van_duoc_tam_kinh": {"name": "Vạn Dược Tâm Kinh", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Tâm kinh cảm ứng vạn thảo linh dược"}, "item.van_moc_truong_sinh_quyet": {"name": "Vạn Mộc Trường Sinh Quyết", "quality": 5, "cat": "Công Pháp", "desc": "Phẩm 5 · Mộc quyết hấp thu sinh khí rừng già"}, "item.cot_linh_lanh_hoa": {"name": "Cốt Linh Lãnh Hỏa", "quality": 5, "cat": "Dị Hỏa", "desc": "Phẩm 5 · Lửa lạnh thấu xương sinh ra từ cực địa"}, "item.cuu_u_am_hoa": {"name": "Cửu U Âm Hỏa", "quality": 5, "cat": "Dị Hỏa", "desc": "Phẩm 5 · Âm hỏa từ chín tầng địa ngục"}, "item.tam_muoi_chan_hoa": {"name": "Tam Muội Chân Hỏa", "quality": 5, "cat": "Dị Hỏa", "desc": "Phẩm 5 · Chân hỏa đạo gia tinh luyện vạn vật"}, "item.tu_loi_hoa": {"name": "Tử Lôi Hỏa", "quality": 5, "cat": "Dị Hỏa", "desc": "Phẩm 5 · Ngọn lửa mang sức mạnh sấm sét tím"}, "item.bang_vu": {"name": "Băng Vũ", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Lông vũ yêu cầm hệ Băng"}, "item.co_khoi_hach": {"name": "Cổ Khôi Hạch", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Lõi năng lượng của khôi lỗi cổ đại"}, "item.co_khoi_tan_giap": {"name": "Cổ Khôi Tàn Giáp", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Mảnh giáp vỡ của chiến khôi thượng cổ"}, "item.cu_tuong_nha": {"name": "Cự Tượng Nha", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Ngà của Hồng Hoang Cự Tượng"}, "item.cuu_tiet_hat_vi": {"name": "Cửu Tiết Hạt Vĩ", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Đuôi bọ cạp chín đốt kịch độc"}, "item.giao_han_can": {"name": "Giao Hàn Cân", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Gân giao long băng hàn cực kỳ dẻo dai"}, "item.giao_long_giac": {"name": "Giao Long Giác", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Sừng Giao Long chứa thủy lôi lực"}, "item.giao_long_lan": {"name": "Giao Long Lân", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Vảy Giao Long cứng cáp"}, "item.giao_nhan_le": {"name": "Giao Nhân Lệ", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Nước mắt giao nhân hóa thành trân châu"}, "item.hoa_tinh_chau": {"name": "Hỏa Tinh Châu", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Hạt châu ngưng tụ tinh hoa lửa"}, "item.hu_linh_phach": {"name": "Hư Linh Phách", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Linh phách hư ảo của âm hồn cổ đại"}, "item.huyen_chu_ty": {"name": "Huyền Chu Ty", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Tơ nhện huyền âm bền chắc"}, "item.huyen_giap_cao": {"name": "Huyền Giáp Cao", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Cao luyện từ mai rùa huyền giáp"}, "item.huyet_anh_tinh": {"name": "Huyết Anh Tinh", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Tinh thể kết từ oán huyết nguyên anh"}, "item.kim_boi_hung_bi": {"name": "Kim Bối Hùng Bì", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Da gấu lưng vàng phòng ngự cực cao"}, "item.kim_tue_mach": {"name": "Kim Tuệ Mạch", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Mạch quặng vàng linh khí dồi dào"}, "item.lang_vuong_cot": {"name": "Lang Vương Cốt", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Xương cốt của Yêu Lang Vương"}, "item.loi_linh_chau": {"name": "Lôi Linh Châu", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Hạt châu ngưng tụ tinh hoa sấm sét"}, "item.manh_ngoi_trung_chau": {"name": "Mảnh Ngói Trung Châu", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Di vật cổ xưa từ Trung Châu bị chìm"}, "item.suong_phach_tinh": {"name": "Sương Phách Tinh", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Tinh thể băng sương kết tụ ban đêm"}, "item.thi_khoi_hach": {"name": "Thi Khôi Hạch", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Lõi kết tinh trong cơ thể thi khôi"}, "item.thien_lang_nhan": {"name": "Thiên Lang Nhãn", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Con mắt của yêu thú Thiên Lang"}, "item.tu_kim": {"name": "Tử Kim", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Kim loại tím quý hiếm dùng đúc kiếm"}, "item.tuyet_bang_cot": {"name": "Tuyết Băng Cốt", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Xương băng tuyết lạnh thấu tim"}, "item.van_ti_chu_nang": {"name": "Vạn Tơ Chu Nang", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Túi tơ của yêu nhện ngàn năm"}, "item.xuyen_bich_giac": {"name": "Xuyên Bích Giác", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Sừng tê xuyên thủng vách đá"}, "item.yeu_dan_4": {"name": "Tứ Giai Yêu Đan", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Yêu đan yêu thú bậc 4 (Nguyên Anh)"}, "item.yeu_huyet_mac": {"name": "Yêu Huyết Mặc", "quality": 5, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 5 · Mực pha chế từ tinh huyết đại yêu dùng vẽ phù cao cấp"}, "item.bang_tuy_chi": {"name": "Băng Tủy Chi", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Nấm linh chi mọc trên băng tủy"}, "item.cuu_khuc_hoang_tinh": {"name": "Cửu Khúc Hoàng Tinh", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Hoàng tinh chín khúc bồi bổ căn cốt"}, "item.cuu_tiet_truc_tien": {"name": "Cửu Tiết Trúc Tiên", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Trúc tiên chín đốt thanh lọc tâm thần"}, "item.cuu_tue_linh_dao": {"name": "Cửu Tuệ Linh Đạo", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Lúa linh chín bông kết hạt ngọc"}, "item.han_nguyet_que": {"name": "Hàn Nguyệt Quế", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Nhánh quế cung trăng ngưng tụ hàn khí"}, "item.hoa_long_thao": {"name": "Hóa Long Thảo", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Linh thảo mang long khí dùng luyện Hóa Long Đan"}, "item.huyet_linh_chi": {"name": "Huyết Linh Chi", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Nấm linh chi đỏ thẫm đại bổ huyết khí"}, "item.long_tu_thao": {"name": "Long Tu Thảo", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Cỏ râu rồng quý hiếm nơi thâm sơn"}, "item.mach_hoa_thao": {"name": "Mạch Hỏa Thảo", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Linh thảo mọc cạnh mạch địa hỏa"}, "item.mang_hon_chi": {"name": "Mãng Hồn Chi", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Linh chi hấp thu tinh hồn cự mãng"}, "item.ngo_dong_chi": {"name": "Ngô Đồng Chi", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Cành cây Ngô Đồng nơi phượng hoàng đậu"}, "item.thuy_tien_can": {"name": "Thủy Tiên Căn", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Rễ cây thủy tiên ngàn năm chứa thủy linh khí"}, "item.tram_huong": {"name": "Trầm Hương", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Gỗ trầm hương linh mộc định tâm an thần"}, "item.tu_van_linh_chi": {"name": "Tử Vân Linh Chi", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Nấm linh chi mây tím ngàn năm"}, "item.u_minh_lan": {"name": "U Minh Lan", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Hoa lan nở nơi u minh âm khí"}, "item.van_nien_tung_chi": {"name": "Vạn Niên Tùng Chi", "quality": 5, "cat": "Linh Dược", "desc": "Phẩm 5 · Nhựa thông vạn năm kết tinh thành hổ phách"}, "item.dan_lo_huyen": {"name": "Đan Lô Huyền", "quality": 5, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 5 · Huyền cấp đan lô ổn định hỏa hầu"}, "item.dia_sat_dinh": {"name": "Địa Sát Đỉnh", "quality": 5, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 5 · Bảo đỉnh dẫn địa sát chi khí luyện bảo"}, "item.khi_lo_huyen": {"name": "Khí Lô Huyền", "quality": 5, "cat": "Lò Đỉnh & Dụng Cụ", "desc": "Phẩm 5 · Huyền cấp khí lô nung chảy kim thiết bậc cao"}, "item.bac_minh_han_thuong": {"name": "Bắc Minh Hàn Thương", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Trường thương hàn băng Bắc Minh"}, "item.bang_phach_chau": {"name": "Băng Phách Châu", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Bảo châu tỏa hàn khí băng phách"}, "item.bich_ba_linh_tan": {"name": "Bích Ba Linh Tán", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Dù bích ba che chắn vạn pháp"}, "item.bich_lan_doc_cham": {"name": "Bích Lân Độc Châm", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Kim độc Bích Lân vô ảnh vô hình"}, "item.cuu_tieu_bang_kiem": {"name": "Cửu Tiêu Băng Kiếm", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Hàn kiếm lạnh thấu chín tầng mây"}, "item.dia_mach_linh_chau": {"name": "Địa Mạch Linh Châu", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Linh châu kết tụ từ mạch đất"}, "item.giao_chau_lien": {"name": "Giao Châu Liên", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Chuỗi vòng kết từ minh châu dưới biển"}, "item.giao_lan_giap": {"name": "Giao Lân Giáp", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Bảo giáp đúc từ vảy giao long"}, "item.giao_le_chau_lien": {"name": "Giao Lệ Châu Liên", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Dây chuyền ngọc trai nước mắt giao nhân"}, "item.han_suong_toa": {"name": "Hàn Sương Tỏa", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Xiềng xích băng sương phong tỏa thân hình"}, "item.hau_tho_thuan": {"name": "Hậu Thổ Thuẫn", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Khiên đất dày nặng vững chãi"}, "item.ho_cot_dao": {"name": "Hổ Cốt Đao", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Chiến đao rèn từ xương mãnh hổ yêu thú"}, "item.ho_tam_noi_giap": {"name": "Hộ Tâm Nội Giáp", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Nội giáp hộ vệ tâm mạch khỏi đòn chí mạng"}, "item.hoa_van_chuong": {"name": "Hỏa Vân Chương", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Ấn chương tụ mây lửa công kích"}, "item.huyet_anh_dao": {"name": "Huyết Ảnh Đao", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Ma đao chém ra bóng máu vô hình"}, "item.huyet_hon_linh": {"name": "Huyết Hồn Linh", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Chuông máu nhiếp loạn tâm thần"}, "item.kim_giao_tien": {"name": "Kim Giao剪 (Kim Giao Tiễn)", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Kéo vàng hóa đôi giao long cắt đứt pháp bảo"}, "item.kim_mach_dao": {"name": "Kim Mạch Đao", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Bảo đao chém đứt kinh mạch"}, "item.lien_co_no": {"name": "Liên Cơ Nỏ", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Nỏ thần bắn tên liên hoàn"}, "item.liet_ho_dao": {"name": "Liệt Hổ Đao", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Chiến đao mãnh hổ vồ mồi"}, "item.liet_ho_kim_trao": {"name": "Liệt Hổ Kim Trảo", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Trảo vàng xé xác như mãnh hổ"}, "item.ly_hoa_hoan_dao": {"name": "Ly Hỏa Hoàn Đao", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Đao vòng rực lửa Ly Hỏa"}, "item.man_hoang_cot_mau": {"name": "Man Hoang Cốt Mâu", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Chiến mâu bằng xương cự thú Man Hoang"}, "item.ngoc_lo_binh": {"name": "Ngọc Lộ Bình", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Bình ngọc chứa linh lộ hồi phục"}, "item.nhat_luan_hoa": {"name": "Nhật Luân Hoa", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Pháp bảo hình bánh xe mặt trời"}, "item.pha_giap_toan": {"name": "Phá Giáp Toan", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Mũi khoan pháp khí xuyên thủng hộ giáp"}, "item.phan_thuy_thich": {"name": "Phân Thủy Thích", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Đinh ba rẽ nước đánh lén hiểm hóc"}, "item.phi_cuong_trao": {"name": "Phi Cương Trảo", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Móng vuốt Phi Cương sắc bén kịch độc"}, "item.phuoc_tien_tac": {"name": "Phược Tiên Tác", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Dây thừng pháp bảo trói buộc linh lực"}, "item.te_giap_phien": {"name": "Tê Giáp Phiên", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Pháp bảo phòng ngự làm từ giáp tê ngưu"}, "item.thanh_moc_thuan": {"name": "Thanh Mộc Thuẫn", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Lá chắn thanh mộc tự hồi phục bền bỉ"}, "item.thau_cot_cham": {"name": "Thấu Cốt Châm", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Ám khí kim châm xuyên thấu tận xương tủy"}, "item.thiet_huyet_tan": {"name": "Thiết Huyết Tán", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Chiếc ô sắt nhuốm máu công thủ toàn diện"}, "item.thuong_lan_kiem": {"name": "Thương Lan Kiếm", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Bảo kiếm sóng biếc Thương Lan"}, "item.toa_long_thu": {"name": "Tỏa Long Thù", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Cột trụ trấn áp long mạch"}, "item.tu_dien_thoa": {"name": "Tử Điện Thoa", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Trâm cài phát ra tia chớp tím"}, "item.tu_kim_phi_kiem": {"name": "Tử Kim Phi Kiếm", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Phi kiếm đúc từ Tử Kim thượng hạng"}, "item.xich_diem_ho_lo": {"name": "Xích Diễm Hồ Lô", "quality": 5, "cat": "Pháp Khí", "desc": "Phẩm 5 · Hồ lô phun lửa xích diễm thiêu đốt"}, "item.bat_dong_phu": {"name": "Bất Động Phù", "quality": 5, "cat": "Phù Lục", "desc": "Phẩm 5 · Linh phù phòng ngự vững như Bất Động Minh Vương"}, "item.kim_lan_doc_phu": {"name": "Kim Lân Độc Phù", "quality": 5, "cat": "Phù Lục", "desc": "Phẩm 5 · Phù lục phát tán độc khí kim lân"}, "item.kim_thiem_phu": {"name": "Kim Thiềm Phù", "quality": 5, "cat": "Phù Lục", "desc": "Phẩm 5 · Linh phù Kim Thiềm chiêu tài hộ thân"}, "item.pha_quan_phu": {"name": "Phá Quân Phù", "quality": 5, "cat": "Phù Lục", "desc": "Phẩm 5 · Chiến phù phá vỡ trận hình kẻ địch"}, "item.quy_tuc_phu": {"name": "Quy Tức Phù", "quality": 5, "cat": "Phù Lục", "desc": "Phẩm 5 · Bí phù ẩn giấu toàn bộ khí tức tu vi"}, "item.thien_loi_phu": {"name": "Thiên Lôi Phù", "quality": 5, "cat": "Phù Lục", "desc": "Phẩm 5 · Linh phù giáng thiên lôi uy lực lớn"}, "item.tran_quy_phu": {"name": "Trấn Quỷ Phù", "quality": 5, "cat": "Phù Lục", "desc": "Phẩm 5 · Linh phù trấn áp tà ma quỷ vật"}, "item.tu_tieu_loi_phu": {"name": "Tử Tiêu Lôi Phù", "quality": 5, "cat": "Phù Lục", "desc": "Phẩm 5 · Phù lục triệu hồi thần lôi Tử Tiêu"}, "item.kim_bang_si": {"name": "Kim Bằng Sí", "quality": 5, "cat": "Phương Tiện", "desc": "Phẩm 5 · Cánh Kim Sí Đại Bằng tốc độ cực nhanh"}, "item.tu_di_gioi": {"name": "Tu Di Giới", "quality": 5, "cat": "Trữ Vật", "desc": "Phẩm 5 · Nhẫn trữ vật giới tử tu di"}, "item.bach_giai_dan": {"name": "Bách Giải Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Linh đan hóa giải trăm loại kỳ độc"}, "item.boi_nguyen_dan": {"name": "Bồi Nguyên Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đan dược cố bản bồi nguyên, tăng tiến tu vi"}, "item.co_co_dan": {"name": "Cố Cơ Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đan dược củng cố đạo cơ vững chắc"}, "item.dinh_than_dan": {"name": "Định Thần Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đan dược ổn định thức hải, chống tâm ma"}, "item.duyen_tho_dan": {"name": "Duyên Thọ Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Linh đan kéo dài tuổi thọ cho tu sĩ"}, "item.kim_lo_dan": {"name": "Kim Lộ Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đan dược luyện từ kim lộ giúp hồi phục nhanh"}, "item.long_ho_dan": {"name": "Long Hổ Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đại đan tăng cường khí huyết như long tinh hổ mãnh"}, "item.luyen_cot_dan": {"name": "Luyện Cốt Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đan dược cường hóa căn cốt thể phách"}, "item.ngung_nguyen_dan": {"name": "Ngưng Nguyên Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đan dược ngưng tụ chân nguyên Kết Đan"}, "item.pha_chuong_dan": {"name": "Phá Chướng Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đan dược phá vỡ bình cảnh tu luyện"}, "item.thanh_vu_dan": {"name": "Thanh Vũ Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đan dược giúp thân thể nhẹ nhàng, tăng tốc độ"}, "item.tinh_nguyen_dan": {"name": "Tịnh Nguyên Đan", "quality": 5, "cat": "Đan Dược", "desc": "Phẩm 5 · Đan dược thanh lọc tạp chất trong linh lực"}, "item.dp_bat_dong_phu": {"name": "Phù Phương: Bất Động Phù", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Công thức chế tác Bất Động Phù"}, "item.dp_giao_le_chau_lien": {"name": "Đồ Phổ: Giao Lệ Châu Liên", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Đồ phổ chế tác Giao Lệ Châu Liên"}, "item.dp_han_tuy_dan": {"name": "Đan Phương: Hàn Tủy Đan", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Phương thuốc luyện chế Hàn Tủy Đan"}, "item.dp_hat_vi_tien": {"name": "Đồ Phổ: Hạt Vĩ Tiên", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Đồ phổ luyện chế Hạt Vĩ Tiên"}, "item.dp_kim_lan_doc_phu": {"name": "Phù Phương: Kim Lân Độc Phù", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Công thức vẽ Kim Lân Độc Phù"}, "item.dp_kim_thiem_phu": {"name": "Phù Phương: Kim Thiềm Phù", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Công thức vẽ Kim Thiềm Phù"}, "item.dp_luyen_cot_dan": {"name": "Đan Phương: Luyện Cốt Đan", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Phương thuốc luyện chế Luyện Cốt Đan"}, "item.dp_phi_cuong_trao": {"name": "Đồ Phổ: Phi Cương Trảo", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Đồ phổ luyện chế Phi Cương Trảo"}, "item.dp_tran_quy_phu": {"name": "Phù Phương: Trấn Quỷ Phù", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Công thức vẽ Trấn Quỷ Phù"}, "item.dp_truong_xuan_dan": {"name": "Đan Phương: Trường Xuân Đan", "quality": 5, "cat": "Đan Phương", "desc": "Phẩm 5 · Phương thuốc luyện chế Trường Xuân Đan"}, "item.huyet_trao_cong": {"name": "Huyết Trảo Công", "quality": 4, "cat": "Công Pháp", "desc": "Phẩm 4 · Trảo pháp sắc bén nhuốm máu"}, "item.lang_phong_quyet": {"name": "Lăng Phong Quyết", "quality": 4, "cat": "Công Pháp", "desc": "Phẩm 4 · Thân pháp cưỡi gió nhẹ nhàng"}, "item.thanh_loi_quyet": {"name": "Thanh Lôi Quyết", "quality": 4, "cat": "Công Pháp", "desc": "Phẩm 4 · Lôi quyết nhập môn thanh chính"}, "item.thanh_van_kiem_quyet": {"name": "Thanh Vân Kiếm Quyết", "quality": 4, "cat": "Công Pháp", "desc": "Phẩm 4 · Kiếm quyết chính thống Thanh Vân Môn"}, "item.thiet_bo_sam": {"name": "Thiết Bố Sam", "quality": 4, "cat": "Công Pháp", "desc": "Phẩm 4 · Ngoại công luyện da thịt cứng như sắt"}, "item.loi_sa_hoa": {"name": "Lôi Sa Hỏa", "quality": 4, "cat": "Dị Hỏa", "desc": "Phẩm 4 · Linh hỏa cát sấm nơi sa mạc"}, "item.cuong_thi_nha": {"name": "Cương Thi Nha", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Răng nanh cương thi chứa thi độc"}, "item.dong_khoi_hach": {"name": "Đồng Khôi Hạch", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Lõi của khôi lỗi đồng"}, "item.hac_cot": {"name": "Hạc Cốt", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Xương linh hạc nhẹ và cứng"}, "item.hac_vu": {"name": "Hạc Vũ", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Lông vũ linh hạc dùng luyện phi hành pháp khí"}, "item.hat_giap": {"name": "Hạt Giáp", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Vỏ giáp cứng của yêu bọ cạp"}, "item.ho_vi": {"name": "Hồ Vĩ", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Đuôi hồ ly chứa yêu lực"}, "item.hung_dam": {"name": "Hùng Đảm", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Mật gấu yêu thú đại bổ khí lực"}, "item.huy_lan": {"name": "Hủy Lân", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Vảy rắn độc Hủy Xà"}, "item.ngac_giap": {"name": "Ngạc Giáp", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Da giáp cá sấu đầm lầy"}, "item.ngo_cong_doc_nang": {"name": "Ngô Công Độc Nang", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Túi độc của yêu rết ngàn chân"}, "item.sa_trung_tam": {"name": "Sa Trùng Tâm", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Tim sâu cát sa mạc"}, "item.thanh_van_kiem_phoi": {"name": "Thanh Vân Kiếm Phôi", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Phôi kiếm cổ dùng rèn pháp kiếm"}, "item.thiem_to": {"name": "Thiềm Tô", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Nhựa cóc độc quý dùng trong luyện đan"}, "item.yeu_dan_3": {"name": "Tam Giai Yêu Đan", "quality": 4, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 4 · Yêu đan yêu thú bậc 3 (Kết Đan)"}, "item.co_moc_tam": {"name": "Cổ Mộc Tâm", "quality": 4, "cat": "Linh Dược", "desc": "Phẩm 4 · Trái tim cây cổ thụ ngàn năm"}, "item.han_ngoc_sam": {"name": "Hàn Ngọc Sâm", "quality": 4, "cat": "Linh Dược", "desc": "Phẩm 4 · Nhân sâm ngọc lạnh dưỡng âm"}, "item.loi_kiep_truc": {"name": "Lôi Kiếp Trúc", "quality": 4, "cat": "Linh Dược", "desc": "Phẩm 4 · Thân trúc từng hứng chịu thiên lôi"}, "item.thanh_phong_diep": {"name": "Thanh Phong Diệp", "quality": 4, "cat": "Linh Dược", "desc": "Phẩm 4 · Lá cây thanh phong chứa phong linh khí"}, "item.thien_nien_moc_tam": {"name": "Thiên Niên Mộc Tâm", "quality": 4, "cat": "Linh Dược", "desc": "Phẩm 4 · Lõi gỗ ngàn năm tràn đầy mộc khí"}, "item.tram_uyen_tao": {"name": "Trầm Uyên Tảo", "quality": 4, "cat": "Linh Dược", "desc": "Phẩm 4 · Rong linh dưới đáy vực sâu"}, "item.tu_nham_hoa": {"name": "Tử Nham Hoa", "quality": 4, "cat": "Linh Dược", "desc": "Phẩm 4 · Hoa tím mọc trên vách đá hiểm trở"}, "item.xich_tinh_qua": {"name": "Xích Tinh Quả", "quality": 4, "cat": "Linh Dược", "desc": "Phẩm 4 · Quả đỏ lấp lánh như sao lửa"}, "item.am_binh_lenh": {"name": "Âm Binh Lệnh", "quality": 4, "cat": "Pháp Khí", "desc": "Phẩm 4 · Lệnh bài điều khiển âm binh quỷ tốt"}, "item.bach_hac_vu_y": {"name": "Bạch Hạc Vũ Y", "quality": 4, "cat": "Pháp Khí", "desc": "Phẩm 4 · Áo lông hạc trắng nhẹ nhàng linh hoạt"}, "item.bang_phach_lien": {"name": "Băng Phách Liên", "quality": 4, "cat": "Pháp Khí", "desc": "Phẩm 4 · Dây chuyền băng phách thanh tâm"}, "item.huyen_thiet_ho_uyen": {"name": "Huyền Thiết Hộ Uyển", "quality": 4, "cat": "Pháp Khí", "desc": "Phẩm 4 · Vòng tay huyền thiết gia cố lực tay"}, "item.khai_son_dao": {"name": "Khai Sơn Đao", "quality": 4, "cat": "Pháp Khí", "desc": "Phẩm 4 · Đại đao bổ núi mở đường"}, "item.khu_thi_linh": {"name": "Khu Thi Linh", "quality": 4, "cat": "Pháp Khí", "desc": "Phẩm 4 · Chuông đồng điều khiển cương thi"}, "item.huyen_bang_phu": {"name": "Huyền Băng Phù", "quality": 4, "cat": "Phù Lục", "desc": "Phẩm 4 · Linh phù đóng băng đối thủ"}, "item.thuong_lang_phu": {"name": "Thương Lang Phù", "quality": 4, "cat": "Phù Lục", "desc": "Phẩm 4 · Linh phù triệu hồi bóng sói xanh công kích"}, "item.toan_phong_phu": {"name": "Toàn Phong Phù", "quality": 4, "cat": "Phù Lục", "desc": "Phẩm 4 · Linh phù tạo lốc xoáy cuốn bay địch"}, "item.thanh_bang_si": {"name": "Thanh Bằng Sí", "quality": 4, "cat": "Phương Tiện", "desc": "Phẩm 4 · Cánh chim Thanh Bằng phi hành"}, "item.bach_bao_nang": {"name": "Bách Bảo Nang", "quality": 4, "cat": "Trữ Vật", "desc": "Phẩm 4 · Túi gấm trăm báu tiện dụng"}, "item.tru_vat_gioi": {"name": "Trữ Vật Giới", "quality": 4, "cat": "Trữ Vật", "desc": "Phẩm 4 · Nhẫn trữ vật phổ thông của tu sĩ"}, "item.bang_phach_dan": {"name": "Băng Phách Đan", "quality": 4, "cat": "Đan Dược", "desc": "Phẩm 4 · Hàn đan tăng cường linh lực hệ Băng"}, "item.bo_khi_dan": {"name": "Bổ Khí Đan", "quality": 4, "cat": "Đan Dược", "desc": "Phẩm 4 · Đan dược bổ sung linh khí tiêu hao"}, "item.sinh_co_dan": {"name": "Sinh Cơ Đan", "quality": 4, "cat": "Đan Dược", "desc": "Phẩm 4 · Đan dược kích thích sinh cơ hồi phục vết thương"}, "item.tay_tuy_dan": {"name": "Tẩy Tủy Đan", "quality": 4, "cat": "Đan Dược", "desc": "Phẩm 4 · Đan dược tẩy rửa tạp chất kinh mạch"}, "item.thong_mach_dan": {"name": "Thông Mạch Đan", "quality": 4, "cat": "Đan Dược", "desc": "Phẩm 4 · Đan dược hỗ trợ đả thông kinh mạch"}, "item.tich_doc_dan": {"name": "Tịch Độc Đan", "quality": 4, "cat": "Đan Dược", "desc": "Phẩm 4 · Đan dược phòng ngừa chướng khí và độc tố"}, "item.trang_dam_dan": {"name": "Tráng Đảm Đan", "quality": 4, "cat": "Đan Dược", "desc": "Phẩm 4 · Đan dược tăng cường khí phách và dũng khí"}, "item.truc_co_dan": {"name": "Trúc Cơ Đan", "quality": 4, "cat": "Đan Dược", "desc": "Phẩm 4 · Linh đan thiết yếu để đột phá Trúc Cơ"}, "item.dan_khi_quyet": {"name": "Dẫn Khí Quyết", "quality": 3, "cat": "Công Pháp", "desc": "Phẩm 3 · Công pháp dẫn linh khí nhập thể căn bản"}, "item.bach_cot_phan": {"name": "Bạch Cốt Phấn", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Bột xương trắng dùng vẽ tà phù"}, "item.chu_ty": {"name": "Chu Ty", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Tơ nhện yêu thú dùng chế tác giáp và lưới"}, "item.cot_thu": {"name": "Cốt Thú", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Xương yêu thú nguyên liệu luyện khí"}, "item.diep_phan": {"name": "Diệp Phấn", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Phấn cánh bướm yêu thú dùng luyện đan chế phù"}, "item.han_thiet": {"name": "Hàn Thiết", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Quặng sắt lạnh nơi băng nguyên"}, "item.kim_giac": {"name": "Kim Giác", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Sừng vàng của yêu thú"}, "item.lang_nha": {"name": "Lang Nha", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Răng nanh sói yêu sắc nhọn"}, "item.linh_ngu": {"name": "Linh Ngư", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Cá linh bơi trong suối linh khí"}, "item.moc_khoi_hach": {"name": "Mộc Khôi Hạch", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Lõi của mộc nhân khôi lỗi"}, "item.ngu_chau": {"name": "Ngư Châu", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Hạt châu trong bụng cá linh"}, "item.oan_hon_ty": {"name": "Oán Hồn Ty", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Sợi tơ kết từ oán khí"}, "item.te_nguu_giac": {"name": "Tê Ngưu Giác", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Sừng Thiết Bối Tê Ngưu"}, "item.thach_tuy_phan": {"name": "Thạch Tủy Phấn", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Bột tủy đá linh nguyên liệu chế tác"}, "item.thi_mao": {"name": "Thi Mao", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Lông mao cương thi luyện tà khí"}, "item.thiet_thuoc_bi": {"name": "Thiết Thước Bì", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Da yêu thú dày cứng như sắt"}, "item.thuy_hau_mao": {"name": "Thủy Hầu Mao", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Lông khỉ nước vùng sông hồ"}, "item.tran_chau": {"name": "Trân Châu", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Ngọc trai linh khí dưới đáy biển"}, "item.xa_dam": {"name": "Xà Đảm", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Mật rắn yêu thú giúp sáng mắt giải độc"}, "item.yeu_dan_2": {"name": "Nhị Giai Yêu Đan", "quality": 3, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 3 · Yêu đan yêu thú bậc 2 (Trúc Cơ)"}, "item.bach_cot_hoa": {"name": "Bạch Cốt Hoa", "quality": 3, "cat": "Linh Dược", "desc": "Phẩm 3 · Hoa mọc trên xương trắng nơi cổ chiến trường"}, "item.ha_diep_suong": {"name": "Hà Diệp Sương", "quality": 3, "cat": "Linh Dược", "desc": "Phẩm 3 · Sương sớm đọng trên lá sen linh"}, "item.hoa_diep_dang": {"name": "Hỏa Diệp Đằng", "quality": 3, "cat": "Linh Dược", "desc": "Phẩm 3 · Dây leo lá lửa dùng luyện đan"}, "item.phong_mat": {"name": "Phong Mật", "quality": 3, "cat": "Linh Dược", "desc": "Phẩm 3 · Mật ong linh dưỡng khí hoàn thần"}, "item.son_sam": {"name": "Sơn Sâm", "quality": 3, "cat": "Linh Dược", "desc": "Phẩm 3 · Nhân sâm núi già bổ khí huyết"}, "item.thanh_tam_thao": {"name": "Thanh Tâm Thảo", "quality": 3, "cat": "Linh Dược", "desc": "Phẩm 3 · Cỏ thanh tâm nguyên liệu luyện đan cơ bản"}, "item.lang_nha_chuy": {"name": "Lang Nha Chùy", "quality": 3, "cat": "Pháp Khí", "desc": "Phẩm 3 · Chùy gai sát thương ngoại lực"}, "item.thanh_phong_kiem": {"name": "Thanh Phong Kiếm", "quality": 3, "cat": "Pháp Khí", "desc": "Phẩm 3 · Phi kiếm thanh phong nhẹ bén"}, "item.thiet_kiem": {"name": "Thiết Kiếm", "quality": 3, "cat": "Pháp Khí", "desc": "Phẩm 3 · Kiếm sắt rèn đúc cơ bản của tu sĩ cấp thấp"}, "item.bien_buc_si": {"name": "Biên Bức Sí", "quality": 3, "cat": "Phương Tiện", "desc": "Phẩm 3 · Cánh dơi huyết tinh bay lượn đêm tối"}, "item.tru_vat_dai": {"name": "Trữ Vật Đại", "quality": 3, "cat": "Trữ Vật", "desc": "Phẩm 3 · Túi trữ vật cơ bản"}, "item.hoi_xuan_dan": {"name": "Hồi Xuân Đan", "quality": 3, "cat": "Đan Dược", "desc": "Phẩm 3 · Đan dược trị thương cơ bản"}, "item.kim_sang_duoc": {"name": "Kim Sang Dược", "quality": 3, "cat": "Đan Dược", "desc": "Phẩm 3 · Thuốc trị ngoại thương thông dụng"}, "item.ngung_khi_dan": {"name": "Ngưng Khí Đan", "quality": 3, "cat": "Đan Dược", "desc": "Phẩm 3 · Đan dược tăng tốc tu luyện Luyện Khí"}, "item.thanh_tam_dan": {"name": "Thanh Tâm Đan", "quality": 3, "cat": "Đan Dược", "desc": "Phẩm 3 · Đan dược tĩnh tâm an thần, trừ tạp niệm"}, "item.tu_khi_dan": {"name": "Tụ Khí Đan", "quality": 3, "cat": "Đan Dược", "desc": "Phẩm 3 · Đan dược tụ tập linh khí hỗ trợ tu luyện"}, "item.dp_thiet_kiem": {"name": "Đồ Phổ: Thiết Kiếm", "quality": 3, "cat": "Đan Phương", "desc": "Phẩm 3 · Đồ phổ rèn đúc Thiết Kiếm"}, "item.chu_sa": {"name": "Chu Sa", "quality": 2, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 2 · Mực chu sa dùng vẽ linh phù"}, "item.phu_chi": {"name": "Phù Chỉ", "quality": 2, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 2 · Giấy vàng chuyên dụng để chế phù"}, "item.thiet_khoang": {"name": "Thiết Khoáng", "quality": 2, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 2 · Quặng sắt cơ bản để luyện khí"}, "item.yeu_bi": {"name": "Yêu Bì", "quality": 2, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 2 · Da yêu thú dùng chế giáp và phù"}, "item.yeu_dan_1": {"name": "Nhất Giai Yêu Đan", "quality": 2, "cat": "Khoáng Thạch & Yêu Đan", "desc": "Phẩm 2 · Yêu đan yêu thú bậc 1 (Luyện Khí)"}};
    var THE_CHAT_DB = {"the_chat.hoang_co": {"id": "the_chat.hoang_co", "ten": "Hoang Cổ thánh thể", "mo_ta": "Thể chất thượng cổ chí tôn. Kinh mạch rộng như đại giang đại hà (121 ô), không huyệt khiếu.", "buff": "Khí huyết +50% · Phản phệ 50% · Tốc độ -15%", "icon": "👑", "khuon": ". . 5 5 4 4 4 5 5 . .\n. 3 3 3 2 2 2 3 3 3 .\n5 3 2 2 1 1 1 2 2 3 5\n5 3 2 2 1 1 1 2 2 3 5\n4 2 1 1 0 0 0 1 1 2 4\n4 2 1 1 0 D 0 1 1 2 4\n4 2 1 1 0 0 0 1 1 2 4\n5 3 2 2 1 1 1 2 2 3 5\n5 3 2 2 1 1 1 2 2 3 5\n. 3 3 3 2 2 2 3 3 3 .\n. . 5 5 4 4 4 5 5 . .\n", "dac_tinh": {"khi_huyet": 0.5, "phan_phe": 0.5, "toc_do": -0.15}}, "the_chat.cuu_am": {"id": "the_chat.cuu_am", "ten": "Cửu Âm tuyệt mạch", "mo_ta": "Âm khí tụ trong chín đường kinh mạch. 10 huyệt khiếu cực hạn, 40% kinh mạch ép sang Băng.", "buff": "10 Huyệt khiếu · Ép 40% Băng hệ · Cực mạnh Băng Tu", "icon": "❄️", "khuon": ". 5 4 e 4 5 .\nf d 2 b 2 3 5\n4 c 0 0 0 2 4\n4 1 0 D 0 1 e\n4 2 0 0 0 c 4\n5 3 2 b 2 3 5\n. 5 3 d 3 f .\n", "dac_tinh": {"ep_bang": 0.4, "tho_pham_nhan": 30}}, "the_chat.kiem_cot": {"id": "the_chat.kiem_cot", "ten": "Kiếm cốt", "mo_ta": "Xương sống thẳng như thần kiếm, kinh mạch thanh trường. Trời sinh kiếm tiên vô song.", "buff": "Kiếm uy lực +25% · Kinh lộ tối đa 7", "icon": "⚔️", "khuon": ". . f . .\n. 5 4 5 .\n5 4 e 4 5\n4 4 3 4 4\n4 3 d 3 4\n3 3 2 3 3\n3 2 c 2 3\n2 2 1 2 2\n2 1 b 1 2\n1 0 0 0 1\n1 0 D 0 1\n1 0 0 0 1\n. 1 1 1 .\n", "dac_tinh": {"kiem_uy_luc": 0.25, "kinh_lo_toi_da": 7}}, "the_chat.bach_thao": {"id": "the_chat.bach_thao", "ten": "Bách Thảo thể", "mo_ta": "Huyết mạch sinh ra từ linh dược thần thảo. Thấm sâu mọi loại đan dược, đan đạo thánh thể.", "buff": "Dược kháng +20% · Đan dược trong trận +25%", "icon": "🌿", "khuon": ". . f 4 e 4 5 . .\n. d 3 2 2 2 3 3 .\n5 3 2 1 1 1 2 3 5\n4 2 1 0 0 0 1 c 4\n4 2 1 0 D 0 1 2 4\n4 2 1 0 0 0 1 2 4\n5 3 2 1 b 1 2 3 5\n. 3 3 2 2 2 3 3 .\n. . 5 4 e 4 5 . .\n", "dac_tinh": {"duoc_khang": 0.2, "dan_tran": 0.25}}, "the_chat.thiet_cot": {"id": "the_chat.thiet_cot", "ten": "Thiết cốt", "mo_ta": "Gân cốt đúc từ huyền thiết, kinh mạch rộng lớn, thể tu kim cang bất hoại.", "buff": "Khí huyết +20% · Phòng ngự dẻo dai", "icon": "🛡️", "khuon": ". . f 5 4 4 4 5 5 . .\n. 3 3 3 2 2 2 3 3 3 .\n5 3 2 2 1 1 1 2 2 3 5\n4 2 1 1 0 0 0 1 1 c 4\n4 2 1 1 0 D 0 1 1 2 4\n4 2 1 1 0 0 0 1 1 2 4\n5 3 2 2 1 1 1 2 2 3 5\n. 3 3 3 2 2 2 3 3 3 .\n. . 5 5 4 e 4 5 5 . .\n", "dac_tinh": {"khi_huyet": 0.2}}, "the_chat.pham_the": {"id": "the_chat.pham_the", "ten": "Phàm thể", "mo_ta": "Thân xác người phàm bình thường.", "buff": "Không có buff đặc thù", "icon": "👤", "khuon": ". . f 4 e 4 5 . .\n. d 3 2 2 2 3 3 .\n5 3 2 1 1 1 2 3 5\n4 2 1 0 0 0 1 c 4\n4 2 1 0 D 0 1 2 4\n4 2 1 0 0 0 1 2 4\n5 3 2 1 b 1 2 3 5\n. 3 3 2 2 2 3 3 .\n. . 5 4 e 4 5 . .\n", "dac_tinh": {}}};
    var ALL_TOP_SKILLS = ["item.ba_tieu_phien", "item.bac_minh_han_thuong", "item.bat_bao_kim_chung", "item.bich_lac_kinh", "item.bich_lan_doc_cham", "item.bo_de_niem_chau", "item.canh_kim_chan_kinh", "item.canh_kim_quyet", "item.chan_loi_quyet", "item.chuong_tam_loi", "item.cot_thu", "item.cuu_duong_chan_kinh", "item.cuu_thien_cuong_phong", "item.dan_khi_quyet", "item.dia_mach_linh_chau", "item.dinh_hai_chau", "item.hau_tho_quyet", "item.hau_tho_than_bi", "item.hau_tho_thuan", "item.hoang_chung_nhiep_phach", "item.hon_nguyen_chau", "item.hon_nguyen_luyen_the_kinh", "item.hon_thien_lang", "item.huyen_bang_tam_kinh", "item.huyen_hoang_chuong", "item.huyen_hoang_tao_hoa_kinh", "item.huyen_minh_chan_kinh", "item.huyen_thiet_ho_uyen", "item.huyet_anh_dao", "item.huyet_trao_cong", "item.khai_son_dao", "item.khon_tien_thang", "item.kim_cang_quyet", "item.kim_cot_ngoc_tuy", "item.kim_giao_tien", "item.kim_than_phap_tuong", "item.kinh_hong_tien_kiem", "item.lang_nha_chuy", "item.liet_ho_dao", "item.linh_lung_tran_nhac_thap", "item.loi_dinh_lenh", "item.luan_hoi_chan_kinh", "item.luu_van_quyet", "item.ly_hoa_tien_kiem", "item.man_hoang_cot_mau", "item.ngoc_lo_binh", "item.ngoc_tinh_binh", "item.ngu_to_hop_dao_quyet", "item.nhiep_hon_dai_phap", "item.pha_giap_toan", "item.phan_thien_chan_hoa", "item.phan_thuy_thich", "item.phi_cuong_trao", "item.phi_liem_phong_y", "item.phong_luan_phi_hoan", "item.quy_hai_kinh", "item.quy_tuc_cong", "item.tai_than_tu_van_kinh", "item.tam_kiem_quyet", "item.tam_nguyen_quy_nhat_cong", "item.tam_sinh_thach", "item.thai_am_bang_luan", "item.thai_co_long_lan", "item.thai_thanh_tien_kinh", "item.thai_thuong_huyen_thuy_kinh", "item.thanh_de_truong_xuan_kinh", "item.thanh_loi_quyet", "item.thanh_moc_tu_linh_chau", "item.thanh_van_kiem_quyet", "item.thien_loi_chinh_phap", "item.thiet_bo_sam", "item.thong_ty_kim_con", "item.thu_thuy_kiem_quyet", "item.thua_anh_kiem", "item.thuong_lan_kiem", "item.trong_son_quyet", "item.tru_tien_kiem", "item.truong_sinh_chan_kinh", "item.tu_dien_thoa", "item.tu_kim_phi_kiem", "item.tu_thu_tien_y", "item.tu_tieu_than_kiem", "item.tuc_nhuong", "item.van_hon_chu", "item.van_kiep_hon_dang", "item.vinh_trieu_chuong", "item.yeu_hoang_huyet_kinh"];
    var ALL_RECIPES = ["dp.bach_giai_dan", "dp.bach_hac_vu_y", "dp.bang_phach_dan", "dp.bao_huyet_dan", "dp.bao_huyet_dan_mac", "dp.bich_lan_doc_cham", "dp.bo_khi_dan", "dp.boi_anh_dan", "dp.boi_nguyen_dan", "dp.bua_tru_ta", "dp.canh_kim_phu", "dp.chu_ty_vong", "dp.cuu_vi_huyen_dang", "dp.dan_lo_dia", "dp.dan_lo_dong", "dp.dan_loi_phu", "dp.dia_don_phu_vu", "dp.dinh_than_dan", "dp.dinh_than_phu", "dp.dinh_than_phu_diep", "dp.due_kim_dan", "dp.duong_khi_dan", "dp.duong_than_dan", "dp.giao_can_cung", "dp.giao_cot_cung", "dp.han_thiet_dao", "dp.hat_vi_tien", "dp.hau_tho_kim_cang_an", "dp.hau_tho_thuan_tuy", "dp.ho_cot_dao", "dp.hoa_dan_phu", "dp.hoa_long_truong", "dp.hoan_hon_dan", "dp.hoi_thien_dan", "dp.hoi_xuan_dan", "dp.hoi_xuan_dan_thuy", "dp.huyen_anh_dan", "dp.huyen_bang_phu", "dp.huyet_anh_dao", "dp.huyet_ha_phien", "dp.khai_nguyen_dan", "dp.khi_lo_hoang", "dp.khi_lo_huyen", "dp.khi_lo_pham", "dp.khu_thi_linh", "dp.kim_cuong_phu", "dp.kim_dan_phu", "dp.kim_lan_doc_phu", "dp.kim_lo_dan", "dp.kim_o_dan", "dp.kim_sang_duoc", "dp.lang_nguyet_cau", "dp.lang_nha_chuy", "dp.linh_lung_dan", "dp.linh_lung_thap_nha", "dp.loi_am_dan", "dp.ngung_khi_dan", "dp.ngung_nguyen_dan", "dp.pha_chuong_dan", "dp.pha_giap_toan_giac", "dp.phi_cuong_trao", "dp.phu_but_hoang_tho", "dp.phu_but_huyen", "dp.phu_but_pham", "dp.phu_but_thien", "dp.quy_giap_thuan_ngac", "dp.quy_loi_co", "dp.quy_tuc_phu", "dp.sinh_co_dan", "dp.tao_hoa_dan", "dp.tay_tuy_dan", "dp.thai_hu_dan", "dp.thanh_phong_phu", "dp.thanh_tam_dan", "dp.thanh_vu_dan", "dp.thien_bang_cung", "dp.thien_loi_dan", "dp.thien_loi_phu", "dp.thien_nhat_dan", "dp.thiet_kiem", "dp.thong_than_dan", "dp.thuong_long_dan", "dp.tich_doc_dan", "dp.tinh_nguyen_dan", "dp.toa_hon_phu", "dp.toan_phong_phu", "dp.tran_hon_dan", "dp.tran_quy_phu", "dp.trang_dam_dan", "dp.truc_co_dan", "dp.tu_khi_dan", "dp.tu_kim_phi_kiem", "dp.tu_kim_phi_kiem_nha", "dp.tu_linh_dan", "dp.tu_tieu_loi_phu", "dp.tuc_mach_cao", "dp.tuy_ha_dan", "dp.van_quy_phien", "dp.van_tam_dan", "dp.van_tho_dan", "dp.yeu_bi_giap"];
    var MO_KHOA_DATA = [{"id": "mo_khoa.linh_can", "ten": "Linh Căn", "max": 3, "desc": "Tối đa tỷ lệ Thiên / Biến Dị Linh Căn"}, {"id": "mo_khoa.thien_tu", "ten": "Thiên Tư", "max": 4, "desc": "Sàn chỉ số khởi đầu cực cao"}, {"id": "mo_khoa.tho", "ten": "Thọ Nguyên", "max": 3, "desc": "+15 năm thọ khởi đầu"}, {"id": "mo_khoa.tuc_tue", "ten": "Túc Tuệ", "max": 3, "desc": "+30% tốc độ tu luyện"}, {"id": "mo_khoa.hanh_trang", "ten": "Hành Trang", "max": 3, "desc": "+100 Linh Thạch khởi đầu"}, {"id": "mo_khoa.tui", "ten": "Túi Đồ", "max": 2, "desc": "+4 ô túi đồ"}, {"id": "mo_khoa.di_the", "ten": "Dị Thể", "max": 2, "desc": "Tăng gấp đôi cơ hội Thần Thể"}, {"id": "mo_khoa.dan_tam", "ten": "Đan Tâm", "max": 1, "desc": "Thuộc sẵn Hồi Xuân Đan phương"}, {"id": "mo_khoa.phu_tam", "ten": "Phù Tâm", "max": 1, "desc": "Thuộc sẵn Hỏa Đạn Phù phương"}, {"id": "mo_khoa.khi_tam", "ten": "Khí Tâm", "max": 1, "desc": "Thuộc sẵn Thiết Kiếm đồ phổ"}, {"id": "mo_khoa.chon_nuoc", "ten": "Thiên mệnh: Chọn Nước", "max": 1, "desc": "Chọn nước sinh ra"}, {"id": "mo_khoa.chon_xuat_than", "ten": "Thiên mệnh: Chọn Xuất Thân", "max": 1, "desc": "Chọn xuất thân mong muốn"}, {"id": "mo_khoa.dinh_he", "ten": "Thiên mệnh: Định 1 Hệ", "max": 1, "desc": "Chắc chắn ra hệ mong muốn"}, {"id": "mo_khoa.xuat_than.tan_tu", "ten": "Mở: Tán Tu", "max": 1, "desc": "Xuất thân Tán tu"}, {"id": "mo_khoa.xuat_than.hau_boi_tong_mon", "ten": "Mở: Hậu Bối Tông Môn", "max": 1, "desc": "Xuất thân tông môn"}, {"id": "mo_khoa.xuat_than.hoang_toc", "ten": "Mở: Hoàng Tộc", "max": 1, "desc": "Xuất thân hoàng gia"}, {"id": "mo_khoa.xuat_than.chuyen_the", "ten": "Mở: Chuyển Thế", "max": 1, "desc": "Hồn mạnh, nhớ kiếp trước"}];
    var ALL_THANH_TUU = [{"id": "thanh_tuu.canh_gioi.luyen_khi", "ten": "Bước lên tiên lộ (Luyện Khí)"}, {"id": "thanh_tuu.canh_gioi.truc_co", "ten": "Trúc cơ thành công"}, {"id": "thanh_tuu.canh_gioi.ket_dan", "ten": "Chân nhân (Kim Đan)"}, {"id": "thanh_tuu.canh_gioi.nguyen_anh", "ten": "Lão tổ (Nguyên Anh)"}, {"id": "thanh_tuu.canh_gioi.hoa_than", "ten": "Đại năng (Hóa Thần)"}, {"id": "thanh_tuu.pham_chat.2", "ten": "Đạo cơ Hoàn Mỹ"}, {"id": "thanh_tuu.pham_chat.3", "ten": "Kim đan Nhất phẩm"}, {"id": "thanh_tuu.pham_chat.4", "ten": "Dị anh (Dị tượng Nguyên Anh)"}, {"id": "thanh_tuu.tong_mon.chan_truyen", "ten": "Chân truyền đệ tử"}, {"id": "thanh_tuu.tong_mon.truong_lao", "ten": "Trưởng lão môn phái"}, {"id": "thanh_tuu.dao_lu", "ten": "Kết làm đạo lữ"}, {"id": "thanh_tuu.ket_nghia", "ten": "Kết nghĩa kim lan"}, {"id": "thanh_tuu.thien_kieu_bang", "ten": "Đứng đầu Thiên Kiêu Bảng"}, {"id": "thanh_tuu.tam_ma", "ten": "Chém tâm ma"}, {"id": "thanh_tuu.nuoc.ung", "ten": "Trúc cơ ở Đại Ung"}, {"id": "thanh_tuu.nuoc.thinh", "ten": "Trúc cơ ở Thịnh Quốc"}, {"id": "thanh_tuu.nuoc.luong", "ten": "Trúc cơ ở Lương Quốc"}, {"id": "thanh_tuu.nuoc.minh", "ten": "Trúc cơ ở Bắc Minh"}, {"id": "thanh_tuu.nuoc.viem", "ten": "Trúc cơ ở Viêm Quốc"}, {"id": "thanh_tuu.nghe.luyen_dan", "ten": "Đan sư (Mở Đan Tâm)"}, {"id": "thanh_tuu.nghe.che_phu", "ten": "Phù sư (Mở Phù Tâm)"}, {"id": "thanh_tuu.nghe.luyen_bao", "ten": "Khí sư (Mở Khí Tâm)"}, {"id": "thanh_tuu.nghe.tong_su", "ten": "Tông sư một nghề"}, {"id": "thanh_tuu.chet.het_tho", "ten": "Thọ tận"}, {"id": "thanh_tuu.chet.tu_tran", "ten": "Tử trận"}, {"id": "thanh_tuu.chet.dot_pha", "ten": "Thân tử đạo tiêu"}, {"id": "thanh_tuu.chet.tu_vong", "ten": "Bỏ mạng"}, {"id": "thanh_tuu.chet.tu_bo", "ten": "Tự tán công"}];
    /* 3. GIAO DIỆN "Vạn Kiếp Tu Tiên MOD v2.3" (ĐÓNG/MỞ GỌN GÀNG - BẤM VÀO MỚI HIỆN RA) */
    var styleSheet = document.createElement("style");
    styleSheet.innerText = "\n@keyframes vktt-rainbow-text {\n    0% { background-position: 0% 50%; }\n    50% { background-position: 100% 50%; }\n    100% { background-position: 0% 50%; }\n}\n.vktt-rainbow-style {\n    background: linear-gradient(90deg, #ff4d4d, #ffaf40, #fffa65, #32ff7e, #18dcff, #7d5fff, #ff4d4d);\n    background-size: 300% 300%;\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    animation: vktt-rainbow-text 3s ease infinite;\n    font-weight: 800;\n}\n#tu-tien-floating-panel {\n    position: fixed;\n    top: 18px;\n    right: 18px;\n    z-index: 999999;\n    background: linear-gradient(165deg, rgba(15, 17, 26, 0.98) 0%, rgba(9, 10, 16, 0.99) 100%);\n    color: #f1f5f9;\n    padding: 12px;\n    border-radius: 12px;\n    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;\n    font-size: 12px;\n    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.85), 0 0 18px rgba(229, 184, 105, 0.18);\n    border: 1px solid rgba(229, 184, 105, 0.5);\n    width: 355px;\n    max-width: calc(100vw - 16px);\n    user-select: none;\n    -webkit-user-select: none;\n}\n#tu-tien-floating-panel * {\n    box-sizing: border-box;\n}\n.tk-stat-box {\n    margin-bottom: 8px;\n    background: linear-gradient(135deg, rgba(229, 184, 105, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%);\n    border: 1px solid rgba(229, 184, 105, 0.25);\n    padding: 8px 10px;\n    border-radius: 8px;\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 4px 8px;\n    font-size: 11.5px;\n}\n.tk-acc {\n    border: 1px solid #262c40;\n    border-radius: 8px;\n    margin-bottom: 6px;\n    background: #131622;\n    overflow: hidden;\n    transition: border-color 0.2s;\n}\n.tk-acc.open {\n    border-color: #e5b869;\n}\n.tk-acc-hdr {\n    padding: 8px 10px;\n    cursor: pointer;\n    font-weight: 700;\n    font-size: 12px;\n    color: #e5b869;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    background: linear-gradient(90deg, rgba(229, 184, 105, 0.12) 0%, rgba(25, 30, 48, 0.5) 100%);\n}\n.tk-acc-hdr:hover {\n    background: linear-gradient(90deg, rgba(229, 184, 105, 0.22) 0%, rgba(35, 42, 66, 0.6) 100%);\n    color: #fde68a;\n}\n.tk-acc-arrow {\n    font-size: 10px;\n    color: #cbd5e1;\n    background: rgba(255, 255, 255, 0.08);\n    padding: 2px 6px;\n    border-radius: 4px;\n    transition: transform 0.2s;\n}\n.tk-acc.open .tk-acc-arrow {\n    transform: rotate(180deg);\n    background: rgba(229, 184, 105, 0.25);\n    color: #e5b869;\n}\n.tk-acc-bdy {\n    display: none;\n    padding: 8px 10px;\n    border-top: 1px solid #222738;\n    background: #0b0d14;\n}\n.tk-acc.open .tk-acc-bdy {\n    display: block;\n}\n.tk-row {\n    display: flex;\n    gap: 5px;\n    align-items: center;\n    margin-bottom: 6px;\n}\n.tk-row:last-child {\n    margin-bottom: 0;\n}\n.tk-lbl {\n    width: 88px;\n    color: #94a3b8;\n    font-size: 11.5px;\n    flex-shrink: 0;\n}\n.tk-inp {\n    flex: 1;\n    min-width: 0;\n    background: #141824;\n    color: #f8fafc;\n    border: 1px solid #2e364f;\n    border-radius: 5px;\n    padding: 4px 7px;\n    font-size: 11.5px;\n    outline: none;\n}\n.tk-inp:focus {\n    border-color: #e5b869;\n}\n.tk-btn {\n    background: linear-gradient(135deg, #e5b869 0%, #b78438 100%);\n    color: #090a0f;\n    border: none;\n    border-radius: 5px;\n    padding: 4px 9px;\n    font-weight: 700;\n    font-size: 11.5px;\n    cursor: pointer;\n    white-space: nowrap;\n}\n.tk-btn:hover {\n    filter: brightness(1.1);\n}\n.tk-btn-cyan {\n    background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%);\n    color: #fff;\n}\n.tk-btn-purple {\n    background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%);\n    color: #fff;\n}\n.vktt-custom-option {\n    padding: 6px 9px;\n    cursor: pointer;\n    border-bottom: 1px solid #1e2336;\n    font-size: 11.5px;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 6px;\n}\n.vktt-custom-option:hover {\n    background: rgba(229, 184, 105, 0.18) !important;\n}\n.tk-sub-details {\n    border: 1px solid #222738;\n    border-radius: 6px;\n    margin-top: 6px;\n    background: #111420;\n}\n.tk-sub-details > summary {\n    padding: 5px 8px;\n    cursor: pointer;\n    font-size: 11px;\n    font-weight: 600;\n    color: #38bdf8;\n    list-style: none;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n}\n.tk-sub-details > summary::-webkit-details-marker { display: none; }\n.tk-sub-details > summary::after { content: \"▼ Mở\"; font-size: 10px; color: #94a3b8; }\n.tk-sub-details[open] > summary::after { content: \"▲ Đóng\"; color: #e5b869; }\n.tk-sub-body {\n    padding: 6px 8px;\n    border-top: 1px solid #222738;\n    max-height: 165px;\n    overflow-y: auto;\n}\n";
    document.head.appendChild(styleSheet);

    var toastTimer = null;
    function notify(msg) {
        var t = document.getElementById('vktt-tk-toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'vktt-tk-toast';
            t.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#131622;color:#f8fafc;padding:10px 16px;border-radius:8px;border-left:4px solid #e5b869;box-shadow:0 8px 25px rgba(0,0,0,0.85);z-index:10000000;font-family:sans-serif;font-size:12.5px;font-weight:600;transition:opacity 0.25s;opacity:0;pointer-events:none;';
            document.body.appendChild(t);
        }
        t.innerText = msg;
        t.style.opacity = '1';
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function() { t.style.opacity = '0'; }, 2800);
    }
    /* 4. ĐỢI GAME LOAD XONG STORE RỒI MỚI KHỞI TẠO (GIỮ NGUYÊN CƠ CHẾ V3.8/V4.9) */
    var checkGameLoaded = setInterval(function() {
        try {
            if (gWin.game && gWin.game.store) {
                clearInterval(checkGameLoaded);
                initCheatPanel();
            }
        } catch(e) {}
    }, 500);

    function getItemInfo(itemId) {
        if (PRESET_ITEMS[itemId]) return PRESET_ITEMS[itemId];

        try {
            var state = gWin.game.store.getState();
            var content = state.content || {};
            var itemObj = content.item || {};
            var rawKey = itemId.replace('item.', '');

            var itemData = null;
            if (typeof itemObj.get === 'function') {
                itemData = itemObj.get(itemId) || itemObj.get(rawKey);
            } else {
                itemData = itemObj[itemId] || itemObj[rawKey];
            }

            if (itemData) {
                return {
                    name: itemData.ten || itemData.name || itemId,
                    quality: itemData.pham_cap || itemData.phamCap || 1,
                    cat: itemData.loai || 'Vật phẩm'
                };
            }
        } catch(e) {}

        var parts = itemId.replace('item.', '').split('_');
        for (var i = 0; i < parts.length; i++) {
            if (parts[i]) parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
        }
        return { name: parts.join(' '), quality: 1, cat: 'Tự nhập' };
    }

    function parseKhuonFallback(khuonStr) {
        var rawLines = khuonStr.replace(/^\s+|\s+$/g, '').split("\n");
        var lines = [];
        for (var i = 0; i < rawLines.length; i++) {
            var rowStr = rawLines[i].replace(/^\s+|\s+$/g, '');
            if (rowStr.length > 0) lines.push(rowStr.split(/\s+/));
        }
        var rong = lines[0].length;
        var cao = lines.length;
        var vung = [];
        for (var r = 0; r < cao; r++) {
            for (var c = 0; c < rong; c++) {
                var ch = lines[r][c];
                if (ch === "D") vung.push(0);
                else if (ch === ".") vung.push(-1);
                else if (/^[0-5]$/.test(ch)) vung.push(Number(ch));
                else if (/^[a-f]$/.test(ch)) vung.push(ch.charCodeAt(0) - 97);
                else vung.push(-1);
            }
        }
        return { rong: rong, cao: cao, vung: vung };
    }

    function capVal(val, max, min) {
        var num = parseInt(val, 10);
        if (isNaN(num)) num = min !== undefined ? min : 0;
        if (max !== undefined && num > max) num = max;
        if (min !== undefined && num < min) num = min;
        return num;
    }

    function renderHuyetGrid() {
        var container = document.getElementById('huyet-grid-container');
        if (!container) return;
        container.innerHTML = '';
        try {
            var run = gWin.game.store.getState().run;
            if (!run || !run.nhanVat) {
                container.dataset.renderedTheChat = '';
                container.innerHTML = '<span style="color:#f87171; font-size:11px;">Chưa vào trong kiếp tu tiên để tải sơ đồ.</span>';
                return;
            }
            var nv = run.nhanVat;
            var tcKey = nv.theChat || 'the_chat.pham_the';
            var tcData = THE_CHAT_DB[tcKey] || THE_CHAT_DB['the_chat.pham_the'];
            container.dataset.renderedTheChat = tcKey;

            var rawLines = tcData.khuon.replace(/^\s+|\s+$/g, '').split("\n");
            var lines = [];
            for (var rIdx = 0; rIdx < rawLines.length; rIdx++) {
                var rowStr = rawLines[rIdx].replace(/^\s+|\s+$/g, '');
                if (rowStr.length > 0) lines.push(rowStr.split(/\s+/));
            }
            var rong = lines[0].length;
            var cao = lines.length;
            var vung = [];
            for (var r = 0; r < cao; r++) {
                for (var c = 0; c < rong; c++) {
                    var ch = lines[r][c];
                    if (ch === ".") vung.push(-1);
                    else if (ch === "D") vung.push(0);
                    else vung.push(1);
                }
            }

            container.style.gridTemplateColumns = 'repeat(' + rong + ', 20px)';
            var rawHuyetThem = (nv.kinhMach && nv.kinhMach.huyetThem) || [];
            var currentHuyetThem = [];
            for (var hi = 0; hi < rawHuyetThem.length; hi++) {
                currentHuyetThem.push(parseInt(rawHuyetThem[hi], 10));
            }

            for (var i = 0; i < vung.length; i++) {
                var cellType = vung[i];
                var lbl = document.createElement('label');
                var chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.value = i;
                chk.className = 'huyet-checkbox';
                chk.style.display = 'none';

                if (cellType === -1) {
                    lbl.style.cssText = 'width:20px; height:20px; background:transparent; border:none; pointer-events:none;';
                } else if (cellType === 0) {
                    lbl.dataset.type = 'dan_dien';
                    lbl.style.cssText = 'display:flex; align-items:center; justify-content:center; width:20px; height:20px; background:#ef4444; border:1px solid #b91c1c; border-radius:3px; font-size:9px; font-weight:bold; color:#fff; cursor:default;';
                    lbl.innerText = 'Đ';
                } else {
                    lbl.dataset.type = 'huyet';
                    lbl.style.cssText = 'display:flex; align-items:center; justify-content:center; width:20px; height:20px; background:#1b2132; border:1px solid #334155; border-radius:3px; cursor:pointer; font-size:9px; color:#e5b869;';
                    lbl.appendChild(chk);
                    lbl.appendChild(document.createTextNode(i));

                    if (currentHuyetThem.indexOf(i) !== -1) {
                        chk.checked = true;
                        lbl.style.background = '#e5b869';
                        lbl.style.color = '#000';
                    }

                    chk.onchange = (function(l, c) {
                        return function() {
                            if (c.checked) {
                                l.style.background = '#e5b869';
                                l.style.color = '#000';
                            } else {
                                l.style.background = '#1b2132';
                                l.style.color = '#e5b869';
                            }
                        };
                    })(lbl, chk);
                }
                container.appendChild(lbl);
            }
        } catch(e) {
            container.innerHTML = '<span style="color:#f87171; font-size:11px;">Chưa vào game để tải sơ đồ.</span>';
        }
    }

    function buildSyncedXepTui(oldXepTui, tuiDo) {
        var existing = [];
        if ( Object.prototype.toString.call(oldXepTui) === '[object Array]' ) {
            for (var i = 0; i < oldXepTui.length; i++) {
                if (oldXepTui[i]) existing.push(oldXepTui[i]);
            }
        }
        var allKeys = [];
        if (tuiDo && typeof tuiDo === 'object') {
            for (var k in tuiDo) {
                if (Object.prototype.hasOwnProperty.call(tuiDo, k) && tuiDo[k] > 0) {
                    allKeys.push(k);
                }
            }
        }
        return uniqueStrings(existing, allKeys);
    }

    
    /* 4. HÀM XỬ LÝ THÊM/SỬA HUYỆT ĐẠO CHỐNG CRASH HÀM Lt(t, n) */
    function addHuyetThemSafe(huyetIndexes, clearBadManh) {
        try {
            var store = gWin.game.store;
            var state = store.getState();
            var run = state.run;
            if (!run || !run.nhanVat) return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');

            var nhanVat = copyObj(run.nhanVat);
            var km = copyObj(nhanVat.kinhMach || {});
            
            var currentHuyetThem = Array.isArray(km.huyetThem) ? km.huyetThem : [];
            var toAdd = Array.isArray(huyetIndexes) ? huyetIndexes : [huyetIndexes];

            // Gộp danh sách huyệt vào mảng và loại trùng lặp
            var newHuyetList = uniqueStrings(currentHuyetThem, toAdd);
            km.huyetThem = newHuyetList;

            // Mở thông tất cả các ô trong mảng trangThai
            if (Array.isArray(km.trangThai)) {
                km.trangThai = km.trangThai.map(function() { return "thong"; });
            }

            // Gán lượt mở huyệt / đổi màu không giới hạn
            km.cho = { mo: 999, doiMau: 999 };

            // Nếu clearBadManh = true, dọn sạch mảnh cấy bị lệch ô gây crash r[h[w]]
            if (clearBadManh) {
                km.manh = [];
            }

            nhanVat.kinhMach = km;
            store.setState({ run: mergeObj(run, { nhanVat: nhanVat }) });
            notify('✅ Đã thêm Huyệt Đạo (' + toAdd.length + ' ô) và làm sạch dữ liệu thành công!');
        } catch (e) {
            notify('❌ Lỗi khi add Huyệt Đạo!');
        }
    }

    var MIN_PANEL_HTML = "\n<div style=\"display: flex; align-items: center; gap: 8px;\">\n    <span id=\"p-drag\" style=\"color: #e5b869; font-size: 13px; font-weight: 800; background: rgba(229,184,105,0.14); padding: 4px 9px; border-radius: 6px; cursor: move;\">⋮⋮ �Vạn Kiếp Tu Tiên MOD v2.3</span>\n    <span id=\"p-exp\" style=\"cursor: pointer; background: linear-gradient(135deg, #e5b869, #b78438); color: #000; font-size: 13px; font-weight: 800; padding: 3px 10px; border-radius: 6px;\">Mở +</span>\n</div>\n";
    var FULL_PANEL_HTML = "\n<div id=\"p-hdr\" style=\"font-weight: 800; border-bottom: 1px solid rgba(229,184,105,0.3); padding-bottom: 7px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; cursor: move;\">\n    <div style=\"display: flex; align-items: center; gap: 6px;\">\n        <span style=\"color: #e5b869; font-size: 15px;\">⋮⋮ 👑</span>\n        <span style=\"color: #e5b869; letter-spacing: 0.4px;\">Vạn Kiếp Tu Tiên</span>\n    </div>\n    <div style=\"display: flex; gap: 5px;\">\n        <span id=\"p-tgl\" title=\"Thu gọn\" style=\"cursor: pointer; color: #e5b869; font-weight: bold; padding: 2px 8px; background: rgba(229,184,105,0.15); border-radius: 4px;\">[Thu gọn]</span>\n        <span id=\"p-cls\" title=\"Đóng\" style=\"cursor: pointer; color: #f87171; padding: 2px 6px; background: rgba(248,113,113,0.15); border-radius: 4px;\">✕</span>\n    </div>\n</div>\n\n<div id=\"p-bdy\" style=\"max-height: 78vh; overflow-y: auto; padding-right: 2px;\">\n    <div class=\"tk-stat-box\">\n        <div>💎 Linh Thạch: <b id=\"panel-lt\" style=\"color: #fff;\">0</b></div>\n        <div>✨ Tu Vi: <b id=\"panel-tv\" style=\"color: #fff;\">0</b></div>\n        <div>⚡ Cảnh Giới: <b id=\"panel-cg\" style=\"color: #e5b869;\">0</b></div>\n        <div>📜 Cống Hiến: <b id=\"panel-ch\" style=\"color: #fff;\">0</b></div>\n        <div>🏛️ Công Tích: <b id=\"panel-ct\" style=\"color: #38bdf8;\">0</b></div>\n        <div>⏳ Tuổi: <b id=\"panel-tuoi\" style=\"color: #fff;\">0</b></div>\n        <div style=\"grid-column: span 2; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 4px;\">\n            🧬 Thể Chất: <b id=\"panel-thechat-hien-tai\" style=\"color: #e5b869;\">Đang tải...</b>\n        </div>\n        <div style=\"grid-column: span 2;\">\n            🌱 Linh Căn: <b id=\"panel-linhcan\" style=\"color: #38bdf8;\">Đang tải...</b>\n        </div>\n    </div>\n\n    <div style=\"display: flex; gap: 5px; margin-bottom: 8px;\">\n        <button id=\"btn-all-in-one\" class=\"tk-btn\" style=\"flex: 1; padding: 6px;\">🚀 Siêu Buff Toàn Diện 1-Click</button>\n        <button id=\"btn-heal-fast\" class=\"tk-btn tk-btn-cyan\" style=\"padding: 6px 8px;\">💊 Xóa Bình Cảnh</button>\n    </div>\n\n    <div class=\"tk-acc open\">\n        <div class=\"tk-acc-hdr\">\n            <span>💰 1. Tài Nguyên, Tuổi Thọ & Môn Phái</span>\n            <span class=\"tk-acc-arrow\">▾</span>\n        </div>\n        <div class=\"tk-acc-bdy\">\n            <div class=\"tk-row\"><span class=\"tk-lbl\">Đạo Hiệu:</span><input type=\"text\" id=\"input-ten\" class=\"tk-inp\" placeholder=\"Đổi tên...\"><button id=\"btn-ten\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">Linh Thạch:</span><input type=\"number\" id=\"input-lt\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-lt\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">Tu Vi:</span><input type=\"number\" id=\"input-tv\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-tv\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">Cống Hiến:</span><input type=\"number\" id=\"input-ch\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-ch\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">Công Tích:</span><input type=\"number\" id=\"input-ct\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-ct\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">Thọ Nguyên+:</span><input type=\"number\" id=\"input-tnt\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-tnt\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">Tuổi Hiện Tại:</span><input type=\"number\" id=\"input-tuoi\" class=\"tk-inp\" placeholder=\"18\"><button id=\"btn-tuoi\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\">\n                <span class=\"tk-lbl\">Chức Vị Phái:</span>\n                <select id=\"select-capbac\" class=\"tk-inp\">\n                    <option value=\"0\">0 - Ngoại Môn / Tán Tu</option>\n                    <option value=\"1\">1 - Đệ Tử Nội Môn</option>\n                    <option value=\"2\">2 - Chân Truyền Đệ Tử</option>\n                    <option value=\"3\">3 - Chấp Sự / Đường Chủ</option>\n                    <option value=\"4\" selected>4 - Trưởng Lão</option>\n                    <option value=\"5\">5 - Thái Thượng Trưởng Lão</option>\n                </select>\n                <button id=\"btn-capbac\" class=\"tk-btn\">Gán</button>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"tk-acc\">\n        <div class=\"tk-acc-hdr\">\n            <span>🎁 2. Kho 422 Vật Phẩm & 6 Ô Trang Bị</span>\n            <span class=\"tk-acc-arrow\">▾</span>\n        </div>\n        <div class=\"tk-acc-bdy\">\n            <div class=\"tk-row\">\n                <span class=\"tk-lbl\">Lọc Nhóm:</span>\n                <select id=\"select-item-cat\" class=\"tk-inp\">\n                    <option value=\"ALL\">Tất cả (422+ vật phẩm)</option>\n                    <option value=\"PHAM87\">🔥 Chỉ hiện Phẩm 7 - 8 (Thần Vật)</option>\n                    <option value=\"Công Pháp\">📜 Công Pháp & Bí Tịch (68)</option>\n                    <option value=\"Pháp Khí\">⚔️ Pháp Khí & Pháp Bảo (97)</option>\n                    <option value=\"Đan Dược\">💊 Đan Dược (44)</option>\n                    <option value=\"Linh Dược\">🌿 Linh Dược & Tiên Quả (54)</option>\n                    <option value=\"Phù Lục\">🧧 Phù Lục (12)</option>\n                    <option value=\"Đan Phương\">📖 Đan Phương & Đồ Phổ (34)</option>\n                    <option value=\"Lò Đỉnh & Dụng Cụ\">🔥 Lò Đỉnh & Bút (11)</option>\n                    <option value=\"Dị Hỏa\">🌋 Dị Hỏa (10)</option>\n                    <option value=\"Trữ Vật\">💍 Trữ Vật & Cánh (12)</option>\n                    <option value=\"Khoáng Thạch & Yêu Đan\">💎 Khoáng Thạch & Yêu Đan (80)</option>\n                </select>\n            </div>\n\n            <div style=\"position: relative; margin-bottom: 6px;\">\n                <div id=\"custom-select-box\" style=\"background: #141824; border: 1px solid #3b435d; border-radius: 5px; padding: 6px 9px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;\">\n                    <span id=\"custom-select-label\" style=\"color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;\">-- Bấm vào đây để chọn vật phẩm --</span>\n                    <span style=\"font-size: 10px; color: #e5b869;\">▼ Chọn</span>\n                </div>\n\n                <div id=\"custom-dropdown-list\" style=\"display: none; position: absolute; top: 34px; left: 0; width: 100%; max-height: 230px; overflow-y: auto; background: #121521; border: 1px solid #e5b869; border-radius: 6px; z-index: 1000005; box-shadow: 0 10px 25px rgba(0,0,0,0.95);\">\n                    <div style=\"padding: 6px; position: sticky; top: 0; background: #121521; border-bottom: 1px solid #262c40;\">\n                        <input type=\"text\" id=\"input-item-search\" class=\"tk-inp\" style=\"width: 100%;\" placeholder=\"🔍 Gõ tên tiếng Việt hoặc mã ID...\">\n                    </div>\n                    <div id=\"custom-dropdown-options\"></div>\n                </div>\n            </div>\n\n            <div class=\"tk-row\">\n                <input type=\"text\" id=\"input-item-id\" class=\"tk-inp\" placeholder=\"VD: item.nghich_menh_dan\" style=\"flex: 2; color: #38bdf8;\">\n                <input type=\"number\" id=\"input-item-sl\" class=\"tk-inp\" value=\"10\" min=\"1\" style=\"width: 60px; flex: none;\">\n                <button id=\"btn-add-item\" class=\"tk-btn\">+ Thêm</button>\n            </div>\n\n            <div style=\"display: flex; gap: 4px; margin-top: 5px;\">\n                <button id=\"btn-god-pack\" class=\"tk-btn tk-btn-cyan\" style=\"flex: 1;\">🎁 Gói Thần Khí 7-8</button>\n                <button id=\"btn-all-items\" class=\"tk-btn tk-btn-purple\" style=\"flex: 1;\">🌟 Đủ 422 Món</button>\n                <button id=\"btn-bag-99\" class=\"tk-btn\" title=\"Đặt mọi món đang có = 99\">x99</button>\n            </div>\n\n            <details class=\"tk-sub-details\">\n                <summary>🛡️ Gán Nhanh 6 Ô Pháp Bảo Trang Bị & Sức Chứa Túi</summary>\n                <div class=\"tk-sub-body\">\n                    <div class=\"tk-row\"><span class=\"tk-lbl\">Ô Túi Thêm:</span><input type=\"number\" id=\"eq-otui\" class=\"tk-inp\" value=\"150\"></div>\n                    <div class=\"tk-row\"><span class=\"tk-lbl\">1. Trữ Vật:</span><input type=\"text\" id=\"eq-truvat\" class=\"tk-inp\" value=\"item.can_khon_gioi\"></div>\n                    <div class=\"tk-row\"><span class=\"tk-lbl\">2. Dị Hỏa:</span><input type=\"text\" id=\"eq-dihoa\" class=\"tk-inp\" value=\"item.cuu_u_hoang_hoa\"></div>\n                    <div class=\"tk-row\"><span class=\"tk-lbl\">3. Phi Hành:</span><input type=\"text\" id=\"eq-dilai\" class=\"tk-inp\" value=\"item.phu_dieu_si\"></div>\n                    <div class=\"tk-row\"><span class=\"tk-lbl\">4. Đan Lô:</span><input type=\"text\" id=\"eq-danlo\" class=\"tk-inp\" value=\"item.dan_lo_tien\"></div>\n                    <div class=\"tk-row\"><span class=\"tk-lbl\">5. Phù Bút:</span><input type=\"text\" id=\"eq-phubut\" class=\"tk-inp\" value=\"item.phu_but_tien\"></div>\n                    <div class=\"tk-row\"><span class=\"tk-lbl\">6. Khí Lô:</span><input type=\"text\" id=\"eq-khilo\" class=\"tk-inp\" value=\"item.khi_lo_tien\"></div>\n                    <button id=\"btn-save-equip\" class=\"tk-btn\" style=\"width: 100%; margin-top: 4px;\">💾 Lưu 6 Ô Trang Bị</button>\n                </div>\n            </details>\n        </div>\n    </div>\n\n    <div class=\"tk-acc\">\n        <div class=\"tk-acc-hdr\">\n            <span>🛠️ 3. Nghề Nghiệp, Đan Phương & Kinh Mạch</span>\n            <span class=\"tk-acc-arrow\">▾</span>\n        </div>\n        <div class=\"tk-acc-bdy\">\n            <div style=\"font-size: 11px; border-bottom: 1px solid #222738; padding-bottom: 5px; margin-bottom: 6px; color: #94a3b8;\">\n                <div>• Chế Phù: Bậc <b id=\"lbl-phu-bac\" style=\"color:#e5b869;\">0</b> | KN <b id=\"lbl-phu-kn\" style=\"color:#fff;\">0</b></div>\n                <div>• Luyện Đan: Bậc <b id=\"lbl-dan-bac\" style=\"color:#e5b869;\">0</b> | KN <b id=\"lbl-dan-kn\" style=\"color:#fff;\">0</b></div>\n                <div>• Luyện Bảo: Bậc <b id=\"lbl-bao-bac\" style=\"color:#e5b869;\">0</b> | KN <b id=\"lbl-bao-kn\" style=\"color:#fff;\">0</b></div>\n            </div>\n\n            <div class=\"tk-row\">\n                <select id=\"select-nghe\" class=\"tk-inp\">\n                    <option value=\"che_phu\">Chế Phù (Phù Lục)</option>\n                    <option value=\"luyen_dan\">Luyện Đan</option>\n                    <option value=\"luyen_bao\">Luyện Bảo (Luyện Khí)</option>\n                </select>\n            </div>\n            <div class=\"tk-row\">\n                <span class=\"tk-lbl\">Bậc / KN:</span>\n                <input type=\"number\" id=\"input-nghe-bac\" class=\"tk-inp\" placeholder=\"Bậc (4)\" value=\"4\">\n                <input type=\"number\" id=\"input-nghe-kn\" class=\"tk-inp\" placeholder=\"KN (9999)\" value=\"9999\">\n                <button id=\"btn-set-nghe\" class=\"tk-btn\">Cập Nhật</button>\n            </div>\n            <div style=\"display: flex; flex-direction: column; gap: 5px; margin-top: 6px;\">\n                <button id=\"btn-max-all-nghe\" class=\"tk-btn tk-btn-cyan\">📜 Tông Sư 3 Nghề + Thuộc 101 Đan Phương</button>\n                <button id=\"btn-max-meridian\" class=\"tk-btn\">🌀 Thông Kinh Mạch (99 Lượt) + 87 Kỹ Pháp</button>\n                <details class=\"tk-sub-details\" open>\n                    <summary>✨ Sơ Đồ Huyệt </summary>\n                    <div class=\"tk-sub-body\" style=\"max-height: none;\">\n                        <div style=\"font-size: 10px; color: #94a3b8; margin-bottom: 6px; text-align: center;\">Ô trống: Không hiện | Ô đỏ (Đ): Đan Điền | Ô vàng: Huyệt vị</div>\n                        <div id=\"huyet-grid-container\" style=\"display: grid; gap: 2px; margin-bottom: 6px; justify-content: center;\"></div>\n                        <div style=\"display: flex; gap: 4px;\">\n                            <button id=\"btn-save-selected-huyet\" class=\"tk-btn\" style=\"flex: 1;\">Gán / Gỡ</button>\n                            <button id=\"btn-select-all-huyet\" class=\"tk-btn\" style=\"background: #334155; color: #fff;\">Chọn Hết</button>\n                        </div>\n                    </div>\n                </details>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"tk-acc\">\n        <div class=\"tk-acc-hdr\">\n            <span>📈 4. Cảnh Giới, Kim Đan, Ý Cảnh & Dị Tượng</span>\n            <span class=\"tk-acc-arrow\">▾</span>\n        </div>\n        <div class=\"tk-acc-bdy\">\n            <div class=\"tk-row\">\n                <span class=\"tk-lbl\">Đại Cảnh Giới:</span>\n                <input type=\"number\" id=\"input-canh-gioi\" class=\"tk-inp\" placeholder=\"0=Phàm.. 5=Hóa Thần\">\n                <select id=\"select-tieu-cg\" class=\"tk-inp\">\n                    <option value=\"0\">0 - Sơ kỳ</option>\n                    <option value=\"1\">1 - Trung kỳ</option>\n                    <option value=\"2\">2 - Hậu kỳ</option>\n                    <option value=\"3\" selected>3 - Viên mãn</option>\n                </select>\n                <button id=\"btn-canh-gioi\" class=\"tk-btn\">Gán</button>\n            </div>\n            <div class=\"tk-row\">\n                <span class=\"tk-lbl\">Kim Đan / Ý:</span>\n                <select id=\"select-kimdan\" class=\"tk-inp\">\n                    <option value=\"1\">Kim Đan Nhất Phẩm</option>\n                    <option value=\"2\">Nhị Phẩm</option>\n                    <option value=\"3\">Tam Phẩm</option>\n                    <option value=\"4\">Tứ Phẩm</option>\n                    <option value=\"5\">Ngũ Phẩm</option>\n                </select>\n                <select id=\"select-ycanh\" class=\"tk-inp\">\n                    <option value=\"Kiếm ý\">Kiếm ý</option>\n                    <option value=\"Lôi ý\">Lôi ý</option>\n                    <option value=\"Băng ý\">Băng ý</option>\n                    <option value=\"Phong ý\">Phong ý</option>\n                    <option value=\"Từ bi\">Từ bi</option>\n                    <option value=\"Hư vô ý\">Hư vô ý</option>\n                    <option value=\"Hỏa ý\">Hỏa ý</option>\n                </select>\n            </div>\n            <div class=\"tk-row\">\n                <span class=\"tk-lbl\">Dị Tượng / Túc:</span>\n                <select id=\"select-dituong\" class=\"tk-inp\">\n                    <option value=\"kim\">Kiếm Anh (Kim)</option>\n                    <option value=\"loi\">Lôi Anh (Lôi)</option>\n                    <option value=\"bang\">Băng Anh (Băng)</option>\n                    <option value=\"phong\">Phong Anh</option>\n                    <option value=\"hoa\">Xích Diễm Anh</option>\n                    <option value=\"moc\">Thanh Liên Anh</option>\n                    <option value=\"thuy\">Huyền Thủy Anh</option>\n                    <option value=\"tho\">Hậu Thổ Anh</option>\n                </select>\n                <input type=\"number\" id=\"input-tuctue\" class=\"tk-inp\" step=\"0.1\" value=\"1.0\" style=\"max-width: 60px;\">\n                <button id=\"btn-extra-realm\" class=\"tk-btn\">Lưu</button>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"tk-acc\">\n        <div class=\"tk-acc-hdr\">\n            <span>🧬 5. Thể Chất (An Toàn) & Linh Căn</span>\n            <span class=\"tk-acc-arrow\">▾</span>\n        </div>\n        <div class=\"tk-acc-bdy\">\n            <div class=\"tk-row\">\n                <select id=\"select-thechat\" class=\"tk-inp\">\n                    <option value=\"the_chat.hoang_co\">👑 Hoang Cổ Thánh Thể (121 ô)</option>\n                    <option value=\"the_chat.cuu_am\">❄️ Cửu Âm Tuyệt Mạch (Băng)</option>\n                    <option value=\"the_chat.kiem_cot\">⚔️ Kiếm Cốt Thể (Kiếm +25%)</option>\n                    <option value=\"the_chat.bach_thao\">🌿 Bách Thảo Thể (Đan tu)</option>\n                    <option value=\"the_chat.thiet_cot\">🛡️ Thiết Cốt Thể (Khí huyết)</option>\n                    <option value=\"the_chat.pham_the\">👤 Phàm Thể</option>\n                </select>\n                <button id=\"btn-thechat\" class=\"tk-btn\">Gán Thể Chất</button>\n            </div>\n\n            <div style=\"margin-top: 6px; padding-top: 6px; border-top: 1px dashed #262c40;\">\n                <div style=\"display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; font-size: 11px; margin-bottom: 6px;\">\n                    <label><input type=\"checkbox\" name=\"linhcan-he\" value=\"kim\"> ⚔️Kim</label>\n                    <label><input type=\"checkbox\" name=\"linhcan-he\" value=\"moc\"> 🌿Mộc</label>\n                    <label><input type=\"checkbox\" name=\"linhcan-he\" value=\"thuy\"> 💧Thủy</label>\n                    <label><input type=\"checkbox\" name=\"linhcan-he\" value=\"hoa\"> 🔥Hỏa</label>\n                    <label><input type=\"checkbox\" name=\"linhcan-he\" value=\"tho\"> ⛰️Thổ</label>\n                    <label style=\"color: #70dbff;\"><input type=\"checkbox\" name=\"linhcan-he\" value=\"bang\"> ❄️Băng</label>\n                    <label style=\"color: #aaffaa;\"><input type=\"checkbox\" name=\"linhcan-he\" value=\"phong\"> 🌪️Phong</label>\n                    <label style=\"color: #ffff70;\"><input type=\"checkbox\" name=\"linhcan-he\" value=\"loi\"> ⚡Lôi</label>\n                </div>\n                <div style=\"display: flex; gap: 4px;\">\n                    <button id=\"btn-gan-linhcan\" class=\"tk-btn\" style=\"flex: 1;\">🌱 Gán Linh Căn & Tô Màu Mạch</button>\n                    <button id=\"btn-go-linhcan\" class=\"tk-btn tk-btn-purple\">Gỡ (Vô)</button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"tk-acc\">\n        <div class=\"tk-acc-hdr\">\n            <span>📊 6. Thất Đại Chỉ Số Tu Chân</span>\n            <span class=\"tk-acc-arrow\">▾</span>\n        </div>\n        <div class=\"tk-acc-bdy\">\n            <div class=\"tk-row\"><span class=\"tk-lbl\">💡 Ngộ tính:</span><input type=\"number\" id=\"input-ngo-tinh\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-ngo-tinh\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">🦴 Căn cốt:</span><input type=\"number\" id=\"input-can-cot\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-can-cot\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">🧘 Đạo tâm:</span><input type=\"number\" id=\"input-dao-tam\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-dao-tam\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">⚡ Thân pháp:</span><input type=\"number\" id=\"input-than-phap\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-than-phap\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">🍀 Khí vận:</span><input type=\"number\" id=\"input-khi-van\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-khi-van\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">👹 Tâm ma:</span><input type=\"number\" id=\"input-tam-ma\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-tam-ma\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">👁️ Thần thức:</span><input type=\"number\" id=\"input-than-thuc\" class=\"tk-inp\" placeholder=\"Đang tải...\"><button id=\"btn-than-thuc\" class=\"tk-btn\">Gán</button></div>\n            <div style=\"display: flex; gap: 5px; margin-top: 6px;\">\n                <button id=\"btn-stat-200\" class=\"tk-btn tk-btn-cyan\" style=\"flex: 1;\">⚡ Toàn Bộ = 200</button>\n                <button id=\"btn-stat-600\" class=\"tk-btn\" style=\"flex: 1;\">🔥 Toàn Bộ = 600</button>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"tk-acc\">\n        <div class=\"tk-acc-hdr\">\n            <span>🌌 7. Điểm Luân Hồi, Lão Đò & Thành Tựu</span>\n            <span class=\"tk-acc-arrow\">▾</span>\n        </div>\n        <div class=\"tk-acc-bdy\">\n            <div class=\"tk-row\"><span class=\"tk-lbl\">Điểm Luân Hồi:</span><input type=\"number\" id=\"input-dlh\" class=\"tk-inp\" placeholder=\"999999\"><button id=\"btn-dlh\" class=\"tk-btn\">Gán</button></div>\n            <div class=\"tk-row\"><span class=\"tk-lbl\">Số Kiếp:</span><input type=\"number\" id=\"input-kiep\" class=\"tk-inp\" placeholder=\"38\"><button id=\"btn-kiep\" class=\"tk-btn\">Gán</button></div>\n            <button id=\"btn-max-luanhoi\" class=\"tk-btn tk-btn-purple\" style=\"width: 100%; margin-top: 4px;\">🌌 Max 999,999 Điểm + Mở 17 Lão Đò & 28 Thành Tựu</button>\n        </div>\n    </div>\n</div>\n";
    /* 5. KHỞI TẠO BẢNG MOD TRỰC TIẾP */
    function initCheatPanel() {
        var oldPanel = document.getElementById('tu-tien-floating-panel');
        if (oldPanel && oldPanel.parentNode) oldPanel.parentNode.removeChild(oldPanel);

        var panel = document.createElement('div');
        panel.id = 'tu-tien-floating-panel';

        function renderPanel(minimized) {
            if (minimized) {
                panel.style.width = 'auto';
                panel.style.padding = '7px 11px';
                panel.innerHTML = MIN_PANEL_HTML;
                document.getElementById('p-exp').onclick = function() { renderPanel(false); };
                return;
            }

            panel.style.width = '355px';
            panel.style.padding = '12px';
            panel.innerHTML = FULL_PANEL_HTML;

            document.getElementById('p-tgl').onclick = function() { renderPanel(true); };
            document.getElementById('p-cls').onclick = function() {
                if (panel.parentNode) panel.parentNode.removeChild(panel);
            };

            var hdrList = panel.querySelectorAll('.tk-acc-hdr');
            for (var hi = 0; hi < hdrList.length; hi++) {
                (function(hdr) {
                    hdr.onclick = function() {
                        var acc = hdr.parentElement;
                        var wasOpen = acc.classList.contains('open');
                        var allAcc = panel.querySelectorAll('.tk-acc');
                        for (var j = 0; j < allAcc.length; j++) {
                            allAcc[j].classList.remove('open');
                        }
                        if (!wasOpen) acc.classList.add('open');
                    };
                })(hdrList[hi]);
            }
    /* ================= DROPDOWN VẬT PHẨM THÔNG MINH ================= */
            var boxEl = document.getElementById('custom-select-box');
            var labelEl = document.getElementById('custom-select-label');
            var listEl = document.getElementById('custom-dropdown-list');
            var optsEl = document.getElementById('custom-dropdown-options');
            var searchEl = document.getElementById('input-item-search');
            var catEl = document.getElementById('select-item-cat');

            boxEl.onclick = function(e) {
                e.stopPropagation();
                var show = listEl.style.display === 'none';
                listEl.style.display = show ? 'block' : 'none';
                if (show) {
                    loadAllItems();
                    if (searchEl) searchEl.focus();
                }
            };
            if (searchEl) {
                searchEl.onclick = function(e) { e.stopPropagation(); };
                searchEl.oninput = function() { loadAllItems(); };
            }
            if (catEl) {
                catEl.onchange = function() {
                    loadAllItems();
                    listEl.style.display = 'block';
                };
            }
            document.addEventListener('click', function() {
                if (listEl) listEl.style.display = 'none';
            });

            function addCustomOption(itemId) {
                var info = getItemInfo(itemId);
                var optDiv = document.createElement('div');
                optDiv.className = 'vktt-custom-option';

                var titleHtml = '';
                if (info.quality >= 8 || QUALITY_COLORS[info.quality] === 'rainbow') {
                    titleHtml = '<span class="vktt-rainbow-style">[P.' + info.quality + '] ' + info.name + '</span>';
                } else {
                    var color = QUALITY_COLORS[info.quality] || '#a1a1aa';
                    titleHtml = '<span style="color: ' + color + '; font-weight: bold;">[P.' + info.quality + '] ' + info.name + '</span>';
                }
                optDiv.innerHTML = titleHtml + '<span style="color:#64748b; font-size:10px;">' + (info.cat || '') + '</span>';

                optDiv.onclick = function(e) {
                    e.stopPropagation();
                    document.getElementById('input-item-id').value = itemId;
                    labelEl.innerHTML = titleHtml;
                    listEl.style.display = 'none';
                };

                optsEl.appendChild(optDiv);
            }

            function getAllMergedItemIds() {
                var baseIds = [];
                for (var k in PRESET_ITEMS) {
                    if (Object.prototype.hasOwnProperty.call(PRESET_ITEMS, k)) baseIds.push(k);
                }
                var extraIds = [];
                try {
                    var state = gWin.game.store.getState();
                    var itemObj = state && state.content && state.content.item;
                    if (itemObj) {
                        if (typeof itemObj.forEach === 'function') {
                            itemObj.forEach(function(val, key) {
                                var kStr = String(key);
                                extraIds.push(kStr.indexOf('item.') === 0 ? kStr : ('item.' + kStr));
                            });
                        } else {
                            for (var ik in itemObj) {
                                if (Object.prototype.hasOwnProperty.call(itemObj, ik)) {
                                    extraIds.push(ik.indexOf('item.') === 0 ? ik : ('item.' + ik));
                                }
                            }
                        }
                    }
                } catch(e) {}
                try {
                    var saved = JSON.parse(localStorage.getItem('vktt_custom_items') || '[]');
                    for (var si = 0; si < saved.length; si++) {
                        var sid = saved[si];
                        if (sid) extraIds.push(sid.indexOf('item.') === 0 ? sid : ('item.' + sid));
                    }
                } catch(e) {}
                return uniqueStrings(baseIds, extraIds);
            }

            function loadAllItems() {
                if (!optsEl) return;
                optsEl.innerHTML = '';
                var cat = catEl ? catEl.value : 'ALL';
                var q = (searchEl ? searchEl.value : '').toLowerCase().replace(/^\s+|\s+$/g, '');

                var allIds = getAllMergedItemIds();
                for (var i = 0; i < allIds.length; i++) {
                    var id = allIds[i];
                    var info = getItemInfo(id);
                    if (cat === 'PHAM87' && (info.quality || 1) < 7) continue;
                    if (cat === 'Trữ Vật' && info.cat !== 'Trữ Vật' && info.cat !== 'Phương Tiện') continue;
                    if (cat !== 'ALL' && cat !== 'PHAM87' && cat !== 'Trữ Vật' && info.cat !== cat) continue;
                    if (q && info.name.toLowerCase().indexOf(q) === -1 && id.toLowerCase().indexOf(q) === -1) continue;
                    addCustomOption(id);
                }
            }
            loadAllItems();

            function saveCustomItem(id) {
                if (!id) return;
                try {
                    var saved = JSON.parse(localStorage.getItem('vktt_custom_items') || '[]');
                    var found = false;
                    for (var i = 0; i < saved.length; i++) {
                        if (saved[i] === id) found = true;
                    }
                    if (!found && !PRESET_ITEMS[id]) {
                        saved.push(id);
                        localStorage.setItem('vktt_custom_items', JSON.stringify(saved));
                    }
                } catch(e) {}
            }
    /* ================= CÁC HÀM GHI ĐÈ TRỰC TIẾP VÀO STORE CỦA GAME (CHUẨN GỐC V3.8) ================= */
            function uN(k, v) {
                var run = gWin.game.store.getState().run;
                if (!run || !run.nhanVat) return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
                var patch = {};
                patch[k] = v;
                var nextNv = mergeObj(run.nhanVat, patch);
                gWin.game.store.setState({ run: mergeObj(run, { nhanVat: nextNv }) });
            }

            function uNV(patchObj) {
                var run = gWin.game.store.getState().run;
                if (!run || !run.nhanVat) return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
                var nextNv = mergeObj(run.nhanVat, patchObj);
                gWin.game.store.setState({ run: mergeObj(run, { nhanVat: nextNv }) });
            }

            function uC(k, v) {
                var run = gWin.game.store.getState().run;
                if (!run || !run.nhanVat) return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
                var cs = copyObj(run.nhanVat.chiSo || {});
                cs[k] = v;
                var nextNv = mergeObj(run.nhanVat, { chiSo: cs });
                gWin.game.store.setState({ run: mergeObj(run, { nhanVat: nextNv }) });
            }

            function readValOrPlaceholder(id, fallbackVal) {
                var el = document.getElementById(id);
                if (!el) return fallbackVal;
                var v = parseInt(el.value, 10);
                if (!isNaN(v)) return v;
                var p = parseInt(el.placeholder, 10);
                return !isNaN(p) ? p : fallbackVal;
            }
    /* --- NGĂN 1: TÀI NGUYÊN & MÔN PHÁI --- */
            document.getElementById('btn-ten').onclick = function() {
                var v = (document.getElementById('input-ten').value || '').replace(/^\s+|\s+$/g, '');
                if (v) { uN('ten', v); notify('✅ Đã đổi Đạo Hiệu thành: ' + v); }
            };
            document.getElementById('btn-lt').onclick = function() {
                var v = parseInt(document.getElementById('input-lt').value, 10);
                if (isNaN(v)) v = 999999;
                uN('linhThach', v);
                notify('💎 Đã gán Linh Thạch = ' + v.toLocaleString() + '!');
            };
            document.getElementById('btn-tv').onclick = function() {
                var v = parseInt(document.getElementById('input-tv').value, 10);
                if (isNaN(v)) v = 999999;
                uN('tuVi', v);
                notify('✨ Đã gán Tu Vi = ' + v.toLocaleString() + '!');
            };
            document.getElementById('btn-ch').onclick = function() {
                var v = parseInt(document.getElementById('input-ch').value, 10);
                if (isNaN(v)) v = 99999;
                uN('congHien', v);
                notify('📜 Đã gán Cống Hiến = ' + v.toLocaleString() + '!');
            };
            document.getElementById('btn-ct').onclick = function() {
                var v = parseInt(document.getElementById('input-ct').value, 10);
                if (isNaN(v)) v = 99999;
                var state = gWin.game.store.getState();
                if (!state.run) return notify('⚠️ Hãy vào trong kiếp trước!');
                var run = copyObj(state.run);
                function recursiveAddCongTich(obj) {
                    if (!obj || typeof obj !== 'object') return;
                    if (Object.prototype.hasOwnProperty.call(obj, 'congTich') && typeof obj.congTich === 'number') {
                        obj.congTich = v;
                    }
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === 'object' && obj[key] !== null) {
                            recursiveAddCongTich(obj[key]);
                        }
                    }
                }
                recursiveAddCongTich(run);
                if (run.tongMon) run.tongMon = mergeObj(run.tongMon, { congTich: v });
                gWin.game.store.setState({ run: run });
                notify('🏛️ Đã gán ' + v.toLocaleString() + ' điểm Công Tích! Hãy Cáo lui rồi mở lại Chấp sự đường.');
            };
            document.getElementById('btn-tnt').onclick = function() {
                var v = parseInt(document.getElementById('input-tnt').value, 10);
                if (isNaN(v)) v = 5000;
                uN('thoNguyenThem', v);
                notify('⏳ Đã gán Thọ Nguyên Thêm = +' + v + ' năm!');
            };
            document.getElementById('btn-tuoi').onclick = function() {
                var v = parseInt(document.getElementById('input-tuoi').value, 10);
                if (isNaN(v)) v = 18;
                uN('tuoi', v);
                notify('⏳ Đã gán Tuổi = ' + v + '!');
            };
            document.getElementById('btn-capbac').onclick = function() {
                var cb = parseInt(document.getElementById('select-capbac').value, 10);
                var state = gWin.game.store.getState();
                if (!state.run) return;
                var run = copyObj(state.run);
                run.tongMon = mergeObj(run.tongMon || { slot: "slot.1115", congTich: 5000 }, { capBac: cb });
                gWin.game.store.setState({ run: run });
                notify('🏛️ Đã gán Chức Vị Tông Môn = Cấp ' + cb + '!');
            };
    /* --- NGĂN 2: VẬT PHẨM & 6 Ô TRANG BỊ --- */
            document.getElementById('btn-add-item').onclick = function() {
                var itemId = (document.getElementById('input-item-id').value || '').replace(/^\s+|\s+$/g, '');
                var count = parseInt(document.getElementById('input-item-sl').value, 10) || 1;
                if (!itemId) return notify('⚠️ Vui lòng bấm chọn hoặc nhập ID vật phẩm!');
                if (itemId.indexOf('item.') !== 0) itemId = 'item.' + itemId;

                try {
                    var store = gWin.game.store;
                    var state = store.getState();
                    var run = state.run;
                    var nhanVat = copyObj(run.nhanVat);
                    var tuiDo = copyObj(nhanVat.tuiDo || {});

                    tuiDo[itemId] = (tuiDo[itemId] || 0) + count;
                    nhanVat.tuiDo = tuiDo;
                    nhanVat.oTuiThem = Math.max(nhanVat.oTuiThem || 0, 100);
                    nhanVat.xepTui = buildSyncedXepTui(nhanVat.xepTui, tuiDo);

                    store.setState({ run: mergeObj(run, { nhanVat: nhanVat }) });
                    saveCustomItem(itemId);
                    notify('🎁 Đã thêm +' + count + ' [' + getItemInfo(itemId).name + '] vào túi đồ!');
                } catch(err) {
                    notify('❌ Thêm vật phẩm thất bại!');
                }
            };

            function applyGodPack() {
                var store = gWin.game.store;
                var run = store.getState().run;
                if (!run || !run.nhanVat) return;
                var nhanVat = copyObj(run.nhanVat);
                var tuiDo = copyObj(nhanVat.tuiDo || {});

                for (var id in PRESET_ITEMS) {
                    if (Object.prototype.hasOwnProperty.call(PRESET_ITEMS, id)) {
                        var info = PRESET_ITEMS[id];
                        if (info.quality >= 7) {
                            var q = (info.cat === 'Đan Dược' || info.cat === 'Linh Dược' || info.cat === 'Khoáng Thạch & Yêu Đan') ? 99 : 1;
                            tuiDo[id] = Math.max(tuiDo[id] || 0, q);
                        }
                    }
                }
                nhanVat.tuiDo = tuiDo;
                nhanVat.oTuiThem = Math.max(nhanVat.oTuiThem || 0, 150);
                nhanVat.xepTui = buildSyncedXepTui(nhanVat.xepTui, tuiDo);
                nhanVat.trangBi = mergeObj(nhanVat.trangBi || {}, {
                    tru_vat: "item.can_khon_gioi",
                    di_hoa: "item.cuu_u_hoang_hoa",
                    di_lai: "item.phu_dieu_si",
                    luyen_dan: "item.dan_lo_tien",
                    che_phu: "item.phu_but_tien",
                    luyen_bao: "item.khi_lo_tien"
                });
                store.setState({ run: mergeObj(run, { nhanVat: nhanVat }) });
                notify('🎁 Đã trang bị 6 Ô Thần Khí & thêm trọn bộ Tiên Vật Phẩm 7-8!');
            }

            document.getElementById('btn-god-pack').onclick = applyGodPack;

            document.getElementById('btn-all-items').onclick = function() {
                var store = gWin.game.store;
                var run = store.getState().run;
                if (!run || !run.nhanVat) return;
                var nhanVat = copyObj(run.nhanVat);
                var tuiDo = copyObj(nhanVat.tuiDo || {});

                var allIds = getAllMergedItemIds();
                for (var i = 0; i < allIds.length; i++) {
                    var id = allIds[i];
                    var info = getItemInfo(id);
                    var q = (info.cat === 'Đan Dược' || info.cat === 'Linh Dược' || info.cat === 'Phù Lục' || info.cat === 'Khoáng Thạch & Yêu Đan') ? 50 : 1;
                    tuiDo[id] = Math.max(tuiDo[id] || 0, q);
                }
                nhanVat.tuiDo = tuiDo;
                nhanVat.oTuiThem = Math.max(nhanVat.oTuiThem || 0, 350);
                nhanVat.xepTui = buildSyncedXepTui(nhanVat.xepTui, tuiDo);
                store.setState({ run: mergeObj(run, { nhanVat: nhanVat }) });
                notify('🌟 Đã thêm trọn bộ 422+ vật phẩm vào túi đồ (+350 ô túi)!');
            };

            document.getElementById('btn-bag-99').onclick = function() {
                var store = gWin.game.store;
                var run = store.getState().run;
                if (!run || !run.nhanVat) return;
                var nhanVat = copyObj(run.nhanVat);
                var tuiDo = copyObj(nhanVat.tuiDo || {});
                for (var k in tuiDo) {
                    if (Object.prototype.hasOwnProperty.call(tuiDo, k)) tuiDo[k] = 99;
                }
                nhanVat.tuiDo = tuiDo;
                store.setState({ run: mergeObj(run, { nhanVat: nhanVat }) });
                notify('🔢 Đã đặt số lượng mọi vật phẩm đang có trong túi = 99!');
            };

            document.getElementById('btn-save-equip').onclick = function() {
                var store = gWin.game.store;
                var run = store.getState().run;
                if (!run || !run.nhanVat) return;
                var nhanVat = copyObj(run.nhanVat);
                var tb = copyObj(nhanVat.trangBi || {});
                var mapEq = {
                    tru_vat: 'eq-truvat', di_hoa: 'eq-dihoa', di_lai: 'eq-dilai',
                    luyen_dan: 'eq-danlo', che_phu: 'eq-phubut', luyen_bao: 'eq-khilo'
                };
                for (var slot in mapEq) {
                    if (Object.prototype.hasOwnProperty.call(mapEq, slot)) {
                        var val = (document.getElementById(mapEq[slot]).value || '').replace(/^\s+|\s+$/g, '');
                        if (val) tb[slot] = val; else delete tb[slot];
                    }
                }
                nhanVat.trangBi = tb;
                nhanVat.oTuiThem = parseInt(document.getElementById('eq-otui').value || '150', 10);
                store.setState({ run: mergeObj(run, { nhanVat: nhanVat }) });
                notify('🛡️ Đã lưu cấu hình 6 Ô Pháp Bảo Trang Bị & Sức Chứa Túi!');
            };
    /* --- NGĂN 3: NGHỀ NGHIỆP, ĐAN PHƯƠNG & KINH MẠCH --- */
            document.getElementById('select-nghe').onchange = function() {
                try {
                    var ngheKey = document.getElementById('select-nghe').value;
                    var run = gWin.game.store.getState().run;
                    var ngheObj = (run.nhanVat && run.nhanVat.nghe && run.nhanVat.nghe[ngheKey]) || { bac: 0, kinhNghiem: 0 };
                    document.getElementById('input-nghe-bac').value = ngheObj.bac !== undefined ? ngheObj.bac : 0;
                    document.getElementById('input-nghe-kn').value = ngheObj.kinhNghiem !== undefined ? ngheObj.kinhNghiem : 0;
                } catch(e) {}
            };

            document.getElementById('btn-set-nghe').onclick = function() {
                var ngheKey = document.getElementById('select-nghe').value;
                var bacVal = capVal(document.getElementById('input-nghe-bac').value, 5, 0);
                var knVal = capVal(document.getElementById('input-nghe-kn').value, 99999, 0);
                document.getElementById('input-nghe-bac').value = bacVal;
                document.getElementById('input-nghe-kn').value = knVal;

                try {
                    var store = gWin.game.store;
                    var run = store.getState().run;
                    var nhanVat = copyObj(run.nhanVat);
                    var ngheObj = copyObj(nhanVat.nghe || {});
                    var currentNghe = copyObj(ngheObj[ngheKey] || { bac: 0, kinhNghiem: 0 });

                    currentNghe.bac = bacVal;
                    currentNghe.kinhNghiem = knVal;

                    ngheObj[ngheKey] = currentNghe;
                    nhanVat.nghe = ngheObj;
                    store.setState({ run: mergeObj(run, { nhanVat: nhanVat }) });
                    notify('🛠️ Đã cập nhật [' + ngheKey + '] -> Bậc: ' + currentNghe.bac + ', KN: ' + currentNghe.kinhNghiem);
                } catch(e) {
                    notify('❌ Cập nhật nghề thất bại!');
                }
            };

            function applyMaxCraftAndRecipes() {
                var store = gWin.game.store;
                var run = store.getState().run;
                if (!run || !run.nhanVat) return;
                var nhanVat = copyObj(run.nhanVat);
                nhanVat.nghe = {
                    luyen_dan: { bac: 4, kinhNghiem: 9999 },
                    che_phu: { bac: 4, kinhNghiem: 9999 },
                    luyen_bao: { bac: 4, kinhNghiem: 9999 }
                };
                nhanVat.donPhuong = uniqueStrings(nhanVat.donPhuong || [], ALL_RECIPES);
                store.setState({ run: mergeObj(run, { nhanVat: nhanVat }) });
                notify('📜 Đã lên Tông Sư 3 Nghề & thuộc toàn bộ 101 Đan Phương / Đồ Phổ!');
            }

            document.getElementById('btn-max-all-nghe').onclick = applyMaxCraftAndRecipes;

            function applyMaxMeridianAndSkills() {
                var store = gWin.game.store;
                var state = store.getState();
                var run = state.run;
                if (!run || !run.nhanVat) return;
                var nhanVat = copyObj(run.nhanVat);
                var oldKm = copyObj(nhanVat.kinhMach || {});
                var trangThai = [];
                if (oldKm.trangThai && oldKm.trangThai.length) {
                    for (var i = 0; i < oldKm.trangThai.length; i++) trangThai.push("thong");
                }
                var mau = oldKm.mau ? oldKm.mau.slice() : [];
                var heList = (nhanVat.linhCan && nhanVat.linhCan.he && nhanVat.linhCan.he.length) ? nhanVat.linhCan.he : ['kim'];
                for (var j = 0; j < mau.length; j++) {
                    if (mau[j] === 'vo_sac') mau[j] = heList[j % heList.length];
                }
                oldKm.mau = mau;
                oldKm.trangThai = trangThai;
                oldKm.daLinhNgo = uniqueStrings(oldKm.daLinhNgo || [], ALL_TOP_SKILLS);
                oldKm.cho = { mo: 99, doiMau: 99 };
                nhanVat.kinhMach = oldKm;
                store.setState({ run: mergeObj(run, { nhanVat: nhanVat }) });
                notify('🌀 Đã mở thông toàn bộ Kinh Mạch (99 Lượt) & lĩnh ngộ 87 Kỹ Pháp!');
            }

            document.getElementById('btn-max-meridian').onclick = applyMaxMeridianAndSkills;

            // Khởi tạo Sơ đồ lưới huyệt trực quan
            renderHuyetGrid();

            document.getElementById('btn-select-all-huyet').onclick = function() {
                var chks = document.querySelectorAll('.huyet-checkbox');
                var allChecked = chks.length > 0;
                for (var i = 0; i < chks.length; i++) {
                    if (!chks[i].checked) {
                        allChecked = false;
                        break;
                    }
                }
                var targetState = !allChecked;
                for (var j = 0; j < chks.length; j++) {
                    chks[j].checked = targetState;
                    var lbl = chks[j].parentElement;
                    if (lbl && lbl.dataset.type === 'huyet') {
                        lbl.style.background = targetState ? '#e5b869' : '#1b2132';
                        lbl.style.color = targetState ? '#000' : '#e5b869';
                    }
                }
            };

            document.getElementById('btn-save-selected-huyet').onclick = function() {
                try {
                    var run = gWin.game.store.getState().run;
                    if (!run || !run.nhanVat) return notify('⚠️ Hãy bước vào trong kiếp tu tiên trước!');
                    var nv = copyObj(run.nhanVat);
                    var km = copyObj(nv.kinhMach || {});
                    var chks = document.querySelectorAll('.huyet-checkbox');
                    var selectedList = [];
                    for (var i = 0; i < chks.length; i++) {
                        if (chks[i].checked) selectedList.push(parseInt(chks[i].value, 10));
                    }
                    km.huyetThem = selectedList;
                    if (Array.isArray(km.trangThai)) {
                        km.trangThai = km.trangThai.map(function() { return "thong"; });
                    }
                    km.cho = { mo: 99, doiMau: 99 };
                    nv.kinhMach = km;
                    gWin.game.store.setState({ run: mergeObj(run, { nhanVat: nv }) });
                    notify('✅ Đã Gán / Gỡ đồng bộ sơ đồ lưới huyệt (' + selectedList.length + ' huyệt)!');
                } catch(e) {
                    notify('❌ Lỗi khi Gán / Gỡ huyệt đạo!');
                }
            };
    /* --- NGĂN 4: CẢNH GIỚI, KIM ĐAN, Ý CẢNH & DỊ TƯỢNG --- */
            document.getElementById('btn-canh-gioi').onclick = function() {
                var cg = readValOrPlaceholder('input-canh-gioi', 5);
                var tcg = parseInt(document.getElementById('select-tieu-cg').value, 10) || 0;
                uNV({ canhGioi: cg, tieuCanhGioi: tcg, binhCanh: 0 });
                notify('📈 Đã cập nhật Cảnh Giới = ' + cg + '.' + tcg + ' (Xóa Bình Cảnh)!');
            };

            document.getElementById('btn-extra-realm').onclick = function() {
                var kd = parseInt(document.getElementById('select-kimdan').value, 10) || 1;
                var yc = document.getElementById('select-ycanh').value;
                var dt = document.getElementById('select-dituong').value;
                var tt = parseFloat(document.getElementById('input-tuctue').value);
                var patch = { kimDan: kd, yCanh: yc, diTuong: dt };
                if (!isNaN(tt)) patch.tucTue = tt;
                uNV(patch);
                notify('✨ Đã lưu Kim Đan (' + kd + '), ' + yc + ', Dị Tượng (' + dt + ')!');
            };
    /* --- NGĂN 5: THỂ CHẤT (DÙNG gWin.Kg GỐC V3.8 + BẢO TOÀN KỸ PHÁP) & LINH CĂN --- */
            document.getElementById('btn-thechat').onclick = function() {
                var val = document.getElementById('select-thechat').value;
                if (!val) return;

                var store = gWin.game.store;
                var state = store.getState();
                var run = state.run;
                if (!run || !run.nhanVat) return;
                var content = state.content;

                var updatedNhanVat = JSON.parse(JSON.stringify(run.nhanVat));
                var oldKm = updatedNhanVat.kinhMach || {};
                updatedNhanVat.theChat = val;

                try {
                    var tcData = null;
                    if (content && content.theChat) {
                        tcData = typeof content.theChat.get === 'function' ? content.theChat.get(val) : content.theChat[val];
                    }

                    var vungArr = [];
                    var rong = 11, cao = 11;
                    if (tcData) {
                        var tcBase = (typeof gWin.Kg === 'function') ? gWin.Kg(tcData) : tcData;
                        vungArr = tcBase.vung || tcData.vung || [];
                        rong = tcBase.rong || tcData.rong || 11;
                        cao = tcBase.cao || tcData.cao || 11;
                        if (tcBase.thienPhu || tcData.thienPhu) {
                            updatedNhanVat.thienPhuTheChat = tcBase.thienPhu || tcData.thienPhu;
                        }
                    }
                    if (!vungArr.length && THE_CHAT_DB[val]) {
                        var fb = parseKhuonFallback(THE_CHAT_DB[val].khuon);
                        vungArr = fb.vung;
                        rong = fb.rong;
                        cao = fb.cao;
                    }

                    if (vungArr.length) {
                        var heList = (updatedNhanVat.linhCan && updatedNhanVat.linhCan.he && updatedNhanVat.linhCan.he.length)
                            ? updatedNhanVat.linhCan.he
                            : ['vo_sac'];
                        var newTrangThai = [];
                        var newMau = [];
                        for (var i = 0; i < vungArr.length; i++) {
                            newTrangThai.push("thong");
                            newMau.push(vungArr[i] < 0 ? "vo_sac" : heList[i % heList.length]);
                        }

                        var keptManh = [];
                        if (oldKm.manh && oldKm.manh.length) {
                            for (var mi = 0; mi < oldKm.manh.length; mi++) {
                                var m = oldKm.manh[mi];
                                if (m.x < rong && m.y < cao) keptManh.push(m);
                            }
                        }
                        var keptSkills = uniqueStrings(oldKm.daLinhNgo || [], ALL_TOP_SKILLS);

                        updatedNhanVat.kinhMach = {
                            mau: newMau,
                            trangThai: newTrangThai,
                            huyetThem: oldKm.huyetThem || [],
                            manh: keptManh,
                            daLinhNgo: keptSkills,
                            cho: { mo: 99, doiMau: 99 }
                        };
                    }
                } catch (err) {}

                store.setState({
                    run: mergeObj(run, { nhanVat: updatedNhanVat })
                });

                var tcName = (THE_CHAT_DB[val] && THE_CHAT_DB[val].ten) ? THE_CHAT_DB[val].ten : val;
                renderHuyetGrid();
                notify('🧬 Đã gán ' + tcName + ', thông toàn bộ Kinh Mạch & bảo toàn Kỹ Pháp!');
            };

            gWin._isUpdatingLinhCan = false;
            document.getElementById('btn-gan-linhcan').onclick = function() {
                var sel = [];
                var cbs = document.querySelectorAll('input[name="linhcan-he"]:checked');
                for (var i = 0; i < cbs.length; i++) sel.push(cbs[i].value);
                if (!sel.length) return notify('⚠️ Chọn ít nhất 1 hệ Linh Căn!');

                var bd = false;
                for (var j = 0; j < sel.length; j++) {
                    if (sel[j] === 'bang' || sel[j] === 'phong' || sel[j] === 'loi') bd = true;
                }
                var np = 'tap', tl = 1.0, dp = 0;
                if (bd) { np = 'bien_di'; tl = 1.2; dp = 0.05; }
                else if (sel.length === 1) { np = 'thien'; tl = 1.3; dp = 0.1; }
                else if (sel.length === 2) { np = 'song'; tl = 1.0; }
                else { np = 'tap'; tl = 0.8; dp = -0.05; }

                gWin._isUpdatingLinhCan = true;
                var run = gWin.game.store.getState().run;
                var nv = copyObj(run.nhanVat);
                if (nv.kinhMach && nv.kinhMach.mau) {
                    var km = copyObj(nv.kinhMach);
                    var newMau = [];
                    for (var mi = 0; mi < km.mau.length; mi++) {
                        newMau.push(km.mau[mi] === 'vo_sac' ? 'vo_sac' : sel[mi % sel.length]);
                    }
                    km.mau = newMau;
                    nv.kinhMach = km;
                }
                nv.linhCan = mergeObj(nv.linhCan || {}, { pham: np, he: sel, isBienDi: bd, tuLuyen: tl, dotPha: dp });
                gWin.game.store.setState({ run: mergeObj(run, { nhanVat: nv }) });
                setTimeout(function() { gWin._isUpdatingLinhCan = false; }, 1500);
                notify('🌱 Đã gán Linh Căn ' + np.toUpperCase() + ' (' + sel.join(',') + ') & đồng bộ màu mạch!');
            };

            document.getElementById('btn-go-linhcan').onclick = function() {
                gWin._isUpdatingLinhCan = true;
                var run = gWin.game.store.getState().run;
                var nv = copyObj(run.nhanVat);
                nv.linhCan = mergeObj(nv.linhCan || {}, { pham: 'vo', he: [], isBienDi: false, tuLuyen: 0.5, dotPha: 0 });
                gWin.game.store.setState({ run: mergeObj(run, { nhanVat: nv }) });
                var cbs = document.querySelectorAll('input[name="linhcan-he"]');
                for (var i = 0; i < cbs.length; i++) cbs[i].checked = false;
                setTimeout(function() { gWin._isUpdatingLinhCan = false; }, 1500);
                notify('🌱 Đã gỡ về Vô Linh Căn!');
            };
    /* --- NGĂN 6: CHỈ SỐ --- */
            var statKeys = ['ngo_tinh', 'can_cot', 'dao_tam', 'than_phap', 'khi_van', 'tam_ma', 'than_thuc'];
            for (var si = 0; si < statKeys.length; si++) {
                (function(k) {
                    var domKey = k.replace('_', '-');
                    var btn = document.getElementById('btn-' + domKey);
                    if (btn) btn.onclick = function() {
                        var v = parseInt(document.getElementById('input-' + domKey).value, 10);
                        if (isNaN(v)) v = (k === 'tam_ma' ? 0 : 500);
                        uC(k, v);
                        notify('📊 Đã gán ' + k + ' = ' + v + '!');
                    };
                })(statKeys[si]);
            }

            function applyAllStats(val) {
                var run = gWin.game.store.getState().run;
                if (!run || !run.nhanVat) return;
                var cs = copyObj(run.nhanVat.chiSo || {});
                var mainStats = ['ngo_tinh', 'can_cot', 'dao_tam', 'than_phap', 'khi_van', 'than_thuc'];
                for (var i = 0; i < mainStats.length; i++) cs[mainStats[i]] = val;
                cs.tam_ma = 0;
                uNV({ chiSo: cs });
                notify('⚡ Đã đặt toàn bộ 6 Chỉ Số = ' + val + ' (Tâm ma = 0)!');
            }

            document.getElementById('btn-stat-200').onclick = function() { applyAllStats(200); };
            document.getElementById('btn-stat-600').onclick = function() { applyAllStats(600); };
    /* --- NGĂN 7: LUÂN HỒI, LÃO ĐÒ & THÀNH TỰU --- */
            document.getElementById('btn-dlh').onclick = function() {
                var v = parseInt(document.getElementById('input-dlh').value, 10);
                if (isNaN(v)) v = 999999;
                var meta = copyObj(gWin.game.store.getState().meta || {});
                meta.diemLuanHoi = v;
                meta.diemTong = Math.max(meta.diemTong || 0, v);
                gWin.game.store.setState({ meta: meta });
                notify('🌌 Đã gán Điểm Luân Hồi = ' + v.toLocaleString() + '!');
            };
            document.getElementById('btn-kiep').onclick = function() {
                var v = parseInt(document.getElementById('input-kiep').value, 10);
                if (isNaN(v)) v = 38;
                var st = gWin.game.store.getState();
                var meta = mergeObj(st.meta || {}, { kiep: v });
                var patch = { meta: meta };
                if (st.run) patch.run = mergeObj(st.run, { kiep: v });
                gWin.game.store.setState(patch);
                notify('🌌 Đã gán Số Kiếp = ' + v + '!');
            };

            function applyMaxLuanHoi() {
                var meta = copyObj(gWin.game.store.getState().meta || {});
                meta.diemLuanHoi = 999999;
                meta.diemTong = Math.max(meta.diemTong || 0, 999999);
                var moKhoa = copyObj(meta.moKhoa || {});
                for (var i = 0; i < MO_KHOA_DATA.length; i++) {
                    moKhoa[MO_KHOA_DATA[i].id] = MO_KHOA_DATA[i].max;
                }
                meta.moKhoa = moKhoa;
                var ttIds = [];
                for (var j = 0; j < ALL_THANH_TUU.length; j++) ttIds.push(ALL_THANH_TUU[j].id);
                meta.tienLo = mergeObj(meta.tienLo || {}, { thanhTuu: ttIds });
                gWin.game.store.setState({ meta: meta });
                notify('🌌 Đã Max 999,999 Điểm Luân Hồi + Mở khóa 17 Lão Đò & 28 Thành Tựu!');
            }

            document.getElementById('btn-max-luanhoi').onclick = applyMaxLuanHoi;
    /* --- NÚT SIÊU TỐC TRÊN ĐẦU BẢNG --- */
            document.getElementById('btn-heal-fast').onclick = function() {
                uNV({ thuongThe: 0, binhCanh: 0, kimDan: 1 });
                notify('💊 Đã xóa sạch Thương Thế = 0, Bình Cảnh = 0 & Kim Đan Nhất Phẩm!');
            };

            document.getElementById('btn-all-in-one').onclick = function() {
                applyGodPack();
                applyMaxCraftAndRecipes();
                applyMaxMeridianAndSkills();
                applyAllStats(600);
                applyMaxLuanHoi();
                uNV({
                    canhGioi: 5,
                    tieuCanhGioi: 3,
                    tuVi: 999999,
                    linhThach: 999999,
                    congHien: 99999,
                    thoNguyenThem: 5000,
                    binhCanh: 0,
                    thuongThe: 0,
                    kimDan: 1
                });
                notify('🚀 ĐÃ KÍCH HOẠT SIÊU BUFF TOÀN DIỆN (Hóa Thần + Thần Khí + Kinh Mạch + 600 Chỉ Số)!');
            };
        }

        document.body.appendChild(panel);
        renderPanel(false);
        notify('👑 Đã mở Bảng MOD Vạn Kiếp Tu Tiên MOD v2.3!');

        var isD = false, sX = 0, sY = 0, iX = 0, iY = 0;
        function sD(cX, cY, t) {
            if (t.id === 'p-hdr' || t.id === 'p-drag' || (t.closest && t.closest('#p-hdr'))) {
                if (t.id === 'p-tgl' || t.id === 'p-cls' || t.id === 'p-exp') return false;
                var tn = t.tagName;
                if (tn === 'INPUT' || tn === 'SELECT' || tn === 'LABEL' || tn === 'BUTTON') return false;
                isD = true; sX = cX; sY = cY; iX = panel.offsetLeft; iY = panel.offsetTop; return true;
            }
            return false;
        }
        function oD(cX, cY) {
            if (!isD) return;
            panel.style.left = Math.max(0, iX + cX - sX) + 'px';
            panel.style.top = Math.max(0, iY + cY - sY) + 'px';
            panel.style.right = 'auto';
        }

        panel.onmousedown = function(e) {
            if (sD(e.clientX, e.clientY, e.target)) {
                document.onmousemove = function(ev) { oD(ev.clientX, ev.clientY); };
                document.onmouseup = function() { isD = false; document.onmousemove = null; document.onmouseup = null; };
            }
        };
        panel.addEventListener('touchstart', function(e) { if (e.touches.length === 1) sD(e.touches[0].clientX, e.touches[0].clientY, e.target); }, { passive: true });
        panel.addEventListener('touchmove', function(e) { if (isD && e.touches.length === 1) oD(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
        panel.addEventListener('touchend', function() { isD = false; });

        setInterval(function() {
            try {
                var state = gWin.game.store.getState();
                var run = state.run;
                if (!run || !run.nhanVat) return;
                var nv = run.nhanVat;
                var cs = nv.chiSo || {};

                var ct = 0;
                function findCt(obj) {
                    if (!obj || typeof obj !== 'object') return;
                    if (Object.prototype.hasOwnProperty.call(obj, 'congTich') && typeof obj.congTich === 'number') ct = obj.congTich;
                    for (var k in obj) { if (obj[k] && typeof obj[k] === 'object') findCt(obj[k]); }
                }
                findCt(run);

                if (document.getElementById('panel-lt')) {
                    document.getElementById('panel-lt').innerText = (nv.linhThach || 0).toLocaleString();
                    document.getElementById('panel-tv').innerText = (nv.tuVi || 0).toFixed(1);
                    document.getElementById('panel-cg').innerText = (nv.canhGioi || 0) + '.' + (nv.tieuCanhGioi || 0);
                    document.getElementById('panel-ch').innerText = (nv.congHien || 0).toLocaleString();
                    document.getElementById('panel-ct').innerText = ct.toLocaleString();
                    document.getElementById('panel-tuoi').innerText = Math.floor(nv.tuoi || 0) + ' (+' + (nv.thoNguyenThem || 0) + ')';

                    var ngheObj = nv.nghe || {};
                    var phuObj = ngheObj.che_phu || { bac: 0, kinhNghiem: 0 };
                    var danObj = ngheObj.luyen_dan || { bac: 0, kinhNghiem: 0 };
                    var baoObj = ngheObj.luyen_bao || { bac: 0, kinhNghiem: 0 };

                    if (document.getElementById('lbl-phu-bac')) {
                        document.getElementById('lbl-phu-bac').innerText = phuObj.bac || 0;
                        document.getElementById('lbl-phu-kn').innerText = phuObj.kinhNghiem || 0;
                        document.getElementById('lbl-dan-bac').innerText = danObj.bac || 0;
                        document.getElementById('lbl-dan-kn').innerText = danObj.kinhNghiem || 0;
                        document.getElementById('lbl-bao-bac').innerText = baoObj.bac || 0;
                        document.getElementById('lbl-bao-kn').innerText = baoObj.kinhNghiem || 0;
                    }

                    document.getElementById('input-ten').placeholder = nv.ten || 'Đạo Hữu';
                    document.getElementById('input-lt').placeholder = nv.linhThach || 0;
                    document.getElementById('input-tv').placeholder = Math.floor(nv.tuVi || 0);
                    document.getElementById('input-canh-gioi').placeholder = nv.canhGioi || 0;
                    document.getElementById('input-ch').placeholder = nv.congHien || 0;
                    document.getElementById('input-ct').placeholder = ct;
                    document.getElementById('input-tnt').placeholder = nv.thoNguyenThem || 0;
                    document.getElementById('input-tuoi').placeholder = Math.floor(nv.tuoi || 18);

                    document.getElementById('input-ngo-tinh').placeholder = cs.ngo_tinh || 0;
                    document.getElementById('input-can-cot').placeholder = cs.can_cot || 0;
                    document.getElementById('input-dao-tam').placeholder = cs.dao_tam || 0;
                    document.getElementById('input-than-phap').placeholder = cs.than_phap || 0;
                    document.getElementById('input-khi-van').placeholder = cs.khi_van || 0;
                    document.getElementById('input-tam-ma').placeholder = cs.tam_ma || 0;
                    document.getElementById('input-than-thuc').placeholder = cs.than_thuc || 0;

                    if (document.getElementById('panel-thechat-hien-tai')) {
                        var tcObj = THE_CHAT_DB[nv.theChat];
                        document.getElementById('panel-thechat-hien-tai').innerText = (tcObj && tcObj.ten) ? tcObj.ten : (nv.theChat || 'Phàm thể');
                    }
                    var gridEl = document.getElementById('huyet-grid-container');
                    if (gridEl && gridEl.dataset.renderedTheChat !== (nv.theChat || 'the_chat.pham_the')) {
                        renderHuyetGrid();
                    }
                    if (nv.linhCan) {
                        var h = nv.linhCan.he || [];
                        document.getElementById('panel-linhcan').innerText = (h.length ? h.join(',') : 'Vô') + (nv.linhCan.tuLuyen ? (' (x' + nv.linhCan.tuLuyen + ')') : '');
                        if (!gWin._isUpdatingLinhCan && (!document.activeElement || !document.activeElement.name)) {
                            var cbs = document.querySelectorAll('input[name="linhcan-he"]');
                            for (var ci = 0; ci < cbs.length; ci++) {
                                var isChecked = false;
                                for (var hi2 = 0; hi2 < h.length; hi2++) {
                                    if (h[hi2] === cbs[ci].value) isChecked = true;
                                }
                                cbs[ci].checked = isChecked;
                            }
                        }
                    }
                }
            } catch (e) {}
        }, 1000);
    }
})();