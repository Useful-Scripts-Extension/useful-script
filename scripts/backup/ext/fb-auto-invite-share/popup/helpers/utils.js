export function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function deepFindKeyInObject(object, key, once = true) {
  if (!object || typeof object !== "object") return null;
  if (key in object) {
    return object[key];
  }
  const result = [];
  for (let prop in object) {
    const found = deepFindKeyInObject(object[prop], key, once);
    if (found) {
      if (once) return found;
      result.push(found);
    }
  }
  return once ? null : result.flat();
}

const CACHED = {
  redirect: {},
};
export async function getRedirectedUrl(url) {
  if (CACHED.redirect[url]) return CACHED.redirect[url];
  try {
    let _url = url;
    let done = false;
    while (!done) {
      let res = await fetch(url, { method: "HEAD" });
      console.log(res);
      if (res?.redirected && res.url && res.url !== url) {
        console.log("redirected:", url, "->", res.url);
        url = res.url;
      } else {
        done = true;
        CACHED.redirect[_url] = url;
        return url;
      }
    }
  } catch (e) {
    console.log("ERROR:", e);
    return url;
  }
}
