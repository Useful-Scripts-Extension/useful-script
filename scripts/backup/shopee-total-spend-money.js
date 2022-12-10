// https://shopee.vn/api/v4/order/get_all_order_and_checkout_list?limit=5&offset=0

// https://www.facebook.com/groups/j2team.community/permalink/1169967376668714/

var totalOrders = 0;
var totalSpent = 0;
var totalShippingSpent = 0;
var totalItems = 0;
var pulling = true;
var offset = 0;

function getStatistics() {
  var orders = [];
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      orders = JSON.parse(this.responseText)["orders"];
      totalOrders += orders.length;
      pulling = orders.length >= 10;
      orders.forEach((order) => {
        let tpa = order["paid_amount"] / 100000;
        totalSpent += tpa;
        let tpsa = order["shipping_fee"] / 100000;
        totalShippingSpent += tpsa;
        order["items"].forEach((item) => {
          let tpti = item["amount"];
          totalItems += tpti;
        });
      });
      offset += 10;
      console.log("Đã lấy được: " + totalOrders + " đơn hàng");
      if (pulling) {
        console.log("Đang kéo thêm...");
        getStatistics();
      } else {
        console.log(
          "%cTổng đơn hàng đã giao: " + "%c" + moneyFormat(totalOrders),
          "font-size: 30px;",
          "font-size: 30px; color:red"
        );
        console.log(
          "%cTổng sản phẩm đã đặt: " + "%c" + moneyFormat(totalItems),
          "font-size: 30px;",
          "font-size: 30px; color:red"
        );
        console.log(
          "%cTổng chi tiêu: " + "%c" + moneyFormat(totalSpent) + "đ",
          "font-size: 30px;",
          "font-size: 30px; color:red"
        );
        console.log(
          "%cTổng tiền ship: " + "%c" + moneyFormat(totalShippingSpent) + "đ",
          "font-size: 30px;",
          "font-size: 30px; color:red"
        );
      }
    }
  };
  xhttp.open(
    "GET",
    "https://shopee.vn/api/v1/orders/?order_type=3&offset=" +
      offset +
      "&limit=10",
    true
  );
  xhttp.send();
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
