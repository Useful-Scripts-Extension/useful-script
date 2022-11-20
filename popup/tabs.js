import { allScripts as s } from "../scripts/index.js";
import { CATEGORY } from "./helpers/category.js";
import { getAvailableScripts } from "./helpers/scriptHelpers.js";
import { addBadge, BADGES } from "./helpers/badge.js";
import { favoriteScriptsSaver, recentScriptsSaver } from "./helpers/storage.js";

const createTitle = (en, vi) => ({ name: { en, vi } });
const isFunc = (script) => script.func && typeof script.func === "function";
const isLink = (script) => script.link && typeof script.link === "string";
const isTitle = (script) => !isFunc(script) && !isLink(script);

const specialTabs = [
  {
    ...CATEGORY.recently,
    scripts: [],
  },
  {
    ...CATEGORY.favorite,
    scripts: [],
  },
  {
    ...CATEGORY.available,
    scripts: [],
  },
];

const tabs = [
  {
    ...CATEGORY.search,
    scripts: [
      s.whatFont,
      s.similarWeb,
      s.search_sharedAccount,
      s.whatWebsiteStack,
      s.whois,
      s.viewWebMetaInfo,
      s.search_paperWhere,
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
      createTitle("--- Music ---", "--- Nhạc ---"),
      s.download_audio,
      s.nhaccuatui_downloader,
      s.zingmp3_downloadMusic,
      s.zingmp3_oldLayout,
      createTitle("--- Videos ---", "--- Video ---"),
      s.download_video,
      s.download_video2,
      createTitle("--- Photos ---", "--- Ảnh ---"),
      s.showTheImages,
      s.download_image,
    ],
  },
  {
    ...CATEGORY.google,
    scripts: [
      // s.google_downloadDriveVideo,
      s.search_totalIndexedPages,
      s.search_googleSite,
      s.googleShortcuts,
      s.googleCache,
    ],
  },
  {
    ...CATEGORY.facebook,
    scripts: [
      createTitle("--- UI ---", "--- Giao diện ---"),
      s.fb_toggleLight,
      createTitle("--- Access Token ---", "--- Access Token ---"),
      s.fb_checkToken,
      s.fb_getTokenFfb,
      s.fb_getTokenBussinessLocation,
      s.fb_getTokenBusinessStudio,
      s.fb_getTokenCampaigns,
      s.fb_getTokenFacebook,
      s.fb_getTokenMFacebook,
      s.fb_getTokenLocmai,
      createTitle("--- Get ID ---", "--- Lấy ID ---"),
      s.fb_getUid,
      s.fb_getPageId,
      s.fb_getGroupId,
      s.fb_getAlbumId,
      s.fb_getTimelineAlbumId,
      s.fb_getAllVideoId,
      s.fb_getAllAlbumId,
      s.fb_getUidFromUrl,
      s.fb_getAllUidFromFbSearch,
      s.fb_getAllUidFromFriendsPage,
      s.fb_getAllUidOfGroupMembers,
      createTitle("--- Download ---", "--- Tải xuống ---"),
      s.fb_getAvatarFromUid,
      s.fb_downloadCurrentVideo,
      s.fb_downloadAlbumMedia,
    ],
  },
  {
    ...CATEGORY.instagram,
    scripts: [
      // s.insta_reloaded,
      s.insta_enableDownloadImage,
      s.insta_getToken,
      s.insta_getUserInfo,
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
      s.youtube_popupPlayer,
    ],
  },
  {
    ...CATEGORY.github,
    scripts: [s.github_goToFirstCommit, s.githubdev, s.github1s],
  },
  {
    ...CATEGORY.doutube,
    scripts: [
      s.doutube_enableDownloadVideo,
      s.doutube_downloadWatchingVideo,
      s.doutube_downloadWatchingStory,
      s.doutube_getAllVideoInUserProfile,
    ],
  },
  {
    ...CATEGORY.pdf,
    scripts: [s.darkModePDF, s.webToPDF],
  },
  {
    ...CATEGORY.qrcode,
    scripts: [s.textToQRCode, s.webToQRCode],
  },
  {
    ...CATEGORY.automation,
    scripts: [s.getAllEmailsInWeb, s.performanceAnalyzer, s.scrollToVeryEnd],
  },
  {
    ...CATEGORY.password,
    scripts: [
      s.passwordGenerator,
      s.search_sharedAccount,
      s.passwordFieldToggle,
    ],
  },
  {
    ...CATEGORY.unlock,
    scripts: [
      s.showHiddenFields,
      s.viewCookies,
      s.removeCookies,
      s.enableTextSelection,
      s.reEnableContextMenu,
      s.injectScriptToWebsite,
      s.paywallKiller,
    ],
  },
  {
    ...CATEGORY.webUI,
    scripts: [
      s.toggleEditPage,
      s.scrollByDrag,
      createTitle("--- View ---", "--- Xem ---"),
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
  {
    ...CATEGORY.more,
    scripts: [s.shortenURL, s.runStatJs, s.test_script],
  },
];

const recommendTab = {
  ...CATEGORY.recommend,
  scripts: [
    { name: { en: "--- Same author ---", vi: "--- Cùng tác giả ---" } },
    addBadge(
      {
        icon: "https://lh3.googleusercontent.com/vyTQCufFw3IW24ybIykgBxxvm8GLQ1AvD3eRDGJRsS0HuMd9DQsbHHm_iL6WlPXTCC_hwqkKeKlW63AjBS9DkVF-=w128-h128-e365-rj-sc0x00ffffff",
        name: {
          en: "Reveal Deleted FB Message",
          vi: "Xem tin nhắn FB bị gỡ",
        },
        description: {
          en: "Know what your friends have sent you",
          vi: "Xem bạn bè đã gửi gì cho bạn",
        },
        link: "https://github.com/HoangTran0410/RevealDeletedFBMessages",
      },
      BADGES.hot
    ),
    addBadge(
      {
        icon: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-square2-256.png",
        name: { en: "FB Media Downloader", vi: "FB Media Downloader" },
        description: {
          en: "Tool download media from facebook automatic",
          vi: "Công cụ tải ảnh/video từ facebook tự động cực nhanh",
        },
        link: "https://github.com/HoangTran0410/FBMediaDownloader",
      },
      BADGES.hot
    ),
    { name: { en: "--- Extensions ---", vi: "--- Extensions hay ---" } },
    {
      icon: "https://lh3.googleusercontent.com/2GdtpZt9NWFkfrfLZnWL2gM2UdCOsgpQhhdxSx4wPw5Iz10NcT433g3iHyAAZ8J-ZCyz3gwLKR1kJQC0PidRVKKJ1Ws=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "J2Team Security", vi: "J2Team Security" },
      description: {
        en: "Use fb better with more security and tools",
        vi: "Dùng fb sướng hơn bao giờ hết",
      },
      link: "https://chrome.google.com/webstore/detail/j2team-security/hmlcjjclebjnfohgmgikjfnbmfkigocc",
    },
    {
      icon: "https://lh3.googleusercontent.com/fD5QA80tZj1up43xmnxnxiqKNEq7515-HNtLfjoZlz_I626zxXmjlhKaQPUme_evpCEnN5-U7VnG3VfOcnTPzv_i=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "CRX Viewer", vi: "CRX Viewer" },
      description: {
        en: "View/Download source code of any extension",
        vi: "Xem/Tải source code của mọi extension",
      },
      link: "https://chrome.google.com/webstore/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin",
    },
    {
      icon: "https://lh3.googleusercontent.com/nnMASpwJY4U5ukhKl4PfIdaOpuKXNrVvfIc9n8-NJOJIY7m3RLgsazN6ATmDkXyaMll8zADOXuBR574MwC7T71kJcQ=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Adblock Plus", vi: "Adblock Plus" },
      description: {
        en: "Block advertisements for all website",
        vi: "Chặn quảng cáo cho mọi website",
      },
      link: "https://chrome.google.com/webstore/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb",
    },
    {
      icon: "https://lh3.googleusercontent.com/3ZU5aHnsnQUl9ySPrGBqe5LXz_z9DK05DEfk10tpKHv5cvG19elbOr0BdW_k8GjLMFDexT2QHlDwAmW62iLVdek--Q=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Google translate", vi: "Google dịch" },
      description: {
        en: "Instant translation for all website",
        vi: "Dịch nhanh, trực tiếp trong mọi website",
      },
      link: "https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb",
    },
    {
      icon: "https://lh3.googleusercontent.com/_l4UaD5Gwub2AwFZdomRpfMD2737y0Ow6k2sfVuWdm0fQ0iGSdEfhd9X77taeQ-0VM6Wi3HnpecLWUAI9uHq11TSktw=w128-h128-e365-rj-sc0x00ffffff",
      name: {
        en: "Read Aloud: Text to speech voice reader",
        vi: "Read Aloud: Đọc cho tôi nghe",
      },
      description: {
        en: "Read aloud website content, multilanguage",
        vi: "Đọc nội dung trang web, đa ngôn ngữ",
      },
      link: "https://chrome.google.com/webstore/detail/read-aloud-a-text-to-spee/hdhinadidafjejdhmfkjgnolgimiaplp",
    },
    {
      icon: "https://lh3.googleusercontent.com/s-86QIqiZeS3NSGiw95oJAm9ExGyUat2oF3hqOu4xVypfn18HX6LYNwJUtKoSYFRtf4-qBSvBYr41ZZWPqbh5Hh-xrQ=w128-h128-e365-rj-sc0x00ffffff",
      name: {
        en: "Video Downloader professional",
        vi: "Video Downloader professional",
      },
      description: {
        en: "Download video from almost any websites",
        vi: "Tải video từ hầu như mọi website",
      },
      link: "https://chrome.google.com/webstore/detail/video-downloader-professi/elicpjhcidhpjomhibiffojpinpmmpil",
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
      link: "https://chrome.google.com/webstore/detail/dyl-download-facebook-vid/honmapcmnfgjmahijdniaaollhhfpcnj?hl=vi",
    },
    {
      icon: "https://lh3.googleusercontent.com/T66wTLk-gpBBGsMm0SDJJ3VaI8YM0Utr8NaGCSANmXOfb84K-9GmyXORLKoslfxtasKtQ4spDCdq_zlp_t3QQ6SI0A=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Dark reader", vi: "Dark reader" },
      description: {
        en: "Darkmode for every website",
        vi: "Chế độ tối cho mọi trang web",
      },
      link: "https://chrome.google.com/webstore/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh",
    },
    {
      icon: "https://lh3.googleusercontent.com/QeCUs-fM4mwAmBVRS0VU8NrjJnDnbSsXoqUrCbd8ZbHou03FBPEQOYHAcdcL_rn7NMrUpWMcXoG2m_CrKtAhc-wLgLU=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Beecost", vi: "Beecost" },
      description: {
        en: "Check deals/prices in ecommerce websites",
        vi: "Kiểm tra giá/ưu đãi giả khi mua hàng online",
      },
      link: "https://beecost.vn/",
    },

    {
      icon: "https://lh3.googleusercontent.com/ZzWGiT5YRGYjeltQ5vkZmsLAQ7Qj4eQnltDmE34KyUnGKNofHRqPF_cy19i2rc58sajKbamz-9rX2BZ2zXgPUm0e2g=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Web Developer", vi: "Web Developer" },
      description: {
        en: "Adds a toolbar button with various web developer tools.",
        vi: "Các công cụ hay cho web developer",
      },
      link: "https://chrome.google.com/webstore/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm",
    },
    {
      icon: "https://lh3.googleusercontent.com/wafm5uFaPRSo1RHMbhcdEghFzTPUfYo5GosPmBhkdNuYlGz8WigoAQM-8lulzuhWQBGTbbUyRvfoyIMDypJzuAVZ=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Octotree", vi: "Octotree" },
      description: {
        en: "Filetree for github",
        vi: "Cây thư mục cho github",
      },
      link: "https://www.octotree.io/",
    },
    {
      icon: "https://lh3.googleusercontent.com/J7n7qDIrekKpjDDP-oLo03rvP2drIRqOqTDdSK5MyUBhE2UCkYx1LXurAVNA_4lgHCkdZUtnVaEt0SvGed9gaSKhAA=w128-h128-e365-rj-sc0x00ffffff",
      name: {
        en: "Omni - Bookmark, History & Tab Manager",
        vi: "Omni - Bookmark, History & Tab Manager",
      },
      description: {
        en: "Supercharge Chrome with commands, shortcuts, and more",
        vi: "Dùng trình duyệt nhanh hơn với commands và phím tắt",
      },
      link: "https://chrome.google.com/webstore/detail/omni-bookmark-history-tab/mapjgeachilmcbbokkgcbgpbakaaeehi",
    },
    {
      icon: "https://lh3.googleusercontent.com/3hxmIF_t-oFuV8LAApMFpHs3Rexrox5ftHat7uwJuhV8ORGlyDRadqZG0HiY-q56HA70HT6C-8c1Z9BgbcjSJMaa8w=w128-h128-e365-rj-sc0x00ffffff",
      name: {
        en: "ColorZilla",
        vi: "ColorZilla",
      },
      description: {
        en: "Advanced Eyedropper, Color Picker, Gradient Generator and other colorful goodies",
        vi: "Trích xuất màu từ trang web",
      },
      link: "https://chrome.google.com/webstore/detail/colorzilla/bhlhnicpbhignbdhedgjhgdocnmhomnp",
    },
  ],
};

