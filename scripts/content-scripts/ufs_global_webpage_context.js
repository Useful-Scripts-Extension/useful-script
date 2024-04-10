// Tất cả các hàm/biến toàn cục được nhúng vào trang web at document_start
// Có thể truy cập từ các script chạy trong webpage context (có hàm onClick)

const UsefulScriptGlobalPageContext = {
  Extension: {
    sendToContentScript: function (event, data) {
      return new Promise((resolve, reject) => {
        let listenerKey = "ufs-contentscript-sendto-pagescript";
        let listener = (evt) => {
          if (evt.detail.event === event) {
            resolve(evt.detail.data);
            window.removeEventListener(listenerKey, listener);
          }
        };
        window.addEventListener(listenerKey, listener);
        window.dispatchEvent(
          new CustomEvent("ufs-pagescript-sendto-contentscript", {
            detail: { event, data },
          })
        );
      });
    },
    getURL: async function (filePath) {
      if (typeof chrome?.runtime?.getURL === "function") {
        return await chrome.runtime.getURL(filePath);
      } else {
        return await UsefulScriptGlobalPageContext.Extension.sendToContentScript(
          "getURL",
          filePath
        );
      }
    },
    getActiveScripts: async function () {
      return await UsefulScriptGlobalPageContext.Extension.sendToContentScript(
        "getActiveScripts"
      );
    },
  },
  DOM: {
    onDoublePress(key, callback, timeout = 500) {
      let timer = null;
      let clickCount = 0;

      const keydown = (event) => {
        if (event.key !== key) return;

        clickCount++;
        if (clickCount === 2) {
          callback?.();
          clickCount = 0;
          return;
        }

        clearTimeout(timer);
        timer = setTimeout(() => {
          clickCount = 0;
        }, timeout);
      };

      document.addEventListener("keydown", keydown);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", keydown);
      };
    },

    // https://stackoverflow.com/a/3381522
    createFlashTitle(newMsg, howManyTimes) {
      var original = document.title;
      var timeout;

      function step() {
        document.title = document.title == original ? newMsg : original;
        if (--howManyTimes > 0) {
          timeout = setTimeout(step, 1000);
        }
      }
      howManyTimes = parseInt(howManyTimes);
      if (isNaN(howManyTimes)) {
        howManyTimes = 5;
      }
      clearTimeout(timeout);
      step();

      function cancel() {
        clearTimeout(timeout);
        document.title = original;
      }

      return cancel;
    },

    deleteElements(selector, willReRun) {
      UsefulScriptGlobalPageContext.DOM.onElementsVisible(
        selector,
        (nodes) => {
          [].forEach.call(nodes, function (node) {
            node.remove();
            console.log("Useful-scripts: element removed ", node);
          });
        },
        willReRun
      );
    },

    waitForElements(selector) {
      return new Promise((resolve, reject) => {
        UsefulScriptGlobalPageContext.DOM.onElementsVisible(
          selector,
          resolve,
          false
        );
      });
    },

    // Idea from  https://github.com/gys-dev/Unlimited-Stdphim
    // https://stackoverflow.com/a/61511955/11898496
    onElementsVisible: (selector, callback, willReRun) => {
      let nodes = document.querySelectorAll(selector);
      if (nodes?.length) {
        callback(nodes);
        if (!willReRun) return;
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (!mutation.addedNodes) return;

          for (let node of mutation.addedNodes) {
            if (node.nodeType != 1) continue; // only process Node.ELEMENT_NODE

            let n = node.matches(selector)
              ? [node]
              : Array.from(node.querySelectorAll(selector));

            if (n?.length) {
              callback(n);
              if (!willReRun) observer.disconnect();
            }
          }
        });
      });

      observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      });

      // return disconnect function
      return () => observer.disconnect();
    },

    injectCssCode(code) {
      var css = document.createElement("style");
      if ("textContent" in css) css.textContent = code;
      else css.innerText = code;
      document.head.appendChild(css);
    },

    injectCssFile(filePath) {
      var css = document.createElement("link");
      css.setAttribute("rel", "stylesheet");
      css.setAttribute("type", "text/css");
      css.setAttribute("href", filePath);
      document.head.appendChild(css);
    },

    getTrustedPolicy() {
      let policy = window.trustedTypes?.ufsTrustedTypesPolicy || null;
      if (!policy) {
        policy = window.trustedTypes.createPolicy("ufsTrustedTypesPolicy", {
          createHTML: (input) => input,
          createScriptURL: (input) => input,
        });
      }
      return policy;
    },

    createTrustedHtml(html) {
      let policy = UsefulScriptGlobalPageContext.DOM.getTrustedPolicy();
      return policy.createHTML(html);
    },

    injectScriptSrc(src, callback) {
      let policy = UsefulScriptGlobalPageContext.DOM.getTrustedPolicy();
      let jsSrc = policy.createScriptURL(src);
      let script = document.createElement("script");
      script.onload = function () {
        callback?.(true);
      };
      script.onerror = function (e) {
        callback?.(false, e);
      };
      script.src = jsSrc; // Assigning the TrustedScriptURL to src
      document.head.appendChild(script);
    },

    injectScriptSrcAsync(src) {
      return new Promise((resolve, reject) => {
        UsefulScriptGlobalPageContext.DOM.injectScriptSrc(src, (success, e) => {
          if (success) {
            resolve();
          } else {
            reject(e);
          }
        });
      });
    },

    isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < window.innerWidth &&
        rect.top < window.innerHeight
      );
    },
    getOverlapScore(el) {
      var rect = el.getBoundingClientRect();
      return (
        Math.min(
          rect.bottom,
          window.innerHeight || document.documentElement.clientHeight
        ) - Math.max(0, rect.top)
      );
    },
    makeUrlValid(url) {
      if (url.startsWith("//")) {
        url = "https:" + url;
      }
      return url;
    },
    async getWatchingVideoSrc() {
      const { getOverlapScore, isElementInViewport, makeUrlValid } =
        UsefulScriptGlobalPageContext.DOM;

      // video or xg-video tag
      let videos = Array.from(document.querySelectorAll("video, xg-video"));
      let sorted = videos
        .filter((v) => isElementInViewport(v))
        .sort((a, b) => {
          return getOverlapScore(b) - getOverlapScore(a);
        });

      for (let v of sorted) {
        if (v.src) return makeUrlValid(v.src);
        let sources = Array.from(v.querySelectorAll("source"));
        for (let s of sources) {
          if (s.src) return makeUrlValid(s.src);
        }
      }
    },
  },
  Utils: {
    formatSize(size, fixed = 0) {
      size = Number(size);

      if (!size) return "?";

      // format to KB, MB, GB
      if (size < 1024) {
        return size + "B";
      }
      if (size < 1024 * 1024) {
        return (size / 1024).toFixed(fixed) + "KB";
      }
      if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(fixed) + "MB";
      }
      return (size / (1024 * 1024 * 1024)).toFixed(fixed) + "GB";
    },

    // modified by chatgpt based on: https://gist.github.com/jcouyang/632709f30e12a7879a73e9e132c0d56b
    promiseAllStepN(n, list) {
      const head = list.slice(0, n);
      const tail = list.slice(n);
      const resolved = [];

      return new Promise((resolve) => {
        let processed = 0;

        function runNext() {
          if (processed === tail.length) {
            resolve(Promise.all(resolved));
            return;
          }

          const promise = tail[processed]();
          resolved.push(
            promise.then((result) => {
              runNext();
              return result;
            })
          );
          processed++;
        }

        head.forEach((func) => {
          const promise = func();
          resolved.push(
            promise.then((result) => {
              runNext();
              return result;
            })
          );
        });
      });
    },

    hook(obj, name, callback) {
      const fn = obj[name];
      obj[name] = function (...args) {
        callback.apply(this, args);
        fn.apply(this, args);
      };
      return () => {
        // restore
        obj[name] = fn;
      };
    },
    // https://stackoverflow.com/a/38552302/11898496
    parseJwt(token) {
      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    },
    copyToClipboard(text) {
      // Check if Clipboard API is supported
      if (!navigator.clipboard) {
        alert("Clipboard API not supported, falling back to older method.");
        function fallbackCopyToClipboard(text) {
          const tempInput = document.createElement("input");
          tempInput.value = text;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
          console.log("Text copied to clipboard (fallback method)");
        }
        return fallbackCopyToClipboard(text);
      }

      // Copy text to clipboard
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text to clipboard:", err);
        });
    },
    // https://stackoverflow.com/a/7960435
    isEmptyFunction(func) {
      try {
        var m = func.toString().match(/\{([\s\S]*)\}/m)[1];
        return !m.replace(/^\s*\/\/.*$/gm, "");
      } catch (e) {
        console.log("Error isEmptyFunction", e);
        return false;
      }
    },
    // https://stackoverflow.com/a/9310752
    escapeRegExp(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    // https://stackoverflow.com/q/38849009
    unescapeRegExp(text) {
      return text.replace(/\\(.)/g, "$1");
    },
    encodeQueryString(obj) {
      var str = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    },
    moneyFormat(number, fixed = 0) {
      if (isNaN(number)) return 0;
      number = number.toFixed(fixed);
      let delimeter = ",";
      number += "";
      let rgx = /(\d+)(\d{3})/;
      while (rgx.test(number)) {
        number = number.replace(rgx, "$1" + delimeter + "$2");
      }
      return number;
    },

    zipAndDownloadBlobs(
      blobList,
      zipFileName,
      progressCallback,
      successCallback
    ) {
      const zip = new JSZip();

      // Add each Blob to the ZIP archive with a unique name
      blobList.forEach(({ blob, fileName }, index) => {
        console.log(fileName);
        zip.file(fileName, blob);
      });

      // Generate the ZIP content with progress callback
      zip
        .generateAsync({ type: "blob" }, (metadata) => {
          if (progressCallback) {
            // Calculate progress as a percentage
            const progress = metadata.percent | 0;
            progressCallback(progress);
          }
        })
        .then((content) => {
          successCallback?.();

          // Create a link to trigger the download
          const a = document.createElement("a");
          a.href = URL.createObjectURL(content);
          a.download = zipFileName;

          // Trigger a click event to initiate the download
          a.click();
        });
    },
    async getBlobFromUrl(url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return blob;
      } catch (error) {
        alert("Error: " + error);
      }
    },
    async getBlobFromUrlWithProgress(url, progressCallback) {
      const response = await fetch(url, {});
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const contentLength = response.headers.get("content-length");
      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const reader = response.body.getReader();
      const chunks = [];

      const startTime = Date.now();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        loaded += value.byteLength;
        const ds = (Date.now() - startTime + 1) / 1000;
        progressCallback?.({
          loaded,
          total,
          speed: loaded / ds,
        });
        chunks.push(value);
      }

      const blob = new Blob(chunks, {
        type: response.headers.get("content-type"),
      });

      return blob;
    },
    async downloadBlobUrl(url, title) {
      try {
        let res = await fetch(url);
        let blob = await res.blob();
        UsefulScriptGlobalPageContext.Utils.downloadBlob(blob, title);
      } catch (e) {
        alert("Error: " + e);
      }
    },
    downloadBlob(blob, filename) {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    },
    // https://stackoverflow.com/a/15832662/11898496
    // TODO: chrome.downloads: https://developer.chrome.com/docs/extensions/reference/downloads/#method-download
    downloadURL(url, name) {
      var link = document.createElement("a");
      link.target = "_blank";
      link.download = name;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    downloadData(data, filename, type = "text/plain") {
      var file = new Blob([data], { type: type });
      if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
      else {
        var a = document.createElement("a"),
          url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    },
  },
  Facebook: {
    // Helpers
    async fetchGraphQl(str, fb_dtsg) {
      var fb_dtsg = "fb_dtsg=" + encodeURIComponent(fb_dtsg);
      fb_dtsg += str.includes("variables")
        ? "&" + str
        : "&q=" + encodeURIComponent(str);

      let res = await fetch("https://www.facebook.com/api/graphql/", {
        body: fb_dtsg,
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
      });

      let json = await res.json();
      return json;
    },
    decodeArrId(arrId) {
      return arrId[0] * 4294967296 + arrId[1];
    },
    async getFbdtsg() {
      let methods = [
        () => require("DTSGInitData").token,
        () => require("DTSG").getToken(),
        () => {
          return document.documentElement.innerHTML.match(
            /"DTSGInitialData",\[],{"token":"(.+?)"/gm
          )[1];
        },
        async () => {
          let res = await fetch("https://mbasic.facebook.com/photos/upload/");
          let text = await res.text();
          return text.match(/name="fb_dtsg" value="(.*?)"/)[1];
        },
        () => require("DTSG_ASYNC").getToken(), // TODO: trace xem tại sao method này trả về cấu trúc khác 2 method trên
      ];
      for (let m of methods) {
        try {
          let d = await m();
          if (d) return d;
        } catch (e) {}
      }
      return null;
    },

    // User Data
    getUserAvatarFromUid(uid) {
      return (
        "https://graph.facebook.com/" +
        uid +
        "/picture?height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
      );
    },
    async getYourUserId() {
      let methods = [
        () => require("CurrentUserInitialData").USER_ID,
        () => require("RelayAPIConfigDefaults").actorID,
        () => document.cookie.match(/c_user=(\d+)/)[1],
        async () =>
          (
            await chrome.cookies.get({
              url: "https://www.facebook.com",
              name: "c_user",
            })
          ).value,
      ];
      for (let m of methods) {
        try {
          let d = await m();
          if (d) return d;
        } catch (e) {}
      }
      return null;
    },
    async getUserInfoFromUid(uid) {
      const variables = {
        userID: uid,
        shouldDeferProfilePic: false,
        useVNextHeader: false,
        scale: 1.5,
      };
      let f = new URLSearchParams();
      f.append(
        "fb_dtsg",
        await UsefulScriptGlobalPageContext.Facebook.getFbdtsg()
      );
      f.append("fb_api_req_friendly_name", "ProfileCometHeaderQuery");
      f.append("variables", JSON.stringify(variables));
      f.append("doc_id", "4159355184147969");

      let res = await fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: f,
      });

      let text = await res.text();
      return {
        uid: uid,
        name: UsefulScriptsUtils.decodeEscapedUnicodeString(
          /"name":"(.*?)"/.exec(text)?.[1]
        ),
        avatar: UsefulScriptsUtils.decodeEscapedUnicodeString(
          /"profilePicLarge":{"uri":"(.*?)"/.exec(text)?.[1] ||
            /"profilePicMedium":{"uri":"(.*?)"/.exec(text)?.[1] ||
            /"profilePicSmall":{"uri":"(.*?)"/.exec(text)?.[1] ||
            /"profilePic160":{"uri":"(.*?)"/.exec(text)?.[1]
        ),
        gender: /"gender":"(.*?)"/.exec(text)?.[1],
        alternateName: /"alternate_name":"(.*?)"/.exec(text)?.[1],
      };
    },
    async getUserInfo(uid, access_token) {
      var n =
        "https://graph.facebook.com/" +
        encodeURIComponent(uid) +
        "/?fields=name,picture&access_token=" +
        access_token;
      const e = await fetch(n);
      let json = await e.json();

      return {
        uid: uid,
        name: json?.name,
        avatar: json?.picture?.data?.url,
      };
    },
    async getUidFromUrl(url) {
      let methods = [
        () => require("CometRouteStore").getRoute(url).rootView.props.userID,
        async () => {
          var response = await fetch(url);
          if (response.status == 200) {
            var text = await response.text();
            let uid = /(?<=\"userID\"\:\")(.\d+?)(?=\")/.exec(text);
            if (uid?.length) {
              return uid[0];
            }
          }
          return null;
        },
      ];

      for (let m of methods) {
        try {
          let uid = await m();
          if (uid) return uid;
        } catch (e) {}
      }
      return null;
    },

    // Story
    getStoryBucketIdFromURL(url) {
      return url.match(/stories\/(\d+)\//)?.[1];
    },
    getStoryId() {
      const htmlStory = document.getElementsByClassName(
        "xh8yej3 x1n2onr6 xl56j7k x5yr21d x78zum5 x6s0dn4"
      );
      return htmlStory[htmlStory.length - 1].getAttribute("data-id");
    },
    async getStoryInfo(bucketID, fb_dtsg) {
      // Source: https://pastebin.com/CNvUxpfc
      let body = new URLSearchParams();
      body.append("__a", 1);
      body.append("fb_dtsg", fb_dtsg);
      body.append(
        "variables",
        JSON.stringify({
          bucketID: bucketID,
          initialLoad: false,
          scale: 1,
        })
      );
      body.append("doc_id", 2586853698032602);

      let res = await fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
        credentials: "include",
      });

      let json = await res.json();
      console.log(json);
      let data = json?.data?.bucket;

      if (!data) throw new Error("Không lấy được data");
      return {
        storyId: data.id,
        author: {
          id: data.owner.id,
          name: data.owner.name,
          avatar: data.owner.profile_picture.uri,
          avatarURL: data.owner.url,
        },
        Objects: data.unified_stories.edges.map((_, i) => {
          return {
            pictureBlurred:
              data.unified_stories.edges[i].node.attachments[0].media
                .blurredImage.uri,

            picturePreview:
              data.unified_stories.edges[i].node.attachments[0].media
                .previewImage.uri,

            totalReaction:
              data.unified_stories.edges[i].node.story_card_info
                .feedback_summary.total_reaction_count,

            backgroundCss:
              data.unified_stories.edges[i].node.story_default_background.color,

            backgroundCss3:
              data.unified_stories.edges[i].node.story_default_background
                .gradient.css,

            ...(data.unified_stories.edges[i].node.attachments[0].media
              .__typename == "Photo"
              ? {
                  caption:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .accessibility_caption,

                  image:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .image.uri,
                }
              : data.unified_stories.edges[i].node.attachments[0].media
                  .__typename == "Video"
              ? {
                  permanlinkUrl:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .permalink_url,

                  playableVideo:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .playable_url,

                  playableUrlDash:
                    data.unified_stories.edges[0].node.attachments[0].media
                      .playable_url_dash,

                  playableUrlHDString:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .playableUrlHdString,

                  playableUrlHD:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .playable_url_quality_hd,
                }
              : null),
          };
        }),
      };

      // let data =
      //   "__a=1&fb_dtsg=" +
      //   dtsg +
      //   "&variables=%7B%22bucketID%22%3A%22" +
      //   bucketID +
      //   "%22%2C%22initialLoad%22%3Afalse%2C%22scale%22%3A1%7D&doc_id=2586853698032602";

      // let xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;
      // xhr.addEventListener("readystatechange", function () {
      //   if (this.readyState === 4) {

      //   }
      // });

      // xhr.open("POST", "https://www.facebook.com/api/graphql/");
      // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      // xhr.send(body);
    },

    // Friend
    async removeFriendConfirm(friend_uid, uid, fb_dtsg) {
      var f = new FormData();
      f.append("uid", friend_uid),
        f.append("unref", "bd_friends_tab"),
        f.append("floc", "friends_tab"),
        f.append("__user", uid),
        f.append("__a", 1),
        f.append("fb_dtsg", fb_dtsg);
      await fetch(
        "https://www.facebook.com/ajax/ajax/profile/removefriendconfirm.php?dpr=1",
        {
          method: "POST",
          credentials: "include",
          body: f,
        }
      );
    },
    async fetchAddedFriends(uid, fb_dtsg, cursor) {
      let variables = JSON.stringify({
        count: 8,
        cursor: cursor ?? null,
        category_key: "FRIENDS",
      });
      const t = new URLSearchParams();
      t.append("__user", uid),
        t.append("__a", 1),
        t.append("dpr", 1),
        t.append("fb_dtsg", fb_dtsg),
        t.append("fb_api_caller_class", "RelayModern"),
        t.append("fb_api_req_friendly_name", "ActivityLogStoriesQuery"),
        t.append("doc_id", "2761528123917382"),
        t.append("variables", variables);

      let res = await fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        body: t,
      });
      let json = await res.json();

      let { edges, page_info } =
        json.data.viewer.activity_log_actor.activity_log_stories;

      return {
        nextCursor: page_info.end_cursor,
        data: edges
          .map((e) => {
            if (
              "UNFRIEND" === e.curation_options[0] ||
              e.node.attachments.length
            ) {
              return {
                uid: e.node.attachments[0].target.id,
                name: e.node.attachments[0].title_with_entities.text,
                avatar: e.node.attachments[0].media.image.uri,
                addedTime: 1e3 * e.node.creation_time,
              };
            }
            return null;
          })
          .filter((_) => _),
      };
    },
    async fetchAllAddedFriendsSince(uid, fb_dtsg, since, pageFetchedCallback) {
      let cursor = "";
      let allFriends = [];
      try {
        while (true) {
          let { nextCursor, data } =
            await UsefulScriptGlobalPageContext.Facebook.fetchAddedFriends(
              uid,
              fb_dtsg,
              cursor
            );
          cursor = nextCursor;
          allFriends = allFriends.concat(data);
          await pageFetchedCallback?.(data, allFriends);

          if (!nextCursor || (since && nextCursor < since)) break;
        }
      } catch (e) {
        console.log("ERROR fetch all added friends", e);
      }
      return allFriends;
    },

    // Messages
    async messagesCount(fb_dtsg) {
      return await UsefulScriptGlobalPageContext.Facebook.fetchGraphQl(
        "viewer(){message_threads{count,nodes{customization_info{emoji,outgoing_bubble_color,participant_customizations{participant_id,nickname}},all_participants{nodes{messaging_actor{name,id,profile_picture}}},thread_type,name,messages_count,image,id}}}",
        fb_dtsg
      );
    },

    // Page
    async unlikePage(pageId, uid, fb_dtsg) {
      var f = new FormData();
      f.append("fbpage_id", pageId),
        f.append("add", false),
        f.append("reload", false),
        f.append("fan_origin", "page_timeline"),
        f.append("__user", uid),
        f.append("__a", 1),
        f.append("fb_dtsg", fb_dtsg);
      await fetch("https://www.facebook.com/ajax/pages/fan_status.php?dpr=1", {
        method: "POST",
        credentials: "include",
        body: f,
      });
    },
    async searchPageForOther(other_uid, cursor, uid, fb_dtsg) {
      let variables = JSON.stringify({
        count: 8,
        scale: 1,
        cursor: cursor ?? null,
        id: btoa(`app_collection:${other_uid}:2409997254:96`),
      });

      let f = new URLSearchParams();
      f.append("__user", uid);
      f.append("__a", 1);
      f.append("dpr", 1);
      f.append("fb_dtsg", fb_dtsg);
      f.append("fb_api_caller_class", "RelayModern");
      f.append(
        "fb_api_req_friendly_name",
        "ProfileCometAppCollectionGridRendererPaginationQuery"
      );
      f.append("variables", variables);
      f.append("doc_id", 2983410188445167);

      try {
        let res = await fetch("https://www.facebook.com/api/graphql/", {
          method: "POST",
          body: f,
        });

        let json = await res.json();
        let { items } = json.data.node;
        return {
          nextCursor: items.page_info.end_cursor,
          data: items.edges.map((e) => ({
            id: e.node.node?.id || btoa(e.node.id).split(":").at(-1),
            name: e.node.title.text,
            subTitle: e.node.subtitle_text?.text,
            url: e.node.url,
            image: e.node.image.uri,
            cursor: e.cursor,
          })),
          totalCount: items.count,
        };
      } catch (e) {
        console.log("ERROR fetch page", e);
        return {
          nextCursor: null,
          data: [],
          totalCount: 0,
        };
      }
    },
    async searchAllPageForOther(other_uid, uid, fb_dtsg, pageFetchedCallback) {
      let cursor = "";
      let allPages = [];
      try {
        while (true) {
          let { nextCursor, data, totalCount } =
            await UsefulScriptGlobalPageContext.Facebook.searchPageForOther(
              other_uid,
              cursor,
              uid,
              fb_dtsg
            );
          cursor = nextCursor;
          allPages = allPages.concat(data);
          await pageFetchedCallback?.(data, allPages, totalCount);

          if (!cursor) break;
        }
      } catch (e) {
        console.log("ERROR search all page for other", e);
      }
      return allPages;
    },

    // Group
    async leaveGroup(groupId, uid, fb_dtsg) {
      var f = new FormData();
      f.append("fb_dtsg", fb_dtsg),
        f.append("confirmed", 1),
        f.append("__user", uid),
        f.append("__a", 1);
      await fetch(
        "https://www.facebook.com/ajax/groups/membership/leave.php?group_id=" +
          groupId +
          "&dpr=1",
        {
          method: "POST",
          credentials: "include",
          body: f,
        }
      );
    },
    async searchGroupForOther(other_uid, cursor, uid, fb_dtsg) {
      let variables = JSON.stringify({
        count: 8,
        cursor: cursor ?? null,
        id: btoa(`app_collection:${other_uid}:2361831622:66`),
      });

      let f = new URLSearchParams();
      f.append("__user", uid);
      f.append("__a", 1);
      f.append("dpr", 1);
      f.append("fb_dtsg", fb_dtsg);
      f.append("fb_api_caller_class", "RelayModern");
      f.append(
        "fb_api_req_friendly_name",
        "ProfileCometAppCollectionGridRendererPaginationQuery"
      );
      f.append("variables", variables);
      f.append("doc_id", 5244211935648733);

      try {
        let res = await fetch("https://www.facebook.com/api/graphql/", {
          method: "POST",
          body: f,
        });

        let json = await res.json();
        let { pageItems } = json.data.node;
        return {
          nextCursor: pageItems.page_info.end_cursor,
          data: pageItems.edges.map((e) => ({
            id: e.node.node?.id || btoa(e.node.id).split(":").at(-1),
            title: e.node.title.text,
            subTitle: e.node.subtitle_text?.text,
            url: e.node.url,
            visibility: e.node.node.visibility,
            image: e.node.image.uri,
            membersCount: Number(
              // e.node.node.forum_member_profiles.formatted_count_text ||
              // e.node.node.group_member_profiles.formatted_count_text
              (e.node.subtitle_text.text.split("\n")?.[0] || "")
                .match(/\d+/g)
                .join("") ?? 1
            ),
            cursor: e.cursor,
          })),
        };
      } catch (e) {
        console.log("ERROR fetch page", e);
        return {
          nextCursor: null,
          data: [],
        };
      }
    },
    async searchAllGroupForOther(other_uid, uid, fb_dtsg, pageFetchedCallback) {
      let cursor = "";
      let allGroups = [];
      try {
        while (true) {
          let { nextCursor, data } =
            await UsefulScriptGlobalPageContext.Facebook.searchGroupForOther(
              other_uid,
              cursor,
              uid,
              fb_dtsg
            );
          cursor = nextCursor;
          allGroups = allGroups.concat(data);
          await pageFetchedCallback?.(data, allGroups);

          if (!cursor) break;
        }
      } catch (e) {
        console.log("ERROR search all group for other", e);
      }
      return allGroups;
    },
  },
  Tiktok: {
    downloadTiktokVideoFromId: async function (videoId) {
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
          let data = await fetch(api + videoId + "&" + params);
          let json = await data.json();
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
    },
    CACHE: {
      snapTikToken: null,
    },
    downloadTiktokVideoFromUrl: async function (url) {
      try {
        let token = UsefulScriptGlobalPageContext.Tiktok.CACHE.snapTikToken;
        if (!token) {
          let token = await UsefulScriptGlobalPageContext.SnapTik.getToken();
          if (!token) throw Error("Không tìm thấy token snaptik");
          UsefulScriptGlobalPageContext.Tiktok.CACHE.snapTikToken = token;
        }

        let data = new FormData();
        data.append("url", url);
        data.append("token", token);

        let res = await fetch("https://snaptik.app/abc2.php", {
          method: "POST",
          body: data,
        });
        let text = await res.text();
        let result = UsefulScriptGlobalPageContext.SnapTik.decode(text);
        return result;
      } catch (e) {
        console.log("ERROR: " + e);
      }
    },
  },
  SnapTik: {
    getToken: async () => {
      let res = await fetch("https://snaptik.app/");
      let text = await res.text();
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
            if (h.indexOf(b) !== -1)
              return (a += h.indexOf(b) * Math.pow(e, c));
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
      let payload = UsefulScriptGlobalPageContext.Utils.parseJwt(jwt);
      return payload?.url;
    },
  },
};
window.UsefulScriptGlobalPageContext = UsefulScriptGlobalPageContext;

// Chứa các hàm hỗ trợ việc hack web :))
const UsefulScriptsUtils = {
  // Có trang web tự động xoá console để ngăn cản người dùng xem kết quả thực thi câu lệnh trong console
  // Ví dụ: https://beta.nhaccuatui.com/
  // Hàm này sẽ tắt chức năng tự động clear console đó, giúp hacker dễ hack hơn :)
  disableAutoConsoleClear() {
    window.console.clear = () => null;
    console.log("Auto console.clear DISABLED!");
  },

  // Hiển thị tất cả các biến toàn cục được tạo ra trong trang web
  // https://mmazzarolo.com/blog/2022-02-14-find-what-javascript-variables-are-leaking-into-the-global-scope/
  listGlobalVariables() {
    let browserGlobals = [];
    const ignoredGlobals = ["UsefulScriptsUtils"];

    function collectBrowserGlobals() {
      const iframe = window.document.createElement("iframe");
      iframe.src = "about:blank";
      window.document.body.appendChild(iframe);
      let globals = Object.keys(iframe.contentWindow);
      window.document.body.removeChild(iframe);
      return globals;
    }

    function getRuntimeGlobals() {
      if (browserGlobals.length === 0) {
        browserGlobals = collectBrowserGlobals();
      }
      const runtimeGlobals = Object.keys(window).filter(
        (key) => !ignoredGlobals.includes(key) && !browserGlobals.includes(key)
      );
      const runtimeGlobalsObj = {};
      runtimeGlobals.forEach((key, i) => {
        runtimeGlobalsObj[key] = window[key];
      });
      return runtimeGlobalsObj;
    }

    return getRuntimeGlobals();
  },

  // https://mmazzarolo.com/blog/2022-07-30-checking-if-a-javascript-native-function-was-monkey-patched/
  // Kiểm tra xem function nào đó có bị override hay chưa
  isNativeFunction(f) {
    return f.toString().toString().includes("[native code]");
  },

  // https://mmazzarolo.com/blog/2022-06-26-filling-local-storage-programmatically/
  // Làm đầy localStorage
  fillLocalStorage() {
    const key = "__filling_localstorage__";
    let max = 1;
    let data = "x";
    try {
      while (true) {
        data = data + data;
        localStorage.setItem(key, data);
        max <<= 1;
      }
    } catch {}
    for (let bit = max >> 1; bit > 0; bit >>= 1) {
      try {
        localStorage.setItem(key, data.substring(0, max | bit));
        max |= bit;
      } catch {
        console.success("Storage is now completely full 🍟");
      }
    }
    return function cleanup() {
      localStorage.removeItem(key);
      console.success("Storage is cleaned");
    };
  },

  // https://mmazzarolo.com/blog/2022-02-16-track-down-the-javascript-code-responsible-for-polluting-the-global-scope/
  globalsDebugger(varName = "") {
    // https://stackoverflow.com/a/56933091/11898496
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("globalsToInspect", varName);
    window.location.search = urlParams.toString();
  },

  // Tìm chuỗi xung quanh chuỗi bất kỳ
  // Ví dụ fullString = "abcd1234567890abcd" targetString = "6" bound = 3
  // => Kết quả around = 3456789
  getTextAround(fullString, targetString, bound = 10) {
    let curIndex = 0;
    let arounds = [];
    let limit = 100;

    while (limit) {
      let index = fullString.indexOf(targetString, curIndex);
      if (index === -1) break;

      let around = fullString.slice(
        Math.max(index - Math.floor(bound / 2) - 1, 0),
        Math.min(
          index + targetString.length + Math.floor(bound / 2),
          fullString.length
        )
      );
      arounds.push({ index, around });
      curIndex = index + (targetString.length || 1);
      limit--;
    }
    return arounds;
  },

  // https://stackoverflow.com/a/40410744/11898496
  // Giải mã từ dạng 'http\\u00253A\\u00252F\\u00252Fexample.com' về 'http://example.com'
  decodeEscapedUnicodeString(str) {
    if (!str) return "";
    return decodeURIComponent(
      JSON.parse('"' + str.replace(/\"/g, '\\"') + '"')
    );
  },

  // https://stackoverflow.com/a/8649003
  searchParamsToObject(search) {
    // let d = {};
    // decodeURI(search)
    //   .split("&")
    //   .map((_) => _.split("="))
    //   .forEach((_) => (d[_[0]] = _[1]));
    // return d;

    search = search || location.search.substring(1);
    return JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function (key, value) {
        return key === "" ? value : decodeURIComponent(value);
      }
    );
  },

  downloadData: UsefulScriptGlobalPageContext.Utils.downloadData,
};
window.UsefulScriptsUtils = UsefulScriptsUtils;
