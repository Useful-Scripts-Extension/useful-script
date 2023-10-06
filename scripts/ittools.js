import { showLoading } from "./helpers/utils.js";

export default {
  icon: "https://it-tools.tech/favicon-32x32.png",
  name: {
    en: "IT Tools",
    vi: "Bộ tool ITs",
  },
  description: {
    en: "Handy tools for developers",
    vi: "Tổng hợp tools hữu ích cho ITs",
  },

  onClickExtension: () => {
    window.open("https://it-tools.tech/");
  },
};