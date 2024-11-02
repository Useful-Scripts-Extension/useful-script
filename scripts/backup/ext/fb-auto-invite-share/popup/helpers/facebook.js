import { deepFindKeyInObject, getRedirectedUrl, sleep } from "./utils.js";

const CACHED = {
  fb_dtsg: {},
  urlToId: {},
};

export async function getMyUid() {
  for (let i of ["i_user", "c_user"]) {
    const d = await chrome.cookies.get({
      url: "https://www.facebook.com",
      name: i,
    });
    if (d?.value) return d?.value;
  }
  return null;
}

export async function fetchGraphQl(params, url) {
  let query = "";
  const fb_dtsg = await getFbDtsg();
  if (!fb_dtsg) {
    console.error("fb_dtsg not found");
    return null;
  }

  if (typeof params === "string") query = "&q=" + encodeURIComponent(params);
  else
    query = wrapGraphQlParams({
      dpr: 1,
      __a: 1,
      __aaid: 0,
      __ccg: "GOOD",
      server_timestamps: true,
      ...params,
    });

  const res = await fetch(url || "https://www.facebook.com/api/graphql/", {
    body: query + "&fb_dtsg=" + fb_dtsg,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",
  });
  const text = await res.text();

  // check error response
  try {
    const json = JSON.parse(text);
    if (json.errors) {
      const { summary, message, description_raw } = json.errors[0];
      if (summary) {
        console.log(json);

        const div = document.createElement("div");
        div.innerHTML = description_raw?.__html;
        const description = div.innerText;

        // notification.error({
        //   message: i18n.t("Facebook response Error"),
        //   description: summary + ". " + message + ". " + description,
        //   duration: 0,
        // });
      }
    }
  } catch (e) {}

  return text;
}

