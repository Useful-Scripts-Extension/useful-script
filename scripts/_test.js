import { showLoading } from "./helpers/utils.js";

export default {
  icon: "",
  name: {
    en: "Test",
    vi: "Test",
  },
  description: {
    en: "",
    vi: "",
  },

  onClickExtension: async () => {
    async function searchGroupForOther(other_uid, cursor, uid, dtsg) {
      let variables = JSON.stringify({
        count: 8,
        cursor: cursor ?? null,
        id: btoa(`app_collection:${other_uid}:2361831622:66`),
      });

      let f = new URLSearchParams();
      f.append("__user", uid);
      f.append("__a", 1);
      f.append("dpr", 1);
      f.append("fb_dtsg", dtsg);
      f.append("fb_api_caller_class", "RelayModern");
      f.append(
        "fb_api_req_friendly_name",
        "ProfileCometAppCollectionGridRendererPaginationQuery"
      );
      f.append("variables", variables);
      f.append("doc_id", 5244211935648733);

      try {
        let res = await fetch("https://www.facebook.com/api/graphql/", {
          method: "POST",
          body: f,
        });

        let json = await res.json();
        let { pageItems } = json.data.node;
        return {
          nextCursor: pageItems.page_info.end_cursor,
          groups: pageItems.edges.map((e) => ({
            id: e.node.node?.id || btoa(e.node.id).split(":").at(-1),
            title: e.node.title.text,
            subTitle: e.node.subtitle_text.text,
            url: e.node.url,
            visibility: e.node.node.visibility,
            image: e.node.image.uri,
            membersCount: Number(
              (
                e.node.node.forum_member_profiles.formatted_count_text ||
                e.node.node.group_member_profiles.formatted_count_text
              ).match(/\d+/)?.[0] ?? 1
            ),
            cursor: e.cursor,
          })),
        };
      } catch (e) {
        console.log("ERROR fetch page", e);
        return {
          nextCursor: null,
          groups: [],
        };
      }
    }

    async function searchAllGroupForOther(
      other_uid,
      uid,
      dtsg,
      pageFetchedCallback
    ) {
      let cursor = "";
      let allGroups = [];
      while (true) {
        let { nextCursor, groups } = await searchGroupForOther(
          other_uid,
          cursor,
          uid,
          dtsg
        );
        if (!nextCursor) {
          break;
        }
        cursor = nextCursor;
        allGroups = allGroups.concat(groups);
        await pageFetchedCallback?.(groups, allGroups);
      }
      return allGroups;
    }

    let url = prompt("Nhập link facebook bạn bè: ");
    if (url == null) return;

    let { setLoadingText, closeLoading } = showLoading("Đang chuẩn bị...");
    try {
      let { getUidFromUrl, getYourUserId, getFbdtsg } =
        UsefulScriptGlobalPageContext.Facebook;

      setLoadingText("Đang lấy uid, token...");
      let other_uid = await getUidFromUrl(url);
      let uid = await getYourUserId();
      let dtsg = await getFbdtsg();

      setLoadingText("Đang tải thông tin group...");
      let allGroups = await searchAllGroupForOther(
        other_uid,
        uid,
        dtsg,
        (groups, all) => {
          setLoadingText(
            "Đang tải thông tin group...\nTải được " + all.length + " group."
          );
        }
      );
      console.log(allGroups);
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
