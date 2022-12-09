export default {
  icon: `<i class="fa-solid fa-lightbulb"></i>`,
  name: {
    en: "Toggle light fb newfeed",
    vi: "Bật/tắt đèn fb newfeed",
  },
  description: {
    en: "Hide Navigator bar and complementary bar in facebook",
    vi: "Ẩn giao diện 2 bên newfeed, giúp tập trung vào newfeed facebook",
  },
  blackList: [],
  whiteList: ["*://www.facebook.com"],

  onClick: function () {
    [
      document.querySelectorAll('[role="navigation"]')?.[2],
      document.querySelectorAll('[role="complementary"]')?.[0],
    ].forEach((el) => {
      if (el) el.style.display = el.style.display === "none" ? "block" : "none";
      else alert("ERROR: Cannot find element");
    });
  },
};
