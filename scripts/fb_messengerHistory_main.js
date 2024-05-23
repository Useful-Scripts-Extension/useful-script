import { getFbdtsg, getUidFromUrl, getUserInfo } from "./fb_GLOBAL.js";

window.onload = async () => {
  const Global = {
    endpoint: "https://www.facebook.com/api/graphqlbatch/",
    mid: null,
    right: Date.now(),
    left: new Date("1/1/2004").getTime(),
    fb_dtsg: await getFbdtsg(),
  };

  console.log(Global);

  // query elements
  let friend_url_inp = document.querySelector("#inp-friend-url");
  let access_token_inp = document.querySelector("#inp-access-token");
  let btnScan = document.querySelector("#btn-scan");
  let loadingOverlay = document.querySelector(".overlay");
  let loadingText = document.querySelector("#loading-text");

  // init
  access_token_inp.value = localStorage.ufs_fb_messenger_history || "";
  access_token_inp.addEventListener("input", function (e) {
    localStorage.ufs_fb_messenger_history = access_token_inp.value;
  });
  btnScan.onclick = scan;

  // functions
  async function scan() {
    try {
      let friend_url = friend_url_inp.value;
      let access_token = access_token_inp.value;
      if (!friend_url) throw new Error("Vui lòng nhập link profile của bạn bè");
      if (!access_token) throw new Error("Vui lòng nhập access token của bạn");

      showLoading("Đang lấy thông tin bạn bè...");
      let friendUid = await getUidFromUrl(friend_url);
      let friendInfo = await getUserInfo(friendUid, access_token);
      console.log(friendInfo);
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      showLoading(false);
    }
  }

  function showLoading(text) {
    loadingOverlay.style.display = text ? "flex" : "none";
    if (typeof text === "string") loadingText.innerText = text;
  }

  return;

  function startScan() {}

  function search() {
    return new Promise(function (t) {
      Math.abs(n.l - n.r) <= 1e3
        ? ((n.loading = !1),
          null === n.result ? (n.error = !0) : ((n.error = !1), t(n.result)))
        : ((n.mid = 1e3 * Math.round((n.l + n.r) / 2 / 1e3)),
          n.isExist(n.mid, e).then(function (r) {
            r.length === e
              ? ((n.r = n.mid - 1), (n.result = r))
              : (n.l = n.mid + 1),
              n.search(e).then(t);
          }));
    });
  }

  function getMessageAfter(msgId, limit) {
    return new Promise(function (r, i) {
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
          t.friend_info.id +
          "&__a=1&fb_dtsg=" +
          t.csrf_token,
        credentials: "include",
      })
        .then(function (e) {
          return e.text();
        })
        .then(function (e) {
          var n = JSON.parse(e.substr(9)),
            t = n.payload.graphql_payload;
          if (t) r(t);
          else {
            var o = new Error("There is no results.");
            i(o);
          }
        });
    });
  }

  function makeQuery(cursor, limit) {
    return {
      o0: {
        doc_id: "1526314457427586",
        query_params: {
          id: this.friend_info.id,
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
          t.csrf_token +
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
};
