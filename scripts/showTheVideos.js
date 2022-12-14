export default {
  icon: '<i class="fa-solid fa-film"></i>',
  name: {
    en: "Show all videos in website",
    vi: "Hiển thị mọi video có trong web",
  },
  description: {
    en: "Download video easier",
    vi: "Tải video dễ dàng hơn",
  },

  blackList: [],
  whiteList: [],

  onClickExtension: function () {
    let videos = Array.from(document.querySelectorAll("video"));

    if (!videos.length) {
      alert("Không tìm thấy video nào.");
      return;
    }

    videos.forEach((video) => (video.controls = "controls"));

    let html = `
        <div style="display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;right:0;bottom:0;background:#000e;z-index:9999999">
            <div style="margin:auto;background:#eee;position:relative;padding:20px;overflow:auto;max-height:90vh;padding-top:100px">
            ${videos
              .map((video) => {
                if (video.src) {
                  if (video.src.startsWith("blob:")) {
                    return `<a style="display:block;color:black" href="${video.src}" download>Download</a>`;
                  }
                  return `<video controls style="max-width:50vw" src="${video.src}"></video>`;
                }
                return `<video controls style="max-width:50vw">${video.innerHTML}</video>`;
              })
              .join("<br/>")}
            <button 
                onclick="this.parentElement.parentElement.remove()"
                style="position:absolute;top:0;right:0;background:red;cursor:pointer;padding:5px 10px;color:white">Close</button>
            </div>
        </div>`;

    let div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
  },
};
