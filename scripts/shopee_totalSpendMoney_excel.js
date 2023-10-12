export default {
  icon: "https://shopee.vn/favicon.ico",
  name: {
    en: "Shopee - Export order history (Excel)",
    vi: "Shopee - Xuất lịch sử đơn hàng (Excel)",
  },
  description: {
    en: "Export all of your order history from Shopee to Excel file",
    vi: "Xuất lịch sử đơn hàng từ Shopee sang file Excel",
  },
  infoLink:
    "https://www.facebook.com/groups/j2team.community/posts/2222766368055471/",
  whiteList: ["https://shopee.vn/*"],

  onClick: async () => {
    // https://pastecode.io/s/7cpgip63
    // https://www.facebook.com/groups/j2team.community/posts/2222766368055471/

    async function getOrders(offset, limit) {
      let url =
        "https://shopee.vn/api/v4/order/get_all_order_and_checkout_list?limit=" +
        limit +
        "&offset=" +
        offset;
      var ordersData = (await (await fetch(url)).json()).data.order_data;

      var detailList = ordersData.details_list;
      if (detailList) {
        return detailList;
      } else {
        return [];
      }
    }
    function _VietNamCurrency(number) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(number);
    }
    async function getAllOrders() {
      const limit = 20;
      let offset = 0;
      let allOrders = [];
      allOrders.push(
        [
          "Tên chung",
          "Số lượng",
          "Tổng tiền",
          "Trạng thái",
          "Tên shop",
          "Chi tiết",
          "Tiền gốc",
        ].join("\t")
      );
      let sum = 0;
      let count = 0;
      while (true) {
        let data = await getOrders(offset, limit);
        if (data.length == 0) break;
        for (const item of data) {
          const infoCard = item.info_card;
          const listType = item.list_type;
          let strListType;
          switch (listType) {
            case 3:
              strListType = "Hoàn thành";
              break;
            case 4:
              strListType = "Đã hủy";
              break;
            case 7:
              strListType = "Vận chuyển";
              break;
            case 8:
              strListType = "Đang giao";
              break;
            case 9:
              strListType = "Chờ thanh toán";
              break;
            case 12:
              strListType = "Trả hàng";
              break;
            default:
              strListType = "Không rõ";
              break;
          }

          const productCount = infoCard.product_count;
          let subTotal = infoCard.subtotal / 1e5;
          count += productCount;
          const orderCard = infoCard.order_list_cards[0];
          const shopName =
            orderCard.shop_info.username +
            " - " +
            orderCard.shop_info.shop_name;
          const products = orderCard.product_info.item_groups;
          const productSumary = products
            .map((product) =>
              product.items
                .map(
                  (item) =>
                    item.name +
                    "--amount: " +
                    item.amount +
                    "--price: " +
                    _VietNamCurrency(item.item_price)
                )
                .join(", ")
            )
            .join("; ");
          const name = products[0].items[0].name;
          if (listType != 4 && listType != 12) sum += subTotal;
          else subTotal = 0;

          const subTotalNative = _VietNamCurrency(subTotal);
          allOrders.push(
            [
              name,
              productCount,
              subTotalNative,
              strListType,
              shopName,
              productSumary,
              subTotal,
            ].join("\t")
          );
        }
        document.write("<p>Đang xử lý đơn hàng shopee: " + offset + "</p>");
        offset += limit;
      }

      allOrders.push(["Tổng cộng: ", count, _VietNamCurrency(sum)].join("\t"));
      var text = allOrders.join("\r\n");

      return text;
    }
    let text = await getAllOrders();

    document.write(
      "<h2>Dữ liệu đơn hàng. Copy nội dung và dán vào file excel để xem kết quả</h2><textarea>" +
        text +
        "</textarea>"
    );
  },
};
