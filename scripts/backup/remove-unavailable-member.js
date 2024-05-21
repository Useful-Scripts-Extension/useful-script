// https://www.facebook.com/groups/j2team.community/permalink/706024463063010
// https://gist.github.com/J2TEAM/7cc8554b74ff8af3af522b42b95e73d8?fbclid=IwAR1zfXWCWjgffNNp21IA5NaPmc3mzVJDFnPhN4QPgupRk1cT566kYxPTMCg

/* Developed by Juno_okyo */
(function (groupId) {
  function remove_unavailable_members() {
    var a = allMembers.shift();
    console.log("Removing " + a);
    remove_member(a).then(function () {
      0 < allMembers.length
        ? setTimeout(remove_unavailable_members, 100)
        : console.info("Done!");
    });
  }
  function remove_member(mem_uid) {
    var b = new FormData();
    b.append("fb_dtsg", getFbDtsg);
    b.append("__user", getUid);
    b.append("confirmed", !0);
    b.append("__a", 1);
    return fetch(
      "https://www.facebook.com/ajax/groups/remove_member/?group_id=" +
        groupId +
        "&member_id=" +
        mem_uid +
        "&is_undo=0&source=profile_browser&dpr=1",
      { credentials: "include", body: b, method: "POST" }
    );
  }
  var allMembers = [],
    getFbDtsg = (function () {
      try {
        return require("DTSGInitialData").token;
      } catch (b) {
        var a = document.querySelector('[name="fb_dtsg"]');
        return null !== a ? a.value : null;
      }
    })(),
    getUid = (function () {
      if ("function" !== typeof require) return null;
      try {
        return (
          require("CurrentUserInitialData").USER_ID ||
          document.cookie.match(/c_user=([0-9]+)/)[1]
        );
      } catch (a) {
        return null;
      }
    })();

  fetch(
    "https://www.facebook.com/ajax/browser/list/group_confirmed_members/?gid=" +
      encodeURIComponent(groupId) +
      "&order=default&filter=unavailable_accounts&view=list&limit=500&sectiontype=unavailable&start=0&__a=1&fb_dtsg_ag=" +
      encodeURIComponent(require("DTSGInitData").async_get_token),
    { credentials: "include" }
  )
    .then(function (a) {
      return a.text();
    })
    .then(function (a) {
      for (var b = /id=\\"unavailable_([0-9]+)\\"/g, d = b.exec(a); null != d; )
        allMembers.push(d[1]), (d = b.exec(a));

      console.log(allMembers);
      remove_unavailable_members();
    });
})(1154059318582088);
