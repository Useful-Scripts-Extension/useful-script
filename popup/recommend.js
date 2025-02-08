import { BADGES } from "../scripts/helpers/badge.js";
import { getLang } from "./helpers/lang.js";

export const Recommend = {
  theresanaiforthat: {
    id: "recommend_theresanaiforthat",
    icon: "https://theresanaiforthat.com/favicon.ico",
    name: {
      en: "There's an AI for that",
      vi: "There's an AI for that - Tìm AI",
    },
    description: {
      en: "Collection of thousand of AI tools. Easy to search by category",
      vi: "Tổng hợp hàng ngàn công cụ AI hiện có. Dễ dàng tìm kiếm theo chủ đề",
    },
    popupScript: {
      onClick: () => window.open("https://theresanaiforthat.com/"),
    },
  },
  timeis: {
    id: "recommend_timeis",
    icon: "https://time.is/favicon.ico",
    name: {
      en: "Time.is - Check your time",
      vi: "Time.is - Kiểm tra thời gian",
    },
    description: {
      en: "Exact time for any time zone.",
      vi: "Đồng hồ chính xác nhất. Kiểm tra đồng hồ trên máy của bạn nhanh hay chậm.",
    },
    popupScript: {
      onClick: () => window.open("https://time.is/"),
    },
  },
  googleTrending: {
    id: "recommend_googleTrending",
    icon: "https://www.gstatic.com/trends/favicon.ico",
    name: {
      en: "Google trending - See what trending now",
      vi: "Google trending - Nội dung nổi bật",
    },
    description: {
      en: "See what people are searching on Google. Top treding every day, realtime.",
      vi: "Xem mọi người đang tìm gì trên google. Thống kê từng ngày, thời gian thực.",
    },
    popupScript: {
      onClick: () => window.open("https://trends.google.com/"),
    },
  },
  archive: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://archive.org/"),
    },
  },
  wappalyzer: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://www.wappalyzer.com/apps/"),
    },
  },
  search_musicTreding: {
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
  search_userscript: {
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
  cobalt: {
    id: "recommend_cobalt",
    icon: "https://cobalt.tools/favicon.ico",
    name: {
      en: "Cobalt - Media downloader",
      vi: "Cobalt - Tải video/nhạc",
    },
    description: {
      en: "Support youtube, tiktok, instagram, twitter/x, bilibili, twitch, vimeo, soundcloud, dailymotion, pinterest, reddit, tumblr, ...",
      vi: "Hỗ trợ youtube, tiktok, instagram, twitter/x, bilibili, twitch, vimeo, soundcloud, dailymotion, pinterest, reddit, tumblr, ...",
    },
    badges: [BADGES.recommend, BADGES.hot],
    buttons: [
      {
        icon: '<i class="fa-brands fa-github"></i>',
        name: {
          vi: "Github",
          en: "Github",
        },
        onClick: () => window.open("https://github.com/imputnet/cobalt"),
      },
    ],
    popupScript: {
      onClick: () => window.open("https://cobalt.tools/"),
    },
  },
  luanxt: {
    id: "recommend_getLinkLuanxt",
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open("https://luanxt.com/get-link-mp3-320-lossless-vip-zing/"),
    },
  },
  picviewer_ce: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open("https://greasyfork.org/en/scripts/24204-picviewer-ce"),
    },
  },
  file_converter: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://file-converter.io/"),
    },
  },
  squoosh_app: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://squoosh.app/"),
    },
  },
  docsdownloader: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://docdownloader.com/"),
    },
  },
  bookmarkSidebar: {
    id: "recommend_BookmarkSidebar",
    icon: "https://lh3.googleusercontent.com/4kT7DxtoPSmSLzTit1w2Vbx7b1L2zkASTrqGzEpBW-qs2EwmLYzBTyv0cvlGZo-rD-s732OIrUXX-C33RHPSFvOj=s0",
    name: {
      en: "Bookmark Sidebar",
      vi: "Bookmark Sidebar",
    },
    description: {
      en: "Very good Bookmark manager, find your bookmarks faster.",
      vi: "Trình quản lý bookmark ngon, tìm kiếm bookmark nhanh hơn bao giờ hết.",
    },
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open(
          "https://chromewebstore.google.com/detail/thanh-d%E1%BA%A5u-trang/jdbnofccmhefkmjbkkdkfiicjkgofkdh"
        ),
    },
  },
  googleAdvanced: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open(
          "https://www.google.com/advanced_search?hl=" + getLang() + "&fg=1"
        ),
    },
  },
  fb_openSaved: {
    id: "fb_openSaved",
    icon: '<i class="fa-solid fa-bookmark fa-lg"></i>',
    name: {
      en: "View your facebook saved",
      vi: "Xem mục đã lưu trên facebook",
    },
    description: {
      en: "View saved contents on Facebook",
      vi: "Xem nội dung bạn đã lưu trên Facebook",
    },

    popupScript: {
      onClick: () => window.open("https://www.facebook.com/saved"),
    },
  },
  fb_openMemories: {
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
  fb_openAdsActivities: {
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
  fb_openAllActivities: {
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
      onClick: () => window.open("https://www.facebook.com/me/allactivity"),
    },
  },
  fb_openVideoActivities: {
    id: "fb_openVideoActivities",
    icon: '<i class="fa-solid fa-film fa-lg"></i>',
    name: {
      en: "Video you watched on facebook",
      vi: "Video bạn vừa xem trên facebook",
    },
    description: {
      en: "View all videos you watched on facebook",
      vi: "Xem lại những video bạn đã xem trên facebook",
    },
    badges: [BADGES.hot],
    popupScript: {
      onClick: () =>
        window.open(
          "https://www.facebook.com/100004848287494/allactivity?activity_history=false&category_key=VIDEOWATCH&manage_mode=false&should_load_landing_page=false"
        ),
    },
  },
  fb_openPassEvents: {
    id: "fb_openPassEvents",
    icon: '<i class="fa-solid fa-calendar-days fa-lg"></i>',
    name: {
      en: "Events joined on facebook",
      vi: "Sự kiện đã tham gia trên facebook",
    },
    description: {
      en: "View pass events that you have joined on facebook.",
      vi: "Xem tất cả sự kiện bạn từng tham gia trên facebook.",
    },
    popupScript: {
      onClick: () => window.open("https://www.facebook.com/events/past"),
    },
  },
  fb_openBirthdays: {
    id: "fb_openBirthdays",
    icon: '<i class="fa-solid fa-cake-candles fa-lg"></i>',
    name: {
      en: "Facebook friend's birthdays",
      vi: "Sinh nhật bạn bè facebook",
    },
    description: {
      en: "View your friend's birthdays each month on facebook",
      vi: "Xem từng tháng có những sinh nhật nào của bạn bè trên facebook.",
    },
    popupScript: {
      onClick: () => window.open("https://www.facebook.com/events/birthdays"),
    },
  },
  fb_openChangeLanguage: {
    id: "fb_openChangeLanguage",
    icon: '<i class="fa-solid fa-language fa-lg"></i>',
    name: {
      en: "Change language facebook",
      vi: "Đổi ngôn ngữ facebook",
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
  fb_openAccountHacked: {
    id: "fb_openAccountHacked",
    icon: '<i class="fa-solid fa-skull fa-lg"></i>',
    name: {
      en: "Recover facebook account",
      vi: "Khôi phục tài khoản facebook",
    },
    description: {
      en: "Your fb account has been hacked? Facebook can help you.",
      vi: "Tài khoản fb của bạn bị hack? Facebook có thể giúp bạn.",
    },
    badges: [BADGES.hot],
    popupScript: {
      onClick: () => window.open("https://fb.com/hacked"),
    },
  },
  improve_youtube: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open(
          "https://chromewebstore.google.com/detail/improve-youtube-%F0%9F%8E%A7-for-yo/bnomihfieiccainjcjblhegjgglakjdd"
        ),
    },
  },
  itTools: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://it-tools.tech/"),
    },
  },
  copyicon: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://copyicon.com/generator/svg-chart"),
    },
  },
  beautifytools: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://beautifytools.com/"),
    },
  },
  cloc: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open("https://github.com/AlDanial/cloc?tab=readme-ov-file"),
    },
  },
  refined_github: {
    id: "recommend_refined_github",
    icon: "https://lh3.googleusercontent.com/4N2wipmBVx1qK0R0E0XdADE31-8IuMylOtO9AyFopOA9i3IQKoCC5L4nYFDy55xpxpk6qKusHuqXyKJqvw8jcJaiqg=s60",
    name: {
      en: "Refined GitHub ",
      vi: "Refined GitHub",
    },
    description: {
      en: "Simplifies the GitHub interface and adds useful features",
      vi: "Sửa giao diện github và thêm hàng tá chức năng hay",
    },
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open(
          "https://chromewebstore.google.com/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf"
        ),
    },
  },
  beecost: {
    id: "recommend_Beecost",
    icon: "https://lh3.googleusercontent.com/QeCUs-fM4mwAmBVRS0VU8NrjJnDnbSsXoqUrCbd8ZbHou03FBPEQOYHAcdcL_rn7NMrUpWMcXoG2m_CrKtAhc-wLgLU=w128-h128-e365-rj-sc0x00ffffff",
    name: { en: "Beecost", vi: "Beecost" },
    description: {
      en: "Check deals/prices in ecommerce websites",
      vi: "Kiểm tra giá/ưu đãi giả khi mua hàng online",
    },
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://beecost.vn/"),
    },
  },
  fastDoc: {
    id: "recommend_fastDoc",
    icon: "https://fastdoc.vn/favicon.png",
    name: {
      en: "FastDoc - Convert PDF/Photo to Word/Excel",
      vi: "FastDoc - Chuyển PDF/Ảnh sang Word/Excel",
    },
    badges: [BADGES.recommend],
    description: {
      en: "Convert Photos & PDF to Excel, Word, Searchable PDF for free",
      vi: "Chuyển đổi hình ảnh và pdf sang Excel, Word, Searchable PDF miễn phí",
    },
    popupScript: {
      onClick: () => window.open("https://fastdoc.vn/"),
    },
  },
  smartPDF: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://smallpdf.com/vi/cac-cong-cu-pdf"),
    },
  },
  pdfstuffs: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://pdfstuff.com/"),
    },
  },
  chromeFlags: {
    id: "recommend_chromeFlags",
    icon: '<i class="fa-solid fa-flask fa-lg"></i>',
    name: {
      en: "Make browser super fast",
      vi: "Tăng tốc tối đa trình duyệt",
    },
    description: {
      en: "Some flags experiments that can make your browser super fast",
      vi: "Các flags giúp trình duyệt của bạn chạy nhanh hơn thỏ",
    },
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open("https://www.androidauthority.com/chrome-flags-1009941/"),
    },
  },
  viewSavedWifiPass: {
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
  leakCheck: {
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
  },
  darkReader: {
    id: "recommend_DarkReader",
    icon: "https://lh3.googleusercontent.com/T66wTLk-gpBBGsMm0SDJJ3VaI8YM0Utr8NaGCSANmXOfb84K-9GmyXORLKoslfxtasKtQ4spDCdq_zlp_t3QQ6SI0A=w128-h128-e365-rj-sc0x00ffffff",
    name: { en: "Dark reader", vi: "Dark reader" },
    description: {
      en: "Darkmode for every website",
      vi: "Chế độ tối cho mọi trang web",
    },
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open(
          "https://chrome.google.com/webstore/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh"
        ),
    },
  },
  cssportal: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () =>
        window.open("https://www.cssportal.com/css-animated-text-generator/"),
    },
  },
  cssloaders: {
    id: "recommend_cssloaders",
    icon: "https://css-loaders.com/fav.png",
    name: {
      en: "CSS Loaders - 600+ css loader",
      vi: "CSS Loaders - 600+ css loading",
    },
    description: {
      en: "The Biggest Collection of Loading Animations. Over 600+ CSS-only loaders made using a single element",
      vi: "Hơn 600 animation loading css miễn phí",
    },
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://css-loaders.com/"),
    },
  },
  uiverse: {
    id: "recommend_uiverse",
    icon: "https://uiverse.io/favicon.ico",
    name: {
      en: "UIverse - Open-Source UI elements",
      vi: "UIverse - Tổng hợp code UI xịn",
    },
    description: {
      en: "Open-Source UI elements for any project.",
      vi: "Tổng hợp code UI mã nguồn mở cho mọi trang web.",
    },
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => window.open("https://uiverse.io/"),
    },
  },
  fontRendering: {
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
    badges: [BADGES.recommend],
    popupScript: {
      onClick: () => {
        window.open("https://greasyfork.org/scripts/416688");
      },
    },
  },
  lol2d: {
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
  revealDeletedFBMessage: {
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
        window.open("https://github.com/HoangTran0410/RevealDeletedFBMessages"),
    },
  },
  FBMediaDownloader: {
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
  nirsoft: {
    id: "recommend_nirsoft",
    icon: "https://www.nirsoft.net/favicon.ico",
    name: { en: "Nirsoft", vi: "Nirsoft" },
    description: {
      en: "A unique collection of small and useful freeware utilities",
      vi: "Tổng hợp bộ công cụ nhanh, nhẹ, miễn phí dành cho windows",
    },
    popupScript: {
      onClick: () => window.open("https://www.nirsoft.net/"),
    },
  },
  CRXViewer: {
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
  uBlockOrigin: {
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
  GoogleTranslate: {
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
  NSFWFilter: {
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
  Violentmonkey: {
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
  Extensity: {
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
  insta_bulkDownload: {
    id: "recommend_fbAIOInstagram",
    icon: "https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png",
    name: {
      en: "Instagram - Bulk download",
      vi: "Instagram - Tải hàng loạt",
    },
    description: {
      en: "Download all user's media on instagram (video/photo/reels/highlight) on Facebook AIO",
      vi: "Tải mọi ảnh/video/reel/highlight của người dùng Instagram với Facebook AIO",
    },
    badges: [BADGES.new, BADGES.hot],
    popupScript: {
      onClick: () =>
        window.open("https://facebook-all-in-one.com/#/bulk-downloader"),
    },
  },
  facebook_aio_stalker: {
    id: "recommend_facebook_aio_stalker",
    icon: "/scripts/fb_aio.png",
    name: {
      en: "Stalk anyone on Facebook AIO",
      vi: "Stalk bất cứ ai với Facebook AIO",
    },
    description: {
      en: "Download all Stories, Photos ,Videos, Albums, Reels, Groups, Pages, ... on Facebook AIO",
      vi: "Tải mọi thứ Story, Ảnh, Video, Album, Reels, Nhóm, Trang, ... với Facebook AIO",
    },
    badges: [BADGES.recommend, BADGES.hot],
    popupScript: {
      onClick: () => window.open("https://facebook-all-in-one.com/"),
    },
  },
};
