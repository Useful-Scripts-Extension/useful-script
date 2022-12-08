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
  blackList: [],
  whiteList: [],
  runInExtensionContext: false,

  onClick: function () {
    // Source: https://gist.github.com/J2TEAM/bc5d9a1f3e648d6a3d679edf8689e5de
    // Post: https://www.facebook.com/groups/j2team.community/posts/1730753827256730/

    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.createTemplateTagFirstArg = function (a) {
      return (a.raw = a);
    };
    $jscomp.createTemplateTagFirstArgWithRaw = function (a, d) {
      a.raw = d;
      return a;
    };
    $jscomp.arrayIteratorImpl = function (a) {
      var d = 0;
      return function () {
        return d < a.length ? { done: !1, value: a[d++] } : { done: !0 };
      };
    };
    $jscomp.arrayIterator = function (a) {
      return { next: $jscomp.arrayIteratorImpl(a) };
    };
    $jscomp.makeIterator = function (a) {
      var d =
        "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
      return d ? d.call(a) : $jscomp.arrayIterator(a);
    };
    (function () {
      function a(b) {
        b.forEach(function (c) {
          c.product_items &&
            c.product_items.forEach(function (e) {
              f[e.model_name] ? f[e.model_name]++ : (f[e.model_name] = 1);
            });
        });
      }
      function d() {
        var b = Object.fromEntries(
          Object.entries(f).sort(function (c, e) {
            var g = $jscomp.makeIterator(c);
            g.next();
            g = g.next().value;
            var m = $jscomp.makeIterator(e);
            m.next();
            return m.next().value - g;
          })
        );
        console.info("Đã hoàn tất. Kết quả:");
        console.table(b);
      }
      function run() {
        var url =
          "https://shopee.vn/api/v2/item/get_ratings?filter=0&flag=1&itemid=" +
          itemId +
          "&limit=50&offset=" +
          offset +
          "&shopid=" +
          shopId +
          "&type=0";
        console.log("Đang quét trang " + page + "...");
        fetch(url, {
          headers: {
            "x-api-source": "pc",
            "x-requested-with": "XMLHttpRequest",
            "x-shopee-language": "vi",
          },
          method: "GET",
          mode: "cors",
          credentials: "include",
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (json) {
            json.error || !json.data || 0 === json.data.ratings.length
              ? 1 < page && d()
              : (a(json.data.ratings),
                50 > page ? ((offset += 50), page++, run()) : d());
          });
      }
      var f = {},
        offset = 0,
        page = 1,
        shopId = null,
        itemId = null;
      console.info(
        "Chia sẻ bởi Mạnh Tuấn từ nhóm J2TEAM Community - https://www.facebook.com/groups/j2team.community"
      );
      (function () {
        var b = new URL(window.top.location.href);
        if (!b.hostname.includes("shopee.vn"))
          throw Error("Đoạn mã này chỉ có thể sử dụng trên web Shopee.vn");
        if ((b = /.+-i\.([0-9]+).([0-9]+)/.exec(b.pathname)))
          (shopId = b[1]), (itemId = b[2]);
        else
          throw Error(
            "Trang bạn đang xem không phải là một trang sản phẩm của Shopee."
          );
      })();
      console.info(
        "Bắt đầu phân tích với Shop ID " +
          shopId +
          " và mã sản phẩm " +
          itemId +
          "..."
      );
      run();
    })();
  },
};
