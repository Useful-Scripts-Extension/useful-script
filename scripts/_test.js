export default {
  icon: "",
  name: {
    en: "Test",
    vi: "Test",
  },
  description: {
    en: "",
    vi: "",
  },

  popupScript: {
    _onClick: async () => {
      const { openWebAndRunScript } = await import("./helpers/utils.js");
      openWebAndRunScript({
        url: "https://www.whitescreen.online/blue-screen-of-death-windows/",
        func: () => {
          setTimeout(() => {
            document.querySelector(".full-screen").click();
          }, 1000);
        },
        focusImmediately: true,
        waitUntilLoadEnd: true,
      });
    },
    _onClick: async () => {
      const { getCurrentTab, showLoading } = await import("./helpers/utils.js");
      const tab = await getCurrentTab();

      const blob = await chrome.pageCapture.saveAsMHTML({
        tabId: tab.id,
      });

      chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: "web.mhtml",
      });
    },
    _onClick: async () => {
      const { getCurrentTab, showLoading } = await import("./helpers/utils.js");

      const { setLoadingText, closeLoading } = showLoading(
        "Đang lấy thông tin web..."
      );

      const tab = await getCurrentTab();

      setLoadingText("Đang lấy lịch sử duyệt web...");
      let hostname = new URL(tab.url).hostname;
      let today = new Date();
      let weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const histories = await chrome.history.search({
        text: hostname,
        maxResults: 10000,
        startTime: weekAgo.getTime(),
      });

      if (
        confirm(
          "Tìm thấy " +
            histories?.length +
            " lịch sử duyệt web của " +
            hostname +
            "\n\nXác nhận xoá?"
        )
      ) {
        for (let i = 0; i < histories.length; i++) {
          let his = histories[i];
          setLoadingText(`Đang xoá ${i}/${histories.length}...`);
          try {
            await chrome.history.deleteUrl({ url: his.url });
          } catch (e) {
            console.log(e);
          }
        }
      }
      closeLoading();

      /*
      [
        {
            "id": "16571",
            "isLocal": true,
            "referringVisitId": "0",
            "transition": "link",
            "visitId": "41240",
            "visitTime": 1714833166516.668
        },
        {
            "id": "16571",
            "isLocal": true,
            "referringVisitId": "0",
            "transition": "link",
            "visitId": "41241",
            "visitTime": 1714833168457.202
        }
      ]
    */
    },
    _onClick: async () => {
      // const {
      //   attachDebugger,
      //   detachDebugger,
      //   sendDevtoolCommand,
      //   getCurrentTab,
      // } = await import("./helpers/utils.js");
      // let blobId = prompt("Enter blob id: ");
      // if (blobId) {
      //   const tab = await getCurrentTab();
      //   await attachDebugger(tab);
      //   let res = await sendDevtoolCommand(tab, "IO.resolveBlob", {
      //     objectId: blobId,
      //   });
      //   console.log(res);
      //   await detachDebugger(tab);
      // }
      // try {
      //   const tab = await getCurrentTab();
      //   await attachDebugger(tab);
      //   let res = await sendDevtoolCommand(tab, "Input.dispatchKeyEvent", {
      //     type: "rawKeyDown",
      //     modifiers: 2,
      //     code: "KeyQ",
      //   });
      //   console.log(res);
      //   await detachDebugger(tab);
      // } catch (e) {
      //   alert(e);
      // }
      // const tab = await getCurrentTab();
      // chrome.debugger.attach({ tabId: tab.id }, "1.2", function () {
      //   chrome.debugger.sendCommand(
      //     { tabId: tab.id },
      //     "Network.enable",
      //     {},
      //     function () {
      //       if (chrome.runtime.lastError) {
      //         console.error(chrome.runtime.lastError);
      //       }
      //     }
      //   );
      // });
      // chrome.debugger.onEvent.addListener(function (source, method, params) {
      //   if (method === "Network.responseReceived") {
      //     console.log("Response received:", params.response);
      //     // Perform your desired action with the response data
      //   }
      // });
    },
  },

  contentScript: {
    // onDocumentStart: () => {
    //   window.stop();
    // },
    _onClick: () => {
      function formatSize(size, fixed = 0) {
        size = Number(size);
        if (!size) return "?";

        const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }
        return size.toFixed(fixed) + units[unitIndex];
      }

      // https://stackoverflow.com/a/23329386
      function byteLength(str) {
        // returns the byte length of an utf8 string
        var s = str.length;
        for (var i = str.length - 1; i >= 0; i--) {
          var code = str.charCodeAt(i);
          if (code > 0x7f && code <= 0x7ff) s++;
          else if (code > 0x7ff && code <= 0xffff) s += 2;
          if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
        }
        return s;
      }

      try {
        let text = document.body.innerText;
        let len = text.length;
        let size = byteLength(text);
        size = formatSize(size, 1);
        alert("Text in this website: " + len + " characters (" + size + ")");
      } catch (e) {
        alert(e);
      }
    },
    _onClick: () => {
      function analyzeWebpage() {
        const href = window.location.href,
          hostname = window.location.hostname,
          a = href.replace("www.", "");

        const features = {
          "IP Address": (() => {
            const ipv4Regex =
              /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            const ipv6Regex = /^0x([0-9a-fA-F]{2})(.|$){3}[0-9a-fA-F]{2}$/;
            if (ipv4Regex.test(hostname) || ipv6Regex.test(hostname)) return 1;
            return -1;
          })(),
          "URL Length":
            href.length < 54
              ? -1
              : href.length >= 54 && href.length <= 75
              ? 0
              : 1,
          "Tiny URL": a.length < 7 ? 1 : -1,
          "@ Symbol": /@/.test(href) ? 1 : -1,
          "Redirecting using //": href.lastIndexOf("//") > 7 ? 1 : -1,
          "(-) Prefix/Suffix in domain": /-/.test(hostname) ? 1 : -1,
          "No. of Sub Domains": (() => {
            let len = (a.match(RegExp("\\.", "g")) || []).length;
            return len == 1 ? -1 : len == 2 ? 0 : 1;
          })(),
          HTTPS: /https:\/\//.test(href) ? -1 : 1,
          Favicon: (() => {
            let icon;
            const c = document.getElementsByTagName("link");
            for (let t = 0; t < c.length; t++) {
              ("icon" != c[t].getAttribute("rel") &&
                "shortcut icon" != c[t].getAttribute("rel")) ||
                (icon = c[t].getAttribute("href"));
            }
            if (!icon || icon.length != 12) return -1;

            let i = RegExp(hostname, "g");
            return i.test(icon) ? -1 : 1;
          })(),
        };

        console.log("Webpage Features:", features);
      }

      analyzeWebpage();
    },
    // render video in document.title
    onClick: () => {
      let video = document.querySelector("video");

      if (!video) {
        alert("Không tìm thấy video");
        return;
      }

      let canvas = document.createElement("canvas");
      canvas.style.cssText = `
        width: 64px;
        height: 64px;
        position: fixed;
        top: 0;
        left: 0;
      `;
      document.body.appendChild(canvas);

      let context = canvas.getContext("2d");

      let favicons = document.querySelectorAll("link[rel*='icon']");
      favicons.forEach((el) => {
        el.remove();
      });

      let favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      document.head.appendChild(favicon);

      function updateFavicon() {
        let img = canvas.toDataURL();
        favicon.setAttribute("href", img);
      }

      setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        updateFavicon();
      }, 500);
    },
  },

  pageScript: {
    _onClick: async () => {
      console.log("send");
      let res = await UfsGlobal.Extension.runInContentScript(
        "chrome.runtime.sendMessage",
        [{ action: "test" }, "callback"]
      );
      console.log(res);
    },
  },
};

const backup = () => {
  (() => {
    // modify window.fetch
    const originalFetch = fetch;
    fetch = function (...args) {
      console.log("fetch", ...args);
      return originalFetch(...args).then(async (res) => {
        try {
          console.log("res ne", res);
          let clone = res.clone();
          let json = await clone.json();
          console.log("json", json);

          json = {
            success: true,
            data: {},
          };
          console.log("modifiedJson", json);

          let modifiedResponse = new Response(JSON.stringify(json));
          [
            "headers",
            "ok",
            "redirected",
            "status",
            "statusText",
            "type",
            "url",
          ].forEach((key) => {
            modifiedResponse[key] = res[key];
          });

          console.log("modifiedResponse", modifiedResponse);
          return modifiedResponse;
        } catch (e) {
          console.log("error", e);
          return res;
        }
      });
    };
  })();
};
