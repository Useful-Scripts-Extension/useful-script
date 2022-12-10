// https://www.facebook.com/watch/?v=443501793167194

var idPost = new Array();
var token = "";
var idUser = "";
var idPage = "";

function f2() {
  var xmlHttp = new XMLHttpRequest();
  var uri =
    "https://graph.facebook.com/v3.3/" +
    idPage +
    "/posts?limit=100&access_token=" +
    token;
  var time = setInterval(function () {
    if (uri != "") {
      xmlHttp.open("GET", uri, true);
      xmlHttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
          var jsonPost = JSON.parse(this.responseText);
          if (jsonPost.paging.next == "" || jsonPost.paging.next == null) {
            uri = "";
          } else {
            uri = jsonPost.paging.next;
            var data = jsonPost.data;
            for (var i = 0; i < data.length; i++) {
              var id = data[i].id;
              var uri2 =
                "https://graph.facebook.com/v3.3/" +
                id +
                "/comments?fields=from,message&limit=100&access_token=" +
                token;
              var ttp = new XMLHttpRequest();
              getID(uri2, ttp);
            }
          }
        }
      };
      xmlHttp.send();
    } else {
      console.log("End");
      clearInterval(time);
    }
  }, 2000);
}
f2();
function getID(uri2, ttp) {
  if (uri2 != "") {
    ttp.open("GET", uri2, true);
    ttp.onreadystatechange = function () {
      if (this.status == 200 && this.readyState == 4) {
        var jsonComments = JSON.parse(this.responseText);
        if (jsonComments.data.length > 0) {
          if (
            jsonComments.paging.next == "" ||
            jsonComments.paging.next == null
          ) {
            uri2 = "";
          } else {
            uri2 = jsonComments.paging.next;
            var data = jsonComments.data;
            for (var i = 0; i < data.length; i++) {
              var from = data[i].from;
              if (from.id == idUser) {
                console.log(data[i]);
              }
            }
            getID(uri2, ttp);
          }
        }
      }
    };
    ttp.send();
  } else {
    console.log("End post");
    return;
  }
}
