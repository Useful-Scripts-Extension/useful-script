## Change logs

<details>
  <summary>v1.67 - 29/05/2024</summary>

### CHỨC NĂNG MỚI

- Cập nhật cấu trúc file script [template](/templates/full.js):
  - Bây giờ mỗi chức năng như 1 extension con. Có đủ đồ chơi cho dev lựa chọn (popup,content,page,background,event,...)
  - Mở rộng khả năng hoạt động của các script.

- Giao diện cài đặt
  - **Chọn ngôn ngữ**: anh / việt
  - **Chọn chủ đề**: sáng / tối hoặc `custom (chủ đề được cộng đồng đóng góp)`
  - **Cuộn chuột siêu mượt**: mượt như sunsilk
  - **Sao lưu / Khôi phục dữ liệu**: Sử dụng khi cập nhật phiên bản mới, cần đưa cài đặt cũ sang.
  - **Đặt lại dữ liệu**: Như cài mới luôn

- Tab Tự động > Tiện ích
  - **Thời gian lướt web**: thống kê thời gian lướt web của bạn. [source](/scripts/web_timer.js)
  - **Tự động khoá trang web**: khoá trang web bất kỳ, cần mật khẩu để mở khoá. [source](/scripts/auto_lockWebsite.js)
  - **Cuộn chuột siêu mượt**: Giúp scroll trang web mượt hơn, tin mình đi dùng sướng lắm [source](/scripts/smoothScroll.js)
  - **Xoá theo dõi trong url**: Xoá các tham số theo dõi trong link, chặn theo dõi từ facebook, google, tiktok, ... [source](/scripts/remove_tracking_in_url.js)
  - **Không tắt trình duyệt khi tắt tab cuối**: Đúng như tên gọi [source](/scripts/prevent_closeBrowser_lastTab.js)
  - **Chống lừa đảo**: Cảnh báo khi truy cập website giả mạo + Tính toán độ an toàn website [source](/scripts/chongLuaDao.js)
  - **Tạo tin nhắn tàng hình**: Tàng hình xong copy gửi bằng facebook, discord, chat ... người nhận cần dùng chức năng này để giải mã. [source](/scripts/createInvisibleText.js)

- Tab Facebook:
  - **Tìm mọi bài viết của bạn bè**: Post trong group/page khác cũng thấy luôn nhé. [source](/scripts/fb_searchPostsForOther.js)

- Tab Instagram:
  - **Tải tất cả following/follower**: xem người khác đnag follow ai, được ai follow trên instagram. [source](/scripts/insta_getFollowForOther.js)

- Tab Tải xuống:
  - **Tải Studocu**: tự động click khi dùng dlstudocu [source](/scripts/studocu_downs.js)

### SỬA CHỨC NĂNG CŨ

- Tab Youtube:
  - **Hiện lượt không thích**: Tự động hiện số lượt không thích ngay nút dislike luôn nhé. [source](/scripts/youtube_viewDislikes.js)

- Tab Mở khoá:
  - **Cho phép sao chép/chuột phải**: Hướng tiếp cận mới, giảm lỗi và bật/tắt dễ dàng. [source](/scripts/simpleAllowCopy.js)

- Tab Giao diện:
  - **Hiển thị FPS 2**: Sử dụng debugger => hỗ trợ mọi trang web. [source](/scripts/showFps_v2.js)
  - **Xoá mọi màu/style/ảnh trong trang web**: Hỗ trợ undo, tắt/mở dễ dàng không cần tải lại trang. [color](/scripts/removeColours.js), [style](/scripts/removeStylesheet.js), [img](/scripts/removeImages.js)
  - **Hiệu ứng tuyết rơi mới**: Đẹp hơn bản cũ nhiều [source](/scripts/letItSnow.js)

### XOÁ CHỨC NĂNG

- **Remove web limit**
- **Fb tin nhắn tàng hình**
- **Xem thông tin trình duyệt**
- **Xem mã nguồn của phần bôi đen**

</details>

<details>
  <summary>v1.66 - 27/04/2024</summary>

