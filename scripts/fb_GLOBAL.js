import { UfsGlobal } from "./content-scripts/ufs_global.js";

// NOTES: functions that end with _ are required access token

// =============================================================================
// ================================= User Data =================================
// =============================================================================
export function getUserAvatarFromUid(uid) {
  return `https://graph.facebook.com/${uid}/picture?height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
}
export async function getYourUserId() {
  let methods = [
    () => require("CurrentUserInitialData").USER_ID,
    () => require("RelayAPIConfigDefaults").actorID,
    () => document.cookie.match(/c_user=(\d+)/)[1],
    async () =>
      (
        await chrome.cookies.get({
          url: "https://www.facebook.com",
          name: "c_user",
        })
      ).value,
  ];
  for (let m of methods) {
    try {
      let d = await m();
      if (d) return d;
    } catch (e) {}
  }
  return null;
}
export async function getUserInfoFromUid(uid) {
  const variables = {
    userID: uid,
    shouldDeferProfilePic: false,
    useVNextHeader: false,
    scale: 1.5,
  };
  let f = new URLSearchParams();
  f.append("fb_dtsg", await getFbdtsg());
  f.append("fb_api_req_friendly_name", "ProfileCometHeaderQuery");
  f.append("variables", JSON.stringify(variables));
  f.append("doc_id", "4159355184147969");

  let res = await fetch("https://www.facebook.com/api/graphql/", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: f,
  });

  let text = await res.text();
  return {
    uid: uid,
    name: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
      /"name":"(.*?)"/.exec(text)?.[1]
    ),
    avatar: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
      /"profilePicLarge":{"uri":"(.*?)"/.exec(text)?.[1] ||
        /"profilePicMedium":{"uri":"(.*?)"/.exec(text)?.[1] ||
        /"profilePicSmall":{"uri":"(.*?)"/.exec(text)?.[1] ||
        /"profilePic160":{"uri":"(.*?)"/.exec(text)?.[1]
    ),
    gender: /"gender":"(.*?)"/.exec(text)?.[1],
    alternateName: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
      /"alternate_name":"(.*?)"/.exec(text)?.[1]
    ),
  };
}
export async function getUserInfo_(uid, access_token) {
  let fields = [
    "birthday",
    "age_range",
    "email",
    "gender",
    "hometown",
    "languages",
    "last_name",
    "first_name",
    "location",
    "link",
    "middle_name",
    "name",
    "short_name",
    "picture",
  ].join(",");
  let n = `https://graph.facebook.com/${uid}/?fields=${fields}&access_token=${access_token}`;
  const e = await fetch(n);
  let json = await e.json();
  console.log(json);

  return {
    uid: uid,
    name: json?.name,
    avatar: json?.picture?.data?.url,
    gender: json?.gender,
  };
}
export async function getUidFromUrl(url) {
  let methods = [
    () => require("CometRouteStore").getRoute(url).rootView.props.userID,
    async () => {
      let response = await fetch(url);
      if (response.status == 200) {
        let text = await response.text();
        let uid = /(?<="userID":")(.\d+?)(?=")/.exec(text);
        if (uid?.length) {
          return uid[0];
        }
      }
      return null;
    },
  ];

  for (let m of methods) {
    try {
      let uid = await m();
      if (uid) return uid;
    } catch (e) {}
  }
  return null;
}

