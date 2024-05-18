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

  contentScript: {
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
    _onClick: () => {
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
    runInAllFrames: true,
  },

  pageScript: {
    onClick: async () => {
      console.log("send");
      let res = await UfsGlobal.Extension.runInContentScript(
        "chrome.runtime.sendMessage",
        [{ action: "test" }, "callback"]
      );
      console.log(res);
    },
  },

  backgroundScript: {
    runtime: {
      onInstalled: () => {
        console.log("installed");
      },
      onStartup: () => {
        console.log("startup");
      },
      onMessage: ({ request, sender, sendResponse }) => {
        console.log(request, sender, sendResponse);
        if (request.action === "test") {
          sendResponse({ data: "result test" });
        }
        return null;
      },
    },
  },
};

const backup = () => {
  (() => {
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
