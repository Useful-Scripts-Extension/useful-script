export default {
  icon: '<i class="fa-solid fa-people-group fa-lg"></i>',
  name: {
    en: "Get fb Group ID",
    vi: "Lấy fb Group ID",
  },
  description: {
    en: "Get id of group in facebook website",
    vi: "Lấy id của group trong trang facebook hiện tại",
  },
  whiteList: ["https://*.facebook.com/*"],

  onClick: async function () {
    // Lấy group id - trường hợp url của group hiển thị tên chứ ko hiển thị id. Ví dụ: https://www.facebook.com/groups/j2team.community.girls

    const group_name = document.title;
    const found = (check) => {
      if (check && check[0]) {
        prompt(`GROUP ID của ${group_name}:`, check[0]);
        return true;
      }
      return false;
    };
    if (found(/(?<=\/groups\/)(.\d+?)($|(?=\/)|(?=&))/.exec(location.href)))
      return;
    const list_a = document.querySelectorAll("a");
    for (let a of Array.from(list_a)) {
      if (found(/(?<=\/groups\/)(.\d+?)(?=\/user\/)/.exec(a.href))) return;
    }
    prompt(
      "Không tìm thấy GROUP ID nào trong trang web!\nBạn có đang ở đúng trang group chưa?\nTrang web Ví dụ:",
      "https://www.facebook.com/groups/j2team.community.girls"
    );
  },
};
