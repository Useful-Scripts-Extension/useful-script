export default {
  icon: '<i class="fa-regular fa-square-plus"></i>',
  name: {
    en: "Google shortcuts",
    vi: "Google phím tắt",
  },
  description: {
    en: "Create new google doc/sheet/slide/form/site/keep/calendar",
    vi: "Tạo mới google doc/sheet/slide/form/site/keep/calendar",
  },
  blackList: [],
  whiteList: [],

  onClick: function () {
    let urls = [
      ["Google Doc", "https://doc.new"],
      ["Google Sheet", "https://sheet.new"],
      ["Google Slide", "https://slide.new"],
      ["Google Form", "https://form.new"],
      ["Google Site", "https://site.new"],
      ["Google Keep", "https://keep.new"],
      ["Google Calendar", "https://calendar.new"],
    ];

    let option = prompt(
      "Create new:\n\n" +
        urls.map(([name, url], index) => `- ${index}: ${name}\n`).join(""),
      0
    );

    if (option != undefined && option >= 0 && option < urls.length) {
      window.open(urls[option][1]);
    }
  },
};
