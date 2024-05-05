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
    onDocumentStart: () => {
      // if (location.href.includes("anonyviet.com/tieptucdentrangmoi/")) {
      //   let url = new URL(location.href).searchParams.get("url");
      //   if (url) {
      //     window.open(url, "_self");
      //   }
      // }
    },
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
