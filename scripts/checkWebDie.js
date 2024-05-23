export default {
  icon: `https://s2.googleusercontent.com/s2/favicons?domain=downforeveryoneorjustme.com`,
  name: {
    en: "Dowfor - Check web die",
    vi: "Dowfor - Kiểm tra web die",
  },
  description: {
    en: "Check web die using downforeveryoneorjustme",
    vi: "Dùng bên thứ 3 để kiểm tra xem website có bị die thật không",
  },

  popupScript: {
    onClick: async function () {
      const { getCurrentTab } = await import("./helpers/utils.js");
      let { url } = await getCurrentTab();
      if (url) {
        let url_to_check = prompt("Enter web url to check", url);
        if (url_to_check) {
          window.open("https://downforeveryoneorjustme.com/" + url_to_check);
        }
      } else {
        alert("Không tìm thấy url web hiện tại");
      }
    },
  },
};
