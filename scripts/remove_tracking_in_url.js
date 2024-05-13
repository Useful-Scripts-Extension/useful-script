export default {
  icon: "<i class='fa-solid fa-link-slash fa-lg'></i>",
  name: {
    en: "Prevent tracking url",
    vi: "Xoá theo dõi trong url",
  },
  description: {
    en: `Remove tracking parameters from url, prevent tracking from Facebook, Tiktok, etc.
    <br/>
    <ul>
      <li>fbclid</li>
      <li>ttclid</li>
      <li>utm_source</li>
      <li>utm_medium</li>
      <li>utm_campaign</li>
      <li>utm_term</li>
      <li>utm_content</li>
      <li>...</li>
    </ul>
    <b>Click ? for more info</b>
    `,
    vi: `Xoá các tham số theo dõi trong url, chặn theo dõi người dùng từ Facebook, Tiktok, ...
    <br/>
    <ul>
      <li>fbclid</li>
      <li>ttclid</li>
      <li>utm_source</li>
      <li>utm_medium</li>
      <li>utm_campaign</li>
      <li>utm_term</li>
      <li>utm_content</li>
      <li>...</li>
    </ul>
    <b>Bấm ? để xem chi tiết</b>`,
  },

  infoLink:
    "https://www.justuno.com/blog/understanding-utms-fbclids-how-to-build-a-better-audience",

  changeLogs: {
    ["2024-05-13"]: "init",
  },

  pageScript: {
    onBeforeNavigate: (url) => {
      // window.stop();
      console.log(url);
    },

    onDocumentStart: () => {
      let url = new URL(window.top.location.href);
      let removed = [];

      // https://chromewebstore.google.com/detail/remove-fbclid-and-utm/ehkdoijaaigomfliimepliikhjkoipob
      const trackingParams = [
        "icid",
        "ef_id",
        "s_kwcid",
        "_bta_tid",
        "_bta_c",
        "dm_i",
        "fb_action_ids",
        "fb_action_types",
        "fb_source",
        "fbclid",
        "_ga",
        "gclid",
        "campaignid",
        "adgroupid",
        "adid",
        "_gl",
        "gclsrc",
        "gdfms",
        "gdftrk",
        "gdffi",
        "_ke",
        "trk_contact",
        "trk_msg",
        "trk_module",
        "trk_sid",
        "mc_cid",
        "mc_eid",
        "mkwid",
        "pcrid",
        "mtm_source",
        "mtm_medium",
        "mtm_campaign",
        "mtm_keyword",
        "mtm_cid",
        "mtm_content",
        "msclkid",
        "epik",
        "pp",
        "pk_source",
        "pk_medium",
        "pk_campaign",
        "pk_keyword",
        "pk_cid",
        "pk_content",
        "redirect_log_mongo_id",
        "redirect_mongo_id",
        "sb_referer_host",

        // my
        "ttclid",
        "utm_*",
        "ref_*",
        "ig_*",
      ];
      // if (url.searchParams.has(key)) {
      //   url.searchParams.delete(key);
      //   removed.push(key);
      // }

      // check regex for each search param
      for (const param of url.searchParams.keys()) {
        for (const trackingParam of trackingParams) {
          if (new RegExp(trackingParam).test(param)) {
            url.searchParams.delete(param);
            removed.push(param);
          }
        }
      }
      if (removed.length) {
        // update url without reload, using pushState
        history.pushState(null, null, url.href);
        console.log(location.href);

        UfsGlobal.DOM.notify({
          msg: "Useful-script: Removed tracking params: " + removed.join(", "),
        });
      }
    },
  },
};
