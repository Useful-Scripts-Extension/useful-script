import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";
import scrollToVeryEnd from "./scrollToVeryEnd.js";
import * as tiktok_downloadVideoNoWM from "./tiktok_downloadVideo.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Download all user videos",
    vi: "Tiktok - Tải tất cả video người dùng",
  },
  description: {
    en: "Download all videos in tiktok user profile.",
    vi: "Tải tất cả video trong trang cá nhân của người dùng tiktok.",
  },
  onClickExtension: async function () {
    // Source code: https://github.com/karim0sec/tiktokdl

    const { downloadData } = UsefulScriptGlobalPageContext.Utils;

    let { closeLoading, setLoadingText } = showLoading();
    try {
      await scrollToVeryEnd.onClickExtension();

      setLoadingText("Đang lấy danh sách video...");
      let urls = await runScriptInCurrentTab(() => {
        // var videoDes = Array.from(
        //     document.querySelectorAll(
        //       "div.tiktok-1qb12g8-DivThreeColumnContainer.eegew6e2 > div > div > div > a"
        //     )
        //   ).map((items) => items.innerText);
        //   console.log(videoDes);
        return Array.from(
          document.querySelectorAll(
            "div.tiktok-1qb12g8-DivThreeColumnContainer > div > div > div > div > div > a"
          ),
          (element) => element.href
        );
      });

      console.log(urls);
      if (!urls?.length) throw Error("Không tìm thấy video nào");
      if (
        !confirm(
          "Tìm thấy " +
            urls.length +
            " video.\nBấm OK để tiếp tục tải.\nBâm Cancel để huỷ tải."
        )
      )
        return;

      let videoUrls = [];
      let errorCount = 0;
      for (var i = 0; i < urls.length; i++) {
        try {
          let aweme_id = urls[i].slice(-19).toString();
          setLoadingText(
            `<p style="text-align:center">
            Đang get link ${i}/${urls.length}...<br/>
            ${urls[i]}<br/>
            Lỗi: ${errorCount} links
          </p>`
          );
          let videoURL =
            await tiktok_downloadVideoNoWM.shared.getVideoNoWaterMark(urls[i]);
          videoUrls.push(videoURL);
        } catch (e) {
          console.error(e);
          errorCount++;
        }

        // let t = 500;
        // setLoadingText(
        //   `Get link xong [${i}/${urls.length}]...<br/>Đang chờ ${t}ms...`
        // );
        // await sleep(t);
      }
      console.log(videoUrls);
      if (videoUrls.length)
        downloadData(videoUrls.join("\n"), "tiktok-user-videos", ".txt");
      else throw "Không tìm được video nào";
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

async function backup() {
  // MUST READ: https://github.com/davidteather/TikTok-Api

  const generateProfileUrl = (username) => {
    return "https://www.tiktok.com/@" + username.replace("@", "");
  };

  // =================== Tải về mọi video trong user tiktok (có watermark) ===================
  let containers = Array.from(
    document.querySelectorAll(".tiktok-x6y88p-DivItemContainerV2.e19c29qe7")
  );
  let videos = [];

  for (let c of containers) {
    let key = Object.keys(c).find((k) => k.startsWith("__reactFiber"));
    let video =
      c[key].firstEffect?.memoizedProps ||
      c[key].lastEffect?.memoizedProps ||
      c[key].return?.alternate?.firstEffect?.memoizedProps;

    videos.push(video);
  }

  console.log(videos);

  // ===========================================================================
  const getRedirectUrl = async (url) => {
    if (url.includes("vm.tiktok.com") || url.includes("vt.tiktok.com")) {
      url = await fetch(url, {
        redirect: "follow",
        follow: 10,
      });
      url = url.url;
      console.log(chalk.green("[*] Redirecting to: " + url));
    }
    return url;
  };

  let data = {
    device_platform: "web_pc",
    screen_width: "0",
    focus_state: "false",
    tz_name: "Asia/Saigon",
    from_page: "user",
    webcast_language: "en",
    history_len: "9",
    is_fullscreen: "false",
    _signature: "_02B4Z6wo00001uk-.ygAAIDDN0injBoKKDbpPvuAANnRdf",
    os: "windows",
    priority_region: "",
    aid: "1988",
    app_language: "en",
    app_name: "tiktok_web",
    battery_info: "1",
    browser_language: "en-US",
    browser_name: "Mozilla",
    browser_online: "true",
    browser_platform: "Win32",
    browser_version:
      "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.62",
    channel: "tiktok_web",
    region: "VN",
    device_id: "431432143153214321",
    screen_height: "864",
  };

  // x-tt-params 4mOJhGnMOdadxrLEy2bkmGSR2R38w8nZC8MQKREioTAU76aXIbW
  // https://www.tiktok.com/api/post/item_list/?

  encrypt = (e) => {
    const t = [];
    return (
      Object.keys(e).forEach((i) => {
        const o = `${i}=${e[i]}`;
        t.push(o);
      }),
      t.push("is_encryption=1"),
      ((e, t) => {
        const i = ((e, t) => {
            let i = e.toString();
            const o = i.length;
            return (
              o < 16
                ? (i = new Array(16 - o + 1).join("0") + i)
                : o > 16 && (i = i.slice(0, 16)),
              i
            );
          })("webapp1.0+20210628"),
          n = o.enc.Utf8.parse(i);
        return o.AES.encrypt(e, n, {
          iv: n,
          mode: o.mode.CBC,
          padding: o.pad.Pkcs7,
        }).toString();
      })(t.join("&"))
    );
  };

  encrypt = (searchParams) => {
    const path = [];
    Object.keys(searchParams).forEach((recipient) => {
      const testFilePath = `${recipient}=${searchParams[recipient]}`;
      path.push(testFilePath);
    });
    path.push("is_encryption=1");
    pathStr = path.join("&");

    // let pathStr = new URLSearchParams({
    //   ...searchParams,
    //   is_encryption: 1,
    // }).toString();

    const key = ((e, t) => {
      let i = e.toString();
      const o = i.length;
      // prettier-ignore
      return o < 16 ? i = new Array(16 - o + 1).join("0") + i : o > 16 && (i = i.slice(0, 16)),
      i
    })("webapp1.0+20210628");

    const nonce = o.enc.Utf8.parse(key);
    return o.AES.encrypt(pathStr, nonce, {
      iv: nonce,
      mode: o.mode.CBC,
      padding: o.pad.Pkcs7,
    }).toString();
  };
}
