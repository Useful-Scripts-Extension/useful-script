import { allScripts as s } from "../scripts/index.js";
import { CATEGORY } from "./helpers/category.js";
import { favoriteScriptsSaver, recentScriptsSaver } from "./helpers/storage.js";
import { canAutoRun } from "./helpers/utils.js";

const createTitle = (en, vi) => ({ name: { en, vi } });

const specialTabs = [
  {
    ...CATEGORY.all,
    scripts: [],
  },
  {
    ...CATEGORY.recently,
    scripts: [],
  },
  {
    ...CATEGORY.favorite,
    scripts: [],
  },
  {
    ...CATEGORY.autorun,
    scripts: [],
  },
];

const tabs = [
  {
    ...CATEGORY.search,
    scripts: [
      s._test,
      s.search_userscript,
      s.whatFont,
      s.similarWeb,
      s.search_sharedAccount,
      s.whatWebsiteStack,
      s.whois,
      s.viewWebMetaInfo,
      s.search_musicTreding,
      s.search_paperWhere,
      s.search_hopamchuan,
      s.checkWebDie,
      s.downDetector,
      s.openWaybackUrl,
      s.archiveToday,
    ],
  },
  {
    ...CATEGORY.download,
    scripts: [
      createTitle("--- All in one ---", "--- Tổng hợp ---"),
      s.vuiz_getLink,
      s.saveAllVideo,
      s.savevideo_me,
      s.getLinkLuanxt,
      // s.bookmark_exporter,
      s.twitter_downloadButton,
      createTitle("--- Music ---", "--- Nhạc ---"),
      s.spotify_downloadButton,
      s.soundcloud_downloadMusic,
      s.nhaccuatui_downloader,
      s.zingmp3_downloadMusic,
      s.showTheAudios,
      createTitle("--- Videos ---", "--- Video ---"),
      s.download_watchingVideo,
      s.vimeo_downloader,
      s.showTheVideos,
      createTitle("--- Photos ---", "--- Ảnh ---"),
      s.getFavicon,
      s.whatApp_storySaver,
      s.showTheImages,
      s.download_image,
      createTitle("--- Document ---", "--- Tài liệu ---"),
      s.tailieu_vn,
      s.docDownloader,
      s.scribd_downloadDocuments,
      s.studocu_dl,
      s.studocu_downs,
    ],
  },
  {
    ...CATEGORY.google,
    scripts: [
      createTitle("--- Download ---", "--- Tải xuống ---"),
      s.ggdrive_generateDirectLink,
      s.ggdrive_downloadPdf,
      s.ggdrive_downloadPresentation,
      s.ggdrive_downloadDoc,
      s.ggdrive_copyDocText,
      s.ggdrive_copySheetText,
      s.ggdrive_downloadVideo,
      s.google_downloadAllYourData,
      createTitle("--- Bulk Download ---", "--- Tải hàng loạt ---"),
      s.ggDrive_downloadAllVideosInFolder,
      createTitle("--- More ---", "--- Khác ---"),
      s.search_totalIndexedPages,
      s.search_googleSite,
      s.googleShortcuts,
      s.googleCache,
      s.google_mirror,
    ],
  },
  {
    ...CATEGORY.facebook,
    scripts: [
      createTitle("--- Download ---", "--- Tải xuống ---"),
      s.fb_downloadWatchingVideo,
      s.fb_storySaver,
      s.fb_downloadCommentVideo,
      s.fb_videoDownloader,
      s.fb_getAvatarFromUid,
      // s.fb_storyInfo,
      createTitle("--- Bulk Download ---", "--- Tải hàng loạt ---"),
      // s.fb_bulkDownload,
      s.fb_downloadAlbumMedia,
      s.fb_downloadWallMediaFromPosts,
      s.fb_getAllAlbumInformation,
      s.fb_openSaved,
      s.fb_exportSaved,
      createTitle("--- Hot ---", "--- Nổi bật ---"),
      s.fb_revealDeletedMessages,
      s.fb_invisible_message,
      s.fb_moreReactionStory,
      s.fb_whoIsTyping,
      // s.fb_removeFbclid,
      createTitle("--- Statistic ---", "--- Thống kê ---"),
      s.fb_messengerHistory,
      s.fb_messengerCount,
      s.fb_searchGroupForOther,
      s.fb_searchPageForOther,
      s.fb_fetchAllAddedFriends,
      createTitle("--- UI ---", "--- Giao diện ---"),
      s.fb_toggleLight,
      s.fb_toggleNewFeed,
      createTitle("--- Access Token ---", "--- Access Token ---"),
      s.fb_checkToken,
      s.fb_getTokenFfb,
      s.fb_getTokenBussinessLocation,
      // s.fb_getTokenBusinessStudio,
      s.fb_getTokenCampaigns,
      s.fb_getTokenFacebook,
      s.fb_getTokenMFacebook,
      createTitle("--- Get ID ---", "--- Lấy ID ---"),
      s.fb_getUid,
      s.fb_getPageId,
      s.fb_getGroupId,
      s.fb_getAlbumId,
      s.fb_getAllAlbumIdFromCurrentWebsite,
      s.fb_getUidFromUrl,
      s.fb_getAllUidFromFbSearch,
      s.fb_getAllUidFromFriendsPage,
      s.fb_getAllUidOfGroupMembers,
      createTitle("--- Shortcut ---", "--- Phím tắt ---"),
      s.fb_openMemories,
      s.fb_openAdsActivities,
    ],
  },
  {
    ...CATEGORY.instagram,
    scripts: [
      s.insta_getUserInfo,
      s.insta_injectDownloadBtn,
      createTitle("--- Bulk Download ---", "--- Tải hàng loạt ---"),
      s.insta_getAllUserMedia,
      s.insta_getAllImagesInNewFeed,
      s.insta_getAllImagesInUserProfile,
    ],
  },
  {
    ...CATEGORY.youtube,
    scripts: [
      // s.youtube_localDownloader,
      s.youtube_downloadVideo,
      s.pictureInPicture,
      s.youtube_toggleLight,
      s.youtube_viewDislikes,
      s.youtube_nonstop,
    ],
  },
  {
    ...CATEGORY.tiktok,
    scripts: [
      createTitle("--- Tiktok ---", "--- Tiktok ---"),
      s.tiktok_downloadWatchingVideo,
      s.tiktok_downloadVideo,
      s.tiktok_batchDownload,
      createTitle("--- Douyin ---", "--- Douyin ---"),
      s.douyin_downloadWachingVideo,
      s.douyin_downloadAllVideoUser,
      // s.douyin_batchDownload,
      s.saveAllVideo,
      createTitle("--- Doutu.be ---", "--- Doutu.be ---"),
      s.doutube_downloadWatchingVideo,
      s.doutube_getAllVideoInUserProfile,
    ],
  },
  {
    ...CATEGORY.automation,
    scripts: [
      s.shortenURL,
      s.unshorten,
      s.textToSpeech,
      s.changeAudioOutput,
      s.send_shareFiles,
      createTitle("--- Image ---", "--- Ảnh ---"),
      s.screenshotFullPage,
      s.vuiz_createLogo,
      createTitle("--- Automation ---", "--- Tự động hoá ---"),
      s.passwordGenerator,
      s.getAllEmailsInWeb,
      s.performanceAnalyzer,
      s.scrollToVeryEnd,
      s.dino_hack,
      createTitle("--- Github ---", "--- Github ---"),
      s.github_goToAnyCommit,
      s.githubdev,
      s.github1s,
      createTitle("--- Shopping ---", "--- Mua sắm ---"),
      s.shopee_topVariation,
      s.shopee_totalSpendMoney,
      s.shopee_totalSpendMoney_excel,
      s.tiki_totalSpendMoney,
      createTitle("--- PDF ---", "--- PDF ---"),
      s.webToPDF,
      s.fastDoc,
      s.smartPDF,
      s.pdfstuffs,
    ],
  },
  {
    ...CATEGORY.unlock,
    scripts: [
      s.duckRace_cheat,
      s.whellOfNames_hack,
      s.viewSavedWifiPass,
      s.leakCheck,
      createTitle("--- Unlock web ---", "--- Mở khoá web ---"),
      s.medium_readFullArticle,
      s.fireship_vip,
      s.scribd_bypassPreview,
      s.studocu_bypassPreview,
      s.studyphim_unlimited,
      s.envato_bypassPreview,
      createTitle("--- Unlock function ---", "--- Mở khoá chức năng ---"),
      s.detect_zeroWidthCharacters,
      s.simpleAllowCopy,
      s.reEnableContextMenu,
      s.showHiddenFields,
      s.viewCookies,
      s.removeCookies,
      s.viewBrowserInfo,
      s.injectScriptToWebsite,
    ],
  },
  {
    ...CATEGORY.webUI,
    scripts: [
      s.darkModePDF,
      s.toggleEditPage,
      s.scrollByDrag,
      s.runStatJs,
      createTitle("--- View ---", "--- Xem ---"),
      s.visualEvent,
      s.listAllImagesInWeb,
      s.viewAllLinks,
      s.viewScriptsUsed,
      s.viewStylesUsed,
      s.cssSelectorViewer,
      s.viewPartialSource,
      createTitle("--- Remove ---", "--- Xoá ---"),
      s.removeColours,
      s.removeStylesheet,
      s.removeImages,
      s.removeBloat,
      createTitle("--- Table ---", "--- Bảng ---"),
      s.table_addSortTable,
      s.table_addNumberColumn,
      s.table_swapRowAndColumn,
      createTitle("--- More ---", "--- Khác ---"),
      s.internalOrExternalLink,
      s.getWindowSize,
      s.letItSnow,
    ],
  },
];

