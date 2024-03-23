export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Batch download",
    vi: "Tiktok - Tải hàng loạt",
  },
  description: {
    en: "Select and download all tiktok video (user profile, tiktok explore).",
    vi: "Tải hàng loạt video tiktok (trang người dùng, trang tìm kiếm), có giao diện chọn video muốn tải.",
  },

  whiteList: ["https://www.tiktok.com/*"],

  onDocumentStart: () => {
    console.log("abc");

    let checkboxes = [];

    // Setup DOM
    let container = document.createElement("div");
    container.style = [
      "position: fixed",
      "bottom: 20px",
      "left: 50%",
      "transform: translateX(-50%)",
      "background: #333e",
      "min-height: 50px",
      "padding: 15px",
      "z-index: 6",
      "border-radius: 5px",
      "border: 1px solid #eee",
      "color: white",
    ].join(";");
    document.body.appendChild(container);

    let progressDiv = document.createElement("p");
    progressDiv.innerText = "Useful script: Tiktok tải hàng loạt";
    progressDiv.style = "margin-bottom: 5px; font-family: monospace;";
    container.appendChild(progressDiv);

    // scroll button
    let scrolling = false;
    const scrollBtn = document.createElement("button");
    scrollBtn.innerText = "Scroll xuống ⏬";
    scrollBtn.onclick = async () => {
      scrolling = !scrolling;

      scrollBtn.innerText = scrolling ? "Đang scroll... ⏳" : "Scroll xuống ⏬";

      let doubleCheck = 0;
      while (scrolling) {
        let previousHeight = document.body.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (document.body.scrollHeight <= previousHeight) {
          doubleCheck++;
          console.log(doubleCheck);
          if (doubleCheck > 5) {
            scrolling = false;
            scrollBtn.innerText = "Scroll xuống ⏬";
          }
        }
      }
    };
    container.appendChild(scrollBtn);

    // Select all button
    const selectAllBtn = document.createElement("button");
    selectAllBtn.innerText = "Chọn/Huỷ chọn ✅";
    selectAllBtn.onclick = function () {
      let value = checkboxes[0].checked;
      for (let checkbox of checkboxes) {
        checkbox.checked = !value;
      }
    };
    container.appendChild(selectAllBtn);

    // Revert all Button
    const revertAllBtn = document.createElement("button");
    revertAllBtn.innerText = "Đảo ngược 🔁";
    revertAllBtn.onclick = function () {
      for (let checkbox of checkboxes) {
        checkbox.checked = !checkbox.checked;
      }
    };
    container.appendChild(revertAllBtn);

    // Download button
    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "GET LINK 🔗";
    downloadBtn.onclick = function () {
      let videoUrls = [];
      for (let checkbox of checkboxes) {
        if (checkbox.checked) {
          videoUrls.push(checkbox["data-url"]);
        }
      }
      console.log(videoUrls);
      getLinkVideos(videoUrls);
    };
    container.appendChild(downloadBtn);

    // result div
    let resultDiv = document.createElement("div");
    resultDiv.style = "margin-top: 10px";
    container.appendChild(resultDiv);

    let resultLabel = document.createElement("label");
    resultDiv.appendChild(resultLabel);

    let resultTxt = document.createElement("textarea");
    resultTxt.style = "width: 100%; height: 50px";
    resultTxt.hidden = true;
    resultDiv.appendChild(resultTxt);

    // click listener
    window.onclick = function (e) {
      if (
        e.target.type === "checkbox" ||
        e.target == selectAllBtn ||
        e.target == revertAllBtn
      ) {
        let selected = checkboxes.filter((checkbox) => checkbox.checked).length;
        progressDiv.innerText = `Đã chọn ${selected}/${checkboxes.length} video. Bấm nút Get link khi chọn xong nhé.`;
      }
    };

    function createCheckBox(url) {
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "video";
      checkbox.checked = false;
      checkbox["data-url"] = url;
      checkbox.style =
        "z-index: 0; position: absolute; top: 0; right: 0; width: 60px; height: 60px;";
      return checkbox;
    }

    async function sleep(time) {
      await new Promise((resolve) => setTimeout(resolve, time));
    }

    async function getLinkVideos(videoUrls) {
      if (!videoUrls.length) return;
      const getId = (url) => url.split("/").at(-1);
      const queue = [...videoUrls];
      const links = [];
      downloadBtn.disabled = true;

      while (queue.length) {
        let progress = `[${videoUrls.length - queue.length + 1}/${
          videoUrls.length
        }]`;
        try {
          console.log(`${progress} Đang tìm link cho video ${queue[0]}`);
          progressDiv.innerText = `${progress} Đang tìm link video ${queue[0]}...`;
          downloadBtn.innerText = `Đang get link ${progress}...`;
          let link =
            await UsefulScriptGlobalPageContext.Tiktok.downloadTiktokVideoFromId(
              getId(queue[0])
            );

          if (!link) {
            link =
              await UsefulScriptGlobalPageContext.Tiktok.downloadTiktokVideoFromUrl(
                queue[0]
              );
          }

          if (link) {
            resultTxt.hidden = false;
            resultTxt.value += link + "\n";
            let count = resultTxt.value.split("\n").filter((i) => i).length;
            resultLabel.innerText = `Link tại đây, ${count} video, copy bỏ vào IDM tải hàng loạt nhé:`;

            links.push(link);
          } else {
            progressDiv.innerText = `[LỖI] Không thể tải video ${queue[0]}.`;
            await sleep(1000);
          }
          queue.shift();
        } catch (e) {
          console.log(`${progress} Lỗi tải, thử lại sau 1s...`);
          let failId = queue.shift();
          queue.push(failId);
          await sleep(1000);
        }
      }

      progressDiv.innerText = "Bạn vẫn có thể chọn thêm video để get link.";
      downloadBtn.disabled = false;
      downloadBtn.innerText = "GET LINK 🔗";

      UsefulScriptGlobalPageContext.Utils.copyToClipboard(links.join("\n"));
      console.log(links);
    }

    // Listen for videos
    UsefulScriptGlobalPageContext.DOM.onElementsVisible(
      'a[href*="/video/"]',
      (nodes) => {
        // remove if not in DOM
        for (let i = checkboxes.length - 1; i >= 0; i--) {
          let checkbox = checkboxes[i];
          if (!document.contains(checkbox)) {
            checkboxes.splice(i, 1);
          }
        }

        for (let node of nodes) {
          if (!node.querySelector("canvas")) continue;
          let isPrivate = node.querySelector("svg.private") !== null;

          if (isPrivate) {
            let p = document.createElement("p");
            p.innerText = "Riêng tư";
            p.style = [
              "position: absolute;",
              "top: 0;",
              "right: 0;",
              "color: red",
              "background: black",
              "padding: 8px",
              "font-weight: bold",
            ].join(";");
            node.parentElement.appendChild(p);
          } else {
            let url = node.getAttribute("href");
            let checkbox = createCheckBox(url);
            node.parentElement.appendChild(checkbox);
            checkboxes.push(checkbox);
          }
        }

        let selected = checkboxes.filter((checkbox) => checkbox.checked).length;
        progressDiv.innerText = `Đã chọn ${selected}/${checkboxes.length} video. Bấm nút Get link khi chọn xong nhé.`;
      },
      true
    );
  },

  onClickExtension: () => {
    alert(`Làm các bước sau:
    1: Tích chọn nút bên trái để mở chức năng.
    2: Tải lại trang web tiktok.
    3: Sẽ hiện giao diện giúp tải hàng loạt ngay trong trang web.`);
  },
};
