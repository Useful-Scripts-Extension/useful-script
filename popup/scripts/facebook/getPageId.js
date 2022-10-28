// Lấy page id - khi đang trong trang của page fb. Ví dụ: https://www.facebook.com/ColourfulSpace
export function getPageId() {
  const page_name = document.title;
  const found = (check) => {
    if (check && check[0]) {
      window.prompt(`PAGE ID của ${page_name}:`, check[0]);
      return true;
    }
    return false;
  };
  if (found(/(?<=\"pageID\"\:\")(.*?)(?=\")/.exec(document.body.innerHTML)))
    return;
  if (found(/(?<=facebook\.com\/)(.*?)($|(?=\/)|(?=&))/.exec(location.href)))
    return;
  window.prompt(
    "Không tìm thấy PAGE ID nào trong url!\nBạn có đang ở đúng trang page fb chưa?\nTrang web Ví dụ:",
    "https://www.facebook.com/ColourfulSpace"
  );
}
