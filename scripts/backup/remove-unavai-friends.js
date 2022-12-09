// https://www.facebook.com/groups/j2team.community/permalink/1632566443742136

/*
	Script by @Jayremnt, 2021.
	Improved by @MonokaiJs.
	Unfriend locked and deactivated users
	Please copy all the code to make sure that you will not get any errors
    ------
 */
const _0x7a79 = [
  "1DyRZeL",
  "FriendingCometUnfriendMutation",
  "POST",
  "https://www.facebook.com/api/graphql/",
  "\x20người\x20đã\x20ẩn\x20tài\x20khoản.\x20Tiếp\x20tục\x20lấy\x20dữ\x20liệu...",
  "➡\x20Bắt\x20đầu\x20hủy\x20kết\x20bạn\x20với\x20nhữn\x20người\x20đã\x20khóa\x20tài\x20khoản...",
  "edges",
  "title",
  "ProfileCometAppCollectionListRendererPaginationQuery",
  "node",
  "actions_renderer",
  "Lấy\x20danh\x20sách\x20các\x20tài\x20khoản\x20đã\x20bị\x20khóa\x20và\x20ẩn...",
  "DTSGInitialData",
  "onreadystatechange",
  "\x20người.\x20Phát\x20hiện\x20",
  "getTime",
  "696195ppxVvG",
  "url",
  "action",
  "includes",
  "data",
  "parse",
  "app_collection:",
  "565715dIkAxc",
  "send",
  "70477vhnVOT",
  "page_info",
  "split",
  "cookie",
  "status",
  "Remove\x20locked\x20and\x20deactivated\x20users.",
  "Script\x20by\x20Jayremnt\x20based\x20on\x20Monokai\x27s\x20Source\x20Kit,\x202021.",
  "then",
  "stringify",
  "👌\x20Hoàn\x20tất!",
  "---------------------------",
  "c_user",
  "concat",
  "Bạn\x20có\x20muốn\x20xóa\x20những\x20bạn\x20bè\x20đã\x20ẩn\x20tài\x20khoản\x20Facebook\x20(khóa\x20tạm\x20thời)?",
  "Đang\x20bắt\x20đầu...",
  "name",
  "17B26B4FA80",
  "2LPmtqA",
  "➡\x20Bắt\x20đầu\x20hủy\x20kết\x20bạn...",
  "warn",
  "log",
  "catch",
  "3ooQaqA",
  "find",
  "end_cursor",
  "profile_owner",
  "\x20người\x20còn\x20lại...",
  "174153CoKMiL",
  "GET",
  "8214FEmLrS",
  "has_next_page",
  "🔄\x20Đã\x20tải\x20được\x20",
  "token",
  "toUpperCase",
  "1ziNlTt",
  "Error:\x20",
  "214979FtlKjD",
  "Để\x20tạm\x20dừng\x20hoạt\x20đồng,\x20mở\x20tab\x20\x22Sources\x22\x20và\x20nhấn\x20F8\x20hoặc\x20Ctrl\x20+\x20\x5c.",
  "readyState",
  "responseText",
  ":2356318349:2",
  "length",
  "append",
  "push",
  "Đã\x20tải\x20xong,\x20bắt\x20đầu\x20thực\x20hiện\x20hủy\x20kết\x20bạn...",
  "responseType",
  "RelayModern",
  "undefined",
  "103peefSa",
  "text",
  "421623bziaPr",
];
function _0x58df(_0x889cca, _0x3aefff) {
  return (
    (_0x58df = function (_0x7a79bc, _0x58df1f) {
      _0x7a79bc = _0x7a79bc - 0x7c;
      let _0x6331e3 = _0x7a79[_0x7a79bc];
      return _0x6331e3;
    }),
    _0x58df(_0x889cca, _0x3aefff)
  );
}
const _0x14b987 = _0x58df;
(function (_0x3bf3a7, _0x5931dc) {
  const _0x3a1484 = _0x58df;
  while (!![]) {
    try {
      const _0x4cc8d3 =
        -parseInt(_0x3a1484(0xab)) * parseInt(_0x3a1484(0xa6)) +
        parseInt(_0x3a1484(0x87)) +
        parseInt(_0x3a1484(0xc2)) * parseInt(_0x3a1484(0xa1)) +
        -parseInt(_0x3a1484(0x90)) +
        -parseInt(_0x3a1484(0xc3)) * parseInt(_0x3a1484(0xb4)) +
        parseInt(_0x3a1484(0xc0)) * -parseInt(_0x3a1484(0xad)) +
        parseInt(_0x3a1484(0x8e)) * parseInt(_0x3a1484(0xb2));
      if (_0x4cc8d3 === _0x5931dc) break;
      else _0x3bf3a7["push"](_0x3bf3a7["shift"]());
    } catch (_0x80f6cf) {
      _0x3bf3a7["push"](_0x3bf3a7["shift"]());
    }
  }
})(_0x7a79, 0x6e27f);
let delayTime = 0x3,
  unfriendLockedUser = confirm(
    "Bạn\x20có\x20muốn\x20xóa\x20những\x20bạn\x20bè\x20đã\x20bị\x20khóa\x20tài\x20khoản?"
  ),
  unfriendDeactivatedUser = confirm(_0x14b987(0x9d)),
  fbDtsg = require(_0x14b987(0x83))[_0x14b987(0xb0)],
  uid = document[_0x14b987(0x93)]
    [_0x14b987(0x92)](";")
    [_0x14b987(0xa7)]((_0x314d7d) =>
      _0x314d7d[_0x14b987(0x8a)](_0x14b987(0x9b))
    )
    [_0x14b987(0x92)]("=")[0x1];
