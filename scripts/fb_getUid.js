export default {
  icon: `<i class="fa-regular fa-id-card fa-lg"></i>`,
  name: {
    en: "Get fb User ID",
    vi: "Lấy fb User ID",
  },
  description: {
    en: "Get id of user in facebook website",
    vi: "Lấy id của user trong trang facebook hiện tại",
  },
  whiteList: ["https://www.facebook.com/*"],

  onClick: async function () {
    // Lấy user id (uid) - khi đang trong tường của người dùng muốn lấy user id. Ví dụ: https://www.facebook.com/callchoulnhe

    let uid = await UsefulScriptGlobalPageContext.Facebook.getUidFromUrl(
      location.href
    );
    if (uid) return prompt(`USER ID của ${document.title}:`, uid);

    const find = (r) => (r ? r[0] : 0);
    uid =
      find(
        /(?<=\"userID\"\:\")(.\d+?)(?=\")/.exec(
          document.querySelector("html").textContent
        )
      ) ||
      find(/(?<=\/profile\.php\?id=)(.\d+?)($|(?=&))/.exec(location.href)) ||
      (() => {
        for (let a of Array.from(document.querySelectorAll("a"))) {
          let _ = find(
            /(?<=set\=(pb|picfp|ecnf|pob)\.)(.\d+?)($|(?=\.))/.exec(a.href)
          );
          if (_) return _;
        }
        return 0;
      })() ||
      find(
        /(?<=\"user\"\:\{\"id\"\:\")(.\d+?)(?=\")/.exec(document.body.innerHTML)
      );

    if (uid) prompt(`USER ID của ${document.title}:`, uid);
    else
      prompt(
        "Không tìm thấy USER ID nào trong trang web!\nBạn có đang ở đúng trang profile chưa?\nTrang web Ví dụ: ",
        "https://www.facebook.com/callchoulnhe"
      );
  },
};
