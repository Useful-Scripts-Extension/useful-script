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

  popupScript: {
    onEnable: () => {},
    onDisable: () => {},

    onClick: async () => {
      // CometNewsFeedPaginationQuery
      // CometVideoHomeLOEExploreLeftRailSectionQuery
      // CometVideoHomeFeedRootQuery
      // MarketplaceNotificationsUpdateSeenStateMutation
      // alert("popupScript");
    },
  },
  pageScript: {
    // onDocumentStart: () => {
    //   console.log("page script onDocumentStart");
    // },
    // onDocumentIdle: () => {
    //   console.log("page script onDocumentIdle");
    // },
    // onDocumentEnd: () => {
    //   console.log("page script onDocumentEnd");
    // },
    onClick: () => {
      console.log("abc");
    },
  },
  contentScript: {
    // onDocumentStart: () => {
    //   console.log("content-script onDocumentStart");
    // },
    // onDocumentIdle: () => {
    //   console.log("content-script onDocumentIdle");
    // },
    // onDocumentEnd: () => {
    //   console.log("content-script onDocumentEnd");
    // },
    onClick: () => {
      // alert("contentScript");
    },
  },
};
