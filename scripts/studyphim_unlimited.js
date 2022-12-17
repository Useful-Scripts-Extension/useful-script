export default {
  icon: "https://www.studyphim.vn/assets/ico/favicon.ico",
  name: {
    en: "Studyphim - Watch free movies",
    vi: "Studyphim - Xem miễn phí",
  },
  description: {
    en: "Watch movies on Studyphim for free without login",
    vi: "Xem phim miễn phí trên Studyphim không cần đăng nhập",
  },
  whiteList: ["https://www.studyphim.vn/*"],

  onDocumentStart: () => {
    // Source: https://github.com/gys-dev/Unlimited-Stdphim
    UsefulScriptGlobalWebpageContext.deleteElements(
      ".overlay.playable.hide, .overlay.playable, #topchapter, #wrapper_header",
      true
    );
  },
};
