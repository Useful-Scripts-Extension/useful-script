import { CATEGORY } from "./category.js";
import fb_toggleLight from "./scripts/fb_toggleLight.js";
import fb_getTokenBusiness from "./scripts/fb_getTokenBusiness.js";
import fb_getTokenFacebook from "./scripts/fb_getTokenFacebook.js";
import fb_getTokenMFacebook from "./scripts/fb_getTokenMFacebook.js";
import fb_getUid from "./scripts/fb_getUid.js";
import fb_getPageId from "./scripts/fb_getPageId.js";
import fb_getGroupId from "./scripts/fb_getGroupId.js";
import fb_getAlbumId from "./scripts/fb_getAlbumId.js";
import fb_getTimelineAlbumId from "./scripts/fb_getTimelineAlbumId.js";
import fb_getAllVideoId from "./scripts/fb_getAllVideoId.js";
import fb_getAllAlbumId from "./scripts/fb_getAllAlbumId.js";
import fb_getUidFromUrl from "./scripts/fb_getUidFromUrl.js";
import fb_getAllUidFromFbSearch from "./scripts/fb_getAllUidFromFbSearch.js";
import fb_getAllUidFromFriendsPage from "./scripts/fb_getAllUidFromFriendsPage.js";
import fb_getAllUidOfGroupMembers from "./scripts/fb_getAllUidOfGroupMembers.js";
import downloadVideo from "./scripts/downloadVideo.js";
import fb_getAvatarFromUid from "./scripts/fb_getAvatarFromUid.js";
import fb_downloadCurrentVideo from "./scripts/fb_downloadCurrentVideo.js";
import fb_downloadAlbumMedia from "./scripts/fb_downloadAlbumMedia.js";
import insta_getToken from "./scripts/insta_getToken.js";
import insta_getUid from "./scripts/insta_getUid.js";
import insta_getAllUserMedia from "./scripts/insta_getAllUserMedia.js";
import insta_getAllImagesInNewFeed from "./scripts/insta_getAllImagesInNewFeed.js";
import insta_getAllImagesInUserProfile from "./scripts/insta_getAllImagesInUserProfile.js";
import pictureInPicture from "./scripts/pictureInPicture.js";
import youtube_toggleLight from "./scripts/youtube_toggleLight.js";
import youtube_bypass18 from "./scripts/youtube_bypass18.js";
import github_goToFirstCommit from "./scripts/github_goToFirstCommit.js";
import github1s from "./scripts/github1s.js";
import doutube_enableDownloadVideo from "./scripts/doutube_enableDownloadVideo.js";
import doutube_downloadWatchingVideo from "./scripts/doutube_downloadWatchingVideo.js";
import doutube_downloadWatchingStory from "./scripts/doutube_downloadWatchingStory.js";
import doutube_getAllVideoInUserProfile from "./scripts/doutube_getAllVideoInUserProfile.js";
import darkModePDF from "./scripts/darkModePDF.js";
import webToPDF from "./scripts/webToPDF.js";
import webToQRCode from "./scripts/webToQRCode.js";
import textToQRCode from "./scripts/textToQRCode.js";
import scrollToVeryEnd from "./scripts/scrollToVeryEnd.js";
import passwordGenerator from "./scripts/passwordGenerator.js";
import search_sharedAccount from "./scripts/search_sharedAccount.js";
import viewHiddenPassword from "./scripts/viewHiddenPassword.js";
import checkWebDie from "./scripts/checkWebDie.js";
import removeCookies from "./scripts/removeCookies.js";
import enableTextSelection from "./scripts/enableTextSelection.js";
import reEnableContextMenu from "./scripts/reEnableContextMenu.js";
import table_addSortTable from "./scripts/table_addSortTable.js";
import table_addNumberColumn from "./scripts/table_addNumberColumn.js";
import table_swapRowAndColumn from "./scripts/table_swapRowAndColumn.js";
import toggleEditPage from "./scripts/toggleEditPage.js";
import whatFont from "./scripts/whatFont.js";
import performanceAnalyzer from "./scripts/performanceAnalyzer.js";
import removeColours from "./scripts/removeColours.js";
import removeStylesheet from "./scripts/removeStylesheet.js";
import removeImages from "./scripts/removeImages.js";
import removeBloat from "./scripts/removeBloat.js";
import internalOrExternalLink from "./scripts/internalOrExternalLink.js";
import getWindowSize from "./scripts/getWindowSize.js";
import letItSnow from "./scripts/letItSnow.js";
import shortenURL from "./scripts/shortenURL.js";
import listAllImagesInWeb from "./scripts/listAllImagesInWeb.js";
import viewScriptsUsed from "./scripts/viewScriptsUsed.js";
import viewStylesUsed from "./scripts/viewStylesUsed.js";
import viewPartialSource from "./scripts/viewPartialSource.js";
import openWaybackUrl from "./scripts/openWaybackUrl.js";
import runStatJs from "./scripts/runStatJs.js";
import search_googleSite from "./scripts/search_googleSite.js";
import viewWebsiteAnalyticsOnline from "./scripts/viewWebsiteAnalyticsOnline.js";
import seach_totalIndexedPages from "./scripts/seach_totalIndexedPages.js";
import whatWebsiteStack from "./scripts/whatWebsiteStack.js";
import youtube_downloadVideo from "./scripts/youtube_downloadVideo.js";
import search_paperWhere from "./scripts/search_paperWhere.js";

const createTitle = (en, vi) => ({ name: { en, vi } });

