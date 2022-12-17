function getThreadId(id, type) {
  if (type === "Group")
    return require("MercuryIDs").getThreadIDFromThreadFBID(id);
  else if (type === "User" || type === "Page")
    return require("MercuryIDs").getThreadIDFromUserID(id);
  else
    return require("unrecoverableViolation")(
      "Not supported",
      "messenger_web_product"
    );
}
function openChat(id, type) {
  let threadId = getThreadId(id, type);
  require("MWChatStateActions.bs").openTab(
    Date.now(),
    { shouldFocus: true },
    {
      _0: {
        clientThreadKey: void 0,
        threadKey: "105941170804328u100006100567721", // require("MercuryIDs").getThreadKeyfromThreadIDUserID(threadId,id),
        threadType: require("MessagingThreadType.bs").oneToOne,
      },
      TAG: 1,
    }
  );
}

require("MWChatStateActions.bs").openTabOrFlyout(
  i,
  {
    shouldFocus: !1,
  },
  {
    _0: {
      clientThreadKey: void 0,
      threadKey: g.threadKey,
      threadType: g.threadType,
    },
    TAG: 1,
  }
);

__d(
  "MWChatThreadId.bs",
  [
    "MercuryIDs",
    "MessagingThreadType.bs",
    "bs_caml",
    "bs_caml_int64",
    "bs_caml_obj",
    "unrecoverableViolation",
  ],
  function (a, b, c, d, e, f, g) {
    "use strict";
    function a(a) {
      var b = a.NAME;
      if (b === "Group")
        return d("MercuryIDs").getThreadIDFromThreadFBID(a.VAL);
      else if (b === "User" || b === "Page")
        return d("MercuryIDs").getThreadIDFromUserID(a.VAL);
      else
        return c("unrecoverableViolation")(
          "Not supported",
          "messenger_web_product"
        );
    }
    function b(a) {
      return a.VAL;
    }
    function e(a) {
      var b = a.NAME;
      if (b === "Group") return "g." + a.VAL;
      else if (b === "Page") return "p." + a.VAL;
      else if (b === "User") return "u." + a.VAL;
      else
        return c("unrecoverableViolation")(
          "Not supported",
          "messenger_web_product"
        );
    }
    function f(a) {
      a = a.split(".");
      var b = a.length,
        c;
      if (b >= 3) c = [void 0, void 0];
      else
        switch (b) {
          case 0:
            c = [void 0, void 0];
            break;
          case 1:
            b = a[0];
            c = [b, void 0];
            break;
          case 2:
            b = a[0];
            a = a[1];
            c = /^[1-9]\d*$/.test(a) ? [b, a] : [void 0, void 0];
            break;
        }
      b = c[1];
      a = c[0];
      if (a === void 0) return;
      switch (a) {
        case "g":
          if (b !== void 0)
            return {
              NAME: "Group",
              VAL: b,
            };
          else return;
        case "p":
          if (b !== void 0)
            return {
              NAME: "Page",
              VAL: b,
            };
          else return;
        case "u":
          if (b !== void 0)
            return {
              NAME: "User",
              VAL: b,
            };
          else return;
        default:
          return;
      }
    }
    function h(a, b, e) {
      b = c("bs_caml_int64").of_int32(b);
      if (c("bs_caml").i64_eq(b, d("MessagingThreadType.bs").oneToOne))
        if (e)
          return {
            NAME: "Page",
            VAL: a,
          };
        else
          return {
            NAME: "User",
            VAL: a,
          };
      else if (
        c("bs_caml").i64_eq(b, d("MessagingThreadType.bs").marketplace) ||
        c("bs_caml").i64_eq(b, d("MessagingThreadType.bs").group)
      )
        return {
          NAME: "Group",
          VAL: a,
        };
      else return;
    }
    function i(a) {
      switch (a.targetType) {
        case "GROUP":
          return {
            NAME: "Group",
            VAL: a.targetID,
          };
        case "PAGE":
          return {
            NAME: "Page",
            VAL: a.targetID,
          };
        case "USER":
          return {
            NAME: "User",
            VAL: a.targetID,
          };
        default:
          return c("unrecoverableViolation")(
            "Invalid id",
            "messenger web product"
          );
      }
    }
    var j = {
      $eq: c("bs_caml_obj").caml_equal,
      eq: c("bs_caml_obj").caml_equal,
    };
    function k(a) {
      if (typeof a === "object") return a.NAME === "Page";
      else return !1;
    }
    function l(a) {
      if (typeof a === "object") return a.NAME === "User";
      else return !1;
    }
    function m(a) {
      if (typeof a === "object") return a.NAME === "UserSecret";
      else return !1;
    }
    function n(a) {
      a = a !== void 0 ? a : "";
      a = a.split(":");
      var b = a.length,
        c;
      if (b >= 3) c = [void 0, void 0];
      else
        switch (b) {
          case 0:
            c = [void 0, void 0];
            break;
          case 1:
            b = a[0];
            c = [b, void 0];
            break;
          case 2:
            b = a[0];
            a = a[1];
            c = [b, a];
            break;
        }
      b = c[1];
      a = c[0];
      if (a === void 0) return;
      switch (a) {
        case "thread":
          if (b !== void 0)
            return {
              NAME: "Group",
              VAL: b,
            };
          else return;
        case "user":
          if (b !== void 0)
            return {
              NAME: "User",
              VAL: b,
            };
          else return;
        default:
          return;
      }
    }
    g.getMercuryID = a;
    g.getFBID = b;
    g.serializeFuture = e;
    g.deserializeFuture = f;
    g.deserializeThreadlistIdUseOnlyInJewel = h;
    g.fromJs = i;
    g.Operators = j;
    g.isPage = k;
    g.isUser = l;
    g.isSecret = m;
    g.deserializeFromLegacyThreadId = n;
  },
  98
);

