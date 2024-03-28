export default {
  icon: `<i class="fa-solid fa-cookie fa-lg"></i>`,
  name: {
    en: "View cookies",
    vi: "Xem cookies",
  },
  description: {
    en: "View cookies saved in current website",
    vi: "Xem cookies được lưu trong website hiện tại",
  },

  onClick: function () {
    var c = document.cookie.replace(/; /g, "\n");
    if (c == "") {
      alert("There is No cookie here");
    } else {
      c = decodeURI(c);
      prompt(`Cookies found:\n\n${c}\n\nYou can copy cookie here:`, c);
    }
  },
};
