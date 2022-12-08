import { getCurrentTab } from "./helpers/utils.js";

export default {
  // icon get from https://chrome.google.com/webstore/detail/google-cache-viewer/fgfklknfijhflahngajfoagmoilakebp
  icon: "https://lh3.googleusercontent.com/OoZ3sM4u01hfT9201pmeBasLOsaRlZe2CbXzcXQLBYOcgpKVDPEakpr_ZHxiXQ1IkQ5dYTvEYndU0m8RH7TOhb1H=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "View Google cache of website",
    vi: "Xem Google cache của trang web",
  },
  description: {
    en: "View blocked website",
    vi: "Phù hơp để xem các trang web bị block",
  },
  runInExtensionContext: true,

  func: async function () {
    // https://cachedviews.com/

    let { url } = await getCurrentTab();
    let url_to_check = prompt(
      "Nhập URL muốn xem cache: ",
      url.replace(/^http\:\/\/(.*)$/, "$1")
    );
    if (url_to_check != null) {
      window.open(
        "http://www.google.com/search?q=cache:" +
          encodeURIComponent(url_to_check)
      );
    }
  },
};
