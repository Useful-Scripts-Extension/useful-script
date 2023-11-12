export default {
  icon: "https://d20ohkaloyme4g.cloudfront.net/img/favicon.ico",
  name: {
    en: "Studocu - Bypass preview",
    vi: "Studocu - Xem miễn phí VIP",
  },
  description: {
    en: "View VIP document on Studocu.com, bypass preview popup / reveal blurred content.",
    vi: "Xem tài liệu VIP trên Studocu.com, loại bỏ popup chặn xem trước, loại bỏ hiệu ứng làm mờ.",
  },
  whiteList: ["https://www.studocu.com/*", "https://studeersnel.nl/*"],

  // https://github.com/lambwheit/Studocu-Paywall-Bypass
  onDocumentStart: async () => {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName("head")[0];
      if (!head) {
        return;
      }
      style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = css;
      head.appendChild(style);
    }

    (function () {
      "use strict";
      addGlobalStyle(".page-content{filter:blur(0px)!important}");
      console.log("blur remover loaded");
      window.addEventListener("load", function () {
        console.log("load listener injected");
        try {
          window.addEventListener("click", function (evt) {
            if (evt.detail === 3) {
              var head = document.getElementsByTagName("head")[0].innerHTML;
              var tit = document.getElementsByTagName("h1")[0].innerHTML;
              var pages = document.getElementById("page-container").childNodes;

              for (var i = 0; i < pages.length; i++) {
                pages[i].childNodes[0].style = "display: block;";
              }

              var pdf = pages[0].parentNode.parentNode.parentNode.innerHTML;
              var newWindow = window.open(
                "",
                "Document",
                "height=865,width=625,status=yes,toolbar=no,menubar=no"
              );
              newWindow.document.getElementsByTagName("head")[0].innerHTML =
                head + "<style> .nofilter{filter: none !important;} </style>";
              newWindow.document.title = tit;
              newWindow.document.getElementsByTagName("body")[0].innerHTML =
                pdf;
              newWindow.document.getElementsByTagName(
                "body"
              )[0].childNodes[0].style = "";
            }
          });
        } catch (error) {
          console.log("failed to create doc viewer");
        }
        setTimeout(() => {
          try {
            var element = document.getElementById("viewer-wrapper");
            if (element != null) {
              var elements = element.childNodes;
              if (elements.length > 3) {
                elements[3].parentNode.removeChild(elements[3]);
              }
            }
          } catch (error) {
            console.log("no over-page ads found");
          }
          try {
            var pages = document.getElementsByClassName("page-content");
            for (var i = 0; i < pages.length; i++) {
              var pagecontent = pages[i].parentNode.childNodes;
              for (var j = 0; j < pagecontent.length; j++) {
                if (pagecontent[j].className != "page-content") {
                  pagecontent[j].parentNode.removeChild(pagecontent[j]);
                }
              }
            }
          } catch (error) {
            console.log("no ads on top of pages found");
          }
          try {
            document
              .getElementById("document-wrapper")
              .removeChild(
                document.getElementById("document-wrapper").childNodes[0]
              );
          } catch (errror) {
            console.log("no overpage ads found");
          }
          try {
            var container = document.getElementById("page-container");
            if (container != null) {
              Array.from(container.children).forEach(function (child) {
                if (child.className.includes("banner-wrapper")) {
                  container.removeChild(child);
                }
              });
            }
          } catch {
            console.log("no overpage ads found");
          }
        }, 100);
      });
    })();
  },
};
