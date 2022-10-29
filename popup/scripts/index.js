import { downloadWatchingStory } from "./doutube/downloadWatchingStory.js";
import { downloadWatchingVideo } from "./doutube/downloadWatchingVideo.js";
import { enableDownloadVideo } from "./doutube/enableDownloadVideo.js";
import { getAllVideoInUserProfile } from "./doutube/getAllVideoInUserProfile.js";
import { downloadAlbumMedia } from "./facebook/downloadAlbumMedia.js";
import { downloadCurrentVideo } from "./facebook/downloadCurrentVideo.js";
import { getAlbumId } from "./facebook/getAlbumId.js";
import { getAllAlbumId } from "./facebook/getAllAlbumId.js";
import { getAllUidFromFBSearch } from "./facebook/getAllUidFromFbSearch.js";
import { getAllUidFromFriendsPage } from "./facebook/getAllUidFromFriendsPage.js";
import { getAllUidOfGroupMembers } from "./facebook/getAllUidOfGroupMembers.js";
import { getAllVideoId } from "./facebook/getAllVideoId.js";
import { getAvatarFromUid } from "./facebook/getAvatarFromUid.js";
import { getGroupId } from "./facebook/getGroupId.js";
import { getPageId } from "./facebook/getPageId.js";
import { getTimelineAlbumId } from "./facebook/getTimelineAlbumId.js";
import { getTokenBusiness } from "./facebook/getTokenBusiness.js";
import { getTokenFacebook } from "./facebook/getTokenFacebook.js";
import { getTokenMFacebook } from "./facebook/getTokenMFacebook.js";
import { getUid as getFbUid } from "./facebook/getUid.js";
import { getUidFromUrl } from "./facebook/getUidFromUrl.js";
import { github1s } from "./github/github1s.js";
import { goToFirstCommit } from "./github/goToFirstCommit.js";
import { getAllImagesInNewFeed } from "./instagram/getAllImagesInNewFeed.js";
import { getAllImagesInUserProfile } from "./instagram/getAllImagesInUserProfile.js";
import { getAllUserMedia } from "./instagram/getAllUserMedia.js";
import { getToken as getTokenInsta } from "./instagram/getToken.js";
import { getUid as getUidInsta } from "./instagram/getUid.js";
import { webToPDF } from "./pdf/webToPDF.js";
import { darkModePDF } from "./pdf/darkModePDF.js";
import { enableTextSelection } from "./unlock/enableTextSelection.js";
import { openWaybackUrl } from "./more/openWaybackUrl.js";
import { reEnableContextMenu } from "./unlock/reEnableContextMenu.js";
import { runStatJs } from "./more/runStatJs.js";
import { scrollToVeryEnd } from "./automation/scrollToVeryEnd.js";
import { shortenURL } from "./more/shortenURL.js";
import { viewScriptsUsed } from "./more/viewScriptsUsed.js";
import { webToQRCode } from "./qrcode/webToQRCode.js";
import { bugMeNot } from "./password/bugMeNot.js";
import { textToQRCode } from "./qrcode/textToQRCode.js";
import { viewHiddenPassword } from "./password/viewHiddenPassword.js";
import { addSortTable } from "./table/addSortTable.js";
import { addNumberColumn } from "./table/addNumberColumn.js";
import { swapRowAndColumn } from "./table/swapRowAndColumn.js";
import { editPage } from "./webUI/editPage.js";
import { whatFont } from "./webUI/whatFont.js";
import { listAllImagesInWeb } from "./more/listAllImagesInWeb.js";
import { checkWebDie } from "./unlock/checkWebDie.js";
import { removeColours } from "./webUI/removeColours.js";
import { removeBloat } from "./webUI/removeBloat.js";
import { removeStylesheet } from "./webUI/removeStylesheet.js";
import { removeImages } from "./webUI/removeImages.js";
import { removeCookies } from "./unlock/removeCookies.js";
import { internalOrExternalLink } from "./webUI/internalOrExternalLink.js";
import { viewStylesUsed } from "./more/viewStylesUsed.js";
import { viewPartialSource } from "./more/viewPartialSource.js";
import { letItSnow } from "./webUI/letItSnow.js";
import { passwordGenerator } from "./password/passwordGenerator.js";
import { bypassYoutube18 } from "./youtube/bypassYoutube18.js";
import { getWindowSize } from "./webUI/getWindowSize.js";
import { toggleLight } from "./youtube/toggleLight.js";

