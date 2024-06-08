const URLs = [
  ["Google Doc     ", "https://doc.new", "google_doc"],
  ["Google Sheet   ", "https://sheet.new", "google_sheet"],
  ["Google Slide   ", "https://slide.new", "google_slide"],
  ["Google Form    ", "https://form.new", "google_form"],
  ["Google Site    ", "https://site.new", "google_site"],
  ["Google Keep    ", "https://keep.new", "google_keep"],
  ["Google Calendar", "https://calendar.new", "google_calendar"],
];

export default {
  icon: '<i class="fa-regular fa-square-plus fa-lg"></i>',
  name: {
    en: "Google shortcuts",
    vi: "Google phím tắt",
  },
  description: {
    en: "Create new google doc/sheet/slide/form/site/keep/calendar",
    vi: "Tạo mới google doc/sheet/slide/form/site/keep/calendar",
  },

  popupScript: {
    onClick: function () {
      let option = prompt(
        "Create new:\n\n" +
          URLs.map(
            ([name, url, id], index) => `- ${index}: ${name}   (${url})\n`
          ).join(""),
        0
      );

      if (option != undefined && option >= 0 && option < URLs.length) {
        window.open(URLs[option][1]);
      }
    },
  },

  backgroundScript: {
    runtime: {
      onInstalled: () => {
        const folder_id = "google-shortcuts";
        [
          {
            id: folder_id,
            title: "Google Shortcuts",
            type: "normal",
            parentId: "root",
          },
          ...URLs.map(([name, url, id], index) => ({
            id: id,
            title: name,
            type: "normal",
            parentId: folder_id,
          })),
        ].forEach((item) => {
          chrome.contextMenus.create(item);
        });
      },
    },
    contextMenus: {
      onClicked: ({ info, tab }, context) => {
        let item = URLs.find(([name, url, id]) => id == info.menuItemId);
        if (item) {
          chrome.tabs.create({
            url: item[1],
            active: true,
          });
        }
      },
    },
  },
};
