export default {
  name: {
    en: "Bypass 18+ youtube video",
    vi: "Xem video giới hạn độ tuổi",
  },
  description: {
    en: "Bypass Youtube Adult filter without Sign In",
    vi: "Xem video giới hạn độ tuổi, không cần đăng nhập",
  },
  func: function () {
    if (window.location.host !== "www.youtube.com") {
      alert("Can only used in www.youtube.com");
    } else {
      let replaces = [
        ["watch?v=", "v/"],
        ["watch?v=", "embed/"],
        ["youtube", "nsfwyoutube"],
        ["youtube", "listenonrepeat"],
        ["youtube", "puritube"],
        ["youtube", "ssyoutube"],
        ["youtube", "pwnyoutube"],
      ];

      let replacesStr = replaces
        .map((_, i) => `${i + 1}: replace '${_[0]}' with '${_[1]}'`)
        .join("\n");
      let option = window.prompt(`Options:\n${replacesStr}\n\nYour Choice:`, 1);
      if (option > 0 && option <= replaces.length) {
        window.open(
          document.URL.replace(
            replaces[Number(option) - 1][0],
            replaces[Number(option) - 1][1]
          )
        );
      } else if (option) alert("Wrong choice");
    }
  },
};
