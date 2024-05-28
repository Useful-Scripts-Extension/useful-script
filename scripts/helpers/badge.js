export const BADGES = {
  hot: "hot",
  beta: "beta",
  new: "new",
  recommend: "recommend",
  comingSoon: "comingSoon",
};

export const BADGES_CONFIG = {
  [BADGES.hot]: {
    text: {
      en: 'hot <i class="fa-solid fa-fire"></i>',
      vi: 'xịn xò <i class="fa-solid fa-fire"></i>',
    },
    color: "#fff",
    backgroundColor: "#d40",
  },
  [BADGES.beta]: {
    text: { en: "beta", vi: "chưa ổn định" },
    color: "#000",
    backgroundColor: "#dd0",
  },
  [BADGES.new]: {
    text: { en: "new", vi: "mới" },
    color: "#fff",
    backgroundColor: "#44d",
  },
  [BADGES.recommend]: {
    text: {
      en: "suggest",
      vi: "gợi ý",
    },
    color: "#fff",
    backgroundColor: "#0a0",
  },
  [BADGES.comingSoon]: {
    text: {
      en: "coming soon",
      vi: "đang phát triển",
    },
    color: "#fff",
    backgroundColor: "#666",
  },
};
