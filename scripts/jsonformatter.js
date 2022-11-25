import { setLocalStorage } from "./helpers/utils.js";

export default {
  icon: "https://jsonformatter.org/img/favicon.png",
  name: {
    en: "JSON formatter",
    vi: "JSON formatter",
  },
  description: {
    en: "",
    vi: "",
  },
  runInExtensionContext: true,

  func: async function () {
    try {
      let url = "https://jsonformatter.org";
      let jsonString = prompt("Nhập object json muốn làm đẹp:", "");
      if (jsonString != null) {
        let stringify = JSON.stringify(jsonString);
        setLocalStorage(url, "index", stringify);
      }
    } catch (e) {
      alert("Lỗi: " + e);
    }

    // https://stackoverflow.com/a/32357610/11898496
    // var win = window.open("https://jsonformatter.org");
    // win.focus();
    // win.addEventListener("load", () => {
    //   win.localStorage.setItem("index", "{'abc':1}");
    //   win.alert("yep");
    // });
  },
};
