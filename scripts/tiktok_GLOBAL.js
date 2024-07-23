import { UfsGlobal } from "./content-scripts/ufs_global.js";

export const CACHE = {
  snapTikToken: null,
};

export async function downloadTiktokVideoFromId(videoId) {
  for (let api of [
    "https://api22-normal-c-useast2a.tiktokv.com/aweme/v1/feed/?aweme_id=",
    "https://api16-normal-useast5.us.tiktokv.com/aweme/v1/feed/?aweme_id=",
    "https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=",
    "https://api2.musical.ly/aweme/v1/feed/?aweme_id=",
  ]) {
    try {
      const ts = Math.round(Date.now() / 1000);
      const parameters = {
        aweme_id: videoId,
        // version_name: appVersion,
        // version_code: manifestAppVersion,
        // build_number: appVersion,
        // manifest_version_code: manifestAppVersion,
        // update_version_code: manifestAppVersion,
        // openudid: UTIL.ranGen("0123456789abcdef", 16),
        // uuid: UTIL.ranGen("0123456789", 16),
        _rticket: ts * 1000,
        ts: ts,
        device_brand: "Google",
        device_type: "Pixel 4",
        device_platform: "android",
        resolution: "1080*1920",
        dpi: 420,
        os_version: "10",
        os_api: "29",
        carrier_region: "US",
        sys_region: "US",
        region: "US",
        app_name: "trill",
        app_language: "en",
        language: "en",
        timezone_name: "America/New_York",
        timezone_offset: "-14400",
        channel: "googleplay",
        ac: "wifi",
        mcc_mnc: "310260",
        is_my_cn: 0,
        aid: 1180,
        ssmix: "a",
        as: "a1qwert123",
        cp: "cbfhckdckkde1",
      };
      const params = Object.keys(parameters)
        .map((key) => `&${key}=${parameters[key]}`)
        .join("");
      let data = await runInBackground("fetch", [api + videoId + "&" + params]);
      console.log(data);
      let json = JSON.parse(data.body);
      console.log(json);
      let item = json.aweme_list.find((a) => a.aweme_id == videoId);
      if (!item) throw Error("Không tìm thấy video");
      let url =
        item?.video?.play_addr?.url_list?.[0] ||
        item?.video?.download_addr?.url_list?.[0];
      if (url) return url;
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }
  return null;
}

export async function downloadTiktokVideoFromUrl(url, background = false) {
  try {
    let token = CACHE.snapTikToken;
    if (!token) {
      let token = await SnapTik.getToken(background);
      if (!token) throw Error("Không tìm thấy token snaptik");
      CACHE.snapTikToken = token;
    }

    let form = new FormData();
    form.append("url", url);
    form.append("token", token);

    let text;
    if (background) {
      let res = await UfsGlobal.Extension.runInBackground("fetch", [
        "https://snaptik.app/abc2.php",
        {
          method: "POST",
          body:
            "ufs-formData:" +
            JSON.stringify({
              url: url,
              token: token,
            }),
        },
      ]);
      text = res.body;
    } else {
      let res = await fetch("https://snaptik.app/abc2.php", {
        method: "POST",
        body: form,
      });
      text = await res.text();
    }
    let result = SnapTik.decode(text);
    return result;
  } catch (e) {
    console.log("ERROR: ", e);
  }
}

export const SnapTik = {
  getToken: async (background = false) => {
    let text;
    if (background) {
      let res = await UfsGlobal.Extension.runInBackground("fetch", [
        "https://snaptik.app/",
      ]);
      text = res.body;
    } else {
      let res = await fetch("https://snaptik.app/");
      text = await res.text();
    }
    let token = text.match(/name="token" value="(.+?)"/)?.[1];
    return token;
  },
  decode: (encoded) => {
    function b(d, e, f) {
      var g =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split(
          ""
        );
      var h = g.slice(0, e);
      var i = g.slice(0, f);
      var j = d
        .split("")
        .reverse()
        .reduce(function (a, b, c) {
          if (h.indexOf(b) !== -1) return (a += h.indexOf(b) * Math.pow(e, c));
        }, 0);
      var k = "";
      while (j > 0) {
        k = i[j % f] + k;
        j = (j - (j % f)) / f;
      }
      return k || 0;
    }
    function c(h, u, n, t, e, r) {
      r = "";
      for (var i = 0, len = h.length; i < len; i++) {
        var s = "";
        while (h[i] !== n[e]) {
          s += h[i];
          i++;
        }
        for (var j = 0; j < n.length; j++)
          s = s.replace(new RegExp(n[j], "g"), j);
        r += String.fromCharCode(b(s, e, 10) - t);
      }
      return decodeURIComponent(escape(r));
    }

    let params = encoded.match(/}\((.*?)\)\)/)?.[1];
    params = params.split(",").map((_) => {
      if (!isNaN(Number(_))) return Number(_);
      if (_.startsWith('"')) return _.slice(1, -1);
      return _;
    });

    let result = c(...params);
    let jwt = result.match(/d\?token=(.*?)\&dl=1/)?.[1];
    if (!jwt) return null;
    let payload = parseJwt(jwt);
    return payload?.url;
  },
};

// https://stackoverflow.com/a/38552302/11898496
function parseJwt(token) {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
