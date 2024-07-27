import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>',
  name: {
    en: "Auto - view largest image",
    vi: "Tự động - xem ảnh lớn nhất",
  },
  description: {
    en: `<ul>
      <li>When viewing an image in new tab.</li>
      <li>This script will auto find and redirect to largest image.</li>
      <li>Support hundred of websites.</li>
    </ul>`,
    vi: `<ul>
      <li>Khi bạn mở xem ảnh trong tab mới.</li>
      <li>Chức năng này sẽ tự động tìm và chuyển trang sang ảnh chất lượng cao nhất.</li>
      <li>Hỗ trợ hàng trăm trang web.</li>
    </ul>`,
    img: "/scripts/auto_redirectLargestImageSrc.jpg",
  },

  buttons: [
    {
      icon: '<i class="fa-regular fa-circle-question"></i>',
      name: {
        vi: "Danh sách trang web",
        en: "Supported websites",
      },
      onClick: () => {
        window.open(
          "/pages/viewScriptSource/index.html?file=auto_redirectLargestImageSrc_rules"
        );
      },
    },
  ],

  changeLogs: {
    "2024-04-16": "init",
  },

  contentScript: {
    onDocumentStart: async () => {
      let oldHref = location.href;
      check(oldHref);

      window.onload = () =>
        UfsGlobal.DOM.onHrefChanged((oldHref, newHref) => check(newHref));

      async function check(href) {
        let url = await getLargestImageSrc(href, href);
        if (url && url != href) {
          if (
            confirm(
              "Found bigger image. Redirect to that now?\n\nTìm thấy ảnh lớn hơn. Chuyển trang ngay?\n\n" +
                url
            )
          ) {
            location.href = url;
          }
        }
      }
    },
  },
};
const CACHED = {};
export async function getLargestImageSrc(imgSrc, webUrl) {
  if (/^data:/i.test(imgSrc)) {
    return null;
  }

  // bypass redirect
  imgSrc = UfsGlobal.Utils.makeUrlValid(imgSrc);
  let redirectedUrl = await UfsGlobal.Utils.getRedirectedUrl(imgSrc);
  if (redirectedUrl) {
    imgSrc = redirectedUrl;
  }

  function try1() {
    const url = new URL(imgSrc);
    switch (url.hostname) {
      // https://atlassiansuite.mservice.com.vn:8443/secure/useravatar?size=small&ownerId=JIRAUSER14656&avatarId=11605
      case "atlassiansuite.mservice.com.vn":
      case "atlassiantool.mservice.com.vn":
        if (url.href.includes("avatar")) {
          if (url.searchParams.get("size")) {
            url.searchParams.set("size", "256");
          } else {
            url.searchParams.append("size", "256");
          }
        }
        if (url.href.includes("/thumbnail/")) {
          return url.href.replace("/thumbnail/", "/attachments/");
        }
        if (url.href.includes("/thumbnails/")) {
          return url.href.replace("/thumbnails/", "/attachments/");
        }
        return url.toString();
    }
    return null;
  }

  async function try2() {
    if (!CACHED.largeImgSiteRules) {
      let s = await import("./auto_redirectLargestImageSrc_rules.js");
      CACHED.largeImgSiteRules = s.default;
    }
    for (let rule of CACHED.largeImgSiteRules) {
      if (rule.url && !testRegex(webUrl, rule.url)) continue;
      if (rule.src && !testRegex(imgSrc, rule.src)) continue;
      if (rule.exclude && testRegex(imgSrc, rule.exclude)) continue;
      if (rule.r) {
        let newSrc = replaceUsingRegex(imgSrc, rule.r, rule.s);
        if (newSrc?.length) {
          return newSrc;
        }
      }
    }
    return null;
  }

  // https://greasyfork.org/en/scripts/2312-resize-image-on-open-image-in-new-tab
  function try3() {
    return new Promise((resolve) => {
      let m = null;
      //google
      if (
        (m = imgSrc.match(
          /^(https?:\/\/lh\d+\.googleusercontent\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "s0") {
          resolve(m[1] + "s0" + m[3]);
        }
      } else if (
        (m = imgSrc.match(
          /^(https?:\/\/lh\d+\.googleusercontent\.com\/.+=)(.+)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "s0") {
          resolve(m[1] + "s0");
        }
      } else if (
        (m = imgSrc.match(
          /^(https?:\/\/\w+\.ggpht\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "s0") {
          resolve(m[1] + "s0" + m[3]);
        }
      }

      //blogspot
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/\w+\.bp\.blogspot\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "s0") {
          resolve(m[1] + "s0" + m[3]);
        }
      }

      //tumblr
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/\d+\.media\.tumblr\.com\/.*tumblr_\w+_)(\d+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i
        ))
      ) {
        if (m[2] < 1280) {
          let ajax = new XMLHttpRequest();
          ajax.onreadystatechange = function () {
            if (ajax.status == 200) {
              resolve(m[1] + "1280" + m[3]);
            }
          };
          ajax.open("HEAD", m[1] + "1280" + m[3], true);
          ajax.send();
        }
      }

      //twitter
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/\w+\.twimg\.com\/media\/[^\/:]+)\.(jpg|jpeg|gif|png|bmp|webp)(:\w+)?$/i
        ))
      ) {
        let format = m[2];
        if (m[2] == "jpeg") format = "jpg";
        resolve(m[1] + "?format=" + format + "&name=orig");
      } else if (
        (m = imgSrc.match(/^(https?:\/\/\w+\.twimg\.com\/.+)(\?.+)$/i))
      ) {
        let url = new URL(webUrl);
        let pars = url.searchParams;
        if (!pars.format || !pars.name) return;
        if (pars.name == "orig") return;
        resolve(m[1] + "?format=" + pars.format + "&name=orig");
      }

      //Steam (Only user content)
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(images\.akamai\.steamusercontent\.com|steamuserimages-a\.akamaihd\.net)\/[^\?]+)\?.+$/i
        ))
      ) {
        resolve(m[1]);
      }

      //性浪微博
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(?:(?:ww|wx|ws|tvax|tva)\d+|wxt|wt)\.sinaimg\.(?:cn|com)\/)([\w\.]+)(\/.+)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "large") {
          resolve(m[1] + "large" + m[3]);
        }
      }

      //zhihu
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/.+\.zhimg\.com\/)(?:\d+\/)?([\w\-]+_)(\w+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i
        ))
      ) {
        if (m[3] != "r") {
          resolve(m[1] + m[2] + "r" + m[4]);
        }
      }

      //pinimg
      else if (
        (m = imgSrc.match(/^(https?:\/\/i\.pinimg\.com\/)(\w+)(\/.+)$/i))
      ) {
        if (m[2] != "originals") {
          resolve(m[1] + "originals" + m[3]);
        }
      } else if (
        (m = imgSrc.match(
          /^(https?:\/\/s-media[\w-]+\.pinimg\.com\/)(\w+)(\/.+)$/i
        ))
      ) {
        //need delete?
        if (m[2] != "originals") {
          resolve(m[1] + "originals" + m[3]);
        }
      }

      //bilibili
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/\w+\.hdslb\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))(@|_).+$/i
        ))
      ) {
        resolve(m[1]);
      }

      //taobao(tmall)
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(?:.+?)\.alicdn\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))_.+$/i
        ))
      ) {
        resolve(m[1]);
      }

      //jd
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(?:img\d+)\.360buyimg\.com\/)((?:.+?)\/(?:.+?))(\/(?:.+?))(\!.+)?$/i
        ))
      ) {
        if (m[2] != "sku/jfs") {
          resolve(m[1] + "sku/jfs" + m[3]);
        }
      }

      // https://s01.riotpixels.net/data/2a/b2/2ab23684-6cec-41da-9bce-f72c5264353a.jpg.240p.jpg
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(?:.+?)\.riotpixels\.net\/.+\.(jpg|jpeg|gif|png|bmp|webp))\..+?$/i
        ))
      ) {
        resolve(m[1]);
      }

      // reddit NEED TEST
      else if (
        (m = imgSrc.match(
          /^https?:\/\/preview\.redd\.it\/(.+\.(jpg|jpeg|gif|png|bmp|webp))\?.+?$/i
        ))
      ) {
        resolve("https://i.redd.it/" + m[1]);
      }

      // akamaized.net/imagecache NEED TEST
      else if (
        (m = imgSrc.match(
          /^(https:\/\/.+\.akamaized\.net\/imagecache\/\d+\/\d+\/\d+\/\d+\/)(\d+)(\/.+)$/i
        ))
      ) {
        if (m[2] < 1920) resolve(m[1] + "1920" + m[3]);
      }

      // 微信公众号 by sbdx
      else if (
        (m = imgSrc.match(
          /^(https:\/\/mmbiz\.qpic\.cn\/mmbiz_jpg\/.+?\/)(\d+)(\?wx_fmt=jpeg)/i
        ))
      ) {
        if (m[2] != 0) resolve(m[1] + "0" + m[3]);
      }

      //百度贴吧（然而对于画质提升什么的并没有什么卵用...）
      else if (
        (m = imgSrc.match(
          /^https?:\/\/imgsrc\.baidu\.com\/forum\/pic\/item\/.+/i
        ))
      ) {
        if (
          (m = imgSrc.match(
            /^(https?):\/\/(?:imgsrc|imgsa|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i
          ))
        ) {
          resolve(m[1] + "://imgsrc.baidu.com/forum/pic/item/" + m[2]);
        }
        //if( (m = imgSrc.match(/^(https?)(:\/\/(?:imgsrc|imgsa|\w+\.hiphotos|tiebapic)\.(?:bdimg|baidu)\.com\/)(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i)) ){
        //	resolve(m[1] + m[2] + "forum/pic/item/" + m[3])
        //}
      } else {
        resolve(null);
      }
    });
  }

  for (let fn of [try1, try2, try3]) {
    try {
      let res = await timeoutPromise(fn(), 5000);
      if (res && res != imgSrc) {
        if (!Array.isArray(res)) res = [res];
        if (res.length) {
          let finalSrc = await findWorkingSrc(res, true);
          if (finalSrc?.length) return finalSrc;
        }
      }
    } catch (e) {
      console.log("ERROR getLargestImageSrc: " + fn.name + " -> ", e);
    }
  }

  return null;
}
function findWorkingSrc(srcs, inOrder = true) {
  return new Promise((resolve, reject) => {
    if (!srcs || !Array.isArray(srcs) || srcs.length === 0) {
      reject("srcs is falsy, not an array, or empty");
    } else {
      const checkImage = (src) =>
        // prevent Error: Content Security Policy directive: "connect-src 'self'
        isImageSrc(src).then((value) => {
          if (inOrder) return value;
          if (value) resolve(src);
          return value;
        });

      const promises = srcs.map(checkImage);
      Promise.all(promises).then((res) => {
        let trueIndex = res.indexOf(true);
        if (trueIndex > -1) {
          resolve(srcs[trueIndex]);
        } else {
          reject("none of the URLs are valid images");
        }
      });
    }
  });
}
async function isImageSrc(src) {
  try {
    const res = await UfsGlobal.Extension.fetchByPassOrigin(src, {
      method: "HEAD",
    });
    if (res?.ok) {
      // const type = res.headers.get("content-type");
      const type = res.headers?.["content-type"];
      if (type?.startsWith?.("image/")) {
        return true;
      }
    }
  } catch (error) {
    console.log("ERROR isImageSrc: " + src + " -> ", error);
  }
  return new Promise((resolve) => {
    let img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}

function timeoutPromise(prom, time) {
  return Promise.race([
    prom,
    new Promise((_r, rej) => setTimeout(() => rej("time out " + time), time)),
  ]);
}
function uniqueArray(array) {
  return Array.from(new Set(array));
}
function replaceUsingRegex(str, r, s) {
  let results = [];

  if (!Array.isArray(r) && !Array.isArray(s)) {
    if (r?.test?.(str)) {
      results.push(str.replace(r, s));
    }
  } else if (!Array.isArray(r) && Array.isArray(s)) {
    if (r?.test?.(str)) {
      for (const si of s) {
        results.push(str.replace(r, si));
      }
    }
  } else if (Array.isArray(r) && !Array.isArray(s)) {
    for (const ri of r) {
      if (ri?.test?.(str)) {
        results.push(str.replace(ri, s));
      }
    }
  } else if (Array.isArray(r) && Array.isArray(s)) {
    for (let ri = 0; ri < r.length; ri++) {
      let _r = r[ri];
      if (_r?.test?.(str)) {
        let _s = Array.isArray(s[ri]) ? s[ri] : [s[ri]];
        for (const si of _s) {
          results.push(str.replace(_r, si));
        }
      }
    }
  }

  return uniqueArray(results);
}
function testRegex(str, regexs) {
  if (!Array.isArray(regexs)) regexs = [regexs];
  for (let regex of regexs) {
    if (regex?.test?.(str)) {
      return true;
    }
  }
  return false;
}
