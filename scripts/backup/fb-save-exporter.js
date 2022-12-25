var fb_dtsg = require("DTSGInitialData").token,
  uid = require("CurrentUserInitialData").USER_ID,
  cursor = "",
  data = [],
  template = (e) => {
    download(
      `<html><head><title>Danh sách link đã lưu</title><meta name=viewport content="width=device-width, initial-scale=1.0"><meta charset="utf-8"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css" crossorigin="anonymous" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" crossorigin="anonymous" /></head><body><script>data="` +
        e +
        `";</script><div class="container"><div class="row"><div class="col-md-12"><h3 class="text-center">Danh sách link đã lưu</h3><div class="text-center" style="margin-bottom: 10px">Code by Nguyen Huu Dat - J2TEAM Community</div><table class="table table-bordered table-striped" id="table"><thead class="thead-dark"><tr><th>#</th><th class="text-center">Hình ảnh</th><th>Chi tiết</th></tr></thead><tbody></tbody></table></div></div></div> <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.3.0/dist/lazyload.min.js"></script><script>var data2=JSON.parse(decodeURIComponent(escape(window.atob(data))));for(i=0;i<data2.length;i++){$("#table > tbody").append(\'<tr><td class="align-middle">\'+(i+1)+\'</td><td><img class="img-fluid rounded mx-auto d-block lazy" style="min-width: 200px"  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYxcHgiICBoZWlnaHQ9IjE2MXB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtcm9sbGluZyIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij4KICAgIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIGZpbGw9Im5vbmUiIG5nLWF0dHItc3Ryb2tlPSJ7e2NvbmZpZy5jb2xvcn19IiBuZy1hdHRyLXN0cm9rZS13aWR0aD0ie3tjb25maWcud2lkdGh9fSIgbmctYXR0ci1yPSJ7e2NvbmZpZy5yYWRpdXN9fSIgbmctYXR0ci1zdHJva2UtZGFzaGFycmF5PSJ7e2NvbmZpZy5kYXNoYXJyYXl9fSIgc3Ryb2tlPSIjNGM0YzRjIiBzdHJva2Utd2lkdGg9IjIiIHI9IjEwIiBzdHJva2UtZGFzaGFycmF5PSI0Ny4xMjM4ODk4MDM4NDY4OSAxNy43MDc5NjMyNjc5NDg5NjYiIHRyYW5zZm9ybT0icm90YXRlKDUxLjEwOSA1MCA1MCkiPgogICAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgY2FsY01vZGU9ImxpbmVhciIgdmFsdWVzPSIwIDUwIDUwOzM2MCA1MCA1MCIga2V5VGltZXM9IjA7MSIgZHVyPSIwLjVzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgICA8L2NpcmNsZT4KICA8L3N2Zz4=" data-src="\'+data2[i].image+\'"></td><td><div class="des" style="word-break: break-word;"><div><img src="\'+data2[i].sourceImage+\'" style="" /> Lưu từ \'+data2[i].sourceType+\' <a target="_blanks" href="https://fb.com/\'+data2[i].sourceID+\'" target="_blanks">\'+data2[i].sourceName+\'</a><div><div class="mt-2 font-weight-bold">\'+data2[i].title+\'</div><div class="float-right mt-3"><a href="\'+data2[i].url+\'" target="_blanks" class="btn btn-success btn-sm"><i class="fas fa-external-link-alt"></i> Xem link</a> <a href="\'+data2[i].urlPost+\'" target="_blanks" class="btn btn-info btn-sm"><i class="fas fa-file-import"></i> Xem bài viết</a></div></div></td></tr>\');};var lazyLoadInstance = new LazyLoad({});</script> </body></html>`,
      "j2team_community.html"
    );
  },
  download = (e, a, t) => {
    var s = new Blob([e], { type: t });
    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(s, a);
    else {
      var i = document.createElement("a"),
        n = URL.createObjectURL(s);
      (i.href = n),
        (i.download = a),
        document.body.appendChild(i),
        i.click(),
        setTimeout(function () {
          document.body.removeChild(i), window.URL.revokeObjectURL(n);
        }, 0);
    }
  },
  encodeHTML = (e) =>
    e.replace(/([\u00A0-\u9999<>&])(.|$)/g, function (e, a, t) {
      return "&" !== a || "#" !== t
        ? (/[\u00A0-\u9999<>&]/.test(t) && (t = "&#" + t.charCodeAt(0) + ";"),
          "&#" + a.charCodeAt(0) + ";" + t)
        : e;
    }),
  checkExit = (e) => {
    try {
      return e();
    } catch (e) {
      return !1;
    }
  },
  get_posts = async (e) => {
    console.log("Đang lấy dữ liệu! Vui lòng chờ trong giây lát..."),
      "" !== e && (e = `"cursor":"${e}",`);
    const a = await fetch("https://www.facebook.com/api/graphql/", {
      body: `av: 100000034778747&__user=${encodeURIComponent(
        uid
      )}&__dyn=&fb_dtsg=${encodeURIComponent(
        fb_dtsg
      )}&fb_api_req_friendly_name=CometSaveDashboardAllItemsPaginationQuery&variables=${encodeURIComponent(
        `{"content_filter":null,"count":10,${e}"scale":1}`
      )}&server_timestamps=true&doc_id=3196659713724388`,
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    let t = await a.json();
    t.data.viewer.saver_info.all_saves.edges.forEach((e) => {
      let a = "",
        t = "",
        s = "",
        i = "",
        n = "",
        l = "",
        o = "",
        c = "",
        d = "";
      checkExit(() => e.node.savable.savable_title.text) &&
        (a = encodeHTML(e.node.savable.savable_title.text)),
        checkExit(() => e.node.savable.__typename) &&
          (t = e.node.savable.__typename),
        checkExit(() => e.node.savable.savable_image.uri) &&
          (s = e.node.savable.savable_image.uri),
        checkExit(() => e.node.savable.url) && (i = e.node.savable.url),
        checkExit(() => e.node.container_savable.savable_permalink) &&
          (n = e.node.container_savable.savable_permalink),
        checkExit(
          () => e.node.container_savable.savable_actors[0].__typename
        ) && (l = e.node.container_savable.savable_actors[0].__typename),
        checkExit(() => e.node.container_savable.savable_actors[0].name) &&
          (o = e.node.container_savable.savable_actors[0].name),
        checkExit(() => e.node.container_savable.savable_actors[0].id) &&
          (c = e.node.container_savable.savable_actors[0].id),
        checkExit(
          () => e.node.container_savable.savable_actors[0].profile_picture.uri
        ) &&
          (d = e.node.container_savable.savable_actors[0].profile_picture.uri),
        data.push({
          title: a,
          type: t,
          image: s,
          url: i,
          urlPost: n,
          sourceType: l,
          sourceName: o,
          sourceID: c,
          sourceImage: d,
        });
    });
    let s = !1;
    if (
      (checkExit(
        () => t.data.viewer.saver_info.all_saves.page_info.has_next_page
      ) && (s = t.data.viewer.saver_info.all_saves.page_info.has_next_page),
      !0 === s)
    )
      get_posts(t.data.viewer.saver_info.all_saves.page_info.end_cursor);
    else {
      let e = window.btoa(unescape(encodeURIComponent(JSON.stringify(data))));
      template(e), console.log("Done! Đang xuất dữ liệu...");
    }
  };
get_posts(cursor);
