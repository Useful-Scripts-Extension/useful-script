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
import fb_getAllAlbumIdFromCurrentWebsite from "./fb_getAllAlbumIdFromCurrentWebsite.js";
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
import doutube_downloadWatchingVideo from "./doutube_downloadWatchingVideo.js";
import doutube_getAllVideoInUserProfile from "./doutube_getAllVideoInUserProfile.js";
import darkModePDF from "./darkModePDF.js";
import webToPDF from "./webToPDF.js";
import webToQRCode from "./webToQRCode.js";
import textToQRCode from "./textToQRCode.js";
import scrollToVeryEnd from "./scrollToVeryEnd.js";
import passwordGenerator from "./passwordGenerator.js";
import search_sharedAccount from "./search_sharedAccount.js";
// import passwordFieldToggle from "./passwordFieldToggle.js";
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
import douyin_downloadWachingVideo from "./douyin_downloadWachingVideo.js";
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
import ggdrive_downloadVideo from "./ggdrive_downloadVideo.js";
import google_downloadAllYourData from "./google_downloadAllYourData.js";
import tiktok_downloadWatchingVideo from "./tiktok_downloadWatchingVideo.js";
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
// import fb_removeFbclid from "./fb_removeFbclid.js";
import fb_messengerHistory from "./fb_messengerHistory.js";
import fb_messengerCount from "./fb_messengerCount.js";
import fb_searchGroupForOther from "./fb_searchGroupForOther.js";
import fb_searchPageForOther from "./fb_searchPageForOther.js";
import fb_fetchAllAddedFriends from "./fb_fetchAllAddedFriends.js";
import bing_imageCreator from "./bing_imageCreator.js";
import stable_diffusion_baseten from "./stable_diffusion_baseten.js";
import stable_diffusion_demo from "./stable_diffusion_demo.js";
import dreamai from "./dreamai.js";
import playgroundai from "./playgroundai.js";
import pixaiart from "./pixaiart.js";
import skybox_blockadelabs from "./skybox_blockadelabs.js";
import huggingface from "./huggingface.js";
import tailieu_vn from "./tailieu_vn.js";
import fb_downloadWallMediaFromPosts from "./fb_downloadWallMediaFromPosts.js";
import fb_getAllAlbumInformation from "./fb_getAllAlbumInformation.js";
import textToSpeech from "./textToSpeech.js";
import shopee_totalSpendMoney_excel from "./shopee_totalSpendMoney_excel.js";
import download_watchingVideo from "./download_watchingVideo.js";
import tiktok_downloadVideo from "./tiktok_downloadVideo.js";
import tiktok_batchDownload from "./tiktok_batchDownload.js";
import douyin_batchDownload from "./douyin_batchDownload.js";
import medium_readFullArticle from "./medium_readFullArticle.js";
import viewSavedWifiPass from "./viewSavedWifiPass.js";
import leakCheck from "./leakCheck.js";
import whellOfNames_hack from "./whellOfNames_hack.js";
import saveAllVideo from "./saveAllVideo.js";
import fb_bulkDownload from "./fb_bulkDownload.js";
import fireship_vip from "./fireship_vip.js";
import vuiz_createLogo from "./vuiz_createLogo.js";
import vuiz_getLink from "./vuiz_getLink.js";
import ggdrive_downloadPdf from "./ggdrive_downloadPdf.js";
import ggdrive_downloadPresentation from "./ggdrive_downloadPresentation.js";
import youtube_localDownloader from "./youtube_localDownloader.js";

