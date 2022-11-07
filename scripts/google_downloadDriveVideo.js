export default {
  icon: `<i class="fa-brands fa-google-drive"></i>`,
  name: {
    en: "Download google drive video",
    vi: "Tải video google drive",
  },
  description: {
    en: "For video that doesn't have download button in google drive",
    vi: "Dành cho video không có nút 'tải về' do chủ sở hữu đã giới hạn quyền",
  },
  blackList: [],
  whiteList: ["*://drive.google.com/"],

  func: function () {
    let iframe = document.querySelector("iframe");
    if (!iframe) {
      alert("Iframe Video not found / Không thấy video nào.");
    } else {
      let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
      console.log(innerDoc);
      let videos = Array.from(innerDoc.querySelectorAll("video"));

      if (videos.length === 0) {
        alert("Video not found / Không thấy video nào.");
      } else {
        window.open(videos[0].src);
      }
    }
  },
};
