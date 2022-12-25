export default {
  icon: `https://s2.googleusercontent.com/s2/favicons?domain=favicon.io`,
  name: {
    en: "Download favicon from website",
    vi: "Tải favicon của trang web",
  },
  description: {
    en: "Get favicon link of current website",
    vi: "Lấy link favicon của trang web",
  },

  onClick: function () {
    // https://stackoverflow.com/a/15750809
    const getFaviconFromGoogle = (willGetUrlFavicon = true) => {
      return willGetUrlFavicon
        ? "https://s2.googleusercontent.com/s2/favicons?domain_url=" +
            location.href
        : "https://s2.googleusercontent.com/s2/favicons?domain=" +
            location.hostname;
    };

    // https://stackoverflow.com/a/10283308
    const getAllFaviconsFromWeb = function () {
      function getFaviconLink(node) {
        var favicon = node?.getAttribute("href");
        return favicon ? new URL(favicon, location.href).href : null;
      }

      let faviconNodes = Array.from(
        document.querySelectorAll("link[rel*='icon']")
      );

      return faviconNodes.map((_) => getFaviconLink(_));
    };

    const getFaviconDomain = function () {
      return new URL("/favicon.ico", location.href).href;
    };

    let allFavicons = [
      getFaviconDomain(),
      ...getAllFaviconsFromWeb(),
      getFaviconFromGoogle(false),
      getFaviconFromGoogle(true),
    ].filter(Boolean);

    let allFaviconsStr = allFavicons
      .map((_) => {
        return `<div class="item">
          <a href="${_}" target="_blank">
            <img src="${_}" />
          </a>
          <input value="${_}" />
        </div>`;
      })
      .join("");

    let win = window.open(
      "",
      "",
      "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=500,top=50,left=50"
    );
    win.document.title = location.hostname + " favicons";

    // https://stackoverflow.com/a/69309927/11898496
    let escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
      createHTML: (to_escape) => to_escape,
    });
    win.document.body.innerHTML = escapeHTMLPolicy.createHTML(`<div>
      <style>
        .container {
          text-align: center;
        }
        .item {
          margin-bottom: 10px;
        }
        .item a {
          display: inline-block;
          text-decoration: none;
          text-align: center;
        }
      </style>

      <div class="container">
        ${allFaviconsStr}
      </div>
    </div>
    `);
  },
};
