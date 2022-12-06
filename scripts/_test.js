import { runScriptInCurrentTab } from "./helpers/utils.js";
import scrollToVeryEnd from "./scrollToVeryEnd.js";

export default {
  icon: "",
  name: {
    en: "Test script",
    vi: "Test script",
  },
  description: {
    en: "",
    vi: "",
  },
  runInExtensionContext: false,

  func: async function () {
    function stringifyVariables(d, e) {
      let f = [],
        a;
      for (a in d)
        if (d.hasOwnProperty(a)) {
          let g = e ? e + "[" + a + "]" : a,
            b = d[a];
          f.push(
            null !== b && "object" == typeof b
              ? stringifyVariables(b, g)
              : encodeURIComponent(g) + "=" + encodeURIComponent(b)
          );
        }
      return f.join("&");
    }
    function fetchGraphQl(body) {
      return fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: body,
      });
    }

    // get video from group?
    // let res = await fetchGraphQl(
    //   stringifyVariables({
    //     doc_id: "3972944316164299",
    //     variables: JSON.stringify({
    //       groupID: 364997627165697,
    //       count: 8,
    //       useCometPhotoViewerPlaceholderFrag: !0,
    //       scale: 1.5,
    //     }),
    //     fb_dtsg: require("DTSGInitialData").token,
    //     fb_api_caller_class: "RelayModern",
    //     fb_api_req_friendly_name: "GroupsCometMediaVideosTabGridQuery",
    //   })
    // );
    // let text = await res.json();

    // console.log(text);
  },
};
