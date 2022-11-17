import { addBadge, BADGES } from "../popup/helpers/badge.js";

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
import passwordFieldToggle from "./passwordFieldToggle.js";
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
import similarWeb from "./similarWeb.js";
import search_totalIndexedPages from "./search_totalIndexedPages.js";
import whatWebsiteStack from "./whatWebsiteStack.js";
import youtube_downloadVideo from "./youtube_downloadVideo.js";
import search_paperWhere from "./search_paperWhere.js";
import viewCookies from "./viewCookies.js";
import download_image from "./download_image.js";
import viewAllLinks from "./viewAllLinks.js";
import googleCache from "./googleCache.js";
import githubdev from "./githubdev.js";
import scrollByDrag from "./scrollByDrag.js";
import insta_enableDownloadImage from "./insta_enableDownloadImage.js";
import youtube_viewDislikes from "./youtube_viewDislikes.js";
import downDetector from "./downDetector.js";
import fb_getTokenFfb from "./fb_getTokenFfb.js";
import youtube_popupPlayer from "./youtube_popupPlayer.js";
import googleShortcuts from "./googleShortcuts.js";
import google_downloadDriveVideo from "./google_downloadDriveVideo.js";
import paywallKiller from "./paywallKiller.js";
import archiveToday from "./archiveToday.js";
import download_video2 from "./download_video2.js";
import whois from "./whois.js";
import viewWebMetaInfo from "./viewWebMetaInfo.js";
import getAllEmailsInWeb from "./getAllEmailsInWeb.js";
import showTheImages from "./showTheImages.js";
import showHiddenFields from "./showHiddenFields.js";
import cssSelectorViewer from "./cssSelectorViewer.js";
import youtube_nonstop from "./youtube_nonstop.js";
import insta_reloaded from "./insta_reloaded.js";
import zingmp3_downloadMusic from "./zingmp3_downloadMusic.js";
import download_audio from "./download_audio.js";
import nhaccuatui_downloader from "./nhaccuatui_downloader.js";

// inject badges
const allScripts = {
  fb_toggleLight: addBadge(fb_toggleLight, BADGES.new),
  fb_getTokenBusiness: addBadge(fb_getTokenBusiness, BADGES.hot),
  fb_getTokenFacebook: addBadge(fb_getTokenFacebook, BADGES.hot),
  fb_getTokenMFacebook,
  fb_getUid: addBadge(fb_getUid, BADGES.hot),
  fb_getPageId: addBadge(fb_getPageId, BADGES.hot),
  fb_getGroupId: addBadge(fb_getGroupId, BADGES.hot),
  fb_getAlbumId: addBadge(fb_getAlbumId, BADGES.hot),
  fb_getTimelineAlbumId,
  fb_getAllVideoId,
  fb_getAllAlbumId,
  fb_getUidFromUrl: addBadge(fb_getUidFromUrl, BADGES.hot),
  fb_getAllUidFromFbSearch,
  fb_getAllUidFromFriendsPage,
  fb_getAllUidOfGroupMembers: addBadge(fb_getAllUidOfGroupMembers, BADGES.hot),
  download_video: addBadge(download_video, BADGES.beta),
  fb_getAvatarFromUid,
  fb_downloadCurrentVideo,
  fb_downloadAlbumMedia,
  insta_getToken: addBadge(insta_getToken, BADGES.hot),
  insta_getUid,
  insta_getAllUserMedia,
  insta_getAllImagesInNewFeed: addBadge(
    insta_getAllImagesInNewFeed,
    BADGES.beta
  ),
  insta_enableDownloadImage: addBadge(insta_enableDownloadImage, BADGES.hot),
  insta_getAllImagesInUserProfile,
  pictureInPicture: addBadge(pictureInPicture, BADGES.hot),
  youtube_toggleLight,
  github_goToFirstCommit: addBadge(github_goToFirstCommit, BADGES.hot),
  github1s,
  doutube_enableDownloadVideo,
  doutube_downloadWatchingVideo,
  doutube_downloadWatchingStory,
  doutube_getAllVideoInUserProfile,
  darkModePDF: addBadge(darkModePDF, BADGES.hot),
  webToPDF,
  webToQRCode,
  textToQRCode: addBadge(textToQRCode, BADGES.hot),
  scrollToVeryEnd,
  passwordGenerator: addBadge(passwordGenerator, BADGES.hot),
  search_sharedAccount: addBadge(search_sharedAccount, BADGES.hot),
  passwordFieldToggle,
  checkWebDie,
  removeCookies,
  enableTextSelection,
  reEnableContextMenu,
  table_addSortTable,
  table_addNumberColumn,
  table_swapRowAndColumn,
  toggleEditPage: addBadge(toggleEditPage, BADGES.hot),
  whatFont: addBadge(whatFont, BADGES.hot),
  performanceAnalyzer: addBadge(performanceAnalyzer, BADGES.hot),
  removeColours,
  removeStylesheet,
  removeImages,
  removeBloat,
  internalOrExternalLink,
  getWindowSize,
  letItSnow,
  shortenURL: addBadge(shortenURL, BADGES.hot),
  listAllImagesInWeb,
  viewScriptsUsed,
  viewStylesUsed,
  viewPartialSource,
  openWaybackUrl,
  runStatJs,
  search_googleSite,
  similarWeb: addBadge(similarWeb, BADGES.hot),
  search_totalIndexedPages,
  whatWebsiteStack: addBadge(whatWebsiteStack, BADGES.hot),
  youtube_downloadVideo: addBadge(youtube_downloadVideo, BADGES.hot),
  search_paperWhere,
  viewCookies,
  download_image: addBadge(download_image, BADGES.hot),
  viewAllLinks,
  googleCache: addBadge(googleCache, BADGES.new),
  githubdev: addBadge(githubdev, BADGES.hot),
  scrollByDrag,
  youtube_viewDislikes: addBadge(youtube_viewDislikes, BADGES.hot),
  downDetector: addBadge(downDetector, BADGES.new),
  fb_getTokenFfb: addBadge(fb_getTokenFfb, BADGES.new),
  youtube_popupPlayer: addBadge(youtube_popupPlayer, BADGES.beta),
  googleShortcuts: addBadge(googleShortcuts, BADGES.new),
  google_downloadDriveVideo: addBadge(google_downloadDriveVideo, BADGES.beta),
  paywallKiller: addBadge(paywallKiller, BADGES.beta),
  archiveToday: addBadge(archiveToday, BADGES.new),
  download_video2: addBadge(download_video2, BADGES.new),
  whois: addBadge(whois, BADGES.new),
  viewWebMetaInfo: addBadge(viewWebMetaInfo, BADGES.new),
  getAllEmailsInWeb: addBadge(getAllEmailsInWeb, BADGES.new),
  showTheImages: addBadge(showTheImages, BADGES.new),
  showHiddenFields: addBadge(showHiddenFields, BADGES.new),
  cssSelectorViewer: addBadge(cssSelectorViewer, BADGES.new),
  youtube_nonstop: addBadge(youtube_nonstop, BADGES.new),
  insta_reloaded: addBadge(insta_reloaded, BADGES.hot),
  zingmp3_downloadMusic: addBadge(zingmp3_downloadMusic, BADGES.new),
  download_audio: addBadge(download_audio, BADGES.new),
  nhaccuatui_downloader: addBadge(nhaccuatui_downloader, BADGES.new),
};

// inject id to all scripts
Object.entries(allScripts).forEach(([variableName, script]) => {
  script.id = variableName;
});

export { allScripts };
