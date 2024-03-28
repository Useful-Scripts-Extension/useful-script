export default {
  icon: '<i class="fa-solid fa-virus fa-lg"></i>',
  name: {
    en: "Inject script to website",
    vi: "Nhúng script vào trang web",
  },
  description: {
    en: "",
    vi: "",
  },
  onClick: function () {
    let url = prompt(
      "Enter script url / Nhập link script: ",
      "//code.jquery.com/jquery-3.6.1.min.js"
    );

    if (url) {
      UsefulScriptGlobalPageContext.DOM.injectScriptSrc(
        url,
        (success, error) => {
          if (success) {
            alert("Inject SUCCESS: " + url);
          } else {
            alert("Inject FAILED. " + error);
          }
        }
      );
    }
  },
};

function backup() {
  // https://stackoverflow.com/a/38840724/11898496
  // Script loader: https://plnkr.co/edit/b9O19f?p=preview&preview
}
