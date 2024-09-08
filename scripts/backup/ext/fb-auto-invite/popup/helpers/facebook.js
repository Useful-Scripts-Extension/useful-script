const CACHED = {
  uid: null,
  fb_dtsg: null,
};

export async function getMyUid() {
  if (CACHED.uid) return CACHED.uid;
  const d = await runExtFunc("chrome.cookies.get", [
    { url: "https://www.facebook.com", name: "c_user" },
  ]);
  CACHED.uid = d?.value;
  return CACHED.uid;
}

export async function fetchGraphQl(params, url) {
  let query = "";
  if (typeof params === "string") query = "&q=" + encodeURIComponent(params);
  else
    query = wrapGraphQlParams({
      dpr: 1,
      __a: 1,
      __aaid: 0,
      __ccg: "GOOD",
      server_timestamps: true,
      ...params,
    });

  const res = await fetch(url || "https://www.facebook.com/api/graphql/", {
    body: query + "&fb_dtsg=" + (await getFbDtsg()),
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",
  });
  const text = await res.text();

  // check error response
  try {
    const json = JSON.parse(text);
    if (json.errors) {
      const { summary, message, description_raw } = json.errors[0];
      if (summary) {
        console.log(json);

        const div = document.createElement("div");
        div.innerHTML = description_raw?.__html;
        const description = div.innerText;

        // notification.error({
        //   message: i18n.t("Facebook response Error"),
        //   description: summary + ". " + message + ". " + description,
        //   duration: 0,
        // });
      }
    }
  } catch (e) {}

  return text;
}

export function wrapGraphQlParams(params = {}) {
  const formBody = [];
  for (const property in params) {
    const encodedKey = encodeURIComponent(property);
    const value =
      typeof params[property] === "string"
        ? params[property]
        : JSON.stringify(params[property]);
    const encodedValue = encodeURIComponent(value);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

export async function getFbDtsg() {
  if (CACHED.fb_dtsg) return CACHED.fb_dtsg;
  let res = await fetch("https://mbasic.facebook.com/photos/upload/");
  let text = await res.text();
  let dtsg = RegExp(/name="fb_dtsg" value="(.*?)"/).exec(text)?.[1];
  if (!dtsg) {
    res = await fetch("https://m.facebook.com/home.php", {
      headers: {
        Accept: "text/html",
      },
    });
    text = res.text();
    dtsg =
      RegExp(/"dtsg":{"token":"([^"]+)"/).exec(text)?.[1] ||
      RegExp(/"name":"fb_dtsg","value":"([^"]+)/).exec(text)?.[1];
  }
  CACHED.fb_dtsg = dtsg || null;
  return CACHED.fb_dtsg;
}

export function findDataObject(object) {
  if (!object) return null;

  // Check if the current object has edges and page_info properties
  if (object.edges && object.page_info) return object;

  for (let key in object) {
    if (typeof object[key] === "object" && object[key] !== null) {
      let found = findDataObject(object[key]);
      if (found) return found;
    }
  }
  return null;
}
