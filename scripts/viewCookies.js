export default {
  name: {
    en: "View cookies",
    vi: "Xem cookies",
  },
  description: {
    en: "View cookies saved in current website",
    vi: "Xem cookies được lưu trong website hiện tại",
  },
  func: function () {
    alert(
      "Cookies stored by this host or domain:\n\n" +
        document.cookie.replace(/; /g, "\n")
    );
  },
};
