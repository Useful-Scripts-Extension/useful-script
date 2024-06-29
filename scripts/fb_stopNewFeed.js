import { BADGES } from "./helpers/badge.js";
import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { CANCEL_XHR, hookXHR } from "./libs/ajax-hook/index.js";

export default {
  icon: '<i class="fa-solid fa-ban fa-lg"></i>',
  name: {
    en: "Stop new feed facebook",
    vi: "Dừng dòng thời gian facebook",
  },
  description: {
    en: `Stop load new feed on facebook, better for work performance<br/>
      <ul>
        <li>Support feeds: stories, home, video, group, marketplace</li>
      </ul>`,
    vi: `Tạm dừng tải dòng thời gian trên facebook, giúp tập trung làm việc<br/>
      <ul>
        <li>Hỗ trợ các tab: stories, home, video, nhóm, marketplace</li>
      </ul>`,
  },
  changeLogs: {
    "2024-06-12": "init",
  },
  badges: [BADGES.new],

  whiteList: ["https://www.facebook.com/*"],

  pageScript: {
    onDocumentStart: (details) => {
      window.ufs_fb_stopNewFeed_toggle = stopNewFeed();
    },

    onClick: () => {
      if (typeof window.ufs_fb_stopNewFeed_toggle !== "function")
        window.ufs_fb_stopNewFeed_toggle = stopNewFeed();
      else window.ufs_fb_stopNewFeed_toggle();
    },
  },
};

function stopNewFeed() {
  const blackList = {
    story: [
      // "StoriesSuspenseNavigationPaneRootWithEntryPointQuery",
      // "StoriesSuspenseContentPaneRootWithEntryPointQuery",
      "StoriesTrayRectangularQuery",
      // "StoriesTrayRectangularRootQuery",
      "useStoriesViewerBucketsPaginationQuery",
    ],
    "video tab": [
      "CometVideoHomeFeedRootQuery",
      "CometVideoHomeFeedSectionPaginationQuery",
    ],
    "home tab": ["CometModernHomeFeedQuery", "CometNewsFeedPaginationQuery"],
    "group tab": [
      "GroupsCometCrossGroupFeedPaginationQuery",
      "GroupsCometCrossGroupFeedContainerQuery",
    ],
    "group feed": ["GroupsCometFeedRegularStoriesPaginationQuery"],
    "marketplace tab": [
      // "CometMarketplaceRootQuery",
      // "MarketplaceCometBrowseFeedLightContainerQuery",
      // "MarketplaceCometBrowseFeedLightPaginationQuery",
      "MarketplaceBannerContainerQuery",
      "CometMarketplaceLeftRailNavigationContainerQuery",
    ],
    "event tab": [
      // "EventCometHomeDiscoverContentRefetchQuery"
    ],
    "online status": [
      // "UpdateUserLastActiveMutation"
    ],
  };

  let enabled = true;
  hookXHR({
    onBeforeSend: ({ method, url, async, user, password }, dataSend) => {
      let s = dataSend?.toString() || "";

      let inBlackList = false;
      for (const [key, value] of Object.entries(blackList)) {
        if (value.find((item) => s.includes(item))) {
          inBlackList = key;
          break;
        }
      }

      if (enabled && inBlackList) {
        UfsGlobal.DOM.notify({
          msg: "Useful-script: Stopped new feed facebook '" + inBlackList + "'",
        });
        return CANCEL_XHR;
      }
    },
  });

  UfsGlobal.DOM.notify({
    msg: "Useful-script: ENABLED Stop new feed facebook",
  });

  return (value = !enabled) => {
    enabled = value;
    UfsGlobal.DOM.notify({
      msg:
        "Useful-script:" +
        (enabled ? "ENABLED" : "DISABLED") +
        " Stop new feed facebook ",
    });
  };
}
