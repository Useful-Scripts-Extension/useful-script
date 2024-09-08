import { sharePostToGroup } from "./popup/helpers/facebook.js";
import { ranInt } from "./popup/helpers/utils.js";

console.log("background");

const logs = [];
const sharePostToGroups = [
  //   {
  //     postUrl: "https://www.facebook.com/share/p/1phXqQ8TvxniRVsi/",
  //     caption: "",
  //     groups: [
  //       "https://www.facebook.com/groups/311528245988035",
  //       "311528245988035",
  //     ],
  //     waitMin: 5000,
  //     waitMax: 20000,
  //     timer: "2024-09-08T21:06",
  //   },
];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.action === "get_sharePostToGroups") {
    sendResponse(sharePostToGroups);
  } else if (request.action === "add_sharePostToGroups") {
    sharePostToGroups.push(request.data);
    sendResponse(sharePostToGroups);
  } else if (request.action === "remove_sharePostToGroups") {
    sharePostToGroups.splice(request.data?.index, 1);
    sendResponse(sharePostToGroups);
  } else if (request.action === "get_logs") {
    sendResponse(logs);
  } else if (request.action === "clear_logs") {
    logs.length = 0;
    sendResponse(logs);
  }
});

function addLog(log) {
  logs.push({
    time: Date.now(),
    log: log,
  });
}

setInterval(() => {
  for (let i = 0; i < sharePostToGroups.length; i++) {
    let job = sharePostToGroups[i];

    if (job.done || job.sharing) continue;

    if (job.running) {
      // sharing
      if (
        !job.nextShareTime ||
        Date.now() > new Date(job.nextShareTime).getTime()
      ) {
        let groupUrl = job.groups[job.shareIndex];
        job.sharing = true;
        sharePostToGroup({
          postUrl: job.postUrl,
          groupUrl: groupUrl,
          note: job.caption || "",
        })
          .then((sharedUrl) => {
            console.log("share", groupUrl, job, sharedUrl);
            job.sharedUrls[job.shareIndex] = sharedUrl;
            addLog(
              `SHARE ${job.shareIndex + 1}/${job.groups.length}: shared ${
                job.postUrl
              } to ${groupUrl} => ${sharedUrl}`
            );
          })
          .catch((e) => {
            console.log(e);
            addLog(
              `FAIL SHARE ${job.shareIndex + 1}/${job.groups.length}: share ${
                job.postUrl
              } to ${groupUrl} failed ${e.message}`
            );
          })
          .finally(() => {
            job.shareIndex++;
            // check done
            if (job.shareIndex > job.groups.length - 1) {
              job.running = false;
              job.done = Date.now();
              addLog(
                `DONE: share ${job.postUrl} to ${job.groups.length} groups`
              );
            } else {
              job.nextShareTime = Date.now() + ranInt(job.waitMin, job.waitMax);
            }
            job.sharing = false;
          });
      }

      continue;
    }

    // check start running
    if (Date.now() > new Date(job.timer).getTime()) {
      job.running = true;
      job.shareIndex = 0;
      job.sharedUrls = Array(job.groups.length).fill("");
      addLog(
        `START: share ${job.postUrl} to ${
          job.groups.length
        } groups: ${job.groups.join(", ")}`
      );
    }
  }
}, 1000);
