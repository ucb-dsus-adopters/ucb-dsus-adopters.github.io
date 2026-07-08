var Je = {}, Ut = function(t, e, r, n, a) {
  var i = new Worker(Je[e] || (Je[e] = URL.createObjectURL(new Blob([
    t + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
  ], { type: "text/javascript" }))));
  return i.onmessage = function(s) {
    var l = s.data, u = l.$e$;
    if (u) {
      var f = new Error(u[0]);
      f.code = u[1], f.stack = u[2], a(f, null);
    } else
      a(null, l);
  }, i.postMessage(r, n), i;
}, I = Uint8Array, Z = Uint16Array, de = Int32Array, ue = new I([
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
]), he = new I([
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
]), me = new I([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), it = function(t, e) {
  for (var r = new Z(31), n = 0; n < 31; ++n)
    r[n] = e += 1 << t[n - 1];
  for (var a = new de(r[30]), n = 1; n < 30; ++n)
    for (var i = r[n]; i < r[n + 1]; ++i)
      a[i] = i - r[n] << 5 | n;
  return { b: r, r: a };
}, st = it(ue, 2), je = st.b, Fe = st.r;
je[28] = 258, Fe[258] = 28;
var ot = it(he, 0), lt = ot.b, ke = ot.r, ye = new Z(32768);
for (var A = 0; A < 32768; ++A) {
  var _ = (A & 43690) >> 1 | (A & 21845) << 1;
  _ = (_ & 52428) >> 2 | (_ & 13107) << 2, _ = (_ & 61680) >> 4 | (_ & 3855) << 4, ye[A] = ((_ & 65280) >> 8 | (_ & 255) << 8) >> 1;
}
var X = function(t, e, r) {
  for (var n = t.length, a = 0, i = new Z(e); a < n; ++a)
    t[a] && ++i[t[a] - 1];
  var s = new Z(e);
  for (a = 1; a < e; ++a)
    s[a] = s[a - 1] + i[a - 1] << 1;
  var l;
  if (r) {
    l = new Z(1 << e);
    var u = 15 - e;
    for (a = 0; a < n; ++a)
      if (t[a])
        for (var f = a << 4 | t[a], o = e - t[a], h = s[t[a] - 1]++ << o, p = h | (1 << o) - 1; h <= p; ++h)
          l[ye[h] >> u] = f;
  } else
    for (l = new Z(n), a = 0; a < n; ++a)
      t[a] && (l[a] = ye[s[t[a] - 1]++] >> 15 - t[a]);
  return l;
}, V = new I(288);
for (var A = 0; A < 144; ++A)
  V[A] = 8;
for (var A = 144; A < 256; ++A)
  V[A] = 9;
for (var A = 256; A < 280; ++A)
  V[A] = 7;
for (var A = 280; A < 288; ++A)
  V[A] = 8;
var fe = new I(32);
for (var A = 0; A < 32; ++A)
  fe[A] = 5;
var ft = /* @__PURE__ */ X(V, 9, 0), ut = /* @__PURE__ */ X(V, 9, 1), ht = /* @__PURE__ */ X(fe, 5, 0), ct = /* @__PURE__ */ X(fe, 5, 1), Re = function(t) {
  for (var e = t[0], r = 1; r < t.length; ++r)
    t[r] > e && (e = t[r]);
  return e;
}, j = function(t, e, r) {
  var n = e / 8 | 0;
  return (t[n] | t[n + 1] << 8) >> (e & 7) & r;
}, Se = function(t, e) {
  var r = e / 8 | 0;
  return (t[r] | t[r + 1] << 8 | t[r + 2] << 16) >> (e & 7);
}, xe = function(t) {
  return (t + 7) / 8 | 0;
}, J = function(t, e, r) {
  return (e == null || e < 0) && (e = 0), (r == null || r > t.length) && (r = t.length), new I(t.subarray(e, r));
}, vt = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], S = function(t, e, r) {
  var n = new Error(e || vt[t]);
  if (n.code = t, Error.captureStackTrace && Error.captureStackTrace(n, S), !r)
    throw n;
  return n;
}, Xe = function(t, e, r, n) {
  var a = t.length, i = n ? n.length : 0;
  if (!a || e.f && !e.l)
    return r || new I(0);
  var s = !r, l = s || e.i != 2, u = e.i;
  s && (r = new I(a * 3));
  var f = function(ce) {
    var ve = r.length;
    if (ce > ve) {
      var ae = new I(Math.max(ve * 2, ce));
      ae.set(r), r = ae;
    }
  }, o = e.f || 0, h = e.p || 0, p = e.b || 0, d = e.l, v = e.d, z = e.m, x = e.n, c = a * 8;
  do {
    if (!d) {
      o = j(t, h, 1);
      var w = j(t, h + 1, 3);
      if (h += 3, w)
        if (w == 1)
          d = ut, v = ct, z = 9, x = 5;
        else if (w == 2) {
          var T = j(t, h, 31) + 257, B = j(t, h + 10, 15) + 4, m = T + j(t, h + 5, 31) + 1;
          h += 14;
          for (var g = new I(m), M = new I(19), y = 0; y < B; ++y)
            M[me[y]] = j(t, h + y * 3, 7);
          h += B * 3;
          for (var C = Re(M), $ = (1 << C) - 1, U = X(M, C, 1), y = 0; y < m; ) {
            var k = U[j(t, h, $)];
            h += k & 15;
            var E = k >> 4;
            if (E < 16)
              g[y++] = E;
            else {
              var L = 0, b = 0;
              for (E == 16 ? (b = 3 + j(t, h, 3), h += 2, L = g[y - 1]) : E == 17 ? (b = 3 + j(t, h, 7), h += 3) : E == 18 && (b = 11 + j(t, h, 127), h += 7); b--; )
                g[y++] = L;
            }
          }
          var P = g.subarray(0, T), O = g.subarray(T);
          z = Re(P), x = Re(O), d = X(P, z, 1), v = X(O, x, 1);
        } else
          S(1);
      else {
        var E = xe(h) + 4, F = t[E - 4] | t[E - 3] << 8, R = E + F;
        if (R > a) {
          u && S(0);
          break;
        }
        l && f(p + F), r.set(t.subarray(E, R), p), e.b = p += F, e.p = h = R * 8, e.f = o;
        continue;
      }
      if (h > c) {
        u && S(0);
        break;
      }
    }
    l && f(p + 131072);
    for (var ee = (1 << z) - 1, N = (1 << x) - 1, K = h; ; K = h) {
      var L = d[Se(t, h) & ee], W = L >> 4;
      if (h += L & 15, h > c) {
        u && S(0);
        break;
      }
      if (L || S(2), W < 256)
        r[p++] = W;
      else if (W == 256) {
        K = h, d = null;
        break;
      } else {
        var q = W - 254;
        if (W > 264) {
          var y = W - 257, H = ue[y];
          q = j(t, h, (1 << H) - 1) + je[y], h += H;
        }
        var G = v[Se(t, h) & N], re = G >> 4;
        G || S(3), h += G & 15;
        var O = lt[re];
        if (re > 3) {
          var H = he[re];
          O += Se(t, h) & (1 << H) - 1, h += H;
        }
        if (h > c) {
          u && S(0);
          break;
        }
        l && f(p + 131072);
        var ne = p + q;
        if (p < O) {
          var ze = i - O, Ee = Math.min(O, ne);
          for (ze + p < 0 && S(3); p < Ee; ++p)
            r[p] = n[ze + p];
        }
        for (; p < ne; ++p)
          r[p] = r[p - O];
      }
    }
    e.l = d, e.p = K, e.b = p, e.f = o, d && (o = 1, e.m = z, e.d = v, e.n = x);
  } while (!o);
  return p != r.length && s ? J(r, 0, p) : r.subarray(0, p);
}, Y = function(t, e, r) {
  r <<= e & 7;
  var n = e / 8 | 0;
  t[n] |= r, t[n + 1] |= r >> 8;
}, ie = function(t, e, r) {
  r <<= e & 7;
  var n = e / 8 | 0;
  t[n] |= r, t[n + 1] |= r >> 8, t[n + 2] |= r >> 16;
}, Be = function(t, e) {
  for (var r = [], n = 0; n < t.length; ++n)
    t[n] && r.push({ s: n, f: t[n] });
  var a = r.length, i = r.slice();
  if (!a)
    return { t: te, l: 0 };
  if (a == 1) {
    var s = new I(r[0].s + 1);
    return s[r[0].s] = 1, { t: s, l: 1 };
  }
  r.sort(function(R, T) {
    return R.f - T.f;
  }), r.push({ s: -1, f: 25001 });
  var l = r[0], u = r[1], f = 0, o = 1, h = 2;
  for (r[0] = { s: -1, f: l.f + u.f, l, r: u }; o != a - 1; )
    l = r[r[f].f < r[h].f ? f++ : h++], u = r[f != o && r[f].f < r[h].f ? f++ : h++], r[o++] = { s: -1, f: l.f + u.f, l, r: u };
  for (var p = i[0].s, n = 1; n < a; ++n)
    i[n].s > p && (p = i[n].s);
  var d = new Z(p + 1), v = be(r[o - 1], d, 0);
  if (v > e) {
    var n = 0, z = 0, x = v - e, c = 1 << x;
    for (i.sort(function(T, B) {
      return d[B.s] - d[T.s] || T.f - B.f;
    }); n < a; ++n) {
      var w = i[n].s;
      if (d[w] > e)
        z += c - (1 << v - d[w]), d[w] = e;
      else
        break;
    }
    for (z >>= x; z > 0; ) {
      var E = i[n].s;
      d[E] < e ? z -= 1 << e - d[E]++ - 1 : ++n;
    }
    for (; n >= 0 && z; --n) {
      var F = i[n].s;
      d[F] == e && (--d[F], ++z);
    }
    v = e;
  }
  return { t: new I(d), l: v };
}, be = function(t, e, r) {
  return t.s == -1 ? Math.max(be(t.l, e, r + 1), be(t.r, e, r + 1)) : e[t.s] = r;
}, Oe = function(t) {
  for (var e = t.length; e && !t[--e]; )
    ;
  for (var r = new Z(++e), n = 0, a = t[0], i = 1, s = function(u) {
    r[n++] = u;
  }, l = 1; l <= e; ++l)
    if (t[l] == a && l != e)
      ++i;
    else {
      if (!a && i > 2) {
        for (; i > 138; i -= 138)
          s(32754);
        i > 2 && (s(i > 10 ? i - 11 << 5 | 28690 : i - 3 << 5 | 12305), i = 0);
      } else if (i > 3) {
        for (s(a), --i; i > 6; i -= 6)
          s(8304);
        i > 2 && (s(i - 3 << 5 | 8208), i = 0);
      }
      for (; i--; )
        s(a);
      i = 1, a = t[l];
    }
  return { c: r.subarray(0, n), n: e };
}, se = function(t, e) {
  for (var r = 0, n = 0; n < e.length; ++n)
    r += t[n] * e[n];
  return r;
}, Ge = function(t, e, r) {
  var n = r.length, a = xe(e + 2);
  t[a] = n & 255, t[a + 1] = n >> 8, t[a + 2] = t[a] ^ 255, t[a + 3] = t[a + 1] ^ 255;
  for (var i = 0; i < n; ++i)
    t[a + i + 4] = r[i];
  return (a + 4 + n) * 8;
}, Pe = function(t, e, r, n, a, i, s, l, u, f, o) {
  Y(e, o++, r), ++a[256];
  for (var h = Be(a, 15), p = h.t, d = h.l, v = Be(i, 15), z = v.t, x = v.l, c = Oe(p), w = c.c, E = c.n, F = Oe(z), R = F.c, T = F.n, B = new Z(19), m = 0; m < w.length; ++m)
    ++B[w[m] & 31];
  for (var m = 0; m < R.length; ++m)
    ++B[R[m] & 31];
  for (var g = Be(B, 7), M = g.t, y = g.l, C = 19; C > 4 && !M[me[C - 1]]; --C)
    ;
  var $ = f + 5 << 3, U = se(a, V) + se(i, fe) + s, k = se(a, p) + se(i, z) + s + 14 + 3 * C + se(B, M) + 2 * B[16] + 3 * B[17] + 7 * B[18];
  if (u >= 0 && $ <= U && $ <= k)
    return Ge(e, o, t.subarray(u, u + f));
  var L, b, P, O;
  if (Y(e, o, 1 + (k < U)), o += 2, k < U) {
    L = X(p, d, 0), b = p, P = X(z, x, 0), O = z;
    var ee = X(M, y, 0);
    Y(e, o, E - 257), Y(e, o + 5, T - 1), Y(e, o + 10, C - 4), o += 14;
    for (var m = 0; m < C; ++m)
      Y(e, o + 3 * m, M[me[m]]);
    o += 3 * C;
    for (var N = [w, R], K = 0; K < 2; ++K)
      for (var W = N[K], m = 0; m < W.length; ++m) {
        var q = W[m] & 31;
        Y(e, o, ee[q]), o += M[q], q > 15 && (Y(e, o, W[m] >> 5 & 127), o += W[m] >> 12);
      }
  } else
    L = ft, b = V, P = ht, O = fe;
  for (var m = 0; m < l; ++m) {
    var H = n[m];
    if (H > 255) {
      var q = H >> 18 & 31;
      ie(e, o, L[q + 257]), o += b[q + 257], q > 7 && (Y(e, o, H >> 23 & 31), o += ue[q]);
      var G = H & 31;
      ie(e, o, P[G]), o += O[G], G > 3 && (ie(e, o, H >> 5 & 8191), o += he[G]);
    } else
      ie(e, o, L[H]), o += b[H];
  }
  return ie(e, o, L[256]), o + b[256];
}, pt = /* @__PURE__ */ new de([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), te = /* @__PURE__ */ new I(0), gt = function(t, e, r, n, a, i) {
  var s = i.z || t.length, l = new I(n + s + 5 * (1 + Math.ceil(s / 7e3)) + a), u = l.subarray(n, l.length - a), f = i.l, o = (i.r || 0) & 7;
  if (e) {
    o && (u[0] = i.r >> 3);
    for (var h = pt[e - 1], p = h >> 13, d = h & 8191, v = (1 << r) - 1, z = i.p || new Z(32768), x = i.h || new Z(v + 1), c = Math.ceil(r / 3), w = 2 * c, E = function(He) {
      return (t[He] ^ t[He + 1] << c ^ t[He + 2] << w) & v;
    }, F = new de(25e3), R = new Z(288), T = new Z(32), B = 0, m = 0, g = i.i || 0, M = 0, y = i.w || 0, C = 0; g + 2 < s; ++g) {
      var $ = E(g), U = g & 32767, k = x[$];
      if (z[U] = k, x[$] = U, y <= g) {
        var L = s - g;
        if ((B > 7e3 || M > 24576) && (L > 423 || !f)) {
          o = Pe(t, u, 0, F, R, T, m, M, C, g - C, o), M = B = m = 0, C = g;
          for (var b = 0; b < 286; ++b)
            R[b] = 0;
          for (var b = 0; b < 30; ++b)
            T[b] = 0;
        }
        var P = 2, O = 0, ee = d, N = U - k & 32767;
        if (L > 2 && $ == E(g - N))
          for (var K = Math.min(p, L) - 1, W = Math.min(32767, g), q = Math.min(258, L); N <= W && --ee && U != k; ) {
            if (t[g + P] == t[g + P - N]) {
              for (var H = 0; H < q && t[g + H] == t[g + H - N]; ++H)
                ;
              if (H > P) {
                if (P = H, O = N, H > K)
                  break;
                for (var G = Math.min(N, H - 2), re = 0, b = 0; b < G; ++b) {
                  var ne = g - N + b & 32767, ze = z[ne], Ee = ne - ze & 32767;
                  Ee > re && (re = Ee, k = ne);
                }
              }
            }
            U = k, k = z[U], N += U - k & 32767;
          }
        if (O) {
          F[M++] = 268435456 | Fe[P] << 18 | ke[O];
          var ce = Fe[P] & 31, ve = ke[O] & 31;
          m += ue[ce] + he[ve], ++R[257 + ce], ++T[ve], y = g + P, ++B;
        } else
          F[M++] = t[g], ++R[t[g]];
      }
    }
    for (g = Math.max(g, y); g < s; ++g)
      F[M++] = t[g], ++R[t[g]];
    o = Pe(t, u, f, F, R, T, m, M, C, g - C, o), f || (i.r = o & 7 | u[o / 8 | 0] << 3, o -= 7, i.h = x, i.p = z, i.i = g, i.w = y);
  } else {
    for (var g = i.w || 0; g < s + f; g += 65535) {
      var ae = g + 65535;
      ae >= s && (u[o / 8 | 0] = f, ae = s), o = Ge(u, o + 1, t.subarray(g, ae));
    }
    i.i = s;
  }
  return J(l, 0, n + xe(o) + a);
}, Ht = /* @__PURE__ */ function() {
  for (var t = new Int32Array(256), e = 0; e < 256; ++e) {
    for (var r = e, n = 9; --n; )
      r = (r & 1 && -306674912) ^ r >>> 1;
    t[e] = r;
  }
  return t;
}(), Lt = function() {
  var t = -1;
  return {
    p: function(e) {
      for (var r = t, n = 0; n < e.length; ++n)
        r = Ht[r & 255 ^ e[n]] ^ r >>> 8;
      t = r;
    },
    d: function() {
      return ~t;
    }
  };
}, Ye = function(t, e, r, n, a) {
  if (!a && (a = { l: 1 }, e.dictionary)) {
    var i = e.dictionary.subarray(-32768), s = new I(i.length + t.length);
    s.set(i), s.set(t, i.length), t = s, a.w = i.length;
  }
  return gt(t, e.level == null ? 6 : e.level, e.mem == null ? a.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(t.length))) * 1.5) : 20 : 12 + e.mem, r, n, a);
}, wt = function(t, e) {
  var r = {};
  for (var n in t)
    r[n] = t[n];
  for (var n in e)
    r[n] = e[n];
  return r;
}, Ke = function(t, e, r) {
  for (var n = t(), a = t.toString(), i = a.slice(a.indexOf("[") + 1, a.lastIndexOf("]")).replace(/\s+/g, "").split(","), s = 0; s < n.length; ++s) {
    var l = n[s], u = i[s];
    if (typeof l == "function") {
      e += ";" + u + "=";
      var f = l.toString();
      if (l.prototype)
        if (f.indexOf("[native code]") != -1) {
          var o = f.indexOf(" ", 8) + 1;
          e += f.slice(o, f.indexOf("(", o));
        } else {
          e += f;
          for (var h in l.prototype)
            e += ";" + u + ".prototype." + h + "=" + l.prototype[h].toString();
        }
      else
        e += f;
    } else
      r[u] = l;
  }
  return e;
}, Me = [], Dt = function(t) {
  var e = [];
  for (var r in t)
    t[r].buffer && e.push((t[r] = new t[r].constructor(t[r])).buffer);
  return e;
}, $t = function(t, e, r, n) {
  if (!Me[r]) {
    for (var a = "", i = {}, s = t.length - 1, l = 0; l < s; ++l)
      a = Ke(t[l], a, i);
    Me[r] = { c: Ke(t[s], a, i), e: i };
  }
  var u = wt({}, Me[r].e);
  return Ut(Me[r].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + e.toString() + "}", r, u, Dt(u), n);
}, kt = function() {
  return [I, Z, de, ue, he, me, je, lt, ut, ct, ye, vt, X, Re, j, Se, xe, J, S, Xe, qt, mt, Pt];
}, Ot = function() {
  return [I, Z, de, ue, he, me, Fe, ke, ft, V, ht, fe, ye, pt, te, X, Y, ie, Be, be, Oe, se, Ge, Pe, xe, J, gt, Ye, Nt, mt];
}, mt = function(t) {
  return postMessage(t, [t.buffer]);
}, Pt = function(t) {
  return t && {
    out: t.size && new I(t.size),
    dictionary: t.dictionary
  };
}, Ae = function(t) {
  return t.ondata = function(e, r) {
    return postMessage([e, r], [e.buffer]);
  }, function(e) {
    e.data.length ? (t.push(e.data[0], e.data[1]), postMessage([e.data[0].length])) : t.flush();
  };
}, yt = function(t, e, r, n, a, i, s) {
  var l, u = $t(t, n, a, function(f, o) {
    f ? (u.terminate(), e.ondata.call(e, f)) : Array.isArray(o) ? o.length == 1 ? (e.queuedSize -= o[0], e.ondrain && e.ondrain(o[0])) : (o[1] && u.terminate(), e.ondata.call(e, f, o[0], o[1])) : s(o);
  });
  u.postMessage(r), e.queuedSize = 0, e.push = function(f, o) {
    e.ondata || S(5), l && e.ondata(S(4, 0, 1), null, !!o), e.queuedSize += f.length, u.postMessage([f, l = o], [f.buffer]);
  }, e.terminate = function() {
    u.terminate();
  }, i && (e.flush = function() {
    u.postMessage([]);
  });
}, oe = function(t, e) {
  return t[e] | t[e + 1] << 8;
}, le = function(t, e) {
  return (t[e] | t[e + 1] << 8 | t[e + 2] << 16 | t[e + 3] << 24) >>> 0;
}, Le = function(t, e) {
  return le(t, e) + le(t, e + 4) * 4294967296;
}, D = function(t, e, r) {
  for (; r; ++e)
    t[e] = r, r >>>= 8;
};
function dt(t, e) {
  return typeof t == "function" && (e = t, t = {}), this.ondata = e, t;
}
var Qe = /* @__PURE__ */ function() {
  function t(e, r) {
    if (typeof e == "function" && (r = e, e = {}), this.ondata = r, this.o = e || {}, this.s = { l: 0, i: 32768, w: 32768, z: 32768 }, this.b = new I(98304), this.o.dictionary) {
      var n = this.o.dictionary.subarray(-32768);
      this.b.set(n, 32768 - n.length), this.s.i = 32768 - n.length;
    }
  }
  return t.prototype.p = function(e, r) {
    this.ondata(Ye(e, this.o, 0, 0, this.s), r);
  }, t.prototype.push = function(e, r) {
    this.ondata || S(5), this.s.l && S(4);
    var n = e.length + this.s.z;
    if (n > this.b.length) {
      if (n > 2 * this.b.length - 32768) {
        var a = new I(n & -32768);
        a.set(this.b.subarray(0, this.s.z)), this.b = a;
      }
      var i = this.b.length - this.s.z;
      this.b.set(e.subarray(0, i), this.s.z), this.s.z = this.b.length, this.p(this.b, !1), this.b.set(this.b.subarray(-32768)), this.b.set(e.subarray(i), 32768), this.s.z = e.length - i + 32768, this.s.i = 32766, this.s.w = 32768;
    } else
      this.b.set(e, this.s.z), this.s.z += e.length;
    this.s.l = r & 1, (this.s.z > this.s.w + 8191 || r) && (this.p(this.b, r || !1), this.s.w = this.s.i, this.s.i -= 2);
  }, t.prototype.flush = function() {
    this.ondata || S(5), this.s.l && S(4), this.p(this.b, !1), this.s.w = this.s.i, this.s.i -= 2;
  }, t;
}(), Zt = /* @__PURE__ */ function() {
  function t(e, r) {
    yt([
      Ot,
      function() {
        return [Ae, Qe];
      }
    ], this, dt.call(this, e, r), function(n) {
      var a = new Qe(n.data);
      onmessage = Ae(a);
    }, 6, 1);
  }
  return t;
}();
function Nt(t, e) {
  return Ye(t, e || {}, 0, 0);
}
var Ze = /* @__PURE__ */ function() {
  function t(e, r) {
    typeof e == "function" && (r = e, e = {}), this.ondata = r;
    var n = e && e.dictionary && e.dictionary.subarray(-32768);
    this.s = { i: 0, b: n ? n.length : 0 }, this.o = new I(32768), this.p = new I(0), n && this.o.set(n);
  }
  return t.prototype.e = function(e) {
    if (this.ondata || S(5), this.d && S(4), !this.p.length)
      this.p = e;
    else if (e.length) {
      var r = new I(this.p.length + e.length);
      r.set(this.p), r.set(e, this.p.length), this.p = r;
    }
  }, t.prototype.c = function(e) {
    this.s.i = +(this.d = e || !1);
    var r = this.s.b, n = Xe(this.p, this.s, this.o);
    this.ondata(J(n, r, this.s.b), this.d), this.o = J(n, this.s.b - 32768), this.s.b = this.o.length, this.p = J(this.p, this.s.p / 8 | 0), this.s.p &= 7;
  }, t.prototype.push = function(e, r) {
    this.e(e), this.c(r);
  }, t;
}(), Wt = /* @__PURE__ */ function() {
  function t(e, r) {
    yt([
      kt,
      function() {
        return [Ae, Ze];
      }
    ], this, dt.call(this, e, r), function(n) {
      var a = new Ze(n.data);
      onmessage = Ae(a);
    }, 7, 0);
  }
  return t;
}();
function qt(t, e) {
  return Xe(t, { i: 2 }, e && e.out, e && e.dictionary);
}
var Ve = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), Ne = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), jt = 0;
try {
  Ne.decode(te, { stream: !0 }), jt = 1;
} catch {
}
var Xt = function(t) {
  for (var e = "", r = 0; ; ) {
    var n = t[r++], a = (n > 127) + (n > 223) + (n > 239);
    if (r + a > t.length)
      return { s: e, r: J(t, r - 1) };
    a ? a == 3 ? (n = ((n & 15) << 18 | (t[r++] & 63) << 12 | (t[r++] & 63) << 6 | t[r++] & 63) - 65536, e += String.fromCharCode(55296 | n >> 10, 56320 | n & 1023)) : a & 1 ? e += String.fromCharCode((n & 31) << 6 | t[r++] & 63) : e += String.fromCharCode((n & 15) << 12 | (t[r++] & 63) << 6 | t[r++] & 63) : e += String.fromCharCode(n);
  }
};
function _e(t, e) {
  var r;
  if (Ve)
    return Ve.encode(t);
  for (var n = t.length, a = new I(t.length + (t.length >> 1)), i = 0, s = function(f) {
    a[i++] = f;
  }, r = 0; r < n; ++r) {
    if (i + 5 > a.length) {
      var l = new I(i + 8 + (n - r << 1));
      l.set(a), a = l;
    }
    var u = t.charCodeAt(r);
    u < 128 || e ? s(u) : u < 2048 ? (s(192 | u >> 6), s(128 | u & 63)) : u > 55295 && u < 57344 ? (u = 65536 + (u & 1047552) | t.charCodeAt(++r) & 1023, s(240 | u >> 18), s(128 | u >> 12 & 63), s(128 | u >> 6 & 63), s(128 | u & 63)) : (s(224 | u >> 12), s(128 | u >> 6 & 63), s(128 | u & 63));
  }
  return J(a, 0, i);
}
function Gt(t, e) {
  if (e) {
    for (var r = "", n = 0; n < t.length; n += 16384)
      r += String.fromCharCode.apply(null, t.subarray(n, n + 16384));
    return r;
  } else {
    if (Ne)
      return Ne.decode(t);
    var a = Xt(t), i = a.s, r = a.r;
    return r.length && S(8), i;
  }
}
var Yt = function(t) {
  return t == 1 ? 3 : t < 6 ? 2 : t == 9 ? 1 : 0;
}, Jt = function(t, e) {
  for (; oe(t, e) != 1; e += 4 + oe(t, e + 2))
    ;
  return [Le(t, e + 12), Le(t, e + 4), Le(t, e + 20)];
}, Ie = function(t) {
  var e = 0;
  if (t)
    for (var r in t) {
      var n = t[r].length;
      n > 65535 && S(9), e += n + 4;
    }
  return e;
}, et = function(t, e, r, n, a, i, s, l) {
  var u = n.length, f = r.extra, o = l && l.length, h = Ie(f);
  D(t, e, s != null ? 33639248 : 67324752), e += 4, s != null && (t[e++] = 20, t[e++] = r.os), t[e] = 20, e += 2, t[e++] = r.flag << 1 | (i < 0 && 8), t[e++] = a && 8, t[e++] = r.compression & 255, t[e++] = r.compression >> 8;
  var p = new Date(r.mtime == null ? Date.now() : r.mtime), d = p.getFullYear() - 1980;
  if ((d < 0 || d > 119) && S(10), D(t, e, d << 25 | p.getMonth() + 1 << 21 | p.getDate() << 16 | p.getHours() << 11 | p.getMinutes() << 5 | p.getSeconds() >> 1), e += 4, i != -1 && (D(t, e, r.crc), D(t, e + 4, i < 0 ? -i - 2 : i), D(t, e + 8, r.size)), D(t, e + 12, u), D(t, e + 14, h), e += 16, s != null && (D(t, e, o), D(t, e + 6, r.attrs), D(t, e + 10, s), e += 14), t.set(n, e), e += u, h)
    for (var v in f) {
      var z = f[v], x = z.length;
      D(t, e, +v), D(t, e + 2, x), t.set(z, e + 4), e += 4 + x;
    }
  return o && (t.set(l, e), e += o), e;
}, Kt = function(t, e, r, n, a) {
  D(t, e, 101010256), D(t, e + 8, r), D(t, e + 10, r), D(t, e + 12, n), D(t, e + 16, a);
}, We = /* @__PURE__ */ function() {
  function t(e) {
    this.filename = e, this.c = Lt(), this.size = 0, this.compression = 0;
  }
  return t.prototype.process = function(e, r) {
    this.ondata(null, e, r);
  }, t.prototype.push = function(e, r) {
    this.ondata || S(5), this.c.p(e), this.size += e.length, r && (this.crc = this.c.d()), this.process(e, r || !1);
  }, t;
}(), tt = /* @__PURE__ */ function() {
  function t(e, r) {
    var n = this;
    r || (r = {}), We.call(this, e), this.d = new Zt(r, function(a, i, s) {
      n.ondata(a, i, s);
    }), this.compression = 8, this.flag = Yt(r.level), this.terminate = this.d.terminate;
  }
  return t.prototype.process = function(e, r) {
    this.d.push(e, r);
  }, t.prototype.push = function(e, r) {
    We.prototype.push.call(this, e, r);
  }, t;
}(), Qt = /* @__PURE__ */ function() {
  function t(e) {
    this.ondata = e, this.u = [], this.d = 1;
  }
  return t.prototype.add = function(e) {
    var r = this;
    if (this.ondata || S(5), this.d & 2)
      this.ondata(S(4 + (this.d & 1) * 8, 0, 1), null, !1);
    else {
      var n = _e(e.filename), a = n.length, i = e.comment, s = i && _e(i), l = a != e.filename.length || s && i.length != s.length, u = a + Ie(e.extra) + 30;
      a > 65535 && this.ondata(S(11, 0, 1), null, !1);
      var f = new I(u);
      et(f, 0, e, n, l, -1);
      var o = [f], h = function() {
        for (var x = 0, c = o; x < c.length; x++) {
          var w = c[x];
          r.ondata(null, w, !1);
        }
        o = [];
      }, p = this.d;
      this.d = 0;
      var d = this.u.length, v = wt(e, {
        f: n,
        u: l,
        o: s,
        t: function() {
          e.terminate && e.terminate();
        },
        r: function() {
          if (h(), p) {
            var x = r.u[d + 1];
            x ? x.r() : r.d = 1;
          }
          p = 1;
        }
      }), z = 0;
      e.ondata = function(x, c, w) {
        if (x)
          r.ondata(x, c, w), r.terminate();
        else if (z += c.length, o.push(c), w) {
          var E = new I(16);
          D(E, 0, 134695760), D(E, 4, e.crc), D(E, 8, z), D(E, 12, e.size), o.push(E), v.c = z, v.b = u + z + 16, v.crc = e.crc, v.size = e.size, p && v.r(), p = 1;
        } else p && h();
      }, this.u.push(v);
    }
  }, t.prototype.end = function() {
    var e = this;
    if (this.d & 2) {
      this.ondata(S(4 + (this.d & 1) * 8, 0, 1), null, !0);
      return;
    }
    this.d ? this.e() : this.u.push({
      r: function() {
        e.d & 1 && (e.u.splice(-1, 1), e.e());
      },
      t: function() {
      }
    }), this.d = 3;
  }, t.prototype.e = function() {
    for (var e = 0, r = 0, n = 0, a = 0, i = this.u; a < i.length; a++) {
      var s = i[a];
      n += 46 + s.f.length + Ie(s.extra) + (s.o ? s.o.length : 0);
    }
    for (var l = new I(n + 22), u = 0, f = this.u; u < f.length; u++) {
      var s = f[u];
      et(l, e, s, s.f, s.u, -s.c - 2, r, s.o), e += 46 + s.f.length + Ie(s.extra) + (s.o ? s.o.length : 0), r += s.b;
    }
    Kt(l, e, this.u.length, n, r), this.ondata(null, l, !0), this.d = 2;
  }, t.prototype.terminate = function() {
    for (var e = 0, r = this.u; e < r.length; e++) {
      var n = r[e];
      n.t();
    }
    this.d = 2;
  }, t;
}(), xt = /* @__PURE__ */ function() {
  function t() {
  }
  return t.prototype.push = function(e, r) {
    this.ondata(null, e, r);
  }, t.compression = 0, t;
}(), Vt = /* @__PURE__ */ function() {
  function t(e, r) {
    var n = this;
    r < 32e4 ? this.i = new Ze(function(a, i) {
      n.ondata(null, a, i);
    }) : (this.i = new Wt(function(a, i, s) {
      n.ondata(a, i, s);
    }), this.terminate = this.i.terminate);
  }
  return t.prototype.push = function(e, r) {
    this.i.terminate && (e = J(e, 0)), this.i.push(e, r);
  }, t.compression = 8, t;
}(), _t = /* @__PURE__ */ function() {
  function t(e) {
    this.onfile = e, this.k = [], this.o = {
      0: xt
    }, this.p = te;
  }
  return t.prototype.push = function(e, r) {
    var n = this;
    if (this.onfile || S(5), this.p || S(4), this.c > 0) {
      var a = Math.min(this.c, e.length), i = e.subarray(0, a);
      if (this.c -= a, this.d ? this.d.push(i, !this.c) : this.k[0].push(i), e = e.subarray(a), e.length)
        return this.push(e, r);
    } else {
      var s = 0, l = 0, u = void 0, f = void 0;
      this.p.length ? e.length ? (f = new I(this.p.length + e.length), f.set(this.p), f.set(e, this.p.length)) : f = this.p : f = e;
      for (var o = f.length, h = this.c, p = h && this.d, d = function() {
        var c, w = le(f, l);
        if (w == 67324752) {
          s = 1, u = l, v.d = null, v.c = 0;
          var E = oe(f, l + 6), F = oe(f, l + 8), R = E & 2048, T = E & 8, B = oe(f, l + 26), m = oe(f, l + 28);
          if (o > l + 30 + B + m) {
            var g = [];
            v.k.unshift(g), s = 2;
            var M = le(f, l + 18), y = le(f, l + 22), C = Gt(f.subarray(l + 30, l += 30 + B), !R);
            M == 4294967295 ? (c = T ? [-2] : Jt(f, l), M = c[0], y = c[1]) : T && (M = -1), l += m, v.c = M;
            var $, U = {
              name: C,
              compression: F,
              start: function() {
                if (U.ondata || S(5), !M)
                  U.ondata(null, te, !0);
                else {
                  var k = n.o[F];
                  k || U.ondata(S(14, "unknown compression type " + F, 1), null, !1), $ = M < 0 ? new k(C) : new k(C, M, y), $.ondata = function(O, ee, N) {
                    U.ondata(O, ee, N);
                  };
                  for (var L = 0, b = g; L < b.length; L++) {
                    var P = b[L];
                    $.push(P, !1);
                  }
                  n.k[0] == g && n.c ? n.d = $ : $.push(te, !0);
                }
              },
              terminate: function() {
                $ && $.terminate && $.terminate();
              }
            };
            M >= 0 && (U.size = M, U.originalSize = y), v.onfile(U);
          }
          return "break";
        } else if (h) {
          if (w == 134695760)
            return u = l += 12 + (h == -2 && 8), s = 3, v.c = 0, "break";
          if (w == 33639248)
            return u = l -= 4, s = 3, v.c = 0, "break";
        }
      }, v = this; l < o - 4; ++l) {
        var z = d();
        if (z === "break")
          break;
      }
      if (this.p = te, h < 0) {
        var x = s ? f.subarray(0, u - 12 - (h == -2 && 8) - (le(f, u - 16) == 134695760 && 4)) : f.subarray(0, l);
        p ? p.push(x, !!s) : this.k[+(s == 2)].push(x);
      }
      if (s & 2)
        return this.push(f.subarray(l), r);
      this.p = f.subarray(l);
    }
    r && (this.c && S(13), this.p = null);
  }, t.prototype.register = function(e) {
    this.o[e.compression] = e;
  }, t;
}();
function zt(t, e) {
  const r = new Uint8Array(e);
  let n = 0;
  for (const a of t)
    r.set(a, n), n += a.length;
  return r;
}
function Et(t) {
  const e = t.lastIndexOf(".");
  return e === -1 ? "" : t.slice(e + 1).toLowerCase();
}
const Mt = /* @__PURE__ */ new Set(["html", "htm", "xml", "md", "txt", "json", "csv"]);
async function Rt(t, { onFile: e } = {}) {
  const r = new _t((a) => e && e(a));
  r.register(Vt), r.register(xt);
  const n = t.stream().getReader();
  try {
    for (; ; ) {
      const { value: a, done: i } = await n.read();
      if (i) break;
      r.push(a, !1);
    }
    r.push(new Uint8Array(0), !0);
  } finally {
    n.releaseLock();
  }
}
async function er(t, { rewriteText: e, detectHubRegex: r, opts: n, sampleLimit: a = 10, maxTextBytes: i = 25 * 1024 * 1024 } = {}) {
  let s = 0, l = 0, u = 0, f = null;
  const o = [];
  let h = 0, p = !1, d, v;
  const z = new Promise((c, w) => {
    d = c, v = w;
  }), x = () => {
    p && h === 0 && d();
  };
  return await Rt(t, {
    onFile(c) {
      s++;
      const w = c.name || "";
      if (w.endsWith("/")) return;
      const E = Et(w);
      if (!Mt.has(E))
        return;
      h++;
      const F = [];
      let R = 0;
      c.ondata = (T, B, m) => {
        if (T) {
          try {
            c.terminate && c.terminate();
          } catch {
          }
          v(T);
          return;
        }
        if (B && B.length) {
          if (R += B.length, R > i) {
            v(new Error(`Text file too large to scan in-browser (${w}, ${Math.round(R / (1024 * 1024))}MB).`));
            try {
              c.terminate && c.terminate();
            } catch {
            }
            return;
          }
          F.push(B);
        }
        if (m)
          try {
            const g = zt(F, R);
            let M;
            try {
              M = new TextDecoder("utf-8", { fatal: !0 }).decode(g);
            } catch {
              return;
            }
            if (!f && r) {
              const y = M.match(r);
              y && (f = y[0]);
            }
            if (e && n) {
              const y = e(M, n);
              if (y.patches && y.patches.length) {
                l += y.patches.length, u += y.patches.length;
                for (const C of y.patches) {
                  if (o.length >= a) break;
                  o.push({ from: C.from, to: C.to });
                }
              }
            }
          } finally {
            h--, x();
          }
      }, c.start();
    }
  }).then(() => {
    p = !0, x();
  }).catch((c) => {
    v(c);
  }), await z, { filesScanned: s, linksFound: l, linksRewritten: u, samples: o, detectedHub: f };
}
async function tr(t, { rewriteText: e, opts: r, level: n = 6, maxTextBytes: a = 25 * 1024 * 1024 } = {}) {
  if (!e || !r) throw new Error("rewriteZipBlob requires rewriteText and opts");
  const i = [];
  let s, l;
  const u = new Promise((c, w) => {
    s = c, l = w;
  });
  let f = !1;
  const o = new Qt((c, w, E) => {
    if (c) {
      l(c);
      return;
    }
    w && i.push(w), E && !f && (f = !0, s());
  });
  let h = 0, p = !1, d, v;
  const z = new Promise((c, w) => {
    d = c, v = w;
  }), x = () => {
    if (p && h === 0)
      try {
        o.end(), d();
      } catch (c) {
        v(c);
      }
  };
  return await Rt(t, {
    onFile(c) {
      const w = c.name || "";
      if (h++, w.endsWith("/")) {
        const m = new We(w);
        o.add(m), m.push(new Uint8Array(0), !0), h--;
        return;
      }
      const E = Et(w);
      if (!Mt.has(E)) {
        const m = new tt(w, { level: n });
        o.add(m), c.ondata = (g, M, y) => {
          if (g) {
            v(g);
            try {
              c.terminate && c.terminate();
            } catch {
            }
            return;
          }
          try {
            m.push(M || new Uint8Array(0), !!y);
          } catch (C) {
            v(C);
          }
          y && (h--, x());
        }, c.start();
        return;
      }
      const R = [];
      let T = 0;
      const B = new tt(w, { level: n });
      o.add(B), c.ondata = (m, g, M) => {
        if (m) {
          v(m);
          try {
            c.terminate && c.terminate();
          } catch {
          }
          return;
        }
        if (g && g.length) {
          if (T += g.length, T > a) {
            v(new Error(`Text file too large to rewrite in-browser (${w}, ${Math.round(T / (1024 * 1024))}MB).`));
            try {
              c.terminate && c.terminate();
            } catch {
            }
            return;
          }
          R.push(g);
        }
        if (M)
          try {
            const y = zt(R, T);
            let C;
            try {
              C = new TextDecoder("utf-8", { fatal: !0 }).decode(y);
            } catch {
              B.push(y, !0);
              return;
            }
            const $ = e(C, r), U = $.changed ? new TextEncoder().encode($.out) : y;
            B.push(U, !0);
          } catch (y) {
            v(y);
          } finally {
            h--, x();
          }
      }, c.start();
    }
  }).then(() => {
    p = !0, x();
  }).catch((c) => {
    v(c);
  }), await z, await u, new Blob(i, { type: "application/zip" });
}
const rr = ["git-sync", "git-pull"];
function nr(t) {
  if (!t) return "";
  if (t = t.trim(), t = t.replace(/^http:\/\//i, "https://"), t.startsWith("https://") || (t = "https://" + t.replace(/^https?:\/\//i, "")), !/\/hub\/?$/.test(t)) {
    const e = t.match(/^(https:\/\/[^\/]+).*?(\/hub\/)/i);
    e ? t = e[1] + "/hub/" : t.endsWith("/") ? t = t + "hub/" : t = t + "/hub/";
  }
  return t.endsWith("/") || (t = t + "/"), t;
}
function ar(t) {
  try {
    const n = new URL(t).pathname.split("/").filter(Boolean);
    if (n.length >= 2) return n[1];
  } catch {
  }
  const e = t && t.split("/").filter(Boolean);
  return e && e[e.length - 1];
}
function De(t) {
  const e = ar(t);
  return e && e.replace(/\.git$/i, "");
}
function ir(t, e, r) {
  if (!t || !e || !r || e === r) return t;
  const n = e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), a = new RegExp("(^|/)(tree/)" + n + "(?=/|$)", "g");
  return t.replace(a, "$1$2" + r);
}
function St(t, e) {
  const r = [];
  let n = t, a = !1;
  if (!e || !e.newHub || !e.newRepo)
    return { out: n, changed: !1, patches: r };
  const i = nr(e.newHub), s = e.oldRepo ? De(e.oldRepo) : null, l = De(e.newRepo) || null, u = new RegExp(
    `https?:\\/\\/[\\w@:\\.\\/%_\\+\\?=&;~#,'!()\\[\\]]*?\\/hub\\/user-redirect\\/(?:git-sync|git-pull)[^\\s"'<>\\]]*`,
    "gi"
  );
  return n = n.replace(u, (f) => {
    let o = "";
    const h = f.match(/(\]\]>|\]\]|\]|\))$/);
    h && (o = h[0], f = f.slice(0, -o.length));
    const p = f.includes("&amp;"), d = f.replace(/&amp;/g, "&");
    let v;
    try {
      v = new URL(d);
    } catch {
      return f;
    }
    const x = v.pathname.split("/").slice(-1)[0];
    if (!rr.includes(x)) return f;
    const c = v.pathname.indexOf("/hub/");
    if (c === -1) return f;
    v.pathname.slice(c + 5) + v.search + v.hash;
    const w = new URLSearchParams(v.search), E = De(w.get("repo")) || s;
    w.has("repo") && w.set("repo", e.newRepo), w.has("urlpath") && w.set("urlpath", ir(w.get("urlpath"), E, l));
    let F = v.pathname.slice(c + 5);
    v.pathname.endsWith("/") && (F = F.slice(0, -1));
    let R = i + F;
    const T = w.toString();
    return T && (R += "?" + T), v.hash && (R += v.hash), p && (R = R.replace(/&/g, "&amp;")), R !== f ? (r.push({ from: f + o, to: R + o, loc: -1 }), a = !0, R + o) : f + o;
  }), { out: n, changed: a, patches: r };
}
const Q = document.getElementById("file"), $e = document.getElementById("scan"), ge = document.getElementById("rewrite"), qe = document.getElementById("reset"), Bt = document.getElementById("newHub"), It = document.getElementById("newRepo"), Te = document.getElementById("oldHub"), Tt = document.getElementById("oldRepo"), Ct = document.getElementById("filesScanned"), Ft = document.getElementById("linksFound"), bt = document.getElementById("linksRewritten"), Ce = document.getElementById("samples");
let At = null;
$e.addEventListener("click", async () => {
  const t = Q.files && Q.files[0];
  if (!t) return alert("Select a .imscc or .zip file first");
  const e = Bt.value.trim(), r = It.value.trim();
  if (!e || !r) return alert("New Hub and New Repo are required");
  Ue(!0, $e, "Scanning...");
  try {
    Ce.innerHTML = "";
    const n = {
      oldHub: Te.value || null,
      newHub: e,
      oldRepo: Tt.value || null,
      newRepo: r
    }, i = await er(t, { rewriteText: St, detectHubRegex: /https?:\/\/[\w@:\-\.\/%_\+\?=&;~#,'!\(\)\[\]]*?\/hub\//i, opts: n, sampleLimit: 10 });
    At = null, i.detectedHub && !Te.value && (Te.value = i.detectedHub);
    for (const s of i.samples) {
      if (Ce.children.length >= 10) break;
      const l = document.createElement("div");
      l.className = "sample-item", l.innerHTML = `
        <div><strong>Original:</strong> <pre>${at(s.from)}</pre></div>
        <div><strong>Rewritten:</strong> <pre>${at(s.to)}</pre></div>
      `, Ce.appendChild(l);
    }
    Ct.textContent = i.filesScanned.toString(), Ft.textContent = i.linksFound.toString(), bt.textContent = i.linksRewritten.toString(), ge.disabled = i.linksRewritten === 0, qe.style.display = "inline-block";
  } catch (n) {
    console.error(n);
    let a = n && n.message ? n.message : String(n);
    /array buffer allocation failed|out of memory/i.test(a) && (a += `

This is usually caused by loading the entire ZIP into RAM. This app now streams ZIPs, but extremely large exports can still exceed browser memory (especially during re-zipping). If possible, try a smaller export (remove large media) or run a Node-based rewrite on a machine with more memory.`), alert("Error scanning file: " + a);
  } finally {
    Ue(!1, $e, "Scan & Preview");
  }
});
ge.addEventListener("click", async () => {
  const t = Q.files && Q.files[0];
  if (!t) return alert("Select a .imscc or .zip file first");
  const e = Bt.value.trim(), r = It.value.trim();
  if (!e || !r) return alert("New Hub and New Repo are required");
  Ue(!0, ge, "Processing...");
  try {
    const n = {
      oldHub: Te.value || null,
      newHub: e,
      oldRepo: Tt.value || null,
      newRepo: r
    }, a = await tr(t, { rewriteText: St, opts: n, level: 6 }), i = URL.createObjectURL(a), s = document.createElement("a");
    s.href = i, s.download = Q.files && Q.files[0] && Q.files[0].name ? Q.files[0].name.replace(/\.zip$|\.imscc$/i, "") + "-rewritten.imscc" : "rewritten.imscc", document.body.appendChild(s), s.click(), s.remove(), URL.revokeObjectURL(i);
  } catch (n) {
    console.error(n);
    let a = n && n.message ? n.message : String(n);
    /array buffer allocation failed|out of memory/i.test(a) && (a += `

This is usually a browser memory limit. Consider exporting without large media, or run the rewrite on a machine with more memory.`), alert("Error rewriting file: " + a);
  } finally {
    Ue(!1, ge, "Rewrite & Download");
  }
});
qe.addEventListener("click", () => {
  Q.value = "", At = null, Ct.textContent = "0", Ft.textContent = "0", bt.textContent = "0", Ce.innerHTML = "", ge.disabled = !0, qe.style.display = "none";
});
const we = document.getElementById("loading-overlay"), rt = we ? we.querySelector("p") : null, sr = 600;
let nt = 0, pe = null;
function Ue(t, e, r) {
  if (pe && (clearTimeout(pe), pe = null), t)
    nt = Date.now(), we.style.display = "flex";
  else {
    const n = Date.now() - nt, a = Math.max(0, sr - n);
    a > 0 ? pe = setTimeout(() => {
      we.style.display = "none", pe = null;
    }, a) : we.style.display = "none";
  }
  e && r && (e.disabled = t, e.textContent = r), rt && (rt.textContent = r || (t ? "Loading..." : ""));
}
function at(t) {
  return t.replace(/[&<>]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[e]);
}
