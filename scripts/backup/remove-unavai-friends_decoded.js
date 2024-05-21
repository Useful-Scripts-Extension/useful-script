// tool to use: https://deobfuscate.relative.im/

let delayTime = 3,
  unfriendLockedUser = confirm(
    "Bạn có muốn xóa những bạn bè đã bị khóa tài khoản?"
  ),
  unfriendDeactivatedUser = confirm(
    "Bạn có muốn xóa những bạn bè đã ẩn tài khoản Facebook (khóa tạm thời)?"
  ),
  fbDtsg = require("DTSGInitialData").token,
  uid = document.cookie
    .split(";")
    .find((_) => _.includes("c_user"))
    .split("=")[1];
(unfriendLockedUser || unfriendDeactivatedUser) &&
  (async () => {
    console.log("---------------------------");
    console.log("Script by Jayremnt based on Monokai's Source Kit, 2021.");
    console.log("Improved by MonokaiJs.");
    console.log("Remove locked and deactivated users.");
    console.log("---------------------------");
    console.warn(
      'Để tạm dừng hoạt đồng, mở tab "Sources" và nhấn F8 hoặc Ctrl + \\.'
    );
    console.log("Đang bắt đầu...");
    console.log("Lấy danh sách các tài khoản đã bị khóa và ẩn...");
    // if (new Date().getTime() > parseInt("17B26B4FA80", 16)) {
    //   return;
    // }
    let lockedAccounts = [],
      hiddenAccounts = [],
      allEdges = [],
      loadPage = async (cursor) => {
        const friendList = await loadFriendsList(cursor);
        let edges = friendList.edges,
          page_info = friendList.page_info;
        allEdges = allEdges.concat(edges);
        edges.forEach((edge) => {
          !edge.node.subtitle_text &&
            (edge.node.url
              ? lockedAccounts.push({
                  id: edge.node.actions_renderer.action.profile_owner.id,
                  name: edge.node.title.text,
                  url: edge.node.url,
                })
              : hiddenAccounts.push({
                  id: edge.node.actions_renderer.action.profile_owner.id,
                  name: edge.node.title.text,
                  url: edge.node.url,
                }));
        });
        console.log(
          "\uD83D\uDD04 Đã tải được " +
            allEdges.length +
            " người. Phát hiện " +
            lockedAccounts.length +
            " tài khoản bị khóa và " +
            hiddenAccounts.length +
            " người đã ẩn tài khoản. Tiếp tục lấy dữ liệu..."
        );
        page_info.has_next_page && page_info.end_cursor
          ? loadPage(page_info.end_cursor)
          : (console.log("Đã tải xong, bắt đầu thực hiện hủy kết bạn..."),
            (async () => {
              // Mon Aug 09 2021 ? - backdoor làm tiền à :) tới ngày này là dừng hoạt động
              // if (new Date().getTime() > 1628442000000) {
              //   return;
              // }
              if (unfriendLockedUser) {
                let count = 1;
                console.log("➡ Bắt đầu hủy kết bạn...");
                for (const acc of lockedAccounts) {
                  await unfriend(acc.id);
                  console.log(
                    "👉 Đã hủy kết bạn với " +
                      acc.name +
                      ". " +
                      (lockedAccounts.length - count) +
                      " người còn lại..."
                  );
                  count++;
                  await new Promise((resolve) => {
                    setTimeout(resolve, delayTime * 1000);
                  });
                }
              }
              if (unfriendDeactivatedUser) {
                let count = 1;
                console.log(
                  "➡ Bắt đầu hủy kết bạn với nhữn người đã khóa tài khoản..."
                );
                for (const acc of hiddenAccounts) {
                  await unfriend(acc.id);
                  console.log(
                    "👉 Đã hủy kết bạn với " +
                      acc.name +
                      ". " +
                      (hiddenAccounts.length - count) +
                      " người còn lại..."
                  );
                  count++;
                  await new Promise((resolve) => {
                    setTimeout(resolve, delayTime * 1000);
                  });
                }
              }
              console.log("\uD83D\uDC4C Hoàn tất!");
            })());
      };
    loadPage("");
  })();
function loadFriendsList(cursor = "", count = 8) {
  // if (new Date().getTime() > parseInt("17B26B4FA80", 16)) {
  //   return;
  // }
  return new Promise((resolve, reject) => {
    request("POST", "https://www.facebook.com/api/graphql/", {
      fb_dtsg: fbDtsg,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name:
        "ProfileCometAppCollectionListRendererPaginationQuery",
      variables: JSON.stringify({
        count: count,
        cursor: cursor,
        scale: 1.5,
        id: btoa("app_collection:" + uid + ":2356318349:2"),
      }),
      doc_id: 4186250744800382,
    })
      .then((res) => {
        try {
          let items = JSON.parse(res).data.node.pageItems;
          resolve(items);
        } catch (e) {
          reject(e);
        }
      })
      .catch(reject);
  });
}
function unfriend(uid) {
  // if (new Date().getTime() > parseInt("17B26B4FA80", 16)) {
  //   return;
  // }
  return new Promise((resolve, reject) => {
    request("POST", "https://www.facebook.com/api/graphql/", {
      fb_dtsg: fbDtsg,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: "FriendingCometUnfriendMutation",
      variables: JSON.stringify({
        input: {
          source: "bd_profile_button",
          unfriended_user_id: uid,
          actor_id: uid,
          client_mutation_id: "1",
        },
        scale: 1.5,
      }),
      doc_id: 4281078165250156,
    })
      .then(resolve)
      .catch(reject);
  });
}
function request(method, url, params) {
  // if (new Date().getTime() > parseInt("17B26B4FA80", 16)) {
  //   return;
  // }
  let form = new FormData();
  method = method.toUpperCase();
  if (method === "POST") {
    for (const key in params) {
      form.append(
        key,
        typeof params[key] === "string"
          ? params[key]
          : JSON.stringify(params[key])
      );
    }
  } else {
    if (method === "GET" && typeof params !== "undefined") {
      url += "?";
      for (const key in params) {
        url += key + "=" + encodeURI(params[key]) + "&";
      }
    }
  }
  return new Promise((resolve, reject) => {
    const r = new XMLHttpRequest();
    r.responseType = "text";
    try {
      r.open(method, url);
      r.send(form);
      r.onreadystatechange = function () {
        if (r.readyState === 4) {
          if (r.status !== 200) {
            reject("Error: " + r.status);
          } else {
            resolve(r.responseText);
          }
        }
      };
    } catch (e) {
      reject(e);
    }
  });
}
