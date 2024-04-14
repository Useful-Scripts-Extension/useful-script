export default {
  name: {
    en: "Get all fb User ID from Friends page",
    vi: "Lấy tất cả fb user id từ danh sách bạn bè",
  },
  description: {
    en: "Get id of all user from friends facebook page",
    vi: "Lấy tất cả user ID từ trang danh sách bạn bè facebook",
  },
  whiteList: ["https://*.facebook.com/*"],

  onClick: async function () {
    // Lấy tất cả uid từ trang facebook search bạn bè
    // Ví dụ: https://www.facebook.com/search/people/?q=*a&epa=FILTERS&filters=eyJmcmllbmRzIjoie1wibmFtZVwiOlwidXNlcnNfZnJpZW5kc19vZl9wZW9wbGVcIixcImFyZ3NcIjpcIjEwMDA2NDI2NzYzMjI0MlwifSJ9
    // Link trên được tạo từ web: https://sowsearch.info/

    let list_a = Array.from(
      document.querySelectorAll(".sjgh65i0 a[role='presentation']")
    );

    if (!list_a.length) {
      return prompt(
        "Không tìm thấy thông tin, bạn đã ở đúng trang tìm kiếm bạn bè fb chưa?" +
          "\nTrang web ví dụ:",
        "https://www.facebook.com/search/people/?q=*a"
      );
    }

    alert("Đang lấy thông tin uid, mở console để xem tiến trình...");
    let uids = [];
    for (let a of list_a) {
      try {
        let l = a.href;

        let uid = l.split("profile.php?id=")[1];
        if (uid) {
          uids.push(uid);
          console.log(uid);
          continue;
        }

        let name = l.split("facebook.com/")[1];
        uid = await UfsGlobal.Facebook.getUidFromUrl(l);
        uids.push(uid);
        console.log(name, uid);
      } catch (e) {
        console.log("Lỗi khi lấy thông tin của " + a, e);
      }
    }
    console.log(uids);
    prompt("Tất cả UID: ", uids.join("\n"));
  },
};
