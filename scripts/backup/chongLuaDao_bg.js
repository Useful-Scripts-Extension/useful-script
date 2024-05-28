! function(e) {
    var t = {};
    function n(i) {
        if (t[i]) return t[i].exports;
        var r = t[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(r.exports, r, r.exports, n), r.l = !0, r.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var r in e) n.d(i, r, function(t) {
                return e[t]
            }.bind(null, r));
        return i
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 0)
}([function(e, t) {
    window.isWhiteList = {}, window.isBlocked = {}, window.results = {}, window.isPhish = {}, window.legitimatePercents = {};
    let blackList = [];
    const whiteList = [];
    let r = !1;
    const o = e => {
            chrome.storage.local.get(["cache", "cacheTime"], t => {
                if (t.cache && t.cacheTime) return e(t.cache);
                (e => {
                    fetch("https://api.chongluadao.vn/classifier.json")
                        .then(e => e.json())
                        .then(t => {
                            chrome.storage.local.set({
                                cache: t,
                                cacheTime: Date.now()
                            }, () => e(t))
                        })
                })(e)
            })
        },
        s = (e, t, n) => {
            if (window.isWhiteList[e] == n) return;
            let i = 0,
                r = 0,
                s = 0;
            for (const e in t) "1" == t[e] ? s++ : "0" == t[e] ? r++ : i++;
            if (window.legitimatePercents[e] = i / (s + r + i) * 100, t.length) {
                const n = [t.map(e => parseInt(e))];
                o((function(t) {
                    const i = (e => ({
                        predict: t => {
                            let n = [e.estimators.map(e => (e => {
                                    const t = t => {
                                        let n = e;
                                        for (;
                                            "split" == n.type;) {
                                            const e = n.threshold.split(" <= ");
                                            n = t[e[0]] <= e[1] ? n.left : n.right
                                        }
                                        return n.value[0]
                                    };
                                    return {
                                        predict: e => e.map(e => t(e)),
                                        predictOne: t
                                    }
                                })(e)
                                .predict(t))];
                            n = n[0].map((e, t) => n.map(e => e[t]));
                            const i = [];
                            for (const e in n) {
                                let t = 0,
                                    r = 0;
                                for (const i in n[e]) t += n[e][i][1], r += n[e][i][0];
                                i.push([t >= r, Math.max(t, r)])
                            }
                            return i
                        }
                    }))(t);
                    window.isPhish[e] = i.predict(n)[0][0], window.isPhish[e] && window.legitimatePercents[e] > 60 && (window.isPhish[e] = !1), l(window.isPhish[e], window.legitimatePercents[e], e)
                }))
            }
        },
        c = () => {
            fetch("https://api.chongluadao.vn/v2/blacklist")
                .then(e => e.json())
                .then(e => {
                    e.forEach(e => {
                        blackList.push(e.url)
                    })
                })
                .catch(() => {}), fetch("https://api.chongluadao.vn/v2/whitelist")
                .then(e => e.json())
                .then(e => {
                    e.forEach(e => {
                        whiteList.push(e.url)
                    })
                })
                .catch(() => {})
        },
        redirectToBlocking = (e, t, n) => {
            const i = {
                site: e,
                match: t,
                title: e,
                lenient: r,
                favicon: "https://www.google.com/s2/favicons?domain=" + e
            };
            window.isBlocked[n] = e, chrome.browserAction.setIcon({
                path: "../assets/cldvn_red.png",
                tabId: n
            });
            return {
                redirectUrl: `${chrome.extension.getURL("blocking.html")}#${JSON.stringify(i)}`
            }
        },
        makeURL = e => {
            try {
                return new URL(e)
            } catch (e) {
                return
            }
        },
        l = (e, t, n) => {
            if (chrome.browserAction.setTitle({
                    title: `P:${e} per: ${t}`
                }), e) return chrome.browserAction.setIcon({
                path: "../assets/cldvn_red.png",
                tabId: n
            });
            chrome.browserAction.setIcon({
                path: "../assets/cldvn128.png",
                tabId: n
            })
        },
        getHost = e => {
            const t = e.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
            return t && t[1]
        };
    chrome.runtime.onStartup.addListener(c), chrome.runtime.onInstalled.addListener(() => {
        c(), chrome.notifications.create({
            type: "basic",
            iconUrl: chrome.extension.getURL("assets/logo.png"),
            title: "Cài đặt thành công!",
            message: "Khởi động lại trình duyệt của bạn để có thể bắt đầu sử dụng ChongLuaDao. Xin cảm ơn!"
        })
    }), chrome.tabs.onActivated.addListener((e = null) => {
        if (e && e.tabId) return l(window.isPhish[e.tabId], window.legitimatePercents[e.tabId], e.tabId);
        chrome.tabs.query({
            active: !0,
            currentWindow: !0
        }, ([e]) => {
            l(window.isPhish[e.id], window.legitimatePercents[e.id], e.id)
        })
    }), chrome.tabs.onUpdated.addListener((e, t, n) => {
        "complete" == n.status && chrome.tabs.sendMessage(n.id, n)
    }), chrome.runtime.onConnect.addListener(e => {
        switch (e.name) {
            case "REDIRECT_PORT_NAME":
                e.onMessage.addListener(e => {
                    chrome.tabs.query({
                        currentWindow: !0,
                        active: !0
                    }, ([t]) => {
                        chrome.tabs.update(t.id, {
                            url: e.redirect
                        })
                    })
                });
                break;
            case "CLOSE_TAB_PORT_NAME":
                e.onMessage.addListener(e => {
                    e.close_tab && chrome.tabs.query({
                        currentWindow: !0,
                        active: !0
                    }, ([e]) => {
                        chrome.tabs.remove(e.id)
                    })
                });
                break;
            case "ML_PORT_NAME":
                e.onMessage.addListener(e => {
                    const {
                        request: t
                    } = e;
                    void 0 !== t.input_block_list && (blackList = t.input_block_list, r = t.input_block_lenient), chrome.tabs.query({
                        currentWindow: !0,
                        active: !0
                    }, ([e]) => {
                        window.results[e.id] = t, s(e.id, t, e.url)
                    })
                })
        }
    }), chrome.webRequest.onBeforeRequest.addListener(({
        url: url,
        tabId: tabId,
        initiator: initiator
    }) => {
        if (!url || 0 === url.indexOf("chrome://") || 0 === url.indexOf(chrome.extension.getURL("/"))) return;
        if (!blackList || !blackList.length) return;
        if (localStorage.getItem("whiteList")) return localStorage.removeItem("whiteList");
        const _blackList = blackList,
            _url = makeURL(url),
            psl_res = psl.parse(_url.host),
            l = _url.href.replaceAll("/", "");
        for (let n = 0; n < _blackList.length; ++n) {
            const black_url = makeURL(_blackList[n]);
            if (!black_url) continue;
            const firstPart = black_url.host.split(".")[0],
                pathName = black_url.pathname;
            if ("%2A" == firstPart) {
                if (black_url.host.slice(4, black_url.host.length) == psl_res.domain) return redirectToBlocking(url, black_url.host, tabId)
            }
            if ("/*" == pathName && _url.host === black_url.host) return redirectToBlocking(url, black_url.host, tabId);
            if (l && l == black_url.href.replaceAll("/", "")) return redirectToBlocking(url, black_url.host, tabId)
        }
        const hostName = getHost(initiator || url);
        whiteList.find(e => e.includes(hostName)) && (window.isWhiteList[tabId] = hostName)
    }, {
        urls: ["*://*/*"],
        types: ["main_frame", "sub_frame"]
    }, ["blocking"])
}]);