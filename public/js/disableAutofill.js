(function (t) {
    "use strict";
    var i = [], e = {}, s = [], n = [], o = [], a = {};
    Array.prototype.insert = function (t, i) {
        this.splice(t, 0, i)
    }, a.passwordListener = function (i, e) {
        var a = "" === e.passwordField ? ".disabledAutoFillPassword" : e.passwordField;
        i.find("[type=password]").length > 0 && i.find("[type=password]").attr("type", "text").addClass("disabledAutoFillPassword"), i.on("keyup", a, function () {
            this.id || (this.id = Math.random().toString(36).substring(5)), s.hasOwnProperty(this.id) || (s[this.id] = []);
            var i = s[this.id];
            n[this.id] = t(this).val();
            var a = n[this.id];
            o[this.id] = a.length;
            for (var r = o[this.id], d = this.selectionStart, l = 0; l < r; l++) a[l] !== e.hidingChar && (i[l] = a[l]);
            if (r < i.length) {
                var u = i.length - r, h = event.keyCode || event.charCode;
                8 == h || 46 == h ? i.splice(d, u) : (i.splice(d - 1, u + 1), i.insert(d - 1, a[d - 1]))
            }
            t(this).val(a.replace(/./g, e.hidingChar)), e.debugMode && (console.log("Current keyup position: " + d), console.log("Password length: " + r), console.log("Real password:"), console.log(i))
        })
    }, a.formSubmitListener = function (i, e) {
        var s = "" == e.submitButton ? ".disableAutoFillSubmit" : e.submitButton;
        i.on("click", s, function (n) {
            a.restoreInput(i, e), e.callback.call() && (e.debugMode ? console.log(i.serialize()) : e.html5FormValidate ? (t(s).attr("type", "submit").trigger("submit"), setTimeout(function () {
                t(s).attr("type", "button")
            }, 1e3)) : i.submit())
        })
    }, a.randomizeInput = function (s, n) {
        s.find("input").each(function (s) {
            if (i[s] = t(this).attr("name"), e[i[s]]) t(this).attr("name", e[i[s]]); else {
                var n = Math.random().toString(36).replace(/[^a-z]+/g, "");
                t(this).attr("name", n), e[i[s]] = n
            }
        })
    }, a.restoreInput = function (e, n) {
        n.randomizeInputName && e.find("input").each(function (e) {
            t(this).attr("name", i[e])
        }), n.textToPassword && e.find(n.passwordField).attr("type", "password"), e.find(n.passwordField).each(function (i) {
            t(this).val(s[this.id].join(""))
        })
    }, t.fn.disableAutoFill = function (i) {
        var e = t.extend({}, t.fn.disableAutoFill.defaults, i);
        this.attr("autocomplete", "off"), this.find("[type=submit]").length > 0 && this.find("[type=submit]").addClass("disableAutoFillSubmit").attr("type", "button"), "" != e.submitButton && this.find(e.submitButton).addClass("disableAutoFillSubmit").attr("type", "button"), e.randomizeInputName && a.randomizeInput(this, e), a.passwordListener(this, e), a.formSubmitListener(this, e)
    }, t.fn.disableAutoFill.defaults = {
        debugMode: !1,
        textToPassword: !0,
        randomizeInputName: !0,
        passwordField: "",
        hidingChar: "●",
        html5FormValidate: !1,
        submitButton: "",
        callback: function () {
            return !0
        }
    }
})(jQuery);