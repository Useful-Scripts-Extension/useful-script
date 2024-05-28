export default {
  icon: "https://s2.googleusercontent.com/s2/favicons?domain_url=https://tailieu.vn/tim-kiem/lu%E1%BA%ADt.html",
  name: {
    en: "Download free from tailieu.vn",
    vi: "Tải miễn phí từ tailieu.vn",
  },
  description: {
    en: "Download any document on tailieu.vn without login",
    vi: "Tải bất kỳ tài liệu nào trên tailieu.vn không cần đăng nhập",
  },

  whiteList: ["*://tailieu.vn/doc/*", "*://m.tailieu.vn/doc/*"],

  // onDocumentStart: () => {
  //   (function () {
  //     var origOpen = XMLHttpRequest.prototype.open;
  //     XMLHttpRequest.prototype.open = function () {
  //       console.log("request started!");
  //       this.addEventListener("load", function () {
  //         console.log("request completed!");
  //         console.log(this.readyState); //will always be 4 (ajax is completed successfully)
  //         console.log(this.responseText); //whatever the response was

  //         try {
  //           let json = JSON.parse(this.responseText);
  //           let { hash, time } = json;
  //           if (hash && time) {
  //             let url = `${window.DOMAIN}botailieu/pagedown?id=${window.intID}&hash=${hash}&t=${time}`;
  //             console.log(url);
  //             window.open(url, "_blank");
  //           }
  //         } catch (e) {
  //           console.log(e);
  //         }
  //       });
  //       origOpen.apply(this, arguments);
  //     };
  //   })();
  // },

  // onDocumentEnd: () => {
  //   setInterval(() => {
  //     window.isLogin = 1;
  //   }, 1000);

  //   window.addEventListener("beforeunload", function (event) {
  //     event.preventDefault();
  //     event.returnValue = "";
  //     return "";
  //   });
  // },

  pageScript: {
    onClick: async () => {
      let url =
        window.PDFView?.url ||
        document.querySelector("#loaddocdetail iframe")?.contentWindow?.PDFView
          ?.url;

      if (url) {
        window.open(url);
      } else {
        alert("Không tìm thấy file PDF nào");
      }
    },
  },
};
