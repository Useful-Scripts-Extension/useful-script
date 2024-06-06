export const CACHED = {
  followers: {
    hash: "37479f2b8209594dde7facb0d904896a",
    edge: "edge_followed_by",
  },
  following: {
    hash: "58712303d941c6855d4e888c5f0cd22f",
    edge: "edge_follow",
  },
};
export function getBiggestMediaFromNode(node) {
  if (node.is_video) {
    return getUniversalCdnUrl(node.video_url);
  } else {
    let r = node.display_resources;
    return r[r.length - 1]?.src;
  }
}
export function getUniversalCdnUrl(cdnLink) {
  try {
    const cdn = new URL(cdnLink);
    cdn.host = "scontent.cdninstagram.com";
    return cdn.href;
  } catch (e) {
    return cdnLink;
  }
}
export async function getAllMedia({ uid, progressCallback, limit = 0 }) {
  let all_urls = [];
  let after = "";
  while (true) {
    let data = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=396983faee97f4b49ccbe105b4daf7a0&variables={"id":"${uid}","first":50,"after":"${after}"}`
    );
    let json = await data.json();
    console.log(json);
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
    progressCallback?.({
      current: all_urls.length,
      data: all_urls,
    });

    let pageInfo = json?.data?.user?.edge_owner_to_timeline_media?.page_info;
    if (!pageInfo?.has_next_page || (limit > 0 && all_urls.length >= limit))
      break;
    after = pageInfo?.end_cursor;
  }

  return all_urls;
}
export async function getInstaUserInfo(username) {
  let res = await fetch(
    "https://www.instagram.com/web/search/topsearch/?query=" + username
  );
  let json = await res.json();
  if (json.status != "ok")
    throw Error(t({ vi: "Server trả về lỗi", en: "Server response error" }));
  console.log(json);
  return json;
}
export async function getUidFromUsername(username) {
  let json = await getInstaUserInfo(username);
  console.log(json);
  let firstUser = json?.users[0]?.user || {};
  if (firstUser.username != username) return null;
  return firstUser.pk;
}
export function getCrftoken() {
  try {
    return document.cookie
      .split("; ")
      .find((_) => _.startsWith("csrftoken"))
      .split("=")[1];
  } catch (e) {
    console.log("ERROR getCrftoken: ", e);
    return null;
  }
}
export async function getAllFollow({
  type,
  uid,
  csrftoken,
  progressCallback,
  limit = 0,
}) {
  if (!(type in CACHED)) throw Error(`Invalid type: ${type}`);

  async function _getFollow(uid, end_cursor) {
    let url = new URL("https://www.instagram.com/graphql/query/");
    Object.entries({
      query_hash: CACHED[type].hash,
      variables: JSON.stringify({
        id: uid,
        after: end_cursor || "",
        first: 50,
      }),
    }).forEach(([k, v]) => url.searchParams.append(k, v));

    let res = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrftoken,
        "x-requested-with": "XMLHttpRequest",
        "x-instagram-ajax": 1,
      },
    });
    return await res.json();
  }

  let cursor = "";
  let total = 0;
  let users = [];
  while (true) {
    try {
      let json = await _getFollow(uid, cursor);
      let {
        edges = [],
        count = 0,
        page_info,
      } = json?.data?.user?.[CACHED[type].edge] || {};

      if (!total) total = limit <= 0 ? count : Math.min(count, limit);

      edges.forEach((e) => users.push(e.node));

      progressCallback?.({
        total,
        current: users.length,
        data: users,
      });

      if (
        !page_info?.has_next_page ||
        !edges.length ||
        (limit > 0 && users.length >= limit)
      )
        break;
      cursor = page_info?.end_cursor || "";
    } catch (e) {
      console.log("ERROR", e);
      break;
    }
  }

  return users;
}
