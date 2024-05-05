import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-file-export fa-lg"></i>',
  name: {
    en: "Export saved facebook items",
    vi: "Xuất mục đã lưu trên facebook",
  },
  description: {
    en: "Export all your saved items on facebook to JSON file",
    vi: "Xuất các mục đã lưu của bạn trên facebook ra file JSON",
  },

  whiteList: ["https://*.facebook.com/*"],

  popupScript: {
    onClick: async function () {
      const { downloadData } = UfsGlobal.Utils;

      const c = (e) => {
        try {
          return e();
        } catch (e) {
          return !1;
        }
      };

      const getSaved = async (uid, fb_dtsg, cursor = "") => {
        if (cursor) cursor = `"cursor":"${cursor}",`;
        cursor = encodeURIComponent(
          `{"content_filter":null,"count":10,${cursor}"scale":1}`
        );
        const res = await fetch("https://www.facebook.com/api/graphql/", {
          body: `av: 100000034778747&__user=${uid}&__dyn=&fb_dtsg=${fb_dtsg}&fb_api_req_friendly_name=CometSaveDashboardAllItemsPaginationQuery&variables=${cursor}&server_timestamps=true&doc_id=3196659713724388`,
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return await res.json();
      };

      const getAllSaved = async (uid, fb_dtsg, cursor) => {
        uid = encodeURIComponent(uid);
        fb_dtsg = encodeURIComponent(fb_dtsg);

        let data = [];
        let page = 1;
        while (true) {
          setLoadingText(
            `Đang tải trang ${page}...<br/>Tải được ${data.length} mục`
          );
          let json = await getSaved(uid, fb_dtsg, cursor);
          console.log(json);
          json.data.viewer.saver_info.all_saves.edges.forEach((e) => {
            data.push(e.node);
            // data.push({
            //   title: c(() => e.node.savable.savable_title.text),
            //   type: c(() => e.node.savable.__typename),
            //   image: c(() => e.node.savable.savable_image.uri),
            //   url: c(() => e.node.savable.url),
            //   urlPost: c(() => e.node.container_savable.savable_permalink),
            //   source: {
            //     type: c(
            //       () => e.node.container_savable.savable_actors[0].__typename
            //     ),
            //     name: c(() => e.node.container_savable.savable_actors[0].name),
            //     id: c(() => e.node.container_savable.savable_actors[0].id),
            //     avatar: c(
            //       () =>
            //         e.node.container_savable.savable_actors[0].profile_picture.uri
            //     ),
            //   },
            //   containingLists: c(() => e.node.containing_lists.nodes),
            // });
          });
          let nextCursor = c(
            () => json.data.viewer.saver_info.all_saves.page_info.end_cursor
          );
          if (nextCursor) cursor = nextCursor;
          else break;
          page++;
        }
        return data;
      };

      let { setLoadingText, closeLoading } = showLoading("Đang lấy token...");
      try {
        setLoadingText("Đang chuẩn bị...");
        let [fb_dtsg, uid] = await runScriptInCurrentTab(() => [
          require("DTSGInitialData").token,
          require("CurrentUserInitialData").USER_ID,
        ]);
        setLoadingText("Đang lấy dữ liệu...");
        let saved = await getAllSaved(uid, fb_dtsg);

        if (saved.length)
          downloadData(
            JSON.stringify(saved, null, 4),
            "saved_facebook",
            "json"
          );
        else alert("Bạn không có mục nào trong saved facebook.");
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};
