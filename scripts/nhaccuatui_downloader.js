export default {
  icon: "",
  name: {
    en: "Nhaccuatui downloader",
    vi: "Trình tải nhaccuatui",
  },
  description: {
    en: "Download the song that be playing in Nhaccuatui",
    vi: "Tải bài nhạc đang nghe trên Nhaccuatui",
  },
  blackList: [],
  whiteList: ["https://www.nhaccuatui.com/*"],

  func: function () {
    let listMp3 = window.player?.nctPlayerMp3?.streamingMp3?.listMp3;
    console.log(listMp3);

    if (!listMp3?.length) {
      alert("Không tìm thấy bài hát nào");
    } else if (listMp3.length === 1) {
      window.open(listMp3[0].location);
    } else {
      document.body.innerHTML += `
        `;
    }
  },
};
