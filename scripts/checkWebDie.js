export default {
  icon: `<i class="fa-solid fa-skull-crossbones"></i>`,
  name: {
    en: "Dowfor - Check web die",
    vi: "Dowfor - Kiểm tra web die",
  },
  description: {
    en: "Check web die using downforeveryoneorjustme",
    vi: "Dùng bên thứ 3 để kiểm tra xem website có bị die thật không",
  },

  func: function () {
    let url = prompt("Enter web url to check", location.hostname);

    if (url) {
      window.open("https://downforeveryoneorjustme.com/" + url);
    }
  },
};
