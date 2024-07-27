import { getRepoNameFromUrl } from "./github_goToAnyCommit.js";

export default {
  icon: '<i class="fa-solid fa-square-arrow-up-right fa-lg"></i>',
  name: {
    en: "Github - Open repo pages",
    vi: "Github - Mở repo pages",
  },
  description: {
    en: `Switch between github.com repo and github.io live demo pages
    <b>username</b>.github.io/<b>repo</b><br/>
    github.com/<b>username</b>/<b>repo</b><br/>`,
    vi: `Chuyển đổi giữa trang github.com repo và github.io demo pages<br/><br/>
    <b>username</b>.github.io/<b>repo</b><br/>
    github.com/<b>username</b>/<b>repo</b><br/>`,
  },
  changeLogs: {
    "2024-06-03": "init",
  },

  whiteList: ["https://github.com/*/*", "https://*.github.io/*"],

  popupScript: {
    onClick: async () => {
      try {
        const { getCurrentTab } = await import("./helpers/utils.js");
        let tab = await getCurrentTab();
        let url = new URL(tab.url);

        if (url.hostname === "github.com") {
          let repoName = getRepoNameFromUrl(url.href);
          let [user, repo] = repoName?.split("/") || [];
          if (user && repo) window.open(`https://${user}.github.io/${repo}`);
          else throw Error(`URL not valid: user: ${user}, repo: ${repo}`);
        } else if (url.hostname.includes(".github.io")) {
          let user = url.hostname.split(".")[0];
          let repo = url.pathname.slice(1) || user + ".github.com";
          if (user) window.open(`https://github.com/${user}/${repo}`);
          else throw Error(`URL not valid: user: ${user}, repo: ${repo}`);
        }
      } catch (e) {
        alert("Error: " + e);
      }
    },
  },
};
