export default {
  icon: `<i class="fa-solid fa-backward-fast fa-lg"></i>`,
  name: {
    en: "Go to first commit",
    vi: "Đi tới commit đầu tiên",
  },
  description: {
    en: "Go to first commit of github repo",
    vi: "Đi tới commit đầu tiên của repo github",
  },

  whiteList: ["https://github.com/*"],

  onClick: async function () {
    // Source: https://github.com/FarhadG/init
    // Modified by HoangTran

    let args = window.location.pathname.match(
      /\/([^\/]+\/[^\/]+)(?:\/tree\/([^\/]+))?/
    );
    // args[1] is the `orgname/repo` url fragment
    // args[2] is the optional branch or hash

    if (!args || !args[1]) {
      alert("Vui lòng mở 1 trang repo github rồi chạy lại chức năng.");
      return;
    }

    try {
      let res = await fetch(
        "https://api.github.com/repos/" +
          args[1] +
          "/commits?sha=" +
          (args[2] || "")
      );
      // the link header has additional urls for paging
      // parse the original JSON for the case where no other pages exist
      let results = await Promise.all([res.headers.get("link"), res.json()]);
      // results[0] is the link
      // results[1] is the first page of commits

      let commits;
      if (results[0]) {
        // the link contains two urls in the form
        // <https://github.com/...>; rel=blah, <https://github.com/...>; rel=thelastpage
        // split the url out of the string
        let pageurl = results[0].split(",")[1].split(";")[0].slice(2, -1);
        let pageurlWithoutPage = pageurl.split("&page=")[0];
        let count = pageurl.match(/page=(.*?)$/)[1];

        let pageNumber;
        while (true) {
          pageNumber = window.prompt(
            `Tìm thấy ${count} trang commits.\n` +
              `Mỗi trang 30 commits => ~${30 * count} commits.\n\n` +
              `Nhập số thứ tự trang muốn xem (1-${count}):\n` +
              `(Nhập ${count} để xem commit đầu tiên)`,
            1
          );
          if (pageNumber == null) return;

          pageNumber = Number(pageNumber);
          if (pageNumber >= 1 && pageNumber <= count) break;
          else alert(`Lựa chọn không hợp lệ (1-${count}). Vui lòng chọn lại.`);
        }

        // fetch the selected page
        res = await fetch(pageurlWithoutPage + "&page=" + (pageNumber || "1"));
        commits = await res.json();
      } else {
        // if no link, we know we're on the only page
        commits = results[1];
      }

      // get the last commit and extract the url
      while (true) {
        let commitIndex = prompt(
          `Tìm thấy ${commits.length} commits trong trang này.\n` +
            `Chọn vị trí commit muốn xem (1-${commits.length}):\n`,
          1
        );
        if (commitIndex == null) return;

        let index = Number(commitIndex);
        if (index >= 1 && index <= commits.length) {
          window.open(commits[commits.length - index - 1].html_url);
          break;
        } else {
          alert(
            `Lựa chọn không hợp lệ (1-${commits.length}). Vui lòng chọn lại.`
          );
        }
      }
    } catch (e) {
      alert("ERROR: " + e);
    }
  },
};

export function goToFirstCommit() {}
