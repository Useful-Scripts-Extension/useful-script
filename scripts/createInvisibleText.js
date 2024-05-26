export default {
  icon: '<i class="fa-regular fa-eye-slash fa-lg"></i>',
  name: {
    en: "Create invisible text",
    vi: "Tạo tin nhắn tàng hình",
  },
  description: {
    en: "Create invisible text to hide messages. Receiver to use this feature to decode messages.",
    vi: "Tạo tin nhắn tàng hình, giúp ẩn đi thông tin quan trọng, người nhận cần dùng chức năng này để có thể giải mã.",
  },

  changeLogs: {
    "2025-05-26": "init",
  },

  popupScript: {
    onClick: async () => {
      Swal.fire({
        icon: "info",
        title: "Tin nhắn tàng hình",
        text: "Vui lòng chọn",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Tạo tin nhắn",
        denyButtonText: "Giải mã tin nhắn",
      }).then((result) => {
        if (result.isConfirmed) {
          doEncode();
        } else if (result.isDenied) {
          doDecode();
        }
      });

      function doEncode() {
        Swal.fire({
          icon: "question",
          title: "Nhập tin nhắn",
          html: "Đặt ngoặc nhọn >< bao ngoài những nội dung muốn tành hình<br/><br/> Ví dụ: Hôm nay <b>>đi chơi không<</b> trời đẹp quá.",
          input: "textarea",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            let encoded = encode(result.value);
            Swal.fire({
              icon: "success",
              title: "Tạo tin tàng hình thành công",
              html: result.value + "<br/> Bạn hãy copy và sử dụng nhé",
              input: "textarea",
              inputValue: encoded,
            });
          }
        });
      }

      function doDecode() {
        Swal.fire({
          icon: "question",
          title: "Nhập tin nhắn cần giải mã",
          input: "textarea",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            let decoded = decode(result.value);
            if (decoded != result.value) {
              Swal.fire({
                icon: "success",
                title: "Kết quả giải mã",
                text: result.value,
                input: "textarea",
                inputValue: decoded,
              });
            } else {
              Swal.fire({
                icon: "info",
                title: "Tin nhắn này chưa được mã hoá",
                text: result.value,
              });
            }
          }
        });
      }
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
