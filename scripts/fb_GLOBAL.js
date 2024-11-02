import { UfsGlobal } from "./content-scripts/ufs_global.js";

// NOTES: functions that end with _ are required access token

// =============================================================================
// ================================= User Data =================================
// =============================================================================
export function getUserAvatarFromUid(uid, size = 500) {
  return `https://graph.facebook.com/${uid}/picture?height=${size}&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
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
export async function searchUser(keyword, exact_match = true) {
  const res = await fetchGraphQl(
    {
      doc_id: 7561210460668291,
      variables: {
        count: 5,
        allow_streaming: false,
        args: {
          callsite: "COMET_GLOBAL_SEARCH",
          config: {
            exact_match: exact_match,
            high_confidence_config: null,
            intercept_config: null,
            sts_disambiguation: null,
            watch_config: null,
          },
          experience: {
            client_defined_experiences: [],
            encoded_server_defined_params: null,
            fbid: null,
            type: "PEOPLE_TAB",
          },
          filters: [],
          text: keyword,
        },
        cursor: null,
        feedbackSource: 23,
        fetch_filters: true,
        renderLocation: "search_results_page",
        scale: 2,
        stream_initial_count: 0,
        useDefaultActor: false,
      },
    },
    await getFbdtsg()
  );
  const json = JSON.parse(res);
  console.log(json);
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

//https://web.facebook.com/ajax/typeahead/first_degree.php?viewer=100075867577015&rsp=search&max_results=13&q=s&session_id=0.7324328179909558&fb_dtsg_ag=AQwWeyg6g3SN6ZcrmAy6uVrA3HAMBgbFAse89jki-JZ8t9iK:24:1672755996&jazoest=24821&__dyn=1KQEGiFo525Ujwh8-t0BBBgS5UqxKcwRwAxu3-Uco6q3q327Hw9e5orx60lW4o3Bw4Ewk9EdEnw65xO2O1Vwro7ifw5Zx62K2G0g26E52229wcq0C9EdE2IzU2Xwp82vwAwmE2ewnE2Lx-220jG3qazo11E2ZwrU6C2-0z836w&__csr=&__req=b&__a=AYltv4PwLKfRaPOm3vXywmuQ7w-cOgesCW15eyelU6wut5KA1ngiReAq53QySzrSQ2h7opM7jRkZK9XgPIIB-ek2Vx9Z70y5FAKyLiR-ISfqpA&__user=100075867577015
//https://www.facebook.com/ajax/typeahead/first_degree.php?viewer=100075867577015&token=v7&filter[0]=user&options[0]=friends_only&options[1]=nm&fb_dtsg_ag=NAcM4Va03WgxUC9_454ocvAxZhjX-dlrZVyWsjooAcffVe-I9YvzAVw:24:1672755996&__user=100075867577015&__a=1&__req=d&__rev=1686870533469
//https://web.facebook.com/ajax/typeahead/first_degree.php?viewer=100075867577015&token=v7&filter[0]=user&options[0]=friends_only&options[1]=nm&fb_dtsg_ag=AQwWeyg6g3SN6ZcrmAy6uVrA3HAMBgbFAse89jki-JZ8t9iK:24:1672755996&__a=1&__user=100075867577015
export async function getFriendsAsync(uid, fbs) {
  var urll = "https://www.facebook.com/ajax/typeahead/first_degree.php?";
  (urll += "viewer=" + uid),
    (urll +=
      "&token=v7&filter[0]=user&options[0]=friends_only&options[1]=nm&fb_dtsg_ag=" +
      fbs +
      "&__user=" +
      uid),
    (urll += "&__a=1&__req=d&__rev=" + new Date().getTime());
  var d = await fetch(urll);
  if (
    (!d.statusText && d.status && 200 != d.status) ||
    (!d.status && d.statusText && "OK" != d.statusText)
  )
    return console.log("Fail here");
  var t = await d.text();
  var e = t.replace("for (;;);", "");
  var e = JSON.parse(e);
  if (e.error) {
    return new Error("err");
  }
  if (e.redirect) {
    d = await fetch(urll.replace("www", "web"));
    if (
      (!d.statusText && d.status && 200 != d.status) ||
      (!d.status && d.statusText && "OK" != d.statusText)
    )
      return console.log("Fail here");
    var t = await d.text();
    var e = t.replace("for (;;);", "");
    e = JSON.parse(e);
    if (e.error) {
      return new Error("err");
    }
  }
  var res = {};
  var f = {};
  var name = "";
  let photo = "";
  for (var g in e.payload.entries) {
    var h = e.payload.entries[g];
    if (h.uid != uid) {
      f[h.uid] = {
        uid: h.uid,
        name: h.names[0],
        photo: h.photo,
      };
    }
    if (h.uid == uid) {
      name = h.names[0];
      photo = h.photo;
    }
  }
  res.f = f;
  res.name = name;
  res.photo = photo;
  return res;
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
    async () => {
      let text = await fetch("https://www.facebook.com/policies_center/");
      let token = text.match(/DTSGInitData",\[\],\{"token":"(.*?)"/)[1];
      return token;
    },
    () => {
      return RegExp(/"DTSGInitialData",\[],{"token":"(.+?)"/).exec(
        document.documentElement.innerHTML
      )?.[1];
    },
    async () => {
      let res = await fetch("https://mbasic.facebook.com/photos/upload/");
      let text = await res.text();
      return RegExp(/name="fb_dtsg" value="(.*?)"/).exec(text)?.[1];
    },
    async () => {
      let res = await fetch("https://m.facebook.com/home.php", {
        headers: {
          Accept: "text/html",
        },
      });
      let text = await res.text();
      return (
        RegExp(/"dtsg":{"token":"([^"]+)"/).exec(text)?.[1] ||
        RegExp(/"name":"fb_dtsg","value":"([^"]+)/).exec(text)?.[1]
      );
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

export async function getFbDtsgAg() {
  return new Promise(function (resolve, reject) {
    fetch("https://www.facebook.com/settings?tab=account&section=name&view")
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          reject(response.status);
        }
        response.text().then((r) => {
          const regex = /name="fb_dtsg" value="\s*(.*?)\s*"/g;
          const html = r;
          var newReg = new RegExp(
            /DTSGInitData(?:.*?):"(.*?)",(?:.*?):"(.*?)"/
          );
          var newReg1 = new RegExp(/\"fb_dtsg\",\"value\"\:\"(.+?)\"}/);
          var reg = new RegExp(
            regex.source + "|" + newReg.source + "|" + newReg1.source
          );
          var dtsgMatches = html.match(reg);
          if (!dtsgMatches || !dtsgMatches.hasOwnProperty(1)) {
            resolve("");
          }
          resolve(dtsgMatches[3]);
          //resolve(dtsgMatches[1] || dtsgMatches[2] || dtsgMatches[3]);
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
        reject(err);
      });
  });
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
