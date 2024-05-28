export default {
  icon: `<i class="fa-brands fa-css3 fa-lg"></i>`,
  name: {
    en: "CSS selector viewer",
    vi: "Trình kiểm tra css cục bộ",
  },
  description: {
    en: "Inspect css at specific element on the web",
    vi: "Kiểm tra mã css cho thành phần bất kỳ trong trang web",
  },

  contentScript: {
    onClick: function () {
      var div = document.createElement("div");
      div.innerHTML = "Loading...";
      div.style.color = "black";
      div.style.padding = "20px";
      div.style.position = "fixed";
      div.style.zIndex = "9999";
      div.style.fontSize = "3.0em";
      div.style.border = "2px solid black";
      div.style.right = "40px";
      div.style.top = "40px";
      div.setAttribute("class", "selector_gadget_loading");
      div.style.background = "white";
      document.body.appendChild(div);

      let script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute(
        "src",
        "https://dv0akt2986vzh.cloudfront.net/unstable/lib/selectorgadget.js"
      );
      script.onerror = () => {
        div.remove();
        script.remove();
        alert("ERROR, cannot load remote script.");
      };
      document.body.appendChild(script);
    },
  },
};