// add recently and available to head of array
async function getAvailableScriptsInTabs(_tabs) {
  let result = [];
  const avai = await getAvailableScripts();

  for (let tab of Object.values(_tabs)) {
    let avaiScriptsInTab = [];

    for (let script of tab.scripts) {
      let isAvai = avai.findIndex((_) => _.id === script.id) >= 0;
      if (isAvai) {
        avaiScriptsInTab.push(script);
      }
    }

    if (avaiScriptsInTab.length) {
      result.push(createTitle(tab.name.en, tab.name.vi));
      result.push(...avaiScriptsInTab);
    }
  }

  return result;
}

async function refreshSpecialTabs() {
  // add data to special tabs
  let recentTab = specialTabs.find((tab) => tab.id === CATEGORY.recently.id);
  if (recentTab) recentTab.scripts = await recentScriptsSaver.get();

  let favoriteTab = specialTabs.find((tab) => tab.id === CATEGORY.favorite.id);
  if (favoriteTab) favoriteTab.scripts = await favoriteScriptsSaver.get();

  let avaiab = specialTabs.find((tab) => tab.id === CATEGORY.available.id);
  if (avaiab) avaiab.scripts = await getAvailableScriptsInTabs(tabs);
}

function getAllTabs() {
  return [...specialTabs, ...tabs, recommendTab];
}

export {
  isTitle,
  isFunc,
  isLink,
  refreshSpecialTabs,
  tabs,
  specialTabs,
  recommendTab,
  getAllTabs,
};
