// Để script thực thi ngay sau khi inject, thì cần hạn chế tối đa việc await import các file js khác
// Do await import sẽ tốn 1 khoảng thời gian nhỏ, từ đó script cần chạy sẽ ko chạy đúng thời điểm
// Đặc biệt là thời điểm document_start, lỡ await 1 nhịp là script của trang web sẽ chạy trước script của extension
// Làm cho chức năng chạy không còn chính xác, hoặc ko chạy luôn :)

// Do đó các hàm cần thiết nên ghi hết vào trong file này
// Kể cả việc nó đã được viết ở file khác (utils, helper, ...)
// Quá trình maintain sẽ khó hơn 1 chút, nhưng script sẽ chạy chính xác hơn

(async () => {
  const CACHED = {};
  const storage_key = "ufs_active_scripts";

  // run script on receive event
  window.addEventListener("ufs-run-page-scripts", async ({ detail }) => {
    console.log("ufs-run-page-scripts", detail);
    const { ids, path } = await getActiveScripts();
    runScripts(ids, detail.event, path);
  });

  // save active script before unload
  window.addEventListener("beforeunload", () => {
    saveActiveScript();
  });

  main();

  async function main() {
    const { ids, path } = await getActiveScripts();
    runScripts(ids, "onDocumentStart", path);
  }

  async function getActiveScripts() {
    if (!CACHED[storage_key]) {
      try {
        let ids, path;
        // const res = JSON.parse(localStorage.getItem(storage_key) || "{}");
        // ids = res?.ids;
        // path = res?.path || "";
        // if (typeof ids === "string") ids = ids.split(",");

        if (!ids || !path) {
          const data = await UfsGlobal?.Extension?.getActiveScripts?.();
          ids = data?.ids || [];
          path = data?.path || "";
        }

        CACHED[storage_key] = { ids, path };
        saveActiveScript();
      } catch (e) {
        console.log("ERRO ufs", e);
      }
    }
    return CACHED[storage_key];
  }

  function saveActiveScript() {
    try {
      localStorage.setItem(storage_key, JSON.stringify(CACHED[storage_key]));
    } catch (e) {
      console.log("SAVE active script ERROR: ", e);
    }
  }

  function runScripts(scriptIds, event, path) {
    console.log("scriptids", scriptIds, event, path);
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
