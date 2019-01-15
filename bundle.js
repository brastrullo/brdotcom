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
  var scrolldownFn = function scrolldownFn() {
    return document.querySelector('.section-about').scrollIntoView({
      behavior: 'smooth'
    });
  };
  button.onclick = scrolldownFn;
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
  var aboutBtn = document.getElementById('nav-about');
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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    removeHashUrl();
    return false;
  };

  aboutBtn.onclick = function (e) {
    e.preventDefault();
    document.querySelector('.section-about').scrollIntoView({
      behavior: 'smooth'
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi13ZWFrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2xpYnJhcnkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19tYXRoLWV4cG0xLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWF0aC1mcm91bmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19tYXRoLWxvZzFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWF0aC1zaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21pY3JvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX25ldy1wcm9taXNlLWNhcGFiaWxpdHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qtc2FwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LXRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wZXJmb3JtLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcHJvbWlzZS1yZXNvbHZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2FtZS12YWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC1wcm90by5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC1zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1jb250ZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLXBhZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190YXNrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tYWJzb2x1dGUtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdHlwZWQtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC1idWZmZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VzZXItYWdlbnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL192YWxpZGF0ZS1jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy1leHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmNvcHktd2l0aGluLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbmQtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkub2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5uYW1lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5hY29zaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguYXNpbmguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmF0YW5oLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5jYnJ0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5jbHozMi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY29zaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguZXhwbTEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmZyb3VuZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguaHlwb3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmltdWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmxvZzEwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5sb2cxcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgubG9nMi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguc2luaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgudGFuaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgudHJ1bmMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuZXBzaWxvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5pcy1maW5pdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5pcy1uYW4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtc2FmZS1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLm1heC1zYWZlLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIubWluLXNhZmUtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuZnJlZXplLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LW5hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmdldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuaXMtZXh0ZW5zaWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5pcy1mcm96ZW4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuaXMtc2VhbGVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QucHJldmVudC1leHRlbnNpb25zLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnNlYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmFwcGx5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5jb25zdHJ1Y3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZGVsZXRlLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmdldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmdldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuaGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5pcy1leHRlbnNpYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5vd24ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QucHJldmVudC1leHRlbnNpb25zLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuZmxhZ3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAubWF0Y2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAucmVwbGFjZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5zZWFyY2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuc3BsaXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuY29kZS1wb2ludC1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5lbmRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnJhdy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC5hcnJheS1idWZmZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC5mbG9hdDMyLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuZmxvYXQ2NC1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLmludDE2LWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuaW50MzItYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC5pbnQ4LWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQudWludDE2LWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQudWludDMyLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQudWludDgtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC51aW50OC1jbGFtcGVkLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYud2Vhay1tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi53ZWFrLXNldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LmVudHJpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC52YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcucGFkLWVuZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnN0cmluZy5wYWQtc3RhcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5pbW1lZGlhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi50aW1lcnMuanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL3ZlbG9jaXR5LWFuaW1hdGUvdmVsb2NpdHkubWluLmpzIiwibm9kZV9tb2R1bGVzL3ZlbG9jaXR5LWFuaW1hdGUvdmVsb2NpdHkudWkubWluLmpzIiwic3JjL2NvbXBvbmVudHMvYW5pbWF0ZU1lbnVJdGVtLmpzIiwic3JjL2NvbXBvbmVudHMvZGltVUkuanMiLCJzcmMvY29tcG9uZW50cy9pbXBvcnRMb2FkZXIuanMiLCJzcmMvY29tcG9uZW50cy9pbnRyb0FuaW1hdGlvbi5qcyIsInNyYy9jb21wb25lbnRzL3N2Zy9zY3JvbGxDaGV2cm9uLmpzIiwic3JjL2NvbXBvbmVudHMvc3ZnL3ZpZXdJY29uLmpzIiwic3JjL2NvbXBvbmVudHMvdG9nZ2xlTWVudS5qcyIsInNyYy9zY3JpcHQuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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TUFBSSxZQUFZLENBQWhCLEVBQW1CO0FBQ2pCLFFBQUksS0FBSyxJQUFMLENBQVUsT0FBVixDQUFKLEVBQXdCO0FBQUE7O0FBQ3RCLFVBQU0sTUFBTSxRQUFRLEtBQVIsQ0FBYyxHQUFkLENBQVo7QUFDQSwwQkFBRyxTQUFILEVBQWEsR0FBYix5Q0FBb0IsR0FBcEI7QUFDRCxLQUhELE1BR087QUFDTCxTQUFHLFNBQUgsQ0FBYSxHQUFiLENBQWlCLE9BQWpCO0FBQ0Q7QUFDRjtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVELFNBQVMsT0FBVCxDQUFpQixJQUFqQixFQUFvQztBQUFBLE1BQWIsT0FBYSx1RUFBSCxDQUFHOztBQUNsQyxNQUFNLE1BQU0sUUFBUSxLQUFSLENBQWMsR0FBZCxDQUFaO0FBQ0EsTUFBTSxTQUFTLFFBQVEsUUFBUixFQUFrQixPQUFsQixDQUFmO0FBQ0EsU0FBTyxZQUFQLENBQW9CLE1BQXBCLEVBQTRCLElBQTVCO0FBQ0EsU0FBTyxZQUFQLENBQW9CLE1BQXBCLEVBQTRCLFFBQTVCO0FBQ0EsU0FBTyxTQUFQLEdBQW1CLElBQW5CO0FBQ0EsU0FBTyxNQUFQO0FBQ0Q7O1FBRVEsTyxHQUFBLE87UUFBUyxPLEdBQUEsTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyAyMi4xLjMuMzEgQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG52YXIgVU5TQ09QQUJMRVMgPSByZXF1aXJlKCcuL193a3MnKSgndW5zY29wYWJsZXMnKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuaWYgKEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdID09IHVuZGVmaW5lZCkgcmVxdWlyZSgnLi9faGlkZScpKEFycmF5UHJvdG8sIFVOU0NPUEFCTEVTLCB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgQXJyYXlQcm90b1tVTlNDT1BBQkxFU11ba2V5XSA9IHRydWU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCkge1xuICBpZiAoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyAyMi4xLjMuMyBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCBlbmQgPSB0aGlzLmxlbmd0aClcbid1c2Ugc3RyaWN0JztcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBbXS5jb3B5V2l0aGluIHx8IGZ1bmN0aW9uIGNvcHlXaXRoaW4odGFyZ2V0IC8qID0gMCAqLywgc3RhcnQgLyogPSAwLCBlbmQgPSBAbGVuZ3RoICovKSB7XG4gIHZhciBPID0gdG9PYmplY3QodGhpcyk7XG4gIHZhciBsZW4gPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gIHZhciB0byA9IHRvQWJzb2x1dGVJbmRleCh0YXJnZXQsIGxlbik7XG4gIHZhciBmcm9tID0gdG9BYnNvbHV0ZUluZGV4KHN0YXJ0LCBsZW4pO1xuICB2YXIgZW5kID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gIHZhciBjb3VudCA9IE1hdGgubWluKChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IHRvQWJzb2x1dGVJbmRleChlbmQsIGxlbikpIC0gZnJvbSwgbGVuIC0gdG8pO1xuICB2YXIgaW5jID0gMTtcbiAgaWYgKGZyb20gPCB0byAmJiB0byA8IGZyb20gKyBjb3VudCkge1xuICAgIGluYyA9IC0xO1xuICAgIGZyb20gKz0gY291bnQgLSAxO1xuICAgIHRvICs9IGNvdW50IC0gMTtcbiAgfVxuICB3aGlsZSAoY291bnQtLSA+IDApIHtcbiAgICBpZiAoZnJvbSBpbiBPKSBPW3RvXSA9IE9bZnJvbV07XG4gICAgZWxzZSBkZWxldGUgT1t0b107XG4gICAgdG8gKz0gaW5jO1xuICAgIGZyb20gKz0gaW5jO1xuICB9IHJldHVybiBPO1xufTtcbiIsIi8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxuJ3VzZSBzdHJpY3QnO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaWxsKHZhbHVlIC8qICwgc3RhcnQgPSAwLCBlbmQgPSBAbGVuZ3RoICovKSB7XG4gIHZhciBPID0gdG9PYmplY3QodGhpcyk7XG4gIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCBsZW5ndGgpO1xuICB2YXIgZW5kID0gYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gIHZhciBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvQWJzb2x1dGVJbmRleChlbmQsIGxlbmd0aCk7XG4gIHdoaWxlIChlbmRQb3MgPiBpbmRleCkgT1tpbmRleCsrXSA9IHZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBhc2MgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVFlQRSwgJGNyZWF0ZSkge1xuICB2YXIgSVNfTUFQID0gVFlQRSA9PSAxO1xuICB2YXIgSVNfRklMVEVSID0gVFlQRSA9PSAyO1xuICB2YXIgSVNfU09NRSA9IFRZUEUgPT0gMztcbiAgdmFyIElTX0VWRVJZID0gVFlQRSA9PSA0O1xuICB2YXIgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNjtcbiAgdmFyIE5PX0hPTEVTID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XG4gIHZhciBjcmVhdGUgPSAkY3JlYXRlIHx8IGFzYztcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCkge1xuICAgIHZhciBPID0gdG9PYmplY3QoJHRoaXMpO1xuICAgIHZhciBzZWxmID0gSU9iamVjdChPKTtcbiAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHJlc3VsdCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHZhbCwgcmVzO1xuICAgIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZikge1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYgKFRZUEUpIHtcbiAgICAgICAgaWYgKElTX01BUCkgcmVzdWx0W2luZGV4XSA9IHJlczsgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZiAocmVzKSBzd2l0Y2ggKFRZUEUpIHtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYgKElTX0VWRVJZKSByZXR1cm4gZmFsc2U7IC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzLWFycmF5Jyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsKSB7XG4gIHZhciBDO1xuICBpZiAoaXNBcnJheShvcmlnaW5hbCkpIHtcbiAgICBDID0gb3JpZ2luYWwuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGlmIChpc09iamVjdChDKSkge1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZiAoQyA9PT0gbnVsbCkgQyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gcmV0dXJuIEMgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQztcbn07XG4iLCIvLyA5LjQuMi4zIEFycmF5U3BlY2llc0NyZWF0ZShvcmlnaW5hbEFycmF5LCBsZW5ndGgpXG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbCwgbGVuZ3RoKSB7XG4gIHJldHVybiBuZXcgKHNwZWNpZXNDb25zdHJ1Y3RvcihvcmlnaW5hbCkpKGxlbmd0aCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGludm9rZSA9IHJlcXVpcmUoJy4vX2ludm9rZScpO1xudmFyIGFycmF5U2xpY2UgPSBbXS5zbGljZTtcbnZhciBmYWN0b3JpZXMgPSB7fTtcblxudmFyIGNvbnN0cnVjdCA9IGZ1bmN0aW9uIChGLCBsZW4sIGFyZ3MpIHtcbiAgaWYgKCEobGVuIGluIGZhY3RvcmllcykpIHtcbiAgICBmb3IgKHZhciBuID0gW10sIGkgPSAwOyBpIDwgbGVuOyBpKyspIG5baV0gPSAnYVsnICsgaSArICddJztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICBmYWN0b3JpZXNbbGVuXSA9IEZ1bmN0aW9uKCdGLGEnLCAncmV0dXJuIG5ldyBGKCcgKyBuLmpvaW4oJywnKSArICcpJyk7XG4gIH0gcmV0dXJuIGZhY3Rvcmllc1tsZW5dKEYsIGFyZ3MpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGdW5jdGlvbi5iaW5kIHx8IGZ1bmN0aW9uIGJpbmQodGhhdCAvKiAsIC4uLmFyZ3MgKi8pIHtcbiAgdmFyIGZuID0gYUZ1bmN0aW9uKHRoaXMpO1xuICB2YXIgcGFydEFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgdmFyIGJvdW5kID0gZnVuY3Rpb24gKC8qIGFyZ3MuLi4gKi8pIHtcbiAgICB2YXIgYXJncyA9IHBhcnRBcmdzLmNvbmNhdChhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBib3VuZCA/IGNvbnN0cnVjdChmbiwgYXJncy5sZW5ndGgsIGFyZ3MpIDogaW52b2tlKGZuLCBhcmdzLCB0aGF0KTtcbiAgfTtcbiAgaWYgKGlzT2JqZWN0KGZuLnByb3RvdHlwZSkpIGJvdW5kLnByb3RvdHlwZSA9IGZuLnByb3RvdHlwZTtcbiAgcmV0dXJuIGJvdW5kO1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIHNldFNwZWNpZXMgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBmYXN0S2V5ID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0laRSA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24gKHRoYXQsIGtleSkge1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpO1xuICB2YXIgZW50cnk7XG4gIGlmIChpbmRleCAhPT0gJ0YnKSByZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IgKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgIGlmIChlbnRyeS5rID09IGtleSkgcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uICh3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKSB7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0aGF0LCBpdGVyYWJsZSkge1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX3QgPSBOQU1FOyAgICAgICAgIC8vIGNvbGxlY3Rpb24gdHlwZVxuICAgICAgdGhhdC5faSA9IGNyZWF0ZShudWxsKTsgLy8gaW5kZXhcbiAgICAgIHRoYXQuX2YgPSB1bmRlZmluZWQ7ICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAvLyBzaXplXG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIGZvciAodmFyIHRoYXQgPSB2YWxpZGF0ZSh0aGlzLCBOQU1FKSwgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChlbnRyeS5wKSBlbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkubjtcbiAgICAgICAgICB2YXIgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYgKHByZXYpIHByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYgKG5leHQpIG5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYgKHRoYXQuX2YgPT0gZW50cnkpIHRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmICh0aGF0Ll9sID09IGVudHJ5KSB0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoYXQgPSB1bmRlZmluZWQgKi8pIHtcbiAgICAgICAgdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKTtcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICB3aGlsZSAoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKSB7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucikgZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodmFsaWRhdGUodGhpcywgTkFNRSksIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKERFU0NSSVBUT1JTKSBkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHRoaXMsIE5BTUUpW1NJWkVdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uICh0aGF0LCBrZXksIHZhbHVlKSB7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICB2YXIgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZiAoIXRoYXQuX2YpIHRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYgKGluZGV4ICE9PSAnRicpIHRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uIChDLCBOQU1FLCBJU19NQVApIHtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gICAgICB0aGlzLl90ID0gdmFsaWRhdGUoaXRlcmF0ZWQsIE5BTUUpOyAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7ICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGtpbmQgPSB0aGF0Ll9rO1xuICAgICAgdmFyIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZiAoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSkge1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmIChraW5kID09ICdrZXlzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIGdldFdlYWsgPSByZXF1aXJlKCcuL19tZXRhJykuZ2V0V2VhaztcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBjcmVhdGVBcnJheU1ldGhvZCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKTtcbnZhciAkaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgYXJyYXlGaW5kID0gY3JlYXRlQXJyYXlNZXRob2QoNSk7XG52YXIgYXJyYXlGaW5kSW5kZXggPSBjcmVhdGVBcnJheU1ldGhvZCg2KTtcbnZhciBpZCA9IDA7XG5cbi8vIGZhbGxiYWNrIGZvciB1bmNhdWdodCBmcm96ZW4ga2V5c1xudmFyIHVuY2F1Z2h0RnJvemVuU3RvcmUgPSBmdW5jdGlvbiAodGhhdCkge1xuICByZXR1cm4gdGhhdC5fbCB8fCAodGhhdC5fbCA9IG5ldyBVbmNhdWdodEZyb3plblN0b3JlKCkpO1xufTtcbnZhciBVbmNhdWdodEZyb3plblN0b3JlID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmEgPSBbXTtcbn07XG52YXIgZmluZFVuY2F1Z2h0RnJvemVuID0gZnVuY3Rpb24gKHN0b3JlLCBrZXkpIHtcbiAgcmV0dXJuIGFycmF5RmluZChzdG9yZS5hLCBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcbiAgfSk7XG59O1xuVW5jYXVnaHRGcm96ZW5TdG9yZS5wcm90b3R5cGUgPSB7XG4gIGdldDogZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBlbnRyeSA9IGZpbmRVbmNhdWdodEZyb3plbih0aGlzLCBrZXkpO1xuICAgIGlmIChlbnRyeSkgcmV0dXJuIGVudHJ5WzFdO1xuICB9LFxuICBoYXM6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gISFmaW5kVW5jYXVnaHRGcm96ZW4odGhpcywga2V5KTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHZhciBlbnRyeSA9IGZpbmRVbmNhdWdodEZyb3plbih0aGlzLCBrZXkpO1xuICAgIGlmIChlbnRyeSkgZW50cnlbMV0gPSB2YWx1ZTtcbiAgICBlbHNlIHRoaXMuYS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0sXG4gICdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGluZGV4ID0gYXJyYXlGaW5kSW5kZXgodGhpcy5hLCBmdW5jdGlvbiAoaXQpIHtcbiAgICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xuICAgIH0pO1xuICAgIGlmICh+aW5kZXgpIHRoaXMuYS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiAhIX5pbmRleDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll90ID0gTkFNRTsgICAgICAvLyBjb2xsZWN0aW9uIHR5cGVcbiAgICAgIHRoYXQuX2kgPSBpZCsrOyAgICAgIC8vIGNvbGxlY3Rpb24gaWRcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7IC8vIGxlYWsgc3RvcmUgZm9yIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RzXG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjMuMy4yIFdlYWtNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy40LjMuMyBXZWFrU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGtleSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrKGtleSk7XG4gICAgICAgIGlmIChkYXRhID09PSB0cnVlKSByZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZSh2YWxpZGF0ZSh0aGlzLCBOQU1FKSlbJ2RlbGV0ZSddKGtleSk7XG4gICAgICAgIHJldHVybiBkYXRhICYmICRoYXMoZGF0YSwgdGhpcy5faSkgJiYgZGVsZXRlIGRhdGFbdGhpcy5faV07XG4gICAgICB9LFxuICAgICAgLy8gMjMuMy4zLjQgV2Vha01hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjQuMy40IFdlYWtTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGtleSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrKGtleSk7XG4gICAgICAgIGlmIChkYXRhID09PSB0cnVlKSByZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZSh2YWxpZGF0ZSh0aGlzLCBOQU1FKSkuaGFzKGtleSk7XG4gICAgICAgIHJldHVybiBkYXRhICYmICRoYXMoZGF0YSwgdGhpcy5faSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24gKHRoYXQsIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgZGF0YSA9IGdldFdlYWsoYW5PYmplY3Qoa2V5KSwgdHJ1ZSk7XG4gICAgaWYgKGRhdGEgPT09IHRydWUpIHVuY2F1Z2h0RnJvemVuU3RvcmUodGhhdCkuc2V0KGtleSwgdmFsdWUpO1xuICAgIGVsc2UgZGF0YVt0aGF0Ll9pXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGF0O1xuICB9LFxuICB1ZnN0b3JlOiB1bmNhdWdodEZyb3plblN0b3JlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgJGl0ZXJEZXRlY3QgPSByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBpbmhlcml0SWZSZXF1aXJlZCA9IHJlcXVpcmUoJy4vX2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspIHtcbiAgdmFyIEJhc2UgPSBnbG9iYWxbTkFNRV07XG4gIHZhciBDID0gQmFzZTtcbiAgdmFyIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJztcbiAgdmFyIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZTtcbiAgdmFyIE8gPSB7fTtcbiAgdmFyIGZpeE1ldGhvZCA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgICB2YXIgZm4gPSBwcm90b1tLRVldO1xuICAgIHJlZGVmaW5lKHByb3RvLCBLRVksXG4gICAgICBLRVkgPT0gJ2RlbGV0ZScgPyBmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2hhcycgPyBmdW5jdGlvbiBoYXMoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyB1bmRlZmluZWQgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdhZGQnID8gZnVuY3Rpb24gYWRkKGEpIHsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpOyByZXR1cm4gdGhpczsgfVxuICAgICAgICA6IGZ1bmN0aW9uIHNldChhLCBiKSB7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTsgcmV0dXJuIHRoaXM7IH1cbiAgICApO1xuICB9O1xuICBpZiAodHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKSB7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgLy8gZWFybHkgaW1wbGVtZW50YXRpb25zIG5vdCBzdXBwb3J0cyBjaGFpbmluZ1xuICAgIHZhciBIQVNOVF9DSEFJTklORyA9IGluc3RhbmNlW0FEREVSXShJU19XRUFLID8ge30gOiAtMCwgMSkgIT0gaW5zdGFuY2U7XG4gICAgLy8gVjggfiAgQ2hyb21pdW0gNDAtIHdlYWstY29sbGVjdGlvbnMgdGhyb3dzIG9uIHByaW1pdGl2ZXMsIGJ1dCBzaG91bGQgcmV0dXJuIGZhbHNlXG4gICAgdmFyIFRIUk9XU19PTl9QUklNSVRJVkVTID0gZmFpbHMoZnVuY3Rpb24gKCkgeyBpbnN0YW5jZS5oYXMoMSk7IH0pO1xuICAgIC8vIG1vc3QgZWFybHkgaW1wbGVtZW50YXRpb25zIGRvZXNuJ3Qgc3VwcG9ydHMgaXRlcmFibGVzLCBtb3N0IG1vZGVybiAtIG5vdCBjbG9zZSBpdCBjb3JyZWN0bHlcbiAgICB2YXIgQUNDRVBUX0lURVJBQkxFUyA9ICRpdGVyRGV0ZWN0KGZ1bmN0aW9uIChpdGVyKSB7IG5ldyBDKGl0ZXIpOyB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAvLyBmb3IgZWFybHkgaW1wbGVtZW50YXRpb25zIC0wIGFuZCArMCBub3QgdGhlIHNhbWVcbiAgICB2YXIgQlVHR1lfWkVSTyA9ICFJU19XRUFLICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFY4IH4gQ2hyb21pdW0gNDItIGZhaWxzIG9ubHkgd2l0aCA1KyBlbGVtZW50c1xuICAgICAgdmFyICRpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgICB2YXIgaW5kZXggPSA1O1xuICAgICAgd2hpbGUgKGluZGV4LS0pICRpbnN0YW5jZVtBRERFUl0oaW5kZXgsIGluZGV4KTtcbiAgICAgIHJldHVybiAhJGluc3RhbmNlLmhhcygtMCk7XG4gICAgfSk7XG4gICAgaWYgKCFBQ0NFUFRfSVRFUkFCTEVTKSB7XG4gICAgICBDID0gd3JhcHBlcihmdW5jdGlvbiAodGFyZ2V0LCBpdGVyYWJsZSkge1xuICAgICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gaW5oZXJpdElmUmVxdWlyZWQobmV3IEJhc2UoKSwgdGFyZ2V0LCBDKTtcbiAgICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH0pO1xuICAgICAgQy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgIHByb3RvLmNvbnN0cnVjdG9yID0gQztcbiAgICB9XG4gICAgaWYgKFRIUk9XU19PTl9QUklNSVRJVkVTIHx8IEJVR0dZX1pFUk8pIHtcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XG4gICAgfVxuICAgIGlmIChCVUdHWV9aRVJPIHx8IEhBU05UX0NIQUlOSU5HKSBmaXhNZXRob2QoQURERVIpO1xuICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgc2hvdWxkIG5vdCBjb250YWlucyAuY2xlYXIgbWV0aG9kXG4gICAgaWYgKElTX1dFQUsgJiYgcHJvdG8uY2xlYXIpIGRlbGV0ZSBwcm90by5jbGVhcjtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChDICE9IEJhc2UpLCBPKTtcblxuICBpZiAoIUlTX1dFQUspIGNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi41LjMnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHJlc3VsdCA9IGdldEtleXMoaXQpO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgaWYgKGdldFN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpO1xuICAgIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAoc3ltYm9scy5sZW5ndGggPiBpKSBpZiAoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIHRhcmdldCA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSk7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmICh0YXJnZXQpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmIChleHBvcnRzW2tleV0gIT0gb3V0KSBoaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZiAoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpIGV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJ2YXIgTUFUQ0ggPSByZXF1aXJlKCcuL193a3MnKSgnbWF0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgcmUgPSAvLi87XG4gIHRyeSB7XG4gICAgJy8uLydbS0VZXShyZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0cnkge1xuICAgICAgcmVbTUFUQ0hdID0gZmFsc2U7XG4gICAgICByZXR1cm4gIScvLi8nW0tFWV0ocmUpO1xuICAgIH0gY2F0Y2ggKGYpIHsgLyogZW1wdHkgKi8gfVxuICB9IHJldHVybiB0cnVlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBsZW5ndGgsIGV4ZWMpIHtcbiAgdmFyIFNZTUJPTCA9IHdrcyhLRVkpO1xuICB2YXIgZm5zID0gZXhlYyhkZWZpbmVkLCBTWU1CT0wsICcnW0tFWV0pO1xuICB2YXIgc3RyZm4gPSBmbnNbMF07XG4gIHZhciByeGZuID0gZm5zWzFdO1xuICBpZiAoZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHZhciBPID0ge307XG4gICAgT1tTWU1CT0xdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfTtcbiAgICByZXR1cm4gJydbS0VZXShPKSAhPSA3O1xuICB9KSkge1xuICAgIHJlZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIEtFWSwgc3RyZm4pO1xuICAgIGhpZGUoUmVnRXhwLnByb3RvdHlwZSwgU1lNQk9MLCBsZW5ndGggPT0gMlxuICAgICAgLy8gMjEuMi41LjggUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdKHN0cmluZywgcmVwbGFjZVZhbHVlKVxuICAgICAgLy8gMjEuMi41LjExIFJlZ0V4cC5wcm90b3R5cGVbQEBzcGxpdF0oc3RyaW5nLCBsaW1pdClcbiAgICAgID8gZnVuY3Rpb24gKHN0cmluZywgYXJnKSB7IHJldHVybiByeGZuLmNhbGwoc3RyaW5nLCB0aGlzLCBhcmcpOyB9XG4gICAgICAvLyAyMS4yLjUuNiBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdKHN0cmluZylcbiAgICAgIC8vIDIxLjIuNS45IFJlZ0V4cC5wcm90b3R5cGVbQEBzZWFyY2hdKHN0cmluZylcbiAgICAgIDogZnVuY3Rpb24gKHN0cmluZykgeyByZXR1cm4gcnhmbi5jYWxsKHN0cmluZywgdGhpcyk7IH1cbiAgICApO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3NcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0aGF0ID0gYW5PYmplY3QodGhpcyk7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgaWYgKHRoYXQuZ2xvYmFsKSByZXN1bHQgKz0gJ2cnO1xuICBpZiAodGhhdC5pZ25vcmVDYXNlKSByZXN1bHQgKz0gJ2knO1xuICBpZiAodGhhdC5tdWx0aWxpbmUpIHJlc3VsdCArPSAnbSc7XG4gIGlmICh0aGF0LnVuaWNvZGUpIHJlc3VsdCArPSAndSc7XG4gIGlmICh0aGF0LnN0aWNreSkgcmVzdWx0ICs9ICd5JztcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xudmFyIEJSRUFLID0ge307XG52YXIgUkVUVVJOID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1IpIHtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpO1xuICB2YXIgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZiAoaXNBcnJheUl0ZXIoaXRlckZuKSkgZm9yIChsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTspIHtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXQ7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0aGF0LCB0YXJnZXQsIEMpIHtcbiAgdmFyIFMgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIHZhciBQO1xuICBpZiAoUyAhPT0gQyAmJiB0eXBlb2YgUyA9PSAnZnVuY3Rpb24nICYmIChQID0gUy5wcm90b3R5cGUpICE9PSBDLnByb3RvdHlwZSAmJiBpc09iamVjdChQKSAmJiBzZXRQcm90b3R5cGVPZikge1xuICAgIHNldFByb3RvdHlwZU9mKHRoYXQsIFApO1xuICB9IHJldHVybiB0aGF0O1xufTtcbiIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIGFyZ3MsIHRoYXQpIHtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpIHtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59O1xuIiwiLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzSW50ZWdlcihpdCkge1xuICByZXR1cm4gIWlzT2JqZWN0KGl0KSAmJiBpc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIDcuMi44IElzUmVnRXhwKGFyZ3VtZW50KVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgTUFUQ0ggPSByZXF1aXJlKCcuL193a3MnKSgnbWF0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBpc1JlZ0V4cDtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiAoKGlzUmVnRXhwID0gaXRbTUFUQ0hdKSAhPT0gdW5kZWZpbmVkID8gISFpc1JlZ0V4cCA6IGNvZihpdCkgPT0gJ1JlZ0V4cCcpO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICghQlVHR1kgJiYgJG5hdGl2ZSkgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSkgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRvbmUsIHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCIvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxudmFyICRleHBtMSA9IE1hdGguZXhwbTE7XG5tb2R1bGUuZXhwb3J0cyA9ICghJGV4cG0xXG4gIC8vIE9sZCBGRiBidWdcbiAgfHwgJGV4cG0xKDEwKSA+IDIyMDI1LjQ2NTc5NDgwNjcxOSB8fCAkZXhwbTEoMTApIDwgMjIwMjUuNDY1Nzk0ODA2NzE2NTE2OFxuICAvLyBUb3IgQnJvd3NlciBidWdcbiAgfHwgJGV4cG0xKC0yZS0xNykgIT0gLTJlLTE3XG4pID8gZnVuY3Rpb24gZXhwbTEoeCkge1xuICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiB4ID4gLTFlLTYgJiYgeCA8IDFlLTYgPyB4ICsgeCAqIHggLyAyIDogTWF0aC5leHAoeCkgLSAxO1xufSA6ICRleHBtMTtcbiIsIi8vIDIwLjIuMi4xNiBNYXRoLmZyb3VuZCh4KVxudmFyIHNpZ24gPSByZXF1aXJlKCcuL19tYXRoLXNpZ24nKTtcbnZhciBwb3cgPSBNYXRoLnBvdztcbnZhciBFUFNJTE9OID0gcG93KDIsIC01Mik7XG52YXIgRVBTSUxPTjMyID0gcG93KDIsIC0yMyk7XG52YXIgTUFYMzIgPSBwb3coMiwgMTI3KSAqICgyIC0gRVBTSUxPTjMyKTtcbnZhciBNSU4zMiA9IHBvdygyLCAtMTI2KTtcblxudmFyIHJvdW5kVGllc1RvRXZlbiA9IGZ1bmN0aW9uIChuKSB7XG4gIHJldHVybiBuICsgMSAvIEVQU0lMT04gLSAxIC8gRVBTSUxPTjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0aC5mcm91bmQgfHwgZnVuY3Rpb24gZnJvdW5kKHgpIHtcbiAgdmFyICRhYnMgPSBNYXRoLmFicyh4KTtcbiAgdmFyICRzaWduID0gc2lnbih4KTtcbiAgdmFyIGEsIHJlc3VsdDtcbiAgaWYgKCRhYnMgPCBNSU4zMikgcmV0dXJuICRzaWduICogcm91bmRUaWVzVG9FdmVuKCRhYnMgLyBNSU4zMiAvIEVQU0lMT04zMikgKiBNSU4zMiAqIEVQU0lMT04zMjtcbiAgYSA9ICgxICsgRVBTSUxPTjMyIC8gRVBTSUxPTikgKiAkYWJzO1xuICByZXN1bHQgPSBhIC0gKGEgLSAkYWJzKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICBpZiAocmVzdWx0ID4gTUFYMzIgfHwgcmVzdWx0ICE9IHJlc3VsdCkgcmV0dXJuICRzaWduICogSW5maW5pdHk7XG4gIHJldHVybiAkc2lnbiAqIHJlc3VsdDtcbn07XG4iLCIvLyAyMC4yLjIuMjAgTWF0aC5sb2cxcCh4KVxubW9kdWxlLmV4cG9ydHMgPSBNYXRoLmxvZzFwIHx8IGZ1bmN0aW9uIGxvZzFwKHgpIHtcbiAgcmV0dXJuICh4ID0gK3gpID4gLTFlLTggJiYgeCA8IDFlLTggPyB4IC0geCAqIHggLyAyIDogTWF0aC5sb2coMSArIHgpO1xufTtcbiIsIi8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcbm1vZHVsZS5leHBvcnRzID0gTWF0aC5zaWduIHx8IGZ1bmN0aW9uIHNpZ24oeCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gIHJldHVybiAoeCA9ICt4KSA9PSAwIHx8IHggIT0geCA/IHggOiB4IDwgMCA/IC0xIDogMTtcbn07XG4iLCJ2YXIgTUVUQSA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBzZXREZXNjID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBpZCA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBpc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbnZhciBzZXRNZXRhID0gZnVuY3Rpb24gKGl0KSB7XG4gIHNldERlc2MoaXQsIE1FVEEsIHsgdmFsdWU6IHtcbiAgICBpOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3OiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IH0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSkgc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6IE1FVEEsXG4gIE5FRUQ6IGZhbHNlLFxuICBmYXN0S2V5OiBmYXN0S2V5LFxuICBnZXRXZWFrOiBnZXRXZWFrLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgbWFjcm90YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldDtcbnZhciBPYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG52YXIgaXNOb2RlID0gcmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGhlYWQsIGxhc3QsIG5vdGlmeTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhcmVudCwgZm47XG4gICAgaWYgKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKSBwYXJlbnQuZXhpdCgpO1xuICAgIHdoaWxlIChoZWFkKSB7XG4gICAgICBmbiA9IGhlYWQuZm47XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGhlYWQpIG5vdGlmeSgpO1xuICAgICAgICBlbHNlIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgIGlmIChwYXJlbnQpIHBhcmVudC5lbnRlcigpO1xuICB9O1xuXG4gIC8vIE5vZGUuanNcbiAgaWYgKGlzTm9kZSkge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIC8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlciwgZXhjZXB0IGlPUyBTYWZhcmkgLSBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMzM5XG4gIH0gZWxzZSBpZiAoT2JzZXJ2ZXIgJiYgIShnbG9iYWwubmF2aWdhdG9yICYmIGdsb2JhbC5uYXZpZ2F0b3Iuc3RhbmRhbG9uZSkpIHtcbiAgICB2YXIgdG9nZ2xlID0gdHJ1ZTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmIChQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSkge1xuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgdGFzayA9IHsgZm46IGZuLCBuZXh0OiB1bmRlZmluZWQgfTtcbiAgICBpZiAobGFzdCkgbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZiAoIWhlYWQpIHtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAyNS40LjEuNSBOZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcblxuZnVuY3Rpb24gUHJvbWlzZUNhcGFiaWxpdHkoQykge1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbiAoJCRyZXNvbHZlLCAkJHJlamVjdCkge1xuICAgIGlmIChyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCA9IGFGdW5jdGlvbihyZWplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gKEMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIGlmIChpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKSBUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QRCA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBnT1BEKE8sIFApO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgZ09QTiA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZjtcbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGdPUE4oaXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KSB7XG4gIHJldHVybiB3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJyA/IGdldFdpbmRvd05hbWVzKGl0KSA6IGdPUE4odG9JT2JqZWN0KGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwiLy8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBleGVjKSB7XG4gIHZhciBmbiA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXTtcbiAgdmFyIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uICgpIHsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07XG4iLCJ2YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGlzRW51bSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXNFbnRyaWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXQpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdChpdCk7XG4gICAgdmFyIGtleXMgPSBnZXRLZXlzKE8pO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGkpIGlmIChpc0VudW0uY2FsbChPLCBrZXkgPSBrZXlzW2krK10pKSB7XG4gICAgICByZXN1bHQucHVzaChpc0VudHJpZXMgPyBba2V5LCBPW2tleV1dIDogT1trZXldKTtcbiAgICB9IHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuIiwiLy8gYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBub24tZW51bWVyYWJsZSBhbmQgc3ltYm9sc1xudmFyIGdPUE4gPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgUmVmbGVjdCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlJlZmxlY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IFJlZmxlY3QgJiYgUmVmbGVjdC5vd25LZXlzIHx8IGZ1bmN0aW9uIG93bktleXMoaXQpIHtcbiAgdmFyIGtleXMgPSBnT1BOLmYoYW5PYmplY3QoaXQpKTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHJldHVybiBnZXRTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0U3ltYm9scyhpdCkpIDoga2V5cztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHsgZTogZmFsc2UsIHY6IGV4ZWMoKSB9O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgZTogdHJ1ZSwgdjogZSB9O1xuICB9XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQywgeCkge1xuICBhbk9iamVjdChDKTtcbiAgaWYgKGlzT2JqZWN0KHgpICYmIHguY29uc3RydWN0b3IgPT09IEMpIHJldHVybiB4O1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKEMpO1xuICB2YXIgcmVzb2x2ZSA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gIHJlc29sdmUoeCk7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIHNhZmUpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldLCBzYWZlKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSBGdW5jdGlvbltUT19TVFJJTkddO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCIvLyA3LjIuOSBTYW1lVmFsdWUoeCwgeSlcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmlzIHx8IGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcbn07XG4iLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24gKE8sIHByb3RvKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBpZiAoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCkgdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24gKHRlc3QsIGJ1Z2d5LCBzZXQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vX2N0eCcpKEZ1bmN0aW9uLmNhbGwsIHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZihPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoIChlKSB7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKSB7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYgKGJ1Z2d5KSBPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgQyA9IGdsb2JhbFtLRVldO1xuICBpZiAoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkgZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTtcbiIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywgRCkge1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yO1xuICB2YXIgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCIvLyBoZWxwZXIgZm9yIFN0cmluZyN7c3RhcnRzV2l0aCwgZW5kc1dpdGgsIGluY2x1ZGVzfVxudmFyIGlzUmVnRXhwID0gcmVxdWlyZSgnLi9faXMtcmVnZXhwJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGhhdCwgc2VhcmNoU3RyaW5nLCBOQU1FKSB7XG4gIGlmIChpc1JlZ0V4cChzZWFyY2hTdHJpbmcpKSB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZyMnICsgTkFNRSArIFwiIGRvZXNuJ3QgYWNjZXB0IHJlZ2V4IVwiKTtcbiAgcmV0dXJuIFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbn07XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1zdHJpbmctcGFkLXN0YXJ0LWVuZFxudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgcmVwZWF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLXJlcGVhdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRoYXQsIG1heExlbmd0aCwgZmlsbFN0cmluZywgbGVmdCkge1xuICB2YXIgUyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgdmFyIHN0cmluZ0xlbmd0aCA9IFMubGVuZ3RoO1xuICB2YXIgZmlsbFN0ciA9IGZpbGxTdHJpbmcgPT09IHVuZGVmaW5lZCA/ICcgJyA6IFN0cmluZyhmaWxsU3RyaW5nKTtcbiAgdmFyIGludE1heExlbmd0aCA9IHRvTGVuZ3RoKG1heExlbmd0aCk7XG4gIGlmIChpbnRNYXhMZW5ndGggPD0gc3RyaW5nTGVuZ3RoIHx8IGZpbGxTdHIgPT0gJycpIHJldHVybiBTO1xuICB2YXIgZmlsbExlbiA9IGludE1heExlbmd0aCAtIHN0cmluZ0xlbmd0aDtcbiAgdmFyIHN0cmluZ0ZpbGxlciA9IHJlcGVhdC5jYWxsKGZpbGxTdHIsIE1hdGguY2VpbChmaWxsTGVuIC8gZmlsbFN0ci5sZW5ndGgpKTtcbiAgaWYgKHN0cmluZ0ZpbGxlci5sZW5ndGggPiBmaWxsTGVuKSBzdHJpbmdGaWxsZXIgPSBzdHJpbmdGaWxsZXIuc2xpY2UoMCwgZmlsbExlbik7XG4gIHJldHVybiBsZWZ0ID8gc3RyaW5nRmlsbGVyICsgUyA6IFMgKyBzdHJpbmdGaWxsZXI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlcGVhdChjb3VudCkge1xuICB2YXIgc3RyID0gU3RyaW5nKGRlZmluZWQodGhpcykpO1xuICB2YXIgcmVzID0gJyc7XG4gIHZhciBuID0gdG9JbnRlZ2VyKGNvdW50KTtcbiAgaWYgKG4gPCAwIHx8IG4gPT0gSW5maW5pdHkpIHRocm93IFJhbmdlRXJyb3IoXCJDb3VudCBjYW4ndCBiZSBuZWdhdGl2ZVwiKTtcbiAgZm9yICg7biA+IDA7IChuID4+Pj0gMSkgJiYgKHN0ciArPSBzdHIpKSBpZiAobiAmIDEpIHJlcyArPSBzdHI7XG4gIHJldHVybiByZXM7XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGludm9rZSA9IHJlcXVpcmUoJy4vX2ludm9rZScpO1xudmFyIGh0bWwgPSByZXF1aXJlKCcuL19odG1sJyk7XG52YXIgY2VsID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBzZXRUYXNrID0gZ2xvYmFsLnNldEltbWVkaWF0ZTtcbnZhciBjbGVhclRhc2sgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGU7XG52YXIgTWVzc2FnZUNoYW5uZWwgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWw7XG52YXIgRGlzcGF0Y2ggPSBnbG9iYWwuRGlzcGF0Y2g7XG52YXIgY291bnRlciA9IDA7XG52YXIgcXVldWUgPSB7fTtcbnZhciBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcbnZhciBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpZCA9ICt0aGlzO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gIGlmIChxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmICghc2V0VGFzayB8fCAhY2xlYXJUYXNrKSB7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIHZhciBpID0gMTtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGkpIGFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKSB7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmIChyZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcycpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIFNwaGVyZSAoSlMgZ2FtZSBlbmdpbmUpIERpc3BhdGNoIEFQSVxuICB9IGVsc2UgaWYgKERpc3BhdGNoICYmIERpc3BhdGNoLm5vdykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBEaXNwYXRjaC5ub3coY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZiAoTWVzc2FnZUNoYW5uZWwpIHtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgcG9ydCA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZiAoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0JykpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b2luZGV4XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIDA7XG4gIHZhciBudW1iZXIgPSB0b0ludGVnZXIoaXQpO1xuICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgobnVtYmVyKTtcbiAgaWYgKG51bWJlciAhPT0gbGVuZ3RoKSB0aHJvdyBSYW5nZUVycm9yKCdXcm9uZyBsZW5ndGghJyk7XG4gIHJldHVybiBsZW5ndGg7XG59O1xuIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbmlmIChyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpKSB7XG4gIHZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xuICB2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG4gIHZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG4gIHZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4gIHZhciAkdHlwZWQgPSByZXF1aXJlKCcuL190eXBlZCcpO1xuICB2YXIgJGJ1ZmZlciA9IHJlcXVpcmUoJy4vX3R5cGVkLWJ1ZmZlcicpO1xuICB2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG4gIHZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbiAgdmFyIHByb3BlcnR5RGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbiAgdmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG4gIHZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xuICB2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xuICB2YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbiAgdmFyIHRvSW5kZXggPSByZXF1aXJlKCcuL190by1pbmRleCcpO1xuICB2YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbiAgdmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG4gIHZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbiAgdmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG4gIHZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuICB2YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbiAgdmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xuICB2YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xuICB2YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG4gIHZhciBnT1BOID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mO1xuICB2YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbiAgdmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xuICB2YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG4gIHZhciBjcmVhdGVBcnJheU1ldGhvZCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKTtcbiAgdmFyIGNyZWF0ZUFycmF5SW5jbHVkZXMgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpO1xuICB2YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuICB2YXIgQXJyYXlJdGVyYXRvcnMgPSByZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xuICB2YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG4gIHZhciAkaXRlckRldGVjdCA9IHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0Jyk7XG4gIHZhciBzZXRTcGVjaWVzID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKTtcbiAgdmFyIGFycmF5RmlsbCA9IHJlcXVpcmUoJy4vX2FycmF5LWZpbGwnKTtcbiAgdmFyIGFycmF5Q29weVdpdGhpbiA9IHJlcXVpcmUoJy4vX2FycmF5LWNvcHktd2l0aGluJyk7XG4gIHZhciAkRFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbiAgdmFyICRHT1BEID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKTtcbiAgdmFyIGRQID0gJERQLmY7XG4gIHZhciBnT1BEID0gJEdPUEQuZjtcbiAgdmFyIFJhbmdlRXJyb3IgPSBnbG9iYWwuUmFuZ2VFcnJvcjtcbiAgdmFyIFR5cGVFcnJvciA9IGdsb2JhbC5UeXBlRXJyb3I7XG4gIHZhciBVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXk7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAnQXJyYXlCdWZmZXInO1xuICB2YXIgU0hBUkVEX0JVRkZFUiA9ICdTaGFyZWQnICsgQVJSQVlfQlVGRkVSO1xuICB2YXIgQllURVNfUEVSX0VMRU1FTlQgPSAnQllURVNfUEVSX0VMRU1FTlQnO1xuICB2YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXlbUFJPVE9UWVBFXTtcbiAgdmFyICRBcnJheUJ1ZmZlciA9ICRidWZmZXIuQXJyYXlCdWZmZXI7XG4gIHZhciAkRGF0YVZpZXcgPSAkYnVmZmVyLkRhdGFWaWV3O1xuICB2YXIgYXJyYXlGb3JFYWNoID0gY3JlYXRlQXJyYXlNZXRob2QoMCk7XG4gIHZhciBhcnJheUZpbHRlciA9IGNyZWF0ZUFycmF5TWV0aG9kKDIpO1xuICB2YXIgYXJyYXlTb21lID0gY3JlYXRlQXJyYXlNZXRob2QoMyk7XG4gIHZhciBhcnJheUV2ZXJ5ID0gY3JlYXRlQXJyYXlNZXRob2QoNCk7XG4gIHZhciBhcnJheUZpbmQgPSBjcmVhdGVBcnJheU1ldGhvZCg1KTtcbiAgdmFyIGFycmF5RmluZEluZGV4ID0gY3JlYXRlQXJyYXlNZXRob2QoNik7XG4gIHZhciBhcnJheUluY2x1ZGVzID0gY3JlYXRlQXJyYXlJbmNsdWRlcyh0cnVlKTtcbiAgdmFyIGFycmF5SW5kZXhPZiA9IGNyZWF0ZUFycmF5SW5jbHVkZXMoZmFsc2UpO1xuICB2YXIgYXJyYXlWYWx1ZXMgPSBBcnJheUl0ZXJhdG9ycy52YWx1ZXM7XG4gIHZhciBhcnJheUtleXMgPSBBcnJheUl0ZXJhdG9ycy5rZXlzO1xuICB2YXIgYXJyYXlFbnRyaWVzID0gQXJyYXlJdGVyYXRvcnMuZW50cmllcztcbiAgdmFyIGFycmF5TGFzdEluZGV4T2YgPSBBcnJheVByb3RvLmxhc3RJbmRleE9mO1xuICB2YXIgYXJyYXlSZWR1Y2UgPSBBcnJheVByb3RvLnJlZHVjZTtcbiAgdmFyIGFycmF5UmVkdWNlUmlnaHQgPSBBcnJheVByb3RvLnJlZHVjZVJpZ2h0O1xuICB2YXIgYXJyYXlKb2luID0gQXJyYXlQcm90by5qb2luO1xuICB2YXIgYXJyYXlTb3J0ID0gQXJyYXlQcm90by5zb3J0O1xuICB2YXIgYXJyYXlTbGljZSA9IEFycmF5UHJvdG8uc2xpY2U7XG4gIHZhciBhcnJheVRvU3RyaW5nID0gQXJyYXlQcm90by50b1N0cmluZztcbiAgdmFyIGFycmF5VG9Mb2NhbGVTdHJpbmcgPSBBcnJheVByb3RvLnRvTG9jYWxlU3RyaW5nO1xuICB2YXIgSVRFUkFUT1IgPSB3a3MoJ2l0ZXJhdG9yJyk7XG4gIHZhciBUQUcgPSB3a3MoJ3RvU3RyaW5nVGFnJyk7XG4gIHZhciBUWVBFRF9DT05TVFJVQ1RPUiA9IHVpZCgndHlwZWRfY29uc3RydWN0b3InKTtcbiAgdmFyIERFRl9DT05TVFJVQ1RPUiA9IHVpZCgnZGVmX2NvbnN0cnVjdG9yJyk7XG4gIHZhciBBTExfQ09OU1RSVUNUT1JTID0gJHR5cGVkLkNPTlNUUjtcbiAgdmFyIFRZUEVEX0FSUkFZID0gJHR5cGVkLlRZUEVEO1xuICB2YXIgVklFVyA9ICR0eXBlZC5WSUVXO1xuICB2YXIgV1JPTkdfTEVOR1RIID0gJ1dyb25nIGxlbmd0aCEnO1xuXG4gIHZhciAkbWFwID0gY3JlYXRlQXJyYXlNZXRob2QoMSwgZnVuY3Rpb24gKE8sIGxlbmd0aCkge1xuICAgIHJldHVybiBhbGxvY2F0ZShzcGVjaWVzQ29uc3RydWN0b3IoTywgT1tERUZfQ09OU1RSVUNUT1JdKSwgbGVuZ3RoKTtcbiAgfSk7XG5cbiAgdmFyIExJVFRMRV9FTkRJQU4gPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KG5ldyBVaW50MTZBcnJheShbMV0pLmJ1ZmZlcilbMF0gPT09IDE7XG4gIH0pO1xuXG4gIHZhciBGT1JDRURfU0VUID0gISFVaW50OEFycmF5ICYmICEhVWludDhBcnJheVtQUk9UT1RZUEVdLnNldCAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgbmV3IFVpbnQ4QXJyYXkoMSkuc2V0KHt9KTtcbiAgfSk7XG5cbiAgdmFyIHRvT2Zmc2V0ID0gZnVuY3Rpb24gKGl0LCBCWVRFUykge1xuICAgIHZhciBvZmZzZXQgPSB0b0ludGVnZXIoaXQpO1xuICAgIGlmIChvZmZzZXQgPCAwIHx8IG9mZnNldCAlIEJZVEVTKSB0aHJvdyBSYW5nZUVycm9yKCdXcm9uZyBvZmZzZXQhJyk7XG4gICAgcmV0dXJuIG9mZnNldDtcbiAgfTtcblxuICB2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICBpZiAoaXNPYmplY3QoaXQpICYmIFRZUEVEX0FSUkFZIGluIGl0KSByZXR1cm4gaXQ7XG4gICAgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSB0eXBlZCBhcnJheSEnKTtcbiAgfTtcblxuICB2YXIgYWxsb2NhdGUgPSBmdW5jdGlvbiAoQywgbGVuZ3RoKSB7XG4gICAgaWYgKCEoaXNPYmplY3QoQykgJiYgVFlQRURfQ09OU1RSVUNUT1IgaW4gQykpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignSXQgaXMgbm90IGEgdHlwZWQgYXJyYXkgY29uc3RydWN0b3IhJyk7XG4gICAgfSByZXR1cm4gbmV3IEMobGVuZ3RoKTtcbiAgfTtcblxuICB2YXIgc3BlY2llc0Zyb21MaXN0ID0gZnVuY3Rpb24gKE8sIGxpc3QpIHtcbiAgICByZXR1cm4gZnJvbUxpc3Qoc3BlY2llc0NvbnN0cnVjdG9yKE8sIE9bREVGX0NPTlNUUlVDVE9SXSksIGxpc3QpO1xuICB9O1xuXG4gIHZhciBmcm9tTGlzdCA9IGZ1bmN0aW9uIChDLCBsaXN0KSB7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9IGFsbG9jYXRlKEMsIGxlbmd0aCk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSByZXN1bHRbaW5kZXhdID0gbGlzdFtpbmRleCsrXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBhZGRHZXR0ZXIgPSBmdW5jdGlvbiAoaXQsIGtleSwgaW50ZXJuYWwpIHtcbiAgICBkUChpdCwga2V5LCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fZFtpbnRlcm5hbF07IH0gfSk7XG4gIH07XG5cbiAgdmFyICRmcm9tID0gZnVuY3Rpb24gZnJvbShzb3VyY2UgLyogLCBtYXBmbiwgdGhpc0FyZyAqLykge1xuICAgIHZhciBPID0gdG9PYmplY3Qoc291cmNlKTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oTyk7XG4gICAgdmFyIGksIGxlbmd0aCwgdmFsdWVzLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICFpc0FycmF5SXRlcihpdGVyRm4pKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHZhbHVlcyA9IFtdLCBpID0gMDsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpKyspIHtcbiAgICAgICAgdmFsdWVzLnB1c2goc3RlcC52YWx1ZSk7XG4gICAgICB9IE8gPSB2YWx1ZXM7XG4gICAgfVxuICAgIGlmIChtYXBwaW5nICYmIGFMZW4gPiAyKSBtYXBmbiA9IGN0eChtYXBmbiwgYXJndW1lbnRzWzJdLCAyKTtcbiAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCksIHJlc3VsdCA9IGFsbG9jYXRlKHRoaXMsIGxlbmd0aCk7IGxlbmd0aCA+IGk7IGkrKykge1xuICAgICAgcmVzdWx0W2ldID0gbWFwcGluZyA/IG1hcGZuKE9baV0sIGkpIDogT1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgJG9mID0gZnVuY3Rpb24gb2YoLyogLi4uaXRlbXMgKi8pIHtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSBhbGxvY2F0ZSh0aGlzLCBsZW5ndGgpO1xuICAgIHdoaWxlIChsZW5ndGggPiBpbmRleCkgcmVzdWx0W2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleCsrXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIGlPUyBTYWZhcmkgNi54IGZhaWxzIGhlcmVcbiAgdmFyIFRPX0xPQ0FMRV9CVUcgPSAhIVVpbnQ4QXJyYXkgJiYgZmFpbHMoZnVuY3Rpb24gKCkgeyBhcnJheVRvTG9jYWxlU3RyaW5nLmNhbGwobmV3IFVpbnQ4QXJyYXkoMSkpOyB9KTtcblxuICB2YXIgJHRvTG9jYWxlU3RyaW5nID0gZnVuY3Rpb24gdG9Mb2NhbGVTdHJpbmcoKSB7XG4gICAgcmV0dXJuIGFycmF5VG9Mb2NhbGVTdHJpbmcuYXBwbHkoVE9fTE9DQUxFX0JVRyA/IGFycmF5U2xpY2UuY2FsbCh2YWxpZGF0ZSh0aGlzKSkgOiB2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgfTtcblxuICB2YXIgcHJvdG8gPSB7XG4gICAgY29weVdpdGhpbjogZnVuY3Rpb24gY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0IC8qICwgZW5kICovKSB7XG4gICAgICByZXR1cm4gYXJyYXlDb3B5V2l0aGluLmNhbGwodmFsaWRhdGUodGhpcyksIHRhcmdldCwgc3RhcnQsIGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGV2ZXJ5OiBmdW5jdGlvbiBldmVyeShjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgICAgcmV0dXJuIGFycmF5RXZlcnkodmFsaWRhdGUodGhpcyksIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGZpbGw6IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyogLCBzdGFydCwgZW5kICovKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheUZpbGwuYXBwbHkodmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgICAgcmV0dXJuIHNwZWNpZXNGcm9tTGlzdCh0aGlzLCBhcnJheUZpbHRlcih2YWxpZGF0ZSh0aGlzKSwgY2FsbGJhY2tmbixcbiAgICAgICAgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpKTtcbiAgICB9LFxuICAgIGZpbmQ6IGZ1bmN0aW9uIGZpbmQocHJlZGljYXRlIC8qICwgdGhpc0FyZyAqLykge1xuICAgICAgcmV0dXJuIGFycmF5RmluZCh2YWxpZGF0ZSh0aGlzKSwgcHJlZGljYXRlLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBmaW5kSW5kZXg6IGZ1bmN0aW9uIGZpbmRJbmRleChwcmVkaWNhdGUgLyogLCB0aGlzQXJnICovKSB7XG4gICAgICByZXR1cm4gYXJyYXlGaW5kSW5kZXgodmFsaWRhdGUodGhpcyksIHByZWRpY2F0ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgICAgYXJyYXlGb3JFYWNoKHZhbGlkYXRlKHRoaXMpLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBpbmRleE9mOiBmdW5jdGlvbiBpbmRleE9mKHNlYXJjaEVsZW1lbnQgLyogLCBmcm9tSW5kZXggKi8pIHtcbiAgICAgIHJldHVybiBhcnJheUluZGV4T2YodmFsaWRhdGUodGhpcyksIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hFbGVtZW50IC8qICwgZnJvbUluZGV4ICovKSB7XG4gICAgICByZXR1cm4gYXJyYXlJbmNsdWRlcyh2YWxpZGF0ZSh0aGlzKSwgc2VhcmNoRWxlbWVudCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgam9pbjogZnVuY3Rpb24gam9pbihzZXBhcmF0b3IpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgcmV0dXJuIGFycmF5Sm9pbi5hcHBseSh2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGxhc3RJbmRleE9mOiBmdW5jdGlvbiBsYXN0SW5kZXhPZihzZWFyY2hFbGVtZW50IC8qICwgZnJvbUluZGV4ICovKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheUxhc3RJbmRleE9mLmFwcGx5KHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgbWFwOiBmdW5jdGlvbiBtYXAobWFwZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgICByZXR1cm4gJG1hcCh2YWxpZGF0ZSh0aGlzKSwgbWFwZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlKGNhbGxiYWNrZm4gLyogLCBpbml0aWFsVmFsdWUgKi8pIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgcmV0dXJuIGFycmF5UmVkdWNlLmFwcGx5KHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4gLyogLCBpbml0aWFsVmFsdWUgKi8pIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgcmV0dXJuIGFycmF5UmVkdWNlUmlnaHQuYXBwbHkodmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICByZXZlcnNlOiBmdW5jdGlvbiByZXZlcnNlKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGxlbmd0aCA9IHZhbGlkYXRlKHRoYXQpLmxlbmd0aDtcbiAgICAgIHZhciBtaWRkbGUgPSBNYXRoLmZsb29yKGxlbmd0aCAvIDIpO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciB2YWx1ZTtcbiAgICAgIHdoaWxlIChpbmRleCA8IG1pZGRsZSkge1xuICAgICAgICB2YWx1ZSA9IHRoYXRbaW5kZXhdO1xuICAgICAgICB0aGF0W2luZGV4KytdID0gdGhhdFstLWxlbmd0aF07XG4gICAgICAgIHRoYXRbbGVuZ3RoXSA9IHZhbHVlO1xuICAgICAgfSByZXR1cm4gdGhhdDtcbiAgICB9LFxuICAgIHNvbWU6IGZ1bmN0aW9uIHNvbWUoY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgICAgIHJldHVybiBhcnJheVNvbWUodmFsaWRhdGUodGhpcyksIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIHNvcnQ6IGZ1bmN0aW9uIHNvcnQoY29tcGFyZWZuKSB7XG4gICAgICByZXR1cm4gYXJyYXlTb3J0LmNhbGwodmFsaWRhdGUodGhpcyksIGNvbXBhcmVmbik7XG4gICAgfSxcbiAgICBzdWJhcnJheTogZnVuY3Rpb24gc3ViYXJyYXkoYmVnaW4sIGVuZCkge1xuICAgICAgdmFyIE8gPSB2YWxpZGF0ZSh0aGlzKTtcbiAgICAgIHZhciBsZW5ndGggPSBPLmxlbmd0aDtcbiAgICAgIHZhciAkYmVnaW4gPSB0b0Fic29sdXRlSW5kZXgoYmVnaW4sIGxlbmd0aCk7XG4gICAgICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3IoTywgT1tERUZfQ09OU1RSVUNUT1JdKSkoXG4gICAgICAgIE8uYnVmZmVyLFxuICAgICAgICBPLmJ5dGVPZmZzZXQgKyAkYmVnaW4gKiBPLkJZVEVTX1BFUl9FTEVNRU5ULFxuICAgICAgICB0b0xlbmd0aCgoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0Fic29sdXRlSW5kZXgoZW5kLCBsZW5ndGgpKSAtICRiZWdpbilcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIHZhciAkc2xpY2UgPSBmdW5jdGlvbiBzbGljZShzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHNwZWNpZXNGcm9tTGlzdCh0aGlzLCBhcnJheVNsaWNlLmNhbGwodmFsaWRhdGUodGhpcyksIHN0YXJ0LCBlbmQpKTtcbiAgfTtcblxuICB2YXIgJHNldCA9IGZ1bmN0aW9uIHNldChhcnJheUxpa2UgLyogLCBvZmZzZXQgKi8pIHtcbiAgICB2YWxpZGF0ZSh0aGlzKTtcbiAgICB2YXIgb2Zmc2V0ID0gdG9PZmZzZXQoYXJndW1lbnRzWzFdLCAxKTtcbiAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgdmFyIHNyYyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIGxlbiA9IHRvTGVuZ3RoKHNyYy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgaWYgKGxlbiArIG9mZnNldCA+IGxlbmd0aCkgdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgIHdoaWxlIChpbmRleCA8IGxlbikgdGhpc1tvZmZzZXQgKyBpbmRleF0gPSBzcmNbaW5kZXgrK107XG4gIH07XG5cbiAgdmFyICRpdGVyYXRvcnMgPSB7XG4gICAgZW50cmllczogZnVuY3Rpb24gZW50cmllcygpIHtcbiAgICAgIHJldHVybiBhcnJheUVudHJpZXMuY2FsbCh2YWxpZGF0ZSh0aGlzKSk7XG4gICAgfSxcbiAgICBrZXlzOiBmdW5jdGlvbiBrZXlzKCkge1xuICAgICAgcmV0dXJuIGFycmF5S2V5cy5jYWxsKHZhbGlkYXRlKHRoaXMpKTtcbiAgICB9LFxuICAgIHZhbHVlczogZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgICAgcmV0dXJuIGFycmF5VmFsdWVzLmNhbGwodmFsaWRhdGUodGhpcykpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgaXNUQUluZGV4ID0gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHRhcmdldClcbiAgICAgICYmIHRhcmdldFtUWVBFRF9BUlJBWV1cbiAgICAgICYmIHR5cGVvZiBrZXkgIT0gJ3N5bWJvbCdcbiAgICAgICYmIGtleSBpbiB0YXJnZXRcbiAgICAgICYmIFN0cmluZygra2V5KSA9PSBTdHJpbmcoa2V5KTtcbiAgfTtcbiAgdmFyICRnZXREZXNjID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG4gICAgcmV0dXJuIGlzVEFJbmRleCh0YXJnZXQsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpXG4gICAgICA/IHByb3BlcnR5RGVzYygyLCB0YXJnZXRba2V5XSlcbiAgICAgIDogZ09QRCh0YXJnZXQsIGtleSk7XG4gIH07XG4gIHZhciAkc2V0RGVzYyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgaWYgKGlzVEFJbmRleCh0YXJnZXQsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpXG4gICAgICAmJiBpc09iamVjdChkZXNjKVxuICAgICAgJiYgaGFzKGRlc2MsICd2YWx1ZScpXG4gICAgICAmJiAhaGFzKGRlc2MsICdnZXQnKVxuICAgICAgJiYgIWhhcyhkZXNjLCAnc2V0JylcbiAgICAgIC8vIFRPRE86IGFkZCB2YWxpZGF0aW9uIGRlc2NyaXB0b3Igdy9vIGNhbGxpbmcgYWNjZXNzb3JzXG4gICAgICAmJiAhZGVzYy5jb25maWd1cmFibGVcbiAgICAgICYmICghaGFzKGRlc2MsICd3cml0YWJsZScpIHx8IGRlc2Mud3JpdGFibGUpXG4gICAgICAmJiAoIWhhcyhkZXNjLCAnZW51bWVyYWJsZScpIHx8IGRlc2MuZW51bWVyYWJsZSlcbiAgICApIHtcbiAgICAgIHRhcmdldFtrZXldID0gZGVzYy52YWx1ZTtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfSByZXR1cm4gZFAodGFyZ2V0LCBrZXksIGRlc2MpO1xuICB9O1xuXG4gIGlmICghQUxMX0NPTlNUUlVDVE9SUykge1xuICAgICRHT1BELmYgPSAkZ2V0RGVzYztcbiAgICAkRFAuZiA9ICRzZXREZXNjO1xuICB9XG5cbiAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhQUxMX0NPTlNUUlVDVE9SUywgJ09iamVjdCcsIHtcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXREZXNjLFxuICAgIGRlZmluZVByb3BlcnR5OiAkc2V0RGVzY1xuICB9KTtcblxuICBpZiAoZmFpbHMoZnVuY3Rpb24gKCkgeyBhcnJheVRvU3RyaW5nLmNhbGwoe30pOyB9KSkge1xuICAgIGFycmF5VG9TdHJpbmcgPSBhcnJheVRvTG9jYWxlU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICByZXR1cm4gYXJyYXlKb2luLmNhbGwodGhpcyk7XG4gICAgfTtcbiAgfVxuXG4gIHZhciAkVHlwZWRBcnJheVByb3RvdHlwZSQgPSByZWRlZmluZUFsbCh7fSwgcHJvdG8pO1xuICByZWRlZmluZUFsbCgkVHlwZWRBcnJheVByb3RvdHlwZSQsICRpdGVyYXRvcnMpO1xuICBoaWRlKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgSVRFUkFUT1IsICRpdGVyYXRvcnMudmFsdWVzKTtcbiAgcmVkZWZpbmVBbGwoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCB7XG4gICAgc2xpY2U6ICRzbGljZSxcbiAgICBzZXQ6ICRzZXQsXG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHsgLyogbm9vcCAqLyB9LFxuICAgIHRvU3RyaW5nOiBhcnJheVRvU3RyaW5nLFxuICAgIHRvTG9jYWxlU3RyaW5nOiAkdG9Mb2NhbGVTdHJpbmdcbiAgfSk7XG4gIGFkZEdldHRlcigkVHlwZWRBcnJheVByb3RvdHlwZSQsICdidWZmZXInLCAnYicpO1xuICBhZGRHZXR0ZXIoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCAnYnl0ZU9mZnNldCcsICdvJyk7XG4gIGFkZEdldHRlcigkVHlwZWRBcnJheVByb3RvdHlwZSQsICdieXRlTGVuZ3RoJywgJ2wnKTtcbiAgYWRkR2V0dGVyKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgJ2xlbmd0aCcsICdlJyk7XG4gIGRQKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgVEFHLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzW1RZUEVEX0FSUkFZXTsgfVxuICB9KTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LXN0YXRlbWVudHNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBCWVRFUywgd3JhcHBlciwgQ0xBTVBFRCkge1xuICAgIENMQU1QRUQgPSAhIUNMQU1QRUQ7XG4gICAgdmFyIE5BTUUgPSBLRVkgKyAoQ0xBTVBFRCA/ICdDbGFtcGVkJyA6ICcnKSArICdBcnJheSc7XG4gICAgdmFyIEdFVFRFUiA9ICdnZXQnICsgS0VZO1xuICAgIHZhciBTRVRURVIgPSAnc2V0JyArIEtFWTtcbiAgICB2YXIgVHlwZWRBcnJheSA9IGdsb2JhbFtOQU1FXTtcbiAgICB2YXIgQmFzZSA9IFR5cGVkQXJyYXkgfHwge307XG4gICAgdmFyIFRBQyA9IFR5cGVkQXJyYXkgJiYgZ2V0UHJvdG90eXBlT2YoVHlwZWRBcnJheSk7XG4gICAgdmFyIEZPUkNFRCA9ICFUeXBlZEFycmF5IHx8ICEkdHlwZWQuQUJWO1xuICAgIHZhciBPID0ge307XG4gICAgdmFyIFR5cGVkQXJyYXlQcm90b3R5cGUgPSBUeXBlZEFycmF5ICYmIFR5cGVkQXJyYXlbUFJPVE9UWVBFXTtcbiAgICB2YXIgZ2V0dGVyID0gZnVuY3Rpb24gKHRoYXQsIGluZGV4KSB7XG4gICAgICB2YXIgZGF0YSA9IHRoYXQuX2Q7XG4gICAgICByZXR1cm4gZGF0YS52W0dFVFRFUl0oaW5kZXggKiBCWVRFUyArIGRhdGEubywgTElUVExFX0VORElBTik7XG4gICAgfTtcbiAgICB2YXIgc2V0dGVyID0gZnVuY3Rpb24gKHRoYXQsIGluZGV4LCB2YWx1ZSkge1xuICAgICAgdmFyIGRhdGEgPSB0aGF0Ll9kO1xuICAgICAgaWYgKENMQU1QRUQpIHZhbHVlID0gKHZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSkpIDwgMCA/IDAgOiB2YWx1ZSA+IDB4ZmYgPyAweGZmIDogdmFsdWUgJiAweGZmO1xuICAgICAgZGF0YS52W1NFVFRFUl0oaW5kZXggKiBCWVRFUyArIGRhdGEubywgdmFsdWUsIExJVFRMRV9FTkRJQU4pO1xuICAgIH07XG4gICAgdmFyIGFkZEVsZW1lbnQgPSBmdW5jdGlvbiAodGhhdCwgaW5kZXgpIHtcbiAgICAgIGRQKHRoYXQsIGluZGV4LCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBnZXR0ZXIodGhpcywgaW5kZXgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBzZXR0ZXIodGhpcywgaW5kZXgsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSB7XG4gICAgICBUeXBlZEFycmF5ID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgZGF0YSwgJG9mZnNldCwgJGxlbmd0aCkge1xuICAgICAgICBhbkluc3RhbmNlKHRoYXQsIFR5cGVkQXJyYXksIE5BTUUsICdfZCcpO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gMDtcbiAgICAgICAgdmFyIGJ1ZmZlciwgYnl0ZUxlbmd0aCwgbGVuZ3RoLCBrbGFzcztcbiAgICAgICAgaWYgKCFpc09iamVjdChkYXRhKSkge1xuICAgICAgICAgIGxlbmd0aCA9IHRvSW5kZXgoZGF0YSk7XG4gICAgICAgICAgYnl0ZUxlbmd0aCA9IGxlbmd0aCAqIEJZVEVTO1xuICAgICAgICAgIGJ1ZmZlciA9IG5ldyAkQXJyYXlCdWZmZXIoYnl0ZUxlbmd0aCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mICRBcnJheUJ1ZmZlciB8fCAoa2xhc3MgPSBjbGFzc29mKGRhdGEpKSA9PSBBUlJBWV9CVUZGRVIgfHwga2xhc3MgPT0gU0hBUkVEX0JVRkZFUikge1xuICAgICAgICAgIGJ1ZmZlciA9IGRhdGE7XG4gICAgICAgICAgb2Zmc2V0ID0gdG9PZmZzZXQoJG9mZnNldCwgQllURVMpO1xuICAgICAgICAgIHZhciAkbGVuID0gZGF0YS5ieXRlTGVuZ3RoO1xuICAgICAgICAgIGlmICgkbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICgkbGVuICUgQllURVMpIHRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICAgICAgICAgIGJ5dGVMZW5ndGggPSAkbGVuIC0gb2Zmc2V0O1xuICAgICAgICAgICAgaWYgKGJ5dGVMZW5ndGggPCAwKSB0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ5dGVMZW5ndGggPSB0b0xlbmd0aCgkbGVuZ3RoKSAqIEJZVEVTO1xuICAgICAgICAgICAgaWYgKGJ5dGVMZW5ndGggKyBvZmZzZXQgPiAkbGVuKSB0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxlbmd0aCA9IGJ5dGVMZW5ndGggLyBCWVRFUztcbiAgICAgICAgfSBlbHNlIGlmIChUWVBFRF9BUlJBWSBpbiBkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGZyb21MaXN0KFR5cGVkQXJyYXksIGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkZnJvbS5jYWxsKFR5cGVkQXJyYXksIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGhpZGUodGhhdCwgJ19kJywge1xuICAgICAgICAgIGI6IGJ1ZmZlcixcbiAgICAgICAgICBvOiBvZmZzZXQsXG4gICAgICAgICAgbDogYnl0ZUxlbmd0aCxcbiAgICAgICAgICBlOiBsZW5ndGgsXG4gICAgICAgICAgdjogbmV3ICREYXRhVmlldyhidWZmZXIpXG4gICAgICAgIH0pO1xuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIGFkZEVsZW1lbnQodGhhdCwgaW5kZXgrKyk7XG4gICAgICB9KTtcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGUgPSBUeXBlZEFycmF5W1BST1RPVFlQRV0gPSBjcmVhdGUoJFR5cGVkQXJyYXlQcm90b3R5cGUkKTtcbiAgICAgIGhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgVHlwZWRBcnJheSk7XG4gICAgfSBlbHNlIGlmICghZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgICAgVHlwZWRBcnJheSgxKTtcbiAgICB9KSB8fCAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgICAgbmV3IFR5cGVkQXJyYXkoLTEpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIH0pIHx8ICEkaXRlckRldGVjdChmdW5jdGlvbiAoaXRlcikge1xuICAgICAgbmV3IFR5cGVkQXJyYXkoKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAgIG5ldyBUeXBlZEFycmF5KG51bGwpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgICAgbmV3IFR5cGVkQXJyYXkoMS41KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAgIG5ldyBUeXBlZEFycmF5KGl0ZXIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIH0sIHRydWUpKSB7XG4gICAgICBUeXBlZEFycmF5ID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgZGF0YSwgJG9mZnNldCwgJGxlbmd0aCkge1xuICAgICAgICBhbkluc3RhbmNlKHRoYXQsIFR5cGVkQXJyYXksIE5BTUUpO1xuICAgICAgICB2YXIga2xhc3M7XG4gICAgICAgIC8vIGB3c2AgbW9kdWxlIGJ1ZywgdGVtcG9yYXJpbHkgcmVtb3ZlIHZhbGlkYXRpb24gbGVuZ3RoIGZvciBVaW50OEFycmF5XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJzb2NrZXRzL3dzL3B1bGwvNjQ1XG4gICAgICAgIGlmICghaXNPYmplY3QoZGF0YSkpIHJldHVybiBuZXcgQmFzZSh0b0luZGV4KGRhdGEpKTtcbiAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiAkQXJyYXlCdWZmZXIgfHwgKGtsYXNzID0gY2xhc3NvZihkYXRhKSkgPT0gQVJSQVlfQlVGRkVSIHx8IGtsYXNzID09IFNIQVJFRF9CVUZGRVIpIHtcbiAgICAgICAgICByZXR1cm4gJGxlbmd0aCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IG5ldyBCYXNlKGRhdGEsIHRvT2Zmc2V0KCRvZmZzZXQsIEJZVEVTKSwgJGxlbmd0aClcbiAgICAgICAgICAgIDogJG9mZnNldCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgID8gbmV3IEJhc2UoZGF0YSwgdG9PZmZzZXQoJG9mZnNldCwgQllURVMpKVxuICAgICAgICAgICAgICA6IG5ldyBCYXNlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChUWVBFRF9BUlJBWSBpbiBkYXRhKSByZXR1cm4gZnJvbUxpc3QoVHlwZWRBcnJheSwgZGF0YSk7XG4gICAgICAgIHJldHVybiAkZnJvbS5jYWxsKFR5cGVkQXJyYXksIGRhdGEpO1xuICAgICAgfSk7XG4gICAgICBhcnJheUZvckVhY2goVEFDICE9PSBGdW5jdGlvbi5wcm90b3R5cGUgPyBnT1BOKEJhc2UpLmNvbmNhdChnT1BOKFRBQykpIDogZ09QTihCYXNlKSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoIShrZXkgaW4gVHlwZWRBcnJheSkpIGhpZGUoVHlwZWRBcnJheSwga2V5LCBCYXNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgICBUeXBlZEFycmF5W1BST1RPVFlQRV0gPSBUeXBlZEFycmF5UHJvdG90eXBlO1xuICAgICAgaWYgKCFMSUJSQVJZKSBUeXBlZEFycmF5UHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVHlwZWRBcnJheTtcbiAgICB9XG4gICAgdmFyICRuYXRpdmVJdGVyYXRvciA9IFR5cGVkQXJyYXlQcm90b3R5cGVbSVRFUkFUT1JdO1xuICAgIHZhciBDT1JSRUNUX0lURVJfTkFNRSA9ICEhJG5hdGl2ZUl0ZXJhdG9yXG4gICAgICAmJiAoJG5hdGl2ZUl0ZXJhdG9yLm5hbWUgPT0gJ3ZhbHVlcycgfHwgJG5hdGl2ZUl0ZXJhdG9yLm5hbWUgPT0gdW5kZWZpbmVkKTtcbiAgICB2YXIgJGl0ZXJhdG9yID0gJGl0ZXJhdG9ycy52YWx1ZXM7XG4gICAgaGlkZShUeXBlZEFycmF5LCBUWVBFRF9DT05TVFJVQ1RPUiwgdHJ1ZSk7XG4gICAgaGlkZShUeXBlZEFycmF5UHJvdG90eXBlLCBUWVBFRF9BUlJBWSwgTkFNRSk7XG4gICAgaGlkZShUeXBlZEFycmF5UHJvdG90eXBlLCBWSUVXLCB0cnVlKTtcbiAgICBoaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsIERFRl9DT05TVFJVQ1RPUiwgVHlwZWRBcnJheSk7XG5cbiAgICBpZiAoQ0xBTVBFRCA/IG5ldyBUeXBlZEFycmF5KDEpW1RBR10gIT0gTkFNRSA6ICEoVEFHIGluIFR5cGVkQXJyYXlQcm90b3R5cGUpKSB7XG4gICAgICBkUChUeXBlZEFycmF5UHJvdG90eXBlLCBUQUcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBOQU1FOyB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBPW05BTUVdID0gVHlwZWRBcnJheTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogKFR5cGVkQXJyYXkgIT0gQmFzZSksIE8pO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlMsIE5BTUUsIHtcbiAgICAgIEJZVEVTX1BFUl9FTEVNRU5UOiBCWVRFU1xuICAgIH0pO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbiAoKSB7IEJhc2Uub2YuY2FsbChUeXBlZEFycmF5LCAxKTsgfSksIE5BTUUsIHtcbiAgICAgIGZyb206ICRmcm9tLFxuICAgICAgb2Y6ICRvZlxuICAgIH0pO1xuXG4gICAgaWYgKCEoQllURVNfUEVSX0VMRU1FTlQgaW4gVHlwZWRBcnJheVByb3RvdHlwZSkpIGhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgQllURVNfUEVSX0VMRU1FTlQsIEJZVEVTKTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5QLCBOQU1FLCBwcm90byk7XG5cbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBGT1JDRURfU0VULCBOQU1FLCB7IHNldDogJHNldCB9KTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogIUNPUlJFQ1RfSVRFUl9OQU1FLCBOQU1FLCAkaXRlcmF0b3JzKTtcblxuICAgIGlmICghTElCUkFSWSAmJiBUeXBlZEFycmF5UHJvdG90eXBlLnRvU3RyaW5nICE9IGFycmF5VG9TdHJpbmcpIFR5cGVkQXJyYXlQcm90b3R5cGUudG9TdHJpbmcgPSBhcnJheVRvU3RyaW5nO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgICBuZXcgVHlwZWRBcnJheSgxKS5zbGljZSgpO1xuICAgIH0pLCBOQU1FLCB7IHNsaWNlOiAkc2xpY2UgfSk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gWzEsIDJdLnRvTG9jYWxlU3RyaW5nKCkgIT0gbmV3IFR5cGVkQXJyYXkoWzEsIDJdKS50b0xvY2FsZVN0cmluZygpO1xuICAgIH0pIHx8ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nLmNhbGwoWzEsIDJdKTtcbiAgICB9KSksIE5BTUUsIHsgdG9Mb2NhbGVTdHJpbmc6ICR0b0xvY2FsZVN0cmluZyB9KTtcblxuICAgIEl0ZXJhdG9yc1tOQU1FXSA9IENPUlJFQ1RfSVRFUl9OQU1FID8gJG5hdGl2ZUl0ZXJhdG9yIDogJGl0ZXJhdG9yO1xuICAgIGlmICghTElCUkFSWSAmJiAhQ09SUkVDVF9JVEVSX05BTUUpIGhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgSVRFUkFUT1IsICRpdGVyYXRvcik7XG4gIH07XG59IGVsc2UgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJHR5cGVkID0gcmVxdWlyZSgnLi9fdHlwZWQnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvSW5kZXggPSByZXF1aXJlKCcuL190by1pbmRleCcpO1xudmFyIGdPUE4gPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmY7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGFycmF5RmlsbCA9IHJlcXVpcmUoJy4vX2FycmF5LWZpbGwnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgQVJSQVlfQlVGRkVSID0gJ0FycmF5QnVmZmVyJztcbnZhciBEQVRBX1ZJRVcgPSAnRGF0YVZpZXcnO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIFdST05HX0xFTkdUSCA9ICdXcm9uZyBsZW5ndGghJztcbnZhciBXUk9OR19JTkRFWCA9ICdXcm9uZyBpbmRleCEnO1xudmFyICRBcnJheUJ1ZmZlciA9IGdsb2JhbFtBUlJBWV9CVUZGRVJdO1xudmFyICREYXRhVmlldyA9IGdsb2JhbFtEQVRBX1ZJRVddO1xudmFyIE1hdGggPSBnbG9iYWwuTWF0aDtcbnZhciBSYW5nZUVycm9yID0gZ2xvYmFsLlJhbmdlRXJyb3I7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93LXJlc3RyaWN0ZWQtbmFtZXNcbnZhciBJbmZpbml0eSA9IGdsb2JhbC5JbmZpbml0eTtcbnZhciBCYXNlQnVmZmVyID0gJEFycmF5QnVmZmVyO1xudmFyIGFicyA9IE1hdGguYWJzO1xudmFyIHBvdyA9IE1hdGgucG93O1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbnZhciBsb2cgPSBNYXRoLmxvZztcbnZhciBMTjIgPSBNYXRoLkxOMjtcbnZhciBCVUZGRVIgPSAnYnVmZmVyJztcbnZhciBCWVRFX0xFTkdUSCA9ICdieXRlTGVuZ3RoJztcbnZhciBCWVRFX09GRlNFVCA9ICdieXRlT2Zmc2V0JztcbnZhciAkQlVGRkVSID0gREVTQ1JJUFRPUlMgPyAnX2InIDogQlVGRkVSO1xudmFyICRMRU5HVEggPSBERVNDUklQVE9SUyA/ICdfbCcgOiBCWVRFX0xFTkdUSDtcbnZhciAkT0ZGU0VUID0gREVTQ1JJUFRPUlMgPyAnX28nIDogQllURV9PRkZTRVQ7XG5cbi8vIElFRUU3NTQgY29udmVyc2lvbnMgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9pZWVlNzU0XG5mdW5jdGlvbiBwYWNrSUVFRTc1NCh2YWx1ZSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBidWZmZXIgPSBuZXcgQXJyYXkobkJ5dGVzKTtcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDE7XG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxO1xuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDE7XG4gIHZhciBydCA9IG1MZW4gPT09IDIzID8gcG93KDIsIC0yNCkgLSBwb3coMiwgLTc3KSA6IDA7XG4gIHZhciBpID0gMDtcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgdmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCA/IDEgOiAwO1xuICB2YXIgZSwgbSwgYztcbiAgdmFsdWUgPSBhYnModmFsdWUpO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gIGlmICh2YWx1ZSAhPSB2YWx1ZSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgbSA9IHZhbHVlICE9IHZhbHVlID8gMSA6IDA7XG4gICAgZSA9IGVNYXg7XG4gIH0gZWxzZSB7XG4gICAgZSA9IGZsb29yKGxvZyh2YWx1ZSkgLyBMTjIpO1xuICAgIGlmICh2YWx1ZSAqIChjID0gcG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS07XG4gICAgICBjICo9IDI7XG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIHBvdygyLCAxIC0gZUJpYXMpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrKztcbiAgICAgIGMgLz0gMjtcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMDtcbiAgICAgIGUgPSBlTWF4O1xuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBwb3coMiwgbUxlbik7XG4gICAgICBlID0gZSArIGVCaWFzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBwb3coMiwgZUJpYXMgLSAxKSAqIHBvdygyLCBtTGVuKTtcbiAgICAgIGUgPSAwO1xuICAgIH1cbiAgfVxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbaSsrXSA9IG0gJiAyNTUsIG0gLz0gMjU2LCBtTGVuIC09IDgpO1xuICBlID0gZSA8PCBtTGVuIHwgbTtcbiAgZUxlbiArPSBtTGVuO1xuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltpKytdID0gZSAmIDI1NSwgZSAvPSAyNTYsIGVMZW4gLT0gOCk7XG4gIGJ1ZmZlclstLWldIHw9IHMgKiAxMjg7XG4gIHJldHVybiBidWZmZXI7XG59XG5mdW5jdGlvbiB1bnBhY2tJRUVFNzU0KGJ1ZmZlciwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxO1xuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMTtcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxO1xuICB2YXIgbkJpdHMgPSBlTGVuIC0gNztcbiAgdmFyIGkgPSBuQnl0ZXMgLSAxO1xuICB2YXIgcyA9IGJ1ZmZlcltpLS1dO1xuICB2YXIgZSA9IHMgJiAxMjc7XG4gIHZhciBtO1xuICBzID4+PSA3O1xuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltpXSwgaS0tLCBuQml0cyAtPSA4KTtcbiAgbSA9IGUgJiAoMSA8PCAtbkJpdHMpIC0gMTtcbiAgZSA+Pj0gLW5CaXRzO1xuICBuQml0cyArPSBtTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltpXSwgaS0tLCBuQml0cyAtPSA4KTtcbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzO1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6IHMgPyAtSW5maW5pdHkgOiBJbmZpbml0eTtcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIHBvdygyLCBtTGVuKTtcbiAgICBlID0gZSAtIGVCaWFzO1xuICB9IHJldHVybiAocyA/IC0xIDogMSkgKiBtICogcG93KDIsIGUgLSBtTGVuKTtcbn1cblxuZnVuY3Rpb24gdW5wYWNrSTMyKGJ5dGVzKSB7XG4gIHJldHVybiBieXRlc1szXSA8PCAyNCB8IGJ5dGVzWzJdIDw8IDE2IHwgYnl0ZXNbMV0gPDwgOCB8IGJ5dGVzWzBdO1xufVxuZnVuY3Rpb24gcGFja0k4KGl0KSB7XG4gIHJldHVybiBbaXQgJiAweGZmXTtcbn1cbmZ1bmN0aW9uIHBhY2tJMTYoaXQpIHtcbiAgcmV0dXJuIFtpdCAmIDB4ZmYsIGl0ID4+IDggJiAweGZmXTtcbn1cbmZ1bmN0aW9uIHBhY2tJMzIoaXQpIHtcbiAgcmV0dXJuIFtpdCAmIDB4ZmYsIGl0ID4+IDggJiAweGZmLCBpdCA+PiAxNiAmIDB4ZmYsIGl0ID4+IDI0ICYgMHhmZl07XG59XG5mdW5jdGlvbiBwYWNrRjY0KGl0KSB7XG4gIHJldHVybiBwYWNrSUVFRTc1NChpdCwgNTIsIDgpO1xufVxuZnVuY3Rpb24gcGFja0YzMihpdCkge1xuICByZXR1cm4gcGFja0lFRUU3NTQoaXQsIDIzLCA0KTtcbn1cblxuZnVuY3Rpb24gYWRkR2V0dGVyKEMsIGtleSwgaW50ZXJuYWwpIHtcbiAgZFAoQ1tQUk9UT1RZUEVdLCBrZXksIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzW2ludGVybmFsXTsgfSB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0KHZpZXcsIGJ5dGVzLCBpbmRleCwgaXNMaXR0bGVFbmRpYW4pIHtcbiAgdmFyIG51bUluZGV4ID0gK2luZGV4O1xuICB2YXIgaW50SW5kZXggPSB0b0luZGV4KG51bUluZGV4KTtcbiAgaWYgKGludEluZGV4ICsgYnl0ZXMgPiB2aWV3WyRMRU5HVEhdKSB0aHJvdyBSYW5nZUVycm9yKFdST05HX0lOREVYKTtcbiAgdmFyIHN0b3JlID0gdmlld1skQlVGRkVSXS5fYjtcbiAgdmFyIHN0YXJ0ID0gaW50SW5kZXggKyB2aWV3WyRPRkZTRVRdO1xuICB2YXIgcGFjayA9IHN0b3JlLnNsaWNlKHN0YXJ0LCBzdGFydCArIGJ5dGVzKTtcbiAgcmV0dXJuIGlzTGl0dGxlRW5kaWFuID8gcGFjayA6IHBhY2sucmV2ZXJzZSgpO1xufVxuZnVuY3Rpb24gc2V0KHZpZXcsIGJ5dGVzLCBpbmRleCwgY29udmVyc2lvbiwgdmFsdWUsIGlzTGl0dGxlRW5kaWFuKSB7XG4gIHZhciBudW1JbmRleCA9ICtpbmRleDtcbiAgdmFyIGludEluZGV4ID0gdG9JbmRleChudW1JbmRleCk7XG4gIGlmIChpbnRJbmRleCArIGJ5dGVzID4gdmlld1skTEVOR1RIXSkgdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19JTkRFWCk7XG4gIHZhciBzdG9yZSA9IHZpZXdbJEJVRkZFUl0uX2I7XG4gIHZhciBzdGFydCA9IGludEluZGV4ICsgdmlld1skT0ZGU0VUXTtcbiAgdmFyIHBhY2sgPSBjb252ZXJzaW9uKCt2YWx1ZSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXM7IGkrKykgc3RvcmVbc3RhcnQgKyBpXSA9IHBhY2tbaXNMaXR0bGVFbmRpYW4gPyBpIDogYnl0ZXMgLSBpIC0gMV07XG59XG5cbmlmICghJHR5cGVkLkFCVikge1xuICAkQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiBBcnJheUJ1ZmZlcihsZW5ndGgpIHtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRBcnJheUJ1ZmZlciwgQVJSQVlfQlVGRkVSKTtcbiAgICB2YXIgYnl0ZUxlbmd0aCA9IHRvSW5kZXgobGVuZ3RoKTtcbiAgICB0aGlzLl9iID0gYXJyYXlGaWxsLmNhbGwobmV3IEFycmF5KGJ5dGVMZW5ndGgpLCAwKTtcbiAgICB0aGlzWyRMRU5HVEhdID0gYnl0ZUxlbmd0aDtcbiAgfTtcblxuICAkRGF0YVZpZXcgPSBmdW5jdGlvbiBEYXRhVmlldyhidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpIHtcbiAgICBhbkluc3RhbmNlKHRoaXMsICREYXRhVmlldywgREFUQV9WSUVXKTtcbiAgICBhbkluc3RhbmNlKGJ1ZmZlciwgJEFycmF5QnVmZmVyLCBEQVRBX1ZJRVcpO1xuICAgIHZhciBidWZmZXJMZW5ndGggPSBidWZmZXJbJExFTkdUSF07XG4gICAgdmFyIG9mZnNldCA9IHRvSW50ZWdlcihieXRlT2Zmc2V0KTtcbiAgICBpZiAob2Zmc2V0IDwgMCB8fCBvZmZzZXQgPiBidWZmZXJMZW5ndGgpIHRocm93IFJhbmdlRXJyb3IoJ1dyb25nIG9mZnNldCEnKTtcbiAgICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA9PT0gdW5kZWZpbmVkID8gYnVmZmVyTGVuZ3RoIC0gb2Zmc2V0IDogdG9MZW5ndGgoYnl0ZUxlbmd0aCk7XG4gICAgaWYgKG9mZnNldCArIGJ5dGVMZW5ndGggPiBidWZmZXJMZW5ndGgpIHRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICB0aGlzWyRCVUZGRVJdID0gYnVmZmVyO1xuICAgIHRoaXNbJE9GRlNFVF0gPSBvZmZzZXQ7XG4gICAgdGhpc1skTEVOR1RIXSA9IGJ5dGVMZW5ndGg7XG4gIH07XG5cbiAgaWYgKERFU0NSSVBUT1JTKSB7XG4gICAgYWRkR2V0dGVyKCRBcnJheUJ1ZmZlciwgQllURV9MRU5HVEgsICdfbCcpO1xuICAgIGFkZEdldHRlcigkRGF0YVZpZXcsIEJVRkZFUiwgJ19iJyk7XG4gICAgYWRkR2V0dGVyKCREYXRhVmlldywgQllURV9MRU5HVEgsICdfbCcpO1xuICAgIGFkZEdldHRlcigkRGF0YVZpZXcsIEJZVEVfT0ZGU0VULCAnX28nKTtcbiAgfVxuXG4gIHJlZGVmaW5lQWxsKCREYXRhVmlld1tQUk9UT1RZUEVdLCB7XG4gICAgZ2V0SW50ODogZnVuY3Rpb24gZ2V0SW50OChieXRlT2Zmc2V0KSB7XG4gICAgICByZXR1cm4gZ2V0KHRoaXMsIDEsIGJ5dGVPZmZzZXQpWzBdIDw8IDI0ID4+IDI0O1xuICAgIH0sXG4gICAgZ2V0VWludDg6IGZ1bmN0aW9uIGdldFVpbnQ4KGJ5dGVPZmZzZXQpIHtcbiAgICAgIHJldHVybiBnZXQodGhpcywgMSwgYnl0ZU9mZnNldClbMF07XG4gICAgfSxcbiAgICBnZXRJbnQxNjogZnVuY3Rpb24gZ2V0SW50MTYoYnl0ZU9mZnNldCAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgdmFyIGJ5dGVzID0gZ2V0KHRoaXMsIDIsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSk7XG4gICAgICByZXR1cm4gKGJ5dGVzWzFdIDw8IDggfCBieXRlc1swXSkgPDwgMTYgPj4gMTY7XG4gICAgfSxcbiAgICBnZXRVaW50MTY6IGZ1bmN0aW9uIGdldFVpbnQxNihieXRlT2Zmc2V0IC8qICwgbGl0dGxlRW5kaWFuICovKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBnZXQodGhpcywgMiwgYnl0ZU9mZnNldCwgYXJndW1lbnRzWzFdKTtcbiAgICAgIHJldHVybiBieXRlc1sxXSA8PCA4IHwgYnl0ZXNbMF07XG4gICAgfSxcbiAgICBnZXRJbnQzMjogZnVuY3Rpb24gZ2V0SW50MzIoYnl0ZU9mZnNldCAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgcmV0dXJuIHVucGFja0kzMihnZXQodGhpcywgNCwgYnl0ZU9mZnNldCwgYXJndW1lbnRzWzFdKSk7XG4gICAgfSxcbiAgICBnZXRVaW50MzI6IGZ1bmN0aW9uIGdldFVpbnQzMihieXRlT2Zmc2V0IC8qICwgbGl0dGxlRW5kaWFuICovKSB7XG4gICAgICByZXR1cm4gdW5wYWNrSTMyKGdldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pKSA+Pj4gMDtcbiAgICB9LFxuICAgIGdldEZsb2F0MzI6IGZ1bmN0aW9uIGdldEZsb2F0MzIoYnl0ZU9mZnNldCAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgcmV0dXJuIHVucGFja0lFRUU3NTQoZ2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSksIDIzLCA0KTtcbiAgICB9LFxuICAgIGdldEZsb2F0NjQ6IGZ1bmN0aW9uIGdldEZsb2F0NjQoYnl0ZU9mZnNldCAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgcmV0dXJuIHVucGFja0lFRUU3NTQoZ2V0KHRoaXMsIDgsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSksIDUyLCA4KTtcbiAgICB9LFxuICAgIHNldEludDg6IGZ1bmN0aW9uIHNldEludDgoYnl0ZU9mZnNldCwgdmFsdWUpIHtcbiAgICAgIHNldCh0aGlzLCAxLCBieXRlT2Zmc2V0LCBwYWNrSTgsIHZhbHVlKTtcbiAgICB9LFxuICAgIHNldFVpbnQ4OiBmdW5jdGlvbiBzZXRVaW50OChieXRlT2Zmc2V0LCB2YWx1ZSkge1xuICAgICAgc2V0KHRoaXMsIDEsIGJ5dGVPZmZzZXQsIHBhY2tJOCwgdmFsdWUpO1xuICAgIH0sXG4gICAgc2V0SW50MTY6IGZ1bmN0aW9uIHNldEludDE2KGJ5dGVPZmZzZXQsIHZhbHVlIC8qICwgbGl0dGxlRW5kaWFuICovKSB7XG4gICAgICBzZXQodGhpcywgMiwgYnl0ZU9mZnNldCwgcGFja0kxNiwgdmFsdWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfSxcbiAgICBzZXRVaW50MTY6IGZ1bmN0aW9uIHNldFVpbnQxNihieXRlT2Zmc2V0LCB2YWx1ZSAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgc2V0KHRoaXMsIDIsIGJ5dGVPZmZzZXQsIHBhY2tJMTYsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0SW50MzI6IGZ1bmN0aW9uIHNldEludDMyKGJ5dGVPZmZzZXQsIHZhbHVlIC8qICwgbGl0dGxlRW5kaWFuICovKSB7XG4gICAgICBzZXQodGhpcywgNCwgYnl0ZU9mZnNldCwgcGFja0kzMiwgdmFsdWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfSxcbiAgICBzZXRVaW50MzI6IGZ1bmN0aW9uIHNldFVpbnQzMihieXRlT2Zmc2V0LCB2YWx1ZSAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgc2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIHBhY2tJMzIsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0RmxvYXQzMjogZnVuY3Rpb24gc2V0RmxvYXQzMihieXRlT2Zmc2V0LCB2YWx1ZSAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgc2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIHBhY2tGMzIsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0RmxvYXQ2NDogZnVuY3Rpb24gc2V0RmxvYXQ2NChieXRlT2Zmc2V0LCB2YWx1ZSAvKiAsIGxpdHRsZUVuZGlhbiAqLykge1xuICAgICAgc2V0KHRoaXMsIDgsIGJ5dGVPZmZzZXQsIHBhY2tGNjQsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH1cbiAgfSk7XG59IGVsc2Uge1xuICBpZiAoIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAkQXJyYXlCdWZmZXIoMSk7XG4gIH0pIHx8ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgbmV3ICRBcnJheUJ1ZmZlcigtMSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gIH0pIHx8IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICBuZXcgJEFycmF5QnVmZmVyKCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgbmV3ICRBcnJheUJ1ZmZlcigxLjUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5ldyAkQXJyYXlCdWZmZXIoTmFOKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICByZXR1cm4gJEFycmF5QnVmZmVyLm5hbWUgIT0gQVJSQVlfQlVGRkVSO1xuICB9KSkge1xuICAgICRBcnJheUJ1ZmZlciA9IGZ1bmN0aW9uIEFycmF5QnVmZmVyKGxlbmd0aCkge1xuICAgICAgYW5JbnN0YW5jZSh0aGlzLCAkQXJyYXlCdWZmZXIpO1xuICAgICAgcmV0dXJuIG5ldyBCYXNlQnVmZmVyKHRvSW5kZXgobGVuZ3RoKSk7XG4gICAgfTtcbiAgICB2YXIgQXJyYXlCdWZmZXJQcm90byA9ICRBcnJheUJ1ZmZlcltQUk9UT1RZUEVdID0gQmFzZUJ1ZmZlcltQUk9UT1RZUEVdO1xuICAgIGZvciAodmFyIGtleXMgPSBnT1BOKEJhc2VCdWZmZXIpLCBqID0gMCwga2V5OyBrZXlzLmxlbmd0aCA+IGo7KSB7XG4gICAgICBpZiAoISgoa2V5ID0ga2V5c1tqKytdKSBpbiAkQXJyYXlCdWZmZXIpKSBoaWRlKCRBcnJheUJ1ZmZlciwga2V5LCBCYXNlQnVmZmVyW2tleV0pO1xuICAgIH1cbiAgICBpZiAoIUxJQlJBUlkpIEFycmF5QnVmZmVyUHJvdG8uY29uc3RydWN0b3IgPSAkQXJyYXlCdWZmZXI7XG4gIH1cbiAgLy8gaU9TIFNhZmFyaSA3LnggYnVnXG4gIHZhciB2aWV3ID0gbmV3ICREYXRhVmlldyhuZXcgJEFycmF5QnVmZmVyKDIpKTtcbiAgdmFyICRzZXRJbnQ4ID0gJERhdGFWaWV3W1BST1RPVFlQRV0uc2V0SW50ODtcbiAgdmlldy5zZXRJbnQ4KDAsIDIxNDc0ODM2NDgpO1xuICB2aWV3LnNldEludDgoMSwgMjE0NzQ4MzY0OSk7XG4gIGlmICh2aWV3LmdldEludDgoMCkgfHwgIXZpZXcuZ2V0SW50OCgxKSkgcmVkZWZpbmVBbGwoJERhdGFWaWV3W1BST1RPVFlQRV0sIHtcbiAgICBzZXRJbnQ4OiBmdW5jdGlvbiBzZXRJbnQ4KGJ5dGVPZmZzZXQsIHZhbHVlKSB7XG4gICAgICAkc2V0SW50OC5jYWxsKHRoaXMsIGJ5dGVPZmZzZXQsIHZhbHVlIDw8IDI0ID4+IDI0KTtcbiAgICB9LFxuICAgIHNldFVpbnQ4OiBmdW5jdGlvbiBzZXRVaW50OChieXRlT2Zmc2V0LCB2YWx1ZSkge1xuICAgICAgJHNldEludDguY2FsbCh0aGlzLCBieXRlT2Zmc2V0LCB2YWx1ZSA8PCAyNCA+PiAyNCk7XG4gICAgfVxuICB9LCB0cnVlKTtcbn1cbnNldFRvU3RyaW5nVGFnKCRBcnJheUJ1ZmZlciwgQVJSQVlfQlVGRkVSKTtcbnNldFRvU3RyaW5nVGFnKCREYXRhVmlldywgREFUQV9WSUVXKTtcbmhpZGUoJERhdGFWaWV3W1BST1RPVFlQRV0sICR0eXBlZC5WSUVXLCB0cnVlKTtcbmV4cG9ydHNbQVJSQVlfQlVGRkVSXSA9ICRBcnJheUJ1ZmZlcjtcbmV4cG9ydHNbREFUQV9WSUVXXSA9ICREYXRhVmlldztcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFRZUEVEID0gdWlkKCd0eXBlZF9hcnJheScpO1xudmFyIFZJRVcgPSB1aWQoJ3ZpZXcnKTtcbnZhciBBQlYgPSAhIShnbG9iYWwuQXJyYXlCdWZmZXIgJiYgZ2xvYmFsLkRhdGFWaWV3KTtcbnZhciBDT05TVFIgPSBBQlY7XG52YXIgaSA9IDA7XG52YXIgbCA9IDk7XG52YXIgVHlwZWQ7XG5cbnZhciBUeXBlZEFycmF5Q29uc3RydWN0b3JzID0gKFxuICAnSW50OEFycmF5LFVpbnQ4QXJyYXksVWludDhDbGFtcGVkQXJyYXksSW50MTZBcnJheSxVaW50MTZBcnJheSxJbnQzMkFycmF5LFVpbnQzMkFycmF5LEZsb2F0MzJBcnJheSxGbG9hdDY0QXJyYXknXG4pLnNwbGl0KCcsJyk7XG5cbndoaWxlIChpIDwgbCkge1xuICBpZiAoVHlwZWQgPSBnbG9iYWxbVHlwZWRBcnJheUNvbnN0cnVjdG9yc1tpKytdXSkge1xuICAgIGhpZGUoVHlwZWQucHJvdG90eXBlLCBUWVBFRCwgdHJ1ZSk7XG4gICAgaGlkZShUeXBlZC5wcm90b3R5cGUsIFZJRVcsIHRydWUpO1xuICB9IGVsc2UgQ09OU1RSID0gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBQlY6IEFCVixcbiAgQ09OU1RSOiBDT05TVFIsXG4gIFRZUEVEOiBUWVBFRCxcbiAgVklFVzogVklFV1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIG5hdmlnYXRvciA9IGdsb2JhbC5uYXZpZ2F0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQgfHwgJyc7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBUWVBFKSB7XG4gIGlmICghaXNPYmplY3QoaXQpIHx8IGl0Ll90ICE9PSBUWVBFKSB0aHJvdyBUeXBlRXJyb3IoJ0luY29tcGF0aWJsZSByZWNlaXZlciwgJyArIFRZUEUgKyAnIHJlcXVpcmVkIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciB3a3NFeHQgPSByZXF1aXJlKCcuL193a3MtZXh0Jyk7XG52YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZiAobmFtZS5jaGFyQXQoMCkgIT0gJ18nICYmICEobmFtZSBpbiAkU3ltYm9sKSkgZGVmaW5lUHJvcGVydHkoJFN5bWJvbCwgbmFtZSwgeyB2YWx1ZTogd2tzRXh0LmYobmFtZSkgfSk7XG59O1xuIiwiZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fd2tzJyk7XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIi8vIDIyLjEuMy4zIEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIGVuZCA9IHRoaXMubGVuZ3RoKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHsgY29weVdpdGhpbjogcmVxdWlyZSgnLi9fYXJyYXktY29weS13aXRoaW4nKSB9KTtcblxucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoJ2NvcHlXaXRoaW4nKTtcbiIsIi8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHsgZmlsbDogcmVxdWlyZSgnLi9fYXJyYXktZmlsbCcpIH0pO1xuXG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKSgnZmlsbCcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjIuMS4zLjkgQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRmaW5kID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDYpO1xudmFyIEtFWSA9ICdmaW5kSW5kZXgnO1xudmFyIGZvcmNlZCA9IHRydWU7XG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xuaWYgKEtFWSBpbiBbXSkgQXJyYXkoMSlbS0VZXShmdW5jdGlvbiAoKSB7IGZvcmNlZCA9IGZhbHNlOyB9KTtcbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZm9yY2VkLCAnQXJyYXknLCB7XG4gIGZpbmRJbmRleDogZnVuY3Rpb24gZmluZEluZGV4KGNhbGxiYWNrZm4gLyogLCB0aGF0ID0gdW5kZWZpbmVkICovKSB7XG4gICAgcmV0dXJuICRmaW5kKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKShLRVkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjIuMS4zLjggQXJyYXkucHJvdG90eXBlLmZpbmQocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkZmluZCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSg1KTtcbnZhciBLRVkgPSAnZmluZCc7XG52YXIgZm9yY2VkID0gdHJ1ZTtcbi8vIFNob3VsZG4ndCBza2lwIGhvbGVzXG5pZiAoS0VZIGluIFtdKSBBcnJheSgxKVtLRVldKGZ1bmN0aW9uICgpIHsgZm9yY2VkID0gZmFsc2U7IH0pO1xuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBmb3JjZWQsICdBcnJheScsIHtcbiAgZmluZDogZnVuY3Rpb24gZmluZChjYWxsYmFja2ZuIC8qICwgdGhhdCA9IHVuZGVmaW5lZCAqLykge1xuICAgIHJldHVybiAkZmluZCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoS0VZKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpO1xudmFyIHN0ZXAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBraW5kID0gdGhpcy5faztcbiAgdmFyIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZiAoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpIHtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmIChraW5kID09ICdrZXlzJykgcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xuXG4vLyBXZWJLaXQgQXJyYXkub2YgaXNuJ3QgZ2VuZXJpY1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRigpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gIShBcnJheS5vZi5jYWxsKEYpIGluc3RhbmNlb2YgRik7XG59KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMyBBcnJheS5vZiggLi4uaXRlbXMpXG4gIG9mOiBmdW5jdGlvbiBvZigvKiAuLi5hcmdzICovKSB7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSkoYUxlbik7XG4gICAgd2hpbGUgKGFMZW4gPiBpbmRleCkgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICByZXN1bHQubGVuZ3RoID0gYUxlbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgRlByb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xudmFyIG5hbWVSRSA9IC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopLztcbnZhciBOQU1FID0gJ25hbWUnO1xuXG4vLyAxOS4yLjQuMiBuYW1lXG5OQU1FIGluIEZQcm90byB8fCByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmIGRQKEZQcm90bywgTkFNRSwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKCcnICsgdGhpcykubWF0Y2gobmFtZVJFKVsxXTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIE1BUCA9ICdNYXAnO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKShNQVAsIGZ1bmN0aW9uIChnZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpIHsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHZhbGlkYXRlKHRoaXMsIE1BUCksIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7XG4iLCIvLyAyMC4yLjIuMyBNYXRoLmFjb3NoKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGxvZzFwID0gcmVxdWlyZSgnLi9fbWF0aC1sb2cxcCcpO1xudmFyIHNxcnQgPSBNYXRoLnNxcnQ7XG52YXIgJGFjb3NoID0gTWF0aC5hY29zaDtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKCRhY29zaFxuICAvLyBWOCBidWc6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zNTA5XG4gICYmIE1hdGguZmxvb3IoJGFjb3NoKE51bWJlci5NQVhfVkFMVUUpKSA9PSA3MTBcbiAgLy8gVG9yIEJyb3dzZXIgYnVnOiBNYXRoLmFjb3NoKEluZmluaXR5KSAtPiBOYU5cbiAgJiYgJGFjb3NoKEluZmluaXR5KSA9PSBJbmZpbml0eVxuKSwgJ01hdGgnLCB7XG4gIGFjb3NoOiBmdW5jdGlvbiBhY29zaCh4KSB7XG4gICAgcmV0dXJuICh4ID0gK3gpIDwgMSA/IE5hTiA6IHggPiA5NDkwNjI2NS42MjQyNTE1NlxuICAgICAgPyBNYXRoLmxvZyh4KSArIE1hdGguTE4yXG4gICAgICA6IGxvZzFwKHggLSAxICsgc3FydCh4IC0gMSkgKiBzcXJ0KHggKyAxKSk7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkYXNpbmggPSBNYXRoLmFzaW5oO1xuXG5mdW5jdGlvbiBhc2luaCh4KSB7XG4gIHJldHVybiAhaXNGaW5pdGUoeCA9ICt4KSB8fCB4ID09IDAgPyB4IDogeCA8IDAgPyAtYXNpbmgoLXgpIDogTWF0aC5sb2coeCArIE1hdGguc3FydCh4ICogeCArIDEpKTtcbn1cblxuLy8gVG9yIEJyb3dzZXIgYnVnOiBNYXRoLmFzaW5oKDApIC0+IC0wXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoJGFzaW5oICYmIDEgLyAkYXNpbmgoMCkgPiAwKSwgJ01hdGgnLCB7IGFzaW5oOiBhc2luaCB9KTtcbiIsIi8vIDIwLjIuMi43IE1hdGguYXRhbmgoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGF0YW5oID0gTWF0aC5hdGFuaDtcblxuLy8gVG9yIEJyb3dzZXIgYnVnOiBNYXRoLmF0YW5oKC0wKSAtPiAwXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoJGF0YW5oICYmIDEgLyAkYXRhbmgoLTApIDwgMCksICdNYXRoJywge1xuICBhdGFuaDogZnVuY3Rpb24gYXRhbmgoeCkge1xuICAgIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IE1hdGgubG9nKCgxICsgeCkgLyAoMSAtIHgpKSAvIDI7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMi4yLjkgTWF0aC5jYnJ0KHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHNpZ24gPSByZXF1aXJlKCcuL19tYXRoLXNpZ24nKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBjYnJ0OiBmdW5jdGlvbiBjYnJ0KHgpIHtcbiAgICByZXR1cm4gc2lnbih4ID0gK3gpICogTWF0aC5wb3coTWF0aC5hYnMoeCksIDEgLyAzKTtcbiAgfVxufSk7XG4iLCIvLyAyMC4yLjIuMTEgTWF0aC5jbHozMih4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBjbHozMjogZnVuY3Rpb24gY2x6MzIoeCkge1xuICAgIHJldHVybiAoeCA+Pj49IDApID8gMzEgLSBNYXRoLmZsb29yKE1hdGgubG9nKHggKyAwLjUpICogTWF0aC5MT0cyRSkgOiAzMjtcbiAgfVxufSk7XG4iLCIvLyAyMC4yLjIuMTIgTWF0aC5jb3NoKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGV4cCA9IE1hdGguZXhwO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGNvc2g6IGZ1bmN0aW9uIGNvc2goeCkge1xuICAgIHJldHVybiAoZXhwKHggPSAreCkgKyBleHAoLXgpKSAvIDI7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGV4cG0xID0gcmVxdWlyZSgnLi9fbWF0aC1leHBtMScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICgkZXhwbTEgIT0gTWF0aC5leHBtMSksICdNYXRoJywgeyBleHBtMTogJGV4cG0xIH0pO1xuIiwiLy8gMjAuMi4yLjE2IE1hdGguZnJvdW5kKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7IGZyb3VuZDogcmVxdWlyZSgnLi9fbWF0aC1mcm91bmQnKSB9KTtcbiIsIi8vIDIwLjIuMi4xNyBNYXRoLmh5cG90KFt2YWx1ZTFbLCB2YWx1ZTJbLCDigKYgXV1dKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBhYnMgPSBNYXRoLmFicztcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBoeXBvdDogZnVuY3Rpb24gaHlwb3QodmFsdWUxLCB2YWx1ZTIpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHZhciBzdW0gPSAwO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIGxhcmcgPSAwO1xuICAgIHZhciBhcmcsIGRpdjtcbiAgICB3aGlsZSAoaSA8IGFMZW4pIHtcbiAgICAgIGFyZyA9IGFicyhhcmd1bWVudHNbaSsrXSk7XG4gICAgICBpZiAobGFyZyA8IGFyZykge1xuICAgICAgICBkaXYgPSBsYXJnIC8gYXJnO1xuICAgICAgICBzdW0gPSBzdW0gKiBkaXYgKiBkaXYgKyAxO1xuICAgICAgICBsYXJnID0gYXJnO1xuICAgICAgfSBlbHNlIGlmIChhcmcgPiAwKSB7XG4gICAgICAgIGRpdiA9IGFyZyAvIGxhcmc7XG4gICAgICAgIHN1bSArPSBkaXYgKiBkaXY7XG4gICAgICB9IGVsc2Ugc3VtICs9IGFyZztcbiAgICB9XG4gICAgcmV0dXJuIGxhcmcgPT09IEluZmluaXR5ID8gSW5maW5pdHkgOiBsYXJnICogTWF0aC5zcXJ0KHN1bSk7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMi4yLjE4IE1hdGguaW11bCh4LCB5KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkaW11bCA9IE1hdGguaW11bDtcblxuLy8gc29tZSBXZWJLaXQgdmVyc2lvbnMgZmFpbHMgd2l0aCBiaWcgbnVtYmVycywgc29tZSBoYXMgd3JvbmcgYXJpdHlcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAkaW11bCgweGZmZmZmZmZmLCA1KSAhPSAtNSB8fCAkaW11bC5sZW5ndGggIT0gMjtcbn0pLCAnTWF0aCcsIHtcbiAgaW11bDogZnVuY3Rpb24gaW11bCh4LCB5KSB7XG4gICAgdmFyIFVJTlQxNiA9IDB4ZmZmZjtcbiAgICB2YXIgeG4gPSAreDtcbiAgICB2YXIgeW4gPSAreTtcbiAgICB2YXIgeGwgPSBVSU5UMTYgJiB4bjtcbiAgICB2YXIgeWwgPSBVSU5UMTYgJiB5bjtcbiAgICByZXR1cm4gMCB8IHhsICogeWwgKyAoKFVJTlQxNiAmIHhuID4+PiAxNikgKiB5bCArIHhsICogKFVJTlQxNiAmIHluID4+PiAxNikgPDwgMTYgPj4+IDApO1xuICB9XG59KTtcbiIsIi8vIDIwLjIuMi4yMSBNYXRoLmxvZzEwKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGxvZzEwOiBmdW5jdGlvbiBsb2cxMCh4KSB7XG4gICAgcmV0dXJuIE1hdGgubG9nKHgpICogTWF0aC5MT0cxMEU7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMi4yLjIwIE1hdGgubG9nMXAoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHsgbG9nMXA6IHJlcXVpcmUoJy4vX21hdGgtbG9nMXAnKSB9KTtcbiIsIi8vIDIwLjIuMi4yMiBNYXRoLmxvZzIoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgbG9nMjogZnVuY3Rpb24gbG9nMih4KSB7XG4gICAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5MTjI7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywgeyBzaWduOiByZXF1aXJlKCcuL19tYXRoLXNpZ24nKSB9KTtcbiIsIi8vIDIwLjIuMi4zMCBNYXRoLnNpbmgoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgZXhwbTEgPSByZXF1aXJlKCcuL19tYXRoLWV4cG0xJyk7XG52YXIgZXhwID0gTWF0aC5leHA7XG5cbi8vIFY4IG5lYXIgQ2hyb21pdW0gMzggaGFzIGEgcHJvYmxlbSB3aXRoIHZlcnkgc21hbGwgbnVtYmVyc1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICFNYXRoLnNpbmgoLTJlLTE3KSAhPSAtMmUtMTc7XG59KSwgJ01hdGgnLCB7XG4gIHNpbmg6IGZ1bmN0aW9uIHNpbmgoeCkge1xuICAgIHJldHVybiBNYXRoLmFicyh4ID0gK3gpIDwgMVxuICAgICAgPyAoZXhwbTEoeCkgLSBleHBtMSgteCkpIC8gMlxuICAgICAgOiAoZXhwKHggLSAxKSAtIGV4cCgteCAtIDEpKSAqIChNYXRoLkUgLyAyKTtcbiAgfVxufSk7XG4iLCIvLyAyMC4yLjIuMzMgTWF0aC50YW5oKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGV4cG0xID0gcmVxdWlyZSgnLi9fbWF0aC1leHBtMScpO1xudmFyIGV4cCA9IE1hdGguZXhwO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIHRhbmg6IGZ1bmN0aW9uIHRhbmgoeCkge1xuICAgIHZhciBhID0gZXhwbTEoeCA9ICt4KTtcbiAgICB2YXIgYiA9IGV4cG0xKC14KTtcbiAgICByZXR1cm4gYSA9PSBJbmZpbml0eSA/IDEgOiBiID09IEluZmluaXR5ID8gLTEgOiAoYSAtIGIpIC8gKGV4cCh4KSArIGV4cCgteCkpO1xuICB9XG59KTtcbiIsIi8vIDIwLjIuMi4zNCBNYXRoLnRydW5jKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIHRydW5jOiBmdW5jdGlvbiB0cnVuYyhpdCkge1xuICAgIHJldHVybiAoaXQgPiAwID8gTWF0aC5mbG9vciA6IE1hdGguY2VpbCkoaXQpO1xuICB9XG59KTtcbiIsIi8vIDIwLjEuMi4xIE51bWJlci5FUFNJTE9OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHsgRVBTSUxPTjogTWF0aC5wb3coMiwgLTUyKSB9KTtcbiIsIi8vIDIwLjEuMi4yIE51bWJlci5pc0Zpbml0ZShudW1iZXIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIF9pc0Zpbml0ZSA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmlzRmluaXRlO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtcbiAgaXNGaW5pdGU6IGZ1bmN0aW9uIGlzRmluaXRlKGl0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnbnVtYmVyJyAmJiBfaXNGaW5pdGUoaXQpO1xuICB9XG59KTtcbiIsIi8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7IGlzSW50ZWdlcjogcmVxdWlyZSgnLi9faXMtaW50ZWdlcicpIH0pO1xuIiwiLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge1xuICBpc05hTjogZnVuY3Rpb24gaXNOYU4obnVtYmVyKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIHJldHVybiBudW1iZXIgIT0gbnVtYmVyO1xuICB9XG59KTtcbiIsIi8vIDIwLjEuMi41IE51bWJlci5pc1NhZmVJbnRlZ2VyKG51bWJlcilcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgaXNJbnRlZ2VyID0gcmVxdWlyZSgnLi9faXMtaW50ZWdlcicpO1xudmFyIGFicyA9IE1hdGguYWJzO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtcbiAgaXNTYWZlSW50ZWdlcjogZnVuY3Rpb24gaXNTYWZlSW50ZWdlcihudW1iZXIpIHtcbiAgICByZXR1cm4gaXNJbnRlZ2VyKG51bWJlcikgJiYgYWJzKG51bWJlcikgPD0gMHgxZmZmZmZmZmZmZmZmZjtcbiAgfVxufSk7XG4iLCIvLyAyMC4xLjIuNiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7IE1BWF9TQUZFX0lOVEVHRVI6IDB4MWZmZmZmZmZmZmZmZmYgfSk7XG4iLCIvLyAyMC4xLjIuMTAgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywgeyBNSU5fU0FGRV9JTlRFR0VSOiAtMHgxZmZmZmZmZmZmZmZmZiB9KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIvLyAxOS4xLjIuNSBPYmplY3QuZnJlZXplKE8pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpLm9uRnJlZXplO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2ZyZWV6ZScsIGZ1bmN0aW9uICgkZnJlZXplKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmcmVlemUoaXQpIHtcbiAgICByZXR1cm4gJGZyZWV6ZSAmJiBpc09iamVjdChpdCkgPyAkZnJlZXplKG1ldGEoaXQpKSA6IGl0O1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmY7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpIHtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0b0lPYmplY3QoaXQpLCBrZXkpO1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdnZXRPd25Qcm9wZXJ0eU5hbWVzJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4tZXh0JykuZjtcbn0pO1xuIiwiLy8gMTkuMS4yLjkgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciAkZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnZ2V0UHJvdG90eXBlT2YnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihpdCkge1xuICAgIHJldHVybiAkZ2V0UHJvdG90eXBlT2YodG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pO1xuIiwiLy8gMTkuMS4yLjExIE9iamVjdC5pc0V4dGVuc2libGUoTylcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2lzRXh0ZW5zaWJsZScsIGZ1bmN0aW9uICgkaXNFeHRlbnNpYmxlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBpc0V4dGVuc2libGUoaXQpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gJGlzRXh0ZW5zaWJsZSA/ICRpc0V4dGVuc2libGUoaXQpIDogdHJ1ZSA6IGZhbHNlO1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjIuMTIgT2JqZWN0LmlzRnJvemVuKE8pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdpc0Zyb3plbicsIGZ1bmN0aW9uICgkaXNGcm96ZW4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlzRnJvemVuKGl0KSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/ICRpc0Zyb3plbiA/ICRpc0Zyb3plbihpdCkgOiBmYWxzZSA6IHRydWU7XG4gIH07XG59KTtcbiIsIi8vIDE5LjEuMi4xMyBPYmplY3QuaXNTZWFsZWQoTylcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2lzU2VhbGVkJywgZnVuY3Rpb24gKCRpc1NlYWxlZCkge1xuICByZXR1cm4gZnVuY3Rpb24gaXNTZWFsZWQoaXQpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gJGlzU2VhbGVkID8gJGlzU2VhbGVkKGl0KSA6IGZhbHNlIDogdHJ1ZTtcbiAgfTtcbn0pO1xuIiwiLy8gMTkuMS4zLjEwIE9iamVjdC5pcyh2YWx1ZTEsIHZhbHVlMilcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHsgaXM6IHJlcXVpcmUoJy4vX3NhbWUtdmFsdWUnKSB9KTtcbiIsIi8vIDE5LjEuMi4xNCBPYmplY3Qua2V5cyhPKVxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2tleXMnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBrZXlzKGl0KSB7XG4gICAgcmV0dXJuICRrZXlzKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTtcbiIsIi8vIDE5LjEuMi4xNSBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoTylcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIG1ldGEgPSByZXF1aXJlKCcuL19tZXRhJykub25GcmVlemU7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgncHJldmVudEV4dGVuc2lvbnMnLCBmdW5jdGlvbiAoJHByZXZlbnRFeHRlbnNpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwcmV2ZW50RXh0ZW5zaW9ucyhpdCkge1xuICAgIHJldHVybiAkcHJldmVudEV4dGVuc2lvbnMgJiYgaXNPYmplY3QoaXQpID8gJHByZXZlbnRFeHRlbnNpb25zKG1ldGEoaXQpKSA6IGl0O1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjIuMTcgT2JqZWN0LnNlYWwoTylcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIG1ldGEgPSByZXF1aXJlKCcuL19tZXRhJykub25GcmVlemU7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnc2VhbCcsIGZ1bmN0aW9uICgkc2VhbCkge1xuICByZXR1cm4gZnVuY3Rpb24gc2VhbChpdCkge1xuICAgIHJldHVybiAkc2VhbCAmJiBpc09iamVjdChpdCkgPyAkc2VhbChtZXRhKGl0KSkgOiBpdDtcbiAgfTtcbn0pO1xuIiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHsgc2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldCB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xudmFyIHRhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0O1xudmFyIG1pY3JvdGFzayA9IHJlcXVpcmUoJy4vX21pY3JvdGFzaycpKCk7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUgPSByZXF1aXJlKCcuL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5Jyk7XG52YXIgcGVyZm9ybSA9IHJlcXVpcmUoJy4vX3BlcmZvcm0nKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xudmFyIFBST01JU0UgPSAnUHJvbWlzZSc7XG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgJFByb21pc2UgPSBnbG9iYWxbUFJPTUlTRV07XG52YXIgaXNOb2RlID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG52YXIgZW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgSW50ZXJuYWwsIG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSwgT3duUHJvbWlzZUNhcGFiaWxpdHksIFdyYXBwZXI7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZS5mO1xuXG52YXIgVVNFX05BVElWRSA9ICEhZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIC8vIGNvcnJlY3Qgc3ViY2xhc3Npbmcgd2l0aCBAQHNwZWNpZXMgc3VwcG9ydFxuICAgIHZhciBwcm9taXNlID0gJFByb21pc2UucmVzb2x2ZSgxKTtcbiAgICB2YXIgRmFrZVByb21pc2UgPSAocHJvbWlzZS5jb25zdHJ1Y3RvciA9IHt9KVtyZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpXSA9IGZ1bmN0aW9uIChleGVjKSB7XG4gICAgICBleGVjKGVtcHR5LCBlbXB0eSk7XG4gICAgfTtcbiAgICAvLyB1bmhhbmRsZWQgcmVqZWN0aW9ucyB0cmFja2luZyBzdXBwb3J0LCBOb2RlSlMgUHJvbWlzZSB3aXRob3V0IGl0IGZhaWxzIEBAc3BlY2llcyB0ZXN0XG4gICAgcmV0dXJuIChpc05vZGUgfHwgdHlwZW9mIFByb21pc2VSZWplY3Rpb25FdmVudCA9PSAnZnVuY3Rpb24nKSAmJiBwcm9taXNlLnRoZW4oZW1wdHkpIGluc3RhbmNlb2YgRmFrZVByb21pc2U7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufSgpO1xuXG4vLyBoZWxwZXJzXG52YXIgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBub3RpZnkgPSBmdW5jdGlvbiAocHJvbWlzZSwgaXNSZWplY3QpIHtcbiAgaWYgKHByb21pc2UuX24pIHJldHVybjtcbiAgcHJvbWlzZS5fbiA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2M7XG4gIG1pY3JvdGFzayhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdjtcbiAgICB2YXIgb2sgPSBwcm9taXNlLl9zID09IDE7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWw7XG4gICAgICB2YXIgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmU7XG4gICAgICB2YXIgcmVqZWN0ID0gcmVhY3Rpb24ucmVqZWN0O1xuICAgICAgdmFyIGRvbWFpbiA9IHJlYWN0aW9uLmRvbWFpbjtcbiAgICAgIHZhciByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIGlmIChwcm9taXNlLl9oID09IDIpIG9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChoYW5kbGVyID09PSB0cnVlKSByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkb21haW4pIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7XG4gICAgICAgICAgICBpZiAoZG9tYWluKSBkb21haW4uZXhpdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKSB7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSkge1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUgKGNoYWluLmxlbmd0aCA+IGkpIHJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBwcm9taXNlLl9jID0gW107XG4gICAgcHJvbWlzZS5fbiA9IGZhbHNlO1xuICAgIGlmIChpc1JlamVjdCAmJiAhcHJvbWlzZS5faCkgb25VbmhhbmRsZWQocHJvbWlzZSk7XG4gIH0pO1xufTtcbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92O1xuICAgIHZhciB1bmhhbmRsZWQgPSBpc1VuaGFuZGxlZChwcm9taXNlKTtcbiAgICB2YXIgcmVzdWx0LCBoYW5kbGVyLCBjb25zb2xlO1xuICAgIGlmICh1bmhhbmRsZWQpIHtcbiAgICAgIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbikge1xuICAgICAgICAgIGhhbmRsZXIoeyBwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIG5vdCB0cmlnZ2VyIGByZWplY3Rpb25IYW5kbGVkYCBldmVudCBpZiBpdCB3YXMgaGFuZGxlZCBoZXJlLCBOb2RlSlMgLSBzaG91bGRcbiAgICAgIHByb21pc2UuX2ggPSBpc05vZGUgfHwgaXNVbmhhbmRsZWQocHJvbWlzZSkgPyAyIDogMTtcbiAgICB9IHByb21pc2UuX2EgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHVuaGFuZGxlZCAmJiByZXN1bHQuZSkgdGhyb3cgcmVzdWx0LnY7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHJldHVybiBwcm9taXNlLl9oICE9PSAxICYmIChwcm9taXNlLl9hIHx8IHByb21pc2UuX2MpLmxlbmd0aCA9PT0gMDtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYgKGlzTm9kZSkge1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCkge1xuICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdiB9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICBwcm9taXNlLl92ID0gdmFsdWU7XG4gIHByb21pc2UuX3MgPSAyO1xuICBpZiAoIXByb21pc2UuX2EpIHByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICB2YXIgdGhlbjtcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkgdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAkcmVqZWN0LmNhbGwoeyBfdzogcHJvbWlzZSwgX2Q6IGZhbHNlIH0sIGUpOyAvLyB3cmFwXG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZiAoIVVTRV9OQVRJVkUpIHtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkUHJvbWlzZSwgUFJPTUlTRSwgJ19oJyk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHRoaXMsIDEpLCBjdHgoJHJlamVjdCwgdGhpcywgMSkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgSW50ZXJuYWwgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYgKHRoaXMuX2EpIHRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fcykgbm90aWZ5KHRoaXMsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbiAob25SZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIE93blByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9taXNlID0gbmV3IEludGVybmFsKCk7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xuICBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZS5mID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoQykge1xuICAgIHJldHVybiBDID09PSAkUHJvbWlzZSB8fCBDID09PSBXcmFwcGVyXG4gICAgICA/IG5ldyBPd25Qcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgOiBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgUHJvbWlzZTogJFByb21pc2UgfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpIHtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpO1xuICAgIHZhciAkJHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCkge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShMSUJSQVJZICYmIHRoaXMgPT09IFdyYXBwZXIgPyAkUHJvbWlzZSA6IHRoaXMsIHgpO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVzb2x2ZSA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciByZW1haW5pbmcgPSAxO1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICB2YXIgJGluZGV4ID0gaW5kZXgrKztcbiAgICAgICAgdmFyIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIGlmIChhbHJlYWR5Q2FsbGVkKSByZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgdmFsdWVzWyRpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKSB7XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gICAgdmFyIHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lKSByZWplY3QocmVzdWx0LnYpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS4xIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHJBcHBseSA9IChyZXF1aXJlKCcuL19nbG9iYWwnKS5SZWZsZWN0IHx8IHt9KS5hcHBseTtcbnZhciBmQXBwbHkgPSBGdW5jdGlvbi5hcHBseTtcbi8vIE1TIEVkZ2UgYXJndW1lbnRzTGlzdCBhcmd1bWVudCBpcyBvcHRpb25hbFxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJBcHBseShmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0pO1xufSksICdSZWZsZWN0Jywge1xuICBhcHBseTogZnVuY3Rpb24gYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpIHtcbiAgICB2YXIgVCA9IGFGdW5jdGlvbih0YXJnZXQpO1xuICAgIHZhciBMID0gYW5PYmplY3QoYXJndW1lbnRzTGlzdCk7XG4gICAgcmV0dXJuIHJBcHBseSA/IHJBcHBseShULCB0aGlzQXJndW1lbnQsIEwpIDogZkFwcGx5LmNhbGwoVCwgdGhpc0FyZ3VtZW50LCBMKTtcbiAgfVxufSk7XG4iLCIvLyAyNi4xLjIgUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IFssIG5ld1RhcmdldF0pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi9fYmluZCcpO1xudmFyIHJDb25zdHJ1Y3QgPSAocmVxdWlyZSgnLi9fZ2xvYmFsJykuUmVmbGVjdCB8fCB7fSkuY29uc3RydWN0O1xuXG4vLyBNUyBFZGdlIHN1cHBvcnRzIG9ubHkgMiBhcmd1bWVudHMgYW5kIGFyZ3VtZW50c0xpc3QgYXJndW1lbnQgaXMgb3B0aW9uYWxcbi8vIEZGIE5pZ2h0bHkgc2V0cyB0aGlyZCBhcmd1bWVudCBhcyBgbmV3LnRhcmdldGAsIGJ1dCBkb2VzIG5vdCBjcmVhdGUgYHRoaXNgIGZyb20gaXRcbnZhciBORVdfVEFSR0VUX0JVRyA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRigpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gIShyQ29uc3RydWN0KGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfSwgW10sIEYpIGluc3RhbmNlb2YgRik7XG59KTtcbnZhciBBUkdTX0JVRyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJDb25zdHJ1Y3QoZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9KTtcbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChORVdfVEFSR0VUX0JVRyB8fCBBUkdTX0JVRyksICdSZWZsZWN0Jywge1xuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIGNvbnN0cnVjdChUYXJnZXQsIGFyZ3MgLyogLCBuZXdUYXJnZXQgKi8pIHtcbiAgICBhRnVuY3Rpb24oVGFyZ2V0KTtcbiAgICBhbk9iamVjdChhcmdzKTtcbiAgICB2YXIgbmV3VGFyZ2V0ID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyBUYXJnZXQgOiBhRnVuY3Rpb24oYXJndW1lbnRzWzJdKTtcbiAgICBpZiAoQVJHU19CVUcgJiYgIU5FV19UQVJHRVRfQlVHKSByZXR1cm4gckNvbnN0cnVjdChUYXJnZXQsIGFyZ3MsIG5ld1RhcmdldCk7XG4gICAgaWYgKFRhcmdldCA9PSBuZXdUYXJnZXQpIHtcbiAgICAgIC8vIHcvbyBhbHRlcmVkIG5ld1RhcmdldCwgb3B0aW1pemF0aW9uIGZvciAwLTQgYXJndW1lbnRzXG4gICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBUYXJnZXQoKTtcbiAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdKTtcbiAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgY2FzZSAzOiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgY2FzZSA0OiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgICAgIH1cbiAgICAgIC8vIHcvbyBhbHRlcmVkIG5ld1RhcmdldCwgbG90IG9mIGFyZ3VtZW50cyBjYXNlXG4gICAgICB2YXIgJGFyZ3MgPSBbbnVsbF07XG4gICAgICAkYXJncy5wdXNoLmFwcGx5KCRhcmdzLCBhcmdzKTtcbiAgICAgIHJldHVybiBuZXcgKGJpbmQuYXBwbHkoVGFyZ2V0LCAkYXJncykpKCk7XG4gICAgfVxuICAgIC8vIHdpdGggYWx0ZXJlZCBuZXdUYXJnZXQsIG5vdCBzdXBwb3J0IGJ1aWx0LWluIGNvbnN0cnVjdG9yc1xuICAgIHZhciBwcm90byA9IG5ld1RhcmdldC5wcm90b3R5cGU7XG4gICAgdmFyIGluc3RhbmNlID0gY3JlYXRlKGlzT2JqZWN0KHByb3RvKSA/IHByb3RvIDogT2JqZWN0LnByb3RvdHlwZSk7XG4gICAgdmFyIHJlc3VsdCA9IEZ1bmN0aW9uLmFwcGx5LmNhbGwoVGFyZ2V0LCBpbnN0YW5jZSwgYXJncyk7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiBpbnN0YW5jZTtcbiAgfVxufSk7XG4iLCIvLyAyNi4xLjMgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKVxudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcblxuLy8gTVMgRWRnZSBoYXMgYnJva2VuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkgLSB0aHJvd2luZyBpbnN0ZWFkIG9mIHJldHVybmluZyBmYWxzZVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoZFAuZih7fSwgMSwgeyB2YWx1ZTogMSB9KSwgMSwgeyB2YWx1ZTogMiB9KTtcbn0pLCAnUmVmbGVjdCcsIHtcbiAgZGVmaW5lUHJvcGVydHk6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpIHtcbiAgICBhbk9iamVjdCh0YXJnZXQpO1xuICAgIHByb3BlcnR5S2V5ID0gdG9QcmltaXRpdmUocHJvcGVydHlLZXksIHRydWUpO1xuICAgIGFuT2JqZWN0KGF0dHJpYnV0ZXMpO1xuICAgIHRyeSB7XG4gICAgICBkUC5mKHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufSk7XG4iLCIvLyAyNi4xLjQgUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBnT1BEID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICB2YXIgZGVzYyA9IGdPUEQoYW5PYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xuICAgIHJldHVybiBkZXNjICYmICFkZXNjLmNvbmZpZ3VyYWJsZSA/IGZhbHNlIDogZGVsZXRlIHRhcmdldFtwcm9wZXJ0eUtleV07XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS43IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpXG52YXIgZ09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgIHJldHVybiBnT1BELmYoYW5PYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xuICB9XG59KTtcbiIsIi8vIDI2LjEuOCBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgZ2V0UHJvdG8gPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBnZXRQcm90b3R5cGVPZjogZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSB7XG4gICAgcmV0dXJuIGdldFByb3RvKGFuT2JqZWN0KHRhcmdldCkpO1xuICB9XG59KTtcbiIsIi8vIDI2LjEuNiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5S2V5IFssIHJlY2VpdmVyXSlcbnZhciBnT1BEID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xuXG5mdW5jdGlvbiBnZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSAvKiAsIHJlY2VpdmVyICovKSB7XG4gIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdO1xuICB2YXIgZGVzYywgcHJvdG87XG4gIGlmIChhbk9iamVjdCh0YXJnZXQpID09PSByZWNlaXZlcikgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eUtleV07XG4gIGlmIChkZXNjID0gZ09QRC5mKHRhcmdldCwgcHJvcGVydHlLZXkpKSByZXR1cm4gaGFzKGRlc2MsICd2YWx1ZScpXG4gICAgPyBkZXNjLnZhbHVlXG4gICAgOiBkZXNjLmdldCAhPT0gdW5kZWZpbmVkXG4gICAgICA/IGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgaWYgKGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSkpIHJldHVybiBnZXQocHJvdG8sIHByb3BlcnR5S2V5LCByZWNlaXZlcik7XG59XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHsgZ2V0OiBnZXQgfSk7XG4iLCIvLyAyNi4xLjkgUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wZXJ0eUtleSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgaGFzOiBmdW5jdGlvbiBoYXModGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgIHJldHVybiBwcm9wZXJ0eUtleSBpbiB0YXJnZXQ7XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS4xMCBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgJGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGU7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbiBpc0V4dGVuc2libGUodGFyZ2V0KSB7XG4gICAgYW5PYmplY3QodGFyZ2V0KTtcbiAgICByZXR1cm4gJGlzRXh0ZW5zaWJsZSA/ICRpc0V4dGVuc2libGUodGFyZ2V0KSA6IHRydWU7XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS4xMSBSZWZsZWN0Lm93bktleXModGFyZ2V0KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0JywgeyBvd25LZXlzOiByZXF1aXJlKCcuL19vd24ta2V5cycpIH0pO1xuIiwiLy8gMjYuMS4xMiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciAkcHJldmVudEV4dGVuc2lvbnMgPSBPYmplY3QucHJldmVudEV4dGVuc2lvbnM7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgcHJldmVudEV4dGVuc2lvbnM6IGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCkge1xuICAgIGFuT2JqZWN0KHRhcmdldCk7XG4gICAgdHJ5IHtcbiAgICAgIGlmICgkcHJldmVudEV4dGVuc2lvbnMpICRwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufSk7XG4iLCIvLyAyNi4xLjE0IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgc2V0UHJvdG8gPSByZXF1aXJlKCcuL19zZXQtcHJvdG8nKTtcblxuaWYgKHNldFByb3RvKSAkZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIHNldFByb3RvdHlwZU9mOiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKSB7XG4gICAgc2V0UHJvdG8uY2hlY2sodGFyZ2V0LCBwcm90byk7XG4gICAgdHJ5IHtcbiAgICAgIHNldFByb3RvLnNldCh0YXJnZXQsIHByb3RvKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS4xMyBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWIFssIHJlY2VpdmVyXSlcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGdPUEQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcblxuZnVuY3Rpb24gc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYgLyogLCByZWNlaXZlciAqLykge1xuICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgNCA/IHRhcmdldCA6IGFyZ3VtZW50c1szXTtcbiAgdmFyIG93bkRlc2MgPSBnT1BELmYoYW5PYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xuICB2YXIgZXhpc3RpbmdEZXNjcmlwdG9yLCBwcm90bztcbiAgaWYgKCFvd25EZXNjKSB7XG4gICAgaWYgKGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSkpIHtcbiAgICAgIHJldHVybiBzZXQocHJvdG8sIHByb3BlcnR5S2V5LCBWLCByZWNlaXZlcik7XG4gICAgfVxuICAgIG93bkRlc2MgPSBjcmVhdGVEZXNjKDApO1xuICB9XG4gIGlmIChoYXMob3duRGVzYywgJ3ZhbHVlJykpIHtcbiAgICBpZiAob3duRGVzYy53cml0YWJsZSA9PT0gZmFsc2UgfHwgIWlzT2JqZWN0KHJlY2VpdmVyKSkgcmV0dXJuIGZhbHNlO1xuICAgIGV4aXN0aW5nRGVzY3JpcHRvciA9IGdPUEQuZihyZWNlaXZlciwgcHJvcGVydHlLZXkpIHx8IGNyZWF0ZURlc2MoMCk7XG4gICAgZXhpc3RpbmdEZXNjcmlwdG9yLnZhbHVlID0gVjtcbiAgICBkUC5mKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSwgZXhpc3RpbmdEZXNjcmlwdG9yKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gb3duRGVzYy5zZXQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogKG93bkRlc2Muc2V0LmNhbGwocmVjZWl2ZXIsIFYpLCB0cnVlKTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0JywgeyBzZXQ6IHNldCB9KTtcbiIsIi8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzKClcbmlmIChyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmIC8uL2cuZmxhZ3MgIT0gJ2cnKSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mKFJlZ0V4cC5wcm90b3R5cGUsICdmbGFncycsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IHJlcXVpcmUoJy4vX2ZsYWdzJylcbn0pO1xuIiwiLy8gQEBtYXRjaCBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdtYXRjaCcsIDEsIGZ1bmN0aW9uIChkZWZpbmVkLCBNQVRDSCwgJG1hdGNoKSB7XG4gIC8vIDIxLjEuMy4xMSBTdHJpbmcucHJvdG90eXBlLm1hdGNoKHJlZ2V4cClcbiAgcmV0dXJuIFtmdW5jdGlvbiBtYXRjaChyZWdleHApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIE8gPSBkZWZpbmVkKHRoaXMpO1xuICAgIHZhciBmbiA9IHJlZ2V4cCA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiByZWdleHBbTUFUQ0hdO1xuICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkID8gZm4uY2FsbChyZWdleHAsIE8pIDogbmV3IFJlZ0V4cChyZWdleHApW01BVENIXShTdHJpbmcoTykpO1xuICB9LCAkbWF0Y2hdO1xufSk7XG4iLCIvLyBAQHJlcGxhY2UgbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgncmVwbGFjZScsIDIsIGZ1bmN0aW9uIChkZWZpbmVkLCBSRVBMQUNFLCAkcmVwbGFjZSkge1xuICAvLyAyMS4xLjMuMTQgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlKHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpXG4gIHJldHVybiBbZnVuY3Rpb24gcmVwbGFjZShzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPID0gZGVmaW5lZCh0aGlzKTtcbiAgICB2YXIgZm4gPSBzZWFyY2hWYWx1ZSA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZWFyY2hWYWx1ZVtSRVBMQUNFXTtcbiAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZFxuICAgICAgPyBmbi5jYWxsKHNlYXJjaFZhbHVlLCBPLCByZXBsYWNlVmFsdWUpXG4gICAgICA6ICRyZXBsYWNlLmNhbGwoU3RyaW5nKE8pLCBzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKTtcbiAgfSwgJHJlcGxhY2VdO1xufSk7XG4iLCIvLyBAQHNlYXJjaCBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdzZWFyY2gnLCAxLCBmdW5jdGlvbiAoZGVmaW5lZCwgU0VBUkNILCAkc2VhcmNoKSB7XG4gIC8vIDIxLjEuMy4xNSBTdHJpbmcucHJvdG90eXBlLnNlYXJjaChyZWdleHApXG4gIHJldHVybiBbZnVuY3Rpb24gc2VhcmNoKHJlZ2V4cCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyA9IGRlZmluZWQodGhpcyk7XG4gICAgdmFyIGZuID0gcmVnZXhwID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlZ2V4cFtTRUFSQ0hdO1xuICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkID8gZm4uY2FsbChyZWdleHAsIE8pIDogbmV3IFJlZ0V4cChyZWdleHApW1NFQVJDSF0oU3RyaW5nKE8pKTtcbiAgfSwgJHNlYXJjaF07XG59KTtcbiIsIi8vIEBAc3BsaXQgbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgnc3BsaXQnLCAyLCBmdW5jdGlvbiAoZGVmaW5lZCwgU1BMSVQsICRzcGxpdCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciBpc1JlZ0V4cCA9IHJlcXVpcmUoJy4vX2lzLXJlZ2V4cCcpO1xuICB2YXIgX3NwbGl0ID0gJHNwbGl0O1xuICB2YXIgJHB1c2ggPSBbXS5wdXNoO1xuICB2YXIgJFNQTElUID0gJ3NwbGl0JztcbiAgdmFyIExFTkdUSCA9ICdsZW5ndGgnO1xuICB2YXIgTEFTVF9JTkRFWCA9ICdsYXN0SW5kZXgnO1xuICBpZiAoXG4gICAgJ2FiYmMnWyRTUExJVF0oLyhiKSovKVsxXSA9PSAnYycgfHxcbiAgICAndGVzdCdbJFNQTElUXSgvKD86KS8sIC0xKVtMRU5HVEhdICE9IDQgfHxcbiAgICAnYWInWyRTUExJVF0oLyg/OmFiKSovKVtMRU5HVEhdICE9IDIgfHxcbiAgICAnLidbJFNQTElUXSgvKC4/KSguPykvKVtMRU5HVEhdICE9IDQgfHxcbiAgICAnLidbJFNQTElUXSgvKCkoKS8pW0xFTkdUSF0gPiAxIHx8XG4gICAgJydbJFNQTElUXSgvLj8vKVtMRU5HVEhdXG4gICkge1xuICAgIHZhciBOUENHID0gLygpPz8vLmV4ZWMoJycpWzFdID09PSB1bmRlZmluZWQ7IC8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwXG4gICAgLy8gYmFzZWQgb24gZXM1LXNoaW0gaW1wbGVtZW50YXRpb24sIG5lZWQgdG8gcmV3b3JrIGl0XG4gICAgJHNwbGl0ID0gZnVuY3Rpb24gKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgICBpZiAoc2VwYXJhdG9yID09PSB1bmRlZmluZWQgJiYgbGltaXQgPT09IDApIHJldHVybiBbXTtcbiAgICAgIC8vIElmIGBzZXBhcmF0b3JgIGlzIG5vdCBhIHJlZ2V4LCB1c2UgbmF0aXZlIHNwbGl0XG4gICAgICBpZiAoIWlzUmVnRXhwKHNlcGFyYXRvcikpIHJldHVybiBfc3BsaXQuY2FsbChzdHJpbmcsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgdmFyIGZsYWdzID0gKHNlcGFyYXRvci5pZ25vcmVDYXNlID8gJ2knIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IubXVsdGlsaW5lID8gJ20nIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IudW5pY29kZSA/ICd1JyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLnN0aWNreSA/ICd5JyA6ICcnKTtcbiAgICAgIHZhciBsYXN0TGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBzcGxpdExpbWl0ID0gbGltaXQgPT09IHVuZGVmaW5lZCA/IDQyOTQ5NjcyOTUgOiBsaW1pdCA+Pj4gMDtcbiAgICAgIC8vIE1ha2UgYGdsb2JhbGAgYW5kIGF2b2lkIGBsYXN0SW5kZXhgIGlzc3VlcyBieSB3b3JraW5nIHdpdGggYSBjb3B5XG4gICAgICB2YXIgc2VwYXJhdG9yQ29weSA9IG5ldyBSZWdFeHAoc2VwYXJhdG9yLnNvdXJjZSwgZmxhZ3MgKyAnZycpO1xuICAgICAgdmFyIHNlcGFyYXRvcjIsIG1hdGNoLCBsYXN0SW5kZXgsIGxhc3RMZW5ndGgsIGk7XG4gICAgICAvLyBEb2Vzbid0IG5lZWQgZmxhZ3MgZ3ksIGJ1dCB0aGV5IGRvbid0IGh1cnRcbiAgICAgIGlmICghTlBDRykgc2VwYXJhdG9yMiA9IG5ldyBSZWdFeHAoJ14nICsgc2VwYXJhdG9yQ29weS5zb3VyY2UgKyAnJCg/IVxcXFxzKScsIGZsYWdzKTtcbiAgICAgIHdoaWxlIChtYXRjaCA9IHNlcGFyYXRvckNvcHkuZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgIC8vIGBzZXBhcmF0b3JDb3B5Lmxhc3RJbmRleGAgaXMgbm90IHJlbGlhYmxlIGNyb3NzLWJyb3dzZXJcbiAgICAgICAgbGFzdEluZGV4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXVtMRU5HVEhdO1xuICAgICAgICBpZiAobGFzdEluZGV4ID4gbGFzdExhc3RJbmRleCkge1xuICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgIGZvciBOUENHXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3AtZnVuY1xuICAgICAgICAgIGlmICghTlBDRyAmJiBtYXRjaFtMRU5HVEhdID4gMSkgbWF0Y2hbMF0ucmVwbGFjZShzZXBhcmF0b3IyLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgYXJndW1lbnRzW0xFTkdUSF0gLSAyOyBpKyspIGlmIChhcmd1bWVudHNbaV0gPT09IHVuZGVmaW5lZCkgbWF0Y2hbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKG1hdGNoW0xFTkdUSF0gPiAxICYmIG1hdGNoLmluZGV4IDwgc3RyaW5nW0xFTkdUSF0pICRwdXNoLmFwcGx5KG91dHB1dCwgbWF0Y2guc2xpY2UoMSkpO1xuICAgICAgICAgIGxhc3RMZW5ndGggPSBtYXRjaFswXVtMRU5HVEhdO1xuICAgICAgICAgIGxhc3RMYXN0SW5kZXggPSBsYXN0SW5kZXg7XG4gICAgICAgICAgaWYgKG91dHB1dFtMRU5HVEhdID49IHNwbGl0TGltaXQpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXBhcmF0b3JDb3B5W0xBU1RfSU5ERVhdID09PSBtYXRjaC5pbmRleCkgc2VwYXJhdG9yQ29weVtMQVNUX0lOREVYXSsrOyAvLyBBdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICB9XG4gICAgICBpZiAobGFzdExhc3RJbmRleCA9PT0gc3RyaW5nW0xFTkdUSF0pIHtcbiAgICAgICAgaWYgKGxhc3RMZW5ndGggfHwgIXNlcGFyYXRvckNvcHkudGVzdCgnJykpIG91dHB1dC5wdXNoKCcnKTtcbiAgICAgIH0gZWxzZSBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCkpO1xuICAgICAgcmV0dXJuIG91dHB1dFtMRU5HVEhdID4gc3BsaXRMaW1pdCA/IG91dHB1dC5zbGljZSgwLCBzcGxpdExpbWl0KSA6IG91dHB1dDtcbiAgICB9O1xuICAvLyBDaGFrcmEsIFY4XG4gIH0gZWxzZSBpZiAoJzAnWyRTUExJVF0odW5kZWZpbmVkLCAwKVtMRU5HVEhdKSB7XG4gICAgJHNwbGl0ID0gZnVuY3Rpb24gKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgIHJldHVybiBzZXBhcmF0b3IgPT09IHVuZGVmaW5lZCAmJiBsaW1pdCA9PT0gMCA/IFtdIDogX3NwbGl0LmNhbGwodGhpcywgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgfTtcbiAgfVxuICAvLyAyMS4xLjMuMTcgU3RyaW5nLnByb3RvdHlwZS5zcGxpdChzZXBhcmF0b3IsIGxpbWl0KVxuICByZXR1cm4gW2Z1bmN0aW9uIHNwbGl0KHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICB2YXIgTyA9IGRlZmluZWQodGhpcyk7XG4gICAgdmFyIGZuID0gc2VwYXJhdG9yID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNlcGFyYXRvcltTUExJVF07XG4gICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWQgPyBmbi5jYWxsKHNlcGFyYXRvciwgTywgbGltaXQpIDogJHNwbGl0LmNhbGwoU3RyaW5nKE8pLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgfSwgJHNwbGl0XTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0VUID0gJ1NldCc7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKFNFVCwgZnVuY3Rpb24gKGdldCkge1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCkgeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgU0VUKSwgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKShmYWxzZSk7XG4kZXhwb3J0KCRleHBvcnQuUCwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjMgU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdChwb3MpXG4gIGNvZGVQb2ludEF0OiBmdW5jdGlvbiBjb2RlUG9pbnRBdChwb3MpIHtcbiAgICByZXR1cm4gJGF0KHRoaXMsIHBvcyk7XG4gIH1cbn0pO1xuIiwiLy8gMjEuMS4zLjYgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aChzZWFyY2hTdHJpbmcgWywgZW5kUG9zaXRpb25dKVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNvbnRleHQgPSByZXF1aXJlKCcuL19zdHJpbmctY29udGV4dCcpO1xudmFyIEVORFNfV0lUSCA9ICdlbmRzV2l0aCc7XG52YXIgJGVuZHNXaXRoID0gJydbRU5EU19XSVRIXTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscy1pcy1yZWdleHAnKShFTkRTX1dJVEgpLCAnU3RyaW5nJywge1xuICBlbmRzV2l0aDogZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoU3RyaW5nIC8qICwgZW5kUG9zaXRpb24gPSBAbGVuZ3RoICovKSB7XG4gICAgdmFyIHRoYXQgPSBjb250ZXh0KHRoaXMsIHNlYXJjaFN0cmluZywgRU5EU19XSVRIKTtcbiAgICB2YXIgZW5kUG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbGVuID0gdG9MZW5ndGgodGhhdC5sZW5ndGgpO1xuICAgIHZhciBlbmQgPSBlbmRQb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gbGVuIDogTWF0aC5taW4odG9MZW5ndGgoZW5kUG9zaXRpb24pLCBsZW4pO1xuICAgIHZhciBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoU3RyaW5nKTtcbiAgICByZXR1cm4gJGVuZHNXaXRoXG4gICAgICA/ICRlbmRzV2l0aC5jYWxsKHRoYXQsIHNlYXJjaCwgZW5kKVxuICAgICAgOiB0aGF0LnNsaWNlKGVuZCAtIHNlYXJjaC5sZW5ndGgsIGVuZCkgPT09IHNlYXJjaDtcbiAgfVxufSk7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbnZhciAkZnJvbUNvZGVQb2ludCA9IFN0cmluZy5mcm9tQ29kZVBvaW50O1xuXG4vLyBsZW5ndGggc2hvdWxkIGJlIDEsIG9sZCBGRiBwcm9ibGVtXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghISRmcm9tQ29kZVBvaW50ICYmICRmcm9tQ29kZVBvaW50Lmxlbmd0aCAhPSAxKSwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4yLjIgU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cylcbiAgZnJvbUNvZGVQb2ludDogZnVuY3Rpb24gZnJvbUNvZGVQb2ludCh4KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgcmVzID0gW107XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgY29kZTtcbiAgICB3aGlsZSAoYUxlbiA+IGkpIHtcbiAgICAgIGNvZGUgPSArYXJndW1lbnRzW2krK107XG4gICAgICBpZiAodG9BYnNvbHV0ZUluZGV4KGNvZGUsIDB4MTBmZmZmKSAhPT0gY29kZSkgdGhyb3cgUmFuZ2VFcnJvcihjb2RlICsgJyBpcyBub3QgYSB2YWxpZCBjb2RlIHBvaW50Jyk7XG4gICAgICByZXMucHVzaChjb2RlIDwgMHgxMDAwMFxuICAgICAgICA/IGZyb21DaGFyQ29kZShjb2RlKVxuICAgICAgICA6IGZyb21DaGFyQ29kZSgoKGNvZGUgLT0gMHgxMDAwMCkgPj4gMTApICsgMHhkODAwLCBjb2RlICUgMHg0MDAgKyAweGRjMDApXG4gICAgICApO1xuICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcbiAgfVxufSk7XG4iLCIvLyAyMS4xLjMuNyBTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKHNlYXJjaFN0cmluZywgcG9zaXRpb24gPSAwKVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjb250ZXh0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWNvbnRleHQnKTtcbnZhciBJTkNMVURFUyA9ICdpbmNsdWRlcyc7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMtaXMtcmVnZXhwJykoSU5DTFVERVMpLCAnU3RyaW5nJywge1xuICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXMoc2VhcmNoU3RyaW5nIC8qICwgcG9zaXRpb24gPSAwICovKSB7XG4gICAgcmV0dXJuICEhfmNvbnRleHQodGhpcywgc2VhcmNoU3RyaW5nLCBJTkNMVURFUylcbiAgICAgIC5pbmRleE9mKHNlYXJjaFN0cmluZywgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjIuNCBTdHJpbmcucmF3KGNhbGxTaXRlLCAuLi5zdWJzdGl0dXRpb25zKVxuICByYXc6IGZ1bmN0aW9uIHJhdyhjYWxsU2l0ZSkge1xuICAgIHZhciB0cGwgPSB0b0lPYmplY3QoY2FsbFNpdGUucmF3KTtcbiAgICB2YXIgbGVuID0gdG9MZW5ndGgodHBsLmxlbmd0aCk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGxlbiA+IGkpIHtcbiAgICAgIHJlcy5wdXNoKFN0cmluZyh0cGxbaSsrXSkpO1xuICAgICAgaWYgKGkgPCBhTGVuKSByZXMucHVzaChTdHJpbmcoYXJndW1lbnRzW2ldKSk7XG4gICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xuICB9XG59KTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuMTMgU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQoY291bnQpXG4gIHJlcGVhdDogcmVxdWlyZSgnLi9fc3RyaW5nLXJlcGVhdCcpXG59KTtcbiIsIi8vIDIxLjEuMy4xOCBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIFssIHBvc2l0aW9uIF0pXG4ndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY29udGV4dCA9IHJlcXVpcmUoJy4vX3N0cmluZy1jb250ZXh0Jyk7XG52YXIgU1RBUlRTX1dJVEggPSAnc3RhcnRzV2l0aCc7XG52YXIgJHN0YXJ0c1dpdGggPSAnJ1tTVEFSVFNfV0lUSF07XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMtaXMtcmVnZXhwJykoU1RBUlRTX1dJVEgpLCAnU3RyaW5nJywge1xuICBzdGFydHNXaXRoOiBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaFN0cmluZyAvKiAsIHBvc2l0aW9uID0gMCAqLykge1xuICAgIHZhciB0aGF0ID0gY29udGV4dCh0aGlzLCBzZWFyY2hTdHJpbmcsIFNUQVJUU19XSVRIKTtcbiAgICB2YXIgaW5kZXggPSB0b0xlbmd0aChNYXRoLm1pbihhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgdGhhdC5sZW5ndGgpKTtcbiAgICB2YXIgc2VhcmNoID0gU3RyaW5nKHNlYXJjaFN0cmluZyk7XG4gICAgcmV0dXJuICRzdGFydHNXaXRoXG4gICAgICA/ICRzdGFydHNXaXRoLmNhbGwodGhhdCwgc2VhcmNoLCBpbmRleClcbiAgICAgIDogdGhhdC5zbGljZShpbmRleCwgaW5kZXggKyBzZWFyY2gubGVuZ3RoKSA9PT0gc2VhcmNoO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBNRVRBID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWTtcbnZhciAkZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciB3a3NFeHQgPSByZXF1aXJlKCcuL193a3MtZXh0Jyk7XG52YXIgd2tzRGVmaW5lID0gcmVxdWlyZSgnLi9fd2tzLWRlZmluZScpO1xudmFyIGVudW1LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1rZXlzJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzLWFycmF5Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgX2NyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBnT1BORXh0ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4tZXh0Jyk7XG52YXIgJEdPUEQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpO1xudmFyICREUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BEID0gJEdPUEQuZjtcbnZhciBkUCA9ICREUC5mO1xudmFyIGdPUE4gPSBnT1BORXh0LmY7XG52YXIgJFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgJEpTT04gPSBnbG9iYWwuSlNPTjtcbnZhciBfc3RyaW5naWZ5ID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIEhJRERFTiA9IHdrcygnX2hpZGRlbicpO1xudmFyIFRPX1BSSU1JVElWRSA9IHdrcygndG9QcmltaXRpdmUnKTtcbnZhciBpc0VudW0gPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5Jyk7XG52YXIgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpO1xudmFyIE9QU3ltYm9scyA9IHNoYXJlZCgnb3Atc3ltYm9scycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0W1BST1RPVFlQRV07XG52YXIgVVNFX05BVElWRSA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbic7XG52YXIgUU9iamVjdCA9IGdsb2JhbC5RT2JqZWN0O1xuLy8gRG9uJ3QgdXNlIHNldHRlcnMgaW4gUXQgU2NyaXB0LCBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTczXG52YXIgc2V0dGVyID0gIVFPYmplY3QgfHwgIVFPYmplY3RbUFJPVE9UWVBFXSB8fCAhUU9iamVjdFtQUk9UT1RZUEVdLmZpbmRDaGlsZDtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0NSSVBUT1JTICYmICRmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBfY3JlYXRlKGRQKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRQKHRoaXMsICdhJywgeyB2YWx1ZTogNyB9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uIChpdCwga2V5LCBEKSB7XG4gIHZhciBwcm90b0Rlc2MgPSBnT1BEKE9iamVjdFByb3RvLCBrZXkpO1xuICBpZiAocHJvdG9EZXNjKSBkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmIChwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKSBkUChPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xufSA6IGRQO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9IF9jcmVhdGUoJFN5bWJvbFtQUk9UT1RZUEVdKTtcbiAgc3ltLl9rID0gdGFnO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gVVNFX05BVElWRSAmJiB0eXBlb2YgJFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpIHtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90bykgJGRlZmluZVByb3BlcnR5KE9QU3ltYm9scywga2V5LCBEKTtcbiAgYW5PYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBhbk9iamVjdChEKTtcbiAgaWYgKGhhcyhBbGxTeW1ib2xzLCBrZXkpKSB7XG4gICAgaWYgKCFELmVudW1lcmFibGUpIHtcbiAgICAgIGlmICghaGFzKGl0LCBISURERU4pKSBkUChpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkgaXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gX2NyZWF0ZShELCB7IGVudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpIH0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApIHtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpO1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0ga2V5cy5sZW5ndGg7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChsID4gaSkgJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCkge1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSkge1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpO1xuICBpZiAodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XSA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpIHtcbiAgaXQgPSB0b0lPYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBpZiAoaXQgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKSByZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYgKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSkgRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCkge1xuICB2YXIgbmFtZXMgPSBnT1BOKHRvSU9iamVjdChpdCkpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIHtcbiAgICBpZiAoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKSByZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpIHtcbiAgdmFyIElTX09QID0gaXQgPT09IE9iamVjdFByb3RvO1xuICB2YXIgbmFtZXMgPSBnT1BOKElTX09QID8gT1BTeW1ib2xzIDogdG9JT2JqZWN0KGl0KSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB2YXIga2V5O1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkge1xuICAgIGlmIChoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYgKElTX09QID8gaGFzKE9iamVjdFByb3RvLCBrZXkpIDogdHJ1ZSkpIHJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYgKCFVU0VfTkFUSVZFKSB7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKSB0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvciEnKTtcbiAgICB2YXIgdGFnID0gdWlkKGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTtcbiAgICB2YXIgJHNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvKSAkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZiAoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSkgdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZiAoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKSBzZXRTeW1ib2xEZXNjKE9iamVjdFByb3RvLCB0YWcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCBzZXQ6ICRzZXQgfSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgJEdPUEQuZiA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICREUC5mID0gJGRlZmluZVByb3BlcnR5O1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmYgPSBnT1BORXh0LmYgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpLmYgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJykuZiA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYgKERFU0NSSVBUT1JTICYmICFyZXF1aXJlKCcuL19saWJyYXJ5JykpIHtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gd3JhcCh3a3MobmFtZSkpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7IFN5bWJvbDogJFN5bWJvbCB9KTtcblxuZm9yICh2YXIgZXM2U3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBqID0gMDsgZXM2U3ltYm9scy5sZW5ndGggPiBqOyl3a3MoZXM2U3ltYm9sc1tqKytdKTtcblxuZm9yICh2YXIgd2VsbEtub3duU3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGsgPSAwOyB3ZWxsS25vd25TeW1ib2xzLmxlbmd0aCA+IGs7KSB3a3NEZWZpbmUod2VsbEtub3duU3ltYm9sc1trKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihzeW0pIHtcbiAgICBpZiAoIWlzU3ltYm9sKHN5bSkpIHRocm93IFR5cGVFcnJvcihzeW0gKyAnIGlzIG5vdCBhIHN5bWJvbCEnKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gU3ltYm9sUmVnaXN0cnkpIGlmIChTeW1ib2xSZWdpc3RyeVtrZXldID09PSBzeW0pIHJldHVybiBrZXk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24gKCkgeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uICgpIHsgc2V0dGVyID0gZmFsc2U7IH1cbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMjQuMy4yIEpTT04uc3RyaW5naWZ5KHZhbHVlIFssIHJlcGxhY2VyIFssIHNwYWNlXV0pXG4kSlNPTiAmJiAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghVVNFX05BVElWRSB8fCAkZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7IGE6IFMgfSkgIT0gJ3t9JyB8fCBfc3RyaW5naWZ5KE9iamVjdChTKSkgIT0gJ3t9Jztcbn0pKSwgJ0pTT04nLCB7XG4gIHN0cmluZ2lmeTogZnVuY3Rpb24gc3RyaW5naWZ5KGl0KSB7XG4gICAgdmFyIGFyZ3MgPSBbaXRdO1xuICAgIHZhciBpID0gMTtcbiAgICB2YXIgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGkpIGFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgJHJlcGxhY2VyID0gcmVwbGFjZXIgPSBhcmdzWzFdO1xuICAgIGlmICghaXNPYmplY3QocmVwbGFjZXIpICYmIGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKSByZXR1cm47IC8vIElFOCByZXR1cm5zIHN0cmluZyBvbiB1bmRlZmluZWRcbiAgICBpZiAoIWlzQXJyYXkocmVwbGFjZXIpKSByZXBsYWNlciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mICRyZXBsYWNlciA9PSAnZnVuY3Rpb24nKSB2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgaWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICR0eXBlZCA9IHJlcXVpcmUoJy4vX3R5cGVkJyk7XG52YXIgYnVmZmVyID0gcmVxdWlyZSgnLi9fdHlwZWQtYnVmZmVyJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLkFycmF5QnVmZmVyO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciAkQXJyYXlCdWZmZXIgPSBidWZmZXIuQXJyYXlCdWZmZXI7XG52YXIgJERhdGFWaWV3ID0gYnVmZmVyLkRhdGFWaWV3O1xudmFyICRpc1ZpZXcgPSAkdHlwZWQuQUJWICYmIEFycmF5QnVmZmVyLmlzVmlldztcbnZhciAkc2xpY2UgPSAkQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlO1xudmFyIFZJRVcgPSAkdHlwZWQuVklFVztcbnZhciBBUlJBWV9CVUZGRVIgPSAnQXJyYXlCdWZmZXInO1xuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChBcnJheUJ1ZmZlciAhPT0gJEFycmF5QnVmZmVyKSwgeyBBcnJheUJ1ZmZlcjogJEFycmF5QnVmZmVyIH0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEkdHlwZWQuQ09OU1RSLCBBUlJBWV9CVUZGRVIsIHtcbiAgLy8gMjQuMS4zLjEgQXJyYXlCdWZmZXIuaXNWaWV3KGFyZylcbiAgaXNWaWV3OiBmdW5jdGlvbiBpc1ZpZXcoaXQpIHtcbiAgICByZXR1cm4gJGlzVmlldyAmJiAkaXNWaWV3KGl0KSB8fCBpc09iamVjdChpdCkgJiYgVklFVyBpbiBpdDtcbiAgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5VICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAhbmV3ICRBcnJheUJ1ZmZlcigyKS5zbGljZSgxLCB1bmRlZmluZWQpLmJ5dGVMZW5ndGg7XG59KSwgQVJSQVlfQlVGRkVSLCB7XG4gIC8vIDI0LjEuNC4zIEFycmF5QnVmZmVyLnByb3RvdHlwZS5zbGljZShzdGFydCwgZW5kKVxuICBzbGljZTogZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCkge1xuICAgIGlmICgkc2xpY2UgIT09IHVuZGVmaW5lZCAmJiBlbmQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICRzbGljZS5jYWxsKGFuT2JqZWN0KHRoaXMpLCBzdGFydCk7IC8vIEZGIGZpeFxuICAgIHZhciBsZW4gPSBhbk9iamVjdCh0aGlzKS5ieXRlTGVuZ3RoO1xuICAgIHZhciBmaXJzdCA9IHRvQWJzb2x1dGVJbmRleChzdGFydCwgbGVuKTtcbiAgICB2YXIgZmluYWwgPSB0b0Fic29sdXRlSW5kZXgoZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiBlbmQsIGxlbik7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsICRBcnJheUJ1ZmZlcikpKHRvTGVuZ3RoKGZpbmFsIC0gZmlyc3QpKTtcbiAgICB2YXIgdmlld1MgPSBuZXcgJERhdGFWaWV3KHRoaXMpO1xuICAgIHZhciB2aWV3VCA9IG5ldyAkRGF0YVZpZXcocmVzdWx0KTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHdoaWxlIChmaXJzdCA8IGZpbmFsKSB7XG4gICAgICB2aWV3VC5zZXRVaW50OChpbmRleCsrLCB2aWV3Uy5nZXRVaW50OChmaXJzdCsrKSk7XG4gICAgfSByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShBUlJBWV9CVUZGRVIpO1xuIiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnRmxvYXQzMicsIDQsIGZ1bmN0aW9uIChpbml0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBGbG9hdDMyQXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pO1xuIiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnRmxvYXQ2NCcsIDgsIGZ1bmN0aW9uIChpbml0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBGbG9hdDY0QXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pO1xuIiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnSW50MTYnLCAyLCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gSW50MTZBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7XG4iLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdJbnQzMicsIDQsIGZ1bmN0aW9uIChpbml0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBJbnQzMkFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTtcbiIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ0ludDgnLCAxLCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gSW50OEFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTtcbiIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ1VpbnQxNicsIDIsIGZ1bmN0aW9uIChpbml0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBVaW50MTZBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7XG4iLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdVaW50MzInLCA0LCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gVWludDMyQXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pO1xuIiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnVWludDgnLCAxLCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gVWludDhBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7XG4iLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdVaW50OCcsIDEsIGZ1bmN0aW9uIChpbml0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBVaW50OENsYW1wZWRBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSwgdHJ1ZSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgwKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgbWV0YSA9IHJlcXVpcmUoJy4vX21ldGEnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJyk7XG52YXIgd2VhayA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24td2VhaycpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIFdFQUtfTUFQID0gJ1dlYWtNYXAnO1xudmFyIGdldFdlYWsgPSBtZXRhLmdldFdlYWs7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZTtcbnZhciB1bmNhdWdodEZyb3plblN0b3JlID0gd2Vhay51ZnN0b3JlO1xudmFyIHRtcCA9IHt9O1xudmFyIEludGVybmFsTWFwO1xuXG52YXIgd3JhcHBlciA9IGZ1bmN0aW9uIChnZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIFdlYWtNYXAoKSB7XG4gICAgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gIH07XG59O1xuXG52YXIgbWV0aG9kcyA9IHtcbiAgLy8gMjMuMy4zLjMgV2Vha01hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgaWYgKGlzT2JqZWN0KGtleSkpIHtcbiAgICAgIHZhciBkYXRhID0gZ2V0V2VhayhrZXkpO1xuICAgICAgaWYgKGRhdGEgPT09IHRydWUpIHJldHVybiB1bmNhdWdodEZyb3plblN0b3JlKHZhbGlkYXRlKHRoaXMsIFdFQUtfTUFQKSkuZ2V0KGtleSk7XG4gICAgICByZXR1cm4gZGF0YSA/IGRhdGFbdGhpcy5faV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuICB9LFxuICAvLyAyMy4zLjMuNSBXZWFrTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB3ZWFrLmRlZih2YWxpZGF0ZSh0aGlzLCBXRUFLX01BUCksIGtleSwgdmFsdWUpO1xuICB9XG59O1xuXG4vLyAyMy4zIFdlYWtNYXAgT2JqZWN0c1xudmFyICRXZWFrTWFwID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoV0VBS19NQVAsIHdyYXBwZXIsIG1ldGhvZHMsIHdlYWssIHRydWUsIHRydWUpO1xuXG4vLyBJRTExIFdlYWtNYXAgZnJvemVuIGtleXMgZml4XG5pZiAoZmFpbHMoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3ICRXZWFrTWFwKCkuc2V0KChPYmplY3QuZnJlZXplIHx8IE9iamVjdCkodG1wKSwgNykuZ2V0KHRtcCkgIT0gNzsgfSkpIHtcbiAgSW50ZXJuYWxNYXAgPSB3ZWFrLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIFdFQUtfTUFQKTtcbiAgYXNzaWduKEludGVybmFsTWFwLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gIG1ldGEuTkVFRCA9IHRydWU7XG4gIGVhY2goWydkZWxldGUnLCAnaGFzJywgJ2dldCcsICdzZXQnXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBwcm90byA9ICRXZWFrTWFwLnByb3RvdHlwZTtcbiAgICB2YXIgbWV0aG9kID0gcHJvdG9ba2V5XTtcbiAgICByZWRlZmluZShwcm90bywga2V5LCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgLy8gc3RvcmUgZnJvemVuIG9iamVjdHMgb24gaW50ZXJuYWwgd2Vha21hcCBzaGltXG4gICAgICBpZiAoaXNPYmplY3QoYSkgJiYgIWlzRXh0ZW5zaWJsZShhKSkge1xuICAgICAgICBpZiAoIXRoaXMuX2YpIHRoaXMuX2YgPSBuZXcgSW50ZXJuYWxNYXAoKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2Zba2V5XShhLCBiKTtcbiAgICAgICAgcmV0dXJuIGtleSA9PSAnc2V0JyA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICAvLyBzdG9yZSBhbGwgdGhlIHJlc3Qgb24gbmF0aXZlIHdlYWttYXBcbiAgICAgIH0gcmV0dXJuIG1ldGhvZC5jYWxsKHRoaXMsIGEsIGIpO1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciB3ZWFrID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi13ZWFrJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgV0VBS19TRVQgPSAnV2Vha1NldCc7XG5cbi8vIDIzLjQgV2Vha1NldCBPYmplY3RzXG5yZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoV0VBS19TRVQsIGZ1bmN0aW9uIChnZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIFdlYWtTZXQoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy40LjMuMSBXZWFrU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHdlYWsuZGVmKHZhbGlkYXRlKHRoaXMsIFdFQUtfU0VUKSwgdmFsdWUsIHRydWUpO1xuICB9XG59LCB3ZWFrLCBmYWxzZSwgdHJ1ZSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9BcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGluY2x1ZGVzID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKSh0cnVlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKGVsIC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiAkaW5jbHVkZXModGhpcywgZWwsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKCdpbmNsdWRlcycpO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JqZWN0LXZhbHVlcy1lbnRyaWVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRlbnRyaWVzID0gcmVxdWlyZSgnLi9fb2JqZWN0LXRvLWFycmF5JykodHJ1ZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICBlbnRyaWVzOiBmdW5jdGlvbiBlbnRyaWVzKGl0KSB7XG4gICAgcmV0dXJuICRlbnRyaWVzKGl0KTtcbiAgfVxufSk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBvd25LZXlzID0gcmVxdWlyZSgnLi9fb3duLWtleXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgZ09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7XG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqZWN0KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgICB2YXIgZ2V0RGVzYyA9IGdPUEQuZjtcbiAgICB2YXIga2V5cyA9IG93bktleXMoTyk7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIga2V5LCBkZXNjO1xuICAgIHdoaWxlIChrZXlzLmxlbmd0aCA+IGkpIHtcbiAgICAgIGRlc2MgPSBnZXREZXNjKE8sIGtleSA9IGtleXNbaSsrXSk7XG4gICAgICBpZiAoZGVzYyAhPT0gdW5kZWZpbmVkKSBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzYyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JqZWN0LXZhbHVlcy1lbnRyaWVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICR2YWx1ZXMgPSByZXF1aXJlKCcuL19vYmplY3QtdG8tYXJyYXknKShmYWxzZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICB2YWx1ZXM6IGZ1bmN0aW9uIHZhbHVlcyhpdCkge1xuICAgIHJldHVybiAkdmFsdWVzKGl0KTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1zdHJpbmctcGFkLXN0YXJ0LWVuZFxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkcGFkID0gcmVxdWlyZSgnLi9fc3RyaW5nLXBhZCcpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4vX3VzZXItYWdlbnQnKTtcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzI4MFxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAvVmVyc2lvblxcLzEwXFwuXFxkKyhcXC5cXGQrKT8gU2FmYXJpXFwvLy50ZXN0KHVzZXJBZ2VudCksICdTdHJpbmcnLCB7XG4gIHBhZEVuZDogZnVuY3Rpb24gcGFkRW5kKG1heExlbmd0aCAvKiAsIGZpbGxTdHJpbmcgPSAnICcgKi8pIHtcbiAgICByZXR1cm4gJHBhZCh0aGlzLCBtYXhMZW5ndGgsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCBmYWxzZSk7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtc3RyaW5nLXBhZC1zdGFydC1lbmRcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJHBhZCA9IHJlcXVpcmUoJy4vX3N0cmluZy1wYWQnKTtcbnZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuL191c2VyLWFnZW50Jyk7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8yODBcbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogL1ZlcnNpb25cXC8xMFxcLlxcZCsoXFwuXFxkKyk/IFNhZmFyaVxcLy8udGVzdCh1c2VyQWdlbnQpLCAnU3RyaW5nJywge1xuICBwYWRTdGFydDogZnVuY3Rpb24gcGFkU3RhcnQobWF4TGVuZ3RoIC8qICwgZmlsbFN0cmluZyA9ICcgJyAqLykge1xuICAgIHJldHVybiAkcGFkKHRoaXMsIG1heExlbmd0aCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIHRydWUpO1xuICB9XG59KTtcbiIsInZhciAkaXRlcmF0b3JzID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciBJVEVSQVRPUiA9IHdrcygnaXRlcmF0b3InKTtcbnZhciBUT19TVFJJTkdfVEFHID0gd2tzKCd0b1N0cmluZ1RhZycpO1xudmFyIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5O1xuXG52YXIgRE9NSXRlcmFibGVzID0ge1xuICBDU1NSdWxlTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIENTU1N0eWxlRGVjbGFyYXRpb246IGZhbHNlLFxuICBDU1NWYWx1ZUxpc3Q6IGZhbHNlLFxuICBDbGllbnRSZWN0TGlzdDogZmFsc2UsXG4gIERPTVJlY3RMaXN0OiBmYWxzZSxcbiAgRE9NU3RyaW5nTGlzdDogZmFsc2UsXG4gIERPTVRva2VuTGlzdDogdHJ1ZSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IGZhbHNlLFxuICBGaWxlTGlzdDogZmFsc2UsXG4gIEhUTUxBbGxDb2xsZWN0aW9uOiBmYWxzZSxcbiAgSFRNTENvbGxlY3Rpb246IGZhbHNlLFxuICBIVE1MRm9ybUVsZW1lbnQ6IGZhbHNlLFxuICBIVE1MU2VsZWN0RWxlbWVudDogZmFsc2UsXG4gIE1lZGlhTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIE1pbWVUeXBlQXJyYXk6IGZhbHNlLFxuICBOYW1lZE5vZGVNYXA6IGZhbHNlLFxuICBOb2RlTGlzdDogdHJ1ZSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogZmFsc2UsXG4gIFBsdWdpbjogZmFsc2UsXG4gIFBsdWdpbkFycmF5OiBmYWxzZSxcbiAgU1ZHTGVuZ3RoTGlzdDogZmFsc2UsXG4gIFNWR051bWJlckxpc3Q6IGZhbHNlLFxuICBTVkdQYXRoU2VnTGlzdDogZmFsc2UsXG4gIFNWR1BvaW50TGlzdDogZmFsc2UsXG4gIFNWR1N0cmluZ0xpc3Q6IGZhbHNlLFxuICBTVkdUcmFuc2Zvcm1MaXN0OiBmYWxzZSxcbiAgU291cmNlQnVmZmVyTGlzdDogZmFsc2UsXG4gIFN0eWxlU2hlZXRMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgVGV4dFRyYWNrQ3VlTGlzdDogZmFsc2UsXG4gIFRleHRUcmFja0xpc3Q6IGZhbHNlLFxuICBUb3VjaExpc3Q6IGZhbHNlXG59O1xuXG5mb3IgKHZhciBjb2xsZWN0aW9ucyA9IGdldEtleXMoRE9NSXRlcmFibGVzKSwgaSA9IDA7IGkgPCBjb2xsZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IGNvbGxlY3Rpb25zW2ldO1xuICB2YXIgZXhwbGljaXQgPSBET01JdGVyYWJsZXNbTkFNRV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICB2YXIga2V5O1xuICBpZiAocHJvdG8pIHtcbiAgICBpZiAoIXByb3RvW0lURVJBVE9SXSkgaGlkZShwcm90bywgSVRFUkFUT1IsIEFycmF5VmFsdWVzKTtcbiAgICBpZiAoIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgICBJdGVyYXRvcnNbTkFNRV0gPSBBcnJheVZhbHVlcztcbiAgICBpZiAoZXhwbGljaXQpIGZvciAoa2V5IGluICRpdGVyYXRvcnMpIGlmICghcHJvdG9ba2V5XSkgcmVkZWZpbmUocHJvdG8sIGtleSwgJGl0ZXJhdG9yc1trZXldLCB0cnVlKTtcbiAgfVxufVxuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKTtcbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5CLCB7XG4gIHNldEltbWVkaWF0ZTogJHRhc2suc2V0LFxuICBjbGVhckltbWVkaWF0ZTogJHRhc2suY2xlYXJcbn0pO1xuIiwiLy8gaWU5LSBzZXRUaW1lb3V0ICYgc2V0SW50ZXJ2YWwgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIGZpeFxudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuL191c2VyLWFnZW50Jyk7XG52YXIgc2xpY2UgPSBbXS5zbGljZTtcbnZhciBNU0lFID0gL01TSUUgLlxcLi8udGVzdCh1c2VyQWdlbnQpOyAvLyA8LSBkaXJ0eSBpZTktIGNoZWNrXG52YXIgd3JhcCA9IGZ1bmN0aW9uIChzZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChmbiwgdGltZSAvKiAsIC4uLmFyZ3MgKi8pIHtcbiAgICB2YXIgYm91bmRBcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgdmFyIGFyZ3MgPSBib3VuZEFyZ3MgPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiBmYWxzZTtcbiAgICByZXR1cm4gc2V0KGJvdW5kQXJncyA/IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbikpLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0gOiBmbiwgdGltZSk7XG4gIH07XG59O1xuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LkIgKyAkZXhwb3J0LkYgKiBNU0lFLCB7XG4gIHNldFRpbWVvdXQ6IHdyYXAoZ2xvYmFsLnNldFRpbWVvdXQpLFxuICBzZXRJbnRlcnZhbDogd3JhcChnbG9iYWwuc2V0SW50ZXJ2YWwpXG59KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cbiAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGhvd2V2ZXIsIHRoZVxuICAgICAgICAgIC8vIHJlc3VsdCBmb3IgdGhpcyBpdGVyYXRpb24gd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBzYW1lXG4gICAgICAgICAgLy8gcmVhc29uLiBOb3RlIHRoYXQgcmVqZWN0aW9ucyBvZiB5aWVsZGVkIFByb21pc2VzIGFyZSBub3RcbiAgICAgICAgICAvLyB0aHJvd24gYmFjayBpbnRvIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIGFzIGlzIHRoZSBjYXNlXG4gICAgICAgICAgLy8gd2hlbiBhbiBhd2FpdGVkIFByb21pc2UgaXMgcmVqZWN0ZWQuIFRoaXMgZGlmZmVyZW5jZSBpblxuICAgICAgICAgIC8vIGJlaGF2aW9yIGJldHdlZW4geWllbGQgYW5kIGF3YWl0IGlzIGltcG9ydGFudCwgYmVjYXVzZSBpdFxuICAgICAgICAgIC8vIGFsbG93cyB0aGUgY29uc3VtZXIgdG8gZGVjaWRlIHdoYXQgdG8gZG8gd2l0aCB0aGUgeWllbGRlZFxuICAgICAgICAgIC8vIHJlamVjdGlvbiAoc3dhbGxvdyBpdCBhbmQgY29udGludWUsIG1hbnVhbGx5IC50aHJvdyBpdCBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgZ2VuZXJhdG9yLCBhYmFuZG9uIGl0ZXJhdGlvbiwgd2hhdGV2ZXIpLiBXaXRoXG4gICAgICAgICAgLy8gYXdhaXQsIGJ5IGNvbnRyYXN0LCB0aGVyZSBpcyBubyBvcHBvcnR1bml0eSB0byBleGFtaW5lIHRoZVxuICAgICAgICAgIC8vIHJlamVjdGlvbiByZWFzb24gb3V0c2lkZSB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBzbyB0aGVcbiAgICAgICAgICAvLyBvbmx5IG9wdGlvbiBpcyB0byB0aHJvdyBpdCBmcm9tIHRoZSBhd2FpdCBleHByZXNzaW9uLCBhbmRcbiAgICAgICAgICAvLyBsZXQgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBoYW5kbGUgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZ2xvYmFsLnByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgZ2xvYmFsLnByb2Nlc3MuZG9tYWluKSB7XG4gICAgICBpbnZva2UgPSBnbG9iYWwucHJvY2Vzcy5kb21haW4uYmluZChpbnZva2UpO1xuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHJ1bnRpbWUuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuICAgICk7XG5cbiAgICByZXR1cm4gcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbiAgLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuICAvLyBvYmplY3QsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG1vc3QgcmVsaWFibGUgdGVjaG5pcXVlIHRoYXQgZG9lcyBub3RcbiAgLy8gdXNlIGluZGlyZWN0IGV2YWwgKHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5KS5cbiAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6XG4gIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOlxuICB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB0aGlzXG4pO1xuIiwiLyohIFZlbG9jaXR5SlMub3JnICgxLjUuMikuIChDKSAyMDE0IEp1bGlhbiBTaGFwaXJvLiBNSVQgQGxpY2Vuc2U6IGVuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZSAqL1xuLyohIFZlbG9jaXR5SlMub3JnIGpRdWVyeSBTaGltICgxLjAuMSkuIChDKSAyMDE0IFRoZSBqUXVlcnkgRm91bmRhdGlvbi4gTUlUIEBsaWNlbnNlOiBlbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UuICovXG4hZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihhKXt2YXIgYj1hLmxlbmd0aCxkPWMudHlwZShhKTtyZXR1cm5cImZ1bmN0aW9uXCIhPT1kJiYhYy5pc1dpbmRvdyhhKSYmKCEoMSE9PWEubm9kZVR5cGV8fCFiKXx8KFwiYXJyYXlcIj09PWR8fDA9PT1ifHxcIm51bWJlclwiPT10eXBlb2YgYiYmYj4wJiZiLTEgaW4gYSkpfWlmKCFhLmpRdWVyeSl7dmFyIGM9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGMuZm4uaW5pdChhLGIpfTtjLmlzV2luZG93PWZ1bmN0aW9uKGEpe3JldHVybiBhJiZhPT09YS53aW5kb3d9LGMudHlwZT1mdW5jdGlvbihhKXtyZXR1cm4gYT9cIm9iamVjdFwiPT10eXBlb2YgYXx8XCJmdW5jdGlvblwiPT10eXBlb2YgYT9lW2cuY2FsbChhKV18fFwib2JqZWN0XCI6dHlwZW9mIGE6YStcIlwifSxjLmlzQXJyYXk9QXJyYXkuaXNBcnJheXx8ZnVuY3Rpb24oYSl7cmV0dXJuXCJhcnJheVwiPT09Yy50eXBlKGEpfSxjLmlzUGxhaW5PYmplY3Q9ZnVuY3Rpb24oYSl7dmFyIGI7aWYoIWF8fFwib2JqZWN0XCIhPT1jLnR5cGUoYSl8fGEubm9kZVR5cGV8fGMuaXNXaW5kb3coYSkpcmV0dXJuITE7dHJ5e2lmKGEuY29uc3RydWN0b3ImJiFmLmNhbGwoYSxcImNvbnN0cnVjdG9yXCIpJiYhZi5jYWxsKGEuY29uc3RydWN0b3IucHJvdG90eXBlLFwiaXNQcm90b3R5cGVPZlwiKSlyZXR1cm4hMX1jYXRjaChkKXtyZXR1cm4hMX1mb3IoYiBpbiBhKTtyZXR1cm4gYj09PXVuZGVmaW5lZHx8Zi5jYWxsKGEsYil9LGMuZWFjaD1mdW5jdGlvbihhLGMsZCl7dmFyIGU9MCxmPWEubGVuZ3RoLGc9YihhKTtpZihkKXtpZihnKWZvcig7ZTxmJiYhMSE9PWMuYXBwbHkoYVtlXSxkKTtlKyspO2Vsc2UgZm9yKGUgaW4gYSlpZihhLmhhc093blByb3BlcnR5KGUpJiYhMT09PWMuYXBwbHkoYVtlXSxkKSlicmVha31lbHNlIGlmKGcpZm9yKDtlPGYmJiExIT09Yy5jYWxsKGFbZV0sZSxhW2VdKTtlKyspO2Vsc2UgZm9yKGUgaW4gYSlpZihhLmhhc093blByb3BlcnR5KGUpJiYhMT09PWMuY2FsbChhW2VdLGUsYVtlXSkpYnJlYWs7cmV0dXJuIGF9LGMuZGF0YT1mdW5jdGlvbihhLGIsZSl7aWYoZT09PXVuZGVmaW5lZCl7dmFyIGY9YVtjLmV4cGFuZG9dLGc9ZiYmZFtmXTtpZihiPT09dW5kZWZpbmVkKXJldHVybiBnO2lmKGcmJmIgaW4gZylyZXR1cm4gZ1tiXX1lbHNlIGlmKGIhPT11bmRlZmluZWQpe3ZhciBoPWFbYy5leHBhbmRvXXx8KGFbYy5leHBhbmRvXT0rK2MudXVpZCk7cmV0dXJuIGRbaF09ZFtoXXx8e30sZFtoXVtiXT1lLGV9fSxjLnJlbW92ZURhdGE9ZnVuY3Rpb24oYSxiKXt2YXIgZT1hW2MuZXhwYW5kb10sZj1lJiZkW2VdO2YmJihiP2MuZWFjaChiLGZ1bmN0aW9uKGEsYil7ZGVsZXRlIGZbYl19KTpkZWxldGUgZFtlXSl9LGMuZXh0ZW5kPWZ1bmN0aW9uKCl7dmFyIGEsYixkLGUsZixnLGg9YXJndW1lbnRzWzBdfHx7fSxpPTEsaj1hcmd1bWVudHMubGVuZ3RoLGs9ITE7Zm9yKFwiYm9vbGVhblwiPT10eXBlb2YgaCYmKGs9aCxoPWFyZ3VtZW50c1tpXXx8e30saSsrKSxcIm9iamVjdFwiIT10eXBlb2YgaCYmXCJmdW5jdGlvblwiIT09Yy50eXBlKGgpJiYoaD17fSksaT09PWomJihoPXRoaXMsaS0tKTtpPGo7aSsrKWlmKGY9YXJndW1lbnRzW2ldKWZvcihlIGluIGYpZi5oYXNPd25Qcm9wZXJ0eShlKSYmKGE9aFtlXSxkPWZbZV0saCE9PWQmJihrJiZkJiYoYy5pc1BsYWluT2JqZWN0KGQpfHwoYj1jLmlzQXJyYXkoZCkpKT8oYj8oYj0hMSxnPWEmJmMuaXNBcnJheShhKT9hOltdKTpnPWEmJmMuaXNQbGFpbk9iamVjdChhKT9hOnt9LGhbZV09Yy5leHRlbmQoayxnLGQpKTpkIT09dW5kZWZpbmVkJiYoaFtlXT1kKSkpO3JldHVybiBofSxjLnF1ZXVlPWZ1bmN0aW9uKGEsZCxlKXtpZihhKXtkPShkfHxcImZ4XCIpK1wicXVldWVcIjt2YXIgZj1jLmRhdGEoYSxkKTtyZXR1cm4gZT8oIWZ8fGMuaXNBcnJheShlKT9mPWMuZGF0YShhLGQsZnVuY3Rpb24oYSxjKXt2YXIgZD1jfHxbXTtyZXR1cm4gYSYmKGIoT2JqZWN0KGEpKT9mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0rYi5sZW5ndGgsZD0wLGU9YS5sZW5ndGg7ZDxjOylhW2UrK109YltkKytdO2lmKGMhPT1jKWZvcig7YltkXSE9PXVuZGVmaW5lZDspYVtlKytdPWJbZCsrXTthLmxlbmd0aD1lfShkLFwic3RyaW5nXCI9PXR5cGVvZiBhP1thXTphKTpbXS5wdXNoLmNhbGwoZCxhKSksZH0oZSkpOmYucHVzaChlKSxmKTpmfHxbXX19LGMuZGVxdWV1ZT1mdW5jdGlvbihhLGIpe2MuZWFjaChhLm5vZGVUeXBlP1thXTphLGZ1bmN0aW9uKGEsZCl7Yj1ifHxcImZ4XCI7dmFyIGU9Yy5xdWV1ZShkLGIpLGY9ZS5zaGlmdCgpO1wiaW5wcm9ncmVzc1wiPT09ZiYmKGY9ZS5zaGlmdCgpKSxmJiYoXCJmeFwiPT09YiYmZS51bnNoaWZ0KFwiaW5wcm9ncmVzc1wiKSxmLmNhbGwoZCxmdW5jdGlvbigpe2MuZGVxdWV1ZShkLGIpfSkpfSl9LGMuZm49Yy5wcm90b3R5cGU9e2luaXQ6ZnVuY3Rpb24oYSl7aWYoYS5ub2RlVHlwZSlyZXR1cm4gdGhpc1swXT1hLHRoaXM7dGhyb3cgbmV3IEVycm9yKFwiTm90IGEgRE9NIG5vZGUuXCIpfSxvZmZzZXQ6ZnVuY3Rpb24oKXt2YXIgYj10aGlzWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdD90aGlzWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOnt0b3A6MCxsZWZ0OjB9O3JldHVybnt0b3A6Yi50b3ArKGEucGFnZVlPZmZzZXR8fGRvY3VtZW50LnNjcm9sbFRvcHx8MCktKGRvY3VtZW50LmNsaWVudFRvcHx8MCksbGVmdDpiLmxlZnQrKGEucGFnZVhPZmZzZXR8fGRvY3VtZW50LnNjcm9sbExlZnR8fDApLShkb2N1bWVudC5jbGllbnRMZWZ0fHwwKX19LHBvc2l0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpc1swXSxiPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1hLm9mZnNldFBhcmVudDtiJiZcImh0bWxcIiE9PWIubm9kZU5hbWUudG9Mb3dlckNhc2UoKSYmYi5zdHlsZSYmXCJzdGF0aWNcIj09PWIuc3R5bGUucG9zaXRpb24udG9Mb3dlckNhc2UoKTspYj1iLm9mZnNldFBhcmVudDtyZXR1cm4gYnx8ZG9jdW1lbnR9KGEpLGQ9dGhpcy5vZmZzZXQoKSxlPS9eKD86Ym9keXxodG1sKSQvaS50ZXN0KGIubm9kZU5hbWUpP3t0b3A6MCxsZWZ0OjB9OmMoYikub2Zmc2V0KCk7cmV0dXJuIGQudG9wLT1wYXJzZUZsb2F0KGEuc3R5bGUubWFyZ2luVG9wKXx8MCxkLmxlZnQtPXBhcnNlRmxvYXQoYS5zdHlsZS5tYXJnaW5MZWZ0KXx8MCxiLnN0eWxlJiYoZS50b3ArPXBhcnNlRmxvYXQoYi5zdHlsZS5ib3JkZXJUb3BXaWR0aCl8fDAsZS5sZWZ0Kz1wYXJzZUZsb2F0KGIuc3R5bGUuYm9yZGVyTGVmdFdpZHRoKXx8MCkse3RvcDpkLnRvcC1lLnRvcCxsZWZ0OmQubGVmdC1lLmxlZnR9fX07dmFyIGQ9e307Yy5leHBhbmRvPVwidmVsb2NpdHlcIisobmV3IERhdGUpLmdldFRpbWUoKSxjLnV1aWQ9MDtmb3IodmFyIGU9e30sZj1lLmhhc093blByb3BlcnR5LGc9ZS50b1N0cmluZyxoPVwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvclwiLnNwbGl0KFwiIFwiKSxpPTA7aTxoLmxlbmd0aDtpKyspZVtcIltvYmplY3QgXCIraFtpXStcIl1cIl09aFtpXS50b0xvd2VyQ2FzZSgpO2MuZm4uaW5pdC5wcm90b3R5cGU9Yy5mbixhLlZlbG9jaXR5PXtVdGlsaXRpZXM6Y319fSh3aW5kb3cpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO1wib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1hKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShhKTphKCl9KGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIGZ1bmN0aW9uKGEsYixjLGQpe2Z1bmN0aW9uIGUoYSl7Zm9yKHZhciBiPS0xLGM9YT9hLmxlbmd0aDowLGQ9W107KytiPGM7KXt2YXIgZT1hW2JdO2UmJmQucHVzaChlKX1yZXR1cm4gZH1mdW5jdGlvbiBmKGEpe3JldHVybiB1LmlzV3JhcHBlZChhKT9hPXMuY2FsbChhKTp1LmlzTm9kZShhKSYmKGE9W2FdKSxhfWZ1bmN0aW9uIGcoYSl7dmFyIGI9by5kYXRhKGEsXCJ2ZWxvY2l0eVwiKTtyZXR1cm4gbnVsbD09PWI/ZDpifWZ1bmN0aW9uIGgoYSxiKXt2YXIgYz1nKGEpO2MmJmMuZGVsYXlUaW1lciYmIWMuZGVsYXlQYXVzZWQmJihjLmRlbGF5UmVtYWluaW5nPWMuZGVsYXktYitjLmRlbGF5QmVnaW4sYy5kZWxheVBhdXNlZD0hMCxjbGVhclRpbWVvdXQoYy5kZWxheVRpbWVyLnNldFRpbWVvdXQpKX1mdW5jdGlvbiBpKGEsYil7dmFyIGM9ZyhhKTtjJiZjLmRlbGF5VGltZXImJmMuZGVsYXlQYXVzZWQmJihjLmRlbGF5UGF1c2VkPSExLGMuZGVsYXlUaW1lci5zZXRUaW1lb3V0PXNldFRpbWVvdXQoYy5kZWxheVRpbWVyLm5leHQsYy5kZWxheVJlbWFpbmluZykpfWZ1bmN0aW9uIGooYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiBNYXRoLnJvdW5kKGIqYSkqKDEvYSl9fWZ1bmN0aW9uIGsoYSxjLGQsZSl7ZnVuY3Rpb24gZihhLGIpe3JldHVybiAxLTMqYiszKmF9ZnVuY3Rpb24gZyhhLGIpe3JldHVybiAzKmItNiphfWZ1bmN0aW9uIGgoYSl7cmV0dXJuIDMqYX1mdW5jdGlvbiBpKGEsYixjKXtyZXR1cm4oKGYoYixjKSphK2coYixjKSkqYStoKGIpKSphfWZ1bmN0aW9uIGooYSxiLGMpe3JldHVybiAzKmYoYixjKSphKmErMipnKGIsYykqYStoKGIpfWZ1bmN0aW9uIGsoYixjKXtmb3IodmFyIGU9MDtlPHA7KytlKXt2YXIgZj1qKGMsYSxkKTtpZigwPT09ZilyZXR1cm4gYztjLT0oaShjLGEsZCktYikvZn1yZXR1cm4gY31mdW5jdGlvbiBsKCl7Zm9yKHZhciBiPTA7Yjx0OysrYil4W2JdPWkoYip1LGEsZCl9ZnVuY3Rpb24gbShiLGMsZSl7dmFyIGYsZyxoPTA7ZG97Zz1jKyhlLWMpLzIsZj1pKGcsYSxkKS1iLGY+MD9lPWc6Yz1nfXdoaWxlKE1hdGguYWJzKGYpPnImJisraDxzKTtyZXR1cm4gZ31mdW5jdGlvbiBuKGIpe2Zvcih2YXIgYz0wLGU9MSxmPXQtMTtlIT09ZiYmeFtlXTw9YjsrK2UpYys9dTstLWU7dmFyIGc9KGIteFtlXSkvKHhbZSsxXS14W2VdKSxoPWMrZyp1LGk9aihoLGEsZCk7cmV0dXJuIGk+PXE/ayhiLGgpOjA9PT1pP2g6bShiLGMsYyt1KX1mdW5jdGlvbiBvKCl7eT0hMCxhPT09YyYmZD09PWV8fGwoKX12YXIgcD00LHE9LjAwMSxyPTFlLTcscz0xMCx0PTExLHU9MS8odC0xKSx2PVwiRmxvYXQzMkFycmF5XCJpbiBiO2lmKDQhPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiExO2Zvcih2YXIgdz0wO3c8NDsrK3cpaWYoXCJudW1iZXJcIiE9dHlwZW9mIGFyZ3VtZW50c1t3XXx8aXNOYU4oYXJndW1lbnRzW3ddKXx8IWlzRmluaXRlKGFyZ3VtZW50c1t3XSkpcmV0dXJuITE7YT1NYXRoLm1pbihhLDEpLGQ9TWF0aC5taW4oZCwxKSxhPU1hdGgubWF4KGEsMCksZD1NYXRoLm1heChkLDApO3ZhciB4PXY/bmV3IEZsb2F0MzJBcnJheSh0KTpuZXcgQXJyYXkodCkseT0hMSx6PWZ1bmN0aW9uKGIpe3JldHVybiB5fHxvKCksYT09PWMmJmQ9PT1lP2I6MD09PWI/MDoxPT09Yj8xOmkobihiKSxjLGUpfTt6LmdldENvbnRyb2xQb2ludHM9ZnVuY3Rpb24oKXtyZXR1cm5be3g6YSx5OmN9LHt4OmQseTplfV19O3ZhciBBPVwiZ2VuZXJhdGVCZXppZXIoXCIrW2EsYyxkLGVdK1wiKVwiO3JldHVybiB6LnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIEF9LHp9ZnVuY3Rpb24gbChhLGIpe3ZhciBjPWE7cmV0dXJuIHUuaXNTdHJpbmcoYSk/eS5FYXNpbmdzW2FdfHwoYz0hMSk6Yz11LmlzQXJyYXkoYSkmJjE9PT1hLmxlbmd0aD9qLmFwcGx5KG51bGwsYSk6dS5pc0FycmF5KGEpJiYyPT09YS5sZW5ndGg/ei5hcHBseShudWxsLGEuY29uY2F0KFtiXSkpOiEoIXUuaXNBcnJheShhKXx8NCE9PWEubGVuZ3RoKSYmay5hcHBseShudWxsLGEpLCExPT09YyYmKGM9eS5FYXNpbmdzW3kuZGVmYXVsdHMuZWFzaW5nXT95LmRlZmF1bHRzLmVhc2luZzp4KSxjfWZ1bmN0aW9uIG0oYSl7aWYoYSl7dmFyIGI9eS50aW1lc3RhbXAmJiEwIT09YT9hOnIubm93KCksYz15LlN0YXRlLmNhbGxzLmxlbmd0aDtjPjFlNCYmKHkuU3RhdGUuY2FsbHM9ZSh5LlN0YXRlLmNhbGxzKSxjPXkuU3RhdGUuY2FsbHMubGVuZ3RoKTtmb3IodmFyIGY9MDtmPGM7ZisrKWlmKHkuU3RhdGUuY2FsbHNbZl0pe3ZhciBoPXkuU3RhdGUuY2FsbHNbZl0saT1oWzBdLGo9aFsyXSxrPWhbM10sbD0hayxxPW51bGwscz1oWzVdLHQ9aFs2XTtpZihrfHwoaz15LlN0YXRlLmNhbGxzW2ZdWzNdPWItMTYpLHMpe2lmKCEwIT09cy5yZXN1bWUpY29udGludWU7az1oWzNdPU1hdGgucm91bmQoYi10LTE2KSxoWzVdPW51bGx9dD1oWzZdPWItaztmb3IodmFyIHY9TWF0aC5taW4odC9qLmR1cmF0aW9uLDEpLHc9MCx4PWkubGVuZ3RoO3c8eDt3Kyspe3ZhciB6PWlbd10sQj16LmVsZW1lbnQ7aWYoZyhCKSl7dmFyIEQ9ITE7aWYoai5kaXNwbGF5IT09ZCYmbnVsbCE9PWouZGlzcGxheSYmXCJub25lXCIhPT1qLmRpc3BsYXkpe2lmKFwiZmxleFwiPT09ai5kaXNwbGF5KXt2YXIgRT1bXCItd2Via2l0LWJveFwiLFwiLW1vei1ib3hcIixcIi1tcy1mbGV4Ym94XCIsXCItd2Via2l0LWZsZXhcIl07by5lYWNoKEUsZnVuY3Rpb24oYSxiKXtBLnNldFByb3BlcnR5VmFsdWUoQixcImRpc3BsYXlcIixiKX0pfUEuc2V0UHJvcGVydHlWYWx1ZShCLFwiZGlzcGxheVwiLGouZGlzcGxheSl9ai52aXNpYmlsaXR5IT09ZCYmXCJoaWRkZW5cIiE9PWoudmlzaWJpbGl0eSYmQS5zZXRQcm9wZXJ0eVZhbHVlKEIsXCJ2aXNpYmlsaXR5XCIsai52aXNpYmlsaXR5KTtmb3IodmFyIEYgaW4geilpZih6Lmhhc093blByb3BlcnR5KEYpJiZcImVsZW1lbnRcIiE9PUYpe3ZhciBHLEg9eltGXSxJPXUuaXNTdHJpbmcoSC5lYXNpbmcpP3kuRWFzaW5nc1tILmVhc2luZ106SC5lYXNpbmc7aWYodS5pc1N0cmluZyhILnBhdHRlcm4pKXt2YXIgSj0xPT09dj9mdW5jdGlvbihhLGIsYyl7dmFyIGQ9SC5lbmRWYWx1ZVtiXTtyZXR1cm4gYz9NYXRoLnJvdW5kKGQpOmR9OmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1ILnN0YXJ0VmFsdWVbYl0sZT1ILmVuZFZhbHVlW2JdLWQsZj1kK2UqSSh2LGosZSk7cmV0dXJuIGM/TWF0aC5yb3VuZChmKTpmfTtHPUgucGF0dGVybi5yZXBsYWNlKC97KFxcZCspKCEpP30vZyxKKX1lbHNlIGlmKDE9PT12KUc9SC5lbmRWYWx1ZTtlbHNle3ZhciBLPUguZW5kVmFsdWUtSC5zdGFydFZhbHVlO0c9SC5zdGFydFZhbHVlK0sqSSh2LGosSyl9aWYoIWwmJkc9PT1ILmN1cnJlbnRWYWx1ZSljb250aW51ZTtpZihILmN1cnJlbnRWYWx1ZT1HLFwidHdlZW5cIj09PUYpcT1HO2Vsc2V7dmFyIEw7aWYoQS5Ib29rcy5yZWdpc3RlcmVkW0ZdKXtMPUEuSG9va3MuZ2V0Um9vdChGKTt2YXIgTT1nKEIpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbTF07TSYmKEgucm9vdFByb3BlcnR5VmFsdWU9TSl9dmFyIE49QS5zZXRQcm9wZXJ0eVZhbHVlKEIsRixILmN1cnJlbnRWYWx1ZSsocDw5JiYwPT09cGFyc2VGbG9hdChHKT9cIlwiOkgudW5pdFR5cGUpLEgucm9vdFByb3BlcnR5VmFsdWUsSC5zY3JvbGxEYXRhKTtBLkhvb2tzLnJlZ2lzdGVyZWRbRl0mJihBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbTF0/ZyhCKS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW0xdPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtMXShcImV4dHJhY3RcIixudWxsLE5bMV0pOmcoQikucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtMXT1OWzFdKSxcInRyYW5zZm9ybVwiPT09TlswXSYmKEQ9ITApfX1qLm1vYmlsZUhBJiZnKEIpLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkPT09ZCYmKGcoQikudHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2Q9XCIoMHB4LCAwcHgsIDBweClcIixEPSEwKSxEJiZBLmZsdXNoVHJhbnNmb3JtQ2FjaGUoQil9fWouZGlzcGxheSE9PWQmJlwibm9uZVwiIT09ai5kaXNwbGF5JiYoeS5TdGF0ZS5jYWxsc1tmXVsyXS5kaXNwbGF5PSExKSxqLnZpc2liaWxpdHkhPT1kJiZcImhpZGRlblwiIT09ai52aXNpYmlsaXR5JiYoeS5TdGF0ZS5jYWxsc1tmXVsyXS52aXNpYmlsaXR5PSExKSxqLnByb2dyZXNzJiZqLnByb2dyZXNzLmNhbGwoaFsxXSxoWzFdLHYsTWF0aC5tYXgoMCxrK2ouZHVyYXRpb24tYiksayxxKSwxPT09diYmbihmKX19eS5TdGF0ZS5pc1RpY2tpbmcmJkMobSl9ZnVuY3Rpb24gbihhLGIpe2lmKCF5LlN0YXRlLmNhbGxzW2FdKXJldHVybiExO2Zvcih2YXIgYz15LlN0YXRlLmNhbGxzW2FdWzBdLGU9eS5TdGF0ZS5jYWxsc1thXVsxXSxmPXkuU3RhdGUuY2FsbHNbYV1bMl0saD15LlN0YXRlLmNhbGxzW2FdWzRdLGk9ITEsaj0wLGs9Yy5sZW5ndGg7ajxrO2orKyl7dmFyIGw9Y1tqXS5lbGVtZW50O2J8fGYubG9vcHx8KFwibm9uZVwiPT09Zi5kaXNwbGF5JiZBLnNldFByb3BlcnR5VmFsdWUobCxcImRpc3BsYXlcIixmLmRpc3BsYXkpLFwiaGlkZGVuXCI9PT1mLnZpc2liaWxpdHkmJkEuc2V0UHJvcGVydHlWYWx1ZShsLFwidmlzaWJpbGl0eVwiLGYudmlzaWJpbGl0eSkpO3ZhciBtPWcobCk7aWYoITAhPT1mLmxvb3AmJihvLnF1ZXVlKGwpWzFdPT09ZHx8IS9cXC52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnL2kudGVzdChvLnF1ZXVlKGwpWzFdKSkmJm0pe20uaXNBbmltYXRpbmc9ITEsbS5yb290UHJvcGVydHlWYWx1ZUNhY2hlPXt9O3ZhciBuPSExO28uZWFjaChBLkxpc3RzLnRyYW5zZm9ybXMzRCxmdW5jdGlvbihhLGIpe3ZhciBjPS9ec2NhbGUvLnRlc3QoYik/MTowLGU9bS50cmFuc2Zvcm1DYWNoZVtiXTttLnRyYW5zZm9ybUNhY2hlW2JdIT09ZCYmbmV3IFJlZ0V4cChcIl5cXFxcKFwiK2MrXCJbXi5dXCIpLnRlc3QoZSkmJihuPSEwLGRlbGV0ZSBtLnRyYW5zZm9ybUNhY2hlW2JdKX0pLGYubW9iaWxlSEEmJihuPSEwLGRlbGV0ZSBtLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkKSxuJiZBLmZsdXNoVHJhbnNmb3JtQ2FjaGUobCksQS5WYWx1ZXMucmVtb3ZlQ2xhc3MobCxcInZlbG9jaXR5LWFuaW1hdGluZ1wiKX1pZighYiYmZi5jb21wbGV0ZSYmIWYubG9vcCYmaj09PWstMSl0cnl7Zi5jb21wbGV0ZS5jYWxsKGUsZSl9Y2F0Y2gocil7c2V0VGltZW91dChmdW5jdGlvbigpe3Rocm93IHJ9LDEpfWgmJiEwIT09Zi5sb29wJiZoKGUpLG0mJiEwPT09Zi5sb29wJiYhYiYmKG8uZWFjaChtLnR3ZWVuc0NvbnRhaW5lcixmdW5jdGlvbihhLGIpe2lmKC9ecm90YXRlLy50ZXN0KGEpJiYocGFyc2VGbG9hdChiLnN0YXJ0VmFsdWUpLXBhcnNlRmxvYXQoYi5lbmRWYWx1ZSkpJTM2MD09MCl7dmFyIGM9Yi5zdGFydFZhbHVlO2Iuc3RhcnRWYWx1ZT1iLmVuZFZhbHVlLGIuZW5kVmFsdWU9Y30vXmJhY2tncm91bmRQb3NpdGlvbi8udGVzdChhKSYmMTAwPT09cGFyc2VGbG9hdChiLmVuZFZhbHVlKSYmXCIlXCI9PT1iLnVuaXRUeXBlJiYoYi5lbmRWYWx1ZT0wLGIuc3RhcnRWYWx1ZT0xMDApfSkseShsLFwicmV2ZXJzZVwiLHtsb29wOiEwLGRlbGF5OmYuZGVsYXl9KSksITEhPT1mLnF1ZXVlJiZvLmRlcXVldWUobCxmLnF1ZXVlKX15LlN0YXRlLmNhbGxzW2FdPSExO2Zvcih2YXIgcD0wLHE9eS5TdGF0ZS5jYWxscy5sZW5ndGg7cDxxO3ArKylpZighMSE9PXkuU3RhdGUuY2FsbHNbcF0pe2k9ITA7YnJlYWt9ITE9PT1pJiYoeS5TdGF0ZS5pc1RpY2tpbmc9ITEsZGVsZXRlIHkuU3RhdGUuY2FsbHMseS5TdGF0ZS5jYWxscz1bXSl9dmFyIG8scD1mdW5jdGlvbigpe2lmKGMuZG9jdW1lbnRNb2RlKXJldHVybiBjLmRvY3VtZW50TW9kZTtmb3IodmFyIGE9NzthPjQ7YS0tKXt2YXIgYj1jLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7aWYoYi5pbm5lckhUTUw9XCJcXHgzYyEtLVtpZiBJRSBcIithK1wiXT48c3Bhbj48L3NwYW4+PCFbZW5kaWZdLS1cXHgzZVwiLGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzcGFuXCIpLmxlbmd0aClyZXR1cm4gYj1udWxsLGF9cmV0dXJuIGR9KCkscT1mdW5jdGlvbigpe3ZhciBhPTA7cmV0dXJuIGIud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxiLm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24oYil7dmFyIGMsZD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gYz1NYXRoLm1heCgwLDE2LShkLWEpKSxhPWQrYyxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YihkK2MpfSxjKX19KCkscj1mdW5jdGlvbigpe3ZhciBhPWIucGVyZm9ybWFuY2V8fHt9O2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGEubm93KXt2YXIgYz1hLnRpbWluZyYmYS50aW1pbmcubmF2aWdhdGlvblN0YXJ0P2EudGltaW5nLm5hdmlnYXRpb25TdGFydDoobmV3IERhdGUpLmdldFRpbWUoKTthLm5vdz1mdW5jdGlvbigpe3JldHVybihuZXcgRGF0ZSkuZ2V0VGltZSgpLWN9fXJldHVybiBhfSgpLHM9ZnVuY3Rpb24oKXt2YXIgYT1BcnJheS5wcm90b3R5cGUuc2xpY2U7dHJ5e3JldHVybiBhLmNhbGwoYy5kb2N1bWVudEVsZW1lbnQpLGF9Y2F0Y2goYil7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7dmFyIGQ9dGhpcy5sZW5ndGg7aWYoXCJudW1iZXJcIiE9dHlwZW9mIGImJihiPTApLFwibnVtYmVyXCIhPXR5cGVvZiBjJiYoYz1kKSx0aGlzLnNsaWNlKXJldHVybiBhLmNhbGwodGhpcyxiLGMpO3ZhciBlLGY9W10sZz1iPj0wP2I6TWF0aC5tYXgoMCxkK2IpLGg9YzwwP2QrYzpNYXRoLm1pbihjLGQpLGk9aC1nO2lmKGk+MClpZihmPW5ldyBBcnJheShpKSx0aGlzLmNoYXJBdClmb3IoZT0wO2U8aTtlKyspZltlXT10aGlzLmNoYXJBdChnK2UpO2Vsc2UgZm9yKGU9MDtlPGk7ZSsrKWZbZV09dGhpc1tnK2VdO3JldHVybiBmfX19KCksdD1mdW5jdGlvbigpe3JldHVybiBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXM/ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5pbmNsdWRlcyhiKX06QXJyYXkucHJvdG90eXBlLmluZGV4T2Y/ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5pbmRleE9mKGIpPj0wfTpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0wO2M8YS5sZW5ndGg7YysrKWlmKGFbY109PT1iKXJldHVybiEwO3JldHVybiExfX0sdT17aXNOdW1iZXI6ZnVuY3Rpb24oYSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGF9LGlzU3RyaW5nOmZ1bmN0aW9uKGEpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhfSxpc0FycmF5OkFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKGEpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKX0saXNGdW5jdGlvbjpmdW5jdGlvbihhKXtyZXR1cm5cIltvYmplY3QgRnVuY3Rpb25dXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSl9LGlzTm9kZTpmdW5jdGlvbihhKXtyZXR1cm4gYSYmYS5ub2RlVHlwZX0saXNXcmFwcGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhJiZhIT09YiYmdS5pc051bWJlcihhLmxlbmd0aCkmJiF1LmlzU3RyaW5nKGEpJiYhdS5pc0Z1bmN0aW9uKGEpJiYhdS5pc05vZGUoYSkmJigwPT09YS5sZW5ndGh8fHUuaXNOb2RlKGFbMF0pKX0saXNTVkc6ZnVuY3Rpb24oYSl7cmV0dXJuIGIuU1ZHRWxlbWVudCYmYSBpbnN0YW5jZW9mIGIuU1ZHRWxlbWVudH0saXNFbXB0eU9iamVjdDpmdW5jdGlvbihhKXtmb3IodmFyIGIgaW4gYSlpZihhLmhhc093blByb3BlcnR5KGIpKXJldHVybiExO3JldHVybiEwfX0sdj0hMTtpZihhLmZuJiZhLmZuLmpxdWVyeT8obz1hLHY9ITApOm89Yi5WZWxvY2l0eS5VdGlsaXRpZXMscDw9OCYmIXYpdGhyb3cgbmV3IEVycm9yKFwiVmVsb2NpdHk6IElFOCBhbmQgYmVsb3cgcmVxdWlyZSBqUXVlcnkgdG8gYmUgbG9hZGVkIGJlZm9yZSBWZWxvY2l0eS5cIik7aWYocDw9NylyZXR1cm4gdm9pZChqUXVlcnkuZm4udmVsb2NpdHk9alF1ZXJ5LmZuLmFuaW1hdGUpO3ZhciB3PTQwMCx4PVwic3dpbmdcIix5PXtTdGF0ZTp7aXNNb2JpbGU6L0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KGIubmF2aWdhdG9yLnVzZXJBZ2VudCksaXNBbmRyb2lkOi9BbmRyb2lkL2kudGVzdChiLm5hdmlnYXRvci51c2VyQWdlbnQpLGlzR2luZ2VyYnJlYWQ6L0FuZHJvaWQgMlxcLjNcXC5bMy03XS9pLnRlc3QoYi5uYXZpZ2F0b3IudXNlckFnZW50KSxpc0Nocm9tZTpiLmNocm9tZSxpc0ZpcmVmb3g6L0ZpcmVmb3gvaS50ZXN0KGIubmF2aWdhdG9yLnVzZXJBZ2VudCkscHJlZml4RWxlbWVudDpjLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikscHJlZml4TWF0Y2hlczp7fSxzY3JvbGxBbmNob3I6bnVsbCxzY3JvbGxQcm9wZXJ0eUxlZnQ6bnVsbCxzY3JvbGxQcm9wZXJ0eVRvcDpudWxsLGlzVGlja2luZzohMSxjYWxsczpbXSxkZWxheWVkRWxlbWVudHM6e2NvdW50OjB9fSxDU1M6e30sVXRpbGl0aWVzOm8sUmVkaXJlY3RzOnt9LEVhc2luZ3M6e30sUHJvbWlzZTpiLlByb21pc2UsZGVmYXVsdHM6e3F1ZXVlOlwiXCIsZHVyYXRpb246dyxlYXNpbmc6eCxiZWdpbjpkLGNvbXBsZXRlOmQscHJvZ3Jlc3M6ZCxkaXNwbGF5OmQsdmlzaWJpbGl0eTpkLGxvb3A6ITEsZGVsYXk6ITEsbW9iaWxlSEE6ITAsX2NhY2hlVmFsdWVzOiEwLHByb21pc2VSZWplY3RFbXB0eTohMH0saW5pdDpmdW5jdGlvbihhKXtvLmRhdGEoYSxcInZlbG9jaXR5XCIse2lzU1ZHOnUuaXNTVkcoYSksaXNBbmltYXRpbmc6ITEsY29tcHV0ZWRTdHlsZTpudWxsLHR3ZWVuc0NvbnRhaW5lcjpudWxsLHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGU6e30sdHJhbnNmb3JtQ2FjaGU6e319KX0saG9vazpudWxsLG1vY2s6ITEsdmVyc2lvbjp7bWFqb3I6MSxtaW5vcjo1LHBhdGNoOjJ9LGRlYnVnOiExLHRpbWVzdGFtcDohMCxwYXVzZUFsbDpmdW5jdGlvbihhKXt2YXIgYj0obmV3IERhdGUpLmdldFRpbWUoKTtvLmVhY2goeS5TdGF0ZS5jYWxscyxmdW5jdGlvbihiLGMpe2lmKGMpe2lmKGEhPT1kJiYoY1syXS5xdWV1ZSE9PWF8fCExPT09Y1syXS5xdWV1ZSkpcmV0dXJuITA7Y1s1XT17cmVzdW1lOiExfX19KSxvLmVhY2goeS5TdGF0ZS5kZWxheWVkRWxlbWVudHMsZnVuY3Rpb24oYSxjKXtjJiZoKGMsYil9KX0scmVzdW1lQWxsOmZ1bmN0aW9uKGEpe3ZhciBiPShuZXcgRGF0ZSkuZ2V0VGltZSgpO28uZWFjaCh5LlN0YXRlLmNhbGxzLGZ1bmN0aW9uKGIsYyl7aWYoYyl7aWYoYSE9PWQmJihjWzJdLnF1ZXVlIT09YXx8ITE9PT1jWzJdLnF1ZXVlKSlyZXR1cm4hMDtjWzVdJiYoY1s1XS5yZXN1bWU9ITApfX0pLG8uZWFjaCh5LlN0YXRlLmRlbGF5ZWRFbGVtZW50cyxmdW5jdGlvbihhLGMpe2MmJmkoYyxiKX0pfX07Yi5wYWdlWU9mZnNldCE9PWQ/KHkuU3RhdGUuc2Nyb2xsQW5jaG9yPWIseS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eUxlZnQ9XCJwYWdlWE9mZnNldFwiLHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlUb3A9XCJwYWdlWU9mZnNldFwiKTooeS5TdGF0ZS5zY3JvbGxBbmNob3I9Yy5kb2N1bWVudEVsZW1lbnR8fGMuYm9keS5wYXJlbnROb2RlfHxjLmJvZHkseS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eUxlZnQ9XCJzY3JvbGxMZWZ0XCIseS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eVRvcD1cInNjcm9sbFRvcFwiKTt2YXIgej1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoYSl7cmV0dXJuLWEudGVuc2lvbiphLngtYS5mcmljdGlvbiphLnZ9ZnVuY3Rpb24gYihiLGMsZCl7dmFyIGU9e3g6Yi54K2QuZHgqYyx2OmIuditkLmR2KmMsdGVuc2lvbjpiLnRlbnNpb24sZnJpY3Rpb246Yi5mcmljdGlvbn07cmV0dXJue2R4OmUudixkdjphKGUpfX1mdW5jdGlvbiBjKGMsZCl7dmFyIGU9e2R4OmMudixkdjphKGMpfSxmPWIoYywuNSpkLGUpLGc9YihjLC41KmQsZiksaD1iKGMsZCxnKSxpPTEvNiooZS5keCsyKihmLmR4K2cuZHgpK2guZHgpLGo9MS82KihlLmR2KzIqKGYuZHYrZy5kdikraC5kdik7cmV0dXJuIGMueD1jLngraSpkLGMudj1jLnYraipkLGN9cmV0dXJuIGZ1bmN0aW9uIGQoYSxiLGUpe3ZhciBmLGcsaCxpPXt4Oi0xLHY6MCx0ZW5zaW9uOm51bGwsZnJpY3Rpb246bnVsbH0saj1bMF0saz0wO2ZvcihhPXBhcnNlRmxvYXQoYSl8fDUwMCxiPXBhcnNlRmxvYXQoYil8fDIwLGU9ZXx8bnVsbCxpLnRlbnNpb249YSxpLmZyaWN0aW9uPWIsZj1udWxsIT09ZSxmPyhrPWQoYSxiKSxnPWsvZSouMDE2KTpnPS4wMTY7OylpZihoPWMoaHx8aSxnKSxqLnB1c2goMStoLngpLGsrPTE2LCEoTWF0aC5hYnMoaC54KT4xZS00JiZNYXRoLmFicyhoLnYpPjFlLTQpKWJyZWFrO3JldHVybiBmP2Z1bmN0aW9uKGEpe3JldHVybiBqW2EqKGoubGVuZ3RoLTEpfDBdfTprfX0oKTt5LkVhc2luZ3M9e2xpbmVhcjpmdW5jdGlvbihhKXtyZXR1cm4gYX0sc3dpbmc6ZnVuY3Rpb24oYSl7cmV0dXJuLjUtTWF0aC5jb3MoYSpNYXRoLlBJKS8yfSxzcHJpbmc6ZnVuY3Rpb24oYSl7cmV0dXJuIDEtTWF0aC5jb3MoNC41KmEqTWF0aC5QSSkqTWF0aC5leHAoNiotYSl9fSxvLmVhY2goW1tcImVhc2VcIixbLjI1LC4xLC4yNSwxXV0sW1wiZWFzZS1pblwiLFsuNDIsMCwxLDFdXSxbXCJlYXNlLW91dFwiLFswLDAsLjU4LDFdXSxbXCJlYXNlLWluLW91dFwiLFsuNDIsMCwuNTgsMV1dLFtcImVhc2VJblNpbmVcIixbLjQ3LDAsLjc0NSwuNzE1XV0sW1wiZWFzZU91dFNpbmVcIixbLjM5LC41NzUsLjU2NSwxXV0sW1wiZWFzZUluT3V0U2luZVwiLFsuNDQ1LC4wNSwuNTUsLjk1XV0sW1wiZWFzZUluUXVhZFwiLFsuNTUsLjA4NSwuNjgsLjUzXV0sW1wiZWFzZU91dFF1YWRcIixbLjI1LC40NiwuNDUsLjk0XV0sW1wiZWFzZUluT3V0UXVhZFwiLFsuNDU1LC4wMywuNTE1LC45NTVdXSxbXCJlYXNlSW5DdWJpY1wiLFsuNTUsLjA1NSwuNjc1LC4xOV1dLFtcImVhc2VPdXRDdWJpY1wiLFsuMjE1LC42MSwuMzU1LDFdXSxbXCJlYXNlSW5PdXRDdWJpY1wiLFsuNjQ1LC4wNDUsLjM1NSwxXV0sW1wiZWFzZUluUXVhcnRcIixbLjg5NSwuMDMsLjY4NSwuMjJdXSxbXCJlYXNlT3V0UXVhcnRcIixbLjE2NSwuODQsLjQ0LDFdXSxbXCJlYXNlSW5PdXRRdWFydFwiLFsuNzcsMCwuMTc1LDFdXSxbXCJlYXNlSW5RdWludFwiLFsuNzU1LC4wNSwuODU1LC4wNl1dLFtcImVhc2VPdXRRdWludFwiLFsuMjMsMSwuMzIsMV1dLFtcImVhc2VJbk91dFF1aW50XCIsWy44NiwwLC4wNywxXV0sW1wiZWFzZUluRXhwb1wiLFsuOTUsLjA1LC43OTUsLjAzNV1dLFtcImVhc2VPdXRFeHBvXCIsWy4xOSwxLC4yMiwxXV0sW1wiZWFzZUluT3V0RXhwb1wiLFsxLDAsMCwxXV0sW1wiZWFzZUluQ2lyY1wiLFsuNiwuMDQsLjk4LC4zMzVdXSxbXCJlYXNlT3V0Q2lyY1wiLFsuMDc1LC44MiwuMTY1LDFdXSxbXCJlYXNlSW5PdXRDaXJjXCIsWy43ODUsLjEzNSwuMTUsLjg2XV1dLGZ1bmN0aW9uKGEsYil7eS5FYXNpbmdzW2JbMF1dPWsuYXBwbHkobnVsbCxiWzFdKX0pO3ZhciBBPXkuQ1NTPXtSZWdFeDp7aXNIZXg6L14jKFtBLWZcXGRdezN9KXsxLDJ9JC9pLHZhbHVlVW53cmFwOi9eW0Etel0rXFwoKC4qKVxcKSQvaSx3cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkOi9bMC05Ll0rIFswLTkuXSsgWzAtOS5dKyggWzAtOS5dKyk/Lyx2YWx1ZVNwbGl0Oi8oW0Etel0rXFwoLitcXCkpfCgoW0EtejAtOSMtLl0rPykoPz1cXHN8JCkpL2dpfSxMaXN0czp7Y29sb3JzOltcImZpbGxcIixcInN0cm9rZVwiLFwic3RvcENvbG9yXCIsXCJjb2xvclwiLFwiYmFja2dyb3VuZENvbG9yXCIsXCJib3JkZXJDb2xvclwiLFwiYm9yZGVyVG9wQ29sb3JcIixcImJvcmRlclJpZ2h0Q29sb3JcIixcImJvcmRlckJvdHRvbUNvbG9yXCIsXCJib3JkZXJMZWZ0Q29sb3JcIixcIm91dGxpbmVDb2xvclwiXSx0cmFuc2Zvcm1zQmFzZTpbXCJ0cmFuc2xhdGVYXCIsXCJ0cmFuc2xhdGVZXCIsXCJzY2FsZVwiLFwic2NhbGVYXCIsXCJzY2FsZVlcIixcInNrZXdYXCIsXCJza2V3WVwiLFwicm90YXRlWlwiXSx0cmFuc2Zvcm1zM0Q6W1widHJhbnNmb3JtUGVyc3BlY3RpdmVcIixcInRyYW5zbGF0ZVpcIixcInNjYWxlWlwiLFwicm90YXRlWFwiLFwicm90YXRlWVwiXSx1bml0czpbXCIlXCIsXCJlbVwiLFwiZXhcIixcImNoXCIsXCJyZW1cIixcInZ3XCIsXCJ2aFwiLFwidm1pblwiLFwidm1heFwiLFwiY21cIixcIm1tXCIsXCJRXCIsXCJpblwiLFwicGNcIixcInB0XCIsXCJweFwiLFwiZGVnXCIsXCJncmFkXCIsXCJyYWRcIixcInR1cm5cIixcInNcIixcIm1zXCJdLGNvbG9yTmFtZXM6e2FsaWNlYmx1ZTpcIjI0MCwyNDgsMjU1XCIsYW50aXF1ZXdoaXRlOlwiMjUwLDIzNSwyMTVcIixhcXVhbWFyaW5lOlwiMTI3LDI1NSwyMTJcIixhcXVhOlwiMCwyNTUsMjU1XCIsYXp1cmU6XCIyNDAsMjU1LDI1NVwiLGJlaWdlOlwiMjQ1LDI0NSwyMjBcIixiaXNxdWU6XCIyNTUsMjI4LDE5NlwiLGJsYWNrOlwiMCwwLDBcIixibGFuY2hlZGFsbW9uZDpcIjI1NSwyMzUsMjA1XCIsYmx1ZXZpb2xldDpcIjEzOCw0MywyMjZcIixibHVlOlwiMCwwLDI1NVwiLGJyb3duOlwiMTY1LDQyLDQyXCIsYnVybHl3b29kOlwiMjIyLDE4NCwxMzVcIixjYWRldGJsdWU6XCI5NSwxNTgsMTYwXCIsY2hhcnRyZXVzZTpcIjEyNywyNTUsMFwiLGNob2NvbGF0ZTpcIjIxMCwxMDUsMzBcIixjb3JhbDpcIjI1NSwxMjcsODBcIixjb3JuZmxvd2VyYmx1ZTpcIjEwMCwxNDksMjM3XCIsY29ybnNpbGs6XCIyNTUsMjQ4LDIyMFwiLGNyaW1zb246XCIyMjAsMjAsNjBcIixjeWFuOlwiMCwyNTUsMjU1XCIsZGFya2JsdWU6XCIwLDAsMTM5XCIsZGFya2N5YW46XCIwLDEzOSwxMzlcIixkYXJrZ29sZGVucm9kOlwiMTg0LDEzNCwxMVwiLGRhcmtncmF5OlwiMTY5LDE2OSwxNjlcIixkYXJrZ3JleTpcIjE2OSwxNjksMTY5XCIsZGFya2dyZWVuOlwiMCwxMDAsMFwiLGRhcmtraGFraTpcIjE4OSwxODMsMTA3XCIsZGFya21hZ2VudGE6XCIxMzksMCwxMzlcIixkYXJrb2xpdmVncmVlbjpcIjg1LDEwNyw0N1wiLGRhcmtvcmFuZ2U6XCIyNTUsMTQwLDBcIixkYXJrb3JjaGlkOlwiMTUzLDUwLDIwNFwiLGRhcmtyZWQ6XCIxMzksMCwwXCIsZGFya3NhbG1vbjpcIjIzMywxNTAsMTIyXCIsZGFya3NlYWdyZWVuOlwiMTQzLDE4OCwxNDNcIixkYXJrc2xhdGVibHVlOlwiNzIsNjEsMTM5XCIsZGFya3NsYXRlZ3JheTpcIjQ3LDc5LDc5XCIsZGFya3R1cnF1b2lzZTpcIjAsMjA2LDIwOVwiLGRhcmt2aW9sZXQ6XCIxNDgsMCwyMTFcIixkZWVwcGluazpcIjI1NSwyMCwxNDdcIixkZWVwc2t5Ymx1ZTpcIjAsMTkxLDI1NVwiLGRpbWdyYXk6XCIxMDUsMTA1LDEwNVwiLGRpbWdyZXk6XCIxMDUsMTA1LDEwNVwiLGRvZGdlcmJsdWU6XCIzMCwxNDQsMjU1XCIsZmlyZWJyaWNrOlwiMTc4LDM0LDM0XCIsZmxvcmFsd2hpdGU6XCIyNTUsMjUwLDI0MFwiLGZvcmVzdGdyZWVuOlwiMzQsMTM5LDM0XCIsZnVjaHNpYTpcIjI1NSwwLDI1NVwiLGdhaW5zYm9ybzpcIjIyMCwyMjAsMjIwXCIsZ2hvc3R3aGl0ZTpcIjI0OCwyNDgsMjU1XCIsZ29sZDpcIjI1NSwyMTUsMFwiLGdvbGRlbnJvZDpcIjIxOCwxNjUsMzJcIixncmF5OlwiMTI4LDEyOCwxMjhcIixncmV5OlwiMTI4LDEyOCwxMjhcIixncmVlbnllbGxvdzpcIjE3MywyNTUsNDdcIixncmVlbjpcIjAsMTI4LDBcIixob25leWRldzpcIjI0MCwyNTUsMjQwXCIsaG90cGluazpcIjI1NSwxMDUsMTgwXCIsaW5kaWFucmVkOlwiMjA1LDkyLDkyXCIsaW5kaWdvOlwiNzUsMCwxMzBcIixpdm9yeTpcIjI1NSwyNTUsMjQwXCIsa2hha2k6XCIyNDAsMjMwLDE0MFwiLGxhdmVuZGVyYmx1c2g6XCIyNTUsMjQwLDI0NVwiLGxhdmVuZGVyOlwiMjMwLDIzMCwyNTBcIixsYXduZ3JlZW46XCIxMjQsMjUyLDBcIixsZW1vbmNoaWZmb246XCIyNTUsMjUwLDIwNVwiLGxpZ2h0Ymx1ZTpcIjE3MywyMTYsMjMwXCIsbGlnaHRjb3JhbDpcIjI0MCwxMjgsMTI4XCIsbGlnaHRjeWFuOlwiMjI0LDI1NSwyNTVcIixsaWdodGdvbGRlbnJvZHllbGxvdzpcIjI1MCwyNTAsMjEwXCIsbGlnaHRncmF5OlwiMjExLDIxMSwyMTFcIixsaWdodGdyZXk6XCIyMTEsMjExLDIxMVwiLGxpZ2h0Z3JlZW46XCIxNDQsMjM4LDE0NFwiLGxpZ2h0cGluazpcIjI1NSwxODIsMTkzXCIsbGlnaHRzYWxtb246XCIyNTUsMTYwLDEyMlwiLGxpZ2h0c2VhZ3JlZW46XCIzMiwxNzgsMTcwXCIsbGlnaHRza3libHVlOlwiMTM1LDIwNiwyNTBcIixsaWdodHNsYXRlZ3JheTpcIjExOSwxMzYsMTUzXCIsbGlnaHRzdGVlbGJsdWU6XCIxNzYsMTk2LDIyMlwiLGxpZ2h0eWVsbG93OlwiMjU1LDI1NSwyMjRcIixsaW1lZ3JlZW46XCI1MCwyMDUsNTBcIixsaW1lOlwiMCwyNTUsMFwiLGxpbmVuOlwiMjUwLDI0MCwyMzBcIixtYWdlbnRhOlwiMjU1LDAsMjU1XCIsbWFyb29uOlwiMTI4LDAsMFwiLG1lZGl1bWFxdWFtYXJpbmU6XCIxMDIsMjA1LDE3MFwiLG1lZGl1bWJsdWU6XCIwLDAsMjA1XCIsbWVkaXVtb3JjaGlkOlwiMTg2LDg1LDIxMVwiLG1lZGl1bXB1cnBsZTpcIjE0NywxMTIsMjE5XCIsbWVkaXVtc2VhZ3JlZW46XCI2MCwxNzksMTEzXCIsbWVkaXVtc2xhdGVibHVlOlwiMTIzLDEwNCwyMzhcIixtZWRpdW1zcHJpbmdncmVlbjpcIjAsMjUwLDE1NFwiLG1lZGl1bXR1cnF1b2lzZTpcIjcyLDIwOSwyMDRcIixtZWRpdW12aW9sZXRyZWQ6XCIxOTksMjEsMTMzXCIsbWlkbmlnaHRibHVlOlwiMjUsMjUsMTEyXCIsbWludGNyZWFtOlwiMjQ1LDI1NSwyNTBcIixtaXN0eXJvc2U6XCIyNTUsMjI4LDIyNVwiLG1vY2Nhc2luOlwiMjU1LDIyOCwxODFcIixuYXZham93aGl0ZTpcIjI1NSwyMjIsMTczXCIsbmF2eTpcIjAsMCwxMjhcIixvbGRsYWNlOlwiMjUzLDI0NSwyMzBcIixvbGl2ZWRyYWI6XCIxMDcsMTQyLDM1XCIsb2xpdmU6XCIxMjgsMTI4LDBcIixvcmFuZ2VyZWQ6XCIyNTUsNjksMFwiLG9yYW5nZTpcIjI1NSwxNjUsMFwiLG9yY2hpZDpcIjIxOCwxMTIsMjE0XCIscGFsZWdvbGRlbnJvZDpcIjIzOCwyMzIsMTcwXCIscGFsZWdyZWVuOlwiMTUyLDI1MSwxNTJcIixwYWxldHVycXVvaXNlOlwiMTc1LDIzOCwyMzhcIixwYWxldmlvbGV0cmVkOlwiMjE5LDExMiwxNDdcIixwYXBheWF3aGlwOlwiMjU1LDIzOSwyMTNcIixwZWFjaHB1ZmY6XCIyNTUsMjE4LDE4NVwiLHBlcnU6XCIyMDUsMTMzLDYzXCIscGluazpcIjI1NSwxOTIsMjAzXCIscGx1bTpcIjIyMSwxNjAsMjIxXCIscG93ZGVyYmx1ZTpcIjE3NiwyMjQsMjMwXCIscHVycGxlOlwiMTI4LDAsMTI4XCIscmVkOlwiMjU1LDAsMFwiLHJvc3licm93bjpcIjE4OCwxNDMsMTQzXCIscm95YWxibHVlOlwiNjUsMTA1LDIyNVwiLHNhZGRsZWJyb3duOlwiMTM5LDY5LDE5XCIsc2FsbW9uOlwiMjUwLDEyOCwxMTRcIixzYW5keWJyb3duOlwiMjQ0LDE2NCw5NlwiLHNlYWdyZWVuOlwiNDYsMTM5LDg3XCIsc2Vhc2hlbGw6XCIyNTUsMjQ1LDIzOFwiLHNpZW5uYTpcIjE2MCw4Miw0NVwiLHNpbHZlcjpcIjE5MiwxOTIsMTkyXCIsc2t5Ymx1ZTpcIjEzNSwyMDYsMjM1XCIsc2xhdGVibHVlOlwiMTA2LDkwLDIwNVwiLHNsYXRlZ3JheTpcIjExMiwxMjgsMTQ0XCIsc25vdzpcIjI1NSwyNTAsMjUwXCIsc3ByaW5nZ3JlZW46XCIwLDI1NSwxMjdcIixzdGVlbGJsdWU6XCI3MCwxMzAsMTgwXCIsdGFuOlwiMjEwLDE4MCwxNDBcIix0ZWFsOlwiMCwxMjgsMTI4XCIsdGhpc3RsZTpcIjIxNiwxOTEsMjE2XCIsdG9tYXRvOlwiMjU1LDk5LDcxXCIsdHVycXVvaXNlOlwiNjQsMjI0LDIwOFwiLHZpb2xldDpcIjIzOCwxMzAsMjM4XCIsd2hlYXQ6XCIyNDUsMjIyLDE3OVwiLHdoaXRlc21va2U6XCIyNDUsMjQ1LDI0NVwiLHdoaXRlOlwiMjU1LDI1NSwyNTVcIix5ZWxsb3dncmVlbjpcIjE1NCwyMDUsNTBcIix5ZWxsb3c6XCIyNTUsMjU1LDBcIn19LEhvb2tzOnt0ZW1wbGF0ZXM6e3RleHRTaGFkb3c6W1wiQ29sb3IgWCBZIEJsdXJcIixcImJsYWNrIDBweCAwcHggMHB4XCJdLGJveFNoYWRvdzpbXCJDb2xvciBYIFkgQmx1ciBTcHJlYWRcIixcImJsYWNrIDBweCAwcHggMHB4IDBweFwiXSxjbGlwOltcIlRvcCBSaWdodCBCb3R0b20gTGVmdFwiLFwiMHB4IDBweCAwcHggMHB4XCJdLGJhY2tncm91bmRQb3NpdGlvbjpbXCJYIFlcIixcIjAlIDAlXCJdLHRyYW5zZm9ybU9yaWdpbjpbXCJYIFkgWlwiLFwiNTAlIDUwJSAwcHhcIl0scGVyc3BlY3RpdmVPcmlnaW46W1wiWCBZXCIsXCI1MCUgNTAlXCJdfSxyZWdpc3RlcmVkOnt9LHJlZ2lzdGVyOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7YTxBLkxpc3RzLmNvbG9ycy5sZW5ndGg7YSsrKXt2YXIgYj1cImNvbG9yXCI9PT1BLkxpc3RzLmNvbG9yc1thXT9cIjAgMCAwIDFcIjpcIjI1NSAyNTUgMjU1IDFcIjtBLkhvb2tzLnRlbXBsYXRlc1tBLkxpc3RzLmNvbG9yc1thXV09W1wiUmVkIEdyZWVuIEJsdWUgQWxwaGFcIixiXX12YXIgYyxkLGU7aWYocClmb3IoYyBpbiBBLkhvb2tzLnRlbXBsYXRlcylpZihBLkhvb2tzLnRlbXBsYXRlcy5oYXNPd25Qcm9wZXJ0eShjKSl7ZD1BLkhvb2tzLnRlbXBsYXRlc1tjXSxlPWRbMF0uc3BsaXQoXCIgXCIpO3ZhciBmPWRbMV0ubWF0Y2goQS5SZWdFeC52YWx1ZVNwbGl0KTtcIkNvbG9yXCI9PT1lWzBdJiYoZS5wdXNoKGUuc2hpZnQoKSksZi5wdXNoKGYuc2hpZnQoKSksQS5Ib29rcy50ZW1wbGF0ZXNbY109W2Uuam9pbihcIiBcIiksZi5qb2luKFwiIFwiKV0pfWZvcihjIGluIEEuSG9va3MudGVtcGxhdGVzKWlmKEEuSG9va3MudGVtcGxhdGVzLmhhc093blByb3BlcnR5KGMpKXtkPUEuSG9va3MudGVtcGxhdGVzW2NdLGU9ZFswXS5zcGxpdChcIiBcIik7Zm9yKHZhciBnIGluIGUpaWYoZS5oYXNPd25Qcm9wZXJ0eShnKSl7dmFyIGg9YytlW2ddLGk9ZztBLkhvb2tzLnJlZ2lzdGVyZWRbaF09W2MsaV19fX0sZ2V0Um9vdDpmdW5jdGlvbihhKXt2YXIgYj1BLkhvb2tzLnJlZ2lzdGVyZWRbYV07cmV0dXJuIGI/YlswXTphfSxnZXRVbml0OmZ1bmN0aW9uKGEsYil7dmFyIGM9KGEuc3Vic3RyKGJ8fDAsNSkubWF0Y2goL15bYS16JV0rLyl8fFtdKVswXXx8XCJcIjtyZXR1cm4gYyYmdChBLkxpc3RzLnVuaXRzLGMpP2M6XCJcIn0sZml4Q29sb3JzOmZ1bmN0aW9uKGEpe3JldHVybiBhLnJlcGxhY2UoLyhyZ2JhP1xcKFxccyopPyhcXGJbYS16XStcXGIpL2csZnVuY3Rpb24oYSxiLGMpe3JldHVybiBBLkxpc3RzLmNvbG9yTmFtZXMuaGFzT3duUHJvcGVydHkoYyk/KGJ8fFwicmdiYShcIikrQS5MaXN0cy5jb2xvck5hbWVzW2NdKyhiP1wiXCI6XCIsMSlcIik6YitjfSl9LGNsZWFuUm9vdFByb3BlcnR5VmFsdWU6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gQS5SZWdFeC52YWx1ZVVud3JhcC50ZXN0KGIpJiYoYj1iLm1hdGNoKEEuUmVnRXgudmFsdWVVbndyYXApWzFdKSxBLlZhbHVlcy5pc0NTU051bGxWYWx1ZShiKSYmKGI9QS5Ib29rcy50ZW1wbGF0ZXNbYV1bMV0pLGJ9LGV4dHJhY3RWYWx1ZTpmdW5jdGlvbihhLGIpe3ZhciBjPUEuSG9va3MucmVnaXN0ZXJlZFthXTtpZihjKXt2YXIgZD1jWzBdLGU9Y1sxXTtyZXR1cm4gYj1BLkhvb2tzLmNsZWFuUm9vdFByb3BlcnR5VmFsdWUoZCxiKSxiLnRvU3RyaW5nKCkubWF0Y2goQS5SZWdFeC52YWx1ZVNwbGl0KVtlXX1yZXR1cm4gYn0saW5qZWN0VmFsdWU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPUEuSG9va3MucmVnaXN0ZXJlZFthXTtpZihkKXt2YXIgZSxmPWRbMF0sZz1kWzFdO3JldHVybiBjPUEuSG9va3MuY2xlYW5Sb290UHJvcGVydHlWYWx1ZShmLGMpLGU9Yy50b1N0cmluZygpLm1hdGNoKEEuUmVnRXgudmFsdWVTcGxpdCksZVtnXT1iLGUuam9pbihcIiBcIil9cmV0dXJuIGN9fSxOb3JtYWxpemF0aW9uczp7cmVnaXN0ZXJlZDp7Y2xpcDpmdW5jdGlvbihhLGIsYyl7c3dpdGNoKGEpe2Nhc2VcIm5hbWVcIjpyZXR1cm5cImNsaXBcIjtjYXNlXCJleHRyYWN0XCI6dmFyIGQ7cmV0dXJuIEEuUmVnRXgud3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZC50ZXN0KGMpP2Q9YzooZD1jLnRvU3RyaW5nKCkubWF0Y2goQS5SZWdFeC52YWx1ZVVud3JhcCksZD1kP2RbMV0ucmVwbGFjZSgvLChcXHMrKT8vZyxcIiBcIik6YyksZDtjYXNlXCJpbmplY3RcIjpyZXR1cm5cInJlY3QoXCIrYytcIilcIn19LGJsdXI6ZnVuY3Rpb24oYSxiLGMpe3N3aXRjaChhKXtjYXNlXCJuYW1lXCI6cmV0dXJuIHkuU3RhdGUuaXNGaXJlZm94P1wiZmlsdGVyXCI6XCItd2Via2l0LWZpbHRlclwiO2Nhc2VcImV4dHJhY3RcIjp2YXIgZD1wYXJzZUZsb2F0KGMpO2lmKCFkJiYwIT09ZCl7dmFyIGU9Yy50b1N0cmluZygpLm1hdGNoKC9ibHVyXFwoKFswLTldK1tBLXpdKylcXCkvaSk7ZD1lP2VbMV06MH1yZXR1cm4gZDtjYXNlXCJpbmplY3RcIjpyZXR1cm4gcGFyc2VGbG9hdChjKT9cImJsdXIoXCIrYytcIilcIjpcIm5vbmVcIn19LG9wYWNpdHk6ZnVuY3Rpb24oYSxiLGMpe2lmKHA8PTgpc3dpdGNoKGEpe2Nhc2VcIm5hbWVcIjpyZXR1cm5cImZpbHRlclwiO2Nhc2VcImV4dHJhY3RcIjp2YXIgZD1jLnRvU3RyaW5nKCkubWF0Y2goL2FscGhhXFwob3BhY2l0eT0oLiopXFwpL2kpO3JldHVybiBjPWQ/ZFsxXS8xMDA6MTtjYXNlXCJpbmplY3RcIjpyZXR1cm4gYi5zdHlsZS56b29tPTEscGFyc2VGbG9hdChjKT49MT9cIlwiOlwiYWxwaGEob3BhY2l0eT1cIitwYXJzZUludCgxMDAqcGFyc2VGbG9hdChjKSwxMCkrXCIpXCJ9ZWxzZSBzd2l0Y2goYSl7Y2FzZVwibmFtZVwiOnJldHVyblwib3BhY2l0eVwiO2Nhc2VcImV4dHJhY3RcIjpjYXNlXCJpbmplY3RcIjpyZXR1cm4gY319fSxyZWdpc3RlcjpmdW5jdGlvbigpe2Z1bmN0aW9uIGEoYSxiLGMpe2lmKFwiYm9yZGVyLWJveFwiPT09QS5nZXRQcm9wZXJ0eVZhbHVlKGIsXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpPT09KGN8fCExKSl7dmFyIGQsZSxmPTAsZz1cIndpZHRoXCI9PT1hP1tcIkxlZnRcIixcIlJpZ2h0XCJdOltcIlRvcFwiLFwiQm90dG9tXCJdLGg9W1wicGFkZGluZ1wiK2dbMF0sXCJwYWRkaW5nXCIrZ1sxXSxcImJvcmRlclwiK2dbMF0rXCJXaWR0aFwiLFwiYm9yZGVyXCIrZ1sxXStcIldpZHRoXCJdO2ZvcihkPTA7ZDxoLmxlbmd0aDtkKyspZT1wYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShiLGhbZF0pKSxpc05hTihlKXx8KGYrPWUpO3JldHVybiBjPy1mOmZ9cmV0dXJuIDB9ZnVuY3Rpb24gYihiLGMpe3JldHVybiBmdW5jdGlvbihkLGUsZil7c3dpdGNoKGQpe2Nhc2VcIm5hbWVcIjpyZXR1cm4gYjtjYXNlXCJleHRyYWN0XCI6cmV0dXJuIHBhcnNlRmxvYXQoZikrYShiLGUsYyk7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuIHBhcnNlRmxvYXQoZiktYShiLGUsYykrXCJweFwifX19cCYmIShwPjkpfHx5LlN0YXRlLmlzR2luZ2VyYnJlYWR8fChBLkxpc3RzLnRyYW5zZm9ybXNCYXNlPUEuTGlzdHMudHJhbnNmb3Jtc0Jhc2UuY29uY2F0KEEuTGlzdHMudHJhbnNmb3JtczNEKSk7Zm9yKHZhciBjPTA7YzxBLkxpc3RzLnRyYW5zZm9ybXNCYXNlLmxlbmd0aDtjKyspIWZ1bmN0aW9uKCl7dmFyIGE9QS5MaXN0cy50cmFuc2Zvcm1zQmFzZVtjXTtBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbYV09ZnVuY3Rpb24oYixjLGUpe3N3aXRjaChiKXtjYXNlXCJuYW1lXCI6cmV0dXJuXCJ0cmFuc2Zvcm1cIjtjYXNlXCJleHRyYWN0XCI6cmV0dXJuIGcoYyk9PT1kfHxnKGMpLnRyYW5zZm9ybUNhY2hlW2FdPT09ZD8vXnNjYWxlL2kudGVzdChhKT8xOjA6ZyhjKS50cmFuc2Zvcm1DYWNoZVthXS5yZXBsYWNlKC9bKCldL2csXCJcIik7Y2FzZVwiaW5qZWN0XCI6dmFyIGY9ITE7c3dpdGNoKGEuc3Vic3RyKDAsYS5sZW5ndGgtMSkpe2Nhc2VcInRyYW5zbGF0ZVwiOmY9IS8oJXxweHxlbXxyZW18dnd8dmh8XFxkKSQvaS50ZXN0KGUpO2JyZWFrO2Nhc2VcInNjYWxcIjpjYXNlXCJzY2FsZVwiOnkuU3RhdGUuaXNBbmRyb2lkJiZnKGMpLnRyYW5zZm9ybUNhY2hlW2FdPT09ZCYmZTwxJiYoZT0xKSxmPSEvKFxcZCkkL2kudGVzdChlKTticmVhaztjYXNlXCJza2V3XCI6Y2FzZVwicm90YXRlXCI6Zj0hLyhkZWd8XFxkKSQvaS50ZXN0KGUpfXJldHVybiBmfHwoZyhjKS50cmFuc2Zvcm1DYWNoZVthXT1cIihcIitlK1wiKVwiKSxnKGMpLnRyYW5zZm9ybUNhY2hlW2FdfX19KCk7Zm9yKHZhciBlPTA7ZTxBLkxpc3RzLmNvbG9ycy5sZW5ndGg7ZSsrKSFmdW5jdGlvbigpe3ZhciBhPUEuTGlzdHMuY29sb3JzW2VdO0EuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFthXT1mdW5jdGlvbihiLGMsZSl7c3dpdGNoKGIpe2Nhc2VcIm5hbWVcIjpyZXR1cm4gYTtjYXNlXCJleHRyYWN0XCI6dmFyIGY7aWYoQS5SZWdFeC53cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkLnRlc3QoZSkpZj1lO2Vsc2V7dmFyIGcsaD17YmxhY2s6XCJyZ2IoMCwgMCwgMClcIixibHVlOlwicmdiKDAsIDAsIDI1NSlcIixncmF5OlwicmdiKDEyOCwgMTI4LCAxMjgpXCIsZ3JlZW46XCJyZ2IoMCwgMTI4LCAwKVwiLHJlZDpcInJnYigyNTUsIDAsIDApXCIsd2hpdGU6XCJyZ2IoMjU1LCAyNTUsIDI1NSlcIn07L15bQS16XSskL2kudGVzdChlKT9nPWhbZV0hPT1kP2hbZV06aC5ibGFjazpBLlJlZ0V4LmlzSGV4LnRlc3QoZSk/Zz1cInJnYihcIitBLlZhbHVlcy5oZXhUb1JnYihlKS5qb2luKFwiIFwiKStcIilcIjovXnJnYmE/XFwoL2kudGVzdChlKXx8KGc9aC5ibGFjayksZj0oZ3x8ZSkudG9TdHJpbmcoKS5tYXRjaChBLlJlZ0V4LnZhbHVlVW53cmFwKVsxXS5yZXBsYWNlKC8sKFxccyspPy9nLFwiIFwiKX1yZXR1cm4oIXB8fHA+OCkmJjM9PT1mLnNwbGl0KFwiIFwiKS5sZW5ndGgmJihmKz1cIiAxXCIpLGY7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuL15yZ2IvLnRlc3QoZSk/ZToocDw9OD80PT09ZS5zcGxpdChcIiBcIikubGVuZ3RoJiYoZT1lLnNwbGl0KC9cXHMrLykuc2xpY2UoMCwzKS5qb2luKFwiIFwiKSk6Mz09PWUuc3BsaXQoXCIgXCIpLmxlbmd0aCYmKGUrPVwiIDFcIiksKHA8PTg/XCJyZ2JcIjpcInJnYmFcIikrXCIoXCIrZS5yZXBsYWNlKC9cXHMrL2csXCIsXCIpLnJlcGxhY2UoL1xcLihcXGQpKyg/PSwpL2csXCJcIikrXCIpXCIpfX19KCk7QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkLmlubmVyV2lkdGg9YihcIndpZHRoXCIsITApLEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5pbm5lckhlaWdodD1iKFwiaGVpZ2h0XCIsITApLEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5vdXRlcldpZHRoPWIoXCJ3aWR0aFwiKSxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQub3V0ZXJIZWlnaHQ9YihcImhlaWdodFwiKX19LE5hbWVzOntjYW1lbENhc2U6ZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVwbGFjZSgvLShcXHcpL2csZnVuY3Rpb24oYSxiKXtyZXR1cm4gYi50b1VwcGVyQ2FzZSgpfSl9LFNWR0F0dHJpYnV0ZTpmdW5jdGlvbihhKXt2YXIgYj1cIndpZHRofGhlaWdodHx4fHl8Y3h8Y3l8cnxyeHxyeXx4MXx4Mnx5MXx5MlwiO3JldHVybihwfHx5LlN0YXRlLmlzQW5kcm9pZCYmIXkuU3RhdGUuaXNDaHJvbWUpJiYoYis9XCJ8dHJhbnNmb3JtXCIpLG5ldyBSZWdFeHAoXCJeKFwiK2IrXCIpJFwiLFwiaVwiKS50ZXN0KGEpfSxwcmVmaXhDaGVjazpmdW5jdGlvbihhKXtpZih5LlN0YXRlLnByZWZpeE1hdGNoZXNbYV0pcmV0dXJuW3kuU3RhdGUucHJlZml4TWF0Y2hlc1thXSwhMF07Zm9yKHZhciBiPVtcIlwiLFwiV2Via2l0XCIsXCJNb3pcIixcIm1zXCIsXCJPXCJdLGM9MCxkPWIubGVuZ3RoO2M8ZDtjKyspe3ZhciBlO2lmKGU9MD09PWM/YTpiW2NdK2EucmVwbGFjZSgvXlxcdy8sZnVuY3Rpb24oYSl7cmV0dXJuIGEudG9VcHBlckNhc2UoKX0pLHUuaXNTdHJpbmcoeS5TdGF0ZS5wcmVmaXhFbGVtZW50LnN0eWxlW2VdKSlyZXR1cm4geS5TdGF0ZS5wcmVmaXhNYXRjaGVzW2FdPWUsW2UsITBdfXJldHVyblthLCExXX19LFZhbHVlczp7aGV4VG9SZ2I6ZnVuY3Rpb24oYSl7dmFyIGIsYz0vXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pLGQ9L14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaTtyZXR1cm4gYT1hLnJlcGxhY2UoYyxmdW5jdGlvbihhLGIsYyxkKXtyZXR1cm4gYitiK2MrYytkK2R9KSxiPWQuZXhlYyhhKSxiP1twYXJzZUludChiWzFdLDE2KSxwYXJzZUludChiWzJdLDE2KSxwYXJzZUludChiWzNdLDE2KV06WzAsMCwwXX0saXNDU1NOdWxsVmFsdWU6ZnVuY3Rpb24oYSl7cmV0dXJuIWF8fC9eKG5vbmV8YXV0b3x0cmFuc3BhcmVudHwocmdiYVxcKDAsID8wLCA/MCwgPzBcXCkpKSQvaS50ZXN0KGEpfSxnZXRVbml0VHlwZTpmdW5jdGlvbihhKXtyZXR1cm4vXihyb3RhdGV8c2tldykvaS50ZXN0KGEpP1wiZGVnXCI6LyheKHNjYWxlfHNjYWxlWHxzY2FsZVl8c2NhbGVafGFscGhhfGZsZXhHcm93fGZsZXhIZWlnaHR8ekluZGV4fGZvbnRXZWlnaHQpJCl8KChvcGFjaXR5fHJlZHxncmVlbnxibHVlfGFscGhhKSQpL2kudGVzdChhKT9cIlwiOlwicHhcIn0sZ2V0RGlzcGxheVR5cGU6ZnVuY3Rpb24oYSl7dmFyIGI9YSYmYS50YWdOYW1lLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtyZXR1cm4vXihifGJpZ3xpfHNtYWxsfHR0fGFiYnJ8YWNyb255bXxjaXRlfGNvZGV8ZGZufGVtfGtiZHxzdHJvbmd8c2FtcHx2YXJ8YXxiZG98YnJ8aW1nfG1hcHxvYmplY3R8cXxzY3JpcHR8c3BhbnxzdWJ8c3VwfGJ1dHRvbnxpbnB1dHxsYWJlbHxzZWxlY3R8dGV4dGFyZWEpJC9pLnRlc3QoYik/XCJpbmxpbmVcIjovXihsaSkkL2kudGVzdChiKT9cImxpc3QtaXRlbVwiOi9eKHRyKSQvaS50ZXN0KGIpP1widGFibGUtcm93XCI6L14odGFibGUpJC9pLnRlc3QoYik/XCJ0YWJsZVwiOi9eKHRib2R5KSQvaS50ZXN0KGIpP1widGFibGUtcm93LWdyb3VwXCI6XCJibG9ja1wifSxhZGRDbGFzczpmdW5jdGlvbihhLGIpe2lmKGEpaWYoYS5jbGFzc0xpc3QpYS5jbGFzc0xpc3QuYWRkKGIpO2Vsc2UgaWYodS5pc1N0cmluZyhhLmNsYXNzTmFtZSkpYS5jbGFzc05hbWUrPShhLmNsYXNzTmFtZS5sZW5ndGg/XCIgXCI6XCJcIikrYjtlbHNle3ZhciBjPWEuZ2V0QXR0cmlidXRlKHA8PTc/XCJjbGFzc05hbWVcIjpcImNsYXNzXCIpfHxcIlwiO2Euc2V0QXR0cmlidXRlKFwiY2xhc3NcIixjKyhjP1wiIFwiOlwiXCIpK2IpfX0scmVtb3ZlQ2xhc3M6ZnVuY3Rpb24oYSxiKXtpZihhKWlmKGEuY2xhc3NMaXN0KWEuY2xhc3NMaXN0LnJlbW92ZShiKTtlbHNlIGlmKHUuaXNTdHJpbmcoYS5jbGFzc05hbWUpKWEuY2xhc3NOYW1lPWEuY2xhc3NOYW1lLnRvU3RyaW5nKCkucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxcXHMpXCIrYi5zcGxpdChcIiBcIikuam9pbihcInxcIikrXCIoXFxcXHN8JClcIixcImdpXCIpLFwiIFwiKTtlbHNle3ZhciBjPWEuZ2V0QXR0cmlidXRlKHA8PTc/XCJjbGFzc05hbWVcIjpcImNsYXNzXCIpfHxcIlwiO2Euc2V0QXR0cmlidXRlKFwiY2xhc3NcIixjLnJlcGxhY2UobmV3IFJlZ0V4cChcIihefHMpXCIrYi5zcGxpdChcIiBcIikuam9pbihcInxcIikrXCIoc3wkKVwiLFwiZ2lcIiksXCIgXCIpKX19fSxnZXRQcm9wZXJ0eVZhbHVlOmZ1bmN0aW9uKGEsYyxlLGYpe2Z1bmN0aW9uIGgoYSxjKXt2YXIgZT0wO2lmKHA8PTgpZT1vLmNzcyhhLGMpO2Vsc2V7dmFyIGk9ITE7L14od2lkdGh8aGVpZ2h0KSQvLnRlc3QoYykmJjA9PT1BLmdldFByb3BlcnR5VmFsdWUoYSxcImRpc3BsYXlcIikmJihpPSEwLEEuc2V0UHJvcGVydHlWYWx1ZShhLFwiZGlzcGxheVwiLEEuVmFsdWVzLmdldERpc3BsYXlUeXBlKGEpKSk7dmFyIGo9ZnVuY3Rpb24oKXtpJiZBLnNldFByb3BlcnR5VmFsdWUoYSxcImRpc3BsYXlcIixcIm5vbmVcIil9O2lmKCFmKXtpZihcImhlaWdodFwiPT09YyYmXCJib3JkZXItYm94XCIhPT1BLmdldFByb3BlcnR5VmFsdWUoYSxcImJveFNpemluZ1wiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpe3ZhciBrPWEub2Zmc2V0SGVpZ2h0LShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm9yZGVyVG9wV2lkdGhcIikpfHwwKS0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcImJvcmRlckJvdHRvbVdpZHRoXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJwYWRkaW5nVG9wXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJwYWRkaW5nQm90dG9tXCIpKXx8MCk7cmV0dXJuIGooKSxrfWlmKFwid2lkdGhcIj09PWMmJlwiYm9yZGVyLWJveFwiIT09QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKXt2YXIgbD1hLm9mZnNldFdpZHRoLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm9yZGVyTGVmdFdpZHRoXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3JkZXJSaWdodFdpZHRoXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJwYWRkaW5nTGVmdFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicGFkZGluZ1JpZ2h0XCIpKXx8MCk7cmV0dXJuIGooKSxsfX12YXIgbTttPWcoYSk9PT1kP2IuZ2V0Q29tcHV0ZWRTdHlsZShhLG51bGwpOmcoYSkuY29tcHV0ZWRTdHlsZT9nKGEpLmNvbXB1dGVkU3R5bGU6ZyhhKS5jb21wdXRlZFN0eWxlPWIuZ2V0Q29tcHV0ZWRTdHlsZShhLG51bGwpLFwiYm9yZGVyQ29sb3JcIj09PWMmJihjPVwiYm9yZGVyVG9wQ29sb3JcIiksZT05PT09cCYmXCJmaWx0ZXJcIj09PWM/bS5nZXRQcm9wZXJ0eVZhbHVlKGMpOm1bY10sXCJcIiE9PWUmJm51bGwhPT1lfHwoZT1hLnN0eWxlW2NdKSxqKCl9aWYoXCJhdXRvXCI9PT1lJiYvXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC9pLnRlc3QoYykpe3ZhciBuPWgoYSxcInBvc2l0aW9uXCIpOyhcImZpeGVkXCI9PT1ufHxcImFic29sdXRlXCI9PT1uJiYvdG9wfGxlZnQvaS50ZXN0KGMpKSYmKGU9byhhKS5wb3NpdGlvbigpW2NdK1wicHhcIil9cmV0dXJuIGV9dmFyIGk7aWYoQS5Ib29rcy5yZWdpc3RlcmVkW2NdKXt2YXIgaj1jLGs9QS5Ib29rcy5nZXRSb290KGopO2U9PT1kJiYoZT1BLmdldFByb3BlcnR5VmFsdWUoYSxBLk5hbWVzLnByZWZpeENoZWNrKGspWzBdKSksQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2tdJiYoZT1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRba10oXCJleHRyYWN0XCIsYSxlKSksaT1BLkhvb2tzLmV4dHJhY3RWYWx1ZShqLGUpfWVsc2UgaWYoQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKXt2YXIgbCxtO2w9QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwibmFtZVwiLGEpLFwidHJhbnNmb3JtXCIhPT1sJiYobT1oKGEsQS5OYW1lcy5wcmVmaXhDaGVjayhsKVswXSksQS5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUobSkmJkEuSG9va3MudGVtcGxhdGVzW2NdJiYobT1BLkhvb2tzLnRlbXBsYXRlc1tjXVsxXSkpLGk9QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwiZXh0cmFjdFwiLGEsbSl9aWYoIS9eW1xcZC1dLy50ZXN0KGkpKXt2YXIgbj1nKGEpO2lmKG4mJm4uaXNTVkcmJkEuTmFtZXMuU1ZHQXR0cmlidXRlKGMpKWlmKC9eKGhlaWdodHx3aWR0aCkkL2kudGVzdChjKSl0cnl7aT1hLmdldEJCb3goKVtjXX1jYXRjaChxKXtpPTB9ZWxzZSBpPWEuZ2V0QXR0cmlidXRlKGMpO2Vsc2UgaT1oKGEsQS5OYW1lcy5wcmVmaXhDaGVjayhjKVswXSl9cmV0dXJuIEEuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKGkpJiYoaT0wKSx5LmRlYnVnPj0yJiZjb25zb2xlLmxvZyhcIkdldCBcIitjK1wiOiBcIitpKSxpfSxzZXRQcm9wZXJ0eVZhbHVlOmZ1bmN0aW9uKGEsYyxkLGUsZil7dmFyIGg9YztpZihcInNjcm9sbFwiPT09YylmLmNvbnRhaW5lcj9mLmNvbnRhaW5lcltcInNjcm9sbFwiK2YuZGlyZWN0aW9uXT1kOlwiTGVmdFwiPT09Zi5kaXJlY3Rpb24/Yi5zY3JvbGxUbyhkLGYuYWx0ZXJuYXRlVmFsdWUpOmIuc2Nyb2xsVG8oZi5hbHRlcm5hdGVWYWx1ZSxkKTtlbHNlIGlmKEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXSYmXCJ0cmFuc2Zvcm1cIj09PUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcIm5hbWVcIixhKSlBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJpbmplY3RcIixhLGQpLGg9XCJ0cmFuc2Zvcm1cIixkPWcoYSkudHJhbnNmb3JtQ2FjaGVbY107ZWxzZXtpZihBLkhvb2tzLnJlZ2lzdGVyZWRbY10pe3ZhciBpPWMsaj1BLkhvb2tzLmdldFJvb3QoYyk7ZT1lfHxBLmdldFByb3BlcnR5VmFsdWUoYSxqKSxkPUEuSG9va3MuaW5qZWN0VmFsdWUoaSxkLGUpLGM9an1pZihBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10mJihkPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcImluamVjdFwiLGEsZCksYz1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJuYW1lXCIsYSkpLGg9QS5OYW1lcy5wcmVmaXhDaGVjayhjKVswXSxwPD04KXRyeXthLnN0eWxlW2hdPWR9Y2F0Y2gobCl7eS5kZWJ1ZyYmY29uc29sZS5sb2coXCJCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgW1wiK2QrXCJdIGZvciBbXCIraCtcIl1cIil9ZWxzZXt2YXIgaz1nKGEpO2smJmsuaXNTVkcmJkEuTmFtZXMuU1ZHQXR0cmlidXRlKGMpP2Euc2V0QXR0cmlidXRlKGMsZCk6YS5zdHlsZVtoXT1kfXkuZGVidWc+PTImJmNvbnNvbGUubG9nKFwiU2V0IFwiK2MrXCIgKFwiK2grXCIpOiBcIitkKX1yZXR1cm5baCxkXX0sZmx1c2hUcmFuc2Zvcm1DYWNoZTpmdW5jdGlvbihhKXt2YXIgYj1cIlwiLGM9ZyhhKTtpZigocHx8eS5TdGF0ZS5pc0FuZHJvaWQmJiF5LlN0YXRlLmlzQ2hyb21lKSYmYyYmYy5pc1NWRyl7dmFyIGQ9ZnVuY3Rpb24oYil7cmV0dXJuIHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsYikpfSxlPXt0cmFuc2xhdGU6W2QoXCJ0cmFuc2xhdGVYXCIpLGQoXCJ0cmFuc2xhdGVZXCIpXSxza2V3WDpbZChcInNrZXdYXCIpXSxza2V3WTpbZChcInNrZXdZXCIpXSxzY2FsZToxIT09ZChcInNjYWxlXCIpP1tkKFwic2NhbGVcIiksZChcInNjYWxlXCIpXTpbZChcInNjYWxlWFwiKSxkKFwic2NhbGVZXCIpXSxyb3RhdGU6W2QoXCJyb3RhdGVaXCIpLDAsMF19O28uZWFjaChnKGEpLnRyYW5zZm9ybUNhY2hlLGZ1bmN0aW9uKGEpey9edHJhbnNsYXRlL2kudGVzdChhKT9hPVwidHJhbnNsYXRlXCI6L15zY2FsZS9pLnRlc3QoYSk/YT1cInNjYWxlXCI6L15yb3RhdGUvaS50ZXN0KGEpJiYoYT1cInJvdGF0ZVwiKSxlW2FdJiYoYis9YStcIihcIitlW2FdLmpvaW4oXCIgXCIpK1wiKSBcIixkZWxldGUgZVthXSl9KX1lbHNle3ZhciBmLGg7by5lYWNoKGcoYSkudHJhbnNmb3JtQ2FjaGUsZnVuY3Rpb24oYyl7aWYoZj1nKGEpLnRyYW5zZm9ybUNhY2hlW2NdLFwidHJhbnNmb3JtUGVyc3BlY3RpdmVcIj09PWMpcmV0dXJuIGg9ZiwhMDs5PT09cCYmXCJyb3RhdGVaXCI9PT1jJiYoYz1cInJvdGF0ZVwiKSxiKz1jK2YrXCIgXCJ9KSxoJiYoYj1cInBlcnNwZWN0aXZlXCIraCtcIiBcIitiKX1BLnNldFByb3BlcnR5VmFsdWUoYSxcInRyYW5zZm9ybVwiLGIpfX07QS5Ib29rcy5yZWdpc3RlcigpLEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXIoKSx5Lmhvb2s9ZnVuY3Rpb24oYSxiLGMpe3ZhciBlO3JldHVybiBhPWYoYSksby5lYWNoKGEsZnVuY3Rpb24oYSxmKXtpZihnKGYpPT09ZCYmeS5pbml0KGYpLGM9PT1kKWU9PT1kJiYoZT1BLmdldFByb3BlcnR5VmFsdWUoZixiKSk7ZWxzZXt2YXIgaD1BLnNldFByb3BlcnR5VmFsdWUoZixiLGMpO1widHJhbnNmb3JtXCI9PT1oWzBdJiZ5LkNTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKGYpLGU9aH19KSxlfTt2YXIgQj1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoKXtyZXR1cm4gaz96LnByb21pc2V8fG51bGw6cH1mdW5jdGlvbiBlKGEsZSl7ZnVuY3Rpb24gZihmKXt2YXIgayxuO2lmKGkuYmVnaW4mJjA9PT1EKXRyeXtpLmJlZ2luLmNhbGwocixyKX1jYXRjaChWKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhyb3cgVn0sMSl9aWYoXCJzY3JvbGxcIj09PUcpe3ZhciBwLHEsdyx4PS9eeCQvaS50ZXN0KGkuYXhpcyk/XCJMZWZ0XCI6XCJUb3BcIixCPXBhcnNlRmxvYXQoaS5vZmZzZXQpfHwwO2kuY29udGFpbmVyP3UuaXNXcmFwcGVkKGkuY29udGFpbmVyKXx8dS5pc05vZGUoaS5jb250YWluZXIpPyhpLmNvbnRhaW5lcj1pLmNvbnRhaW5lclswXXx8aS5jb250YWluZXIscD1pLmNvbnRhaW5lcltcInNjcm9sbFwiK3hdLHc9cCtvKGEpLnBvc2l0aW9uKClbeC50b0xvd2VyQ2FzZSgpXStCKTppLmNvbnRhaW5lcj1udWxsOihwPXkuU3RhdGUuc2Nyb2xsQW5jaG9yW3kuU3RhdGVbXCJzY3JvbGxQcm9wZXJ0eVwiK3hdXSxxPXkuU3RhdGUuc2Nyb2xsQW5jaG9yW3kuU3RhdGVbXCJzY3JvbGxQcm9wZXJ0eVwiKyhcIkxlZnRcIj09PXg/XCJUb3BcIjpcIkxlZnRcIildXSx3PW8oYSkub2Zmc2V0KClbeC50b0xvd2VyQ2FzZSgpXStCKSxqPXtzY3JvbGw6e3Jvb3RQcm9wZXJ0eVZhbHVlOiExLHN0YXJ0VmFsdWU6cCxjdXJyZW50VmFsdWU6cCxlbmRWYWx1ZTp3LHVuaXRUeXBlOlwiXCIsZWFzaW5nOmkuZWFzaW5nLHNjcm9sbERhdGE6e2NvbnRhaW5lcjppLmNvbnRhaW5lcixkaXJlY3Rpb246eCxhbHRlcm5hdGVWYWx1ZTpxfX0sZWxlbWVudDphfSx5LmRlYnVnJiZjb25zb2xlLmxvZyhcInR3ZWVuc0NvbnRhaW5lciAoc2Nyb2xsKTogXCIsai5zY3JvbGwsYSl9ZWxzZSBpZihcInJldmVyc2VcIj09PUcpe2lmKCEoaz1nKGEpKSlyZXR1cm47aWYoIWsudHdlZW5zQ29udGFpbmVyKXJldHVybiB2b2lkIG8uZGVxdWV1ZShhLGkucXVldWUpO1wibm9uZVwiPT09ay5vcHRzLmRpc3BsYXkmJihrLm9wdHMuZGlzcGxheT1cImF1dG9cIiksXCJoaWRkZW5cIj09PWsub3B0cy52aXNpYmlsaXR5JiYoay5vcHRzLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCIpLGsub3B0cy5sb29wPSExLGsub3B0cy5iZWdpbj1udWxsLGsub3B0cy5jb21wbGV0ZT1udWxsLHYuZWFzaW5nfHxkZWxldGUgaS5lYXNpbmcsdi5kdXJhdGlvbnx8ZGVsZXRlIGkuZHVyYXRpb24saT1vLmV4dGVuZCh7fSxrLm9wdHMsaSksbj1vLmV4dGVuZCghMCx7fSxrP2sudHdlZW5zQ29udGFpbmVyOm51bGwpO2Zvcih2YXIgRSBpbiBuKWlmKG4uaGFzT3duUHJvcGVydHkoRSkmJlwiZWxlbWVudFwiIT09RSl7dmFyIEY9bltFXS5zdGFydFZhbHVlO25bRV0uc3RhcnRWYWx1ZT1uW0VdLmN1cnJlbnRWYWx1ZT1uW0VdLmVuZFZhbHVlLG5bRV0uZW5kVmFsdWU9Rix1LmlzRW1wdHlPYmplY3Qodil8fChuW0VdLmVhc2luZz1pLmVhc2luZykseS5kZWJ1ZyYmY29uc29sZS5sb2coXCJyZXZlcnNlIHR3ZWVuc0NvbnRhaW5lciAoXCIrRStcIik6IFwiK0pTT04uc3RyaW5naWZ5KG5bRV0pLGEpfWo9bn1lbHNlIGlmKFwic3RhcnRcIj09PUcpe2s9ZyhhKSxrJiZrLnR3ZWVuc0NvbnRhaW5lciYmITA9PT1rLmlzQW5pbWF0aW5nJiYobj1rLnR3ZWVuc0NvbnRhaW5lcik7dmFyIEg9ZnVuY3Rpb24oZSxmKXt2YXIgZyxsPUEuSG9va3MuZ2V0Um9vdChlKSxtPSExLHA9ZlswXSxxPWZbMV0scj1mWzJdXG47aWYoIShrJiZrLmlzU1ZHfHxcInR3ZWVuXCI9PT1sfHwhMSE9PUEuTmFtZXMucHJlZml4Q2hlY2sobClbMV18fEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtsXSE9PWQpKXJldHVybiB2b2lkKHkuZGVidWcmJmNvbnNvbGUubG9nKFwiU2tpcHBpbmcgW1wiK2wrXCJdIGR1ZSB0byBhIGxhY2sgb2YgYnJvd3NlciBzdXBwb3J0LlwiKSk7KGkuZGlzcGxheSE9PWQmJm51bGwhPT1pLmRpc3BsYXkmJlwibm9uZVwiIT09aS5kaXNwbGF5fHxpLnZpc2liaWxpdHkhPT1kJiZcImhpZGRlblwiIT09aS52aXNpYmlsaXR5KSYmL29wYWNpdHl8ZmlsdGVyLy50ZXN0KGUpJiYhciYmMCE9PXAmJihyPTApLGkuX2NhY2hlVmFsdWVzJiZuJiZuW2VdPyhyPT09ZCYmKHI9bltlXS5lbmRWYWx1ZStuW2VdLnVuaXRUeXBlKSxtPWsucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtsXSk6QS5Ib29rcy5yZWdpc3RlcmVkW2VdP3I9PT1kPyhtPUEuZ2V0UHJvcGVydHlWYWx1ZShhLGwpLHI9QS5nZXRQcm9wZXJ0eVZhbHVlKGEsZSxtKSk6bT1BLkhvb2tzLnRlbXBsYXRlc1tsXVsxXTpyPT09ZCYmKHI9QS5nZXRQcm9wZXJ0eVZhbHVlKGEsZSkpO3ZhciBzLHQsdix3PSExLHg9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkO3JldHVybiBkPShifHxcIjBcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1slQS16XSskLyxmdW5jdGlvbihhKXtyZXR1cm4gYz1hLFwiXCJ9KSxjfHwoYz1BLlZhbHVlcy5nZXRVbml0VHlwZShhKSksW2QsY119O2lmKHIhPT1wJiZ1LmlzU3RyaW5nKHIpJiZ1LmlzU3RyaW5nKHApKXtnPVwiXCI7dmFyIHo9MCxCPTAsQz1bXSxEPVtdLEU9MCxGPTAsRz0wO2ZvcihyPUEuSG9va3MuZml4Q29sb3JzKHIpLHA9QS5Ib29rcy5maXhDb2xvcnMocCk7ejxyLmxlbmd0aCYmQjxwLmxlbmd0aDspe3ZhciBIPXJbel0sST1wW0JdO2lmKC9bXFxkXFwuLV0vLnRlc3QoSCkmJi9bXFxkXFwuLV0vLnRlc3QoSSkpe2Zvcih2YXIgSj1ILEs9SSxMPVwiLlwiLE49XCIuXCI7Kyt6PHIubGVuZ3RoOyl7aWYoKEg9clt6XSk9PT1MKUw9XCIuLlwiO2Vsc2UgaWYoIS9cXGQvLnRlc3QoSCkpYnJlYWs7Sis9SH1mb3IoOysrQjxwLmxlbmd0aDspe2lmKChJPXBbQl0pPT09TilOPVwiLi5cIjtlbHNlIGlmKCEvXFxkLy50ZXN0KEkpKWJyZWFrO0srPUl9dmFyIE89QS5Ib29rcy5nZXRVbml0KHIseiksUD1BLkhvb2tzLmdldFVuaXQocCxCKTtpZih6Kz1PLmxlbmd0aCxCKz1QLmxlbmd0aCxPPT09UClKPT09Sz9nKz1KK086KGcrPVwie1wiK0MubGVuZ3RoKyhGP1wiIVwiOlwiXCIpK1wifVwiK08sQy5wdXNoKHBhcnNlRmxvYXQoSikpLEQucHVzaChwYXJzZUZsb2F0KEspKSk7ZWxzZXt2YXIgUT1wYXJzZUZsb2F0KEopLFI9cGFyc2VGbG9hdChLKTtnKz0oRTw1P1wiY2FsY1wiOlwiXCIpK1wiKFwiKyhRP1wie1wiK0MubGVuZ3RoKyhGP1wiIVwiOlwiXCIpK1wifVwiOlwiMFwiKStPK1wiICsgXCIrKFI/XCJ7XCIrKEMubGVuZ3RoKyhRPzE6MCkpKyhGP1wiIVwiOlwiXCIpK1wifVwiOlwiMFwiKStQK1wiKVwiLFEmJihDLnB1c2goUSksRC5wdXNoKDApKSxSJiYoQy5wdXNoKDApLEQucHVzaChSKSl9fWVsc2V7aWYoSCE9PUkpe0U9MDticmVha31nKz1ILHorKyxCKyssMD09PUUmJlwiY1wiPT09SHx8MT09PUUmJlwiYVwiPT09SHx8Mj09PUUmJlwibFwiPT09SHx8Mz09PUUmJlwiY1wiPT09SHx8RT49NCYmXCIoXCI9PT1IP0UrKzooRSYmRTw1fHxFPj00JiZcIilcIj09PUgmJi0tRTw1KSYmKEU9MCksMD09PUYmJlwiclwiPT09SHx8MT09PUYmJlwiZ1wiPT09SHx8Mj09PUYmJlwiYlwiPT09SHx8Mz09PUYmJlwiYVwiPT09SHx8Rj49MyYmXCIoXCI9PT1IPygzPT09RiYmXCJhXCI9PT1IJiYoRz0xKSxGKyspOkcmJlwiLFwiPT09SD8rK0c+MyYmKEY9Rz0wKTooRyYmRjwoRz81OjQpfHxGPj0oRz80OjMpJiZcIilcIj09PUgmJi0tRjwoRz81OjQpKSYmKEY9Rz0wKX19ej09PXIubGVuZ3RoJiZCPT09cC5sZW5ndGh8fCh5LmRlYnVnJiZjb25zb2xlLmVycm9yKCdUcnlpbmcgdG8gcGF0dGVybiBtYXRjaCBtaXMtbWF0Y2hlZCBzdHJpbmdzIFtcIicrcCsnXCIsIFwiJytyKydcIl0nKSxnPWQpLGcmJihDLmxlbmd0aD8oeS5kZWJ1ZyYmY29uc29sZS5sb2coJ1BhdHRlcm4gZm91bmQgXCInK2crJ1wiIC0+ICcsQyxELFwiW1wiK3IrXCIsXCIrcCtcIl1cIikscj1DLHA9RCx0PXY9XCJcIik6Zz1kKX1nfHwocz14KGUscikscj1zWzBdLHY9c1sxXSxzPXgoZSxwKSxwPXNbMF0ucmVwbGFjZSgvXihbKy1cXC8qXSk9LyxmdW5jdGlvbihhLGIpe3JldHVybiB3PWIsXCJcIn0pLHQ9c1sxXSxyPXBhcnNlRmxvYXQocil8fDAscD1wYXJzZUZsb2F0KHApfHwwLFwiJVwiPT09dCYmKC9eKGZvbnRTaXplfGxpbmVIZWlnaHQpJC8udGVzdChlKT8ocC89MTAwLHQ9XCJlbVwiKTovXnNjYWxlLy50ZXN0KGUpPyhwLz0xMDAsdD1cIlwiKTovKFJlZHxHcmVlbnxCbHVlKSQvaS50ZXN0KGUpJiYocD1wLzEwMCoyNTUsdD1cIlwiKSkpO2lmKC9bXFwvKl0vLnRlc3QodykpdD12O2Vsc2UgaWYodiE9PXQmJjAhPT1yKWlmKDA9PT1wKXQ9djtlbHNle2g9aHx8ZnVuY3Rpb24oKXt2YXIgZD17bXlQYXJlbnQ6YS5wYXJlbnROb2RlfHxjLmJvZHkscG9zaXRpb246QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJwb3NpdGlvblwiKSxmb250U2l6ZTpBLmdldFByb3BlcnR5VmFsdWUoYSxcImZvbnRTaXplXCIpfSxlPWQucG9zaXRpb249PT1NLmxhc3RQb3NpdGlvbiYmZC5teVBhcmVudD09PU0ubGFzdFBhcmVudCxmPWQuZm9udFNpemU9PT1NLmxhc3RGb250U2l6ZTtNLmxhc3RQYXJlbnQ9ZC5teVBhcmVudCxNLmxhc3RQb3NpdGlvbj1kLnBvc2l0aW9uLE0ubGFzdEZvbnRTaXplPWQuZm9udFNpemU7dmFyIGc9e307aWYoZiYmZSlnLmVtVG9QeD1NLmxhc3RFbVRvUHgsZy5wZXJjZW50VG9QeFdpZHRoPU0ubGFzdFBlcmNlbnRUb1B4V2lkdGgsZy5wZXJjZW50VG9QeEhlaWdodD1NLmxhc3RQZXJjZW50VG9QeEhlaWdodDtlbHNle3ZhciBoPWsmJmsuaXNTVkc/Yy5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwicmVjdFwiKTpjLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7eS5pbml0KGgpLGQubXlQYXJlbnQuYXBwZW5kQ2hpbGQoaCksby5lYWNoKFtcIm92ZXJmbG93XCIsXCJvdmVyZmxvd1hcIixcIm92ZXJmbG93WVwiXSxmdW5jdGlvbihhLGIpe3kuQ1NTLnNldFByb3BlcnR5VmFsdWUoaCxiLFwiaGlkZGVuXCIpfSkseS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLFwicG9zaXRpb25cIixkLnBvc2l0aW9uKSx5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsXCJmb250U2l6ZVwiLGQuZm9udFNpemUpLHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoaCxcImJveFNpemluZ1wiLFwiY29udGVudC1ib3hcIiksby5lYWNoKFtcIm1pbldpZHRoXCIsXCJtYXhXaWR0aFwiLFwid2lkdGhcIixcIm1pbkhlaWdodFwiLFwibWF4SGVpZ2h0XCIsXCJoZWlnaHRcIl0sZnVuY3Rpb24oYSxiKXt5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsYixcIjEwMCVcIil9KSx5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsXCJwYWRkaW5nTGVmdFwiLFwiMTAwZW1cIiksZy5wZXJjZW50VG9QeFdpZHRoPU0ubGFzdFBlcmNlbnRUb1B4V2lkdGg9KHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGgsXCJ3aWR0aFwiLG51bGwsITApKXx8MSkvMTAwLGcucGVyY2VudFRvUHhIZWlnaHQ9TS5sYXN0UGVyY2VudFRvUHhIZWlnaHQ9KHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGgsXCJoZWlnaHRcIixudWxsLCEwKSl8fDEpLzEwMCxnLmVtVG9QeD1NLmxhc3RFbVRvUHg9KHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGgsXCJwYWRkaW5nTGVmdFwiKSl8fDEpLzEwMCxkLm15UGFyZW50LnJlbW92ZUNoaWxkKGgpfXJldHVybiBudWxsPT09TS5yZW1Ub1B4JiYoTS5yZW1Ub1B4PXBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGMuYm9keSxcImZvbnRTaXplXCIpKXx8MTYpLG51bGw9PT1NLnZ3VG9QeCYmKE0udndUb1B4PXBhcnNlRmxvYXQoYi5pbm5lcldpZHRoKS8xMDAsTS52aFRvUHg9cGFyc2VGbG9hdChiLmlubmVySGVpZ2h0KS8xMDApLGcucmVtVG9QeD1NLnJlbVRvUHgsZy52d1RvUHg9TS52d1RvUHgsZy52aFRvUHg9TS52aFRvUHgseS5kZWJ1Zz49MSYmY29uc29sZS5sb2coXCJVbml0IHJhdGlvczogXCIrSlNPTi5zdHJpbmdpZnkoZyksYSksZ30oKTt2YXIgUz0vbWFyZ2lufHBhZGRpbmd8bGVmdHxyaWdodHx3aWR0aHx0ZXh0fHdvcmR8bGV0dGVyL2kudGVzdChlKXx8L1gkLy50ZXN0KGUpfHxcInhcIj09PWU/XCJ4XCI6XCJ5XCI7c3dpdGNoKHYpe2Nhc2VcIiVcIjpyKj1cInhcIj09PVM/aC5wZXJjZW50VG9QeFdpZHRoOmgucGVyY2VudFRvUHhIZWlnaHQ7YnJlYWs7Y2FzZVwicHhcIjpicmVhaztkZWZhdWx0OnIqPWhbditcIlRvUHhcIl19c3dpdGNoKHQpe2Nhc2VcIiVcIjpyKj0xLyhcInhcIj09PVM/aC5wZXJjZW50VG9QeFdpZHRoOmgucGVyY2VudFRvUHhIZWlnaHQpO2JyZWFrO2Nhc2VcInB4XCI6YnJlYWs7ZGVmYXVsdDpyKj0xL2hbdCtcIlRvUHhcIl19fXN3aXRjaCh3KXtjYXNlXCIrXCI6cD1yK3A7YnJlYWs7Y2FzZVwiLVwiOnA9ci1wO2JyZWFrO2Nhc2VcIipcIjpwKj1yO2JyZWFrO2Nhc2VcIi9cIjpwPXIvcH1qW2VdPXtyb290UHJvcGVydHlWYWx1ZTptLHN0YXJ0VmFsdWU6cixjdXJyZW50VmFsdWU6cixlbmRWYWx1ZTpwLHVuaXRUeXBlOnQsZWFzaW5nOnF9LGcmJihqW2VdLnBhdHRlcm49ZykseS5kZWJ1ZyYmY29uc29sZS5sb2coXCJ0d2VlbnNDb250YWluZXIgKFwiK2UrXCIpOiBcIitKU09OLnN0cmluZ2lmeShqW2VdKSxhKX07Zm9yKHZhciBJIGluIHMpaWYocy5oYXNPd25Qcm9wZXJ0eShJKSl7dmFyIEo9QS5OYW1lcy5jYW1lbENhc2UoSSksSz1mdW5jdGlvbihiLGMpe3ZhciBkLGYsZztyZXR1cm4gdS5pc0Z1bmN0aW9uKGIpJiYoYj1iLmNhbGwoYSxlLEMpKSx1LmlzQXJyYXkoYik/KGQ9YlswXSwhdS5pc0FycmF5KGJbMV0pJiYvXltcXGQtXS8udGVzdChiWzFdKXx8dS5pc0Z1bmN0aW9uKGJbMV0pfHxBLlJlZ0V4LmlzSGV4LnRlc3QoYlsxXSk/Zz1iWzFdOnUuaXNTdHJpbmcoYlsxXSkmJiFBLlJlZ0V4LmlzSGV4LnRlc3QoYlsxXSkmJnkuRWFzaW5nc1tiWzFdXXx8dS5pc0FycmF5KGJbMV0pPyhmPWM/YlsxXTpsKGJbMV0saS5kdXJhdGlvbiksZz1iWzJdKTpnPWJbMV18fGJbMl0pOmQ9YixjfHwoZj1mfHxpLmVhc2luZyksdS5pc0Z1bmN0aW9uKGQpJiYoZD1kLmNhbGwoYSxlLEMpKSx1LmlzRnVuY3Rpb24oZykmJihnPWcuY2FsbChhLGUsQykpLFtkfHwwLGYsZ119KHNbSV0pO2lmKHQoQS5MaXN0cy5jb2xvcnMsSikpe3ZhciBMPUtbMF0sTz1LWzFdLFA9S1syXTtpZihBLlJlZ0V4LmlzSGV4LnRlc3QoTCkpe2Zvcih2YXIgUT1bXCJSZWRcIixcIkdyZWVuXCIsXCJCbHVlXCJdLFI9QS5WYWx1ZXMuaGV4VG9SZ2IoTCksUz1QP0EuVmFsdWVzLmhleFRvUmdiKFApOmQsVD0wO1Q8US5sZW5ndGg7VCsrKXt2YXIgVT1bUltUXV07TyYmVS5wdXNoKE8pLFMhPT1kJiZVLnB1c2goU1tUXSksSChKK1FbVF0sVSl9Y29udGludWV9fUgoSixLKX1qLmVsZW1lbnQ9YX1qLmVsZW1lbnQmJihBLlZhbHVlcy5hZGRDbGFzcyhhLFwidmVsb2NpdHktYW5pbWF0aW5nXCIpLE4ucHVzaChqKSxrPWcoYSksayYmKFwiXCI9PT1pLnF1ZXVlJiYoay50d2VlbnNDb250YWluZXI9aixrLm9wdHM9aSksay5pc0FuaW1hdGluZz0hMCksRD09PUMtMT8oeS5TdGF0ZS5jYWxscy5wdXNoKFtOLHIsaSxudWxsLHoucmVzb2x2ZXIsbnVsbCwwXSksITE9PT15LlN0YXRlLmlzVGlja2luZyYmKHkuU3RhdGUuaXNUaWNraW5nPSEwLG0oKSkpOkQrKyl9dmFyIGgsaT1vLmV4dGVuZCh7fSx5LmRlZmF1bHRzLHYpLGo9e307c3dpdGNoKGcoYSk9PT1kJiZ5LmluaXQoYSkscGFyc2VGbG9hdChpLmRlbGF5KSYmITEhPT1pLnF1ZXVlJiZvLnF1ZXVlKGEsaS5xdWV1ZSxmdW5jdGlvbihiLGMpe2lmKCEwPT09YylyZXR1cm4hMDt5LnZlbG9jaXR5UXVldWVFbnRyeUZsYWc9ITA7dmFyIGQ9eS5TdGF0ZS5kZWxheWVkRWxlbWVudHMuY291bnQrKzt5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1tkXT1hO3ZhciBlPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbigpe3kuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2FdPSExLGIoKX19KGQpO2coYSkuZGVsYXlCZWdpbj0obmV3IERhdGUpLmdldFRpbWUoKSxnKGEpLmRlbGF5PXBhcnNlRmxvYXQoaS5kZWxheSksZyhhKS5kZWxheVRpbWVyPXtzZXRUaW1lb3V0OnNldFRpbWVvdXQoYixwYXJzZUZsb2F0KGkuZGVsYXkpKSxuZXh0OmV9fSksaS5kdXJhdGlvbi50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpe2Nhc2VcImZhc3RcIjppLmR1cmF0aW9uPTIwMDticmVhaztjYXNlXCJub3JtYWxcIjppLmR1cmF0aW9uPXc7YnJlYWs7Y2FzZVwic2xvd1wiOmkuZHVyYXRpb249NjAwO2JyZWFrO2RlZmF1bHQ6aS5kdXJhdGlvbj1wYXJzZUZsb2F0KGkuZHVyYXRpb24pfHwxfWlmKCExIT09eS5tb2NrJiYoITA9PT15Lm1vY2s/aS5kdXJhdGlvbj1pLmRlbGF5PTE6KGkuZHVyYXRpb24qPXBhcnNlRmxvYXQoeS5tb2NrKXx8MSxpLmRlbGF5Kj1wYXJzZUZsb2F0KHkubW9jayl8fDEpKSxpLmVhc2luZz1sKGkuZWFzaW5nLGkuZHVyYXRpb24pLGkuYmVnaW4mJiF1LmlzRnVuY3Rpb24oaS5iZWdpbikmJihpLmJlZ2luPW51bGwpLGkucHJvZ3Jlc3MmJiF1LmlzRnVuY3Rpb24oaS5wcm9ncmVzcykmJihpLnByb2dyZXNzPW51bGwpLGkuY29tcGxldGUmJiF1LmlzRnVuY3Rpb24oaS5jb21wbGV0ZSkmJihpLmNvbXBsZXRlPW51bGwpLGkuZGlzcGxheSE9PWQmJm51bGwhPT1pLmRpc3BsYXkmJihpLmRpc3BsYXk9aS5kaXNwbGF5LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSxcImF1dG9cIj09PWkuZGlzcGxheSYmKGkuZGlzcGxheT15LkNTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoYSkpKSxpLnZpc2liaWxpdHkhPT1kJiZudWxsIT09aS52aXNpYmlsaXR5JiYoaS52aXNpYmlsaXR5PWkudmlzaWJpbGl0eS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpLGkubW9iaWxlSEE9aS5tb2JpbGVIQSYmeS5TdGF0ZS5pc01vYmlsZSYmIXkuU3RhdGUuaXNHaW5nZXJicmVhZCwhMT09PWkucXVldWUpaWYoaS5kZWxheSl7dmFyIGs9eS5TdGF0ZS5kZWxheWVkRWxlbWVudHMuY291bnQrKzt5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1trXT1hO3ZhciBuPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbigpe3kuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2FdPSExLGYoKX19KGspO2coYSkuZGVsYXlCZWdpbj0obmV3IERhdGUpLmdldFRpbWUoKSxnKGEpLmRlbGF5PXBhcnNlRmxvYXQoaS5kZWxheSksZyhhKS5kZWxheVRpbWVyPXtzZXRUaW1lb3V0OnNldFRpbWVvdXQoZixwYXJzZUZsb2F0KGkuZGVsYXkpKSxuZXh0Om59fWVsc2UgZigpO2Vsc2Ugby5xdWV1ZShhLGkucXVldWUsZnVuY3Rpb24oYSxiKXtpZighMD09PWIpcmV0dXJuIHoucHJvbWlzZSYmei5yZXNvbHZlcihyKSwhMDt5LnZlbG9jaXR5UXVldWVFbnRyeUZsYWc9ITAsZihhKX0pO1wiXCIhPT1pLnF1ZXVlJiZcImZ4XCIhPT1pLnF1ZXVlfHxcImlucHJvZ3Jlc3NcIj09PW8ucXVldWUoYSlbMF18fG8uZGVxdWV1ZShhKX12YXIgaixrLHAscSxyLHMsdix4PWFyZ3VtZW50c1swXSYmKGFyZ3VtZW50c1swXS5wfHxvLmlzUGxhaW5PYmplY3QoYXJndW1lbnRzWzBdLnByb3BlcnRpZXMpJiYhYXJndW1lbnRzWzBdLnByb3BlcnRpZXMubmFtZXN8fHUuaXNTdHJpbmcoYXJndW1lbnRzWzBdLnByb3BlcnRpZXMpKTt1LmlzV3JhcHBlZCh0aGlzKT8oaz0hMSxxPTAscj10aGlzLHA9dGhpcyk6KGs9ITAscT0xLHI9eD9hcmd1bWVudHNbMF0uZWxlbWVudHN8fGFyZ3VtZW50c1swXS5lOmFyZ3VtZW50c1swXSk7dmFyIHo9e3Byb21pc2U6bnVsbCxyZXNvbHZlcjpudWxsLHJlamVjdGVyOm51bGx9O2lmKGsmJnkuUHJvbWlzZSYmKHoucHJvbWlzZT1uZXcgeS5Qcm9taXNlKGZ1bmN0aW9uKGEsYil7ei5yZXNvbHZlcj1hLHoucmVqZWN0ZXI9Yn0pKSx4PyhzPWFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzfHxhcmd1bWVudHNbMF0ucCx2PWFyZ3VtZW50c1swXS5vcHRpb25zfHxhcmd1bWVudHNbMF0ubyk6KHM9YXJndW1lbnRzW3FdLHY9YXJndW1lbnRzW3ErMV0pLCEocj1mKHIpKSlyZXR1cm4gdm9pZCh6LnByb21pc2UmJihzJiZ2JiYhMT09PXYucHJvbWlzZVJlamVjdEVtcHR5P3oucmVzb2x2ZXIoKTp6LnJlamVjdGVyKCkpKTt2YXIgQz1yLmxlbmd0aCxEPTA7aWYoIS9eKHN0b3B8ZmluaXNofGZpbmlzaEFsbHxwYXVzZXxyZXN1bWUpJC9pLnRlc3QocykmJiFvLmlzUGxhaW5PYmplY3Qodikpe3ZhciBFPXErMTt2PXt9O2Zvcih2YXIgRj1FO0Y8YXJndW1lbnRzLmxlbmd0aDtGKyspdS5pc0FycmF5KGFyZ3VtZW50c1tGXSl8fCEvXihmYXN0fG5vcm1hbHxzbG93KSQvaS50ZXN0KGFyZ3VtZW50c1tGXSkmJiEvXlxcZC8udGVzdChhcmd1bWVudHNbRl0pP3UuaXNTdHJpbmcoYXJndW1lbnRzW0ZdKXx8dS5pc0FycmF5KGFyZ3VtZW50c1tGXSk/di5lYXNpbmc9YXJndW1lbnRzW0ZdOnUuaXNGdW5jdGlvbihhcmd1bWVudHNbRl0pJiYodi5jb21wbGV0ZT1hcmd1bWVudHNbRl0pOnYuZHVyYXRpb249YXJndW1lbnRzW0ZdfXZhciBHO3N3aXRjaChzKXtjYXNlXCJzY3JvbGxcIjpHPVwic2Nyb2xsXCI7YnJlYWs7Y2FzZVwicmV2ZXJzZVwiOkc9XCJyZXZlcnNlXCI7YnJlYWs7Y2FzZVwicGF1c2VcIjp2YXIgSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gby5lYWNoKHIsZnVuY3Rpb24oYSxiKXtoKGIsSCl9KSxvLmVhY2goeS5TdGF0ZS5jYWxscyxmdW5jdGlvbihhLGIpe3ZhciBjPSExO2ImJm8uZWFjaChiWzFdLGZ1bmN0aW9uKGEsZSl7dmFyIGY9dj09PWQ/XCJcIjp2O3JldHVybiEwIT09ZiYmYlsyXS5xdWV1ZSE9PWYmJih2IT09ZHx8ITEhPT1iWzJdLnF1ZXVlKXx8KG8uZWFjaChyLGZ1bmN0aW9uKGEsZCl7aWYoZD09PWUpcmV0dXJuIGJbNV09e3Jlc3VtZTohMX0sYz0hMCwhMX0pLCFjJiZ2b2lkIDApfSl9KSxhKCk7Y2FzZVwicmVzdW1lXCI6cmV0dXJuIG8uZWFjaChyLGZ1bmN0aW9uKGEsYil7aShiLEgpfSksby5lYWNoKHkuU3RhdGUuY2FsbHMsZnVuY3Rpb24oYSxiKXt2YXIgYz0hMTtiJiZvLmVhY2goYlsxXSxmdW5jdGlvbihhLGUpe3ZhciBmPXY9PT1kP1wiXCI6djtyZXR1cm4hMCE9PWYmJmJbMl0ucXVldWUhPT1mJiYodiE9PWR8fCExIT09YlsyXS5xdWV1ZSl8fCghYls1XXx8KG8uZWFjaChyLGZ1bmN0aW9uKGEsZCl7aWYoZD09PWUpcmV0dXJuIGJbNV0ucmVzdW1lPSEwLGM9ITAsITF9KSwhYyYmdm9pZCAwKSl9KX0pLGEoKTtjYXNlXCJmaW5pc2hcIjpjYXNlXCJmaW5pc2hBbGxcIjpjYXNlXCJzdG9wXCI6by5lYWNoKHIsZnVuY3Rpb24oYSxiKXtnKGIpJiZnKGIpLmRlbGF5VGltZXImJihjbGVhclRpbWVvdXQoZyhiKS5kZWxheVRpbWVyLnNldFRpbWVvdXQpLGcoYikuZGVsYXlUaW1lci5uZXh0JiZnKGIpLmRlbGF5VGltZXIubmV4dCgpLGRlbGV0ZSBnKGIpLmRlbGF5VGltZXIpLFwiZmluaXNoQWxsXCIhPT1zfHwhMCE9PXYmJiF1LmlzU3RyaW5nKHYpfHwoby5lYWNoKG8ucXVldWUoYix1LmlzU3RyaW5nKHYpP3Y6XCJcIiksZnVuY3Rpb24oYSxiKXt1LmlzRnVuY3Rpb24oYikmJmIoKX0pLG8ucXVldWUoYix1LmlzU3RyaW5nKHYpP3Y6XCJcIixbXSkpfSk7dmFyIEk9W107cmV0dXJuIG8uZWFjaCh5LlN0YXRlLmNhbGxzLGZ1bmN0aW9uKGEsYil7YiYmby5lYWNoKGJbMV0sZnVuY3Rpb24oYyxlKXt2YXIgZj12PT09ZD9cIlwiOnY7aWYoITAhPT1mJiZiWzJdLnF1ZXVlIT09ZiYmKHYhPT1kfHwhMSE9PWJbMl0ucXVldWUpKXJldHVybiEwO28uZWFjaChyLGZ1bmN0aW9uKGMsZCl7aWYoZD09PWUpaWYoKCEwPT09dnx8dS5pc1N0cmluZyh2KSkmJihvLmVhY2goby5xdWV1ZShkLHUuaXNTdHJpbmcodik/djpcIlwiKSxmdW5jdGlvbihhLGIpe3UuaXNGdW5jdGlvbihiKSYmYihudWxsLCEwKX0pLG8ucXVldWUoZCx1LmlzU3RyaW5nKHYpP3Y6XCJcIixbXSkpLFwic3RvcFwiPT09cyl7dmFyIGg9ZyhkKTtoJiZoLnR3ZWVuc0NvbnRhaW5lciYmKCEwPT09Znx8XCJcIj09PWYpJiZvLmVhY2goaC50d2VlbnNDb250YWluZXIsZnVuY3Rpb24oYSxiKXtiLmVuZFZhbHVlPWIuY3VycmVudFZhbHVlfSksSS5wdXNoKGEpfWVsc2VcImZpbmlzaFwiIT09cyYmXCJmaW5pc2hBbGxcIiE9PXN8fChiWzJdLmR1cmF0aW9uPTEpfSl9KX0pLFwic3RvcFwiPT09cyYmKG8uZWFjaChJLGZ1bmN0aW9uKGEsYil7bihiLCEwKX0pLHoucHJvbWlzZSYmei5yZXNvbHZlcihyKSksYSgpO2RlZmF1bHQ6aWYoIW8uaXNQbGFpbk9iamVjdChzKXx8dS5pc0VtcHR5T2JqZWN0KHMpKXtpZih1LmlzU3RyaW5nKHMpJiZ5LlJlZGlyZWN0c1tzXSl7aj1vLmV4dGVuZCh7fSx2KTt2YXIgSj1qLmR1cmF0aW9uLEs9ai5kZWxheXx8MDtyZXR1cm4hMD09PWouYmFja3dhcmRzJiYocj1vLmV4dGVuZCghMCxbXSxyKS5yZXZlcnNlKCkpLG8uZWFjaChyLGZ1bmN0aW9uKGEsYil7cGFyc2VGbG9hdChqLnN0YWdnZXIpP2ouZGVsYXk9SytwYXJzZUZsb2F0KGouc3RhZ2dlcikqYTp1LmlzRnVuY3Rpb24oai5zdGFnZ2VyKSYmKGouZGVsYXk9SytqLnN0YWdnZXIuY2FsbChiLGEsQykpLGouZHJhZyYmKGouZHVyYXRpb249cGFyc2VGbG9hdChKKXx8KC9eKGNhbGxvdXR8dHJhbnNpdGlvbikvLnRlc3Qocyk/MWUzOncpLGouZHVyYXRpb249TWF0aC5tYXgoai5kdXJhdGlvbiooai5iYWNrd2FyZHM/MS1hL0M6KGErMSkvQyksLjc1KmouZHVyYXRpb24sMjAwKSkseS5SZWRpcmVjdHNbc10uY2FsbChiLGIsanx8e30sYSxDLHIsei5wcm9taXNlP3o6ZCl9KSxhKCl9dmFyIEw9XCJWZWxvY2l0eTogRmlyc3QgYXJndW1lbnQgKFwiK3MrXCIpIHdhcyBub3QgYSBwcm9wZXJ0eSBtYXAsIGEga25vd24gYWN0aW9uLCBvciBhIHJlZ2lzdGVyZWQgcmVkaXJlY3QuIEFib3J0aW5nLlwiO3JldHVybiB6LnByb21pc2U/ei5yZWplY3RlcihuZXcgRXJyb3IoTCkpOmIuY29uc29sZSYmY29uc29sZS5sb2coTCksYSgpfUc9XCJzdGFydFwifXZhciBNPXtsYXN0UGFyZW50Om51bGwsbGFzdFBvc2l0aW9uOm51bGwsbGFzdEZvbnRTaXplOm51bGwsbGFzdFBlcmNlbnRUb1B4V2lkdGg6bnVsbCxsYXN0UGVyY2VudFRvUHhIZWlnaHQ6bnVsbCxsYXN0RW1Ub1B4Om51bGwscmVtVG9QeDpudWxsLHZ3VG9QeDpudWxsLHZoVG9QeDpudWxsfSxOPVtdO28uZWFjaChyLGZ1bmN0aW9uKGEsYil7dS5pc05vZGUoYikmJmUoYixhKX0pLGo9by5leHRlbmQoe30seS5kZWZhdWx0cyx2KSxqLmxvb3A9cGFyc2VJbnQoai5sb29wLDEwKTt2YXIgTz0yKmoubG9vcC0xO2lmKGoubG9vcClmb3IodmFyIFA9MDtQPE87UCsrKXt2YXIgUT17ZGVsYXk6ai5kZWxheSxwcm9ncmVzczpqLnByb2dyZXNzfTtQPT09Ty0xJiYoUS5kaXNwbGF5PWouZGlzcGxheSxRLnZpc2liaWxpdHk9ai52aXNpYmlsaXR5LFEuY29tcGxldGU9ai5jb21wbGV0ZSksQihyLFwicmV2ZXJzZVwiLFEpfXJldHVybiBhKCl9O3k9by5leHRlbmQoQix5KSx5LmFuaW1hdGU9Qjt2YXIgQz1iLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8cTtpZigheS5TdGF0ZS5pc01vYmlsZSYmYy5oaWRkZW4hPT1kKXt2YXIgRD1mdW5jdGlvbigpe2MuaGlkZGVuPyhDPWZ1bmN0aW9uKGEpe3JldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YSghMCl9LDE2KX0sbSgpKTpDPWIucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxxfTtEKCksYy5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLEQpfXJldHVybiBhLlZlbG9jaXR5PXksYSE9PWImJihhLmZuLnZlbG9jaXR5PUIsYS5mbi52ZWxvY2l0eS5kZWZhdWx0cz15LmRlZmF1bHRzKSxvLmVhY2goW1wiRG93blwiLFwiVXBcIl0sZnVuY3Rpb24oYSxiKXt5LlJlZGlyZWN0c1tcInNsaWRlXCIrYl09ZnVuY3Rpb24oYSxjLGUsZixnLGgpe3ZhciBpPW8uZXh0ZW5kKHt9LGMpLGo9aS5iZWdpbixrPWkuY29tcGxldGUsbD17fSxtPXtoZWlnaHQ6XCJcIixtYXJnaW5Ub3A6XCJcIixtYXJnaW5Cb3R0b206XCJcIixwYWRkaW5nVG9wOlwiXCIscGFkZGluZ0JvdHRvbTpcIlwifTtpLmRpc3BsYXk9PT1kJiYoaS5kaXNwbGF5PVwiRG93blwiPT09Yj9cImlubGluZVwiPT09eS5DU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGEpP1wiaW5saW5lLWJsb2NrXCI6XCJibG9ja1wiOlwibm9uZVwiKSxpLmJlZ2luPWZ1bmN0aW9uKCl7MD09PWUmJmomJmouY2FsbChnLGcpO2Zvcih2YXIgYyBpbiBtKWlmKG0uaGFzT3duUHJvcGVydHkoYykpe2xbY109YS5zdHlsZVtjXTt2YXIgZD1BLmdldFByb3BlcnR5VmFsdWUoYSxjKTttW2NdPVwiRG93blwiPT09Yj9bZCwwXTpbMCxkXX1sLm92ZXJmbG93PWEuc3R5bGUub3ZlcmZsb3csYS5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwifSxpLmNvbXBsZXRlPWZ1bmN0aW9uKCl7Zm9yKHZhciBiIGluIGwpbC5oYXNPd25Qcm9wZXJ0eShiKSYmKGEuc3R5bGVbYl09bFtiXSk7ZT09PWYtMSYmKGsmJmsuY2FsbChnLGcpLGgmJmgucmVzb2x2ZXIoZykpfSx5KGEsbSxpKX19KSxvLmVhY2goW1wiSW5cIixcIk91dFwiXSxmdW5jdGlvbihhLGIpe3kuUmVkaXJlY3RzW1wiZmFkZVwiK2JdPWZ1bmN0aW9uKGEsYyxlLGYsZyxoKXt2YXIgaT1vLmV4dGVuZCh7fSxjKSxqPWkuY29tcGxldGUsaz17b3BhY2l0eTpcIkluXCI9PT1iPzE6MH07MCE9PWUmJihpLmJlZ2luPW51bGwpLGkuY29tcGxldGU9ZSE9PWYtMT9udWxsOmZ1bmN0aW9uKCl7aiYmai5jYWxsKGcsZyksaCYmaC5yZXNvbHZlcihnKX0saS5kaXNwbGF5PT09ZCYmKGkuZGlzcGxheT1cIkluXCI9PT1iP1wiYXV0b1wiOlwibm9uZVwiKSx5KHRoaXMsayxpKX19KSx5fSh3aW5kb3cualF1ZXJ5fHx3aW5kb3cuWmVwdG98fHdpbmRvdyx3aW5kb3csd2luZG93P3dpbmRvdy5kb2N1bWVudDp1bmRlZmluZWQpfSk7IiwiIWZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWEoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcInZlbG9jaXR5XCJdLGEpOmEoKX0oZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtyZXR1cm4gZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5WZWxvY2l0eTtpZighZXx8IWUuVXRpbGl0aWVzKXJldHVybiB2b2lkKGIuY29uc29sZSYmY29uc29sZS5sb2coXCJWZWxvY2l0eSBVSSBQYWNrOiBWZWxvY2l0eSBtdXN0IGJlIGxvYWRlZCBmaXJzdC4gQWJvcnRpbmcuXCIpKTt2YXIgZj1lLlV0aWxpdGllcyxnPWUudmVyc2lvbixoPXttYWpvcjoxLG1pbm9yOjEscGF0Y2g6MH07aWYoZnVuY3Rpb24oYSxiKXt2YXIgYz1bXTtyZXR1cm4hKCFhfHwhYikmJihmLmVhY2goW2EsYl0sZnVuY3Rpb24oYSxiKXt2YXIgZD1bXTtmLmVhY2goYixmdW5jdGlvbihhLGIpe2Zvcig7Yi50b1N0cmluZygpLmxlbmd0aDw1OyliPVwiMFwiK2I7ZC5wdXNoKGIpfSksYy5wdXNoKGQuam9pbihcIlwiKSl9KSxwYXJzZUZsb2F0KGNbMF0pPnBhcnNlRmxvYXQoY1sxXSkpfShoLGcpKXt2YXIgaT1cIlZlbG9jaXR5IFVJIFBhY2s6IFlvdSBuZWVkIHRvIHVwZGF0ZSBWZWxvY2l0eSAodmVsb2NpdHkuanMpIHRvIGEgbmV3ZXIgdmVyc2lvbi4gVmlzaXQgaHR0cDovL2dpdGh1Yi5jb20vanVsaWFuc2hhcGlyby92ZWxvY2l0eS5cIjt0aHJvdyBhbGVydChpKSxuZXcgRXJyb3IoaSl9ZS5SZWdpc3RlckVmZmVjdD1lLlJlZ2lzdGVyVUk9ZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBjKGEsYixjLGQpe3ZhciBnLGg9MDtmLmVhY2goYS5ub2RlVHlwZT9bYV06YSxmdW5jdGlvbihhLGIpe2QmJihjKz1hKmQpLGc9Yi5wYXJlbnROb2RlO3ZhciBpPVtcImhlaWdodFwiLFwicGFkZGluZ1RvcFwiLFwicGFkZGluZ0JvdHRvbVwiLFwibWFyZ2luVG9wXCIsXCJtYXJnaW5Cb3R0b21cIl07XCJib3JkZXItYm94XCI9PT1lLkNTUy5nZXRQcm9wZXJ0eVZhbHVlKGIsXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpJiYoaT1bXCJoZWlnaHRcIl0pLGYuZWFjaChpLGZ1bmN0aW9uKGEsYyl7aCs9cGFyc2VGbG9hdChlLkNTUy5nZXRQcm9wZXJ0eVZhbHVlKGIsYykpfSl9KSxlLmFuaW1hdGUoZyx7aGVpZ2h0OihcIkluXCI9PT1iP1wiK1wiOlwiLVwiKStcIj1cIitofSx7cXVldWU6ITEsZWFzaW5nOlwiZWFzZS1pbi1vdXRcIixkdXJhdGlvbjpjKihcIkluXCI9PT1iPy42OjEpfSl9cmV0dXJuIGUuUmVkaXJlY3RzW2FdPWZ1bmN0aW9uKGQsZyxoLGksaixrLGwpe3ZhciBtPWg9PT1pLTEsbj0wO2w9bHx8Yi5sb29wLFwiZnVuY3Rpb25cIj09dHlwZW9mIGIuZGVmYXVsdER1cmF0aW9uP2IuZGVmYXVsdER1cmF0aW9uPWIuZGVmYXVsdER1cmF0aW9uLmNhbGwoaixqKTpiLmRlZmF1bHREdXJhdGlvbj1wYXJzZUZsb2F0KGIuZGVmYXVsdER1cmF0aW9uKTtmb3IodmFyIG89MDtvPGIuY2FsbHMubGVuZ3RoO28rKylcIm51bWJlclwiPT10eXBlb2YodD1iLmNhbGxzW29dWzFdKSYmKG4rPXQpO3ZhciBwPW4+PTE/MDpiLmNhbGxzLmxlbmd0aD8oMS1uKS9iLmNhbGxzLmxlbmd0aDoxO2ZvcihvPTA7bzxiLmNhbGxzLmxlbmd0aDtvKyspe3ZhciBxPWIuY2FsbHNbb10scj1xWzBdLHM9MWUzLHQ9cVsxXSx1PXFbMl18fHt9LHY9e307aWYodm9pZCAwIT09Zy5kdXJhdGlvbj9zPWcuZHVyYXRpb246dm9pZCAwIT09Yi5kZWZhdWx0RHVyYXRpb24mJihzPWIuZGVmYXVsdER1cmF0aW9uKSx2LmR1cmF0aW9uPXMqKFwibnVtYmVyXCI9PXR5cGVvZiB0P3Q6cCksdi5xdWV1ZT1nLnF1ZXVlfHxcIlwiLHYuZWFzaW5nPXUuZWFzaW5nfHxcImVhc2VcIix2LmRlbGF5PXBhcnNlRmxvYXQodS5kZWxheSl8fDAsdi5sb29wPSFiLmxvb3AmJnUubG9vcCx2Ll9jYWNoZVZhbHVlcz11Ll9jYWNoZVZhbHVlc3x8ITAsMD09PW8pe2lmKHYuZGVsYXkrPXBhcnNlRmxvYXQoZy5kZWxheSl8fDAsMD09PWgmJih2LmJlZ2luPWZ1bmN0aW9uKCl7Zy5iZWdpbiYmZy5iZWdpbi5jYWxsKGosaik7dmFyIGI9YS5tYXRjaCgvKElufE91dCkkLyk7YiYmXCJJblwiPT09YlswXSYmdm9pZCAwIT09ci5vcGFjaXR5JiZmLmVhY2goai5ub2RlVHlwZT9bal06aixmdW5jdGlvbihhLGIpe2UuQ1NTLnNldFByb3BlcnR5VmFsdWUoYixcIm9wYWNpdHlcIiwwKX0pLGcuYW5pbWF0ZVBhcmVudEhlaWdodCYmYiYmYyhqLGJbMF0scyt2LmRlbGF5LGcuc3RhZ2dlcil9KSxudWxsIT09Zy5kaXNwbGF5KWlmKHZvaWQgMCE9PWcuZGlzcGxheSYmXCJub25lXCIhPT1nLmRpc3BsYXkpdi5kaXNwbGF5PWcuZGlzcGxheTtlbHNlIGlmKC9JbiQvLnRlc3QoYSkpe3ZhciB3PWUuQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShkKTt2LmRpc3BsYXk9XCJpbmxpbmVcIj09PXc/XCJpbmxpbmUtYmxvY2tcIjp3fWcudmlzaWJpbGl0eSYmXCJoaWRkZW5cIiE9PWcudmlzaWJpbGl0eSYmKHYudmlzaWJpbGl0eT1nLnZpc2liaWxpdHkpfWlmKG89PT1iLmNhbGxzLmxlbmd0aC0xKXt2YXIgeD1mdW5jdGlvbigpe3ZvaWQgMCE9PWcuZGlzcGxheSYmXCJub25lXCIhPT1nLmRpc3BsYXl8fCEvT3V0JC8udGVzdChhKXx8Zi5lYWNoKGoubm9kZVR5cGU/W2pdOmosZnVuY3Rpb24oYSxiKXtlLkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGIsXCJkaXNwbGF5XCIsXCJub25lXCIpfSksZy5jb21wbGV0ZSYmZy5jb21wbGV0ZS5jYWxsKGosaiksayYmay5yZXNvbHZlcihqfHxkKX07di5jb21wbGV0ZT1mdW5jdGlvbigpe2lmKGwmJmUuUmVkaXJlY3RzW2FdKGQsZyxoLGksaixrLCEwPT09bHx8TWF0aC5tYXgoMCxsLTEpKSxiLnJlc2V0KXtmb3IodmFyIGMgaW4gYi5yZXNldClpZihiLnJlc2V0Lmhhc093blByb3BlcnR5KGMpKXt2YXIgZj1iLnJlc2V0W2NdO3ZvaWQgMCE9PWUuQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbY118fFwic3RyaW5nXCIhPXR5cGVvZiBmJiZcIm51bWJlclwiIT10eXBlb2YgZnx8KGIucmVzZXRbY109W2IucmVzZXRbY10sYi5yZXNldFtjXV0pfXZhciBuPXtkdXJhdGlvbjowLHF1ZXVlOiExfTttJiYobi5jb21wbGV0ZT14KSxlLmFuaW1hdGUoZCxiLnJlc2V0LG4pfWVsc2UgbSYmeCgpfSxcImhpZGRlblwiPT09Zy52aXNpYmlsaXR5JiYodi52aXNpYmlsaXR5PWcudmlzaWJpbGl0eSl9ZS5hbmltYXRlKGQscix2KX19LGV9LGUuUmVnaXN0ZXJFZmZlY3QucGFja2FnZWRFZmZlY3RzPXtcImNhbGxvdXQuYm91bmNlXCI6e2RlZmF1bHREdXJhdGlvbjo1NTAsY2FsbHM6W1t7dHJhbnNsYXRlWTotMzB9LC4yNV0sW3t0cmFuc2xhdGVZOjB9LC4xMjVdLFt7dHJhbnNsYXRlWTotMTV9LC4xMjVdLFt7dHJhbnNsYXRlWTowfSwuMjVdXX0sXCJjYWxsb3V0LnNoYWtlXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7dHJhbnNsYXRlWDotMTF9XSxbe3RyYW5zbGF0ZVg6MTF9XSxbe3RyYW5zbGF0ZVg6LTExfV0sW3t0cmFuc2xhdGVYOjExfV0sW3t0cmFuc2xhdGVYOi0xMX1dLFt7dHJhbnNsYXRlWDoxMX1dLFt7dHJhbnNsYXRlWDotMTF9XSxbe3RyYW5zbGF0ZVg6MH1dXX0sXCJjYWxsb3V0LmZsYXNoXCI6e2RlZmF1bHREdXJhdGlvbjoxMTAwLGNhbGxzOltbe29wYWNpdHk6WzAsXCJlYXNlSW5PdXRRdWFkXCIsMV19XSxbe29wYWNpdHk6WzEsXCJlYXNlSW5PdXRRdWFkXCJdfV0sW3tvcGFjaXR5OlswLFwiZWFzZUluT3V0UXVhZFwiXX1dLFt7b3BhY2l0eTpbMSxcImVhc2VJbk91dFF1YWRcIl19XV19LFwiY2FsbG91dC5wdWxzZVwiOntkZWZhdWx0RHVyYXRpb246ODI1LGNhbGxzOltbe3NjYWxlWDoxLjEsc2NhbGVZOjEuMX0sLjUse2Vhc2luZzpcImVhc2VJbkV4cG9cIn1dLFt7c2NhbGVYOjEsc2NhbGVZOjF9LC41XV19LFwiY2FsbG91dC5zd2luZ1wiOntkZWZhdWx0RHVyYXRpb246OTUwLGNhbGxzOltbe3JvdGF0ZVo6MTV9XSxbe3JvdGF0ZVo6LTEwfV0sW3tyb3RhdGVaOjV9XSxbe3JvdGF0ZVo6LTV9XSxbe3JvdGF0ZVo6MH1dXX0sXCJjYWxsb3V0LnRhZGFcIjp7ZGVmYXVsdER1cmF0aW9uOjFlMyxjYWxsczpbW3tzY2FsZVg6Ljksc2NhbGVZOi45LHJvdGF0ZVo6LTN9LC4xXSxbe3NjYWxlWDoxLjEsc2NhbGVZOjEuMSxyb3RhdGVaOjN9LC4xXSxbe3NjYWxlWDoxLjEsc2NhbGVZOjEuMSxyb3RhdGVaOi0zfSwuMV0sW1wicmV2ZXJzZVwiLC4xMjVdLFtcInJldmVyc2VcIiwuMTI1XSxbXCJyZXZlcnNlXCIsLjEyNV0sW1wicmV2ZXJzZVwiLC4xMjVdLFtcInJldmVyc2VcIiwuMTI1XSxbe3NjYWxlWDoxLHNjYWxlWToxLHJvdGF0ZVo6MH0sLjJdXX0sXCJ0cmFuc2l0aW9uLmZhZGVJblwiOntkZWZhdWx0RHVyYXRpb246NTAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF19XV19LFwidHJhbnNpdGlvbi5mYWRlT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo1MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXX1dXX0sXCJ0cmFuc2l0aW9uLmZsaXBYSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjcwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSxyb3RhdGVZOlswLC01NV19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjB9fSxcInRyYW5zaXRpb24uZmxpcFhPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjcwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSxyb3RhdGVZOjU1fV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHJvdGF0ZVk6MH19LFwidHJhbnNpdGlvbi5mbGlwWUluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0scm90YXRlWDpbMCwtNDVdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBZT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0scm90YXRlWDoyNX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCxyb3RhdGVYOjB9fSxcInRyYW5zaXRpb24uZmxpcEJvdW5jZVhJblwiOntkZWZhdWx0RHVyYXRpb246OTAwLGNhbGxzOltbe29wYWNpdHk6Wy43MjUsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzQwMCw0MDBdLHJvdGF0ZVk6Wy0xMCw5MF19LC41XSxbe29wYWNpdHk6Ljgscm90YXRlWToxMH0sLjI1XSxbe29wYWNpdHk6MSxyb3RhdGVZOjB9LC4yNV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBCb3VuY2VYT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbLjksMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzQwMCw0MDBdLHJvdGF0ZVk6LTEwfV0sW3tvcGFjaXR5OjAscm90YXRlWTo5MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCxyb3RhdGVZOjB9fSxcInRyYW5zaXRpb24uZmxpcEJvdW5jZVlJblwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6Wy43MjUsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzQwMCw0MDBdLHJvdGF0ZVg6Wy0xMCw5MF19LC41XSxbe29wYWNpdHk6Ljgscm90YXRlWDoxMH0sLjI1XSxbe29wYWNpdHk6MSxyb3RhdGVYOjB9LC4yNV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBCb3VuY2VZT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbLjksMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzQwMCw0MDBdLHJvdGF0ZVg6LTE1fV0sW3tvcGFjaXR5OjAscm90YXRlWDo5MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCxyb3RhdGVYOjB9fSxcInRyYW5zaXRpb24uc3dvb3BJblwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtT3JpZ2luWDpbXCIxMDAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCIxMDAlXCIsXCIxMDAlXCJdLHNjYWxlWDpbMSwwXSxzY2FsZVk6WzEsMF0sdHJhbnNsYXRlWDpbMCwtNzAwXSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCJ9fSxcInRyYW5zaXRpb24uc3dvb3BPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCIxMDAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiMTAwJVwiLFwiMTAwJVwiXSxzY2FsZVg6MCxzY2FsZVk6MCx0cmFuc2xhdGVYOi03MDAsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwiLHNjYWxlWDoxLHNjYWxlWToxLHRyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi53aGlybEluXCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOlsxLDBdLHNjYWxlWTpbMSwwXSxyb3RhdGVZOlswLDE2MF19LDEse2Vhc2luZzpcImVhc2VJbk91dFNpbmVcIn1dXX0sXCJ0cmFuc2l0aW9uLndoaXJsT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCxcImVhc2VJbk91dFF1aW50XCIsMV0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDowLHNjYWxlWTowLHJvdGF0ZVk6MTYwfSwxLHtlYXNpbmc6XCJzd2luZ1wifV1dLHJlc2V0OntzY2FsZVg6MSxzY2FsZVk6MSxyb3RhdGVZOjB9fSxcInRyYW5zaXRpb24uc2hyaW5rSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6WzEsMS41XSxzY2FsZVk6WzEsMS41XSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zaHJpbmtPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjYwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6MS4zLHNjYWxlWToxLjMsdHJhbnNsYXRlWjowfV1dLHJlc2V0OntzY2FsZVg6MSxzY2FsZVk6MX19LFwidHJhbnNpdGlvbi5leHBhbmRJblwiOntkZWZhdWx0RHVyYXRpb246NzAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDpbMSwuNjI1XSxzY2FsZVk6WzEsLjYyNV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uZXhwYW5kT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOi41LHNjYWxlWTouNSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3NjYWxlWDoxLHNjYWxlWToxfX0sXCJ0cmFuc2l0aW9uLmJvdW5jZUluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSxzY2FsZVg6WzEuMDUsLjNdLHNjYWxlWTpbMS4wNSwuM119LC4zNV0sW3tzY2FsZVg6Ljksc2NhbGVZOi45LHRyYW5zbGF0ZVo6MH0sLjJdLFt7c2NhbGVYOjEsc2NhbGVZOjF9LC40NV1dfSxcInRyYW5zaXRpb24uYm91bmNlT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7c2NhbGVYOi45NSxzY2FsZVk6Ljk1fSwuMzVdLFt7c2NhbGVYOjEuMSxzY2FsZVk6MS4xLHRyYW5zbGF0ZVo6MH0sLjM1XSxbe29wYWNpdHk6WzAsMV0sc2NhbGVYOi4zLHNjYWxlWTouM30sLjNdXSxyZXNldDp7c2NhbGVYOjEsc2NhbGVZOjF9fSxcInRyYW5zaXRpb24uYm91bmNlVXBJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbLTMwLDFlM119LC42LHtlYXNpbmc6XCJlYXNlT3V0Q2lyY1wifV0sW3t0cmFuc2xhdGVZOjEwfSwuMl0sW3t0cmFuc2xhdGVZOjB9LC4yXV19LFwidHJhbnNpdGlvbi5ib3VuY2VVcE91dFwiOntkZWZhdWx0RHVyYXRpb246MWUzLGNhbGxzOltbe3RyYW5zbGF0ZVk6MjB9LC4yXSxbe29wYWNpdHk6WzAsXCJlYXNlSW5DaXJjXCIsMV0sdHJhbnNsYXRlWTotMWUzfSwuOF1dLHJlc2V0Ont0cmFuc2xhdGVZOjB9fSxcInRyYW5zaXRpb24uYm91bmNlRG93bkluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlszMCwtMWUzXX0sLjYse2Vhc2luZzpcImVhc2VPdXRDaXJjXCJ9XSxbe3RyYW5zbGF0ZVk6LTEwfSwuMl0sW3t0cmFuc2xhdGVZOjB9LC4yXV19LFwidHJhbnNpdGlvbi5ib3VuY2VEb3duT3V0XCI6e2RlZmF1bHREdXJhdGlvbjoxZTMsY2FsbHM6W1t7dHJhbnNsYXRlWTotMjB9LC4yXSxbe29wYWNpdHk6WzAsXCJlYXNlSW5DaXJjXCIsMV0sdHJhbnNsYXRlWToxZTN9LC44XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5ib3VuY2VMZWZ0SW5cIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVg6WzMwLC0xMjUwXX0sLjYse2Vhc2luZzpcImVhc2VPdXRDaXJjXCJ9XSxbe3RyYW5zbGF0ZVg6LTEwfSwuMl0sW3t0cmFuc2xhdGVYOjB9LC4yXV19LFwidHJhbnNpdGlvbi5ib3VuY2VMZWZ0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7dHJhbnNsYXRlWDozMH0sLjJdLFt7b3BhY2l0eTpbMCxcImVhc2VJbkNpcmNcIiwxXSx0cmFuc2xhdGVYOi0xMjUwfSwuOF1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uYm91bmNlUmlnaHRJblwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbLTMwLDEyNTBdfSwuNix7ZWFzaW5nOlwiZWFzZU91dENpcmNcIn1dLFt7dHJhbnNsYXRlWDoxMH0sLjJdLFt7dHJhbnNsYXRlWDowfSwuMl1dfSxcInRyYW5zaXRpb24uYm91bmNlUmlnaHRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3t0cmFuc2xhdGVYOi0zMH0sLjJdLFt7b3BhY2l0eTpbMCxcImVhc2VJbkNpcmNcIiwxXSx0cmFuc2xhdGVYOjEyNTB9LC44XV0scmVzZXQ6e3RyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi5zbGlkZVVwSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjkwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVk6WzAsMjBdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlVXBPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjkwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVk6LTIwLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlRG93bkluXCI6e2RlZmF1bHREdXJhdGlvbjo5MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlswLC0yMF0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVEb3duT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo5MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVZOjIwLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlTGVmdEluXCI6e2RlZmF1bHREdXJhdGlvbjoxZTMsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlswLC0yMF0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVMZWZ0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjoxMDUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWDotMjAsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uc2xpZGVSaWdodEluXCI6e2RlZmF1bHREdXJhdGlvbjoxZTMsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlswLDIwXSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZVJpZ2h0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjoxMDUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWDoyMCx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi5zbGlkZVVwQmlnSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVk6WzAsNzVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlVXBCaWdPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVk6LTc1LHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlRG93bkJpZ0luXCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlswLC03NV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVEb3duQmlnT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVZOjc1LHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlTGVmdEJpZ0luXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlswLC03NV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVMZWZ0QmlnT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVYOi03NSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi5zbGlkZVJpZ2h0QmlnSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVg6WzAsNzVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlUmlnaHRCaWdPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVg6NzUsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVVcEluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjEwMCVcIixcIjEwMCVcIl0scm90YXRlWDpbMCwtMTgwXX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwifX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlVXBPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSx0cmFuc2Zvcm1PcmlnaW5YOlswLDBdLHRyYW5zZm9ybU9yaWdpblk6W1wiMTAwJVwiLFwiMTAwJVwiXSxyb3RhdGVYOi0xODB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIixyb3RhdGVYOjB9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVEb3duSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSx0cmFuc2Zvcm1PcmlnaW5YOlswLDBdLHRyYW5zZm9ybU9yaWdpblk6WzAsMF0scm90YXRlWDpbMCwxODBdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCJ9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVEb3duT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVg6MTgwfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCIscm90YXRlWDowfX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlTGVmdEluXCI6e2RlZmF1bHREdXJhdGlvbjo5NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbMmUzLDJlM10sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVk6WzAsLTE4MF19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIn19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZUxlZnRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjk1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOlsyZTMsMmUzXSx0cmFuc2Zvcm1PcmlnaW5YOlswLDBdLHRyYW5zZm9ybU9yaWdpblk6WzAsMF0scm90YXRlWTotMTgwfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCIscm90YXRlWTowfX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlUmlnaHRJblwiOntkZWZhdWx0RHVyYXRpb246OTUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzJlMywyZTNdLHRyYW5zZm9ybU9yaWdpblg6W1wiMTAwJVwiLFwiMTAwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVk6WzAsMTgwXX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwifX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlUmlnaHRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjk1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOlsyZTMsMmUzXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjEwMCVcIixcIjEwMCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVZOjE4MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwiLHJvdGF0ZVk6MH19fTtmb3IodmFyIGogaW4gZS5SZWdpc3RlckVmZmVjdC5wYWNrYWdlZEVmZmVjdHMpZS5SZWdpc3RlckVmZmVjdC5wYWNrYWdlZEVmZmVjdHMuaGFzT3duUHJvcGVydHkoaikmJmUuUmVnaXN0ZXJFZmZlY3QoaixlLlJlZ2lzdGVyRWZmZWN0LnBhY2thZ2VkRWZmZWN0c1tqXSk7ZS5SdW5TZXF1ZW5jZT1mdW5jdGlvbihhKXt2YXIgYj1mLmV4dGVuZCghMCxbXSxhKTtiLmxlbmd0aD4xJiYoZi5lYWNoKGIucmV2ZXJzZSgpLGZ1bmN0aW9uKGEsYyl7dmFyIGQ9YlthKzFdO2lmKGQpe3ZhciBnPWMub3x8Yy5vcHRpb25zLGg9ZC5vfHxkLm9wdGlvbnMsaT1nJiYhMT09PWcuc2VxdWVuY2VRdWV1ZT9cImJlZ2luXCI6XCJjb21wbGV0ZVwiLGo9aCYmaFtpXSxrPXt9O2tbaV09ZnVuY3Rpb24oKXt2YXIgYT1kLmV8fGQuZWxlbWVudHMsYj1hLm5vZGVUeXBlP1thXTphO2omJmouY2FsbChiLGIpLGUoYyl9LGQubz9kLm89Zi5leHRlbmQoe30saCxrKTpkLm9wdGlvbnM9Zi5leHRlbmQoe30saCxrKX19KSxiLnJldmVyc2UoKSksZShiWzBdKX19KHdpbmRvdy5qUXVlcnl8fHdpbmRvdy5aZXB0b3x8d2luZG93LHdpbmRvdyx3aW5kb3c/d2luZG93LmRvY3VtZW50OnVuZGVmaW5lZCl9KTsiLCJpbXBvcnQgeyBlbENsYXNzIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbmltYXRlTWVudUl0ZW0oKSB7XG4gIGNvbnN0IG1lbnVJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tZW51LWl0ZW0nKTtcblxuICBtZW51SXRlbXMuZm9yRWFjaChlbCA9PiBhZGRQaXBlcyhlbCkpO1xuICBtZW51SXRlbXMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBhbmltYXRlUGlwZSkpO1xuICBtZW51SXRlbXMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHVuQW5pbWF0ZVBpcGUpKTtcblxuICBmdW5jdGlvbiBhZGRQaXBlcyhlbCkge1xuICAgIGNvbnN0IHBpcGUxID0gZWxDbGFzcygnZGl2JywgJ2VuZC1waXBlJyk7XG4gICAgY29uc3Qgc3RyID0gZWw7XG5cbiAgICBwaXBlMS5pbm5lckhUTUwgPSAnWyc7XG4gICAgLy8gc3RyLmlubmVySFRNTCA9IGAke3N0ci5pbm5lckhUTUwudG9VcHBlckNhc2UoKX1gO1xuICAgIHN0ci5hcHBlbmRDaGlsZChwaXBlMSk7XG4gIH1cblxuICBmdW5jdGlvbiBhbmltYXRlUGlwZShlKSB7XG4gICAgY29uc3Qgc3BhY2VXaWR0aCA9IDU7XG4gICAgY29uc3QgdyA9IGUudGFyZ2V0Lm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IHBpcGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpO1xuICAgIHBpcGUuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKCR7LXcgLSBzcGFjZVdpZHRofXB4KTtcbiAgICBgO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBmdW5jdGlvbiB1bkFuaW1hdGVQaXBlKGUpIHtcbiAgICBjb25zdCB3ID0gZS50YXJnZXQub2Zmc2V0V2lkdGg7XG4gICAgY29uc3QgcGlwZSA9IHRoaXMucXVlcnlTZWxlY3RvcignZGl2Jyk7XG4gICAgcGlwZS5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgb3BhY2l0eTogMDtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMHB4KTtcbiAgICBgO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpbVVJKCkge1xuICBsZXQgc1Bvc2l0aW9uID0gMDtcbiAgbGV0IHRpY2tpbmcgPSBmYWxzZTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKGUpID0+IHtcbiAgICBzUG9zaXRpb24gPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICBpZiAoIXRpY2tpbmcpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWwtbWVkaWEtbmF2Jyk7XG4gICAgICAgIChmdW5jdGlvbiBkaW1tZXIoKSB7IHVpLmNsYXNzTGlzdC5hZGQoJ2RpbS11aScpOyB9KCkpO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB1aS5jbGFzc0xpc3QucmVtb3ZlKCdkaW0tdWknKSwgMTAwMCk7XG4gICAgICAgIHRpY2tpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aWNraW5nID0gdHJ1ZTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgYW5pbWF0ZU1lbnVJdGVtcyBmcm9tICcuL2FuaW1hdGVNZW51SXRlbSc7XG5pbXBvcnQgZGltVUkgZnJvbSAnLi9kaW1VSSc7XG5pbXBvcnQgaW50cm9BbmltYXRpb24gZnJvbSAnLi9pbnRyb0FuaW1hdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRlcigpIHtcbiAgYW5pbWF0ZU1lbnVJdGVtcygpO1xuICBpbnRyb0FuaW1hdGlvbigpO1xuICBkaW1VSSgpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW50cm9BbmltYXRpb24oKSB7XG4gIHdpbmRvdy5zZXRUaW1lb3V0KHN0YXJ0SW50cm8sIDQwMCk7XG4gIHdpbmRvdy5zZXRUaW1lb3V0KGNsZWFySW50cm9BbmltLCA0MDAwKTtcblxuICBmdW5jdGlvbiBzdGFydEludHJvKCkge1xuICAgIG1vdmVUZXh0KCk7XG4gICAgc2hvd1VpKCk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3ZlVGV4dCgpIHtcbiAgICBjb25zdCBpbnRyb05hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW50cm8tbmFtZScpO1xuICAgIGNvbnN0IGludHJvQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW50cm8tYmxvY2snKTtcbiAgICBpbnRyb05hbWUuY2xhc3NMaXN0LmFkZCgnaW50cm8tYW5pbS1tb3ZlLW5hbWUnKTtcbiAgICBpbnRyb0Jsb2NrLmNsYXNzTGlzdC5hZGQoJ2ludHJvLWFuaW0tbW92ZS1ibG9jaycpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd1VpKCkge1xuICAgIGNvbnN0IGhlYWRlckxvZ28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9nbycpO1xuICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmludHJvLWluaXQtdWknKTtcbiAgICBoZWFkZXJMb2dvLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICBoZWFkZXJMb2dvLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci1sb2dvJyk7XG4gICAgdWkuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKCdpbnRyby1hbmltLXNob3ctdWknKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhckludHJvQW5pbSgpIHtcbiAgICBjb25zdCBpbml0VUkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW50cm8taW5pdC11aScpO1xuICAgIGNvbnN0IGFuaW1VSSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnRyby1hbmltLXNob3ctdWknKTtcblxuICAgIGluaXRVSS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ludHJvLWluaXQtdWknKSk7XG4gICAgaW5pdFVJLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnaW50cm8tYW5pbS1zaG93LXVpJykpO1xuICB9XG59XG4iLCIvLyBjc3MgY2xhc3M9XCJzdmctJ3gnY2hldnJvblwiXG5pbXBvcnQgeyBlbENsYXNzLCBtYWtlQnRuIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5mdW5jdGlvbiB1cENoZXZyb24oKSB7XG4gIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIGZyYWcuaW5uZXJIVE1MID0gYFxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLXVwY2hldnJvblwiIHdpZHRoPVwiODBcIiB2aWV3Ym94PVwiMCAwIDMwIDEyXCI+XG4gICAgICA8cGF0aCBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBkPVwiTTIgMTAgTCAxNSAyIEwgMjggMTBcIi8+XG4gICAgPC9zdmc+XG4gIGA7XG4gIHJldHVybiBmcmFnO1xufVxuXG5mdW5jdGlvbiBkb3duQ2hldnJvbigpIHtcbiAgY29uc3QgYnV0dG9uID0gbWFrZUJ0bignc2Nyb2xsZG93bicsICdzY3JvbGxkb3duJyk7XG4gIGJ1dHRvbi5pbm5lckhUTUwgPSBgXG4gICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3M9XCJzdmctZG93bmNoZXZyb25cIiB3aWR0aD1cIjgwXCIgdmlld2JveD1cIjAgMCAzMCAxOFwiPlxuICAgICAgPHRleHQgeD1cIjVcIiB5PVwiNFwiIGZvbnQtc2l6ZT1cIjRcIiBmb250LWZhbWlseT1cInNhbnMtc2VyaWZcIj5zY3JvbGwgZG93bjwvdGV4dD5cbiAgICAgIDxwYXRoIGNsYXNzPVwiYW5pbWF0ZS1kb3duY2hldnJvblwiIHN0cm9rZS13aWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGQ9XCJNMiA3IEwgMTUgMTUgTCAyOCA3XCIvPlxuICAgIDwvc3ZnPlxuICBgO1xuICBjb25zdCBzY3JvbGxkb3duRm4gPSAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1hYm91dCcpLnNjcm9sbEludG9WaWV3KHsgXG4gICAgYmVoYXZpb3I6ICdzbW9vdGgnIFxuICB9KTtcbiAgYnV0dG9uLm9uY2xpY2sgPSBzY3JvbGxkb3duRm5cbiAgcmV0dXJuIGJ1dHRvbjtcbn1cblxuZnVuY3Rpb24gbGVmdENoZXZyb24oKSB7XG4gIHJldHVybiBgXG4gIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLWxlZnRjaGV2cm9uXCIgaGVpZ2h0PVwiODBcIiB2aWV3Ym94PVwiMCAwIDEyIDMwXCI+XG4gICAgPHBhdGggc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZD1cIk0xMCAyIEwgMiAxNSBMIDEwIDI4XCIvPlxuICA8L3N2Zz5cbiBgO1xufVxuXG5mdW5jdGlvbiByaWdodENoZXZyb24oKSB7XG4gIHJldHVybiBgXG4gICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3M9XCJzdmctcmlnaHRjaGV2cm9uXCIgaGVpZ2h0PVwiODBcIiB2aWV3Ym94PVwiMCAwIDEyIDMwXCI+XG4gICAgICA8cGF0aCBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBkPVwiTTIgMiBMIDEwIDE1IEwgMiAyOFwiLz5cbiAgICA8L3N2Zz5cbiAgYDtcbn1cblxuZXhwb3J0IHsgdXBDaGV2cm9uLCBkb3duQ2hldnJvbiwgbGVmdENoZXZyb24sIHJpZ2h0Q2hldnJvbiB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdmlld0ljb24oKSB7XG4gIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zaGFkb3dcbiAgc3Bhbi5pbm5lckhUTUwgPSBgXG4gICAgPHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIGNsYXNzPSdzdmctdmlldy1pY29uJyB3aWR0aD0nMjAnIHZpZXdib3g9JzAgMCAyMTAgMTQwJz5cbiAgICAgICA8cGF0aCBkPVwiTTUgNzAgQSAxMTAgMTAwIDAgMCAxIDIwMCA3MCBBIDExMCAxMDAgMCAwIDEgNSA3MFwiIHN0cm9rZT1cIm5vbmVcIiBmaWxsPVwibGlnaHRncmV5XCIgc3Ryb2tlLXdpZHRoPVwiMVwiLz5cbiAgICAgIDxjaXJjbGUgY3g9XCIxMDVcIiBjeT1cIjcwXCIgcj1cIjM1XCIgc3Ryb2tlPVwid2hpdGVcIiBmaWxsPVwibGlnaHRncmV5XCIgc3Ryb2tlLXdpZHRoPVwiNVwiPlxuICAgIDwvc3ZnPlxuICBgO1xuICBzcGFuLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgbWFyZ2luLXRvcDogLjI1ZW07XG4gICAgbWFyZ2luLXJpZ2h0OiAuMjVlbTtcbiAgYDtcbiAgcmV0dXJuIHNwYW47XG59XG4iLCIvKiBnbG9iYWwgVmVsb2NpdHkgKi9cblxuY29uc3QgVmVsb2NpdHkgPSByZXF1aXJlKCcuLi8uLi9ub2RlX21vZHVsZXMvdmVsb2NpdHktYW5pbWF0ZS92ZWxvY2l0eS5taW4uanMnKTtcbnJlcXVpcmUoJy4uLy4uL25vZGVfbW9kdWxlcy92ZWxvY2l0eS1hbmltYXRlL3ZlbG9jaXR5LnVpLm1pbi5qcycpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1idXR0b24nKTtcbiAgY29uc3QgaG9tZUxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWhvbWUnKTtcbiAgY29uc3QgdGV4dCA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCd0ZXh0Jyk7XG5cbiAgYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnb2ZmJykgPyBzaG93TWVudSgpIDogY2xvc2VNZW51KCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuICBmdW5jdGlvbiBzaG93TWVudSgpIHtcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb2ZmJyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ29uJyk7XG4gICAgc3RhZ2dlci5zaG93KCk7XG4gICAgdGV4dC5pbm5lckhUTUwgPSAnY2xvc2UnO1xuICAgIGhvbWVMaW5rLmZvY3VzKCk7XG4gICAgYW5pbWF0ZU1lbnUub3BlbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VNZW51KCkge1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvbicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdvZmYnKTtcbiAgICBzdGFnZ2VyLmhpZGUoKTtcbiAgICB0ZXh0LmlubmVySFRNTCA9ICdtZW51JztcbiAgICBhbmltYXRlTWVudS5jbG9zZSgpO1xuICB9XG59XG5cbmNvbnN0IHN0YWdnZXIgPSAoZnVuY3Rpb24gc3RhZ2dlcigpIHtcbiAgY29uc3QgbWFpbk5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW5hdicpO1xuICBjb25zdCBtZW51SXRlbXMgPSBtYWluTmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG4gIGNvbnN0IGRlbGF5ID0gODA7XG5cbiAgZnVuY3Rpb24gc3RhZ2dlclNob3coKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIG1haW5OYXYuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBibG9jayc7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gcnVuKCkge1xuICAgICAgaWYgKGkgPCBtZW51SXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIG1lbnVJdGVtc1tpXS5jbGFzc0xpc3QuYWRkKCdzaG93LW1lbnUtaXRlbScpO1xuICAgICAgICBzZXRUaW1lb3V0KHJ1biwgZGVsYXkpO1xuICAgICAgfVxuICAgICAgaSArPSAxO1xuICAgIH0sIGRlbGF5KTtcbiAgICBjbGVhclRpbWVvdXQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YWdnZXJIaWRlKCkge1xuICAgIGxldCBpID0gMDtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiBydW4oKSB7XG4gICAgICBpZiAoaSA8IG1lbnVJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgbWVudUl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3ctbWVudS1pdGVtJyk7XG4gICAgICAgIHNldFRpbWVvdXQocnVuLCBkZWxheSk7XG4gICAgICB9XG4gICAgICBpICs9IDE7XG4gICAgfSwgZGVsYXkpO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgbWFpbk5hdi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnOyB9LCBkZWxheSAqIG1lbnVJdGVtcy5sZW5ndGgpO1xuICAgIGNsZWFyVGltZW91dCgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzaG93OiBzdGFnZ2VyU2hvdyxcbiAgICBoaWRlOiBzdGFnZ2VySGlkZSxcbiAgfTtcbn0oKSk7XG5cbmNvbnN0IGFuaW1hdGVNZW51ID0gKGZ1bmN0aW9uIGFuaW1hdGVNZW51KCkge1xuICBjb25zdCBzdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZW51LWxpbmUnKTtcbiAgY29uc3QgYjEgPSBzdmdbMF07XG4gIGNvbnN0IGIyID0gc3ZnWzFdO1xuICBjb25zdCBiMyA9IHN2Z1syXTtcblxuICBmdW5jdGlvbiBhbmltYXRlT3BlbkJ0bigpIHtcbiAgICBjb25zdCB0b3BTZXEgPSBbXG4gICAgICB7IGU6IGIxLCBwOiB7IHRyYW5zbGF0ZVk6IDYgfSwgbzogeyBkdXJhdGlvbjogJzBtcycgfSB9LFxuICAgICAgeyBlOiBiMSwgcDogeyB0cmFuc2xhdGVYOiAtMiB9LCBvOiB7IGR1cmF0aW9uOiAnMG1zJyB9IH0sXG4gICAgICB7IGU6IGIxLCBwOiB7IHJvdGF0ZVo6IDQ1IH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgIF07XG4gICAgY29uc3QgYm90dG9tU2VxID0gW1xuICAgICAgeyBlOiBiMywgcDogeyB0cmFuc2xhdGVYOiAtOCB9LCBvOiB7IGR1cmF0aW9uOiAnMG1zJyB9IH0sXG4gICAgICB7IGU6IGIzLCBwOiB7IHRyYW5zbGF0ZVk6IC0yIH0sIG86IHsgZHVyYXRpb246ICcwbXMnIH0gfSxcbiAgICAgIHsgZTogYjMsIHA6IHsgcm90YXRlWjogLTQ1IH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgIF07XG5cbiAgICBiMS5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybS1vcmlnaW4nLCAnY2VudGVyIGNlbnRlciAwJyk7XG4gICAgYjMuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0tb3JpZ2luJywgJ2NlbnRlciBjZW50ZXIgMCcpO1xuICAgIFZlbG9jaXR5LlJ1blNlcXVlbmNlKHRvcFNlcSk7XG4gICAgVmVsb2NpdHkoYjIsIHsgb3BhY2l0eTogMCB9LCAxMDApO1xuICAgIFZlbG9jaXR5LlJ1blNlcXVlbmNlKGJvdHRvbVNlcSk7XG4gIH1cblxuICBmdW5jdGlvbiBhbmltYXRlQ2xvc2VCdG4oKSB7XG4gICAgY29uc3QgdG9wTGluZSA9IFtcbiAgICAgIHsgZTogYjEsIHA6IHsgcm90YXRlWjogMCB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICAgIHsgZTogYjEsIHA6IHsgdHJhbnNsYXRlWTogMCB9LCBvOiB7IGR1cmF0aW9uOiAnMG1zJyB9IH0sXG4gICAgICB7IGU6IGIxLCBwOiB7IHRyYW5zbGF0ZVg6IDAgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgXTtcbiAgICBjb25zdCBib3R0b21MaW5lID0gW1xuICAgICAgeyBlOiBiMywgcDogeyByb3RhdGVaOiAwIH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgICAgeyBlOiBiMywgcDogeyB0cmFuc2xhdGVYOiAwIH0sIG86IHsgZHVyYXRpb246ICcwbXMnIH0gfSxcbiAgICAgIHsgZTogYjMsIHA6IHsgdHJhbnNsYXRlWTogMCB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICBdO1xuXG4gICAgVmVsb2NpdHkuUnVuU2VxdWVuY2UodG9wTGluZSk7XG4gICAgVmVsb2NpdHkoYjIsICdyZXZlcnNlJywgMTAwKTtcbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZShib3R0b21MaW5lKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb3BlbjogYW5pbWF0ZU9wZW5CdG4sXG4gICAgY2xvc2U6IGFuaW1hdGVDbG9zZUJ0bixcbiAgfTtcbn0oKSk7XG4iLCIvKiBnbG9iYWwgaGlzdG9yeSAqL1xuLyogZXNsaW50IGltcG9ydC9maXJzdDogMCBuby11bmRlZjogMCAqL1xuLyogZXNsaW50IG5vLXJlc3RyaWN0ZWQtZ2xvYmFsczogW1wiZXJyb3JcIiwgXCJldmVudFwiXSAqL1xuXG5pbXBvcnQgJ2JhYmVsLXBvbHlmaWxsJztcbmltcG9ydCB0b2dnbGVNZW51IGZyb20gJy4vY29tcG9uZW50cy90b2dnbGVNZW51JztcbmltcG9ydCB7IGRvd25DaGV2cm9uIH0gZnJvbSAnLi9jb21wb25lbnRzL3N2Zy9zY3JvbGxDaGV2cm9uJztcbmltcG9ydCBsb2FkZXIgZnJvbSAnLi9jb21wb25lbnRzL2ltcG9ydExvYWRlcic7XG5pbXBvcnQgdmlld0ljb24gZnJvbSAnLi9jb21wb25lbnRzL3N2Zy92aWV3SWNvbic7XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICBjb25zdCBtZW51QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtYnV0dG9uJyk7XG4gIGNvbnN0IGhvbWVTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlY3Rpb24taG9tZScpO1xuICBjb25zdCBob21lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi1ob21lJyk7XG4gIGNvbnN0IGFib3V0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi1hYm91dCcpO1xuICBjb25zdCByZXN1bWVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdW1lLWJ0bicpO1xuICBjb25zdCBlbWFpbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbWFpbC1idG4nKTtcbiAgY29uc3Qgc2Nyb2xsQ2hldnJvbiA9IGRvd25DaGV2cm9uKCk7XG4gIGNvbnN0IGljb25TdmcgPSB2aWV3SWNvbigpO1xuXG4gIHJlc3VtZUJ0bi5pbnNlcnRCZWZvcmUoaWNvblN2ZywgcmVzdW1lQnRuLmNoaWxkTm9kZXNbMF0pO1xuXG4gIHdpbmRvdy5zZXRUaW1lb3V0KHN0YXJ0LCA0NTApO1xuICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG5cbiAgLy8gZW1haWxCdG4ub25jbGljayA9IGVtYWlsTW9kYWw7XG4gIG1lbnVCdXR0b24ub25jbGljayA9IHRvZ2dsZU1lbnU7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjci15ZWFyJykuaW5uZXJIVE1MID0gYC0gJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9YDtcbiAgbG9hZGVyKCk7XG4gIGRvY3VtZW50LmJvZHkuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBibG9jayc7XG4gIG1lbnVCdXR0b24uZm9jdXMoKTtcbiAgaG9tZVNlY3Rpb24uYXBwZW5kQ2hpbGQoc2Nyb2xsQ2hldnJvbik7XG4gIHNjcm9sbENoZXZyb24uY2xhc3NMaXN0LmFkZCgnaW50cm8taW5pdC11aScpO1xuXG4gIGhvbWVCdG4ub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7XG4gICAgICB0b3A6IDAsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgfSk7XG4gICAgcmVtb3ZlSGFzaFVybCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBhYm91dEJ0bi5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tYWJvdXQnKS5zY3JvbGxJbnRvVmlldyh7IFxuICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnIFxuICAgIH0pO1xuICAgIHJlbW92ZUhhc2hVcmwoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gZXZlbnQ7XG59KTtcblxuLy8gU2hpbXMgJiBQb2x5ZmlsbHMgbXNFZGdlXG4oZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID09PSAnZnVuY3Rpb24nKSByZXR1cm4gZmFsc2U7XG4gIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XG4gIHJldHVybiB0cnVlO1xufSgpKTsgLy8gZm9yRWFjaFxuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgY29uc3QgYmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3AnKTtcbiAgYmFja2Ryb3AucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUhhc2hVcmwoKSB7XG4gIGNvbnN0IGxvYyA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgbGV0IHNjcm9sbFY7XG4gIGxldCBzY3JvbGxIO1xuXG4gIGlmICgncmVwbGFjZVN0YXRlJyBpbiBoaXN0b3J5KSB7XG4gICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUoJycsIGRvY3VtZW50LnRpdGxlLCBsb2MucGF0aG5hbWUgKyBsb2Muc2VhcmNoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBQcmV2ZW50IHNjcm9sbGluZyBieSBzdG9yaW5nIHRoZSBwYWdlJ3MgY3VycmVudCBzY3JvbGwgb2Zmc2V0XG4gICAgc2Nyb2xsViA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgIHNjcm9sbEggPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQ7XG5cbiAgICBsb2MuaGFzaCA9ICcnO1xuXG4gICAgLy8gUmVzdG9yZSB0aGUgc2Nyb2xsIG9mZnNldCwgc2hvdWxkIGJlIGZsaWNrZXIgZnJlZVxuICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gc2Nyb2xsVjtcbiAgICBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgPSBzY3JvbGxIO1xuICB9XG59XG4iLCJmdW5jdGlvbiBlbENsYXNzKGVsZW1lbnQgPSAnZGl2JywgY2xhc3NlcyA9IDApIHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnQpO1xuICBpZiAoY2xhc3NlcyAhPT0gMCkge1xuICAgIGlmICgvXFxzLy50ZXN0KGNsYXNzZXMpKSB7XG4gICAgICBjb25zdCBhcnIgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKC4uLmFycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3Nlcyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBlbDtcbn1cblxuZnVuY3Rpb24gbWFrZUJ0bihuYW1lLCBjbGFzc2VzID0gMCkge1xuICBjb25zdCBhcnIgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XG4gIGNvbnN0IGJ1dHRvbiA9IGVsQ2xhc3MoJ2J1dHRvbicsIGNsYXNzZXMpO1xuICBidXR0b24uc2V0QXR0cmlidXRlKCduYW1lJywgbmFtZSk7XG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gIGJ1dHRvbi5pbm5lckhUTUwgPSBuYW1lO1xuICByZXR1cm4gYnV0dG9uO1xufVxuXG5leHBvcnQgeyBlbENsYXNzLCBtYWtlQnRuIH07XG4iXX0=