const recommendTab = {
  ...CATEGORY.recommend,
  scripts: [
    { name: { en: "--- Same author ---", vi: "--- Cùng tác giả ---" } },
    {
      id: "recommend_LOL2D",
      icon: "https://hoangtran0410.github.io/LOL2D/favicon/apple-touch-icon.png",
      name: {
        en: "LOL2D - League of Legends 2D",
        vi: "LOL2D - Liên minh huyền thoại 2D",
      },
      description: {
        en: "Play League of Legends right on your browser",
        vi: "Chơi Liên minh huyền thoại ngay trên trình duyệt",
        img: "https://raw.githubusercontent.com/HoangTran0410/LOL2D/main/assets/images/screenshots/Screenshot_4.jpg",
      },
      onClickExtension: () =>
        window.open("https://github.com/HoangTran0410/LOL2D"),
    },
    {
      id: "recommend_RevealDeletedFBMessage",
      icon: "https://github.com/HoangTran0410/RevealDeletedFBMessages/raw/master/icons/icon48.png",
      name: {
        en: "Reveal Deleted FB Message",
        vi: "Xem tin nhắn FB bị gỡ",
      },
      description: {
        en: "Know what your friends have sent you",
        vi: "Xem bạn bè đã gửi gì cho bạn",
      },
      onClickExtension: () =>
        window.open("https://github.com/HoangTran0410/RevealDeletedFBMessages"),
    },
    {
      id: "recommend_FBMediaDownloader",
      icon: "https://www.facebook.com/favicon.ico",
      name: { en: "FB Media Downloader", vi: "FB Media Downloader" },
      description: {
        en: "Tool download media from facebook automatic",
        vi: "Công cụ tải ảnh/video từ facebook tự động cực nhanh",
      },
      onClickExtension: () =>
        window.open("https://github.com/HoangTran0410/FBMediaDownloader"),
    },
    { name: { en: "--- Web ---", vi: "--- Web hay ---" } },
    {
      id: "recommend_YouCom",
      icon: "https://you.com/favicon/apple-touch-icon-72x72.png",
      name: { en: "You.com", vi: "You.com" },
      description: {
        en: "The AI Search Engine You Control",
        vi: "Trình tìm kiếm sử dụng trí tuệ nhân tạo",
      },
      onClickExtension: () => window.open("https://you.com/"),
    },
    {
      id: "recommend_ItTools",
      icon: "https://it-tools.tech/favicon-32x32.png",
      name: { en: "IT Tools", vi: "IT Tools" },
      description: {
        en: "Handy tools for developers",
        vi: "Tổng hợp tools hữu ích cho IT",
      },
      onClickExtension: () => window.open("https://it-tools.tech/"),
    },
    { name: { en: "--- Extensions ---", vi: "--- Extensions hay ---" } },
    {
      id: "recommend_CRXViewer",
      icon: "https://lh3.googleusercontent.com/fD5QA80tZj1up43xmnxnxiqKNEq7515-HNtLfjoZlz_I626zxXmjlhKaQPUme_evpCEnN5-U7VnG3VfOcnTPzv_i=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "CRX Viewer", vi: "CRX Viewer" },
      description: {
        en: "View/Download source code of any extension",
        vi: "Xem/Tải source code của mọi extension",
      },
      onClickExtension: () =>
        window.open(
          "https://chrome.google.com/webstore/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin"
        ),
    },
    {
      id: "recommend_uBlockOrigin",
      icon: "https://lh3.googleusercontent.com/rrgyVBVte7CfjjeTU-rCHDKba7vtq-yn3o8-10p5b6QOj_2VCDAO3VdggV5fUnugbG2eDGPPjoJ9rsiU_tUZBExgLGc=s60",
      name: { en: "uBlock Origin", vi: "uBlock Origin" },
      description: {
        en: "Block advertisements for all website",
        vi: "Chặn quảng cáo cho mọi website",
      },
      onClickExtension: () =>
        window.open(
          "https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm"
        ),
    },
    {
      id: "recommend_DarkReader",
      icon: "https://lh3.googleusercontent.com/T66wTLk-gpBBGsMm0SDJJ3VaI8YM0Utr8NaGCSANmXOfb84K-9GmyXORLKoslfxtasKtQ4spDCdq_zlp_t3QQ6SI0A=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Dark reader", vi: "Dark reader" },
      description: {
        en: "Darkmode for every website",
        vi: "Chế độ tối cho mọi trang web",
      },
      onClickExtension: () =>
        window.open(
          "https://chrome.google.com/webstore/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh"
        ),
    },
    {
      id: "recommend_GoogleTranslate",
      icon: "https://lh3.googleusercontent.com/3ZU5aHnsnQUl9ySPrGBqe5LXz_z9DK05DEfk10tpKHv5cvG19elbOr0BdW_k8GjLMFDexT2QHlDwAmW62iLVdek--Q=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Google translate", vi: "Google dịch" },
      description: {
        en: "Instant translation for all website",
        vi: "Dịch nhanh, trực tiếp trong mọi website",
      },
      onClickExtension: () =>
        window.open(
          "https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb"
        ),
    },
    {
      id: "recommend_NSFWFilter",
      icon: "https://lh3.googleusercontent.com/M_2Q8eJAj1ejsRg30LuJs_Q94Jk7d-6ZbE5cyddULweH5LrfsVJtjK8zbpSjwA3G9oHwZeyHyrYrr971kqLwtNNP=w128-h128-e365-rj-sc0x00ffffff",
      name: {
        en: "NSFW Filter: Hide NSFW content",
        vi: "NSFW Filter: Ẩn nội dung 18+",
      },
      description: {
        en: "Hide NSFW content from websites using this extension powered by AI",
        vi: "Ẩn mọi nội dung 18+ trên website, sử dụng trí tuệ nhân tạo",
      },
      onClickExtension: () =>
        window.open(
          "https://chrome.google.com/webstore/detail/nsfw-filter/kmgagnlkckiamnenbpigfaljmanlbbhh"
        ),
    },
    {
      id: "recommend_Violentmonkey",
      icon: "https://violentmonkey.github.io/favicon-32x32.png?v=e0d9ed50fb982761b0f7cdea8b093ae9",
      name: {
        en: "Violentmonkey",
        vi: "Violentmonkey",
      },
      description: {
        en: "An open source userscript manager.",
        vi: "Trình quản lý userscript tốt.",
      },
      onClickExtension: () => window.open("https://violentmonkey.github.io/"),
    },
    {
      id: "recommend_Extensity",
      icon: "https://lh3.googleusercontent.com/mgOg2hnGuthlYj-MEUXedWn_s9QjTXBwusffIAhbIuHM8L3K2c5cq1xf7bCzbRE5f9E6RXaGLPNEuJEt4hP6sLDL=s60",
      name: {
        en: "Extensity",
        vi: "Extensity",
      },
      description: {
        en: "Extension manager - Quickly enable/disable browser extensions",
        vi: "Trình quản lý extension - Nhanh chóng tắt/mở extension của trình duyệt",
      },
      onClickExtension: () =>
        window.open(
          "https://chromewebstore.google.com/detail/extensity/jjmflmamggggndanpgfnpelongoepncg"
        ),
    },
    {
      id: "recommend_BookmarkSidebar",
      icon: "https://lh3.googleusercontent.com/4kT7DxtoPSmSLzTit1w2Vbx7b1L2zkASTrqGzEpBW-qs2EwmLYzBTyv0cvlGZo-rD-s732OIrUXX-C33RHPSFvOj=s0",
      name: {
        en: "Bookmark Sidebar",
        vi: "Bookmark Sidebar",
      },
      description: {
        en: "Very good Bookmark manager, find your bookmarks faster.",
        vi: "Trình quản lý extension ngon, tìm kiếm bookmark nhanh hơn bao giờ hết.",
      },
      onClickExtension: () =>
        window.open(
          "https://chromewebstore.google.com/detail/thanh-d%E1%BA%A5u-trang/jdbnofccmhefkmjbkkdkfiicjkgofkdh"
        ),
    },
    {
      id: "recommend_Beecost",
      icon: "https://lh3.googleusercontent.com/QeCUs-fM4mwAmBVRS0VU8NrjJnDnbSsXoqUrCbd8ZbHou03FBPEQOYHAcdcL_rn7NMrUpWMcXoG2m_CrKtAhc-wLgLU=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Beecost", vi: "Beecost" },
      description: {
        en: "Check deals/prices in ecommerce websites",
        vi: "Kiểm tra giá/ưu đãi giả khi mua hàng online",
      },
      onClickExtension: () => window.open("https://beecost.vn/"),
    },
  ],
};

