import { addBadge, BADGES } from "../popup/badge.js";

import fb_toggleLight from "./fb_toggleLight.js";
import fb_getTokenBusiness from "./fb_getTokenBusiness.js";
import fb_getTokenFacebook from "./fb_getTokenFacebook.js";
import fb_getTokenMFacebook from "./fb_getTokenMFacebook.js";
import fb_getUid from "./fb_getUid.js";
import fb_getPageId from "./fb_getPageId.js";
import fb_getGroupId from "./fb_getGroupId.js";
import fb_getAlbumId from "./fb_getAlbumId.js";
import fb_getTimelineAlbumId from "./fb_getTimelineAlbumId.js";
import fb_getAllVideoId from "./fb_getAllVideoId.js";
import fb_getAllAlbumId from "./fb_getAllAlbumId.js";
import fb_getUidFromUrl from "./fb_getUidFromUrl.js";
import fb_getAllUidFromFbSearch from "./fb_getAllUidFromFbSearch.js";
import fb_getAllUidFromFriendsPage from "./fb_getAllUidFromFriendsPage.js";
import fb_getAllUidOfGroupMembers from "./fb_getAllUidOfGroupMembers.js";
import download_video from "./download_video.js";
import fb_getAvatarFromUid from "./fb_getAvatarFromUid.js";
import fb_downloadCurrentVideo from "./fb_downloadCurrentVideo.js";
import fb_downloadAlbumMedia from "./fb_downloadAlbumMedia.js";
import insta_getToken from "./insta_getToken.js";
import insta_getUid from "./insta_getUid.js";
import insta_getAllUserMedia from "./insta_getAllUserMedia.js";
import insta_getAllImagesInNewFeed from "./insta_getAllImagesInNewFeed.js";
import insta_getAllImagesInUserProfile from "./insta_getAllImagesInUserProfile.js";
import pictureInPicture from "./pictureInPicture.js";
import youtube_toggleLight from "./youtube_toggleLight.js";
import youtube_bypass18 from "./youtube_bypass18.js";
import github_goToFirstCommit from "./github_goToFirstCommit.js";
import github1s from "./github1s.js";
import doutube_enableDownloadVideo from "./doutube_enableDownloadVideo.js";
import doutube_downloadWatchingVideo from "./doutube_downloadWatchingVideo.js";
import doutube_downloadWatchingStory from "./doutube_downloadWatchingStory.js";
import doutube_getAllVideoInUserProfile from "./doutube_getAllVideoInUserProfile.js";
import darkModePDF from "./darkModePDF.js";
import webToPDF from "./webToPDF.js";
import webToQRCode from "./webToQRCode.js";
import textToQRCode from "./textToQRCode.js";
import scrollToVeryEnd from "./scrollToVeryEnd.js";
import passwordGenerator from "./passwordGenerator.js";
import search_sharedAccount from "./search_sharedAccount.js";
import viewHiddenPassword from "./viewHiddenPassword.js";
import checkWebDie from "./checkWebDie.js";
import removeCookies from "./removeCookies.js";
import enableTextSelection from "./enableTextSelection.js";
import reEnableContextMenu from "./reEnableContextMenu.js";
import table_addSortTable from "./table_addSortTable.js";
import table_addNumberColumn from "./table_addNumberColumn.js";
import table_swapRowAndColumn from "./table_swapRowAndColumn.js";
import toggleEditPage from "./toggleEditPage.js";
import whatFont from "./whatFont.js";
import performanceAnalyzer from "./performanceAnalyzer.js";
import removeColours from "./removeColours.js";
import removeStylesheet from "./removeStylesheet.js";
import removeImages from "./removeImages.js";
import removeBloat from "./removeBloat.js";
import internalOrExternalLink from "./internalOrExternalLink.js";
import getWindowSize from "./getWindowSize.js";
import letItSnow from "./letItSnow.js";
import shortenURL from "./shortenURL.js";
import listAllImagesInWeb from "./listAllImagesInWeb.js";
import viewScriptsUsed from "./viewScriptsUsed.js";
import viewStylesUsed from "./viewStylesUsed.js";
import viewPartialSource from "./viewPartialSource.js";
import openWaybackUrl from "./openWaybackUrl.js";
import runStatJs from "./runStatJs.js";
import search_googleSite from "./search_googleSite.js";
import viewWebsiteAnalyticsOnline from "./viewWebsiteAnalyticsOnline.js";
import search_totalIndexedPages from "./search_totalIndexedPages.js";
import whatWebsiteStack from "./whatWebsiteStack.js";
import youtube_downloadVideo from "./youtube_downloadVideo.js";
import search_paperWhere from "./search_paperWhere.js";
import viewCookies from "./viewCookies.js";
import download_image from "./download_image.js";

// inject badges
const allScripts = {
  fb_toggleLight,
  fb_getTokenBusiness,
  fb_getTokenFacebook,
  fb_getTokenMFacebook,
  fb_getUid,
  fb_getPageId,
  fb_getGroupId,
  fb_getAlbumId,
  fb_getTimelineAlbumId,
  fb_getAllVideoId,
  fb_getAllAlbumId,
  fb_getUidFromUrl,
  fb_getAllUidFromFbSearch,
  fb_getAllUidFromFriendsPage,
  fb_getAllUidOfGroupMembers,
  download_video,
  fb_getAvatarFromUid,
  fb_downloadCurrentVideo,
  fb_downloadAlbumMedia,
  insta_getToken,
  insta_getUid,
  insta_getAllUserMedia,
  insta_getAllImagesInNewFeed,
  insta_getAllImagesInUserProfile,
  pictureInPicture,
  youtube_toggleLight,
  youtube_bypass18,
  github_goToFirstCommit,
  github1s,
  doutube_enableDownloadVideo,
  doutube_downloadWatchingVideo,
  doutube_downloadWatchingStory,
  doutube_getAllVideoInUserProfile,
  darkModePDF,
  webToPDF,
  webToQRCode,
  textToQRCode,
  scrollToVeryEnd,
  passwordGenerator,
  search_sharedAccount: addBadge(search_sharedAccount, BADGES.hot),
  viewHiddenPassword,
  checkWebDie,
  removeCookies,
  enableTextSelection,
  reEnableContextMenu,
  table_addSortTable,
  table_addNumberColumn,
  table_swapRowAndColumn,
  toggleEditPage,
  whatFont: addBadge(whatFont, BADGES.hot),
  performanceAnalyzer,
  removeColours,
  removeStylesheet,
  removeImages,
  removeBloat,
  internalOrExternalLink,
  getWindowSize,
  letItSnow,
  shortenURL,
  listAllImagesInWeb,
  viewScriptsUsed,
  viewStylesUsed,
  viewPartialSource,
  openWaybackUrl,
  runStatJs,
  search_googleSite,
  viewWebsiteAnalyticsOnline,
  search_totalIndexedPages,
  whatWebsiteStack: addBadge(whatWebsiteStack, BADGES.new),
  youtube_downloadVideo,
  search_paperWhere: addBadge(search_paperWhere, BADGES.new),
  viewCookies,
  download_image,
};

// inject id to all scripts
Object.entries(allScripts).forEach(([variableName, script]) => {
  script.id = variableName;
});

export { allScripts };