### CHỨC NĂNG MỚI

- Tự động tìm và xem ảnh lớn nhất (hỗ trợ gần 100 trang web) [source](/scripts/magnify_image.js)

- Phóng to bất kỳ ảnh nào trong bất kỳ trang web nào Kết hợp tự động tìm ảnh lớn nhất để xem. [source](/scripts/auto_redirectLargestImageSrc.js)

- Picture-in-picture toàn trang web (thay vì chỉ video) [source](/scripts/pip_fullWebsite.js)

- Hack duck race [source](/scripts/duckRace_cheat.js), wheel of names [source](/scripts/wheelOfNames_hack.js)

- Copy file google sheet không cho phép tải [source](/scripts/ggdrive_copySheetText.js)

- Tải file google docs không cho phép tải [source](/scripts/ggdrive_downloadDoc.js)

- Chặn "đã xem" trong instagram story [source](/scripts/insta_anonymousStoryViewer.js)

- remove web limit => cho phép copy, chuột phải trong mọi trang web [source](/scripts/removeWebLimit.js)

- bypass limit similarweb.com [source](/scripts/similarWeb_bypassLimit.js)

### SỬA CHỨC NĂNG CŨ

- Fix Tải hàng loạt tiktok [source](/scripts/tiktok_batchDownload.js)

- Fix tải video tiktok đang xem [source](/scripts/tiktok_downloadWatchingVideo.js)

- Xuất bookmarks ra file json [source](/scripts/bookmark_exporter.js)

- Tối ưu downDetector - thống kê sự cố web [source](/scripts/downDetector.js)

- Tối ưu "Lấy tất cả fb uid trong trang fb tìm kiếm" -> nhanh hơn 1000 lần [source](/scripts/fb_getAllUidFromFbSearch.js)

- Fix "Lấy tất cả member uid từ group fb" [source](/scripts/fb_getAllUidOfGroupMembers.js)

- Fix "Xem ai đang nhắn tin cho bạn" -> chỉ dùng được cho cuộc trò chuyện không mã hoá [source](/scripts/fb_whoIsTyping.js)

- fix studocu bypass preview - xoá popup, xoá hiệu ứng làm mờ [source](/scripts/studocu_bypassPreview.js)

- fix tải file doc trên tailieu.vn [source](/scripts/tailieu_vn.js)

- nhúng script vào bất kỳ trang web nào [source](/scripts/injectScriptToWebsite.js)

- optimize tự động scroll tới cuối web [source](/scripts/scrollToVeryEnd.js)

- tối ưu giải mã link rút gọn [source](/scripts/unshorten.js)

- tối ưu shorten URL [source](/scripts/shortenURL.js)

- new "text to QRCode" [source](/scripts/textToQrCode.js)

- Tối ưu whatFont - check font chữ web [source](/scripts/whatFont.js)

### XOÁ CHỨC NĂNG

- tải video comment facebook -> có thể dùng chức năng "tải video fb đang xem" thay thế

- get token m.facebook.com => không còn dùng được

- Tải tất cả ảnh new feed instagram => không ổn định

- Tải tất cả ảnh profile user instagram (scroll) => không ổn định, dùng chức năng tải bằng API thay thế.

- Bật lại menu chuột phải => dùng remove web limit thay thế

- các chức năng doutu.be

- image downloader/show the images -> gợi ý những tool dễ sử dụng hơn

- bypass trang preview của envato - không còn dùng được

- scroll by drag

- fastDoc

- tải story whatapp

### TỐI ƯU KHÁC

- giảm thời gian khởi động

- chon ngôn ngữ

- hình demo từng chức năng

- changelogs từng chức năng

- sắp xếp lại

### NHỮNG CON SỐ BIẾT NÓI

- 30 ngày

- 156 files được thêm/sửa/xoá

- 3.972 dòng code được xoá

- 11.768 dòng code mới

  [Tất cả Chức năng](./LIST_SCRIPTS_VI.md)

</details>

