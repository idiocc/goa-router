'use strict';
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const t = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
const u = (c, a, b, d = !1, e = !1) => {
  const h = b ? new RegExp(`^-(${b}|-${a})`) : new RegExp(`^--${a}`);
  a = c.findIndex(k => h.test(k));
  if (-1 == a) {
    return {argv:c};
  }
  if (d) {
    return {value:!0, argv:[...c.slice(0, a), ...c.slice(a + 1)]};
  }
  d = a + 1;
  b = c[d];
  if (!b || "string" == typeof b && b.startsWith("--")) {
    return {argv:c};
  }
  e && (b = parseInt(b, 10));
  return {value:b, argv:[...c.slice(0, a), ...c.slice(d + 1)]};
}, v = c => {
  const a = [];
  for (let b = 0; b < c.length; b++) {
    const d = c[b];
    if (d.startsWith("-")) {
      break;
    }
    a.push(d);
  }
  return a;
};
module.exports = {c:function(c, a) {
  return (a = t[a]) ? `\x1b[${a}m${c}\x1b[0m` : c;
}, reduceUsage:c => Object.keys(c).reduce((a, b) => {
  const d = c[b];
  if ("string" == typeof d) {
    return a[`-${d}`] = "", a;
  }
  b = d.command ? b : `--${b}`;
  d.short && (b = `${b}, -${d.short}`);
  let e = d.description;
  d.default && (e = `${e}\nDefault: ${d.default}.`);
  a[b] = e;
  return a;
}, {}), argufy:function(c = {}, a = process.argv) {
  [, , ...a] = a;
  const b = v(a);
  a = a.slice(b.length);
  let d = !b.length;
  return Object.keys(c).reduce(({a:e, ...h}, k) => {
    if (0 == e.length && d) {
      return {a:e, ...h};
    }
    const m = c[k];
    let n;
    if ("string" == typeof m) {
      ({value:n, argv:e} = u(e, k, m));
    } else {
      try {
        const {short:f, boolean:g, number:l, command:p, multiple:q} = m;
        p && q && b.length ? (n = b, d = !0) : p && b.length ? (n = b[0], d = !0) : {value:n, argv:e} = u(e, k, f, g, l);
      } catch (f) {
        return {a:e, ...h};
      }
    }
    return void 0 === n ? {a:e, ...h} : {a:e, ...h, [k]:n};
  }, {a});
}, usually:function(c = {usage:{}}) {
  const {usage:a = {}, description:b, line:d, example:e} = c;
  c = Object.keys(a);
  const h = Object.values(a), [k] = c.reduce(([f = 0, g = 0], l) => {
    const p = a[l].split("\n").reduce((q, r) => r.length > q ? r.length : q, 0);
    p > g && (g = p);
    l.length > f && (f = l.length);
    return [f, g];
  }, []), m = (f, g) => {
    g = " ".repeat(g - f.length);
    return `${f}${g}`;
  };
  c = c.reduce((f, g, l) => {
    l = h[l].split("\n");
    g = m(g, k);
    const [p, ...q] = l;
    g = `${g}\t${p}`;
    const r = m("", k);
    l = q.map(w => `${r}\t${w}`);
    return [...f, g, ...l];
  }, []).map(f => `\t${f}`);
  const n = [b, `  ${d || ""}`].filter(f => f ? f.trim() : f).join("\n\n");
  c = `${n ? `${n}\n` : ""}
${c.join("\n")}
`;
  return e ? `${c}
  Example:

    ${e}
` : c;
}, indicatrix:async function(c, a, b = {}) {
  const {interval:d = 250, writable:e = process.stdout} = b;
  a = "function" == typeof a ? a() : a;
  const h = e.write.bind(e);
  ({INDICATRIX_PLACEHOLDER:b} = process.env);
  if (b && "0" != b) {
    return h(`${c}<INDICATRIX_PLACEHOLDER>`), await a;
  }
  let k = 1, m = `${c}${".".repeat(k)}`;
  h(m);
  b = setInterval(() => {
    k = (k + 1) % 4;
    m = `${c}${".".repeat(k)}`;
    h(`\r${" ".repeat(c.length + 3)}\r`);
    h(m);
  }, d);
  try {
    return await a;
  } finally {
    clearInterval(b), h(`\r${" ".repeat(c.length + 3)}\r`);
  }
}};


//# sourceMappingURL=index.js.map