__d(
  "MAWThreadId",
  [
    "I64",
    "LSMessagingThreadTypeUtil.bs",
    "MAWGating",
    "ODS",
    "ReQL",
    "WALogger",
    "recoverableViolation",
    "regeneratorRuntime",
    "unrecoverableViolation",
  ],
  function (a, b, c, d, e, f, g) {
    "use strict";
    var h = d("I64").of_string("-1000");
    function a(a, e) {
      var f;
      return b("regeneratorRuntime").async(
        function (g) {
          while (1)
            switch ((g.prev = g.next)) {
              case 0:
                if (!d("MAWGating").isOccamadillo()) {
                  g.next = 7;
                  break;
                }
                g.next = 3;
                return b("regeneratorRuntime").awrap(
                  d("ReQL").firstAsync(
                    d("ReQL")
                      .fromTableAscending(
                        a.table("mi_act_mapping_table").index("chat_id")
                      )
                      .getKeyRange(d("I64").of_int32(e))
                  )
                );
              case 3:
                f = g.sent;
                if (!(f !== void 0)) {
                  g.next = 6;
                  break;
                }
                return g.abrupt("return", f.serverThreadKey);
              case 6:
                throw c("unrecoverableViolation")(
                  "Tried to convert a rowId to thread key but couldn't find a\n      corresponding row in the mapping table. This can mean that\n      there is a race condition between the time a thread was created\n      on the WA backend, and the time it was inserted into the mapping table.\n      i.e. this function is called before the fn that inserts the mapping\n      into the mapping table",
                  "messenger_web_product"
                );
              case 7:
                return g.abrupt(
                  "return",
                  d("I64").add(
                    d("I64").mul(d("I64").of_int32(e), d("I64").neg_one),
                    h
                  )
                );
              case 8:
              case "end":
                return g.stop();
            }
        },
        null,
        this
      );
    }
    var i = new Set();
    function e(a, c) {
      var e;
      return b("regeneratorRuntime").async(
        function (f) {
          while (1)
            switch ((f.prev = f.next)) {
              case 0:
                if (!d("MAWGating").isOccamadillo()) {
                  f.next = 8;
                  break;
                }
                f.next = 3;
                return b("regeneratorRuntime").awrap(
                  d("ReQL").firstAsync(
                    d("ReQL")
                      .fromTableAscending(
                        a.table("mi_act_mapping_table").index("chat_id")
                      )
                      .getKeyRange(d("I64").of_int32(c))
                  )
                );
              case 3:
                e = f.sent;
                if (!(e !== void 0)) {
                  f.next = 6;
                  break;
                }
                return f.abrupt("return", e.serverThreadKey);
              case 6:
                i.has(c) ||
                  (d("WALogger").WARN([
                    "[Occamadillo] Thread id: " +
                      c.toString() +
                      " is not yet in miActMapping table.",
                  ]),
                  d("ODS").bumpEntityKey(
                    5765,
                    "thread_not_in_miActMapping",
                    "[Occamadillo] Thread id: " +
                      c.toString() +
                      " is not yet in miActMapping table."
                  ),
                  i.add(c));
                return f.abrupt("return");
              case 8:
                return f.abrupt(
                  "return",
                  d("I64").add(
                    d("I64").mul(d("I64").of_int32(c), d("I64").neg_one),
                    h
                  )
                );
              case 9:
              case "end":
                return f.stop();
            }
        },
        null,
        this
      );
    }
    function j(a) {
      if (d("MAWGating").isOccamadillo()) {
        c("recoverableViolation")(
          "Checking if a threadKey is a secure thread key in Occamadillo. We should be\n      checking the thread's thread type instead",
          "messenger_web_product"
        );
        return !1;
      }
      return d("I64").compare(a, h) === -1;
    }
    function k(a, c) {
      var e;
      return b("regeneratorRuntime").async(
        function (f) {
          while (1)
            switch ((f.prev = f.next)) {
              case 0:
                if (!d("MAWGating").isOccamadillo()) {
                  f.next = 5;
                  break;
                }
                f.next = 3;
                return b("regeneratorRuntime").awrap(
                  d("ReQL").firstAsync(
                    d("ReQL")
                      .fromTableAscending(a.table("mi_act_mapping_table"))
                      .getKeyRange(c)
                  )
                );
              case 3:
                e = f.sent;
                return f.abrupt(
                  "return",
                  e !== void 0 ? d("I64").to_int32(e.clientThreadPk) : void 0
                );
              case 5:
                return f.abrupt(
                  "return",
                  j(c)
                    ? d("I64").to_int32(
                        d("I64").mul(d("I64").sub(c, h), d("I64").neg_one)
                      )
                    : void 0
                );
              case 6:
              case "end":
                return f.stop();
            }
        },
        null,
        this
      );
    }
    function f(a, e) {
      var f;
      return b("regeneratorRuntime").async(
        function (g) {
          while (1)
            switch ((g.prev = g.next)) {
              case 0:
                !d("MAWGating").isOccamadillo() &&
                  !j(e) &&
                  c("recoverableViolation")(
                    "We are using a thread key which is not a ChatId as a ChatId. This will likely result in a privacy SEV",
                    "messenger_web_product"
                  );
                g.next = 3;
                return b("regeneratorRuntime").awrap(k(a, e));
              case 3:
                f = g.sent;
                if (!(f === void 0)) {
                  g.next = 6;
                  break;
                }
                return g.abrupt("return", {
                  _0: void 0,
                  TAG: 1,
                });
              case 6:
                return g.abrupt("return", {
                  _0: f,
                  TAG: 0,
                });
              case 7:
              case "end":
                return g.stop();
            }
        },
        null,
        this
      );
    }
    function l(a, c) {
      var e;
      return b("regeneratorRuntime").async(
        function (f) {
          while (1)
            switch ((f.prev = f.next)) {
              case 0:
                f.next = 2;
                return b("regeneratorRuntime").awrap(
                  d("ReQL").firstAsync(
                    d("ReQL")
                      .fromTableAscending(a.table("threads"))
                      .getKeyRange(c)
                  )
                );
              case 2:
                e = f.sent;
                if (!(e === void 0)) {
                  f.next = 5;
                  break;
                }
                return f.abrupt("return");
              case 5:
                return f.abrupt("return", e.threadType);
              case 6:
              case "end":
                return f.stop();
            }
        },
        null,
        this
      );
    }
    function m(a, c) {
      var e;
      return b("regeneratorRuntime").async(
        function (f) {
          while (1)
            switch ((f.prev = f.next)) {
              case 0:
                if (!d("MAWGating").isOccamadillo()) {
                  f.next = 7;
                  break;
                }
                f.next = 3;
                return b("regeneratorRuntime").awrap(l(a, c));
              case 3:
                e = f.sent;
                if (!(e === void 0)) {
                  f.next = 6;
                  break;
                }
                return f.abrupt("return", !1);
              case 6:
                return f.abrupt(
                  "return",
                  d("LSMessagingThreadTypeUtil.bs").isSecure(e)
                );
              case 7:
                return f.abrupt("return", d("I64").compare(c, h) === -1);
              case 8:
              case "end":
                return f.stop();
            }
        },
        null,
        this
      );
    }
    g.toThreadKey_DEPRECATED = a;
    g.toThreadKeyMaybe = e;
    g.isThreadId = j;
    g.ofThreadKey = f;
    g.isSecureThreadId = m;
  },
  98
);

