export default {
  icon: `<i class="fa-solid fa-backward-fast"></i>`,
  name: {
    en: "Go to first commit",
    vi: "Đi tới commit đầu tiên",
  },
  description: {
    en: "Go to first commit of github repo",
    vi: "Đi tới commit đầu tiên của repo github",
  },

    whiteList: ["https://github.com/*"],

  onClick: function () {
    // Source: https://github.com/FarhadG/init

    let args = window.location.pathname.match(
      /\/([^\/]+\/[^\/]+)(?:\/tree\/([^\/]+))?/
    );
    // args[1] is the `orgname/repo` url fragment
    // args[2] is the optional branch or hash

    return (
      fetch(
        "https://api.github.com/repos/" +
          args[1] +
          "/commits?sha=" +
          (args[2] || "")
      )
        // the link header has additional urls for paging
        // parse the original JSON for the case where no other pages exist
        .then((res) => Promise.all([res.headers.get("link"), res.json()]))

        // get last page of commits
        .then((results) => {
          // results[0] is the link
          // results[1] is the first page of commits

          if (results[0]) {
            // the link contains two urls in the form
            // <https://github.com/...>; rel=blah, <https://github.com/...>; rel=thelastpage
            // split the url out of the string
            var pageurl = results[0].split(",")[1].split(";")[0].slice(2, -1);
            // fetch the last page
            return fetch(pageurl).then((res) => res.json());
          }

          // if no link, we know we're on the only page
          return results[1];
        })

        // get the last commit and extract the url
        .then((commits) => commits.pop().html_url)

        // navigate there
        .then((url) => (window.location = url))
    );
  },
};

export function goToFirstCommit() {}
