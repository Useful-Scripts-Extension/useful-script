export default {
  name: {
    en: "Download youtube video",
    vi: "Tải video youtube",
  },
  description: {
    en: "Download video you are watching",
    vi: "Tải video youtube đang xem",
  },
  blackList: [],
  whiteList: ["www.youtube.com"],

  func: function () {
    var regeX = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&\?]*).*/,
      getYTURL = location.href,
      video_id,
      match = getYTURL.match(regeX);
    if (match && 11 == match[2].length) {
      video_id = match[2];
      var url = "https://www.youtubnow.com/watch/?v=" + escape(video_id);
      (w = open(
        url,
        "w",
        "location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,width=500,height=800,modal=yes,dependent=yes"
      ))
        ? setTimeout("w.focus()", 1e3)
        : (location = url);
    } else
      alert(
        " That's Not a Valid YouTube URL, \n Need URL like this \n http://youtube.com/watch?v=KuUYePG6ygQ "
      );
  },
};
