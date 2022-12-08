export default {
  icon: '<i class="fa-solid fa-eye-slash"></i>',
  name: {
    en: "Hide/Show Newfeed facebook",
    vi: "Ẩn/Hiện Newfeed facebook",
  },
  description: {
    en: "Hide/Show Newfeed facebook for better focus to work",
    vi: "Ẩn/Hiện Newfeed facebook để tập trung làm việc",
  },
  whiteList: ["https://www.facebook.com*"],
  runInExtensionContext: false,

  onClick: function () {
    let div = document.querySelector("#ssrb_feed_end")?.parentElement;

    if (!div) alert("Không tìm thấy NewFeed.");
    else {
      div.style.display = div.style.display === "none" ? "block" : "none";
    }
  },
};
