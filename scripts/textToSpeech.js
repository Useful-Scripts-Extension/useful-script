export default {
  icon: '<i class="fa-solid fa-volume-high"></i>',
  name: {
    en: "Text to Speech (j2team)",
    vi: "Văn bản thành Giọng nói (j2team)",
  },
  description: {
    en: "Convert text to speech using j2team tool",
    vi: "Chuyển đổi văn bản thành giọng nói sử dụng công cụ của j2team",
  },

  popupScript: {
    onClick: () => {
      window.open("https://j2team.dev/tools/text-to-speech");
    },
  },
};

const backup = () => {
  // https://developer.chrome.com/docs/extensions/reference/api/tts
  UfsGlobal.Extension.runInBackground("chrome.tts.speak", [
    "Xin chào tất cả mọi người.",
    { lang: "vi-VN", rate: 0.1 },
  ]);
};
