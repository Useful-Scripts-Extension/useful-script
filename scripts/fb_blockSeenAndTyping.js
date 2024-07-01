import { BADGES } from "./helpers/badge.js";

export default {
  icon: "",
  name: {
    en: "Fb - block seen/typing message",
    vi: "Fb - block seen/typing message",
  },
  description: {
    en: "",
    vi: "",
    img: "",
  },
  badges: [BADGES.comingSoon],

  changeLogs: {
    date: "description",
  },

  whiteList: ["https://www.facebook.com/*", "https://www.messenger.com/*"],

  contentScript: {
    onDocumentStart: async (details) => {
      fbBlockFeatures({
        block_seen_chat: true,
        block_typing_chat: true,
      });
    },
  },
};

function getUserID() {
  try {
    return document.cookie.match(/c_user=([0-9]+)/)[1];
  } catch (e) {
    return null;
  }
}

function safeParse(e) {
  if (!e) return null;
  try {
    var t = JSON.parse(e);
    if (t) return t;
  } catch (e) {
    return debug, null;
  }
  return null;
}

export function fbBlockFeatures({
  block_seen_chat = true,
  block_typing_chat = true,
}) {
  const ignoreTopic = [
    "/send_additional_contacts",
    "/br_sr",
    "/sr_res",
    "/ls_app_settings",
  ];
  const ignoreCmd = ["pingreq", "subscribe"];
  const c_user = getUserID();
  const opts = { protocolVersion: 3 };
  let qq = [];

  function getCurrentTimestamp() {
    return Date.now() * 1000;
  }

  const wsProxy = new Proxy(window.WebSocket, {
    construct: function (target, args) {
      const instance = new target(...args),
        openHandler = (e) => {},
        messageHandler = (e) => {
          e = new Uint8Array(e.data);
          let t = parser(opts);

          // mes_block_delivery
          2e3 < e.length &&
            (t.on("packet", (e) => {
              "publish" === e.cmd &&
                "/ls_resp" === e.topic &&
                1 === e.qos &&
                qq.push(e.messageId);
            }),
            t.parse(e));
        },
        closeHandler = (e) => {
          instance.removeEventListener("open", openHandler);
          instance.removeEventListener("close", closeHandler);
          instance.removeEventListener("message", messageHandler);
        };
      instance.addEventListener("message", messageHandler);
      instance.addEventListener("open", openHandler);
      instance.addEventListener("close", closeHandler);

      instance.send = new Proxy(instance.send, {
        apply: function (target, thisArg, args) {
          const e = new Uint8Array(args[0]);
          let t = parser(opts);

          t.on("packet", (i) => {
            let rPayload;
            try {
              if (ignoreTopic.includes(i.topic) || ignoreCmd.includes(i.cmd)) {
                return target.apply(thisArg, args);
              }

              // if ("puback" === i.cmd) {
              //   // mes_block_delivery
              //   if (qq.includes(i.messageId)) return;
              //   target.apply(thisArg, args)
              // }

              if (i.payload && "/ls_req" === i.topic) {
                let a = safeParse(Buffer.from(i.payload).toString());

                // block typing
                if (block_typing_chat && a && 4 === a.type) {
                  const e = safeParse(a.payload);
                  if (
                    (e || target.apply(thisArg, args),
                    (rPayload = safeParse(e.payload)),
                    rPayload && rPayload.thread_key)
                  ) {
                    // delete t
                    return;
                  }
                }

                // settings.mes_block_active_online
                // if (a && 4 === a.type) {
                //   let e = safeParse(a.payload);

                //   if (e && "1" === e.label && '{"app_state":1}' === e.payload) {
                //     e.payload = '{"app_state":0}'
                //     a.payload = JSON.stringify(e)
                //     i.payload = Buffer.from(JSON.stringify(a))
                //     args[0] = generate(i, opts)
                //     return target.apply(thisArg, args)
                //   }
                // }

                // block seen
                if (block_seen_chat && a && 3 === a.type) {
                  let s = safeParse(a.payload);
                  console.log("block seen", s);

                  if (s && s.tasks && 1 <= s.tasks.length) {
                    let t = !1;

                    for (let e = 0; e < s.tasks.length; e++) {
                      if ("21" === s.tasks[e].label) {
                        t = !0;
                        s.tasks[e].payload = JSON.stringify({
                          thread_id: c_user.toString(),
                          last_read_watermark_ts: getCurrentTimestamp(),
                        });
                      }
                    }

                    if (t) {
                      a.payload = JSON.stringify(s);
                      i.payload = Buffer.from(JSON.stringify(a));
                      args[0] = generate(i, opts);
                      return target.apply(thisArg, args);
                    }

                    return target.apply(thisArg, args);
                  }
                }
              }

              target.apply(thisArg, args);
              // delete t
            } catch (e) {
              target.apply(thisArg, args);
            }
          });

          t.on("error", (e) => {
            target.apply(thisArg, args);
          });

          t.parse(e);
        },
      });

      return instance;
    },
  });

  window.WebSocket = wsProxy;
}
