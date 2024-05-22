import { BADGES, addBadge } from "../scripts/helpers/badge.js";
import { getCurrentTab } from "../scripts/helpers/utils.js";
import { allScripts as s } from "../scripts/index.js";
import { CATEGORY } from "./helpers/category.js";
import { getLang } from "./helpers/lang.js";
import { favoriteScriptsSaver, recentScriptsSaver } from "./helpers/storage.js";
import { canAutoRun } from "./helpers/utils.js";

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
      s._test,
      s._ufs_statistic,
      s.similarWeb,
      s.similarWeb_bypassLimit,
      s.search_sharedAccount,
      addBadge(
        {
          id: "recommend_archive",
          icon: "https://archive.org/favicon.ico",
          name: {
            en: "Internet archive - Free library",
            vi: "Internet archive - Thư viện miễn phí",
          },
          description: {
            en: "Non-profit library of millions of free books, movies, software, music, websites, and more.",
            vi: "Thư viện với hàng triệu sách, báo, phim, phần mềm, nhạc, website, ... miễn phí",
            img: "/scripts/internet_archive.png",
          },
          popupScript: {
            onClick: () => window.open("https://archive.org/"),
          },
        },
        BADGES.recommend
      ),
      addBadge(
        {
          id: "recommend_wappalyzer",
          icon: "https://www.wappalyzer.com/favicon.ico",
          name: {
            en: "Wappalyzer - view website stacks",
            vi: "Wappalyzer - Web dùng công nghệ gì?",
          },
          description: {
            en: "Technology that current website is using",
            vi: "Xem những công nghệ/thư viện trang web đang dùng",
          },

          popupScript: {
            onClick: () => window.open("https://www.wappalyzer.com/apps/"),
          },
        },
        BADGES.recommend
      ),
      s.whois,
      s.viewWebMetaInfo,
      {
        id: "recommend_search_musicTreding",
        icon: "https://kworb.net/favicon.ico",
        name: {
          en: "Top global treding music?",
          vi: "Bài nhạc top treding toàn cầu?",
        },
        description: {
          en: "The web to find all kinds of music-related data.",
          vi: "Trang web thống kê top trending âm nhạc toàn cầu.",
        },
        popupScript: {
          onClick: () =>
            window.open("https://kworb.net/youtube/trending_music.html"),
        },
      },
      s.search_paperWhere,
      s.search_hopamchuan,
      s.checkWebDie,
      s.downDetector,
      s.openWaybackUrl,
      s.archiveToday,
      {
        id: "recommend_search_userscript",
        icon: "https://www.userscript.zone/favicon.ico",
        name: {
          en: "Search Userscripts",
          vi: "Tìm Userscripts",
        },
        description: {
          en: "Search Userscripts on Usersript.zone",
          vi: "Tìm Userscripts trên Usersript.zone",
        },

        popupScript: {
          onClick: () => window.open("https://www.userscript.zone/"),
        },
      },
    ],
  },
  {
    ...CATEGORY.download,
    scripts: [
      createTitle("--- All in one ---", "--- Tổng hợp ---"),
      s.saveAllVideo,
      s.vuiz_getLink,
      s.savevideo_me,
      addBadge({
        id: "getLinkLuanxt_newtab",
        icon: "https://luanxt.com/get-link-mp3-320-lossless-vip-zing/favicon.ico",
        name: {
          en: "Get audio/video (luanxt)",
          vi: "Tải nhạc/video (luanxt)",
        },
        description: {
          en: "Using API from luanxt.com. Download Zing MP3, Zing Video Clip, Zing TV, NhacCuaTui, YouTube, SoundCloud, Nhac.vn, ChiaSeNhac.vn, Facebook Video, Keeng Audio, Keeng Video, Keeng Phim",
          vi: "Sử dụng API của luanxt.com. Tải Zing MP3, Zing Video Clip, Zing TV, NhacCuaTui, YouTube, SoundCloud, Nhac.vn, ChiaSeNhac.vn, Facebook Video, Keeng Audio, Keeng Video, Keeng Phim",
        },
        infoLink: "https://luanxt.com/get-link-mp3-320-lossless-vip-zing/",
        popupScript: {
          onClick: () =>
            window.open(
              "https://luanxt.com/get-link-mp3-320-lossless-vip-zing/"
            ),
        },
      }),
      createTitle("--- Photos ---", "--- Ảnh ---"),
      s.twitter_downloadButton,
      s.getFavicon,
      addBadge(
        {
          id: "recommend_picviewer_ce+",
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAV1BMVEUAAAD////29vbKysoqKioiIiKysrKhoaGTk5N9fX3z8/Pv7+/r6+vk5OTb29vOzs6Ojo5UVFQzMzMZGRkREREMDAy4uLisrKylpaV4eHhkZGRPT08/Pz/IfxjQAAAAgklEQVQoz53RRw7DIBBAUb5pxr2m3/+ckfDImwyJlL9DDzQgDIUMRu1vWOxTBdeM+onApENF0qHjpkOk2VTwLVEF40Kbfj1wK8AVu2pQA1aBBYDHJ1wy9Cf4cXD5chzNAvsAnc8TjoLAhIzsBao9w1rlVTIvkOYMd9nm6xPi168t9AYkbANdajpjcwAAAABJRU5ErkJggg==",
          name: {
            en: "Picviewer CE+ download images",
            vi: "Picviewer CE+ tải ảnh",
          },
          description: {
            en: "Powerful picture viewing tool online, which can popup/scale/rotate/batch save pictures automatically",
            vi: "Công cụ mạnh mẽ để xem/tải ảnh hàng loạt, cho tất cả trang web",
            img: "https://v2fy.com/asset/063_picviewer_ce/73130353-c4598e00-4031-11ea-810e-9498677a40d1.gif",
          },
          popupScript: {
            onClick: () =>
              window.open(
                "https://greasyfork.org/en/scripts/24204-picviewer-ce"
              ),
          },
        },
        BADGES.recommend
      ),
      addBadge(
        {
          id: "recommend_file_converter",
          icon: "https://file-converter.io/favicon.ico",
          name: {
            en: "File-converter.io - change image type",
            vi: "File-converter.io - chuyển đổi ảnh",
          },
          description: {
            en: "Powerful tool which allows you to convert and compress files using the context menu in windows explorer.",
            vi: "Công cụ nén ảnh, đổi định dạng ảnh hàng loạt, trực tiếp bằng chuột phải.",
            img: "https://file-converter.io/images/file-converter-usage.gif",
          },
          popupScript: {
            onClick: () => window.open("https://file-converter.io/"),
          },
        },
        BADGES.recommend
      ),
      addBadge(
        {
          id: "recommend_squoosh_app",
          icon: "https://squoosh.app/c/icon-large-maskable-c2078ced.png",
          name: {
            en: "Squoosh.app - compress images",
            vi: "Squoosh.app - nén ảnh",
          },
          description: {
            en: "Make images smaller using best-in-class codecs, right in the browser.",
            vi: "Công cụ nén ảnh mạnh mẽ, giảm kích thước ngay trên trình duyệt",
          },
          popupScript: {
            onClick: () => window.open("https://squoosh.app/"),
          },
        },
        BADGES.recommend
      ),
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
      addBadge(
        {
          id: "recommend_docsdownloader",
          icon: "https://docsdownloader.com/assets/img/android-icon-192x192.png",
          name: {
            en: "DocDownloader - Download document",
            vi: "DocDownloader - Tải document",
          },
          description: {
            en: "Download document on Scribd, Everand, Slideshare, Issuu, Academia, Chegg, Researchgate, Coursehero, Studocu, Perlego, Yumpu, Tiendeo, Fliphtml5, Anyflip, Docsity, Passei direto, Udocz",
            vi: "Tải document từ Scribd, Everand, Slideshare, Issuu, Academia, Chegg, Researchgate, Coursehero, Studocu, Perlego, Yumpu, Tiendeo, Fliphtml5, Anyflip, Docsity, Passei direto, Udocz",
          },
          popupScript: {
            onClick: () => window.open("https://docdownloader.com/"),
          },
        },
        BADGES.recommend
      ),
      s.bookmark_exporter,
      addBadge(
        {
          id: "recommend_BookmarkSidebar",
          icon: "https://lh3.googleusercontent.com/4kT7DxtoPSmSLzTit1w2Vbx7b1L2zkASTrqGzEpBW-qs2EwmLYzBTyv0cvlGZo-rD-s732OIrUXX-C33RHPSFvOj=s0",
          name: {
            en: "Bookmark Sidebar",
            vi: "Bookmark Sidebar",
          },
          description: {
            en: "Very good Bookmark manager, find your bookmarks faster.",
            vi: "Trình quản lý extension ngon, tìm kiếm bookmark nhanh hơn bao giờ hết.",
          },
          popupScript: {
            onClick: () =>
              window.open(
                "https://chromewebstore.google.com/detail/thanh-d%E1%BA%A5u-trang/jdbnofccmhefkmjbkkdkfiicjkgofkdh"
              ),
          },
        },
        BADGES.recommend
      ),
      // s.researchGate_downloader, // limited
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
      addBadge(
        {
          id: "recommend_googleAdvanced",
          icon: "https://www.google.com/favicon.ico",
          name: {
            en: "Google search advanced",
            vi: "Google tìm kiếm nâng cao",
          },
          description: {
            en: "Search google with a lot of advanced features",
            vi: "Tìm kiếm google với nhiều tuỳ chọn nâng cao",
          },
          popupScript: {
            onClick: () =>
              window.open(
                "https://www.google.com/advanced_search?hl=" +
                  getLang() +
                  "&fg=1"
              ),
          },
        },
        BADGES.recommend
      ),
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
      createTitle("--- Download ---", "--- Tải xuống ---"),
      s.fb_downloadWatchingVideo,
      s.fb_storySaver,
      s.fb_videoDownloader,
      s.fb_getAvatarFromUid,
      createTitle("--- Bulk Download ---", "--- Tải hàng loạt ---"),
      s.fb_bulkDownload,
      s.fb_downloadAlbumMedia,
      s.fb_downloadWallMediaFromPosts,
      s.fb_getAllAlbumInformation,
      s.fb_openSaved,
      s.fb_exportSaved,
      createTitle("--- Hot ---", "--- Nổi bật ---"),
      s.fb_revealDeletedMessages,
      s.fb_invisible_message,
      s.fb_moreReactionStory,
      s.fb_whoIsTyping,
      s.fb_toggleLight,
      s.fb_toggleNewFeed,
      createTitle("--- Statistic ---", "--- Thống kê ---"),
      s.fb_messengerHistory,
      s.fb_messengerCount,
      s.fb_searchGroupForOther,
      s.fb_searchPageForOther,
      s.fb_fetchAllAddedFriends,
      s.fb_searchPostsForOther,
      createTitle("--- Access Token ---", "--- Access Token ---"),
      s.fb_checkToken,
      s.fb_getTokenFfb,
      s.fb_getTokenFacebook,
      s.fb_getTokenBussinessLocation,
      // s.fb_getTokenBusinessStudio,
      s.fb_getTokenCampaigns,
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
      {
        id: "fb_openMemories",
        icon: '<i class="fa-solid fa-clock-rotate-left fa-lg"></i>',
        name: {
          en: "View your memories on facebook",
          vi: "Xem kỷ niệm của bạn trên facebook",
        },
        description: {
          en: "View your memories on facebook",
          vi: "Xem kỷ niệm (memories) của bạn trên facebook",
        },
        popupScript: {
          onClick: () => window.open("https://www.facebook.com/memories/"),
        },
      },
      {
        id: "fb_openAdsActivities",
        icon: '<i class="fa-brands fa-adversal fa-lg"></i>',
        name: {
          en: "View your ads activities",
          vi: "Xem các quảng cáo fb bạn đã xem",
        },
        description: {
          en: "View ads you have seen on facebook",
          vi: "Xem các quảng cáo bạn đã xem trên facebook",
        },
        popupScript: {
          onClick: () => window.open("https://www.facebook.com/ads/activity"),
        },
      },
      {
        id: "fb_openAllActivities",
        icon: '<i class="fa-solid fa-eye fa-lg"></i>',
        name: {
          en: "Check your activities on Facebook",
          vi: "Xem nhật ký hoạt động trên facebook",
        },
        description: {
          en: "Check all your activities on facebook",
          vi: "Kiểm tra nhật ký hoạt động của bạn trên facebook",
        },
        popupScript: {
          onClick: () =>
            window.open(
              "https://www.facebook.com/me/allactivity/?activity_history=false&category_key=ALL&manage_mode=false&should_load_landing_page=true"
            ),
        },
      },
      {
        id: "fb_changeLanguage",
        icon: '<i class="fa-solid fa-language fa-lg"></i>',
        name: {
          en: "Change language Facebook",
          vi: "Đổi ngôn ngữ Facebook",
        },
        description: {
          en: "Change display language on facebook",
          vi: "Đổi ngôn ngữ hiển thị trên facebook",
        },
        popupScript: {
          onClick: () =>
            window.open("https://www.facebook.com/settings/?tab=language"),
        },
      },
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
      // s.youtube_localDownloader,
      s.youtube_downloadVideo,
      s.youtube_toggleLight,
      s.pictureInPicture,
      s.pip_fullWebsite,
      s.pip_canvas,
      s.youtube_viewDislikes,
      s.youtube_nonstop,
      addBadge(
        {
          id: "recommend_improve_youtube",
          icon: "https://lh3.googleusercontent.com/WDytHNO8o0Ev6sWp_yLbya_SSS9kXZWGJIc-WJ3goInHJalzD02Aq5wVhExFlbzrzNsOxo-V1O_TgF-JLJNyTkvB=s0",
          name: {
            en: "Improve YouTube - 85+ features",
            vi: "Improve YouTube - 85+ chức năng",
          },
          description: {
            en: "Make YouTube more beautiful, faster, and more useful!",
            vi: "Làm cho YouTube gọn gàng+thông minh!",
          },
          popupScript: {
            onClick: () =>
              window.open(
                "https://chromewebstore.google.com/detail/improve-youtube-%F0%9F%8E%A7-for-yo/bnomihfieiccainjcjblhegjgglakjdd"
              ),
          },
        },
        BADGES.recommend
      ),
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
      s.douyin_downloadWachingVideo,
      s.douyin_downloadAllVideoUser,
      // s.douyin_batchDownload,
    ],
  },
  {
    ...CATEGORY.automation,
    scripts: [
      createTitle("--- Utility ---", "--- Tiện ích ---"),
      s.web_timer,
      s.auto_lockWebsite,
      s.magnify_image,
      s.auto_redirectLargestImageSrc,
      s.remove_tracking_in_url,
      s.prevent_closeBrowser_lastTab,
      s.chongLuaDao,
      s.shortenURL,
      s.unshorten,
      createTitle("--- Automation ---", "--- Tự động ---"),
      s.scrollToVeryEnd,
      s.screenshotFullPage,
      s.webToPDF,
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
      addBadge(
        {
          id: "recommend_ItTools",
          icon: "https://it-tools.tech/favicon-32x32.png",
          name: {
            en: "IT Tools - All for Developers",
            vi: "IT Tools - Vì tương lai Developer",
          },
          description: {
            en: "Handy tools for developers (open source)",
            vi: "Tổng hợp tools hữu ích cho IT (mã nguồn mở)",
          },
          popupScript: {
            onClick: () => window.open("https://it-tools.tech/"),
          },
        },
        BADGES.recommend
      ),
      addBadge(
        {
          id: "recommend_cssportal",
          icon: "https://www.cssportal.com/favicon.ico",
          name: {
            en: "CSS Portal - Empowered your CSS skills",
            vi: "CSS Portal - Nâng trình CSS",
          },
          description: {
            en: "Empowered your CSS skills with hundreds of CSS tools.",
            vi: "Công cụ tự động giúp nâng trình CSS của bạn với hàng trăm chức năng.",
          },
          popupScript: {
            onClick: () =>
              window.open(
                "https://www.cssportal.com/css-animated-text-generator/"
              ),
          },
        },
        BADGES.recommend
      ),
      addBadge(
        // https://copyicon.com/generator/svg-chart
        {
          id: "recommend_copyicon",
          icon: "https://copyicon.com/favicon.ico",
          name: {
            en: "CopyIcon - FREE emoji, icon, generator",
            vi: "CopyIcon - emoji, icon, svg miễn phí",
          },
          description: {
            en: "285,000 free Icons, Emoji, SVG generator, and more...",
            vi: "285,000 Icons, Emiji, trình tạo SVG, và hơn thế nữa...",
          },
          popupScript: {
            onClick: () =>
              window.open("https://copyicon.com/generator/svg-chart"),
          },
        },
        BADGES.recommend
      ),
      addBadge(
        {
          id: "recommend_beautifytools",
          icon: "https://beautifytools.com/img/favicon.ico",
          name: { en: "Beautify Tools", vi: "Beautify Tools" },
          description: {
            en: `Handy tools for developers
            <ol>
              <li>Beautifiers And Minifiers</li>
              <li>CSS Preprocessors</li>
              <li>Converters</li>
              <li>String Utilities</li>
              <li>SEO Tools</li>
              <li>IP Tools</li>
              <li>Code Validators</li>
              <li>Cryptography</li>
              <li>Code Editors</li>
            </ol>`,
            vi: `Tổng hợp tools hữu ích cho IT
            <ol>
              <li>Beautifiers And Minifiers</li>
              <li>CSS Preprocessors</li>
              <li>Converters</li>
              <li>String Utilities</li>
              <li>SEO Tools</li>
              <li>IP Tools</li>
              <li>Code Validators</li>
              <li>Cryptography</li>
              <li>Code Editors</li>
            </ol>`,
          },
          popupScript: {
            onClick: () => window.open("https://beautifytools.com/"),
          },
        },
        BADGES.recommend
      ),
      createTitle("--- Github ---", "--- Github ---"),
      s.github_goToAnyCommit,
      s.githubdev,
      s.github1s,
      addBadge(
        {
          id: "recommend_cloc",
          icon: '<i class="fa-solid fa-code"></i>',
          name: {
            en: "Cloc - count line of code",
            vi: "Cloc - đếm số dòng code",
          },
          description: {
            en: "Count blank lines, comment lines, and physical lines of source code in many programming languages.",
            vi: "Đếm dòng trống, comment, dòng code trong repo, hỗ trợ nhiều ngôn ngữ lập trình.",
            img: "/scripts/recommend_cloc.png",
          },
          popupScript: {
            onClick: () =>
              window.open(
                "https://github.com/AlDanial/cloc?tab=readme-ov-file"
              ),
          },
        },
        BADGES.recommend
      ),
      createTitle("--- Shopping ---", "--- Mua sắm ---"),
      s.shopee_topVariation,
      s.shopee_totalSpendMoney,
      s.shopee_totalSpendMoney_excel,
      s.tiki_totalSpendMoney,
      addBadge(
        {
          id: "recommend_Beecost",
          icon: "https://lh3.googleusercontent.com/QeCUs-fM4mwAmBVRS0VU8NrjJnDnbSsXoqUrCbd8ZbHou03FBPEQOYHAcdcL_rn7NMrUpWMcXoG2m_CrKtAhc-wLgLU=w128-h128-e365-rj-sc0x00ffffff",
          name: { en: "Beecost", vi: "Beecost" },
          description: {
            en: "Check deals/prices in ecommerce websites",
            vi: "Kiểm tra giá/ưu đãi giả khi mua hàng online",
          },
          popupScript: {
            onClick: () => window.open("https://beecost.vn/"),
          },
        },
        BADGES.recommend
      ),
      createTitle("--- PDF ---", "--- PDF ---"),
      {
        id: "recommend_fastDoc",
        icon: "https://fastdoc.vn/favicon.png",
        name: {
          en: "FastDoc - Convert PDF/Photo to Word/Excel",
          vi: "FastDoc - Chuyển PDF/Ảnh sang Word/Excel",
        },
        description: {
          en: "Convert Photos & PDF to Excel, Word, Searchable PDF for free",
          vi: "Chuyển đổi hình ảnh và pdf sang Excel, Word, Searchable PDF miễn phí",
        },
        popupScript: {
          onClick: () => window.open("https://fastdoc.vn/"),
        },
      },
      {
        id: "recommend_smartPDF",
        icon: "https://smallpdf.com/favicon.ico",
        name: {
          en: "SmartPDF - Tools for PDF",
          vi: "SmartPDF - Công cụ cho PDF",
        },
        description: {
          en: "Compress PDF, PDF Converter, PPT to PDF, PDF to PPT, JPG to PDF, PDF to JPG, Excel to PDF, PDF to Excel, Edit PDF, PDF Reader, Number Pages, Delete PDF Pages, Rotate PDF, Word to PDF, PDF to Word, Merge PDF, Split PDF, eSign PDF, Unlock PDF, Protect PDF, PDF Scanner",
          vi: "Giảm dung lượng PDF, Chuyển đổi PDF, PPT sang PDF, PDF sang PPT, JPG sang PDF, PDF sang JPG, Excel sang PDF, PDF sang Excel, Chỉnh sửa PDF, Trình đọc PDF, Số trang, Xóa các trang PDF, Xoay PDF, Word sang PDF, PDF sang Word, Ghép PDF, Cắt PDF, Ký tên PDF, Mở khóa PDF, Bảo vệ PDF, Máy quét PDF",
        },
        popupScript: {
          onClick: () => window.open("https://smallpdf.com/vi/cac-cong-cu-pdf"),
        },
      },
      {
        id: "recommend_pdfstuffs",
        icon: "https://pdfstuff.com/themes/pdfstuff/img/favicons/apple-icon-57x57.png",
        name: {
          en: "PDF Stuffs - Tools for PDF",
          vi: "PDF Stuffs - Công cụ PDF",
        },
        description: {
          en: "Free PDF converter online service: Merge PDF, Split PDF, Compress PDF, PDF to Word, PDF to PPT, PDF to Excel, Word to PDF, Excel to PDF, PPT to PDF, PDF to JPG, JPG to PDF, PDF to HTML, HTML to PDF, Unlock PDF, Protect PDF, Rotate PDF, Crop PDF, Delete pages, Add page numbers, Watermark PDF",
          vi: "Công cụ chuyển đổi PDF online miễn phí: Ghép file PDF, Tách file PDF, Nén file PDF, PDF sang Word, PDF sang PPT, PDF sang Excel, Word sang PDF, Excel sang PDF, PPT sang PDF, PDF sang JPG, JPG sang PDF, PDF sang HTML, HTML sang PDF, Mở khóa PDF, Khóa file PDF, Xoay file PDF,  Cắt file PDF, Xóa trang PDF, Đánh số trang PDF, Chèn watermark",
        },
        popupScript: {
          onClick: () => window.open("https://pdfstuff.com/"),
        },
      },
    ],
  },
  {
    ...CATEGORY.unlock,
    scripts: [
      createTitle("--- Unlock web ---", "--- Mở khoá web ---"),
      s.removeWebLimit,
      s.duckRace_cheat,
      s.wheelOfNames_hack,
      s.medium_readFullArticle,
      s.fireship_vip,
      s.scribd_bypassPreview,
      s.studocu_bypassPreview,
      s.studyphim_unlimited,
      createTitle("--- Unlock function ---", "--- Mở khoá chức năng ---"),
      s.detect_zeroWidthCharacters,
      s.injectScriptToWebsite,
      s.simpleAllowCopy,
      s.showHiddenFields,
      s.viewCookies,
      s.removeCookies,
      createTitle("--- Other ---", "--- Khác ---"),
      {
        id: "recommend_viewSavedWifiPass",
        icon: '<i class="fa-solid fa-wifi"></i>',
        name: {
          en: "View saved wifi passwords",
          vi: "Xem mật khẩu wifi đã lưu",
        },
        description: {
          en: "PowerShell script to view saved wifi passwords on your computer",
          vi: "Powershell script giúp xem mật khẩu wifi đã lưu trên máy tính",
        },
        infoLink:
          "https://www.facebook.com/groups/j2team.community/posts/2328915024107271/",

        popupScript: {
          onClick: () => {
            prompt(
              `File danh sách mật khẩu Wifi sẽ lưu ở:
      "C:\\WifiPasswords\\listWifiPasswords.txt"
      có dạng: [Tên Wifi]:[Mật khẩu]

      Mở Powershell và chạy lệnh sau:`,
              `irm https://tinyurl.com/GetListWifiPasswords | iex`
            );
          },
        },
      },
      addBadge({
        id: "recommend_leakCheck",
        icon: "https://leakcheck.io/favicon.ico",
        name: {
          en: "Leak check - your password has been leaked?",
          vi: "Leak check - lộ mật khẩu email?",
        },
        description: {
          en: "Check your password has been leaked on internet or not",
          vi: "Kiểm tra xem mật khẩu email/username của bạn có bị phát tán trên mạng hay không",
        },
        infoLink:
          "https://www.facebook.com/groups/j2team.community/posts/2329878560677584/",
        popupScript: {
          onClick: () => {
            window.open("https://okela.fun/");
          },
        },
      }),
    ],
  },
  {
    ...CATEGORY.webUI,
    scripts: [
      createTitle("--- Hot ---", "--- Nổi bật ---"),
      addBadge(
        {
          id: "recommend_DarkReader",
          icon: "https://lh3.googleusercontent.com/T66wTLk-gpBBGsMm0SDJJ3VaI8YM0Utr8NaGCSANmXOfb84K-9GmyXORLKoslfxtasKtQ4spDCdq_zlp_t3QQ6SI0A=w128-h128-e365-rj-sc0x00ffffff",
          name: { en: "Dark reader", vi: "Dark reader" },
          description: {
            en: "Darkmode for every website",
            vi: "Chế độ tối cho mọi trang web",
          },
          popupScript: {
            onClick: () =>
              window.open(
                "https://chrome.google.com/webstore/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh"
              ),
          },
        },
        BADGES.recommend
      ),
      s.darkModePDF,
      s.toggleEditPage,
      s.showFPS,
      s.showFps_v2,
      s.toggle_passwordField,
      createTitle("--- View ---", "--- Xem ---"),
      addBadge(
        {
          id: "recommend_fontRendering",
          icon: '<i class="fa-solid fa-font fa-lg"></i>',
          name: {
            en: "Font Rendering - better font display",
            vi: "Font Rendering - font chữ dễ nhìn",
          },
          description: {
            en: "Improve browser displaying, font rewriting, smoothing, scaling, stroke, shadow, special style elements, custom monospaced, etc",
            vi: "Cải thiện font chữ web, giúp lướt web dễ chịu hơn.",
          },
          popupScript: {
            onClick: () => {
              window.open("https://greasyfork.org/scripts/416688");
            },
          },
        },
        BADGES.recommend
      ),
      s.whatFont,
      s.visualEvent,
      s.listAllImagesInWeb,
      s.viewAllLinks,
      s.viewScriptsUsed,
      s.viewStylesUsed,
      s.cssSelectorViewer,
      s.viewPartialSource,
      s.consoleLog_withTime,
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
    { name: { en: "--- Same author ---", vi: "--- Cùng tác giả ---" } },
    {
      id: "recommend_LOL2D",
      icon: "https://hoangtran0410.github.io/LOL2D/favicon/apple-touch-icon.png",
      name: {
        en: "LOL2D - League of Legends 2D",
        vi: "LOL2D - Liên minh huyền thoại 2D",
      },
      description: {
        en: "Play League of Legends right on your browser",
        vi: "Chơi Liên minh huyền thoại ngay trên trình duyệt",
        img: "https://raw.githubusercontent.com/HoangTran0410/LOL2D/main/assets/images/screenshots/Screenshot_4.jpg",
      },
      popupScript: {
        onClick: () => window.open("https://github.com/HoangTran0410/LOL2D"),
      },
    },
    {
      id: "recommend_RevealDeletedFBMessage",
      icon: "https://github.com/HoangTran0410/RevealDeletedFBMessages/raw/master/icons/icon48.png",
      name: {
        en: "Reveal Deleted FB Message",
        vi: "Xem tin nhắn FB bị gỡ",
      },
      description: {
        en: "Know what your friends have sent you",
        vi: "Xem bạn bè đã gửi gì cho bạn",
      },
      popupScript: {
        onClick: () =>
          window.open(
            "https://github.com/HoangTran0410/RevealDeletedFBMessages"
          ),
      },
    },
    {
      id: "recommend_FBMediaDownloader",
      icon: "https://www.facebook.com/favicon.ico",
      name: { en: "FB Media Downloader", vi: "FB Media Downloader" },
      description: {
        en: "Tool download media from facebook automatic",
        vi: "Công cụ tải ảnh/video từ facebook tự động cực nhanh",
      },
      popupScript: {
        onClick: () =>
          window.open("https://github.com/HoangTran0410/FBMediaDownloader"),
      },
    },
    { name: { en: "--- Extensions ---", vi: "--- Extensions hay ---" } },
    {
      id: "recommend_CRXViewer",
      icon: "https://lh3.googleusercontent.com/fD5QA80tZj1up43xmnxnxiqKNEq7515-HNtLfjoZlz_I626zxXmjlhKaQPUme_evpCEnN5-U7VnG3VfOcnTPzv_i=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "CRX Viewer", vi: "CRX Viewer" },
      description: {
        en: "View/Download source code of any extension",
        vi: "Xem/Tải source code của mọi extension",
      },
      popupScript: {
        onClick: () =>
          window.open(
            "https://chrome.google.com/webstore/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin"
          ),
      },
    },
    {
      id: "recommend_uBlockOrigin",
      icon: "https://lh3.googleusercontent.com/rrgyVBVte7CfjjeTU-rCHDKba7vtq-yn3o8-10p5b6QOj_2VCDAO3VdggV5fUnugbG2eDGPPjoJ9rsiU_tUZBExgLGc=s60",
      name: { en: "uBlock Origin", vi: "uBlock Origin" },
      description: {
        en: "Block advertisements for all website",
        vi: "Chặn quảng cáo cho mọi website",
      },
      popupScript: {
        onClick: () =>
          window.open(
            "https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm"
          ),
      },
    },
    {
      id: "recommend_GoogleTranslate",
      icon: "https://lh3.googleusercontent.com/3ZU5aHnsnQUl9ySPrGBqe5LXz_z9DK05DEfk10tpKHv5cvG19elbOr0BdW_k8GjLMFDexT2QHlDwAmW62iLVdek--Q=w128-h128-e365-rj-sc0x00ffffff",
      name: { en: "Google translate", vi: "Google dịch" },
      description: {
        en: "Instant translation for all website",
        vi: "Dịch nhanh, trực tiếp trong mọi website",
      },
      popupScript: {
        onClick: () =>
          window.open(
            "https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb"
          ),
      },
    },
    {
      id: "recommend_NSFWFilter",
      icon: "https://lh3.googleusercontent.com/M_2Q8eJAj1ejsRg30LuJs_Q94Jk7d-6ZbE5cyddULweH5LrfsVJtjK8zbpSjwA3G9oHwZeyHyrYrr971kqLwtNNP=w128-h128-e365-rj-sc0x00ffffff",
      name: {
        en: "NSFW Filter: Hide NSFW content",
        vi: "NSFW Filter: Ẩn nội dung 18+",
      },
      description: {
        en: "Hide NSFW content from websites using this extension powered by AI",
        vi: "Ẩn mọi nội dung 18+ trên website, sử dụng trí tuệ nhân tạo",
      },
      popupScript: {
        onClick: () =>
          window.open(
            "https://chrome.google.com/webstore/detail/nsfw-filter/kmgagnlkckiamnenbpigfaljmanlbbhh"
          ),
      },
    },
    {
      id: "recommend_Violentmonkey",
      icon: "https://violentmonkey.github.io/favicon-32x32.png?v=e0d9ed50fb982761b0f7cdea8b093ae9",
      name: {
        en: "Violentmonkey",
        vi: "Violentmonkey",
      },
      description: {
        en: "An open source userscript manager.",
        vi: "Trình quản lý userscript tốt.",
      },
      popupScript: {
        onClick: () => window.open("https://violentmonkey.github.io/"),
      },
    },
    {
      id: "recommend_Extensity",
      icon: "https://lh3.googleusercontent.com/mgOg2hnGuthlYj-MEUXedWn_s9QjTXBwusffIAhbIuHM8L3K2c5cq1xf7bCzbRE5f9E6RXaGLPNEuJEt4hP6sLDL=s60",
      name: {
        en: "Extensity",
        vi: "Extensity",
      },
      description: {
        en: "Extension manager - Quickly enable/disable browser extensions",
        vi: "Trình quản lý extension - Nhanh chóng tắt/mở extension của trình duyệt",
      },
      popupScript: {
        onClick: () =>
          window.open(
            "https://chromewebstore.google.com/detail/extensity/jjmflmamggggndanpgfnpelongoepncg"
          ),
      },
    },
  ],
};

function sortScriptsByTab(scripts, _tabs, addTabTitle = true) {
  let result = [];

  for (let tab of Object.values(_tabs)) {
    let sorted = [];

    for (let script of tab.scripts) {
      let found = scripts.findIndex((_) => _.id === script.id) >= 0;
      if (found) {
        sorted.push(script);
      }
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
