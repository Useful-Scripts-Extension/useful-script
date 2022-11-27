export default {
  icon: "https://www.douyin.com/favicon.ico",
  name: {
    en: "Douyin - Download videos",
    vi: "Douyin - Tải videos",
  },
  description: {
    en: "Show all downloadable videos in current douyin webpage",
    vi: "Hiển thị mọi video có thể tải trong trang douyin hiện tại",
  },
  blackList: [],
  whiteList: ["https://www.douyin.com/*"],

  func: function () {
    let videos = Array.from(document.querySelectorAll("video"));

    if (!videos.length) {
      alert("Không tìm thấy video nào.");
      return;
    }

    let html = `
    <div style="display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;right:0;bottom:0;background:#000e;z-index:9999999">
      <div style="margin:auto;background:#eee;position:relative;padding:20px;overflow:auto;max-height:90vh;">
        ${videos
          .map((video) => {
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
