import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { showLoading } from "./helpers/utils.js";

export default {
  icon: "https://shopee.vn/favicon.ico",
  name: {
    en: "Shopee - Total spend money",
    vi: "Shopee - Thống kê chi tiêu",
  },
  description: {
    en: "See how much money you have spend on Shopee",
    vi: "Xem bạn đã mua hết bao nhiêu tiền trên Shopee",
  },

  popupScript: {
    onClick: async () => {
      // Order&Checkout List: https://shopee.vn/api/v4/order/get_all_order_and_checkout_list?limit=5&offset=0
      // Order Detail: https://shopee.vn/api/v4/order/get_order_detail?order_id=124388457229298
      // Order List: https://shopee.vn/api/v4/order/get_order_list?limit=5&list_type=4&offset=0
      // get refund (POST): https://shopee.vn/api/v4/return/return_data/get_return_refund_list
      // get account info: https://shopee.vn/api/v4/account/basic/get_account_info
      // Image: https://cf.shopee.vn/file/ecd20c9d39e0c865d53e3f47e6e2e3a7
      // FB POST: https://www.facebook.com/groups/j2team.community/permalink/1169967376668714/

      const { moneyFormat } = UfsGlobal.Utils;

      const OrderType = {
        completed: 3,
        canceled: 4,
        // ship: 7,
        shipping: 8,
        //   waitPay: 9,
        //   refunded: 12,
      };

      const OrderTypeName = {
        [OrderType.completed]: "Hoàn thành",
        [OrderType.canceled]: "Đã hủy",
        // [OrderType.ship]: "Vận chuyển",
        [OrderType.shipping]: "Đang giao",
        //   [OrderType.waitPay]: "Chờ thanh toán",
        //   [OrderType.refunded]: "Trả hàng/Hoàn tiền",
      };

      async function getStatistics(orderType) {
        let pulling = true;
        let offset = 0;
        let limit = 10;

        let totalDiscount = 0;
        let totalSpent = 0;
        let totalItems = 0;
        let totalOrders = 0;
        let totalShip = 0;
        let totalShipDiscount = 0;
        let shopeeVouchers = 0;
        let shopVouchers = 0;
        let allOrders = [];

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
            let totalPrice = 0;
            order.info_card.order_list_cards[0].product_info.item_groups.forEach(
              (item_group) => {
                item_group.items.forEach((item) => {
                  totalPrice += item.order_price * item.amount;
                });
              }
            );
            console.log(totalPrice, order.info_card.final_total);
            totalDiscount +=
              (totalPrice - order.info_card.final_total) / 1e5 || 0;
            totalSpent += order.info_card.final_total / 1e5;
            totalItems += order.info_card.product_count;

            let orderId = order.info_card.order_id;
            let detail = await getOrderDetail(orderId);
            orders[i].detail = detail.json;
            totalShip += detail.shippingSpent / 1e5;
            shopeeVouchers += detail.shopee_voucher / 1e5;
            shopVouchers += detail.shop_voucher / 1e5;
            totalShipDiscount += detail.shipping_discount / 1e5;

            totalOrders++;
          }

          allOrders.push(...orders);
          pulling = orders.length >= limit;
          offset += limit;
        }

        return {
          totalDiscount,
          totalSpent,
          totalItems,
          totalOrders,
          totalShip,
          totalShipDiscount,
          shopeeVouchers,
          shopVouchers,
          allOrders,
        };
      }

      async function getOrderDetail(orderId) {
        let res = await fetch(
          "https://shopee.vn/api/v4/order/get_order_detail?order_id=" + orderId
        );
        let json = await res.json();

        let shippingSpent = 0;
        let shipping_discount = 0;
        let shopee_voucher = 0;
        let shop_voucher = 0;
        json.data.info_card.parcel_cards.forEach((_) => {
          _.payment_info.info_rows.forEach((row) => {
            if (row.info_label.text === "label_odp_shipping") {
              shippingSpent += Number(row.info_value.value);
            }
            if (
              row.info_label.text === "label_odp_shipping_discount_subtotal"
            ) {
              shippingSpent += Number(row.info_value.value);
              shipping_discount += Number(row.info_value.value);
            }
            if (row.info_label.text === "label_odp_shopee_voucher_applied") {
              shopee_voucher += Number(row.info_value.value);
            }
            if (row.info_label.text === "label_odp_shop_voucher_applied") {
              shop_voucher += Number(row.info_value.value);
            }
          });
        });
        return {
          shippingSpent,
          shipping_discount,
          shopee_voucher,
          shop_voucher,
          json,
        };
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

        let data = await getStatistics(orderType);

        let stats = {
          "THỐNG KÊ Shopee: Đơn hàng ": orderTypeName,
          "+ Tổng đơn hàng: ": data.totalOrders,
          "+ Tổng sản phẩm: ": data.totalItems,
          "+ Tổng chi tiêu: ": moneyFormat(data.totalSpent),
          "+ Tổng tiền ship: ": moneyFormat(data.totalShip),
          "+ Tổng giảm giá sản phẩm: ": moneyFormat(-data.totalDiscount),
          "+ Tổng voucher Shopee: ": moneyFormat(data.shopeeVouchers),
          "+ Tổng voucher shop: ": moneyFormat(data.shopVouchers),
          "+ Tổng voucher ship: ": moneyFormat(data.totalShipDiscount),
        };
        alert(
          Object.entries(stats)
            .map(([key, value]) => `${key} ${value}`)
            .join("\n")
        );
        console.table(stats);
        UfsGlobal.Utils.downloadData(
          JSON.stringify(data.allOrders, null, 4),
          "shopee_orders.json"
        );
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};
