export function getAllUidFromFBSearch() {
  const getUid = async (url) => {
    var response = await fetch(url);
    if (response.status == 200) {
      var text = await response.text();
      let uid = /(?<=\"userID\"\:\")(.\d+?)(?=\")/.exec(text);
      if (uid?.length) {
        return uid[0];
      }
    }
    return null;
  };
  const main = async () => {
    alert("Đang lấy thông tin uid, mở console để xem tiến trình...");
    let list_a = Array.from(
      document.querySelectorAll("a[role='presentation']")
    );
    let uids = [];
    for (let a of list_a) {
      let l = a.href;
      let uid = l.split("profile.php?id=")[1];
      if (uid) {
        uids.push(uid);
        console.log(uid);
        continue;
      }
      let name = l.split("facebook.com/")[1];
      uid = await getUid(l);
      uids.push(uid);
      console.log(name, uid);
    }
    console.log(uids);
    window.prompt("Tất cả UID: ", uids.join("\n"));
  };
  main();
}
