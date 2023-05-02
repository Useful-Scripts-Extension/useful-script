import { showLoading } from "./helpers/utils.js";

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

  onClickExtension: async () => {
    async function getVideoDataOne(pageid, token) {
      let res = await fetch(
        "https://graph.facebook.com/v12.0/" +
          pageid +
          "/videos?fields=universal_video_id,title,description,length,picture,captions,source,permalink_url,created_time" +
          "&access_token=" +
          token
      );
      let data = await res.json();
      return data;
    }

    async function getAllVideoData(pageid, token, pageCallback) {
      let data = [];
      let res = await getVideoDataOne(pageid, token);
      data = data.concat(res.data);
      while (res.paging && res.paging.next) {
        res = await fetch(res.paging.next);
        res = await res.json();
        data = data.concat(res.data);
        console.log(res);
        pageCallback?.(res, data);
      }
      return data;
    }

    let { setLoadingText, closeLoading } = showLoading("Đang chuẩn bị...");
    try {
      let token = prompt("Nhập fb token:", "");
      if (!token) return;

      let pageid = prompt("Nhập pageid:", "");
      if (!pageid) return;

      setLoadingText("Đang lấy dữ liệu...");
      let data = await getAllVideoData(pageid, token, (res, data) => {
        setLoadingText("Đang lấy dữ liệu... " + data.length);
      });

      console.log(data);
      alert("Tìm được " + data.length + " video");
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
