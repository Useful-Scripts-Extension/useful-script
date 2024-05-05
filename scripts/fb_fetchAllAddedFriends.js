import { showLoading } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-user-group fa-lg"></i>',
  name: {
    en: "Facebook - Fetch all added friends",
    vi: "Facebook - Xem tất cả bạn bè đã thêm",
  },
  description: {
    en: "View all friends added to your Facebook account.",
    vi: "Xem danh sách tất cả bạn bè facebook đã kết bạn với bạn.",
  },

  popupScript: {
    onClick: async () => {
      let { setLoadingText, closeLoading } = showLoading("Đang chuẩn bị...");
      try {
        let {
          getYourUserId,
          getFbdtsg,
          fetchAddedFriends,
          fetchAllAddedFriendsSince,
        } = UfsGlobal.Facebook;

        setLoadingText("Đang lấy uid, token...");
        let uid = await getYourUserId();
        let dtsg = await getFbdtsg();

        setLoadingText("Đang tải thông tin...");
        // let twoMonthAgo = parseInt(new Date() / 1e3 - 5184e3).toString();
        const allFriends = await fetchAllAddedFriendsSince(
          uid,
          dtsg,
          null, // twoMonthAgo
          (data, total) => {
            let lastest = data[data.length - 1];
            setLoadingText(
              `Đang lấy thông tin...<br/>` +
                `Tải được ${total.length} bạn.<br/>` +
                `Thời điểm: ` +
                new Date(lastest?.addedTime).toLocaleDateString()
            );
          }
        );
        console.log(allFriends);
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};
