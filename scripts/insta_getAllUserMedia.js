import { showLoading } from "./helpers/utils.js";

export default {
  name: {
    en: "Get all media of insta user (API)",
    vi: "Tải về tất cả media của insta user (API)",
  },
  description: {
    en: "Get all media of instagram user (use instagram API)",
    vi: "Tải về tất cả ảnh/video của người dùng instagram (sử dụng API instagram)",
  },

  changeLogs: {
    "2024-04-03": "optimize flow",
  },

  onClickExtension: async function () {
    const { downloadData } = UfsGlobal.Utils;

    let user_id = prompt("Enter user id:", "");
    if (!user_id) return;
    function getBiggestMediaFromNode(node) {
      if (node.is_video) {
        return getUniversalCdnUrl(node.video_url);
      } else {
        let r = node.display_resources;
        return r[r.length - 1]?.src;
      }
    }
    function getUniversalCdnUrl(cdnLink) {
      const cdn = new URL(cdnLink);
      cdn.host = "scontent.cdninstagram.com";
      return cdn.href;
    }

    let { closeLoading, setLoadingText } = showLoading(
      "Đang lấy link ảnh/video ..."
    );
    try {
      let all_urls = [];
      let after = "";
      while (true) {
        let data = await fetch(
          `https://www.instagram.com/graphql/query/?query_hash=396983faee97f4b49ccbe105b4daf7a0&variables={"id":"${user_id}","first":50,"after":"${after}"}`
        );
        let json = await data.json();
        let edges = json?.data?.user?.edge_owner_to_timeline_media?.edges || [];

        let urls = [];
        edges.forEach((e) => {
          let childs = e.node?.edge_sidecar_to_children?.edges;
          if (childs) {
            urls.push(...childs.map((c) => getBiggestMediaFromNode(c.node)));
          } else {
            urls.push(getBiggestMediaFromNode(e.node));
          }
        });
        all_urls.push(...urls);
        setLoadingText(`Đang lấy link ảnh/video... (${all_urls.length} link)`);

        let pageInfo =
          json?.data?.user?.edge_owner_to_timeline_media?.page_info;
        if (pageInfo?.has_next_page) {
          after = pageInfo?.end_cursor;
        } else {
          console.log("[STOP] THIS IS THE LAST PAGE.");
          break;
        }
      }
      console.log(all_urls);
      if (!all_urls?.length) {
        alert("Không tìm được link ảnh/video nào.");
      } else {
        setLoadingText(`Đang tải xuống ... (${all_urls.length} link)`);
        downloadData(all_urls.join("\n"), user_id, ".txt");
      }
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
