// Compiles a dart2wasm-generated main module from `source` which can then
// be instantiated via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm module from `bytes` which is then
// instantiable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredModules` is a JS function that takes an array of module names
  //   matching wasm files produced by the dart2wasm compiler. It also takes a
  //   callback that should be invoked for each loaded module with 2 arguments:
  //   (1) the module name, (2) the loaded module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The callback
  //   returns a Promise that resolves when the module is instantiated.
  //   loadDeferredModules should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  // `loadDeferredId` is a JS function that takes load ID produced by the
  //   compiler when the `use-load-ids` option is passed. Each load ID maps to
  //   one or more wasm files as specified in the emitted JSON file. It also
  //   takes a callback that should be invoked for each loaded module with 2
  //   arguments: (1) the module name, (2) the loaded module in a format
  //   supported by `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  //   The callback returns a Promise that resolves when the module is
  //   instantiated.
  //   loadDeferredId should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  async instantiate(additionalImports, {loadDeferredModules, loadDeferredId} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            AB: x0 => new Int16Array(x0),
      AC: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      AD: (x0,x1,x2) => x0.setAttribute(x1,x2),
      AE: (x0,x1) => x0.matchMedia(x1),
      AF: x0 => x0.tiltY,
      AG: x0 => x0.v8BreakIterator,
      AH: (x0,x1) => { x0.value = x1 },
      AI: (x0,x1,x2) => x0.insertBefore(x1,x2),
      AJ: x0 => x0.name,
      AK: (x0,x1) => { x0.loop = x1 },
      AL: x0 => x0.getReader(),
      B: s => printToConsole(s),
      BB: x0 => new Uint16Array(x0),
      BC: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      BD: x0 => x0.getBoundingClientRect(),
      BE: x0 => x0.matches,
      BF: x0 => x0.tiltX,
      BG: () => globalThis.Intl,
      BH: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      BI: x0 => x0.id,
      BJ: x0 => x0.repetitionCount,
      BK: (x0,x1) => { x0.src = x1 },
      BL: x0 => x0.read(),
      C: Function.prototype.call.bind(Number.prototype.toString),
      CB: x0 => new Int32Array(x0),
      CC: (x0,x1) => x0.querySelector(x1),
      CD: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      CE: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      CF: x0 => x0.pointerType,
      CG: (x0,x1) => x0.segment(x1),
      CH: (x0,x1) => { x0.value = x1 },
      CI: x0 => x0.offsetHeight,
      CJ: x0 => x0.frameCount,
      CK: x0 => x0.message,
      CL: x0 => x0.value,
      D: Function.prototype.call.bind(BigInt.prototype.toString),
      DB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      DC: (x0,x1) => x0.item(x1),
      DD: s => new Date(s * 1000).getTimezoneOffset() * 60,
      DE: f => f.dartFunction,
      DF: x0 => x0.pointerId,
      DG: x0 => x0.index,
      DH: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      DI: x0 => x0.offsetWidth,
      DJ: x0 => x0.selectedTrack,
      DK: x0 => x0.code,
      DL: x0 => x0.done,
      E: (exn) => {
        let stackString = exn.toString();
        let frames = stackString.split('\n');
        let drop = 4;
        if (frames[0].startsWith('Error')) {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      EB: x0 => new Uint32Array(x0),
      EC: x0 => x0.length,
      ED: Date.now,
      EE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      EF: x0 => x0.getCoalescedEvents(),
      EG: x0 => x0.next(),
      EH: x0 => x0.value,
      EI: x0 => x0.stopPropagation(),
      EJ: x0 => x0.completed,
      EK: x0 => x0.error,
      EL: x0 => x0.body,
      F: () => new Error().stack,
      FB: x0 => new Float32Array(x0),
      FC: (x0,x1) => x0.querySelectorAll(x1),
      FD: (handle) => clearTimeout(handle),
      FE: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      FF: (x0,x1) => x0.getModifierState(x1),
      FG: x0 => x0.value,
      FH: x0 => x0.selectionDirection,
      FI: x0 => x0.disabled,
      FJ: x0 => x0.ready,
      FK: (x0,x1) => x0.start(x1),
      FL: x0 => x0.headers,
      G: s => JSON.stringify(s),
      GB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      GC: (x0,x1) => x0.getAttribute(x1),
      GD: (x0,x1) => x0.closest(x1),
      GE: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      GF: s => s.trimLeft(),
      GG: x0 => x0.done,
      GH: x0 => x0.selectionStart,
      GI: (x0,x1) => { x0.min = x1 },
      GJ: x0 => x0.tracks,
      GK: (x0,x1) => x0.end(x1),
      GL: x0 => x0.signal,
      H: Function.prototype.call.bind(Number.prototype.toString),
      HB: x0 => new Float64Array(x0),
      HC: x0 => x0.remove(),
      HD: x0 => x0.bottom,
      HE: (o, i) => o[i],
      HF: s => s.toUpperCase(),
      HG: (o, m, a) => o[m].apply(o, a),
      HH: x0 => x0.selectionEnd,
      HI: (x0,x1) => { x0.max = x1 },
      HJ: x0 => x0.close(),
      HK: x0 => x0.length,
      HL: () => globalThis.removeSplashFromWeb(),
      I: Function.prototype.call.bind(String.prototype.indexOf),
      IB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      IC: (x0,x1) => x0.appendChild(x1),
      ID: x0 => x0.top,
      IE: o => o.length,
      IF: (x0,x1) => x0[x1],
      IG: x0 => x0.iterator,
      IH: x0 => x0.value,
      II: (x0,x1) => { x0.disabled = x1 },
      IJ: (x0,x1) => ({frameIndex: x0,completeFramesOnly: x1}),
      IK: x0 => x0.buffered,
      IL: x0 => x0.length,
      J: (s, p, i) => s.lastIndexOf(p, i),
      JB: x0 => new ArrayBuffer(x0),
      JC: (x0,x1) => x0.append(x1),
      JD: x0 => x0.right,
      JE: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        if (o instanceof Promise) return 18;
        return 19;
      },
      JF: x0 => x0.length,
      JG: () => globalThis.Symbol,
      JH: x0 => x0.selectionDirection,
      JI: (x0,x1) => { x0.scrollLeft = x1 },
      JJ: (x0,x1) => x0.decode(x1),
      JK: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      JL: x0 => x0.getReader(),
      K: (exn) => {
        if (exn instanceof Error) {
          return exn.stack;
        } else {
          return null;
        }
      },
      KB: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      KC: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      KD: x0 => x0.left,
      KE: x0 => x0.language,
      KF: (x0,x1) => x0.exec(x1),
      KG: (x0,x1) => new Intl.Segmenter(x0,x1),
      KH: x0 => x0.selectionStart,
      KI: (x0,x1) => { x0.spellcheck = x1 },
      KJ: x0 => x0.displayHeight,
      KK: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      KL: x0 => x0.value,
      L: o => o === undefined,
      LB: (x0,x1,x2) => new DataView(x0,x1,x2),
      LC: x0 => x0.style,
      LD: x0 => x0.clientY,
      LE: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      LF: x0 => x0.index,
      LG: x0 => x0.Segmenter,
      LH: x0 => x0.selectionEnd,
      LI: (x0,x1) => { x0.disabled = x1 },
      LJ: x0 => x0.displayWidth,
      LK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      LL: x0 => x0.done,
      M: o => String(o),
      MB: (o, p) => o[p],
      MC: x0 => x0.debugShowSemanticsNodes,
      MD: x0 => x0.clientX,
      ME: () => globalThis.window.FinalizationRegistry,
      MF: x0 => x0.flags,
      MG: x0 => x0.buffer,
      MH: x0 => x0.keyCode,
      MI: (map, o, v) => map.set(o, v),
      MJ: x0 => x0.duration,
      MK: x0 => x0.videoWidth,
      ML: x0 => x0.read(),
      N: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      NB: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      NC: o => o,
      ND: x0 => x0.changedTouches,
      NE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      NF: (a, s) => a.join(s),
      NG: x0 => x0.wasmMemory,
      NH: (x0,x1) => x0.scrollIntoView(x1),
      NI: (o, p) => p in o,
      NJ: x0 => x0.image,
      NK: x0 => x0.videoHeight,
      NL: x0 => x0.body,
      O: (x0,x1) => x0.didCreateEngineInitializer(x1),
      OB: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      OC: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'boolean') return 1;
        return 2;
      },
      OD: x0 => x0.offsetY,
      OE: x0 => new window.FinalizationRegistry(x0),
      OF: (x0,x1) => x0.error(x1),
      OG: () => globalThis.window._flutter_skwasmInstance,
      OH: x0 => x0.multiViewEnabled,
      OI: x0 => x0.groups,
      OJ: () => globalThis.window.ImageDecoder,
      OK: x0 => x0.duration,
      OL: (x0,x1) => new OffscreenCanvas(x0,x1),
      P: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      PB: o => o.byteOffset,
      PC: (x0,x1) => x0.warn(x1),
      PD: x0 => x0.offsetX,
      PE: (x0,x1) => x0.unregister(x1),
      PF: () => globalThis.console,
      PG: () => new TextDecoder(),
      PH: (x0,x1) => x0.replaceWith(x1),
      PI: x0 => x0.pop(),
      PJ: x0 => x0.resume(),
      PK: (x0,x1) => { x0.playsInline = x1 },
      PL: x0 => x0.assetBase,
      Q: (wasmFunction,f) => finalizeWrapper(f, function() { return wasmFunction(f,arguments.length) }),
      QB: o => o.buffer,
      QC: x0 => x0.console,
      QD: x0 => x0.type,
      QE: (x0,x1) => x0.contains(x1),
      QF: s => s.trimRight(),
      QG: (d, digits) => d.toFixed(digits),
      QH: (x0,x1) => { x0.type = x1 },
      QI: (a, i) => a.splice(i, 1),
      QJ: () => new AudioContext(),
      QK: (x0,x1) => { x0.controls = x1 },
      QL: x0 => x0.loader,
      R: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      RB: Function.prototype.call.bind(DataView.prototype.getUint8),
      RC: () => globalThis.window,
      RD: x0 => x0.maxTouchPoints,
      RE: (s) => +s,
      RF: x0 => x0.blur(),
      RG: x0 => x0.maxHeight,
      RH: (x0,x1) => { x0.className = x1 },
      RI: a => a.pop(),
      RJ: x0 => x0.close(),
      RK: (x0,x1) => { x0.autoplay = x1 },
      RL: () => globalThis._flutter,
      S: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      SB: (b, o) => new DataView(b, o),
      SC: (o, c) => o instanceof c,
      SD: x0 => x0.platform,
      SE: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      SF: x0 => x0.button,
      SG: x0 => x0.maxWidth,
      SH: (x0,x1) => { x0.tabIndex = x1 },
      SI: x0 => x0.createGain(),
      SJ: x0 => x0.suspend(),
      SK: (x0,x1) => { x0.width = x1 },
      T: x0 => new Promise(x0),
      TB: (b, o, l) => new DataView(b, o, l),
      TC: (string, token) => string.split(token),
      TD: x0 => x0.body,
      TE: s => s.trim(),
      TF: x0 => x0.innerHeight,
      TG: x0 => x0.minHeight,
      TH: (x0,x1) => { x0.name = x1 },
      TI: (x0,x1) => x0.connect(x1),
      TJ: x0 => x0.duration,
      TK: (x0,x1) => { x0.height = x1 },
      U: (x0,x1,x2) => x0.call(x1,x2),
      UB: Function.prototype.call.bind(DataView.prototype.getFloat64),
      UC: o => o instanceof Array,
      UD: () => globalThis.document,
      UE: x0 => x0.classList,
      UF: x0 => x0.innerWidth,
      UG: x0 => x0.minWidth,
      UH: (x0,x1) => { x0.placeholder = x1 },
      UI: x0 => x0.createBufferSource(),
      UJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      UK: (x0,x1) => { x0.border = x1 },
      V: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      VB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float64Array) return 1;
        return 2;
      },
      VC: (a, i) => a[i],
      VD: (x0,x1,x2) => x0.addEventListener(x1,x2),
      VE: x0 => x0.preventDefault(),
      VF: x0 => x0.height,
      VG: (handle) => clearInterval(handle),
      VH: (x0,x1) => { x0.autocomplete = x1 },
      VI: x0 => x0.start(),
      VJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      VK: x0 => x0.style,
      W: x0 => new Array(x0),
      WB: Function.prototype.call.bind(DataView.prototype.setFloat64),
      WC: a => a.length,
      WD: x0 => x0.hasFocus(),
      WE: x0 => x0.parent,
      WF: x0 => x0.width,
      WG: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      WH: (x0,x1) => { x0.name = x1 },
      WI: (x0,x1) => { x0.buffer = x1 },
      WJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      WK: (x0,x1) => { x0.id = x1 },
      X: o => [o],
      XB: (t, s) => t.set(s),
      XC: (x0,x1) => x0.test(x1),
      XD: x0 => x0.relatedTarget,
      XE: x0 => x0.timeStamp,
      XF: x0 => x0.clientHeight,
      XG: () => Date.now(),
      XH: (x0,x1) => { x0.placeholder = x1 },
      XI: x0 => x0.destination,
      XJ: () => globalThis.window,
      XK: (x0,x1) => x0.createElement(x1),
      Y: (o0, o1) => [o0, o1],
      YB: Function.prototype.call.bind(DataView.prototype.setFloat32),
      YC: x0 => x0.userAgent,
      YD: x0 => x0.shiftKey,
      YE: (x0,x1) => x0.hasAttribute(x1),
      YF: x0 => x0.clientWidth,
      YG: x0 => x0.debugSkipFontRetryDelay,
      YH: (x0,x1) => { x0.action = x1 },
      YI: (x0,x1) => { x0.value = x1 },
      YJ: () => globalThis.document,
      YK: (x0,x1) => { x0.volume = x1 },
      Z: (o0, o1, o2) => [o0, o1, o2],
      ZB: Function.prototype.call.bind(DataView.prototype.getFloat32),
      ZC: x0 => x0.navigator,
      ZD: (decoder, codeUnits) => decoder.decode(codeUnits),
      ZE: x0 => x0.buttons,
      ZF: (x0,x1) => { x0.content = x1 },
      ZG: x0 => x0.status,
      ZH: (x0,x1) => { x0.method = x1 },
      ZI: x0 => x0.gain,
      ZJ: x0 => x0.visibilityState,
      ZK: (x0,x1) => { x0.muted = x1 },
      a: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      aB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float32Array) return 1;
        return 2;
      },
      aC: Function.prototype.call.bind(String.prototype.toLowerCase),
      aD: () => new TextDecoder("utf-8", {fatal: true}),
      aE: x0 => x0.ctrlKey,
      aF: (x0,x1) => { x0.name = x1 },
      aG: (x0,x1,x2) => x0.set(x1,x2),
      aH: (x0,x1) => { x0.noValidate = x1 },
      aI: (x0,x1) => x0.cancelScheduledValues(x1),
      aJ: (x0,x1) => x0.transferFromImageBitmap(x1),
      aK: (x0,x1) => { x0.currentTime = x1 },
      b: (x0,x1,x2) => { x0[x1] = x2 },
      bB: Function.prototype.call.bind(DataView.prototype.getUint32),
      bC: Object.is,
      bD: () => new TextDecoder("utf-8", {fatal: false}),
      bE: x0 => x0.y,
      bF: x0 => x0.head,
      bG: x0 => x0.arrayBuffer(),
      bH: (x0,x1) => x0.removeAttribute(x1),
      bI: (x0,x1,x2) => x0.setValueAtTime(x1,x2),
      bJ: (x0,x1) => x0.getContext(x1),
      bK: x0 => x0.currentTime,
      c: o => o,
      cB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint32Array) return 1;
        return 2;
      },
      cC: x0 => x0.vendor,
      cD: (a, i, v) => a[i] = v,
      cE: x0 => x0.x,
      cF: (x0,x1) => x0.removeChild(x1),
      cG: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof ArrayBuffer) return 1;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 2;
        }
        return 3;
      },
      cH: x0 => x0.isConnected,
      cI: (x0,x1,x2) => x0.linearRampToValueAtTime(x1,x2),
      cJ: (x0,x1) => { x0.height = x1 },
      cK: (x0,x1) => { x0.playbackRate = x1 },
      d: (o, p) => o[p],
      dB: Function.prototype.call.bind(DataView.prototype.getInt32),
      dC: (x0,x1) => x0.createTextNode(x1),
      dD: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      dE: x0 => x0.scrollTop,
      dF: x0 => x0.firstChild,
      dG: (x0,x1) => x0.fetch(x1),
      dH: x0 => x0.click(),
      dI: x0 => x0.value,
      dJ: (x0,x1) => { x0.width = x1 },
      dK: x0 => x0.pause(),
      e: () => globalThis,
      eB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int32Array) return 1;
        return 2;
      },
      eC: (x0,x1) => { x0.id = x1 },
      eD: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      eE: x0 => x0.offsetTop,
      eF: x0 => x0.viewConstraints,
      eG: x0 => x0.fontFallbackBaseUrl,
      eH: (x0,x1) => x0.getElementsByClassName(x1),
      eI: x0 => x0.currentTime,
      eJ: x0 => x0.height,
      eK: x0 => x0.play(),
      f: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      fB: o => o instanceof Uint16Array,
      fC: (x0,x1) => { x0.nonce = x1 },
      fD: x0 => x0.visibilityState,
      fE: x0 => x0.scrollLeft,
      fF: x0 => x0.hostElement,
      fG: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      fH: (x0,x1) => x0.dispatchEvent(x1),
      fI: x0 => x0.stop(),
      fJ: x0 => x0.width,
      fK: x0 => x0.message,
      g: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      gB: Function.prototype.call.bind(DataView.prototype.getUint16),
      gC: x0 => x0.nonce,
      gD: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      gE: x0 => x0.offsetLeft,
      gF: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      gG: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      gH: (x0,x1) => x0.createEvent(x1),
      gI: (x0,x1) => x0.stop(x1),
      gJ: x0 => x0.rasterEndMilliseconds,
      gK: (x0,x1) => x0.getItem(x1),
      h: (x0,x1) => ({addView: x0,removeView: x1}),
      hB: o => o instanceof Int16Array,
      hC: () => globalThis.window.flutterConfiguration,
      hD: x0 => x0.disconnect(),
      hE: x0 => x0.offsetParent,
      hF: x0 => ({runApp: x0}),
      hG: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      hH: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      hI: x0 => x0.state,
      hJ: x0 => x0.rasterStartMilliseconds,
      hK: x0 => x0.localStorage,
      i: (l, r) => l === r,
      iB: Function.prototype.call.bind(DataView.prototype.getInt16),
      iC: (x0,x1) => x0.attachShadow(x1),
      iD: x0 => new Intl.Locale(x0),
      iE: (o, p, r) => o.replace(p, () => r),
      iF: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      iG: x0 => x0.history,
      iH: x0 => x0.readText(),
      iI: (x0,x1) => x0.decodeAudioData(x1),
      iJ: x0 => x0.imageBitmaps,
      iK: (x0,x1) => x0.key(x1),
      j: x0 => x0.random(),
      jB: o => o instanceof Uint8ClampedArray,
      jC: (x0,x1) => x0.createElement(x1),
      jD: x0 => x0.region,
      jE: (x0,x1) => { x0.lastIndex = x1 },
      jF: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      jG: x0 => x0.search,
      jH: x0 => x0.clipboard,
      jI: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      jJ: x0 => x0.canvasKitMaximumSurfaces,
      jK: x0 => x0.length,
      k: o => o,
      kB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint8Array) return 1;
        return 2;
      },
      kC: x0 => x0.scale,
      kD: x0 => x0.script,
      kE: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      kF: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      kG: x0 => x0.location,
      kH: (x0,x1) => x0.writeText(x1),
      kI: (x0,x1,x2) => x0.addEventListener(x1,x2),
      kJ: x0 => x0.cancel(),
      kK: (x0,x1,x2) => x0.setItem(x1,x2),
      l: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'number') return 1;
        return 2;
      },
      lB: Function.prototype.call.bind(DataView.prototype.setInt32),
      lC: x0 => x0.visualViewport,
      lD: x0 => x0.language,
      lE: o => o instanceof RegExp,
      lF: () => typeof dartUseDateNowForTicks !== "undefined",
      lG: x0 => x0.pathname,
      lH: x0 => x0.unlock(),
      lI: (x0,x1,x2) => x0.start(x1,x2),
      lJ: x0 => x0.name,
      lK: (x0,x1) => x0.removeItem(x1),
      m: () => globalThis.Math,
      mB: Function.prototype.call.bind(DataView.prototype.setUint32),
      mC: x0 => x0.devicePixelRatio,
      mD: x0 => x0.languages,
      mE: x0 => x0.dotAll,
      mF: () => Date.now(),
      mG: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      mH: (x0,x1) => x0.lock(x1),
      mI: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      mJ: x0 => x0.hostElement,
      mK: x0 => x0.baseURI,
      n: (x0,x1) => x0.prepend(x1),
      nB: Function.prototype.call.bind(DataView.prototype.setInt16),
      nC: x0 => x0.height,
      nD: (x0,x1) => x0.observe(x1),
      nE: x0 => x0.unicode,
      nF: () => 1000 * performance.now(),
      nG: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      nH: x0 => x0.orientation,
      nI: (x0,x1) => x0.revokeObjectURL(x1),
      nJ: x0 => x0.location,
      nK: x0 => x0.document,
      o: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      oB: Function.prototype.call.bind(DataView.prototype.setUint16),
      oC: x0 => x0.width,
      oD: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      oE: x0 => x0.ignoreCase,
      oF: (x0,x1) => x0.requestAnimationFrame(x1),
      oG: o => Object.keys(o),
      oH: (x0,x1) => x0.querySelector(x1),
      oI: (x0,x1) => { x0.src = x1 },
      oJ: (x0,x1) => x0.getModifierState(x1),
      oK: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      p: b => !!b,
      pB: Function.prototype.call.bind(DataView.prototype.setUint8),
      pC: x0 => x0.screen,
      pD: x0 => new ResizeObserver(x0),
      pE: x0 => x0.multiline,
      pF: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      pG: x0 => x0.state,
      pH: (x0,x1) => { x0.title = x1 },
      pI: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      pJ: x0 => x0.metaKey,
      pK: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      q: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      qB: Function.prototype.call.bind(DataView.prototype.setInt8),
      qC: (string, times) => string.repeat(times),
      qD: (x0,x1) => x0.getPropertyValue(x1),
      qE: (o, p, r) => o.replaceAll(p, () => r),
      qF: x0 => x0.now(),
      qG: x0 => x0.hash,
      qH: (x0,x1) => x0.vibrate(x1),
      qI: x0 => x0.naturalHeight,
      qJ: x0 => x0.altKey,
      qK: x0 => x0.abort(),
      r: (x0,x1) => x0.focus(x1),
      rB: Function.prototype.call.bind(DataView.prototype.getInt8),
      rC: o => {
        if (o === null || o === undefined) return 0;
        if (typeof(o) === 'string') return 1;
        return 2;
      },
      rD: x0 => globalThis.parseFloat(x0),
      rE: x0 => x0.deltaMode,
      rF: x0 => x0.performance,
      rG: x0 => x0.state,
      rH: x0 => x0.content,
      rI: x0 => x0.naturalWidth,
      rJ: x0 => x0.ctrlKey,
      rK: () => new AbortController(),
      s: () => ({}),
      sB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int8Array) return 1;
        return 2;
      },
      sC: x0 => x0.tabIndex,
      sD: (x0,x1) => x0.getComputedStyle(x1),
      sE: x0 => x0.deltaY,
      sF: x0 => new Uint8Array(x0),
      sG: (x0,x1) => x0.go(x1),
      sH: x0 => x0.document,
      sI: x0 => x0.decode(),
      sJ: x0 => x0.isComposing,
      sK: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      t: (o, p, v) => o[p] = v,
      tB: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      tC: (x0,x1) => x0.contains(x1),
      tD: x0 => x0.documentElement,
      tE: x0 => x0.deltaX,
      tF: (x0,x1,x2) => x0.slice(x1,x2),
      tG: x0 => x0.parentElement,
      tH: (map, o) => map.get(o),
      tI: (x0,x1) => { x0.decoding = x1 },
      tJ: x0 => x0.code,
      tK: (x0,x1) => globalThis.fetch(x0,x1),
      u: () => [],
      uB: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      uC: x0 => x0.activeElement,
      uD: x0 => x0.computedStyleMap(),
      uE: x0 => x0.wheelDeltaY,
      uF: (x0,x1) => x0.decode(x1),
      uG: (x0,x1) => x0.querySelectorAll(x1),
      uH: () => new WeakMap(),
      uI: (x0,x1) => { x0.crossOrigin = x1 },
      uJ: x0 => x0.repeat,
      uK: (x0,x1) => x0.get(x1),
      v: (a, i) => a.push(i),
      vB: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      vC: x0 => x0.parentNode,
      vD: (x0,x1) => x0.get(x1),
      vE: x0 => x0.wheelDeltaX,
      vF: (x0,x1) => x0.adoptText(x1),
      vG: (x0,x1) => x0.removeProperty(x1),
      vH: x0 => new WeakRef(x0),
      vI: (x0,x1) => x0.createObjectURL(x1),
      vJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      vK: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1,x2) { return wasmFunction(f,arguments.length,x0,x1,x2) }),
      w: x0 => new Int8Array(x0),
      wB: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      wC: x0 => x0.tagName,
      wD: (o, p) => p in o,
      wE: x0 => x0.key,
      wF: x0 => x0.first(),
      wG: (x0,x1) => x0.add(x1),
      wH: x0 => x0.deref(),
      wI: x0 => x0.URL,
      wJ: x0 => x0.nextSibling,
      wK: (x0,x1) => x0.forEach(x1),
      x: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      xB: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      xC: x0 => x0.target,
      xD: (x0,x1) => { x0.textContent = x1 },
      xE: x0 => x0.identifier,
      xF: x0 => x0.next(),
      xG: x0 => x0.data,
      xH: () => globalThis.WeakRef,
      xI: x0 => new Blob(x0),
      xJ: (x0,x1) => x0.debug(x1),
      xK: x0 => x0.statusText,
      y: x0 => new Uint8Array(x0),
      yB: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      yC: x0 => x0.clientY,
      yD: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      yE: x0 => x0.touches,
      yF: x0 => x0.current(),
      yG: (x0,x1) => { x0.scrollTop = x1 },
      yH: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      yI: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      yJ: (x0,x1) => x0.removeAttribute(x1),
      yK: x0 => x0.url,
      z: x0 => new Uint8ClampedArray(x0),
      zB: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      zC: x0 => x0.clientX,
      zD: x0 => x0.matches,
      zE: x0 => x0.pressure,
      zF: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      zG: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      zH: (a, s, e) => a.slice(s, e),
      zI: x0 => new window.ImageDecoder(x0),
      zJ: x0 => x0.load(),
      zK: x0 => x0.status,

    };

    const baseImports = {
      _: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      WebAssembly: {
        JSTag: WebAssembly.JSTag,
      },
      "": new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
