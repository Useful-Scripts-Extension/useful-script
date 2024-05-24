import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  name: {
    en: "Get all fb User ID from group",
    vi: "Lấy tất cả fb user ID từ group",
  },
  description: {
    en: "Get id of all user from group members facebook",
    vi: "Lấy id của tất cả user từ group facebook",
  },

  changeLogs: {
    "2024-04-27": "fixed - new api",
  },

  whiteList: ["https://*.facebook.com/*"],

  pageScript: {
    onClick: async function () {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      function getGroupId() {
        try {
          return require("CometRouteStore").getRoute(location.pathname)
            ?.rootView.props?.groupID;
        } catch (e) {
          console.error(e);
        }
        return null;
      }

      function prepareData({ dtsg: fb_dtsg, groupID, cursor }) {
        const variables = JSON.stringify({
          count: 10,
          cursor: cursor,
          groupID: groupID,
          membershipType: "MEMBER",
          scale: 1,
          search: null,
          statusStaticFilter: null,
          id: groupID,
        });
        const data = {
          doc_id: "7539362479514359",
          fb_dtsg,
          variables,
          fb_api_caller_class: "RelayModern",
          fb_api_req_friendly_name:
            "GroupsCometPeopleProfilesPaginatedListPaginationQuery",
        };
        const formBody = [];
        for (const property in data) {
          const encodedKey = encodeURIComponent(property);
          const encodedValue = encodeURIComponent(data[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        return formBody.join("&");
      }

      async function getLinks(formBody) {
        return fetch("https://www.facebook.com/api/graphql/", {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
            // "x-fb-friendly-name": method,
          },
          body: formBody,
          method: "POST",
        })
          .then((response) => response.json())
          .then(({ data }) => {
            console.log(data);
            return {
              users: data.node.people_profiles.edges.map((item) => {
                return {
                  id: item.node.id,
                  name: item.node.name,
                  url: item.node.url,
                  avatar: item.node.profile_picture?.uri,
                };
              }),
              page: data.node.people_profiles.page_info,
            };
          });
      }

      try {
        const limit = +prompt("Số UUID tối đa sẽ lấy", "999999");
        if (!limit) return;

        const groupID = getGroupId();
        const dtsg = require("DTSG").getCachedToken
          ? require("DTSG").getCachedToken()
          : require("DTSG").getToken();
        window.getAllUidOfGroupMembers_allItems = [];

        alert(
          "Quá trình lấy uuid sẽ diễn ra trong console.\nNhấn F12 để mở console"
        );
        console.log("%cBắt đầu lấy link", "color: green;");

        let cursor = null;
        while (true) {
          const formBody = prepareData({ dtsg, groupID, cursor });
          let { users, page } = await getLinks(formBody);
          window.getAllUidOfGroupMembers_allItems.push(...users);
          console.log(
            "%cĐã lấy được %d uuid",
            "color: green;",
            window.getAllUidOfGroupMembers_allItems.length
          );
          if (!page.has_next_page) {
            break;
          }
          cursor = page.end_cursor;
          if (window.getAllUidOfGroupMembers_allItems.length >= limit) {
            break;
          }
        }

        console.log(window.getAllUidOfGroupMembers_allItems);
        console.log(
          "%cĐã lấy thành công %d uuid, gõ copy(window.getAllUidOfGroupMembers_allItems.map(({ id }) => id).join('\\n')) để sao chép uuid vào clipboard",
          "color: green;font-size: 20px;padding: 10px",
          window.getAllUidOfGroupMembers_allItems.length
        );

        const types = [
          {
            name: "uid",
            field: "id",
          },
          {
            name: "tên",
            field: "name",
          },
          {
            name: "avatar",
            field: "avatar",
          },
          {
            name: "link",
            field: "url",
          },
        ];

        window.ufs_saveFbMemberAgain = () => {
          let type = prompt(
            `TỔNG: ${window.getAllUidOfGroupMembers_allItems.length} members

Chọn những dữ liệu muốn lưu:\n
          ${types.map((_, i) => i + 1 + ": " + _.name).join("\n        ")}

  Ví dụ: muốn lưu uid và link => Nhập 24`,
            1
          );

          if (type) {
            let dataToSave;
            if (type.length === 1) {
              dataToSave = window.getAllUidOfGroupMembers_allItems
                .map((item) => {
                  let index = Math.max(
                    Math.min(+type - 1, 0),
                    types.length - 1
                  );
                  return item[types[index].field];
                })
                .join("\n");
            } else {
              dataToSave = JSON.stringify(
                window.getAllUidOfGroupMembers_allItems.map((data) => {
                  let res = {};
                  for (let i = 0; i < types.length; i++) {
                    if (type.includes(i + 1)) {
                      res[types[i].name] = data[types[i].field];
                    }
                  }
                  return res;
                }),
                null,
                4
              );
            }

            UfsGlobal.Utils.downloadData(dataToSave, "group_members.txt");
          }

          prompt(
            (type ? "Lưu xong" : "Đã huỷ") +
              ". Nếu muốn lưu lại dữ liệu khác, vui lòng nhập code sau vào Console",
            "window.ufs_saveFbMemberAgain()"
          );
        };

        window.ufs_saveFbMemberAgain();
      } catch (error) {
        console.log(error);
        console.log("Uid tìm được: ", window.getAllUidOfGroupMembers_allItems);
        alert("Lỗi. Vui lòng tải lại trang và thử lại." + error);
      }
    },
  },
};
