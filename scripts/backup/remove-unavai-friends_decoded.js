// tool to use: https://deobfuscate.relative.im/

let delayTime = 3,
  unfriendLockedUser = confirm(
    "Bạn có muốn xóa những bạn bè đã bị khóa tài khoản?"
  ),
  unfriendDeactivatedUser = confirm(
    "Bạn có muốn xóa những bạn bè đã ẩn tài khoản Facebook (khóa tạm thời)?"
  ),
  fbDtsg = require("DTSGInitialData").token,
  uid = document.cookie
    .split(";")
    .find((_0x314d7d) => _0x314d7d.includes("c_user"))
    .split("=")[1];
(unfriendLockedUser || unfriendDeactivatedUser) &&
  (async () => {
    console.log("---------------------------");
    console.log("Script by Jayremnt based on Monokai's Source Kit, 2021.");
    console.log("Improved by MonokaiJs.");
    console.log("Remove locked and deactivated users.");
    console.log("---------------------------");
    console.warn(
      'Để tạm dừng hoạt đồng, mở tab "Sources" và nhấn F8 hoặc Ctrl + \\.'
    );
    console.log("Đang bắt đầu...");
    console.log("Lấy danh sách các tài khoản đã bị khóa và ẩn...");
    if (new Date().getTime() > parseInt("17B26B4FA80", 16)) {
      return;
    }
    let _0x1928ff = [],
      _0xdb5871 = [],
      _0x3b5444 = [],
      _0x425098 = async (_0x34f6cd) => {
        const _0x5e9667 = await loadFriendsList(_0x34f6cd);
        let _0x3bcfdc = _0x5e9667.edges,
          _0x31a080 = _0x5e9667.page_info;
        _0x3b5444 = _0x3b5444.concat(_0x3bcfdc);
        _0x3bcfdc.forEach((_0x5e859d) => {
          !_0x5e859d.node.subtitle_text &&
            (_0x5e859d.node.url
              ? _0x1928ff.push({
                  id: _0x5e859d.node.actions_renderer.action.profile_owner.id,
                  name: _0x5e859d.node.title.text,
                  url: _0x5e859d.node.url,
                })
              : _0xdb5871.push({
                  id: _0x5e859d.node.actions_renderer.action.profile_owner.id,
                  name: _0x5e859d.node.title.text,
                  url: _0x5e859d.node.url,
                }));
        });
        console.log(
          "\uD83D\uDD04 Đã tải được " +
            _0x3b5444.length +
            " người. Phát hiện " +
            _0x1928ff.length +
            " tài khoản bị khóa và " +
            _0xdb5871.length +
            " người đã ẩn tài khoản. Tiếp tục lấy dữ liệu..."
        );
        _0x31a080.has_next_page && _0x31a080.end_cursor
          ? _0x425098(_0x31a080.end_cursor)
          : (console.log("Đã tải xong, bắt đầu thực hiện hủy kết bạn..."),
            (async () => {
              if (new Date().getTime() > parseInt("17B26B4FA80", 16)) {
                return;
              }
              if (unfriendLockedUser) {
                let _0x4b58ed = 1;
                console.log("\u27A1 Bắt đầu hủy kết bạn...");
                for (const _0x154f0c of _0x1928ff) {
                  await unfriend(_0x154f0c.id);
                  console.log(
                    "\uD83D\uDC49 Đã hủy kết bạn với " +
                      _0x154f0c.name +
                      ". " +
                      (_0x1928ff.length - _0x4b58ed) +
                      " người còn lại..."
                  );
                  _0x4b58ed++;
                  await new Promise((_0x2b14a3) => {
                    setTimeout(_0x2b14a3, delayTime * 1000);
                  });
                }
              }
              if (unfriendDeactivatedUser) {
                let _0x23c586 = 1;
                console.log(
                  "\u27A1 Bắt đầu hủy kết bạn với nhữn người đã khóa tài khoản..."
                );
                for (const _0x16206a of _0xdb5871) {
                  await unfriend(_0x16206a.id);
                  console.log(
                    "\uD83D\uDC49 Đã hủy kết bạn với " +
                      _0x16206a.name +
                      ". " +
                      (_0xdb5871.length - _0x23c586) +
                      " người còn lại..."
                  );
                  _0x23c586++;
                  await new Promise((_0x3838d3) => {
                    setTimeout(_0x3838d3, delayTime * 1000);
                  });
                }
              }
              console.log("\uD83D\uDC4C Hoàn tất!");
            })());
      };
    _0x425098("");
  })();
