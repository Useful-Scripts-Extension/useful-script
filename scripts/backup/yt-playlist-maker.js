// https://gist.github.com/J2TEAM/d8380866bb28dfb8a7f1ab72059658b0

/* Developed by Juno_okyo */
(function (e, b) {
  function f(a, b) {
    var d = fetch,
      e =
        "sej=" +
        encodeURIComponent(
          JSON.stringify({
            playlistEditEndpoint: {
              playlistId: a,
              actions: [
                {
                  addedVideoId: b,
                  action: "ACTION_ADD_VIDEO",
                },
              ],
            },
            clickTrackingParams: "juno_okyo_j2team_community",
            commandMetadata: {
              webCommandMetadata: {
                url: "/service_ajax",
                sendPost: !0,
              },
            },
          })
        ) +
        "&session_token=",
      f = encodeURIComponent;
    var c = /"XSRF_TOKEN":"([^"]+)"/.exec(document.head.innerHTML);
    c = null !== c ? c[1] : !1;
    return d("https://www.youtube.com/service_ajax?name=playlistEditEndpoint", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: e + f(c),
    });
  }

  function d() {
    var a = b.pop();
    a = new URL(a).searchParams.get("v");
    f(e, a).then(function (a) {
      0 < b.length && setTimeout(d, 500);
    });
  }
  d();
})("YOUR_PLAYLIST_ID", "YOUR_VIDEO_URLS_IN_ARRAY");
