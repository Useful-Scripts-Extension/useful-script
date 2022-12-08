import { showLoading } from "./helpers/utils.js";

export default {
  icon: "https://lh3.googleusercontent.com/jm2UEmhuC3c6L5zWae0zuefgl-Azjz541WpEwvNtXwaJl7H8I9U0zRRmDRdnbvmdZ6UYhTGQJ0QVCrZXvkGIy14HFA=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Shorten URL",
    vi: "Rút gọn link",
  },
  description: {
    en: "Support tinyurl, tnyim, cuttly, bitly, j2team, ...",
    vi: "Hỗ trợ tinyurl, tnyim, cuttly, bitly, j2team, ...",
  },
  runInExtensionContext: true,

  onClick: function () {
    // https://hyperhost.ua/tools/en/surli
    // https://www.shorturl.at/shortener.php
    // https://tinyurl.com/app
    // https://cutt.ly/
    // https://bom.so/

    // Source code extracted from https://chrome.google.com/webstore/detail/url-shortener/godoifjoiadanijplaghmhgfeffnblib/related?hl=vi
    const urlShorten = [
      {
        name: "is.gd",
        func: async function (url) {
          url = encodeURIComponent(url);
          let resp = await fetch(
            "https://is.gd/create.php?format=json&url=" + url + "&logstats=1"
          );
          if (resp.status !== 200) throw "Unable to find url";
          let json = await resp.json();
          return json.shorturl;
        },
      },
      {
        name: "v.gd",
        func: async function (url) {
          url = encodeURIComponent(url);
          let resp = await fetch(
            "https://v.gd/create.php?format=json&url=" + url + "&logstats=1"
          );
          if (resp.status !== 200) throw "Unable to find url";
          let json = await resp.json();
          return json.shorturl;
        },
      },
      {
        name: "tinyurl",
        func: async function (url) {
          let resp = await fetch(
            "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url)
          );
          let text = await resp.text();

          if (text.length < 50) {
            const shorturl = text.replace("http://", "https://");
            return shorturl;
          }
          throw "Unable to find url";
        },
      },
      {
        name: "tny.im",
        func: async function (url) {
          let resp = await fetch(
            "https://tny.im/yourls-api.php?format=json&action=shorturl&url=" +
              encodeURIComponent(url)
          );
          let data = await resp.text();
          let shorturl = JSON.parse(data).shorturl.replace(
            "http://",
            "https://"
          );
          return shorturl;
        },
      },
      {
        name: "bom.so",
        func: async function (url) {
          let formData = new FormData();
          formData.append("url", url);

          let resp = await fetch("https://bom.so/shorten", {
            method: "POST",
            body: formData,
          });
          let json = await resp.json();
          if (json.error) throw json.msg;
          return json.short;
        },
      },
      {
        name: "a.priv.sh",
        func: async function (url) {
          let resp = await fetch("https://a.priv.sh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url }),
          });
          let json = await resp.json();
          if (json.message !== "success")
            throw "That URL doesn't quite look right...";
          return json.url;
        },
      },
      {
        name: "cuttly",
        note: "cần API key",
        func: function (url) {
          return new Promise((resolve, reject) => {
            chrome.storage.sync.get(["cuttlyApiKey"], async function (res) {
              let apiKey = res.cuttlyApiKey || "";
              apiKey = prompt("Enter cuttly API key:", apiKey);

              if (apiKey) {
                chrome.storage.sync.set({ cuttlyApiKey: apiKey });
                try {
                  let longurl = encodeURIComponent(url);
                  let resp = await fetch(
                    "https://ifsc-code.in/urlShorten?longUrl=" +
                      longurl +
                      "&api=" +
                      apiKey
                  );
                  let text = await resp.text();
                  let json = JSON.parse(text);
                  if (json.url.status === 4) {
                    reject("Unable to find url");
                  }
                  resolve(json.url.shortLink);
                } catch (e) {
                  reject("ERROR: " + e);
                }
              }
            });
          });
        },
      },
      {
        name: "bitly",
        note: "cần API key",
        func: function (url) {
          return new Promise((resolve, reject) => {
            chrome.storage.sync.get(["bitlyApiKey"], async function (res) {
              let apiKey = res.bitlyApiKey || "";
              apiKey = prompt("Enter bitly API key:", apiKey);

              if (apiKey) {
                chrome.storage.sync.set({ bitlyApiKey: apiKey });
                try {
                  let longurl = encodeURIComponent(url);
                  let resp = await fetch(
                    "https://api-ssl.bitly.com/v3/shorten?access_token=" +
                      apiKey +
                      "&longUrl=" +
                      longurl +
                      "&domain=bit.ly&"
                  );
                  let text = await resp.text();
                  let json = JSON.parse(text);
                  if (json.status_txt === "INVALID_ARG_ACCESS_TOKEN") {
                    reject("Invalid API key");
                  }
                  resolve(json.data.url);
                } catch (e) {
                  reject("ERROR: " + e);
                }
              }
            });
          });
        },
      },
      {
        name: "j2team",
        note: "mở tab mới",
        func: function (url) {
          let longUrl = encodeURIComponent(url);
          window.open(
            `https://j2team.dev/home/?prefill_url=${longUrl}&utm_source=useful-scripts-extension`
          );
        },
      },
    ];

    (async () => {
      let index = prompt(
        "Shorten URL / Rút gọn link\n\n" +
          urlShorten
            .map(
              (_, i) => ` ${i}: ${_.name} ${_.note ? "(" + _.note + ")" : ""}`
            )
            .join("\n"),
        0
      );

      if (index !== null && index >= 0 && index < urlShorten.length) {
        let shortener = urlShorten[index];

        let url = prompt(
          `Enter URL want to shorten:\nNhập link muốn rút gọn: (${shortener.name})`,
          ""
        );

        if (url) {
          const { closeLoading } = showLoading("Đang tạo link rút gọn...");
          try {
            let shortUrl = await shortener?.func?.(url);

            if (shortUrl)
              prompt(
                `Shorten URL / Link rút gọn (${shortener.name}):`,
                shortUrl
              );
            else
              alert("Unable to get short link / Không lấy được link rút gọn");
          } catch (e) {
            alert("ERROR " + e);
          } finally {
            closeLoading();
          }
        }
      }
    })();
  },
};

function backup() {
  let div = `<div class="container">
  <div class="inner-container">
    <button id="close-btn">Close</button>

  </div>
</div>
<style>
  .container {
    position: fixed;
    top:0;left:0;right:0;bottom:0;
    background: #333e;
    display: flex;
    justify-content: center;
  }
  .inner-container {
    position: relative;
    background: #aaa;
  }
  #close-btn {
    position: absolute;
    top: 0; right: 0;
    padding: 5px 10px;
  }
</style>`;

  let child = document.createElement("div");
  child.innerHTML = div;
  document.body.appendChild(child);

  document.querySelector("#close-btn")?.addEventListener("click", function () {
    child.remove();
  });
}