__d(
  "PagesCometMessageButton.react",
  [
    "fbt",
    "ix",
    "CometRelay",
    "CometTrackingNodeProvider.react",
    "PagesCometMessageButton_page.graphql",
    "TetraButton.react",
    "fbicon",
    "react",
    "usePagesCometMessage",
  ],
  function (a, b, c, d, e, f, g, h, i) {
    "use strict";
    var j,
      k = d("react");
    function a(a) {
      var e = a.disabled;
      e = e === void 0 ? !1 : e;
      var f = a.hideLabel;
      f = f === void 0 ? !0 : f;
      var g = a.location,
        l = a.logAction,
        m = a.messengerLsEntryPoint;
      a = a.page$key;
      a = d("CometRelay").useFragment(
        j !== void 0 ? j : (j = b("PagesCometMessageButton_page.graphql")),
        a
      );
      a = d("usePagesCometMessage").usePagesCometMessage(a, g, m, l);
      g = a[0];
      m = a[1];
      return g
        ? k.jsx(c("CometTrackingNodeProvider.react"), {
            trackingNode: 199,
            children: k.jsx(
              "div",
              {
                className: "x6s0dn4 x78zum5 x1i64zmx",
                "data-testid": void 0,
                children: k.jsx(
                  c("TetraButton.react"),
                  {
                    disabled: e,
                    icon: d("fbicon")._(i("505616"), 16),
                    label: h._("__JHASH__4qQOXx0pgR3__JHASH__"),
                    labelIsHidden: f,
                    onPress: m,
                    size: "medium",
                    type: "secondary",
                  },
                  "message"
                ),
              },
              "message"
            ),
          })
        : null;
    }
    a.displayName = a.name + " [from " + f.id + "]";
    g["default"] = a;
  },
  98
);

