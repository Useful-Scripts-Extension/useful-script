export default {
  name: {
    en: "Get your insta User ID",
    vi: "Lấy insta user id của bạn",
  },
  description: {
    en: "Get id of your instagram user",
    vi: "Lấy id của người dùng instagram đang đăng nhập",
  },
  blackList: [],
  whiteList: ["*://*.instagram.com"],

  func: function () {
    alert("Đang lấy user id... bấm ok để tiếp tục");
    fetch(location.href + "?__a=1")
      .then((response) => response.json())
      .then((json) => {
        const {
          fbid,
          id,
          username,
          full_name,
          profile_pic_url_hd,
          profile_pic_url,
          edge_owner_to_timeline_media,
        } = json.graphql.user;
        console.log(json.graphql.user);
        window.prompt(`User ID của ${username}:`, id);
      })
      .catch((e) => {
        alert("Lỗi: " + e.toString());
      });
  },
};

export function getUid() {}
