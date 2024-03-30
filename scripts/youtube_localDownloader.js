export default {
  icon: "https://www.youtube.com/s/desktop/accca349/img/favicon_48x48.png",
  name: {
    en: "Youtube local downloader",
    vi: "Youtube tải video",
  },
  description: {
    en: "",
    vi: "",
  },

  whiteList: ["https://*.youtube.com/*"],

  onDocumentStart: () => {
    const app = {};

    const $ = (s, x = document) => x.querySelector(s);
    const $el = (tag, opts) => {
      const el = document.createElement(tag);
      Object.assign(el, opts);
      return el;
    };

    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parseDecsig = (data) => {
      try {
        if (data.startsWith("var script")) {
          // they inject the script via script tag
          const obj = {};
          const document = {
            createElement: () => obj,
            head: { appendChild: () => {} },
          };
          eval(data);
          data = obj.innerHTML;
        }
        const fnnameresult = /=([a-zA-Z0-9\$_]+?)\(decodeURIComponent/.exec(
          data
        );
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
        console.log(
          `parsedecsig result: %s=>{%s\n%s}`,
          argname,
          helper,
          fnbody
        );
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

    const load = async (playerResponse) => {
      try {
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
        debugger;
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
      } catch (err) {
        alert(app.strings.get_video_failed);
        console.error("load", err);
      }
    };

    // hook fetch response
    const ff = fetch;
    window.fetch = (...args) => {
      if (args[0] instanceof Request) {
        return ff(...args).then((resp) => {
          if (resp.url.includes("player")) {
            resp.clone().json().then(load);
          }
          return resp;
        });
      }
      return ff(...args);
    };

    window.addEventListener("load", () => {
      const firstResp = window?.ytplayer?.config?.args?.raw_player_response;
      if (firstResp) {
        load(firstResp);
      }
    });
  },
};

// functions/attributes that other scripts can import and use
export const shared = {};
