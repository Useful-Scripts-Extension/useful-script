// https://startuanit.net/code-f12-toolkit-bo-cong-cu-cho-facebook/

(() => {
  var lang = "vi";
  var token = ""; // default token
  var User = {};
  var ACCESS_TOKEN = "";
  var friend_limit_count = 500;
  var dtsg = require("DTSGInitialData").token;
  const exceptions = ["100030089564311", "100011158877849", "100001467593814"];

  const LIMIT_POSTS = 100;

  var lang = confirm("Want English Interface?") ? "en" : "vi";
  var trans = (i1, i2 = "") => {
    return lang == "vi" ? (i2 !== "" ? i2 : i1) : i1;
  };
  var getFriendList = (e, o) => {
    var a = new XMLHttpRequest();
    (a.onreadystatechange = () => {
      4 == a.readyState &&
        200 == a.status &&
        o(JSON.parse(a.responseText).data);
    }),
      a.open(
        "GET",
        "https://graph.facebook.com/me/friends?limit=5000&fields=id,name&access_token=" +
          e
      ),
      a.send();
  };
  var getPosts = (e, o) => {
    var a = new XMLHttpRequest();
    (a.onreadystatechange = () => {
      4 == a.readyState &&
        200 == a.status &&
        o(JSON.parse(a.responseText).data);
    }),
      a.open(
        "GET",
        "https://graph.facebook.com/me/posts?limit=" +
          LIMIT_POSTS +
          "&fields=id,name&access_token=" +
          e
      ),
      a.send();
  };
  var getShares = (e, n, o = !1) => {
      o ||
        (o =
          "https://graph.facebook.com/" +
          n +
          "/comments?limit=5000&fields=from.id&access_token=" +
          e);
      var t = new XMLHttpRequest();
      t.open("GET", o),
        t.send(),
        (t.onreadystatechange = () => {
          if (4 == t.readyState && 200 == t.status) {
            var e = JSON.parse(t.responseText);
            e.data.forEach((e) => {
              void 0 !== friendsList[e.from.id] &&
                (friendsList[e.from.id].point += 1);
            }),
              void 0 !== e.paging && void 0 !== e.paging.next
                ? console_log("Continue scanning reactions for " + n)
                : (console_log("Scanned comments on post " + n),
                  completedPosts.push(n));
          }
        });
    },
    getComments = (e, n, o = !1) => {
      o ||
        (o =
          "https://graph.facebook.com/" +
          n +
          "/comments?limit=5000&fields=from.id&access_token=" +
          e);
      var t = new XMLHttpRequest();
      t.open("GET", o),
        t.send(),
        (t.onreadystatechange = () => {
          if (4 == t.readyState && 200 == t.status) {
            var o = JSON.parse(t.responseText);
            o.data.forEach((e) => {
              void 0 !== friendsList[e.from.id] &&
                (friendsList[e.from.id].point += 1);
            }),
              void 0 !== o.paging && void 0 !== o.paging.next
                ? console_log("Continue scanning reactions for " + n)
                : (console_log("Scanned comments on post " + n),
                  getShares(e, n));
          }
        });
    },
    getReactions = (e, n, o = !1) => {
      o ||
        (o =
          "https://graph.facebook.com/" +
          n +
          "/reactions?limit=5000&access_token=" +
          e);
      var t = new XMLHttpRequest();
      t.open("GET", o),
        t.send(),
        (t.onreadystatechange = () => {
          if (4 == t.readyState && 200 == t.status) {
            var o = JSON.parse(t.responseText);
            o.data.forEach((e) => {
              void 0 !== friendsList[e.id] && (friendsList[e.id].point += 1);
            }),
              void 0 !== o.paging && void 0 !== o.paging.next
                ? console_log("Continue scanning reactions for " + n)
                : (console_log("Scanned reactions on post " + n),
                  getComments(e, n));
          }
        });
    },
    removeFriend = (e, n) => {
      var o = new XMLHttpRequest(),
        t = new FormData();
      t.append("fb_dtsg", dtsg),
        t.append("uid", e.id),
        t.append("unref", "bd_profile_button"),
        t.append("floc", "profile_button"),
        t.append("nctr[_mod]", "pagelet_timeline_profile_actions"),
        t.append("__req", "x"),
        t.append("__be", "1"),
        t.append("__pc", "PHASED:ufi_home_page_pkg"),
        t.append("dpr", "1"),
        o.open(
          "POST",
          "https://www.facebook.com/ajax/profile/removefriendconfirm.php"
        ),
        o.send(t),
        (o.onreadystatechange = () => {
          4 == o.readyState && 200 == o.status && n(e);
        });
    };
  var friendsList = {},
    completedPosts = [];

  var Monokai = document.createElement("div");
  (Monokai.id = "monokaijs-facebook-toolkit"),
    (Monokai.style =
      'position:fixed;left:10px;top:10px;width:300px;height:360px;z-index:10000;background:#000;color: white; font-family: "Segoe UI";'),
    (Monokai.innerHTML =
      '<img class="header" src="https://i.imgur.com/ZUrdxad.png"></img>'),
    document.body.appendChild(Monokai),
    (Monokai.querySelector(".header").style = "height: 20px;padding:20px;");
  var TopControl = document.createElement("div");
  (TopControl.style = "position: absolute; right:0px; top: 5px;"),
    (TopControl.innerHTML = "<a>🞩</a>"),
    Monokai.appendChild(TopControl);
  var BtnClose = TopControl.querySelector("a,h1,h2,h3,h4,p");
  (BtnClose.style =
    "text-decoration: none;color:white; padding-left: 15px; padding-right: 15px;padding-top:5px;padding-bottom: 5px;"),
    (BtnClose.onclick = function () {
      Monokai.parentNode.removeChild(Monokai);
    });
  var LoginScreen = document.createElement("div");
  (LoginScreen.id = "monokaijs-login-screen"),
    (LoginScreen.style =
      "position: absolute; width: 100%; top: 52px; bottom: 20px;margin: 10px;");
  var LoginForm = document.createElement("div");
  (LoginForm.style = "width: 100%; height: 50%;margin: 0 auto;"),
    (LoginForm.innerHTML =
      "<h3 style='color: white;'>" +
      trans("Login with Access Token", "Đăng nhập bằng Access Token") +
      "</h3><br/><input id='token-input' value='" +
      token +
      "'></input><button id='login-token' class='btn' style='margin-left: 10px;'>" +
      trans("Login", "Đăng nhập") +
      "</button><br/><br/><h1 style='color:white;'>" +
      trans("Get Token with Account", "Lấy Token bằng tài khoản") +
      "</h1><br/><input id='username' value='' placeholder='Username/Email/Phone'></input><br/><br/><input type='password' id='password' value='' placeholder='Password'></input><br/><br/><button id='login-account' class='btn'>" +
      trans("Login", "Đăng nhập") +
      "</button>"),
    LoginScreen.appendChild(LoginForm),
    (LoginForm.querySelector("#login-token").onclick = () => {
      var e = new XMLHttpRequest();
      (e.onreadystatechange = () => {
        4 == e.readyState &&
          (200 == e.status
            ? ((User = JSON.parse(e.responseText)),
              (ACCESS_TOKEN = LoginForm.querySelector("#token-input").value),
              Logged(User))
            : alert(trans("Failed to login!")));
      }),
        e.open(
          "GET",
          "https://graph.facebook.com/me?access_token=" +
            LoginForm.querySelector("input").value
        ),
        e.send();
    }),
    (LoginForm.querySelector("#login-account").onclick = () => {
      var e =
        "https://b-graph.facebook.com/auth/login?email=" +
        LoginForm.querySelector("#username").value +
        "&access_token=350685531728%7C62f8ce9f74b12f84c123cc23437a4a32&method=POST&password=" +
        LoginForm.querySelector("#password").value;
      window.open(e, "_blank").focus();
    });
  var Credit = document.createElement("div");
  (Credit.innerHTML =
    trans("Developed by", "Phát triển bởi") +
    ' <a href="https://monokai.dev" target="_blank" style="color: white; text-decoration: none; font-weight: 600;">MonokaiJs</a>'),
    (Credit.style =
      "width: 100%; position: absolute; text-align: center; bottom: 5px;"),
    Monokai.appendChild(Credit),
    Monokai.appendChild(LoginScreen);
  var Logged = (e) => {
      (LoginScreen.style.display = "none"), (Monokai.style.height = "500px");
      var t = document.createElement("div");
      (t.style =
        "position: absolute; width: 100%; top: 52px; bottom: 20px;margin: 10px;"),
        (t.innerHTML =
          "<button class='tab-btn active' tab='tab-home'>Home</button><button class='tab-btn' tab='tab-tools'>Tools</button><button class='tab-btn' tab='tab-console'>Console</button><button class='tab-btn' tab='tab-about'>About</button>"),
        (t.innerHTML +=
          "<div class='tab active' id='tab-home'>Hello, " +
          e.name +
          ".<br/>FacebookID: " +
          e.id +
          "<br/>Gender: " +
          e.gender +
          "<br/></div>");
      var o =
        "<button class='btn btn-tweak' id='remove-all-posts'>" +
        trans("Delete all posts on Profile", "Xóa hết bài đăng trang cá nhân") +
        "</button>";
      (o +=
        "<button class='btn btn-tweak' id='clear-all-photos'>" +
        trans("Delete all photos", "Xóa hết ảnh") +
        "</button>"),
        (o +=
          "<button class='btn btn-tweak' id='hide-all-posts'>" +
          trans("Hide all posts", "Ẩn hết bài đăng") +
          "</button>"),
        (o +=
          "<button class='btn btn-tweak' id='set-all-only-me'>" +
          trans(
            "Set all posts' privacy to Only Me",
            "Đặt hết bài đăng về chỉ mình tôi"
          ) +
          "</button>"),
        (o +=
          "<button class='btn btn-tweak' id='unfollow-all-friends'>" +
          trans("Unfollow all Friends", "Bỏ theo dõi toàn bộ bạn bè") +
          "</button>"),
        (o +=
          "<button class='btn btn-tweak' id='poke-all-friends'>" +
          trans("Poke all Friends", "Chọc toàn bộ bạn bè") +
          "</button>"),
        (o +=
          "<button class='btn btn-tweak' id='send-msg-all-friends'>" +
          trans(
            "Send message to all Friends",
            "Gửi tin nhắn tới toàn bộ bạn bè"
          ) +
          "</button>"),
        (o +=
          "<button class='btn btn-tweak' id='delete-uninteractive-friends'>" +
          trans("Remove UninteractiveFriends", "Xóa bạn bè không tương tác") +
          "</button>");
      var n = "<h2 style='color: white;'>About me</h2><br/>";
      (n +=
        trans("Fullname:", "Họ tên") +
        " Nguyễn Anh Nhân [MonokaiJs | omfg.vn].<br/>"),
        (n += "Email: monokaijs@gmail.com<br/>"),
        (n += trans("Date of Birth:", "Ngày sinh:") + " 10/01/2001.<br/>"),
        (n +=
          trans(
            "Currently attending General Education in Tran Phu (Duc Tho) High School.",
            "Hiện đang học phổ thông tại trường THPT Trần Phú, Đức Thọ, Hà Tĩnh"
          ) + "<br/><br/>"),
        (n += trans(
          "Programming is my passion. I'm writing softwares, mobile apps and websites to serve the community. Hope my contributions be valuable to you :D.<br/><br/>If you're interested in my works, please donate to help me by contacting via Facebook ;) Thanks.",
          "Lập trình là đam mê. Mình đang viết phần mềm, ứng dụng điện thoại và websites cho cộng đồng. Hy vọng những đóng góp của mình sẽ có ích cho bạn :D.<br/><br/>Nếu thích những thứ mình làm, xin hãy Donate cho mình bằng việc liện lạc qua Facebook nhé ;)"
        )),
        (t.innerHTML +=
          "<div class='tab' id='tab-tools'>" +
          o +
          "</div><div class='tab' id='tab-console'></div><div class='tab' id='tab-about'>" +
          n +
          "</div>"),
        Monokai.appendChild(t),
        (t.querySelector("#remove-all-posts").onclick = () => {
          if (
            confirm(
              trans(
                "Are sure you want to DELETE everything you have posted? This progress can not be undone.",
                "Bạn có chắc muốn XÓA mọi thứ đã đăng? Sẽ không thể phục hồi được."
              )
            )
          ) {
            var e = new XMLHttpRequest();
            e.open(
              "GET",
              "https://graph.facebook.com/me/feed?fields=id,created_time&limit=9999&access_token=" +
                ACCESS_TOKEN
            ),
              e.send(),
              (e.onreadystatechange = function () {
                4 == e.readyState &&
                  200 == e.status &&
                  ((graphData = JSON.parse(e.responseText)),
                  graphData.data.forEach((e) => {
                    var t = new XMLHttpRequest();
                    t.open(
                      "DELETE",
                      "https://graph.facebook.com/v3.2/" +
                        e.id +
                        "?access_token=" +
                        ACCESS_TOKEN
                    ),
                      t.send(),
                      (t.onreadystatechange = function () {
                        4 == t.readyState && 200 == t.status
                          ? console_log("Deleted " + e.id + ".")
                          : console_log("Failed to delete " + e.id);
                      });
                  }));
              });
          }
        }),
        (t.querySelector("#clear-all-photos").onclick = () => {
          if (
            confirm(
              trans(
                "Are sure you want to DELETE every photos you have posted? This progress can not be undone.",
                "Bạn có chắc muốn XÓA toàn bộ ảnh đã đăng? Sẽ không thể phục hồi."
              )
            )
          ) {
            var e = new XMLHttpRequest();
            e.open(
              "GET",
              "https://graph.facebook.com/me/photos?fields=id,created_time&limit=9999&access_token=" +
                ACCESS_TOKEN
            ),
              e.send(),
              (e.onreadystatechange = function () {
                4 == e.readyState &&
                  200 == e.status &&
                  ((graphData = JSON.parse(e.responseText)),
                  graphData.data.forEach((e) => {
                    var t = new XMLHttpRequest();
                    t.open(
                      "DELETE",
                      "https://graph.facebook.com/v3.2/" +
                        e.id +
                        "?access_token=" +
                        ACCESS_TOKEN
                    ),
                      t.send(),
                      (t.onreadystatechange = function () {
                        4 == t.readyState && 200 == t.status
                          ? console_log("Deleted " + e.id + ".")
                          : console_log("Failed to delete " + e.id);
                      });
                  }));
              });
          }
        }),
        (t.querySelector("#set-all-only-me").onclick = () => {
          if (
            confirm(
              trans(
                "Are sure you want to change all posts' privacy to Only Me ?"
              ),
              "Bạn có chắc muốn chuyển mọi bài viết về Chỉ mình tôi?"
            )
          ) {
            var e = new XMLHttpRequest();
            e.open(
              "GET",
              "https://graph.facebook.com/me/posts?fields=id,created_time&limit=9999&access_token=" +
                ACCESS_TOKEN
            ),
              e.send(),
              (e.onreadystatechange = function () {
                4 == e.readyState &&
                  200 == e.status &&
                  ((graphData = JSON.parse(e.responseText)),
                  graphData.data.forEach((e) => {
                    var t = new XMLHttpRequest();
                    t.open(
                      "POST",
                      "https://graph.facebook.com/v3.2/" +
                        e.id +
                        '?privacy={"value":"SELF"}&access_token=' +
                        ACCESS_TOKEN
                    ),
                      t.send(),
                      (t.onreadystatechange = function () {
                        4 == t.readyState && 200 == t.status
                          ? console_log(e.id + " was set.")
                          : console_log("Failed " + e.id);
                      });
                  }));
              });
          }
        }),
        (t.querySelector("#hide-all-posts").onclick = () => {
          if (
            confirm(
              trans(
                "Are sure you want to hide all Posts on Timeline?",
                "Bạn có muốn ẩn toàn bộ bài đăng khỏi Trang cá nhân?"
              )
            )
          ) {
            var e = new XMLHttpRequest();
            e.open(
              "GET",
              "https://graph.facebook.com/me/feed?fields=id,created_time&limit=9999&access_token=" +
                ACCESS_TOKEN
            ),
              e.send(),
              (e.onreadystatechange = function () {
                4 == e.readyState &&
                  200 == e.status &&
                  ((graphData = JSON.parse(e.responseText)),
                  graphData.data.forEach((e) => {
                    var t = new XMLHttpRequest();
                    t.open(
                      "POST",
                      "https://graph.facebook.com/v3.2/" +
                        e.id +
                        "?method=POST&timeline_visibility=hidden&access_token=" +
                        ACCESS_TOKEN
                    ),
                      t.send(),
                      (t.onreadystatechange = function () {
                        4 == t.readyState && 200 == t.status
                          ? console_log(e.id + " was set.")
                          : console_log("Failed to delete " + e.id);
                      });
                  }));
              });
          }
        }),
        (t.querySelector("#unfollow-all-friends").onclick = () => {
          confirm(
            trans("Are sure you want to unfollow all friends?"),
            "Bạn muốn Unfollow toàn bộ bạn bè chứ?"
          ) &&
            get_friends(ACCESS_TOKEN, (e) => {
              e.forEach((e) => {
                removeFriend(e, (e) => {
                  console_log("Unfollowed " + e.name);
                });
              });
            });
        }),
        (t.querySelector("#send-msg-all-friends").onclick = () => {
          var e = prompt(
            trans("Input your message:", "Nhập tin nhắn muốn gửi:")
          );
          "" !== e &&
            get_friends(ACCESS_TOKEN, (t) => {
              var o = 0;
              t.forEach((t) => {
                (o += 1) < friend_limit_count &&
                  setTimeout(() => {
                    sendMessage(e, t.id);
                  }, 100 * o);
              });
            });
        }),
        (t.querySelector("#poke-all-friends").onclick = () => {
          confirm(
            trans(
              "Are sure you want to poke all your friends?",
              "Bạn muốn chọc toàn bộ bạn bè?"
            )
          ) &&
            get_friends(ACCESS_TOKEN, (e) => {
              e.forEach((e) => {
                var t = new XMLHttpRequest();
                (t.onreadystatechange = () => {
                  4 == t.readyState &&
                    (200 == t.status
                      ? console_log("Poked " + e.id)
                      : console_log("Failed to poke " + e.id));
                }),
                  t.open(
                    "GET",
                    "https://graph.facebook.com/" +
                      e.id +
                      "/pokes?method=POST&access_token=" +
                      token
                  ),
                  t.send();
              });
            });
        }),
        (t.querySelector("#delete-uninteractive-friends").onclick = () => {
          confirm(
            trans(
              "Are sure you want to remove all friends that have no interaction on your profile?",
              "Bạn muốn xóa toàn bộ bạn bè KHÔNG TƯƠNG TÁC?"
            )
          ) &&
            (console_log("Loading friends list..."),
            get_friends(ACCESS_TOKEN, (e) => {
              for (fid in (console_log(
                "Successfully loaded " + e.length + " friends..."
              ),
              e))
                (friendsList[e[fid].id] = {}),
                  (friendsList[e[fid].id].name = e[fid].name),
                  (friendsList[e[fid].id].point = 0);
              console_log("Loading posts..."),
                getPosts(ACCESS_TOKEN, (e) => {
                  console_log("Loaded " + e.length + " posts."),
                    console_log("Loading posts reactions..."),
                    e.forEach((e) => {
                      getReactions(ACCESS_TOKEN, e.id, !1);
                    });
                  var t = setInterval(() => {
                    if (completedPosts.length == e.length) {
                      console_log("> Done scanning progress!");
                      var o = [];
                      for (friend_id in friendsList)
                        0 != friendsList[friend_id].point ||
                          exceptions.includes(friend_id) ||
                          o.push({
                            id: friend_id,
                            name: friendsList[friend_id].name,
                          });
                      console_log("> Done filtered friends to be removed!"),
                        console_log(
                          "⚠️ " +
                            o.length +
                            " friends will be removed due to have no interaction!"
                        );
                      var n = 0;
                      o.forEach((e) => {
                        setTimeout(() => {
                          removeFriend(e, (e) => {
                            console_log(
                              "✔️ [" +
                                e.id +
                                "] " +
                                e.name +
                                " has just been removed from friends list!"
                            );
                          });
                        }, 800 * (n += 1));
                      }),
                        clearInterval(t);
                    }
                  }, 500);
                });
            }));
        }),
        t.querySelectorAll(".tab-btn").forEach((e) => {
          e.onclick = (o) => {
            t.querySelectorAll(".tab-btn").forEach((e) => {
              e.classList.remove("active");
            }),
              t.querySelectorAll(".tab").forEach((t) => {
                t.classList.remove("active"),
                  t.id == e.getAttribute("tab") && t.classList.add("active");
              }),
              e.classList.add("active"),
              ResetUI();
          };
        }),
        ResetUI();
    },
    ResetUI = () => {
      Monokai.querySelectorAll(".tab").forEach((e) => {
        e.style =
          "display: none; position: absolute; left: 0px; right: 10px; top: 32px; bottom: 20px; margin: 10px;overflow: hidden;";
      }),
        Monokai.querySelectorAll(".tab.active").forEach((e) => {
          e.style =
            "position: absolute; absolute; left: 0px; right: 10px; top: 32px; bottom: 20px; margin: 10px;overflow: auto;";
        }),
        Monokai.querySelectorAll("input").forEach((e) => {
          (e.style.height = "24px"),
            (e.style.border = "none"),
            (e.style.borderRadius = "12px"),
            (e.style.paddingLeft = "10px"),
            (e.style.paddingRight = "10px");
        }),
        Monokai.querySelectorAll(".btn").forEach((e) => {
          (e.style.height = "24px"),
            (e.style.textDecoration = "none"),
            (e.style.color = "black"),
            (e.style.border = "none"),
            (e.style.borderRadius = "12px"),
            (e.style.backgroundColor = "white"),
            (e.style.paddingLeft = "10px"),
            (e.style.paddingRight = "10px");
        }),
        Monokai.querySelectorAll(".tab-btn").forEach((e) => {
          (e.style.height = "24px"),
            (e.style.textDecoration = "none"),
            (e.style.color = "white"),
            (e.style.border = "1px solid white"),
            (e.style.borderRadius = "12px"),
            (e.style.backgroundColor = "black"),
            (e.style.paddingLeft = "10px"),
            (e.style.paddingRight = "10px"),
            (e.style.marginLeft = "10px");
        }),
        Monokai.querySelectorAll(".btn-tweak").forEach((e) => {
          (e.style.width = "100%"), (e.style.marginTop = "10px");
        }),
        Monokai.querySelectorAll(".tab-btn.active").forEach((e) => {
          (e.style.height = "24px"),
            (e.style.textDecoration = "none"),
            (e.style.color = "black"),
            (e.style.border = "1px solid white"),
            (e.style.borderRadius = "12px"),
            (e.style.backgroundColor = "white"),
            (e.style.paddingLeft = "10px"),
            (e.style.paddingRight = "10px");
        });
    };
  ResetUI();
  var get_friends = (e, t) => {
      var o = new XMLHttpRequest();
      (o.onreadystatechange = () => {
        4 == o.readyState &&
          200 == o.status &&
          t(JSON.parse(o.responseText).data);
      }),
        o.open(
          "GET",
          "https://graph.facebook.com/me/friends?limit=5000&fields=id,name&access_token=" +
            e
        ),
        o.send();
    },
    removeFriend = (e, t) => {
      var o = new XMLHttpRequest(),
        n = new FormData();
      n.append("subject_id", e.id),
        n.append("forceredirect", "false"),
        n.append("location", "83"),
        n.append("m_sess", ""),
        n.append("fb_dtsg", dtsg),
        o.open("POST", "/a/subscriptions/remove"),
        o.send(n),
        4 == o.readyState && 400 !== o.status && 500 !== o.status && t(e);
    },
    sendMessage = (e, t) => {
      var o = new FormData();
      o.append("ids[" + t + "]", t),
        o.append("body", e),
        o.append("fb_dtsg", dtsg);
      var n = new XMLHttpRequest();
      (n.onreadystatechange = () => {
        4 == n.readyState &&
          200 == n.status &&
          console_log("Message was sent to [" + t + "]");
      }),
        n.open(
          "POST",
          "https://m.facebook.com/messages/send/?icm=1&refid=12&ref=dbl"
        ),
        n.send(o);
    },
    console_log = (e) => {
      Monokai.querySelector("#tab-console").innerHTML += e + "<br/>";
    };
})();
