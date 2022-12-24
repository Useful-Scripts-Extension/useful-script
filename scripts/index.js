import { addBadge, BADGES } from "./helpers/badge.js";

import _test from "./_test.js";
import fb_toggleLight from "./fb_toggleLight.js";
import fb_getTokenBusinessStudio from "./fb_getTokenBusinessStudio.js";
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
import fb_getAvatarFromUid from "./fb_getAvatarFromUid.js";
import fb_downloadAlbumMedia from "./fb_downloadAlbumMedia.js";
import insta_getToken from "./insta_getToken.js";
import insta_getUserInfo from "./insta_getUserInfo.js";
import insta_getAllUserMedia from "./insta_getAllUserMedia.js";
import insta_getAllImagesInNewFeed from "./insta_getAllImagesInNewFeed.js";
import insta_getAllImagesInUserProfile from "./insta_getAllImagesInUserProfile.js";
import pictureInPicture from "./pictureInPicture.js";
import youtube_toggleLight from "./youtube_toggleLight.js";
import github_goToAnyCommit from "./github_goToAnyCommit.js";
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
import simpleAllowCopy from "./simpleAllowCopy.js";
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
import youtube_viewDislikes from "./youtube_viewDislikes.js";
import downDetector from "./downDetector.js";
import fb_getTokenFfb from "./fb_getTokenFfb.js";
import googleShortcuts from "./googleShortcuts.js";
import archiveToday from "./archiveToday.js";
import whois from "./whois.js";
import viewWebMetaInfo from "./viewWebMetaInfo.js";
import getAllEmailsInWeb from "./getAllEmailsInWeb.js";
import showTheImages from "./showTheImages.js";
import showHiddenFields from "./showHiddenFields.js";
import cssSelectorViewer from "./cssSelectorViewer.js";
import youtube_nonstop from "./youtube_nonstop.js";
import zingmp3_downloadMusic from "./zingmp3_downloadMusic.js";
import showTheAudios from "./showTheAudios.js";
import nhaccuatui_downloader from "./nhaccuatui_downloader.js";
import zingmp3_oldLayout from "./zingmp3_oldLayout.js";
import fb_getTokenBussinessLocation from "./fb_getTokenBussinessLocation.js";
import injectScriptToWebsite from "./injectScriptToWebsite.js";
import getLinkLuanxt from "./getLinkLuanxt.js";
import getFavicon from "./getFavicon.js";
import fb_checkToken from "./fb_checkToken.js";
import fb_getTokenCampaigns from "./fb_getTokenCampaigns.js";
import unshorten from "./unshorten.js";
import transfer_sh from "./transfer_sh.js";
import jsonformatter from "./jsonformatter.js";
import screenshotFullPage from "./screenshotFullPage.js";
import visualEvent from "./visualEvent.js";
import fb_videoDownloader from "./fb_videoDownloader.js";
import viewBrowserInfo from "./viewBrowserInfo.js";
import tiktok_snaptikApp from "./tiktok_snaptikApp.js";
import douyin_downloadWachingVideo from "./douyin_downloadWachingVideo.js";
import instantgram from "./instantgram.js";
import douyin_downloadAllVideoUser from "./douyin_downloadAllVideoUser.js";
import showTheVideos from "./showTheVideos.js";
import fb_storySaver from "./fb_storySaver.js";
import insta_storySaver from "./insta_storySaver.js";
import whatApp_storySaver from "./whatApp_storySaver.js";
import send_shareFiles from "./send_shareFiles.js";
import fb_downloadCommentVideo from "./fb_downloadCommentVideo.js";
import scribd_downloadDocuments from "./scribd_downloadDocuments.js";
import fb_toggleNewFeed from "./fb_toggleNewFeed.js";
// import fb_storyInfo from "./fb_storyInfo.js";
import envato_bypassPreview from "./envato_bypassPreview.js";
import shopee_topVariation from "./shopee_topVariation.js";
import donotBlockMe from "./donotBlockMe.js";
import ggdrive_downloadVideo from "./ggdrive_downloadVideo.js";
import tiktok_snaptikVideo from "./tiktok_snaptikVideo.js";
import google_downloadAllYourData from "./google_downloadAllYourData.js";
import tiktok_downloadWatchingVideo from "./tiktok_downloadWatchingVideo.js";
import tiktok_downloadUserVideos from "./tiktok_downloadUserVideos.js";
import tiktok_downloadVideo from "./tiktok_downloadVideo.js";
import ggDrive_downloadAllVideosInFolder from "./ggDrive_downloadAllVideosInFolder.js";
import fb_downloadWatchingVideo from "./fb_downloadWatchingVideo.js";
import studocu_downs from "./studocu_downs.js";
import search_userscript from "./search_userscript.js";
import search_musicTreding from "./search_musicTreding.js";
import vimeo_downloader from "./vimeo_downloader.js";
import savevideo_me from "./savevideo_me.js";
import bookmark_exporter from "./bookmark_exporter.js";
import search_hopamchuan from "./search_hopamchuan.js";
import ggdrive_generateDirectLink from "./ggdrive_generateDirectLink.js";
import douyin_downloadVideo from "./douyin_downloadVideo.js";
import freesound_downloadAudio from "./freesound_downloadAudio.js";
import soundcloud_downloadMusic from "./soundcloud_downloadMusic.js";
import fastDoc from "./fastDoc.js";
import smartPDF from "./smartPDF.js";
import studocu_dl from "./studocu_dl.js";
import pdfstuffs from "./pdfstuffs.js";
import dino_hack from "./dino_hack.js";
import google_mirror from "./google_mirror.js";
import fb_openSaved from "./fb_openSaved.js";
import fb_openMemories from "./fb_openMemories.js";
import fb_openAdsActivities from "./fb_openAdsActivities.js";
import fb_exportSaved from "./fb_exportSaved.js";
import studyphim_unlimited from "./studyphim_unlimited.js";
import shopee_totalSpendMoney from "./shopee_totalSpendMoney.js";
import tiki_totalSpendMoney from "./tiki_totalSpendMoney.js";
import fb_invisible_message from "./fb_invisible_message.js";
import insta_injectDownloadBtn from "./insta_injectDownloadBtn.js";
import studocu_bypassPreview from "./studocu_bypassPreview.js";
import fb_revealDeletedMessages from "./fb_revealDeletedMessages.js";
import fb_whoIsTyping from "./fb_whoIsTyping.js";
import detect_zeroWidthCharacters from "./detect_zeroWidthCharacters.js";
import fb_moreReactionStory from "./fb_moreReactionStory.js";
import changeAudioOutput from "./changeAudioOutput.js";
import docDownloader from "./docDownloader.js";
import scribd_bypassPreview from "./scribd_bypassPreview.js";