// inject badges
const allScripts = {
  _test: _test,
  fb_toggleLight: fb_toggleLight,
  fb_getTokenBusinessStudio: addBadge(fb_getTokenBusinessStudio, BADGES.hot),
  fb_getTokenFacebook: addBadge(fb_getTokenFacebook, BADGES.hot),
  fb_getTokenMFacebook,
  fb_getUid: addBadge(fb_getUid, BADGES.hot),
  fb_getPageId: addBadge(fb_getPageId, BADGES.hot),
  fb_getGroupId: addBadge(fb_getGroupId, BADGES.hot),
  fb_getAlbumId: addBadge(fb_getAlbumId, BADGES.hot),
  fb_getAllAlbumIdFromCurrentWebsite,
  fb_getAllAlbumInformation: addBadge(fb_getAllAlbumInformation, BADGES.new),
  fb_getUidFromUrl: addBadge(fb_getUidFromUrl, BADGES.hot),
  fb_getAllUidFromFbSearch,
  fb_getAllUidFromFriendsPage,
  fb_getAllUidOfGroupMembers: addBadge(fb_getAllUidOfGroupMembers, BADGES.hot),
  fb_getAvatarFromUid,
  fb_downloadAlbumMedia,
  insta_getToken: addBadge(insta_getToken, BADGES.hot),
  insta_getUserInfo: insta_getUserInfo,
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
  doutube_downloadWatchingVideo: addBadge(
    doutube_downloadWatchingVideo,
    BADGES.hot
  ),
  doutube_getAllVideoInUserProfile,
  darkModePDF: addBadge(darkModePDF, BADGES.hot),
  webToPDF,
  webToQRCode,
  textToQRCode: addBadge(textToQRCode, BADGES.hot),
  scrollToVeryEnd,
  passwordGenerator: addBadge(passwordGenerator, BADGES.hot),
  search_sharedAccount: addBadge(search_sharedAccount, BADGES.hot),
  // passwordFieldToggle,
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
  fb_getTokenFfb: fb_getTokenFfb,
  googleShortcuts: googleShortcuts,
  archiveToday: archiveToday,
  whois: whois,
  viewWebMetaInfo: viewWebMetaInfo,
  getAllEmailsInWeb: addBadge(getAllEmailsInWeb, BADGES.hot),
  showTheImages: showTheImages,
  showHiddenFields: showHiddenFields,
  cssSelectorViewer: cssSelectorViewer,
  youtube_nonstop: youtube_nonstop,
  zingmp3_downloadMusic: zingmp3_downloadMusic,
  showTheAudios: showTheAudios,
  nhaccuatui_downloader: nhaccuatui_downloader,
  fb_getTokenBussinessLocation: fb_getTokenBussinessLocation,
  injectScriptToWebsite: injectScriptToWebsite,
  getLinkLuanxt: addBadge(getLinkLuanxt, BADGES.hot),
  getFavicon: getFavicon,
  fb_checkToken: fb_checkToken,
  fb_getTokenCampaigns: fb_getTokenCampaigns,
  unshorten: addBadge(unshorten, BADGES.hot),
  transfer_sh: transfer_sh,
  jsonformatter: jsonformatter,
  screenshotFullPage: screenshotFullPage,
  visualEvent: visualEvent,
  fb_videoDownloader: addBadge(fb_videoDownloader, BADGES.new),
  viewBrowserInfo: viewBrowserInfo,
  douyin_downloadWachingVideo: addBadge(
    douyin_downloadWachingVideo,
    BADGES.new
  ),
  douyin_downloadAllVideoUser: addBadge(
    douyin_downloadAllVideoUser,
    BADGES.new
  ),
  showTheVideos: showTheVideos,
  fb_storySaver: addBadge(fb_storySaver, BADGES.new),
  insta_storySaver: insta_storySaver,
  whatApp_storySaver: whatApp_storySaver,
  send_shareFiles: send_shareFiles,
  fb_downloadCommentVideo: addBadge(fb_downloadCommentVideo, BADGES.hot),
  scribd_downloadDocuments: addBadge(scribd_downloadDocuments, BADGES.new),
  fb_toggleNewFeed: fb_toggleNewFeed,
  // fb_storyInfo: addBadge(fb_storyInfo, BADGES.beta),
  envato_bypassPreview: envato_bypassPreview,
  shopee_topVariation: addBadge(shopee_topVariation, BADGES.hot),
  ggdrive_downloadVideo: ggdrive_downloadVideo,
  google_downloadAllYourData: google_downloadAllYourData,
  tiktok_downloadWatchingVideo: addBadge(
    tiktok_downloadWatchingVideo,
    BADGES.hot
  ),
  ggDrive_downloadAllVideosInFolder: ggDrive_downloadAllVideosInFolder,
  fb_downloadWatchingVideo: addBadge(fb_downloadWatchingVideo, BADGES.hot),
  studocu_downs: studocu_downs,
  search_userscript: search_userscript,
  search_musicTreding: search_musicTreding,
  vimeo_downloader: vimeo_downloader,
  savevideo_me: savevideo_me,
  bookmark_exporter: addBadge(bookmark_exporter, BADGES.beta),
  search_hopamchuan: search_hopamchuan,
  ggdrive_generateDirectLink: ggdrive_generateDirectLink,
  soundcloud_downloadMusic: addBadge(soundcloud_downloadMusic, BADGES.new),
  fastDoc: fastDoc,
  smartPDF: smartPDF,
  studocu_dl: studocu_dl,
  pdfstuffs: pdfstuffs,
  dino_hack: dino_hack,
  google_mirror: google_mirror,
  fb_openSaved: addBadge(fb_openSaved, BADGES.hot),
  fb_openMemories: fb_openMemories,
  fb_openAdsActivities: fb_openAdsActivities,
  fb_exportSaved: addBadge(fb_exportSaved, BADGES.beta),
  studyphim_unlimited: studyphim_unlimited,
  shopee_totalSpendMoney: addBadge(shopee_totalSpendMoney, BADGES.hot),
  tiki_totalSpendMoney: addBadge(tiki_totalSpendMoney, BADGES.beta),
  fb_invisible_message: fb_invisible_message,
  insta_injectDownloadBtn: insta_injectDownloadBtn,
  studocu_bypassPreview: studocu_bypassPreview,
  fb_revealDeletedMessages: addBadge(fb_revealDeletedMessages, BADGES.hot),
  fb_whoIsTyping: fb_whoIsTyping,
  detect_zeroWidthCharacters: detect_zeroWidthCharacters,
  fb_moreReactionStory: fb_moreReactionStory,
  changeAudioOutput: changeAudioOutput,
  docDownloader: docDownloader,
  scribd_bypassPreview: scribd_bypassPreview,
  // fb_removeFbclid: fb_removeFbclid,
  fb_messengerHistory: addBadge(fb_messengerHistory, BADGES.beta),
  fb_messengerCount: addBadge(fb_messengerCount, BADGES.hot),
  fb_searchGroupForOther: addBadge(fb_searchGroupForOther, BADGES.hot),
  fb_searchPageForOther: addBadge(fb_searchPageForOther, BADGES.hot),
  fb_fetchAllAddedFriends: fb_fetchAllAddedFriends,
  bing_imageCreator: bing_imageCreator,
  stable_diffusion_baseten: stable_diffusion_baseten,
  stable_diffusion_demo: stable_diffusion_demo,
  dreamai: dreamai,
  playgroundai: playgroundai,
  pixaiart: pixaiart,
  skybox_blockadelabs: skybox_blockadelabs,
  huggingface: huggingface,
  tailieu_vn: tailieu_vn,
  fb_downloadWallMediaFromPosts: fb_downloadWallMediaFromPosts,
  textToSpeech: textToSpeech,
  shopee_totalSpendMoney_excel: addBadge(
    shopee_totalSpendMoney_excel,
    BADGES.hot
  ),
  download_watchingVideo: download_watchingVideo,
  tiktok_downloadVideo: tiktok_downloadVideo,
  tiktok_batchDownload: addBadge(tiktok_batchDownload, BADGES.beta),
  douyin_batchDownload: addBadge(douyin_batchDownload, BADGES.beta),
  medium_readFullArticle: medium_readFullArticle,
  viewSavedWifiPass: addBadge(viewSavedWifiPass, BADGES.new),
  leakCheck: addBadge(leakCheck, BADGES.new),
  whellOfNames_hack: addBadge(whellOfNames_hack, BADGES.new),
  saveAllVideo: addBadge(saveAllVideo, BADGES.new),
  fb_bulkDownload: addBadge(fb_bulkDownload, BADGES.hot),
  fireship_vip: addBadge(fireship_vip, BADGES.new),
  vuiz_createLogo: addBadge(vuiz_createLogo, BADGES.new),
  vuiz_getLink: addBadge(vuiz_getLink, BADGES.new),
  ggdrive_downloadPdf: addBadge(ggdrive_downloadPdf, BADGES.new),
  ggdrive_downloadPresentation: addBadge(
    ggdrive_downloadPresentation,
    BADGES.new
  ),
  youtube_localDownloader: addBadge(youtube_localDownloader, BADGES.new),
};

// alert(Object.keys(allScripts).length);

// inject id to all scripts
Object.entries(allScripts).forEach(([variableName, script]) => {
  script.id = variableName;
});

export { allScripts };
