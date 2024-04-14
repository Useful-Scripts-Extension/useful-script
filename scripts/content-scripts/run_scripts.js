// Để script thực thi ngay sau khi inject, thì cần hạn chế tối đa việc await import các file js khác
// Do await import sẽ tốn 1 khoảng thời gian nhỏ, từ đó script cần chạy sẽ ko chạy đúng thời điểm
// Đặc biệt là thời điểm document_start, lỡ await 1 nhịp là script của trang web sẽ chạy trước script của extension
// Làm cho chức năng chạy không còn chính xác, hoặc ko chạy luôn :)

// Do đó các hàm cần thiết nên ghi hết vào trong file này
// Kể cả việc nó đã được viết ở file khác (utils, helper, ...)
// Quá trình maintain sẽ khó hơn 1 chút, nhưng script sẽ chạy chính xác hơn

(async () => {
  let ids = [],
    path = "";

  // run script on receive event
  window.addEventListener("ufs-run-page-scripts", ({ detail }) => {
    console.log("ufs-run-page-scripts", detail);
    runScripts(ids, detail.event, path);
  });

  // auto run documentStart
  try {
    const res = JSON.parse(localStorage.getItem("ufs_active_scripts") || "{}");
    ids = res?.ids?.split(",") || [];
    path = res?.path || "";
  } catch (e) {
    console.log("ERRO ufs", e);
  }

  if (!ids || !path) {
    const data = await UfsGlobal?.Extension?.getActiveScripts?.();
    ids = data?.ids?.split(",") || [];
    path = data?.path || "";
  }

  console.log("ufs auto_run scripts: ", ids);

  // auto run documentStart
  if (ids) {
    runScripts(ids, "onDocumentStart", path);
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
    let inWhiteList = matchOneOfPatterns(url, script.whiteList || []);
    let inBlackList = matchOneOfPatterns(url, script.blackList || []);
    return (
      (!hasWhiteList && !hasBlackList) ||
      (hasWhiteList && inWhiteList) ||
      (hasBlackList && !inBlackList)
    );
  }

  function matchOneOfPatterns(url, patterns) {
    for (let pattern of patterns) {
      const regex = new RegExp(
        "^" +
          pattern
            .split("*")
            .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join(".*") +
          "$"
      );
      if (regex.test(url)) return true;
    }
    return false;
  }
})();
