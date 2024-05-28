import { BADGES } from "./helpers/badge.js";

export default {
  icon: `<i class="fa-solid fa-code-branch fa-lg"></i>`,
  name: {
    en: "Go to any commit",
    vi: "Đi tới commit bất kỳ",
  },
  description: {
    en: "Go to any commit of github repo. Included first commit.",
    vi: "Đi tới commit bất kỳ của repo github. Bao gồm cả commit đầu tiên.",
  },
  badges: [BADGES.hot],

  popupScript: {
    onClick: async () => {
      const { getCurrentTab, showLoading } = await import("./helpers/utils.js");
      let { closeLoading, setLoadingText } = showLoading(
        "Đang chờ nhập url..."
      );
      try {
        let tab = await getCurrentTab();
        let url = prompt("Nhập link của github repo: ", tab.url);
        if (url == null) return;

        if (!url.includes("github.com"))
          throw Error(
            "Link không đúng định dạng.\nLink ví dụ: https://github.com/HoangTran0410/useful-script"
          );

        let repoName = shared.getRepoNameFromUrl(url);
        let [user, repo] = repoName.split("/");

        setLoadingText("Đang đếm số lượng commit...");
        let totalCommits = await shared.getTotalCommitCount(user, repo);

        setLoadingText("Đang chờ lựa chọn...");
        let index;
        while (true) {
          index = prompt(
            `Có ${totalCommits} commits trong '${repo}' của ${user} .\n\n` +
              `Nhập commit muốn xem (1-${totalCommits}):\n` +
              `  (1 là commit đầu tiên)`,
            1
          );
          if (index == null) return;
          if (index < 1 || index > totalCommits)
            alert(
              `Lựa chọn không hợp lệ (1-${totalCommits}). Vui lòng chọn lại.`
            );
          else break;
        }

        setLoadingText("Đang tìm link commit...");
        let firstCommit = await shared.getCommitAtIndex(
          user,
          repo,
          totalCommits - index + 1
        );

        if (firstCommit.html_url) window.open(firstCommit.html_url);
        else throw new Error("Không tìm thấy link.");
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};

export const shared = {
  // Idea from: https://github.com/FarhadG/init
  // https://github.com/HoangTran0410/useful-script => repoName = HoangTran0410/useful-script
  getRepoNameFromUrl(url) {
    let pathName = new URL(url).pathname;
    let [repoName, branchOrHash] =
      pathName.match(/\/([^\/]+\/[^\/]+)(?:\/tree\/([^\/]+))?/) || [];
    return repoName.slice(1);
  },
  getTotalCommitCount: async (user, repo) => {
    let res = await fetch(
      `https://api.github.com/repos/${user}/${repo}/commits?per_page=1`
    );
    let linkInHeader = res.headers.get("link");
    let commitCount = linkInHeader.match(/&page=(\d+)>; rel="last"/)?.[1];
    return Number(commitCount);
  },
  getCommitAtIndex: async (user, repo, index) => {
    let res = await fetch(
      `https://api.github.com/repos/${user}/${repo}/commits?per_page=1&page=${index}`
    );
    let json = await res.json();
    return json[0];
  },
};
