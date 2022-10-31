export default {
  name: {
    en: "Find shared login",
    vi: "Tìm tài khoản miễn phí",
  },
  description: {
    en: "Get free account from bugmenot",
    vi: "Tìm tài khoản được chia sẻ trên mạng cho trang web hiện tại",
  },
  func: function () {
    var url = "http://www.bugmenot.com/view/" + escape(location.hostname);
    w = open(
      url,
      "w",
      "location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,width=500,height=400,modal=yes,dependent=yes"
    );
    if (w) {
      setTimeout("w.focus()", 1000);
    } else {
      location = url;
    }
  },
};
