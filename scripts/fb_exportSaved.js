import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-file-export fa-lg"></i>',
  name: {
    en: "Export saved items from facebook",
    vi: "Xuất mục đã lưu trên facebook",
  },
  description: {
    en: "Export all your saved items on facebook",
    vi: "Xuất ra file các mục đã lưu của bạn trên facebook",
  },

  onClickExtension: async function () {
    const encodeHTML = (e) =>
      e?.replace(/([\u00A0-\u9999<>&])(.|$)/g, function (e, a, t) {
        return "&" !== a || "#" !== t
          ? (/[\u00A0-\u9999<>&]/.test(t) && (t = "&#" + t.charCodeAt(0) + ";"),
            "&#" + a.charCodeAt(0) + ";" + t)
          : e;
      });

    const checkExit = (e) => {
      try {
        return e();
      } catch (e) {
        return !1;
      }
    };

    const get_posts = async (uid, fb_dtsg, cursor) => {
      console.log("Đang lấy dữ liệu! Vui lòng chờ trong giây lát...");
      if (cursor) cursor = `"cursor":"${cursor}",`;

      uid = encodeURIComponent(uid);
      fb_dtsg = encodeURIComponent(fb_dtsg);
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
      let json = await res.json();
      console.log(json);
      json.data.viewer.saver_info.all_saves.edges.forEach((e) => {
        data.push({
          title: encodeHTML(checkExit(() => e.node.savable.savable_title.text)),
          type: checkExit(() => e.node.savable.__typename),
          image: checkExit(() => e.node.savable.savable_image.uri),
          url: checkExit(() => e.node.savable.url),
          urlPost: checkExit(() => e.node.container_savable.savable_permalink),
          sourceType: checkExit(
            () => e.node.container_savable.savable_actors[0].__typename
          ),
          sourceName: checkExit(
            () => e.node.container_savable.savable_actors[0].name
          ),
          sourceID: checkExit(
            () => e.node.container_savable.savable_actors[0].id
          ),
          sourceImage: checkExit(
            () => e.node.container_savable.savable_actors[0].profile_picture.uri
          ),
        });
      });
      let s = !1;
      if (
        (checkExit(
          () => json.data.viewer.saver_info.all_saves.page_info.has_next_page
        ) &&
          (s = json.data.viewer.saver_info.all_saves.page_info.has_next_page),
        !0 === s)
      )
        await get_posts(
          json.data.viewer.saver_info.all_saves.page_info.end_cursor
        );
      else {
        // let e = window.btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        // template(e);
        console.log("Done! Đang xuất dữ liệu...");
      }
    };

    let { setLoadingText, closeLoading } = showLoading("Đang lấy token...");
    try {
      let [fb_dtsg, uid] = await runScriptInCurrentTab(() => [
        require("DTSGInitialData").token,
        require("CurrentUserInitialData").USER_ID,
      ]);
      get_posts(uid, fb_dtsg);
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
