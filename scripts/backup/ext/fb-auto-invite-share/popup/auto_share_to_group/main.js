import {
  getEntityAbout,
  getPostIdFromUrl,
  getUidFromUrl,
  TargetType,
} from "../helpers/facebook.js";

const runningDiv = document.getElementById("running");
const inputPostURL = document.getElementById("inputPostURL");
const inputCaption = document.getElementById("inputCaption");
const inputGroups = document.getElementById("inputGroups");
const waitMinInp = document.getElementById("inputWaitMin");
const waitMaxInp = document.getElementById("inputWaitMax");
const inputTimer = document.getElementById("inputTimer");
const startBtn = document.getElementById("start-btn");
const logTxt = document.getElementById("logs");
const clearLogBtn = document.getElementById("clear-logs");

let listenClick = false;

async function main() {
  initCacheInput(inputPostURL, "share-group-post-url");
  initCacheInput(inputCaption, "share-group-caption");
  initCacheInput(inputGroups, "share-group-groups");
  initCacheInput(waitMinInp, "share-group-wait-min");
  initCacheInput(waitMaxInp, "share-group-wait-max");

  renderJobs();
  renderLogs();

  clearLogBtn.addEventListener("click", () => {
    clearLog();
  });

  inputTimer.value = formatTime();
  inputTimer.addEventListener("input", () => {
    console.log(inputTimer.value);
  });
  startBtn.addEventListener("click", async () => {
    try {
      if (!inputPostURL.value)
        throw Error("Vui lòng nhập link bài viết muốn chia sẻ");

      if (!inputGroups.value) throw Error("Vui lòng nhập link/id các group");

      if (Number(waitMinInp.value) > Number(waitMaxInp.value))
        throw Error(
          "Thời gian chờ không hợp lệ " +
            waitMinInp.value +
            " > " +
            waitMaxInp.value
        );

      startBtn.innerHTML = "Đang kiểm tra bài viết...";
      const postId = await getPostIdFromUrl(inputPostURL.value);
      if (!postId)
        throw Error(
          "Không tìm thấy id bài viết, vui lòng kiểm tra lại link bài viết"
        );

      const postOwnerId = await getUidFromUrl(inputPostURL.value);
      if (!postOwnerId) {
        throw new Error("Không tìm thấy uid của tác giả bài viết");
      }

      const groupUrls = inputGroups.value.split("\n");
      const failedGroups = [];
      for (let i = 0; i < groupUrls.length; ++i) {
        try {
          startBtn.innerHTML =
            "Đang kiểm tra các group... " + (i + 1) + "/" + groupUrls.length;
          const groupId = await getUidFromUrl(groupUrls[i]);
          const groupInfo = await getEntityAbout(groupId);
          console.log(groupId, groupInfo);
          if (groupInfo?.type !== TargetType.Group)
            failedGroups.push({
              url: groupUrls[i],
              info: groupInfo,
              error: "Không phải là group: " + groupInfo?.type,
            });
        } catch (e) {
          failedGroups.push({
            url: groupUrls[i],
            error: e,
          });
        }
      }
      if (!failedGroups.length) addJob();
      else if (
        confirm(
          `Có ${failedGroups.length} group không hợp lệ. Bạn có muốn tiếp tục không?\n\n` +
            failedGroups
              .map((_, i) => `+ ${_.url} ${_.info?.name || ""}: ${_.error}`)
              .join("\n") +
            "\n\n> Bấm Huỷ/Cancel để nhập lại\n> Bấm Ok để bỏ qua group lỗi"
        )
      ) {
        const groupsLeft = groupUrls.filter(
          (url) => !failedGroups.map((_) => _.url).includes(url)
        );

        if (groupsLeft.length) {
          inputGroups.value = groupsLeft.join("\n");
          addJob();
        } else alert("Không còn group hợp lệ để chia sẻ. Vui lòng nhập lại.");
      }
    } catch (e) {
      alert("LỖI: " + e.message);
    } finally {
      startBtn.innerHTML = "Lưu";
    }
  });
}

main();

