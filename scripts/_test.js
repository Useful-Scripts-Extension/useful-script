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

  pageScript: {
    onDocumentStart: (details) => {
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
      console.log(details);
    },
    runInAllFrames: true,
  },

  contentScript: {
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
  },

  backgroundScript: {
    onBeforeNavigate: () => {
      console.log("onBeforeNavigate");
    },
    onDocumentStart: () => {
      console.log("onDocumentStart");
    },
    onDocumentIdle: () => {
      console.log("onDocumentIdle");
    },
    onDocumentEnd: () => {
      console.log("onDocumentEnd");
    },
    runInAllFrames: false,
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
