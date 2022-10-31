export default {
  name: {
    en: "Download fb album media links",
    vi: "Tải link ảnh/video từ album fb",
  },
  description: {
    en: "Download photo/video links from album",
    vi: "Tải về danh sách link ảnh/video",
  },
  blackList: [],
  whiteList: ["www.facebook.com"],
  func: function () {
    const accessToken = prompt("Enter access token:", "");
    if (!accessToken) return;
    const albumId = prompt("Enter album id: ", "");
    if (!albumId) return;
    async function fetchAlbumPhotosFromCursor({ albumId, cursor }) {
      let url = `https://graph.facebook.com/v12.0/${albumId}/photos?fields=largest_image&limit=100&access_token=${accessToken}`;
      if (cursor) url += `&after=${cursor}`;
      const data = await fetch(url);
      const json = await data.json();
      if (!json) return null;
      return {
        imgData: json.data?.map((_) => ({
          id: _.id,
          url: _.largest_image.source,
        })),
        nextCursor: json.paging?.cursors?.after || null,
      };
    }
    async function fetchAlbumPhotos({
      albumId,
      pageLimit = Infinity,
      fromPhotoId = null,
      pageFetchedCallback = async () => {},
    }) {
      let currentPage = 1;
      let hasNextCursor = true;
      let nextCursor = fromPhotoId
        ? Buffer.from(fromPhotoId).toString("base64")
        : null;
      let allImgsData = [];
      while (hasNextCursor && currentPage <= pageLimit) {
        console.log(
          `ĐANG TẢI TRANG: ${currentPage}, Kích thước trang: 100 ảnh...`
        );
        const data = await fetchAlbumPhotosFromCursor({
          albumId,
          cursor: nextCursor,
        });
        if (data?.imgData) {
          allImgsData.push(...data.imgData);
          console.log(
            `> TÌM THẤY ${data.imgData.length} ẢNH. (TỔNG: ${allImgsData.length})`
          );
          await pageFetchedCallback(data.imgData);
          nextCursor = data.nextCursor;
          hasNextCursor = nextCursor != null;
          currentPage++;
        } else {
          console.log("[!] ERROR.");
          break;
        }
      }
      return allImgsData;
    }
    async function fetchAllPhotoLinksInAlbum({ albumId, fromPhotoId }) {
      const from_text = fromPhotoId
        ? "vị trí photo_id=" + fromPhotoId
        : "đầu album";
      console.log(`ĐANG TẢI DỮ LIỆU ALBUM ${albumId} TỪ ${from_text}...`);
      const result = [];
      await fetchAlbumPhotos({
        albumId,
        fromPhotoId,
        pageFetchedCallback: (pageImgsData) => {
          result.push(...pageImgsData.map((_) => _.url));
        },
      });
      return result;
    }
    function download(data, filename, type) {
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
    }
    fetchAllPhotoLinksInAlbum({ albumId }).then((links) => {
      download(links.join("\n"), albumId, ".txt");
    });
  },
};
