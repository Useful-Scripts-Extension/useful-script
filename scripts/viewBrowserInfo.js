import { showPopup } from "./helpers/utils.js";

export default {
  icon: "https://www.google.com/chrome/static/images/favicons/favicon-32x32.png",
  name: {
    en: "View browser information",
    vi: "Xem thông tin trình duyệt",
  },
  description: {
    en: "OS name, browser name, version, userAgent, ...",
    vi: "Hệ điều hành, tên trình duyệt, version, userAgent, ...",
  },

  onClickExtension: function () {
    // https://stackoverflow.com/a/11219680/11898496
    function get_browser_2() {
      var nVer = navigator.appVersion;
      var nAgt = navigator.userAgent;
      var browserName = navigator.appName;
      var fullVersion = "" + parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion, 10);
      var nameOffset, verOffset, ix;

      // In Opera, the true version is after "Opera" or after "Version"
      if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
      }
      // In Chrome, the true version is after "Chrome"
      else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
      }
      // In Safari, the true version is after "Safari" or after "Version"
      else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          fullVersion = nAgt.substring(verOffset + 8);
      }
      // In Firefox, the true version is after "Firefox"
      else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
      }
      // In most other browsers, "name/version" is at the end of userAgent
      else if (
        (nameOffset = nAgt.lastIndexOf(" ") + 1) <
        (verOffset = nAgt.lastIndexOf("/"))
      ) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }
      // trim the fullVersion string at semicolon/space if present
      if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
      if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

      majorVersion = parseInt("" + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = "" + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
      }

      // This script sets OSName variable as follows:
      // "Windows"    for all versions of Windows
      // "MacOS"      for all versions of Macintosh OS
      // "Linux"      for all versions of Linux
      // "UNIX"       for all other UNIX flavors
      // "Unknown OS" indicates failure to detect the OS

      var OSName = "Unknown OS";
      if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
      if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
      if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
      if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

      return [
        ["Your OS", OSName],
        ["Browser name", browserName],
        ["Full version", fullVersion],
        ["Major version", majorVersion],
        ["navigator.appName", navigator.appName],
        ["navigator.userAgent", navigator.userAgent],
      ];
    }

    let infors = get_browser_2();
    let { closePopup } = showPopup(
      "Browser info",
      infors
        .map(
          ([name, value]) =>
            `<label>${name}</label> <input value="${value}"></input>`
        )
        .join("</br>")
    );
  },
};

function backup() {
  // https://stackoverflow.com/a/5918791/11898496
  //prettier-ignore
  function get_browser() {
      var ua= navigator.userAgent;
      var tem; 
      var M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if(/trident/i.test(M[1])){
          tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
          return 'IE '+(tem[1] || '');
      }
      if(M[1]=== 'Chrome'){
          tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
          if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
      if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
      return M.join(' ');
  }
}
