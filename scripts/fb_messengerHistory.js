export default {
  icon: '<i class="fa-solid fa-clock-rotate-left fa-lg"></i>',
  name: {
    en: "Facebook messenger history",
    vi: "Facebook xem tin nhắn đầu tiên",
  },
  description: {
    en: "View first message in facebook messenger",
    vi: "Xem tin nhắn đầu tiên với bạn bè trong facebook messenger",
  },
  whiteList: ["https://*.facebook.com/*", "https://*.messenger.com/*"],

  onClick: async () => {
    let friend_uid = prompt("Nhâp uid của bạn bè:", "");
    let token = prompt("Nhập access token: ");

    const Global = {
      endpoint: "https://www.facebook.com/api/graphqlbatch/",
      mid: null,
      right: Date.now(),
      left: new Date("1/1/2004").getTime(),
      csrf_token: await UsefulScriptGlobalPageContext.Facebook.getFbdtsg(),
      access_token: token,
    };

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

    function getMessageAfter() {}

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
  },
};
