// Để script thực thi ngay sau khi inject, thì cần hạn chế tối đa việc await import các file js khác
// Do await import sẽ tốn 1 khoảng thời gian nhỏ, từ đó script cần chạy sẽ ko chạy đúng thời điểm
// Đặc biệt là thời điểm document_start, lỡ await 1 nhịp là script của trang web sẽ chạy trước script của extension
// Làm cho chức năng chạy không còn chính xác, hoặc ko chạy luôn :)

// Do đó các hàm cần thiết nên ghi hết vào trong file này
// Kể cả việc nó đã được viết ở file khác (utils, helper, ...)
// Quá trình maintain sẽ khó hơn 1 chút, nhưng script sẽ chạy chính xác hơn

(() => {
  // let search = new URLSearchParams(getCurrentScriptSrc().split("?")?.[1]);
  // let path = search.get("path");

  let { path, ids, event } = JSON.parse(
    localStorage.getItem("ufs-auto-run-scripts") ?? "{}"
  );

  // run script on receive event
  window.addEventListener("ufs-run-page-scripts", ({ detail }) => {
    const { event, ids } = detail;
    runScripts(ids, event, path);
  });

  // auto run initial event defined in URL search params
  if (ids && event) {
    let scriptIds = ids.split(",");
    runScripts(scriptIds, event, path);
  }
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
  for (let id of scriptIds.filter((_) => _)) {
    let scriptPath = `${path}/${id}.js`;
    import(scriptPath)
      .then(({ default: script }) => {
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
      })
      .catch((e) => {
        console.log("ERROR import script ", e);
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

function matchPatterns(url, patterns) {
  for (let pattern of patterns) {
    // Replace wildcard characters * with regex wildcard .*
    const regexRule = pattern.replace(/\*/g, ".*");
    // Create a regex pattern from the rule
    const reg = new RegExp("^" + regexRule + "$");
    // Check if the URL matches the pattern
    if (!reg.test(url)) return false;
  }
  return true;
}