function initCacheInput(input, cacheName) {
  if (localStorage.getItem(cacheName)) {
    input.value = localStorage.getItem(cacheName);
  }
  input.addEventListener("input", () => {
    localStorage.setItem(cacheName, input.value);
  });
}

function renderJobs() {
  if (!listenClick) {
    document.addEventListener("click", (e) => {
      const delJob = e.target.getAttribute("data-delete-job");
      if (delJob) {
        if (confirm("Xác nhận xoá?")) removeJob(delJob);
      }
    });

    listenClick = true;
  }

  getJobs().then((jobs) => {
    if (!jobs.length) runningDiv.innerHTML = "Không có bài đang chia sẻ";
    else
      runningDiv.innerHTML = `
      <h2>Lịch sử</h2>
      <table border="1" style="border-collapse: collapse;min-width: 100%;margin-top:10px">
        <tr>
          <td>Trạng thái</td>
          <td>Post</td>
          <td>Group</td>
          <td>Caption</td>
          <td>Xem</td>
          <td>Xoá</td>
        </tr>
  ${jobs
    .map((job, i) => {
      let status;
      if (job.done)
        status =
          "Xong lúc<br/>" +
          new Date(job.done).toLocaleString().split(",").join("<br/>");
      else if (job.running)
        status = !job.sharing
          ? "Đang đợi " +
            renderTime(job.nextShareTime - Date.now(), 0) +
            ": " +
            (job.shareIndex + 1) +
            "/" +
            job.groups.length
          : "Đang chia sẻ " + (job.shareIndex + 1) + "/" + job.groups.length;
      else {
        let milis = new Date(job.timer) - Date.now();
        status =
          "Sẽ bắt đầu sau<br/>" +
          (milis < 100000
            ? renderTime(milis, 0)
            : new Date(job.timer).toLocaleString().split(",").join("<br/>"));
      }

      return `
        <tr>
          <td>${status}</td>
          <td>
            <a href="${job.postUrl}" target="_blank">
              ..${job.postUrl.slice(-5)}
            </a>
          </td>
          <td>${job.groups
            .map((g) => `<a href="${g}" target="_blank">..${g.slice(-5)}</a>`)
            .join("<br>")}</td>
          <td>${job.caption}</td>
          <td>
          ${
            job.sharedUrls
              ?.map((url) =>
                url ? `<a href="${url}" target="_blank">Link</a>` : "Chưa share"
              )
              ?.join("<br>") || "Chưa share"
          }
          </td>
          <td><button data-delete-job="${i}">Xoá</button></td>
        </tr>
        `;
    })
    .join("")}
      </table>
    `;
    setTimeout(renderJobs, 1000);
  });
}

function renderLogs() {
  getLogs().then((logs) => {
    logTxt.innerHTML = logs
      .map((log) => new Date(log.time).toLocaleString() + ": " + log.log)
      .reverse()
      .join("\n\n");

    setTimeout(renderLogs, 1000);
  });
}

function formatTime(time = new Date()) {
  return `${time.getFullYear()}-${padZero(time.getMonth() + 1)}-${padZero(
    time.getDate()
  )}T${padZero(time.getHours())}:${padZero(time.getMinutes())}`;
}

function padZero(num) {
  return ("0" + num).slice(-2);
}

function getLogs() {
  return chrome.runtime.sendMessage({
    action: "get_logs",
  });
}

function getJobs() {
  return chrome.runtime.sendMessage({
    action: "get_sharePostToGroups",
  });
}

function addJob() {
  return chrome.runtime.sendMessage({
    action: "add_sharePostToGroups",
    data: {
      postUrl: inputPostURL.value,
      caption: inputCaption.value,
      groups: inputGroups.value.split("\n"),
      waitMin: parseInt(waitMinInp.value) * 1000,
      waitMax: parseInt(waitMaxInp.value) * 1000,
      timer: inputTimer.value,
    },
  });
}

function removeJob(index) {
  return chrome.runtime.sendMessage({
    action: "remove_sharePostToGroups",
    data: {
      index,
    },
  });
}

function clearLog() {
  return chrome.runtime.sendMessage({
    action: "clear_logs",
  });
}

function renderTime(time, fixed = 1) {
  return (time / 1000).toFixed(fixed) + "s";
}
