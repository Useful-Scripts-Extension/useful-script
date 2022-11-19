export default {
  icon: "",
  name: {
    en: "Get fb token (locmai)",
    vi: "Lấy fb token (locmai)",
  },
  description: {
    en: "",
    vi: "",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    // https://github.com/locmai0808/Facebook-Access-Token

    const utils = {
      sortObj: function (obj) {
        let keys = Object.keys(obj).sort(),
          sortedObj = {};
        for (let i in keys) {
          sortedObj[keys[i]] = obj[keys[i]];
        }
        return sortedObj;
      },

      randBetween: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      },

      // minified version of https://stackoverflow.com/a/14733423
      //prettier-ignore
      md5: function (_){function $(_,$){var n=_[0],o=_[1],e=_[2],c=_[3];n=r(n,o,e,c,$[0],7,-680876936),c=r(c,n,o,e,$[1],12,-389564586),e=r(e,c,n,o,$[2],17,606105819),o=r(o,e,c,n,$[3],22,-1044525330),n=r(n,o,e,c,$[4],7,-176418897),c=r(c,n,o,e,$[5],12,1200080426),e=r(e,c,n,o,$[6],17,-1473231341),o=r(o,e,c,n,$[7],22,-45705983),n=r(n,o,e,c,$[8],7,1770035416),c=r(c,n,o,e,$[9],12,-1958414417),e=r(e,c,n,o,$[10],17,-42063),o=r(o,e,c,n,$[11],22,-1990404162),n=r(n,o,e,c,$[12],7,1804603682),c=r(c,n,o,e,$[13],12,-40341101),e=r(e,c,n,o,$[14],17,-1502002290),o=r(o,e,c,n,$[15],22,1236535329),n=f(n,o,e,c,$[1],5,-165796510),c=f(c,n,o,e,$[6],9,-1069501632),e=f(e,c,n,o,$[11],14,643717713),o=f(o,e,c,n,$[0],20,-373897302),n=f(n,o,e,c,$[5],5,-701558691),c=f(c,n,o,e,$[10],9,38016083),e=f(e,c,n,o,$[15],14,-660478335),o=f(o,e,c,n,$[4],20,-405537848),n=f(n,o,e,c,$[9],5,568446438),c=f(c,n,o,e,$[14],9,-1019803690),e=f(e,c,n,o,$[3],14,-187363961),o=f(o,e,c,n,$[8],20,1163531501),n=f(n,o,e,c,$[13],5,-1444681467),c=f(c,n,o,e,$[2],9,-51403784),e=f(e,c,n,o,$[7],14,1735328473),o=f(o,e,c,n,$[12],20,-1926607734),n=t(n,o,e,c,$[5],4,-378558),c=t(c,n,o,e,$[8],11,-2022574463),e=t(e,c,n,o,$[11],16,1839030562),o=t(o,e,c,n,$[14],23,-35309556),n=t(n,o,e,c,$[1],4,-1530992060),c=t(c,n,o,e,$[4],11,1272893353),e=t(e,c,n,o,$[7],16,-155497632),o=t(o,e,c,n,$[10],23,-1094730640),n=t(n,o,e,c,$[13],4,681279174),c=t(c,n,o,e,$[0],11,-358537222),e=t(e,c,n,o,$[3],16,-722521979),o=t(o,e,c,n,$[6],23,76029189),n=t(n,o,e,c,$[9],4,-640364487),c=t(c,n,o,e,$[12],11,-421815835),e=t(e,c,n,o,$[15],16,530742520),o=t(o,e,c,n,$[2],23,-995338651),n=u(n,o,e,c,$[0],6,-198630844),c=u(c,n,o,e,$[7],10,1126891415),e=u(e,c,n,o,$[14],15,-1416354905),o=u(o,e,c,n,$[5],21,-57434055),n=u(n,o,e,c,$[12],6,1700485571),c=u(c,n,o,e,$[3],10,-1894986606),e=u(e,c,n,o,$[10],15,-1051523),o=u(o,e,c,n,$[1],21,-2054922799),n=u(n,o,e,c,$[8],6,1873313359),c=u(c,n,o,e,$[15],10,-30611744),e=u(e,c,n,o,$[6],15,-1560198380),o=u(o,e,c,n,$[13],21,1309151649),n=u(n,o,e,c,$[4],6,-145523070),c=u(c,n,o,e,$[11],10,-1120210379),e=u(e,c,n,o,$[2],15,718787259),o=u(o,e,c,n,$[9],21,-343485551),_[0]=a(n,_[0]),_[1]=a(o,_[1]),_[2]=a(e,_[2]),_[3]=a(c,_[3])}function n(_,$,n,r,f,t){return $=a(a($,_),a(r,t)),a($<<f|$>>>32-f,n)}function r(_,$,r,f,t,u,o){return n($&r|~$&f,_,$,t,u,o)}function f(_,$,r,f,t,u,o){return n($&f|r&~f,_,$,t,u,o)}function t(_,$,r,f,t,u,o){return n($^r^f,_,$,t,u,o)}function u(_,$,r,f,t,u,o){return n(r^($|~f),_,$,t,u,o)}function o(_){var $,n=[];for($=0;$<64;$+=4)n[$>>2]=_.charCodeAt($)+(_.charCodeAt($+1)<<8)+(_.charCodeAt($+2)<<16)+(_.charCodeAt($+3)<<24);return n}var e="0123456789abcdef".split("");function c(_){for(var $="",n=0;n<4;n++)$+=e[_>>8*n+4&15]+e[_>>8*n&15];return $}function i(_){return function _($){for(var n=0;n<$.length;n++)$[n]=c($[n]);return $.join("")}(function _(n){txt="";var r,f=n.length,t=[1732584193,-271733879,-1732584194,271733878];for(r=64;r<=n.length;r+=64)$(t,o(n.substring(r-64,r)));n=n.substring(r-64);var u=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(r=0;r<n.length;r++)u[r>>2]|=n.charCodeAt(r)<<(r%4<<3);if(u[r>>2]|=128<<(r%4<<3),r>55)for($(t,u),r=0;r<16;r++)u[r]=0;return u[14]=8*f,$(t,u),t}(_))}function a(_,$){return _+$&4294967295}if("5d41402abc4b2a76b9719d911017c592"!=i("hello"))function a(_,$){var n=(65535&_)+(65535&$);return(_>>16)+($>>16)+(n>>16)<<16|65535&n}return i(_)},

      randString: function (limit) {
        limit = limit || 10;
        let text = "abcdefghijklmnopqrstuvwxyz";
        text = text.charAt(Math.floor(Math.random() * text.length));
        const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < limit - 1; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      },

      // https://stackoverflow.com/a/2117523
      uuid: () => {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
          (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16)
        );
      },
    };

    const token = {
      getToken: async function (email, password) {
        const sim = utils.randBetween(2e4, 4e4);
        let deviceID = utils.uuid();
        let adID = utils.uuid();
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
        let conf = {
          url: "https://b-api.facebook.com/method/auth.login",
          method: "post",
          data: formData,
          transformRequest: [
            function (data, headers) {
              return qs.stringify(data);
            },
          ],
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
        };
        const resp = await axios(conf);
        return resp.data;
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
  },
};
