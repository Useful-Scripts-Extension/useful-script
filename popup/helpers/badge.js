export const addBadge = (script, ...badges) => ({ ...script, badges: badges });

export const BADGES = {
  hot: {
    text: { en: "hot", vi: "hot" },
    color: "#fff",
    backgroundColor: "#d40",
  },
  beta: {
    text: { en: "beta", vi: "beta" },
    color: "#000",
    backgroundColor: "#dd0",
  },
  new: {
    text: { en: "new", vi: "mới" },
    color: "#fff",
    backgroundColor: "#44d",
  },
  unstable: {
    text: { en: "unstable", vi: "chưa ổn định" },
    color: "#fff",
    backgroundColor: "#a77",
  },
};
