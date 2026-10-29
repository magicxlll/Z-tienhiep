// CRAFTING RECIPES DATABASE & UTILITIES
import { gWin, getGameState, copyObj, setGameState, persistGameSave } from "../core/bridge";
import { getItemInfo, getAllAvailableItems } from "./items";
import { notify, buildSyncedXepTui } from "../core/mutator";

export interface RecipeIngredient {
  id?: string;
  so?: number;
  loai?: string;
  he?: string[];
  pham?: number;
}

export interface RecipeInfo {
  id: string;
  nghe: "luyen_dan" | "luyen_bao" | "che_phu" | string;
  ten: string;
  ra: string;
  ra_cuc?: string;
  chu: Array<{ id: string; so: number }>;
  phu?: RecipeIngredient[];
  hoa?: string;
  linh_thach?: number;
  mo_ta?: string;
}

export const FALLBACK_RECIPES: RecipeInfo[] = [
  {
    "id": "dp.hoi_xuan_dan",
    "nghe": "luyen_dan",
    "ten": "Hồi Xuân Đan phương",
    "ra": "item.hoi_xuan_dan",
    "chu": [
      {
        "id": "item.son_sam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 2,
    "mo_ta": "Đơn phương nhập môn, thầy lang nào cũng thuộc. Sâm núi phải ninh lửa nhỏ, lửa to thì dược tính bay hết."
  },
  {
    "id": "dp.bo_khi_dan",
    "nghe": "luyen_dan",
    "ten": "Bổ Khí Đan phương",
    "ra": "item.bo_khi_dan",
    "chu": [
      {
        "id": "item.thanh_tam_thao",
        "so": 1
      }
    ],
    "phu": [],
    "mo_ta": "Một vị Thanh Tâm Thảo, không kén lửa. Đan đồ thường luyện đơn này tới mòn tay để tập canh lò."
  },
  {
    "id": "dp.sinh_co_dan",
    "nghe": "luyen_dan",
    "ten": "Sinh Cơ Đan phương",
    "ra": "item.sinh_co_dan",
    "chu": [
      {
        "id": "item.huyet_linh_chi",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "pham": 2,
        "so": 1
      }
    ],
    "hoa": "van",
    "mo_ta": "Huyết Linh Chi làm chủ, thêm một vị linh dược hệ mộc làm phụ. Phải lửa văn ủ ba ngày, nóng vội thì đan nứt."
  },
  {
    "id": "dp.tu_linh_dan",
    "nghe": "luyen_dan",
    "ten": "Tụ Linh Đan phương",
    "ra": "item.tu_linh_dan",
    "chu": [
      {
        "id": "item.yeu_dan_1",
        "so": 3
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Lấy yêu đan làm lõi. Vỏ yêu đan cứng, phải mãnh hỏa mới phá được, linh khí bên trong mới chịu tan ra."
  },
  {
    "id": "dp.bao_huyet_dan",
    "nghe": "luyen_dan",
    "ten": "Bạo Huyết Đan phương",
    "ra": "item.bao_huyet_dan",
    "chu": [
      {
        "id": "item.huyet_linh_chi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Cùng một vị Huyết Linh Chi với Sinh Cơ Đan, nhưng đốt bằng lửa vũ cho huyết khí sôi lên. Đan ra đỏ như than hồng."
  },
  {
    "id": "dp.truc_co_dan",
    "nghe": "luyen_dan",
    "ten": "Trúc Cơ Đan phương",
    "ra": "item.truc_co_dan",
    "chu": [
      {
        "id": "item.huyet_linh_chi",
        "so": 1
      },
      {
        "id": "item.thanh_tam_thao",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Đơn phương tông môn giữ kín, không truyền ra phường thị. Mỗi lò chỉ ra một viên, may lắm mới được hai."
  },
  {
    "id": "dp.kim_sang_duoc",
    "nghe": "luyen_dan",
    "ten": "Kim Sang Dược phương",
    "ra": "item.kim_sang_duoc",
    "chu": [
      {
        "id": "item.sa_can_thao",
        "so": 1
      }
    ],
    "phu": [],
    "mo_ta": "Rễ cỏ cát giã nát, sao khô, tán bột. Không kén lửa, chỉ kén tay, giã không nhuyễn thì rắc vào vết thương thấy xót."
  },
  {
    "id": "dp.hoi_xuan_dan_thuy",
    "nghe": "luyen_dan",
    "ten": "Hồi Xuân Đan phương (sương sen)",
    "ra": "item.hoi_xuan_dan",
    "chu": [
      {
        "id": "item.ha_diep_suong",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 2,
    "mo_ta": "Bản đơn phương của dân vạn chài, lấy sương lá sen thay sâm núi. Lửa phải nhỏ hơn cả đom đóm, sương gặp nóng là bay."
  },
  {
    "id": "dp.bo_khi_dan_cot",
    "nghe": "luyen_dan",
    "ten": "Bổ Khí Đan phương (cốt hoa)",
    "ra": "item.bo_khi_dan",
    "chu": [
      {
        "id": "item.bach_cot_hoa",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 3,
    "mo_ta": "Đơn phương của thợ săn Lang Hoang, dùng hoa mọc trên xương yêu. Phải đốt lửa mạnh cho tan âm khí, không thì uống vào lạnh bụng."
  },
  {
    "id": "dp.bao_huyet_dan_mac",
    "nghe": "luyen_dan",
    "ten": "Bạo Huyết Đan phương (mạc đằng)",
    "ra": "item.bao_huyet_dan",
    "chu": [
      {
        "id": "item.hoa_mac_dang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Đơn phương của đội lạc đà vượt sa mạc. Dây đằng đã mang lửa sẵn, thêm lửa vũ nữa thì đan dễ nổ lò."
  },
  {
    "id": "dp.thong_mach_dan",
    "nghe": "luyen_dan",
    "ten": "Thông Mạch Đan phương",
    "ra": "item.thong_mach_dan",
    "chu": [
      {
        "id": "item.kim_mach_dao",
        "so": 1
      },
      {
        "id": "item.mach_hoa_thao",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 6,
    "mo_ta": "Hạt lúa kim sắc làm mũi nhọn, hoa dại làm chất dẫn. Phải dùng lửa mạnh cho hạt mềm ra, lửa yếu thì đan còn gai, uống vào đâm kinh mạch."
  },
  {
    "id": "dp.tay_tuy_dan",
    "nghe": "luyen_dan",
    "ten": "Tẩy Tủy Đan phương",
    "ra": "item.tay_tuy_dan",
    "chu": [
      {
        "id": "item.loi_sa_hoa",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 8,
    "mo_ta": "Dùng hoa trúng sét để phạt tủy. Lửa phải gấp, hoa gặp lửa chậm sẽ tắt dư lôi, đan ra chỉ còn là cánh hoa khô."
  },
  {
    "id": "dp.thanh_tam_dan",
    "nghe": "luyen_dan",
    "ten": "Thanh Tâm Đan phương",
    "ra": "item.thanh_tam_dan",
    "chu": [
      {
        "id": "item.thanh_tam_thao",
        "so": 2
      },
      {
        "id": "item.thuy_tien_can",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 8,
    "mo_ta": "Cỏ tĩnh tâm thêm củ thủy tiên ngâm lạnh. Người luyện mà nóng lòng thì đan cũng nóng, đúng cái bệnh nó định chữa."
  },
  {
    "id": "dp.tuc_mach_cao",
    "nghe": "luyen_dan",
    "ten": "Tục Mạch Cao phương",
    "ra": "item.tuc_mach_cao",
    "chu": [
      {
        "id": "item.tung_tam_chi",
        "so": 1
      },
      {
        "id": "item.mang_huyet_hoa",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Nấm tùng với hoa huyết, ninh thành cao đặc như nhựa. Lửa văn ủ ba ngày, vớt bọt đủ bảy lần, bỏ sót một lần là cao nổi cặn."
  },
  {
    "id": "dp.hoan_hon_dan",
    "nghe": "luyen_dan",
    "ten": "Hoàn Hồn Đan phương",
    "ra": "item.hoan_hon_dan",
    "chu": [
      {
        "id": "item.co_moc_tam",
        "so": 1
      },
      {
        "id": "item.mang_huyet_hoa",
        "so": 1
      },
      {
        "id": "item.yeu_dan_2",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Lõi gỗ già giữ hồn, hoa huyết giữ khí, yêu đan làm cầu nối. Ba vị tính khác nhau, lửa phải đều như nhịp thở người ngủ."
  },
  {
    "id": "dp.ngung_nguyen_dan",
    "nghe": "luyen_dan",
    "ten": "Ngưng Nguyên Đan phương",
    "ra": "item.ngung_nguyen_dan",
    "chu": [
      {
        "id": "item.tram_uyen_tao",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Rong vực sâu nén thành giọt thủy ngân. Lửa văn, lửa nào mạnh quá là rong cuộn lại thành cục, không tan nữa."
  },
  {
    "id": "dp.duyen_tho_dan",
    "nghe": "luyen_dan",
    "ten": "Duyên Thọ Đan phương",
    "ra": "item.duyen_tho_dan",
    "chu": [
      {
        "id": "item.co_moc_tam",
        "so": 1
      },
      {
        "id": "item.kim_tue_mach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Đơn phương của đan phòng các đại tông, người ngoài cầu cả đời không được. Lõi cây sống qua ba triều, bông lúa mọc xuyên băng, lửa văn phải giữ suốt bảy ngày bảy đêm."
  },
  {
    "id": "dp.ket_kim_dan",
    "nghe": "luyen_dan",
    "ten": "Kết Kim Đan phương",
    "ra": "item.ket_kim_dan",
    "chu": [
      {
        "id": "item.tu_nham_hoa",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 40,
    "mo_ta": "Đơn phương tông môn chỉ trao cho đệ tử đã sắp Kết Đan. Hoa đá khó thấm lửa, lửa văn phải nung lâu cho thấu tận lõi, vội một khắc là hỏng cả lò."
  },
  {
    "id": "dp.duong_anh_dan",
    "nghe": "luyen_dan",
    "ten": "Dưỡng Anh Đan phương",
    "ra": "item.duong_anh_dan",
    "chu": [
      {
        "id": "item.giao_chau_lien",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "tho"
        ],
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Hạt sen giao làm chủ, một vị thổ linh dược làm nền để giữ anh khỏi trôi. Phải là Đan tông sư mới dám nhóm lò, lửa lệch một tơ là uổng cả hạt sen."
  },
  {
    "id": "dp.cuu_chuyen_kim_dan",
    "nghe": "luyen_dan",
    "ten": "Cửu Chuyển Kim Đan phương",
    "ra": "item.cuu_chuyen_kim_dan",
    "chu": [
      {
        "id": "item.van_nien_tung_chi",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "hoa"
        ],
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 50,
    "mo_ta": "Đơn phương cổ truyền từ trước Thiên Môn khép, nét chữ đã nhòe ở hai chỗ. Luyện chín lần, mỗi lần đổi lửa một nhịp, người nào đứt hơi giữa chừng thì lò hỏng."
  },
  {
    "id": "dp.pha_chuong_dan",
    "nghe": "luyen_dan",
    "ten": "Phá Chướng Đan phương",
    "ra": "item.pha_chuong_dan",
    "chu": [
      {
        "id": "item.khai_khieu_chau",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 20,
    "mo_ta": "Một hạt Khai Khiếu Châu, lửa vũ nung cho vỏ châu nứt rồi mới hạ lửa. Vỏ chưa nứt mà hạ lửa thì đan ra chỉ là hòn sỏi."
  },
  {
    "id": "dp.toai_bich_dan",
    "nghe": "luyen_dan",
    "ten": "Toái Bích Đan phương",
    "ra": "item.toai_bich_dan",
    "chu": [
      {
        "id": "item.xuyen_bich_giac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 60,
    "mo_ta": "Sừng Xuyên Bích mài thành bột, lửa vũ đốt ba ngày cho bột chảy thành nước đá. Lò phải dày, sừng còn giữ sức húc, lò mỏng là thủng."
  },
  {
    "id": "dp.thong_huyen_dan",
    "nghe": "luyen_dan",
    "ten": "Thông Huyền Đan phương",
    "ra": "item.thong_huyen_dan",
    "chu": [
      {
        "id": "item.huyen_quan_tuy",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Một giọt Huyền Quan Tủy, lửa văn ủ bốn mươi chín ngày cho tủy kết thành sợi. Lửa mạnh thì sợi đứt, đan ra chỉ còn màu tím."
  },
  {
    "id": "dp.pha_hu_dan",
    "nghe": "luyen_dan",
    "ten": "Phá Hư Đan phương",
    "ra": "item.pha_hu_dan",
    "chu": [
      {
        "id": "item.hu_linh_phach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Mở hộp ngọc ngay trên miệng lò cho Hư Linh Phách rơi vào, chậm một hơi là nó tan mất. Lửa văn giữ ba tháng, không được nhìn vào lò."
  },
  {
    "id": "dp.on_co_dan",
    "nghe": "luyen_dan",
    "ten": "Ôn Cơ Đan phương",
    "ra": "item.on_co_dan",
    "chu": [
      {
        "id": "item.huyet_linh_chi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Một cây Huyết Linh Chi, lửa văn liu riu cho nhựa đỏ chảy hết vào lõi. Lửa to thì nhựa cháy khét, đan đắng mà vô dụng."
  },
  {
    "id": "dp.bo_khuyet_dan",
    "nghe": "luyen_dan",
    "ten": "Bổ Khuyết Đan phương",
    "ra": "item.bo_khuyet_dan",
    "chu": [
      {
        "id": "item.co_moc_tam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Một khúc Cổ Mộc Tâm nghiền nhỏ, lửa văn hun đến khi bột dính thành keo. Keo còn rời là chưa đủ lửa, đan ra không vá nổi chỗ nứt."
  },
  {
    "id": "dp.hoan_nguyen_dan",
    "nghe": "luyen_dan",
    "ten": "Hoàn Nguyên Đan phương",
    "ra": "item.hoan_nguyen_dan",
    "chu": [
      {
        "id": "item.thien_nien_ha_thu_o",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "tho"
        ],
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 80,
    "mo_ta": "Thiên Niên Hà Thủ Ô làm chủ, một vị thổ linh dược giữ cho dược lực lắng xuống. Lửa văn ủ ba mươi sáu ngày, mở lò sớm một ngày là đan vỡ."
  },
  {
    "id": "dp.bo_thien_dan",
    "nghe": "luyen_dan",
    "ten": "Bổ Thiên Đan phương",
    "ra": "item.bo_thien_dan",
    "chu": [
      {
        "id": "item.that_khieu_linh_ngau",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Thất Khiếu Linh Ngẫu bỏ nguyên củ vào lò, lửa văn thổi qua bảy lỗ cho tiếng sáo đều. Giữ trăm ngày, tiếng sáo tắt giữa chừng là hỏng cả lò."
  },
  {
    "id": "dp.tich_doc_dan",
    "nghe": "luyen_dan",
    "ten": "Tịch Độc Đan phương",
    "ra": "item.tich_doc_dan",
    "chu": [
      {
        "id": "item.thiem_to",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 3,
    "mo_ta": "Một giọt mủ cóc pha vào nước thuốc, lửa văn ninh tới khi hết mùi hắc. Còn mùi mà đã vê viên thì đan thành thuốc độc."
  },
  {
    "id": "dp.trang_dam_dan",
    "nghe": "luyen_dan",
    "ten": "Tráng Đảm Đan phương",
    "ra": "item.trang_dam_dan",
    "chu": [
      {
        "id": "item.hung_dam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 4,
    "mo_ta": "Đơn của thầy lang Viêm Quốc. Mật gấu khô cứng như đá, phải vũ hỏa nướng cho nứt rồi mới ninh."
  },
  {
    "id": "dp.thanh_vu_dan",
    "nghe": "luyen_dan",
    "ten": "Thanh Vụ Đan phương",
    "ra": "item.thanh_vu_dan",
    "chu": [
      {
        "id": "item.thanh_vu_tra",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 2,
    "mo_ta": "Đơn của trà trang, cô một vò Thanh Vụ trà thành hai viên. Lửa to thì trà khét, đan ra đắng mà không còn tác dụng."
  },
  {
    "id": "dp.tuy_ha_dan",
    "nghe": "luyen_dan",
    "ten": "Túy Hà Đan phương",
    "ra": "item.tuy_ha_dan",
    "chu": [
      {
        "id": "item.bach_hoa_tuu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 2,
    "mo_ta": "Đơn của tửu phường, nấu Bách Hoa tửu bằng lửa mạnh cho bay hết hơi rượu, giữ lại men linh khí. Lửa nhỏ thì đan ra còn say."
  },
  {
    "id": "dp.bach_giai_dan",
    "nghe": "luyen_dan",
    "ten": "Bách Giải Đan phương",
    "ra": "item.bach_giai_dan",
    "chu": [
      {
        "id": "item.xa_dam",
        "so": 1
      },
      {
        "id": "item.hat_doc_nang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 5,
    "mo_ta": "Lấy độc công độc: nọc bọ cạp mở đường, mật rắn theo sau mà giải. Lửa văn, thứ tự bỏ thuốc sai một bước là luyện ra độc dược."
  },
  {
    "id": "dp.dinh_than_dan",
    "nghe": "luyen_dan",
    "ten": "Định Thần Đan phương",
    "ra": "item.dinh_than_dan",
    "chu": [
      {
        "id": "item.vien_tam_huyet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 5,
    "mo_ta": "Đơn do một vị sư chùa Kim Cương chép lại. Tâm huyết vượn gặp lửa mạnh thì sôi, đan ra làm người uống nóng nảy hơn trước."
  },
  {
    "id": "dp.bang_phach_dan",
    "nghe": "luyen_dan",
    "ten": "Băng Phách Đan phương",
    "ra": "item.bang_phach_dan",
    "chu": [
      {
        "id": "item.bang_phach_lien",
        "so": 2
      },
      {
        "id": "item.ngu_chau",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Sen băng làm chủ, ngư châu giữ hàn khí khỏi tan. Lửa phải nhỏ mà đều, lò nóng quá thì sen chảy thành nước lã."
  },
  {
    "id": "dp.duong_khi_dan",
    "nghe": "luyen_dan",
    "ten": "Dưỡng Khí Đan phương",
    "ra": "item.duong_khi_dan",
    "chu": [
      {
        "id": "item.son_sam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 2,
    "mo_ta": "Đơn phương của người giữ chùa, chép cho kẻ muốn tập ngồi thiền. Sâm núi ninh lửa nhỏ tới khi nước đặc như mật."
  },
  {
    "id": "dp.khai_nguyen_dan",
    "nghe": "luyen_dan",
    "ten": "Khai Nguyên Đan phương",
    "ra": "item.khai_nguyen_dan",
    "chu": [
      {
        "id": "item.thiem_to",
        "so": 1
      },
      {
        "id": "item.thanh_tam_thao",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 4,
    "mo_ta": "Mủ cóc mở kinh, cỏ tĩnh tâm giữ khí. Phải ninh tới khi hết mùi hắc, còn mùi thì người uống đau bụng ba ngày."
  },
  {
    "id": "dp.tu_khi_dan",
    "nghe": "luyen_dan",
    "ten": "Tụ Khí Đan phương",
    "ra": "item.tu_khi_dan",
    "chu": [
      {
        "id": "item.mach_hoa_thao",
        "so": 2
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 2,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 4,
    "mo_ta": "Hoa dại làm nền, một món yêu tài bất kỳ làm lõi gom khí. Đan sư phường thị luyện đơn này nhiều hơn cơm ăn."
  },
  {
    "id": "dp.ngung_khi_dan",
    "nghe": "luyen_dan",
    "ten": "Ngưng Khí Đan phương",
    "ra": "item.ngung_khi_dan",
    "chu": [
      {
        "id": "item.hac_vu",
        "so": 1
      },
      {
        "id": "item.thuy_tien_can",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Lông hạc đốt thành tro, hòa với nước củ thủy tiên. Lửa văn, lò phải đậy kín, hở một khe là linh khí theo khói bay mất."
  },
  {
    "id": "dp.boi_nguyen_dan",
    "nghe": "luyen_dan",
    "ten": "Bồi Nguyên Đan phương",
    "ra": "item.boi_nguyen_dan",
    "chu": [
      {
        "id": "item.kim_tue_mach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Một bông lúa kim tuệ, lửa văn ủ đủ chín ngày. Đơn dễ, cái khó là kiếm được lúa."
  },
  {
    "id": "dp.tinh_nguyen_dan",
    "nghe": "luyen_dan",
    "ten": "Tinh Nguyên Đan phương",
    "ra": "item.tinh_nguyen_dan",
    "chu": [
      {
        "id": "item.giao_long_lan",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "thuy"
        ],
        "pham": 2,
        "so": 1
      }
    ],
    "hoa": "van",
    "mo_ta": "Vẩy giao long ngâm trong nước linh dược hệ thủy bảy ngày cho mềm rồi mới vào lò. Vẩy chưa mềm mà nhóm lửa thì nứt lò."
  },
  {
    "id": "dp.kim_lo_dan",
    "nghe": "luyen_dan",
    "ten": "Kim Lộ Đan phương",
    "ra": "item.kim_lo_dan",
    "chu": [
      {
        "id": "item.xich_tinh_qua",
        "so": 2
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 20,
    "mo_ta": "Hai quả xích tinh ép lấy nước, một món yêu tài làm lõi. Lửa vũ cô tới khi mặt nước nổi sương vàng thì tắt lò."
  },
  {
    "id": "dp.long_ho_dan",
    "nghe": "luyen_dan",
    "ten": "Long Hổ Đan phương",
    "ra": "item.long_ho_dan",
    "chu": [
      {
        "id": "item.cuu_khuc_hoang_tinh",
        "so": 1
      },
      {
        "id": "item.tu_kim",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 50,
    "mo_ta": "Hoàng tinh làm long, tử kim làm hổ. Hai vị phải vào lò cùng một hơi thở, lệch nhau là một vị nuốt mất vị kia."
  },
  {
    "id": "dp.boi_anh_dan",
    "nghe": "luyen_dan",
    "ten": "Bồi Anh Đan phương",
    "ra": "item.boi_anh_dan",
    "chu": [
      {
        "id": "item.cuu_tue_linh_dao",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "pham": 2,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 80,
    "mo_ta": "Đào chín tuệ làm chủ, một vị mộc linh dược dẫn dược khí. Lửa văn ủ bốn mươi chín ngày, người canh lò không được rời nửa bước."
  },
  {
    "id": "dp.huyen_anh_dan",
    "nghe": "luyen_dan",
    "ten": "Huyền Anh Đan phương",
    "ra": "item.huyen_anh_dan",
    "chu": [
      {
        "id": "item.yeu_vuong_noi_dan",
        "so": 1
      },
      {
        "id": "item.mang_hon_chi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Đơn phương cổ, viết rằng nội đan yêu vương còn giữ chút linh trí, phải lửa vũ đốt sạch rồi mới dám cho nguyên anh nuốt."
  },
  {
    "id": "dp.duong_than_dan",
    "nghe": "luyen_dan",
    "ten": "Dưỡng Thần Đan phương",
    "ra": "item.duong_than_dan",
    "chu": [
      {
        "id": "item.yeu_vuong_noi_dan",
        "so": 1
      },
      {
        "id": "item.nhat_luan_hoa",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Hoa mặt trời và nội đan yêu vương, một dương một âm. Lửa văn giữ ba tháng, đan ra ấm mà không bỏng tay mới là thành."
  },
  {
    "id": "dp.thai_hu_dan",
    "nghe": "luyen_dan",
    "ten": "Thái Hư Đan phương",
    "ra": "item.thai_hu_dan",
    "chu": [
      {
        "id": "item.van_nien_ban_dao",
        "so": 1
      },
      {
        "id": "item.yeu_vuong_noi_dan",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Đơn phương chép trên vách đá một động phủ cổ, chữ cuối bị đục mất. Bàn đào vạn năm làm chủ, lò phải đốt suốt một năm không tắt."
  },
  {
    "id": "dp.loi_am_dan",
    "nghe": "luyen_dan",
    "ten": "Lôi Âm Đan phương",
    "ra": "item.loi_am_dan",
    "chu": [
      {
        "id": "item.loi_kiep_truc",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 40,
    "mo_ta": "Đốt trúc trúng sét bằng lửa vũ cho dư lôi bật ra, một vị mộc linh dược giữ lại trong lò. Lửa văn thì sét tắt, đan ra chỉ là than trúc."
  },
  {
    "id": "dp.tinh_phach_dan",
    "nghe": "luyen_dan",
    "ten": "Tĩnh Phách Đan phương",
    "ra": "item.tinh_phach_dan",
    "chu": [
      {
        "id": "item.han_ngoc_sam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Sâm băng ninh lửa nhỏ trong nồi đất kê trên tuyết. Lò nóng quá thì hàn khí bốc hết, đan ra chỉ còn vị đắng."
  },
  {
    "id": "dp.luyen_cot_dan",
    "nghe": "luyen_dan",
    "ten": "Luyện Cốt Đan phương",
    "ra": "item.luyen_cot_dan",
    "chu": [
      {
        "id": "item.huyet_bo_de",
        "so": 1
      },
      {
        "id": "item.lang_vuong_cot",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 50,
    "mo_ta": "Xương sói vương nung đỏ, rưới nước huyết bồ đề lên cho xương mềm ra. Lửa vũ liền bảy ngày, xương chưa mềm mà hạ lửa thì đan đầy sạn."
  },
  {
    "id": "dp.truong_xuan_dan",
    "nghe": "luyen_dan",
    "ten": "Trường Xuân Đan phương",
    "ra": "item.truong_xuan_dan",
    "chu": [
      {
        "id": "item.thien_nien_ha_thu_o",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 60,
    "mo_ta": "Hai củ hà thủ ô nghìn năm, một đực một cái, ninh chung lửa văn chín ngày. Thiếu một củ thì đan ra chỉ đen tóc, không thêm tuổi."
  },
  {
    "id": "dp.thong_than_dan",
    "nghe": "luyen_dan",
    "ten": "Thông Thần Đan phương",
    "ra": "item.thong_than_dan",
    "chu": [
      {
        "id": "item.u_minh_lan",
        "so": 1
      },
      {
        "id": "item.ung_vuong_kim_dong",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 50,
    "mo_ta": "Lan âm mở thần thức, mắt ưng vương dẫn đường. Phải luyện lúc nửa đêm khi lan còn sáng, đợi tới sáng thì hoa tắt, công cốc."
  },
  {
    "id": "dp.tran_hon_dan",
    "nghe": "luyen_dan",
    "ten": "Trấn Hồn Đan phương",
    "ra": "item.tran_hon_dan",
    "chu": [
      {
        "id": "item.han_nguyet_que",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 50,
    "mo_ta": "Hoa quế băng chưng cách thủy suốt một tuần trăng. Lửa văn giữ đều, ngày trăng tròn mới mở lò."
  },
  {
    "id": "dp.hoa_anh_dan",
    "nghe": "luyen_dan",
    "ten": "Hóa Anh Đan phương",
    "ra": "item.hoa_anh_dan",
    "chu": [
      {
        "id": "item.xich_long_qua",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 30,
    "mo_ta": "Đơn của một tán tu không có tông môn chống lưng, tự mò ra cách thay Dưỡng Anh Đan. Quả rồng đỏ phải lửa vũ mới vỡ vỏ, kém hơn đơn tông môn nhưng ai cũng luyện được."
  },
  {
    "id": "dp.hoi_thien_dan",
    "nghe": "luyen_dan",
    "ten": "Hồi Thiên Đan phương",
    "ra": "item.hoi_thien_dan",
    "chu": [
      {
        "id": "item.tu_van_linh_chi",
        "so": 1
      },
      {
        "id": "item.thien_chu_mau_ty",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "pham": 4,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Linh chi tím làm chủ, tơ nhện mẹ quấn quanh cho dược lực khỏi tan, thêm một vị mộc linh dược Địa phẩm trở lên. Tơ cháy là hỏng, lửa không được lớn hơn ngọn nến."
  },
  {
    "id": "dp.han_tuy_dan",
    "nghe": "luyen_dan",
    "ten": "Hàn Tủy Đan phương",
    "ra": "item.han_tuy_dan",
    "chu": [
      {
        "id": "item.bang_tuy_chi",
        "so": 1
      },
      {
        "id": "item.bang_vuong_linh_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Nấm lõi băng với lông bằng vương. Lò phải đặt trên tuyết, lửa văn đốt từ trên xuống, ngược hẳn lối thường."
  },
  {
    "id": "dp.due_kim_dan",
    "nghe": "luyen_dan",
    "ten": "Duệ Kim Đan phương",
    "ra": "item.due_kim_dan",
    "chu": [
      {
        "id": "item.cuu_diep_kiem_thao",
        "so": 1
      },
      {
        "id": "item.hat_vuong_doc_thich",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Đơn của sát thủ, chín lá kiếm thảo và gai độc hạt vương. Lửa vũ đốt cho độc tan vào lá, độc chưa tan hết mà vê viên thì người uống chết trước kẻ địch."
  },
  {
    "id": "dp.thuong_long_dan",
    "nghe": "luyen_dan",
    "ten": "Thương Long Đan phương",
    "ra": "item.thuong_long_dan",
    "chu": [
      {
        "id": "item.bich_trieu_linh_tao",
        "so": 1
      },
      {
        "id": "item.giao_long_giac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Tảo biếc ngâm cùng sừng giao trong nước biển bảy ngày rồi mới vào lò. Lửa văn, nước trong lò phải sôi lăn tăn như con nước ngầm."
  },
  {
    "id": "dp.kim_o_dan",
    "nghe": "luyen_dan",
    "ten": "Kim Ô Đan phương",
    "ra": "item.kim_o_dan",
    "chu": [
      {
        "id": "item.kim_o_qua",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "hoa"
        ],
        "pham": 5,
        "so": 1
      },
      {
        "loai": "yeu_tai",
        "pham": 5,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 300,
    "mo_ta": "Quả mặt trời làm chủ, thêm một vị hỏa linh dược và một món yêu tài đại yêu cho lửa có chỗ bám. Lửa vũ đốt ba ngày, lò đỏ rực như mặt trời lặn."
  },
  {
    "id": "dp.van_tho_dan",
    "nghe": "luyen_dan",
    "ten": "Vạn Thọ Đan phương",
    "ra": "item.van_tho_dan",
    "chu": [
      {
        "id": "item.thai_tue",
        "so": 1
      },
      {
        "id": "item.huyen_quy_long_giap",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Thái tuế thịt sống, mai rùa trăm vạn năm. Thái tuế tự liền thịt, phải lấy mai rùa đè lên nó suốt bốn mươi chín ngày lửa văn."
  },
  {
    "id": "dp.tao_hoa_dan",
    "nghe": "luyen_dan",
    "ten": "Tạo Hóa Đan phương",
    "ra": "item.tao_hoa_dan",
    "chu": [
      {
        "id": "item.kien_moc_qua",
        "so": 1
      },
      {
        "id": "item.thai_nhac_hung_dom",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Quả Kiến Mộc gieo vào mật gấu núi nghìn năm, đợi mầm nảy mới nhóm lò. Lửa văn, mầm héo lúc nào là phải tắt lửa lúc ấy."
  },
  {
    "id": "dp.hoa_long_dan",
    "nghe": "luyen_dan",
    "ten": "Hóa Long Đan phương",
    "ra": "item.hoa_long_dan",
    "chu": [
      {
        "id": "item.hoa_long_thao",
        "so": 1
      },
      {
        "id": "item.than_huyet_dang",
        "so": 1
      },
      {
        "id": "item.hoa_long_chau",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 500,
    "mo_ta": "Cỏ hóa long, máu yêu thần và nội châu giao già, ba thứ xà tộc liều mạng giữ. Lửa vũ đốt tới khi bóng rồng trong châu chịu bơi sang đan."
  },
  {
    "id": "dp.van_tam_dan",
    "nghe": "luyen_dan",
    "ten": "Vấn Tâm Đan phương",
    "ra": "item.van_tam_dan",
    "chu": [
      {
        "id": "item.tuyet_long_sam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Sâm rồng tuyết luyện trong lò băng, người canh lò phải ngồi trước lò hỏi lòng mình suốt chín ngày. Ai nóng ruột bỏ đi thì lò nguội."
  },
  {
    "id": "dp.thien_nhat_dan",
    "nghe": "luyen_dan",
    "ten": "Thiên Nhất Đan phương",
    "ra": "item.thien_nhat_dan",
    "chu": [
      {
        "id": "item.thien_nhat_chan_thuy",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Một giọt chân thủy, không thêm vị nào. Cái khó là giữ cho giọt nước nặng như thủy ngân ấy không xuyên thủng đáy lò."
  },
  {
    "id": "dp.linh_lung_dan",
    "nghe": "luyen_dan",
    "ten": "Linh Lung Đan phương",
    "ra": "item.linh_lung_dan",
    "chu": [
      {
        "id": "item.that_khieu_linh_ngau",
        "so": 1
      },
      {
        "id": "item.thien_ho_tam",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "thuy"
        ],
        "pham": 5,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Ngó sen bảy khiếu, tim hồ ngàn năm và một vị thủy linh dược Thiên phẩm. Thổi hơi qua bảy lỗ ngó sen cho dược khí đi đều rồi mới đậy nắp lò."
  },
  {
    "id": "dp.thien_loi_dan",
    "nghe": "luyen_dan",
    "ten": "Thiên Lôi Đan phương",
    "ra": "item.thien_loi_dan",
    "chu": [
      {
        "id": "item.thien_loi_moc_tam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 500,
    "mo_ta": "Lõi gỗ chín lần trúng sét, chẻ làm ba, đốt từng phần trong đêm giông. Phải mở nắp lò đúng lúc sét đánh xuống thì lôi khí mới vào đan."
  },
  {
    "id": "dp.bach_giai_dan_giac",
    "nghe": "luyen_dan",
    "ten": "Bách Giải Đan phương (tê giác)",
    "ra": "item.bach_giai_dan",
    "chu": [
      {
        "id": "item.te_nguu_giac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 5,
    "mo_ta": "Sừng tê mài bột, sắc với nước suối tới khi nước đen lại. Sừng hút độc nóng, lửa văn giữ cho bột khỏi cháy."
  },
  {
    "id": "dp.bo_khi_dan_mat",
    "nghe": "luyen_dan",
    "ten": "Bổ Khí Đan phương (phong mật)",
    "ra": "item.bo_khi_dan",
    "chu": [
      {
        "id": "item.phong_mat",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 2,
    "mo_ta": "Mật ong độc nấu tới khi hết gắt, làm chất kết cho viên đan. Nấu non thì đan dính tay, nấu già thì đan đắng."
  },
  {
    "id": "dp.hoi_xuan_dan_dia",
    "nghe": "luyen_dan",
    "ten": "Hồi Xuân Đan phương (đỉa dịch)",
    "ra": "item.hoi_xuan_dan",
    "chu": [
      {
        "id": "item.huyet_dia_dich",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 1,
    "mo_ta": "Dịch đỉa đầm cầm máu, sên lửa nhỏ cho bay hết mùi tanh. Lang trung nghèo hay luyện thay sâm núi."
  },
  {
    "id": "dp.thong_mach_dan_giap",
    "nghe": "luyen_dan",
    "ten": "Thông Mạch Đan phương (vảy tê tê)",
    "ra": "item.thong_mach_dan",
    "chu": [
      {
        "id": "item.te_giap_phien",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 8,
    "mo_ta": "Vảy tê tê sao vàng tán bột: vị thuốc chui được qua đất thì chui được qua kinh mạch tắc. Sao cháy là mất tính."
  },
  {
    "id": "dp.khai_nguyen_dan_nhung",
    "nghe": "luyen_dan",
    "ten": "Khai Nguyên Đan phương (lộc nhung)",
    "ra": "item.khai_nguyen_dan",
    "chu": [
      {
        "id": "item.loc_nhung",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 4,
    "mo_ta": "Nhung non thái mỏng như giấy, ngâm rượu một đêm rồi mới vào lò. Nhung cháy là phí cả con hươu."
  },
  {
    "id": "dp.dinh_than_dan_kinh",
    "nghe": "luyen_dan",
    "ten": "Định Thần Đan phương (gương cổ)",
    "ra": "item.dinh_than_dan",
    "chu": [
      {
        "id": "item.co_kinh_phien",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 5,
    "mo_ta": "Mảnh gương cổ nung đỏ rồi tôi vào nước thuốc, cái bóng chậm nửa nhịp trong gương tan vào đan. Người luyện không được soi vào lò."
  },
  {
    "id": "dp.thong_than_dan_tuy",
    "nghe": "luyen_dan",
    "ten": "Thông Thần Đan phương (ngọc tủy)",
    "ra": "item.thong_than_dan",
    "chu": [
      {
        "id": "item.ngoc_tuy",
        "so": 2
      },
      {
        "id": "item.duoc_linh_phach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 60,
    "mo_ta": "Hai giọt ngọc tủy làm vỏ, một đốm dược linh làm nhân. Lửa văn giữ lâu, tủy đông lại trong suốt mới được mở lò."
  },
  {
    "id": "dp.thiet_kiem",
    "nghe": "luyen_bao",
    "ten": "Thiết Kiếm đồ phổ",
    "ra": "item.thiet_kiem",
    "chu": [
      {
        "id": "item.thiet_khoang",
        "so": 1
      }
    ],
    "phu": [],
    "linh_thach": 1,
    "mo_ta": "Bản vẽ nhập môn, thợ rèn nào cũng thuộc. Một cục quặng, một buổi quai búa, ra một thanh kiếm sắt."
  },
  {
    "id": "dp.thanh_phong_kiem",
    "nghe": "luyen_bao",
    "ten": "Thanh Phong Kiếm đồ phổ",
    "ra": "item.thanh_phong_kiem",
    "chu": [
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Hàn thiết phải nung lâu cho tạp chất chảy hết, lưỡi kiếm mới nhẹ như gió. Nóng vội thì kiếm giòn, chém đá là mẻ."
  },
  {
    "id": "dp.han_thiet_dao",
    "nghe": "luyen_bao",
    "ten": "Hàn Thiết Đao đồ phổ",
    "ra": "item.han_thiet_dao",
    "chu": [
      {
        "id": "item.han_thiet",
        "so": 1
      },
      {
        "id": "item.thiet_khoang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Sắt thường làm sống, hàn thiết làm lưỡi. Phải lửa mạnh cho hai thứ chảy vào nhau, rồi tôi một lần trong nước tuyết."
  },
  {
    "id": "dp.huyen_quy_thuan",
    "nghe": "luyen_bao",
    "ten": "Huyền Quy Thuẫn đồ phổ",
    "ra": "item.huyen_quy_thuan",
    "chu": [
      {
        "id": "item.quy_giap",
        "so": 1
      },
      {
        "id": "item.thiet_khoang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Mai rùa yêu khắc trận văn theo vân nứt có sẵn, viền sắt quanh mép. Khắc sai một nét, mai vỡ đôi."
  },
  {
    "id": "dp.thanh_suong_kiem",
    "nghe": "luyen_bao",
    "ten": "Thanh Sương Kiếm đồ phổ",
    "ra": "item.thanh_suong_kiem",
    "chu": [
      {
        "id": "item.han_thiet",
        "so": 2
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 2,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Bản chép lại từ kiếm Thanh Vân. Hai khối hàn thiết gấp lại chín lần, thêm một vị yêu tài cho lưỡi kiếm có linh tính."
  },
  {
    "id": "dp.tu_kim_phi_kiem",
    "nghe": "luyen_bao",
    "ten": "Tử Kim Phi Kiếm đồ phổ",
    "ra": "item.tu_kim_phi_kiem",
    "chu": [
      {
        "id": "item.tu_kim",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Tử kim cứng hơn mọi thứ sắt đá, lửa nhỏ nung cả năm không mềm. Phải huyết luyện, đổ cả tinh huyết vào lò mới ép nó thành kiếm."
  },
  {
    "id": "dp.lang_nha_chuy",
    "nghe": "luyen_bao",
    "ten": "Lang Nha Chủy đồ phổ",
    "ra": "item.lang_nha_chuy",
    "ra_cuc": "item.huyet_lang_chuy",
    "chu": [
      {
        "id": "item.lang_nha",
        "so": 1
      },
      {
        "id": "item.thiet_khoang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Đơn của thợ rèn quan ải Lương Quốc. Nanh sói mài thành lưỡi, đúc chuôi sắt bọc lấy. Huyết khí sói còn trong nanh thì lửa mạnh mới giữ được."
  },
  {
    "id": "dp.yeu_bi_giap",
    "nghe": "luyen_bao",
    "ten": "Yêu Bì Giáp đồ phổ",
    "ra": "item.yeu_bi_giap",
    "chu": [
      {
        "id": "item.yeu_bi",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 2,
    "mo_ta": "Hai tấm da yêu thú, một thùng dầu tùng. Nung lâu cho dầu ngấm tận thớ, lửa to thì da co lại như vỏ cây khô."
  },
  {
    "id": "dp.chu_ty_vong",
    "nghe": "luyen_bao",
    "ten": "Chu Ty Võng đồ phổ",
    "ra": "item.chu_ty_vong",
    "ra_cuc": "item.thien_chu_vong",
    "chu": [
      {
        "id": "item.chu_ty",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Tơ nhện hơ trên lửa nhỏ cho bớt dính rồi mới đan. Thợ Viêm Quốc đan lưới này bán cho thương đoàn bắt kẻ cướp sống."
  },
  {
    "id": "dp.ho_vi_phat",
    "nghe": "luyen_bao",
    "ten": "Hồ Vĩ Phất đồ phổ",
    "ra": "item.ho_vi_phat",
    "chu": [
      {
        "id": "item.ho_vi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Đuôi cáo phải hong trên lửa trầm bảy ngày, mị khí mới thấm vào cán. Hương trầm tiền nhiều hơn tiền lửa."
  },
  {
    "id": "dp.giao_can_cung",
    "nghe": "luyen_bao",
    "ten": "Giao Cân Cung đồ phổ",
    "ra": "item.giao_can_cung",
    "chu": [
      {
        "id": "item.giao_han_can",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "nguyen_lieu",
        "he": [
          "kim"
        ],
        "so": 1
      }
    ],
    "mo_ta": "Gân giao làm dây, một khối kim thiết đúc thân cung. Gân lạnh mà lò nóng, căng dây lúc nào là cả cái nghề."
  },
  {
    "id": "dp.bach_hac_vu_y",
    "nghe": "luyen_bao",
    "ten": "Bạch Hạc Vũ Y đồ phổ",
    "ra": "item.bach_hac_vu_y",
    "chu": [
      {
        "id": "item.hac_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Lông hạc kết bằng tơ tằm trên khung lửa ấm. Bản vẽ ghi thêm một dòng nhỏ dưới góc, nét run run, \"lông nhặt, chớ giết\"."
  },
  {
    "id": "dp.tuyet_bang_kiem",
    "nghe": "luyen_bao",
    "ten": "Tuyết Bằng Kiếm đồ phổ",
    "ra": "item.tuyet_bang_kiem",
    "ra_cuc": "item.cuu_tieu_bang_kiem",
    "chu": [
      {
        "id": "item.bang_vu",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Lông bằng cài hai bên sống kiếm hàn thiết. Lửa to thì lông cháy, lửa nhỏ thì lông không chịu bám vào thép."
  },
  {
    "id": "dp.ho_cot_dao",
    "nghe": "luyen_bao",
    "ten": "Hổ Cốt Đao đồ phổ",
    "ra": "item.ho_cot_dao",
    "chu": [
      {
        "id": "item.ho_cot",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Xương hổ già lồng trong sống đao. Hổ tôn kẻ mạnh, xương cũng thế, lửa yếu thì nó không chịu nhận lưỡi thép."
  },
  {
    "id": "dp.giao_lan_giap",
    "nghe": "luyen_bao",
    "ten": "Giao Lân Giáp đồ phổ",
    "ra": "item.giao_lan_giap",
    "chu": [
      {
        "id": "item.giao_long_lan",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "van",
    "mo_ta": "Vảy giao long xếp từng lớp, thêm một vị yêu tài làm keo. Một tấm vảy nung ba ngày mới mềm ra đủ để khâu."
  },
  {
    "id": "dp.thuong_lan_kiem",
    "nghe": "luyen_bao",
    "ten": "Thương Lan Kiếm cổ phổ",
    "ra": "item.thuong_lan_kiem",
    "chu": [
      {
        "id": "item.han_thiet",
        "so": 3
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 4,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 20,
    "mo_ta": "Bản vẽ trên da dê từ thời còn Trung Châu. Ba khối hàn thiết làm thân, một tấm vảy yêu thú cấp cao bọc sống, không thì kiếm nứt ngay khi ra lò."
  },
  {
    "id": "dp.van_yeu_phien",
    "nghe": "luyen_bao",
    "ten": "Vạn Yêu Phiên cổ phổ",
    "ra": "item.van_yeu_phien",
    "ra_cuc": "item.yeu_hoang_phien",
    "chu": [
      {
        "id": "item.yeu_vuong_noi_dan",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "vu",
    "mo_ta": "Khí phổ của một tông đã tan, chép từ hầm đá. Lấy nội đan yêu vương làm lõi, máu người luyện làm mực vẽ cờ. Lửa nhỏ thì nội đan tỉnh dậy trước khi kịp trấn."
  },
  {
    "id": "dp.phuoc_tien_tac",
    "nghe": "luyen_bao",
    "ten": "Phược Tiên Tác đồ phổ",
    "ra": "item.phuoc_tien_tac",
    "chu": [
      {
        "id": "item.thien_chu_mau_ty",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Tơ nhện mẹ phải hơ trên lửa nhỏ bảy ngày cho hết dính, rồi bện chín sợi làm một. Lửa to thì tơ co lại như tóc cháy."
  },
  {
    "id": "dp.pha_giap_toan",
    "nghe": "luyen_bao",
    "ten": "Phá Giáp Toản đồ phổ",
    "ra": "item.pha_giap_toan",
    "chu": [
      {
        "id": "item.thuc_kim_thu_xi",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Răng chuột gặm vàng khảm vào mũi khoan hàn thiết. Răng cứng hơn thép, phải lửa mạnh mới ép thép ôm được răng."
  },
  {
    "id": "dp.giao_le_chau_lien",
    "nghe": "luyen_bao",
    "ten": "Giao Lệ Châu Liên đồ phổ",
    "ra": "item.giao_le_chau_lien",
    "chu": [
      {
        "id": "item.giao_nhan_le",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Nước mắt người cá gặp lửa to là vỡ. Nung trong nồi nước biển, lửa liu riu cả tháng, ngọc mới mềm ra đủ để xâu."
  },
  {
    "id": "dp.thong_ty_kim_con",
    "nghe": "luyen_bao",
    "ten": "Thông Tý Kim Côn đồ phổ",
    "ra": "item.thong_ty_kim_con",
    "chu": [
      {
        "id": "item.thong_ty_vien_cot",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 50,
    "mo_ta": "Đổ đồng nóng vào lòng xương tay vượn, một hơi cho đầy. Ngập ngừng nửa nhịp thì đồng nguội giữa chừng, côn gãy đôi."
  },
  {
    "id": "dp.huyen_vu_thuan",
    "nghe": "luyen_bao",
    "ten": "Huyền Vũ Thuẫn đồ phổ",
    "ra": "item.huyen_vu_thuan",
    "chu": [
      {
        "id": "item.huyen_quy_long_giap",
        "so": 1
      },
      {
        "id": "item.quy_giap",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Mảnh mai mang huyết Huyền Vũ làm lòng khiên, mai rùa thường làm viền. Khắc trận theo vân sóng, mỗi nét nung một ngày."
  },
  {
    "id": "dp.liet_ho_dao",
    "nghe": "luyen_bao",
    "ten": "Liệt Hổ Đao đồ phổ",
    "ra": "item.liet_ho_dao",
    "chu": [
      {
        "id": "item.liet_ho_kim_trao",
        "so": 1
      },
      {
        "id": "item.thien_ngoai_van_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 100,
    "mo_ta": "Thép trời rơi lò thường không nung đỏ, phải huyết luyện. Vuốt hổ tướng đặt vào sống đao lúc thép còn sôi, hổ khí mới chịu nhập."
  },
  {
    "id": "dp.hoa_long_truong",
    "nghe": "luyen_bao",
    "ten": "Hóa Long Trượng cổ phổ",
    "ra": "item.hoa_long_truong",
    "chu": [
      {
        "id": "item.hoa_long_chau",
        "so": 1
      },
      {
        "id": "item.giao_long_giac",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 5,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Đơn của Giao tộc chép trên vảy, từ thời còn canh mộ Trung Châu. Nội châu phải nung ba năm trong sừng mới chịu ở yên."
  },
  {
    "id": "dp.hat_vi_tien",
    "nghe": "luyen_bao",
    "ten": "Hạt Vĩ Tiên đồ phổ",
    "ra": "item.hat_vi_tien",
    "chu": [
      {
        "id": "item.cuu_tiet_hat_vi",
        "so": 1
      },
      {
        "id": "item.canh_kim_tinh",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Mỗi đốt đuôi bọc một lớp canh kim mỏng như lá. Đuôi hạt còn sống, lửa nhỏ thì nó quẫy vỡ khuôn."
  },
  {
    "id": "dp.thien_bang_cung",
    "nghe": "luyen_bao",
    "ten": "Thiên Bằng Cung đồ phổ",
    "ra": "item.thien_bang_cung",
    "chu": [
      {
        "id": "item.bang_vuong_han_tuy",
        "so": 1
      },
      {
        "id": "item.bang_vuong_linh_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Tủy băng phải nung trong lửa âm, ấm dần từng chút như ủ trứng. Nóng quá một khắc là tủy chảy thành nước."
  },
  {
    "id": "dp.cuu_vi_huyen_dang",
    "nghe": "luyen_bao",
    "ten": "Cửu Vĩ Huyễn Đăng đồ phổ",
    "ra": "item.cuu_vi_huyen_dang",
    "chu": [
      {
        "id": "item.cuu_vi_ho_hon",
        "so": 1
      },
      {
        "id": "item.thien_ho_tam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Tim hồ ly làm bấc, hồn hồ ly làm lửa. Người luyện phải nhìn thẳng vào lửa suốt bảy ngày mà không bị nó mê."
  },
  {
    "id": "dp.thanh_bang_si",
    "nghe": "luyen_bao",
    "ten": "Thanh Bằng Sí đồ phổ",
    "ra": "item.thanh_bang_si",
    "chu": [
      {
        "id": "item.bang_vu",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 60,
    "mo_ta": "Lông bằng làm cánh chính, thêm một món lông vũ khác làm cánh phụ (lông hạc cũng được). Lửa nhỏ nung lâu, lông mới giữ gió."
  },
  {
    "id": "dp.kim_bang_si",
    "nghe": "luyen_bao",
    "ten": "Kim Bằng Sí đồ phổ",
    "ra": "item.kim_bang_si",
    "chu": [
      {
        "id": "item.tuyet_bang_cot",
        "so": 1
      },
      {
        "id": "item.bang_vu",
        "so": 2
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 4,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Xương cánh bằng làm sống, dát vàng khi xương còn đỏ lửa rồi cắm lông. Lửa mạnh mà nhanh, chậm tay thì xương nguội nứt."
  },
  {
    "id": "dp.con_bang_si",
    "nghe": "luyen_bao",
    "ten": "Côn Bằng Sí cổ phổ",
    "ra": "item.con_bang_si",
    "chu": [
      {
        "id": "item.bang_vuong_linh_vu",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Hai cọng lông bằng vương làm cốt, nung trong lửa âm bốn mươi chín ngày. Cánh thành thì tự vỗ, người luyện phải giữ chặt kẻo nó bay mất."
  },
  {
    "id": "dp.dan_lo_dia",
    "nghe": "luyen_bao",
    "ten": "Địa Hỏa đan lô đồ phổ",
    "ra": "item.dan_lo_dia",
    "chu": [
      {
        "id": "item.tu_kim",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 2,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 40,
    "mo_ta": "Tử kim đúc thân lò, một vị yêu tài hòa vào đồng cho lò biết giữ lửa. Lửa mạnh mà đều tay, đáy lò mới ra rãnh dẫn liền mạch."
  },
  {
    "id": "dp.phu_but_dia",
    "nghe": "luyen_bao",
    "ten": "Tử Ngọc Phù Bút đồ phổ",
    "ra": "item.phu_but_dia",
    "chu": [
      {
        "id": "item.ho_vuong_tu",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 2,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Râu hổ vương hơ lửa nhỏ cho mềm, bó lại làm ngòi rồi cắm vào cán. Lửa to thì râu xoăn lại, ngòi bút xòe như chổi."
  },
  {
    "id": "dp.dan_lo_thien",
    "nghe": "luyen_bao",
    "ten": "Cửu Long đan lô đồ phổ",
    "ra": "item.dan_lo_thien",
    "chu": [
      {
        "id": "item.thien_ngoai_van_thiet",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 30,
    "mo_ta": "Vẫn thiết từ trời rơi xuống, phải lửa mạnh nhất mới chảy. Đúc chín con rồng một lần, con nào nguội trước là cả lò nứt."
  },
  {
    "id": "dp.phu_but_thien",
    "nghe": "luyen_bao",
    "ten": "Bồ Đề Phù Bút đồ phổ",
    "ra": "item.phu_but_thien",
    "chu": [
      {
        "id": "item.tien_hac_tho_cot",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Xương hạc tiên làm lõi cán, ngoài bọc gỗ bồ đề. Lửa nhỏ hong bốn mươi ngày cho xương với gỗ ăn vào nhau."
  },
  {
    "id": "dp.dan_lo_tien",
    "nghe": "luyen_bao",
    "ten": "Thái Thượng đan lô cổ phổ",
    "ra": "item.dan_lo_tien",
    "chu": [
      {
        "id": "item.hu_linh_phach",
        "so": 1
      },
      {
        "id": "item.thien_ngoai_van_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 50,
    "mo_ta": "Vẫn thiết làm vỏ, Hư Linh Phách nhốt vào lòng lò thay cho lửa. Phách tỉnh dậy lúc lò chưa kín là nó trốn mất."
  },
  {
    "id": "dp.phu_but_tien",
    "nghe": "luyen_bao",
    "ten": "Lôi Mộc Phù Bút cổ phổ",
    "ra": "item.phu_but_tien",
    "chu": [
      {
        "id": "item.bang_vuong_linh_vu",
        "so": 1
      },
      {
        "id": "item.hu_linh_phach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Lông bằng vương làm ngòi, Hư Linh Phách luyện vào cán gỗ sét đánh cho bút có linh. Lửa nhỏ nung lâu, lửa gắt thì lông cháy trước khi phách kịp nhập."
  },
  {
    "id": "dp.khi_lo_pham",
    "nghe": "luyen_bao",
    "ten": "Thạch đỉnh đồ phổ",
    "ra": "item.khi_lo_pham",
    "chu": [
      {
        "id": "item.thiet_khoang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 4,
    "mo_ta": "Đẽo đá ong thành lòng đỉnh, nung một cục sắt làm đai bó quanh miệng. Lửa vừa phải, quá tay thì đá nổ."
  },
  {
    "id": "dp.khi_lo_hoang",
    "nghe": "luyen_bao",
    "ten": "Thiết đỉnh đồ phổ",
    "ra": "item.khi_lo_hoang",
    "chu": [
      {
        "id": "item.han_thiet",
        "so": 1
      },
      {
        "id": "item.thiet_khoang",
        "so": 4
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 20,
    "mo_ta": "Bốn cục sắt nấu thành gang, một khối hàn thiết làm lòng đỉnh. Đổ khuôn một lần cho liền khối, nguội dở là nứt."
  },
  {
    "id": "dp.khi_lo_huyen",
    "nghe": "luyen_bao",
    "ten": "Xích Diễm đỉnh đồ phổ",
    "ra": "item.khi_lo_huyen",
    "chu": [
      {
        "id": "item.han_thiet",
        "so": 2
      },
      {
        "id": "item.hoa_diep_dang",
        "so": 2
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 60,
    "mo_ta": "Dây Hỏa Diệp Đằng đốt cùng hàn thiết cho kim loại ngả đỏ, một vị yêu tài làm mắt trận dẫn hỏa. Khắc trận lúc đỉnh còn rực."
  },
  {
    "id": "dp.khi_lo_dia",
    "nghe": "luyen_bao",
    "ten": "Địa Mạch đỉnh đồ phổ",
    "ra": "item.khi_lo_dia",
    "chu": [
      {
        "id": "item.tu_kim",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Tử kim pha đồng đen đúc thân, khắc địa mạch đồ khi đỉnh còn mềm. Lửa nhỏ giữ lâu, nét khắc mới ăn sâu vào thớ kim."
  },
  {
    "id": "dp.khi_lo_thien",
    "nghe": "luyen_bao",
    "ten": "Cửu Diệu đỉnh đồ phổ",
    "ra": "item.khi_lo_thien",
    "chu": [
      {
        "id": "item.thien_ngoai_van_thiet",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 50,
    "mo_ta": "Vẫn thiết đúc thân đỉnh, chín đốm sáng khảm theo đúng vị sao. Lửa mạnh một hơi, khảm lệch một vì là cả đỉnh câm."
  },
  {
    "id": "dp.khi_lo_tien",
    "nghe": "luyen_bao",
    "ten": "Thái Sơ đỉnh cổ phổ",
    "ra": "item.khi_lo_tien",
    "chu": [
      {
        "id": "item.yeu_dan_5",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Ngũ Giai Yêu Đan luyện tan vào men đỉnh làm hỏa chủng, từ đó đỉnh tự cháy bằng linh khí. Lửa nhỏ nung trăm ngày cho men hóa ngọc."
  },
  {
    "id": "dp.dan_lo_dat",
    "nghe": "luyen_bao",
    "ten": "Đan lô đất nung đồ phổ",
    "ra": "item.dan_lo_dat",
    "chu": [
      {
        "id": "item.thiet_khoang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 3,
    "mo_ta": "Nặn lò bằng đất sét, nung một cục sắt làm đai quanh miệng. Lửa than nhỏ, nung một đêm là xong."
  },
  {
    "id": "dp.dan_lo_dong",
    "nghe": "luyen_bao",
    "ten": "Đồng đan lô đồ phổ",
    "ra": "item.dan_lo_dong",
    "chu": [
      {
        "id": "item.han_thiet",
        "so": 1
      },
      {
        "id": "item.thiet_khoang",
        "so": 3
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 15,
    "mo_ta": "Đúc lò ba chân, hàn thiết lót lòng cho chịu được lửa Huyền phẩm. Khắc vân mây trước khi đồng nguội hẳn."
  },
  {
    "id": "dp.dan_lo_huyen",
    "nghe": "luyen_bao",
    "ten": "Tử Văn đan lô đồ phổ",
    "ra": "item.dan_lo_huyen",
    "chu": [
      {
        "id": "item.han_thiet",
        "so": 2
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 70,
    "mo_ta": "Hàn thiết pha một vị yêu tài cho kim ngả tím, khắc trận văn giữ nhiệt lên thành lò. Lửa nhỏ, khắc chậm, sai nét là lò rò hơi."
  },
  {
    "id": "dp.phu_but_pham",
    "nghe": "luyen_bao",
    "ten": "Trúc Hào Bút đồ phổ",
    "ra": "item.phu_but_pham",
    "chu": [
      {
        "id": "item.thiet_khoang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 1,
    "mo_ta": "Rèn một khâu sắt nhỏ bịt đầu cán trúc, kẹp lông dê làm ngòi. Việc của buổi chiều."
  },
  {
    "id": "dp.phu_but_hoang",
    "nghe": "luyen_bao",
    "ten": "Lang Hào Bút đồ phổ",
    "ra": "item.phu_but_hoang",
    "chu": [
      {
        "id": "item.thu_tu",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 15,
    "mo_ta": "Lông gáy sói yêu khó kiếm, râu chuột yêu thay cũng được. Hơ lửa nhỏ cho thẳng, bó chặt làm ngòi, cứng mà đàn hồi."
  },
  {
    "id": "dp.phu_but_huyen",
    "nghe": "luyen_bao",
    "ten": "Hạc Vũ Phù Bút đồ phổ",
    "ra": "item.phu_but_huyen",
    "chu": [
      {
        "id": "item.hac_vu",
        "so": 1
      },
      {
        "id": "item.hac_cot",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 70,
    "mo_ta": "Lông cánh hạc kết thành ngòi, xương hạc mài làm lõi cán. Lửa nhỏ hong cho lông với xương quen hơi nhau."
  },
  {
    "id": "dp.tran_but_pham",
    "nghe": "luyen_bao",
    "ten": "Thiết Khắc Bút đồ phổ",
    "ra": "item.tran_but_pham",
    "chu": [
      {
        "id": "item.thiet_khoang",
        "so": 1
      }
    ],
    "phu": [],
    "linh_thach": 1,
    "mo_ta": "Một cục thiết khoáng nung đỏ, rèn dài ra rồi mài nhọn. Thợ rèn nào cũng làm được."
  },
  {
    "id": "dp.tran_but_hoang",
    "nghe": "luyen_bao",
    "ten": "Hàn Thiết Trận Bút đồ phổ",
    "ra": "item.tran_but_hoang",
    "chu": [
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 2,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 10,
    "mo_ta": "Hàn thiết rèn thành thân bút, một vị yêu tài tôi vào mũi cho cứng. Lửa mạnh, tôi một lần là xong."
  },
  {
    "id": "dp.tran_but_huyen",
    "nghe": "luyen_bao",
    "ten": "Thanh Ngọc Trận Bút đồ phổ",
    "ra": "item.tran_but_huyen",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.co_dong_tinh",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Phôi thanh ngọc tiện làm cán, tinh đồng cổ bọc mũi. Lửa nhỏ hong lâu cho ngọc với đồng quen hơi nhau."
  },
  {
    "id": "dp.tran_but_dia",
    "nghe": "luyen_bao",
    "ten": "Tử Kim Trận Bút đồ phổ",
    "ra": "item.tran_but_dia",
    "chu": [
      {
        "id": "item.tu_kim",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 40,
    "mo_ta": "Tử kim đúc liền thân bút một lần, lửa mạnh mà đều tay. Nguội rồi mới mài mũi."
  },
  {
    "id": "dp.tran_but_thien",
    "nghe": "luyen_bao",
    "ten": "Thất Tinh Trận Bút đồ phổ",
    "ra": "item.tran_but_thien",
    "chu": [
      {
        "id": "item.thien_ngoai_van_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Vẫn thiết từ trời rơi xuống, phải lửa mạnh nhất mới chảy. Bảy điểm sao khảm khi thân bút còn đỏ."
  },
  {
    "id": "dp.tran_but_tien",
    "nghe": "luyen_bao",
    "ten": "Huyền Cơ Trận Bút đồ phổ",
    "ra": "item.tran_but_tien",
    "chu": [
      {
        "id": "item.co_chung_dong",
        "so": 1
      },
      {
        "id": "item.hu_linh_phach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Đồng chuông cổ đúc cán, hư linh phách luyện vào mũi cho bút có linh. Lửa nhỏ nung lâu, phách tỉnh trước khi đồng kín là nó trốn."
  },
  {
    "id": "dp.pha_giap_toan_giac",
    "nghe": "luyen_bao",
    "ten": "Phá Giáp Toản đồ phổ (kim giác)",
    "ra": "item.pha_giap_toan",
    "chu": [
      {
        "id": "item.kim_giac",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 20,
    "mo_ta": "Đầu sừng Kim Giác Tê mài thành mũi khoan, hàn thiết bọc thân. Lửa vũ nung sừng cho tới khi sừng ngả màu vàng đậm."
  },
  {
    "id": "dp.linh_lung_thap_nha",
    "nghe": "luyen_bao",
    "ten": "Linh Lung Trấn Nhạc Tháp đồ phổ (cự tượng nha)",
    "ra": "item.linh_lung_tran_nhac_thap",
    "chu": [
      {
        "id": "item.cu_tuong_nha",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Phỏng tháp tiên nhân, lấy ngà voi Hồng Hoang làm cốt bảy tầng. Mỗi tầng khắc một vòng tuổi của ngà, khắc sai thì tháp nghiêng."
  },
  {
    "id": "dp.linh_lung_thap_quy",
    "nghe": "luyen_bao",
    "ten": "Linh Lung Trấn Nhạc Tháp đồ phổ (bối sơn quy giáp)",
    "ra": "item.linh_lung_tran_nhac_thap",
    "chu": [
      {
        "id": "item.boi_son_quy_giap",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Mai rùa cõng núi là núi biết đi, đem trấn vào đáy tháp thì tháp nặng như núi. Lửa văn ba ngày cho mai mềm rồi mới ghép."
  },
  {
    "id": "dp.than_hanh_ngoa_bao",
    "nghe": "luyen_bao",
    "ten": "Thần Hành Ngoa đồ phổ (da báo)",
    "ra": "item.than_hanh_ngoa",
    "chu": [
      {
        "id": "item.bao_bi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 15,
    "mo_ta": "Da báo đen thay da hươu, đi đêm không nghe tiếng sột soạt. Khắc trận văn lót đế bằng lửa nhỏ."
  },
  {
    "id": "dp.phu_but_thien_bao",
    "nghe": "luyen_bao",
    "ten": "Bồ Đề Phù Bút đồ phổ (lôi văn báo bì)",
    "ra": "item.phu_but_thien",
    "chu": [
      {
        "id": "item.loi_van_bao_bi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 150,
    "mo_ta": "Cắt sợi lông vằn tím trên da báo làm ngòi, cán bút bọc phần da còn lại. Ngòi tự tê, vẽ lôi phù không cần gọi sét."
  },
  {
    "id": "dp.van_doc_phien",
    "nghe": "luyen_bao",
    "ten": "Vạn Độc Phiên đồ phổ",
    "ra": "item.van_doc_phien",
    "chu": [
      {
        "id": "item.chuong_doc_tinh",
        "so": 2
      },
      {
        "id": "item.ngo_cong_doc_nang",
        "so": 1
      },
      {
        "id": "item.co_trung_mau",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 150,
    "mo_ta": "Thả cổ mẹ vào bình chướng khí cho nó ăn độc, rồi tẩm cả bình vào cờ. Túi độc rết làm mực thêu, người luyện phải ngậm giải độc đan."
  },
  {
    "id": "dp.quy_giap_thuan_ngac",
    "nghe": "luyen_bao",
    "ten": "Quy Giáp Thuẫn đồ phổ (vảy cá sấu)",
    "ra": "item.quy_giap_thuan",
    "chu": [
      {
        "id": "item.ngac_giap",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 2,
    "mo_ta": "Vảy lưng cá sấu trắng thay mai rùa, viền đồng, quai da trâu. Ngâm nước một đêm trước khi nung cho vảy khỏi nứt."
  },
  {
    "id": "dp.khi_lo_dia_du",
    "nghe": "luyen_bao",
    "ten": "Địa Mạch đỉnh đồ phổ (kình du)",
    "ra": "item.khi_lo_dia",
    "chu": [
      {
        "id": "item.kinh_du",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 80,
    "mo_ta": "Đúc đỉnh bằng hàn thiết, lòng đỉnh quét dầu Kình Ngư cho lửa đều và kim không bám thành. Lửa văn, quét ba lớp dầu."
  },
  {
    "id": "dp.huyen_vu_thuan_ngac",
    "nghe": "luyen_bao",
    "ten": "Huyền Vũ Thuẫn đồ phổ (huyền ngạc giáp)",
    "ra": "item.huyen_vu_thuan",
    "chu": [
      {
        "id": "item.huyen_ngac_giap",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Mai Hắc Thủy Huyền Ngạc thay mai quy long, đen như mực mà nhẹ hơn. Khắc trận văn thủy hệ dọc vân mai."
  },
  {
    "id": "dp.phu_but_hoang_tho",
    "nghe": "luyen_bao",
    "ten": "Phù bút đồ phổ (lông thỏ ngọc)",
    "ra": "item.phu_but_hoang",
    "chu": [
      {
        "id": "item.ngoc_tho_mao",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Lông thỏ ngọc bó làm đầu bút, đêm trăng ngòi tự sáng mờ. Bó chặt, ngòi mềm mà không xơ."
  },
  {
    "id": "dp.bich_ba_linh_tan",
    "nghe": "luyen_bao",
    "ten": "Bích Ba Linh Tán đồ phổ",
    "ra": "item.bich_ba_linh_tan",
    "chu": [
      {
        "id": "item.cam_ly_lan",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Hai mảnh vảy cá chép gấm ghép làm chóp ô, lụa xanh căng quanh. Vảy năm màu giữ màn nước quanh thân."
  },
  {
    "id": "dp.luu_van_chu",
    "nghe": "luyen_bao",
    "ten": "Lưu Vân Chu đồ phổ",
    "ra": "item.luu_van_chu",
    "chu": [
      {
        "id": "item.thanh_dieu_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Lông chim xanh của tiên nhân cắm ở mũi thuyền, thả gió là thuyền tự biết hướng. Gỗ trầm đẽo theo dáng mây trôi."
  },
  {
    "id": "dp.tu_kim_phi_kiem_nha",
    "nghe": "luyen_bao",
    "ten": "Tử Kim Phi Kiếm đồ phổ (thực thiết nha)",
    "ra": "item.tu_kim_phi_kiem",
    "chu": [
      {
        "id": "item.thuc_thiet_nha",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 20,
    "mo_ta": "Răng thú gặm sắt mài lưỡi, hàn thiết làm thân. Mài đến khi lưỡi cắt được sợi tóc thả trên mặt nước."
  },
  {
    "id": "dp.moc_dang_tac",
    "nghe": "luyen_bao",
    "ten": "Mộc Đằng Tác đồ phổ",
    "ra": "item.moc_dang_tac",
    "chu": [
      {
        "id": "item.thanh_dang_can",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 3,
    "mo_ta": "Gân Đằng Yêu bện ba sợi thành dây, ngâm nước thuốc cho dây còn sống. Dây sống thì tự biết quấn."
  },
  {
    "id": "dp.bich_lan_doc_cham",
    "nghe": "luyen_bao",
    "ten": "Bích Lân Độc Châm đồ phổ",
    "ra": "item.bich_lan_doc_cham",
    "chu": [
      {
        "id": "item.thuc_nhan_hoa_nhuy",
        "so": 1
      },
      {
        "id": "item.doc_khuan_bao",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 10,
    "mo_ta": "Rèn ba cây kim hàn thiết, ngâm vào nhụy hoa ăn thịt với bào tử nấm độc cho ngấm đều. Người rèn đeo bao tay da."
  },
  {
    "id": "dp.nhiep_hon_linh",
    "nghe": "luyen_bao",
    "ten": "Nhiếp Hồn Linh đồ phổ",
    "ra": "item.nhiep_hon_linh",
    "chu": [
      {
        "id": "item.hoe_am_moc",
        "so": 2
      },
      {
        "id": "item.oan_hon_ty",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 60,
    "mo_ta": "Gỗ hòe giữ hồn làm quả lắc, sợi khói oan hồn quấn quanh dây treo. Lắc một tiếng là hồn kẻ nghe chậm lại."
  },
  {
    "id": "dp.thanh_moc_thuan",
    "nghe": "luyen_bao",
    "ten": "Thanh Mộc Thuẫn đồ phổ",
    "ra": "item.thanh_moc_thuan",
    "chu": [
      {
        "id": "item.thien_nien_moc_tam",
        "so": 1
      },
      {
        "id": "item.thanh_dang_can",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Lõi cây nghìn năm gọt thành thuẫn tròn, gân Đằng Yêu bện làm quai. Lửa văn hong, gỗ còn sống thì thuẫn tự liền vết chém."
  },
  {
    "id": "dp.phu_tang_than_moc",
    "nghe": "luyen_bao",
    "ten": "Phù Tang Thần Mộc đồ phổ",
    "ra": "item.phu_tang_than_moc",
    "chu": [
      {
        "id": "item.ngo_dong_chi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Cành ngô đồng nơi Phượng đậu, hơ lửa văn đến khi ấm như nắng sớm. Không được để cháy, cháy là mất sinh khí."
  },
  {
    "id": "dp.hau_tho_thuan_tuy",
    "nghe": "luyen_bao",
    "ten": "Hậu Thổ Thuẫn đồ phổ (thạch tủy)",
    "ra": "item.hau_tho_thuan",
    "chu": [
      {
        "id": "item.thach_tuy_phan",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 5,
    "mo_ta": "Rắc bột thạch tủy vào đất sét đúc khiên, nung xong cứng như sắt. Lửa văn, nung một ngày."
  },
  {
    "id": "dp.ban_son_an",
    "nghe": "luyen_bao",
    "ten": "Bàn Sơn Ấn đồ phổ",
    "ra": "item.ban_son_an",
    "chu": [
      {
        "id": "item.son_tinh_hach",
        "so": 2
      },
      {
        "id": "item.linh_van_thach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 50,
    "mo_ta": "Hai lõi Sơn Tinh ép làm thân ấn, mắt trận bằng đá linh văn đặt giữa mặt ấn. Ấn thành thì đặt xuống đất là đất lún."
  },
  {
    "id": "dp.dan_lo_huyen_dong",
    "nghe": "luyen_bao",
    "ten": "Tử Văn đan lô đồ phổ (cổ đồng tinh)",
    "ra": "item.dan_lo_huyen",
    "chu": [
      {
        "id": "item.co_dong_tinh",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Trộn đồng gỉ của đỉnh thành tinh vào hàn thiết, lò giữ lửa đều mà khỏi khắc nhiều trận văn. Gõ thử nghe ngân như chuông nhỏ là được."
  },
  {
    "id": "dp.thua_anh_kiem",
    "nghe": "luyen_bao",
    "ten": "Thừa Ảnh Kiếm đồ phổ",
    "ra": "item.thua_anh_kiem",
    "chu": [
      {
        "id": "item.tan_kiem_y",
        "so": 2
      },
      {
        "id": "item.han_thiet",
        "so": 3
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 60,
    "mo_ta": "Hai mảnh kiếm gãy còn kiếm ý, ghép vào thân hàn thiết. Kiếm ý không chịu nhau thì rèn mãi không liền, phải để người rèn ngồi trước kiếm một đêm."
  },
  {
    "id": "dp.hoi_am_thuan",
    "nghe": "luyen_bao",
    "ten": "Hồi Âm Thuẫn đồ phổ",
    "ra": "item.hoi_am_thuan",
    "chu": [
      {
        "id": "item.co_chung_dong",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 3
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Đúc mảnh chuông chùa vào giữa mặt thuẫn hàn thiết. Đúc xong búng tay thử, ngân hết một nén hương mới đạt."
  },
  {
    "id": "dp.hau_tho_kim_cang_an",
    "nghe": "luyen_bao",
    "ten": "Hậu Thổ Kim Cang Ấn đồ phổ",
    "ra": "item.hau_tho_kim_cang_an",
    "chu": [
      {
        "id": "item.sa_trung_tam",
        "so": 2
      },
      {
        "id": "item.sa_linh_tinh",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Tim sa trùng làm lõi ấn, cát linh đúc vỏ ngoài. Đặt ấn vào lò, cát tự bò về bọc kín lõi."
  },
  {
    "id": "dp.dia_sat_dinh",
    "nghe": "luyen_bao",
    "ten": "Địa Sát Đinh đồ phổ",
    "ra": "item.dia_sat_dinh",
    "chu": [
      {
        "id": "item.bach_cot_phan",
        "so": 1
      },
      {
        "id": "item.thi_du",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 5,
    "mo_ta": "Rèn bảy đinh hàn thiết, tôi trong dầu thi rồi lăn qua bột xương. Lấy độc trị độc, đinh nhớ mùi xác mà ghim."
  },
  {
    "id": "dp.huyet_anh_dao",
    "nghe": "luyen_bao",
    "ten": "Huyết Ảnh Đao đồ phổ",
    "ra": "item.huyet_anh_dao",
    "chu": [
      {
        "id": "item.cuong_thi_nha",
        "so": 1
      },
      {
        "id": "item.thi_du",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 20,
    "mo_ta": "Răng cương thi mài lưỡi, thi du tôi lửa, hàn thiết làm sống. Thi độc trong lưỡi làm vết chém không chịu khép."
  },
  {
    "id": "dp.khu_thi_linh",
    "nghe": "luyen_bao",
    "ten": "Khu Thi Linh đồ phổ",
    "ra": "item.khu_thi_linh",
    "chu": [
      {
        "id": "item.thi_hach",
        "so": 1
      },
      {
        "id": "item.luyen_thi_phu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 50,
    "mo_ta": "Treo thi hạch trong lòng chuông đồng, dán lá phù luyện thi lên quai. Lửa văn, chuông nguội rồi mới gắn lưỡi."
  },
  {
    "id": "dp.thien_dien_phap_y",
    "nghe": "luyen_bao",
    "ten": "Thiên Diện Pháp Y đồ phổ",
    "ra": "item.thien_dien_phap_y",
    "chu": [
      {
        "id": "item.hoa_bi",
        "so": 1
      },
      {
        "id": "item.bien_buc_si",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 50,
    "mo_ta": "Tấm họa bì làm lớp lót, cánh dơi màng đỏ khâu lớp ngoài. Khâu trong bóng tối, đừng nhìn vào mặt vẽ trên da."
  },
  {
    "id": "dp.ho_tam_noi_giap",
    "nghe": "luyen_bao",
    "ten": "Hộ Tâm Nội Giáp đồ phổ",
    "ra": "item.ho_tam_noi_giap",
    "chu": [
      {
        "id": "item.thi_mao",
        "so": 1
      },
      {
        "id": "item.co_khoi_tan_giap",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Mảnh giáp khôi lỗi cổ cắt làm tấm hộ tâm, lông Mao Cương dệt quanh viền. Lông cứng như kim, phải nung đỏ mới uốn được."
  },
  {
    "id": "dp.huyen_thiet_ho_uyen",
    "nghe": "luyen_bao",
    "ten": "Huyền Thiết Hộ Uyển đồ phổ",
    "ra": "item.huyen_thiet_ho_uyen",
    "chu": [
      {
        "id": "item.moc_khoi_hach",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 5,
    "mo_ta": "Lõi khôi lỗi gỗ khảm trong bao cổ tay, như khớp tay người gỗ: gạt đao xong, lõi bật lại đẩy cú đấm theo đà."
  },
  {
    "id": "dp.ly_hoa_hoan_dao",
    "nghe": "luyen_bao",
    "ten": "Ly Hỏa Hoàn Đao đồ phổ",
    "ra": "item.ly_hoa_hoan_dao",
    "chu": [
      {
        "id": "item.dong_khoi_hach",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 20,
    "mo_ta": "Tháo chín vòng xoay trong lõi khôi lỗi đồng, gắn lên lưng đao. Vòng còn tự quay thì mỗi nhát chém chín vòng cùng reo."
  },
  {
    "id": "dp.oanh_thien_loi_chuy",
    "nghe": "luyen_bao",
    "ten": "Oanh Thiên Lôi Chùy đồ phổ",
    "ra": "item.oanh_thien_loi_chuy",
    "chu": [
      {
        "id": "item.co_khoi_hach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 100,
    "mo_ta": "Đập vỡ vỏ Cổ Khôi Hạch, chia tia sét bị nhốt làm đôi, đúc vào hai đầu chùy. Lửa vũ, đúc dưới trời giông."
  },
  {
    "id": "dp.phi_cuong_trao",
    "nghe": "luyen_bao",
    "ten": "Phi Cương Trảo đồ phổ",
    "ra": "item.phi_cuong_trao",
    "chu": [
      {
        "id": "item.phi_cuong_tuy",
        "so": 1
      },
      {
        "id": "item.thi_khoi_hach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Lấy lõi thi khôi làm khớp, tủy Phi Cương rót vào làm gân. Vuốt rèn xong còn tự co duỗi, đặt trong hộp sắt."
  },
  {
    "id": "dp.huyet_ha_phien",
    "nghe": "luyen_bao",
    "ten": "Huyết Hà Phiên đồ phổ",
    "ra": "item.huyet_ha_phien",
    "chu": [
      {
        "id": "item.huyet_anh_tinh",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Tan Huyết Ảnh Tinh vào chậu nước thuốc, nhúng lụa trắng bảy lần. Lụa đỏ thẫm mà không khô thì cờ đã thành."
  },
  {
    "id": "dp.van_quy_phien",
    "nghe": "luyen_bao",
    "ten": "Vạn Quỷ Phiên đồ phổ",
    "ra": "item.van_quy_phien",
    "chu": [
      {
        "id": "item.quy_vuong_an",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Cắm cán cờ vào Quỷ Vương Ấn, thắp âm hỏa bảy đêm cho tên người chết trên ấn bò lên mặt cờ."
  },
  {
    "id": "dp.xich_huy_tien",
    "nghe": "luyen_bao",
    "ten": "Xích Hủy Tiên đồ phổ",
    "ra": "item.xich_huy_tien",
    "chu": [
      {
        "id": "item.huy_lan",
        "so": 1
      },
      {
        "id": "item.han_thiet",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 80,
    "mo_ta": "Vảy Hủy ghép lên lõi hàn thiết như vảy rắn thật. Lửa vũ, vảy nóng sẵn nên lò dễ quá lửa."
  },
  {
    "id": "dp.bi_hi_tran_bi",
    "nghe": "luyen_bao",
    "ten": "Bí Hí Trấn Bi đồ phổ",
    "ra": "item.bi_hi_tran_bi",
    "chu": [
      {
        "id": "item.bi_hi_giap",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Mài mai long tử thành bia, khắc ngược chữ cũ cho xuôi lại. Chữ xuôi thì bia mới chịu đứng."
  },
  {
    "id": "dp.phi_lan_tieu",
    "nghe": "luyen_bao",
    "ten": "Phi Lân Tiêu đồ phổ",
    "ra": "item.phi_lan_tieu",
    "chu": [
      {
        "id": "item.trao_phong_lan",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 80,
    "mo_ta": "Chia vảy long tử làm bảy, mài mỏng như lá. Thả thử từ mái nhà, mảnh nào lượn đủ một vòng mới giữ."
  },
  {
    "id": "dp.lieu_nguyen_phien",
    "nghe": "luyen_bao",
    "ten": "Liệu Nguyên Phiến đồ phổ",
    "ra": "item.lieu_nguyen_phien",
    "chu": [
      {
        "id": "item.tat_phuong_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 100,
    "mo_ta": "Kết lông hạc lửa thành quạt trong gian kín gió. Có gió lọt vào là lông bén lửa, cả lò cháy theo."
  },
  {
    "id": "dp.quy_loi_co",
    "nghe": "luyen_bao",
    "ten": "Quỳ Lôi Cổ đồ phổ",
    "ra": "item.quy_loi_co",
    "chu": [
      {
        "id": "item.quy_nguu_bi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Căng da trâu một chân lên tang trống đồng, đánh thử ba tiếng dưới trời giông. Sét đáp lời thì trống thành."
  },
  {
    "id": "dp.toan_nghe_lu",
    "nghe": "luyen_bao",
    "ten": "Toan Nghê Lư đồ phổ",
    "ra": "item.toan_nghe_lu",
    "chu": [
      {
        "id": "item.toan_nghe_tu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Cuộn râu long tử trong lòng lư đồng, lửa văn hong ba ngày cho râu nhả mùi trầm."
  },
  {
    "id": "dp.phi_liem_phong_y",
    "nghe": "luyen_bao",
    "ten": "Phi Liêm Phong Y đồ phổ",
    "ra": "item.phi_liem_phong_y",
    "chu": [
      {
        "id": "item.phi_liem_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Dệt lông cánh thần gió thành áo, khung dệt phải chặn đá. Buông tay là sợi bay mất."
  },
  {
    "id": "dp.cuu_anh_ho",
    "nghe": "luyen_bao",
    "ten": "Cửu Anh Hồ đồ phổ",
    "ra": "item.cuu_anh_ho",
    "chu": [
      {
        "id": "item.cuu_anh_dam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Chia mật hung thú làm đôi theo đường nóng lạnh, mỗi nửa một ngăn hồ lô. Hai ngăn phải ngăn bằng ngọc, sai một khe là nổ lò."
  },
  {
    "id": "dp.cung_ky_dao",
    "nghe": "luyen_bao",
    "ten": "Cùng Kỳ Đao đồ phổ",
    "ra": "item.cung_ky_dao",
    "chu": [
      {
        "id": "item.cung_ky_si",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Xương cánh hổ hung thú làm sống đao, rèn bằng lửa vũ. Người rèn có tội thì xương ấm tay, rèn dễ hơn."
  },
  {
    "id": "dp.thao_thiet_an",
    "nghe": "luyen_bao",
    "ten": "Thao Thiết Ấn đồ phổ",
    "ra": "item.thao_thiet_an",
    "chu": [
      {
        "id": "item.thao_thiet_van_cot",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Đúc đồng quanh xương hàm Thao Thiết, giữ nguyên vân cũ. Đừng để đan dược trong gian luyện, xương hút hết."
  },
  {
    "id": "dp.ly_long_giap",
    "nghe": "luyen_bao",
    "ten": "Ly Long Giáp đồ phổ",
    "ra": "item.ly_long_giap",
    "chu": [
      {
        "id": "item.ly_long_lan",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Ngâm vảy rồng trong chậu nước cho tới khi nước thôi xoáy, rồi mới kết giáp. Vảy còn xoáy là chưa thuần."
  },
  {
    "id": "dp.hoa_lan_truong",
    "nghe": "luyen_bao",
    "ten": "Hỏa Lân Trượng đồ phổ",
    "ra": "item.hoa_lan_truong",
    "chu": [
      {
        "id": "item.hoa_lan_giac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Gắn sừng Hỏa Lân lên đầu trượng tử đàn. Người luyện phải không mang sát ý, lửa trong sừng mới chịu nằm yên."
  },
  {
    "id": "dp.tinh_dau_thuan",
    "nghe": "luyen_bao",
    "ten": "Tinh Đẩu Thuẫn đồ phổ",
    "ra": "item.tinh_dau_thuan",
    "chu": [
      {
        "id": "item.huyen_vu_van_giap",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Giữ nguyên vân sao trên mai Huyền Quy, viền đồng đen. Luyện dưới trời sao, đêm có mây thì nghỉ."
  },
  {
    "id": "dp.hoa_loan_vu_y",
    "nghe": "luyen_bao",
    "ten": "Hỏa Loan Vũ Y đồ phổ",
    "ra": "item.hoa_loan_vu_y",
    "chu": [
      {
        "id": "item.hoa_loan_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Dệt lông đuôi Hỏa Loan, lửa văn hong suốt. Lông cháy thì đợi sáng hôm sau mọc lại rồi dệt tiếp."
  },
  {
    "id": "dp.thanh_loan_tram",
    "nghe": "luyen_bao",
    "ten": "Thanh Loan Trâm đồ phổ",
    "ra": "item.thanh_loan_tram",
    "chu": [
      {
        "id": "item.thanh_loan_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Cài lông Thanh Loan vào trâm ngọc, cắm trâm vào chậu cây ba ngày. Cây ra lộc thì trâm đã thành."
  },
  {
    "id": "dp.lang_nguyet_cau",
    "nghe": "luyen_bao",
    "ten": "Lang Nguyệt Câu đồ phổ",
    "ra": "item.lang_nguyet_cau",
    "chu": [
      {
        "id": "item.thien_lang_nguyet_phach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Khảm mắt Thiên Lang vào chuôi câu bạc, luyện trong đêm trăng tròn. Sói quanh đó hú thì phải dừng tay chờ chúng im."
  },
  {
    "id": "dp.van_tuong_dien",
    "nghe": "luyen_bao",
    "ten": "Vạn Tướng Diện đồ phổ",
    "ra": "item.van_tuong_dien",
    "chu": [
      {
        "id": "item.van_tuong_ho_dien",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Phủ mặt người Hồ Vương lên khuôn ngọc, lửa văn hong cho mặt quên chủ cũ. Người luyện đừng soi gương trong lúc ấy."
  },
  {
    "id": "dp.long_huyet_thuong",
    "nghe": "luyen_bao",
    "ten": "Long Huyết Thương đồ phổ",
    "ra": "item.long_huyet_thuong",
    "chu": [
      {
        "id": "item.long_huyet_giao_cot",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Đốt sống giao vương nối làm cán thương, rèn trong nước lạnh. Nước quanh cán sôi hết ba vạc mới thành."
  },
  {
    "id": "dp.phu_dieu_si",
    "nghe": "luyen_bao",
    "ten": "Phù Diêu Sí đồ phổ",
    "ra": "item.phu_dieu_si",
    "chu": [
      {
        "id": "item.phu_dieu_than_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Kết lông cánh chủ Bằng Vương thành đôi cánh, luyện trên đỉnh núi có gió lớn. Lông tự lơ lửng, khung phải chằng dây."
  },
  {
    "id": "dp.hung_tam_kinh",
    "nghe": "luyen_bao",
    "ten": "Hùng Tâm Kính đồ phổ",
    "ra": "item.hung_tam_kinh",
    "chu": [
      {
        "id": "item.thiet_the_hung_tam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Đúc đồng quanh quả tim Hùng Vương thành gương hộ tâm, giữ nguyên vết thệ ấn ở mặt sau."
  },
  {
    "id": "dp.bach_ho_dao",
    "nghe": "luyen_bao",
    "ten": "Bạch Hổ Đao đồ phổ",
    "ra": "item.bach_ho_dao",
    "chu": [
      {
        "id": "item.bach_ho_huyet_phach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Nung lưỡi đao đỏ rồi tôi qua tinh huyết Bạch Hổ bảy lần. Lưỡi trắng như sương là xong."
  },
  {
    "id": "dp.tu_sa_doc_cham",
    "nghe": "luyen_bao",
    "ten": "Tử Sa Độc Châm đồ phổ",
    "ra": "item.tu_sa_doc_cham",
    "chu": [
      {
        "id": "item.tu_sa_doc_tuy",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Ngâm chín cây kim trong tủy độc Hạt Vương bốn mươi chín ngày. Bình ngâm phải là ngọc, đồ sứ bị ăn thủng."
  },
  {
    "id": "dp.vien_tam_moc_ngu",
    "nghe": "luyen_bao",
    "ten": "Viên Tâm Mộc Ngư đồ phổ",
    "ra": "item.vien_tam_moc_ngu",
    "chu": [
      {
        "id": "item.thinh_phap_vien_tam",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Khoét mõ gỗ, khảm viên tâm ngọc vào lòng mõ. Luyện vừa luyện vừa tụng kinh, đứt tiếng tụng là ngọc nứt."
  },
  {
    "id": "dp.kim_thue_bao_y",
    "nghe": "luyen_bao",
    "ten": "Kim Thuế Bảo Y đồ phổ",
    "ra": "item.kim_thue_bao_y",
    "chu": [
      {
        "id": "item.kim_than_xa_thue",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Cắt xác lột Xà Vương may áo, giữ nguyên lớp vảy vàng. Luyện xong phải đem qua một ngôi miếu cho hương khói ám vào."
  },
  {
    "id": "dp.liet_ung_cung",
    "nghe": "luyen_bao",
    "ten": "Liệt Ưng Cung đồ phổ",
    "ra": "item.liet_ung_cung",
    "chu": [
      {
        "id": "item.ung_ton_cuong_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 300,
    "mo_ta": "Lông cánh ưng tôn cắt làm đuôi tên, sừng thú làm thân cung. Mép lông sắc, cắm đuôi tên phải đeo bao tay."
  },
  {
    "id": "dp.thon_kim_dai",
    "nghe": "luyen_bao",
    "ten": "Thôn Kim Đại đồ phổ",
    "ra": "item.thon_kim_dai",
    "chu": [
      {
        "id": "item.thon_kim_thu_nang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Lộn túi má chuột già, khâu miệng bằng chỉ vàng, khắc trận văn thu nạp lên lớp lót."
  },
  {
    "id": "dp.cuu_pham_lien_dai_thiem",
    "nghe": "luyen_bao",
    "ten": "Cửu Phẩm Liên Đài đồ phổ (thiềm châu)",
    "ra": "item.cuu_pham_lien_dai",
    "chu": [
      {
        "id": "item.thon_nguyet_thiem_chau",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Đặt thiềm châu giữa đài sen chín tầng cánh, bóng trăng trong châu tụ linh khí thành sương. Lửa văn, luyện ba đêm trăng."
  },
  {
    "id": "dp.tu_thu_tien_y_chu",
    "nghe": "luyen_bao",
    "ten": "Tử Thụ Tiên Y đồ phổ (vạn ti chu nang)",
    "ra": "item.tu_thu_tien_y",
    "chu": [
      {
        "id": "item.van_ti_chu_nang",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Bóp tuyến tơ nhện mẹ lấy sợi bạc, dệt liền không nối. Thợ dệt ngồi khung một mạch đến khi hết tơ."
  },
  {
    "id": "dp.dinh_hai_chau_ca",
    "nghe": "luyen_bao",
    "ten": "Định Hải Châu đồ phổ (hải ca châu)",
    "ra": "item.dinh_hai_chau",
    "chu": [
      {
        "id": "item.hai_ca_chau",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Lấy ngọc trai ngư cơ làm hạt cái, tụ nước biển quanh thành chuỗi châu. Người luyện bịt tai, nghe tiếng hát là lạc tay."
  },
  {
    "id": "dp.quy_tuc_phu",
    "nghe": "che_phu",
    "ten": "Quy Tức Phù phương",
    "ra": "item.quy_tuc_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Khép trận văn trong giấy ngọc để tìm lại trận đã biết cùng Thổ."
  },
  {
    "id": "dp.na_di_phu",
    "nghe": "che_phu",
    "ten": "Na Di Phù phương",
    "ra": "item.na_di_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Vẽ vòng phù liền nét, dời thân trong tầm ba nghìn dặm."
  },
  {
    "id": "dp.hoa_dan_phu",
    "nghe": "che_phu",
    "ten": "Hỏa Đạn Phù phương",
    "ra": "item.hoa_dan_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 2,
    "mo_ta": "Phù tập tay của phù đồ. Vòng xoáy phải vẽ một hơi, dừng bút giữa chừng thì lửa tắt trong giấy."
  },
  {
    "id": "dp.bua_tru_ta",
    "nghe": "che_phu",
    "ten": "Bùa trừ tà phương",
    "ra": "item.bua_tru_ta",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 6,
    "mo_ta": "Mực chu sa hòa nước lá cây sắc đặc. Ông từ dặn vẽ một hơi không đứt, nét đứt thì dương khí rò ra."
  },
  {
    "id": "dp.canh_kim_phu",
    "nghe": "che_phu",
    "ten": "Canh Kim Phù phương",
    "ra": "item.canh_kim_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.lang_nha",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Răng sói nghiền mịn trộn vào chu sa. Nét phù sắc như vết dao, phải hạ bút dứt khoát."
  },
  {
    "id": "dp.dan_loi_phu",
    "nghe": "che_phu",
    "ten": "Dẫn Lôi Phù phương",
    "ra": "item.dan_loi_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 8,
    "mo_ta": "Phải vẽ lúc trời oi, mực yêu huyết mới bắt được lôi khí. Nét ngập ngừng thì sét đánh ngược vào tay."
  },
  {
    "id": "dp.dinh_than_phu",
    "nghe": "che_phu",
    "ten": "Định Thân Phù phương",
    "ra": "item.dinh_than_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.thiem_to",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 8,
    "mo_ta": "Một giọt mủ cóc yêu hòa vào mực. Phải vẽ chậm, nét cuối khép vòng mới giữ được người."
  },
  {
    "id": "dp.kim_cuong_phu",
    "nghe": "che_phu",
    "ten": "Kim Cương Phù phương",
    "ra": "item.kim_cuong_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "tho"
        ],
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 5,
    "mo_ta": "Phù hộ thân chép từ kinh nhà chùa. Nét dày, chậm, đều tay như tụng kinh."
  },
  {
    "id": "dp.than_hanh_phu",
    "nghe": "che_phu",
    "ten": "Thần Hành Phù phương",
    "ra": "item.than_hanh_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "so": 1
      }
    ],
    "linh_thach": 5,
    "mo_ta": "Mực ngâm một vị thảo dược hệ mộc cho nhẹ chân. Không kén nét bút, phù đồ nào cũng vẽ được."
  },
  {
    "id": "dp.truyen_am_phu",
    "nghe": "che_phu",
    "ten": "Truyền Âm Phù phương",
    "ra": "item.truyen_am_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "thuy"
        ],
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 3,
    "mo_ta": "Nước mài mực phải là nước sương của một vị linh dược hệ thủy, tiếng nói mới thấm vào giấy. Gấp hạc cho chậm."
  },
  {
    "id": "dp.tam_lo_phu",
    "nghe": "che_phu",
    "ten": "Tầm Lộ Phù phương",
    "ra": "item.tam_lo_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 2
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "tho"
        ],
        "so": 1
      }
    ],
    "linh_thach": 5,
    "mo_ta": "Rắc bột rễ cây hệ thổ lên giấy trước khi vẽ, phù mới nhận ra đất. Hai lớp giấy dán chồng cho bay được xa."
  },
  {
    "id": "dp.thanh_phong_phu",
    "nghe": "che_phu",
    "ten": "Thanh Phong Phù phương",
    "ra": "item.thanh_phong_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 2
      },
      {
        "id": "item.hac_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Lông hạc đốt thành tro hòa vào mực. Nét phải nhẹ như lông, nặng tay một chút là gió không ra."
  },
  {
    "id": "dp.thien_ti_phu",
    "nghe": "che_phu",
    "ten": "Thiên Ti Phù phương",
    "ra": "item.thien_ti_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 2
      },
      {
        "id": "item.chu_ty",
        "so": 2
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Se tơ nhện yêu vào từng nét, chín vòng lưới không vòng nào được đứt. Ai nóng vội thì tơ rối thành cục."
  },
  {
    "id": "dp.huyen_quy_phu",
    "nghe": "che_phu",
    "ten": "Huyền Quy Phù phương",
    "ra": "item.huyen_quy_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 2
      },
      {
        "id": "item.quy_giap",
        "so": 1
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Mai rùa nghiền làm nền, nét phù vẽ theo vân mai. Chậm thì sống, nhanh thì vỡ."
  },
  {
    "id": "dp.dia_don_phu",
    "nghe": "che_phu",
    "ten": "Địa Độn Phù phương",
    "ra": "item.dia_don_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 2
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "tho"
        ],
        "so": 2
      }
    ],
    "linh_thach": 25,
    "mo_ta": "Mực hòa đất lấy từ đáy giếng sâu cùng hai vị linh dược hệ thổ. Phù giữ mạng, tán tu nào có đơn này cũng giấu kỹ."
  },
  {
    "id": "dp.huyen_bang_phu",
    "nghe": "che_phu",
    "ten": "Huyền Băng Phù phương",
    "ra": "item.huyen_bang_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.bang_vu",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "bang",
          "thuy"
        ],
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "van",
    "mo_ta": "Lông chim bằng làm ngòi phụ, mực pha nhựa linh dược hàn thủy. Phải vẽ trong gian lạnh, mực ấm là băng không kết."
  },
  {
    "id": "dp.tu_tieu_loi_phu",
    "nghe": "che_phu",
    "ten": "Tử Tiêu Lôi Phù phương",
    "ra": "item.tu_tieu_loi_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "loi"
        ],
        "pham": 3,
        "so": 2
      }
    ],
    "hoa": "vu",
    "linh_thach": 80,
    "mo_ta": "Vẽ trong đêm giông, một hơi từ đầu tới cuối, đợi sét đánh xuống mới hạ nét chót. Chậm một nhịp là lôi khí tan."
  },
  {
    "id": "dp.kim_thiem_phu",
    "nghe": "che_phu",
    "ten": "Kim Thiềm Phù phương",
    "ra": "item.kim_thiem_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      },
      {
        "id": "item.kim_thiem_bao_chau",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Bảo châu cóc yêu mài thành bột hòa vào mực. Vẽ chậm, nét cuối thắt lại như miệng cóc khép."
  },
  {
    "id": "dp.cuu_tieu_phong_phu",
    "nghe": "che_phu",
    "ten": "Cửu Tiêu Phong Phù phương",
    "ra": "item.cuu_tieu_phong_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.tien_hac_tho_cot",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Xương hạc tiên làm cán ngòi phụ, gió trong xương thổi theo nét. Vẽ một hơi từ dưới lên như hạc cất cánh."
  },
  {
    "id": "dp.pha_quan_phu",
    "nghe": "che_phu",
    "ten": "Phá Quân Phù phương",
    "ra": "item.pha_quan_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      },
      {
        "id": "item.huyet_nguyet_lang_nha",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Phù của thợ phù quan ải Lương Quốc, nghiền nanh sói trăng máu vào chu sa. Nét phù sắc như vết chém, hạ bút không được ngoái lại."
  },
  {
    "id": "dp.bat_dong_phu",
    "nghe": "che_phu",
    "ten": "Bất Động Phù phương",
    "ra": "item.bat_dong_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      },
      {
        "id": "item.kim_boi_hung_bi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Da lưng gấu yêu cắt thành tấm mỏng làm nền phù thay giấy. Nét dày và chậm, như người đắp đê."
  },
  {
    "id": "dp.kim_lan_doc_phu",
    "nghe": "che_phu",
    "ten": "Kim Lân Độc Phù phương",
    "ra": "item.kim_lan_doc_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.kim_lan_mang_dom",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "yeu_tai",
        "pham": 5,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 50,
    "mo_ta": "Mật mãng xà pha mực, thêm một vị yêu tài cấp cao cho độc khỏi cắn ngược. Người vẽ ngậm giải độc đan, mỗi nét thở một hơi."
  },
  {
    "id": "dp.canh_kim_phu_nha",
    "nghe": "che_phu",
    "ten": "Canh Kim Phù phương (nanh lợn)",
    "ra": "item.canh_kim_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.tru_nha",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Nanh lợn rừng nghiền bột trộn vào chu sa, nét phù cứng như mũi giáo. Vẽ một hơi, đừng nhấc bút giữa chừng."
  },
  {
    "id": "dp.dinh_than_phu_diep",
    "nghe": "che_phu",
    "ten": "Định Thân Phù phương (điệp phấn)",
    "ra": "item.dinh_than_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.diep_phan",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Phấn cánh bướm rắc lên mực còn ướt, nét phù óng ánh như bụi trăng. Người vẽ phải bịt mũi."
  },
  {
    "id": "dp.na_di_phu_sa",
    "nghe": "che_phu",
    "ten": "Na Di Phù phương (sa linh)",
    "ra": "item.na_di_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.sa_linh_tinh",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Cát linh luôn bò về một đống, trộn vào mực thì phù cũng biết đường về chỗ cũ. Rắc cát lên giấy trước khi vẽ."
  },
  {
    "id": "dp.dia_don_phu_vu",
    "nghe": "che_phu",
    "ten": "Địa Độn Phù phương (vụ tinh)",
    "ra": "item.dia_don_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 2
      },
      {
        "id": "item.vu_tinh",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Mở nắp lọ sương trong gian kín, để sương thấm vào giấy rồi mới vẽ. Phù độn kèm một làn sương, kẻ địch không thấy người chìm xuống đâu."
  },
  {
    "id": "dp.huyen_bang_phu_chau",
    "nghe": "che_phu",
    "ten": "Huyền Băng Phù phương (băng phách châu)",
    "ra": "item.huyen_bang_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.bang_phach_chau",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Hai hạt băng phách châu mài trong nghiên đá lạnh, mực đặc như sương đông. Vẽ xong phải để phù trong hộp đá."
  },
  {
    "id": "dp.thuong_lang_phu",
    "nghe": "che_phu",
    "ten": "Thương Lãng Phù phương",
    "ra": "item.thuong_lang_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.thuy_linh_chau",
        "so": 2
      },
      {
        "id": "item.thuy_hau_mao",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Thủy linh châu mài làm mực, lông khỉ nước bện làm ngòi cho nét phù trơn như nước chảy. Vẽ bên bờ sông thì dễ thành."
  },
  {
    "id": "dp.liet_diem_phu",
    "nghe": "che_phu",
    "ten": "Liệt Diễm Phù phương",
    "ra": "item.liet_diem_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.hoa_tinh_chau",
        "so": 2
      },
      {
        "id": "item.hoa_ke_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Hỏa tinh châu tán bột trộn chu sa, lông đuôi gà lửa làm ngòi. Ngòi bén lửa thì phải vẽ nhanh trước khi cháy hết."
  },
  {
    "id": "dp.toan_phong_phu",
    "nghe": "che_phu",
    "ten": "Toàn Phong Phù phương",
    "ra": "item.toan_phong_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.phong_linh_chau",
        "so": 2
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Phong linh châu nghiền trong lọ kín, mở ra là bột bay. Đóng cửa gian vẽ, vẽ nét xoáy từ ngoài vào trong."
  },
  {
    "id": "dp.thien_loi_phu",
    "nghe": "che_phu",
    "ten": "Thiên Lôi Phù phương",
    "ra": "item.thien_loi_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.loi_linh_chau",
        "so": 2
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 50,
    "mo_ta": "Hai hạt lôi linh châu tán trong cối đá, tay người tán phải bọc vải. Vẽ dưới trời giông, nét chót hạ đúng lúc sấm nổ."
  },
  {
    "id": "dp.toa_hon_phu",
    "nghe": "che_phu",
    "ten": "Tỏa Hồn Phù phương",
    "ra": "item.toa_hon_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.am_phu_chi",
        "so": 1
      },
      {
        "id": "item.am_thuy_chau",
        "so": 1
      },
      {
        "id": "item.oan_hon_ty",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Giấy hình nhân cũ làm giấy phù, nước châu âm thủy làm mực, sợi khói oan hồn quấn vào nét chót. Vẽ lúc nửa đêm, đừng quay đầu."
  },
  {
    "id": "dp.am_binh_phu",
    "nghe": "che_phu",
    "ten": "Âm Binh Phù phương",
    "ra": "item.am_binh_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.am_binh_lenh",
        "so": 1
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Đặt thẻ lệnh âm binh giữa giấy, vẽ phù vòng quanh rồi ép thẻ vào. Ngòi bút dừng là nghe tiếng giáp sắt."
  },
  {
    "id": "dp.tam_bao_phu",
    "nghe": "che_phu",
    "ten": "Tầm Bảo Phù phương",
    "ra": "item.tam_bao_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.tam_bao_dieu_ti",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Mũi chồn tầm bảo phơi khô nghiền vào mực, ngòi bút tự kéo về phía có kim thạch. Cứ để tay theo ngòi mà vẽ."
  },
  {
    "id": "dp.tran_quy_phu",
    "nghe": "che_phu",
    "ten": "Trấn Quỷ Phù phương",
    "ra": "item.tran_quy_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.cuu_u_am_hoa",
        "so": 1
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Nhốt âm hỏa vào đèn đồng, vẽ dưới ánh lửa xanh. Mực phải hơ qua lửa ấy, nét phù mới cắn được hồn."
  },
  {
    "id": "dp.phi_cham_phu",
    "nghe": "che_phu",
    "ten": "Phi Châm Phù phương",
    "ra": "item.phi_cham_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 2
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 1
      },
      {
        "id": "item.kim_mach_dao",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 30,
    "mo_ta": "Hạt kim mạch đạo nghiền mịn rắc lên mực còn ướt. Chấm trăm chấm liền một hơi, chấm nào cũng phải nhọn."
  },
  {
    "id": "dp.thanh_xa_phu",
    "nghe": "che_phu",
    "ten": "Thanh Xà Phù phương",
    "ra": "item.thanh_xa_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 2
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 1
      },
      {
        "id": "item.doc_khuan_bao",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 40,
    "mo_ta": "Bào tử nấm độc ngâm vào mực ba ngày. Nét phù uốn chậm như rắn bò, người vẽ phải bịt mặt."
  },
  {
    "id": "dp.thanh_tuyen_phu",
    "nghe": "che_phu",
    "ten": "Thanh Tuyền Phù phương",
    "ra": "item.thanh_tuyen_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 2
      },
      {
        "id": "item.thuy_tien_can",
        "so": 2
      },
      {
        "id": "item.vu_tinh",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Rễ thủy tiên giã lấy nước mài mực, giấy hong trong sương cho ngấm. Nét đi chậm như suối chảy, gấp gáp là nước đục."
  },
  {
    "id": "dp.cuong_huyet_phu",
    "nghe": "che_phu",
    "ten": "Cuồng Huyết Phù phương",
    "ra": "item.cuong_huyet_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      },
      {
        "id": "item.huyet_linh_chi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 30,
    "mo_ta": "Huyết linh chi vắt lấy nhựa đỏ trộn với yêu huyết mặc. Vẽ một hơi lúc mạch đang đập nhanh, phù mới có khí."
  },
  {
    "id": "dp.lien_chau_loi_phu",
    "nghe": "che_phu",
    "ten": "Liên Châu Lôi Phù phương",
    "ra": "item.lien_chau_loi_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      },
      {
        "id": "item.loi_sa_hoa",
        "so": 3
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 100,
    "mo_ta": "Ba đóa lôi sa hoa tán vào mực, vẽ chuỗi hạt sấm nối nhau không nhấc bút. Đứt một hạt là cả chuỗi tắt."
  },
  {
    "id": "dp.toai_giap_phu",
    "nghe": "che_phu",
    "ten": "Toái Giáp Phù phương",
    "ra": "item.toai_giap_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      },
      {
        "id": "item.te_nguu_giac",
        "so": 1
      },
      {
        "id": "item.kim_tue_mach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 40,
    "mo_ta": "Sừng tê ngưu mài cùng hạt kim tuệ mạch thành bột. Hạ nét như đục đá, dứt khoát từng nhát."
  },
  {
    "id": "dp.nham_bich_phu",
    "nghe": "che_phu",
    "ten": "Nham Bích Phù phương",
    "ra": "item.nham_bich_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      },
      {
        "id": "item.linh_van_thach",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 80,
    "mo_ta": "Linh văn thạch nghiền làm nền, nét phù vẽ theo vân đá. Đắp từng lớp chậm rãi như xây tường."
  },
  {
    "id": "dp.sinh_co_phu",
    "nghe": "che_phu",
    "ten": "Sinh Cơ Phù phương",
    "ra": "item.sinh_co_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.co_moc_tam",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "pham": 4,
        "so": 1
      }
    ],
    "hoa": "van",
    "mo_ta": "Lõi cổ mộc ngâm với một vị linh dược hệ mộc cho ra nhựa xanh. Vẽ lúc sáng sớm, nét mềm như chồi non."
  },
  {
    "id": "dp.thuy_don_phu",
    "nghe": "che_phu",
    "ten": "Thủy Độn Phù phương",
    "ra": "item.thuy_don_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 2
      },
      {
        "id": "item.thuy_linh_chau",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Hai hạt thủy linh châu ngâm trong nghiên qua đêm, mực loãng như nước. Vẽ trên giấy ướt, nét nhòe mà không được đứt."
  },
  {
    "id": "dp.viem_vu_phu",
    "nghe": "che_phu",
    "ten": "Viêm Vũ Phù phương",
    "ra": "item.viem_vu_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.nhat_luan_hoa",
        "so": 1
      },
      {
        "id": "item.hoa_tinh_chau",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 300,
    "mo_ta": "Cánh nhật luân hoa phơi giữa trưa rồi tán cùng hỏa tinh châu. Chấm mực như mưa rơi, nhanh tay kẻo mực bén lửa."
  },
  {
    "id": "dp.cuong_phong_phu",
    "nghe": "che_phu",
    "ten": "Cuồng Phong Phù phương",
    "ra": "item.cuong_phong_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.thanh_dieu_vu",
        "so": 2
      },
      {
        "id": "item.phong_linh_chau",
        "so": 3
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 400,
    "mo_ta": "Lông thanh điểu làm ngòi, ba hạt phong linh châu tán vào mực. Đóng kín cửa, vẽ nét xoáy từ tâm ra, gió nổi trong phòng là thành."
  },
  {
    "id": "dp.thien_nhan_phu",
    "nghe": "che_phu",
    "ten": "Thiên Nhận Phù phương",
    "ra": "item.thien_nhan_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.tan_kiem_y",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Tàn kiếm ý phong vào nghiên mực, mực rạch giấy thành vết. Nét nào cũng phải sắc như lưỡi dao, run tay là đứt giấy."
  },
  {
    "id": "dp.khon_long_phu",
    "nghe": "che_phu",
    "ten": "Khốn Long Phù phương",
    "ra": "item.khon_long_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.son_tinh_hach",
        "so": 2
      },
      {
        "id": "item.cuu_khuc_hoang_tinh",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Hạch sơn tinh với rễ cửu khúc hoàng tinh nấu thành mực đặc sệt. Vòng xích chín khúc vẽ chậm, khép đủ chín khúc mới khóa được."
  },
  {
    "id": "dp.thanh_lien_phu",
    "nghe": "che_phu",
    "ten": "Thanh Liên Phù phương",
    "ra": "item.thanh_lien_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.giao_chau_lien",
        "so": 1
      },
      {
        "id": "item.ngoc_tuy",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Ép một cánh giao châu liên giữa hai tờ giấy, ngọc tủy hòa làm mực. Vẽ cánh sen từ trong ra, mỗi cánh một hơi thở."
  },
  {
    "id": "dp.loi_no_phu",
    "nghe": "che_phu",
    "ten": "Lôi Nộ Phù phương",
    "ra": "item.loi_no_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.loi_linh_chau",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 300,
    "mo_ta": "Hai hạt lôi linh châu tán mịn, rắc lên mực lúc trời gầm. Nét phù như tia chớp, chần chừ một nhịp là lôi khí đánh ngược."
  },
  {
    "id": "dp.luu_tinh_phu",
    "nghe": "che_phu",
    "ten": "Lưu Tinh Phù phương",
    "ra": "item.luu_tinh_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.thien_ngoai_van_thiet",
        "so": 1
      },
      {
        "id": "item.huyen_quan_tuy",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 400,
    "mo_ta": "Vẫn thiết rơi từ trời phải nung bảy ngày mới mài ra bột. Vẽ từ trên xuống một mạch, như sao băng rạch trời."
  },
  {
    "id": "dp.tuyet_vuc_phu",
    "nghe": "che_phu",
    "ten": "Tuyết Vực Phù phương",
    "ra": "item.tuyet_vuc_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.bang_tuy_chi",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Nhựa băng tủy chi làm mực, vẽ trong hang băng. Mỗi nét phải đợi mực đông rồi mới hạ nét kế."
  },
  {
    "id": "dp.tam_muoi_hoa_phu",
    "nghe": "che_phu",
    "ten": "Tam Muội Hỏa Phù phương",
    "ra": "item.tam_muoi_hoa_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.ngo_dong_chi",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Đốt hai cành ngô đồng lấy lửa hơ mực tới khi mực đỏ rực. Vẽ một hơi trước khi lửa trong mực nguội."
  },
  {
    "id": "dp.toa_tien_phu",
    "nghe": "che_phu",
    "ten": "Tỏa Tiên Phù phương",
    "ra": "item.toa_tien_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.co_chung_dong",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Đồng chuông cổ giũa thành bột, rắc lên chín vòng xích vẽ sẵn. Khép vòng cuối thì nghe chuông ngân, chưa ngân là hỏng."
  },
  {
    "id": "dp.huyen_vu_phu",
    "nghe": "che_phu",
    "ten": "Huyền Vũ Phù phương",
    "ra": "item.huyen_vu_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.huyen_ngac_giap",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 600,
    "mo_ta": "Phù sư Bắc Minh vẽ thẳng lên giáp cá sấu đen thay giấy. Rùa vẽ trước, rắn quấn sau, nét chậm và dày như tụng kinh."
  },
  {
    "id": "dp.hoan_sinh_phu",
    "nghe": "che_phu",
    "ten": "Hoàn Sinh Phù phương",
    "ra": "item.hoan_sinh_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "pham": 6,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 300,
    "mo_ta": "Một vị linh thảo mộc nghìn năm giã lấy nước, ngâm giấy ba ngày. Vẽ dưới mưa phùn, mưa tạnh thì dừng bút."
  },
  {
    "id": "dp.thai_hu_don_phu",
    "nghe": "che_phu",
    "ten": "Thái Hư Độn Phù phương",
    "ra": "item.thai_hu_don_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.huyen_quan_tuy",
        "so": 2
      },
      {
        "id": "item.thanh_dieu_vu",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 400,
    "mo_ta": "Lông thanh điểu chẻ làm ngòi, nét phù mảnh như tơ. Vẽ ngoài gió, nét nào gió cuốn đi thì vẽ lại."
  },
  {
    "id": "dp.tram_than_phu",
    "nghe": "che_phu",
    "ten": "Trảm Thần Phù phương",
    "ra": "item.tram_than_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.cu_tuong_nha",
        "so": 1
      },
      {
        "id": "item.hu_linh_phach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Ngà cự tượng mài với hư linh phách thành mực trắng. Cả tờ chỉ một nét thẳng, vẽ lệch một sợi tóc là bỏ."
  },
  {
    "id": "dp.cuu_thien_loi_phu",
    "nghe": "che_phu",
    "ten": "Cửu Thiên Lôi Phù phương",
    "ra": "item.cuu_thien_loi_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.hu_linh_phach",
        "so": 1
      },
      {
        "id": "item.loi_linh_chau",
        "so": 4
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 1000,
    "mo_ta": "Lên đỉnh núi đợi giông, mỗi tiếng sấm hạ một nét. Đủ chín nét mà trời tạnh trước thì tờ phù thành giấy lộn."
  },
  {
    "id": "dp.diem_hai_phu",
    "nghe": "che_phu",
    "ten": "Diệm Hải Phù phương",
    "ra": "item.diem_hai_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.kim_o_qua",
        "so": 1
      },
      {
        "id": "item.hoa_tinh_chau",
        "so": 5
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Bổ kim ô quả lấy nước đỏ như máu, hòa năm hạt hỏa tinh châu. Vẽ trên đá nung, giấy bén lửa là phải xong."
  },
  {
    "id": "dp.thuy_lao_phu",
    "nghe": "che_phu",
    "ten": "Thủy Lao Phù phương",
    "ra": "item.thuy_lao_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.thien_nhat_chan_thuy",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Một giọt thiên nhất chân thủy nhỏ vào nghiên, mực nặng tới mức bút trĩu tay. Vẽ bốn bức tường nước khép kín, chậm mà không ngừng."
  },
  {
    "id": "dp.thien_cuong_phu",
    "nghe": "che_phu",
    "ten": "Thiên Cương Phù phương",
    "ra": "item.thien_cuong_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.cu_tuong_nha",
        "so": 1
      },
      {
        "id": "item.son_tinh_hach",
        "so": 4
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 500,
    "mo_ta": "Ngà cự tượng cưa thành tấm làm nền, bột sơn tinh hạch làm mực. Ba mươi sáu điểm cương khí chấm theo sao, sai chỗ là vòm sụp."
  },
  {
    "id": "dp.tao_hoa_phu",
    "nghe": "che_phu",
    "ten": "Tạo Hóa Phù phương",
    "ra": "item.tao_hoa_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 3
      },
      {
        "id": "item.phu_chi",
        "so": 3
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 3
      },
      {
        "id": "item.hu_linh_phach",
        "so": 1
      },
      {
        "id": "item.ngo_dong_chi",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 1000,
    "mo_ta": "Cành ngô đồng ngâm với hư linh phách tới khi nảy mầm. Vẽ phù theo đường mầm mọc, mầm ngừng thì bút ngừng."
  },
  {
    "id": "dp.thu_thu_phu",
    "nghe": "che_phu",
    "ten": "Thu Thú Phù phương",
    "ra": "item.thu_thu_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 1
      },
      {
        "id": "item.phu_chi",
        "so": 1
      },
      {
        "id": "item.chu_ty",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Se tơ nhện vào nét dây leo, vòng cuối để hở, dán trúng mới khép."
  },
  {
    "id": "dp.thu_linh_phu",
    "nghe": "che_phu",
    "ten": "Thu Linh Phù phương",
    "ra": "item.thu_linh_phu",
    "chu": [
      {
        "id": "item.chu_sa",
        "so": 2
      },
      {
        "id": "item.phu_chi",
        "so": 2
      },
      {
        "id": "item.chu_ty",
        "so": 2
      },
      {
        "id": "item.yeu_huyet_mac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Chín vòng dây leo lồng nhau, vòng nào đứt nét là phù không giữ nổi thú."
  },
  {
    "id": "dp.tran_thach_bich",
    "nghe": "tran_phap",
    "ten": "Thạch Bích trận đồ",
    "ra": "item.tran_ban_thach_bich",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.thach_tuy_phan",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 10,
    "mo_ta": "Bột thạch tủy rắc theo nét khắc cho trận văn bám chặt vào gỗ. Khắc chậm từng vòng, vòng nào hở là tường đá có khe."
  },
  {
    "id": "dp.tran_dang_la",
    "nghe": "tran_phap",
    "ten": "Đằng La trận đồ",
    "ra": "item.tran_ban_dang_la",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.thanh_dang_can",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 12,
    "mo_ta": "Gân dây leo tinh quai ngâm nước rồi quấn quanh mép phôi. Khắc chậm, để dây kịp bén theo trận văn."
  },
  {
    "id": "dp.tran_liem_tuc",
    "nghe": "tran_phap",
    "ten": "Liễm Tức trận đồ",
    "ra": "item.tran_ban_liem_tuc",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.diep_phan",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Phấn cánh bướm yêu hòa nước, quét mỏng lên mặt phôi. Khắc nhẹ tay, nét sâu quá thì hơi người lại lọt ra."
  },
  {
    "id": "dp.tran_tam_tai_kiem",
    "nghe": "tran_phap",
    "ten": "Tam Tài Kiếm trận đồ",
    "ra": "item.tran_ban_tam_tai_kiem",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.lang_nha",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 12,
    "mo_ta": "Răng sói mài thành ba mũi cắm vào ba góc phôi làm trận nhãn. Nét kiếm phải khắc một hơi, ngập ngừng là kiếm khí cùn."
  },
  {
    "id": "dp.tran_at_moc",
    "nghe": "tran_phap",
    "ten": "Ất Mộc trận đồ",
    "ra": "item.tran_ban_at_moc",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.thanh_dang_can",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "pham": 2,
        "so": 1
      }
    ],
    "mo_ta": "Nước một vị linh thảo mộc ngâm vào thớ gỗ đào, gân dây leo khắc theo vân gỗ. Gỗ uống no linh khí thì trận mới xanh."
  },
  {
    "id": "dp.tran_ly_hoa",
    "nghe": "tran_phap",
    "ten": "Ly Hỏa trận đồ",
    "ra": "item.tran_ban_ly_hoa",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.hoa_ke_vu",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 8,
    "mo_ta": "Lông gà lửa đốt thành than, than ấy làm mực vạch trận. Khắc nhanh lúc than còn ấm, nguội rồi thì lửa trong trận cũng tắt."
  },
  {
    "id": "dp.tran_pha_giap",
    "nghe": "tran_phap",
    "ten": "Phá Giáp trận đồ",
    "ra": "item.tran_ban_pha_giap",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.tru_nha",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 12,
    "mo_ta": "Hai chiếc nanh lợn yêu đóng chéo giữa phôi làm mũi dùi. Khắc dứt khoát, trận văn phải sắc như mũi khoan."
  },
  {
    "id": "dp.tran_tan_linh",
    "nghe": "tran_phap",
    "ten": "Tán Linh trận đồ",
    "ra": "item.tran_ban_tan_linh",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.huyet_dia_dich",
        "so": 2
      }
    ],
    "phu": [],
    "linh_thach": 15,
    "mo_ta": "Dịch đỉa yêu bôi vào rãnh trận, trận văn sẽ hút linh lực như đỉa hút máu. Bôi xong phải rửa tay ngay."
  },
  {
    "id": "dp.tran_kho_moc",
    "nghe": "tran_phap",
    "ten": "Khô Mộc trận đồ",
    "ra": "item.tran_ban_kho_moc",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.doc_khuan_bao",
        "so": 1
      }
    ],
    "phu": [],
    "linh_thach": 8,
    "mo_ta": "Bào tử nấm độc rắc vào thớ gỗ, gỗ đào mục dần theo nét khắc. Trận thành thì cầm vào thấy tay khô ráp."
  },
  {
    "id": "dp.tran_dan_linh",
    "nghe": "tran_phap",
    "ten": "Dẫn Linh trận đồ",
    "ra": "item.tran_ban_dan_linh",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.yeu_dan_1",
        "so": 1
      }
    ],
    "phu": [],
    "linh_thach": 15,
    "mo_ta": "Một viên yêu đan nhỏ khảm giữa phôi làm trận nhãn, trận văn tỏa ra như rễ cây. Nét nào nối vào yêu đan phải liền."
  },
  {
    "id": "dp.tran_thanh_moc_duc_linh",
    "nghe": "tran_phap",
    "ten": "Thanh Mộc Dục Linh trận đồ",
    "ra": "item.tran_ban_thanh_moc_duc_linh",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "pham": 2,
        "so": 2
      }
    ],
    "hoa": "van",
    "mo_ta": "Hai vị linh thảo mộc giã nhuyễn trát lên mặt phôi, khắc trận khi lớp thuốc còn ướt. Khắc chậm cho thuốc ngấm."
  },
  {
    "id": "dp.tran_suc_dia",
    "nghe": "tran_phap",
    "ten": "Súc Địa trận đồ",
    "ra": "item.tran_ban_suc_dia",
    "chu": [
      {
        "id": "item.phoi_dao_moc",
        "so": 1
      },
      {
        "id": "item.ung_vu",
        "so": 1
      }
    ],
    "phu": [],
    "linh_thach": 10,
    "mo_ta": "Lông ưng yêu cắm ở trận nhãn chỉ hướng, trận văn gấp đường xa thành một bước. Khắc sai một nét là đi lạc."
  },
  {
    "id": "dp.tran_huyen_quy",
    "nghe": "tran_phap",
    "ten": "Huyền Quy trận đồ",
    "ra": "item.tran_ban_huyen_quy",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.quy_giap",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 30,
    "mo_ta": "Mảnh giáp rùa yêu mài mỏng dán dưới phôi ngọc, trận văn khắc theo vân giáp. Khắc chậm, vân giáp đi đâu nét theo đó."
  },
  {
    "id": "dp.tran_van_vu",
    "nghe": "tran_phap",
    "ten": "Vân Vụ Mê trận đồ",
    "ra": "item.tran_ban_van_vu",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.vu_tinh",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 40,
    "mo_ta": "Hai viên vụ tinh bóp vỡ trên mặt ngọc, sương tỏa tới đâu khắc tới đó. Khắc chậm, sương tan là phải đợi viên khác."
  },
  {
    "id": "dp.tran_lien_hoan_kiem",
    "nghe": "tran_phap",
    "ten": "Liên Hoàn Kiếm trận đồ",
    "ra": "item.tran_ban_lien_hoan_kiem",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.co_dong_tinh",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Tinh đồng cổ nung chảy đổ vào rãnh trận làm lưỡi kiếm. Đồng nguội rất nhanh, khắc liền một hơi cả bảy lưỡi."
  },
  {
    "id": "dp.tran_canh_kim",
    "nghe": "tran_phap",
    "ten": "Canh Kim trận đồ",
    "ra": "item.tran_ban_canh_kim",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "kim"
        ],
        "pham": 3,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 10,
    "mo_ta": "Một vị linh dược hệ kim đốt thành tro trắng, rải vào nét trận cho kim khí ngưng. Khắc nhanh trước khi tro bay."
  },
  {
    "id": "dp.tran_quy_thuy",
    "nghe": "tran_phap",
    "ten": "Quý Thủy trận đồ",
    "ra": "item.tran_ban_quy_thuy",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.thuy_linh_chau",
        "so": 1
      }
    ],
    "phu": [],
    "mo_ta": "Thủy linh châu đặt ở trận nhãn, nước trong châu theo nét khắc chảy quanh mép phôi. Nét nào đọng nước là khắc sai."
  },
  {
    "id": "dp.tran_mau_tho",
    "nghe": "tran_phap",
    "ten": "Mậu Thổ trận đồ",
    "ra": "item.tran_ban_mau_tho",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.linh_van_thach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 20,
    "mo_ta": "Linh văn thạch nghiền mịn trộn với nước giếng, trát thành một lớp dày rồi mới khắc. Khắc chậm cho đất kịp đông."
  },
  {
    "id": "dp.tran_toai_bich",
    "nghe": "tran_phap",
    "ten": "Toái Bích trận đồ",
    "ra": "item.tran_ban_toai_bich",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.phe_kim_nha",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Răng trùng ăn kim cắm vào trận nhãn, trận văn khắc thành hình răng cưa. Phải khắc một hơi, chậm thì răng cùn."
  },
  {
    "id": "dp.tran_phong_mach",
    "nghe": "tran_phap",
    "ten": "Phong Mạch trận đồ",
    "ra": "item.tran_ban_phong_mach",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.linh_van_thach",
        "so": 1
      },
      {
        "id": "item.sa_linh_tinh",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Linh văn thạch làm đáy, sa linh tinh rắc quanh mép như đắp đê chặn linh mạch. Khắc chậm, một khe hở là linh khí lọt."
  },
  {
    "id": "dp.tran_tu_linh",
    "nghe": "tran_phap",
    "ten": "Tụ Linh trận đồ",
    "ra": "item.tran_ban_tu_linh",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.yeu_dan_2",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 60,
    "mo_ta": "Yêu đan khảm giữa, năm viên linh thạch vụn khảm quanh làm trận nhãn phụ. Khắc chậm, nét nào cũng phải dẫn về giữa."
  },
  {
    "id": "dp.tran_thong_mach",
    "nghe": "tran_phap",
    "ten": "Thông Mạch trận đồ",
    "ra": "item.tran_ban_thong_mach",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.khai_khieu_chau",
        "so": 1
      }
    ],
    "phu": [],
    "linh_thach": 30,
    "mo_ta": "Khai khiếu châu khảm ở trận nhãn, trận văn khắc thành mạch như kinh lạc người. Khắc đủ mười hai mạch mới khép trận."
  },
  {
    "id": "dp.tran_van_ly",
    "nghe": "tran_phap",
    "ten": "Vạn Lý trận đồ",
    "ra": "item.tran_ban_van_ly",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.phong_linh_chau",
        "so": 1
      }
    ],
    "phu": [],
    "mo_ta": "Phong linh châu đặt ở trận nhãn, trận văn gấp khúc như đường gió thổi. Hai mặt phôi khắc hai trận soi nhau."
  },
  {
    "id": "dp.tran_thien_la",
    "nghe": "tran_phap",
    "ten": "Thiên La Khốn trận đồ",
    "ra": "item.tran_ban_thien_la",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.huyen_chu_ty",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Tơ nhện huyền chu căng ngang dọc trên phôi xương thành lưới. Khắc chậm theo từng sợi, đứt một sợi là lưới có lỗ."
  },
  {
    "id": "dp.tran_binh_hoa",
    "nghe": "tran_phap",
    "ten": "Bính Hỏa trận đồ",
    "ra": "item.tran_ban_binh_hoa",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.hoa_tinh_chau",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Hai viên hỏa tinh châu nung đỏ ép vào phôi, trận văn khắc trên vết cháy. Khắc gấp khi xương còn bốc khói."
  },
  {
    "id": "dp.tran_toa_linh",
    "nghe": "tran_phap",
    "ten": "Tỏa Linh trận đồ",
    "ra": "item.tran_ban_toa_linh",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.co_kinh_phien",
        "so": 1
      },
      {
        "id": "item.linh_van_thach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Mảnh gương cổ úp ở trận nhãn, linh văn thạch lót đáy. Gương soi tới đâu linh khí đóng băng tới đó."
  },
  {
    "id": "dp.tran_ngu_hanh_tu_linh",
    "nghe": "tran_phap",
    "ten": "Ngũ Hành Tụ Linh trận đồ",
    "ra": "item.tran_ban_ngu_hanh_tu_linh",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.yeu_dan_3",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Tam giai yêu đan đặt giữa, năm góc phôi khắc năm trận nhỏ theo ngũ hành. Khắc chậm, đủ một vòng tương sinh mới khép."
  },
  {
    "id": "dp.tran_tuyet_sinh",
    "nghe": "tran_phap",
    "ten": "Tuyệt Sinh trận đồ",
    "ra": "item.tran_ban_tuyet_sinh",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.ngo_cong_doc_nang",
        "so": 1
      },
      {
        "id": "item.ngu_doc_dich",
        "so": 1
      }
    ],
    "phu": [],
    "mo_ta": "Túi độc rết và ngũ độc dịch đổ vào rãnh trận. Khắc phải bịt mặt, hơi độc bốc lên làm cỏ quanh chỗ ngồi héo rũ."
  },
  {
    "id": "dp.tran_doan_mach",
    "nghe": "tran_phap",
    "ten": "Đoạn Mạch trận đồ",
    "ra": "item.tran_ban_doan_mach",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.bien_buc_si",
        "so": 2
      }
    ],
    "phu": [],
    "mo_ta": "Cánh dơi yêu căng hai bên phôi, trận văn khắc như mạch máu bị cắt ngang. Trận thành thì đặt gần ai, người đó thấy tay chân rời rã."
  },
  {
    "id": "dp.tran_xich_diem_kiem",
    "nghe": "tran_phap",
    "ten": "Xích Diễm Kiếm trận đồ",
    "ra": "item.tran_ban_xich_diem_kiem",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.hoa_tinh_chau",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 50,
    "mo_ta": "Hai viên hỏa tinh châu tán bột trộn làm mực, khắc sáu thanh kiếm quanh phôi xương. Lửa phải giữ đỏ suốt lúc khắc, nguội một kiếm là cả vòng tắt."
  },
  {
    "id": "dp.tran_xuan_phong_hoa_vu",
    "nghe": "tran_phap",
    "ten": "Xuân Phong Hóa Vũ trận đồ",
    "ra": "item.tran_ban_xuan_phong_hoa_vu",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.hoe_am_moc",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "thuy"
        ],
        "pham": 2,
        "so": 1
      }
    ],
    "hoa": "van",
    "linh_thach": 50,
    "mo_ta": "Gỗ hòe âm làm nền, nước một vị linh thảo thủy tưới lên mỗi nét. Khắc chậm như mưa xuân, vội thì đất úng."
  },
  {
    "id": "dp.tran_can_khon",
    "nghe": "tran_phap",
    "ten": "Càn Khôn trận đồ",
    "ra": "item.tran_ban_can_khon",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.bang_vu",
        "so": 1
      },
      {
        "id": "item.phong_linh_chau",
        "so": 1
      }
    ],
    "phu": [],
    "mo_ta": "Lông bằng yêu và phong linh châu đặt hai đầu phôi làm đôi trận nhãn. Trận văn gấp tám lần, mỗi lần là một châu xa."
  },
  {
    "id": "dp.tran_cuu_cung_kiem",
    "nghe": "tran_phap",
    "ten": "Cửu Cung Kiếm trận đồ",
    "ra": "item.tran_ban_cuu_cung_kiem",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 1
      },
      {
        "id": "item.tan_kiem_y",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 200,
    "mo_ta": "Kiếm ý tàn trong mảnh kiếm gãy được dẫn vào chín cung trên phôi ngọc. Khắc một hơi chín cung, ngắt giữa chừng là kiếm ý tan."
  },
  {
    "id": "dp.tran_thai_bach",
    "nghe": "tran_phap",
    "ten": "Thái Bạch trận đồ",
    "ra": "item.tran_ban_thai_bach",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 1
      },
      {
        "id": "item.tu_kim",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 150,
    "mo_ta": "Tử kim nấu chảy rót vào rãnh trận trên hàn ngọc, kim gặp lạnh đông thành sợi. Khắc nhanh trước khi kim nguội."
  },
  {
    "id": "dp.tran_thanh_de",
    "nghe": "tran_phap",
    "ten": "Thanh Đế trận đồ",
    "ra": "item.tran_ban_thanh_de",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 1
      },
      {
        "id": "item.thien_nien_moc_tam",
        "so": 1
      }
    ],
    "phu": [],
    "linh_thach": 150,
    "mo_ta": "Lõi mộc nghìn năm cắt thành lát mỏng lót dưới phôi, trận văn khắc theo vòng tuổi cây."
  },
  {
    "id": "dp.tran_hau_tho",
    "nghe": "tran_phap",
    "ten": "Hậu Thổ trận đồ",
    "ra": "item.tran_ban_hau_tho",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 1
      },
      {
        "id": "item.son_tinh_hach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 150,
    "mo_ta": "Hạch sơn tinh chôn dưới phôi ngọc, trận văn khắc thành hình núi chồng núi. Khắc chậm, núi nào cũng phải có chân."
  },
  {
    "id": "dp.tran_bat_quai_me_tung",
    "nghe": "tran_phap",
    "ten": "Bát Quái Mê Tung trận đồ",
    "ra": "item.tran_ban_bat_quai_me_tung",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 1
      },
      {
        "id": "item.mi_ho_chau",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 150,
    "mo_ta": "Mị hồ châu đặt ở trận nhãn, tám quẻ khắc quanh như tám cửa. Khắc chậm, cửa sinh cửa tử mà lẫn là người bày cũng lạc."
  },
  {
    "id": "dp.tran_pha_quan",
    "nghe": "tran_phap",
    "ten": "Phá Quân trận đồ",
    "ra": "item.tran_ban_pha_quan",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 1
      },
      {
        "id": "item.thuc_thiet_nha",
        "so": 1
      },
      {
        "id": "item.xuyen_bich_giac",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "vu",
    "mo_ta": "Răng ăn sắt và sừng xuyên vách cắm hai đầu phôi, trận văn khắc thẳng như ngọn giáo. Một hơi từ đầu tới cuối."
  },
  {
    "id": "dp.tran_kim_cang",
    "nghe": "tran_phap",
    "ten": "Kim Cang Hộ trận đồ",
    "ra": "item.tran_ban_kim_cang",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 1
      },
      {
        "id": "item.ngoc_tuy",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 100,
    "mo_ta": "Ngọc tủy đổ đầy rãnh trận, đông lại cứng như kim cương. Khắc chậm, nét nào cũng tụng một câu kinh hộ thân."
  },
  {
    "id": "dp.tran_chu_thien_tu_linh",
    "nghe": "tran_phap",
    "ten": "Chu Thiên Tụ Linh trận đồ",
    "ra": "item.tran_ban_chu_thien_tu_linh",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 1
      },
      {
        "id": "item.yeu_dan_3",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 200,
    "mo_ta": "Hai viên yêu đan đặt hai cực, ba trăm sáu mươi tinh vị khắc quanh. Phải khắc vào đêm, sao nào lên thì khắc sao ấy."
  },
  {
    "id": "dp.tran_thien_co",
    "nghe": "tran_phap",
    "ten": "Thiên Cơ trận đồ",
    "ra": "item.tran_ban_thien_co",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.yeu_dan_4",
        "so": 1
      }
    ],
    "phu": [],
    "linh_thach": 600,
    "mo_ta": "Tứ giai yêu đan đặt giữa hai phôi hàn ngọc chồng lên nhau, trận văn khắc xuyên cả hai tầng. Một nét sai là đan vỡ."
  },
  {
    "id": "dp.tran_van_moc_hoi_xuan",
    "nghe": "tran_phap",
    "ten": "Vạn Mộc Hồi Xuân trận đồ",
    "ra": "item.tran_ban_van_moc_hoi_xuan",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.ngo_dong_chi",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "moc"
        ],
        "pham": 5,
        "so": 1
      }
    ],
    "hoa": "van",
    "mo_ta": "Cành ngô đồng ghép với một vị linh mộc nghìn năm làm trận nhãn. Khắc chậm, cành nảy lá thì trận đã thành."
  },
  {
    "id": "dp.tran_toa_long",
    "nghe": "tran_phap",
    "ten": "Tỏa Long trận đồ",
    "ra": "item.tran_ban_toa_long",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.thien_tam_ti",
        "so": 1
      },
      {
        "id": "item.co_chung_dong",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "mo_ta": "Tơ tằm trời luyện với đồng chuông cổ thành chín sợi xích. Khắc chậm, mỗi sợi xích khắc một ngày, khóa cả rồng."
  },
  {
    "id": "dp.tran_huyen_minh",
    "nghe": "tran_phap",
    "ten": "Huyền Minh trận đồ",
    "ra": "item.tran_ban_huyen_minh",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.huyen_ngac_giap",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "thuy"
        ],
        "pham": 5,
        "so": 1
      }
    ],
    "mo_ta": "Giáp cá sấu đen làm đáy, nước một vị linh thủy trăm năm tưới vào trận văn. Nước đọng không tan, đen như mực."
  },
  {
    "id": "dp.tran_tan_nguyen",
    "nghe": "tran_phap",
    "ten": "Tán Nguyên trận đồ",
    "ra": "item.tran_ban_tan_nguyen",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.huyen_quan_tuy",
        "so": 1
      },
      {
        "id": "item.yeu_dan_4",
        "so": 1
      }
    ],
    "phu": [],
    "mo_ta": "Tủy huyền quan bôi lên yêu đan rồi đặt ngược vào trận nhãn, trận văn xoáy ra ngoài. Linh khí quanh đó tan như khói."
  },
  {
    "id": "dp.tran_thien_cuong_toa_linh",
    "nghe": "tran_phap",
    "ten": "Thiên Cương Tỏa Linh trận đồ",
    "ra": "item.tran_ban_thien_cuong_toa_linh",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.thien_ngoai_van_thiet",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 400,
    "mo_ta": "Vẫn thiết rèn thành ba mươi sáu đinh, đóng theo vị trí thiên cương. Khắc chậm, đinh nào lệch là trận hở."
  },
  {
    "id": "dp.tran_tich_diet",
    "nghe": "tran_phap",
    "ten": "Tịch Diệt trận đồ",
    "ra": "item.tran_ban_tich_diet",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.that_thai_doc_nang",
        "so": 2
      },
      {
        "id": "item.chuong_doc_tinh",
        "so": 2
      }
    ],
    "phu": [],
    "linh_thach": 300,
    "mo_ta": "Túi độc bảy màu và tinh chướng độc trộn làm mực, khắc trên đá hàn ngọc. Trận thành thì đất quanh ba trượng không mọc nổi cỏ."
  },
  {
    "id": "dp.tran_cuu_tieu_loi",
    "nghe": "tran_phap",
    "ten": "Cửu Tiêu Lôi trận đồ",
    "ra": "item.tran_ban_cuu_tieu_loi",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.loi_kich_moc",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 300,
    "mo_ta": "Hai khúc gỗ bị sét đánh chẻ thành chín chốt, cắm quanh hai phôi hàn ngọc làm trận nhãn. Khắc vào đêm giông, sét đánh xuống mới đóng chốt."
  },
  {
    "id": "dp.tran_van_tuong_tu_linh",
    "nghe": "tran_phap",
    "ten": "Vạn Tượng Tụ Linh trận đồ",
    "ra": "item.tran_ban_van_tuong_tu_linh",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.yeu_dan_4",
        "so": 1
      },
      {
        "id": "item.linh_xa_chau",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 800,
    "mo_ta": "Tứ giai yêu đan ở trận nhãn, linh xà châu dẫn linh mạch theo đường rắn bò. Khắc chậm, núi sông trên bàn phải khớp núi sông ngoài trời."
  },
  {
    "id": "dp.tran_chu_tuoc",
    "nghe": "tran_phap",
    "ten": "Chu Tước trận đồ",
    "ra": "item.tran_ban_chu_tuoc",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 3
      },
      {
        "id": "item.kim_o_vu",
        "so": 1
      }
    ],
    "phu": [
      {
        "loai": "linh_duoc",
        "he": [
          "hoa"
        ],
        "pham": 5,
        "so": 1
      }
    ],
    "hoa": "vu",
    "linh_thach": 600,
    "mo_ta": "Lông kim ô đốt lấy lửa, một vị linh hỏa trăm năm làm dầu, khắc trận trong lửa. Khắc gấp, lửa ngừng một nhịp là phôi nứt."
  },
  {
    "id": "dp.tran_van_nhac",
    "nghe": "tran_phap",
    "ten": "Vạn Nhạc Trấn Sơn trận đồ",
    "ra": "item.tran_ban_van_nhac",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 3
      },
      {
        "id": "item.boi_son_quy_giap",
        "so": 1
      },
      {
        "id": "item.huyen_quy_long_giap",
        "so": 1
      },
      {
        "id": "item.son_tinh_hach",
        "so": 2
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 1000,
    "mo_ta": "Giáp rùa cõng núi làm nền, giáp rùa rồng làm vách, hai hạch sơn tinh làm trận nhãn. Khắc chậm, một nét một ngọn núi."
  },
  {
    "id": "dp.tran_tru_tien_kiem",
    "nghe": "tran_phap",
    "ten": "Tru Tiên Kiếm trận đồ",
    "ra": "item.tran_ban_tru_tien_kiem",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 3
      },
      {
        "id": "item.canh_kim_tinh",
        "so": 1
      },
      {
        "id": "item.tan_kiem_y",
        "so": 4
      }
    ],
    "phu": [],
    "hoa": "vu",
    "linh_thach": 1000,
    "mo_ta": "Canh kim tinh rèn thành bốn thanh kiếm nhỏ, bốn mảnh kiếm ý tàn dẫn vào bốn cửa. Khắc liền một hơi, chậm thì kiếm ý quay đầu chém người khắc."
  },
  {
    "id": "dp.tran_hon_nguyen_tu_linh",
    "nghe": "tran_phap",
    "ten": "Hỗn Nguyên Tụ Linh trận đồ",
    "ra": "item.tran_ban_hon_nguyen_tu_linh",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 3
      },
      {
        "id": "item.yeu_dan_5",
        "so": 1
      },
      {
        "id": "item.hu_linh_phach",
        "so": 1
      }
    ],
    "phu": [],
    "hoa": "van",
    "linh_thach": 1600,
    "mo_ta": "Ngũ giai yêu đan và hư linh phách đặt chồng ở trận nhãn, trận văn khắc thành xoáy không đầu không cuối. Khắc chậm tới khi không còn thấy nét."
  },
  {
    "id": "dp.tran_cau_hon",
    "nghe": "tran_phap",
    "ten": "Câu Hồn trận đồ",
    "ra": "item.tran_ban_cau_hon",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.am_phu_chi",
        "so": 1
      },
      {
        "id": "item.oan_hon_ty",
        "so": 2
      }
    ],
    "phu": [],
    "linh_thach": 40,
    "mo_ta": "Tơ oán hồn se thành móc, giấy âm phù dán quanh mép. Khắc lúc nửa đêm, bên tai sẽ có tiếng gọi tên, đừng thưa."
  },
  {
    "id": "dp.tran_huyet_te",
    "nghe": "tran_phap",
    "ten": "Huyết Tế trận đồ",
    "ra": "item.tran_ban_huyet_te",
    "chu": [
      {
        "id": "item.phoi_thanh_ngoc",
        "so": 1
      },
      {
        "id": "item.bach_cot_phan",
        "so": 1
      },
      {
        "id": "item.huyet_dia_dich",
        "so": 2
      }
    ],
    "phu": [],
    "linh_thach": 40,
    "mo_ta": "Bột xương trắng trộn dịch đỉa làm mực, trận văn vẽ thành hình miệng há. Trận thành thì mặt ngọc ửng đỏ như vừa uống máu."
  },
  {
    "id": "dp.tran_tu_hon",
    "nghe": "tran_phap",
    "ten": "Tụ Hồn trận đồ",
    "ra": "item.tran_ban_tu_hon",
    "chu": [
      {
        "id": "item.phoi_linh_cot",
        "so": 1
      },
      {
        "id": "item.am_thuy_chau",
        "so": 2
      },
      {
        "id": "item.oan_hon_ty",
        "so": 2
      }
    ],
    "phu": [],
    "linh_thach": 40,
    "mo_ta": "Hai viên âm thủy châu chôn dưới phôi xương, tơ oán hồn quấn quanh thành lồng. Khắc trong mộ cổ mới đủ âm khí."
  },
  {
    "id": "dp.tran_van_huyet",
    "nghe": "tran_phap",
    "ten": "Vạn Huyết trận đồ",
    "ra": "item.tran_ban_van_huyet",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 1
      },
      {
        "id": "item.thi_hach",
        "so": 1
      },
      {
        "id": "item.cuong_thi_nha",
        "so": 1
      }
    ],
    "phu": [],
    "mo_ta": "Hạch thi và nanh cương thi nghiền làm mực, trận văn vẽ thành vạn giọt máu. Trận thành thì hàn ngọc đỏ như son."
  },
  {
    "id": "dp.tran_cuu_u",
    "nghe": "tran_phap",
    "ten": "Cửu U trận đồ",
    "ra": "item.tran_ban_cuu_u",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 2
      },
      {
        "id": "item.thi_mao",
        "so": 1
      },
      {
        "id": "item.am_binh_lenh",
        "so": 2
      }
    ],
    "phu": [],
    "linh_thach": 300,
    "mo_ta": "Lông thi và hai tấm âm binh lệnh chôn dưới phôi, khắc trận ở nơi chín tầng âm khí. Xong trận thì bên tai không dứt tiếng khóc."
  },
  {
    "id": "dp.tran_huyet_hai",
    "nghe": "tran_phap",
    "ten": "Huyết Hải trận đồ",
    "ra": "item.tran_ban_huyet_hai",
    "chu": [
      {
        "id": "item.phoi_han_ngoc",
        "so": 3
      },
      {
        "id": "item.huyet_anh_tinh",
        "so": 1
      },
      {
        "id": "item.cuu_u_am_hoa",
        "so": 1
      }
    ],
    "phu": [],
    "mo_ta": "Huyết ảnh tinh tan trong cửu u âm hỏa thành một vũng máu sôi, ba phôi ngọc ngâm vào tới khi đỏ suốt. Trận văn tự hiện, người khắc chỉ việc đừng chết."
  }
];

export function getAllRecipes(): RecipeInfo[] {
  try {
    const liveDp = gWin.game?.env?.content?.donPhuong;
    if (liveDp && typeof liveDp.values === "function") {
      const list: RecipeInfo[] = [];
      for (const r of liveDp.values()) {
        list.push({
          id: r.id,
          nghe: r.nghe,
          ten: r.ten,
          ra: r.ra,
          ra_cuc: r.ra_cuc,
          chu: r.chu || [],
          phu: r.phu || [],
          hoa: r.hoa,
          linh_thach: r.linh_thach,
          mo_ta: r.mo_ta
        });
      }
      if (list.length > 0) return list;
    }
  } catch (e) {}

  return FALLBACK_RECIPES;
}

export function getRecipeById(id: string): RecipeInfo | undefined {
  const all = getAllRecipes();
  return all.find(r => r.id === id);
}

export function findMatchingItemForPhu(p: RecipeIngredient): string | null {
  if (p.id) return p.id;
  const items = getAllAvailableItems();
  const match = items.find(it => {
    if (p.loai && it.cat !== p.loai) return false;
    if (p.pham !== undefined && it.quality !== p.pham) return false;
    return true;
  });
  return match ? match.id : null;
}

export function giveIngredientsForRecipe(recipeId: string, multiplier: number = 10): boolean {
  const recipe = getRecipeById(recipeId);
  if (!recipe) {
    notify("⚠️ Không tìm thấy công thức này!");
    return false;
  }

  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    notify("⚠️ Hãy bước vào trong kiếp tu tiên trước!");
    return false;
  }

  const nv = copyObj(state.run.nhanVat);
  const tuiDo = copyObj(nv.tuiDo || {});
  const addedList: string[] = [];

  // 1. Primary ingredients (chu)
  for (const c of recipe.chu || []) {
    if (c.id) {
      const needed = (c.so || 1) * multiplier;
      tuiDo[c.id] = (tuiDo[c.id] || 0) + needed;
      const info = getItemInfo(c.id);
      addedList.push(`${info.name} x${needed}`);
    }
  }

  // 2. Secondary ingredients (phu)
  for (const p of recipe.phu || []) {
    const itemId = findMatchingItemForPhu(p);
    if (itemId) {
      const needed = (p.so || 1) * multiplier;
      tuiDo[itemId] = (tuiDo[itemId] || 0) + needed;
      const info = getItemInfo(itemId);
      addedList.push(`${info.name} x${needed}`);
    }
  }

  nv.tuiDo = tuiDo;
  nv.oTuiThem = Math.max(nv.oTuiThem || 0, Object.keys(tuiDo).length + 50);
  nv.xepTui = buildSyncedXepTui(nv.xepTui, tuiDo);

  const nextRun = copyObj(state.run);
  nextRun.nhanVat = nv;
  setGameState({ run: nextRun });
  persistGameSave(nextRun);

  notify(`📦 Đã thêm nguyên liệu chế tác x${multiplier}: ${addedList.slice(0, 2).join(", ")}...`);
  return true;
}

export function giveCraftedProduct(recipeId: string, count: number = 5): boolean {
  const recipe = getRecipeById(recipeId);
  if (!recipe) {
    notify("⚠️ Không tìm thấy công thức này!");
    return false;
  }

  const state = getGameState();
  if (!state || !state.run || !state.run.nhanVat) {
    notify("⚠️ Hãy bước vào trong kiếp tu tiên trước!");
    return false;
  }

  const nv = copyObj(state.run.nhanVat);
  const tuiDo = copyObj(nv.tuiDo || {});
  const targetId = recipe.ra;
  tuiDo[targetId] = (tuiDo[targetId] || 0) + count;

  nv.tuiDo = tuiDo;
  nv.oTuiThem = Math.max(nv.oTuiThem || 0, Object.keys(tuiDo).length + 50);
  nv.xepTui = buildSyncedXepTui(nv.xepTui, tuiDo);

  const nextRun = copyObj(state.run);
  nextRun.nhanVat = nv;
  setGameState({ run: nextRun });
  persistGameSave(nextRun);

  const info = getItemInfo(targetId);
  notify(`✨ Đã nhận thành phẩm: ${info.name} x${count}!`);
  return true;
}