__d(
  "usePagesCometMessage",
  [
    "CometRelay",
    "PagesLogger",
    "PagesLoggerEventEnum",
    "PagesPageMessageClickFalcoEvent",
    "react",
    "useMWChatOpenTabForPage",
    "usePagesCometMessage_page.graphql",
  ],
  function (a, b, c, d, e, f, g) {
    "use strict";
    var h,
      i = d("react").useCallback;
    function a(a, e, f, g) {
      a = d("CometRelay").useFragment(
        h !== void 0 ? h : (h = b("usePagesCometMessage_page.graphql")),
        a
      );
      var j =
          (a == null ? void 0 : a.can_viewer_message) === !0 &&
          (a == null ? void 0 : a.should_hide_page_messaging_entrypoint) === !1,
        k = c("useMWChatOpenTabForPage")(f),
        l = a == null ? void 0 : a.id;
      f = i(
        function () {
          l != null &&
            j === !0 &&
            (k(l),
            g && g(e),
            c("PagesPageMessageClickFalcoEvent").log(function () {
              return { event_data: {}, event_location: e, page_id: l };
            }),
            d("PagesLogger").log(
              l,
              c("PagesLoggerEventEnum").CLICK,
              "page_message",
              e,
              ["page_consumer_experience"],
              {}
            ));
        },
        [j, e, k, l, g]
      );
      return [j, f];
    }
    g.usePagesCometMessage = a;
  },
  98
);