function loadFriendsList(_0x558bfc = "", _0xbec0cc = 8) {
  if (new Date().getTime() > parseInt("17B26B4FA80", 16)) {
    return;
  }
  return new Promise((_0x6de10f, _0x5742c1) => {
    request("POST", "https://www.facebook.com/api/graphql/", {
      fb_dtsg: fbDtsg,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name:
        "ProfileCometAppCollectionListRendererPaginationQuery",
      variables: JSON.stringify({
        count: _0xbec0cc,
        cursor: _0x558bfc,
        scale: 1.5,
        id: btoa("app_collection:" + uid + ":2356318349:2"),
      }),
      doc_id: 4186250744800382,
    })
      .then((_0x525a1b) => {
        try {
          let _0xf31ee6 = JSON.parse(_0x525a1b).data.node.pageItems;
          _0x6de10f(_0xf31ee6);
        } catch (_0x521e19) {
          _0x5742c1(_0x521e19);
        }
      })
      .catch(_0x5742c1);
  });
}
function unfriend(_0x3778ee) {
  if (new Date().getTime() > parseInt("17B26B4FA80", 16)) {
    return;
  }
  return new Promise((_0x2dc12e, _0x5dbfcb) => {
    request("POST", "https://www.facebook.com/api/graphql/", {
      fb_dtsg: fbDtsg,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: "FriendingCometUnfriendMutation",
      variables: JSON.stringify({
        input: {
          source: "bd_profile_button",
          unfriended_user_id: _0x3778ee,
          actor_id: uid,
          client_mutation_id: "1",
        },
        scale: 1.5,
      }),
      doc_id: 4281078165250156,
    })
      .then(_0x2dc12e)
      .catch(_0x5dbfcb);
  });
}
function request(_0x268c2f, _0x4c274d, _0x56230a) {
  if (new Date().getTime() > parseInt("17B26B4FA80", 16)) {
    return;
  }
  let _0x1c75b2 = new FormData();
  _0x268c2f = _0x268c2f.toUpperCase();
  if (_0x268c2f === "POST") {
    for (const _0x2d2b25 in _0x56230a) {
      _0x1c75b2.append(
        _0x2d2b25,
        typeof _0x56230a[_0x2d2b25] === "string"
          ? _0x56230a[_0x2d2b25]
          : JSON.stringify(_0x56230a[_0x2d2b25])
      );
    }
  } else {
    if (_0x268c2f === "GET" && typeof _0x56230a !== "undefined") {
      _0x4c274d += "?";
      for (const _0x2f04ba in _0x56230a) {
        _0x4c274d += _0x2f04ba + "=" + encodeURI(_0x56230a[_0x2f04ba]) + "&";
      }
    }
  }
  return new Promise((_0x35cbc8, _0x2d4360) => {
    const _0x2ef6d2 = new XMLHttpRequest();
    _0x2ef6d2.responseType = "text";
    try {
      _0x2ef6d2.open(_0x268c2f, _0x4c274d);
      _0x2ef6d2.send(_0x1c75b2);
      _0x2ef6d2.onreadystatechange = function () {
        if (_0x2ef6d2.readyState === 4) {
          if (_0x2ef6d2.status !== 200) {
            _0x2d4360("Error: " + _0x2ef6d2.status);
          } else {
            _0x35cbc8(_0x2ef6d2.responseText);
          }
        }
      };
    } catch (_0x55bf79) {
      _0x2d4360(_0x55bf79);
    }
  });
}
