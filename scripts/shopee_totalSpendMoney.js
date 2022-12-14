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
    // Order List  : https://shopee.vn/api/v4/order/get_all_order_and_checkout_list?limit=5&offset=0
    // Order Detail: https://shopee.vn/api/v4/order/get_order_detail?order_id=124388457229298
    // Image: https://cf.shopee.vn/file/ecd20c9d39e0c865d53e3f47e6e2e3a7
    // POST: https://www.facebook.com/groups/j2team.community/permalink/1169967376668714/

    let Statistics = {
      bougth: {
        totalOrders: 0,
        totalItems: 0,
        totalSpent: 0,
        totalDiscount: 0,
        totalShip: 0,
      },
      canceled: {
        totalOrders: 0,
        totalItems: 0,
        totalSpent: 0,
        totalDiscount: 0,
        totalShip: 0,
      },
    };
    let Type = {
      bougth: "bougth",
      canceled: "canceled",
    };

    let pulling = true;
    let offset = 0;
    let limit = 20;

    async function getStatistics() {
      while (pulling) {
        setLoadingText("Đang tải đơn hàng thứ " + (offset + 1) + "...");
        let res = await fetch(
          "https://shopee.vn/api/v4/order/get_all_order_and_checkout_list?limit=" +
            limit +
            "&offset=" +
            offset
        );
        let json = await res.json();
        if (json?.error) throw Error("Error: " + json.error);

        let orders = json.data.order_data.details_list;
        for (let i = 0; i < orders.length; i++) {
          setLoadingText("Đang tải đơn hàng thứ " + (offset + i + 1) + "...");

          let order = orders[i];
          let wasCanceled = order.list_type == 4;
          let type = wasCanceled ? Type.canceled : Type.bougth;

          order.info_card.order_list_cards.forEach((card) => {
            card.items.forEach((item) => {
              Statistics[type].totalDiscount +=
                (item.price_before_discount - item.item_price) / 100000;

              Statistics[type].totalSpent += item.item_price / 100000;
              Statistics[type].totalItems += item.amount;
            });
          });

          if (!wasCanceled) {
            let orderId = order.info_card.order_id;
            let tpsa = await getShippingSpent(orderId);
            Statistics[type].totalShip += tpsa / 100000;
          }

          Statistics[type].totalOrders++;
        }

        pulling = orders.length >= limit;
        offset += limit;
      }
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
      await getStatistics();
      let stats = {
        "ĐÃ MUA:": "------",
        "+ Tổng đơn hàng đã giao:": Statistics.bougth.totalOrders,
        "+ Tổng sản phẩm đã đặt": Statistics.bougth.totalItems,
        "+ Tổng chi tiêu": moneyFormat(Statistics.bougth.totalSpent),
        "+ Tổng giảm giá": moneyFormat(Statistics.bougth.totalDiscount),
        "+ Tổng tiền ship": moneyFormat(Statistics.bougth.totalShip),
        "ĐÃ HỦY:": "------",
        "+ Tổng đơn hàng đã hủy:": Statistics.bougth.totalOrders,
        "+ Tổng sản phẩm đã hủy": Statistics.bougth.totalItems,
        "+ Tổng chi tiêu đã hủy": moneyFormat(Statistics.bougth.totalSpent),
        "+ Tổng giảm giá đã hủy": moneyFormat(Statistics.bougth.totalDiscount),
        "+ Tổng tiền ship đã hủy": moneyFormat(Statistics.bougth.totalShip),
      };
      alert(
        `THỐNG KÊ:\n` +
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
