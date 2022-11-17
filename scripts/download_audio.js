export default {
  icon: `<i class="fa-solid fa-music"></i>`,
  name: {
    en: "Download audio in webpage",
    vi: "Tải nhạc/âm thanh đang phát",
  },
  description: {
    en: "Will display all audio in website, easy to download/get link.",
    vi: "Hiển thị tất cả audio trong trang web, giúp dễ dàng tải xuống/lấy link.",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    let audios = Array.from(document.querySelectorAll("audio") || []);
    audios = audios?.filter((_) => !!_.src);

    if (!audios?.length) {
      alert(
        "Audio src not found.\n\nKhông tìm thấy âm thanh audio nào có thể tải trong trang web."
      );
    } else {
      let div = document.createElement("div");
      div.innerHTML = `
      <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:#0005;padding:10px;">
        <button onclick="this.parentElement.remove.()" style="position:absolute;top:-20px;right:-20px;padding:5px 10px;">Close</button>

       ${audios
         .map((audio) => {
           return `<audio controls src="${audio.src}" /><br/>
          <a href="${audio.src}" target="_blank">Open in new tab</a>`;
         })
         .join("<br/>")}

      </div>
      `;
      document.body.appendChild(div);
    }
  },
};
