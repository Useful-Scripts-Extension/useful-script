// Để script thực thi ngay sau khi inject, thì cần hạn chế tối đa việc await import các file js khác
// Do await import sẽ tốn 1 khoảng thời gian nhỏ, từ đó script cần chạy sẽ ko chạy đúng thời điểm
// Đặc biệt là thời điểm document_start, lỡ await 1 nhịp là script của trang web sẽ chạy trước script của extension
// Làm cho chức năng chạy không còn chính xác, hoặc ko chạy luôn :)

// Do đó các hàm cần thiết nên ghi hết vào trong file này
// Kể cả việc nó đã được viết ở file khác (utils, helper, ...)
// Quá trình maintain sẽ khó hơn 1 chút, nhưng script sẽ chạy chính xác hơn

(() => {
  let search = new URLSearchParams(getCurrentScriptSrc().split("?")?.[1]);
  let path = search.get("path");

  // run script on receive event
  window.addEventListener("ufs-run-page-scripts", ({ detail }) => {
    const { event, ids } = detail;
    runScripts(ids, event, path);
  });

  // auto run initial event defined in URL search params
  (() => {
    let ids = search.get("ids");
    let event = search.get("event");
    if (ids && event) {
      let scriptIds = ids.split(",");
      runScripts(scriptIds, event, path);
    }
  })();
})();

function getCurrentScriptSrc() {
  try {
    // cannot get currentScript if script type is module: https://stackoverflow.com/a/45845801/11898496
    // return import.meta.url;
    throw false;
  } catch (e) {
    return document.currentScript.src;
  }
}

function runScripts(scriptIds, event, path) {
  for (let id of scriptIds) {
    let scriptPath = `${path}/${id}.js`;
    import(scriptPath).then(({ default: script }) => {
      try {
        if (
          event in script &&
          typeof script[event] === "function" &&
          checkWillRun(script)
        ) {
          console.log("> Useful-script: Run script " + id + " " + event);
          script[event]();
        }
      } catch (e) {
        console.log("ERROR run script " + id + " " + event, e);
      }
    });
  }
}

function checkWillRun(script) {
  let url = location.href;
  let hasWhiteList = script.whiteList?.length > 0;
  let hasBlackList = script.blackList?.length > 0;
  let inWhiteList = matchPatterns(url, script.whiteList || []);
  let inBlackList = matchPatterns(url, script.blackList || []);
  return (
    (!hasWhiteList && !hasBlackList) ||
    (hasWhiteList && inWhiteList) ||
    (hasBlackList && !inBlackList)
  );
}

// Source: https://github.com/fregante/webext-patterns/blob/main/index.ts
function matchPatterns(url, patterns) {
  const patternValidationRegex =
    /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/;
  const isFirefox =
    typeof navigator === "object" && navigator.userAgent.includes("Firefox/");
  const allStarsRegex = isFirefox
    ? /^(https?|wss?):[/][/][^/]+([/].*)?$/
    : /^https?:[/][/][^/]+([/].*)?$/;
  const allUrlsRegex = /^(https?|file|ftp):[/]+/;

  function getRawPatternRegex(pattern) {
    if (!patternValidationRegex.test(pattern))
      throw new Error(
        pattern +
          " is an invalid pattern, it must match " +
          String(patternValidationRegex)
      );
    let [, protocol, host, pathname] = pattern.split(/(^[^:]+:[/][/])([^/]+)?/);
    protocol = protocol
      .replace("*", isFirefox ? "(https?|wss?)" : "https?")
      .replace(/[/]/g, "[/]");
    host = (host ?? "")
      .replace(/^[*][.]/, "([^/]+.)*")
      .replace(/^[*]$/, "[^/]+")
      .replace(/[.]/g, "[.]")
      .replace(/[*]$/g, "[^.]+");
    pathname = pathname
      .replace(/[/]/g, "[/]")
      .replace(/[.]/g, "[.]")
      .replace(/[*]/g, ".*");
    return "^" + protocol + host + "(" + pathname + ")?$";
  }

  function patternToRegex(matchPatterns) {
    if (matchPatterns.length === 0) return /$./;
    if (matchPatterns.includes("<all_urls>")) return allUrlsRegex;
    if (matchPatterns.includes("*://*/*")) return allStarsRegex;
    return new RegExp(
      matchPatterns.map((x) => getRawPatternRegex(x)).join("|")
    );
  }

  return patternToRegex(patterns).test(url);
}
