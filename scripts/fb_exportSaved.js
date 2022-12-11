import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-file-export"></i>',
  name: {
    en: "Export saved items from facebook",
    vi: "Xuất mục đã lưu trên facebook",
  },
  description: {
    en: "Export all your saved items on facebook",
    vi: "Xuất ra file các mục đã lưu của bạn trên facebook",
  },
  runInExtensionContext: true,

  onClick: async function () {
    const encodeHTML = (e) =>
      e.replace(/([\u00A0-\u9999<>&])(.|$)/g, function (e, a, t) {
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
        let a = "",
          t = "",
          s = "",
          i = "",
          n = "",
          l = "",
          o = "",
          c = "",
          d = "";
        checkExit(() => e.node.savable.savable_title.text) &&
          (a = encodeHTML(e.node.savable.savable_title.text)),
          checkExit(() => e.node.savable.__typename) &&
            (t = e.node.savable.__typename),
          checkExit(() => e.node.savable.savable_image.uri) &&
            (s = e.node.savable.savable_image.uri),
          checkExit(() => e.node.savable.url) && (i = e.node.savable.url),
          checkExit(() => e.node.container_savable.savable_permalink) &&
            (n = e.node.container_savable.savable_permalink),
          checkExit(
            () => e.node.container_savable.savable_actors[0].__typename
          ) && (l = e.node.container_savable.savable_actors[0].__typename),
          checkExit(() => e.node.container_savable.savable_actors[0].name) &&
            (o = e.node.container_savable.savable_actors[0].name),
          checkExit(() => e.node.container_savable.savable_actors[0].id) &&
            (c = e.node.container_savable.savable_actors[0].id),
          checkExit(
            () => e.node.container_savable.savable_actors[0].profile_picture.uri
          ) &&
            (d =
              e.node.container_savable.savable_actors[0].profile_picture.uri),
          data.push({
            title: a,
            type: t,
            image: s,
            url: i,
            urlPost: n,
            sourceType: l,
            sourceName: o,
            sourceID: c,
            sourceImage: d,
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
        get_posts(json.data.viewer.saver_info.all_saves.page_info.end_cursor);
      else {
        let e = window.btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        template(e), console.log("Done! Đang xuất dữ liệu...");
      }
    };

    let { setLoadingText, closeLoading } = showLoading("Đang lấy token...");
    try {
      let [fb_dtsg, uid] = await runScriptInCurrentTab(() => [
        require("DTSGInitialData").token,
        require("CurrentUserInitialData").USER_ID,
      ]);
    } catch (e) {
    } finally {
      closeLoading();
    }
  },
};

// Những thuộc tính/hàm có thể chia sẻ cho cách scripts khác sử dụng sẽ được viết vào đây
export const shared = {};
