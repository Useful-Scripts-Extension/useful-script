import { CATEGORY } from "./category.js";
import toggleLightFB from "./facebook/toggleLight.js";
import getTokenBusinessFB from "./facebook/getTokenBusiness.js";
import getTokenFacebook from "./facebook/getTokenFacebook.js";
import getTokenMFacebook from "./facebook/getTokenMFacebook.js";
import getUidFB from "./facebook/getUid.js";
import getPageIdFB from "./facebook/getPageId.js";
import getGroupIdFB from "./facebook/getGroupId.js";
import getAlbumIdFB from "./facebook/getAlbumId.js";
import getTimelineAlbumIdFB from "./facebook/getTimelineAlbumId.js";
import getAllVideoIdFB from "./facebook/getAllVideoId.js";
import getAllAlbumIdFB from "./facebook/getAllAlbumId.js";
import getUidFromUrlFB from "./facebook/getUidFromUrl.js";
import getAllUidFromFBSearch from "./facebook/getAllUidFromFBSearch.js";
import getAllUidFromFriendsPageFB from "./facebook/getAllUidFromFriendsPage.js";
import getAllUidOfGroupMembersFB from "./facebook/getAllUidOfGroupMembers.js";
import getAvatarFromUidFB from "./facebook/getAvatarFromUid.js";
import downloadCurrentVideoFB from "./facebook/downloadCurrentVideo.js";
import downloadAlbumMediaFB from "./facebook/downloadAlbumMedia.js";
import getTokenInsta from "./instagram/getToken.js";
import getUidInsta from "./instagram/getUid.js";
import getAllUserMediaInsta from "./instagram/getAllUserMedia.js";
import getAllImagesInNewFeedInsta from "./instagram/getAllImagesInNewFeed.js";
import getAllImagesInUserProfileInsta from "./instagram/getAllImagesInUserProfile.js";
import pictureInPicture from "./youtube/pictureInPicture.js";
import bypassYoutube18 from "./youtube/bypassYoutube18.js";
import toggleLightYoutube from "./youtube/toggleLight.js";
import goToFirstCommit from "./github/goToFirstCommit.js";
import github1s from "./github/github1s.js";
import enableDownloadVideoDoutube from "./doutube/enableDownloadVideo.js";
import downloadWatchingStoryDoutube from "./doutube/downloadWatchingStory.js";
import downloadWatchingVideoDoutube from "./doutube/downloadWatchingVideo.js";
import getAllVideoInUserProfileDoutube from "./doutube/getAllVideoInUserProfile.js";
import darkModePDF from "./pdf/darkModePDF.js";
import webToPDF from "./pdf/webToPDF.js";
import webToQRCode from "./qrcode/webToQRCode.js";
import textToQRCode from "./qrcode/textToQRCode.js";
import scrollToVeryEndAuto from "./automation/scrollToVeryEnd.js";
import passwordGenerator from "./password/passwordGenerator.js";
import bugMeNotPassword from "./password/bugMeNot.js";
import viewHiddenPassword from "./password/viewHiddenPassword.js";
import enableTextSelection from "./unlock/enableTextSelection.js";
import reEnableContextMenu from "./unlock/reEnableContextMenu.js";
import removeCookies from "./unlock/removeCookies.js";
import checkWebDie from "./unlock/checkWebDie.js";
import addSortTable from "./table/addSortTable.js";
import addNumberColumn from "./table/addNumberColumn.js";
import swapRowAndColumn from "./table/swapRowAndColumn.js";
import toggleEditPage from "./webUI/toggleEditPage.js";
import whatFont from "./webUI/whatFont.js";
import removeColours from "./webUI/removeColours.js";
import removeStylesheet from "./webUI/removeStylesheet.js";
import removeImages from "./webUI/removeImages.js";
import removeBloat from "./webUI/removeBloat.js";
import internalOrExternalLink from "./webUI/internalOrExternalLink.js";
import getWindowSize from "./webUI/getWindowSize.js";
import letItSnow from "./webUI/letItSnow.js";
import shortenURL from "./more/shortenURL.js";
import listAllImagesInWeb from "./more/listAllImagesInWeb.js";
import viewScriptsUsed from "./more/viewScriptsUsed.js";
import viewStylesUsed from "./more/viewStylesUsed.js";
import viewPartialSource from "./more/viewPartialSource.js";
import openWaybackUrl from "./more/openWaybackUrl.js";
import runStatJs from "./more/runStatJs.js";

