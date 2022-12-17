require("MWChatStateActions.bs").openTab(
  Date.now(),
  { shouldFocus: true },
  {
    _0: {
      clientThreadKey: void 0,
      threadKey: require("bs_caml_format").caml_int64_of_string(a),
      threadType: require("MessagingThreadType.bs").oneToOne,
    },
    TAG: 1,
  }
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
