import { scriptsWithId as scripts } from "./scriptsWithId.js";
import { CATEGORY } from "./category.js";
import { recentScripts } from "./utils.js";
import { addBadge, BADGES } from "./badge.js";

const createTitle = (en, vi) => ({ name: { en, vi } });

export const DEFAULT_TABID = CATEGORY.search.id;
export const tabs = [
  {
    ...CATEGORY.recently,
    scripts: [...(await recentScripts.get())],
  },
  {
    ...CATEGORY.search,
    scripts: [
      addBadge(scripts.whatFont, BADGES.hot),
      addBadge(scripts.search_sharedAccount, BADGES.hot),
      addBadge(scripts.whatWebsiteStack, BADGES.new),
      addBadge(scripts.search_googleSite, BADGES.new),
      addBadge(scripts.search_paperWhere, BADGES.new),
      addBadge(scripts.viewWebsiteAnalyticsOnline, BADGES.new),
      addBadge(scripts.seach_totalIndexedPages, BADGES.new),
      scripts.checkWebDie,
      scripts.openWaybackUrl,
    ],
  },
  {
    ...CATEGORY.download,
    scripts: [
      addBadge(scripts.download_video, BADGES.new),
      addBadge(scripts.download_image, BADGES.hot),
    ],
  },
  {
    ...CATEGORY.facebook,
    scripts: [
      createTitle("--- UI ---", "--- Giao diện ---"),
      addBadge(scripts.fb_toggleLight, BADGES.new),
      createTitle("--- Access Token ---", "--- Access Token ---"),
      scripts.fb_getTokenBusiness,
      scripts.fb_getTokenFacebook,
      scripts.fb_getTokenMFacebook,
      createTitle("--- Get ID ---", "--- Lấy ID ---"),
      addBadge(scripts.fb_getUid, BADGES.hot),
      addBadge(scripts.fb_getPageId, BADGES.hot),
      addBadge(scripts.fb_getGroupId, BADGES.hot),
      addBadge(scripts.fb_getAlbumId, BADGES.hot),
      addBadge(scripts.fb_getTimelineAlbumId, BADGES.hot),
      scripts.fb_getAllVideoId,
      scripts.fb_getAllAlbumId,
      addBadge(scripts.fb_getUidFromUrl, BADGES.hot),
      scripts.fb_getAllUidFromFbSearch,
      scripts.fb_getAllUidFromFriendsPage,
      scripts.fb_getAllUidOfGroupMembers,
      createTitle("--- Download ---", "--- Tải xuống ---"),
      scripts.fb_getAvatarFromUid,
      addBadge(scripts.fb_downloadCurrentVideo, BADGES.beta),
      addBadge(scripts.fb_downloadAlbumMedia, BADGES.beta),
    ],
  },
  {
    ...CATEGORY.instagram,
    scripts: [
      scripts.insta_getToken,
      addBadge(scripts.insta_getUid, BADGES.hot),
      addBadge(scripts.insta_getAllUserMedia, BADGES.beta),
      addBadge(scripts.insta_getAllImagesInNewFeed, BADGES.beta),
      addBadge(scripts.insta_getAllImagesInUserProfile, BADGES.beta),
    ],
  },
  {
    ...CATEGORY.youtube,
    scripts: [
      addBadge(scripts.youtube_downloadVideo, BADGES.beta),
      addBadge(scripts.pictureInPicture, BADGES.new),
      addBadge(scripts.youtube_toggleLight, BADGES.hot),
      scripts.youtube_bypass18,
    ],
  },
  {
    ...CATEGORY.vimeo,
    scripts: [addBadge(scripts.download_video, BADGES.new)],
  },
  {
    ...CATEGORY.github,
    scripts: [
      addBadge(scripts.github_goToFirstCommit, BADGES.hot),
      scripts.github1s,
    ],
  },
  {
    ...CATEGORY.doutube,
    scripts: [
      addBadge(scripts.doutube_enableDownloadVideo, BADGES.hot),
      scripts.doutube_downloadWatchingVideo,
      scripts.doutube_downloadWatchingStory,
      scripts.doutube_getAllVideoInUserProfile,
    ],
  },
  {
    ...CATEGORY.pdf,
    scripts: [addBadge(scripts.darkModePDF, BADGES.hot), scripts.webToPDF],
  },
  {
    ...CATEGORY.qrcode,
    scripts: [addBadge(scripts.textToQRCode, BADGES.hot), scripts.webToQRCode],
  },
  {
    ...CATEGORY.automation,
    scripts: [scripts.scrollToVeryEnd],
  },
  {
    ...CATEGORY.password,
    scripts: [
      addBadge(scripts.passwordGenerator, BADGES.hot),
      addBadge(scripts.search_sharedAccount, BADGES.hot),
      scripts.viewHiddenPassword,
    ],
  },
  {
    ...CATEGORY.unlock,
    scripts: [
      addBadge(scripts.viewCookies, BADGES.new),
      addBadge(scripts.removeCookies, BADGES.hot),
      scripts.enableTextSelection,
      scripts.reEnableContextMenu,
    ],
  },
  {
    ...CATEGORY.webUI,
    scripts: [
      addBadge(scripts.toggleEditPage, BADGES.hot),
      addBadge(scripts.performanceAnalyzer, BADGES.new, BADGES.unstable),
      createTitle("--- View ---", "--- Xem ---"),
      scripts.listAllImagesInWeb,
      scripts.viewScriptsUsed,
      scripts.viewStylesUsed,
      scripts.viewPartialSource,
      createTitle("--- Remove ---", "--- Xoá ---"),
      scripts.removeColours,
      scripts.removeStylesheet,
      scripts.removeImages,
      scripts.removeBloat,
      createTitle("--- Table ---", "--- Bảng ---"),
      scripts.table_addSortTable,
      scripts.table_addNumberColumn,
      scripts.table_swapRowAndColumn,
      createTitle("--- More ---", "--- Khác ---"),
      scripts.internalOrExternalLink,
      scripts.getWindowSize,
      scripts.letItSnow,
    ],
  },
  {
    ...CATEGORY.more,
    scripts: [addBadge(scripts.shortenURL, BADGES.hot), scripts.runStatJs],
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
      { name: { en: "--- Recommend ---", vi: "--- Khuyên dùng ---" } },
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
        icon: "https://lh3.googleusercontent.com/3ZU5aHnsnQUl9ySPrGBqe5LXz_z9DK05DEfk10tpKHv5cvG19elbOr0BdW_k8GjLMFDexT2QHlDwAmW62iLVdek--Q=w128-h128-e365-rj-sc0x00ffffff",
        name: { en: "Google translate", vi: "Google dịch" },
        description: {
          en: "Instant translation for all website",
          vi: "Dịch nhanh, trực tiếp trong mọi website",
        },
        link: "https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb",
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
