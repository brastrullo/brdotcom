(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],2:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./_hide":33,"./_wks":100}],3:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],4:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":42}],5:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./_to-index":88,"./_to-length":91,"./_to-object":92}],6:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./_to-index":88,"./_to-length":91,"./_to-object":92}],7:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":88,"./_to-iobject":90,"./_to-length":91}],8:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./_ctx')
  , IObject  = require('./_iobject')
  , toObject = require('./_to-object')
  , toLength = require('./_to-length')
  , asc      = require('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":10,"./_ctx":19,"./_iobject":38,"./_to-length":91,"./_to-object":92}],9:[function(require,module,exports){
var isObject = require('./_is-object')
  , isArray  = require('./_is-array')
  , SPECIES  = require('./_wks')('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};
},{"./_is-array":40,"./_is-object":42,"./_wks":100}],10:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};
},{"./_array-species-constructor":9}],11:[function(require,module,exports){
'use strict';
var aFunction  = require('./_a-function')
  , isObject   = require('./_is-object')
  , invoke     = require('./_invoke')
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};
},{"./_a-function":1,"./_invoke":37,"./_is-object":42}],12:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":13,"./_wks":100}],13:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],14:[function(require,module,exports){
'use strict';
var dP          = require('./_object-dp').f
  , create      = require('./_object-create')
  , redefineAll = require('./_redefine-all')
  , ctx         = require('./_ctx')
  , anInstance  = require('./_an-instance')
  , defined     = require('./_defined')
  , forOf       = require('./_for-of')
  , $iterDefine = require('./_iter-define')
  , step        = require('./_iter-step')
  , setSpecies  = require('./_set-species')
  , DESCRIPTORS = require('./_descriptors')
  , fastKey     = require('./_meta').fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
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
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./_an-instance":3,"./_ctx":19,"./_defined":20,"./_descriptors":21,"./_for-of":30,"./_iter-define":46,"./_iter-step":48,"./_meta":55,"./_object-create":58,"./_object-dp":59,"./_redefine-all":74,"./_set-species":78}],15:[function(require,module,exports){
'use strict';
var redefineAll       = require('./_redefine-all')
  , getWeak           = require('./_meta').getWeak
  , anObject          = require('./_an-object')
  , isObject          = require('./_is-object')
  , anInstance        = require('./_an-instance')
  , forOf             = require('./_for-of')
  , createArrayMethod = require('./_array-methods')
  , $has              = require('./_has')
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};
},{"./_an-instance":3,"./_an-object":4,"./_array-methods":8,"./_for-of":30,"./_has":32,"./_is-object":42,"./_meta":55,"./_redefine-all":74}],16:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , $export           = require('./_export')
  , redefine          = require('./_redefine')
  , redefineAll       = require('./_redefine-all')
  , meta              = require('./_meta')
  , forOf             = require('./_for-of')
  , anInstance        = require('./_an-instance')
  , isObject          = require('./_is-object')
  , fails             = require('./_fails')
  , $iterDetect       = require('./_iter-detect')
  , setToStringTag    = require('./_set-to-string-tag')
  , inheritIfRequired = require('./_inherit-if-required');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./_an-instance":3,"./_export":25,"./_fails":27,"./_for-of":30,"./_global":31,"./_inherit-if-required":36,"./_is-object":42,"./_iter-detect":47,"./_meta":55,"./_redefine":75,"./_redefine-all":74,"./_set-to-string-tag":79}],17:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],18:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp')
  , createDesc      = require('./_property-desc');

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};
},{"./_object-dp":59,"./_property-desc":73}],19:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":1}],20:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],21:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":27}],22:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":31,"./_is-object":42}],23:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],24:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":64,"./_object-keys":67,"./_object-pie":68}],25:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , hide      = require('./_hide')
  , redefine  = require('./_redefine')
  , ctx       = require('./_ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
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
},{"./_core":17,"./_ctx":19,"./_global":31,"./_hide":33,"./_redefine":75}],26:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./_wks":100}],27:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],28:[function(require,module,exports){
'use strict';
var hide     = require('./_hide')
  , redefine = require('./_redefine')
  , fails    = require('./_fails')
  , defined  = require('./_defined')
  , wks      = require('./_wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};
},{"./_defined":20,"./_fails":27,"./_hide":33,"./_redefine":75,"./_wks":100}],29:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./_an-object":4}],30:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":4,"./_ctx":19,"./_is-array-iter":39,"./_iter-call":44,"./_to-length":91,"./core.get-iterator-method":101}],31:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],32:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],33:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":21,"./_object-dp":59,"./_property-desc":73}],34:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":31}],35:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":21,"./_dom-create":22,"./_fails":27}],36:[function(require,module,exports){
var isObject       = require('./_is-object')
  , setPrototypeOf = require('./_set-proto').set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};
},{"./_is-object":42,"./_set-proto":77}],37:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
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
  } return              fn.apply(that, args);
};
},{}],38:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":13}],39:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":49,"./_wks":100}],40:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":13}],41:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":42}],42:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],43:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object')
  , cof      = require('./_cof')
  , MATCH    = require('./_wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./_cof":13,"./_is-object":42,"./_wks":100}],44:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":4}],45:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":33,"./_object-create":58,"./_property-desc":73,"./_set-to-string-tag":79,"./_wks":100}],46:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":25,"./_has":32,"./_hide":33,"./_iter-create":45,"./_iterators":49,"./_library":51,"./_object-gpo":65,"./_redefine":75,"./_set-to-string-tag":79,"./_wks":100}],47:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":100}],48:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],49:[function(require,module,exports){
module.exports = {};
},{}],50:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":67,"./_to-iobject":90}],51:[function(require,module,exports){
module.exports = false;
},{}],52:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;
},{}],53:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],54:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],55:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":27,"./_has":32,"./_is-object":42,"./_object-dp":59,"./_uid":97}],56:[function(require,module,exports){
var global    = require('./_global')
  , macrotask = require('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./_cof')(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};
},{"./_cof":13,"./_global":31,"./_task":87}],57:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":27,"./_iobject":38,"./_object-gops":64,"./_object-keys":67,"./_object-pie":68,"./_to-object":92}],58:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
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
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":4,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":34,"./_object-dps":60,"./_shared-key":80}],59:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":4,"./_descriptors":21,"./_ie8-dom-define":35,"./_to-primitive":93}],60:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":4,"./_descriptors":21,"./_object-dp":59,"./_object-keys":67}],61:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":21,"./_has":32,"./_ie8-dom-define":35,"./_object-pie":68,"./_property-desc":73,"./_to-iobject":90,"./_to-primitive":93}],62:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":63,"./_to-iobject":90}],63:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":23,"./_object-keys-internal":66}],64:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],65:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":32,"./_shared-key":80,"./_to-object":92}],66:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":7,"./_has":32,"./_shared-key":80,"./_to-iobject":90}],67:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":23,"./_object-keys-internal":66}],68:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],69:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject')
  , isEnum    = require('./_object-pie').f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./_object-keys":67,"./_object-pie":68,"./_to-iobject":90}],70:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN     = require('./_object-gopn')
  , gOPS     = require('./_object-gops')
  , anObject = require('./_an-object')
  , Reflect  = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./_an-object":4,"./_global":31,"./_object-gopn":63,"./_object-gops":64}],71:[function(require,module,exports){
'use strict';
var path      = require('./_path')
  , invoke    = require('./_invoke')
  , aFunction = require('./_a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./_a-function":1,"./_invoke":37,"./_path":72}],72:[function(require,module,exports){
module.exports = require('./_global');
},{"./_global":31}],73:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],74:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};
},{"./_redefine":75}],75:[function(require,module,exports){
var global    = require('./_global')
  , hide      = require('./_hide')
  , has       = require('./_has')
  , SRC       = require('./_uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./_core":17,"./_global":31,"./_has":32,"./_hide":33,"./_uid":97}],76:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],77:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":4,"./_ctx":19,"./_is-object":42,"./_object-gopd":61}],78:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_descriptors":21,"./_global":31,"./_object-dp":59,"./_wks":100}],79:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":32,"./_object-dp":59,"./_wks":100}],80:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":81,"./_uid":97}],81:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":31}],82:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./_an-object')
  , aFunction = require('./_a-function')
  , SPECIES   = require('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":1,"./_an-object":4,"./_wks":100}],83:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":20,"./_to-integer":89}],84:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp')
  , defined  = require('./_defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./_defined":20,"./_is-regexp":43}],85:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length')
  , repeat   = require('./_string-repeat')
  , defined  = require('./_defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":20,"./_string-repeat":86,"./_to-length":91}],86:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./_defined":20,"./_to-integer":89}],87:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":13,"./_ctx":19,"./_dom-create":22,"./_global":31,"./_html":34,"./_invoke":37}],88:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":89}],89:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],90:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":20,"./_iobject":38}],91:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":89}],92:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":20}],93:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":42}],94:[function(require,module,exports){
'use strict';
if(require('./_descriptors')){
  var LIBRARY             = require('./_library')
    , global              = require('./_global')
    , fails               = require('./_fails')
    , $export             = require('./_export')
    , $typed              = require('./_typed')
    , $buffer             = require('./_typed-buffer')
    , ctx                 = require('./_ctx')
    , anInstance          = require('./_an-instance')
    , propertyDesc        = require('./_property-desc')
    , hide                = require('./_hide')
    , redefineAll         = require('./_redefine-all')
    , toInteger           = require('./_to-integer')
    , toLength            = require('./_to-length')
    , toIndex             = require('./_to-index')
    , toPrimitive         = require('./_to-primitive')
    , has                 = require('./_has')
    , same                = require('./_same-value')
    , classof             = require('./_classof')
    , isObject            = require('./_is-object')
    , toObject            = require('./_to-object')
    , isArrayIter         = require('./_is-array-iter')
    , create              = require('./_object-create')
    , getPrototypeOf      = require('./_object-gpo')
    , gOPN                = require('./_object-gopn').f
    , getIterFn           = require('./core.get-iterator-method')
    , uid                 = require('./_uid')
    , wks                 = require('./_wks')
    , createArrayMethod   = require('./_array-methods')
    , createArrayIncludes = require('./_array-includes')
    , speciesConstructor  = require('./_species-constructor')
    , ArrayIterators      = require('./es6.array.iterator')
    , Iterators           = require('./_iterators')
    , $iterDetect         = require('./_iter-detect')
    , setSpecies          = require('./_set-species')
    , arrayFill           = require('./_array-fill')
    , arrayCopyWithin     = require('./_array-copy-within')
    , $DP                 = require('./_object-dp')
    , $GOPD               = require('./_object-gopd')
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
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
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };
},{"./_an-instance":3,"./_array-copy-within":5,"./_array-fill":6,"./_array-includes":7,"./_array-methods":8,"./_classof":12,"./_ctx":19,"./_descriptors":21,"./_export":25,"./_fails":27,"./_global":31,"./_has":32,"./_hide":33,"./_is-array-iter":39,"./_is-object":42,"./_iter-detect":47,"./_iterators":49,"./_library":51,"./_object-create":58,"./_object-dp":59,"./_object-gopd":61,"./_object-gopn":63,"./_object-gpo":65,"./_property-desc":73,"./_redefine-all":74,"./_same-value":76,"./_set-species":78,"./_species-constructor":82,"./_to-index":88,"./_to-integer":89,"./_to-length":91,"./_to-object":92,"./_to-primitive":93,"./_typed":96,"./_typed-buffer":95,"./_uid":97,"./_wks":100,"./core.get-iterator-method":101,"./es6.array.iterator":107}],95:[function(require,module,exports){
'use strict';
var global         = require('./_global')
  , DESCRIPTORS    = require('./_descriptors')
  , LIBRARY        = require('./_library')
  , $typed         = require('./_typed')
  , hide           = require('./_hide')
  , redefineAll    = require('./_redefine-all')
  , fails          = require('./_fails')
  , anInstance     = require('./_an-instance')
  , toInteger      = require('./_to-integer')
  , toLength       = require('./_to-length')
  , gOPN           = require('./_object-gopn').f
  , dP             = require('./_object-dp').f
  , arrayFill      = require('./_array-fill')
  , setToStringTag = require('./_set-to-string-tag')
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;
},{"./_an-instance":3,"./_array-fill":6,"./_descriptors":21,"./_fails":27,"./_global":31,"./_hide":33,"./_library":51,"./_object-dp":59,"./_object-gopn":63,"./_redefine-all":74,"./_set-to-string-tag":79,"./_to-integer":89,"./_to-length":91,"./_typed":96}],96:[function(require,module,exports){
var global = require('./_global')
  , hide   = require('./_hide')
  , uid    = require('./_uid')
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};
},{"./_global":31,"./_hide":33,"./_uid":97}],97:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],98:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":17,"./_global":31,"./_library":51,"./_object-dp":59,"./_wks-ext":99}],99:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":100}],100:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":31,"./_shared":81,"./_uid":97}],101:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":12,"./_core":17,"./_iterators":49,"./_wks":100}],102:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {copyWithin: require('./_array-copy-within')});

require('./_add-to-unscopables')('copyWithin');
},{"./_add-to-unscopables":2,"./_array-copy-within":5,"./_export":25}],103:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {fill: require('./_array-fill')});

require('./_add-to-unscopables')('fill');
},{"./_add-to-unscopables":2,"./_array-fill":6,"./_export":25}],104:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":2,"./_array-methods":8,"./_export":25}],105:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":2,"./_array-methods":8,"./_export":25}],106:[function(require,module,exports){
'use strict';
var ctx            = require('./_ctx')
  , $export        = require('./_export')
  , toObject       = require('./_to-object')
  , call           = require('./_iter-call')
  , isArrayIter    = require('./_is-array-iter')
  , toLength       = require('./_to-length')
  , createProperty = require('./_create-property')
  , getIterFn      = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":18,"./_ctx":19,"./_export":25,"./_is-array-iter":39,"./_iter-call":44,"./_iter-detect":47,"./_to-length":91,"./_to-object":92,"./core.get-iterator-method":101}],107:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":2,"./_iter-define":46,"./_iter-step":48,"./_iterators":49,"./_to-iobject":90}],108:[function(require,module,exports){
'use strict';
var $export        = require('./_export')
  , createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});
},{"./_create-property":18,"./_export":25,"./_fails":27}],109:[function(require,module,exports){
var dP         = require('./_object-dp').f
  , createDesc = require('./_property-desc')
  , has        = require('./_has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';

var isExtensible = Object.isExtensible || function(){
  return true;
};

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    try {
      var that = this
        , name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch(e){
      return '';
    }
  }
});
},{"./_descriptors":21,"./_has":32,"./_object-dp":59,"./_property-desc":73}],110:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.1 Map Objects
module.exports = require('./_collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./_collection":16,"./_collection-strong":14}],111:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export')
  , log1p   = require('./_math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./_export":25,"./_math-log1p":53}],112:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export')
  , $asinh  = Math.asinh;

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});
},{"./_export":25}],113:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export')
  , $atanh  = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./_export":25}],114:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export')
  , sign    = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./_export":25,"./_math-sign":54}],115:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./_export":25}],116:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./_export":25}],117:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export')
  , $expm1  = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});
},{"./_export":25,"./_math-expm1":52}],118:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./_export')
  , sign      = require('./_math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./_export":25,"./_math-sign":54}],119:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./_export":25}],120:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./_export":25,"./_fails":27}],121:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./_export":25}],122:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', {log1p: require('./_math-log1p')});
},{"./_export":25,"./_math-log1p":53}],123:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./_export":25}],124:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', {sign: require('./_math-sign')});
},{"./_export":25,"./_math-sign":54}],125:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./_export":25,"./_fails":27,"./_math-expm1":52}],126:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./_export":25,"./_math-expm1":52}],127:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./_export":25}],128:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./_export":25}],129:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./_export')
  , _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./_export":25,"./_global":31}],130:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":25,"./_is-integer":41}],131:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./_export":25}],132:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./_export')
  , isInteger = require('./_is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./_export":25,"./_is-integer":41}],133:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./_export":25}],134:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./_export":25}],135:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":25,"./_object-assign":57}],136:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', {is: require('./_same-value')});
},{"./_export":25,"./_same-value":76}],137:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":25,"./_set-proto":77}],138:[function(require,module,exports){
'use strict';
var LIBRARY            = require('./_library')
  , global             = require('./_global')
  , ctx                = require('./_ctx')
  , classof            = require('./_classof')
  , $export            = require('./_export')
  , isObject           = require('./_is-object')
  , aFunction          = require('./_a-function')
  , anInstance         = require('./_an-instance')
  , forOf              = require('./_for-of')
  , speciesConstructor = require('./_species-constructor')
  , task               = require('./_task').set
  , microtask          = require('./_microtask')()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
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
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_a-function":1,"./_an-instance":3,"./_classof":12,"./_core":17,"./_ctx":19,"./_export":25,"./_for-of":30,"./_global":31,"./_is-object":42,"./_iter-detect":47,"./_library":51,"./_microtask":56,"./_redefine-all":74,"./_set-species":78,"./_set-to-string-tag":79,"./_species-constructor":82,"./_task":87,"./_wks":100}],139:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , anObject  = require('./_an-object')
  , rApply    = (require('./_global').Reflect || {}).apply
  , fApply    = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function(){
  rApply(function(){});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    var T = aFunction(target)
      , L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});
},{"./_a-function":1,"./_an-object":4,"./_export":25,"./_fails":27,"./_global":31}],140:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export    = require('./_export')
  , create     = require('./_object-create')
  , aFunction  = require('./_a-function')
  , anObject   = require('./_an-object')
  , isObject   = require('./_is-object')
  , fails      = require('./_fails')
  , bind       = require('./_bind')
  , rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function(){
  function F(){}
  return !(rConstruct(function(){}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function(){
  rConstruct(function(){});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(ARGS_BUG && !NEW_TARGET_BUG)return rConstruct(Target, args, newTarget);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./_a-function":1,"./_an-object":4,"./_bind":11,"./_export":25,"./_fails":27,"./_global":31,"./_is-object":42,"./_object-create":58}],141:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = require('./_object-dp')
  , $export     = require('./_export')
  , anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":4,"./_export":25,"./_fails":27,"./_object-dp":59,"./_to-primitive":93}],142:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./_export')
  , gOPD     = require('./_object-gopd').f
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./_an-object":4,"./_export":25,"./_object-gopd":61}],143:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = require('./_object-gopd')
  , $export  = require('./_export')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});
},{"./_an-object":4,"./_export":25,"./_object-gopd":61}],144:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./_export')
  , getProto = require('./_object-gpo')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./_an-object":4,"./_export":25,"./_object-gpo":65}],145:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , isObject       = require('./_is-object')
  , anObject       = require('./_an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./_an-object":4,"./_export":25,"./_has":32,"./_is-object":42,"./_object-gopd":61,"./_object-gpo":65}],146:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./_export":25}],147:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./_export')
  , anObject      = require('./_an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./_an-object":4,"./_export":25}],148:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', {ownKeys: require('./_own-keys')});
},{"./_export":25,"./_own-keys":70}],149:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./_export')
  , anObject           = require('./_an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":4,"./_export":25}],150:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./_export')
  , setProto = require('./_set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_export":25,"./_set-proto":77}],151:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = require('./_object-dp')
  , gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , createDesc     = require('./_property-desc')
  , anObject       = require('./_an-object')
  , isObject       = require('./_is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./_an-object":4,"./_export":25,"./_has":32,"./_is-object":42,"./_object-dp":59,"./_object-gopd":61,"./_object-gpo":65,"./_property-desc":73}],152:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if(require('./_descriptors') && /./g.flags != 'g')require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});
},{"./_descriptors":21,"./_flags":29,"./_object-dp":59}],153:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});
},{"./_fix-re-wks":28}],154:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});
},{"./_fix-re-wks":28}],155:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});
},{"./_fix-re-wks":28}],156:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = require('./_is-regexp')
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
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
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});
},{"./_fix-re-wks":28,"./_is-regexp":43}],157:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.2 Set Objects
module.exports = require('./_collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./_collection":16,"./_collection-strong":14}],158:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $at     = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./_export":25,"./_string-at":83}],159:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./_export')
  , toLength  = require('./_to-length')
  , context   = require('./_string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./_export":25,"./_fails-is-regexp":26,"./_string-context":84,"./_to-length":91}],160:[function(require,module,exports){
var $export        = require('./_export')
  , toIndex        = require('./_to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./_export":25,"./_to-index":88}],161:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./_export')
  , context  = require('./_string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./_export":25,"./_fails-is-regexp":26,"./_string-context":84}],162:[function(require,module,exports){
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./_export":25,"./_to-iobject":90,"./_to-length":91}],163:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});
},{"./_export":25,"./_string-repeat":86}],164:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./_export')
  , toLength    = require('./_to-length')
  , context     = require('./_string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./_export":25,"./_fails-is-regexp":26,"./_string-context":84,"./_to-length":91}],165:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
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
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
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
},{"./_an-object":4,"./_descriptors":21,"./_enum-keys":24,"./_export":25,"./_fails":27,"./_global":31,"./_has":32,"./_hide":33,"./_is-array":40,"./_keyof":50,"./_library":51,"./_meta":55,"./_object-create":58,"./_object-dp":59,"./_object-gopd":61,"./_object-gopn":63,"./_object-gopn-ext":62,"./_object-gops":64,"./_object-keys":67,"./_object-pie":68,"./_property-desc":73,"./_redefine":75,"./_set-to-string-tag":79,"./_shared":81,"./_to-iobject":90,"./_to-primitive":93,"./_uid":97,"./_wks":100,"./_wks-define":98,"./_wks-ext":99}],166:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $typed       = require('./_typed')
  , buffer       = require('./_typed-buffer')
  , anObject     = require('./_an-object')
  , toIndex      = require('./_to-index')
  , toLength     = require('./_to-length')
  , isObject     = require('./_is-object')
  , ArrayBuffer  = require('./_global').ArrayBuffer
  , speciesConstructor = require('./_species-constructor')
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);
},{"./_an-object":4,"./_export":25,"./_fails":27,"./_global":31,"./_is-object":42,"./_set-species":78,"./_species-constructor":82,"./_to-index":88,"./_to-length":91,"./_typed":96,"./_typed-buffer":95}],167:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":94}],168:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":94}],169:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":94}],170:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":94}],171:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":94}],172:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":94}],173:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":94}],174:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":94}],175:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);
},{"./_typed-array":94}],176:[function(require,module,exports){
'use strict';
var each         = require('./_array-methods')(0)
  , redefine     = require('./_redefine')
  , meta         = require('./_meta')
  , assign       = require('./_object-assign')
  , weak         = require('./_collection-weak')
  , isObject     = require('./_is-object')
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./_array-methods":8,"./_collection":16,"./_collection-weak":15,"./_is-object":42,"./_meta":55,"./_object-assign":57,"./_redefine":75}],177:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');

// 23.4 WeakSet Objects
require('./_collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./_collection":16,"./_collection-weak":15}],178:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export   = require('./_export')
  , $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');
},{"./_add-to-unscopables":2,"./_array-includes":7,"./_export":25}],179:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export  = require('./_export')
  , $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./_export":25,"./_object-to-array":69}],180:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export        = require('./_export')
  , ownKeys        = require('./_own-keys')
  , toIObject      = require('./_to-iobject')
  , gOPD           = require('./_object-gopd')
  , createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key;
    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});
},{"./_create-property":18,"./_export":25,"./_object-gopd":61,"./_own-keys":70,"./_to-iobject":90}],181:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export')
  , $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./_export":25,"./_object-to-array":69}],182:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./_export":25,"./_string-pad":85}],183:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./_export":25,"./_string-pad":85}],184:[function(require,module,exports){
var $iterators    = require('./es6.array.iterator')
  , redefine      = require('./_redefine')
  , global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , wks           = require('./_wks')
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}
},{"./_global":31,"./_hide":33,"./_iterators":49,"./_redefine":75,"./_wks":100,"./es6.array.iterator":107}],185:[function(require,module,exports){
var $export = require('./_export')
  , $task   = require('./_task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./_export":25,"./_task":87}],186:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./_global')
  , $export    = require('./_export')
  , invoke     = require('./_invoke')
  , partial    = require('./_partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./_export":25,"./_global":31,"./_invoke":37,"./_partial":71}],187:[function(require,module,exports){
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

},{}],188:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! VelocityJS.org (1.5.0). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
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
        if (g) for (; e < f && c.apply(a[e], d) !== !1; e++) {} else for (e in a) {
          if (a.hasOwnProperty(e) && c.apply(a[e], d) === !1) break;
        }
      } else if (g) for (; e < f && c.call(a[e], e, a[e]) !== !1; e++) {} else for (e in a) {
        if (a.hasOwnProperty(e) && c.call(a[e], e, a[e]) === !1) break;
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
            }a.length = e, a;
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
          for (var b = a.offsetParent; b && "html" !== b.nodeName.toLowerCase() && b.style && "static" === b.style.position;) {
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
      var c = a;return u.isString(a) ? y.Easings[a] || (c = !1) : c = u.isArray(a) && 1 === a.length ? j.apply(null, a) : u.isArray(a) && 2 === a.length ? z.apply(null, a.concat([b])) : !(!u.isArray(a) || 4 !== a.length) && k.apply(null, a), c === !1 && (c = y.Easings[y.defaults.easing] ? y.defaults.easing : x), c;
    }function m(a) {
      if (a) {
        var b = y.timestamp && a !== !0 ? a : r.now(),
            c = y.State.calls.length;c > 1e4 && (y.State.calls = e(y.State.calls), c = y.State.calls.length);for (var f = 0; f < c; f++) {
          if (y.State.calls[f]) {
            var h = y.State.calls[f],
                i = h[0],
                j = h[2],
                k = h[3],
                l = !!k,
                q = null,
                s = h[5],
                t = h[6];if (k || (k = y.State.calls[f][3] = b - 16), s) {
              if (s.resume !== !0) continue;k = h[3] = Math.round(b - t - 16), h[5] = null;
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
        var l = c[j].element;b || f.loop || ("none" === f.display && A.setPropertyValue(l, "display", f.display), "hidden" === f.visibility && A.setPropertyValue(l, "visibility", f.visibility));var m = g(l);if (f.loop !== !0 && (o.queue(l)[1] === d || !/\.velocityQueueEntryFlag/i.test(o.queue(l)[1])) && m) {
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
        }h && f.loop !== !0 && h(e), m && f.loop === !0 && !b && (o.each(m.tweensContainer, function (a, b) {
          if (/^rotate/.test(a) && (parseFloat(b.startValue) - parseFloat(b.endValue)) % 360 == 0) {
            var c = b.startValue;b.startValue = b.endValue, b.endValue = c;
          }/^backgroundPosition/.test(a) && 100 === parseFloat(b.endValue) && "%" === b.unitType && (b.endValue = 0, b.startValue = 100);
        }), y(l, "reverse", { loop: !0, delay: f.delay })), f.queue !== !1 && o.dequeue(l, f.queue);
      }y.State.calls[a] = !1;for (var p = 0, q = y.State.calls.length; p < q; p++) {
        if (y.State.calls[p] !== !1) {
          i = !0;break;
        }
      }i === !1 && (y.State.isTicking = !1, delete y.State.calls, y.State.calls = []);
    }var o,
        p = function () {
      if (c.documentMode) return c.documentMode;for (var a = 7; a > 4; a--) {
        var b = c.createElement("div");if (b.innerHTML = "<!--[if IE " + a + "]><span></span><![endif]-->", b.getElementsByTagName("span").length) return b = null, a;
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
        y = { State: { isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), isAndroid: /Android/i.test(navigator.userAgent), isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent), isChrome: b.chrome, isFirefox: /Firefox/i.test(navigator.userAgent), prefixElement: c.createElement("div"), prefixMatches: {}, scrollAnchor: null, scrollPropertyLeft: null, scrollPropertyTop: null, isTicking: !1, calls: [], delayedElements: { count: 0 } }, CSS: {}, Utilities: o, Redirects: {}, Easings: {}, Promise: b.Promise, defaults: { queue: "", duration: w, easing: x, begin: d, complete: d, progress: d, display: d, visibility: d, loop: !1, delay: !1, mobileHA: !0, _cacheValues: !0, promiseRejectEmpty: !0 }, init: function init(a) {
        o.data(a, "velocity", { isSVG: u.isSVG(a), isAnimating: !1, computedStyle: null, tweensContainer: null, rootPropertyValueCache: {}, transformCache: {} });
      }, hook: null, mock: !1, version: { major: 1, minor: 5, patch: 0 }, debug: !1, timestamp: !0, pauseAll: function pauseAll(a) {
        var b = new Date().getTime();o.each(y.State.calls, function (b, c) {
          if (c) {
            if (a !== d && (c[2].queue !== a || c[2].queue === !1)) return !0;c[5] = { resume: !1 };
          }
        }), o.each(y.State.delayedElements, function (a, c) {
          c && h(c, b);
        });
      }, resumeAll: function resumeAll(a) {
        var b = new Date().getTime();o.each(y.State.calls, function (b, c) {
          if (c) {
            if (a !== d && (c[2].queue !== a || c[2].queue === !1)) return !0;c[5] && (c[5].resume = !0);
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
            return A.Lists.colorNames.hasOwnProperty(c) ? (b ? b : "rgba(") + A.Lists.colorNames[c] + (b ? "" : ",1)") : b + c;
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
                return "opacity";case "extract":
                return c;case "inject":
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
                        y.State.isAndroid && g(c).transformCache[a] === d && e < 1 && (e = 1), f = !/(\d)$/i.test(e);break;case "skew":
                        f = !/(deg|\d)$/i.test(e);break;case "rotate":
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
              c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;return a = a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (a, b, c, d) {
            return b + b + c + c + d + d;
          }), b = c.exec(a), b ? [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16)] : [0, 0, 0];
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
            k = g(a), k && k.tweensContainer && k.isAnimating === !0 && (n = k.tweensContainer);var H = function H(e, f) {
              var g,
                  l = A.Hooks.getRoot(e),
                  m = !1,
                  p = f[0],
                  q = f[1],
                  r = f[2];if (!(k && k.isSVG || "tween" === l || A.Names.prefixCheck(l)[1] !== !1 || A.Normalizations.registered[l] !== d)) return void (y.debug && console.log("Skipping [" + l + "] due to a lack of browser support."));(i.display !== d && null !== i.display && "none" !== i.display || i.visibility !== d && "hidden" !== i.visibility) && /opacity|filter/.test(e) && !r && 0 !== p && (r = 0), i._cacheValues && n && n[e] ? (r === d && (r = n[e].endValue + n[e].unitType), m = k.rootPropertyValueCache[l]) : A.Hooks.registered[e] ? r === d ? (m = A.getPropertyValue(a, l), r = A.getPropertyValue(a, e, m)) : m = A.Hooks.templates[l][1] : r === d && (r = A.getPropertyValue(a, e));var s,
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
          }j.element && (A.Values.addClass(a, "velocity-animating"), N.push(j), k = g(a), k && ("" === i.queue && (k.tweensContainer = j, k.opts = i), k.isAnimating = !0), D === C - 1 ? (y.State.calls.push([N, r, i, null, z.resolver, null, 0]), y.State.isTicking === !1 && (y.State.isTicking = !0, m())) : D++);
        }var h,
            i = o.extend({}, y.defaults, v),
            j = {};switch (g(a) === d && y.init(a), parseFloat(i.delay) && i.queue !== !1 && o.queue(a, i.queue, function (b) {
          y.velocityQueueEntryFlag = !0;var c = y.State.delayedElements.count++;y.State.delayedElements[c] = a;var d = function (a) {
            return function () {
              y.State.delayedElements[a] = !1, b();
            };
          }(c);g(a).delayBegin = new Date().getTime(), g(a).delay = parseFloat(i.delay), g(a).delayTimer = { setTimeout: setTimeout(b, parseFloat(i.delay)), next: d };
        }), i.duration.toString().toLowerCase()) {case "fast":
            i.duration = 200;break;case "normal":
            i.duration = w;break;case "slow":
            i.duration = 600;break;default:
            i.duration = parseFloat(i.duration) || 1;}if (y.mock !== !1 && (y.mock === !0 ? i.duration = i.delay = 1 : (i.duration *= parseFloat(y.mock) || 1, i.delay *= parseFloat(y.mock) || 1)), i.easing = l(i.easing, i.duration), i.begin && !u.isFunction(i.begin) && (i.begin = null), i.progress && !u.isFunction(i.progress) && (i.progress = null), i.complete && !u.isFunction(i.complete) && (i.complete = null), i.display !== d && null !== i.display && (i.display = i.display.toString().toLowerCase(), "auto" === i.display && (i.display = y.CSS.Values.getDisplayType(a))), i.visibility !== d && null !== i.visibility && (i.visibility = i.visibility.toString().toLowerCase()), i.mobileHA = i.mobileHA && y.State.isMobile && !y.State.isGingerbread, i.queue === !1) {
          if (i.delay) {
            var k = y.State.delayedElements.count++;y.State.delayedElements[k] = a;var n = function (a) {
              return function () {
                y.State.delayedElements[a] = !1, f();
              };
            }(k);g(a).delayBegin = new Date().getTime(), g(a).delay = parseFloat(i.delay), g(a).delayTimer = { setTimeout: setTimeout(f, parseFloat(i.delay)), next: n };
          } else f();
        } else o.queue(a, i.queue, function (a, b) {
          if (b === !0) return z.promise && z.resolver(r), !0;y.velocityQueueEntryFlag = !0, f(a);
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
      })), x ? (s = arguments[0].properties || arguments[0].p, v = arguments[0].options || arguments[0].o) : (s = arguments[q], v = arguments[q + 1]), !(r = f(r))) return void (z.promise && (s && v && v.promiseRejectEmpty === !1 ? z.resolver() : z.rejecter()));var C = r.length,
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
              var f = v === d ? "" : v;return f !== !0 && b[2].queue !== f && (v !== d || b[2].queue !== !1) || (o.each(r, function (a, d) {
                if (d === e) return b[5] = { resume: !1 }, c = !0, !1;
              }), !c && void 0);
            });
          }), a();case "resume":
          return o.each(r, function (a, b) {
            i(b, H);
          }), o.each(y.State.calls, function (a, b) {
            var c = !1;b && o.each(b[1], function (a, e) {
              var f = v === d ? "" : v;return f !== !0 && b[2].queue !== f && (v !== d || b[2].queue !== !1) || !b[5] || (o.each(r, function (a, d) {
                if (d === e) return b[5].resume = !0, c = !0, !1;
              }), !c && void 0);
            });
          }), a();case "finish":case "finishAll":case "stop":
          o.each(r, function (a, b) {
            g(b) && g(b).delayTimer && (clearTimeout(g(b).delayTimer.setTimeout), g(b).delayTimer.next && g(b).delayTimer.next(), delete g(b).delayTimer), "finishAll" !== s || v !== !0 && !u.isString(v) || (o.each(o.queue(b, u.isString(v) ? v : ""), function (a, b) {
              u.isFunction(b) && b();
            }), o.queue(b, u.isString(v) ? v : "", []));
          });var I = [];return o.each(y.State.calls, function (a, b) {
            b && o.each(b[1], function (c, e) {
              var f = v === d ? "" : v;if (f !== !0 && b[2].queue !== f && (v !== d || b[2].queue !== !1)) return !0;o.each(r, function (c, d) {
                if (d === e) if ((v === !0 || u.isString(v)) && (o.each(o.queue(d, u.isString(v) ? v : ""), function (a, b) {
                  u.isFunction(b) && b(null, !0);
                }), o.queue(d, u.isString(v) ? v : "", [])), "stop" === s) {
                  var h = g(d);h && h.tweensContainer && f !== !1 && o.each(h.tweensContainer, function (a, b) {
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
                  K = j.delay || 0;return j.backwards === !0 && (r = o.extend(!0, [], r).reverse()), o.each(r, function (a, b) {
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

},{}],189:[function(require,module,exports){
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
              if (l && e.Redirects[a](d, g, h, i, j, k, l === !0 || Math.max(0, l - 1)), b.reset) {
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
              i = g && g.sequenceQueue === !1 ? "begin" : "complete",
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

},{}],190:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = animateMenuItem;

var _utils = require('../utils');

function animateMenuItem() {
  var menuItems = document.querySelectorAll('.menu-item');
  var listItems = document.querySelectorAll('#main-nav li');

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

    pipe1.innerHTML = '|';
    str.innerHTML = str.innerHTML.toUpperCase() + ' |';
    str.appendChild(pipe1);
  }

  function animatePipe(e) {
    var spaceWidth = 5;
    var w = e.target.offsetWidth;
    var pipe = this.querySelector('div');
    pipe.style = '\n      opacity: 1;\n      transform: translate(' + (-w - spaceWidth) + 'px);\n    ';
  }

  function unAnimatePipe(e) {
    var w = e.target.offsetWidth;
    var pipe = this.querySelector('div');
    pipe.style = '\n      opacity: 0;\n      transform: translate(0px);\n    ';
  }
}

},{"../utils":202}],191:[function(require,module,exports){
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

},{}],192:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var file = function file() {
  var src = void 0;
  var val = void 0;
  var base = 'https://brastrullo.github.io/resume/';
  var pdf = base + 'BradR-JSDev.pdf';
  var doc = ['BradR-JSDev.pdf', 'BradR-JSDev.doc'];

  function setSrc() {
    switch (val) {
      case 'html':
        src = base;
        break;
      case 'pdf':
        src = base + doc[0];
        break;
      case 'doc':
        src = base + doc[1];
        break;
      default:
        src = base;
    }
  }

  function setVal(filetype) {
    val = filetype;setSrc();
  }
  function getVal() {
    return val;
  }
  function getSrc() {
    return src;
  }
  function getPdf() {
    return pdf;
  }

  return {
    setVal: setVal,
    getVal: getVal,
    getSrc: getSrc,
    getPdf: getPdf
  };
}();

exports.default = file;

},{}],193:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;

var _loadingScreen = require('./loadingScreen');

var _loadingScreen2 = _interopRequireDefault(_loadingScreen);

var _animateMenuItem = require('./animateMenuItem');

var _animateMenuItem2 = _interopRequireDefault(_animateMenuItem);

var _dimUI = require('./dimUI');

var _dimUI2 = _interopRequireDefault(_dimUI);

var _introAnimation = require('./introAnimation');

var _introAnimation2 = _interopRequireDefault(_introAnimation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loader() {
  (0, _loadingScreen2.default)();
  (0, _animateMenuItem2.default)();
  (0, _introAnimation2.default)();
  (0, _dimUI2.default)();
}

},{"./animateMenuItem":190,"./dimUI":191,"./introAnimation":194,"./loadingScreen":195}],194:[function(require,module,exports){
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

},{}],195:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logo = require('./svg/logo');

var _logo2 = _interopRequireDefault(_logo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadingScreen() {
  var backdrop = document.getElementById('backdrop');
  backdrop.classList.add('loading-screen-backdrop');
  backdrop.style.background = pastelColors();
  document.body.style = 'overflow: hidden';
  backdrop.insertBefore((0, _logo2.default)(), backdrop.childNodes[0]);

  window.setTimeout(showLoading, 200);
}

function showLoading() {
  var path = document.getElementById('loadingBar');
  var length = path.getTotalLength();

  path.style.transition = 'none';
  path.style.WebkitTransition = 'none';
  path.style = 'opacity: 1';
  path.style.strokeDasharray = length + ' ' + length;
  path.style.strokeDashoffset = length;
  path.getBoundingClientRect();
  path.style.transition = 'stroke-dashoffset 150ms ease-in';
  path.style.WebkitTransition = 'stroke-dashoffset 150ms ease-in';
  path.style.strokeDashoffset = '0';

  function start() {
    var backdrop = document.getElementById('backdrop');
    backdrop.remove();
    document.body.style = 'overflow: unset';
  }

  window.setTimeout(start, 350);
  window.scrollTo(0, 0);
  return true;
}

function pastelColors() {
  var r = (Math.round(Math.random() * 127) + 127).toString(16);
  var g = (Math.round(Math.random() * 127) + 127).toString(16);
  var b = (Math.round(Math.random() * 127) + 127).toString(16);
  return '#' + r + g + b;
}

exports.default = loadingScreen;

},{"./svg/logo":197}],196:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = modal;

var _docHandler = require('./docHandler');

var _docHandler2 = _interopRequireDefault(_docHandler);

var _viewHandler = require('./viewHandler');

var _viewHandler2 = _interopRequireDefault(_viewHandler);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function modal() {
  (function addModal() {
    var bg = (0, _utils.elClass)('div', 'modal-background');
    var wrapper = (0, _utils.elClass)('div', 'modal-wrapper');
    var menu = modalMenu();
    var content = modalContent();
    document.body.appendChild(bg);
    bg.appendChild(wrapper);
    wrapper.appendChild(menu);
    wrapper.appendChild(content);
  })();

  function modalMenu() {
    var menu = (0, _utils.elClass)('div', 'modal-menu');
    var dropdown = docViewDropdown();
    var switchBtn = fileTypeSwitch();
    var downloadBtn = downloadButtton();
    var printBtn = (0, _utils.makeBtn)('print', 'print-btn btn');
    var shareBtn = (0, _utils.makeBtn)('share', 'share-btn btn');
    var closeBtn = (0, _utils.makeBtn)('close', 'close-btn btn');
    var column1 = (0, _utils.elClass)('div', 'options-view');
    var column2 = (0, _utils.elClass)('div', 'options-actions');

    closeBtn.onclick = closeModal;

    menu.appendChild(column1);
    menu.appendChild(column2);

    column1.appendChild(dropdown);
    column1.appendChild(switchBtn);

    column2.appendChild(downloadBtn);
    column2.appendChild(printBtn);
    column2.appendChild(shareBtn);
    column2.appendChild(closeBtn);

    printBtn.innerHTML = 'print';

    return menu;

    function closeModal() {
      document.body.querySelector('.modal-background').remove();
    }
  }

  function modalContent() {
    var iframe = (0, _utils.elClass)('iframe', 'resume-viewer');
    iframe.setAttribute('src', 'https://brastrullo.github.io/resume/');
    iframe.setAttribute('title', 'resume');
    iframe.innerHTML = '<p>Your browser does not support iframes.</p>';
    return iframe;
  }

  function docViewDropdown() {
    var dropdown = (0, _utils.elClass)('select', 'doc-view');
    dropdown.innerHTML = '\n      <option value=\'html\' selected>HTML</option>\n      <option value=\'pdf\'>PDF/DOC</option>\n    ';

    dropdown.addEventListener('change', updateView);

    function updateView() {
      _docHandler2.default.setVal(this.value);
      (0, _viewHandler2.default)();
    }
    return dropdown;
  }

  function fileTypeSwitch() {
    var switchBtn = (0, _utils.elClass)('label', 'file-type switch hidden');
    var checkbox = (0, _utils.elClass)('input', 'file-type checkbox');
    var slider = (0, _utils.elClass)('span', 'file-type slider round');

    checkbox.setAttribute('type', 'checkbox');
    switchBtn.appendChild(checkbox);
    switchBtn.appendChild(slider);

    switchBtn.addEventListener('click', toggleFileType);
    return switchBtn;

    function toggleFileType() {
      var downloadBtn = document.querySelector('.download-btn.btn');
      var printBtn = document.querySelector('.print-btn.btn');

      var val = checkbox.checked ? 'doc' : 'pdf';
      _docHandler2.default.setVal(val);
      downloadBtn.setAttribute('href', _docHandler2.default.getSrc());
      downloadBtn.setAttribute('download', 'brastrullo-jsdev-resume.' + val);
      downloadBtn.innerHTML = 'download ';

      printBtn.setAttribute('print', _docHandler2.default.getSrc());
      printBtn.innerHTML = 'print';
    }
  }

  function downloadButtton() {
    var button = (0, _utils.elClass)('a', 'download-btn btn hidden');
    button.setAttribute('href', 'https://brastrullo.github.io/resume/BradR-JSDev.pdf');
    button.setAttribute('download', 'brastrullo-jsdev-resume.pdf');
    button.innerHTML = 'download';
    return button;
  }
}

},{"../utils":202,"./docHandler":192,"./viewHandler":200}],197:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = logo;
function logo() {
  var mainLogo = document.createElement('div'); // eslint-disable-line no-shadow
  mainLogo.innerHTML = '\n    <svg xmlns=\'http://www.w3.org/2000/svg\' class=\'svg-logo\' width=\'200\' height=\'200\' viewbox=\'0 0 500 500\'>\n      <g>\n        <text x=\'110\' y=\'250\' font-family=\'Helvetica\' font-size=\'180\' fill=\'rgba(30, 30, 30, .8)\'>\n          b||r\n        </text>\n        <path id=\'loadingBar\' d=\'M90 330 h 320\' style=\'opacity: 0;\' stroke-width=20 stroke=\'rgba(230, 230, 230, .8)\' />\n      </g>\n    </svg>\n  ';
  return mainLogo;
}

},{}],198:[function(require,module,exports){
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

},{"../../utils":202}],199:[function(require,module,exports){
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
    button.classList = button.className.replace(/\b(off)/, 'on');
    stagger.show();
    text.innerHTML = 'close';
    homeLink.focus();
    animateMenu.open();
  }

  function closeMenu() {
    button.classList = button.className.replace(/\b(on)/, 'off');
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
    mainNav.style = 'display: block';
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
      mainNav.style = 'display: none';
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
    var topSeq = [{ e: b1, p: { translateY: 6 }, o: { duration: '100ms' } }, { e: b1, p: { rotateZ: 45 }, o: { duration: '100ms' } }];
    var bottomSeq = [{ e: b3, p: { translateY: -6 }, o: { duration: '100ms' } }, { e: b3, p: { rotateZ: -45 }, o: { duration: '100ms' } }];

    b1.setAttribute('transform-origin', 'center center 0');
    b3.setAttribute('transform-origin', 'center center 0');
    Velocity.RunSequence(topSeq);
    Velocity(b2, { opacity: 0 }, 100);
    Velocity.RunSequence(bottomSeq);
  }

  function animateCloseBtn() {
    var topLine = [{ e: b1, p: { rotateZ: 0 }, o: { duration: '100ms' } }, { e: b1, p: { translateY: 0 }, o: { duration: '100ms' } }];
    var bottomLine = [{ e: b3, p: { rotateZ: 0 }, o: { duration: '100ms' } }, { e: b3, p: { translateY: 0 }, o: { duration: '100ms' } }];

    Velocity.RunSequence(topLine);
    Velocity(b2, 'reverse', 100);
    Velocity.RunSequence(bottomLine);
  }

  return {
    open: animateOpenBtn,
    close: animateCloseBtn
  };
}();

},{"../../node_modules/velocity-animate/velocity.min.js":188,"../../node_modules/velocity-animate/velocity.ui.min.js":189}],200:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = viewHandler;

var _docHandler = require('./docHandler');

var _docHandler2 = _interopRequireDefault(_docHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function viewHandler() {
  var downloadBtn = document.querySelector('.download-btn.btn');
  var iframe = document.querySelector('.resume-viewer');
  var switchBtn = document.querySelector('.file-type.switch');

  iframe.setAttribute('src', _docHandler2.default.getSrc());

  switch (_docHandler2.default.getVal()) {
    case 'html':
      switchBtn.classList.add('hidden');
      switchBtn.setAttribute('disabled', '');
      downloadBtn.classList.add('hidden');
      downloadBtn.setAttribute('disabled', '');
      downloadBtn.removeAttribute('src');
      break;
    case 'pdf':
    case 'doc':
      switchBtn.classList.remove('hidden');
      switchBtn.removeAttribute('disabled');
      downloadBtn.classList.remove('hidden');
      downloadBtn.removeAttribute('disabled');
      break;
    default:
      break;
  }
}

},{"./docHandler":192}],201:[function(require,module,exports){
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

var _modal = require('./components/modal');

var _modal2 = _interopRequireDefault(_modal);

var _docHandler = require('./components/docHandler');

var _docHandler2 = _interopRequireDefault(_docHandler);

var _scrollChevron = require('./components/svg/scrollChevron');

var _importLoader = require('./components/importLoader');

var _importLoader2 = _interopRequireDefault(_importLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function (event) {
  var menuButton = document.getElementById('menu-button');
  var resumeButton = document.querySelector('#resumeViewer');
  var homeSection = document.querySelector('.section-home');
  var scrollChevron = (0, _scrollChevron.downChevron)();

  menuButton.onclick = _toggleMenu2.default;
  resumeButton.onclick = _modal2.default;
  document.querySelector('#cr-year').innerHTML = '- ' + new Date().getFullYear();

  (0, _importLoader2.default)();
  document.body.style = 'display: block';
  menuButton.focus();
  homeSection.appendChild(scrollChevron);
  return event;
}); /* eslint import/first: 0 no-undef: 0 */

},{"./components/docHandler":192,"./components/importLoader":193,"./components/modal":196,"./components/svg/scrollChevron":198,"./components/toggleMenu":199,"core-js/modules/es6.array.copy-within":102,"core-js/modules/es6.array.fill":103,"core-js/modules/es6.array.find":105,"core-js/modules/es6.array.find-index":104,"core-js/modules/es6.array.from":106,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.array.of":108,"core-js/modules/es6.function.name":109,"core-js/modules/es6.map":110,"core-js/modules/es6.math.acosh":111,"core-js/modules/es6.math.asinh":112,"core-js/modules/es6.math.atanh":113,"core-js/modules/es6.math.cbrt":114,"core-js/modules/es6.math.clz32":115,"core-js/modules/es6.math.cosh":116,"core-js/modules/es6.math.expm1":117,"core-js/modules/es6.math.fround":118,"core-js/modules/es6.math.hypot":119,"core-js/modules/es6.math.imul":120,"core-js/modules/es6.math.log10":121,"core-js/modules/es6.math.log1p":122,"core-js/modules/es6.math.log2":123,"core-js/modules/es6.math.sign":124,"core-js/modules/es6.math.sinh":125,"core-js/modules/es6.math.tanh":126,"core-js/modules/es6.math.trunc":127,"core-js/modules/es6.number.epsilon":128,"core-js/modules/es6.number.is-finite":129,"core-js/modules/es6.number.is-integer":130,"core-js/modules/es6.number.is-nan":131,"core-js/modules/es6.number.is-safe-integer":132,"core-js/modules/es6.number.max-safe-integer":133,"core-js/modules/es6.number.min-safe-integer":134,"core-js/modules/es6.object.assign":135,"core-js/modules/es6.object.is":136,"core-js/modules/es6.object.set-prototype-of":137,"core-js/modules/es6.promise":138,"core-js/modules/es6.reflect.apply":139,"core-js/modules/es6.reflect.construct":140,"core-js/modules/es6.reflect.define-property":141,"core-js/modules/es6.reflect.delete-property":142,"core-js/modules/es6.reflect.get":145,"core-js/modules/es6.reflect.get-own-property-descriptor":143,"core-js/modules/es6.reflect.get-prototype-of":144,"core-js/modules/es6.reflect.has":146,"core-js/modules/es6.reflect.is-extensible":147,"core-js/modules/es6.reflect.own-keys":148,"core-js/modules/es6.reflect.prevent-extensions":149,"core-js/modules/es6.reflect.set":151,"core-js/modules/es6.reflect.set-prototype-of":150,"core-js/modules/es6.regexp.flags":152,"core-js/modules/es6.regexp.match":153,"core-js/modules/es6.regexp.replace":154,"core-js/modules/es6.regexp.search":155,"core-js/modules/es6.regexp.split":156,"core-js/modules/es6.set":157,"core-js/modules/es6.string.code-point-at":158,"core-js/modules/es6.string.ends-with":159,"core-js/modules/es6.string.from-code-point":160,"core-js/modules/es6.string.includes":161,"core-js/modules/es6.string.raw":162,"core-js/modules/es6.string.repeat":163,"core-js/modules/es6.string.starts-with":164,"core-js/modules/es6.symbol":165,"core-js/modules/es6.typed.array-buffer":166,"core-js/modules/es6.typed.float32-array":167,"core-js/modules/es6.typed.float64-array":168,"core-js/modules/es6.typed.int16-array":169,"core-js/modules/es6.typed.int32-array":170,"core-js/modules/es6.typed.int8-array":171,"core-js/modules/es6.typed.uint16-array":172,"core-js/modules/es6.typed.uint32-array":173,"core-js/modules/es6.typed.uint8-array":174,"core-js/modules/es6.typed.uint8-clamped-array":175,"core-js/modules/es6.weak-map":176,"core-js/modules/es6.weak-set":177,"core-js/modules/es7.array.includes":178,"core-js/modules/es7.object.entries":179,"core-js/modules/es7.object.get-own-property-descriptors":180,"core-js/modules/es7.object.values":181,"core-js/modules/es7.string.pad-end":182,"core-js/modules/es7.string.pad-start":183,"core-js/modules/web.dom.iterable":184,"core-js/modules/web.immediate":185,"core-js/modules/web.timers":186,"regenerator-runtime/runtime":187}],202:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function elClass() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
  var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var el = document.createElement(element);
  el.classList = classes;
  return el;
}

function makeBtn(name) {
  var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var button = elClass('button', classes);
  button.setAttribute('name', name);
  button.setAttribute('type', 'button');
  button.innerHTML = name;
  return button;
}

exports.elClass = elClass;
exports.makeBtn = makeBtn;

},{}]},{},[201])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi13ZWFrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2tleW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21hdGgtZXhwbTEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19tYXRoLWxvZzFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWF0aC1zaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21pY3JvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcG4tZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC10by1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX293bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcGFydGlhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3BhdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zYW1lLXZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctcGFkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLXJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdHlwZWQtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC1idWZmZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MtZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmluZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lm9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguYWNvc2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmFzaW5oLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5hdGFuaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY2JydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY2x6MzIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmNvc2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmV4cG0xLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5mcm91bmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmh5cG90LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5pbXVsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5sb2cxMC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgubG9nMXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmxvZzIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnNpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnNpbmguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnRhbmguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnRydW5jLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmVwc2lsb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtZmluaXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmlzLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtbmFuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmlzLXNhZmUtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5tYXgtc2FmZS1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLm1pbi1zYWZlLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5hcHBseS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuY29uc3RydWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlbGV0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5nZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5nZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0Lmhhcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuaXMtZXh0ZW5zaWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3Qub3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LnByZXZlbnQtZXh0ZW5zaW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3Quc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLmZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLm1hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuc2VhcmNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnNwbGl0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmNvZGUtcG9pbnQtYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuZW5kcy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yYXcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcucmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuYXJyYXktYnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuZmxvYXQzMi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLmZsb2F0NjQtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC5pbnQxNi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLmludDMyLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuaW50OC1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLnVpbnQxNi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLnVpbnQzMi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLnVpbnQ4LWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQudWludDgtY2xhbXBlZC1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYud2Vhay1zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5hcnJheS5pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5lbnRyaWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QudmFsdWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3RyaW5nLnBhZC1lbmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcucGFkLXN0YXJ0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuaW1tZWRpYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIudGltZXJzLmpzIiwibm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlc1xcdmVsb2NpdHktYW5pbWF0ZVxcdmVsb2NpdHkubWluLmpzIiwibm9kZV9tb2R1bGVzXFx2ZWxvY2l0eS1hbmltYXRlXFx2ZWxvY2l0eS51aS5taW4uanMiLCJzcmNcXGNvbXBvbmVudHNcXGFuaW1hdGVNZW51SXRlbS5qcyIsInNyY1xcY29tcG9uZW50c1xcZGltVUkuanMiLCJzcmNcXGNvbXBvbmVudHNcXGRvY0hhbmRsZXIuanMiLCJzcmNcXGNvbXBvbmVudHNcXGltcG9ydExvYWRlci5qcyIsInNyY1xcY29tcG9uZW50c1xcaW50cm9BbmltYXRpb24uanMiLCJzcmNcXGNvbXBvbmVudHNcXGxvYWRpbmdTY3JlZW4uanMiLCJzcmNcXGNvbXBvbmVudHNcXG1vZGFsLmpzIiwic3JjXFxjb21wb25lbnRzXFxzdmdcXGxvZ28uanMiLCJzcmNcXGNvbXBvbmVudHNcXHN2Z1xcc2Nyb2xsQ2hldnJvbi5qcyIsInNyY1xcY29tcG9uZW50c1xcdG9nZ2xlTWVudS5qcyIsInNyY1xcY29tcG9uZW50c1xcdmlld0hhbmRsZXIuanMiLCJzcmNcXHNjcmlwdC5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTs7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDaHVCQTtBQUNBO0FBQ0EsQ0FBQyxVQUFTLENBQVQsRUFBVztBQUFDO0FBQWEsV0FBUyxDQUFULENBQVcsQ0FBWCxFQUFhO0FBQUMsUUFBSSxJQUFFLEVBQUUsTUFBUjtBQUFBLFFB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ZSxTQUFTLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBckI7QUFDQSxNQUFNLGNBQWMsU0FBUyxhQUFULENBQXVCLGVBQXZCLENBQXBCO0FBQ0EsTUFBTSxnQkFBZ0IsaUNBQXRCOztBQUVBLGFBQVcsT0FBWDtBQUNBLGVBQWEsT0FBYjtBQUNBLFdBQVMsYUFBVCxDQUF1QixVQUF2QixFQUFtQyxTQUFuQyxVQUFvRCxJQUFJLElBQUosR0FBVyxXQUFYLEVBQXBEOztBQUVBO0FBQ0EsV0FBUyxJQUFULENBQWMsS0FBZCxHQUFzQixnQkFBdEI7QUFDQSxhQUFXLEtBQVg7QUFDQSxjQUFZLFdBQVosQ0FBd0IsYUFBeEI7QUFDQSxTQUFPLEtBQVA7QUFDRCxDQWZELEUsQ0FSQTs7Ozs7Ozs7QUNBQSxTQUFTLE9BQVQsR0FBK0M7QUFBQSxNQUE5QixPQUE4Qix1RUFBcEIsS0FBb0I7QUFBQSxNQUFiLE9BQWEsdUVBQUgsQ0FBRzs7QUFDN0MsTUFBTSxLQUFLLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFYO0FBQ0EsS0FBRyxTQUFILEdBQWUsT0FBZjtBQUNBLFNBQU8sRUFBUDtBQUNEOztBQUVELFNBQVMsT0FBVCxDQUFpQixJQUFqQixFQUFvQztBQUFBLE1BQWIsT0FBYSx1RUFBSCxDQUFHOztBQUNsQyxNQUFNLFNBQVMsUUFBUSxRQUFSLEVBQWtCLE9BQWxCLENBQWY7QUFDQSxTQUFPLFlBQVAsQ0FBb0IsTUFBcEIsRUFBNEIsSUFBNUI7QUFDQSxTQUFPLFlBQVAsQ0FBb0IsTUFBcEIsRUFBNEIsUUFBNUI7QUFDQSxTQUFPLFNBQVAsR0FBbUIsSUFBbkI7QUFDQSxTQUFPLE1BQVA7QUFDRDs7UUFFUSxPLEdBQUEsTztRQUFTLE8sR0FBQSxPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbnZhciBVTlNDT1BBQkxFUyA9IHJlcXVpcmUoJy4vX3drcycpKCd1bnNjb3BhYmxlcycpXG4gICwgQXJyYXlQcm90byAgPSBBcnJheS5wcm90b3R5cGU7XG5pZihBcnJheVByb3RvW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpcmVxdWlyZSgnLi9faGlkZScpKEFycmF5UHJvdG8sIFVOU0NPUEFCTEVTLCB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpe1xuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSl7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIDIyLjEuMy4zIEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIGVuZCA9IHRoaXMubGVuZ3RoKVxuJ3VzZSBzdHJpY3QnO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCB0b0luZGV4ICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4JylcbiAgLCB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtdLmNvcHlXaXRoaW4gfHwgZnVuY3Rpb24gY29weVdpdGhpbih0YXJnZXQvKj0gMCovLCBzdGFydC8qPSAwLCBlbmQgPSBAbGVuZ3RoKi8pe1xuICB2YXIgTyAgICAgPSB0b09iamVjdCh0aGlzKVxuICAgICwgbGVuICAgPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAsIHRvICAgID0gdG9JbmRleCh0YXJnZXQsIGxlbilcbiAgICAsIGZyb20gID0gdG9JbmRleChzdGFydCwgbGVuKVxuICAgICwgZW5kICAgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZFxuICAgICwgY291bnQgPSBNYXRoLm1pbigoZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB0b0luZGV4KGVuZCwgbGVuKSkgLSBmcm9tLCBsZW4gLSB0bylcbiAgICAsIGluYyAgID0gMTtcbiAgaWYoZnJvbSA8IHRvICYmIHRvIDwgZnJvbSArIGNvdW50KXtcbiAgICBpbmMgID0gLTE7XG4gICAgZnJvbSArPSBjb3VudCAtIDE7XG4gICAgdG8gICArPSBjb3VudCAtIDE7XG4gIH1cbiAgd2hpbGUoY291bnQtLSA+IDApe1xuICAgIGlmKGZyb20gaW4gTylPW3RvXSA9IE9bZnJvbV07XG4gICAgZWxzZSBkZWxldGUgT1t0b107XG4gICAgdG8gICArPSBpbmM7XG4gICAgZnJvbSArPSBpbmM7XG4gIH0gcmV0dXJuIE87XG59OyIsIi8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxuJ3VzZSBzdHJpY3QnO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCB0b0luZGV4ICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4JylcbiAgLCB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaWxsKHZhbHVlIC8qLCBzdGFydCA9IDAsIGVuZCA9IEBsZW5ndGggKi8pe1xuICB2YXIgTyAgICAgID0gdG9PYmplY3QodGhpcylcbiAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICwgYUxlbiAgID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgaW5kZXggID0gdG9JbmRleChhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgbGVuZ3RoKVxuICAgICwgZW5kICAgID0gYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWRcbiAgICAsIGVuZFBvcyA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbmRleChlbmQsIGxlbmd0aCk7XG4gIHdoaWxlKGVuZFBvcyA+IGluZGV4KU9baW5kZXgrK10gPSB2YWx1ZTtcbiAgcmV0dXJuIE87XG59OyIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9MZW5ndGggID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCB0b0luZGV4ICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgZWwsIGZyb21JbmRleCl7XG4gICAgdmFyIE8gICAgICA9IHRvSU9iamVjdCgkdGhpcylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXG4gICAgICAsIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICBpZihJU19JTkNMVURFUyAmJiBlbCAhPSBlbCl3aGlsZShsZW5ndGggPiBpbmRleCl7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICBpZih2YWx1ZSAhPSB2YWx1ZSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSN0b0luZGV4IGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTsiLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBhc2MgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRZUEUsICRjcmVhdGUpe1xuICB2YXIgSVNfTUFQICAgICAgICA9IFRZUEUgPT0gMVxuICAgICwgSVNfRklMVEVSICAgICA9IFRZUEUgPT0gMlxuICAgICwgSVNfU09NRSAgICAgICA9IFRZUEUgPT0gM1xuICAgICwgSVNfRVZFUlkgICAgICA9IFRZUEUgPT0gNFxuICAgICwgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNlxuICAgICwgTk9fSE9MRVMgICAgICA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYXG4gICAgLCBjcmVhdGUgICAgICAgID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCl7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KCR0aGlzKVxuICAgICAgLCBzZWxmICAgPSBJT2JqZWN0KE8pXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gMFxuICAgICAgLCByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkXG4gICAgICAsIHZhbCwgcmVzO1xuICAgIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZil7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZihUWVBFKXtcbiAgICAgICAgaWYoSVNfTUFQKXJlc3VsdFtpbmRleF0gPSByZXM7ICAgICAgICAgICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaChUWVBFKXtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmKElTX0VWRVJZKXJldHVybiBmYWxzZTsgICAgICAgICAgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBpc0FycmF5ICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5JylcbiAgLCBTUEVDSUVTICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwpe1xuICB2YXIgQztcbiAgaWYoaXNBcnJheShvcmlnaW5hbCkpe1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSlDID0gdW5kZWZpbmVkO1xuICAgIGlmKGlzT2JqZWN0KEMpKXtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYoQyA9PT0gbnVsbClDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTsiLCIvLyA5LjQuMi4zIEFycmF5U3BlY2llc0NyZWF0ZShvcmlnaW5hbEFycmF5LCBsZW5ndGgpXG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsZW5ndGgpe1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYUZ1bmN0aW9uICA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIGlzT2JqZWN0ICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGludm9rZSAgICAgPSByZXF1aXJlKCcuL19pbnZva2UnKVxuICAsIGFycmF5U2xpY2UgPSBbXS5zbGljZVxuICAsIGZhY3RvcmllcyAgPSB7fTtcblxudmFyIGNvbnN0cnVjdCA9IGZ1bmN0aW9uKEYsIGxlbiwgYXJncyl7XG4gIGlmKCEobGVuIGluIGZhY3Rvcmllcykpe1xuICAgIGZvcih2YXIgbiA9IFtdLCBpID0gMDsgaSA8IGxlbjsgaSsrKW5baV0gPSAnYVsnICsgaSArICddJztcbiAgICBmYWN0b3JpZXNbbGVuXSA9IEZ1bmN0aW9uKCdGLGEnLCAncmV0dXJuIG5ldyBGKCcgKyBuLmpvaW4oJywnKSArICcpJyk7XG4gIH0gcmV0dXJuIGZhY3Rvcmllc1tsZW5dKEYsIGFyZ3MpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGdW5jdGlvbi5iaW5kIHx8IGZ1bmN0aW9uIGJpbmQodGhhdCAvKiwgYXJncy4uLiAqLyl7XG4gIHZhciBmbiAgICAgICA9IGFGdW5jdGlvbih0aGlzKVxuICAgICwgcGFydEFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgdmFyIGJvdW5kID0gZnVuY3Rpb24oLyogYXJncy4uLiAqLyl7XG4gICAgdmFyIGFyZ3MgPSBwYXJ0QXJncy5jb25jYXQoYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgYm91bmQgPyBjb25zdHJ1Y3QoZm4sIGFyZ3MubGVuZ3RoLCBhcmdzKSA6IGludm9rZShmbiwgYXJncywgdGhhdCk7XG4gIH07XG4gIGlmKGlzT2JqZWN0KGZuLnByb3RvdHlwZSkpYm91bmQucHJvdG90eXBlID0gZm4ucHJvdG90eXBlO1xuICByZXR1cm4gYm91bmQ7XG59OyIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZFAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgY3JlYXRlICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGFuSW5zdGFuY2UgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGRlZmluZWQgICAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpXG4gICwgZm9yT2YgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsICRpdGVyRGVmaW5lID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKVxuICAsIHN0ZXAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBzZXRTcGVjaWVzICA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBmYXN0S2V5ICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKS5mYXN0S2V5XG4gICwgU0laRSAgICAgICAgPSBERVNDUklQVE9SUyA/ICdfcycgOiAnc2l6ZSc7XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uKHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPT0gJ0YnKXJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvcihlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgaXRlcmFibGUpe1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX2kgPSBjcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgLy8gbGFzdCBlbnRyeVxuICAgICAgdGhhdFtTSVpFXSA9IDA7ICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmKHRoYXQuX2YgPT0gZW50cnkpdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdC5fbCA9PSBlbnRyeSl0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIGFuSW5zdGFuY2UodGhpcywgQywgJ2ZvckVhY2gnKTtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpXG4gICAgICAgICAgLCBlbnRyeTtcbiAgICAgICAgd2hpbGUoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKXtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKERFU0NSSVBUT1JTKWRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGRlZmluZWQodGhpc1tTSVpFXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24odGhhdCwga2V5LCB2YWx1ZSl7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxuICAgICAgLCBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZihlbnRyeSl7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZighdGhhdC5fZil0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZihpbmRleCAhPT0gJ0YnKXRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uKEMsIE5BTUUsIElTX01BUCl7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgICAgIHRoaXMuX3QgPSBpdGVyYXRlZDsgIC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAsIGtpbmQgID0gdGhhdC5fa1xuICAgICAgICAsIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSl7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnICwgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHJlZGVmaW5lQWxsICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBnZXRXZWFrICAgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKS5nZXRXZWFrXG4gICwgYW5PYmplY3QgICAgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGlzT2JqZWN0ICAgICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhbkluc3RhbmNlICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBmb3JPZiAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgY3JlYXRlQXJyYXlNZXRob2QgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJylcbiAgLCAkaGFzICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgYXJyYXlGaW5kICAgICAgICAgPSBjcmVhdGVBcnJheU1ldGhvZCg1KVxuICAsIGFycmF5RmluZEluZGV4ICAgID0gY3JlYXRlQXJyYXlNZXRob2QoNilcbiAgLCBpZCAgICAgICAgICAgICAgICA9IDA7XG5cbi8vIGZhbGxiYWNrIGZvciB1bmNhdWdodCBmcm96ZW4ga2V5c1xudmFyIHVuY2F1Z2h0RnJvemVuU3RvcmUgPSBmdW5jdGlvbih0aGF0KXtcbiAgcmV0dXJuIHRoYXQuX2wgfHwgKHRoYXQuX2wgPSBuZXcgVW5jYXVnaHRGcm96ZW5TdG9yZSk7XG59O1xudmFyIFVuY2F1Z2h0RnJvemVuU3RvcmUgPSBmdW5jdGlvbigpe1xuICB0aGlzLmEgPSBbXTtcbn07XG52YXIgZmluZFVuY2F1Z2h0RnJvemVuID0gZnVuY3Rpb24oc3RvcmUsIGtleSl7XG4gIHJldHVybiBhcnJheUZpbmQoc3RvcmUuYSwgZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xuICB9KTtcbn07XG5VbmNhdWdodEZyb3plblN0b3JlLnByb3RvdHlwZSA9IHtcbiAgZ2V0OiBmdW5jdGlvbihrZXkpe1xuICAgIHZhciBlbnRyeSA9IGZpbmRVbmNhdWdodEZyb3plbih0aGlzLCBrZXkpO1xuICAgIGlmKGVudHJ5KXJldHVybiBlbnRyeVsxXTtcbiAgfSxcbiAgaGFzOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiAhIWZpbmRVbmNhdWdodEZyb3plbih0aGlzLCBrZXkpO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgIHZhciBlbnRyeSA9IGZpbmRVbmNhdWdodEZyb3plbih0aGlzLCBrZXkpO1xuICAgIGlmKGVudHJ5KWVudHJ5WzFdID0gdmFsdWU7XG4gICAgZWxzZSB0aGlzLmEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9LFxuICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICB2YXIgaW5kZXggPSBhcnJheUZpbmRJbmRleCh0aGlzLmEsIGZ1bmN0aW9uKGl0KXtcbiAgICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xuICAgIH0pO1xuICAgIGlmKH5pbmRleCl0aGlzLmEuc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gISF+aW5kZXg7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll9pID0gaWQrKzsgICAgICAvLyBjb2xsZWN0aW9uIGlkXG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAvLyBsZWFrIHN0b3JlIGZvciB1bmNhdWdodCBmcm96ZW4gb2JqZWN0c1xuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMy4zLjIgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjQuMy4zIFdlYWtTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBkYXRhID0gZ2V0V2VhayhrZXkpO1xuICAgICAgICBpZihkYXRhID09PSB0cnVlKXJldHVybiB1bmNhdWdodEZyb3plblN0b3JlKHRoaXMpWydkZWxldGUnXShrZXkpO1xuICAgICAgICByZXR1cm4gZGF0YSAmJiAkaGFzKGRhdGEsIHRoaXMuX2kpICYmIGRlbGV0ZSBkYXRhW3RoaXMuX2ldO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjMuMy40IFdlYWtNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy40LjMuNCBXZWFrU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBkYXRhID0gZ2V0V2VhayhrZXkpO1xuICAgICAgICBpZihkYXRhID09PSB0cnVlKXJldHVybiB1bmNhdWdodEZyb3plblN0b3JlKHRoaXMpLmhhcyhrZXkpO1xuICAgICAgICByZXR1cm4gZGF0YSAmJiAkaGFzKGRhdGEsIHRoaXMuX2kpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIHZhciBkYXRhID0gZ2V0V2Vhayhhbk9iamVjdChrZXkpLCB0cnVlKTtcbiAgICBpZihkYXRhID09PSB0cnVlKXVuY2F1Z2h0RnJvemVuU3RvcmUodGhhdCkuc2V0KGtleSwgdmFsdWUpO1xuICAgIGVsc2UgZGF0YVt0aGF0Ll9pXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGF0O1xuICB9LFxuICB1ZnN0b3JlOiB1bmNhdWdodEZyb3plblN0b3JlXG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgJGV4cG9ydCAgICAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIHJlZGVmaW5lQWxsICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBtZXRhICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKVxuICAsIGZvck9mICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBhbkluc3RhbmNlICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBpc09iamVjdCAgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZmFpbHMgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgJGl0ZXJEZXRlY3QgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgICAgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgaW5oZXJpdElmUmVxdWlyZWQgPSByZXF1aXJlKCcuL19pbmhlcml0LWlmLXJlcXVpcmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspe1xuICB2YXIgQmFzZSAgPSBnbG9iYWxbTkFNRV1cbiAgICAsIEMgICAgID0gQmFzZVxuICAgICwgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnXG4gICAgLCBwcm90byA9IEMgJiYgQy5wcm90b3R5cGVcbiAgICAsIE8gICAgID0ge307XG4gIHZhciBmaXhNZXRob2QgPSBmdW5jdGlvbihLRVkpe1xuICAgIHZhciBmbiA9IHByb3RvW0tFWV07XG4gICAgcmVkZWZpbmUocHJvdG8sIEtFWSxcbiAgICAgIEtFWSA9PSAnZGVsZXRlJyA/IGZ1bmN0aW9uKGEpe1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2hhcycgPyBmdW5jdGlvbiBoYXMoYSl7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IGZhbHNlIDogZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpO1xuICAgICAgfSA6IEtFWSA9PSAnZ2V0JyA/IGZ1bmN0aW9uIGdldChhKXtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gdW5kZWZpbmVkIDogZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpO1xuICAgICAgfSA6IEtFWSA9PSAnYWRkJyA/IGZ1bmN0aW9uIGFkZChhKXsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpOyByZXR1cm4gdGhpczsgfVxuICAgICAgICA6IGZ1bmN0aW9uIHNldChhLCBiKXsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEsIGIpOyByZXR1cm4gdGhpczsgfVxuICAgICk7XG4gIH07XG4gIGlmKHR5cGVvZiBDICE9ICdmdW5jdGlvbicgfHwgIShJU19XRUFLIHx8IHByb3RvLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgbmV3IEMoKS5lbnRyaWVzKCkubmV4dCgpO1xuICB9KSkpe1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gICAgbWV0YS5ORUVEID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgaW5zdGFuY2UgICAgICAgICAgICAgPSBuZXcgQ1xuICAgICAgLy8gZWFybHkgaW1wbGVtZW50YXRpb25zIG5vdCBzdXBwb3J0cyBjaGFpbmluZ1xuICAgICAgLCBIQVNOVF9DSEFJTklORyAgICAgICA9IGluc3RhbmNlW0FEREVSXShJU19XRUFLID8ge30gOiAtMCwgMSkgIT0gaW5zdGFuY2VcbiAgICAgIC8vIFY4IH4gIENocm9taXVtIDQwLSB3ZWFrLWNvbGxlY3Rpb25zIHRocm93cyBvbiBwcmltaXRpdmVzLCBidXQgc2hvdWxkIHJldHVybiBmYWxzZVxuICAgICAgLCBUSFJPV1NfT05fUFJJTUlUSVZFUyA9IGZhaWxzKGZ1bmN0aW9uKCl7IGluc3RhbmNlLmhhcygxKTsgfSlcbiAgICAgIC8vIG1vc3QgZWFybHkgaW1wbGVtZW50YXRpb25zIGRvZXNuJ3Qgc3VwcG9ydHMgaXRlcmFibGVzLCBtb3N0IG1vZGVybiAtIG5vdCBjbG9zZSBpdCBjb3JyZWN0bHlcbiAgICAgICwgQUNDRVBUX0lURVJBQkxFUyAgICAgPSAkaXRlckRldGVjdChmdW5jdGlvbihpdGVyKXsgbmV3IEMoaXRlcik7IH0pIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgICAvLyBmb3IgZWFybHkgaW1wbGVtZW50YXRpb25zIC0wIGFuZCArMCBub3QgdGhlIHNhbWVcbiAgICAgICwgQlVHR1lfWkVSTyA9ICFJU19XRUFLICYmIGZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIFY4IH4gQ2hyb21pdW0gNDItIGZhaWxzIG9ubHkgd2l0aCA1KyBlbGVtZW50c1xuICAgICAgICB2YXIgJGluc3RhbmNlID0gbmV3IEMoKVxuICAgICAgICAgICwgaW5kZXggICAgID0gNTtcbiAgICAgICAgd2hpbGUoaW5kZXgtLSkkaW5zdGFuY2VbQURERVJdKGluZGV4LCBpbmRleCk7XG4gICAgICAgIHJldHVybiAhJGluc3RhbmNlLmhhcygtMCk7XG4gICAgICB9KTtcbiAgICBpZighQUNDRVBUX0lURVJBQkxFUyl7IFxuICAgICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGFyZ2V0LCBpdGVyYWJsZSl7XG4gICAgICAgIGFuSW5zdGFuY2UodGFyZ2V0LCBDLCBOQU1FKTtcbiAgICAgICAgdmFyIHRoYXQgPSBpbmhlcml0SWZSZXF1aXJlZChuZXcgQmFzZSwgdGFyZ2V0LCBDKTtcbiAgICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICB9KTtcbiAgICAgIEMucHJvdG90eXBlID0gcHJvdG87XG4gICAgICBwcm90by5jb25zdHJ1Y3RvciA9IEM7XG4gICAgfVxuICAgIGlmKFRIUk9XU19PTl9QUklNSVRJVkVTIHx8IEJVR0dZX1pFUk8pe1xuICAgICAgZml4TWV0aG9kKCdkZWxldGUnKTtcbiAgICAgIGZpeE1ldGhvZCgnaGFzJyk7XG4gICAgICBJU19NQVAgJiYgZml4TWV0aG9kKCdnZXQnKTtcbiAgICB9XG4gICAgaWYoQlVHR1lfWkVSTyB8fCBIQVNOVF9DSEFJTklORylmaXhNZXRob2QoQURERVIpO1xuICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgc2hvdWxkIG5vdCBjb250YWlucyAuY2xlYXIgbWV0aG9kXG4gICAgaWYoSVNfV0VBSyAmJiBwcm90by5jbGVhcilkZWxldGUgcHJvdG8uY2xlYXI7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAoQyAhPSBCYXNlKSwgTyk7XG5cbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcyLjQuMCd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyAgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgaW5kZXgsIHZhbHVlKXtcbiAgaWYoaW5kZXggaW4gb2JqZWN0KSRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59OyIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTsiLCIvLyBhbGwgZW51bWVyYWJsZSBvYmplY3Qga2V5cywgaW5jbHVkZXMgc3ltYm9sc1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgZ09QUyAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciByZXN1bHQgICAgID0gZ2V0S2V5cyhpdClcbiAgICAsIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIGlmKGdldFN5bWJvbHMpe1xuICAgIHZhciBzeW1ib2xzID0gZ2V0U3ltYm9scyhpdClcbiAgICAgICwgaXNFbnVtICA9IHBJRS5mXG4gICAgICAsIGkgICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShzeW1ib2xzLmxlbmd0aCA+IGkpaWYoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCByZWRlZmluZSAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSlcbiAgICAsIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZih0YXJnZXQpcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYoZXhwb3J0c1trZXldICE9IG91dCloaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZihJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dClleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJ2YXIgTUFUQ0ggPSByZXF1aXJlKCcuL193a3MnKSgnbWF0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIHJlID0gLy4vO1xuICB0cnkge1xuICAgICcvLi8nW0tFWV0ocmUpO1xuICB9IGNhdGNoKGUpe1xuICAgIHRyeSB7XG4gICAgICByZVtNQVRDSF0gPSBmYWxzZTtcbiAgICAgIHJldHVybiAhJy8uLydbS0VZXShyZSk7XG4gICAgfSBjYXRjaChmKXsgLyogZW1wdHkgKi8gfVxuICB9IHJldHVybiB0cnVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgaGlkZSAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBmYWlscyAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCBkZWZpbmVkICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKVxuICAsIHdrcyAgICAgID0gcmVxdWlyZSgnLi9fd2tzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBsZW5ndGgsIGV4ZWMpe1xuICB2YXIgU1lNQk9MICAgPSB3a3MoS0VZKVxuICAgICwgZm5zICAgICAgPSBleGVjKGRlZmluZWQsIFNZTUJPTCwgJydbS0VZXSlcbiAgICAsIHN0cmZuICAgID0gZm5zWzBdXG4gICAgLCByeGZuICAgICA9IGZuc1sxXTtcbiAgaWYoZmFpbHMoZnVuY3Rpb24oKXtcbiAgICB2YXIgTyA9IHt9O1xuICAgIE9bU1lNQk9MXSA9IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9O1xuICAgIHJldHVybiAnJ1tLRVldKE8pICE9IDc7XG4gIH0pKXtcbiAgICByZWRlZmluZShTdHJpbmcucHJvdG90eXBlLCBLRVksIHN0cmZuKTtcbiAgICBoaWRlKFJlZ0V4cC5wcm90b3R5cGUsIFNZTUJPTCwgbGVuZ3RoID09IDJcbiAgICAgIC8vIDIxLjIuNS44IFJlZ0V4cC5wcm90b3R5cGVbQEByZXBsYWNlXShzdHJpbmcsIHJlcGxhY2VWYWx1ZSlcbiAgICAgIC8vIDIxLjIuNS4xMSBSZWdFeHAucHJvdG90eXBlW0BAc3BsaXRdKHN0cmluZywgbGltaXQpXG4gICAgICA/IGZ1bmN0aW9uKHN0cmluZywgYXJnKXsgcmV0dXJuIHJ4Zm4uY2FsbChzdHJpbmcsIHRoaXMsIGFyZyk7IH1cbiAgICAgIC8vIDIxLjIuNS42IFJlZ0V4cC5wcm90b3R5cGVbQEBtYXRjaF0oc3RyaW5nKVxuICAgICAgLy8gMjEuMi41LjkgUmVnRXhwLnByb3RvdHlwZVtAQHNlYXJjaF0oc3RyaW5nKVxuICAgICAgOiBmdW5jdGlvbihzdHJpbmcpeyByZXR1cm4gcnhmbi5jYWxsKHN0cmluZywgdGhpcyk7IH1cbiAgICApO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgdmFyIHRoYXQgICA9IGFuT2JqZWN0KHRoaXMpXG4gICAgLCByZXN1bHQgPSAnJztcbiAgaWYodGhhdC5nbG9iYWwpICAgICByZXN1bHQgKz0gJ2cnO1xuICBpZih0aGF0Lmlnbm9yZUNhc2UpIHJlc3VsdCArPSAnaSc7XG4gIGlmKHRoYXQubXVsdGlsaW5lKSAgcmVzdWx0ICs9ICdtJztcbiAgaWYodGhhdC51bmljb2RlKSAgICByZXN1bHQgKz0gJ3UnO1xuICBpZih0aGF0LnN0aWNreSkgICAgIHJlc3VsdCArPSAneSc7XG4gIHJldHVybiByZXN1bHQ7XG59OyIsInZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgY2FsbCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJylcbiAgLCBCUkVBSyAgICAgICA9IHt9XG4gICwgUkVUVVJOICAgICAgPSB7fTtcbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKXtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKVxuICAgICwgZiAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmKGlzQXJyYXlJdGVyKGl0ZXJGbikpZm9yKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9IGVsc2UgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7ICl7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuZXhwb3J0cy5CUkVBSyAgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgZFAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0aGF0LCB0YXJnZXQsIEMpe1xuICB2YXIgUCwgUyA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcbiAgaWYoUyAhPT0gQyAmJiB0eXBlb2YgUyA9PSAnZnVuY3Rpb24nICYmIChQID0gUy5wcm90b3R5cGUpICE9PSBDLnByb3RvdHlwZSAmJiBpc09iamVjdChQKSAmJiBzZXRQcm90b3R5cGVPZil7XG4gICAgc2V0UHJvdG90eXBlT2YodGhhdCwgUCk7XG4gIH0gcmV0dXJuIHRoYXQ7XG59OyIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgYXJncywgdGhhdCl7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgfSByZXR1cm4gICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwiLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGZsb29yICAgID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNJbnRlZ2VyKGl0KXtcbiAgcmV0dXJuICFpc09iamVjdChpdCkgJiYgaXNGaW5pdGUoaXQpICYmIGZsb29yKGl0KSA9PT0gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyA3LjIuOCBJc1JlZ0V4cChhcmd1bWVudClcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgY29mICAgICAgPSByZXF1aXJlKCcuL19jb2YnKVxuICAsIE1BVENIICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ21hdGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIGlzUmVnRXhwO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmICgoaXNSZWdFeHAgPSBpdFtNQVRDSF0pICE9PSB1bmRlZmluZWQgPyAhIWlzUmVnRXhwIDogY29mKGl0KSA9PSAnUmVnRXhwJyk7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoKGUpe1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYocmV0ICE9PSB1bmRlZmluZWQpYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCJ2YXIgSVRFUkFUT1IgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjLCBza2lwQ2xvc2luZyl7XG4gIGlmKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHJldHVybiB7ZG9uZTogc2FmZSA9IHRydWV9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJ2YXIgZ2V0S2V5cyAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTsiLCIvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxudmFyICRleHBtMSA9IE1hdGguZXhwbTE7XG5tb2R1bGUuZXhwb3J0cyA9ICghJGV4cG0xXG4gIC8vIE9sZCBGRiBidWdcbiAgfHwgJGV4cG0xKDEwKSA+IDIyMDI1LjQ2NTc5NDgwNjcxOSB8fCAkZXhwbTEoMTApIDwgMjIwMjUuNDY1Nzk0ODA2NzE2NTE2OFxuICAvLyBUb3IgQnJvd3NlciBidWdcbiAgfHwgJGV4cG0xKC0yZS0xNykgIT0gLTJlLTE3XG4pID8gZnVuY3Rpb24gZXhwbTEoeCl7XG4gIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IHggPiAtMWUtNiAmJiB4IDwgMWUtNiA/IHggKyB4ICogeCAvIDIgOiBNYXRoLmV4cCh4KSAtIDE7XG59IDogJGV4cG0xOyIsIi8vIDIwLjIuMi4yMCBNYXRoLmxvZzFwKHgpXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGgubG9nMXAgfHwgZnVuY3Rpb24gbG9nMXAoeCl7XG4gIHJldHVybiAoeCA9ICt4KSA+IC0xZS04ICYmIHggPCAxZS04ID8geCAtIHggKiB4IC8gMiA6IE1hdGgubG9nKDEgKyB4KTtcbn07IiwiLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxubW9kdWxlLmV4cG9ydHMgPSBNYXRoLnNpZ24gfHwgZnVuY3Rpb24gc2lnbih4KXtcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgfHwgeCAhPSB4ID8geCA6IHggPCAwID8gLTEgOiAxO1xufTsiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgT2JzZXJ2ZXIgID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXJcbiAgLCBwcm9jZXNzICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIFByb21pc2UgICA9IGdsb2JhbC5Qcm9taXNlXG4gICwgaXNOb2RlICAgID0gcmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcGFyZW50LCBmbjtcbiAgICBpZihpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSlwYXJlbnQuZXhpdCgpO1xuICAgIHdoaWxlKGhlYWQpe1xuICAgICAgZm4gICA9IGhlYWQuZm47XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIGlmKGhlYWQpbm90aWZ5KCk7XG4gICAgICAgIGVsc2UgbGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgaWYocGFyZW50KXBhcmVudC5lbnRlcigpO1xuICB9O1xuXG4gIC8vIE5vZGUuanNcbiAgaWYoaXNOb2RlKXtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG4gIH0gZWxzZSBpZihPYnNlcnZlcil7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWVcbiAgICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZihQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSl7XG4gICAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oZm4pe1xuICAgIHZhciB0YXNrID0ge2ZuOiBmbiwgbmV4dDogdW5kZWZpbmVkfTtcbiAgICBpZihsYXN0KWxhc3QubmV4dCA9IHRhc2s7XG4gICAgaWYoIWhlYWQpe1xuICAgICAgaGVhZCA9IHRhc2s7XG4gICAgICBub3RpZnkoKTtcbiAgICB9IGxhc3QgPSB0YXNrO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgZ09QUyAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCAkYXNzaWduICA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHZhciBBID0ge31cbiAgICAsIEIgPSB7fVxuICAgICwgUyA9IFN5bWJvbCgpXG4gICAgLCBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24oayl7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgICAgID0gdG9PYmplY3QodGFyZ2V0KVxuICAgICwgYUxlbiAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBpbmRleCA9IDFcbiAgICAsIGdldFN5bWJvbHMgPSBnT1BTLmZcbiAgICAsIGlzRW51bSAgICAgPSBwSUUuZjtcbiAgd2hpbGUoYUxlbiA+IGluZGV4KXtcbiAgICB2YXIgUyAgICAgID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pXG4gICAgICAsIGtleXMgICA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaiAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUobGVuZ3RoID4gailpZihpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKVRba2V5XSA9IFNba2V5XTtcbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduOyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBkUHMgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBFbXB0eSAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcbiAgICAsIGx0ICAgICA9ICc8J1xuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpe1xuICB2YXIgcmVzdWx0O1xuICBpZihPICE9PSBudWxsKXtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgcElFICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCBnT1BEICAgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGdPUE4gICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZlxuICAsIHRvU3RyaW5nICA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24oaXQpe1xuICB0cnkge1xuICAgIHJldHVybiBnT1BOKGl0KTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICByZXR1cm4gd2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScgPyBnZXRXaW5kb3dOYW1lcyhpdCkgOiBnT1BOKHRvSU9iamVjdChpdCkpO1xufTtcbiIsIi8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbnZhciAka2V5cyAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07IiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sczsiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgbmFtZXMpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTsiLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTsiLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTsiLCJ2YXIgZ2V0S2V5cyAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGlzRW51bSAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpc0VudHJpZXMpe1xuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoaXQpXG4gICAgICAsIGtleXMgICA9IGdldEtleXMoTylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaSAgICAgID0gMFxuICAgICAgLCByZXN1bHQgPSBbXVxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUobGVuZ3RoID4gaSlpZihpc0VudW0uY2FsbChPLCBrZXkgPSBrZXlzW2krK10pKXtcbiAgICAgIHJlc3VsdC5wdXNoKGlzRW50cmllcyA/IFtrZXksIE9ba2V5XV0gOiBPW2tleV0pO1xuICAgIH0gcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07IiwiLy8gYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBub24tZW51bWVyYWJsZSBhbmQgc3ltYm9sc1xudmFyIGdPUE4gICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKVxuICAsIGdPUFMgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBSZWZsZWN0ICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlJlZmxlY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IFJlZmxlY3QgJiYgUmVmbGVjdC5vd25LZXlzIHx8IGZ1bmN0aW9uIG93bktleXMoaXQpe1xuICB2YXIga2V5cyAgICAgICA9IGdPUE4uZihhbk9iamVjdChpdCkpXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICByZXR1cm4gZ2V0U3ltYm9scyA/IGtleXMuY29uY2F0KGdldFN5bWJvbHMoaXQpKSA6IGtleXM7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBwYXRoICAgICAgPSByZXF1aXJlKCcuL19wYXRoJylcbiAgLCBpbnZva2UgICAgPSByZXF1aXJlKCcuL19pbnZva2UnKVxuICAsIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oLyogLi4ucGFyZ3MgKi8pe1xuICB2YXIgZm4gICAgID0gYUZ1bmN0aW9uKHRoaXMpXG4gICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBwYXJncyAgPSBBcnJheShsZW5ndGgpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBfICAgICAgPSBwYXRoLl9cbiAgICAsIGhvbGRlciA9IGZhbHNlO1xuICB3aGlsZShsZW5ndGggPiBpKWlmKChwYXJnc1tpXSA9IGFyZ3VtZW50c1tpKytdKSA9PT0gXylob2xkZXIgPSB0cnVlO1xuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAsIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIGogPSAwLCBrID0gMCwgYXJncztcbiAgICBpZighaG9sZGVyICYmICFhTGVuKXJldHVybiBpbnZva2UoZm4sIHBhcmdzLCB0aGF0KTtcbiAgICBhcmdzID0gcGFyZ3Muc2xpY2UoKTtcbiAgICBpZihob2xkZXIpZm9yKDtsZW5ndGggPiBqOyBqKyspaWYoYXJnc1tqXSA9PT0gXylhcmdzW2pdID0gYXJndW1lbnRzW2srK107XG4gICAgd2hpbGUoYUxlbiA+IGspYXJncy5wdXNoKGFyZ3VtZW50c1trKytdKTtcbiAgICByZXR1cm4gaW52b2tlKGZuLCBhcmdzLCB0aGF0KTtcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19nbG9iYWwnKTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwidmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMsIHNhZmUpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldLCBzYWZlKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBTUkMgICAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJylcbiAgLCBUT19TVFJJTkcgPSAndG9TdHJpbmcnXG4gICwgJHRvU3RyaW5nID0gRnVuY3Rpb25bVE9fU1RSSU5HXVxuICAsIFRQTCAgICAgICA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBrZXksIHZhbCwgc2FmZSl7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZihpc0Z1bmN0aW9uKWhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYoT1trZXldID09PSB2YWwpcmV0dXJuO1xuICBpZihpc0Z1bmN0aW9uKWhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZihPID09PSBnbG9iYWwpe1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBpZighc2FmZSl7XG4gICAgICBkZWxldGUgT1trZXldO1xuICAgICAgaGlkZShPLCBrZXksIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKE9ba2V5XSlPW2tleV0gPSB2YWw7XG4gICAgICBlbHNlIGhpZGUoTywga2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7IiwiLy8gNy4yLjkgU2FtZVZhbHVlKHgsIHkpXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5pcyB8fCBmdW5jdGlvbiBpcyh4LCB5KXtcbiAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XG59OyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uKE8sIHByb3RvKXtcbiAgYW5PYmplY3QoTyk7XG4gIGlmKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24odGVzdCwgYnVnZ3ksIHNldCl7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuL19jdHgnKShGdW5jdGlvbi5jYWxsLCByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmYoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaChlKXsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pe1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmKGJ1Z2d5KU8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIE87XG4gICAgICB9O1xuICAgIH0oe30sIGZhbHNlKSA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBTUEVDSUVTICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSBnbG9iYWxbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSlkUC5mKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBoYXMgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBTUEVDSUVTICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCIvLyBoZWxwZXIgZm9yIFN0cmluZyN7c3RhcnRzV2l0aCwgZW5kc1dpdGgsIGluY2x1ZGVzfVxudmFyIGlzUmVnRXhwID0gcmVxdWlyZSgnLi9faXMtcmVnZXhwJylcbiAgLCBkZWZpbmVkICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0aGF0LCBzZWFyY2hTdHJpbmcsIE5BTUUpe1xuICBpZihpc1JlZ0V4cChzZWFyY2hTdHJpbmcpKXRocm93IFR5cGVFcnJvcignU3RyaW5nIycgKyBOQU1FICsgXCIgZG9lc24ndCBhY2NlcHQgcmVnZXghXCIpO1xuICByZXR1cm4gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1zdHJpbmctcGFkLXN0YXJ0LWVuZFxudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCByZXBlYXQgICA9IHJlcXVpcmUoJy4vX3N0cmluZy1yZXBlYXQnKVxuICAsIGRlZmluZWQgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRoYXQsIG1heExlbmd0aCwgZmlsbFN0cmluZywgbGVmdCl7XG4gIHZhciBTICAgICAgICAgICAgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAsIHN0cmluZ0xlbmd0aCA9IFMubGVuZ3RoXG4gICAgLCBmaWxsU3RyICAgICAgPSBmaWxsU3RyaW5nID09PSB1bmRlZmluZWQgPyAnICcgOiBTdHJpbmcoZmlsbFN0cmluZylcbiAgICAsIGludE1heExlbmd0aCA9IHRvTGVuZ3RoKG1heExlbmd0aCk7XG4gIGlmKGludE1heExlbmd0aCA8PSBzdHJpbmdMZW5ndGggfHwgZmlsbFN0ciA9PSAnJylyZXR1cm4gUztcbiAgdmFyIGZpbGxMZW4gPSBpbnRNYXhMZW5ndGggLSBzdHJpbmdMZW5ndGhcbiAgICAsIHN0cmluZ0ZpbGxlciA9IHJlcGVhdC5jYWxsKGZpbGxTdHIsIE1hdGguY2VpbChmaWxsTGVuIC8gZmlsbFN0ci5sZW5ndGgpKTtcbiAgaWYoc3RyaW5nRmlsbGVyLmxlbmd0aCA+IGZpbGxMZW4pc3RyaW5nRmlsbGVyID0gc3RyaW5nRmlsbGVyLnNsaWNlKDAsIGZpbGxMZW4pO1xuICByZXR1cm4gbGVmdCA/IHN0cmluZ0ZpbGxlciArIFMgOiBTICsgc3RyaW5nRmlsbGVyO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVwZWF0KGNvdW50KXtcbiAgdmFyIHN0ciA9IFN0cmluZyhkZWZpbmVkKHRoaXMpKVxuICAgICwgcmVzID0gJydcbiAgICAsIG4gICA9IHRvSW50ZWdlcihjb3VudCk7XG4gIGlmKG4gPCAwIHx8IG4gPT0gSW5maW5pdHkpdGhyb3cgUmFuZ2VFcnJvcihcIkNvdW50IGNhbid0IGJlIG5lZ2F0aXZlXCIpO1xuICBmb3IoO24gPiAwOyAobiA+Pj49IDEpICYmIChzdHIgKz0gc3RyKSlpZihuICYgMSlyZXMgKz0gc3RyO1xuICByZXR1cm4gcmVzO1xufTsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBpbnZva2UgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pbnZva2UnKVxuICAsIGh0bWwgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2h0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXG4gICwgY2xlYXJUYXNrICAgICAgICAgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXG4gICwgTWVzc2FnZUNoYW5uZWwgICAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXG4gICwgY291bnRlciAgICAgICAgICAgID0gMFxuICAsIHF1ZXVlICAgICAgICAgICAgICA9IHt9XG4gICwgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSdcbiAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbigpe1xuICB2YXIgaWQgPSArdGhpcztcbiAgaWYocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighc2V0VGFzayB8fCAhY2xlYXJUYXNrKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbil7XG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCl7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYoTWVzc2FnZUNoYW5uZWwpe1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuaWYocmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSl7XG4gIHZhciBMSUJSQVJZICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICAgLCBnbG9iYWwgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgICAsIGZhaWxzICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICAgLCAkZXhwb3J0ICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgICAsICR0eXBlZCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190eXBlZCcpXG4gICAgLCAkYnVmZmVyICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdHlwZWQtYnVmZmVyJylcbiAgICAsIGN0eCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAgICwgYW5JbnN0YW5jZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgICAsIHByb3BlcnR5RGVzYyAgICAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgICAsIGhpZGUgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgICAsIHJlZGVmaW5lQWxsICAgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAgICwgdG9JbnRlZ2VyICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAgICwgdG9MZW5ndGggICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICAgLCB0b0luZGV4ICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKVxuICAgICwgdG9QcmltaXRpdmUgICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICAgLCBoYXMgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgICAsIHNhbWUgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19zYW1lLXZhbHVlJylcbiAgICAsIGNsYXNzb2YgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgICAsIGlzT2JqZWN0ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAgICwgdG9PYmplY3QgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICAgLCBpc0FycmF5SXRlciAgICAgICAgID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpXG4gICAgLCBjcmVhdGUgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICAgLCBnZXRQcm90b3R5cGVPZiAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICAgLCBnT1BOICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mXG4gICAgLCBnZXRJdGVyRm4gICAgICAgICAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKVxuICAgICwgdWlkICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICAgLCB3a3MgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJylcbiAgICAsIGNyZWF0ZUFycmF5TWV0aG9kICAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJylcbiAgICAsIGNyZWF0ZUFycmF5SW5jbHVkZXMgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpXG4gICAgLCBzcGVjaWVzQ29uc3RydWN0b3IgID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpXG4gICAgLCBBcnJheUl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKVxuICAgICwgSXRlcmF0b3JzICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICAgLCAkaXRlckRldGVjdCAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKVxuICAgICwgc2V0U3BlY2llcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJylcbiAgICAsIGFycmF5RmlsbCAgICAgICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1maWxsJylcbiAgICAsIGFycmF5Q29weVdpdGhpbiAgICAgPSByZXF1aXJlKCcuL19hcnJheS1jb3B5LXdpdGhpbicpXG4gICAgLCAkRFAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgICAsICRHT1BEICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICAgLCBkUCAgICAgICAgICAgICAgICAgID0gJERQLmZcbiAgICAsIGdPUEQgICAgICAgICAgICAgICAgPSAkR09QRC5mXG4gICAgLCBSYW5nZUVycm9yICAgICAgICAgID0gZ2xvYmFsLlJhbmdlRXJyb3JcbiAgICAsIFR5cGVFcnJvciAgICAgICAgICAgPSBnbG9iYWwuVHlwZUVycm9yXG4gICAgLCBVaW50OEFycmF5ICAgICAgICAgID0gZ2xvYmFsLlVpbnQ4QXJyYXlcbiAgICAsIEFSUkFZX0JVRkZFUiAgICAgICAgPSAnQXJyYXlCdWZmZXInXG4gICAgLCBTSEFSRURfQlVGRkVSICAgICAgID0gJ1NoYXJlZCcgKyBBUlJBWV9CVUZGRVJcbiAgICAsIEJZVEVTX1BFUl9FTEVNRU5UICAgPSAnQllURVNfUEVSX0VMRU1FTlQnXG4gICAgLCBQUk9UT1RZUEUgICAgICAgICAgID0gJ3Byb3RvdHlwZSdcbiAgICAsIEFycmF5UHJvdG8gICAgICAgICAgPSBBcnJheVtQUk9UT1RZUEVdXG4gICAgLCAkQXJyYXlCdWZmZXIgICAgICAgID0gJGJ1ZmZlci5BcnJheUJ1ZmZlclxuICAgICwgJERhdGFWaWV3ICAgICAgICAgICA9ICRidWZmZXIuRGF0YVZpZXdcbiAgICAsIGFycmF5Rm9yRWFjaCAgICAgICAgPSBjcmVhdGVBcnJheU1ldGhvZCgwKVxuICAgICwgYXJyYXlGaWx0ZXIgICAgICAgICA9IGNyZWF0ZUFycmF5TWV0aG9kKDIpXG4gICAgLCBhcnJheVNvbWUgICAgICAgICAgID0gY3JlYXRlQXJyYXlNZXRob2QoMylcbiAgICAsIGFycmF5RXZlcnkgICAgICAgICAgPSBjcmVhdGVBcnJheU1ldGhvZCg0KVxuICAgICwgYXJyYXlGaW5kICAgICAgICAgICA9IGNyZWF0ZUFycmF5TWV0aG9kKDUpXG4gICAgLCBhcnJheUZpbmRJbmRleCAgICAgID0gY3JlYXRlQXJyYXlNZXRob2QoNilcbiAgICAsIGFycmF5SW5jbHVkZXMgICAgICAgPSBjcmVhdGVBcnJheUluY2x1ZGVzKHRydWUpXG4gICAgLCBhcnJheUluZGV4T2YgICAgICAgID0gY3JlYXRlQXJyYXlJbmNsdWRlcyhmYWxzZSlcbiAgICAsIGFycmF5VmFsdWVzICAgICAgICAgPSBBcnJheUl0ZXJhdG9ycy52YWx1ZXNcbiAgICAsIGFycmF5S2V5cyAgICAgICAgICAgPSBBcnJheUl0ZXJhdG9ycy5rZXlzXG4gICAgLCBhcnJheUVudHJpZXMgICAgICAgID0gQXJyYXlJdGVyYXRvcnMuZW50cmllc1xuICAgICwgYXJyYXlMYXN0SW5kZXhPZiAgICA9IEFycmF5UHJvdG8ubGFzdEluZGV4T2ZcbiAgICAsIGFycmF5UmVkdWNlICAgICAgICAgPSBBcnJheVByb3RvLnJlZHVjZVxuICAgICwgYXJyYXlSZWR1Y2VSaWdodCAgICA9IEFycmF5UHJvdG8ucmVkdWNlUmlnaHRcbiAgICAsIGFycmF5Sm9pbiAgICAgICAgICAgPSBBcnJheVByb3RvLmpvaW5cbiAgICAsIGFycmF5U29ydCAgICAgICAgICAgPSBBcnJheVByb3RvLnNvcnRcbiAgICAsIGFycmF5U2xpY2UgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlXG4gICAgLCBhcnJheVRvU3RyaW5nICAgICAgID0gQXJyYXlQcm90by50b1N0cmluZ1xuICAgICwgYXJyYXlUb0xvY2FsZVN0cmluZyA9IEFycmF5UHJvdG8udG9Mb2NhbGVTdHJpbmdcbiAgICAsIElURVJBVE9SICAgICAgICAgICAgPSB3a3MoJ2l0ZXJhdG9yJylcbiAgICAsIFRBRyAgICAgICAgICAgICAgICAgPSB3a3MoJ3RvU3RyaW5nVGFnJylcbiAgICAsIFRZUEVEX0NPTlNUUlVDVE9SICAgPSB1aWQoJ3R5cGVkX2NvbnN0cnVjdG9yJylcbiAgICAsIERFRl9DT05TVFJVQ1RPUiAgICAgPSB1aWQoJ2RlZl9jb25zdHJ1Y3RvcicpXG4gICAgLCBBTExfQ09OU1RSVUNUT1JTICAgID0gJHR5cGVkLkNPTlNUUlxuICAgICwgVFlQRURfQVJSQVkgICAgICAgICA9ICR0eXBlZC5UWVBFRFxuICAgICwgVklFVyAgICAgICAgICAgICAgICA9ICR0eXBlZC5WSUVXXG4gICAgLCBXUk9OR19MRU5HVEggICAgICAgID0gJ1dyb25nIGxlbmd0aCEnO1xuXG4gIHZhciAkbWFwID0gY3JlYXRlQXJyYXlNZXRob2QoMSwgZnVuY3Rpb24oTywgbGVuZ3RoKXtcbiAgICByZXR1cm4gYWxsb2NhdGUoc3BlY2llc0NvbnN0cnVjdG9yKE8sIE9bREVGX0NPTlNUUlVDVE9SXSksIGxlbmd0aCk7XG4gIH0pO1xuXG4gIHZhciBMSVRUTEVfRU5ESUFOID0gZmFpbHMoZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkobmV3IFVpbnQxNkFycmF5KFsxXSkuYnVmZmVyKVswXSA9PT0gMTtcbiAgfSk7XG5cbiAgdmFyIEZPUkNFRF9TRVQgPSAhIVVpbnQ4QXJyYXkgJiYgISFVaW50OEFycmF5W1BST1RPVFlQRV0uc2V0ICYmIGZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgbmV3IFVpbnQ4QXJyYXkoMSkuc2V0KHt9KTtcbiAgfSk7XG5cbiAgdmFyIHN0cmljdFRvTGVuZ3RoID0gZnVuY3Rpb24oaXQsIFNBTUUpe1xuICAgIGlmKGl0ID09PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgdmFyIG51bWJlciA9ICtpdFxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChpdCk7XG4gICAgaWYoU0FNRSAmJiAhc2FtZShudW1iZXIsIGxlbmd0aCkpdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgIHJldHVybiBsZW5ndGg7XG4gIH07XG5cbiAgdmFyIHRvT2Zmc2V0ID0gZnVuY3Rpb24oaXQsIEJZVEVTKXtcbiAgICB2YXIgb2Zmc2V0ID0gdG9JbnRlZ2VyKGl0KTtcbiAgICBpZihvZmZzZXQgPCAwIHx8IG9mZnNldCAlIEJZVEVTKXRocm93IFJhbmdlRXJyb3IoJ1dyb25nIG9mZnNldCEnKTtcbiAgICByZXR1cm4gb2Zmc2V0O1xuICB9O1xuXG4gIHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uKGl0KXtcbiAgICBpZihpc09iamVjdChpdCkgJiYgVFlQRURfQVJSQVkgaW4gaXQpcmV0dXJuIGl0O1xuICAgIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgdHlwZWQgYXJyYXkhJyk7XG4gIH07XG5cbiAgdmFyIGFsbG9jYXRlID0gZnVuY3Rpb24oQywgbGVuZ3RoKXtcbiAgICBpZighKGlzT2JqZWN0KEMpICYmIFRZUEVEX0NPTlNUUlVDVE9SIGluIEMpKXtcbiAgICAgIHRocm93IFR5cGVFcnJvcignSXQgaXMgbm90IGEgdHlwZWQgYXJyYXkgY29uc3RydWN0b3IhJyk7XG4gICAgfSByZXR1cm4gbmV3IEMobGVuZ3RoKTtcbiAgfTtcblxuICB2YXIgc3BlY2llc0Zyb21MaXN0ID0gZnVuY3Rpb24oTywgbGlzdCl7XG4gICAgcmV0dXJuIGZyb21MaXN0KHNwZWNpZXNDb25zdHJ1Y3RvcihPLCBPW0RFRl9DT05TVFJVQ1RPUl0pLCBsaXN0KTtcbiAgfTtcblxuICB2YXIgZnJvbUxpc3QgPSBmdW5jdGlvbihDLCBsaXN0KXtcbiAgICB2YXIgaW5kZXggID0gMFxuICAgICAgLCBsZW5ndGggPSBsaXN0Lmxlbmd0aFxuICAgICAgLCByZXN1bHQgPSBhbGxvY2F0ZShDLCBsZW5ndGgpO1xuICAgIHdoaWxlKGxlbmd0aCA+IGluZGV4KXJlc3VsdFtpbmRleF0gPSBsaXN0W2luZGV4KytdO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyIGFkZEdldHRlciA9IGZ1bmN0aW9uKGl0LCBrZXksIGludGVybmFsKXtcbiAgICBkUChpdCwga2V5LCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpcy5fZFtpbnRlcm5hbF07IH19KTtcbiAgfTtcblxuICB2YXIgJGZyb20gPSBmdW5jdGlvbiBmcm9tKHNvdXJjZSAvKiwgbWFwZm4sIHRoaXNBcmcgKi8pe1xuICAgIHZhciBPICAgICAgID0gdG9PYmplY3Qoc291cmNlKVxuICAgICAgLCBhTGVuICAgID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBtYXBmbiAgID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWRcbiAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcbiAgICAgICwgaXRlckZuICA9IGdldEl0ZXJGbihPKVxuICAgICAgLCBpLCBsZW5ndGgsIHZhbHVlcywgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZihpdGVyRm4gIT0gdW5kZWZpbmVkICYmICFpc0FycmF5SXRlcihpdGVyRm4pKXtcbiAgICAgIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCB2YWx1ZXMgPSBbXSwgaSA9IDA7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaSsrKXtcbiAgICAgICAgdmFsdWVzLnB1c2goc3RlcC52YWx1ZSk7XG4gICAgICB9IE8gPSB2YWx1ZXM7XG4gICAgfVxuICAgIGlmKG1hcHBpbmcgJiYgYUxlbiA+IDIpbWFwZm4gPSBjdHgobWFwZm4sIGFyZ3VtZW50c1syXSwgMik7XG4gICAgZm9yKGkgPSAwLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCksIHJlc3VsdCA9IGFsbG9jYXRlKHRoaXMsIGxlbmd0aCk7IGxlbmd0aCA+IGk7IGkrKyl7XG4gICAgICByZXN1bHRbaV0gPSBtYXBwaW5nID8gbWFwZm4oT1tpXSwgaSkgOiBPW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciAkb2YgPSBmdW5jdGlvbiBvZigvKi4uLml0ZW1zKi8pe1xuICAgIHZhciBpbmRleCAgPSAwXG4gICAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgcmVzdWx0ID0gYWxsb2NhdGUodGhpcywgbGVuZ3RoKTtcbiAgICB3aGlsZShsZW5ndGggPiBpbmRleClyZXN1bHRbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4KytdO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gaU9TIFNhZmFyaSA2LnggZmFpbHMgaGVyZVxuICB2YXIgVE9fTE9DQUxFX0JVRyA9ICEhVWludDhBcnJheSAmJiBmYWlscyhmdW5jdGlvbigpeyBhcnJheVRvTG9jYWxlU3RyaW5nLmNhbGwobmV3IFVpbnQ4QXJyYXkoMSkpOyB9KTtcblxuICB2YXIgJHRvTG9jYWxlU3RyaW5nID0gZnVuY3Rpb24gdG9Mb2NhbGVTdHJpbmcoKXtcbiAgICByZXR1cm4gYXJyYXlUb0xvY2FsZVN0cmluZy5hcHBseShUT19MT0NBTEVfQlVHID8gYXJyYXlTbGljZS5jYWxsKHZhbGlkYXRlKHRoaXMpKSA6IHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIHZhciBwcm90byA9IHtcbiAgICBjb3B5V2l0aGluOiBmdW5jdGlvbiBjb3B5V2l0aGluKHRhcmdldCwgc3RhcnQgLyosIGVuZCAqLyl7XG4gICAgICByZXR1cm4gYXJyYXlDb3B5V2l0aGluLmNhbGwodmFsaWRhdGUodGhpcyksIHRhcmdldCwgc3RhcnQsIGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGV2ZXJ5OiBmdW5jdGlvbiBldmVyeShjYWxsYmFja2ZuIC8qLCB0aGlzQXJnICovKXtcbiAgICAgIHJldHVybiBhcnJheUV2ZXJ5KHZhbGlkYXRlKHRoaXMpLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBmaWxsOiBmdW5jdGlvbiBmaWxsKHZhbHVlIC8qLCBzdGFydCwgZW5kICovKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgcmV0dXJuIGFycmF5RmlsbC5hcHBseSh2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKGNhbGxiYWNrZm4gLyosIHRoaXNBcmcgKi8pe1xuICAgICAgcmV0dXJuIHNwZWNpZXNGcm9tTGlzdCh0aGlzLCBhcnJheUZpbHRlcih2YWxpZGF0ZSh0aGlzKSwgY2FsbGJhY2tmbixcbiAgICAgICAgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpKTtcbiAgICB9LFxuICAgIGZpbmQ6IGZ1bmN0aW9uIGZpbmQocHJlZGljYXRlIC8qLCB0aGlzQXJnICovKXtcbiAgICAgIHJldHVybiBhcnJheUZpbmQodmFsaWRhdGUodGhpcyksIHByZWRpY2F0ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgZmluZEluZGV4OiBmdW5jdGlvbiBmaW5kSW5kZXgocHJlZGljYXRlIC8qLCB0aGlzQXJnICovKXtcbiAgICAgIHJldHVybiBhcnJheUZpbmRJbmRleCh2YWxpZGF0ZSh0aGlzKSwgcHJlZGljYXRlLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyosIHRoaXNBcmcgKi8pe1xuICAgICAgYXJyYXlGb3JFYWNoKHZhbGlkYXRlKHRoaXMpLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBpbmRleE9mOiBmdW5jdGlvbiBpbmRleE9mKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCAqLyl7XG4gICAgICByZXR1cm4gYXJyYXlJbmRleE9mKHZhbGlkYXRlKHRoaXMpLCBzZWFyY2hFbGVtZW50LCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXMoc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4ICovKXtcbiAgICAgIHJldHVybiBhcnJheUluY2x1ZGVzKHZhbGlkYXRlKHRoaXMpLCBzZWFyY2hFbGVtZW50LCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBqb2luOiBmdW5jdGlvbiBqb2luKHNlcGFyYXRvcil7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheUpvaW4uYXBwbHkodmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBsYXN0SW5kZXhPZjogZnVuY3Rpb24gbGFzdEluZGV4T2Yoc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4ICovKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgcmV0dXJuIGFycmF5TGFzdEluZGV4T2YuYXBwbHkodmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBtYXA6IGZ1bmN0aW9uIG1hcChtYXBmbiAvKiwgdGhpc0FyZyAqLyl7XG4gICAgICByZXR1cm4gJG1hcCh2YWxpZGF0ZSh0aGlzKSwgbWFwZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlKGNhbGxiYWNrZm4gLyosIGluaXRpYWxWYWx1ZSAqLyl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheVJlZHVjZS5hcHBseSh2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHJlZHVjZVJpZ2h0OiBmdW5jdGlvbiByZWR1Y2VSaWdodChjYWxsYmFja2ZuIC8qLCBpbml0aWFsVmFsdWUgKi8peyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICByZXR1cm4gYXJyYXlSZWR1Y2VSaWdodC5hcHBseSh2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHJldmVyc2U6IGZ1bmN0aW9uIHJldmVyc2UoKXtcbiAgICAgIHZhciB0aGF0ICAgPSB0aGlzXG4gICAgICAgICwgbGVuZ3RoID0gdmFsaWRhdGUodGhhdCkubGVuZ3RoXG4gICAgICAgICwgbWlkZGxlID0gTWF0aC5mbG9vcihsZW5ndGggLyAyKVxuICAgICAgICAsIGluZGV4ICA9IDBcbiAgICAgICAgLCB2YWx1ZTtcbiAgICAgIHdoaWxlKGluZGV4IDwgbWlkZGxlKXtcbiAgICAgICAgdmFsdWUgICAgICAgICA9IHRoYXRbaW5kZXhdO1xuICAgICAgICB0aGF0W2luZGV4KytdID0gdGhhdFstLWxlbmd0aF07XG4gICAgICAgIHRoYXRbbGVuZ3RoXSAgPSB2YWx1ZTtcbiAgICAgIH0gcmV0dXJuIHRoYXQ7XG4gICAgfSxcbiAgICBzb21lOiBmdW5jdGlvbiBzb21lKGNhbGxiYWNrZm4gLyosIHRoaXNBcmcgKi8pe1xuICAgICAgcmV0dXJuIGFycmF5U29tZSh2YWxpZGF0ZSh0aGlzKSwgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgc29ydDogZnVuY3Rpb24gc29ydChjb21wYXJlZm4pe1xuICAgICAgcmV0dXJuIGFycmF5U29ydC5jYWxsKHZhbGlkYXRlKHRoaXMpLCBjb21wYXJlZm4pO1xuICAgIH0sXG4gICAgc3ViYXJyYXk6IGZ1bmN0aW9uIHN1YmFycmF5KGJlZ2luLCBlbmQpe1xuICAgICAgdmFyIE8gICAgICA9IHZhbGlkYXRlKHRoaXMpXG4gICAgICAgICwgbGVuZ3RoID0gTy5sZW5ndGhcbiAgICAgICAgLCAkYmVnaW4gPSB0b0luZGV4KGJlZ2luLCBsZW5ndGgpO1xuICAgICAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKE8sIE9bREVGX0NPTlNUUlVDVE9SXSkpKFxuICAgICAgICBPLmJ1ZmZlcixcbiAgICAgICAgTy5ieXRlT2Zmc2V0ICsgJGJlZ2luICogTy5CWVRFU19QRVJfRUxFTUVOVCxcbiAgICAgICAgdG9MZW5ndGgoKGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbmRleChlbmQsIGxlbmd0aCkpIC0gJGJlZ2luKVxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyICRzbGljZSA9IGZ1bmN0aW9uIHNsaWNlKHN0YXJ0LCBlbmQpe1xuICAgIHJldHVybiBzcGVjaWVzRnJvbUxpc3QodGhpcywgYXJyYXlTbGljZS5jYWxsKHZhbGlkYXRlKHRoaXMpLCBzdGFydCwgZW5kKSk7XG4gIH07XG5cbiAgdmFyICRzZXQgPSBmdW5jdGlvbiBzZXQoYXJyYXlMaWtlIC8qLCBvZmZzZXQgKi8pe1xuICAgIHZhbGlkYXRlKHRoaXMpO1xuICAgIHZhciBvZmZzZXQgPSB0b09mZnNldChhcmd1bWVudHNbMV0sIDEpXG4gICAgICAsIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgICAsIHNyYyAgICA9IHRvT2JqZWN0KGFycmF5TGlrZSlcbiAgICAgICwgbGVuICAgID0gdG9MZW5ndGgoc3JjLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gMDtcbiAgICBpZihsZW4gKyBvZmZzZXQgPiBsZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgIHdoaWxlKGluZGV4IDwgbGVuKXRoaXNbb2Zmc2V0ICsgaW5kZXhdID0gc3JjW2luZGV4KytdO1xuICB9O1xuXG4gIHZhciAkaXRlcmF0b3JzID0ge1xuICAgIGVudHJpZXM6IGZ1bmN0aW9uIGVudHJpZXMoKXtcbiAgICAgIHJldHVybiBhcnJheUVudHJpZXMuY2FsbCh2YWxpZGF0ZSh0aGlzKSk7XG4gICAgfSxcbiAgICBrZXlzOiBmdW5jdGlvbiBrZXlzKCl7XG4gICAgICByZXR1cm4gYXJyYXlLZXlzLmNhbGwodmFsaWRhdGUodGhpcykpO1xuICAgIH0sXG4gICAgdmFsdWVzOiBmdW5jdGlvbiB2YWx1ZXMoKXtcbiAgICAgIHJldHVybiBhcnJheVZhbHVlcy5jYWxsKHZhbGlkYXRlKHRoaXMpKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGlzVEFJbmRleCA9IGZ1bmN0aW9uKHRhcmdldCwga2V5KXtcbiAgICByZXR1cm4gaXNPYmplY3QodGFyZ2V0KVxuICAgICAgJiYgdGFyZ2V0W1RZUEVEX0FSUkFZXVxuICAgICAgJiYgdHlwZW9mIGtleSAhPSAnc3ltYm9sJ1xuICAgICAgJiYga2V5IGluIHRhcmdldFxuICAgICAgJiYgU3RyaW5nKCtrZXkpID09IFN0cmluZyhrZXkpO1xuICB9O1xuICB2YXIgJGdldERlc2MgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpe1xuICAgIHJldHVybiBpc1RBSW5kZXgodGFyZ2V0LCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKVxuICAgICAgPyBwcm9wZXJ0eURlc2MoMiwgdGFyZ2V0W2tleV0pXG4gICAgICA6IGdPUEQodGFyZ2V0LCBrZXkpO1xuICB9O1xuICB2YXIgJHNldERlc2MgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyl7XG4gICAgaWYoaXNUQUluZGV4KHRhcmdldCwga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKSlcbiAgICAgICYmIGlzT2JqZWN0KGRlc2MpXG4gICAgICAmJiBoYXMoZGVzYywgJ3ZhbHVlJylcbiAgICAgICYmICFoYXMoZGVzYywgJ2dldCcpXG4gICAgICAmJiAhaGFzKGRlc2MsICdzZXQnKVxuICAgICAgLy8gVE9ETzogYWRkIHZhbGlkYXRpb24gZGVzY3JpcHRvciB3L28gY2FsbGluZyBhY2Nlc3NvcnNcbiAgICAgICYmICFkZXNjLmNvbmZpZ3VyYWJsZVxuICAgICAgJiYgKCFoYXMoZGVzYywgJ3dyaXRhYmxlJykgfHwgZGVzYy53cml0YWJsZSlcbiAgICAgICYmICghaGFzKGRlc2MsICdlbnVtZXJhYmxlJykgfHwgZGVzYy5lbnVtZXJhYmxlKVxuICAgICl7XG4gICAgICB0YXJnZXRba2V5XSA9IGRlc2MudmFsdWU7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0gZWxzZSByZXR1cm4gZFAodGFyZ2V0LCBrZXksIGRlc2MpO1xuICB9O1xuXG4gIGlmKCFBTExfQ09OU1RSVUNUT1JTKXtcbiAgICAkR09QRC5mID0gJGdldERlc2M7XG4gICAgJERQLmYgICA9ICRzZXREZXNjO1xuICB9XG5cbiAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhQUxMX0NPTlNUUlVDVE9SUywgJ09iamVjdCcsIHtcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXREZXNjLFxuICAgIGRlZmluZVByb3BlcnR5OiAgICAgICAgICAgJHNldERlc2NcbiAgfSk7XG5cbiAgaWYoZmFpbHMoZnVuY3Rpb24oKXsgYXJyYXlUb1N0cmluZy5jYWxsKHt9KTsgfSkpe1xuICAgIGFycmF5VG9TdHJpbmcgPSBhcnJheVRvTG9jYWxlU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICAgIHJldHVybiBhcnJheUpvaW4uY2FsbCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICB2YXIgJFR5cGVkQXJyYXlQcm90b3R5cGUkID0gcmVkZWZpbmVBbGwoe30sIHByb3RvKTtcbiAgcmVkZWZpbmVBbGwoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCAkaXRlcmF0b3JzKTtcbiAgaGlkZSgkVHlwZWRBcnJheVByb3RvdHlwZSQsIElURVJBVE9SLCAkaXRlcmF0b3JzLnZhbHVlcyk7XG4gIHJlZGVmaW5lQWxsKCRUeXBlZEFycmF5UHJvdG90eXBlJCwge1xuICAgIHNsaWNlOiAgICAgICAgICAkc2xpY2UsXG4gICAgc2V0OiAgICAgICAgICAgICRzZXQsXG4gICAgY29uc3RydWN0b3I6ICAgIGZ1bmN0aW9uKCl7IC8qIG5vb3AgKi8gfSxcbiAgICB0b1N0cmluZzogICAgICAgYXJyYXlUb1N0cmluZyxcbiAgICB0b0xvY2FsZVN0cmluZzogJHRvTG9jYWxlU3RyaW5nXG4gIH0pO1xuICBhZGRHZXR0ZXIoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCAnYnVmZmVyJywgJ2InKTtcbiAgYWRkR2V0dGVyKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgJ2J5dGVPZmZzZXQnLCAnbycpO1xuICBhZGRHZXR0ZXIoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCAnYnl0ZUxlbmd0aCcsICdsJyk7XG4gIGFkZEdldHRlcigkVHlwZWRBcnJheVByb3RvdHlwZSQsICdsZW5ndGgnLCAnZScpO1xuICBkUCgkVHlwZWRBcnJheVByb3RvdHlwZSQsIFRBRywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXNbVFlQRURfQVJSQVldOyB9XG4gIH0pO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBCWVRFUywgd3JhcHBlciwgQ0xBTVBFRCl7XG4gICAgQ0xBTVBFRCA9ICEhQ0xBTVBFRDtcbiAgICB2YXIgTkFNRSAgICAgICA9IEtFWSArIChDTEFNUEVEID8gJ0NsYW1wZWQnIDogJycpICsgJ0FycmF5J1xuICAgICAgLCBJU05UX1VJTlQ4ID0gTkFNRSAhPSAnVWludDhBcnJheSdcbiAgICAgICwgR0VUVEVSICAgICA9ICdnZXQnICsgS0VZXG4gICAgICAsIFNFVFRFUiAgICAgPSAnc2V0JyArIEtFWVxuICAgICAgLCBUeXBlZEFycmF5ID0gZ2xvYmFsW05BTUVdXG4gICAgICAsIEJhc2UgICAgICAgPSBUeXBlZEFycmF5IHx8IHt9XG4gICAgICAsIFRBQyAgICAgICAgPSBUeXBlZEFycmF5ICYmIGdldFByb3RvdHlwZU9mKFR5cGVkQXJyYXkpXG4gICAgICAsIEZPUkNFRCAgICAgPSAhVHlwZWRBcnJheSB8fCAhJHR5cGVkLkFCVlxuICAgICAgLCBPICAgICAgICAgID0ge31cbiAgICAgICwgVHlwZWRBcnJheVByb3RvdHlwZSA9IFR5cGVkQXJyYXkgJiYgVHlwZWRBcnJheVtQUk9UT1RZUEVdO1xuICAgIHZhciBnZXR0ZXIgPSBmdW5jdGlvbih0aGF0LCBpbmRleCl7XG4gICAgICB2YXIgZGF0YSA9IHRoYXQuX2Q7XG4gICAgICByZXR1cm4gZGF0YS52W0dFVFRFUl0oaW5kZXggKiBCWVRFUyArIGRhdGEubywgTElUVExFX0VORElBTik7XG4gICAgfTtcbiAgICB2YXIgc2V0dGVyID0gZnVuY3Rpb24odGhhdCwgaW5kZXgsIHZhbHVlKXtcbiAgICAgIHZhciBkYXRhID0gdGhhdC5fZDtcbiAgICAgIGlmKENMQU1QRUQpdmFsdWUgPSAodmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlKSkgPCAwID8gMCA6IHZhbHVlID4gMHhmZiA/IDB4ZmYgOiB2YWx1ZSAmIDB4ZmY7XG4gICAgICBkYXRhLnZbU0VUVEVSXShpbmRleCAqIEJZVEVTICsgZGF0YS5vLCB2YWx1ZSwgTElUVExFX0VORElBTik7XG4gICAgfTtcbiAgICB2YXIgYWRkRWxlbWVudCA9IGZ1bmN0aW9uKHRoYXQsIGluZGV4KXtcbiAgICAgIGRQKHRoYXQsIGluZGV4LCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gZ2V0dGVyKHRoaXMsIGluZGV4KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgcmV0dXJuIHNldHRlcih0aGlzLCBpbmRleCwgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGlmKEZPUkNFRCl7XG4gICAgICBUeXBlZEFycmF5ID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBkYXRhLCAkb2Zmc2V0LCAkbGVuZ3RoKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGF0LCBUeXBlZEFycmF5LCBOQU1FLCAnX2QnKTtcbiAgICAgICAgdmFyIGluZGV4ICA9IDBcbiAgICAgICAgICAsIG9mZnNldCA9IDBcbiAgICAgICAgICAsIGJ1ZmZlciwgYnl0ZUxlbmd0aCwgbGVuZ3RoLCBrbGFzcztcbiAgICAgICAgaWYoIWlzT2JqZWN0KGRhdGEpKXtcbiAgICAgICAgICBsZW5ndGggICAgID0gc3RyaWN0VG9MZW5ndGgoZGF0YSwgdHJ1ZSlcbiAgICAgICAgICBieXRlTGVuZ3RoID0gbGVuZ3RoICogQllURVM7XG4gICAgICAgICAgYnVmZmVyICAgICA9IG5ldyAkQXJyYXlCdWZmZXIoYnl0ZUxlbmd0aCk7XG4gICAgICAgIH0gZWxzZSBpZihkYXRhIGluc3RhbmNlb2YgJEFycmF5QnVmZmVyIHx8IChrbGFzcyA9IGNsYXNzb2YoZGF0YSkpID09IEFSUkFZX0JVRkZFUiB8fCBrbGFzcyA9PSBTSEFSRURfQlVGRkVSKXtcbiAgICAgICAgICBidWZmZXIgPSBkYXRhO1xuICAgICAgICAgIG9mZnNldCA9IHRvT2Zmc2V0KCRvZmZzZXQsIEJZVEVTKTtcbiAgICAgICAgICB2YXIgJGxlbiA9IGRhdGEuYnl0ZUxlbmd0aDtcbiAgICAgICAgICBpZigkbGVuZ3RoID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgaWYoJGxlbiAlIEJZVEVTKXRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICAgICAgICAgIGJ5dGVMZW5ndGggPSAkbGVuIC0gb2Zmc2V0O1xuICAgICAgICAgICAgaWYoYnl0ZUxlbmd0aCA8IDApdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBieXRlTGVuZ3RoID0gdG9MZW5ndGgoJGxlbmd0aCkgKiBCWVRFUztcbiAgICAgICAgICAgIGlmKGJ5dGVMZW5ndGggKyBvZmZzZXQgPiAkbGVuKXRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGVuZ3RoID0gYnl0ZUxlbmd0aCAvIEJZVEVTO1xuICAgICAgICB9IGVsc2UgaWYoVFlQRURfQVJSQVkgaW4gZGF0YSl7XG4gICAgICAgICAgcmV0dXJuIGZyb21MaXN0KFR5cGVkQXJyYXksIGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkZnJvbS5jYWxsKFR5cGVkQXJyYXksIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGhpZGUodGhhdCwgJ19kJywge1xuICAgICAgICAgIGI6IGJ1ZmZlcixcbiAgICAgICAgICBvOiBvZmZzZXQsXG4gICAgICAgICAgbDogYnl0ZUxlbmd0aCxcbiAgICAgICAgICBlOiBsZW5ndGgsXG4gICAgICAgICAgdjogbmV3ICREYXRhVmlldyhidWZmZXIpXG4gICAgICAgIH0pO1xuICAgICAgICB3aGlsZShpbmRleCA8IGxlbmd0aClhZGRFbGVtZW50KHRoYXQsIGluZGV4KyspO1xuICAgICAgfSk7XG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlID0gVHlwZWRBcnJheVtQUk9UT1RZUEVdID0gY3JlYXRlKCRUeXBlZEFycmF5UHJvdG90eXBlJCk7XG4gICAgICBoaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIFR5cGVkQXJyYXkpO1xuICAgIH0gZWxzZSBpZighJGl0ZXJEZXRlY3QoZnVuY3Rpb24oaXRlcil7XG4gICAgICAvLyBWOCB3b3JrcyB3aXRoIGl0ZXJhdG9ycywgYnV0IGZhaWxzIGluIG1hbnkgb3RoZXIgY2FzZXNcbiAgICAgIC8vIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00NTUyXG4gICAgICBuZXcgVHlwZWRBcnJheShudWxsKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAgIG5ldyBUeXBlZEFycmF5KGl0ZXIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIH0sIHRydWUpKXtcbiAgICAgIFR5cGVkQXJyYXkgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGRhdGEsICRvZmZzZXQsICRsZW5ndGgpe1xuICAgICAgICBhbkluc3RhbmNlKHRoYXQsIFR5cGVkQXJyYXksIE5BTUUpO1xuICAgICAgICB2YXIga2xhc3M7XG4gICAgICAgIC8vIGB3c2AgbW9kdWxlIGJ1ZywgdGVtcG9yYXJpbHkgcmVtb3ZlIHZhbGlkYXRpb24gbGVuZ3RoIGZvciBVaW50OEFycmF5XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJzb2NrZXRzL3dzL3B1bGwvNjQ1XG4gICAgICAgIGlmKCFpc09iamVjdChkYXRhKSlyZXR1cm4gbmV3IEJhc2Uoc3RyaWN0VG9MZW5ndGgoZGF0YSwgSVNOVF9VSU5UOCkpO1xuICAgICAgICBpZihkYXRhIGluc3RhbmNlb2YgJEFycmF5QnVmZmVyIHx8IChrbGFzcyA9IGNsYXNzb2YoZGF0YSkpID09IEFSUkFZX0JVRkZFUiB8fCBrbGFzcyA9PSBTSEFSRURfQlVGRkVSKXtcbiAgICAgICAgICByZXR1cm4gJGxlbmd0aCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IG5ldyBCYXNlKGRhdGEsIHRvT2Zmc2V0KCRvZmZzZXQsIEJZVEVTKSwgJGxlbmd0aClcbiAgICAgICAgICAgIDogJG9mZnNldCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgID8gbmV3IEJhc2UoZGF0YSwgdG9PZmZzZXQoJG9mZnNldCwgQllURVMpKVxuICAgICAgICAgICAgICA6IG5ldyBCYXNlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGlmKFRZUEVEX0FSUkFZIGluIGRhdGEpcmV0dXJuIGZyb21MaXN0KFR5cGVkQXJyYXksIGRhdGEpO1xuICAgICAgICByZXR1cm4gJGZyb20uY2FsbChUeXBlZEFycmF5LCBkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgYXJyYXlGb3JFYWNoKFRBQyAhPT0gRnVuY3Rpb24ucHJvdG90eXBlID8gZ09QTihCYXNlKS5jb25jYXQoZ09QTihUQUMpKSA6IGdPUE4oQmFzZSksIGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIGlmKCEoa2V5IGluIFR5cGVkQXJyYXkpKWhpZGUoVHlwZWRBcnJheSwga2V5LCBCYXNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgICBUeXBlZEFycmF5W1BST1RPVFlQRV0gPSBUeXBlZEFycmF5UHJvdG90eXBlO1xuICAgICAgaWYoIUxJQlJBUlkpVHlwZWRBcnJheVByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFR5cGVkQXJyYXk7XG4gICAgfVxuICAgIHZhciAkbmF0aXZlSXRlcmF0b3IgICA9IFR5cGVkQXJyYXlQcm90b3R5cGVbSVRFUkFUT1JdXG4gICAgICAsIENPUlJFQ1RfSVRFUl9OQU1FID0gISEkbmF0aXZlSXRlcmF0b3IgJiYgKCRuYXRpdmVJdGVyYXRvci5uYW1lID09ICd2YWx1ZXMnIHx8ICRuYXRpdmVJdGVyYXRvci5uYW1lID09IHVuZGVmaW5lZClcbiAgICAgICwgJGl0ZXJhdG9yICAgICAgICAgPSAkaXRlcmF0b3JzLnZhbHVlcztcbiAgICBoaWRlKFR5cGVkQXJyYXksIFRZUEVEX0NPTlNUUlVDVE9SLCB0cnVlKTtcbiAgICBoaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsIFRZUEVEX0FSUkFZLCBOQU1FKTtcbiAgICBoaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsIFZJRVcsIHRydWUpO1xuICAgIGhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgREVGX0NPTlNUUlVDVE9SLCBUeXBlZEFycmF5KTtcblxuICAgIGlmKENMQU1QRUQgPyBuZXcgVHlwZWRBcnJheSgxKVtUQUddICE9IE5BTUUgOiAhKFRBRyBpbiBUeXBlZEFycmF5UHJvdG90eXBlKSl7XG4gICAgICBkUChUeXBlZEFycmF5UHJvdG90eXBlLCBUQUcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gTkFNRTsgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgT1tOQU1FXSA9IFR5cGVkQXJyYXk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChUeXBlZEFycmF5ICE9IEJhc2UpLCBPKTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5TLCBOQU1FLCB7XG4gICAgICBCWVRFU19QRVJfRUxFTUVOVDogQllURVMsXG4gICAgICBmcm9tOiAkZnJvbSxcbiAgICAgIG9mOiAkb2ZcbiAgICB9KTtcblxuICAgIGlmKCEoQllURVNfUEVSX0VMRU1FTlQgaW4gVHlwZWRBcnJheVByb3RvdHlwZSkpaGlkZShUeXBlZEFycmF5UHJvdG90eXBlLCBCWVRFU19QRVJfRUxFTUVOVCwgQllURVMpO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlAsIE5BTUUsIHByb3RvKTtcblxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIEZPUkNFRF9TRVQsIE5BTUUsIHtzZXQ6ICRzZXR9KTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogIUNPUlJFQ1RfSVRFUl9OQU1FLCBOQU1FLCAkaXRlcmF0b3JzKTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKFR5cGVkQXJyYXlQcm90b3R5cGUudG9TdHJpbmcgIT0gYXJyYXlUb1N0cmluZyksIE5BTUUsIHt0b1N0cmluZzogYXJyYXlUb1N0cmluZ30pO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbigpe1xuICAgICAgbmV3IFR5cGVkQXJyYXkoMSkuc2xpY2UoKTtcbiAgICB9KSwgTkFNRSwge3NsaWNlOiAkc2xpY2V9KTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKGZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gWzEsIDJdLnRvTG9jYWxlU3RyaW5nKCkgIT0gbmV3IFR5cGVkQXJyYXkoWzEsIDJdKS50b0xvY2FsZVN0cmluZygpXG4gICAgfSkgfHwgIWZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgICBUeXBlZEFycmF5UHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nLmNhbGwoWzEsIDJdKTtcbiAgICB9KSksIE5BTUUsIHt0b0xvY2FsZVN0cmluZzogJHRvTG9jYWxlU3RyaW5nfSk7XG5cbiAgICBJdGVyYXRvcnNbTkFNRV0gPSBDT1JSRUNUX0lURVJfTkFNRSA/ICRuYXRpdmVJdGVyYXRvciA6ICRpdGVyYXRvcjtcbiAgICBpZighTElCUkFSWSAmJiAhQ09SUkVDVF9JVEVSX05BTUUpaGlkZShUeXBlZEFycmF5UHJvdG90eXBlLCBJVEVSQVRPUiwgJGl0ZXJhdG9yKTtcbiAgfTtcbn0gZWxzZSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICR0eXBlZCAgICAgICAgID0gcmVxdWlyZSgnLi9fdHlwZWQnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmVBbGwgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGZhaWxzICAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIGFuSW5zdGFuY2UgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIHRvSW50ZWdlciAgICAgID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgdG9MZW5ndGggICAgICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGdPUE4gICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mXG4gICwgZFAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgYXJyYXlGaWxsICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1maWxsJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBBUlJBWV9CVUZGRVIgICA9ICdBcnJheUJ1ZmZlcidcbiAgLCBEQVRBX1ZJRVcgICAgICA9ICdEYXRhVmlldydcbiAgLCBQUk9UT1RZUEUgICAgICA9ICdwcm90b3R5cGUnXG4gICwgV1JPTkdfTEVOR1RIICAgPSAnV3JvbmcgbGVuZ3RoISdcbiAgLCBXUk9OR19JTkRFWCAgICA9ICdXcm9uZyBpbmRleCEnXG4gICwgJEFycmF5QnVmZmVyICAgPSBnbG9iYWxbQVJSQVlfQlVGRkVSXVxuICAsICREYXRhVmlldyAgICAgID0gZ2xvYmFsW0RBVEFfVklFV11cbiAgLCBNYXRoICAgICAgICAgICA9IGdsb2JhbC5NYXRoXG4gICwgUmFuZ2VFcnJvciAgICAgPSBnbG9iYWwuUmFuZ2VFcnJvclxuICAsIEluZmluaXR5ICAgICAgID0gZ2xvYmFsLkluZmluaXR5XG4gICwgQmFzZUJ1ZmZlciAgICAgPSAkQXJyYXlCdWZmZXJcbiAgLCBhYnMgICAgICAgICAgICA9IE1hdGguYWJzXG4gICwgcG93ICAgICAgICAgICAgPSBNYXRoLnBvd1xuICAsIGZsb29yICAgICAgICAgID0gTWF0aC5mbG9vclxuICAsIGxvZyAgICAgICAgICAgID0gTWF0aC5sb2dcbiAgLCBMTjIgICAgICAgICAgICA9IE1hdGguTE4yXG4gICwgQlVGRkVSICAgICAgICAgPSAnYnVmZmVyJ1xuICAsIEJZVEVfTEVOR1RIICAgID0gJ2J5dGVMZW5ndGgnXG4gICwgQllURV9PRkZTRVQgICAgPSAnYnl0ZU9mZnNldCdcbiAgLCAkQlVGRkVSICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19iJyA6IEJVRkZFUlxuICAsICRMRU5HVEggICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX2wnIDogQllURV9MRU5HVEhcbiAgLCAkT0ZGU0VUICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19vJyA6IEJZVEVfT0ZGU0VUO1xuXG4vLyBJRUVFNzU0IGNvbnZlcnNpb25zIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvaWVlZTc1NFxudmFyIHBhY2tJRUVFNzU0ID0gZnVuY3Rpb24odmFsdWUsIG1MZW4sIG5CeXRlcyl7XG4gIHZhciBidWZmZXIgPSBBcnJheShuQnl0ZXMpXG4gICAgLCBlTGVuICAgPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgICAsIGVNYXggICA9ICgxIDw8IGVMZW4pIC0gMVxuICAgICwgZUJpYXMgID0gZU1heCA+PiAxXG4gICAgLCBydCAgICAgPSBtTGVuID09PSAyMyA/IHBvdygyLCAtMjQpIC0gcG93KDIsIC03NykgOiAwXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBzICAgICAgPSB2YWx1ZSA8IDAgfHwgdmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCA/IDEgOiAwXG4gICAgLCBlLCBtLCBjO1xuICB2YWx1ZSA9IGFicyh2YWx1ZSlcbiAgaWYodmFsdWUgIT0gdmFsdWUgfHwgdmFsdWUgPT09IEluZmluaXR5KXtcbiAgICBtID0gdmFsdWUgIT0gdmFsdWUgPyAxIDogMDtcbiAgICBlID0gZU1heDtcbiAgfSBlbHNlIHtcbiAgICBlID0gZmxvb3IobG9nKHZhbHVlKSAvIExOMik7XG4gICAgaWYodmFsdWUgKiAoYyA9IHBvdygyLCAtZSkpIDwgMSl7XG4gICAgICBlLS07XG4gICAgICBjICo9IDI7XG4gICAgfVxuICAgIGlmKGUgKyBlQmlhcyA+PSAxKXtcbiAgICAgIHZhbHVlICs9IHJ0IC8gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBwb3coMiwgMSAtIGVCaWFzKTtcbiAgICB9XG4gICAgaWYodmFsdWUgKiBjID49IDIpe1xuICAgICAgZSsrO1xuICAgICAgYyAvPSAyO1xuICAgIH1cbiAgICBpZihlICsgZUJpYXMgPj0gZU1heCl7XG4gICAgICBtID0gMDtcbiAgICAgIGUgPSBlTWF4O1xuICAgIH0gZWxzZSBpZihlICsgZUJpYXMgPj0gMSl7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogcG93KDIsIG1MZW4pO1xuICAgICAgZSA9IGUgKyBlQmlhcztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogcG93KDIsIGVCaWFzIC0gMSkgKiBwb3coMiwgbUxlbik7XG4gICAgICBlID0gMDtcbiAgICB9XG4gIH1cbiAgZm9yKDsgbUxlbiA+PSA4OyBidWZmZXJbaSsrXSA9IG0gJiAyNTUsIG0gLz0gMjU2LCBtTGVuIC09IDgpO1xuICBlID0gZSA8PCBtTGVuIHwgbTtcbiAgZUxlbiArPSBtTGVuO1xuICBmb3IoOyBlTGVuID4gMDsgYnVmZmVyW2krK10gPSBlICYgMjU1LCBlIC89IDI1NiwgZUxlbiAtPSA4KTtcbiAgYnVmZmVyWy0taV0gfD0gcyAqIDEyODtcbiAgcmV0dXJuIGJ1ZmZlcjtcbn07XG52YXIgdW5wYWNrSUVFRTc1NCA9IGZ1bmN0aW9uKGJ1ZmZlciwgbUxlbiwgbkJ5dGVzKXtcbiAgdmFyIGVMZW4gID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gICAgLCBlTWF4ICA9ICgxIDw8IGVMZW4pIC0gMVxuICAgICwgZUJpYXMgPSBlTWF4ID4+IDFcbiAgICAsIG5CaXRzID0gZUxlbiAtIDdcbiAgICAsIGkgICAgID0gbkJ5dGVzIC0gMVxuICAgICwgcyAgICAgPSBidWZmZXJbaS0tXVxuICAgICwgZSAgICAgPSBzICYgMTI3XG4gICAgLCBtO1xuICBzID4+PSA3O1xuICBmb3IoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW2ldLCBpLS0sIG5CaXRzIC09IDgpO1xuICBtID0gZSAmICgxIDw8IC1uQml0cykgLSAxO1xuICBlID4+PSAtbkJpdHM7XG4gIG5CaXRzICs9IG1MZW47XG4gIGZvcig7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbaV0sIGktLSwgbkJpdHMgLT0gOCk7XG4gIGlmKGUgPT09IDApe1xuICAgIGUgPSAxIC0gZUJpYXM7XG4gIH0gZWxzZSBpZihlID09PSBlTWF4KXtcbiAgICByZXR1cm4gbSA/IE5hTiA6IHMgPyAtSW5maW5pdHkgOiBJbmZpbml0eTtcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIHBvdygyLCBtTGVuKTtcbiAgICBlID0gZSAtIGVCaWFzO1xuICB9IHJldHVybiAocyA/IC0xIDogMSkgKiBtICogcG93KDIsIGUgLSBtTGVuKTtcbn07XG5cbnZhciB1bnBhY2tJMzIgPSBmdW5jdGlvbihieXRlcyl7XG4gIHJldHVybiBieXRlc1szXSA8PCAyNCB8IGJ5dGVzWzJdIDw8IDE2IHwgYnl0ZXNbMV0gPDwgOCB8IGJ5dGVzWzBdO1xufTtcbnZhciBwYWNrSTggPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBbaXQgJiAweGZmXTtcbn07XG52YXIgcGFja0kxNiA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIFtpdCAmIDB4ZmYsIGl0ID4+IDggJiAweGZmXTtcbn07XG52YXIgcGFja0kzMiA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIFtpdCAmIDB4ZmYsIGl0ID4+IDggJiAweGZmLCBpdCA+PiAxNiAmIDB4ZmYsIGl0ID4+IDI0ICYgMHhmZl07XG59O1xudmFyIHBhY2tGNjQgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBwYWNrSUVFRTc1NChpdCwgNTIsIDgpO1xufTtcbnZhciBwYWNrRjMyID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gcGFja0lFRUU3NTQoaXQsIDIzLCA0KTtcbn07XG5cbnZhciBhZGRHZXR0ZXIgPSBmdW5jdGlvbihDLCBrZXksIGludGVybmFsKXtcbiAgZFAoQ1tQUk9UT1RZUEVdLCBrZXksIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzW2ludGVybmFsXTsgfX0pO1xufTtcblxudmFyIGdldCA9IGZ1bmN0aW9uKHZpZXcsIGJ5dGVzLCBpbmRleCwgaXNMaXR0bGVFbmRpYW4pe1xuICB2YXIgbnVtSW5kZXggPSAraW5kZXhcbiAgICAsIGludEluZGV4ID0gdG9JbnRlZ2VyKG51bUluZGV4KTtcbiAgaWYobnVtSW5kZXggIT0gaW50SW5kZXggfHwgaW50SW5kZXggPCAwIHx8IGludEluZGV4ICsgYnl0ZXMgPiB2aWV3WyRMRU5HVEhdKXRocm93IFJhbmdlRXJyb3IoV1JPTkdfSU5ERVgpO1xuICB2YXIgc3RvcmUgPSB2aWV3WyRCVUZGRVJdLl9iXG4gICAgLCBzdGFydCA9IGludEluZGV4ICsgdmlld1skT0ZGU0VUXVxuICAgICwgcGFjayAgPSBzdG9yZS5zbGljZShzdGFydCwgc3RhcnQgKyBieXRlcyk7XG4gIHJldHVybiBpc0xpdHRsZUVuZGlhbiA/IHBhY2sgOiBwYWNrLnJldmVyc2UoKTtcbn07XG52YXIgc2V0ID0gZnVuY3Rpb24odmlldywgYnl0ZXMsIGluZGV4LCBjb252ZXJzaW9uLCB2YWx1ZSwgaXNMaXR0bGVFbmRpYW4pe1xuICB2YXIgbnVtSW5kZXggPSAraW5kZXhcbiAgICAsIGludEluZGV4ID0gdG9JbnRlZ2VyKG51bUluZGV4KTtcbiAgaWYobnVtSW5kZXggIT0gaW50SW5kZXggfHwgaW50SW5kZXggPCAwIHx8IGludEluZGV4ICsgYnl0ZXMgPiB2aWV3WyRMRU5HVEhdKXRocm93IFJhbmdlRXJyb3IoV1JPTkdfSU5ERVgpO1xuICB2YXIgc3RvcmUgPSB2aWV3WyRCVUZGRVJdLl9iXG4gICAgLCBzdGFydCA9IGludEluZGV4ICsgdmlld1skT0ZGU0VUXVxuICAgICwgcGFjayAgPSBjb252ZXJzaW9uKCt2YWx1ZSk7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCBieXRlczsgaSsrKXN0b3JlW3N0YXJ0ICsgaV0gPSBwYWNrW2lzTGl0dGxlRW5kaWFuID8gaSA6IGJ5dGVzIC0gaSAtIDFdO1xufTtcblxudmFyIHZhbGlkYXRlQXJyYXlCdWZmZXJBcmd1bWVudHMgPSBmdW5jdGlvbih0aGF0LCBsZW5ndGgpe1xuICBhbkluc3RhbmNlKHRoYXQsICRBcnJheUJ1ZmZlciwgQVJSQVlfQlVGRkVSKTtcbiAgdmFyIG51bWJlckxlbmd0aCA9ICtsZW5ndGhcbiAgICAsIGJ5dGVMZW5ndGggICA9IHRvTGVuZ3RoKG51bWJlckxlbmd0aCk7XG4gIGlmKG51bWJlckxlbmd0aCAhPSBieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgcmV0dXJuIGJ5dGVMZW5ndGg7XG59O1xuXG5pZighJHR5cGVkLkFCVil7XG4gICRBcnJheUJ1ZmZlciA9IGZ1bmN0aW9uIEFycmF5QnVmZmVyKGxlbmd0aCl7XG4gICAgdmFyIGJ5dGVMZW5ndGggPSB2YWxpZGF0ZUFycmF5QnVmZmVyQXJndW1lbnRzKHRoaXMsIGxlbmd0aCk7XG4gICAgdGhpcy5fYiAgICAgICA9IGFycmF5RmlsbC5jYWxsKEFycmF5KGJ5dGVMZW5ndGgpLCAwKTtcbiAgICB0aGlzWyRMRU5HVEhdID0gYnl0ZUxlbmd0aDtcbiAgfTtcblxuICAkRGF0YVZpZXcgPSBmdW5jdGlvbiBEYXRhVmlldyhidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpe1xuICAgIGFuSW5zdGFuY2UodGhpcywgJERhdGFWaWV3LCBEQVRBX1ZJRVcpO1xuICAgIGFuSW5zdGFuY2UoYnVmZmVyLCAkQXJyYXlCdWZmZXIsIERBVEFfVklFVyk7XG4gICAgdmFyIGJ1ZmZlckxlbmd0aCA9IGJ1ZmZlclskTEVOR1RIXVxuICAgICAgLCBvZmZzZXQgICAgICAgPSB0b0ludGVnZXIoYnl0ZU9mZnNldCk7XG4gICAgaWYob2Zmc2V0IDwgMCB8fCBvZmZzZXQgPiBidWZmZXJMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcignV3Jvbmcgb2Zmc2V0IScpO1xuICAgIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID09PSB1bmRlZmluZWQgPyBidWZmZXJMZW5ndGggLSBvZmZzZXQgOiB0b0xlbmd0aChieXRlTGVuZ3RoKTtcbiAgICBpZihvZmZzZXQgKyBieXRlTGVuZ3RoID4gYnVmZmVyTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICB0aGlzWyRCVUZGRVJdID0gYnVmZmVyO1xuICAgIHRoaXNbJE9GRlNFVF0gPSBvZmZzZXQ7XG4gICAgdGhpc1skTEVOR1RIXSA9IGJ5dGVMZW5ndGg7XG4gIH07XG5cbiAgaWYoREVTQ1JJUFRPUlMpe1xuICAgIGFkZEdldHRlcigkQXJyYXlCdWZmZXIsIEJZVEVfTEVOR1RILCAnX2wnKTtcbiAgICBhZGRHZXR0ZXIoJERhdGFWaWV3LCBCVUZGRVIsICdfYicpO1xuICAgIGFkZEdldHRlcigkRGF0YVZpZXcsIEJZVEVfTEVOR1RILCAnX2wnKTtcbiAgICBhZGRHZXR0ZXIoJERhdGFWaWV3LCBCWVRFX09GRlNFVCwgJ19vJyk7XG4gIH1cblxuICByZWRlZmluZUFsbCgkRGF0YVZpZXdbUFJPVE9UWVBFXSwge1xuICAgIGdldEludDg6IGZ1bmN0aW9uIGdldEludDgoYnl0ZU9mZnNldCl7XG4gICAgICByZXR1cm4gZ2V0KHRoaXMsIDEsIGJ5dGVPZmZzZXQpWzBdIDw8IDI0ID4+IDI0O1xuICAgIH0sXG4gICAgZ2V0VWludDg6IGZ1bmN0aW9uIGdldFVpbnQ4KGJ5dGVPZmZzZXQpe1xuICAgICAgcmV0dXJuIGdldCh0aGlzLCAxLCBieXRlT2Zmc2V0KVswXTtcbiAgICB9LFxuICAgIGdldEludDE2OiBmdW5jdGlvbiBnZXRJbnQxNihieXRlT2Zmc2V0IC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgdmFyIGJ5dGVzID0gZ2V0KHRoaXMsIDIsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSk7XG4gICAgICByZXR1cm4gKGJ5dGVzWzFdIDw8IDggfCBieXRlc1swXSkgPDwgMTYgPj4gMTY7XG4gICAgfSxcbiAgICBnZXRVaW50MTY6IGZ1bmN0aW9uIGdldFVpbnQxNihieXRlT2Zmc2V0IC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgdmFyIGJ5dGVzID0gZ2V0KHRoaXMsIDIsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSk7XG4gICAgICByZXR1cm4gYnl0ZXNbMV0gPDwgOCB8IGJ5dGVzWzBdO1xuICAgIH0sXG4gICAgZ2V0SW50MzI6IGZ1bmN0aW9uIGdldEludDMyKGJ5dGVPZmZzZXQgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICByZXR1cm4gdW5wYWNrSTMyKGdldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pKTtcbiAgICB9LFxuICAgIGdldFVpbnQzMjogZnVuY3Rpb24gZ2V0VWludDMyKGJ5dGVPZmZzZXQgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICByZXR1cm4gdW5wYWNrSTMyKGdldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pKSA+Pj4gMDtcbiAgICB9LFxuICAgIGdldEZsb2F0MzI6IGZ1bmN0aW9uIGdldEZsb2F0MzIoYnl0ZU9mZnNldCAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHJldHVybiB1bnBhY2tJRUVFNzU0KGdldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pLCAyMywgNCk7XG4gICAgfSxcbiAgICBnZXRGbG9hdDY0OiBmdW5jdGlvbiBnZXRGbG9hdDY0KGJ5dGVPZmZzZXQgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICByZXR1cm4gdW5wYWNrSUVFRTc1NChnZXQodGhpcywgOCwgYnl0ZU9mZnNldCwgYXJndW1lbnRzWzFdKSwgNTIsIDgpO1xuICAgIH0sXG4gICAgc2V0SW50ODogZnVuY3Rpb24gc2V0SW50OChieXRlT2Zmc2V0LCB2YWx1ZSl7XG4gICAgICBzZXQodGhpcywgMSwgYnl0ZU9mZnNldCwgcGFja0k4LCB2YWx1ZSk7XG4gICAgfSxcbiAgICBzZXRVaW50ODogZnVuY3Rpb24gc2V0VWludDgoYnl0ZU9mZnNldCwgdmFsdWUpe1xuICAgICAgc2V0KHRoaXMsIDEsIGJ5dGVPZmZzZXQsIHBhY2tJOCwgdmFsdWUpO1xuICAgIH0sXG4gICAgc2V0SW50MTY6IGZ1bmN0aW9uIHNldEludDE2KGJ5dGVPZmZzZXQsIHZhbHVlIC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgc2V0KHRoaXMsIDIsIGJ5dGVPZmZzZXQsIHBhY2tJMTYsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0VWludDE2OiBmdW5jdGlvbiBzZXRVaW50MTYoYnl0ZU9mZnNldCwgdmFsdWUgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICBzZXQodGhpcywgMiwgYnl0ZU9mZnNldCwgcGFja0kxNiwgdmFsdWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfSxcbiAgICBzZXRJbnQzMjogZnVuY3Rpb24gc2V0SW50MzIoYnl0ZU9mZnNldCwgdmFsdWUgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICBzZXQodGhpcywgNCwgYnl0ZU9mZnNldCwgcGFja0kzMiwgdmFsdWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfSxcbiAgICBzZXRVaW50MzI6IGZ1bmN0aW9uIHNldFVpbnQzMihieXRlT2Zmc2V0LCB2YWx1ZSAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHNldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBwYWNrSTMyLCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9LFxuICAgIHNldEZsb2F0MzI6IGZ1bmN0aW9uIHNldEZsb2F0MzIoYnl0ZU9mZnNldCwgdmFsdWUgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICBzZXQodGhpcywgNCwgYnl0ZU9mZnNldCwgcGFja0YzMiwgdmFsdWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfSxcbiAgICBzZXRGbG9hdDY0OiBmdW5jdGlvbiBzZXRGbG9hdDY0KGJ5dGVPZmZzZXQsIHZhbHVlIC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgc2V0KHRoaXMsIDgsIGJ5dGVPZmZzZXQsIHBhY2tGNjQsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH1cbiAgfSk7XG59IGVsc2Uge1xuICBpZighZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgJEFycmF5QnVmZmVyOyAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgfSkgfHwgIWZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgbmV3ICRBcnJheUJ1ZmZlciguNSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gIH0pKXtcbiAgICAkQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiBBcnJheUJ1ZmZlcihsZW5ndGgpe1xuICAgICAgcmV0dXJuIG5ldyBCYXNlQnVmZmVyKHZhbGlkYXRlQXJyYXlCdWZmZXJBcmd1bWVudHModGhpcywgbGVuZ3RoKSk7XG4gICAgfTtcbiAgICB2YXIgQXJyYXlCdWZmZXJQcm90byA9ICRBcnJheUJ1ZmZlcltQUk9UT1RZUEVdID0gQmFzZUJ1ZmZlcltQUk9UT1RZUEVdO1xuICAgIGZvcih2YXIga2V5cyA9IGdPUE4oQmFzZUJ1ZmZlciksIGogPSAwLCBrZXk7IGtleXMubGVuZ3RoID4gajsgKXtcbiAgICAgIGlmKCEoKGtleSA9IGtleXNbaisrXSkgaW4gJEFycmF5QnVmZmVyKSloaWRlKCRBcnJheUJ1ZmZlciwga2V5LCBCYXNlQnVmZmVyW2tleV0pO1xuICAgIH07XG4gICAgaWYoIUxJQlJBUlkpQXJyYXlCdWZmZXJQcm90by5jb25zdHJ1Y3RvciA9ICRBcnJheUJ1ZmZlcjtcbiAgfVxuICAvLyBpT1MgU2FmYXJpIDcueCBidWdcbiAgdmFyIHZpZXcgPSBuZXcgJERhdGFWaWV3KG5ldyAkQXJyYXlCdWZmZXIoMikpXG4gICAgLCAkc2V0SW50OCA9ICREYXRhVmlld1tQUk9UT1RZUEVdLnNldEludDg7XG4gIHZpZXcuc2V0SW50OCgwLCAyMTQ3NDgzNjQ4KTtcbiAgdmlldy5zZXRJbnQ4KDEsIDIxNDc0ODM2NDkpO1xuICBpZih2aWV3LmdldEludDgoMCkgfHwgIXZpZXcuZ2V0SW50OCgxKSlyZWRlZmluZUFsbCgkRGF0YVZpZXdbUFJPVE9UWVBFXSwge1xuICAgIHNldEludDg6IGZ1bmN0aW9uIHNldEludDgoYnl0ZU9mZnNldCwgdmFsdWUpe1xuICAgICAgJHNldEludDguY2FsbCh0aGlzLCBieXRlT2Zmc2V0LCB2YWx1ZSA8PCAyNCA+PiAyNCk7XG4gICAgfSxcbiAgICBzZXRVaW50ODogZnVuY3Rpb24gc2V0VWludDgoYnl0ZU9mZnNldCwgdmFsdWUpe1xuICAgICAgJHNldEludDguY2FsbCh0aGlzLCBieXRlT2Zmc2V0LCB2YWx1ZSA8PCAyNCA+PiAyNCk7XG4gICAgfVxuICB9LCB0cnVlKTtcbn1cbnNldFRvU3RyaW5nVGFnKCRBcnJheUJ1ZmZlciwgQVJSQVlfQlVGRkVSKTtcbnNldFRvU3RyaW5nVGFnKCREYXRhVmlldywgREFUQV9WSUVXKTtcbmhpZGUoJERhdGFWaWV3W1BST1RPVFlQRV0sICR0eXBlZC5WSUVXLCB0cnVlKTtcbmV4cG9ydHNbQVJSQVlfQlVGRkVSXSA9ICRBcnJheUJ1ZmZlcjtcbmV4cG9ydHNbREFUQV9WSUVXXSA9ICREYXRhVmlldzsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFRZUEVEICA9IHVpZCgndHlwZWRfYXJyYXknKVxuICAsIFZJRVcgICA9IHVpZCgndmlldycpXG4gICwgQUJWICAgID0gISEoZ2xvYmFsLkFycmF5QnVmZmVyICYmIGdsb2JhbC5EYXRhVmlldylcbiAgLCBDT05TVFIgPSBBQlZcbiAgLCBpID0gMCwgbCA9IDksIFR5cGVkO1xuXG52YXIgVHlwZWRBcnJheUNvbnN0cnVjdG9ycyA9IChcbiAgJ0ludDhBcnJheSxVaW50OEFycmF5LFVpbnQ4Q2xhbXBlZEFycmF5LEludDE2QXJyYXksVWludDE2QXJyYXksSW50MzJBcnJheSxVaW50MzJBcnJheSxGbG9hdDMyQXJyYXksRmxvYXQ2NEFycmF5J1xuKS5zcGxpdCgnLCcpO1xuXG53aGlsZShpIDwgbCl7XG4gIGlmKFR5cGVkID0gZ2xvYmFsW1R5cGVkQXJyYXlDb25zdHJ1Y3RvcnNbaSsrXV0pe1xuICAgIGhpZGUoVHlwZWQucHJvdG90eXBlLCBUWVBFRCwgdHJ1ZSk7XG4gICAgaGlkZShUeXBlZC5wcm90b3R5cGUsIFZJRVcsIHRydWUpO1xuICB9IGVsc2UgQ09OU1RSID0gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBQlY6ICAgIEFCVixcbiAgQ09OU1RSOiBDT05TVFIsXG4gIFRZUEVEOiAgVFlQRUQsXG4gIFZJRVc6ICAgVklFV1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCB3a3NFeHQgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcy1leHQnKVxuICAsIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHZhciAkU3ltYm9sID0gY29yZS5TeW1ib2wgfHwgKGNvcmUuU3ltYm9sID0gTElCUkFSWSA/IHt9IDogZ2xvYmFsLlN5bWJvbCB8fCB7fSk7XG4gIGlmKG5hbWUuY2hhckF0KDApICE9ICdfJyAmJiAhKG5hbWUgaW4gJFN5bWJvbCkpZGVmaW5lUHJvcGVydHkoJFN5bWJvbCwgbmFtZSwge3ZhbHVlOiB3a3NFeHQuZihuYW1lKX0pO1xufTsiLCJleHBvcnRzLmYgPSByZXF1aXJlKCcuL193a3MnKTsiLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTsiLCJ2YXIgY2xhc3NvZiAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIvLyAyMi4xLjMuMyBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCBlbmQgPSB0aGlzLmxlbmd0aClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7Y29weVdpdGhpbjogcmVxdWlyZSgnLi9fYXJyYXktY29weS13aXRoaW4nKX0pO1xuXG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKSgnY29weVdpdGhpbicpOyIsIi8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHtmaWxsOiByZXF1aXJlKCcuL19hcnJheS1maWxsJyl9KTtcblxucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoJ2ZpbGwnKTsiLCIndXNlIHN0cmljdCc7XG4vLyAyMi4xLjMuOSBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4KHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkZmluZCAgID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDYpXG4gICwgS0VZICAgICA9ICdmaW5kSW5kZXgnXG4gICwgZm9yY2VkICA9IHRydWU7XG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xuaWYoS0VZIGluIFtdKUFycmF5KDEpW0tFWV0oZnVuY3Rpb24oKXsgZm9yY2VkID0gZmFsc2U7IH0pO1xuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBmb3JjZWQsICdBcnJheScsIHtcbiAgZmluZEluZGV4OiBmdW5jdGlvbiBmaW5kSW5kZXgoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGZpbmQodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKEtFWSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjIuMS4zLjggQXJyYXkucHJvdG90eXBlLmZpbmQocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRmaW5kICAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoNSlcbiAgLCBLRVkgICAgID0gJ2ZpbmQnXG4gICwgZm9yY2VkICA9IHRydWU7XG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xuaWYoS0VZIGluIFtdKUFycmF5KDEpW0tFWV0oZnVuY3Rpb24oKXsgZm9yY2VkID0gZmFsc2U7IH0pO1xuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBmb3JjZWQsICdBcnJheScsIHtcbiAgZmluZDogZnVuY3Rpb24gZmluZChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZmluZCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoS0VZKTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCB0b09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgY2FsbCAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyICAgID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpXG4gICwgdG9MZW5ndGggICAgICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5JylcbiAgLCBnZXRJdGVyRm4gICAgICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UvKiwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQqLyl7XG4gICAgdmFyIE8gICAgICAgPSB0b09iamVjdChhcnJheUxpa2UpXG4gICAgICAsIEMgICAgICAgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5XG4gICAgICAsIGFMZW4gICAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIG1hcGZuICAgPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZFxuICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxuICAgICAgLCBpbmRleCAgID0gMFxuICAgICAgLCBpdGVyRm4gID0gZ2V0SXRlckZuKE8pXG4gICAgICAsIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZihtYXBwaW5nKW1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpe1xuICAgICAgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4Kyspe1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvcihyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpXG4gICwgc3RlcCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwga2luZCAgPSB0aGlzLl9rXG4gICAgLCBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcblxuLy8gV2ViS2l0IEFycmF5Lm9mIGlzbid0IGdlbmVyaWNcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICBmdW5jdGlvbiBGKCl7fVxuICByZXR1cm4gIShBcnJheS5vZi5jYWxsKEYpIGluc3RhbmNlb2YgRik7XG59KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMyBBcnJheS5vZiggLi4uaXRlbXMpXG4gIG9mOiBmdW5jdGlvbiBvZigvKiAuLi5hcmdzICovKXtcbiAgICB2YXIgaW5kZXggID0gMFxuICAgICAgLCBhTGVuICAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIHJlc3VsdCA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSkoYUxlbik7XG4gICAgd2hpbGUoYUxlbiA+IGluZGV4KWNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGFMZW47XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIGhhcyAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEZQcm90byAgICAgPSBGdW5jdGlvbi5wcm90b3R5cGVcbiAgLCBuYW1lUkUgICAgID0gL15cXHMqZnVuY3Rpb24gKFteIChdKikvXG4gICwgTkFNRSAgICAgICA9ICduYW1lJztcblxudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vLyAxOS4yLjQuMiBuYW1lXG5OQU1FIGluIEZQcm90byB8fCByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmIGRQKEZQcm90bywgTkFNRSwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKXtcbiAgICB0cnkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgICwgbmFtZSA9ICgnJyArIHRoYXQpLm1hdGNoKG5hbWVSRSlbMV07XG4gICAgICBoYXModGhhdCwgTkFNRSkgfHwgIWlzRXh0ZW5zaWJsZSh0aGF0KSB8fCBkUCh0aGF0LCBOQU1FLCBjcmVhdGVEZXNjKDUsIG5hbWUpKTtcbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ01hcCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpOyIsIi8vIDIwLjIuMi4zIE1hdGguYWNvc2goeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBsb2cxcCAgID0gcmVxdWlyZSgnLi9fbWF0aC1sb2cxcCcpXG4gICwgc3FydCAgICA9IE1hdGguc3FydFxuICAsICRhY29zaCAgPSBNYXRoLmFjb3NoO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoJGFjb3NoXG4gIC8vIFY4IGJ1ZzogaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTM1MDlcbiAgJiYgTWF0aC5mbG9vcigkYWNvc2goTnVtYmVyLk1BWF9WQUxVRSkpID09IDcxMFxuICAvLyBUb3IgQnJvd3NlciBidWc6IE1hdGguYWNvc2goSW5maW5pdHkpIC0+IE5hTiBcbiAgJiYgJGFjb3NoKEluZmluaXR5KSA9PSBJbmZpbml0eVxuKSwgJ01hdGgnLCB7XG4gIGFjb3NoOiBmdW5jdGlvbiBhY29zaCh4KXtcbiAgICByZXR1cm4gKHggPSAreCkgPCAxID8gTmFOIDogeCA+IDk0OTA2MjY1LjYyNDI1MTU2XG4gICAgICA/IE1hdGgubG9nKHgpICsgTWF0aC5MTjJcbiAgICAgIDogbG9nMXAoeCAtIDEgKyBzcXJ0KHggLSAxKSAqIHNxcnQoeCArIDEpKTtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRhc2luaCAgPSBNYXRoLmFzaW5oO1xuXG5mdW5jdGlvbiBhc2luaCh4KXtcbiAgcmV0dXJuICFpc0Zpbml0ZSh4ID0gK3gpIHx8IHggPT0gMCA/IHggOiB4IDwgMCA/IC1hc2luaCgteCkgOiBNYXRoLmxvZyh4ICsgTWF0aC5zcXJ0KHggKiB4ICsgMSkpO1xufVxuXG4vLyBUb3IgQnJvd3NlciBidWc6IE1hdGguYXNpbmgoMCkgLT4gLTAgXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoJGFzaW5oICYmIDEgLyAkYXNpbmgoMCkgPiAwKSwgJ01hdGgnLCB7YXNpbmg6IGFzaW5ofSk7IiwiLy8gMjAuMi4yLjcgTWF0aC5hdGFuaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRhdGFuaCAgPSBNYXRoLmF0YW5oO1xuXG4vLyBUb3IgQnJvd3NlciBidWc6IE1hdGguYXRhbmgoLTApIC0+IDAgXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoJGF0YW5oICYmIDEgLyAkYXRhbmgoLTApIDwgMCksICdNYXRoJywge1xuICBhdGFuaDogZnVuY3Rpb24gYXRhbmgoeCl7XG4gICAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogTWF0aC5sb2coKDEgKyB4KSAvICgxIC0geCkpIC8gMjtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjkgTWF0aC5jYnJ0KHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgc2lnbiAgICA9IHJlcXVpcmUoJy4vX21hdGgtc2lnbicpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGNicnQ6IGZ1bmN0aW9uIGNicnQoeCl7XG4gICAgcmV0dXJuIHNpZ24oeCA9ICt4KSAqIE1hdGgucG93KE1hdGguYWJzKHgpLCAxIC8gMyk7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4xMSBNYXRoLmNsejMyKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGNsejMyOiBmdW5jdGlvbiBjbHozMih4KXtcbiAgICByZXR1cm4gKHggPj4+PSAwKSA/IDMxIC0gTWF0aC5mbG9vcihNYXRoLmxvZyh4ICsgMC41KSAqIE1hdGguTE9HMkUpIDogMzI7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4xMiBNYXRoLmNvc2goeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBleHAgICAgID0gTWF0aC5leHA7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgY29zaDogZnVuY3Rpb24gY29zaCh4KXtcbiAgICByZXR1cm4gKGV4cCh4ID0gK3gpICsgZXhwKC14KSkgLyAyO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRleHBtMSAgPSByZXF1aXJlKCcuL19tYXRoLWV4cG0xJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCRleHBtMSAhPSBNYXRoLmV4cG0xKSwgJ01hdGgnLCB7ZXhwbTE6ICRleHBtMX0pOyIsIi8vIDIwLjIuMi4xNiBNYXRoLmZyb3VuZCh4KVxudmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgc2lnbiAgICAgID0gcmVxdWlyZSgnLi9fbWF0aC1zaWduJylcbiAgLCBwb3cgICAgICAgPSBNYXRoLnBvd1xuICAsIEVQU0lMT04gICA9IHBvdygyLCAtNTIpXG4gICwgRVBTSUxPTjMyID0gcG93KDIsIC0yMylcbiAgLCBNQVgzMiAgICAgPSBwb3coMiwgMTI3KSAqICgyIC0gRVBTSUxPTjMyKVxuICAsIE1JTjMyICAgICA9IHBvdygyLCAtMTI2KTtcblxudmFyIHJvdW5kVGllc1RvRXZlbiA9IGZ1bmN0aW9uKG4pe1xuICByZXR1cm4gbiArIDEgLyBFUFNJTE9OIC0gMSAvIEVQU0lMT047XG59O1xuXG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgZnJvdW5kOiBmdW5jdGlvbiBmcm91bmQoeCl7XG4gICAgdmFyICRhYnMgID0gTWF0aC5hYnMoeClcbiAgICAgICwgJHNpZ24gPSBzaWduKHgpXG4gICAgICAsIGEsIHJlc3VsdDtcbiAgICBpZigkYWJzIDwgTUlOMzIpcmV0dXJuICRzaWduICogcm91bmRUaWVzVG9FdmVuKCRhYnMgLyBNSU4zMiAvIEVQU0lMT04zMikgKiBNSU4zMiAqIEVQU0lMT04zMjtcbiAgICBhID0gKDEgKyBFUFNJTE9OMzIgLyBFUFNJTE9OKSAqICRhYnM7XG4gICAgcmVzdWx0ID0gYSAtIChhIC0gJGFicyk7XG4gICAgaWYocmVzdWx0ID4gTUFYMzIgfHwgcmVzdWx0ICE9IHJlc3VsdClyZXR1cm4gJHNpZ24gKiBJbmZpbml0eTtcbiAgICByZXR1cm4gJHNpZ24gKiByZXN1bHQ7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4xNyBNYXRoLmh5cG90KFt2YWx1ZTFbLCB2YWx1ZTJbLCDigKYgXV1dKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGFicyAgICAgPSBNYXRoLmFicztcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBoeXBvdDogZnVuY3Rpb24gaHlwb3QodmFsdWUxLCB2YWx1ZTIpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHN1bSAgPSAwXG4gICAgICAsIGkgICAgPSAwXG4gICAgICAsIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIGxhcmcgPSAwXG4gICAgICAsIGFyZywgZGl2O1xuICAgIHdoaWxlKGkgPCBhTGVuKXtcbiAgICAgIGFyZyA9IGFicyhhcmd1bWVudHNbaSsrXSk7XG4gICAgICBpZihsYXJnIDwgYXJnKXtcbiAgICAgICAgZGl2ICA9IGxhcmcgLyBhcmc7XG4gICAgICAgIHN1bSAgPSBzdW0gKiBkaXYgKiBkaXYgKyAxO1xuICAgICAgICBsYXJnID0gYXJnO1xuICAgICAgfSBlbHNlIGlmKGFyZyA+IDApe1xuICAgICAgICBkaXYgID0gYXJnIC8gbGFyZztcbiAgICAgICAgc3VtICs9IGRpdiAqIGRpdjtcbiAgICAgIH0gZWxzZSBzdW0gKz0gYXJnO1xuICAgIH1cbiAgICByZXR1cm4gbGFyZyA9PT0gSW5maW5pdHkgPyBJbmZpbml0eSA6IGxhcmcgKiBNYXRoLnNxcnQoc3VtKTtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjE4IE1hdGguaW11bCh4LCB5KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRpbXVsICAgPSBNYXRoLmltdWw7XG5cbi8vIHNvbWUgV2ViS2l0IHZlcnNpb25zIGZhaWxzIHdpdGggYmlnIG51bWJlcnMsIHNvbWUgaGFzIHdyb25nIGFyaXR5XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRpbXVsKDB4ZmZmZmZmZmYsIDUpICE9IC01IHx8ICRpbXVsLmxlbmd0aCAhPSAyO1xufSksICdNYXRoJywge1xuICBpbXVsOiBmdW5jdGlvbiBpbXVsKHgsIHkpe1xuICAgIHZhciBVSU5UMTYgPSAweGZmZmZcbiAgICAgICwgeG4gPSAreFxuICAgICAgLCB5biA9ICt5XG4gICAgICAsIHhsID0gVUlOVDE2ICYgeG5cbiAgICAgICwgeWwgPSBVSU5UMTYgJiB5bjtcbiAgICByZXR1cm4gMCB8IHhsICogeWwgKyAoKFVJTlQxNiAmIHhuID4+PiAxNikgKiB5bCArIHhsICogKFVJTlQxNiAmIHluID4+PiAxNikgPDwgMTYgPj4+IDApO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMjEgTWF0aC5sb2cxMCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBsb2cxMDogZnVuY3Rpb24gbG9nMTAoeCl7XG4gICAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5MTjEwO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMjAgTWF0aC5sb2cxcCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge2xvZzFwOiByZXF1aXJlKCcuL19tYXRoLWxvZzFwJyl9KTsiLCIvLyAyMC4yLjIuMjIgTWF0aC5sb2cyKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGxvZzI6IGZ1bmN0aW9uIGxvZzIoeCl7XG4gICAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5MTjI7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtzaWduOiByZXF1aXJlKCcuL19tYXRoLXNpZ24nKX0pOyIsIi8vIDIwLjIuMi4zMCBNYXRoLnNpbmgoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBleHBtMSAgID0gcmVxdWlyZSgnLi9fbWF0aC1leHBtMScpXG4gICwgZXhwICAgICA9IE1hdGguZXhwO1xuXG4vLyBWOCBuZWFyIENocm9taXVtIDM4IGhhcyBhIHByb2JsZW0gd2l0aCB2ZXJ5IHNtYWxsIG51bWJlcnNcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gIU1hdGguc2luaCgtMmUtMTcpICE9IC0yZS0xNztcbn0pLCAnTWF0aCcsIHtcbiAgc2luaDogZnVuY3Rpb24gc2luaCh4KXtcbiAgICByZXR1cm4gTWF0aC5hYnMoeCA9ICt4KSA8IDFcbiAgICAgID8gKGV4cG0xKHgpIC0gZXhwbTEoLXgpKSAvIDJcbiAgICAgIDogKGV4cCh4IC0gMSkgLSBleHAoLXggLSAxKSkgKiAoTWF0aC5FIC8gMik7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4zMyBNYXRoLnRhbmgoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBleHBtMSAgID0gcmVxdWlyZSgnLi9fbWF0aC1leHBtMScpXG4gICwgZXhwICAgICA9IE1hdGguZXhwO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIHRhbmg6IGZ1bmN0aW9uIHRhbmgoeCl7XG4gICAgdmFyIGEgPSBleHBtMSh4ID0gK3gpXG4gICAgICAsIGIgPSBleHBtMSgteCk7XG4gICAgcmV0dXJuIGEgPT0gSW5maW5pdHkgPyAxIDogYiA9PSBJbmZpbml0eSA/IC0xIDogKGEgLSBiKSAvIChleHAoeCkgKyBleHAoLXgpKTtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjM0IE1hdGgudHJ1bmMoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgdHJ1bmM6IGZ1bmN0aW9uIHRydW5jKGl0KXtcbiAgICByZXR1cm4gKGl0ID4gMCA/IE1hdGguZmxvb3IgOiBNYXRoLmNlaWwpKGl0KTtcbiAgfVxufSk7IiwiLy8gMjAuMS4yLjEgTnVtYmVyLkVQU0lMT05cbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge0VQU0lMT046IE1hdGgucG93KDIsIC01Mil9KTsiLCIvLyAyMC4xLjIuMiBOdW1iZXIuaXNGaW5pdGUobnVtYmVyKVxudmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgX2lzRmluaXRlID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuaXNGaW5pdGU7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge1xuICBpc0Zpbml0ZTogZnVuY3Rpb24gaXNGaW5pdGUoaXQpe1xuICAgIHJldHVybiB0eXBlb2YgaXQgPT0gJ251bWJlcicgJiYgX2lzRmluaXRlKGl0KTtcbiAgfVxufSk7IiwiLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtpc0ludGVnZXI6IHJlcXVpcmUoJy4vX2lzLWludGVnZXInKX0pOyIsIi8vIDIwLjEuMi40IE51bWJlci5pc05hTihudW1iZXIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtcbiAgaXNOYU46IGZ1bmN0aW9uIGlzTmFOKG51bWJlcil7XG4gICAgcmV0dXJuIG51bWJlciAhPSBudW1iZXI7XG4gIH1cbn0pOyIsIi8vIDIwLjEuMi41IE51bWJlci5pc1NhZmVJbnRlZ2VyKG51bWJlcilcbnZhciAkZXhwb3J0ICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGlzSW50ZWdlciA9IHJlcXVpcmUoJy4vX2lzLWludGVnZXInKVxuICAsIGFicyAgICAgICA9IE1hdGguYWJzO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtcbiAgaXNTYWZlSW50ZWdlcjogZnVuY3Rpb24gaXNTYWZlSW50ZWdlcihudW1iZXIpe1xuICAgIHJldHVybiBpc0ludGVnZXIobnVtYmVyKSAmJiBhYnMobnVtYmVyKSA8PSAweDFmZmZmZmZmZmZmZmZmO1xuICB9XG59KTsiLCIvLyAyMC4xLjIuNiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7TUFYX1NBRkVfSU5URUdFUjogMHgxZmZmZmZmZmZmZmZmZn0pOyIsIi8vIDIwLjEuMi4xMCBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7TUlOX1NBRkVfSU5URUdFUjogLTB4MWZmZmZmZmZmZmZmZmZ9KTsiLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7YXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJyl9KTsiLCIvLyAxOS4xLjMuMTAgT2JqZWN0LmlzKHZhbHVlMSwgdmFsdWUyKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge2lzOiByZXF1aXJlKCcuL19zYW1lLXZhbHVlJyl9KTsiLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge3NldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXR9KTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNsYXNzb2YgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsICRleHBvcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgaXNPYmplY3QgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gICAgICAgICAgPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBhbkluc3RhbmNlICAgICAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZm9yT2YgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgLCB0YXNrICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgbWljcm90YXNrICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKVxuICAsIFBST01JU0UgICAgICAgICAgICA9ICdQcm9taXNlJ1xuICAsIFR5cGVFcnJvciAgICAgICAgICA9IGdsb2JhbC5UeXBlRXJyb3JcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsICRQcm9taXNlICAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgICAgICAgICAgID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBlbXB0eSAgICAgICAgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgSW50ZXJuYWwsIEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcblxudmFyIFVTRV9OQVRJVkUgPSAhIWZ1bmN0aW9uKCl7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgICAgID0gJFByb21pc2UucmVzb2x2ZSgxKVxuICAgICAgLCBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24oZXhlYyl7IGV4ZWMoZW1wdHksIGVtcHR5KTsgfTtcbiAgICAvLyB1bmhhbmRsZWQgcmVqZWN0aW9ucyB0cmFja2luZyBzdXBwb3J0LCBOb2RlSlMgUHJvbWlzZSB3aXRob3V0IGl0IGZhaWxzIEBAc3BlY2llcyB0ZXN0XG4gICAgcmV0dXJuIChpc05vZGUgfHwgdHlwZW9mIFByb21pc2VSZWplY3Rpb25FdmVudCA9PSAnZnVuY3Rpb24nKSAmJiBwcm9taXNlLnRoZW4oZW1wdHkpIGluc3RhbmNlb2YgRmFrZVByb21pc2U7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIHNhbWVDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGEsIGIpe1xuICAvLyB3aXRoIGxpYnJhcnkgd3JhcHBlciBzcGVjaWFsIGNhc2VcbiAgcmV0dXJuIGEgPT09IGIgfHwgYSA9PT0gJFByb21pc2UgJiYgYiA9PT0gV3JhcHBlcjtcbn07XG52YXIgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgcmV0dXJuIHNhbWVDb25zdHJ1Y3RvcigkUHJvbWlzZSwgQylcbiAgICA/IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgIDogbmV3IEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG52YXIgUHJvbWlzZUNhcGFiaWxpdHkgPSBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24oJCRyZXNvbHZlLCAkJHJlamVjdCl7XG4gICAgaWYocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCAgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgID0gYUZ1bmN0aW9uKHJlamVjdCk7XG59O1xudmFyIHBlcmZvcm0gPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHtlcnJvcjogZX07XG4gIH1cbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocHJvbWlzZSwgaXNSZWplY3Qpe1xuICBpZihwcm9taXNlLl9uKXJldHVybjtcbiAgcHJvbWlzZS5fbiA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2M7XG4gIG1pY3JvdGFzayhmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICwgb2sgICAgPSBwcm9taXNlLl9zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbihyZWFjdGlvbil7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsXG4gICAgICAgICwgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmVcbiAgICAgICAgLCByZWplY3QgID0gcmVhY3Rpb24ucmVqZWN0XG4gICAgICAgICwgZG9tYWluICA9IHJlYWN0aW9uLmRvbWFpblxuICAgICAgICAsIHJlc3VsdCwgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmKGhhbmRsZXIpe1xuICAgICAgICAgIGlmKCFvayl7XG4gICAgICAgICAgICBpZihwcm9taXNlLl9oID09IDIpb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlLl9oID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoaGFuZGxlciA9PT0gdHJ1ZSlyZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmKGRvbWFpbilkb21haW4uZW50ZXIoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgICAgaWYoZG9tYWluKWRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSl7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBwcm9taXNlLl9jID0gW107XG4gICAgcHJvbWlzZS5fbiA9IGZhbHNlO1xuICAgIGlmKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKW9uVW5oYW5kbGVkKHByb21pc2UpO1xuICB9KTtcbn07XG52YXIgb25VbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIGFicnVwdCwgaGFuZGxlciwgY29uc29sZTtcbiAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlKSl7XG4gICAgICBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIG5vdCB0cmlnZ2VyIGByZWplY3Rpb25IYW5kbGVkYCBldmVudCBpZiBpdCB3YXMgaGFuZGxlZCBoZXJlLCBOb2RlSlMgLSBzaG91bGRcbiAgICAgIHByb21pc2UuX2ggPSBpc05vZGUgfHwgaXNVbmhhbmRsZWQocHJvbWlzZSkgPyAyIDogMTtcbiAgICB9IHByb21pc2UuX2EgPSB1bmRlZmluZWQ7XG4gICAgaWYoYWJydXB0KXRocm93IGFicnVwdC5lcnJvcjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIGlmKHByb21pc2UuX2ggPT0gMSlyZXR1cm4gZmFsc2U7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2EgfHwgcHJvbWlzZS5fY1xuICAgICwgaSAgICAgPSAwXG4gICAgLCByZWFjdGlvbjtcbiAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XG4gICAgcmVhY3Rpb24gPSBjaGFpbltpKytdO1xuICAgIGlmKHJlYWN0aW9uLmZhaWwgfHwgIWlzVW5oYW5kbGVkKHJlYWN0aW9uLnByb21pc2UpKXJldHVybiBmYWxzZTtcbiAgfSByZXR1cm4gdHJ1ZTtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZihpc05vZGUpe1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKXtcbiAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdn0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICBwcm9taXNlLl9zID0gMjtcbiAgaWYoIXByb21pc2UuX2EpcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHByb21pc2UgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihwcm9taXNlLl9kKXJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHByb21pc2UgPT09IHZhbHVlKXRocm93IFR5cGVFcnJvcihcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmXCIpO1xuICAgIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSl7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7X3c6IHByb21pc2UsIF9kOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe193OiBwcm9taXNlLCBfZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIVVTRV9OQVRJVkUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFuSW5zdGFuY2UodGhpcywgJFByb21pc2UsIFBST01JU0UsICdfaCcpO1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgSW50ZXJuYWwuY2FsbCh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCB0aGlzLCAxKSwgY3R4KCRyZWplY3QsIHRoaXMsIDEpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIEludGVybmFsID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcbiAgICAgIHZhciByZWFjdGlvbiAgICA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgICAgID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsICAgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9hKXRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9zKW5vdGlmeSh0aGlzLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcmVhY3Rpb24ucHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3RlZCl7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbigpe1xuICAgIHZhciBwcm9taXNlICA9IG5ldyBJbnRlcm5hbDtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7UHJvbWlzZTogJFByb21pc2V9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlamVjdCAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICAvLyBpbnN0YW5jZW9mIGluc3RlYWQgb2YgaW50ZXJuYWwgc2xvdCBjaGVjayBiZWNhdXNlIHdlIHNob3VsZCBmaXggaXQgd2l0aG91dCByZXBsYWNlbWVudCBuYXRpdmUgUHJvbWlzZSBjb3JlXG4gICAgaWYoeCBpbnN0YW5jZW9mICRQcm9taXNlICYmIHNhbWVDb25zdHJ1Y3Rvcih4LmNvbnN0cnVjdG9yLCB0aGlzKSlyZXR1cm4geDtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVzb2x2ZSAgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgJCRyZXNvbHZlKHgpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVzb2x2ZSAgICA9IGNhcGFiaWxpdHkucmVzb2x2ZVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIHZhciB2YWx1ZXMgICAgPSBbXVxuICAgICAgICAsIGluZGV4ICAgICA9IDBcbiAgICAgICAgLCByZW1haW5pbmcgPSAxO1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgdmFyICRpbmRleCAgICAgICAgPSBpbmRleCsrXG4gICAgICAgICAgLCBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIHZhbHVlcy5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgIHJlbWFpbmluZysrO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgaWYoYWxyZWFkeUNhbGxlZClyZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCAgPSB0cnVlO1xuICAgICAgICAgIHZhbHVlc1skaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSB0aGlzXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGNhcGFiaWxpdHkucmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTsiLCIvLyAyNi4xLjEgUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdClcbnZhciAkZXhwb3J0ICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIGFuT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgckFwcGx5ICAgID0gKHJlcXVpcmUoJy4vX2dsb2JhbCcpLlJlZmxlY3QgfHwge30pLmFwcGx5XG4gICwgZkFwcGx5ICAgID0gRnVuY3Rpb24uYXBwbHk7XG4vLyBNUyBFZGdlIGFyZ3VtZW50c0xpc3QgYXJndW1lbnQgaXMgb3B0aW9uYWxcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgckFwcGx5KGZ1bmN0aW9uKCl7fSk7XG59KSwgJ1JlZmxlY3QnLCB7XG4gIGFwcGx5OiBmdW5jdGlvbiBhcHBseSh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdCl7XG4gICAgdmFyIFQgPSBhRnVuY3Rpb24odGFyZ2V0KVxuICAgICAgLCBMID0gYW5PYmplY3QoYXJndW1lbnRzTGlzdCk7XG4gICAgcmV0dXJuIHJBcHBseSA/IHJBcHBseShULCB0aGlzQXJndW1lbnQsIEwpIDogZkFwcGx5LmNhbGwoVCwgdGhpc0FyZ3VtZW50LCBMKTtcbiAgfVxufSk7IiwiLy8gMjYuMS4yIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJndW1lbnRzTGlzdCBbLCBuZXdUYXJnZXRdKVxudmFyICRleHBvcnQgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGNyZWF0ZSAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBhRnVuY3Rpb24gID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgYW5PYmplY3QgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgaXNPYmplY3QgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZmFpbHMgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCBiaW5kICAgICAgID0gcmVxdWlyZSgnLi9fYmluZCcpXG4gICwgckNvbnN0cnVjdCA9IChyZXF1aXJlKCcuL19nbG9iYWwnKS5SZWZsZWN0IHx8IHt9KS5jb25zdHJ1Y3Q7XG5cbi8vIE1TIEVkZ2Ugc3VwcG9ydHMgb25seSAyIGFyZ3VtZW50cyBhbmQgYXJndW1lbnRzTGlzdCBhcmd1bWVudCBpcyBvcHRpb25hbFxuLy8gRkYgTmlnaHRseSBzZXRzIHRoaXJkIGFyZ3VtZW50IGFzIGBuZXcudGFyZ2V0YCwgYnV0IGRvZXMgbm90IGNyZWF0ZSBgdGhpc2AgZnJvbSBpdFxudmFyIE5FV19UQVJHRVRfQlVHID0gZmFpbHMoZnVuY3Rpb24oKXtcbiAgZnVuY3Rpb24gRigpe31cbiAgcmV0dXJuICEockNvbnN0cnVjdChmdW5jdGlvbigpe30sIFtdLCBGKSBpbnN0YW5jZW9mIEYpO1xufSk7XG52YXIgQVJHU19CVUcgPSAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgckNvbnN0cnVjdChmdW5jdGlvbigpe30pO1xufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKE5FV19UQVJHRVRfQlVHIHx8IEFSR1NfQlVHKSwgJ1JlZmxlY3QnLCB7XG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gY29uc3RydWN0KFRhcmdldCwgYXJncyAvKiwgbmV3VGFyZ2V0Ki8pe1xuICAgIGFGdW5jdGlvbihUYXJnZXQpO1xuICAgIGFuT2JqZWN0KGFyZ3MpO1xuICAgIHZhciBuZXdUYXJnZXQgPSBhcmd1bWVudHMubGVuZ3RoIDwgMyA/IFRhcmdldCA6IGFGdW5jdGlvbihhcmd1bWVudHNbMl0pO1xuICAgIGlmKEFSR1NfQlVHICYmICFORVdfVEFSR0VUX0JVRylyZXR1cm4gckNvbnN0cnVjdChUYXJnZXQsIGFyZ3MsIG5ld1RhcmdldCk7XG4gICAgaWYoVGFyZ2V0ID09IG5ld1RhcmdldCl7XG4gICAgICAvLyB3L28gYWx0ZXJlZCBuZXdUYXJnZXQsIG9wdGltaXphdGlvbiBmb3IgMC00IGFyZ3VtZW50c1xuICAgICAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcbiAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IFRhcmdldDtcbiAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdKTtcbiAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgY2FzZSAzOiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgY2FzZSA0OiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgICAgIH1cbiAgICAgIC8vIHcvbyBhbHRlcmVkIG5ld1RhcmdldCwgbG90IG9mIGFyZ3VtZW50cyBjYXNlXG4gICAgICB2YXIgJGFyZ3MgPSBbbnVsbF07XG4gICAgICAkYXJncy5wdXNoLmFwcGx5KCRhcmdzLCBhcmdzKTtcbiAgICAgIHJldHVybiBuZXcgKGJpbmQuYXBwbHkoVGFyZ2V0LCAkYXJncykpO1xuICAgIH1cbiAgICAvLyB3aXRoIGFsdGVyZWQgbmV3VGFyZ2V0LCBub3Qgc3VwcG9ydCBidWlsdC1pbiBjb25zdHJ1Y3RvcnNcbiAgICB2YXIgcHJvdG8gICAgPSBuZXdUYXJnZXQucHJvdG90eXBlXG4gICAgICAsIGluc3RhbmNlID0gY3JlYXRlKGlzT2JqZWN0KHByb3RvKSA/IHByb3RvIDogT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgICwgcmVzdWx0ICAgPSBGdW5jdGlvbi5hcHBseS5jYWxsKFRhcmdldCwgaW5zdGFuY2UsIGFyZ3MpO1xuICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogaW5zdGFuY2U7XG4gIH1cbn0pOyIsIi8vIDI2LjEuMyBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpXG52YXIgZFAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsICRleHBvcnQgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcblxuLy8gTVMgRWRnZSBoYXMgYnJva2VuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkgLSB0aHJvd2luZyBpbnN0ZWFkIG9mIHJldHVybmluZyBmYWxzZVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoZFAuZih7fSwgMSwge3ZhbHVlOiAxfSksIDEsIHt2YWx1ZTogMn0pO1xufSksICdSZWZsZWN0Jywge1xuICBkZWZpbmVQcm9wZXJ0eTogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcyl7XG4gICAgYW5PYmplY3QodGFyZ2V0KTtcbiAgICBwcm9wZXJ0eUtleSA9IHRvUHJpbWl0aXZlKHByb3BlcnR5S2V5LCB0cnVlKTtcbiAgICBhbk9iamVjdChhdHRyaWJ1dGVzKTtcbiAgICB0cnkge1xuICAgICAgZFAuZih0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59KTsiLCIvLyAyNi4xLjQgUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5KVxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBnT1BEICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZlxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpe1xuICAgIHZhciBkZXNjID0gZ09QRChhbk9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XG4gICAgcmV0dXJuIGRlc2MgJiYgIWRlc2MuY29uZmlndXJhYmxlID8gZmFsc2UgOiBkZWxldGUgdGFyZ2V0W3Byb3BlcnR5S2V5XTtcbiAgfVxufSk7IiwiLy8gMjYuMS43IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpXG52YXIgZ09QRCAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSl7XG4gICAgcmV0dXJuIGdPUEQuZihhbk9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XG4gIH1cbn0pOyIsIi8vIDI2LjEuOCBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClcbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgZ2V0UHJvdG8gPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZih0YXJnZXQpe1xuICAgIHJldHVybiBnZXRQcm90byhhbk9iamVjdCh0YXJnZXQpKTtcbiAgfVxufSk7IiwiLy8gMjYuMS42IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkgWywgcmVjZWl2ZXJdKVxudmFyIGdPUEQgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKVxuICAsIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcblxuZnVuY3Rpb24gZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkvKiwgcmVjZWl2ZXIqLyl7XG4gIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdXG4gICAgLCBkZXNjLCBwcm90bztcbiAgaWYoYW5PYmplY3QodGFyZ2V0KSA9PT0gcmVjZWl2ZXIpcmV0dXJuIHRhcmdldFtwcm9wZXJ0eUtleV07XG4gIGlmKGRlc2MgPSBnT1BELmYodGFyZ2V0LCBwcm9wZXJ0eUtleSkpcmV0dXJuIGhhcyhkZXNjLCAndmFsdWUnKVxuICAgID8gZGVzYy52YWx1ZVxuICAgIDogZGVzYy5nZXQgIT09IHVuZGVmaW5lZFxuICAgICAgPyBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIGlmKGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSkpcmV0dXJuIGdldChwcm90bywgcHJvcGVydHlLZXksIHJlY2VpdmVyKTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge2dldDogZ2V0fSk7IiwiLy8gMjYuMS45IFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGhhczogZnVuY3Rpb24gaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpe1xuICAgIHJldHVybiBwcm9wZXJ0eUtleSBpbiB0YXJnZXQ7XG4gIH1cbn0pOyIsIi8vIDI2LjEuMTAgUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KVxudmFyICRleHBvcnQgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGFuT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsICRpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGlzRXh0ZW5zaWJsZTogZnVuY3Rpb24gaXNFeHRlbnNpYmxlKHRhcmdldCl7XG4gICAgYW5PYmplY3QodGFyZ2V0KTtcbiAgICByZXR1cm4gJGlzRXh0ZW5zaWJsZSA/ICRpc0V4dGVuc2libGUodGFyZ2V0KSA6IHRydWU7XG4gIH1cbn0pOyIsIi8vIDI2LjEuMTEgUmVmbGVjdC5vd25LZXlzKHRhcmdldClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtvd25LZXlzOiByZXF1aXJlKCcuL19vd24ta2V5cycpfSk7IiwiLy8gMjYuMS4xMiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldClcbnZhciAkZXhwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGFuT2JqZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgJHByZXZlbnRFeHRlbnNpb25zID0gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIHByZXZlbnRFeHRlbnNpb25zOiBmdW5jdGlvbiBwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpe1xuICAgIGFuT2JqZWN0KHRhcmdldCk7XG4gICAgdHJ5IHtcbiAgICAgIGlmKCRwcmV2ZW50RXh0ZW5zaW9ucykkcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59KTsiLCIvLyAyNi4xLjE0IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bylcbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgc2V0UHJvdG8gPSByZXF1aXJlKCcuL19zZXQtcHJvdG8nKTtcblxuaWYoc2V0UHJvdG8pJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBzZXRQcm90b3R5cGVPZjogZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90byl7XG4gICAgc2V0UHJvdG8uY2hlY2sodGFyZ2V0LCBwcm90byk7XG4gICAgdHJ5IHtcbiAgICAgIHNldFByb3RvLnNldCh0YXJnZXQsIHByb3RvKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59KTsiLCIvLyAyNi4xLjEzIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYgWywgcmVjZWl2ZXJdKVxudmFyIGRQICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBnT1BEICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgY3JlYXRlRGVzYyAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgaXNPYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcblxuZnVuY3Rpb24gc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYvKiwgcmVjZWl2ZXIqLyl7XG4gIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCA0ID8gdGFyZ2V0IDogYXJndW1lbnRzWzNdXG4gICAgLCBvd25EZXNjICA9IGdPUEQuZihhbk9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSlcbiAgICAsIGV4aXN0aW5nRGVzY3JpcHRvciwgcHJvdG87XG4gIGlmKCFvd25EZXNjKXtcbiAgICBpZihpc09iamVjdChwcm90byA9IGdldFByb3RvdHlwZU9mKHRhcmdldCkpKXtcbiAgICAgIHJldHVybiBzZXQocHJvdG8sIHByb3BlcnR5S2V5LCBWLCByZWNlaXZlcik7XG4gICAgfVxuICAgIG93bkRlc2MgPSBjcmVhdGVEZXNjKDApO1xuICB9XG4gIGlmKGhhcyhvd25EZXNjLCAndmFsdWUnKSl7XG4gICAgaWYob3duRGVzYy53cml0YWJsZSA9PT0gZmFsc2UgfHwgIWlzT2JqZWN0KHJlY2VpdmVyKSlyZXR1cm4gZmFsc2U7XG4gICAgZXhpc3RpbmdEZXNjcmlwdG9yID0gZ09QRC5mKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSkgfHwgY3JlYXRlRGVzYygwKTtcbiAgICBleGlzdGluZ0Rlc2NyaXB0b3IudmFsdWUgPSBWO1xuICAgIGRQLmYocmVjZWl2ZXIsIHByb3BlcnR5S2V5LCBleGlzdGluZ0Rlc2NyaXB0b3IpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBvd25EZXNjLnNldCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiAob3duRGVzYy5zZXQuY2FsbChyZWNlaXZlciwgViksIHRydWUpO1xufVxuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7c2V0OiBzZXR9KTsiLCIvLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFncygpXG5pZihyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmIC8uL2cuZmxhZ3MgIT0gJ2cnKXJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmYoUmVnRXhwLnByb3RvdHlwZSwgJ2ZsYWdzJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogcmVxdWlyZSgnLi9fZmxhZ3MnKVxufSk7IiwiLy8gQEBtYXRjaCBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdtYXRjaCcsIDEsIGZ1bmN0aW9uKGRlZmluZWQsIE1BVENILCAkbWF0Y2gpe1xuICAvLyAyMS4xLjMuMTEgU3RyaW5nLnByb3RvdHlwZS5tYXRjaChyZWdleHApXG4gIHJldHVybiBbZnVuY3Rpb24gbWF0Y2gocmVnZXhwKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIE8gID0gZGVmaW5lZCh0aGlzKVxuICAgICAgLCBmbiA9IHJlZ2V4cCA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiByZWdleHBbTUFUQ0hdO1xuICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkID8gZm4uY2FsbChyZWdleHAsIE8pIDogbmV3IFJlZ0V4cChyZWdleHApW01BVENIXShTdHJpbmcoTykpO1xuICB9LCAkbWF0Y2hdO1xufSk7IiwiLy8gQEByZXBsYWNlIGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ3JlcGxhY2UnLCAyLCBmdW5jdGlvbihkZWZpbmVkLCBSRVBMQUNFLCAkcmVwbGFjZSl7XG4gIC8vIDIxLjEuMy4xNCBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSlcbiAgcmV0dXJuIFtmdW5jdGlvbiByZXBsYWNlKHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyAgPSBkZWZpbmVkKHRoaXMpXG4gICAgICAsIGZuID0gc2VhcmNoVmFsdWUgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc2VhcmNoVmFsdWVbUkVQTEFDRV07XG4gICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWRcbiAgICAgID8gZm4uY2FsbChzZWFyY2hWYWx1ZSwgTywgcmVwbGFjZVZhbHVlKVxuICAgICAgOiAkcmVwbGFjZS5jYWxsKFN0cmluZyhPKSwgc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSk7XG4gIH0sICRyZXBsYWNlXTtcbn0pOyIsIi8vIEBAc2VhcmNoIGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ3NlYXJjaCcsIDEsIGZ1bmN0aW9uKGRlZmluZWQsIFNFQVJDSCwgJHNlYXJjaCl7XG4gIC8vIDIxLjEuMy4xNSBTdHJpbmcucHJvdG90eXBlLnNlYXJjaChyZWdleHApXG4gIHJldHVybiBbZnVuY3Rpb24gc2VhcmNoKHJlZ2V4cCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPICA9IGRlZmluZWQodGhpcylcbiAgICAgICwgZm4gPSByZWdleHAgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcmVnZXhwW1NFQVJDSF07XG4gICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWQgPyBmbi5jYWxsKHJlZ2V4cCwgTykgOiBuZXcgUmVnRXhwKHJlZ2V4cClbU0VBUkNIXShTdHJpbmcoTykpO1xuICB9LCAkc2VhcmNoXTtcbn0pOyIsIi8vIEBAc3BsaXQgbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgnc3BsaXQnLCAyLCBmdW5jdGlvbihkZWZpbmVkLCBTUExJVCwgJHNwbGl0KXtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgaXNSZWdFeHAgICA9IHJlcXVpcmUoJy4vX2lzLXJlZ2V4cCcpXG4gICAgLCBfc3BsaXQgICAgID0gJHNwbGl0XG4gICAgLCAkcHVzaCAgICAgID0gW10ucHVzaFxuICAgICwgJFNQTElUICAgICA9ICdzcGxpdCdcbiAgICAsIExFTkdUSCAgICAgPSAnbGVuZ3RoJ1xuICAgICwgTEFTVF9JTkRFWCA9ICdsYXN0SW5kZXgnO1xuICBpZihcbiAgICAnYWJiYydbJFNQTElUXSgvKGIpKi8pWzFdID09ICdjJyB8fFxuICAgICd0ZXN0J1skU1BMSVRdKC8oPzopLywgLTEpW0xFTkdUSF0gIT0gNCB8fFxuICAgICdhYidbJFNQTElUXSgvKD86YWIpKi8pW0xFTkdUSF0gIT0gMiB8fFxuICAgICcuJ1skU1BMSVRdKC8oLj8pKC4/KS8pW0xFTkdUSF0gIT0gNCB8fFxuICAgICcuJ1skU1BMSVRdKC8oKSgpLylbTEVOR1RIXSA+IDEgfHxcbiAgICAnJ1skU1BMSVRdKC8uPy8pW0xFTkdUSF1cbiAgKXtcbiAgICB2YXIgTlBDRyA9IC8oKT8/Ly5leGVjKCcnKVsxXSA9PT0gdW5kZWZpbmVkOyAvLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cFxuICAgIC8vIGJhc2VkIG9uIGVzNS1zaGltIGltcGxlbWVudGF0aW9uLCBuZWVkIHRvIHJld29yayBpdFxuICAgICRzcGxpdCA9IGZ1bmN0aW9uKHNlcGFyYXRvciwgbGltaXQpe1xuICAgICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICAgIGlmKHNlcGFyYXRvciA9PT0gdW5kZWZpbmVkICYmIGxpbWl0ID09PSAwKXJldHVybiBbXTtcbiAgICAgIC8vIElmIGBzZXBhcmF0b3JgIGlzIG5vdCBhIHJlZ2V4LCB1c2UgbmF0aXZlIHNwbGl0XG4gICAgICBpZighaXNSZWdFeHAoc2VwYXJhdG9yKSlyZXR1cm4gX3NwbGl0LmNhbGwoc3RyaW5nLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgIHZhciBmbGFncyA9IChzZXBhcmF0b3IuaWdub3JlQ2FzZSA/ICdpJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLm11bHRpbGluZSA/ICdtJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLnVuaWNvZGUgPyAndScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5zdGlja3kgPyAneScgOiAnJyk7XG4gICAgICB2YXIgbGFzdExhc3RJbmRleCA9IDA7XG4gICAgICB2YXIgc3BsaXRMaW1pdCA9IGxpbWl0ID09PSB1bmRlZmluZWQgPyA0Mjk0OTY3Mjk1IDogbGltaXQgPj4+IDA7XG4gICAgICAvLyBNYWtlIGBnbG9iYWxgIGFuZCBhdm9pZCBgbGFzdEluZGV4YCBpc3N1ZXMgYnkgd29ya2luZyB3aXRoIGEgY29weVxuICAgICAgdmFyIHNlcGFyYXRvckNvcHkgPSBuZXcgUmVnRXhwKHNlcGFyYXRvci5zb3VyY2UsIGZsYWdzICsgJ2cnKTtcbiAgICAgIHZhciBzZXBhcmF0b3IyLCBtYXRjaCwgbGFzdEluZGV4LCBsYXN0TGVuZ3RoLCBpO1xuICAgICAgLy8gRG9lc24ndCBuZWVkIGZsYWdzIGd5LCBidXQgdGhleSBkb24ndCBodXJ0XG4gICAgICBpZighTlBDRylzZXBhcmF0b3IyID0gbmV3IFJlZ0V4cCgnXicgKyBzZXBhcmF0b3JDb3B5LnNvdXJjZSArICckKD8hXFxcXHMpJywgZmxhZ3MpO1xuICAgICAgd2hpbGUobWF0Y2ggPSBzZXBhcmF0b3JDb3B5LmV4ZWMoc3RyaW5nKSl7XG4gICAgICAgIC8vIGBzZXBhcmF0b3JDb3B5Lmxhc3RJbmRleGAgaXMgbm90IHJlbGlhYmxlIGNyb3NzLWJyb3dzZXJcbiAgICAgICAgbGFzdEluZGV4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXVtMRU5HVEhdO1xuICAgICAgICBpZihsYXN0SW5kZXggPiBsYXN0TGFzdEluZGV4KXtcbiAgICAgICAgICBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCwgbWF0Y2guaW5kZXgpKTtcbiAgICAgICAgICAvLyBGaXggYnJvd3NlcnMgd2hvc2UgYGV4ZWNgIG1ldGhvZHMgZG9uJ3QgY29uc2lzdGVudGx5IHJldHVybiBgdW5kZWZpbmVkYCBmb3IgTlBDR1xuICAgICAgICAgIGlmKCFOUENHICYmIG1hdGNoW0xFTkdUSF0gPiAxKW1hdGNoWzBdLnJlcGxhY2Uoc2VwYXJhdG9yMiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGZvcihpID0gMTsgaSA8IGFyZ3VtZW50c1tMRU5HVEhdIC0gMjsgaSsrKWlmKGFyZ3VtZW50c1tpXSA9PT0gdW5kZWZpbmVkKW1hdGNoW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmKG1hdGNoW0xFTkdUSF0gPiAxICYmIG1hdGNoLmluZGV4IDwgc3RyaW5nW0xFTkdUSF0pJHB1c2guYXBwbHkob3V0cHV0LCBtYXRjaC5zbGljZSgxKSk7XG4gICAgICAgICAgbGFzdExlbmd0aCA9IG1hdGNoWzBdW0xFTkdUSF07XG4gICAgICAgICAgbGFzdExhc3RJbmRleCA9IGxhc3RJbmRleDtcbiAgICAgICAgICBpZihvdXRwdXRbTEVOR1RIXSA+PSBzcGxpdExpbWl0KWJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmKHNlcGFyYXRvckNvcHlbTEFTVF9JTkRFWF0gPT09IG1hdGNoLmluZGV4KXNlcGFyYXRvckNvcHlbTEFTVF9JTkRFWF0rKzsgLy8gQXZvaWQgYW4gaW5maW5pdGUgbG9vcFxuICAgICAgfVxuICAgICAgaWYobGFzdExhc3RJbmRleCA9PT0gc3RyaW5nW0xFTkdUSF0pe1xuICAgICAgICBpZihsYXN0TGVuZ3RoIHx8ICFzZXBhcmF0b3JDb3B5LnRlc3QoJycpKW91dHB1dC5wdXNoKCcnKTtcbiAgICAgIH0gZWxzZSBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCkpO1xuICAgICAgcmV0dXJuIG91dHB1dFtMRU5HVEhdID4gc3BsaXRMaW1pdCA/IG91dHB1dC5zbGljZSgwLCBzcGxpdExpbWl0KSA6IG91dHB1dDtcbiAgICB9O1xuICAvLyBDaGFrcmEsIFY4XG4gIH0gZWxzZSBpZignMCdbJFNQTElUXSh1bmRlZmluZWQsIDApW0xFTkdUSF0pe1xuICAgICRzcGxpdCA9IGZ1bmN0aW9uKHNlcGFyYXRvciwgbGltaXQpe1xuICAgICAgcmV0dXJuIHNlcGFyYXRvciA9PT0gdW5kZWZpbmVkICYmIGxpbWl0ID09PSAwID8gW10gOiBfc3BsaXQuY2FsbCh0aGlzLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICB9O1xuICB9XG4gIC8vIDIxLjEuMy4xNyBTdHJpbmcucHJvdG90eXBlLnNwbGl0KHNlcGFyYXRvciwgbGltaXQpXG4gIHJldHVybiBbZnVuY3Rpb24gc3BsaXQoc2VwYXJhdG9yLCBsaW1pdCl7XG4gICAgdmFyIE8gID0gZGVmaW5lZCh0aGlzKVxuICAgICAgLCBmbiA9IHNlcGFyYXRvciA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZXBhcmF0b3JbU1BMSVRdO1xuICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkID8gZm4uY2FsbChzZXBhcmF0b3IsIE8sIGxpbWl0KSA6ICRzcGxpdC5jYWxsKFN0cmluZyhPKSwgc2VwYXJhdG9yLCBsaW1pdCk7XG4gIH0sICRzcGxpdF07XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ1NldCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkYXQgICAgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykoZmFsc2UpO1xuJGV4cG9ydCgkZXhwb3J0LlAsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy4zIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQocG9zKVxuICBjb2RlUG9pbnRBdDogZnVuY3Rpb24gY29kZVBvaW50QXQocG9zKXtcbiAgICByZXR1cm4gJGF0KHRoaXMsIHBvcyk7XG4gIH1cbn0pOyIsIi8vIDIxLjEuMy42IFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgoc2VhcmNoU3RyaW5nIFssIGVuZFBvc2l0aW9uXSlcbid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgY29udGV4dCAgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWNvbnRleHQnKVxuICAsIEVORFNfV0lUSCA9ICdlbmRzV2l0aCdcbiAgLCAkZW5kc1dpdGggPSAnJ1tFTkRTX1dJVEhdO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzLWlzLXJlZ2V4cCcpKEVORFNfV0lUSCksICdTdHJpbmcnLCB7XG4gIGVuZHNXaXRoOiBmdW5jdGlvbiBlbmRzV2l0aChzZWFyY2hTdHJpbmcgLyosIGVuZFBvc2l0aW9uID0gQGxlbmd0aCAqLyl7XG4gICAgdmFyIHRoYXQgPSBjb250ZXh0KHRoaXMsIHNlYXJjaFN0cmluZywgRU5EU19XSVRIKVxuICAgICAgLCBlbmRQb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkXG4gICAgICAsIGxlbiAgICA9IHRvTGVuZ3RoKHRoYXQubGVuZ3RoKVxuICAgICAgLCBlbmQgICAgPSBlbmRQb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gbGVuIDogTWF0aC5taW4odG9MZW5ndGgoZW5kUG9zaXRpb24pLCBsZW4pXG4gICAgICAsIHNlYXJjaCA9IFN0cmluZyhzZWFyY2hTdHJpbmcpO1xuICAgIHJldHVybiAkZW5kc1dpdGhcbiAgICAgID8gJGVuZHNXaXRoLmNhbGwodGhhdCwgc2VhcmNoLCBlbmQpXG4gICAgICA6IHRoYXQuc2xpY2UoZW5kIC0gc2VhcmNoLmxlbmd0aCwgZW5kKSA9PT0gc2VhcmNoO1xuICB9XG59KTsiLCJ2YXIgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHRvSW5kZXggICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKVxuICAsIGZyb21DaGFyQ29kZSAgID0gU3RyaW5nLmZyb21DaGFyQ29kZVxuICAsICRmcm9tQ29kZVBvaW50ID0gU3RyaW5nLmZyb21Db2RlUG9pbnQ7XG5cbi8vIGxlbmd0aCBzaG91bGQgYmUgMSwgb2xkIEZGIHByb2JsZW1cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCEhJGZyb21Db2RlUG9pbnQgJiYgJGZyb21Db2RlUG9pbnQubGVuZ3RoICE9IDEpLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjIuMiBTdHJpbmcuZnJvbUNvZGVQb2ludCguLi5jb2RlUG9pbnRzKVxuICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KHgpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHJlcyAgPSBbXVxuICAgICAgLCBhTGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBpICAgID0gMFxuICAgICAgLCBjb2RlO1xuICAgIHdoaWxlKGFMZW4gPiBpKXtcbiAgICAgIGNvZGUgPSArYXJndW1lbnRzW2krK107XG4gICAgICBpZih0b0luZGV4KGNvZGUsIDB4MTBmZmZmKSAhPT0gY29kZSl0aHJvdyBSYW5nZUVycm9yKGNvZGUgKyAnIGlzIG5vdCBhIHZhbGlkIGNvZGUgcG9pbnQnKTtcbiAgICAgIHJlcy5wdXNoKGNvZGUgPCAweDEwMDAwXG4gICAgICAgID8gZnJvbUNoYXJDb2RlKGNvZGUpXG4gICAgICAgIDogZnJvbUNoYXJDb2RlKCgoY29kZSAtPSAweDEwMDAwKSA+PiAxMCkgKyAweGQ4MDAsIGNvZGUgJSAweDQwMCArIDB4ZGMwMClcbiAgICAgICk7XG4gICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xuICB9XG59KTsiLCIvLyAyMS4xLjMuNyBTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKHNlYXJjaFN0cmluZywgcG9zaXRpb24gPSAwKVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBjb250ZXh0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1jb250ZXh0JylcbiAgLCBJTkNMVURFUyA9ICdpbmNsdWRlcyc7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMtaXMtcmVnZXhwJykoSU5DTFVERVMpLCAnU3RyaW5nJywge1xuICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXMoc2VhcmNoU3RyaW5nIC8qLCBwb3NpdGlvbiA9IDAgKi8pe1xuICAgIHJldHVybiAhIX5jb250ZXh0KHRoaXMsIHNlYXJjaFN0cmluZywgSU5DTFVERVMpXG4gICAgICAuaW5kZXhPZihzZWFyY2hTdHJpbmcsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7IiwidmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9MZW5ndGggID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjIuNCBTdHJpbmcucmF3KGNhbGxTaXRlLCAuLi5zdWJzdGl0dXRpb25zKVxuICByYXc6IGZ1bmN0aW9uIHJhdyhjYWxsU2l0ZSl7XG4gICAgdmFyIHRwbCAgPSB0b0lPYmplY3QoY2FsbFNpdGUucmF3KVxuICAgICAgLCBsZW4gID0gdG9MZW5ndGgodHBsLmxlbmd0aClcbiAgICAgICwgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgcmVzICA9IFtdXG4gICAgICAsIGkgICAgPSAwO1xuICAgIHdoaWxlKGxlbiA+IGkpe1xuICAgICAgcmVzLnB1c2goU3RyaW5nKHRwbFtpKytdKSk7XG4gICAgICBpZihpIDwgYUxlbilyZXMucHVzaChTdHJpbmcoYXJndW1lbnRzW2ldKSk7XG4gICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xuICB9XG59KTsiLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjEzIFN0cmluZy5wcm90b3R5cGUucmVwZWF0KGNvdW50KVxuICByZXBlYXQ6IHJlcXVpcmUoJy4vX3N0cmluZy1yZXBlYXQnKVxufSk7IiwiLy8gMjEuMS4zLjE4IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgWywgcG9zaXRpb24gXSlcbid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGNvbnRleHQgICAgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWNvbnRleHQnKVxuICAsIFNUQVJUU19XSVRIID0gJ3N0YXJ0c1dpdGgnXG4gICwgJHN0YXJ0c1dpdGggPSAnJ1tTVEFSVFNfV0lUSF07XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMtaXMtcmVnZXhwJykoU1RBUlRTX1dJVEgpLCAnU3RyaW5nJywge1xuICBzdGFydHNXaXRoOiBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcbiAgICB2YXIgdGhhdCAgID0gY29udGV4dCh0aGlzLCBzZWFyY2hTdHJpbmcsIFNUQVJUU19XSVRIKVxuICAgICAgLCBpbmRleCAgPSB0b0xlbmd0aChNYXRoLm1pbihhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgdGhhdC5sZW5ndGgpKVxuICAgICAgLCBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoU3RyaW5nKTtcbiAgICByZXR1cm4gJHN0YXJ0c1dpdGhcbiAgICAgID8gJHN0YXJ0c1dpdGguY2FsbCh0aGF0LCBzZWFyY2gsIGluZGV4KVxuICAgICAgOiB0aGF0LnNsaWNlKGluZGV4LCBpbmRleCArIHNlYXJjaC5sZW5ndGgpID09PSBzZWFyY2g7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBNRVRBICAgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKS5LRVlcbiAgLCAkZmFpbHMgICAgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCBzaGFyZWQgICAgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgdWlkICAgICAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIHdrcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJylcbiAgLCB3a3NFeHQgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcy1leHQnKVxuICAsIHdrc0RlZmluZSAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWRlZmluZScpXG4gICwga2V5T2YgICAgICAgICAgPSByZXF1aXJlKCcuL19rZXlvZicpXG4gICwgZW51bUtleXMgICAgICAgPSByZXF1aXJlKCcuL19lbnVtLWtleXMnKVxuICAsIGlzQXJyYXkgICAgICAgID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKVxuICAsIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0lPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvUHJpbWl0aXZlICAgID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIF9jcmVhdGUgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZ09QTkV4dCAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbi1leHQnKVxuICAsICRHT1BEICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKVxuICAsICREUCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCAka2V5cyAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BEICAgICAgICAgICA9ICRHT1BELmZcbiAgLCBkUCAgICAgICAgICAgICA9ICREUC5mXG4gICwgZ09QTiAgICAgICAgICAgPSBnT1BORXh0LmZcbiAgLCAkU3ltYm9sICAgICAgICA9IGdsb2JhbC5TeW1ib2xcbiAgLCAkSlNPTiAgICAgICAgICA9IGdsb2JhbC5KU09OXG4gICwgX3N0cmluZ2lmeSAgICAgPSAkSlNPTiAmJiAkSlNPTi5zdHJpbmdpZnlcbiAgLCBQUk9UT1RZUEUgICAgICA9ICdwcm90b3R5cGUnXG4gICwgSElEREVOICAgICAgICAgPSB3a3MoJ19oaWRkZW4nKVxuICAsIFRPX1BSSU1JVElWRSAgID0gd2tzKCd0b1ByaW1pdGl2ZScpXG4gICwgaXNFbnVtICAgICAgICAgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZVxuICAsIFN5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtcmVnaXN0cnknKVxuICAsIEFsbFN5bWJvbHMgICAgID0gc2hhcmVkKCdzeW1ib2xzJylcbiAgLCBPUFN5bWJvbHMgICAgICA9IHNoYXJlZCgnb3Atc3ltYm9scycpXG4gICwgT2JqZWN0UHJvdG8gICAgPSBPYmplY3RbUFJPVE9UWVBFXVxuICAsIFVTRV9OQVRJVkUgICAgID0gdHlwZW9mICRTeW1ib2wgPT0gJ2Z1bmN0aW9uJ1xuICAsIFFPYmplY3QgICAgICAgID0gZ2xvYmFsLlFPYmplY3Q7XG4vLyBEb24ndCB1c2Ugc2V0dGVycyBpbiBRdCBTY3JpcHQsIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xNzNcbnZhciBzZXR0ZXIgPSAhUU9iamVjdCB8fCAhUU9iamVjdFtQUk9UT1RZUEVdIHx8ICFRT2JqZWN0W1BST1RPVFlQRV0uZmluZENoaWxkO1xuXG4vLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWQsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD02ODdcbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQ1JJUFRPUlMgJiYgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBfY3JlYXRlKGRQKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBkUCh0aGlzLCAnYScsIHt2YWx1ZTogN30pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24oaXQsIGtleSwgRCl7XG4gIHZhciBwcm90b0Rlc2MgPSBnT1BEKE9iamVjdFByb3RvLCBrZXkpO1xuICBpZihwcm90b0Rlc2MpZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIGRQKGl0LCBrZXksIEQpO1xuICBpZihwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKWRQKE9iamVjdFByb3RvLCBrZXksIHByb3RvRGVzYyk7XG59IDogZFA7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24odGFnKXtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9IF9jcmVhdGUoJFN5bWJvbFtQUk9UT1RZUEVdKTtcbiAgc3ltLl9rID0gdGFnO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gVVNFX05BVElWRSAmJiB0eXBlb2YgJFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJyA/IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCBpbnN0YW5jZW9mICRTeW1ib2w7XG59O1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCl7XG4gIGlmKGl0ID09PSBPYmplY3RQcm90bykkZGVmaW5lUHJvcGVydHkoT1BTeW1ib2xzLCBrZXksIEQpO1xuICBhbk9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEQpO1xuICBpZihoYXMoQWxsU3ltYm9scywga2V5KSl7XG4gICAgaWYoIUQuZW51bWVyYWJsZSl7XG4gICAgICBpZighaGFzKGl0LCBISURERU4pKWRQKGl0LCBISURERU4sIGNyZWF0ZURlc2MoMSwge30pKTtcbiAgICAgIGl0W0hJRERFTl1ba2V5XSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0paXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gX2NyZWF0ZShELCB7ZW51bWVyYWJsZTogY3JlYXRlRGVzYygwLCBmYWxzZSl9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBkUChpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKXtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpXG4gICAgLCBpICAgID0gMFxuICAgICwgbCA9IGtleXMubGVuZ3RoXG4gICAgLCBrZXk7XG4gIHdoaWxlKGwgPiBpKSRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKSk7XG4gIGlmKHRoaXMgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKXJldHVybiBmYWxzZTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XSA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICBpdCAgPSB0b0lPYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBpZihpdCA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpcmV0dXJuO1xuICB2YXIgRCA9IGdPUEQoaXQsIGtleSk7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSlELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdPUE4odG9JT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpe1xuICAgIGlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTiAmJiBrZXkgIT0gTUVUQSlyZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpe1xuICB2YXIgSVNfT1AgID0gaXQgPT09IE9iamVjdFByb3RvXG4gICAgLCBuYW1lcyAgPSBnT1BOKElTX09QID8gT1BTeW1ib2xzIDogdG9JT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpe1xuICAgIGlmKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiAoSVNfT1AgPyBoYXMoT2JqZWN0UHJvdG8sIGtleSkgOiB0cnVlKSlyZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmKCFVU0VfTkFUSVZFKXtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpe1xuICAgIGlmKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKXRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yIScpO1xuICAgIHZhciB0YWcgPSB1aWQoYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpO1xuICAgIHZhciAkc2V0ID0gZnVuY3Rpb24odmFsdWUpe1xuICAgICAgaWYodGhpcyA9PT0gT2JqZWN0UHJvdG8pJHNldC5jYWxsKE9QU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSl0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9O1xuICAgIGlmKERFU0NSSVBUT1JTICYmIHNldHRlcilzZXRTeW1ib2xEZXNjKE9iamVjdFByb3RvLCB0YWcsIHtjb25maWd1cmFibGU6IHRydWUsIHNldDogJHNldH0pO1xuICAgIHJldHVybiB3cmFwKHRhZyk7XG4gIH07XG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFXSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgJEdPUEQuZiA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICREUC5mICAgPSAkZGVmaW5lUHJvcGVydHk7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZiA9IGdPUE5FeHQuZiA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICByZXF1aXJlKCcuL19vYmplY3QtcGllJykuZiAgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJykuZiA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vX2xpYnJhcnknKSl7XG4gICAgcmVkZWZpbmUoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cblxuICB3a3NFeHQuZiA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHJldHVybiB3cmFwKHdrcyhuYW1lKSk7XG4gIH1cbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwge1N5bWJvbDogJFN5bWJvbH0pO1xuXG5mb3IodmFyIHN5bWJvbHMgPSAoXG4gIC8vIDE5LjQuMi4yLCAxOS40LjIuMywgMTkuNC4yLjQsIDE5LjQuMi42LCAxOS40LjIuOCwgMTkuNC4yLjksIDE5LjQuMi4xMCwgMTkuNC4yLjExLCAxOS40LjIuMTIsIDE5LjQuMi4xMywgMTkuNC4yLjE0XG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbikuc3BsaXQoJywnKSwgaSA9IDA7IHN5bWJvbHMubGVuZ3RoID4gaTsgKXdrcyhzeW1ib2xzW2krK10pO1xuXG5mb3IodmFyIHN5bWJvbHMgPSAka2V5cyh3a3Muc3RvcmUpLCBpID0gMDsgc3ltYm9scy5sZW5ndGggPiBpOyApd2tzRGVmaW5lKHN5bWJvbHNbaSsrXSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdTeW1ib2wnLCB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKGtleSl7XG4gICAgaWYoaXNTeW1ib2woa2V5KSlyZXR1cm4ga2V5T2YoU3ltYm9sUmVnaXN0cnksIGtleSk7XG4gICAgdGhyb3cgVHlwZUVycm9yKGtleSArICcgaXMgbm90IGEgc3ltYm9sIScpO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMjQuMy4yIEpTT04uc3RyaW5naWZ5KHZhbHVlIFssIHJlcGxhY2VyIFssIHNwYWNlXV0pXG4kSlNPTiAmJiAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghVVNFX05BVElWRSB8fCAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoe2E6IFN9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSkpLCAnSlNPTicsIHtcbiAgc3RyaW5naWZ5OiBmdW5jdGlvbiBzdHJpbmdpZnkoaXQpe1xuICAgIGlmKGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKXJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICAgIHZhciBhcmdzID0gW2l0XVxuICAgICAgLCBpICAgID0gMVxuICAgICAgLCByZXBsYWNlciwgJHJlcGxhY2VyO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcmVwbGFjZXIgPSBhcmdzWzFdO1xuICAgIGlmKHR5cGVvZiByZXBsYWNlciA9PSAnZnVuY3Rpb24nKSRyZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgIGlmKCRyZXBsYWNlciB8fCAhaXNBcnJheShyZXBsYWNlcikpcmVwbGFjZXIgPSBmdW5jdGlvbihrZXksIHZhbHVlKXtcbiAgICAgIGlmKCRyZXBsYWNlcil2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgaWYoIWlzU3ltYm9sKHZhbHVlKSlyZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gICAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xuICB9XG59KTtcblxuLy8gMTkuNC4zLjQgU3ltYm9sLnByb3RvdHlwZVtAQHRvUHJpbWl0aXZlXShoaW50KVxuJFN5bWJvbFtQUk9UT1RZUEVdW1RPX1BSSU1JVElWRV0gfHwgcmVxdWlyZSgnLi9faGlkZScpKCRTeW1ib2xbUFJPVE9UWVBFXSwgVE9fUFJJTUlUSVZFLCAkU3ltYm9sW1BST1RPVFlQRV0udmFsdWVPZik7XG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICR0eXBlZCAgICAgICA9IHJlcXVpcmUoJy4vX3R5cGVkJylcbiAgLCBidWZmZXIgICAgICAgPSByZXF1aXJlKCcuL190eXBlZC1idWZmZXInKVxuICAsIGFuT2JqZWN0ICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9JbmRleCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKVxuICAsIHRvTGVuZ3RoICAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgaXNPYmplY3QgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBBcnJheUJ1ZmZlciAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5BcnJheUJ1ZmZlclxuICAsIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKVxuICAsICRBcnJheUJ1ZmZlciA9IGJ1ZmZlci5BcnJheUJ1ZmZlclxuICAsICREYXRhVmlldyAgICA9IGJ1ZmZlci5EYXRhVmlld1xuICAsICRpc1ZpZXcgICAgICA9ICR0eXBlZC5BQlYgJiYgQXJyYXlCdWZmZXIuaXNWaWV3XG4gICwgJHNsaWNlICAgICAgID0gJEFycmF5QnVmZmVyLnByb3RvdHlwZS5zbGljZVxuICAsIFZJRVcgICAgICAgICA9ICR0eXBlZC5WSUVXXG4gICwgQVJSQVlfQlVGRkVSID0gJ0FycmF5QnVmZmVyJztcblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAoQXJyYXlCdWZmZXIgIT09ICRBcnJheUJ1ZmZlciksIHtBcnJheUJ1ZmZlcjogJEFycmF5QnVmZmVyfSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogISR0eXBlZC5DT05TVFIsIEFSUkFZX0JVRkZFUiwge1xuICAvLyAyNC4xLjMuMSBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJnKVxuICBpc1ZpZXc6IGZ1bmN0aW9uIGlzVmlldyhpdCl7XG4gICAgcmV0dXJuICRpc1ZpZXcgJiYgJGlzVmlldyhpdCkgfHwgaXNPYmplY3QoaXQpICYmIFZJRVcgaW4gaXQ7XG4gIH1cbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuVSArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuICFuZXcgJEFycmF5QnVmZmVyKDIpLnNsaWNlKDEsIHVuZGVmaW5lZCkuYnl0ZUxlbmd0aDtcbn0pLCBBUlJBWV9CVUZGRVIsIHtcbiAgLy8gMjQuMS40LjMgQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHNsaWNlOiBmdW5jdGlvbiBzbGljZShzdGFydCwgZW5kKXtcbiAgICBpZigkc2xpY2UgIT09IHVuZGVmaW5lZCAmJiBlbmQgPT09IHVuZGVmaW5lZClyZXR1cm4gJHNsaWNlLmNhbGwoYW5PYmplY3QodGhpcyksIHN0YXJ0KTsgLy8gRkYgZml4XG4gICAgdmFyIGxlbiAgICA9IGFuT2JqZWN0KHRoaXMpLmJ5dGVMZW5ndGhcbiAgICAgICwgZmlyc3QgID0gdG9JbmRleChzdGFydCwgbGVuKVxuICAgICAgLCBmaW5hbCAgPSB0b0luZGV4KGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogZW5kLCBsZW4pXG4gICAgICAsIHJlc3VsdCA9IG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsICRBcnJheUJ1ZmZlcikpKHRvTGVuZ3RoKGZpbmFsIC0gZmlyc3QpKVxuICAgICAgLCB2aWV3UyAgPSBuZXcgJERhdGFWaWV3KHRoaXMpXG4gICAgICAsIHZpZXdUICA9IG5ldyAkRGF0YVZpZXcocmVzdWx0KVxuICAgICAgLCBpbmRleCAgPSAwO1xuICAgIHdoaWxlKGZpcnN0IDwgZmluYWwpe1xuICAgICAgdmlld1Quc2V0VWludDgoaW5kZXgrKywgdmlld1MuZ2V0VWludDgoZmlyc3QrKykpO1xuICAgIH0gcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG5cbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoQVJSQVlfQlVGRkVSKTsiLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdGbG9hdDMyJywgNCwgZnVuY3Rpb24oaW5pdCl7XG4gIHJldHVybiBmdW5jdGlvbiBGbG9hdDMyQXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKXtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7IiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnRmxvYXQ2NCcsIDgsIGZ1bmN0aW9uKGluaXQpe1xuICByZXR1cm4gZnVuY3Rpb24gRmxvYXQ2NEFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCl7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pOyIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ0ludDE2JywgMiwgZnVuY3Rpb24oaW5pdCl7XG4gIHJldHVybiBmdW5jdGlvbiBJbnQxNkFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCl7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pOyIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ0ludDMyJywgNCwgZnVuY3Rpb24oaW5pdCl7XG4gIHJldHVybiBmdW5jdGlvbiBJbnQzMkFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCl7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pOyIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ0ludDgnLCAxLCBmdW5jdGlvbihpbml0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIEludDhBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpe1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdVaW50MTYnLCAyLCBmdW5jdGlvbihpbml0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFVpbnQxNkFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCl7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pOyIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ1VpbnQzMicsIDQsIGZ1bmN0aW9uKGluaXQpe1xuICByZXR1cm4gZnVuY3Rpb24gVWludDMyQXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKXtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7IiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnVWludDgnLCAxLCBmdW5jdGlvbihpbml0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFVpbnQ4QXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKXtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7IiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnVWludDgnLCAxLCBmdW5jdGlvbihpbml0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFVpbnQ4Q2xhbXBlZEFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCl7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0sIHRydWUpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBlYWNoICAgICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMClcbiAgLCByZWRlZmluZSAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgbWV0YSAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpXG4gICwgYXNzaWduICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpXG4gICwgd2VhayAgICAgICAgID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi13ZWFrJylcbiAgLCBpc09iamVjdCAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGdldFdlYWsgICAgICA9IG1ldGEuZ2V0V2Vha1xuICAsIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGVcbiAgLCB1bmNhdWdodEZyb3plblN0b3JlID0gd2Vhay51ZnN0b3JlXG4gICwgdG1wICAgICAgICAgID0ge31cbiAgLCBJbnRlcm5hbE1hcDtcblxudmFyIHdyYXBwZXIgPSBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gV2Vha01hcCgpe1xuICAgIHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpO1xuICB9O1xufTtcblxudmFyIG1ldGhvZHMgPSB7XG4gIC8vIDIzLjMuMy4zIFdlYWtNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgaWYoaXNPYmplY3Qoa2V5KSl7XG4gICAgICB2YXIgZGF0YSA9IGdldFdlYWsoa2V5KTtcbiAgICAgIGlmKGRhdGEgPT09IHRydWUpcmV0dXJuIHVuY2F1Z2h0RnJvemVuU3RvcmUodGhpcykuZ2V0KGtleSk7XG4gICAgICByZXR1cm4gZGF0YSA/IGRhdGFbdGhpcy5faV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuICB9LFxuICAvLyAyMy4zLjMuNSBXZWFrTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHdlYWsuZGVmKHRoaXMsIGtleSwgdmFsdWUpO1xuICB9XG59O1xuXG4vLyAyMy4zIFdlYWtNYXAgT2JqZWN0c1xudmFyICRXZWFrTWFwID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ1dlYWtNYXAnLCB3cmFwcGVyLCBtZXRob2RzLCB3ZWFrLCB0cnVlLCB0cnVlKTtcblxuLy8gSUUxMSBXZWFrTWFwIGZyb3plbiBrZXlzIGZpeFxuaWYobmV3ICRXZWFrTWFwKCkuc2V0KChPYmplY3QuZnJlZXplIHx8IE9iamVjdCkodG1wKSwgNykuZ2V0KHRtcCkgIT0gNyl7XG4gIEludGVybmFsTWFwID0gd2Vhay5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyKTtcbiAgYXNzaWduKEludGVybmFsTWFwLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gIG1ldGEuTkVFRCA9IHRydWU7XG4gIGVhY2goWydkZWxldGUnLCAnaGFzJywgJ2dldCcsICdzZXQnXSwgZnVuY3Rpb24oa2V5KXtcbiAgICB2YXIgcHJvdG8gID0gJFdlYWtNYXAucHJvdG90eXBlXG4gICAgICAsIG1ldGhvZCA9IHByb3RvW2tleV07XG4gICAgcmVkZWZpbmUocHJvdG8sIGtleSwgZnVuY3Rpb24oYSwgYil7XG4gICAgICAvLyBzdG9yZSBmcm96ZW4gb2JqZWN0cyBvbiBpbnRlcm5hbCB3ZWFrbWFwIHNoaW1cbiAgICAgIGlmKGlzT2JqZWN0KGEpICYmICFpc0V4dGVuc2libGUoYSkpe1xuICAgICAgICBpZighdGhpcy5fZil0aGlzLl9mID0gbmV3IEludGVybmFsTWFwO1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fZltrZXldKGEsIGIpO1xuICAgICAgICByZXR1cm4ga2V5ID09ICdzZXQnID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIC8vIHN0b3JlIGFsbCB0aGUgcmVzdCBvbiBuYXRpdmUgd2Vha21hcFxuICAgICAgfSByZXR1cm4gbWV0aG9kLmNhbGwodGhpcywgYSwgYik7XG4gICAgfSk7XG4gIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcbnZhciB3ZWFrID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi13ZWFrJyk7XG5cbi8vIDIzLjQgV2Vha1NldCBPYmplY3RzXG5yZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ1dlYWtTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gV2Vha1NldCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuNC4zLjEgV2Vha1NldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XG4gICAgcmV0dXJuIHdlYWsuZGVmKHRoaXMsIHZhbHVlLCB0cnVlKTtcbiAgfVxufSwgd2VhaywgZmFsc2UsIHRydWUpOyIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L0FycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xudmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGluY2x1ZGVzID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKSh0cnVlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKGVsIC8qLCBmcm9tSW5kZXggPSAwICovKXtcbiAgICByZXR1cm4gJGluY2x1ZGVzKHRoaXMsIGVsLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuXG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKSgnaW5jbHVkZXMnKTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYmplY3QtdmFsdWVzLWVudHJpZXNcbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGVudHJpZXMgPSByZXF1aXJlKCcuL19vYmplY3QtdG8tYXJyYXknKSh0cnVlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7XG4gIGVudHJpZXM6IGZ1bmN0aW9uIGVudHJpZXMoaXQpe1xuICAgIHJldHVybiAkZW50cmllcyhpdCk7XG4gIH1cbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JzXG52YXIgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIG93bktleXMgICAgICAgID0gcmVxdWlyZSgnLi9fb3duLWtleXMnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgZ09QRCAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7XG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqZWN0KXtcbiAgICB2YXIgTyAgICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgICAsIGdldERlc2MgPSBnT1BELmZcbiAgICAgICwga2V5cyAgICA9IG93bktleXMoTylcbiAgICAgICwgcmVzdWx0ICA9IHt9XG4gICAgICAsIGkgICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShrZXlzLmxlbmd0aCA+IGkpY3JlYXRlUHJvcGVydHkocmVzdWx0LCBrZXkgPSBrZXlzW2krK10sIGdldERlc2MoTywga2V5KSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JqZWN0LXZhbHVlcy1lbnRyaWVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJHZhbHVlcyA9IHJlcXVpcmUoJy4vX29iamVjdC10by1hcnJheScpKGZhbHNlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7XG4gIHZhbHVlczogZnVuY3Rpb24gdmFsdWVzKGl0KXtcbiAgICByZXR1cm4gJHZhbHVlcyhpdCk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXN0cmluZy1wYWQtc3RhcnQtZW5kXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJHBhZCAgICA9IHJlcXVpcmUoJy4vX3N0cmluZy1wYWQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdTdHJpbmcnLCB7XG4gIHBhZEVuZDogZnVuY3Rpb24gcGFkRW5kKG1heExlbmd0aCAvKiwgZmlsbFN0cmluZyA9ICcgJyAqLyl7XG4gICAgcmV0dXJuICRwYWQodGhpcywgbWF4TGVuZ3RoLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgZmFsc2UpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1zdHJpbmctcGFkLXN0YXJ0LWVuZFxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRwYWQgICAgPSByZXF1aXJlKCcuL19zdHJpbmctcGFkJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnU3RyaW5nJywge1xuICBwYWRTdGFydDogZnVuY3Rpb24gcGFkU3RhcnQobWF4TGVuZ3RoIC8qLCBmaWxsU3RyaW5nID0gJyAnICovKXtcbiAgICByZXR1cm4gJHBhZCh0aGlzLCBtYXhMZW5ndGgsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCB0cnVlKTtcbiAgfVxufSk7IiwidmFyICRpdGVyYXRvcnMgICAgPSByZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpXG4gICwgcmVkZWZpbmUgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBnbG9iYWwgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgSXRlcmF0b3JzICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgd2tzICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpXG4gICwgSVRFUkFUT1IgICAgICA9IHdrcygnaXRlcmF0b3InKVxuICAsIFRPX1NUUklOR19UQUcgPSB3a3MoJ3RvU3RyaW5nVGFnJylcbiAgLCBBcnJheVZhbHVlcyAgID0gSXRlcmF0b3JzLkFycmF5O1xuXG5mb3IodmFyIGNvbGxlY3Rpb25zID0gWydOb2RlTGlzdCcsICdET01Ub2tlbkxpc3QnLCAnTWVkaWFMaXN0JywgJ1N0eWxlU2hlZXRMaXN0JywgJ0NTU1J1bGVMaXN0J10sIGkgPSAwOyBpIDwgNTsgaSsrKXtcbiAgdmFyIE5BTUUgICAgICAgPSBjb2xsZWN0aW9uc1tpXVxuICAgICwgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXVxuICAgICwgcHJvdG8gICAgICA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGVcbiAgICAsIGtleTtcbiAgaWYocHJvdG8pe1xuICAgIGlmKCFwcm90b1tJVEVSQVRPUl0paGlkZShwcm90bywgSVRFUkFUT1IsIEFycmF5VmFsdWVzKTtcbiAgICBpZighcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gICAgSXRlcmF0b3JzW05BTUVdID0gQXJyYXlWYWx1ZXM7XG4gICAgZm9yKGtleSBpbiAkaXRlcmF0b3JzKWlmKCFwcm90b1trZXldKXJlZGVmaW5lKHByb3RvLCBrZXksICRpdGVyYXRvcnNba2V5XSwgdHJ1ZSk7XG4gIH1cbn0iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJHRhc2sgICA9IHJlcXVpcmUoJy4vX3Rhc2snKTtcbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5CLCB7XG4gIHNldEltbWVkaWF0ZTogICAkdGFzay5zZXQsXG4gIGNsZWFySW1tZWRpYXRlOiAkdGFzay5jbGVhclxufSk7IiwiLy8gaWU5LSBzZXRUaW1lb3V0ICYgc2V0SW50ZXJ2YWwgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIGZpeFxudmFyIGdsb2JhbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsICRleHBvcnQgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGludm9rZSAgICAgPSByZXF1aXJlKCcuL19pbnZva2UnKVxuICAsIHBhcnRpYWwgICAgPSByZXF1aXJlKCcuL19wYXJ0aWFsJylcbiAgLCBuYXZpZ2F0b3IgID0gZ2xvYmFsLm5hdmlnYXRvclxuICAsIE1TSUUgICAgICAgPSAhIW5hdmlnYXRvciAmJiAvTVNJRSAuXFwuLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpOyAvLyA8LSBkaXJ0eSBpZTktIGNoZWNrXG52YXIgd3JhcCA9IGZ1bmN0aW9uKHNldCl7XG4gIHJldHVybiBNU0lFID8gZnVuY3Rpb24oZm4sIHRpbWUgLyosIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBzZXQoaW52b2tlKFxuICAgICAgcGFydGlhbCxcbiAgICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcbiAgICAgIHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbilcbiAgICApLCB0aW1lKTtcbiAgfSA6IHNldDtcbn07XG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuQiArICRleHBvcnQuRiAqIE1TSUUsIHtcbiAgc2V0VGltZW91dDogIHdyYXAoZ2xvYmFsLnNldFRpbWVvdXQpLFxuICBzZXRJbnRlcnZhbDogd3JhcChnbG9iYWwuc2V0SW50ZXJ2YWwpXG59KTsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4hKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcbiAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG4gICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcbiAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcbiAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcbiAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG4gICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGdsb2JhbC5wcm9jZXNzID09PSBcIm9iamVjdFwiICYmIGdsb2JhbC5wcm9jZXNzLmRvbWFpbikge1xuICAgICAgaW52b2tlID0gZ2xvYmFsLnByb2Nlc3MuZG9tYWluLmJpbmQoaW52b2tlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBydW50aW1lLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4gIC8vIEFtb25nIHRoZSB2YXJpb3VzIHRyaWNrcyBmb3Igb2J0YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWxcbiAgLy8gb2JqZWN0LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHRlY2huaXF1ZSB0aGF0IGRvZXMgbm90XG4gIC8vIHVzZSBpbmRpcmVjdCBldmFsICh3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSkuXG4gIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOlxuICB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDpcbiAgdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgPyBzZWxmIDogdGhpc1xuKTtcbiIsIi8qISBWZWxvY2l0eUpTLm9yZyAoMS41LjApLiAoQykgMjAxNCBKdWxpYW4gU2hhcGlyby4gTUlUIEBsaWNlbnNlOiBlbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UgKi9cbi8qISBWZWxvY2l0eUpTLm9yZyBqUXVlcnkgU2hpbSAoMS4wLjEpLiAoQykgMjAxNCBUaGUgalF1ZXJ5IEZvdW5kYXRpb24uIE1JVCBAbGljZW5zZTogZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlLiAqL1xuIWZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYSl7dmFyIGI9YS5sZW5ndGgsZD1jLnR5cGUoYSk7cmV0dXJuXCJmdW5jdGlvblwiIT09ZCYmIWMuaXNXaW5kb3coYSkmJighKDEhPT1hLm5vZGVUeXBlfHwhYil8fChcImFycmF5XCI9PT1kfHwwPT09Ynx8XCJudW1iZXJcIj09dHlwZW9mIGImJmI+MCYmYi0xIGluIGEpKX1pZighYS5qUXVlcnkpe3ZhciBjPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBjLmZuLmluaXQoYSxiKX07Yy5pc1dpbmRvdz1mdW5jdGlvbihhKXtyZXR1cm4gYSYmYT09PWEud2luZG93fSxjLnR5cGU9ZnVuY3Rpb24oYSl7cmV0dXJuIGE/XCJvYmplY3RcIj09dHlwZW9mIGF8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGE/ZVtnLmNhbGwoYSldfHxcIm9iamVjdFwiOnR5cGVvZiBhOmErXCJcIn0sYy5pc0FycmF5PUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKGEpe3JldHVyblwiYXJyYXlcIj09PWMudHlwZShhKX0sYy5pc1BsYWluT2JqZWN0PWZ1bmN0aW9uKGEpe3ZhciBiO2lmKCFhfHxcIm9iamVjdFwiIT09Yy50eXBlKGEpfHxhLm5vZGVUeXBlfHxjLmlzV2luZG93KGEpKXJldHVybiExO3RyeXtpZihhLmNvbnN0cnVjdG9yJiYhZi5jYWxsKGEsXCJjb25zdHJ1Y3RvclwiKSYmIWYuY2FsbChhLmNvbnN0cnVjdG9yLnByb3RvdHlwZSxcImlzUHJvdG90eXBlT2ZcIikpcmV0dXJuITF9Y2F0Y2goZCl7cmV0dXJuITF9Zm9yKGIgaW4gYSk7cmV0dXJuIGI9PT11bmRlZmluZWR8fGYuY2FsbChhLGIpfSxjLmVhY2g9ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPTAsZj1hLmxlbmd0aCxnPWIoYSk7aWYoZCl7aWYoZylmb3IoO2U8ZiYmYy5hcHBseShhW2VdLGQpIT09ITE7ZSsrKTtlbHNlIGZvcihlIGluIGEpaWYoYS5oYXNPd25Qcm9wZXJ0eShlKSYmYy5hcHBseShhW2VdLGQpPT09ITEpYnJlYWt9ZWxzZSBpZihnKWZvcig7ZTxmJiZjLmNhbGwoYVtlXSxlLGFbZV0pIT09ITE7ZSsrKTtlbHNlIGZvcihlIGluIGEpaWYoYS5oYXNPd25Qcm9wZXJ0eShlKSYmYy5jYWxsKGFbZV0sZSxhW2VdKT09PSExKWJyZWFrO3JldHVybiBhfSxjLmRhdGE9ZnVuY3Rpb24oYSxiLGUpe2lmKGU9PT11bmRlZmluZWQpe3ZhciBmPWFbYy5leHBhbmRvXSxnPWYmJmRbZl07aWYoYj09PXVuZGVmaW5lZClyZXR1cm4gZztpZihnJiZiIGluIGcpcmV0dXJuIGdbYl19ZWxzZSBpZihiIT09dW5kZWZpbmVkKXt2YXIgaD1hW2MuZXhwYW5kb118fChhW2MuZXhwYW5kb109KytjLnV1aWQpO3JldHVybiBkW2hdPWRbaF18fHt9LGRbaF1bYl09ZSxlfX0sYy5yZW1vdmVEYXRhPWZ1bmN0aW9uKGEsYil7dmFyIGU9YVtjLmV4cGFuZG9dLGY9ZSYmZFtlXTtmJiYoYj9jLmVhY2goYixmdW5jdGlvbihhLGIpe2RlbGV0ZSBmW2JdfSk6ZGVsZXRlIGRbZV0pfSxjLmV4dGVuZD1mdW5jdGlvbigpe3ZhciBhLGIsZCxlLGYsZyxoPWFyZ3VtZW50c1swXXx8e30saT0xLGo9YXJndW1lbnRzLmxlbmd0aCxrPSExO2ZvcihcImJvb2xlYW5cIj09dHlwZW9mIGgmJihrPWgsaD1hcmd1bWVudHNbaV18fHt9LGkrKyksXCJvYmplY3RcIiE9dHlwZW9mIGgmJlwiZnVuY3Rpb25cIiE9PWMudHlwZShoKSYmKGg9e30pLGk9PT1qJiYoaD10aGlzLGktLSk7aTxqO2krKylpZihmPWFyZ3VtZW50c1tpXSlmb3IoZSBpbiBmKWYuaGFzT3duUHJvcGVydHkoZSkmJihhPWhbZV0sZD1mW2VdLGghPT1kJiYoayYmZCYmKGMuaXNQbGFpbk9iamVjdChkKXx8KGI9Yy5pc0FycmF5KGQpKSk/KGI/KGI9ITEsZz1hJiZjLmlzQXJyYXkoYSk/YTpbXSk6Zz1hJiZjLmlzUGxhaW5PYmplY3QoYSk/YTp7fSxoW2VdPWMuZXh0ZW5kKGssZyxkKSk6ZCE9PXVuZGVmaW5lZCYmKGhbZV09ZCkpKTtyZXR1cm4gaH0sYy5xdWV1ZT1mdW5jdGlvbihhLGQsZSl7aWYoYSl7ZD0oZHx8XCJmeFwiKStcInF1ZXVlXCI7dmFyIGY9Yy5kYXRhKGEsZCk7cmV0dXJuIGU/KCFmfHxjLmlzQXJyYXkoZSk/Zj1jLmRhdGEoYSxkLGZ1bmN0aW9uKGEsYyl7dmFyIGQ9Y3x8W107cmV0dXJuIGEmJihiKE9iamVjdChhKSk/ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9K2IubGVuZ3RoLGQ9MCxlPWEubGVuZ3RoO2Q8YzspYVtlKytdPWJbZCsrXTtpZihjIT09Yylmb3IoO2JbZF0hPT11bmRlZmluZWQ7KWFbZSsrXT1iW2QrK107YS5sZW5ndGg9ZSxhfShkLFwic3RyaW5nXCI9PXR5cGVvZiBhP1thXTphKTpbXS5wdXNoLmNhbGwoZCxhKSksZH0oZSkpOmYucHVzaChlKSxmKTpmfHxbXX19LGMuZGVxdWV1ZT1mdW5jdGlvbihhLGIpe2MuZWFjaChhLm5vZGVUeXBlP1thXTphLGZ1bmN0aW9uKGEsZCl7Yj1ifHxcImZ4XCI7dmFyIGU9Yy5xdWV1ZShkLGIpLGY9ZS5zaGlmdCgpO1wiaW5wcm9ncmVzc1wiPT09ZiYmKGY9ZS5zaGlmdCgpKSxmJiYoXCJmeFwiPT09YiYmZS51bnNoaWZ0KFwiaW5wcm9ncmVzc1wiKSxmLmNhbGwoZCxmdW5jdGlvbigpe2MuZGVxdWV1ZShkLGIpfSkpfSl9LGMuZm49Yy5wcm90b3R5cGU9e2luaXQ6ZnVuY3Rpb24oYSl7aWYoYS5ub2RlVHlwZSlyZXR1cm4gdGhpc1swXT1hLHRoaXM7dGhyb3cgbmV3IEVycm9yKFwiTm90IGEgRE9NIG5vZGUuXCIpfSxvZmZzZXQ6ZnVuY3Rpb24oKXt2YXIgYj10aGlzWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdD90aGlzWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOnt0b3A6MCxsZWZ0OjB9O3JldHVybnt0b3A6Yi50b3ArKGEucGFnZVlPZmZzZXR8fGRvY3VtZW50LnNjcm9sbFRvcHx8MCktKGRvY3VtZW50LmNsaWVudFRvcHx8MCksbGVmdDpiLmxlZnQrKGEucGFnZVhPZmZzZXR8fGRvY3VtZW50LnNjcm9sbExlZnR8fDApLShkb2N1bWVudC5jbGllbnRMZWZ0fHwwKX19LHBvc2l0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpc1swXSxiPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1hLm9mZnNldFBhcmVudDtiJiZcImh0bWxcIiE9PWIubm9kZU5hbWUudG9Mb3dlckNhc2UoKSYmYi5zdHlsZSYmXCJzdGF0aWNcIj09PWIuc3R5bGUucG9zaXRpb247KWI9Yi5vZmZzZXRQYXJlbnQ7cmV0dXJuIGJ8fGRvY3VtZW50fShhKSxkPXRoaXMub2Zmc2V0KCksZT0vXig/OmJvZHl8aHRtbCkkL2kudGVzdChiLm5vZGVOYW1lKT97dG9wOjAsbGVmdDowfTpjKGIpLm9mZnNldCgpO3JldHVybiBkLnRvcC09cGFyc2VGbG9hdChhLnN0eWxlLm1hcmdpblRvcCl8fDAsZC5sZWZ0LT1wYXJzZUZsb2F0KGEuc3R5bGUubWFyZ2luTGVmdCl8fDAsYi5zdHlsZSYmKGUudG9wKz1wYXJzZUZsb2F0KGIuc3R5bGUuYm9yZGVyVG9wV2lkdGgpfHwwLGUubGVmdCs9cGFyc2VGbG9hdChiLnN0eWxlLmJvcmRlckxlZnRXaWR0aCl8fDApLHt0b3A6ZC50b3AtZS50b3AsbGVmdDpkLmxlZnQtZS5sZWZ0fX19O3ZhciBkPXt9O2MuZXhwYW5kbz1cInZlbG9jaXR5XCIrKG5ldyBEYXRlKS5nZXRUaW1lKCksYy51dWlkPTA7Zm9yKHZhciBlPXt9LGY9ZS5oYXNPd25Qcm9wZXJ0eSxnPWUudG9TdHJpbmcsaD1cIkJvb2xlYW4gTnVtYmVyIFN0cmluZyBGdW5jdGlvbiBBcnJheSBEYXRlIFJlZ0V4cCBPYmplY3QgRXJyb3JcIi5zcGxpdChcIiBcIiksaT0wO2k8aC5sZW5ndGg7aSsrKWVbXCJbb2JqZWN0IFwiK2hbaV0rXCJdXCJdPWhbaV0udG9Mb3dlckNhc2UoKTtjLmZuLmluaXQucHJvdG90eXBlPWMuZm4sYS5WZWxvY2l0eT17VXRpbGl0aWVzOmN9fX0od2luZG93KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YSgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoYSk6YSgpfShmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO3JldHVybiBmdW5jdGlvbihhLGIsYyxkKXtmdW5jdGlvbiBlKGEpe2Zvcih2YXIgYj0tMSxjPWE/YS5sZW5ndGg6MCxkPVtdOysrYjxjOyl7dmFyIGU9YVtiXTtlJiZkLnB1c2goZSl9cmV0dXJuIGR9ZnVuY3Rpb24gZihhKXtyZXR1cm4gdS5pc1dyYXBwZWQoYSk/YT1zLmNhbGwoYSk6dS5pc05vZGUoYSkmJihhPVthXSksYX1mdW5jdGlvbiBnKGEpe3ZhciBiPW8uZGF0YShhLFwidmVsb2NpdHlcIik7cmV0dXJuIG51bGw9PT1iP2Q6Yn1mdW5jdGlvbiBoKGEsYil7dmFyIGM9ZyhhKTtjJiZjLmRlbGF5VGltZXImJiFjLmRlbGF5UGF1c2VkJiYoYy5kZWxheVJlbWFpbmluZz1jLmRlbGF5LWIrYy5kZWxheUJlZ2luLGMuZGVsYXlQYXVzZWQ9ITAsY2xlYXJUaW1lb3V0KGMuZGVsYXlUaW1lci5zZXRUaW1lb3V0KSl9ZnVuY3Rpb24gaShhLGIpe3ZhciBjPWcoYSk7YyYmYy5kZWxheVRpbWVyJiZjLmRlbGF5UGF1c2VkJiYoYy5kZWxheVBhdXNlZD0hMSxjLmRlbGF5VGltZXIuc2V0VGltZW91dD1zZXRUaW1lb3V0KGMuZGVsYXlUaW1lci5uZXh0LGMuZGVsYXlSZW1haW5pbmcpKX1mdW5jdGlvbiBqKGEpe3JldHVybiBmdW5jdGlvbihiKXtyZXR1cm4gTWF0aC5yb3VuZChiKmEpKigxL2EpfX1mdW5jdGlvbiBrKGEsYyxkLGUpe2Z1bmN0aW9uIGYoYSxiKXtyZXR1cm4gMS0zKmIrMyphfWZ1bmN0aW9uIGcoYSxiKXtyZXR1cm4gMypiLTYqYX1mdW5jdGlvbiBoKGEpe3JldHVybiAzKmF9ZnVuY3Rpb24gaShhLGIsYyl7cmV0dXJuKChmKGIsYykqYStnKGIsYykpKmEraChiKSkqYX1mdW5jdGlvbiBqKGEsYixjKXtyZXR1cm4gMypmKGIsYykqYSphKzIqZyhiLGMpKmEraChiKX1mdW5jdGlvbiBrKGIsYyl7Zm9yKHZhciBlPTA7ZTxwOysrZSl7dmFyIGY9aihjLGEsZCk7aWYoMD09PWYpcmV0dXJuIGM7Yy09KGkoYyxhLGQpLWIpL2Z9cmV0dXJuIGN9ZnVuY3Rpb24gbCgpe2Zvcih2YXIgYj0wO2I8dDsrK2IpeFtiXT1pKGIqdSxhLGQpfWZ1bmN0aW9uIG0oYixjLGUpe3ZhciBmLGcsaD0wO2Rve2c9YysoZS1jKS8yLGY9aShnLGEsZCktYixmPjA/ZT1nOmM9Z313aGlsZShNYXRoLmFicyhmKT5yJiYrK2g8cyk7cmV0dXJuIGd9ZnVuY3Rpb24gbihiKXtmb3IodmFyIGM9MCxlPTEsZj10LTE7ZSE9PWYmJnhbZV08PWI7KytlKWMrPXU7LS1lO3ZhciBnPShiLXhbZV0pLyh4W2UrMV0teFtlXSksaD1jK2cqdSxpPWooaCxhLGQpO3JldHVybiBpPj1xP2soYixoKTowPT09aT9oOm0oYixjLGMrdSl9ZnVuY3Rpb24gbygpe3k9ITAsYT09PWMmJmQ9PT1lfHxsKCl9dmFyIHA9NCxxPS4wMDEscj0xZS03LHM9MTAsdD0xMSx1PTEvKHQtMSksdj1cIkZsb2F0MzJBcnJheVwiaW4gYjtpZig0IT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4hMTtmb3IodmFyIHc9MDt3PDQ7Kyt3KWlmKFwibnVtYmVyXCIhPXR5cGVvZiBhcmd1bWVudHNbd118fGlzTmFOKGFyZ3VtZW50c1t3XSl8fCFpc0Zpbml0ZShhcmd1bWVudHNbd10pKXJldHVybiExO2E9TWF0aC5taW4oYSwxKSxkPU1hdGgubWluKGQsMSksYT1NYXRoLm1heChhLDApLGQ9TWF0aC5tYXgoZCwwKTt2YXIgeD12P25ldyBGbG9hdDMyQXJyYXkodCk6bmV3IEFycmF5KHQpLHk9ITEsej1mdW5jdGlvbihiKXtyZXR1cm4geXx8bygpLGE9PT1jJiZkPT09ZT9iOjA9PT1iPzA6MT09PWI/MTppKG4oYiksYyxlKX07ei5nZXRDb250cm9sUG9pbnRzPWZ1bmN0aW9uKCl7cmV0dXJuW3t4OmEseTpjfSx7eDpkLHk6ZX1dfTt2YXIgQT1cImdlbmVyYXRlQmV6aWVyKFwiK1thLGMsZCxlXStcIilcIjtyZXR1cm4gei50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBBfSx6fWZ1bmN0aW9uIGwoYSxiKXt2YXIgYz1hO3JldHVybiB1LmlzU3RyaW5nKGEpP3kuRWFzaW5nc1thXXx8KGM9ITEpOmM9dS5pc0FycmF5KGEpJiYxPT09YS5sZW5ndGg/ai5hcHBseShudWxsLGEpOnUuaXNBcnJheShhKSYmMj09PWEubGVuZ3RoP3ouYXBwbHkobnVsbCxhLmNvbmNhdChbYl0pKTohKCF1LmlzQXJyYXkoYSl8fDQhPT1hLmxlbmd0aCkmJmsuYXBwbHkobnVsbCxhKSxjPT09ITEmJihjPXkuRWFzaW5nc1t5LmRlZmF1bHRzLmVhc2luZ10/eS5kZWZhdWx0cy5lYXNpbmc6eCksY31mdW5jdGlvbiBtKGEpe2lmKGEpe3ZhciBiPXkudGltZXN0YW1wJiZhIT09ITA/YTpyLm5vdygpLGM9eS5TdGF0ZS5jYWxscy5sZW5ndGg7Yz4xZTQmJih5LlN0YXRlLmNhbGxzPWUoeS5TdGF0ZS5jYWxscyksYz15LlN0YXRlLmNhbGxzLmxlbmd0aCk7Zm9yKHZhciBmPTA7ZjxjO2YrKylpZih5LlN0YXRlLmNhbGxzW2ZdKXt2YXIgaD15LlN0YXRlLmNhbGxzW2ZdLGk9aFswXSxqPWhbMl0saz1oWzNdLGw9ISFrLHE9bnVsbCxzPWhbNV0sdD1oWzZdO2lmKGt8fChrPXkuU3RhdGUuY2FsbHNbZl1bM109Yi0xNikscyl7aWYocy5yZXN1bWUhPT0hMCljb250aW51ZTtrPWhbM109TWF0aC5yb3VuZChiLXQtMTYpLGhbNV09bnVsbH10PWhbNl09Yi1rO2Zvcih2YXIgdj1NYXRoLm1pbih0L2ouZHVyYXRpb24sMSksdz0wLHg9aS5sZW5ndGg7dzx4O3crKyl7dmFyIHo9aVt3XSxCPXouZWxlbWVudDtpZihnKEIpKXt2YXIgRD0hMTtpZihqLmRpc3BsYXkhPT1kJiZudWxsIT09ai5kaXNwbGF5JiZcIm5vbmVcIiE9PWouZGlzcGxheSl7aWYoXCJmbGV4XCI9PT1qLmRpc3BsYXkpe3ZhciBFPVtcIi13ZWJraXQtYm94XCIsXCItbW96LWJveFwiLFwiLW1zLWZsZXhib3hcIixcIi13ZWJraXQtZmxleFwiXTtvLmVhY2goRSxmdW5jdGlvbihhLGIpe0Euc2V0UHJvcGVydHlWYWx1ZShCLFwiZGlzcGxheVwiLGIpfSl9QS5zZXRQcm9wZXJ0eVZhbHVlKEIsXCJkaXNwbGF5XCIsai5kaXNwbGF5KX1qLnZpc2liaWxpdHkhPT1kJiZcImhpZGRlblwiIT09ai52aXNpYmlsaXR5JiZBLnNldFByb3BlcnR5VmFsdWUoQixcInZpc2liaWxpdHlcIixqLnZpc2liaWxpdHkpO2Zvcih2YXIgRiBpbiB6KWlmKHouaGFzT3duUHJvcGVydHkoRikmJlwiZWxlbWVudFwiIT09Ril7dmFyIEcsSD16W0ZdLEk9dS5pc1N0cmluZyhILmVhc2luZyk/eS5FYXNpbmdzW0guZWFzaW5nXTpILmVhc2luZztpZih1LmlzU3RyaW5nKEgucGF0dGVybikpe3ZhciBKPTE9PT12P2Z1bmN0aW9uKGEsYixjKXt2YXIgZD1ILmVuZFZhbHVlW2JdO3JldHVybiBjP01hdGgucm91bmQoZCk6ZH06ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPUguc3RhcnRWYWx1ZVtiXSxlPUguZW5kVmFsdWVbYl0tZCxmPWQrZSpJKHYsaixlKTtyZXR1cm4gYz9NYXRoLnJvdW5kKGYpOmZ9O0c9SC5wYXR0ZXJuLnJlcGxhY2UoL3soXFxkKykoISk/fS9nLEopfWVsc2UgaWYoMT09PXYpRz1ILmVuZFZhbHVlO2Vsc2V7dmFyIEs9SC5lbmRWYWx1ZS1ILnN0YXJ0VmFsdWU7Rz1ILnN0YXJ0VmFsdWUrSypJKHYsaixLKX1pZighbCYmRz09PUguY3VycmVudFZhbHVlKWNvbnRpbnVlO2lmKEguY3VycmVudFZhbHVlPUcsXCJ0d2VlblwiPT09RilxPUc7ZWxzZXt2YXIgTDtpZihBLkhvb2tzLnJlZ2lzdGVyZWRbRl0pe0w9QS5Ib29rcy5nZXRSb290KEYpO3ZhciBNPWcoQikucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtMXTtNJiYoSC5yb290UHJvcGVydHlWYWx1ZT1NKX12YXIgTj1BLnNldFByb3BlcnR5VmFsdWUoQixGLEguY3VycmVudFZhbHVlKyhwPDkmJjA9PT1wYXJzZUZsb2F0KEcpP1wiXCI6SC51bml0VHlwZSksSC5yb290UHJvcGVydHlWYWx1ZSxILnNjcm9sbERhdGEpO0EuSG9va3MucmVnaXN0ZXJlZFtGXSYmKEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtMXT9nKEIpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbTF09QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW0xdKFwiZXh0cmFjdFwiLG51bGwsTlsxXSk6ZyhCKS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW0xdPU5bMV0pLFwidHJhbnNmb3JtXCI9PT1OWzBdJiYoRD0hMCl9fWoubW9iaWxlSEEmJmcoQikudHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2Q9PT1kJiYoZyhCKS50cmFuc2Zvcm1DYWNoZS50cmFuc2xhdGUzZD1cIigwcHgsIDBweCwgMHB4KVwiLEQ9ITApLEQmJkEuZmx1c2hUcmFuc2Zvcm1DYWNoZShCKX19ai5kaXNwbGF5IT09ZCYmXCJub25lXCIhPT1qLmRpc3BsYXkmJih5LlN0YXRlLmNhbGxzW2ZdWzJdLmRpc3BsYXk9ITEpLGoudmlzaWJpbGl0eSE9PWQmJlwiaGlkZGVuXCIhPT1qLnZpc2liaWxpdHkmJih5LlN0YXRlLmNhbGxzW2ZdWzJdLnZpc2liaWxpdHk9ITEpLGoucHJvZ3Jlc3MmJmoucHJvZ3Jlc3MuY2FsbChoWzFdLGhbMV0sdixNYXRoLm1heCgwLGsrai5kdXJhdGlvbi1iKSxrLHEpLDE9PT12JiZuKGYpfX15LlN0YXRlLmlzVGlja2luZyYmQyhtKX1mdW5jdGlvbiBuKGEsYil7aWYoIXkuU3RhdGUuY2FsbHNbYV0pcmV0dXJuITE7Zm9yKHZhciBjPXkuU3RhdGUuY2FsbHNbYV1bMF0sZT15LlN0YXRlLmNhbGxzW2FdWzFdLGY9eS5TdGF0ZS5jYWxsc1thXVsyXSxoPXkuU3RhdGUuY2FsbHNbYV1bNF0saT0hMSxqPTAsaz1jLmxlbmd0aDtqPGs7aisrKXt2YXIgbD1jW2pdLmVsZW1lbnQ7Ynx8Zi5sb29wfHwoXCJub25lXCI9PT1mLmRpc3BsYXkmJkEuc2V0UHJvcGVydHlWYWx1ZShsLFwiZGlzcGxheVwiLGYuZGlzcGxheSksXCJoaWRkZW5cIj09PWYudmlzaWJpbGl0eSYmQS5zZXRQcm9wZXJ0eVZhbHVlKGwsXCJ2aXNpYmlsaXR5XCIsZi52aXNpYmlsaXR5KSk7dmFyIG09ZyhsKTtpZihmLmxvb3AhPT0hMCYmKG8ucXVldWUobClbMV09PT1kfHwhL1xcLnZlbG9jaXR5UXVldWVFbnRyeUZsYWcvaS50ZXN0KG8ucXVldWUobClbMV0pKSYmbSl7bS5pc0FuaW1hdGluZz0hMSxtLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGU9e307dmFyIG49ITE7by5lYWNoKEEuTGlzdHMudHJhbnNmb3JtczNELGZ1bmN0aW9uKGEsYil7dmFyIGM9L15zY2FsZS8udGVzdChiKT8xOjAsZT1tLnRyYW5zZm9ybUNhY2hlW2JdO20udHJhbnNmb3JtQ2FjaGVbYl0hPT1kJiZuZXcgUmVnRXhwKFwiXlxcXFwoXCIrYytcIlteLl1cIikudGVzdChlKSYmKG49ITAsZGVsZXRlIG0udHJhbnNmb3JtQ2FjaGVbYl0pfSksZi5tb2JpbGVIQSYmKG49ITAsZGVsZXRlIG0udHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2QpLG4mJkEuZmx1c2hUcmFuc2Zvcm1DYWNoZShsKSxBLlZhbHVlcy5yZW1vdmVDbGFzcyhsLFwidmVsb2NpdHktYW5pbWF0aW5nXCIpfWlmKCFiJiZmLmNvbXBsZXRlJiYhZi5sb29wJiZqPT09ay0xKXRyeXtmLmNvbXBsZXRlLmNhbGwoZSxlKX1jYXRjaChyKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhyb3cgcn0sMSl9aCYmZi5sb29wIT09ITAmJmgoZSksbSYmZi5sb29wPT09ITAmJiFiJiYoby5lYWNoKG0udHdlZW5zQ29udGFpbmVyLGZ1bmN0aW9uKGEsYil7aWYoL15yb3RhdGUvLnRlc3QoYSkmJihwYXJzZUZsb2F0KGIuc3RhcnRWYWx1ZSktcGFyc2VGbG9hdChiLmVuZFZhbHVlKSklMzYwPT0wKXt2YXIgYz1iLnN0YXJ0VmFsdWU7Yi5zdGFydFZhbHVlPWIuZW5kVmFsdWUsYi5lbmRWYWx1ZT1jfS9eYmFja2dyb3VuZFBvc2l0aW9uLy50ZXN0KGEpJiYxMDA9PT1wYXJzZUZsb2F0KGIuZW5kVmFsdWUpJiZcIiVcIj09PWIudW5pdFR5cGUmJihiLmVuZFZhbHVlPTAsYi5zdGFydFZhbHVlPTEwMCl9KSx5KGwsXCJyZXZlcnNlXCIse2xvb3A6ITAsZGVsYXk6Zi5kZWxheX0pKSxmLnF1ZXVlIT09ITEmJm8uZGVxdWV1ZShsLGYucXVldWUpfXkuU3RhdGUuY2FsbHNbYV09ITE7Zm9yKHZhciBwPTAscT15LlN0YXRlLmNhbGxzLmxlbmd0aDtwPHE7cCsrKWlmKHkuU3RhdGUuY2FsbHNbcF0hPT0hMSl7aT0hMDticmVha31pPT09ITEmJih5LlN0YXRlLmlzVGlja2luZz0hMSxkZWxldGUgeS5TdGF0ZS5jYWxscyx5LlN0YXRlLmNhbGxzPVtdKX12YXIgbyxwPWZ1bmN0aW9uKCl7aWYoYy5kb2N1bWVudE1vZGUpcmV0dXJuIGMuZG9jdW1lbnRNb2RlO2Zvcih2YXIgYT03O2E+NDthLS0pe3ZhciBiPWMuY3JlYXRlRWxlbWVudChcImRpdlwiKTtpZihiLmlubmVySFRNTD1cIjwhLS1baWYgSUUgXCIrYStcIl0+PHNwYW4+PC9zcGFuPjwhW2VuZGlmXS0tPlwiLGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzcGFuXCIpLmxlbmd0aClyZXR1cm4gYj1udWxsLGF9cmV0dXJuIGR9KCkscT1mdW5jdGlvbigpe3ZhciBhPTA7cmV0dXJuIGIud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxiLm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24oYil7dmFyIGMsZD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gYz1NYXRoLm1heCgwLDE2LShkLWEpKSxhPWQrYyxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YihkK2MpfSxjKX19KCkscj1mdW5jdGlvbigpe3ZhciBhPWIucGVyZm9ybWFuY2V8fHt9O2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGEubm93KXt2YXIgYz1hLnRpbWluZyYmYS50aW1pbmcubmF2aWdhdGlvblN0YXJ0P2EudGltaW5nLm5hdmlnYXRpb25TdGFydDoobmV3IERhdGUpLmdldFRpbWUoKTthLm5vdz1mdW5jdGlvbigpe3JldHVybihuZXcgRGF0ZSkuZ2V0VGltZSgpLWN9fXJldHVybiBhfSgpLHM9ZnVuY3Rpb24oKXt2YXIgYT1BcnJheS5wcm90b3R5cGUuc2xpY2U7dHJ5e3JldHVybiBhLmNhbGwoYy5kb2N1bWVudEVsZW1lbnQpLGF9Y2F0Y2goYil7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7dmFyIGQ9dGhpcy5sZW5ndGg7aWYoXCJudW1iZXJcIiE9dHlwZW9mIGImJihiPTApLFwibnVtYmVyXCIhPXR5cGVvZiBjJiYoYz1kKSx0aGlzLnNsaWNlKXJldHVybiBhLmNhbGwodGhpcyxiLGMpO3ZhciBlLGY9W10sZz1iPj0wP2I6TWF0aC5tYXgoMCxkK2IpLGg9YzwwP2QrYzpNYXRoLm1pbihjLGQpLGk9aC1nO2lmKGk+MClpZihmPW5ldyBBcnJheShpKSx0aGlzLmNoYXJBdClmb3IoZT0wO2U8aTtlKyspZltlXT10aGlzLmNoYXJBdChnK2UpO2Vsc2UgZm9yKGU9MDtlPGk7ZSsrKWZbZV09dGhpc1tnK2VdO3JldHVybiBmfX19KCksdD1mdW5jdGlvbigpe3JldHVybiBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXM/ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5pbmNsdWRlcyhiKX06QXJyYXkucHJvdG90eXBlLmluZGV4T2Y/ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5pbmRleE9mKGIpPj0wfTpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0wO2M8YS5sZW5ndGg7YysrKWlmKGFbY109PT1iKXJldHVybiEwO3JldHVybiExfX0sdT17aXNOdW1iZXI6ZnVuY3Rpb24oYSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGF9LGlzU3RyaW5nOmZ1bmN0aW9uKGEpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhfSxpc0FycmF5OkFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKGEpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKX0saXNGdW5jdGlvbjpmdW5jdGlvbihhKXtyZXR1cm5cIltvYmplY3QgRnVuY3Rpb25dXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSl9LGlzTm9kZTpmdW5jdGlvbihhKXtyZXR1cm4gYSYmYS5ub2RlVHlwZX0saXNXcmFwcGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhJiZhIT09YiYmdS5pc051bWJlcihhLmxlbmd0aCkmJiF1LmlzU3RyaW5nKGEpJiYhdS5pc0Z1bmN0aW9uKGEpJiYhdS5pc05vZGUoYSkmJigwPT09YS5sZW5ndGh8fHUuaXNOb2RlKGFbMF0pKX0saXNTVkc6ZnVuY3Rpb24oYSl7cmV0dXJuIGIuU1ZHRWxlbWVudCYmYSBpbnN0YW5jZW9mIGIuU1ZHRWxlbWVudH0saXNFbXB0eU9iamVjdDpmdW5jdGlvbihhKXtmb3IodmFyIGIgaW4gYSlpZihhLmhhc093blByb3BlcnR5KGIpKXJldHVybiExO3JldHVybiEwfX0sdj0hMTtpZihhLmZuJiZhLmZuLmpxdWVyeT8obz1hLHY9ITApOm89Yi5WZWxvY2l0eS5VdGlsaXRpZXMscDw9OCYmIXYpdGhyb3cgbmV3IEVycm9yKFwiVmVsb2NpdHk6IElFOCBhbmQgYmVsb3cgcmVxdWlyZSBqUXVlcnkgdG8gYmUgbG9hZGVkIGJlZm9yZSBWZWxvY2l0eS5cIik7aWYocDw9NylyZXR1cm4gdm9pZChqUXVlcnkuZm4udmVsb2NpdHk9alF1ZXJ5LmZuLmFuaW1hdGUpO3ZhciB3PTQwMCx4PVwic3dpbmdcIix5PXtTdGF0ZTp7aXNNb2JpbGU6L0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLGlzQW5kcm9pZDovQW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksaXNHaW5nZXJicmVhZDovQW5kcm9pZCAyXFwuM1xcLlszLTddL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxpc0Nocm9tZTpiLmNocm9tZSxpc0ZpcmVmb3g6L0ZpcmVmb3gvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLHByZWZpeEVsZW1lbnQ6Yy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLHByZWZpeE1hdGNoZXM6e30sc2Nyb2xsQW5jaG9yOm51bGwsc2Nyb2xsUHJvcGVydHlMZWZ0Om51bGwsc2Nyb2xsUHJvcGVydHlUb3A6bnVsbCxpc1RpY2tpbmc6ITEsY2FsbHM6W10sZGVsYXllZEVsZW1lbnRzOntjb3VudDowfX0sQ1NTOnt9LFV0aWxpdGllczpvLFJlZGlyZWN0czp7fSxFYXNpbmdzOnt9LFByb21pc2U6Yi5Qcm9taXNlLGRlZmF1bHRzOntxdWV1ZTpcIlwiLGR1cmF0aW9uOncsZWFzaW5nOngsYmVnaW46ZCxjb21wbGV0ZTpkLHByb2dyZXNzOmQsZGlzcGxheTpkLHZpc2liaWxpdHk6ZCxsb29wOiExLGRlbGF5OiExLG1vYmlsZUhBOiEwLF9jYWNoZVZhbHVlczohMCxwcm9taXNlUmVqZWN0RW1wdHk6ITB9LGluaXQ6ZnVuY3Rpb24oYSl7by5kYXRhKGEsXCJ2ZWxvY2l0eVwiLHtpc1NWRzp1LmlzU1ZHKGEpLGlzQW5pbWF0aW5nOiExLGNvbXB1dGVkU3R5bGU6bnVsbCx0d2VlbnNDb250YWluZXI6bnVsbCxyb290UHJvcGVydHlWYWx1ZUNhY2hlOnt9LHRyYW5zZm9ybUNhY2hlOnt9fSl9LGhvb2s6bnVsbCxtb2NrOiExLHZlcnNpb246e21ham9yOjEsbWlub3I6NSxwYXRjaDowfSxkZWJ1ZzohMSx0aW1lc3RhbXA6ITAscGF1c2VBbGw6ZnVuY3Rpb24oYSl7dmFyIGI9KG5ldyBEYXRlKS5nZXRUaW1lKCk7by5lYWNoKHkuU3RhdGUuY2FsbHMsZnVuY3Rpb24oYixjKXtpZihjKXtpZihhIT09ZCYmKGNbMl0ucXVldWUhPT1hfHxjWzJdLnF1ZXVlPT09ITEpKXJldHVybiEwO2NbNV09e3Jlc3VtZTohMX19fSksby5lYWNoKHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLGZ1bmN0aW9uKGEsYyl7YyYmaChjLGIpfSl9LHJlc3VtZUFsbDpmdW5jdGlvbihhKXt2YXIgYj0obmV3IERhdGUpLmdldFRpbWUoKTtvLmVhY2goeS5TdGF0ZS5jYWxscyxmdW5jdGlvbihiLGMpe2lmKGMpe2lmKGEhPT1kJiYoY1syXS5xdWV1ZSE9PWF8fGNbMl0ucXVldWU9PT0hMSkpcmV0dXJuITA7Y1s1XSYmKGNbNV0ucmVzdW1lPSEwKX19KSxvLmVhY2goeS5TdGF0ZS5kZWxheWVkRWxlbWVudHMsZnVuY3Rpb24oYSxjKXtjJiZpKGMsYil9KX19O2IucGFnZVlPZmZzZXQhPT1kPyh5LlN0YXRlLnNjcm9sbEFuY2hvcj1iLHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlMZWZ0PVwicGFnZVhPZmZzZXRcIix5LlN0YXRlLnNjcm9sbFByb3BlcnR5VG9wPVwicGFnZVlPZmZzZXRcIik6KHkuU3RhdGUuc2Nyb2xsQW5jaG9yPWMuZG9jdW1lbnRFbGVtZW50fHxjLmJvZHkucGFyZW50Tm9kZXx8Yy5ib2R5LHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlMZWZ0PVwic2Nyb2xsTGVmdFwiLHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlUb3A9XCJzY3JvbGxUb3BcIik7dmFyIHo9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEpe3JldHVybi1hLnRlbnNpb24qYS54LWEuZnJpY3Rpb24qYS52fWZ1bmN0aW9uIGIoYixjLGQpe3ZhciBlPXt4OmIueCtkLmR4KmMsdjpiLnYrZC5kdipjLHRlbnNpb246Yi50ZW5zaW9uLGZyaWN0aW9uOmIuZnJpY3Rpb259O3JldHVybntkeDplLnYsZHY6YShlKX19ZnVuY3Rpb24gYyhjLGQpe3ZhciBlPXtkeDpjLnYsZHY6YShjKX0sZj1iKGMsLjUqZCxlKSxnPWIoYywuNSpkLGYpLGg9YihjLGQsZyksaT0xLzYqKGUuZHgrMiooZi5keCtnLmR4KStoLmR4KSxqPTEvNiooZS5kdisyKihmLmR2K2cuZHYpK2guZHYpO3JldHVybiBjLng9Yy54K2kqZCxjLnY9Yy52K2oqZCxjfXJldHVybiBmdW5jdGlvbiBkKGEsYixlKXt2YXIgZixnLGgsaT17eDotMSx2OjAsdGVuc2lvbjpudWxsLGZyaWN0aW9uOm51bGx9LGo9WzBdLGs9MDtmb3IoYT1wYXJzZUZsb2F0KGEpfHw1MDAsYj1wYXJzZUZsb2F0KGIpfHwyMCxlPWV8fG51bGwsaS50ZW5zaW9uPWEsaS5mcmljdGlvbj1iLGY9bnVsbCE9PWUsZj8oaz1kKGEsYiksZz1rL2UqLjAxNik6Zz0uMDE2OzspaWYoaD1jKGh8fGksZyksai5wdXNoKDEraC54KSxrKz0xNiwhKE1hdGguYWJzKGgueCk+MWUtNCYmTWF0aC5hYnMoaC52KT4xZS00KSlicmVhaztyZXR1cm4gZj9mdW5jdGlvbihhKXtyZXR1cm4galthKihqLmxlbmd0aC0xKXwwXX06a319KCk7eS5FYXNpbmdzPXtsaW5lYXI6ZnVuY3Rpb24oYSl7cmV0dXJuIGF9LHN3aW5nOmZ1bmN0aW9uKGEpe3JldHVybi41LU1hdGguY29zKGEqTWF0aC5QSSkvMn0sc3ByaW5nOmZ1bmN0aW9uKGEpe3JldHVybiAxLU1hdGguY29zKDQuNSphKk1hdGguUEkpKk1hdGguZXhwKDYqLWEpfX0sby5lYWNoKFtbXCJlYXNlXCIsWy4yNSwuMSwuMjUsMV1dLFtcImVhc2UtaW5cIixbLjQyLDAsMSwxXV0sW1wiZWFzZS1vdXRcIixbMCwwLC41OCwxXV0sW1wiZWFzZS1pbi1vdXRcIixbLjQyLDAsLjU4LDFdXSxbXCJlYXNlSW5TaW5lXCIsWy40NywwLC43NDUsLjcxNV1dLFtcImVhc2VPdXRTaW5lXCIsWy4zOSwuNTc1LC41NjUsMV1dLFtcImVhc2VJbk91dFNpbmVcIixbLjQ0NSwuMDUsLjU1LC45NV1dLFtcImVhc2VJblF1YWRcIixbLjU1LC4wODUsLjY4LC41M11dLFtcImVhc2VPdXRRdWFkXCIsWy4yNSwuNDYsLjQ1LC45NF1dLFtcImVhc2VJbk91dFF1YWRcIixbLjQ1NSwuMDMsLjUxNSwuOTU1XV0sW1wiZWFzZUluQ3ViaWNcIixbLjU1LC4wNTUsLjY3NSwuMTldXSxbXCJlYXNlT3V0Q3ViaWNcIixbLjIxNSwuNjEsLjM1NSwxXV0sW1wiZWFzZUluT3V0Q3ViaWNcIixbLjY0NSwuMDQ1LC4zNTUsMV1dLFtcImVhc2VJblF1YXJ0XCIsWy44OTUsLjAzLC42ODUsLjIyXV0sW1wiZWFzZU91dFF1YXJ0XCIsWy4xNjUsLjg0LC40NCwxXV0sW1wiZWFzZUluT3V0UXVhcnRcIixbLjc3LDAsLjE3NSwxXV0sW1wiZWFzZUluUXVpbnRcIixbLjc1NSwuMDUsLjg1NSwuMDZdXSxbXCJlYXNlT3V0UXVpbnRcIixbLjIzLDEsLjMyLDFdXSxbXCJlYXNlSW5PdXRRdWludFwiLFsuODYsMCwuMDcsMV1dLFtcImVhc2VJbkV4cG9cIixbLjk1LC4wNSwuNzk1LC4wMzVdXSxbXCJlYXNlT3V0RXhwb1wiLFsuMTksMSwuMjIsMV1dLFtcImVhc2VJbk91dEV4cG9cIixbMSwwLDAsMV1dLFtcImVhc2VJbkNpcmNcIixbLjYsLjA0LC45OCwuMzM1XV0sW1wiZWFzZU91dENpcmNcIixbLjA3NSwuODIsLjE2NSwxXV0sW1wiZWFzZUluT3V0Q2lyY1wiLFsuNzg1LC4xMzUsLjE1LC44Nl1dXSxmdW5jdGlvbihhLGIpe3kuRWFzaW5nc1tiWzBdXT1rLmFwcGx5KG51bGwsYlsxXSl9KTt2YXIgQT15LkNTUz17UmVnRXg6e2lzSGV4Oi9eIyhbQS1mXFxkXXszfSl7MSwyfSQvaSx2YWx1ZVVud3JhcDovXltBLXpdK1xcKCguKilcXCkkL2ksd3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZDovWzAtOS5dKyBbMC05Ll0rIFswLTkuXSsoIFswLTkuXSspPy8sdmFsdWVTcGxpdDovKFtBLXpdK1xcKC4rXFwpKXwoKFtBLXowLTkjLS5dKz8pKD89XFxzfCQpKS9naX0sTGlzdHM6e2NvbG9yczpbXCJmaWxsXCIsXCJzdHJva2VcIixcInN0b3BDb2xvclwiLFwiY29sb3JcIixcImJhY2tncm91bmRDb2xvclwiLFwiYm9yZGVyQ29sb3JcIixcImJvcmRlclRvcENvbG9yXCIsXCJib3JkZXJSaWdodENvbG9yXCIsXCJib3JkZXJCb3R0b21Db2xvclwiLFwiYm9yZGVyTGVmdENvbG9yXCIsXCJvdXRsaW5lQ29sb3JcIl0sdHJhbnNmb3Jtc0Jhc2U6W1widHJhbnNsYXRlWFwiLFwidHJhbnNsYXRlWVwiLFwic2NhbGVcIixcInNjYWxlWFwiLFwic2NhbGVZXCIsXCJza2V3WFwiLFwic2tld1lcIixcInJvdGF0ZVpcIl0sdHJhbnNmb3JtczNEOltcInRyYW5zZm9ybVBlcnNwZWN0aXZlXCIsXCJ0cmFuc2xhdGVaXCIsXCJzY2FsZVpcIixcInJvdGF0ZVhcIixcInJvdGF0ZVlcIl0sdW5pdHM6W1wiJVwiLFwiZW1cIixcImV4XCIsXCJjaFwiLFwicmVtXCIsXCJ2d1wiLFwidmhcIixcInZtaW5cIixcInZtYXhcIixcImNtXCIsXCJtbVwiLFwiUVwiLFwiaW5cIixcInBjXCIsXCJwdFwiLFwicHhcIixcImRlZ1wiLFwiZ3JhZFwiLFwicmFkXCIsXCJ0dXJuXCIsXCJzXCIsXCJtc1wiXSxjb2xvck5hbWVzOnthbGljZWJsdWU6XCIyNDAsMjQ4LDI1NVwiLGFudGlxdWV3aGl0ZTpcIjI1MCwyMzUsMjE1XCIsYXF1YW1hcmluZTpcIjEyNywyNTUsMjEyXCIsYXF1YTpcIjAsMjU1LDI1NVwiLGF6dXJlOlwiMjQwLDI1NSwyNTVcIixiZWlnZTpcIjI0NSwyNDUsMjIwXCIsYmlzcXVlOlwiMjU1LDIyOCwxOTZcIixibGFjazpcIjAsMCwwXCIsYmxhbmNoZWRhbG1vbmQ6XCIyNTUsMjM1LDIwNVwiLGJsdWV2aW9sZXQ6XCIxMzgsNDMsMjI2XCIsYmx1ZTpcIjAsMCwyNTVcIixicm93bjpcIjE2NSw0Miw0MlwiLGJ1cmx5d29vZDpcIjIyMiwxODQsMTM1XCIsY2FkZXRibHVlOlwiOTUsMTU4LDE2MFwiLGNoYXJ0cmV1c2U6XCIxMjcsMjU1LDBcIixjaG9jb2xhdGU6XCIyMTAsMTA1LDMwXCIsY29yYWw6XCIyNTUsMTI3LDgwXCIsY29ybmZsb3dlcmJsdWU6XCIxMDAsMTQ5LDIzN1wiLGNvcm5zaWxrOlwiMjU1LDI0OCwyMjBcIixjcmltc29uOlwiMjIwLDIwLDYwXCIsY3lhbjpcIjAsMjU1LDI1NVwiLGRhcmtibHVlOlwiMCwwLDEzOVwiLGRhcmtjeWFuOlwiMCwxMzksMTM5XCIsZGFya2dvbGRlbnJvZDpcIjE4NCwxMzQsMTFcIixkYXJrZ3JheTpcIjE2OSwxNjksMTY5XCIsZGFya2dyZXk6XCIxNjksMTY5LDE2OVwiLGRhcmtncmVlbjpcIjAsMTAwLDBcIixkYXJra2hha2k6XCIxODksMTgzLDEwN1wiLGRhcmttYWdlbnRhOlwiMTM5LDAsMTM5XCIsZGFya29saXZlZ3JlZW46XCI4NSwxMDcsNDdcIixkYXJrb3JhbmdlOlwiMjU1LDE0MCwwXCIsZGFya29yY2hpZDpcIjE1Myw1MCwyMDRcIixkYXJrcmVkOlwiMTM5LDAsMFwiLGRhcmtzYWxtb246XCIyMzMsMTUwLDEyMlwiLGRhcmtzZWFncmVlbjpcIjE0MywxODgsMTQzXCIsZGFya3NsYXRlYmx1ZTpcIjcyLDYxLDEzOVwiLGRhcmtzbGF0ZWdyYXk6XCI0Nyw3OSw3OVwiLGRhcmt0dXJxdW9pc2U6XCIwLDIwNiwyMDlcIixkYXJrdmlvbGV0OlwiMTQ4LDAsMjExXCIsZGVlcHBpbms6XCIyNTUsMjAsMTQ3XCIsZGVlcHNreWJsdWU6XCIwLDE5MSwyNTVcIixkaW1ncmF5OlwiMTA1LDEwNSwxMDVcIixkaW1ncmV5OlwiMTA1LDEwNSwxMDVcIixkb2RnZXJibHVlOlwiMzAsMTQ0LDI1NVwiLGZpcmVicmljazpcIjE3OCwzNCwzNFwiLGZsb3JhbHdoaXRlOlwiMjU1LDI1MCwyNDBcIixmb3Jlc3RncmVlbjpcIjM0LDEzOSwzNFwiLGZ1Y2hzaWE6XCIyNTUsMCwyNTVcIixnYWluc2Jvcm86XCIyMjAsMjIwLDIyMFwiLGdob3N0d2hpdGU6XCIyNDgsMjQ4LDI1NVwiLGdvbGQ6XCIyNTUsMjE1LDBcIixnb2xkZW5yb2Q6XCIyMTgsMTY1LDMyXCIsZ3JheTpcIjEyOCwxMjgsMTI4XCIsZ3JleTpcIjEyOCwxMjgsMTI4XCIsZ3JlZW55ZWxsb3c6XCIxNzMsMjU1LDQ3XCIsZ3JlZW46XCIwLDEyOCwwXCIsaG9uZXlkZXc6XCIyNDAsMjU1LDI0MFwiLGhvdHBpbms6XCIyNTUsMTA1LDE4MFwiLGluZGlhbnJlZDpcIjIwNSw5Miw5MlwiLGluZGlnbzpcIjc1LDAsMTMwXCIsaXZvcnk6XCIyNTUsMjU1LDI0MFwiLGtoYWtpOlwiMjQwLDIzMCwxNDBcIixsYXZlbmRlcmJsdXNoOlwiMjU1LDI0MCwyNDVcIixsYXZlbmRlcjpcIjIzMCwyMzAsMjUwXCIsbGF3bmdyZWVuOlwiMTI0LDI1MiwwXCIsbGVtb25jaGlmZm9uOlwiMjU1LDI1MCwyMDVcIixsaWdodGJsdWU6XCIxNzMsMjE2LDIzMFwiLGxpZ2h0Y29yYWw6XCIyNDAsMTI4LDEyOFwiLGxpZ2h0Y3lhbjpcIjIyNCwyNTUsMjU1XCIsbGlnaHRnb2xkZW5yb2R5ZWxsb3c6XCIyNTAsMjUwLDIxMFwiLGxpZ2h0Z3JheTpcIjIxMSwyMTEsMjExXCIsbGlnaHRncmV5OlwiMjExLDIxMSwyMTFcIixsaWdodGdyZWVuOlwiMTQ0LDIzOCwxNDRcIixsaWdodHBpbms6XCIyNTUsMTgyLDE5M1wiLGxpZ2h0c2FsbW9uOlwiMjU1LDE2MCwxMjJcIixsaWdodHNlYWdyZWVuOlwiMzIsMTc4LDE3MFwiLGxpZ2h0c2t5Ymx1ZTpcIjEzNSwyMDYsMjUwXCIsbGlnaHRzbGF0ZWdyYXk6XCIxMTksMTM2LDE1M1wiLGxpZ2h0c3RlZWxibHVlOlwiMTc2LDE5NiwyMjJcIixsaWdodHllbGxvdzpcIjI1NSwyNTUsMjI0XCIsbGltZWdyZWVuOlwiNTAsMjA1LDUwXCIsbGltZTpcIjAsMjU1LDBcIixsaW5lbjpcIjI1MCwyNDAsMjMwXCIsbWFnZW50YTpcIjI1NSwwLDI1NVwiLG1hcm9vbjpcIjEyOCwwLDBcIixtZWRpdW1hcXVhbWFyaW5lOlwiMTAyLDIwNSwxNzBcIixtZWRpdW1ibHVlOlwiMCwwLDIwNVwiLG1lZGl1bW9yY2hpZDpcIjE4Niw4NSwyMTFcIixtZWRpdW1wdXJwbGU6XCIxNDcsMTEyLDIxOVwiLG1lZGl1bXNlYWdyZWVuOlwiNjAsMTc5LDExM1wiLG1lZGl1bXNsYXRlYmx1ZTpcIjEyMywxMDQsMjM4XCIsbWVkaXVtc3ByaW5nZ3JlZW46XCIwLDI1MCwxNTRcIixtZWRpdW10dXJxdW9pc2U6XCI3MiwyMDksMjA0XCIsbWVkaXVtdmlvbGV0cmVkOlwiMTk5LDIxLDEzM1wiLG1pZG5pZ2h0Ymx1ZTpcIjI1LDI1LDExMlwiLG1pbnRjcmVhbTpcIjI0NSwyNTUsMjUwXCIsbWlzdHlyb3NlOlwiMjU1LDIyOCwyMjVcIixtb2NjYXNpbjpcIjI1NSwyMjgsMTgxXCIsbmF2YWpvd2hpdGU6XCIyNTUsMjIyLDE3M1wiLG5hdnk6XCIwLDAsMTI4XCIsb2xkbGFjZTpcIjI1MywyNDUsMjMwXCIsb2xpdmVkcmFiOlwiMTA3LDE0MiwzNVwiLG9saXZlOlwiMTI4LDEyOCwwXCIsb3JhbmdlcmVkOlwiMjU1LDY5LDBcIixvcmFuZ2U6XCIyNTUsMTY1LDBcIixvcmNoaWQ6XCIyMTgsMTEyLDIxNFwiLHBhbGVnb2xkZW5yb2Q6XCIyMzgsMjMyLDE3MFwiLHBhbGVncmVlbjpcIjE1MiwyNTEsMTUyXCIscGFsZXR1cnF1b2lzZTpcIjE3NSwyMzgsMjM4XCIscGFsZXZpb2xldHJlZDpcIjIxOSwxMTIsMTQ3XCIscGFwYXlhd2hpcDpcIjI1NSwyMzksMjEzXCIscGVhY2hwdWZmOlwiMjU1LDIxOCwxODVcIixwZXJ1OlwiMjA1LDEzMyw2M1wiLHBpbms6XCIyNTUsMTkyLDIwM1wiLHBsdW06XCIyMjEsMTYwLDIyMVwiLHBvd2RlcmJsdWU6XCIxNzYsMjI0LDIzMFwiLHB1cnBsZTpcIjEyOCwwLDEyOFwiLHJlZDpcIjI1NSwwLDBcIixyb3N5YnJvd246XCIxODgsMTQzLDE0M1wiLHJveWFsYmx1ZTpcIjY1LDEwNSwyMjVcIixzYWRkbGVicm93bjpcIjEzOSw2OSwxOVwiLHNhbG1vbjpcIjI1MCwxMjgsMTE0XCIsc2FuZHlicm93bjpcIjI0NCwxNjQsOTZcIixzZWFncmVlbjpcIjQ2LDEzOSw4N1wiLHNlYXNoZWxsOlwiMjU1LDI0NSwyMzhcIixzaWVubmE6XCIxNjAsODIsNDVcIixzaWx2ZXI6XCIxOTIsMTkyLDE5MlwiLHNreWJsdWU6XCIxMzUsMjA2LDIzNVwiLHNsYXRlYmx1ZTpcIjEwNiw5MCwyMDVcIixzbGF0ZWdyYXk6XCIxMTIsMTI4LDE0NFwiLHNub3c6XCIyNTUsMjUwLDI1MFwiLHNwcmluZ2dyZWVuOlwiMCwyNTUsMTI3XCIsc3RlZWxibHVlOlwiNzAsMTMwLDE4MFwiLHRhbjpcIjIxMCwxODAsMTQwXCIsdGVhbDpcIjAsMTI4LDEyOFwiLHRoaXN0bGU6XCIyMTYsMTkxLDIxNlwiLHRvbWF0bzpcIjI1NSw5OSw3MVwiLHR1cnF1b2lzZTpcIjY0LDIyNCwyMDhcIix2aW9sZXQ6XCIyMzgsMTMwLDIzOFwiLHdoZWF0OlwiMjQ1LDIyMiwxNzlcIix3aGl0ZXNtb2tlOlwiMjQ1LDI0NSwyNDVcIix3aGl0ZTpcIjI1NSwyNTUsMjU1XCIseWVsbG93Z3JlZW46XCIxNTQsMjA1LDUwXCIseWVsbG93OlwiMjU1LDI1NSwwXCJ9fSxIb29rczp7dGVtcGxhdGVzOnt0ZXh0U2hhZG93OltcIkNvbG9yIFggWSBCbHVyXCIsXCJibGFjayAwcHggMHB4IDBweFwiXSxib3hTaGFkb3c6W1wiQ29sb3IgWCBZIEJsdXIgU3ByZWFkXCIsXCJibGFjayAwcHggMHB4IDBweCAwcHhcIl0sY2xpcDpbXCJUb3AgUmlnaHQgQm90dG9tIExlZnRcIixcIjBweCAwcHggMHB4IDBweFwiXSxiYWNrZ3JvdW5kUG9zaXRpb246W1wiWCBZXCIsXCIwJSAwJVwiXSx0cmFuc2Zvcm1PcmlnaW46W1wiWCBZIFpcIixcIjUwJSA1MCUgMHB4XCJdLHBlcnNwZWN0aXZlT3JpZ2luOltcIlggWVwiLFwiNTAlIDUwJVwiXX0scmVnaXN0ZXJlZDp7fSxyZWdpc3RlcjpmdW5jdGlvbigpe2Zvcih2YXIgYT0wO2E8QS5MaXN0cy5jb2xvcnMubGVuZ3RoO2ErKyl7dmFyIGI9XCJjb2xvclwiPT09QS5MaXN0cy5jb2xvcnNbYV0/XCIwIDAgMCAxXCI6XCIyNTUgMjU1IDI1NSAxXCI7QS5Ib29rcy50ZW1wbGF0ZXNbQS5MaXN0cy5jb2xvcnNbYV1dPVtcIlJlZCBHcmVlbiBCbHVlIEFscGhhXCIsYl19dmFyIGMsZCxlO2lmKHApZm9yKGMgaW4gQS5Ib29rcy50ZW1wbGF0ZXMpaWYoQS5Ib29rcy50ZW1wbGF0ZXMuaGFzT3duUHJvcGVydHkoYykpe2Q9QS5Ib29rcy50ZW1wbGF0ZXNbY10sZT1kWzBdLnNwbGl0KFwiIFwiKTt2YXIgZj1kWzFdLm1hdGNoKEEuUmVnRXgudmFsdWVTcGxpdCk7XCJDb2xvclwiPT09ZVswXSYmKGUucHVzaChlLnNoaWZ0KCkpLGYucHVzaChmLnNoaWZ0KCkpLEEuSG9va3MudGVtcGxhdGVzW2NdPVtlLmpvaW4oXCIgXCIpLGYuam9pbihcIiBcIildKX1mb3IoYyBpbiBBLkhvb2tzLnRlbXBsYXRlcylpZihBLkhvb2tzLnRlbXBsYXRlcy5oYXNPd25Qcm9wZXJ0eShjKSl7ZD1BLkhvb2tzLnRlbXBsYXRlc1tjXSxlPWRbMF0uc3BsaXQoXCIgXCIpO2Zvcih2YXIgZyBpbiBlKWlmKGUuaGFzT3duUHJvcGVydHkoZykpe3ZhciBoPWMrZVtnXSxpPWc7QS5Ib29rcy5yZWdpc3RlcmVkW2hdPVtjLGldfX19LGdldFJvb3Q6ZnVuY3Rpb24oYSl7dmFyIGI9QS5Ib29rcy5yZWdpc3RlcmVkW2FdO3JldHVybiBiP2JbMF06YX0sZ2V0VW5pdDpmdW5jdGlvbihhLGIpe3ZhciBjPShhLnN1YnN0cihifHwwLDUpLm1hdGNoKC9eW2EteiVdKy8pfHxbXSlbMF18fFwiXCI7cmV0dXJuIGMmJnQoQS5MaXN0cy51bml0cyxjKT9jOlwiXCJ9LGZpeENvbG9yczpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKC8ocmdiYT9cXChcXHMqKT8oXFxiW2Etel0rXFxiKS9nLGZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gQS5MaXN0cy5jb2xvck5hbWVzLmhhc093blByb3BlcnR5KGMpPyhiP2I6XCJyZ2JhKFwiKStBLkxpc3RzLmNvbG9yTmFtZXNbY10rKGI/XCJcIjpcIiwxKVwiKTpiK2N9KX0sY2xlYW5Sb290UHJvcGVydHlWYWx1ZTpmdW5jdGlvbihhLGIpe3JldHVybiBBLlJlZ0V4LnZhbHVlVW53cmFwLnRlc3QoYikmJihiPWIubWF0Y2goQS5SZWdFeC52YWx1ZVVud3JhcClbMV0pLEEuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKGIpJiYoYj1BLkhvb2tzLnRlbXBsYXRlc1thXVsxXSksYn0sZXh0cmFjdFZhbHVlOmZ1bmN0aW9uKGEsYil7dmFyIGM9QS5Ib29rcy5yZWdpc3RlcmVkW2FdO2lmKGMpe3ZhciBkPWNbMF0sZT1jWzFdO3JldHVybiBiPUEuSG9va3MuY2xlYW5Sb290UHJvcGVydHlWYWx1ZShkLGIpLGIudG9TdHJpbmcoKS5tYXRjaChBLlJlZ0V4LnZhbHVlU3BsaXQpW2VdfXJldHVybiBifSxpbmplY3RWYWx1ZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9QS5Ib29rcy5yZWdpc3RlcmVkW2FdO2lmKGQpe3ZhciBlLGY9ZFswXSxnPWRbMV07cmV0dXJuIGM9QS5Ib29rcy5jbGVhblJvb3RQcm9wZXJ0eVZhbHVlKGYsYyksZT1jLnRvU3RyaW5nKCkubWF0Y2goQS5SZWdFeC52YWx1ZVNwbGl0KSxlW2ddPWIsZS5qb2luKFwiIFwiKX1yZXR1cm4gY319LE5vcm1hbGl6YXRpb25zOntyZWdpc3RlcmVkOntjbGlwOmZ1bmN0aW9uKGEsYixjKXtzd2l0Y2goYSl7Y2FzZVwibmFtZVwiOnJldHVyblwiY2xpcFwiO2Nhc2VcImV4dHJhY3RcIjp2YXIgZDtyZXR1cm4gQS5SZWdFeC53cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkLnRlc3QoYyk/ZD1jOihkPWMudG9TdHJpbmcoKS5tYXRjaChBLlJlZ0V4LnZhbHVlVW53cmFwKSxkPWQ/ZFsxXS5yZXBsYWNlKC8sKFxccyspPy9nLFwiIFwiKTpjKSxkO2Nhc2VcImluamVjdFwiOnJldHVyblwicmVjdChcIitjK1wiKVwifX0sYmx1cjpmdW5jdGlvbihhLGIsYyl7c3dpdGNoKGEpe2Nhc2VcIm5hbWVcIjpyZXR1cm4geS5TdGF0ZS5pc0ZpcmVmb3g/XCJmaWx0ZXJcIjpcIi13ZWJraXQtZmlsdGVyXCI7Y2FzZVwiZXh0cmFjdFwiOnZhciBkPXBhcnNlRmxvYXQoYyk7aWYoIWQmJjAhPT1kKXt2YXIgZT1jLnRvU3RyaW5nKCkubWF0Y2goL2JsdXJcXCgoWzAtOV0rW0Etel0rKVxcKS9pKTtkPWU/ZVsxXTowfXJldHVybiBkO2Nhc2VcImluamVjdFwiOnJldHVybiBwYXJzZUZsb2F0KGMpP1wiYmx1cihcIitjK1wiKVwiOlwibm9uZVwifX0sb3BhY2l0eTpmdW5jdGlvbihhLGIsYyl7aWYocDw9OClzd2l0Y2goYSl7Y2FzZVwibmFtZVwiOnJldHVyblwiZmlsdGVyXCI7Y2FzZVwiZXh0cmFjdFwiOnZhciBkPWMudG9TdHJpbmcoKS5tYXRjaCgvYWxwaGFcXChvcGFjaXR5PSguKilcXCkvaSk7cmV0dXJuIGM9ZD9kWzFdLzEwMDoxO2Nhc2VcImluamVjdFwiOnJldHVybiBiLnN0eWxlLnpvb209MSxwYXJzZUZsb2F0KGMpPj0xP1wiXCI6XCJhbHBoYShvcGFjaXR5PVwiK3BhcnNlSW50KDEwMCpwYXJzZUZsb2F0KGMpLDEwKStcIilcIn1lbHNlIHN3aXRjaChhKXtjYXNlXCJuYW1lXCI6cmV0dXJuXCJvcGFjaXR5XCI7Y2FzZVwiZXh0cmFjdFwiOnJldHVybiBjO2Nhc2VcImluamVjdFwiOnJldHVybiBjfX19LHJlZ2lzdGVyOmZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhLGIsYyl7aWYoXCJib3JkZXItYm94XCI9PT1BLmdldFByb3BlcnR5VmFsdWUoYixcImJveFNpemluZ1wiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk9PT0oY3x8ITEpKXt2YXIgZCxlLGY9MCxnPVwid2lkdGhcIj09PWE/W1wiTGVmdFwiLFwiUmlnaHRcIl06W1wiVG9wXCIsXCJCb3R0b21cIl0saD1bXCJwYWRkaW5nXCIrZ1swXSxcInBhZGRpbmdcIitnWzFdLFwiYm9yZGVyXCIrZ1swXStcIldpZHRoXCIsXCJib3JkZXJcIitnWzFdK1wiV2lkdGhcIl07Zm9yKGQ9MDtkPGgubGVuZ3RoO2QrKyllPXBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGIsaFtkXSkpLGlzTmFOKGUpfHwoZis9ZSk7cmV0dXJuIGM/LWY6Zn1yZXR1cm4gMH1mdW5jdGlvbiBiKGIsYyl7cmV0dXJuIGZ1bmN0aW9uKGQsZSxmKXtzd2l0Y2goZCl7Y2FzZVwibmFtZVwiOnJldHVybiBiO2Nhc2VcImV4dHJhY3RcIjpyZXR1cm4gcGFyc2VGbG9hdChmKSthKGIsZSxjKTtjYXNlXCJpbmplY3RcIjpyZXR1cm4gcGFyc2VGbG9hdChmKS1hKGIsZSxjKStcInB4XCJ9fX1wJiYhKHA+OSl8fHkuU3RhdGUuaXNHaW5nZXJicmVhZHx8KEEuTGlzdHMudHJhbnNmb3Jtc0Jhc2U9QS5MaXN0cy50cmFuc2Zvcm1zQmFzZS5jb25jYXQoQS5MaXN0cy50cmFuc2Zvcm1zM0QpKTtmb3IodmFyIGM9MDtjPEEuTGlzdHMudHJhbnNmb3Jtc0Jhc2UubGVuZ3RoO2MrKykhZnVuY3Rpb24oKXt2YXIgYT1BLkxpc3RzLnRyYW5zZm9ybXNCYXNlW2NdO0EuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFthXT1mdW5jdGlvbihiLGMsZSl7c3dpdGNoKGIpe2Nhc2VcIm5hbWVcIjpyZXR1cm5cInRyYW5zZm9ybVwiO2Nhc2VcImV4dHJhY3RcIjpyZXR1cm4gZyhjKT09PWR8fGcoYykudHJhbnNmb3JtQ2FjaGVbYV09PT1kPy9ec2NhbGUvaS50ZXN0KGEpPzE6MDpnKGMpLnRyYW5zZm9ybUNhY2hlW2FdLnJlcGxhY2UoL1soKV0vZyxcIlwiKTtjYXNlXCJpbmplY3RcIjp2YXIgZj0hMTtzd2l0Y2goYS5zdWJzdHIoMCxhLmxlbmd0aC0xKSl7Y2FzZVwidHJhbnNsYXRlXCI6Zj0hLyglfHB4fGVtfHJlbXx2d3x2aHxcXGQpJC9pLnRlc3QoZSk7YnJlYWs7Y2FzZVwic2NhbFwiOmNhc2VcInNjYWxlXCI6eS5TdGF0ZS5pc0FuZHJvaWQmJmcoYykudHJhbnNmb3JtQ2FjaGVbYV09PT1kJiZlPDEmJihlPTEpLGY9IS8oXFxkKSQvaS50ZXN0KGUpO2JyZWFrO2Nhc2VcInNrZXdcIjpmPSEvKGRlZ3xcXGQpJC9pLnRlc3QoZSk7YnJlYWs7Y2FzZVwicm90YXRlXCI6Zj0hLyhkZWd8XFxkKSQvaS50ZXN0KGUpfXJldHVybiBmfHwoZyhjKS50cmFuc2Zvcm1DYWNoZVthXT1cIihcIitlK1wiKVwiKSxnKGMpLnRyYW5zZm9ybUNhY2hlW2FdfX19KCk7Zm9yKHZhciBlPTA7ZTxBLkxpc3RzLmNvbG9ycy5sZW5ndGg7ZSsrKSFmdW5jdGlvbigpe3ZhciBhPUEuTGlzdHMuY29sb3JzW2VdO0EuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFthXT1mdW5jdGlvbihiLGMsZSl7c3dpdGNoKGIpe2Nhc2VcIm5hbWVcIjpyZXR1cm4gYTtjYXNlXCJleHRyYWN0XCI6dmFyIGY7aWYoQS5SZWdFeC53cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkLnRlc3QoZSkpZj1lO2Vsc2V7dmFyIGcsaD17YmxhY2s6XCJyZ2IoMCwgMCwgMClcIixibHVlOlwicmdiKDAsIDAsIDI1NSlcIixncmF5OlwicmdiKDEyOCwgMTI4LCAxMjgpXCIsZ3JlZW46XCJyZ2IoMCwgMTI4LCAwKVwiLHJlZDpcInJnYigyNTUsIDAsIDApXCIsd2hpdGU6XCJyZ2IoMjU1LCAyNTUsIDI1NSlcIn07L15bQS16XSskL2kudGVzdChlKT9nPWhbZV0hPT1kP2hbZV06aC5ibGFjazpBLlJlZ0V4LmlzSGV4LnRlc3QoZSk/Zz1cInJnYihcIitBLlZhbHVlcy5oZXhUb1JnYihlKS5qb2luKFwiIFwiKStcIilcIjovXnJnYmE/XFwoL2kudGVzdChlKXx8KGc9aC5ibGFjayksZj0oZ3x8ZSkudG9TdHJpbmcoKS5tYXRjaChBLlJlZ0V4LnZhbHVlVW53cmFwKVsxXS5yZXBsYWNlKC8sKFxccyspPy9nLFwiIFwiKX1yZXR1cm4oIXB8fHA+OCkmJjM9PT1mLnNwbGl0KFwiIFwiKS5sZW5ndGgmJihmKz1cIiAxXCIpLGY7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuL15yZ2IvLnRlc3QoZSk/ZToocDw9OD80PT09ZS5zcGxpdChcIiBcIikubGVuZ3RoJiYoZT1lLnNwbGl0KC9cXHMrLykuc2xpY2UoMCwzKS5qb2luKFwiIFwiKSk6Mz09PWUuc3BsaXQoXCIgXCIpLmxlbmd0aCYmKGUrPVwiIDFcIiksKHA8PTg/XCJyZ2JcIjpcInJnYmFcIikrXCIoXCIrZS5yZXBsYWNlKC9cXHMrL2csXCIsXCIpLnJlcGxhY2UoL1xcLihcXGQpKyg/PSwpL2csXCJcIikrXCIpXCIpfX19KCk7QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkLmlubmVyV2lkdGg9YihcIndpZHRoXCIsITApLEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5pbm5lckhlaWdodD1iKFwiaGVpZ2h0XCIsITApLEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5vdXRlcldpZHRoPWIoXCJ3aWR0aFwiKSxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQub3V0ZXJIZWlnaHQ9YihcImhlaWdodFwiKX19LE5hbWVzOntjYW1lbENhc2U6ZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVwbGFjZSgvLShcXHcpL2csZnVuY3Rpb24oYSxiKXtyZXR1cm4gYi50b1VwcGVyQ2FzZSgpfSl9LFNWR0F0dHJpYnV0ZTpmdW5jdGlvbihhKXt2YXIgYj1cIndpZHRofGhlaWdodHx4fHl8Y3h8Y3l8cnxyeHxyeXx4MXx4Mnx5MXx5MlwiO3JldHVybihwfHx5LlN0YXRlLmlzQW5kcm9pZCYmIXkuU3RhdGUuaXNDaHJvbWUpJiYoYis9XCJ8dHJhbnNmb3JtXCIpLG5ldyBSZWdFeHAoXCJeKFwiK2IrXCIpJFwiLFwiaVwiKS50ZXN0KGEpfSxwcmVmaXhDaGVjazpmdW5jdGlvbihhKXtpZih5LlN0YXRlLnByZWZpeE1hdGNoZXNbYV0pcmV0dXJuW3kuU3RhdGUucHJlZml4TWF0Y2hlc1thXSwhMF07Zm9yKHZhciBiPVtcIlwiLFwiV2Via2l0XCIsXCJNb3pcIixcIm1zXCIsXCJPXCJdLGM9MCxkPWIubGVuZ3RoO2M8ZDtjKyspe3ZhciBlO2lmKGU9MD09PWM/YTpiW2NdK2EucmVwbGFjZSgvXlxcdy8sZnVuY3Rpb24oYSl7cmV0dXJuIGEudG9VcHBlckNhc2UoKX0pLHUuaXNTdHJpbmcoeS5TdGF0ZS5wcmVmaXhFbGVtZW50LnN0eWxlW2VdKSlyZXR1cm4geS5TdGF0ZS5wcmVmaXhNYXRjaGVzW2FdPWUsW2UsITBdfXJldHVyblthLCExXX19LFZhbHVlczp7aGV4VG9SZ2I6ZnVuY3Rpb24oYSl7dmFyIGIsYz0vXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pO3JldHVybiBhPWEucmVwbGFjZSgvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pLGZ1bmN0aW9uKGEsYixjLGQpe3JldHVybiBiK2IrYytjK2QrZH0pLGI9Yy5leGVjKGEpLGI/W3BhcnNlSW50KGJbMV0sMTYpLHBhcnNlSW50KGJbMl0sMTYpLHBhcnNlSW50KGJbM10sMTYpXTpbMCwwLDBdfSxpc0NTU051bGxWYWx1ZTpmdW5jdGlvbihhKXtyZXR1cm4hYXx8L14obm9uZXxhdXRvfHRyYW5zcGFyZW50fChyZ2JhXFwoMCwgPzAsID8wLCA/MFxcKSkpJC9pLnRlc3QoYSl9LGdldFVuaXRUeXBlOmZ1bmN0aW9uKGEpe3JldHVybi9eKHJvdGF0ZXxza2V3KS9pLnRlc3QoYSk/XCJkZWdcIjovKF4oc2NhbGV8c2NhbGVYfHNjYWxlWXxzY2FsZVp8YWxwaGF8ZmxleEdyb3d8ZmxleEhlaWdodHx6SW5kZXh8Zm9udFdlaWdodCkkKXwoKG9wYWNpdHl8cmVkfGdyZWVufGJsdWV8YWxwaGEpJCkvaS50ZXN0KGEpP1wiXCI6XCJweFwifSxnZXREaXNwbGF5VHlwZTpmdW5jdGlvbihhKXt2YXIgYj1hJiZhLnRhZ05hbWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO3JldHVybi9eKGJ8YmlnfGl8c21hbGx8dHR8YWJicnxhY3JvbnltfGNpdGV8Y29kZXxkZm58ZW18a2JkfHN0cm9uZ3xzYW1wfHZhcnxhfGJkb3xicnxpbWd8bWFwfG9iamVjdHxxfHNjcmlwdHxzcGFufHN1YnxzdXB8YnV0dG9ufGlucHV0fGxhYmVsfHNlbGVjdHx0ZXh0YXJlYSkkL2kudGVzdChiKT9cImlubGluZVwiOi9eKGxpKSQvaS50ZXN0KGIpP1wibGlzdC1pdGVtXCI6L14odHIpJC9pLnRlc3QoYik/XCJ0YWJsZS1yb3dcIjovXih0YWJsZSkkL2kudGVzdChiKT9cInRhYmxlXCI6L14odGJvZHkpJC9pLnRlc3QoYik/XCJ0YWJsZS1yb3ctZ3JvdXBcIjpcImJsb2NrXCJ9LGFkZENsYXNzOmZ1bmN0aW9uKGEsYil7aWYoYSlpZihhLmNsYXNzTGlzdClhLmNsYXNzTGlzdC5hZGQoYik7ZWxzZSBpZih1LmlzU3RyaW5nKGEuY2xhc3NOYW1lKSlhLmNsYXNzTmFtZSs9KGEuY2xhc3NOYW1lLmxlbmd0aD9cIiBcIjpcIlwiKStiO2Vsc2V7dmFyIGM9YS5nZXRBdHRyaWJ1dGUocDw9Nz9cImNsYXNzTmFtZVwiOlwiY2xhc3NcIil8fFwiXCI7YS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLGMrKGM/XCIgXCI6XCJcIikrYil9fSxyZW1vdmVDbGFzczpmdW5jdGlvbihhLGIpe2lmKGEpaWYoYS5jbGFzc0xpc3QpYS5jbGFzc0xpc3QucmVtb3ZlKGIpO2Vsc2UgaWYodS5pc1N0cmluZyhhLmNsYXNzTmFtZSkpYS5jbGFzc05hbWU9YS5jbGFzc05hbWUudG9TdHJpbmcoKS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxcXFxccylcIitiLnNwbGl0KFwiIFwiKS5qb2luKFwifFwiKStcIihcXFxcc3wkKVwiLFwiZ2lcIiksXCIgXCIpO2Vsc2V7dmFyIGM9YS5nZXRBdHRyaWJ1dGUocDw9Nz9cImNsYXNzTmFtZVwiOlwiY2xhc3NcIil8fFwiXCI7YS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLGMucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58cylcIitiLnNwbGl0KFwiIFwiKS5qb2luKFwifFwiKStcIihzfCQpXCIsXCJnaVwiKSxcIiBcIikpfX19LGdldFByb3BlcnR5VmFsdWU6ZnVuY3Rpb24oYSxjLGUsZil7ZnVuY3Rpb24gaChhLGMpe3ZhciBlPTA7aWYocDw9OCllPW8uY3NzKGEsYyk7ZWxzZXt2YXIgaT0hMTsvXih3aWR0aHxoZWlnaHQpJC8udGVzdChjKSYmMD09PUEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiZGlzcGxheVwiKSYmKGk9ITAsQS5zZXRQcm9wZXJ0eVZhbHVlKGEsXCJkaXNwbGF5XCIsQS5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoYSkpKTt2YXIgaj1mdW5jdGlvbigpe2kmJkEuc2V0UHJvcGVydHlWYWx1ZShhLFwiZGlzcGxheVwiLFwibm9uZVwiKX07aWYoIWYpe2lmKFwiaGVpZ2h0XCI9PT1jJiZcImJvcmRlci1ib3hcIiE9PUEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSl7dmFyIGs9YS5vZmZzZXRIZWlnaHQtKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3JkZXJUb3BXaWR0aFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm9yZGVyQm90dG9tV2lkdGhcIikpfHwwKS0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcInBhZGRpbmdUb3BcIikpfHwwKS0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcInBhZGRpbmdCb3R0b21cIikpfHwwKTtyZXR1cm4gaigpLGt9aWYoXCJ3aWR0aFwiPT09YyYmXCJib3JkZXItYm94XCIhPT1BLmdldFByb3BlcnR5VmFsdWUoYSxcImJveFNpemluZ1wiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpe3ZhciBsPWEub2Zmc2V0V2lkdGgtKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3JkZXJMZWZ0V2lkdGhcIikpfHwwKS0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcImJvcmRlclJpZ2h0V2lkdGhcIikpfHwwKS0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcInBhZGRpbmdMZWZ0XCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJwYWRkaW5nUmlnaHRcIikpfHwwKTtyZXR1cm4gaigpLGx9fXZhciBtO209ZyhhKT09PWQ/Yi5nZXRDb21wdXRlZFN0eWxlKGEsbnVsbCk6ZyhhKS5jb21wdXRlZFN0eWxlP2coYSkuY29tcHV0ZWRTdHlsZTpnKGEpLmNvbXB1dGVkU3R5bGU9Yi5nZXRDb21wdXRlZFN0eWxlKGEsbnVsbCksXCJib3JkZXJDb2xvclwiPT09YyYmKGM9XCJib3JkZXJUb3BDb2xvclwiKSxlPTk9PT1wJiZcImZpbHRlclwiPT09Yz9tLmdldFByb3BlcnR5VmFsdWUoYyk6bVtjXSxcIlwiIT09ZSYmbnVsbCE9PWV8fChlPWEuc3R5bGVbY10pLGooKX1pZihcImF1dG9cIj09PWUmJi9eKHRvcHxyaWdodHxib3R0b218bGVmdCkkL2kudGVzdChjKSl7dmFyIG49aChhLFwicG9zaXRpb25cIik7KFwiZml4ZWRcIj09PW58fFwiYWJzb2x1dGVcIj09PW4mJi90b3B8bGVmdC9pLnRlc3QoYykpJiYoZT1vKGEpLnBvc2l0aW9uKClbY10rXCJweFwiKX1yZXR1cm4gZX12YXIgaTtpZihBLkhvb2tzLnJlZ2lzdGVyZWRbY10pe3ZhciBqPWMsaz1BLkhvb2tzLmdldFJvb3Qoaik7ZT09PWQmJihlPUEuZ2V0UHJvcGVydHlWYWx1ZShhLEEuTmFtZXMucHJlZml4Q2hlY2soaylbMF0pKSxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRba10mJihlPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtrXShcImV4dHJhY3RcIixhLGUpKSxpPUEuSG9va3MuZXh0cmFjdFZhbHVlKGosZSl9ZWxzZSBpZihBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10pe3ZhciBsLG07bD1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJuYW1lXCIsYSksXCJ0cmFuc2Zvcm1cIiE9PWwmJihtPWgoYSxBLk5hbWVzLnByZWZpeENoZWNrKGwpWzBdKSxBLlZhbHVlcy5pc0NTU051bGxWYWx1ZShtKSYmQS5Ib29rcy50ZW1wbGF0ZXNbY10mJihtPUEuSG9va3MudGVtcGxhdGVzW2NdWzFdKSksaT1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJleHRyYWN0XCIsYSxtKX1pZighL15bXFxkLV0vLnRlc3QoaSkpe3ZhciBuPWcoYSk7aWYobiYmbi5pc1NWRyYmQS5OYW1lcy5TVkdBdHRyaWJ1dGUoYykpaWYoL14oaGVpZ2h0fHdpZHRoKSQvaS50ZXN0KGMpKXRyeXtpPWEuZ2V0QkJveCgpW2NdfWNhdGNoKHEpe2k9MH1lbHNlIGk9YS5nZXRBdHRyaWJ1dGUoYyk7ZWxzZSBpPWgoYSxBLk5hbWVzLnByZWZpeENoZWNrKGMpWzBdKX1yZXR1cm4gQS5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUoaSkmJihpPTApLHkuZGVidWc+PTImJmNvbnNvbGUubG9nKFwiR2V0IFwiK2MrXCI6IFwiK2kpLGl9LHNldFByb3BlcnR5VmFsdWU6ZnVuY3Rpb24oYSxjLGQsZSxmKXt2YXIgaD1jO2lmKFwic2Nyb2xsXCI9PT1jKWYuY29udGFpbmVyP2YuY29udGFpbmVyW1wic2Nyb2xsXCIrZi5kaXJlY3Rpb25dPWQ6XCJMZWZ0XCI9PT1mLmRpcmVjdGlvbj9iLnNjcm9sbFRvKGQsZi5hbHRlcm5hdGVWYWx1ZSk6Yi5zY3JvbGxUbyhmLmFsdGVybmF0ZVZhbHVlLGQpO2Vsc2UgaWYoQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdJiZcInRyYW5zZm9ybVwiPT09QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwibmFtZVwiLGEpKUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcImluamVjdFwiLGEsZCksaD1cInRyYW5zZm9ybVwiLGQ9ZyhhKS50cmFuc2Zvcm1DYWNoZVtjXTtlbHNle2lmKEEuSG9va3MucmVnaXN0ZXJlZFtjXSl7dmFyIGk9YyxqPUEuSG9va3MuZ2V0Um9vdChjKTtlPWV8fEEuZ2V0UHJvcGVydHlWYWx1ZShhLGopLGQ9QS5Ib29rcy5pbmplY3RWYWx1ZShpLGQsZSksYz1qfWlmKEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXSYmKGQ9QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwiaW5qZWN0XCIsYSxkKSxjPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcIm5hbWVcIixhKSksaD1BLk5hbWVzLnByZWZpeENoZWNrKGMpWzBdLHA8PTgpdHJ5e2Euc3R5bGVbaF09ZH1jYXRjaChsKXt5LmRlYnVnJiZjb25zb2xlLmxvZyhcIkJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBbXCIrZCtcIl0gZm9yIFtcIitoK1wiXVwiKX1lbHNle3ZhciBrPWcoYSk7ayYmay5pc1NWRyYmQS5OYW1lcy5TVkdBdHRyaWJ1dGUoYyk/YS5zZXRBdHRyaWJ1dGUoYyxkKTphLnN0eWxlW2hdPWR9eS5kZWJ1Zz49MiYmY29uc29sZS5sb2coXCJTZXQgXCIrYytcIiAoXCIraCtcIik6IFwiK2QpfXJldHVybltoLGRdfSxmbHVzaFRyYW5zZm9ybUNhY2hlOmZ1bmN0aW9uKGEpe3ZhciBiPVwiXCIsYz1nKGEpO2lmKChwfHx5LlN0YXRlLmlzQW5kcm9pZCYmIXkuU3RhdGUuaXNDaHJvbWUpJiZjJiZjLmlzU1ZHKXt2YXIgZD1mdW5jdGlvbihiKXtyZXR1cm4gcGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxiKSl9LGU9e3RyYW5zbGF0ZTpbZChcInRyYW5zbGF0ZVhcIiksZChcInRyYW5zbGF0ZVlcIildLHNrZXdYOltkKFwic2tld1hcIildLHNrZXdZOltkKFwic2tld1lcIildLHNjYWxlOjEhPT1kKFwic2NhbGVcIik/W2QoXCJzY2FsZVwiKSxkKFwic2NhbGVcIildOltkKFwic2NhbGVYXCIpLGQoXCJzY2FsZVlcIildLHJvdGF0ZTpbZChcInJvdGF0ZVpcIiksMCwwXX07by5lYWNoKGcoYSkudHJhbnNmb3JtQ2FjaGUsZnVuY3Rpb24oYSl7L150cmFuc2xhdGUvaS50ZXN0KGEpP2E9XCJ0cmFuc2xhdGVcIjovXnNjYWxlL2kudGVzdChhKT9hPVwic2NhbGVcIjovXnJvdGF0ZS9pLnRlc3QoYSkmJihhPVwicm90YXRlXCIpLGVbYV0mJihiKz1hK1wiKFwiK2VbYV0uam9pbihcIiBcIikrXCIpIFwiLGRlbGV0ZSBlW2FdKX0pfWVsc2V7dmFyIGYsaDtvLmVhY2goZyhhKS50cmFuc2Zvcm1DYWNoZSxmdW5jdGlvbihjKXtpZihmPWcoYSkudHJhbnNmb3JtQ2FjaGVbY10sXCJ0cmFuc2Zvcm1QZXJzcGVjdGl2ZVwiPT09YylyZXR1cm4gaD1mLCEwOzk9PT1wJiZcInJvdGF0ZVpcIj09PWMmJihjPVwicm90YXRlXCIpLGIrPWMrZitcIiBcIn0pLGgmJihiPVwicGVyc3BlY3RpdmVcIitoK1wiIFwiK2IpfUEuc2V0UHJvcGVydHlWYWx1ZShhLFwidHJhbnNmb3JtXCIsYil9fTtBLkhvb2tzLnJlZ2lzdGVyKCksQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcigpLHkuaG9vaz1mdW5jdGlvbihhLGIsYyl7dmFyIGU7cmV0dXJuIGE9ZihhKSxvLmVhY2goYSxmdW5jdGlvbihhLGYpe2lmKGcoZik9PT1kJiZ5LmluaXQoZiksYz09PWQpZT09PWQmJihlPUEuZ2V0UHJvcGVydHlWYWx1ZShmLGIpKTtlbHNle3ZhciBoPUEuc2V0UHJvcGVydHlWYWx1ZShmLGIsYyk7XCJ0cmFuc2Zvcm1cIj09PWhbMF0mJnkuQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoZiksZT1ofX0pLGV9O3ZhciBCPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYSgpe3JldHVybiBrP3oucHJvbWlzZXx8bnVsbDpwfWZ1bmN0aW9uIGUoYSxlKXtmdW5jdGlvbiBmKGYpe3ZhciBrLG47aWYoaS5iZWdpbiYmMD09PUQpdHJ5e2kuYmVnaW4uY2FsbChyLHIpfWNhdGNoKFYpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0aHJvdyBWfSwxKX1pZihcInNjcm9sbFwiPT09Ryl7dmFyIHAscSx3LHg9L154JC9pLnRlc3QoaS5heGlzKT9cIkxlZnRcIjpcIlRvcFwiLEI9cGFyc2VGbG9hdChpLm9mZnNldCl8fDA7aS5jb250YWluZXI/dS5pc1dyYXBwZWQoaS5jb250YWluZXIpfHx1LmlzTm9kZShpLmNvbnRhaW5lcik/KGkuY29udGFpbmVyPWkuY29udGFpbmVyWzBdfHxpLmNvbnRhaW5lcixwPWkuY29udGFpbmVyW1wic2Nyb2xsXCIreF0sdz1wK28oYSkucG9zaXRpb24oKVt4LnRvTG93ZXJDYXNlKCldK0IpOmkuY29udGFpbmVyPW51bGw6KHA9eS5TdGF0ZS5zY3JvbGxBbmNob3JbeS5TdGF0ZVtcInNjcm9sbFByb3BlcnR5XCIreF1dLHE9eS5TdGF0ZS5zY3JvbGxBbmNob3JbeS5TdGF0ZVtcInNjcm9sbFByb3BlcnR5XCIrKFwiTGVmdFwiPT09eD9cIlRvcFwiOlwiTGVmdFwiKV1dLHc9byhhKS5vZmZzZXQoKVt4LnRvTG93ZXJDYXNlKCldK0IpLGo9e3Njcm9sbDp7cm9vdFByb3BlcnR5VmFsdWU6ITEsc3RhcnRWYWx1ZTpwLGN1cnJlbnRWYWx1ZTpwLGVuZFZhbHVlOncsdW5pdFR5cGU6XCJcIixlYXNpbmc6aS5lYXNpbmcsc2Nyb2xsRGF0YTp7Y29udGFpbmVyOmkuY29udGFpbmVyLGRpcmVjdGlvbjp4LGFsdGVybmF0ZVZhbHVlOnF9fSxlbGVtZW50OmF9LHkuZGVidWcmJmNvbnNvbGUubG9nKFwidHdlZW5zQ29udGFpbmVyIChzY3JvbGwpOiBcIixqLnNjcm9sbCxhKX1lbHNlIGlmKFwicmV2ZXJzZVwiPT09Ryl7aWYoIShrPWcoYSkpKXJldHVybjtpZighay50d2VlbnNDb250YWluZXIpcmV0dXJuIHZvaWQgby5kZXF1ZXVlKGEsaS5xdWV1ZSk7XCJub25lXCI9PT1rLm9wdHMuZGlzcGxheSYmKGsub3B0cy5kaXNwbGF5PVwiYXV0b1wiKSxcImhpZGRlblwiPT09ay5vcHRzLnZpc2liaWxpdHkmJihrLm9wdHMudmlzaWJpbGl0eT1cInZpc2libGVcIiksay5vcHRzLmxvb3A9ITEsay5vcHRzLmJlZ2luPW51bGwsay5vcHRzLmNvbXBsZXRlPW51bGwsdi5lYXNpbmd8fGRlbGV0ZSBpLmVhc2luZyx2LmR1cmF0aW9ufHxkZWxldGUgaS5kdXJhdGlvbixpPW8uZXh0ZW5kKHt9LGsub3B0cyxpKSxuPW8uZXh0ZW5kKCEwLHt9LGs/ay50d2VlbnNDb250YWluZXI6bnVsbCk7Zm9yKHZhciBFIGluIG4paWYobi5oYXNPd25Qcm9wZXJ0eShFKSYmXCJlbGVtZW50XCIhPT1FKXt2YXIgRj1uW0VdLnN0YXJ0VmFsdWU7bltFXS5zdGFydFZhbHVlPW5bRV0uY3VycmVudFZhbHVlPW5bRV0uZW5kVmFsdWUsbltFXS5lbmRWYWx1ZT1GLHUuaXNFbXB0eU9iamVjdCh2KXx8KG5bRV0uZWFzaW5nPWkuZWFzaW5nKSx5LmRlYnVnJiZjb25zb2xlLmxvZyhcInJldmVyc2UgdHdlZW5zQ29udGFpbmVyIChcIitFK1wiKTogXCIrSlNPTi5zdHJpbmdpZnkobltFXSksYSl9aj1ufWVsc2UgaWYoXCJzdGFydFwiPT09Ryl7az1nKGEpLGsmJmsudHdlZW5zQ29udGFpbmVyJiZrLmlzQW5pbWF0aW5nPT09ITAmJihuPWsudHdlZW5zQ29udGFpbmVyKTt2YXIgSD1mdW5jdGlvbihlLGYpe3ZhciBnLGw9QS5Ib29rcy5nZXRSb290KGUpLG09ITEscD1mWzBdLHE9ZlsxXSxyPWZbMl1cbjtpZighKGsmJmsuaXNTVkd8fFwidHdlZW5cIj09PWx8fEEuTmFtZXMucHJlZml4Q2hlY2sobClbMV0hPT0hMXx8QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2xdIT09ZCkpcmV0dXJuIHZvaWQoeS5kZWJ1ZyYmY29uc29sZS5sb2coXCJTa2lwcGluZyBbXCIrbCtcIl0gZHVlIHRvIGEgbGFjayBvZiBicm93c2VyIHN1cHBvcnQuXCIpKTsoaS5kaXNwbGF5IT09ZCYmbnVsbCE9PWkuZGlzcGxheSYmXCJub25lXCIhPT1pLmRpc3BsYXl8fGkudmlzaWJpbGl0eSE9PWQmJlwiaGlkZGVuXCIhPT1pLnZpc2liaWxpdHkpJiYvb3BhY2l0eXxmaWx0ZXIvLnRlc3QoZSkmJiFyJiYwIT09cCYmKHI9MCksaS5fY2FjaGVWYWx1ZXMmJm4mJm5bZV0/KHI9PT1kJiYocj1uW2VdLmVuZFZhbHVlK25bZV0udW5pdFR5cGUpLG09ay5yb290UHJvcGVydHlWYWx1ZUNhY2hlW2xdKTpBLkhvb2tzLnJlZ2lzdGVyZWRbZV0/cj09PWQ/KG09QS5nZXRQcm9wZXJ0eVZhbHVlKGEsbCkscj1BLmdldFByb3BlcnR5VmFsdWUoYSxlLG0pKTptPUEuSG9va3MudGVtcGxhdGVzW2xdWzFdOnI9PT1kJiYocj1BLmdldFByb3BlcnR5VmFsdWUoYSxlKSk7dmFyIHMsdCx2LHc9ITEseD1mdW5jdGlvbihhLGIpe3ZhciBjLGQ7cmV0dXJuIGQ9KGJ8fFwiMFwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWyVBLXpdKyQvLGZ1bmN0aW9uKGEpe3JldHVybiBjPWEsXCJcIn0pLGN8fChjPUEuVmFsdWVzLmdldFVuaXRUeXBlKGEpKSxbZCxjXX07aWYociE9PXAmJnUuaXNTdHJpbmcocikmJnUuaXNTdHJpbmcocCkpe2c9XCJcIjt2YXIgej0wLEI9MCxDPVtdLEQ9W10sRT0wLEY9MCxHPTA7Zm9yKHI9QS5Ib29rcy5maXhDb2xvcnMocikscD1BLkhvb2tzLmZpeENvbG9ycyhwKTt6PHIubGVuZ3RoJiZCPHAubGVuZ3RoOyl7dmFyIEg9clt6XSxJPXBbQl07aWYoL1tcXGRcXC4tXS8udGVzdChIKSYmL1tcXGRcXC4tXS8udGVzdChJKSl7Zm9yKHZhciBKPUgsSz1JLEw9XCIuXCIsTj1cIi5cIjsrK3o8ci5sZW5ndGg7KXtpZigoSD1yW3pdKT09PUwpTD1cIi4uXCI7ZWxzZSBpZighL1xcZC8udGVzdChIKSlicmVhaztKKz1IfWZvcig7KytCPHAubGVuZ3RoOyl7aWYoKEk9cFtCXSk9PT1OKU49XCIuLlwiO2Vsc2UgaWYoIS9cXGQvLnRlc3QoSSkpYnJlYWs7Sys9SX12YXIgTz1BLkhvb2tzLmdldFVuaXQocix6KSxQPUEuSG9va3MuZ2V0VW5pdChwLEIpO2lmKHorPU8ubGVuZ3RoLEIrPVAubGVuZ3RoLE89PT1QKUo9PT1LP2crPUorTzooZys9XCJ7XCIrQy5sZW5ndGgrKEY/XCIhXCI6XCJcIikrXCJ9XCIrTyxDLnB1c2gocGFyc2VGbG9hdChKKSksRC5wdXNoKHBhcnNlRmxvYXQoSykpKTtlbHNle3ZhciBRPXBhcnNlRmxvYXQoSiksUj1wYXJzZUZsb2F0KEspO2crPShFPDU/XCJjYWxjXCI6XCJcIikrXCIoXCIrKFE/XCJ7XCIrQy5sZW5ndGgrKEY/XCIhXCI6XCJcIikrXCJ9XCI6XCIwXCIpK08rXCIgKyBcIisoUj9cIntcIisoQy5sZW5ndGgrKFE/MTowKSkrKEY/XCIhXCI6XCJcIikrXCJ9XCI6XCIwXCIpK1ArXCIpXCIsUSYmKEMucHVzaChRKSxELnB1c2goMCkpLFImJihDLnB1c2goMCksRC5wdXNoKFIpKX19ZWxzZXtpZihIIT09SSl7RT0wO2JyZWFrfWcrPUgseisrLEIrKywwPT09RSYmXCJjXCI9PT1IfHwxPT09RSYmXCJhXCI9PT1IfHwyPT09RSYmXCJsXCI9PT1IfHwzPT09RSYmXCJjXCI9PT1IfHxFPj00JiZcIihcIj09PUg/RSsrOihFJiZFPDV8fEU+PTQmJlwiKVwiPT09SCYmLS1FPDUpJiYoRT0wKSwwPT09RiYmXCJyXCI9PT1IfHwxPT09RiYmXCJnXCI9PT1IfHwyPT09RiYmXCJiXCI9PT1IfHwzPT09RiYmXCJhXCI9PT1IfHxGPj0zJiZcIihcIj09PUg/KDM9PT1GJiZcImFcIj09PUgmJihHPTEpLEYrKyk6RyYmXCIsXCI9PT1IPysrRz4zJiYoRj1HPTApOihHJiZGPChHPzU6NCl8fEY+PShHPzQ6MykmJlwiKVwiPT09SCYmLS1GPChHPzU6NCkpJiYoRj1HPTApfX16PT09ci5sZW5ndGgmJkI9PT1wLmxlbmd0aHx8KHkuZGVidWcmJmNvbnNvbGUuZXJyb3IoJ1RyeWluZyB0byBwYXR0ZXJuIG1hdGNoIG1pcy1tYXRjaGVkIHN0cmluZ3MgW1wiJytwKydcIiwgXCInK3IrJ1wiXScpLGc9ZCksZyYmKEMubGVuZ3RoPyh5LmRlYnVnJiZjb25zb2xlLmxvZygnUGF0dGVybiBmb3VuZCBcIicrZysnXCIgLT4gJyxDLEQsXCJbXCIrcitcIixcIitwK1wiXVwiKSxyPUMscD1ELHQ9dj1cIlwiKTpnPWQpfWd8fChzPXgoZSxyKSxyPXNbMF0sdj1zWzFdLHM9eChlLHApLHA9c1swXS5yZXBsYWNlKC9eKFsrLVxcLypdKT0vLGZ1bmN0aW9uKGEsYil7cmV0dXJuIHc9YixcIlwifSksdD1zWzFdLHI9cGFyc2VGbG9hdChyKXx8MCxwPXBhcnNlRmxvYXQocCl8fDAsXCIlXCI9PT10JiYoL14oZm9udFNpemV8bGluZUhlaWdodCkkLy50ZXN0KGUpPyhwLz0xMDAsdD1cImVtXCIpOi9ec2NhbGUvLnRlc3QoZSk/KHAvPTEwMCx0PVwiXCIpOi8oUmVkfEdyZWVufEJsdWUpJC9pLnRlc3QoZSkmJihwPXAvMTAwKjI1NSx0PVwiXCIpKSk7aWYoL1tcXC8qXS8udGVzdCh3KSl0PXY7ZWxzZSBpZih2IT09dCYmMCE9PXIpaWYoMD09PXApdD12O2Vsc2V7aD1ofHxmdW5jdGlvbigpe3ZhciBkPXtteVBhcmVudDphLnBhcmVudE5vZGV8fGMuYm9keSxwb3NpdGlvbjpBLmdldFByb3BlcnR5VmFsdWUoYSxcInBvc2l0aW9uXCIpLGZvbnRTaXplOkEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiZm9udFNpemVcIil9LGU9ZC5wb3NpdGlvbj09PU0ubGFzdFBvc2l0aW9uJiZkLm15UGFyZW50PT09TS5sYXN0UGFyZW50LGY9ZC5mb250U2l6ZT09PU0ubGFzdEZvbnRTaXplO00ubGFzdFBhcmVudD1kLm15UGFyZW50LE0ubGFzdFBvc2l0aW9uPWQucG9zaXRpb24sTS5sYXN0Rm9udFNpemU9ZC5mb250U2l6ZTt2YXIgZz17fTtpZihmJiZlKWcuZW1Ub1B4PU0ubGFzdEVtVG9QeCxnLnBlcmNlbnRUb1B4V2lkdGg9TS5sYXN0UGVyY2VudFRvUHhXaWR0aCxnLnBlcmNlbnRUb1B4SGVpZ2h0PU0ubGFzdFBlcmNlbnRUb1B4SGVpZ2h0O2Vsc2V7dmFyIGg9ayYmay5pc1NWRz9jLmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJyZWN0XCIpOmMuY3JlYXRlRWxlbWVudChcImRpdlwiKTt5LmluaXQoaCksZC5teVBhcmVudC5hcHBlbmRDaGlsZChoKSxvLmVhY2goW1wib3ZlcmZsb3dcIixcIm92ZXJmbG93WFwiLFwib3ZlcmZsb3dZXCJdLGZ1bmN0aW9uKGEsYil7eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLGIsXCJoaWRkZW5cIil9KSx5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsXCJwb3NpdGlvblwiLGQucG9zaXRpb24pLHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoaCxcImZvbnRTaXplXCIsZC5mb250U2l6ZSkseS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLFwiYm94U2l6aW5nXCIsXCJjb250ZW50LWJveFwiKSxvLmVhY2goW1wibWluV2lkdGhcIixcIm1heFdpZHRoXCIsXCJ3aWR0aFwiLFwibWluSGVpZ2h0XCIsXCJtYXhIZWlnaHRcIixcImhlaWdodFwiXSxmdW5jdGlvbihhLGIpe3kuQ1NTLnNldFByb3BlcnR5VmFsdWUoaCxiLFwiMTAwJVwiKX0pLHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoaCxcInBhZGRpbmdMZWZ0XCIsXCIxMDBlbVwiKSxnLnBlcmNlbnRUb1B4V2lkdGg9TS5sYXN0UGVyY2VudFRvUHhXaWR0aD0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoaCxcIndpZHRoXCIsbnVsbCwhMCkpfHwxKS8xMDAsZy5wZXJjZW50VG9QeEhlaWdodD1NLmxhc3RQZXJjZW50VG9QeEhlaWdodD0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoaCxcImhlaWdodFwiLG51bGwsITApKXx8MSkvMTAwLGcuZW1Ub1B4PU0ubGFzdEVtVG9QeD0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoaCxcInBhZGRpbmdMZWZ0XCIpKXx8MSkvMTAwLGQubXlQYXJlbnQucmVtb3ZlQ2hpbGQoaCl9cmV0dXJuIG51bGw9PT1NLnJlbVRvUHgmJihNLnJlbVRvUHg9cGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYy5ib2R5LFwiZm9udFNpemVcIikpfHwxNiksbnVsbD09PU0udndUb1B4JiYoTS52d1RvUHg9cGFyc2VGbG9hdChiLmlubmVyV2lkdGgpLzEwMCxNLnZoVG9QeD1wYXJzZUZsb2F0KGIuaW5uZXJIZWlnaHQpLzEwMCksZy5yZW1Ub1B4PU0ucmVtVG9QeCxnLnZ3VG9QeD1NLnZ3VG9QeCxnLnZoVG9QeD1NLnZoVG9QeCx5LmRlYnVnPj0xJiZjb25zb2xlLmxvZyhcIlVuaXQgcmF0aW9zOiBcIitKU09OLnN0cmluZ2lmeShnKSxhKSxnfSgpO3ZhciBTPS9tYXJnaW58cGFkZGluZ3xsZWZ0fHJpZ2h0fHdpZHRofHRleHR8d29yZHxsZXR0ZXIvaS50ZXN0KGUpfHwvWCQvLnRlc3QoZSl8fFwieFwiPT09ZT9cInhcIjpcInlcIjtzd2l0Y2godil7Y2FzZVwiJVwiOnIqPVwieFwiPT09Uz9oLnBlcmNlbnRUb1B4V2lkdGg6aC5wZXJjZW50VG9QeEhlaWdodDticmVhaztjYXNlXCJweFwiOmJyZWFrO2RlZmF1bHQ6cio9aFt2K1wiVG9QeFwiXX1zd2l0Y2godCl7Y2FzZVwiJVwiOnIqPTEvKFwieFwiPT09Uz9oLnBlcmNlbnRUb1B4V2lkdGg6aC5wZXJjZW50VG9QeEhlaWdodCk7YnJlYWs7Y2FzZVwicHhcIjpicmVhaztkZWZhdWx0OnIqPTEvaFt0K1wiVG9QeFwiXX19c3dpdGNoKHcpe2Nhc2VcIitcIjpwPXIrcDticmVhaztjYXNlXCItXCI6cD1yLXA7YnJlYWs7Y2FzZVwiKlwiOnAqPXI7YnJlYWs7Y2FzZVwiL1wiOnA9ci9wfWpbZV09e3Jvb3RQcm9wZXJ0eVZhbHVlOm0sc3RhcnRWYWx1ZTpyLGN1cnJlbnRWYWx1ZTpyLGVuZFZhbHVlOnAsdW5pdFR5cGU6dCxlYXNpbmc6cX0sZyYmKGpbZV0ucGF0dGVybj1nKSx5LmRlYnVnJiZjb25zb2xlLmxvZyhcInR3ZWVuc0NvbnRhaW5lciAoXCIrZStcIik6IFwiK0pTT04uc3RyaW5naWZ5KGpbZV0pLGEpfTtmb3IodmFyIEkgaW4gcylpZihzLmhhc093blByb3BlcnR5KEkpKXt2YXIgSj1BLk5hbWVzLmNhbWVsQ2FzZShJKSxLPWZ1bmN0aW9uKGIsYyl7dmFyIGQsZixnO3JldHVybiB1LmlzRnVuY3Rpb24oYikmJihiPWIuY2FsbChhLGUsQykpLHUuaXNBcnJheShiKT8oZD1iWzBdLCF1LmlzQXJyYXkoYlsxXSkmJi9eW1xcZC1dLy50ZXN0KGJbMV0pfHx1LmlzRnVuY3Rpb24oYlsxXSl8fEEuUmVnRXguaXNIZXgudGVzdChiWzFdKT9nPWJbMV06dS5pc1N0cmluZyhiWzFdKSYmIUEuUmVnRXguaXNIZXgudGVzdChiWzFdKSYmeS5FYXNpbmdzW2JbMV1dfHx1LmlzQXJyYXkoYlsxXSk/KGY9Yz9iWzFdOmwoYlsxXSxpLmR1cmF0aW9uKSxnPWJbMl0pOmc9YlsxXXx8YlsyXSk6ZD1iLGN8fChmPWZ8fGkuZWFzaW5nKSx1LmlzRnVuY3Rpb24oZCkmJihkPWQuY2FsbChhLGUsQykpLHUuaXNGdW5jdGlvbihnKSYmKGc9Zy5jYWxsKGEsZSxDKSksW2R8fDAsZixnXX0oc1tJXSk7aWYodChBLkxpc3RzLmNvbG9ycyxKKSl7dmFyIEw9S1swXSxPPUtbMV0sUD1LWzJdO2lmKEEuUmVnRXguaXNIZXgudGVzdChMKSl7Zm9yKHZhciBRPVtcIlJlZFwiLFwiR3JlZW5cIixcIkJsdWVcIl0sUj1BLlZhbHVlcy5oZXhUb1JnYihMKSxTPVA/QS5WYWx1ZXMuaGV4VG9SZ2IoUCk6ZCxUPTA7VDxRLmxlbmd0aDtUKyspe3ZhciBVPVtSW1RdXTtPJiZVLnB1c2goTyksUyE9PWQmJlUucHVzaChTW1RdKSxIKEorUVtUXSxVKX1jb250aW51ZX19SChKLEspfWouZWxlbWVudD1hfWouZWxlbWVudCYmKEEuVmFsdWVzLmFkZENsYXNzKGEsXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIiksTi5wdXNoKGopLGs9ZyhhKSxrJiYoXCJcIj09PWkucXVldWUmJihrLnR3ZWVuc0NvbnRhaW5lcj1qLGsub3B0cz1pKSxrLmlzQW5pbWF0aW5nPSEwKSxEPT09Qy0xPyh5LlN0YXRlLmNhbGxzLnB1c2goW04scixpLG51bGwsei5yZXNvbHZlcixudWxsLDBdKSx5LlN0YXRlLmlzVGlja2luZz09PSExJiYoeS5TdGF0ZS5pc1RpY2tpbmc9ITAsbSgpKSk6RCsrKX12YXIgaCxpPW8uZXh0ZW5kKHt9LHkuZGVmYXVsdHMsdiksaj17fTtzd2l0Y2goZyhhKT09PWQmJnkuaW5pdChhKSxwYXJzZUZsb2F0KGkuZGVsYXkpJiZpLnF1ZXVlIT09ITEmJm8ucXVldWUoYSxpLnF1ZXVlLGZ1bmN0aW9uKGIpe3kudmVsb2NpdHlRdWV1ZUVudHJ5RmxhZz0hMDt2YXIgYz15LlN0YXRlLmRlbGF5ZWRFbGVtZW50cy5jb3VudCsrO3kuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2NdPWE7dmFyIGQ9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKCl7eS5TdGF0ZS5kZWxheWVkRWxlbWVudHNbYV09ITEsYigpfX0oYyk7ZyhhKS5kZWxheUJlZ2luPShuZXcgRGF0ZSkuZ2V0VGltZSgpLGcoYSkuZGVsYXk9cGFyc2VGbG9hdChpLmRlbGF5KSxnKGEpLmRlbGF5VGltZXI9e3NldFRpbWVvdXQ6c2V0VGltZW91dChiLHBhcnNlRmxvYXQoaS5kZWxheSkpLG5leHQ6ZH19KSxpLmR1cmF0aW9uLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSl7Y2FzZVwiZmFzdFwiOmkuZHVyYXRpb249MjAwO2JyZWFrO2Nhc2VcIm5vcm1hbFwiOmkuZHVyYXRpb249dzticmVhaztjYXNlXCJzbG93XCI6aS5kdXJhdGlvbj02MDA7YnJlYWs7ZGVmYXVsdDppLmR1cmF0aW9uPXBhcnNlRmxvYXQoaS5kdXJhdGlvbil8fDF9aWYoeS5tb2NrIT09ITEmJih5Lm1vY2s9PT0hMD9pLmR1cmF0aW9uPWkuZGVsYXk9MTooaS5kdXJhdGlvbio9cGFyc2VGbG9hdCh5Lm1vY2spfHwxLGkuZGVsYXkqPXBhcnNlRmxvYXQoeS5tb2NrKXx8MSkpLGkuZWFzaW5nPWwoaS5lYXNpbmcsaS5kdXJhdGlvbiksaS5iZWdpbiYmIXUuaXNGdW5jdGlvbihpLmJlZ2luKSYmKGkuYmVnaW49bnVsbCksaS5wcm9ncmVzcyYmIXUuaXNGdW5jdGlvbihpLnByb2dyZXNzKSYmKGkucHJvZ3Jlc3M9bnVsbCksaS5jb21wbGV0ZSYmIXUuaXNGdW5jdGlvbihpLmNvbXBsZXRlKSYmKGkuY29tcGxldGU9bnVsbCksaS5kaXNwbGF5IT09ZCYmbnVsbCE9PWkuZGlzcGxheSYmKGkuZGlzcGxheT1pLmRpc3BsYXkudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLFwiYXV0b1wiPT09aS5kaXNwbGF5JiYoaS5kaXNwbGF5PXkuQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShhKSkpLGkudmlzaWJpbGl0eSE9PWQmJm51bGwhPT1pLnZpc2liaWxpdHkmJihpLnZpc2liaWxpdHk9aS52aXNpYmlsaXR5LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSksaS5tb2JpbGVIQT1pLm1vYmlsZUhBJiZ5LlN0YXRlLmlzTW9iaWxlJiYheS5TdGF0ZS5pc0dpbmdlcmJyZWFkLGkucXVldWU9PT0hMSlpZihpLmRlbGF5KXt2YXIgaz15LlN0YXRlLmRlbGF5ZWRFbGVtZW50cy5jb3VudCsrO3kuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2tdPWE7dmFyIG49ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKCl7eS5TdGF0ZS5kZWxheWVkRWxlbWVudHNbYV09ITEsZigpfX0oayk7ZyhhKS5kZWxheUJlZ2luPShuZXcgRGF0ZSkuZ2V0VGltZSgpLGcoYSkuZGVsYXk9cGFyc2VGbG9hdChpLmRlbGF5KSxnKGEpLmRlbGF5VGltZXI9e3NldFRpbWVvdXQ6c2V0VGltZW91dChmLHBhcnNlRmxvYXQoaS5kZWxheSkpLG5leHQ6bn19ZWxzZSBmKCk7ZWxzZSBvLnF1ZXVlKGEsaS5xdWV1ZSxmdW5jdGlvbihhLGIpe2lmKGI9PT0hMClyZXR1cm4gei5wcm9taXNlJiZ6LnJlc29sdmVyKHIpLCEwO3kudmVsb2NpdHlRdWV1ZUVudHJ5RmxhZz0hMCxmKGEpfSk7XCJcIiE9PWkucXVldWUmJlwiZnhcIiE9PWkucXVldWV8fFwiaW5wcm9ncmVzc1wiPT09by5xdWV1ZShhKVswXXx8by5kZXF1ZXVlKGEpfXZhciBqLGsscCxxLHIscyx2LHg9YXJndW1lbnRzWzBdJiYoYXJndW1lbnRzWzBdLnB8fG8uaXNQbGFpbk9iamVjdChhcmd1bWVudHNbMF0ucHJvcGVydGllcykmJiFhcmd1bWVudHNbMF0ucHJvcGVydGllcy5uYW1lc3x8dS5pc1N0cmluZyhhcmd1bWVudHNbMF0ucHJvcGVydGllcykpO3UuaXNXcmFwcGVkKHRoaXMpPyhrPSExLHE9MCxyPXRoaXMscD10aGlzKTooaz0hMCxxPTEscj14P2FyZ3VtZW50c1swXS5lbGVtZW50c3x8YXJndW1lbnRzWzBdLmU6YXJndW1lbnRzWzBdKTt2YXIgej17cHJvbWlzZTpudWxsLHJlc29sdmVyOm51bGwscmVqZWN0ZXI6bnVsbH07aWYoayYmeS5Qcm9taXNlJiYoei5wcm9taXNlPW5ldyB5LlByb21pc2UoZnVuY3Rpb24oYSxiKXt6LnJlc29sdmVyPWEsei5yZWplY3Rlcj1ifSkpLHg/KHM9YXJndW1lbnRzWzBdLnByb3BlcnRpZXN8fGFyZ3VtZW50c1swXS5wLHY9YXJndW1lbnRzWzBdLm9wdGlvbnN8fGFyZ3VtZW50c1swXS5vKToocz1hcmd1bWVudHNbcV0sdj1hcmd1bWVudHNbcSsxXSksIShyPWYocikpKXJldHVybiB2b2lkKHoucHJvbWlzZSYmKHMmJnYmJnYucHJvbWlzZVJlamVjdEVtcHR5PT09ITE/ei5yZXNvbHZlcigpOnoucmVqZWN0ZXIoKSkpO3ZhciBDPXIubGVuZ3RoLEQ9MDtpZighL14oc3RvcHxmaW5pc2h8ZmluaXNoQWxsfHBhdXNlfHJlc3VtZSkkL2kudGVzdChzKSYmIW8uaXNQbGFpbk9iamVjdCh2KSl7dmFyIEU9cSsxO3Y9e307Zm9yKHZhciBGPUU7Rjxhcmd1bWVudHMubGVuZ3RoO0YrKyl1LmlzQXJyYXkoYXJndW1lbnRzW0ZdKXx8IS9eKGZhc3R8bm9ybWFsfHNsb3cpJC9pLnRlc3QoYXJndW1lbnRzW0ZdKSYmIS9eXFxkLy50ZXN0KGFyZ3VtZW50c1tGXSk/dS5pc1N0cmluZyhhcmd1bWVudHNbRl0pfHx1LmlzQXJyYXkoYXJndW1lbnRzW0ZdKT92LmVhc2luZz1hcmd1bWVudHNbRl06dS5pc0Z1bmN0aW9uKGFyZ3VtZW50c1tGXSkmJih2LmNvbXBsZXRlPWFyZ3VtZW50c1tGXSk6di5kdXJhdGlvbj1hcmd1bWVudHNbRl19dmFyIEc7c3dpdGNoKHMpe2Nhc2VcInNjcm9sbFwiOkc9XCJzY3JvbGxcIjticmVhaztjYXNlXCJyZXZlcnNlXCI6Rz1cInJldmVyc2VcIjticmVhaztjYXNlXCJwYXVzZVwiOnZhciBIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBvLmVhY2gocixmdW5jdGlvbihhLGIpe2goYixIKX0pLG8uZWFjaCh5LlN0YXRlLmNhbGxzLGZ1bmN0aW9uKGEsYil7dmFyIGM9ITE7YiYmby5lYWNoKGJbMV0sZnVuY3Rpb24oYSxlKXt2YXIgZj12PT09ZD9cIlwiOnY7cmV0dXJuIGYhPT0hMCYmYlsyXS5xdWV1ZSE9PWYmJih2IT09ZHx8YlsyXS5xdWV1ZSE9PSExKXx8KG8uZWFjaChyLGZ1bmN0aW9uKGEsZCl7aWYoZD09PWUpcmV0dXJuIGJbNV09e3Jlc3VtZTohMX0sYz0hMCwhMX0pLCFjJiZ2b2lkIDApfSl9KSxhKCk7Y2FzZVwicmVzdW1lXCI6cmV0dXJuIG8uZWFjaChyLGZ1bmN0aW9uKGEsYil7aShiLEgpfSksby5lYWNoKHkuU3RhdGUuY2FsbHMsZnVuY3Rpb24oYSxiKXt2YXIgYz0hMTtiJiZvLmVhY2goYlsxXSxmdW5jdGlvbihhLGUpe3ZhciBmPXY9PT1kP1wiXCI6djtyZXR1cm4gZiE9PSEwJiZiWzJdLnF1ZXVlIT09ZiYmKHYhPT1kfHxiWzJdLnF1ZXVlIT09ITEpfHwoIWJbNV18fChvLmVhY2gocixmdW5jdGlvbihhLGQpe2lmKGQ9PT1lKXJldHVybiBiWzVdLnJlc3VtZT0hMCxjPSEwLCExfSksIWMmJnZvaWQgMCkpfSl9KSxhKCk7Y2FzZVwiZmluaXNoXCI6Y2FzZVwiZmluaXNoQWxsXCI6Y2FzZVwic3RvcFwiOm8uZWFjaChyLGZ1bmN0aW9uKGEsYil7ZyhiKSYmZyhiKS5kZWxheVRpbWVyJiYoY2xlYXJUaW1lb3V0KGcoYikuZGVsYXlUaW1lci5zZXRUaW1lb3V0KSxnKGIpLmRlbGF5VGltZXIubmV4dCYmZyhiKS5kZWxheVRpbWVyLm5leHQoKSxkZWxldGUgZyhiKS5kZWxheVRpbWVyKSxcImZpbmlzaEFsbFwiIT09c3x8diE9PSEwJiYhdS5pc1N0cmluZyh2KXx8KG8uZWFjaChvLnF1ZXVlKGIsdS5pc1N0cmluZyh2KT92OlwiXCIpLGZ1bmN0aW9uKGEsYil7dS5pc0Z1bmN0aW9uKGIpJiZiKCl9KSxvLnF1ZXVlKGIsdS5pc1N0cmluZyh2KT92OlwiXCIsW10pKX0pO3ZhciBJPVtdO3JldHVybiBvLmVhY2goeS5TdGF0ZS5jYWxscyxmdW5jdGlvbihhLGIpe2ImJm8uZWFjaChiWzFdLGZ1bmN0aW9uKGMsZSl7dmFyIGY9dj09PWQ/XCJcIjp2O2lmKGYhPT0hMCYmYlsyXS5xdWV1ZSE9PWYmJih2IT09ZHx8YlsyXS5xdWV1ZSE9PSExKSlyZXR1cm4hMDtvLmVhY2gocixmdW5jdGlvbihjLGQpe2lmKGQ9PT1lKWlmKCh2PT09ITB8fHUuaXNTdHJpbmcodikpJiYoby5lYWNoKG8ucXVldWUoZCx1LmlzU3RyaW5nKHYpP3Y6XCJcIiksZnVuY3Rpb24oYSxiKXt1LmlzRnVuY3Rpb24oYikmJmIobnVsbCwhMCl9KSxvLnF1ZXVlKGQsdS5pc1N0cmluZyh2KT92OlwiXCIsW10pKSxcInN0b3BcIj09PXMpe3ZhciBoPWcoZCk7aCYmaC50d2VlbnNDb250YWluZXImJmYhPT0hMSYmby5lYWNoKGgudHdlZW5zQ29udGFpbmVyLGZ1bmN0aW9uKGEsYil7Yi5lbmRWYWx1ZT1iLmN1cnJlbnRWYWx1ZX0pLEkucHVzaChhKX1lbHNlXCJmaW5pc2hcIiE9PXMmJlwiZmluaXNoQWxsXCIhPT1zfHwoYlsyXS5kdXJhdGlvbj0xKX0pfSl9KSxcInN0b3BcIj09PXMmJihvLmVhY2goSSxmdW5jdGlvbihhLGIpe24oYiwhMCl9KSx6LnByb21pc2UmJnoucmVzb2x2ZXIocikpLGEoKTtkZWZhdWx0OmlmKCFvLmlzUGxhaW5PYmplY3Qocyl8fHUuaXNFbXB0eU9iamVjdChzKSl7aWYodS5pc1N0cmluZyhzKSYmeS5SZWRpcmVjdHNbc10pe2o9by5leHRlbmQoe30sdik7dmFyIEo9ai5kdXJhdGlvbixLPWouZGVsYXl8fDA7cmV0dXJuIGouYmFja3dhcmRzPT09ITAmJihyPW8uZXh0ZW5kKCEwLFtdLHIpLnJldmVyc2UoKSksby5lYWNoKHIsZnVuY3Rpb24oYSxiKXtwYXJzZUZsb2F0KGouc3RhZ2dlcik/ai5kZWxheT1LK3BhcnNlRmxvYXQoai5zdGFnZ2VyKSphOnUuaXNGdW5jdGlvbihqLnN0YWdnZXIpJiYoai5kZWxheT1LK2ouc3RhZ2dlci5jYWxsKGIsYSxDKSksai5kcmFnJiYoai5kdXJhdGlvbj1wYXJzZUZsb2F0KEopfHwoL14oY2FsbG91dHx0cmFuc2l0aW9uKS8udGVzdChzKT8xZTM6dyksai5kdXJhdGlvbj1NYXRoLm1heChqLmR1cmF0aW9uKihqLmJhY2t3YXJkcz8xLWEvQzooYSsxKS9DKSwuNzUqai5kdXJhdGlvbiwyMDApKSx5LlJlZGlyZWN0c1tzXS5jYWxsKGIsYixqfHx7fSxhLEMscix6LnByb21pc2U/ejpkKX0pLGEoKX12YXIgTD1cIlZlbG9jaXR5OiBGaXJzdCBhcmd1bWVudCAoXCIrcytcIikgd2FzIG5vdCBhIHByb3BlcnR5IG1hcCwgYSBrbm93biBhY3Rpb24sIG9yIGEgcmVnaXN0ZXJlZCByZWRpcmVjdC4gQWJvcnRpbmcuXCI7cmV0dXJuIHoucHJvbWlzZT96LnJlamVjdGVyKG5ldyBFcnJvcihMKSk6Yi5jb25zb2xlJiZjb25zb2xlLmxvZyhMKSxhKCl9Rz1cInN0YXJ0XCJ9dmFyIE09e2xhc3RQYXJlbnQ6bnVsbCxsYXN0UG9zaXRpb246bnVsbCxsYXN0Rm9udFNpemU6bnVsbCxsYXN0UGVyY2VudFRvUHhXaWR0aDpudWxsLGxhc3RQZXJjZW50VG9QeEhlaWdodDpudWxsLGxhc3RFbVRvUHg6bnVsbCxyZW1Ub1B4Om51bGwsdndUb1B4Om51bGwsdmhUb1B4Om51bGx9LE49W107by5lYWNoKHIsZnVuY3Rpb24oYSxiKXt1LmlzTm9kZShiKSYmZShiLGEpfSksaj1vLmV4dGVuZCh7fSx5LmRlZmF1bHRzLHYpLGoubG9vcD1wYXJzZUludChqLmxvb3AsMTApO3ZhciBPPTIqai5sb29wLTE7aWYoai5sb29wKWZvcih2YXIgUD0wO1A8TztQKyspe3ZhciBRPXtkZWxheTpqLmRlbGF5LHByb2dyZXNzOmoucHJvZ3Jlc3N9O1A9PT1PLTEmJihRLmRpc3BsYXk9ai5kaXNwbGF5LFEudmlzaWJpbGl0eT1qLnZpc2liaWxpdHksUS5jb21wbGV0ZT1qLmNvbXBsZXRlKSxCKHIsXCJyZXZlcnNlXCIsUSl9cmV0dXJuIGEoKX07eT1vLmV4dGVuZChCLHkpLHkuYW5pbWF0ZT1CO3ZhciBDPWIucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxxO2lmKCF5LlN0YXRlLmlzTW9iaWxlJiZjLmhpZGRlbiE9PWQpe3ZhciBEPWZ1bmN0aW9uKCl7Yy5oaWRkZW4/KEM9ZnVuY3Rpb24oYSl7cmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXthKCEwKX0sMTYpfSxtKCkpOkM9Yi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fHF9O0QoKSxjLmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsRCl9cmV0dXJuIGEuVmVsb2NpdHk9eSxhIT09YiYmKGEuZm4udmVsb2NpdHk9QixhLmZuLnZlbG9jaXR5LmRlZmF1bHRzPXkuZGVmYXVsdHMpLG8uZWFjaChbXCJEb3duXCIsXCJVcFwiXSxmdW5jdGlvbihhLGIpe3kuUmVkaXJlY3RzW1wic2xpZGVcIitiXT1mdW5jdGlvbihhLGMsZSxmLGcsaCl7dmFyIGk9by5leHRlbmQoe30sYyksaj1pLmJlZ2luLGs9aS5jb21wbGV0ZSxsPXt9LG09e2hlaWdodDpcIlwiLG1hcmdpblRvcDpcIlwiLG1hcmdpbkJvdHRvbTpcIlwiLHBhZGRpbmdUb3A6XCJcIixwYWRkaW5nQm90dG9tOlwiXCJ9O2kuZGlzcGxheT09PWQmJihpLmRpc3BsYXk9XCJEb3duXCI9PT1iP1wiaW5saW5lXCI9PT15LkNTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoYSk/XCJpbmxpbmUtYmxvY2tcIjpcImJsb2NrXCI6XCJub25lXCIpLGkuYmVnaW49ZnVuY3Rpb24oKXswPT09ZSYmaiYmai5jYWxsKGcsZyk7Zm9yKHZhciBjIGluIG0paWYobS5oYXNPd25Qcm9wZXJ0eShjKSl7bFtjXT1hLnN0eWxlW2NdO3ZhciBkPUEuZ2V0UHJvcGVydHlWYWx1ZShhLGMpO21bY109XCJEb3duXCI9PT1iP1tkLDBdOlswLGRdfWwub3ZlcmZsb3c9YS5zdHlsZS5vdmVyZmxvdyxhLnN0eWxlLm92ZXJmbG93PVwiaGlkZGVuXCJ9LGkuY29tcGxldGU9ZnVuY3Rpb24oKXtmb3IodmFyIGIgaW4gbClsLmhhc093blByb3BlcnR5KGIpJiYoYS5zdHlsZVtiXT1sW2JdKTtlPT09Zi0xJiYoayYmay5jYWxsKGcsZyksaCYmaC5yZXNvbHZlcihnKSl9LHkoYSxtLGkpfX0pLG8uZWFjaChbXCJJblwiLFwiT3V0XCJdLGZ1bmN0aW9uKGEsYil7eS5SZWRpcmVjdHNbXCJmYWRlXCIrYl09ZnVuY3Rpb24oYSxjLGUsZixnLGgpe3ZhciBpPW8uZXh0ZW5kKHt9LGMpLGo9aS5jb21wbGV0ZSxrPXtvcGFjaXR5OlwiSW5cIj09PWI/MTowfTswIT09ZSYmKGkuYmVnaW49bnVsbCksaS5jb21wbGV0ZT1lIT09Zi0xP251bGw6ZnVuY3Rpb24oKXtqJiZqLmNhbGwoZyxnKSxoJiZoLnJlc29sdmVyKGcpfSxpLmRpc3BsYXk9PT1kJiYoaS5kaXNwbGF5PVwiSW5cIj09PWI/XCJhdXRvXCI6XCJub25lXCIpLHkodGhpcyxrLGkpfX0pLHl9KHdpbmRvdy5qUXVlcnl8fHdpbmRvdy5aZXB0b3x8d2luZG93LHdpbmRvdyx3aW5kb3c/d2luZG93LmRvY3VtZW50OnVuZGVmaW5lZCl9KTsiLCIhZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YSgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1widmVsb2NpdHlcIl0sYSk6YSgpfShmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO3JldHVybiBmdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1hLlZlbG9jaXR5O2lmKCFlfHwhZS5VdGlsaXRpZXMpcmV0dXJuIHZvaWQoYi5jb25zb2xlJiZjb25zb2xlLmxvZyhcIlZlbG9jaXR5IFVJIFBhY2s6IFZlbG9jaXR5IG11c3QgYmUgbG9hZGVkIGZpcnN0LiBBYm9ydGluZy5cIikpO3ZhciBmPWUuVXRpbGl0aWVzLGc9ZS52ZXJzaW9uLGg9e21ham9yOjEsbWlub3I6MSxwYXRjaDowfTtpZihmdW5jdGlvbihhLGIpe3ZhciBjPVtdO3JldHVybiEoIWF8fCFiKSYmKGYuZWFjaChbYSxiXSxmdW5jdGlvbihhLGIpe3ZhciBkPVtdO2YuZWFjaChiLGZ1bmN0aW9uKGEsYil7Zm9yKDtiLnRvU3RyaW5nKCkubGVuZ3RoPDU7KWI9XCIwXCIrYjtkLnB1c2goYil9KSxjLnB1c2goZC5qb2luKFwiXCIpKX0pLHBhcnNlRmxvYXQoY1swXSk+cGFyc2VGbG9hdChjWzFdKSl9KGgsZykpe3ZhciBpPVwiVmVsb2NpdHkgVUkgUGFjazogWW91IG5lZWQgdG8gdXBkYXRlIFZlbG9jaXR5ICh2ZWxvY2l0eS5qcykgdG8gYSBuZXdlciB2ZXJzaW9uLiBWaXNpdCBodHRwOi8vZ2l0aHViLmNvbS9qdWxpYW5zaGFwaXJvL3ZlbG9jaXR5LlwiO3Rocm93IGFsZXJ0KGkpLG5ldyBFcnJvcihpKX1lLlJlZ2lzdGVyRWZmZWN0PWUuUmVnaXN0ZXJVST1mdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGMoYSxiLGMsZCl7dmFyIGcsaD0wO2YuZWFjaChhLm5vZGVUeXBlP1thXTphLGZ1bmN0aW9uKGEsYil7ZCYmKGMrPWEqZCksZz1iLnBhcmVudE5vZGU7dmFyIGk9W1wiaGVpZ2h0XCIsXCJwYWRkaW5nVG9wXCIsXCJwYWRkaW5nQm90dG9tXCIsXCJtYXJnaW5Ub3BcIixcIm1hcmdpbkJvdHRvbVwiXTtcImJvcmRlci1ib3hcIj09PWUuQ1NTLmdldFByb3BlcnR5VmFsdWUoYixcImJveFNpemluZ1wiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkmJihpPVtcImhlaWdodFwiXSksZi5lYWNoKGksZnVuY3Rpb24oYSxjKXtoKz1wYXJzZUZsb2F0KGUuQ1NTLmdldFByb3BlcnR5VmFsdWUoYixjKSl9KX0pLGUuYW5pbWF0ZShnLHtoZWlnaHQ6KFwiSW5cIj09PWI/XCIrXCI6XCItXCIpK1wiPVwiK2h9LHtxdWV1ZTohMSxlYXNpbmc6XCJlYXNlLWluLW91dFwiLGR1cmF0aW9uOmMqKFwiSW5cIj09PWI/LjY6MSl9KX1yZXR1cm4gZS5SZWRpcmVjdHNbYV09ZnVuY3Rpb24oZCxnLGgsaSxqLGssbCl7dmFyIG09aD09PWktMSxuPTA7bD1sfHxiLmxvb3AsXCJmdW5jdGlvblwiPT10eXBlb2YgYi5kZWZhdWx0RHVyYXRpb24/Yi5kZWZhdWx0RHVyYXRpb249Yi5kZWZhdWx0RHVyYXRpb24uY2FsbChqLGopOmIuZGVmYXVsdER1cmF0aW9uPXBhcnNlRmxvYXQoYi5kZWZhdWx0RHVyYXRpb24pO2Zvcih2YXIgbz0wO288Yi5jYWxscy5sZW5ndGg7bysrKVwibnVtYmVyXCI9PXR5cGVvZih0PWIuY2FsbHNbb11bMV0pJiYobis9dCk7dmFyIHA9bj49MT8wOmIuY2FsbHMubGVuZ3RoPygxLW4pL2IuY2FsbHMubGVuZ3RoOjE7Zm9yKG89MDtvPGIuY2FsbHMubGVuZ3RoO28rKyl7dmFyIHE9Yi5jYWxsc1tvXSxyPXFbMF0scz0xZTMsdD1xWzFdLHU9cVsyXXx8e30sdj17fTtpZih2b2lkIDAhPT1nLmR1cmF0aW9uP3M9Zy5kdXJhdGlvbjp2b2lkIDAhPT1iLmRlZmF1bHREdXJhdGlvbiYmKHM9Yi5kZWZhdWx0RHVyYXRpb24pLHYuZHVyYXRpb249cyooXCJudW1iZXJcIj09dHlwZW9mIHQ/dDpwKSx2LnF1ZXVlPWcucXVldWV8fFwiXCIsdi5lYXNpbmc9dS5lYXNpbmd8fFwiZWFzZVwiLHYuZGVsYXk9cGFyc2VGbG9hdCh1LmRlbGF5KXx8MCx2Lmxvb3A9IWIubG9vcCYmdS5sb29wLHYuX2NhY2hlVmFsdWVzPXUuX2NhY2hlVmFsdWVzfHwhMCwwPT09byl7aWYodi5kZWxheSs9cGFyc2VGbG9hdChnLmRlbGF5KXx8MCwwPT09aCYmKHYuYmVnaW49ZnVuY3Rpb24oKXtnLmJlZ2luJiZnLmJlZ2luLmNhbGwoaixqKTt2YXIgYj1hLm1hdGNoKC8oSW58T3V0KSQvKTtiJiZcIkluXCI9PT1iWzBdJiZ2b2lkIDAhPT1yLm9wYWNpdHkmJmYuZWFjaChqLm5vZGVUeXBlP1tqXTpqLGZ1bmN0aW9uKGEsYil7ZS5DU1Muc2V0UHJvcGVydHlWYWx1ZShiLFwib3BhY2l0eVwiLDApfSksZy5hbmltYXRlUGFyZW50SGVpZ2h0JiZiJiZjKGosYlswXSxzK3YuZGVsYXksZy5zdGFnZ2VyKX0pLG51bGwhPT1nLmRpc3BsYXkpaWYodm9pZCAwIT09Zy5kaXNwbGF5JiZcIm5vbmVcIiE9PWcuZGlzcGxheSl2LmRpc3BsYXk9Zy5kaXNwbGF5O2Vsc2UgaWYoL0luJC8udGVzdChhKSl7dmFyIHc9ZS5DU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGQpO3YuZGlzcGxheT1cImlubGluZVwiPT09dz9cImlubGluZS1ibG9ja1wiOnd9Zy52aXNpYmlsaXR5JiZcImhpZGRlblwiIT09Zy52aXNpYmlsaXR5JiYodi52aXNpYmlsaXR5PWcudmlzaWJpbGl0eSl9aWYobz09PWIuY2FsbHMubGVuZ3RoLTEpe3ZhciB4PWZ1bmN0aW9uKCl7dm9pZCAwIT09Zy5kaXNwbGF5JiZcIm5vbmVcIiE9PWcuZGlzcGxheXx8IS9PdXQkLy50ZXN0KGEpfHxmLmVhY2goai5ub2RlVHlwZT9bal06aixmdW5jdGlvbihhLGIpe2UuQ1NTLnNldFByb3BlcnR5VmFsdWUoYixcImRpc3BsYXlcIixcIm5vbmVcIil9KSxnLmNvbXBsZXRlJiZnLmNvbXBsZXRlLmNhbGwoaixqKSxrJiZrLnJlc29sdmVyKGp8fGQpfTt2LmNvbXBsZXRlPWZ1bmN0aW9uKCl7aWYobCYmZS5SZWRpcmVjdHNbYV0oZCxnLGgsaSxqLGssbD09PSEwfHxNYXRoLm1heCgwLGwtMSkpLGIucmVzZXQpe2Zvcih2YXIgYyBpbiBiLnJlc2V0KWlmKGIucmVzZXQuaGFzT3duUHJvcGVydHkoYykpe3ZhciBmPWIucmVzZXRbY107dm9pZCAwIT09ZS5DU1MuSG9va3MucmVnaXN0ZXJlZFtjXXx8XCJzdHJpbmdcIiE9dHlwZW9mIGYmJlwibnVtYmVyXCIhPXR5cGVvZiBmfHwoYi5yZXNldFtjXT1bYi5yZXNldFtjXSxiLnJlc2V0W2NdXSl9dmFyIG49e2R1cmF0aW9uOjAscXVldWU6ITF9O20mJihuLmNvbXBsZXRlPXgpLGUuYW5pbWF0ZShkLGIucmVzZXQsbil9ZWxzZSBtJiZ4KCl9LFwiaGlkZGVuXCI9PT1nLnZpc2liaWxpdHkmJih2LnZpc2liaWxpdHk9Zy52aXNpYmlsaXR5KX1lLmFuaW1hdGUoZCxyLHYpfX0sZX0sZS5SZWdpc3RlckVmZmVjdC5wYWNrYWdlZEVmZmVjdHM9e1wiY2FsbG91dC5ib3VuY2VcIjp7ZGVmYXVsdER1cmF0aW9uOjU1MCxjYWxsczpbW3t0cmFuc2xhdGVZOi0zMH0sLjI1XSxbe3RyYW5zbGF0ZVk6MH0sLjEyNV0sW3t0cmFuc2xhdGVZOi0xNX0sLjEyNV0sW3t0cmFuc2xhdGVZOjB9LC4yNV1dfSxcImNhbGxvdXQuc2hha2VcIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3t0cmFuc2xhdGVYOi0xMX1dLFt7dHJhbnNsYXRlWDoxMX1dLFt7dHJhbnNsYXRlWDotMTF9XSxbe3RyYW5zbGF0ZVg6MTF9XSxbe3RyYW5zbGF0ZVg6LTExfV0sW3t0cmFuc2xhdGVYOjExfV0sW3t0cmFuc2xhdGVYOi0xMX1dLFt7dHJhbnNsYXRlWDowfV1dfSxcImNhbGxvdXQuZmxhc2hcIjp7ZGVmYXVsdER1cmF0aW9uOjExMDAsY2FsbHM6W1t7b3BhY2l0eTpbMCxcImVhc2VJbk91dFF1YWRcIiwxXX1dLFt7b3BhY2l0eTpbMSxcImVhc2VJbk91dFF1YWRcIl19XSxbe29wYWNpdHk6WzAsXCJlYXNlSW5PdXRRdWFkXCJdfV0sW3tvcGFjaXR5OlsxLFwiZWFzZUluT3V0UXVhZFwiXX1dXX0sXCJjYWxsb3V0LnB1bHNlXCI6e2RlZmF1bHREdXJhdGlvbjo4MjUsY2FsbHM6W1t7c2NhbGVYOjEuMSxzY2FsZVk6MS4xfSwuNSx7ZWFzaW5nOlwiZWFzZUluRXhwb1wifV0sW3tzY2FsZVg6MSxzY2FsZVk6MX0sLjVdXX0sXCJjYWxsb3V0LnN3aW5nXCI6e2RlZmF1bHREdXJhdGlvbjo5NTAsY2FsbHM6W1t7cm90YXRlWjoxNX1dLFt7cm90YXRlWjotMTB9XSxbe3JvdGF0ZVo6NX1dLFt7cm90YXRlWjotNX1dLFt7cm90YXRlWjowfV1dfSxcImNhbGxvdXQudGFkYVwiOntkZWZhdWx0RHVyYXRpb246MWUzLGNhbGxzOltbe3NjYWxlWDouOSxzY2FsZVk6Ljkscm90YXRlWjotM30sLjFdLFt7c2NhbGVYOjEuMSxzY2FsZVk6MS4xLHJvdGF0ZVo6M30sLjFdLFt7c2NhbGVYOjEuMSxzY2FsZVk6MS4xLHJvdGF0ZVo6LTN9LC4xXSxbXCJyZXZlcnNlXCIsLjEyNV0sW1wicmV2ZXJzZVwiLC4xMjVdLFtcInJldmVyc2VcIiwuMTI1XSxbXCJyZXZlcnNlXCIsLjEyNV0sW1wicmV2ZXJzZVwiLC4xMjVdLFt7c2NhbGVYOjEsc2NhbGVZOjEscm90YXRlWjowfSwuMl1dfSxcInRyYW5zaXRpb24uZmFkZUluXCI6e2RlZmF1bHREdXJhdGlvbjo1MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXX1dXX0sXCJ0cmFuc2l0aW9uLmZhZGVPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjUwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdfV1dfSxcInRyYW5zaXRpb24uZmxpcFhJblwiOntkZWZhdWx0RHVyYXRpb246NzAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHJvdGF0ZVk6WzAsLTU1XX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MH19LFwidHJhbnNpdGlvbi5mbGlwWE91dFwiOntkZWZhdWx0RHVyYXRpb246NzAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHJvdGF0ZVk6NTV9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAscm90YXRlWTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBZSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSxyb3RhdGVYOlswLC00NV19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjB9fSxcInRyYW5zaXRpb24uZmxpcFlPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSxyb3RhdGVYOjI1fV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHJvdGF0ZVg6MH19LFwidHJhbnNpdGlvbi5mbGlwQm91bmNlWEluXCI6e2RlZmF1bHREdXJhdGlvbjo5MDAsY2FsbHM6W1t7b3BhY2l0eTpbLjcyNSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbNDAwLDQwMF0scm90YXRlWTpbLTEwLDkwXX0sLjVdLFt7b3BhY2l0eTouOCxyb3RhdGVZOjEwfSwuMjVdLFt7b3BhY2l0eToxLHJvdGF0ZVk6MH0sLjI1XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjB9fSxcInRyYW5zaXRpb24uZmxpcEJvdW5jZVhPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsuOSwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbNDAwLDQwMF0scm90YXRlWTotMTB9XSxbe29wYWNpdHk6MCxyb3RhdGVZOjkwfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHJvdGF0ZVk6MH19LFwidHJhbnNpdGlvbi5mbGlwQm91bmNlWUluXCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbLjcyNSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbNDAwLDQwMF0scm90YXRlWDpbLTEwLDkwXX0sLjVdLFt7b3BhY2l0eTouOCxyb3RhdGVYOjEwfSwuMjVdLFt7b3BhY2l0eToxLHJvdGF0ZVg6MH0sLjI1XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjB9fSxcInRyYW5zaXRpb24uZmxpcEJvdW5jZVlPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsuOSwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbNDAwLDQwMF0scm90YXRlWDotMTV9XSxbe29wYWNpdHk6MCxyb3RhdGVYOjkwfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHJvdGF0ZVg6MH19LFwidHJhbnNpdGlvbi5zd29vcEluXCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjEwMCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjEwMCVcIixcIjEwMCVcIl0sc2NhbGVYOlsxLDBdLHNjYWxlWTpbMSwwXSx0cmFuc2xhdGVYOlswLC03MDBdLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIn19LFwidHJhbnNpdGlvbi5zd29vcE91dFwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjEwMCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCIxMDAlXCIsXCIxMDAlXCJdLHNjYWxlWDowLHNjYWxlWTowLHRyYW5zbGF0ZVg6LTcwMCx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCIsc2NhbGVYOjEsc2NhbGVZOjEsdHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLndoaXJsSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6WzEsMF0sc2NhbGVZOlsxLDBdLHJvdGF0ZVk6WzAsMTYwXX0sMSx7ZWFzaW5nOlwiZWFzZUluT3V0U2luZVwifV1dfSxcInRyYW5zaXRpb24ud2hpcmxPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlswLFwiZWFzZUluT3V0UXVpbnRcIiwxXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOjAsc2NhbGVZOjAscm90YXRlWToxNjB9LDEse2Vhc2luZzpcInN3aW5nXCJ9XV0scmVzZXQ6e3NjYWxlWDoxLHNjYWxlWToxLHJvdGF0ZVk6MH19LFwidHJhbnNpdGlvbi5zaHJpbmtJblwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDpbMSwxLjVdLHNjYWxlWTpbMSwxLjVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNocmlua091dFwiOntkZWZhdWx0RHVyYXRpb246NjAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDoxLjMsc2NhbGVZOjEuMyx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3NjYWxlWDoxLHNjYWxlWToxfX0sXCJ0cmFuc2l0aW9uLmV4cGFuZEluXCI6e2RlZmF1bHREdXJhdGlvbjo3MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOlsxLC42MjVdLHNjYWxlWTpbMSwuNjI1XSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5leHBhbmRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjcwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6LjUsc2NhbGVZOi41LHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7c2NhbGVYOjEsc2NhbGVZOjF9fSxcInRyYW5zaXRpb24uYm91bmNlSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHNjYWxlWDpbMS4wNSwuM10sc2NhbGVZOlsxLjA1LC4zXX0sLjM1XSxbe3NjYWxlWDouOSxzY2FsZVk6LjksdHJhbnNsYXRlWjowfSwuMl0sW3tzY2FsZVg6MSxzY2FsZVk6MX0sLjQ1XV19LFwidHJhbnNpdGlvbi5ib3VuY2VPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tzY2FsZVg6Ljk1LHNjYWxlWTouOTV9LC4zNV0sW3tzY2FsZVg6MS4xLHNjYWxlWToxLjEsdHJhbnNsYXRlWjowfSwuMzVdLFt7b3BhY2l0eTpbMCwxXSxzY2FsZVg6LjMsc2NhbGVZOi4zfSwuM11dLHJlc2V0OntzY2FsZVg6MSxzY2FsZVk6MX19LFwidHJhbnNpdGlvbi5ib3VuY2VVcEluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlstMzAsMWUzXX0sLjYse2Vhc2luZzpcImVhc2VPdXRDaXJjXCJ9XSxbe3RyYW5zbGF0ZVk6MTB9LC4yXSxbe3RyYW5zbGF0ZVk6MH0sLjJdXX0sXCJ0cmFuc2l0aW9uLmJvdW5jZVVwT3V0XCI6e2RlZmF1bHREdXJhdGlvbjoxZTMsY2FsbHM6W1t7dHJhbnNsYXRlWToyMH0sLjJdLFt7b3BhY2l0eTpbMCxcImVhc2VJbkNpcmNcIiwxXSx0cmFuc2xhdGVZOi0xZTN9LC44XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5ib3VuY2VEb3duSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVk6WzMwLC0xZTNdfSwuNix7ZWFzaW5nOlwiZWFzZU91dENpcmNcIn1dLFt7dHJhbnNsYXRlWTotMTB9LC4yXSxbe3RyYW5zbGF0ZVk6MH0sLjJdXX0sXCJ0cmFuc2l0aW9uLmJvdW5jZURvd25PdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjFlMyxjYWxsczpbW3t0cmFuc2xhdGVZOi0yMH0sLjJdLFt7b3BhY2l0eTpbMCxcImVhc2VJbkNpcmNcIiwxXSx0cmFuc2xhdGVZOjFlM30sLjhdXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLmJvdW5jZUxlZnRJblwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbMzAsLTEyNTBdfSwuNix7ZWFzaW5nOlwiZWFzZU91dENpcmNcIn1dLFt7dHJhbnNsYXRlWDotMTB9LC4yXSxbe3RyYW5zbGF0ZVg6MH0sLjJdXX0sXCJ0cmFuc2l0aW9uLmJvdW5jZUxlZnRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3t0cmFuc2xhdGVYOjMwfSwuMl0sW3tvcGFjaXR5OlswLFwiZWFzZUluQ2lyY1wiLDFdLHRyYW5zbGF0ZVg6LTEyNTB9LC44XV0scmVzZXQ6e3RyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi5ib3VuY2VSaWdodEluXCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlstMzAsMTI1MF19LC42LHtlYXNpbmc6XCJlYXNlT3V0Q2lyY1wifV0sW3t0cmFuc2xhdGVYOjEwfSwuMl0sW3t0cmFuc2xhdGVYOjB9LC4yXV19LFwidHJhbnNpdGlvbi5ib3VuY2VSaWdodE91dFwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe3RyYW5zbGF0ZVg6LTMwfSwuMl0sW3tvcGFjaXR5OlswLFwiZWFzZUluQ2lyY1wiLDFdLHRyYW5zbGF0ZVg6MTI1MH0sLjhdXSxyZXNldDp7dHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlVXBJblwiOntkZWZhdWx0RHVyYXRpb246OTAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbMCwyMF0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVVcE91dFwiOntkZWZhdWx0RHVyYXRpb246OTAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWTotMjAsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVZOjB9fSxcInRyYW5zaXRpb24uc2xpZGVEb3duSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjkwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVk6WzAsLTIwXSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZURvd25PdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjkwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVk6MjAsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVZOjB9fSxcInRyYW5zaXRpb24uc2xpZGVMZWZ0SW5cIjp7ZGVmYXVsdER1cmF0aW9uOjFlMyxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVg6WzAsLTIwXSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZUxlZnRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjEwNTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVYOi0yMCx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi5zbGlkZVJpZ2h0SW5cIjp7ZGVmYXVsdER1cmF0aW9uOjFlMyxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVg6WzAsMjBdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlUmlnaHRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjEwNTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVYOjIwLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlVXBCaWdJblwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbMCw3NV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVVcEJpZ091dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWTotNzUsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVZOjB9fSxcInRyYW5zaXRpb24uc2xpZGVEb3duQmlnSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVk6WzAsLTc1XSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZURvd25CaWdPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVk6NzUsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVZOjB9fSxcInRyYW5zaXRpb24uc2xpZGVMZWZ0QmlnSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVg6WzAsLTc1XSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZUxlZnRCaWdPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVg6LTc1LHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlUmlnaHRCaWdJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbMCw3NV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVSaWdodEJpZ091dFwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWDo3NSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZVVwSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSx0cmFuc2Zvcm1PcmlnaW5YOlswLDBdLHRyYW5zZm9ybU9yaWdpblk6W1wiMTAwJVwiLFwiMTAwJVwiXSxyb3RhdGVYOlswLC0xODBdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCJ9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVVcE91dFwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHRyYW5zZm9ybU9yaWdpblg6WzAsMF0sdHJhbnNmb3JtT3JpZ2luWTpbXCIxMDAlXCIsXCIxMDAlXCJdLHJvdGF0ZVg6LTE4MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwiLHJvdGF0ZVg6MH19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZURvd25JblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHRyYW5zZm9ybU9yaWdpblg6WzAsMF0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVYOlswLDE4MF19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIn19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZURvd25PdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSx0cmFuc2Zvcm1PcmlnaW5YOlswLDBdLHRyYW5zZm9ybU9yaWdpblk6WzAsMF0scm90YXRlWDoxODB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIixyb3RhdGVYOjB9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVMZWZ0SW5cIjp7ZGVmYXVsdER1cmF0aW9uOjk1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOlsyZTMsMmUzXSx0cmFuc2Zvcm1PcmlnaW5YOlswLDBdLHRyYW5zZm9ybU9yaWdpblk6WzAsMF0scm90YXRlWTpbMCwtMTgwXX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwifX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlTGVmdE91dFwiOntkZWZhdWx0RHVyYXRpb246OTUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzJlMywyZTNdLHRyYW5zZm9ybU9yaWdpblg6WzAsMF0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVZOi0xODB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIixyb3RhdGVZOjB9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVSaWdodEluXCI6e2RlZmF1bHREdXJhdGlvbjo5NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbMmUzLDJlM10sdHJhbnNmb3JtT3JpZ2luWDpbXCIxMDAlXCIsXCIxMDAlXCJdLHRyYW5zZm9ybU9yaWdpblk6WzAsMF0scm90YXRlWTpbMCwxODBdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCJ9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVSaWdodE91dFwiOntkZWZhdWx0RHVyYXRpb246OTUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzJlMywyZTNdLHRyYW5zZm9ybU9yaWdpblg6W1wiMTAwJVwiLFwiMTAwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVk6MTgwfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCIscm90YXRlWTowfX19O2Zvcih2YXIgaiBpbiBlLlJlZ2lzdGVyRWZmZWN0LnBhY2thZ2VkRWZmZWN0cyllLlJlZ2lzdGVyRWZmZWN0LnBhY2thZ2VkRWZmZWN0cy5oYXNPd25Qcm9wZXJ0eShqKSYmZS5SZWdpc3RlckVmZmVjdChqLGUuUmVnaXN0ZXJFZmZlY3QucGFja2FnZWRFZmZlY3RzW2pdKTtlLlJ1blNlcXVlbmNlPWZ1bmN0aW9uKGEpe3ZhciBiPWYuZXh0ZW5kKCEwLFtdLGEpO2IubGVuZ3RoPjEmJihmLmVhY2goYi5yZXZlcnNlKCksZnVuY3Rpb24oYSxjKXt2YXIgZD1iW2ErMV07aWYoZCl7dmFyIGc9Yy5vfHxjLm9wdGlvbnMsaD1kLm98fGQub3B0aW9ucyxpPWcmJmcuc2VxdWVuY2VRdWV1ZT09PSExP1wiYmVnaW5cIjpcImNvbXBsZXRlXCIsaj1oJiZoW2ldLGs9e307a1tpXT1mdW5jdGlvbigpe3ZhciBhPWQuZXx8ZC5lbGVtZW50cyxiPWEubm9kZVR5cGU/W2FdOmE7aiYmai5jYWxsKGIsYiksZShjKX0sZC5vP2Qubz1mLmV4dGVuZCh7fSxoLGspOmQub3B0aW9ucz1mLmV4dGVuZCh7fSxoLGspfX0pLGIucmV2ZXJzZSgpKSxlKGJbMF0pfX0od2luZG93LmpRdWVyeXx8d2luZG93LlplcHRvfHx3aW5kb3csd2luZG93LHdpbmRvdz93aW5kb3cuZG9jdW1lbnQ6dW5kZWZpbmVkKX0pOyIsImltcG9ydCB7IGVsQ2xhc3MgfSBmcm9tICcuLi91dGlscyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbmltYXRlTWVudUl0ZW0oKSB7XHJcbiAgY29uc3QgbWVudUl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnUtaXRlbScpO1xyXG4gIGNvbnN0IGxpc3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNtYWluLW5hdiBsaScpO1xyXG5cclxuICBtZW51SXRlbXMuZm9yRWFjaChlbCA9PiBhZGRQaXBlcyhlbCkpO1xyXG4gIG1lbnVJdGVtcy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGFuaW1hdGVQaXBlKSk7XHJcbiAgbWVudUl0ZW1zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB1bkFuaW1hdGVQaXBlKSk7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZFBpcGVzKGVsKSB7XHJcbiAgICBjb25zdCBwaXBlMSA9IGVsQ2xhc3MoJ2RpdicsICdlbmQtcGlwZScpO1xyXG4gICAgY29uc3Qgc3RyID0gZWw7XHJcblxyXG4gICAgcGlwZTEuaW5uZXJIVE1MID0gJ3wnO1xyXG4gICAgc3RyLmlubmVySFRNTCA9IGAke3N0ci5pbm5lckhUTUwudG9VcHBlckNhc2UoKX0gfGA7XHJcbiAgICBzdHIuYXBwZW5kQ2hpbGQocGlwZTEpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYW5pbWF0ZVBpcGUoZSkge1xyXG4gICAgY29uc3Qgc3BhY2VXaWR0aCA9IDU7XHJcbiAgICBjb25zdCB3ID0gZS50YXJnZXQub2Zmc2V0V2lkdGg7XHJcbiAgICBjb25zdCBwaXBlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdkaXYnKTtcclxuICAgIHBpcGUuc3R5bGUgPSBgXHJcbiAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKCR7LXcgLSBzcGFjZVdpZHRofXB4KTtcclxuICAgIGA7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1bkFuaW1hdGVQaXBlKGUpIHtcclxuICAgIGNvbnN0IHcgPSBlLnRhcmdldC5vZmZzZXRXaWR0aDtcclxuICAgIGNvbnN0IHBpcGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpO1xyXG4gICAgcGlwZS5zdHlsZSA9IGBcclxuICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMHB4KTtcclxuICAgIGA7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpbVVJKCkge1xyXG4gIGxldCBzUG9zaXRpb24gPSAwO1xyXG4gIGxldCB0aWNraW5nID0gZmFsc2U7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoZSkgPT4ge1xyXG4gICAgc1Bvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XHJcbiAgICBpZiAoIXRpY2tpbmcpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc29jaWFsLW1lZGlhLW5hdicpO1xyXG4gICAgICAgIChmdW5jdGlvbiBkaW1tZXIoKSB7IHVpLmNsYXNzTGlzdC5hZGQoJ2RpbS11aScpOyB9KCkpO1xyXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHVpLmNsYXNzTGlzdC5yZW1vdmUoJ2RpbS11aScpLCAxMDAwKTtcclxuICAgICAgICB0aWNraW5nID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdGlja2luZyA9IHRydWU7XHJcbiAgfSk7XHJcbn1cclxuIiwiY29uc3QgZmlsZSA9IChmdW5jdGlvbiBmaWxlKCkge1xuICBsZXQgc3JjO1xuICBsZXQgdmFsO1xuICBjb25zdCBiYXNlID0gJ2h0dHBzOi8vYnJhc3RydWxsby5naXRodWIuaW8vcmVzdW1lLyc7XG4gIGNvbnN0IHBkZiA9IGAke2Jhc2V9QnJhZFItSlNEZXYucGRmYDtcbiAgY29uc3QgZG9jID0gWydCcmFkUi1KU0Rldi5wZGYnLCAnQnJhZFItSlNEZXYuZG9jJ107XG5cbiAgZnVuY3Rpb24gc2V0U3JjKCkge1xuICAgIHN3aXRjaCAodmFsKSB7XG4gICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgc3JjID0gYmFzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwZGYnOlxuICAgICAgICBzcmMgPSBiYXNlICsgZG9jWzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RvYyc6XG4gICAgICAgIHNyYyA9IGJhc2UgKyBkb2NbMV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc3JjID0gYmFzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRWYWwoZmlsZXR5cGUpIHsgdmFsID0gZmlsZXR5cGU7IHNldFNyYygpOyB9XG4gIGZ1bmN0aW9uIGdldFZhbCgpIHsgcmV0dXJuIHZhbDsgfVxuICBmdW5jdGlvbiBnZXRTcmMoKSB7IHJldHVybiBzcmM7IH1cbiAgZnVuY3Rpb24gZ2V0UGRmKCkgeyByZXR1cm4gcGRmOyB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXRWYWwsXG4gICAgZ2V0VmFsLFxuICAgIGdldFNyYyxcbiAgICBnZXRQZGYsXG4gIH07XG59KCkpO1xuXG5leHBvcnQgZGVmYXVsdCBmaWxlO1xuIiwiaW1wb3J0IGxvYWRpbmdTY3JlZW4gZnJvbSAnLi9sb2FkaW5nU2NyZWVuJztcclxuaW1wb3J0IGFuaW1hdGVNZW51SXRlbXMgZnJvbSAnLi9hbmltYXRlTWVudUl0ZW0nO1xyXG5pbXBvcnQgZGltVUkgZnJvbSAnLi9kaW1VSSc7XHJcbmltcG9ydCBpbnRyb0FuaW1hdGlvbiBmcm9tICcuL2ludHJvQW5pbWF0aW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRlcigpIHtcclxuICBsb2FkaW5nU2NyZWVuKCk7XHJcbiAgYW5pbWF0ZU1lbnVJdGVtcygpO1xyXG4gIGludHJvQW5pbWF0aW9uKCk7XHJcbiAgZGltVUkoKTtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbnRyb0FuaW1hdGlvbigpIHtcclxuICB3aW5kb3cuc2V0VGltZW91dChzdGFydEludHJvLCA0MDApO1xyXG4gIHdpbmRvdy5zZXRUaW1lb3V0KGNsZWFySW50cm9BbmltLCA0MDAwKTtcclxuXHJcbiAgZnVuY3Rpb24gc3RhcnRJbnRybygpIHtcclxuICAgIG1vdmVUZXh0KCk7XHJcbiAgICBzaG93VWkoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdmVUZXh0KCkge1xyXG4gICAgY29uc3QgaW50cm9OYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmludHJvLW5hbWUnKTtcclxuICAgIGNvbnN0IGludHJvQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW50cm8tYmxvY2snKTtcclxuICAgIGludHJvTmFtZS5jbGFzc0xpc3QuYWRkKCdpbnRyby1hbmltLW1vdmUtbmFtZScpO1xyXG4gICAgaW50cm9CbG9jay5jbGFzc0xpc3QuYWRkKCdpbnRyby1hbmltLW1vdmUtYmxvY2snKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNob3dVaSgpIHtcclxuICAgIGNvbnN0IGhlYWRlckxvZ28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9nbycpO1xyXG4gICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW50cm8taW5pdC11aScpO1xyXG4gICAgaGVhZGVyTG9nby5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICBoZWFkZXJMb2dvLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci1sb2dvJyk7XHJcbiAgICB1aS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoJ2ludHJvLWFuaW0tc2hvdy11aScpKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsZWFySW50cm9BbmltKCkge1xyXG4gICAgY29uc3QgaW5pdFVJID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmludHJvLWluaXQtdWknKTtcclxuICAgIGNvbnN0IGFuaW1VSSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnRyby1hbmltLXNob3ctdWknKTtcclxuXHJcbiAgICBpbml0VUkuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpbnRyby1pbml0LXVpJykpO1xyXG4gICAgaW5pdFVJLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnaW50cm8tYW5pbS1zaG93LXVpJykpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgbG9nbyBmcm9tICcuL3N2Zy9sb2dvJztcblxuZnVuY3Rpb24gbG9hZGluZ1NjcmVlbigpIHtcbiAgY29uc3QgYmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3AnKTtcbiAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnbG9hZGluZy1zY3JlZW4tYmFja2Ryb3AnKTtcbiAgYmFja2Ryb3Auc3R5bGUuYmFja2dyb3VuZCA9IHBhc3RlbENvbG9ycygpO1xuICBkb2N1bWVudC5ib2R5LnN0eWxlID0gJ292ZXJmbG93OiBoaWRkZW4nO1xuICBiYWNrZHJvcC5pbnNlcnRCZWZvcmUobG9nbygpLCBiYWNrZHJvcC5jaGlsZE5vZGVzWzBdKTtcblxuICB3aW5kb3cuc2V0VGltZW91dChzaG93TG9hZGluZywgMjAwKTtcbn1cblxuZnVuY3Rpb24gc2hvd0xvYWRpbmcoKSB7XG4gIGNvbnN0IHBhdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZ0JhcicpO1xuICBjb25zdCBsZW5ndGggPSBwYXRoLmdldFRvdGFsTGVuZ3RoKCk7XG5cbiAgcGF0aC5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnO1xuICBwYXRoLnN0eWxlLldlYmtpdFRyYW5zaXRpb24gPSAnbm9uZSc7XG4gIHBhdGguc3R5bGUgPSAnb3BhY2l0eTogMSc7XG4gIHBhdGguc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gYCR7bGVuZ3RofSAke2xlbmd0aH1gO1xuICBwYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBsZW5ndGg7XG4gIHBhdGguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHBhdGguc3R5bGUudHJhbnNpdGlvbiA9ICdzdHJva2UtZGFzaG9mZnNldCAxNTBtcyBlYXNlLWluJztcbiAgcGF0aC5zdHlsZS5XZWJraXRUcmFuc2l0aW9uID0gJ3N0cm9rZS1kYXNob2Zmc2V0IDE1MG1zIGVhc2UtaW4nO1xuICBwYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSAnMCc7XG5cbiAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgY29uc3QgYmFja2Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2Ryb3AnKTtcbiAgICBiYWNrZHJvcC5yZW1vdmUoKTtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlID0gJ292ZXJmbG93OiB1bnNldCc7XG4gIH1cblxuICB3aW5kb3cuc2V0VGltZW91dChzdGFydCwgMzUwKTtcbiAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcGFzdGVsQ29sb3JzKCkge1xuICBjb25zdCByID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEyNykgKyAxMjcpLnRvU3RyaW5nKDE2KTtcbiAgY29uc3QgZyA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMjcpICsgMTI3KS50b1N0cmluZygxNik7XG4gIGNvbnN0IGIgPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTI3KSArIDEyNykudG9TdHJpbmcoMTYpO1xuICByZXR1cm4gYCMke3J9JHtnfSR7Yn1gO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsb2FkaW5nU2NyZWVuO1xuIiwiaW1wb3J0IGZpbGUgZnJvbSAnLi9kb2NIYW5kbGVyJztcclxuaW1wb3J0IHZpZXdIYW5kbGVyIGZyb20gJy4vdmlld0hhbmRsZXInO1xyXG5pbXBvcnQgeyBlbENsYXNzLCBtYWtlQnRuIH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9kYWwoKSB7XHJcbiAgKGZ1bmN0aW9uIGFkZE1vZGFsKCkge1xyXG4gICAgY29uc3QgYmcgPSBlbENsYXNzKCdkaXYnLCAnbW9kYWwtYmFja2dyb3VuZCcpO1xyXG4gICAgY29uc3Qgd3JhcHBlciA9IGVsQ2xhc3MoJ2RpdicsICdtb2RhbC13cmFwcGVyJyk7XHJcbiAgICBjb25zdCBtZW51ID0gbW9kYWxNZW51KCk7XHJcbiAgICBjb25zdCBjb250ZW50ID0gbW9kYWxDb250ZW50KCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJnKTtcclxuICAgIGJnLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChtZW51KTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgfSgpKTtcclxuXHJcbiAgZnVuY3Rpb24gbW9kYWxNZW51KCkge1xyXG4gICAgY29uc3QgbWVudSA9IGVsQ2xhc3MoJ2RpdicsICdtb2RhbC1tZW51Jyk7XHJcbiAgICBjb25zdCBkcm9wZG93biA9IGRvY1ZpZXdEcm9wZG93bigpO1xyXG4gICAgY29uc3Qgc3dpdGNoQnRuID0gZmlsZVR5cGVTd2l0Y2goKTtcclxuICAgIGNvbnN0IGRvd25sb2FkQnRuID0gZG93bmxvYWRCdXR0dG9uKCk7XHJcbiAgICBjb25zdCBwcmludEJ0biA9IG1ha2VCdG4oJ3ByaW50JywgJ3ByaW50LWJ0biBidG4nKTtcclxuICAgIGNvbnN0IHNoYXJlQnRuID0gbWFrZUJ0bignc2hhcmUnLCAnc2hhcmUtYnRuIGJ0bicpO1xyXG4gICAgY29uc3QgY2xvc2VCdG4gPSBtYWtlQnRuKCdjbG9zZScsICdjbG9zZS1idG4gYnRuJyk7XHJcbiAgICBjb25zdCBjb2x1bW4xID0gZWxDbGFzcygnZGl2JywgJ29wdGlvbnMtdmlldycpO1xyXG4gICAgY29uc3QgY29sdW1uMiA9IGVsQ2xhc3MoJ2RpdicsICdvcHRpb25zLWFjdGlvbnMnKTtcclxuXHJcblxyXG4gICAgY2xvc2VCdG4ub25jbGljayA9IGNsb3NlTW9kYWw7XHJcblxyXG4gICAgbWVudS5hcHBlbmRDaGlsZChjb2x1bW4xKTtcclxuICAgIG1lbnUuYXBwZW5kQ2hpbGQoY29sdW1uMik7XHJcblxyXG5cclxuICAgIGNvbHVtbjEuYXBwZW5kQ2hpbGQoZHJvcGRvd24pO1xyXG4gICAgY29sdW1uMS5hcHBlbmRDaGlsZChzd2l0Y2hCdG4pO1xyXG5cclxuICAgIGNvbHVtbjIuYXBwZW5kQ2hpbGQoZG93bmxvYWRCdG4pO1xyXG4gICAgY29sdW1uMi5hcHBlbmRDaGlsZChwcmludEJ0bik7XHJcbiAgICBjb2x1bW4yLmFwcGVuZENoaWxkKHNoYXJlQnRuKTtcclxuICAgIGNvbHVtbjIuYXBwZW5kQ2hpbGQoY2xvc2VCdG4pO1xyXG5cclxuICAgIHByaW50QnRuLmlubmVySFRNTCA9ICdwcmludCc7XHJcblxyXG4gICAgcmV0dXJuIG1lbnU7XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcubW9kYWwtYmFja2dyb3VuZCcpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW9kYWxDb250ZW50KCkge1xyXG4gICAgY29uc3QgaWZyYW1lID0gZWxDbGFzcygnaWZyYW1lJywgJ3Jlc3VtZS12aWV3ZXInKTtcclxuICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3NyYycsICdodHRwczovL2JyYXN0cnVsbG8uZ2l0aHViLmlvL3Jlc3VtZS8nKTtcclxuICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ3Jlc3VtZScpO1xyXG4gICAgaWZyYW1lLmlubmVySFRNTCA9ICc8cD5Zb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBpZnJhbWVzLjwvcD4nO1xyXG4gICAgcmV0dXJuIGlmcmFtZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRvY1ZpZXdEcm9wZG93bigpIHtcclxuICAgIGNvbnN0IGRyb3Bkb3duID0gZWxDbGFzcygnc2VsZWN0JywgJ2RvYy12aWV3Jyk7XHJcbiAgICBkcm9wZG93bi5pbm5lckhUTUwgPSBgXHJcbiAgICAgIDxvcHRpb24gdmFsdWU9J2h0bWwnIHNlbGVjdGVkPkhUTUw8L29wdGlvbj5cclxuICAgICAgPG9wdGlvbiB2YWx1ZT0ncGRmJz5QREYvRE9DPC9vcHRpb24+XHJcbiAgICBgO1xyXG5cclxuICAgIGRyb3Bkb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZVZpZXcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKSB7XHJcbiAgICAgIGZpbGUuc2V0VmFsKHRoaXMudmFsdWUpO1xyXG4gICAgICB2aWV3SGFuZGxlcigpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRyb3Bkb3duO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZmlsZVR5cGVTd2l0Y2goKSB7XHJcbiAgICBjb25zdCBzd2l0Y2hCdG4gPSBlbENsYXNzKCdsYWJlbCcsICdmaWxlLXR5cGUgc3dpdGNoIGhpZGRlbicpO1xyXG4gICAgY29uc3QgY2hlY2tib3ggPSBlbENsYXNzKCdpbnB1dCcsICdmaWxlLXR5cGUgY2hlY2tib3gnKTtcclxuICAgIGNvbnN0IHNsaWRlciA9IGVsQ2xhc3MoJ3NwYW4nLCAnZmlsZS10eXBlIHNsaWRlciByb3VuZCcpO1xyXG5cclxuICAgIGNoZWNrYm94LnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xyXG4gICAgc3dpdGNoQnRuLmFwcGVuZENoaWxkKGNoZWNrYm94KTtcclxuICAgIHN3aXRjaEJ0bi5hcHBlbmRDaGlsZChzbGlkZXIpO1xyXG5cclxuICAgIHN3aXRjaEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUZpbGVUeXBlKTtcclxuICAgIHJldHVybiBzd2l0Y2hCdG47XHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlRmlsZVR5cGUoKSB7XHJcbiAgICAgIGNvbnN0IGRvd25sb2FkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvd25sb2FkLWJ0bi5idG4nKTtcclxuICAgICAgY29uc3QgcHJpbnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJpbnQtYnRuLmJ0bicpO1xyXG5cclxuICAgICAgY29uc3QgdmFsID0gY2hlY2tib3guY2hlY2tlZCA/ICdkb2MnIDogJ3BkZic7XHJcbiAgICAgIGZpbGUuc2V0VmFsKHZhbCk7XHJcbiAgICAgIGRvd25sb2FkQnRuLnNldEF0dHJpYnV0ZSgnaHJlZicsIGZpbGUuZ2V0U3JjKCkpO1xyXG4gICAgICBkb3dubG9hZEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgYGJyYXN0cnVsbG8tanNkZXYtcmVzdW1lLiR7dmFsfWApO1xyXG4gICAgICBkb3dubG9hZEJ0bi5pbm5lckhUTUwgPSAnZG93bmxvYWQgJztcclxuXHJcbiAgICAgIHByaW50QnRuLnNldEF0dHJpYnV0ZSgncHJpbnQnLCBmaWxlLmdldFNyYygpKTtcclxuICAgICAgcHJpbnRCdG4uaW5uZXJIVE1MID0gJ3ByaW50JztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRvd25sb2FkQnV0dHRvbigpIHtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGVsQ2xhc3MoJ2EnLCAnZG93bmxvYWQtYnRuIGJ0biBoaWRkZW4nKTtcclxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnaHR0cHM6Ly9icmFzdHJ1bGxvLmdpdGh1Yi5pby9yZXN1bWUvQnJhZFItSlNEZXYucGRmJyk7XHJcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsICdicmFzdHJ1bGxvLWpzZGV2LXJlc3VtZS5wZGYnKTtcclxuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSAnZG93bmxvYWQnO1xyXG4gICAgcmV0dXJuIGJ1dHRvbjtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9nbygpIHtcbiAgY29uc3QgbWFpbkxvZ28gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNoYWRvd1xuICBtYWluTG9nby5pbm5lckhUTUwgPSBgXG4gICAgPHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIGNsYXNzPSdzdmctbG9nbycgd2lkdGg9JzIwMCcgaGVpZ2h0PScyMDAnIHZpZXdib3g9JzAgMCA1MDAgNTAwJz5cbiAgICAgIDxnPlxuICAgICAgICA8dGV4dCB4PScxMTAnIHk9JzI1MCcgZm9udC1mYW1pbHk9J0hlbHZldGljYScgZm9udC1zaXplPScxODAnIGZpbGw9J3JnYmEoMzAsIDMwLCAzMCwgLjgpJz5cbiAgICAgICAgICBifHxyXG4gICAgICAgIDwvdGV4dD5cbiAgICAgICAgPHBhdGggaWQ9J2xvYWRpbmdCYXInIGQ9J005MCAzMzAgaCAzMjAnIHN0eWxlPSdvcGFjaXR5OiAwOycgc3Ryb2tlLXdpZHRoPTIwIHN0cm9rZT0ncmdiYSgyMzAsIDIzMCwgMjMwLCAuOCknIC8+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gIGA7XG4gIHJldHVybiBtYWluTG9nbztcbn1cbiIsIi8vIGNzcyBjbGFzcz1cInN2Zy0neCdjaGV2cm9uXCJcclxuaW1wb3J0IHsgZWxDbGFzcywgbWFrZUJ0biB9IGZyb20gJy4uLy4uL3V0aWxzJztcclxuXHJcbmZ1bmN0aW9uIHVwQ2hldnJvbigpIHtcclxuICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gIGZyYWcuaW5uZXJIVE1MID0gYFxyXG4gICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3M9XCJzdmctdXBjaGV2cm9uXCIgd2lkdGg9XCI4MFwiIHZpZXdib3g9XCIwIDAgMzAgMTJcIj5cclxuICAgICAgPHBhdGggc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZD1cIk0yIDEwIEwgMTUgMiBMIDI4IDEwXCIvPlxyXG4gICAgPC9zdmc+XHJcbiAgYDtcclxuICByZXR1cm4gZnJhZztcclxufVxyXG5cclxuZnVuY3Rpb24gZG93bkNoZXZyb24oKSB7XHJcbiAgY29uc3QgYnV0dG9uID0gbWFrZUJ0bignc2Nyb2xsZG93bicsICdzY3JvbGxkb3duJyk7XHJcbiAgYnV0dG9uLmlubmVySFRNTCA9IGBcclxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLWRvd25jaGV2cm9uXCIgd2lkdGg9XCI4MFwiIHZpZXdib3g9XCIwIDAgMzAgMThcIj5cclxuICAgICAgPHRleHQgeD1cIjVcIiB5PVwiNFwiIGZvbnQtc2l6ZT1cIjRcIiBmb250LWZhbWlseT1cInNhbnMtc2VyaWZcIj5zY3JvbGwgZG93bjwvdGV4dD5cclxuICAgICAgPHBhdGggY2xhc3M9XCJhbmltYXRlLWRvd25jaGV2cm9uXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZD1cIk0yIDcgTCAxNSAxNSBMIDI4IDdcIi8+XHJcbiAgICA8L3N2Zz5cclxuICBgO1xyXG4gIHJldHVybiBidXR0b247XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlZnRDaGV2cm9uKCkge1xyXG4gIHJldHVybiBgXHJcbiAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3M9XCJzdmctbGVmdGNoZXZyb25cIiBoZWlnaHQ9XCI4MFwiIHZpZXdib3g9XCIwIDAgMTIgMzBcIj5cclxuICAgIDxwYXRoIHN0cm9rZS13aWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGQ9XCJNMTAgMiBMIDIgMTUgTCAxMCAyOFwiLz5cclxuICA8L3N2Zz5cclxuIGA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJpZ2h0Q2hldnJvbigpIHtcclxuICByZXR1cm4gYFxyXG4gICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3M9XCJzdmctcmlnaHRjaGV2cm9uXCIgaGVpZ2h0PVwiODBcIiB2aWV3Ym94PVwiMCAwIDEyIDMwXCI+XHJcbiAgICAgIDxwYXRoIHN0cm9rZS13aWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGQ9XCJNMiAyIEwgMTAgMTUgTCAyIDI4XCIvPlxyXG4gICAgPC9zdmc+XHJcbiAgYDtcclxufVxyXG5cclxuZXhwb3J0IHsgdXBDaGV2cm9uLCBkb3duQ2hldnJvbiwgbGVmdENoZXZyb24sIHJpZ2h0Q2hldnJvbiB9O1xyXG4iLCIvKiBnbG9iYWwgVmVsb2NpdHkgKi9cblxuY29uc3QgVmVsb2NpdHkgPSByZXF1aXJlKCcuLi8uLi9ub2RlX21vZHVsZXMvdmVsb2NpdHktYW5pbWF0ZS92ZWxvY2l0eS5taW4uanMnKTtcbnJlcXVpcmUoJy4uLy4uL25vZGVfbW9kdWxlcy92ZWxvY2l0eS1hbmltYXRlL3ZlbG9jaXR5LnVpLm1pbi5qcycpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1idXR0b24nKTtcbiAgY29uc3QgaG9tZUxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWhvbWUnKTtcbiAgY29uc3QgdGV4dCA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCd0ZXh0Jyk7XG5cbiAgYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnb2ZmJykgPyBzaG93TWVudSgpIDogY2xvc2VNZW51KCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuICBmdW5jdGlvbiBzaG93TWVudSgpIHtcbiAgICBidXR0b24uY2xhc3NMaXN0ID0gYnV0dG9uLmNsYXNzTmFtZS5yZXBsYWNlKC9cXGIob2ZmKS8sICdvbicpO1xuICAgIHN0YWdnZXIuc2hvdygpO1xuICAgIHRleHQuaW5uZXJIVE1MID0gJ2Nsb3NlJztcbiAgICBob21lTGluay5mb2N1cygpO1xuICAgIGFuaW1hdGVNZW51Lm9wZW4oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlTWVudSgpIHtcbiAgICBidXR0b24uY2xhc3NMaXN0ID0gYnV0dG9uLmNsYXNzTmFtZS5yZXBsYWNlKC9cXGIob24pLywgJ29mZicpO1xuICAgIHN0YWdnZXIuaGlkZSgpO1xuICAgIHRleHQuaW5uZXJIVE1MID0gJ21lbnUnO1xuICAgIGFuaW1hdGVNZW51LmNsb3NlKCk7XG4gIH1cbn1cblxuY29uc3Qgc3RhZ2dlciA9IChmdW5jdGlvbiBzdGFnZ2VyKCkge1xuICBjb25zdCBtYWluTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tbmF2Jyk7XG4gIGNvbnN0IG1lbnVJdGVtcyA9IG1haW5OYXYucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcbiAgY29uc3QgZGVsYXkgPSA4MDtcblxuICBmdW5jdGlvbiBzdGFnZ2VyU2hvdygpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgbWFpbk5hdi5zdHlsZSA9ICdkaXNwbGF5OiBibG9jayc7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gcnVuKCkge1xuICAgICAgaWYgKGkgPCBtZW51SXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIG1lbnVJdGVtc1tpXS5jbGFzc0xpc3QuYWRkKCdzaG93LW1lbnUtaXRlbScpO1xuICAgICAgICBzZXRUaW1lb3V0KHJ1biwgZGVsYXkpO1xuICAgICAgfVxuICAgICAgaSArPSAxO1xuICAgIH0sIGRlbGF5KTtcbiAgICBjbGVhclRpbWVvdXQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YWdnZXJIaWRlKCkge1xuICAgIGxldCBpID0gMDtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiBydW4oKSB7XG4gICAgICBpZiAoaSA8IG1lbnVJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgbWVudUl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3ctbWVudS1pdGVtJyk7XG4gICAgICAgIHNldFRpbWVvdXQocnVuLCBkZWxheSk7XG4gICAgICB9XG4gICAgICBpICs9IDE7XG4gICAgfSwgZGVsYXkpO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgbWFpbk5hdi5zdHlsZSA9ICdkaXNwbGF5OiBub25lJzsgfSwgZGVsYXkgKiBtZW51SXRlbXMubGVuZ3RoKTtcbiAgICBjbGVhclRpbWVvdXQoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2hvdzogc3RhZ2dlclNob3csXG4gICAgaGlkZTogc3RhZ2dlckhpZGUsXG4gIH07XG59KCkpO1xuXG5jb25zdCBhbmltYXRlTWVudSA9IChmdW5jdGlvbiBhbmltYXRlTWVudSgpIHtcbiAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWVudS1saW5lJyk7XG4gIGNvbnN0IGIxID0gc3ZnWzBdO1xuICBjb25zdCBiMiA9IHN2Z1sxXTtcbiAgY29uc3QgYjMgPSBzdmdbMl07XG5cbiAgZnVuY3Rpb24gYW5pbWF0ZU9wZW5CdG4oKSB7XG4gICAgY29uc3QgdG9wU2VxID0gW1xuICAgICAgeyBlOiBiMSwgcDogeyB0cmFuc2xhdGVZOiA2IH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgICAgeyBlOiBiMSwgcDogeyByb3RhdGVaOiA0NSB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICBdO1xuICAgIGNvbnN0IGJvdHRvbVNlcSA9IFtcbiAgICAgIHsgZTogYjMsIHA6IHsgdHJhbnNsYXRlWTogLTYgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgICB7IGU6IGIzLCBwOiB7IHJvdGF0ZVo6IC00NSB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICBdO1xuXG4gICAgYjEuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0tb3JpZ2luJywgJ2NlbnRlciBjZW50ZXIgMCcpO1xuICAgIGIzLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtLW9yaWdpbicsICdjZW50ZXIgY2VudGVyIDAnKTtcbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZSh0b3BTZXEpO1xuICAgIFZlbG9jaXR5KGIyLCB7IG9wYWNpdHk6IDAgfSwgMTAwKTtcbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZShib3R0b21TZXEpO1xuICB9XG5cbiAgZnVuY3Rpb24gYW5pbWF0ZUNsb3NlQnRuKCkge1xuICAgIGNvbnN0IHRvcExpbmUgPSBbXG4gICAgICB7IGU6IGIxLCBwOiB7IHJvdGF0ZVo6IDAgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgICB7IGU6IGIxLCBwOiB7IHRyYW5zbGF0ZVk6IDAgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgXTtcbiAgICBjb25zdCBib3R0b21MaW5lID0gW1xuICAgICAgeyBlOiBiMywgcDogeyByb3RhdGVaOiAwIH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgICAgeyBlOiBiMywgcDogeyB0cmFuc2xhdGVZOiAwIH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgIF07XG5cbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZSh0b3BMaW5lKTtcbiAgICBWZWxvY2l0eShiMiwgJ3JldmVyc2UnLCAxMDApO1xuICAgIFZlbG9jaXR5LlJ1blNlcXVlbmNlKGJvdHRvbUxpbmUpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBvcGVuOiBhbmltYXRlT3BlbkJ0bixcbiAgICBjbG9zZTogYW5pbWF0ZUNsb3NlQnRuLFxuICB9O1xufSgpKTtcbiIsImltcG9ydCBmaWxlIGZyb20gJy4vZG9jSGFuZGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHZpZXdIYW5kbGVyKCkge1xuICBjb25zdCBkb3dubG9hZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZC1idG4uYnRuJyk7XG4gIGNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXN1bWUtdmlld2VyJyk7XG4gIGNvbnN0IHN3aXRjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXR5cGUuc3dpdGNoJyk7XG5cbiAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3JjJywgZmlsZS5nZXRTcmMoKSk7XG5cbiAgc3dpdGNoIChmaWxlLmdldFZhbCgpKSB7XG4gICAgY2FzZSAnaHRtbCc6XG4gICAgICBzd2l0Y2hCdG4uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICBzd2l0Y2hCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgIGRvd25sb2FkQnRuLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgZG93bmxvYWRCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgIGRvd25sb2FkQnRuLnJlbW92ZUF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdwZGYnOlxuICAgIGNhc2UgJ2RvYyc6XG4gICAgICBzd2l0Y2hCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICBzd2l0Y2hCdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgZG93bmxvYWRCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICBkb3dubG9hZEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbn1cbiIsIi8qIGVzbGludCBpbXBvcnQvZmlyc3Q6IDAgbm8tdW5kZWY6IDAgKi9cclxuaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XHJcbmltcG9ydCB0b2dnbGVNZW51IGZyb20gJy4vY29tcG9uZW50cy90b2dnbGVNZW51JztcclxuaW1wb3J0IG1vZGFsIGZyb20gJy4vY29tcG9uZW50cy9tb2RhbCc7XHJcbmltcG9ydCBmaWxlIGZyb20gJy4vY29tcG9uZW50cy9kb2NIYW5kbGVyJztcclxuaW1wb3J0IHsgZG93bkNoZXZyb24gfSBmcm9tICcuL2NvbXBvbmVudHMvc3ZnL3Njcm9sbENoZXZyb24nO1xyXG5pbXBvcnQgbG9hZGVyIGZyb20gJy4vY29tcG9uZW50cy9pbXBvcnRMb2FkZXInO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xyXG4gIGNvbnN0IG1lbnVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1idXR0b24nKTtcclxuICBjb25zdCByZXN1bWVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdW1lVmlld2VyJyk7XHJcbiAgY29uc3QgaG9tZVNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1ob21lJyk7XHJcbiAgY29uc3Qgc2Nyb2xsQ2hldnJvbiA9IGRvd25DaGV2cm9uKCk7XHJcblxyXG4gIG1lbnVCdXR0b24ub25jbGljayA9IHRvZ2dsZU1lbnU7XHJcbiAgcmVzdW1lQnV0dG9uLm9uY2xpY2sgPSBtb2RhbDtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY3IteWVhcicpLmlubmVySFRNTCA9IGAtICR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfWA7XHJcblxyXG4gIGxvYWRlcigpO1xyXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUgPSAnZGlzcGxheTogYmxvY2snO1xyXG4gIG1lbnVCdXR0b24uZm9jdXMoKTtcclxuICBob21lU2VjdGlvbi5hcHBlbmRDaGlsZChzY3JvbGxDaGV2cm9uKTtcclxuICByZXR1cm4gZXZlbnQ7XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBlbENsYXNzKGVsZW1lbnQgPSAnZGl2JywgY2xhc3NlcyA9IDApIHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnQpO1xuICBlbC5jbGFzc0xpc3QgPSBjbGFzc2VzO1xuICByZXR1cm4gZWw7XG59XG5cbmZ1bmN0aW9uIG1ha2VCdG4obmFtZSwgY2xhc3NlcyA9IDApIHtcbiAgY29uc3QgYnV0dG9uID0gZWxDbGFzcygnYnV0dG9uJywgY2xhc3Nlcyk7XG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBuYW1lKTtcbiAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgYnV0dG9uLmlubmVySFRNTCA9IG5hbWU7XG4gIHJldHVybiBidXR0b247XG59XG5cbmV4cG9ydCB7IGVsQ2xhc3MsIG1ha2VCdG4gfTtcbiJdfQ==
