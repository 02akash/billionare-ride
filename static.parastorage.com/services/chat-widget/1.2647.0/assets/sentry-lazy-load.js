! function(t, n, e, o, c, i, r, a, f) {
    function s(r) {
        if (!l) {
            l = !0;
            const a = n.getElementsByTagName(e)[0],
                s = n.createElement(e);
            s.src = "https://browser.sentry-cdn.com/5.7.1/bundle.min.js", s.crossorigin = "anonymous", s.addEventListener("load", (function() {
                try {
                    t[o] = b, t[c] = m;
                    const n = t[i],
                        e = n.init;
                    n.init = function(t) {
                            for (const n in t) Object.prototype.hasOwnProperty.call(t, n) && (f[n] = t[n]);
                            e(f)
                        },
                        function(n, e) {
                            try {
                                for (var i = y.data, r = 0; r < n.length; r++) "function" == typeof n[r] && n[r]();
                                let a = !1,
                                    f = t.__SENTRY__;
                                for (void 0 !== f && f.hub && f.hub.getClient() && (a = !0), f = !1, r = 0; r < i.length; r++)
                                    if (i[r].f) {
                                        f = !0;
                                        const t = i[r];
                                        !1 === a && "init" !== t.f && e.init(), a = !0, e[t.f].apply(e, t.a)
                                    }!1 === a && !1 === f && e.init();
                                const s = t[o],
                                    p = t[c];
                                for (r = 0; r < i.length; r++) i[r].e && s ? s.apply(t, i[r].e) : i[r].p && p && p.apply(t, [i[r].p])
                            } catch (t) {
                                console.error(t)
                            }
                        }(r, n)
                } catch (t) {
                    console.error(t)
                }
            })), a.parentNode.insertBefore(s, a)
        }
    }
    for (var p = !0, u = !1, d = 0; d < document.scripts.length; d++)
        if (-1 < document.scripts[d].src.indexOf("cbb1f5b485d944d2bf799cc46674093c")) {
            p = "no" !== document.scripts[d].getAttribute("data-lazy");
            break
        }
    var l = !1,
        h = [],
        y = function(t) {
            (t.e || t.p || t.f && -1 < t.f.indexOf("capture") || t.f && -1 < t.f.indexOf("showReportDialog")) && p && s(h), y.data.push(t)
        };
    y.data = [], t[i] = t[i] || {}, t[i].onLoad = function(t) {
        h.push(t), p && !u || s(h)
    }, t[i].forceLoad = function() {
        u = !0, p && setTimeout((function() {
            s(h)
        }))
    }, "init addBreadcrumb captureMessage captureException captureEvent configureScope withScope showReportDialog".split(" ").forEach((function(n) {
        t[i][n] = function() {
            y({
                f: n,
                a: arguments
            })
        }
    }));
    var b = t[o];
    t[o] = function(n, e, o, c, i) {
        y({
            e: [].slice.call(arguments)
        }), b && b.apply(t, arguments)
    };
    var m = t[c];
    t[c] = function(n) {
        y({
            p: n.reason
        }), m && m.apply(t, arguments)
    }, p || setTimeout((function() {
        s(h)
    }))
}(window, document, "script", "onerror", "onunhandledrejection", "Sentry", 0, 0, {
    dsn: "https://690674ba479f4f9588e8027bdf6ca4b1@sentry.wixpress.com/21"
});