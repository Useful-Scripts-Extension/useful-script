import { fetchGraphQl, findDataObject, getMyUid } from "../helpers/facebook.js";
import { sleep } from "../helpers/utils.js";

async function main(groupIds = [], excludeUids = []) {
  // getAllMemberUidHavePendingPosts({
  //   groupId: "2138246213171561",
  //   onProgress: async ({ current, all }) => {
  //     console.log(current);
  //   },
  // });

  let stop = false;
  for (let groupId of groupIds) {
  }
}
main();

async function getAllMemberUidHavePendingPosts({ groupId, onProgress }) {
  const memUids = new Set();
  const allMembers = [];
  await getAllPendingPosts({
    groupId,
    onProgress: async ({ all, current }) => {
      const newMem = current
        ?.map?.((d) => d?.node?.comet_sections?.content?.story?.actors || [])
        .flat()
        .filter((u) => {
          if (!u) return false;
          if (memUids.has(u)) return false;
          memUids.add(u);
          return true;
        });

      allMembers.push(...newMem);

      await onProgress?.({
        current: newMem,
        all: allMembers,
      });
    },
  });
  return allMembers;
}

async function getAllPendingPosts({ groupId, onProgress, cursor = "" }) {
  const allPosts = [];
  while (true) {
    try {
      const { edges, page_info } = await getPendingPosts(groupId, cursor);
      if (!page_info?.has_next_page || edges.length === 0) break;
      allPosts.push(...edges);
      await onProgress?.({
        current: edges,
        all: allPosts,
      });
      cursor = page_info.end_cursor;
      await sleep(500);
    } catch (e) {
      console.log(e);
      break;
    }
  }
  return allPosts;
}

async function getPendingPosts(groupId, cursor = "") {
  const res = await fetchGraphQl({
    fb_api_req_friendly_name: "GroupsCometPendingPostsFeedPaginationQuery",
    variables: {
      count: 3,
      cursor: cursor,
      feedLocation: "GROUP_PENDING",
      feedbackSource: 0,
      focusCommentID: null,
      hoistedPostID: null,
      pendingStoriesOrderBy: null,
      privacySelectorRenderLocation: "COMET_STREAM",
      renderLocation: "group_pending_queue",
      scale: 1,
      useDefaultActor: false,
      id: groupId,
      __relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider: false,
      __relay_internal__pv__IsWorkUserrelayprovider: false,
      __relay_internal__pv__IsMergQAPollsrelayprovider: false,
      __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
      __relay_internal__pv__CometUFIShareActionMigrationrelayprovider: true,
      __relay_internal__pv__IncludeCommentWithAttachmentrelayprovider: true,
      __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: true,
      __relay_internal__pv__EventCometCardImage_prefetchEventImagerelayprovider: false,
    },
    doc_id: "8078135725563420",
  });
  const json = JSON.parse(res.split("\n")[0]);
  // console.log(json);
  const { edges, page_info } = findDataObject(json) || {};
  return { edges, page_info };
}

async function limitMember({ groupId, uid, actorId = "", willLimit = true }) {
  const res = await fetchGraphQl({
    fb_api_req_friendly_name: "GroupsCometMemberSetContentControlsMutation",
    variables: {
      input: {
        admin_notes: "",
        group_id: groupId,
        rate_limit_settings: [
          {
            duration: 86400,
            limit_per_time_period: 10,
            limit_type: "RATE_LIMIT_COMMENT_IN_GROUP",
            should_rate_limit_target: willLimit,
            time_period: 3600,
          },
          {
            duration: 86400,
            limit_per_time_period: 2,
            limit_type: "RATE_LIMIT_POST_IN_GROUP",
            should_rate_limit_target: willLimit,
            time_period: 86400,
          },
        ],
        selected_rules: [],
        share_feedback: false,
        target_user_id: uid,
        actor_id: actorId || (await getMyUid()),
        client_mutation_id: "33", // auto increment??
      },
      memberID: uid,
    },
    doc_id: "7103666173041398",
  });
}

async function getCurrentLimit({ groupId, uid }) {
  const res = await fetchGraphQl({
    fb_api_req_friendly_name:
      "GroupsCometMembersSetMemberContentControlDialogQuery",
    variables: {
      groupID: groupId,
      memberID: uid,
      scale: 1,
    },
    doc_id: "7779093765537808",
  });

  const json = JSON.parse(res);
  console.log(json);
}

// getCurrentLimit({
//   groupId: "2138246213171561",
//   uid: "100024071323401",
// });
