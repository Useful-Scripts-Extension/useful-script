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
import { toggleEditPage } from "./webUI/toggleEditPage.js";
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
import { toggleLight as toggleLightFB } from "./facebook/toggleLight.js";

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
        type: "title",
        name: { en: "--- UI ---", vi: "--- Giao diện ---" },
      },
      {
        name: { en: "Hide side UI", vi: "Ẩn giao diện 2 bên" },
        description: {
          en: "Hide Navigator bar and complementary bar",
          vi: "Ẩn giao diện 2 bên newfeed, giúp tập trung vào newfeed",
        },
        func: toggleLightFB,
      },
      {
        type: "title",
        name: { en: "--- Access Token ---", vi: "--- Access Token ---" },
      },
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
        type: "title",
        name: { en: "--- Get ID ---", vi: "--- Lấy ID ---" },
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
        type: "title",
        name: { en: "--- Download ---", vi: "--- Tải xuống ---" },
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
        func: downloadAlbumMedia,
      },
    ],
  },
  {
    id: "instagram",
    name: { en: "Instagram", vi: "Instagram" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Get Token", vi: "Lấy token" },
        description: {
          en: "Get instagram access token",
          vi: "Lấy instagram access token",
        },
        func: getTokenInsta,
      },
      {
        name: { en: "Get your User ID", vi: "Lấy user id của bạn" },
        description: {
          en: "Get id of your instagram user",
          vi: "Lấy id của người dùng instagram đang đăng nhập",
        },
        func: getUidInsta,
      },
      {
        name: { en: "Get all media of user", vi: "Tải về tất media của user" },
        description: {
          en: "Get all media of instagram user",
          vi: "Tải về tất cả ảnh/video của người dùng insta",
        },
        func: getAllUserMedia,
      },
      {
        name: {
          en: "Get all images in newfeed",
          vi: "Tải về tất cả ảnh newfeed",
        },
        description: {
          en: "Get all images in newfeed",
          vi: "Tải về tất cả ảnh đang có trên newfeed",
        },
        func: getAllImagesInNewFeed,
      },
      {
        name: {
          en: "Get all images in user profile",
          vi: "Tải tất cả ảnh user profile",
        },
        description: {
          en: "Get all images in user profile",
          vi: "Tải tất cả ảnh có trong profile của user bất kỳ",
        },
        func: getAllImagesInUserProfile,
      },
    ],
  },
  {
    id: "youtube",
    name: { en: "Youtube", vi: "Youtube" },
    description: { en: "", vi: "" },
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
    name: { en: "Github", vi: "Github" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Go to first commit", vi: "Đi tới commit đầu tiên" },
        description: {
          en: "Go to first commit of repo",
          vi: "Đi tới commit đầu tiên của repo",
        },
        func: goToFirstCommit,
      },
      {
        name: {
          en: "Open repo in github1s.com",
          vi: "Mở repo trong github1s.com",
        },
        description: {
          en: "Open current repo in github1s.com",
          vi: "Mở repo hiện tại trong trang github1s.com để xem code",
        },
        func: github1s,
      },
    ],
  },
  {
    id: "doutube",
    name: { en: "Doutu.be", vi: "Doutu.be" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Enable download all video", vi: "Bật tải mọi video" },
        description: {
          en: "Enable download button for all video",
          vi: "Bật chức năng download cho mọi video trong trang",
        },
        func: enableDownloadVideo,
      },
      {
        name: { en: "Download watching video", vi: "Tải video đang xem" },
        description: {
          en: "Download video that you are watching",
          vi: "Tải video bạn đang xem",
        },
        func: downloadWatchingVideo,
      },
      {
        name: { en: "Download watching story", vi: "Tải story đang xem" },
        description: {
          en: "Download story that you are watching",
          vi: "Tải story bạn đang xem",
        },
        func: downloadWatchingStory,
      },
      {
        name: {
          en: "Get all video from user profile ",
          vi: "Tải tất cả video từ profile",
        },
        description: {
          en: "Get all video in user profile",
          vi: "Tải tất cả video từ profile của user bất kỳ",
        },
        func: getAllVideoInUserProfile,
      },
    ],
  },
  {
    id: "pdf",
    name: { en: "PDF", vi: "PDF" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Darkmode for pdf", vi: "Chế độ tối cho PDF" },
        description: {
          en: "Enable darkmode for PDF",
          vi: "Bật chế độ tối cho PDF bạn đang xem",
        },
        func: darkModePDF,
      },
      {
        name: { en: "Web to PDF", vi: "In web ra PDF" },
        description: {
          en: "Convert current website to PDF",
          vi: "Chuyển trang web hiện tại thành PDF",
        },
        func: webToPDF,
      },
    ],
  },
  {
    id: "qrcode",
    name: { en: "QR Code", vi: "QR Code" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "URL to QR Code", vi: "Lấy QRCode cho web hiện tại" },
        description: {
          en: "Convert current website URL to QR Code",
          vi: "Chuyển URL của trang web sang QR Code",
        },
        func: webToQRCode,
      },
      {
        name: { en: "Text to QR Code", vi: "Chuyển chữ thành QRCode" },
        description: {
          en: "Convert text to QR Code",
          vi: "Nhập vào chữ và nhận về QRCode tương ứng",
        },
        func: textToQRCode,
      },
    ],
  },
  {
    id: "automation",
    name: { en: "Automation", vi: "Tự động hoá" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Scroll to very end", vi: "Cuộn trang xuống cuối cùng" },
        description: {
          en: "Scoll to end, then wait for load data, then scroll again...",
          vi: "Cuộn tới khi nào không còn data load thêm nữa (trong 5s) thì thôi.",
        },
        func: scrollToVeryEnd,
      },
    ],
  },
  {
    id: "password",
    name: { en: "Password", vi: "Mật khẩu" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Password generator", vi: "Tạo mật khẩu cho trang web" },
        description: {
          en: "You only have to remember 1 password",
          vi: "Bạn chỉ còn cần phải nhớ 1 mật khẩu",
        },
        func: passwordGenerator,
      },
      {
        name: { en: "Find shared login", vi: "Tìm tài khoản miễn phí" },
        description: {
          en: "Get free account from bugmenot",
          vi: "Tìm tài khoản được chia sẻ trên mạng cho trang web hiện tại",
        },
        func: bugMeNot,
      },
      {
        name: { en: "View hidden passwords", vi: "Xem mật khẩu bị ẩn" },
        description: {
          en: "View hidden password",
          vi: "Bạn sẽ xem được mật khẩu bị ẩn (dấu sao *) trong khung đăng nhập",
        },
        func: viewHiddenPassword,
      },
    ],
  },
  {
    id: "unlock",
    name: { en: "Unlock", vi: "Mở khoá" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Remove cookies", vi: "Xoá Cookies" },
        description: {
          en: "Remove cookies from current website",
          vi: "Xoá cookies trang hiện tại",
        },
        func: removeCookies,
      },
      {
        name: { en: "Re-Enable text selection", vi: "Bật text selection" },
        description: {
          en: "Enable text selection for website",
          vi: "Dùng cho web nào không cho phép bôi đen văn bản",
        },
        func: enableTextSelection,
      },
      {
        name: {
          en: "Re-Enable context menu (right click)",
          vi: "Bật menu chuột phải",
        },
        description: {
          en: "Enable context menu for website",
          vi: "Dùng cho web nào không cho phép bật menu chuột phải",
        },
        func: reEnableContextMenu,
      },
    ],
  },
  {
    id: "table",
    name: { en: "Table", vi: "Table" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Add sort to table", vi: "Thêm sắp xếp cho bảng" },
        description: {
          en: "Add sort functions to table",
          vi: "Thêm nút chức năng sắp xếp cho từng cột trong table",
        },
        func: addSortTable,
      },
      {
        name: { en: "Add number columns", vi: "Thêm cột số thứ tự" },
        description: {
          en: "Add number columns to table",
          vi: "Thêm cột STT vào bên trái bảng",
        },
        func: addNumberColumn,
      },
      {
        name: { en: "Swap rows and columns", vi: "Đổi chỗ hàng và cột" },
        description: {
          en: "Swap rows and columns (transpose)",
          vi: "Hàng thành cột và cột thành hàng",
        },
        func: swapRowAndColumn,
      },
    ],
  },
  {
    id: "webui",
    name: { en: "Web UI", vi: "Giao diện" },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Check web die", vi: "Kiểm tra tình trạng web die" },
        description: {
          en: "Check web die using downforeveryoneorjustme",
          vi: "Dùng bên thứ 3 để kiểm tra xem website có bị die thật không",
        },
        func: checkWebDie,
      },
      {
        name: {
          en: "Toggle edit page",
          vi: "Bật/tắt chế độ chỉnh sửa website",
        },
        description: {
          en: "Edit all text in website",
          vi: "Cho phép chỉnh sửa mọi văn bản trong website",
        },
        func: toggleEditPage,
      },
      {
        name: { en: "What font", vi: "Kiểm tra font chữ" },
        description: {
          en: "Check font used in webpage",
          vi: "Kiểm tra xem từng phần từ trong web dùng font chữ gì",
        },
        func: whatFont,
      },
      {
        name: { en: "Remove all colors in web", vi: "Xoá màu website" },
        description: {
          en: "Remove all colours in the web",
          vi: "Xoá mọi màu có trong website",
        },
        func: removeColours,
      },
      {
        name: { en: "Remove stylesheet", vi: "Xoá stylesheet" },
        description: {
          en: "Remove all stylesheet from website",
          vi: "Xem trang web sẽ ra sao khi không có css",
        },
        func: removeStylesheet,
      },
      {
        name: { en: "Remove images", vi: "Xoá mọi hình ảnh" },
        description: {
          en: "Remove all images from website",
          vi: "Chỉ để lại văn bản, giúp tập trung hơn",
        },
        func: removeImages,
      },
      {
        name: {
          en: "Remove bloat (iframe, embed)",
          vi: "Xoá mọi iframe/embed",
        },
        description: {
          en: "Remove iframe, embeds, applets from website",
          vi: "Xoá mọi thứ gây xao nhãng (quảng cáo, web nhúng, ..)",
        },
        func: removeBloat,
      },
      {
        name: { en: "Highlight internal/external link", vi: "Tô màu cho link" },
        description: {
          en: "+Red = Internal_link\n+Orange = Currently_opened_link\n+Blue = External_link",
          vi: "+Đỏ: cùng domain\n+Cam: hiện tại\n+Xanh: khác domain",
        },
        func: internalOrExternalLink,
      },
      {
        name: { en: "Get window size", vi: "Lấy kích thước trang web" },
        description: {
          en: "Alerts the width and height in pixels of the inner window.",
          vi: "đơn vị pixels",
        },
        func: getWindowSize,
      },
      {
        name: { en: "Let it snow", vi: "Hiệu ứng tuyết rơi" },
        description: {
          en: "Make website like it snowing",
          vi: "Thêm hiệu ứng tuyết rơi vào trang web",
        },
        func: letItSnow,
      },
    ],
  },
  {
    id: "more",
    name: { en: "More...", vi: "Khác..." },
    description: { en: "", vi: "" },
    scripts: [
      {
        name: { en: "Shorten URL (j2team)", vi: "Rút gọn link (j2team)" },
        description: {
          en: "Shorten URL using j2team.dev",
          vi: "Rút gọn link dùng công cụ của j2team",
        },
        func: shortenURL,
      },
      {
        name: {
          en: "View all images in web",
          vi: "Xem mọi hình ảnh có trong website",
        },
        description: {
          en: "View all images in web",
          vi: "Xem danh sách hình ảnh trong tab mới",
        },
        func: listAllImagesInWeb,
      },
      {
        name: {
          en: "View scripts used in website",
          vi: "Xem tất cả scripts có trong web",
        },
        description: {
          en: "View all scripts used in current website",
          vi: "Mở danh sách scripts trong tab mới",
        },
        func: viewScriptsUsed,
      },
      {
        name: {
          en: "View stylesheet used in website",
          vi: "Xem tất cả stylesheet (css)",
        },
        description: {
          en: "View all stylesheet used in current website",
          vi: "Mở danh sách css trong tab mới",
        },
        func: viewStylesUsed,
      },
      {
        name: {
          en: "View source code of selected area",
          vi: "Xem mã nguồn của phần bôi đen",
        },
        description: {
          en: "Just select the area and use this bookmarklet",
          vi: "Mở mã nguồn của phần được bôi đen trong tab mới",
        },
        func: viewPartialSource,
      },
      {
        name: { en: "Open wayback url", vi: "Xem wayback url của website" },
        description: {
          en: "Open wayback url for current website",
          vi: "Giúp xem nội dung website trong quá khứ",
        },
        func: openWaybackUrl,
      },
      {
        name: { en: "Run Stat.js", vi: "Chạy stats.js" },
        description: {
          en: "Run stat.js in current website",
          vi: "Tính toán FPS website",
        },
        func: runStatJs,
      },
    ],
  },
];
