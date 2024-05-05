export default {
  icon: "https://files.startupranking.com/startup/thumb/19950_8743c12283f6a62f069b5b05d518e1ba31465150_similarweb_l.png",
  name: {
    en: "Find alternative web",
    vi: "Tìm trang web tương tự",
  },
  description: {
    en: "SimilarWeb - Access behind-the-scenes analytics for every site online",
    vi: "SimilarWeb - Phân tích chi tiết cho mọi trang web trực tuyến",
  },

  pageScript: {
    onClick: function () {
      window.open(
        `https://www.similarweb.com/website/` +
          location.hostname +
          "/#competitors"
      );
    },
  },
};