export const tabs = [
  {
    id: "facebook",
    name: {
      vi: "Facebook",
      en: "Facebook",
    },
    description: {
      en: "Facebook script tools",
      vi: "Scripts hay cho facebook",
    },
    scripts: [
      {
        name: {
          en: "Get Token (business.facebook.com)",
          vi: "Lấy token (business.facebook.com)",
        },
        description: {
          en: "Get facebook access token from business.facebook.com",
          vi: "Lấy facebook access token từ trang business.facebook.com",
        },
        func: getTokenBusiness,
      },
      {
        name: {
          en: "Get Token (www.facebook.com)",
          vi: "Lấy Token (www.facebook.com)",
        },
        description: {
          en: "Get facebook access token from www.facebook.com",
          vi: "Lấy facebook access token từ trang www.facebook.com",
        },
        func: getTokenFacebook,
      },
      {
        name: {
          en: "Get Token (m.facebook.com)",
          vi: "Lấy token (m.facebook.com)",
        },
        description: {
          en: "Get facebook access token from m.facebook.com",
          vi: "Lấy facebook access token từ trang m.facebook.com",
        },
        func: getTokenMFacebook,
      },
      {
        name: {
          en: "Get User ID",
          vi: "Lấy User ID",
        },
        description: {
          en: "Get id of user in current website",
          vi: "Lấy id của user trong trang web hiện tại",
        },
        func: getFbUid,
      },
      {
        name: {
          en: "Get Group ID",
          vi: "Lấy Group ID",
        },
        description: {
          en: "Get id of group in current website",
          vi: "Lấy id của group trong trang web hiện tại",
        },
        func: getGroupId,
      },
      {
        name: {
          en: "Get Page ID",
          vi: "Lấy Page ID",
        },
        description: {
          en: "Get id of page in current website",
          vi: "Lấy id của page trong trang web hiện tại",
        },
        func: getPageId,
      },
      {
        name: {
          en: "Get Album ID",
          vi: "Lấy Album ID",
        },
        description: {
          en: "Get id of album in current website",
          vi: "Lấy id của album trong trang web hiện tại",
        },
        func: getAlbumId,
      },
      {
        name: {
          en: "Get User ID from url",
          vi: "Lấy User ID từ URL",
        },
        description: {
          en: "Get id of user from entered url",
          vi: "Lấy id của user từ URL truyền vào",
        },
        func: getUidFromUrl,
      },
      {
        name: {
          en: "Get all User ID from Friends page",
          vi: "Lấy tất cả user id từ danh sách bạn bè",
        },
        description: {
          en: "Get id of all user from friends page",
          vi: "Lấy tất cả user ID từ trang danh sách bạn bè",
        },
        func: getAllUidFromFriendsPage,
      },
      {
        name: {
          en: "Get all User ID from group",
          vi: "Lấy tất cả user ID từ group",
        },
        description: {
          en: "Get id of all user from group members",
          vi: "Lấy id của tất cả user từ group",
        },
        func: getAllUidOfGroupMembers,
      },
      {
        name: {
          en: "Get all User ID from search page",
          vi: "Lấy tất cả user ID từ trang tìm kiếm",
        },
        description: {
          en: "Get id of all user from fb search page",
          vi: "Lấy id của tất cả user từ trang tìm kiếm người dùng",
        },
        func: getAllUidFromFBSearch,
      },
      {
        name: {
          en: "Get avatar from user id",
          vi: "Tải avatar từ user id",
        },
        description: {
          en: "Get avatar from list user ids",
          vi: "Tải danh sách avatar từ danh sách user id",
        },
        func: getAvatarFromUid,
      },
      {
        name: {
          en: "Get all Album ID",
          vi: "Lấy tất cả album id",
        },
        description: {
          en: "Get all id of album in current website",
          vi: "Lấy tất cả album id có trong trang web",
        },
        func: getAllAlbumId,
      },
      {
        name: {
          en: "Get timeline Album ID of page",
          vi: "Tìm timeline album id của page",
        },
        description: {
          en: "Get timeline album id of page in current website",
          vi: "Tìm timeline album id của page hiện tại",
        },
        func: getTimelineAlbumId,
      },
      {
        name: {
          en: "Get all Video ID",
          vi: "Tìm tất cả video id",
        },
        description: {
          en: "Get id of all video in current website",
          vi: "Tìm tất cả video id trong trang web",
        },
        func: getAllVideoId,
      },
      {
        name: {
          en: "Get download link of current video",
          vi: "Tải video đang xem",
        },
        description: {
          en: "Get download link of current video",
          vi: "Lấy link để tải video đang xem",
        },
        func: downloadCurrentVideo,
      },
      {
        name: {
          en: "Get download link of current video",
          vi: "Tải video đang xem",
        },
        description: {
          en: "Get download link of current video",
          vi: "Lấy link để tải video đang xem",
        },
        name: "Download album media (beta)",
        description: "Download all media link in album",
        func: downloadAlbumMedia,
      },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "",
    scripts: [
      {
        name: "Get Token",
        description: "Get instagram access token",
        func: getTokenInsta,
      },
      {
        name: "Get User ID",
        description: "Get id of instagram user",
        func: getUidInsta,
      },
      {
        name: "Get all media of user",
        description: "Get all media of instagram user",
        func: getAllUserMedia,
      },
      {
        name: "Get all images in newfeed",
        description: "Get all images in newfeed",
        func: getAllImagesInNewFeed,
      },
      {
        name: "Get all images in user profile",
        description: "Get all images in user profile",
        func: getAllImagesInUserProfile,
      },
    ],
  },
  {
    id: "youtube",
    name: "Youtube",
    description: "",
    scripts: [
      {
        name: {
          en: "Bypass 18+ youtube video",
          vi: "Xem video giới hạn độ tuổi",
        },
        description: {
          en: "Bypass Youtube Adult filter without Sign In",
          vi: "Xem video giới hạn độ tuổi, không cần đăng nhập",
        },
        func: bypassYoutube18,
      },
      {
        name: {
          en: "Toggle light",
          vi: "Tắt/Mở đèn",
        },
        description: {
          en: "Toggle light on/off to focus to video",
          vi: "Tắt/Mở đèn để tập trung xem video",
        },
        func: toggleLight,
      },
    ],
  },
  {
    id: "github",
    name: "Github",
    description: "",
    scripts: [
      {
        name: "Go to first commit",
        description: "Go to first commit of repo",
        func: goToFirstCommit,
      },
      {
        name: "Open repo in github1s.com",
        description: "Open current repo in github1s.com",
        func: github1s,
      },
    ],
  },
  {
    id: "doutube",
    name: "Doutu.be",
    description: "",
    scripts: [
      {
        name: "Enable download all video",
        description: "Enable download button for all video",
        func: enableDownloadVideo,
      },
      {
        name: "Download watching video",
        description: "Download video that you are watching",
        func: downloadWatchingVideo,
      },
      {
        name: "Download watching story",
        description: "Download story that you are watching",
        func: downloadWatchingStory,
      },
      {
        name: "Get all video from user profile ",
        description: "Get all video in user profile",
        func: getAllVideoInUserProfile,
      },
    ],
  },
  {
    id: "pdf",
    name: "PDF",
    description: "",
    scripts: [
      {
        name: "Darkmode for pdf",
        description: "Enable darkmode for PDF",
        func: darkModePDF,
      },
      {
        name: "Web to PDF",
        description: "Convert current website to PDF",
        func: webToPDF,
      },
    ],
  },
  {
    id: "qrcode",
    name: "QR Code",
    description: "",
    scripts: [
      {
        name: "URL to QR Code",
        description: "Convert current website URL to QR Code",
        func: webToQRCode,
      },
      {
        name: "Text to QR Code",
        description: "Convert text to QR Code",
        func: textToQRCode,
      },
    ],
  },
  {
    id: "automation",
    name: "Automation",
    description: "",
    scripts: [
      {
        name: "Scroll to very end",
        description:
          "Scoll to end, then wait for load data, then scroll again...",
        func: scrollToVeryEnd,
      },
    ],
  },
  {
    id: "password",
    name: "Password",
    description: "",
    scripts: [
      {
        name: "Password generator",
        description:
          "Generate unique password for website using master password",
        func: passwordGenerator,
      },
      {
        name: "Find shared login",
        description: "Get free account from bugmenot",
        func: bugMeNot,
      },
      {
        name: "View hidden passwords",
        description: "View hidden password",
        func: viewHiddenPassword,
      },
    ],
  },
  {
    id: "unlock",
    name: "Unlock",
    description: "",
    scripts: [
      {
        name: "Remove cookies",
        description: "Remove cookies from current website",
        func: removeCookies,
      },
      {
        name: "Re-Enable text selection",
        description: "Enable text selection for website",
        func: enableTextSelection,
      },
      {
        name: "Re-Enable context menu (right click)",
        description: "Enable context menu for website",
        func: reEnableContextMenu,
      },
    ],
  },
  {
    id: "table",
    name: "Table",
    description: "",
    scripts: [
      {
        name: "Add sort to table",
        description: "Add sort functions to table",
        func: addSortTable,
      },
      {
        name: "Add number columns",
        description: "Add number columns to table",
        func: addNumberColumn,
      },
      {
        name: "Swap rows and columns",
        description: "Swap rows and columns (transpose)",
        func: swapRowAndColumn,
      },
    ],
  },
  {
    id: "webui",
    name: "Web UI",
    description: "",
    scripts: [
      {
        name: "Check web die",
        description: "Check web die using downforeveryoneorjustme",
        func: checkWebDie,
      },
      {
        name: "Edit page",
        description: "Edit all text in website",
        func: editPage,
      },
      {
        name: "What font",
        description: "Check font used in webpage",
        func: whatFont,
      },
      {
        name: "Remove all colors in web",
        description: "Remove all colours in the web",
        func: removeColours,
      },
      {
        name: "Remove stylesheet",
        description: "Remove all stylesheet from website",
        func: removeStylesheet,
      },
      {
        name: "Remove images",
        description: "Remove all images from website",
        func: removeImages,
      },
      {
        name: "Remove bloat (iframe, embed)",
        description: "Remove iframe, embeds, applets from website",
        func: removeBloat,
      },
      {
        name: "Highlight internal/external link",
        description:
          "Red = Internal_link / Orange = Currently_opened_link / Blue = External_link",
        func: internalOrExternalLink,
      },
      {
        name: "Get window size",
        description:
          "Alerts the width and height in pixels of the inner window.",
        func: getWindowSize,
      },
      {
        name: "Let it snow",
        description: "Make website like it snowing",
        func: letItSnow,
      },
    ],
  },
  {
    id: "more",
    name: "More...",
    description: "",
    scripts: [
      {
        name: "Shorten URL (j2team)",
        description: "Shorten URL using j2team.dev",
        func: shortenURL,
      },
      {
        name: "View all images in web",
        description: "View all images in web",
        func: listAllImagesInWeb,
      },
      {
        name: "View scripts used in website",
        description: "View all scripts used in current website",
        func: viewScriptsUsed,
      },
      {
        name: "View stylesheet used in website",
        description: "View all stylesheet used in current website",
        func: viewStylesUsed,
      },
      {
        name: "View source code of selected area",
        description: "Just select the area and use this bookmarklet",
        func: viewPartialSource,
      },
      {
        name: "Open wayback url",
        description: "Open wayback url for current website",
        func: openWaybackUrl,
      },
      {
        name: "Run Stat.js",
        description: "Run stat.js in current website",
        func: runStatJs,
      },
    ],
  },
];
