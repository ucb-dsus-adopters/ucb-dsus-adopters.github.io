var Qe = {}, Dt = function(e, t, n, r, a) {
  var o = new Worker(Qe[t] || (Qe[t] = URL.createObjectURL(new Blob([
    e + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
  ], { type: "text/javascript" }))));
  return o.onmessage = function(c) {
    var s = c.data, i = s.$e$;
    if (i) {
      var u = new Error(i[0]);
      u.code = i[1], u.stack = i[2], a(u, null);
    } else
      a(null, s);
  }, o.postMessage(n, r), o;
}, T = Uint8Array, D = Uint16Array, _e = Int32Array, ye = new T([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), xe = new T([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), Ae = new T([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), pt = function(e, t) {
  for (var n = new D(31), r = 0; r < 31; ++r)
    n[r] = t += 1 << e[r - 1];
  for (var a = new _e(n[30]), r = 1; r < 30; ++r)
    for (var o = n[r]; o < n[r + 1]; ++o)
      a[o] = o - n[r] << 5 | r;
  return { b: n, r: a };
}, mt = pt(ye, 2), Je = mt.b, je = mt.r;
Je[28] = 258, je[258] = 28;
var wt = pt(xe, 0), $t = wt.b, et = wt.r, Be = new D(32768);
for (var E = 0; E < 32768; ++E) {
  var te = (E & 43690) >> 1 | (E & 21845) << 1;
  te = (te & 52428) >> 2 | (te & 13107) << 2, te = (te & 61680) >> 4 | (te & 3855) << 4, Be[E] = ((te & 65280) >> 8 | (te & 255) << 8) >> 1;
}
var J = function(e, t, n) {
  for (var r = e.length, a = 0, o = new D(t); a < r; ++a)
    e[a] && ++o[e[a] - 1];
  var c = new D(t);
  for (a = 1; a < t; ++a)
    c[a] = c[a - 1] + o[a - 1] << 1;
  var s;
  if (n) {
    s = new D(1 << t);
    var i = 15 - t;
    for (a = 0; a < r; ++a)
      if (e[a])
        for (var u = a << 4 | e[a], f = t - e[a], l = c[e[a] - 1]++ << f, g = l | (1 << f) - 1; l <= g; ++l)
          s[Be[l] >> i] = u;
  } else
    for (s = new D(r), a = 0; a < r; ++a)
      e[a] && (s[a] = Be[c[e[a] - 1]++] >> 15 - e[a]);
  return s;
}, ne = new T(288);
for (var E = 0; E < 144; ++E)
  ne[E] = 8;
for (var E = 144; E < 256; ++E)
  ne[E] = 9;
for (var E = 256; E < 280; ++E)
  ne[E] = 7;
for (var E = 280; E < 288; ++E)
  ne[E] = 8;
var me = new T(32);
for (var E = 0; E < 32; ++E)
  me[E] = 5;
var Vt = /* @__PURE__ */ J(ne, 9, 0), yt = /* @__PURE__ */ J(ne, 9, 1), Wt = /* @__PURE__ */ J(me, 5, 0), xt = /* @__PURE__ */ J(me, 5, 1), Me = function(e) {
  for (var t = e[0], n = 1; n < e.length; ++n)
    e[n] > t && (t = e[n]);
  return t;
}, Y = function(e, t, n) {
  var r = t / 8 | 0;
  return (e[r] | e[r + 1] << 8) >> (t & 7) & n;
}, Te = function(e, t) {
  var n = t / 8 | 0;
  return (e[n] | e[n + 1] << 8 | e[n + 2] << 16) >> (t & 7);
}, Fe = function(e) {
  return (e + 7) / 8 | 0;
}, ce = function(e, t, n) {
  return (t == null || t < 0) && (t = 0), (n == null || n > e.length) && (n = e.length), new T(e.subarray(t, n));
}, kt = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], N = function(e, t, n) {
  var r = new Error(t || kt[e]);
  if (r.code = e, Error.captureStackTrace && Error.captureStackTrace(r, N), !n)
    throw r;
  return r;
}, Et = function(e, t, n, r) {
  var a = e.length, o = r ? r.length : 0;
  if (!a || t.f && !t.l)
    return n || new T(0);
  var c = !n, s = c || t.i != 2, i = t.i;
  c && (n = new T(a * 3));
  var u = function(ue) {
    var ge = n.length;
    if (ue > ge) {
      var se = new T(Math.max(ge * 2, ue));
      se.set(n), n = se;
    }
  }, f = t.f || 0, l = t.p || 0, g = t.b || 0, p = t.l, v = t.d, d = t.m, y = t.n, C = a * 8;
  do {
    if (!p) {
      f = Y(e, l, 1);
      var z = Y(e, l + 1, 3);
      if (l += 3, z)
        if (z == 1)
          p = yt, v = xt, d = 9, y = 5;
        else if (z == 2) {
          var _ = Y(e, l, 31) + 257, M = Y(e, l + 10, 15) + 4, $ = _ + Y(e, l + 5, 31) + 1;
          l += 14;
          for (var h = new T($), I = new T(19), S = 0; S < M; ++S)
            I[Ae[S]] = Y(e, l + S * 3, 7);
          l += M * 3;
          for (var F = Me(I), ee = (1 << F) - 1, V = J(I, F, 1), S = 0; S < $; ) {
            var P = V[Y(e, l, ee)];
            l += P & 15;
            var k = P >> 4;
            if (k < 16)
              h[S++] = k;
            else {
              var L = 0, A = 0;
              for (k == 16 ? (A = 3 + Y(e, l, 3), l += 2, L = h[S - 1]) : k == 17 ? (A = 3 + Y(e, l, 7), l += 3) : k == 18 && (A = 11 + Y(e, l, 127), l += 7); A--; )
                h[S++] = L;
            }
          }
          var j = h.subarray(0, _), R = h.subarray(_);
          d = Me(j), y = Me(R), p = J(j, d, 1), v = J(R, y, 1);
        } else
          N(1);
      else {
        var k = Fe(l) + 4, x = e[k - 4] | e[k - 3] << 8, O = k + x;
        if (O > a) {
          i && N(0);
          break;
        }
        s && u(g + x), n.set(e.subarray(k, O), g), t.b = g += x, t.p = l = O * 8, t.f = f;
        continue;
      }
      if (l > C) {
        i && N(0);
        break;
      }
    }
    s && u(g + 131072);
    for (var fe = (1 << d) - 1, X = (1 << y) - 1, K = l; ; K = l) {
      var L = p[Te(e, l) & fe], W = L >> 4;
      if (l += L & 15, l > C) {
        i && N(0);
        break;
      }
      if (L || N(2), W < 256)
        n[g++] = W;
      else if (W == 256) {
        K = l, p = null;
        break;
      } else {
        var U = W - 254;
        if (W > 264) {
          var S = W - 257, B = ye[S];
          U = Y(e, l, (1 << B) - 1) + Je[S], l += B;
        }
        var Z = v[Te(e, l) & X], ae = Z >> 4;
        Z || N(3), l += Z & 15;
        var R = $t[ae];
        if (ae > 3) {
          var B = xe[ae];
          R += Te(e, l) & (1 << B) - 1, l += B;
        }
        if (l > C) {
          i && N(0);
          break;
        }
        s && u(g + 131072);
        var oe = g + U;
        if (g < R) {
          var ke = o - R, Ee = Math.min(R, oe);
          for (ke + g < 0 && N(3); g < Ee; ++g)
            n[g] = r[ke + g];
        }
        for (; g < oe; ++g)
          n[g] = n[g - R];
      }
    }
    t.l = p, t.p = K, t.b = g, t.f = f, p && (f = 1, t.m = d, t.d = v, t.n = y);
  } while (!f);
  return g != n.length && c ? ce(n, 0, g) : n.subarray(0, g);
}, Q = function(e, t, n) {
  n <<= t & 7;
  var r = t / 8 | 0;
  e[r] |= n, e[r + 1] |= n >> 8;
}, he = function(e, t, n) {
  n <<= t & 7;
  var r = t / 8 | 0;
  e[r] |= n, e[r + 1] |= n >> 8, e[r + 2] |= n >> 16;
}, Re = function(e, t) {
  for (var n = [], r = 0; r < e.length; ++r)
    e[r] && n.push({ s: r, f: e[r] });
  var a = n.length, o = n.slice();
  if (!a)
    return { t: Ct, l: 0 };
  if (a == 1) {
    var c = new T(n[0].s + 1);
    return c[n[0].s] = 1, { t: c, l: 1 };
  }
  n.sort(function(O, _) {
    return O.f - _.f;
  }), n.push({ s: -1, f: 25001 });
  var s = n[0], i = n[1], u = 0, f = 1, l = 2;
  for (n[0] = { s: -1, f: s.f + i.f, l: s, r: i }; f != a - 1; )
    s = n[n[u].f < n[l].f ? u++ : l++], i = n[u != f && n[u].f < n[l].f ? u++ : l++], n[f++] = { s: -1, f: s.f + i.f, l: s, r: i };
  for (var g = o[0].s, r = 1; r < a; ++r)
    o[r].s > g && (g = o[r].s);
  var p = new D(g + 1), v = De(n[f - 1], p, 0);
  if (v > t) {
    var r = 0, d = 0, y = v - t, C = 1 << y;
    for (o.sort(function(_, M) {
      return p[M.s] - p[_.s] || _.f - M.f;
    }); r < a; ++r) {
      var z = o[r].s;
      if (p[z] > t)
        d += C - (1 << v - p[z]), p[z] = t;
      else
        break;
    }
    for (d >>= y; d > 0; ) {
      var k = o[r].s;
      p[k] < t ? d -= 1 << t - p[k]++ - 1 : ++r;
    }
    for (; r >= 0 && d; --r) {
      var x = o[r].s;
      p[x] == t && (--p[x], ++d);
    }
    v = t;
  }
  return { t: new T(p), l: v };
}, De = function(e, t, n) {
  return e.s == -1 ? Math.max(De(e.l, t, n + 1), De(e.r, t, n + 1)) : t[e.s] = n;
}, tt = function(e) {
  for (var t = e.length; t && !e[--t]; )
    ;
  for (var n = new D(++t), r = 0, a = e[0], o = 1, c = function(i) {
    n[r++] = i;
  }, s = 1; s <= t; ++s)
    if (e[s] == a && s != t)
      ++o;
    else {
      if (!a && o > 2) {
        for (; o > 138; o -= 138)
          c(32754);
        o > 2 && (c(o > 10 ? o - 11 << 5 | 28690 : o - 3 << 5 | 12305), o = 0);
      } else if (o > 3) {
        for (c(a), --o; o > 6; o -= 6)
          c(8304);
        o > 2 && (c(o - 3 << 5 | 8208), o = 0);
      }
      for (; o--; )
        c(a);
      o = 1, a = e[s];
    }
  return { c: n.subarray(0, r), n: t };
}, ve = function(e, t) {
  for (var n = 0, r = 0; r < t.length; ++r)
    n += e[r] * t[r];
  return n;
}, St = function(e, t, n) {
  var r = n.length, a = Fe(t + 2);
  e[a] = r & 255, e[a + 1] = r >> 8, e[a + 2] = e[a] ^ 255, e[a + 3] = e[a + 1] ^ 255;
  for (var o = 0; o < r; ++o)
    e[a + o + 4] = n[o];
  return (a + 4 + r) * 8;
}, nt = function(e, t, n, r, a, o, c, s, i, u, f) {
  Q(t, f++, n), ++a[256];
  for (var l = Re(a, 15), g = l.t, p = l.l, v = Re(o, 15), d = v.t, y = v.l, C = tt(g), z = C.c, k = C.n, x = tt(d), O = x.c, _ = x.n, M = new D(19), $ = 0; $ < z.length; ++$)
    ++M[z[$] & 31];
  for (var $ = 0; $ < O.length; ++$)
    ++M[O[$] & 31];
  for (var h = Re(M, 7), I = h.t, S = h.l, F = 19; F > 4 && !I[Ae[F - 1]]; --F)
    ;
  var ee = u + 5 << 3, V = ve(a, ne) + ve(o, me) + c, P = ve(a, g) + ve(o, d) + c + 14 + 3 * F + ve(M, I) + 2 * M[16] + 3 * M[17] + 7 * M[18];
  if (i >= 0 && ee <= V && ee <= P)
    return St(t, f, e.subarray(i, i + u));
  var L, A, j, R;
  if (Q(t, f, 1 + (P < V)), f += 2, P < V) {
    L = J(g, p, 0), A = g, j = J(d, y, 0), R = d;
    var fe = J(I, S, 0);
    Q(t, f, k - 257), Q(t, f + 5, _ - 1), Q(t, f + 10, F - 4), f += 14;
    for (var $ = 0; $ < F; ++$)
      Q(t, f + 3 * $, I[Ae[$]]);
    f += 3 * F;
    for (var X = [z, O], K = 0; K < 2; ++K)
      for (var W = X[K], $ = 0; $ < W.length; ++$) {
        var U = W[$] & 31;
        Q(t, f, fe[U]), f += I[U], U > 15 && (Q(t, f, W[$] >> 5 & 127), f += W[$] >> 12);
      }
  } else
    L = Vt, A = ne, j = Wt, R = me;
  for (var $ = 0; $ < s; ++$) {
    var B = r[$];
    if (B > 255) {
      var U = B >> 18 & 31;
      he(t, f, L[U + 257]), f += A[U + 257], U > 7 && (Q(t, f, B >> 23 & 31), f += ye[U]);
      var Z = B & 31;
      he(t, f, j[Z]), f += R[Z], Z > 3 && (he(t, f, B >> 5 & 8191), f += xe[Z]);
    } else
      he(t, f, L[B]), f += A[B];
  }
  return he(t, f, L[256]), f + A[256];
}, Ut = /* @__PURE__ */ new _e([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), Ct = /* @__PURE__ */ new T(0), Xt = function(e, t, n, r, a, o) {
  var c = o.z || e.length, s = new T(r + c + 5 * (1 + Math.ceil(c / 7e3)) + a), i = s.subarray(r, s.length - a), u = o.l, f = (o.r || 0) & 7;
  if (t) {
    f && (i[0] = o.r >> 3);
    for (var l = Ut[t - 1], g = l >> 13, p = l & 8191, v = (1 << n) - 1, d = o.p || new D(32768), y = o.h || new D(v + 1), C = Math.ceil(n / 3), z = 2 * C, k = function(Le) {
      return (e[Le] ^ e[Le + 1] << C ^ e[Le + 2] << z) & v;
    }, x = new _e(25e3), O = new D(288), _ = new D(32), M = 0, $ = 0, h = o.i || 0, I = 0, S = o.w || 0, F = 0; h + 2 < c; ++h) {
      var ee = k(h), V = h & 32767, P = y[ee];
      if (d[V] = P, y[ee] = V, S <= h) {
        var L = c - h;
        if ((M > 7e3 || I > 24576) && (L > 423 || !u)) {
          f = nt(e, i, 0, x, O, _, $, I, F, h - F, f), I = M = $ = 0, F = h;
          for (var A = 0; A < 286; ++A)
            O[A] = 0;
          for (var A = 0; A < 30; ++A)
            _[A] = 0;
        }
        var j = 2, R = 0, fe = p, X = V - P & 32767;
        if (L > 2 && ee == k(h - X))
          for (var K = Math.min(g, L) - 1, W = Math.min(32767, h), U = Math.min(258, L); X <= W && --fe && V != P; ) {
            if (e[h + j] == e[h + j - X]) {
              for (var B = 0; B < U && e[h + B] == e[h + B - X]; ++B)
                ;
              if (B > j) {
                if (j = B, R = X, B > K)
                  break;
                for (var Z = Math.min(X, B - 2), ae = 0, A = 0; A < Z; ++A) {
                  var oe = h - X + A & 32767, ke = d[oe], Ee = oe - ke & 32767;
                  Ee > ae && (ae = Ee, P = oe);
                }
              }
            }
            V = P, P = d[V], X += V - P & 32767;
          }
        if (R) {
          x[I++] = 268435456 | je[j] << 18 | et[R];
          var ue = je[j] & 31, ge = et[R] & 31;
          $ += ye[ue] + xe[ge], ++O[257 + ue], ++_[ge], S = h + j, ++M;
        } else
          x[I++] = e[h], ++O[e[h]];
      }
    }
    for (h = Math.max(h, S); h < c; ++h)
      x[I++] = e[h], ++O[e[h]];
    f = nt(e, i, u, x, O, _, $, I, F, h - F, f), u || (o.r = f & 7 | i[f / 8 | 0] << 3, f -= 7, o.h = y, o.p = d, o.i = h, o.w = S);
  } else {
    for (var h = o.w || 0; h < c + u; h += 65535) {
      var se = h + 65535;
      se >= c && (i[f / 8 | 0] = u, se = c), f = St(i, f + 1, e.subarray(h, se));
    }
    o.i = c;
  }
  return ce(s, 0, r + Fe(f) + a);
}, Yt = /* @__PURE__ */ function() {
  for (var e = new Int32Array(256), t = 0; t < 256; ++t) {
    for (var n = t, r = 9; --r; )
      n = (n & 1 && -306674912) ^ n >>> 1;
    e[t] = n;
  }
  return e;
}(), Gt = function() {
  var e = -1;
  return {
    p: function(t) {
      for (var n = e, r = 0; r < t.length; ++r)
        n = Yt[n & 255 ^ t[r]] ^ n >>> 8;
      e = n;
    },
    d: function() {
      return ~e;
    }
  };
}, Jt = function(e, t, n, r, a) {
  if (!a && (a = { l: 1 }, t.dictionary)) {
    var o = t.dictionary.subarray(-32768), c = new T(o.length + e.length);
    c.set(o), c.set(e, o.length), e = c, a.w = o.length;
  }
  return Xt(e, t.level == null ? 6 : t.level, t.mem == null ? a.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(e.length))) * 1.5) : 20 : 12 + t.mem, n, r, a);
}, Ze = function(e, t) {
  var n = {};
  for (var r in e)
    n[r] = e[r];
  for (var r in t)
    n[r] = t[r];
  return n;
}, rt = function(e, t, n) {
  for (var r = e(), a = e.toString(), o = a.slice(a.indexOf("[") + 1, a.lastIndexOf("]")).replace(/\s+/g, "").split(","), c = 0; c < r.length; ++c) {
    var s = r[c], i = o[c];
    if (typeof s == "function") {
      t += ";" + i + "=";
      var u = s.toString();
      if (s.prototype)
        if (u.indexOf("[native code]") != -1) {
          var f = u.indexOf(" ", 8) + 1;
          t += u.slice(f, u.indexOf("(", f));
        } else {
          t += u;
          for (var l in s.prototype)
            t += ";" + i + ".prototype." + l + "=" + s.prototype[l].toString();
        }
      else
        t += u;
    } else
      n[i] = s;
  }
  return t;
}, Se = [], Zt = function(e) {
  var t = [];
  for (var n in e)
    e[n].buffer && t.push((e[n] = new e[n].constructor(e[n])).buffer);
  return t;
}, Ht = function(e, t, n, r) {
  if (!Se[n]) {
    for (var a = "", o = {}, c = e.length - 1, s = 0; s < c; ++s)
      a = rt(e[s], a, o);
    Se[n] = { c: rt(e[c], a, o), e: o };
  }
  var i = Ze({}, Se[n].e);
  return Dt(Se[n].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + t.toString() + "}", n, i, Zt(i), r);
}, Kt = function() {
  return [T, D, _e, ye, xe, Ae, Je, $t, yt, xt, Be, kt, J, Me, Y, Te, Fe, ce, N, Et, He, Mt, Tt];
}, Mt = function(e) {
  return postMessage(e, [e.buffer]);
}, Tt = function(e) {
  return e && {
    out: e.size && new T(e.size),
    dictionary: e.dictionary
  };
}, Qt = function(e, t, n, r, a, o) {
  var c = Ht(n, r, a, function(s, i) {
    c.terminate(), o(s, i);
  });
  return c.postMessage([e, t], t.consume ? [e.buffer] : []), function() {
    c.terminate();
  };
}, H = function(e, t) {
  return e[t] | e[t + 1] << 8;
}, G = function(e, t) {
  return (e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24) >>> 0;
}, qe = function(e, t) {
  return G(e, t) + G(e, t + 4) * 4294967296;
}, q = function(e, t, n) {
  for (; n; ++t)
    e[t] = n, n >>>= 8;
};
function en(e, t) {
  return Jt(e, t || {}, 0, 0);
}
function tn(e, t, n) {
  return n || (n = t, t = {}), typeof n != "function" && N(7), Qt(e, t, [
    Kt
  ], function(r) {
    return Mt(He(r.data[0], Tt(r.data[1])));
  }, 1, n);
}
function He(e, t) {
  return Et(e, { i: 2 }, t && t.out, t && t.dictionary);
}
var At = function(e, t, n, r) {
  for (var a in e) {
    var o = e[a], c = t + a, s = r;
    Array.isArray(o) && (s = Ze(r, o[1]), o = o[0]), ArrayBuffer.isView(o) ? n[c] = [o, s] : (n[c += "/"] = [new T(0), s], At(o, c, n, r));
  }
}, at = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), Ve = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), nn = 0;
try {
  Ve.decode(Ct, { stream: !0 }), nn = 1;
} catch {
}
var rn = function(e) {
  for (var t = "", n = 0; ; ) {
    var r = e[n++], a = (r > 127) + (r > 223) + (r > 239);
    if (n + a > e.length)
      return { s: t, r: ce(e, n - 1) };
    a ? a == 3 ? (r = ((r & 15) << 18 | (e[n++] & 63) << 12 | (e[n++] & 63) << 6 | e[n++] & 63) - 65536, t += String.fromCharCode(55296 | r >> 10, 56320 | r & 1023)) : a & 1 ? t += String.fromCharCode((r & 31) << 6 | e[n++] & 63) : t += String.fromCharCode((r & 15) << 12 | (e[n++] & 63) << 6 | e[n++] & 63) : t += String.fromCharCode(r);
  }
};
function ot(e, t) {
  var n;
  if (at)
    return at.encode(e);
  for (var r = e.length, a = new T(e.length + (e.length >> 1)), o = 0, c = function(u) {
    a[o++] = u;
  }, n = 0; n < r; ++n) {
    if (o + 5 > a.length) {
      var s = new T(o + 8 + (r - n << 1));
      s.set(a), a = s;
    }
    var i = e.charCodeAt(n);
    i < 128 || t ? c(i) : i < 2048 ? (c(192 | i >> 6), c(128 | i & 63)) : i > 55295 && i < 57344 ? (i = 65536 + (i & 1047552) | e.charCodeAt(++n) & 1023, c(240 | i >> 18), c(128 | i >> 12 & 63), c(128 | i >> 6 & 63), c(128 | i & 63)) : (c(224 | i >> 12), c(128 | i >> 6 & 63), c(128 | i & 63));
  }
  return ce(a, 0, o);
}
function an(e, t) {
  if (t) {
    for (var n = "", r = 0; r < e.length; r += 16384)
      n += String.fromCharCode.apply(null, e.subarray(r, r + 16384));
    return n;
  } else {
    if (Ve)
      return Ve.decode(e);
    var a = rn(e), o = a.s, n = a.r;
    return n.length && N(8), o;
  }
}
var on = function(e, t) {
  return t + 30 + H(e, t + 26) + H(e, t + 28);
}, sn = function(e, t, n) {
  var r = H(e, t + 28), a = H(e, t + 30), o = an(e.subarray(t + 46, t + 46 + r), !(H(e, t + 8) & 2048)), c = t + 46 + r, s = ln(e, c, a, n, G(e, t + 20), G(e, t + 24), G(e, t + 42)), i = s[0], u = s[1], f = s[2];
  return [H(e, t + 10), i, u, o, c + a + H(e, t + 32), f];
}, ln = function(e, t, n, r, a, o, c) {
  var s = a == 4294967295, i = o == 4294967295, u = c == 4294967295, f = t + n, l = s + i + u;
  if (r && l) {
    for (; t + 4 < f; t += 4 + H(e, t + 2))
      if (H(e, t) == 1)
        return [
          s ? qe(e, t + 4 + 8 * i) : a,
          i ? qe(e, t + 4) : o,
          u ? qe(e, t + 4 + 8 * (i + s)) : c,
          1
        ];
    r < 2 && N(13);
  }
  return [a, o, c, 0];
}, We = function(e) {
  var t = 0;
  if (e)
    for (var n in e) {
      var r = e[n].length;
      r > 65535 && N(9), t += r + 4;
    }
  return t;
}, st = function(e, t, n, r, a, o, c, s) {
  var i = r.length, u = n.extra, f = s && s.length, l = We(u);
  q(e, t, c != null ? 33639248 : 67324752), t += 4, c != null && (e[t++] = 20, e[t++] = n.os), e[t] = 20, t += 2, e[t++] = n.flag << 1 | (o < 0 && 8), e[t++] = a && 8, e[t++] = n.compression & 255, e[t++] = n.compression >> 8;
  var g = new Date(n.mtime == null ? Date.now() : n.mtime), p = g.getFullYear() - 1980;
  if ((p < 0 || p > 119) && N(10), q(e, t, p << 25 | g.getMonth() + 1 << 21 | g.getDate() << 16 | g.getHours() << 11 | g.getMinutes() << 5 | g.getSeconds() >> 1), t += 4, o != -1 && (q(e, t, n.crc), q(e, t + 4, o < 0 ? -o - 2 : o), q(e, t + 8, n.size)), q(e, t + 12, i), q(e, t + 14, l), t += 16, c != null && (q(e, t, f), q(e, t + 6, n.attrs), q(e, t + 10, c), t += 14), e.set(r, t), t += i, l)
    for (var v in u) {
      var d = u[v], y = d.length;
      q(e, t, +v), q(e, t + 2, y), e.set(d, t + 4), t += 4 + y;
    }
  return f && (e.set(s, t), t += f), t;
}, cn = function(e, t, n, r, a) {
  q(e, t, 101010256), q(e, t + 8, n), q(e, t + 10, n), q(e, t + 12, r), q(e, t + 16, a);
};
function fn(e, t) {
  t || (t = {});
  var n = {}, r = [];
  At(e, "", n, t);
  var a = 0, o = 0;
  for (var c in n) {
    var s = n[c], i = s[0], u = s[1], f = u.level == 0 ? 0 : 8, l = ot(c), g = l.length, p = u.comment, v = p && ot(p), d = v && v.length, y = We(u.extra);
    g > 65535 && N(11);
    var C = f ? en(i, u) : i, z = C.length, k = Gt();
    k.p(i), r.push(Ze(u, {
      size: i.length,
      crc: k.d(),
      c: C,
      f: l,
      m: v,
      u: g != c.length || v && p.length != d,
      o: a,
      compression: f
    })), a += 30 + g + y + z, o += 76 + 2 * (g + y) + (d || 0) + z;
  }
  for (var x = new T(o + 22), O = a, _ = o - a, M = 0; M < r.length; ++M) {
    var l = r[M];
    st(x, l.o, l, l.f, l.u, l.c.length);
    var $ = 30 + l.f.length + We(l.extra);
    x.set(l.c, l.o + $), st(x, a, l, l.f, l.u, l.c.length, l.o, l.m), a += 16 + $ + (l.m ? l.m.length : 0);
  }
  return cn(x, a, r.length, _, O), x;
}
var it = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(e) {
  e();
};
function un(e, t, n) {
  n || (n = t, t = {}), typeof n != "function" && N(7);
  var r = [], a = function() {
    for (var y = 0; y < r.length; ++y)
      r[y]();
  }, o = {}, c = function(y, C) {
    it(function() {
      n(y, C);
    });
  };
  it(function() {
    c = n;
  });
  for (var s = e.length - 22; G(e, s) != 101010256; --s)
    if (!s || e.length - s > 65558)
      return c(N(13, 0, 1), null), a;
  var i = H(e, s + 8);
  if (i) {
    var u = i, f = G(e, s + 16), l = G(e, s - 20) == 117853008;
    if (l) {
      var g = G(e, s - 12);
      l = G(e, g) == 101075792, l && (u = i = G(e, g + 32), f = G(e, g + 48));
    }
    for (var p = t && t.filter, v = function(y) {
      var C = sn(e, f, l), z = C[0], k = C[1], x = C[2], O = C[3], _ = C[4], M = C[5], $ = on(e, M);
      f = _;
      var h = function(S, F) {
        S ? (a(), c(S, null)) : (F && (o[O] = F), --i || c(null, o));
      };
      if (!p || p({
        name: O,
        size: k,
        originalSize: x,
        compression: z
      }))
        if (!z)
          h(null, ce(e, $, $ + k));
        else if (z == 8) {
          var I = e.subarray($, $ + k);
          if (x < 524288 || k > 0.8 * x)
            try {
              h(null, He(I, { out: new T(x) }));
            } catch (S) {
              h(S, null);
            }
          else
            r.push(tn(I, { size: x }, h));
        } else
          h(N(14, "unknown compression type " + z, 1), null);
      else
        h(null, null);
    }, d = 0; d < u; ++d)
      v(d);
  } else
    c(null, {});
  return a;
}
async function Bt(e, { filter: t } = {}) {
  const n = new Uint8Array(await e.arrayBuffer()), r = await new Promise((a, o) => {
    un(
      n,
      { filter: (c) => t ? t(c.name) !== !1 : !0 },
      (c, s) => c ? o(c) : a(s)
    );
  });
  return new Map(Object.entries(r));
}
function gn(e) {
  const t = {}, n = new TextEncoder();
  for (const [r, a] of Object.entries(e))
    t[r] = typeof a == "string" ? n.encode(a) : a;
  return new Blob([fn(t, { level: 6 })], { type: "application/zip" });
}
function Ue(e, t) {
  const n = URL.createObjectURL(e), r = document.createElement("a");
  r.href = n, r.download = t, document.body.appendChild(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
const zt = "6.1.6", lt = "6.0.0";
function hn(e, t) {
  const n = String(e).split(".").map((o) => parseInt(o, 10) || 0), r = String(t).split(".").map((o) => parseInt(o, 10) || 0), a = Math.max(n.length, r.length);
  for (let o = 0; o < a; o++) {
    const c = (n[o] || 0) - (r[o] || 0);
    if (c !== 0) return c < 0 ? -1 : 1;
  }
  return 0;
}
function vn(e) {
  const t = /^\s*otter[-_]grader\s*(?:\[[^\]]*\])?\s*==\s*([0-9][0-9A-Za-z.]*)/i.exec(e || "");
  return t ? t[1] : null;
}
function Ot({ pin: e = null, override: t = null, fallback: n = zt } = {}) {
  const r = (t || "").trim();
  return r ? { version: r, reason: `using version override ${r}` } : e ? hn(e, lt) >= 0 ? { version: e, reason: `using otter-grader ${e} pinned by the autograder zip` } : {
    version: n,
    reason: `autograder zip pins otter-grader ${e}, which is older than the minimum ${lt}; using ${n}`
  } : { version: n, reason: `autograder zip does not pin otter-grader; using ${n}` };
}
const Ce = new TextDecoder("utf-8");
function dn(e) {
  if (e.some((a) => a === "otter_config.json" || a.startsWith("tests/"))) return "";
  const t = new Set(e.map((a) => a.split("/")[0]));
  if (t.size !== 1) return "";
  const [n] = t;
  return e.map((a) => a.slice(n.length + 1)).some((a) => a === "otter_config.json" || a.startsWith("tests/")) ? n + "/" : "";
}
function pn(e) {
  return (e || "").split(/\r?\n/).map((t) => t.replace(/#.*$/, "").trim()).filter((t) => t && !t.startsWith("-"));
}
function mn(e) {
  const t = [];
  let n = !1, r = -1;
  for (const a of (e || "").split(/\r?\n/)) {
    const o = a.replace(/#.*$/, "").replace(/\s+$/, "");
    if (!o.trim()) continue;
    const c = o.length - o.trimStart().length;
    if (/^\s*-\s*pip\s*:\s*$/.exec(o)) {
      n = !0, r = c;
      continue;
    }
    if (n)
      if (c <= r)
        n = !1;
      else {
        const i = /^\s*-\s*(.+)$/.exec(o);
        if (i) {
          const u = i[1].trim().replace(/^['"]|['"]$/g, "");
          u && !u.startsWith("-") && t.push(u);
        }
        continue;
      }
  }
  return t;
}
function wn(e) {
  const t = [...e.keys()].filter((v) => !v.endsWith("/") && !v.startsWith("__MACOSX/")), n = dn(t), r = (v) => e.get(n + v), a = [];
  let o = {};
  const c = r("otter_config.json");
  if (c)
    try {
      o = JSON.parse(Ce.decode(c));
    } catch (v) {
      a.push(`otter_config.json could not be parsed (${v.message}); using defaults`);
    }
  else
    a.push("otter_config.json not found in the autograder zip; using defaults");
  if ((o.lang || "python").toLowerCase() !== "python")
    throw new Error(`This autograder is for "${o.lang}" assignments; only Python assignments can be graded in the browser`);
  const i = [], u = [];
  for (const v of t) {
    if (!v.startsWith(n)) continue;
    const d = v.slice(n.length);
    d.startsWith("tests/") && d.endsWith(".py") && d.split("/").length === 2 ? i.push({ name: d.slice(6, -3), source: Ce.decode(e.get(v)) }) : d.startsWith("files/") && d.length > 6 && u.push({ path: d.slice(6), data: e.get(v) });
  }
  if (i.sort((v, d) => v.name < d.name ? -1 : v.name > d.name ? 1 : 0), i.length === 0) throw new Error("No tests/*.py files found in the autograder zip");
  const f = [], l = r("requirements.txt");
  l && f.push(...pn(Ce.decode(l)));
  const g = r("environment.yml");
  if (g)
    for (const v of mn(Ce.decode(g))) f.includes(v) || f.push(v);
  let p = null;
  for (const v of f) {
    const d = vn(v);
    d && (p = d);
  }
  return { config: o, tests: i, files: u, requirements: f, otterPin: p, warnings: a };
}
function $n(e) {
  let t = 0;
  for (const n of e) {
    const r = /['"]points['"]\s*:\s*([0-9.]+|None|null)/.exec(n.source);
    if (r && r[1] !== "None" && r[1] !== "null")
      t += parseFloat(r[1]);
    else {
      const a = (n.source.match(/['"]code['"]\s*:/g) || []).length;
      t += a || 1;
    }
  }
  return t;
}
function ct(e) {
  if (!e || e.endsWith("/")) return !1;
  const t = e.split("/");
  return t.some((n) => n === "__MACOSX" || n === ".ipynb_checkpoints" || n.startsWith(".")) ? !1 : /\.ipynb$/i.test(t[t.length - 1]);
}
function yn(e, t, n, r = /* @__PURE__ */ new Set()) {
  let a = e && e.assignment_name || "";
  !a && t && (a = t.replace(/\.zip$/i, "").replace(/[-_ ]?autograder(?:[-_ ]?\d{4}_\d{2}_\d{2}T[\d_]+)?$/i, "").replace(/^autograder$/i, "")), a = a.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || `batch-${n + 1}`;
  let o = a, c = 2;
  for (; r.has(o); ) o = `${a}-${c++}`;
  return o;
}
function xn(e) {
  const t = /* @__PURE__ */ new Map();
  return e.map((n) => {
    const r = n.path.split("/").pop(), a = (t.get(r) || 0) + 1;
    if (t.set(r, a), a === 1) return { ...n, file: r };
    const o = r.lastIndexOf("."), c = o > 0 ? `${r.slice(0, o)}-${a}${r.slice(o)}` : `${r}-${a}`;
    return { ...n, file: c };
  });
}
function kn(e) {
  return [...e].sort((t, n) => t.file < n.file ? -1 : t.file > n.file ? 1 : 0);
}
function En(e = /* @__PURE__ */ new Date()) {
  const t = (n) => String(n).padStart(2, "0");
  return `${e.getFullYear()}${t(e.getMonth() + 1)}${t(e.getDate())}-${t(e.getHours())}${t(e.getMinutes())}`;
}
const Sn = "points-per-question", Cn = ["total_points_earned", "percent_correct", "grading_status", "path"];
function Mn(e) {
  if (e == null) return "";
  const t = String(e);
  return /[",\r\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
}
function de(e) {
  return typeof e != "number" || Number.isNaN(e) ? e : Number.isInteger(e) ? String(e) : String(Number(e.toFixed(10)));
}
function ft(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function Tn(e) {
  const t = e.filter((s) => s.status === "Completed"), n = /* @__PURE__ */ new Set();
  for (const s of t) for (const i of Object.keys(s.questions || {})) n.add(i);
  const r = [...n].sort(ft), a = ["file", ...r, ...Cn], o = [];
  if (t.length) {
    const s = t[0], i = r.map((f) => s.questions[f] ? s.questions[f].possible : ""), u = i.reduce((f, l) => f + (typeof l == "number" ? l : 0), 0);
    o.push([Sn, ...i.map(de), de(u), "1", "--", ""]);
  }
  const c = [...e].sort((s, i) => ft(s.file, i.file));
  for (const s of c) {
    const i = s.status !== "Completed", u = r.map((f) => {
      if (i) return "0";
      const l = s.questions[f];
      return l ? de(l.score) : "";
    });
    o.push([
      s.file,
      ...u,
      de(i ? 0 : s.total),
      de(i ? 0 : s.percent),
      s.status,
      s.path || ""
    ]);
  }
  return [a, ...o].map((s) => s.map(Mn).join(",")).join(`
`) + `
`;
}
function An({ name: e, otterVersion: t, pyodideVersion: n, notes: r = [], warnings: a = [], installed: o = {}, requirements: c = [], results: s = [] }) {
  const i = [];
  i.push(`Otter grader (in-browser) log for batch "${e}"`), i.push(`Generated: ${(/* @__PURE__ */ new Date()).toISOString()}`), t && i.push(`otter-grader: ${t}`), n && i.push(`Pyodide: ${n}`);
  for (const l of r) i.push(`Note: ${l}`);
  if (a.length) {
    i.push("", "Warnings:");
    for (const l of a) i.push(`  - ${l}`);
  }
  if (c.length) {
    i.push("", "Autograder requirements:");
    for (const l of c) i.push(`  - ${l}`);
  }
  const u = Object.keys(o).sort();
  if (u.length) {
    i.push("", "Installed in the browser runtime:");
    for (const l of u) i.push(`  - ${l}==${o[l]}`);
  }
  const f = s.filter((l) => l.status === "Completed").length;
  i.push("", `Notebooks: ${s.length} (${f} completed, ${s.length - f} failed)`);
  for (const l of s) {
    if (i.push("", `== ${l.file}${l.path && l.path !== l.file ? ` (${l.path})` : ""}`), i.push(`   status: ${l.status}`), l.status === "Completed" && i.push(`   score: ${l.total} / ${l.possible} (${l.percent})`), l.log && l.log.length) {
      i.push("   execution notes:");
      for (const g of l.log) for (const p of String(g).split(`
`)) i.push(`     ${p}`);
    }
    if (l.output && l.output.trim()) {
      i.push("   captured output (truncated):");
      for (const g of l.output.trim().split(`
`).slice(0, 60)) i.push(`     ${g}`);
    }
  }
  return i.join(`
`) + `
`;
}
const b = (e) => document.getElementById(e), Xe = b("batches"), It = b("addBatch"), _t = b("gradeAll"), Ft = b("cancel"), Nt = b("reset"), bt = b("status"), Ye = b("progress"), Bn = b("statusText"), ze = b("results"), Ge = b("downloadAll"), Oe = b("loading-overlay"), ut = Oe ? Oe.querySelector("p") : null, we = b("otterVersion"), zn = b("timeoutSecs"), On = b("extraPackages"), In = 40, _n = new TextDecoder("utf-8"), m = { batches: [], running: !1, cancelled: !1, nextId: 1 };
function w(e, t = {}, n = []) {
  const r = document.createElement(e);
  for (const [a, o] of Object.entries(t))
    a === "class" ? r.className = o : a === "text" ? r.textContent = o : a === "hidden" ? r.hidden = !!o : a === "disabled" ? r.disabled = !!o : a.startsWith("on") ? r.addEventListener(a.slice(2), o) : r.setAttribute(a, o);
  for (const a of [].concat(n)) a != null && r.appendChild(typeof a == "string" ? document.createTextNode(a) : a);
  return r;
}
function Ie(e) {
  Oe && (Oe.hidden = !e, ut && (ut.textContent = e || ""));
}
function ie(e, { done: t = null, total: n = null } = {}) {
  bt.hidden = !1, Bn.textContent = e, n != null && (Ye.max = Math.max(n, 1), Ye.value = t || 0);
}
function Ke() {
  return { id: m.nextId++, agFile: null, ag: null, agError: null, subs: [], subsError: null, results: [], warnings: [], notes: [] };
}
function Lt(e) {
  if (e.agError) return `Problem with autograder zip: ${e.agError}`;
  if (!e.ag) return "No autograder zip selected yet.";
  const { version: t } = Ot({ pin: e.ag.otterPin, override: we?.value }), n = e.ag.config.points_possible ?? $n(e.ag.tests);
  return `Assignment${e.ag.config.assignment_name ? ` "${e.ag.config.assignment_name}"` : ""}: ${e.ag.tests.length} test file${e.ag.tests.length === 1 ? "" : "s"}, ${n} points, otter-grader ${t}.`;
}
function Rt(e) {
  return e.subsError ? `Problem with notebooks: ${e.subsError}` : e.subs.length ? `${e.subs.length} notebook${e.subs.length === 1 ? "" : "s"} ready to grade.` : "No notebooks selected yet.";
}
function Ne() {
  Xe.replaceChildren(), m.batches.forEach((e, t) => {
    const n = `ag-${e.id}`, r = `nb-${e.id}`, a = w("fieldset", { class: "grader-batch", "data-batch": String(e.id) }, [
      w("legend", { text: `Batch ${t + 1}` }),
      w("div", { class: "grader-row" }, [
        w("div", { class: "grader-col" }, [
          w("label", { for: n }, ["Autograder zip", w("input", { id: n, type: "file", accept: ".zip", disabled: m.running, onchange: (o) => bn(e, o.target.files[0]) })]),
          w("p", { class: "grader-meta" + (e.agError ? " grader-meta-error" : ""), id: `${n}-meta`, text: Lt(e) })
        ]),
        w("div", { class: "grader-col" }, [
          w("label", { for: r }, ["Notebooks (.ipynb files or a .zip)", w("input", { id: r, type: "file", multiple: "", accept: ".ipynb,.zip", disabled: m.running, onchange: (o) => Ln(e, o.target.files) })]),
          w("p", { class: "grader-meta" + (e.subsError ? " grader-meta-error" : ""), id: `${r}-meta`, text: Rt(e) })
        ])
      ]),
      m.batches.length > 1 ? w("button", { type: "button", class: "btn-secondary btn-small", disabled: m.running, onclick: () => Nn(e) }, [`Remove batch ${t + 1}`]) : null
    ]);
    Xe.appendChild(a);
  }), be();
}
function $e(e) {
  const t = b(`ag-${e.id}-meta`), n = b(`nb-${e.id}-meta`);
  t && (t.textContent = Lt(e), t.classList.toggle("grader-meta-error", !!e.agError)), n && (n.textContent = Rt(e), n.classList.toggle("grader-meta-error", !!e.subsError)), be();
}
function be() {
  const e = m.batches.length > 0 && m.batches.every((n) => n.ag && n.subs.length > 0);
  _t.disabled = m.running || !e, It.disabled = m.running, Ft.hidden = !m.running;
  const t = m.batches.some((n) => n.results.length);
  Nt.hidden = m.running || !(t || m.batches.some((n) => n.ag || n.subs.length)), Ge.hidden = !t, Ge.disabled = m.running || !t;
}
function Fn() {
  m.batches.push(Ke()), Ne();
}
function Nn(e) {
  m.batches = m.batches.filter((t) => t !== e), Ne();
}
async function bn(e, t) {
  if (e.agFile = t || null, e.ag = null, e.agError = null, !t) return $e(e);
  const n = b(`ag-${e.id}-meta`);
  n && (n.textContent = "Reading autograder zip...");
  try {
    const r = await Bt(t, {
      filter: (a) => !a.startsWith("__MACOSX/") && !/(^|\/)(setup\.sh|run_autograder|run_otter\.py)$/.test(a)
    });
    e.ag = wn(r);
  } catch (r) {
    e.agError = r.message || String(r);
  }
  $e(e);
}
async function Ln(e, t) {
  e.subs = [], e.subsError = null;
  const n = [...t || []];
  if (!n.length) return $e(e);
  const r = b(`nb-${e.id}-meta`);
  r && (r.textContent = "Reading notebooks...");
  try {
    const a = [];
    for (const o of n)
      if (/\.zip$/i.test(o.name)) {
        const c = await Bt(o, { filter: (s) => ct(s) });
        for (const [s, i] of c)
          ct(s) && a.push({ path: s, text: _n.decode(i) });
      } else /\.ipynb$/i.test(o.name) && a.push({ path: o.name, text: await o.text() });
    for (const o of a)
      try {
        JSON.parse(o.text);
      } catch {
        o.invalid = !0;
      }
    if (!a.length) throw new Error("no .ipynb files found in the selection");
    e.subs = kn(xn(a));
  } catch (a) {
    e.subsError = a.message || String(a);
  }
  $e(e);
}
class gt extends Error {
}
class le extends Error {
}
class Rn {
  constructor(t) {
    this.worker = new Worker(new URL(
      /* @vite-ignore */
      "" + new URL("grader.worker.js", import.meta.url).href,
      import.meta.url
    ), { type: "module" }), this.handlers = t, this.pending = /* @__PURE__ */ new Map(), this.nextId = 1, this.worker.onmessage = (n) => this.onMessage(n.data), this.worker.onerror = (n) => {
      const r = new Error(n.message || "worker crashed");
      for (const a of this.pending.values()) a.reject(r);
      this.pending.clear();
    };
  }
  onMessage(t) {
    const n = this.handlers;
    if (t.type === "done") {
      const r = this.pending.get(t.id);
      r && (this.pending.delete(t.id), r.resolve(r.value));
    } else if (t.type === "error") {
      const r = this.pending.get(t.id);
      r && (this.pending.delete(t.id), r.reject(new Error(t.message)));
    } else if (t.type === "result" || t.type === "prepared" || t.type === "frozen" || t.type === "ready") {
      for (const r of this.pending.values()) r.value = t;
      n[t.type]?.(t);
    } else
      n[t.type]?.(t);
  }
  call(t, n = {}) {
    const r = this.nextId++;
    return new Promise((a, o) => {
      this.pending.set(r, { resolve: a, reject: o, value: null }), this.worker.postMessage({ type: t, id: r, ...n });
    });
  }
  terminate() {
    this.worker.terminate();
    const t = new le("cancelled");
    for (const n of this.pending.values()) n.reject(t);
    this.pending.clear();
  }
}
let re = null;
async function Pe(e, t) {
  const n = new Rn({
    phase: (o) => Ie(`${e.name}: ${o.text}...`),
    warning: (o) => e.warnings.push(o.text),
    note: (o) => e.notes.push(o.text),
    started: (o) => t.onStarted?.(o)
  });
  re = n;
  const r = await n.call("init", { lockFile: e.lockFile || null });
  e.pyodideVersion = r?.pyodideVersion;
  const a = await n.call("prepareBatch", {
    otterVersion: t.version,
    requirements: e.ag.requirements,
    extraPackages: t.extraPackages,
    tests: e.ag.tests,
    files: e.ag.files,
    config: e.ag.config
  });
  e.otterVersion = a?.otterVersion || t.version, e.installed = a?.installed || e.installed || {};
  for (const o of a?.notes || []) e.notes.includes(o) || e.notes.push(o);
  if (!e.lockFile)
    try {
      const o = await n.call("freeze");
      e.lockFile = o?.lockFile || null;
    } catch {
    }
  return Ie(null), n;
}
function pe(e, t) {
  return { file: e.file, path: e.path, questions: {}, total: 0, possible: 0, percent: 0, status: t, log: [] };
}
async function qn(e, t) {
  const { version: n, reason: r } = Ot({ pin: e.ag.otterPin, override: we?.value }), a = (On?.value || "").split(/\r?\n/).map((u) => u.trim()).filter(Boolean), o = Math.max(10, parseInt(zn?.value, 10) || 120) * 1e3;
  e.notes.push(r);
  for (const u of e.ag.warnings) e.warnings.push(u);
  const c = { version: n, extraPackages: a, onStarted: null };
  let s;
  try {
    s = await Pe(e, c);
  } catch (u) {
    if (u instanceof le) throw u;
    Ie(null), e.results = e.subs.map((f) => pe(f, `Batch setup failed: ${u.message}`)), e.warnings.push(`batch setup failed: ${u.message}`), t.done += e.subs.length;
    return;
  }
  let i = 0;
  for (const u of e.subs) {
    if (m.cancelled) throw new le("cancelled");
    if (i >= In && (s.terminate(), s = await Pe(e, c), i = 0), ie(`${e.label}: grading ${t.batchDone + 1} of ${e.subs.length} (${u.file})`, t), u.invalid)
      e.results.push(pe(u, "Notebook is not valid JSON"));
    else {
      let f = null;
      const l = new Promise((g, p) => {
        c.onStarted = () => {
          f = setTimeout(() => p(new gt(`Timed out after ${o / 1e3}s`)), o);
        };
      });
      try {
        const g = await Promise.race([s.call("gradeNotebook", { file: u.file, path: u.path, text: u.text }), l]);
        e.results.push(g.result);
      } catch (g) {
        if (g instanceof le || m.cancelled) throw new le("cancelled");
        g instanceof gt ? (s.terminate(), e.results.push(pe(u, g.message)), e.warnings.push(`${u.file}: ${g.message}; the Python runtime was restarted`), s = await Pe(e, c), i = 0) : e.results.push(pe(u, `Grading error: ${g.message}`));
      } finally {
        clearTimeout(f), c.onStarted = null;
      }
    }
    i++, t.done++, t.batchDone++, ie(`${e.label}: graded ${t.batchDone} of ${e.subs.length}`, t), jt();
  }
  s.terminate(), re = null;
}
async function Pn() {
  if (m.running) return;
  m.running = !0, m.cancelled = !1;
  const e = /* @__PURE__ */ new Set();
  m.batches.forEach((n, r) => {
    n.name = yn(n.ag.config, n.agFile?.name, r, e), e.add(n.name), n.label = m.batches.length > 1 ? `Batch ${r + 1} of ${m.batches.length} (${n.name})` : n.name, n.results = [], n.warnings = [], n.notes = [], n.lockFile = null;
  }), ht(!0), ze.replaceChildren();
  const t = { done: 0, total: m.batches.reduce((n, r) => n + r.subs.length, 0), batchDone: 0 };
  ie("Starting...", t), window.addEventListener("beforeunload", vt);
  try {
    for (const n of m.batches)
      t.batchDone = 0, await qn(n, t);
    ie(`Done. Graded ${t.done} notebook${t.done === 1 ? "" : "s"} in ${m.batches.length} batch${m.batches.length === 1 ? "" : "es"}.`, t);
  } catch (n) {
    if (n instanceof le) {
      for (const r of m.batches)
        for (const a of r.subs.slice(r.results.length)) r.results.push(pe(a, "Cancelled"));
      ie("Cancelled.", t);
    } else
      console.error(n), ie(`Error: ${n.message}`, t);
  } finally {
    window.removeEventListener("beforeunload", vt), Ie(null), re && (re.terminate(), re = null), m.running = !1, ht(!1), jt();
  }
}
function ht(e) {
  for (const t of Xe.querySelectorAll("input, button")) t.disabled = e;
  be();
}
function vt(e) {
  e.preventDefault(), e.returnValue = "";
}
function jn() {
  m.running && (m.cancelled = !0, re && re.terminate());
}
function dt(e) {
  return `${Math.round((e || 0) * 1e3) / 10}%`;
}
function qt(e) {
  return Tn(e.results);
}
function Pt(e) {
  return An({ name: e.name, otterVersion: e.otterVersion, pyodideVersion: e.pyodideVersion, notes: e.notes, warnings: e.warnings, installed: e.installed, requirements: e.ag?.requirements, results: e.results });
}
function jt() {
  ze.replaceChildren();
  for (const e of m.batches) {
    if (!e.results.length) continue;
    const t = e.results.filter((s) => s.status === "Completed"), n = t.length ? t.reduce((s, i) => s + (i.percent || 0), 0) / t.length : 0, r = `${e.results.length} of ${e.subs.length} graded, ${e.results.length - t.length} failed, mean ${dt(n)}`, a = e.results.map((s) => {
      const i = s.status !== "Completed", u = (s.log || []).length ? w("details", {}, [w("summary", { text: `${s.log.length} note${s.log.length === 1 ? "" : "s"}` }), w("pre", { text: s.log.join(`
`) })]) : null;
      return w("tr", { class: i ? "grader-row-failed" : "" }, [
        w("td", { text: s.file }),
        w("td", { text: i ? "" : `${s.total} / ${s.possible}` }),
        w("td", { text: i ? "" : dt(s.percent) }),
        w("td", {}, [s.status, u])
      ]);
    }), o = e.results.length === e.subs.length, c = w("section", { class: "grader-result" }, [
      w("h3", {}, [e.name, " ", w("span", { class: "grader-summary", text: r })]),
      e.warnings.length ? w("details", { class: "grader-warnings" }, [w("summary", { text: `${e.warnings.length} warning${e.warnings.length === 1 ? "" : "s"}` }), w("ul", {}, e.warnings.map((s) => w("li", { text: s })))]) : null,
      w("div", { class: "grader-table-wrap" }, [
        w("table", {}, [
          w("thead", {}, [w("tr", {}, [w("th", { text: "Notebook" }), w("th", { text: "Score" }), w("th", { text: "Percent" }), w("th", { text: "Status" })])]),
          w("tbody", {}, a)
        ])
      ]),
      w("div", { class: "grader-actions" }, [
        w("button", { type: "button", disabled: !o, onclick: () => Ue(new Blob([qt(e)], { type: "text/csv" }), `${e.name}-grades.csv`) }, [`Download ${e.name}-grades.csv`]),
        w("button", { type: "button", class: "btn-secondary", disabled: !o, onclick: () => Ue(new Blob([Pt(e)], { type: "text/plain" }), `${e.name}-grading.log`) }, [`Download ${e.name}-grading.log`])
      ])
    ]);
    ze.appendChild(c);
  }
  be();
}
function Dn() {
  const e = {}, t = { generated: (/* @__PURE__ */ new Date()).toISOString(), batches: [] };
  for (const n of m.batches)
    n.results.length && (e[`${n.name}-grades.csv`] = qt(n), e[`${n.name}-grading.log`] = Pt(n), t.batches.push({ name: n.name, autograder: n.agFile?.name, notebooks: n.subs.length, otterVersion: n.otterVersion, pyodideVersion: n.pyodideVersion, requirements: n.ag?.requirements || [], installed: n.installed || {} }), n.lockFile && (e[`${n.name}-packages.lock.json`] = n.lockFile));
  e["manifest.json"] = JSON.stringify(t, null, 2), Ue(gn(e), `otter-grades-${En()}.zip`);
}
function Vn() {
  m.running || (m.batches = [Ke()], ze.replaceChildren(), bt.hidden = !0, Ye.value = 0, Ne());
}
It.addEventListener("click", Fn);
_t.addEventListener("click", Pn);
Ft.addEventListener("click", jn);
Nt.addEventListener("click", Vn);
Ge.addEventListener("click", Dn);
we?.addEventListener("input", () => m.batches.forEach($e));
we && (we.placeholder = `(from autograder zip, else ${zt})`);
m.batches = [Ke()];
Ne();