<details>
  <summary>v1.65-hotfix - 08/04/2024</summary>

  Fix các chức năng tự động chạy

  Optimize scripts autorun

  Bữa 03/04 fix chưa hết :(

  [Tất cả Chức năng](./LIST_SCRIPTS_VI.md)

</details>

<details>
  <summary>v1.64-hotfix - 03/04/2024</summary>

  Thật ra chưa muốn nâng version đâu tại đang làm/sửa nhiều chức năng.

  Nhưng khổ nỗi google cập nhật gì đó khiến các chức năng lỗi gần hết. Phải fix và nâng version gấp trong đêm :(

  1 vài chức năng nổi bật ở version này:

- Xem các group fb mà bạn bè đang tham gia
- Xem các page fb mà bạn bè đang thích
- Tải file pdf/power-point bị chặn tải trên google drive
- Thêm nút tải nhạc/hình/video cho soundcloud/spotify/twitter
- Mở khoá Fireship PRO -> xem khoá học free
- Cập nhật tab Khuyên dùng

  [Tất cả Chức năng](./LIST_SCRIPTS_VI.md)

</details>

<details>
  <summary>v1.6 - 13/03/2024</summary>

  Cập nhật quá nhiều thứ :v

  Thôi thì các bạn cứ xem danh sách chức năng là được nhé.

  [Tất cả Chức năng](./LIST_SCRIPTS_VI.md)

</details>

<details>
  <summary>v1.5 - 12/07/2023</summary>

- Sửa script xem tin nhắn thu hồi
- Sửa script thông báo ai đang gõ tin nhắn cho bạn

</details>

<details>
  <summary>v1.4 - 25/12/2022</summary>

- 57 script mới (Tổng 160 scripts):

  1. anti_clickjacking
  2. changeAudioOutput
  3. detect_zeroWidthCharacters
  4. dino_hack
  5. docDownloader
  6. donotBlockMe
  7. douyin_downloadAllVideoUser
  8. envato_bypassPreview
  9. fastDoc
  10. fb_antiPhishing
  11. fb_downloadCommentVideo
  12. fb_downloadWatchingVideo
  13. fb_exportSaved
  14. fb_invisible_message
  15. fb_messengerCount
  16. fb_messengerCount_main
  17. fb_openAdsActivities
  18. fb_openMemories
  19. fb_openSaved
  20. fb_removeFbclid
  21. fb_revealDeletedMessages
  22. fb_storySaver
  23. fb_toggleNewFeed
  24. fb_whoIsTyping
  25. freesound_downloadAudio
  26. ggDrive_downloadAllVideosInFolder
  27. ggdrive_downloadVideo
  28. ggdrive_generateDirectLink
  29. github_goToAnyCommit
  30. google_downloadAllYourData
  31. google_mirror
  32. insta_injectDownloadBtn
  33. insta_storySaver
  34. pdfstuffs
  35. savevideo_me
  36. scribd_bypassPreview
  37. scribd_downloadDocuments
  38. search_hopamchuan
  39. search_musicTreding
  40. search_userscript
  41. send_shareFiles
  42. shopee_topVariation
  43. shopee_totalSpendMoney
  44. showTheVideos
  45. simpleAllowCopy
  46. smartPDF
  47. studocu_bypassPreview
  48. studocu_dl
  49. studocu_downs
  50. studyphim_unlimited
  51. tiki_totalSpendMoney
  52. tiktok_downloadUserVideos
  53. tiktok_downloadWatchingVideo
  54. tiktok_snaptikApp
  55. tiktok_snaptikVideo
  56. vimeo_downloader
  57. whatApp_storySaver

- Fix/Update các scripts:

  1. douyin_downloadVideo
  2. fb_getAllUidFromFriendsPage
  3. fb_getAvatarFromUid
  4. fb_getTimelineAlbumId
  5. fb_getUid
  6. fb_getUidFromUrl
  7. fb_toggleLight
  8. fb_videoDownloader
  9. getAllEmailsInWeb
  10. insta_getAllImagesInNewFeed
  11. insta_getAllUserMedia
  12. scrollToVeryEnd
  13. tiktok_downloadVideo
  14. zingmp3_oldLayout

- Xóa các scripts:

  1. download_video
  2. download_video2
  3. enableTextSelection
  4. fb_getAllVideoId
  5. fb_getTokenLocmai
  6. github_goToFirstCommit
  7. insta_reloaded
  8. paywallKiller
  9. youtube_popupPlayer

- Fix/Update extension:

  - Thêm logic cho các **script tự động chạy** (onDocumentStart, onDocumentEnd, onDocumentIdle)
  - Thêm **ô tìm kiếm** script nhanh hơn
  - Loại bỏ tab Hot, tab New, Open extension in popup, runInExtensionContext
  - Thêm **tab Autorun, tab Tất cả**
  - Thêm **infoLink** cho các script (mở trang demo hoặc giới thiệu script)
  - Thêm **UfsGlobal** và **content-script** (dùng cho các chức năng tự động chạy)

</details>

<details>
  <summary>v1.3 - 27/11/2022</summary>

- 28 scripts mới:

  1. getLinkLuanxt
  2. getFavicon
  3. download_audio
  4. nhaccuatui_downloader
  5. zingmp3_downloadMusic
  6. zingmp3_oldLayout
  7. download_video2
  8. download_image
  9. fb_checkToken
  10. fb_getTokenBussinessLocation
  11. fb_getTokenBusinessStudio
  12. fb_getTokenCampaigns
  13. fb_getTokenLocmai
  14. fb_videoDownloader
  15. insta_getUserInfo
  16. instantgram
  17. tiktok_downloadVideo
  18. douyin_downloadVideo
  19. getAllEmailsInWeb
  20. screenshotFullPage
  21. webToPDF
  22. transfer_sh
  23. jsonformatter
  24. shortenURL
  25. unshorten
  26. viewBrowserInfo
  27. injectScriptToWebsite
  28. visualEvent

- Fix/Update các scripts:

  1. archiveToday
  2. checkWebDie
  3. darkModePDF
  4. doutube_downloadWatchingVideo
  5. doutube_getAllVideoInUserProfile
  6. fb_downloadAlbumMedia
  7. fb_getAvatarFromUid
  8. fb_getTimelineAlbumId
  9. fb_getTokenMFacebook
  10. fb_getUid
  11. googleCache
  12. openWaybackUrl
  13. search_sharedAccount
  14. shortenURL
  15. showTheImages
  16. textToQRCode
  17. viewCookies
  18. youtube_downloadVideo

- Fix/Update extension:
  - **hot tab**: hiển thị tất cả scripts có badge 'hot'
  - **new tab**: hiển thị tất cả scripts badge 'new'
  - **open extension in external popup**: Mở extension sang popup window mới, ko bị tắt popup khi chuyển trang
  - **content-script**: document_start, document_idle, document_end
  - **useful-scripts-utils**: hỗ trợ dev trong quá trình hack web, tạo script mới :))
  - **runInExtensionContext**: script chạy trong extension context sẽ có nhiều quyền hơn, khi fetch không bị lỗi cors, truy cập được các quyền dành riêng cho extension, ...
  - **loading UI**: giao diện loading, dành cho các script runInExtensionContext=true

</details>

<details>
  <summary>v1.2 - 08/11/2022</summary>

- 9 scripts mới:

  1. archiveToday
  2. cssSelectorViewer
  3. download_video2
  4. getAllEmailsInWeb
  5. payWallKiller
  6. showHiddenFields
  7. showTheImages
  8. viewWebMetaInfo
  9. whois
  10. youtube nonstop

- Fix các scripts:

  1. perfomanceAnalyzer
  2. remove cookies
  3. view cookies
  4. viewPartialSource
  5. youtube_downloadVideo

- Fix extension:
  - await in lang.js (bug crash on cent browser)
  - add globalBlackList: không chạy code trong `edge://*` hoặc `chrome://*`

</details>

<details>
  <summary>v1.1 - 7/11/2022</summary>

- 83 scripts
- public lên j2team: [Facebook post](https://www.facebook.com/groups/j2team.community/posts/1983670308631746/)

</details>
