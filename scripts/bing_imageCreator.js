import { showLoading, openPopupWithHtml, sleep } from "./helpers/utils.js";

export default {
  icon: "https://www.bing.com/favicon.ico",
  name: {
    en: "Bing image creator",
    vi: "Bing image creator",
  },
  description: {
    en: "Microsoft bing AI image generator",
    vi: "Trình tạo ảnh bằng AI của microsoft bing",
  },
  infoLink: "https://www.bing.com/create",

  onClickExtension: () => {
    let prompt_text = window.prompt("Enter text to create image", "");

    if (prompt_text) {
      getBingImages(prompt_text).then((urls) => {
        if (urls) {
          let html =
            `<h1>${prompt_text}</h1>` +
            urls
              .map(
                (url) =>
                  `<a href="${url}" target="_blank">${url}</a>` +
                  `<img src="${url}" style="max-width:400px; margin: 10px 0px;"/>`
              )
              .join("");
          openPopupWithHtml(html, 600, 500);
        }
      });
    }

    async function getBingImages(prompt_text) {
      const BING_URL = "https://www.bing.com";
      let { setLoadingText, closeLoading } = showLoading("Prepairing...");

      try {
        let url_encoded_prompt = encodeURIComponent(prompt_text);
        let url = `${BING_URL}/images/create?q=${url_encoded_prompt}&rt=3&FORM=GENCRE`;

        setLoadingText("Redirecting to bing...");
        let resp = await fetch(url, {
          method: "POST",
          //   redirect: "manual",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            referrer: "https://www.bing.com/images/create/",
            origin: "https://www.bing.com",
            "user-agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63",
          },
        });

        setLoadingText("Getting request id...");
        let request_id = new URLSearchParams(resp.url).get("id");
        let polling_url = `${BING_URL}/images/create/async/results/${request_id}?q=${url_encoded_prompt}`;

        setLoadingText("Waiting for results...");
        let text,
          image_links,
          waitCount = 0;

        while (true) {
          resp = await fetch(polling_url);
          if (resp.status !== 200) {
            throw Error("Could not get results");
          }
          text = await resp.text();
          if (!text) {
            waitCount++;
            setLoadingText(`Waiting for results... (${waitCount}s)`);
            await sleep(1000);
          } else {
            console.log(text);

            setLoadingText("Extracting images from data...");
            const regex = /src="([^"]+)"/g;
            image_links = [];
            let match;
            while ((match = regex.exec(text)) !== null) {
              image_links.push(match[1]);
            }

            if (image_links.length > 0) {
              break;
            }
          }
        }

        setLoadingText("Opening images...");
        let image_links_full = image_links.map((link) => link.split("?")[0]); // remove url search params
        return image_links_full;
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    }
  },
};
