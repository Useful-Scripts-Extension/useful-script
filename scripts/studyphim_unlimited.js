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
  infoLink:
    "https://www.facebook.com/groups/j2team.community/posts/565933393738785/",

  whiteList: ["https://www.studyphim.vn/*"],

  contentScript: {
    onDocumentStart: () => {
      // Source: https://github.com/gys-dev/Unlimited-Stdphim
      UfsGlobal.DOM.deleteElements(
        ".overlay.playable.hide, .overlay.playable, #topchapter, #wrapper_header"
      );
    },
  },
};
