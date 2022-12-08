export default {
  icon: "",
  name: {
    en: "",
    vi: "",
  },
  description: {
    en: "",
    vi: "",
  },

  // Chọn 1 trong 2 cách, xoá cách không dùng:

  // Cách 1: Mở link web trong tab mới, không cần dùng onClick
  link: "",

  isChecked: () => {
    return true;
  },

  // Cách 2: Chạy script
  blackList: [],
  whiteList: [],
  runInExtensionContext: false,

  onClick: function () {},
};

// Những thuộc tính/hàm có thể chia sẻ cho cách scripts khác sử dụng sẽ được viết vào đây
export const shared = {};
