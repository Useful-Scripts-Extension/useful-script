export default {
  icon: `https://www.wappalyzer.com/favicon.ico`,
  name: {
    en: "View website stack",
    vi: "Web dùng công nghệ gì?",
  },
  description: {
    en: "Technology that current website is using",
    vi: "Xem những công nghệ/thư viện trang web đang dùng",
  },

  onClick: async function () {
    var doc = document,
      exist = doc.getElementById("wappalyzer-container");
    if (exist !== null) {
      doc.body.removeChild(exist);
    }
    var url = "https://www.wappalyzer.com/",
      time = new Date().getTime(),
      container = doc.createElement("div"),
      loading = doc.createElement("div"),
      link = doc.createElement("link");

    container.setAttribute("id", "wappalyzer-container");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", url + "css/bookmarklet.css");
    doc.head.appendChild(link);

    loading.setAttribute("id", "wappalyzer-pending");
    loading.setAttribute(
      "style",
      "background-image: url(" + url + "images/spinner.gif) !important"
    );
    container.appendChild(loading);
    doc.body.appendChild(container);

    const { setText, closeAfter } = UfsGlobal.DOM.notify({
      msg: "Useful-script: Injecting scripts...",
      align: "center",
      styleText: "",
      duration: 9999,
    });

    try {
      setText("Injecting wappalyzer.js ...");
      await UfsGlobal.DOM.injectScriptSrcAsync(
        url + "bookmarklet/wappalyzer.js"
      );
      window.wappalyzer = new Wappalyzer();
      setText("Injecting apps.js ...");
      await UfsGlobal.DOM.injectScriptSrcAsync(url + "bookmarklet/apps.js");
      setText("Injecting driver.js ...");
      await UfsGlobal.DOM.injectScriptSrcAsync(url + "bookmarklet/driver.js");
    } catch (e) {
      alert("Error: Cannot run script: " + JSON.stringify(e));
      closeAfter(0);
    }
  },
};
