export default {
  name: {
    en: "Enable download all video",
    vi: "Bật tải mọi video",
  },
  description: {
    en: "Enable download button for all video",
    vi: "Bật chức năng download cho mọi video trong trang",
  },
  func() {
    Array.from(document.querySelectorAll("video")).map(
      (_) => (_.attributes.controlslist.value = "nofullscreen noremoteplayback")
    );
  },
};