// inject badges
const allScripts = {
  _test,
  fb_toggleLight: fb_toggleLight,
  fb_getTokenBusinessStudio: addBadge(fb_getTokenBusinessStudio, BADGES.hot),
  fb_getTokenFacebook: addBadge(fb_getTokenFacebook, BADGES.hot),
  fb_getTokenMFacebook,
  fb_getUid: addBadge(fb_getUid, BADGES.hot),
  fb_getPageId: addBadge(fb_getPageId, BADGES.hot),
  fb_getGroupId: addBadge(fb_getGroupId, BADGES.hot),
  fb_getAlbumId: addBadge(fb_getAlbumId, BADGES.hot),
  fb_getTimelineAlbumId: addBadge(fb_getTimelineAlbumId, BADGES.hot),
  fb_getAllVideoId,
  fb_getAllAlbumId,
  fb_getUidFromUrl: addBadge(fb_getUidFromUrl, BADGES.hot),
  fb_getAllUidFromFbSearch,
  fb_getAllUidFromFriendsPage,
  fb_getAllUidOfGroupMembers: addBadge(fb_getAllUidOfGroupMembers, BADGES.hot),
  fb_getAvatarFromUid,
  fb_downloadAlbumMedia,
  insta_getToken: addBadge(insta_getToken, BADGES.hot),
  insta_getUserInfo: addBadge(insta_getUserInfo, BADGES.new),
  insta_getAllUserMedia,
  insta_getAllImagesInNewFeed: addBadge(
    insta_getAllImagesInNewFeed,
    BADGES.beta
  ),
  insta_getAllImagesInUserProfile,
  pictureInPicture: addBadge(pictureInPicture, BADGES.hot),
  youtube_toggleLight,
  github_goToAnyCommit: addBadge(github_goToAnyCommit, BADGES.hot),
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
  simpleAllowCopy: addBadge(simpleAllowCopy, BADGES.hot),
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
  googleCache: googleCache,
  githubdev: addBadge(githubdev, BADGES.hot),
  scrollByDrag,
  youtube_viewDislikes: addBadge(youtube_viewDislikes, BADGES.hot),
  downDetector: downDetector,
  fb_getTokenFfb: addBadge(fb_getTokenFfb, BADGES.new),
  googleShortcuts: addBadge(googleShortcuts, BADGES.new),
  archiveToday: archiveToday,
  whois: whois,
  viewWebMetaInfo: viewWebMetaInfo,
  getAllEmailsInWeb: addBadge(getAllEmailsInWeb, BADGES.new),
  showTheImages: addBadge(showTheImages, BADGES.new),
  showHiddenFields: showHiddenFields,
  cssSelectorViewer: cssSelectorViewer,
  youtube_nonstop: addBadge(youtube_nonstop, BADGES.new),
  zingmp3_downloadMusic: addBadge(zingmp3_downloadMusic, BADGES.new),
  showTheAudios: showTheAudios,
  nhaccuatui_downloader: addBadge(nhaccuatui_downloader, BADGES.new),
  zingmp3_oldLayout: addBadge(zingmp3_oldLayout, BADGES.new),
  fb_getTokenBussinessLocation: addBadge(
    fb_getTokenBussinessLocation,
    BADGES.new
  ),
  injectScriptToWebsite: addBadge(injectScriptToWebsite, BADGES.new),
  getLinkLuanxt: addBadge(getLinkLuanxt, BADGES.new),
  getFavicon: addBadge(getFavicon, BADGES.new),
  fb_checkToken: addBadge(fb_checkToken, BADGES.new),
  fb_getTokenCampaigns: addBadge(fb_getTokenCampaigns, BADGES.new),
  unshorten: addBadge(unshorten, BADGES.hot),
  transfer_sh: addBadge(transfer_sh, BADGES.new),
  jsonformatter: addBadge(jsonformatter, BADGES.new),
  screenshotFullPage: addBadge(screenshotFullPage, BADGES.new),
  visualEvent: addBadge(visualEvent, BADGES.new),
  fb_videoDownloader: addBadge(fb_videoDownloader, BADGES.new),
  viewBrowserInfo: addBadge(viewBrowserInfo, BADGES.new),
  tiktok_snaptikApp: addBadge(tiktok_snaptikApp, BADGES.new),
  douyin_downloadWachingVideo: addBadge(
    douyin_downloadWachingVideo,
    BADGES.new
  ),
  instantgram: addBadge(instantgram, BADGES.new),
  douyin_downloadAllVideoUser: addBadge(
    douyin_downloadAllVideoUser,
    BADGES.new
  ),
  showTheVideos: addBadge(showTheVideos, BADGES.new),
  fb_storySaver: addBadge(fb_storySaver, BADGES.new),
  insta_storySaver: addBadge(insta_storySaver, BADGES.new),
  whatApp_storySaver: addBadge(whatApp_storySaver, BADGES.new),
  send_shareFiles: addBadge(send_shareFiles, BADGES.new),
  fb_downloadCommentVideo: addBadge(fb_downloadCommentVideo, BADGES.new),
  scribd_downloadDocuments: addBadge(scribd_downloadDocuments, BADGES.new),
  fb_toggleNewFeed: addBadge(fb_toggleNewFeed, BADGES.new),
  // fb_storyInfo: addBadge(fb_storyInfo, BADGES.beta),
  envato_bypassPreview: addBadge(envato_bypassPreview, BADGES.new),
  shopee_topVariation: addBadge(shopee_topVariation, BADGES.hot),
  donotBlockMe: addBadge(donotBlockMe, BADGES.new),
  ggdrive_downloadVideo: addBadge(ggdrive_downloadVideo, BADGES.new),
  tiktok_snaptikVideo: addBadge(tiktok_snaptikVideo, BADGES.new),
  google_downloadAllYourData: addBadge(google_downloadAllYourData, BADGES.new),
  tiktok_downloadWatchingVideo: addBadge(
    tiktok_downloadWatchingVideo,
    BADGES.new
  ),
  tiktok_downloadUserVideos: addBadge(tiktok_downloadUserVideos, BADGES.beta),
  tiktok_downloadVideo: addBadge(tiktok_downloadVideo, BADGES.new),
  ggDrive_downloadAllVideosInFolder: addBadge(
    ggDrive_downloadAllVideosInFolder,
    BADGES.new
  ),
  fb_downloadWatchingVideo: addBadge(fb_downloadWatchingVideo, BADGES.new),
  studocu_downs: addBadge(studocu_downs, BADGES.new),
  search_userscript: addBadge(search_userscript, BADGES.new),
  search_musicTreding: addBadge(search_musicTreding, BADGES.new),
  vimeo_downloader: addBadge(vimeo_downloader, BADGES.new),
  savevideo_me: addBadge(savevideo_me, BADGES.new),
  bookmark_exporter: addBadge(bookmark_exporter, BADGES.beta),
  search_hopamchuan: addBadge(search_hopamchuan, BADGES.new),
  ggdrive_generateDirectLink: addBadge(ggdrive_generateDirectLink, BADGES.new),
  douyin_downloadVideo: addBadge(douyin_downloadVideo, BADGES.new),
  freesound_downloadAudio: addBadge(freesound_downloadAudio, BADGES.new),
  soundcloud_downloadMusic: addBadge(soundcloud_downloadMusic, BADGES.new),
  fastDoc: addBadge(fastDoc, BADGES.new),
  smartPDF: addBadge(smartPDF, BADGES.new),
  studocu_dl: addBadge(studocu_dl, BADGES.new),
  pdfstuffs: addBadge(pdfstuffs, BADGES.new),
  dino_hack: addBadge(dino_hack, BADGES.new),
  google_mirror: addBadge(google_mirror, BADGES.new),
  fb_openSaved: addBadge(fb_openSaved, BADGES.new),
  fb_openMemories: addBadge(fb_openMemories, BADGES.new),
  fb_openAdsActivities: addBadge(fb_openAdsActivities, BADGES.new),
  fb_exportSaved: addBadge(fb_exportSaved, BADGES.beta),
  studyphim_unlimited: addBadge(studyphim_unlimited, BADGES.new),
  shopee_totalSpendMoney: addBadge(shopee_totalSpendMoney, BADGES.new),
  tiki_totalSpendMoney: addBadge(tiki_totalSpendMoney, BADGES.beta),
  fb_invisible_message: addBadge(fb_invisible_message, BADGES.new),
  insta_injectDownloadBtn: addBadge(insta_injectDownloadBtn, BADGES.new),
  studocu_bypassPreview: addBadge(studocu_bypassPreview, BADGES.new),
  fb_revealDeletedMessages: addBadge(fb_revealDeletedMessages, BADGES.hot),
  fb_whoIsTyping: addBadge(fb_whoIsTyping, BADGES.new),
  detect_zeroWidthCharacters: addBadge(detect_zeroWidthCharacters, BADGES.new),
  fb_moreReactionStory: addBadge(fb_moreReactionStory, BADGES.new),
  changeAudioOutput: addBadge(changeAudioOutput, BADGES.new),
  docDownloader: addBadge(docDownloader, BADGES.new),
  scribd_bypassPreview: addBadge(scribd_bypassPreview, BADGES.new),
};

// alert(Object.keys(allScripts).length);

// inject id to all scripts
Object.entries(allScripts).forEach(([variableName, script]) => {
  script.id = variableName;
});

export { allScripts };
