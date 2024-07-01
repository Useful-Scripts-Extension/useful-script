import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { fetchGraphQl, getFbdtsg } from "./fb_GLOBAL.js";
import { hookXHR } from "./libs/ajax-hook/index.js";
import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-thumbs-up fa-lg"></i>',
  name: {
    en: "Show facebook post reaction count",
    vi: "Hiện tổng lượt thích bài viết facebook",
  },
  description: {
    en: "Show total reaction count on facebook posts when hover mouse over post's reaction section",
    vi: "Hiện tổng lượt thích bài viết khi đưa chuột vào xem lượt thích.",
    img: "/scripts/fb_getPostReactionCount.jpg",
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-06-25": "init",
  },

  whiteList: ["https://*.facebook.com/*"],

  pageScript: {
    onDocumentStart: (details) => {
      const CACHED = {};
      const ReactionId = {
        "👍": "1635855486666999",
        "💖": "1678524932434102",
        "🥰": "613557422527858",
        "😆": "115940658764963",
        "😲": "478547315650144",
        "😔": "908563459236466",
        "😡": "444813342392137",
      };

      const getPostReactionsCount = async (id, reactionId) => {
        const res = await fetchGraphQl(
          {
            fb_api_caller_class: "RelayModern",
            fb_api_req_friendly_name: "CometUFIReactionIconTooltipContentQuery",
            variables: {
              feedbackTargetID: id,
              reactionID: reactionId,
            },
            doc_id: "6235145276554312",
          },
          await getFbdtsg()
        );
        const json = JSON.parse(res || "{}");
        return json?.data?.feedback?.reactors?.count || 0;
      };

      const getTotalPostReactionCount = async (id) => {
        if (CACHED[id] === "loading") return;

        const { setText, closeAfter } = UfsGlobal.DOM.notify({
          msg: "Đang đếm số lượng reaction...",
          duration: 10000,
        });
        const numberFormater = UfsGlobal.Utils.getNumberFormatter("standard");

        let res;
        if (CACHED[id]) {
          res = CACHED[id];
        } else {
          CACHED[id] = "loading";
          res = {
            total: 0,
            each: {},
          };
          for (let [name, reactionId] of Object.entries(ReactionId)) {
            const count = await getPostReactionsCount(id, reactionId);
            res.total += count;
            res.each[name] = count;
            setText(
              `Đang đếm số lượng reaction ${name}... Tổng: ${numberFormater.format(
                res.total
              )}`
            );
          }
          CACHED[id] = res;
        }

        setText(
          "<p style='color:white;font-size:20px;padding:0;margin:0'>Tổng " +
            numberFormater.format(res.total) +
            " reaction.<br/>Bao gồm " +
            Object.entries(res.each)
              .filter(([key, value]) => value > 0)
              .map(([key, value]) => `${numberFormater.format(value)}${key}`)
              .join(", ") +
            "</p>"
        );
        closeAfter(10000);
      };

      hookXHR({
        onAfterSend: (
          { method, url, async, user, password },
          dataSend,
          response
        ) => {
          let str = dataSend?.toString?.() || "";
          if (
            str.includes("CometUFIReactionsCountTooltipContentQuery") ||
            str.includes("CometUFIReactionIconTooltipContentQuery")
          ) {
            try {
              const json = JSON.parse(response);
              if (
                json?.data?.feedback?.reaction_display_config
                  ?.reaction_display_strategy == "HIDE_COUNTS"
              ) {
                const id = json.data.feedback.id;
                getTotalPostReactionCount(id);
              }
            } catch (err) {
              console.log(err);
            }
          }
        },
      });
    },
  },
};
