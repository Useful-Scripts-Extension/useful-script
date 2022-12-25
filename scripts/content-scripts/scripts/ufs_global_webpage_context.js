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
  },
  DOM: {
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
      UsefulScriptGlobalPageContext.onElementsVisible(
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
        UsefulScriptGlobalPageContext.onElementsVisible(
          selector,
          resolve,
          false
        );
      });
    },

    // Idea from  https://github.com/gys-dev/Unlimited-Stdphim
    // https://stackoverflow.com/a/61511955/11898496
    onElementsVisible: async (selector, callback, willReRun) => {
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
  },
  Facebook: {
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
    getUserAvatarFromUid(uid) {
      return (
        "https://graph.facebook.com/" +
        uid +
        "/picture?height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
      );
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
        name: UsefulScriptsUtils.decodeEscapedUnicodeString(
          /"name":"(.*?)"/.exec(text)?.[1]
        ),
        profiePicLarge: UsefulScriptsUtils.decodeEscapedUnicodeString(
          /"profilePicLarge":{"uri":"(.*?)"/.exec(text)?.[1]
        ),
        //  profiePicMedium: /"profilePicMedium":{"uri":"(.*?)"/.exec(text)?.[1],
        //  profiePicSmall: /"profilePicSmall":{"uri":"(.*?)"/.exec(text)?.[1],
        //  profilePic160: /"profilePic160":{"uri":"(.*?)"/.exec(text)?.[1],
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
      return await e.json();
    },
    decodeArrId(arrId) {
      return arrId[0] * 4294967296 + arrId[1];
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
    getStoryBucketIdFromURL(url) {
      return url.match(/stories\/(\d+)\//)?.[1];
    },
    getStoryId() {
      const htmlStory = document.getElementsByClassName(
        "xh8yej3 x1n2onr6 xl56j7k x5yr21d x78zum5 x6s0dn4"
      );
      return htmlStory[htmlStory.length - 1].getAttribute("data-id");
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
    // Source: https://pastebin.com/CNvUxpfc
    async getStoryInfo(bucketID, fb_dtsg) {
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
    async unlikePage(pageId, user, fb_dtsg) {
      var f = new FormData();
      f.append("fbpage_id", pageId),
        f.append("add", false),
        f.append("reload", false),
        f.append("fan_origin", "page_timeline"),
        f.append("__user", user),
        f.append("__a", 1),
        f.append("fb_dtsg", fb_dtsg);
      await fetch("https://www.facebook.com/ajax/pages/fan_status.php?dpr=1", {
        method: "POST",
        credentials: "include",
        body: f,
      });
    },
    async leaveGroup(groupId, user, fb_dtsg) {
      var f = new FormData();
      f.append("fb_dtsg", fb_dtsg),
        f.append("confirmed", 1),
        f.append("__user", user),
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
    async removeFriendConfirm(friend_uid, user, fb_dtsg) {
      var f = new FormData();
      f.append("uid", friend_uid),
        f.append("unref", "bd_friends_tab"),
        f.append("floc", "friends_tab"),
        f.append("__user", user),
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
    async messagesCount(fb_dtsg) {
      return await UsefulScriptGlobalPageContext.Facebook.fetchGraphQl(
        "viewer(){message_threads{count,nodes{customization_info{emoji,outgoing_bubble_color,participant_customizations{participant_id,nickname}},all_participants{nodes{messaging_actor{name,id,profile_picture}}},thread_type,name,messages_count,image,id}}}",
        fb_dtsg
      );
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
};
window.UsefulScriptsUtils = UsefulScriptsUtils;

// ================================= Polyfill =================================
// Chrome pre-34
if (!Element.prototype.matches)
  Element.prototype.matches = Element.prototype.webkitMatchesSelector;

// https://mmazzarolo.com/blog/2022-08-25-simple-colored-logging-for-javascript-clis/
window.console.success = (...args) => console.log("\x1b[32m✔\x1b[0m", ...args);
window.console.failure = (...args) =>
  console.error("\x1b[31mｘ\x1b[0m", ...args);
