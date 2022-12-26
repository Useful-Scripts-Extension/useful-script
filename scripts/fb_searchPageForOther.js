import { showLoading } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-flag fa-lg"></i>',
  name: {
    en: "Facebook - View your friend's liked page",
    vi: "Facebook - Xem các trang bạn bè thích",
  },
  description: {
    en: "Know about your friends's linked page on facebook",
    vi: "Biết bạn bè của bạn đang thích các trang nào trên facebook",
  },

  onClickExtension: async () => {
    let url = prompt("Nhập link facebook bạn bè (hoặc của bạn): ");
    if (url == null) return;

    let { setLoadingText, closeLoading } = showLoading("Đang chuẩn bị...");
    try {
      let { getUidFromUrl, getYourUserId, getFbdtsg, searchAllPageForOther } =
        UsefulScriptGlobalPageContext.Facebook;

      setLoadingText("Đang lấy uid, token...");
      let other_uid = await getUidFromUrl(url);
      let uid = await getYourUserId();
      let dtsg = await getFbdtsg();

      setLoadingText("Đang tải danh sách page...");
      let allPages = await searchAllPageForOther(
        other_uid,
        uid,
        dtsg,
        (pages, all) => {
          setLoadingText(
            `Đang tải danh sách page...<br/>Tải được ${all.length} page.`
          );
        }
      );
      console.log(allPages);
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
