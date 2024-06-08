import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-regular fa-eye-slash fa-lg"></i>',
  name: {
    en: "Create invisible message",
    vi: "Tạo tin nhắn tàng hình",
  },
  description: {
    en: "Create invisible text to hide secret messages. Receiver to use this feature to decode messages.",
    vi: "Tạo tin nhắn tàng hình, giúp ẩn đi thông tin quan trọng, người nhận cần dùng chức năng này để có thể giải mã.",
  },
  badges: [BADGES.new],
  buttons: [
    {
      icon: '<i class="fa-solid fa-mobile-screen"></i>',
      name: {
        en: "Web version",
        vi: "Phiên bản web",
      },
      onClick: () =>
        window.open(
          "https://hoangtran0410.github.io/useful-script/scripts/createInvisibleText.html"
        ),
    },
  ],

  changeLogs: {
    "2025-05-26": "init",
  },

  popupScript: {
    onClick: async () => {
      const { t } = await import("../popup/helpers/lang.js");
      let result = await Swal.fire({
        icon: "info",
        title: t({ vi: "Tin nhắn tàng hình", en: "Invisible messages" }),
        text: t({ vi: "Vui lòng chọn", en: "Please choose" }),
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: t({ vi: "Tạo tin nhắn", en: "Create message" }),
        denyButtonText: t({ vi: "Giải mã tin nhắn", en: "Decode message" }),
      });

      if (result.isConfirmed) {
        await doEncode();
      } else if (result.isDenied) {
        await doDecode();
      }

      async function doEncode() {
        let result = await Swal.fire({
          icon: "question",
          title: t({ vi: "Nhập tin nhắn", en: "Enter message" }),
          html: t({
            vi: "Đặt ngoặc nhọn >< bao ngoài những nội dung muốn tàng hình<br/><br/> Ví dụ: Gọi tôi <b>>0123456789<</b> là Hoang.",
            en: "Wrap text in >< to hide messages<br/><br/> Example: Call me <b>>0123456789, abc street<</b> Jane.",
          }),
          input: "textarea",
          showCancelButton: true,
        });
        if (result.isConfirmed) {
          let encoded = encode(result.value);
          await Swal.fire({
            icon: "success",
            title: t({
              vi: "Tạo tin tàng hình thành công",
              en: "Create invisible message successfully",
            }),
            html:
              result.value +
              "<br/><br/>" +
              t({
                vi: " Bạn hãy copy và sử dụng nhé",
                en: " Please copy and use",
              }),
            input: "textarea",
            inputValue: encoded,
          });
        }
      }

      async function doDecode() {
        let result = await Swal.fire({
          icon: "question",
          title: t({
            vi: "Nhập tin nhắn cần giải mã",
            en: "Enter message to decode",
          }),
          input: "textarea",
          showCancelButton: true,
        });
        if (result.isConfirmed) {
          let decoded = decode(result.value);
          if (decoded != result.value) {
            await Swal.fire({
              icon: "success",
              title: t({ vi: "Kết quả giải mã", en: "Decoded message" }),
              text: result.value,
              input: "textarea",
              inputValue: decoded,
            });
          } else {
            await Swal.fire({
              icon: "info",
              title: t({
                vi: "Tin nhắn này không có nội dung tàng hình",
                en: "This message has no invisible content",
              }),
              text: result.value,
            });
          }
        }
      }
    },
  },
  backgroundScript: {
    runtime: {
      onInstalled: (reason, context) => {
        const folder_id = "create-invisible-text";
        const contexts = ["selection", "link", "editable"];
        [
          {
            id: folder_id,
            title: "Invisible text",
            contexts,
            parentId: "root",
          },
          { id: "encode", title: "Encode", contexts, parentId: folder_id },
          { id: "decode", title: "Decode", contexts, parentId: folder_id },
        ].forEach((item) => {
          chrome.contextMenus.create({
            title: item.title,
            contexts: item.contexts,
            id: item.id,
            parentId: item.parentId,
          });
        });
      },
    },
    contextMenus: {
      onClicked: ({ info, tab }, context) => {
        if (info.parentMenuItemId === "create-invisible-text") {
          let text = info.selectionText || info.linkUrl;
          if (text) {
            let res =
              info.menuItemId === "encode"
                ? encode("hidden: >" + text + "<")
                : decode(text);
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (text) => {
                try {
                  navigator.clipboard.writeText(text);
                } catch (err) {
                  console.log("Failed to copy text to clipboard:", err);
                }
                prompt(`Useful Script - Invisible text - copy to use:`, text);
              },
              args: [res],
            });
          }
        }
      },
    },
  },
};

