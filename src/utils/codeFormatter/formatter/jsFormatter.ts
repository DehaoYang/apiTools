export default (t: string)=> {
    let e: string, n: any[], i: string, r: string, s: string, a, c: string, h: any[], o: string, l: string[], _: string[], p: string[], u: number, g, f, T, E, N, O, K
    let d
    let v
    let A: number 

    function R() {
        for (; n.length && (" " === n[n.length - 1] || n[n.length - 1] === o);) n.pop();
    }

    function S(t?: boolean) {
        if (t = void 0 === t || t, R(), n.length) {
            "\n" === n[n.length - 1] && t || n.push("\n");
            for (let e = 0; e < A; e++) n.push(o);
        }
    }

    function C() {
        let t = n.length ? n[n.length - 1] : " ";
        " " !== t && "\n" !== t && t !== o && n.push(" ");
    }

    function m() {
        n.push(i);
    }

    function k() {
        A++;
    }

    function L() {
        A && A--;
    }

    function x() {
        n.length && n[n.length - 1] === o && n.pop();
    }

    function y(t: string) {
        h.push(c), c = t;
    }

    function D() {
        N = "DO_BLOCK" === c, c = h.pop();
    }

    function I(t: string, e: string | any[]) {
        for (let n = 0; n < e.length; n++) if (e[n] === t) return !0;
        return !1;
    }

    function b() {
        let t = 0, n = "";
        do {
            if (u >= e.length) return ["", "TK_EOF"];
            n = e.charAt(u), u += 1, "\n" === n && (t += 1);
        } while (I(n, l));
        if (t > 1) for (let i = 0; i < 2; i++) S(0 === i);
        let a = 1 === t;
        if (I(n, _)) {
            if (u < e.length) for (; I(e.charAt(u), _) && (n += e.charAt(u), (u += 1) !== e.length););
            if (u !== e.length && n.match(/^[0-9]+[Ee]$/) && "-" === e.charAt(u)) {
                u += 1;
                let c: any = b();
                return [n += "-".concat(c[0]), "TK_WORD"];
            }
            return "in" === n ? [n, "TK_OPERATOR"] : [n, "TK_WORD"];
        }
        if ("(" === n || "[" === n) return [n, "TK_START_EXPR"];
        if (")" === n || "]" === n) return [n, "TK_END_EXPR"];
        if ("{" === n) return [n, "TK_START_BLOCK"];
        if ("}" === n) return [n, "TK_END_BLOCK"];
        if (";" === n) return [n, "TK_END_COMMAND"];
        if ("/" === n) {
            let h = "";
            if ("*" === e.charAt(u)) {
                if ((u += 1) < e.length) for (; ("*" !== e.charAt(u) || !e.charAt(u + 1) || "/" !== e.charAt(u + 1)) && u < e.length && (h += e.charAt(u),
                    !((u += 1) >= e.length)););
                return u += 2, ["/*".concat(h, "*/"), "TK_BLOCK_COMMENT"];
            }
            if ("/" === e.charAt(u)) {
                for (h = n; "\r" !== e.charAt(u) && "\n" !== e.charAt(u) && (h += e.charAt(u), !((u += 1) >= e.length)););
                return u += 1, a && S(), [h, "TK_COMMENT"];
            }
        }
        if ("'" === n || '"' === n || "/" === n && ("TK_WORD" === r && "return" === s || "TK_START_EXPR" === r || "TK_END_BLOCK" === r || "TK_OPERATOR" === r || "TK_EOF" === r || "TK_END_COMMAND" === r)) {
            let o = n, g = !1;
            if (n = "", u < e.length) for (; (g || e.charAt(u) !== o) && (n += e.charAt(u), g = !g && "\\" === e.charAt(u),
                !((u += 1) >= e.length)););
            return u += 1, "TK_END_COMMAND" === r && S(), [o + n + o, "TK_STRING"];
        }
        if (I(n, p)) {
            for (; u < e.length && I(n + e.charAt(u), p) && (n += e.charAt(u), !((u += 1) >= e.length)););
            return [n, "TK_OPERATOR"];
        }
        return [n, "TK_UNKNOWN"];
    }

    for (v = v || " ", d = d || 4, o = ""; d--;) o += v;
    e = t, a = "", r = "TK_START_EXPR", s = "", n = [], N = !1, O = !1, K = !1, l = "\n\r\t ".split(""),
        _ = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$".split(""),
        p = "+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |=".split(" "),
        g = "continue,try,throw,return,var,if,switch,case,default,for,while,break,function".split(","),
        h = [c = "BLOCK"], A = 0, u = 0, f = !1;
    for (let w = !0; w;) {
        let P = b();
        if (i = P[0], "TK_EOF" === (E = P[1])) break;
        switch (E) {
            case "TK_START_EXPR":
                O = !1, y("EXPRESSION"), "TK_END_EXPR" === r || "TK_START_EXPR" === r || ("TK_WORD" !== r && "TK_OPERATOR" !== r || I(a, g) && "function" !== a) && C(),
                    m();
                break;

            case "TK_END_EXPR":
                m(), D();
                break;

            case "TK_START_BLOCK":
                y("do" === a ? "DO_BLOCK" : "BLOCK"), "TK_OPERATOR" !== r && "TK_START_EXPR" !== r && ("TK_START_BLOCK" === r ? S() : C()),
                    m(), k();
                break;

            case "TK_END_BLOCK":
                "TK_START_BLOCK" === r ? (R(), L()) : (L(), S()), m(), D();
                break;

            case "TK_WORD":
                if (N) {
                    C(), m(), C();
                    break;
                }
                if ("case" === i || "default" === i) {
                    ":" === s ? x() : (L(), S(), k()), m(), f = !0;
                    break;
                }
                T = "NONE", "TK_END_BLOCK" === r ? I(i.toLowerCase(), ["else", "catch", "finally"]) ? (T = "SPACE",
                    C()) : T = "NEWLINE" : "TK_END_COMMAND" !== r || "BLOCK" !== c && "DO_BLOCK" !== c ? "TK_END_COMMAND" === r && "EXPRESSION" === c || "TK_WORD" === r ? T = "SPACE" : "TK_START_BLOCK" === r ? T = "NEWLINE" : "TK_END_EXPR" === r && (C(),
                        T = "NEWLINE") : T = "NEWLINE", "TK_END_BLOCK" !== r && I(i.toLowerCase(), ["else", "catch", "finally"]) ? S() : I(i, g) || "NEWLINE" === T ? "else" === s ? C() : ("TK_START_EXPR" !== r && "=" !== s || "function" !== i) && ("TK_WORD" !== r || "return" !== s && "throw" !== s ? "TK_END_EXPR" !== r ? "TK_START_EXPR" === r && "var" === i || ":" === s || ("if" === i && "TK_WORD" === r && "else" === a ? C() : S()) : I(i, g) && ")" !== s && S() : C()) : "SPACE" === T && C(),
                    m(), a = i, "var" === i && (O = !0, K = !1);
                break;

            case "TK_END_COMMAND":
                m(), O = !1;
                break;

            case "TK_STRING":
                "TK_START_BLOCK" === r || "TK_END_BLOCK" === r ? S() : "TK_WORD" === r && C(), m();
                break;

            case "TK_OPERATOR":
                let B = !0, U = !0;
                if (O && "," !== i && (K = !0, ":" === i && (O = !1)), ":" === i && f) {
                    m(), S();
                    break;
                }
                if (f = !1, "," === i) {
                    O ? K ? (m(), S(), K = !1) : (m(), C()) : "TK_END_BLOCK" === r || "BLOCK" === c ? (m(),
                        S()) : (m(), C());
                    break;
                }
                "--" === i || "++" === i ? ";" === s ? (B = !0, U = !1) : (B = !1, U = !1) : "!" === i && "TK_START_EXPR" === r || "TK_OPERATOR" === r ? (B = !1,
                    U = !1) : "TK_END_EXPR" === r ? (B = !0, U = !0) : "." === i ? (B = !1, U = !1) : ":" === i && (B = !!s.match(/^\d+$/)),
                    B && C(), m(), U && C();
                break;

            case "TK_BLOCK_COMMENT":
                S(), m(), S();
                break;

            case "TK_COMMENT":
                C(), m(), S();
                break;

            case "TK_UNKNOWN":
                m();
        }
        r = E, s = i;
    }
    return n.join("");
}