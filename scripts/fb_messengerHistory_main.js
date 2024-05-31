import { getFbdtsg, getUidFromUrl, getUserInfoFromUid } from "./fb_GLOBAL.js";

const Global = {
  endpoint: "https://www.facebook.com/api/graphqlbatch/",
  fb_dtsg: await getFbdtsg(),
  friendInfo: {},
};

// query elements
const friend_url_inp = document.querySelector("#inp-friend-url");
const btnScan = document.querySelector("#btn-scan");
const loadingOverlay = document.querySelector(".overlay");
const loadingText = document.querySelector("#loading-text");
const msgContainer = document.querySelector(".msgs-container");

btnScan.onclick = scan;

// functions
async function scan() {
  try {
    let friend_url = friend_url_inp.value;
    if (!friend_url) throw new Error("Vui lòng nhập link profile của bạn bè");

    btnScan.innerText = "Đang lấy thông tin...";
    let friendUid = await getUidFromUrl(friend_url);
    let friendInfo = await getUserInfoFromUid(friendUid);

    Global.friendInfo = friendInfo;

    btnScan.innerText = "Đang quét...";
    const msgs = await startScan();
    btnScan.innerText = "Bắt đầu quét";
    console.log(msgs);

    msgs.forEach((msg) => {
      msgContainer.appendChild(createMsgElement(msg));
    });
  } catch (e) {
    alert("ERROR: " + e);
  } finally {
  }
}

function createMsgElement(msg) {
  const isFriendMsg = msg.message_sender.id == Global.friendInfo.id;

  let msgElement = document.createElement("div");
  msgElement.innerHTML = isFriendMsg
    ? `
    <div class="msg friend">
      <img class="avatar" src="${Global.friendInfo.avatar}" />
      <div class="msg-time">${formatTime(msg.timestamp_precise)}</div>
      <div class="msg-text">${msg.message.text}</div>
    </div>`
    : `
    <div class="msg">
      <div class="msg-time">${formatTime(msg.timestamp_precise)}</div>
      <div class="msg-text">${msg.message.text}</div>
    </div>`;
  return msgElement;
}

function showLoading(text) {
  loadingOverlay.style.display = text ? "flex" : "none";
  if (typeof text === "string") loadingText.innerText = text;
}

async function startScan() {
  let firstMsg = await findFirstMessage(
    new Date("1/1/2004").getTime(),
    Date.now()
  );
  console.log(firstMsg);

  btnScan.innerText = "Đang tải tin nhắn...";
  let msgs = await getMessageAfter(firstMsg[0].message_id, 50);

  console.log(msgs);

  return msgs;
}

// find oldest message
async function findFirstMessage(startTime, endTime) {
  let mid = 1e3 * Math.round((startTime + endTime) / 2 / 1e3);
  btnScan.innerText = "Đang quét " + formatTime(mid) + "...";
  let msgs = await isExist(mid, 1);

  if (Math.abs(endTime - startTime) <= 1e3) {
    return msgs;
  }

  if (msgs?.length) return await findFirstMessage(startTime, mid - 1);
  else return await findFirstMessage(mid + 1, endTime);
}

function getMessageAfter(msgId, limit) {
  return new Promise(function (resolve, reject) {
    fetch("https://www.facebook.com/ajax/mercury/search_context.php", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body:
        "message_id=" +
        msgId +
        "&limit=" +
        limit +
        "&direction=down&other_user_fbid=" +
        Global.friendInfo.uid +
        "&__a=1&fb_dtsg=" +
        Global.fb_dtsg,
      credentials: "include",
    })
      .then(function (e) {
        return e.text();
      })
      .then(function (e) {
        var n = JSON.parse(e.substr(9)),
          t = n.payload.graphql_payload;
        if (t) resolve(t);
        else {
          var o = new Error("There is no results.");
          reject(o);
        }
      });
  });
}

function makeQuery(cursor, limit) {
  return {
    o0: {
      doc_id: "1526314457427586",
      query_params: {
        id: Global.friendInfo.uid,
        message_limit: limit,
        load_messages: 1,
        load_read_receipts: !0,
        before: cursor,
      },
    },
  };
}
function isExist(cursor, limit) {
  return new Promise(function (resolve, reject) {
    fetch(Global.endpoint, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body:
        "fb_dtsg=" +
        Global.fb_dtsg +
        "&queries=" +
        JSON.stringify(makeQuery(cursor, limit)),
      credentials: "include",
    })
      .then(function (e) {
        return e.text();
      })
      .then(function (e) {
        try {
          var n = JSON.parse(e.split("\n")[0]);
          if (n.o0.data.message_thread)
            resolve(n.o0.data.message_thread.messages.nodes);
        } catch (i) {
          console.error(i.message);
        }
      });
  });
}

function formatTime(t) {
  return new Date(parseInt(t)).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: !0,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