__d(
  "useMWChatOpenTabForPage",
  ["MWChatOpenTabForPage.bs", "react"],
  function (a, b, c, d, e, f, g) {
    "use strict";
    var h = d("react").useMemo;
    function a(a, b) {
      var c = {};
      b != null && (c.preventAutofocus = b.preventAutofocus_DO_NOT_USE);
      var e = d("MWChatOpenTabForPage.bs").useHook(c.preventAutofocus, a);
      return h(
        function () {
          return function (a, b) {
            return e(a, (a = b) != null ? a : !1);
          };
        },
        [e]
      );
    }
    g["default"] = a;
  },
  98
);
__d(
  "ProfileCometActionTrigger.react",
  [
    "CometRelay",
    "ProfileCometActionTrigger_action.graphql",
    "ProfileCometContext",
    "react",
  ],
  function (a, b, c, d, e, f, g) {
    "use strict";
    var h,
      i = d("react"),
      j = d("react").useContext;
    function a(a) {
      var e = a.action,
        f = a.children,
        g = a.onClose,
        k = a.popoverPosition,
        l = a.pushPage;
      a = a.source;
      e = d("CometRelay").useFragment(
        h !== void 0 ? h : (h = b("ProfileCometActionTrigger_action.graphql")),
        e
      );
      var m = j(c("ProfileCometContext"));
      m = m.isInViewAs;
      return m
        ? f({ disabled: !0 })
        : i.jsx(d("CometRelay").MatchContainer, {
            fallback: f({ disabled: !0 }),
            match: e.client_handler,
            props: {
              children: f,
              onClose: g,
              popoverPosition: k,
              pushPage: l,
              source: a,
            },
          });
    }
    a.displayName = a.name + " [from " + f.id + "]";
    g["default"] = a;
  },
  98
);

__d(
  "MWChatOpenTabForPage.bs",
  [
    "LSThreadAttributionStore.bs",
    "MWChatInteraction.bs",
    "MWChatStateActions.bs",
    "MWChatStateV2.bs",
    "MessagingThreadType.bs",
    "bs_caml_format",
    "bs_curry",
    "react",
    "recoverableViolation",
    "requireDeferred",
    "useCometFeedNoRoutingNavigationEventLogger",
    "useMWChatOpenTabTraceProvider",
  ],
  function (a, b, c, d, e, f, g) {
    "use strict";
    var h = d("react"),
      i = c("requireDeferred")("MWChatLogOpenChatTab.bs").__setRef(
        "MWChatOpenTabForPage.bs"
      );
    function a(a, b) {
      var e = a !== void 0 ? a : !1,
        f = c("useMWChatOpenTabTraceProvider")(),
        g = c("useCometFeedNoRoutingNavigationEventLogger")(),
        j = d("MWChatStateV2.bs").useDispatch();
      return h.useMemo(
        function () {
          return function (a, h) {
            g(Date.now(), "", "messenger");
            d("LSThreadAttributionStore.bs").setSource(a, b);
            i.onReady(function (d) {
              return c("bs_curry")._4(d.logOpenPageTab, void 0, a, b);
            });
            return f(
              function (b) {
                d("MWChatInteraction.bs").set(a, b);
                if (h) {
                  c("recoverableViolation")(
                    "Opening secure converstions with pages not supported",
                    "messenger_web_product"
                  );
                  return;
                } else
                  return c("bs_curry")._1(
                    j,
                    // here
                    d("MWChatStateActions.bs").openTab(
                      Date.now(),
                      { shouldFocus: !e },
                      {
                        _0: {
                          clientThreadKey: void 0,
                          threadKey:
                            c("bs_caml_format").caml_int64_of_string(a),
                          threadType: d("MessagingThreadType.bs").oneToOne,
                        },
                        TAG: 1,
                      }
                    )
                  );
              },
              "page",
              b,
              a
            );
          };
        },
        [g, f, e, b]
      );
    }
    g.$MWChatLogOpenChatTab$Deferred = i;
    g.useHook = a;
  },
  98
);

__d(
  "PagesCometMessageButton_page.graphql",
  [],
  function (a, b, c, d, e, f) {
    "use strict";
    a = {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "PagesCometMessageButton_page",
      selections: [
        {
          args: null,
          kind: "FragmentSpread",
          name: "usePagesCometMessage_page",
        },
      ],
      type: "Page",
      abstractKey: null,
    };
    e.exports = a;
  },
  null
);

