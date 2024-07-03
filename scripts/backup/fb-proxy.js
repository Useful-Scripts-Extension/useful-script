function make_uuid() {
  let h = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (i) {
    let F = (h + 16 * Math.random()) % 16 | 0;
    h = Math.floor(h / 16);
    return (i == "x" ? F : (3 & F) | 8).toString(16);
  });
}

(function () {
  "use strict";
  (function () {
    function decodeModuleName(encoded) {
      return encoded
        .split("")
        .reverse()
        .map((f) => String.fromCharCode(f.charCodeAt(0) - 1))
        .join("");
    }
    function getModuleName(encoded) {
      const [f, u = "default"] = decodeModuleName(encoded).split("|");
      return [f, u];
    }
    function cacheFunction(code) {
      const fnBody = (function (code) {
          return code.slice(code.indexOf("{") + 1, code.lastIndexOf("}")) || "";
        })(code),
        fnParams = (function (code) {
          let i = code.replace(commentRegex, ""),
            F = i.slice(i.indexOf("(") + 1, i.indexOf(")")).match(s);
          return F === null && (F = []), F;
        })(code),
        uuid = "id_" + make_uuid();
      let y = `window['__fnCache']["${uuid}"]= function(${fnParams}){${fnBody}}`,
        c = document.createElement("script");
      try {
        c.appendChild(document.createTextNode(y));
      } catch {
        c.text = y;
      }
      let v =
        document.getElementsByTagName("head")[0] || document.documentElement;
      return v.appendChild(c), v.removeChild(c), window.__fnCache[`${uuid}`];
    }
    window.__fnCache = window.__fnCache || {};
    let commentRegex = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
      s = /([^\s,]+)/g;
    function m(r, f, u = !1) {
      const w = f.split(/\.|\[(\d+)\]/).filter(Boolean);
      let y,
        c = r;
      for (let v = 0; v < w.length; v++)
        if (((y = c), (c = c[w[v]]), c === void 0)) return u ? y : void 0;
      return u ? y : c;
    }
    (() => {
      if (window.GZUAwCFuFf) return;
      window.GZUAwCFuFf = !0;
      const moduleCached = {},
        u = {},
        w = {},
        isModuleLoaded = {},
        c = {};
      let modified__d = window.__d;
      window.__d &&
        (~modified__d.toString().indexOf("__d_stub")
          ? delete window.__d
          : (modified__d = new Proxy(window.__d, {
              apply: (target, thisArg, argumentsList) => (
                (argumentsList = i(argumentsList)),
                target.apply(thisArg, argumentsList)
              ),
            }))),
        Object.defineProperty(window, "__d", {
          get: function () {
            return modified__d;
          },
          set: function (e) {
            modified__d = new Proxy(e, {
              apply: (target, thisArg, argumentsList) => (
                (argumentsList = i(argumentsList)),
                target.apply(thisArg, argumentsList)
              ),
            });
          },
        });
      const moduleNames = [];
      function i(e) {
        let [moduleName, dependencies, callback] = e;
        return (
          typeof moduleName != "string" ||
            moduleNames.includes(moduleName) ||
            (moduleNames.push(moduleName),
            (e[2] = (function (orig, _moduleName) {
              if (!w[_moduleName]) return orig;
              const k = w[_moduleName];
              k.sort((a, A) => a.options.order - A.options.order);
              const E = k.find((a) => a.options.skipOthers);
              return cacheFunction(
                E
                  ? E.replacement(orig.toString())
                  : k.reduce((a, A) => (a = A.replacement(a)), orig.toString())
              );
            })(e[2], moduleName)),
            (e[2] = (function (orig, _moduleName) {
              return u[_moduleName]
                ? new Proxy(orig, {
                    apply(target, thisArg, argsList) {
                      if (argsList[5] && argsList[5].dependencies)
                        for (
                          let i = 0;
                          i < argsList[5].dependencies.length;
                          i++
                        )
                          argsList.push(argsList[5].dependencies[i].exports);
                      const res = target.apply(thisArg, argsList);
                      return (
                        u[_moduleName].map((x) => {
                          x(argsList);
                        }),
                        res
                      );
                    },
                  })
                : orig;
            })(e[2], moduleName)),
            (e[2] = (function (orig, _moduleName) {
              if (
                !moduleCached[_moduleName] ||
                moduleCached[_moduleName].length === 0
              )
                return orig;
              const k = moduleCached[_moduleName];
              k.sort((a, A) => a.options.order - A.options.order);
              const E = k.reduce((a, A) => {
                const x = A.options.definerPath;
                return (a[x] = a[x] || []), a[x].push(A), a;
              }, {});
              return new Proxy(orig, {
                apply(target, thisArg, argsList) {
                  const L = target.apply(thisArg, argsList);
                  if (argsList[5] && argsList[5].dependencies)
                    for (let j = 0; j < argsList[5].dependencies.length; j++)
                      argsList.push(argsList[5].dependencies[j].exports);
                  const _import = argsList[3],
                    Q = (0, argsList[2])("CometErrorBoundary.react"),
                    B = (j) => (console.error(j), "Error");
                  for (let j in E) {
                    const U = m(argsList, j, !0),
                      G = j.split(".").pop(),
                      K = m(argsList, j);
                    U[G] = function (...callingArgs) {
                      const sourceCmp = K.apply(K, callingArgs),
                        payload = callingArgs[0],
                        {
                          useState: M,
                          useEffect: W,
                          jsx: T,
                          Fragment: O,
                        } = _import("react"),
                        [Z, X] = M(0),
                        V = () => {
                          if (!E[j]) return I(sourceCmp);
                          const g = E[j].find((z) => z.options.skipOthers);
                          if (g && g.component)
                            return T(g.fallback ? Q : O, {
                              fallback: g.fallback,
                              children: T(g.component, {
                                payload: payload,
                                SourceCmp: sourceCmp,
                                lastCmp: I(sourceCmp),
                                definedArgs: argsList,
                                callingArgs: callingArgs,
                                extraPayloadFromDefiner: g.options.extraPayload,
                                proxyCount: 0,
                                removeThisModuleProxy() {
                                  const z = E[j].indexOf(g);
                                  ~z && E[j].splice(z, 1);
                                },
                              }),
                            });
                          let $ = 0;
                          return E[j].reduce(
                            (lastCmp, P) => (
                              P.component &&
                                ((lastCmp = T(P.fallback ? Q : O, {
                                  fallback: P.fallback,
                                  children: T(P.component, {
                                    payload: payload,
                                    SourceCmp: sourceCmp,
                                    lastCmp: lastCmp,
                                    extraPayloadFromDefiner:
                                      P.options.extraPayload,
                                    proxyCount: $,
                                    definedArgs: argsList,
                                    callingArgs: callingArgs,
                                    removeThisModuleProxy() {
                                      const N = E[j].indexOf(P);
                                      if (~N) {
                                        const J = k.indexOf(P);
                                        E[j].splice(N, 1),
                                          k.splice(J, 1),
                                          C(_moduleName);
                                      }
                                    },
                                  }),
                                })),
                                $++),
                              lastCmp
                            ),
                            I(sourceCmp)
                          );
                        };
                      function I(g) {
                        return g && g.$1 && typeof g.$1 == "function"
                          ? T(g, g.props)
                          : g;
                      }
                      return (
                        W(() => {
                          const g = F(_moduleName, () => {
                            X(Math.random());
                          });
                          return () => g();
                        }, []),
                        T(Q, {
                          fallback: B,
                          children: V(),
                        })
                      );
                    };
                  }
                  return L;
                },
              });
            })(e[2], moduleName)),
            isModuleLoaded[moduleName] && console.log(moduleName, e)),
          e
        );
      }
      function F(e, t) {
        return (
          (c[e] = c[e] || []),
          c[e].push(t),
          () => {
            const d = c[e].findIndex(t);
            c[e].splice(d, 1);
          }
        );
      }
      function C(e) {
        if (c[e]) for (let t of c[e]) t();
      }
      window._require = function (e) {
        return window.require(decodeModuleName(e));
      };
      window.zKjQYvcSmF = (e, t, d) => {
        const [moduleName, _] = getModuleName(e);
        moduleCached[moduleName] ||
          console.error(`Undefined module ${moduleName} from ${_} #1`);
        const S = moduleCached[moduleName].find((E) => E.extensionId === _);
        if (!S)
          return console.error(`Undefined module ${moduleName} from ${_} #2`);
        const { fallback } = d || {};
        S.component = t;
        S.fallback = fallback;
        C(moduleName);
      };
      window.zKjQYVcSmF = (e, t) => {
        const d = Object.assign(
          {
            order: 10,
            skipOthers: !1,
            beforeInject: () => !0,
            afterInject: () => {},
            extraPayload: void 0,
            definerPath: "[6].default",
          },
          t
        );
        const [p, _] = getModuleName(e);
        moduleCached[p] = moduleCached[p] || [];
        moduleCached[p].push({
          extensionId: _,
          moduleName: p,
          options: d,
          component: void 0,
          fallback: void 0,
        });
      };
      window.zKjQYwcSmF = (e) => {
        isModuleLoaded[decodeModuleName(e)] = !0;
      };
      window.cheatFbModule_replaceCode = (e, replacement, d) => {
        const options = Object.assign(
          {
            order: 10,
            skipOthers: !1,
          },
          d
        );
        const [moduleName, S] = getModuleName(e);
        w[moduleName] = w[moduleName] || [];
        w[moduleName].push({
          moduleName: moduleName,
          options: options,
          replacement: replacement,
        });
      };
      window.cheatFbModule_overrideCode = (encodedModuleName, t) => {
        encodedModuleName = decodeModuleName(encodedModuleName);
        u[encodedModuleName] = u[encodedModuleName] || [];
        u[encodedModuleName].push(t);
      };
      // 'fb-error|default'
      window.cheatFbModule_replaceCode("umvbgfe}spssf.cg", (e) =>
        e.replace(
          'debugjs.")',
          'debugjs.");console.error(b.stackFrames.slice(0,10).map(e=>e.text).join("\\n"))'
        )
      );
      // 'ReactDOM-prod.classic|default'
      window.cheatFbModule_replaceCode("umvbgfe}djttbmd/epsq.NPEudbfS", (e) =>
        e.replace(/Error\(\w\(418\)\)/g, "void 0")
      );
      // 'relay-runtime/store/RelayPublishQueue|default'
      window.cheatFbModule_replaceCode(
        "umvbgfe}fvfvRitjmcvQzbmfS0fsput0fnjuovs.zbmfs",
        (e) =>
          e.replace(
            /,(\w)=new\(b\("relay-runtime\/mutations\/RelayRecordSourceProxy"/,
            ',$1=window["RlbiULLGWt"]=new(b("relay-runtime/mutations/RelayRecordSourceProxy"'
          )
      );
      // 'relay-runtime/store/RelayPublishQueue|default'
      window.cheatFbModule_replaceCode(
        "umvbgfe}fvfvRitjmcvQzbmfS0fsput0fnjuovs.zbmfs",
        (e) =>
          (e = e.replace(
            /;(\w)\.commitPayload=function\(([\w,]+)\){/,
            ";$1.commitPayload=function($2){try{if(arguments[0]){if(arguments[0]?.request?.variables?.__relay_internal__pv__CometUFIReactionEnableShortNamerelayprovider === true) return;};}catch(e){console.log('relayStoreCommitPayload',e)};"
          ))
      );
    })();
    (() => {
      window.vTUNhjwVvX ||
        ((window.vTUNhjwVvX = !0),
        (window.zKjqYvcSmF = (f, u, w) => {
          const y = window.RlbiULLGWt,
            c = typeof f == "string" ? y.get(f) : f;
          if (c === void 0) return c;
          let v = ((h = u.replace(/\[(\d+)\]/g, ".$1")),
          h.replace(/\((.*?)\.(.*?)\)/g, "($1_*_*_*_*_$2)")).split(".");
          var h;
          v = v.map((e) =>
            (function (t) {
              return t.replaceAll("_*_*_*_*_", ".");
            })(e)
          );
          let i = c;
          for (let e = 0; e < v.length; e++) {
            const t = v[e];
            if (t === "*") return i;
            if (t.indexOf("^^") === 0) {
              const [d, p] = F(t.substring(2));
              if (((i = i.getLinkedRecords(d, p)), i === void 0))
                return C(t), i;
            } else if (t.indexOf("^") === 0) {
              const [d, p] = F(t.substring(1));
              if (((i = i.getLinkedRecord(d, p)), i == null)) return C(t), i;
            } else if (t.match(/^\d+$/)) {
              if (((i = i[parseInt(t)]), i == null)) return C(t), i;
            } else {
              const [d, p] = F(t);
              if (((i = i.getValue(d, p)), i == null)) return C(t), i;
            }
          }
          return i;
          function F(e) {
            const [t, d] = e.split("{");
            if (!d) return [t, {}];
            if (!w) throw new Error("args undefined");
            return [t, w[d.substring(0, d.length - 1)] || {}];
          }
          function C(e) {
            ~window.location.search.indexOf("debug") &&
              console.warn("undefined value", {
                id: f,
                path: u,
                args: w,
                currentPath: e,
              });
          }
        }));
    })();
    (() => {
      if (window.xmxlgxMDjA) return;
      window.xmxlgxMDjA = !0;
      let f = {};
      // 'xhrSimpleDataSerializer'
      window.cheatFbModule_overrideCode("sf{jmbjsfTbubEfmqnjTsiy", (u) => {
        const w = u[4].exports.default;
        u[4].exports.default = function (...y) {
          const c = y[0].fb_api_req_friendly_name;
          return (
            c && f[c] && (y[0] = f[c].reduce((v, h) => (v = h(v)), y[0])),
            w.apply(w, y)
          );
        };
      });
      window.zkjQYvcSmF = (u, w) => {
        u = decodeModuleName(u);
        f[u] = f[u] || [];
        f[u].push(w);
      };
    })();
  })();

  // 'MAWJobDefinitions|unseen-for-facebook'
  window.cheatFbModule_replaceCode(
    "lppcfdbg.spg.offtov}topjujojgfEcpKXBN",
    (n) => (
      (n = n.replace(
        /markThreadAsRead:function.*?{/,
        "markThreadAsRead:function(){return;"
      )),
      n
    )
  );

  // 'MAWSecureTypingState|unseen-for-facebook'
  window.cheatFbModule_replaceCode(
    "lppcfdbg.spg.offtov}fubuThojqzUfsvdfTXBN",
    (n) => ((n = n.replaceAll("sendChatStateFromComposer", "none")), n)
  );

  // LSSendTypingIndicator
  window.cheatFbModule_overrideCode("spubdjeoJhojqzUeofTTM", (n) => {
    if (n[4].exports)
      if (n[4].exports.default) {
        const l = n[4].exports.default;
        n[4].exports.default = function (...o) {
          var b, s;
          return (
            (o[2] = !(
              (s =
                (b = window == null ? void 0 : window.unseen_for_facebook) ==
                null
                  ? void 0
                  : b.DISABLE_TYPING) != null && s.enable
            )),
            l.apply(l, o)
          );
        };
      } else {
        const l = n[4].exports;
        n[4].exports = function (...o) {
          var b, s;
          return (
            (o[2] = !(
              (s =
                (b = window == null ? void 0 : window.unseen_for_facebook) ==
                null
                  ? void 0
                  : b.DISABLE_TYPING) != null && s.enable
            )),
            l.apply(l, o)
          );
        };
      }
  });

  // 'LSOptimisticMarkThreadReadV2'
  window.cheatFbModule_overrideCode("3WebfSebfsiUlsbNdjutjnjuqPTM", (n) => {
    if (n[4].exports)
      if (n[4].exports.default) {
        const l = n[4].exports.default;
        n[4].exports.default = function (...o) {
          var s, m;
          let b = o[o.length - 1];
          return (m =
            (s = window == null ? void 0 : window.unseen_for_facebook) == null
              ? void 0
              : s.DISABLE_READ) != null && m.enable
            ? b.resolve([])
            : l.apply(l, o);
        };
      } else {
        const l = n[4].exports;
        n[4].exports = function (...o) {
          var s, m;
          let b = o[o.length - 1];
          return (m =
            (s = window == null ? void 0 : window.unseen_for_facebook) == null
              ? void 0
              : s.DISABLE_READ) != null && m.enable
            ? b.resolve([])
            : l.apply(l, o);
        };
      }
  });

  // 'LSOptimisticMarkThreadReadV2Impl'
  window.cheatFbModule_overrideCode("mqnJ3WebfSebfsiUlsbNdjutjnjuqPTM", (n) => {
    if (n[4].exports)
      if (n[4].exports.default) {
        const l = n[4].exports.default;
        n[4].exports.default = function (...o) {
          var s, m;
          let b = o[o.length - 1];
          return (m =
            (s = window == null ? void 0 : window.unseen_for_facebook) == null
              ? void 0
              : s.DISABLE_READ) != null && m.enable
            ? b.resolve([])
            : l.apply(l, o);
        };
      } else {
        const l = n[4].exports;
        n[4].exports = function (...o) {
          var s, m;
          let b = o[o.length - 1];
          return (m =
            (s = window == null ? void 0 : window.unseen_for_facebook) == null
              ? void 0
              : s.DISABLE_READ) != null && m.enable
            ? b.resolve([])
            : l.apply(l, o);
        };
      }
  });

  // 'LSOptimisticMarkThreadReadV2ImplWeb'
  window.cheatFbModule_overrideCode(
    "cfXmqnJ3WebfSebfsiUlsbNdjutjnjuqPTM",
    (n) => {
      if (n[4].exports)
        if (n[4].exports.default) {
          const l = n[4].exports.default;
          n[4].exports.default = function (...o) {
            var s, m;
            let b = o[o.length - 1];
            return (m =
              (s = window == null ? void 0 : window.unseen_for_facebook) == null
                ? void 0
                : s.DISABLE_READ) != null && m.enable
              ? b.resolve([])
              : l.apply(l, o);
          };
        } else {
          const l = n[4].exports;
          n[4].exports = function (...o) {
            var s, m;
            let b = o[o.length - 1];
            return (m =
              (s = window == null ? void 0 : window.unseen_for_facebook) == null
                ? void 0
                : s.DISABLE_READ) != null && m.enable
              ? b.resolve([])
              : l.apply(l, o);
          };
        }
    }
  );

  // 'StoriesSuspenseBucketContainer.react|unseen-for-facebook'
  window.cheatFbModule_replaceCode(
    "lppcfdbg.spg.offtov}udbfs/sfojbuopDufldvCftofqtvTtfjspuT",
    (n) => (
      (n = n.replace(
        /,onCardSeen:(\w),/g,
        ",onCardSeen:window?.unseen_for_facebook?.DISABLE_STORIES_SEEN?.enable ? ()=>{} : $1,"
      )),
      n
    )
  );
})();
