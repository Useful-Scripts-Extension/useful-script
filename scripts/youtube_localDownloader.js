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

  onClick: () => {},

  onDocumentStart: async () => {
    const app = {};
    const $ = (s, x = document) => x.querySelector(s);

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

    async function load(playerResponse) {
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
        console.log(app);
      } catch (err) {
        alert(
          "Failed to get video infomation for unknown reason, refresh the page may work."
        );
        console.error("load", err);
      }
    }

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

    window.addEventListener("load", () => {
      const firstResp = window?.ytplayer?.config?.args?.raw_player_response;
      if (firstResp) {
        load(firstResp);
      }
    });

    // ========================== video downloader ==========================
    UsefulScriptGlobalPageContext.DOM.injectScriptSrc(
      "https://unpkg.com/@ffmpeg/ffmpeg@0.6.1/dist/ffmpeg.min.js"
    );
    UsefulScriptGlobalPageContext.DOM.injectScriptSrc(
      "https://unpkg.com/vue@2.6.10/dist/vue.js"
    );

    async function downloadBlobUrlWithProgressMultiChunk(
      url,
      progressCallback,
      chunkSize = 65536
    ) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const contentLength = response.headers.get("content-length");
      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const startTime = Date.now();

      const chunks = [];
      const numChunks = Math.ceil(total / chunkSize);
      const promises = [];

      for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize - 1, total - 1);
        promises.push(
          fetch(url + `&range=${start}-${end}`).then((res) => res.blob())
        );
      }

      await Promise.all(promises)
        .then((downloadedChunks) => {
          chunks.push(...downloadedChunks);
          loaded = total;
          progressCallback?.({
            loaded,
            total,
            speed: loaded / ((Date.now() - startTime + 1) / 1000),
          });
        })
        .catch((error) => {
          console.error("Download error:", error);
        });

      return new Blob(chunks, {
        type: response.headers.get("content-type"),
      });
    }

    const xhrDownloadUint8Array = async (
      { url, contentLength },
      progressCb
    ) => {
      if (typeof contentLength === "string")
        contentLength = parseInt(contentLength);

      progressCb({
        loaded: 0,
        total: contentLength,
        speed: 0,
      });

      const chunkSize = 65536;
      const getBuffer = async (start, end) => {
        let res = await fetch(url + `&range=${start}-${end ? end - 1 : ""}`);
        return await res.arrayBuffer();
      };

      const data = new Uint8Array(contentLength);
      let downloaded = 0;
      const startTime = Date.now();
      for (let start = 0; start < contentLength; start += chunkSize) {
        try {
          const exceeded = start + chunkSize > contentLength;
          const curChunkSize = exceeded ? contentLength - start : chunkSize;
          const end = exceeded ? null : start + chunkSize;
          const buf = await getBuffer(start, end);
          console.log("dl done", url, start, end);
          downloaded += curChunkSize;
          data.set(new Uint8Array(buf), start);
          const ds = (Date.now() - startTime + 1) / 1000;
          progressCb({
            loaded: downloaded,
            total: contentLength,
            speed: downloaded / ds,
          });
        } catch (e) {
          console.log("Download error", e);
        }
      }
      return data;
    };

    let ffWorker;
    const mergeVideo = async (video, audio) => {
      if (!ffWorker) {
        ffWorker = FFmpeg.createWorker({
          logger: DEBUG ? (m) => logger.log(m.message) : () => {},
        });
        await ffWorker.load();
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

    const triggerDownload = (url, filename) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    const dlModalTemplate = `
<div style="width: 100%; height: 100%;">
	<div v-if="merging" style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; font-size: 24px;">Merging video, please wait...</div>
	<div v-else style="height: 100%; width: 100%; display: flex; flex-direction: column;">
 		<div style="flex: 1; margin: 10px;">
			<p style="font-size: 24px;">Video</p>
			<progress style="width: 100%;" :value="video.progress" min="0" max="100"></progress>
			<div style="display: flex; justify-content: space-between;">
				<span>{{video.speed}} kB/s</span>
				<span>{{video.loaded}}/{{video.total}} MB</span>
			</div>
		</div>
		<div style="flex: 1; margin: 10px;">
			<p style="font-size: 24px;">Audio</p>
			<progress style="width: 100%;" :value="audio.progress" min="0" max="100"></progress>
			<div style="display: flex; justify-content: space-between;">
				<span>{{audio.speed}} kB/s</span>
				<span>{{audio.loaded}}/{{audio.total}} MB</span>
			</div>
		</div>
	</div>
</div>
`;

    async function openDownloadModel(adaptive, title) {
      const win = open(
        "",
        "Video Download",
        `toolbar=no,height=400,width=400,left=${screenLeft},top=${screenTop}`
      );
      const div = win.document.createElement("div");
      win.document.body.appendChild(div);
      win.document.title = `Downloading "${title}"`;
      const dlModalApp = new Vue({
        template: dlModalTemplate,
        data() {
          return {
            video: {
              progress: 0,
              total: 0,
              loaded: 0,
              speed: 0,
            },
            audio: {
              progress: 0,
              total: 0,
              loaded: 0,
              speed: 0,
            },
            merging: false,
          };
        },
        methods: {
          async start(adaptive, title) {
            win.onbeforeunload = () => true;
            // YouTube's default order is descending by video quality
            const videoObj = adaptive
              .filter(
                (x) =>
                  x.mimeType.includes("video/mp4") ||
                  x.mimeType.includes("video/webm")
              )
              .map((v) => {
                const [_, quality, fps] = /(\d+)p(\d*)/.exec(v.qualityLabel);
                v.qualityNum = parseInt(quality);
                v.fps = fps ? parseInt(fps) : 30;
                return v;
              })
              .sort((a, b) => {
                if (a.qualityNum === b.qualityNum) return b.fps - a.fps; // ex: 30-60=-30, then a will be put before b
                return b.qualityNum - a.qualityNum;
              })[0];
            const audioObj = adaptive.find((x) =>
              x.mimeType.includes("audio/mp4")
            );
            const vPromise = xhrDownloadUint8Array(videoObj, (e) => {
              this.video.progress = (e.loaded / e.total) * 100;
              this.video.loaded = (e.loaded / 1024 / 1024).toFixed(2);
              this.video.total = (e.total / 1024 / 1024).toFixed(2);
              this.video.speed = (e.speed / 1024).toFixed(2);
            });
            const aPromise = xhrDownloadUint8Array(audioObj, (e) => {
              this.audio.progress = (e.loaded / e.total) * 100;
              this.audio.loaded = (e.loaded / 1024 / 1024).toFixed(2);
              this.audio.total = (e.total / 1024 / 1024).toFixed(2);
              this.audio.speed = (e.speed / 1024).toFixed(2);
            });

            // const vPromise = downloadBlobUrlWithProgressMultiChunk(
            //   videoObj.url,
            //   ({ loaded, total, speed }) => {
            //     this.video.progress = (loaded / total) * 100;
            //     this.video.loaded = (loaded / 1024 / 1024).toFixed(2);
            //     this.video.total = (total / 1024 / 1024).toFixed(2);
            //     this.video.speed = (speed / 1024).toFixed(2);
            //   }
            // );
            // const aPromise = downloadBlobUrlWithProgressMultiChunk(
            //   audioObj.url,
            //   ({ loaded, total, speed }) => {
            //     this.audio.progress = (loaded / total) * 100;
            //     this.audio.loaded = (loaded / 1024 / 1024).toFixed(2);
            //     this.audio.total = (total / 1024 / 1024).toFixed(2);
            //     this.audio.speed = (speed / 1024).toFixed(2);
            //   }
            // );
            const [varr, aarr] = await Promise.all([vPromise, aPromise]);
            this.merging = true;
            win.onunload = () => {
              // trigger download when user close it
              const bvurl = URL.createObjectURL(new Blob([varr]));
              const baurl = URL.createObjectURL(new Blob([aarr]));
              triggerDownload(bvurl, title + "-videoonly.mp4");
              triggerDownload(baurl, title + "-audioonly.mp4");
            };
            const result = await Promise.race([
              mergeVideo(varr, aarr),
              sleep(1000 * 25).then(() => null),
            ]);
            if (!result) {
              alert("An error has occurred when merging video");
              const bvurl = URL.createObjectURL(new Blob([varr]));
              const baurl = URL.createObjectURL(new Blob([aarr]));
              triggerDownload(bvurl, title + "-videoonly.mp4");
              triggerDownload(baurl, title + "-audioonly.mp4");
              return this.close();
            }
            this.merging = false;
            const url = URL.createObjectURL(new Blob([result]));
            triggerDownload(url, title + ".mp4");
            win.onbeforeunload = null;
            win.onunload = null;
            win.close();
          },
        },
      }).$mount(div);
      dlModalApp.start(adaptive, title);
    }

    window.ufs_download_video = () => {
      openDownloadModel(app.adaptive, app.details?.title);
    };
  },
};
