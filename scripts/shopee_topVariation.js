import { getTableStyle } from "./helpers/predefined_css.js";
import {
  getCurrentTab,
  openPopupWithHtml,
  showLoading,
} from "./helpers/utils.js";

export default {
  icon: "https://shopee.vn/favicon.ico",
  name: {
    en: "Shopee - Top variation",
    vi: "Shopee - Loại hàng mua nhiều nhất",
  },
  description: {
    en: "See how many times each product variant was purchased",
    vi: "Thống kê xem tùy chọn sản phẩm nào được mọi người mua nhiều nhất",
  },

  onClickExtension: async function () {
    // Source: https://gist.github.com/J2TEAM/bc5d9a1f3e648d6a3d679edf8689e5de
    // Post: https://www.facebook.com/groups/j2team.community/posts/1730753827256730/

    let { setLoadingText, closeLoading } = showLoading("Đang chuẩn bị...");
    try {
      var helpers = {
        scope: {},
        createTemplateTagFirstArg: function (a) {
          return (a.raw = a);
        },
        createTemplateTagFirstArgWithRaw: function (a, d) {
          a.raw = d;
          return a;
        },
        arrayIteratorImpl: function (a) {
          var d = 0;
          return function () {
            return d < a.length ? { done: !1, value: a[d++] } : { done: !0 };
          };
        },
        arrayIterator: function (a) {
          return { next: helpers.arrayIteratorImpl(a) };
        },
        makeIterator: function (a) {
          var d =
            "undefined" != typeof Symbol &&
            Symbol.iterator &&
            a[Symbol.iterator];
          return d ? d.call(a) : helpers.arrayIterator(a);
        },
      };

      function a(arr) {
        arr.forEach(function (c) {
          c.product_items &&
            c.product_items.forEach(function (i) {
              count[i.model_name]
                ? count[i.model_name]++
                : (count[i.model_name] = 1);
            });
        });
      }
      function d() {
        var b = Object.fromEntries(
          Object.entries(count).sort(function (c, e) {
            var g = helpers.makeIterator(c);
            g.next();
            g = g.next().value;
            var m = helpers.makeIterator(e);
            m.next();
            return m.next().value - g;
          })
        );
        console.info("Đã hoàn tất. Kết quả:");
        console.table(b);
        showResult(b);
      }
      async function run() {
        var url =
          "https://shopee.vn/api/v2/item/get_ratings?filter=0&flag=1&itemid=" +
          itemId +
          "&limit=50&offset=" +
          offset +
          "&shopid=" +
          shopId +
          "&type=0";

        setLoadingText(title + "<br/><br/>Đang quét trang " + page + "...");
        let res = await fetch(url, {
          headers: {
            "x-api-source": "pc",
            "x-requested-with": "XMLHttpRequest",
            "x-shopee-language": "vi",
          },
          method: "GET",
          mode: "cors",
          credentials: "include",
        });
        let json = await res.json();
        console.log(json);

        json.error || !json.data || !json.data.ratings?.length
          ? 1 < page && d()
          : (a(json.data.ratings),
            50 > page ? ((offset += 50), page++, await run()) : d());
      }
      function showResult(data) {
        let html = Object.entries(data)
          .map(([key, value], index) => {
            return `<tr>
              <td>${index}</td>
              <td>${key}</td>
              <td>${value}</td>
            </tr>`;
          })
          .join("");

        openPopupWithHtml(
          `<h1>
            <a href="${tab.url}" target="_blank">Link sản phẩm</a>
          </h1>
          <table>
            <tr>
              <th>#</th>
              <th>Loại</th>
              <th>Lượt mua</th>
            </tr>
            ${html}
          </table>
          <style>${getTableStyle()}</style>
          `,
          500,
          window.screen.height
        );
      }

      var count = {},
        offset = 0,
        page = 1,
        shopId = null,
        itemId = null,
        title = "";

      setLoadingText("Đang lấy url trang web...");
      let tab = await getCurrentTab();
      var b = new URL(tab.url);
      if (!b.hostname.includes("shopee.vn"))
        throw Error("Đoạn mã này chỉ có thể sử dụng trên web Shopee.vn");
      if ((b = /.+-i\.([0-9]+).([0-9]+)/.exec(b.pathname)))
        (shopId = b[1]), (itemId = b[2]);
      else
        throw Error(
          "Trang bạn đang xem không phải là một trang sản phẩm của Shopee."
        );

      title =
        "Bắt đầu phân tích với " +
        `<br/>Shop ID: ${shopId}` +
        `<br/>Mã sản phẩm ${itemId}` +
        "...";

      await run();
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
