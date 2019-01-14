(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],2:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":33,"./_wks":105}],3:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],4:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":42}],5:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"./_to-absolute-index":90,"./_to-length":94,"./_to-object":95}],6:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":90,"./_to-length":94,"./_to-object":95}],7:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":90,"./_to-iobject":93,"./_to-length":94}],8:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":10,"./_ctx":19,"./_iobject":38,"./_to-length":94,"./_to-object":95}],9:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":40,"./_is-object":42,"./_wks":105}],10:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":9}],11:[function(require,module,exports){
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":1,"./_invoke":37,"./_is-object":42}],12:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":13,"./_wks":105}],13:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],14:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":3,"./_ctx":19,"./_descriptors":21,"./_for-of":30,"./_iter-define":46,"./_iter-step":48,"./_meta":55,"./_object-create":59,"./_object-dp":60,"./_redefine-all":76,"./_set-species":80,"./_validate-collection":102}],15:[function(require,module,exports){
'use strict';
var redefineAll = require('./_redefine-all');
var getWeak = require('./_meta').getWeak;
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var createArrayMethod = require('./_array-methods');
var $has = require('./_has');
var validate = require('./_validate-collection');
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_an-instance":3,"./_an-object":4,"./_array-methods":8,"./_for-of":30,"./_has":32,"./_is-object":42,"./_meta":55,"./_redefine-all":76,"./_validate-collection":102}],16:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":3,"./_export":25,"./_fails":27,"./_for-of":30,"./_global":31,"./_inherit-if-required":36,"./_is-object":42,"./_iter-detect":47,"./_meta":55,"./_redefine":77,"./_redefine-all":76,"./_set-to-string-tag":81}],17:[function(require,module,exports){
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],18:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":60,"./_property-desc":75}],19:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":1}],20:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],21:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":27}],22:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":31,"./_is-object":42}],23:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],24:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":65,"./_object-keys":68,"./_object-pie":69}],25:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":17,"./_ctx":19,"./_global":31,"./_hide":33,"./_redefine":77}],26:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":105}],27:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],28:[function(require,module,exports){
'use strict';
var hide = require('./_hide');
var redefine = require('./_redefine');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":20,"./_fails":27,"./_hide":33,"./_redefine":77,"./_wks":105}],29:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":4}],30:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":4,"./_ctx":19,"./_is-array-iter":39,"./_iter-call":44,"./_to-length":94,"./core.get-iterator-method":106}],31:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],32:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],33:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":21,"./_object-dp":60,"./_property-desc":75}],34:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":31}],35:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":21,"./_dom-create":22,"./_fails":27}],36:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":42,"./_set-proto":79}],37:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],38:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":13}],39:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":49,"./_wks":105}],40:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":13}],41:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":42}],42:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],43:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":13,"./_is-object":42,"./_wks":105}],44:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":4}],45:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":33,"./_object-create":59,"./_property-desc":75,"./_set-to-string-tag":81,"./_wks":105}],46:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var has = require('./_has');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":25,"./_has":32,"./_hide":33,"./_iter-create":45,"./_iterators":49,"./_library":50,"./_object-gpo":66,"./_redefine":77,"./_set-to-string-tag":81,"./_wks":105}],47:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":105}],48:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],49:[function(require,module,exports){
module.exports = {};

},{}],50:[function(require,module,exports){
module.exports = false;

},{}],51:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],52:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var sign = require('./_math-sign');
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"./_math-sign":54}],53:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],54:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],55:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":27,"./_has":32,"./_is-object":42,"./_object-dp":60,"./_uid":100}],56:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":13,"./_global":31,"./_task":89}],57:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":1}],58:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":27,"./_iobject":38,"./_object-gops":65,"./_object-keys":68,"./_object-pie":69,"./_to-object":95}],59:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":4,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":34,"./_object-dps":61,"./_shared-key":82}],60:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":4,"./_descriptors":21,"./_ie8-dom-define":35,"./_to-primitive":96}],61:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":4,"./_descriptors":21,"./_object-dp":60,"./_object-keys":68}],62:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":21,"./_has":32,"./_ie8-dom-define":35,"./_object-pie":69,"./_property-desc":75,"./_to-iobject":93,"./_to-primitive":96}],63:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":64,"./_to-iobject":93}],64:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":67}],65:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],66:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":32,"./_shared-key":82,"./_to-object":95}],67:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":7,"./_has":32,"./_shared-key":82,"./_to-iobject":93}],68:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":67}],69:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],70:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":17,"./_export":25,"./_fails":27}],71:[function(require,module,exports){
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":68,"./_object-pie":69,"./_to-iobject":93}],72:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn');
var gOPS = require('./_object-gops');
var anObject = require('./_an-object');
var Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_an-object":4,"./_global":31,"./_object-gopn":64,"./_object-gops":65}],73:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],74:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":4,"./_is-object":42,"./_new-promise-capability":57}],75:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],76:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":77}],77:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":17,"./_global":31,"./_has":32,"./_hide":33,"./_uid":100}],78:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],79:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":4,"./_ctx":19,"./_is-object":42,"./_object-gopd":62}],80:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":21,"./_global":31,"./_object-dp":60,"./_wks":105}],81:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":32,"./_object-dp":60,"./_wks":105}],82:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":83,"./_uid":100}],83:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":31}],84:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":1,"./_an-object":4,"./_wks":105}],85:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":20,"./_to-integer":92}],86:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":20,"./_is-regexp":43}],87:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length');
var repeat = require('./_string-repeat');
var defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":20,"./_string-repeat":88,"./_to-length":94}],88:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_defined":20,"./_to-integer":92}],89:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":13,"./_ctx":19,"./_dom-create":22,"./_global":31,"./_html":34,"./_invoke":37}],90:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":92}],91:[function(require,module,exports){
// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

},{"./_to-integer":92,"./_to-length":94}],92:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],93:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":20,"./_iobject":38}],94:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":92}],95:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":20}],96:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":42}],97:[function(require,module,exports){
'use strict';
if (require('./_descriptors')) {
  var LIBRARY = require('./_library');
  var global = require('./_global');
  var fails = require('./_fails');
  var $export = require('./_export');
  var $typed = require('./_typed');
  var $buffer = require('./_typed-buffer');
  var ctx = require('./_ctx');
  var anInstance = require('./_an-instance');
  var propertyDesc = require('./_property-desc');
  var hide = require('./_hide');
  var redefineAll = require('./_redefine-all');
  var toInteger = require('./_to-integer');
  var toLength = require('./_to-length');
  var toIndex = require('./_to-index');
  var toAbsoluteIndex = require('./_to-absolute-index');
  var toPrimitive = require('./_to-primitive');
  var has = require('./_has');
  var classof = require('./_classof');
  var isObject = require('./_is-object');
  var toObject = require('./_to-object');
  var isArrayIter = require('./_is-array-iter');
  var create = require('./_object-create');
  var getPrototypeOf = require('./_object-gpo');
  var gOPN = require('./_object-gopn').f;
  var getIterFn = require('./core.get-iterator-method');
  var uid = require('./_uid');
  var wks = require('./_wks');
  var createArrayMethod = require('./_array-methods');
  var createArrayIncludes = require('./_array-includes');
  var speciesConstructor = require('./_species-constructor');
  var ArrayIterators = require('./es6.array.iterator');
  var Iterators = require('./_iterators');
  var $iterDetect = require('./_iter-detect');
  var setSpecies = require('./_set-species');
  var arrayFill = require('./_array-fill');
  var arrayCopyWithin = require('./_array-copy-within');
  var $DP = require('./_object-dp');
  var $GOPD = require('./_object-gopd');
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };

},{"./_an-instance":3,"./_array-copy-within":5,"./_array-fill":6,"./_array-includes":7,"./_array-methods":8,"./_classof":12,"./_ctx":19,"./_descriptors":21,"./_export":25,"./_fails":27,"./_global":31,"./_has":32,"./_hide":33,"./_is-array-iter":39,"./_is-object":42,"./_iter-detect":47,"./_iterators":49,"./_library":50,"./_object-create":59,"./_object-dp":60,"./_object-gopd":62,"./_object-gopn":64,"./_object-gpo":66,"./_property-desc":75,"./_redefine-all":76,"./_set-species":80,"./_species-constructor":84,"./_to-absolute-index":90,"./_to-index":91,"./_to-integer":92,"./_to-length":94,"./_to-object":95,"./_to-primitive":96,"./_typed":99,"./_typed-buffer":98,"./_uid":100,"./_wks":105,"./core.get-iterator-method":106,"./es6.array.iterator":112}],98:[function(require,module,exports){
'use strict';
var global = require('./_global');
var DESCRIPTORS = require('./_descriptors');
var LIBRARY = require('./_library');
var $typed = require('./_typed');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var fails = require('./_fails');
var anInstance = require('./_an-instance');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var toIndex = require('./_to-index');
var gOPN = require('./_object-gopn').f;
var dP = require('./_object-dp').f;
var arrayFill = require('./_array-fill');
var setToStringTag = require('./_set-to-string-tag');
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_an-instance":3,"./_array-fill":6,"./_descriptors":21,"./_fails":27,"./_global":31,"./_hide":33,"./_library":50,"./_object-dp":60,"./_object-gopn":64,"./_redefine-all":76,"./_set-to-string-tag":81,"./_to-index":91,"./_to-integer":92,"./_to-length":94,"./_typed":99}],99:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var uid = require('./_uid');
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":31,"./_hide":33,"./_uid":100}],100:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],101:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":31}],102:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":42}],103:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":17,"./_global":31,"./_library":50,"./_object-dp":60,"./_wks-ext":104}],104:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":105}],105:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":31,"./_shared":83,"./_uid":100}],106:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":12,"./_core":17,"./_iterators":49,"./_wks":105}],107:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');

},{"./_add-to-unscopables":2,"./_array-copy-within":5,"./_export":25}],108:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":2,"./_array-fill":6,"./_export":25}],109:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":2,"./_array-methods":8,"./_export":25}],110:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":2,"./_array-methods":8,"./_export":25}],111:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":18,"./_ctx":19,"./_export":25,"./_is-array-iter":39,"./_iter-call":44,"./_iter-detect":47,"./_to-length":94,"./_to-object":95,"./core.get-iterator-method":106}],112:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":2,"./_iter-define":46,"./_iter-step":48,"./_iterators":49,"./_to-iobject":93}],113:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

},{"./_create-property":18,"./_export":25,"./_fails":27}],114:[function(require,module,exports){
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":21,"./_object-dp":60}],115:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":16,"./_collection-strong":14,"./_validate-collection":102}],116:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export');
var log1p = require('./_math-log1p');
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":25,"./_math-log1p":53}],117:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export');
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":25}],118:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export');
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":25}],119:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export');
var sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":25,"./_math-sign":54}],120:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":25}],121:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export');
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":25}],122:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export');
var $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":25,"./_math-expm1":51}],123:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export = require('./_export');

$export($export.S, 'Math', { fround: require('./_math-fround') });

},{"./_export":25,"./_math-fround":52}],124:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export');
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":25}],125:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export');
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":25,"./_fails":27}],126:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

},{"./_export":25}],127:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });

},{"./_export":25,"./_math-log1p":53}],128:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":25}],129:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });

},{"./_export":25,"./_math-sign":54}],130:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":25,"./_fails":27,"./_math-expm1":51}],131:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":25,"./_math-expm1":51}],132:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":25}],133:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":25}],134:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":25,"./_global":31}],135:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":25,"./_is-integer":41}],136:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"./_export":25}],137:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export');
var isInteger = require('./_is-integer');
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":25,"./_is-integer":41}],138:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":25}],139:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":25}],140:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":25,"./_object-assign":58}],141:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":42,"./_meta":55,"./_object-sap":70}],142:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":62,"./_object-sap":70,"./_to-iobject":93}],143:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});

},{"./_object-gopn-ext":63,"./_object-sap":70}],144:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":66,"./_object-sap":70,"./_to-object":95}],145:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":42,"./_object-sap":70}],146:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":42,"./_object-sap":70}],147:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":42,"./_object-sap":70}],148:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":25,"./_same-value":78}],149:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":68,"./_object-sap":70,"./_to-object":95}],150:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":42,"./_meta":55,"./_object-sap":70}],151:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":42,"./_meta":55,"./_object-sap":70}],152:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":25,"./_set-proto":79}],153:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":1,"./_an-instance":3,"./_classof":12,"./_core":17,"./_ctx":19,"./_export":25,"./_for-of":30,"./_global":31,"./_is-object":42,"./_iter-detect":47,"./_library":50,"./_microtask":56,"./_new-promise-capability":57,"./_perform":73,"./_promise-resolve":74,"./_redefine-all":76,"./_set-species":80,"./_set-to-string-tag":81,"./_species-constructor":84,"./_task":89,"./_wks":105}],154:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var rApply = (require('./_global').Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_a-function":1,"./_an-object":4,"./_export":25,"./_fails":27,"./_global":31}],155:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export');
var create = require('./_object-create');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var fails = require('./_fails');
var bind = require('./_bind');
var rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_a-function":1,"./_an-object":4,"./_bind":11,"./_export":25,"./_fails":27,"./_global":31,"./_is-object":42,"./_object-create":59}],156:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":4,"./_export":25,"./_fails":27,"./_object-dp":60,"./_to-primitive":96}],157:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export');
var gOPD = require('./_object-gopd').f;
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_an-object":4,"./_export":25,"./_object-gopd":62}],158:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd');
var $export = require('./_export');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_an-object":4,"./_export":25,"./_object-gopd":62}],159:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export');
var getProto = require('./_object-gpo');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_an-object":4,"./_export":25,"./_object-gpo":66}],160:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var isObject = require('./_is-object');
var anObject = require('./_an-object');

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_an-object":4,"./_export":25,"./_has":32,"./_is-object":42,"./_object-gopd":62,"./_object-gpo":66}],161:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":25}],162:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_an-object":4,"./_export":25}],163:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });

},{"./_export":25,"./_own-keys":72}],164:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":4,"./_export":25}],165:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export');
var setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":25,"./_set-proto":79}],166:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp');
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var createDesc = require('./_property-desc');
var anObject = require('./_an-object');
var isObject = require('./_is-object');

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_an-object":4,"./_export":25,"./_has":32,"./_is-object":42,"./_object-dp":60,"./_object-gopd":62,"./_object-gpo":66,"./_property-desc":75}],167:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":21,"./_flags":29,"./_object-dp":60}],168:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

},{"./_fix-re-wks":28}],169:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

},{"./_fix-re-wks":28}],170:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

},{"./_fix-re-wks":28}],171:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = require('./_is-regexp');
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

},{"./_fix-re-wks":28,"./_is-regexp":43}],172:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":16,"./_collection-strong":14,"./_validate-collection":102}],173:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":25,"./_string-at":85}],174:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":25,"./_fails-is-regexp":26,"./_string-context":86,"./_to-length":94}],175:[function(require,module,exports){
var $export = require('./_export');
var toAbsoluteIndex = require('./_to-absolute-index');
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

},{"./_export":25,"./_to-absolute-index":90}],176:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = require('./_export');
var context = require('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":25,"./_fails-is-regexp":26,"./_string-context":86}],177:[function(require,module,exports){
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

},{"./_export":25,"./_to-iobject":93,"./_to-length":94}],178:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":25,"./_string-repeat":88}],179:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":25,"./_fails-is-regexp":26,"./_string-context":86,"./_to-length":94}],180:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":4,"./_descriptors":21,"./_enum-keys":24,"./_export":25,"./_fails":27,"./_global":31,"./_has":32,"./_hide":33,"./_is-array":40,"./_is-object":42,"./_library":50,"./_meta":55,"./_object-create":59,"./_object-dp":60,"./_object-gopd":62,"./_object-gopn":64,"./_object-gopn-ext":63,"./_object-gops":65,"./_object-keys":68,"./_object-pie":69,"./_property-desc":75,"./_redefine":77,"./_set-to-string-tag":81,"./_shared":83,"./_to-iobject":93,"./_to-primitive":96,"./_uid":100,"./_wks":105,"./_wks-define":103,"./_wks-ext":104}],181:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $typed = require('./_typed');
var buffer = require('./_typed-buffer');
var anObject = require('./_an-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var isObject = require('./_is-object');
var ArrayBuffer = require('./_global').ArrayBuffer;
var speciesConstructor = require('./_species-constructor');
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var final = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);

},{"./_an-object":4,"./_export":25,"./_fails":27,"./_global":31,"./_is-object":42,"./_set-species":80,"./_species-constructor":84,"./_to-absolute-index":90,"./_to-length":94,"./_typed":99,"./_typed-buffer":98}],182:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":97}],183:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":97}],184:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":97}],185:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":97}],186:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":97}],187:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":97}],188:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":97}],189:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":97}],190:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":97}],191:[function(require,module,exports){
'use strict';
var each = require('./_array-methods')(0);
var redefine = require('./_redefine');
var meta = require('./_meta');
var assign = require('./_object-assign');
var weak = require('./_collection-weak');
var isObject = require('./_is-object');
var fails = require('./_fails');
var validate = require('./_validate-collection');
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":8,"./_collection":16,"./_collection-weak":15,"./_fails":27,"./_is-object":42,"./_meta":55,"./_object-assign":58,"./_redefine":77,"./_validate-collection":102}],192:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');
var validate = require('./_validate-collection');
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
require('./_collection')(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

},{"./_collection":16,"./_collection-weak":15,"./_validate-collection":102}],193:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export = require('./_export');
var $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');

},{"./_add-to-unscopables":2,"./_array-includes":7,"./_export":25}],194:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":25,"./_object-to-array":71}],195:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export');
var ownKeys = require('./_own-keys');
var toIObject = require('./_to-iobject');
var gOPD = require('./_object-gopd');
var createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

},{"./_create-property":18,"./_export":25,"./_object-gopd":62,"./_own-keys":72,"./_to-iobject":93}],196:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":25,"./_object-to-array":71}],197:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

},{"./_export":25,"./_string-pad":87,"./_user-agent":101}],198:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

},{"./_export":25,"./_string-pad":87,"./_user-agent":101}],199:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":31,"./_hide":33,"./_iterators":49,"./_object-keys":68,"./_redefine":77,"./_wks":105,"./es6.array.iterator":112}],200:[function(require,module,exports){
var $export = require('./_export');
var $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":25,"./_task":89}],201:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global');
var $export = require('./_export');
var userAgent = require('./_user-agent');
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_export":25,"./_global":31,"./_user-agent":101}],202:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],203:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! VelocityJS.org (1.5.2). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */
!function (a) {
  "use strict";
  function b(a) {
    var b = a.length,
        d = c.type(a);return "function" !== d && !c.isWindow(a) && (!(1 !== a.nodeType || !b) || "array" === d || 0 === b || "number" == typeof b && b > 0 && b - 1 in a);
  }if (!a.jQuery) {
    var c = function c(a, b) {
      return new c.fn.init(a, b);
    };c.isWindow = function (a) {
      return a && a === a.window;
    }, c.type = function (a) {
      return a ? "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) || "function" == typeof a ? e[g.call(a)] || "object" : typeof a === "undefined" ? "undefined" : _typeof(a) : a + "";
    }, c.isArray = Array.isArray || function (a) {
      return "array" === c.type(a);
    }, c.isPlainObject = function (a) {
      var b;if (!a || "object" !== c.type(a) || a.nodeType || c.isWindow(a)) return !1;try {
        if (a.constructor && !f.call(a, "constructor") && !f.call(a.constructor.prototype, "isPrototypeOf")) return !1;
      } catch (d) {
        return !1;
      }for (b in a) {}return b === undefined || f.call(a, b);
    }, c.each = function (a, c, d) {
      var e = 0,
          f = a.length,
          g = b(a);if (d) {
        if (g) for (; e < f && !1 !== c.apply(a[e], d); e++) {} else for (e in a) {
          if (a.hasOwnProperty(e) && !1 === c.apply(a[e], d)) break;
        }
      } else if (g) for (; e < f && !1 !== c.call(a[e], e, a[e]); e++) {} else for (e in a) {
        if (a.hasOwnProperty(e) && !1 === c.call(a[e], e, a[e])) break;
      }return a;
    }, c.data = function (a, b, e) {
      if (e === undefined) {
        var f = a[c.expando],
            g = f && d[f];if (b === undefined) return g;if (g && b in g) return g[b];
      } else if (b !== undefined) {
        var h = a[c.expando] || (a[c.expando] = ++c.uuid);return d[h] = d[h] || {}, d[h][b] = e, e;
      }
    }, c.removeData = function (a, b) {
      var e = a[c.expando],
          f = e && d[e];f && (b ? c.each(b, function (a, b) {
        delete f[b];
      }) : delete d[e]);
    }, c.extend = function () {
      var a,
          b,
          d,
          e,
          f,
          g,
          h = arguments[0] || {},
          i = 1,
          j = arguments.length,
          k = !1;for ("boolean" == typeof h && (k = h, h = arguments[i] || {}, i++), "object" != (typeof h === "undefined" ? "undefined" : _typeof(h)) && "function" !== c.type(h) && (h = {}), i === j && (h = this, i--); i < j; i++) {
        if (f = arguments[i]) for (e in f) {
          f.hasOwnProperty(e) && (a = h[e], d = f[e], h !== d && (k && d && (c.isPlainObject(d) || (b = c.isArray(d))) ? (b ? (b = !1, g = a && c.isArray(a) ? a : []) : g = a && c.isPlainObject(a) ? a : {}, h[e] = c.extend(k, g, d)) : d !== undefined && (h[e] = d)));
        }
      }return h;
    }, c.queue = function (a, d, e) {
      if (a) {
        d = (d || "fx") + "queue";var f = c.data(a, d);return e ? (!f || c.isArray(e) ? f = c.data(a, d, function (a, c) {
          var d = c || [];return a && (b(Object(a)) ? function (a, b) {
            for (var c = +b.length, d = 0, e = a.length; d < c;) {
              a[e++] = b[d++];
            }if (c !== c) for (; b[d] !== undefined;) {
              a[e++] = b[d++];
            }a.length = e;
          }(d, "string" == typeof a ? [a] : a) : [].push.call(d, a)), d;
        }(e)) : f.push(e), f) : f || [];
      }
    }, c.dequeue = function (a, b) {
      c.each(a.nodeType ? [a] : a, function (a, d) {
        b = b || "fx";var e = c.queue(d, b),
            f = e.shift();"inprogress" === f && (f = e.shift()), f && ("fx" === b && e.unshift("inprogress"), f.call(d, function () {
          c.dequeue(d, b);
        }));
      });
    }, c.fn = c.prototype = { init: function init(a) {
        if (a.nodeType) return this[0] = a, this;throw new Error("Not a DOM node.");
      }, offset: function offset() {
        var b = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : { top: 0, left: 0 };return { top: b.top + (a.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0), left: b.left + (a.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0) };
      }, position: function position() {
        var a = this[0],
            b = function (a) {
          for (var b = a.offsetParent; b && "html" !== b.nodeName.toLowerCase() && b.style && "static" === b.style.position.toLowerCase();) {
            b = b.offsetParent;
          }return b || document;
        }(a),
            d = this.offset(),
            e = /^(?:body|html)$/i.test(b.nodeName) ? { top: 0, left: 0 } : c(b).offset();return d.top -= parseFloat(a.style.marginTop) || 0, d.left -= parseFloat(a.style.marginLeft) || 0, b.style && (e.top += parseFloat(b.style.borderTopWidth) || 0, e.left += parseFloat(b.style.borderLeftWidth) || 0), { top: d.top - e.top, left: d.left - e.left };
      } };var d = {};c.expando = "velocity" + new Date().getTime(), c.uuid = 0;for (var e = {}, f = e.hasOwnProperty, g = e.toString, h = "Boolean Number String Function Array Date RegExp Object Error".split(" "), i = 0; i < h.length; i++) {
      e["[object " + h[i] + "]"] = h[i].toLowerCase();
    }c.fn.init.prototype = c.fn, a.Velocity = { Utilities: c };
  }
}(window), function (a) {
  "use strict";
  "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && "object" == _typeof(module.exports) ? module.exports = a() : "function" == typeof define && define.amd ? define(a) : a();
}(function () {
  "use strict";
  return function (a, b, c, d) {
    function e(a) {
      for (var b = -1, c = a ? a.length : 0, d = []; ++b < c;) {
        var e = a[b];e && d.push(e);
      }return d;
    }function f(a) {
      return u.isWrapped(a) ? a = s.call(a) : u.isNode(a) && (a = [a]), a;
    }function g(a) {
      var b = o.data(a, "velocity");return null === b ? d : b;
    }function h(a, b) {
      var c = g(a);c && c.delayTimer && !c.delayPaused && (c.delayRemaining = c.delay - b + c.delayBegin, c.delayPaused = !0, clearTimeout(c.delayTimer.setTimeout));
    }function i(a, b) {
      var c = g(a);c && c.delayTimer && c.delayPaused && (c.delayPaused = !1, c.delayTimer.setTimeout = setTimeout(c.delayTimer.next, c.delayRemaining));
    }function j(a) {
      return function (b) {
        return Math.round(b * a) * (1 / a);
      };
    }function k(a, c, d, e) {
      function f(a, b) {
        return 1 - 3 * b + 3 * a;
      }function g(a, b) {
        return 3 * b - 6 * a;
      }function h(a) {
        return 3 * a;
      }function i(a, b, c) {
        return ((f(b, c) * a + g(b, c)) * a + h(b)) * a;
      }function j(a, b, c) {
        return 3 * f(b, c) * a * a + 2 * g(b, c) * a + h(b);
      }function k(b, c) {
        for (var e = 0; e < p; ++e) {
          var f = j(c, a, d);if (0 === f) return c;c -= (i(c, a, d) - b) / f;
        }return c;
      }function l() {
        for (var b = 0; b < t; ++b) {
          x[b] = i(b * u, a, d);
        }
      }function m(b, c, e) {
        var f,
            g,
            h = 0;do {
          g = c + (e - c) / 2, f = i(g, a, d) - b, f > 0 ? e = g : c = g;
        } while (Math.abs(f) > r && ++h < s);return g;
      }function n(b) {
        for (var c = 0, e = 1, f = t - 1; e !== f && x[e] <= b; ++e) {
          c += u;
        }--e;var g = (b - x[e]) / (x[e + 1] - x[e]),
            h = c + g * u,
            i = j(h, a, d);return i >= q ? k(b, h) : 0 === i ? h : m(b, c, c + u);
      }function o() {
        y = !0, a === c && d === e || l();
      }var p = 4,
          q = .001,
          r = 1e-7,
          s = 10,
          t = 11,
          u = 1 / (t - 1),
          v = "Float32Array" in b;if (4 !== arguments.length) return !1;for (var w = 0; w < 4; ++w) {
        if ("number" != typeof arguments[w] || isNaN(arguments[w]) || !isFinite(arguments[w])) return !1;
      }a = Math.min(a, 1), d = Math.min(d, 1), a = Math.max(a, 0), d = Math.max(d, 0);var x = v ? new Float32Array(t) : new Array(t),
          y = !1,
          z = function z(b) {
        return y || o(), a === c && d === e ? b : 0 === b ? 0 : 1 === b ? 1 : i(n(b), c, e);
      };z.getControlPoints = function () {
        return [{ x: a, y: c }, { x: d, y: e }];
      };var A = "generateBezier(" + [a, c, d, e] + ")";return z.toString = function () {
        return A;
      }, z;
    }function l(a, b) {
      var c = a;return u.isString(a) ? y.Easings[a] || (c = !1) : c = u.isArray(a) && 1 === a.length ? j.apply(null, a) : u.isArray(a) && 2 === a.length ? z.apply(null, a.concat([b])) : !(!u.isArray(a) || 4 !== a.length) && k.apply(null, a), !1 === c && (c = y.Easings[y.defaults.easing] ? y.defaults.easing : x), c;
    }function m(a) {
      if (a) {
        var b = y.timestamp && !0 !== a ? a : r.now(),
            c = y.State.calls.length;c > 1e4 && (y.State.calls = e(y.State.calls), c = y.State.calls.length);for (var f = 0; f < c; f++) {
          if (y.State.calls[f]) {
            var h = y.State.calls[f],
                i = h[0],
                j = h[2],
                k = h[3],
                l = !k,
                q = null,
                s = h[5],
                t = h[6];if (k || (k = y.State.calls[f][3] = b - 16), s) {
              if (!0 !== s.resume) continue;k = h[3] = Math.round(b - t - 16), h[5] = null;
            }t = h[6] = b - k;for (var v = Math.min(t / j.duration, 1), w = 0, x = i.length; w < x; w++) {
              var z = i[w],
                  B = z.element;if (g(B)) {
                var D = !1;if (j.display !== d && null !== j.display && "none" !== j.display) {
                  if ("flex" === j.display) {
                    var E = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];o.each(E, function (a, b) {
                      A.setPropertyValue(B, "display", b);
                    });
                  }A.setPropertyValue(B, "display", j.display);
                }j.visibility !== d && "hidden" !== j.visibility && A.setPropertyValue(B, "visibility", j.visibility);for (var F in z) {
                  if (z.hasOwnProperty(F) && "element" !== F) {
                    var G,
                        H = z[F],
                        I = u.isString(H.easing) ? y.Easings[H.easing] : H.easing;if (u.isString(H.pattern)) {
                      var J = 1 === v ? function (a, b, c) {
                        var d = H.endValue[b];return c ? Math.round(d) : d;
                      } : function (a, b, c) {
                        var d = H.startValue[b],
                            e = H.endValue[b] - d,
                            f = d + e * I(v, j, e);return c ? Math.round(f) : f;
                      };G = H.pattern.replace(/{(\d+)(!)?}/g, J);
                    } else if (1 === v) G = H.endValue;else {
                      var K = H.endValue - H.startValue;G = H.startValue + K * I(v, j, K);
                    }if (!l && G === H.currentValue) continue;if (H.currentValue = G, "tween" === F) q = G;else {
                      var L;if (A.Hooks.registered[F]) {
                        L = A.Hooks.getRoot(F);var M = g(B).rootPropertyValueCache[L];M && (H.rootPropertyValue = M);
                      }var N = A.setPropertyValue(B, F, H.currentValue + (p < 9 && 0 === parseFloat(G) ? "" : H.unitType), H.rootPropertyValue, H.scrollData);A.Hooks.registered[F] && (A.Normalizations.registered[L] ? g(B).rootPropertyValueCache[L] = A.Normalizations.registered[L]("extract", null, N[1]) : g(B).rootPropertyValueCache[L] = N[1]), "transform" === N[0] && (D = !0);
                    }
                  }
                }j.mobileHA && g(B).transformCache.translate3d === d && (g(B).transformCache.translate3d = "(0px, 0px, 0px)", D = !0), D && A.flushTransformCache(B);
              }
            }j.display !== d && "none" !== j.display && (y.State.calls[f][2].display = !1), j.visibility !== d && "hidden" !== j.visibility && (y.State.calls[f][2].visibility = !1), j.progress && j.progress.call(h[1], h[1], v, Math.max(0, k + j.duration - b), k, q), 1 === v && n(f);
          }
        }
      }y.State.isTicking && C(m);
    }function n(a, b) {
      if (!y.State.calls[a]) return !1;for (var c = y.State.calls[a][0], e = y.State.calls[a][1], f = y.State.calls[a][2], h = y.State.calls[a][4], i = !1, j = 0, k = c.length; j < k; j++) {
        var l = c[j].element;b || f.loop || ("none" === f.display && A.setPropertyValue(l, "display", f.display), "hidden" === f.visibility && A.setPropertyValue(l, "visibility", f.visibility));var m = g(l);if (!0 !== f.loop && (o.queue(l)[1] === d || !/\.velocityQueueEntryFlag/i.test(o.queue(l)[1])) && m) {
          m.isAnimating = !1, m.rootPropertyValueCache = {};var n = !1;o.each(A.Lists.transforms3D, function (a, b) {
            var c = /^scale/.test(b) ? 1 : 0,
                e = m.transformCache[b];m.transformCache[b] !== d && new RegExp("^\\(" + c + "[^.]").test(e) && (n = !0, delete m.transformCache[b]);
          }), f.mobileHA && (n = !0, delete m.transformCache.translate3d), n && A.flushTransformCache(l), A.Values.removeClass(l, "velocity-animating");
        }if (!b && f.complete && !f.loop && j === k - 1) try {
          f.complete.call(e, e);
        } catch (r) {
          setTimeout(function () {
            throw r;
          }, 1);
        }h && !0 !== f.loop && h(e), m && !0 === f.loop && !b && (o.each(m.tweensContainer, function (a, b) {
          if (/^rotate/.test(a) && (parseFloat(b.startValue) - parseFloat(b.endValue)) % 360 == 0) {
            var c = b.startValue;b.startValue = b.endValue, b.endValue = c;
          }/^backgroundPosition/.test(a) && 100 === parseFloat(b.endValue) && "%" === b.unitType && (b.endValue = 0, b.startValue = 100);
        }), y(l, "reverse", { loop: !0, delay: f.delay })), !1 !== f.queue && o.dequeue(l, f.queue);
      }y.State.calls[a] = !1;for (var p = 0, q = y.State.calls.length; p < q; p++) {
        if (!1 !== y.State.calls[p]) {
          i = !0;break;
        }
      }!1 === i && (y.State.isTicking = !1, delete y.State.calls, y.State.calls = []);
    }var o,
        p = function () {
      if (c.documentMode) return c.documentMode;for (var a = 7; a > 4; a--) {
        var b = c.createElement("div");if (b.innerHTML = "\x3c!--[if IE " + a + "]><span></span><![endif]--\x3e", b.getElementsByTagName("span").length) return b = null, a;
      }return d;
    }(),
        q = function () {
      var a = 0;return b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame || function (b) {
        var c,
            d = new Date().getTime();return c = Math.max(0, 16 - (d - a)), a = d + c, setTimeout(function () {
          b(d + c);
        }, c);
      };
    }(),
        r = function () {
      var a = b.performance || {};if ("function" != typeof a.now) {
        var c = a.timing && a.timing.navigationStart ? a.timing.navigationStart : new Date().getTime();a.now = function () {
          return new Date().getTime() - c;
        };
      }return a;
    }(),
        s = function () {
      var a = Array.prototype.slice;try {
        return a.call(c.documentElement), a;
      } catch (b) {
        return function (b, c) {
          var d = this.length;if ("number" != typeof b && (b = 0), "number" != typeof c && (c = d), this.slice) return a.call(this, b, c);var e,
              f = [],
              g = b >= 0 ? b : Math.max(0, d + b),
              h = c < 0 ? d + c : Math.min(c, d),
              i = h - g;if (i > 0) if (f = new Array(i), this.charAt) for (e = 0; e < i; e++) {
            f[e] = this.charAt(g + e);
          } else for (e = 0; e < i; e++) {
            f[e] = this[g + e];
          }return f;
        };
      }
    }(),
        t = function t() {
      return Array.prototype.includes ? function (a, b) {
        return a.includes(b);
      } : Array.prototype.indexOf ? function (a, b) {
        return a.indexOf(b) >= 0;
      } : function (a, b) {
        for (var c = 0; c < a.length; c++) {
          if (a[c] === b) return !0;
        }return !1;
      };
    },
        u = { isNumber: function isNumber(a) {
        return "number" == typeof a;
      }, isString: function isString(a) {
        return "string" == typeof a;
      }, isArray: Array.isArray || function (a) {
        return "[object Array]" === Object.prototype.toString.call(a);
      }, isFunction: function isFunction(a) {
        return "[object Function]" === Object.prototype.toString.call(a);
      }, isNode: function isNode(a) {
        return a && a.nodeType;
      }, isWrapped: function isWrapped(a) {
        return a && a !== b && u.isNumber(a.length) && !u.isString(a) && !u.isFunction(a) && !u.isNode(a) && (0 === a.length || u.isNode(a[0]));
      }, isSVG: function isSVG(a) {
        return b.SVGElement && a instanceof b.SVGElement;
      }, isEmptyObject: function isEmptyObject(a) {
        for (var b in a) {
          if (a.hasOwnProperty(b)) return !1;
        }return !0;
      } },
        v = !1;if (a.fn && a.fn.jquery ? (o = a, v = !0) : o = b.Velocity.Utilities, p <= 8 && !v) throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");if (p <= 7) return void (jQuery.fn.velocity = jQuery.fn.animate);var w = 400,
        x = "swing",
        y = { State: { isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(b.navigator.userAgent), isAndroid: /Android/i.test(b.navigator.userAgent), isGingerbread: /Android 2\.3\.[3-7]/i.test(b.navigator.userAgent), isChrome: b.chrome, isFirefox: /Firefox/i.test(b.navigator.userAgent), prefixElement: c.createElement("div"), prefixMatches: {}, scrollAnchor: null, scrollPropertyLeft: null, scrollPropertyTop: null, isTicking: !1, calls: [], delayedElements: { count: 0 } }, CSS: {}, Utilities: o, Redirects: {}, Easings: {}, Promise: b.Promise, defaults: { queue: "", duration: w, easing: x, begin: d, complete: d, progress: d, display: d, visibility: d, loop: !1, delay: !1, mobileHA: !0, _cacheValues: !0, promiseRejectEmpty: !0 }, init: function init(a) {
        o.data(a, "velocity", { isSVG: u.isSVG(a), isAnimating: !1, computedStyle: null, tweensContainer: null, rootPropertyValueCache: {}, transformCache: {} });
      }, hook: null, mock: !1, version: { major: 1, minor: 5, patch: 2 }, debug: !1, timestamp: !0, pauseAll: function pauseAll(a) {
        var b = new Date().getTime();o.each(y.State.calls, function (b, c) {
          if (c) {
            if (a !== d && (c[2].queue !== a || !1 === c[2].queue)) return !0;c[5] = { resume: !1 };
          }
        }), o.each(y.State.delayedElements, function (a, c) {
          c && h(c, b);
        });
      }, resumeAll: function resumeAll(a) {
        var b = new Date().getTime();o.each(y.State.calls, function (b, c) {
          if (c) {
            if (a !== d && (c[2].queue !== a || !1 === c[2].queue)) return !0;c[5] && (c[5].resume = !0);
          }
        }), o.each(y.State.delayedElements, function (a, c) {
          c && i(c, b);
        });
      } };b.pageYOffset !== d ? (y.State.scrollAnchor = b, y.State.scrollPropertyLeft = "pageXOffset", y.State.scrollPropertyTop = "pageYOffset") : (y.State.scrollAnchor = c.documentElement || c.body.parentNode || c.body, y.State.scrollPropertyLeft = "scrollLeft", y.State.scrollPropertyTop = "scrollTop");var z = function () {
      function a(a) {
        return -a.tension * a.x - a.friction * a.v;
      }function b(b, c, d) {
        var e = { x: b.x + d.dx * c, v: b.v + d.dv * c, tension: b.tension, friction: b.friction };return { dx: e.v, dv: a(e) };
      }function c(c, d) {
        var e = { dx: c.v, dv: a(c) },
            f = b(c, .5 * d, e),
            g = b(c, .5 * d, f),
            h = b(c, d, g),
            i = 1 / 6 * (e.dx + 2 * (f.dx + g.dx) + h.dx),
            j = 1 / 6 * (e.dv + 2 * (f.dv + g.dv) + h.dv);return c.x = c.x + i * d, c.v = c.v + j * d, c;
      }return function d(a, b, e) {
        var f,
            g,
            h,
            i = { x: -1, v: 0, tension: null, friction: null },
            j = [0],
            k = 0;for (a = parseFloat(a) || 500, b = parseFloat(b) || 20, e = e || null, i.tension = a, i.friction = b, f = null !== e, f ? (k = d(a, b), g = k / e * .016) : g = .016;;) {
          if (h = c(h || i, g), j.push(1 + h.x), k += 16, !(Math.abs(h.x) > 1e-4 && Math.abs(h.v) > 1e-4)) break;
        }return f ? function (a) {
          return j[a * (j.length - 1) | 0];
        } : k;
      };
    }();y.Easings = { linear: function linear(a) {
        return a;
      }, swing: function swing(a) {
        return .5 - Math.cos(a * Math.PI) / 2;
      }, spring: function spring(a) {
        return 1 - Math.cos(4.5 * a * Math.PI) * Math.exp(6 * -a);
      } }, o.each([["ease", [.25, .1, .25, 1]], ["ease-in", [.42, 0, 1, 1]], ["ease-out", [0, 0, .58, 1]], ["ease-in-out", [.42, 0, .58, 1]], ["easeInSine", [.47, 0, .745, .715]], ["easeOutSine", [.39, .575, .565, 1]], ["easeInOutSine", [.445, .05, .55, .95]], ["easeInQuad", [.55, .085, .68, .53]], ["easeOutQuad", [.25, .46, .45, .94]], ["easeInOutQuad", [.455, .03, .515, .955]], ["easeInCubic", [.55, .055, .675, .19]], ["easeOutCubic", [.215, .61, .355, 1]], ["easeInOutCubic", [.645, .045, .355, 1]], ["easeInQuart", [.895, .03, .685, .22]], ["easeOutQuart", [.165, .84, .44, 1]], ["easeInOutQuart", [.77, 0, .175, 1]], ["easeInQuint", [.755, .05, .855, .06]], ["easeOutQuint", [.23, 1, .32, 1]], ["easeInOutQuint", [.86, 0, .07, 1]], ["easeInExpo", [.95, .05, .795, .035]], ["easeOutExpo", [.19, 1, .22, 1]], ["easeInOutExpo", [1, 0, 0, 1]], ["easeInCirc", [.6, .04, .98, .335]], ["easeOutCirc", [.075, .82, .165, 1]], ["easeInOutCirc", [.785, .135, .15, .86]]], function (a, b) {
      y.Easings[b[0]] = k.apply(null, b[1]);
    });var A = y.CSS = { RegEx: { isHex: /^#([A-f\d]{3}){1,2}$/i, valueUnwrap: /^[A-z]+\((.*)\)$/i, wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/, valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi }, Lists: { colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"], transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"], transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"], units: ["%", "em", "ex", "ch", "rem", "vw", "vh", "vmin", "vmax", "cm", "mm", "Q", "in", "pc", "pt", "px", "deg", "grad", "rad", "turn", "s", "ms"], colorNames: { aliceblue: "240,248,255", antiquewhite: "250,235,215", aquamarine: "127,255,212", aqua: "0,255,255", azure: "240,255,255", beige: "245,245,220", bisque: "255,228,196", black: "0,0,0", blanchedalmond: "255,235,205", blueviolet: "138,43,226", blue: "0,0,255", brown: "165,42,42", burlywood: "222,184,135", cadetblue: "95,158,160", chartreuse: "127,255,0", chocolate: "210,105,30", coral: "255,127,80", cornflowerblue: "100,149,237", cornsilk: "255,248,220", crimson: "220,20,60", cyan: "0,255,255", darkblue: "0,0,139", darkcyan: "0,139,139", darkgoldenrod: "184,134,11", darkgray: "169,169,169", darkgrey: "169,169,169", darkgreen: "0,100,0", darkkhaki: "189,183,107", darkmagenta: "139,0,139", darkolivegreen: "85,107,47", darkorange: "255,140,0", darkorchid: "153,50,204", darkred: "139,0,0", darksalmon: "233,150,122", darkseagreen: "143,188,143", darkslateblue: "72,61,139", darkslategray: "47,79,79", darkturquoise: "0,206,209", darkviolet: "148,0,211", deeppink: "255,20,147", deepskyblue: "0,191,255", dimgray: "105,105,105", dimgrey: "105,105,105", dodgerblue: "30,144,255", firebrick: "178,34,34", floralwhite: "255,250,240", forestgreen: "34,139,34", fuchsia: "255,0,255", gainsboro: "220,220,220", ghostwhite: "248,248,255", gold: "255,215,0", goldenrod: "218,165,32", gray: "128,128,128", grey: "128,128,128", greenyellow: "173,255,47", green: "0,128,0", honeydew: "240,255,240", hotpink: "255,105,180", indianred: "205,92,92", indigo: "75,0,130", ivory: "255,255,240", khaki: "240,230,140", lavenderblush: "255,240,245", lavender: "230,230,250", lawngreen: "124,252,0", lemonchiffon: "255,250,205", lightblue: "173,216,230", lightcoral: "240,128,128", lightcyan: "224,255,255", lightgoldenrodyellow: "250,250,210", lightgray: "211,211,211", lightgrey: "211,211,211", lightgreen: "144,238,144", lightpink: "255,182,193", lightsalmon: "255,160,122", lightseagreen: "32,178,170", lightskyblue: "135,206,250", lightslategray: "119,136,153", lightsteelblue: "176,196,222", lightyellow: "255,255,224", limegreen: "50,205,50", lime: "0,255,0", linen: "250,240,230", magenta: "255,0,255", maroon: "128,0,0", mediumaquamarine: "102,205,170", mediumblue: "0,0,205", mediumorchid: "186,85,211", mediumpurple: "147,112,219", mediumseagreen: "60,179,113", mediumslateblue: "123,104,238", mediumspringgreen: "0,250,154", mediumturquoise: "72,209,204", mediumvioletred: "199,21,133", midnightblue: "25,25,112", mintcream: "245,255,250", mistyrose: "255,228,225", moccasin: "255,228,181", navajowhite: "255,222,173", navy: "0,0,128", oldlace: "253,245,230", olivedrab: "107,142,35", olive: "128,128,0", orangered: "255,69,0", orange: "255,165,0", orchid: "218,112,214", palegoldenrod: "238,232,170", palegreen: "152,251,152", paleturquoise: "175,238,238", palevioletred: "219,112,147", papayawhip: "255,239,213", peachpuff: "255,218,185", peru: "205,133,63", pink: "255,192,203", plum: "221,160,221", powderblue: "176,224,230", purple: "128,0,128", red: "255,0,0", rosybrown: "188,143,143", royalblue: "65,105,225", saddlebrown: "139,69,19", salmon: "250,128,114", sandybrown: "244,164,96", seagreen: "46,139,87", seashell: "255,245,238", sienna: "160,82,45", silver: "192,192,192", skyblue: "135,206,235", slateblue: "106,90,205", slategray: "112,128,144", snow: "255,250,250", springgreen: "0,255,127", steelblue: "70,130,180", tan: "210,180,140", teal: "0,128,128", thistle: "216,191,216", tomato: "255,99,71", turquoise: "64,224,208", violet: "238,130,238", wheat: "245,222,179", whitesmoke: "245,245,245", white: "255,255,255", yellowgreen: "154,205,50", yellow: "255,255,0" } }, Hooks: { templates: { textShadow: ["Color X Y Blur", "black 0px 0px 0px"], boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"], clip: ["Top Right Bottom Left", "0px 0px 0px 0px"], backgroundPosition: ["X Y", "0% 0%"], transformOrigin: ["X Y Z", "50% 50% 0px"], perspectiveOrigin: ["X Y", "50% 50%"] }, registered: {}, register: function register() {
          for (var a = 0; a < A.Lists.colors.length; a++) {
            var b = "color" === A.Lists.colors[a] ? "0 0 0 1" : "255 255 255 1";A.Hooks.templates[A.Lists.colors[a]] = ["Red Green Blue Alpha", b];
          }var c, d, e;if (p) for (c in A.Hooks.templates) {
            if (A.Hooks.templates.hasOwnProperty(c)) {
              d = A.Hooks.templates[c], e = d[0].split(" ");var f = d[1].match(A.RegEx.valueSplit);"Color" === e[0] && (e.push(e.shift()), f.push(f.shift()), A.Hooks.templates[c] = [e.join(" "), f.join(" ")]);
            }
          }for (c in A.Hooks.templates) {
            if (A.Hooks.templates.hasOwnProperty(c)) {
              d = A.Hooks.templates[c], e = d[0].split(" ");for (var g in e) {
                if (e.hasOwnProperty(g)) {
                  var h = c + e[g],
                      i = g;A.Hooks.registered[h] = [c, i];
                }
              }
            }
          }
        }, getRoot: function getRoot(a) {
          var b = A.Hooks.registered[a];return b ? b[0] : a;
        }, getUnit: function getUnit(a, b) {
          var c = (a.substr(b || 0, 5).match(/^[a-z%]+/) || [])[0] || "";return c && t(A.Lists.units, c) ? c : "";
        }, fixColors: function fixColors(a) {
          return a.replace(/(rgba?\(\s*)?(\b[a-z]+\b)/g, function (a, b, c) {
            return A.Lists.colorNames.hasOwnProperty(c) ? (b || "rgba(") + A.Lists.colorNames[c] + (b ? "" : ",1)") : b + c;
          });
        }, cleanRootPropertyValue: function cleanRootPropertyValue(a, b) {
          return A.RegEx.valueUnwrap.test(b) && (b = b.match(A.RegEx.valueUnwrap)[1]), A.Values.isCSSNullValue(b) && (b = A.Hooks.templates[a][1]), b;
        }, extractValue: function extractValue(a, b) {
          var c = A.Hooks.registered[a];if (c) {
            var d = c[0],
                e = c[1];return b = A.Hooks.cleanRootPropertyValue(d, b), b.toString().match(A.RegEx.valueSplit)[e];
          }return b;
        }, injectValue: function injectValue(a, b, c) {
          var d = A.Hooks.registered[a];if (d) {
            var e,
                f = d[0],
                g = d[1];return c = A.Hooks.cleanRootPropertyValue(f, c), e = c.toString().match(A.RegEx.valueSplit), e[g] = b, e.join(" ");
          }return c;
        } }, Normalizations: { registered: { clip: function clip(a, b, c) {
            switch (a) {case "name":
                return "clip";case "extract":
                var d;return A.RegEx.wrappedValueAlreadyExtracted.test(c) ? d = c : (d = c.toString().match(A.RegEx.valueUnwrap), d = d ? d[1].replace(/,(\s+)?/g, " ") : c), d;case "inject":
                return "rect(" + c + ")";}
          }, blur: function blur(a, b, c) {
            switch (a) {case "name":
                return y.State.isFirefox ? "filter" : "-webkit-filter";case "extract":
                var d = parseFloat(c);if (!d && 0 !== d) {
                  var e = c.toString().match(/blur\(([0-9]+[A-z]+)\)/i);d = e ? e[1] : 0;
                }return d;case "inject":
                return parseFloat(c) ? "blur(" + c + ")" : "none";}
          }, opacity: function opacity(a, b, c) {
            if (p <= 8) switch (a) {case "name":
                return "filter";case "extract":
                var d = c.toString().match(/alpha\(opacity=(.*)\)/i);return c = d ? d[1] / 100 : 1;case "inject":
                return b.style.zoom = 1, parseFloat(c) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(c), 10) + ")";} else switch (a) {case "name":
                return "opacity";case "extract":case "inject":
                return c;}
          } }, register: function register() {
          function a(a, b, c) {
            if ("border-box" === A.getPropertyValue(b, "boxSizing").toString().toLowerCase() === (c || !1)) {
              var d,
                  e,
                  f = 0,
                  g = "width" === a ? ["Left", "Right"] : ["Top", "Bottom"],
                  h = ["padding" + g[0], "padding" + g[1], "border" + g[0] + "Width", "border" + g[1] + "Width"];for (d = 0; d < h.length; d++) {
                e = parseFloat(A.getPropertyValue(b, h[d])), isNaN(e) || (f += e);
              }return c ? -f : f;
            }return 0;
          }function b(b, c) {
            return function (d, e, f) {
              switch (d) {case "name":
                  return b;case "extract":
                  return parseFloat(f) + a(b, e, c);case "inject":
                  return parseFloat(f) - a(b, e, c) + "px";}
            };
          }p && !(p > 9) || y.State.isGingerbread || (A.Lists.transformsBase = A.Lists.transformsBase.concat(A.Lists.transforms3D));for (var c = 0; c < A.Lists.transformsBase.length; c++) {
            !function () {
              var a = A.Lists.transformsBase[c];A.Normalizations.registered[a] = function (b, c, e) {
                switch (b) {case "name":
                    return "transform";case "extract":
                    return g(c) === d || g(c).transformCache[a] === d ? /^scale/i.test(a) ? 1 : 0 : g(c).transformCache[a].replace(/[()]/g, "");case "inject":
                    var f = !1;switch (a.substr(0, a.length - 1)) {case "translate":
                        f = !/(%|px|em|rem|vw|vh|\d)$/i.test(e);break;case "scal":case "scale":
                        y.State.isAndroid && g(c).transformCache[a] === d && e < 1 && (e = 1), f = !/(\d)$/i.test(e);break;case "skew":case "rotate":
                        f = !/(deg|\d)$/i.test(e);}return f || (g(c).transformCache[a] = "(" + e + ")"), g(c).transformCache[a];}
              };
            }();
          }for (var e = 0; e < A.Lists.colors.length; e++) {
            !function () {
              var a = A.Lists.colors[e];A.Normalizations.registered[a] = function (b, c, e) {
                switch (b) {case "name":
                    return a;case "extract":
                    var f;if (A.RegEx.wrappedValueAlreadyExtracted.test(e)) f = e;else {
                      var g,
                          h = { black: "rgb(0, 0, 0)", blue: "rgb(0, 0, 255)", gray: "rgb(128, 128, 128)", green: "rgb(0, 128, 0)", red: "rgb(255, 0, 0)", white: "rgb(255, 255, 255)" };/^[A-z]+$/i.test(e) ? g = h[e] !== d ? h[e] : h.black : A.RegEx.isHex.test(e) ? g = "rgb(" + A.Values.hexToRgb(e).join(" ") + ")" : /^rgba?\(/i.test(e) || (g = h.black), f = (g || e).toString().match(A.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                    }return (!p || p > 8) && 3 === f.split(" ").length && (f += " 1"), f;case "inject":
                    return (/^rgb/.test(e) ? e : (p <= 8 ? 4 === e.split(" ").length && (e = e.split(/\s+/).slice(0, 3).join(" ")) : 3 === e.split(" ").length && (e += " 1"), (p <= 8 ? "rgb" : "rgba") + "(" + e.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")")
                    );}
              };
            }();
          }A.Normalizations.registered.innerWidth = b("width", !0), A.Normalizations.registered.innerHeight = b("height", !0), A.Normalizations.registered.outerWidth = b("width"), A.Normalizations.registered.outerHeight = b("height");
        } }, Names: { camelCase: function camelCase(a) {
          return a.replace(/-(\w)/g, function (a, b) {
            return b.toUpperCase();
          });
        }, SVGAttribute: function SVGAttribute(a) {
          var b = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";return (p || y.State.isAndroid && !y.State.isChrome) && (b += "|transform"), new RegExp("^(" + b + ")$", "i").test(a);
        }, prefixCheck: function prefixCheck(a) {
          if (y.State.prefixMatches[a]) return [y.State.prefixMatches[a], !0];for (var b = ["", "Webkit", "Moz", "ms", "O"], c = 0, d = b.length; c < d; c++) {
            var e;if (e = 0 === c ? a : b[c] + a.replace(/^\w/, function (a) {
              return a.toUpperCase();
            }), u.isString(y.State.prefixElement.style[e])) return y.State.prefixMatches[a] = e, [e, !0];
          }return [a, !1];
        } }, Values: { hexToRgb: function hexToRgb(a) {
          var b,
              c = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
              d = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;return a = a.replace(c, function (a, b, c, d) {
            return b + b + c + c + d + d;
          }), b = d.exec(a), b ? [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16)] : [0, 0, 0];
        }, isCSSNullValue: function isCSSNullValue(a) {
          return !a || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(a);
        }, getUnitType: function getUnitType(a) {
          return (/^(rotate|skew)/i.test(a) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(a) ? "" : "px"
          );
        }, getDisplayType: function getDisplayType(a) {
          var b = a && a.tagName.toString().toLowerCase();return (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(b) ? "inline" : /^(li)$/i.test(b) ? "list-item" : /^(tr)$/i.test(b) ? "table-row" : /^(table)$/i.test(b) ? "table" : /^(tbody)$/i.test(b) ? "table-row-group" : "block"
          );
        }, addClass: function addClass(a, b) {
          if (a) if (a.classList) a.classList.add(b);else if (u.isString(a.className)) a.className += (a.className.length ? " " : "") + b;else {
            var c = a.getAttribute(p <= 7 ? "className" : "class") || "";a.setAttribute("class", c + (c ? " " : "") + b);
          }
        }, removeClass: function removeClass(a, b) {
          if (a) if (a.classList) a.classList.remove(b);else if (u.isString(a.className)) a.className = a.className.toString().replace(new RegExp("(^|\\s)" + b.split(" ").join("|") + "(\\s|$)", "gi"), " ");else {
            var c = a.getAttribute(p <= 7 ? "className" : "class") || "";a.setAttribute("class", c.replace(new RegExp("(^|s)" + b.split(" ").join("|") + "(s|$)", "gi"), " "));
          }
        } }, getPropertyValue: function getPropertyValue(a, c, e, f) {
        function h(a, c) {
          var e = 0;if (p <= 8) e = o.css(a, c);else {
            var i = !1;/^(width|height)$/.test(c) && 0 === A.getPropertyValue(a, "display") && (i = !0, A.setPropertyValue(a, "display", A.Values.getDisplayType(a)));var j = function j() {
              i && A.setPropertyValue(a, "display", "none");
            };if (!f) {
              if ("height" === c && "border-box" !== A.getPropertyValue(a, "boxSizing").toString().toLowerCase()) {
                var k = a.offsetHeight - (parseFloat(A.getPropertyValue(a, "borderTopWidth")) || 0) - (parseFloat(A.getPropertyValue(a, "borderBottomWidth")) || 0) - (parseFloat(A.getPropertyValue(a, "paddingTop")) || 0) - (parseFloat(A.getPropertyValue(a, "paddingBottom")) || 0);return j(), k;
              }if ("width" === c && "border-box" !== A.getPropertyValue(a, "boxSizing").toString().toLowerCase()) {
                var l = a.offsetWidth - (parseFloat(A.getPropertyValue(a, "borderLeftWidth")) || 0) - (parseFloat(A.getPropertyValue(a, "borderRightWidth")) || 0) - (parseFloat(A.getPropertyValue(a, "paddingLeft")) || 0) - (parseFloat(A.getPropertyValue(a, "paddingRight")) || 0);return j(), l;
              }
            }var m;m = g(a) === d ? b.getComputedStyle(a, null) : g(a).computedStyle ? g(a).computedStyle : g(a).computedStyle = b.getComputedStyle(a, null), "borderColor" === c && (c = "borderTopColor"), e = 9 === p && "filter" === c ? m.getPropertyValue(c) : m[c], "" !== e && null !== e || (e = a.style[c]), j();
          }if ("auto" === e && /^(top|right|bottom|left)$/i.test(c)) {
            var n = h(a, "position");("fixed" === n || "absolute" === n && /top|left/i.test(c)) && (e = o(a).position()[c] + "px");
          }return e;
        }var i;if (A.Hooks.registered[c]) {
          var j = c,
              k = A.Hooks.getRoot(j);e === d && (e = A.getPropertyValue(a, A.Names.prefixCheck(k)[0])), A.Normalizations.registered[k] && (e = A.Normalizations.registered[k]("extract", a, e)), i = A.Hooks.extractValue(j, e);
        } else if (A.Normalizations.registered[c]) {
          var l, m;l = A.Normalizations.registered[c]("name", a), "transform" !== l && (m = h(a, A.Names.prefixCheck(l)[0]), A.Values.isCSSNullValue(m) && A.Hooks.templates[c] && (m = A.Hooks.templates[c][1])), i = A.Normalizations.registered[c]("extract", a, m);
        }if (!/^[\d-]/.test(i)) {
          var n = g(a);if (n && n.isSVG && A.Names.SVGAttribute(c)) {
            if (/^(height|width)$/i.test(c)) try {
              i = a.getBBox()[c];
            } catch (q) {
              i = 0;
            } else i = a.getAttribute(c);
          } else i = h(a, A.Names.prefixCheck(c)[0]);
        }return A.Values.isCSSNullValue(i) && (i = 0), y.debug >= 2 && console.log("Get " + c + ": " + i), i;
      }, setPropertyValue: function setPropertyValue(a, c, d, e, f) {
        var h = c;if ("scroll" === c) f.container ? f.container["scroll" + f.direction] = d : "Left" === f.direction ? b.scrollTo(d, f.alternateValue) : b.scrollTo(f.alternateValue, d);else if (A.Normalizations.registered[c] && "transform" === A.Normalizations.registered[c]("name", a)) A.Normalizations.registered[c]("inject", a, d), h = "transform", d = g(a).transformCache[c];else {
          if (A.Hooks.registered[c]) {
            var i = c,
                j = A.Hooks.getRoot(c);e = e || A.getPropertyValue(a, j), d = A.Hooks.injectValue(i, d, e), c = j;
          }if (A.Normalizations.registered[c] && (d = A.Normalizations.registered[c]("inject", a, d), c = A.Normalizations.registered[c]("name", a)), h = A.Names.prefixCheck(c)[0], p <= 8) try {
            a.style[h] = d;
          } catch (l) {
            y.debug && console.log("Browser does not support [" + d + "] for [" + h + "]");
          } else {
            var k = g(a);k && k.isSVG && A.Names.SVGAttribute(c) ? a.setAttribute(c, d) : a.style[h] = d;
          }y.debug >= 2 && console.log("Set " + c + " (" + h + "): " + d);
        }return [h, d];
      }, flushTransformCache: function flushTransformCache(a) {
        var b = "",
            c = g(a);if ((p || y.State.isAndroid && !y.State.isChrome) && c && c.isSVG) {
          var d = function d(b) {
            return parseFloat(A.getPropertyValue(a, b));
          },
              e = { translate: [d("translateX"), d("translateY")], skewX: [d("skewX")], skewY: [d("skewY")], scale: 1 !== d("scale") ? [d("scale"), d("scale")] : [d("scaleX"), d("scaleY")], rotate: [d("rotateZ"), 0, 0] };o.each(g(a).transformCache, function (a) {
            /^translate/i.test(a) ? a = "translate" : /^scale/i.test(a) ? a = "scale" : /^rotate/i.test(a) && (a = "rotate"), e[a] && (b += a + "(" + e[a].join(" ") + ") ", delete e[a]);
          });
        } else {
          var f, h;o.each(g(a).transformCache, function (c) {
            if (f = g(a).transformCache[c], "transformPerspective" === c) return h = f, !0;9 === p && "rotateZ" === c && (c = "rotate"), b += c + f + " ";
          }), h && (b = "perspective" + h + " " + b);
        }A.setPropertyValue(a, "transform", b);
      } };A.Hooks.register(), A.Normalizations.register(), y.hook = function (a, b, c) {
      var e;return a = f(a), o.each(a, function (a, f) {
        if (g(f) === d && y.init(f), c === d) e === d && (e = A.getPropertyValue(f, b));else {
          var h = A.setPropertyValue(f, b, c);"transform" === h[0] && y.CSS.flushTransformCache(f), e = h;
        }
      }), e;
    };var B = function B() {
      function a() {
        return k ? z.promise || null : p;
      }function e(a, e) {
        function f(f) {
          var k, n;if (i.begin && 0 === D) try {
            i.begin.call(r, r);
          } catch (V) {
            setTimeout(function () {
              throw V;
            }, 1);
          }if ("scroll" === G) {
            var p,
                q,
                w,
                x = /^x$/i.test(i.axis) ? "Left" : "Top",
                B = parseFloat(i.offset) || 0;i.container ? u.isWrapped(i.container) || u.isNode(i.container) ? (i.container = i.container[0] || i.container, p = i.container["scroll" + x], w = p + o(a).position()[x.toLowerCase()] + B) : i.container = null : (p = y.State.scrollAnchor[y.State["scrollProperty" + x]], q = y.State.scrollAnchor[y.State["scrollProperty" + ("Left" === x ? "Top" : "Left")]], w = o(a).offset()[x.toLowerCase()] + B), j = { scroll: { rootPropertyValue: !1, startValue: p, currentValue: p, endValue: w, unitType: "", easing: i.easing, scrollData: { container: i.container, direction: x, alternateValue: q } }, element: a }, y.debug && console.log("tweensContainer (scroll): ", j.scroll, a);
          } else if ("reverse" === G) {
            if (!(k = g(a))) return;if (!k.tweensContainer) return void o.dequeue(a, i.queue);"none" === k.opts.display && (k.opts.display = "auto"), "hidden" === k.opts.visibility && (k.opts.visibility = "visible"), k.opts.loop = !1, k.opts.begin = null, k.opts.complete = null, v.easing || delete i.easing, v.duration || delete i.duration, i = o.extend({}, k.opts, i), n = o.extend(!0, {}, k ? k.tweensContainer : null);for (var E in n) {
              if (n.hasOwnProperty(E) && "element" !== E) {
                var F = n[E].startValue;n[E].startValue = n[E].currentValue = n[E].endValue, n[E].endValue = F, u.isEmptyObject(v) || (n[E].easing = i.easing), y.debug && console.log("reverse tweensContainer (" + E + "): " + JSON.stringify(n[E]), a);
              }
            }j = n;
          } else if ("start" === G) {
            k = g(a), k && k.tweensContainer && !0 === k.isAnimating && (n = k.tweensContainer);var H = function H(e, f) {
              var g,
                  l = A.Hooks.getRoot(e),
                  m = !1,
                  p = f[0],
                  q = f[1],
                  r = f[2];if (!(k && k.isSVG || "tween" === l || !1 !== A.Names.prefixCheck(l)[1] || A.Normalizations.registered[l] !== d)) return void (y.debug && console.log("Skipping [" + l + "] due to a lack of browser support."));(i.display !== d && null !== i.display && "none" !== i.display || i.visibility !== d && "hidden" !== i.visibility) && /opacity|filter/.test(e) && !r && 0 !== p && (r = 0), i._cacheValues && n && n[e] ? (r === d && (r = n[e].endValue + n[e].unitType), m = k.rootPropertyValueCache[l]) : A.Hooks.registered[e] ? r === d ? (m = A.getPropertyValue(a, l), r = A.getPropertyValue(a, e, m)) : m = A.Hooks.templates[l][1] : r === d && (r = A.getPropertyValue(a, e));var s,
                  t,
                  v,
                  w = !1,
                  x = function x(a, b) {
                var c, d;return d = (b || "0").toString().toLowerCase().replace(/[%A-z]+$/, function (a) {
                  return c = a, "";
                }), c || (c = A.Values.getUnitType(a)), [d, c];
              };if (r !== p && u.isString(r) && u.isString(p)) {
                g = "";var z = 0,
                    B = 0,
                    C = [],
                    D = [],
                    E = 0,
                    F = 0,
                    G = 0;for (r = A.Hooks.fixColors(r), p = A.Hooks.fixColors(p); z < r.length && B < p.length;) {
                  var H = r[z],
                      I = p[B];if (/[\d\.-]/.test(H) && /[\d\.-]/.test(I)) {
                    for (var J = H, K = I, L = ".", N = "."; ++z < r.length;) {
                      if ((H = r[z]) === L) L = "..";else if (!/\d/.test(H)) break;J += H;
                    }for (; ++B < p.length;) {
                      if ((I = p[B]) === N) N = "..";else if (!/\d/.test(I)) break;K += I;
                    }var O = A.Hooks.getUnit(r, z),
                        P = A.Hooks.getUnit(p, B);if (z += O.length, B += P.length, O === P) J === K ? g += J + O : (g += "{" + C.length + (F ? "!" : "") + "}" + O, C.push(parseFloat(J)), D.push(parseFloat(K)));else {
                      var Q = parseFloat(J),
                          R = parseFloat(K);g += (E < 5 ? "calc" : "") + "(" + (Q ? "{" + C.length + (F ? "!" : "") + "}" : "0") + O + " + " + (R ? "{" + (C.length + (Q ? 1 : 0)) + (F ? "!" : "") + "}" : "0") + P + ")", Q && (C.push(Q), D.push(0)), R && (C.push(0), D.push(R));
                    }
                  } else {
                    if (H !== I) {
                      E = 0;break;
                    }g += H, z++, B++, 0 === E && "c" === H || 1 === E && "a" === H || 2 === E && "l" === H || 3 === E && "c" === H || E >= 4 && "(" === H ? E++ : (E && E < 5 || E >= 4 && ")" === H && --E < 5) && (E = 0), 0 === F && "r" === H || 1 === F && "g" === H || 2 === F && "b" === H || 3 === F && "a" === H || F >= 3 && "(" === H ? (3 === F && "a" === H && (G = 1), F++) : G && "," === H ? ++G > 3 && (F = G = 0) : (G && F < (G ? 5 : 4) || F >= (G ? 4 : 3) && ")" === H && --F < (G ? 5 : 4)) && (F = G = 0);
                  }
                }z === r.length && B === p.length || (y.debug && console.error('Trying to pattern match mis-matched strings ["' + p + '", "' + r + '"]'), g = d), g && (C.length ? (y.debug && console.log('Pattern found "' + g + '" -> ', C, D, "[" + r + "," + p + "]"), r = C, p = D, t = v = "") : g = d);
              }g || (s = x(e, r), r = s[0], v = s[1], s = x(e, p), p = s[0].replace(/^([+-\/*])=/, function (a, b) {
                return w = b, "";
              }), t = s[1], r = parseFloat(r) || 0, p = parseFloat(p) || 0, "%" === t && (/^(fontSize|lineHeight)$/.test(e) ? (p /= 100, t = "em") : /^scale/.test(e) ? (p /= 100, t = "") : /(Red|Green|Blue)$/i.test(e) && (p = p / 100 * 255, t = "")));if (/[\/*]/.test(w)) t = v;else if (v !== t && 0 !== r) if (0 === p) t = v;else {
                h = h || function () {
                  var d = { myParent: a.parentNode || c.body, position: A.getPropertyValue(a, "position"), fontSize: A.getPropertyValue(a, "fontSize") },
                      e = d.position === M.lastPosition && d.myParent === M.lastParent,
                      f = d.fontSize === M.lastFontSize;M.lastParent = d.myParent, M.lastPosition = d.position, M.lastFontSize = d.fontSize;var g = {};if (f && e) g.emToPx = M.lastEmToPx, g.percentToPxWidth = M.lastPercentToPxWidth, g.percentToPxHeight = M.lastPercentToPxHeight;else {
                    var h = k && k.isSVG ? c.createElementNS("http://www.w3.org/2000/svg", "rect") : c.createElement("div");y.init(h), d.myParent.appendChild(h), o.each(["overflow", "overflowX", "overflowY"], function (a, b) {
                      y.CSS.setPropertyValue(h, b, "hidden");
                    }), y.CSS.setPropertyValue(h, "position", d.position), y.CSS.setPropertyValue(h, "fontSize", d.fontSize), y.CSS.setPropertyValue(h, "boxSizing", "content-box"), o.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function (a, b) {
                      y.CSS.setPropertyValue(h, b, "100%");
                    }), y.CSS.setPropertyValue(h, "paddingLeft", "100em"), g.percentToPxWidth = M.lastPercentToPxWidth = (parseFloat(A.getPropertyValue(h, "width", null, !0)) || 1) / 100, g.percentToPxHeight = M.lastPercentToPxHeight = (parseFloat(A.getPropertyValue(h, "height", null, !0)) || 1) / 100, g.emToPx = M.lastEmToPx = (parseFloat(A.getPropertyValue(h, "paddingLeft")) || 1) / 100, d.myParent.removeChild(h);
                  }return null === M.remToPx && (M.remToPx = parseFloat(A.getPropertyValue(c.body, "fontSize")) || 16), null === M.vwToPx && (M.vwToPx = parseFloat(b.innerWidth) / 100, M.vhToPx = parseFloat(b.innerHeight) / 100), g.remToPx = M.remToPx, g.vwToPx = M.vwToPx, g.vhToPx = M.vhToPx, y.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(g), a), g;
                }();var S = /margin|padding|left|right|width|text|word|letter/i.test(e) || /X$/.test(e) || "x" === e ? "x" : "y";switch (v) {case "%":
                    r *= "x" === S ? h.percentToPxWidth : h.percentToPxHeight;break;case "px":
                    break;default:
                    r *= h[v + "ToPx"];}switch (t) {case "%":
                    r *= 1 / ("x" === S ? h.percentToPxWidth : h.percentToPxHeight);break;case "px":
                    break;default:
                    r *= 1 / h[t + "ToPx"];}
              }switch (w) {case "+":
                  p = r + p;break;case "-":
                  p = r - p;break;case "*":
                  p *= r;break;case "/":
                  p = r / p;}j[e] = { rootPropertyValue: m, startValue: r, currentValue: r, endValue: p, unitType: t, easing: q }, g && (j[e].pattern = g), y.debug && console.log("tweensContainer (" + e + "): " + JSON.stringify(j[e]), a);
            };for (var I in s) {
              if (s.hasOwnProperty(I)) {
                var J = A.Names.camelCase(I),
                    K = function (b, c) {
                  var d, f, g;return u.isFunction(b) && (b = b.call(a, e, C)), u.isArray(b) ? (d = b[0], !u.isArray(b[1]) && /^[\d-]/.test(b[1]) || u.isFunction(b[1]) || A.RegEx.isHex.test(b[1]) ? g = b[1] : u.isString(b[1]) && !A.RegEx.isHex.test(b[1]) && y.Easings[b[1]] || u.isArray(b[1]) ? (f = c ? b[1] : l(b[1], i.duration), g = b[2]) : g = b[1] || b[2]) : d = b, c || (f = f || i.easing), u.isFunction(d) && (d = d.call(a, e, C)), u.isFunction(g) && (g = g.call(a, e, C)), [d || 0, f, g];
                }(s[I]);if (t(A.Lists.colors, J)) {
                  var L = K[0],
                      O = K[1],
                      P = K[2];if (A.RegEx.isHex.test(L)) {
                    for (var Q = ["Red", "Green", "Blue"], R = A.Values.hexToRgb(L), S = P ? A.Values.hexToRgb(P) : d, T = 0; T < Q.length; T++) {
                      var U = [R[T]];O && U.push(O), S !== d && U.push(S[T]), H(J + Q[T], U);
                    }continue;
                  }
                }H(J, K);
              }
            }j.element = a;
          }j.element && (A.Values.addClass(a, "velocity-animating"), N.push(j), k = g(a), k && ("" === i.queue && (k.tweensContainer = j, k.opts = i), k.isAnimating = !0), D === C - 1 ? (y.State.calls.push([N, r, i, null, z.resolver, null, 0]), !1 === y.State.isTicking && (y.State.isTicking = !0, m())) : D++);
        }var h,
            i = o.extend({}, y.defaults, v),
            j = {};switch (g(a) === d && y.init(a), parseFloat(i.delay) && !1 !== i.queue && o.queue(a, i.queue, function (b, c) {
          if (!0 === c) return !0;y.velocityQueueEntryFlag = !0;var d = y.State.delayedElements.count++;y.State.delayedElements[d] = a;var e = function (a) {
            return function () {
              y.State.delayedElements[a] = !1, b();
            };
          }(d);g(a).delayBegin = new Date().getTime(), g(a).delay = parseFloat(i.delay), g(a).delayTimer = { setTimeout: setTimeout(b, parseFloat(i.delay)), next: e };
        }), i.duration.toString().toLowerCase()) {case "fast":
            i.duration = 200;break;case "normal":
            i.duration = w;break;case "slow":
            i.duration = 600;break;default:
            i.duration = parseFloat(i.duration) || 1;}if (!1 !== y.mock && (!0 === y.mock ? i.duration = i.delay = 1 : (i.duration *= parseFloat(y.mock) || 1, i.delay *= parseFloat(y.mock) || 1)), i.easing = l(i.easing, i.duration), i.begin && !u.isFunction(i.begin) && (i.begin = null), i.progress && !u.isFunction(i.progress) && (i.progress = null), i.complete && !u.isFunction(i.complete) && (i.complete = null), i.display !== d && null !== i.display && (i.display = i.display.toString().toLowerCase(), "auto" === i.display && (i.display = y.CSS.Values.getDisplayType(a))), i.visibility !== d && null !== i.visibility && (i.visibility = i.visibility.toString().toLowerCase()), i.mobileHA = i.mobileHA && y.State.isMobile && !y.State.isGingerbread, !1 === i.queue) {
          if (i.delay) {
            var k = y.State.delayedElements.count++;y.State.delayedElements[k] = a;var n = function (a) {
              return function () {
                y.State.delayedElements[a] = !1, f();
              };
            }(k);g(a).delayBegin = new Date().getTime(), g(a).delay = parseFloat(i.delay), g(a).delayTimer = { setTimeout: setTimeout(f, parseFloat(i.delay)), next: n };
          } else f();
        } else o.queue(a, i.queue, function (a, b) {
          if (!0 === b) return z.promise && z.resolver(r), !0;y.velocityQueueEntryFlag = !0, f(a);
        });"" !== i.queue && "fx" !== i.queue || "inprogress" === o.queue(a)[0] || o.dequeue(a);
      }var j,
          k,
          p,
          q,
          r,
          s,
          v,
          x = arguments[0] && (arguments[0].p || o.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || u.isString(arguments[0].properties));u.isWrapped(this) ? (k = !1, q = 0, r = this, p = this) : (k = !0, q = 1, r = x ? arguments[0].elements || arguments[0].e : arguments[0]);var z = { promise: null, resolver: null, rejecter: null };if (k && y.Promise && (z.promise = new y.Promise(function (a, b) {
        z.resolver = a, z.rejecter = b;
      })), x ? (s = arguments[0].properties || arguments[0].p, v = arguments[0].options || arguments[0].o) : (s = arguments[q], v = arguments[q + 1]), !(r = f(r))) return void (z.promise && (s && v && !1 === v.promiseRejectEmpty ? z.resolver() : z.rejecter()));var C = r.length,
          D = 0;if (!/^(stop|finish|finishAll|pause|resume)$/i.test(s) && !o.isPlainObject(v)) {
        var E = q + 1;v = {};for (var F = E; F < arguments.length; F++) {
          u.isArray(arguments[F]) || !/^(fast|normal|slow)$/i.test(arguments[F]) && !/^\d/.test(arguments[F]) ? u.isString(arguments[F]) || u.isArray(arguments[F]) ? v.easing = arguments[F] : u.isFunction(arguments[F]) && (v.complete = arguments[F]) : v.duration = arguments[F];
        }
      }var G;switch (s) {case "scroll":
          G = "scroll";break;case "reverse":
          G = "reverse";break;case "pause":
          var H = new Date().getTime();return o.each(r, function (a, b) {
            h(b, H);
          }), o.each(y.State.calls, function (a, b) {
            var c = !1;b && o.each(b[1], function (a, e) {
              var f = v === d ? "" : v;return !0 !== f && b[2].queue !== f && (v !== d || !1 !== b[2].queue) || (o.each(r, function (a, d) {
                if (d === e) return b[5] = { resume: !1 }, c = !0, !1;
              }), !c && void 0);
            });
          }), a();case "resume":
          return o.each(r, function (a, b) {
            i(b, H);
          }), o.each(y.State.calls, function (a, b) {
            var c = !1;b && o.each(b[1], function (a, e) {
              var f = v === d ? "" : v;return !0 !== f && b[2].queue !== f && (v !== d || !1 !== b[2].queue) || !b[5] || (o.each(r, function (a, d) {
                if (d === e) return b[5].resume = !0, c = !0, !1;
              }), !c && void 0);
            });
          }), a();case "finish":case "finishAll":case "stop":
          o.each(r, function (a, b) {
            g(b) && g(b).delayTimer && (clearTimeout(g(b).delayTimer.setTimeout), g(b).delayTimer.next && g(b).delayTimer.next(), delete g(b).delayTimer), "finishAll" !== s || !0 !== v && !u.isString(v) || (o.each(o.queue(b, u.isString(v) ? v : ""), function (a, b) {
              u.isFunction(b) && b();
            }), o.queue(b, u.isString(v) ? v : "", []));
          });var I = [];return o.each(y.State.calls, function (a, b) {
            b && o.each(b[1], function (c, e) {
              var f = v === d ? "" : v;if (!0 !== f && b[2].queue !== f && (v !== d || !1 !== b[2].queue)) return !0;o.each(r, function (c, d) {
                if (d === e) if ((!0 === v || u.isString(v)) && (o.each(o.queue(d, u.isString(v) ? v : ""), function (a, b) {
                  u.isFunction(b) && b(null, !0);
                }), o.queue(d, u.isString(v) ? v : "", [])), "stop" === s) {
                  var h = g(d);h && h.tweensContainer && (!0 === f || "" === f) && o.each(h.tweensContainer, function (a, b) {
                    b.endValue = b.currentValue;
                  }), I.push(a);
                } else "finish" !== s && "finishAll" !== s || (b[2].duration = 1);
              });
            });
          }), "stop" === s && (o.each(I, function (a, b) {
            n(b, !0);
          }), z.promise && z.resolver(r)), a();default:
          if (!o.isPlainObject(s) || u.isEmptyObject(s)) {
            if (u.isString(s) && y.Redirects[s]) {
              j = o.extend({}, v);var J = j.duration,
                  K = j.delay || 0;return !0 === j.backwards && (r = o.extend(!0, [], r).reverse()), o.each(r, function (a, b) {
                parseFloat(j.stagger) ? j.delay = K + parseFloat(j.stagger) * a : u.isFunction(j.stagger) && (j.delay = K + j.stagger.call(b, a, C)), j.drag && (j.duration = parseFloat(J) || (/^(callout|transition)/.test(s) ? 1e3 : w), j.duration = Math.max(j.duration * (j.backwards ? 1 - a / C : (a + 1) / C), .75 * j.duration, 200)), y.Redirects[s].call(b, b, j || {}, a, C, r, z.promise ? z : d);
              }), a();
            }var L = "Velocity: First argument (" + s + ") was not a property map, a known action, or a registered redirect. Aborting.";return z.promise ? z.rejecter(new Error(L)) : b.console && console.log(L), a();
          }G = "start";}var M = { lastParent: null, lastPosition: null, lastFontSize: null, lastPercentToPxWidth: null, lastPercentToPxHeight: null, lastEmToPx: null, remToPx: null, vwToPx: null, vhToPx: null },
          N = [];o.each(r, function (a, b) {
        u.isNode(b) && e(b, a);
      }), j = o.extend({}, y.defaults, v), j.loop = parseInt(j.loop, 10);var O = 2 * j.loop - 1;if (j.loop) for (var P = 0; P < O; P++) {
        var Q = { delay: j.delay, progress: j.progress };P === O - 1 && (Q.display = j.display, Q.visibility = j.visibility, Q.complete = j.complete), B(r, "reverse", Q);
      }return a();
    };y = o.extend(B, y), y.animate = B;var C = b.requestAnimationFrame || q;if (!y.State.isMobile && c.hidden !== d) {
      var D = function D() {
        c.hidden ? (C = function C(a) {
          return setTimeout(function () {
            a(!0);
          }, 16);
        }, m()) : C = b.requestAnimationFrame || q;
      };D(), c.addEventListener("visibilitychange", D);
    }return a.Velocity = y, a !== b && (a.fn.velocity = B, a.fn.velocity.defaults = y.defaults), o.each(["Down", "Up"], function (a, b) {
      y.Redirects["slide" + b] = function (a, c, e, f, g, h) {
        var i = o.extend({}, c),
            j = i.begin,
            k = i.complete,
            l = {},
            m = { height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: "" };i.display === d && (i.display = "Down" === b ? "inline" === y.CSS.Values.getDisplayType(a) ? "inline-block" : "block" : "none"), i.begin = function () {
          0 === e && j && j.call(g, g);for (var c in m) {
            if (m.hasOwnProperty(c)) {
              l[c] = a.style[c];var d = A.getPropertyValue(a, c);m[c] = "Down" === b ? [d, 0] : [0, d];
            }
          }l.overflow = a.style.overflow, a.style.overflow = "hidden";
        }, i.complete = function () {
          for (var b in l) {
            l.hasOwnProperty(b) && (a.style[b] = l[b]);
          }e === f - 1 && (k && k.call(g, g), h && h.resolver(g));
        }, y(a, m, i);
      };
    }), o.each(["In", "Out"], function (a, b) {
      y.Redirects["fade" + b] = function (a, c, e, f, g, h) {
        var i = o.extend({}, c),
            j = i.complete,
            k = { opacity: "In" === b ? 1 : 0 };0 !== e && (i.begin = null), i.complete = e !== f - 1 ? null : function () {
          j && j.call(g, g), h && h.resolver(g);
        }, i.display === d && (i.display = "In" === b ? "auto" : "none"), y(this, k, i);
      };
    }), y;
  }(window.jQuery || window.Zepto || window, window, window ? window.document : undefined);
});

},{}],204:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (a) {
  "use strict";
  "function" == typeof require && "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? module.exports = a() : "function" == typeof define && define.amd ? define(["velocity"], a) : a();
}(function () {
  "use strict";
  return function (a, b, c, d) {
    var e = a.Velocity;if (!e || !e.Utilities) return void (b.console && console.log("Velocity UI Pack: Velocity must be loaded first. Aborting."));var f = e.Utilities,
        g = e.version,
        h = { major: 1, minor: 1, patch: 0 };if (function (a, b) {
      var c = [];return !(!a || !b) && (f.each([a, b], function (a, b) {
        var d = [];f.each(b, function (a, b) {
          for (; b.toString().length < 5;) {
            b = "0" + b;
          }d.push(b);
        }), c.push(d.join(""));
      }), parseFloat(c[0]) > parseFloat(c[1]));
    }(h, g)) {
      var i = "Velocity UI Pack: You need to update Velocity (velocity.js) to a newer version. Visit http://github.com/julianshapiro/velocity.";throw alert(i), new Error(i);
    }e.RegisterEffect = e.RegisterUI = function (a, b) {
      function c(a, b, c, d) {
        var g,
            h = 0;f.each(a.nodeType ? [a] : a, function (a, b) {
          d && (c += a * d), g = b.parentNode;var i = ["height", "paddingTop", "paddingBottom", "marginTop", "marginBottom"];"border-box" === e.CSS.getPropertyValue(b, "boxSizing").toString().toLowerCase() && (i = ["height"]), f.each(i, function (a, c) {
            h += parseFloat(e.CSS.getPropertyValue(b, c));
          });
        }), e.animate(g, { height: ("In" === b ? "+" : "-") + "=" + h }, { queue: !1, easing: "ease-in-out", duration: c * ("In" === b ? .6 : 1) });
      }return e.Redirects[a] = function (d, g, h, i, j, k, l) {
        var m = h === i - 1,
            n = 0;l = l || b.loop, "function" == typeof b.defaultDuration ? b.defaultDuration = b.defaultDuration.call(j, j) : b.defaultDuration = parseFloat(b.defaultDuration);for (var o = 0; o < b.calls.length; o++) {
          "number" == typeof (t = b.calls[o][1]) && (n += t);
        }var p = n >= 1 ? 0 : b.calls.length ? (1 - n) / b.calls.length : 1;for (o = 0; o < b.calls.length; o++) {
          var q = b.calls[o],
              r = q[0],
              s = 1e3,
              t = q[1],
              u = q[2] || {},
              v = {};if (void 0 !== g.duration ? s = g.duration : void 0 !== b.defaultDuration && (s = b.defaultDuration), v.duration = s * ("number" == typeof t ? t : p), v.queue = g.queue || "", v.easing = u.easing || "ease", v.delay = parseFloat(u.delay) || 0, v.loop = !b.loop && u.loop, v._cacheValues = u._cacheValues || !0, 0 === o) {
            if (v.delay += parseFloat(g.delay) || 0, 0 === h && (v.begin = function () {
              g.begin && g.begin.call(j, j);var b = a.match(/(In|Out)$/);b && "In" === b[0] && void 0 !== r.opacity && f.each(j.nodeType ? [j] : j, function (a, b) {
                e.CSS.setPropertyValue(b, "opacity", 0);
              }), g.animateParentHeight && b && c(j, b[0], s + v.delay, g.stagger);
            }), null !== g.display) if (void 0 !== g.display && "none" !== g.display) v.display = g.display;else if (/In$/.test(a)) {
              var w = e.CSS.Values.getDisplayType(d);v.display = "inline" === w ? "inline-block" : w;
            }g.visibility && "hidden" !== g.visibility && (v.visibility = g.visibility);
          }if (o === b.calls.length - 1) {
            var x = function x() {
              void 0 !== g.display && "none" !== g.display || !/Out$/.test(a) || f.each(j.nodeType ? [j] : j, function (a, b) {
                e.CSS.setPropertyValue(b, "display", "none");
              }), g.complete && g.complete.call(j, j), k && k.resolver(j || d);
            };v.complete = function () {
              if (l && e.Redirects[a](d, g, h, i, j, k, !0 === l || Math.max(0, l - 1)), b.reset) {
                for (var c in b.reset) {
                  if (b.reset.hasOwnProperty(c)) {
                    var f = b.reset[c];void 0 !== e.CSS.Hooks.registered[c] || "string" != typeof f && "number" != typeof f || (b.reset[c] = [b.reset[c], b.reset[c]]);
                  }
                }var n = { duration: 0, queue: !1 };m && (n.complete = x), e.animate(d, b.reset, n);
              } else m && x();
            }, "hidden" === g.visibility && (v.visibility = g.visibility);
          }e.animate(d, r, v);
        }
      }, e;
    }, e.RegisterEffect.packagedEffects = { "callout.bounce": { defaultDuration: 550, calls: [[{ translateY: -30 }, .25], [{ translateY: 0 }, .125], [{ translateY: -15 }, .125], [{ translateY: 0 }, .25]] }, "callout.shake": { defaultDuration: 800, calls: [[{ translateX: -11 }], [{ translateX: 11 }], [{ translateX: -11 }], [{ translateX: 11 }], [{ translateX: -11 }], [{ translateX: 11 }], [{ translateX: -11 }], [{ translateX: 0 }]] }, "callout.flash": { defaultDuration: 1100, calls: [[{ opacity: [0, "easeInOutQuad", 1] }], [{ opacity: [1, "easeInOutQuad"] }], [{ opacity: [0, "easeInOutQuad"] }], [{ opacity: [1, "easeInOutQuad"] }]] }, "callout.pulse": { defaultDuration: 825, calls: [[{ scaleX: 1.1, scaleY: 1.1 }, .5, { easing: "easeInExpo" }], [{ scaleX: 1, scaleY: 1 }, .5]] }, "callout.swing": { defaultDuration: 950, calls: [[{ rotateZ: 15 }], [{ rotateZ: -10 }], [{ rotateZ: 5 }], [{ rotateZ: -5 }], [{ rotateZ: 0 }]] }, "callout.tada": { defaultDuration: 1e3, calls: [[{ scaleX: .9, scaleY: .9, rotateZ: -3 }, .1], [{ scaleX: 1.1, scaleY: 1.1, rotateZ: 3 }, .1], [{ scaleX: 1.1, scaleY: 1.1, rotateZ: -3 }, .1], ["reverse", .125], ["reverse", .125], ["reverse", .125], ["reverse", .125], ["reverse", .125], [{ scaleX: 1, scaleY: 1, rotateZ: 0 }, .2]] }, "transition.fadeIn": { defaultDuration: 500, calls: [[{ opacity: [1, 0] }]] }, "transition.fadeOut": { defaultDuration: 500, calls: [[{ opacity: [0, 1] }]] }, "transition.flipXIn": { defaultDuration: 700, calls: [[{ opacity: [1, 0], transformPerspective: [800, 800], rotateY: [0, -55] }]], reset: { transformPerspective: 0 } }, "transition.flipXOut": { defaultDuration: 700, calls: [[{ opacity: [0, 1], transformPerspective: [800, 800], rotateY: 55 }]], reset: { transformPerspective: 0, rotateY: 0 } }, "transition.flipYIn": { defaultDuration: 800, calls: [[{ opacity: [1, 0], transformPerspective: [800, 800], rotateX: [0, -45] }]], reset: { transformPerspective: 0 } }, "transition.flipYOut": { defaultDuration: 800, calls: [[{ opacity: [0, 1], transformPerspective: [800, 800], rotateX: 25 }]], reset: { transformPerspective: 0, rotateX: 0 } }, "transition.flipBounceXIn": { defaultDuration: 900, calls: [[{ opacity: [.725, 0], transformPerspective: [400, 400], rotateY: [-10, 90] }, .5], [{ opacity: .8, rotateY: 10 }, .25], [{ opacity: 1, rotateY: 0 }, .25]], reset: { transformPerspective: 0 } }, "transition.flipBounceXOut": { defaultDuration: 800, calls: [[{ opacity: [.9, 1], transformPerspective: [400, 400], rotateY: -10 }], [{ opacity: 0, rotateY: 90 }]], reset: { transformPerspective: 0, rotateY: 0 } }, "transition.flipBounceYIn": { defaultDuration: 850, calls: [[{ opacity: [.725, 0], transformPerspective: [400, 400], rotateX: [-10, 90] }, .5], [{ opacity: .8, rotateX: 10 }, .25], [{ opacity: 1, rotateX: 0 }, .25]], reset: { transformPerspective: 0 } }, "transition.flipBounceYOut": { defaultDuration: 800, calls: [[{ opacity: [.9, 1], transformPerspective: [400, 400], rotateX: -15 }], [{ opacity: 0, rotateX: 90 }]], reset: { transformPerspective: 0, rotateX: 0 } }, "transition.swoopIn": { defaultDuration: 850, calls: [[{ opacity: [1, 0], transformOriginX: ["100%", "50%"], transformOriginY: ["100%", "100%"], scaleX: [1, 0], scaleY: [1, 0], translateX: [0, -700], translateZ: 0 }]], reset: { transformOriginX: "50%", transformOriginY: "50%" } }, "transition.swoopOut": { defaultDuration: 850, calls: [[{ opacity: [0, 1], transformOriginX: ["50%", "100%"], transformOriginY: ["100%", "100%"], scaleX: 0, scaleY: 0, translateX: -700, translateZ: 0 }]], reset: { transformOriginX: "50%", transformOriginY: "50%", scaleX: 1, scaleY: 1, translateX: 0 } }, "transition.whirlIn": { defaultDuration: 850, calls: [[{ opacity: [1, 0], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: [1, 0], scaleY: [1, 0], rotateY: [0, 160] }, 1, { easing: "easeInOutSine" }]] }, "transition.whirlOut": { defaultDuration: 750, calls: [[{ opacity: [0, "easeInOutQuint", 1], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: 0, scaleY: 0, rotateY: 160 }, 1, { easing: "swing" }]], reset: { scaleX: 1, scaleY: 1, rotateY: 0 } }, "transition.shrinkIn": { defaultDuration: 750, calls: [[{ opacity: [1, 0], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: [1, 1.5], scaleY: [1, 1.5], translateZ: 0 }]] }, "transition.shrinkOut": { defaultDuration: 600, calls: [[{ opacity: [0, 1], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: 1.3, scaleY: 1.3, translateZ: 0 }]], reset: { scaleX: 1, scaleY: 1 } }, "transition.expandIn": { defaultDuration: 700, calls: [[{ opacity: [1, 0], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: [1, .625], scaleY: [1, .625], translateZ: 0 }]] }, "transition.expandOut": { defaultDuration: 700, calls: [[{ opacity: [0, 1], transformOriginX: ["50%", "50%"], transformOriginY: ["50%", "50%"], scaleX: .5, scaleY: .5, translateZ: 0 }]], reset: { scaleX: 1, scaleY: 1 } }, "transition.bounceIn": { defaultDuration: 800, calls: [[{ opacity: [1, 0], scaleX: [1.05, .3], scaleY: [1.05, .3] }, .35], [{ scaleX: .9, scaleY: .9, translateZ: 0 }, .2], [{ scaleX: 1, scaleY: 1 }, .45]] }, "transition.bounceOut": { defaultDuration: 800, calls: [[{ scaleX: .95, scaleY: .95 }, .35], [{ scaleX: 1.1, scaleY: 1.1, translateZ: 0 }, .35], [{ opacity: [0, 1], scaleX: .3, scaleY: .3 }, .3]], reset: { scaleX: 1, scaleY: 1 } }, "transition.bounceUpIn": { defaultDuration: 800, calls: [[{ opacity: [1, 0], translateY: [-30, 1e3] }, .6, { easing: "easeOutCirc" }], [{ translateY: 10 }, .2], [{ translateY: 0 }, .2]] }, "transition.bounceUpOut": { defaultDuration: 1e3, calls: [[{ translateY: 20 }, .2], [{ opacity: [0, "easeInCirc", 1], translateY: -1e3 }, .8]], reset: { translateY: 0 } }, "transition.bounceDownIn": { defaultDuration: 800, calls: [[{ opacity: [1, 0], translateY: [30, -1e3] }, .6, { easing: "easeOutCirc" }], [{ translateY: -10 }, .2], [{ translateY: 0 }, .2]] }, "transition.bounceDownOut": { defaultDuration: 1e3, calls: [[{ translateY: -20 }, .2], [{ opacity: [0, "easeInCirc", 1], translateY: 1e3 }, .8]], reset: { translateY: 0 } }, "transition.bounceLeftIn": { defaultDuration: 750, calls: [[{ opacity: [1, 0], translateX: [30, -1250] }, .6, { easing: "easeOutCirc" }], [{ translateX: -10 }, .2], [{ translateX: 0 }, .2]] }, "transition.bounceLeftOut": { defaultDuration: 750, calls: [[{ translateX: 30 }, .2], [{ opacity: [0, "easeInCirc", 1], translateX: -1250 }, .8]], reset: { translateX: 0 } }, "transition.bounceRightIn": { defaultDuration: 750, calls: [[{ opacity: [1, 0], translateX: [-30, 1250] }, .6, { easing: "easeOutCirc" }], [{ translateX: 10 }, .2], [{ translateX: 0 }, .2]] }, "transition.bounceRightOut": { defaultDuration: 750, calls: [[{ translateX: -30 }, .2], [{ opacity: [0, "easeInCirc", 1], translateX: 1250 }, .8]], reset: { translateX: 0 } }, "transition.slideUpIn": { defaultDuration: 900, calls: [[{ opacity: [1, 0], translateY: [0, 20], translateZ: 0 }]] }, "transition.slideUpOut": { defaultDuration: 900, calls: [[{ opacity: [0, 1], translateY: -20, translateZ: 0 }]], reset: { translateY: 0 } }, "transition.slideDownIn": { defaultDuration: 900, calls: [[{ opacity: [1, 0], translateY: [0, -20], translateZ: 0 }]] }, "transition.slideDownOut": { defaultDuration: 900, calls: [[{ opacity: [0, 1], translateY: 20, translateZ: 0 }]], reset: { translateY: 0 } }, "transition.slideLeftIn": { defaultDuration: 1e3, calls: [[{ opacity: [1, 0], translateX: [0, -20], translateZ: 0 }]] }, "transition.slideLeftOut": { defaultDuration: 1050, calls: [[{ opacity: [0, 1], translateX: -20, translateZ: 0 }]], reset: { translateX: 0 } }, "transition.slideRightIn": { defaultDuration: 1e3, calls: [[{ opacity: [1, 0], translateX: [0, 20], translateZ: 0 }]] }, "transition.slideRightOut": { defaultDuration: 1050, calls: [[{ opacity: [0, 1], translateX: 20, translateZ: 0 }]], reset: { translateX: 0 } }, "transition.slideUpBigIn": { defaultDuration: 850, calls: [[{ opacity: [1, 0], translateY: [0, 75], translateZ: 0 }]] }, "transition.slideUpBigOut": { defaultDuration: 800, calls: [[{ opacity: [0, 1], translateY: -75, translateZ: 0 }]], reset: { translateY: 0 } }, "transition.slideDownBigIn": { defaultDuration: 850, calls: [[{ opacity: [1, 0], translateY: [0, -75], translateZ: 0 }]] }, "transition.slideDownBigOut": { defaultDuration: 800, calls: [[{ opacity: [0, 1], translateY: 75, translateZ: 0 }]], reset: { translateY: 0 } }, "transition.slideLeftBigIn": { defaultDuration: 800, calls: [[{ opacity: [1, 0], translateX: [0, -75], translateZ: 0 }]] }, "transition.slideLeftBigOut": { defaultDuration: 750, calls: [[{ opacity: [0, 1], translateX: -75, translateZ: 0 }]], reset: { translateX: 0 } }, "transition.slideRightBigIn": { defaultDuration: 800, calls: [[{ opacity: [1, 0], translateX: [0, 75], translateZ: 0 }]] }, "transition.slideRightBigOut": { defaultDuration: 750, calls: [[{ opacity: [0, 1], translateX: 75, translateZ: 0 }]], reset: { translateX: 0 } }, "transition.perspectiveUpIn": { defaultDuration: 800, calls: [[{ opacity: [1, 0], transformPerspective: [800, 800], transformOriginX: [0, 0], transformOriginY: ["100%", "100%"], rotateX: [0, -180] }]], reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" } }, "transition.perspectiveUpOut": { defaultDuration: 850, calls: [[{ opacity: [0, 1], transformPerspective: [800, 800], transformOriginX: [0, 0], transformOriginY: ["100%", "100%"], rotateX: -180 }]], reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0 } }, "transition.perspectiveDownIn": { defaultDuration: 800, calls: [[{ opacity: [1, 0], transformPerspective: [800, 800], transformOriginX: [0, 0], transformOriginY: [0, 0], rotateX: [0, 180] }]], reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" } }, "transition.perspectiveDownOut": { defaultDuration: 850, calls: [[{ opacity: [0, 1], transformPerspective: [800, 800], transformOriginX: [0, 0], transformOriginY: [0, 0], rotateX: 180 }]], reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0 } }, "transition.perspectiveLeftIn": { defaultDuration: 950, calls: [[{ opacity: [1, 0], transformPerspective: [2e3, 2e3], transformOriginX: [0, 0], transformOriginY: [0, 0], rotateY: [0, -180] }]], reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" } }, "transition.perspectiveLeftOut": { defaultDuration: 950, calls: [[{ opacity: [0, 1], transformPerspective: [2e3, 2e3], transformOriginX: [0, 0], transformOriginY: [0, 0], rotateY: -180 }]], reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0 } }, "transition.perspectiveRightIn": { defaultDuration: 950, calls: [[{ opacity: [1, 0], transformPerspective: [2e3, 2e3], transformOriginX: ["100%", "100%"], transformOriginY: [0, 0], rotateY: [0, 180] }]], reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" } }, "transition.perspectiveRightOut": { defaultDuration: 950, calls: [[{ opacity: [0, 1], transformPerspective: [2e3, 2e3], transformOriginX: ["100%", "100%"], transformOriginY: [0, 0], rotateY: 180 }]], reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0 } } };for (var j in e.RegisterEffect.packagedEffects) {
      e.RegisterEffect.packagedEffects.hasOwnProperty(j) && e.RegisterEffect(j, e.RegisterEffect.packagedEffects[j]);
    }e.RunSequence = function (a) {
      var b = f.extend(!0, [], a);b.length > 1 && (f.each(b.reverse(), function (a, c) {
        var d = b[a + 1];if (d) {
          var g = c.o || c.options,
              h = d.o || d.options,
              i = g && !1 === g.sequenceQueue ? "begin" : "complete",
              j = h && h[i],
              k = {};k[i] = function () {
            var a = d.e || d.elements,
                b = a.nodeType ? [a] : a;j && j.call(b, b), e(c);
          }, d.o ? d.o = f.extend({}, h, k) : d.options = f.extend({}, h, k);
        }
      }), b.reverse()), e(b[0]);
    };
  }(window.jQuery || window.Zepto || window, window, window ? window.document : undefined);
});

},{}],205:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = animateMenuItem;

var _utils = require('../utils');

function animateMenuItem() {
  var menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(function (el) {
    return addPipes(el);
  });
  menuItems.forEach(function (el) {
    return el.addEventListener('mouseover', animatePipe);
  });
  menuItems.forEach(function (el) {
    return el.addEventListener('mouseout', unAnimatePipe);
  });

  function addPipes(el) {
    var pipe1 = (0, _utils.elClass)('div', 'end-pipe');
    var str = el;

    pipe1.innerHTML = '[';
    // str.innerHTML = `${str.innerHTML.toUpperCase()}`;
    str.appendChild(pipe1);
  }

  function animatePipe(e) {
    var spaceWidth = 5;
    var w = e.target.offsetWidth;
    var pipe = this.querySelector('div');
    pipe.style.cssText = '\n      opacity: 1;\n      pointer-events: none;\n      transform: translate(' + (-w - spaceWidth) + 'px);\n    ';
    e.stopPropagation();
  }

  function unAnimatePipe(e) {
    var w = e.target.offsetWidth;
    var pipe = this.querySelector('div');
    pipe.style.cssText = '\n      opacity: 0;\n      pointer-events: none;\n      transform: translate(0px);\n    ';
    e.stopPropagation();
  }
}

},{"../utils":213}],206:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dimUI;
function dimUI() {
  var sPosition = 0;
  var ticking = false;

  window.addEventListener('scroll', function (e) {
    sPosition = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        var ui = document.querySelector('.social-media-nav');
        (function dimmer() {
          ui.classList.add('dim-ui');
        })();
        window.setTimeout(function () {
          return ui.classList.remove('dim-ui');
        }, 1000);
        ticking = false;
      });
    }
    ticking = true;
  });
}

},{}],207:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;

var _animateMenuItem = require('./animateMenuItem');

var _animateMenuItem2 = _interopRequireDefault(_animateMenuItem);

var _dimUI = require('./dimUI');

var _dimUI2 = _interopRequireDefault(_dimUI);

var _introAnimation = require('./introAnimation');

var _introAnimation2 = _interopRequireDefault(_introAnimation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loader() {
  (0, _animateMenuItem2.default)();
  (0, _introAnimation2.default)();
  (0, _dimUI2.default)();
}

},{"./animateMenuItem":205,"./dimUI":206,"./introAnimation":208}],208:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = introAnimation;
function introAnimation() {
  window.setTimeout(startIntro, 400);
  window.setTimeout(clearIntroAnim, 4000);

  function startIntro() {
    moveText();
    showUi();
  }

  function moveText() {
    var introName = document.querySelector('.intro-name');
    var introBlock = document.querySelector('.intro-block');
    introName.classList.add('intro-anim-move-name');
    introBlock.classList.add('intro-anim-move-block');
  }

  function showUi() {
    var headerLogo = document.querySelector('.logo');
    var ui = document.querySelectorAll('.intro-init-ui');
    headerLogo.removeAttribute('style');
    headerLogo.classList.add('header-logo');
    ui.forEach(function (el) {
      return el.classList.add('intro-anim-show-ui');
    });
  }

  function clearIntroAnim() {
    var initUI = document.querySelectorAll('.intro-init-ui');
    var animUI = document.querySelectorAll('.intro-anim-show-ui');

    initUI.forEach(function (el) {
      return el.classList.remove('intro-init-ui');
    });
    initUI.forEach(function (el) {
      return el.classList.remove('intro-anim-show-ui');
    });
  }
}

},{}],209:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rightChevron = exports.leftChevron = exports.downChevron = exports.upChevron = undefined;

var _utils = require('../../utils');

function upChevron() {
  var frag = document.createDocumentFragment();
  frag.innerHTML = '\n    <svg xmlns="http://www.w3.org/2000/svg" class="svg-upchevron" width="80" viewbox="0 0 30 12">\n      <path stroke-width="1" fill="none" d="M2 10 L 15 2 L 28 10"/>\n    </svg>\n  ';
  return frag;
} // css class="svg-'x'chevron"


function downChevron() {
  var button = (0, _utils.makeBtn)('scrolldown', 'scrolldown');
  button.innerHTML = '\n    <svg xmlns="http://www.w3.org/2000/svg" class="svg-downchevron" width="80" viewbox="0 0 30 18">\n      <text x="5" y="4" font-size="4" font-family="sans-serif">scroll down</text>\n      <path class="animate-downchevron" stroke-width="1" fill="none" d="M2 7 L 15 15 L 28 7"/>\n    </svg>\n  ';
  return button;
}

function leftChevron() {
  return '\n  <svg xmlns="http://www.w3.org/2000/svg" class="svg-leftchevron" height="80" viewbox="0 0 12 30">\n    <path stroke-width="1" fill="none" d="M10 2 L 2 15 L 10 28"/>\n  </svg>\n ';
}

function rightChevron() {
  return '\n    <svg xmlns="http://www.w3.org/2000/svg" class="svg-rightchevron" height="80" viewbox="0 0 12 30">\n      <path stroke-width="1" fill="none" d="M2 2 L 10 15 L 2 28"/>\n    </svg>\n  ';
}

exports.upChevron = upChevron;
exports.downChevron = downChevron;
exports.leftChevron = leftChevron;
exports.rightChevron = rightChevron;

},{"../../utils":213}],210:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = viewIcon;
function viewIcon() {
  var span = document.createElement('span'); // eslint-disable-line no-shadow
  span.innerHTML = '\n    <svg xmlns=\'http://www.w3.org/2000/svg\' class=\'svg-view-icon\' width=\'20\' viewbox=\'0 0 210 140\'>\n       <path d="M5 70 A 110 100 0 0 1 200 70 A 110 100 0 0 1 5 70" stroke="none" fill="lightgrey" stroke-width="1"/>\n      <circle cx="105" cy="70" r="35" stroke="white" fill="lightgrey" stroke-width="5">\n    </svg>\n  ';
  span.style.cssText = '\n    display: inline-block;\n    vertical-align: middle;\n    margin-top: .25em;\n    margin-right: .25em;\n  ';
  return span;
}

},{}],211:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleMenu;
/* global Velocity */

var Velocity = require('../../node_modules/velocity-animate/velocity.min.js');
require('../../node_modules/velocity-animate/velocity.ui.min.js');

function toggleMenu() {
  var button = document.getElementById('menu-button');
  var homeLink = document.getElementById('nav-home');
  var text = button.querySelector('text');

  button.classList.contains('off') ? showMenu() : closeMenu(); // eslint-disable-line

  function showMenu() {
    button.classList.remove('off');
    button.classList.add('on');
    stagger.show();
    text.innerHTML = 'close';
    homeLink.focus();
    animateMenu.open();
  }

  function closeMenu() {
    button.classList.remove('on');
    button.classList.add('off');
    stagger.hide();
    text.innerHTML = 'menu';
    animateMenu.close();
  }
}

var stagger = function stagger() {
  var mainNav = document.querySelector('.main-nav');
  var menuItems = mainNav.querySelectorAll('li');
  var delay = 80;

  function staggerShow() {
    var i = 0;
    mainNav.style.cssText = 'display: block';
    window.setTimeout(function run() {
      if (i < menuItems.length) {
        menuItems[i].classList.add('show-menu-item');
        setTimeout(run, delay);
      }
      i += 1;
    }, delay);
    clearTimeout();
  }

  function staggerHide() {
    var i = 0;
    window.setTimeout(function run() {
      if (i < menuItems.length) {
        menuItems[i].classList.remove('show-menu-item');
        setTimeout(run, delay);
      }
      i += 1;
    }, delay);
    window.setTimeout(function () {
      mainNav.style.cssText = 'display: none';
    }, delay * menuItems.length);
    clearTimeout();
  }

  return {
    show: staggerShow,
    hide: staggerHide
  };
}();

var animateMenu = function animateMenu() {
  var svg = document.getElementsByClassName('menu-line');
  var b1 = svg[0];
  var b2 = svg[1];
  var b3 = svg[2];

  function animateOpenBtn() {
    var topSeq = [{ e: b1, p: { translateY: 6 }, o: { duration: '0ms' } }, { e: b1, p: { translateX: -2 }, o: { duration: '0ms' } }, { e: b1, p: { rotateZ: 45 }, o: { duration: '100ms' } }];
    var bottomSeq = [{ e: b3, p: { translateX: -8 }, o: { duration: '0ms' } }, { e: b3, p: { translateY: -2 }, o: { duration: '0ms' } }, { e: b3, p: { rotateZ: -45 }, o: { duration: '100ms' } }];

    b1.setAttribute('transform-origin', 'center center 0');
    b3.setAttribute('transform-origin', 'center center 0');
    Velocity.RunSequence(topSeq);
    Velocity(b2, { opacity: 0 }, 100);
    Velocity.RunSequence(bottomSeq);
  }

  function animateCloseBtn() {
    var topLine = [{ e: b1, p: { rotateZ: 0 }, o: { duration: '100ms' } }, { e: b1, p: { translateY: 0 }, o: { duration: '0ms' } }, { e: b1, p: { translateX: 0 }, o: { duration: '100ms' } }];
    var bottomLine = [{ e: b3, p: { rotateZ: 0 }, o: { duration: '100ms' } }, { e: b3, p: { translateX: 0 }, o: { duration: '0ms' } }, { e: b3, p: { translateY: 0 }, o: { duration: '100ms' } }];

    Velocity.RunSequence(topLine);
    Velocity(b2, 'reverse', 100);
    Velocity.RunSequence(bottomLine);
  }

  return {
    open: animateOpenBtn,
    close: animateCloseBtn
  };
}();

},{"../../node_modules/velocity-animate/velocity.min.js":203,"../../node_modules/velocity-animate/velocity.ui.min.js":204}],212:[function(require,module,exports){
'use strict';

require('core-js/modules/es6.typed.array-buffer');

require('core-js/modules/es6.typed.int8-array');

require('core-js/modules/es6.typed.uint8-array');

require('core-js/modules/es6.typed.uint8-clamped-array');

require('core-js/modules/es6.typed.int16-array');

require('core-js/modules/es6.typed.uint16-array');

require('core-js/modules/es6.typed.int32-array');

require('core-js/modules/es6.typed.uint32-array');

require('core-js/modules/es6.typed.float32-array');

require('core-js/modules/es6.typed.float64-array');

require('core-js/modules/es6.map');

require('core-js/modules/es6.set');

require('core-js/modules/es6.weak-map');

require('core-js/modules/es6.weak-set');

require('core-js/modules/es6.reflect.apply');

require('core-js/modules/es6.reflect.construct');

require('core-js/modules/es6.reflect.define-property');

require('core-js/modules/es6.reflect.delete-property');

require('core-js/modules/es6.reflect.get');

require('core-js/modules/es6.reflect.get-own-property-descriptor');

require('core-js/modules/es6.reflect.get-prototype-of');

require('core-js/modules/es6.reflect.has');

require('core-js/modules/es6.reflect.is-extensible');

require('core-js/modules/es6.reflect.own-keys');

require('core-js/modules/es6.reflect.prevent-extensions');

require('core-js/modules/es6.reflect.set');

require('core-js/modules/es6.reflect.set-prototype-of');

require('core-js/modules/es6.promise');

require('core-js/modules/es6.symbol');

require('core-js/modules/es6.object.freeze');

require('core-js/modules/es6.object.seal');

require('core-js/modules/es6.object.prevent-extensions');

require('core-js/modules/es6.object.is-frozen');

require('core-js/modules/es6.object.is-sealed');

require('core-js/modules/es6.object.is-extensible');

require('core-js/modules/es6.object.get-own-property-descriptor');

require('core-js/modules/es6.object.get-prototype-of');

require('core-js/modules/es6.object.keys');

require('core-js/modules/es6.object.get-own-property-names');

require('core-js/modules/es6.object.assign');

require('core-js/modules/es6.object.is');

require('core-js/modules/es6.object.set-prototype-of');

require('core-js/modules/es6.function.name');

require('core-js/modules/es6.string.raw');

require('core-js/modules/es6.string.from-code-point');

require('core-js/modules/es6.string.code-point-at');

require('core-js/modules/es6.string.repeat');

require('core-js/modules/es6.string.starts-with');

require('core-js/modules/es6.string.ends-with');

require('core-js/modules/es6.string.includes');

require('core-js/modules/es6.regexp.flags');

require('core-js/modules/es6.regexp.match');

require('core-js/modules/es6.regexp.replace');

require('core-js/modules/es6.regexp.split');

require('core-js/modules/es6.regexp.search');

require('core-js/modules/es6.array.from');

require('core-js/modules/es6.array.of');

require('core-js/modules/es6.array.copy-within');

require('core-js/modules/es6.array.find');

require('core-js/modules/es6.array.find-index');

require('core-js/modules/es6.array.fill');

require('core-js/modules/es6.array.iterator');

require('core-js/modules/es6.number.is-finite');

require('core-js/modules/es6.number.is-integer');

require('core-js/modules/es6.number.is-safe-integer');

require('core-js/modules/es6.number.is-nan');

require('core-js/modules/es6.number.epsilon');

require('core-js/modules/es6.number.min-safe-integer');

require('core-js/modules/es6.number.max-safe-integer');

require('core-js/modules/es6.math.acosh');

require('core-js/modules/es6.math.asinh');

require('core-js/modules/es6.math.atanh');

require('core-js/modules/es6.math.cbrt');

require('core-js/modules/es6.math.clz32');

require('core-js/modules/es6.math.cosh');

require('core-js/modules/es6.math.expm1');

require('core-js/modules/es6.math.fround');

require('core-js/modules/es6.math.hypot');

require('core-js/modules/es6.math.imul');

require('core-js/modules/es6.math.log1p');

require('core-js/modules/es6.math.log10');

require('core-js/modules/es6.math.log2');

require('core-js/modules/es6.math.sign');

require('core-js/modules/es6.math.sinh');

require('core-js/modules/es6.math.tanh');

require('core-js/modules/es6.math.trunc');

require('core-js/modules/es7.array.includes');

require('core-js/modules/es7.object.values');

require('core-js/modules/es7.object.entries');

require('core-js/modules/es7.object.get-own-property-descriptors');

require('core-js/modules/es7.string.pad-start');

require('core-js/modules/es7.string.pad-end');

require('core-js/modules/web.timers');

require('core-js/modules/web.immediate');

require('core-js/modules/web.dom.iterable');

require('regenerator-runtime/runtime');

var _toggleMenu = require('./components/toggleMenu');

var _toggleMenu2 = _interopRequireDefault(_toggleMenu);

var _scrollChevron = require('./components/svg/scrollChevron');

var _importLoader = require('./components/importLoader');

var _importLoader2 = _interopRequireDefault(_importLoader);

var _viewIcon = require('./components/svg/viewIcon');

var _viewIcon2 = _interopRequireDefault(_viewIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global history */
/* eslint import/first: 0 no-undef: 0 */
/* eslint no-restricted-globals: ["error", "event"] */

document.addEventListener('DOMContentLoaded', function (event) {
  var menuButton = document.getElementById('menu-button');
  var homeSection = document.querySelector('.section-home');
  var homeBtn = document.getElementById('nav-home');
  var resumeBtn = document.querySelector('.resume-btn');
  var emailBtn = document.querySelector('.email-btn');
  var scrollChevron = (0, _scrollChevron.downChevron)();
  var iconSvg = (0, _viewIcon2.default)();

  resumeBtn.insertBefore(iconSvg, resumeBtn.childNodes[0]);

  window.setTimeout(start, 450);
  window.scrollTo(0, 0);

  // emailBtn.onclick = emailModal;
  menuButton.onclick = _toggleMenu2.default;
  document.querySelector('#cr-year').innerHTML = '- ' + new Date().getFullYear();
  (0, _importLoader2.default)();
  document.body.style.cssText = 'display: block';
  menuButton.focus();
  homeSection.appendChild(scrollChevron);
  scrollChevron.classList.add('intro-init-ui');

  homeBtn.onclick = function (e) {
    e.preventDefault();
    window.scrollTo(0, 0);
    removeHashUrl();
    return false;
  };
  return event;
});

// Shims & Polyfills msEdge
(function () {
  if (typeof NodeList.prototype.forEach === 'function') return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
  return true;
})(); // forEach

function start() {
  var backdrop = document.getElementById('backdrop');
  backdrop.remove();
}

function removeHashUrl() {
  var loc = window.location;
  var scrollV = void 0;
  var scrollH = void 0;

  if ('replaceState' in history) {
    history.replaceState('', document.title, loc.pathname + loc.search);
  } else {
    // Prevent scrolling by storing the page's current scroll offset
    scrollV = document.body.scrollTop;
    scrollH = document.body.scrollLeft;

    loc.hash = '';

    // Restore the scroll offset, should be flicker free
    document.body.scrollTop = scrollV;
    document.body.scrollLeft = scrollH;
  }
}

},{"./components/importLoader":207,"./components/svg/scrollChevron":209,"./components/svg/viewIcon":210,"./components/toggleMenu":211,"core-js/modules/es6.array.copy-within":107,"core-js/modules/es6.array.fill":108,"core-js/modules/es6.array.find":110,"core-js/modules/es6.array.find-index":109,"core-js/modules/es6.array.from":111,"core-js/modules/es6.array.iterator":112,"core-js/modules/es6.array.of":113,"core-js/modules/es6.function.name":114,"core-js/modules/es6.map":115,"core-js/modules/es6.math.acosh":116,"core-js/modules/es6.math.asinh":117,"core-js/modules/es6.math.atanh":118,"core-js/modules/es6.math.cbrt":119,"core-js/modules/es6.math.clz32":120,"core-js/modules/es6.math.cosh":121,"core-js/modules/es6.math.expm1":122,"core-js/modules/es6.math.fround":123,"core-js/modules/es6.math.hypot":124,"core-js/modules/es6.math.imul":125,"core-js/modules/es6.math.log10":126,"core-js/modules/es6.math.log1p":127,"core-js/modules/es6.math.log2":128,"core-js/modules/es6.math.sign":129,"core-js/modules/es6.math.sinh":130,"core-js/modules/es6.math.tanh":131,"core-js/modules/es6.math.trunc":132,"core-js/modules/es6.number.epsilon":133,"core-js/modules/es6.number.is-finite":134,"core-js/modules/es6.number.is-integer":135,"core-js/modules/es6.number.is-nan":136,"core-js/modules/es6.number.is-safe-integer":137,"core-js/modules/es6.number.max-safe-integer":138,"core-js/modules/es6.number.min-safe-integer":139,"core-js/modules/es6.object.assign":140,"core-js/modules/es6.object.freeze":141,"core-js/modules/es6.object.get-own-property-descriptor":142,"core-js/modules/es6.object.get-own-property-names":143,"core-js/modules/es6.object.get-prototype-of":144,"core-js/modules/es6.object.is":148,"core-js/modules/es6.object.is-extensible":145,"core-js/modules/es6.object.is-frozen":146,"core-js/modules/es6.object.is-sealed":147,"core-js/modules/es6.object.keys":149,"core-js/modules/es6.object.prevent-extensions":150,"core-js/modules/es6.object.seal":151,"core-js/modules/es6.object.set-prototype-of":152,"core-js/modules/es6.promise":153,"core-js/modules/es6.reflect.apply":154,"core-js/modules/es6.reflect.construct":155,"core-js/modules/es6.reflect.define-property":156,"core-js/modules/es6.reflect.delete-property":157,"core-js/modules/es6.reflect.get":160,"core-js/modules/es6.reflect.get-own-property-descriptor":158,"core-js/modules/es6.reflect.get-prototype-of":159,"core-js/modules/es6.reflect.has":161,"core-js/modules/es6.reflect.is-extensible":162,"core-js/modules/es6.reflect.own-keys":163,"core-js/modules/es6.reflect.prevent-extensions":164,"core-js/modules/es6.reflect.set":166,"core-js/modules/es6.reflect.set-prototype-of":165,"core-js/modules/es6.regexp.flags":167,"core-js/modules/es6.regexp.match":168,"core-js/modules/es6.regexp.replace":169,"core-js/modules/es6.regexp.search":170,"core-js/modules/es6.regexp.split":171,"core-js/modules/es6.set":172,"core-js/modules/es6.string.code-point-at":173,"core-js/modules/es6.string.ends-with":174,"core-js/modules/es6.string.from-code-point":175,"core-js/modules/es6.string.includes":176,"core-js/modules/es6.string.raw":177,"core-js/modules/es6.string.repeat":178,"core-js/modules/es6.string.starts-with":179,"core-js/modules/es6.symbol":180,"core-js/modules/es6.typed.array-buffer":181,"core-js/modules/es6.typed.float32-array":182,"core-js/modules/es6.typed.float64-array":183,"core-js/modules/es6.typed.int16-array":184,"core-js/modules/es6.typed.int32-array":185,"core-js/modules/es6.typed.int8-array":186,"core-js/modules/es6.typed.uint16-array":187,"core-js/modules/es6.typed.uint32-array":188,"core-js/modules/es6.typed.uint8-array":189,"core-js/modules/es6.typed.uint8-clamped-array":190,"core-js/modules/es6.weak-map":191,"core-js/modules/es6.weak-set":192,"core-js/modules/es7.array.includes":193,"core-js/modules/es7.object.entries":194,"core-js/modules/es7.object.get-own-property-descriptors":195,"core-js/modules/es7.object.values":196,"core-js/modules/es7.string.pad-end":197,"core-js/modules/es7.string.pad-start":198,"core-js/modules/web.dom.iterable":199,"core-js/modules/web.immediate":200,"core-js/modules/web.timers":201,"regenerator-runtime/runtime":202}],213:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function elClass() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
  var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var el = document.createElement(element);
  if (classes !== 0) {
    if (/\s/.test(classes)) {
      var _el$classList;

      var arr = classes.split(' ');
      (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(arr));
    } else {
      el.classList.add(classes);
    }
  }
  return el;
}

function makeBtn(name) {
  var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var arr = classes.split(' ');
  var button = elClass('button', classes);
  button.setAttribute('name', name);
  button.setAttribute('type', 'button');
  button.innerHTML = name;
  return button;
}

exports.elClass = elClass;
exports.makeBtn = makeBtn;

},{}]},{},[212])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi13ZWFrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2xpYnJhcnkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19tYXRoLWV4cG0xLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWF0aC1mcm91bmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19tYXRoLWxvZzFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWF0aC1zaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21pY3JvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX25ldy1wcm9taXNlLWNhcGFiaWxpdHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qtc2FwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LXRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wZXJmb3JtLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcHJvbWlzZS1yZXNvbHZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2FtZS12YWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC1wcm90by5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC1zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1jb250ZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLXBhZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190YXNrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tYWJzb2x1dGUtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdHlwZWQtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC1idWZmZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VzZXItYWdlbnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL192YWxpZGF0ZS1jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy1leHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmNvcHktd2l0aGluLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbmQtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkub2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5uYW1lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5hY29zaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguYXNpbmguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmF0YW5oLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5jYnJ0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5jbHozMi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY29zaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguZXhwbTEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmZyb3VuZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguaHlwb3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmltdWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmxvZzEwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5sb2cxcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgubG9nMi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguc2luaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgudGFuaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgudHJ1bmMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuZXBzaWxvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5pcy1maW5pdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5pcy1uYW4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtc2FmZS1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLm1heC1zYWZlLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIubWluLXNhZmUtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuZnJlZXplLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LW5hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmdldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuaXMtZXh0ZW5zaWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5pcy1mcm96ZW4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuaXMtc2VhbGVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QucHJldmVudC1leHRlbnNpb25zLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnNlYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmFwcGx5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5jb25zdHJ1Y3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZGVsZXRlLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmdldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmdldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuaGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5pcy1leHRlbnNpYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5vd24ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QucHJldmVudC1leHRlbnNpb25zLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuZmxhZ3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAubWF0Y2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAucmVwbGFjZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5zZWFyY2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuc3BsaXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuY29kZS1wb2ludC1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5lbmRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnJhdy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC5hcnJheS1idWZmZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC5mbG9hdDMyLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuZmxvYXQ2NC1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLmludDE2LWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuaW50MzItYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC5pbnQ4LWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQudWludDE2LWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQudWludDMyLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQudWludDgtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC51aW50OC1jbGFtcGVkLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYud2Vhay1tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi53ZWFrLXNldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LmVudHJpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC52YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcucGFkLWVuZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnN0cmluZy5wYWQtc3RhcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5pbW1lZGlhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi50aW1lcnMuanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL3ZlbG9jaXR5LWFuaW1hdGUvdmVsb2NpdHkubWluLmpzIiwibm9kZV9tb2R1bGVzL3ZlbG9jaXR5LWFuaW1hdGUvdmVsb2NpdHkudWkubWluLmpzIiwic3JjL2NvbXBvbmVudHMvYW5pbWF0ZU1lbnVJdGVtLmpzIiwic3JjL2NvbXBvbmVudHMvZGltVUkuanMiLCJzcmMvY29tcG9uZW50cy9pbXBvcnRMb2FkZXIuanMiLCJzcmMvY29tcG9uZW50cy9pbnRyb0FuaW1hdGlvbi5qcyIsInNyYy9jb21wb25lbnRzL3N2Zy9zY3JvbGxDaGV2cm9uLmpzIiwic3JjL2NvbXBvbmVudHMvc3ZnL3ZpZXdJY29uLmpzIiwic3JjL2NvbXBvbmVudHMvdG9nZ2xlTWVudS5qcyIsInNyYy9zY3JpcHQuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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ZjtBQUNBLFNBQU8sWUFBUCxDQUFvQixNQUFwQixFQUE0QixJQUE1QjtBQUNBLFNBQU8sWUFBUCxDQUFvQixNQUFwQixFQUE0QixRQUE1QjtBQUNBLFNBQU8sU0FBUCxHQUFtQixJQUFuQjtBQUNBLFNBQU8sTUFBUDtBQUNEOztRQUVRLE8sR0FBQSxPO1FBQVMsTyxHQUFBLE8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gMjIuMS4zLjMxIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxudmFyIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3Vuc2NvcGFibGVzJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcbmlmIChBcnJheVByb3RvW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpIHJlcXVpcmUoJy4vX2hpZGUnKShBcnJheVByb3RvLCBVTlNDT1BBQkxFUywge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpIHtcbiAgaWYgKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gMjIuMS4zLjMgQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kID0gdGhpcy5sZW5ndGgpXG4ndXNlIHN0cmljdCc7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gW10uY29weVdpdGhpbiB8fCBmdW5jdGlvbiBjb3B5V2l0aGluKHRhcmdldCAvKiA9IDAgKi8sIHN0YXJ0IC8qID0gMCwgZW5kID0gQGxlbmd0aCAqLykge1xuICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICB2YXIgbGVuID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICB2YXIgdG8gPSB0b0Fic29sdXRlSW5kZXgodGFyZ2V0LCBsZW4pO1xuICB2YXIgZnJvbSA9IHRvQWJzb2x1dGVJbmRleChzdGFydCwgbGVuKTtcbiAgdmFyIGVuZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICB2YXIgY291bnQgPSBNYXRoLm1pbigoZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB0b0Fic29sdXRlSW5kZXgoZW5kLCBsZW4pKSAtIGZyb20sIGxlbiAtIHRvKTtcbiAgdmFyIGluYyA9IDE7XG4gIGlmIChmcm9tIDwgdG8gJiYgdG8gPCBmcm9tICsgY291bnQpIHtcbiAgICBpbmMgPSAtMTtcbiAgICBmcm9tICs9IGNvdW50IC0gMTtcbiAgICB0byArPSBjb3VudCAtIDE7XG4gIH1cbiAgd2hpbGUgKGNvdW50LS0gPiAwKSB7XG4gICAgaWYgKGZyb20gaW4gTykgT1t0b10gPSBPW2Zyb21dO1xuICAgIGVsc2UgZGVsZXRlIE9bdG9dO1xuICAgIHRvICs9IGluYztcbiAgICBmcm9tICs9IGluYztcbiAgfSByZXR1cm4gTztcbn07XG4iLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbid1c2Ugc3RyaWN0JztcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmlsbCh2YWx1ZSAvKiAsIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLykge1xuICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgbGVuZ3RoKTtcbiAgdmFyIGVuZCA9IGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICB2YXIgZW5kUG9zID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0Fic29sdXRlSW5kZXgoZW5kLCBsZW5ndGgpO1xuICB3aGlsZSAoZW5kUG9zID4gaW5kZXgpIE9baW5kZXgrK10gPSB2YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgYXNjID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRZUEUsICRjcmVhdGUpIHtcbiAgdmFyIElTX01BUCA9IFRZUEUgPT0gMTtcbiAgdmFyIElTX0ZJTFRFUiA9IFRZUEUgPT0gMjtcbiAgdmFyIElTX1NPTUUgPSBUWVBFID09IDM7XG4gIHZhciBJU19FVkVSWSA9IFRZUEUgPT0gNDtcbiAgdmFyIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDY7XG4gIHZhciBOT19IT0xFUyA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYO1xuICB2YXIgY3JlYXRlID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQpIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgc2VsZiA9IElPYmplY3QoTyk7XG4gICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkO1xuICAgIHZhciB2YWwsIHJlcztcbiAgICBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpIHtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmIChUWVBFKSB7XG4gICAgICAgIGlmIChJU19NQVApIHJlc3VsdFtpbmRleF0gPSByZXM7ICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYgKHJlcykgc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmIChJU19FVkVSWSkgcmV0dXJuIGZhbHNlOyAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL19pcy1hcnJheScpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbCkge1xuICB2YXIgQztcbiAgaWYgKGlzQXJyYXkob3JpZ2luYWwpKSB7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYgKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSkgQyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoaXNPYmplY3QoQykpIHtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYgKEMgPT09IG51bGwpIEMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59O1xuIiwiLy8gOS40LjIuMyBBcnJheVNwZWNpZXNDcmVhdGUob3JpZ2luYWxBcnJheSwgbGVuZ3RoKVxudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwsIGxlbmd0aCkge1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBpbnZva2UgPSByZXF1aXJlKCcuL19pbnZva2UnKTtcbnZhciBhcnJheVNsaWNlID0gW10uc2xpY2U7XG52YXIgZmFjdG9yaWVzID0ge307XG5cbnZhciBjb25zdHJ1Y3QgPSBmdW5jdGlvbiAoRiwgbGVuLCBhcmdzKSB7XG4gIGlmICghKGxlbiBpbiBmYWN0b3JpZXMpKSB7XG4gICAgZm9yICh2YXIgbiA9IFtdLCBpID0gMDsgaSA8IGxlbjsgaSsrKSBuW2ldID0gJ2FbJyArIGkgKyAnXSc7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgZmFjdG9yaWVzW2xlbl0gPSBGdW5jdGlvbignRixhJywgJ3JldHVybiBuZXcgRignICsgbi5qb2luKCcsJykgKyAnKScpO1xuICB9IHJldHVybiBmYWN0b3JpZXNbbGVuXShGLCBhcmdzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24uYmluZCB8fCBmdW5jdGlvbiBiaW5kKHRoYXQgLyogLCAuLi5hcmdzICovKSB7XG4gIHZhciBmbiA9IGFGdW5jdGlvbih0aGlzKTtcbiAgdmFyIHBhcnRBcmdzID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBib3VuZCA9IGZ1bmN0aW9uICgvKiBhcmdzLi4uICovKSB7XG4gICAgdmFyIGFyZ3MgPSBwYXJ0QXJncy5jb25jYXQoYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgYm91bmQgPyBjb25zdHJ1Y3QoZm4sIGFyZ3MubGVuZ3RoLCBhcmdzKSA6IGludm9rZShmbiwgYXJncywgdGhhdCk7XG4gIH07XG4gIGlmIChpc09iamVjdChmbi5wcm90b3R5cGUpKSBib3VuZC5wcm90b3R5cGUgPSBmbi5wcm90b3R5cGU7XG4gIHJldHVybiBib3VuZDtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpO1xudmFyIHN0ZXAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKTtcbnZhciBzZXRTcGVjaWVzID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFzdEtleSA9IHJlcXVpcmUoJy4vX21ldGEnKS5mYXN0S2V5O1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIFNJWkUgPSBERVNDUklQVE9SUyA/ICdfcycgOiAnc2l6ZSc7XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uICh0aGF0LCBrZXkpIHtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KTtcbiAgdmFyIGVudHJ5O1xuICBpZiAoaW5kZXggIT09ICdGJykgcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yIChlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICBpZiAoZW50cnkuayA9PSBrZXkpIHJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll90ID0gTkFNRTsgICAgICAgICAvLyBjb2xsZWN0aW9uIHR5cGVcbiAgICAgIHRoYXQuX2kgPSBjcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgLy8gbGFzdCBlbnRyeVxuICAgICAgdGhhdFtTSVpFXSA9IDA7ICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICBmb3IgKHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSksIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZW50cnkucCkgZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdGhhdCA9IHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm47XG4gICAgICAgICAgdmFyIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmIChuZXh0KSBuZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmICh0aGF0Ll9mID09IGVudHJ5KSB0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZiAodGhhdC5fbCA9PSBlbnRyeSkgdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyogLCB0aGF0ID0gdW5kZWZpbmVkICovKSB7XG4gICAgICAgIHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMyk7XG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgd2hpbGUgKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZikge1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHZhbGlkYXRlKHRoaXMsIE5BTUUpLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChERVNDUklQVE9SUykgZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZSh0aGlzLCBOQU1FKVtTSVpFXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbiAodGhhdCwga2V5LCB2YWx1ZSkge1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgdmFyIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmIChlbnRyeSkge1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYgKCF0aGF0Ll9mKSB0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZiAocHJldikgcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmIChpbmRleCAhPT0gJ0YnKSB0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbiAoQywgTkFNRSwgSVNfTUFQKSB7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICAgICAgdGhpcy5fdCA9IHZhbGlkYXRlKGl0ZXJhdGVkLCBOQU1FKTsgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAgICAgICAgICAgICAgICAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciBraW5kID0gdGhhdC5faztcbiAgICAgIHZhciBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yKSBlbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYgKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpIHtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJywgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBnZXRXZWFrID0gcmVxdWlyZSgnLi9fbWV0YScpLmdldFdlYWs7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgY3JlYXRlQXJyYXlNZXRob2QgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJyk7XG52YXIgJGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIGFycmF5RmluZCA9IGNyZWF0ZUFycmF5TWV0aG9kKDUpO1xudmFyIGFycmF5RmluZEluZGV4ID0gY3JlYXRlQXJyYXlNZXRob2QoNik7XG52YXIgaWQgPSAwO1xuXG4vLyBmYWxsYmFjayBmb3IgdW5jYXVnaHQgZnJvemVuIGtleXNcbnZhciB1bmNhdWdodEZyb3plblN0b3JlID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgcmV0dXJuIHRoYXQuX2wgfHwgKHRoYXQuX2wgPSBuZXcgVW5jYXVnaHRGcm96ZW5TdG9yZSgpKTtcbn07XG52YXIgVW5jYXVnaHRGcm96ZW5TdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5hID0gW107XG59O1xudmFyIGZpbmRVbmNhdWdodEZyb3plbiA9IGZ1bmN0aW9uIChzdG9yZSwga2V5KSB7XG4gIHJldHVybiBhcnJheUZpbmQoc3RvcmUuYSwgZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGl0WzBdID09PSBrZXk7XG4gIH0pO1xufTtcblVuY2F1Z2h0RnJvemVuU3RvcmUucHJvdG90eXBlID0ge1xuICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgZW50cnkgPSBmaW5kVW5jYXVnaHRGcm96ZW4odGhpcywga2V5KTtcbiAgICBpZiAoZW50cnkpIHJldHVybiBlbnRyeVsxXTtcbiAgfSxcbiAgaGFzOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuICEhZmluZFVuY2F1Z2h0RnJvemVuKHRoaXMsIGtleSk7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICB2YXIgZW50cnkgPSBmaW5kVW5jYXVnaHRGcm96ZW4odGhpcywga2V5KTtcbiAgICBpZiAoZW50cnkpIGVudHJ5WzFdID0gdmFsdWU7XG4gICAgZWxzZSB0aGlzLmEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9LFxuICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBpbmRleCA9IGFycmF5RmluZEluZGV4KHRoaXMuYSwgZnVuY3Rpb24gKGl0KSB7XG4gICAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcbiAgICB9KTtcbiAgICBpZiAofmluZGV4KSB0aGlzLmEuc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gISF+aW5kZXg7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24gKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpIHtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24gKHRoYXQsIGl0ZXJhYmxlKSB7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5fdCA9IE5BTUU7ICAgICAgLy8gY29sbGVjdGlvbiB0eXBlXG4gICAgICB0aGF0Ll9pID0gaWQrKzsgICAgICAvLyBjb2xsZWN0aW9uIGlkXG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAvLyBsZWFrIHN0b3JlIGZvciB1bmNhdWdodCBmcm96ZW4gb2JqZWN0c1xuICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4zLjMuMiBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuNC4zLjMgV2Vha1NldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKCFpc09iamVjdChrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBkYXRhID0gZ2V0V2VhayhrZXkpO1xuICAgICAgICBpZiAoZGF0YSA9PT0gdHJ1ZSkgcmV0dXJuIHVuY2F1Z2h0RnJvemVuU3RvcmUodmFsaWRhdGUodGhpcywgTkFNRSkpWydkZWxldGUnXShrZXkpO1xuICAgICAgICByZXR1cm4gZGF0YSAmJiAkaGFzKGRhdGEsIHRoaXMuX2kpICYmIGRlbGV0ZSBkYXRhW3RoaXMuX2ldO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjMuMy40IFdlYWtNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy40LjMuNCBXZWFrU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgaWYgKCFpc09iamVjdChrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBkYXRhID0gZ2V0V2VhayhrZXkpO1xuICAgICAgICBpZiAoZGF0YSA9PT0gdHJ1ZSkgcmV0dXJuIHVuY2F1Z2h0RnJvemVuU3RvcmUodmFsaWRhdGUodGhpcywgTkFNRSkpLmhhcyhrZXkpO1xuICAgICAgICByZXR1cm4gZGF0YSAmJiAkaGFzKGRhdGEsIHRoaXMuX2kpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uICh0aGF0LCBrZXksIHZhbHVlKSB7XG4gICAgdmFyIGRhdGEgPSBnZXRXZWFrKGFuT2JqZWN0KGtleSksIHRydWUpO1xuICAgIGlmIChkYXRhID09PSB0cnVlKSB1bmNhdWdodEZyb3plblN0b3JlKHRoYXQpLnNldChrZXksIHZhbHVlKTtcbiAgICBlbHNlIGRhdGFbdGhhdC5faV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhhdDtcbiAgfSxcbiAgdWZzdG9yZTogdW5jYXVnaHRGcm96ZW5TdG9yZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgbWV0YSA9IHJlcXVpcmUoJy4vX21ldGEnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyICRpdGVyRGV0ZWN0ID0gcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgaW5oZXJpdElmUmVxdWlyZWQgPSByZXF1aXJlKCcuL19pbmhlcml0LWlmLXJlcXVpcmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKSB7XG4gIHZhciBCYXNlID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgQyA9IEJhc2U7XG4gIHZhciBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCc7XG4gIHZhciBwcm90byA9IEMgJiYgQy5wcm90b3R5cGU7XG4gIHZhciBPID0ge307XG4gIHZhciBmaXhNZXRob2QgPSBmdW5jdGlvbiAoS0VZKSB7XG4gICAgdmFyIGZuID0gcHJvdG9bS0VZXTtcbiAgICByZWRlZmluZShwcm90bywgS0VZLFxuICAgICAgS0VZID09ICdkZWxldGUnID8gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gZmFsc2UgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdoYXMnID8gZnVuY3Rpb24gaGFzKGEpIHtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gZmFsc2UgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdnZXQnID8gZnVuY3Rpb24gZ2V0KGEpIHtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gdW5kZWZpbmVkIDogZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpO1xuICAgICAgfSA6IEtFWSA9PSAnYWRkJyA/IGZ1bmN0aW9uIGFkZChhKSB7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTsgcmV0dXJuIHRoaXM7IH1cbiAgICAgICAgOiBmdW5jdGlvbiBzZXQoYSwgYikgeyBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSwgYik7IHJldHVybiB0aGlzOyB9XG4gICAgKTtcbiAgfTtcbiAgaWYgKHR5cGVvZiBDICE9ICdmdW5jdGlvbicgfHwgIShJU19XRUFLIHx8IHByb3RvLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSkge1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gICAgbWV0YS5ORUVEID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQygpO1xuICAgIC8vIGVhcmx5IGltcGxlbWVudGF0aW9ucyBub3Qgc3VwcG9ydHMgY2hhaW5pbmdcbiAgICB2YXIgSEFTTlRfQ0hBSU5JTkcgPSBpbnN0YW5jZVtBRERFUl0oSVNfV0VBSyA/IHt9IDogLTAsIDEpICE9IGluc3RhbmNlO1xuICAgIC8vIFY4IH4gIENocm9taXVtIDQwLSB3ZWFrLWNvbGxlY3Rpb25zIHRocm93cyBvbiBwcmltaXRpdmVzLCBidXQgc2hvdWxkIHJldHVybiBmYWxzZVxuICAgIHZhciBUSFJPV1NfT05fUFJJTUlUSVZFUyA9IGZhaWxzKGZ1bmN0aW9uICgpIHsgaW5zdGFuY2UuaGFzKDEpOyB9KTtcbiAgICAvLyBtb3N0IGVhcmx5IGltcGxlbWVudGF0aW9ucyBkb2Vzbid0IHN1cHBvcnRzIGl0ZXJhYmxlcywgbW9zdCBtb2Rlcm4gLSBub3QgY2xvc2UgaXQgY29ycmVjdGx5XG4gICAgdmFyIEFDQ0VQVF9JVEVSQUJMRVMgPSAkaXRlckRldGVjdChmdW5jdGlvbiAoaXRlcikgeyBuZXcgQyhpdGVyKTsgfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgLy8gZm9yIGVhcmx5IGltcGxlbWVudGF0aW9ucyAtMCBhbmQgKzAgbm90IHRoZSBzYW1lXG4gICAgdmFyIEJVR0dZX1pFUk8gPSAhSVNfV0VBSyAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBWOCB+IENocm9taXVtIDQyLSBmYWlscyBvbmx5IHdpdGggNSsgZWxlbWVudHNcbiAgICAgIHZhciAkaW5zdGFuY2UgPSBuZXcgQygpO1xuICAgICAgdmFyIGluZGV4ID0gNTtcbiAgICAgIHdoaWxlIChpbmRleC0tKSAkaW5zdGFuY2VbQURERVJdKGluZGV4LCBpbmRleCk7XG4gICAgICByZXR1cm4gISRpbnN0YW5jZS5oYXMoLTApO1xuICAgIH0pO1xuICAgIGlmICghQUNDRVBUX0lURVJBQkxFUykge1xuICAgICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24gKHRhcmdldCwgaXRlcmFibGUpIHtcbiAgICAgICAgYW5JbnN0YW5jZSh0YXJnZXQsIEMsIE5BTUUpO1xuICAgICAgICB2YXIgdGhhdCA9IGluaGVyaXRJZlJlcXVpcmVkKG5ldyBCYXNlKCksIHRhcmdldCwgQyk7XG4gICAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICB9KTtcbiAgICAgIEMucHJvdG90eXBlID0gcHJvdG87XG4gICAgICBwcm90by5jb25zdHJ1Y3RvciA9IEM7XG4gICAgfVxuICAgIGlmIChUSFJPV1NfT05fUFJJTUlUSVZFUyB8fCBCVUdHWV9aRVJPKSB7XG4gICAgICBmaXhNZXRob2QoJ2RlbGV0ZScpO1xuICAgICAgZml4TWV0aG9kKCdoYXMnKTtcbiAgICAgIElTX01BUCAmJiBmaXhNZXRob2QoJ2dldCcpO1xuICAgIH1cbiAgICBpZiAoQlVHR1lfWkVSTyB8fCBIQVNOVF9DSEFJTklORykgZml4TWV0aG9kKEFEREVSKTtcbiAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIHNob3VsZCBub3QgY29udGFpbnMgLmNsZWFyIG1ldGhvZFxuICAgIGlmIChJU19XRUFLICYmIHByb3RvLmNsZWFyKSBkZWxldGUgcHJvdG8uY2xlYXI7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAoQyAhPSBCYXNlKSwgTyk7XG5cbiAgaWYgKCFJU19XRUFLKSBjb21tb24uc2V0U3Ryb25nKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59O1xuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNS4zJyB9O1xuaWYgKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpIF9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIGluZGV4LCB2YWx1ZSkge1xuICBpZiAoaW5kZXggaW4gb2JqZWN0KSAkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTtcbiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoLyogLi4uYXJncyAqLykge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7XG4iLCIvLyBhbGwgZW51bWVyYWJsZSBvYmplY3Qga2V5cywgaW5jbHVkZXMgc3ltYm9sc1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciByZXN1bHQgPSBnZXRLZXlzKGl0KTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIGlmIChnZXRTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KTtcbiAgICB2YXIgaXNFbnVtID0gcElFLmY7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKHN5bWJvbHMubGVuZ3RoID4gaSkgaWYgKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKSByZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwidmFyIE1BVENIID0gcmVxdWlyZSgnLi9fd2tzJykoJ21hdGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIHJlID0gLy4vO1xuICB0cnkge1xuICAgICcvLi8nW0tFWV0ocmUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJlW01BVENIXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuICEnLy4vJ1tLRVldKHJlKTtcbiAgICB9IGNhdGNoIChmKSB7IC8qIGVtcHR5ICovIH1cbiAgfSByZXR1cm4gdHJ1ZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG52YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSwgbGVuZ3RoLCBleGVjKSB7XG4gIHZhciBTWU1CT0wgPSB3a3MoS0VZKTtcbiAgdmFyIGZucyA9IGV4ZWMoZGVmaW5lZCwgU1lNQk9MLCAnJ1tLRVldKTtcbiAgdmFyIHN0cmZuID0gZm5zWzBdO1xuICB2YXIgcnhmbiA9IGZuc1sxXTtcbiAgaWYgKGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgTyA9IHt9O1xuICAgIE9bU1lNQk9MXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH07XG4gICAgcmV0dXJuICcnW0tFWV0oTykgIT0gNztcbiAgfSkpIHtcbiAgICByZWRlZmluZShTdHJpbmcucHJvdG90eXBlLCBLRVksIHN0cmZuKTtcbiAgICBoaWRlKFJlZ0V4cC5wcm90b3R5cGUsIFNZTUJPTCwgbGVuZ3RoID09IDJcbiAgICAgIC8vIDIxLjIuNS44IFJlZ0V4cC5wcm90b3R5cGVbQEByZXBsYWNlXShzdHJpbmcsIHJlcGxhY2VWYWx1ZSlcbiAgICAgIC8vIDIxLjIuNS4xMSBSZWdFeHAucHJvdG90eXBlW0BAc3BsaXRdKHN0cmluZywgbGltaXQpXG4gICAgICA/IGZ1bmN0aW9uIChzdHJpbmcsIGFyZykgeyByZXR1cm4gcnhmbi5jYWxsKHN0cmluZywgdGhpcywgYXJnKTsgfVxuICAgICAgLy8gMjEuMi41LjYgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXShzdHJpbmcpXG4gICAgICAvLyAyMS4yLjUuOSBSZWdFeHAucHJvdG90eXBlW0BAc2VhcmNoXShzdHJpbmcpXG4gICAgICA6IGZ1bmN0aW9uIChzdHJpbmcpIHsgcmV0dXJuIHJ4Zm4uY2FsbChzdHJpbmcsIHRoaXMpOyB9XG4gICAgKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdGhhdCA9IGFuT2JqZWN0KHRoaXMpO1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIGlmICh0aGF0Lmdsb2JhbCkgcmVzdWx0ICs9ICdnJztcbiAgaWYgKHRoYXQuaWdub3JlQ2FzZSkgcmVzdWx0ICs9ICdpJztcbiAgaWYgKHRoYXQubXVsdGlsaW5lKSByZXN1bHQgKz0gJ20nO1xuICBpZiAodGhhdC51bmljb2RlKSByZXN1bHQgKz0gJ3UnO1xuICBpZiAodGhhdC5zdGlja3kpIHJlc3VsdCArPSAneSc7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBCUkVBSyA9IHt9O1xudmFyIFJFVFVSTiA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKSB7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKTtcbiAgdmFyIGYgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSk7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYgKGlzQXJyYXlJdGVyKGl0ZXJGbikpIGZvciAobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7KSB7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGhhdCwgdGFyZ2V0LCBDKSB7XG4gIHZhciBTID0gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuICB2YXIgUDtcbiAgaWYgKFMgIT09IEMgJiYgdHlwZW9mIFMgPT0gJ2Z1bmN0aW9uJyAmJiAoUCA9IFMucHJvdG90eXBlKSAhPT0gQy5wcm90b3R5cGUgJiYgaXNPYmplY3QoUCkgJiYgc2V0UHJvdG90eXBlT2YpIHtcbiAgICBzZXRQcm90b3R5cGVPZih0aGF0LCBQKTtcbiAgfSByZXR1cm4gdGhhdDtcbn07XG4iLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCBhcmdzLCB0aGF0KSB7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTtcbiIsIi8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0ludGVnZXIoaXQpIHtcbiAgcmV0dXJuICFpc09iamVjdChpdCkgJiYgaXNGaW5pdGUoaXQpICYmIGZsb29yKGl0KSA9PT0gaXQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyA3LjIuOCBJc1JlZ0V4cChhcmd1bWVudClcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIE1BVENIID0gcmVxdWlyZSgnLi9fd2tzJykoJ21hdGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgaXNSZWdFeHA7XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgKChpc1JlZ0V4cCA9IGl0W01BVENIXSkgIT09IHVuZGVmaW5lZCA/ICEhaXNSZWdFeHAgOiBjb2YoaXQpID09ICdSZWdFeHAnKTtcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAoIUJVR0dZICYmICRuYXRpdmUpIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkb25lLCB2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZSB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwiLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcbnZhciAkZXhwbTEgPSBNYXRoLmV4cG0xO1xubW9kdWxlLmV4cG9ydHMgPSAoISRleHBtMVxuICAvLyBPbGQgRkYgYnVnXG4gIHx8ICRleHBtMSgxMCkgPiAyMjAyNS40NjU3OTQ4MDY3MTkgfHwgJGV4cG0xKDEwKSA8IDIyMDI1LjQ2NTc5NDgwNjcxNjUxNjhcbiAgLy8gVG9yIEJyb3dzZXIgYnVnXG4gIHx8ICRleHBtMSgtMmUtMTcpICE9IC0yZS0xN1xuKSA/IGZ1bmN0aW9uIGV4cG0xKHgpIHtcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogeCA+IC0xZS02ICYmIHggPCAxZS02ID8geCArIHggKiB4IC8gMiA6IE1hdGguZXhwKHgpIC0gMTtcbn0gOiAkZXhwbTE7XG4iLCIvLyAyMC4yLjIuMTYgTWF0aC5mcm91bmQoeClcbnZhciBzaWduID0gcmVxdWlyZSgnLi9fbWF0aC1zaWduJyk7XG52YXIgcG93ID0gTWF0aC5wb3c7XG52YXIgRVBTSUxPTiA9IHBvdygyLCAtNTIpO1xudmFyIEVQU0lMT04zMiA9IHBvdygyLCAtMjMpO1xudmFyIE1BWDMyID0gcG93KDIsIDEyNykgKiAoMiAtIEVQU0lMT04zMik7XG52YXIgTUlOMzIgPSBwb3coMiwgLTEyNik7XG5cbnZhciByb3VuZFRpZXNUb0V2ZW4gPSBmdW5jdGlvbiAobikge1xuICByZXR1cm4gbiArIDEgLyBFUFNJTE9OIC0gMSAvIEVQU0lMT047XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGguZnJvdW5kIHx8IGZ1bmN0aW9uIGZyb3VuZCh4KSB7XG4gIHZhciAkYWJzID0gTWF0aC5hYnMoeCk7XG4gIHZhciAkc2lnbiA9IHNpZ24oeCk7XG4gIHZhciBhLCByZXN1bHQ7XG4gIGlmICgkYWJzIDwgTUlOMzIpIHJldHVybiAkc2lnbiAqIHJvdW5kVGllc1RvRXZlbigkYWJzIC8gTUlOMzIgLyBFUFNJTE9OMzIpICogTUlOMzIgKiBFUFNJTE9OMzI7XG4gIGEgPSAoMSArIEVQU0lMT04zMiAvIEVQU0lMT04pICogJGFicztcbiAgcmVzdWx0ID0gYSAtIChhIC0gJGFicyk7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgaWYgKHJlc3VsdCA+IE1BWDMyIHx8IHJlc3VsdCAhPSByZXN1bHQpIHJldHVybiAkc2lnbiAqIEluZmluaXR5O1xuICByZXR1cm4gJHNpZ24gKiByZXN1bHQ7XG59O1xuIiwiLy8gMjAuMi4yLjIwIE1hdGgubG9nMXAoeClcbm1vZHVsZS5leHBvcnRzID0gTWF0aC5sb2cxcCB8fCBmdW5jdGlvbiBsb2cxcCh4KSB7XG4gIHJldHVybiAoeCA9ICt4KSA+IC0xZS04ICYmIHggPCAxZS04ID8geCAtIHggKiB4IC8gMiA6IE1hdGgubG9nKDEgKyB4KTtcbn07XG4iLCIvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGguc2lnbiB8fCBmdW5jdGlvbiBzaWduKHgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICByZXR1cm4gKHggPSAreCkgPT0gMCB8fCB4ICE9IHggPyB4IDogeCA8IDAgPyAtMSA6IDE7XG59O1xuIiwidmFyIE1FVEEgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgc2V0RGVzYyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaWQgPSAwO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uIChpdCkge1xuICBzZXREZXNjKGl0LCBNRVRBLCB7IHZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSB9KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBXS5pO1xufTtcbnZhciBnZXRXZWFrID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpIHNldE1ldGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xudmFyIG1ldGEgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgS0VZOiBNRVRBLFxuICBORUVEOiBmYWxzZSxcbiAgZmFzdEtleTogZmFzdEtleSxcbiAgZ2V0V2VhazogZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xudmFyIGlzTm9kZSA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmIChpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSkgcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZSAoaGVhZCkge1xuICAgICAgZm4gPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChoZWFkKSBub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmIChpc05vZGUpIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXIsIGV4Y2VwdCBpT1MgU2FmYXJpIC0gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzMzOVxuICB9IGVsc2UgaWYgKE9ic2VydmVyICYmICEoZ2xvYmFsLm5hdmlnYXRvciAmJiBnbG9iYWwubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSB7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWU7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZiAoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpIHtcbiAgICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb21pc2UudGhlbihmbHVzaCk7XG4gICAgfTtcbiAgLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbiAgLy8gLSBzZXRJbW1lZGlhdGVcbiAgLy8gLSBNZXNzYWdlQ2hhbm5lbFxuICAvLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4gIC8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4gIC8vIC0gc2V0VGltZW91dFxuICB9IGVsc2Uge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgdmFyIHRhc2sgPSB7IGZuOiBmbiwgbmV4dDogdW5kZWZpbmVkIH07XG4gICAgaWYgKGxhc3QpIGxhc3QubmV4dCA9IHRhc2s7XG4gICAgaWYgKCFoZWFkKSB7XG4gICAgICBoZWFkID0gdGFzaztcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gbGFzdCA9IHRhc2s7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjUuNC4xLjUgTmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5cbmZ1bmN0aW9uIFByb21pc2VDYXBhYmlsaXR5KEMpIHtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24gKCQkcmVzb2x2ZSwgJCRyZWplY3QpIHtcbiAgICBpZiAocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgPSBhRnVuY3Rpb24ocmVqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIChDKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgJGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBTID0gU3ltYm9sKCk7XG4gIHZhciBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGspIHsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDE7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICB2YXIgaXNFbnVtID0gcElFLmY7XG4gIHdoaWxlIChhTGVuID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBqKSBpZiAoaXNFbnVtLmNhbGwoUywga2V5ID0ga2V5c1tqKytdKSkgVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciBnT1BEID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGdPUEQgOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCkge1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZ09QRChPLCBQKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmIChoYXMoTywgUCkpIHJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07XG4iLCIvLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGdPUE4gPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmY7XG52YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uIChpdCkge1xuICB0cnkge1xuICAgIHJldHVybiBnT1BOKGl0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB3aW5kb3dOYW1lcy5zbGljZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCkge1xuICByZXR1cm4gd2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScgPyBnZXRXaW5kb3dOYW1lcyhpdCkgOiBnT1BOKHRvSU9iamVjdChpdCkpO1xufTtcbiIsIi8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIi8vIG1vc3QgT2JqZWN0IG1ldGhvZHMgYnkgRVM2IHNob3VsZCBhY2NlcHQgcHJpbWl0aXZlc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSwgZXhlYykge1xuICB2YXIgZm4gPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV07XG4gIHZhciBleHAgPSB7fTtcbiAgZXhwW0tFWV0gPSBleGVjKGZuKTtcbiAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbiAoKSB7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59O1xuIiwidmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBpc0VudW0gPSByZXF1aXJlKCcuL19vYmplY3QtcGllJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlzRW50cmllcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoaXQpO1xuICAgIHZhciBrZXlzID0gZ2V0S2V5cyhPKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBpKSBpZiAoaXNFbnVtLmNhbGwoTywga2V5ID0ga2V5c1tpKytdKSkge1xuICAgICAgcmVzdWx0LnB1c2goaXNFbnRyaWVzID8gW2tleSwgT1trZXldXSA6IE9ba2V5XSk7XG4gICAgfSByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcbiIsIi8vIGFsbCBvYmplY3Qga2V5cywgaW5jbHVkZXMgbm9uLWVudW1lcmFibGUgYW5kIHN5bWJvbHNcbnZhciBnT1BOID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIFJlZmxlY3QgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5SZWZsZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBSZWZsZWN0ICYmIFJlZmxlY3Qub3duS2V5cyB8fCBmdW5jdGlvbiBvd25LZXlzKGl0KSB7XG4gIHZhciBrZXlzID0gZ09QTi5mKGFuT2JqZWN0KGl0KSk7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICByZXR1cm4gZ2V0U3ltYm9scyA/IGtleXMuY29uY2F0KGdldFN5bWJvbHMoaXQpKSA6IGtleXM7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiB7IGU6IGZhbHNlLCB2OiBleGVjKCkgfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IGU6IHRydWUsIHY6IGUgfTtcbiAgfVxufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSByZXF1aXJlKCcuL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEMsIHgpIHtcbiAgYW5PYmplY3QoQyk7XG4gIGlmIChpc09iamVjdCh4KSAmJiB4LmNvbnN0cnVjdG9yID09PSBDKSByZXR1cm4geDtcbiAgdmFyIHByb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkuZihDKTtcbiAgdmFyIHJlc29sdmUgPSBwcm9taXNlQ2FwYWJpbGl0eS5yZXNvbHZlO1xuICByZXNvbHZlKHgpO1xuICByZXR1cm4gcHJvbWlzZUNhcGFiaWxpdHkucHJvbWlzZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBzYWZlKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSwgc2FmZSk7XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgJHRvU3RyaW5nID0gRnVuY3Rpb25bVE9fU1RSSU5HXTtcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwiLy8gNy4yLjkgU2FtZVZhbHVlKHgsIHkpXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5pcyB8fCBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XG59O1xuIiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uIChPLCBwcm90bykge1xuICBhbk9iamVjdChPKTtcbiAgaWYgKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpIHRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uICh0ZXN0LCBidWdneSwgc2V0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuL19jdHgnKShGdW5jdGlvbi5jYWxsLCByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmYoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaCAoZSkgeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90bykge1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmIChidWdneSkgTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIEMgPSBnbG9iYWxbS0VZXTtcbiAgaWYgKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pIGRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07XG4iLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIEQpIHtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvcjtcbiAgdmFyIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwiLy8gaGVscGVyIGZvciBTdHJpbmcje3N0YXJ0c1dpdGgsIGVuZHNXaXRoLCBpbmNsdWRlc31cbnZhciBpc1JlZ0V4cCA9IHJlcXVpcmUoJy4vX2lzLXJlZ2V4cCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRoYXQsIHNlYXJjaFN0cmluZywgTkFNRSkge1xuICBpZiAoaXNSZWdFeHAoc2VhcmNoU3RyaW5nKSkgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmcjJyArIE5BTUUgKyBcIiBkb2Vzbid0IGFjY2VwdCByZWdleCFcIik7XG4gIHJldHVybiBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtc3RyaW5nLXBhZC1zdGFydC1lbmRcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHJlcGVhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1yZXBlYXQnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0aGF0LCBtYXhMZW5ndGgsIGZpbGxTdHJpbmcsIGxlZnQpIHtcbiAgdmFyIFMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gIHZhciBzdHJpbmdMZW5ndGggPSBTLmxlbmd0aDtcbiAgdmFyIGZpbGxTdHIgPSBmaWxsU3RyaW5nID09PSB1bmRlZmluZWQgPyAnICcgOiBTdHJpbmcoZmlsbFN0cmluZyk7XG4gIHZhciBpbnRNYXhMZW5ndGggPSB0b0xlbmd0aChtYXhMZW5ndGgpO1xuICBpZiAoaW50TWF4TGVuZ3RoIDw9IHN0cmluZ0xlbmd0aCB8fCBmaWxsU3RyID09ICcnKSByZXR1cm4gUztcbiAgdmFyIGZpbGxMZW4gPSBpbnRNYXhMZW5ndGggLSBzdHJpbmdMZW5ndGg7XG4gIHZhciBzdHJpbmdGaWxsZXIgPSByZXBlYXQuY2FsbChmaWxsU3RyLCBNYXRoLmNlaWwoZmlsbExlbiAvIGZpbGxTdHIubGVuZ3RoKSk7XG4gIGlmIChzdHJpbmdGaWxsZXIubGVuZ3RoID4gZmlsbExlbikgc3RyaW5nRmlsbGVyID0gc3RyaW5nRmlsbGVyLnNsaWNlKDAsIGZpbGxMZW4pO1xuICByZXR1cm4gbGVmdCA/IHN0cmluZ0ZpbGxlciArIFMgOiBTICsgc3RyaW5nRmlsbGVyO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXBlYXQoY291bnQpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyhkZWZpbmVkKHRoaXMpKTtcbiAgdmFyIHJlcyA9ICcnO1xuICB2YXIgbiA9IHRvSW50ZWdlcihjb3VudCk7XG4gIGlmIChuIDwgMCB8fCBuID09IEluZmluaXR5KSB0aHJvdyBSYW5nZUVycm9yKFwiQ291bnQgY2FuJ3QgYmUgbmVnYXRpdmVcIik7XG4gIGZvciAoO24gPiAwOyAobiA+Pj49IDEpICYmIChzdHIgKz0gc3RyKSkgaWYgKG4gJiAxKSByZXMgKz0gc3RyO1xuICByZXR1cm4gcmVzO1xufTtcbiIsInZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBpbnZva2UgPSByZXF1aXJlKCcuL19pbnZva2UnKTtcbnZhciBodG1sID0gcmVxdWlyZSgnLi9faHRtbCcpO1xudmFyIGNlbCA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgc2V0VGFzayA9IGdsb2JhbC5zZXRJbW1lZGlhdGU7XG52YXIgY2xlYXJUYXNrID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xudmFyIE1lc3NhZ2VDaGFubmVsID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsO1xudmFyIERpc3BhdGNoID0gZ2xvYmFsLkRpc3BhdGNoO1xudmFyIGNvdW50ZXIgPSAwO1xudmFyIHF1ZXVlID0ge307XG52YXIgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG52YXIgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaWQgPSArdGhpcztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICBpZiAocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZiAoIXNldFRhc2sgfHwgIWNsZWFyVGFzaykge1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICB2YXIgaSA9IDE7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCkge1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZiAocmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBTcGhlcmUgKEpTIGdhbWUgZW5naW5lKSBEaXNwYXRjaCBBUElcbiAgfSBlbHNlIGlmIChEaXNwYXRjaCAmJiBEaXNwYXRjaC5ub3cpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgRGlzcGF0Y2gubm93KGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYgKE1lc3NhZ2VDaGFubmVsKSB7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIHBvcnQgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdGVuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYgKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuIiwiLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9pbmRleFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09PSB1bmRlZmluZWQpIHJldHVybiAwO1xuICB2YXIgbnVtYmVyID0gdG9JbnRlZ2VyKGl0KTtcbiAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKG51bWJlcik7XG4gIGlmIChudW1iZXIgIT09IGxlbmd0aCkgdGhyb3cgUmFuZ2VFcnJvcignV3JvbmcgbGVuZ3RoIScpO1xuICByZXR1cm4gbGVuZ3RoO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5pZiAocmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSkge1xuICB2YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbiAgdmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xuICB2YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xuICB2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuICB2YXIgJHR5cGVkID0gcmVxdWlyZSgnLi9fdHlwZWQnKTtcbiAgdmFyICRidWZmZXIgPSByZXF1aXJlKCcuL190eXBlZC1idWZmZXInKTtcbiAgdmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xuICB2YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG4gIHZhciBwcm9wZXJ0eURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG4gIHZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xuICB2YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbiAgdmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbiAgdmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG4gIHZhciB0b0luZGV4ID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbiAgdmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG4gIHZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xuICB2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG4gIHZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xuICB2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbiAgdmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG4gIHZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbiAgdmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbiAgdmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xuICB2YXIgZ09QTiA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZjtcbiAgdmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG4gIHZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbiAgdmFyIHdrcyA9IHJlcXVpcmUoJy4vX3drcycpO1xuICB2YXIgY3JlYXRlQXJyYXlNZXRob2QgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJyk7XG4gIHZhciBjcmVhdGVBcnJheUluY2x1ZGVzID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKTtcbiAgdmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbiAgdmFyIEFycmF5SXRlcmF0b3JzID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbiAgdmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xuICB2YXIgJGl0ZXJEZXRlY3QgPSByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpO1xuICB2YXIgc2V0U3BlY2llcyA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJyk7XG4gIHZhciBhcnJheUZpbGwgPSByZXF1aXJlKCcuL19hcnJheS1maWxsJyk7XG4gIHZhciBhcnJheUNvcHlXaXRoaW4gPSByZXF1aXJlKCcuL19hcnJheS1jb3B5LXdpdGhpbicpO1xuICB2YXIgJERQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG4gIHZhciAkR09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJyk7XG4gIHZhciBkUCA9ICREUC5mO1xuICB2YXIgZ09QRCA9ICRHT1BELmY7XG4gIHZhciBSYW5nZUVycm9yID0gZ2xvYmFsLlJhbmdlRXJyb3I7XG4gIHZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xuICB2YXIgVWludDhBcnJheSA9IGdsb2JhbC5VaW50OEFycmF5O1xuICB2YXIgQVJSQVlfQlVGRkVSID0gJ0FycmF5QnVmZmVyJztcbiAgdmFyIFNIQVJFRF9CVUZGRVIgPSAnU2hhcmVkJyArIEFSUkFZX0JVRkZFUjtcbiAgdmFyIEJZVEVTX1BFUl9FTEVNRU5UID0gJ0JZVEVTX1BFUl9FTEVNRU5UJztcbiAgdmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuICB2YXIgQXJyYXlQcm90byA9IEFycmF5W1BST1RPVFlQRV07XG4gIHZhciAkQXJyYXlCdWZmZXIgPSAkYnVmZmVyLkFycmF5QnVmZmVyO1xuICB2YXIgJERhdGFWaWV3ID0gJGJ1ZmZlci5EYXRhVmlldztcbiAgdmFyIGFycmF5Rm9yRWFjaCA9IGNyZWF0ZUFycmF5TWV0aG9kKDApO1xuICB2YXIgYXJyYXlGaWx0ZXIgPSBjcmVhdGVBcnJheU1ldGhvZCgyKTtcbiAgdmFyIGFycmF5U29tZSA9IGNyZWF0ZUFycmF5TWV0aG9kKDMpO1xuICB2YXIgYXJyYXlFdmVyeSA9IGNyZWF0ZUFycmF5TWV0aG9kKDQpO1xuICB2YXIgYXJyYXlGaW5kID0gY3JlYXRlQXJyYXlNZXRob2QoNSk7XG4gIHZhciBhcnJheUZpbmRJbmRleCA9IGNyZWF0ZUFycmF5TWV0aG9kKDYpO1xuICB2YXIgYXJyYXlJbmNsdWRlcyA9IGNyZWF0ZUFycmF5SW5jbHVkZXModHJ1ZSk7XG4gIHZhciBhcnJheUluZGV4T2YgPSBjcmVhdGVBcnJheUluY2x1ZGVzKGZhbHNlKTtcbiAgdmFyIGFycmF5VmFsdWVzID0gQXJyYXlJdGVyYXRvcnMudmFsdWVzO1xuICB2YXIgYXJyYXlLZXlzID0gQXJyYXlJdGVyYXRvcnMua2V5cztcbiAgdmFyIGFycmF5RW50cmllcyA9IEFycmF5SXRlcmF0b3JzLmVudHJpZXM7XG4gIHZhciBhcnJheUxhc3RJbmRleE9mID0gQXJyYXlQcm90by5sYXN0SW5kZXhPZjtcbiAgdmFyIGFycmF5UmVkdWNlID0gQXJyYXlQcm90by5yZWR1Y2U7XG4gIHZhciBhcnJheVJlZHVjZVJpZ2h0ID0gQXJyYXlQcm90by5yZWR1Y2VSaWdodDtcbiAgdmFyIGFycmF5Sm9pbiA9IEFycmF5UHJvdG8uam9pbjtcbiAgdmFyIGFycmF5U29ydCA9IEFycmF5UHJvdG8uc29ydDtcbiAgdmFyIGFycmF5U2xpY2UgPSBBcnJheVByb3RvLnNsaWNlO1xuICB2YXIgYXJyYXlUb1N0cmluZyA9IEFycmF5UHJvdG8udG9TdHJpbmc7XG4gIHZhciBhcnJheVRvTG9jYWxlU3RyaW5nID0gQXJyYXlQcm90by50b0xvY2FsZVN0cmluZztcbiAgdmFyIElURVJBVE9SID0gd2tzKCdpdGVyYXRvcicpO1xuICB2YXIgVEFHID0gd2tzKCd0b1N0cmluZ1RhZycpO1xuICB2YXIgVFlQRURfQ09OU1RSVUNUT1IgPSB1aWQoJ3R5cGVkX2NvbnN0cnVjdG9yJyk7XG4gIHZhciBERUZfQ09OU1RSVUNUT1IgPSB1aWQoJ2RlZl9jb25zdHJ1Y3RvcicpO1xuICB2YXIgQUxMX0NPTlNUUlVDVE9SUyA9ICR0eXBlZC5DT05TVFI7XG4gIHZhciBUWVBFRF9BUlJBWSA9ICR0eXBlZC5UWVBFRDtcbiAgdmFyIFZJRVcgPSAkdHlwZWQuVklFVztcbiAgdmFyIFdST05HX0xFTkdUSCA9ICdXcm9uZyBsZW5ndGghJztcblxuICB2YXIgJG1hcCA9IGNyZWF0ZUFycmF5TWV0aG9kKDEsIGZ1bmN0aW9uIChPLCBsZW5ndGgpIHtcbiAgICByZXR1cm4gYWxsb2NhdGUoc3BlY2llc0NvbnN0cnVjdG9yKE8sIE9bREVGX0NPTlNUUlVDVE9SXSksIGxlbmd0aCk7XG4gIH0pO1xuXG4gIHZhciBMSVRUTEVfRU5ESUFOID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAgIHJldHVybiBuZXcgVWludDhBcnJheShuZXcgVWludDE2QXJyYXkoWzFdKS5idWZmZXIpWzBdID09PSAxO1xuICB9KTtcblxuICB2YXIgRk9SQ0VEX1NFVCA9ICEhVWludDhBcnJheSAmJiAhIVVpbnQ4QXJyYXlbUFJPVE9UWVBFXS5zZXQgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBVaW50OEFycmF5KDEpLnNldCh7fSk7XG4gIH0pO1xuXG4gIHZhciB0b09mZnNldCA9IGZ1bmN0aW9uIChpdCwgQllURVMpIHtcbiAgICB2YXIgb2Zmc2V0ID0gdG9JbnRlZ2VyKGl0KTtcbiAgICBpZiAob2Zmc2V0IDwgMCB8fCBvZmZzZXQgJSBCWVRFUykgdGhyb3cgUmFuZ2VFcnJvcignV3Jvbmcgb2Zmc2V0IScpO1xuICAgIHJldHVybiBvZmZzZXQ7XG4gIH07XG5cbiAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgaWYgKGlzT2JqZWN0KGl0KSAmJiBUWVBFRF9BUlJBWSBpbiBpdCkgcmV0dXJuIGl0O1xuICAgIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgdHlwZWQgYXJyYXkhJyk7XG4gIH07XG5cbiAgdmFyIGFsbG9jYXRlID0gZnVuY3Rpb24gKEMsIGxlbmd0aCkge1xuICAgIGlmICghKGlzT2JqZWN0KEMpICYmIFRZUEVEX0NPTlNUUlVDVE9SIGluIEMpKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0l0IGlzIG5vdCBhIHR5cGVkIGFycmF5IGNvbnN0cnVjdG9yIScpO1xuICAgIH0gcmV0dXJuIG5ldyBDKGxlbmd0aCk7XG4gIH07XG5cbiAgdmFyIHNwZWNpZXNGcm9tTGlzdCA9IGZ1bmN0aW9uIChPLCBsaXN0KSB7XG4gICAgcmV0dXJuIGZyb21MaXN0KHNwZWNpZXNDb25zdHJ1Y3RvcihPLCBPW0RFRl9DT05TVFJVQ1RPUl0pLCBsaXN0KTtcbiAgfTtcblxuICB2YXIgZnJvbUxpc3QgPSBmdW5jdGlvbiAoQywgbGlzdCkge1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSBhbGxvY2F0ZShDLCBsZW5ndGgpO1xuICAgIHdoaWxlIChsZW5ndGggPiBpbmRleCkgcmVzdWx0W2luZGV4XSA9IGxpc3RbaW5kZXgrK107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgYWRkR2V0dGVyID0gZnVuY3Rpb24gKGl0LCBrZXksIGludGVybmFsKSB7XG4gICAgZFAoaXQsIGtleSwgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2RbaW50ZXJuYWxdOyB9IH0pO1xuICB9O1xuXG4gIHZhciAkZnJvbSA9IGZ1bmN0aW9uIGZyb20oc291cmNlIC8qICwgbWFwZm4sIHRoaXNBcmcgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHNvdXJjZSk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBtYXBmbiA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBpLCBsZW5ndGgsIHZhbHVlcywgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZiAoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhaXNBcnJheUl0ZXIoaXRlckZuKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCB2YWx1ZXMgPSBbXSwgaSA9IDA7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaSsrKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHN0ZXAudmFsdWUpO1xuICAgICAgfSBPID0gdmFsdWVzO1xuICAgIH1cbiAgICBpZiAobWFwcGluZyAmJiBhTGVuID4gMikgbWFwZm4gPSBjdHgobWFwZm4sIGFyZ3VtZW50c1syXSwgMik7XG4gICAgZm9yIChpID0gMCwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpLCByZXN1bHQgPSBhbGxvY2F0ZSh0aGlzLCBsZW5ndGgpOyBsZW5ndGggPiBpOyBpKyspIHtcbiAgICAgIHJlc3VsdFtpXSA9IG1hcHBpbmcgPyBtYXBmbihPW2ldLCBpKSA6IE9baV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyICRvZiA9IGZ1bmN0aW9uIG9mKC8qIC4uLml0ZW1zICovKSB7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0ID0gYWxsb2NhdGUodGhpcywgbGVuZ3RoKTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHJlc3VsdFtpbmRleF0gPSBhcmd1bWVudHNbaW5kZXgrK107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBpT1MgU2FmYXJpIDYueCBmYWlscyBoZXJlXG4gIHZhciBUT19MT0NBTEVfQlVHID0gISFVaW50OEFycmF5ICYmIGZhaWxzKGZ1bmN0aW9uICgpIHsgYXJyYXlUb0xvY2FsZVN0cmluZy5jYWxsKG5ldyBVaW50OEFycmF5KDEpKTsgfSk7XG5cbiAgdmFyICR0b0xvY2FsZVN0cmluZyA9IGZ1bmN0aW9uIHRvTG9jYWxlU3RyaW5nKCkge1xuICAgIHJldHVybiBhcnJheVRvTG9jYWxlU3RyaW5nLmFwcGx5KFRPX0xPQ0FMRV9CVUcgPyBhcnJheVNsaWNlLmNhbGwodmFsaWRhdGUodGhpcykpIDogdmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgdmFyIHByb3RvID0ge1xuICAgIGNvcHlXaXRoaW46IGZ1bmN0aW9uIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCAvKiAsIGVuZCAqLykge1xuICAgICAgcmV0dXJuIGFycmF5Q29weVdpdGhpbi5jYWxsKHZhbGlkYXRlKHRoaXMpLCB0YXJnZXQsIHN0YXJ0LCBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBldmVyeTogZnVuY3Rpb24gZXZlcnkoY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgICAgIHJldHVybiBhcnJheUV2ZXJ5KHZhbGlkYXRlKHRoaXMpLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBmaWxsOiBmdW5jdGlvbiBmaWxsKHZhbHVlIC8qICwgc3RhcnQsIGVuZCAqLykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICByZXR1cm4gYXJyYXlGaWxsLmFwcGx5KHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIoY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgICAgIHJldHVybiBzcGVjaWVzRnJvbUxpc3QodGhpcywgYXJyYXlGaWx0ZXIodmFsaWRhdGUodGhpcyksIGNhbGxiYWNrZm4sXG4gICAgICAgIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKSk7XG4gICAgfSxcbiAgICBmaW5kOiBmdW5jdGlvbiBmaW5kKHByZWRpY2F0ZSAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgICAgIHJldHVybiBhcnJheUZpbmQodmFsaWRhdGUodGhpcyksIHByZWRpY2F0ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgZmluZEluZGV4OiBmdW5jdGlvbiBmaW5kSW5kZXgocHJlZGljYXRlIC8qICwgdGhpc0FyZyAqLykge1xuICAgICAgcmV0dXJuIGFycmF5RmluZEluZGV4KHZhbGlkYXRlKHRoaXMpLCBwcmVkaWNhdGUsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgICAgIGFycmF5Rm9yRWFjaCh2YWxpZGF0ZSh0aGlzKSwgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50IC8qICwgZnJvbUluZGV4ICovKSB7XG4gICAgICByZXR1cm4gYXJyYXlJbmRleE9mKHZhbGlkYXRlKHRoaXMpLCBzZWFyY2hFbGVtZW50LCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXMoc2VhcmNoRWxlbWVudCAvKiAsIGZyb21JbmRleCAqLykge1xuICAgICAgcmV0dXJuIGFycmF5SW5jbHVkZXModmFsaWRhdGUodGhpcyksIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGpvaW46IGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheUpvaW4uYXBwbHkodmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBsYXN0SW5kZXhPZjogZnVuY3Rpb24gbGFzdEluZGV4T2Yoc2VhcmNoRWxlbWVudCAvKiAsIGZyb21JbmRleCAqLykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICByZXR1cm4gYXJyYXlMYXN0SW5kZXhPZi5hcHBseSh2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIG1hcDogZnVuY3Rpb24gbWFwKG1hcGZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgICAgcmV0dXJuICRtYXAodmFsaWRhdGUodGhpcyksIG1hcGZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICByZWR1Y2U6IGZ1bmN0aW9uIHJlZHVjZShjYWxsYmFja2ZuIC8qICwgaW5pdGlhbFZhbHVlICovKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheVJlZHVjZS5hcHBseSh2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHJlZHVjZVJpZ2h0OiBmdW5jdGlvbiByZWR1Y2VSaWdodChjYWxsYmFja2ZuIC8qICwgaW5pdGlhbFZhbHVlICovKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheVJlZHVjZVJpZ2h0LmFwcGx5KHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgcmV2ZXJzZTogZnVuY3Rpb24gcmV2ZXJzZSgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciBsZW5ndGggPSB2YWxpZGF0ZSh0aGF0KS5sZW5ndGg7XG4gICAgICB2YXIgbWlkZGxlID0gTWF0aC5mbG9vcihsZW5ndGggLyAyKTtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICB2YXIgdmFsdWU7XG4gICAgICB3aGlsZSAoaW5kZXggPCBtaWRkbGUpIHtcbiAgICAgICAgdmFsdWUgPSB0aGF0W2luZGV4XTtcbiAgICAgICAgdGhhdFtpbmRleCsrXSA9IHRoYXRbLS1sZW5ndGhdO1xuICAgICAgICB0aGF0W2xlbmd0aF0gPSB2YWx1ZTtcbiAgICAgIH0gcmV0dXJuIHRoYXQ7XG4gICAgfSxcbiAgICBzb21lOiBmdW5jdGlvbiBzb21lKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgICByZXR1cm4gYXJyYXlTb21lKHZhbGlkYXRlKHRoaXMpLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBzb3J0OiBmdW5jdGlvbiBzb3J0KGNvbXBhcmVmbikge1xuICAgICAgcmV0dXJuIGFycmF5U29ydC5jYWxsKHZhbGlkYXRlKHRoaXMpLCBjb21wYXJlZm4pO1xuICAgIH0sXG4gICAgc3ViYXJyYXk6IGZ1bmN0aW9uIHN1YmFycmF5KGJlZ2luLCBlbmQpIHtcbiAgICAgIHZhciBPID0gdmFsaWRhdGUodGhpcyk7XG4gICAgICB2YXIgbGVuZ3RoID0gTy5sZW5ndGg7XG4gICAgICB2YXIgJGJlZ2luID0gdG9BYnNvbHV0ZUluZGV4KGJlZ2luLCBsZW5ndGgpO1xuICAgICAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKE8sIE9bREVGX0NPTlNUUlVDVE9SXSkpKFxuICAgICAgICBPLmJ1ZmZlcixcbiAgICAgICAgTy5ieXRlT2Zmc2V0ICsgJGJlZ2luICogTy5CWVRFU19QRVJfRUxFTUVOVCxcbiAgICAgICAgdG9MZW5ndGgoKGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9BYnNvbHV0ZUluZGV4KGVuZCwgbGVuZ3RoKSkgLSAkYmVnaW4pXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICB2YXIgJHNsaWNlID0gZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBzcGVjaWVzRnJvbUxpc3QodGhpcywgYXJyYXlTbGljZS5jYWxsKHZhbGlkYXRlKHRoaXMpLCBzdGFydCwgZW5kKSk7XG4gIH07XG5cbiAgdmFyICRzZXQgPSBmdW5jdGlvbiBzZXQoYXJyYXlMaWtlIC8qICwgb2Zmc2V0ICovKSB7XG4gICAgdmFsaWRhdGUodGhpcyk7XG4gICAgdmFyIG9mZnNldCA9IHRvT2Zmc2V0KGFyZ3VtZW50c1sxXSwgMSk7XG4gICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgIHZhciBzcmMgPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBsZW4gPSB0b0xlbmd0aChzcmMubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIGlmIChsZW4gKyBvZmZzZXQgPiBsZW5ndGgpIHRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICB3aGlsZSAoaW5kZXggPCBsZW4pIHRoaXNbb2Zmc2V0ICsgaW5kZXhdID0gc3JjW2luZGV4KytdO1xuICB9O1xuXG4gIHZhciAkaXRlcmF0b3JzID0ge1xuICAgIGVudHJpZXM6IGZ1bmN0aW9uIGVudHJpZXMoKSB7XG4gICAgICByZXR1cm4gYXJyYXlFbnRyaWVzLmNhbGwodmFsaWRhdGUodGhpcykpO1xuICAgIH0sXG4gICAga2V5czogZnVuY3Rpb24ga2V5cygpIHtcbiAgICAgIHJldHVybiBhcnJheUtleXMuY2FsbCh2YWxpZGF0ZSh0aGlzKSk7XG4gICAgfSxcbiAgICB2YWx1ZXM6IGZ1bmN0aW9uIHZhbHVlcygpIHtcbiAgICAgIHJldHVybiBhcnJheVZhbHVlcy5jYWxsKHZhbGlkYXRlKHRoaXMpKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGlzVEFJbmRleCA9IGZ1bmN0aW9uICh0YXJnZXQsIGtleSkge1xuICAgIHJldHVybiBpc09iamVjdCh0YXJnZXQpXG4gICAgICAmJiB0YXJnZXRbVFlQRURfQVJSQVldXG4gICAgICAmJiB0eXBlb2Yga2V5ICE9ICdzeW1ib2wnXG4gICAgICAmJiBrZXkgaW4gdGFyZ2V0XG4gICAgICAmJiBTdHJpbmcoK2tleSkgPT0gU3RyaW5nKGtleSk7XG4gIH07XG4gIHZhciAkZ2V0RGVzYyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuICAgIHJldHVybiBpc1RBSW5kZXgodGFyZ2V0LCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKVxuICAgICAgPyBwcm9wZXJ0eURlc2MoMiwgdGFyZ2V0W2tleV0pXG4gICAgICA6IGdPUEQodGFyZ2V0LCBrZXkpO1xuICB9O1xuICB2YXIgJHNldERlc2MgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIGlmIChpc1RBSW5kZXgodGFyZ2V0LCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKVxuICAgICAgJiYgaXNPYmplY3QoZGVzYylcbiAgICAgICYmIGhhcyhkZXNjLCAndmFsdWUnKVxuICAgICAgJiYgIWhhcyhkZXNjLCAnZ2V0JylcbiAgICAgICYmICFoYXMoZGVzYywgJ3NldCcpXG4gICAgICAvLyBUT0RPOiBhZGQgdmFsaWRhdGlvbiBkZXNjcmlwdG9yIHcvbyBjYWxsaW5nIGFjY2Vzc29yc1xuICAgICAgJiYgIWRlc2MuY29uZmlndXJhYmxlXG4gICAgICAmJiAoIWhhcyhkZXNjLCAnd3JpdGFibGUnKSB8fCBkZXNjLndyaXRhYmxlKVxuICAgICAgJiYgKCFoYXMoZGVzYywgJ2VudW1lcmFibGUnKSB8fCBkZXNjLmVudW1lcmFibGUpXG4gICAgKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IGRlc2MudmFsdWU7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0gcmV0dXJuIGRQKHRhcmdldCwga2V5LCBkZXNjKTtcbiAgfTtcblxuICBpZiAoIUFMTF9DT05TVFJVQ1RPUlMpIHtcbiAgICAkR09QRC5mID0gJGdldERlc2M7XG4gICAgJERQLmYgPSAkc2V0RGVzYztcbiAgfVxuXG4gICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIUFMTF9DT05TVFJVQ1RPUlMsICdPYmplY3QnLCB7XG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0RGVzYyxcbiAgICBkZWZpbmVQcm9wZXJ0eTogJHNldERlc2NcbiAgfSk7XG5cbiAgaWYgKGZhaWxzKGZ1bmN0aW9uICgpIHsgYXJyYXlUb1N0cmluZy5jYWxsKHt9KTsgfSkpIHtcbiAgICBhcnJheVRvU3RyaW5nID0gYXJyYXlUb0xvY2FsZVN0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIGFycmF5Sm9pbi5jYWxsKHRoaXMpO1xuICAgIH07XG4gIH1cblxuICB2YXIgJFR5cGVkQXJyYXlQcm90b3R5cGUkID0gcmVkZWZpbmVBbGwoe30sIHByb3RvKTtcbiAgcmVkZWZpbmVBbGwoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCAkaXRlcmF0b3JzKTtcbiAgaGlkZSgkVHlwZWRBcnJheVByb3RvdHlwZSQsIElURVJBVE9SLCAkaXRlcmF0b3JzLnZhbHVlcyk7XG4gIHJlZGVmaW5lQWxsKCRUeXBlZEFycmF5UHJvdG90eXBlJCwge1xuICAgIHNsaWNlOiAkc2xpY2UsXG4gICAgc2V0OiAkc2V0LFxuICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoKSB7IC8qIG5vb3AgKi8gfSxcbiAgICB0b1N0cmluZzogYXJyYXlUb1N0cmluZyxcbiAgICB0b0xvY2FsZVN0cmluZzogJHRvTG9jYWxlU3RyaW5nXG4gIH0pO1xuICBhZGRHZXR0ZXIoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCAnYnVmZmVyJywgJ2InKTtcbiAgYWRkR2V0dGVyKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgJ2J5dGVPZmZzZXQnLCAnbycpO1xuICBhZGRHZXR0ZXIoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCAnYnl0ZUxlbmd0aCcsICdsJyk7XG4gIGFkZEdldHRlcigkVHlwZWRBcnJheVByb3RvdHlwZSQsICdsZW5ndGgnLCAnZScpO1xuICBkUCgkVHlwZWRBcnJheVByb3RvdHlwZSQsIFRBRywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpc1tUWVBFRF9BUlJBWV07IH1cbiAgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1zdGF0ZW1lbnRzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSwgQllURVMsIHdyYXBwZXIsIENMQU1QRUQpIHtcbiAgICBDTEFNUEVEID0gISFDTEFNUEVEO1xuICAgIHZhciBOQU1FID0gS0VZICsgKENMQU1QRUQgPyAnQ2xhbXBlZCcgOiAnJykgKyAnQXJyYXknO1xuICAgIHZhciBHRVRURVIgPSAnZ2V0JyArIEtFWTtcbiAgICB2YXIgU0VUVEVSID0gJ3NldCcgKyBLRVk7XG4gICAgdmFyIFR5cGVkQXJyYXkgPSBnbG9iYWxbTkFNRV07XG4gICAgdmFyIEJhc2UgPSBUeXBlZEFycmF5IHx8IHt9O1xuICAgIHZhciBUQUMgPSBUeXBlZEFycmF5ICYmIGdldFByb3RvdHlwZU9mKFR5cGVkQXJyYXkpO1xuICAgIHZhciBGT1JDRUQgPSAhVHlwZWRBcnJheSB8fCAhJHR5cGVkLkFCVjtcbiAgICB2YXIgTyA9IHt9O1xuICAgIHZhciBUeXBlZEFycmF5UHJvdG90eXBlID0gVHlwZWRBcnJheSAmJiBUeXBlZEFycmF5W1BST1RPVFlQRV07XG4gICAgdmFyIGdldHRlciA9IGZ1bmN0aW9uICh0aGF0LCBpbmRleCkge1xuICAgICAgdmFyIGRhdGEgPSB0aGF0Ll9kO1xuICAgICAgcmV0dXJuIGRhdGEudltHRVRURVJdKGluZGV4ICogQllURVMgKyBkYXRhLm8sIExJVFRMRV9FTkRJQU4pO1xuICAgIH07XG4gICAgdmFyIHNldHRlciA9IGZ1bmN0aW9uICh0aGF0LCBpbmRleCwgdmFsdWUpIHtcbiAgICAgIHZhciBkYXRhID0gdGhhdC5fZDtcbiAgICAgIGlmIChDTEFNUEVEKSB2YWx1ZSA9ICh2YWx1ZSA9IE1hdGgucm91bmQodmFsdWUpKSA8IDAgPyAwIDogdmFsdWUgPiAweGZmID8gMHhmZiA6IHZhbHVlICYgMHhmZjtcbiAgICAgIGRhdGEudltTRVRURVJdKGluZGV4ICogQllURVMgKyBkYXRhLm8sIHZhbHVlLCBMSVRUTEVfRU5ESUFOKTtcbiAgICB9O1xuICAgIHZhciBhZGRFbGVtZW50ID0gZnVuY3Rpb24gKHRoYXQsIGluZGV4KSB7XG4gICAgICBkUCh0aGF0LCBpbmRleCwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0dGVyKHRoaXMsIGluZGV4KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gc2V0dGVyKHRoaXMsIGluZGV4LCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkge1xuICAgICAgVHlwZWRBcnJheSA9IHdyYXBwZXIoZnVuY3Rpb24gKHRoYXQsIGRhdGEsICRvZmZzZXQsICRsZW5ndGgpIHtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGF0LCBUeXBlZEFycmF5LCBOQU1FLCAnX2QnKTtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgdmFyIG9mZnNldCA9IDA7XG4gICAgICAgIHZhciBidWZmZXIsIGJ5dGVMZW5ndGgsIGxlbmd0aCwga2xhc3M7XG4gICAgICAgIGlmICghaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgICAgICBsZW5ndGggPSB0b0luZGV4KGRhdGEpO1xuICAgICAgICAgIGJ5dGVMZW5ndGggPSBsZW5ndGggKiBCWVRFUztcbiAgICAgICAgICBidWZmZXIgPSBuZXcgJEFycmF5QnVmZmVyKGJ5dGVMZW5ndGgpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiAkQXJyYXlCdWZmZXIgfHwgKGtsYXNzID0gY2xhc3NvZihkYXRhKSkgPT0gQVJSQVlfQlVGRkVSIHx8IGtsYXNzID09IFNIQVJFRF9CVUZGRVIpIHtcbiAgICAgICAgICBidWZmZXIgPSBkYXRhO1xuICAgICAgICAgIG9mZnNldCA9IHRvT2Zmc2V0KCRvZmZzZXQsIEJZVEVTKTtcbiAgICAgICAgICB2YXIgJGxlbiA9IGRhdGEuYnl0ZUxlbmd0aDtcbiAgICAgICAgICBpZiAoJGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoJGxlbiAlIEJZVEVTKSB0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgICAgICAgICBieXRlTGVuZ3RoID0gJGxlbiAtIG9mZnNldDtcbiAgICAgICAgICAgIGlmIChieXRlTGVuZ3RoIDwgMCkgdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBieXRlTGVuZ3RoID0gdG9MZW5ndGgoJGxlbmd0aCkgKiBCWVRFUztcbiAgICAgICAgICAgIGlmIChieXRlTGVuZ3RoICsgb2Zmc2V0ID4gJGxlbikgdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZW5ndGggPSBieXRlTGVuZ3RoIC8gQllURVM7XG4gICAgICAgIH0gZWxzZSBpZiAoVFlQRURfQVJSQVkgaW4gZGF0YSkge1xuICAgICAgICAgIHJldHVybiBmcm9tTGlzdChUeXBlZEFycmF5LCBkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJGZyb20uY2FsbChUeXBlZEFycmF5LCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBoaWRlKHRoYXQsICdfZCcsIHtcbiAgICAgICAgICBiOiBidWZmZXIsXG4gICAgICAgICAgbzogb2Zmc2V0LFxuICAgICAgICAgIGw6IGJ5dGVMZW5ndGgsXG4gICAgICAgICAgZTogbGVuZ3RoLFxuICAgICAgICAgIHY6IG5ldyAkRGF0YVZpZXcoYnVmZmVyKVxuICAgICAgICB9KTtcbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSBhZGRFbGVtZW50KHRoYXQsIGluZGV4KyspO1xuICAgICAgfSk7XG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlID0gVHlwZWRBcnJheVtQUk9UT1RZUEVdID0gY3JlYXRlKCRUeXBlZEFycmF5UHJvdG90eXBlJCk7XG4gICAgICBoaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIFR5cGVkQXJyYXkpO1xuICAgIH0gZWxzZSBpZiAoIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIFR5cGVkQXJyYXkoMSk7XG4gICAgfSkgfHwgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIG5ldyBUeXBlZEFycmF5KC0xKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICB9KSB8fCAhJGl0ZXJEZXRlY3QoZnVuY3Rpb24gKGl0ZXIpIHtcbiAgICAgIG5ldyBUeXBlZEFycmF5KCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgICBuZXcgVHlwZWRBcnJheShudWxsKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAgIG5ldyBUeXBlZEFycmF5KDEuNSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgICBuZXcgVHlwZWRBcnJheShpdGVyKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICB9LCB0cnVlKSkge1xuICAgICAgVHlwZWRBcnJheSA9IHdyYXBwZXIoZnVuY3Rpb24gKHRoYXQsIGRhdGEsICRvZmZzZXQsICRsZW5ndGgpIHtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGF0LCBUeXBlZEFycmF5LCBOQU1FKTtcbiAgICAgICAgdmFyIGtsYXNzO1xuICAgICAgICAvLyBgd3NgIG1vZHVsZSBidWcsIHRlbXBvcmFyaWx5IHJlbW92ZSB2YWxpZGF0aW9uIGxlbmd0aCBmb3IgVWludDhBcnJheVxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vd2Vic29ja2V0cy93cy9wdWxsLzY0NVxuICAgICAgICBpZiAoIWlzT2JqZWN0KGRhdGEpKSByZXR1cm4gbmV3IEJhc2UodG9JbmRleChkYXRhKSk7XG4gICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgJEFycmF5QnVmZmVyIHx8IChrbGFzcyA9IGNsYXNzb2YoZGF0YSkpID09IEFSUkFZX0JVRkZFUiB8fCBrbGFzcyA9PSBTSEFSRURfQlVGRkVSKSB7XG4gICAgICAgICAgcmV0dXJuICRsZW5ndGggIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBuZXcgQmFzZShkYXRhLCB0b09mZnNldCgkb2Zmc2V0LCBCWVRFUyksICRsZW5ndGgpXG4gICAgICAgICAgICA6ICRvZmZzZXQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA/IG5ldyBCYXNlKGRhdGEsIHRvT2Zmc2V0KCRvZmZzZXQsIEJZVEVTKSlcbiAgICAgICAgICAgICAgOiBuZXcgQmFzZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoVFlQRURfQVJSQVkgaW4gZGF0YSkgcmV0dXJuIGZyb21MaXN0KFR5cGVkQXJyYXksIGRhdGEpO1xuICAgICAgICByZXR1cm4gJGZyb20uY2FsbChUeXBlZEFycmF5LCBkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgYXJyYXlGb3JFYWNoKFRBQyAhPT0gRnVuY3Rpb24ucHJvdG90eXBlID8gZ09QTihCYXNlKS5jb25jYXQoZ09QTihUQUMpKSA6IGdPUE4oQmFzZSksIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKCEoa2V5IGluIFR5cGVkQXJyYXkpKSBoaWRlKFR5cGVkQXJyYXksIGtleSwgQmFzZVtrZXldKTtcbiAgICAgIH0pO1xuICAgICAgVHlwZWRBcnJheVtQUk9UT1RZUEVdID0gVHlwZWRBcnJheVByb3RvdHlwZTtcbiAgICAgIGlmICghTElCUkFSWSkgVHlwZWRBcnJheVByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFR5cGVkQXJyYXk7XG4gICAgfVxuICAgIHZhciAkbmF0aXZlSXRlcmF0b3IgPSBUeXBlZEFycmF5UHJvdG90eXBlW0lURVJBVE9SXTtcbiAgICB2YXIgQ09SUkVDVF9JVEVSX05BTUUgPSAhISRuYXRpdmVJdGVyYXRvclxuICAgICAgJiYgKCRuYXRpdmVJdGVyYXRvci5uYW1lID09ICd2YWx1ZXMnIHx8ICRuYXRpdmVJdGVyYXRvci5uYW1lID09IHVuZGVmaW5lZCk7XG4gICAgdmFyICRpdGVyYXRvciA9ICRpdGVyYXRvcnMudmFsdWVzO1xuICAgIGhpZGUoVHlwZWRBcnJheSwgVFlQRURfQ09OU1RSVUNUT1IsIHRydWUpO1xuICAgIGhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgVFlQRURfQVJSQVksIE5BTUUpO1xuICAgIGhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgVklFVywgdHJ1ZSk7XG4gICAgaGlkZShUeXBlZEFycmF5UHJvdG90eXBlLCBERUZfQ09OU1RSVUNUT1IsIFR5cGVkQXJyYXkpO1xuXG4gICAgaWYgKENMQU1QRUQgPyBuZXcgVHlwZWRBcnJheSgxKVtUQUddICE9IE5BTUUgOiAhKFRBRyBpbiBUeXBlZEFycmF5UHJvdG90eXBlKSkge1xuICAgICAgZFAoVHlwZWRBcnJheVByb3RvdHlwZSwgVEFHLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gTkFNRTsgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgT1tOQU1FXSA9IFR5cGVkQXJyYXk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChUeXBlZEFycmF5ICE9IEJhc2UpLCBPKTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5TLCBOQU1FLCB7XG4gICAgICBCWVRFU19QRVJfRUxFTUVOVDogQllURVNcbiAgICB9KTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24gKCkgeyBCYXNlLm9mLmNhbGwoVHlwZWRBcnJheSwgMSk7IH0pLCBOQU1FLCB7XG4gICAgICBmcm9tOiAkZnJvbSxcbiAgICAgIG9mOiAkb2ZcbiAgICB9KTtcblxuICAgIGlmICghKEJZVEVTX1BFUl9FTEVNRU5UIGluIFR5cGVkQXJyYXlQcm90b3R5cGUpKSBoaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsIEJZVEVTX1BFUl9FTEVNRU5ULCBCWVRFUyk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUCwgTkFNRSwgcHJvdG8pO1xuXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogRk9SQ0VEX1NFVCwgTkFNRSwgeyBzZXQ6ICRzZXQgfSk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqICFDT1JSRUNUX0lURVJfTkFNRSwgTkFNRSwgJGl0ZXJhdG9ycyk7XG5cbiAgICBpZiAoIUxJQlJBUlkgJiYgVHlwZWRBcnJheVByb3RvdHlwZS50b1N0cmluZyAhPSBhcnJheVRvU3RyaW5nKSBUeXBlZEFycmF5UHJvdG90eXBlLnRvU3RyaW5nID0gYXJyYXlUb1N0cmluZztcblxuICAgICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgICAgbmV3IFR5cGVkQXJyYXkoMSkuc2xpY2UoKTtcbiAgICB9KSwgTkFNRSwgeyBzbGljZTogJHNsaWNlIH0pO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIFsxLCAyXS50b0xvY2FsZVN0cmluZygpICE9IG5ldyBUeXBlZEFycmF5KFsxLCAyXSkudG9Mb2NhbGVTdHJpbmcoKTtcbiAgICB9KSB8fCAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZS50b0xvY2FsZVN0cmluZy5jYWxsKFsxLCAyXSk7XG4gICAgfSkpLCBOQU1FLCB7IHRvTG9jYWxlU3RyaW5nOiAkdG9Mb2NhbGVTdHJpbmcgfSk7XG5cbiAgICBJdGVyYXRvcnNbTkFNRV0gPSBDT1JSRUNUX0lURVJfTkFNRSA/ICRuYXRpdmVJdGVyYXRvciA6ICRpdGVyYXRvcjtcbiAgICBpZiAoIUxJQlJBUlkgJiYgIUNPUlJFQ1RfSVRFUl9OQU1FKSBoaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsIElURVJBVE9SLCAkaXRlcmF0b3IpO1xuICB9O1xufSBlbHNlIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICR0eXBlZCA9IHJlcXVpcmUoJy4vX3R5cGVkJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0luZGV4ID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbnZhciBnT1BOID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBhcnJheUZpbGwgPSByZXF1aXJlKCcuL19hcnJheS1maWxsJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEFSUkFZX0JVRkZFUiA9ICdBcnJheUJ1ZmZlcic7XG52YXIgREFUQV9WSUVXID0gJ0RhdGFWaWV3JztcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcbnZhciBXUk9OR19MRU5HVEggPSAnV3JvbmcgbGVuZ3RoISc7XG52YXIgV1JPTkdfSU5ERVggPSAnV3JvbmcgaW5kZXghJztcbnZhciAkQXJyYXlCdWZmZXIgPSBnbG9iYWxbQVJSQVlfQlVGRkVSXTtcbnZhciAkRGF0YVZpZXcgPSBnbG9iYWxbREFUQV9WSUVXXTtcbnZhciBNYXRoID0gZ2xvYmFsLk1hdGg7XG52YXIgUmFuZ2VFcnJvciA9IGdsb2JhbC5SYW5nZUVycm9yO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvdy1yZXN0cmljdGVkLW5hbWVzXG52YXIgSW5maW5pdHkgPSBnbG9iYWwuSW5maW5pdHk7XG52YXIgQmFzZUJ1ZmZlciA9ICRBcnJheUJ1ZmZlcjtcbnZhciBhYnMgPSBNYXRoLmFicztcbnZhciBwb3cgPSBNYXRoLnBvdztcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG52YXIgbG9nID0gTWF0aC5sb2c7XG52YXIgTE4yID0gTWF0aC5MTjI7XG52YXIgQlVGRkVSID0gJ2J1ZmZlcic7XG52YXIgQllURV9MRU5HVEggPSAnYnl0ZUxlbmd0aCc7XG52YXIgQllURV9PRkZTRVQgPSAnYnl0ZU9mZnNldCc7XG52YXIgJEJVRkZFUiA9IERFU0NSSVBUT1JTID8gJ19iJyA6IEJVRkZFUjtcbnZhciAkTEVOR1RIID0gREVTQ1JJUFRPUlMgPyAnX2wnIDogQllURV9MRU5HVEg7XG52YXIgJE9GRlNFVCA9IERFU0NSSVBUT1JTID8gJ19vJyA6IEJZVEVfT0ZGU0VUO1xuXG4vLyBJRUVFNzU0IGNvbnZlcnNpb25zIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvaWVlZTc1NFxuZnVuY3Rpb24gcGFja0lFRUU3NTQodmFsdWUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgYnVmZmVyID0gbmV3IEFycmF5KG5CeXRlcyk7XG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxO1xuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMTtcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxO1xuICB2YXIgcnQgPSBtTGVuID09PSAyMyA/IHBvdygyLCAtMjQpIC0gcG93KDIsIC03NykgOiAwO1xuICB2YXIgaSA9IDA7XG4gIHZhciBzID0gdmFsdWUgPCAwIHx8IHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDAgPyAxIDogMDtcbiAgdmFyIGUsIG0sIGM7XG4gIHZhbHVlID0gYWJzKHZhbHVlKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICBpZiAodmFsdWUgIT0gdmFsdWUgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIG0gPSB2YWx1ZSAhPSB2YWx1ZSA/IDEgOiAwO1xuICAgIGUgPSBlTWF4O1xuICB9IGVsc2Uge1xuICAgIGUgPSBmbG9vcihsb2codmFsdWUpIC8gTE4yKTtcbiAgICBpZiAodmFsdWUgKiAoYyA9IHBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tO1xuICAgICAgYyAqPSAyO1xuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBwb3coMiwgMSAtIGVCaWFzKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKys7XG4gICAgICBjIC89IDI7XG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDA7XG4gICAgICBlID0gZU1heDtcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogcG93KDIsIG1MZW4pO1xuICAgICAgZSA9IGUgKyBlQmlhcztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogcG93KDIsIGVCaWFzIC0gMSkgKiBwb3coMiwgbUxlbik7XG4gICAgICBlID0gMDtcbiAgICB9XG4gIH1cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW2krK10gPSBtICYgMjU1LCBtIC89IDI1NiwgbUxlbiAtPSA4KTtcbiAgZSA9IGUgPDwgbUxlbiB8IG07XG4gIGVMZW4gKz0gbUxlbjtcbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbaSsrXSA9IGUgJiAyNTUsIGUgLz0gMjU2LCBlTGVuIC09IDgpO1xuICBidWZmZXJbLS1pXSB8PSBzICogMTI4O1xuICByZXR1cm4gYnVmZmVyO1xufVxuZnVuY3Rpb24gdW5wYWNrSUVFRTc1NChidWZmZXIsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMTtcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDE7XG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMTtcbiAgdmFyIG5CaXRzID0gZUxlbiAtIDc7XG4gIHZhciBpID0gbkJ5dGVzIC0gMTtcbiAgdmFyIHMgPSBidWZmZXJbaS0tXTtcbiAgdmFyIGUgPSBzICYgMTI3O1xuICB2YXIgbTtcbiAgcyA+Pj0gNztcbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbaV0sIGktLSwgbkJpdHMgLT0gOCk7XG4gIG0gPSBlICYgKDEgPDwgLW5CaXRzKSAtIDE7XG4gIGUgPj49IC1uQml0cztcbiAgbkJpdHMgKz0gbUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbaV0sIGktLSwgbkJpdHMgLT0gOCk7XG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhcztcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiBzID8gLUluZmluaXR5IDogSW5maW5pdHk7XG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBwb3coMiwgbUxlbik7XG4gICAgZSA9IGUgLSBlQmlhcztcbiAgfSByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIHBvdygyLCBlIC0gbUxlbik7XG59XG5cbmZ1bmN0aW9uIHVucGFja0kzMihieXRlcykge1xuICByZXR1cm4gYnl0ZXNbM10gPDwgMjQgfCBieXRlc1syXSA8PCAxNiB8IGJ5dGVzWzFdIDw8IDggfCBieXRlc1swXTtcbn1cbmZ1bmN0aW9uIHBhY2tJOChpdCkge1xuICByZXR1cm4gW2l0ICYgMHhmZl07XG59XG5mdW5jdGlvbiBwYWNrSTE2KGl0KSB7XG4gIHJldHVybiBbaXQgJiAweGZmLCBpdCA+PiA4ICYgMHhmZl07XG59XG5mdW5jdGlvbiBwYWNrSTMyKGl0KSB7XG4gIHJldHVybiBbaXQgJiAweGZmLCBpdCA+PiA4ICYgMHhmZiwgaXQgPj4gMTYgJiAweGZmLCBpdCA+PiAyNCAmIDB4ZmZdO1xufVxuZnVuY3Rpb24gcGFja0Y2NChpdCkge1xuICByZXR1cm4gcGFja0lFRUU3NTQoaXQsIDUyLCA4KTtcbn1cbmZ1bmN0aW9uIHBhY2tGMzIoaXQpIHtcbiAgcmV0dXJuIHBhY2tJRUVFNzU0KGl0LCAyMywgNCk7XG59XG5cbmZ1bmN0aW9uIGFkZEdldHRlcihDLCBrZXksIGludGVybmFsKSB7XG4gIGRQKENbUFJPVE9UWVBFXSwga2V5LCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpc1tpbnRlcm5hbF07IH0gfSk7XG59XG5cbmZ1bmN0aW9uIGdldCh2aWV3LCBieXRlcywgaW5kZXgsIGlzTGl0dGxlRW5kaWFuKSB7XG4gIHZhciBudW1JbmRleCA9ICtpbmRleDtcbiAgdmFyIGludEluZGV4ID0gdG9JbmRleChudW1JbmRleCk7XG4gIGlmIChpbnRJbmRleCArIGJ5dGVzID4gdmlld1skTEVOR1RIXSkgdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19JTkRFWCk7XG4gIHZhciBzdG9yZSA9IHZpZXdbJEJVRkZFUl0uX2I7XG4gIHZhciBzdGFydCA9IGludEluZGV4ICsgdmlld1skT0ZGU0VUXTtcbiAgdmFyIHBhY2sgPSBzdG9yZS5zbGljZShzdGFydCwgc3RhcnQgKyBieXRlcyk7XG4gIHJldHVybiBpc0xpdHRsZUVuZGlhbiA/IHBhY2sgOiBwYWNrLnJldmVyc2UoKTtcbn1cbmZ1bmN0aW9uIHNldCh2aWV3LCBieXRlcywgaW5kZXgsIGNvbnZlcnNpb24sIHZhbHVlLCBpc0xpdHRsZUVuZGlhbikge1xuICB2YXIgbnVtSW5kZXggPSAraW5kZXg7XG4gIHZhciBpbnRJbmRleCA9IHRvSW5kZXgobnVtSW5kZXgpO1xuICBpZiAoaW50SW5kZXggKyBieXRlcyA+IHZpZXdbJExFTkdUSF0pIHRocm93IFJhbmdlRXJyb3IoV1JPTkdfSU5ERVgpO1xuICB2YXIgc3RvcmUgPSB2aWV3WyRCVUZGRVJdLl9iO1xuICB2YXIgc3RhcnQgPSBpbnRJbmRleCArIHZpZXdbJE9GRlNFVF07XG4gIHZhciBwYWNrID0gY29udmVyc2lvbigrdmFsdWUpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzOyBpKyspIHN0b3JlW3N0YXJ0ICsgaV0gPSBwYWNrW2lzTGl0dGxlRW5kaWFuID8gaSA6IGJ5dGVzIC0gaSAtIDFdO1xufVxuXG5pZiAoISR0eXBlZC5BQlYpIHtcbiAgJEFycmF5QnVmZmVyID0gZnVuY3Rpb24gQXJyYXlCdWZmZXIobGVuZ3RoKSB7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkQXJyYXlCdWZmZXIsIEFSUkFZX0JVRkZFUik7XG4gICAgdmFyIGJ5dGVMZW5ndGggPSB0b0luZGV4KGxlbmd0aCk7XG4gICAgdGhpcy5fYiA9IGFycmF5RmlsbC5jYWxsKG5ldyBBcnJheShieXRlTGVuZ3RoKSwgMCk7XG4gICAgdGhpc1skTEVOR1RIXSA9IGJ5dGVMZW5ndGg7XG4gIH07XG5cbiAgJERhdGFWaWV3ID0gZnVuY3Rpb24gRGF0YVZpZXcoYnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKSB7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkRGF0YVZpZXcsIERBVEFfVklFVyk7XG4gICAgYW5JbnN0YW5jZShidWZmZXIsICRBcnJheUJ1ZmZlciwgREFUQV9WSUVXKTtcbiAgICB2YXIgYnVmZmVyTGVuZ3RoID0gYnVmZmVyWyRMRU5HVEhdO1xuICAgIHZhciBvZmZzZXQgPSB0b0ludGVnZXIoYnl0ZU9mZnNldCk7XG4gICAgaWYgKG9mZnNldCA8IDAgfHwgb2Zmc2V0ID4gYnVmZmVyTGVuZ3RoKSB0aHJvdyBSYW5nZUVycm9yKCdXcm9uZyBvZmZzZXQhJyk7XG4gICAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPT09IHVuZGVmaW5lZCA/IGJ1ZmZlckxlbmd0aCAtIG9mZnNldCA6IHRvTGVuZ3RoKGJ5dGVMZW5ndGgpO1xuICAgIGlmIChvZmZzZXQgKyBieXRlTGVuZ3RoID4gYnVmZmVyTGVuZ3RoKSB0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgdGhpc1skQlVGRkVSXSA9IGJ1ZmZlcjtcbiAgICB0aGlzWyRPRkZTRVRdID0gb2Zmc2V0O1xuICAgIHRoaXNbJExFTkdUSF0gPSBieXRlTGVuZ3RoO1xuICB9O1xuXG4gIGlmIChERVNDUklQVE9SUykge1xuICAgIGFkZEdldHRlcigkQXJyYXlCdWZmZXIsIEJZVEVfTEVOR1RILCAnX2wnKTtcbiAgICBhZGRHZXR0ZXIoJERhdGFWaWV3LCBCVUZGRVIsICdfYicpO1xuICAgIGFkZEdldHRlcigkRGF0YVZpZXcsIEJZVEVfTEVOR1RILCAnX2wnKTtcbiAgICBhZGRHZXR0ZXIoJERhdGFWaWV3LCBCWVRFX09GRlNFVCwgJ19vJyk7XG4gIH1cblxuICByZWRlZmluZUFsbCgkRGF0YVZpZXdbUFJPVE9UWVBFXSwge1xuICAgIGdldEludDg6IGZ1bmN0aW9uIGdldEludDgoYnl0ZU9mZnNldCkge1xuICAgICAgcmV0dXJuIGdldCh0aGlzLCAxLCBieXRlT2Zmc2V0KVswXSA8PCAyNCA+PiAyNDtcbiAgICB9LFxuICAgIGdldFVpbnQ4OiBmdW5jdGlvbiBnZXRVaW50OChieXRlT2Zmc2V0KSB7XG4gICAgICByZXR1cm4gZ2V0KHRoaXMsIDEsIGJ5dGVPZmZzZXQpWzBdO1xuICAgIH0sXG4gICAgZ2V0SW50MTY6IGZ1bmN0aW9uIGdldEludDE2KGJ5dGVPZmZzZXQgLyogLCBsaXR0bGVFbmRpYW4gKi8pIHtcbiAgICAgIHZhciBieXRlcyA9IGdldCh0aGlzLCAyLCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pO1xuICAgICAgcmV0dXJuIChieXRlc1sxXSA8PCA4IHwgYnl0ZXNbMF0pIDw8IDE2ID4+IDE2O1xuICAgIH0sXG4gICAgZ2V0VWludDE2OiBmdW5jdGlvbiBnZXRVaW50MTYoYnl0ZU9mZnNldCAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgdmFyIGJ5dGVzID0gZ2V0KHRoaXMsIDIsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSk7XG4gICAgICByZXR1cm4gYnl0ZXNbMV0gPDwgOCB8IGJ5dGVzWzBdO1xuICAgIH0sXG4gICAgZ2V0SW50MzI6IGZ1bmN0aW9uIGdldEludDMyKGJ5dGVPZmZzZXQgLyogLCBsaXR0bGVFbmRpYW4gKi8pIHtcbiAgICAgIHJldHVybiB1bnBhY2tJMzIoZ2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSkpO1xuICAgIH0sXG4gICAgZ2V0VWludDMyOiBmdW5jdGlvbiBnZXRVaW50MzIoYnl0ZU9mZnNldCAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgcmV0dXJuIHVucGFja0kzMihnZXQodGhpcywgNCwgYnl0ZU9mZnNldCwgYXJndW1lbnRzWzFdKSkgPj4+IDA7XG4gICAgfSxcbiAgICBnZXRGbG9hdDMyOiBmdW5jdGlvbiBnZXRGbG9hdDMyKGJ5dGVPZmZzZXQgLyogLCBsaXR0bGVFbmRpYW4gKi8pIHtcbiAgICAgIHJldHVybiB1bnBhY2tJRUVFNzU0KGdldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pLCAyMywgNCk7XG4gICAgfSxcbiAgICBnZXRGbG9hdDY0OiBmdW5jdGlvbiBnZXRGbG9hdDY0KGJ5dGVPZmZzZXQgLyogLCBsaXR0bGVFbmRpYW4gKi8pIHtcbiAgICAgIHJldHVybiB1bnBhY2tJRUVFNzU0KGdldCh0aGlzLCA4LCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pLCA1MiwgOCk7XG4gICAgfSxcbiAgICBzZXRJbnQ4OiBmdW5jdGlvbiBzZXRJbnQ4KGJ5dGVPZmZzZXQsIHZhbHVlKSB7XG4gICAgICBzZXQodGhpcywgMSwgYnl0ZU9mZnNldCwgcGFja0k4LCB2YWx1ZSk7XG4gICAgfSxcbiAgICBzZXRVaW50ODogZnVuY3Rpb24gc2V0VWludDgoYnl0ZU9mZnNldCwgdmFsdWUpIHtcbiAgICAgIHNldCh0aGlzLCAxLCBieXRlT2Zmc2V0LCBwYWNrSTgsIHZhbHVlKTtcbiAgICB9LFxuICAgIHNldEludDE2OiBmdW5jdGlvbiBzZXRJbnQxNihieXRlT2Zmc2V0LCB2YWx1ZSAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgc2V0KHRoaXMsIDIsIGJ5dGVPZmZzZXQsIHBhY2tJMTYsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0VWludDE2OiBmdW5jdGlvbiBzZXRVaW50MTYoYnl0ZU9mZnNldCwgdmFsdWUgLyogLCBsaXR0bGVFbmRpYW4gKi8pIHtcbiAgICAgIHNldCh0aGlzLCAyLCBieXRlT2Zmc2V0LCBwYWNrSTE2LCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9LFxuICAgIHNldEludDMyOiBmdW5jdGlvbiBzZXRJbnQzMihieXRlT2Zmc2V0LCB2YWx1ZSAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgc2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIHBhY2tJMzIsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0VWludDMyOiBmdW5jdGlvbiBzZXRVaW50MzIoYnl0ZU9mZnNldCwgdmFsdWUgLyogLCBsaXR0bGVFbmRpYW4gKi8pIHtcbiAgICAgIHNldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBwYWNrSTMyLCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9LFxuICAgIHNldEZsb2F0MzI6IGZ1bmN0aW9uIHNldEZsb2F0MzIoYnl0ZU9mZnNldCwgdmFsdWUgLyogLCBsaXR0bGVFbmRpYW4gKi8pIHtcbiAgICAgIHNldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBwYWNrRjMyLCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9LFxuICAgIHNldEZsb2F0NjQ6IGZ1bmN0aW9uIHNldEZsb2F0NjQoYnl0ZU9mZnNldCwgdmFsdWUgLyogLCBsaXR0bGVFbmRpYW4gKi8pIHtcbiAgICAgIHNldCh0aGlzLCA4LCBieXRlT2Zmc2V0LCBwYWNrRjY0LCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9XG4gIH0pO1xufSBlbHNlIHtcbiAgaWYgKCFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgJEFycmF5QnVmZmVyKDEpO1xuICB9KSB8fCAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyAkQXJyYXlCdWZmZXIoLTEpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICB9KSB8fCBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgbmV3ICRBcnJheUJ1ZmZlcigpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5ldyAkQXJyYXlCdWZmZXIoMS41KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBuZXcgJEFycmF5QnVmZmVyKE5hTik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgcmV0dXJuICRBcnJheUJ1ZmZlci5uYW1lICE9IEFSUkFZX0JVRkZFUjtcbiAgfSkpIHtcbiAgICAkQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiBBcnJheUJ1ZmZlcihsZW5ndGgpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhpcywgJEFycmF5QnVmZmVyKTtcbiAgICAgIHJldHVybiBuZXcgQmFzZUJ1ZmZlcih0b0luZGV4KGxlbmd0aCkpO1xuICAgIH07XG4gICAgdmFyIEFycmF5QnVmZmVyUHJvdG8gPSAkQXJyYXlCdWZmZXJbUFJPVE9UWVBFXSA9IEJhc2VCdWZmZXJbUFJPVE9UWVBFXTtcbiAgICBmb3IgKHZhciBrZXlzID0gZ09QTihCYXNlQnVmZmVyKSwgaiA9IDAsIGtleTsga2V5cy5sZW5ndGggPiBqOykge1xuICAgICAgaWYgKCEoKGtleSA9IGtleXNbaisrXSkgaW4gJEFycmF5QnVmZmVyKSkgaGlkZSgkQXJyYXlCdWZmZXIsIGtleSwgQmFzZUJ1ZmZlcltrZXldKTtcbiAgICB9XG4gICAgaWYgKCFMSUJSQVJZKSBBcnJheUJ1ZmZlclByb3RvLmNvbnN0cnVjdG9yID0gJEFycmF5QnVmZmVyO1xuICB9XG4gIC8vIGlPUyBTYWZhcmkgNy54IGJ1Z1xuICB2YXIgdmlldyA9IG5ldyAkRGF0YVZpZXcobmV3ICRBcnJheUJ1ZmZlcigyKSk7XG4gIHZhciAkc2V0SW50OCA9ICREYXRhVmlld1tQUk9UT1RZUEVdLnNldEludDg7XG4gIHZpZXcuc2V0SW50OCgwLCAyMTQ3NDgzNjQ4KTtcbiAgdmlldy5zZXRJbnQ4KDEsIDIxNDc0ODM2NDkpO1xuICBpZiAodmlldy5nZXRJbnQ4KDApIHx8ICF2aWV3LmdldEludDgoMSkpIHJlZGVmaW5lQWxsKCREYXRhVmlld1tQUk9UT1RZUEVdLCB7XG4gICAgc2V0SW50ODogZnVuY3Rpb24gc2V0SW50OChieXRlT2Zmc2V0LCB2YWx1ZSkge1xuICAgICAgJHNldEludDguY2FsbCh0aGlzLCBieXRlT2Zmc2V0LCB2YWx1ZSA8PCAyNCA+PiAyNCk7XG4gICAgfSxcbiAgICBzZXRVaW50ODogZnVuY3Rpb24gc2V0VWludDgoYnl0ZU9mZnNldCwgdmFsdWUpIHtcbiAgICAgICRzZXRJbnQ4LmNhbGwodGhpcywgYnl0ZU9mZnNldCwgdmFsdWUgPDwgMjQgPj4gMjQpO1xuICAgIH1cbiAgfSwgdHJ1ZSk7XG59XG5zZXRUb1N0cmluZ1RhZygkQXJyYXlCdWZmZXIsIEFSUkFZX0JVRkZFUik7XG5zZXRUb1N0cmluZ1RhZygkRGF0YVZpZXcsIERBVEFfVklFVyk7XG5oaWRlKCREYXRhVmlld1tQUk9UT1RZUEVdLCAkdHlwZWQuVklFVywgdHJ1ZSk7XG5leHBvcnRzW0FSUkFZX0JVRkZFUl0gPSAkQXJyYXlCdWZmZXI7XG5leHBvcnRzW0RBVEFfVklFV10gPSAkRGF0YVZpZXc7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBUWVBFRCA9IHVpZCgndHlwZWRfYXJyYXknKTtcbnZhciBWSUVXID0gdWlkKCd2aWV3Jyk7XG52YXIgQUJWID0gISEoZ2xvYmFsLkFycmF5QnVmZmVyICYmIGdsb2JhbC5EYXRhVmlldyk7XG52YXIgQ09OU1RSID0gQUJWO1xudmFyIGkgPSAwO1xudmFyIGwgPSA5O1xudmFyIFR5cGVkO1xuXG52YXIgVHlwZWRBcnJheUNvbnN0cnVjdG9ycyA9IChcbiAgJ0ludDhBcnJheSxVaW50OEFycmF5LFVpbnQ4Q2xhbXBlZEFycmF5LEludDE2QXJyYXksVWludDE2QXJyYXksSW50MzJBcnJheSxVaW50MzJBcnJheSxGbG9hdDMyQXJyYXksRmxvYXQ2NEFycmF5J1xuKS5zcGxpdCgnLCcpO1xuXG53aGlsZSAoaSA8IGwpIHtcbiAgaWYgKFR5cGVkID0gZ2xvYmFsW1R5cGVkQXJyYXlDb25zdHJ1Y3RvcnNbaSsrXV0pIHtcbiAgICBoaWRlKFR5cGVkLnByb3RvdHlwZSwgVFlQRUQsIHRydWUpO1xuICAgIGhpZGUoVHlwZWQucHJvdG90eXBlLCBWSUVXLCB0cnVlKTtcbiAgfSBlbHNlIENPTlNUUiA9IGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQUJWOiBBQlYsXG4gIENPTlNUUjogQ09OU1RSLFxuICBUWVBFRDogVFlQRUQsXG4gIFZJRVc6IFZJRVdcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBuYXZpZ2F0b3IgPSBnbG9iYWwubmF2aWdhdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgVFlQRSkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSB8fCBpdC5fdCAhPT0gVFlQRSkgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgd2tzRXh0ID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyICRTeW1ib2wgPSBjb3JlLlN5bWJvbCB8fCAoY29yZS5TeW1ib2wgPSBMSUJSQVJZID8ge30gOiBnbG9iYWwuU3ltYm9sIHx8IHt9KTtcbiAgaWYgKG5hbWUuY2hhckF0KDApICE9ICdfJyAmJiAhKG5hbWUgaW4gJFN5bWJvbCkpIGRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHsgdmFsdWU6IHdrc0V4dC5mKG5hbWUpIH0pO1xufTtcbiIsImV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX3drcycpO1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCIvLyAyMi4xLjMuMyBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCBlbmQgPSB0aGlzLmxlbmd0aClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7IGNvcHlXaXRoaW46IHJlcXVpcmUoJy4vX2FycmF5LWNvcHktd2l0aGluJykgfSk7XG5cbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKCdjb3B5V2l0aGluJyk7XG4iLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7IGZpbGw6IHJlcXVpcmUoJy4vX2FycmF5LWZpbGwnKSB9KTtcblxucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoJ2ZpbGwnKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDIyLjEuMy45IEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkZmluZCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSg2KTtcbnZhciBLRVkgPSAnZmluZEluZGV4JztcbnZhciBmb3JjZWQgPSB0cnVlO1xuLy8gU2hvdWxkbid0IHNraXAgaG9sZXNcbmlmIChLRVkgaW4gW10pIEFycmF5KDEpW0tFWV0oZnVuY3Rpb24gKCkgeyBmb3JjZWQgPSBmYWxzZTsgfSk7XG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIGZvcmNlZCwgJ0FycmF5Jywge1xuICBmaW5kSW5kZXg6IGZ1bmN0aW9uIGZpbmRJbmRleChjYWxsYmFja2ZuIC8qICwgdGhhdCA9IHVuZGVmaW5lZCAqLykge1xuICAgIHJldHVybiAkZmluZCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoS0VZKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDIyLjEuMy44IEFycmF5LnByb3RvdHlwZS5maW5kKHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGZpbmQgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoNSk7XG52YXIgS0VZID0gJ2ZpbmQnO1xudmFyIGZvcmNlZCA9IHRydWU7XG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xuaWYgKEtFWSBpbiBbXSkgQXJyYXkoMSlbS0VZXShmdW5jdGlvbiAoKSB7IGZvcmNlZCA9IGZhbHNlOyB9KTtcbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZm9yY2VkLCAnQXJyYXknLCB7XG4gIGZpbmQ6IGZ1bmN0aW9uIGZpbmQoY2FsbGJhY2tmbiAvKiAsIHRoYXQgPSB1bmRlZmluZWQgKi8pIHtcbiAgICByZXR1cm4gJGZpbmQodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKEtFWSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UgLyogLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCAqLykge1xuICAgIHZhciBPID0gdG9PYmplY3QoYXJyYXlMaWtlKTtcbiAgICB2YXIgQyA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBtYXBmbiA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oTyk7XG4gICAgdmFyIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZiAobWFwcGluZykgbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZiAoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpIHtcbiAgICAgIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEMoKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yIChyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKTtcbnZhciBzdGVwID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIga2luZCA9IHRoaXMuX2s7XG4gIHZhciBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYgKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKSB7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcblxuLy8gV2ViS2l0IEFycmF5Lm9mIGlzbid0IGdlbmVyaWNcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEYoKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuICEoQXJyYXkub2YuY2FsbChGKSBpbnN0YW5jZW9mIEYpO1xufSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjMgQXJyYXkub2YoIC4uLml0ZW1zKVxuICBvZjogZnVuY3Rpb24gb2YoLyogLi4uYXJncyAqLykge1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpKGFMZW4pO1xuICAgIHdoaWxlIChhTGVuID4gaW5kZXgpIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGFMZW47XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIEZQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbnZhciBuYW1lUkUgPSAvXlxccypmdW5jdGlvbiAoW14gKF0qKS87XG52YXIgTkFNRSA9ICduYW1lJztcblxuLy8gMTkuMi40LjIgbmFtZVxuTkFNRSBpbiBGUHJvdG8gfHwgcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiBkUChGUHJvdG8sIE5BTUUsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICgnJyArIHRoaXMpLm1hdGNoKG5hbWVSRSlbMV07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBNQVAgPSAnTWFwJztcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoTUFQLCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgTUFQKSwga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpO1xuIiwiLy8gMjAuMi4yLjMgTWF0aC5hY29zaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBsb2cxcCA9IHJlcXVpcmUoJy4vX21hdGgtbG9nMXAnKTtcbnZhciBzcXJ0ID0gTWF0aC5zcXJ0O1xudmFyICRhY29zaCA9IE1hdGguYWNvc2g7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogISgkYWNvc2hcbiAgLy8gVjggYnVnOiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzUwOVxuICAmJiBNYXRoLmZsb29yKCRhY29zaChOdW1iZXIuTUFYX1ZBTFVFKSkgPT0gNzEwXG4gIC8vIFRvciBCcm93c2VyIGJ1ZzogTWF0aC5hY29zaChJbmZpbml0eSkgLT4gTmFOXG4gICYmICRhY29zaChJbmZpbml0eSkgPT0gSW5maW5pdHlcbiksICdNYXRoJywge1xuICBhY29zaDogZnVuY3Rpb24gYWNvc2goeCkge1xuICAgIHJldHVybiAoeCA9ICt4KSA8IDEgPyBOYU4gOiB4ID4gOTQ5MDYyNjUuNjI0MjUxNTZcbiAgICAgID8gTWF0aC5sb2coeCkgKyBNYXRoLkxOMlxuICAgICAgOiBsb2cxcCh4IC0gMSArIHNxcnQoeCAtIDEpICogc3FydCh4ICsgMSkpO1xuICB9XG59KTtcbiIsIi8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGFzaW5oID0gTWF0aC5hc2luaDtcblxuZnVuY3Rpb24gYXNpbmgoeCkge1xuICByZXR1cm4gIWlzRmluaXRlKHggPSAreCkgfHwgeCA9PSAwID8geCA6IHggPCAwID8gLWFzaW5oKC14KSA6IE1hdGgubG9nKHggKyBNYXRoLnNxcnQoeCAqIHggKyAxKSk7XG59XG5cbi8vIFRvciBCcm93c2VyIGJ1ZzogTWF0aC5hc2luaCgwKSAtPiAtMFxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKCRhc2luaCAmJiAxIC8gJGFzaW5oKDApID4gMCksICdNYXRoJywgeyBhc2luaDogYXNpbmggfSk7XG4iLCIvLyAyMC4yLjIuNyBNYXRoLmF0YW5oKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRhdGFuaCA9IE1hdGguYXRhbmg7XG5cbi8vIFRvciBCcm93c2VyIGJ1ZzogTWF0aC5hdGFuaCgtMCkgLT4gMFxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKCRhdGFuaCAmJiAxIC8gJGF0YW5oKC0wKSA8IDApLCAnTWF0aCcsIHtcbiAgYXRhbmg6IGZ1bmN0aW9uIGF0YW5oKHgpIHtcbiAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiBNYXRoLmxvZygoMSArIHgpIC8gKDEgLSB4KSkgLyAyO1xuICB9XG59KTtcbiIsIi8vIDIwLjIuMi45IE1hdGguY2JydCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBzaWduID0gcmVxdWlyZSgnLi9fbWF0aC1zaWduJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgY2JydDogZnVuY3Rpb24gY2JydCh4KSB7XG4gICAgcmV0dXJuIHNpZ24oeCA9ICt4KSAqIE1hdGgucG93KE1hdGguYWJzKHgpLCAxIC8gMyk7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMi4yLjExIE1hdGguY2x6MzIoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgY2x6MzI6IGZ1bmN0aW9uIGNsejMyKHgpIHtcbiAgICByZXR1cm4gKHggPj4+PSAwKSA/IDMxIC0gTWF0aC5mbG9vcihNYXRoLmxvZyh4ICsgMC41KSAqIE1hdGguTE9HMkUpIDogMzI7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMi4yLjEyIE1hdGguY29zaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBleHAgPSBNYXRoLmV4cDtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBjb3NoOiBmdW5jdGlvbiBjb3NoKHgpIHtcbiAgICByZXR1cm4gKGV4cCh4ID0gK3gpICsgZXhwKC14KSkgLyAyO1xuICB9XG59KTtcbiIsIi8vIDIwLjIuMi4xNCBNYXRoLmV4cG0xKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRleHBtMSA9IHJlcXVpcmUoJy4vX21hdGgtZXhwbTEnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoJGV4cG0xICE9IE1hdGguZXhwbTEpLCAnTWF0aCcsIHsgZXhwbTE6ICRleHBtMSB9KTtcbiIsIi8vIDIwLjIuMi4xNiBNYXRoLmZyb3VuZCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywgeyBmcm91bmQ6IHJlcXVpcmUoJy4vX21hdGgtZnJvdW5kJykgfSk7XG4iLCIvLyAyMC4yLjIuMTcgTWF0aC5oeXBvdChbdmFsdWUxWywgdmFsdWUyWywg4oCmIF1dXSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgYWJzID0gTWF0aC5hYnM7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgaHlwb3Q6IGZ1bmN0aW9uIGh5cG90KHZhbHVlMSwgdmFsdWUyKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgc3VtID0gMDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBsYXJnID0gMDtcbiAgICB2YXIgYXJnLCBkaXY7XG4gICAgd2hpbGUgKGkgPCBhTGVuKSB7XG4gICAgICBhcmcgPSBhYnMoYXJndW1lbnRzW2krK10pO1xuICAgICAgaWYgKGxhcmcgPCBhcmcpIHtcbiAgICAgICAgZGl2ID0gbGFyZyAvIGFyZztcbiAgICAgICAgc3VtID0gc3VtICogZGl2ICogZGl2ICsgMTtcbiAgICAgICAgbGFyZyA9IGFyZztcbiAgICAgIH0gZWxzZSBpZiAoYXJnID4gMCkge1xuICAgICAgICBkaXYgPSBhcmcgLyBsYXJnO1xuICAgICAgICBzdW0gKz0gZGl2ICogZGl2O1xuICAgICAgfSBlbHNlIHN1bSArPSBhcmc7XG4gICAgfVxuICAgIHJldHVybiBsYXJnID09PSBJbmZpbml0eSA/IEluZmluaXR5IDogbGFyZyAqIE1hdGguc3FydChzdW0pO1xuICB9XG59KTtcbiIsIi8vIDIwLjIuMi4xOCBNYXRoLmltdWwoeCwgeSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGltdWwgPSBNYXRoLmltdWw7XG5cbi8vIHNvbWUgV2ViS2l0IHZlcnNpb25zIGZhaWxzIHdpdGggYmlnIG51bWJlcnMsIHNvbWUgaGFzIHdyb25nIGFyaXR5XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gJGltdWwoMHhmZmZmZmZmZiwgNSkgIT0gLTUgfHwgJGltdWwubGVuZ3RoICE9IDI7XG59KSwgJ01hdGgnLCB7XG4gIGltdWw6IGZ1bmN0aW9uIGltdWwoeCwgeSkge1xuICAgIHZhciBVSU5UMTYgPSAweGZmZmY7XG4gICAgdmFyIHhuID0gK3g7XG4gICAgdmFyIHluID0gK3k7XG4gICAgdmFyIHhsID0gVUlOVDE2ICYgeG47XG4gICAgdmFyIHlsID0gVUlOVDE2ICYgeW47XG4gICAgcmV0dXJuIDAgfCB4bCAqIHlsICsgKChVSU5UMTYgJiB4biA+Pj4gMTYpICogeWwgKyB4bCAqIChVSU5UMTYgJiB5biA+Pj4gMTYpIDw8IDE2ID4+PiAwKTtcbiAgfVxufSk7XG4iLCIvLyAyMC4yLjIuMjEgTWF0aC5sb2cxMCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBsb2cxMDogZnVuY3Rpb24gbG9nMTAoeCkge1xuICAgIHJldHVybiBNYXRoLmxvZyh4KSAqIE1hdGguTE9HMTBFO1xuICB9XG59KTtcbiIsIi8vIDIwLjIuMi4yMCBNYXRoLmxvZzFwKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7IGxvZzFwOiByZXF1aXJlKCcuL19tYXRoLWxvZzFwJykgfSk7XG4iLCIvLyAyMC4yLjIuMjIgTWF0aC5sb2cyKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGxvZzI6IGZ1bmN0aW9uIGxvZzIoeCkge1xuICAgIHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGguTE4yO1xuICB9XG59KTtcbiIsIi8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHsgc2lnbjogcmVxdWlyZSgnLi9fbWF0aC1zaWduJykgfSk7XG4iLCIvLyAyMC4yLjIuMzAgTWF0aC5zaW5oKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGV4cG0xID0gcmVxdWlyZSgnLi9fbWF0aC1leHBtMScpO1xudmFyIGV4cCA9IE1hdGguZXhwO1xuXG4vLyBWOCBuZWFyIENocm9taXVtIDM4IGhhcyBhIHByb2JsZW0gd2l0aCB2ZXJ5IHNtYWxsIG51bWJlcnNcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAhTWF0aC5zaW5oKC0yZS0xNykgIT0gLTJlLTE3O1xufSksICdNYXRoJywge1xuICBzaW5oOiBmdW5jdGlvbiBzaW5oKHgpIHtcbiAgICByZXR1cm4gTWF0aC5hYnMoeCA9ICt4KSA8IDFcbiAgICAgID8gKGV4cG0xKHgpIC0gZXhwbTEoLXgpKSAvIDJcbiAgICAgIDogKGV4cCh4IC0gMSkgLSBleHAoLXggLSAxKSkgKiAoTWF0aC5FIC8gMik7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMi4yLjMzIE1hdGgudGFuaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBleHBtMSA9IHJlcXVpcmUoJy4vX21hdGgtZXhwbTEnKTtcbnZhciBleHAgPSBNYXRoLmV4cDtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICB0YW5oOiBmdW5jdGlvbiB0YW5oKHgpIHtcbiAgICB2YXIgYSA9IGV4cG0xKHggPSAreCk7XG4gICAgdmFyIGIgPSBleHBtMSgteCk7XG4gICAgcmV0dXJuIGEgPT0gSW5maW5pdHkgPyAxIDogYiA9PSBJbmZpbml0eSA/IC0xIDogKGEgLSBiKSAvIChleHAoeCkgKyBleHAoLXgpKTtcbiAgfVxufSk7XG4iLCIvLyAyMC4yLjIuMzQgTWF0aC50cnVuYyh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICB0cnVuYzogZnVuY3Rpb24gdHJ1bmMoaXQpIHtcbiAgICByZXR1cm4gKGl0ID4gMCA/IE1hdGguZmxvb3IgOiBNYXRoLmNlaWwpKGl0KTtcbiAgfVxufSk7XG4iLCIvLyAyMC4xLjIuMSBOdW1iZXIuRVBTSUxPTlxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7IEVQU0lMT046IE1hdGgucG93KDIsIC01MikgfSk7XG4iLCIvLyAyMC4xLjIuMiBOdW1iZXIuaXNGaW5pdGUobnVtYmVyKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBfaXNGaW5pdGUgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5pc0Zpbml0ZTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7XG4gIGlzRmluaXRlOiBmdW5jdGlvbiBpc0Zpbml0ZShpdCkge1xuICAgIHJldHVybiB0eXBlb2YgaXQgPT0gJ251bWJlcicgJiYgX2lzRmluaXRlKGl0KTtcbiAgfVxufSk7XG4iLCIvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywgeyBpc0ludGVnZXI6IHJlcXVpcmUoJy4vX2lzLWludGVnZXInKSB9KTtcbiIsIi8vIDIwLjEuMi40IE51bWJlci5pc05hTihudW1iZXIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtcbiAgaXNOYU46IGZ1bmN0aW9uIGlzTmFOKG51bWJlcikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICByZXR1cm4gbnVtYmVyICE9IG51bWJlcjtcbiAgfVxufSk7XG4iLCIvLyAyMC4xLjIuNSBOdW1iZXIuaXNTYWZlSW50ZWdlcihudW1iZXIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGlzSW50ZWdlciA9IHJlcXVpcmUoJy4vX2lzLWludGVnZXInKTtcbnZhciBhYnMgPSBNYXRoLmFicztcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7XG4gIGlzU2FmZUludGVnZXI6IGZ1bmN0aW9uIGlzU2FmZUludGVnZXIobnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzSW50ZWdlcihudW1iZXIpICYmIGFicyhudW1iZXIpIDw9IDB4MWZmZmZmZmZmZmZmZmY7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMS4yLjYgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywgeyBNQVhfU0FGRV9JTlRFR0VSOiAweDFmZmZmZmZmZmZmZmZmIH0pO1xuIiwiLy8gMjAuMS4yLjEwIE51bWJlci5NSU5fU0FGRV9JTlRFR0VSXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHsgTUlOX1NBRkVfSU5URUdFUjogLTB4MWZmZmZmZmZmZmZmZmYgfSk7XG4iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7IGFzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpIH0pO1xuIiwiLy8gMTkuMS4yLjUgT2JqZWN0LmZyZWV6ZShPKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgbWV0YSA9IHJlcXVpcmUoJy4vX21ldGEnKS5vbkZyZWV6ZTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdmcmVlemUnLCBmdW5jdGlvbiAoJGZyZWV6ZSkge1xuICByZXR1cm4gZnVuY3Rpb24gZnJlZXplKGl0KSB7XG4gICAgcmV0dXJuICRmcmVlemUgJiYgaXNPYmplY3QoaXQpID8gJGZyZWV6ZShtZXRhKGl0KSkgOiBpdDtcbiAgfTtcbn0pO1xuIiwiLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgfTtcbn0pO1xuIiwiLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnZ2V0T3duUHJvcGVydHlOYW1lcycsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpLmY7XG59KTtcbiIsIi8vIDE5LjEuMi45IE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgJGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2dldFByb3RvdHlwZU9mJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YoaXQpIHtcbiAgICByZXR1cm4gJGdldFByb3RvdHlwZU9mKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTtcbiIsIi8vIDE5LjEuMi4xMSBPYmplY3QuaXNFeHRlbnNpYmxlKE8pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdpc0V4dGVuc2libGUnLCBmdW5jdGlvbiAoJGlzRXh0ZW5zaWJsZSkge1xuICByZXR1cm4gZnVuY3Rpb24gaXNFeHRlbnNpYmxlKGl0KSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/ICRpc0V4dGVuc2libGUgPyAkaXNFeHRlbnNpYmxlKGl0KSA6IHRydWUgOiBmYWxzZTtcbiAgfTtcbn0pO1xuIiwiLy8gMTkuMS4yLjEyIE9iamVjdC5pc0Zyb3plbihPKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnaXNGcm96ZW4nLCBmdW5jdGlvbiAoJGlzRnJvemVuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBpc0Zyb3plbihpdCkge1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyAkaXNGcm96ZW4gPyAkaXNGcm96ZW4oaXQpIDogZmFsc2UgOiB0cnVlO1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjIuMTMgT2JqZWN0LmlzU2VhbGVkKE8pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdpc1NlYWxlZCcsIGZ1bmN0aW9uICgkaXNTZWFsZWQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlzU2VhbGVkKGl0KSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/ICRpc1NlYWxlZCA/ICRpc1NlYWxlZChpdCkgOiBmYWxzZSA6IHRydWU7XG4gIH07XG59KTtcbiIsIi8vIDE5LjEuMy4xMCBPYmplY3QuaXModmFsdWUxLCB2YWx1ZTIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IGlzOiByZXF1aXJlKCcuL19zYW1lLXZhbHVlJykgfSk7XG4iLCIvLyAxOS4xLjIuMTQgT2JqZWN0LmtleXMoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdrZXlzJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24ga2V5cyhpdCkge1xuICAgIHJldHVybiAka2V5cyh0b09iamVjdChpdCkpO1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjIuMTUgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKE8pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpLm9uRnJlZXplO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ3ByZXZlbnRFeHRlbnNpb25zJywgZnVuY3Rpb24gKCRwcmV2ZW50RXh0ZW5zaW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnMoaXQpIHtcbiAgICByZXR1cm4gJHByZXZlbnRFeHRlbnNpb25zICYmIGlzT2JqZWN0KGl0KSA/ICRwcmV2ZW50RXh0ZW5zaW9ucyhtZXRhKGl0KSkgOiBpdDtcbiAgfTtcbn0pO1xuIiwiLy8gMTkuMS4yLjE3IE9iamVjdC5zZWFsKE8pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpLm9uRnJlZXplO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ3NlYWwnLCBmdW5jdGlvbiAoJHNlYWwpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHNlYWwoaXQpIHtcbiAgICByZXR1cm4gJHNlYWwgJiYgaXNPYmplY3QoaXQpID8gJHNlYWwobWV0YShpdCkpIDogaXQ7XG4gIH07XG59KTtcbiIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IHNldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXQgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciB0YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldDtcbnZhciBtaWNyb3Rhc2sgPSByZXF1aXJlKCcuL19taWNyb3Rhc2snKSgpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xudmFyIHBlcmZvcm0gPSByZXF1aXJlKCcuL19wZXJmb3JtJyk7XG52YXIgcHJvbWlzZVJlc29sdmUgPSByZXF1aXJlKCcuL19wcm9taXNlLXJlc29sdmUnKTtcbnZhciBQUk9NSVNFID0gJ1Byb21pc2UnO1xudmFyIFR5cGVFcnJvciA9IGdsb2JhbC5UeXBlRXJyb3I7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyICRQcm9taXNlID0gZ2xvYmFsW1BST01JU0VdO1xudmFyIGlzTm9kZSA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xudmFyIGVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIEludGVybmFsLCBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIE93blByb21pc2VDYXBhYmlsaXR5LCBXcmFwcGVyO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUuZjtcblxudmFyIFVTRV9OQVRJVkUgPSAhIWZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICAvLyBjb3JyZWN0IHN1YmNsYXNzaW5nIHdpdGggQEBzcGVjaWVzIHN1cHBvcnRcbiAgICB2YXIgcHJvbWlzZSA9ICRQcm9taXNlLnJlc29sdmUoMSk7XG4gICAgdmFyIEZha2VQcm9taXNlID0gKHByb21pc2UuY29uc3RydWN0b3IgPSB7fSlbcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKV0gPSBmdW5jdGlvbiAoZXhlYykge1xuICAgICAgZXhlYyhlbXB0eSwgZW1wdHkpO1xuICAgIH07XG4gICAgLy8gdW5oYW5kbGVkIHJlamVjdGlvbnMgdHJhY2tpbmcgc3VwcG9ydCwgTm9kZUpTIFByb21pc2Ugd2l0aG91dCBpdCBmYWlscyBAQHNwZWNpZXMgdGVzdFxuICAgIHJldHVybiAoaXNOb2RlIHx8IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJykgJiYgcHJvbWlzZS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIEZha2VQcm9taXNlO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24gKHByb21pc2UsIGlzUmVqZWN0KSB7XG4gIGlmIChwcm9taXNlLl9uKSByZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIG9rID0gcHJvbWlzZS5fcyA9PSAxO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsO1xuICAgICAgdmFyIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlO1xuICAgICAgdmFyIHJlamVjdCA9IHJlYWN0aW9uLnJlamVjdDtcbiAgICAgIHZhciBkb21haW4gPSByZWFjdGlvbi5kb21haW47XG4gICAgICB2YXIgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICBpZiAocHJvbWlzZS5faCA9PSAyKSBvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFuZGxlciA9PT0gdHJ1ZSkgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoZG9tYWluKSBkb21haW4uZW50ZXIoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgICAgaWYgKGRvbWFpbikgZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSkge1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlIChjaGFpbi5sZW5ndGggPiBpKSBydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZiAoaXNSZWplY3QgJiYgIXByb21pc2UuX2gpIG9uVW5oYW5kbGVkKHByb21pc2UpO1xuICB9KTtcbn07XG52YXIgb25VbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdjtcbiAgICB2YXIgdW5oYW5kbGVkID0gaXNVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgdmFyIHJlc3VsdCwgaGFuZGxlciwgY29uc29sZTtcbiAgICBpZiAodW5oYW5kbGVkKSB7XG4gICAgICByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzTm9kZSkge1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pIHtcbiAgICAgICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBwcm9taXNlLl9oID0gaXNOb2RlIHx8IGlzVW5oYW5kbGVkKHByb21pc2UpID8gMiA6IDE7XG4gICAgfSBwcm9taXNlLl9hID0gdW5kZWZpbmVkO1xuICAgIGlmICh1bmhhbmRsZWQgJiYgcmVzdWx0LmUpIHRocm93IHJlc3VsdC52O1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICByZXR1cm4gcHJvbWlzZS5faCAhPT0gMSAmJiAocHJvbWlzZS5fYSB8fCBwcm9taXNlLl9jKS5sZW5ndGggPT09IDA7XG59O1xudmFyIG9uSGFuZGxlVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYW5kbGVyO1xuICAgIGlmIChpc05vZGUpIHtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBpZiAoaGFuZGxlciA9IGdsb2JhbC5vbnJlamVjdGlvbmhhbmRsZWQpIHtcbiAgICAgIGhhbmRsZXIoeyBwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHByb21pc2UuX3YgfSk7XG4gICAgfVxuICB9KTtcbn07XG52YXIgJHJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIGlmIChwcm9taXNlLl9kKSByZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICBwcm9taXNlLl9zID0gMjtcbiAgaWYgKCFwcm9taXNlLl9hKSBwcm9taXNlLl9hID0gcHJvbWlzZS5fYy5zbGljZSgpO1xuICBub3RpZnkocHJvbWlzZSwgdHJ1ZSk7XG59O1xudmFyICRyZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgdmFyIHRoZW47XG4gIGlmIChwcm9taXNlLl9kKSByZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHRocm93IFR5cGVFcnJvcihcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmXCIpO1xuICAgIGlmICh0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpIHtcbiAgICAgIG1pY3JvdGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0geyBfdzogcHJvbWlzZSwgX2Q6IGZhbHNlIH07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9taXNlLl92ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zID0gMTtcbiAgICAgIG5vdGlmeShwcm9taXNlLCBmYWxzZSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgJHJlamVjdC5jYWxsKHsgX3c6IHByb21pc2UsIF9kOiBmYWxzZSB9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYgKCFVU0VfTkFUSVZFKSB7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gICRQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcikge1xuICAgIGFuSW5zdGFuY2UodGhpcywgJFByb21pc2UsIFBST01JU0UsICdfaCcpO1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgSW50ZXJuYWwuY2FsbCh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCB0aGlzLCAxKSwgY3R4KCRyZWplY3QsIHRoaXMsIDEpKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICRyZWplY3QuY2FsbCh0aGlzLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIEludGVybmFsID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcikge1xuICAgIHRoaXMuX2MgPSBbXTsgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgdGhpcy5fYSA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgIHRoaXMuX3MgPSAwOyAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICB0aGlzLl9kID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICB0aGlzLl92ID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIHZhbHVlXG4gICAgdGhpcy5faCA9IDA7ICAgICAgICAgICAgICAvLyA8LSByZWplY3Rpb24gc3RhdGUsIDAgLSBkZWZhdWx0LCAxIC0gaGFuZGxlZCwgMiAtIHVuaGFuZGxlZFxuICAgIHRoaXMuX24gPSBmYWxzZTsgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gIH07XG4gIEludGVybmFsLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpKCRQcm9taXNlLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgICAgdmFyIHJlYWN0aW9uID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsICRQcm9taXNlKSk7XG4gICAgICByZWFjdGlvbi5vayA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCA9IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZDtcbiAgICAgIHJlYWN0aW9uLmRvbWFpbiA9IGlzTm9kZSA/IHByb2Nlc3MuZG9tYWluIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9hKSB0aGlzLl9hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYgKHRoaXMuX3MpIG5vdGlmeSh0aGlzLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcmVhY3Rpb24ucHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xuICBPd25Qcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBJbnRlcm5hbCgpO1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5yZXNvbHZlID0gY3R4KCRyZXNvbHZlLCBwcm9taXNlLCAxKTtcbiAgICB0aGlzLnJlamVjdCA9IGN0eCgkcmVqZWN0LCBwcm9taXNlLCAxKTtcbiAgfTtcbiAgbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUuZiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKEMpIHtcbiAgICByZXR1cm4gQyA9PT0gJFByb21pc2UgfHwgQyA9PT0gV3JhcHBlclxuICAgICAgPyBuZXcgT3duUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgIDogbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7IFByb21pc2U6ICRQcm9taXNlIH0pO1xucmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKSgkUHJvbWlzZSwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuL19zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NvcmUnKVtQUk9NSVNFXTtcblxuLy8gc3RhdGljc1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKSB7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKTtcbiAgICB2YXIgJCRyZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKExJQlJBUlkgfHwgIVVTRV9OQVRJVkUpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmUoTElCUkFSWSAmJiB0aGlzID09PSBXcmFwcGVyID8gJFByb21pc2UgOiB0aGlzLCB4KTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7XG4gICRQcm9taXNlLmFsbChpdGVyKVsnY2F0Y2gnXShlbXB0eSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKSB7XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gICAgdmFyIHJlc29sdmUgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgdmFyIHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICB2YXIgcmVtYWluaW5nID0gMTtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgdmFyICRpbmRleCA9IGluZGV4Kys7XG4gICAgICAgIHZhciBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIHZhbHVlcy5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgIHJlbWFpbmluZysrO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICBpZiAoYWxyZWFkeUNhbGxlZCkgcmV0dXJuO1xuICAgICAgICAgIGFscmVhZHlDYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIHZhbHVlc1skaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lKSByZWplY3QocmVzdWx0LnYpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGNhcGFiaWxpdHkucmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZXN1bHQuZSkgcmVqZWN0KHJlc3VsdC52KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiIsIi8vIDI2LjEuMSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciByQXBwbHkgPSAocmVxdWlyZSgnLi9fZ2xvYmFsJykuUmVmbGVjdCB8fCB7fSkuYXBwbHk7XG52YXIgZkFwcGx5ID0gRnVuY3Rpb24uYXBwbHk7XG4vLyBNUyBFZGdlIGFyZ3VtZW50c0xpc3QgYXJndW1lbnQgaXMgb3B0aW9uYWxcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByQXBwbHkoZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9KTtcbn0pLCAnUmVmbGVjdCcsIHtcbiAgYXBwbHk6IGZ1bmN0aW9uIGFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KSB7XG4gICAgdmFyIFQgPSBhRnVuY3Rpb24odGFyZ2V0KTtcbiAgICB2YXIgTCA9IGFuT2JqZWN0KGFyZ3VtZW50c0xpc3QpO1xuICAgIHJldHVybiByQXBwbHkgPyByQXBwbHkoVCwgdGhpc0FyZ3VtZW50LCBMKSA6IGZBcHBseS5jYWxsKFQsIHRoaXNBcmd1bWVudCwgTCk7XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS4yIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJndW1lbnRzTGlzdCBbLCBuZXdUYXJnZXRdKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vX2JpbmQnKTtcbnZhciByQ29uc3RydWN0ID0gKHJlcXVpcmUoJy4vX2dsb2JhbCcpLlJlZmxlY3QgfHwge30pLmNvbnN0cnVjdDtcblxuLy8gTVMgRWRnZSBzdXBwb3J0cyBvbmx5IDIgYXJndW1lbnRzIGFuZCBhcmd1bWVudHNMaXN0IGFyZ3VtZW50IGlzIG9wdGlvbmFsXG4vLyBGRiBOaWdodGx5IHNldHMgdGhpcmQgYXJndW1lbnQgYXMgYG5ldy50YXJnZXRgLCBidXQgZG9lcyBub3QgY3JlYXRlIGB0aGlzYCBmcm9tIGl0XG52YXIgTkVXX1RBUkdFVF9CVUcgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEYoKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuICEockNvbnN0cnVjdChmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0sIFtdLCBGKSBpbnN0YW5jZW9mIEYpO1xufSk7XG52YXIgQVJHU19CVUcgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICByQ29uc3RydWN0KGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfSk7XG59KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTkVXX1RBUkdFVF9CVUcgfHwgQVJHU19CVUcpLCAnUmVmbGVjdCcsIHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QoVGFyZ2V0LCBhcmdzIC8qICwgbmV3VGFyZ2V0ICovKSB7XG4gICAgYUZ1bmN0aW9uKFRhcmdldCk7XG4gICAgYW5PYmplY3QoYXJncyk7XG4gICAgdmFyIG5ld1RhcmdldCA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gVGFyZ2V0IDogYUZ1bmN0aW9uKGFyZ3VtZW50c1syXSk7XG4gICAgaWYgKEFSR1NfQlVHICYmICFORVdfVEFSR0VUX0JVRykgcmV0dXJuIHJDb25zdHJ1Y3QoVGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpO1xuICAgIGlmIChUYXJnZXQgPT0gbmV3VGFyZ2V0KSB7XG4gICAgICAvLyB3L28gYWx0ZXJlZCBuZXdUYXJnZXQsIG9wdGltaXphdGlvbiBmb3IgMC00IGFyZ3VtZW50c1xuICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgVGFyZ2V0KCk7XG4gICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBUYXJnZXQoYXJnc1swXSk7XG4gICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBUYXJnZXQoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgIGNhc2UgMzogcmV0dXJuIG5ldyBUYXJnZXQoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgIGNhc2UgNDogcmV0dXJuIG5ldyBUYXJnZXQoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gICAgICB9XG4gICAgICAvLyB3L28gYWx0ZXJlZCBuZXdUYXJnZXQsIGxvdCBvZiBhcmd1bWVudHMgY2FzZVxuICAgICAgdmFyICRhcmdzID0gW251bGxdO1xuICAgICAgJGFyZ3MucHVzaC5hcHBseSgkYXJncywgYXJncyk7XG4gICAgICByZXR1cm4gbmV3IChiaW5kLmFwcGx5KFRhcmdldCwgJGFyZ3MpKSgpO1xuICAgIH1cbiAgICAvLyB3aXRoIGFsdGVyZWQgbmV3VGFyZ2V0LCBub3Qgc3VwcG9ydCBidWlsdC1pbiBjb25zdHJ1Y3RvcnNcbiAgICB2YXIgcHJvdG8gPSBuZXdUYXJnZXQucHJvdG90eXBlO1xuICAgIHZhciBpbnN0YW5jZSA9IGNyZWF0ZShpc09iamVjdChwcm90bykgPyBwcm90byA6IE9iamVjdC5wcm90b3R5cGUpO1xuICAgIHZhciByZXN1bHQgPSBGdW5jdGlvbi5hcHBseS5jYWxsKFRhcmdldCwgaW5zdGFuY2UsIGFyZ3MpO1xuICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogaW5zdGFuY2U7XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS4zIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcylcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG5cbi8vIE1TIEVkZ2UgaGFzIGJyb2tlbiBSZWZsZWN0LmRlZmluZVByb3BlcnR5IC0gdGhyb3dpbmcgaW5zdGVhZCBvZiByZXR1cm5pbmcgZmFsc2VcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGRQLmYoe30sIDEsIHsgdmFsdWU6IDEgfSksIDEsIHsgdmFsdWU6IDIgfSk7XG59KSwgJ1JlZmxlY3QnLCB7XG4gIGRlZmluZVByb3BlcnR5OiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKSB7XG4gICAgYW5PYmplY3QodGFyZ2V0KTtcbiAgICBwcm9wZXJ0eUtleSA9IHRvUHJpbWl0aXZlKHByb3BlcnR5S2V5LCB0cnVlKTtcbiAgICBhbk9iamVjdChhdHRyaWJ1dGVzKTtcbiAgICB0cnkge1xuICAgICAgZFAuZih0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS40IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgZ09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZjtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGRlbGV0ZVByb3BlcnR5OiBmdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgdmFyIGRlc2MgPSBnT1BEKGFuT2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcbiAgICByZXR1cm4gZGVzYyAmJiAhZGVzYy5jb25maWd1cmFibGUgPyBmYWxzZSA6IGRlbGV0ZSB0YXJnZXRbcHJvcGVydHlLZXldO1xuICB9XG59KTtcbiIsIi8vIDI2LjEuNyBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KVxudmFyIGdPUEQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICByZXR1cm4gZ09QRC5mKGFuT2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcbiAgfVxufSk7XG4iLCIvLyAyNi4xLjggUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGdldFByb3RvID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgZ2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKHRhcmdldCkge1xuICAgIHJldHVybiBnZXRQcm90byhhbk9iamVjdCh0YXJnZXQpKTtcbiAgfVxufSk7XG4iLCIvLyAyNi4xLjYgUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSBbLCByZWNlaXZlcl0pXG52YXIgZ09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcblxuZnVuY3Rpb24gZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkgLyogLCByZWNlaXZlciAqLykge1xuICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXTtcbiAgdmFyIGRlc2MsIHByb3RvO1xuICBpZiAoYW5PYmplY3QodGFyZ2V0KSA9PT0gcmVjZWl2ZXIpIHJldHVybiB0YXJnZXRbcHJvcGVydHlLZXldO1xuICBpZiAoZGVzYyA9IGdPUEQuZih0YXJnZXQsIHByb3BlcnR5S2V5KSkgcmV0dXJuIGhhcyhkZXNjLCAndmFsdWUnKVxuICAgID8gZGVzYy52YWx1ZVxuICAgIDogZGVzYy5nZXQgIT09IHVuZGVmaW5lZFxuICAgICAgPyBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIGlmIChpc09iamVjdChwcm90byA9IGdldFByb3RvdHlwZU9mKHRhcmdldCkpKSByZXR1cm4gZ2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgcmVjZWl2ZXIpO1xufVxuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7IGdldDogZ2V0IH0pO1xuIiwiLy8gMjYuMS45IFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGhhczogZnVuY3Rpb24gaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICByZXR1cm4gcHJvcGVydHlLZXkgaW4gdGFyZ2V0O1xuICB9XG59KTtcbiIsIi8vIDI2LjEuMTAgUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyICRpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGlzRXh0ZW5zaWJsZTogZnVuY3Rpb24gaXNFeHRlbnNpYmxlKHRhcmdldCkge1xuICAgIGFuT2JqZWN0KHRhcmdldCk7XG4gICAgcmV0dXJuICRpc0V4dGVuc2libGUgPyAkaXNFeHRlbnNpYmxlKHRhcmdldCkgOiB0cnVlO1xuICB9XG59KTtcbiIsIi8vIDI2LjEuMTEgUmVmbGVjdC5vd25LZXlzKHRhcmdldClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHsgb3duS2V5czogcmVxdWlyZSgnLi9fb3duLWtleXMnKSB9KTtcbiIsIi8vIDI2LjEuMTIgUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgJHByZXZlbnRFeHRlbnNpb25zID0gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIHByZXZlbnRFeHRlbnNpb25zOiBmdW5jdGlvbiBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpIHtcbiAgICBhbk9iamVjdCh0YXJnZXQpO1xuICAgIHRyeSB7XG4gICAgICBpZiAoJHByZXZlbnRFeHRlbnNpb25zKSAkcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS4xNCBSZWZsZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHNldFByb3RvID0gcmVxdWlyZSgnLi9fc2V0LXByb3RvJyk7XG5cbmlmIChzZXRQcm90bykgJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBzZXRQcm90b3R5cGVPZjogZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bykge1xuICAgIHNldFByb3RvLmNoZWNrKHRhcmdldCwgcHJvdG8pO1xuICAgIHRyeSB7XG4gICAgICBzZXRQcm90by5zZXQodGFyZ2V0LCBwcm90byk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59KTtcbiIsIi8vIDI2LjEuMTMgUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgViBbLCByZWNlaXZlcl0pXG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBnT1BEID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5cbmZ1bmN0aW9uIHNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWIC8qICwgcmVjZWl2ZXIgKi8pIHtcbiAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDQgPyB0YXJnZXQgOiBhcmd1bWVudHNbM107XG4gIHZhciBvd25EZXNjID0gZ09QRC5mKGFuT2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcbiAgdmFyIGV4aXN0aW5nRGVzY3JpcHRvciwgcHJvdG87XG4gIGlmICghb3duRGVzYykge1xuICAgIGlmIChpc09iamVjdChwcm90byA9IGdldFByb3RvdHlwZU9mKHRhcmdldCkpKSB7XG4gICAgICByZXR1cm4gc2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgViwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgICBvd25EZXNjID0gY3JlYXRlRGVzYygwKTtcbiAgfVxuICBpZiAoaGFzKG93bkRlc2MsICd2YWx1ZScpKSB7XG4gICAgaWYgKG93bkRlc2Mud3JpdGFibGUgPT09IGZhbHNlIHx8ICFpc09iamVjdChyZWNlaXZlcikpIHJldHVybiBmYWxzZTtcbiAgICBleGlzdGluZ0Rlc2NyaXB0b3IgPSBnT1BELmYocmVjZWl2ZXIsIHByb3BlcnR5S2V5KSB8fCBjcmVhdGVEZXNjKDApO1xuICAgIGV4aXN0aW5nRGVzY3JpcHRvci52YWx1ZSA9IFY7XG4gICAgZFAuZihyZWNlaXZlciwgcHJvcGVydHlLZXksIGV4aXN0aW5nRGVzY3JpcHRvcik7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIG93bkRlc2Muc2V0ID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IChvd25EZXNjLnNldC5jYWxsKHJlY2VpdmVyLCBWKSwgdHJ1ZSk7XG59XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHsgc2V0OiBzZXQgfSk7XG4iLCIvLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFncygpXG5pZiAocmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAvLi9nLmZsYWdzICE9ICdnJykgcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZihSZWdFeHAucHJvdG90eXBlLCAnZmxhZ3MnLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiByZXF1aXJlKCcuL19mbGFncycpXG59KTtcbiIsIi8vIEBAbWF0Y2ggbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgnbWF0Y2gnLCAxLCBmdW5jdGlvbiAoZGVmaW5lZCwgTUFUQ0gsICRtYXRjaCkge1xuICAvLyAyMS4xLjMuMTEgU3RyaW5nLnByb3RvdHlwZS5tYXRjaChyZWdleHApXG4gIHJldHVybiBbZnVuY3Rpb24gbWF0Y2gocmVnZXhwKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPID0gZGVmaW5lZCh0aGlzKTtcbiAgICB2YXIgZm4gPSByZWdleHAgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcmVnZXhwW01BVENIXTtcbiAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZCA/IGZuLmNhbGwocmVnZXhwLCBPKSA6IG5ldyBSZWdFeHAocmVnZXhwKVtNQVRDSF0oU3RyaW5nKE8pKTtcbiAgfSwgJG1hdGNoXTtcbn0pO1xuIiwiLy8gQEByZXBsYWNlIGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ3JlcGxhY2UnLCAyLCBmdW5jdGlvbiAoZGVmaW5lZCwgUkVQTEFDRSwgJHJlcGxhY2UpIHtcbiAgLy8gMjEuMS4zLjE0IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZShzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKVxuICByZXR1cm4gW2Z1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyA9IGRlZmluZWQodGhpcyk7XG4gICAgdmFyIGZuID0gc2VhcmNoVmFsdWUgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc2VhcmNoVmFsdWVbUkVQTEFDRV07XG4gICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWRcbiAgICAgID8gZm4uY2FsbChzZWFyY2hWYWx1ZSwgTywgcmVwbGFjZVZhbHVlKVxuICAgICAgOiAkcmVwbGFjZS5jYWxsKFN0cmluZyhPKSwgc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSk7XG4gIH0sICRyZXBsYWNlXTtcbn0pO1xuIiwiLy8gQEBzZWFyY2ggbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgnc2VhcmNoJywgMSwgZnVuY3Rpb24gKGRlZmluZWQsIFNFQVJDSCwgJHNlYXJjaCkge1xuICAvLyAyMS4xLjMuMTUgU3RyaW5nLnByb3RvdHlwZS5zZWFyY2gocmVnZXhwKVxuICByZXR1cm4gW2Z1bmN0aW9uIHNlYXJjaChyZWdleHApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIE8gPSBkZWZpbmVkKHRoaXMpO1xuICAgIHZhciBmbiA9IHJlZ2V4cCA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiByZWdleHBbU0VBUkNIXTtcbiAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZCA/IGZuLmNhbGwocmVnZXhwLCBPKSA6IG5ldyBSZWdFeHAocmVnZXhwKVtTRUFSQ0hdKFN0cmluZyhPKSk7XG4gIH0sICRzZWFyY2hdO1xufSk7XG4iLCIvLyBAQHNwbGl0IGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ3NwbGl0JywgMiwgZnVuY3Rpb24gKGRlZmluZWQsIFNQTElULCAkc3BsaXQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgaXNSZWdFeHAgPSByZXF1aXJlKCcuL19pcy1yZWdleHAnKTtcbiAgdmFyIF9zcGxpdCA9ICRzcGxpdDtcbiAgdmFyICRwdXNoID0gW10ucHVzaDtcbiAgdmFyICRTUExJVCA9ICdzcGxpdCc7XG4gIHZhciBMRU5HVEggPSAnbGVuZ3RoJztcbiAgdmFyIExBU1RfSU5ERVggPSAnbGFzdEluZGV4JztcbiAgaWYgKFxuICAgICdhYmJjJ1skU1BMSVRdKC8oYikqLylbMV0gPT0gJ2MnIHx8XG4gICAgJ3Rlc3QnWyRTUExJVF0oLyg/OikvLCAtMSlbTEVOR1RIXSAhPSA0IHx8XG4gICAgJ2FiJ1skU1BMSVRdKC8oPzphYikqLylbTEVOR1RIXSAhPSAyIHx8XG4gICAgJy4nWyRTUExJVF0oLyguPykoLj8pLylbTEVOR1RIXSAhPSA0IHx8XG4gICAgJy4nWyRTUExJVF0oLygpKCkvKVtMRU5HVEhdID4gMSB8fFxuICAgICcnWyRTUExJVF0oLy4/LylbTEVOR1RIXVxuICApIHtcbiAgICB2YXIgTlBDRyA9IC8oKT8/Ly5leGVjKCcnKVsxXSA9PT0gdW5kZWZpbmVkOyAvLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cFxuICAgIC8vIGJhc2VkIG9uIGVzNS1zaGltIGltcGxlbWVudGF0aW9uLCBuZWVkIHRvIHJld29yayBpdFxuICAgICRzcGxpdCA9IGZ1bmN0aW9uIChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgICAgaWYgKHNlcGFyYXRvciA9PT0gdW5kZWZpbmVkICYmIGxpbWl0ID09PSAwKSByZXR1cm4gW107XG4gICAgICAvLyBJZiBgc2VwYXJhdG9yYCBpcyBub3QgYSByZWdleCwgdXNlIG5hdGl2ZSBzcGxpdFxuICAgICAgaWYgKCFpc1JlZ0V4cChzZXBhcmF0b3IpKSByZXR1cm4gX3NwbGl0LmNhbGwoc3RyaW5nLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgIHZhciBmbGFncyA9IChzZXBhcmF0b3IuaWdub3JlQ2FzZSA/ICdpJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLm11bHRpbGluZSA/ICdtJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLnVuaWNvZGUgPyAndScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5zdGlja3kgPyAneScgOiAnJyk7XG4gICAgICB2YXIgbGFzdExhc3RJbmRleCA9IDA7XG4gICAgICB2YXIgc3BsaXRMaW1pdCA9IGxpbWl0ID09PSB1bmRlZmluZWQgPyA0Mjk0OTY3Mjk1IDogbGltaXQgPj4+IDA7XG4gICAgICAvLyBNYWtlIGBnbG9iYWxgIGFuZCBhdm9pZCBgbGFzdEluZGV4YCBpc3N1ZXMgYnkgd29ya2luZyB3aXRoIGEgY29weVxuICAgICAgdmFyIHNlcGFyYXRvckNvcHkgPSBuZXcgUmVnRXhwKHNlcGFyYXRvci5zb3VyY2UsIGZsYWdzICsgJ2cnKTtcbiAgICAgIHZhciBzZXBhcmF0b3IyLCBtYXRjaCwgbGFzdEluZGV4LCBsYXN0TGVuZ3RoLCBpO1xuICAgICAgLy8gRG9lc24ndCBuZWVkIGZsYWdzIGd5LCBidXQgdGhleSBkb24ndCBodXJ0XG4gICAgICBpZiAoIU5QQ0cpIHNlcGFyYXRvcjIgPSBuZXcgUmVnRXhwKCdeJyArIHNlcGFyYXRvckNvcHkuc291cmNlICsgJyQoPyFcXFxccyknLCBmbGFncyk7XG4gICAgICB3aGlsZSAobWF0Y2ggPSBzZXBhcmF0b3JDb3B5LmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAvLyBgc2VwYXJhdG9yQ29weS5sYXN0SW5kZXhgIGlzIG5vdCByZWxpYWJsZSBjcm9zcy1icm93c2VyXG4gICAgICAgIGxhc3RJbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF1bTEVOR1RIXTtcbiAgICAgICAgaWYgKGxhc3RJbmRleCA+IGxhc3RMYXN0SW5kZXgpIHtcbiAgICAgICAgICBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCwgbWF0Y2guaW5kZXgpKTtcbiAgICAgICAgICAvLyBGaXggYnJvd3NlcnMgd2hvc2UgYGV4ZWNgIG1ldGhvZHMgZG9uJ3QgY29uc2lzdGVudGx5IHJldHVybiBgdW5kZWZpbmVkYCBmb3IgTlBDR1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb29wLWZ1bmNcbiAgICAgICAgICBpZiAoIU5QQ0cgJiYgbWF0Y2hbTEVOR1RIXSA+IDEpIG1hdGNoWzBdLnJlcGxhY2Uoc2VwYXJhdG9yMiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IGFyZ3VtZW50c1tMRU5HVEhdIC0gMjsgaSsrKSBpZiAoYXJndW1lbnRzW2ldID09PSB1bmRlZmluZWQpIG1hdGNoW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChtYXRjaFtMRU5HVEhdID4gMSAmJiBtYXRjaC5pbmRleCA8IHN0cmluZ1tMRU5HVEhdKSAkcHVzaC5hcHBseShvdXRwdXQsIG1hdGNoLnNsaWNlKDEpKTtcbiAgICAgICAgICBsYXN0TGVuZ3RoID0gbWF0Y2hbMF1bTEVOR1RIXTtcbiAgICAgICAgICBsYXN0TGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICAgIGlmIChvdXRwdXRbTEVOR1RIXSA+PSBzcGxpdExpbWl0KSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VwYXJhdG9yQ29weVtMQVNUX0lOREVYXSA9PT0gbWF0Y2guaW5kZXgpIHNlcGFyYXRvckNvcHlbTEFTVF9JTkRFWF0rKzsgLy8gQXZvaWQgYW4gaW5maW5pdGUgbG9vcFxuICAgICAgfVxuICAgICAgaWYgKGxhc3RMYXN0SW5kZXggPT09IHN0cmluZ1tMRU5HVEhdKSB7XG4gICAgICAgIGlmIChsYXN0TGVuZ3RoIHx8ICFzZXBhcmF0b3JDb3B5LnRlc3QoJycpKSBvdXRwdXQucHVzaCgnJyk7XG4gICAgICB9IGVsc2Ugb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgIHJldHVybiBvdXRwdXRbTEVOR1RIXSA+IHNwbGl0TGltaXQgPyBvdXRwdXQuc2xpY2UoMCwgc3BsaXRMaW1pdCkgOiBvdXRwdXQ7XG4gICAgfTtcbiAgLy8gQ2hha3JhLCBWOFxuICB9IGVsc2UgaWYgKCcwJ1skU1BMSVRdKHVuZGVmaW5lZCwgMClbTEVOR1RIXSkge1xuICAgICRzcGxpdCA9IGZ1bmN0aW9uIChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICByZXR1cm4gc2VwYXJhdG9yID09PSB1bmRlZmluZWQgJiYgbGltaXQgPT09IDAgPyBbXSA6IF9zcGxpdC5jYWxsKHRoaXMsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgIH07XG4gIH1cbiAgLy8gMjEuMS4zLjE3IFN0cmluZy5wcm90b3R5cGUuc3BsaXQoc2VwYXJhdG9yLCBsaW1pdClcbiAgcmV0dXJuIFtmdW5jdGlvbiBzcGxpdChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgdmFyIE8gPSBkZWZpbmVkKHRoaXMpO1xuICAgIHZhciBmbiA9IHNlcGFyYXRvciA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZXBhcmF0b3JbU1BMSVRdO1xuICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkID8gZm4uY2FsbChzZXBhcmF0b3IsIE8sIGxpbWl0KSA6ICRzcGxpdC5jYWxsKFN0cmluZyhPKSwgc2VwYXJhdG9yLCBsaW1pdCk7XG4gIH0sICRzcGxpdF07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIFNFVCA9ICdTZXQnO1xuXG4vLyAyMy4yIFNldCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKShTRVQsIGZ1bmN0aW9uIChnZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIFNldCgpIHsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSkge1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHZhbGlkYXRlKHRoaXMsIFNFVCksIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykoZmFsc2UpO1xuJGV4cG9ydCgkZXhwb3J0LlAsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy4zIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQocG9zKVxuICBjb2RlUG9pbnRBdDogZnVuY3Rpb24gY29kZVBvaW50QXQocG9zKSB7XG4gICAgcmV0dXJuICRhdCh0aGlzLCBwb3MpO1xuICB9XG59KTtcbiIsIi8vIDIxLjEuMy42IFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgoc2VhcmNoU3RyaW5nIFssIGVuZFBvc2l0aW9uXSlcbid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjb250ZXh0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWNvbnRleHQnKTtcbnZhciBFTkRTX1dJVEggPSAnZW5kc1dpdGgnO1xudmFyICRlbmRzV2l0aCA9ICcnW0VORFNfV0lUSF07XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMtaXMtcmVnZXhwJykoRU5EU19XSVRIKSwgJ1N0cmluZycsIHtcbiAgZW5kc1dpdGg6IGZ1bmN0aW9uIGVuZHNXaXRoKHNlYXJjaFN0cmluZyAvKiAsIGVuZFBvc2l0aW9uID0gQGxlbmd0aCAqLykge1xuICAgIHZhciB0aGF0ID0gY29udGV4dCh0aGlzLCBzZWFyY2hTdHJpbmcsIEVORFNfV0lUSCk7XG4gICAgdmFyIGVuZFBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIGxlbiA9IHRvTGVuZ3RoKHRoYXQubGVuZ3RoKTtcbiAgICB2YXIgZW5kID0gZW5kUG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IGxlbiA6IE1hdGgubWluKHRvTGVuZ3RoKGVuZFBvc2l0aW9uKSwgbGVuKTtcbiAgICB2YXIgc2VhcmNoID0gU3RyaW5nKHNlYXJjaFN0cmluZyk7XG4gICAgcmV0dXJuICRlbmRzV2l0aFxuICAgICAgPyAkZW5kc1dpdGguY2FsbCh0aGF0LCBzZWFyY2gsIGVuZClcbiAgICAgIDogdGhhdC5zbGljZShlbmQgLSBzZWFyY2gubGVuZ3RoLCBlbmQpID09PSBzZWFyY2g7XG4gIH1cbn0pO1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xudmFyIGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG52YXIgJGZyb21Db2RlUG9pbnQgPSBTdHJpbmcuZnJvbUNvZGVQb2ludDtcblxuLy8gbGVuZ3RoIHNob3VsZCBiZSAxLCBvbGQgRkYgcHJvYmxlbVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoISEkZnJvbUNvZGVQb2ludCAmJiAkZnJvbUNvZGVQb2ludC5sZW5ndGggIT0gMSksICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMi4yIFN0cmluZy5mcm9tQ29kZVBvaW50KC4uLmNvZGVQb2ludHMpXG4gIGZyb21Db2RlUG9pbnQ6IGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoeCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGNvZGU7XG4gICAgd2hpbGUgKGFMZW4gPiBpKSB7XG4gICAgICBjb2RlID0gK2FyZ3VtZW50c1tpKytdO1xuICAgICAgaWYgKHRvQWJzb2x1dGVJbmRleChjb2RlLCAweDEwZmZmZikgIT09IGNvZGUpIHRocm93IFJhbmdlRXJyb3IoY29kZSArICcgaXMgbm90IGEgdmFsaWQgY29kZSBwb2ludCcpO1xuICAgICAgcmVzLnB1c2goY29kZSA8IDB4MTAwMDBcbiAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcbiAgICAgICAgOiBmcm9tQ2hhckNvZGUoKChjb2RlIC09IDB4MTAwMDApID4+IDEwKSArIDB4ZDgwMCwgY29kZSAlIDB4NDAwICsgMHhkYzAwKVxuICAgICAgKTtcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XG4gIH1cbn0pO1xuIiwiLy8gMjEuMS4zLjcgU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyhzZWFyY2hTdHJpbmcsIHBvc2l0aW9uID0gMClcbid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgY29udGV4dCA9IHJlcXVpcmUoJy4vX3N0cmluZy1jb250ZXh0Jyk7XG52YXIgSU5DTFVERVMgPSAnaW5jbHVkZXMnO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzLWlzLXJlZ2V4cCcpKElOQ0xVREVTKSwgJ1N0cmluZycsIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKHNlYXJjaFN0cmluZyAvKiAsIHBvc2l0aW9uID0gMCAqLykge1xuICAgIHJldHVybiAhIX5jb250ZXh0KHRoaXMsIHNlYXJjaFN0cmluZywgSU5DTFVERVMpXG4gICAgICAuaW5kZXhPZihzZWFyY2hTdHJpbmcsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4yLjQgU3RyaW5nLnJhdyhjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucylcbiAgcmF3OiBmdW5jdGlvbiByYXcoY2FsbFNpdGUpIHtcbiAgICB2YXIgdHBsID0gdG9JT2JqZWN0KGNhbGxTaXRlLnJhdyk7XG4gICAgdmFyIGxlbiA9IHRvTGVuZ3RoKHRwbC5sZW5ndGgpO1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgcmVzID0gW107XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChsZW4gPiBpKSB7XG4gICAgICByZXMucHVzaChTdHJpbmcodHBsW2krK10pKTtcbiAgICAgIGlmIChpIDwgYUxlbikgcmVzLnB1c2goU3RyaW5nKGFyZ3VtZW50c1tpXSkpO1xuICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcbiAgfVxufSk7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjEzIFN0cmluZy5wcm90b3R5cGUucmVwZWF0KGNvdW50KVxuICByZXBlYXQ6IHJlcXVpcmUoJy4vX3N0cmluZy1yZXBlYXQnKVxufSk7XG4iLCIvLyAyMS4xLjMuMTggU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyBbLCBwb3NpdGlvbiBdKVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNvbnRleHQgPSByZXF1aXJlKCcuL19zdHJpbmctY29udGV4dCcpO1xudmFyIFNUQVJUU19XSVRIID0gJ3N0YXJ0c1dpdGgnO1xudmFyICRzdGFydHNXaXRoID0gJydbU1RBUlRTX1dJVEhdO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzLWlzLXJlZ2V4cCcpKFNUQVJUU19XSVRIKSwgJ1N0cmluZycsIHtcbiAgc3RhcnRzV2l0aDogZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgLyogLCBwb3NpdGlvbiA9IDAgKi8pIHtcbiAgICB2YXIgdGhhdCA9IGNvbnRleHQodGhpcywgc2VhcmNoU3RyaW5nLCBTVEFSVFNfV0lUSCk7XG4gICAgdmFyIGluZGV4ID0gdG9MZW5ndGgoTWF0aC5taW4oYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIHRoYXQubGVuZ3RoKSk7XG4gICAgdmFyIHNlYXJjaCA9IFN0cmluZyhzZWFyY2hTdHJpbmcpO1xuICAgIHJldHVybiAkc3RhcnRzV2l0aFxuICAgICAgPyAkc3RhcnRzV2l0aC5jYWxsKHRoYXQsIHNlYXJjaCwgaW5kZXgpXG4gICAgICA6IHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoLmxlbmd0aCkgPT09IHNlYXJjaDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgTUVUQSA9IHJlcXVpcmUoJy4vX21ldGEnKS5LRVk7XG52YXIgJGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG52YXIgd2tzRXh0ID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpO1xudmFyIHdrc0RlZmluZSA9IHJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKTtcbnZhciBlbnVtS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL19pcy1hcnJheScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIF9jcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZ09QTkV4dCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpO1xudmFyICRHT1BEID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKTtcbnZhciAkRFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QRCA9ICRHT1BELmY7XG52YXIgZFAgPSAkRFAuZjtcbnZhciBnT1BOID0gZ09QTkV4dC5mO1xudmFyICRTeW1ib2wgPSBnbG9iYWwuU3ltYm9sO1xudmFyICRKU09OID0gZ2xvYmFsLkpTT047XG52YXIgX3N0cmluZ2lmeSA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcbnZhciBISURERU4gPSB3a3MoJ19oaWRkZW4nKTtcbnZhciBUT19QUklNSVRJVkUgPSB3a3MoJ3RvUHJpbWl0aXZlJyk7XG52YXIgaXNFbnVtID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG52YXIgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpO1xudmFyIEFsbFN5bWJvbHMgPSBzaGFyZWQoJ3N5bWJvbHMnKTtcbnZhciBPUFN5bWJvbHMgPSBzaGFyZWQoJ29wLXN5bWJvbHMnKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdFtQUk9UT1RZUEVdO1xudmFyIFVTRV9OQVRJVkUgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xudmFyIFFPYmplY3QgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gX2NyZWF0ZShkUCh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkUCh0aGlzLCAnYScsIHsgdmFsdWU6IDcgfSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbiAoaXQsIGtleSwgRCkge1xuICB2YXIgcHJvdG9EZXNjID0gZ09QRChPYmplY3RQcm90bywga2V5KTtcbiAgaWYgKHByb3RvRGVzYykgZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIGRQKGl0LCBrZXksIEQpO1xuICBpZiAocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bykgZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbiAodGFnKSB7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2xbUFJPVE9UWVBFXSk7XG4gIHN5bS5fayA9IHRhZztcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IFVTRV9OQVRJVkUgJiYgdHlwZW9mICRTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKSB7XG4gIGlmIChpdCA9PT0gT2JqZWN0UHJvdG8pICRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmIChoYXMoQWxsU3ltYm9scywga2V5KSkge1xuICAgIGlmICghRC5lbnVtZXJhYmxlKSB7XG4gICAgICBpZiAoIWhhcyhpdCwgSElEREVOKSkgZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pIGl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwgeyBlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKSB9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBkUChpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKSB7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbCA9IGtleXMubGVuZ3RoO1xuICB2YXIga2V5O1xuICB3aGlsZSAobCA+IGkpICRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApIHtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpIHtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV0gPyBFIDogdHJ1ZTtcbn07XG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gIGl0ID0gdG9JT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSkgcmV0dXJuO1xuICB2YXIgRCA9IGdPUEQoaXQsIGtleSk7XG4gIGlmIChEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpIEQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgdmFyIG5hbWVzID0gZ09QTih0b0lPYmplY3QoaXQpKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaSA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSB7XG4gICAgaWYgKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTiAmJiBrZXkgIT0gTUVUQSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSB7XG4gIHZhciBJU19PUCA9IGl0ID09PSBPYmplY3RQcm90bztcbiAgdmFyIG5hbWVzID0gZ09QTihJU19PUCA/IE9QU3ltYm9scyA6IHRvSU9iamVjdChpdCkpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIHtcbiAgICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKSByZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmICghVVNFX05BVElWRSkge1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCkgdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzID09PSBPYmplY3RQcm90bykgJHNldC5jYWxsKE9QU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYgKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpIHRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYgKERFU0NSSVBUT1JTICYmIHNldHRlcikgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0IH0pO1xuICAgIHJldHVybiB3cmFwKHRhZyk7XG4gIH07XG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFXSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gICRHT1BELmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkRFAuZiA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpLmYgPSAkZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmIChERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi9fbGlicmFyeScpKSB7XG4gICAgcmVkZWZpbmUoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cblxuICB3a3NFeHQuZiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgcmV0dXJuIHdyYXAod2tzKG5hbWUpKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgeyBTeW1ib2w6ICRTeW1ib2wgfSk7XG5cbmZvciAodmFyIGVzNlN5bWJvbHMgPSAoXG4gIC8vIDE5LjQuMi4yLCAxOS40LjIuMywgMTkuNC4yLjQsIDE5LjQuMi42LCAxOS40LjIuOCwgMTkuNC4yLjksIDE5LjQuMi4xMCwgMTkuNC4yLjExLCAxOS40LjIuMTIsIDE5LjQuMi4xMywgMTkuNC4yLjE0XG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbikuc3BsaXQoJywnKSwgaiA9IDA7IGVzNlN5bWJvbHMubGVuZ3RoID4gajspd2tzKGVzNlN5bWJvbHNbaisrXSk7XG5cbmZvciAodmFyIHdlbGxLbm93blN5bWJvbHMgPSAka2V5cyh3a3Muc3RvcmUpLCBrID0gMDsgd2VsbEtub3duU3ltYm9scy5sZW5ndGggPiBrOykgd2tzRGVmaW5lKHdlbGxLbm93blN5bWJvbHNbaysrXSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdTeW1ib2wnLCB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioc3ltKSB7XG4gICAgaWYgKCFpc1N5bWJvbChzeW0pKSB0aHJvdyBUeXBlRXJyb3Ioc3ltICsgJyBpcyBub3QgYSBzeW1ib2whJyk7XG4gICAgZm9yICh2YXIga2V5IGluIFN5bWJvbFJlZ2lzdHJ5KSBpZiAoU3ltYm9sUmVnaXN0cnlba2V5XSA9PT0gc3ltKSByZXR1cm4ga2V5O1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uICgpIHsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbiAoKSB7IHNldHRlciA9IGZhbHNlOyB9XG59KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICRjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogJGRlZmluZVByb3BlcnR5LFxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiAkZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgJGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoeyBhOiBTIH0pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCkge1xuICAgIHZhciBhcmdzID0gW2l0XTtcbiAgICB2YXIgaSA9IDE7XG4gICAgdmFyIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgICRyZXBsYWNlciA9IHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZiAoIWlzT2JqZWN0KHJlcGxhY2VyKSAmJiBpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSkgcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgaWYgKCFpc0FycmF5KHJlcGxhY2VyKSkgcmVwbGFjZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiAkcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykgdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gICAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xuICB9XG59KTtcblxuLy8gMTkuNC4zLjQgU3ltYm9sLnByb3RvdHlwZVtAQHRvUHJpbWl0aXZlXShoaW50KVxuJFN5bWJvbFtQUk9UT1RZUEVdW1RPX1BSSU1JVElWRV0gfHwgcmVxdWlyZSgnLi9faGlkZScpKCRTeW1ib2xbUFJPVE9UWVBFXSwgVE9fUFJJTUlUSVZFLCAkU3ltYm9sW1BST1RPVFlQRV0udmFsdWVPZik7XG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkdHlwZWQgPSByZXF1aXJlKCcuL190eXBlZCcpO1xudmFyIGJ1ZmZlciA9IHJlcXVpcmUoJy4vX3R5cGVkLWJ1ZmZlcicpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5BcnJheUJ1ZmZlcjtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgJEFycmF5QnVmZmVyID0gYnVmZmVyLkFycmF5QnVmZmVyO1xudmFyICREYXRhVmlldyA9IGJ1ZmZlci5EYXRhVmlldztcbnZhciAkaXNWaWV3ID0gJHR5cGVkLkFCViAmJiBBcnJheUJ1ZmZlci5pc1ZpZXc7XG52YXIgJHNsaWNlID0gJEFycmF5QnVmZmVyLnByb3RvdHlwZS5zbGljZTtcbnZhciBWSUVXID0gJHR5cGVkLlZJRVc7XG52YXIgQVJSQVlfQlVGRkVSID0gJ0FycmF5QnVmZmVyJztcblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAoQXJyYXlCdWZmZXIgIT09ICRBcnJheUJ1ZmZlciksIHsgQXJyYXlCdWZmZXI6ICRBcnJheUJ1ZmZlciB9KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhJHR5cGVkLkNPTlNUUiwgQVJSQVlfQlVGRkVSLCB7XG4gIC8vIDI0LjEuMy4xIEFycmF5QnVmZmVyLmlzVmlldyhhcmcpXG4gIGlzVmlldzogZnVuY3Rpb24gaXNWaWV3KGl0KSB7XG4gICAgcmV0dXJuICRpc1ZpZXcgJiYgJGlzVmlldyhpdCkgfHwgaXNPYmplY3QoaXQpICYmIFZJRVcgaW4gaXQ7XG4gIH1cbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuVSArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gIW5ldyAkQXJyYXlCdWZmZXIoMikuc2xpY2UoMSwgdW5kZWZpbmVkKS5ieXRlTGVuZ3RoO1xufSksIEFSUkFZX0JVRkZFUiwge1xuICAvLyAyNC4xLjQuMyBBcnJheUJ1ZmZlci5wcm90b3R5cGUuc2xpY2Uoc3RhcnQsIGVuZClcbiAgc2xpY2U6IGZ1bmN0aW9uIHNsaWNlKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoJHNsaWNlICE9PSB1bmRlZmluZWQgJiYgZW5kID09PSB1bmRlZmluZWQpIHJldHVybiAkc2xpY2UuY2FsbChhbk9iamVjdCh0aGlzKSwgc3RhcnQpOyAvLyBGRiBmaXhcbiAgICB2YXIgbGVuID0gYW5PYmplY3QodGhpcykuYnl0ZUxlbmd0aDtcbiAgICB2YXIgZmlyc3QgPSB0b0Fic29sdXRlSW5kZXgoc3RhcnQsIGxlbik7XG4gICAgdmFyIGZpbmFsID0gdG9BYnNvbHV0ZUluZGV4KGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogZW5kLCBsZW4pO1xuICAgIHZhciByZXN1bHQgPSBuZXcgKHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkQXJyYXlCdWZmZXIpKSh0b0xlbmd0aChmaW5hbCAtIGZpcnN0KSk7XG4gICAgdmFyIHZpZXdTID0gbmV3ICREYXRhVmlldyh0aGlzKTtcbiAgICB2YXIgdmlld1QgPSBuZXcgJERhdGFWaWV3KHJlc3VsdCk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB3aGlsZSAoZmlyc3QgPCBmaW5hbCkge1xuICAgICAgdmlld1Quc2V0VWludDgoaW5kZXgrKywgdmlld1MuZ2V0VWludDgoZmlyc3QrKykpO1xuICAgIH0gcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG5cbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoQVJSQVlfQlVGRkVSKTtcbiIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ0Zsb2F0MzInLCA0LCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gRmxvYXQzMkFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTtcbiIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ0Zsb2F0NjQnLCA4LCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gRmxvYXQ2NEFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTtcbiIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ0ludDE2JywgMiwgZnVuY3Rpb24gKGluaXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIEludDE2QXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pO1xuIiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnSW50MzInLCA0LCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gSW50MzJBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7XG4iLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdJbnQ4JywgMSwgZnVuY3Rpb24gKGluaXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIEludDhBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7XG4iLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdVaW50MTYnLCAyLCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gVWludDE2QXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pO1xuIiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnVWludDMyJywgNCwgZnVuY3Rpb24gKGluaXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIFVpbnQzMkFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTtcbiIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ1VpbnQ4JywgMSwgZnVuY3Rpb24gKGluaXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIFVpbnQ4QXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pO1xuIiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnVWludDgnLCAxLCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gVWludDhDbGFtcGVkQXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0sIHRydWUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGVhY2ggPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMCk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIG1ldGEgPSByZXF1aXJlKCcuL19tZXRhJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpO1xudmFyIHdlYWsgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXdlYWsnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBXRUFLX01BUCA9ICdXZWFrTWFwJztcbnZhciBnZXRXZWFrID0gbWV0YS5nZXRXZWFrO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGU7XG52YXIgdW5jYXVnaHRGcm96ZW5TdG9yZSA9IHdlYWsudWZzdG9yZTtcbnZhciB0bXAgPSB7fTtcbnZhciBJbnRlcm5hbE1hcDtcblxudmFyIHdyYXBwZXIgPSBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBXZWFrTWFwKCkge1xuICAgIHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpO1xuICB9O1xufTtcblxudmFyIG1ldGhvZHMgPSB7XG4gIC8vIDIzLjMuMy4zIFdlYWtNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIGlmIChpc09iamVjdChrZXkpKSB7XG4gICAgICB2YXIgZGF0YSA9IGdldFdlYWsoa2V5KTtcbiAgICAgIGlmIChkYXRhID09PSB0cnVlKSByZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZSh2YWxpZGF0ZSh0aGlzLCBXRUFLX01BUCkpLmdldChrZXkpO1xuICAgICAgcmV0dXJuIGRhdGEgPyBkYXRhW3RoaXMuX2ldIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgfSxcbiAgLy8gMjMuMy4zLjUgV2Vha01hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gd2Vhay5kZWYodmFsaWRhdGUodGhpcywgV0VBS19NQVApLCBrZXksIHZhbHVlKTtcbiAgfVxufTtcblxuLy8gMjMuMyBXZWFrTWFwIE9iamVjdHNcbnZhciAkV2Vha01hcCA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKFdFQUtfTUFQLCB3cmFwcGVyLCBtZXRob2RzLCB3ZWFrLCB0cnVlLCB0cnVlKTtcblxuLy8gSUUxMSBXZWFrTWFwIGZyb3plbiBrZXlzIGZpeFxuaWYgKGZhaWxzKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyAkV2Vha01hcCgpLnNldCgoT2JqZWN0LmZyZWV6ZSB8fCBPYmplY3QpKHRtcCksIDcpLmdldCh0bXApICE9IDc7IH0pKSB7XG4gIEludGVybmFsTWFwID0gd2Vhay5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBXRUFLX01BUCk7XG4gIGFzc2lnbihJbnRlcm5hbE1hcC5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICBtZXRhLk5FRUQgPSB0cnVlO1xuICBlYWNoKFsnZGVsZXRlJywgJ2hhcycsICdnZXQnLCAnc2V0J10sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgcHJvdG8gPSAkV2Vha01hcC5wcm90b3R5cGU7XG4gICAgdmFyIG1ldGhvZCA9IHByb3RvW2tleV07XG4gICAgcmVkZWZpbmUocHJvdG8sIGtleSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIC8vIHN0b3JlIGZyb3plbiBvYmplY3RzIG9uIGludGVybmFsIHdlYWttYXAgc2hpbVxuICAgICAgaWYgKGlzT2JqZWN0KGEpICYmICFpc0V4dGVuc2libGUoYSkpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9mKSB0aGlzLl9mID0gbmV3IEludGVybmFsTWFwKCk7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9mW2tleV0oYSwgYik7XG4gICAgICAgIHJldHVybiBrZXkgPT0gJ3NldCcgPyB0aGlzIDogcmVzdWx0O1xuICAgICAgLy8gc3RvcmUgYWxsIHRoZSByZXN0IG9uIG5hdGl2ZSB3ZWFrbWFwXG4gICAgICB9IHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCBhLCBiKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG52YXIgd2VhayA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24td2VhaycpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIFdFQUtfU0VUID0gJ1dlYWtTZXQnO1xuXG4vLyAyMy40IFdlYWtTZXQgT2JqZWN0c1xucmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKFdFQUtfU0VULCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBXZWFrU2V0KCkgeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuNC4zLjEgV2Vha1NldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSkge1xuICAgIHJldHVybiB3ZWFrLmRlZih2YWxpZGF0ZSh0aGlzLCBXRUFLX1NFVCksIHZhbHVlLCB0cnVlKTtcbiAgfVxufSwgd2VhaywgZmFsc2UsIHRydWUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRpbmNsdWRlcyA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykodHJ1ZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7XG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhlbCAvKiAsIGZyb21JbmRleCA9IDAgKi8pIHtcbiAgICByZXR1cm4gJGluY2x1ZGVzKHRoaXMsIGVsLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuXG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKSgnaW5jbHVkZXMnKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLW9iamVjdC12YWx1ZXMtZW50cmllc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkZW50cmllcyA9IHJlcXVpcmUoJy4vX29iamVjdC10by1hcnJheScpKHRydWUpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtcbiAgZW50cmllczogZnVuY3Rpb24gZW50cmllcyhpdCkge1xuICAgIHJldHVybiAkZW50cmllcyhpdCk7XG4gIH1cbn0pO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvcnNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgb3duS2V5cyA9IHJlcXVpcmUoJy4vX293bi1rZXlzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGdPUEQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gICAgdmFyIGdldERlc2MgPSBnT1BELmY7XG4gICAgdmFyIGtleXMgPSBvd25LZXlzKE8pO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGtleSwgZGVzYztcbiAgICB3aGlsZSAoa2V5cy5sZW5ndGggPiBpKSB7XG4gICAgICBkZXNjID0gZ2V0RGVzYyhPLCBrZXkgPSBrZXlzW2krK10pO1xuICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCkgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2MpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLW9iamVjdC12YWx1ZXMtZW50cmllc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkdmFsdWVzID0gcmVxdWlyZSgnLi9fb2JqZWN0LXRvLWFycmF5JykoZmFsc2UpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtcbiAgdmFsdWVzOiBmdW5jdGlvbiB2YWx1ZXMoaXQpIHtcbiAgICByZXR1cm4gJHZhbHVlcyhpdCk7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtc3RyaW5nLXBhZC1zdGFydC1lbmRcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJHBhZCA9IHJlcXVpcmUoJy4vX3N0cmluZy1wYWQnKTtcbnZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuL191c2VyLWFnZW50Jyk7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8yODBcbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogL1ZlcnNpb25cXC8xMFxcLlxcZCsoXFwuXFxkKyk/IFNhZmFyaVxcLy8udGVzdCh1c2VyQWdlbnQpLCAnU3RyaW5nJywge1xuICBwYWRFbmQ6IGZ1bmN0aW9uIHBhZEVuZChtYXhMZW5ndGggLyogLCBmaWxsU3RyaW5nID0gJyAnICovKSB7XG4gICAgcmV0dXJuICRwYWQodGhpcywgbWF4TGVuZ3RoLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgZmFsc2UpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXN0cmluZy1wYWQtc3RhcnQtZW5kXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRwYWQgPSByZXF1aXJlKCcuL19zdHJpbmctcGFkJyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi9fdXNlci1hZ2VudCcpO1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMjgwXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIC9WZXJzaW9uXFwvMTBcXC5cXGQrKFxcLlxcZCspPyBTYWZhcmlcXC8vLnRlc3QodXNlckFnZW50KSwgJ1N0cmluZycsIHtcbiAgcGFkU3RhcnQ6IGZ1bmN0aW9uIHBhZFN0YXJ0KG1heExlbmd0aCAvKiAsIGZpbGxTdHJpbmcgPSAnICcgKi8pIHtcbiAgICByZXR1cm4gJHBhZCh0aGlzLCBtYXhMZW5ndGgsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCB0cnVlKTtcbiAgfVxufSk7XG4iLCJ2YXIgJGl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG52YXIgSVRFUkFUT1IgPSB3a3MoJ2l0ZXJhdG9yJyk7XG52YXIgVE9fU1RSSU5HX1RBRyA9IHdrcygndG9TdHJpbmdUYWcnKTtcbnZhciBBcnJheVZhbHVlcyA9IEl0ZXJhdG9ycy5BcnJheTtcblxudmFyIERPTUl0ZXJhYmxlcyA9IHtcbiAgQ1NTUnVsZUxpc3Q6IHRydWUsIC8vIFRPRE86IE5vdCBzcGVjIGNvbXBsaWFudCwgc2hvdWxkIGJlIGZhbHNlLlxuICBDU1NTdHlsZURlY2xhcmF0aW9uOiBmYWxzZSxcbiAgQ1NTVmFsdWVMaXN0OiBmYWxzZSxcbiAgQ2xpZW50UmVjdExpc3Q6IGZhbHNlLFxuICBET01SZWN0TGlzdDogZmFsc2UsXG4gIERPTVN0cmluZ0xpc3Q6IGZhbHNlLFxuICBET01Ub2tlbkxpc3Q6IHRydWUsXG4gIERhdGFUcmFuc2Zlckl0ZW1MaXN0OiBmYWxzZSxcbiAgRmlsZUxpc3Q6IGZhbHNlLFxuICBIVE1MQWxsQ29sbGVjdGlvbjogZmFsc2UsXG4gIEhUTUxDb2xsZWN0aW9uOiBmYWxzZSxcbiAgSFRNTEZvcm1FbGVtZW50OiBmYWxzZSxcbiAgSFRNTFNlbGVjdEVsZW1lbnQ6IGZhbHNlLFxuICBNZWRpYUxpc3Q6IHRydWUsIC8vIFRPRE86IE5vdCBzcGVjIGNvbXBsaWFudCwgc2hvdWxkIGJlIGZhbHNlLlxuICBNaW1lVHlwZUFycmF5OiBmYWxzZSxcbiAgTmFtZWROb2RlTWFwOiBmYWxzZSxcbiAgTm9kZUxpc3Q6IHRydWUsXG4gIFBhaW50UmVxdWVzdExpc3Q6IGZhbHNlLFxuICBQbHVnaW46IGZhbHNlLFxuICBQbHVnaW5BcnJheTogZmFsc2UsXG4gIFNWR0xlbmd0aExpc3Q6IGZhbHNlLFxuICBTVkdOdW1iZXJMaXN0OiBmYWxzZSxcbiAgU1ZHUGF0aFNlZ0xpc3Q6IGZhbHNlLFxuICBTVkdQb2ludExpc3Q6IGZhbHNlLFxuICBTVkdTdHJpbmdMaXN0OiBmYWxzZSxcbiAgU1ZHVHJhbnNmb3JtTGlzdDogZmFsc2UsXG4gIFNvdXJjZUJ1ZmZlckxpc3Q6IGZhbHNlLFxuICBTdHlsZVNoZWV0TGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIFRleHRUcmFja0N1ZUxpc3Q6IGZhbHNlLFxuICBUZXh0VHJhY2tMaXN0OiBmYWxzZSxcbiAgVG91Y2hMaXN0OiBmYWxzZVxufTtcblxuZm9yICh2YXIgY29sbGVjdGlvbnMgPSBnZXRLZXlzKERPTUl0ZXJhYmxlcyksIGkgPSAwOyBpIDwgY29sbGVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgdmFyIE5BTUUgPSBjb2xsZWN0aW9uc1tpXTtcbiAgdmFyIGV4cGxpY2l0ID0gRE9NSXRlcmFibGVzW05BTUVdO1xuICB2YXIgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXTtcbiAgdmFyIHByb3RvID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgdmFyIGtleTtcbiAgaWYgKHByb3RvKSB7XG4gICAgaWYgKCFwcm90b1tJVEVSQVRPUl0pIGhpZGUocHJvdG8sIElURVJBVE9SLCBBcnJheVZhbHVlcyk7XG4gICAgaWYgKCFwcm90b1tUT19TVFJJTkdfVEFHXSkgaGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gICAgSXRlcmF0b3JzW05BTUVdID0gQXJyYXlWYWx1ZXM7XG4gICAgaWYgKGV4cGxpY2l0KSBmb3IgKGtleSBpbiAkaXRlcmF0b3JzKSBpZiAoIXByb3RvW2tleV0pIHJlZGVmaW5lKHByb3RvLCBrZXksICRpdGVyYXRvcnNba2V5XSwgdHJ1ZSk7XG4gIH1cbn1cbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJHRhc2sgPSByZXF1aXJlKCcuL190YXNrJyk7XG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuQiwge1xuICBzZXRJbW1lZGlhdGU6ICR0YXNrLnNldCxcbiAgY2xlYXJJbW1lZGlhdGU6ICR0YXNrLmNsZWFyXG59KTtcbiIsIi8vIGllOS0gc2V0VGltZW91dCAmIHNldEludGVydmFsIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmaXhcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi9fdXNlci1hZ2VudCcpO1xudmFyIHNsaWNlID0gW10uc2xpY2U7XG52YXIgTVNJRSA9IC9NU0lFIC5cXC4vLnRlc3QodXNlckFnZW50KTsgLy8gPC0gZGlydHkgaWU5LSBjaGVja1xudmFyIHdyYXAgPSBmdW5jdGlvbiAoc2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZm4sIHRpbWUgLyogLCAuLi5hcmdzICovKSB7XG4gICAgdmFyIGJvdW5kQXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIHZhciBhcmdzID0gYm91bmRBcmdzID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogZmFsc2U7XG4gICAgcmV0dXJuIHNldChib3VuZEFyZ3MgPyBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICAgICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pKS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9IDogZm4sIHRpbWUpO1xuICB9O1xufTtcbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5CICsgJGV4cG9ydC5GICogTVNJRSwge1xuICBzZXRUaW1lb3V0OiB3cmFwKGdsb2JhbC5zZXRUaW1lb3V0KSxcbiAgc2V0SW50ZXJ2YWw6IHdyYXAoZ2xvYmFsLnNldEludGVydmFsKVxufSk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4hKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcbiAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG4gICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcbiAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcbiAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcbiAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG4gICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGdsb2JhbC5wcm9jZXNzID09PSBcIm9iamVjdFwiICYmIGdsb2JhbC5wcm9jZXNzLmRvbWFpbikge1xuICAgICAgaW52b2tlID0gZ2xvYmFsLnByb2Nlc3MuZG9tYWluLmJpbmQoaW52b2tlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBydW50aW1lLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4gIC8vIEFtb25nIHRoZSB2YXJpb3VzIHRyaWNrcyBmb3Igb2J0YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWxcbiAgLy8gb2JqZWN0LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHRlY2huaXF1ZSB0aGF0IGRvZXMgbm90XG4gIC8vIHVzZSBpbmRpcmVjdCBldmFsICh3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSkuXG4gIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOlxuICB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDpcbiAgdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgPyBzZWxmIDogdGhpc1xuKTtcbiIsIi8qISBWZWxvY2l0eUpTLm9yZyAoMS41LjIpLiAoQykgMjAxNCBKdWxpYW4gU2hhcGlyby4gTUlUIEBsaWNlbnNlOiBlbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UgKi9cbi8qISBWZWxvY2l0eUpTLm9yZyBqUXVlcnkgU2hpbSAoMS4wLjEpLiAoQykgMjAxNCBUaGUgalF1ZXJ5IEZvdW5kYXRpb24uIE1JVCBAbGljZW5zZTogZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlLiAqL1xuIWZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYSl7dmFyIGI9YS5sZW5ndGgsZD1jLnR5cGUoYSk7cmV0dXJuXCJmdW5jdGlvblwiIT09ZCYmIWMuaXNXaW5kb3coYSkmJighKDEhPT1hLm5vZGVUeXBlfHwhYil8fChcImFycmF5XCI9PT1kfHwwPT09Ynx8XCJudW1iZXJcIj09dHlwZW9mIGImJmI+MCYmYi0xIGluIGEpKX1pZighYS5qUXVlcnkpe3ZhciBjPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBjLmZuLmluaXQoYSxiKX07Yy5pc1dpbmRvdz1mdW5jdGlvbihhKXtyZXR1cm4gYSYmYT09PWEud2luZG93fSxjLnR5cGU9ZnVuY3Rpb24oYSl7cmV0dXJuIGE/XCJvYmplY3RcIj09dHlwZW9mIGF8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGE/ZVtnLmNhbGwoYSldfHxcIm9iamVjdFwiOnR5cGVvZiBhOmErXCJcIn0sYy5pc0FycmF5PUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKGEpe3JldHVyblwiYXJyYXlcIj09PWMudHlwZShhKX0sYy5pc1BsYWluT2JqZWN0PWZ1bmN0aW9uKGEpe3ZhciBiO2lmKCFhfHxcIm9iamVjdFwiIT09Yy50eXBlKGEpfHxhLm5vZGVUeXBlfHxjLmlzV2luZG93KGEpKXJldHVybiExO3RyeXtpZihhLmNvbnN0cnVjdG9yJiYhZi5jYWxsKGEsXCJjb25zdHJ1Y3RvclwiKSYmIWYuY2FsbChhLmNvbnN0cnVjdG9yLnByb3RvdHlwZSxcImlzUHJvdG90eXBlT2ZcIikpcmV0dXJuITF9Y2F0Y2goZCl7cmV0dXJuITF9Zm9yKGIgaW4gYSk7cmV0dXJuIGI9PT11bmRlZmluZWR8fGYuY2FsbChhLGIpfSxjLmVhY2g9ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPTAsZj1hLmxlbmd0aCxnPWIoYSk7aWYoZCl7aWYoZylmb3IoO2U8ZiYmITEhPT1jLmFwcGx5KGFbZV0sZCk7ZSsrKTtlbHNlIGZvcihlIGluIGEpaWYoYS5oYXNPd25Qcm9wZXJ0eShlKSYmITE9PT1jLmFwcGx5KGFbZV0sZCkpYnJlYWt9ZWxzZSBpZihnKWZvcig7ZTxmJiYhMSE9PWMuY2FsbChhW2VdLGUsYVtlXSk7ZSsrKTtlbHNlIGZvcihlIGluIGEpaWYoYS5oYXNPd25Qcm9wZXJ0eShlKSYmITE9PT1jLmNhbGwoYVtlXSxlLGFbZV0pKWJyZWFrO3JldHVybiBhfSxjLmRhdGE9ZnVuY3Rpb24oYSxiLGUpe2lmKGU9PT11bmRlZmluZWQpe3ZhciBmPWFbYy5leHBhbmRvXSxnPWYmJmRbZl07aWYoYj09PXVuZGVmaW5lZClyZXR1cm4gZztpZihnJiZiIGluIGcpcmV0dXJuIGdbYl19ZWxzZSBpZihiIT09dW5kZWZpbmVkKXt2YXIgaD1hW2MuZXhwYW5kb118fChhW2MuZXhwYW5kb109KytjLnV1aWQpO3JldHVybiBkW2hdPWRbaF18fHt9LGRbaF1bYl09ZSxlfX0sYy5yZW1vdmVEYXRhPWZ1bmN0aW9uKGEsYil7dmFyIGU9YVtjLmV4cGFuZG9dLGY9ZSYmZFtlXTtmJiYoYj9jLmVhY2goYixmdW5jdGlvbihhLGIpe2RlbGV0ZSBmW2JdfSk6ZGVsZXRlIGRbZV0pfSxjLmV4dGVuZD1mdW5jdGlvbigpe3ZhciBhLGIsZCxlLGYsZyxoPWFyZ3VtZW50c1swXXx8e30saT0xLGo9YXJndW1lbnRzLmxlbmd0aCxrPSExO2ZvcihcImJvb2xlYW5cIj09dHlwZW9mIGgmJihrPWgsaD1hcmd1bWVudHNbaV18fHt9LGkrKyksXCJvYmplY3RcIiE9dHlwZW9mIGgmJlwiZnVuY3Rpb25cIiE9PWMudHlwZShoKSYmKGg9e30pLGk9PT1qJiYoaD10aGlzLGktLSk7aTxqO2krKylpZihmPWFyZ3VtZW50c1tpXSlmb3IoZSBpbiBmKWYuaGFzT3duUHJvcGVydHkoZSkmJihhPWhbZV0sZD1mW2VdLGghPT1kJiYoayYmZCYmKGMuaXNQbGFpbk9iamVjdChkKXx8KGI9Yy5pc0FycmF5KGQpKSk/KGI/KGI9ITEsZz1hJiZjLmlzQXJyYXkoYSk/YTpbXSk6Zz1hJiZjLmlzUGxhaW5PYmplY3QoYSk/YTp7fSxoW2VdPWMuZXh0ZW5kKGssZyxkKSk6ZCE9PXVuZGVmaW5lZCYmKGhbZV09ZCkpKTtyZXR1cm4gaH0sYy5xdWV1ZT1mdW5jdGlvbihhLGQsZSl7aWYoYSl7ZD0oZHx8XCJmeFwiKStcInF1ZXVlXCI7dmFyIGY9Yy5kYXRhKGEsZCk7cmV0dXJuIGU/KCFmfHxjLmlzQXJyYXkoZSk/Zj1jLmRhdGEoYSxkLGZ1bmN0aW9uKGEsYyl7dmFyIGQ9Y3x8W107cmV0dXJuIGEmJihiKE9iamVjdChhKSk/ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9K2IubGVuZ3RoLGQ9MCxlPWEubGVuZ3RoO2Q8YzspYVtlKytdPWJbZCsrXTtpZihjIT09Yylmb3IoO2JbZF0hPT11bmRlZmluZWQ7KWFbZSsrXT1iW2QrK107YS5sZW5ndGg9ZX0oZCxcInN0cmluZ1wiPT10eXBlb2YgYT9bYV06YSk6W10ucHVzaC5jYWxsKGQsYSkpLGR9KGUpKTpmLnB1c2goZSksZik6Znx8W119fSxjLmRlcXVldWU9ZnVuY3Rpb24oYSxiKXtjLmVhY2goYS5ub2RlVHlwZT9bYV06YSxmdW5jdGlvbihhLGQpe2I9Ynx8XCJmeFwiO3ZhciBlPWMucXVldWUoZCxiKSxmPWUuc2hpZnQoKTtcImlucHJvZ3Jlc3NcIj09PWYmJihmPWUuc2hpZnQoKSksZiYmKFwiZnhcIj09PWImJmUudW5zaGlmdChcImlucHJvZ3Jlc3NcIiksZi5jYWxsKGQsZnVuY3Rpb24oKXtjLmRlcXVldWUoZCxiKX0pKX0pfSxjLmZuPWMucHJvdG90eXBlPXtpbml0OmZ1bmN0aW9uKGEpe2lmKGEubm9kZVR5cGUpcmV0dXJuIHRoaXNbMF09YSx0aGlzO3Rocm93IG5ldyBFcnJvcihcIk5vdCBhIERPTSBub2RlLlwiKX0sb2Zmc2V0OmZ1bmN0aW9uKCl7dmFyIGI9dGhpc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3Q/dGhpc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTp7dG9wOjAsbGVmdDowfTtyZXR1cm57dG9wOmIudG9wKyhhLnBhZ2VZT2Zmc2V0fHxkb2N1bWVudC5zY3JvbGxUb3B8fDApLShkb2N1bWVudC5jbGllbnRUb3B8fDApLGxlZnQ6Yi5sZWZ0KyhhLnBhZ2VYT2Zmc2V0fHxkb2N1bWVudC5zY3JvbGxMZWZ0fHwwKS0oZG9jdW1lbnQuY2xpZW50TGVmdHx8MCl9fSxwb3NpdGlvbjpmdW5jdGlvbigpe3ZhciBhPXRoaXNbMF0sYj1mdW5jdGlvbihhKXtmb3IodmFyIGI9YS5vZmZzZXRQYXJlbnQ7YiYmXCJodG1sXCIhPT1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJmIuc3R5bGUmJlwic3RhdGljXCI9PT1iLnN0eWxlLnBvc2l0aW9uLnRvTG93ZXJDYXNlKCk7KWI9Yi5vZmZzZXRQYXJlbnQ7cmV0dXJuIGJ8fGRvY3VtZW50fShhKSxkPXRoaXMub2Zmc2V0KCksZT0vXig/OmJvZHl8aHRtbCkkL2kudGVzdChiLm5vZGVOYW1lKT97dG9wOjAsbGVmdDowfTpjKGIpLm9mZnNldCgpO3JldHVybiBkLnRvcC09cGFyc2VGbG9hdChhLnN0eWxlLm1hcmdpblRvcCl8fDAsZC5sZWZ0LT1wYXJzZUZsb2F0KGEuc3R5bGUubWFyZ2luTGVmdCl8fDAsYi5zdHlsZSYmKGUudG9wKz1wYXJzZUZsb2F0KGIuc3R5bGUuYm9yZGVyVG9wV2lkdGgpfHwwLGUubGVmdCs9cGFyc2VGbG9hdChiLnN0eWxlLmJvcmRlckxlZnRXaWR0aCl8fDApLHt0b3A6ZC50b3AtZS50b3AsbGVmdDpkLmxlZnQtZS5sZWZ0fX19O3ZhciBkPXt9O2MuZXhwYW5kbz1cInZlbG9jaXR5XCIrKG5ldyBEYXRlKS5nZXRUaW1lKCksYy51dWlkPTA7Zm9yKHZhciBlPXt9LGY9ZS5oYXNPd25Qcm9wZXJ0eSxnPWUudG9TdHJpbmcsaD1cIkJvb2xlYW4gTnVtYmVyIFN0cmluZyBGdW5jdGlvbiBBcnJheSBEYXRlIFJlZ0V4cCBPYmplY3QgRXJyb3JcIi5zcGxpdChcIiBcIiksaT0wO2k8aC5sZW5ndGg7aSsrKWVbXCJbb2JqZWN0IFwiK2hbaV0rXCJdXCJdPWhbaV0udG9Mb3dlckNhc2UoKTtjLmZuLmluaXQucHJvdG90eXBlPWMuZm4sYS5WZWxvY2l0eT17VXRpbGl0aWVzOmN9fX0od2luZG93KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YSgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoYSk6YSgpfShmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO3JldHVybiBmdW5jdGlvbihhLGIsYyxkKXtmdW5jdGlvbiBlKGEpe2Zvcih2YXIgYj0tMSxjPWE/YS5sZW5ndGg6MCxkPVtdOysrYjxjOyl7dmFyIGU9YVtiXTtlJiZkLnB1c2goZSl9cmV0dXJuIGR9ZnVuY3Rpb24gZihhKXtyZXR1cm4gdS5pc1dyYXBwZWQoYSk/YT1zLmNhbGwoYSk6dS5pc05vZGUoYSkmJihhPVthXSksYX1mdW5jdGlvbiBnKGEpe3ZhciBiPW8uZGF0YShhLFwidmVsb2NpdHlcIik7cmV0dXJuIG51bGw9PT1iP2Q6Yn1mdW5jdGlvbiBoKGEsYil7dmFyIGM9ZyhhKTtjJiZjLmRlbGF5VGltZXImJiFjLmRlbGF5UGF1c2VkJiYoYy5kZWxheVJlbWFpbmluZz1jLmRlbGF5LWIrYy5kZWxheUJlZ2luLGMuZGVsYXlQYXVzZWQ9ITAsY2xlYXJUaW1lb3V0KGMuZGVsYXlUaW1lci5zZXRUaW1lb3V0KSl9ZnVuY3Rpb24gaShhLGIpe3ZhciBjPWcoYSk7YyYmYy5kZWxheVRpbWVyJiZjLmRlbGF5UGF1c2VkJiYoYy5kZWxheVBhdXNlZD0hMSxjLmRlbGF5VGltZXIuc2V0VGltZW91dD1zZXRUaW1lb3V0KGMuZGVsYXlUaW1lci5uZXh0LGMuZGVsYXlSZW1haW5pbmcpKX1mdW5jdGlvbiBqKGEpe3JldHVybiBmdW5jdGlvbihiKXtyZXR1cm4gTWF0aC5yb3VuZChiKmEpKigxL2EpfX1mdW5jdGlvbiBrKGEsYyxkLGUpe2Z1bmN0aW9uIGYoYSxiKXtyZXR1cm4gMS0zKmIrMyphfWZ1bmN0aW9uIGcoYSxiKXtyZXR1cm4gMypiLTYqYX1mdW5jdGlvbiBoKGEpe3JldHVybiAzKmF9ZnVuY3Rpb24gaShhLGIsYyl7cmV0dXJuKChmKGIsYykqYStnKGIsYykpKmEraChiKSkqYX1mdW5jdGlvbiBqKGEsYixjKXtyZXR1cm4gMypmKGIsYykqYSphKzIqZyhiLGMpKmEraChiKX1mdW5jdGlvbiBrKGIsYyl7Zm9yKHZhciBlPTA7ZTxwOysrZSl7dmFyIGY9aihjLGEsZCk7aWYoMD09PWYpcmV0dXJuIGM7Yy09KGkoYyxhLGQpLWIpL2Z9cmV0dXJuIGN9ZnVuY3Rpb24gbCgpe2Zvcih2YXIgYj0wO2I8dDsrK2IpeFtiXT1pKGIqdSxhLGQpfWZ1bmN0aW9uIG0oYixjLGUpe3ZhciBmLGcsaD0wO2Rve2c9YysoZS1jKS8yLGY9aShnLGEsZCktYixmPjA/ZT1nOmM9Z313aGlsZShNYXRoLmFicyhmKT5yJiYrK2g8cyk7cmV0dXJuIGd9ZnVuY3Rpb24gbihiKXtmb3IodmFyIGM9MCxlPTEsZj10LTE7ZSE9PWYmJnhbZV08PWI7KytlKWMrPXU7LS1lO3ZhciBnPShiLXhbZV0pLyh4W2UrMV0teFtlXSksaD1jK2cqdSxpPWooaCxhLGQpO3JldHVybiBpPj1xP2soYixoKTowPT09aT9oOm0oYixjLGMrdSl9ZnVuY3Rpb24gbygpe3k9ITAsYT09PWMmJmQ9PT1lfHxsKCl9dmFyIHA9NCxxPS4wMDEscj0xZS03LHM9MTAsdD0xMSx1PTEvKHQtMSksdj1cIkZsb2F0MzJBcnJheVwiaW4gYjtpZig0IT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4hMTtmb3IodmFyIHc9MDt3PDQ7Kyt3KWlmKFwibnVtYmVyXCIhPXR5cGVvZiBhcmd1bWVudHNbd118fGlzTmFOKGFyZ3VtZW50c1t3XSl8fCFpc0Zpbml0ZShhcmd1bWVudHNbd10pKXJldHVybiExO2E9TWF0aC5taW4oYSwxKSxkPU1hdGgubWluKGQsMSksYT1NYXRoLm1heChhLDApLGQ9TWF0aC5tYXgoZCwwKTt2YXIgeD12P25ldyBGbG9hdDMyQXJyYXkodCk6bmV3IEFycmF5KHQpLHk9ITEsej1mdW5jdGlvbihiKXtyZXR1cm4geXx8bygpLGE9PT1jJiZkPT09ZT9iOjA9PT1iPzA6MT09PWI/MTppKG4oYiksYyxlKX07ei5nZXRDb250cm9sUG9pbnRzPWZ1bmN0aW9uKCl7cmV0dXJuW3t4OmEseTpjfSx7eDpkLHk6ZX1dfTt2YXIgQT1cImdlbmVyYXRlQmV6aWVyKFwiK1thLGMsZCxlXStcIilcIjtyZXR1cm4gei50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBBfSx6fWZ1bmN0aW9uIGwoYSxiKXt2YXIgYz1hO3JldHVybiB1LmlzU3RyaW5nKGEpP3kuRWFzaW5nc1thXXx8KGM9ITEpOmM9dS5pc0FycmF5KGEpJiYxPT09YS5sZW5ndGg/ai5hcHBseShudWxsLGEpOnUuaXNBcnJheShhKSYmMj09PWEubGVuZ3RoP3ouYXBwbHkobnVsbCxhLmNvbmNhdChbYl0pKTohKCF1LmlzQXJyYXkoYSl8fDQhPT1hLmxlbmd0aCkmJmsuYXBwbHkobnVsbCxhKSwhMT09PWMmJihjPXkuRWFzaW5nc1t5LmRlZmF1bHRzLmVhc2luZ10/eS5kZWZhdWx0cy5lYXNpbmc6eCksY31mdW5jdGlvbiBtKGEpe2lmKGEpe3ZhciBiPXkudGltZXN0YW1wJiYhMCE9PWE/YTpyLm5vdygpLGM9eS5TdGF0ZS5jYWxscy5sZW5ndGg7Yz4xZTQmJih5LlN0YXRlLmNhbGxzPWUoeS5TdGF0ZS5jYWxscyksYz15LlN0YXRlLmNhbGxzLmxlbmd0aCk7Zm9yKHZhciBmPTA7ZjxjO2YrKylpZih5LlN0YXRlLmNhbGxzW2ZdKXt2YXIgaD15LlN0YXRlLmNhbGxzW2ZdLGk9aFswXSxqPWhbMl0saz1oWzNdLGw9IWsscT1udWxsLHM9aFs1XSx0PWhbNl07aWYoa3x8KGs9eS5TdGF0ZS5jYWxsc1tmXVszXT1iLTE2KSxzKXtpZighMCE9PXMucmVzdW1lKWNvbnRpbnVlO2s9aFszXT1NYXRoLnJvdW5kKGItdC0xNiksaFs1XT1udWxsfXQ9aFs2XT1iLWs7Zm9yKHZhciB2PU1hdGgubWluKHQvai5kdXJhdGlvbiwxKSx3PTAseD1pLmxlbmd0aDt3PHg7dysrKXt2YXIgej1pW3ddLEI9ei5lbGVtZW50O2lmKGcoQikpe3ZhciBEPSExO2lmKGouZGlzcGxheSE9PWQmJm51bGwhPT1qLmRpc3BsYXkmJlwibm9uZVwiIT09ai5kaXNwbGF5KXtpZihcImZsZXhcIj09PWouZGlzcGxheSl7dmFyIEU9W1wiLXdlYmtpdC1ib3hcIixcIi1tb3otYm94XCIsXCItbXMtZmxleGJveFwiLFwiLXdlYmtpdC1mbGV4XCJdO28uZWFjaChFLGZ1bmN0aW9uKGEsYil7QS5zZXRQcm9wZXJ0eVZhbHVlKEIsXCJkaXNwbGF5XCIsYil9KX1BLnNldFByb3BlcnR5VmFsdWUoQixcImRpc3BsYXlcIixqLmRpc3BsYXkpfWoudmlzaWJpbGl0eSE9PWQmJlwiaGlkZGVuXCIhPT1qLnZpc2liaWxpdHkmJkEuc2V0UHJvcGVydHlWYWx1ZShCLFwidmlzaWJpbGl0eVwiLGoudmlzaWJpbGl0eSk7Zm9yKHZhciBGIGluIHopaWYoei5oYXNPd25Qcm9wZXJ0eShGKSYmXCJlbGVtZW50XCIhPT1GKXt2YXIgRyxIPXpbRl0sST11LmlzU3RyaW5nKEguZWFzaW5nKT95LkVhc2luZ3NbSC5lYXNpbmddOkguZWFzaW5nO2lmKHUuaXNTdHJpbmcoSC5wYXR0ZXJuKSl7dmFyIEo9MT09PXY/ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPUguZW5kVmFsdWVbYl07cmV0dXJuIGM/TWF0aC5yb3VuZChkKTpkfTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9SC5zdGFydFZhbHVlW2JdLGU9SC5lbmRWYWx1ZVtiXS1kLGY9ZCtlKkkodixqLGUpO3JldHVybiBjP01hdGgucm91bmQoZik6Zn07Rz1ILnBhdHRlcm4ucmVwbGFjZSgveyhcXGQrKSghKT99L2csSil9ZWxzZSBpZigxPT09dilHPUguZW5kVmFsdWU7ZWxzZXt2YXIgSz1ILmVuZFZhbHVlLUguc3RhcnRWYWx1ZTtHPUguc3RhcnRWYWx1ZStLKkkodixqLEspfWlmKCFsJiZHPT09SC5jdXJyZW50VmFsdWUpY29udGludWU7aWYoSC5jdXJyZW50VmFsdWU9RyxcInR3ZWVuXCI9PT1GKXE9RztlbHNle3ZhciBMO2lmKEEuSG9va3MucmVnaXN0ZXJlZFtGXSl7TD1BLkhvb2tzLmdldFJvb3QoRik7dmFyIE09ZyhCKS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW0xdO00mJihILnJvb3RQcm9wZXJ0eVZhbHVlPU0pfXZhciBOPUEuc2V0UHJvcGVydHlWYWx1ZShCLEYsSC5jdXJyZW50VmFsdWUrKHA8OSYmMD09PXBhcnNlRmxvYXQoRyk/XCJcIjpILnVuaXRUeXBlKSxILnJvb3RQcm9wZXJ0eVZhbHVlLEguc2Nyb2xsRGF0YSk7QS5Ib29rcy5yZWdpc3RlcmVkW0ZdJiYoQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW0xdP2coQikucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtMXT1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbTF0oXCJleHRyYWN0XCIsbnVsbCxOWzFdKTpnKEIpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbTF09TlsxXSksXCJ0cmFuc2Zvcm1cIj09PU5bMF0mJihEPSEwKX19ai5tb2JpbGVIQSYmZyhCKS50cmFuc2Zvcm1DYWNoZS50cmFuc2xhdGUzZD09PWQmJihnKEIpLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkPVwiKDBweCwgMHB4LCAwcHgpXCIsRD0hMCksRCYmQS5mbHVzaFRyYW5zZm9ybUNhY2hlKEIpfX1qLmRpc3BsYXkhPT1kJiZcIm5vbmVcIiE9PWouZGlzcGxheSYmKHkuU3RhdGUuY2FsbHNbZl1bMl0uZGlzcGxheT0hMSksai52aXNpYmlsaXR5IT09ZCYmXCJoaWRkZW5cIiE9PWoudmlzaWJpbGl0eSYmKHkuU3RhdGUuY2FsbHNbZl1bMl0udmlzaWJpbGl0eT0hMSksai5wcm9ncmVzcyYmai5wcm9ncmVzcy5jYWxsKGhbMV0saFsxXSx2LE1hdGgubWF4KDAsaytqLmR1cmF0aW9uLWIpLGsscSksMT09PXYmJm4oZil9fXkuU3RhdGUuaXNUaWNraW5nJiZDKG0pfWZ1bmN0aW9uIG4oYSxiKXtpZigheS5TdGF0ZS5jYWxsc1thXSlyZXR1cm4hMTtmb3IodmFyIGM9eS5TdGF0ZS5jYWxsc1thXVswXSxlPXkuU3RhdGUuY2FsbHNbYV1bMV0sZj15LlN0YXRlLmNhbGxzW2FdWzJdLGg9eS5TdGF0ZS5jYWxsc1thXVs0XSxpPSExLGo9MCxrPWMubGVuZ3RoO2o8aztqKyspe3ZhciBsPWNbal0uZWxlbWVudDtifHxmLmxvb3B8fChcIm5vbmVcIj09PWYuZGlzcGxheSYmQS5zZXRQcm9wZXJ0eVZhbHVlKGwsXCJkaXNwbGF5XCIsZi5kaXNwbGF5KSxcImhpZGRlblwiPT09Zi52aXNpYmlsaXR5JiZBLnNldFByb3BlcnR5VmFsdWUobCxcInZpc2liaWxpdHlcIixmLnZpc2liaWxpdHkpKTt2YXIgbT1nKGwpO2lmKCEwIT09Zi5sb29wJiYoby5xdWV1ZShsKVsxXT09PWR8fCEvXFwudmVsb2NpdHlRdWV1ZUVudHJ5RmxhZy9pLnRlc3Qoby5xdWV1ZShsKVsxXSkpJiZtKXttLmlzQW5pbWF0aW5nPSExLG0ucm9vdFByb3BlcnR5VmFsdWVDYWNoZT17fTt2YXIgbj0hMTtvLmVhY2goQS5MaXN0cy50cmFuc2Zvcm1zM0QsZnVuY3Rpb24oYSxiKXt2YXIgYz0vXnNjYWxlLy50ZXN0KGIpPzE6MCxlPW0udHJhbnNmb3JtQ2FjaGVbYl07bS50cmFuc2Zvcm1DYWNoZVtiXSE9PWQmJm5ldyBSZWdFeHAoXCJeXFxcXChcIitjK1wiW14uXVwiKS50ZXN0KGUpJiYobj0hMCxkZWxldGUgbS50cmFuc2Zvcm1DYWNoZVtiXSl9KSxmLm1vYmlsZUhBJiYobj0hMCxkZWxldGUgbS50cmFuc2Zvcm1DYWNoZS50cmFuc2xhdGUzZCksbiYmQS5mbHVzaFRyYW5zZm9ybUNhY2hlKGwpLEEuVmFsdWVzLnJlbW92ZUNsYXNzKGwsXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIil9aWYoIWImJmYuY29tcGxldGUmJiFmLmxvb3AmJmo9PT1rLTEpdHJ5e2YuY29tcGxldGUuY2FsbChlLGUpfWNhdGNoKHIpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0aHJvdyByfSwxKX1oJiYhMCE9PWYubG9vcCYmaChlKSxtJiYhMD09PWYubG9vcCYmIWImJihvLmVhY2gobS50d2VlbnNDb250YWluZXIsZnVuY3Rpb24oYSxiKXtpZigvXnJvdGF0ZS8udGVzdChhKSYmKHBhcnNlRmxvYXQoYi5zdGFydFZhbHVlKS1wYXJzZUZsb2F0KGIuZW5kVmFsdWUpKSUzNjA9PTApe3ZhciBjPWIuc3RhcnRWYWx1ZTtiLnN0YXJ0VmFsdWU9Yi5lbmRWYWx1ZSxiLmVuZFZhbHVlPWN9L15iYWNrZ3JvdW5kUG9zaXRpb24vLnRlc3QoYSkmJjEwMD09PXBhcnNlRmxvYXQoYi5lbmRWYWx1ZSkmJlwiJVwiPT09Yi51bml0VHlwZSYmKGIuZW5kVmFsdWU9MCxiLnN0YXJ0VmFsdWU9MTAwKX0pLHkobCxcInJldmVyc2VcIix7bG9vcDohMCxkZWxheTpmLmRlbGF5fSkpLCExIT09Zi5xdWV1ZSYmby5kZXF1ZXVlKGwsZi5xdWV1ZSl9eS5TdGF0ZS5jYWxsc1thXT0hMTtmb3IodmFyIHA9MCxxPXkuU3RhdGUuY2FsbHMubGVuZ3RoO3A8cTtwKyspaWYoITEhPT15LlN0YXRlLmNhbGxzW3BdKXtpPSEwO2JyZWFrfSExPT09aSYmKHkuU3RhdGUuaXNUaWNraW5nPSExLGRlbGV0ZSB5LlN0YXRlLmNhbGxzLHkuU3RhdGUuY2FsbHM9W10pfXZhciBvLHA9ZnVuY3Rpb24oKXtpZihjLmRvY3VtZW50TW9kZSlyZXR1cm4gYy5kb2N1bWVudE1vZGU7Zm9yKHZhciBhPTc7YT40O2EtLSl7dmFyIGI9Yy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2lmKGIuaW5uZXJIVE1MPVwiXFx4M2MhLS1baWYgSUUgXCIrYStcIl0+PHNwYW4+PC9zcGFuPjwhW2VuZGlmXS0tXFx4M2VcIixiLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3BhblwiKS5sZW5ndGgpcmV0dXJuIGI9bnVsbCxhfXJldHVybiBkfSgpLHE9ZnVuY3Rpb24oKXt2YXIgYT0wO3JldHVybiBiLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8Yi5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGZ1bmN0aW9uKGIpe3ZhciBjLGQ9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIGM9TWF0aC5tYXgoMCwxNi0oZC1hKSksYT1kK2Msc2V0VGltZW91dChmdW5jdGlvbigpe2IoZCtjKX0sYyl9fSgpLHI9ZnVuY3Rpb24oKXt2YXIgYT1iLnBlcmZvcm1hbmNlfHx7fTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBhLm5vdyl7dmFyIGM9YS50aW1pbmcmJmEudGltaW5nLm5hdmlnYXRpb25TdGFydD9hLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQ6KG5ldyBEYXRlKS5nZXRUaW1lKCk7YS5ub3c9ZnVuY3Rpb24oKXtyZXR1cm4obmV3IERhdGUpLmdldFRpbWUoKS1jfX1yZXR1cm4gYX0oKSxzPWZ1bmN0aW9uKCl7dmFyIGE9QXJyYXkucHJvdG90eXBlLnNsaWNlO3RyeXtyZXR1cm4gYS5jYWxsKGMuZG9jdW1lbnRFbGVtZW50KSxhfWNhdGNoKGIpe3JldHVybiBmdW5jdGlvbihiLGMpe3ZhciBkPXRoaXMubGVuZ3RoO2lmKFwibnVtYmVyXCIhPXR5cGVvZiBiJiYoYj0wKSxcIm51bWJlclwiIT10eXBlb2YgYyYmKGM9ZCksdGhpcy5zbGljZSlyZXR1cm4gYS5jYWxsKHRoaXMsYixjKTt2YXIgZSxmPVtdLGc9Yj49MD9iOk1hdGgubWF4KDAsZCtiKSxoPWM8MD9kK2M6TWF0aC5taW4oYyxkKSxpPWgtZztpZihpPjApaWYoZj1uZXcgQXJyYXkoaSksdGhpcy5jaGFyQXQpZm9yKGU9MDtlPGk7ZSsrKWZbZV09dGhpcy5jaGFyQXQoZytlKTtlbHNlIGZvcihlPTA7ZTxpO2UrKylmW2VdPXRoaXNbZytlXTtyZXR1cm4gZn19fSgpLHQ9ZnVuY3Rpb24oKXtyZXR1cm4gQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzP2Z1bmN0aW9uKGEsYil7cmV0dXJuIGEuaW5jbHVkZXMoYil9OkFycmF5LnByb3RvdHlwZS5pbmRleE9mP2Z1bmN0aW9uKGEsYil7cmV0dXJuIGEuaW5kZXhPZihiKT49MH06ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrKylpZihhW2NdPT09YilyZXR1cm4hMDtyZXR1cm4hMX19LHU9e2lzTnVtYmVyOmZ1bmN0aW9uKGEpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBhfSxpc1N0cmluZzpmdW5jdGlvbihhKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYX0saXNBcnJheTpBcnJheS5pc0FycmF5fHxmdW5jdGlvbihhKXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSl9LGlzRnVuY3Rpb246ZnVuY3Rpb24oYSl7cmV0dXJuXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpfSxpc05vZGU6ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJmEubm9kZVR5cGV9LGlzV3JhcHBlZDpmdW5jdGlvbihhKXtyZXR1cm4gYSYmYSE9PWImJnUuaXNOdW1iZXIoYS5sZW5ndGgpJiYhdS5pc1N0cmluZyhhKSYmIXUuaXNGdW5jdGlvbihhKSYmIXUuaXNOb2RlKGEpJiYoMD09PWEubGVuZ3RofHx1LmlzTm9kZShhWzBdKSl9LGlzU1ZHOmZ1bmN0aW9uKGEpe3JldHVybiBiLlNWR0VsZW1lbnQmJmEgaW5zdGFuY2VvZiBiLlNWR0VsZW1lbnR9LGlzRW1wdHlPYmplY3Q6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiIGluIGEpaWYoYS5oYXNPd25Qcm9wZXJ0eShiKSlyZXR1cm4hMTtyZXR1cm4hMH19LHY9ITE7aWYoYS5mbiYmYS5mbi5qcXVlcnk/KG89YSx2PSEwKTpvPWIuVmVsb2NpdHkuVXRpbGl0aWVzLHA8PTgmJiF2KXRocm93IG5ldyBFcnJvcihcIlZlbG9jaXR5OiBJRTggYW5kIGJlbG93IHJlcXVpcmUgalF1ZXJ5IHRvIGJlIGxvYWRlZCBiZWZvcmUgVmVsb2NpdHkuXCIpO2lmKHA8PTcpcmV0dXJuIHZvaWQoalF1ZXJ5LmZuLnZlbG9jaXR5PWpRdWVyeS5mbi5hbmltYXRlKTt2YXIgdz00MDAseD1cInN3aW5nXCIseT17U3RhdGU6e2lzTW9iaWxlOi9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChiLm5hdmlnYXRvci51c2VyQWdlbnQpLGlzQW5kcm9pZDovQW5kcm9pZC9pLnRlc3QoYi5uYXZpZ2F0b3IudXNlckFnZW50KSxpc0dpbmdlcmJyZWFkOi9BbmRyb2lkIDJcXC4zXFwuWzMtN10vaS50ZXN0KGIubmF2aWdhdG9yLnVzZXJBZ2VudCksaXNDaHJvbWU6Yi5jaHJvbWUsaXNGaXJlZm94Oi9GaXJlZm94L2kudGVzdChiLm5hdmlnYXRvci51c2VyQWdlbnQpLHByZWZpeEVsZW1lbnQ6Yy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLHByZWZpeE1hdGNoZXM6e30sc2Nyb2xsQW5jaG9yOm51bGwsc2Nyb2xsUHJvcGVydHlMZWZ0Om51bGwsc2Nyb2xsUHJvcGVydHlUb3A6bnVsbCxpc1RpY2tpbmc6ITEsY2FsbHM6W10sZGVsYXllZEVsZW1lbnRzOntjb3VudDowfX0sQ1NTOnt9LFV0aWxpdGllczpvLFJlZGlyZWN0czp7fSxFYXNpbmdzOnt9LFByb21pc2U6Yi5Qcm9taXNlLGRlZmF1bHRzOntxdWV1ZTpcIlwiLGR1cmF0aW9uOncsZWFzaW5nOngsYmVnaW46ZCxjb21wbGV0ZTpkLHByb2dyZXNzOmQsZGlzcGxheTpkLHZpc2liaWxpdHk6ZCxsb29wOiExLGRlbGF5OiExLG1vYmlsZUhBOiEwLF9jYWNoZVZhbHVlczohMCxwcm9taXNlUmVqZWN0RW1wdHk6ITB9LGluaXQ6ZnVuY3Rpb24oYSl7by5kYXRhKGEsXCJ2ZWxvY2l0eVwiLHtpc1NWRzp1LmlzU1ZHKGEpLGlzQW5pbWF0aW5nOiExLGNvbXB1dGVkU3R5bGU6bnVsbCx0d2VlbnNDb250YWluZXI6bnVsbCxyb290UHJvcGVydHlWYWx1ZUNhY2hlOnt9LHRyYW5zZm9ybUNhY2hlOnt9fSl9LGhvb2s6bnVsbCxtb2NrOiExLHZlcnNpb246e21ham9yOjEsbWlub3I6NSxwYXRjaDoyfSxkZWJ1ZzohMSx0aW1lc3RhbXA6ITAscGF1c2VBbGw6ZnVuY3Rpb24oYSl7dmFyIGI9KG5ldyBEYXRlKS5nZXRUaW1lKCk7by5lYWNoKHkuU3RhdGUuY2FsbHMsZnVuY3Rpb24oYixjKXtpZihjKXtpZihhIT09ZCYmKGNbMl0ucXVldWUhPT1hfHwhMT09PWNbMl0ucXVldWUpKXJldHVybiEwO2NbNV09e3Jlc3VtZTohMX19fSksby5lYWNoKHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLGZ1bmN0aW9uKGEsYyl7YyYmaChjLGIpfSl9LHJlc3VtZUFsbDpmdW5jdGlvbihhKXt2YXIgYj0obmV3IERhdGUpLmdldFRpbWUoKTtvLmVhY2goeS5TdGF0ZS5jYWxscyxmdW5jdGlvbihiLGMpe2lmKGMpe2lmKGEhPT1kJiYoY1syXS5xdWV1ZSE9PWF8fCExPT09Y1syXS5xdWV1ZSkpcmV0dXJuITA7Y1s1XSYmKGNbNV0ucmVzdW1lPSEwKX19KSxvLmVhY2goeS5TdGF0ZS5kZWxheWVkRWxlbWVudHMsZnVuY3Rpb24oYSxjKXtjJiZpKGMsYil9KX19O2IucGFnZVlPZmZzZXQhPT1kPyh5LlN0YXRlLnNjcm9sbEFuY2hvcj1iLHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlMZWZ0PVwicGFnZVhPZmZzZXRcIix5LlN0YXRlLnNjcm9sbFByb3BlcnR5VG9wPVwicGFnZVlPZmZzZXRcIik6KHkuU3RhdGUuc2Nyb2xsQW5jaG9yPWMuZG9jdW1lbnRFbGVtZW50fHxjLmJvZHkucGFyZW50Tm9kZXx8Yy5ib2R5LHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlMZWZ0PVwic2Nyb2xsTGVmdFwiLHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlUb3A9XCJzY3JvbGxUb3BcIik7dmFyIHo9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEpe3JldHVybi1hLnRlbnNpb24qYS54LWEuZnJpY3Rpb24qYS52fWZ1bmN0aW9uIGIoYixjLGQpe3ZhciBlPXt4OmIueCtkLmR4KmMsdjpiLnYrZC5kdipjLHRlbnNpb246Yi50ZW5zaW9uLGZyaWN0aW9uOmIuZnJpY3Rpb259O3JldHVybntkeDplLnYsZHY6YShlKX19ZnVuY3Rpb24gYyhjLGQpe3ZhciBlPXtkeDpjLnYsZHY6YShjKX0sZj1iKGMsLjUqZCxlKSxnPWIoYywuNSpkLGYpLGg9YihjLGQsZyksaT0xLzYqKGUuZHgrMiooZi5keCtnLmR4KStoLmR4KSxqPTEvNiooZS5kdisyKihmLmR2K2cuZHYpK2guZHYpO3JldHVybiBjLng9Yy54K2kqZCxjLnY9Yy52K2oqZCxjfXJldHVybiBmdW5jdGlvbiBkKGEsYixlKXt2YXIgZixnLGgsaT17eDotMSx2OjAsdGVuc2lvbjpudWxsLGZyaWN0aW9uOm51bGx9LGo9WzBdLGs9MDtmb3IoYT1wYXJzZUZsb2F0KGEpfHw1MDAsYj1wYXJzZUZsb2F0KGIpfHwyMCxlPWV8fG51bGwsaS50ZW5zaW9uPWEsaS5mcmljdGlvbj1iLGY9bnVsbCE9PWUsZj8oaz1kKGEsYiksZz1rL2UqLjAxNik6Zz0uMDE2OzspaWYoaD1jKGh8fGksZyksai5wdXNoKDEraC54KSxrKz0xNiwhKE1hdGguYWJzKGgueCk+MWUtNCYmTWF0aC5hYnMoaC52KT4xZS00KSlicmVhaztyZXR1cm4gZj9mdW5jdGlvbihhKXtyZXR1cm4galthKihqLmxlbmd0aC0xKXwwXX06a319KCk7eS5FYXNpbmdzPXtsaW5lYXI6ZnVuY3Rpb24oYSl7cmV0dXJuIGF9LHN3aW5nOmZ1bmN0aW9uKGEpe3JldHVybi41LU1hdGguY29zKGEqTWF0aC5QSSkvMn0sc3ByaW5nOmZ1bmN0aW9uKGEpe3JldHVybiAxLU1hdGguY29zKDQuNSphKk1hdGguUEkpKk1hdGguZXhwKDYqLWEpfX0sby5lYWNoKFtbXCJlYXNlXCIsWy4yNSwuMSwuMjUsMV1dLFtcImVhc2UtaW5cIixbLjQyLDAsMSwxXV0sW1wiZWFzZS1vdXRcIixbMCwwLC41OCwxXV0sW1wiZWFzZS1pbi1vdXRcIixbLjQyLDAsLjU4LDFdXSxbXCJlYXNlSW5TaW5lXCIsWy40NywwLC43NDUsLjcxNV1dLFtcImVhc2VPdXRTaW5lXCIsWy4zOSwuNTc1LC41NjUsMV1dLFtcImVhc2VJbk91dFNpbmVcIixbLjQ0NSwuMDUsLjU1LC45NV1dLFtcImVhc2VJblF1YWRcIixbLjU1LC4wODUsLjY4LC41M11dLFtcImVhc2VPdXRRdWFkXCIsWy4yNSwuNDYsLjQ1LC45NF1dLFtcImVhc2VJbk91dFF1YWRcIixbLjQ1NSwuMDMsLjUxNSwuOTU1XV0sW1wiZWFzZUluQ3ViaWNcIixbLjU1LC4wNTUsLjY3NSwuMTldXSxbXCJlYXNlT3V0Q3ViaWNcIixbLjIxNSwuNjEsLjM1NSwxXV0sW1wiZWFzZUluT3V0Q3ViaWNcIixbLjY0NSwuMDQ1LC4zNTUsMV1dLFtcImVhc2VJblF1YXJ0XCIsWy44OTUsLjAzLC42ODUsLjIyXV0sW1wiZWFzZU91dFF1YXJ0XCIsWy4xNjUsLjg0LC40NCwxXV0sW1wiZWFzZUluT3V0UXVhcnRcIixbLjc3LDAsLjE3NSwxXV0sW1wiZWFzZUluUXVpbnRcIixbLjc1NSwuMDUsLjg1NSwuMDZdXSxbXCJlYXNlT3V0UXVpbnRcIixbLjIzLDEsLjMyLDFdXSxbXCJlYXNlSW5PdXRRdWludFwiLFsuODYsMCwuMDcsMV1dLFtcImVhc2VJbkV4cG9cIixbLjk1LC4wNSwuNzk1LC4wMzVdXSxbXCJlYXNlT3V0RXhwb1wiLFsuMTksMSwuMjIsMV1dLFtcImVhc2VJbk91dEV4cG9cIixbMSwwLDAsMV1dLFtcImVhc2VJbkNpcmNcIixbLjYsLjA0LC45OCwuMzM1XV0sW1wiZWFzZU91dENpcmNcIixbLjA3NSwuODIsLjE2NSwxXV0sW1wiZWFzZUluT3V0Q2lyY1wiLFsuNzg1LC4xMzUsLjE1LC44Nl1dXSxmdW5jdGlvbihhLGIpe3kuRWFzaW5nc1tiWzBdXT1rLmFwcGx5KG51bGwsYlsxXSl9KTt2YXIgQT15LkNTUz17UmVnRXg6e2lzSGV4Oi9eIyhbQS1mXFxkXXszfSl7MSwyfSQvaSx2YWx1ZVVud3JhcDovXltBLXpdK1xcKCguKilcXCkkL2ksd3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZDovWzAtOS5dKyBbMC05Ll0rIFswLTkuXSsoIFswLTkuXSspPy8sdmFsdWVTcGxpdDovKFtBLXpdK1xcKC4rXFwpKXwoKFtBLXowLTkjLS5dKz8pKD89XFxzfCQpKS9naX0sTGlzdHM6e2NvbG9yczpbXCJmaWxsXCIsXCJzdHJva2VcIixcInN0b3BDb2xvclwiLFwiY29sb3JcIixcImJhY2tncm91bmRDb2xvclwiLFwiYm9yZGVyQ29sb3JcIixcImJvcmRlclRvcENvbG9yXCIsXCJib3JkZXJSaWdodENvbG9yXCIsXCJib3JkZXJCb3R0b21Db2xvclwiLFwiYm9yZGVyTGVmdENvbG9yXCIsXCJvdXRsaW5lQ29sb3JcIl0sdHJhbnNmb3Jtc0Jhc2U6W1widHJhbnNsYXRlWFwiLFwidHJhbnNsYXRlWVwiLFwic2NhbGVcIixcInNjYWxlWFwiLFwic2NhbGVZXCIsXCJza2V3WFwiLFwic2tld1lcIixcInJvdGF0ZVpcIl0sdHJhbnNmb3JtczNEOltcInRyYW5zZm9ybVBlcnNwZWN0aXZlXCIsXCJ0cmFuc2xhdGVaXCIsXCJzY2FsZVpcIixcInJvdGF0ZVhcIixcInJvdGF0ZVlcIl0sdW5pdHM6W1wiJVwiLFwiZW1cIixcImV4XCIsXCJjaFwiLFwicmVtXCIsXCJ2d1wiLFwidmhcIixcInZtaW5cIixcInZtYXhcIixcImNtXCIsXCJtbVwiLFwiUVwiLFwiaW5cIixcInBjXCIsXCJwdFwiLFwicHhcIixcImRlZ1wiLFwiZ3JhZFwiLFwicmFkXCIsXCJ0dXJuXCIsXCJzXCIsXCJtc1wiXSxjb2xvck5hbWVzOnthbGljZWJsdWU6XCIyNDAsMjQ4LDI1NVwiLGFudGlxdWV3aGl0ZTpcIjI1MCwyMzUsMjE1XCIsYXF1YW1hcmluZTpcIjEyNywyNTUsMjEyXCIsYXF1YTpcIjAsMjU1LDI1NVwiLGF6dXJlOlwiMjQwLDI1NSwyNTVcIixiZWlnZTpcIjI0NSwyNDUsMjIwXCIsYmlzcXVlOlwiMjU1LDIyOCwxOTZcIixibGFjazpcIjAsMCwwXCIsYmxhbmNoZWRhbG1vbmQ6XCIyNTUsMjM1LDIwNVwiLGJsdWV2aW9sZXQ6XCIxMzgsNDMsMjI2XCIsYmx1ZTpcIjAsMCwyNTVcIixicm93bjpcIjE2NSw0Miw0MlwiLGJ1cmx5d29vZDpcIjIyMiwxODQsMTM1XCIsY2FkZXRibHVlOlwiOTUsMTU4LDE2MFwiLGNoYXJ0cmV1c2U6XCIxMjcsMjU1LDBcIixjaG9jb2xhdGU6XCIyMTAsMTA1LDMwXCIsY29yYWw6XCIyNTUsMTI3LDgwXCIsY29ybmZsb3dlcmJsdWU6XCIxMDAsMTQ5LDIzN1wiLGNvcm5zaWxrOlwiMjU1LDI0OCwyMjBcIixjcmltc29uOlwiMjIwLDIwLDYwXCIsY3lhbjpcIjAsMjU1LDI1NVwiLGRhcmtibHVlOlwiMCwwLDEzOVwiLGRhcmtjeWFuOlwiMCwxMzksMTM5XCIsZGFya2dvbGRlbnJvZDpcIjE4NCwxMzQsMTFcIixkYXJrZ3JheTpcIjE2OSwxNjksMTY5XCIsZGFya2dyZXk6XCIxNjksMTY5LDE2OVwiLGRhcmtncmVlbjpcIjAsMTAwLDBcIixkYXJra2hha2k6XCIxODksMTgzLDEwN1wiLGRhcmttYWdlbnRhOlwiMTM5LDAsMTM5XCIsZGFya29saXZlZ3JlZW46XCI4NSwxMDcsNDdcIixkYXJrb3JhbmdlOlwiMjU1LDE0MCwwXCIsZGFya29yY2hpZDpcIjE1Myw1MCwyMDRcIixkYXJrcmVkOlwiMTM5LDAsMFwiLGRhcmtzYWxtb246XCIyMzMsMTUwLDEyMlwiLGRhcmtzZWFncmVlbjpcIjE0MywxODgsMTQzXCIsZGFya3NsYXRlYmx1ZTpcIjcyLDYxLDEzOVwiLGRhcmtzbGF0ZWdyYXk6XCI0Nyw3OSw3OVwiLGRhcmt0dXJxdW9pc2U6XCIwLDIwNiwyMDlcIixkYXJrdmlvbGV0OlwiMTQ4LDAsMjExXCIsZGVlcHBpbms6XCIyNTUsMjAsMTQ3XCIsZGVlcHNreWJsdWU6XCIwLDE5MSwyNTVcIixkaW1ncmF5OlwiMTA1LDEwNSwxMDVcIixkaW1ncmV5OlwiMTA1LDEwNSwxMDVcIixkb2RnZXJibHVlOlwiMzAsMTQ0LDI1NVwiLGZpcmVicmljazpcIjE3OCwzNCwzNFwiLGZsb3JhbHdoaXRlOlwiMjU1LDI1MCwyNDBcIixmb3Jlc3RncmVlbjpcIjM0LDEzOSwzNFwiLGZ1Y2hzaWE6XCIyNTUsMCwyNTVcIixnYWluc2Jvcm86XCIyMjAsMjIwLDIyMFwiLGdob3N0d2hpdGU6XCIyNDgsMjQ4LDI1NVwiLGdvbGQ6XCIyNTUsMjE1LDBcIixnb2xkZW5yb2Q6XCIyMTgsMTY1LDMyXCIsZ3JheTpcIjEyOCwxMjgsMTI4XCIsZ3JleTpcIjEyOCwxMjgsMTI4XCIsZ3JlZW55ZWxsb3c6XCIxNzMsMjU1LDQ3XCIsZ3JlZW46XCIwLDEyOCwwXCIsaG9uZXlkZXc6XCIyNDAsMjU1LDI0MFwiLGhvdHBpbms6XCIyNTUsMTA1LDE4MFwiLGluZGlhbnJlZDpcIjIwNSw5Miw5MlwiLGluZGlnbzpcIjc1LDAsMTMwXCIsaXZvcnk6XCIyNTUsMjU1LDI0MFwiLGtoYWtpOlwiMjQwLDIzMCwxNDBcIixsYXZlbmRlcmJsdXNoOlwiMjU1LDI0MCwyNDVcIixsYXZlbmRlcjpcIjIzMCwyMzAsMjUwXCIsbGF3bmdyZWVuOlwiMTI0LDI1MiwwXCIsbGVtb25jaGlmZm9uOlwiMjU1LDI1MCwyMDVcIixsaWdodGJsdWU6XCIxNzMsMjE2LDIzMFwiLGxpZ2h0Y29yYWw6XCIyNDAsMTI4LDEyOFwiLGxpZ2h0Y3lhbjpcIjIyNCwyNTUsMjU1XCIsbGlnaHRnb2xkZW5yb2R5ZWxsb3c6XCIyNTAsMjUwLDIxMFwiLGxpZ2h0Z3JheTpcIjIxMSwyMTEsMjExXCIsbGlnaHRncmV5OlwiMjExLDIxMSwyMTFcIixsaWdodGdyZWVuOlwiMTQ0LDIzOCwxNDRcIixsaWdodHBpbms6XCIyNTUsMTgyLDE5M1wiLGxpZ2h0c2FsbW9uOlwiMjU1LDE2MCwxMjJcIixsaWdodHNlYWdyZWVuOlwiMzIsMTc4LDE3MFwiLGxpZ2h0c2t5Ymx1ZTpcIjEzNSwyMDYsMjUwXCIsbGlnaHRzbGF0ZWdyYXk6XCIxMTksMTM2LDE1M1wiLGxpZ2h0c3RlZWxibHVlOlwiMTc2LDE5NiwyMjJcIixsaWdodHllbGxvdzpcIjI1NSwyNTUsMjI0XCIsbGltZWdyZWVuOlwiNTAsMjA1LDUwXCIsbGltZTpcIjAsMjU1LDBcIixsaW5lbjpcIjI1MCwyNDAsMjMwXCIsbWFnZW50YTpcIjI1NSwwLDI1NVwiLG1hcm9vbjpcIjEyOCwwLDBcIixtZWRpdW1hcXVhbWFyaW5lOlwiMTAyLDIwNSwxNzBcIixtZWRpdW1ibHVlOlwiMCwwLDIwNVwiLG1lZGl1bW9yY2hpZDpcIjE4Niw4NSwyMTFcIixtZWRpdW1wdXJwbGU6XCIxNDcsMTEyLDIxOVwiLG1lZGl1bXNlYWdyZWVuOlwiNjAsMTc5LDExM1wiLG1lZGl1bXNsYXRlYmx1ZTpcIjEyMywxMDQsMjM4XCIsbWVkaXVtc3ByaW5nZ3JlZW46XCIwLDI1MCwxNTRcIixtZWRpdW10dXJxdW9pc2U6XCI3MiwyMDksMjA0XCIsbWVkaXVtdmlvbGV0cmVkOlwiMTk5LDIxLDEzM1wiLG1pZG5pZ2h0Ymx1ZTpcIjI1LDI1LDExMlwiLG1pbnRjcmVhbTpcIjI0NSwyNTUsMjUwXCIsbWlzdHlyb3NlOlwiMjU1LDIyOCwyMjVcIixtb2NjYXNpbjpcIjI1NSwyMjgsMTgxXCIsbmF2YWpvd2hpdGU6XCIyNTUsMjIyLDE3M1wiLG5hdnk6XCIwLDAsMTI4XCIsb2xkbGFjZTpcIjI1MywyNDUsMjMwXCIsb2xpdmVkcmFiOlwiMTA3LDE0MiwzNVwiLG9saXZlOlwiMTI4LDEyOCwwXCIsb3JhbmdlcmVkOlwiMjU1LDY5LDBcIixvcmFuZ2U6XCIyNTUsMTY1LDBcIixvcmNoaWQ6XCIyMTgsMTEyLDIxNFwiLHBhbGVnb2xkZW5yb2Q6XCIyMzgsMjMyLDE3MFwiLHBhbGVncmVlbjpcIjE1MiwyNTEsMTUyXCIscGFsZXR1cnF1b2lzZTpcIjE3NSwyMzgsMjM4XCIscGFsZXZpb2xldHJlZDpcIjIxOSwxMTIsMTQ3XCIscGFwYXlhd2hpcDpcIjI1NSwyMzksMjEzXCIscGVhY2hwdWZmOlwiMjU1LDIxOCwxODVcIixwZXJ1OlwiMjA1LDEzMyw2M1wiLHBpbms6XCIyNTUsMTkyLDIwM1wiLHBsdW06XCIyMjEsMTYwLDIyMVwiLHBvd2RlcmJsdWU6XCIxNzYsMjI0LDIzMFwiLHB1cnBsZTpcIjEyOCwwLDEyOFwiLHJlZDpcIjI1NSwwLDBcIixyb3N5YnJvd246XCIxODgsMTQzLDE0M1wiLHJveWFsYmx1ZTpcIjY1LDEwNSwyMjVcIixzYWRkbGVicm93bjpcIjEzOSw2OSwxOVwiLHNhbG1vbjpcIjI1MCwxMjgsMTE0XCIsc2FuZHlicm93bjpcIjI0NCwxNjQsOTZcIixzZWFncmVlbjpcIjQ2LDEzOSw4N1wiLHNlYXNoZWxsOlwiMjU1LDI0NSwyMzhcIixzaWVubmE6XCIxNjAsODIsNDVcIixzaWx2ZXI6XCIxOTIsMTkyLDE5MlwiLHNreWJsdWU6XCIxMzUsMjA2LDIzNVwiLHNsYXRlYmx1ZTpcIjEwNiw5MCwyMDVcIixzbGF0ZWdyYXk6XCIxMTIsMTI4LDE0NFwiLHNub3c6XCIyNTUsMjUwLDI1MFwiLHNwcmluZ2dyZWVuOlwiMCwyNTUsMTI3XCIsc3RlZWxibHVlOlwiNzAsMTMwLDE4MFwiLHRhbjpcIjIxMCwxODAsMTQwXCIsdGVhbDpcIjAsMTI4LDEyOFwiLHRoaXN0bGU6XCIyMTYsMTkxLDIxNlwiLHRvbWF0bzpcIjI1NSw5OSw3MVwiLHR1cnF1b2lzZTpcIjY0LDIyNCwyMDhcIix2aW9sZXQ6XCIyMzgsMTMwLDIzOFwiLHdoZWF0OlwiMjQ1LDIyMiwxNzlcIix3aGl0ZXNtb2tlOlwiMjQ1LDI0NSwyNDVcIix3aGl0ZTpcIjI1NSwyNTUsMjU1XCIseWVsbG93Z3JlZW46XCIxNTQsMjA1LDUwXCIseWVsbG93OlwiMjU1LDI1NSwwXCJ9fSxIb29rczp7dGVtcGxhdGVzOnt0ZXh0U2hhZG93OltcIkNvbG9yIFggWSBCbHVyXCIsXCJibGFjayAwcHggMHB4IDBweFwiXSxib3hTaGFkb3c6W1wiQ29sb3IgWCBZIEJsdXIgU3ByZWFkXCIsXCJibGFjayAwcHggMHB4IDBweCAwcHhcIl0sY2xpcDpbXCJUb3AgUmlnaHQgQm90dG9tIExlZnRcIixcIjBweCAwcHggMHB4IDBweFwiXSxiYWNrZ3JvdW5kUG9zaXRpb246W1wiWCBZXCIsXCIwJSAwJVwiXSx0cmFuc2Zvcm1PcmlnaW46W1wiWCBZIFpcIixcIjUwJSA1MCUgMHB4XCJdLHBlcnNwZWN0aXZlT3JpZ2luOltcIlggWVwiLFwiNTAlIDUwJVwiXX0scmVnaXN0ZXJlZDp7fSxyZWdpc3RlcjpmdW5jdGlvbigpe2Zvcih2YXIgYT0wO2E8QS5MaXN0cy5jb2xvcnMubGVuZ3RoO2ErKyl7dmFyIGI9XCJjb2xvclwiPT09QS5MaXN0cy5jb2xvcnNbYV0/XCIwIDAgMCAxXCI6XCIyNTUgMjU1IDI1NSAxXCI7QS5Ib29rcy50ZW1wbGF0ZXNbQS5MaXN0cy5jb2xvcnNbYV1dPVtcIlJlZCBHcmVlbiBCbHVlIEFscGhhXCIsYl19dmFyIGMsZCxlO2lmKHApZm9yKGMgaW4gQS5Ib29rcy50ZW1wbGF0ZXMpaWYoQS5Ib29rcy50ZW1wbGF0ZXMuaGFzT3duUHJvcGVydHkoYykpe2Q9QS5Ib29rcy50ZW1wbGF0ZXNbY10sZT1kWzBdLnNwbGl0KFwiIFwiKTt2YXIgZj1kWzFdLm1hdGNoKEEuUmVnRXgudmFsdWVTcGxpdCk7XCJDb2xvclwiPT09ZVswXSYmKGUucHVzaChlLnNoaWZ0KCkpLGYucHVzaChmLnNoaWZ0KCkpLEEuSG9va3MudGVtcGxhdGVzW2NdPVtlLmpvaW4oXCIgXCIpLGYuam9pbihcIiBcIildKX1mb3IoYyBpbiBBLkhvb2tzLnRlbXBsYXRlcylpZihBLkhvb2tzLnRlbXBsYXRlcy5oYXNPd25Qcm9wZXJ0eShjKSl7ZD1BLkhvb2tzLnRlbXBsYXRlc1tjXSxlPWRbMF0uc3BsaXQoXCIgXCIpO2Zvcih2YXIgZyBpbiBlKWlmKGUuaGFzT3duUHJvcGVydHkoZykpe3ZhciBoPWMrZVtnXSxpPWc7QS5Ib29rcy5yZWdpc3RlcmVkW2hdPVtjLGldfX19LGdldFJvb3Q6ZnVuY3Rpb24oYSl7dmFyIGI9QS5Ib29rcy5yZWdpc3RlcmVkW2FdO3JldHVybiBiP2JbMF06YX0sZ2V0VW5pdDpmdW5jdGlvbihhLGIpe3ZhciBjPShhLnN1YnN0cihifHwwLDUpLm1hdGNoKC9eW2EteiVdKy8pfHxbXSlbMF18fFwiXCI7cmV0dXJuIGMmJnQoQS5MaXN0cy51bml0cyxjKT9jOlwiXCJ9LGZpeENvbG9yczpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKC8ocmdiYT9cXChcXHMqKT8oXFxiW2Etel0rXFxiKS9nLGZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gQS5MaXN0cy5jb2xvck5hbWVzLmhhc093blByb3BlcnR5KGMpPyhifHxcInJnYmEoXCIpK0EuTGlzdHMuY29sb3JOYW1lc1tjXSsoYj9cIlwiOlwiLDEpXCIpOmIrY30pfSxjbGVhblJvb3RQcm9wZXJ0eVZhbHVlOmZ1bmN0aW9uKGEsYil7cmV0dXJuIEEuUmVnRXgudmFsdWVVbndyYXAudGVzdChiKSYmKGI9Yi5tYXRjaChBLlJlZ0V4LnZhbHVlVW53cmFwKVsxXSksQS5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUoYikmJihiPUEuSG9va3MudGVtcGxhdGVzW2FdWzFdKSxifSxleHRyYWN0VmFsdWU6ZnVuY3Rpb24oYSxiKXt2YXIgYz1BLkhvb2tzLnJlZ2lzdGVyZWRbYV07aWYoYyl7dmFyIGQ9Y1swXSxlPWNbMV07cmV0dXJuIGI9QS5Ib29rcy5jbGVhblJvb3RQcm9wZXJ0eVZhbHVlKGQsYiksYi50b1N0cmluZygpLm1hdGNoKEEuUmVnRXgudmFsdWVTcGxpdClbZV19cmV0dXJuIGJ9LGluamVjdFZhbHVlOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1BLkhvb2tzLnJlZ2lzdGVyZWRbYV07aWYoZCl7dmFyIGUsZj1kWzBdLGc9ZFsxXTtyZXR1cm4gYz1BLkhvb2tzLmNsZWFuUm9vdFByb3BlcnR5VmFsdWUoZixjKSxlPWMudG9TdHJpbmcoKS5tYXRjaChBLlJlZ0V4LnZhbHVlU3BsaXQpLGVbZ109YixlLmpvaW4oXCIgXCIpfXJldHVybiBjfX0sTm9ybWFsaXphdGlvbnM6e3JlZ2lzdGVyZWQ6e2NsaXA6ZnVuY3Rpb24oYSxiLGMpe3N3aXRjaChhKXtjYXNlXCJuYW1lXCI6cmV0dXJuXCJjbGlwXCI7Y2FzZVwiZXh0cmFjdFwiOnZhciBkO3JldHVybiBBLlJlZ0V4LndyYXBwZWRWYWx1ZUFscmVhZHlFeHRyYWN0ZWQudGVzdChjKT9kPWM6KGQ9Yy50b1N0cmluZygpLm1hdGNoKEEuUmVnRXgudmFsdWVVbndyYXApLGQ9ZD9kWzFdLnJlcGxhY2UoLywoXFxzKyk/L2csXCIgXCIpOmMpLGQ7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuXCJyZWN0KFwiK2MrXCIpXCJ9fSxibHVyOmZ1bmN0aW9uKGEsYixjKXtzd2l0Y2goYSl7Y2FzZVwibmFtZVwiOnJldHVybiB5LlN0YXRlLmlzRmlyZWZveD9cImZpbHRlclwiOlwiLXdlYmtpdC1maWx0ZXJcIjtjYXNlXCJleHRyYWN0XCI6dmFyIGQ9cGFyc2VGbG9hdChjKTtpZighZCYmMCE9PWQpe3ZhciBlPWMudG9TdHJpbmcoKS5tYXRjaCgvYmx1clxcKChbMC05XStbQS16XSspXFwpL2kpO2Q9ZT9lWzFdOjB9cmV0dXJuIGQ7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuIHBhcnNlRmxvYXQoYyk/XCJibHVyKFwiK2MrXCIpXCI6XCJub25lXCJ9fSxvcGFjaXR5OmZ1bmN0aW9uKGEsYixjKXtpZihwPD04KXN3aXRjaChhKXtjYXNlXCJuYW1lXCI6cmV0dXJuXCJmaWx0ZXJcIjtjYXNlXCJleHRyYWN0XCI6dmFyIGQ9Yy50b1N0cmluZygpLm1hdGNoKC9hbHBoYVxcKG9wYWNpdHk9KC4qKVxcKS9pKTtyZXR1cm4gYz1kP2RbMV0vMTAwOjE7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuIGIuc3R5bGUuem9vbT0xLHBhcnNlRmxvYXQoYyk+PTE/XCJcIjpcImFscGhhKG9wYWNpdHk9XCIrcGFyc2VJbnQoMTAwKnBhcnNlRmxvYXQoYyksMTApK1wiKVwifWVsc2Ugc3dpdGNoKGEpe2Nhc2VcIm5hbWVcIjpyZXR1cm5cIm9wYWNpdHlcIjtjYXNlXCJleHRyYWN0XCI6Y2FzZVwiaW5qZWN0XCI6cmV0dXJuIGN9fX0scmVnaXN0ZXI6ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEsYixjKXtpZihcImJvcmRlci1ib3hcIj09PUEuZ2V0UHJvcGVydHlWYWx1ZShiLFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKT09PShjfHwhMSkpe3ZhciBkLGUsZj0wLGc9XCJ3aWR0aFwiPT09YT9bXCJMZWZ0XCIsXCJSaWdodFwiXTpbXCJUb3BcIixcIkJvdHRvbVwiXSxoPVtcInBhZGRpbmdcIitnWzBdLFwicGFkZGluZ1wiK2dbMV0sXCJib3JkZXJcIitnWzBdK1wiV2lkdGhcIixcImJvcmRlclwiK2dbMV0rXCJXaWR0aFwiXTtmb3IoZD0wO2Q8aC5sZW5ndGg7ZCsrKWU9cGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYixoW2RdKSksaXNOYU4oZSl8fChmKz1lKTtyZXR1cm4gYz8tZjpmfXJldHVybiAwfWZ1bmN0aW9uIGIoYixjKXtyZXR1cm4gZnVuY3Rpb24oZCxlLGYpe3N3aXRjaChkKXtjYXNlXCJuYW1lXCI6cmV0dXJuIGI7Y2FzZVwiZXh0cmFjdFwiOnJldHVybiBwYXJzZUZsb2F0KGYpK2EoYixlLGMpO2Nhc2VcImluamVjdFwiOnJldHVybiBwYXJzZUZsb2F0KGYpLWEoYixlLGMpK1wicHhcIn19fXAmJiEocD45KXx8eS5TdGF0ZS5pc0dpbmdlcmJyZWFkfHwoQS5MaXN0cy50cmFuc2Zvcm1zQmFzZT1BLkxpc3RzLnRyYW5zZm9ybXNCYXNlLmNvbmNhdChBLkxpc3RzLnRyYW5zZm9ybXMzRCkpO2Zvcih2YXIgYz0wO2M8QS5MaXN0cy50cmFuc2Zvcm1zQmFzZS5sZW5ndGg7YysrKSFmdW5jdGlvbigpe3ZhciBhPUEuTGlzdHMudHJhbnNmb3Jtc0Jhc2VbY107QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2FdPWZ1bmN0aW9uKGIsYyxlKXtzd2l0Y2goYil7Y2FzZVwibmFtZVwiOnJldHVyblwidHJhbnNmb3JtXCI7Y2FzZVwiZXh0cmFjdFwiOnJldHVybiBnKGMpPT09ZHx8ZyhjKS50cmFuc2Zvcm1DYWNoZVthXT09PWQ/L15zY2FsZS9pLnRlc3QoYSk/MTowOmcoYykudHJhbnNmb3JtQ2FjaGVbYV0ucmVwbGFjZSgvWygpXS9nLFwiXCIpO2Nhc2VcImluamVjdFwiOnZhciBmPSExO3N3aXRjaChhLnN1YnN0cigwLGEubGVuZ3RoLTEpKXtjYXNlXCJ0cmFuc2xhdGVcIjpmPSEvKCV8cHh8ZW18cmVtfHZ3fHZofFxcZCkkL2kudGVzdChlKTticmVhaztjYXNlXCJzY2FsXCI6Y2FzZVwic2NhbGVcIjp5LlN0YXRlLmlzQW5kcm9pZCYmZyhjKS50cmFuc2Zvcm1DYWNoZVthXT09PWQmJmU8MSYmKGU9MSksZj0hLyhcXGQpJC9pLnRlc3QoZSk7YnJlYWs7Y2FzZVwic2tld1wiOmNhc2VcInJvdGF0ZVwiOmY9IS8oZGVnfFxcZCkkL2kudGVzdChlKX1yZXR1cm4gZnx8KGcoYykudHJhbnNmb3JtQ2FjaGVbYV09XCIoXCIrZStcIilcIiksZyhjKS50cmFuc2Zvcm1DYWNoZVthXX19fSgpO2Zvcih2YXIgZT0wO2U8QS5MaXN0cy5jb2xvcnMubGVuZ3RoO2UrKykhZnVuY3Rpb24oKXt2YXIgYT1BLkxpc3RzLmNvbG9yc1tlXTtBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbYV09ZnVuY3Rpb24oYixjLGUpe3N3aXRjaChiKXtjYXNlXCJuYW1lXCI6cmV0dXJuIGE7Y2FzZVwiZXh0cmFjdFwiOnZhciBmO2lmKEEuUmVnRXgud3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZC50ZXN0KGUpKWY9ZTtlbHNle3ZhciBnLGg9e2JsYWNrOlwicmdiKDAsIDAsIDApXCIsYmx1ZTpcInJnYigwLCAwLCAyNTUpXCIsZ3JheTpcInJnYigxMjgsIDEyOCwgMTI4KVwiLGdyZWVuOlwicmdiKDAsIDEyOCwgMClcIixyZWQ6XCJyZ2IoMjU1LCAwLCAwKVwiLHdoaXRlOlwicmdiKDI1NSwgMjU1LCAyNTUpXCJ9Oy9eW0Etel0rJC9pLnRlc3QoZSk/Zz1oW2VdIT09ZD9oW2VdOmguYmxhY2s6QS5SZWdFeC5pc0hleC50ZXN0KGUpP2c9XCJyZ2IoXCIrQS5WYWx1ZXMuaGV4VG9SZ2IoZSkuam9pbihcIiBcIikrXCIpXCI6L15yZ2JhP1xcKC9pLnRlc3QoZSl8fChnPWguYmxhY2spLGY9KGd8fGUpLnRvU3RyaW5nKCkubWF0Y2goQS5SZWdFeC52YWx1ZVVud3JhcClbMV0ucmVwbGFjZSgvLChcXHMrKT8vZyxcIiBcIil9cmV0dXJuKCFwfHxwPjgpJiYzPT09Zi5zcGxpdChcIiBcIikubGVuZ3RoJiYoZis9XCIgMVwiKSxmO2Nhc2VcImluamVjdFwiOnJldHVybi9ecmdiLy50ZXN0KGUpP2U6KHA8PTg/ND09PWUuc3BsaXQoXCIgXCIpLmxlbmd0aCYmKGU9ZS5zcGxpdCgvXFxzKy8pLnNsaWNlKDAsMykuam9pbihcIiBcIikpOjM9PT1lLnNwbGl0KFwiIFwiKS5sZW5ndGgmJihlKz1cIiAxXCIpLChwPD04P1wicmdiXCI6XCJyZ2JhXCIpK1wiKFwiK2UucmVwbGFjZSgvXFxzKy9nLFwiLFwiKS5yZXBsYWNlKC9cXC4oXFxkKSsoPz0sKS9nLFwiXCIpK1wiKVwiKX19fSgpO0EuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5pbm5lcldpZHRoPWIoXCJ3aWR0aFwiLCEwKSxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQuaW5uZXJIZWlnaHQ9YihcImhlaWdodFwiLCEwKSxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQub3V0ZXJXaWR0aD1iKFwid2lkdGhcIiksQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkLm91dGVySGVpZ2h0PWIoXCJoZWlnaHRcIil9fSxOYW1lczp7Y2FtZWxDYXNlOmZ1bmN0aW9uKGEpe3JldHVybiBhLnJlcGxhY2UoLy0oXFx3KS9nLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGIudG9VcHBlckNhc2UoKX0pfSxTVkdBdHRyaWJ1dGU6ZnVuY3Rpb24oYSl7dmFyIGI9XCJ3aWR0aHxoZWlnaHR8eHx5fGN4fGN5fHJ8cnh8cnl8eDF8eDJ8eTF8eTJcIjtyZXR1cm4ocHx8eS5TdGF0ZS5pc0FuZHJvaWQmJiF5LlN0YXRlLmlzQ2hyb21lKSYmKGIrPVwifHRyYW5zZm9ybVwiKSxuZXcgUmVnRXhwKFwiXihcIitiK1wiKSRcIixcImlcIikudGVzdChhKX0scHJlZml4Q2hlY2s6ZnVuY3Rpb24oYSl7aWYoeS5TdGF0ZS5wcmVmaXhNYXRjaGVzW2FdKXJldHVyblt5LlN0YXRlLnByZWZpeE1hdGNoZXNbYV0sITBdO2Zvcih2YXIgYj1bXCJcIixcIldlYmtpdFwiLFwiTW96XCIsXCJtc1wiLFwiT1wiXSxjPTAsZD1iLmxlbmd0aDtjPGQ7YysrKXt2YXIgZTtpZihlPTA9PT1jP2E6YltjXSthLnJlcGxhY2UoL15cXHcvLGZ1bmN0aW9uKGEpe3JldHVybiBhLnRvVXBwZXJDYXNlKCl9KSx1LmlzU3RyaW5nKHkuU3RhdGUucHJlZml4RWxlbWVudC5zdHlsZVtlXSkpcmV0dXJuIHkuU3RhdGUucHJlZml4TWF0Y2hlc1thXT1lLFtlLCEwXX1yZXR1cm5bYSwhMV19fSxWYWx1ZXM6e2hleFRvUmdiOmZ1bmN0aW9uKGEpe3ZhciBiLGM9L14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaSxkPS9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2k7cmV0dXJuIGE9YS5yZXBsYWNlKGMsZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuIGIrYitjK2MrZCtkfSksYj1kLmV4ZWMoYSksYj9bcGFyc2VJbnQoYlsxXSwxNikscGFyc2VJbnQoYlsyXSwxNikscGFyc2VJbnQoYlszXSwxNildOlswLDAsMF19LGlzQ1NTTnVsbFZhbHVlOmZ1bmN0aW9uKGEpe3JldHVybiFhfHwvXihub25lfGF1dG98dHJhbnNwYXJlbnR8KHJnYmFcXCgwLCA/MCwgPzAsID8wXFwpKSkkL2kudGVzdChhKX0sZ2V0VW5pdFR5cGU6ZnVuY3Rpb24oYSl7cmV0dXJuL14ocm90YXRlfHNrZXcpL2kudGVzdChhKT9cImRlZ1wiOi8oXihzY2FsZXxzY2FsZVh8c2NhbGVZfHNjYWxlWnxhbHBoYXxmbGV4R3Jvd3xmbGV4SGVpZ2h0fHpJbmRleHxmb250V2VpZ2h0KSQpfCgob3BhY2l0eXxyZWR8Z3JlZW58Ymx1ZXxhbHBoYSkkKS9pLnRlc3QoYSk/XCJcIjpcInB4XCJ9LGdldERpc3BsYXlUeXBlOmZ1bmN0aW9uKGEpe3ZhciBiPWEmJmEudGFnTmFtZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7cmV0dXJuL14oYnxiaWd8aXxzbWFsbHx0dHxhYmJyfGFjcm9ueW18Y2l0ZXxjb2RlfGRmbnxlbXxrYmR8c3Ryb25nfHNhbXB8dmFyfGF8YmRvfGJyfGltZ3xtYXB8b2JqZWN0fHF8c2NyaXB0fHNwYW58c3VifHN1cHxidXR0b258aW5wdXR8bGFiZWx8c2VsZWN0fHRleHRhcmVhKSQvaS50ZXN0KGIpP1wiaW5saW5lXCI6L14obGkpJC9pLnRlc3QoYik/XCJsaXN0LWl0ZW1cIjovXih0cikkL2kudGVzdChiKT9cInRhYmxlLXJvd1wiOi9eKHRhYmxlKSQvaS50ZXN0KGIpP1widGFibGVcIjovXih0Ym9keSkkL2kudGVzdChiKT9cInRhYmxlLXJvdy1ncm91cFwiOlwiYmxvY2tcIn0sYWRkQ2xhc3M6ZnVuY3Rpb24oYSxiKXtpZihhKWlmKGEuY2xhc3NMaXN0KWEuY2xhc3NMaXN0LmFkZChiKTtlbHNlIGlmKHUuaXNTdHJpbmcoYS5jbGFzc05hbWUpKWEuY2xhc3NOYW1lKz0oYS5jbGFzc05hbWUubGVuZ3RoP1wiIFwiOlwiXCIpK2I7ZWxzZXt2YXIgYz1hLmdldEF0dHJpYnV0ZShwPD03P1wiY2xhc3NOYW1lXCI6XCJjbGFzc1wiKXx8XCJcIjthLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsYysoYz9cIiBcIjpcIlwiKStiKX19LHJlbW92ZUNsYXNzOmZ1bmN0aW9uKGEsYil7aWYoYSlpZihhLmNsYXNzTGlzdClhLmNsYXNzTGlzdC5yZW1vdmUoYik7ZWxzZSBpZih1LmlzU3RyaW5nKGEuY2xhc3NOYW1lKSlhLmNsYXNzTmFtZT1hLmNsYXNzTmFtZS50b1N0cmluZygpLnJlcGxhY2UobmV3IFJlZ0V4cChcIihefFxcXFxzKVwiK2Iuc3BsaXQoXCIgXCIpLmpvaW4oXCJ8XCIpK1wiKFxcXFxzfCQpXCIsXCJnaVwiKSxcIiBcIik7ZWxzZXt2YXIgYz1hLmdldEF0dHJpYnV0ZShwPD03P1wiY2xhc3NOYW1lXCI6XCJjbGFzc1wiKXx8XCJcIjthLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsYy5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxzKVwiK2Iuc3BsaXQoXCIgXCIpLmpvaW4oXCJ8XCIpK1wiKHN8JClcIixcImdpXCIpLFwiIFwiKSl9fX0sZ2V0UHJvcGVydHlWYWx1ZTpmdW5jdGlvbihhLGMsZSxmKXtmdW5jdGlvbiBoKGEsYyl7dmFyIGU9MDtpZihwPD04KWU9by5jc3MoYSxjKTtlbHNle3ZhciBpPSExOy9eKHdpZHRofGhlaWdodCkkLy50ZXN0KGMpJiYwPT09QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJkaXNwbGF5XCIpJiYoaT0hMCxBLnNldFByb3BlcnR5VmFsdWUoYSxcImRpc3BsYXlcIixBLlZhbHVlcy5nZXREaXNwbGF5VHlwZShhKSkpO3ZhciBqPWZ1bmN0aW9uKCl7aSYmQS5zZXRQcm9wZXJ0eVZhbHVlKGEsXCJkaXNwbGF5XCIsXCJub25lXCIpfTtpZighZil7aWYoXCJoZWlnaHRcIj09PWMmJlwiYm9yZGVyLWJveFwiIT09QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKXt2YXIgaz1hLm9mZnNldEhlaWdodC0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcImJvcmRlclRvcFdpZHRoXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3JkZXJCb3R0b21XaWR0aFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicGFkZGluZ1RvcFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicGFkZGluZ0JvdHRvbVwiKSl8fDApO3JldHVybiBqKCksa31pZihcIndpZHRoXCI9PT1jJiZcImJvcmRlci1ib3hcIiE9PUEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSl7dmFyIGw9YS5vZmZzZXRXaWR0aC0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcImJvcmRlckxlZnRXaWR0aFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm9yZGVyUmlnaHRXaWR0aFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicGFkZGluZ0xlZnRcIikpfHwwKS0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcInBhZGRpbmdSaWdodFwiKSl8fDApO3JldHVybiBqKCksbH19dmFyIG07bT1nKGEpPT09ZD9iLmdldENvbXB1dGVkU3R5bGUoYSxudWxsKTpnKGEpLmNvbXB1dGVkU3R5bGU/ZyhhKS5jb21wdXRlZFN0eWxlOmcoYSkuY29tcHV0ZWRTdHlsZT1iLmdldENvbXB1dGVkU3R5bGUoYSxudWxsKSxcImJvcmRlckNvbG9yXCI9PT1jJiYoYz1cImJvcmRlclRvcENvbG9yXCIpLGU9OT09PXAmJlwiZmlsdGVyXCI9PT1jP20uZ2V0UHJvcGVydHlWYWx1ZShjKTptW2NdLFwiXCIhPT1lJiZudWxsIT09ZXx8KGU9YS5zdHlsZVtjXSksaigpfWlmKFwiYXV0b1wiPT09ZSYmL14odG9wfHJpZ2h0fGJvdHRvbXxsZWZ0KSQvaS50ZXN0KGMpKXt2YXIgbj1oKGEsXCJwb3NpdGlvblwiKTsoXCJmaXhlZFwiPT09bnx8XCJhYnNvbHV0ZVwiPT09biYmL3RvcHxsZWZ0L2kudGVzdChjKSkmJihlPW8oYSkucG9zaXRpb24oKVtjXStcInB4XCIpfXJldHVybiBlfXZhciBpO2lmKEEuSG9va3MucmVnaXN0ZXJlZFtjXSl7dmFyIGo9YyxrPUEuSG9va3MuZ2V0Um9vdChqKTtlPT09ZCYmKGU9QS5nZXRQcm9wZXJ0eVZhbHVlKGEsQS5OYW1lcy5wcmVmaXhDaGVjayhrKVswXSkpLEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtrXSYmKGU9QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2tdKFwiZXh0cmFjdFwiLGEsZSkpLGk9QS5Ib29rcy5leHRyYWN0VmFsdWUoaixlKX1lbHNlIGlmKEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXSl7dmFyIGwsbTtsPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcIm5hbWVcIixhKSxcInRyYW5zZm9ybVwiIT09bCYmKG09aChhLEEuTmFtZXMucHJlZml4Q2hlY2sobClbMF0pLEEuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKG0pJiZBLkhvb2tzLnRlbXBsYXRlc1tjXSYmKG09QS5Ib29rcy50ZW1wbGF0ZXNbY11bMV0pKSxpPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcImV4dHJhY3RcIixhLG0pfWlmKCEvXltcXGQtXS8udGVzdChpKSl7dmFyIG49ZyhhKTtpZihuJiZuLmlzU1ZHJiZBLk5hbWVzLlNWR0F0dHJpYnV0ZShjKSlpZigvXihoZWlnaHR8d2lkdGgpJC9pLnRlc3QoYykpdHJ5e2k9YS5nZXRCQm94KClbY119Y2F0Y2gocSl7aT0wfWVsc2UgaT1hLmdldEF0dHJpYnV0ZShjKTtlbHNlIGk9aChhLEEuTmFtZXMucHJlZml4Q2hlY2soYylbMF0pfXJldHVybiBBLlZhbHVlcy5pc0NTU051bGxWYWx1ZShpKSYmKGk9MCkseS5kZWJ1Zz49MiYmY29uc29sZS5sb2coXCJHZXQgXCIrYytcIjogXCIraSksaX0sc2V0UHJvcGVydHlWYWx1ZTpmdW5jdGlvbihhLGMsZCxlLGYpe3ZhciBoPWM7aWYoXCJzY3JvbGxcIj09PWMpZi5jb250YWluZXI/Zi5jb250YWluZXJbXCJzY3JvbGxcIitmLmRpcmVjdGlvbl09ZDpcIkxlZnRcIj09PWYuZGlyZWN0aW9uP2Iuc2Nyb2xsVG8oZCxmLmFsdGVybmF0ZVZhbHVlKTpiLnNjcm9sbFRvKGYuYWx0ZXJuYXRlVmFsdWUsZCk7ZWxzZSBpZihBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10mJlwidHJhbnNmb3JtXCI9PT1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJuYW1lXCIsYSkpQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwiaW5qZWN0XCIsYSxkKSxoPVwidHJhbnNmb3JtXCIsZD1nKGEpLnRyYW5zZm9ybUNhY2hlW2NdO2Vsc2V7aWYoQS5Ib29rcy5yZWdpc3RlcmVkW2NdKXt2YXIgaT1jLGo9QS5Ib29rcy5nZXRSb290KGMpO2U9ZXx8QS5nZXRQcm9wZXJ0eVZhbHVlKGEsaiksZD1BLkhvb2tzLmluamVjdFZhbHVlKGksZCxlKSxjPWp9aWYoQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdJiYoZD1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJpbmplY3RcIixhLGQpLGM9QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwibmFtZVwiLGEpKSxoPUEuTmFtZXMucHJlZml4Q2hlY2soYylbMF0scDw9OCl0cnl7YS5zdHlsZVtoXT1kfWNhdGNoKGwpe3kuZGVidWcmJmNvbnNvbGUubG9nKFwiQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFtcIitkK1wiXSBmb3IgW1wiK2grXCJdXCIpfWVsc2V7dmFyIGs9ZyhhKTtrJiZrLmlzU1ZHJiZBLk5hbWVzLlNWR0F0dHJpYnV0ZShjKT9hLnNldEF0dHJpYnV0ZShjLGQpOmEuc3R5bGVbaF09ZH15LmRlYnVnPj0yJiZjb25zb2xlLmxvZyhcIlNldCBcIitjK1wiIChcIitoK1wiKTogXCIrZCl9cmV0dXJuW2gsZF19LGZsdXNoVHJhbnNmb3JtQ2FjaGU6ZnVuY3Rpb24oYSl7dmFyIGI9XCJcIixjPWcoYSk7aWYoKHB8fHkuU3RhdGUuaXNBbmRyb2lkJiYheS5TdGF0ZS5pc0Nocm9tZSkmJmMmJmMuaXNTVkcpe3ZhciBkPWZ1bmN0aW9uKGIpe3JldHVybiBwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLGIpKX0sZT17dHJhbnNsYXRlOltkKFwidHJhbnNsYXRlWFwiKSxkKFwidHJhbnNsYXRlWVwiKV0sc2tld1g6W2QoXCJza2V3WFwiKV0sc2tld1k6W2QoXCJza2V3WVwiKV0sc2NhbGU6MSE9PWQoXCJzY2FsZVwiKT9bZChcInNjYWxlXCIpLGQoXCJzY2FsZVwiKV06W2QoXCJzY2FsZVhcIiksZChcInNjYWxlWVwiKV0scm90YXRlOltkKFwicm90YXRlWlwiKSwwLDBdfTtvLmVhY2goZyhhKS50cmFuc2Zvcm1DYWNoZSxmdW5jdGlvbihhKXsvXnRyYW5zbGF0ZS9pLnRlc3QoYSk/YT1cInRyYW5zbGF0ZVwiOi9ec2NhbGUvaS50ZXN0KGEpP2E9XCJzY2FsZVwiOi9ecm90YXRlL2kudGVzdChhKSYmKGE9XCJyb3RhdGVcIiksZVthXSYmKGIrPWErXCIoXCIrZVthXS5qb2luKFwiIFwiKStcIikgXCIsZGVsZXRlIGVbYV0pfSl9ZWxzZXt2YXIgZixoO28uZWFjaChnKGEpLnRyYW5zZm9ybUNhY2hlLGZ1bmN0aW9uKGMpe2lmKGY9ZyhhKS50cmFuc2Zvcm1DYWNoZVtjXSxcInRyYW5zZm9ybVBlcnNwZWN0aXZlXCI9PT1jKXJldHVybiBoPWYsITA7OT09PXAmJlwicm90YXRlWlwiPT09YyYmKGM9XCJyb3RhdGVcIiksYis9YytmK1wiIFwifSksaCYmKGI9XCJwZXJzcGVjdGl2ZVwiK2grXCIgXCIrYil9QS5zZXRQcm9wZXJ0eVZhbHVlKGEsXCJ0cmFuc2Zvcm1cIixiKX19O0EuSG9va3MucmVnaXN0ZXIoKSxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyKCkseS5ob29rPWZ1bmN0aW9uKGEsYixjKXt2YXIgZTtyZXR1cm4gYT1mKGEpLG8uZWFjaChhLGZ1bmN0aW9uKGEsZil7aWYoZyhmKT09PWQmJnkuaW5pdChmKSxjPT09ZCllPT09ZCYmKGU9QS5nZXRQcm9wZXJ0eVZhbHVlKGYsYikpO2Vsc2V7dmFyIGg9QS5zZXRQcm9wZXJ0eVZhbHVlKGYsYixjKTtcInRyYW5zZm9ybVwiPT09aFswXSYmeS5DU1MuZmx1c2hUcmFuc2Zvcm1DYWNoZShmKSxlPWh9fSksZX07dmFyIEI9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKCl7cmV0dXJuIGs/ei5wcm9taXNlfHxudWxsOnB9ZnVuY3Rpb24gZShhLGUpe2Z1bmN0aW9uIGYoZil7dmFyIGssbjtpZihpLmJlZ2luJiYwPT09RCl0cnl7aS5iZWdpbi5jYWxsKHIscil9Y2F0Y2goVil7c2V0VGltZW91dChmdW5jdGlvbigpe3Rocm93IFZ9LDEpfWlmKFwic2Nyb2xsXCI9PT1HKXt2YXIgcCxxLHcseD0vXngkL2kudGVzdChpLmF4aXMpP1wiTGVmdFwiOlwiVG9wXCIsQj1wYXJzZUZsb2F0KGkub2Zmc2V0KXx8MDtpLmNvbnRhaW5lcj91LmlzV3JhcHBlZChpLmNvbnRhaW5lcil8fHUuaXNOb2RlKGkuY29udGFpbmVyKT8oaS5jb250YWluZXI9aS5jb250YWluZXJbMF18fGkuY29udGFpbmVyLHA9aS5jb250YWluZXJbXCJzY3JvbGxcIit4XSx3PXArbyhhKS5wb3NpdGlvbigpW3gudG9Mb3dlckNhc2UoKV0rQik6aS5jb250YWluZXI9bnVsbDoocD15LlN0YXRlLnNjcm9sbEFuY2hvclt5LlN0YXRlW1wic2Nyb2xsUHJvcGVydHlcIit4XV0scT15LlN0YXRlLnNjcm9sbEFuY2hvclt5LlN0YXRlW1wic2Nyb2xsUHJvcGVydHlcIisoXCJMZWZ0XCI9PT14P1wiVG9wXCI6XCJMZWZ0XCIpXV0sdz1vKGEpLm9mZnNldCgpW3gudG9Mb3dlckNhc2UoKV0rQiksaj17c2Nyb2xsOntyb290UHJvcGVydHlWYWx1ZTohMSxzdGFydFZhbHVlOnAsY3VycmVudFZhbHVlOnAsZW5kVmFsdWU6dyx1bml0VHlwZTpcIlwiLGVhc2luZzppLmVhc2luZyxzY3JvbGxEYXRhOntjb250YWluZXI6aS5jb250YWluZXIsZGlyZWN0aW9uOngsYWx0ZXJuYXRlVmFsdWU6cX19LGVsZW1lbnQ6YX0seS5kZWJ1ZyYmY29uc29sZS5sb2coXCJ0d2VlbnNDb250YWluZXIgKHNjcm9sbCk6IFwiLGouc2Nyb2xsLGEpfWVsc2UgaWYoXCJyZXZlcnNlXCI9PT1HKXtpZighKGs9ZyhhKSkpcmV0dXJuO2lmKCFrLnR3ZWVuc0NvbnRhaW5lcilyZXR1cm4gdm9pZCBvLmRlcXVldWUoYSxpLnF1ZXVlKTtcIm5vbmVcIj09PWsub3B0cy5kaXNwbGF5JiYoay5vcHRzLmRpc3BsYXk9XCJhdXRvXCIpLFwiaGlkZGVuXCI9PT1rLm9wdHMudmlzaWJpbGl0eSYmKGsub3B0cy52aXNpYmlsaXR5PVwidmlzaWJsZVwiKSxrLm9wdHMubG9vcD0hMSxrLm9wdHMuYmVnaW49bnVsbCxrLm9wdHMuY29tcGxldGU9bnVsbCx2LmVhc2luZ3x8ZGVsZXRlIGkuZWFzaW5nLHYuZHVyYXRpb258fGRlbGV0ZSBpLmR1cmF0aW9uLGk9by5leHRlbmQoe30say5vcHRzLGkpLG49by5leHRlbmQoITAse30saz9rLnR3ZWVuc0NvbnRhaW5lcjpudWxsKTtmb3IodmFyIEUgaW4gbilpZihuLmhhc093blByb3BlcnR5KEUpJiZcImVsZW1lbnRcIiE9PUUpe3ZhciBGPW5bRV0uc3RhcnRWYWx1ZTtuW0VdLnN0YXJ0VmFsdWU9bltFXS5jdXJyZW50VmFsdWU9bltFXS5lbmRWYWx1ZSxuW0VdLmVuZFZhbHVlPUYsdS5pc0VtcHR5T2JqZWN0KHYpfHwobltFXS5lYXNpbmc9aS5lYXNpbmcpLHkuZGVidWcmJmNvbnNvbGUubG9nKFwicmV2ZXJzZSB0d2VlbnNDb250YWluZXIgKFwiK0UrXCIpOiBcIitKU09OLnN0cmluZ2lmeShuW0VdKSxhKX1qPW59ZWxzZSBpZihcInN0YXJ0XCI9PT1HKXtrPWcoYSksayYmay50d2VlbnNDb250YWluZXImJiEwPT09ay5pc0FuaW1hdGluZyYmKG49ay50d2VlbnNDb250YWluZXIpO3ZhciBIPWZ1bmN0aW9uKGUsZil7dmFyIGcsbD1BLkhvb2tzLmdldFJvb3QoZSksbT0hMSxwPWZbMF0scT1mWzFdLHI9ZlsyXVxuO2lmKCEoayYmay5pc1NWR3x8XCJ0d2VlblwiPT09bHx8ITEhPT1BLk5hbWVzLnByZWZpeENoZWNrKGwpWzFdfHxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbbF0hPT1kKSlyZXR1cm4gdm9pZCh5LmRlYnVnJiZjb25zb2xlLmxvZyhcIlNraXBwaW5nIFtcIitsK1wiXSBkdWUgdG8gYSBsYWNrIG9mIGJyb3dzZXIgc3VwcG9ydC5cIikpOyhpLmRpc3BsYXkhPT1kJiZudWxsIT09aS5kaXNwbGF5JiZcIm5vbmVcIiE9PWkuZGlzcGxheXx8aS52aXNpYmlsaXR5IT09ZCYmXCJoaWRkZW5cIiE9PWkudmlzaWJpbGl0eSkmJi9vcGFjaXR5fGZpbHRlci8udGVzdChlKSYmIXImJjAhPT1wJiYocj0wKSxpLl9jYWNoZVZhbHVlcyYmbiYmbltlXT8ocj09PWQmJihyPW5bZV0uZW5kVmFsdWUrbltlXS51bml0VHlwZSksbT1rLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbbF0pOkEuSG9va3MucmVnaXN0ZXJlZFtlXT9yPT09ZD8obT1BLmdldFByb3BlcnR5VmFsdWUoYSxsKSxyPUEuZ2V0UHJvcGVydHlWYWx1ZShhLGUsbSkpOm09QS5Ib29rcy50ZW1wbGF0ZXNbbF1bMV06cj09PWQmJihyPUEuZ2V0UHJvcGVydHlWYWx1ZShhLGUpKTt2YXIgcyx0LHYsdz0hMSx4PWZ1bmN0aW9uKGEsYil7dmFyIGMsZDtyZXR1cm4gZD0oYnx8XCIwXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bJUEtel0rJC8sZnVuY3Rpb24oYSl7cmV0dXJuIGM9YSxcIlwifSksY3x8KGM9QS5WYWx1ZXMuZ2V0VW5pdFR5cGUoYSkpLFtkLGNdfTtpZihyIT09cCYmdS5pc1N0cmluZyhyKSYmdS5pc1N0cmluZyhwKSl7Zz1cIlwiO3ZhciB6PTAsQj0wLEM9W10sRD1bXSxFPTAsRj0wLEc9MDtmb3Iocj1BLkhvb2tzLmZpeENvbG9ycyhyKSxwPUEuSG9va3MuZml4Q29sb3JzKHApO3o8ci5sZW5ndGgmJkI8cC5sZW5ndGg7KXt2YXIgSD1yW3pdLEk9cFtCXTtpZigvW1xcZFxcLi1dLy50ZXN0KEgpJiYvW1xcZFxcLi1dLy50ZXN0KEkpKXtmb3IodmFyIEo9SCxLPUksTD1cIi5cIixOPVwiLlwiOysrejxyLmxlbmd0aDspe2lmKChIPXJbel0pPT09TClMPVwiLi5cIjtlbHNlIGlmKCEvXFxkLy50ZXN0KEgpKWJyZWFrO0orPUh9Zm9yKDsrK0I8cC5sZW5ndGg7KXtpZigoST1wW0JdKT09PU4pTj1cIi4uXCI7ZWxzZSBpZighL1xcZC8udGVzdChJKSlicmVhaztLKz1JfXZhciBPPUEuSG9va3MuZ2V0VW5pdChyLHopLFA9QS5Ib29rcy5nZXRVbml0KHAsQik7aWYoeis9Ty5sZW5ndGgsQis9UC5sZW5ndGgsTz09PVApSj09PUs/Zys9SitPOihnKz1cIntcIitDLmxlbmd0aCsoRj9cIiFcIjpcIlwiKStcIn1cIitPLEMucHVzaChwYXJzZUZsb2F0KEopKSxELnB1c2gocGFyc2VGbG9hdChLKSkpO2Vsc2V7dmFyIFE9cGFyc2VGbG9hdChKKSxSPXBhcnNlRmxvYXQoSyk7Zys9KEU8NT9cImNhbGNcIjpcIlwiKStcIihcIisoUT9cIntcIitDLmxlbmd0aCsoRj9cIiFcIjpcIlwiKStcIn1cIjpcIjBcIikrTytcIiArIFwiKyhSP1wie1wiKyhDLmxlbmd0aCsoUT8xOjApKSsoRj9cIiFcIjpcIlwiKStcIn1cIjpcIjBcIikrUCtcIilcIixRJiYoQy5wdXNoKFEpLEQucHVzaCgwKSksUiYmKEMucHVzaCgwKSxELnB1c2goUikpfX1lbHNle2lmKEghPT1JKXtFPTA7YnJlYWt9Zys9SCx6KyssQisrLDA9PT1FJiZcImNcIj09PUh8fDE9PT1FJiZcImFcIj09PUh8fDI9PT1FJiZcImxcIj09PUh8fDM9PT1FJiZcImNcIj09PUh8fEU+PTQmJlwiKFwiPT09SD9FKys6KEUmJkU8NXx8RT49NCYmXCIpXCI9PT1IJiYtLUU8NSkmJihFPTApLDA9PT1GJiZcInJcIj09PUh8fDE9PT1GJiZcImdcIj09PUh8fDI9PT1GJiZcImJcIj09PUh8fDM9PT1GJiZcImFcIj09PUh8fEY+PTMmJlwiKFwiPT09SD8oMz09PUYmJlwiYVwiPT09SCYmKEc9MSksRisrKTpHJiZcIixcIj09PUg/KytHPjMmJihGPUc9MCk6KEcmJkY8KEc/NTo0KXx8Rj49KEc/NDozKSYmXCIpXCI9PT1IJiYtLUY8KEc/NTo0KSkmJihGPUc9MCl9fXo9PT1yLmxlbmd0aCYmQj09PXAubGVuZ3RofHwoeS5kZWJ1ZyYmY29uc29sZS5lcnJvcignVHJ5aW5nIHRvIHBhdHRlcm4gbWF0Y2ggbWlzLW1hdGNoZWQgc3RyaW5ncyBbXCInK3ArJ1wiLCBcIicrcisnXCJdJyksZz1kKSxnJiYoQy5sZW5ndGg/KHkuZGVidWcmJmNvbnNvbGUubG9nKCdQYXR0ZXJuIGZvdW5kIFwiJytnKydcIiAtPiAnLEMsRCxcIltcIityK1wiLFwiK3ArXCJdXCIpLHI9QyxwPUQsdD12PVwiXCIpOmc9ZCl9Z3x8KHM9eChlLHIpLHI9c1swXSx2PXNbMV0scz14KGUscCkscD1zWzBdLnJlcGxhY2UoL14oWystXFwvKl0pPS8sZnVuY3Rpb24oYSxiKXtyZXR1cm4gdz1iLFwiXCJ9KSx0PXNbMV0scj1wYXJzZUZsb2F0KHIpfHwwLHA9cGFyc2VGbG9hdChwKXx8MCxcIiVcIj09PXQmJigvXihmb250U2l6ZXxsaW5lSGVpZ2h0KSQvLnRlc3QoZSk/KHAvPTEwMCx0PVwiZW1cIik6L15zY2FsZS8udGVzdChlKT8ocC89MTAwLHQ9XCJcIik6LyhSZWR8R3JlZW58Qmx1ZSkkL2kudGVzdChlKSYmKHA9cC8xMDAqMjU1LHQ9XCJcIikpKTtpZigvW1xcLypdLy50ZXN0KHcpKXQ9djtlbHNlIGlmKHYhPT10JiYwIT09cilpZigwPT09cCl0PXY7ZWxzZXtoPWh8fGZ1bmN0aW9uKCl7dmFyIGQ9e215UGFyZW50OmEucGFyZW50Tm9kZXx8Yy5ib2R5LHBvc2l0aW9uOkEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicG9zaXRpb25cIiksZm9udFNpemU6QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJmb250U2l6ZVwiKX0sZT1kLnBvc2l0aW9uPT09TS5sYXN0UG9zaXRpb24mJmQubXlQYXJlbnQ9PT1NLmxhc3RQYXJlbnQsZj1kLmZvbnRTaXplPT09TS5sYXN0Rm9udFNpemU7TS5sYXN0UGFyZW50PWQubXlQYXJlbnQsTS5sYXN0UG9zaXRpb249ZC5wb3NpdGlvbixNLmxhc3RGb250U2l6ZT1kLmZvbnRTaXplO3ZhciBnPXt9O2lmKGYmJmUpZy5lbVRvUHg9TS5sYXN0RW1Ub1B4LGcucGVyY2VudFRvUHhXaWR0aD1NLmxhc3RQZXJjZW50VG9QeFdpZHRoLGcucGVyY2VudFRvUHhIZWlnaHQ9TS5sYXN0UGVyY2VudFRvUHhIZWlnaHQ7ZWxzZXt2YXIgaD1rJiZrLmlzU1ZHP2MuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcInJlY3RcIik6Yy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3kuaW5pdChoKSxkLm15UGFyZW50LmFwcGVuZENoaWxkKGgpLG8uZWFjaChbXCJvdmVyZmxvd1wiLFwib3ZlcmZsb3dYXCIsXCJvdmVyZmxvd1lcIl0sZnVuY3Rpb24oYSxiKXt5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsYixcImhpZGRlblwiKX0pLHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoaCxcInBvc2l0aW9uXCIsZC5wb3NpdGlvbikseS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLFwiZm9udFNpemVcIixkLmZvbnRTaXplKSx5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsXCJib3hTaXppbmdcIixcImNvbnRlbnQtYm94XCIpLG8uZWFjaChbXCJtaW5XaWR0aFwiLFwibWF4V2lkdGhcIixcIndpZHRoXCIsXCJtaW5IZWlnaHRcIixcIm1heEhlaWdodFwiLFwiaGVpZ2h0XCJdLGZ1bmN0aW9uKGEsYil7eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLGIsXCIxMDAlXCIpfSkseS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLFwicGFkZGluZ0xlZnRcIixcIjEwMGVtXCIpLGcucGVyY2VudFRvUHhXaWR0aD1NLmxhc3RQZXJjZW50VG9QeFdpZHRoPShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShoLFwid2lkdGhcIixudWxsLCEwKSl8fDEpLzEwMCxnLnBlcmNlbnRUb1B4SGVpZ2h0PU0ubGFzdFBlcmNlbnRUb1B4SGVpZ2h0PShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShoLFwiaGVpZ2h0XCIsbnVsbCwhMCkpfHwxKS8xMDAsZy5lbVRvUHg9TS5sYXN0RW1Ub1B4PShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShoLFwicGFkZGluZ0xlZnRcIikpfHwxKS8xMDAsZC5teVBhcmVudC5yZW1vdmVDaGlsZChoKX1yZXR1cm4gbnVsbD09PU0ucmVtVG9QeCYmKE0ucmVtVG9QeD1wYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShjLmJvZHksXCJmb250U2l6ZVwiKSl8fDE2KSxudWxsPT09TS52d1RvUHgmJihNLnZ3VG9QeD1wYXJzZUZsb2F0KGIuaW5uZXJXaWR0aCkvMTAwLE0udmhUb1B4PXBhcnNlRmxvYXQoYi5pbm5lckhlaWdodCkvMTAwKSxnLnJlbVRvUHg9TS5yZW1Ub1B4LGcudndUb1B4PU0udndUb1B4LGcudmhUb1B4PU0udmhUb1B4LHkuZGVidWc+PTEmJmNvbnNvbGUubG9nKFwiVW5pdCByYXRpb3M6IFwiK0pTT04uc3RyaW5naWZ5KGcpLGEpLGd9KCk7dmFyIFM9L21hcmdpbnxwYWRkaW5nfGxlZnR8cmlnaHR8d2lkdGh8dGV4dHx3b3JkfGxldHRlci9pLnRlc3QoZSl8fC9YJC8udGVzdChlKXx8XCJ4XCI9PT1lP1wieFwiOlwieVwiO3N3aXRjaCh2KXtjYXNlXCIlXCI6cio9XCJ4XCI9PT1TP2gucGVyY2VudFRvUHhXaWR0aDpoLnBlcmNlbnRUb1B4SGVpZ2h0O2JyZWFrO2Nhc2VcInB4XCI6YnJlYWs7ZGVmYXVsdDpyKj1oW3YrXCJUb1B4XCJdfXN3aXRjaCh0KXtjYXNlXCIlXCI6cio9MS8oXCJ4XCI9PT1TP2gucGVyY2VudFRvUHhXaWR0aDpoLnBlcmNlbnRUb1B4SGVpZ2h0KTticmVhaztjYXNlXCJweFwiOmJyZWFrO2RlZmF1bHQ6cio9MS9oW3QrXCJUb1B4XCJdfX1zd2l0Y2godyl7Y2FzZVwiK1wiOnA9citwO2JyZWFrO2Nhc2VcIi1cIjpwPXItcDticmVhaztjYXNlXCIqXCI6cCo9cjticmVhaztjYXNlXCIvXCI6cD1yL3B9altlXT17cm9vdFByb3BlcnR5VmFsdWU6bSxzdGFydFZhbHVlOnIsY3VycmVudFZhbHVlOnIsZW5kVmFsdWU6cCx1bml0VHlwZTp0LGVhc2luZzpxfSxnJiYoaltlXS5wYXR0ZXJuPWcpLHkuZGVidWcmJmNvbnNvbGUubG9nKFwidHdlZW5zQ29udGFpbmVyIChcIitlK1wiKTogXCIrSlNPTi5zdHJpbmdpZnkoaltlXSksYSl9O2Zvcih2YXIgSSBpbiBzKWlmKHMuaGFzT3duUHJvcGVydHkoSSkpe3ZhciBKPUEuTmFtZXMuY2FtZWxDYXNlKEkpLEs9ZnVuY3Rpb24oYixjKXt2YXIgZCxmLGc7cmV0dXJuIHUuaXNGdW5jdGlvbihiKSYmKGI9Yi5jYWxsKGEsZSxDKSksdS5pc0FycmF5KGIpPyhkPWJbMF0sIXUuaXNBcnJheShiWzFdKSYmL15bXFxkLV0vLnRlc3QoYlsxXSl8fHUuaXNGdW5jdGlvbihiWzFdKXx8QS5SZWdFeC5pc0hleC50ZXN0KGJbMV0pP2c9YlsxXTp1LmlzU3RyaW5nKGJbMV0pJiYhQS5SZWdFeC5pc0hleC50ZXN0KGJbMV0pJiZ5LkVhc2luZ3NbYlsxXV18fHUuaXNBcnJheShiWzFdKT8oZj1jP2JbMV06bChiWzFdLGkuZHVyYXRpb24pLGc9YlsyXSk6Zz1iWzFdfHxiWzJdKTpkPWIsY3x8KGY9Znx8aS5lYXNpbmcpLHUuaXNGdW5jdGlvbihkKSYmKGQ9ZC5jYWxsKGEsZSxDKSksdS5pc0Z1bmN0aW9uKGcpJiYoZz1nLmNhbGwoYSxlLEMpKSxbZHx8MCxmLGddfShzW0ldKTtpZih0KEEuTGlzdHMuY29sb3JzLEopKXt2YXIgTD1LWzBdLE89S1sxXSxQPUtbMl07aWYoQS5SZWdFeC5pc0hleC50ZXN0KEwpKXtmb3IodmFyIFE9W1wiUmVkXCIsXCJHcmVlblwiLFwiQmx1ZVwiXSxSPUEuVmFsdWVzLmhleFRvUmdiKEwpLFM9UD9BLlZhbHVlcy5oZXhUb1JnYihQKTpkLFQ9MDtUPFEubGVuZ3RoO1QrKyl7dmFyIFU9W1JbVF1dO08mJlUucHVzaChPKSxTIT09ZCYmVS5wdXNoKFNbVF0pLEgoSitRW1RdLFUpfWNvbnRpbnVlfX1IKEosSyl9ai5lbGVtZW50PWF9ai5lbGVtZW50JiYoQS5WYWx1ZXMuYWRkQ2xhc3MoYSxcInZlbG9jaXR5LWFuaW1hdGluZ1wiKSxOLnB1c2goaiksaz1nKGEpLGsmJihcIlwiPT09aS5xdWV1ZSYmKGsudHdlZW5zQ29udGFpbmVyPWosay5vcHRzPWkpLGsuaXNBbmltYXRpbmc9ITApLEQ9PT1DLTE/KHkuU3RhdGUuY2FsbHMucHVzaChbTixyLGksbnVsbCx6LnJlc29sdmVyLG51bGwsMF0pLCExPT09eS5TdGF0ZS5pc1RpY2tpbmcmJih5LlN0YXRlLmlzVGlja2luZz0hMCxtKCkpKTpEKyspfXZhciBoLGk9by5leHRlbmQoe30seS5kZWZhdWx0cyx2KSxqPXt9O3N3aXRjaChnKGEpPT09ZCYmeS5pbml0KGEpLHBhcnNlRmxvYXQoaS5kZWxheSkmJiExIT09aS5xdWV1ZSYmby5xdWV1ZShhLGkucXVldWUsZnVuY3Rpb24oYixjKXtpZighMD09PWMpcmV0dXJuITA7eS52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnPSEwO3ZhciBkPXkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLmNvdW50Kys7eS5TdGF0ZS5kZWxheWVkRWxlbWVudHNbZF09YTt2YXIgZT1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXt5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1thXT0hMSxiKCl9fShkKTtnKGEpLmRlbGF5QmVnaW49KG5ldyBEYXRlKS5nZXRUaW1lKCksZyhhKS5kZWxheT1wYXJzZUZsb2F0KGkuZGVsYXkpLGcoYSkuZGVsYXlUaW1lcj17c2V0VGltZW91dDpzZXRUaW1lb3V0KGIscGFyc2VGbG9hdChpLmRlbGF5KSksbmV4dDplfX0pLGkuZHVyYXRpb24udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKXtjYXNlXCJmYXN0XCI6aS5kdXJhdGlvbj0yMDA7YnJlYWs7Y2FzZVwibm9ybWFsXCI6aS5kdXJhdGlvbj13O2JyZWFrO2Nhc2VcInNsb3dcIjppLmR1cmF0aW9uPTYwMDticmVhaztkZWZhdWx0OmkuZHVyYXRpb249cGFyc2VGbG9hdChpLmR1cmF0aW9uKXx8MX1pZighMSE9PXkubW9jayYmKCEwPT09eS5tb2NrP2kuZHVyYXRpb249aS5kZWxheT0xOihpLmR1cmF0aW9uKj1wYXJzZUZsb2F0KHkubW9jayl8fDEsaS5kZWxheSo9cGFyc2VGbG9hdCh5Lm1vY2spfHwxKSksaS5lYXNpbmc9bChpLmVhc2luZyxpLmR1cmF0aW9uKSxpLmJlZ2luJiYhdS5pc0Z1bmN0aW9uKGkuYmVnaW4pJiYoaS5iZWdpbj1udWxsKSxpLnByb2dyZXNzJiYhdS5pc0Z1bmN0aW9uKGkucHJvZ3Jlc3MpJiYoaS5wcm9ncmVzcz1udWxsKSxpLmNvbXBsZXRlJiYhdS5pc0Z1bmN0aW9uKGkuY29tcGxldGUpJiYoaS5jb21wbGV0ZT1udWxsKSxpLmRpc3BsYXkhPT1kJiZudWxsIT09aS5kaXNwbGF5JiYoaS5kaXNwbGF5PWkuZGlzcGxheS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCksXCJhdXRvXCI9PT1pLmRpc3BsYXkmJihpLmRpc3BsYXk9eS5DU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGEpKSksaS52aXNpYmlsaXR5IT09ZCYmbnVsbCE9PWkudmlzaWJpbGl0eSYmKGkudmlzaWJpbGl0eT1pLnZpc2liaWxpdHkudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSxpLm1vYmlsZUhBPWkubW9iaWxlSEEmJnkuU3RhdGUuaXNNb2JpbGUmJiF5LlN0YXRlLmlzR2luZ2VyYnJlYWQsITE9PT1pLnF1ZXVlKWlmKGkuZGVsYXkpe3ZhciBrPXkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLmNvdW50Kys7eS5TdGF0ZS5kZWxheWVkRWxlbWVudHNba109YTt2YXIgbj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXt5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1thXT0hMSxmKCl9fShrKTtnKGEpLmRlbGF5QmVnaW49KG5ldyBEYXRlKS5nZXRUaW1lKCksZyhhKS5kZWxheT1wYXJzZUZsb2F0KGkuZGVsYXkpLGcoYSkuZGVsYXlUaW1lcj17c2V0VGltZW91dDpzZXRUaW1lb3V0KGYscGFyc2VGbG9hdChpLmRlbGF5KSksbmV4dDpufX1lbHNlIGYoKTtlbHNlIG8ucXVldWUoYSxpLnF1ZXVlLGZ1bmN0aW9uKGEsYil7aWYoITA9PT1iKXJldHVybiB6LnByb21pc2UmJnoucmVzb2x2ZXIociksITA7eS52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnPSEwLGYoYSl9KTtcIlwiIT09aS5xdWV1ZSYmXCJmeFwiIT09aS5xdWV1ZXx8XCJpbnByb2dyZXNzXCI9PT1vLnF1ZXVlKGEpWzBdfHxvLmRlcXVldWUoYSl9dmFyIGosayxwLHEscixzLHYseD1hcmd1bWVudHNbMF0mJihhcmd1bWVudHNbMF0ucHx8by5pc1BsYWluT2JqZWN0KGFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzKSYmIWFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzLm5hbWVzfHx1LmlzU3RyaW5nKGFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzKSk7dS5pc1dyYXBwZWQodGhpcyk/KGs9ITEscT0wLHI9dGhpcyxwPXRoaXMpOihrPSEwLHE9MSxyPXg/YXJndW1lbnRzWzBdLmVsZW1lbnRzfHxhcmd1bWVudHNbMF0uZTphcmd1bWVudHNbMF0pO3ZhciB6PXtwcm9taXNlOm51bGwscmVzb2x2ZXI6bnVsbCxyZWplY3RlcjpudWxsfTtpZihrJiZ5LlByb21pc2UmJih6LnByb21pc2U9bmV3IHkuUHJvbWlzZShmdW5jdGlvbihhLGIpe3oucmVzb2x2ZXI9YSx6LnJlamVjdGVyPWJ9KSkseD8ocz1hcmd1bWVudHNbMF0ucHJvcGVydGllc3x8YXJndW1lbnRzWzBdLnAsdj1hcmd1bWVudHNbMF0ub3B0aW9uc3x8YXJndW1lbnRzWzBdLm8pOihzPWFyZ3VtZW50c1txXSx2PWFyZ3VtZW50c1txKzFdKSwhKHI9ZihyKSkpcmV0dXJuIHZvaWQoei5wcm9taXNlJiYocyYmdiYmITE9PT12LnByb21pc2VSZWplY3RFbXB0eT96LnJlc29sdmVyKCk6ei5yZWplY3RlcigpKSk7dmFyIEM9ci5sZW5ndGgsRD0wO2lmKCEvXihzdG9wfGZpbmlzaHxmaW5pc2hBbGx8cGF1c2V8cmVzdW1lKSQvaS50ZXN0KHMpJiYhby5pc1BsYWluT2JqZWN0KHYpKXt2YXIgRT1xKzE7dj17fTtmb3IodmFyIEY9RTtGPGFyZ3VtZW50cy5sZW5ndGg7RisrKXUuaXNBcnJheShhcmd1bWVudHNbRl0pfHwhL14oZmFzdHxub3JtYWx8c2xvdykkL2kudGVzdChhcmd1bWVudHNbRl0pJiYhL15cXGQvLnRlc3QoYXJndW1lbnRzW0ZdKT91LmlzU3RyaW5nKGFyZ3VtZW50c1tGXSl8fHUuaXNBcnJheShhcmd1bWVudHNbRl0pP3YuZWFzaW5nPWFyZ3VtZW50c1tGXTp1LmlzRnVuY3Rpb24oYXJndW1lbnRzW0ZdKSYmKHYuY29tcGxldGU9YXJndW1lbnRzW0ZdKTp2LmR1cmF0aW9uPWFyZ3VtZW50c1tGXX12YXIgRztzd2l0Y2gocyl7Y2FzZVwic2Nyb2xsXCI6Rz1cInNjcm9sbFwiO2JyZWFrO2Nhc2VcInJldmVyc2VcIjpHPVwicmV2ZXJzZVwiO2JyZWFrO2Nhc2VcInBhdXNlXCI6dmFyIEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG8uZWFjaChyLGZ1bmN0aW9uKGEsYil7aChiLEgpfSksby5lYWNoKHkuU3RhdGUuY2FsbHMsZnVuY3Rpb24oYSxiKXt2YXIgYz0hMTtiJiZvLmVhY2goYlsxXSxmdW5jdGlvbihhLGUpe3ZhciBmPXY9PT1kP1wiXCI6djtyZXR1cm4hMCE9PWYmJmJbMl0ucXVldWUhPT1mJiYodiE9PWR8fCExIT09YlsyXS5xdWV1ZSl8fChvLmVhY2gocixmdW5jdGlvbihhLGQpe2lmKGQ9PT1lKXJldHVybiBiWzVdPXtyZXN1bWU6ITF9LGM9ITAsITF9KSwhYyYmdm9pZCAwKX0pfSksYSgpO2Nhc2VcInJlc3VtZVwiOnJldHVybiBvLmVhY2gocixmdW5jdGlvbihhLGIpe2koYixIKX0pLG8uZWFjaCh5LlN0YXRlLmNhbGxzLGZ1bmN0aW9uKGEsYil7dmFyIGM9ITE7YiYmby5lYWNoKGJbMV0sZnVuY3Rpb24oYSxlKXt2YXIgZj12PT09ZD9cIlwiOnY7cmV0dXJuITAhPT1mJiZiWzJdLnF1ZXVlIT09ZiYmKHYhPT1kfHwhMSE9PWJbMl0ucXVldWUpfHwoIWJbNV18fChvLmVhY2gocixmdW5jdGlvbihhLGQpe2lmKGQ9PT1lKXJldHVybiBiWzVdLnJlc3VtZT0hMCxjPSEwLCExfSksIWMmJnZvaWQgMCkpfSl9KSxhKCk7Y2FzZVwiZmluaXNoXCI6Y2FzZVwiZmluaXNoQWxsXCI6Y2FzZVwic3RvcFwiOm8uZWFjaChyLGZ1bmN0aW9uKGEsYil7ZyhiKSYmZyhiKS5kZWxheVRpbWVyJiYoY2xlYXJUaW1lb3V0KGcoYikuZGVsYXlUaW1lci5zZXRUaW1lb3V0KSxnKGIpLmRlbGF5VGltZXIubmV4dCYmZyhiKS5kZWxheVRpbWVyLm5leHQoKSxkZWxldGUgZyhiKS5kZWxheVRpbWVyKSxcImZpbmlzaEFsbFwiIT09c3x8ITAhPT12JiYhdS5pc1N0cmluZyh2KXx8KG8uZWFjaChvLnF1ZXVlKGIsdS5pc1N0cmluZyh2KT92OlwiXCIpLGZ1bmN0aW9uKGEsYil7dS5pc0Z1bmN0aW9uKGIpJiZiKCl9KSxvLnF1ZXVlKGIsdS5pc1N0cmluZyh2KT92OlwiXCIsW10pKX0pO3ZhciBJPVtdO3JldHVybiBvLmVhY2goeS5TdGF0ZS5jYWxscyxmdW5jdGlvbihhLGIpe2ImJm8uZWFjaChiWzFdLGZ1bmN0aW9uKGMsZSl7dmFyIGY9dj09PWQ/XCJcIjp2O2lmKCEwIT09ZiYmYlsyXS5xdWV1ZSE9PWYmJih2IT09ZHx8ITEhPT1iWzJdLnF1ZXVlKSlyZXR1cm4hMDtvLmVhY2gocixmdW5jdGlvbihjLGQpe2lmKGQ9PT1lKWlmKCghMD09PXZ8fHUuaXNTdHJpbmcodikpJiYoby5lYWNoKG8ucXVldWUoZCx1LmlzU3RyaW5nKHYpP3Y6XCJcIiksZnVuY3Rpb24oYSxiKXt1LmlzRnVuY3Rpb24oYikmJmIobnVsbCwhMCl9KSxvLnF1ZXVlKGQsdS5pc1N0cmluZyh2KT92OlwiXCIsW10pKSxcInN0b3BcIj09PXMpe3ZhciBoPWcoZCk7aCYmaC50d2VlbnNDb250YWluZXImJighMD09PWZ8fFwiXCI9PT1mKSYmby5lYWNoKGgudHdlZW5zQ29udGFpbmVyLGZ1bmN0aW9uKGEsYil7Yi5lbmRWYWx1ZT1iLmN1cnJlbnRWYWx1ZX0pLEkucHVzaChhKX1lbHNlXCJmaW5pc2hcIiE9PXMmJlwiZmluaXNoQWxsXCIhPT1zfHwoYlsyXS5kdXJhdGlvbj0xKX0pfSl9KSxcInN0b3BcIj09PXMmJihvLmVhY2goSSxmdW5jdGlvbihhLGIpe24oYiwhMCl9KSx6LnByb21pc2UmJnoucmVzb2x2ZXIocikpLGEoKTtkZWZhdWx0OmlmKCFvLmlzUGxhaW5PYmplY3Qocyl8fHUuaXNFbXB0eU9iamVjdChzKSl7aWYodS5pc1N0cmluZyhzKSYmeS5SZWRpcmVjdHNbc10pe2o9by5leHRlbmQoe30sdik7dmFyIEo9ai5kdXJhdGlvbixLPWouZGVsYXl8fDA7cmV0dXJuITA9PT1qLmJhY2t3YXJkcyYmKHI9by5leHRlbmQoITAsW10scikucmV2ZXJzZSgpKSxvLmVhY2gocixmdW5jdGlvbihhLGIpe3BhcnNlRmxvYXQoai5zdGFnZ2VyKT9qLmRlbGF5PUsrcGFyc2VGbG9hdChqLnN0YWdnZXIpKmE6dS5pc0Z1bmN0aW9uKGouc3RhZ2dlcikmJihqLmRlbGF5PUsrai5zdGFnZ2VyLmNhbGwoYixhLEMpKSxqLmRyYWcmJihqLmR1cmF0aW9uPXBhcnNlRmxvYXQoSil8fCgvXihjYWxsb3V0fHRyYW5zaXRpb24pLy50ZXN0KHMpPzFlMzp3KSxqLmR1cmF0aW9uPU1hdGgubWF4KGouZHVyYXRpb24qKGouYmFja3dhcmRzPzEtYS9DOihhKzEpL0MpLC43NSpqLmR1cmF0aW9uLDIwMCkpLHkuUmVkaXJlY3RzW3NdLmNhbGwoYixiLGp8fHt9LGEsQyxyLHoucHJvbWlzZT96OmQpfSksYSgpfXZhciBMPVwiVmVsb2NpdHk6IEZpcnN0IGFyZ3VtZW50IChcIitzK1wiKSB3YXMgbm90IGEgcHJvcGVydHkgbWFwLCBhIGtub3duIGFjdGlvbiwgb3IgYSByZWdpc3RlcmVkIHJlZGlyZWN0LiBBYm9ydGluZy5cIjtyZXR1cm4gei5wcm9taXNlP3oucmVqZWN0ZXIobmV3IEVycm9yKEwpKTpiLmNvbnNvbGUmJmNvbnNvbGUubG9nKEwpLGEoKX1HPVwic3RhcnRcIn12YXIgTT17bGFzdFBhcmVudDpudWxsLGxhc3RQb3NpdGlvbjpudWxsLGxhc3RGb250U2l6ZTpudWxsLGxhc3RQZXJjZW50VG9QeFdpZHRoOm51bGwsbGFzdFBlcmNlbnRUb1B4SGVpZ2h0Om51bGwsbGFzdEVtVG9QeDpudWxsLHJlbVRvUHg6bnVsbCx2d1RvUHg6bnVsbCx2aFRvUHg6bnVsbH0sTj1bXTtvLmVhY2gocixmdW5jdGlvbihhLGIpe3UuaXNOb2RlKGIpJiZlKGIsYSl9KSxqPW8uZXh0ZW5kKHt9LHkuZGVmYXVsdHMsdiksai5sb29wPXBhcnNlSW50KGoubG9vcCwxMCk7dmFyIE89MipqLmxvb3AtMTtpZihqLmxvb3ApZm9yKHZhciBQPTA7UDxPO1ArKyl7dmFyIFE9e2RlbGF5OmouZGVsYXkscHJvZ3Jlc3M6ai5wcm9ncmVzc307UD09PU8tMSYmKFEuZGlzcGxheT1qLmRpc3BsYXksUS52aXNpYmlsaXR5PWoudmlzaWJpbGl0eSxRLmNvbXBsZXRlPWouY29tcGxldGUpLEIocixcInJldmVyc2VcIixRKX1yZXR1cm4gYSgpfTt5PW8uZXh0ZW5kKEIseSkseS5hbmltYXRlPUI7dmFyIEM9Yi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fHE7aWYoIXkuU3RhdGUuaXNNb2JpbGUmJmMuaGlkZGVuIT09ZCl7dmFyIEQ9ZnVuY3Rpb24oKXtjLmhpZGRlbj8oQz1mdW5jdGlvbihhKXtyZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe2EoITApfSwxNil9LG0oKSk6Qz1iLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8cX07RCgpLGMuYWRkRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIixEKX1yZXR1cm4gYS5WZWxvY2l0eT15LGEhPT1iJiYoYS5mbi52ZWxvY2l0eT1CLGEuZm4udmVsb2NpdHkuZGVmYXVsdHM9eS5kZWZhdWx0cyksby5lYWNoKFtcIkRvd25cIixcIlVwXCJdLGZ1bmN0aW9uKGEsYil7eS5SZWRpcmVjdHNbXCJzbGlkZVwiK2JdPWZ1bmN0aW9uKGEsYyxlLGYsZyxoKXt2YXIgaT1vLmV4dGVuZCh7fSxjKSxqPWkuYmVnaW4saz1pLmNvbXBsZXRlLGw9e30sbT17aGVpZ2h0OlwiXCIsbWFyZ2luVG9wOlwiXCIsbWFyZ2luQm90dG9tOlwiXCIscGFkZGluZ1RvcDpcIlwiLHBhZGRpbmdCb3R0b206XCJcIn07aS5kaXNwbGF5PT09ZCYmKGkuZGlzcGxheT1cIkRvd25cIj09PWI/XCJpbmxpbmVcIj09PXkuQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShhKT9cImlubGluZS1ibG9ja1wiOlwiYmxvY2tcIjpcIm5vbmVcIiksaS5iZWdpbj1mdW5jdGlvbigpezA9PT1lJiZqJiZqLmNhbGwoZyxnKTtmb3IodmFyIGMgaW4gbSlpZihtLmhhc093blByb3BlcnR5KGMpKXtsW2NdPWEuc3R5bGVbY107dmFyIGQ9QS5nZXRQcm9wZXJ0eVZhbHVlKGEsYyk7bVtjXT1cIkRvd25cIj09PWI/W2QsMF06WzAsZF19bC5vdmVyZmxvdz1hLnN0eWxlLm92ZXJmbG93LGEuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIn0saS5jb21wbGV0ZT1mdW5jdGlvbigpe2Zvcih2YXIgYiBpbiBsKWwuaGFzT3duUHJvcGVydHkoYikmJihhLnN0eWxlW2JdPWxbYl0pO2U9PT1mLTEmJihrJiZrLmNhbGwoZyxnKSxoJiZoLnJlc29sdmVyKGcpKX0seShhLG0saSl9fSksby5lYWNoKFtcIkluXCIsXCJPdXRcIl0sZnVuY3Rpb24oYSxiKXt5LlJlZGlyZWN0c1tcImZhZGVcIitiXT1mdW5jdGlvbihhLGMsZSxmLGcsaCl7dmFyIGk9by5leHRlbmQoe30sYyksaj1pLmNvbXBsZXRlLGs9e29wYWNpdHk6XCJJblwiPT09Yj8xOjB9OzAhPT1lJiYoaS5iZWdpbj1udWxsKSxpLmNvbXBsZXRlPWUhPT1mLTE/bnVsbDpmdW5jdGlvbigpe2omJmouY2FsbChnLGcpLGgmJmgucmVzb2x2ZXIoZyl9LGkuZGlzcGxheT09PWQmJihpLmRpc3BsYXk9XCJJblwiPT09Yj9cImF1dG9cIjpcIm5vbmVcIikseSh0aGlzLGssaSl9fSkseX0od2luZG93LmpRdWVyeXx8d2luZG93LlplcHRvfHx3aW5kb3csd2luZG93LHdpbmRvdz93aW5kb3cuZG9jdW1lbnQ6dW5kZWZpbmVkKX0pOyIsIiFmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1hKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJ2ZWxvY2l0eVwiXSxhKTphKCl9KGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIGZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWEuVmVsb2NpdHk7aWYoIWV8fCFlLlV0aWxpdGllcylyZXR1cm4gdm9pZChiLmNvbnNvbGUmJmNvbnNvbGUubG9nKFwiVmVsb2NpdHkgVUkgUGFjazogVmVsb2NpdHkgbXVzdCBiZSBsb2FkZWQgZmlyc3QuIEFib3J0aW5nLlwiKSk7dmFyIGY9ZS5VdGlsaXRpZXMsZz1lLnZlcnNpb24saD17bWFqb3I6MSxtaW5vcjoxLHBhdGNoOjB9O2lmKGZ1bmN0aW9uKGEsYil7dmFyIGM9W107cmV0dXJuISghYXx8IWIpJiYoZi5lYWNoKFthLGJdLGZ1bmN0aW9uKGEsYil7dmFyIGQ9W107Zi5lYWNoKGIsZnVuY3Rpb24oYSxiKXtmb3IoO2IudG9TdHJpbmcoKS5sZW5ndGg8NTspYj1cIjBcIitiO2QucHVzaChiKX0pLGMucHVzaChkLmpvaW4oXCJcIikpfSkscGFyc2VGbG9hdChjWzBdKT5wYXJzZUZsb2F0KGNbMV0pKX0oaCxnKSl7dmFyIGk9XCJWZWxvY2l0eSBVSSBQYWNrOiBZb3UgbmVlZCB0byB1cGRhdGUgVmVsb2NpdHkgKHZlbG9jaXR5LmpzKSB0byBhIG5ld2VyIHZlcnNpb24uIFZpc2l0IGh0dHA6Ly9naXRodWIuY29tL2p1bGlhbnNoYXBpcm8vdmVsb2NpdHkuXCI7dGhyb3cgYWxlcnQoaSksbmV3IEVycm9yKGkpfWUuUmVnaXN0ZXJFZmZlY3Q9ZS5SZWdpc3RlclVJPWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYyhhLGIsYyxkKXt2YXIgZyxoPTA7Zi5lYWNoKGEubm9kZVR5cGU/W2FdOmEsZnVuY3Rpb24oYSxiKXtkJiYoYys9YSpkKSxnPWIucGFyZW50Tm9kZTt2YXIgaT1bXCJoZWlnaHRcIixcInBhZGRpbmdUb3BcIixcInBhZGRpbmdCb3R0b21cIixcIm1hcmdpblRvcFwiLFwibWFyZ2luQm90dG9tXCJdO1wiYm9yZGVyLWJveFwiPT09ZS5DU1MuZ2V0UHJvcGVydHlWYWx1ZShiLFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSYmKGk9W1wiaGVpZ2h0XCJdKSxmLmVhY2goaSxmdW5jdGlvbihhLGMpe2grPXBhcnNlRmxvYXQoZS5DU1MuZ2V0UHJvcGVydHlWYWx1ZShiLGMpKX0pfSksZS5hbmltYXRlKGcse2hlaWdodDooXCJJblwiPT09Yj9cIitcIjpcIi1cIikrXCI9XCIraH0se3F1ZXVlOiExLGVhc2luZzpcImVhc2UtaW4tb3V0XCIsZHVyYXRpb246YyooXCJJblwiPT09Yj8uNjoxKX0pfXJldHVybiBlLlJlZGlyZWN0c1thXT1mdW5jdGlvbihkLGcsaCxpLGosayxsKXt2YXIgbT1oPT09aS0xLG49MDtsPWx8fGIubG9vcCxcImZ1bmN0aW9uXCI9PXR5cGVvZiBiLmRlZmF1bHREdXJhdGlvbj9iLmRlZmF1bHREdXJhdGlvbj1iLmRlZmF1bHREdXJhdGlvbi5jYWxsKGosaik6Yi5kZWZhdWx0RHVyYXRpb249cGFyc2VGbG9hdChiLmRlZmF1bHREdXJhdGlvbik7Zm9yKHZhciBvPTA7bzxiLmNhbGxzLmxlbmd0aDtvKyspXCJudW1iZXJcIj09dHlwZW9mKHQ9Yi5jYWxsc1tvXVsxXSkmJihuKz10KTt2YXIgcD1uPj0xPzA6Yi5jYWxscy5sZW5ndGg/KDEtbikvYi5jYWxscy5sZW5ndGg6MTtmb3Iobz0wO288Yi5jYWxscy5sZW5ndGg7bysrKXt2YXIgcT1iLmNhbGxzW29dLHI9cVswXSxzPTFlMyx0PXFbMV0sdT1xWzJdfHx7fSx2PXt9O2lmKHZvaWQgMCE9PWcuZHVyYXRpb24/cz1nLmR1cmF0aW9uOnZvaWQgMCE9PWIuZGVmYXVsdER1cmF0aW9uJiYocz1iLmRlZmF1bHREdXJhdGlvbiksdi5kdXJhdGlvbj1zKihcIm51bWJlclwiPT10eXBlb2YgdD90OnApLHYucXVldWU9Zy5xdWV1ZXx8XCJcIix2LmVhc2luZz11LmVhc2luZ3x8XCJlYXNlXCIsdi5kZWxheT1wYXJzZUZsb2F0KHUuZGVsYXkpfHwwLHYubG9vcD0hYi5sb29wJiZ1Lmxvb3Asdi5fY2FjaGVWYWx1ZXM9dS5fY2FjaGVWYWx1ZXN8fCEwLDA9PT1vKXtpZih2LmRlbGF5Kz1wYXJzZUZsb2F0KGcuZGVsYXkpfHwwLDA9PT1oJiYodi5iZWdpbj1mdW5jdGlvbigpe2cuYmVnaW4mJmcuYmVnaW4uY2FsbChqLGopO3ZhciBiPWEubWF0Y2goLyhJbnxPdXQpJC8pO2ImJlwiSW5cIj09PWJbMF0mJnZvaWQgMCE9PXIub3BhY2l0eSYmZi5lYWNoKGoubm9kZVR5cGU/W2pdOmosZnVuY3Rpb24oYSxiKXtlLkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGIsXCJvcGFjaXR5XCIsMCl9KSxnLmFuaW1hdGVQYXJlbnRIZWlnaHQmJmImJmMoaixiWzBdLHMrdi5kZWxheSxnLnN0YWdnZXIpfSksbnVsbCE9PWcuZGlzcGxheSlpZih2b2lkIDAhPT1nLmRpc3BsYXkmJlwibm9uZVwiIT09Zy5kaXNwbGF5KXYuZGlzcGxheT1nLmRpc3BsYXk7ZWxzZSBpZigvSW4kLy50ZXN0KGEpKXt2YXIgdz1lLkNTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoZCk7di5kaXNwbGF5PVwiaW5saW5lXCI9PT13P1wiaW5saW5lLWJsb2NrXCI6d31nLnZpc2liaWxpdHkmJlwiaGlkZGVuXCIhPT1nLnZpc2liaWxpdHkmJih2LnZpc2liaWxpdHk9Zy52aXNpYmlsaXR5KX1pZihvPT09Yi5jYWxscy5sZW5ndGgtMSl7dmFyIHg9ZnVuY3Rpb24oKXt2b2lkIDAhPT1nLmRpc3BsYXkmJlwibm9uZVwiIT09Zy5kaXNwbGF5fHwhL091dCQvLnRlc3QoYSl8fGYuZWFjaChqLm5vZGVUeXBlP1tqXTpqLGZ1bmN0aW9uKGEsYil7ZS5DU1Muc2V0UHJvcGVydHlWYWx1ZShiLFwiZGlzcGxheVwiLFwibm9uZVwiKX0pLGcuY29tcGxldGUmJmcuY29tcGxldGUuY2FsbChqLGopLGsmJmsucmVzb2x2ZXIoanx8ZCl9O3YuY29tcGxldGU9ZnVuY3Rpb24oKXtpZihsJiZlLlJlZGlyZWN0c1thXShkLGcsaCxpLGosaywhMD09PWx8fE1hdGgubWF4KDAsbC0xKSksYi5yZXNldCl7Zm9yKHZhciBjIGluIGIucmVzZXQpaWYoYi5yZXNldC5oYXNPd25Qcm9wZXJ0eShjKSl7dmFyIGY9Yi5yZXNldFtjXTt2b2lkIDAhPT1lLkNTUy5Ib29rcy5yZWdpc3RlcmVkW2NdfHxcInN0cmluZ1wiIT10eXBlb2YgZiYmXCJudW1iZXJcIiE9dHlwZW9mIGZ8fChiLnJlc2V0W2NdPVtiLnJlc2V0W2NdLGIucmVzZXRbY11dKX12YXIgbj17ZHVyYXRpb246MCxxdWV1ZTohMX07bSYmKG4uY29tcGxldGU9eCksZS5hbmltYXRlKGQsYi5yZXNldCxuKX1lbHNlIG0mJngoKX0sXCJoaWRkZW5cIj09PWcudmlzaWJpbGl0eSYmKHYudmlzaWJpbGl0eT1nLnZpc2liaWxpdHkpfWUuYW5pbWF0ZShkLHIsdil9fSxlfSxlLlJlZ2lzdGVyRWZmZWN0LnBhY2thZ2VkRWZmZWN0cz17XCJjYWxsb3V0LmJvdW5jZVwiOntkZWZhdWx0RHVyYXRpb246NTUwLGNhbGxzOltbe3RyYW5zbGF0ZVk6LTMwfSwuMjVdLFt7dHJhbnNsYXRlWTowfSwuMTI1XSxbe3RyYW5zbGF0ZVk6LTE1fSwuMTI1XSxbe3RyYW5zbGF0ZVk6MH0sLjI1XV19LFwiY2FsbG91dC5zaGFrZVwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe3RyYW5zbGF0ZVg6LTExfV0sW3t0cmFuc2xhdGVYOjExfV0sW3t0cmFuc2xhdGVYOi0xMX1dLFt7dHJhbnNsYXRlWDoxMX1dLFt7dHJhbnNsYXRlWDotMTF9XSxbe3RyYW5zbGF0ZVg6MTF9XSxbe3RyYW5zbGF0ZVg6LTExfV0sW3t0cmFuc2xhdGVYOjB9XV19LFwiY2FsbG91dC5mbGFzaFwiOntkZWZhdWx0RHVyYXRpb246MTEwMCxjYWxsczpbW3tvcGFjaXR5OlswLFwiZWFzZUluT3V0UXVhZFwiLDFdfV0sW3tvcGFjaXR5OlsxLFwiZWFzZUluT3V0UXVhZFwiXX1dLFt7b3BhY2l0eTpbMCxcImVhc2VJbk91dFF1YWRcIl19XSxbe29wYWNpdHk6WzEsXCJlYXNlSW5PdXRRdWFkXCJdfV1dfSxcImNhbGxvdXQucHVsc2VcIjp7ZGVmYXVsdER1cmF0aW9uOjgyNSxjYWxsczpbW3tzY2FsZVg6MS4xLHNjYWxlWToxLjF9LC41LHtlYXNpbmc6XCJlYXNlSW5FeHBvXCJ9XSxbe3NjYWxlWDoxLHNjYWxlWToxfSwuNV1dfSxcImNhbGxvdXQuc3dpbmdcIjp7ZGVmYXVsdER1cmF0aW9uOjk1MCxjYWxsczpbW3tyb3RhdGVaOjE1fV0sW3tyb3RhdGVaOi0xMH1dLFt7cm90YXRlWjo1fV0sW3tyb3RhdGVaOi01fV0sW3tyb3RhdGVaOjB9XV19LFwiY2FsbG91dC50YWRhXCI6e2RlZmF1bHREdXJhdGlvbjoxZTMsY2FsbHM6W1t7c2NhbGVYOi45LHNjYWxlWTouOSxyb3RhdGVaOi0zfSwuMV0sW3tzY2FsZVg6MS4xLHNjYWxlWToxLjEscm90YXRlWjozfSwuMV0sW3tzY2FsZVg6MS4xLHNjYWxlWToxLjEscm90YXRlWjotM30sLjFdLFtcInJldmVyc2VcIiwuMTI1XSxbXCJyZXZlcnNlXCIsLjEyNV0sW1wicmV2ZXJzZVwiLC4xMjVdLFtcInJldmVyc2VcIiwuMTI1XSxbXCJyZXZlcnNlXCIsLjEyNV0sW3tzY2FsZVg6MSxzY2FsZVk6MSxyb3RhdGVaOjB9LC4yXV19LFwidHJhbnNpdGlvbi5mYWRlSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjUwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdfV1dfSxcInRyYW5zaXRpb24uZmFkZU91dFwiOntkZWZhdWx0RHVyYXRpb246NTAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV19XV19LFwidHJhbnNpdGlvbi5mbGlwWEluXCI6e2RlZmF1bHREdXJhdGlvbjo3MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0scm90YXRlWTpbMCwtNTVdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBYT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0scm90YXRlWTo1NX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCxyb3RhdGVZOjB9fSxcInRyYW5zaXRpb24uZmxpcFlJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHJvdGF0ZVg6WzAsLTQ1XX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MH19LFwidHJhbnNpdGlvbi5mbGlwWU91dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHJvdGF0ZVg6MjV9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAscm90YXRlWDowfX0sXCJ0cmFuc2l0aW9uLmZsaXBCb3VuY2VYSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjkwMCxjYWxsczpbW3tvcGFjaXR5OlsuNzI1LDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls0MDAsNDAwXSxyb3RhdGVZOlstMTAsOTBdfSwuNV0sW3tvcGFjaXR5Oi44LHJvdGF0ZVk6MTB9LC4yNV0sW3tvcGFjaXR5OjEscm90YXRlWTowfSwuMjVdXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MH19LFwidHJhbnNpdGlvbi5mbGlwQm91bmNlWE91dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6Wy45LDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls0MDAsNDAwXSxyb3RhdGVZOi0xMH1dLFt7b3BhY2l0eTowLHJvdGF0ZVk6OTB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAscm90YXRlWTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBCb3VuY2VZSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlsuNzI1LDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls0MDAsNDAwXSxyb3RhdGVYOlstMTAsOTBdfSwuNV0sW3tvcGFjaXR5Oi44LHJvdGF0ZVg6MTB9LC4yNV0sW3tvcGFjaXR5OjEscm90YXRlWDowfSwuMjVdXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MH19LFwidHJhbnNpdGlvbi5mbGlwQm91bmNlWU91dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6Wy45LDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls0MDAsNDAwXSxyb3RhdGVYOi0xNX1dLFt7b3BhY2l0eTowLHJvdGF0ZVg6OTB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAscm90YXRlWDowfX0sXCJ0cmFuc2l0aW9uLnN3b29wSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybU9yaWdpblg6W1wiMTAwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiMTAwJVwiLFwiMTAwJVwiXSxzY2FsZVg6WzEsMF0sc2NhbGVZOlsxLDBdLHRyYW5zbGF0ZVg6WzAsLTcwMF0sdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwifX0sXCJ0cmFuc2l0aW9uLnN3b29wT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiMTAwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjEwMCVcIixcIjEwMCVcIl0sc2NhbGVYOjAsc2NhbGVZOjAsdHJhbnNsYXRlWDotNzAwLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIixzY2FsZVg6MSxzY2FsZVk6MSx0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24ud2hpcmxJblwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDpbMSwwXSxzY2FsZVk6WzEsMF0scm90YXRlWTpbMCwxNjBdfSwxLHtlYXNpbmc6XCJlYXNlSW5PdXRTaW5lXCJ9XV19LFwidHJhbnNpdGlvbi53aGlybE91dFwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe29wYWNpdHk6WzAsXCJlYXNlSW5PdXRRdWludFwiLDFdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6MCxzY2FsZVk6MCxyb3RhdGVZOjE2MH0sMSx7ZWFzaW5nOlwic3dpbmdcIn1dXSxyZXNldDp7c2NhbGVYOjEsc2NhbGVZOjEscm90YXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNocmlua0luXCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOlsxLDEuNV0sc2NhbGVZOlsxLDEuNV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2hyaW5rT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo2MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOjEuMyxzY2FsZVk6MS4zLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7c2NhbGVYOjEsc2NhbGVZOjF9fSxcInRyYW5zaXRpb24uZXhwYW5kSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjcwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6WzEsLjYyNV0sc2NhbGVZOlsxLC42MjVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLmV4cGFuZE91dFwiOntkZWZhdWx0RHVyYXRpb246NzAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDouNSxzY2FsZVk6LjUsdHJhbnNsYXRlWjowfV1dLHJlc2V0OntzY2FsZVg6MSxzY2FsZVk6MX19LFwidHJhbnNpdGlvbi5ib3VuY2VJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sc2NhbGVYOlsxLjA1LC4zXSxzY2FsZVk6WzEuMDUsLjNdfSwuMzVdLFt7c2NhbGVYOi45LHNjYWxlWTouOSx0cmFuc2xhdGVaOjB9LC4yXSxbe3NjYWxlWDoxLHNjYWxlWToxfSwuNDVdXX0sXCJ0cmFuc2l0aW9uLmJvdW5jZU91dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe3NjYWxlWDouOTUsc2NhbGVZOi45NX0sLjM1XSxbe3NjYWxlWDoxLjEsc2NhbGVZOjEuMSx0cmFuc2xhdGVaOjB9LC4zNV0sW3tvcGFjaXR5OlswLDFdLHNjYWxlWDouMyxzY2FsZVk6LjN9LC4zXV0scmVzZXQ6e3NjYWxlWDoxLHNjYWxlWToxfX0sXCJ0cmFuc2l0aW9uLmJvdW5jZVVwSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVk6Wy0zMCwxZTNdfSwuNix7ZWFzaW5nOlwiZWFzZU91dENpcmNcIn1dLFt7dHJhbnNsYXRlWToxMH0sLjJdLFt7dHJhbnNsYXRlWTowfSwuMl1dfSxcInRyYW5zaXRpb24uYm91bmNlVXBPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjFlMyxjYWxsczpbW3t0cmFuc2xhdGVZOjIwfSwuMl0sW3tvcGFjaXR5OlswLFwiZWFzZUluQ2lyY1wiLDFdLHRyYW5zbGF0ZVk6LTFlM30sLjhdXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLmJvdW5jZURvd25JblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbMzAsLTFlM119LC42LHtlYXNpbmc6XCJlYXNlT3V0Q2lyY1wifV0sW3t0cmFuc2xhdGVZOi0xMH0sLjJdLFt7dHJhbnNsYXRlWTowfSwuMl1dfSxcInRyYW5zaXRpb24uYm91bmNlRG93bk91dFwiOntkZWZhdWx0RHVyYXRpb246MWUzLGNhbGxzOltbe3RyYW5zbGF0ZVk6LTIwfSwuMl0sW3tvcGFjaXR5OlswLFwiZWFzZUluQ2lyY1wiLDFdLHRyYW5zbGF0ZVk6MWUzfSwuOF1dLHJlc2V0Ont0cmFuc2xhdGVZOjB9fSxcInRyYW5zaXRpb24uYm91bmNlTGVmdEluXCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlszMCwtMTI1MF19LC42LHtlYXNpbmc6XCJlYXNlT3V0Q2lyY1wifV0sW3t0cmFuc2xhdGVYOi0xMH0sLjJdLFt7dHJhbnNsYXRlWDowfSwuMl1dfSxcInRyYW5zaXRpb24uYm91bmNlTGVmdE91dFwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe3RyYW5zbGF0ZVg6MzB9LC4yXSxbe29wYWNpdHk6WzAsXCJlYXNlSW5DaXJjXCIsMV0sdHJhbnNsYXRlWDotMTI1MH0sLjhdXSxyZXNldDp7dHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLmJvdW5jZVJpZ2h0SW5cIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVg6Wy0zMCwxMjUwXX0sLjYse2Vhc2luZzpcImVhc2VPdXRDaXJjXCJ9XSxbe3RyYW5zbGF0ZVg6MTB9LC4yXSxbe3RyYW5zbGF0ZVg6MH0sLjJdXX0sXCJ0cmFuc2l0aW9uLmJvdW5jZVJpZ2h0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7dHJhbnNsYXRlWDotMzB9LC4yXSxbe29wYWNpdHk6WzAsXCJlYXNlSW5DaXJjXCIsMV0sdHJhbnNsYXRlWDoxMjUwfSwuOF1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uc2xpZGVVcEluXCI6e2RlZmF1bHREdXJhdGlvbjo5MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlswLDIwXSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZVVwT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo5MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVZOi0yMCx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5zbGlkZURvd25JblwiOntkZWZhdWx0RHVyYXRpb246OTAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbMCwtMjBdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlRG93bk91dFwiOntkZWZhdWx0RHVyYXRpb246OTAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWToyMCx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5zbGlkZUxlZnRJblwiOntkZWZhdWx0RHVyYXRpb246MWUzLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbMCwtMjBdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlTGVmdE91dFwiOntkZWZhdWx0RHVyYXRpb246MTA1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVg6LTIwLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlUmlnaHRJblwiOntkZWZhdWx0RHVyYXRpb246MWUzLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbMCwyMF0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVSaWdodE91dFwiOntkZWZhdWx0RHVyYXRpb246MTA1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVg6MjAsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uc2xpZGVVcEJpZ0luXCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlswLDc1XSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZVVwQmlnT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVZOi03NSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5zbGlkZURvd25CaWdJblwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbMCwtNzVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlRG93bkJpZ091dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWTo3NSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5zbGlkZUxlZnRCaWdJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbMCwtNzVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlTGVmdEJpZ091dFwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWDotNzUsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uc2xpZGVSaWdodEJpZ0luXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlswLDc1XSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZVJpZ2h0QmlnT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVYOjc1LHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlVXBJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHRyYW5zZm9ybU9yaWdpblg6WzAsMF0sdHJhbnNmb3JtT3JpZ2luWTpbXCIxMDAlXCIsXCIxMDAlXCJdLHJvdGF0ZVg6WzAsLTE4MF19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIn19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZVVwT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjEwMCVcIixcIjEwMCVcIl0scm90YXRlWDotMTgwfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCIscm90YXRlWDowfX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlRG93bkluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVg6WzAsMTgwXX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwifX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlRG93bk91dFwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHRyYW5zZm9ybU9yaWdpblg6WzAsMF0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVYOjE4MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwiLHJvdGF0ZVg6MH19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZUxlZnRJblwiOntkZWZhdWx0RHVyYXRpb246OTUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzJlMywyZTNdLHRyYW5zZm9ybU9yaWdpblg6WzAsMF0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVZOlswLC0xODBdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCJ9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVMZWZ0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjo5NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbMmUzLDJlM10sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVk6LTE4MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwiLHJvdGF0ZVk6MH19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZVJpZ2h0SW5cIjp7ZGVmYXVsdER1cmF0aW9uOjk1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOlsyZTMsMmUzXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjEwMCVcIixcIjEwMCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVZOlswLDE4MF19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIn19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZVJpZ2h0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjo5NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbMmUzLDJlM10sdHJhbnNmb3JtT3JpZ2luWDpbXCIxMDAlXCIsXCIxMDAlXCJdLHRyYW5zZm9ybU9yaWdpblk6WzAsMF0scm90YXRlWToxODB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIixyb3RhdGVZOjB9fX07Zm9yKHZhciBqIGluIGUuUmVnaXN0ZXJFZmZlY3QucGFja2FnZWRFZmZlY3RzKWUuUmVnaXN0ZXJFZmZlY3QucGFja2FnZWRFZmZlY3RzLmhhc093blByb3BlcnR5KGopJiZlLlJlZ2lzdGVyRWZmZWN0KGosZS5SZWdpc3RlckVmZmVjdC5wYWNrYWdlZEVmZmVjdHNbal0pO2UuUnVuU2VxdWVuY2U9ZnVuY3Rpb24oYSl7dmFyIGI9Zi5leHRlbmQoITAsW10sYSk7Yi5sZW5ndGg+MSYmKGYuZWFjaChiLnJldmVyc2UoKSxmdW5jdGlvbihhLGMpe3ZhciBkPWJbYSsxXTtpZihkKXt2YXIgZz1jLm98fGMub3B0aW9ucyxoPWQub3x8ZC5vcHRpb25zLGk9ZyYmITE9PT1nLnNlcXVlbmNlUXVldWU/XCJiZWdpblwiOlwiY29tcGxldGVcIixqPWgmJmhbaV0saz17fTtrW2ldPWZ1bmN0aW9uKCl7dmFyIGE9ZC5lfHxkLmVsZW1lbnRzLGI9YS5ub2RlVHlwZT9bYV06YTtqJiZqLmNhbGwoYixiKSxlKGMpfSxkLm8/ZC5vPWYuZXh0ZW5kKHt9LGgsayk6ZC5vcHRpb25zPWYuZXh0ZW5kKHt9LGgsayl9fSksYi5yZXZlcnNlKCkpLGUoYlswXSl9fSh3aW5kb3cualF1ZXJ5fHx3aW5kb3cuWmVwdG98fHdpbmRvdyx3aW5kb3csd2luZG93P3dpbmRvdy5kb2N1bWVudDp1bmRlZmluZWQpfSk7IiwiaW1wb3J0IHsgZWxDbGFzcyB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYW5pbWF0ZU1lbnVJdGVtKCkge1xuICBjb25zdCBtZW51SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWVudS1pdGVtJyk7XG5cbiAgbWVudUl0ZW1zLmZvckVhY2goZWwgPT4gYWRkUGlwZXMoZWwpKTtcbiAgbWVudUl0ZW1zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgYW5pbWF0ZVBpcGUpKTtcbiAgbWVudUl0ZW1zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB1bkFuaW1hdGVQaXBlKSk7XG5cbiAgZnVuY3Rpb24gYWRkUGlwZXMoZWwpIHtcbiAgICBjb25zdCBwaXBlMSA9IGVsQ2xhc3MoJ2RpdicsICdlbmQtcGlwZScpO1xuICAgIGNvbnN0IHN0ciA9IGVsO1xuXG4gICAgcGlwZTEuaW5uZXJIVE1MID0gJ1snO1xuICAgIC8vIHN0ci5pbm5lckhUTUwgPSBgJHtzdHIuaW5uZXJIVE1MLnRvVXBwZXJDYXNlKCl9YDtcbiAgICBzdHIuYXBwZW5kQ2hpbGQocGlwZTEpO1xuICB9XG5cbiAgZnVuY3Rpb24gYW5pbWF0ZVBpcGUoZSkge1xuICAgIGNvbnN0IHNwYWNlV2lkdGggPSA1O1xuICAgIGNvbnN0IHcgPSBlLnRhcmdldC5vZmZzZXRXaWR0aDtcbiAgICBjb25zdCBwaXBlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdkaXYnKTtcbiAgICBwaXBlLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgICBvcGFjaXR5OiAxO1xuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgkey13IC0gc3BhY2VXaWR0aH1weCk7XG4gICAgYDtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5BbmltYXRlUGlwZShlKSB7XG4gICAgY29uc3QgdyA9IGUudGFyZ2V0Lm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IHBpcGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpO1xuICAgIHBpcGUuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICAgIG9wYWNpdHk6IDA7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDBweCk7XG4gICAgYDtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaW1VSSgpIHtcbiAgbGV0IHNQb3NpdGlvbiA9IDA7XG4gIGxldCB0aWNraW5nID0gZmFsc2U7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIChlKSA9PiB7XG4gICAgc1Bvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XG4gICAgaWYgKCF0aWNraW5nKSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc29jaWFsLW1lZGlhLW5hdicpO1xuICAgICAgICAoZnVuY3Rpb24gZGltbWVyKCkgeyB1aS5jbGFzc0xpc3QuYWRkKCdkaW0tdWknKTsgfSgpKTtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdWkuY2xhc3NMaXN0LnJlbW92ZSgnZGltLXVpJyksIDEwMDApO1xuICAgICAgICB0aWNraW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGlja2luZyA9IHRydWU7XG4gIH0pO1xufVxuIiwiaW1wb3J0IGFuaW1hdGVNZW51SXRlbXMgZnJvbSAnLi9hbmltYXRlTWVudUl0ZW0nO1xuaW1wb3J0IGRpbVVJIGZyb20gJy4vZGltVUknO1xuaW1wb3J0IGludHJvQW5pbWF0aW9uIGZyb20gJy4vaW50cm9BbmltYXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkZXIoKSB7XG4gIGFuaW1hdGVNZW51SXRlbXMoKTtcbiAgaW50cm9BbmltYXRpb24oKTtcbiAgZGltVUkoKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGludHJvQW5pbWF0aW9uKCkge1xuICB3aW5kb3cuc2V0VGltZW91dChzdGFydEludHJvLCA0MDApO1xuICB3aW5kb3cuc2V0VGltZW91dChjbGVhckludHJvQW5pbSwgNDAwMCk7XG5cbiAgZnVuY3Rpb24gc3RhcnRJbnRybygpIHtcbiAgICBtb3ZlVGV4dCgpO1xuICAgIHNob3dVaSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW92ZVRleHQoKSB7XG4gICAgY29uc3QgaW50cm9OYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmludHJvLW5hbWUnKTtcbiAgICBjb25zdCBpbnRyb0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmludHJvLWJsb2NrJyk7XG4gICAgaW50cm9OYW1lLmNsYXNzTGlzdC5hZGQoJ2ludHJvLWFuaW0tbW92ZS1uYW1lJyk7XG4gICAgaW50cm9CbG9jay5jbGFzc0xpc3QuYWRkKCdpbnRyby1hbmltLW1vdmUtYmxvY2snKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dVaSgpIHtcbiAgICBjb25zdCBoZWFkZXJMb2dvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ28nKTtcbiAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnRyby1pbml0LXVpJyk7XG4gICAgaGVhZGVyTG9nby5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgaGVhZGVyTG9nby5jbGFzc0xpc3QuYWRkKCdoZWFkZXItbG9nbycpO1xuICAgIHVpLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZCgnaW50cm8tYW5pbS1zaG93LXVpJykpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJJbnRyb0FuaW0oKSB7XG4gICAgY29uc3QgaW5pdFVJID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmludHJvLWluaXQtdWknKTtcbiAgICBjb25zdCBhbmltVUkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW50cm8tYW5pbS1zaG93LXVpJyk7XG5cbiAgICBpbml0VUkuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpbnRyby1pbml0LXVpJykpO1xuICAgIGluaXRVSS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ludHJvLWFuaW0tc2hvdy11aScpKTtcbiAgfVxufVxuIiwiLy8gY3NzIGNsYXNzPVwic3ZnLSd4J2NoZXZyb25cIlxuaW1wb3J0IHsgZWxDbGFzcywgbWFrZUJ0biB9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZnVuY3Rpb24gdXBDaGV2cm9uKCkge1xuICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICBmcmFnLmlubmVySFRNTCA9IGBcbiAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBjbGFzcz1cInN2Zy11cGNoZXZyb25cIiB3aWR0aD1cIjgwXCIgdmlld2JveD1cIjAgMCAzMCAxMlwiPlxuICAgICAgPHBhdGggc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZD1cIk0yIDEwIEwgMTUgMiBMIDI4IDEwXCIvPlxuICAgIDwvc3ZnPlxuICBgO1xuICByZXR1cm4gZnJhZztcbn1cblxuZnVuY3Rpb24gZG93bkNoZXZyb24oKSB7XG4gIGNvbnN0IGJ1dHRvbiA9IG1ha2VCdG4oJ3Njcm9sbGRvd24nLCAnc2Nyb2xsZG93bicpO1xuICBidXR0b24uaW5uZXJIVE1MID0gYFxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLWRvd25jaGV2cm9uXCIgd2lkdGg9XCI4MFwiIHZpZXdib3g9XCIwIDAgMzAgMThcIj5cbiAgICAgIDx0ZXh0IHg9XCI1XCIgeT1cIjRcIiBmb250LXNpemU9XCI0XCIgZm9udC1mYW1pbHk9XCJzYW5zLXNlcmlmXCI+c2Nyb2xsIGRvd248L3RleHQ+XG4gICAgICA8cGF0aCBjbGFzcz1cImFuaW1hdGUtZG93bmNoZXZyb25cIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBkPVwiTTIgNyBMIDE1IDE1IEwgMjggN1wiLz5cbiAgICA8L3N2Zz5cbiAgYDtcbiAgcmV0dXJuIGJ1dHRvbjtcbn1cblxuZnVuY3Rpb24gbGVmdENoZXZyb24oKSB7XG4gIHJldHVybiBgXG4gIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLWxlZnRjaGV2cm9uXCIgaGVpZ2h0PVwiODBcIiB2aWV3Ym94PVwiMCAwIDEyIDMwXCI+XG4gICAgPHBhdGggc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZD1cIk0xMCAyIEwgMiAxNSBMIDEwIDI4XCIvPlxuICA8L3N2Zz5cbiBgO1xufVxuXG5mdW5jdGlvbiByaWdodENoZXZyb24oKSB7XG4gIHJldHVybiBgXG4gICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3M9XCJzdmctcmlnaHRjaGV2cm9uXCIgaGVpZ2h0PVwiODBcIiB2aWV3Ym94PVwiMCAwIDEyIDMwXCI+XG4gICAgICA8cGF0aCBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBkPVwiTTIgMiBMIDEwIDE1IEwgMiAyOFwiLz5cbiAgICA8L3N2Zz5cbiAgYDtcbn1cblxuZXhwb3J0IHsgdXBDaGV2cm9uLCBkb3duQ2hldnJvbiwgbGVmdENoZXZyb24sIHJpZ2h0Q2hldnJvbiB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdmlld0ljb24oKSB7XG4gIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zaGFkb3dcbiAgc3Bhbi5pbm5lckhUTUwgPSBgXG4gICAgPHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIGNsYXNzPSdzdmctdmlldy1pY29uJyB3aWR0aD0nMjAnIHZpZXdib3g9JzAgMCAyMTAgMTQwJz5cbiAgICAgICA8cGF0aCBkPVwiTTUgNzAgQSAxMTAgMTAwIDAgMCAxIDIwMCA3MCBBIDExMCAxMDAgMCAwIDEgNSA3MFwiIHN0cm9rZT1cIm5vbmVcIiBmaWxsPVwibGlnaHRncmV5XCIgc3Ryb2tlLXdpZHRoPVwiMVwiLz5cbiAgICAgIDxjaXJjbGUgY3g9XCIxMDVcIiBjeT1cIjcwXCIgcj1cIjM1XCIgc3Ryb2tlPVwid2hpdGVcIiBmaWxsPVwibGlnaHRncmV5XCIgc3Ryb2tlLXdpZHRoPVwiNVwiPlxuICAgIDwvc3ZnPlxuICBgO1xuICBzcGFuLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgbWFyZ2luLXRvcDogLjI1ZW07XG4gICAgbWFyZ2luLXJpZ2h0OiAuMjVlbTtcbiAgYDtcbiAgcmV0dXJuIHNwYW47XG59XG4iLCIvKiBnbG9iYWwgVmVsb2NpdHkgKi9cblxuY29uc3QgVmVsb2NpdHkgPSByZXF1aXJlKCcuLi8uLi9ub2RlX21vZHVsZXMvdmVsb2NpdHktYW5pbWF0ZS92ZWxvY2l0eS5taW4uanMnKTtcbnJlcXVpcmUoJy4uLy4uL25vZGVfbW9kdWxlcy92ZWxvY2l0eS1hbmltYXRlL3ZlbG9jaXR5LnVpLm1pbi5qcycpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1idXR0b24nKTtcbiAgY29uc3QgaG9tZUxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWhvbWUnKTtcbiAgY29uc3QgdGV4dCA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCd0ZXh0Jyk7XG5cbiAgYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnb2ZmJykgPyBzaG93TWVudSgpIDogY2xvc2VNZW51KCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuICBmdW5jdGlvbiBzaG93TWVudSgpIHtcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb2ZmJyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ29uJyk7XG4gICAgc3RhZ2dlci5zaG93KCk7XG4gICAgdGV4dC5pbm5lckhUTUwgPSAnY2xvc2UnO1xuICAgIGhvbWVMaW5rLmZvY3VzKCk7XG4gICAgYW5pbWF0ZU1lbnUub3BlbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VNZW51KCkge1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvbicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdvZmYnKTtcbiAgICBzdGFnZ2VyLmhpZGUoKTtcbiAgICB0ZXh0LmlubmVySFRNTCA9ICdtZW51JztcbiAgICBhbmltYXRlTWVudS5jbG9zZSgpO1xuICB9XG59XG5cbmNvbnN0IHN0YWdnZXIgPSAoZnVuY3Rpb24gc3RhZ2dlcigpIHtcbiAgY29uc3QgbWFpbk5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW5hdicpO1xuICBjb25zdCBtZW51SXRlbXMgPSBtYWluTmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG4gIGNvbnN0IGRlbGF5ID0gODA7XG5cbiAgZnVuY3Rpb24gc3RhZ2dlclNob3coKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIG1haW5OYXYuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBibG9jayc7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gcnVuKCkge1xuICAgICAgaWYgKGkgPCBtZW51SXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIG1lbnVJdGVtc1tpXS5jbGFzc0xpc3QuYWRkKCdzaG93LW1lbnUtaXRlbScpO1xuICAgICAgICBzZXRUaW1lb3V0KHJ1biwgZGVsYXkpO1xuICAgICAgfVxuICAgICAgaSArPSAxO1xuICAgIH0sIGRlbGF5KTtcbiAgICBjbGVhclRpbWVvdXQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YWdnZXJIaWRlKCkge1xuICAgIGxldCBpID0gMDtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiBydW4oKSB7XG4gICAgICBpZiAoaSA8IG1lbnVJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgbWVudUl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3ctbWVudS1pdGVtJyk7XG4gICAgICAgIHNldFRpbWVvdXQocnVuLCBkZWxheSk7XG4gICAgICB9XG4gICAgICBpICs9IDE7XG4gICAgfSwgZGVsYXkpO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgbWFpbk5hdi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnOyB9LCBkZWxheSAqIG1lbnVJdGVtcy5sZW5ndGgpO1xuICAgIGNsZWFyVGltZW91dCgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzaG93OiBzdGFnZ2VyU2hvdyxcbiAgICBoaWRlOiBzdGFnZ2VySGlkZSxcbiAgfTtcbn0oKSk7XG5cbmNvbnN0IGFuaW1hdGVNZW51ID0gKGZ1bmN0aW9uIGFuaW1hdGVNZW51KCkge1xuICBjb25zdCBzdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZW51LWxpbmUnKTtcbiAgY29uc3QgYjEgPSBzdmdbMF07XG4gIGNvbnN0IGIyID0gc3ZnWzFdO1xuICBjb25zdCBiMyA9IHN2Z1syXTtcblxuICBmdW5jdGlvbiBhbmltYXRlT3BlbkJ0bigpIHtcbiAgICBjb25zdCB0b3BTZXEgPSBbXG4gICAgICB7IGU6IGIxLCBwOiB7IHRyYW5zbGF0ZVk6IDYgfSwgbzogeyBkdXJhdGlvbjogJzBtcycgfSB9LFxuICAgICAgeyBlOiBiMSwgcDogeyB0cmFuc2xhdGVYOiAtMiB9LCBvOiB7IGR1cmF0aW9uOiAnMG1zJyB9IH0sXG4gICAgICB7IGU6IGIxLCBwOiB7IHJvdGF0ZVo6IDQ1IH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgIF07XG4gICAgY29uc3QgYm90dG9tU2VxID0gW1xuICAgICAgeyBlOiBiMywgcDogeyB0cmFuc2xhdGVYOiAtOCB9LCBvOiB7IGR1cmF0aW9uOiAnMG1zJyB9IH0sXG4gICAgICB7IGU6IGIzLCBwOiB7IHRyYW5zbGF0ZVk6IC0yIH0sIG86IHsgZHVyYXRpb246ICcwbXMnIH0gfSxcbiAgICAgIHsgZTogYjMsIHA6IHsgcm90YXRlWjogLTQ1IH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgIF07XG5cbiAgICBiMS5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybS1vcmlnaW4nLCAnY2VudGVyIGNlbnRlciAwJyk7XG4gICAgYjMuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0tb3JpZ2luJywgJ2NlbnRlciBjZW50ZXIgMCcpO1xuICAgIFZlbG9jaXR5LlJ1blNlcXVlbmNlKHRvcFNlcSk7XG4gICAgVmVsb2NpdHkoYjIsIHsgb3BhY2l0eTogMCB9LCAxMDApO1xuICAgIFZlbG9jaXR5LlJ1blNlcXVlbmNlKGJvdHRvbVNlcSk7XG4gIH1cblxuICBmdW5jdGlvbiBhbmltYXRlQ2xvc2VCdG4oKSB7XG4gICAgY29uc3QgdG9wTGluZSA9IFtcbiAgICAgIHsgZTogYjEsIHA6IHsgcm90YXRlWjogMCB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICAgIHsgZTogYjEsIHA6IHsgdHJhbnNsYXRlWTogMCB9LCBvOiB7IGR1cmF0aW9uOiAnMG1zJyB9IH0sXG4gICAgICB7IGU6IGIxLCBwOiB7IHRyYW5zbGF0ZVg6IDAgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgXTtcbiAgICBjb25zdCBib3R0b21MaW5lID0gW1xuICAgICAgeyBlOiBiMywgcDogeyByb3RhdGVaOiAwIH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgICAgeyBlOiBiMywgcDogeyB0cmFuc2xhdGVYOiAwIH0sIG86IHsgZHVyYXRpb246ICcwbXMnIH0gfSxcbiAgICAgIHsgZTogYjMsIHA6IHsgdHJhbnNsYXRlWTogMCB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICBdO1xuXG4gICAgVmVsb2NpdHkuUnVuU2VxdWVuY2UodG9wTGluZSk7XG4gICAgVmVsb2NpdHkoYjIsICdyZXZlcnNlJywgMTAwKTtcbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZShib3R0b21MaW5lKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb3BlbjogYW5pbWF0ZU9wZW5CdG4sXG4gICAgY2xvc2U6IGFuaW1hdGVDbG9zZUJ0bixcbiAgfTtcbn0oKSk7XG4iLCIvKiBnbG9iYWwgaGlzdG9yeSAqL1xuLyogZXNsaW50IGltcG9ydC9maXJzdDogMCBuby11bmRlZjogMCAqL1xuLyogZXNsaW50IG5vLXJlc3RyaWN0ZWQtZ2xvYmFsczogW1wiZXJyb3JcIiwgXCJldmVudFwiXSAqL1xuXG5pbXBvcnQgJ2JhYmVsLXBvbHlmaWxsJztcbmltcG9ydCB0b2dnbGVNZW51IGZyb20gJy4vY29tcG9uZW50cy90b2dnbGVNZW51JztcbmltcG9ydCB7IGRvd25DaGV2cm9uIH0gZnJvbSAnLi9jb21wb25lbnRzL3N2Zy9zY3JvbGxDaGV2cm9uJztcbmltcG9ydCBsb2FkZXIgZnJvbSAnLi9jb21wb25lbnRzL2ltcG9ydExvYWRlcic7XG5pbXBvcnQgdmlld0ljb24gZnJvbSAnLi9jb21wb25lbnRzL3N2Zy92aWV3SWNvbic7XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICBjb25zdCBtZW51QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtYnV0dG9uJyk7XG4gIGNvbnN0IGhvbWVTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlY3Rpb24taG9tZScpO1xuICBjb25zdCBob21lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi1ob21lJyk7XG4gIGNvbnN0IHJlc3VtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXN1bWUtYnRuJyk7XG4gIGNvbnN0IGVtYWlsQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVtYWlsLWJ0bicpO1xuICBjb25zdCBzY3JvbGxDaGV2cm9uID0gZG93bkNoZXZyb24oKTtcbiAgY29uc3QgaWNvblN2ZyA9IHZpZXdJY29uKCk7XG5cbiAgcmVzdW1lQnRuLmluc2VydEJlZm9yZShpY29uU3ZnLCByZXN1bWVCdG4uY2hpbGROb2Rlc1swXSk7XG5cbiAgd2luZG93LnNldFRpbWVvdXQoc3RhcnQsIDQ1MCk7XG4gIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcblxuICAvLyBlbWFpbEJ0bi5vbmNsaWNrID0gZW1haWxNb2RhbDtcbiAgbWVudUJ1dHRvbi5vbmNsaWNrID0gdG9nZ2xlTWVudTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NyLXllYXInKS5pbm5lckhUTUwgPSBgLSAke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX1gO1xuICBsb2FkZXIoKTtcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IGJsb2NrJztcbiAgbWVudUJ1dHRvbi5mb2N1cygpO1xuICBob21lU2VjdGlvbi5hcHBlbmRDaGlsZChzY3JvbGxDaGV2cm9uKTtcbiAgc2Nyb2xsQ2hldnJvbi5jbGFzc0xpc3QuYWRkKCdpbnRyby1pbml0LXVpJyk7XG5cbiAgaG9tZUJ0bi5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgIHJlbW92ZUhhc2hVcmwoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHJldHVybiBldmVudDtcbn0pO1xuXG4vLyBTaGltcyAmIFBvbHlmaWxscyBtc0VkZ2VcbihmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcbiAgTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcbiAgcmV0dXJuIHRydWU7XG59KCkpOyAvLyBmb3JFYWNoXG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBjb25zdCBiYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcCcpO1xuICBiYWNrZHJvcC5yZW1vdmUoKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSGFzaFVybCgpIHtcbiAgY29uc3QgbG9jID0gd2luZG93LmxvY2F0aW9uO1xuICBsZXQgc2Nyb2xsVjtcbiAgbGV0IHNjcm9sbEg7XG5cbiAgaWYgKCdyZXBsYWNlU3RhdGUnIGluIGhpc3RvcnkpIHtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSgnJywgZG9jdW1lbnQudGl0bGUsIGxvYy5wYXRobmFtZSArIGxvYy5zZWFyY2gpO1xuICB9IGVsc2Uge1xuICAgIC8vIFByZXZlbnQgc2Nyb2xsaW5nIGJ5IHN0b3JpbmcgdGhlIHBhZ2UncyBjdXJyZW50IHNjcm9sbCBvZmZzZXRcbiAgICBzY3JvbGxWID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG4gICAgc2Nyb2xsSCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdDtcblxuICAgIGxvYy5oYXNoID0gJyc7XG5cbiAgICAvLyBSZXN0b3JlIHRoZSBzY3JvbGwgb2Zmc2V0LCBzaG91bGQgYmUgZmxpY2tlciBmcmVlXG4gICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBzY3JvbGxWO1xuICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA9IHNjcm9sbEg7XG4gIH1cbn1cbiIsImZ1bmN0aW9uIGVsQ2xhc3MoZWxlbWVudCA9ICdkaXYnLCBjbGFzc2VzID0gMCkge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCk7XG4gIGlmIChjbGFzc2VzICE9PSAwKSB7XG4gICAgaWYgKC9cXHMvLnRlc3QoY2xhc3NlcykpIHtcbiAgICAgIGNvbnN0IGFyciA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoLi4uYXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc2VzKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBtYWtlQnRuKG5hbWUsIGNsYXNzZXMgPSAwKSB7XG4gIGNvbnN0IGFyciA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcbiAgY29uc3QgYnV0dG9uID0gZWxDbGFzcygnYnV0dG9uJywgY2xhc3Nlcyk7XG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBuYW1lKTtcbiAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgYnV0dG9uLmlubmVySFRNTCA9IG5hbWU7XG4gIHJldHVybiBidXR0b247XG59XG5cbmV4cG9ydCB7IGVsQ2xhc3MsIG1ha2VCdG4gfTtcbiJdfQ==
