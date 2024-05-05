export default {
  icon: "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.spreadsheet",
  name: {
    en: "GG Drive - Download Sheet (copy Text)",
    vi: "GG Drive - Tải Sheet (copy nội dung)",
  },
  description: {
    en: "Copy google drive sheet (excel) that dont have download button (Just copy text, can't copy formula)",
    vi: "Copy nội dung file sheet (excel) không có nút tải xuống (Chỉ copy text, không copy được công thức)",
  },

  whiteList: ["https://docs.google.com/spreadsheets/*"],

  pageScript: {
    onClick: () => {
      let url = location.href;
      window.open(url.replace("/edit", "/preview"));
    },
  },
};