function sortScriptsByTab(scripts, _tabs, addTabTitle = true) {
  let result = [];

  for (let tab of Object.values(_tabs)) {
    let sorted = [];

    for (let script of tab.scripts) {
      let found = scripts.findIndex((_) => _.id === script.id) >= 0;
      if (found) {
        sorted.push(script);
      }
    }

    if (sorted.length) {
      addTabTitle && result.push(createTitle(tab.name.en, tab.name.vi));
      result.push(...sorted);
    }
  }
  return result;
}

function refreshSpecialTabs() {
  // add data to special tabs
  let recentTab = specialTabs.find((tab) => tab.id === CATEGORY.recently.id);
  if (recentTab) recentTab.scripts = recentScriptsSaver.get();

  let favoriteTab = specialTabs.find((tab) => tab.id === CATEGORY.favorite.id);
  if (favoriteTab) favoriteTab.scripts = favoriteScriptsSaver.get();

  let allTab = specialTabs.find((tab) => tab.id === CATEGORY.all.id);
  if (allTab) allTab.scripts = sortScriptsByTab(Object.values(s), tabs);

  let autoTab = specialTabs.find((tab) => tab.id === CATEGORY.autorun.id);
  if (autoTab)
    autoTab.scripts = sortScriptsByTab(
      Object.values(s).filter((_) => canAutoRun(_)),
      tabs
    );
}

function getAllTabs() {
  return [...specialTabs, ...tabs, recommendTab];
}

export { refreshSpecialTabs, tabs, specialTabs, recommendTab, getAllTabs };