const PADDING_START = "\u200c";
const PADDING_END = "\u{e0061}";
const CHARS = [
  // "\u200d",
  // "\u{e0061}",
  "\u{e0062}",
  "\u{e0063}",
  "\u{e0064}",
  "\u{e0065}",
  "\u{e0066}",
  "\u{e0067}",
  "\u{e0068}",
  "\u{e0069}",
  "\u{e006a}",
  "\u{e006b}",
  "\u{e006c}",
  "\u{e006d}",
  "\u{e006e}",
  "\u{e006f}",
  "\u{e0070}",
  "\u{e0071}",
  "\u{e0072}",
  "\u{e0073}",
  "\u{e0074}",
  "\u{e0075}",
  "\u{e0076}",
  "\u{e0077}",
  "\u{e0078}",
  "\u{e0079}",
  "\u{e007a}",
  "\u{e007f}",
];
export const shouldEncodePattern = / *>(.+?)< */;
const encodedPattern = new RegExp(
  `${PADDING_START}([${CHARS.join("")}]+?)${PADDING_END}`
);
const CHARS_MAP = CHARS.reduce((curr, val, i) => {
  curr[val] = i;
  return curr;
}, {});
const lenCalc = (base, chars) => {
  var len = 0;
  var curr = 1;
  while (curr < chars) {
    curr *= base;
    len++;
  }
  return len;
};
const UNICODE_CHARS = 1114112;
const BASE = CHARS.length;
const LEN = lenCalc(BASE, UNICODE_CHARS);
const charConvert = (char) => {
  let charCode = char.codePointAt(0);
  let arr = [];
  while (charCode > 0) {
    arr.push(charCode % BASE);
    charCode = ~~(charCode / BASE);
  }
  while (arr.length < LEN) {
    arr.push(0);
  }
  return arr.reverse();
};
const charEncode = (convertedChar) => {
  return convertedChar.reduce((curr, digit) => curr + CHARS[digit], "");
};
const _encode = (s) => {
  let converted = [];
  for (let c of s) {
    converted.push(charConvert(c));
  }
  let res = converted.map(charEncode);
  return PADDING_START + res.join("") + PADDING_END;
};
export const encode = (text) => {
  let matches = shouldEncodePattern.exec(text);
  if (!matches) return text;
  return text.replace(shouldEncodePattern, " " + _encode(matches[1]));
};
const decodeChar = (encodedChar) => {
  encodedChar = encodedChar.reverse();
  let curr = 1;
  let charCode = 0;
  for (let digit of encodedChar) {
    charCode += digit * curr;
    curr *= BASE;
  }
  return String.fromCodePoint(charCode);
};
const _decode = (s) => {
  s = encodedPattern.exec(s)[1];
  let curr = [];
  let res = "";
  for (let c of s) {
    curr.push(CHARS_MAP[c]);
    if (curr.length >= LEN) {
      res += decodeChar(curr);
      curr = [];
    }
  }
  return res;
};
export const decode = (text) => {
  if (!canDecode(text)) return text;
  return text.replace(encodedPattern, `>${_decode(text)}<`);
};

const canDecode = (text) => {
  return encodedPattern.test(text);
};
const canEncode = (s) => {
  //console.log(s);
  return encodedPattern.exec(s);
};
