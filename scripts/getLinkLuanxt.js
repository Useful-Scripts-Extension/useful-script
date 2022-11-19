export default {
  icon: "https://luanxt.com/get-link-mp3-320-lossless-vip-zing/favicon.ico",
  name: {
    en: "Get link zingmp3 nhaccuatui youtube",
    vi: "Get link zingmp3 nhaccuatui youtube",
  },
  description: {
    en: "Using API from luanxt.com",
    vi: "Sử dụng API của luanxt.com",
  },
  blackList: [],
  whiteList: [],
  runInExtensionContext: true,

  func: function () {
    // https://luanxt.com/get-link-mp3-320-lossless-vip-zing/

    const apiBaseURL = "https://luanxt.com/get-link-mp3-320-lossless-vip-zing/";
    const userToken = "2e8878cfbdf8cec26ac6e041c0d90979f65c01c4";
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

    //prettier-ignore
    const xtHs = (()=>{
        function e(n,r){var t=(65535&n)+(65535&r);return(n>>16)+(r>>16)+(t>>16)<<16|65535&t}function n(n,r,t,o,u,i){return e(function(n,r){return n<<r|n>>>32-r}(e(e(r,n),e(o,i)),u),t)}function r(r,t,o,e,u,i,a){return n(t&o|~t&e,r,t,u,i,a)}function i(r,t,o,e,u,i,a){return n(t&e|o&~e,r,t,u,i,a)}function o(r,t,o,e,u,i,a){return n(t^o^e,r,t,u,i,a)}function a(r,t,o,e,u,i,a){return n(o^(t|~e),r,t,u,i,a)}function s(n,t){n[t>>5]|=128<<t%32,n[14+(t+64>>>9<<4)]=t;var u,c,f,h,l,g=1732584193,d=-271733879,v=-1732584194,s=271733878;for(u=0;u<n.length;u+=16)c=g,f=d,h=v,l=s,d=a(d=a(d=a(d=a(d=o(d=o(d=o(d=o(d=i(d=i(d=i(d=i(d=r(d=r(d=r(d=r(d,v=r(v,s=r(s,g=r(g,d,v,s,n[u],7,-680876936),d,v,n[u+1],12,-389564586),g,d,n[u+2],17,606105819),s,g,n[u+3],22,-1044525330),v=r(v,s=r(s,g=r(g,d,v,s,n[u+4],7,-176418897),d,v,n[u+5],12,1200080426),g,d,n[u+6],17,-1473231341),s,g,n[u+7],22,-45705983),v=r(v,s=r(s,g=r(g,d,v,s,n[u+8],7,1770035416),d,v,n[u+9],12,-1958414417),g,d,n[u+10],17,-42063),s,g,n[u+11],22,-1990404162),v=r(v,s=r(s,g=r(g,d,v,s,n[u+12],7,1804603682),d,v,n[u+13],12,-40341101),g,d,n[u+14],17,-1502002290),s,g,n[u+15],22,1236535329),v=i(v,s=i(s,g=i(g,d,v,s,n[u+1],5,-165796510),d,v,n[u+6],9,-1069501632),g,d,n[u+11],14,643717713),s,g,n[u],20,-373897302),v=i(v,s=i(s,g=i(g,d,v,s,n[u+5],5,-701558691),d,v,n[u+10],9,38016083),g,d,n[u+15],14,-660478335),s,g,n[u+4],20,-405537848),v=i(v,s=i(s,g=i(g,d,v,s,n[u+9],5,568446438),d,v,n[u+14],9,-1019803690),g,d,n[u+3],14,-187363961),s,g,n[u+8],20,1163531501),v=i(v,s=i(s,g=i(g,d,v,s,n[u+13],5,-1444681467),d,v,n[u+2],9,-51403784),g,d,n[u+7],14,1735328473),s,g,n[u+12],20,-1926607734),v=o(v,s=o(s,g=o(g,d,v,s,n[u+5],4,-378558),d,v,n[u+8],11,-2022574463),g,d,n[u+11],16,1839030562),s,g,n[u+14],23,-35309556),v=o(v,s=o(s,g=o(g,d,v,s,n[u+1],4,-1530992060),d,v,n[u+4],11,1272893353),g,d,n[u+7],16,-155497632),s,g,n[u+10],23,-1094730640),v=o(v,s=o(s,g=o(g,d,v,s,n[u+13],4,681279174),d,v,n[u],11,-358537222),g,d,n[u+3],16,-722521979),s,g,n[u+6],23,76029189),v=o(v,s=o(s,g=o(g,d,v,s,n[u+9],4,-640364487),d,v,n[u+12],11,-421815835),g,d,n[u+15],16,530742520),s,g,n[u+2],23,-995338651),v=a(v,s=a(s,g=a(g,d,v,s,n[u],6,-198630844),d,v,n[u+7],10,1126891415),g,d,n[u+14],15,-1416354905),s,g,n[u+5],21,-57434055),v=a(v,s=a(s,g=a(g,d,v,s,n[u+12],6,1700485571),d,v,n[u+3],10,-1894986606),g,d,n[u+10],15,-1051523),s,g,n[u+1],21,-2054922799),v=a(v,s=a(s,g=a(g,d,v,s,n[u+8],6,1873313359),d,v,n[u+15],10,-30611744),g,d,n[u+6],15,-1560198380),s,g,n[u+13],21,1309151649),v=a(v,s=a(s,g=a(g,d,v,s,n[u+4],6,-145523070),d,v,n[u+11],10,-1120210379),g,d,n[u+2],15,718787259),s,g,n[u+9],21,-343485551),g=e(g,c),d=e(d,f),v=e(v,h),s=e(s,l);return[g,d,v,s]}function u(n){var r,t="",o=32*n.length;for(r=0;r<o;r+=8)t+=String.fromCharCode(n[r>>5]>>>r%32&255);return t}function l(n){var r,t=[];for(t[(n.length>>2)-1]=void 0,r=0;r<t.length;r+=1)t[r]=0;var o=8*n.length;for(r=0;r<o;r+=8)t[r>>5]|=(255&n.charCodeAt(r/8))<<r%32;return t}function c(n){var r,t,o="";for(t=0;t<n.length;t+=1)r=n.charCodeAt(t),o+="0123456789abcdef".charAt(r>>>4&15)+"0123456789abcdef".charAt(15&r);return o}function f(n){return unescape(encodeURIComponent(n))}function h(n){return function(n){return u(s(l(n),8*n.length))}(f(n))}function p(n,r){return function(n,r){var t,o,e=l(n),i=[],a=[];for(i[15]=a[15]=void 0,e.length>16&&(e=s(e,8*n.length)),t=0;t<16;t+=1)i[t]=909522486^e[t],a[t]=1549556828^e[t];return o=s(i.concat(l(r)),512+8*r.length),u(s(a.concat(o),640))}(f(n),f(r))}
        return function d(n,r,t){return r?t?p(r,n):function(n,r){return c(p(n,r))}(r,n):t?h(n):function(n){return c(h(n))}(n)}
    })();
    const xtSign = (t) =>
      xtHs(t + lxtS + "function s = module.exports=s(2)").substr(1, 8);

    const getLink = (link) => {
      let sig = xtSign(`${link}${userToken}`);
      console.log(sig);

      fetch(`${apiBaseURL}api/get-link`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          link: link,
          sig: sig,
        }),
      })
        .then((res) => res.json())
        .then((json) => console.log(json))
        .catch((e) => {
          console.log("ERROR ", e);
        });
    };

    let url = window.prompt(
      "Enter url / Nhập link\n(zingmp3 / nhaccuatui / youtube):",
      "https://zingmp3.vn/bai-hat/Think-Of-You-Huynh-Tu/ZZI087Z8.html"
    );
    if (url) {
      getLink(url);
    }
  },
};
