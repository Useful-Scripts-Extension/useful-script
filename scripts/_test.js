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
    // fake window update screen
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

    // saveAsMHTML
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

    // Delete browsers history
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
  },

  contentScript: {
    // bypass anonyviet
    _onDocumentEnd: () => {
      if (location.hostname === "anonyviet.com") {
        let url = new URL(location.href);
        if (url.searchParams.has("url")) {
          let target = url.searchParams.get("url");
          window.open(target, "_self");
        }
      }
    },

    // sync element position accross all tabs
    _onDocumentStart: (details) => {
      console.log(details);

      const div = document.createElement("div");
      div.id = "ufs-test";
      div.innerHTML = `
      <style>
        #ufs-test {
          position: fixed;
          background-color: #f1f1f1;
          border: 1px solid #d3d3d3;
          text-align: center;
          z-index: 999999999;
          top: 0;
          left: 0;
        }

        #ufs-testheader {
          padding: 10px;
          cursor: move;
          z-index: 10;
          background-color: #2196F3;
          color: #fff;
        }
      </style>
      <div id="ufs-testheader">Click here to move</div>
      <p>Move</p>
      <p>this</p>
      <p>DIV</p>`;
      document.documentElement.appendChild(div);

      window.ufs_test = (x, y) => {
        div.style.top = y + "px";
        div.style.left = x + "px";
      };

      // Make the DIV element draggable:
      dragElement(div, (x, y) => {
        console.log(x, y);
        chrome.runtime.sendMessage({ action: "ufs-test", data: { x, y } });
      });

      function dragElement(elmnt, onMoved) {
        var pos1 = 0,
          pos2 = 0,
          pos3 = 0,
          pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "header").onmousedown =
            dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = elmnt.offsetTop - pos2 + "px";
          elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;

          onMoved?.(parseInt(elmnt.style.left), parseInt(elmnt.style.top));
        }
      }
    },

    // text size in KB
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
        requestAnimationFrame(updateFavicon);
        let img = canvas.toDataURL();
        favicon.setAttribute("href", img);
      }

      setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }, 1000 / 30);

      updateFavicon();
    },
  },

  pageScript: {
    onDocumentStart: async () => {},
  },

  backgroundScript: {
    // sync element position accross all tabs
    _onDocumentStart: (details, context) => {
      const cachedPos = context.getCache("ufs-test", { x: 0, y: 0 });
      updatePos(details.tabId, cachedPos.x, cachedPos.y);
    },
    _runtime: {
      onMessage: ({ request, sender, sendResponse }, context) => {
        if (request.action === "ufs-test" && request.data) {
          context.setCache("ufs-test", request.data);
          chrome.tabs.query({}, (tabs) => {
            for (let tab of tabs) {
              try {
                updatePos(tab.id, request.data.x, request.data.y);
              } catch (e) {}
            }
          });
        }
      },
    },
  },
};

function updatePos(tabId, x, y) {
  chrome.scripting.executeScript({
    target: {
      tabId: tabId,
    },
    func: (x, y) => {
      let interval = setInterval(() => {
        if (typeof window.ufs_test == "function") {
          window.ufs_test?.(x, y);
          clearInterval(interval);
          clearTimeout(timeout);
        }
      }, 100);

      let timeout = setTimeout(() => clearInterval(interval), 10000);
    },
    args: [x, y],
  });
}

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
