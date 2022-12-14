export default {
  icon: `<i class="fa-solid fa-key"></i>`,
  name: {
    en: "Get fb token (locmai)",
    vi: "Lấy fb token (locmai)",
  },
  description: {
    en: "Get facebook token using username/password",
    vi: "Lấy facebook token sử dụng username/password",
  },
  blackList: [],
  whiteList: [],

  onClickExtension: function () {
    // https://github.com/locmai0808/Facebook-Access-Token

    const utils = {
      sortObj(obj) {
        let keys = Object.keys(obj).sort(),
          sortedObj = {};
        for (let i in keys) {
          sortedObj[keys[i]] = obj[keys[i]];
        }
        return sortedObj;
      },

      randBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      },

      // minified version of https://stackoverflow.com/a/14733423
      // prettier-ignore
      md5(_){function $(_,$){var n=_[0],e=_[1],f=_[2],c=_[3];n=r(n,e,f,c,$[0],7,-680876936),c=r(c,n,e,f,$[1],12,-389564586),f=r(f,c,n,e,$[2],17,606105819),e=r(e,f,c,n,$[3],22,-1044525330),n=r(n,e,f,c,$[4],7,-176418897),c=r(c,n,e,f,$[5],12,1200080426),f=r(f,c,n,e,$[6],17,-1473231341),e=r(e,f,c,n,$[7],22,-45705983),n=r(n,e,f,c,$[8],7,1770035416),c=r(c,n,e,f,$[9],12,-1958414417),f=r(f,c,n,e,$[10],17,-42063),e=r(e,f,c,n,$[11],22,-1990404162),n=r(n,e,f,c,$[12],7,1804603682),c=r(c,n,e,f,$[13],12,-40341101),f=r(f,c,n,e,$[14],17,-1502002290),e=r(e,f,c,n,$[15],22,1236535329),n=t(n,e,f,c,$[1],5,-165796510),c=t(c,n,e,f,$[6],9,-1069501632),f=t(f,c,n,e,$[11],14,643717713),e=t(e,f,c,n,$[0],20,-373897302),n=t(n,e,f,c,$[5],5,-701558691),c=t(c,n,e,f,$[10],9,38016083),f=t(f,c,n,e,$[15],14,-660478335),e=t(e,f,c,n,$[4],20,-405537848),n=t(n,e,f,c,$[9],5,568446438),c=t(c,n,e,f,$[14],9,-1019803690),f=t(f,c,n,e,$[3],14,-187363961),e=t(e,f,c,n,$[8],20,1163531501),n=t(n,e,f,c,$[13],5,-1444681467),c=t(c,n,e,f,$[2],9,-51403784),f=t(f,c,n,e,$[7],14,1735328473),e=t(e,f,c,n,$[12],20,-1926607734),n=u(n,e,f,c,$[5],4,-378558),c=u(c,n,e,f,$[8],11,-2022574463),f=u(f,c,n,e,$[11],16,1839030562),e=u(e,f,c,n,$[14],23,-35309556),n=u(n,e,f,c,$[1],4,-1530992060),c=u(c,n,e,f,$[4],11,1272893353),f=u(f,c,n,e,$[7],16,-155497632),e=u(e,f,c,n,$[10],23,-1094730640),n=u(n,e,f,c,$[13],4,681279174),c=u(c,n,e,f,$[0],11,-358537222),f=u(f,c,n,e,$[3],16,-722521979),e=u(e,f,c,n,$[6],23,76029189),n=u(n,e,f,c,$[9],4,-640364487),c=u(c,n,e,f,$[12],11,-421815835),f=u(f,c,n,e,$[15],16,530742520),e=u(e,f,c,n,$[2],23,-995338651),n=o(n,e,f,c,$[0],6,-198630844),c=o(c,n,e,f,$[7],10,1126891415),f=o(f,c,n,e,$[14],15,-1416354905),e=o(e,f,c,n,$[5],21,-57434055),n=o(n,e,f,c,$[12],6,1700485571),c=o(c,n,e,f,$[3],10,-1894986606),f=o(f,c,n,e,$[10],15,-1051523),e=o(e,f,c,n,$[1],21,-2054922799),n=o(n,e,f,c,$[8],6,1873313359),c=o(c,n,e,f,$[15],10,-30611744),f=o(f,c,n,e,$[6],15,-1560198380),e=o(e,f,c,n,$[13],21,1309151649),n=o(n,e,f,c,$[4],6,-145523070),c=o(c,n,e,f,$[11],10,-1120210379),f=o(f,c,n,e,$[2],15,718787259),e=o(e,f,c,n,$[9],21,-343485551),_[0]=a(n,_[0]),_[1]=a(e,_[1]),_[2]=a(f,_[2]),_[3]=a(c,_[3])}function n(_,$,n,r,t,u){return $=a(a($,_),a(r,u)),a($<<t|$>>>32-t,n)}function r(_,$,r,t,u,o,e){return n($&r|~$&t,_,$,u,o,e)}function t(_,$,r,t,u,o,e){return n($&t|r&~t,_,$,u,o,e)}function u(_,$,r,t,u,o,e){return n($^r^t,_,$,u,o,e)}function o(_,$,r,t,u,o,e){return n(r^($|~t),_,$,u,o,e)}function e(_){var $,n=[];for($=0;$<64;$+=4)n[$>>2]=_.charCodeAt($)+(_.charCodeAt($+1)<<8)+(_.charCodeAt($+2)<<16)+(_.charCodeAt($+3)<<24);return n}var f,c="0123456789abcdef".split("");function i(_){for(var $="",n=0;n<4;n++)$+=c[_>>8*n+4&15]+c[_>>8*n&15];return $}function a(_,$){return _+$&4294967295}return function _($){for(var n=0;n<$.length;n++)$[n]=i($[n]);return $.join("")}(function _(n){var r,t=n.length,u=[1732584193,-271733879,-1732584194,271733878];for(r=64;r<=n.length;r+=64)$(u,e(n.substring(r-64,r)));n=n.substring(r-64);var o=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(r=0;r<n.length;r++)o[r>>2]|=n.charCodeAt(r)<<(r%4<<3);if(o[r>>2]|=128<<(r%4<<3),r>55)for($(u,o),r=0;r<16;r++)o[r]=0;return o[14]=8*t,$(u,o),u}(f=_))},

      randString(limit) {
        limit = limit || 10;
        let text = "abcdefghijklmnopqrstuvwxyz";
        text = text.charAt(Math.floor(Math.random() * text.length));
        const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < limit - 1; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      },

      // https://stackoverflow.com/a/2117523
      uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
          (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16)
        );
      },
    };

    const token = {
      getToken(email, password) {
        const sim = utils.randBetween(2e4, 4e4);
        let deviceID = utils.uuidv4();
        let adID = utils.uuidv4();
        let formData = {
          adid: adID,
          format: "json",
          device_id: deviceID,
          email: email,
          password: password,
          cpl: "true",
          family_device_id: deviceID,
          credentials_type: "device_based_login_password",
          generate_session_cookies: "1",
          error_detail_type: "button_with_disabled",
          source: "device_based_login",
          machine_id: utils.randString(24),
          meta_inf_fbmeta: "",
          advertiser_id: adID,
          currently_logged_in_userid: "0",
          locale: "en_US",
          client_country_code: "US",
          method: "auth.login",
          fb_api_req_friendly_name: "authenticate",
          fb_api_caller_class:
            "com.facebook.account.login.protocol.Fb4aAuthHandler",
          api_key: "882a8490361da98702bf97a021ddc14d",
        };
        formData.sig = token.getSig(utils.sortObj(formData));
        fetch("https://b-api.facebook.com/method/auth.login", {
          method: "post",
          headers: {
            "x-fb-connection-bandwidth": utils.randBetween(2e7, 3e7),
            "x-fb-sim-hni": sim,
            "x-fb-net-hni": sim,
            "x-fb-connection-quality": "EXCELLENT",
            "x-fb-connection-type": "cell.CTRadioAccessTechnologyHSDPA",
            "user-agent":
              "Dalvik/1.6.0 (Linux; U; Android 4.4.2; NX55 Build/KOT5506) [FBAN/FB4A;FBAV/106.0.0.26.68;FBBV/45904160;FBDM/{density=3.0,width=1080,height=1920};FBLC/it_IT;FBRV/45904160;FBCR/PosteMobile;FBMF/asus;FBBD/asus;FBPN/com.facebook.katana;FBDV/ASUS_Z00AD;FBSV/5.0;FBOP/1;FBCA/x86:armeabi-v7a;]",
            "content-type": "application/x-www-form-urlencoded",
            "x-fb-http-engine": "Liger",
          },
          body: JSON.stringify(formData),
        })
          .then((res) => {
            console.log(res);
            if (!res?.ok) throw Error("Response error");
          })
          .catch((e) => alert("ERROR " + e));
      },

      getSig: function (formData) {
        let sig = "";
        Object.keys(formData).forEach(function (key) {
          sig += `${key}=${formData[key]}`;
        });
        sig = utils.md5(sig + "62f8ce9f74b12f84c123cc23437a4a32");
        return sig;
      },
    };

    (async () => {
      let user = prompt("Enter username:", "");
      if (user) {
        let pass = prompt("Enter password:", "");
        if (pass) {
          token.getToken(user, pass);
        }
      }
    })();
  },
};
