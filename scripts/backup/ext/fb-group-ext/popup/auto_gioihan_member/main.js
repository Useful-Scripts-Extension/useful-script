import { fetchGraphQl } from "../helpers/facebook";

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
  console.log(res);
}

getPendingPosts();