(unfriendLockedUser || unfriendDeactivatedUser) &&
  (async () => {
    const _0x529eff = _0x14b987;
    console["log"](_0x529eff(0x9a)),
      console[_0x529eff(0xa4)](_0x529eff(0x96)),
      console[_0x529eff(0xa4)]("Improved\x20by\x20MonokaiJs."),
      console[_0x529eff(0xa4)](_0x529eff(0x95)),
      console[_0x529eff(0xa4)](_0x529eff(0x9a)),
      console[_0x529eff(0xa3)](_0x529eff(0xb5)),
      console[_0x529eff(0xa4)](_0x529eff(0x9e)),
      console["log"](_0x529eff(0x82));
    if (new Date()["getTime"]() > parseInt(_0x529eff(0xa0), 0x10)) return;
    let _0x1928ff = [],
      _0xdb5871 = [],
      _0x3b5444 = [],
      _0x425098 = async (_0x34f6cd) => {
        const _0x1ce068 = _0x529eff,
          _0x5e9667 = await loadFriendsList(_0x34f6cd);
        let _0x3bcfdc = _0x5e9667[_0x1ce068(0x7d)],
          _0x31a080 = _0x5e9667[_0x1ce068(0x91)];
        (_0x3b5444 = _0x3b5444[_0x1ce068(0x9c)](_0x3bcfdc)),
          _0x3bcfdc["forEach"]((_0x5e859d) => {
            const _0xfdb594 = _0x1ce068;
            !_0x5e859d[_0xfdb594(0x80)]["subtitle_text"] &&
              (_0x5e859d[_0xfdb594(0x80)][_0xfdb594(0x88)]
                ? _0x1928ff["push"]({
                    id: _0x5e859d[_0xfdb594(0x80)][_0xfdb594(0x81)][
                      _0xfdb594(0x89)
                    ]["profile_owner"]["id"],
                    name: _0x5e859d[_0xfdb594(0x80)][_0xfdb594(0x7e)][
                      _0xfdb594(0xc1)
                    ],
                    url: _0x5e859d[_0xfdb594(0x80)][_0xfdb594(0x88)],
                  })
                : _0xdb5871[_0xfdb594(0xbb)]({
                    id: _0x5e859d[_0xfdb594(0x80)]["actions_renderer"][
                      _0xfdb594(0x89)
                    ][_0xfdb594(0xa9)]["id"],
                    name: _0x5e859d[_0xfdb594(0x80)][_0xfdb594(0x7e)]["text"],
                    url: _0x5e859d[_0xfdb594(0x80)][_0xfdb594(0x88)],
                  }));
          }),
          console["log"](
            _0x1ce068(0xaf) +
              _0x3b5444[_0x1ce068(0xb9)] +
              _0x1ce068(0x85) +
              _0x1928ff[_0x1ce068(0xb9)] +
              "\x20tài\x20khoản\x20bị\x20khóa\x20và\x20" +
              _0xdb5871[_0x1ce068(0xb9)] +
              _0x1ce068(0xc7)
          ),
          _0x31a080[_0x1ce068(0xae)] && _0x31a080[_0x1ce068(0xa8)]
            ? _0x425098(_0x31a080[_0x1ce068(0xa8)])
            : (console[_0x1ce068(0xa4)](_0x1ce068(0xbc)),
              (async () => {
                const _0x4a81fd = _0x1ce068;
                if (
                  new Date()[_0x4a81fd(0x86)]() >
                  parseInt(_0x4a81fd(0xa0), 0x10)
                )
                  return;
                let _0x21f084 = 0x1;
                if (unfriendLockedUser) {
                  let _0x4b58ed = 0x1;
                  console["log"](_0x4a81fd(0xa2));
                  for (const _0x154f0c of _0x1928ff) {
                    await unfriend(_0x154f0c["id"]),
                      console[_0x4a81fd(0xa4)](
                        "👉\x20Đã\x20hủy\x20kết\x20bạn\x20với\x20" +
                          _0x154f0c[_0x4a81fd(0x9f)] +
                          ".\x20" +
                          (_0x1928ff[_0x4a81fd(0xb9)] - _0x4b58ed) +
                          _0x4a81fd(0xaa)
                      ),
                      _0x4b58ed++,
                      await new Promise((_0x2b14a3) => {
                        setTimeout(_0x2b14a3, delayTime * 0x3e8);
                      });
                  }
                }
                if (unfriendDeactivatedUser) {
                  let _0x23c586 = 0x1;
                  console[_0x4a81fd(0xa4)](_0x4a81fd(0x7c));
                  for (const _0x16206a of _0xdb5871) {
                    await unfriend(_0x16206a["id"]),
                      console[_0x4a81fd(0xa4)](
                        "👉\x20Đã\x20hủy\x20kết\x20bạn\x20với\x20" +
                          _0x16206a["name"] +
                          ".\x20" +
                          (_0xdb5871[_0x4a81fd(0xb9)] - _0x23c586) +
                          _0x4a81fd(0xaa)
                      ),
                      _0x23c586++,
                      await new Promise((_0x3838d3) => {
                        setTimeout(_0x3838d3, delayTime * 0x3e8);
                      });
                  }
                }
                console[_0x4a81fd(0xa4)](_0x4a81fd(0x99));
              })());
      };
    _0x425098("");
  })();
