export default {
  icon: `<i class="fa-solid fa-music fa-lg"></i>`,
  name: {
    en: "Show all audio in website",
    vi: "Hiển thị mọi audio trong trang web",
  },
  description: {
    en: "Will display all audio in website, easy to download/get link.",
    vi: "Hiển thị tất cả tag audio/âm thanh trong trang web, giúp dễ dàng tải xuống/lấy link.",
  },

  contentScript: {
    onClick: function () {
      function getSrc(audio) {
        let src = audio.getAttribute("src");
        if (src) return src;
        else {
          let source = audio.querySelector("source");
          if (source) return source.getAttribute("src");
          else return null;
        }
      }

      let audios = Array.from(document.querySelectorAll("audio") || []);
      audios = audios?.filter((_) => !!getSrc(_));

      if (!audios?.length) {
        alert(
          "Audio src not found.\n\nKhông tìm thấy âm thanh audio nào có thể tải trong trang web."
        );
      } else {
        let div = document.createElement("div");
        div.innerHTML = /*html*/ `
      <div style="position:fixed;bottom:0;left:0;bottom:0;background:#000d;padding:10px;z-index:999999999;">
        <button onclick="this.parentElement.remove()" style="position:absolute;top:-20px;right:-20px;padding:5px 10px;background:red;cursor:pointer;color:white;">
          Close
        </button>

        <div style="overflow:auto;max-height:90vh;">
       ${audios
         .map((audio) => {
           let src = getSrc(audio);
           return `<audio controls src="${src}"></audio><br/>
           <a href="${src}" target="_blank" style="color:#ddd">Open in new tab</a>`;
         })
         .join("<br/>")}
        </div>

      </div>
      `;
        document.body.appendChild(div);
      }
    },
  },
};
