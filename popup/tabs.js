import { allScripts as s } from "../scripts/index.js";
import { CATEGORY } from "./category.js";
import { getAvailableScripts, recentScripts } from "./utils.js";
import { addBadge, BADGES } from "./badge.js";

const createTitle = (en, vi) => ({ name: { en, vi } });
const isTitle = (script) => !script.func && !script.file && !script.link;

const DEFAULT_TABID = CATEGORY.available.id;
const tabs = [
  {
    ...CATEGORY.search,
    scripts: [
      s.whatFont,
      s.search_sharedAccount,
      s.whatWebsiteStack,
      s.search_googleSite,
      s.search_paperWhere,
      s.viewWebsiteAnalyticsOnline,
      s.search_totalIndexedPages,
      s.checkWebDie,
      s.openWaybackUrl,
      s.googleCache,
    ],
  },
  {
    ...CATEGORY.download,
    scripts: [s.download_video, s.download_image],
  },
  {
    ...CATEGORY.facebook,
    scripts: [
      createTitle("--- UI ---", "--- Giao diện ---"),
      s.fb_toggleLight,
      createTitle("--- Access Token ---", "--- Access Token ---"),
      s.fb_getTokenBusiness,
      s.fb_getTokenFacebook,
      s.fb_getTokenMFacebook,
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
      s.insta_enableDownloadImage,
      s.insta_getToken,
      s.insta_getUid,
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
    scripts: [s.scrollToVeryEnd],
  },
  {
    ...CATEGORY.password,
    scripts: [
      s.passwordGenerator,
      s.search_sharedAccount,
      s.viewHiddenPassword,
    ],
  },
  {
    ...CATEGORY.unlock,
    scripts: [
      s.viewCookies,
      s.removeCookies,
      s.enableTextSelection,
      s.reEnableContextMenu,
    ],
  },
  {
    ...CATEGORY.webUI,
    scripts: [
      s.toggleEditPage,
      s.performanceAnalyzer,
      s.scrollByDrag,
      createTitle("--- View ---", "--- Xem ---"),
      s.listAllImagesInWeb,
      s.viewAllLinks,
      s.viewScriptsUsed,
      s.viewStylesUsed,
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
    scripts: [s.shortenURL, s.runStatJs],
  },
  {
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
          name: { en: "FB Media Downloader", vi: "FB Media Downloader" },
          description: {
            en: "Tool download media from facebook automatic",
            vi: "Công cụ tải ảnh/video từ facebook tự động cực nhanh",
          },
          link: "https://github.com/HoangTran0410/FBMediaDownloader",
        },
        BADGES.hot
      ),
      {
        name: {
          en: "Relational Database Tools",
          vi: "Giải toán môn PTTK HTTT",
        },
        description: {
          en: "Solve problems in relational data field",
          vi: "Tính toán các vấn đề trong môn phân tích thiết kế hệ thống thông tin",
        },
        link: "https://github.com/HoangTran0410/PTTK",
      },
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
        icon: "https://lh3.googleusercontent.com/fD5QA80tZj1up43xmnxnxiqKNEq7515-HNtLfjoZlz_I626zxXmjlhKaQPUme_evpCEnN5-U7VnG3VfOcnTPzv_i=w128-h128-e365-rj-sc0x00ffffff",
        name: { en: "CRX Viewer", vi: "CRX Viewer" },
        description: {
          en: "View/Download source code of any extension",
          vi: "Xem/Tải source code của mọi extension",
        },
        link: "https://chrome.google.com/webstore/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin",
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
  },
];

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

tabs.unshift(
  {
    ...CATEGORY.recently,
    scripts: await recentScripts.get(),
  },
  {
    ...CATEGORY.available,
    scripts: await getAvailableScriptsInTabs(tabs),
  }
);

// add script count to tab name
tabs.forEach((tab) => {
  if (tab.showCount) {
    let avaiCount = tab.scripts.filter((script) => !isTitle(script)).length;
    let allCount = Object.keys(s).length;

    tab.name.vi += ` (${avaiCount}/${allCount})`;
    tab.name.en += ` (${avaiCount}/${allCount})`;
  }
});

export { isTitle, tabs, DEFAULT_TABID };
