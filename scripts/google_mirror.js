export default {
  icon: "https://elgoog.im/favicon.ico",
  name: {
    en: "Google mirror - I'm elgooG",
    vi: "Google mirror - I'm elgooG",
  },
  description: {
    en: "Google games. We create, restore, and discover interactive Google Easter Eggs. Just click and play them online for free.",
    vi: "Chơi các trò chơi (minigame) từng có trên google tìm kiếm",
  },

  contentScript: {
    onClick: () => window.open("https://elgoog.im/"),
  },
};