const addBadge = (
  script,
  { text, color = "#fff", backgroundColor = "#f00" }
) => ({
  ...script,
  badge: { text, color, backgroundColor },
});

const BADGES = {
  hot: {
    text: { en: "hot", vi: "hot" },
    color: "#fff",
    backgroundColor: "#f00",
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
};

const tabs = [
  {
    ...CATEGORY.facebook,
    scripts: [
      { name: { en: "--- UI ---", vi: "--- Giao diện ---" } },
      addBadge(toggleLightFB, BADGES.new),
      { name: { en: "--- Access Token ---", vi: "--- Access Token ---" } },
      getTokenBusinessFB,
      getTokenFacebook,
      getTokenMFacebook,
      { name: { en: "--- Get ID ---", vi: "--- Lấy ID ---" } },
      addBadge(getUidFB, BADGES.hot),
      addBadge(getPageIdFB, BADGES.hot),
      addBadge(getGroupIdFB, BADGES.hot),
      addBadge(getAlbumIdFB, BADGES.hot),
      addBadge(getTimelineAlbumIdFB, BADGES.hot),
      getAllVideoIdFB,
      getAllAlbumIdFB,
      addBadge(getUidFromUrlFB, BADGES.hot),
      getAllUidFromFBSearch,
      getAllUidFromFriendsPageFB,
      getAllUidOfGroupMembersFB,
      { name: { en: "--- Download ---", vi: "--- Tải xuống ---" } },
      getAvatarFromUidFB,
      addBadge(downloadCurrentVideoFB, BADGES.beta),
      addBadge(downloadAlbumMediaFB, BADGES.beta),
    ],
  },
  {
    ...CATEGORY.instagram,
    scripts: [
      getTokenInsta,
      getUidInsta,
      getAllUserMediaInsta,
      getAllImagesInNewFeedInsta,
      getAllImagesInUserProfileInsta,
    ],
  },
  {
    ...CATEGORY.youtube,
    scripts: [
      addBadge(pictureInPicture, BADGES.new),
      addBadge(toggleLightYoutube, BADGES.hot),
      bypassYoutube18,
    ],
  },
  {
    ...CATEGORY.github,
    scripts: [addBadge(goToFirstCommit, BADGES.hot), github1s],
  },
  {
    ...CATEGORY.doutube,
    scripts: [
      addBadge(enableDownloadVideoDoutube, BADGES.hot),
      downloadWatchingVideoDoutube,
      downloadWatchingStoryDoutube,
      getAllVideoInUserProfileDoutube,
    ],
  },
  {
    ...CATEGORY.pdf,
    scripts: [darkModePDF, webToPDF],
  },
  {
    ...CATEGORY.qrcode,
    scripts: [webToQRCode, addBadge(textToQRCode, BADGES.hot)],
  },
  {
    ...CATEGORY.automation,
    scripts: [scrollToVeryEndAuto],
  },
  {
    ...CATEGORY.password,
    scripts: [
      addBadge(passwordGenerator, BADGES.hot),
      bugMeNotPassword,
      viewHiddenPassword,
    ],
  },
  {
    ...CATEGORY.unlock,
    scripts: [
      checkWebDie,
      removeCookies,
      enableTextSelection,
      reEnableContextMenu,
    ],
  },
  {
    ...CATEGORY.table,
    scripts: [addSortTable, addNumberColumn, swapRowAndColumn],
  },
  {
    ...CATEGORY.webUI,
    scripts: [
      toggleEditPage,
      whatFont,
      removeColours,
      removeStylesheet,
      removeImages,
      removeBloat,
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
      openWaybackUrl,
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
    ],
  },
];

console.log(tabs);

export { tabs };
