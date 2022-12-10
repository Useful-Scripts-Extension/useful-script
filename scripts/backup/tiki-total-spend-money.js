// https://tiki.vn/api/v2/orders?page=0&limit=10

// https://www.facebook.com/groups/j2team.community/permalink/1169967376668714/

var totalOrders = 0;
var totalSpent = 0;
var pulling = true;
var page = 1;

function getStatistics() {
  var orders = [];
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      orders = JSON.parse(this.responseText)["data"];
      pulling = orders.length >= 10;
      orders = orders.filter((order) => order["status"] == "hoan_thanh");
      totalOrders += orders.length;
      orders.forEach((order) => {
        let tpa = order["grand_total"];
        totalSpent += tpa;
      });
      page += 1;
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
          "%cTổng chi tiêu: " + "%c" + moneyFormat(totalSpent) + "đ",
          "font-size: 30px;",
          "font-size: 30px; color:red"
        );
      }
    }
  };
  xhttp.open(
    "GET",
    "https://tiki.vn/api/v2/me/orders?page=" + page + "&limit=10",
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
