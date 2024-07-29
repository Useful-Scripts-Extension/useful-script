import s from "../scripts/@allScripts.js";
import { Recommend as R } from "./recommend.js";
import { canAutoRun } from "./helpers/utils.js";
import { CATEGORY } from "./helpers/category.js";
import { getCurrentTab } from "../scripts/helpers/utils.js";
import {
  favoriteScriptsSaver,
  recentScriptsSaver,
} from "./helpers/storageScripts.js";

const createTitle = (en, vi) => ({ name: { en, vi } });

const specialTabs = [
  {
    ...CATEGORY.all,
    scripts: [],
  },
  {
    ...CATEGORY.recently,
    scripts: [],
  },
  {
    ...CATEGORY.favorite,
    scripts: [],
  },
  {
    ...CATEGORY.autorun,
    scripts: [],
  },
];

const tabs = [
  {
    ...CATEGORY.search,
    scripts: [
      // s.test,
      // s.ufs_statistic,
      R.theresanaiforthat,
      R.timeis,
      R.googleTrending,
      s.similarWeb,
      s.similarWeb_bypassLimit,
      s.search_sharedAccount,
      R.archive,
      R.wappalyzer,
      s.whois,
      s.viewWebMetaInfo,
      R.search_musicTreding,
      s.search_paperWhere,
      s.search_hopamchuan,
      s.checkWebDie,
      s.downDetector,
      s.openWaybackUrl,
      s.archiveToday,
      R.search_userscript,
    ],
  },
  {
    ...CATEGORY.download,
    scripts: [
      createTitle("--- All in one ---", "--- Tổng hợp ---"),
      R.cobalt,
      s.saveAllVideo,
      s.vuiz_getLink,
      s.savevideo_me,
      R.luanxt,
      createTitle("--- Photos ---", "--- Ảnh ---"),
      s.twitter_downloadButton,
      s.getFavicon,
      R.picviewer_ce,
      R.file_converter,
      R.squoosh_app,
      createTitle("--- Music ---", "--- Nhạc ---"),
      s.spotify_downloadButton,
      s.soundcloud_downloadMusic,
      s.nhaccuatui_downloader,
      s.zingmp3_downloadMusic,
      s.showTheAudios,
      createTitle("--- Videos ---", "--- Video ---"),
      s.download_watchingVideo,
      s.vimeo_downloader,
      s.showTheVideos,
      createTitle("--- Document ---", "--- Tài liệu ---"),
      s.studocu_downs,
      s.scribd_downloadDocuments,
      s.tailieu_vn,
      R.docsdownloader,
      s.bookmark_exporter,
      R.bookmarkSidebar,
    ],
  },
  {
    ...CATEGORY.google,
    scripts: [
      createTitle("--- Download ---", "--- Tải xuống ---"),
      s.ggdrive_generateDirectLink,
      s.ggdrive_downloadPdf,
      s.ggdrive_downloadPresentation,
      s.ggdrive_downloadDoc,
      s.ggdrive_copySheetText,
      s.ggdrive_downloadVideo,
      s.google_downloadAllYourData,
      createTitle("--- Bulk Download ---", "--- Tải hàng loạt ---"),
      s.ggDrive_downloadAllVideosInFolder,
      createTitle("--- More ---", "--- Khác ---"),
      R.googleAdvanced,
      s.search_totalIndexedPages,
      s.search_googleSite,
      s.googleShortcuts,
      s.googleCache,
      s.google_mirror,
    ],
  },
  {
    ...CATEGORY.facebook,
    scripts: [
      createTitle("--- All in one ---", "--- Tất cả trong một ---"),
      s.fb_allInOne,
      createTitle("--- Download ---", "--- Tải xuống ---"),
      s.fb_downloadWatchingVideo,
      s.fb_storySaver,
      s.fb_videoDownloader,
      s.fb_getAvatarFromUid,
      s.fb_exportSaved,
      createTitle("--- Hot ---", "--- Nổi bật ---"),
      s.fb_autoLike,
      s.fb_revealDeletedMessages,
      s.fb_moreReactionStory,
      s.fb_toggleLight,
      s.fb_toggleNewFeed,
      s.fb_stopNewFeed,
      s.fb_blockSeenStory,
      s.fb_getPostReactionCount,
      s.fb_whoIsTyping,
      // s.fb_blockSeenAndTyping,
      createTitle("--- Statistic ---", "--- Thống kê ---"),
      s.fb_searchGroupForOther,
      s.fb_searchPageForOther,
      s.fb_searchPostsForOther,
      createTitle("--- Access Token ---", "--- Access Token ---"),
      s.fb_checkToken,
      s.fb_getTokenFacebook,
      s.fb_getTokenMessage,
      s.fb_getTokenBussinessLocation,
      s.fb_getTokenCampaigns,
      s.fb_getTokenFfb,
      createTitle("--- Get ID ---", "--- Lấy ID ---"),
      s.fb_getUid,
      s.fb_getPageId,
      s.fb_getGroupId,
      s.fb_getAlbumId,
      s.fb_getAllAlbumIdFromCurrentWebsite,
      s.fb_getUidFromUrl,
      s.fb_getAllUidFromFbSearch,
      s.fb_getAllUidOfGroupMembers,
      createTitle("--- Shortcut ---", "--- Phím tắt ---"),
      R.fb_openSaved,
      R.fb_openMemories,
      R.fb_openAdsActivities,
      R.fb_openAllActivities,
      R.fb_openVideoActivities,
      R.fb_openPassEvents,
      R.fb_openBirthdays,
      R.fb_openChangeLanguage,
      R.fb_openAccountHacked,
    ],
  },
  {
    ...CATEGORY.instagram,
    scripts: [
      s.insta_getUserInfo,
      s.insta_injectDownloadBtn,
      s.insta_anonymousStoryViewer,
      createTitle("--- Bulk Download ---", "--- Tải hàng loạt ---"),
      s.insta_getAllUserMedia,
      s.insta_getFollowForOther,
    ],
  },
  {
    ...CATEGORY.youtube,
    scripts: [
      s.pictureInPicture,
      s.youtube_downloadVideo,
      s.youtube_getVideoCaption,
      s.youtube_viewDislikes,
      s.youtube_nonstop,
      s.youtube_changeCountry,
      s.youtube_getVideoThumbnail,
      s.youtube_toggleLight,
      s.pip_anything,
      s.pip_fullWebsite,
      s.pip_canvas,
      R.improve_youtube,
    ],
  },
  {
    ...CATEGORY.tiktok,
    scripts: [
      createTitle("--- Tiktok ---", "--- Tiktok ---"),
      s.tiktok_downloadWatchingVideo,
      s.tiktok_downloadVideo,
      s.tiktok_batchDownload,
      createTitle("--- Douyin ---", "--- Douyin ---"),
      s.douyin_batchDownload,
      s.douyin_downloadWachingVideo,
      s.douyin_downloadAllVideoUser,
    ],
  },
  {
    ...CATEGORY.automation,
    scripts: [
      createTitle("--- Utility ---", "--- Tiện ích ---"),
      s.web_timer,
      s.auto_lockWebsite,
      s.smoothScroll,
      s.magnify_image,
      s.auto_redirectLargestImageSrc,
      s.showImageOnHoverLink,
      s.remove_tracking_in_url,
      s.prevent_closeBrowser_lastTab,
      s.chongLuaDao,
      s.shortenURL,
      s.unshorten,
      s.createInvisibleText,
      createTitle("--- Automation ---", "--- Tự động ---"),
      s.webToPDF,
      s.screenshotFullPage,
      s.screenshotVisiblePage,
      s.scrollToVeryEnd,
      s.getAllEmailsInWeb,
      s.dino_hack,
      s.passwordGenerator,
      createTitle("--- Tools ---", "--- Công cụ ---"),
      s.textToQrCode,
      s.textToSpeech,
      s.changeAudioOutput,
      s.send_shareFiles,
      s.vuiz_createLogo,
      s.performanceAnalyzer,
      R.itTools,
      R.copyicon,
      R.beautifytools,
      createTitle("--- Github ---", "--- Github ---"),
      s.github_goToAnyCommit,
      s.github_HTMLPreview,
      s.github_openRepoPages,
      s.githubdev,
      s.github1s,
      R.cloc,
      R.refined_github,
      createTitle("--- Shopping ---", "--- Mua sắm ---"),
      s.shopee_topVariation,
      s.shopee_totalSpendMoney,
      s.shopee_totalSpendMoney_excel,
      s.tiki_totalSpendMoney,
      R.beecost,
      createTitle("--- PDF ---", "--- PDF ---"),
      R.fastDoc,
      R.smartPDF,
      R.pdfstuffs,
    ],
  },
  {
    ...CATEGORY.unlock,
    scripts: [
      createTitle("--- Unlock web ---", "--- Mở khoá web ---"),
      s.duckRace_cheat,
      s.wheelOfNames_hack,
      s.medium_readFullArticle,
      s.medium_fixVietnameseFont,
      s.fireship_vip,
      s.studocu_bypassPreview,
      s.scribd_bypassPreview,
      s.studyphim_unlimited,
      s.bypass_learnAnything,
      s.guland_VIP,
      createTitle("--- Unlock function ---", "--- Mở khoá chức năng ---"),
      s.simpleAllowCopy,
      s.detect_zeroWidthCharacters,
      s.injectScriptToWebsite,
      s.showHiddenFields,
      s.viewCookies,
      s.removeCookies,
      createTitle("--- Other ---", "--- Khác ---"),
      R.chromeFlags,
      R.viewSavedWifiPass,
      R.leakCheck,
    ],
  },
  {
    ...CATEGORY.webUI,
    scripts: [
      createTitle("--- Hot ---", "--- Nổi bật ---"),
      s.darkModePDF,
      s.toggleEditPage,
      s.showFPS,
      s.showFps_v2,
      s.toggle_passwordField,
      R.darkReader,
      R.cssportal,
      R.cssloaders,
      R.uiverse,
      createTitle("--- View ---", "--- Xem ---"),
      R.fontRendering,
      s.whatFont,
      s.visualEvent,
      s.listAllImagesInWeb,
      s.viewAllLinks,
      s.viewScriptsUsed,
      s.viewStylesUsed,
      s.cssSelectorViewer,
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
];

const recommendTab = {
  ...CATEGORY.recommend,
  scripts: [
    createTitle("--- Same author ---", "--- Cùng tác giả  ---"),
    R.lol2d,
    R.revealDeletedFBMessage,
    R.FBMediaDownloader,
    createTitle("--- Tools ---", "--- Công cụ hay  ---"),
    R.nirsoft,
    createTitle("--- Extensions ---", "--- Extensions hay  ---"),
    R.CRXViewer,
    R.uBlockOrigin,
    R.GoogleTranslate,
    R.NSFWFilter,
    R.Violentmonkey,
    R.Extensity,
  ],
};

function sortScriptsByTab(scripts, _tabs, addTabTitle = true) {
  let result = [];

  for (let tab of Object.values(_tabs)) {
    let sorted = [];

    for (let script of tab.scripts) {
      let found = scripts.findIndex((_) => _.id === script.id) >= 0;
      if (found) sorted.push(script);
    }

    if (sorted.length) {
      addTabTitle && result.push(createTitle(tab.name.en, tab.name.vi));
      result.push(...sorted);
    }
  }
  return result;
}

const allScriptInTabs = [
  ...tabs.map((tab) => tab.scripts),
  ...recommendTab.scripts,
].flat();

async function refreshSpecialTabs() {
  // add data to special tabs
  let recentTab = specialTabs.find((tab) => tab.id === CATEGORY.recently.id);
  if (recentTab) recentTab.scripts = recentScriptsSaver.get();

  let favoriteTab = specialTabs.find((tab) => tab.id === CATEGORY.favorite.id);
  if (favoriteTab) favoriteTab.scripts = favoriteScriptsSaver.get();

  let allTab = specialTabs.find((tab) => tab.id === CATEGORY.all.id);
  if (allTab) allTab.scripts = sortScriptsByTab(allScriptInTabs, tabs);

  let autoTab = specialTabs.find((tab) => tab.id === CATEGORY.autorun.id);
  if (autoTab)
    autoTab.scripts = sortScriptsByTab(
      allScriptInTabs.filter((_) => canAutoRun(_)),
      tabs
    );

  // update sticky favorites
  tabs.forEach((tab) => {
    // remove old sticky
    tab.scripts = tab.scripts.filter((_) => !_.isStickyFavorite);

    // add new sticky
    let favoriteInTab = tab.scripts.filter(
      (_) => favoriteScriptsSaver.has(_) && !_.isStickyFavorite
    );
    if (favoriteInTab.length) {
      // add sticky flag
      favoriteInTab = favoriteInTab.map((script) => {
        return {
          ...script,
          isStickyFavorite: true,
        };
      });

      // add block favorite sticky
      let title = createTitle("--- Your Favorites ---", "--- Bạn đã thích ---");
      title.isStickyFavorite = true;
      tab.scripts = [title, ...favoriteInTab, ...tab.scripts];
    }
  });

  // add auto runned scripts
  let currentTab = await getCurrentTab();
  if (!currentTab) return;
  let bgCached = await chrome.runtime.sendMessage({
    action: "ufs-runInBackground",
    data: { fnPath: "getCache", params: ["badges"] },
  });
  let runnedScriptIds = bgCached?.[currentTab.id];
  console.log(bgCached, currentTab.id, runnedScriptIds);
  if (runnedScriptIds?.length) {
    let scripts = allScriptInTabs.filter((_) => runnedScriptIds.includes(_.id));
    let hostname = new URL(currentTab.url).hostname;
    let title = createTitle(
      "--- Run in this page (" + scripts.length + ") ---<br/>" + hostname,
      "--- Chạy trong trang này (" + scripts.length + ") ---<br/>" + hostname
    );
    console.log(scripts, title);
    autoTab.customCount = `${scripts.length}/${autoTab.scripts.length}`;
    autoTab.scripts = [title, ...scripts, ...autoTab.scripts];
  }
}

function getAllTabs() {
  return [...specialTabs, ...tabs, recommendTab];
}

export { refreshSpecialTabs, tabs, specialTabs, recommendTab, getAllTabs };
