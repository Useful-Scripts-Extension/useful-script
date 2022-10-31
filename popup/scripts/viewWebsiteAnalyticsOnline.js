export default {
  name: {
    en: "Analytics website online",
    vi: "Phân tích trang web trực tuyến",
  },
  description: {
    en: "SimilarWeb - Access behind-the-scenes analytics for every site online",
    vi: "SimilarWeb - Phân tích chi tiết cho mọi trang web trực tuyến",
  },
  func: function () {
    window.open(`https://www.similarweb.com/website/` + location.hostname);
  },
};
