/* 桌面动漫宠物 · content script（自动生成，请勿手改）
 * 由 build/build-extension.ts 打包：esbuild-wasm 0.28.2 + @vue/compiler-sfc 3.5.43
 * 源码：src/、components/、extension-src/
 */
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // <define:__LF_RESOURCES__>
  var define_LF_RESOURCES_default = { "pet-idle": "assets/pet/idle.png", "pet-idle2": "assets/pet/idle2.png", "pet-idle3": "assets/pet/idle3.png", "pet-happy": "assets/pet/happy.png", "pet-sleepy": "assets/pet/sleepy.png" };

  // ws:/extension-src/lf-shim.ts
  var lf_shim_exports = {};
  __export(lf_shim_exports, {
    LFDOM: () => LFDOM2,
    LFModel: () => LFModel2,
    LFRuntime: () => LFRuntime2,
    LFStore: () => LFStore2
  });
  var cx = globalThis.chrome;
  var hasChrome = !!(cx && cx.runtime && cx.runtime.id);
  var DEBUG = false;
  function log(...args) {
    if (DEBUG) console.log("[pet]", ...args);
  }
  function assetUrl(file) {
    if (!file) return "";
    try {
      return hasChrome ? cx.runtime.getURL(file) : "./" + file;
    } catch {
      return "./" + file;
    }
  }
  var generations = /* @__PURE__ */ new Map();
  var active = null;
  function untrack(id2) {
    for (const g2 of generations.values()) {
      const i10 = g2.timers.indexOf(id2);
      if (i10 >= 0) {
        g2.timers.splice(i10, 1);
        return;
      }
    }
  }
  function clearGeneration(g2) {
    for (const id2 of g2.timers) {
      clearTimeout(id2);
      clearInterval(id2);
    }
    g2.timers.length = 0;
    for (const dispose of g2.disposers) {
      try {
        dispose();
      } catch (e10) {
        log("dispose error", String(e10));
      }
    }
    g2.disposers.length = 0;
  }
  function mountHot(key, cb) {
    const prev = generations.get(key);
    if (prev) clearGeneration(prev);
    const g2 = { disposers: [], timers: [] };
    generations.set(key, g2);
    active = g2;
    return cb({
      onDispose(fn) {
        g2.disposers.push(fn);
      }
    });
  }
  function timeout(fn, ms) {
    const id2 = window.setTimeout(() => {
      untrack(id2);
      try {
        fn();
      } catch (e10) {
        log("timeout error", String(e10));
      }
    }, ms);
    if (active) active.timers.push(id2);
    return id2;
  }
  function interval(fn, ms) {
    const id2 = window.setInterval(() => {
      try {
        fn();
      } catch (e10) {
        log("interval error", String(e10));
      }
    }, ms);
    if (active) active.timers.push(id2);
    return id2;
  }
  var styles = /* @__PURE__ */ new Set();
  function appendStyle(css, key) {
    const id2 = "lf-style-" + key;
    let el2 = document.getElementById(id2);
    if (!el2) {
      el2 = document.createElement("style");
      el2.id = id2;
      (document.head || document.documentElement).appendChild(el2);
    }
    el2.textContent = css;
    styles.add(key);
    return el2;
  }
  var resourceCache = /* @__PURE__ */ new Map();
  function getResource(name) {
    const hit = resourceCache.get(name);
    if (hit !== void 0) return hit;
    const file = define_LF_RESOURCES_default[name];
    const url = assetUrl(typeof file === "string" ? file : "");
    resourceCache.set(name, url);
    return url;
  }
  var LFRuntime2 = {
    /** 扩展 content script 永远跑在页面里 */
    executionEnvironment: "page",
    /** 正式扩展没有编辑器终端，dbg() 静默 */
    liveDebug: false,
    print: (...args) => log(...args),
    mountHot,
    timeout,
    interval,
    appendStyle,
    getResource
  };
  var LFDOM2 = {
    /** 一个 0×0 的 fixed 宿主，内部再挂 Shadow DOM；与 PluginX 版行为一致 */
    createFloatingRoot(opts = {}) {
      const el2 = document.createElement("div");
      if (opts.id) el2.id = opts.id;
      if (opts.className) el2.className = opts.className;
      el2.style.zIndex = String(opts.zIndex ?? 2147483e3);
      const parent = document.documentElement || document.body;
      parent.appendChild(el2);
      log("floating root", el2.id);
      return el2;
    }
  };
  var LS_PREFIX = "lfstore:";
  async function storeGet(key) {
    if (cx && cx.storage && cx.storage.local) {
      const res = await cx.storage.local.get(key);
      return res ? res[key] : void 0;
    }
    try {
      const raw = localStorage.getItem(LS_PREFIX + key);
      return raw === null ? void 0 : JSON.parse(raw);
    } catch {
      return void 0;
    }
  }
  async function storeSet(key, value) {
    if (cx && cx.storage && cx.storage.local) {
      await cx.storage.local.set({ [key]: value });
      return;
    }
    try {
      localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
    } catch (e10) {
      log("localStorage set failed", String(e10));
    }
  }
  async function storeRemove(key) {
    if (cx && cx.storage && cx.storage.local) {
      await cx.storage.local.remove(key);
      return;
    }
    try {
      localStorage.removeItem(LS_PREFIX + key);
    } catch {
    }
  }
  function storeWatch(key, cb) {
    if (cx && cx.storage && cx.storage.onChanged && typeof cx.storage.onChanged.addListener === "function") {
      const listener = (changes, area) => {
        if (area !== "local" || !changes || !Object.prototype.hasOwnProperty.call(changes, key)) return;
        const next = changes[key]?.newValue;
        cb({ value: next, found: next !== void 0, reason: "storage" });
      };
      cx.storage.onChanged.addListener(listener);
      return () => {
        try {
          cx.storage.onChanged.removeListener(listener);
        } catch {
        }
      };
    }
    const onStorage = (e10) => {
      if (e10.key !== LS_PREFIX + key) return;
      let value;
      try {
        value = e10.newValue ? JSON.parse(e10.newValue) : void 0;
      } catch {
        value = void 0;
      }
      cb({ value, found: value !== void 0, reason: "storage-event" });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }
  var LFStore2 = { get: storeGet, set: storeSet, remove: storeRemove, watch: storeWatch };
  async function rpc(type, extra = {}) {
    if (!(cx && cx.runtime && typeof cx.runtime.sendMessage === "function")) {
      throw new Error("扩展后台不可用");
    }
    const resp = await cx.runtime.sendMessage(Object.assign({ type }, extra));
    if (!resp) throw new Error("后台没有响应");
    if (resp.ok === false) {
      const err = new Error(resp.message || resp.code || "AI 请求失败");
      err.code = resp.code;
      throw err;
    }
    return resp.data;
  }
  var LFModel2 = {
    chat: (body) => rpc("lfmodel.chat", { body }),
    listModels: (opts) => rpc("lfmodel.listModels", { opts })
  };

  // ws:/vendor/vue.runtime.esm-browser.prod.js
  var e;
  var t;
  var n;
  var l;
  var r;
  var i;
  var s;
  var o;
  var a;
  var u;
  var c;
  var f;
  var p;
  var d;
  function h(e10) {
    let t10 = /* @__PURE__ */ Object.create(null);
    for (let n2 of e10.split(",")) t10[n2] = 1;
    return (e11) => e11 in t10;
  }
  var g = {};
  var v = [];
  var _ = () => {
  };
  var m = () => false;
  var y = (e10) => 111 === e10.charCodeAt(0) && 110 === e10.charCodeAt(1) && (e10.charCodeAt(2) > 122 || 97 > e10.charCodeAt(2));
  var b = (e10) => e10.startsWith("onUpdate:");
  var S = Object.assign;
  var C = (e10, t10) => {
    let n2 = e10.indexOf(t10);
    n2 > -1 && e10.splice(n2, 1);
  };
  var x = Object.prototype.hasOwnProperty;
  var w = (e10, t10) => x.call(e10, t10);
  var k = Array.isArray;
  var E = (e10) => "function" == typeof e10;
  var T = (e10) => "string" == typeof e10;
  var A = (e10) => "symbol" == typeof e10;
  var R = (e10) => null !== e10 && "object" == typeof e10;
  var O = (e10) => (R(e10) || E(e10)) && E(e10.then) && E(e10.catch);
  var N = Object.prototype.toString;
  var P = (e10) => T(e10) && "NaN" !== e10 && "-" !== e10[0] && "" + parseInt(e10, 10) === e10;
  var M = h(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
  var I = (e10) => {
    let t10 = /* @__PURE__ */ Object.create(null);
    return (n2) => t10[n2] || (t10[n2] = e10(n2));
  };
  var F = /-\w/g;
  var L = I((e10) => e10.replace(F, (e11) => e11.slice(1).toUpperCase()));
  var j = /\B([A-Z])/g;
  var V = I((e10) => e10.replace(j, "-$1").toLowerCase());
  var D = I((e10) => e10.charAt(0).toUpperCase() + e10.slice(1));
  var U = I((e10) => e10 ? `on${D(e10)}` : "");
  var B = (e10, t10) => !Object.is(e10, t10);
  var $ = (e10, ...t10) => {
    for (let n2 = 0; n2 < e10.length; n2++) e10[n2](...t10);
  };
  var H = (e10, t10, n2, l2 = false) => {
    Object.defineProperty(e10, t10, { configurable: true, enumerable: false, writable: l2, value: n2 });
  };
  var W = (e10) => {
    let t10 = parseFloat(e10);
    return isNaN(t10) ? e10 : t10;
  };
  var K = (e10) => {
    let t10 = T(e10) ? Number(e10) : 0 / 0;
    return isNaN(t10) ? e10 : t10;
  };
  var z = () => n || (n = "u" > typeof globalThis ? globalThis : "u" > typeof self ? self : "u" > typeof window ? window : "u" > typeof global ? global : {});
  var q = h("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol");
  function G(e10) {
    if (k(e10)) {
      let t10 = {};
      for (let n2 = 0; n2 < e10.length; n2++) {
        let l2 = e10[n2], r10 = T(l2) ? (function(e11) {
          let t11 = {};
          return e11.replace(Z, (e12) => e12.startsWith("/*") ? "" : e12).split(X).forEach((e12) => {
            if (e12) {
              let n3 = e12.split(J);
              n3.length > 1 && (t11[n3[0].trim()] = n3[1].trim());
            }
          }), t11;
        })(l2) : G(l2);
        if (r10) for (let e11 in r10) t10[e11] = r10[e11];
      }
      return t10;
    }
    if (T(e10) || R(e10)) return e10;
  }
  var X = /;(?![^(]*\))/g;
  var J = /:([^]+)/;
  var Z = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
  function Y(e10) {
    let t10 = "";
    if (T(e10)) t10 = e10;
    else if (k(e10)) for (let n2 = 0; n2 < e10.length; n2++) {
      let l2 = Y(e10[n2]);
      l2 && (t10 += l2 + " ");
    }
    else if (R(e10)) for (let n2 in e10) e10[n2] && (t10 += n2 + " ");
    return t10.trim();
  }
  var ee = h("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");
  function et(e10, t10, n2) {
    if (e10.length !== t10.length) return false;
    let l2 = true;
    for (let r10 = 0; l2 && r10 < e10.length; r10++) l2 = ei(e10[r10], t10[r10], n2);
    return l2;
  }
  function en(e10, t10, n2) {
    if (e10.size !== t10.size) return false;
    let l2 = Array.from(t10), r10 = new Uint8Array(l2.length);
    for (let t11 of e10) {
      let e11 = -1;
      for (let i10 = 0; i10 < l2.length; i10++) if (!r10[i10] && ei(t11, l2[i10], n2)) {
        e11 = i10;
        break;
      }
      if (e11 < 0) return false;
      r10[e11] = 1;
    }
    return true;
  }
  function el(e10, t10, n2) {
    let l2, r10, i10, s4, o2 = "[object Map]" === (l2 = e10, N.call(l2)), a2 = "[object Map]" === (r10 = t10, N.call(r10));
    if (o2 || a2) return !!o2 && !!a2 && en(e10, t10, n2);
    o2 = "[object Set]" === (i10 = e10, N.call(i10));
    if (a2 = "[object Set]" === (s4 = t10, N.call(s4)), o2 || a2) return !!o2 && !!a2 && en(e10, t10, n2);
    if (Object.keys(e10).length !== Object.keys(t10).length) return false;
    for (let l4 in e10) {
      let r11 = e10.hasOwnProperty(l4), i11 = t10.hasOwnProperty(l4);
      if (r11 && !i11 || !r11 && i11 || !ei(e10[l4], t10[l4], n2)) return false;
    }
    return String(e10) === String(t10);
  }
  function er(e10, t10, n2, l2) {
    n2 || (n2 = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
    let [r10, i10] = n2;
    if (r10.has(e10) || i10.has(t10)) return r10.get(e10) === t10 && i10.get(t10) === e10;
    r10.set(e10, t10), i10.set(t10, e10);
    let s4 = l2(e10, t10, n2);
    return r10.delete(e10), i10.delete(t10), s4;
  }
  function ei(e10, t10, n2) {
    let l2, r10;
    if (e10 === t10) return true;
    let i10 = "[object Date]" === (l2 = e10, N.call(l2)), s4 = "[object Date]" === (r10 = t10, N.call(r10));
    return i10 || s4 ? !!i10 && !!s4 && e10.getTime() === t10.getTime() : (i10 = A(e10), s4 = A(t10), i10 || s4) ? e10 === t10 : (i10 = k(e10), s4 = k(t10), i10 || s4) ? !!i10 && !!s4 && er(e10, t10, n2, et) : (i10 = R(e10), s4 = R(t10), i10 || s4) ? !!i10 && !!s4 && er(e10, t10, n2, el) : String(e10) === String(t10);
  }
  function es(e10, t10) {
    return e10.findIndex((e11) => ei(e11, t10));
  }
  var eo = (e10) => !!(e10 && true === e10.__v_isRef);
  var ea = (e10) => T(e10) ? e10 : null == e10 ? "" : k(e10) || R(e10) && (e10.toString === N || !E(e10.toString)) ? eo(e10) ? ea(e10.value) : JSON.stringify(e10, eu, 2) : String(e10);
  var eu = (e10, t10) => {
    let n2;
    if (eo(t10)) return eu(e10, t10.value);
    if ("[object Map]" === (n2 = t10, N.call(n2))) return { [`Map(${t10.size})`]: [...t10.entries()].reduce((e11, [t11, n3], l2) => (e11[ec(t11, l2) + " =>"] = n3, e11), {}) };
    {
      let e11;
      if ("[object Set]" === (e11 = t10, N.call(e11))) return { [`Set(${t10.size})`]: [...t10.values()].map((e12) => ec(e12)) };
      else {
        if (A(t10)) return ec(t10);
        let e12;
        if (R(t10) && !k(t10) && "[object Object]" !== (e12 = t10, N.call(e12))) return String(t10);
      }
    }
    return t10;
  };
  var ec = (e10, t10 = "") => {
    var n2;
    return A(e10) ? `Symbol(${null != (n2 = e10.description) ? n2 : t10})` : e10;
  };
  var ef = class {
    constructor(e10 = false) {
      this.detached = e10, this._active = true, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = false, this._warnOnRun = true, this.__v_skip = true, !e10 && l && (l.active ? (this.parent = l, this.index = (l.scopes || (l.scopes = [])).push(this) - 1) : (this._active = false, this._warnOnRun = false));
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        let e10, t10;
        if (this._isPaused = true, this.scopes) {
          let n2 = this.scopes.slice();
          for (e10 = 0, t10 = n2.length; e10 < t10; e10++) n2[e10].pause();
        }
        for (e10 = 0, t10 = this.effects.length; e10 < t10; e10++) this.effects[e10].pause();
      }
    }
    resume() {
      if (this._active && this._isPaused) {
        let e10, t10;
        if (this._isPaused = false, this.scopes) {
          let n3 = this.scopes.slice();
          for (e10 = 0, t10 = n3.length; e10 < t10; e10++) n3[e10].resume();
        }
        let n2 = this.effects.slice();
        for (e10 = 0, t10 = n2.length; e10 < t10; e10++) n2[e10].resume();
      }
    }
    run(e10) {
      if (this._active) {
        let t10 = l;
        try {
          return l = this, e10();
        } finally {
          l = t10;
        }
      }
    }
    on() {
      1 == ++this._on && (this.prevScope = l, l = this);
    }
    off() {
      if (this._on > 0 && 0 == --this._on) {
        if (l === this) l = this.prevScope;
        else {
          let e10 = l;
          for (; e10; ) {
            if (e10.prevScope === this) {
              e10.prevScope = this.prevScope;
              break;
            }
            e10 = e10.prevScope;
          }
        }
        this.prevScope = void 0;
      }
    }
    stop(e10) {
      if (this._active) {
        let t10, n2;
        for (this._active = false, t10 = 0, n2 = this.effects.length; t10 < n2; t10++) this.effects[t10].stop();
        for (this.effects.length = 0, t10 = 0, n2 = this.cleanups.length; t10 < n2; t10++) this.cleanups[t10]();
        if (this.cleanups.length = 0, this.scopes) {
          let e11 = this.scopes.slice();
          for (t10 = 0, n2 = e11.length; t10 < n2; t10++) e11[t10].stop(true);
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !e10) {
          let e11 = this.parent.scopes.pop();
          e11 && e11 !== this && (this.parent.scopes[this.index] = e11, e11.index = this.index);
        }
        this.parent = void 0;
      }
    }
  };
  function ed() {
    return l;
  }
  var eg = /* @__PURE__ */ new WeakSet();
  var ev = class {
    constructor(e10) {
      this.fn = e10, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, l && (l.active ? l.effects.push(this) : this.flags &= -2);
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      64 & this.flags && (this.flags &= -65, eg.has(this) && (eg.delete(this), this.trigger()));
    }
    notify() {
      (!(2 & this.flags) || 32 & this.flags) && (8 & this.flags || em(this));
    }
    run() {
      if (!(1 & this.flags)) return this.fn();
      this.flags |= 2, eN(this), eb(this);
      let e10 = r, t10 = eT;
      r = this, eT = true;
      try {
        return this.fn();
      } finally {
        eS(this), r = e10, eT = t10, this.flags &= -3;
      }
    }
    stop() {
      if (1 & this.flags) {
        for (let e10 = this.deps; e10; e10 = e10.nextDep) ew(e10);
        this.deps = this.depsTail = void 0, eN(this), this.onStop && this.onStop(), this.flags &= -2;
      }
    }
    trigger() {
      64 & this.flags ? eg.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
    }
    runIfDirty() {
      eC(this) && this.run();
    }
    get dirty() {
      return eC(this);
    }
  };
  var e_ = 0;
  function em(e10, t10 = false) {
    if (e10.flags |= 8, t10) {
      e10.next = s, s = e10;
      return;
    }
    e10.next = i, i = e10;
  }
  function ey() {
    let e10;
    if (!(--e_ > 0)) {
      if (s) {
        let e11 = s;
        for (s = void 0; e11; ) {
          let t10 = e11.next;
          e11.next = void 0, e11.flags &= -9, e11 = t10;
        }
      }
      for (; i; ) {
        let t10 = i;
        for (i = void 0; t10; ) {
          let n2 = t10.next;
          if (t10.next = void 0, t10.flags &= -9, 1 & t10.flags) try {
            t10.trigger();
          } catch (t11) {
            e10 || (e10 = t11);
          }
          t10 = n2;
        }
      }
      if (e10) throw e10;
    }
  }
  function eb(e10) {
    for (let t10 = e10.deps; t10; t10 = t10.nextDep) t10.version = -1, t10.prevActiveLink = t10.dep.activeLink, t10.dep.activeLink = t10;
  }
  function eS(e10) {
    let t10, n2 = e10.depsTail, l2 = n2;
    for (; l2; ) {
      let e11 = l2.prevDep;
      -1 === l2.version ? (l2 === n2 && (n2 = e11), ew(l2), (function(e12) {
        let { prevDep: t11, nextDep: n3 } = e12;
        t11 && (t11.nextDep = n3, e12.prevDep = void 0), n3 && (n3.prevDep = t11, e12.nextDep = void 0);
      })(l2)) : t10 = l2, l2.dep.activeLink = l2.prevActiveLink, l2.prevActiveLink = void 0, l2 = e11;
    }
    e10.deps = t10, e10.depsTail = n2;
  }
  function eC(e10) {
    for (let t10 = e10.deps; t10; t10 = t10.nextDep) if (t10.dep.version !== t10.version || t10.dep.computed && (ex(t10.dep.computed) || t10.dep.version !== t10.version)) return true;
    return !!e10._dirty;
  }
  function ex(e10) {
    if (4 & e10.flags && !(16 & e10.flags) || (e10.flags &= -17, e10.globalVersion === eP) || (e10.globalVersion = eP, !e10.isSSR && 128 & e10.flags && (!e10.deps && !e10._dirty || !eC(e10)))) return;
    e10.flags |= 2;
    let t10 = e10.dep, n2 = r, l2 = eT;
    r = e10, eT = true;
    try {
      eb(e10);
      let n3 = e10.fn(e10._value);
      (0 === t10.version || B(n3, e10._value)) && (e10.flags |= 128, e10._value = n3, t10.version++);
    } catch (e11) {
      throw t10.version++, e11;
    } finally {
      r = n2, eT = l2, eS(e10), e10.flags &= -3;
    }
  }
  function ew(e10, t10 = false) {
    let { dep: n2, prevSub: l2, nextSub: r10 } = e10;
    if (l2 && (l2.nextSub = r10, e10.prevSub = void 0), r10 && (r10.prevSub = l2, e10.nextSub = void 0), n2.subs === e10 && (n2.subs = l2, !l2 && n2.computed)) {
      n2.computed.flags &= -5;
      for (let e11 = n2.computed.deps; e11; e11 = e11.nextDep) ew(e11, true);
    }
    t10 || --n2.sc || !n2.map || n2.map.delete(n2.key);
  }
  var eT = true;
  var eA = [];
  function eR() {
    eA.push(eT), eT = false;
  }
  function eO() {
    let e10 = eA.pop();
    eT = void 0 === e10 || e10;
  }
  function eN(e10) {
    let { cleanup: t10 } = e10;
    if (e10.cleanup = void 0, t10) {
      let e11 = r;
      r = void 0;
      try {
        t10();
      } finally {
        r = e11;
      }
    }
  }
  var eP = 0;
  var eM = class {
    constructor(e10, t10) {
      this.sub = e10, this.dep = t10, this.version = t10.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  };
  var eI = class {
    constructor(e10) {
      this.computed = e10, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = true;
    }
    track(e10) {
      if (!r || !eT || r === this.computed) return;
      let t10 = this.activeLink;
      if (void 0 === t10 || t10.sub !== r) t10 = this.activeLink = new eM(r, this), r.deps ? (t10.prevDep = r.depsTail, r.depsTail.nextDep = t10, r.depsTail = t10) : r.deps = r.depsTail = t10, (function e11(t11) {
        if (t11.dep.sc++, 4 & t11.sub.flags) {
          let n2 = t11.dep.computed;
          if (n2 && !t11.dep.subs) {
            n2.flags |= 20;
            for (let t12 = n2.deps; t12; t12 = t12.nextDep) e11(t12);
          }
          let l2 = t11.dep.subs;
          l2 !== t11 && (t11.prevSub = l2, l2 && (l2.nextSub = t11)), t11.dep.subs = t11;
        }
      })(t10);
      else if (-1 === t10.version && (t10.version = this.version, t10.nextDep)) {
        let e11 = t10.nextDep;
        e11.prevDep = t10.prevDep, t10.prevDep && (t10.prevDep.nextDep = e11), t10.prevDep = r.depsTail, t10.nextDep = void 0, r.depsTail.nextDep = t10, r.depsTail = t10, r.deps === t10 && (r.deps = e11);
      }
      return t10;
    }
    trigger(e10) {
      this.version++, eP++, this.notify(e10);
    }
    notify(e10) {
      e_++;
      try {
        for (let e11 = this.subs; e11; e11 = e11.prevSub) e11.sub.notify() && e11.sub.dep.notify();
      } finally {
        ey();
      }
    }
  };
  var eF = /* @__PURE__ */ new WeakMap();
  var eL = /* @__PURE__ */ Symbol("");
  var ej = /* @__PURE__ */ Symbol("");
  var eV = /* @__PURE__ */ Symbol("");
  function eD(e10, t10, n2) {
    if (eT && r) {
      let t11 = eF.get(e10);
      t11 || eF.set(e10, t11 = /* @__PURE__ */ new Map());
      let l2 = t11.get(n2);
      l2 || (t11.set(n2, l2 = new eI()), l2.map = t11, l2.key = n2), l2.track();
    }
  }
  function eU(e10, t10, n2, l2, r10, i10) {
    let s4 = eF.get(e10);
    if (!s4) return void eP++;
    let o2 = (e11) => {
      e11 && e11.trigger();
    };
    if (e_++, "clear" === t10) s4.forEach(o2);
    else {
      let r11 = k(e10), i11 = r11 && P(n2);
      if (r11 && "length" === n2) {
        let e11 = Number(l2);
        s4.forEach((t11, n3) => {
          ("length" === n3 || n3 === eV || !A(n3) && n3 >= e11) && o2(t11);
        });
      } else switch ((void 0 !== n2 || s4.has(void 0)) && o2(s4.get(n2)), i11 && o2(s4.get(eV)), t10) {
        case "add":
          if (r11) i11 && o2(s4.get("length"));
          else {
            let t11;
            o2(s4.get(eL));
            "[object Map]" === (t11 = e10, N.call(t11)) && o2(s4.get(ej));
          }
          break;
        case "delete":
          if (!r11) {
            let t11;
            o2(s4.get(eL));
            "[object Map]" === (t11 = e10, N.call(t11)) && o2(s4.get(ej));
          }
          break;
        case "set":
          let a2;
          "[object Map]" === (a2 = e10, N.call(a2)) && o2(s4.get(eL));
      }
    }
    ey();
  }
  function eB(e10) {
    let t10 = t_(e10);
    return t10 === e10 || (eD(t10, "iterate", eV), tg(e10)) ? t10 : th(e10) ? td(e10) ? t10.map((e11) => tb(ty(e11))) : t10.map(tb) : t10.map(ty);
  }
  function e$(e10) {
    return eD(e10 = t_(e10), "iterate", eV), e10;
  }
  function eH(e10, t10) {
    return th(e10) ? td(e10) ? tb(ty(t10)) : tb(t10) : ty(t10);
  }
  var eW = { __proto__: null, [Symbol.iterator]() {
    return eK(this, Symbol.iterator, (e10) => eH(this, e10));
  }, concat(...e10) {
    return eB(this).concat(...e10.map((e11) => k(e11) ? eB(e11) : e11));
  }, entries() {
    return eK(this, "entries", (e10) => (e10[1] = eH(this, e10[1]), e10));
  }, every(e10, t10) {
    return eq(this, "every", e10, t10, void 0, arguments);
  }, filter(e10, t10) {
    return eq(this, "filter", e10, t10, (e11) => e11.map((e12) => eH(this, e12)), arguments);
  }, find(e10, t10) {
    return eq(this, "find", e10, t10, (e11) => eH(this, e11), arguments);
  }, findIndex(e10, t10) {
    return eq(this, "findIndex", e10, t10, void 0, arguments);
  }, findLast(e10, t10) {
    return eq(this, "findLast", e10, t10, (e11) => eH(this, e11), arguments);
  }, findLastIndex(e10, t10) {
    return eq(this, "findLastIndex", e10, t10, void 0, arguments);
  }, forEach(e10, t10) {
    return eq(this, "forEach", e10, t10, void 0, arguments);
  }, includes(...e10) {
    return eX(this, "includes", e10);
  }, indexOf(...e10) {
    return eX(this, "indexOf", e10);
  }, join(e10) {
    return eB(this).join(e10);
  }, lastIndexOf(...e10) {
    return eX(this, "lastIndexOf", e10);
  }, map(e10, t10) {
    return eq(this, "map", e10, t10, void 0, arguments);
  }, pop() {
    return eJ(this, "pop");
  }, push(...e10) {
    return eJ(this, "push", e10);
  }, reduce(e10, ...t10) {
    return eG(this, "reduce", e10, t10);
  }, reduceRight(e10, ...t10) {
    return eG(this, "reduceRight", e10, t10);
  }, shift() {
    return eJ(this, "shift");
  }, some(e10, t10) {
    return eq(this, "some", e10, t10, void 0, arguments);
  }, splice(...e10) {
    return eJ(this, "splice", e10);
  }, toReversed() {
    return eB(this).toReversed();
  }, toSorted(e10) {
    return eB(this).toSorted(e10);
  }, toSpliced(...e10) {
    return eB(this).toSpliced(...e10);
  }, unshift(...e10) {
    return eJ(this, "unshift", e10);
  }, values() {
    return eK(this, "values", (e10) => eH(this, e10));
  } };
  function eK(e10, t10, n2) {
    let l2 = e$(e10), r10 = l2[t10]();
    return l2 === e10 || tg(e10) || (r10._next = r10.next, r10.next = () => {
      let e11 = r10._next();
      return e11.done || (e11.value = n2(e11.value)), e11;
    }), r10;
  }
  var ez = Array.prototype;
  function eq(e10, t10, n2, l2, r10, i10) {
    let s4 = e$(e10), o2 = s4 !== e10 && !tg(e10), a2 = s4[t10];
    if (a2 !== ez[t10]) {
      let t11 = a2.apply(e10, i10);
      return o2 ? ty(t11) : t11;
    }
    let u2 = n2;
    s4 !== e10 && (o2 ? u2 = function(t11, l4) {
      return n2.call(this, eH(e10, t11), l4, e10);
    } : n2.length > 2 && (u2 = function(t11, l4) {
      return n2.call(this, t11, l4, e10);
    }));
    let c2 = a2.call(s4, u2, l2);
    return o2 && r10 ? r10(c2) : c2;
  }
  function eG(e10, t10, n2, l2) {
    let r10 = e$(e10), i10 = r10 !== e10 && !tg(e10), s4 = n2, o2 = false;
    r10 !== e10 && (i10 ? (o2 = 0 === l2.length, s4 = function(t11, l4, r11) {
      return o2 && (o2 = false, t11 = eH(e10, t11)), n2.call(this, t11, eH(e10, l4), r11, e10);
    }) : n2.length > 3 && (s4 = function(t11, l4, r11) {
      return n2.call(this, t11, l4, r11, e10);
    }));
    let a2 = r10[t10](s4, ...l2);
    return o2 ? eH(e10, a2) : a2;
  }
  function eX(e10, t10, n2) {
    let l2 = t_(e10);
    eD(l2, "iterate", eV);
    let r10 = l2[t10](...n2);
    return (-1 === r10 || false === r10) && tv(n2[0]) ? (n2[0] = t_(n2[0]), l2[t10](...n2)) : r10;
  }
  function eJ(e10, t10, n2 = []) {
    eR(), e_++;
    let l2 = t_(e10)[t10].apply(e10, n2);
    return ey(), eO(), l2;
  }
  var eZ = h("__proto__,__v_isRef,__isVue");
  var eY = new Set(Object.getOwnPropertyNames(Symbol).filter((e10) => "arguments" !== e10 && "caller" !== e10).map((e10) => Symbol[e10]).filter(A));
  function eQ(e10) {
    A(e10) || (e10 = String(e10));
    let t10 = t_(this);
    return eD(t10, "has", e10), t10.hasOwnProperty(e10);
  }
  var e0 = class {
    constructor(e10 = false, t10 = false) {
      this._isReadonly = e10, this._isShallow = t10;
    }
    get(e10, t10, n2) {
      if ("__v_skip" === t10) return e10.__v_skip;
      let l2 = this._isReadonly, r10 = this._isShallow;
      if ("__v_isReactive" === t10) return !l2;
      if ("__v_isReadonly" === t10) return l2;
      if ("__v_isShallow" === t10) return r10;
      if ("__v_raw" === t10) return n2 === (l2 ? r10 ? to : ts : r10 ? ti : tr).get(e10) || Object.getPrototypeOf(e10) === Object.getPrototypeOf(n2) ? e10 : void 0;
      let i10 = k(e10);
      if (!l2) {
        let e11;
        if (i10 && (e11 = eW[t10])) return e11;
        if ("hasOwnProperty" === t10) return eQ;
      }
      let s4 = Reflect.get(e10, t10, tS(e10) ? e10 : n2);
      if ((A(t10) ? eY.has(t10) : eZ(t10)) || (l2 || eD(e10, "get", t10), r10)) return s4;
      if (tS(s4)) {
        let e11 = i10 && P(t10) ? s4 : s4.value;
        return l2 && R(e11) ? tc(e11) : e11;
      }
      return R(s4) ? l2 ? tc(s4) : ta(s4) : s4;
    }
  };
  var e1 = class extends e0 {
    constructor(e10 = false) {
      super(false, e10);
    }
    set(e10, t10, n2, l2) {
      let r10 = e10[t10], i10 = k(e10) && P(t10);
      if (!this._isShallow) {
        let e11 = th(r10);
        if (tg(n2) || th(n2) || (r10 = t_(r10), n2 = t_(n2)), !i10 && tS(r10) && !tS(n2)) if (e11) return true;
        else return r10.value = n2, true;
      }
      let s4 = i10 ? Number(t10) < e10.length : w(e10, t10), o2 = Reflect.set(e10, t10, n2, tS(e10) ? e10 : l2);
      return e10 === t_(l2) && o2 && (s4 ? B(n2, r10) && eU(e10, "set", t10, n2) : eU(e10, "add", t10, n2)), o2;
    }
    deleteProperty(e10, t10) {
      let n2 = w(e10, t10);
      e10[t10];
      let l2 = Reflect.deleteProperty(e10, t10);
      return l2 && n2 && eU(e10, "delete", t10, void 0), l2;
    }
    has(e10, t10) {
      let n2 = Reflect.has(e10, t10);
      return A(t10) && eY.has(t10) || eD(e10, "has", t10), n2;
    }
    ownKeys(e10) {
      return eD(e10, "iterate", k(e10) ? "length" : eL), Reflect.ownKeys(e10);
    }
  };
  var e2 = class extends e0 {
    constructor(e10 = false) {
      super(true, e10);
    }
    set(e10, t10) {
      return true;
    }
    deleteProperty(e10, t10) {
      return true;
    }
  };
  var e6 = new e1();
  var e8 = new e2();
  var e4 = new e1(true);
  var e3 = new e2(true);
  var e5 = (e10) => e10;
  function e9(e10) {
    return function() {
      return "delete" !== e10 && ("clear" === e10 ? void 0 : this);
    };
  }
  function e7(e10, t10) {
    let n2, l2 = (S(n2 = { get(n3) {
      let l4 = this.__v_raw, r10 = t_(l4), i10 = t_(n3);
      e10 || (B(n3, i10) && eD(r10, "get", n3), eD(r10, "get", i10));
      let { has: s4 } = Reflect.getPrototypeOf(r10), o2 = t10 ? e5 : e10 ? tb : ty;
      return s4.call(r10, n3) ? o2(l4.get(n3)) : s4.call(r10, i10) ? o2(l4.get(i10)) : void (l4 !== r10 && l4.get(n3));
    }, get size() {
      let t11 = this.__v_raw;
      return e10 || eD(t_(t11), "iterate", eL), t11.size;
    }, has(t11) {
      let n3 = this.__v_raw, l4 = t_(n3), r10 = t_(t11);
      return e10 || (B(t11, r10) && eD(l4, "has", t11), eD(l4, "has", r10)), t11 === r10 ? n3.has(t11) : n3.has(t11) || n3.has(r10);
    }, forEach(n3, l4) {
      let r10 = this, i10 = r10.__v_raw, s4 = t_(i10), o2 = t10 ? e5 : e10 ? tb : ty;
      return e10 || eD(s4, "iterate", eL), i10.forEach((e11, t11) => n3.call(l4, o2(e11), o2(t11), r10));
    } }, e10 ? { add: e9("add"), set: e9("set"), delete: e9("delete"), clear: e9("clear") } : { add(e11) {
      let n3 = t_(this), l4 = Reflect.getPrototypeOf(n3), r10 = t_(e11), i10 = t10 || tg(e11) || th(e11) ? e11 : r10;
      return l4.has.call(n3, i10) || B(e11, i10) && l4.has.call(n3, e11) || B(r10, i10) && l4.has.call(n3, r10) || (n3.add(i10), eU(n3, "add", i10, i10)), this;
    }, set(e11, n3) {
      t10 || tg(n3) || th(n3) || (n3 = t_(n3));
      let l4 = t_(this), { has: r10, get: i10 } = Reflect.getPrototypeOf(l4), s4 = r10.call(l4, e11);
      s4 || (e11 = t_(e11), s4 = r10.call(l4, e11));
      let o2 = i10.call(l4, e11);
      return l4.set(e11, n3), s4 ? B(n3, o2) && eU(l4, "set", e11, n3) : eU(l4, "add", e11, n3), this;
    }, delete(e11) {
      let t11 = t_(this), { has: n3, get: l4 } = Reflect.getPrototypeOf(t11), r10 = n3.call(t11, e11);
      r10 || (e11 = t_(e11), r10 = n3.call(t11, e11)), l4 && l4.call(t11, e11);
      let i10 = t11.delete(e11);
      return r10 && eU(t11, "delete", e11, void 0), i10;
    }, clear() {
      let e11 = t_(this), t11 = 0 !== e11.size, n3 = e11.clear();
      return t11 && eU(e11, "clear", void 0, void 0), n3;
    } }), ["keys", "values", "entries", Symbol.iterator].forEach((l4) => {
      n2[l4] = function(...n3) {
        let r10, i10 = this.__v_raw, s4 = t_(i10), o2 = "[object Map]" === (r10 = s4, N.call(r10)), a2 = "entries" === l4 || l4 === Symbol.iterator && o2, u2 = i10[l4](...n3), c2 = t10 ? e5 : e10 ? tb : ty;
        return e10 || eD(s4, "iterate", "keys" === l4 && o2 ? ej : eL), S(Object.create(u2), { next() {
          let { value: e11, done: t11 } = u2.next();
          return t11 ? { value: e11, done: t11 } : { value: a2 ? [c2(e11[0]), c2(e11[1])] : c2(e11), done: t11 };
        } });
      };
    }), n2);
    return (t11, n3, r10) => "__v_isReactive" === n3 ? !e10 : "__v_isReadonly" === n3 ? e10 : "__v_raw" === n3 ? t11 : Reflect.get(w(l2, n3) && n3 in t11 ? l2 : t11, n3, r10);
  }
  var te = { get: e7(false, false) };
  var tt = { get: e7(false, true) };
  var tn = { get: e7(true, false) };
  var tl = { get: e7(true, true) };
  var tr = /* @__PURE__ */ new WeakMap();
  var ti = /* @__PURE__ */ new WeakMap();
  var ts = /* @__PURE__ */ new WeakMap();
  var to = /* @__PURE__ */ new WeakMap();
  function ta(e10) {
    return th(e10) ? e10 : tp(e10, false, e6, te, tr);
  }
  function tu(e10) {
    return tp(e10, false, e4, tt, ti);
  }
  function tc(e10) {
    return tp(e10, true, e8, tn, ts);
  }
  function tp(e10, t10, n2, l2, r10) {
    let i10;
    if (!R(e10) || e10.__v_raw && !(t10 && e10.__v_isReactive) || e10.__v_skip || !Object.isExtensible(e10)) return e10;
    let s4 = r10.get(e10);
    if (s4) return s4;
    let o2 = (function(e11) {
      switch (e11) {
        case "Object":
        case "Array":
          return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
          return 2;
        default:
          return 0;
      }
    })((i10 = e10, N.call(i10)).slice(8, -1));
    if (0 === o2) return e10;
    let a2 = new Proxy(e10, 2 === o2 ? l2 : n2);
    return r10.set(e10, a2), a2;
  }
  function td(e10) {
    return th(e10) ? td(e10.__v_raw) : !!(e10 && e10.__v_isReactive);
  }
  function th(e10) {
    return !!(e10 && e10.__v_isReadonly);
  }
  function tg(e10) {
    return !!(e10 && e10.__v_isShallow);
  }
  function tv(e10) {
    return !!e10 && !!e10.__v_raw;
  }
  function t_(e10) {
    let t10 = e10 && e10.__v_raw;
    return t10 ? t_(t10) : e10;
  }
  function tm(e10) {
    return !w(e10, "__v_skip") && Object.isExtensible(e10) && H(e10, "__v_skip", true), e10;
  }
  var ty = (e10) => R(e10) ? ta(e10) : e10;
  var tb = (e10) => R(e10) ? tc(e10) : e10;
  function tS(e10) {
    return !!e10 && true === e10.__v_isRef;
  }
  function tC(e10) {
    return tw(e10, false);
  }
  function tx(e10) {
    return tw(e10, true);
  }
  function tw(e10, t10) {
    return tS(e10) ? e10 : new tk(e10, t10);
  }
  var tk = class {
    constructor(e10, t10) {
      this.dep = new eI(), this.__v_isRef = true, this.__v_isShallow = false, this._rawValue = t10 ? e10 : t_(e10), this._value = t10 ? e10 : ty(e10), this.__v_isShallow = t10;
    }
    get value() {
      return this.dep.track(), this._value;
    }
    set value(e10) {
      let t10 = this._rawValue, n2 = this.__v_isShallow || tg(e10) || th(e10);
      B(e10 = n2 ? e10 : t_(e10), t10) && (this._rawValue = e10, this._value = n2 ? e10 : ty(e10), this.dep.trigger());
    }
  };
  function tT(e10) {
    return tS(e10) ? e10.value : e10;
  }
  var tR = { get: (e10, t10, n2) => "__v_raw" === t10 ? e10 : tT(Reflect.get(e10, t10, n2)), set: (e10, t10, n2, l2) => {
    let r10 = e10[t10];
    return tS(r10) && !tS(n2) ? (r10.value = n2, true) : Reflect.set(e10, t10, n2, l2);
  } };
  function tO(e10) {
    return td(e10) ? e10 : new Proxy(e10, tR);
  }
  var tj = class {
    constructor(e10, t10, n2) {
      this.fn = e10, this.setter = t10, this._value = void 0, this.dep = new eI(this), this.__v_isRef = true, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = eP - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t10, this.isSSR = n2;
    }
    notify() {
      if (this.flags |= 16, !(8 & this.flags) && r !== this) return em(this, true), true;
    }
    get value() {
      let e10 = this.dep.track();
      return ex(this), e10 && (e10.version = this.dep.version), this._value;
    }
    set value(e10) {
      this.setter && this.setter(e10);
    }
  };
  var tU = {};
  var tB = /* @__PURE__ */ new WeakMap();
  function tH(e10, t10 = false, n2 = p) {
    if (n2) {
      let t11 = tB.get(n2);
      t11 || tB.set(n2, t11 = []), t11.push(e10);
    }
  }
  function tW(e10, t10 = 1 / 0, n2) {
    if (t10 <= 0 || !R(e10) || e10.__v_skip || ((n2 = n2 || /* @__PURE__ */ new Map()).get(e10) || 0) >= t10) return e10;
    if (n2.set(e10, t10), t10--, tS(e10)) tW(e10.value, t10, n2);
    else if (k(e10)) for (let l2 = 0; l2 < e10.length; l2++) tW(e10[l2], t10, n2);
    else {
      let l2, r10;
      if ("[object Set]" === (l2 = e10, N.call(l2)) || "[object Map]" === (r10 = e10, N.call(r10))) e10.forEach((e11) => {
        tW(e11, t10, n2);
      });
      else {
        let l4;
        if ("[object Object]" === (l4 = e10, N.call(l4))) {
          for (let l6 in e10) tW(e10[l6], t10, n2);
          for (let l6 of Object.getOwnPropertySymbols(e10)) Object.prototype.propertyIsEnumerable.call(e10, l6) && tW(e10[l6], t10, n2);
        }
      }
    }
    return e10;
  }
  function tq(e10, t10, n2, l2) {
    try {
      return l2 ? e10(...l2) : e10();
    } catch (e11) {
      tX(e11, t10, n2);
    }
  }
  function tG(e10, t10, n2, l2) {
    if (E(e10)) {
      let r10 = tq(e10, t10, n2, l2);
      return r10 && O(r10) && r10.catch((e11) => {
        tX(e11, t10, n2);
      }), r10;
    }
    if (k(e10)) {
      let r10 = [];
      for (let i10 = 0; i10 < e10.length; i10++) r10.push(tG(e10[i10], t10, n2, l2));
      return r10;
    }
  }
  function tX(e10, t10, n2, l2 = true) {
    let r10 = t10 ? t10.vnode : null, { errorHandler: i10, throwUnhandledErrorInProduction: s4 } = t10 && t10.appContext.config || g;
    if (t10) {
      let l4 = t10.parent, r11 = t10.proxy, s6 = `https://vuejs.org/error-reference/#runtime-${n2}`;
      for (; l4; ) {
        let t11 = l4.ec;
        if (t11) {
          for (let n3 = 0; n3 < t11.length; n3++) if (false === t11[n3](e10, r11, s6)) return;
        }
        l4 = l4.parent;
      }
      if (i10) {
        eR(), tq(i10, null, 10, [e10, r11, s6]), eO();
        return;
      }
    }
    !(function(e11, t11 = true, n3 = false) {
      if (n3) throw e11;
      console.error(e11);
    })(e10, l2, s4);
  }
  var tJ = [];
  var tZ = -1;
  var tY = [];
  var tQ = null;
  var t0 = 0;
  var t1 = Promise.resolve();
  var t2 = null;
  function t6(e10) {
    let t10 = t2 || t1;
    return e10 ? t10.then(this ? e10.bind(this) : e10) : t10;
  }
  function t8(e10) {
    if (!(1 & e10.flags)) {
      let t10 = t7(e10), n2 = tJ[tJ.length - 1];
      !n2 || !(2 & e10.flags) && t10 >= t7(n2) ? tJ.push(e10) : tJ.splice((function(e11) {
        let t11 = tZ + 1, n3 = tJ.length;
        for (; t11 < n3; ) {
          let l2 = t11 + n3 >>> 1, r10 = tJ[l2], i10 = t7(r10);
          i10 < e11 || i10 === e11 && 2 & r10.flags ? t11 = l2 + 1 : n3 = l2;
        }
        return t11;
      })(t10), 0, e10), e10.flags |= 1, t4();
    }
  }
  function t4() {
    t2 || (t2 = t1.then(function e10(t10) {
      try {
        for (tZ = 0; tZ < tJ.length; tZ++) {
          let e11 = tJ[tZ];
          e11 && !(8 & e11.flags) && (4 & e11.flags && (e11.flags &= -2), tq(e11, e11.i, e11.i ? 15 : 14), 4 & e11.flags || (e11.flags &= -2));
        }
      } finally {
        for (; tZ < tJ.length; tZ++) {
          let e11 = tJ[tZ];
          e11 && (e11.flags &= -2);
        }
        tZ = -1, tJ.length = 0, t9(), t2 = null, (tJ.length || tY.length) && e10();
      }
    }));
  }
  function t3(e10) {
    if (k(e10)) for (let t10 = 0; t10 < e10.length; t10++) tY.push(e10[t10]);
    else tQ && -1 === e10.id ? tQ.splice(t0 + 1, 0, e10) : 1 & e10.flags || (tY.push(e10), e10.flags |= 1);
    t4();
  }
  function t5(e10, t10, n2 = tZ + 1) {
    for (; n2 < tJ.length; n2++) {
      let t11 = tJ[n2];
      if (t11 && 2 & t11.flags) {
        if (e10 && t11.id !== e10.uid) continue;
        tJ.splice(n2, 1), n2--, 4 & t11.flags && (t11.flags &= -2), t11(), 4 & t11.flags || (t11.flags &= -2);
      }
    }
  }
  function t9(e10) {
    if (tY.length) {
      let e11 = [...new Set(tY)].sort((e12, t10) => t7(e12) - t7(t10));
      if (tY.length = 0, tQ) {
        for (let t10 = 0; t10 < e11.length; t10++) tQ.push(e11[t10]);
        return;
      }
      for (tQ = e11, t0 = 0; t0 < tQ.length; t0++) {
        let e12 = tQ[t0];
        4 & e12.flags && (e12.flags &= -2), 8 & e12.flags || e12(), e12.flags &= -2;
      }
      tQ = null, t0 = 0;
    }
  }
  var t7 = (e10) => null == e10.id ? 2 & e10.flags ? -1 : 1 / 0 : e10.id;
  var ne = null;
  var nt = null;
  function nn(e10) {
    let t10 = ne;
    return ne = e10, nt = e10 && e10.type.__scopeId || null, t10;
  }
  function ns(e10, t10 = ne, n2) {
    if (!t10 || e10._n) return e10;
    let l2 = (...n3) => {
      let r10;
      l2._d && r8(-1);
      let i10 = nn(t10), s4 = rQ.length;
      try {
        r10 = e10(...n3);
      } finally {
        for (let e11 = rQ.length; e11 > s4; e11--) r2();
        nn(i10), l2._d && r8(1);
      }
      return r10;
    };
    return l2._n = true, l2._c = true, l2._d = true, l2;
  }
  function no(e10, t10) {
    if (null === ne) return e10;
    let n2 = iM(ne), l2 = e10.dirs || (e10.dirs = []);
    for (let e11 = 0; e11 < t10.length; e11++) {
      let [r10, i10, s4, o2 = g] = t10[e11];
      r10 && (E(r10) && (r10 = { mounted: r10, updated: r10 }), r10.deep && tW(i10), l2.push({ dir: r10, instance: n2, value: i10, oldValue: void 0, arg: s4, modifiers: o2 }));
    }
    return e10;
  }
  function na(e10, t10, n2, l2) {
    let r10 = e10.dirs, i10 = t10 && t10.dirs;
    for (let s4 = 0; s4 < r10.length; s4++) {
      let o2 = r10[s4];
      i10 && (o2.oldValue = i10[s4].value);
      let a2 = o2.dir[l2];
      a2 && (eR(), tG(a2, n2, 8, [e10.el, o2, e10, t10]), eO());
    }
  }
  function nu(e10, t10) {
    if (ib) {
      let n2 = ib.provides, l2 = ib.parent && ib.parent.provides;
      l2 === n2 && (n2 = ib.provides = Object.create(l2)), n2[e10] = t10;
    }
  }
  function nc(e10, t10, n2 = false) {
    let l2 = iS();
    if (l2 || ra) {
      let r10 = ra ? ra._context.provides : l2 ? null == l2.parent || l2.ce ? l2.vnode.appContext && l2.vnode.appContext.provides : l2.parent.provides : void 0;
      if (r10 && e10 in r10) return r10[e10];
      if (arguments.length > 1) return n2 && E(t10) ? t10.call(l2 && l2.proxy) : t10;
    }
  }
  var np = /* @__PURE__ */ Symbol.for("v-scx");
  var nd = () => nc(np);
  function n_(e10, t10, n2) {
    return nm(e10, t10, n2);
  }
  function nm(e10, t10, n2 = g) {
    let l2, { immediate: r10, flush: i10 } = n2, s4 = S({}, n2), o2 = t10 && r10 || !t10 && "post" !== i10;
    if (ik) {
      if ("sync" === i10) {
        let e11 = nd();
        l2 = e11.__watcherHandles || (e11.__watcherHandles = []);
      } else if (!o2) {
        let e11 = () => {
        };
        return e11.stop = _, e11.resume = _, e11.pause = _, e11;
      }
    }
    let a2 = ib;
    s4.call = (e11, t11, n3) => tG(e11, a2, t11, n3);
    let u2 = false;
    "post" === i10 ? s4.scheduler = (e11) => {
      rP(e11, a2 && a2.suspense);
    } : "sync" !== i10 && (u2 = true, s4.scheduler = (e11, t11) => {
      t11 ? e11() : t8(e11);
    }), s4.augmentJob = (e11) => {
      t10 && (e11.flags |= 4), u2 && (e11.flags |= 2, a2 && (e11.id = a2.uid, e11.i = a2));
    };
    let c2 = (function(e11, t11, n3 = g) {
      let l4, r11, i11, s6, { immediate: o3, deep: a3, once: u3, scheduler: c3, augmentJob: f2, call: d2 } = n3, h2 = (e12) => a3 ? e12 : tg(e12) || false === a3 || 0 === a3 ? tW(e12, 1) : tW(e12), v2 = false, m2 = false;
      if (tS(e11) ? (r11 = () => e11.value, v2 = tg(e11)) : td(e11) ? (r11 = () => h2(e11), v2 = true) : k(e11) ? (m2 = true, v2 = e11.some((e12) => td(e12) || tg(e12)), r11 = () => e11.map((e12) => tS(e12) ? e12.value : td(e12) ? h2(e12) : E(e12) ? d2 ? d2(e12, 2) : e12() : void 0)) : r11 = E(e11) ? t11 ? d2 ? () => d2(e11, 2) : e11 : () => {
        if (i11) {
          eR();
          try {
            i11();
          } finally {
            eO();
          }
        }
        let t12 = p;
        p = l4;
        try {
          return d2 ? d2(e11, 3, [s6]) : e11(s6);
        } finally {
          p = t12;
        }
      } : _, t11 && a3) {
        let e12 = r11, t12 = true === a3 ? 1 / 0 : a3;
        r11 = () => tW(e12(), t12);
      }
      let y2 = ed(), b2 = () => {
        l4.stop(), y2 && y2.active && C(y2.effects, l4);
      };
      if (u3 && t11) {
        let e12 = t11;
        t11 = (...t12) => {
          let n4 = e12(...t12);
          return b2(), n4;
        };
      }
      let S2 = m2 ? Array(e11.length).fill(tU) : tU, x2 = (e12) => {
        if (1 & l4.flags && (l4.dirty || e12)) if (t11) {
          let n4 = l4.run();
          if (e12 || a3 || v2 || (m2 ? n4.some((e13, t12) => B(e13, S2[t12])) : B(n4, S2))) {
            i11 && i11();
            let e13 = p;
            p = l4;
            try {
              let e14 = [n4, S2 === tU ? void 0 : m2 && S2[0] === tU ? [] : S2, s6];
              S2 = n4, d2 ? d2(t11, 3, e14) : t11(...e14);
            } finally {
              p = e13;
            }
          }
        } else l4.run();
      };
      return f2 && f2(x2), (l4 = new ev(r11)).scheduler = c3 ? () => c3(x2, false) : x2, s6 = (e12) => tH(e12, false, l4), i11 = l4.onStop = () => {
        let e12 = tB.get(l4);
        if (e12) {
          if (d2) d2(e12, 4);
          else for (let t12 of e12) t12();
          tB.delete(l4);
        }
      }, t11 ? o3 ? x2(true) : S2 = l4.run() : c3 ? c3(x2.bind(null, true), true) : l4.run(), b2.pause = l4.pause.bind(l4), b2.resume = l4.resume.bind(l4), b2.stop = b2, b2;
    })(e10, t10, s4);
    return ik && (l2 ? l2.push(c2) : o2 && c2()), c2;
  }
  function ny(e10, t10, n2) {
    let l2, r10 = this.proxy, i10 = T(e10) ? e10.includes(".") ? nb(r10, e10) : () => r10[e10] : e10.bind(r10, r10);
    E(t10) ? l2 = t10 : (l2 = t10.handler, n2 = t10);
    let s4 = iC(this), o2 = nm(i10, l2.bind(r10), n2);
    return s4(), o2;
  }
  function nb(e10, t10) {
    let n2 = t10.split(".");
    return () => {
      let t11 = e10;
      for (let e11 = 0; e11 < n2.length && t11; e11++) t11 = t11[n2[e11]];
      return t11;
    };
  }
  var nC = /* @__PURE__ */ Symbol("_vte");
  var nN = /* @__PURE__ */ Symbol("_leaveCb");
  var nP = /* @__PURE__ */ Symbol("_enterCb");
  function nM() {
    let e10 = { isMounted: false, isLeaving: false, isUnmounting: false, leavingVNodes: /* @__PURE__ */ new Map() };
    return ly(() => {
      e10.isMounted = true;
    }), lC(() => {
      e10.isUnmounting = true;
    }), e10;
  }
  var nI = [Function, Array];
  var nF = { mode: String, appear: Boolean, persisted: Boolean, onBeforeEnter: nI, onEnter: nI, onAfterEnter: nI, onEnterCancelled: nI, onBeforeLeave: nI, onLeave: nI, onAfterLeave: nI, onLeaveCancelled: nI, onBeforeAppear: nI, onAppear: nI, onAfterAppear: nI, onAppearCancelled: nI };
  var nL = (e10) => {
    let t10 = e10.subTree;
    return t10.component ? nL(t10.component) : t10;
  };
  function nj(e10) {
    let t10 = e10[0];
    if (e10.length > 1) {
      for (let n2 of e10) if (n2.type !== rZ) {
        t10 = n2;
        break;
      }
    }
    return t10;
  }
  var nV = { name: "BaseTransition", props: nF, setup(e10, { slots: t10 }) {
    let n2 = iS(), l2 = nM();
    return () => {
      let r10 = t10.default && nW(t10.default(), true), i10 = r10 && r10.length ? nj(r10) : n2.subTree ? ic() : void 0;
      if (!i10) return;
      let s4 = t_(e10), { mode: o2 } = s4;
      if (l2.isLeaving) return nB(i10);
      let a2 = n$(i10);
      if (!a2) return nB(i10);
      let u2 = nU(a2, s4, l2, n2, (e11) => u2 = e11);
      a2.type !== rZ && nH(a2, u2);
      let c2 = n2.subTree && n$(n2.subTree);
      if (c2 && c2.type !== rZ && !r7(c2, a2) && nL(n2).type !== rZ) {
        let e11 = nU(c2, s4, l2, n2);
        if (nH(c2, e11), "out-in" === o2 && a2.type !== rZ) return l2.isLeaving = true, e11.afterLeave = () => {
          l2.isLeaving = false, 8 & n2.job.flags || n2.update(), delete e11.afterLeave, c2 = void 0;
        }, nB(i10);
        "in-out" === o2 && a2.type !== rZ ? e11.delayLeave = (e12, t11, n3) => {
          nD(l2, c2)[String(c2.key)] = c2, e12[nN] = () => {
            t11(), e12[nN] = void 0, delete u2.delayedLeave, c2 = void 0;
          }, u2.delayedLeave = () => {
            n3(), delete u2.delayedLeave, c2 = void 0;
          };
        } : c2 = void 0;
      } else c2 && (c2 = void 0);
      return i10;
    };
  } };
  function nD(e10, t10) {
    let { leavingVNodes: n2 } = e10, l2 = n2.get(t10.type);
    return l2 || (l2 = /* @__PURE__ */ Object.create(null), n2.set(t10.type, l2)), l2;
  }
  function nU(e10, t10, n2, l2, r10) {
    let { appear: i10, mode: s4, persisted: o2 = false, onBeforeEnter: a2, onEnter: u2, onAfterEnter: c2, onEnterCancelled: f2, onBeforeLeave: p2, onLeave: d2, onAfterLeave: h2, onLeaveCancelled: g2, onBeforeAppear: v2, onAppear: _2, onAfterAppear: m2, onAppearCancelled: y2 } = t10, b2 = String(e10.key), S2 = nD(n2, e10), C2 = (e11, t11) => {
      e11 && tG(e11, l2, 9, t11);
    }, x2 = (e11, t11) => {
      let n3 = t11[1];
      C2(e11, t11), k(e11) ? e11.every((e12) => e12.length <= 1) && n3() : e11.length <= 1 && n3();
    }, w2 = { mode: s4, persisted: o2, beforeEnter(t11) {
      let l4 = a2;
      if (!n2.isMounted) if (!i10) return;
      else l4 = v2 || a2;
      t11[nN] && t11[nN](true);
      let r11 = S2[b2];
      r11 && r7(e10, r11) && r11.el[nN] && r11.el[nN](), C2(l4, [t11]);
    }, enter(t11) {
      if (S2[b2] === e10) return;
      let l4 = u2, r11 = c2, s6 = f2;
      if (!n2.isMounted) if (!i10) return;
      else l4 = _2 || u2, r11 = m2 || c2, s6 = y2 || f2;
      let o3 = false;
      t11[nP] = (e11) => {
        o3 || (o3 = true, e11 ? C2(s6, [t11]) : C2(r11, [t11]), w2.delayedLeave && w2.delayedLeave(), t11[nP] = void 0);
      };
      let a3 = t11[nP].bind(null, false);
      l4 ? x2(l4, [t11, a3]) : a3();
    }, leave(t11, l4) {
      let r11 = String(e10.key);
      if (t11[nP] && t11[nP](true), n2.isUnmounting) return l4();
      C2(p2, [t11]);
      let i11 = false;
      t11[nN] = (n3) => {
        i11 || (i11 = true, l4(), n3 ? C2(g2, [t11]) : C2(h2, [t11]), t11[nN] = void 0, S2[r11] === e10 && delete S2[r11]);
      };
      let s6 = t11[nN].bind(null, false);
      S2[r11] = e10, d2 ? x2(d2, [t11, s6]) : s6();
    }, clone(e11) {
      let i11 = nU(e11, t10, n2, l2, r10);
      return r10 && r10(i11), i11;
    } };
    return w2;
  }
  function nB(e10) {
    if (la(e10)) return (e10 = io(e10)).children = null, e10;
  }
  function n$(e10) {
    if (!la(e10)) return e10.type.__isTeleport && e10.children ? nj(e10.children) : e10;
    if (e10.component) return e10.component.subTree;
    let { shapeFlag: t10, children: n2 } = e10;
    if (n2) {
      if (16 & t10) return n2[0];
      if (32 & t10 && E(n2.default)) return n2.default();
    }
  }
  function nH(e10, t10) {
    if (6 & e10.shapeFlag && e10.component) {
      e10.transition = t10;
      let n2 = e10.component.subTree;
      nH(n2.type.__isTeleport && n$(n2) || n2, t10);
    } else 128 & e10.shapeFlag ? (e10.ssContent.transition = t10.clone(e10.ssContent), e10.ssFallback.transition = t10.clone(e10.ssFallback)) : e10.transition = t10;
  }
  function nW(e10, t10 = false, n2) {
    let l2 = [], r10 = 0;
    for (let i10 = 0; i10 < e10.length; i10++) {
      let s4 = e10[i10], o2 = null == n2 ? s4.key : String(n2) + String(null != s4.key ? s4.key : i10);
      s4.type === rX ? (128 & s4.patchFlag && r10++, l2 = l2.concat(nW(s4.children, t10, o2))) : (t10 || s4.type !== rZ) && l2.push(null != o2 ? io(s4, { key: o2 }) : s4);
    }
    if (r10 > 1) for (let e11 = 0; e11 < l2.length; e11++) l2[e11].patchFlag = -2;
    return l2;
  }
  function nK(e10, t10) {
    return E(e10) ? S({ name: e10.name }, t10, { setup: e10 }) : e10;
  }
  function nq(e10) {
    e10.ids = [e10.ids[0] + e10.ids[2]++ + "-", 0, 0];
  }
  function nX(e10, t10) {
    let n2;
    return !!((n2 = Object.getOwnPropertyDescriptor(e10, t10)) && !n2.configurable);
  }
  var nJ = /* @__PURE__ */ new WeakMap();
  function nZ(e10, t10, n2, l2, r10 = false) {
    if (k(e10)) return void e10.forEach((e11, i11) => nZ(e11, t10 && (k(t10) ? t10[i11] : t10), n2, l2, r10));
    if (li(l2) && !r10) {
      512 & l2.shapeFlag && l2.type.__asyncResolved && l2.component.subTree.component && nZ(e10, t10, n2, l2.component.subTree);
      return;
    }
    let i10 = 4 & l2.shapeFlag ? iM(l2.component) : l2.el, s4 = r10 ? null : i10, { i: o2, r: a2 } = e10, u2 = t10 && t10.r, c2 = o2.refs === g ? o2.refs = {} : o2.refs, f2 = o2.setupState, p2 = t_(f2), d2 = f2 === g ? m : (e11) => !nX(c2, e11) && w(p2, e11), h2 = (e11, t11) => !(t11 && nX(c2, t11));
    if (null != u2 && u2 !== a2 && (nY(t10), T(u2) ? (c2[u2] = null, d2(u2) && (f2[u2] = null)) : tS(u2) && (h2(u2, t10.k) && (u2.value = null), t10.k && (c2[t10.k] = null))), E(a2)) tq(a2, o2, 12, [s4, c2]);
    else {
      let t11 = T(a2), l4 = tS(a2);
      if (t11 || l4) {
        let o3 = () => {
          if (e10.f) {
            let n3 = t11 ? d2(a2) ? f2[a2] : c2[a2] : h2() || !e10.k ? a2.value : c2[e10.k];
            if (r10) k(n3) && C(n3, i10);
            else if (k(n3)) n3.includes(i10) || n3.push(i10);
            else if (t11) c2[a2] = [i10], d2(a2) && (f2[a2] = c2[a2]);
            else {
              let t12 = [i10];
              h2(a2, e10.k) && (a2.value = t12), e10.k && (c2[e10.k] = t12);
            }
          } else t11 ? (c2[a2] = s4, d2(a2) && (f2[a2] = s4)) : l4 && (h2(a2, e10.k) && (a2.value = s4), e10.k && (c2[e10.k] = s4));
        };
        if (s4) {
          let t12 = () => {
            o3(), nJ.delete(e10);
          };
          t12.id = -1, nJ.set(e10, t12), rP(t12, n2);
        } else nY(e10), o3();
      }
    }
  }
  function nY(e10) {
    let t10 = nJ.get(e10);
    t10 && (t10.flags |= 8, nJ.delete(e10));
  }
  var n7 = z().requestIdleCallback || ((e10) => setTimeout(e10, 1));
  var le = z().cancelIdleCallback || ((e10) => clearTimeout(e10));
  var li = (e10) => !!e10.type.__asyncLoader;
  var la = (e10) => e10.type.__isKeepAlive;
  function lf(e10, t10) {
    ld(e10, "a", t10);
  }
  function lp(e10, t10) {
    ld(e10, "da", t10);
  }
  function ld(e10, t10, n2 = ib) {
    let l2 = e10.__wdc || (e10.__wdc = () => {
      let t11 = n2;
      for (; t11; ) {
        if (t11.isDeactivated) return;
        t11 = t11.parent;
      }
      return e10();
    });
    if (lv(t10, l2, n2), n2) {
      let e11 = n2.parent;
      for (; e11 && e11.parent; ) la(e11.parent.vnode) && (function(e12, t11, n3, l4) {
        let r10 = lv(t11, e12, l4, true);
        lx(() => {
          C(l4[t11], r10);
        }, n3);
      })(l2, t10, n2, e11), e11 = e11.parent;
    }
  }
  function lv(e10, t10, n2 = ib, l2 = false) {
    if (n2) {
      let r10 = n2[e10] || (n2[e10] = []), i10 = t10.__weh || (t10.__weh = (...l4) => {
        eR();
        let r11 = iC(n2), i11 = tG(t10, n2, e10, l4);
        return r11(), eO(), i11;
      });
      return l2 ? r10.unshift(i10) : r10.push(i10), i10;
    }
  }
  var l_ = (e10) => (t10, n2 = ib) => {
    ik && "sp" !== e10 || lv(e10, (...e11) => t10(...e11), n2);
  };
  var lm = l_("bm");
  var ly = l_("m");
  var lb = l_("bu");
  var lS = l_("u");
  var lC = l_("bum");
  var lx = l_("um");
  var lw = l_("sp");
  var lk = l_("rtg");
  var lE = l_("rtc");
  function lT(e10, t10 = ib) {
    lv("ec", e10, t10);
  }
  var lO = /* @__PURE__ */ Symbol.for("v-ndc");
  function lF(e10, t10, n2, l2) {
    let r10, i10 = n2 && n2[l2], s4 = k(e10);
    if (s4 || T(e10)) {
      let n3 = s4 && td(e10), l4 = false, o2 = false;
      n3 && (l4 = !tg(e10), o2 = th(e10), e10 = e$(e10)), r10 = Array(e10.length);
      for (let n4 = 0, s6 = e10.length; n4 < s6; n4++) r10[n4] = t10(l4 ? o2 ? tb(ty(e10[n4])) : ty(e10[n4]) : e10[n4], n4, void 0, i10 && i10[n4]);
    } else if ("number" == typeof e10) {
      r10 = Array(e10);
      for (let n3 = 0; n3 < e10; n3++) r10[n3] = t10(n3 + 1, n3, void 0, i10 && i10[n3]);
    } else if (R(e10)) if (e10[Symbol.iterator]) r10 = Array.from(e10, (e11, n3) => t10(e11, n3, void 0, i10 && i10[n3]));
    else {
      let n3 = Object.keys(e10);
      r10 = Array(n3.length);
      for (let l4 = 0, s6 = n3.length; l4 < s6; l4++) {
        let s7 = n3[l4];
        r10[l4] = t10(e10[s7], s7, l4, i10 && i10[l4]);
      }
    }
    else r10 = [];
    return n2 && (n2[l2] = r10), r10;
  }
  var lU = (e10) => e10 ? iw(e10) ? iM(e10) : lU(e10.parent) : null;
  var lB = S(/* @__PURE__ */ Object.create(null), { $: (e10) => e10, $el: (e10) => e10.vnode.el, $data: (e10) => e10.data, $props: (e10) => e10.props, $attrs: (e10) => e10.attrs, $slots: (e10) => e10.slots, $refs: (e10) => e10.refs, $parent: (e10) => lU(e10.parent), $root: (e10) => lU(e10.root), $host: (e10) => e10.ce, $emit: (e10) => e10.emit, $options: (e10) => l9(e10), $forceUpdate: (e10) => e10.f || (e10.f = () => {
    t8(e10.update);
  }), $nextTick: (e10) => e10.n || (e10.n = t6.bind(e10.proxy)), $watch: (e10) => ny.bind(e10) });
  var l$ = (e10, t10) => e10 !== g && !e10.__isScriptSetup && w(e10, t10);
  var lH = { get({ _: e10 }, t10) {
    let n2, l2;
    if ("__v_skip" === t10) return true;
    let { ctx: r10, setupState: i10, data: s4, props: o2, accessCache: a2, type: u2, appContext: c2 } = e10;
    if ("$" !== t10[0]) {
      let e11 = a2[t10];
      if (void 0 !== e11) switch (e11) {
        case 1:
          return i10[t10];
        case 2:
          return s4[t10];
        case 4:
          return r10[t10];
        case 3:
          return o2[t10];
      }
      else {
        if (l$(i10, t10)) return a2[t10] = 1, i10[t10];
        if (s4 !== g && w(s4, t10)) return a2[t10] = 2, s4[t10];
        if (w(o2, t10)) return a2[t10] = 3, o2[t10];
        if (r10 !== g && w(r10, t10)) return a2[t10] = 4, r10[t10];
        l3 && (a2[t10] = 0);
      }
    }
    let f2 = lB[t10];
    return f2 ? ("$attrs" === t10 && eD(e10.attrs, "get", ""), f2(e10)) : (n2 = u2.__cssModules) && (n2 = n2[t10]) ? n2 : r10 !== g && w(r10, t10) ? (a2[t10] = 4, r10[t10]) : w(l2 = c2.config.globalProperties, t10) ? l2[t10] : void 0;
  }, set({ _: e10 }, t10, n2) {
    let { data: l2, setupState: r10, ctx: i10 } = e10;
    return l$(r10, t10) ? (r10[t10] = n2, true) : l2 !== g && w(l2, t10) ? (l2[t10] = n2, true) : !w(e10.props, t10) && !("$" === t10[0] && t10.slice(1) in e10) && (i10[t10] = n2, true);
  }, has({ _: { data: e10, setupState: t10, accessCache: n2, ctx: l2, appContext: r10, props: i10, type: s4 } }, o2) {
    let a2;
    return !!(n2[o2] || e10 !== g && "$" !== o2[0] && w(e10, o2) || l$(t10, o2) || w(i10, o2) || w(l2, o2) || w(lB, o2) || w(r10.config.globalProperties, o2) || (a2 = s4.__cssModules) && a2[o2]);
  }, defineProperty(e10, t10, n2) {
    return null != n2.get ? e10._.accessCache[t10] = 0 : w(n2, "value") && this.set(e10, t10, n2.value, null), Reflect.defineProperty(e10, t10, n2);
  } };
  var lW = S({}, lH, { get(e10, t10) {
    if (t10 !== Symbol.unscopables) return lH.get(e10, t10, e10);
  }, has: (e10, t10) => "_" !== t10[0] && !q(t10) });
  function l1(e10) {
    return k(e10) ? e10.reduce((e11, t10) => (e11[t10] = null, e11), {}) : e10;
  }
  var l3 = true;
  function l5(e10, t10, n2) {
    tG(k(e10) ? e10.map((e11) => e11.bind(t10.proxy)) : e10.bind(t10.proxy), t10, n2);
  }
  function l9(e10) {
    let t10, n2 = e10.type, { mixins: l2, extends: r10 } = n2, { mixins: i10, optionsCache: s4, config: { optionMergeStrategies: o2 } } = e10.appContext, a2 = s4.get(n2);
    return a2 ? t10 = a2 : i10.length || l2 || r10 ? (t10 = {}, i10.length && i10.forEach((e11) => l7(t10, e11, o2, true)), l7(t10, n2, o2)) : t10 = n2, R(n2) && s4.set(n2, t10), t10;
  }
  function l7(e10, t10, n2, l2 = false) {
    let { mixins: r10, extends: i10 } = t10;
    for (let s4 in i10 && l7(e10, i10, n2, true), r10 && r10.forEach((t11) => l7(e10, t11, n2, true)), t10) if (l2 && "expose" === s4) ;
    else {
      let l4 = re[s4] || n2 && n2[s4];
      e10[s4] = l4 ? l4(e10[s4], t10[s4]) : t10[s4];
    }
    return e10;
  }
  var re = { data: rt, props: ri, emits: ri, methods: rr, computed: rr, beforeCreate: rl, created: rl, beforeMount: rl, mounted: rl, beforeUpdate: rl, updated: rl, beforeDestroy: rl, beforeUnmount: rl, destroyed: rl, unmounted: rl, activated: rl, deactivated: rl, errorCaptured: rl, serverPrefetch: rl, components: rr, directives: rr, watch: function(e10, t10) {
    if (!e10) return t10;
    if (!t10) return e10;
    let n2 = S(/* @__PURE__ */ Object.create(null), e10);
    for (let l2 in t10) n2[l2] = rl(e10[l2], t10[l2]);
    return n2;
  }, provide: rt, inject: function(e10, t10) {
    return rr(rn(e10), rn(t10));
  } };
  function rt(e10, t10) {
    return t10 ? e10 ? function() {
      return S(E(e10) ? e10.call(this, this) : e10, E(t10) ? t10.call(this, this) : t10);
    } : t10 : e10;
  }
  function rn(e10) {
    if (k(e10)) {
      let t10 = {};
      for (let n2 = 0; n2 < e10.length; n2++) t10[e10[n2]] = e10[n2];
      return t10;
    }
    return e10;
  }
  function rl(e10, t10) {
    return e10 ? [...new Set([].concat(e10, t10))] : t10;
  }
  function rr(e10, t10) {
    return e10 ? S(/* @__PURE__ */ Object.create(null), e10, t10) : t10;
  }
  function ri(e10, t10) {
    return e10 ? k(e10) && k(t10) ? [.../* @__PURE__ */ new Set([...e10, ...t10])] : S(/* @__PURE__ */ Object.create(null), l1(e10), l1(null != t10 ? t10 : {})) : t10;
  }
  function rs() {
    return { app: null, config: { isNativeTag: m, performance: false, globalProperties: {}, optionMergeStrategies: {}, errorHandler: void 0, warnHandler: void 0, compilerOptions: {} }, mixins: [], components: {}, directives: {}, provides: /* @__PURE__ */ Object.create(null), optionsCache: /* @__PURE__ */ new WeakMap(), propsCache: /* @__PURE__ */ new WeakMap(), emitsCache: /* @__PURE__ */ new WeakMap() };
  }
  var ro = 0;
  var ra = null;
  var rc = (e10, t10) => "modelValue" === t10 || "model-value" === t10 ? e10.modelModifiers : e10[`${t10}Modifiers`] || e10[`${L(t10)}Modifiers`] || e10[`${V(t10)}Modifiers`];
  function rf(e10, t10, ...n2) {
    let l2;
    if (e10.isUnmounted) return;
    let r10 = e10.vnode.props || g, i10 = n2, s4 = t10.startsWith("update:"), o2 = s4 && rc(r10, t10.slice(7));
    o2 && (o2.trim && (i10 = n2.map((e11) => T(e11) ? e11.trim() : e11)), o2.number && (i10 = i10.map(W)));
    let a2 = r10[l2 = U(t10)] || r10[l2 = U(L(t10))];
    !a2 && s4 && (a2 = r10[l2 = U(V(t10))]), a2 && tG(a2, e10, 6, i10);
    let u2 = r10[l2 + "Once"];
    if (u2) {
      if (e10.emitted) {
        if (e10.emitted[l2]) return;
      } else e10.emitted = {};
      e10.emitted[l2] = true, tG(u2, e10, 6, i10);
    }
  }
  var rp = /* @__PURE__ */ new WeakMap();
  function rd(e10, t10) {
    return !!e10 && !!y(t10) && (w(e10, (t10 = "Once" === (t10 = t10.slice(2)) ? t10 : t10.replace(/Once$/, ""))[0].toLowerCase() + t10.slice(1)) || w(e10, V(t10)) || w(e10, t10));
  }
  function rh(e10) {
    let t10, n2, { type: l2, vnode: r10, proxy: i10, withProxy: s4, propsOptions: [o2], slots: a2, attrs: u2, emit: c2, render: f2, renderCache: p2, props: d2, data: h2, setupState: g2, ctx: v2, inheritAttrs: _2 } = e10, m2 = nn(e10);
    try {
      if (4 & r10.shapeFlag) {
        let e11 = s4 || i10;
        t10 = ip(f2.call(e11, e11, p2, d2, g2, h2, v2)), n2 = u2;
      } else t10 = ip(l2.length > 1 ? l2(d2, { attrs: u2, slots: a2, emit: c2 }) : l2(d2, null)), n2 = l2.props ? u2 : rg(u2);
    } catch (n3) {
      rQ.length = 0, tX(n3, e10, 1), t10 = ii(rZ);
    }
    let y2 = t10;
    if (n2 && false !== _2) {
      let e11 = Object.keys(n2), { shapeFlag: t11 } = y2;
      e11.length && 7 & t11 && (o2 && e11.some(b) && (n2 = rv(n2, o2)), y2 = io(y2, n2, false, true));
    }
    return r10.dirs && ((y2 = io(y2, null, false, true)).dirs = y2.dirs ? y2.dirs.concat(r10.dirs) : r10.dirs), r10.transition && nH(y2.type.__isTeleport && n$(y2) || y2, r10.transition), t10 = y2, nn(m2), t10;
  }
  var rg = (e10) => {
    let t10;
    for (let n2 in e10) ("class" === n2 || "style" === n2 || y(n2)) && ((t10 || (t10 = {}))[n2] = e10[n2]);
    return t10;
  };
  var rv = (e10, t10) => {
    let n2 = {};
    for (let l2 in e10) b(l2) && l2.slice(9) in t10 || (n2[l2] = e10[l2]);
    return n2;
  };
  function r_(e10, t10, n2) {
    let l2 = Object.keys(t10);
    if (l2.length !== Object.keys(e10).length) return true;
    for (let r10 = 0; r10 < l2.length; r10++) {
      let i10 = l2[r10];
      if (rm(t10, e10, i10) && !rd(n2, i10)) return true;
    }
    return false;
  }
  function rm(e10, t10, n2) {
    let l2 = e10[n2], r10 = t10[n2];
    return "style" === n2 && R(l2) && R(r10) ? !ei(l2, r10) : l2 !== r10;
  }
  function ry({ vnode: e10, parent: t10, suspense: n2 }, l2) {
    for (; t10; ) {
      let n3 = t10.subTree;
      if (n3.suspense && n3.suspense.activeBranch === e10 && (n3.suspense.vnode.el = n3.el = l2, e10 = n3), n3 === e10) (e10 = t10.vnode).el = l2, t10 = t10.parent;
      else break;
    }
    n2 && n2.activeBranch === e10 && (n2.vnode.el = l2);
  }
  var rb = {};
  var rS = (e10) => Object.getPrototypeOf(e10) === rb;
  function rC(e10, t10, n2, l2) {
    let r10, [i10, s4] = e10.propsOptions, o2 = false;
    if (t10) for (let a2 in t10) {
      let u2;
      if (M(a2)) continue;
      let c2 = t10[a2];
      i10 && w(i10, u2 = L(a2)) ? s4 && s4.includes(u2) ? (r10 || (r10 = {}))[u2] = c2 : n2[u2] = c2 : rd(e10.emitsOptions, a2) || a2 in l2 && c2 === l2[a2] || (l2[a2] = c2, o2 = true);
    }
    if (s4) {
      let t11 = t_(n2), l4 = r10 || g;
      for (let r11 = 0; r11 < s4.length; r11++) {
        let o3 = s4[r11];
        n2[o3] = rx(i10, t11, o3, l4[o3], e10, !w(l4, o3));
      }
    }
    return o2;
  }
  function rx(e10, t10, n2, l2, r10, i10) {
    let s4 = e10[n2];
    if (null != s4) {
      let e11 = w(s4, "default");
      if (e11 && void 0 === l2) {
        let e12 = s4.default;
        if (s4.type !== Function && !s4.skipFactory && E(e12)) {
          let { propsDefaults: i11 } = r10;
          if (n2 in i11) l2 = i11[n2];
          else {
            let s6 = iC(r10);
            l2 = i11[n2] = e12.call(null, t10), s6();
          }
        } else l2 = e12;
        r10.ce && r10.ce._setProp(n2, l2);
      }
      s4[0] && (i10 && !e11 ? l2 = false : s4[1] && ("" === l2 || l2 === V(n2)) && (l2 = true));
    }
    return l2;
  }
  var rw = /* @__PURE__ */ new WeakMap();
  function rk(e10) {
    return !("$" === e10[0] || M(e10));
  }
  var rE = (e10) => "_" === e10 || "_ctx" === e10 || "$stable" === e10;
  var rT = (e10) => k(e10) ? e10.map(ip) : [ip(e10)];
  var rA = (e10, t10, n2) => {
    if (t10._n) return t10;
    let l2 = ns((...e11) => rT(t10(...e11)), n2);
    return l2._c = false, l2;
  };
  var rR = (e10, t10, n2) => {
    let l2 = e10._ctx;
    for (let n3 in e10) {
      if (rE(n3)) continue;
      let r10 = e10[n3];
      if (E(r10)) t10[n3] = rA(n3, r10, l2);
      else if (null != r10) {
        let e11 = rT(r10);
        t10[n3] = () => e11;
      }
    }
  };
  var rO = (e10, t10) => {
    let n2 = rT(t10);
    e10.slots.default = () => n2;
  };
  var rN = (e10, t10, n2) => {
    for (let l2 in t10) (n2 || !rE(l2)) && (e10[l2] = t10[l2]);
  };
  var rP = rq;
  function rM(e10) {
    return rF(e10);
  }
  function rF(e10, t10) {
    var n2;
    let l2, r10;
    z().__VUE__ = true;
    let { insert: i10, remove: s4, patchProp: o2, createElement: a2, createText: u2, createComment: c2, setText: f2, setElementText: p2, parentNode: d2, nextSibling: h2, setScopeId: m2 = _, insertStaticContent: y2 } = e10, b2 = (e11, t11, n3, l4 = null, r11 = null, i11 = null, s6, o3 = null, a3 = !!t11.dynamicChildren) => {
      if (e11 === t11) return;
      e11 && !r7(e11, t11) && (l4 = et2(e11), J2(e11, r11, i11, true), e11 = null), -2 === t11.patchFlag && (a3 = false, t11.dynamicChildren = null), t11.dynamicChildren && e11 && e11.dynamicChildren && e11.dynamicChildren.hasOnce && (t11.dynamicChildren === v && (t11.dynamicChildren = []), t11.dynamicChildren.hasOnce = true);
      let { type: u3, ref: c3, shapeFlag: f3 } = t11;
      switch (u3) {
        case rJ:
          C2(e11, t11, n3, l4);
          break;
        case rZ:
          x2(e11, t11, n3, l4);
          break;
        case rY:
          null == e11 && k2(t11, n3, l4, s6);
          break;
        case rX:
          j2(e11, t11, n3, l4, r11, i11, s6, o3, a3);
          break;
        default:
          1 & f3 ? T2(e11, t11, n3, l4, r11, i11, s6, o3, a3) : 6 & f3 ? D2(e11, t11, n3, l4, r11, i11, s6, o3, a3) : 64 & f3 ? u3.process(e11, t11, n3, l4, r11, i11, s6, o3, a3, er2) : 128 & f3 && u3.process(e11, t11, n3, l4, r11, i11, s6, o3, a3, er2);
      }
      null != c3 && r11 ? nZ(c3, e11 && e11.ref, i11, t11 || e11, !t11) : null == c3 && e11 && null != e11.ref && nZ(e11.ref, null, i11, e11, true);
    }, C2 = (e11, t11, n3, l4) => {
      if (null == e11) i10(t11.el = u2(t11.children), n3, l4);
      else {
        let n4 = t11.el = e11.el;
        t11.children !== e11.children && f2(n4, t11.children);
      }
    }, x2 = (e11, t11, n3, l4) => {
      null == e11 ? i10(t11.el = c2(t11.children || ""), n3, l4) : t11.el = e11.el;
    }, k2 = (e11, t11, n3, l4) => {
      [e11.el, e11.anchor] = y2(e11.children, t11, n3, l4, e11.el, e11.anchor);
    }, T2 = (e11, t11, n3, l4, r11, i11, s6, o3, a3) => {
      if ("svg" === t11.type ? s6 = "svg" : "math" === t11.type && (s6 = "mathml"), null == e11) A2(t11, n3, l4, r11, i11, s6, o3, a3);
      else {
        let n4 = e11.el && e11.el._isVueCE ? e11.el : null;
        try {
          n4 && n4._beginPatch(), P2(e11, t11, r11, i11, s6, o3, a3);
        } finally {
          n4 && n4._endPatch();
        }
      }
    }, A2 = (e11, t11, n3, l4, r11, s6, u3, c3) => {
      let f3, d3, { props: h3, shapeFlag: g2, transition: v2, dirs: _2 } = e11;
      if (f3 = e11.el = a2(e11.type, s6, h3 && h3.is, h3), 8 & g2 ? p2(f3, e11.children) : 16 & g2 && N2(e11.children, f3, null, l4, r11, rL(e11, s6), u3, c3), _2 && na(e11, null, l4, "created"), O2(f3, e11, e11.scopeId, u3, l4), h3) {
        for (let e12 in h3) "value" === e12 || M(e12) || o2(f3, e12, null, h3[e12], s6, l4);
        "value" in h3 && o2(f3, "value", null, h3.value, s6), (d3 = h3.onVnodeBeforeMount) && iv(d3, l4, e11);
      }
      _2 && na(e11, null, l4, "beforeMount");
      let m3 = rV(r11, v2);
      m3 && v2.beforeEnter(f3), i10(f3, t11, n3), ((d3 = h3 && h3.onVnodeMounted) || m3 || _2) && rP(() => {
        d3 && iv(d3, l4, e11), m3 && v2.enter(f3), _2 && na(e11, null, l4, "mounted");
      }, r11);
    }, O2 = (e11, t11, n3, l4, r11) => {
      if (n3 && m2(e11, n3), l4) for (let t12 = 0; t12 < l4.length; t12++) m2(e11, l4[t12]);
      if (r11) {
        let n4 = r11.subTree;
        if (t11 === n4 || rB(n4.type) && (n4.ssContent === t11 || n4.ssFallback === t11)) {
          let t12 = r11.vnode;
          O2(e11, t12, t12.scopeId, t12.slotScopeIds, r11.parent);
        }
      }
    }, N2 = (e11, t11, n3, l4, r11, i11, s6, o3, a3 = 0) => {
      for (let u3 = a3; u3 < e11.length; u3++) b2(null, e11[u3] = o3 ? id(e11[u3]) : ip(e11[u3]), t11, n3, l4, r11, i11, s6, o3);
    }, P2 = (e11, t11, n3, l4, r11, i11, s6) => {
      let a3, u3 = t11.el = e11.el, { patchFlag: c3, dynamicChildren: f3, dirs: d3 } = t11;
      c3 |= 16 & e11.patchFlag;
      let h3 = e11.props || g, v2 = t11.props || g;
      if (n3 && rj(n3, false), (a3 = v2.onVnodeBeforeUpdate) && iv(a3, n3, t11, e11), d3 && na(t11, e11, n3, "beforeUpdate"), n3 && rj(n3, true), f3 && (!e11.dynamicChildren || e11.dynamicChildren.length !== f3.length) && (c3 = 0, s6 = false, f3 = null), (h3.innerHTML && null == v2.innerHTML || h3.textContent && null == v2.textContent) && p2(u3, ""), f3 ? I2(e11.dynamicChildren, f3, u3, n3, l4, rL(t11, r11), i11) : s6 || K2(e11, t11, u3, null, n3, l4, rL(t11, r11), i11, false), c3 > 0) {
        if (16 & c3) F2(u3, h3, v2, n3, r11);
        else if (2 & c3 && h3.class !== v2.class && o2(u3, "class", null, v2.class, r11), 4 & c3 && o2(u3, "style", h3.style, v2.style, r11), 8 & c3) {
          let e12 = t11.dynamicProps;
          for (let t12 = 0; t12 < e12.length; t12++) {
            let l6 = e12[t12], i12 = h3[l6], s7 = v2[l6];
            (s7 !== i12 || "value" === l6) && o2(u3, l6, i12, s7, r11, n3);
          }
        }
        1 & c3 && e11.children !== t11.children && p2(u3, t11.children);
      } else s6 || null != f3 || F2(u3, h3, v2, n3, r11);
      ((a3 = v2.onVnodeUpdated) || d3) && rP(() => {
        a3 && iv(a3, n3, t11, e11), d3 && na(t11, e11, n3, "updated");
      }, l4);
    }, I2 = (e11, t11, n3, l4, r11, i11, s6) => {
      for (let o3 = 0; o3 < t11.length; o3++) {
        let a3 = e11[o3], u3 = t11[o3], c3 = a3.el && (a3.type === rX || !r7(a3, u3) || 198 & a3.shapeFlag) ? d2(a3.el) : n3;
        b2(a3, u3, c3, null, l4, r11, i11, s6, true);
      }
    }, F2 = (e11, t11, n3, l4, r11) => {
      if (t11 !== n3) {
        if (t11 !== g) for (let i11 in t11) M(i11) || i11 in n3 || o2(e11, i11, t11[i11], null, r11, l4);
        for (let i11 in n3) {
          if (M(i11)) continue;
          let s6 = n3[i11], a3 = t11[i11];
          s6 !== a3 && "value" !== i11 && o2(e11, i11, a3, s6, r11, l4);
        }
        "value" in n3 && o2(e11, "value", t11.value, n3.value, r11);
      }
    }, j2 = (e11, t11, n3, l4, r11, s6, o3, a3, c3) => {
      let f3 = t11.el = e11 ? e11.el : u2(""), p3 = t11.anchor = e11 ? e11.anchor : u2(""), { patchFlag: d3, dynamicChildren: h3, slotScopeIds: g2 } = t11;
      g2 && (a3 = a3 ? a3.concat(g2) : g2), null == e11 ? (i10(f3, n3, l4), i10(p3, n3, l4), N2(t11.children || [], n3, p3, r11, s6, o3, a3, c3)) : d3 > 0 && 64 & d3 && h3 && e11.dynamicChildren && e11.dynamicChildren.length === h3.length ? (I2(e11.dynamicChildren, h3, n3, r11, s6, o3, a3), (null != t11.key || r11 && t11 === r11.subTree) && rD(e11, t11, true)) : K2(e11, t11, n3, p3, r11, s6, o3, a3, c3);
    }, D2 = (e11, t11, n3, l4, r11, i11, s6, o3, a3) => {
      t11.slotScopeIds = o3, null == e11 ? 512 & t11.shapeFlag ? r11.ctx.activate(t11, n3, l4, s6, a3) : U2(t11, n3, l4, r11, i11, s6, a3) : B2(e11, t11, a3);
    }, U2 = (e11, t11, n3, l4, r11, i11, s6) => {
      let o3 = e11.component = iy(e11, l4, r11);
      if (la(e11) && (o3.ctx.renderer = er2), iE(o3, false, s6), o3.asyncDep) {
        if (r11 && r11.registerDep(o3, H2, s6), !e11.el) {
          let l6 = o3.subTree = ii(rZ);
          x2(null, l6, t11, n3), e11.placeholder = l6.el;
        }
      } else H2(o3, e11, t11, n3, r11, i11, s6);
    }, B2 = (e11, t11, n3) => {
      let l4 = t11.component = e11.component;
      if ((function(e12, t12, n4) {
        let { props: l6, children: r11, component: i11 } = e12, { props: s6, children: o3, patchFlag: a3 } = t12, u3 = i11.emitsOptions;
        if (t12.dirs || t12.transition) return true;
        if (!n4 || !(a3 >= 0)) return (!!r11 || !!o3) && (!o3 || !o3.$stable) || l6 !== s6 && (l6 ? !s6 || r_(l6, s6, u3) : !!s6);
        if (1024 & a3) return true;
        if (16 & a3) return l6 ? r_(l6, s6, u3) : !!s6;
        if (8 & a3) {
          let e13 = t12.dynamicProps;
          for (let t13 = 0; t13 < e13.length; t13++) {
            let n5 = e13[t13];
            if (rm(s6, l6, n5) && !rd(u3, n5)) return true;
          }
        }
        return false;
      })(e11, t11, n3)) if (l4.asyncDep && !l4.asyncResolved) {
        t11.el = e11.el, W2(l4, t11, n3);
        return;
      } else l4.next = t11, l4.update();
      else t11.el = e11.el, l4.vnode = t11;
    }, H2 = (e11, t11, n3, l4, i11, s6, o3) => {
      e11.scope.on();
      let a3 = e11.effect = new ev(() => {
        if (e11.isMounted) {
          let t12, { next: n4, bu: l6, u: r11, parent: a4, vnode: c4 } = e11;
          {
            let t13 = (function e12(t14) {
              let n5 = t14.subTree.component;
              if (n5) if (n5.asyncDep && !n5.asyncResolved) return n5;
              else return e12(n5);
            })(e11);
            if (t13) {
              n4 && (n4.el = c4.el, W2(e11, n4, o3)), t13.asyncDep.then(() => {
                rP(() => {
                  e11.isUnmounted || u3();
                }, i11);
              });
              return;
            }
          }
          let f3 = n4;
          rj(e11, false), n4 ? (n4.el = c4.el, W2(e11, n4, o3)) : n4 = c4, l6 && $(l6), (t12 = n4.props && n4.props.onVnodeBeforeUpdate) && iv(t12, a4, n4, c4), rj(e11, true);
          let p3 = rh(e11), h3 = e11.subTree;
          e11.subTree = p3, b2(h3, p3, d2(h3.el), et2(h3), e11, i11, s6), n4.el = p3.el, null === f3 && ry(e11, p3.el), r11 && rP(r11, i11), (t12 = n4.props && n4.props.onVnodeUpdated) && rP(() => iv(t12, a4, n4, c4), i11);
        } else {
          let o4, { el: a4, props: u4 } = t11, { bm: c4, m: f3, parent: p3, root: d3, type: h3 } = e11, g2 = li(t11);
          if (rj(e11, false), c4 && $(c4), !g2 && (o4 = u4 && u4.onVnodeBeforeMount) && iv(o4, p3, t11), rj(e11, true), a4 && r10) {
            let t12 = () => {
              e11.subTree = rh(e11), r10(a4, e11.subTree, e11, i11, null);
            };
            g2 && h3.__asyncHydrate ? h3.__asyncHydrate(a4, e11, t12) : t12();
          } else {
            d3.ce && d3.ce._hasShadowRoot() && d3.ce._injectChildStyle(h3, e11.parent ? e11.parent.type : void 0);
            let r11 = e11.subTree = rh(e11);
            b2(null, r11, n3, l4, e11, i11, s6), t11.el = r11.el;
          }
          if (f3 && rP(f3, i11), !g2 && (o4 = u4 && u4.onVnodeMounted)) {
            let e12 = t11;
            rP(() => iv(o4, p3, e12), i11);
          }
          (256 & t11.shapeFlag || p3 && li(p3.vnode) && 256 & p3.vnode.shapeFlag) && e11.a && rP(e11.a, i11), e11.isMounted = true, t11 = n3 = l4 = null;
        }
      });
      e11.scope.off();
      let u3 = e11.update = a3.run.bind(a3), c3 = e11.job = a3.runIfDirty.bind(a3);
      c3.i = e11, c3.id = e11.uid, a3.scheduler = () => t8(c3), rj(e11, true), u3();
    }, W2 = (e11, t11, n3) => {
      t11.component = e11;
      let l4 = e11.vnode.props;
      e11.vnode = t11, e11.next = null, (function(e12, t12, n4, l6) {
        let { props: r11, attrs: i11, vnode: { patchFlag: s6 } } = e12, o3 = t_(r11), [a3] = e12.propsOptions, u3 = false;
        if ((l6 || s6 > 0) && !(16 & s6)) {
          if (8 & s6) {
            let n5 = e12.vnode.dynamicProps;
            for (let l8 = 0; l8 < n5.length; l8++) {
              let s7 = n5[l8];
              if (rd(e12.emitsOptions, s7)) continue;
              let c3 = t12[s7];
              if (a3) if (w(i11, s7)) c3 !== i11[s7] && (i11[s7] = c3, u3 = true);
              else {
                let t13 = L(s7);
                r11[t13] = rx(a3, o3, t13, c3, e12, false);
              }
              else c3 !== i11[s7] && (i11[s7] = c3, u3 = true);
            }
          }
        } else {
          let l8;
          for (let s7 in rC(e12, t12, r11, i11) && (u3 = true), o3) t12 && (w(t12, s7) || (l8 = V(s7)) !== s7 && w(t12, l8)) || (a3 ? n4 && (void 0 !== n4[s7] || void 0 !== n4[l8]) && (r11[s7] = rx(a3, o3, s7, void 0, e12, true)) : delete r11[s7]);
          if (i11 !== o3) for (let e13 in i11) t12 && w(t12, e13) || (delete i11[e13], u3 = true);
        }
        u3 && eU(e12.attrs, "set", "");
      })(e11, t11.props, l4, n3), ((e12, t12, n4) => {
        let { vnode: l6, slots: r11 } = e12, i11 = true, s6 = g;
        if (32 & l6.shapeFlag) {
          let e13 = t12._;
          e13 ? n4 && 1 === e13 ? i11 = false : rN(r11, t12, n4) : (i11 = !t12.$stable, rR(t12, r11)), s6 = t12;
        } else t12 && (rO(e12, t12), s6 = { default: 1 });
        if (i11) for (let e13 in r11) rE(e13) || null != s6[e13] || delete r11[e13];
      })(e11, t11.children, n3), eR(), t5(e11), eO();
    }, K2 = (e11, t11, n3, l4, r11, i11, s6, o3, a3 = false) => {
      let u3 = e11 && e11.children, c3 = e11 ? e11.shapeFlag : 0, f3 = t11.children, { patchFlag: d3, shapeFlag: h3 } = t11;
      if (d3 > 0) {
        if (128 & d3) return void G2(u3, f3, n3, l4, r11, i11, s6, o3, a3);
        else if (256 & d3) return void q2(u3, f3, n3, l4, r11, i11, s6, o3, a3);
      }
      8 & h3 ? (16 & c3 && ee2(u3, r11, i11), f3 !== u3 && p2(n3, f3)) : 16 & c3 ? 16 & h3 ? G2(u3, f3, n3, l4, r11, i11, s6, o3, a3) : ee2(u3, r11, i11, true) : (8 & c3 && p2(n3, ""), 16 & h3 && N2(f3, n3, l4, r11, i11, s6, o3, a3));
    }, q2 = (e11, t11, n3, l4, r11, i11, s6, o3, a3) => {
      let u3;
      e11 = e11 || v, t11 = t11 || v;
      let c3 = e11.length, f3 = t11.length, p3 = Math.min(c3, f3);
      for (u3 = 0; u3 < p3; u3++) {
        let l6 = t11[u3] = a3 ? id(t11[u3]) : ip(t11[u3]);
        b2(e11[u3], l6, n3, null, r11, i11, s6, o3, a3);
      }
      c3 > f3 ? ee2(e11, r11, i11, true, false, p3) : N2(t11, n3, l4, r11, i11, s6, o3, a3, p3);
    }, G2 = (e11, t11, n3, l4, r11, i11, s6, o3, a3) => {
      let u3 = 0, c3 = t11.length, f3 = e11.length - 1, p3 = c3 - 1;
      for (; u3 <= f3 && u3 <= p3; ) {
        let l6 = e11[u3], c4 = t11[u3] = a3 ? id(t11[u3]) : ip(t11[u3]);
        if (r7(l6, c4)) b2(l6, c4, n3, null, r11, i11, s6, o3, a3);
        else break;
        u3++;
      }
      for (; u3 <= f3 && u3 <= p3; ) {
        let l6 = e11[f3], u4 = t11[p3] = a3 ? id(t11[p3]) : ip(t11[p3]);
        if (r7(l6, u4)) b2(l6, u4, n3, null, r11, i11, s6, o3, a3);
        else break;
        f3--, p3--;
      }
      if (u3 > f3) {
        if (u3 <= p3) {
          let e12 = p3 + 1, f4 = e12 < c3 ? t11[e12].el : l4;
          for (; u3 <= p3; ) b2(null, t11[u3] = a3 ? id(t11[u3]) : ip(t11[u3]), n3, f4, r11, i11, s6, o3, a3), u3++;
        }
      } else if (u3 > p3) for (; u3 <= f3; ) J2(e11[u3], r11, i11, true), u3++;
      else {
        let d3, h3 = u3, g2 = u3, _2 = /* @__PURE__ */ new Map();
        for (u3 = g2; u3 <= p3; u3++) {
          let e12 = t11[u3] = a3 ? id(t11[u3]) : ip(t11[u3]);
          null != e12.key && _2.set(e12.key, u3);
        }
        let m3 = 0, y3 = p3 - g2 + 1, S2 = false, C3 = 0, x3 = Array(y3);
        for (u3 = 0; u3 < y3; u3++) x3[u3] = 0;
        for (u3 = h3; u3 <= f3; u3++) {
          let l6, c4 = e11[u3];
          if (m3 >= y3) {
            J2(c4, r11, i11, true);
            continue;
          }
          if (null != c4.key) l6 = _2.get(c4.key);
          else for (d3 = g2; d3 <= p3; d3++) if (0 === x3[d3 - g2] && r7(c4, t11[d3])) {
            l6 = d3;
            break;
          }
          void 0 === l6 ? J2(c4, r11, i11, true) : (x3[l6 - g2] = u3 + 1, l6 >= C3 ? C3 = l6 : S2 = true, b2(c4, t11[l6], n3, null, r11, i11, s6, o3, a3), m3++);
        }
        let w2 = S2 ? (function(e12) {
          let t12, n4, l6, r12, i12, s7 = e12.slice(), o4 = [0], a4 = e12.length;
          for (t12 = 0; t12 < a4; t12++) {
            let a5 = e12[t12];
            if (0 !== a5) {
              if (e12[n4 = o4[o4.length - 1]] < a5) {
                s7[t12] = n4, o4.push(t12);
                continue;
              }
              for (l6 = 0, r12 = o4.length - 1; l6 < r12; ) e12[o4[i12 = l6 + r12 >> 1]] < a5 ? l6 = i12 + 1 : r12 = i12;
              a5 < e12[o4[l6]] && (l6 > 0 && (s7[t12] = o4[l6 - 1]), o4[l6] = t12);
            }
          }
          for (l6 = o4.length, r12 = o4[l6 - 1]; l6-- > 0; ) o4[l6] = r12, r12 = s7[r12];
          return o4;
        })(x3) : v;
        for (d3 = w2.length - 1, u3 = y3 - 1; u3 >= 0; u3--) {
          let e12 = g2 + u3, f4 = t11[e12], p4 = t11[e12 + 1], h4 = e12 + 1 < c3 ? p4.el || (function e13(t12) {
            if (t12.placeholder) return t12.placeholder;
            let n4 = t12.component;
            return n4 ? e13(n4.subTree) : null;
          })(p4) : l4;
          0 === x3[u3] ? b2(null, f4, n3, h4, r11, i11, s6, o3, a3) : S2 && (d3 < 0 || u3 !== w2[d3] ? X2(f4, n3, h4, 2) : d3--);
        }
      }
    }, X2 = (e11, t11, n3, l4, r11 = null) => {
      let { el: o3, type: a3, transition: u3, children: c3, shapeFlag: f3 } = e11;
      if (6 & f3) return void X2(e11.component.subTree, t11, n3, l4);
      if (128 & f3) return void e11.suspense.move(t11, n3, l4);
      if (64 & f3) return void a3.move(e11, t11, n3, er2);
      if (a3 === rX) {
        i10(o3, t11, n3);
        for (let e12 = 0; e12 < c3.length; e12++) X2(c3[e12], t11, n3, l4);
        i10(e11.anchor, t11, n3);
        return;
      }
      if (a3 === rY) return void (({ el: e12, anchor: t12 }, n4, l6) => {
        let r12;
        for (; e12 && e12 !== t12; ) r12 = h2(e12), i10(e12, n4, l6), e12 = r12;
        i10(t12, n4, l6);
      })(e11, t11, n3);
      if (2 !== l4 && 1 & f3 && u3) if (0 === l4) u3.persisted && !o3[nN] ? i10(o3, t11, n3) : (u3.beforeEnter(o3), i10(o3, t11, n3), rP(() => u3.enter(o3), r11));
      else {
        let { leave: l6, delayLeave: r12, afterLeave: a4 } = u3, c4 = () => {
          e11.ctx.isUnmounted ? s4(o3) : i10(o3, t11, n3);
        }, f4 = () => {
          let e12 = o3._isLeaving || !!o3[nN];
          o3._isLeaving && o3[nN](true), u3.persisted && !e12 ? c4() : l6(o3, () => {
            c4(), a4 && a4();
          });
        };
        r12 ? r12(o3, c4, f4) : f4();
      }
      else i10(o3, t11, n3);
    }, J2 = (e11, t11, n3, l4 = false, r11 = false) => {
      let i11, { type: s6, props: o3, ref: a3, children: u3, dynamicChildren: c3, shapeFlag: f3, patchFlag: p3, dirs: d3, cacheIndex: h3, memo: g2 } = e11;
      if ((-2 === p3 || c3 && c3.hasOnce) && (r11 = false), null != a3 && (eR(), nZ(a3, null, n3, e11, true), eO()), null == h3 || e11.ctx && e11.ctx !== t11 || (t11.renderCache[h3] = void 0), 256 & f3) return void t11.ctx.deactivate(e11);
      let v2 = 1 & f3 && d3, _2 = !li(e11);
      if (_2 && (i11 = o3 && o3.onVnodeBeforeUnmount) && iv(i11, t11, e11), 6 & f3) Q(e11.component, n3, l4);
      else {
        if (128 & f3) return void e11.suspense.unmount(n3, l4);
        v2 && na(e11, null, t11, "beforeUnmount"), 64 & f3 ? e11.type.remove(e11, t11, n3, er2, l4) : c3 && !c3.hasOnce && (s6 !== rX || p3 > 0 && 64 & p3) ? ee2(c3, t11, n3, false, true) : (s6 === rX && 384 & p3 || !r11 && 16 & f3) && ee2(u3, t11, n3), l4 && Z2(e11);
      }
      let m3 = null != g2 && null == h3;
      (_2 && (i11 = o3 && o3.onVnodeUnmounted) || v2 || m3) && rP(() => {
        i11 && iv(i11, t11, e11), v2 && na(e11, null, t11, "unmounted"), m3 && (e11.el = null);
      }, n3);
    }, Z2 = (e11) => {
      let { type: t11, el: n3, anchor: l4, transition: r11 } = e11;
      if (t11 === rX) return void Y2(n3, l4);
      if (t11 === rY) {
        (({ el: e12, anchor: t12 }) => {
          let n4;
          for (; e12 && e12 !== t12; ) n4 = h2(e12), s4(e12), e12 = n4;
          s4(t12);
        })(e11), r11 && !r11.persisted && r11.afterLeave && r11.afterLeave();
        return;
      }
      let i11 = () => {
        s4(n3), r11 && !r11.persisted && r11.afterLeave && r11.afterLeave();
      };
      if (1 & e11.shapeFlag && r11 && !r11.persisted) {
        let { leave: t12, delayLeave: l6 } = r11, s6 = () => t12(n3, i11);
        l6 ? l6(e11.el, i11, s6) : s6();
      } else i11();
    }, Y2 = (e11, t11) => {
      let n3;
      for (; e11 !== t11; ) n3 = h2(e11), s4(e11), e11 = n3;
      s4(t11);
    }, Q = (e11, t11, n3) => {
      let { bum: l4, scope: r11, job: i11, subTree: s6, um: o3, m: a3, a: u3 } = e11;
      rU(a3), rU(u3), l4 && $(l4), r11.stop(), i11 ? (i11.flags |= 8, J2(s6, e11, t11, n3)) : e11.vnode.el && s6 && (s6.transition = e11.vnode.transition, J2(s6, e11, t11, n3)), o3 && rP(o3, t11), rP(() => {
        e11.isUnmounted = true;
      }, t11);
    }, ee2 = (e11, t11, n3, l4 = false, r11 = false, i11 = 0) => {
      for (let s6 = i11; s6 < e11.length; s6++) J2(e11[s6], t11, n3, l4, r11);
    }, et2 = (e11) => {
      if (6 & e11.shapeFlag) return et2(e11.component.subTree);
      if (128 & e11.shapeFlag) return e11.suspense.next();
      let t11 = h2(e11.anchor || e11.el), n3 = t11 && t11[nC];
      return n3 ? h2(n3) : t11;
    }, en2 = false, el2 = (e11, t11, n3) => {
      let l4;
      null == e11 ? t11._vnode && (J2(t11._vnode, null, null, true), l4 = t11._vnode.component) : b2(t11._vnode || null, e11, t11, null, null, null, n3), t11._vnode = e11, en2 || (en2 = true, t5(l4), t9(), en2 = false);
    }, er2 = { p: b2, um: J2, m: X2, r: Z2, mt: U2, mc: N2, pc: K2, pbc: I2, n: et2, o: e10 };
    return t10 && ([l2, r10] = t10(er2)), { render: el2, hydrate: l2, createApp: (n2 = l2, function(e11, t11 = null) {
      E(e11) || (e11 = S({}, e11)), null == t11 || R(t11) || (t11 = null);
      let l4 = rs(), r11 = /* @__PURE__ */ new WeakSet(), i11 = [], s6 = false, o3 = l4.app = { _uid: ro++, _component: e11, _props: t11, _container: null, _context: l4, _instance: null, version: iU, get config() {
        return l4.config;
      }, set config(e12) {
      }, use: (e12, ...t12) => (r11.has(e12) || (e12 && E(e12.install) ? (r11.add(e12), e12.install(o3, ...t12)) : E(e12) && (r11.add(e12), e12(o3, ...t12))), o3), mixin: (e12) => (l4.mixins.includes(e12) || l4.mixins.push(e12), o3), component: (e12, t12) => t12 ? (l4.components[e12] = t12, o3) : l4.components[e12], directive: (e12, t12) => t12 ? (l4.directives[e12] = t12, o3) : l4.directives[e12], mount(r12, i12, a3) {
        if (!s6) {
          let u3 = o3._ceVNode || ii(e11, t11);
          return u3.appContext = l4, true === a3 ? a3 = "svg" : false === a3 && (a3 = void 0), i12 && n2 ? n2(u3, r12) : el2(u3, r12, a3), s6 = true, o3._container = r12, r12.__vue_app__ = o3, iM(u3.component);
        }
      }, onUnmount(e12) {
        i11.push(e12);
      }, unmount() {
        s6 && (tG(i11, o3._instance, 16), el2(null, o3._container), delete o3._container.__vue_app__);
      }, provide: (e12, t12) => (l4.provides[e12] = t12, o3), runWithContext(e12) {
        let t12 = ra;
        ra = o3;
        try {
          return e12();
        } finally {
          ra = t12;
        }
      } };
      return o3;
    }) };
  }
  function rL({ type: e10, props: t10 }, n2) {
    return "svg" === n2 && "foreignObject" === e10 || "mathml" === n2 && "annotation-xml" === e10 && t10 && t10.encoding && t10.encoding.includes("html") ? void 0 : n2;
  }
  function rj({ effect: e10, job: t10 }, n2) {
    n2 ? (e10.flags |= 32, t10.flags |= 4) : (e10.flags &= -33, t10.flags &= -5);
  }
  function rV(e10, t10) {
    return (!e10 || e10 && !e10.pendingBranch) && t10 && !t10.persisted;
  }
  function rD(e10, t10, n2 = false) {
    let l2 = e10.children, r10 = t10.children;
    if (k(l2) && k(r10)) for (let e11 = 0; e11 < l2.length; e11++) {
      let t11 = l2[e11], i10 = r10[e11];
      1 & i10.shapeFlag && !i10.dynamicChildren && ((i10.patchFlag <= 0 || 32 === i10.patchFlag) && ((i10 = r10[e11] = id(r10[e11])).el = t11.el), n2 || -2 === i10.patchFlag || rD(t11, i10)), i10.type === rJ && (-1 === i10.patchFlag && (i10 = r10[e11] = id(i10)), i10.el = t11.el), i10.type !== rZ || i10.el || (i10.el = t11.el);
    }
  }
  function rU(e10) {
    if (e10) for (let t10 = 0; t10 < e10.length; t10++) e10[t10].flags |= 8;
  }
  var rB = (e10) => e10.__isSuspense;
  function rq(e10, t10) {
    t10 && t10.pendingBranch ? k(e10) ? t10.effects.push(...e10) : t10.effects.push(e10) : t3(e10);
  }
  var rX = /* @__PURE__ */ Symbol.for("v-fgt");
  var rJ = /* @__PURE__ */ Symbol.for("v-txt");
  var rZ = /* @__PURE__ */ Symbol.for("v-cmt");
  var rY = /* @__PURE__ */ Symbol.for("v-stc");
  var rQ = [];
  var r0 = null;
  function r1(e10 = false) {
    rQ.push(r0 = e10 ? null : []);
  }
  function r2() {
    rQ.pop(), r0 = rQ[rQ.length - 1] || null;
  }
  var r6 = 1;
  function r8(e10, t10 = false) {
    r6 += e10, e10 < 0 && r0 && t10 && (r0.hasOnce = true);
  }
  function r4(e10) {
    return e10.dynamicChildren = r6 > 0 ? r0 || v : null, r2(), r6 > 0 && r0 && r0.push(e10), e10;
  }
  function r3(e10, t10, n2, l2, r10, i10) {
    return r4(ir(e10, t10, n2, l2, r10, i10, true));
  }
  function r5(e10, t10, n2, l2, r10) {
    return r4(ii(e10, t10, n2, l2, r10, true));
  }
  function r9(e10) {
    return !!e10 && true === e10.__v_isVNode;
  }
  function r7(e10, t10) {
    return e10.type === t10.type && e10.key === t10.key;
  }
  var it = ({ key: e10 }) => null != e10 ? e10 : null;
  var il = ({ ref: e10, ref_key: t10, ref_for: n2 }) => ("number" == typeof e10 && (e10 = "" + e10), null != e10 ? T(e10) || tS(e10) || E(e10) ? { i: ne, r: e10, k: t10, f: !!n2 } : e10 : null);
  function ir(e10, t10 = null, n2 = null, l2 = 0, r10 = null, i10 = +(e10 !== rX), s4 = false, o2 = false) {
    let a2 = { __v_isVNode: true, __v_skip: true, type: e10, props: t10, key: t10 && it(t10), ref: t10 && il(t10), scopeId: nt, slotScopeIds: null, children: n2, component: null, suspense: null, ssContent: null, ssFallback: null, dirs: null, transition: null, el: null, anchor: null, target: null, targetStart: null, targetAnchor: null, staticCount: 0, shapeFlag: i10, patchFlag: l2, dynamicProps: r10, dynamicChildren: null, appContext: null, ctx: ne };
    return o2 ? (ih(a2, n2), 128 & i10 && e10.normalize(a2)) : n2 && (a2.shapeFlag |= T(n2) ? 8 : 16), r6 > 0 && !s4 && r0 && (a2.patchFlag > 0 || 6 & i10) && 32 !== a2.patchFlag && r0.push(a2), a2;
  }
  var ii = function(e10, t10 = null, n2 = null, l2 = 0, r10 = null, i10 = false) {
    var s4;
    if (e10 && e10 !== lO || (e10 = rZ), r9(e10)) {
      let l4 = io(e10, t10, true);
      return n2 && ih(l4, n2), r6 > 0 && !i10 && r0 && (6 & l4.shapeFlag ? r0[r0.indexOf(e10)] = l4 : r0.push(l4)), l4.patchFlag = -2, l4;
    }
    if (E(s4 = e10) && "__vccOpts" in s4 && (e10 = e10.__vccOpts), t10) {
      let { class: e11, style: n3 } = t10 = is(t10);
      e11 && !T(e11) && (t10.class = Y(e11)), R(n3) && (tv(n3) && !k(n3) && (n3 = S({}, n3)), t10.style = G(n3));
    }
    let o2 = T(e10) ? 1 : rB(e10) ? 128 : e10.__isTeleport ? 64 : R(e10) ? 4 : 2 * !!E(e10);
    return ir(e10, t10, n2, l2, r10, o2, i10, true);
  };
  function is(e10) {
    return e10 ? tv(e10) || rS(e10) ? S({}, e10) : e10 : null;
  }
  function io(e10, t10, n2 = false, l2 = false) {
    let { props: r10, ref: i10, patchFlag: s4, children: o2, transition: a2 } = e10, u2 = t10 ? ig(r10 || {}, t10) : r10, c2 = { __v_isVNode: true, __v_skip: true, type: e10.type, props: u2, key: u2 && it(u2), ref: t10 && t10.ref ? n2 && i10 ? k(i10) ? i10.concat(il(t10)) : [i10, il(t10)] : il(t10) : i10, scopeId: e10.scopeId, slotScopeIds: e10.slotScopeIds, children: o2, target: e10.target, targetStart: e10.targetStart, targetAnchor: e10.targetAnchor, staticCount: e10.staticCount, shapeFlag: e10.shapeFlag, patchFlag: t10 && e10.type !== rX ? -1 === s4 ? 16 : 16 | s4 : s4, dynamicProps: e10.dynamicProps, dynamicChildren: e10.dynamicChildren, appContext: e10.appContext, dirs: e10.dirs, transition: a2, component: e10.component, suspense: e10.suspense, ssContent: e10.ssContent && io(e10.ssContent), ssFallback: e10.ssFallback && io(e10.ssFallback), placeholder: e10.placeholder, el: e10.el, anchor: e10.anchor, ctx: e10.ctx, ce: e10.ce, cacheIndex: e10.cacheIndex };
    return a2 && l2 && nH(c2, a2.clone(c2)), c2;
  }
  function ia(e10 = " ", t10 = 0) {
    return ii(rJ, null, e10, t10);
  }
  function ic(e10 = "", t10 = false) {
    return t10 ? (r1(), r5(rZ, null, e10)) : ii(rZ, null, e10);
  }
  function ip(e10) {
    return null == e10 || "boolean" == typeof e10 ? ii(rZ) : k(e10) ? ii(rX, null, e10.slice()) : r9(e10) ? id(e10) : ii(rJ, null, String(e10));
  }
  function id(e10) {
    return null === e10.el && -1 !== e10.patchFlag || e10.memo ? e10 : io(e10);
  }
  function ih(e10, t10) {
    let n2 = 0, { shapeFlag: l2 } = e10;
    if (null == t10) t10 = null;
    else if (k(t10)) n2 = 16;
    else if ("object" == typeof t10) if (65 & l2) {
      let n3 = t10.default;
      n3 && (n3._c && (n3._d = false), ih(e10, n3()), n3._c && (n3._d = true));
      return;
    } else {
      n2 = 32;
      let l4 = t10._;
      l4 || rS(t10) ? 3 === l4 && ne && (1 === ne.slots._ ? t10._ = 1 : (t10._ = 2, e10.patchFlag |= 1024)) : t10._ctx = ne;
    }
    else if (E(t10)) {
      if (65 & l2) return void ih(e10, { default: t10 });
      t10 = { default: t10, _ctx: ne }, n2 = 32;
    } else t10 = String(t10), 64 & l2 ? (n2 = 16, t10 = [ia(t10)]) : n2 = 8;
    e10.children = t10, e10.shapeFlag |= n2;
  }
  function ig(...e10) {
    let t10 = {};
    for (let n2 = 0; n2 < e10.length; n2++) {
      let l2 = e10[n2];
      for (let e11 in l2) if ("class" === e11) t10.class !== l2.class && (t10.class = Y([t10.class, l2.class]));
      else if ("style" === e11) t10.style = G([t10.style, l2.style]);
      else if (y(e11)) {
        let n3 = t10[e11], r10 = l2[e11];
        r10 && n3 !== r10 && !(k(n3) && n3.includes(r10)) ? t10[e11] = n3 ? [].concat(n3, r10) : r10 : null != r10 || null != n3 || b(e11) || (t10[e11] = r10);
      } else "" !== e11 && (t10[e11] = l2[e11]);
    }
    return t10;
  }
  function iv(e10, t10, n2, l2 = null) {
    tG(e10, t10, 7, [n2, l2]);
  }
  var i_ = rs();
  var im = 0;
  function iy(e10, t10, n2) {
    let l2 = e10.type, r10 = (t10 ? t10.appContext : e10.appContext) || i_, i10 = { uid: im++, vnode: e10, type: l2, parent: t10, appContext: r10, root: null, next: null, subTree: null, effect: null, update: null, job: null, scope: new ef(true), render: null, proxy: null, exposed: null, exposeProxy: null, withProxy: null, provides: t10 ? t10.provides : Object.create(r10.provides), ids: t10 ? t10.ids : ["", 0, 0], accessCache: null, renderCache: [], components: null, directives: null, propsOptions: (function e11(t11, n3, l4 = false) {
      let r11 = l4 ? rw : n3.propsCache, i11 = r11.get(t11);
      if (i11) return i11;
      let s4 = t11.props, o2 = {}, a2 = [], u2 = false;
      if (!E(t11)) {
        let r12 = (t12) => {
          u2 = true;
          let [l6, r13] = e11(t12, n3, true);
          S(o2, l6), r13 && a2.push(...r13);
        };
        !l4 && n3.mixins.length && n3.mixins.forEach(r12), t11.extends && r12(t11.extends), t11.mixins && t11.mixins.forEach(r12);
      }
      if (!s4 && !u2) return R(t11) && r11.set(t11, v), v;
      if (k(s4)) for (let e12 = 0; e12 < s4.length; e12++) {
        let t12 = L(s4[e12]);
        rk(t12) && (o2[t12] = g);
      }
      else if (s4) for (let e12 in s4) {
        let t12 = L(e12);
        if (rk(t12)) {
          let n4 = s4[e12], l6 = o2[t12] = k(n4) || E(n4) ? { type: n4 } : S({}, n4), r12 = l6.type, i12 = false, u3 = true;
          if (k(r12)) for (let e13 = 0; e13 < r12.length; ++e13) {
            let t13 = r12[e13], n5 = E(t13) && t13.name;
            if ("Boolean" === n5) {
              i12 = true;
              break;
            }
            "String" === n5 && (u3 = false);
          }
          else i12 = E(r12) && "Boolean" === r12.name;
          l6[0] = i12, l6[1] = u3, (i12 || w(l6, "default")) && a2.push(t12);
        }
      }
      let c2 = [o2, a2];
      return R(t11) && r11.set(t11, c2), c2;
    })(l2, r10), emitsOptions: (function e11(t11, n3, l4 = false) {
      let r11 = l4 ? rp : n3.emitsCache, i11 = r11.get(t11);
      if (void 0 !== i11) return i11;
      let s4 = t11.emits, o2 = {}, a2 = false;
      if (!E(t11)) {
        let r12 = (t12) => {
          let l6 = e11(t12, n3, true);
          l6 && (a2 = true, S(o2, l6));
        };
        !l4 && n3.mixins.length && n3.mixins.forEach(r12), t11.extends && r12(t11.extends), t11.mixins && t11.mixins.forEach(r12);
      }
      return s4 || a2 ? (k(s4) ? s4.forEach((e12) => o2[e12] = null) : S(o2, s4), R(t11) && r11.set(t11, o2), o2) : (R(t11) && r11.set(t11, null), null);
    })(l2, r10), emit: null, emitted: null, propsDefaults: g, inheritAttrs: l2.inheritAttrs, ctx: g, data: g, props: g, attrs: g, slots: g, refs: g, setupState: g, setupContext: null, suspense: n2, suspenseId: n2 ? n2.pendingId : 0, asyncDep: null, asyncResolved: false, isMounted: false, isUnmounted: false, isDeactivated: false, bc: null, c: null, bm: null, m: null, bu: null, u: null, um: null, bum: null, da: null, a: null, rtg: null, rtc: null, ec: null, sp: null };
    return i10.ctx = { _: i10 }, i10.root = t10 ? t10.root : i10, i10.emit = rf.bind(null, i10), e10.ce && e10.ce(i10), i10;
  }
  var ib = null;
  var iS = () => ib || ne;
  {
    let e10 = z(), t10 = (t11, n2) => {
      let l2;
      return (l2 = e10[t11]) || (l2 = e10[t11] = []), l2.push(n2), (e11) => {
        l2.length > 1 ? l2.forEach((t12) => t12(e11)) : l2[0](e11);
      };
    };
    o = t10("__VUE_INSTANCE_SETTERS__", (e11) => ib = e11), a = t10("__VUE_SSR_SETTERS__", (e11) => ik = e11);
  }
  var iC = (e10) => {
    let t10 = ib;
    return o(e10), e10.scope.on(), () => {
      e10.scope.off(), o(t10);
    };
  };
  var ix = () => {
    ib && ib.scope.off(), o(null);
  };
  function iw(e10) {
    return 4 & e10.vnode.shapeFlag;
  }
  var ik = false;
  function iE(e10, t10 = false, n2 = false) {
    t10 && a(t10);
    let { props: l2, children: r10 } = e10.vnode, i10 = iw(e10);
    !(function(e11, t11, n3, l4 = false) {
      let r11 = {}, i11 = Object.create(rb);
      for (let n4 in e11.propsDefaults = /* @__PURE__ */ Object.create(null), rC(e11, t11, r11, i11), e11.propsOptions[0]) n4 in r11 || (r11[n4] = void 0);
      n3 ? e11.props = l4 ? r11 : tu(r11) : e11.type.props ? e11.props = r11 : e11.props = i11, e11.attrs = i11;
    })(e10, l2, i10, t10);
    var s4 = n2 || t10;
    let o2 = e10.slots = Object.create(rb);
    if (32 & e10.vnode.shapeFlag) {
      let e11 = r10._;
      e11 ? (rN(o2, r10, s4), s4 && H(o2, "_", e11, true)) : rR(r10, o2);
    } else r10 && rO(e10, r10);
    let u2 = i10 ? (function(e11, t11) {
      let n3 = e11.type;
      e11.accessCache = /* @__PURE__ */ Object.create(null), e11.proxy = new Proxy(e11.ctx, lH);
      let { setup: l4 } = n3;
      if (l4) {
        eR();
        let n4 = e11.setupContext = l4.length > 1 ? iP(e11) : null, r11 = iC(e11), i11 = tq(l4, e11, 0, [e11.props, n4]), s6 = O(i11);
        if (eO(), r11(), (s6 || e11.sp) && !li(e11) && nq(e11), s6) {
          if (i11.then(ix, ix), t11) return i11.then((n5) => {
            a(true);
            try {
              iT(e11, n5, t11);
            } finally {
              a(false);
            }
          }).catch((t12) => {
            tX(t12, e11, 0);
          });
          e11.asyncDep = i11;
        } else iT(e11, i11, t11);
      } else iO(e11, t11);
    })(e10, t10) : void 0;
    return t10 && a(false), u2;
  }
  function iT(e10, t10, n2) {
    E(t10) ? e10.type.__ssrInlineRender ? e10.ssrRender = t10 : e10.render = t10 : R(t10) && (e10.setupState = tO(t10)), iO(e10, n2);
  }
  function iO(e10, t10, n2) {
    let l2 = e10.type;
    if (!e10.render) {
      if (!t10 && u && !l2.render) {
        let t11 = l2.template || l9(e10).template;
        if (t11) {
          let { isCustomElement: n3, compilerOptions: r10 } = e10.appContext.config, { delimiters: i10, compilerOptions: s4 } = l2, o2 = S(S({ isCustomElement: n3, delimiters: i10 }, r10), s4);
          l2.render = u(t11, o2);
        }
      }
      e10.render = l2.render || _, c && c(e10);
    }
    {
      let t11 = iC(e10);
      eR();
      try {
        !(function(e11) {
          let t12 = l9(e11), n3 = e11.proxy, l4 = e11.ctx;
          l3 = false, t12.beforeCreate && l5(t12.beforeCreate, e11, "bc");
          let { data: r10, computed: i10, methods: s4, watch: o2, provide: a2, inject: u2, created: c2, beforeMount: f2, mounted: p2, beforeUpdate: d2, updated: h2, activated: g2, deactivated: v2, beforeUnmount: m2, unmounted: y2, render: b2, renderTracked: S2, renderTriggered: C2, errorCaptured: x2, serverPrefetch: w2, expose: A2, inheritAttrs: O2, components: N2, directives: P2 } = t12;
          if (u2 && (function(e12, t13) {
            for (let n4 in k(e12) && (e12 = rn(e12)), e12) {
              let l6, r11 = e12[n4];
              tS(l6 = R(r11) ? "default" in r11 ? nc(r11.from || n4, r11.default, true) : nc(r11.from || n4) : nc(r11)) ? Object.defineProperty(t13, n4, { enumerable: true, configurable: true, get: () => l6.value, set: (e13) => l6.value = e13 }) : t13[n4] = l6;
            }
          })(u2, l4), s4) for (let e12 in s4) {
            let t13 = s4[e12];
            E(t13) && (l4[e12] = t13.bind(n3));
          }
          if (r10) {
            let t13 = r10.call(n3, n3);
            R(t13) && (e11.data = ta(t13));
          }
          if (l3 = true, i10) for (let e12 in i10) {
            let t13 = i10[e12], r11 = E(t13) ? t13.bind(n3, n3) : E(t13.get) ? t13.get.bind(n3, n3) : _, s6 = iF({ get: r11, set: !E(t13) && E(t13.set) ? t13.set.bind(n3) : _ });
            Object.defineProperty(l4, e12, { enumerable: true, configurable: true, get: () => s6.value, set: (e13) => s6.value = e13 });
          }
          if (o2) for (let e12 in o2) !(function e13(t13, n4, l6, r11) {
            let i11 = r11.includes(".") ? nb(l6, r11) : () => l6[r11];
            if (T(t13)) {
              let e14 = n4[t13];
              E(e14) && n_(i11, e14);
            } else if (E(t13)) n_(i11, t13.bind(l6));
            else if (R(t13)) if (k(t13)) t13.forEach((t14) => e13(t14, n4, l6, r11));
            else {
              let e14 = E(t13.handler) ? t13.handler.bind(l6) : n4[t13.handler];
              E(e14) && n_(i11, e14, t13);
            }
          })(o2[e12], l4, n3, e12);
          if (a2) {
            let e12 = E(a2) ? a2.call(n3) : a2;
            Reflect.ownKeys(e12).forEach((t13) => {
              nu(t13, e12[t13]);
            });
          }
          function M2(e12, t13) {
            k(t13) ? t13.forEach((t14) => e12(t14.bind(n3))) : t13 && e12(t13.bind(n3));
          }
          if (c2 && l5(c2, e11, "c"), M2(lm, f2), M2(ly, p2), M2(lb, d2), M2(lS, h2), M2(lf, g2), M2(lp, v2), M2(lT, x2), M2(lE, S2), M2(lk, C2), M2(lC, m2), M2(lx, y2), M2(lw, w2), k(A2)) if (A2.length) {
            let t13 = e11.exposed || (e11.exposed = {});
            A2.forEach((e12) => {
              Object.defineProperty(t13, e12, { get: () => n3[e12], set: (t14) => n3[e12] = t14, enumerable: true });
            });
          } else e11.exposed || (e11.exposed = {});
          b2 && e11.render === _ && (e11.render = b2), null != O2 && (e11.inheritAttrs = O2), N2 && (e11.components = N2), P2 && (e11.directives = P2), w2 && nq(e11);
        })(e10);
      } finally {
        eO(), t11();
      }
    }
  }
  var iN = { get: (e10, t10) => (eD(e10, "get", ""), e10[t10]) };
  function iP(e10) {
    return { attrs: new Proxy(e10.attrs, iN), slots: e10.slots, emit: e10.emit, expose: (t10) => {
      e10.exposed = t10 || {};
    } };
  }
  function iM(e10) {
    return e10.exposed ? e10.exposeProxy || (e10.exposeProxy = new Proxy(tO(tm(e10.exposed)), { get: (t10, n2) => n2 in t10 ? t10[n2] : n2 in lB ? lB[n2](e10) : void 0, has: (e11, t10) => t10 in e11 || t10 in lB })) : e10.proxy;
  }
  var iF = (e10, t10) => (function(e11, t11 = false) {
    let n2, l2;
    return E(e11) ? n2 = e11 : (n2 = e11.get, l2 = e11.set), new tj(n2, l2, t11);
  })(e10, ik);
  function iL(e10, t10, n2) {
    try {
      r8(-1);
      let l2 = arguments.length;
      if (2 !== l2) return l2 > 3 ? n2 = Array.prototype.slice.call(arguments, 2) : 3 === l2 && r9(n2) && (n2 = [n2]), ii(e10, t10, n2);
      if (!R(t10) || k(t10)) return ii(e10, null, t10);
      if (r9(t10)) return ii(e10, null, [t10]);
      return ii(e10, t10);
    } finally {
      r8(1);
    }
  }
  var iU = "3.5.43";
  var iX = "u" > typeof window && window.trustedTypes;
  if (iX) try {
    d = iX.createPolicy("vue", { createHTML: (e10) => e10 });
  } catch (e10) {
  }
  var iJ = d ? (e10) => d.createHTML(e10) : (e10) => e10;
  var iZ = "u" > typeof document ? document : null;
  var iY = iZ && iZ.createElement("template");
  var iQ = { insert: (e10, t10, n2) => {
    t10.insertBefore(e10, n2 || null);
  }, remove: (e10) => {
    let t10 = e10.parentNode;
    t10 && t10.removeChild(e10);
  }, createElement: (e10, t10, n2, l2) => {
    let r10 = "svg" === t10 ? iZ.createElementNS("http://www.w3.org/2000/svg", e10) : "mathml" === t10 ? iZ.createElementNS("http://www.w3.org/1998/Math/MathML", e10) : n2 ? iZ.createElement(e10, { is: n2 }) : iZ.createElement(e10);
    return "select" === e10 && l2 && null != l2.multiple && r10.setAttribute("multiple", l2.multiple), r10;
  }, createText: (e10) => iZ.createTextNode(e10), createComment: (e10) => iZ.createComment(e10), setText: (e10, t10) => {
    e10.nodeValue = t10;
  }, setElementText: (e10, t10) => {
    e10.textContent = t10;
  }, parentNode: (e10) => e10.parentNode, nextSibling: (e10) => e10.nextSibling, querySelector: (e10) => iZ.querySelector(e10), setScopeId(e10, t10) {
    e10.setAttribute(t10, "");
  }, insertStaticContent(e10, t10, n2, l2, r10, i10) {
    let s4 = n2 ? n2.previousSibling : t10.lastChild;
    if (r10 && (r10 === i10 || r10.nextSibling)) for (; t10.insertBefore(r10.cloneNode(true), n2), r10 !== i10 && (r10 = r10.nextSibling); ) ;
    else {
      iY.innerHTML = iJ("svg" === l2 ? `<svg>${e10}</svg>` : "mathml" === l2 ? `<math>${e10}</math>` : e10);
      let r11 = iY.content;
      if ("svg" === l2 || "mathml" === l2) {
        let e11 = r11.firstChild;
        for (; e11.firstChild; ) r11.appendChild(e11.firstChild);
        r11.removeChild(e11);
      }
      t10.insertBefore(r11, n2);
    }
    return [s4 ? s4.nextSibling : t10.firstChild, n2 ? n2.previousSibling : t10.lastChild];
  } };
  var i0 = "transition";
  var i1 = "animation";
  var i2 = /* @__PURE__ */ Symbol("_vtc");
  var i6 = { name: String, type: String, css: { type: Boolean, default: true }, duration: [String, Number, Object], enterFromClass: String, enterActiveClass: String, enterToClass: String, appearFromClass: String, appearActiveClass: String, appearToClass: String, leaveFromClass: String, leaveActiveClass: String, leaveToClass: String };
  var i8 = S({}, nF, i6);
  var i4 = ((e = (e10, { slots: t10 }) => iL(nV, i9(e10), t10)).displayName = "Transition", e.props = i8, e);
  var i3 = (e10, t10 = []) => {
    k(e10) ? e10.forEach((e11) => e11(...t10)) : e10 && e10(...t10);
  };
  var i5 = (e10) => !!e10 && (k(e10) ? e10.some((e11) => e11.length > 1) : e10.length > 1);
  function i9(e10) {
    let t10 = {};
    for (let n3 in e10) n3 in i6 || (t10[n3] = e10[n3]);
    if (false === e10.css) return t10;
    let { name: n2 = "v", type: l2, duration: r10, enterFromClass: i10 = `${n2}-enter-from`, enterActiveClass: s4 = `${n2}-enter-active`, enterToClass: o2 = `${n2}-enter-to`, appearFromClass: a2 = i10, appearActiveClass: u2 = s4, appearToClass: c2 = o2, leaveFromClass: f2 = `${n2}-leave-from`, leaveActiveClass: p2 = `${n2}-leave-active`, leaveToClass: d2 = `${n2}-leave-to` } = e10, h2 = (function(e11) {
      if (null == e11) return null;
      {
        if (R(e11)) return [(function(e12) {
          return K(e12);
        })(e11.enter), (function(e12) {
          return K(e12);
        })(e11.leave)];
        let t11 = (function(e12) {
          return K(e12);
        })(e11);
        return [t11, t11];
      }
    })(r10), g2 = h2 && h2[0], v2 = h2 && h2[1], { onBeforeEnter: _2, onEnter: m2, onEnterCancelled: y2, onLeave: b2, onLeaveCancelled: C2, onBeforeAppear: x2 = _2, onAppear: w2 = m2, onAppearCancelled: k2 = y2 } = t10, E2 = (e11, t11, n3, l4) => {
      e11._enterCancelled = l4, se(e11, t11 ? c2 : o2), se(e11, t11 ? u2 : s4), n3 && n3();
    }, T2 = (e11, t11) => {
      e11._isLeaving = false, se(e11, f2), se(e11, d2), se(e11, p2), t11 && t11();
    }, A2 = (e11) => (t11, n3) => {
      let r11 = e11 ? w2 : m2, s6 = () => E2(t11, e11, n3);
      i3(r11, [t11, s6]), st(() => {
        se(t11, e11 ? a2 : i10), i7(t11, e11 ? c2 : o2), i5(r11) || sl(t11, l2, g2, s6);
      });
    };
    return S(t10, { onBeforeEnter(e11) {
      i3(_2, [e11]), i7(e11, i10), i7(e11, s4);
    }, onBeforeAppear(e11) {
      i3(x2, [e11]), i7(e11, a2), i7(e11, u2);
    }, onEnter: A2(false), onAppear: A2(true), onLeave(e11, t11) {
      e11._isLeaving = true;
      let n3 = () => T2(e11, t11);
      i7(e11, f2), e11._enterCancelled ? (i7(e11, p2), so(e11)) : (so(e11), i7(e11, p2)), st(() => {
        e11._isLeaving && (se(e11, f2), i7(e11, d2), i5(b2) || sl(e11, l2, v2, n3));
      }), i3(b2, [e11, n3]);
    }, onEnterCancelled(e11) {
      E2(e11, false, void 0, true), i3(y2, [e11]);
    }, onAppearCancelled(e11) {
      E2(e11, true, void 0, true), i3(k2, [e11]);
    }, onLeaveCancelled(e11) {
      T2(e11), i3(C2, [e11]);
    } });
  }
  function i7(e10, t10) {
    t10.split(/\s+/).forEach((t11) => t11 && e10.classList.add(t11)), (e10[i2] || (e10[i2] = /* @__PURE__ */ new Set())).add(t10);
  }
  function se(e10, t10) {
    t10.split(/\s+/).forEach((t11) => t11 && e10.classList.remove(t11));
    let n2 = e10[i2];
    n2 && (n2.delete(t10), n2.size || (e10[i2] = void 0));
  }
  function st(e10) {
    requestAnimationFrame(() => {
      requestAnimationFrame(e10);
    });
  }
  var sn = 0;
  function sl(e10, t10, n2, l2) {
    let r10 = e10._endId = ++sn, i10 = () => {
      r10 === e10._endId && l2();
    };
    if (null != n2) return setTimeout(i10, n2);
    let { type: s4, timeout: o2, propCount: a2 } = sr(e10, t10);
    if (!s4) return l2();
    let u2 = s4 + "end", c2 = 0, f2 = () => {
      e10.removeEventListener(u2, p2), i10();
    }, p2 = (t11) => {
      t11.target === e10 && ++c2 >= a2 && f2();
    };
    setTimeout(() => {
      c2 < a2 && f2();
    }, o2 + 1), e10.addEventListener(u2, p2);
  }
  function sr(e10, t10) {
    let n2 = window.getComputedStyle(e10), l2 = (e11) => (n2[e11] || "").split(", "), r10 = l2(`${i0}Delay`), i10 = l2(`${i0}Duration`), s4 = si(r10, i10), o2 = l2(`${i1}Delay`), a2 = l2(`${i1}Duration`), u2 = si(o2, a2), c2 = null, f2 = 0, p2 = 0;
    t10 === i0 ? s4 > 0 && (c2 = i0, f2 = s4, p2 = i10.length) : t10 === i1 ? u2 > 0 && (c2 = i1, f2 = u2, p2 = a2.length) : p2 = (c2 = (f2 = Math.max(s4, u2)) > 0 ? s4 > u2 ? i0 : i1 : null) ? c2 === i0 ? i10.length : a2.length : 0;
    let d2 = c2 === i0 && /\b(?:transform|all)(?:,|$)/.test(l2(`${i0}Property`).toString());
    return { type: c2, timeout: f2, propCount: p2, hasTransform: d2 };
  }
  function si(e10, t10) {
    for (; e10.length < t10.length; ) e10 = e10.concat(e10);
    return Math.max(...t10.map((t11, n2) => ss(t11) + ss(e10[n2])));
  }
  function ss(e10) {
    return "auto" === e10 ? 0 : 1e3 * Number(e10.slice(0, -1).replace(",", "."));
  }
  function so(e10) {
    return (e10 ? e10.ownerDocument : document).body.offsetHeight;
  }
  var sa = /* @__PURE__ */ Symbol("_vod");
  var su = /* @__PURE__ */ Symbol("_vsh");
  var sp = /* @__PURE__ */ Symbol("");
  var sg = /(?:^|;)\s*display\s*:/;
  var sv = /\s*!important$/;
  function s_(e10, t10, n2) {
    if (k(n2)) n2.forEach((n3) => s_(e10, t10, n3));
    else if (null == n2 && (n2 = ""), t10.startsWith("--")) sv.test(n2) ? e10.setProperty(t10, n2.replace(sv, ""), "important") : e10.setProperty(t10, n2);
    else {
      let l2 = (function(e11, t11) {
        let n3 = sy[t11];
        if (n3) return n3;
        let l4 = L(t11);
        if ("filter" !== l4 && l4 in e11) return sy[t11] = l4;
        l4 = D(l4);
        for (let n4 = 0; n4 < sm.length; n4++) {
          let r10 = sm[n4] + l4;
          if (r10 in e11) return sy[t11] = r10;
        }
        return t11;
      })(e10, t10);
      sv.test(n2) ? e10.setProperty(V(l2), n2.replace(sv, ""), "important") : e10[l2] = n2;
    }
  }
  var sm = ["Webkit", "Moz", "ms"];
  var sy = {};
  var sb = "http://www.w3.org/1999/xlink";
  function sS(e10, t10, n2, l2, r10, i10 = ee(t10)) {
    if (l2 && t10.startsWith("xlink:")) null == n2 ? e10.removeAttributeNS(sb, t10.slice(6, t10.length)) : e10.setAttributeNS(sb, t10, n2);
    else null == n2 || i10 && !(n2 || "" === n2) ? e10.removeAttribute(t10) : e10.setAttribute(t10, i10 ? "" : A(n2) ? String(n2) : n2);
  }
  function sC(e10, t10, n2, l2, r10) {
    if ("innerHTML" === t10 || "textContent" === t10) {
      null != n2 && (e10[t10] = "innerHTML" === t10 ? iJ(n2) : n2);
      return;
    }
    let i10 = e10.tagName;
    if ("value" === t10 && "PROGRESS" !== i10 && !i10.includes("-")) {
      let l4 = "OPTION" === i10 ? e10.getAttribute("value") || "" : e10.value, r11 = null == n2 ? "checkbox" === e10.type ? "on" : "" : String(n2);
      l4 === r11 && "_value" in e10 || (e10.value = r11), null == n2 && e10.removeAttribute(t10), e10._value = n2;
      return;
    }
    let s4 = false;
    if ("" === n2 || null == n2) {
      let l4 = typeof e10[t10];
      if ("boolean" === l4) {
        var o2;
        n2 = !!(o2 = n2) || "" === o2;
      } else null == n2 && "string" === l4 ? (n2 = "", s4 = true) : "number" === l4 && (n2 = 0, s4 = true);
    }
    try {
      e10[t10] = n2;
    } catch (e11) {
    }
    s4 && e10.removeAttribute(r10 || t10);
  }
  function sx(e10, t10, n2, l2) {
    e10.addEventListener(t10, n2, l2);
  }
  var sw = /* @__PURE__ */ Symbol("_vei");
  var sk = /(Once|Passive|Capture)$/;
  var sE = /^on:?(?:Once|Passive|Capture)$/;
  var sT = 0;
  var sA = Promise.resolve();
  var sR = (e10) => 111 === e10.charCodeAt(0) && 110 === e10.charCodeAt(1) && e10.charCodeAt(2) > 96 && 123 > e10.charCodeAt(2);
  var sO = (e10, t10, n2, l2, r10, i10) => {
    let s4 = "svg" === r10;
    if ("class" === t10) {
      var o2;
      let t11;
      o2 = l2, (t11 = e10[i2]) && (o2 = (o2 ? [o2, ...t11] : [...t11]).join(" ")), null == o2 ? e10.removeAttribute("class") : s4 ? e10.setAttribute("class", o2) : e10.className = o2;
    } else "style" === t10 ? (function(e11, t11, n3) {
      let l4 = e11.style, r11 = T(n3), i11 = false;
      if (n3 && !r11) {
        if (t11) if (T(t11)) for (let e12 of t11.split(";")) {
          let t12 = e12.slice(0, e12.indexOf(":")).trim();
          null == n3[t12] && s_(l4, t12, "");
        }
        else for (let e12 in t11) null == n3[e12] && s_(l4, e12, "");
        for (let r12 in n3) {
          var s6, o3, a2, u2;
          "display" === r12 && (i11 = true);
          let c2 = n3[r12];
          null != c2 ? (s6 = e11, o3 = r12, a2 = !T(t11) && t11 ? t11[r12] : void 0, u2 = c2, "TEXTAREA" === s6.tagName && ("width" === o3 || "height" === o3) && T(u2) && a2 === u2 || s_(l4, r12, c2)) : s_(l4, r12, "");
        }
      } else if (r11) {
        if (t11 !== n3) {
          let e12 = l4[sp];
          e12 && (n3 += ";" + e12), l4.cssText = n3, i11 = sg.test(n3);
        }
      } else t11 && e11.removeAttribute("style");
      sa in e11 && (e11[sa] = i11 ? l4.display : "", e11[su] && (l4.display = "none"));
    })(e10, n2, l2) : y(t10) ? b(t10) || (function(e11, t11, n3, l4 = null) {
      let r11 = e11[sw] || (e11[sw] = {}), i11 = r11[t11];
      if (n3 && i11) i11.value = n3;
      else {
        let [a2, u2] = (function(e12) {
          let t12, n4;
          for (; (n4 = e12.match(sk)) && !sE.test(e12); ) t12 || (t12 = {}), e12 = e12.slice(0, e12.length - n4[1].length), t12[n4[1].toLowerCase()] = true;
          return [":" === e12[2] ? e12.slice(3) : V(e12.slice(2)), t12];
        })(t11);
        if (n3) {
          var s6, o3;
          let i12;
          sx(e11, a2, r11[t11] = (s6 = n3, o3 = l4, (i12 = (e12) => {
            if (e12._vts) {
              if (e12._vts <= i12.attached) return;
            } else e12._vts = Date.now();
            let t12 = i12.value;
            if (k(t12)) {
              let n4 = e12.stopImmediatePropagation;
              e12.stopImmediatePropagation = () => {
                n4.call(e12), e12._stopped = true;
              };
              let l6 = t12.slice(), r12 = [e12];
              for (let t13 = 0; t13 < l6.length && !e12._stopped; t13++) {
                let e13 = l6[t13];
                e13 && tG(e13, o3, 5, r12);
              }
            } else tG(t12, o3, 5, [e12]);
          }).value = s6, i12.attached = sT || (sA.then(() => sT = 0), sT = Date.now()), i12), u2);
        } else i11 && (e11.removeEventListener(a2, i11, u2), r11[t11] = void 0);
      }
    })(e10, t10, l2, i10) : ("." === t10[0] ? (t10 = t10.slice(1), 0) : "^" === t10[0] ? (t10 = t10.slice(1), 1) : !(function(e11, t11, n3, l4) {
      if (l4) return !!("innerHTML" === t11 || "textContent" === t11 || t11 in e11 && sR(t11) && E(n3));
      if ("spellcheck" === t11 || "draggable" === t11 || "translate" === t11 || "autocorrect" === t11 || "sandbox" === t11 && "IFRAME" === e11.tagName || "form" === t11 || "list" === t11 && "INPUT" === e11.tagName || "type" === t11 && "TEXTAREA" === e11.tagName) return false;
      if ("width" === t11 || "height" === t11) {
        let t12 = e11.tagName;
        if ("IMG" === t12 || "VIDEO" === t12 || "CANVAS" === t12 || "SOURCE" === t12) return false;
      }
      return !(sR(t11) && T(n3)) && t11 in e11;
    })(e10, t10, l2, s4)) ? e10._isVueCE && ((function(e11, t11) {
      let n3 = e11._def.props;
      if (!n3) return false;
      let l4 = L(t11);
      return Array.isArray(n3) ? n3.some((e12) => L(e12) === l4) : Object.keys(n3).some((e12) => L(e12) === l4);
    })(e10, t10) || e10._def.__asyncLoader && (/[A-Z]/.test(t10) || !T(l2))) ? sC(e10, L(t10), l2, i10, t10) : ("true-value" === t10 ? e10._trueValue = l2 : "false-value" === t10 && (e10._falseValue = l2), sS(e10, t10, l2, s4)) : (sC(e10, t10, l2), e10.tagName.includes("-") || "value" !== t10 && "checked" !== t10 && "selected" !== t10 || sS(e10, t10, l2, s4, i10, "value" !== t10));
  };
  var sD = /* @__PURE__ */ new WeakMap();
  var sU = /* @__PURE__ */ new WeakMap();
  var sB = /* @__PURE__ */ Symbol("_moveCb");
  var s$ = /* @__PURE__ */ Symbol("_enterCb");
  var sH = (t = { name: "TransitionGroup", props: S({}, i8, { tag: String, moveClass: String }), setup(e10, { slots: t10 }) {
    let n2, l2, r10 = iS(), i10 = nM();
    return lS(() => {
      if (!n2.length) return;
      let t11 = e10.moveClass || `${e10.name || "v"}-move`;
      if (!(function(e11, t12, n3) {
        let l6 = e11.cloneNode(), r11 = e11[i2];
        r11 && r11.forEach((e12) => {
          e12.split(/\s+/).forEach((e13) => e13 && l6.classList.remove(e13));
        }), n3.split(/\s+/).forEach((e12) => e12 && l6.classList.add(e12)), l6.style.display = "none";
        let i11 = 1 === t12.nodeType ? t12 : t12.parentNode;
        i11.appendChild(l6);
        let { hasTransform: s4 } = sr(l6);
        return i11.removeChild(l6), s4;
      })(n2[0].el, r10.vnode.el, t11)) {
        n2 = [];
        return;
      }
      n2.forEach(sW), n2.forEach(sK);
      let l4 = n2.filter(sz);
      so(r10.vnode.el), l4.forEach((e11) => {
        let n3 = e11.el, l6 = n3.style;
        i7(n3, t11), l6.transform = l6.webkitTransform = l6.transitionDuration = "";
        let r11 = n3[sB] = (e12) => {
          (!e12 || e12.target === n3) && (!e12 || e12.propertyName.endsWith("transform")) && (n3.removeEventListener("transitionend", r11), n3[sB] = null, se(n3, t11));
        };
        n3.addEventListener("transitionend", r11);
      }), n2 = [];
    }), () => {
      let s4 = t_(e10), o2 = i9(s4), a2 = s4.tag || rX;
      if (n2 = [], l2) for (let e11 = 0; e11 < l2.length; e11++) {
        let t11 = l2[e11];
        t11.el && t11.el instanceof Element && !t11.el[su] && (n2.push(t11), nH(t11, nU(t11, o2, i10, r10)), sD.set(t11, sq(t11.el)));
      }
      l2 = t10.default ? nW(t10.default()) : [];
      for (let e11 = 0; e11 < l2.length; e11++) {
        let t11 = l2[e11];
        null != t11.key && nH(t11, nU(t11, o2, i10, r10));
      }
      return ii(a2, null, l2);
    };
  } }, delete t.props.mode, t);
  function sW(e10) {
    let t10 = e10.el;
    t10[sB] && t10[sB](), t10[s$] && t10[s$]();
  }
  function sK(e10) {
    sU.set(e10, sq(e10.el));
  }
  function sz(e10) {
    let t10 = sD.get(e10), n2 = sU.get(e10), l2 = t10.left - n2.left, r10 = t10.top - n2.top;
    if (l2 || r10) {
      let t11 = e10.el, n3 = t11.style, i10 = t11.getBoundingClientRect(), s4 = 1, o2 = 1;
      return t11.offsetWidth && (s4 = i10.width / t11.offsetWidth), t11.offsetHeight && (o2 = i10.height / t11.offsetHeight), Number.isFinite(s4) && 0 !== s4 || (s4 = 1), Number.isFinite(o2) && 0 !== o2 || (o2 = 1), 0.01 > Math.abs(s4 - 1) && (s4 = 1), 0.01 > Math.abs(o2 - 1) && (o2 = 1), n3.transform = n3.webkitTransform = `translate(${l2 / s4}px,${r10 / o2}px)`, n3.transitionDuration = "0s", e10;
    }
  }
  function sq(e10) {
    let t10 = e10.getBoundingClientRect();
    return { left: t10.left, top: t10.top };
  }
  var sG = (e10) => {
    let t10 = e10.props["onUpdate:modelValue"] || false;
    return k(t10) ? (e11) => $(t10, e11) : t10;
  };
  function sX(e10) {
    e10.target.composing = true;
  }
  function sJ(e10) {
    let t10 = e10.target;
    t10.composing && (t10.composing = false, t10.dispatchEvent(new Event("input")));
  }
  var sZ = /* @__PURE__ */ Symbol("_assign");
  var sY = /* @__PURE__ */ Symbol("_initialValue");
  function sQ(e10, t10, n2) {
    return t10 && (e10 = e10.trim()), n2 && (e10 = W(e10)), e10;
  }
  var s0 = { created(e10, { modifiers: { lazy: t10, trim: n2, number: l2 } }, r10) {
    e10.parentNode && ("text" === e10.type ? e10[sY] = e10.defaultValue.replace(/[\r\n]/g, "") : "textarea" === e10.type && (e10[sY] = e10.defaultValue.replace(/\r\n?/g, `
`))), e10[sZ] = sG(r10);
    let i10 = l2 || r10.props && "number" === r10.props.type;
    sx(e10, t10 ? "change" : "input", (t11) => {
      t11.target.composing || e10[sZ](sQ(e10.value, n2, i10));
    }), (n2 || i10) && sx(e10, "change", () => {
      e10.value = sQ(e10.value, n2, i10);
    }), t10 || (sx(e10, "compositionstart", sX), sx(e10, "compositionend", sJ), sx(e10, "change", sJ));
  }, mounted(e10, { value: t10, modifiers: { trim: n2, number: l2 } }) {
    let r10 = e10[sY];
    delete e10[sY], void 0 !== r10 && ("text" === e10.type || "textarea" === e10.type) && e10.value !== r10 ? e10[sZ](sQ(e10.value, n2, l2)) : e10.value = null == t10 ? "" : t10;
  }, beforeUpdate(e10, { value: t10, oldValue: n2, modifiers: { lazy: l2, trim: r10, number: i10 } }, s4) {
    if (e10[sZ] = sG(s4), e10.composing) return;
    let o2 = (i10 || "number" === e10.type) && !/^0\d/.test(e10.value) ? W(e10.value) : e10.value, a2 = null == t10 ? "" : t10;
    if (o2 === a2) return;
    let u2 = e10.getRootNode();
    (u2 instanceof Document || u2 instanceof ShadowRoot) && u2.activeElement === e10 && "range" !== e10.type && (l2 && t10 === n2 || r10 && e10.value.trim() === a2) || (e10.value = a2);
  } };
  var s1 = { deep: true, created(e10, t10, n2) {
    e10[sZ] = sG(n2), sx(e10, "change", () => {
      let t11 = e10._modelValue, n3 = s3(e10), l2 = e10.checked, r10 = e10[sZ];
      if (k(t11)) {
        let e11 = es(t11, n3), i10 = -1 !== e11;
        if (l2 && !i10) r10(t11.concat(n3));
        else if (!l2 && i10) {
          let n4 = [...t11];
          n4.splice(e11, 1), r10(n4);
        }
      } else {
        let i10;
        if ("[object Set]" === (i10 = t11, N.call(i10))) {
          let e11 = new Set(t11);
          l2 ? e11.add(n3) : e11.delete(n3), r10(e11);
        } else r10(s5(e10, l2));
      }
    });
  }, mounted: s2, beforeUpdate(e10, t10, n2) {
    e10[sZ] = sG(n2), s2(e10, t10, n2);
  } };
  function s2(e10, { value: t10, oldValue: n2 }, l2) {
    let r10;
    if (e10._modelValue = t10, k(t10)) r10 = es(t10, l2.props.value) > -1;
    else {
      let i10;
      if ("[object Set]" === (i10 = t10, N.call(i10))) r10 = t10.has(l2.props.value);
      else {
        if (t10 === n2) return;
        r10 = ei(t10, s5(e10, true));
      }
    }
    e10.checked !== r10 && (e10.checked = r10);
  }
  function s3(e10) {
    return "_value" in e10 ? e10._value : e10.value;
  }
  function s5(e10, t10) {
    let n2 = t10 ? "_trueValue" : "_falseValue";
    return n2 in e10 ? e10[n2] : t10;
  }
  var ot = ["ctrl", "shift", "alt", "meta"];
  var on = { stop: (e10) => e10.stopPropagation(), prevent: (e10) => e10.preventDefault(), self: (e10) => e10.target !== e10.currentTarget, ctrl: (e10) => !e10.ctrlKey, shift: (e10) => !e10.shiftKey, alt: (e10) => !e10.altKey, meta: (e10) => !e10.metaKey, left: (e10) => "button" in e10 && 0 !== e10.button, middle: (e10) => "button" in e10 && 1 !== e10.button, right: (e10) => "button" in e10 && 2 !== e10.button, exact: (e10, t10) => ot.some((n2) => e10[`${n2}Key`] && !t10.includes(n2)) };
  var ol = (e10, t10) => {
    if (!e10) return e10;
    let n2 = e10._withMods || (e10._withMods = {}), l2 = t10.join(".");
    return n2[l2] || (n2[l2] = (n3, ...l4) => {
      for (let e11 = 0; e11 < t10.length; e11++) {
        let l6 = on[t10[e11]];
        if (l6 && l6(n3, t10)) return;
      }
      return e10(n3, ...l4);
    });
  };
  var os = S({ patchProp: sO }, iQ);
  var of = (...e10) => {
    let t10 = (f || (f = rM(os))).createApp(...e10), { mount: n2 } = t10;
    return t10.mount = (e11) => {
      let l2 = oh(e11);
      if (!l2) return;
      let r10 = t10._component;
      E(r10) || r10.render || r10.template || (r10.template = l2.innerHTML), 1 === l2.nodeType && (l2.textContent = "");
      let i10 = n2(l2, false, od(l2));
      return l2 instanceof Element && (l2.removeAttribute("v-cloak"), l2.setAttribute("data-v-app", "")), i10;
    }, t10;
  };
  function od(e10) {
    return e10 instanceof SVGElement ? "svg" : "function" == typeof MathMLElement && e10 instanceof MathMLElement ? "mathml" : void 0;
  }
  function oh(e10) {
    return T(e10) ? document.querySelector(e10) : e10;
  }

  // ws:/src/types.ts
  var SAVE_KEY = "pet:state:v1";
  function expNeeded(level) {
    return 60 + level * 40;
  }
  function createDefaultState(name = "小柚") {
    return {
      version: 1,
      name,
      stats: { level: 1, exp: 0, affection: 30, hunger: 70, energy: 80 },
      pos: { x: 0.965, y: 0.72 },
      collapsed: false,
      lastActive: Date.now(),
      chat: [],
      settings: {
        chatter: true,
        followCursor: true,
        pomodoro: false,
        pomodoroMinutes: 25,
        water: false,
        waterMinutes: 45,
        modelId: "auto"
      }
    };
  }
  function clamp(v2, lo = 0, hi = 100) {
    return v2 < lo ? lo : v2 > hi ? hi : v2;
  }

  // ws:/src/log.ts
  function dbg(...args) {
    if (LFRuntime.liveDebug) LFRuntime.print("[pet]", ...args);
  }
  function dbgWarn(...args) {
    if (LFRuntime.liveDebug) LFRuntime.print("[pet][warn]", ...args);
  }

  // ws:/src/store.ts
  var cache = null;
  var writeTimer = null;
  var interacting = false;
  var listeners = /* @__PURE__ */ new Set();
  function migrate(raw) {
    const d2 = createDefaultState();
    if (!raw || typeof raw !== "object") return d2;
    const r10 = raw;
    return {
      ...d2,
      ...r10,
      stats: { ...d2.stats, ...r10.stats ?? {} },
      pos: { ...d2.pos, ...r10.pos ?? {} },
      settings: { ...d2.settings, ...r10.settings ?? {} },
      chat: Array.isArray(r10.chat) ? r10.chat.slice(-40) : [],
      // 缩小/收起按钮已删除，小人始终以本体常驻；顺手把旧存档留下的小尺寸状态复位
      collapsed: false,
      version: d2.version
    };
  }
  function notify() {
    if (!cache) return;
    for (const fn of listeners) {
      try {
        fn(cache);
      } catch (e10) {
        dbg("listener error", String(e10));
      }
    }
  }
  async function loadState() {
    if (cache) return cache;
    const raw = await LFStore.get(SAVE_KEY, null);
    cache = migrate(raw);
    dbg("state loaded", { name: cache.name, lv: cache.stats.level, aff: cache.stats.affection, hasRemote: !!raw });
    if (!raw) await LFStore.set(SAVE_KEY, cache);
    return cache;
  }
  function getState() {
    return cache;
  }
  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
  function setInteracting(v2) {
    interacting = v2;
  }
  function patch(mutate, persist = true) {
    if (!cache) return null;
    mutate(cache);
    notify();
    if (persist) schedulePersist();
    return cache;
  }
  function schedulePersist(delay = 500) {
    if (writeTimer !== null) clearTimeout(writeTimer);
    writeTimer = window.setTimeout(() => {
      writeTimer = null;
      void persistNow();
    }, delay);
  }
  async function persistNow() {
    if (!cache) return;
    try {
      await LFStore.set(SAVE_KEY, cache);
      dbg("state saved");
    } catch (e10) {
      dbg("state save failed", String(e10));
    }
  }
  function watchRemoteState() {
    LFStore.watch(SAVE_KEY, (change) => {
      if (!change.found || !change.value) return;
      if (interacting) return;
      cache = migrate(change.value);
      dbg("state synced from another tab", change.reason);
      notify();
    });
  }
  async function resetState() {
    cache = createDefaultState();
    notify();
    await LFStore.remove(SAVE_KEY);
    await LFStore.set(SAVE_KEY, cache);
    dbg("state reset");
  }

  // ws:/src/pet.ts
  var sink = null;
  function setBubbleSink(s4) {
    sink = s4;
  }
  function say(text, ms = 4200) {
    dbg("say", text);
    sink?.say(text, ms);
  }
  var lineBank = {
    idle: [
      "你在忙什么呀？",
      "这个网页我帮你盯着。",
      "摸摸头会更开心的哦～",
      "要不要休息一下？",
      "我一直都在这里陪着你。",
      "刚才那个页面好长啊…",
      "记得喝水呀。",
      "需要我帮你把页面变干净吗？"
    ],
    hungry: ["肚子好饿…", "想吃小饼干。", "喂我一口嘛～"],
    tired: ["好困…眼睛睁不开了。", "让我眯一会儿…", "能量见底啦。"],
    love: ["嘿嘿，好开心！", "最喜欢你了！", "再摸一下～"],
    levelUp: (lv2) => `升级啦！现在是 Lv.${lv2}！`,
    feed: ["谢谢！好好吃～", "吃饱啦，元气满满！", "唔…这个味道不错。"],
    play: ["玩得真开心！", "再来一次！", "嘿嘿～"]
  };
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function addExp(n2) {
    const s4 = patch((st2) => {
      st2.stats.exp += n2;
      let guard = 0;
      while (st2.stats.exp >= expNeeded(st2.stats.level) && guard++ < 50) {
        st2.stats.exp -= expNeeded(st2.stats.level);
        st2.stats.level += 1;
        st2.stats.affection = clamp(st2.stats.affection + 4);
        const lv2 = st2.stats.level;
        window.setTimeout(() => say(lineBank.levelUp(lv2), 5e3), 400);
        dbg("level up", lv2);
      }
    });
    if (s4) dbg("exp", n2, "→", s4.stats.exp, "lv", s4.stats.level);
  }
  function decayTick() {
    patch((st2) => {
      st2.stats.hunger = clamp(st2.stats.hunger - 0.5);
      st2.stats.energy = clamp(st2.stats.energy + 0.35);
      if (st2.stats.hunger < 25 || st2.stats.energy < 20) st2.stats.affection = clamp(st2.stats.affection - 0.2);
      else st2.stats.affection = clamp(st2.stats.affection + 0.05);
    });
  }
  function feed() {
    patch((st2) => {
      st2.stats.hunger = clamp(st2.stats.hunger + 24);
      st2.stats.energy = clamp(st2.stats.energy + 6);
      st2.stats.affection = clamp(st2.stats.affection + 2);
      st2.lastActive = Date.now();
    });
    addExp(9);
    say(pick(lineBank.feed));
  }
  function petting() {
    patch((st2) => {
      st2.stats.affection = clamp(st2.stats.affection + 3);
      st2.lastActive = Date.now();
    });
    addExp(6);
    say(pick(lineBank.love));
  }
  function play() {
    const s4 = getState();
    if (s4 && s4.stats.energy < 15) {
      say("太累了…先让我睡一下。");
      return;
    }
    patch((st2) => {
      st2.stats.energy = clamp(st2.stats.energy - 14);
      st2.stats.hunger = clamp(st2.stats.hunger - 6);
      st2.stats.affection = clamp(st2.stats.affection + 5);
      st2.lastActive = Date.now();
    });
    addExp(16);
    say(pick(lineBank.play));
  }
  function rest() {
    patch((st2) => {
      st2.stats.energy = clamp(st2.stats.energy + 26);
      st2.stats.hunger = clamp(st2.stats.hunger - 3);
      st2.lastActive = Date.now();
    });
    addExp(4);
    say("睡饱了，精神多了！");
  }
  function chatter() {
    const s4 = getState();
    if (!s4) return;
    if (s4.stats.hunger < 25) return say(pick(lineBank.hungry));
    if (s4.stats.energy < 20) return say(pick(lineBank.tired));
    say(pick(lineBank.idle));
  }

  // ws:/src/pagekeep.ts
  var STYLE_KEY = "pet-keeper-style";
  var OWN_ROOT_ID = "lf-pet-root";
  var HIDDEN_FLAG = "petKeeperHidden";
  var flags = { hidden: [], dark: false, reader: false };
  function ensureStyle() {
    LFRuntime.appendStyle(
      `html[data-pet-dark="1"] {
       filter: invert(1) hue-rotate(180deg) brightness(0.92) contrast(1.05);
       background: #101014 !important;
     }
     html[data-pet-dark="1"] img,
     html[data-pet-dark="1"] video,
     html[data-pet-dark="1"] iframe,
     html[data-pet-dark="1"] svg { filter: invert(1) hue-rotate(180deg); }
     html[data-pet-reader="1"] body > *:not(main):not(article) { display: none !important; }
     html[data-pet-reader="1"] main, html[data-pet-reader="1"] article {
       max-width: 760px !important;
       margin: 0 auto !important;
       padding: 24px 18px !important;
       font-size: 17px !important;
       line-height: 1.85 !important;
     }`,
      STYLE_KEY
    );
  }
  var AD_PATTERNS = [
    "ad-",
    "-ad",
    "ads",
    "advert",
    "banner",
    "popup",
    "pop-up",
    "modal",
    "overlay",
    "float",
    "sticky",
    "promo",
    "sponsor",
    "recommend",
    "guess-like",
    "subscribe"
  ];
  function looksLikeChrome(el2) {
    const id2 = (el2.id || "").toLowerCase();
    const cls = (typeof el2.className === "string" ? el2.className : "").toLowerCase();
    const tag = el2.tagName.toLowerCase();
    if (tag === "aside") return true;
    const hay = `${id2} ${cls}`;
    return AD_PATTERNS.some((p2) => hay.includes(p2));
  }
  function scanDistractions() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const out = [];
    const all = document.body ? Array.from(document.body.querySelectorAll("body *")) : [];
    for (const el2 of all) {
      if (out.length >= 40) break;
      if (el2.id === OWN_ROOT_ID || el2.closest(`#${OWN_ROOT_ID}`)) continue;
      if (el2[HIDDEN_FLAG]) continue;
      const r10 = el2.getBoundingClientRect();
      if (r10.width < 40 || r10.height < 30) continue;
      const cover = r10.width * r10.height / Math.max(1, vw * vh);
      const st2 = getComputedStyle(el2);
      const floating = st2.position === "fixed" || st2.position === "sticky";
      const z2 = parseInt(st2.zIndex || "0", 10) || 0;
      const big = cover > 0.08;
      if (floating && cover > 0.02 && z2 > 2 || floating && big || big && z2 > 50 || looksLikeChrome(el2) && cover > 0.03) {
        if ((el2.innerText || "").length > 1200) continue;
        out.push(el2);
      }
    }
    return out;
  }
  function hideDistractions() {
    ensureStyle();
    const list = scanDistractions();
    for (const el2 of list) {
      el2[HIDDEN_FLAG] = true;
      el2.dataset.petKeeperPrevDisplay = el2.style.display || "";
      el2.style.setProperty("display", "none", "important");
      flags.hidden.push(el2);
    }
    dbg("keeper hide", list.length);
    return list.length;
  }
  function restoreHidden() {
    const n2 = flags.hidden.length;
    for (const el2 of flags.hidden) {
      try {
        el2.style.removeProperty("display");
        if (el2.dataset.petKeeperPrevDisplay) el2.style.display = el2.dataset.petKeeperPrevDisplay;
        delete el2.dataset.petKeeperPrevDisplay;
        el2[HIDDEN_FLAG] = false;
      } catch {
      }
    }
    flags.hidden = [];
    dbg("keeper restore", n2);
    return n2;
  }
  function toggleDark() {
    ensureStyle();
    flags.dark = !flags.dark;
    document.documentElement.dataset.petDark = flags.dark ? "1" : "0";
    dbg("keeper dark", flags.dark);
    return flags.dark;
  }
  function toggleReader() {
    ensureStyle();
    flags.reader = !flags.reader;
    document.documentElement.dataset.petReader = flags.reader ? "1" : "0";
    dbg("keeper reader", flags.reader);
    return flags.reader;
  }
  function collectPageText(max = 9e3) {
    const pick2 = ["main", "article", '[role="main"]', "#content", ".content", ".article", ".post", "body"];
    let best = document.body;
    let bestLen = 0;
    for (const sel of pick2) {
      const el2 = document.querySelector(sel);
      if (!el2) continue;
      const len = (el2.innerText || "").replace(/\s+/g, " ").trim().length;
      if (len > bestLen) {
        bestLen = len;
        best = el2;
      }
    }
    let text = (best?.innerText || document.body?.innerText || "").replace(/\s+/g, " ").trim();
    if (text.length > max) text = text.slice(0, max);
    dbg("page text", { len: text.length, title: document.title });
    return text;
  }
  function speak(text) {
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u2 = new SpeechSynthesisUtterance(text.slice(0, 400));
      u2.lang = /[\u4e00-\u9fa5]/.test(text) ? "zh-CN" : "en-US";
      u2.rate = 1.05;
      window.speechSynthesis.speak(u2);
      dbg("speak", u2.lang, u2.text.length);
    } catch (e10) {
      dbg("speak failed", String(e10));
    }
  }

  // ws:/src/ai.ts
  var FALLBACK_MODELS = [
    // 真实模型列表由后台接口给出；这里只留一个「用后台配置的默认模型」的兜底项
    { id: "auto", name: "Auto（用后台配置的默认模型）" }
  ];
  async function listChatModels() {
    try {
      const res = await LFModel.listModels({ page: 1, pageSize: 60 });
      const arr = Array.isArray(res) ? res : res?.models ?? res?.data ?? [];
      const out = arr.filter((m2) => m2 && typeof m2.id === "string" && !m2?.capabilities?.image_generation).map((m2) => ({ id: String(m2.id), name: String(m2.name ?? m2.id) }));
      dbg("models loaded", out.length);
      return out.length ? out : FALLBACK_MODELS;
    } catch (e10) {
      dbgWarn("listModels 失败，使用内置列表", String(e10));
      return FALLBACK_MODELS;
    }
  }
  function persona(name, pageText) {
    const base = `你是常驻在浏览器里的动漫小精灵，名字叫「${name}」。你活泼、黏人、有一点点傲娇，说话短、口语化，喜欢用「~」「呀」「哦」这类语气词，可以偶尔用 1 个 emoji。回答一律控制在 80 字以内，不要长篇大论，不要用 Markdown 标题。`;
    if (!pageText) return base;
    return base + `
用户正在浏览一个网页，下面是页面正文节选；当用户问「这个页面」「这篇文章」时以此为依据回答，没问就不要主动朗读全文：
----
${pageText.slice(0, 6e3)}
----`;
  }
  function toMessages(history, userText, opts) {
    const msgs = [
      { role: "system", content: persona(opts.name, opts.pageText) }
    ];
    for (const m2 of history.slice(-10)) msgs.push({ role: m2.role, content: m2.content });
    msgs.push({ role: "user", content: userText });
    return msgs;
  }
  async function askAi(history, userText, opts) {
    const t02 = Date.now();
    dbg("chat →", { model: opts.modelId, withPage: !!opts.pageText, len: userText.length });
    const res = await LFModel.chat({
      model: opts.modelId || "auto",
      messages: toMessages(history, userText, opts),
      max_tokens: 900,
      temperature: 0.85
    });
    const text = res?.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) throw new Error("模型没有返回内容");
    dbg("chat ←", { ms: Date.now() - t02, chars: text.length, points: res?.lingfeng_billing?.charge_points });
    return text.trim();
  }
  async function summarizePage(pageText, opts) {
    const res = await LFModel.chat({
      model: opts.modelId || "auto",
      messages: [
        { role: "system", content: `你是「${opts.name}」，用 3-4 句话、口语化地总结用户正在看的网页内容，控制在 120 字以内。` },
        { role: "user", content: `请总结这个页面：
----
${pageText.slice(0, 9e3)}
----` }
      ],
      max_tokens: 900,
      temperature: 0.6
    });
    const text = res?.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) throw new Error("模型没有返回内容");
    return text.trim();
  }
  function errText(e10) {
    const anyE = e10;
    const code = anyE?.code || anyE?.status;
    const msg = anyE?.message || String(e10);
    if (code === "INSUFFICIENT_BALANCE") return "点数不够啦…去充值一下吧。";
    if (code === "APP_BUDGET_EXHAUSTED") return "这个小人的预算用完啦。";
    if (code === "MODEL_NOT_FOUND") return "这个模型不见了，换一个试试？";
    if (code === "NO_ENDPOINT" || code === "NO_API_KEY" || code === "NO_MODEL") {
      return "还没配置 AI 接口：点浏览器工具栏里的宠物图标打开设置页填写。";
    }
    if (code === "INVALID_API_KEY") return "API Key 不对，检查一下设置页里的 Key。";
    if (code === "NETWORK_ERROR") return "连不上 AI 接口，检查网络或接口地址。";
    if (typeof code === "string" && code.indexOf("HTTP_") === 0) return `接口返回 ${code.slice(5)}，去设置页看看配置。`;
    return `出错了：${String(msg).slice(0, 80)}`;
  }

  // ws:/src/sprite.ts
  var ALIAS = {
    idle: "pet-idle",
    idle2: "pet-idle2",
    idle3: "pet-idle3",
    happy: "pet-happy",
    sleepy: "pet-sleepy"
  };
  var cache2 = /* @__PURE__ */ new Map();
  var warned = /* @__PURE__ */ new Set();
  function spriteUrl(pose) {
    const hit = cache2.get(pose);
    if (hit !== void 0) return hit;
    const url = LFRuntime.getResource(ALIAS[pose]);
    if (!url && !warned.has(ALIAS[pose])) {
      warned.add(ALIAS[pose]);
      dbgWarn("立绘资源缺失", ALIAS[pose]);
    }
    cache2.set(pose, url);
    return url;
  }

  // ws:/src/timers.ts
  var pomodoroTotal = tC(25 * 60);
  var pomodoroLeft = tC(25 * 60);
  var pomodoroEnabled = tC(false);
  var waterTotal = tC(45 * 60);
  var waterLeft = tC(45 * 60);
  var waterEnabled = tC(false);
  function applySettings(s4) {
    pomodoroTotal.value = Math.max(60, Math.round(s4.pomodoroMinutes * 60));
    waterTotal.value = Math.max(60, Math.round(s4.waterMinutes * 60));
    if (!s4.pomodoro) {
      pomodoroEnabled.value = false;
      pomodoroLeft.value = pomodoroTotal.value;
    } else if (!pomodoroEnabled.value) {
      pomodoroEnabled.value = true;
      pomodoroLeft.value = pomodoroTotal.value;
    }
    if (pomodoroLeft.value > pomodoroTotal.value) pomodoroLeft.value = pomodoroTotal.value;
    if (!s4.water) {
      waterEnabled.value = false;
      waterLeft.value = waterTotal.value;
    } else if (!waterEnabled.value) {
      waterEnabled.value = true;
      waterLeft.value = waterTotal.value;
    }
    if (waterLeft.value > waterTotal.value) waterLeft.value = waterTotal.value;
    dbg("timers apply", { pomodoro: s4.pomodoro, water: s4.water, pMin: s4.pomodoroMinutes, wMin: s4.waterMinutes });
  }
  function tick() {
    if (pomodoroEnabled.value && pomodoroLeft.value > 0) {
      pomodoroLeft.value -= 1;
      if (pomodoroLeft.value === 0) {
        pomodoroEnabled.value = false;
        say("番茄钟结束啦，起来动一动～", 9e3);
        dbg("pomodoro done");
      } else if (pomodoroLeft.value === 300) {
        say("再坚持 5 分钟就完成一个番茄钟！", 6e3);
      }
    }
    if (waterEnabled.value && waterLeft.value > 0) {
      waterLeft.value -= 1;
      if (waterLeft.value === 0) {
        say("该喝水啦！咕嘟咕嘟～", 9e3);
        dbg("water reminder");
        const s4 = getState();
        waterLeft.value = Math.max(60, Math.round((s4?.settings.waterMinutes ?? 45) * 60));
      }
    }
  }
  function resetPomodoro() {
    pomodoroLeft.value = pomodoroTotal.value;
    pomodoroEnabled.value = true;
  }
  function pausePomodoro() {
    pomodoroEnabled.value = false;
  }
  function fmtClock(sec) {
    const m2 = Math.floor(Math.max(0, sec) / 60);
    const s4 = Math.max(0, sec) % 60;
    return `${String(m2).padStart(2, "0")}:${String(s4).padStart(2, "0")}`;
  }

  // ws:/src/api.ts
  var IDLE_POSES = ["idle", "idle2", "idle3"];
  function clone(s4) {
    return {
      ...s4,
      stats: { ...s4.stats },
      pos: { ...s4.pos },
      settings: { ...s4.settings },
      chat: s4.chat.slice(-40)
    };
  }
  function createPetApi(initial) {
    const s4 = tx(clone(initial));
    const bubble = tC("");
    const bubbleVisible = tC(false);
    const busy = tC(false);
    const tab = tC("chat");
    const dragging = tC(false);
    const models = tC([...FALLBACK_MODELS]);
    const keeperHidden = tC(0);
    const keeperDark = tC(false);
    const keeperReader = tC(false);
    const errorText = tC("");
    const usePageText = tC(true);
    const idleIdx = tC(0);
    const poseTicks = tC(0);
    const windowOpen = tC(false);
    const draft = tC("");
    const reactUntil = tC(0);
    const nowTick = tC(0);
    function react(ms = 6500) {
      reactUntil.value = Date.now() + ms;
    }
    function showBubble(text, ms = 4200) {
      bubble.value = text;
      bubbleVisible.value = true;
      LFRuntime.timeout(() => {
        bubbleVisible.value = false;
      }, ms);
    }
    function greeting() {
      const h2 = (/* @__PURE__ */ new Date()).getHours();
      if (h2 < 5) return "这么晚还没睡呀…我陪你。";
      if (h2 < 11) return "早上好！今天也一起加油～";
      if (h2 < 14) return "中午啦，记得吃饭哦。";
      if (h2 < 19) return "下午好～要不要摸摸我？";
      return "晚上好呀，今天辛苦啦！";
    }
    async function refreshModels() {
      models.value = await listChatModels();
    }
    async function init() {
      const st2 = await loadState();
      s4.value = clone(st2);
      setBubbleSink({ say: showBubble });
      subscribe((next) => {
        s4.value = clone(next);
      });
      watchRemoteState();
      applySettings(s4.value.settings);
      LFRuntime.interval(() => decayTick(), 3e4);
      LFRuntime.interval(() => {
        const cur = s4.value;
        if (cur.settings.chatter && !busy.value && Math.random() < 0.6) chatter();
      }, 11e4);
      LFRuntime.interval(() => {
        nowTick.value += 1;
      }, 1e3);
      LFRuntime.interval(() => tick(), 1e3);
      LFRuntime.interval(() => {
        poseTicks.value += 1;
        if (busy.value || dragging.value || mood.value !== "idle") return;
        let next = idleIdx.value;
        let guard = 0;
        while (next === idleIdx.value && guard++ < 8) next = Math.floor(Math.random() * IDLE_POSES.length);
        idleIdx.value = next;
        dbg("pose rotate", IDLE_POSES[next], "tick", poseTicks.value);
      }, 6e3);
      dbg("api ready", { name: s4.value.name, lv: s4.value.stats.level });
      showBubble(greeting(), 5200);
      if (!windowOpen.value) {
        LFRuntime.timeout(() => showBubble("双击我可以打开面板哦～", 5200), 5600);
      }
      void refreshModels();
    }
    function petClick() {
      react();
      petting();
    }
    function feedClick() {
      react();
      feed();
    }
    function playClick() {
      react();
      play();
    }
    function restClick() {
      react(3e3);
      rest();
    }
    function dragStart() {
      dragging.value = true;
      setInteracting(true);
    }
    function dragMove(x2, y2) {
      patch((st2) => {
        st2.pos = { x: clamp(x2, 0.04, 0.96), y: clamp(y2, 0.08, 0.94) };
      }, false);
    }
    function dragEnd() {
      dragging.value = false;
      setInteracting(false);
      void persistNow();
    }
    function setCollapsed(v2) {
      patch((st2) => {
        st2.collapsed = v2;
      });
      if (!v2) patch((st2) => {
        st2.lastActive = Date.now();
      });
    }
    function openWindow() {
      windowOpen.value = true;
      patch((st2) => {
        st2.lastActive = Date.now();
      });
      dbg("window opened");
    }
    function closeWindow() {
      if (!windowOpen.value) return;
      windowOpen.value = false;
      draft.value = "";
      tab.value = "chat";
      dbg("window closed", { draftCleared: true });
    }
    async function send(text) {
      const t10 = text.trim();
      if (!t10 || busy.value) return;
      errorText.value = "";
      const user = { role: "user", content: t10, at: Date.now() };
      patch((st2) => {
        st2.chat = [...st2.chat.slice(-30), user];
        st2.lastActive = Date.now();
      });
      busy.value = true;
      try {
        const cur = s4.value;
        const answer = await askAi(cur.chat.slice(0, -1), t10, {
          name: cur.name,
          modelId: cur.settings.modelId,
          pageText: usePageText.value ? collectPageText() : void 0
        });
        patch((st2) => {
          st2.chat = [...st2.chat.slice(-30), { role: "assistant", content: answer, at: Date.now() }];
        });
        addExp(2);
      } catch (e10) {
        errorText.value = errText(e10);
        dbgWarn("chat failed", String(e10));
      } finally {
        busy.value = false;
      }
    }
    function clearChat() {
      patch((st2) => {
        st2.chat = [];
      });
      showBubble("聊天记录清空啦。");
    }
    function clean() {
      const n2 = hideDistractions();
      keeperHidden.value = n2;
      showBubble(n2 ? `帮你去掉了 ${n2} 块干扰内容～` : "这个页面挺干净的呀。");
    }
    function undoClean() {
      const n2 = restoreHidden();
      keeperHidden.value = 0;
      showBubble(`把 ${n2} 块内容还回来了。`);
    }
    function darkToggle() {
      keeperDark.value = toggleDark();
      showBubble(keeperDark.value ? "暗色模式打开～" : "暗色模式关掉啦。");
    }
    function readerToggle() {
      keeperReader.value = toggleReader();
      showBubble(keeperReader.value ? "阅读模式，专心看文章吧。" : "回到普通模式。");
    }
    function readAloud() {
      const text = collectPageText(900);
      if (!text) return showBubble("这个页面没抓到什么文字…");
      speak(text);
      showBubble("念给你听～");
    }
    async function summarize() {
      if (busy.value) return;
      const text = collectPageText();
      if (text.length < 40) return showBubble("这个页面好像没什么内容可总结。");
      busy.value = true;
      errorText.value = "";
      try {
        const out = await summarizePage(text, { name: s4.value.name, modelId: s4.value.settings.modelId });
        tab.value = "chat";
        patch((st2) => {
          st2.chat = [
            ...st2.chat.slice(-30),
            { role: "user", content: "帮我总结这个页面", at: Date.now() },
            { role: "assistant", content: out, at: Date.now() }
          ];
        });
        addExp(3);
        showBubble("总结好啦，看聊天页～");
      } catch (e10) {
        errorText.value = errText(e10);
        dbgWarn("summarize failed", String(e10));
      } finally {
        busy.value = false;
      }
    }
    function rename(v2) {
      const name = v2.trim().slice(0, 12);
      if (!name) return;
      patch((st2) => {
        st2.name = name;
      });
      showBubble(`以后就叫我「${name}」吧！`);
    }
    function setModel(id2) {
      patch((st2) => {
        st2.settings.modelId = id2;
      });
      dbg("model set", id2);
    }
    function toggleSetting(k2) {
      patch((st2) => {
        st2.settings[k2] = !st2.settings[k2];
      });
      applySettings(s4.value.settings);
    }
    function setMinutes(k2, v2) {
      patch((st2) => {
        st2.settings[k2] = clamp(Math.round(v2), 5, 180);
      });
      applySettings(s4.value.settings);
    }
    async function doReset() {
      await resetState();
      s4.value = clone(getState());
      keeperHidden.value = 0;
      keeperDark.value = false;
      keeperReader.value = false;
      showBubble("重新开始啦，请多关照！");
    }
    const level = iF(() => s4.value.stats.level);
    const expPct = iF(() => Math.round(s4.value.stats.exp / expNeeded(s4.value.stats.level) * 100));
    const expText = iF(() => `${Math.round(s4.value.stats.exp)} / ${expNeeded(s4.value.stats.level)}`);
    const affection = iF(() => Math.round(s4.value.stats.affection));
    const hunger = iF(() => Math.round(s4.value.stats.hunger));
    const energy = iF(() => Math.round(s4.value.stats.energy));
    const mood = iF(() => {
      const st2 = s4.value;
      if (st2.stats.energy < 22 || st2.stats.hunger < 18) return "sleepy";
      void nowTick.value;
      if (Date.now() < reactUntil.value) return "happy";
      return "idle";
    });
    const sprite = iF(() => spriteUrl(pose.value));
    const pose = iF(() => mood.value === "idle" ? IDLE_POSES[idleIdx.value % IDLE_POSES.length] : mood.value);
    const poseDebug = iF(() => ({
      ticks: poseTicks.value,
      idleIdx: idleIdx.value,
      happy: Date.now() < reactUntil.value,
      mood: mood.value,
      pose: pose.value
    }));
    const pomodoroText = iF(() => fmtClock(pomodoroLeft.value));
    const waterText = iF(() => fmtClock(waterLeft.value));
    const pomodoroOn = iF(() => pomodoroEnabled.value);
    const waterOn = iF(() => waterEnabled.value);
    const api = {
      // 状态
      s: s4,
      bubble,
      bubbleVisible,
      busy,
      tab,
      dragging,
      models,
      keeperHidden,
      keeperDark,
      keeperReader,
      errorText,
      usePageText,
      pose,
      poseTicks,
      poseDebug,
      windowOpen,
      draft,
      // 派生
      level,
      expPct,
      expText,
      affection,
      hunger,
      energy,
      mood,
      sprite,
      pomodoroText,
      waterText,
      pomodoroOn,
      waterOn,
      // 动作
      init,
      send,
      clearChat,
      petClick,
      feedClick,
      playClick,
      restClick,
      dragStart,
      dragMove,
      dragEnd,
      setCollapsed,
      openWindow,
      closeWindow,
      clean,
      undoClean,
      darkToggle,
      readerToggle,
      readAloud,
      summarize,
      rename,
      setModel,
      toggleSetting,
      setMinutes,
      refreshModels,
      resetPomodoro,
      pausePomodoro,
      doReset,
      showBubble
    };
    return api;
  }
  var PET_API = /* @__PURE__ */ Symbol("petApi");

  // ws:/src/usePet.ts
  function usePet() {
    const api = nc(PET_API);
    if (!api) throw new Error("PET_API 未注入");
    return api;
  }

  // ws:/components/Sprite.vue
  var _hoisted_1 = { class: "pet-hop" };
  var _hoisted_2 = { class: "pet-motion" };
  var _hoisted_3 = ["src"];
  var __sfc__ = /* @__PURE__ */ nK({
    props: {
      pose: {},
      look: { default: () => ({ x: 0, y: 0 }) },
      width: { default: 64 }
    },
    setup(__props) {
      const props = __props;
      const POSES = ["idle", "idle2", "idle3", "happy", "sleepy"];
      const follow = iF(() => {
        const l2 = props.look ?? { x: 0, y: 0 };
        const w2 = props.width ?? 64;
        const k2 = w2 * 0.075;
        const tilt = l2.x * 4;
        return {
          transform: `translate3d(${(l2.x * k2).toFixed(2)}px, ${(l2.y * k2 * 0.55).toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`
        };
      });
      return (_ctx, _cache) => {
        return r1(), r3(
          "div",
          {
            class: Y(["pet-sprite", `pose-${__props.pose}`]),
            style: G({ width: __props.width + "px", ...follow.value })
          },
          [
            ir("div", _hoisted_1, [
              ir("div", _hoisted_2, [
                (r1(), r3(
                  rX,
                  null,
                  lF(POSES, (p2) => {
                    return ir("img", {
                      key: p2,
                      class: Y(["pet-frame", { current: p2 === __props.pose, anchor: p2 === "idle" }]),
                      src: tT(spriteUrl)(p2),
                      alt: "pet",
                      draggable: "false"
                    }, null, 10, _hoisted_3);
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ]),
            _cache[0] || (_cache[0] = ir(
              "div",
              { class: "pet-shadow" },
              null,
              -1
              /* CACHED */
            ))
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  });
  var Sprite_default = __sfc__;

  // ws:/components/ChatView.vue
  var _hoisted_12 = { class: "pet-chat" };
  var _hoisted_22 = { class: "pet-chat-tools" };
  var _hoisted_32 = { class: "pet-check" };
  var _hoisted_4 = {
    key: 0,
    class: "pet-tip"
  };
  var _hoisted_5 = { class: "pet-msg-avatar" };
  var _hoisted_6 = { class: "pet-msg-text" };
  var _hoisted_7 = {
    key: 1,
    class: "pet-msg"
  };
  var _hoisted_8 = { class: "pet-msg-avatar" };
  var _hoisted_9 = { class: "pet-quick" };
  var _hoisted_10 = ["disabled", "onClick"];
  var _hoisted_11 = { class: "pet-input-row" };
  var _hoisted_122 = ["disabled"];
  var __sfc__2 = /* @__PURE__ */ nK({
    setup(__props) {
      const pet = usePet();
      const listEl = tC(null);
      const quick = ["你现在在干嘛？", "帮我总结这个页面", "讲个冷笑话", "我今天有点累…"];
      async function scrollToEnd() {
        await t6();
        const el2 = listEl.value;
        if (el2) el2.scrollTop = el2.scrollHeight;
      }
      n_(() => pet.s.value.chat.length, () => void scrollToEnd());
      n_(() => pet.busy.value, () => void scrollToEnd());
      async function submit() {
        const t10 = pet.draft.value.trim();
        if (!t10 || pet.busy.value) return;
        pet.draft.value = "";
        await pet.send(t10);
      }
      function onKey(e10) {
        if (e10.key === "Enter" && !e10.shiftKey) {
          e10.preventDefault();
          void submit();
        }
      }
      function fmtTime(at) {
        const d2 = new Date(at);
        return `${String(d2.getHours()).padStart(2, "0")}:${String(d2.getMinutes()).padStart(2, "0")}`;
      }
      return (_ctx, _cache) => {
        return r1(), r3("div", _hoisted_12, [
          ir("div", _hoisted_22, [
            ir("label", _hoisted_32, [
              no(ir(
                "input",
                {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => tT(pet).usePageText.value = $event),
                  type: "checkbox"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [s1, tT(pet).usePageText.value]
              ]),
              _cache[3] || (_cache[3] = ia(
                " 让它看到当前页面 ",
                -1
                /* CACHED */
              ))
            ]),
            ir("button", {
              class: "pet-mini",
              onClick: _cache[1] || (_cache[1] = ($event) => tT(pet).clearChat())
            }, "清空记录")
          ]),
          ir(
            "div",
            {
              ref_key: "listEl",
              ref: listEl,
              class: "pet-chat-list"
            },
            [
              !tT(pet).s.value.chat.length ? (r1(), r3("div", _hoisted_4, " 还没有聊过天～试试下面的快捷问法，或者直接问我「这个页面在讲什么」。 ")) : ic("v-if", true),
              (r1(true), r3(
                rX,
                null,
                lF(tT(pet).s.value.chat, (m2, i10) => {
                  return r1(), r3(
                    "div",
                    {
                      key: i10,
                      class: Y(["pet-msg", m2.role])
                    },
                    [
                      ir(
                        "div",
                        _hoisted_5,
                        ea(m2.role === "user" ? "你" : tT(pet).s.value.name.slice(0, 1)),
                        1
                        /* TEXT */
                      ),
                      ir(
                        "div",
                        _hoisted_6,
                        ea(m2.content),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              tT(pet).busy.value ? (r1(), r3("div", _hoisted_7, [
                ir(
                  "div",
                  _hoisted_8,
                  ea(tT(pet).s.value.name.slice(0, 1)),
                  1
                  /* TEXT */
                ),
                _cache[4] || (_cache[4] = ir(
                  "div",
                  { class: "pet-msg-text" },
                  [
                    ir("span", { class: "pet-typing" }, [
                      ir("i"),
                      ir("i"),
                      ir("i")
                    ])
                  ],
                  -1
                  /* CACHED */
                ))
              ])) : ic("v-if", true)
            ],
            512
            /* NEED_PATCH */
          ),
          ir("div", _hoisted_9, [
            (r1(), r3(
              rX,
              null,
              lF(quick, (q2) => {
                return ir("button", {
                  key: q2,
                  class: "pet-chip",
                  disabled: tT(pet).busy.value,
                  onClick: ($event) => tT(pet).send(q2)
                }, ea(q2), 9, _hoisted_10);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ]),
          ir("div", _hoisted_11, [
            no(ir(
              "textarea",
              {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => tT(pet).draft.value = $event),
                class: "pet-input",
                rows: "2",
                placeholder: "和小人说点什么…（Enter 发送）",
                onKeydown: onKey
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [s0, tT(pet).draft.value]
            ]),
            ir("button", {
              class: "pet-send",
              disabled: tT(pet).busy.value || !tT(pet).draft.value.trim(),
              onClick: submit
            }, "发送", 8, _hoisted_122)
          ])
        ]);
      };
    }
  });
  var ChatView_default = __sfc__2;

  // ws:/components/CareView.vue
  var _hoisted_13 = { class: "pet-stat" };
  var _hoisted_23 = { class: "pet-stat-top" };
  var _hoisted_33 = { class: "pet-stat-bar aff" };
  var _hoisted_42 = { class: "pet-stat" };
  var _hoisted_52 = { class: "pet-stat-top" };
  var _hoisted_62 = { class: "pet-stat-bar hun" };
  var _hoisted_72 = { class: "pet-stat" };
  var _hoisted_82 = { class: "pet-stat-top" };
  var _hoisted_92 = { class: "pet-stat-bar ene" };
  var _hoisted_102 = { class: "pet-stat" };
  var _hoisted_112 = { class: "pet-stat-top" };
  var _hoisted_123 = { class: "pet-stat-bar exp" };
  var _hoisted_132 = { class: "pet-row" };
  var _hoisted_14 = { class: "pet-timer" };
  var _hoisted_15 = { class: "pet-timer-time" };
  var _hoisted_16 = { class: "pet-timer-sub" };
  var _hoisted_17 = { class: "pet-row" };
  var _hoisted_18 = { class: "pet-timer" };
  var _hoisted_19 = { class: "pet-timer-time" };
  var _hoisted_20 = { class: "pet-timer-sub" };
  var __sfc__3 = /* @__PURE__ */ nK({
    setup(__props) {
      const pet = usePet();
      return (_ctx, _cache) => {
        return r1(), r3("div", null, [
          ir("div", _hoisted_13, [
            ir("div", _hoisted_23, [
              _cache[7] || (_cache[7] = ir(
                "span",
                null,
                "好感度",
                -1
                /* CACHED */
              )),
              ir(
                "span",
                null,
                ea(tT(pet).affection.value) + " / 100",
                1
                /* TEXT */
              )
            ]),
            ir("div", _hoisted_33, [
              ir(
                "i",
                {
                  style: G({ width: tT(pet).affection.value + "%" })
                },
                null,
                4
                /* STYLE */
              )
            ])
          ]),
          ir("div", _hoisted_42, [
            ir("div", _hoisted_52, [
              _cache[8] || (_cache[8] = ir(
                "span",
                null,
                "饱食度",
                -1
                /* CACHED */
              )),
              ir(
                "span",
                null,
                ea(tT(pet).hunger.value) + " / 100",
                1
                /* TEXT */
              )
            ]),
            ir("div", _hoisted_62, [
              ir(
                "i",
                {
                  style: G({ width: tT(pet).hunger.value + "%" })
                },
                null,
                4
                /* STYLE */
              )
            ])
          ]),
          ir("div", _hoisted_72, [
            ir("div", _hoisted_82, [
              _cache[9] || (_cache[9] = ir(
                "span",
                null,
                "精力",
                -1
                /* CACHED */
              )),
              ir(
                "span",
                null,
                ea(tT(pet).energy.value) + " / 100",
                1
                /* TEXT */
              )
            ]),
            ir("div", _hoisted_92, [
              ir(
                "i",
                {
                  style: G({ width: tT(pet).energy.value + "%" })
                },
                null,
                4
                /* STYLE */
              )
            ])
          ]),
          ir("div", _hoisted_102, [
            ir("div", _hoisted_112, [
              _cache[10] || (_cache[10] = ir(
                "span",
                null,
                "经验",
                -1
                /* CACHED */
              )),
              ir(
                "span",
                null,
                ea(tT(pet).expText.value),
                1
                /* TEXT */
              )
            ]),
            ir("div", _hoisted_123, [
              ir(
                "i",
                {
                  style: G({ width: tT(pet).expPct.value + "%" })
                },
                null,
                4
                /* STYLE */
              )
            ])
          ]),
          _cache[11] || (_cache[11] = ir(
            "div",
            { class: "pet-label" },
            "互动",
            -1
            /* CACHED */
          )),
          ir("div", _hoisted_132, [
            ir("button", {
              class: "pet-btn primary",
              onClick: _cache[0] || (_cache[0] = ($event) => tT(pet).feedClick())
            }, "🍪 喂食"),
            ir("button", {
              class: "pet-btn",
              onClick: _cache[1] || (_cache[1] = ($event) => tT(pet).petClick())
            }, "🤚 摸摸"),
            ir("button", {
              class: "pet-btn",
              onClick: _cache[2] || (_cache[2] = ($event) => tT(pet).playClick())
            }, "🎾 陪玩"),
            ir("button", {
              class: "pet-btn",
              onClick: _cache[3] || (_cache[3] = ($event) => tT(pet).restClick())
            }, "💤 休息")
          ]),
          _cache[12] || (_cache[12] = ir(
            "div",
            { class: "pet-label" },
            "番茄钟",
            -1
            /* CACHED */
          )),
          ir("div", _hoisted_14, [
            ir("div", null, [
              ir(
                "div",
                _hoisted_15,
                ea(tT(pet).pomodoroText.value),
                1
                /* TEXT */
              ),
              ir(
                "div",
                _hoisted_16,
                ea(tT(pet).pomodoroOn.value ? "专注中…" : "已暂停"),
                1
                /* TEXT */
              )
            ]),
            ir("div", _hoisted_17, [
              ir("button", {
                class: "pet-btn",
                onClick: _cache[4] || (_cache[4] = ($event) => tT(pet).resetPomodoro())
              }, "开始 / 重置"),
              ir("button", {
                class: "pet-btn",
                onClick: _cache[5] || (_cache[5] = ($event) => tT(pet).pausePomodoro())
              }, "暂停")
            ])
          ]),
          _cache[13] || (_cache[13] = ir(
            "div",
            { class: "pet-label" },
            "喝水提醒",
            -1
            /* CACHED */
          )),
          ir("div", _hoisted_18, [
            ir("div", null, [
              ir(
                "div",
                _hoisted_19,
                ea(tT(pet).waterText.value),
                1
                /* TEXT */
              ),
              ir(
                "div",
                _hoisted_20,
                ea(tT(pet).waterOn.value ? "到点会提醒你" : "已关闭"),
                1
                /* TEXT */
              )
            ]),
            ir(
              "button",
              {
                class: "pet-btn",
                onClick: _cache[6] || (_cache[6] = ($event) => tT(pet).toggleSetting("water"))
              },
              ea(tT(pet).waterOn.value ? "关闭" : "开启"),
              1
              /* TEXT */
            )
          ]),
          _cache[14] || (_cache[14] = ir(
            "div",
            { class: "pet-tip" },
            "数值会随时间变化：饿了、困了好感会掉；常来陪它玩就会升级。",
            -1
            /* CACHED */
          ))
        ]);
      };
    }
  });
  var CareView_default = __sfc__3;

  // ws:/components/KeeperView.vue
  var _hoisted_110 = { class: "pet-row" };
  var _hoisted_24 = {
    key: 0,
    class: "pet-tip"
  };
  var _hoisted_34 = { class: "pet-row" };
  var _hoisted_43 = { class: "pet-row" };
  var _hoisted_53 = ["disabled"];
  var __sfc__4 = /* @__PURE__ */ nK({
    setup(__props) {
      const pet = usePet();
      return (_ctx, _cache) => {
        return r1(), r3("div", null, [
          _cache[6] || (_cache[6] = ir(
            "div",
            { class: "pet-label" },
            "清理干扰",
            -1
            /* CACHED */
          )),
          _cache[7] || (_cache[7] = ir(
            "div",
            { class: "pet-tip" },
            " 帮你把当前页面上的广告、悬浮窗、弹层、侧栏推荐收起来（不动正文）。真正关闭浏览器标签页需要扩展层权限，这里做的是脚本能做到的版本。 ",
            -1
            /* CACHED */
          )),
          ir("div", _hoisted_110, [
            ir("button", {
              class: "pet-btn primary",
              onClick: _cache[0] || (_cache[0] = ($event) => tT(pet).clean())
            }, "🧹 一键净化"),
            ir("button", {
              class: "pet-btn",
              onClick: _cache[1] || (_cache[1] = ($event) => tT(pet).undoClean())
            }, "↩️ 还原")
          ]),
          tT(pet).keeperHidden.value ? (r1(), r3(
            "div",
            _hoisted_24,
            "本次已隐藏 " + ea(tT(pet).keeperHidden.value) + " 块内容。",
            1
            /* TEXT */
          )) : ic("v-if", true),
          _cache[8] || (_cache[8] = ir(
            "div",
            { class: "pet-label" },
            "阅读体验",
            -1
            /* CACHED */
          )),
          ir("div", _hoisted_34, [
            ir(
              "button",
              {
                class: Y(["pet-btn", { primary: tT(pet).keeperDark.value }]),
                onClick: _cache[2] || (_cache[2] = ($event) => tT(pet).darkToggle())
              },
              " 🌙 暗色 " + ea(tT(pet).keeperDark.value ? "开" : "关"),
              3
              /* TEXT, CLASS */
            ),
            ir(
              "button",
              {
                class: Y(["pet-btn", { primary: tT(pet).keeperReader.value }]),
                onClick: _cache[3] || (_cache[3] = ($event) => tT(pet).readerToggle())
              },
              " 📖 阅读模式 " + ea(tT(pet).keeperReader.value ? "开" : "关"),
              3
              /* TEXT, CLASS */
            )
          ]),
          _cache[9] || (_cache[9] = ir(
            "div",
            { class: "pet-label" },
            "朗读与总结",
            -1
            /* CACHED */
          )),
          ir("div", _hoisted_43, [
            ir("button", {
              class: "pet-btn",
              onClick: _cache[4] || (_cache[4] = ($event) => tT(pet).readAloud())
            }, "🔊 念给我听"),
            ir("button", {
              class: "pet-btn",
              disabled: tT(pet).busy.value,
              onClick: _cache[5] || (_cache[5] = ($event) => tT(pet).summarize())
            }, "📝 AI 总结本页", 8, _hoisted_53)
          ]),
          _cache[10] || (_cache[10] = ir(
            "div",
            { class: "pet-tip" },
            "总结结果会出现在「聊天」页里；朗读使用系统语音，不会上传内容。",
            -1
            /* CACHED */
          ))
        ]);
      };
    }
  });
  var KeeperView_default = __sfc__4;

  // ws:/components/SettingsView.vue
  var _hoisted_111 = { class: "pet-field" };
  var _hoisted_25 = { class: "pet-field" };
  var _hoisted_35 = ["value"];
  var _hoisted_44 = ["value"];
  var _hoisted_54 = {
    class: "pet-row",
    style: { "justify-content": "flex-end" }
  };
  var _hoisted_63 = ["checked", "onChange"];
  var _hoisted_73 = { class: "pet-field" };
  var _hoisted_83 = ["value"];
  var _hoisted_93 = { class: "pet-field" };
  var _hoisted_103 = ["value"];
  var _hoisted_113 = { class: "pet-row" };
  var __sfc__5 = /* @__PURE__ */ nK({
    setup(__props) {
      const pet = usePet();
      const nameDraft = tC(pet.s.value.name);
      n_(
        () => pet.s.value.name,
        (v2) => {
          nameDraft.value = v2;
        }
      );
      const bools = [
        { key: "chatter", label: "自己冒话" },
        { key: "followCursor", label: "眼神跟随鼠标" },
        { key: "pomodoro", label: "番茄钟" }
      ];
      return (_ctx, _cache) => {
        return r1(), r3("div", null, [
          ir("div", _hoisted_111, [
            _cache[7] || (_cache[7] = ir(
              "span",
              null,
              "名字",
              -1
              /* CACHED */
            )),
            no(ir(
              "input",
              {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => nameDraft.value = $event),
                type: "text",
                maxlength: "12",
                onChange: _cache[1] || (_cache[1] = ($event) => tT(pet).rename(nameDraft.value))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [s0, nameDraft.value]
            ])
          ]),
          ir("div", _hoisted_25, [
            _cache[8] || (_cache[8] = ir(
              "span",
              null,
              "聊天模型",
              -1
              /* CACHED */
            )),
            ir("select", {
              value: tT(pet).s.value.settings.modelId,
              onChange: _cache[2] || (_cache[2] = ($event) => tT(pet).setModel($event.target.value))
            }, [
              (r1(true), r3(
                rX,
                null,
                lF(tT(pet).models.value, (m2) => {
                  return r1(), r3("option", {
                    key: m2.id,
                    value: m2.id
                  }, ea(m2.name), 9, _hoisted_44);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ], 40, _hoisted_35)
          ]),
          ir("div", _hoisted_54, [
            ir("button", {
              class: "pet-mini",
              onClick: _cache[3] || (_cache[3] = ($event) => tT(pet).refreshModels())
            }, "刷新模型列表")
          ]),
          _cache[9] || (_cache[9] = ir(
            "div",
            { class: "pet-label" },
            "开关",
            -1
            /* CACHED */
          )),
          (r1(), r3(
            rX,
            null,
            lF(bools, (b2) => {
              return ir("label", {
                key: b2.key,
                class: "pet-field"
              }, [
                ir(
                  "span",
                  null,
                  ea(b2.label),
                  1
                  /* TEXT */
                ),
                ir("input", {
                  type: "checkbox",
                  checked: tT(pet).s.value.settings[b2.key],
                  onChange: ($event) => tT(pet).toggleSetting(b2.key)
                }, null, 40, _hoisted_63)
              ]);
            }),
            64
            /* STABLE_FRAGMENT */
          )),
          _cache[10] || (_cache[10] = ir(
            "div",
            { class: "pet-label" },
            "时长",
            -1
            /* CACHED */
          )),
          ir("div", _hoisted_73, [
            ir(
              "span",
              null,
              "番茄钟 " + ea(tT(pet).s.value.settings.pomodoroMinutes) + " 分钟",
              1
              /* TEXT */
            ),
            ir("input", {
              type: "range",
              min: "5",
              max: "90",
              step: "5",
              value: tT(pet).s.value.settings.pomodoroMinutes,
              onInput: _cache[4] || (_cache[4] = ($event) => tT(pet).setMinutes("pomodoroMinutes", Number($event.target.value)))
            }, null, 40, _hoisted_83)
          ]),
          ir("div", _hoisted_93, [
            ir(
              "span",
              null,
              "喝水提醒 " + ea(tT(pet).s.value.settings.waterMinutes) + " 分钟",
              1
              /* TEXT */
            ),
            ir("input", {
              type: "range",
              min: "10",
              max: "120",
              step: "5",
              value: tT(pet).s.value.settings.waterMinutes,
              onInput: _cache[5] || (_cache[5] = ($event) => tT(pet).setMinutes("waterMinutes", Number($event.target.value)))
            }, null, 40, _hoisted_103)
          ]),
          _cache[11] || (_cache[11] = ir(
            "div",
            { class: "pet-label" },
            "存档",
            -1
            /* CACHED */
          )),
          _cache[12] || (_cache[12] = ir(
            "div",
            { class: "pet-tip" },
            " 存档由后台在所有网站之间共享同一份：换页面、关掉页面再打开，等级和好感都还在。 ",
            -1
            /* CACHED */
          )),
          ir("div", _hoisted_113, [
            ir("button", {
              class: "pet-btn",
              onClick: _cache[6] || (_cache[6] = ($event) => tT(pet).doReset())
            }, "重置宠物")
          ])
        ]);
      };
    }
  });
  var SettingsView_default = __sfc__5;

  // ws:/components/PetWindow.vue
  var _hoisted_114 = ["title"];
  var _hoisted_26 = { class: "pet-lv-badge" };
  var _hoisted_36 = { class: "pet-head-info" };
  var _hoisted_45 = { class: "pet-name" };
  var _hoisted_55 = { class: "pet-lv" };
  var _hoisted_64 = { class: "pet-exp" };
  var _hoisted_74 = { class: "pet-exp-text" };
  var _hoisted_84 = { class: "pet-head-btns" };
  var _hoisted_94 = { class: "pet-tabs" };
  var _hoisted_104 = ["onClick"];
  var _hoisted_115 = { class: "pet-tab-ico" };
  var _hoisted_124 = { class: "pet-body" };
  var _hoisted_133 = {
    key: 0,
    class: "pet-error"
  };
  var SPRITE_RATIO = 498 / 337;
  var PET_W_BIG = 124;
  var PET_W_SMALL = 92;
  var CARD_W = 360;
  var CARD_H = 580;
  var __sfc__6 = /* @__PURE__ */ nK({
    setup(__props) {
      const pet = usePet();
      const look = tC({ x: 0, y: 0 });
      const petEl = tC(null);
      const cardEl = tC(null);
      const vw = tC(window.innerWidth);
      const vh = tC(window.innerHeight);
      function measure() {
        const de = document.documentElement;
        vw.value = de.clientWidth || window.innerWidth;
        vh.value = de.clientHeight || window.innerHeight;
      }
      const tabs = [
        { key: "chat", label: "聊天", ico: "💬" },
        { key: "care", label: "养成", ico: "🍪" },
        { key: "keeper", label: "管家", ico: "🧹" },
        { key: "settings", label: "设置", ico: "⚙️" }
      ];
      function clamp2(v2, lo, hi) {
        return v2 < lo ? lo : v2 > hi ? hi : v2;
      }
      const petW = iF(() => pet.s.value.collapsed ? PET_W_SMALL : PET_W_BIG);
      const layout = iF(() => {
        const w2 = petW.value;
        const h2 = Math.round(w2 * SPRITE_RATIO);
        const px = pet.s.value.pos.x * vw.value;
        const py = pet.s.value.pos.y * vh.value;
        const petLeft = clamp2(px - w2 / 2, 4, Math.max(4, vw.value - w2 - 4));
        const petTop = clamp2(py - h2 / 2, 4, Math.max(4, vh.value - h2 - 4));
        const cardW = Math.min(CARD_W, vw.value - 20);
        const cardH = Math.min(CARD_H, vh.value - 16);
        let cardLeft = petLeft - cardW - 12;
        if (cardLeft < 8) cardLeft = petLeft + w2 + 12;
        if (cardLeft + cardW > vw.value - 8) cardLeft = Math.max(8, vw.value - cardW - 8);
        const cardTop = clamp2(petTop + h2 / 2 - cardH / 2, 8, Math.max(8, vh.value - cardH - 8));
        return { w: w2, h: h2, petLeft, petTop, cardW, cardH, cardLeft, cardTop };
      });
      const anchorStyle = iF(() => ({
        left: `${layout.value.petLeft}px`,
        top: `${layout.value.petTop}px`
      }));
      const bubbleSide = iF(() => {
        const center = layout.value.petLeft + layout.value.w / 2;
        if (center > vw.value * 0.62) return "right";
        if (center < vw.value * 0.38) return "left";
        return "center";
      });
      const cardStyle = iF(() => ({
        left: `${layout.value.cardLeft - layout.value.petLeft}px`,
        top: `${layout.value.cardTop - layout.value.petTop}px`,
        width: `${layout.value.cardW}px`,
        maxHeight: `${layout.value.cardH}px`
      }));
      function onResize() {
        measure();
      }
      function onMouseMove(e10) {
        if (!pet.s.value.settings.followCursor) {
          if (look.value.x !== 0 || look.value.y !== 0) look.value = { x: 0, y: 0 };
          return;
        }
        const el2 = petEl.value;
        if (!el2) return;
        const r10 = el2.getBoundingClientRect();
        const cx2 = r10.left + r10.width / 2;
        const cy = r10.top + r10.height * 0.32;
        const dx = Math.max(-1, Math.min(1, (e10.clientX - cx2) / 260));
        const dy = Math.max(-1, Math.min(1, (e10.clientY - cy) / 260));
        look.value = { x: dx, y: dy };
      }
      let dragFrom = null;
      let movedDuringDrag = false;
      function startDrag(e10) {
        const el2 = petEl.value;
        if (!el2) return;
        const r10 = el2.getBoundingClientRect();
        dragFrom = { x: e10.clientX - r10.left, y: e10.clientY - r10.top };
        movedDuringDrag = false;
        pet.dragStart();
        e10.currentTarget.setPointerCapture?.(e10.pointerId);
      }
      function moveDrag(e10) {
        if (!pet.dragging.value || !dragFrom) return;
        const w2 = layout.value.w;
        const h2 = layout.value.h;
        const left = clamp2(e10.clientX - dragFrom.x, 2, vw.value - w2 - 2);
        const top = clamp2(e10.clientY - dragFrom.y, 2, vh.value - h2 - 2);
        if (Math.abs(left - layout.value.petLeft) > 1 || Math.abs(top - layout.value.petTop) > 1) movedDuringDrag = true;
        pet.dragMove((left + w2 / 2) / vw.value, (top + h2 / 2) / vh.value);
      }
      function endDrag() {
        if (!pet.dragging.value || !dragFrom) return;
        dragFrom = null;
        pet.dragEnd();
        LFRuntime.timeout(() => {
          movedDuringDrag = false;
        }, 60);
      }
      let lastToggleAt = 0;
      function clickPet() {
        if (pet.dragging.value || movedDuringDrag) return;
        if (Date.now() - lastToggleAt < 400) return;
        pet.petClick();
      }
      function dblclickPet() {
        lastToggleAt = Date.now();
        if (pet.windowOpen.value) pet.closeWindow();
        else pet.openWindow();
      }
      function inPath(el2, path) {
        return !!el2 && path.indexOf(el2) >= 0;
      }
      function onWindowPointerDown(e10) {
        if (!pet.windowOpen.value || pet.dragging.value) return;
        const path = typeof e10.composedPath === "function" ? e10.composedPath() : [];
        if (inPath(cardEl.value, path) || inPath(petEl.value, path)) return;
        pet.closeWindow();
      }
      ly(() => {
        measure();
        window.addEventListener("resize", onResize);
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("pointerdown", onWindowPointerDown, true);
        window.addEventListener("pointermove", moveDrag);
        window.addEventListener("pointerup", endDrag);
        window.addEventListener("pointercancel", endDrag);
      });
      lC(() => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("pointerdown", onWindowPointerDown, true);
        window.removeEventListener("pointermove", moveDrag);
        window.removeEventListener("pointerup", endDrag);
        window.removeEventListener("pointercancel", endDrag);
      });
      return (_ctx, _cache) => {
        return r1(), r3(
          "div",
          {
            class: "pet-anchor",
            style: G(anchorStyle.value)
          },
          [
            ic(" 小人：始终常驻，不随悬浮窗开关而消失 "),
            ir("div", {
              ref_key: "petEl",
              ref: petEl,
              class: "pet-pet",
              style: G({ width: layout.value.w + "px", height: layout.value.h + "px" }),
              title: tT(pet).windowOpen.value ? "拖动我 · 单击摸摸 · 双击收起面板" : "拖动我 · 单击摸摸 · 双击打开面板",
              onPointerdown: startDrag,
              onClick: clickPet,
              onDblclick: dblclickPet
            }, [
              ii(Sprite_default, {
                pose: tT(pet).pose.value,
                look: look.value,
                width: petW.value
              }, null, 8, ["pose", "look", "width"]),
              ir(
                "span",
                _hoisted_26,
                "Lv." + ea(tT(pet).level.value),
                1
                /* TEXT */
              ),
              ii(i4, { name: "bubble" }, {
                default: ns(() => [
                  tT(pet).bubbleVisible.value ? (r1(), r3(
                    "div",
                    {
                      key: 0,
                      class: Y(["pet-bubble", `side-${bubbleSide.value}`])
                    },
                    ea(tT(pet).bubble.value),
                    3
                    /* TEXT, CLASS */
                  )) : ic("v-if", true)
                ]),
                _: 1
                /* STABLE */
              })
            ], 44, _hoisted_114),
            ic(" 悬浮窗：双击小人打开，点击其他区域 / 再双击 / 右上 ✕ 关闭 "),
            tT(pet).windowOpen.value ? (r1(), r3(
              "div",
              {
                key: 0,
                ref_key: "cardEl",
                ref: cardEl,
                class: "pet-card",
                style: G(cardStyle.value)
              },
              [
                ir(
                  "div",
                  {
                    class: "pet-head",
                    onPointerdown: startDrag,
                    onPointermove: moveDrag,
                    onPointerup: endDrag,
                    onPointercancel: endDrag
                  },
                  [
                    ir("div", {
                      class: "pet-avatar",
                      onClick: clickPet,
                      title: "摸摸我"
                    }, [
                      ii(Sprite_default, {
                        pose: tT(pet).pose.value,
                        look: look.value,
                        width: 52
                      }, null, 8, ["pose", "look"])
                    ]),
                    ir("div", _hoisted_36, [
                      ir("div", _hoisted_45, [
                        ir(
                          "span",
                          null,
                          ea(tT(pet).s.value.name),
                          1
                          /* TEXT */
                        ),
                        ir(
                          "span",
                          _hoisted_55,
                          "Lv." + ea(tT(pet).level.value),
                          1
                          /* TEXT */
                        )
                      ]),
                      ir("div", _hoisted_64, [
                        ir(
                          "i",
                          {
                            style: G({ width: tT(pet).expPct.value + "%" })
                          },
                          null,
                          4
                          /* STYLE */
                        )
                      ]),
                      ir(
                        "div",
                        _hoisted_74,
                        "经验 " + ea(tT(pet).expText.value) + " · 好感 " + ea(tT(pet).affection.value),
                        1
                        /* TEXT */
                      )
                    ]),
                    ir("div", _hoisted_84, [
                      ir(
                        "button",
                        {
                          class: "pet-icon-btn",
                          title: "关闭面板",
                          onPointerdown: _cache[0] || (_cache[0] = ol(() => {
                          }, ["stop"])),
                          onClick: _cache[1] || (_cache[1] = ($event) => tT(pet).closeWindow())
                        },
                        "✕",
                        32
                        /* NEED_HYDRATION */
                      )
                    ])
                  ],
                  32
                  /* NEED_HYDRATION */
                ),
                ir("div", _hoisted_94, [
                  (r1(), r3(
                    rX,
                    null,
                    lF(tabs, (t10) => {
                      return ir("button", {
                        key: t10.key,
                        class: Y({ active: tT(pet).tab.value === t10.key }),
                        onClick: ($event) => tT(pet).tab.value = t10.key
                      }, [
                        ir(
                          "span",
                          _hoisted_115,
                          ea(t10.ico),
                          1
                          /* TEXT */
                        ),
                        ir(
                          "span",
                          null,
                          ea(t10.label),
                          1
                          /* TEXT */
                        )
                      ], 10, _hoisted_104);
                    }),
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ]),
                ir("div", _hoisted_124, [
                  tT(pet).errorText.value ? (r1(), r3(
                    "div",
                    _hoisted_133,
                    ea(tT(pet).errorText.value),
                    1
                    /* TEXT */
                  )) : ic("v-if", true),
                  tT(pet).tab.value === "chat" ? (r1(), r5(ChatView_default, { key: 1 })) : tT(pet).tab.value === "care" ? (r1(), r5(CareView_default, { key: 2 })) : tT(pet).tab.value === "keeper" ? (r1(), r5(KeeperView_default, { key: 3 })) : (r1(), r5(SettingsView_default, { key: 4 }))
                ])
              ],
              4
              /* STYLE */
            )) : ic("v-if", true)
          ],
          4
          /* STYLE */
        );
      };
    }
  });
  var PetWindow_default = __sfc__6;

  // ws:/src/css.ts
  var SHADOW_CSS = `
:host, .lf-pet-root { all: initial; }
* { box-sizing: border-box; font-family: -apple-system, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif; }

.pet-anchor { position: fixed; width: 0; height: 0; pointer-events: none; }
.pet-anchor > * { pointer-events: auto; }

/* ---------- 常驻的小人本体 ---------- */
.pet-pet {
  position: absolute; left: 0; top: 0;
  cursor: grab; touch-action: none; user-select: none;
  display: flex; align-items: flex-end; justify-content: center;
}
.pet-pet:active { cursor: grabbing; }
.pet-lv-badge {
  position: absolute; right: 0; bottom: 2px;
  background: #ff6fa5; color: #fff; font-size: 10px; font-weight: 700;
  padding: 1px 6px; border-radius: 999px; box-shadow: 0 2px 6px rgba(0,0,0,.2);
  pointer-events: none;
}

/* ---------- 立绘 ----------
   三层 transform 叠加，全部走合成器（只动 transform/opacity），实测稳定 60fps：
   1) .pet-sprite 外层  —— 眼睛跟随鼠标（内联 transform，带极短缓动）
   2) .pet-hop   中层  —— 偶发小跳（长周期，平时几乎不动）
   3) .pet-motion 内层 —— 常态浮动 + 轻微左右摆动（永不停）
   刻意不使用 scale 缩放，改用位移+旋转做"呼吸感"，避免立绘一鼓一鼓的收缩。 */
.pet-sprite { position: relative; display: block; transition: transform .12s linear; will-change: transform; }
.pet-sprite img { width: 100%; height: auto; display: block; user-select: none; -webkit-user-drag: none;
  filter: drop-shadow(0 5px 9px rgba(120, 60, 100, .26)); }
.pet-hop, .pet-motion { position: relative; display: block; }
.pet-motion { animation: pet-float 3.1s cubic-bezier(.45, 0, .55, 1) infinite; will-change: transform; }
.pet-hop { animation: pet-hop-soft 9.4s ease-in-out infinite; will-change: transform; }
/* 高兴：小跳频率拉高 */
.pet-sprite.pose-happy .pet-hop { animation: pet-hop-happy 1.05s cubic-bezier(.4, 0, .5, 1) infinite; }
.pet-sprite.pose-happy .pet-motion { animation-duration: 1.7s; }
/* 困倦：慢速左右轻摆，保留一点"还在动"的生气 */
.pet-sprite.pose-sleepy .pet-motion { animation: pet-sway-slow 5.6s ease-in-out infinite; }
.pet-sprite.pose-sleepy .pet-hop { animation: none; }
.pet-sprite.pose-sleepy img { filter: drop-shadow(0 5px 9px rgba(120, 60, 100, .26)) saturate(.86); }

/* 姿态交叉淡化：几张图叠在同一位置换 opacity，切换时不会闪白也不会撑高容器 */
.pet-frame { position: absolute; top: 0; left: 0; width: 100%; height: auto; opacity: 0; transition: opacity .45s ease; }
.pet-frame.anchor { position: relative; }
.pet-frame.current { opacity: 1; }

/* 地面阴影：与浮动同频呼吸，让小人"站得住" */
.pet-shadow {
  position: absolute; left: 50%; bottom: 1px; width: 60%; height: 9px; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(120, 60, 100, .3), rgba(120, 60, 100, 0) 70%);
  animation: pet-shadow-pulse 3.1s cubic-bezier(.45, 0, .55, 1) infinite;
}
@keyframes pet-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  25% { transform: translate3d(-1.6px, -3.2px, 0) rotate(-.7deg); }
  50% { transform: translate3d(0, -5.4px, 0) rotate(0deg); }
  75% { transform: translate3d(1.6px, -3.2px, 0) rotate(.7deg); }
}
@keyframes pet-hop-soft {
  0%, 84%, 100% { transform: translate3d(0, 0, 0); }
  88% { transform: translate3d(0, -10px, 0); }
  91% { transform: translate3d(0, -1.5px, 0); }
  94% { transform: translate3d(0, -4px, 0); }
}
@keyframes pet-hop-happy {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -8px, 0); }
}
@keyframes pet-sway-slow {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-.9deg); }
  50% { transform: translate3d(0, -2px, 0) rotate(.9deg); }
}
@keyframes pet-shadow-pulse {
  0%, 100% { transform: translateX(-50%) scale(1, 1); opacity: .9; }
  50% { transform: translateX(-50%) scale(.86, .78); opacity: .6; }
}
@media (prefers-reduced-motion: reduce) {
  .pet-motion, .pet-hop, .pet-shadow { animation: none !important; }
  .pet-frame { transition: none; }
}

/* ---------- 气泡 ---------- */
/* 气泡按小人所在的左右位置贴边对齐，避免小人靠着视口边缘时被切掉 */
.pet-bubble {
  position: absolute; bottom: calc(100% + 10px);
  background: #fff; color: #3a2f3a; font-size: 13px; line-height: 1.45;
  padding: 9px 12px; border-radius: 14px; width: max-content; max-width: min(260px, 70vw);
  border: 1px solid rgba(255,111,165,.45);
  box-shadow: 0 8px 20px rgba(150, 90, 130, .22);
}
.pet-bubble.side-center { left: 50%; transform: translateX(-50%); }
.pet-bubble.side-right { right: 0; }
.pet-bubble.side-left { left: 0; }
.pet-bubble::after {
  content: ''; position: absolute; bottom: -6px; width: 10px; height: 10px;
  background: #fff; border-right: 1px solid rgba(255,111,165,.45); border-bottom: 1px solid rgba(255,111,165,.45);
  transform: rotate(45deg);
}
.pet-bubble.side-center::after { left: 50%; margin-left: -5px; }
.pet-bubble.side-right::after { right: 26px; }
.pet-bubble.side-left::after { left: 26px; }
.bubble-enter-active, .bubble-leave-active { transition: opacity .22s; }
.bubble-enter-from, .bubble-leave-to { opacity: 0; }

/* ---------- 主卡片 ---------- */
.pet-card {
  position: absolute; width: min(360px, calc(100vw - 20px));
  max-height: min(76vh, 640px); display: flex; flex-direction: column;
  background: #fff7fb; color: #3a2f3a; border-radius: 18px;
  border: 1px solid rgba(255,111,165,.38);
  box-shadow: 0 14px 36px rgba(120, 60, 100, .26);
  overflow: hidden; font-size: 13px;
}
.pet-head {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  background: linear-gradient(135deg, #ffe3f0, #e8fbf9);
  border-bottom: 1px solid rgba(255,111,165,.28); cursor: grab; touch-action: none; user-select: none;
}
.pet-head:active { cursor: grabbing; }
.pet-avatar { width: 54px; flex: 0 0 54px; }
.pet-head-info { flex: 1 1 auto; min-width: 0; }
.pet-name { font-weight: 700; font-size: 14px; color: #52324a; display: flex; align-items: center; gap: 6px; }
.pet-lv { font-size: 10px; background: #ff6fa5; color: #fff; border-radius: 999px; padding: 1px 7px; font-weight: 700; }
.pet-exp { height: 6px; background: rgba(82,50,74,.14); border-radius: 999px; overflow: hidden; margin: 5px 0 3px; }
.pet-exp > i { display: block; height: 100%; background: linear-gradient(90deg, #ffb3d1, #ff6fa5); transition: width .3s; }
.pet-exp-text { font-size: 10px; color: #8b7d8b; }
.pet-head-btns { display: flex; gap: 4px; }
.pet-icon-btn {
  border: none; background: rgba(255,255,255,.75); color: #8b5a78; cursor: pointer;
  width: 26px; height: 26px; border-radius: 9px; font-size: 14px; line-height: 1;
}
.pet-icon-btn:hover { background: #fff; }

/* ---------- 标签页 ---------- */
.pet-tabs { display: flex; background: rgba(255,255,255,.6); border-bottom: 1px solid rgba(255,111,165,.2); }
.pet-tabs button {
  flex: 1; border: none; background: transparent; cursor: pointer; padding: 8px 2px 7px;
  font-size: 11px; color: #8b7d8b; display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.pet-tabs button.active { color: #d9447a; font-weight: 700; box-shadow: inset 0 -2px 0 #ff6fa5; }
.pet-tab-ico { font-size: 14px; }

.pet-body { flex: 1 1 auto; overflow: auto; padding: 10px 12px 12px; }
.pet-body::-webkit-scrollbar { width: 6px; }
.pet-body::-webkit-scrollbar-thumb { background: rgba(255,111,165,.4); border-radius: 999px; }

/* ---------- 通用 ---------- */
.pet-row { display: flex; gap: 6px; flex-wrap: wrap; }
.pet-btn {
  border: 1px solid rgba(255,111,165,.45); background: #fff; color: #d9447a; cursor: pointer;
  padding: 6px 11px; border-radius: 999px; font-size: 12px; font-weight: 600;
}
.pet-btn:hover:not(:disabled) { background: #ffeef6; }
.pet-btn:disabled { opacity: .5; cursor: not-allowed; }
.pet-btn.primary { background: #ff6fa5; color: #fff; border-color: #ff6fa5; }
.pet-btn.primary:hover:not(:disabled) { background: #ff5b99; }
.pet-mini { border: none; background: transparent; color: #8b7d8b; font-size: 11px; cursor: pointer; text-decoration: underline; }
.pet-block { display: block; }
.pet-tip { color: #8b7d8b; font-size: 12px; line-height: 1.6; padding: 6px 2px; }
.pet-label { font-size: 11px; color: #8b7d8b; margin: 10px 0 4px; font-weight: 600; }
.pet-error {
  background: #fff0f0; color: #c0392b; border: 1px solid rgba(192,57,43,.3);
  border-radius: 10px; padding: 6px 9px; font-size: 11px; margin-bottom: 8px;
}

/* ---------- 数值条 ---------- */
.pet-stat { margin-bottom: 8px; }
.pet-stat-top { display: flex; justify-content: space-between; font-size: 11px; color: #6d5a6a; margin-bottom: 3px; }
.pet-stat-bar { height: 8px; background: rgba(82,50,74,.12); border-radius: 999px; overflow: hidden; }
.pet-stat-bar > i { display: block; height: 100%; border-radius: 999px; transition: width .3s; }
.pet-stat-bar.aff i { background: linear-gradient(90deg, #ffc2dd, #ff5f9e); }
.pet-stat-bar.hun i { background: linear-gradient(90deg, #ffe0a3, #ffa726); }
.pet-stat-bar.ene i { background: linear-gradient(90deg, #b6f0e6, #2fc4b2); }
.pet-stat-bar.exp i { background: linear-gradient(90deg, #c5c8ff, #7a7ff0); }

/* ---------- 聊天 ---------- */
.pet-chat { display: flex; flex-direction: column; gap: 8px; }
.pet-chat-list { max-height: 210px; overflow: auto; display: flex; flex-direction: column; gap: 7px; padding-right: 2px; }
.pet-chat-list::-webkit-scrollbar { width: 5px; }
.pet-chat-list::-webkit-scrollbar-thumb { background: rgba(255,111,165,.35); border-radius: 999px; }
.pet-msg { display: flex; gap: 6px; align-items: flex-start; }
.pet-msg.user { flex-direction: row-reverse; }
.pet-msg-avatar {
  flex: 0 0 22px; width: 22px; height: 22px; border-radius: 50%; background: #ff6fa5; color: #fff;
  font-size: 11px; display: flex; align-items: center; justify-content: center; font-weight: 700;
}
.pet-msg-text {
  background: #fff; border: 1px solid rgba(255,111,165,.25); border-radius: 12px;
  padding: 7px 10px; max-width: 78%; line-height: 1.55; white-space: pre-wrap; word-break: break-word;
}
.pet-msg.user .pet-msg-text { background: #ffe8f2; border-color: rgba(255,111,165,.45); }
.pet-typing { display: flex; gap: 4px; padding: 10px; }
.pet-typing i { width: 5px; height: 5px; border-radius: 50%; background: #ff6fa5; animation: pet-blink 1s infinite; }
.pet-typing i:nth-child(2) { animation-delay: .16s; }
.pet-typing i:nth-child(3) { animation-delay: .32s; }
@keyframes pet-blink { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
.pet-chat-tools { display: flex; justify-content: space-between; align-items: center; }
.pet-check { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #6d5a6a; cursor: pointer; }
.pet-quick { display: flex; gap: 5px; flex-wrap: wrap; }
.pet-chip {
  border: 1px dashed rgba(255,111,165,.55); background: #fff; color: #d9447a; font-size: 11px;
  padding: 3px 8px; border-radius: 999px; cursor: pointer;
}
.pet-chip:disabled { opacity: .5; }
.pet-input-row { display: flex; gap: 6px; align-items: flex-end; }
.pet-input {
  flex: 1; resize: none; border: 1px solid rgba(255,111,165,.4); border-radius: 12px;
  padding: 7px 9px; font-size: 12px; font-family: inherit; color: #3a2f3a; background: #fff; outline: none;
}
.pet-input:focus { border-color: #ff6fa5; }
.pet-send {
  border: none; background: #ff6fa5; color: #fff; border-radius: 12px; padding: 8px 12px;
  font-size: 12px; font-weight: 700; cursor: pointer; height: 34px;
}
.pet-send:disabled { opacity: .5; cursor: not-allowed; }

/* ---------- 表单 ---------- */
.pet-field { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 8px 0; }
.pet-field > span { font-size: 12px; color: #6d5a6a; }
.pet-field input[type="text"], .pet-field select, .pet-field input[type="number"] {
  border: 1px solid rgba(255,111,165,.4); border-radius: 9px; padding: 5px 8px; font-size: 12px;
  color: #3a2f3a; background: #fff; outline: none; max-width: 150px; font-family: inherit;
}
.pet-field input[type="range"] { accent-color: #ff6fa5; max-width: 130px; }
.pet-switch { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6d5a6a; cursor: pointer; }
.pet-switch input { accent-color: #ff6fa5; width: 15px; height: 15px; }
.pet-timer {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  background: #fff; border: 1px solid rgba(255,111,165,.25); border-radius: 12px; padding: 8px 10px; margin-bottom: 8px;
}
.pet-timer-time { font-variant-numeric: tabular-nums; font-weight: 700; font-size: 15px; color: #d9447a; }
.pet-timer-sub { font-size: 10px; color: #8b7d8b; }
`;

  // ws:/src/mount.ts
  var ROOT_ID = "lf-pet-root";
  function bootstrap() {
    LFRuntime.mountHot("pet-panel", (hot) => {
      if (LFRuntime.executionEnvironment !== "page") {
        dbgWarn("非页面环境，跳过面板挂载", LFRuntime.executionEnvironment);
        return;
      }
      const root = LFDOM.createFloatingRoot({ id: ROOT_ID, className: "lf-pet-root", zIndex: 2147483e3 });
      root.style.cssText = "position:fixed;left:0;top:0;right:auto;bottom:auto;max-width:none;width:0;height:0;pointer-events:none;z-index:2147483000;";
      let shadow = root.shadowRoot;
      if (!shadow) shadow = root.attachShadow({ mode: "open" });
      const sh = shadow;
      while (sh.firstChild) sh.removeChild(sh.firstChild);
      const style = document.createElement("style");
      style.textContent = SHADOW_CSS;
      sh.appendChild(style);
      const host = document.createElement("div");
      host.id = "lf-pet-app";
      sh.appendChild(host);
      const api = createPetApi(createDefaultState());
      const app = of(PetWindow_default);
      app.provide(PET_API, api);
      app.config.errorHandler = (err, _inst, info) => {
        dbgWarn("vue error", info, String(err));
        console.error("[pet] vue error", info, err);
      };
      try {
        app.mount(host);
        dbg("panel mounted", { shadow: !!sh, host: !!host, htmlLen: host.innerHTML.length });
      } catch (e10) {
        console.error("[pet] mount failed", e10);
        dbgWarn("mount failed", String(e10));
        throw e10;
      }
      hot.onDispose(() => {
        try {
          app.unmount();
        } catch (e10) {
          dbg("unmount failed", String(e10));
        }
        while (sh.firstChild) sh.removeChild(sh.firstChild);
      });
      void api.init();
      return host;
    });
  }

  // ws:/extension-src/content.ts
  Object.assign(globalThis, lf_shim_exports);
  bootstrap();
})();
