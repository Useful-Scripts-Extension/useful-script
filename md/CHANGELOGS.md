## Change logs

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
  - Thêm **UsefulScriptGlobalPageContext** và **content-script** (dùng cho các chức năng tự động chạy)

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
