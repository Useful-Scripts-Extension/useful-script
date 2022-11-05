export default {
  icon: 'https://lh3.googleusercontent.com/6PBcKpsoS15e2SUqMi6_KGBHsnvUdaRrRYXkHM3zkn5Zzj8TAEJp1_RtykaCfn1DCmyH9PJOKHrMbmtAOnQqtAU8aLs=w128-h128-e365-rj-sc0x00ffffff',
  name: {
    en: "Youtube popup player",
    vi: "Xem youtube trong popup",
  },
  description: {
    en: "Open current youtube video in new popup player",
    vi: "Xem video youtube hiện tại trong cửa sổ popup mới",
  },
  blackList: [],
  whiteList: ["www.youtube.com", "m.youtube.com"],
  func: function () {
    const urlObject = new URL(location.href);
    const key = urlObject.searchParams.get("v");
    const list = urlObject.searchParams.get("list");

    window.open(
      `https://www.youtube.com/pop-up-player/${key}` +
        (list ? `?list=${list}&efyt_playlist=true` : ""),
      "",
      "toolbar=no,location=no,directories=no,status=no, menubar=no,height=400,width=600"
    );
  },
};
