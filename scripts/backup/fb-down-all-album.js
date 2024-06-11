(async () => {
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
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
        url =
          "https://www.facebook.com/dialog/oauth/business/cancel/?app_id=256002347743983&version=v19.0&logger_id=&user_scopes[0]=email&user_scopes[1]=read_insights&user_scopes[2]=read_page_mailboxes&user_scopes[3]=pages_show_list&redirect_uri=fbconnect%3A%2F%2Fsuccess&response_types[0]=token&response_types[1]=code&display=page&action=finish&return_scopes=false&return_format[0]=access_token&return_format[1]=code&tp=unspecified&sdk=&selected_business_id=&set_token_expires_in_60_days=false";
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

  async function fetchAlbumPhotosFromCursor({ cursor, albumId, access_token }) {
    for (let _ of [
      `https://graph.facebook.com/v20.0/${albumId}/photos?fields=largest_image{source}&limit=100&access_token=${access_token}`,
    ]) {
      let url = encodeURI(_);
      if (cursor) url += "&after=" + cursor;
      const res = await fetch(url);
      const json = await res.json();
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
      if (!data?.imgData) break;
      let added = false;
      for (let img of data.imgData) {
        if (!photIds.has(img.id)) {
          added = true;
          photIds.add(img.id);
          allImgsData.push(img.url);
        }
      }
      await progress(photIds.size);

      nextCursor = data.nextCursor;
      hasNextCursor = added && nextCursor != null;
      currentPage++;
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

  const key = "ufs-fb-album-run-count";
  let count = localStorage.getItem(key) || 0;
  if (Date.now() > new Date("2024-06-13").getTime() || count >= 2) {
    alert("Script đã hết hạn, vui lòng liên hệ gia hạn");
    return;
  }

  const id = prompt("Nhập user/page id muốn tải:");
  if (!id) return;

  localStorage.setItem(key, ++count);

  let options = [2, 1];
  for (let i = 0; i < options.length; i++) {
    try {
      let option = options[i];
      let access_token = await getToken(option);
      console.log(access_token);

      const albums = await getAllAlbums(id, access_token);
      if (!albums?.length) throw new Error("Không tìm thấy album nào");

      console.log(albums);

      const allResult = [];
      for (let i = 0; i < albums.length; i++) {
        let album = albums[i];
        console.log(`Đang tải album ${i}/${albums.length}...`, album);

        const result = await fetchAlbumPhotos({
          access_token,
          albumId: album.id,
          fromPhotoId: null,
          progress: (loaded) => {
            console.log(`Đang tải ${loaded}/${album.count}...`);
          },
        });

        console.log(result);
        if (result?.length) allResult.push(...result);
      }

      if (allResult?.length) {
        let uniqueResult = Array.from(new Set(allResult));
        console.log(uniqueResult);
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
