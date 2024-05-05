export default {
  icon: `<i class="fa-solid fa-link fa-lg"></i>`,
  name: {
    en: "View all links",
    vi: "Xem tất cả link",
  },
  description: {
    en: "Show all links and anchor text of current page.",
    vi: "Liệt kê tất cả đường link có trong website",
  },

  pageScript: {
    onClick: function () {
      function getParameterByName(e, t) {
        e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var n = new RegExp("[\\?&]" + e + "=([^&#]*)"),
          r = n.exec(
            t == true ? location.hash.replace("#", "?") : location.search
          );
        if (r == null && t == false) {
          return getParameterByName(e, true);
        } else {
          return r == null ? "" : decodeURIComponent(r[1].replace(/\+/g, " "));
        }
      }
      str =
        "<style type='text/css'>body{color:#000;background-color:#fff;margin:0;padding:0;font-family:arial,helvetica,sans-serif;font-size:82%}*{font-weight:400;color:#000}h3,h4,h5,h6{margin:0 0 15px;padding:0}#rt{font-size:12px;width:500px}table,td,th,tr{font-size:1em;overflow:hidden;text-overflow:ellipsis;word-wrap:break-word}textarea{width:100%}th{background-color:#eee;color:#000;font-weight:700}td a{width:446px;display:block}.id{background:#eee;color:#000;text-align:center}.g{font-family:arial,sans-serif;color:#000;margin:1em 0;font-size:122%}.g h2{font-family:arial,sans-serif;margin:0}.r{display:inline;font-weight:400;margin:10}.j{width:34em}.std{font-size:82%}.a{color:green}.fl{color:#77c}.bl{display:inline}a{color:#00c}a:visited{color:#551a8b}a:active{color:red}.twitter-share-button{margin-bottom:-5px}p.b{line-height:22px;text-align:center}</style>\n";
      anchors = document.getElementsByTagName("a");
      var all = [];
      var keyword = getParameterByName("q", false);
      str += "<title>Google SERP Scraper Bookmarklet</title>";
      str += "<div style='width: 900px; margin: 0 auto;'>";
      str +=
        "<h1 style='margin: 1em 0em 0em 0em; text-align: center;'>Google SERP Scraper Bookmarklet</h1>";
      str += "<h2 style='text-align: center;'>Keyword - " + keyword + "</h2>";
      str += "<table width='100%'>";
      str +=
        "<tr><th width='5%'>Result</th><th width='50%'>Link</th><th width='45%'>Anchor Text</th></tr>\n";
      var tweetText =
        '<p class="b">If you use and like this, please <a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-lang="en" data-url="http://cognitiveseo.com/blog/5714/69-amazing-seo-bookmarklets-to-supercharge-your-internet-marketing/" data-text="/*Google SERP Scraper*/ Bookmarklet + 68 Other Uber Amazing Bookmarklets">Tweet</a> about it and help us spread the word.<br /> Happy SCRAPing and thanks for sharing!<br /> Coded by <a href="http://cognitiveseo.com/" target="_blank">cognitiveSEO</a>.</p>';
      var tweetScript =
        '<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>';
      var k = 0;
      var listing = "";
      var links = "";
      var anchorTexts = "";
      var linksAnchors = "";
      for (i = 0; i < anchors.length; i++) {
        var anchorText = anchors[i].textContent;
        var anchorLink = anchors[i].href;
        var linkAnchor = "";
        if (
          anchorLink.match(
            /^((?!google\.|cache|\.yahoo\.|youtube\.com\/results|javascript:{}|javascript:void|javascript:\;|api\.technorati\.com|botw\.org\/search|del\.icio\.us\/url\/check|digg\.com\/search|search\.twitter\.com\/search|search\.yahoo\.com\/search|siteanalytics\.compete\.com|tools\.seobook\.com\/general\/keyword\/suggestions|web\.archive\.org\/web\/|whois\.domaintools\.com|www\.alexa\.com\/data\/details\/main|www\.bloglines\.com\/search|www\.majesticseo\.com\/search\.php|www\.semrush\.com\/info\/|www\.semrush\.com\/search\.php|www\.stumbleupon\.com\/url|wikipedia.org\/wiki\/Special:Search).)*$/i
          ) &&
          anchorLink != "" &&
          all.indexOf(anchorLink) == -1 &&
          anchorText != "" &&
          anchors[i].className != "gb_b"
        ) {
          all.push(anchorLink);
          listing += anchorLink + "\n";
          anchorTexts += anchorText + "\n";
          linkAnchor =
            anchorLink.replace(",", "%2C") + ",	" + anchorText.replace(",", "");
          linksAnchors += linkAnchor + "\n";
          k = k + 1;
          if (anchorText === undefined) anchorText = anchors[i].innerText;
          str += "<tr>";
          str += "<td class='id'>" + k + "</td>";
          str +=
            "<td><a href=" +
            anchors[i].href +
            " target='_blank'>" +
            anchors[i].href +
            "</a></td>";
          str += "<td>" + anchorText + "</td>";
          str += "</tr>\n";
        }
      }
      str +=
        "</table><br/><br/><table width='100%'><tr><td width='55%'><h2>Links</h2><textarea rows=10 style='width:97%' readonly>";
      str += listing;
      str +=
        "</textarea></td><td width='45%'><h2>Anchors</h2><textarea rows=10 readonly>";
      str += anchorTexts;
      str +=
        "</textarea></td></tr></table><br/><br/><h2>All Data - CSV</h2><textarea rows=10 readonly>";
      str += "Links, Anchors\n";
      str += linksAnchors;
      str += "</textarea><br /> <br />";
      str += tweetText;
      str += tweetScript;
      str += "<br /></div> <br />";

      let win = window.open();
      win.document.write(str);
      win.document.close();
    },
  },
};
