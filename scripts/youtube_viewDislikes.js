export default {
  icon: "https://lh3.googleusercontent.com/X0-M21C_VbWyXYuUjN55oyMDvOukjbzAxbs_WrUjwzsebWbyjFCIEchOtczI0DBvbyL9MUpuEWnghm19gF6dp8Vriw=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "View youtube video dislikes",
    vi: "Xem lượng dislike video youtube",
  },
  description: {
    en: "Know how many dislike does youtube video have",
    vi: "Biết số lượt dislikes (không thích) video youtube",
  },
  blackList: [],
  whiteList: ["www.youtube.com", "m.youtube.com"],

  // Source code extracted from https://chrome.google.com/webstore/detail/return-youtube-dislike/gebbhagfogifgggkldgodflihgfeippi
  func: async function () {
    function getVideoId(url) {
      const urlObject = new URL(url);
      const pathname = urlObject.pathname;
      if (pathname.startsWith("/clip")) {
        return document.querySelector("meta[itemprop='videoId']").content;
      } else {
        if (pathname.startsWith("/shorts")) {
          return pathname.slice(8);
        }
        return urlObject.searchParams.get("v");
      }
    }

    const apiUrl = "https://returnyoutubedislikeapi.com";
    let videoId = getVideoId(location.href);
    let response = await fetch(
      `${apiUrl}/votes?videoId=${videoId}&likeCount=`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) alert("Error: " + response.error);
        return response;
      })
      .then((response) => response.json())
      .catch((e) => alert("ERROR: " + e));

    console.log(response);
    alert("Youtube Dislikes:\n" + JSON.stringify(response, null, 4));
  },
};
