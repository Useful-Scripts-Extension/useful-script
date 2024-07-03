import { UfsGlobal } from "./content-scripts/ufs_global.js";
const { promiseAllStepN } = UfsGlobal.Utils;

export default {
  icon: "https://www.youtube.com/s/desktop/accca349/img/favicon_48x48.png",
  name: {
    en: "Youtube local downloader",
    vi: "Youtube tải video local",
  },
  description: {
    en: "",
    vi: "",
  },

  whiteList: ["https://*youtube.com/*"],

  popupScript: {
    onClick: async () => {
      const { runScriptInCurrentTab } = await import("./helpers/utils.js");

      const yt_data = await runScriptInCurrentTab(() => {
        return document.getElementsByTagName("ytd-app")[0].data.playerResponse;
      });

      if (!yt_data) {
        alert("Không tìm thấy video data");
        return;
      }

      localStorage.setItem(
        "ufs_youtube_localDownloader",
        JSON.stringify(yt_data)
      );

      window.open("/scripts/youtube_localDownloader.html");
    },
  },

  pageScript: {
    onDocumentEnd: () => {
      try {
        onDocumentEnd();
      } catch (e) {
        console.error(e);
      }
    },
  },
};

async function onDocumentEnd() {
  const LANG_FALLBACK = "en";
  const LOCALE = {
    en: {
      togglelinks: "Show/Hide Links",
      stream: "Stream",
      adaptive: "Adaptive (No Sound)",
      videoid: "Video ID: ",
      inbrowser_adaptive_merger:
        "Online Adaptive Video & Audio Merger (FFmpeg)",
      dlmp4: "Download high-resolution mp4 in one click",
      get_video_failed:
        "Failed to get video infomation for unknown reason, refresh the page may work.",
      live_stream_disabled_message:
        "Local YouTube Downloader is not available for live stream",
    },
  };
  for (const [lang, data] of Object.entries(LOCALE)) {
    if (lang === LANG_FALLBACK) continue;
    for (const key of Object.keys(LOCALE[LANG_FALLBACK])) {
      if (!(key in data)) {
        data[key] = LOCALE[LANG_FALLBACK][key];
      }
    }
  }
  const findLang = (l) => {
    l = l.replace("-Hant", ""); // special case for zh-Hant-TW
    // language resolution logic: zh-tw --(if not exists)--> zh --(if not exists)--> LANG_FALLBACK(en)
    l = l.toLowerCase().replace("_", "-");
    if (l in LOCALE) return l;
    else if (l.length > 2) return findLang(l.split("-")[0]);
    else return LANG_FALLBACK;
  };
  const getLangCode = () => {
    const html = document.querySelector("html");
    if (html) {
      return html.lang;
    } else {
      return navigator.language;
    }
  };
  const $ = (s, x = document) => x.querySelector(s);
  const $el = (tag, opts) => {
    const el = document.createElement(tag);
    Object.assign(el, opts);
    return el;
  };

  const load = async (playerResponse) => {
    try {
      debugger;
      const basejs =
        (typeof ytplayer !== "undefined" &&
        "config" in ytplayer &&
        ytplayer.config.assets
          ? "https://" + location.host + ytplayer.config.assets.js
          : "web_player_context_config" in ytplayer
          ? "https://" +
            location.host +
            ytplayer.web_player_context_config.jsUrl
          : null) || $('script[src$="base.js"]').src;
      const res = await fetch(basejs);
      const text = await res.text();
      const decsig = parseDecsig(text);
      const id = parseQuery(location.search).v;
      const data = parseResponse(id, playerResponse, decsig);
      console.log("video loaded: %s", id);
      app.isLiveStream =
        data.playerResponse.playabilityStatus.liveStreamability != null;
      app.id = id;
      app.stream = data.stream;
      app.adaptive = data.adaptive;
      app.details = data.details;

      const actLang = getLangCode();
      if (actLang != null) {
        const lang = findLang(actLang);
        console.log("youtube ui lang: %s", actLang);
        console.log("ytdl lang:", lang);
        app.lang = lang;
      }
    } catch (err) {
      alert(app.strings.get_video_failed);
      console.error("load", err);
    }
  };

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const parseDecsig = (data) => {
    try {
      if (data.startsWith("var script")) {
        // they inject the script via script tag
        const obj = {};
        // const document = {
        //   createElement: () => obj,
        //   head: { appendChild: () => {} },
        // };
        eval(data);
        data = obj.innerHTML;
      }
      const fnnameresult = /=([a-zA-Z0-9\$_]+?)\(decodeURIComponent/.exec(data);
      const fnname = fnnameresult[1];
      const _argnamefnbodyresult = new RegExp(
        escapeRegExp(fnname) + "=function\\((.+?)\\){((.+)=\\2.+?)}"
      ).exec(data);
      const [_, argname, fnbody] = _argnamefnbodyresult;
      const helpernameresult = /;([a-zA-Z0-9$_]+?)\..+?\(/.exec(fnbody);
      const helpername = helpernameresult[1];
      const helperresult = new RegExp(
        "var " + escapeRegExp(helpername) + "={[\\s\\S]+?};"
      ).exec(data);
      const helper = helperresult[0];
      console.log(`parsedecsig result: %s=>{%s\n%s}`, argname, helper, fnbody);
      return new Function([argname], helper + "\n" + fnbody);
    } catch (e) {
      console.error("parsedecsig error: %o", e);
      console.info("script content: %s", data);
      console.info(
        'If you encounter this error, please copy the full "script content" to https://pastebin.com/ for me.'
      );
    }
  };
  const parseQuery = (s) =>
    [...new URLSearchParams(s).entries()].reduce(
      (acc, [k, v]) => ((acc[k] = v), acc),
      {}
    );
  const parseResponse = (id, playerResponse, decsig) => {
    console.log(`video %s playerResponse: %o`, id, playerResponse);
    let stream = [];
    if (playerResponse.streamingData.formats) {
      stream = playerResponse.streamingData.formats.map((x) =>
        Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher))
      );
      console.log(`video %s stream: %o`, id, stream);
      for (const obj of stream) {
        if (obj.s) {
          obj.s = decsig(obj.s);
          obj.url += `&${obj.sp}=${encodeURIComponent(obj.s)}`;
        }
      }
    }

    let adaptive = [];
    if (playerResponse.streamingData.adaptiveFormats) {
      adaptive = playerResponse.streamingData.adaptiveFormats.map((x) =>
        Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher))
      );
      console.log(`video %s adaptive: %o`, id, adaptive);
      for (const obj of adaptive) {
        if (obj.s) {
          obj.s = decsig(obj.s);
          obj.url += `&${obj.sp}=${encodeURIComponent(obj.s)}`;
        }
      }
    }
    console.log(`video %s result: %o`, id, { stream, adaptive });
    return {
      stream,
      adaptive,
      details: playerResponse.videoDetails,
      playerResponse,
    };
  };

  // video downloader
  const xhrDownloadUint8Array = async ({ url, contentLength }, progressCb) => {
    if (typeof contentLength === "string")
      contentLength = parseInt(contentLength);
    progressCb({
      loaded: 0,
      total: contentLength,
      speed: 0,
    });
    const chunkSize = 65536;
    const getBuffer = (start, end) =>
      fetch(url + `&range=${start}-${end ? end - 1 : ""}`).then((r) =>
        r.arrayBuffer()
      );
    const data = new Uint8Array(contentLength);
    let downloaded = 0;
    const tasks = [];
    const startTime = Date.now();

    for (let start = 0; start < contentLength; start += chunkSize) {
      const exceeded = start + chunkSize > contentLength;
      const curChunkSize = exceeded ? contentLength - start : chunkSize;
      const end = exceeded ? null : start + chunkSize;
      tasks.push(() => {
        console.log("dl start", url, start, end);
        return getBuffer(start, end)
          .then((buf) => {
            console.log("dl done", url, start, end);
            downloaded += curChunkSize;
            data.set(new Uint8Array(buf), start);
            const ds = (Date.now() - startTime + 1) / 1000;
            progressCb({
              loaded: downloaded,
              total: contentLength,
              speed: downloaded / ds,
            });
          })
          .catch((err) => {
            console.error("Download error");
          });
      });
    }
    await promiseAllStepN(6, tasks);
    return data;
  };

  let ffWorkerLoaded = false,
    ffWorker;
  const mergeVideo = async (video, audio) => {
    if (!ffWorkerLoaded) {
      await UfsGlobal.DOM.injectScriptSrcAsync(
        "https://unpkg.com/@ffmpeg/ffmpeg@0.6.1/dist/ffmpeg.min.js"
      );
      ffWorker = FFmpeg.createWorker({
        logger: (m) => console.log(m.message),
      });
      ffWorkerLoaded = true;
    }
    await ffWorker.write("video.mp4", video);
    await ffWorker.write("audio.mp4", audio);
    await ffWorker.run("-i video.mp4 -i audio.mp4 -c copy output.mp4", {
      input: ["video.mp4", "audio.mp4"],
      output: "output.mp4",
    });
    const { data } = await ffWorker.read("output.mp4");
    await ffWorker.remove("output.mp4");
    return data;
  };

  // ===================== MAIN ======================
  await UfsGlobal.DOM.injectScriptSrc(
    "https://unpkg.com/vue@2.6.10/dist/vue.js"
  );
  const template = `<div class="box" :class="{'dark':dark}">
<template v-if="!isLiveStream">
<div v-if="adaptive.length" class="of-h t-center c-pointer lh-20">
  <a class="fs-14px" @click="dlmp4" v-text="strings.dlmp4"></a>
</div>
<div @click="hide=!hide" class="box-toggle div-a t-center fs-14px c-pointer lh-20" v-text="strings.togglelinks"></div>
<div :class="{'hide':hide}">
  <div class="t-center fs-14px" v-text="strings.videoid+id"></div>
  <div class="d-flex">
    <div class="f-1 of-h">
      <div class="t-center fs-14px" v-text="strings.stream"></div>
      <a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in stream" :href="vid.url" :title="vid.type" v-text="formatStreamText(vid)"></a>
    </div>
    <div class="f-1 of-h">
      <div class="t-center fs-14px" v-text="strings.adaptive"></div>
      <a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in adaptive" :href="vid.url" :title="vid.type" v-text="formatAdaptiveText(vid)"></a>
    </div>
  </div>
  <div class="of-h t-center">
    <a class="fs-14px" href="https://maple3142.github.io/mergemp4/" target="_blank" v-text="strings.inbrowser_adaptive_merger"></a>
  </div>
</div>
</template>
<template v-else>
<div class="t-center fs-14px lh-20" v-text="strings.live_stream_disabled_message"></div>
</template>
</div>`;
  const app = new Vue({
    data() {
      return {
        hide: true,
        id: "",
        isLiveStream: false,
        stream: [],
        adaptive: [],
        details: null,
        dark: false,
        lang: findLang(getLangCode()),
      };
    },
    computed: {
      strings() {
        return LOCALE[this.lang.toLowerCase()];
      },
    },
    methods: {
      dlmp4() {
        // openDownloadModel(this.adaptive, this.details.title);
      },
      formatStreamText(vid) {
        return [vid.qualityLabel, vid.quality].filter((x) => x).join(": ");
      },
      formatAdaptiveText(vid) {
        let str = [vid.qualityLabel, vid.mimeType].filter((x) => x).join(": ");
        if (vid.mimeType.includes("audio")) {
          str += ` ${Math.round(vid.bitrate / 1000)}kbps`;
        }
        return str;
      },
    },
    template,
  });

  // attach element
  const shadowHost = $el("div");
  const shadow = shadowHost.attachShadow
    ? shadowHost.attachShadow({ mode: "closed" })
    : shadowHost; // no shadow dom
  console.log("shadowHost: %o", shadowHost);
  const container = $el("div");
  shadow.appendChild(container);
  app.$mount(container);

  // hook fetch response
  const ff = fetch;
  window.fetch = (...args) => {
    if (args[0] instanceof Request) {
      return ff(...args).then((resp) => {
        if (resp.url.includes("player")) {
          debugger;
          resp.clone().json().then(load);
        }
        return resp;
      });
    }
    return ff(...args);
  };

  // attach element
  const it = setInterval(() => {
    const el =
      $("ytd-watch-metadata") ||
      $("#info-contents") ||
      $("#watch-header") ||
      $(".page-container:not([hidden]) ytm-item-section-renderer>lazy-list");
    if (el && !el.contains(shadowHost)) {
      el.appendChild(shadowHost);
      clearInterval(it);
    }
  }, 100);

  // init
  const firstResp = window?.ytplayer?.config?.args?.raw_player_response;
  debugger;
  if (firstResp) {
    load(firstResp);
  }

  const css = `
.hide{
display: none;
}
.t-center{
text-align: center;
}
.d-flex{
display: flex;
}
.f-1{
flex: 1;
}
.fs-14px{
font-size: 14px;
}
.of-h{
overflow: hidden;
}
.box{
padding-top: .5em;
padding-bottom: .5em;
border-bottom: 1px solid var(--yt-border-color);
font-family: Arial;
}
.box-toggle{
margin: 3px;
user-select: none;
-moz-user-select: -moz-none;
}
.ytdl-link-btn{
display: block;
border: 1px solid !important;
border-radius: 3px;
text-decoration: none !important;
outline: 0;
text-align: center;
padding: 2px;
margin: 5px;
color: black;
}
a, .div-a{
text-decoration: none;
color: var(--yt-button-color, inherit);
}
a:hover, .div-a:hover{
color: var(--yt-spec-call-to-action, blue);
}
.box.dark{
color: var(--yt-endpoint-color, var(--yt-spec-text-primary));
}
.box.dark .ytdl-link-btn{
color: var(--yt-endpoint-color, var(--yt-spec-text-primary));
}
.box.dark .ytdl-link-btn:hover{
color: rgba(200, 200, 255, 0.8);
}
.box.dark .box-toggle:hover{
color: rgba(200, 200, 255, 0.8);
}
.c-pointer{
cursor: pointer;
}
.lh-20{
line-height: 20px;
}
`;
  shadow.appendChild($el("style", { textContent: css }));
}