const addBadge = (script, ...badges) => ({ ...script, badges: badges });

const BADGES = {
  hot: {
    text: { en: "hot", vi: "hot" },
    color: "#fff",
    backgroundColor: "#d40",
  },
  beta: {
    text: { en: "beta", vi: "beta" },
    color: "#000",
    backgroundColor: "#dd0",
  },
  new: {
    text: { en: "new", vi: "mới" },
    color: "#fff",
    backgroundColor: "#44d",
  },
  unstable: {
    text: { en: "unstable", vi: "chưa ổn định" },
    color: "#fff",
    backgroundColor: "#a77",
  },
};

const tabs = [
  {
    ...CATEGORY.search,
    scripts: [
      addBadge(whatFont, BADGES.hot),
      addBadge(search_sharedAccount, BADGES.hot),
      addBadge(whatWebsiteStack, BADGES.new),
      addBadge(search_googleSite, BADGES.new),
      addBadge(search_paperWhere, BADGES.new),
      addBadge(viewWebsiteAnalyticsOnline, BADGES.new),
      addBadge(seach_totalIndexedPages, BADGES.new),
      checkWebDie,
      openWaybackUrl,
    ],
  },
  {
    ...CATEGORY.facebook,
    scripts: [
      createTitle("--- UI ---", "--- Giao diện ---"),
      addBadge(fb_toggleLight, BADGES.new),
      createTitle("--- Access Token ---", "--- Access Token ---"),
      fb_getTokenBusiness,
      fb_getTokenFacebook,
      fb_getTokenMFacebook,
      createTitle("--- Get ID ---", "--- Lấy ID ---"),
      addBadge(fb_getUid, BADGES.hot),
      addBadge(fb_getPageId, BADGES.hot),
      addBadge(fb_getGroupId, BADGES.hot),
      addBadge(fb_getAlbumId, BADGES.hot),
      addBadge(fb_getTimelineAlbumId, BADGES.hot),
      fb_getAllVideoId,
      fb_getAllAlbumId,
      addBadge(fb_getUidFromUrl, BADGES.hot),
      fb_getAllUidFromFbSearch,
      fb_getAllUidFromFriendsPage,
      fb_getAllUidOfGroupMembers,
      createTitle("--- Download ---", "--- Tải xuống ---"),
      addBadge(downloadVideo, BADGES.new),
      fb_getAvatarFromUid,
      addBadge(fb_downloadCurrentVideo, BADGES.beta),
      addBadge(fb_downloadAlbumMedia, BADGES.beta),
    ],
  },
  {
    ...CATEGORY.instagram,
    scripts: [
      insta_getToken,
      addBadge(insta_getUid, BADGES.hot),
      addBadge(downloadVideo, BADGES.new),
      addBadge(insta_getAllUserMedia, BADGES.beta),
      addBadge(insta_getAllImagesInNewFeed, BADGES.beta),
      addBadge(insta_getAllImagesInUserProfile, BADGES.beta),
    ],
  },
  {
    ...CATEGORY.youtube,
    scripts: [
      addBadge(youtube_downloadVideo, BADGES.beta),
      addBadge(pictureInPicture, BADGES.new),
      addBadge(youtube_toggleLight, BADGES.hot),
      youtube_bypass18,
    ],
  },
  {
    ...CATEGORY.vimeo,
    scripts: [addBadge(downloadVideo, BADGES.new)],
  },
  {
    ...CATEGORY.github,
    scripts: [addBadge(github_goToFirstCommit, BADGES.hot), github1s],
  },
  {
    ...CATEGORY.doutube,
    scripts: [
      addBadge(doutube_enableDownloadVideo, BADGES.hot),
      doutube_downloadWatchingVideo,
      doutube_downloadWatchingStory,
      doutube_getAllVideoInUserProfile,
    ],
  },
  {
    ...CATEGORY.pdf,
    scripts: [addBadge(darkModePDF, BADGES.hot), webToPDF],
  },
  {
    ...CATEGORY.qrcode,
    scripts: [addBadge(textToQRCode, BADGES.hot), webToQRCode],
  },
  {
    ...CATEGORY.automation,
    scripts: [scrollToVeryEnd],
  },
  {
    ...CATEGORY.password,
    scripts: [
      addBadge(passwordGenerator, BADGES.hot),
      addBadge(search_sharedAccount, BADGES.hot),
      viewHiddenPassword,
    ],
  },
  {
    ...CATEGORY.unlock,
    scripts: [
      addBadge(removeCookies, BADGES.hot),
      enableTextSelection,
      reEnableContextMenu,
    ],
  },
  {
    ...CATEGORY.webUI,
    scripts: [
      addBadge(toggleEditPage, BADGES.hot),
      addBadge(performanceAnalyzer, BADGES.new, BADGES.unstable),
      createTitle("--- Remove ---", "--- Xoá ---"),
      removeColours,
      removeStylesheet,
      removeImages,
      removeBloat,
      createTitle("--- Table ---", "--- Table ---"),
      table_addSortTable,
      table_addNumberColumn,
      table_swapRowAndColumn,
      createTitle("--- More ---", "--- Khác ---"),
      internalOrExternalLink,
      getWindowSize,
      letItSnow,
    ],
  },
  {
    ...CATEGORY.more,
    scripts: [
      addBadge(shortenURL, BADGES.hot),
      listAllImagesInWeb,
      viewScriptsUsed,
      viewStylesUsed,
      viewPartialSource,
      runStatJs,
    ],
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
    ],
  },
];

console.log(tabs);

export { tabs };
