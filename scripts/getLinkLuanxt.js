import { showLoading } from "./helpers/utils.js";
import { md5 } from "./libs/crypto/md5.js";

export default {
  icon: "https://luanxt.com/get-link-mp3-320-lossless-vip-zing/favicon.ico",
  name: {
    en: "Get audio/video (luanxt)",
    vi: "Tải nhạc/video (luanxt)",
  },
  description: {
    en: "Using API from luanxt.com. Download Zing MP3, Zing Video Clip, Zing TV, NhacCuaTui, YouTube, SoundCloud, Nhac.vn, ChiaSeNhac.vn, Facebook Video, Keeng Audio, Keeng Video, Keeng Phim",
    vi: "Sử dụng API của luanxt.com. Tải Zing MP3, Zing Video Clip, Zing TV, NhacCuaTui, YouTube, SoundCloud, Nhac.vn, ChiaSeNhac.vn, Facebook Video, Keeng Audio, Keeng Video, Keeng Phim",
  },
  infoLink: "https://luanxt.com/get-link-mp3-320-lossless-vip-zing/",

  onClickExtension: async function () {
    const apiBaseURL = "https://luanxt.com/get-link-mp3-320-lossless-vip-zing/";

    // let xtSalt = "(k[1>>8]>>>k%2=0).fromCharCode";
    // xtSalt =
    //   "undefined" == typeof jQuery ||
    //   (0 == $("html").length && 0 == $("#link").length) ||
    //   "undefined" == typeof navigator
    //     ? "(65535&n)+(65535&t)" + xtSalt
    //     : xtSalt;
    // let lxtS = "(65535&n)+(65535&t)";
    // lxtS = "xt1>>8" + xtSalt;
    let lxtS = "xt1>>8(k[1>>8]>>>k%2=0).fromCharCode";

    const xtSign = (t) =>
      md5(t + lxtS + "function s = module.exports=s(2)").substr(1, 8);

    async function getLuanxtUserToken() {
      let res = await fetch(apiBaseURL);
      let text = await res.text();
      return /let userToken = "(.*)";/.exec(text)?.[1];
    }

    async function getLinkLuanxt(link, token) {
      let sig = xtSign(`${link}${token}`);

      let res = await fetch(`${apiBaseURL}api/get-link`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          link: link,
          sig: sig,
        }),
      });
      return await res.json();
    }

    const renderResult = (json, win) => {
      console.log(json);

      if (json?.code != 200 || json?.status != "success" || !json.data) {
        alert("Lỗi: " + (json.message || "Không tìm thấy data"));
        return;
      }
      //prettier-ignore
      let {id,link,image,name,artist,source,type,downloads,streaming} = json.data;

      let listDownload = Array.isArray(downloads)
        ? //prettier-ignore
          downloads.map((_) =>`<a href="${_.link}" target="_blank">Download ${_.label}</a>`).join("")
        : typeof downloads === "object" && downloads !== null
        ? Object.entries(downloads)
            .map(
              ([key, value]) =>
                `<h3>${key}</h3>` +
                //prettier-ignore
                value.map((_) =>`<a href="${_.link}" target="_blank">Download ${_.label}</a>`).join("")
            )
            .join("")
        : "";

      let listStreaming = streaming
        ?.map((_) =>
          type === "audio"
            ? `<p>${_.label}</p><audio controls src="${_.link}"></audio>`
            : type === "video"
            ? `<p>${_.label}</p><video controls src="${_.link}"></video>`
            : ""
        )
        ?.join("");

      let html = `<div class="container">
        <h2>Useful-scripts get link (luanxt)</h2>
        <h2>${source}</h2>

        <img src="${image}" />
        <a href="${link}" target="_blank">${name}-${artist}</a>

        <br/><br/><h2>Download</h2>
        ${listDownload}

        <br/><br/><h2>Streaming</h2>
        ${listStreaming}

        <style>
              img {
                max-width:200px
              }
              video {
                max-width:300px
              }
              a {
                display: block;
                text-decoration: none;
                padding: 5px 10px;
                margin: 5px;
              }
              a:hover {
                text-decoration: underline;
              }
              .container {
                position:fixed;
                top:0;left:0;right:0;bottom:0;
                background:#ddd;
                z-index:9999999;
                text-align:center;
                padding:10px;
                overflow:auto;
              }
        </style>
      </div>`;

      if (win) win.document.body.innerHTML = html;
    };

    (async () => {
      let url = prompt(
        "Hỗ trợ:\n+ " +
          [
            "Zing MP3, Zing Video Clip, Zing TV",
            "NhacCuaTui",
            "YouTube",
            "SoundCloud",
            "Nhac.vn",
            "ChiaSeNhac.vn",
            "Facebook Video",
            "Keeng Audio, Keeng Video, Keeng Phim",
          ].join("\n+ ") +
          "\n\nNhập link",
        ""
      );
      if (url) {
        const { closeLoading, setLoadingText } = showLoading(
          "Đang lấy token luanxt ..."
        );
        try {
          let userToken = await getLuanxtUserToken();
          prompt("Token luanxt:", userToken);
          setLoadingText("Đang get link từ luanxt...");
          let json = await getLinkLuanxt(url, userToken);

          if (json) {
            let win = window.open(
              "",
              "",
              "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=600,top=" +
                (screen.height - 400) +
                ",left=" +
                (screen.width - 840)
            );
            renderResult(json, win);
          }
        } catch (e) {
          prompt(
            "ERROR: " + e + "\n\nBạn có thể mở trang web bên dưới để thử lại:",
            apiBaseURL
          );
        } finally {
          closeLoading();
        }
      }
    })();
  },
};

function backup() {
  /*
  Tổng hợp một số Host getlink VIP cho các bạn (http://vnzleech.blogspot.com/)

  https://linksvip.net/
  https://getlinkfshare.com/

  http://www.4server.info/
  http://www.ddlgen.net/
  http://vinaget.us/rs/
  http://getlink.benhvientinhoc.com/
  http://vn-times.com/getlink/
  http://getlink.s2u.vn/
  http://vinaget.us/getmf/
  http://vnit-club.vn/@get/ | beta
  http://getlink.tyvn.biz/
  http://hipget.cu.cc/
  http://upanh.tv/
  http://getlink.host56.com/get_fshare/
  http://loveanh9x.forever.vn/ft/
  http://loveanh9x.forever.vn/ft01/
  http://loveanh9x.forever.vn/ft02/
  http://unrestrict.li/
  http://fsoft.vn/download-4f.php
  http://62.210.172.96/debrideur/
  http://rapidebrideur.com/
  http://www.exrapidleech.info/
  http://www.leechyear.com/
  http://www.premiumleecher.com/
  http://www.monsterleech.pw/
  http://sendsupload.com/index.php
  http://easyload50.com/mini/index.php
  http://rapidgrab.pl/
  http://preemlinks.com/generator.php
 */
}
