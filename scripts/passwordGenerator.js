export default {
  icon: `<i class="fa-solid fa-lock fa-lg"></i>`,
  name: {
    en: "Password generator",
    vi: "Tạo mật khẩu cho trang web",
  },
  description: {
    en: "You only have to remember 1 password",
    vi: "Bạn chỉ còn cần phải nhớ 1 mật khẩu",
  },

  pageScript: {
    onClick: function () {
      /*
  It’s a good practice to always use unique passwords while creating accounts on websites, So if one website’s password gets compromised your other accounts are safe.
  If you are not using any password manager like LastPass, Bitwarden or 1Password then it’s really hard to keep track of all the passwords.
  To solve this problem Nic Wolff has created a bookmarklet that will create a unique password for every website you signed up for,
  The only thing you need to remember is 1 master password.
  This bookmarklet will use the currently opened website’s domain name + your master password to create a unique password. This password will always be the same for you as long as your domain name and your master password.
  What’s best about this extension is, if you run this bookmarklet on the sign-up or sign-in page it will automatically fill the password field with generated password.
*/

      var b64pad = "";
      var chrsz = 8;

      function b64_sha1(s) {
        return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
      }

      function core_sha1(x, len) {
        x[len >> 5] |= 0x80 << (24 - len);
        x[(((len + 64) >> 9) << 4) + 15] = len;
        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;
        for (var i = 0; i < x.length; i += 16) {
          var olda = a;
          var oldb = b;
          var oldc = c;
          var oldd = d;
          var olde = e;
          for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(
              safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
              safe_add(safe_add(e, w[j]), sha1_kt(j))
            );
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
          }
          a = safe_add(a, olda);
          b = safe_add(b, oldb);
          c = safe_add(c, oldc);
          d = safe_add(d, oldd);
          e = safe_add(e, olde);
        }
        return Array(a, b, c, d, e);
      }

      function sha1_ft(t, b, c, d) {
        if (t < 20) return (b & c) | (~b & d);
        if (t < 40) return b ^ c ^ d;
        if (t < 60) return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
      }

      function sha1_kt(t) {
        return t < 20
          ? 1518500249
          : t < 40
          ? 1859775393
          : t < 60
          ? -1894007588
          : -899497514;
      }

      function safe_add(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff);
      }

      function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
      }

      function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
          bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i);
        return bin;
      }

      function binb2b64(binarray) {
        var tab =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
          var triplet =
            (((binarray[i >> 2] >> (8 * (3 - (i % 4)))) & 0xff) << 16) |
            (((binarray[(i + 1) >> 2] >> (8 * (3 - ((i + 1) % 4)))) & 0xff) <<
              8) |
            ((binarray[(i + 2) >> 2] >> (8 * (3 - ((i + 2) % 4)))) & 0xff);
          for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> (6 * (3 - j))) & 0x3f);
          }
        }
        return str;
      }

      function doIt() {
        var master = prompt(
          "Tạo mật khẩu cho trang web bất kỳ từ duy nhất 1 Mật_khẩu_Chính\n" +
            " + Nhập vào Mật_khẩu_Chính, trả về cho bạn mật khẩu cho web hiện tại\n" +
            " + Không còn phải nhớ nhiều mật khẩu\n" +
            " + Tự động điền vào trang web khi nhập đúng Mật_khẩu_Chính\n" +
            "\nNhập Mật_khẩu_Chính của bạn:"
        );
        if (master != "" && master != null) {
          host = document.location.href.match(/http(s*):\/\/([^/]+)/)[2];
          if (
            (sld = host.match(
              /([^.]+\.([a-z][a-z][a-z]+|a[^abhjkpvy]|b[^cdklnpqux]|c[^bejkpqsty]|d[ejkmoz]|e[cegsu]|f[imor]|g[^cjkouvxz]|h[kmnrtu]|i[demnoqrst]|j[eop]|k[gimnpryz]|l[abcikrstuvy]|m[^bfijmz]|n[acefgloru]|om|p[aefhklmnrstwy]|qa|r[eosuw]|s[^fpqsw]|t[^abeiqrsuxy]|u[agsyz]|v[aceginu]|w[fs]|yt))$/i
            ))
          ) {
            domain = sld[0];
          } else {
            domain = host.match(/([^.]+\.[^.]+\.[a-z][a-z])$/i)[0];
          }
          var i = 0,
            j = 0,
            p = b64_sha1(master + ":" + domain).substr(0, 13) + "@1a",
            E = document.getElementsByTagName("input"),
            g = false;
          for (j = 0; j < E.length; j++) {
            D = E[j];
            if (D.type == "password") {
              D.value = p;
              D.focus();
              g = true;
            }
            if (D.type == "text") {
              if (
                D.name.toUpperCase().indexOf("PASSWORD") != -1 ||
                D.name.toUpperCase().indexOf("PASSWD") != -1
              ) {
                D.value = p;
                D.focus();
                g = true;
              }
            }
          }
          if (!g) {
            prompt("Mật khẩu cho trang web " + domain + " là:", p);
          }
        }
      }
      doIt();
    },
  },
};
