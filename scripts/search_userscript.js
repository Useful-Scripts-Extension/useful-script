export default {
  icon: "https://www.tampermonkey.net/favicon.ico",
  name: {
    en: "Search Userscripts",
    vi: "Tìm Userscripts",
  },
  description: {
    en: "Search Userscripts on Usersript.zone",
    vi: "Tìm Userscripts trên Usersript.zone",
  },
  runInExtensionContext: true,

  func: function () {
    let search = prompt("Search for Userscripts:", "");
    if (search != null) {
      window.open("https://www.userscript.zone/search?q=" + search);
    }
  },
};
