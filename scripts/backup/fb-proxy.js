(function () {
  "use strict";
  (function () {
    function n(r) {
      return r
        .split("")
        .reverse()
        .map((f) => String.fromCharCode(f.charCodeAt(0) - 1))
        .join("");
    }
    function l(r) {
      const [f, u = "default"] = n(r).split("|");
      return [f, u];
    }
    function cacheFunction(code) {
      const fnBody = (function (code) {
          return code.slice(code.indexOf("{") + 1, code.lastIndexOf("}")) || "";
        })(code),
        fnParams = (function (code) {
          let i = code.replace(b, ""),
            F = i.slice(i.indexOf("(") + 1, i.indexOf(")")).match(s);
          return F === null && (F = []), F;
        })(code),
        uuid =
          "id_" +
          (function () {
            let h = new Date().getTime();
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
              /[xy]/g,
              function (i) {
                var F = (h + 16 * Math.random()) % 16 | 0;
                return (
                  (h = Math.floor(h / 16)),
                  (i == "x" ? F : (3 & F) | 8).toString(16)
                );
              }
            );
          })();
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
    let b = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
      s = /([^\s,]+)/g;
    function m(r, f, u = !1) {
      const w = f.split(/\.|\[(\d+)\]/).filter(Boolean);
      let y,
        c = r;
      for (let v = 0; v < w.length; v++)
        if (((y = c), (c = c[w[v]]), c === void 0)) return u ? y : void 0;
      return u ? y : c;
    }
    ((r) => {
      if (window.GZUAwCFuFf) return;
      window.GZUAwCFuFf = !0;
      const f = {},
        u = {},
        w = {},
        y = {},
        c = {};
      let v = window.__d;
      window.__d &&
        (~v.toString().indexOf("__d_stub")
          ? delete window.__d
          : (v = new Proxy(window.__d, {
              apply: (e, t, d) => ((d = i(d)), e.apply(t, d)),
            }))),
        Object.defineProperty(window, "__d", {
          get: function () {
            return v;
          },
          set: function (e) {
            v = new Proxy(e, {
              apply: (t, d, p) => ((p = i(p)), t.apply(d, p)),
            });
          },
        });
      const h = [];
      function i(e) {
        let [t, d, p] = e;
        return (
          typeof t != "string" ||
            h.includes(t) ||
            (h.push(t),
            (e[2] = (function (_, S) {
              if (!w[S]) return _;
              const k = w[S];
              k.sort((a, A) => a.options.order - A.options.order);
              const E = k.find((a) => a.options.skipOthers);
              return cacheFunction(
                E
                  ? E.replacement(_.toString())
                  : k.reduce((a, A) => (a = A.replacement(a)), _.toString())
              );
            })(e[2], t)),
            (e[2] = (function (_, S) {
              return u[S]
                ? new Proxy(_, {
                    apply(k, E, a) {
                      if (a[5] && a[5].dependencies)
                        for (let x = 0; x < a[5].dependencies.length; x++)
                          a.push(a[5].dependencies[x].exports);
                      const A = k.apply(E, a);
                      return (
                        u[S].map((x) => {
                          x(a);
                        }),
                        A
                      );
                    },
                  })
                : _;
            })(e[2], t)),
            (e[2] = (function (_, S) {
              if (!f[S] || f[S].length === 0) return _;
              const k = f[S];
              k.sort((a, A) => a.options.order - A.options.order);
              const E = k.reduce((a, A) => {
                const x = A.options.definerPath;
                return (a[x] = a[x] || []), a[x].push(A), a;
              }, {});
              return new Proxy(_, {
                apply(a, A, x) {
                  const L = a.apply(A, x);
                  if (x[5] && x[5].dependencies)
                    for (let j = 0; j < x[5].dependencies.length; j++)
                      x.push(x[5].dependencies[j].exports);
                  const q = x[3],
                    Q = (0, x[2])("CometErrorBoundary.react"),
                    B = (j) => (console.error(j), "Error");
                  for (let j in E) {
                    const U = m(x, j, !0),
                      G = j.split(".").pop(),
                      K = m(x, j);
                    U[G] = function (...D) {
                      const Y = K.apply(K, D),
                        R = D[0],
                        {
                          useState: M,
                          useEffect: W,
                          jsx: T,
                          Fragment: O,
                        } = q("react"),
                        [Z, X] = M(0),
                        V = () => {
                          if (!E[j]) return I(Y);
                          const g = E[j].find((z) => z.options.skipOthers);
                          if (g && g.component)
                            return T(g.fallback ? Q : O, {
                              fallback: g.fallback,
                              children: T(g.component, {
                                payload: R,
                                SourceCmp: Y,
                                lastCmp: I(Y),
                                definedArgs: x,
                                callingArgs: D,
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
                            (z, P) => (
                              P.component &&
                                ((z = T(P.fallback ? Q : O, {
                                  fallback: P.fallback,
                                  children: T(P.component, {
                                    payload: R,
                                    SourceCmp: Y,
                                    lastCmp: z,
                                    extraPayloadFromDefiner:
                                      P.options.extraPayload,
                                    proxyCount: $,
                                    definedArgs: x,
                                    callingArgs: D,
                                    removeThisModuleProxy() {
                                      const N = E[j].indexOf(P);
                                      if (~N) {
                                        const J = k.indexOf(P);
                                        E[j].splice(N, 1), k.splice(J, 1), C(S);
                                      }
                                    },
                                  }),
                                })),
                                $++),
                              z
                            ),
                            I(Y)
                          );
                        };
                      function I(g) {
                        return g && g.$1 && typeof g.$1 == "function"
                          ? T(g, g.props)
                          : g;
                      }
                      return (
                        W(() => {
                          const g = F(S, () => {
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
            })(e[2], t)),
            y[t] && console.log(t, e)),
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
      (r.zKjQYvgSmF = function (e) {
        return window.require(n(e));
      }),
        (r.zKjQYvcSmF = (e, t, d) => {
          const [p, _] = l(e);
          f[p] || console.error(`Undefined module ${p} from ${_} #1`);
          const S = f[p].find((E) => E.extensionId === _);
          if (!S) return console.error(`Undefined module ${p} from ${_} #2`);
          const { fallback: k } = d || {};
          (S.component = t), (S.fallback = k), C(p);
        }),
        (r.zKjQYVcSmF = (e, t) => {
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
            ),
            [p, _] = l(e);
          (f[p] = f[p] || []),
            f[p].push({
              extensionId: _,
              moduleName: p,
              options: d,
              component: void 0,
              fallback: void 0,
            });
        }),
        (r.zKjQYwcSmF = (e) => {
          y[n(e)] = !0;
        }),
        (r.zKjQYvcSfF = (e, t, d) => {
          const p = Object.assign(
              {
                order: 10,
                skipOthers: !1,
              },
              d
            ),
            [_, S] = l(e);
          (w[_] = w[_] || []),
            w[_].push({
              moduleName: _,
              options: p,
              replacement: t,
            });
        }),
        (r.zKGQYvcSmF = (e, t) => {
          (e = n(e)), (u[e] = u[e] || []), u[e].push(t);
        }),
        r.zKjQYvcSfF("umvbgfe}spssf.cg", (e) =>
          e.replace(
            'debugjs.")',
            'debugjs.");console.error(b.stackFrames.slice(0,10).map(e=>e.text).join("\\n"))'
          )
        ),
        r.zKjQYvcSfF("umvbgfe}djttbmd/epsq.NPEudbfS", (e) =>
          e.replace(/Error\(\w\(418\)\)/g, "void 0")
        ),
        r.zKjQYvcSfF("umvbgfe}fvfvRitjmcvQzbmfS0fsput0fnjuovs.zbmfs", (e) =>
          e.replace(
            /,(\w)=new\(b\("relay-runtime\/mutations\/RelayRecordSourceProxy"/,
            ',$1=window["RlbiULLGWt"]=new(b("relay-runtime/mutations/RelayRecordSourceProxy"'
          )
        ),
        r.zKjQYvcSfF(
          "umvbgfe}fvfvRitjmcvQzbmfS0fsput0fnjuovs.zbmfs",
          (e) =>
            (e = e.replace(
              /;(\w)\.commitPayload=function\(([\w,]+)\){/,
              ";$1.commitPayload=function($2){try{if(arguments[0]){if(arguments[0]?.request?.variables?.__relay_internal__pv__CometUFIReactionEnableShortNamerelayprovider === true) return;};}catch(e){console.log('relayStoreCommitPayload',e)};"
            ))
        );
    })(window),
      ((r) => {
        r.vTUNhjwVvX ||
          ((r.vTUNhjwVvX = !0),
          (r.zKjqYvcSmF = (f, u, w) => {
            const y = r.RlbiULLGWt,
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
              ~r.location.search.indexOf("debug") &&
                console.warn("undefined value", {
                  id: f,
                  path: u,
                  args: w,
                  currentPath: e,
                });
            }
          }));
      })(window),
      ((r) => {
        if (window.xmxlgxMDjA) return;
        window.xmxlgxMDjA = !0;
        let f = {};
        r.zKGQYvcSmF("sf{jmbjsfTbubEfmqnjTsiy", (u) => {
          const w = u[4].exports.default;
          u[4].exports.default = function (...y) {
            const c = y[0].fb_api_req_friendly_name;
            return (
              c && f[c] && (y[0] = f[c].reduce((v, h) => (v = h(v)), y[0])),
              w.apply(w, y)
            );
          };
        }),
          (r.zkjQYvcSmF = (u, w) => {
            (u = n(u)), (f[u] = f[u] || []), f[u].push(w);
          });
      })(window);
  })(),
    window.zKjQYvcSfF(
      "lppcfdbg.spg.offtov}topjujojgfEcpKXBN",
      (n) => (
        (n = n.replace(
          /markThreadAsRead:function.*?{/,
          "markThreadAsRead:function(){return;"
        )),
        n
      )
    ),
    window.zKjQYvcSfF(
      "lppcfdbg.spg.offtov}fubuThojqzUfsvdfTXBN",
      (n) => ((n = n.replaceAll("sendChatStateFromComposer", "none")), n)
    ),
    window.zKGQYvcSmF("spubdjeoJhojqzUeofTTM", (n) => {
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
    }),
    window.zKGQYvcSmF("3WebfSebfsiUlsbNdjutjnjuqPTM", (n) => {
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
    }),
    window.zKGQYvcSmF("mqnJ3WebfSebfsiUlsbNdjutjnjuqPTM", (n) => {
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
    }),
    window.zKGQYvcSmF("cfXmqnJ3WebfSebfsiUlsbNdjutjnjuqPTM", (n) => {
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
    }),
    window.zKjQYvcSfF(
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
