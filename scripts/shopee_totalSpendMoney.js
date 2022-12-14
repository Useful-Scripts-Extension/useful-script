import { showLoading } from "./helpers/utils.js";

export default {
  icon: "https://shopee.vn/favicon.ico",
  name: {
    en: "Shopee - Total spend money?",
    vi: "Shopee - Đã mua bao nhiêu tiền?",
  },
  description: {
    en: "See how much money you have spend on Shopee",
    vi: "Xem bạn đã mua hết bao nhiêu tiền trên Shopee",
  },

  onClickExtension: async () => {
    // Order&Checkout List: https://shopee.vn/api/v4/order/get_all_order_and_checkout_list?limit=5&offset=0
    // Order Detail: https://shopee.vn/api/v4/order/get_order_detail?order_id=124388457229298
    // Order List: https://shopee.vn/api/v4/order/get_order_list?limit=5&list_type=4&offset=0
    // get refund (POST): https://shopee.vn/api/v4/return/return_data/get_return_refund_list
    // get account info: https://shopee.vn/api/v4/account/basic/get_account_info
    // Image: https://cf.shopee.vn/file/ecd20c9d39e0c865d53e3f47e6e2e3a7
    // FB POST: https://www.facebook.com/groups/j2team.community/permalink/1169967376668714/

    let OrderType = {
      completed: 3,
      canceled: 4,
      ship: 7,
      shipping: 8,
      //   waitPay: 9,
      //   refunded: 12,
    };

    let OrderTypeName = {
      [OrderType.completed]: "Hoàn thành",
      [OrderType.canceled]: "Đã  hủy",
      [OrderType.ship]: "Vận chuyển",
      [OrderType.shipping]: "Đang giao",
      //   [OrderType.waitPay]: "Chờ thanh toán",
      //   [OrderType.refunded]: "Trả hàng/Hoàn tiền",
    };

    async function getStatistics(orderType) {
      let pulling = true;
      let offset = 0;
      let limit = 10;

      let totalDiscount = 0;
      let totalShip = 0;
      let totalSpent = 0;
      let totalItems = 0;
      let totalOrders = 0;

      while (pulling) {
        setLoadingText("Đang tải đơn hàng thứ " + (offset + 1) + "...");
        let res = await fetch(
          `https://shopee.vn/api/v4/order/get_order_list?limit=${limit}&list_type=${orderType}&offset=${offset}`
        );
        let json = await res.json();
        if (json?.error) throw Error("Error: " + json.error);

        let orders = json.data.details_list;
        for (let i = 0; i < orders.length; i++) {
          setLoadingText("Đang tải đơn hàng thứ " + (offset + i + 1) + "...");

          let order = orders[i];

          order.info_card.order_list_cards.forEach((card) => {
            card.items.forEach((item) => {
              totalDiscount +=
                (item.price_before_discount - item.item_price) / 100000 || 0;
              console.log(totalDiscount);
              totalSpent += item.item_price / 100000;
              totalItems += item.amount;
            });
          });

          let orderId = order.info_card.order_id;
          let tpsa = await getShippingSpent(orderId);
          totalShip += tpsa / 100000;
          totalOrders++;
        }

        pulling = orders.length >= limit;
        offset += limit;
      }

      return {
        totalDiscount,
        totalShip,
        totalSpent,
        totalItems,
        totalOrders,
      };
    }

    async function getShippingSpent(orderId) {
      let res = await fetch(
        "https://shopee.vn/api/v4/order/get_order_detail?order_id=" + orderId
      );
      let json = await res.json();

      let shippingSpent = 0;
      json.data.info_card.parcel_cards.forEach((_) => {
        _.payment_info.info_rows.forEach((row) => {
          if (row.info_label.text === "label_odp_shipping") {
            shippingSpent += Number(row.info_value.value);
          }
        });
      });
      return shippingSpent;
    }

    function moneyFormat(number, fixed = 0) {
      if (isNaN(number)) return 0;
      number = number.toFixed(fixed);
      let delimeter = ",";
      number += "";
      let rgx = /(\d+)(\d{3})/;
      while (rgx.test(number)) {
        number = number.replace(rgx, "$1" + delimeter + "$2");
      }
      return number;
    }

    let { closeLoading, setLoadingText } = showLoading("Đang chuẩn bị...");
    try {
      let options = Object.entries(OrderTypeName);
      let optionsTxt = options
        .map(([key, value], index) => `   ${index}: ${value}`)
        .join("\n");

      let choice = prompt(
        "Chọn loại đơn hàng muốn thống kê:\n" + optionsTxt,
        0
      );

      if (choice == null) return;
      let orderType = options[Number(choice)][0];
      let orderTypeName = OrderTypeName[orderType];

      let { totalDiscount, totalShip, totalSpent, totalItems, totalOrders } =
        await getStatistics(orderType);

      let stats = {
        "THỐNG KÊ Shopee: ": orderTypeName,
        "+ Tổng đơn hàng: ": totalOrders,
        "+ Tổng sản phẩm: ": totalItems,
        "+ Tổng chi tiêu: ": moneyFormat(totalSpent),
        "+ Tổng giảm giá: ": moneyFormat(totalDiscount),
        "+ Tổng tiền ship: ": moneyFormat(totalShip),
      };
      alert(
        Object.entries(stats)
          .map(([key, value]) => `${key} ${value}`)
          .join("\n")
      );
      console.table(stats);
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
