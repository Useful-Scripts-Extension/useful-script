import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { fetchGraphQl } from "./fb_GLOBAL.js";

export default {
  icon: "",
  name: {
    en: "Test",
    vi: "Test",
  },
  description: {
    en: "",
    vi: "",
  },

  popupScript: {
    _onClick: async () => {
      const { openWebAndRunScript } = await import("./helpers/utils.js");

      let firstImgOfAlbumUrl = prompt("Enter url of album's first image", "");
      if (!firstImgOfAlbumUrl) return;

      let res = await openWebAndRunScript({
        url: firstImgOfAlbumUrl,
        waitUntilLoadEnd: true,
        closeAfterRunScript: true,
        func: async () => {
          return await new Promise((resolve) => {
            resolve("abc");
            return;
            let result = new Map();
            let end = UfsGlobal.DOM.onElementsAdded(
              '[data-visualcompletion="media-vc-image"]',
              async (eles) => {
                try {
                  let id = location.href.match(/\?fbid=(\d+)/)?.[1];
                  let img = eles[0];
                  if (id && img) {
                    console.log(img.src);
                    result.set(id, img.src);
                  }
                  let nextImgBtn = document.querySelector(
                    '[aria-label="Ảnh tiếp theo"]'
                  );
                  if (nextImgBtn) {
                    nextImgBtn.click();
                  } else {
                    end();
                    let isFail = document.body.textContent.match(
                      "Rất tiếc, nội dung này hiện chưa thể hiển thị"
                    );
                    console.log("fail", isFail);
                    resolve({ result, hasNext: isFail });
                  }
                } catch (e) {
                  alert(e);
                  console.log(e);
                  resolve({ result, hasNext: false });
                }
              }
            );
          });
        },
      });
      console.log(res);
      alert(res);
    },
    // fake window update screen
    _onClick: async () => {
      const { openWebAndRunScript } = await import("./helpers/utils.js");
      openWebAndRunScript({
        url: "https://www.whitescreen.online/blue-screen-of-death-windows/",
        func: () => {
          setTimeout(() => {
            document.querySelector(".full-screen").click();
          }, 1000);
        },
        focusImmediately: true,
        waitUntilLoadEnd: true,
      });
    },

    // saveAsMHTML
    _onClick: async () => {
      const { getCurrentTab, showLoading } = await import("./helpers/utils.js");
      const tab = await getCurrentTab();

      const blob = await chrome.pageCapture.saveAsMHTML({
        tabId: tab.id,
      });

      chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: "web.mhtml",
      });
    },

    // Delete browsers history
    _onClick: async () => {
      const { getCurrentTab, showLoading } = await import("./helpers/utils.js");

      const { setLoadingText, closeLoading } = showLoading(
        "Đang lấy thông tin web..."
      );

      const tab = await getCurrentTab();

      setLoadingText("Đang lấy lịch sử duyệt web...");
      let hostname = new URL(tab.url).hostname;
      let today = new Date();
      let weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const histories = await chrome.history.search({
        text: hostname,
        maxResults: 10000,
        startTime: weekAgo.getTime(),
      });

      if (
        confirm(
          "Tìm thấy " +
            histories?.length +
            " lịch sử duyệt web của " +
            hostname +
            "\n\nXác nhận xoá?"
        )
      ) {
        for (let i = 0; i < histories.length; i++) {
          let his = histories[i];
          setLoadingText(`Đang xoá ${i}/${histories.length}...`);
          try {
            await chrome.history.deleteUrl({ url: his.url });
          } catch (e) {
            console.log(e);
          }
        }
      }
      closeLoading();

      /*
      [
        {
            "id": "16571",
            "isLocal": true,
            "referringVisitId": "0",
            "transition": "link",
            "visitId": "41240",
            "visitTime": 1714833166516.668
        },
        {
            "id": "16571",
            "isLocal": true,
            "referringVisitId": "0",
            "transition": "link",
            "visitId": "41241",
            "visitTime": 1714833168457.202
        }
      ]
    */
    },
  },

  contentScript: {
    // bypass anonyviet
    _onDocumentEnd: () => {
      if (location.hostname === "anonyviet.com") {
        let url = new URL(location.href);
        if (url.searchParams.has("url")) {
          let target = url.searchParams.get("url");
          window.open(target, "_self");
        }
      }
    },

    // sync element position accross all tabs
    _onDocumentStart: (details) => {
      console.log(details);

      const div = document.createElement("div");
      div.id = "ufs-test";
      div.innerHTML = `
      <style>
        #ufs-test {
          position: fixed;
          background-color: #f1f1f1;
          border: 1px solid #d3d3d3;
          text-align: center;
          z-index: 999999999;
          top: 0;
          left: 0;
        }

        #ufs-testheader {
          padding: 10px;
          cursor: move;
          z-index: 10;
          background-color: #2196F3;
          color: #fff;
        }
      </style>
      <div id="ufs-testheader">Click here to move</div>
      <p>Move</p>
      <p>this</p>
      <p>DIV</p>`;
      document.documentElement.appendChild(div);

      window.ufs_test = (x, y) => {
        div.style.top = y + "px";
        div.style.left = x + "px";
      };

      // Make the DIV element draggable:
      dragElement(div, (x, y) => {
        console.log(x, y);
        chrome.runtime.sendMessage({ action: "ufs-test", data: { x, y } });
      });

      function dragElement(elmnt, onMoved) {
        var pos1 = 0,
          pos2 = 0,
          pos3 = 0,
          pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "header").onmousedown =
            dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = elmnt.offsetTop - pos2 + "px";
          elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;

          onMoved?.(parseInt(elmnt.style.left), parseInt(elmnt.style.top));
        }
      }
    },

    // text size in KB
    _onClick: () => {
      function formatSize(size, fixed = 0) {
        size = Number(size);
        if (!size) return "?";

        const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }
        return size.toFixed(fixed) + units[unitIndex];
      }

      // https://stackoverflow.com/a/23329386
      function byteLength(str) {
        // returns the byte length of an utf8 string
        var s = str.length;
        for (var i = str.length - 1; i >= 0; i--) {
          var code = str.charCodeAt(i);
          if (code > 0x7f && code <= 0x7ff) s++;
          else if (code > 0x7ff && code <= 0xffff) s += 2;
          if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
        }
        return s;
      }

      try {
        let text = document.body.innerText;
        let len = text.length;
        let size = byteLength(text);
        size = formatSize(size, 1);
        alert("Text in this website: " + len + " characters (" + size + ")");
      } catch (e) {
        alert(e);
      }
    },

    // render video in document.title
    _onClick: () => {
      let video = document.querySelector("video");

      if (!video) {
        alert("Không tìm thấy video");
        return;
      }

      let canvas = document.createElement("canvas");
      canvas.style.cssText = `
        width: 64px;
        height: 64px;
        position: fixed;
        top: 0;
        left: 0;
      `;
      document.body.appendChild(canvas);

      let context = canvas.getContext("2d");

      let favicons = document.querySelectorAll("link[rel*='icon']");
      favicons.forEach((el) => {
        el.remove();
      });

      let favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      document.head.appendChild(favicon);

      function updateFavicon() {
        requestAnimationFrame(updateFavicon);
        let img = canvas.toDataURL();
        favicon.setAttribute("href", img);
      }

      setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }, 1000 / 30);

      updateFavicon();
    },
  },

  pageScript: {
    onClick: () => {
      fetchGraphQl();
    },
    _onClick: async () => {
      (async () => {
        function getGroupId() {
          let found = /(?<=\/groups\/)(.\d+?)($|(?=\/)|(?=&))/.exec(
            location.href
          )?.[0];
          if (found) return found;
          const list_a = document.querySelectorAll("a");
          for (let a of Array.from(list_a)) {
            let found = /(?<=\/groups\/)(.\d+?)(?=\/user\/)/.exec(a.href)?.[0];
            if (found) return found;
          }
          return null;
        }
        function getPageId() {
          let funcs = [
            () =>
              require("CometRouteStore").getRoute(location.pathname).rootView
                .props.userID,
            () =>
              /(?<=\"pageID\"\:\")(.*?)(?=\")/.exec(document.body.innerHTML)[0],
            () =>
              /(?<=facebook\.com\/)(.*?)($|(?=\/)|(?=&))/.exec(
                location.href
              )[0],
            () => {
              const tags = Array.from(
                document.body.querySelectorAll("script:not([src])")
              );
              for (const tag of tags) {
                let matches = tag.textContent.match(/"pageID":"([0-9]+)"/);
                if (matches) {
                  return matches[1];
                }
              }
              return null;
            },
          ];
          for (let fn of funcs) {
            try {
              let result = fn();
              if (result) return result;
            } catch (e) {}
          }
          return null;
        }
        function getFbdtsg() {
          return (
            require("DTSGInitialData").token ||
            document.querySelector('[name="fb_dtsg"]').value
          );
        }

        function getToken2() {
          return new Promise((resolve, reject) => {
            let uid = /(?<=c_user=)(\d+)/.exec(document.cookie)?.[0];
            if (!uid) {
              reject("Không tìm thấy uid trong cookie. Bạn đã đăng nhập chưa?");
              return;
            }
            let dtsg =
                require("DTSGInitialData").token ||
                document.querySelector('[name="fb_dtsg"]').value,
              xhr = new XMLHttpRequest(),
              url = "//www.facebook.com/v1.0/dialog/oauth/confirm",
              params =
                "fb_dtsg=" +
                dtsg +
                "&app_id=124024574287414&redirect_uri=fbconnect%3A%2F%2Fsuccess&display=page&access_token=&from_post=1&return_format=access_token&domain=&sso_device=ios&_CONFIRM=1&_user=" +
                uid;
            xhr.open("POST", url, !0);
            xhr.setRequestHeader(
              "Content-type",
              "application/x-www-form-urlencoded"
            );
            xhr.onreadystatechange = function () {
              if (4 == xhr.readyState && 200 == xhr.status) {
                var a = xhr.responseText.match(/(?<=access_token=)(.*?)(?=\&)/);
                if (a && a[0]) {
                  resolve(a[0]);
                } else {
                  reject("Failed to Get Access Token.");
                }
              }
            };
            xhr.onerror = function () {
              reject("Failed to Get Access Token.");
            };
            xhr.send(params);
          });
        }
        function getToken1() {
          return new Promise((resolve, reject) => {
            let uid = /(?<=c_user=)(\d+)/.exec(document.cookie)?.[0];
            if (!uid) {
              reject("Không tìm thấy uid trong cookie. Bạn đã đăng nhập chưa?");
              return;
            }
            let dtsg =
                require("DTSGInitialData").token ||
                document.querySelector('[name="fb_dtsg"]').value,
              xhr = new XMLHttpRequest(),
              data = new FormData(),
              url = `https://www.facebook.com/dialog/oauth/business/cancel/?app_id=256002347743983&version=v19.0&logger_id=&user_scopes[0]=email&user_scopes[1]=read_insights&user_scopes[2]=read_page_mailboxes&user_scopes[3]=pages_show_list&redirect_uri=fbconnect%3A%2F%2Fsuccess&response_types[0]=token&response_types[1]=code&display=page&action=finish&return_scopes=false&return_format[0]=access_token&return_format[1]=code&tp=unspecified&sdk=&selected_business_id=&set_token_expires_in_60_days=false`;
            data.append("fb_dtsg", dtsg);
            xhr.open("POST", url, !0);
            xhr.onreadystatechange = function () {
              if (4 == xhr.readyState && 200 == xhr.status) {
                var a = xhr.responseText.match(/(?<=access_token=)(.*?)(?=\&)/);
                if (a && a[0]) {
                  resolve(a[0]);
                } else {
                  reject("Failed to Get Access Token.");
                }
              }
            };
            xhr.onerror = function () {
              reject("Failed to Get Access Token.");
            };
            xhr.send(data);
          });
        }
        function getToken(option = 1) {
          return option === 1 ? getToken1() : getToken2();
        }

        async function getAllAlbums(id, access_token) {
          let result = [];
          let after = "";
          while (true) {
            try {
              const res = await fetch(
                `https://graph.facebook.com/v20.0/${id}/albums?fields=type,name,count,link,created_time&limit=100&access_token=${access_token}&after=${after}`
              );
              const json = await res.json();
              if (json.data) result = result.concat(json.data);

              let nextAfter = json.paging?.cursors?.after;
              if (!nextAfter || nextAfter === after) break;
              after = nextAfter;
            } catch (e) {
              break;
            }
          }
          return result;
        }

        async function fetchAlbumPhotosFromCursor({
          cursor,
          albumId,
          access_token,
        }) {
          for (let _ of [
            `https://graph.facebook.com/v20.0/${albumId}/photos?fields=largest_image{source}&limit=100&access_token=${access_token}`,
            // `https://graph.facebook.com/v20.0/${albumId}?fields=photos{largest_image{source}}&limit=25&access_token=${access_token}`,
          ]) {
            let url = encodeURI(_);
            if (cursor) url += `&after=${cursor}`;
            console.log(url);
            const res = await fetch(url);
            const json = await res.json();
            console.log("json", json);
            const root = json?.photos || json;
            if (!json || !root?.data?.length) {
              continue;
            }
            return {
              imgData:
                root?.data?.map((_) => ({
                  id: _.id,
                  url: _.largest_image.source,
                })) || [],
              nextCursor: root?.paging?.cursors?.after || null,
            };
          }
        }
        async function fetchAlbumPhotos({
          albumId,
          access_token,
          pageLimit = Infinity,
          fromPhotoId = null,
          progress = async () => {},
        }) {
          let currentPage = 1;
          let hasNextCursor = true;
          let nextCursor = fromPhotoId
            ? Buffer.from(fromPhotoId).toString("base64")
            : null;

          let photIds = new Set();
          let allImgsData = [];
          while (hasNextCursor && currentPage <= pageLimit) {
            const data = await fetchAlbumPhotosFromCursor({
              albumId,
              access_token,
              cursor: nextCursor,
            });
            if (data?.imgData) {
              let added = false;
              for (let img of data.imgData) {
                if (!photIds.has(img.id)) {
                  added = true;
                  photIds.add(img.id);
                  allImgsData.push(img);
                }
              }
              await progress(photIds.size);

              nextCursor = data.nextCursor;
              hasNextCursor = added && nextCursor != null;
              currentPage++;
            } else {
              console.log("[!] ERROR.");
              break;
            }
          }
          return allImgsData;
        }

        function downloadData(data, filename) {
          let file = new Blob([data], { type: "text/plain" });
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, filename);
          } else {
            let a = document.createElement("a"),
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
        }

        function wrapGraphQlParams(params) {
          const formBody = [];
          for (const property in params) {
            const encodedKey = encodeURIComponent(property);
            const value =
              typeof params[property] === "string"
                ? params[property]
                : JSON.stringify(params[property]);
            const encodedValue = encodeURIComponent(value);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          return formBody.join("&");
        }

        async function fetchGraphQl(params, fb_dtsg = getFbdtsg()) {
          let form = wrapGraphQlParams({
            ...params,
            fb_dtsg,
          });

          let res = await fetch("https://www.facebook.com/api/graphql/", {
            body: form,
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            credentials: "include",
          });

          let json = await res.text();
          return json;
        }

        async function enlargePhoto(photo_id, albumId) {
          let res = await fetchGraphQl({
            fb_api_req_friendly_name: "CometPhotoRootContentQuery",
            variables: {
              isMediaset: true,
              renderLocation: "permalink",
              nodeID: photo_id,
              mediasetToken: "a." + albumId,
              scale: 2,
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
            },
            server_timestamps: true,
            doc_id: "7575853042491661",
          });
          let first = JSON.parse(res.split("\n")[0]);
          return first.data.currMedia.image.uri;
        }

        async function enlargePhotos(albumPhotos, albumId, progress) {
          let result = [];
          for (let i = 0; i < albumPhotos.length; i++) {
            try {
              let photo = albumPhotos[i];
              progress?.(i, albumPhotos.length);
              let large = await enlargePhoto(photo.id, albumId);
              result.push(...large);
              console.log("large", photo.uri, large);
            } catch (e) {
              result.push(photo.uri);
              console.log("ERROR", e);
            }
          }
          return result;
        }

        async function downloadAlbum({ albumId, progress, cursor = null }) {
          let result = [];
          let retry = 3;
          let tried = 0;
          while (true) {
            try {
              let res = await fetchGraphQl({
                fb_api_req_friendly_name:
                  "ProfileCometLegacyAlbumGridViewPaginationQuery",
                variables: {
                  id: albumId,
                  scale: 1.5,
                  count: 14,
                  cursor,
                },
                doc_id: 5520045484790315,
              });
              let json = JSON.parse(res);
              console.log(json);
              const { edges, page_info } = json.data.node.grid_media;
              result.push(
                ...edges.map((edge) => ({
                  creationId: edge.node.creation_story.id,
                  uri: edge.node.image.uri,
                  id: edge.node.id,
                }))
              );
              progress?.(result.length);
              tried = 0; // reset tried
              if (page_info?.has_next_page) cursor = page_info.end_cursor;
              else break;
            } catch (e) {
              console.log("ERROR", e);
              tried++;
              if (tried > retry) break;
              else await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          }
          return result;
        }

        const id = prompt("Nhập user/page id muốn tải:");
        if (!id) return;

        let options = [2, 1];
        for (let i = 0; i < options.length; i++) {
          try {
            let option = options[i];
            console.log("try ", option);
            let access_token = await getToken(option);
            // console.log(access_token);

            const albums = await getAllAlbums(id, access_token);
            if (!albums?.length) throw new Error("Không tìm thấy album nào");

            console.log(albums);

            const allResult = [];
            for (let album of albums) {
              console.log("Đang tải album...", album);

              const result = await fetchAlbumPhotos({
                access_token,
                albumId: album.id,
                fromPhotoId: null,
                progress: (loaded) => {
                  console.log(`Đang tải ${loaded}/${album.count}...`);
                },
              });

              if (result.length < album.count) {
                const result2 = await downloadAlbum({
                  albumId: album.id,
                  cursor: btoa("fbid:" + result[result.length - 1].id),
                  progress: (current) => {
                    console.log(
                      `Đang tải ${current + result.length}/${album.count}...`
                    );
                  },
                });
                console.log(result2);
                const largest = await enlargePhotos(
                  result2,
                  album.id,
                  (current) => {
                    console.log(
                      `Đang tải ảnh lớn ${current}/${result2.length}...`
                    );
                  }
                );
                console.log(largest);
                result.push(...largest);
              }

              console.log(result);
              if (result?.length) allResult.push(...result);
            }

            if (allResult?.length) {
              console.log("DONE", allResult);
              let uniqueResult = Array.from(new Set(allResult));
              console.log(uniqueResult);
              alert(
                "Tải xong " +
                  uniqueResult.size +
                  " Ảnh. Bắt đầu tìm ảnh chất lượng cao."
              );

              // let largestPhotos = await enlargePhotos(uniqueResult);
              // console.log(largestPhotos);

              downloadData(Array.from(uniqueResult).join("\n"), id + ".txt");
              return;
            }
          } catch (e) {
            let outOfOption = i === options.length - 1;
            if (outOfOption) alert("Error: " + e);
            console.log("ERROR", e);
          }
        }
      })();
    },
  },

  backgroundScript: {
    // sync element position accross all tabs
    _onDocumentStart: (details, context) => {
      const cachedPos = context.getCache("ufs-test", { x: 0, y: 0 });
      updatePos(details.tabId, cachedPos.x, cachedPos.y);
    },
    _runtime: {
      onMessage: ({ request, sender, sendResponse }, context) => {
        if (request.action === "ufs-test" && request.data) {
          context.setCache("ufs-test", request.data);
          chrome.tabs.query({}, (tabs) => {
            for (let tab of tabs) {
              try {
                updatePos(tab.id, request.data.x, request.data.y);
              } catch (e) {}
            }
          });
        }
      },
    },
  },
};

function updatePos(tabId, x, y) {
  chrome.scripting.executeScript({
    target: {
      tabId: tabId,
    },
    func: (x, y) => {
      let interval = setInterval(() => {
        if (typeof window.ufs_test == "function") {
          window.ufs_test?.(x, y);
          clearInterval(interval);
          clearTimeout(timeout);
        }
      }, 100);

      let timeout = setTimeout(() => clearInterval(interval), 10000);
    },
    args: [x, y],
  });
}

const backup = () => {
  (() => {
    // modify window.fetch
    const originalFetch = fetch;
    fetch = function (...args) {
      console.log("fetch", ...args);
      return originalFetch(...args).then(async (res) => {
        try {
          console.log("res ne", res);
          let clone = res.clone();
          let json = await clone.json();
          console.log("json", json);

          json = {
            success: true,
            data: {},
          };
          console.log("modifiedJson", json);

          let modifiedResponse = new Response(JSON.stringify(json));
          [
            "headers",
            "ok",
            "redirected",
            "status",
            "statusText",
            "type",
            "url",
          ].forEach((key) => {
            modifiedResponse[key] = res[key];
          });

          console.log("modifiedResponse", modifiedResponse);
          return modifiedResponse;
        } catch (e) {
          console.log("error", e);
          return res;
        }
      });
    };
  })();

  (() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("onMessage", request, sender, sendResponse);
    });
  })();
};
