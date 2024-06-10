fetch("https://www.facebook.com/api/graphql/", {
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9,pt;q=0.8,vi;q=0.7",
    "content-type": "application/x-www-form-urlencoded",
    priority: "u=1, i",
    "sec-ch-prefers-color-scheme": "dark",
    "sec-ch-ua":
      '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    "sec-ch-ua-full-version-list":
      '"Microsoft Edge";v="125.0.2535.92", "Chromium";v="125.0.6422.142", "Not.A/Brand";v="24.0.0.0"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": '""',
    "sec-ch-ua-platform": '"Windows"',
    "sec-ch-ua-platform-version": '"15.0.0"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-asbd-id": "129477",
    "x-fb-friendly-name": "ProfileCometLegacyAlbumGridViewPaginationQuery",
    "x-fb-lsd": "a0tVGc3wuRQmO41O-PnolD",
  },
  referrer: "https://www.facebook.com",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: "av=100004848287494&__aaid=0&__user=100004848287494&__a=1&__req=17&__hs=19883.HYP%3Acomet_pkg.2.1..2.1&dpr=1&__ccg=EXCELLENT&__rev=1014083606&__s=mubm1q%3Agr2pb4%3A0d3czh&__hsi=7378365151053260358&__dyn=7AzHK4HwkEng5K8G6EjBAg2owIxu13wFwhUngS3q2ibwNwnof8boG0x8bo6u3y4o2Gwfi0LVEtwMw65xO2OU7m221Fwgo9oO0n24oaEnxO0Bo7O2l2Utwwwi831wiE567Udo5qfK0zEkxe2GewyAG1jwUBwJK2W5olwSU464-5pUfEe88o4Wm7-2K0SEuBwFKq2-azo2NwwwOg2cwMwhEkxebwHwNxe6Uak0zU8oC1hxB0qo4e16wWwjHDzUiwRK6E4-8wLwHw&__csr=ghgm8JisIh2s8sTeIlORlIviL4HtnslT9vaB-yWPOcBEIykjhjRSZeGSKEyyauGnkzQVGV4F9oZaRADHYORQ4qVq-rXCAy9aQFp6AuozmaUKayGy9QV5KAmey9p474699fy8Z2ppVrxh2lyHzUiK79efzojDAzqByE942udye4ELxaUnKcU2ggKu48-1bwExWcxK48pCggyokCxi8xe68-2C1rw8-2e3d0oEhwxwamfwkUG1Jw9m1Uwsoa8owlUtw6ewSwlQ09Hw4GwpEixut2F40wU0B-1Fw058Ew2CU0vxw8y3a04Bo1bE0n6g0gRw1Yu5oa8jweaEiglw3jo0TC03ii9w0WOyU1No0aFo&__comet_req=15&fb_dtsg=NAcPStWFgbMiGXZXZOnwEnL5_Lb2lJUgWzJk_K9_Jnqqx4PmW5nAq1Q%3A31%3A1717901263&jazoest=25567&lsd=a0tVGc3wuRQmO41O-PnolD&__spin_r=1014083606&__spin_b=trunk&__spin_t=1717909507&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=ProfileCometLegacyAlbumGridViewPaginationQuery&variables=%7B%22count%22%3A14%2C%22cursor%22%3A%22ZmJpZDo3ODA1MzgwNjQxMTQxOTg%3D%22%2C%22scale%22%3A1%2C%22id%22%3A%22410871501080858%22%7D&server_timestamps=true&doc_id=5520045484790315",
  method: "POST",
  mode: "cors",
  credentials: "include",
});

let gridquery = {
  fb_api_req_friendly_name: "ProfileCometLegacyAlbumGridViewPaginationQuery",
  variables: {
    count: 14,
    cursor: "ZmJpZDoxMDIzMTAwNTIyODE4MTc2",
    scale: 1,
    id: "775458280915736",
  },
  server_timestamps: true,
  doc_id: 5520045484790315,
};

// photo large

// fb_api_caller_class: RelayModern
// fb_api_req_friendly_name: CometPhotoRootContentQuery
// doc_id: 7575853042491661

