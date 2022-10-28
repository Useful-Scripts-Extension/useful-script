// Lấy tất cả album id có trong trang web - Khi đang xem 1 danh sách album của user/group/page
export function getAllAlbumId() {
  const list_a = document.querySelectorAll("a");
  const list_id = [];
  for (let a of [location, ...Array.from(list_a)]) {
    const page_album_id = /(?<=\/photos\/a\.)(.\d+?)(?=\/)/.exec(a.href);
    if (page_album_id && page_album_id[0]) {
      list_id.push(page_album_id[0]);
    }
    const group_album_id = /(?<=set\=oa\.)(.\d+?)($|(?=&))/.exec(a.href);
    if (group_album_id && group_album_id[0]) {
      list_id.push(group_album_id[0]);
    }
    const user_album_id = /(?<=set\=a\.)(.\d+?)($|(?=&))/.exec(a.href);
    if (user_album_id && user_album_id[0]) {
      list_id.push(user_album_id[0]);
    }
  }
  if (list_id.length)
    window.prompt(
      `Tìm thấy ${list_id.length} album id trong trang web và trên url.`,
      list_id.join(", ")
    );
  else
    window.prompt(
      "Không tìm thấy ALBUM ID nào trong trang web!\nBạn có đang ở đúng trang album chưa?\nTrang web Ví dụ:",
      "https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659"
    );
}
