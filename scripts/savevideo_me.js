export default {
  icon: `https://savevideo.me/favicon.ico`,
  name: {
    en: "SaveVideo - Download video",
    vi: "SaveVideo - Tải video",
  },
  description: {
    en: "Download videos from Dailymotion, Facebook, Vimeo, Twitter, Instagram / Reels, TikTok, Rumble.com, Streamable.com, Aol Video, Bilibili.com (哔哩哔哩), Bilibili.tv, Coub, DouYin (抖音), Flickr Videos, Focus.de, GMX.net / WEB.DE, ItemFix, Magisto, Reddit, Sapo.pt, T.me (Telegram), Tiscali.it Video, Tudou, Veoh, Vidmax.com, Vine (archive), WorldStarHipHop, Youku",
    vi: "Tải videos từ Dailymotion, Facebook, Vimeo, Twitter, Instagram / Reels, TikTok, Rumble.com, Streamable.com, Aol Video, Bilibili.com (哔哩哔哩), Bilibili.tv, Coub, DouYin (抖音), Flickr Videos, Focus.de, GMX.net / WEB.DE, ItemFix, Magisto, Reddit, Sapo.pt, T.me (Telegram), Tiscali.it Video, Tudou, Veoh, Vidmax.com, Vine (archive), WorldStarHipHop, Youku",
  },

  popupScript: {
    onClick: async function () {
      const { getCurrentTab, openPopupWithHtml, showLoading } = await import(
        "./helpers/utils.js"
      );

      // https://savevideo.me/en/

      let { closeLoading } = showLoading("Đang get link video...");
      try {
        let tab = await getCurrentTab();
        let url = prompt("Enter video url: ", tab.url);
        if (url == null) return;

        let formData = new FormData();
        formData.append("url", url);
        formData.append("form", "Download");

        let res = await fetch("https://savevideo.me/en/get/", {
          method: "POST",
          body: formData,
        });
        let text = await res.text();
        openPopupWithHtml(text, 600, 400);
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};