__d(
  "MWV2OpenTabOrThread.bs",
  [
    "CurrentEnvironment",
    "JSScheduler",
    "LSMessagingThreadTypeUtil.bs",
    "LSThreadAttributionStore.bs",
    "MAWGating",
    "MWChatInteraction.bs",
    "MWChatStateActions.bs",
    "MWChatStateV2.bs",
    "MWInboxArchivedThreadsRouteBuilder.bs",
    "MWInboxBusinessSupportThreadsRouteBuilder.bs",
    "MWInboxMarketplaceThreadsRouteBuilder.bs",
    "MWInboxMessageRequestsRouteBuilder.bs",
    "MWInboxRouteBuilder.bs",
    "XCometGroupDiscussionControllerRouteBuilder",
    "XCometMessengerControllerRouteBuilder",
    "bs_belt_Option",
    "bs_caml_int64",
    "bs_caml_option",
    "bs_curry",
    "bs_int64",
    "cr:3904",
    "cr:3905",
    "gkx",
    "react",
    "useCometEntityKey",
    "useCometFeedNoRoutingNavigationEventLogger",
    "useCometRouterDispatcher",
    "useGroupThreadViewParams",
    "useMWV2ChatOpenTabTraceProvider",
    "useShouldShowMessagingEntrypointInCometRoot",
  ],
  function (a, b, c, d, e, f, g) {
    "use strict";
    var h = d("react"),
      i = h.createContext();
    function a(a) {
      var b = a.children;
      a = a.value;
      return h.createElement(i.Provider, {
        children: b,
        value: a,
      });
    }
    f = {
      make: a,
    };
    var j =
        b("cr:3904") == null ? void 0 : c("bs_caml_option").some(b("cr:3904")),
      k =
        b("cr:3905") == null ? void 0 : c("bs_caml_option").some(b("cr:3905"));
    function l(a) {
      var b = d("MWChatStateV2.bs").useDispatch(),
        e = c("useCometFeedNoRoutingNavigationEventLogger")(),
        f = c("useMWV2ChatOpenTabTraceProvider")();
      return h.useCallback(
        function (a) {
          return function (g, h) {
            e(Date.now(), "", "messenger");
            return f(
              function (e) {
                d("MWChatInteraction.bs").set(
                  c("bs_int64").to_string(a.threadKey),
                  e
                );
                return c("bs_curry")._1(
                  b,
                  d("MWChatStateActions.bs").openTab(
                    Date.now(),
                    {
                      shouldFocus: !0,
                    },
                    {
                      _0: a,
                      TAG: 1,
                    }
                  )
                );
              },
              c("bs_caml_int64").to_int32(a.threadType),
              h,
              c("bs_int64").to_string(a.threadKey)
            );
          };
        },
        [b, e, f]
      );
    }
    function m(a) {
      var e = c("useShouldShowMessagingEntrypointInCometRoot")("CHAT"),
        f = c("useCometRouterDispatcher")(),
        g = h.useContext(i),
        m = c("useGroupThreadViewParams")(),
        n = l(),
        o = c("bs_belt_Option").getWithDefault(
          c("bs_belt_Option").map(
            c("bs_caml_option").nullable_to_opt(c("useCometEntityKey")()),
            function (a) {
              return c("bs_caml_option").nullable_to_opt(a.entity_type);
            }
          )
        );
      return h.useMemo(
        function () {
          var a = function (a, e) {
              var f = c("bs_belt_Option").getWithDefault(g, function (a) {
                var f = c("bs_int64").to_string(a);
                if (!(b("cr:3905") == null)) {
                  if (
                    !d("MAWGating").isOccamadillo() &&
                    c("bs_curry")._1(k.isThreadId, a)
                  )
                    if (c("CurrentEnvironment").facebookdotcom)
                      return c(
                        "XCometMessengerControllerRouteBuilder"
                      ).buildURL({});
                    else return "/";
                  if (
                    d("MAWGating").isOccamadillo() &&
                    d("LSMessagingThreadTypeUtil.bs").isSecure(e)
                  )
                    return c("bs_curry")._1(
                      d("MWInboxRouteBuilder.bs").buildE2EEThreadURL,
                      {
                        thread_key: f,
                      }
                    );
                }
                if (!(m == null))
                  return c(
                    "XCometGroupDiscussionControllerRouteBuilder"
                  ).buildURL({
                    chats_to_open: [m.threadKey, c("bs_int64").to_string(a)],
                    idorvanity: m.groupId,
                  });
                if (o === void 0)
                  return c("bs_curry")._1(
                    d("MWInboxRouteBuilder.bs").buildURL,
                    {
                      thread_key: f,
                    }
                  );
                switch (o) {
                  case "archived":
                    return c("bs_curry")._1(
                      d("MWInboxArchivedThreadsRouteBuilder.bs").buildURL,
                      {
                        thread_key: f,
                      }
                    );
                  case "business_support":
                    return c("bs_curry")._1(
                      d("MWInboxBusinessSupportThreadsRouteBuilder.bs")
                        .buildURL,
                      {
                        thread_key: f,
                      }
                    );
                  case "marketplace":
                    return c("bs_curry")._1(
                      d("MWInboxMarketplaceThreadsRouteBuilder.bs").buildURL,
                      {
                        thread_key: f,
                      }
                    );
                  case "message_requests":
                    return c("bs_curry")._1(
                      d("MWInboxMessageRequestsRouteBuilder.bs").buildURL,
                      {
                        thread_key: f,
                      }
                    );
                  default:
                    return c("bs_curry")._1(
                      d("MWInboxRouteBuilder.bs").buildURL,
                      {
                        thread_key: f,
                      }
                    );
                }
              });
              return c("bs_curry")._1(f, a);
            },
            h = function (e) {
              var g = e.threadKey;
              !(b("cr:3905") == null) &&
                !(b("cr:3904") == null) &&
                !d("MAWGating").isOccamadillo() &&
                c("bs_curry")._1(k.isThreadId, g) &&
                c("bs_curry")._1(
                  j.setMostRecentSecureThreadKey,
                  c("bs_int64").to_string(g)
                );
              if (!(f == null)) {
                f.go(a(g, e.threadType));
                return;
              }
            },
            i = function (a, b) {
              return d("LSThreadAttributionStore.bs").setSource(
                c("bs_int64").to_string(a.threadKey),
                b
              );
            };
          return {
            getUrlFromThreadKey: a,
            openInbox: function (a, b) {
              i(a, b);
              return h(a);
            },
            openTabOrInbox: function (a, b, d) {
              a = a !== void 0 ? a : !0;
              i(b, d);
              if (e) return c("bs_curry")._3(n, b, a, d);
              else return h(b);
            },
          };
        },
        [e, f, n]
      );
    }
    function e(a, b) {
      var e = m(),
        f = c("useCometRouterDispatcher")();
      h.useEffect(function () {
        c("gkx")("6944") &&
          d("JSScheduler").scheduleSpeculativeCallback(function () {
            if (!(f == null)) {
              f.prefetchRouteDefinition(
                c("bs_curry")._2(e.getUrlFromThreadKey, a, b)
              );
              return;
            }
          });
      }, []);
    }
    g.$MAWSessionStorage$requireCondXplat = b("cr:3904");
    g.$MAWThreadId$requireCondXplat = b("cr:3905");
    g.Provider = f;
    g.useHook = m;
    g.usePreloadRoute = e;
  },
  98
);

