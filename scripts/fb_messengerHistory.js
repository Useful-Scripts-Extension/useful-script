export default {
  icon: '<i class="fa-solid fa-clock-rotate-left fa-lg"></i>',
  name: {
    en: "Facebook messenger history",
    vi: "Facebook xem tin nhắn đầu tiên",
  },
  description: {
    en: "View first message in facebook messenger",
    vi: "Xem tin nhắn đầu tiên với bạn bè trong facebook messenger",
  },
  whiteList: ["https://*.facebook.com/*", "https://*.messenger.com/*"],

  onClick: async () => {
    let uid = prompt("Nhâp uid của bạn bè:", "");
    let token = prompt("Nhập access token: ");

    let res = await fetch(
      "https://graph.facebook.com/" + uid + "?fields=id&access_token=" + token
    );

    console.log(await res.json());
  },
};
