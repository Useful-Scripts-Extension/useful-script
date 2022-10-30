export default {
  name: {
    en: "Get avatar from user id",
    vi: "Tải avatar từ user id",
  },
  description: {
    en: "Get avatar from list user ids",
    vi: "Tải danh sách avatar từ danh sách user id",
  },
  async func() {
    let accessToken = prompt("Nhập facebook access token: ");
    let uids = prompt("Nhập danh sách uid, Mỗi uid 1 dòng:");
    uids = uids.split("\n");
    let urls = [];
    for (let uid of uids) {
      console.log("fetching avatar of " + uid + "...");
      let url = `https://graph.facebook.com/${uid}/picture?type=large&access_token=${accessToken}`;
      let data = await fetch(url);
      if (data?.url) {
        urls.push(data?.url);
      }
    }
    download(urls.join("\n"), `uid-${new Date().toLocaleString()}.txt`);
    function download(data, filename, type) {
      var file = new Blob([data], { type: type });
      if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
      else {
        var a = document.createElement("a"),
          url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    }
  },
};
