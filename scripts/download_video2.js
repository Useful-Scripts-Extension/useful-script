export default {
  icon: `<i class="fa-solid fa-video"></i>`,
  name: {
    en: "Download video 2 - use external website",
    vi: "Tải video 2 - dùng web ngoài",
  },
  description: {
    en: "Download video from youtube, reddit, twitter, vidmax, liveleak, dailymotion, metacafe, ...",
    vi: "Tải video từ youtube, reddit, twitter, vidmax, liveleak, dailymotion, metacafe, ...",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    // code from https://bookmarklet.vercel.app/

    let href = window.location.href;
    if (href.indexOf("youtube.com") > -1 || href.indexOf("youtu.be") > -1) {
      window.open("https://ymp4.download/en2/?url=" + href);
    } else if (href.indexOf("reddit.com") > -1) {
      window.open("https://viddit.red/?url=" + href);
    } else if (href.indexOf("twitter.com") > -1) {
      window.open("https://www.savetweetvid.com/downloader?url=" + href);
    } else if (href.indexOf("vidmax.com") > -1) {
      window.open("https://9xbuddy.org/process?url=" + href);
    } else if (href.indexOf("liveleak.com") > -1) {
      window.open(
        "https://www.tubeoffline.com/downloadFrom.php?host=LiveLeak&video=https://" +
          href
      );
    } else if (href.indexOf("dailymotion.com") > -1) {
      window.open("https://dmvideo.download/?url=" + href);
    } else if (href.indexOf("metacafe.com") > -1) {
      window.open("https://keepv.id/?url=" + href);
    } else {
      window.open("https://keepv.id/?url=" + href);
    }
  },
};
