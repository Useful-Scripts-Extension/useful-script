export default {
  icon: "https://lh3.googleusercontent.com/xwarvPJ490JDNBNlB4_nVOE3KEs-A6xI07luVNP--iQ7kipstjiSHf-S1rofE-ji9E0clqa_vkivURh42UOA3uXsmHw=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Unshorten link",
    vi: "Giải mã link rút gọn",
  },
  description: {
    en: "Get origin URL of shortened url",
    vi: "Lấy link gốc của link rút gọn",
  },
  runInExtensionContext: true,

  func: async function () {
    // Để script này hoạt động được, cần thêm rule modify header referer
    // Chi tiết xem trong file rules.json

    // https://unshorten.it/

    async function getToken() {
      let res = await fetch("https://unshorten.it/");
      let text = await res.text();
      let token = /name='csrfmiddlewaretoken' value='(.*)'/.exec(text)?.[1];
      return token;
    }

    async function getLongUrl(shortURL, token) {
      let formData = new FormData();
      formData.append("short-url", shortURL);
      formData.append("csrfmiddlewaretoken", token);

      let res = await fetch("https://unshorten.it/main/get_long_url", {
        method: "POST",
        body: formData,
      });
      let json = await res.json();
      if (json?.success) {
        return json.long_url;
      } else {
        alert(json.message);
        return null;
      }
    }

    let shortenURL = prompt("Nhập URL đã rút gọn: ");
    if (shortenURL) {
      // faster way: open unshorten.it page
      //   return window.open(
      //     "http://unshorten.it/extensionloading.php?shortURL=" +
      //       shortenURL +
      //       "&source=chromeextension"
      //   );

      try {
        let token = await getToken();
        console.log(token);
        let long_url = await getLongUrl(shortenURL, token);

        if (long_url) prompt("Link gốc của " + shortenURL, long_url);
        else alert("Không tìm thấy link gốc");
      } catch (e) {
        alert("Lỗi: " + e);
      }
    }
  },
};

// modify header referer in manifest v3
// https://stackoverflow.com/a/72739149/11898496

// manifest v2 only, background script only
// https://stackoverflow.com/a/31003808/11898496
// https://stackoverflow.com/a/56141157/11898496
// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function (details) {
//     let headers = details.requestHeaders;
//     headers.push({
//       name: "Referer",
//       value: "https://unshorten.it/",
//     });
//     console.log(headers);
//     return { requestHeaders: headers };
//   },
//   { urls: ["https://unshorten.it/main/get_long_url"] },
//   ["blocking", "requestHeaders", "extraHeaders"]
// );
