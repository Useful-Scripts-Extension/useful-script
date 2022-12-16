export default {
  name: {
    en: "Get all fb User ID from group",
    vi: "Lấy tất cả fb user ID từ group",
  },
  description: {
    en: "Get id of all user from group members facebook",
    vi: "Lấy id của tất cả user từ group facebook",
  },
  whiteList: ["https://www.facebook.com/*"],

  onClick: async function () {
    // Lấy tất cả id của member trong group
    // source: https://gist.github.com/thinhbuzz/d8ba04c66f69dc78265b9a9ce5a118c0?fbclid=IwAR37QPDL1zlGWIv_pPq4UydYbFcQKlw7Dio-dP-jtztSJODGPD1RoIGFzZU#file-group-uuid-js-L1

    // function sleep(ms) {
    //   return new Promise((resolve) => setTimeout(resolve, ms));
    // }

    function getId() {
      try {
        const props = require("CometRouteStore").getRoute(location.pathname)
          ?.rootView.props;
        const result = require("GroupsCometMembersPageNewMembersSectionRefetchQuery.graphql");
        if (!props || !result) {
          throw new Error("Không phải profile");
        }
        return {
          groupID: props.groupID,
          docId: result.params.id,
          method: "ProfileCometAppCollectionPhotosRendererPaginationQuery",
        };
      } catch (e) {
        console.error(e);
      }
      return { groupID: null, docId: null, method: null };
    }

    function prepareData({ dtsg: fb_dtsg, groupID, docId: doc_id, method }) {
      const variables = `{"count":10,"cursor":__CURSOR__,"groupID":"${groupID}","recruitingGroupFilterNonCompliant":false,"scale":1,"id":"${groupID}"}`;
      const data = {
        doc_id,
        fb_dtsg,
        variables,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: method,
      };
      const formBody = [];
      for (const property in data) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      return formBody.join("&");
    }

    async function getLinks(method, formBody) {
      return fetch("https://www.facebook.com/api/graphql/", {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
          "x-fb-friendly-name": method,
        },
        body: formBody,
        method: "POST",
      })
        .then((response) => response.json())
        .then(({ data }) => {
          console.log(data);
          return {
            users: data.node.new_members.edges.map((item) => {
              return {
                id: item.node.id,
                name: item.node.name,
                url: item.node.url,
              };
            }),
            page: data.node.new_members.page_info,
          };
        });
    }

    try {
      // window.scrollTo(0, document.body.scrollHeight);
      // await sleep(1000);
      let cursor = null;
      const limit = +prompt("Số UUID tối đa sẽ lấy", "999999") || 999999;
      if (!limit) return;

      const { groupID, docId, method } = getId();
      const dtsg = require("DTSG").getCachedToken
        ? require("DTSG").getCachedToken()
        : require("DTSG").getToken();
      window.getAllUidOfGroupMembers_allItems = [];
      if (!groupID || !docId) {
        throw new Error("Không tìm thấy token");
      }
      alert(
        "Quá trình lấy uuid sẽ diễn ra trong console.\nNhấn F12 để mở console"
      );
      console.log("%cBắt đầu lấy link", "color: green;");
      const formBody = prepareData({ dtsg, groupID, docId, method });
      while (true) {
        let { users, page } = await getLinks(
          method,
          formBody.replace("__CURSOR__", cursor ? `"${cursor}"` : "null")
        );
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
      alert("Đã lấy xong dữ liệu, hiển thị trong console (F12)");
    } catch (error) {
      console.log(error);
      console.log("Uid tìm được: ", window.getAllUidOfGroupMembers_allItems);
      alert("Lỗi. Vui lòng tải lại trang và thử lại.");
    }
  },
};
