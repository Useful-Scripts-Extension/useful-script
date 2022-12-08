export default {
  icon: "https://jsonformatter.org/img/favicon.png",
  name: {
    en: "JSON formatter",
    vi: "JSON formatter",
  },
  description: {
    en: "Open web tool for beautify JSON in new tab",
    vi: "Mở công cụ làm đẹp JSON trong tab mới",
  },
  link: "https://jsonformatter.org/",
};

async function backup() {
  // try {
  //   let url = "https://jsonformatter.org";
  //   let strObj = prompt("Nhập object json muốn làm đẹp:", "");
  //   if (strObj != null) {
  //     let [err, obj] = strObjToObject(strObj);
  //     if (err) throw err;
  //     alert(obj);
  //     await setLocalStorage(url, "index", JSON.stringify(obj));
  //     window.open(url);
  //   }
  // } catch (e) {
  //   alert("Lỗi: " + e);
  // }
  // =====================================
  // https://stackoverflow.com/a/32357610/11898496
  // var win = window.open("https://jsonformatter.org");
  // win.focus();
  // win.addEventListener("load", () => {
  //   win.localStorage.setItem("index", "{'abc':1}");
  //   win.alert("yep");
  // });
}
