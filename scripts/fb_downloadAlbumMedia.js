import { downloadData, showLoading } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-regular fa-images fa-lg"></i>',
  name: {
    en: "Download album facebook",
    vi: "Tải album facebook",
  },
  description: {
    en: "Download photo/video links from facebook album",
    vi: "Tải về danh sách link ảnh/video từ album facebook",
  },

  onClickExtension: function () {
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
    async function fetchAllPhotoLinksInAlbum({
      albumId,
      fromPhotoId,
      progress,
    }) {
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
          progress?.(result.length);
        },
      });
      return result;
    }

    const { closeLoading, setLoadingText } = showLoading(
      "Đang thu thập link ảnh/video trong album..."
    );
    fetchAllPhotoLinksInAlbum({
      albumId,
      progress: (length) =>
        setLoadingText("Đang thu thập " + length + " links..."),
    }).then((links) => {
      if (
        confirm(
          "Tìm được " + links.length + " links ảnh/video.\nBấm OK để tải xuống."
        )
      )
        downloadData(links.join("\n"), albumId, ".txt");
      closeLoading();
    });
  },
};