__d("ProfileCometHeaderActionBarButton.react", ["CometLightweightGroupsActionSourceContext", "CometProgressRingIndeterminate.react", "CometRelay", "ProfileCometContextualProfileContext", "ProfileCometHeaderActionBarButtonWithoutIsActiveField_action.graphql", "ProfileCometHeaderActionBarButton_action.graphql", "QE2Logger", "TetraButton.react", "TetraIcon.react", "TintableIconSource", "coerceRelayImage", "react", "requireDeferred", "useProfileCometEngagementEventsClickCallback", "useProfileCometEngagementEventsImpression", "useProfileEngagementClickCallback"], (function(a, b, c, d, e, f, g) {
  "use strict";
  var h, i, j = d("react");
  e = d("react");
  var k = e.useContext
    , l = e.useEffect
    , m = c("requireDeferred")("GroupLwgUserEventsFalcoEvent").__setRef("ProfileCometHeaderActionBarButton.react");
  function a(a, e) {
      var f = a.action
        , g = a.actionBarSlot
        , i = a.labelIsHidden;
      i = i === void 0 ? !1 : i;
      var n = a.onPress
        , o = a.source;
      o = o === void 0 ? "WWW_COMET_PROFILE" : o;
      a = babelHelpers.objectWithoutPropertiesLoose(a, ["action", "actionBarSlot", "labelIsHidden", "onPress", "source"]);
      var p = d("CometRelay").useFragment(h !== void 0 ? h : h = b("ProfileCometHeaderActionBarButton_action.graphql"), f);
      f = k(c("ProfileCometContextualProfileContext"));
      var q = f.groupID
        , r = f.isContextualProfileView;
      f = f.userID;
      var s = k(c("CometLightweightGroupsActionSourceContext"))
        , t = s.lightweightGroupSource;
      s = (p.profile_action_type || "unknown").toLowerCase();
      var u = c("useProfileEngagementClickCallback")(r ? {
          event_metadata: {
              entry_point: s === "edit_contextual_profile" ? "self-view_edit_profile" : "",
              groupID: q
          },
          item_subtype: s === "edit_contextual_profile" ? "contextual_profile_edit" : null,
          item_type: s,
          product_bucket: "contextual_profile",
          profile_id_dummy: f,
          surface: "group_contextual_profile"
      } : {
          item_type: s,
          product_bucket: "action_bar",
          surface: o === "WWW_COMET_FRIENDSHIP_PAGE" ? "friends_page" : "timeline"
      }, n);
      r = {
          event_metadata: {
              action_bar_slot: g.toString(),
              is_primary: p.is_active.toString()
          },
          feature_item: s,
          feature_surface: null,
          profile_feature: "action",
          profile_section: "action_bar"
      };
      var v = c("useProfileCometEngagementEventsClickCallback")(r);
      f = c("useProfileCometEngagementEventsImpression")(r);
      o = p.primary_icon;
      n = p.title.text;
      l(function() {
          p.profile_action_type === "PROMOTE" && d("QE2Logger").logExposureForActingAccount("lwi_comet_promote_button_content_univ")
      }, [p.profile_action_type]);
      g = "";
      switch (p.profile_action_type) {
      case "EDIT_CONTEXTUAL_PROFILE":
          g = "EditContextualProfileActionBarButton";
          break;
      case "FRIEND":
          g = "add_button";
          break;
      case "MANAGE_MEMORIALIZED_ACCOUNT":
          g = "memorialization_manage_memorialization_button";
          break;
      case "JOIN_COMMUNITY":
          g = "community-profile-connection-button-" + ((r = (s = p.profile_owner) == null ? void 0 : s.subscribe_status) != null ? r : "");
          break;
      default:
          g = n
      }
      s = p.is_optimistic_update === !0;
      r = s ? j.jsx(c("CometProgressRingIndeterminate.react"), {
          color: a.disabled === !0 ? "disabled" : "dark",
          size: 16
      }) : void 0;
      g = !s && (o == null ? void 0 : o.uri) != null ? new (c("TintableIconSource"))("FB",c("coerceRelayImage")(o),16) : void 0;
      s = p.is_swapped_icon_alignment === !0;
      o = g !== void 0 ? j.jsx(c("TetraIcon.react"), {
          color: p.is_active === !0 ? "white" : "primary",
          icon: g
      }) : void 0;
      return j.jsx("div", {
          className: "" + (i ? "" : " xh8yej3"),
          ref: e,
          children: j.jsx(c("TetraButton.react"), babelHelpers["extends"]({}, a, {
              addOnPrimary: r,
              addOnSecondary: s ? o : void 0,
              icon: s ? void 0 : g,
              label: n,
              labelIsHidden: i,
              onPress: function(a) {
                  u(a),
                  v(),
                  q && t != null && p.profile_action_type === "MESSAGE" && m.onReady(function(a) {
                      a.log(function() {
                          return {
                              entry_point: t,
                              event: "click_send_message",
                              group_id: q,
                              source: t
                          }
                      })
                  })
              },
              reduceEmphasis: !1,
              ref: f,
              size: "medium",
              testid: void 0,
              tooltip: i ? n : null,
              type: p.is_active === !0 ? "primary" : "secondary"
          }))
      })
  }
  a.displayName = a.name + " [from " + f.id + "]";
  i !== void 0 ? i : i = b("ProfileCometHeaderActionBarButtonWithoutIsActiveField_action.graphql");
  e = j.forwardRef(a);
  g["default"] = e
}
), 98);