// =============================================================================
// =================================== Friend ==================================
// =============================================================================
export async function removeFriendConfirm(friend_uid, uid, fb_dtsg) {
  let f = new FormData();
  f.append("uid", friend_uid);
  f.append("unref", "bd_friends_tab");
  f.append("floc", "friends_tab");
  f.append("__user", uid);
  f.append("__a", 1);
  f.append("fb_dtsg", fb_dtsg);
  await fetch(
    "https://www.facebook.com/ajax/ajax/profile/removefriendconfirm.php?dpr=1",
    {
      method: "POST",
      credentials: "include",
      body: f,
    }
  );
}
export async function fetchAllFriends_(access_token, progressCallback) {
  let friends = [];
  let total = 0;
  let limit = 25;
  let after = null;

  while (true) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/me?fields=friends` +
          `&access_token=${access_token}&pretty=0&limit=${limit}` +
          (after ? `&after=${after}` : "")
      );
      const json = await res.json();
      const { data, paging, summary } = json.friends;
      total = summary.total_count || total;
      friends = friends.concat(data);

      progressCallback?.({
        data: friends,
        loaded: friends.length,
        total,
      });

      if (!paging?.cursors?.after || paging.cursors.after === after) break;
      after = paging.cursors.after;
    } catch (e) {
      console.error(e);
      break;
    }
  }
  return friends;
}
export async function fetchAddedFriends(uid, fb_dtsg, cursor) {
  let variables = JSON.stringify({
    count: 8,
    cursor: cursor ?? null,
    category_key: "FRIENDS",
  });
  const t = new URLSearchParams();
  t.append("__user", uid);
  t.append("__a", 1);
  t.append("dpr", 1);
  t.append("fb_dtsg", fb_dtsg);
  t.append("fb_api_caller_class", "RelayModern");
  t.append("fb_api_req_friendly_name", "ActivityLogStoriesQuery");
  t.append("doc_id", "2761528123917382");
  t.append("variables", variables);

  let res = await fetch("https://www.facebook.com/api/graphql/", {
    method: "POST",
    body: t,
  });
  let json = await res.json();

  let { edges, page_info } =
    json.data.viewer.activity_log_actor.activity_log_stories;

  return {
    nextCursor: page_info.end_cursor,
    data: edges
      .map((e) => {
        if ("UNFRIEND" === e.curation_options[0] || e.node.attachments.length) {
          return {
            uid: e.node.attachments[0].target.id,
            name: e.node.attachments[0].title_with_entities.text,
            avatar: e.node.attachments[0].media.image.uri,
            addedTime: 1e3 * e.node.creation_time,
          };
        }
        return null;
      })
      .filter((_) => _),
  };
}
export async function fetchAllAddedFriendsSince(
  uid,
  fb_dtsg,
  since,
  pageFetchedCallback
) {
  let cursor = "";
  let allFriends = [];
  try {
    while (true) {
      let { nextCursor, data } = await fetchAddedFriends(uid, fb_dtsg, cursor);
      cursor = nextCursor;
      allFriends = allFriends.concat(data);
      await pageFetchedCallback?.(data, allFriends);

      if (!nextCursor || (since && nextCursor < since)) break;
    }
  } catch (e) {
    console.log("ERROR fetch all added friends", e);
  }
  return allFriends;
}

// =============================================================================
// ================================= Messages ==================================
// =============================================================================
export async function messagesCount(fb_dtsg) {
  const res = await fetchGraphQl(
    `viewer(){
        message_threads {
          count,
          nodes {
            customization_info {
              emoji,
              outgoing_bubble_color,
              participant_customizations {
                participant_id,
                nickname
              }
            },
            all_participants {
              nodes {
                messaging_actor {
                  name,
                  id,
                  profile_picture
                }
              }
            },
            thread_type,
            name,
            messages_count,
            image,
            id
          }
        }
      }`.replace(/\s+/g, ""),
    fb_dtsg
  );
  return JSON.parse(res);
}

// =============================================================================
// =================================== Page ====================================
// =============================================================================
export async function unlikePage(pageId, uid, fb_dtsg) {
  let f = new FormData();
  f.append("fbpage_id", pageId);
  f.append("add", false);
  f.append("reload", false);
  f.append("fan_origin", "page_timeline");
  f.append("__user", uid);
  f.append("__a", 1);
  f.append("fb_dtsg", fb_dtsg);
  await fetch("https://www.facebook.com/ajax/pages/fan_status.php?dpr=1", {
    method: "POST",
    credentials: "include",
    body: f,
  });
}
export async function searchPageForOther(other_uid, cursor, uid, fb_dtsg) {
  let variables = JSON.stringify({
    count: 8,
    scale: 1,
    cursor: cursor ?? null,
    id: btoa(`app_collection:${other_uid}:2409997254:96`),
  });

  let f = new URLSearchParams();
  f.append("__user", uid);
  f.append("__a", 1);
  f.append("dpr", 1);
  f.append("fb_dtsg", fb_dtsg);
  f.append("fb_api_caller_class", "RelayModern");
  f.append(
    "fb_api_req_friendly_name",
    "ProfileCometAppCollectionGridRendererPaginationQuery"
  );
  f.append("variables", variables);
  f.append("doc_id", 2983410188445167);

  try {
    let res = await fetch("https://www.facebook.com/api/graphql/", {
      method: "POST",
      body: f,
    });

    let json = await res.json();
    let { items } = json.data.node;
    return {
      nextCursor: items.page_info.end_cursor,
      data: items.edges.map((e) => ({
        id: e.node.node?.id || btoa(e.node.id).split(":").at(-1),
        name: e.node.title.text,
        subTitle: e.node.subtitle_text?.text,
        url: e.node.url,
        image: e.node.image.uri,
        cursor: e.cursor,
      })),
      totalCount: items.count,
    };
  } catch (e) {
    console.log("ERROR fetch page", e);
    return {
      nextCursor: null,
      data: [],
      totalCount: 0,
    };
  }
}
export async function searchAllPageForOther(
  other_uid,
  uid,
  fb_dtsg,
  pageFetchedCallback
) {
  let cursor = "";
  let allPages = [];
  try {
    while (true) {
      let { nextCursor, data, totalCount } = await searchPageForOther(
        other_uid,
        cursor,
        uid,
        fb_dtsg
      );
      cursor = nextCursor;
      allPages = allPages.concat(data);
      await pageFetchedCallback?.(data, allPages, totalCount);

      if (!cursor) break;
    }
  } catch (e) {
    console.log("ERROR search all page for other", e);
  }
  return allPages;
}

// =============================================================================
// =================================== Group ===================================
// =============================================================================
export async function leaveGroup(groupId, uid, fb_dtsg) {
  let f = new FormData();
  f.append("fb_dtsg", fb_dtsg);
  f.append("confirmed", 1);
  f.append("__user", uid);
  f.append("__a", 1);
  await fetch(
    "https://www.facebook.com/ajax/groups/membership/leave.php?group_id=" +
      groupId +
      "&dpr=1",
    {
      method: "POST",
      credentials: "include",
      body: f,
    }
  );
}
export async function searchGroupForOther(other_uid, cursor, uid, fb_dtsg) {
  let variables = JSON.stringify({
    count: 8,
    cursor: cursor ?? null,
    id: btoa(`app_collection:${other_uid}:2361831622:66`),
  });

  let f = new URLSearchParams();
  f.append("__user", uid);
  f.append("__a", 1);
  f.append("dpr", 1);
  f.append("fb_dtsg", fb_dtsg);
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
      data: pageItems.edges.map((e) => ({
        id: e.node.node?.id || btoa(e.node.id).split(":").at(-1),
        title: e.node.title.text,
        subTitle: e.node.subtitle_text?.text,
        url: e.node.url,
        visibility: e.node.node.visibility,
        image: e.node.image.uri,
        membersCount: Number(
          // e.node.node.forum_member_profiles.formatted_count_text ||
          // e.node.node.group_member_profiles.formatted_count_text
          (e.node.subtitle_text.text.split("\n")?.[0] || "")
            .match(/\d+/g)
            .join("") ?? 1
        ),
        cursor: e.cursor,
      })),
    };
  } catch (e) {
    console.log("ERROR fetch page", e);
    return {
      nextCursor: null,
      data: [],
    };
  }
}
export async function searchAllGroupForOther(
  other_uid,
  uid,
  fb_dtsg,
  pageFetchedCallback
) {
  let cursor = "";
  let allGroups = [];
  try {
    while (true) {
      let { nextCursor, data } = await searchGroupForOther(
        other_uid,
        cursor,
        uid,
        fb_dtsg
      );
      cursor = nextCursor;
      allGroups = allGroups.concat(data);
      await pageFetchedCallback?.(data, allGroups);

      if (!cursor) break;
    }
  } catch (e) {
    console.log("ERROR search all group for other", e);
  }
  return allGroups;
}

// =============================================================================
// ================================== Helpers ==================================
// =============================================================================
export function wrapGraphQlParams(params) {
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

export async function fetchGraphQl(params, fb_dtsg) {
  let form;
  if (typeof params === "string")
    form =
      "fb_dtsg=" +
      encodeURIComponent(fb_dtsg) +
      "&q=" +
      encodeURIComponent(params);
  else
    form = wrapGraphQlParams({
      fb_dtsg,
      ...params,
    });

  let res = await fetch("https://www.facebook.com/api/graphql/", {
    body: form,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",
  });

  let json = await res.text();
  return json;
}
export function decodeArrId(arrId) {
  return arrId[0] * 4294967296 + arrId[1];
}
export async function getFbdtsg() {
  let methods = [
    () => require("DTSGInitData").token,
    () => require("DTSG").getToken(),
    () => {
      return document.documentElement.innerHTML.match(
        /"DTSGInitialData",\[],{"token":"(.+?)"/
      )[1];
    },
    async () => {
      let res = await fetch("https://mbasic.facebook.com/photos/upload/");
      let text = await res.text();
      return text.match(/name="fb_dtsg" value="(.*?)"/)[1];
    },
    () => require("DTSG_ASYNC").getToken(), // TODO: trace xem tại sao method này trả về cấu trúc khác 2 method trên
  ];
  for (let m of methods) {
    try {
      let d = await m();
      if (d) return d;
    } catch (e) {}
  }
  return null;
}

// =============================================================================
// =================================== Story ===================================
// =============================================================================
export function getStoryBucketIdFromURL(url) {
  return url.match(/stories\/(\d+)\//)?.[1];
}
export function getStoryId() {
  const htmlStory = document.getElementsByClassName(
    "xh8yej3 x1n2onr6 xl56j7k x5yr21d x78zum5 x6s0dn4"
  );
  return htmlStory[htmlStory.length - 1].getAttribute("data-id");
}
export async function getStoryInfo(bucketID, fb_dtsg) {
  // Source: https://pastebin.com/CNvUxpfc
  let body = new URLSearchParams();
  body.append("__a", 1);
  body.append("fb_dtsg", fb_dtsg);
  body.append(
    "variables",
    JSON.stringify({
      bucketID: bucketID,
      initialLoad: false,
      scale: 1,
    })
  );
  body.append("doc_id", 2586853698032602);

  let res = await fetch("https://www.facebook.com/api/graphql/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
    credentials: "include",
  });

  let json = await res.json();
  console.log(json);
  let data = json?.data?.bucket;

  if (!data) throw new Error("Không lấy được data");
  return {
    storyId: data.id,
    author: {
      id: data.owner.id,
      name: data.owner.name,
      avatar: data.owner.profile_picture.uri,
      avatarURL: data.owner.url,
    },
    Objects: data.unified_stories.edges.map((_, i) => {
      return {
        pictureBlurred:
          data.unified_stories.edges[i].node.attachments[0].media.blurredImage
            .uri,
        picturePreview:
          data.unified_stories.edges[i].node.attachments[0].media.previewImage
            .uri,
        totalReaction:
          data.unified_stories.edges[i].node.story_card_info.feedback_summary
            .total_reaction_count,
        backgroundCss:
          data.unified_stories.edges[i].node.story_default_background.color,
        backgroundCss3:
          data.unified_stories.edges[i].node.story_default_background.gradient
            .css,
        ...(data.unified_stories.edges[i].node.attachments[0].media
          .__typename == "Photo"
          ? {
              caption:
                data.unified_stories.edges[i].node.attachments[0].media
                  .accessibility_caption,
              image:
                data.unified_stories.edges[i].node.attachments[0].media.image
                  .uri,
            }
          : data.unified_stories.edges[i].node.attachments[0].media
              .__typename == "Video"
          ? {
              permanlinkUrl:
                data.unified_stories.edges[i].node.attachments[0].media
                  .permalink_url,
              playableVideo:
                data.unified_stories.edges[i].node.attachments[0].media
                  .playable_url,
              playableUrlDash:
                data.unified_stories.edges[0].node.attachments[0].media
                  .playable_url_dash,
              playableUrlHDString:
                data.unified_stories.edges[i].node.attachments[0].media
                  .playableUrlHdString,
              playableUrlHD:
                data.unified_stories.edges[i].node.attachments[0].media
                  .playable_url_quality_hd,
            }
          : null),
      };
    }),
  };

  // let data =
  //   "__a=1&fb_dtsg=" +
  //   dtsg +
  //   "&variables=%7B%22bucketID%22%3A%22" +
  //   bucketID +
  //   "%22%2C%22initialLoad%22%3Afalse%2C%22scale%22%3A1%7D&doc_id=2586853698032602";

  // let xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  // xhr.addEventListener("readystatechange", function () {
  //   if (this.readyState === 4) {

  //   }
  // });

  // xhr.open("POST", "https://www.facebook.com/api/graphql/");
  // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // xhr.send(body);
}
