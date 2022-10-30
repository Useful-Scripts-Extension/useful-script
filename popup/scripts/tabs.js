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

const tabs = [
  {
    ...CATEGORY.facebook,
    scripts: [
      { name: { en: "--- UI ---", vi: "--- Giao diện ---" } },
      toggleLightFB,
      { name: { en: "--- Access Token ---", vi: "--- Access Token ---" } },
      getTokenBusinessFB,
      getTokenFacebook,
      getTokenMFacebook,
      { name: { en: "--- Get ID ---", vi: "--- Lấy ID ---" } },
      getUidFB,
      getPageIdFB,
      getGroupIdFB,
      getAlbumIdFB,
      getTimelineAlbumIdFB,
      getAllVideoIdFB,
      getAllAlbumIdFB,
      getUidFromUrlFB,
      getAllUidFromFBSearch,
      getAllUidFromFriendsPageFB,
      getAllUidOfGroupMembersFB,
      { name: { en: "--- Download ---", vi: "--- Tải xuống ---" } },
      getAvatarFromUidFB,
      downloadCurrentVideoFB,
      downloadAlbumMediaFB,
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
    scripts: [bypassYoutube18, toggleLightYoutube],
  },
  {
    ...CATEGORY.github,
    scripts: [goToFirstCommit, github1s],
  },
  {
    ...CATEGORY.doutube,
    scripts: [
      enableDownloadVideoDoutube,
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
    scripts: [webToQRCode, textToQRCode],
  },
  {
    ...CATEGORY.automation,
    scripts: [scrollToVeryEndAuto],
  },
  {
    ...CATEGORY.password,
    scripts: [passwordGenerator, bugMeNotPassword, viewHiddenPassword],
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
      shortenURL,
      listAllImagesInWeb,
      viewScriptsUsed,
      viewStylesUsed,
      viewPartialSource,
      openWaybackUrl,
      runStatJs,
    ],
  },
];

console.log(tabs);

export { tabs };
