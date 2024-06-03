import { shared } from "./github_goToAnyCommit.js";

export default {
  icon: '<i class="fa-solid fa-square-arrow-up-right fa-lg"></i>',
  name: {
    en: "Github - Open repo pages",
    vi: "Github - Mở repo pages",
  },
  description: {
    en: "Open live demo (github pages) of current repository",
    vi: "Mở trang github pages (nếu có) của repo github hiện tại",
  },

  changeLogs: {
    "2024-06-03": "init",
  },

  whiteList: ["https://github.com/*/*"],

  contentScript: {
    onClick: () => {
      let repoName = shared.getRepoNameFromUrl(location.href);
      let [user, repo] = repoName?.split("/") || [];
      if (user && repo) window.open(`https://${user}.github.io/${repo}`);
    },
  },
};