export function wrapGraphQlParams(params = {}) {
  const formBody = [];
  for (const property in params) {
    const encodedKey = encodeURIComponent(property);
    const value =
      typeof params[property] === "string"
        ? params[property]
        : JSON.stringify(params[property]);
    const encodedValue = encodeURIComponent(value);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

export async function getFbDtsg() {
  const uid = await getMyUid();
  if (CACHED.fb_dtsg[uid]) return CACHED.fb_dtsg[uid];

  for (let fn of [
    async () => {
      let text = await fetch("https://www.facebook.com/policies_center/");
      let token = text.match(/DTSGInitData",\[\],\{"token":"(.*?)"/)[1];
      return token;
    },
    async () => {
      let res = await fetch("https://mbasic.facebook.com/photos/upload/");
      let text = await res.text();
      let dtsg = RegExp(/name="fb_dtsg" value="(.*?)"/).exec(text)?.[1];
      return dtsg;
    },
    async () => {
      const res = await fetch("https://m.facebook.com/home.php", {
        headers: {
          Accept: "text/html",
        },
      });
      const text = await res.text();
      const dtsg =
        RegExp(/"dtsg":{"token":"([^"]+)"/).exec(text)?.[1] ||
        RegExp(/"name":"fb_dtsg","value":"([^"]+)/).exec(text)?.[1];
      return dtsg;
    },
  ]) {
    try {
      const res = await fn();
      if (res) {
        CACHED.fb_dtsg[uid] = res;
        return CACHED.fb_dtsg[uid];
      }
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}

export function findDataObject(object) {
  if (!object) return null;

  // Check if the current object has edges and page_info properties
  if (object.edges && object.page_info) return object;

  for (let key in object) {
    if (typeof object[key] === "object" && object[key] !== null) {
      let found = findDataObject(object[key]);
      if (found) return found;
    }
  }
  return null;
}

export async function convertStoryIdToPostId(storyId) {
  try {
    const res = await fetchGraphQl({
      q: `node(${storyId}){id}`,
    });
    // {"2616483865189864":null}
    const json = JSON.parse(res);
    return Object.keys(json)?.[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getPostIdFromUrl(url, checkRedirected = true) {
  // https://www.facebook.com/caothuvn/posts/1066080038417112
  let postId = /\/posts\/(\d+)/.exec(url)?.[1];
  if (postId) return postId;

  // https://www.facebook.com/daiphatthanh.sound/posts/pfbid021KejdfZnm1d3qcoJorbvd5QYbPAx11YZR62qjhKjfHLWD1UsKBjECRmpweC3RYNKl
  let pid = /\/posts\/(pfbid\w+)/.exec(url)?.[1];
  if (pid) return await convertStoryIdToPostId(pid);

  // https://www.facebook.com/permalink.php?story_fbid=pfbid0AAqALTc2SMYDmt6YQ7iNWw5oa7bD55jrqjaSF5FXwC6fSGrgWZ4a464Q4L3n9qxFl&id=100092839501799
  if (url.includes("permalink.php?")) {
    const search = new URLSearchParams(url.split("?")[1]);
    if (search.has("story_fbid") && search.has("id"))
      return await convertStoryIdToPostId(search.get("story_fbid"));
  }

  // https://www.facebook.com/groups/4820209227992744?multi_permalinks=9013525281994430&hoisted_section_header_type=recently_seen
  if (url.includes("multi_permalinks=")) {
    const search = new URLSearchParams(url.split("?")[1]);
    if (search.has("multi_permalinks")) return search.get("multi_permalinks");
  }

  // https://www.facebook.com/photo/?fbid=944169551077550&set=a.543172274510615&__cft__[0]=AZXddfHpNPxKlTAsfhW83Mh-qz04FYpnHYmAMsit9L8kMDvEYFNiNb4E96zAtEtBYuj1oKhalnTAXaOd7LHK2FzWbCuLl2xMLbw1IjadNyAkW0A1FZ4p9tij0uT5kZtidmf1_AYNSGGbns9BCNnGB9s3LjpaprsWonHK15VnX-63fPWsl66ZIzGQuxXp3dxKVikiExSEU9cdjf89Cq89twXtug8WBbxXZNt6JurbUtH5Gg&__tn__=%2CO%2CP-R
  if (url.includes("/photo/")) {
    const search = new URLSearchParams(url.split("?")[1]);
    if (search.has("fbid")) return search.get("fbid");
  }

  // https://www.facebook.com/groups/1154059318582088/posts/1471295353525148/
  // https://www.facebook.com/groups/j2team.community.girls/posts/1726466718113049/
  const groupPostId = /\/groups\/(.*?)\/posts\/(\d+)\//.exec(url)?.[2];
  if (groupPostId) return groupPostId;

  // https://www.facebook.com/tuilamaytrongsang/posts/%F0%9D%90%82%F0%9D%90%87%F0%9D%90%80%F0%9D%90%8F-%F0%9D%9F%91%F0%9D%9F%95-%F0%9D%90%8D%F0%9D%90%86%F0%9D%90%80%F0%9D%90%8D%F0%9D%90%86-%F0%9D%90%91%F0%9D%90%80%F0%9D%90%96-t%C3%B4i-%C4%91%C3%A3-k%C3%BD-kh%E1%BA%BF-%C6%B0%E1%BB%9Bc-v%E1%BB%9Bi-%C3%A1c-qu%E1%BB%B7-chap-n%C3%A0y-c%C3%B3-59-%E1%BA%A3nh-ai-th%E1%BA%A5y-thi%E1%BA%BFu-/334865756348955/
  const postId2 = /\/posts\/(.*?)\/(\d+)/.exec(url)?.[2];
  if (postId2) return postId2;

  // https://www.facebook.com/groups/1154059318582088/permalink/1473755286612488/?rdid=p1PnzhKIkIrnRu46&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fp%2F4NLUasyEHMpZx4uk%2F
  const postId3 = /\/permalink\/(\d+)\//.exec(url)?.[1];
  if (postId3) return postId3;

  return checkRedirected
    ? await getPostIdFromUrl(await getRedirectedUrl(url), false)
    : null;
}

export async function getIdFromUrl(url, regex) {
  try {
    if (CACHED.urlToId[url]) return CACHED.urlToId[url];
    let res = await fetch(url);
    let text = await res.text();
    if (text) {
      let id = regex.exec(text);
      if (id?.length) {
        CACHED.urlToId[url] = id[0];
        return id[0];
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export async function getUidFromUrl(url, checkRedirected = true) {
  const id = /^\d+$/.exec(url)?.[0];
  if (id) return id;

  // https://www.facebook.com/groups/4602188389829432/user/100090201240566
  const userInGroupId = /\/groups\/(\d+)\/user\/(\d+)/.exec(url)?.[2];
  if (userInGroupId) return userInGroupId;

  // groups case: https://www.facebook.com/groups/1154059318582088
  const groupId = /groups\/(\d+)/.exec(url)?.[1];
  if (groupId) return groupId;

  // user profile case: https://www.facebook.com/profile.php?id=1678639977
  const userId = /profile.php\?id=(\d+)/.exec(url)?.[1];
  if (userId) return userId;

  // https://www.facebook.com/permalink.php?story_fbid=pfbid0AAqALTc2SMYDmt6YQ7iNWw5oa7bD55jrqjaSF5FXwC6fSGrgWZ4a464Q4L3n9qxFl&id=100092839501799
  if (url.includes("permalink.php?")) {
    const search = new URLSearchParams(url.split("?")[1]);
    if (search.has("story_fbid") && search.has("id")) return search.get("id");
  }

  // https://www.facebook.com/nhandandientutiengviet/posts/pfbid02yN59UuP7fQLqX5E96D7MmxiH5YcMYVYwEpwYhZ6gAEiSAb5h4XvTvGpvkdrh4joxl
  const targetId = /facebook.com\/(.*?)\/posts\//.exec(url)?.[1];
  if (targetId) url = `https://www.facebook.com/${targetId}`;

  // https://www.facebook.com/groups/j2team.community.girls
  const groupIdStr = /\/groups\/([^\/]+)/.exec(url)?.[1];
  if (groupIdStr) {
    return await getIdFromUrl(url, /(?<="groupID":")(.\d+?)(?=")/);
  }

  const uid = await getIdFromUrl(url, /(?<="userID":")(.\d+?)(?=")/);
  if (uid) return uid;

  return checkRedirected
    ? await getUidFromUrl(await getRedirectedUrl(url), false)
    : null;
}

export async function getEntityAbout(entityID, context = "DEFAULT") {
  let res = await fetchGraphQl({
    fb_api_req_friendly_name: "CometHovercardQueryRendererQuery",
    variables: {
      actionBarRenderLocation: "WWW_COMET_HOVERCARD",
      context: context,
      entityID: entityID,
      includeTdaInfo: false,
      scale: 1,
    },
    doc_id: "7257793420991802",
  });
  const json = JSON.parse(res);
  console.log(json);
  const node = json.data.node;
  if (!node) throw new Error("Wrong ID / Entity not found");
  const typeText = node.__typename.toLowerCase();
  if (!Object.values(TargetType).includes(typeText))
    throw new Error("Not supported type: " + typeText);
  const card = node.comet_hovercard_renderer[typeText];
  const type =
    typeText === "page"
      ? TargetType.Page
      : typeText !== "user"
      ? TargetType.Group
      : card.profile_plus_transition_path?.startsWith("PAGE") ||
        card.profile_plus_transition_path === "ADDITIONAL_PROFILE_CREATION"
      ? TargetType.Page
      : TargetType.User;
  return {
    type,
    id: node.id || card.id,
    name: card.name,
    avatar: card.profile_picture.uri,
    url: card.profile_url || card.url,
    raw: json,
  };
}

export const TargetType = {
  User: "user",
  Page: "page",
  Group: "group",
  IGUser: "ig_user",
};

export async function sharePostToGroup({
  postUrl = "",
  note = "",
  groupUrl = "",
}) {
  const postId = await getPostIdFromUrl(postUrl);
  if (!postId) {
    throw new Error("Không tìm thấy post id");
  }
  const postOwnerId = await getUidFromUrl(postUrl);
  if (!postOwnerId) {
    throw new Error("Không tìm thấy uid của tác giả bài viết");
  }
  const postOwner = await getEntityAbout(postOwnerId);
  if (!postOwner) {
    throw new Error("Không lấy được thông tin tác giả bài viết");
  }
  const groupId = await getUidFromUrl(groupUrl);
  if (!groupId) {
    throw new Error("Không lấy được group id");
  }
  const myUid = await getMyUid();
  const me = await getEntityAbout(myUid);
  if (!me) {
    throw new Error("Không lấy được thông tin nick của bạn");
  }
  console.log(
    "group",
    groupId,
    "postOwner",
    postOwner,
    "post",
    postId,
    "me",
    me
  );

  const res = await fetchGraphQl({
    fb_api_req_friendly_name: "ComposerStoryCreateMutation",
    variables: {
      input: {
        composer_entry_point: "inline_composer",
        composer_source_surface: "group",
        composer_type: "group",
        source: "WWW",
        message: { ranges: [], text: note },
        with_tags_ids: null,
        inline_activities: [],
        explicit_place_id: "0",
        text_format_preset_id: "0",
        attachments: [
          {
            link: {
              share_scrape_data: JSON.stringify({
                share_type: postOwner.type === TargetType.Group ? 37 : 22,
                share_params: [parseInt(postId)],
              }),
            },
          },
          // {
          //     photo: {
          //         id: '2619470008224583',
          //     },
          // },
        ],
        event_share_metadata: { surface: "newsfeed" },
        audience: { to_id: groupId }, // target group to share
        actor_id: await getMyUid(),
      },
      feedLocation: "GROUP",
      feedbackSource: 0,
      focusCommentID: null,
      gridMediaWidth: null,
      groupID: null,
      scale: 2,
      privacySelectorRenderLocation: "COMET_STREAM",
      checkPhotosToReelsUpsellEligibility: false,
      renderLocation: "group",
      useDefaultActor: false,
      inviteShortLinkKey: null,
      isFeed: false,
      isFundraiser: false,
      isFunFactPost: false,
      isGroup: true,
      isEvent: false,
      isTimeline: false,
      isSocialLearning: false,
      isPageNewsFeed: false,
      isProfileReviews: false,
      isWorkSharedDraft: false,
      hashtag: null,
      canUserManageOffers: false,
      __relay_internal__pv__CometUFIShareActionMigrationrelayprovider: true,
      __relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider: true,
      __relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider: false,
      __relay_internal__pv__IncludeCommentWithAttachmentrelayprovider: true,
      __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
      __relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider: false,
      __relay_internal__pv__IsWorkUserrelayprovider: false,
      __relay_internal__pv__IsMergQAPollsrelayprovider: false,
      __relay_internal__pv__FBReelsMediaFooter_comet_enable_reels_ads_gkrelayprovider: false,
      __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: true,
      __relay_internal__pv__EventCometCardImage_prefetchEventImagerelayprovider: false,
      __relay_internal__pv__GHLShouldChangeSponsoredAuctionDistanceFieldNamerelayprovider: false,
    },
    doc_id: "8530376237028021",
  });
  const json = JSON.parse(res?.split?.("\n")?.[0]);
  console.log(json);

  const err = json?.errors?.[0]?.description;
  if (err) throw new Error(err);

  return deepFindKeyInObject(json, "story")?.url;
}
