export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Download user's media",
    vi: "Tiktok - Tải toàn bộ video user",
  },
  description: {
    en: "Download all tiktok videos of user",
    vi: "Tải toàn bộ video tiktok của 1 người dùng",
  },

  onClick: async function () {
    alert("Bấm OK để bắt đầu scroll xem toàn bộ video của user.");

    let progressDiv = document.createElement("p");

    const downloadVideos = async (videoUrls) => {
      const ids = videoUrls.map((url) => url.split("/").at(-1));
      const queue = [...ids];
      const links = [];

      while (queue.length) {
        let progress = `[${links.length}/${ids.length}]`;
        try {
          console.log(`${progress} Đang tìm link cho video ${queue[0]}`);
          progressDiv.innerText = `${progress} Đang tìm link video ${queue[0]}`;
          const link =
            await UsefulScriptGlobalPageContext.Tiktok.downloadTiktokVideoFromId(
              queue[0]
            );
          links.push(link);
          queue.shift();
        } catch (e) {
          console.log(`${progress} Lỗi tải, thử lại sau 1s...`);
          let failId = queue.shift();
          queue.push(failId);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      progressDiv.innerHTML = `Link tại đây, ${
        ids.length
      } video: <textarea>${links.join("\n")}</textarea>`;

      UsefulScriptGlobalPageContext.Utils.copyToClipboard(links.join("\n"));

      alert(
        "Get link xong " +
          ids.length +
          " video. Copy link bỏ vào IDM để tải hàng loạt nhé."
      );
      console.log(links);
    };

    const findAllVideoUrl = async () => {
      let listVideo = [];
      let loop = true;
      let doubleCheck = 0;

      while (loop) {
        previousHeight = document.body.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (document.body.scrollHeight <= previousHeight) {
          doubleCheck++;
          console.log(doubleCheck);
          if (doubleCheck > 5) {
            listVideo = Array.from(document.querySelectorAll("a"))
              .map((item) => item.href)
              .filter((href) => href.includes("/video/"))
              .filter((value, index, self) => self.indexOf(value) === index);

            console.log(`[*] ${listVideo.length} video found`);
            loop = false;
          }
        }
      }
      console.log(listVideo);
      return listVideo;
    };

    const setupDOM = (videoUrls) => {
      let checkboxes = [];
      for (let url of videoUrls) {
        let a = document.querySelector(`a[href="${url}"]`);
        // add a checkbox hover on each video
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "video";
        checkbox.checked = true;
        checkbox["data-url"] = url;
        checkbox.style =
          "z-index: 5; position: absolute; top: 0; right: 0; width: 60px; height: 60px;";
        a.parentElement.appendChild(checkbox);
        checkboxes.push(checkbox);
      }

      const header = document.querySelector("[class*='DivVideoFeedTab']");

      // Select all button
      const selectAllBtn = document.createElement("button");
      selectAllBtn.innerText = "Select/UnSelect all";
      selectAllBtn.onclick = function () {
        let value = checkboxes[0].checked;
        for (let checkbox of checkboxes) {
          checkbox.checked = !value;
        }
      };
      header.appendChild(selectAllBtn);

      // Revert all Button
      const revertAllBtn = document.createElement("button");
      revertAllBtn.innerText = "Revert selection";
      revertAllBtn.onclick = function () {
        for (let checkbox of checkboxes) {
          checkbox.checked = !checkbox.checked;
        }
      };
      header.appendChild(revertAllBtn);

      // Download button
      const downloadBtn = document.createElement("button");
      downloadBtn.innerText = "Download selected";
      downloadBtn.onclick = function () {
        let videoUrls = [];
        for (let checkbox of checkboxes) {
          if (checkbox.checked) {
            videoUrls.push(checkbox["data-url"]);
          }
        }
        console.log(videoUrls);
        if (confirm("Xác nhận tải " + videoUrls.length + " video?")) {
          downloadVideos(videoUrls);
        }
      };
      header.appendChild(downloadBtn);

      // progress text
      header.appendChild(progressDiv);
    };

    const videoUrls = await findAllVideoUrl();
    setupDOM(videoUrls);

    alert(
      "Tìm được " +
        videoUrls.length +
        ` videos.
        \nHãy tích chọn các video muốn tải.
        \nSau đó bấm nút Download selected ở đầu danh sách.`
    );
  },
};
