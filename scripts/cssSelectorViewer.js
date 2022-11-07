export default {
  icon: `<i class="fa-brands fa-css3"></i>`,
  name: {
    en: "CSS selector viewer",
    vi: "Trình kiểm tra css cục bộ",
  },
  description: {
    en: "Inspect css at specific element on the web",
    vi: "Kiểm tra mã css cho thành phần bất kỳ trong trang web",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    var s = document.createElement("div");
    s.innerHTML = "Loading...";
    s.style.color = "black";
    s.style.padding = "20px";
    s.style.position = "fixed";
    s.style.zIndex = "9999";
    s.style.fontSize = "3.0em";
    s.style.border = "2px solid black";
    s.style.right = "40px";
    s.style.top = "40px";
    s.setAttribute("class", "selector_gadget_loading");
    s.style.background = "white";
    document.body.appendChild(s);

    s = document.createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute(
      "src",
      "https://dv0akt2986vzh.cloudfront.net/unstable/lib/selectorgadget.js"
    );
    s.onerror = () => {
      alert("ERROR, cannot load remote script.");
    };
    document.body.appendChild(s);
  },
};