function loadFriendsList(_0x558bfc = "", _0xbec0cc = 0x8) {
  const _0x21f6ec = _0x14b987;
  if (new Date()[_0x21f6ec(0x86)]() > parseInt(_0x21f6ec(0xa0), 0x10)) return;
  return new Promise((_0x6de10f, _0x5742c1) => {
    const _0x3c81fb = _0x21f6ec;
    request(_0x3c81fb(0xc5), _0x3c81fb(0xc6), {
      fb_dtsg: fbDtsg,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: _0x3c81fb(0x7f),
      variables: JSON[_0x3c81fb(0x98)]({
        count: _0xbec0cc,
        cursor: _0x558bfc,
        scale: 1.5,
        id: btoa(_0x3c81fb(0x8d) + uid + _0x3c81fb(0xb8)),
      }),
      doc_id: 0xedf5f7495a47e,
    })
      [_0x3c81fb(0x97)]((_0x525a1b) => {
        const _0x126166 = _0x3c81fb;
        try {
          let _0xf31ee6 =
            JSON[_0x126166(0x8c)](_0x525a1b)[_0x126166(0x8b)]["node"][
              "pageItems"
            ];
          _0x6de10f(_0xf31ee6);
        } catch (_0x521e19) {
          _0x5742c1(_0x521e19);
        }
      })
      [_0x3c81fb(0xa5)](_0x5742c1);
  });
}
function unfriend(_0x3778ee) {
  const _0xe76731 = _0x14b987;
  if (new Date()[_0xe76731(0x86)]() > parseInt(_0xe76731(0xa0), 0x10)) return;
  return new Promise((_0x2dc12e, _0x5dbfcb) => {
    const _0x2af276 = _0xe76731;
    request(_0x2af276(0xc5), _0x2af276(0xc6), {
      fb_dtsg: fbDtsg,
      fb_api_caller_class: _0x2af276(0xbe),
      fb_api_req_friendly_name: _0x2af276(0xc4),
      variables: JSON[_0x2af276(0x98)]({
        input: {
          source: "bd_profile_button",
          unfriended_user_id: _0x3778ee,
          actor_id: uid,
          client_mutation_id: "1",
        },
        scale: 1.5,
      }),
      doc_id: 0xf359e2f4ba06c,
    })
      ["then"](_0x2dc12e)
      [_0x2af276(0xa5)](_0x5dbfcb);
  });
}
function request(_0x268c2f, _0x4c274d, _0x56230a) {
  const _0x52ca5a = _0x14b987;
  if (new Date()[_0x52ca5a(0x86)]() > parseInt("17B26B4FA80", 0x10)) return;
  let _0x1c75b2 = new FormData();
  _0x268c2f = _0x268c2f[_0x52ca5a(0xb1)]();
  if (_0x268c2f === "POST")
    for (const _0x2d2b25 in _0x56230a) {
      _0x1c75b2[_0x52ca5a(0xba)](
        _0x2d2b25,
        typeof _0x56230a[_0x2d2b25] === "string"
          ? _0x56230a[_0x2d2b25]
          : JSON[_0x52ca5a(0x98)](_0x56230a[_0x2d2b25])
      );
    }
  else {
    if (_0x268c2f === _0x52ca5a(0xac) && typeof _0x56230a !== _0x52ca5a(0xbf)) {
      _0x4c274d += "?";
      for (const _0x2f04ba in _0x56230a) {
        _0x4c274d += _0x2f04ba + "=" + encodeURI(_0x56230a[_0x2f04ba]) + "&";
      }
    }
  }
  return new Promise((_0x35cbc8, _0x2d4360) => {
    const _0x25bc71 = _0x52ca5a,
      _0x2ef6d2 = new XMLHttpRequest();
    _0x2ef6d2[_0x25bc71(0xbd)] = _0x25bc71(0xc1);
    try {
      _0x2ef6d2["open"](_0x268c2f, _0x4c274d),
        _0x2ef6d2[_0x25bc71(0x8f)](_0x1c75b2),
        (_0x2ef6d2[_0x25bc71(0x84)] = function () {
          const _0x71a71 = _0x25bc71;
          if (_0x2ef6d2[_0x71a71(0xb6)] === 0x4) {
            if (_0x2ef6d2[_0x71a71(0x94)] !== 0xc8)
              _0x2d4360(_0x71a71(0xb3) + _0x2ef6d2[_0x71a71(0x94)]);
            else _0x35cbc8(_0x2ef6d2[_0x71a71(0xb7)]);
          }
        });
    } catch (_0x55bf79) {
      _0x2d4360(_0x55bf79);
    }
  });
}
