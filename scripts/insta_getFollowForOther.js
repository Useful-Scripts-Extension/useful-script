import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: '<i class="fa-solid fa-user-secret fa-lg"></i>',
  name: {
    en: "Insta - Export all following/followers",
    vi: "Insta - Tải tất cả following/follower",
  },
  description: {
    en: "Know about your (or your friends's) following / followers on instagram. Export to json file",
    vi: "Biết bạn bè của bạn (hoặc chính bạn) đang follow những ai / được ai follow trên instagram. Tải về file json",
  },
  whiteList: ["https://www.instagram.com/*"],

  popupScript: {
    onClick: async function () {
      const { getUidFromUsername, getCrftoken } = await import(
        "./insta_GLOBAL.js"
      );
      const { showLoading, runScriptInCurrentTab } = await import(
        "./helpers/utils.js"
      );
      const { t } = await import("../popup/helpers/lang.js");

      let username = prompt(t({ vi: "Nhập username", en: "Enter username" }));
      if (!username) return;

      const { closeLoading, setLoadingText } = showLoading(
        t({ vi: "Đang tìm uid...", en: "Finding uid..." })
      );

      try {
        let uid = await getUidFromUsername(username);

        if (!uid)
          throw new Error(
            t({
              vi: "Không tìm thấy uid cho user " + username,
              en: "Can't find uid for " + username,
            })
          );

        setLoadingText(t({ vi: "Đang tìm token...", en: "Finding token..." }));
        let csrftoken = await runScriptInCurrentTab(getCrftoken);
        if (!csrftoken) throw new Error("Can't get csrftoken");

        let type = prompt(
          t({
            vi: "Bạn muốn tải gì?\n1: followers (được ai follow)\n2: following (đang follow ai)",
            en: "Which one do you want to download?\n1: followers\n2: following",
          }),
          1
        );
        if (!type) return;
        let typename = type == 1 ? "followers" : "following";

        let limit = prompt(
          t({
            vi: "Tải tối đa bao nhiêu kết quả? (nhập 0 để tải hết)",
            en: "How many results do you want to download? (enter 0 to download all)",
          }),
          0
        );
        if (limit == null) return;

        runScriptInCurrentTab(
          async ({ username, typename, uid, csrftoken, limit }) => {
            let scriptPath = await UfsGlobal.Extension.getURL(
              "/scripts/insta_GLOBAL.js"
            );
            const { getAllFollow } = await import(scriptPath);

            const notify = UfsGlobal.DOM.notify({
              msg: "Đang tải " + typename + " của " + username,
              duration: 99999999,
            });
            try {
              let data = await getAllFollow({
                type: typename,
                uid,
                csrftoken,
                limit,
                progressCallback: ({ total, current, data }) => {
                  console.log(data);
                  notify.setText(
                    `Đang tải ${typename} của ${username}: ${current}/${total}...`
                  );
                },
              });

              console.log(data);
              if (!data?.length) throw new Error("No Data");

              UfsGlobal.Utils.downloadData(
                JSON.stringify(data, null, 4),
                `${username}_${typename}.json`
              );
            } catch (e) {
              console.error(e);
              alert("ERROR " + e);
            } finally {
              notify.remove();
            }
          },
          [{ username, typename, uid, csrftoken, limit }]
        );
      } catch (e) {
        alert("ERROR " + e);
      } finally {
        closeLoading();
      }
    },
  },
};
