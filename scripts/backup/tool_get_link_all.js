// https://openuserjs.org/scripts/we0019/Tool_Get_Link_Fshare,_4Share.vn,_Mp3zing.vn,_Nhaccuatui,_Tailieu.vn,_hoctot123.com/source

// tool to decode:
// https://deobfuscate.relative.im/
// + manual eval() + replace eval() with console.log()

$(function () {
  if (location.pathname.indexOf("/bai-hat/") === 0) {
    var code = $("div.fb-like").data("href");
    $("#tabService").replaceWith(
      ' <a id="tabService" href="http://htstar.design/mp3zing.php?q=128&link=' +
        code +
        '"class="button-style-1 pull-left fn-tab"><i class="zicon icon-download"></i><span>Tải nhạc 128 kbps</span></a> <a id="tabService" href="http://htstar.design/mp3zing.php?q=320&link=' +
        code +
        '" class="button-style-1 pull-left fn-tab"><i class="zicon icon-download"></i><span>Tải nhạc 320 kbps</span></a> <a id="tabService" href="http://htstar.design/mp3zing.php?q=lossless&link=' +
        code +
        '" target="_blank" class="button-style-1 pull-left fn-tab"><i class="zicon icon-download"></i><span>Tải nhạc Lossless</span></a> '
    );
  }
  var linkbaihat = $("link[rel='canonical']").attr("href");
  if (
    $("#btnDownloadBox") ===
    '<a href="javascript:;" id="btnDownloadBox"></span>Tải nhạc</a>'
  ) {
    $("#btnDownloadBox").replaceWith(
      '<a href="http://htstar.design/nctgetlink.php?q=128&link=' +
        linkbaihat +
        '"><span class="icon_download"></span>   Tải nhạc 128kbps   </a><a href="http://htstar.design/nctgetlink.php?q=320&link=' +
        linkbaihat +
        '"></span>   Tải nhạc 320kbps   </a><a href="http://htstar.design/nctgetlink.php?q=lossless&link=' +
        linkbaihat +
        '"></span>   Tải nhạc Lossless</a>'
    );
  } else {
    $("#btnAddPlaylistNowPlaying").after(
      '<a href="http://htstar.design/nctgetlink.php?q=128&link=' +
        linkbaihat +
        '"></span>   Tải nhạc 128kbps   </a></li><a href="http://htstar.design/nctgetlink.php?q=320&link=' +
        linkbaihat +
        '"></span>   Tải nhạc 320kbps   </a><a href="http://htstar.design/nctgetlink.php?q=lossless&link=' +
        linkbaihat +
        '"></span>   Tải nhạc Lossless</a>'
    );
  }
  if (location.pathname.indexOf("/file/") === 0) {
    {
      var link = window.location.href;
      var link1 = link.replace("fshare.vn", "getlinkfshare.com");
    }
    $(".policy_download").prepend(
      '<div class="col-xs-12"><a title="Download nhanh " style="margin-top: 10px; height: 70px;" class="btn btn-success btn-lg btn-block btn-download-sms" href="http://bfeu.tk/getfshare.php?link=' +
        location.href +
        '">        <i class="fa fa-cloud-download fa-2x pull-left"></i>        <span class="pull-right text-right download-txt">Tải nhanh File chục mb ^_^ <br><small>Tool Get link From Tiện Ích Máy Tính </small>        </span></a></div><div class="col-xs-12"><a title="Download nhanh " style="margin-top: 10px; height: 70px;" class="btn btn-success btn-lg btn-block btn-download-sms" href="' +
        link1 +
        '">        <i class="fa fa-cloud-download fa-2x pull-left"></i>        <span class="pull-right text-right download-txt">            Tải nhanh qua GETLINKFSHARE.COM<br>            <small>Tool Get link From Tiện Ích Máy Tính </small>        </span></a></div> '
    );
  }
  if (window.location.hostname == "javhd.com") {
    var link = window.location.href;
    var linkget = "http://htstar.design/getjav.php?link=" + link;
    $(".player-container").replaceWith(
      '<div> <video autoplay controls> <source src="' +
        linkget +
        '" type="video/mp4">Your browser does not support HTML5 video.</video></div>'
    );
    $(".downloads").replaceWith(
      '<div><a class="downloads" href="' +
        linkget +
        '"><i>Downloads</i></a></div>'
    );
  }
  if (window.location.hostname == "tailieu.vn") {
    var link = window.location.href;
    var linkget = "https://linksvip.net/?link=" + link;
    $(".btncam.marginright10").replaceWith(
      '<a class="btncam marginright10" style="width:170px;margin:10px 0 0 0px;" title="Download tài liệu qua linksvip.net không cần acc vip" href="' +
        linkget +
        '"><img valign="middle" src="http://static1.tailieu.vn/b2013az/templates/version1/default/images/down16x21.png">Download qua linksvip' +
        "</a>"
    );
  }
  if (window.location.hostname == "hoctot123.com") {
    var link = window.location.href;
    var linkget = "http://bfeu.tk/getlinkhoctot123/xuly.php?url=" + link;
    $("#login_pop").replaceWith(
      '<a href="' +
        linkget +
        '" id="login_pop"><strong style="color:red">DOWNLOAD TÀI LIỆU ĐÃ GET || Tool Get Link   from J2TeaM</strong></a>'
    );
  }
  if (window.location.hostname == "4share.vn") {
    var link = window.location.href;
    var linkget = "https://linksvip.net/?link=" + link;
    $("a[href='/payment/card/#FUNNY']").replaceWith(
      '<a href="' +
        linkget +
        '" ><input style="font-weight: bold; color: red" value="DOWNLOAD QUA LINKSVIP" type="button"></a>'
    );
  }
});
(function ($, window, document) {
  "use strict";
  GM_addStyle(
    ".bv-icon{background-image:url(http://static.mp3.zdn.vn/skins/zmp3-v4.1/images/icon.png)!important;background-repeat:no-repeat!important;background-position:-25px -2459px!important;}.bv-download{background-color:#70d4ff!important;border-color:#70d4ff!important;}.bv-download span{color:#fff!important;margin-left:8px!important;}.bv-disable,.bv-download:hover{background-color:#ff5e5e!important;border-color:#ff5e5e!important;}.bv-text{background-image:none!important;color:#fff!important;text-align:center!important;font-size:smaller!important;line-height:25px!important;}.bv-waiting{cursor:wait!important;background-color:#2980b9!important;border-color:#2980b9!important;}.bv-complete,.bv-complete:hover{background-color:#27ae60!important;border-color:#27ae60!important;}.bv-error,.bv-error:hover{background-color:#c0392b!important;border-color:#c0392b!important;}.bv-disable{cursor:not-allowed!important;opacity:0.4!important;}"
  );
  function downloadSong(songId, progress, complete, error) {
    GM_xmlhttpRequest({
      method: "GET",
      url: linksVip(songId),
      responseType: "blob",
      onload: function (source) {
        complete(source.response, source.finalUrl.split("filename=")[1]);
      },
      onprogress: function (e) {
        if (e.total) {
          progress(Math.floor((e.loaded * 100) / e.total) + "%");
        } else {
          progress("");
        }
      },
      onerror: function (e) {
        console.error(e);
        error();
      },
    });
  }
  window.URL = window.URL || window.webkitURL;
  function multiDownloads() {
    var $smallBtn = $(".fn-dlsong");
    if (!$smallBtn.length) return;
    $smallBtn.replaceWith(function () {
      var songId = $(this)
        .closest("li, .item-song")
        .attr("id")
        .replace(/(chartitem)?song(rec)?/, "");
      return (
        '<a title=" Tải nhạc 128kbps " class="bv-download bv-multi-download bv-icon" href="http://htstar.design/mp3zing.php?q=128&code=' +
        songId +
        '" data-id="' +
        songId +
        '"><a title=" Tải nhạc 320kbps " class="bv-download bv-multi-download bv-icon" href="http://htstar.design/mp3zing.php?q=320&code=' +
        songId +
        '" data-id="' +
        songId +
        '"></a></a><a title=" Tải nhạc Lossless " class="bv-download bv-multi-download bv-icon" target="_blank" href="http://htstar.design/mp3zing.php?q=lossless&code=' +
        songId +
        '" data-id="' +
        songId +
        '"></a>'
      );
    });
  }
  multiDownloads();
  $(document).on("ready", multiDownloads);
  $(window).on("load", multiDownloads);
})(jQuery, window, document);
