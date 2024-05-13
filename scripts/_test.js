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
    onEnable: () => {
      let blockUrls = ["https://*.facebook.com/*"];
      let ids = [];
      blockUrls.forEach((domain, index) => {
        let id = index + 1;
        ids.push(id);
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: [
            {
              id: id,
              priority: 1,
              action: { type: "block" },
              condition: { urlFilter: domain, resourceTypes: ["main_frame"] },
            },
          ],
          removeRuleIds: [id],
        });
      });
      localStorage.setItem("block-ids", JSON.stringify(ids));
    },
    onDisable: () => {
      let ids = JSON.parse(localStorage.getItem("block-ids"));
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ids,
      });
    },

    onClick: () => {
      chrome.runtime
        .getURL("/scripts/net-request-rules/dynamicRulesEditor/index.html")
        .then((url) => {
          window.open(url, "_self");
        });
    },
  },

  pageScript: {
    onDocumentStart: () => {
      // CometNewsFeedPaginationQuery
      // const originalParse = JSON.parse;
      // console.log("json parse");
      // JSON.parse = function (string, reviver) {
      //   let json = originalParse(string, reviver);
      //   console.log(json);
      //   return json;
      // };
      // window.$crisp = {
      //   push: (...data) => {
      //     console.log(data);
      //     if (data?.[0]?.[0] === "set" && data?.[0]?.[1] === "session:data")
      //       debugger;
      //   },
      // };
    },
  },

  contentScript: {
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
