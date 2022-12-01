export default {
  icon: `<i class="fa-solid fa-lightbulb"></i>`,
  name: {
    en: "Toggle light fb newfeed",
    vi: "Bật/tắt đèn fb newfeed",
  },
  description: {
    en: "Hide Navigator bar and complementary bar",
    vi: "Ẩn giao diện 2 bên newfeed, giúp tập trung vào newfeed",
  },
  blackList: [],
  whiteList: ["*://www.facebook.com"],

  func: function () {
    [
      "div[role='navigation'].x9f619.x1ja2u2z.xnp8db0.x112wk31",
      "div[role='complementary'].x9f619.x1ja2u2z.xnp8db0.x112wk31",
    ].forEach((_) => {
      let dom = document.querySelector(_);
      if (dom) {
        dom.style.display = dom.style.display === "none" ? "block" : "none";
      } else alert("ERROR: Cannot find element" + _);
    });
  },
};

// //*[@id="mount_0_0_Rc"]/div[1]/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div/div[1]