let photo = {
  isMediaset: true,
  renderLocation: "permalink",
  nodeID: "1135873676599182", // photo id
  mediasetToken: "t.100005790064192", // user id
  scale: 1,
  feedLocation: "COMET_MEDIA_VIEWER",
  feedbackSource: 65,
  focusCommentID: null,
  glbFileURIHackToRenderAs3D_DO_NOT_USE: null,
  privacySelectorRenderLocation: "COMET_MEDIA_VIEWER",
  useDefaultActor: false,
  useHScroll: false,
  __relay_internal__pv__CometIsAdaptiveUFIEnabledrelayprovider: false,
  __relay_internal__pv__CometUFIShareActionMigrationrelayprovider: false,
  __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
  __relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider: false,
};

// download photo - reqiure story id
let a = {
  fb_api_req_friendly_name: ProfileCometAppCollectionMediaActionsMenuQuery,
  variables: {
    feed_location: "COMET_MEDIA_VIEWER",
    id: "UzpfSTEwMDA1MzU0NzE0MzIxNDpWSzoxMDIzNDA3ODIyNzg3NDQ2",
    scale: 1,
  },
  server_timestamps: true,
  doc_id: 25670776369237611,
};

// search posts
let searchPosts = {
  fb_api_req_friendly_name: "SearchCometResultsPaginatedResultsQuery",
  variables: {
    count: 5,
    allow_streaming: false,
    args: {
      callsite: "COMET_GLOBAL_SEARCH",
      config: {
        exact_match: false,
        high_confidence_config: null,
        intercept_config: null,
        sts_disambiguation: null,
        watch_config: null,
      },
      context: { tsid: null },
      experience: {
        encoded_server_defined_params: null,
        fbid: null,
        type: "POSTS_TAB",
      },
      filters: [],
      text: "script",
    },
    cursor:
      "AbqUVzjF5zQPJGxYOsRiZJzHli50lmfUBZn-Lhr0Z2Li1Yoj0eGHL9sb87kd0jrpxDzL_5SCinyVfVXddYvsnYrhRyScmrVvmK7KEGjPEy5qpZUfZVbofRzYHQbyexrTpECdeN6CM8QYi0xF7FCR8ButW00BHPtcKRk7UlIVrT0KjsXWiUBLlEDVudMdzP6mDF2LaGKmV-cAcSwunJRkd-wG8domrRtaP9fzuHsoY46syIENI_iAnsI2fNUjGLk4eLO0KbzdygDVeh8NDfgTYAuMZqphA2xPus98HtMh_nzodSK8UpKay4hLcVWLetc-FVxzW4BDaw7_eT5MgAUi-lzUQ_GRJ09tH6Nxuf4fnjlFgbZB3SR7m0TlU8IQF2-dRFHKZ-HAdFiU_iMyC-MOjJgi0oV9GCGGGUPwfxiSGSrUmGXg8_S3iyNg_5HSToXNM6E8Zjc-zOhjHTW4osBUpQbKKy5XcclxxSiCZIe52k-NyKjyTqTU3n4RE-Y-FKo01GqkuwFsqaspmW_EOkmNzZKlFwQL6nxkoZsHXdpAC87rLJ7lBA-3nNrz_mC-GPesnm_PlV89vB6gn5nYNMoqUfV_tDi5DCq4-IhkodahsEsahErzTSLmq6Kl_JnN9DaiT3D8tSs2GBressGgG3ZftjCQQyTN9ageLI-Nk0CscS7aJNwmhuewsyuaOe6eba8C3k_w6p0SKMRRMPOky1gNHs-SBwxvgSMhLXnPCuLKzaYug1QV9bbRyBe-kYGmai3RxR2hZBngWy4AdlZrQiG6yphLXp6rMJUIcZpg6tVb-ZSMIoTi9dcSifN-sJdWOhF9nHpauJOsvaeSDjxtBWiV6fwAN4aUO59RiSxZSPguU3nyAMH00abzAve_Es4UtdIpfzA_tPoVTu1dOXqzRdeWOYFw-K0SDNOgWVloR4bfrsJqmg83Ukcu-hzskktLkpoQX7QsuTNajm-FKTaqtl_tRN53glqhs83_ido01cHamnQ6S5HltHrSR8HUOKpsuMJnX5wYd9x9o9y1YzUNyT12lnCrzq7qMJl4Ods71PDLQ5i-ny1lphTkJfHvSb9JQ68VVNL7-2vFykov4XAOuVN4x2lBQmnPlhSqwZek7WSTjT4rF2AVEGIT8E8iHqsiFDyE_jrkX3gMNjDE06DFBQyO9OqdEaYNsecZtP9UeQ7TG_Gef6dkLU4LiMtgzc9uaIoxUMxULLaN8kwLVRw_mS4faftkZhT5YS85A52A7kCmuEot3lmXcB_LSXjhXtCrbdTSVyc7qt9bC2oZn6iZTYU3T0Mm-HH60hpNWc0Yicb2TPSu5xRwf65h1IeKDecKTBQMy_tFjikI3LQCPXEXfG1NUZnXBKv3FBndpnLL3FWFA9CHErzE4cba2Yd_i4_VXSi7gi00TLPyCfBqu7U3A-5_Y3KPk8jblbVJNVeAYEqSYPF2Do-RWX4uLRaIf_I8_IvobjHomFzaYuctq7PFWhHxEHQrcHRdLROXJRi_Wbpj96yjHkzoeDxO5nF3b9aYGKLk7isLXf0t5pbQDMxekSwU8dxDg41LI3nAr6MmOresYWI_kvZL6BsdA1ttxpWhzV3-u8hGMtMoLdvSbEQUrF1oT9J_cYqcOZWBjQzd2UbZJ1VtpFUgapY8-5ype_468Bd4P19lEDCXYWbI3zgamDjuLoKqdtVU8X8aZkNserQ5xrVC3tvPQnIdPqC3lst2jJHrItRDBgYXZDLVSEKUx07hdnpfuHkdrCz7QIQ08nY9j5b4B1RbefvQ6o9m7zzHF5xaCN9RH1d6xVpF_cuJ99gHli_7Xa2LdmWpr6G_0QaLtUnvGVTVbW2ZNeg2rP94FroXoie1BuNf1RZNX35lrawQNC67ErS3SnDsd6ZU3Pd5E2na23DvnH666GOoWyp-7qeG3TJkMhinGGz3Ysv39Icq3bMYDFKF1Du86b6t0En5WiJeolI-8oRmFA2kMWQoc98qBF3Pu00HF1zr-qGiazhyTo-_iEubxpb6LeyaJo0TojutDpiQzSy_BXvcwMYkIyltIkTXaQT1FFQ8qSvTPQA8TE-kUAWPKe6XzqFxR4Y0cbKWZWuMbP9FyLGztpojQAGKOApNrP3kV9M1lVBbNZK6xSEDEv6Vi4Mk09YU_7IxaG8f-_vku8UiKDHG1ZIUqBZ85wV6SfEdwrZrXqQcgBhrgcuS0rJMUxR9ecfHipd8CdgnVIzALrFqgAs6kEcTgpi_X6E-6VJCmFOmMRE3Cj7gU5JNpc3vzLgNX8JCjBlWOj2khLYutrsN2CO2GauzXWOCGP5-H2bwgNz9yapfWYAD-Mrfdk38dFavTyRcu7FYufuVfSb-HegAHABZ--XsnGvLxI5EA0k_13eHlvx21rnaqwLGTQrV-mwQNL88EXrgtOA4JlQ4Y3cTbMcUSswPiQ7PSqe5u7orRZRnmVqH-tOlPXUHhgn0bxnmrAwTK7f_LJ-oFd_0vvvl0NjFscCyUMoa2x9IXdhpOgI521Vb_HP3Xhm96LBe1BVahy1pHk8tav1vAeWoc4zXKroOB6-cOGHluSlDvthVLSILdY9kYUzrCJ47_Kx9F2jEUT8Kqfo6MEjkGHjqgURQCGf2L8GMHFl4O88y9Sqk1lO-3Vle8J5m_5CCh7Y9k07CMWkHnhl3_OUQqNM6qUwwaxhOwFS3EiGszKqgRcoAZL0xR8WqHbSorlgNK-NEuhQAoN9liUBs8K6kBq7Bj8x_T2fJ7cEotIWyCZI",
    feedbackSource: 23,
    fetch_filters: true,
    renderLocation: "search_results_page",
    scale: 1,
    stream_initial_count: 0,
    useDefaultActor: false,
    __relay_internal__pv__IsWorkUserrelayprovider: false,
    __relay_internal__pv__IsMergQAPollsrelayprovider: false,
    __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
    __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: false,
    __relay_internal__pv__StoriesRingrelayprovider: false,
  },
  server_timestamps: true,
  doc_id: 5460236254084400,
};
