// Để script thực thi ngay sau khi inject, thì cần hạn chế tối đa việc await import các file js khác
// Do await import sẽ tốn 1 khoảng thời gian nhỏ, từ đó script cần chạy sẽ ko chạy đúng thời điểm
// Đặc biệt là thời điểm document_start, lỡ await 1 nhịp là script của trang web sẽ chạy trước script của extension
// Làm cho chức năng chạy không còn chính xác, hoặc ko chạy luôn :)

// Do đó các hàm cần thiết nên ghi hết vào trong file này
// Kể cả việc nó đã được viết ở file khác (utils, helper, ...)
// Qúa trình maintain sẽ khó hơn 1 chút, nhưng script sẽ chạy chính xác hơn

(async () => {
  const params = new URLSearchParams(
    document.currentScript.src.split("?")?.[1]
  );

  let ids = params.get("ids");
  let path = params.get("path");
  let event = params.get("event");

  if (ids) {
    let scriptIds = ids.split(",");

    for (let id of scriptIds) {
      // import and run script with event name
      import(`${path}/${id}.js`).then((module) => {
        try {
          let script = module.default;
          if (typeof script[event] === "function" && checkWillRun(script)) {
            console.log("> Useful-script: Run script " + id, script);
            script[event]();
          }
        } catch (e) {
          console.log("ERROR run script " + id, e);
        }
      });
    }
  }
})();

function matchPattern(url, pattern) {
  if (pattern.indexOf("*") < 0)
    return new URL(url).toString() == new URL(pattern).toString();

  let curIndex = 0,
    visiblePartsInPattern = pattern.split("*").filter((_) => _ !== "");
  for (let p of visiblePartsInPattern) {
    let index = url.indexOf(p, curIndex);
    if (index < 0) return false;
    curIndex = index + p.length;
  }
  return true;
}
function matchPatterns(url, patterns) {
  for (let p of patterns) {
    if (!matchPattern(url, p)) {
      return false;
    }
  }
  return true;
}
function checkWillRun(script) {
  let url = location.href;
  let hasWhiteList = script.whiteList?.length > 0;
  let hasBlackList = script.blackList?.length > 0;
  let inWhiteList = matchPatterns(url, script.whiteList ?? []);
  let inBlackList = matchPatterns(url, script.blackList ?? []);
  return (
    (!hasWhiteList && !hasBlackList) ||
    (hasWhiteList && inWhiteList) ||
    (hasBlackList && !inBlackList)
  );
}
