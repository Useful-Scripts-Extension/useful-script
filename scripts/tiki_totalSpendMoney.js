import { showLoading } from "./helpers/utils.js";

export default {
  icon: "https://tiki.vn/favicon.ico",
  name: {
    en: "Tiki - Total spend money?",
    vi: "Tiki - Đã mua bao nhiêu tiền?",
  },
  description: {
    en: "See how much money you have spend on Tiki",
    vi: "Xem bạn đã mua hết bao nhiêu tiền trên Tiki",
  },
  whiteList: ["https://tiki.vn/*"],

  onClickExtension: async () => {
    // https://www.facebook.com/groups/j2team.community/permalink/1169967376668714/

    const { moneyFormat } = UsefulScriptGlobalPageContext.Utils;

    const OrderType = {
      all: "",
      awaiting_payment: "awaiting_payment",
      processing: "processing",
      shipping: "shipping",
      completed: "completed",
      canceled: "canceled",
    };

    const OrderTypeName = {
      [OrderType.completed]: "Đã giao",
      [OrderType.canceled]: "Đã hủy",
      [OrderType.shipping]: "Đang vận chuyển",
      [OrderType.processing]: "Đang xử lý",
      [OrderType.awaiting_payment]: "Chờ thanh toán",
      [OrderType.all]: "Tất cả",
    };

    // https://tiki.vn/api/v2/orders?page=0&limit=10&status=canceled
    async function getStatistics(orderType) {
      let pulling = true;
      let page = 0;
      let limit = 10;

      let totalDiscount = 0;
      let totalShip = 0;
      let totalSpent = 0;
      let totalItems = 0;
      let totalOrders = 0;

      while (pulling) {
        setLoadingText("Đang tải trang thứ " + (page + 1) + "...");
        let res = await fetch(
          `https://tiki.vn/api/v2/orders?page=${page}&limit=${limit}${
            orderType ? "&status=" + orderType : ""
          }`
        );
        let json = await res.json();
        if (json?.error) throw json.error;

        let orders = json.data;
        totalOrders += orders.length;
        for (let i = 0; i < orders.length; i++) {
          setLoadingText(
            "Đang tải đơn hàng thứ " + (page * limit + i + 1) + "..."
          );

          let order = orders[i];
          let detail = await getOrderDetail(order.id);

          totalSpent += order.grand_total;
          totalItems += detail.items.reduce((total, cur) => total + cur.qty, 0);
          totalDiscount += detail.discount_amount;
          totalShip += detail.shipping_amount;
        }

        pulling = orders.length >= limit;
        page++;
      }

      return {
        totalDiscount,
        totalShip,
        totalSpent,
        totalItems,
        totalOrders,
      };
    }

    async function getOrderDetail(orderId) {
      let res = await fetch(
        `https://tiki.vn/api/v2/me/orders/${orderId}?include=items`
      );
      return await res.json();
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
        "THỐNG KÊ Tiki: Đơn hàng ": orderTypeName,
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
      console.log(e);
      alert("ERROR: " + e.message);
    } finally {
      closeLoading();
    }
  },
};
