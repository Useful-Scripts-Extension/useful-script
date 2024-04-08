export default {
  icon: "https://www.userscript.zone/favicon.ico",
  name: {
    en: "Search Userscripts",
    vi: "Tìm Userscripts",
  },
  description: {
    en: "Search Userscripts on Usersript.zone",
    vi: "Tìm Userscripts trên Usersript.zone",
  },

  onClickExtension: function () {
    window.open("https://www.userscript.zone/");
  },
};
