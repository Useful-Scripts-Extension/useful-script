export default {
  icon: "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.document",
  name: {
    en: "GG Drive - Download Document (copy Text)",
    vi: "GG Drive - Tải Document (copy nội dung)",
  },
  description: {
    en: "Open doc content in new page => then you need to use feature <h3>Unlock -> Enable copy</h3> to copy Document text",
    vi: "Mở nội dung file document trong tab mới => Bạn hãy sử dụng chức năng <h3>Mở khoá -> Bật sao chép</h3> để sao chép nội dung",
  },

  whiteList: ["https://docs.google.com/document/*"],

  onClick: () => {
    let url = location.href;
    window.open(
      url.replace("/edit", "/mobilebasic").replace("/preview", "/mobilebasic")
    );
  },
};
