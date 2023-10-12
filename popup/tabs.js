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
    ...CATEGORY.ai,
    scripts: [
      s.huggingface,
      createTitle("--- AI Art ---", "--- AI Art - Tranh/Ảnh ---"),
      s.bing_imageCreator,
      s.pixaiart,
      s.playgroundai,
      s.dreamai,
      s.skybox_blockadelabs,
      s.stable_diffusion_demo,
      s.stable_diffusion_baseten,
    ],
  },
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
      s.getLinkLuanxt,
      s.getFavicon,
      // s.bookmark_exporter,
      createTitle("--- Music ---", "--- Nhạc ---"),
      s.showTheAudios,
      // s.soundcloud_downloadMusic,
      s.nhaccuatui_downloader,
      s.zingmp3_downloadMusic,
      s.zingmp3_oldLayout,
      s.freesound_downloadAudio,
      createTitle("--- Videos ---", "--- Video ---"),
      s.savevideo_me,
      s.vimeo_downloader,
      s.showTheVideos,
      createTitle("--- Photos ---", "--- Ảnh ---"),
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
      s.fb_downloadAlbumMedia,
      s.fb_downloadWallMediaFromPosts,
      s.fb_getAllAlbumInformation,
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
      s.fb_openSaved,
      s.fb_openMemories,
      s.fb_openAdsActivities,
    ],
  },
  {
    ...CATEGORY.instagram,
    scripts: [
      s.insta_injectDownloadBtn,
      s.insta_getToken,
      s.insta_getUserInfo,
      createTitle("--- Download ---", "--- Tải xuống ---"),
      s.instantgram,
      s.insta_storySaver,
      createTitle("--- Bulk Download ---", "--- Tải hàng loạt ---"),
      s.insta_getAllUserMedia,
      s.insta_getAllImagesInNewFeed,
      s.insta_getAllImagesInUserProfile,
    ],
  },
  {
    ...CATEGORY.youtube,
    scripts: [
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
      createTitle("--- Douyin ---", "--- Douyin ---"),
      s.douyin_downloadWachingVideo,
      s.douyin_downloadAllVideoUser,
      createTitle("--- Doutu.be ---", "--- Doutu.be ---"),
      s.doutube_downloadWatchingVideo,
      s.doutube_getAllVideoInUserProfile,
    ],
  },
  {
    ...CATEGORY.shopping,
    scripts: [
      s.shopee_topVariation,
      s.shopee_totalSpendMoney,
      s.shopee_totalSpendMoney_excel,
      s.tiki_totalSpendMoney,
    ],
  },
  {
    ...CATEGORY.github,
    scripts: [s.github_goToAnyCommit, s.githubdev, s.github1s],
  },
  {
    ...CATEGORY.automation,
    scripts: [
      s.shortenURL,
      s.unshorten,
      s.textToSpeech,
      s.changeAudioOutput,
      createTitle("--- QRCode ---", "--- QRCode ---"),
      s.textToQRCode,
      s.webToQRCode,
      createTitle("--- Auto ---", "--- Tự động ---"),
      s.passwordGenerator,
      s.getAllEmailsInWeb,
      s.screenshotFullPage,
      s.jsonformatter,
      s.performanceAnalyzer,
      s.scrollToVeryEnd,
      s.dino_hack,
      createTitle("--- PDF ---", "--- PDF ---"),
      s.webToPDF,
      s.fastDoc,
      s.smartPDF,
      s.pdfstuffs,
      createTitle("--- Share ---", "--- Chia sẻ ---"),
      s.send_shareFiles,
      s.transfer_sh,
    ],
  },
  {
    ...CATEGORY.unlock,
    scripts: [
      createTitle("--- Unlock web ---", "--- Mở khoá web ---"),
      s.donotBlockMe,
      s.envato_bypassPreview,
      s.scribd_bypassPreview,
      s.studyphim_unlimited,
      s.studocu_bypassPreview,
      createTitle("--- Unlock function ---", "--- Mở khoá chức năng ---"),
      s.detect_zeroWidthCharacters,
      s.simpleAllowCopy,
      s.reEnableContextMenu,
      s.showHiddenFields,
      // s.passwordFieldToggle,
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
      icon: "https://you.com/favicon/apple-touch-icon-72x72.png",
      name: { en: "You.com", vi: "You.com" },
      description: {
        en: "The AI Search Engine You Control",
        vi: "Trình tìm kiếm sử dụng trí tuệ nhân tạo",
      },
      onClickExtension: () => window.open("https://you.com/"),
    },
    { name: { en: "--- Extensions ---", vi: "--- Extensions hay ---" } },
    {
      icon: "https://lh3.googleusercontent.com/2GdtpZt9NWFkfrfLZnWL2gM2UdCOsgpQhhdxSx4wPw5Iz10NcT433g3iHyAAZ8J-ZCyz3gwLKR1kJQC0PidRVKKJ1Ws=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "J2Team Security", vi: "J2Team Security" },
      description: {
        en: "Use fb better with more security and tools",
        vi: "Dùng fb sướng hơn bao giờ hết",
      },
      onClickExtension: () =>
        window.open(
          "https://chrome.google.com/webstore/detail/j2team-security/hmlcjjclebjnfohgmgikjfnbmfkigocc"
        ),
    },
    {
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
      icon: "https://lh3.googleusercontent.com/nnMASpwJY4U5ukhKl4PfIdaOpuKXNrVvfIc9n8-NJOJIY7m3RLgsazN6ATmDkXyaMll8zADOXuBR574MwC7T71kJcQ=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Adblock Plus", vi: "Adblock Plus" },
      description: {
        en: "Block advertisements for all website",
        vi: "Chặn quảng cáo cho mọi website",
      },
      onClickExtension: () =>
        window.open(
          "https://chrome.google.com/webstore/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb"
        ),
    },
    {
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
      icon: "https://lh3.googleusercontent.com/tGvFFAf_mkjk-mfiRipdYU_WTMCZSReAy4opGxvWJppyHzHTKy6f1NO1tSpV998-ZcKJjPOWpWbtEFLEMr0Y_SyBKA=w128-h128-e365-rj-sc0x00ffffff",
      name: {
        en: "DYL Download Facebook Video",
        vi: "DYL Download Facebook Video",
      },
      description: {
        en: "Video, Story, download with one click",
        vi: "Tải video, story facebook với 1 nút nhấn",
      },
      onClickExtension: () =>
        window.open(
          "https://chrome.google.com/webstore/detail/dyl-download-facebook-vid/honmapcmnfgjmahijdniaaollhhfpcnj?hl=vi"
        ),
    },
    {
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
      icon: "https://lh3.googleusercontent.com/QeCUs-fM4mwAmBVRS0VU8NrjJnDnbSsXoqUrCbd8ZbHou03FBPEQOYHAcdcL_rn7NMrUpWMcXoG2m_CrKtAhc-wLgLU=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Beecost", vi: "Beecost" },
      description: {
        en: "Check deals/prices in ecommerce websites",
        vi: "Kiểm tra giá/ưu đãi giả khi mua hàng online",
      },
      onClickExtension: () => window.open("https://beecost.vn/"),
    },
    {
      icon: "https://lh3.googleusercontent.com/wafm5uFaPRSo1RHMbhcdEghFzTPUfYo5GosPmBhkdNuYlGz8WigoAQM-8lulzuhWQBGTbbUyRvfoyIMDypJzuAVZ=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Octotree", vi: "Octotree" },
      description: {
        en: "Filetree for github",
        vi: "Cây thư mục cho github",
      },
      onClickExtension: () => window.open("https://www.octotree.io/"),
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
