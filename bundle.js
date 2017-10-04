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
    var endPipe = (0, _utils.elClass)('div', 'end-pipe');
    endPipe.innerHTML = '|';
    var str = el;
    str.innerHTML = str.innerHTML.toUpperCase() + ' |';
    str.appendChild(endPipe);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi13ZWFrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2tleW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21hdGgtZXhwbTEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19tYXRoLWxvZzFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWF0aC1zaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21pY3JvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcG4tZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC10by1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX293bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcGFydGlhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3BhdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zYW1lLXZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctcGFkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLXJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdHlwZWQtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC1idWZmZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MtZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmluZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lm9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguYWNvc2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmFzaW5oLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5hdGFuaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY2JydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY2x6MzIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmNvc2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmV4cG0xLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5mcm91bmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmh5cG90LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5pbXVsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5sb2cxMC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgubG9nMXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmxvZzIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnNpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnNpbmguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnRhbmguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnRydW5jLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmVwc2lsb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtZmluaXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmlzLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtbmFuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmlzLXNhZmUtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5tYXgtc2FmZS1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLm1pbi1zYWZlLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5hcHBseS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuY29uc3RydWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlbGV0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5nZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5nZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0Lmhhcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuaXMtZXh0ZW5zaWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3Qub3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LnByZXZlbnQtZXh0ZW5zaW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3Quc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLmZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLm1hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuc2VhcmNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnNwbGl0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmNvZGUtcG9pbnQtYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuZW5kcy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yYXcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcucmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuYXJyYXktYnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuZmxvYXQzMi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLmZsb2F0NjQtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC5pbnQxNi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLmludDMyLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuaW50OC1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLnVpbnQxNi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLnVpbnQzMi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLnVpbnQ4LWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQudWludDgtY2xhbXBlZC1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYud2Vhay1zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5hcnJheS5pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5lbnRyaWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QudmFsdWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3RyaW5nLnBhZC1lbmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcucGFkLXN0YXJ0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuaW1tZWRpYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIudGltZXJzLmpzIiwibm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlc1xcdmVsb2NpdHktYW5pbWF0ZVxcdmVsb2NpdHkubWluLmpzIiwibm9kZV9tb2R1bGVzXFx2ZWxvY2l0eS1hbmltYXRlXFx2ZWxvY2l0eS51aS5taW4uanMiLCJzcmNcXGNvbXBvbmVudHNcXGFuaW1hdGVNZW51SXRlbS5qcyIsInNyY1xcY29tcG9uZW50c1xcZGltVUkuanMiLCJzcmNcXGNvbXBvbmVudHNcXGRvY0hhbmRsZXIuanMiLCJzcmNcXGNvbXBvbmVudHNcXGltcG9ydExvYWRlci5qcyIsInNyY1xcY29tcG9uZW50c1xcaW50cm9BbmltYXRpb24uanMiLCJzcmNcXGNvbXBvbmVudHNcXGxvYWRpbmdTY3JlZW4uanMiLCJzcmNcXGNvbXBvbmVudHNcXG1vZGFsLmpzIiwic3JjXFxjb21wb25lbnRzXFxzdmdcXGxvZ28uanMiLCJzcmNcXGNvbXBvbmVudHNcXHN2Z1xcc2Nyb2xsQ2hldnJvbi5qcyIsInNyY1xcY29tcG9uZW50c1xcdG9nZ2xlTWVudS5qcyIsInNyY1xcY29tcG9uZW50c1xcdmlld0hhbmRsZXIuanMiLCJzcmNcXHNjcmlwdC5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTs7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDaHVCQTtBQUNBO0FBQ0EsQ0FBQyxVQUFTLENBQVQsRUFBVztBQUFDO0FBQWEsV0FBUyxDQUFULENBQVcsQ0FBWCxFQUFhO0FBQUMsUUFBSSxJQUFFLEVBQUUsTUFBUjtBQUFBLFFB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LFNBQVMsYUFBVCxDQUF1QixlQUF2QixDQUFyQjtBQUNBLE1BQU0sY0FBYyxTQUFTLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBcEI7QUFDQSxNQUFNLGdCQUFnQixpQ0FBdEI7O0FBRUEsYUFBVyxPQUFYO0FBQ0EsZUFBYSxPQUFiO0FBQ0EsV0FBUyxhQUFULENBQXVCLFVBQXZCLEVBQW1DLFNBQW5DLFVBQW9ELElBQUksSUFBSixHQUFXLFdBQVgsRUFBcEQ7O0FBRUE7QUFDQSxXQUFTLElBQVQsQ0FBYyxLQUFkLEdBQXNCLGdCQUF0QjtBQUNBLGFBQVcsS0FBWDtBQUNBLGNBQVksV0FBWixDQUF3QixhQUF4QjtBQUNBLFNBQU8sS0FBUDtBQUNELENBZkQsRSxDQVJBOzs7Ozs7OztBQ0FBLFNBQVMsT0FBVCxHQUErQztBQUFBLE1BQTlCLE9BQThCLHVFQUFwQixLQUFvQjtBQUFBLE1BQWIsT0FBYSx1RUFBSCxDQUFHOztBQUM3QyxNQUFNLEtBQUssU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQVg7QUFDQSxLQUFHLFNBQUgsR0FBZSxPQUFmO0FBQ0EsU0FBTyxFQUFQO0FBQ0Q7O0FBRUQsU0FBUyxPQUFULENBQWlCLElBQWpCLEVBQW9DO0FBQUEsTUFBYixPQUFhLHVFQUFILENBQUc7O0FBQ2xDLE1BQU0sU0FBUyxRQUFRLFFBQVIsRUFBa0IsT0FBbEIsQ0FBZjtBQUNBLFNBQU8sWUFBUCxDQUFvQixNQUFwQixFQUE0QixJQUE1QjtBQUNBLFNBQU8sWUFBUCxDQUFvQixNQUFwQixFQUE0QixRQUE1QjtBQUNBLFNBQU8sU0FBUCxHQUFtQixJQUFuQjtBQUNBLFNBQU8sTUFBUDtBQUNEOztRQUVRLE8sR0FBQSxPO1FBQVMsTyxHQUFBLE8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gMjIuMS4zLjMxIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxudmFyIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3Vuc2NvcGFibGVzJylcbiAgLCBBcnJheVByb3RvICA9IEFycmF5LnByb3RvdHlwZTtcbmlmKEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdID09IHVuZGVmaW5lZClyZXF1aXJlKCcuL19oaWRlJykoQXJyYXlQcm90bywgVU5TQ09QQUJMRVMsIHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgQXJyYXlQcm90b1tVTlNDT1BBQkxFU11ba2V5XSA9IHRydWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKXtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gMjIuMS4zLjMgQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kID0gdGhpcy5sZW5ndGgpXG4ndXNlIHN0cmljdCc7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIHRvSW5kZXggID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKVxuICAsIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gW10uY29weVdpdGhpbiB8fCBmdW5jdGlvbiBjb3B5V2l0aGluKHRhcmdldC8qPSAwKi8sIHN0YXJ0Lyo9IDAsIGVuZCA9IEBsZW5ndGgqLyl7XG4gIHZhciBPICAgICA9IHRvT2JqZWN0KHRoaXMpXG4gICAgLCBsZW4gICA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICwgdG8gICAgPSB0b0luZGV4KHRhcmdldCwgbGVuKVxuICAgICwgZnJvbSAgPSB0b0luZGV4KHN0YXJ0LCBsZW4pXG4gICAgLCBlbmQgICA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkXG4gICAgLCBjb3VudCA9IE1hdGgubWluKChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IHRvSW5kZXgoZW5kLCBsZW4pKSAtIGZyb20sIGxlbiAtIHRvKVxuICAgICwgaW5jICAgPSAxO1xuICBpZihmcm9tIDwgdG8gJiYgdG8gPCBmcm9tICsgY291bnQpe1xuICAgIGluYyAgPSAtMTtcbiAgICBmcm9tICs9IGNvdW50IC0gMTtcbiAgICB0byAgICs9IGNvdW50IC0gMTtcbiAgfVxuICB3aGlsZShjb3VudC0tID4gMCl7XG4gICAgaWYoZnJvbSBpbiBPKU9bdG9dID0gT1tmcm9tXTtcbiAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcbiAgICB0byAgICs9IGluYztcbiAgICBmcm9tICs9IGluYztcbiAgfSByZXR1cm4gTztcbn07IiwiLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG4ndXNlIHN0cmljdCc7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIHRvSW5kZXggID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKVxuICAsIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyosIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XG4gIHZhciBPICAgICAgPSB0b09iamVjdCh0aGlzKVxuICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgLCBhTGVuICAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSB0b0luZGV4KGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCBsZW5ndGgpXG4gICAgLCBlbmQgICAgPSBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZFxuICAgICwgZW5kUG9zID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0luZGV4KGVuZCwgbGVuZ3RoKTtcbiAgd2hpbGUoZW5kUG9zID4gaW5kZXgpT1tpbmRleCsrXSA9IHZhbHVlO1xuICByZXR1cm4gTztcbn07IiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGFzYyAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVFlQRSwgJGNyZWF0ZSl7XG4gIHZhciBJU19NQVAgICAgICAgID0gVFlQRSA9PSAxXG4gICAgLCBJU19GSUxURVIgICAgID0gVFlQRSA9PSAyXG4gICAgLCBJU19TT01FICAgICAgID0gVFlQRSA9PSAzXG4gICAgLCBJU19FVkVSWSAgICAgID0gVFlQRSA9PSA0XG4gICAgLCBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2XG4gICAgLCBOT19IT0xFUyAgICAgID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVhcbiAgICAsIGNyZWF0ZSAgICAgICAgPSAkY3JlYXRlIHx8IGFzYztcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KXtcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QoJHRoaXMpXG4gICAgICAsIHNlbGYgICA9IElPYmplY3QoTylcbiAgICAgICwgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAwXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWRcbiAgICAgICwgdmFsLCByZXM7XG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmKFRZUEUpe1xuICAgICAgICBpZihJU19NQVApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKFRZUEUpe1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYoSVNfRVZFUlkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGlzQXJyYXkgID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKVxuICAsIFNQRUNJRVMgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbCl7XG4gIHZhciBDO1xuICBpZihpc0FycmF5KG9yaWdpbmFsKSl7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKUMgPSB1bmRlZmluZWQ7XG4gICAgaWYoaXNPYmplY3QoQykpe1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZihDID09PSBudWxsKUMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59OyIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxlbmd0aCl7XG4gIHJldHVybiBuZXcgKHNwZWNpZXNDb25zdHJ1Y3RvcihvcmlnaW5hbCkpKGxlbmd0aCk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBhRnVuY3Rpb24gID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgaXNPYmplY3QgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaW52b2tlICAgICA9IHJlcXVpcmUoJy4vX2ludm9rZScpXG4gICwgYXJyYXlTbGljZSA9IFtdLnNsaWNlXG4gICwgZmFjdG9yaWVzICA9IHt9O1xuXG52YXIgY29uc3RydWN0ID0gZnVuY3Rpb24oRiwgbGVuLCBhcmdzKXtcbiAgaWYoIShsZW4gaW4gZmFjdG9yaWVzKSl7XG4gICAgZm9yKHZhciBuID0gW10sIGkgPSAwOyBpIDwgbGVuOyBpKyspbltpXSA9ICdhWycgKyBpICsgJ10nO1xuICAgIGZhY3Rvcmllc1tsZW5dID0gRnVuY3Rpb24oJ0YsYScsICdyZXR1cm4gbmV3IEYoJyArIG4uam9pbignLCcpICsgJyknKTtcbiAgfSByZXR1cm4gZmFjdG9yaWVzW2xlbl0oRiwgYXJncyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLmJpbmQgfHwgZnVuY3Rpb24gYmluZCh0aGF0IC8qLCBhcmdzLi4uICovKXtcbiAgdmFyIGZuICAgICAgID0gYUZ1bmN0aW9uKHRoaXMpXG4gICAgLCBwYXJ0QXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgYm91bmQgPSBmdW5jdGlvbigvKiBhcmdzLi4uICovKXtcbiAgICB2YXIgYXJncyA9IHBhcnRBcmdzLmNvbmNhdChhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBib3VuZCA/IGNvbnN0cnVjdChmbiwgYXJncy5sZW5ndGgsIGFyZ3MpIDogaW52b2tlKGZuLCBhcmdzLCB0aGF0KTtcbiAgfTtcbiAgaWYoaXNPYmplY3QoZm4ucHJvdG90eXBlKSlib3VuZC5wcm90b3R5cGUgPSBmbi5wcm90b3R5cGU7XG4gIHJldHVybiBib3VuZDtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBjcmVhdGUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgYW5JbnN0YW5jZSAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZGVmaW5lZCAgICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJylcbiAgLCBmb3JPZiAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpXG4gICwgc3RlcCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIHNldFNwZWNpZXMgID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIGZhc3RLZXkgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXlcbiAgLCBTSVpFICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24odGhhdCwga2V5KXtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XG4gIGlmKGluZGV4ICE9PSAnRicpcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5faSA9IGNyZWF0ZShudWxsKTsgLy8gaW5kZXhcbiAgICAgIHRoYXQuX2YgPSB1bmRlZmluZWQ7ICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAvLyBzaXplXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCl7XG4gICAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZihlbnRyeSl7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uXG4gICAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKHByZXYpcHJldi5uID0gbmV4dDtcbiAgICAgICAgICBpZihuZXh0KW5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYodGhhdC5fZiA9PSBlbnRyeSl0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZih0aGF0Ll9sID09IGVudHJ5KXRoYXQuX2wgPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCAnZm9yRWFjaCcpO1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMylcbiAgICAgICAgICAsIGVudHJ5O1xuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2Ype1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoREVTQ1JJUFRPUlMpZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZGVmaW5lZCh0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0Ll9mKXRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmKHByZXYpcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmKGluZGV4ICE9PSAnRicpdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgdGhpcy5fdCA9IGl0ZXJhdGVkOyAgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICwga2luZCAgPSB0aGF0Ll9rXG4gICAgICAgICwgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKXtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgcmVkZWZpbmVBbGwgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGdldFdlYWsgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLmdldFdlYWtcbiAgLCBhbk9iamVjdCAgICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgaXNPYmplY3QgICAgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFuSW5zdGFuY2UgICAgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGZvck9mICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBjcmVhdGVBcnJheU1ldGhvZCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKVxuICAsICRoYXMgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBhcnJheUZpbmQgICAgICAgICA9IGNyZWF0ZUFycmF5TWV0aG9kKDUpXG4gICwgYXJyYXlGaW5kSW5kZXggICAgPSBjcmVhdGVBcnJheU1ldGhvZCg2KVxuICAsIGlkICAgICAgICAgICAgICAgID0gMDtcblxuLy8gZmFsbGJhY2sgZm9yIHVuY2F1Z2h0IGZyb3plbiBrZXlzXG52YXIgdW5jYXVnaHRGcm96ZW5TdG9yZSA9IGZ1bmN0aW9uKHRoYXQpe1xuICByZXR1cm4gdGhhdC5fbCB8fCAodGhhdC5fbCA9IG5ldyBVbmNhdWdodEZyb3plblN0b3JlKTtcbn07XG52YXIgVW5jYXVnaHRGcm96ZW5TdG9yZSA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuYSA9IFtdO1xufTtcbnZhciBmaW5kVW5jYXVnaHRGcm96ZW4gPSBmdW5jdGlvbihzdG9yZSwga2V5KXtcbiAgcmV0dXJuIGFycmF5RmluZChzdG9yZS5hLCBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0WzBdID09PSBrZXk7XG4gIH0pO1xufTtcblVuY2F1Z2h0RnJvemVuU3RvcmUucHJvdG90eXBlID0ge1xuICBnZXQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgdmFyIGVudHJ5ID0gZmluZFVuY2F1Z2h0RnJvemVuKHRoaXMsIGtleSk7XG4gICAgaWYoZW50cnkpcmV0dXJuIGVudHJ5WzFdO1xuICB9LFxuICBoYXM6IGZ1bmN0aW9uKGtleSl7XG4gICAgcmV0dXJuICEhZmluZFVuY2F1Z2h0RnJvemVuKHRoaXMsIGtleSk7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgdmFyIGVudHJ5ID0gZmluZFVuY2F1Z2h0RnJvemVuKHRoaXMsIGtleSk7XG4gICAgaWYoZW50cnkpZW50cnlbMV0gPSB2YWx1ZTtcbiAgICBlbHNlIHRoaXMuYS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0sXG4gICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgIHZhciBpbmRleCA9IGFycmF5RmluZEluZGV4KHRoaXMuYSwgZnVuY3Rpb24oaXQpe1xuICAgICAgcmV0dXJuIGl0WzBdID09PSBrZXk7XG4gICAgfSk7XG4gICAgaWYofmluZGV4KXRoaXMuYS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiAhIX5pbmRleDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgaXRlcmFibGUpe1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX2kgPSBpZCsrOyAgICAgIC8vIGNvbGxlY3Rpb24gaWRcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7IC8vIGxlYWsgc3RvcmUgZm9yIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RzXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4zLjMuMiBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuNC4zLjMgV2Vha1NldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrKGtleSk7XG4gICAgICAgIGlmKGRhdGEgPT09IHRydWUpcmV0dXJuIHVuY2F1Z2h0RnJvemVuU3RvcmUodGhpcylbJ2RlbGV0ZSddKGtleSk7XG4gICAgICAgIHJldHVybiBkYXRhICYmICRoYXMoZGF0YSwgdGhpcy5faSkgJiYgZGVsZXRlIGRhdGFbdGhpcy5faV07XG4gICAgICB9LFxuICAgICAgLy8gMjMuMy4zLjQgV2Vha01hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjQuMy40IFdlYWtTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrKGtleSk7XG4gICAgICAgIGlmKGRhdGEgPT09IHRydWUpcmV0dXJuIHVuY2F1Z2h0RnJvemVuU3RvcmUodGhpcykuaGFzKGtleSk7XG4gICAgICAgIHJldHVybiBkYXRhICYmICRoYXMoZGF0YSwgdGhpcy5faSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24odGhhdCwga2V5LCB2YWx1ZSl7XG4gICAgdmFyIGRhdGEgPSBnZXRXZWFrKGFuT2JqZWN0KGtleSksIHRydWUpO1xuICAgIGlmKGRhdGEgPT09IHRydWUpdW5jYXVnaHRGcm96ZW5TdG9yZSh0aGF0KS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgZWxzZSBkYXRhW3RoYXQuX2ldID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIHVmc3RvcmU6IHVuY2F1Z2h0RnJvemVuU3RvcmVcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCAkZXhwb3J0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgcmVkZWZpbmVBbGwgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIG1ldGEgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpXG4gICwgZm9yT2YgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIGFuSW5zdGFuY2UgICAgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGlzT2JqZWN0ICAgICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBmYWlscyAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCAkaXRlckRldGVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JylcbiAgLCBzZXRUb1N0cmluZ1RhZyAgICA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBpbmhlcml0SWZSZXF1aXJlZCA9IHJlcXVpcmUoJy4vX2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FLCB3cmFwcGVyLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSyl7XG4gIHZhciBCYXNlICA9IGdsb2JhbFtOQU1FXVxuICAgICwgQyAgICAgPSBCYXNlXG4gICAgLCBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCdcbiAgICAsIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZVxuICAgICwgTyAgICAgPSB7fTtcbiAgdmFyIGZpeE1ldGhvZCA9IGZ1bmN0aW9uKEtFWSl7XG4gICAgdmFyIGZuID0gcHJvdG9bS0VZXTtcbiAgICByZWRlZmluZShwcm90bywgS0VZLFxuICAgICAgS0VZID09ICdkZWxldGUnID8gZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IGZhbHNlIDogZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpO1xuICAgICAgfSA6IEtFWSA9PSAnaGFzJyA/IGZ1bmN0aW9uIGhhcyhhKXtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gZmFsc2UgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdnZXQnID8gZnVuY3Rpb24gZ2V0KGEpe1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyB1bmRlZmluZWQgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdhZGQnID8gZnVuY3Rpb24gYWRkKGEpeyBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7IHJldHVybiB0aGlzOyB9XG4gICAgICAgIDogZnVuY3Rpb24gc2V0KGEsIGIpeyBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSwgYik7IHJldHVybiB0aGlzOyB9XG4gICAgKTtcbiAgfTtcbiAgaWYodHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSl7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnN0YW5jZSAgICAgICAgICAgICA9IG5ldyBDXG4gICAgICAvLyBlYXJseSBpbXBsZW1lbnRhdGlvbnMgbm90IHN1cHBvcnRzIGNoYWluaW5nXG4gICAgICAsIEhBU05UX0NIQUlOSU5HICAgICAgID0gaW5zdGFuY2VbQURERVJdKElTX1dFQUsgPyB7fSA6IC0wLCAxKSAhPSBpbnN0YW5jZVxuICAgICAgLy8gVjggfiAgQ2hyb21pdW0gNDAtIHdlYWstY29sbGVjdGlvbnMgdGhyb3dzIG9uIHByaW1pdGl2ZXMsIGJ1dCBzaG91bGQgcmV0dXJuIGZhbHNlXG4gICAgICAsIFRIUk9XU19PTl9QUklNSVRJVkVTID0gZmFpbHMoZnVuY3Rpb24oKXsgaW5zdGFuY2UuaGFzKDEpOyB9KVxuICAgICAgLy8gbW9zdCBlYXJseSBpbXBsZW1lbnRhdGlvbnMgZG9lc24ndCBzdXBwb3J0cyBpdGVyYWJsZXMsIG1vc3QgbW9kZXJuIC0gbm90IGNsb3NlIGl0IGNvcnJlY3RseVxuICAgICAgLCBBQ0NFUFRfSVRFUkFCTEVTICAgICA9ICRpdGVyRGV0ZWN0KGZ1bmN0aW9uKGl0ZXIpeyBuZXcgQyhpdGVyKTsgfSkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAgIC8vIGZvciBlYXJseSBpbXBsZW1lbnRhdGlvbnMgLTAgYW5kICswIG5vdCB0aGUgc2FtZVxuICAgICAgLCBCVUdHWV9aRVJPID0gIUlTX1dFQUsgJiYgZmFpbHMoZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gVjggfiBDaHJvbWl1bSA0Mi0gZmFpbHMgb25seSB3aXRoIDUrIGVsZW1lbnRzXG4gICAgICAgIHZhciAkaW5zdGFuY2UgPSBuZXcgQygpXG4gICAgICAgICAgLCBpbmRleCAgICAgPSA1O1xuICAgICAgICB3aGlsZShpbmRleC0tKSRpbnN0YW5jZVtBRERFUl0oaW5kZXgsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuICEkaW5zdGFuY2UuaGFzKC0wKTtcbiAgICAgIH0pO1xuICAgIGlmKCFBQ0NFUFRfSVRFUkFCTEVTKXsgXG4gICAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0YXJnZXQsIEMsIE5BTUUpO1xuICAgICAgICB2YXIgdGhhdCA9IGluaGVyaXRJZlJlcXVpcmVkKG5ldyBCYXNlLCB0YXJnZXQsIEMpO1xuICAgICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH0pO1xuICAgICAgQy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgIHByb3RvLmNvbnN0cnVjdG9yID0gQztcbiAgICB9XG4gICAgaWYoVEhST1dTX09OX1BSSU1JVElWRVMgfHwgQlVHR1lfWkVSTyl7XG4gICAgICBmaXhNZXRob2QoJ2RlbGV0ZScpO1xuICAgICAgZml4TWV0aG9kKCdoYXMnKTtcbiAgICAgIElTX01BUCAmJiBmaXhNZXRob2QoJ2dldCcpO1xuICAgIH1cbiAgICBpZihCVUdHWV9aRVJPIHx8IEhBU05UX0NIQUlOSU5HKWZpeE1ldGhvZChBRERFUik7XG4gICAgLy8gd2VhayBjb2xsZWN0aW9ucyBzaG91bGQgbm90IGNvbnRhaW5zIC5jbGVhciBtZXRob2RcbiAgICBpZihJU19XRUFLICYmIHByb3RvLmNsZWFyKWRlbGV0ZSBwcm90by5jbGVhcjtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChDICE9IEJhc2UpLCBPKTtcblxuICBpZighSVNfV0VBSyljb21tb24uc2V0U3Ryb25nKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjICAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBpbmRleCwgdmFsdWUpe1xuICBpZihpbmRleCBpbiBvYmplY3QpJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07IiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpOyIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKVxuICAsIHBJRSAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHJlc3VsdCAgICAgPSBnZXRLZXlzKGl0KVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgaWYoZ2V0U3ltYm9scyl7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KVxuICAgICAgLCBpc0VudW0gID0gcElFLmZcbiAgICAgICwgaSAgICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKHN5bWJvbHMubGVuZ3RoID4gaSlpZihpc0VudW0uY2FsbChpdCwga2V5ID0gc3ltYm9sc1tpKytdKSlyZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHJlZGVmaW5lICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KVxuICAgICwga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmKHRhcmdldClyZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZihleHBvcnRzW2tleV0gIT0gb3V0KWhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KWV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsInZhciBNQVRDSCA9IHJlcXVpcmUoJy4vX3drcycpKCdtYXRjaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVkpe1xuICB2YXIgcmUgPSAvLi87XG4gIHRyeSB7XG4gICAgJy8uLydbS0VZXShyZSk7XG4gIH0gY2F0Y2goZSl7XG4gICAgdHJ5IHtcbiAgICAgIHJlW01BVENIXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuICEnLy4vJ1tLRVldKHJlKTtcbiAgICB9IGNhdGNoKGYpeyAvKiBlbXB0eSAqLyB9XG4gIH0gcmV0dXJuIHRydWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBoaWRlICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGZhaWxzICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIGRlZmluZWQgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpXG4gICwgd2tzICAgICAgPSByZXF1aXJlKCcuL193a3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVksIGxlbmd0aCwgZXhlYyl7XG4gIHZhciBTWU1CT0wgICA9IHdrcyhLRVkpXG4gICAgLCBmbnMgICAgICA9IGV4ZWMoZGVmaW5lZCwgU1lNQk9MLCAnJ1tLRVldKVxuICAgICwgc3RyZm4gICAgPSBmbnNbMF1cbiAgICAsIHJ4Zm4gICAgID0gZm5zWzFdO1xuICBpZihmYWlscyhmdW5jdGlvbigpe1xuICAgIHZhciBPID0ge307XG4gICAgT1tTWU1CT0xdID0gZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH07XG4gICAgcmV0dXJuICcnW0tFWV0oTykgIT0gNztcbiAgfSkpe1xuICAgIHJlZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIEtFWSwgc3RyZm4pO1xuICAgIGhpZGUoUmVnRXhwLnByb3RvdHlwZSwgU1lNQk9MLCBsZW5ndGggPT0gMlxuICAgICAgLy8gMjEuMi41LjggUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdKHN0cmluZywgcmVwbGFjZVZhbHVlKVxuICAgICAgLy8gMjEuMi41LjExIFJlZ0V4cC5wcm90b3R5cGVbQEBzcGxpdF0oc3RyaW5nLCBsaW1pdClcbiAgICAgID8gZnVuY3Rpb24oc3RyaW5nLCBhcmcpeyByZXR1cm4gcnhmbi5jYWxsKHN0cmluZywgdGhpcywgYXJnKTsgfVxuICAgICAgLy8gMjEuMi41LjYgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXShzdHJpbmcpXG4gICAgICAvLyAyMS4yLjUuOSBSZWdFeHAucHJvdG90eXBlW0BAc2VhcmNoXShzdHJpbmcpXG4gICAgICA6IGZ1bmN0aW9uKHN0cmluZyl7IHJldHVybiByeGZuLmNhbGwoc3RyaW5nLCB0aGlzKTsgfVxuICAgICk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3NcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICB2YXIgdGhhdCAgID0gYW5PYmplY3QodGhpcylcbiAgICAsIHJlc3VsdCA9ICcnO1xuICBpZih0aGF0Lmdsb2JhbCkgICAgIHJlc3VsdCArPSAnZyc7XG4gIGlmKHRoYXQuaWdub3JlQ2FzZSkgcmVzdWx0ICs9ICdpJztcbiAgaWYodGhhdC5tdWx0aWxpbmUpICByZXN1bHQgKz0gJ20nO1xuICBpZih0aGF0LnVuaWNvZGUpICAgIHJlc3VsdCArPSAndSc7XG4gIGlmKHRoYXQuc3RpY2t5KSAgICAgcmVzdWx0ICs9ICd5JztcbiAgcmV0dXJuIHJlc3VsdDtcbn07IiwidmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKVxuICAsIEJSRUFLICAgICAgID0ge31cbiAgLCBSRVRVUk4gICAgICA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1Ipe1xuICB2YXIgaXRlckZuID0gSVRFUkFUT1IgPyBmdW5jdGlvbigpeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpXG4gICAgLCBmICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgKXtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLICA9IEJSRUFLO1xuZXhwb3J0cy5SRVRVUk4gPSBSRVRVUk47IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXQ7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRoYXQsIHRhcmdldCwgQyl7XG4gIHZhciBQLCBTID0gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuICBpZihTICE9PSBDICYmIHR5cGVvZiBTID09ICdmdW5jdGlvbicgJiYgKFAgPSBTLnByb3RvdHlwZSkgIT09IEMucHJvdG90eXBlICYmIGlzT2JqZWN0KFApICYmIHNldFByb3RvdHlwZU9mKXtcbiAgICBzZXRQcm90b3R5cGVPZih0aGF0LCBQKTtcbiAgfSByZXR1cm4gdGhhdDtcbn07IiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCIvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZmxvb3IgICAgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0ludGVnZXIoaXQpe1xuICByZXR1cm4gIWlzT2JqZWN0KGl0KSAmJiBpc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIDcuMi44IElzUmVnRXhwKGFyZ3VtZW50KVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBjb2YgICAgICA9IHJlcXVpcmUoJy4vX2NvZicpXG4gICwgTUFUQ0ggICAgPSByZXF1aXJlKCcuL193a3MnKSgnbWF0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgaXNSZWdFeHA7XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgKChpc1JlZ0V4cCA9IGl0W01BVENIXSkgIT09IHVuZGVmaW5lZCA/ICEhaXNSZWdFeHAgOiBjb2YoaXQpID09ICdSZWdFeHAnKTtcbn07IiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZGVzY3JpcHRvciAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCAkZW50cmllcyAgID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZFxuICAgICwgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmVcbiAgICAsIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJGFueU5hdGl2ZSl7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UpKTtcbiAgICBpZihJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSl7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsInZhciBJVEVSQVRPUiAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgcmV0dXJuIHtkb25lOiBzYWZlID0gdHJ1ZX07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsInZhciBnZXRLZXlzICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIGVsKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBrZXlzICAgPSBnZXRLZXlzKE8pXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaW5kZXggID0gMFxuICAgICwga2V5O1xuICB3aGlsZShsZW5ndGggPiBpbmRleClpZihPW2tleSA9IGtleXNbaW5kZXgrK11dID09PSBlbClyZXR1cm4ga2V5O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlOyIsIi8vIDIwLjIuMi4xNCBNYXRoLmV4cG0xKHgpXG52YXIgJGV4cG0xID0gTWF0aC5leHBtMTtcbm1vZHVsZS5leHBvcnRzID0gKCEkZXhwbTFcbiAgLy8gT2xkIEZGIGJ1Z1xuICB8fCAkZXhwbTEoMTApID4gMjIwMjUuNDY1Nzk0ODA2NzE5IHx8ICRleHBtMSgxMCkgPCAyMjAyNS40NjU3OTQ4MDY3MTY1MTY4XG4gIC8vIFRvciBCcm93c2VyIGJ1Z1xuICB8fCAkZXhwbTEoLTJlLTE3KSAhPSAtMmUtMTdcbikgPyBmdW5jdGlvbiBleHBtMSh4KXtcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogeCA+IC0xZS02ICYmIHggPCAxZS02ID8geCArIHggKiB4IC8gMiA6IE1hdGguZXhwKHgpIC0gMTtcbn0gOiAkZXhwbTE7IiwiLy8gMjAuMi4yLjIwIE1hdGgubG9nMXAoeClcbm1vZHVsZS5leHBvcnRzID0gTWF0aC5sb2cxcCB8fCBmdW5jdGlvbiBsb2cxcCh4KXtcbiAgcmV0dXJuICh4ID0gK3gpID4gLTFlLTggJiYgeCA8IDFlLTggPyB4IC0geCAqIHggLyAyIDogTWF0aC5sb2coMSArIHgpO1xufTsiLCIvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGguc2lnbiB8fCBmdW5jdGlvbiBzaWduKHgpe1xuICByZXR1cm4gKHggPSAreCkgPT0gMCB8fCB4ICE9IHggPyB4IDogeCA8IDAgPyAtMSA6IDE7XG59OyIsInZhciBNRVRBICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJylcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHNldERlc2MgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGlkICAgICAgID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uKGl0KXtcbiAgc2V0RGVzYyhpdCwgTUVUQSwge3ZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfX0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbihpdCl7XG4gIGlmKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSlzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogICAgICBNRVRBLFxuICBORUVEOiAgICAgZmFsc2UsXG4gIGZhc3RLZXk6ICBmYXN0S2V5LFxuICBnZXRXZWFrOiAgZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBPYnNlcnZlciAgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAsIHByb2Nlc3MgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgUHJvbWlzZSAgID0gZ2xvYmFsLlByb21pc2VcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgdmFyIGhlYWQsIGxhc3QsIG5vdGlmeTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbigpe1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKXBhcmVudC5leGl0KCk7XG4gICAgd2hpbGUoaGVhZCl7XG4gICAgICBmbiAgID0gaGVhZC5mbjtcbiAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgaWYoaGVhZClub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG4gIH07XG5cbiAgLy8gTm9kZS5qc1xuICBpZihpc05vZGUpe1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcbiAgfSBlbHNlIGlmKE9ic2VydmVyKXtcbiAgICB2YXIgdG9nZ2xlID0gdHJ1ZVxuICAgICAgLCBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKXtcbiAgICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBwcm9taXNlLnRoZW4oZmx1c2gpO1xuICAgIH07XG4gIC8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4gIC8vIC0gc2V0SW1tZWRpYXRlXG4gIC8vIC0gTWVzc2FnZUNoYW5uZWxcbiAgLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuICAvLyAtIG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAvLyAtIHNldFRpbWVvdXRcbiAgfSBlbHNlIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihmbil7XG4gICAgdmFyIHRhc2sgPSB7Zm46IGZuLCBuZXh0OiB1bmRlZmluZWR9O1xuICAgIGlmKGxhc3QpbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZighaGVhZCl7XG4gICAgICBoZWFkID0gdGFzaztcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gbGFzdCA9IHRhc2s7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsICRhc3NpZ24gID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIEEgPSB7fVxuICAgICwgQiA9IHt9XG4gICAgLCBTID0gU3ltYm9sKClcbiAgICAsIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihrKXsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCAgICAgPSB0b09iamVjdCh0YXJnZXQpXG4gICAgLCBhTGVuICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGluZGV4ID0gMVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZlxuICAgICwgaXNFbnVtICAgICA9IHBJRS5mO1xuICB3aGlsZShhTGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSlcbiAgICAgICwga2V5cyAgID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKWlmKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247IiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGRQcyAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIEVtcHR5ICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIFBST1RPVFlQRSAgID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24oKXtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJylcbiAgICAsIGkgICAgICA9IGVudW1CdWdLZXlzLmxlbmd0aFxuICAgICwgbHQgICAgID0gJzwnXG4gICAgLCBndCAgICAgPSAnPidcbiAgICAsIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlKGktLSlkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcyl7XG4gIHZhciByZXN1bHQ7XG4gIGlmKE8gIT09IG51bGwpe1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgZFAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzICAgPSBnZXRLZXlzKFByb3BlcnRpZXMpXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIFA7XG4gIHdoaWxlKGxlbmd0aCA+IGkpZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59OyIsInZhciBwSUUgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgdG9JT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKVxuICAsIGdPUEQgICAgICAgICAgID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGdPUEQgOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCl7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcbiAgICByZXR1cm4gZ09QRChPLCBQKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZihoYXMoTywgUCkpcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTsiLCIvLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgZ09QTiAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mXG4gICwgdG9TdHJpbmcgID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgd2luZG93ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbihpdCl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGdPUE4oaXQpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB3aW5kb3dOYW1lcy5zbGljZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHJldHVybiB3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJyA/IGdldFdpbmRvd05hbWVzKGl0KSA6IGdPUE4odG9JT2JqZWN0KGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTsiLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzOyIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTyl7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07IiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59OyIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlOyIsInZhciBnZXRLZXlzICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgaXNFbnVtICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzRW50cmllcyl7XG4gIHJldHVybiBmdW5jdGlvbihpdCl7XG4gICAgdmFyIE8gICAgICA9IHRvSU9iamVjdChpdClcbiAgICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBpICAgICAgPSAwXG4gICAgICAsIHJlc3VsdCA9IFtdXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKE8sIGtleSA9IGtleXNbaSsrXSkpe1xuICAgICAgcmVzdWx0LnB1c2goaXNFbnRyaWVzID8gW2tleSwgT1trZXldXSA6IE9ba2V5XSk7XG4gICAgfSByZXR1cm4gcmVzdWx0O1xuICB9O1xufTsiLCIvLyBhbGwgb2JqZWN0IGtleXMsIGluY2x1ZGVzIG5vbi1lbnVtZXJhYmxlIGFuZCBzeW1ib2xzXG52YXIgZ09QTiAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpXG4gICwgZ09QUyAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIFJlZmxlY3QgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuUmVmbGVjdDtcbm1vZHVsZS5leHBvcnRzID0gUmVmbGVjdCAmJiBSZWZsZWN0Lm93bktleXMgfHwgZnVuY3Rpb24gb3duS2V5cyhpdCl7XG4gIHZhciBrZXlzICAgICAgID0gZ09QTi5mKGFuT2JqZWN0KGl0KSlcbiAgICAsIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHJldHVybiBnZXRTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0U3ltYm9scyhpdCkpIDoga2V5cztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHBhdGggICAgICA9IHJlcXVpcmUoJy4vX3BhdGgnKVxuICAsIGludm9rZSAgICA9IHJlcXVpcmUoJy4vX2ludm9rZScpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigvKiAuLi5wYXJncyAqLyl7XG4gIHZhciBmbiAgICAgPSBhRnVuY3Rpb24odGhpcylcbiAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIHBhcmdzICA9IEFycmF5KGxlbmd0aClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIF8gICAgICA9IHBhdGguX1xuICAgICwgaG9sZGVyID0gZmFsc2U7XG4gIHdoaWxlKGxlbmd0aCA+IGkpaWYoKHBhcmdzW2ldID0gYXJndW1lbnRzW2krK10pID09PSBfKWhvbGRlciA9IHRydWU7XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICwgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgaiA9IDAsIGsgPSAwLCBhcmdzO1xuICAgIGlmKCFob2xkZXIgJiYgIWFMZW4pcmV0dXJuIGludm9rZShmbiwgcGFyZ3MsIHRoYXQpO1xuICAgIGFyZ3MgPSBwYXJncy5zbGljZSgpO1xuICAgIGlmKGhvbGRlcilmb3IoO2xlbmd0aCA+IGo7IGorKylpZihhcmdzW2pdID09PSBfKWFyZ3Nbal0gPSBhcmd1bWVudHNbaysrXTtcbiAgICB3aGlsZShhTGVuID4gaylhcmdzLnB1c2goYXJndW1lbnRzW2srK10pO1xuICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYywgc2FmZSl7XG4gIGZvcih2YXIga2V5IGluIHNyYylyZWRlZmluZSh0YXJnZXQsIGtleSwgc3JjW2tleV0sIHNhZmUpO1xuICByZXR1cm4gdGFyZ2V0O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBoYXMgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFNSQyAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKVxuICAsIFRPX1NUUklORyA9ICd0b1N0cmluZydcbiAgLCAkdG9TdHJpbmcgPSBGdW5jdGlvbltUT19TVFJJTkddXG4gICwgVFBMICAgICAgID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE8sIGtleSwgdmFsLCBzYWZlKXtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmKGlzRnVuY3Rpb24paGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZihPW2tleV0gPT09IHZhbClyZXR1cm47XG4gIGlmKGlzRnVuY3Rpb24paGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmKE8gPT09IGdsb2JhbCl7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGlmKCFzYWZlKXtcbiAgICAgIGRlbGV0ZSBPW2tleV07XG4gICAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoT1trZXldKU9ba2V5XSA9IHZhbDtcbiAgICAgIGVsc2UgaGlkZShPLCBrZXksIHZhbCk7XG4gICAgfVxuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTsiLCIvLyA3LjIuOSBTYW1lVmFsdWUoeCwgeSlcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmlzIHx8IGZ1bmN0aW9uIGlzKHgsIHkpe1xuICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcbn07IiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24oTywgcHJvdG8pe1xuICBhbk9iamVjdChPKTtcbiAgaWYoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCl0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbih0ZXN0LCBidWdneSwgc2V0KXtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vX2N0eCcpKEZ1bmN0aW9uLmNhbGwsIHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZihPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90byl7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgZFAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIFNQRUNJRVMgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVkpe1xuICB2YXIgQyA9IGdsb2JhbFtLRVldO1xuICBpZihERVNDUklQVE9SUyAmJiBDICYmICFDW1NQRUNJRVNdKWRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIFNQRUNJRVMgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE8sIEQpe1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yLCBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsIi8vIGhlbHBlciBmb3IgU3RyaW5nI3tzdGFydHNXaXRoLCBlbmRzV2l0aCwgaW5jbHVkZXN9XG52YXIgaXNSZWdFeHAgPSByZXF1aXJlKCcuL19pcy1yZWdleHAnKVxuICAsIGRlZmluZWQgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRoYXQsIHNlYXJjaFN0cmluZywgTkFNRSl7XG4gIGlmKGlzUmVnRXhwKHNlYXJjaFN0cmluZykpdGhyb3cgVHlwZUVycm9yKCdTdHJpbmcjJyArIE5BTUUgKyBcIiBkb2Vzbid0IGFjY2VwdCByZWdleCFcIik7XG4gIHJldHVybiBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXN0cmluZy1wYWQtc3RhcnQtZW5kXG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHJlcGVhdCAgID0gcmVxdWlyZSgnLi9fc3RyaW5nLXJlcGVhdCcpXG4gICwgZGVmaW5lZCAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGhhdCwgbWF4TGVuZ3RoLCBmaWxsU3RyaW5nLCBsZWZ0KXtcbiAgdmFyIFMgICAgICAgICAgICA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICwgc3RyaW5nTGVuZ3RoID0gUy5sZW5ndGhcbiAgICAsIGZpbGxTdHIgICAgICA9IGZpbGxTdHJpbmcgPT09IHVuZGVmaW5lZCA/ICcgJyA6IFN0cmluZyhmaWxsU3RyaW5nKVxuICAgICwgaW50TWF4TGVuZ3RoID0gdG9MZW5ndGgobWF4TGVuZ3RoKTtcbiAgaWYoaW50TWF4TGVuZ3RoIDw9IHN0cmluZ0xlbmd0aCB8fCBmaWxsU3RyID09ICcnKXJldHVybiBTO1xuICB2YXIgZmlsbExlbiA9IGludE1heExlbmd0aCAtIHN0cmluZ0xlbmd0aFxuICAgICwgc3RyaW5nRmlsbGVyID0gcmVwZWF0LmNhbGwoZmlsbFN0ciwgTWF0aC5jZWlsKGZpbGxMZW4gLyBmaWxsU3RyLmxlbmd0aCkpO1xuICBpZihzdHJpbmdGaWxsZXIubGVuZ3RoID4gZmlsbExlbilzdHJpbmdGaWxsZXIgPSBzdHJpbmdGaWxsZXIuc2xpY2UoMCwgZmlsbExlbik7XG4gIHJldHVybiBsZWZ0ID8gc3RyaW5nRmlsbGVyICsgUyA6IFMgKyBzdHJpbmdGaWxsZXI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXBlYXQoY291bnQpe1xuICB2YXIgc3RyID0gU3RyaW5nKGRlZmluZWQodGhpcykpXG4gICAgLCByZXMgPSAnJ1xuICAgICwgbiAgID0gdG9JbnRlZ2VyKGNvdW50KTtcbiAgaWYobiA8IDAgfHwgbiA9PSBJbmZpbml0eSl0aHJvdyBSYW5nZUVycm9yKFwiQ291bnQgY2FuJ3QgYmUgbmVnYXRpdmVcIik7XG4gIGZvcig7biA+IDA7IChuID4+Pj0gMSkgJiYgKHN0ciArPSBzdHIpKWlmKG4gJiAxKXJlcyArPSBzdHI7XG4gIHJldHVybiByZXM7XG59OyIsInZhciBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGludm9rZSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faHRtbCcpXG4gICwgY2VsICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spe1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKXtcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKXtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYocmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0Jykpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6ICAgc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWF4ICAgICAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTsiLCIndXNlIHN0cmljdCc7XG5pZihyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpKXtcbiAgdmFyIExJQlJBUlkgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgICAsIGdsb2JhbCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAgICwgZmFpbHMgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgICAsICRleHBvcnQgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAgICwgJHR5cGVkICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3R5cGVkJylcbiAgICAsICRidWZmZXIgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190eXBlZC1idWZmZXInKVxuICAgICwgY3R4ICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICAgLCBhbkluc3RhbmNlICAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAgICwgcHJvcGVydHlEZXNjICAgICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAgICwgaGlkZSAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAgICwgcmVkZWZpbmVBbGwgICAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICAgLCB0b0ludGVnZXIgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICAgLCB0b0xlbmd0aCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgICAsIHRvSW5kZXggICAgICAgICAgICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpXG4gICAgLCB0b1ByaW1pdGl2ZSAgICAgICAgID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJylcbiAgICAsIGhhcyAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAgICwgc2FtZSAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3NhbWUtdmFsdWUnKVxuICAgICwgY2xhc3NvZiAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAgICwgaXNPYmplY3QgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICAgLCB0b09iamVjdCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgICAsIGlzQXJyYXlJdGVyICAgICAgICAgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgICAsIGNyZWF0ZSAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgICAsIGdldFByb3RvdHlwZU9mICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgICAsIGdPUE4gICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmZcbiAgICAsIGdldEl0ZXJGbiAgICAgICAgICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpXG4gICAgLCB1aWQgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgICAsIHdrcyAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL193a3MnKVxuICAgICwgY3JlYXRlQXJyYXlNZXRob2QgICA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKVxuICAgICwgY3JlYXRlQXJyYXlJbmNsdWRlcyA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJylcbiAgICAsIHNwZWNpZXNDb25zdHJ1Y3RvciAgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgICAsIEFycmF5SXRlcmF0b3JzICAgICAgPSByZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpXG4gICAgLCBJdGVyYXRvcnMgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgICAsICRpdGVyRGV0ZWN0ICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpXG4gICAgLCBzZXRTcGVjaWVzICAgICAgICAgID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKVxuICAgICwgYXJyYXlGaWxsICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LWZpbGwnKVxuICAgICwgYXJyYXlDb3B5V2l0aGluICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LWNvcHktd2l0aGluJylcbiAgICAsICREUCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAgICwgJEdPUEQgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJylcbiAgICAsIGRQICAgICAgICAgICAgICAgICAgPSAkRFAuZlxuICAgICwgZ09QRCAgICAgICAgICAgICAgICA9ICRHT1BELmZcbiAgICAsIFJhbmdlRXJyb3IgICAgICAgICAgPSBnbG9iYWwuUmFuZ2VFcnJvclxuICAgICwgVHlwZUVycm9yICAgICAgICAgICA9IGdsb2JhbC5UeXBlRXJyb3JcbiAgICAsIFVpbnQ4QXJyYXkgICAgICAgICAgPSBnbG9iYWwuVWludDhBcnJheVxuICAgICwgQVJSQVlfQlVGRkVSICAgICAgICA9ICdBcnJheUJ1ZmZlcidcbiAgICAsIFNIQVJFRF9CVUZGRVIgICAgICAgPSAnU2hhcmVkJyArIEFSUkFZX0JVRkZFUlxuICAgICwgQllURVNfUEVSX0VMRU1FTlQgICA9ICdCWVRFU19QRVJfRUxFTUVOVCdcbiAgICAsIFBST1RPVFlQRSAgICAgICAgICAgPSAncHJvdG90eXBlJ1xuICAgICwgQXJyYXlQcm90byAgICAgICAgICA9IEFycmF5W1BST1RPVFlQRV1cbiAgICAsICRBcnJheUJ1ZmZlciAgICAgICAgPSAkYnVmZmVyLkFycmF5QnVmZmVyXG4gICAgLCAkRGF0YVZpZXcgICAgICAgICAgID0gJGJ1ZmZlci5EYXRhVmlld1xuICAgICwgYXJyYXlGb3JFYWNoICAgICAgICA9IGNyZWF0ZUFycmF5TWV0aG9kKDApXG4gICAgLCBhcnJheUZpbHRlciAgICAgICAgID0gY3JlYXRlQXJyYXlNZXRob2QoMilcbiAgICAsIGFycmF5U29tZSAgICAgICAgICAgPSBjcmVhdGVBcnJheU1ldGhvZCgzKVxuICAgICwgYXJyYXlFdmVyeSAgICAgICAgICA9IGNyZWF0ZUFycmF5TWV0aG9kKDQpXG4gICAgLCBhcnJheUZpbmQgICAgICAgICAgID0gY3JlYXRlQXJyYXlNZXRob2QoNSlcbiAgICAsIGFycmF5RmluZEluZGV4ICAgICAgPSBjcmVhdGVBcnJheU1ldGhvZCg2KVxuICAgICwgYXJyYXlJbmNsdWRlcyAgICAgICA9IGNyZWF0ZUFycmF5SW5jbHVkZXModHJ1ZSlcbiAgICAsIGFycmF5SW5kZXhPZiAgICAgICAgPSBjcmVhdGVBcnJheUluY2x1ZGVzKGZhbHNlKVxuICAgICwgYXJyYXlWYWx1ZXMgICAgICAgICA9IEFycmF5SXRlcmF0b3JzLnZhbHVlc1xuICAgICwgYXJyYXlLZXlzICAgICAgICAgICA9IEFycmF5SXRlcmF0b3JzLmtleXNcbiAgICAsIGFycmF5RW50cmllcyAgICAgICAgPSBBcnJheUl0ZXJhdG9ycy5lbnRyaWVzXG4gICAgLCBhcnJheUxhc3RJbmRleE9mICAgID0gQXJyYXlQcm90by5sYXN0SW5kZXhPZlxuICAgICwgYXJyYXlSZWR1Y2UgICAgICAgICA9IEFycmF5UHJvdG8ucmVkdWNlXG4gICAgLCBhcnJheVJlZHVjZVJpZ2h0ICAgID0gQXJyYXlQcm90by5yZWR1Y2VSaWdodFxuICAgICwgYXJyYXlKb2luICAgICAgICAgICA9IEFycmF5UHJvdG8uam9pblxuICAgICwgYXJyYXlTb3J0ICAgICAgICAgICA9IEFycmF5UHJvdG8uc29ydFxuICAgICwgYXJyYXlTbGljZSAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2VcbiAgICAsIGFycmF5VG9TdHJpbmcgICAgICAgPSBBcnJheVByb3RvLnRvU3RyaW5nXG4gICAgLCBhcnJheVRvTG9jYWxlU3RyaW5nID0gQXJyYXlQcm90by50b0xvY2FsZVN0cmluZ1xuICAgICwgSVRFUkFUT1IgICAgICAgICAgICA9IHdrcygnaXRlcmF0b3InKVxuICAgICwgVEFHICAgICAgICAgICAgICAgICA9IHdrcygndG9TdHJpbmdUYWcnKVxuICAgICwgVFlQRURfQ09OU1RSVUNUT1IgICA9IHVpZCgndHlwZWRfY29uc3RydWN0b3InKVxuICAgICwgREVGX0NPTlNUUlVDVE9SICAgICA9IHVpZCgnZGVmX2NvbnN0cnVjdG9yJylcbiAgICAsIEFMTF9DT05TVFJVQ1RPUlMgICAgPSAkdHlwZWQuQ09OU1RSXG4gICAgLCBUWVBFRF9BUlJBWSAgICAgICAgID0gJHR5cGVkLlRZUEVEXG4gICAgLCBWSUVXICAgICAgICAgICAgICAgID0gJHR5cGVkLlZJRVdcbiAgICAsIFdST05HX0xFTkdUSCAgICAgICAgPSAnV3JvbmcgbGVuZ3RoISc7XG5cbiAgdmFyICRtYXAgPSBjcmVhdGVBcnJheU1ldGhvZCgxLCBmdW5jdGlvbihPLCBsZW5ndGgpe1xuICAgIHJldHVybiBhbGxvY2F0ZShzcGVjaWVzQ29uc3RydWN0b3IoTywgT1tERUZfQ09OU1RSVUNUT1JdKSwgbGVuZ3RoKTtcbiAgfSk7XG5cbiAgdmFyIExJVFRMRV9FTkRJQU4gPSBmYWlscyhmdW5jdGlvbigpe1xuICAgIHJldHVybiBuZXcgVWludDhBcnJheShuZXcgVWludDE2QXJyYXkoWzFdKS5idWZmZXIpWzBdID09PSAxO1xuICB9KTtcblxuICB2YXIgRk9SQ0VEX1NFVCA9ICEhVWludDhBcnJheSAmJiAhIVVpbnQ4QXJyYXlbUFJPVE9UWVBFXS5zZXQgJiYgZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgVWludDhBcnJheSgxKS5zZXQoe30pO1xuICB9KTtcblxuICB2YXIgc3RyaWN0VG9MZW5ndGggPSBmdW5jdGlvbihpdCwgU0FNRSl7XG4gICAgaWYoaXQgPT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICB2YXIgbnVtYmVyID0gK2l0XG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKGl0KTtcbiAgICBpZihTQU1FICYmICFzYW1lKG51bWJlciwgbGVuZ3RoKSl0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfTtcblxuICB2YXIgdG9PZmZzZXQgPSBmdW5jdGlvbihpdCwgQllURVMpe1xuICAgIHZhciBvZmZzZXQgPSB0b0ludGVnZXIoaXQpO1xuICAgIGlmKG9mZnNldCA8IDAgfHwgb2Zmc2V0ICUgQllURVMpdGhyb3cgUmFuZ2VFcnJvcignV3Jvbmcgb2Zmc2V0IScpO1xuICAgIHJldHVybiBvZmZzZXQ7XG4gIH07XG5cbiAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oaXQpe1xuICAgIGlmKGlzT2JqZWN0KGl0KSAmJiBUWVBFRF9BUlJBWSBpbiBpdClyZXR1cm4gaXQ7XG4gICAgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSB0eXBlZCBhcnJheSEnKTtcbiAgfTtcblxuICB2YXIgYWxsb2NhdGUgPSBmdW5jdGlvbihDLCBsZW5ndGgpe1xuICAgIGlmKCEoaXNPYmplY3QoQykgJiYgVFlQRURfQ09OU1RSVUNUT1IgaW4gQykpe1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdJdCBpcyBub3QgYSB0eXBlZCBhcnJheSBjb25zdHJ1Y3RvciEnKTtcbiAgICB9IHJldHVybiBuZXcgQyhsZW5ndGgpO1xuICB9O1xuXG4gIHZhciBzcGVjaWVzRnJvbUxpc3QgPSBmdW5jdGlvbihPLCBsaXN0KXtcbiAgICByZXR1cm4gZnJvbUxpc3Qoc3BlY2llc0NvbnN0cnVjdG9yKE8sIE9bREVGX0NPTlNUUlVDVE9SXSksIGxpc3QpO1xuICB9O1xuXG4gIHZhciBmcm9tTGlzdCA9IGZ1bmN0aW9uKEMsIGxpc3Qpe1xuICAgIHZhciBpbmRleCAgPSAwXG4gICAgICAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoXG4gICAgICAsIHJlc3VsdCA9IGFsbG9jYXRlKEMsIGxlbmd0aCk7XG4gICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpcmVzdWx0W2luZGV4XSA9IGxpc3RbaW5kZXgrK107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgYWRkR2V0dGVyID0gZnVuY3Rpb24oaXQsIGtleSwgaW50ZXJuYWwpe1xuICAgIGRQKGl0LCBrZXksIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzLl9kW2ludGVybmFsXTsgfX0pO1xuICB9O1xuXG4gIHZhciAkZnJvbSA9IGZ1bmN0aW9uIGZyb20oc291cmNlIC8qLCBtYXBmbiwgdGhpc0FyZyAqLyl7XG4gICAgdmFyIE8gICAgICAgPSB0b09iamVjdChzb3VyY2UpXG4gICAgICAsIGFMZW4gICAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIG1hcGZuICAgPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZFxuICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxuICAgICAgLCBpdGVyRm4gID0gZ2V0SXRlckZuKE8pXG4gICAgICAsIGksIGxlbmd0aCwgdmFsdWVzLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIWlzQXJyYXlJdGVyKGl0ZXJGbikpe1xuICAgICAgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHZhbHVlcyA9IFtdLCBpID0gMDsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpKyspe1xuICAgICAgICB2YWx1ZXMucHVzaChzdGVwLnZhbHVlKTtcbiAgICAgIH0gTyA9IHZhbHVlcztcbiAgICB9XG4gICAgaWYobWFwcGluZyAmJiBhTGVuID4gMiltYXBmbiA9IGN0eChtYXBmbiwgYXJndW1lbnRzWzJdLCAyKTtcbiAgICBmb3IoaSA9IDAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKSwgcmVzdWx0ID0gYWxsb2NhdGUodGhpcywgbGVuZ3RoKTsgbGVuZ3RoID4gaTsgaSsrKXtcbiAgICAgIHJlc3VsdFtpXSA9IG1hcHBpbmcgPyBtYXBmbihPW2ldLCBpKSA6IE9baV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyICRvZiA9IGZ1bmN0aW9uIG9mKC8qLi4uaXRlbXMqLyl7XG4gICAgdmFyIGluZGV4ICA9IDBcbiAgICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCByZXN1bHQgPSBhbGxvY2F0ZSh0aGlzLCBsZW5ndGgpO1xuICAgIHdoaWxlKGxlbmd0aCA+IGluZGV4KXJlc3VsdFtpbmRleF0gPSBhcmd1bWVudHNbaW5kZXgrK107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBpT1MgU2FmYXJpIDYueCBmYWlscyBoZXJlXG4gIHZhciBUT19MT0NBTEVfQlVHID0gISFVaW50OEFycmF5ICYmIGZhaWxzKGZ1bmN0aW9uKCl7IGFycmF5VG9Mb2NhbGVTdHJpbmcuY2FsbChuZXcgVWludDhBcnJheSgxKSk7IH0pO1xuXG4gIHZhciAkdG9Mb2NhbGVTdHJpbmcgPSBmdW5jdGlvbiB0b0xvY2FsZVN0cmluZygpe1xuICAgIHJldHVybiBhcnJheVRvTG9jYWxlU3RyaW5nLmFwcGx5KFRPX0xPQ0FMRV9CVUcgPyBhcnJheVNsaWNlLmNhbGwodmFsaWRhdGUodGhpcykpIDogdmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgdmFyIHByb3RvID0ge1xuICAgIGNvcHlXaXRoaW46IGZ1bmN0aW9uIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCAvKiwgZW5kICovKXtcbiAgICAgIHJldHVybiBhcnJheUNvcHlXaXRoaW4uY2FsbCh2YWxpZGF0ZSh0aGlzKSwgdGFyZ2V0LCBzdGFydCwgYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgZXZlcnk6IGZ1bmN0aW9uIGV2ZXJ5KGNhbGxiYWNrZm4gLyosIHRoaXNBcmcgKi8pe1xuICAgICAgcmV0dXJuIGFycmF5RXZlcnkodmFsaWRhdGUodGhpcyksIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGZpbGw6IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyosIHN0YXJ0LCBlbmQgKi8peyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICByZXR1cm4gYXJyYXlGaWxsLmFwcGx5KHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIoY2FsbGJhY2tmbiAvKiwgdGhpc0FyZyAqLyl7XG4gICAgICByZXR1cm4gc3BlY2llc0Zyb21MaXN0KHRoaXMsIGFycmF5RmlsdGVyKHZhbGlkYXRlKHRoaXMpLCBjYWxsYmFja2ZuLFxuICAgICAgICBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCkpO1xuICAgIH0sXG4gICAgZmluZDogZnVuY3Rpb24gZmluZChwcmVkaWNhdGUgLyosIHRoaXNBcmcgKi8pe1xuICAgICAgcmV0dXJuIGFycmF5RmluZCh2YWxpZGF0ZSh0aGlzKSwgcHJlZGljYXRlLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBmaW5kSW5kZXg6IGZ1bmN0aW9uIGZpbmRJbmRleChwcmVkaWNhdGUgLyosIHRoaXNBcmcgKi8pe1xuICAgICAgcmV0dXJuIGFycmF5RmluZEluZGV4KHZhbGlkYXRlKHRoaXMpLCBwcmVkaWNhdGUsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhpc0FyZyAqLyl7XG4gICAgICBhcnJheUZvckVhY2godmFsaWRhdGUodGhpcyksIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGluZGV4T2Y6IGZ1bmN0aW9uIGluZGV4T2Yoc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4ICovKXtcbiAgICAgIHJldHVybiBhcnJheUluZGV4T2YodmFsaWRhdGUodGhpcyksIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXggKi8pe1xuICAgICAgcmV0dXJuIGFycmF5SW5jbHVkZXModmFsaWRhdGUodGhpcyksIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGpvaW46IGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgcmV0dXJuIGFycmF5Sm9pbi5hcHBseSh2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGxhc3RJbmRleE9mOiBmdW5jdGlvbiBsYXN0SW5kZXhPZihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXggKi8peyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICByZXR1cm4gYXJyYXlMYXN0SW5kZXhPZi5hcHBseSh2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIG1hcDogZnVuY3Rpb24gbWFwKG1hcGZuIC8qLCB0aGlzQXJnICovKXtcbiAgICAgIHJldHVybiAkbWFwKHZhbGlkYXRlKHRoaXMpLCBtYXBmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgcmVkdWNlOiBmdW5jdGlvbiByZWR1Y2UoY2FsbGJhY2tmbiAvKiwgaW5pdGlhbFZhbHVlICovKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgcmV0dXJuIGFycmF5UmVkdWNlLmFwcGx5KHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4gLyosIGluaXRpYWxWYWx1ZSAqLyl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheVJlZHVjZVJpZ2h0LmFwcGx5KHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgcmV2ZXJzZTogZnVuY3Rpb24gcmV2ZXJzZSgpe1xuICAgICAgdmFyIHRoYXQgICA9IHRoaXNcbiAgICAgICAgLCBsZW5ndGggPSB2YWxpZGF0ZSh0aGF0KS5sZW5ndGhcbiAgICAgICAgLCBtaWRkbGUgPSBNYXRoLmZsb29yKGxlbmd0aCAvIDIpXG4gICAgICAgICwgaW5kZXggID0gMFxuICAgICAgICAsIHZhbHVlO1xuICAgICAgd2hpbGUoaW5kZXggPCBtaWRkbGUpe1xuICAgICAgICB2YWx1ZSAgICAgICAgID0gdGhhdFtpbmRleF07XG4gICAgICAgIHRoYXRbaW5kZXgrK10gPSB0aGF0Wy0tbGVuZ3RoXTtcbiAgICAgICAgdGhhdFtsZW5ndGhdICA9IHZhbHVlO1xuICAgICAgfSByZXR1cm4gdGhhdDtcbiAgICB9LFxuICAgIHNvbWU6IGZ1bmN0aW9uIHNvbWUoY2FsbGJhY2tmbiAvKiwgdGhpc0FyZyAqLyl7XG4gICAgICByZXR1cm4gYXJyYXlTb21lKHZhbGlkYXRlKHRoaXMpLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBzb3J0OiBmdW5jdGlvbiBzb3J0KGNvbXBhcmVmbil7XG4gICAgICByZXR1cm4gYXJyYXlTb3J0LmNhbGwodmFsaWRhdGUodGhpcyksIGNvbXBhcmVmbik7XG4gICAgfSxcbiAgICBzdWJhcnJheTogZnVuY3Rpb24gc3ViYXJyYXkoYmVnaW4sIGVuZCl7XG4gICAgICB2YXIgTyAgICAgID0gdmFsaWRhdGUodGhpcylcbiAgICAgICAgLCBsZW5ndGggPSBPLmxlbmd0aFxuICAgICAgICAsICRiZWdpbiA9IHRvSW5kZXgoYmVnaW4sIGxlbmd0aCk7XG4gICAgICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3IoTywgT1tERUZfQ09OU1RSVUNUT1JdKSkoXG4gICAgICAgIE8uYnVmZmVyLFxuICAgICAgICBPLmJ5dGVPZmZzZXQgKyAkYmVnaW4gKiBPLkJZVEVTX1BFUl9FTEVNRU5ULFxuICAgICAgICB0b0xlbmd0aCgoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0luZGV4KGVuZCwgbGVuZ3RoKSkgLSAkYmVnaW4pXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICB2YXIgJHNsaWNlID0gZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCl7XG4gICAgcmV0dXJuIHNwZWNpZXNGcm9tTGlzdCh0aGlzLCBhcnJheVNsaWNlLmNhbGwodmFsaWRhdGUodGhpcyksIHN0YXJ0LCBlbmQpKTtcbiAgfTtcblxuICB2YXIgJHNldCA9IGZ1bmN0aW9uIHNldChhcnJheUxpa2UgLyosIG9mZnNldCAqLyl7XG4gICAgdmFsaWRhdGUodGhpcyk7XG4gICAgdmFyIG9mZnNldCA9IHRvT2Zmc2V0KGFyZ3VtZW50c1sxXSwgMSlcbiAgICAgICwgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICAgICwgc3JjICAgID0gdG9PYmplY3QoYXJyYXlMaWtlKVxuICAgICAgLCBsZW4gICAgPSB0b0xlbmd0aChzcmMubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAwO1xuICAgIGlmKGxlbiArIG9mZnNldCA+IGxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgd2hpbGUoaW5kZXggPCBsZW4pdGhpc1tvZmZzZXQgKyBpbmRleF0gPSBzcmNbaW5kZXgrK107XG4gIH07XG5cbiAgdmFyICRpdGVyYXRvcnMgPSB7XG4gICAgZW50cmllczogZnVuY3Rpb24gZW50cmllcygpe1xuICAgICAgcmV0dXJuIGFycmF5RW50cmllcy5jYWxsKHZhbGlkYXRlKHRoaXMpKTtcbiAgICB9LFxuICAgIGtleXM6IGZ1bmN0aW9uIGtleXMoKXtcbiAgICAgIHJldHVybiBhcnJheUtleXMuY2FsbCh2YWxpZGF0ZSh0aGlzKSk7XG4gICAgfSxcbiAgICB2YWx1ZXM6IGZ1bmN0aW9uIHZhbHVlcygpe1xuICAgICAgcmV0dXJuIGFycmF5VmFsdWVzLmNhbGwodmFsaWRhdGUodGhpcykpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgaXNUQUluZGV4ID0gZnVuY3Rpb24odGFyZ2V0LCBrZXkpe1xuICAgIHJldHVybiBpc09iamVjdCh0YXJnZXQpXG4gICAgICAmJiB0YXJnZXRbVFlQRURfQVJSQVldXG4gICAgICAmJiB0eXBlb2Yga2V5ICE9ICdzeW1ib2wnXG4gICAgICAmJiBrZXkgaW4gdGFyZ2V0XG4gICAgICAmJiBTdHJpbmcoK2tleSkgPT0gU3RyaW5nKGtleSk7XG4gIH07XG4gIHZhciAkZ2V0RGVzYyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSl7XG4gICAgcmV0dXJuIGlzVEFJbmRleCh0YXJnZXQsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpXG4gICAgICA/IHByb3BlcnR5RGVzYygyLCB0YXJnZXRba2V5XSlcbiAgICAgIDogZ09QRCh0YXJnZXQsIGtleSk7XG4gIH07XG4gIHZhciAkc2V0RGVzYyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKXtcbiAgICBpZihpc1RBSW5kZXgodGFyZ2V0LCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKVxuICAgICAgJiYgaXNPYmplY3QoZGVzYylcbiAgICAgICYmIGhhcyhkZXNjLCAndmFsdWUnKVxuICAgICAgJiYgIWhhcyhkZXNjLCAnZ2V0JylcbiAgICAgICYmICFoYXMoZGVzYywgJ3NldCcpXG4gICAgICAvLyBUT0RPOiBhZGQgdmFsaWRhdGlvbiBkZXNjcmlwdG9yIHcvbyBjYWxsaW5nIGFjY2Vzc29yc1xuICAgICAgJiYgIWRlc2MuY29uZmlndXJhYmxlXG4gICAgICAmJiAoIWhhcyhkZXNjLCAnd3JpdGFibGUnKSB8fCBkZXNjLndyaXRhYmxlKVxuICAgICAgJiYgKCFoYXMoZGVzYywgJ2VudW1lcmFibGUnKSB8fCBkZXNjLmVudW1lcmFibGUpXG4gICAgKXtcbiAgICAgIHRhcmdldFtrZXldID0gZGVzYy52YWx1ZTtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfSBlbHNlIHJldHVybiBkUCh0YXJnZXQsIGtleSwgZGVzYyk7XG4gIH07XG5cbiAgaWYoIUFMTF9DT05TVFJVQ1RPUlMpe1xuICAgICRHT1BELmYgPSAkZ2V0RGVzYztcbiAgICAkRFAuZiAgID0gJHNldERlc2M7XG4gIH1cblxuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFBTExfQ09OU1RSVUNUT1JTLCAnT2JqZWN0Jywge1xuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldERlc2MsXG4gICAgZGVmaW5lUHJvcGVydHk6ICAgICAgICAgICAkc2V0RGVzY1xuICB9KTtcblxuICBpZihmYWlscyhmdW5jdGlvbigpeyBhcnJheVRvU3RyaW5nLmNhbGwoe30pOyB9KSl7XG4gICAgYXJyYXlUb1N0cmluZyA9IGFycmF5VG9Mb2NhbGVTdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgICAgcmV0dXJuIGFycmF5Sm9pbi5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHZhciAkVHlwZWRBcnJheVByb3RvdHlwZSQgPSByZWRlZmluZUFsbCh7fSwgcHJvdG8pO1xuICByZWRlZmluZUFsbCgkVHlwZWRBcnJheVByb3RvdHlwZSQsICRpdGVyYXRvcnMpO1xuICBoaWRlKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgSVRFUkFUT1IsICRpdGVyYXRvcnMudmFsdWVzKTtcbiAgcmVkZWZpbmVBbGwoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCB7XG4gICAgc2xpY2U6ICAgICAgICAgICRzbGljZSxcbiAgICBzZXQ6ICAgICAgICAgICAgJHNldCxcbiAgICBjb25zdHJ1Y3RvcjogICAgZnVuY3Rpb24oKXsgLyogbm9vcCAqLyB9LFxuICAgIHRvU3RyaW5nOiAgICAgICBhcnJheVRvU3RyaW5nLFxuICAgIHRvTG9jYWxlU3RyaW5nOiAkdG9Mb2NhbGVTdHJpbmdcbiAgfSk7XG4gIGFkZEdldHRlcigkVHlwZWRBcnJheVByb3RvdHlwZSQsICdidWZmZXInLCAnYicpO1xuICBhZGRHZXR0ZXIoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCAnYnl0ZU9mZnNldCcsICdvJyk7XG4gIGFkZEdldHRlcigkVHlwZWRBcnJheVByb3RvdHlwZSQsICdieXRlTGVuZ3RoJywgJ2wnKTtcbiAgYWRkR2V0dGVyKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgJ2xlbmd0aCcsICdlJyk7XG4gIGRQKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgVEFHLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpc1tUWVBFRF9BUlJBWV07IH1cbiAgfSk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVksIEJZVEVTLCB3cmFwcGVyLCBDTEFNUEVEKXtcbiAgICBDTEFNUEVEID0gISFDTEFNUEVEO1xuICAgIHZhciBOQU1FICAgICAgID0gS0VZICsgKENMQU1QRUQgPyAnQ2xhbXBlZCcgOiAnJykgKyAnQXJyYXknXG4gICAgICAsIElTTlRfVUlOVDggPSBOQU1FICE9ICdVaW50OEFycmF5J1xuICAgICAgLCBHRVRURVIgICAgID0gJ2dldCcgKyBLRVlcbiAgICAgICwgU0VUVEVSICAgICA9ICdzZXQnICsgS0VZXG4gICAgICAsIFR5cGVkQXJyYXkgPSBnbG9iYWxbTkFNRV1cbiAgICAgICwgQmFzZSAgICAgICA9IFR5cGVkQXJyYXkgfHwge31cbiAgICAgICwgVEFDICAgICAgICA9IFR5cGVkQXJyYXkgJiYgZ2V0UHJvdG90eXBlT2YoVHlwZWRBcnJheSlcbiAgICAgICwgRk9SQ0VEICAgICA9ICFUeXBlZEFycmF5IHx8ICEkdHlwZWQuQUJWXG4gICAgICAsIE8gICAgICAgICAgPSB7fVxuICAgICAgLCBUeXBlZEFycmF5UHJvdG90eXBlID0gVHlwZWRBcnJheSAmJiBUeXBlZEFycmF5W1BST1RPVFlQRV07XG4gICAgdmFyIGdldHRlciA9IGZ1bmN0aW9uKHRoYXQsIGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gdGhhdC5fZDtcbiAgICAgIHJldHVybiBkYXRhLnZbR0VUVEVSXShpbmRleCAqIEJZVEVTICsgZGF0YS5vLCBMSVRUTEVfRU5ESUFOKTtcbiAgICB9O1xuICAgIHZhciBzZXR0ZXIgPSBmdW5jdGlvbih0aGF0LCBpbmRleCwgdmFsdWUpe1xuICAgICAgdmFyIGRhdGEgPSB0aGF0Ll9kO1xuICAgICAgaWYoQ0xBTVBFRCl2YWx1ZSA9ICh2YWx1ZSA9IE1hdGgucm91bmQodmFsdWUpKSA8IDAgPyAwIDogdmFsdWUgPiAweGZmID8gMHhmZiA6IHZhbHVlICYgMHhmZjtcbiAgICAgIGRhdGEudltTRVRURVJdKGluZGV4ICogQllURVMgKyBkYXRhLm8sIHZhbHVlLCBMSVRUTEVfRU5ESUFOKTtcbiAgICB9O1xuICAgIHZhciBhZGRFbGVtZW50ID0gZnVuY3Rpb24odGhhdCwgaW5kZXgpe1xuICAgICAgZFAodGhhdCwgaW5kZXgsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBnZXR0ZXIodGhpcywgaW5kZXgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICByZXR1cm4gc2V0dGVyKHRoaXMsIGluZGV4LCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKXtcbiAgICAgIFR5cGVkQXJyYXkgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGRhdGEsICRvZmZzZXQsICRsZW5ndGgpe1xuICAgICAgICBhbkluc3RhbmNlKHRoYXQsIFR5cGVkQXJyYXksIE5BTUUsICdfZCcpO1xuICAgICAgICB2YXIgaW5kZXggID0gMFxuICAgICAgICAgICwgb2Zmc2V0ID0gMFxuICAgICAgICAgICwgYnVmZmVyLCBieXRlTGVuZ3RoLCBsZW5ndGgsIGtsYXNzO1xuICAgICAgICBpZighaXNPYmplY3QoZGF0YSkpe1xuICAgICAgICAgIGxlbmd0aCAgICAgPSBzdHJpY3RUb0xlbmd0aChkYXRhLCB0cnVlKVxuICAgICAgICAgIGJ5dGVMZW5ndGggPSBsZW5ndGggKiBCWVRFUztcbiAgICAgICAgICBidWZmZXIgICAgID0gbmV3ICRBcnJheUJ1ZmZlcihieXRlTGVuZ3RoKTtcbiAgICAgICAgfSBlbHNlIGlmKGRhdGEgaW5zdGFuY2VvZiAkQXJyYXlCdWZmZXIgfHwgKGtsYXNzID0gY2xhc3NvZihkYXRhKSkgPT0gQVJSQVlfQlVGRkVSIHx8IGtsYXNzID09IFNIQVJFRF9CVUZGRVIpe1xuICAgICAgICAgIGJ1ZmZlciA9IGRhdGE7XG4gICAgICAgICAgb2Zmc2V0ID0gdG9PZmZzZXQoJG9mZnNldCwgQllURVMpO1xuICAgICAgICAgIHZhciAkbGVuID0gZGF0YS5ieXRlTGVuZ3RoO1xuICAgICAgICAgIGlmKCRsZW5ndGggPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBpZigkbGVuICUgQllURVMpdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgICAgICAgICAgYnl0ZUxlbmd0aCA9ICRsZW4gLSBvZmZzZXQ7XG4gICAgICAgICAgICBpZihieXRlTGVuZ3RoIDwgMCl0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ5dGVMZW5ndGggPSB0b0xlbmd0aCgkbGVuZ3RoKSAqIEJZVEVTO1xuICAgICAgICAgICAgaWYoYnl0ZUxlbmd0aCArIG9mZnNldCA+ICRsZW4pdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZW5ndGggPSBieXRlTGVuZ3RoIC8gQllURVM7XG4gICAgICAgIH0gZWxzZSBpZihUWVBFRF9BUlJBWSBpbiBkYXRhKXtcbiAgICAgICAgICByZXR1cm4gZnJvbUxpc3QoVHlwZWRBcnJheSwgZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICRmcm9tLmNhbGwoVHlwZWRBcnJheSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgaGlkZSh0aGF0LCAnX2QnLCB7XG4gICAgICAgICAgYjogYnVmZmVyLFxuICAgICAgICAgIG86IG9mZnNldCxcbiAgICAgICAgICBsOiBieXRlTGVuZ3RoLFxuICAgICAgICAgIGU6IGxlbmd0aCxcbiAgICAgICAgICB2OiBuZXcgJERhdGFWaWV3KGJ1ZmZlcilcbiAgICAgICAgfSk7XG4gICAgICAgIHdoaWxlKGluZGV4IDwgbGVuZ3RoKWFkZEVsZW1lbnQodGhhdCwgaW5kZXgrKyk7XG4gICAgICB9KTtcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGUgPSBUeXBlZEFycmF5W1BST1RPVFlQRV0gPSBjcmVhdGUoJFR5cGVkQXJyYXlQcm90b3R5cGUkKTtcbiAgICAgIGhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgVHlwZWRBcnJheSk7XG4gICAgfSBlbHNlIGlmKCEkaXRlckRldGVjdChmdW5jdGlvbihpdGVyKXtcbiAgICAgIC8vIFY4IHdvcmtzIHdpdGggaXRlcmF0b3JzLCBidXQgZmFpbHMgaW4gbWFueSBvdGhlciBjYXNlc1xuICAgICAgLy8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQ1NTJcbiAgICAgIG5ldyBUeXBlZEFycmF5KG51bGwpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgICAgbmV3IFR5cGVkQXJyYXkoaXRlcik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgfSwgdHJ1ZSkpe1xuICAgICAgVHlwZWRBcnJheSA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgZGF0YSwgJG9mZnNldCwgJGxlbmd0aCl7XG4gICAgICAgIGFuSW5zdGFuY2UodGhhdCwgVHlwZWRBcnJheSwgTkFNRSk7XG4gICAgICAgIHZhciBrbGFzcztcbiAgICAgICAgLy8gYHdzYCBtb2R1bGUgYnVnLCB0ZW1wb3JhcmlseSByZW1vdmUgdmFsaWRhdGlvbiBsZW5ndGggZm9yIFVpbnQ4QXJyYXlcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYnNvY2tldHMvd3MvcHVsbC82NDVcbiAgICAgICAgaWYoIWlzT2JqZWN0KGRhdGEpKXJldHVybiBuZXcgQmFzZShzdHJpY3RUb0xlbmd0aChkYXRhLCBJU05UX1VJTlQ4KSk7XG4gICAgICAgIGlmKGRhdGEgaW5zdGFuY2VvZiAkQXJyYXlCdWZmZXIgfHwgKGtsYXNzID0gY2xhc3NvZihkYXRhKSkgPT0gQVJSQVlfQlVGRkVSIHx8IGtsYXNzID09IFNIQVJFRF9CVUZGRVIpe1xuICAgICAgICAgIHJldHVybiAkbGVuZ3RoICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gbmV3IEJhc2UoZGF0YSwgdG9PZmZzZXQoJG9mZnNldCwgQllURVMpLCAkbGVuZ3RoKVxuICAgICAgICAgICAgOiAkb2Zmc2V0ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgPyBuZXcgQmFzZShkYXRhLCB0b09mZnNldCgkb2Zmc2V0LCBCWVRFUykpXG4gICAgICAgICAgICAgIDogbmV3IEJhc2UoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoVFlQRURfQVJSQVkgaW4gZGF0YSlyZXR1cm4gZnJvbUxpc3QoVHlwZWRBcnJheSwgZGF0YSk7XG4gICAgICAgIHJldHVybiAkZnJvbS5jYWxsKFR5cGVkQXJyYXksIGRhdGEpO1xuICAgICAgfSk7XG4gICAgICBhcnJheUZvckVhY2goVEFDICE9PSBGdW5jdGlvbi5wcm90b3R5cGUgPyBnT1BOKEJhc2UpLmNvbmNhdChnT1BOKFRBQykpIDogZ09QTihCYXNlKSwgZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgaWYoIShrZXkgaW4gVHlwZWRBcnJheSkpaGlkZShUeXBlZEFycmF5LCBrZXksIEJhc2Vba2V5XSk7XG4gICAgICB9KTtcbiAgICAgIFR5cGVkQXJyYXlbUFJPVE9UWVBFXSA9IFR5cGVkQXJyYXlQcm90b3R5cGU7XG4gICAgICBpZighTElCUkFSWSlUeXBlZEFycmF5UHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVHlwZWRBcnJheTtcbiAgICB9XG4gICAgdmFyICRuYXRpdmVJdGVyYXRvciAgID0gVHlwZWRBcnJheVByb3RvdHlwZVtJVEVSQVRPUl1cbiAgICAgICwgQ09SUkVDVF9JVEVSX05BTUUgPSAhISRuYXRpdmVJdGVyYXRvciAmJiAoJG5hdGl2ZUl0ZXJhdG9yLm5hbWUgPT0gJ3ZhbHVlcycgfHwgJG5hdGl2ZUl0ZXJhdG9yLm5hbWUgPT0gdW5kZWZpbmVkKVxuICAgICAgLCAkaXRlcmF0b3IgICAgICAgICA9ICRpdGVyYXRvcnMudmFsdWVzO1xuICAgIGhpZGUoVHlwZWRBcnJheSwgVFlQRURfQ09OU1RSVUNUT1IsIHRydWUpO1xuICAgIGhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgVFlQRURfQVJSQVksIE5BTUUpO1xuICAgIGhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgVklFVywgdHJ1ZSk7XG4gICAgaGlkZShUeXBlZEFycmF5UHJvdG90eXBlLCBERUZfQ09OU1RSVUNUT1IsIFR5cGVkQXJyYXkpO1xuXG4gICAgaWYoQ0xBTVBFRCA/IG5ldyBUeXBlZEFycmF5KDEpW1RBR10gIT0gTkFNRSA6ICEoVEFHIGluIFR5cGVkQXJyYXlQcm90b3R5cGUpKXtcbiAgICAgIGRQKFR5cGVkQXJyYXlQcm90b3R5cGUsIFRBRywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBOQU1FOyB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBPW05BTUVdID0gVHlwZWRBcnJheTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogKFR5cGVkQXJyYXkgIT0gQmFzZSksIE8pO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlMsIE5BTUUsIHtcbiAgICAgIEJZVEVTX1BFUl9FTEVNRU5UOiBCWVRFUyxcbiAgICAgIGZyb206ICRmcm9tLFxuICAgICAgb2Y6ICRvZlxuICAgIH0pO1xuXG4gICAgaWYoIShCWVRFU19QRVJfRUxFTUVOVCBpbiBUeXBlZEFycmF5UHJvdG90eXBlKSloaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsIEJZVEVTX1BFUl9FTEVNRU5ULCBCWVRFUyk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUCwgTkFNRSwgcHJvdG8pO1xuXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogRk9SQ0VEX1NFVCwgTkFNRSwge3NldDogJHNldH0pO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAhQ09SUkVDVF9JVEVSX05BTUUsIE5BTUUsICRpdGVyYXRvcnMpO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoVHlwZWRBcnJheVByb3RvdHlwZS50b1N0cmluZyAhPSBhcnJheVRvU3RyaW5nKSwgTkFNRSwge3RvU3RyaW5nOiBhcnJheVRvU3RyaW5nfSk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgICBuZXcgVHlwZWRBcnJheSgxKS5zbGljZSgpO1xuICAgIH0pLCBOQU1FLCB7c2xpY2U6ICRzbGljZX0pO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoZmFpbHMoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBbMSwgMl0udG9Mb2NhbGVTdHJpbmcoKSAhPSBuZXcgVHlwZWRBcnJheShbMSwgMl0pLnRvTG9jYWxlU3RyaW5nKClcbiAgICB9KSB8fCAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgICAgIFR5cGVkQXJyYXlQcm90b3R5cGUudG9Mb2NhbGVTdHJpbmcuY2FsbChbMSwgMl0pO1xuICAgIH0pKSwgTkFNRSwge3RvTG9jYWxlU3RyaW5nOiAkdG9Mb2NhbGVTdHJpbmd9KTtcblxuICAgIEl0ZXJhdG9yc1tOQU1FXSA9IENPUlJFQ1RfSVRFUl9OQU1FID8gJG5hdGl2ZUl0ZXJhdG9yIDogJGl0ZXJhdG9yO1xuICAgIGlmKCFMSUJSQVJZICYmICFDT1JSRUNUX0lURVJfTkFNRSloaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsIElURVJBVE9SLCAkaXRlcmF0b3IpO1xuICB9O1xufSBlbHNlIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJHR5cGVkICAgICAgICAgPSByZXF1aXJlKCcuL190eXBlZCcpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCByZWRlZmluZUFsbCAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgZmFpbHMgICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgYW5JbnN0YW5jZSAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgdG9JbnRlZ2VyICAgICAgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCB0b0xlbmd0aCAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgZ09QTiAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmZcbiAgLCBkUCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBhcnJheUZpbGwgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LWZpbGwnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEFSUkFZX0JVRkZFUiAgID0gJ0FycmF5QnVmZmVyJ1xuICAsIERBVEFfVklFVyAgICAgID0gJ0RhdGFWaWV3J1xuICAsIFBST1RPVFlQRSAgICAgID0gJ3Byb3RvdHlwZSdcbiAgLCBXUk9OR19MRU5HVEggICA9ICdXcm9uZyBsZW5ndGghJ1xuICAsIFdST05HX0lOREVYICAgID0gJ1dyb25nIGluZGV4ISdcbiAgLCAkQXJyYXlCdWZmZXIgICA9IGdsb2JhbFtBUlJBWV9CVUZGRVJdXG4gICwgJERhdGFWaWV3ICAgICAgPSBnbG9iYWxbREFUQV9WSUVXXVxuICAsIE1hdGggICAgICAgICAgID0gZ2xvYmFsLk1hdGhcbiAgLCBSYW5nZUVycm9yICAgICA9IGdsb2JhbC5SYW5nZUVycm9yXG4gICwgSW5maW5pdHkgICAgICAgPSBnbG9iYWwuSW5maW5pdHlcbiAgLCBCYXNlQnVmZmVyICAgICA9ICRBcnJheUJ1ZmZlclxuICAsIGFicyAgICAgICAgICAgID0gTWF0aC5hYnNcbiAgLCBwb3cgICAgICAgICAgICA9IE1hdGgucG93XG4gICwgZmxvb3IgICAgICAgICAgPSBNYXRoLmZsb29yXG4gICwgbG9nICAgICAgICAgICAgPSBNYXRoLmxvZ1xuICAsIExOMiAgICAgICAgICAgID0gTWF0aC5MTjJcbiAgLCBCVUZGRVIgICAgICAgICA9ICdidWZmZXInXG4gICwgQllURV9MRU5HVEggICAgPSAnYnl0ZUxlbmd0aCdcbiAgLCBCWVRFX09GRlNFVCAgICA9ICdieXRlT2Zmc2V0J1xuICAsICRCVUZGRVIgICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX2InIDogQlVGRkVSXG4gICwgJExFTkdUSCAgICAgICAgPSBERVNDUklQVE9SUyA/ICdfbCcgOiBCWVRFX0xFTkdUSFxuICAsICRPRkZTRVQgICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX28nIDogQllURV9PRkZTRVQ7XG5cbi8vIElFRUU3NTQgY29udmVyc2lvbnMgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9pZWVlNzU0XG52YXIgcGFja0lFRUU3NTQgPSBmdW5jdGlvbih2YWx1ZSwgbUxlbiwgbkJ5dGVzKXtcbiAgdmFyIGJ1ZmZlciA9IEFycmF5KG5CeXRlcylcbiAgICAsIGVMZW4gICA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICAgICwgZU1heCAgID0gKDEgPDwgZUxlbikgLSAxXG4gICAgLCBlQmlhcyAgPSBlTWF4ID4+IDFcbiAgICAsIHJ0ICAgICA9IG1MZW4gPT09IDIzID8gcG93KDIsIC0yNCkgLSBwb3coMiwgLTc3KSA6IDBcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHMgICAgICA9IHZhbHVlIDwgMCB8fCB2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwID8gMSA6IDBcbiAgICAsIGUsIG0sIGM7XG4gIHZhbHVlID0gYWJzKHZhbHVlKVxuICBpZih2YWx1ZSAhPSB2YWx1ZSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpe1xuICAgIG0gPSB2YWx1ZSAhPSB2YWx1ZSA/IDEgOiAwO1xuICAgIGUgPSBlTWF4O1xuICB9IGVsc2Uge1xuICAgIGUgPSBmbG9vcihsb2codmFsdWUpIC8gTE4yKTtcbiAgICBpZih2YWx1ZSAqIChjID0gcG93KDIsIC1lKSkgPCAxKXtcbiAgICAgIGUtLTtcbiAgICAgIGMgKj0gMjtcbiAgICB9XG4gICAgaWYoZSArIGVCaWFzID49IDEpe1xuICAgICAgdmFsdWUgKz0gcnQgLyBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIHBvdygyLCAxIC0gZUJpYXMpO1xuICAgIH1cbiAgICBpZih2YWx1ZSAqIGMgPj0gMil7XG4gICAgICBlKys7XG4gICAgICBjIC89IDI7XG4gICAgfVxuICAgIGlmKGUgKyBlQmlhcyA+PSBlTWF4KXtcbiAgICAgIG0gPSAwO1xuICAgICAgZSA9IGVNYXg7XG4gICAgfSBlbHNlIGlmKGUgKyBlQmlhcyA+PSAxKXtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBwb3coMiwgbUxlbik7XG4gICAgICBlID0gZSArIGVCaWFzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBwb3coMiwgZUJpYXMgLSAxKSAqIHBvdygyLCBtTGVuKTtcbiAgICAgIGUgPSAwO1xuICAgIH1cbiAgfVxuICBmb3IoOyBtTGVuID49IDg7IGJ1ZmZlcltpKytdID0gbSAmIDI1NSwgbSAvPSAyNTYsIG1MZW4gLT0gOCk7XG4gIGUgPSBlIDw8IG1MZW4gfCBtO1xuICBlTGVuICs9IG1MZW47XG4gIGZvcig7IGVMZW4gPiAwOyBidWZmZXJbaSsrXSA9IGUgJiAyNTUsIGUgLz0gMjU2LCBlTGVuIC09IDgpO1xuICBidWZmZXJbLS1pXSB8PSBzICogMTI4O1xuICByZXR1cm4gYnVmZmVyO1xufTtcbnZhciB1bnBhY2tJRUVFNzU0ID0gZnVuY3Rpb24oYnVmZmVyLCBtTGVuLCBuQnl0ZXMpe1xuICB2YXIgZUxlbiAgPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgICAsIGVNYXggID0gKDEgPDwgZUxlbikgLSAxXG4gICAgLCBlQmlhcyA9IGVNYXggPj4gMVxuICAgICwgbkJpdHMgPSBlTGVuIC0gN1xuICAgICwgaSAgICAgPSBuQnl0ZXMgLSAxXG4gICAgLCBzICAgICA9IGJ1ZmZlcltpLS1dXG4gICAgLCBlICAgICA9IHMgJiAxMjdcbiAgICAsIG07XG4gIHMgPj49IDc7XG4gIGZvcig7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbaV0sIGktLSwgbkJpdHMgLT0gOCk7XG4gIG0gPSBlICYgKDEgPDwgLW5CaXRzKSAtIDE7XG4gIGUgPj49IC1uQml0cztcbiAgbkJpdHMgKz0gbUxlbjtcbiAgZm9yKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltpXSwgaS0tLCBuQml0cyAtPSA4KTtcbiAgaWYoZSA9PT0gMCl7XG4gICAgZSA9IDEgLSBlQmlhcztcbiAgfSBlbHNlIGlmKGUgPT09IGVNYXgpe1xuICAgIHJldHVybiBtID8gTmFOIDogcyA/IC1JbmZpbml0eSA6IEluZmluaXR5O1xuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgcG93KDIsIG1MZW4pO1xuICAgIGUgPSBlIC0gZUJpYXM7XG4gIH0gcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBwb3coMiwgZSAtIG1MZW4pO1xufTtcblxudmFyIHVucGFja0kzMiA9IGZ1bmN0aW9uKGJ5dGVzKXtcbiAgcmV0dXJuIGJ5dGVzWzNdIDw8IDI0IHwgYnl0ZXNbMl0gPDwgMTYgfCBieXRlc1sxXSA8PCA4IHwgYnl0ZXNbMF07XG59O1xudmFyIHBhY2tJOCA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIFtpdCAmIDB4ZmZdO1xufTtcbnZhciBwYWNrSTE2ID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gW2l0ICYgMHhmZiwgaXQgPj4gOCAmIDB4ZmZdO1xufTtcbnZhciBwYWNrSTMyID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gW2l0ICYgMHhmZiwgaXQgPj4gOCAmIDB4ZmYsIGl0ID4+IDE2ICYgMHhmZiwgaXQgPj4gMjQgJiAweGZmXTtcbn07XG52YXIgcGFja0Y2NCA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHBhY2tJRUVFNzU0KGl0LCA1MiwgOCk7XG59O1xudmFyIHBhY2tGMzIgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBwYWNrSUVFRTc1NChpdCwgMjMsIDQpO1xufTtcblxudmFyIGFkZEdldHRlciA9IGZ1bmN0aW9uKEMsIGtleSwgaW50ZXJuYWwpe1xuICBkUChDW1BST1RPVFlQRV0sIGtleSwge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXNbaW50ZXJuYWxdOyB9fSk7XG59O1xuXG52YXIgZ2V0ID0gZnVuY3Rpb24odmlldywgYnl0ZXMsIGluZGV4LCBpc0xpdHRsZUVuZGlhbil7XG4gIHZhciBudW1JbmRleCA9ICtpbmRleFxuICAgICwgaW50SW5kZXggPSB0b0ludGVnZXIobnVtSW5kZXgpO1xuICBpZihudW1JbmRleCAhPSBpbnRJbmRleCB8fCBpbnRJbmRleCA8IDAgfHwgaW50SW5kZXggKyBieXRlcyA+IHZpZXdbJExFTkdUSF0pdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19JTkRFWCk7XG4gIHZhciBzdG9yZSA9IHZpZXdbJEJVRkZFUl0uX2JcbiAgICAsIHN0YXJ0ID0gaW50SW5kZXggKyB2aWV3WyRPRkZTRVRdXG4gICAgLCBwYWNrICA9IHN0b3JlLnNsaWNlKHN0YXJ0LCBzdGFydCArIGJ5dGVzKTtcbiAgcmV0dXJuIGlzTGl0dGxlRW5kaWFuID8gcGFjayA6IHBhY2sucmV2ZXJzZSgpO1xufTtcbnZhciBzZXQgPSBmdW5jdGlvbih2aWV3LCBieXRlcywgaW5kZXgsIGNvbnZlcnNpb24sIHZhbHVlLCBpc0xpdHRsZUVuZGlhbil7XG4gIHZhciBudW1JbmRleCA9ICtpbmRleFxuICAgICwgaW50SW5kZXggPSB0b0ludGVnZXIobnVtSW5kZXgpO1xuICBpZihudW1JbmRleCAhPSBpbnRJbmRleCB8fCBpbnRJbmRleCA8IDAgfHwgaW50SW5kZXggKyBieXRlcyA+IHZpZXdbJExFTkdUSF0pdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19JTkRFWCk7XG4gIHZhciBzdG9yZSA9IHZpZXdbJEJVRkZFUl0uX2JcbiAgICAsIHN0YXJ0ID0gaW50SW5kZXggKyB2aWV3WyRPRkZTRVRdXG4gICAgLCBwYWNrICA9IGNvbnZlcnNpb24oK3ZhbHVlKTtcbiAgZm9yKHZhciBpID0gMDsgaSA8IGJ5dGVzOyBpKyspc3RvcmVbc3RhcnQgKyBpXSA9IHBhY2tbaXNMaXR0bGVFbmRpYW4gPyBpIDogYnl0ZXMgLSBpIC0gMV07XG59O1xuXG52YXIgdmFsaWRhdGVBcnJheUJ1ZmZlckFyZ3VtZW50cyA9IGZ1bmN0aW9uKHRoYXQsIGxlbmd0aCl7XG4gIGFuSW5zdGFuY2UodGhhdCwgJEFycmF5QnVmZmVyLCBBUlJBWV9CVUZGRVIpO1xuICB2YXIgbnVtYmVyTGVuZ3RoID0gK2xlbmd0aFxuICAgICwgYnl0ZUxlbmd0aCAgID0gdG9MZW5ndGgobnVtYmVyTGVuZ3RoKTtcbiAgaWYobnVtYmVyTGVuZ3RoICE9IGJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICByZXR1cm4gYnl0ZUxlbmd0aDtcbn07XG5cbmlmKCEkdHlwZWQuQUJWKXtcbiAgJEFycmF5QnVmZmVyID0gZnVuY3Rpb24gQXJyYXlCdWZmZXIobGVuZ3RoKXtcbiAgICB2YXIgYnl0ZUxlbmd0aCA9IHZhbGlkYXRlQXJyYXlCdWZmZXJBcmd1bWVudHModGhpcywgbGVuZ3RoKTtcbiAgICB0aGlzLl9iICAgICAgID0gYXJyYXlGaWxsLmNhbGwoQXJyYXkoYnl0ZUxlbmd0aCksIDApO1xuICAgIHRoaXNbJExFTkdUSF0gPSBieXRlTGVuZ3RoO1xuICB9O1xuXG4gICREYXRhVmlldyA9IGZ1bmN0aW9uIERhdGFWaWV3KGJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCl7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkRGF0YVZpZXcsIERBVEFfVklFVyk7XG4gICAgYW5JbnN0YW5jZShidWZmZXIsICRBcnJheUJ1ZmZlciwgREFUQV9WSUVXKTtcbiAgICB2YXIgYnVmZmVyTGVuZ3RoID0gYnVmZmVyWyRMRU5HVEhdXG4gICAgICAsIG9mZnNldCAgICAgICA9IHRvSW50ZWdlcihieXRlT2Zmc2V0KTtcbiAgICBpZihvZmZzZXQgPCAwIHx8IG9mZnNldCA+IGJ1ZmZlckxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKCdXcm9uZyBvZmZzZXQhJyk7XG4gICAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPT09IHVuZGVmaW5lZCA/IGJ1ZmZlckxlbmd0aCAtIG9mZnNldCA6IHRvTGVuZ3RoKGJ5dGVMZW5ndGgpO1xuICAgIGlmKG9mZnNldCArIGJ5dGVMZW5ndGggPiBidWZmZXJMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgIHRoaXNbJEJVRkZFUl0gPSBidWZmZXI7XG4gICAgdGhpc1skT0ZGU0VUXSA9IG9mZnNldDtcbiAgICB0aGlzWyRMRU5HVEhdID0gYnl0ZUxlbmd0aDtcbiAgfTtcblxuICBpZihERVNDUklQVE9SUyl7XG4gICAgYWRkR2V0dGVyKCRBcnJheUJ1ZmZlciwgQllURV9MRU5HVEgsICdfbCcpO1xuICAgIGFkZEdldHRlcigkRGF0YVZpZXcsIEJVRkZFUiwgJ19iJyk7XG4gICAgYWRkR2V0dGVyKCREYXRhVmlldywgQllURV9MRU5HVEgsICdfbCcpO1xuICAgIGFkZEdldHRlcigkRGF0YVZpZXcsIEJZVEVfT0ZGU0VULCAnX28nKTtcbiAgfVxuXG4gIHJlZGVmaW5lQWxsKCREYXRhVmlld1tQUk9UT1RZUEVdLCB7XG4gICAgZ2V0SW50ODogZnVuY3Rpb24gZ2V0SW50OChieXRlT2Zmc2V0KXtcbiAgICAgIHJldHVybiBnZXQodGhpcywgMSwgYnl0ZU9mZnNldClbMF0gPDwgMjQgPj4gMjQ7XG4gICAgfSxcbiAgICBnZXRVaW50ODogZnVuY3Rpb24gZ2V0VWludDgoYnl0ZU9mZnNldCl7XG4gICAgICByZXR1cm4gZ2V0KHRoaXMsIDEsIGJ5dGVPZmZzZXQpWzBdO1xuICAgIH0sXG4gICAgZ2V0SW50MTY6IGZ1bmN0aW9uIGdldEludDE2KGJ5dGVPZmZzZXQgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICB2YXIgYnl0ZXMgPSBnZXQodGhpcywgMiwgYnl0ZU9mZnNldCwgYXJndW1lbnRzWzFdKTtcbiAgICAgIHJldHVybiAoYnl0ZXNbMV0gPDwgOCB8IGJ5dGVzWzBdKSA8PCAxNiA+PiAxNjtcbiAgICB9LFxuICAgIGdldFVpbnQxNjogZnVuY3Rpb24gZ2V0VWludDE2KGJ5dGVPZmZzZXQgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICB2YXIgYnl0ZXMgPSBnZXQodGhpcywgMiwgYnl0ZU9mZnNldCwgYXJndW1lbnRzWzFdKTtcbiAgICAgIHJldHVybiBieXRlc1sxXSA8PCA4IHwgYnl0ZXNbMF07XG4gICAgfSxcbiAgICBnZXRJbnQzMjogZnVuY3Rpb24gZ2V0SW50MzIoYnl0ZU9mZnNldCAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHJldHVybiB1bnBhY2tJMzIoZ2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSkpO1xuICAgIH0sXG4gICAgZ2V0VWludDMyOiBmdW5jdGlvbiBnZXRVaW50MzIoYnl0ZU9mZnNldCAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHJldHVybiB1bnBhY2tJMzIoZ2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSkpID4+PiAwO1xuICAgIH0sXG4gICAgZ2V0RmxvYXQzMjogZnVuY3Rpb24gZ2V0RmxvYXQzMihieXRlT2Zmc2V0IC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgcmV0dXJuIHVucGFja0lFRUU3NTQoZ2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSksIDIzLCA0KTtcbiAgICB9LFxuICAgIGdldEZsb2F0NjQ6IGZ1bmN0aW9uIGdldEZsb2F0NjQoYnl0ZU9mZnNldCAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHJldHVybiB1bnBhY2tJRUVFNzU0KGdldCh0aGlzLCA4LCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pLCA1MiwgOCk7XG4gICAgfSxcbiAgICBzZXRJbnQ4OiBmdW5jdGlvbiBzZXRJbnQ4KGJ5dGVPZmZzZXQsIHZhbHVlKXtcbiAgICAgIHNldCh0aGlzLCAxLCBieXRlT2Zmc2V0LCBwYWNrSTgsIHZhbHVlKTtcbiAgICB9LFxuICAgIHNldFVpbnQ4OiBmdW5jdGlvbiBzZXRVaW50OChieXRlT2Zmc2V0LCB2YWx1ZSl7XG4gICAgICBzZXQodGhpcywgMSwgYnl0ZU9mZnNldCwgcGFja0k4LCB2YWx1ZSk7XG4gICAgfSxcbiAgICBzZXRJbnQxNjogZnVuY3Rpb24gc2V0SW50MTYoYnl0ZU9mZnNldCwgdmFsdWUgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICBzZXQodGhpcywgMiwgYnl0ZU9mZnNldCwgcGFja0kxNiwgdmFsdWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfSxcbiAgICBzZXRVaW50MTY6IGZ1bmN0aW9uIHNldFVpbnQxNihieXRlT2Zmc2V0LCB2YWx1ZSAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHNldCh0aGlzLCAyLCBieXRlT2Zmc2V0LCBwYWNrSTE2LCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9LFxuICAgIHNldEludDMyOiBmdW5jdGlvbiBzZXRJbnQzMihieXRlT2Zmc2V0LCB2YWx1ZSAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHNldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBwYWNrSTMyLCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9LFxuICAgIHNldFVpbnQzMjogZnVuY3Rpb24gc2V0VWludDMyKGJ5dGVPZmZzZXQsIHZhbHVlIC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgc2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIHBhY2tJMzIsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0RmxvYXQzMjogZnVuY3Rpb24gc2V0RmxvYXQzMihieXRlT2Zmc2V0LCB2YWx1ZSAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHNldCh0aGlzLCA0LCBieXRlT2Zmc2V0LCBwYWNrRjMyLCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9LFxuICAgIHNldEZsb2F0NjQ6IGZ1bmN0aW9uIHNldEZsb2F0NjQoYnl0ZU9mZnNldCwgdmFsdWUgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICBzZXQodGhpcywgOCwgYnl0ZU9mZnNldCwgcGFja0Y2NCwgdmFsdWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfVxuICB9KTtcbn0gZWxzZSB7XG4gIGlmKCFmYWlscyhmdW5jdGlvbigpe1xuICAgIG5ldyAkQXJyYXlCdWZmZXI7ICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICB9KSB8fCAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgJEFycmF5QnVmZmVyKC41KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgfSkpe1xuICAgICRBcnJheUJ1ZmZlciA9IGZ1bmN0aW9uIEFycmF5QnVmZmVyKGxlbmd0aCl7XG4gICAgICByZXR1cm4gbmV3IEJhc2VCdWZmZXIodmFsaWRhdGVBcnJheUJ1ZmZlckFyZ3VtZW50cyh0aGlzLCBsZW5ndGgpKTtcbiAgICB9O1xuICAgIHZhciBBcnJheUJ1ZmZlclByb3RvID0gJEFycmF5QnVmZmVyW1BST1RPVFlQRV0gPSBCYXNlQnVmZmVyW1BST1RPVFlQRV07XG4gICAgZm9yKHZhciBrZXlzID0gZ09QTihCYXNlQnVmZmVyKSwgaiA9IDAsIGtleTsga2V5cy5sZW5ndGggPiBqOyApe1xuICAgICAgaWYoISgoa2V5ID0ga2V5c1tqKytdKSBpbiAkQXJyYXlCdWZmZXIpKWhpZGUoJEFycmF5QnVmZmVyLCBrZXksIEJhc2VCdWZmZXJba2V5XSk7XG4gICAgfTtcbiAgICBpZighTElCUkFSWSlBcnJheUJ1ZmZlclByb3RvLmNvbnN0cnVjdG9yID0gJEFycmF5QnVmZmVyO1xuICB9XG4gIC8vIGlPUyBTYWZhcmkgNy54IGJ1Z1xuICB2YXIgdmlldyA9IG5ldyAkRGF0YVZpZXcobmV3ICRBcnJheUJ1ZmZlcigyKSlcbiAgICAsICRzZXRJbnQ4ID0gJERhdGFWaWV3W1BST1RPVFlQRV0uc2V0SW50ODtcbiAgdmlldy5zZXRJbnQ4KDAsIDIxNDc0ODM2NDgpO1xuICB2aWV3LnNldEludDgoMSwgMjE0NzQ4MzY0OSk7XG4gIGlmKHZpZXcuZ2V0SW50OCgwKSB8fCAhdmlldy5nZXRJbnQ4KDEpKXJlZGVmaW5lQWxsKCREYXRhVmlld1tQUk9UT1RZUEVdLCB7XG4gICAgc2V0SW50ODogZnVuY3Rpb24gc2V0SW50OChieXRlT2Zmc2V0LCB2YWx1ZSl7XG4gICAgICAkc2V0SW50OC5jYWxsKHRoaXMsIGJ5dGVPZmZzZXQsIHZhbHVlIDw8IDI0ID4+IDI0KTtcbiAgICB9LFxuICAgIHNldFVpbnQ4OiBmdW5jdGlvbiBzZXRVaW50OChieXRlT2Zmc2V0LCB2YWx1ZSl7XG4gICAgICAkc2V0SW50OC5jYWxsKHRoaXMsIGJ5dGVPZmZzZXQsIHZhbHVlIDw8IDI0ID4+IDI0KTtcbiAgICB9XG4gIH0sIHRydWUpO1xufVxuc2V0VG9TdHJpbmdUYWcoJEFycmF5QnVmZmVyLCBBUlJBWV9CVUZGRVIpO1xuc2V0VG9TdHJpbmdUYWcoJERhdGFWaWV3LCBEQVRBX1ZJRVcpO1xuaGlkZSgkRGF0YVZpZXdbUFJPVE9UWVBFXSwgJHR5cGVkLlZJRVcsIHRydWUpO1xuZXhwb3J0c1tBUlJBWV9CVUZGRVJdID0gJEFycmF5QnVmZmVyO1xuZXhwb3J0c1tEQVRBX1ZJRVddID0gJERhdGFWaWV3OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgVFlQRUQgID0gdWlkKCd0eXBlZF9hcnJheScpXG4gICwgVklFVyAgID0gdWlkKCd2aWV3JylcbiAgLCBBQlYgICAgPSAhIShnbG9iYWwuQXJyYXlCdWZmZXIgJiYgZ2xvYmFsLkRhdGFWaWV3KVxuICAsIENPTlNUUiA9IEFCVlxuICAsIGkgPSAwLCBsID0gOSwgVHlwZWQ7XG5cbnZhciBUeXBlZEFycmF5Q29uc3RydWN0b3JzID0gKFxuICAnSW50OEFycmF5LFVpbnQ4QXJyYXksVWludDhDbGFtcGVkQXJyYXksSW50MTZBcnJheSxVaW50MTZBcnJheSxJbnQzMkFycmF5LFVpbnQzMkFycmF5LEZsb2F0MzJBcnJheSxGbG9hdDY0QXJyYXknXG4pLnNwbGl0KCcsJyk7XG5cbndoaWxlKGkgPCBsKXtcbiAgaWYoVHlwZWQgPSBnbG9iYWxbVHlwZWRBcnJheUNvbnN0cnVjdG9yc1tpKytdXSl7XG4gICAgaGlkZShUeXBlZC5wcm90b3R5cGUsIFRZUEVELCB0cnVlKTtcbiAgICBoaWRlKFR5cGVkLnByb3RvdHlwZSwgVklFVywgdHJ1ZSk7XG4gIH0gZWxzZSBDT05TVFIgPSBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEFCVjogICAgQUJWLFxuICBDT05TVFI6IENPTlNUUixcbiAgVFlQRUQ6ICBUWVBFRCxcbiAgVklFVzogICBWSUVXXG59OyIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59OyIsInZhciBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsIHdrc0V4dCAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpXG4gICwgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgdmFyICRTeW1ib2wgPSBjb3JlLlN5bWJvbCB8fCAoY29yZS5TeW1ib2wgPSBMSUJSQVJZID8ge30gOiBnbG9iYWwuU3ltYm9sIHx8IHt9KTtcbiAgaWYobmFtZS5jaGFyQXQoMCkgIT0gJ18nICYmICEobmFtZSBpbiAkU3ltYm9sKSlkZWZpbmVQcm9wZXJ0eSgkU3ltYm9sLCBuYW1lLCB7dmFsdWU6IHdrc0V4dC5mKG5hbWUpfSk7XG59OyIsImV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX3drcycpOyIsInZhciBzdG9yZSAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgU3ltYm9sICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbFxuICAsIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlOyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsIi8vIDIyLjEuMy4zIEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIGVuZCA9IHRoaXMubGVuZ3RoKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHtjb3B5V2l0aGluOiByZXF1aXJlKCcuL19hcnJheS1jb3B5LXdpdGhpbicpfSk7XG5cbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKCdjb3B5V2l0aGluJyk7IiwiLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ0FycmF5Jywge2ZpbGw6IHJlcXVpcmUoJy4vX2FycmF5LWZpbGwnKX0pO1xuXG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKSgnZmlsbCcpOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDIyLjEuMy45IEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRmaW5kICAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoNilcbiAgLCBLRVkgICAgID0gJ2ZpbmRJbmRleCdcbiAgLCBmb3JjZWQgID0gdHJ1ZTtcbi8vIFNob3VsZG4ndCBza2lwIGhvbGVzXG5pZihLRVkgaW4gW10pQXJyYXkoMSlbS0VZXShmdW5jdGlvbigpeyBmb3JjZWQgPSBmYWxzZTsgfSk7XG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIGZvcmNlZCwgJ0FycmF5Jywge1xuICBmaW5kSW5kZXg6IGZ1bmN0aW9uIGZpbmRJbmRleChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZmluZCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoS0VZKTsiLCIndXNlIHN0cmljdCc7XG4vLyAyMi4xLjMuOCBBcnJheS5wcm90b3R5cGUuZmluZChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGZpbmQgICA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSg1KVxuICAsIEtFWSAgICAgPSAnZmluZCdcbiAgLCBmb3JjZWQgID0gdHJ1ZTtcbi8vIFNob3VsZG4ndCBza2lwIGhvbGVzXG5pZihLRVkgaW4gW10pQXJyYXkoMSlbS0VZXShmdW5jdGlvbigpeyBmb3JjZWQgPSBmYWxzZTsgfSk7XG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIGZvcmNlZCwgJ0FycmF5Jywge1xuICBmaW5kOiBmdW5jdGlvbiBmaW5kKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRmaW5kKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKShLRVkpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHRvT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBjYWxsICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgICAgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgLCB0b0xlbmd0aCAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKVxuICAsIGdldEl0ZXJGbiAgICAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZS8qLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCovKXtcbiAgICB2YXIgTyAgICAgICA9IHRvT2JqZWN0KGFycmF5TGlrZSlcbiAgICAgICwgQyAgICAgICA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXlcbiAgICAgICwgYUxlbiAgICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgbWFwZm4gICA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkXG4gICAgICAsIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkXG4gICAgICAsIGluZGV4ICAgPSAwXG4gICAgICAsIGl0ZXJGbiAgPSBnZXRJdGVyRm4oTylcbiAgICAgICwgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmKG1hcHBpbmcpbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZihpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSl7XG4gICAgICBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEM7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKyl7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xuXG4vLyBXZWJLaXQgQXJyYXkub2YgaXNuJ3QgZ2VuZXJpY1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIGZ1bmN0aW9uIEYoKXt9XG4gIHJldHVybiAhKEFycmF5Lm9mLmNhbGwoRikgaW5zdGFuY2VvZiBGKTtcbn0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4zIEFycmF5Lm9mKCAuLi5pdGVtcylcbiAgb2Y6IGZ1bmN0aW9uIG9mKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHZhciBpbmRleCAgPSAwXG4gICAgICAsIGFMZW4gICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgcmVzdWx0ID0gbmV3ICh0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5KShhTGVuKTtcbiAgICB3aGlsZShhTGVuID4gaW5kZXgpY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICByZXN1bHQubGVuZ3RoID0gYUxlbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTsiLCJ2YXIgZFAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgaGFzICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgRlByb3RvICAgICA9IEZ1bmN0aW9uLnByb3RvdHlwZVxuICAsIG5hbWVSRSAgICAgPSAvXlxccypmdW5jdGlvbiAoW14gKF0qKS9cbiAgLCBOQU1FICAgICAgID0gJ25hbWUnO1xuXG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIDE5LjIuNC4yIG5hbWVcbk5BTUUgaW4gRlByb3RvIHx8IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgZFAoRlByb3RvLCBOQU1FLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpe1xuICAgIHRyeSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgLCBuYW1lID0gKCcnICsgdGhhdCkubWF0Y2gobmFtZVJFKVsxXTtcbiAgICAgIGhhcyh0aGF0LCBOQU1FKSB8fCAhaXNFeHRlbnNpYmxlKHRoYXQpIHx8IGRQKHRoYXQsIE5BTUUsIGNyZWF0ZURlc2MoNSwgbmFtZSkpO1xuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7IiwiLy8gMjAuMi4yLjMgTWF0aC5hY29zaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGxvZzFwICAgPSByZXF1aXJlKCcuL19tYXRoLWxvZzFwJylcbiAgLCBzcXJ0ICAgID0gTWF0aC5zcXJ0XG4gICwgJGFjb3NoICA9IE1hdGguYWNvc2g7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogISgkYWNvc2hcbiAgLy8gVjggYnVnOiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzUwOVxuICAmJiBNYXRoLmZsb29yKCRhY29zaChOdW1iZXIuTUFYX1ZBTFVFKSkgPT0gNzEwXG4gIC8vIFRvciBCcm93c2VyIGJ1ZzogTWF0aC5hY29zaChJbmZpbml0eSkgLT4gTmFOIFxuICAmJiAkYWNvc2goSW5maW5pdHkpID09IEluZmluaXR5XG4pLCAnTWF0aCcsIHtcbiAgYWNvc2g6IGZ1bmN0aW9uIGFjb3NoKHgpe1xuICAgIHJldHVybiAoeCA9ICt4KSA8IDEgPyBOYU4gOiB4ID4gOTQ5MDYyNjUuNjI0MjUxNTZcbiAgICAgID8gTWF0aC5sb2coeCkgKyBNYXRoLkxOMlxuICAgICAgOiBsb2cxcCh4IC0gMSArIHNxcnQoeCAtIDEpICogc3FydCh4ICsgMSkpO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuNSBNYXRoLmFzaW5oKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGFzaW5oICA9IE1hdGguYXNpbmg7XG5cbmZ1bmN0aW9uIGFzaW5oKHgpe1xuICByZXR1cm4gIWlzRmluaXRlKHggPSAreCkgfHwgeCA9PSAwID8geCA6IHggPCAwID8gLWFzaW5oKC14KSA6IE1hdGgubG9nKHggKyBNYXRoLnNxcnQoeCAqIHggKyAxKSk7XG59XG5cbi8vIFRvciBCcm93c2VyIGJ1ZzogTWF0aC5hc2luaCgwKSAtPiAtMCBcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogISgkYXNpbmggJiYgMSAvICRhc2luaCgwKSA+IDApLCAnTWF0aCcsIHthc2luaDogYXNpbmh9KTsiLCIvLyAyMC4yLjIuNyBNYXRoLmF0YW5oKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGF0YW5oICA9IE1hdGguYXRhbmg7XG5cbi8vIFRvciBCcm93c2VyIGJ1ZzogTWF0aC5hdGFuaCgtMCkgLT4gMCBcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogISgkYXRhbmggJiYgMSAvICRhdGFuaCgtMCkgPCAwKSwgJ01hdGgnLCB7XG4gIGF0YW5oOiBmdW5jdGlvbiBhdGFuaCh4KXtcbiAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiBNYXRoLmxvZygoMSArIHgpIC8gKDEgLSB4KSkgLyAyO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuOSBNYXRoLmNicnQoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBzaWduICAgID0gcmVxdWlyZSgnLi9fbWF0aC1zaWduJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgY2JydDogZnVuY3Rpb24gY2JydCh4KXtcbiAgICByZXR1cm4gc2lnbih4ID0gK3gpICogTWF0aC5wb3coTWF0aC5hYnMoeCksIDEgLyAzKTtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjExIE1hdGguY2x6MzIoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgY2x6MzI6IGZ1bmN0aW9uIGNsejMyKHgpe1xuICAgIHJldHVybiAoeCA+Pj49IDApID8gMzEgLSBNYXRoLmZsb29yKE1hdGgubG9nKHggKyAwLjUpICogTWF0aC5MT0cyRSkgOiAzMjtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjEyIE1hdGguY29zaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGV4cCAgICAgPSBNYXRoLmV4cDtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBjb3NoOiBmdW5jdGlvbiBjb3NoKHgpe1xuICAgIHJldHVybiAoZXhwKHggPSAreCkgKyBleHAoLXgpKSAvIDI7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4xNCBNYXRoLmV4cG0xKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGV4cG0xICA9IHJlcXVpcmUoJy4vX21hdGgtZXhwbTEnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoJGV4cG0xICE9IE1hdGguZXhwbTEpLCAnTWF0aCcsIHtleHBtMTogJGV4cG0xfSk7IiwiLy8gMjAuMi4yLjE2IE1hdGguZnJvdW5kKHgpXG52YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBzaWduICAgICAgPSByZXF1aXJlKCcuL19tYXRoLXNpZ24nKVxuICAsIHBvdyAgICAgICA9IE1hdGgucG93XG4gICwgRVBTSUxPTiAgID0gcG93KDIsIC01MilcbiAgLCBFUFNJTE9OMzIgPSBwb3coMiwgLTIzKVxuICAsIE1BWDMyICAgICA9IHBvdygyLCAxMjcpICogKDIgLSBFUFNJTE9OMzIpXG4gICwgTUlOMzIgICAgID0gcG93KDIsIC0xMjYpO1xuXG52YXIgcm91bmRUaWVzVG9FdmVuID0gZnVuY3Rpb24obil7XG4gIHJldHVybiBuICsgMSAvIEVQU0lMT04gLSAxIC8gRVBTSUxPTjtcbn07XG5cblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBmcm91bmQ6IGZ1bmN0aW9uIGZyb3VuZCh4KXtcbiAgICB2YXIgJGFicyAgPSBNYXRoLmFicyh4KVxuICAgICAgLCAkc2lnbiA9IHNpZ24oeClcbiAgICAgICwgYSwgcmVzdWx0O1xuICAgIGlmKCRhYnMgPCBNSU4zMilyZXR1cm4gJHNpZ24gKiByb3VuZFRpZXNUb0V2ZW4oJGFicyAvIE1JTjMyIC8gRVBTSUxPTjMyKSAqIE1JTjMyICogRVBTSUxPTjMyO1xuICAgIGEgPSAoMSArIEVQU0lMT04zMiAvIEVQU0lMT04pICogJGFicztcbiAgICByZXN1bHQgPSBhIC0gKGEgLSAkYWJzKTtcbiAgICBpZihyZXN1bHQgPiBNQVgzMiB8fCByZXN1bHQgIT0gcmVzdWx0KXJldHVybiAkc2lnbiAqIEluZmluaXR5O1xuICAgIHJldHVybiAkc2lnbiAqIHJlc3VsdDtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjE3IE1hdGguaHlwb3QoW3ZhbHVlMVssIHZhbHVlMlssIOKApiBdXV0pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgYWJzICAgICA9IE1hdGguYWJzO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGh5cG90OiBmdW5jdGlvbiBoeXBvdCh2YWx1ZTEsIHZhbHVlMil7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgc3VtICA9IDBcbiAgICAgICwgaSAgICA9IDBcbiAgICAgICwgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgbGFyZyA9IDBcbiAgICAgICwgYXJnLCBkaXY7XG4gICAgd2hpbGUoaSA8IGFMZW4pe1xuICAgICAgYXJnID0gYWJzKGFyZ3VtZW50c1tpKytdKTtcbiAgICAgIGlmKGxhcmcgPCBhcmcpe1xuICAgICAgICBkaXYgID0gbGFyZyAvIGFyZztcbiAgICAgICAgc3VtICA9IHN1bSAqIGRpdiAqIGRpdiArIDE7XG4gICAgICAgIGxhcmcgPSBhcmc7XG4gICAgICB9IGVsc2UgaWYoYXJnID4gMCl7XG4gICAgICAgIGRpdiAgPSBhcmcgLyBsYXJnO1xuICAgICAgICBzdW0gKz0gZGl2ICogZGl2O1xuICAgICAgfSBlbHNlIHN1bSArPSBhcmc7XG4gICAgfVxuICAgIHJldHVybiBsYXJnID09PSBJbmZpbml0eSA/IEluZmluaXR5IDogbGFyZyAqIE1hdGguc3FydChzdW0pO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMTggTWF0aC5pbXVsKHgsIHkpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGltdWwgICA9IE1hdGguaW11bDtcblxuLy8gc29tZSBXZWJLaXQgdmVyc2lvbnMgZmFpbHMgd2l0aCBiaWcgbnVtYmVycywgc29tZSBoYXMgd3JvbmcgYXJpdHlcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gJGltdWwoMHhmZmZmZmZmZiwgNSkgIT0gLTUgfHwgJGltdWwubGVuZ3RoICE9IDI7XG59KSwgJ01hdGgnLCB7XG4gIGltdWw6IGZ1bmN0aW9uIGltdWwoeCwgeSl7XG4gICAgdmFyIFVJTlQxNiA9IDB4ZmZmZlxuICAgICAgLCB4biA9ICt4XG4gICAgICAsIHluID0gK3lcbiAgICAgICwgeGwgPSBVSU5UMTYgJiB4blxuICAgICAgLCB5bCA9IFVJTlQxNiAmIHluO1xuICAgIHJldHVybiAwIHwgeGwgKiB5bCArICgoVUlOVDE2ICYgeG4gPj4+IDE2KSAqIHlsICsgeGwgKiAoVUlOVDE2ICYgeW4gPj4+IDE2KSA8PCAxNiA+Pj4gMCk7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4yMSBNYXRoLmxvZzEwKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGxvZzEwOiBmdW5jdGlvbiBsb2cxMCh4KXtcbiAgICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLkxOMTA7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4yMCBNYXRoLmxvZzFwKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7bG9nMXA6IHJlcXVpcmUoJy4vX21hdGgtbG9nMXAnKX0pOyIsIi8vIDIwLjIuMi4yMiBNYXRoLmxvZzIoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgbG9nMjogZnVuY3Rpb24gbG9nMih4KXtcbiAgICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLkxOMjtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge3NpZ246IHJlcXVpcmUoJy4vX21hdGgtc2lnbicpfSk7IiwiLy8gMjAuMi4yLjMwIE1hdGguc2luaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGV4cG0xICAgPSByZXF1aXJlKCcuL19tYXRoLWV4cG0xJylcbiAgLCBleHAgICAgID0gTWF0aC5leHA7XG5cbi8vIFY4IG5lYXIgQ2hyb21pdW0gMzggaGFzIGEgcHJvYmxlbSB3aXRoIHZlcnkgc21hbGwgbnVtYmVyc1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiAhTWF0aC5zaW5oKC0yZS0xNykgIT0gLTJlLTE3O1xufSksICdNYXRoJywge1xuICBzaW5oOiBmdW5jdGlvbiBzaW5oKHgpe1xuICAgIHJldHVybiBNYXRoLmFicyh4ID0gK3gpIDwgMVxuICAgICAgPyAoZXhwbTEoeCkgLSBleHBtMSgteCkpIC8gMlxuICAgICAgOiAoZXhwKHggLSAxKSAtIGV4cCgteCAtIDEpKSAqIChNYXRoLkUgLyAyKTtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjMzIE1hdGgudGFuaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGV4cG0xICAgPSByZXF1aXJlKCcuL19tYXRoLWV4cG0xJylcbiAgLCBleHAgICAgID0gTWF0aC5leHA7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgdGFuaDogZnVuY3Rpb24gdGFuaCh4KXtcbiAgICB2YXIgYSA9IGV4cG0xKHggPSAreClcbiAgICAgICwgYiA9IGV4cG0xKC14KTtcbiAgICByZXR1cm4gYSA9PSBJbmZpbml0eSA/IDEgOiBiID09IEluZmluaXR5ID8gLTEgOiAoYSAtIGIpIC8gKGV4cCh4KSArIGV4cCgteCkpO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMzQgTWF0aC50cnVuYyh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICB0cnVuYzogZnVuY3Rpb24gdHJ1bmMoaXQpe1xuICAgIHJldHVybiAoaXQgPiAwID8gTWF0aC5mbG9vciA6IE1hdGguY2VpbCkoaXQpO1xuICB9XG59KTsiLCIvLyAyMC4xLjIuMSBOdW1iZXIuRVBTSUxPTlxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7RVBTSUxPTjogTWF0aC5wb3coMiwgLTUyKX0pOyIsIi8vIDIwLjEuMi4yIE51bWJlci5pc0Zpbml0ZShudW1iZXIpXG52YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBfaXNGaW5pdGUgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5pc0Zpbml0ZTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7XG4gIGlzRmluaXRlOiBmdW5jdGlvbiBpc0Zpbml0ZShpdCl7XG4gICAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnbnVtYmVyJyAmJiBfaXNGaW5pdGUoaXQpO1xuICB9XG59KTsiLCIvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge2lzSW50ZWdlcjogcmVxdWlyZSgnLi9faXMtaW50ZWdlcicpfSk7IiwiLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge1xuICBpc05hTjogZnVuY3Rpb24gaXNOYU4obnVtYmVyKXtcbiAgICByZXR1cm4gbnVtYmVyICE9IG51bWJlcjtcbiAgfVxufSk7IiwiLy8gMjAuMS4yLjUgTnVtYmVyLmlzU2FmZUludGVnZXIobnVtYmVyKVxudmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgaXNJbnRlZ2VyID0gcmVxdWlyZSgnLi9faXMtaW50ZWdlcicpXG4gICwgYWJzICAgICAgID0gTWF0aC5hYnM7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge1xuICBpc1NhZmVJbnRlZ2VyOiBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKG51bWJlcil7XG4gICAgcmV0dXJuIGlzSW50ZWdlcihudW1iZXIpICYmIGFicyhudW1iZXIpIDw9IDB4MWZmZmZmZmZmZmZmZmY7XG4gIH1cbn0pOyIsIi8vIDIwLjEuMi42IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtNQVhfU0FGRV9JTlRFR0VSOiAweDFmZmZmZmZmZmZmZmZmfSk7IiwiLy8gMjAuMS4yLjEwIE51bWJlci5NSU5fU0FGRV9JTlRFR0VSXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtNSU5fU0FGRV9JTlRFR0VSOiAtMHgxZmZmZmZmZmZmZmZmZn0pOyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHthc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKX0pOyIsIi8vIDE5LjEuMy4xMCBPYmplY3QuaXModmFsdWUxLCB2YWx1ZTIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7aXM6IHJlcXVpcmUoJy4vX3NhbWUtdmFsdWUnKX0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7c2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldH0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGN0eCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgY2xhc3NvZiAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgJGV4cG9ydCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBpc09iamVjdCAgICAgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIGFuSW5zdGFuY2UgICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBmb3JPZiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKVxuICAsIHRhc2sgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBtaWNyb3Rhc2sgICAgICAgICAgPSByZXF1aXJlKCcuL19taWNyb3Rhc2snKSgpXG4gICwgUFJPTUlTRSAgICAgICAgICAgID0gJ1Byb21pc2UnXG4gICwgVHlwZUVycm9yICAgICAgICAgID0gZ2xvYmFsLlR5cGVFcnJvclxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgJFByb21pc2UgICAgICAgICAgID0gZ2xvYmFsW1BST01JU0VdXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBpc05vZGUgICAgICAgICAgICAgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIGVtcHR5ICAgICAgICAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBJbnRlcm5hbCwgR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBXcmFwcGVyO1xuXG52YXIgVVNFX05BVElWRSA9ICEhZnVuY3Rpb24oKXtcbiAgdHJ5IHtcbiAgICAvLyBjb3JyZWN0IHN1YmNsYXNzaW5nIHdpdGggQEBzcGVjaWVzIHN1cHBvcnRcbiAgICB2YXIgcHJvbWlzZSAgICAgPSAkUHJvbWlzZS5yZXNvbHZlKDEpXG4gICAgICAsIEZha2VQcm9taXNlID0gKHByb21pc2UuY29uc3RydWN0b3IgPSB7fSlbcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKV0gPSBmdW5jdGlvbihleGVjKXsgZXhlYyhlbXB0eSwgZW1wdHkpOyB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpICYmIHByb21pc2UudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBGYWtlUHJvbWlzZTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufSgpO1xuXG4vLyBoZWxwZXJzXG52YXIgc2FtZUNvbnN0cnVjdG9yID0gZnVuY3Rpb24oYSwgYil7XG4gIC8vIHdpdGggbGlicmFyeSB3cmFwcGVyIHNwZWNpYWwgY2FzZVxuICByZXR1cm4gYSA9PT0gYiB8fCBhID09PSAkUHJvbWlzZSAmJiBiID09PSBXcmFwcGVyO1xufTtcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICByZXR1cm4gc2FtZUNvbnN0cnVjdG9yKCRQcm9taXNlLCBDKVxuICAgID8gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgOiBuZXcgR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5KEMpO1xufTtcbnZhciBQcm9taXNlQ2FwYWJpbGl0eSA9IEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbigkJHJlc29sdmUsICQkcmVqZWN0KXtcbiAgICBpZihyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ICA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCAgPSBhRnVuY3Rpb24ocmVqZWN0KTtcbn07XG52YXIgcGVyZm9ybSA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIGV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4ge2Vycm9yOiBlfTtcbiAgfVxufTtcbnZhciBub3RpZnkgPSBmdW5jdGlvbihwcm9taXNlLCBpc1JlamVjdCl7XG4gIGlmKHByb21pc2UuX24pcmV0dXJuO1xuICBwcm9taXNlLl9uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYztcbiAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgLCBvayAgICA9IHByb21pc2UuX3MgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uKHJlYWN0aW9uKXtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWxcbiAgICAgICAgLCByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZVxuICAgICAgICAsIHJlamVjdCAgPSByZWFjdGlvbi5yZWplY3RcbiAgICAgICAgLCBkb21haW4gID0gcmVhY3Rpb24uZG9tYWluXG4gICAgICAgICwgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoaGFuZGxlcil7XG4gICAgICAgICAgaWYoIW9rKXtcbiAgICAgICAgICAgIGlmKHByb21pc2UuX2ggPT0gMilvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihoYW5kbGVyID09PSB0cnVlKXJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYoZG9tYWluKWRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7XG4gICAgICAgICAgICBpZihkb21haW4pZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKXtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpe1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3QgJiYgIXByb21pc2UuX2gpb25VbmhhbmRsZWQocHJvbWlzZSk7XG4gIH0pO1xufTtcbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICwgYWJydXB0LCBoYW5kbGVyLCBjb25zb2xlO1xuICAgIGlmKGlzVW5oYW5kbGVkKHByb21pc2UpKXtcbiAgICAgIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoaXNOb2RlKXtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pe1xuICAgICAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3Ipe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZihhYnJ1cHQpdGhyb3cgYWJydXB0LmVycm9yO1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgaWYocHJvbWlzZS5faCA9PSAxKXJldHVybiBmYWxzZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYSB8fCBwcm9taXNlLl9jXG4gICAgLCBpICAgICA9IDBcbiAgICAsIHJlYWN0aW9uO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdGlvbiA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3Rpb24uZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3Rpb24ucHJvbWlzZSkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciBoYW5kbGVyO1xuICAgIGlmKGlzTm9kZSl7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnJlamVjdGlvbmhhbmRsZWQpe1xuICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92fSk7XG4gICAgfVxuICB9KTtcbn07XG52YXIgJHJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZihwcm9taXNlLl9kKXJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICBwcm9taXNlLl92ID0gdmFsdWU7XG4gIHByb21pc2UuX3MgPSAyO1xuICBpZighcHJvbWlzZS5fYSlwcm9taXNlLl9hID0gcHJvbWlzZS5fYy5zbGljZSgpO1xuICBub3RpZnkocHJvbWlzZSwgdHJ1ZSk7XG59O1xudmFyICRyZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXNcbiAgICAsIHRoZW47XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYocHJvbWlzZSA9PT0gdmFsdWUpdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIG1pY3JvdGFzayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9taXNlLl92ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zID0gMTtcbiAgICAgIG5vdGlmeShwcm9taXNlLCBmYWxzZSk7XG4gICAgfVxuICB9IGNhdGNoKGUpe1xuICAgICRyZWplY3QuY2FsbCh7X3c6IHByb21pc2UsIF9kOiBmYWxzZX0sIGUpOyAvLyB3cmFwXG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZighVVNFX05BVElWRSl7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gICRQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkUHJvbWlzZSwgUFJPTUlTRSwgJ19oJyk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHRoaXMsIDEpLCBjdHgoJHJlamVjdCwgdGhpcywgMSkpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICRyZWplY3QuY2FsbCh0aGlzLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgSW50ZXJuYWwgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xuICAgICAgdmFyIHJlYWN0aW9uICAgID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsICRQcm9taXNlKSk7XG4gICAgICByZWFjdGlvbi5vayAgICAgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgICA9IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZDtcbiAgICAgIHJlYWN0aW9uLmRvbWFpbiA9IGlzTm9kZSA/IHByb2Nlc3MuZG9tYWluIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHRoaXMuX2EpdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHRoaXMuX3Mpbm90aWZ5KHRoaXMsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xuICBQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHByb21pc2UgID0gbmV3IEludGVybmFsO1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5yZXNvbHZlID0gY3R4KCRyZXNvbHZlLCBwcm9taXNlLCAxKTtcbiAgICB0aGlzLnJlamVjdCAgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtQcm9taXNlOiAkUHJvbWlzZX0pO1xucmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKSgkUHJvbWlzZSwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuL19zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NvcmUnKVtQUk9NSVNFXTtcblxuLy8gc3RhdGljc1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKXtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVqZWN0ICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKExJQlJBUlkgfHwgIVVTRV9OQVRJVkUpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIC8vIGluc3RhbmNlb2YgaW5zdGVhZCBvZiBpbnRlcm5hbCBzbG90IGNoZWNrIGJlY2F1c2Ugd2Ugc2hvdWxkIGZpeCBpdCB3aXRob3V0IHJlcGxhY2VtZW50IG5hdGl2ZSBQcm9taXNlIGNvcmVcbiAgICBpZih4IGluc3RhbmNlb2YgJFByb21pc2UgJiYgc2FtZUNvbnN0cnVjdG9yKHguY29uc3RydWN0b3IsIHRoaXMpKXJldHVybiB4O1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZXNvbHZlICA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICAkJHJlc29sdmUoeCk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpe1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSB0aGlzXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZXNvbHZlICAgID0gY2FwYWJpbGl0eS5yZXNvbHZlXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgdmFyIHZhbHVlcyAgICA9IFtdXG4gICAgICAgICwgaW5kZXggICAgID0gMFxuICAgICAgICAsIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICB2YXIgJGluZGV4ICAgICAgICA9IGluZGV4KytcbiAgICAgICAgICAsIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBpZihhbHJlYWR5Q2FsbGVkKXJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkICA9IHRydWU7XG4gICAgICAgICAgdmFsdWVzWyRpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pOyIsIi8vIDI2LjEuMSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KVxudmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgYW5PYmplY3QgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCByQXBwbHkgICAgPSAocmVxdWlyZSgnLi9fZ2xvYmFsJykuUmVmbGVjdCB8fCB7fSkuYXBwbHlcbiAgLCBmQXBwbHkgICAgPSBGdW5jdGlvbi5hcHBseTtcbi8vIE1TIEVkZ2UgYXJndW1lbnRzTGlzdCBhcmd1bWVudCBpcyBvcHRpb25hbFxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByQXBwbHkoZnVuY3Rpb24oKXt9KTtcbn0pLCAnUmVmbGVjdCcsIHtcbiAgYXBwbHk6IGZ1bmN0aW9uIGFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KXtcbiAgICB2YXIgVCA9IGFGdW5jdGlvbih0YXJnZXQpXG4gICAgICAsIEwgPSBhbk9iamVjdChhcmd1bWVudHNMaXN0KTtcbiAgICByZXR1cm4gckFwcGx5ID8gckFwcGx5KFQsIHRoaXNBcmd1bWVudCwgTCkgOiBmQXBwbHkuY2FsbChULCB0aGlzQXJndW1lbnQsIEwpO1xuICB9XG59KTsiLCIvLyAyNi4xLjIgUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IFssIG5ld1RhcmdldF0pXG52YXIgJGV4cG9ydCAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgY3JlYXRlICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGFGdW5jdGlvbiAgPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBhbk9iamVjdCAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBpc09iamVjdCAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBmYWlscyAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIGJpbmQgICAgICAgPSByZXF1aXJlKCcuL19iaW5kJylcbiAgLCByQ29uc3RydWN0ID0gKHJlcXVpcmUoJy4vX2dsb2JhbCcpLlJlZmxlY3QgfHwge30pLmNvbnN0cnVjdDtcblxuLy8gTVMgRWRnZSBzdXBwb3J0cyBvbmx5IDIgYXJndW1lbnRzIGFuZCBhcmd1bWVudHNMaXN0IGFyZ3VtZW50IGlzIG9wdGlvbmFsXG4vLyBGRiBOaWdodGx5IHNldHMgdGhpcmQgYXJndW1lbnQgYXMgYG5ldy50YXJnZXRgLCBidXQgZG9lcyBub3QgY3JlYXRlIGB0aGlzYCBmcm9tIGl0XG52YXIgTkVXX1RBUkdFVF9CVUcgPSBmYWlscyhmdW5jdGlvbigpe1xuICBmdW5jdGlvbiBGKCl7fVxuICByZXR1cm4gIShyQ29uc3RydWN0KGZ1bmN0aW9uKCl7fSwgW10sIEYpIGluc3RhbmNlb2YgRik7XG59KTtcbnZhciBBUkdTX0JVRyA9ICFmYWlscyhmdW5jdGlvbigpe1xuICByQ29uc3RydWN0KGZ1bmN0aW9uKCl7fSk7XG59KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTkVXX1RBUkdFVF9CVUcgfHwgQVJHU19CVUcpLCAnUmVmbGVjdCcsIHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QoVGFyZ2V0LCBhcmdzIC8qLCBuZXdUYXJnZXQqLyl7XG4gICAgYUZ1bmN0aW9uKFRhcmdldCk7XG4gICAgYW5PYmplY3QoYXJncyk7XG4gICAgdmFyIG5ld1RhcmdldCA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gVGFyZ2V0IDogYUZ1bmN0aW9uKGFyZ3VtZW50c1syXSk7XG4gICAgaWYoQVJHU19CVUcgJiYgIU5FV19UQVJHRVRfQlVHKXJldHVybiByQ29uc3RydWN0KFRhcmdldCwgYXJncywgbmV3VGFyZ2V0KTtcbiAgICBpZihUYXJnZXQgPT0gbmV3VGFyZ2V0KXtcbiAgICAgIC8vIHcvbyBhbHRlcmVkIG5ld1RhcmdldCwgb3B0aW1pemF0aW9uIGZvciAwLTQgYXJndW1lbnRzXG4gICAgICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgVGFyZ2V0O1xuICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgVGFyZ2V0KGFyZ3NbMF0pO1xuICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgVGFyZ2V0KGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICBjYXNlIDM6IHJldHVybiBuZXcgVGFyZ2V0KGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICBjYXNlIDQ6IHJldHVybiBuZXcgVGFyZ2V0KGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICAgICAgfVxuICAgICAgLy8gdy9vIGFsdGVyZWQgbmV3VGFyZ2V0LCBsb3Qgb2YgYXJndW1lbnRzIGNhc2VcbiAgICAgIHZhciAkYXJncyA9IFtudWxsXTtcbiAgICAgICRhcmdzLnB1c2guYXBwbHkoJGFyZ3MsIGFyZ3MpO1xuICAgICAgcmV0dXJuIG5ldyAoYmluZC5hcHBseShUYXJnZXQsICRhcmdzKSk7XG4gICAgfVxuICAgIC8vIHdpdGggYWx0ZXJlZCBuZXdUYXJnZXQsIG5vdCBzdXBwb3J0IGJ1aWx0LWluIGNvbnN0cnVjdG9yc1xuICAgIHZhciBwcm90byAgICA9IG5ld1RhcmdldC5wcm90b3R5cGVcbiAgICAgICwgaW5zdGFuY2UgPSBjcmVhdGUoaXNPYmplY3QocHJvdG8pID8gcHJvdG8gOiBPYmplY3QucHJvdG90eXBlKVxuICAgICAgLCByZXN1bHQgICA9IEZ1bmN0aW9uLmFwcGx5LmNhbGwoVGFyZ2V0LCBpbnN0YW5jZSwgYXJncyk7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiBpbnN0YW5jZTtcbiAgfVxufSk7IiwiLy8gMjYuMS4zIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcylcbnZhciBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgJGV4cG9ydCAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xuXG4vLyBNUyBFZGdlIGhhcyBicm9rZW4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSAtIHRocm93aW5nIGluc3RlYWQgb2YgcmV0dXJuaW5nIGZhbHNlXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShkUC5mKHt9LCAxLCB7dmFsdWU6IDF9KSwgMSwge3ZhbHVlOiAyfSk7XG59KSwgJ1JlZmxlY3QnLCB7XG4gIGRlZmluZVByb3BlcnR5OiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKXtcbiAgICBhbk9iamVjdCh0YXJnZXQpO1xuICAgIHByb3BlcnR5S2V5ID0gdG9QcmltaXRpdmUocHJvcGVydHlLZXksIHRydWUpO1xuICAgIGFuT2JqZWN0KGF0dHJpYnV0ZXMpO1xuICAgIHRyeSB7XG4gICAgICBkUC5mKHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pOyIsIi8vIDI2LjEuNCBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGdPUEQgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24gZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSl7XG4gICAgdmFyIGRlc2MgPSBnT1BEKGFuT2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcbiAgICByZXR1cm4gZGVzYyAmJiAhZGVzYy5jb25maWd1cmFibGUgPyBmYWxzZSA6IGRlbGV0ZSB0YXJnZXRbcHJvcGVydHlLZXldO1xuICB9XG59KTsiLCIvLyAyNi4xLjcgUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSlcbnZhciBnT1BEICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJylcbiAgLCAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KXtcbiAgICByZXR1cm4gZ09QRC5mKGFuT2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcbiAgfVxufSk7IiwiLy8gMjYuMS44IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KVxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBnZXRQcm90byA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgZ2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKHRhcmdldCl7XG4gICAgcmV0dXJuIGdldFByb3RvKGFuT2JqZWN0KHRhcmdldCkpO1xuICB9XG59KTsiLCIvLyAyNi4xLjYgUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSBbLCByZWNlaXZlcl0pXG52YXIgZ09QRCAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xuXG5mdW5jdGlvbiBnZXQodGFyZ2V0LCBwcm9wZXJ0eUtleS8qLCByZWNlaXZlciovKXtcbiAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl1cbiAgICAsIGRlc2MsIHByb3RvO1xuICBpZihhbk9iamVjdCh0YXJnZXQpID09PSByZWNlaXZlcilyZXR1cm4gdGFyZ2V0W3Byb3BlcnR5S2V5XTtcbiAgaWYoZGVzYyA9IGdPUEQuZih0YXJnZXQsIHByb3BlcnR5S2V5KSlyZXR1cm4gaGFzKGRlc2MsICd2YWx1ZScpXG4gICAgPyBkZXNjLnZhbHVlXG4gICAgOiBkZXNjLmdldCAhPT0gdW5kZWZpbmVkXG4gICAgICA/IGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgaWYoaXNPYmplY3QocHJvdG8gPSBnZXRQcm90b3R5cGVPZih0YXJnZXQpKSlyZXR1cm4gZ2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgcmVjZWl2ZXIpO1xufVxuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7Z2V0OiBnZXR9KTsiLCIvLyAyNi4xLjkgUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wZXJ0eUtleSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgaGFzOiBmdW5jdGlvbiBoYXModGFyZ2V0LCBwcm9wZXJ0eUtleSl7XG4gICAgcmV0dXJuIHByb3BlcnR5S2V5IGluIHRhcmdldDtcbiAgfVxufSk7IiwiLy8gMjYuMS4xMCBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpXG52YXIgJGV4cG9ydCAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgYW5PYmplY3QgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgJGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGU7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbiBpc0V4dGVuc2libGUodGFyZ2V0KXtcbiAgICBhbk9iamVjdCh0YXJnZXQpO1xuICAgIHJldHVybiAkaXNFeHRlbnNpYmxlID8gJGlzRXh0ZW5zaWJsZSh0YXJnZXQpIDogdHJ1ZTtcbiAgfVxufSk7IiwiLy8gMjYuMS4xMSBSZWZsZWN0Lm93bktleXModGFyZ2V0KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge293bktleXM6IHJlcXVpcmUoJy4vX293bi1rZXlzJyl9KTsiLCIvLyAyNi4xLjEyIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGFyZ2V0KVxudmFyICRleHBvcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgYW5PYmplY3QgICAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCAkcHJldmVudEV4dGVuc2lvbnMgPSBPYmplY3QucHJldmVudEV4dGVuc2lvbnM7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgcHJldmVudEV4dGVuc2lvbnM6IGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCl7XG4gICAgYW5PYmplY3QodGFyZ2V0KTtcbiAgICB0cnkge1xuICAgICAgaWYoJHByZXZlbnRFeHRlbnNpb25zKSRwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pOyIsIi8vIDI2LjEuMTQgUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKVxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBzZXRQcm90byA9IHJlcXVpcmUoJy4vX3NldC1wcm90bycpO1xuXG5pZihzZXRQcm90bykkZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIHNldFByb3RvdHlwZU9mOiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKXtcbiAgICBzZXRQcm90by5jaGVjayh0YXJnZXQsIHByb3RvKTtcbiAgICB0cnkge1xuICAgICAgc2V0UHJvdG8uc2V0KHRhcmdldCwgcHJvdG8pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pOyIsIi8vIDI2LjEuMTMgUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgViBbLCByZWNlaXZlcl0pXG52YXIgZFAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGdPUEQgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKVxuICAsIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuXG5mdW5jdGlvbiBzZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgVi8qLCByZWNlaXZlciovKXtcbiAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDQgPyB0YXJnZXQgOiBhcmd1bWVudHNbM11cbiAgICAsIG93bkRlc2MgID0gZ09QRC5mKGFuT2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KVxuICAgICwgZXhpc3RpbmdEZXNjcmlwdG9yLCBwcm90bztcbiAgaWYoIW93bkRlc2Mpe1xuICAgIGlmKGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSkpe1xuICAgICAgcmV0dXJuIHNldChwcm90bywgcHJvcGVydHlLZXksIFYsIHJlY2VpdmVyKTtcbiAgICB9XG4gICAgb3duRGVzYyA9IGNyZWF0ZURlc2MoMCk7XG4gIH1cbiAgaWYoaGFzKG93bkRlc2MsICd2YWx1ZScpKXtcbiAgICBpZihvd25EZXNjLndyaXRhYmxlID09PSBmYWxzZSB8fCAhaXNPYmplY3QocmVjZWl2ZXIpKXJldHVybiBmYWxzZTtcbiAgICBleGlzdGluZ0Rlc2NyaXB0b3IgPSBnT1BELmYocmVjZWl2ZXIsIHByb3BlcnR5S2V5KSB8fCBjcmVhdGVEZXNjKDApO1xuICAgIGV4aXN0aW5nRGVzY3JpcHRvci52YWx1ZSA9IFY7XG4gICAgZFAuZihyZWNlaXZlciwgcHJvcGVydHlLZXksIGV4aXN0aW5nRGVzY3JpcHRvcik7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIG93bkRlc2Muc2V0ID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IChvd25EZXNjLnNldC5jYWxsKHJlY2VpdmVyLCBWKSwgdHJ1ZSk7XG59XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtzZXQ6IHNldH0pOyIsIi8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzKClcbmlmKHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgLy4vZy5mbGFncyAhPSAnZycpcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZihSZWdFeHAucHJvdG90eXBlLCAnZmxhZ3MnLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiByZXF1aXJlKCcuL19mbGFncycpXG59KTsiLCIvLyBAQG1hdGNoIGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ21hdGNoJywgMSwgZnVuY3Rpb24oZGVmaW5lZCwgTUFUQ0gsICRtYXRjaCl7XG4gIC8vIDIxLjEuMy4xMSBTdHJpbmcucHJvdG90eXBlLm1hdGNoKHJlZ2V4cClcbiAgcmV0dXJuIFtmdW5jdGlvbiBtYXRjaChyZWdleHApe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyAgPSBkZWZpbmVkKHRoaXMpXG4gICAgICAsIGZuID0gcmVnZXhwID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlZ2V4cFtNQVRDSF07XG4gICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWQgPyBmbi5jYWxsKHJlZ2V4cCwgTykgOiBuZXcgUmVnRXhwKHJlZ2V4cClbTUFUQ0hdKFN0cmluZyhPKSk7XG4gIH0sICRtYXRjaF07XG59KTsiLCIvLyBAQHJlcGxhY2UgbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgncmVwbGFjZScsIDIsIGZ1bmN0aW9uKGRlZmluZWQsIFJFUExBQ0UsICRyZXBsYWNlKXtcbiAgLy8gMjEuMS4zLjE0IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZShzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKVxuICByZXR1cm4gW2Z1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPICA9IGRlZmluZWQodGhpcylcbiAgICAgICwgZm4gPSBzZWFyY2hWYWx1ZSA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZWFyY2hWYWx1ZVtSRVBMQUNFXTtcbiAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZFxuICAgICAgPyBmbi5jYWxsKHNlYXJjaFZhbHVlLCBPLCByZXBsYWNlVmFsdWUpXG4gICAgICA6ICRyZXBsYWNlLmNhbGwoU3RyaW5nKE8pLCBzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKTtcbiAgfSwgJHJlcGxhY2VdO1xufSk7IiwiLy8gQEBzZWFyY2ggbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgnc2VhcmNoJywgMSwgZnVuY3Rpb24oZGVmaW5lZCwgU0VBUkNILCAkc2VhcmNoKXtcbiAgLy8gMjEuMS4zLjE1IFN0cmluZy5wcm90b3R5cGUuc2VhcmNoKHJlZ2V4cClcbiAgcmV0dXJuIFtmdW5jdGlvbiBzZWFyY2gocmVnZXhwKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIE8gID0gZGVmaW5lZCh0aGlzKVxuICAgICAgLCBmbiA9IHJlZ2V4cCA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiByZWdleHBbU0VBUkNIXTtcbiAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZCA/IGZuLmNhbGwocmVnZXhwLCBPKSA6IG5ldyBSZWdFeHAocmVnZXhwKVtTRUFSQ0hdKFN0cmluZyhPKSk7XG4gIH0sICRzZWFyY2hdO1xufSk7IiwiLy8gQEBzcGxpdCBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdzcGxpdCcsIDIsIGZ1bmN0aW9uKGRlZmluZWQsIFNQTElULCAkc3BsaXQpe1xuICAndXNlIHN0cmljdCc7XG4gIHZhciBpc1JlZ0V4cCAgID0gcmVxdWlyZSgnLi9faXMtcmVnZXhwJylcbiAgICAsIF9zcGxpdCAgICAgPSAkc3BsaXRcbiAgICAsICRwdXNoICAgICAgPSBbXS5wdXNoXG4gICAgLCAkU1BMSVQgICAgID0gJ3NwbGl0J1xuICAgICwgTEVOR1RIICAgICA9ICdsZW5ndGgnXG4gICAgLCBMQVNUX0lOREVYID0gJ2xhc3RJbmRleCc7XG4gIGlmKFxuICAgICdhYmJjJ1skU1BMSVRdKC8oYikqLylbMV0gPT0gJ2MnIHx8XG4gICAgJ3Rlc3QnWyRTUExJVF0oLyg/OikvLCAtMSlbTEVOR1RIXSAhPSA0IHx8XG4gICAgJ2FiJ1skU1BMSVRdKC8oPzphYikqLylbTEVOR1RIXSAhPSAyIHx8XG4gICAgJy4nWyRTUExJVF0oLyguPykoLj8pLylbTEVOR1RIXSAhPSA0IHx8XG4gICAgJy4nWyRTUExJVF0oLygpKCkvKVtMRU5HVEhdID4gMSB8fFxuICAgICcnWyRTUExJVF0oLy4/LylbTEVOR1RIXVxuICApe1xuICAgIHZhciBOUENHID0gLygpPz8vLmV4ZWMoJycpWzFdID09PSB1bmRlZmluZWQ7IC8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwXG4gICAgLy8gYmFzZWQgb24gZXM1LXNoaW0gaW1wbGVtZW50YXRpb24sIG5lZWQgdG8gcmV3b3JrIGl0XG4gICAgJHNwbGl0ID0gZnVuY3Rpb24oc2VwYXJhdG9yLCBsaW1pdCl7XG4gICAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgICAgaWYoc2VwYXJhdG9yID09PSB1bmRlZmluZWQgJiYgbGltaXQgPT09IDApcmV0dXJuIFtdO1xuICAgICAgLy8gSWYgYHNlcGFyYXRvcmAgaXMgbm90IGEgcmVnZXgsIHVzZSBuYXRpdmUgc3BsaXRcbiAgICAgIGlmKCFpc1JlZ0V4cChzZXBhcmF0b3IpKXJldHVybiBfc3BsaXQuY2FsbChzdHJpbmcsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgdmFyIGZsYWdzID0gKHNlcGFyYXRvci5pZ25vcmVDYXNlID8gJ2knIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IubXVsdGlsaW5lID8gJ20nIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IudW5pY29kZSA/ICd1JyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLnN0aWNreSA/ICd5JyA6ICcnKTtcbiAgICAgIHZhciBsYXN0TGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBzcGxpdExpbWl0ID0gbGltaXQgPT09IHVuZGVmaW5lZCA/IDQyOTQ5NjcyOTUgOiBsaW1pdCA+Pj4gMDtcbiAgICAgIC8vIE1ha2UgYGdsb2JhbGAgYW5kIGF2b2lkIGBsYXN0SW5kZXhgIGlzc3VlcyBieSB3b3JraW5nIHdpdGggYSBjb3B5XG4gICAgICB2YXIgc2VwYXJhdG9yQ29weSA9IG5ldyBSZWdFeHAoc2VwYXJhdG9yLnNvdXJjZSwgZmxhZ3MgKyAnZycpO1xuICAgICAgdmFyIHNlcGFyYXRvcjIsIG1hdGNoLCBsYXN0SW5kZXgsIGxhc3RMZW5ndGgsIGk7XG4gICAgICAvLyBEb2Vzbid0IG5lZWQgZmxhZ3MgZ3ksIGJ1dCB0aGV5IGRvbid0IGh1cnRcbiAgICAgIGlmKCFOUENHKXNlcGFyYXRvcjIgPSBuZXcgUmVnRXhwKCdeJyArIHNlcGFyYXRvckNvcHkuc291cmNlICsgJyQoPyFcXFxccyknLCBmbGFncyk7XG4gICAgICB3aGlsZShtYXRjaCA9IHNlcGFyYXRvckNvcHkuZXhlYyhzdHJpbmcpKXtcbiAgICAgICAgLy8gYHNlcGFyYXRvckNvcHkubGFzdEluZGV4YCBpcyBub3QgcmVsaWFibGUgY3Jvc3MtYnJvd3NlclxuICAgICAgICBsYXN0SW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdW0xFTkdUSF07XG4gICAgICAgIGlmKGxhc3RJbmRleCA+IGxhc3RMYXN0SW5kZXgpe1xuICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgIGZvciBOUENHXG4gICAgICAgICAgaWYoIU5QQ0cgJiYgbWF0Y2hbTEVOR1RIXSA+IDEpbWF0Y2hbMF0ucmVwbGFjZShzZXBhcmF0b3IyLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgZm9yKGkgPSAxOyBpIDwgYXJndW1lbnRzW0xFTkdUSF0gLSAyOyBpKyspaWYoYXJndW1lbnRzW2ldID09PSB1bmRlZmluZWQpbWF0Y2hbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYobWF0Y2hbTEVOR1RIXSA+IDEgJiYgbWF0Y2guaW5kZXggPCBzdHJpbmdbTEVOR1RIXSkkcHVzaC5hcHBseShvdXRwdXQsIG1hdGNoLnNsaWNlKDEpKTtcbiAgICAgICAgICBsYXN0TGVuZ3RoID0gbWF0Y2hbMF1bTEVOR1RIXTtcbiAgICAgICAgICBsYXN0TGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICAgIGlmKG91dHB1dFtMRU5HVEhdID49IHNwbGl0TGltaXQpYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYoc2VwYXJhdG9yQ29weVtMQVNUX0lOREVYXSA9PT0gbWF0Y2guaW5kZXgpc2VwYXJhdG9yQ29weVtMQVNUX0lOREVYXSsrOyAvLyBBdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICB9XG4gICAgICBpZihsYXN0TGFzdEluZGV4ID09PSBzdHJpbmdbTEVOR1RIXSl7XG4gICAgICAgIGlmKGxhc3RMZW5ndGggfHwgIXNlcGFyYXRvckNvcHkudGVzdCgnJykpb3V0cHV0LnB1c2goJycpO1xuICAgICAgfSBlbHNlIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4KSk7XG4gICAgICByZXR1cm4gb3V0cHV0W0xFTkdUSF0gPiBzcGxpdExpbWl0ID8gb3V0cHV0LnNsaWNlKDAsIHNwbGl0TGltaXQpIDogb3V0cHV0O1xuICAgIH07XG4gIC8vIENoYWtyYSwgVjhcbiAgfSBlbHNlIGlmKCcwJ1skU1BMSVRdKHVuZGVmaW5lZCwgMClbTEVOR1RIXSl7XG4gICAgJHNwbGl0ID0gZnVuY3Rpb24oc2VwYXJhdG9yLCBsaW1pdCl7XG4gICAgICByZXR1cm4gc2VwYXJhdG9yID09PSB1bmRlZmluZWQgJiYgbGltaXQgPT09IDAgPyBbXSA6IF9zcGxpdC5jYWxsKHRoaXMsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgIH07XG4gIH1cbiAgLy8gMjEuMS4zLjE3IFN0cmluZy5wcm90b3R5cGUuc3BsaXQoc2VwYXJhdG9yLCBsaW1pdClcbiAgcmV0dXJuIFtmdW5jdGlvbiBzcGxpdChzZXBhcmF0b3IsIGxpbWl0KXtcbiAgICB2YXIgTyAgPSBkZWZpbmVkKHRoaXMpXG4gICAgICAsIGZuID0gc2VwYXJhdG9yID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNlcGFyYXRvcltTUExJVF07XG4gICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWQgPyBmbi5jYWxsKHNlcGFyYXRvciwgTywgbGltaXQpIDogJHNwbGl0LmNhbGwoU3RyaW5nKE8pLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgfSwgJHNwbGl0XTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4yIFNldCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnU2V0JywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFNldCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRhdCAgICAgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKShmYWxzZSk7XG4kZXhwb3J0KCRleHBvcnQuUCwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjMgU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdChwb3MpXG4gIGNvZGVQb2ludEF0OiBmdW5jdGlvbiBjb2RlUG9pbnRBdChwb3Mpe1xuICAgIHJldHVybiAkYXQodGhpcywgcG9zKTtcbiAgfVxufSk7IiwiLy8gMjEuMS4zLjYgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aChzZWFyY2hTdHJpbmcgWywgZW5kUG9zaXRpb25dKVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgdG9MZW5ndGggID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBjb250ZXh0ICAgPSByZXF1aXJlKCcuL19zdHJpbmctY29udGV4dCcpXG4gICwgRU5EU19XSVRIID0gJ2VuZHNXaXRoJ1xuICAsICRlbmRzV2l0aCA9ICcnW0VORFNfV0lUSF07XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMtaXMtcmVnZXhwJykoRU5EU19XSVRIKSwgJ1N0cmluZycsIHtcbiAgZW5kc1dpdGg6IGZ1bmN0aW9uIGVuZHNXaXRoKHNlYXJjaFN0cmluZyAvKiwgZW5kUG9zaXRpb24gPSBAbGVuZ3RoICovKXtcbiAgICB2YXIgdGhhdCA9IGNvbnRleHQodGhpcywgc2VhcmNoU3RyaW5nLCBFTkRTX1dJVEgpXG4gICAgICAsIGVuZFBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWRcbiAgICAgICwgbGVuICAgID0gdG9MZW5ndGgodGhhdC5sZW5ndGgpXG4gICAgICAsIGVuZCAgICA9IGVuZFBvc2l0aW9uID09PSB1bmRlZmluZWQgPyBsZW4gOiBNYXRoLm1pbih0b0xlbmd0aChlbmRQb3NpdGlvbiksIGxlbilcbiAgICAgICwgc2VhcmNoID0gU3RyaW5nKHNlYXJjaFN0cmluZyk7XG4gICAgcmV0dXJuICRlbmRzV2l0aFxuICAgICAgPyAkZW5kc1dpdGguY2FsbCh0aGF0LCBzZWFyY2gsIGVuZClcbiAgICAgIDogdGhhdC5zbGljZShlbmQgLSBzZWFyY2gubGVuZ3RoLCBlbmQpID09PSBzZWFyY2g7XG4gIH1cbn0pOyIsInZhciAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgdG9JbmRleCAgICAgICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpXG4gICwgZnJvbUNoYXJDb2RlICAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlXG4gICwgJGZyb21Db2RlUG9pbnQgPSBTdHJpbmcuZnJvbUNvZGVQb2ludDtcblxuLy8gbGVuZ3RoIHNob3VsZCBiZSAxLCBvbGQgRkYgcHJvYmxlbVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoISEkZnJvbUNvZGVQb2ludCAmJiAkZnJvbUNvZGVQb2ludC5sZW5ndGggIT0gMSksICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMi4yIFN0cmluZy5mcm9tQ29kZVBvaW50KC4uLmNvZGVQb2ludHMpXG4gIGZyb21Db2RlUG9pbnQ6IGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoeCl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgcmVzICA9IFtdXG4gICAgICAsIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIGkgICAgPSAwXG4gICAgICAsIGNvZGU7XG4gICAgd2hpbGUoYUxlbiA+IGkpe1xuICAgICAgY29kZSA9ICthcmd1bWVudHNbaSsrXTtcbiAgICAgIGlmKHRvSW5kZXgoY29kZSwgMHgxMGZmZmYpICE9PSBjb2RlKXRocm93IFJhbmdlRXJyb3IoY29kZSArICcgaXMgbm90IGEgdmFsaWQgY29kZSBwb2ludCcpO1xuICAgICAgcmVzLnB1c2goY29kZSA8IDB4MTAwMDBcbiAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcbiAgICAgICAgOiBmcm9tQ2hhckNvZGUoKChjb2RlIC09IDB4MTAwMDApID4+IDEwKSArIDB4ZDgwMCwgY29kZSAlIDB4NDAwICsgMHhkYzAwKVxuICAgICAgKTtcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XG4gIH1cbn0pOyIsIi8vIDIxLjEuMy43IFN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMoc2VhcmNoU3RyaW5nLCBwb3NpdGlvbiA9IDApXG4ndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGNvbnRleHQgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWNvbnRleHQnKVxuICAsIElOQ0xVREVTID0gJ2luY2x1ZGVzJztcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscy1pcy1yZWdleHAnKShJTkNMVURFUyksICdTdHJpbmcnLCB7XG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XG4gICAgcmV0dXJuICEhfmNvbnRleHQodGhpcywgc2VhcmNoU3RyaW5nLCBJTkNMVURFUylcbiAgICAgIC5pbmRleE9mKHNlYXJjaFN0cmluZywgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTsiLCJ2YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMi40IFN0cmluZy5yYXcoY2FsbFNpdGUsIC4uLnN1YnN0aXR1dGlvbnMpXG4gIHJhdzogZnVuY3Rpb24gcmF3KGNhbGxTaXRlKXtcbiAgICB2YXIgdHBsICA9IHRvSU9iamVjdChjYWxsU2l0ZS5yYXcpXG4gICAgICAsIGxlbiAgPSB0b0xlbmd0aCh0cGwubGVuZ3RoKVxuICAgICAgLCBhTGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCByZXMgID0gW11cbiAgICAgICwgaSAgICA9IDA7XG4gICAgd2hpbGUobGVuID4gaSl7XG4gICAgICByZXMucHVzaChTdHJpbmcodHBsW2krK10pKTtcbiAgICAgIGlmKGkgPCBhTGVuKXJlcy5wdXNoKFN0cmluZyhhcmd1bWVudHNbaV0pKTtcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XG4gIH1cbn0pOyIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuMTMgU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQoY291bnQpXG4gIHJlcGVhdDogcmVxdWlyZSgnLi9fc3RyaW5nLXJlcGVhdCcpXG59KTsiLCIvLyAyMS4xLjMuMTggU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyBbLCBwb3NpdGlvbiBdKVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgY29udGV4dCAgICAgPSByZXF1aXJlKCcuL19zdHJpbmctY29udGV4dCcpXG4gICwgU1RBUlRTX1dJVEggPSAnc3RhcnRzV2l0aCdcbiAgLCAkc3RhcnRzV2l0aCA9ICcnW1NUQVJUU19XSVRIXTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscy1pcy1yZWdleHAnKShTVEFSVFNfV0lUSCksICdTdHJpbmcnLCB7XG4gIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIC8qLCBwb3NpdGlvbiA9IDAgKi8pe1xuICAgIHZhciB0aGF0ICAgPSBjb250ZXh0KHRoaXMsIHNlYXJjaFN0cmluZywgU1RBUlRTX1dJVEgpXG4gICAgICAsIGluZGV4ICA9IHRvTGVuZ3RoKE1hdGgubWluKGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCB0aGF0Lmxlbmd0aCkpXG4gICAgICAsIHNlYXJjaCA9IFN0cmluZyhzZWFyY2hTdHJpbmcpO1xuICAgIHJldHVybiAkc3RhcnRzV2l0aFxuICAgICAgPyAkc3RhcnRzV2l0aC5jYWxsKHRoYXQsIHNlYXJjaCwgaW5kZXgpXG4gICAgICA6IHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoLmxlbmd0aCkgPT09IHNlYXJjaDtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIE1FVEEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWVxuICAsICRmYWlscyAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIHNoYXJlZCAgICAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCB1aWQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgd2tzICAgICAgICAgICAgPSByZXF1aXJlKCcuL193a3MnKVxuICAsIHdrc0V4dCAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpXG4gICwgd2tzRGVmaW5lICAgICAgPSByZXF1aXJlKCcuL193a3MtZGVmaW5lJylcbiAgLCBrZXlPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2tleW9mJylcbiAgLCBlbnVtS2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpXG4gICwgaXNBcnJheSAgICAgICAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgX2NyZWF0ZSAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBnT1BORXh0ICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpXG4gICwgJEdPUEQgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgJERQICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsICRrZXlzICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUEQgICAgICAgICAgID0gJEdPUEQuZlxuICAsIGRQICAgICAgICAgICAgID0gJERQLmZcbiAgLCBnT1BOICAgICAgICAgICA9IGdPUE5FeHQuZlxuICAsICRTeW1ib2wgICAgICAgID0gZ2xvYmFsLlN5bWJvbFxuICAsICRKU09OICAgICAgICAgID0gZ2xvYmFsLkpTT05cbiAgLCBfc3RyaW5naWZ5ICAgICA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeVxuICAsIFBST1RPVFlQRSAgICAgID0gJ3Byb3RvdHlwZSdcbiAgLCBISURERU4gICAgICAgICA9IHdrcygnX2hpZGRlbicpXG4gICwgVE9fUFJJTUlUSVZFICAgPSB3a3MoJ3RvUHJpbWl0aXZlJylcbiAgLCBpc0VudW0gICAgICAgICA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyAgICAgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIE9QU3ltYm9scyAgICAgID0gc2hhcmVkKCdvcC1zeW1ib2xzJylcbiAgLCBPYmplY3RQcm90byAgICA9IE9iamVjdFtQUk9UT1RZUEVdXG4gICwgVVNFX05BVElWRSAgICAgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nXG4gICwgUU9iamVjdCAgICAgICAgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIF9jcmVhdGUoZFAoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIGRQKHRoaXMsICdhJywge3ZhbHVlOiA3fSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgdmFyIHByb3RvRGVzYyA9IGdPUEQoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmKHByb3RvRGVzYylkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbih0YWcpe1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzeW0uX2sgPSB0YWc7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBVU0VfTkFUSVZFICYmIHR5cGVvZiAkU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnID8gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoaXQgPT09IE9iamVjdFByb3RvKSRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmKGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApe1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSlcbiAgICAsIGkgICAgPSAwXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcbiAgICAsIGtleTtcbiAgd2hpbGUobCA+IGkpJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCl7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KXtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIGl0ICA9IHRvSU9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGlmKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSlyZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ09QTih0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBJU19PUCAgPSBpdCA9PT0gT2JqZWN0UHJvdG9cbiAgICAsIG5hbWVzICA9IGdPUE4oSVNfT1AgPyBPUFN5bWJvbHMgOiB0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIVVTRV9OQVRJVkUpe1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCl7XG4gICAgaWYodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBpZih0aGlzID09PSBPYmplY3RQcm90bykkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKXNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0fSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICAkR09QRC5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJERQLmYgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mICA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKS5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi9fbGlicmFyeScpKXtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIHdyYXAod2tzKG5hbWUpKTtcbiAgfVxufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbmZvcih2YXIgc3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBpID0gMDsgc3ltYm9scy5sZW5ndGggPiBpOyApd2tzKHN5bWJvbHNbaSsrXSk7XG5cbmZvcih2YXIgc3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGkgPSAwOyBzeW1ib2xzLmxlbmd0aCA+IGk7ICl3a3NEZWZpbmUoc3ltYm9sc1tpKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioa2V5KXtcbiAgICBpZihpc1N5bWJvbChrZXkpKXJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgICB0aHJvdyBUeXBlRXJyb3Ioa2V5ICsgJyBpcyBub3QgYSBzeW1ib2whJyk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8ICRmYWlscyhmdW5jdGlvbigpe1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7YTogU30pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7XG4gICAgaWYoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgdmFyIGFyZ3MgPSBbaXRdXG4gICAgICAsIGkgICAgPSAxXG4gICAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICByZXBsYWNlciA9IGFyZ3NbMV07XG4gICAgaWYodHlwZW9mIHJlcGxhY2VyID09ICdmdW5jdGlvbicpJHJlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgaWYoJHJlcGxhY2VyIHx8ICFpc0FycmF5KHJlcGxhY2VyKSlyZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICBpZighaXNTeW1ib2wodmFsdWUpKXJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJHR5cGVkICAgICAgID0gcmVxdWlyZSgnLi9fdHlwZWQnKVxuICAsIGJ1ZmZlciAgICAgICA9IHJlcXVpcmUoJy4vX3R5cGVkLWJ1ZmZlcicpXG4gICwgYW5PYmplY3QgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0luZGV4ICAgICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpXG4gICwgdG9MZW5ndGggICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBpc09iamVjdCAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIEFycmF5QnVmZmVyICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLkFycmF5QnVmZmVyXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpXG4gICwgJEFycmF5QnVmZmVyID0gYnVmZmVyLkFycmF5QnVmZmVyXG4gICwgJERhdGFWaWV3ICAgID0gYnVmZmVyLkRhdGFWaWV3XG4gICwgJGlzVmlldyAgICAgID0gJHR5cGVkLkFCViAmJiBBcnJheUJ1ZmZlci5pc1ZpZXdcbiAgLCAkc2xpY2UgICAgICAgPSAkQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlXG4gICwgVklFVyAgICAgICAgID0gJHR5cGVkLlZJRVdcbiAgLCBBUlJBWV9CVUZGRVIgPSAnQXJyYXlCdWZmZXInO1xuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChBcnJheUJ1ZmZlciAhPT0gJEFycmF5QnVmZmVyKSwge0FycmF5QnVmZmVyOiAkQXJyYXlCdWZmZXJ9KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhJHR5cGVkLkNPTlNUUiwgQVJSQVlfQlVGRkVSLCB7XG4gIC8vIDI0LjEuMy4xIEFycmF5QnVmZmVyLmlzVmlldyhhcmcpXG4gIGlzVmlldzogZnVuY3Rpb24gaXNWaWV3KGl0KXtcbiAgICByZXR1cm4gJGlzVmlldyAmJiAkaXNWaWV3KGl0KSB8fCBpc09iamVjdChpdCkgJiYgVklFVyBpbiBpdDtcbiAgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5VICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gIW5ldyAkQXJyYXlCdWZmZXIoMikuc2xpY2UoMSwgdW5kZWZpbmVkKS5ieXRlTGVuZ3RoO1xufSksIEFSUkFZX0JVRkZFUiwge1xuICAvLyAyNC4xLjQuMyBBcnJheUJ1ZmZlci5wcm90b3R5cGUuc2xpY2Uoc3RhcnQsIGVuZClcbiAgc2xpY2U6IGZ1bmN0aW9uIHNsaWNlKHN0YXJ0LCBlbmQpe1xuICAgIGlmKCRzbGljZSAhPT0gdW5kZWZpbmVkICYmIGVuZCA9PT0gdW5kZWZpbmVkKXJldHVybiAkc2xpY2UuY2FsbChhbk9iamVjdCh0aGlzKSwgc3RhcnQpOyAvLyBGRiBmaXhcbiAgICB2YXIgbGVuICAgID0gYW5PYmplY3QodGhpcykuYnl0ZUxlbmd0aFxuICAgICAgLCBmaXJzdCAgPSB0b0luZGV4KHN0YXJ0LCBsZW4pXG4gICAgICAsIGZpbmFsICA9IHRvSW5kZXgoZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiBlbmQsIGxlbilcbiAgICAgICwgcmVzdWx0ID0gbmV3IChzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJEFycmF5QnVmZmVyKSkodG9MZW5ndGgoZmluYWwgLSBmaXJzdCkpXG4gICAgICAsIHZpZXdTICA9IG5ldyAkRGF0YVZpZXcodGhpcylcbiAgICAgICwgdmlld1QgID0gbmV3ICREYXRhVmlldyhyZXN1bHQpXG4gICAgICAsIGluZGV4ICA9IDA7XG4gICAgd2hpbGUoZmlyc3QgPCBmaW5hbCl7XG4gICAgICB2aWV3VC5zZXRVaW50OChpbmRleCsrLCB2aWV3Uy5nZXRVaW50OChmaXJzdCsrKSk7XG4gICAgfSByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShBUlJBWV9CVUZGRVIpOyIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ0Zsb2F0MzInLCA0LCBmdW5jdGlvbihpbml0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIEZsb2F0MzJBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpe1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdGbG9hdDY0JywgOCwgZnVuY3Rpb24oaW5pdCl7XG4gIHJldHVybiBmdW5jdGlvbiBGbG9hdDY0QXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKXtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7IiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnSW50MTYnLCAyLCBmdW5jdGlvbihpbml0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIEludDE2QXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKXtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7IiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnSW50MzInLCA0LCBmdW5jdGlvbihpbml0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIEludDMyQXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKXtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7IiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnSW50OCcsIDEsIGZ1bmN0aW9uKGluaXQpe1xuICByZXR1cm4gZnVuY3Rpb24gSW50OEFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCl7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pOyIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ1VpbnQxNicsIDIsIGZ1bmN0aW9uKGluaXQpe1xuICByZXR1cm4gZnVuY3Rpb24gVWludDE2QXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKXtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7IiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnVWludDMyJywgNCwgZnVuY3Rpb24oaW5pdCl7XG4gIHJldHVybiBmdW5jdGlvbiBVaW50MzJBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpe1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdVaW50OCcsIDEsIGZ1bmN0aW9uKGluaXQpe1xuICByZXR1cm4gZnVuY3Rpb24gVWludDhBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpe1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdVaW50OCcsIDEsIGZ1bmN0aW9uKGluaXQpe1xuICByZXR1cm4gZnVuY3Rpb24gVWludDhDbGFtcGVkQXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKXtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSwgdHJ1ZSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGVhY2ggICAgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgwKVxuICAsIHJlZGVmaW5lICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBtZXRhICAgICAgICAgPSByZXF1aXJlKCcuL19tZXRhJylcbiAgLCBhc3NpZ24gICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJylcbiAgLCB3ZWFrICAgICAgICAgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXdlYWsnKVxuICAsIGlzT2JqZWN0ICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZ2V0V2VhayAgICAgID0gbWV0YS5nZXRXZWFrXG4gICwgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZVxuICAsIHVuY2F1Z2h0RnJvemVuU3RvcmUgPSB3ZWFrLnVmc3RvcmVcbiAgLCB0bXAgICAgICAgICAgPSB7fVxuICAsIEludGVybmFsTWFwO1xuXG52YXIgd3JhcHBlciA9IGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBXZWFrTWFwKCl7XG4gICAgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gIH07XG59O1xuXG52YXIgbWV0aG9kcyA9IHtcbiAgLy8gMjMuMy4zLjMgV2Vha01hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICBpZihpc09iamVjdChrZXkpKXtcbiAgICAgIHZhciBkYXRhID0gZ2V0V2VhayhrZXkpO1xuICAgICAgaWYoZGF0YSA9PT0gdHJ1ZSlyZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZSh0aGlzKS5nZXQoa2V5KTtcbiAgICAgIHJldHVybiBkYXRhID8gZGF0YVt0aGlzLl9pXSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0sXG4gIC8vIDIzLjMuMy41IFdlYWtNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gd2Vhay5kZWYodGhpcywga2V5LCB2YWx1ZSk7XG4gIH1cbn07XG5cbi8vIDIzLjMgV2Vha01hcCBPYmplY3RzXG52YXIgJFdlYWtNYXAgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnV2Vha01hcCcsIHdyYXBwZXIsIG1ldGhvZHMsIHdlYWssIHRydWUsIHRydWUpO1xuXG4vLyBJRTExIFdlYWtNYXAgZnJvemVuIGtleXMgZml4XG5pZihuZXcgJFdlYWtNYXAoKS5zZXQoKE9iamVjdC5mcmVlemUgfHwgT2JqZWN0KSh0bXApLCA3KS5nZXQodG1wKSAhPSA3KXtcbiAgSW50ZXJuYWxNYXAgPSB3ZWFrLmdldENvbnN0cnVjdG9yKHdyYXBwZXIpO1xuICBhc3NpZ24oSW50ZXJuYWxNYXAucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgbWV0YS5ORUVEID0gdHJ1ZTtcbiAgZWFjaChbJ2RlbGV0ZScsICdoYXMnLCAnZ2V0JywgJ3NldCddLCBmdW5jdGlvbihrZXkpe1xuICAgIHZhciBwcm90byAgPSAkV2Vha01hcC5wcm90b3R5cGVcbiAgICAgICwgbWV0aG9kID0gcHJvdG9ba2V5XTtcbiAgICByZWRlZmluZShwcm90bywga2V5LCBmdW5jdGlvbihhLCBiKXtcbiAgICAgIC8vIHN0b3JlIGZyb3plbiBvYmplY3RzIG9uIGludGVybmFsIHdlYWttYXAgc2hpbVxuICAgICAgaWYoaXNPYmplY3QoYSkgJiYgIWlzRXh0ZW5zaWJsZShhKSl7XG4gICAgICAgIGlmKCF0aGlzLl9mKXRoaXMuX2YgPSBuZXcgSW50ZXJuYWxNYXA7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9mW2tleV0oYSwgYik7XG4gICAgICAgIHJldHVybiBrZXkgPT0gJ3NldCcgPyB0aGlzIDogcmVzdWx0O1xuICAgICAgLy8gc3RvcmUgYWxsIHRoZSByZXN0IG9uIG5hdGl2ZSB3ZWFrbWFwXG4gICAgICB9IHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCBhLCBiKTtcbiAgICB9KTtcbiAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHdlYWsgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXdlYWsnKTtcblxuLy8gMjMuNCBXZWFrU2V0IE9iamVjdHNcbnJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnV2Vha1NldCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBXZWFrU2V0KCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy40LjMuMSBXZWFrU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcbiAgICByZXR1cm4gd2Vhay5kZWYodGhpcywgdmFsdWUsIHRydWUpO1xuICB9XG59LCB3ZWFrLCBmYWxzZSwgdHJ1ZSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG52YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkaW5jbHVkZXMgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKHRydWUpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ0FycmF5Jywge1xuICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXMoZWwgLyosIGZyb21JbmRleCA9IDAgKi8pe1xuICAgIHJldHVybiAkaW5jbHVkZXModGhpcywgZWwsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKCdpbmNsdWRlcycpOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLW9iamVjdC12YWx1ZXMtZW50cmllc1xudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkZW50cmllcyA9IHJlcXVpcmUoJy4vX29iamVjdC10by1hcnJheScpKHRydWUpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtcbiAgZW50cmllczogZnVuY3Rpb24gZW50cmllcyhpdCl7XG4gICAgcmV0dXJuICRlbnRyaWVzKGl0KTtcbiAgfVxufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvcnNcbnZhciAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgb3duS2V5cyAgICAgICAgPSByZXF1aXJlKCcuL19vd24ta2V5cycpXG4gICwgdG9JT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBnT1BEICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJylcbiAgLCBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yczogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3Qpe1xuICAgIHZhciBPICAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAgICwgZ2V0RGVzYyA9IGdPUEQuZlxuICAgICAgLCBrZXlzICAgID0gb3duS2V5cyhPKVxuICAgICAgLCByZXN1bHQgID0ge31cbiAgICAgICwgaSAgICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKGtleXMubGVuZ3RoID4gaSljcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGtleSA9IGtleXNbaSsrXSwgZ2V0RGVzYyhPLCBrZXkpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYmplY3QtdmFsdWVzLWVudHJpZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkdmFsdWVzID0gcmVxdWlyZSgnLi9fb2JqZWN0LXRvLWFycmF5JykoZmFsc2UpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtcbiAgdmFsdWVzOiBmdW5jdGlvbiB2YWx1ZXMoaXQpe1xuICAgIHJldHVybiAkdmFsdWVzKGl0KTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtc3RyaW5nLXBhZC1zdGFydC1lbmRcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkcGFkICAgID0gcmVxdWlyZSgnLi9fc3RyaW5nLXBhZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ1N0cmluZycsIHtcbiAgcGFkRW5kOiBmdW5jdGlvbiBwYWRFbmQobWF4TGVuZ3RoIC8qLCBmaWxsU3RyaW5nID0gJyAnICovKXtcbiAgICByZXR1cm4gJHBhZCh0aGlzLCBtYXhMZW5ndGgsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCBmYWxzZSk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXN0cmluZy1wYWQtc3RhcnQtZW5kXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJHBhZCAgICA9IHJlcXVpcmUoJy4vX3N0cmluZy1wYWQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdTdHJpbmcnLCB7XG4gIHBhZFN0YXJ0OiBmdW5jdGlvbiBwYWRTdGFydChtYXhMZW5ndGggLyosIGZpbGxTdHJpbmcgPSAnICcgKi8pe1xuICAgIHJldHVybiAkcGFkKHRoaXMsIG1heExlbmd0aCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIHRydWUpO1xuICB9XG59KTsiLCJ2YXIgJGl0ZXJhdG9ycyAgICA9IHJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJylcbiAgLCByZWRlZmluZSAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGdsb2JhbCAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBJdGVyYXRvcnMgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCB3a3MgICAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJylcbiAgLCBJVEVSQVRPUiAgICAgID0gd2tzKCdpdGVyYXRvcicpXG4gICwgVE9fU1RSSU5HX1RBRyA9IHdrcygndG9TdHJpbmdUYWcnKVxuICAsIEFycmF5VmFsdWVzICAgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmZvcih2YXIgY29sbGVjdGlvbnMgPSBbJ05vZGVMaXN0JywgJ0RPTVRva2VuTGlzdCcsICdNZWRpYUxpc3QnLCAnU3R5bGVTaGVldExpc3QnLCAnQ1NTUnVsZUxpc3QnXSwgaSA9IDA7IGkgPCA1OyBpKyspe1xuICB2YXIgTkFNRSAgICAgICA9IGNvbGxlY3Rpb25zW2ldXG4gICAgLCBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdXG4gICAgLCBwcm90byAgICAgID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZVxuICAgICwga2V5O1xuICBpZihwcm90byl7XG4gICAgaWYoIXByb3RvW0lURVJBVE9SXSloaWRlKHByb3RvLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xuICAgIGlmKCFwcm90b1tUT19TVFJJTkdfVEFHXSloaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgICBJdGVyYXRvcnNbTkFNRV0gPSBBcnJheVZhbHVlcztcbiAgICBmb3Ioa2V5IGluICRpdGVyYXRvcnMpaWYoIXByb3RvW2tleV0pcmVkZWZpbmUocHJvdG8sIGtleSwgJGl0ZXJhdG9yc1trZXldLCB0cnVlKTtcbiAgfVxufSIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkdGFzayAgID0gcmVxdWlyZSgnLi9fdGFzaycpO1xuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LkIsIHtcbiAgc2V0SW1tZWRpYXRlOiAgICR0YXNrLnNldCxcbiAgY2xlYXJJbW1lZGlhdGU6ICR0YXNrLmNsZWFyXG59KTsiLCIvLyBpZTktIHNldFRpbWVvdXQgJiBzZXRJbnRlcnZhbCBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgZml4XG52YXIgZ2xvYmFsICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgJGV4cG9ydCAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgaW52b2tlICAgICA9IHJlcXVpcmUoJy4vX2ludm9rZScpXG4gICwgcGFydGlhbCAgICA9IHJlcXVpcmUoJy4vX3BhcnRpYWwnKVxuICAsIG5hdmlnYXRvciAgPSBnbG9iYWwubmF2aWdhdG9yXG4gICwgTVNJRSAgICAgICA9ICEhbmF2aWdhdG9yICYmIC9NU0lFIC5cXC4vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7IC8vIDwtIGRpcnR5IGllOS0gY2hlY2tcbnZhciB3cmFwID0gZnVuY3Rpb24oc2V0KXtcbiAgcmV0dXJuIE1TSUUgPyBmdW5jdGlvbihmbiwgdGltZSAvKiwgLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIHNldChpbnZva2UoXG4gICAgICBwYXJ0aWFsLFxuICAgICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxuICAgICAgdHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKVxuICAgICksIHRpbWUpO1xuICB9IDogc2V0O1xufTtcbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5CICsgJGV4cG9ydC5GICogTVNJRSwge1xuICBzZXRUaW1lb3V0OiAgd3JhcChnbG9iYWwuc2V0VGltZW91dCksXG4gIHNldEludGVydmFsOiB3cmFwKGdsb2JhbC5zZXRJbnRlcnZhbClcbn0pOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cbiAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGhvd2V2ZXIsIHRoZVxuICAgICAgICAgIC8vIHJlc3VsdCBmb3IgdGhpcyBpdGVyYXRpb24gd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBzYW1lXG4gICAgICAgICAgLy8gcmVhc29uLiBOb3RlIHRoYXQgcmVqZWN0aW9ucyBvZiB5aWVsZGVkIFByb21pc2VzIGFyZSBub3RcbiAgICAgICAgICAvLyB0aHJvd24gYmFjayBpbnRvIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIGFzIGlzIHRoZSBjYXNlXG4gICAgICAgICAgLy8gd2hlbiBhbiBhd2FpdGVkIFByb21pc2UgaXMgcmVqZWN0ZWQuIFRoaXMgZGlmZmVyZW5jZSBpblxuICAgICAgICAgIC8vIGJlaGF2aW9yIGJldHdlZW4geWllbGQgYW5kIGF3YWl0IGlzIGltcG9ydGFudCwgYmVjYXVzZSBpdFxuICAgICAgICAgIC8vIGFsbG93cyB0aGUgY29uc3VtZXIgdG8gZGVjaWRlIHdoYXQgdG8gZG8gd2l0aCB0aGUgeWllbGRlZFxuICAgICAgICAgIC8vIHJlamVjdGlvbiAoc3dhbGxvdyBpdCBhbmQgY29udGludWUsIG1hbnVhbGx5IC50aHJvdyBpdCBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgZ2VuZXJhdG9yLCBhYmFuZG9uIGl0ZXJhdGlvbiwgd2hhdGV2ZXIpLiBXaXRoXG4gICAgICAgICAgLy8gYXdhaXQsIGJ5IGNvbnRyYXN0LCB0aGVyZSBpcyBubyBvcHBvcnR1bml0eSB0byBleGFtaW5lIHRoZVxuICAgICAgICAgIC8vIHJlamVjdGlvbiByZWFzb24gb3V0c2lkZSB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBzbyB0aGVcbiAgICAgICAgICAvLyBvbmx5IG9wdGlvbiBpcyB0byB0aHJvdyBpdCBmcm9tIHRoZSBhd2FpdCBleHByZXNzaW9uLCBhbmRcbiAgICAgICAgICAvLyBsZXQgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBoYW5kbGUgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZ2xvYmFsLnByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgZ2xvYmFsLnByb2Nlc3MuZG9tYWluKSB7XG4gICAgICBpbnZva2UgPSBnbG9iYWwucHJvY2Vzcy5kb21haW4uYmluZChpbnZva2UpO1xuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHJ1bnRpbWUuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuICAgICk7XG5cbiAgICByZXR1cm4gcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbiAgLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuICAvLyBvYmplY3QsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG1vc3QgcmVsaWFibGUgdGVjaG5pcXVlIHRoYXQgZG9lcyBub3RcbiAgLy8gdXNlIGluZGlyZWN0IGV2YWwgKHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5KS5cbiAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6XG4gIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOlxuICB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB0aGlzXG4pO1xuIiwiLyohIFZlbG9jaXR5SlMub3JnICgxLjUuMCkuIChDKSAyMDE0IEp1bGlhbiBTaGFwaXJvLiBNSVQgQGxpY2Vuc2U6IGVuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZSAqL1xuLyohIFZlbG9jaXR5SlMub3JnIGpRdWVyeSBTaGltICgxLjAuMSkuIChDKSAyMDE0IFRoZSBqUXVlcnkgRm91bmRhdGlvbi4gTUlUIEBsaWNlbnNlOiBlbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UuICovXG4hZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihhKXt2YXIgYj1hLmxlbmd0aCxkPWMudHlwZShhKTtyZXR1cm5cImZ1bmN0aW9uXCIhPT1kJiYhYy5pc1dpbmRvdyhhKSYmKCEoMSE9PWEubm9kZVR5cGV8fCFiKXx8KFwiYXJyYXlcIj09PWR8fDA9PT1ifHxcIm51bWJlclwiPT10eXBlb2YgYiYmYj4wJiZiLTEgaW4gYSkpfWlmKCFhLmpRdWVyeSl7dmFyIGM9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGMuZm4uaW5pdChhLGIpfTtjLmlzV2luZG93PWZ1bmN0aW9uKGEpe3JldHVybiBhJiZhPT09YS53aW5kb3d9LGMudHlwZT1mdW5jdGlvbihhKXtyZXR1cm4gYT9cIm9iamVjdFwiPT10eXBlb2YgYXx8XCJmdW5jdGlvblwiPT10eXBlb2YgYT9lW2cuY2FsbChhKV18fFwib2JqZWN0XCI6dHlwZW9mIGE6YStcIlwifSxjLmlzQXJyYXk9QXJyYXkuaXNBcnJheXx8ZnVuY3Rpb24oYSl7cmV0dXJuXCJhcnJheVwiPT09Yy50eXBlKGEpfSxjLmlzUGxhaW5PYmplY3Q9ZnVuY3Rpb24oYSl7dmFyIGI7aWYoIWF8fFwib2JqZWN0XCIhPT1jLnR5cGUoYSl8fGEubm9kZVR5cGV8fGMuaXNXaW5kb3coYSkpcmV0dXJuITE7dHJ5e2lmKGEuY29uc3RydWN0b3ImJiFmLmNhbGwoYSxcImNvbnN0cnVjdG9yXCIpJiYhZi5jYWxsKGEuY29uc3RydWN0b3IucHJvdG90eXBlLFwiaXNQcm90b3R5cGVPZlwiKSlyZXR1cm4hMX1jYXRjaChkKXtyZXR1cm4hMX1mb3IoYiBpbiBhKTtyZXR1cm4gYj09PXVuZGVmaW5lZHx8Zi5jYWxsKGEsYil9LGMuZWFjaD1mdW5jdGlvbihhLGMsZCl7dmFyIGU9MCxmPWEubGVuZ3RoLGc9YihhKTtpZihkKXtpZihnKWZvcig7ZTxmJiZjLmFwcGx5KGFbZV0sZCkhPT0hMTtlKyspO2Vsc2UgZm9yKGUgaW4gYSlpZihhLmhhc093blByb3BlcnR5KGUpJiZjLmFwcGx5KGFbZV0sZCk9PT0hMSlicmVha31lbHNlIGlmKGcpZm9yKDtlPGYmJmMuY2FsbChhW2VdLGUsYVtlXSkhPT0hMTtlKyspO2Vsc2UgZm9yKGUgaW4gYSlpZihhLmhhc093blByb3BlcnR5KGUpJiZjLmNhbGwoYVtlXSxlLGFbZV0pPT09ITEpYnJlYWs7cmV0dXJuIGF9LGMuZGF0YT1mdW5jdGlvbihhLGIsZSl7aWYoZT09PXVuZGVmaW5lZCl7dmFyIGY9YVtjLmV4cGFuZG9dLGc9ZiYmZFtmXTtpZihiPT09dW5kZWZpbmVkKXJldHVybiBnO2lmKGcmJmIgaW4gZylyZXR1cm4gZ1tiXX1lbHNlIGlmKGIhPT11bmRlZmluZWQpe3ZhciBoPWFbYy5leHBhbmRvXXx8KGFbYy5leHBhbmRvXT0rK2MudXVpZCk7cmV0dXJuIGRbaF09ZFtoXXx8e30sZFtoXVtiXT1lLGV9fSxjLnJlbW92ZURhdGE9ZnVuY3Rpb24oYSxiKXt2YXIgZT1hW2MuZXhwYW5kb10sZj1lJiZkW2VdO2YmJihiP2MuZWFjaChiLGZ1bmN0aW9uKGEsYil7ZGVsZXRlIGZbYl19KTpkZWxldGUgZFtlXSl9LGMuZXh0ZW5kPWZ1bmN0aW9uKCl7dmFyIGEsYixkLGUsZixnLGg9YXJndW1lbnRzWzBdfHx7fSxpPTEsaj1hcmd1bWVudHMubGVuZ3RoLGs9ITE7Zm9yKFwiYm9vbGVhblwiPT10eXBlb2YgaCYmKGs9aCxoPWFyZ3VtZW50c1tpXXx8e30saSsrKSxcIm9iamVjdFwiIT10eXBlb2YgaCYmXCJmdW5jdGlvblwiIT09Yy50eXBlKGgpJiYoaD17fSksaT09PWomJihoPXRoaXMsaS0tKTtpPGo7aSsrKWlmKGY9YXJndW1lbnRzW2ldKWZvcihlIGluIGYpZi5oYXNPd25Qcm9wZXJ0eShlKSYmKGE9aFtlXSxkPWZbZV0saCE9PWQmJihrJiZkJiYoYy5pc1BsYWluT2JqZWN0KGQpfHwoYj1jLmlzQXJyYXkoZCkpKT8oYj8oYj0hMSxnPWEmJmMuaXNBcnJheShhKT9hOltdKTpnPWEmJmMuaXNQbGFpbk9iamVjdChhKT9hOnt9LGhbZV09Yy5leHRlbmQoayxnLGQpKTpkIT09dW5kZWZpbmVkJiYoaFtlXT1kKSkpO3JldHVybiBofSxjLnF1ZXVlPWZ1bmN0aW9uKGEsZCxlKXtpZihhKXtkPShkfHxcImZ4XCIpK1wicXVldWVcIjt2YXIgZj1jLmRhdGEoYSxkKTtyZXR1cm4gZT8oIWZ8fGMuaXNBcnJheShlKT9mPWMuZGF0YShhLGQsZnVuY3Rpb24oYSxjKXt2YXIgZD1jfHxbXTtyZXR1cm4gYSYmKGIoT2JqZWN0KGEpKT9mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0rYi5sZW5ndGgsZD0wLGU9YS5sZW5ndGg7ZDxjOylhW2UrK109YltkKytdO2lmKGMhPT1jKWZvcig7YltkXSE9PXVuZGVmaW5lZDspYVtlKytdPWJbZCsrXTthLmxlbmd0aD1lLGF9KGQsXCJzdHJpbmdcIj09dHlwZW9mIGE/W2FdOmEpOltdLnB1c2guY2FsbChkLGEpKSxkfShlKSk6Zi5wdXNoKGUpLGYpOmZ8fFtdfX0sYy5kZXF1ZXVlPWZ1bmN0aW9uKGEsYil7Yy5lYWNoKGEubm9kZVR5cGU/W2FdOmEsZnVuY3Rpb24oYSxkKXtiPWJ8fFwiZnhcIjt2YXIgZT1jLnF1ZXVlKGQsYiksZj1lLnNoaWZ0KCk7XCJpbnByb2dyZXNzXCI9PT1mJiYoZj1lLnNoaWZ0KCkpLGYmJihcImZ4XCI9PT1iJiZlLnVuc2hpZnQoXCJpbnByb2dyZXNzXCIpLGYuY2FsbChkLGZ1bmN0aW9uKCl7Yy5kZXF1ZXVlKGQsYil9KSl9KX0sYy5mbj1jLnByb3RvdHlwZT17aW5pdDpmdW5jdGlvbihhKXtpZihhLm5vZGVUeXBlKXJldHVybiB0aGlzWzBdPWEsdGhpczt0aHJvdyBuZXcgRXJyb3IoXCJOb3QgYSBET00gbm9kZS5cIil9LG9mZnNldDpmdW5jdGlvbigpe3ZhciBiPXRoaXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0P3RoaXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk6e3RvcDowLGxlZnQ6MH07cmV0dXJue3RvcDpiLnRvcCsoYS5wYWdlWU9mZnNldHx8ZG9jdW1lbnQuc2Nyb2xsVG9wfHwwKS0oZG9jdW1lbnQuY2xpZW50VG9wfHwwKSxsZWZ0OmIubGVmdCsoYS5wYWdlWE9mZnNldHx8ZG9jdW1lbnQuc2Nyb2xsTGVmdHx8MCktKGRvY3VtZW50LmNsaWVudExlZnR8fDApfX0scG9zaXRpb246ZnVuY3Rpb24oKXt2YXIgYT10aGlzWzBdLGI9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPWEub2Zmc2V0UGFyZW50O2ImJlwiaHRtbFwiIT09Yi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpJiZiLnN0eWxlJiZcInN0YXRpY1wiPT09Yi5zdHlsZS5wb3NpdGlvbjspYj1iLm9mZnNldFBhcmVudDtyZXR1cm4gYnx8ZG9jdW1lbnR9KGEpLGQ9dGhpcy5vZmZzZXQoKSxlPS9eKD86Ym9keXxodG1sKSQvaS50ZXN0KGIubm9kZU5hbWUpP3t0b3A6MCxsZWZ0OjB9OmMoYikub2Zmc2V0KCk7cmV0dXJuIGQudG9wLT1wYXJzZUZsb2F0KGEuc3R5bGUubWFyZ2luVG9wKXx8MCxkLmxlZnQtPXBhcnNlRmxvYXQoYS5zdHlsZS5tYXJnaW5MZWZ0KXx8MCxiLnN0eWxlJiYoZS50b3ArPXBhcnNlRmxvYXQoYi5zdHlsZS5ib3JkZXJUb3BXaWR0aCl8fDAsZS5sZWZ0Kz1wYXJzZUZsb2F0KGIuc3R5bGUuYm9yZGVyTGVmdFdpZHRoKXx8MCkse3RvcDpkLnRvcC1lLnRvcCxsZWZ0OmQubGVmdC1lLmxlZnR9fX07dmFyIGQ9e307Yy5leHBhbmRvPVwidmVsb2NpdHlcIisobmV3IERhdGUpLmdldFRpbWUoKSxjLnV1aWQ9MDtmb3IodmFyIGU9e30sZj1lLmhhc093blByb3BlcnR5LGc9ZS50b1N0cmluZyxoPVwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvclwiLnNwbGl0KFwiIFwiKSxpPTA7aTxoLmxlbmd0aDtpKyspZVtcIltvYmplY3QgXCIraFtpXStcIl1cIl09aFtpXS50b0xvd2VyQ2FzZSgpO2MuZm4uaW5pdC5wcm90b3R5cGU9Yy5mbixhLlZlbG9jaXR5PXtVdGlsaXRpZXM6Y319fSh3aW5kb3cpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO1wib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1hKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShhKTphKCl9KGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIGZ1bmN0aW9uKGEsYixjLGQpe2Z1bmN0aW9uIGUoYSl7Zm9yKHZhciBiPS0xLGM9YT9hLmxlbmd0aDowLGQ9W107KytiPGM7KXt2YXIgZT1hW2JdO2UmJmQucHVzaChlKX1yZXR1cm4gZH1mdW5jdGlvbiBmKGEpe3JldHVybiB1LmlzV3JhcHBlZChhKT9hPXMuY2FsbChhKTp1LmlzTm9kZShhKSYmKGE9W2FdKSxhfWZ1bmN0aW9uIGcoYSl7dmFyIGI9by5kYXRhKGEsXCJ2ZWxvY2l0eVwiKTtyZXR1cm4gbnVsbD09PWI/ZDpifWZ1bmN0aW9uIGgoYSxiKXt2YXIgYz1nKGEpO2MmJmMuZGVsYXlUaW1lciYmIWMuZGVsYXlQYXVzZWQmJihjLmRlbGF5UmVtYWluaW5nPWMuZGVsYXktYitjLmRlbGF5QmVnaW4sYy5kZWxheVBhdXNlZD0hMCxjbGVhclRpbWVvdXQoYy5kZWxheVRpbWVyLnNldFRpbWVvdXQpKX1mdW5jdGlvbiBpKGEsYil7dmFyIGM9ZyhhKTtjJiZjLmRlbGF5VGltZXImJmMuZGVsYXlQYXVzZWQmJihjLmRlbGF5UGF1c2VkPSExLGMuZGVsYXlUaW1lci5zZXRUaW1lb3V0PXNldFRpbWVvdXQoYy5kZWxheVRpbWVyLm5leHQsYy5kZWxheVJlbWFpbmluZykpfWZ1bmN0aW9uIGooYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiBNYXRoLnJvdW5kKGIqYSkqKDEvYSl9fWZ1bmN0aW9uIGsoYSxjLGQsZSl7ZnVuY3Rpb24gZihhLGIpe3JldHVybiAxLTMqYiszKmF9ZnVuY3Rpb24gZyhhLGIpe3JldHVybiAzKmItNiphfWZ1bmN0aW9uIGgoYSl7cmV0dXJuIDMqYX1mdW5jdGlvbiBpKGEsYixjKXtyZXR1cm4oKGYoYixjKSphK2coYixjKSkqYStoKGIpKSphfWZ1bmN0aW9uIGooYSxiLGMpe3JldHVybiAzKmYoYixjKSphKmErMipnKGIsYykqYStoKGIpfWZ1bmN0aW9uIGsoYixjKXtmb3IodmFyIGU9MDtlPHA7KytlKXt2YXIgZj1qKGMsYSxkKTtpZigwPT09ZilyZXR1cm4gYztjLT0oaShjLGEsZCktYikvZn1yZXR1cm4gY31mdW5jdGlvbiBsKCl7Zm9yKHZhciBiPTA7Yjx0OysrYil4W2JdPWkoYip1LGEsZCl9ZnVuY3Rpb24gbShiLGMsZSl7dmFyIGYsZyxoPTA7ZG97Zz1jKyhlLWMpLzIsZj1pKGcsYSxkKS1iLGY+MD9lPWc6Yz1nfXdoaWxlKE1hdGguYWJzKGYpPnImJisraDxzKTtyZXR1cm4gZ31mdW5jdGlvbiBuKGIpe2Zvcih2YXIgYz0wLGU9MSxmPXQtMTtlIT09ZiYmeFtlXTw9YjsrK2UpYys9dTstLWU7dmFyIGc9KGIteFtlXSkvKHhbZSsxXS14W2VdKSxoPWMrZyp1LGk9aihoLGEsZCk7cmV0dXJuIGk+PXE/ayhiLGgpOjA9PT1pP2g6bShiLGMsYyt1KX1mdW5jdGlvbiBvKCl7eT0hMCxhPT09YyYmZD09PWV8fGwoKX12YXIgcD00LHE9LjAwMSxyPTFlLTcscz0xMCx0PTExLHU9MS8odC0xKSx2PVwiRmxvYXQzMkFycmF5XCJpbiBiO2lmKDQhPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiExO2Zvcih2YXIgdz0wO3c8NDsrK3cpaWYoXCJudW1iZXJcIiE9dHlwZW9mIGFyZ3VtZW50c1t3XXx8aXNOYU4oYXJndW1lbnRzW3ddKXx8IWlzRmluaXRlKGFyZ3VtZW50c1t3XSkpcmV0dXJuITE7YT1NYXRoLm1pbihhLDEpLGQ9TWF0aC5taW4oZCwxKSxhPU1hdGgubWF4KGEsMCksZD1NYXRoLm1heChkLDApO3ZhciB4PXY/bmV3IEZsb2F0MzJBcnJheSh0KTpuZXcgQXJyYXkodCkseT0hMSx6PWZ1bmN0aW9uKGIpe3JldHVybiB5fHxvKCksYT09PWMmJmQ9PT1lP2I6MD09PWI/MDoxPT09Yj8xOmkobihiKSxjLGUpfTt6LmdldENvbnRyb2xQb2ludHM9ZnVuY3Rpb24oKXtyZXR1cm5be3g6YSx5OmN9LHt4OmQseTplfV19O3ZhciBBPVwiZ2VuZXJhdGVCZXppZXIoXCIrW2EsYyxkLGVdK1wiKVwiO3JldHVybiB6LnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIEF9LHp9ZnVuY3Rpb24gbChhLGIpe3ZhciBjPWE7cmV0dXJuIHUuaXNTdHJpbmcoYSk/eS5FYXNpbmdzW2FdfHwoYz0hMSk6Yz11LmlzQXJyYXkoYSkmJjE9PT1hLmxlbmd0aD9qLmFwcGx5KG51bGwsYSk6dS5pc0FycmF5KGEpJiYyPT09YS5sZW5ndGg/ei5hcHBseShudWxsLGEuY29uY2F0KFtiXSkpOiEoIXUuaXNBcnJheShhKXx8NCE9PWEubGVuZ3RoKSYmay5hcHBseShudWxsLGEpLGM9PT0hMSYmKGM9eS5FYXNpbmdzW3kuZGVmYXVsdHMuZWFzaW5nXT95LmRlZmF1bHRzLmVhc2luZzp4KSxjfWZ1bmN0aW9uIG0oYSl7aWYoYSl7dmFyIGI9eS50aW1lc3RhbXAmJmEhPT0hMD9hOnIubm93KCksYz15LlN0YXRlLmNhbGxzLmxlbmd0aDtjPjFlNCYmKHkuU3RhdGUuY2FsbHM9ZSh5LlN0YXRlLmNhbGxzKSxjPXkuU3RhdGUuY2FsbHMubGVuZ3RoKTtmb3IodmFyIGY9MDtmPGM7ZisrKWlmKHkuU3RhdGUuY2FsbHNbZl0pe3ZhciBoPXkuU3RhdGUuY2FsbHNbZl0saT1oWzBdLGo9aFsyXSxrPWhbM10sbD0hIWsscT1udWxsLHM9aFs1XSx0PWhbNl07aWYoa3x8KGs9eS5TdGF0ZS5jYWxsc1tmXVszXT1iLTE2KSxzKXtpZihzLnJlc3VtZSE9PSEwKWNvbnRpbnVlO2s9aFszXT1NYXRoLnJvdW5kKGItdC0xNiksaFs1XT1udWxsfXQ9aFs2XT1iLWs7Zm9yKHZhciB2PU1hdGgubWluKHQvai5kdXJhdGlvbiwxKSx3PTAseD1pLmxlbmd0aDt3PHg7dysrKXt2YXIgej1pW3ddLEI9ei5lbGVtZW50O2lmKGcoQikpe3ZhciBEPSExO2lmKGouZGlzcGxheSE9PWQmJm51bGwhPT1qLmRpc3BsYXkmJlwibm9uZVwiIT09ai5kaXNwbGF5KXtpZihcImZsZXhcIj09PWouZGlzcGxheSl7dmFyIEU9W1wiLXdlYmtpdC1ib3hcIixcIi1tb3otYm94XCIsXCItbXMtZmxleGJveFwiLFwiLXdlYmtpdC1mbGV4XCJdO28uZWFjaChFLGZ1bmN0aW9uKGEsYil7QS5zZXRQcm9wZXJ0eVZhbHVlKEIsXCJkaXNwbGF5XCIsYil9KX1BLnNldFByb3BlcnR5VmFsdWUoQixcImRpc3BsYXlcIixqLmRpc3BsYXkpfWoudmlzaWJpbGl0eSE9PWQmJlwiaGlkZGVuXCIhPT1qLnZpc2liaWxpdHkmJkEuc2V0UHJvcGVydHlWYWx1ZShCLFwidmlzaWJpbGl0eVwiLGoudmlzaWJpbGl0eSk7Zm9yKHZhciBGIGluIHopaWYoei5oYXNPd25Qcm9wZXJ0eShGKSYmXCJlbGVtZW50XCIhPT1GKXt2YXIgRyxIPXpbRl0sST11LmlzU3RyaW5nKEguZWFzaW5nKT95LkVhc2luZ3NbSC5lYXNpbmddOkguZWFzaW5nO2lmKHUuaXNTdHJpbmcoSC5wYXR0ZXJuKSl7dmFyIEo9MT09PXY/ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPUguZW5kVmFsdWVbYl07cmV0dXJuIGM/TWF0aC5yb3VuZChkKTpkfTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9SC5zdGFydFZhbHVlW2JdLGU9SC5lbmRWYWx1ZVtiXS1kLGY9ZCtlKkkodixqLGUpO3JldHVybiBjP01hdGgucm91bmQoZik6Zn07Rz1ILnBhdHRlcm4ucmVwbGFjZSgveyhcXGQrKSghKT99L2csSil9ZWxzZSBpZigxPT09dilHPUguZW5kVmFsdWU7ZWxzZXt2YXIgSz1ILmVuZFZhbHVlLUguc3RhcnRWYWx1ZTtHPUguc3RhcnRWYWx1ZStLKkkodixqLEspfWlmKCFsJiZHPT09SC5jdXJyZW50VmFsdWUpY29udGludWU7aWYoSC5jdXJyZW50VmFsdWU9RyxcInR3ZWVuXCI9PT1GKXE9RztlbHNle3ZhciBMO2lmKEEuSG9va3MucmVnaXN0ZXJlZFtGXSl7TD1BLkhvb2tzLmdldFJvb3QoRik7dmFyIE09ZyhCKS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW0xdO00mJihILnJvb3RQcm9wZXJ0eVZhbHVlPU0pfXZhciBOPUEuc2V0UHJvcGVydHlWYWx1ZShCLEYsSC5jdXJyZW50VmFsdWUrKHA8OSYmMD09PXBhcnNlRmxvYXQoRyk/XCJcIjpILnVuaXRUeXBlKSxILnJvb3RQcm9wZXJ0eVZhbHVlLEguc2Nyb2xsRGF0YSk7QS5Ib29rcy5yZWdpc3RlcmVkW0ZdJiYoQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW0xdP2coQikucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtMXT1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbTF0oXCJleHRyYWN0XCIsbnVsbCxOWzFdKTpnKEIpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbTF09TlsxXSksXCJ0cmFuc2Zvcm1cIj09PU5bMF0mJihEPSEwKX19ai5tb2JpbGVIQSYmZyhCKS50cmFuc2Zvcm1DYWNoZS50cmFuc2xhdGUzZD09PWQmJihnKEIpLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkPVwiKDBweCwgMHB4LCAwcHgpXCIsRD0hMCksRCYmQS5mbHVzaFRyYW5zZm9ybUNhY2hlKEIpfX1qLmRpc3BsYXkhPT1kJiZcIm5vbmVcIiE9PWouZGlzcGxheSYmKHkuU3RhdGUuY2FsbHNbZl1bMl0uZGlzcGxheT0hMSksai52aXNpYmlsaXR5IT09ZCYmXCJoaWRkZW5cIiE9PWoudmlzaWJpbGl0eSYmKHkuU3RhdGUuY2FsbHNbZl1bMl0udmlzaWJpbGl0eT0hMSksai5wcm9ncmVzcyYmai5wcm9ncmVzcy5jYWxsKGhbMV0saFsxXSx2LE1hdGgubWF4KDAsaytqLmR1cmF0aW9uLWIpLGsscSksMT09PXYmJm4oZil9fXkuU3RhdGUuaXNUaWNraW5nJiZDKG0pfWZ1bmN0aW9uIG4oYSxiKXtpZigheS5TdGF0ZS5jYWxsc1thXSlyZXR1cm4hMTtmb3IodmFyIGM9eS5TdGF0ZS5jYWxsc1thXVswXSxlPXkuU3RhdGUuY2FsbHNbYV1bMV0sZj15LlN0YXRlLmNhbGxzW2FdWzJdLGg9eS5TdGF0ZS5jYWxsc1thXVs0XSxpPSExLGo9MCxrPWMubGVuZ3RoO2o8aztqKyspe3ZhciBsPWNbal0uZWxlbWVudDtifHxmLmxvb3B8fChcIm5vbmVcIj09PWYuZGlzcGxheSYmQS5zZXRQcm9wZXJ0eVZhbHVlKGwsXCJkaXNwbGF5XCIsZi5kaXNwbGF5KSxcImhpZGRlblwiPT09Zi52aXNpYmlsaXR5JiZBLnNldFByb3BlcnR5VmFsdWUobCxcInZpc2liaWxpdHlcIixmLnZpc2liaWxpdHkpKTt2YXIgbT1nKGwpO2lmKGYubG9vcCE9PSEwJiYoby5xdWV1ZShsKVsxXT09PWR8fCEvXFwudmVsb2NpdHlRdWV1ZUVudHJ5RmxhZy9pLnRlc3Qoby5xdWV1ZShsKVsxXSkpJiZtKXttLmlzQW5pbWF0aW5nPSExLG0ucm9vdFByb3BlcnR5VmFsdWVDYWNoZT17fTt2YXIgbj0hMTtvLmVhY2goQS5MaXN0cy50cmFuc2Zvcm1zM0QsZnVuY3Rpb24oYSxiKXt2YXIgYz0vXnNjYWxlLy50ZXN0KGIpPzE6MCxlPW0udHJhbnNmb3JtQ2FjaGVbYl07bS50cmFuc2Zvcm1DYWNoZVtiXSE9PWQmJm5ldyBSZWdFeHAoXCJeXFxcXChcIitjK1wiW14uXVwiKS50ZXN0KGUpJiYobj0hMCxkZWxldGUgbS50cmFuc2Zvcm1DYWNoZVtiXSl9KSxmLm1vYmlsZUhBJiYobj0hMCxkZWxldGUgbS50cmFuc2Zvcm1DYWNoZS50cmFuc2xhdGUzZCksbiYmQS5mbHVzaFRyYW5zZm9ybUNhY2hlKGwpLEEuVmFsdWVzLnJlbW92ZUNsYXNzKGwsXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIil9aWYoIWImJmYuY29tcGxldGUmJiFmLmxvb3AmJmo9PT1rLTEpdHJ5e2YuY29tcGxldGUuY2FsbChlLGUpfWNhdGNoKHIpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0aHJvdyByfSwxKX1oJiZmLmxvb3AhPT0hMCYmaChlKSxtJiZmLmxvb3A9PT0hMCYmIWImJihvLmVhY2gobS50d2VlbnNDb250YWluZXIsZnVuY3Rpb24oYSxiKXtpZigvXnJvdGF0ZS8udGVzdChhKSYmKHBhcnNlRmxvYXQoYi5zdGFydFZhbHVlKS1wYXJzZUZsb2F0KGIuZW5kVmFsdWUpKSUzNjA9PTApe3ZhciBjPWIuc3RhcnRWYWx1ZTtiLnN0YXJ0VmFsdWU9Yi5lbmRWYWx1ZSxiLmVuZFZhbHVlPWN9L15iYWNrZ3JvdW5kUG9zaXRpb24vLnRlc3QoYSkmJjEwMD09PXBhcnNlRmxvYXQoYi5lbmRWYWx1ZSkmJlwiJVwiPT09Yi51bml0VHlwZSYmKGIuZW5kVmFsdWU9MCxiLnN0YXJ0VmFsdWU9MTAwKX0pLHkobCxcInJldmVyc2VcIix7bG9vcDohMCxkZWxheTpmLmRlbGF5fSkpLGYucXVldWUhPT0hMSYmby5kZXF1ZXVlKGwsZi5xdWV1ZSl9eS5TdGF0ZS5jYWxsc1thXT0hMTtmb3IodmFyIHA9MCxxPXkuU3RhdGUuY2FsbHMubGVuZ3RoO3A8cTtwKyspaWYoeS5TdGF0ZS5jYWxsc1twXSE9PSExKXtpPSEwO2JyZWFrfWk9PT0hMSYmKHkuU3RhdGUuaXNUaWNraW5nPSExLGRlbGV0ZSB5LlN0YXRlLmNhbGxzLHkuU3RhdGUuY2FsbHM9W10pfXZhciBvLHA9ZnVuY3Rpb24oKXtpZihjLmRvY3VtZW50TW9kZSlyZXR1cm4gYy5kb2N1bWVudE1vZGU7Zm9yKHZhciBhPTc7YT40O2EtLSl7dmFyIGI9Yy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2lmKGIuaW5uZXJIVE1MPVwiPCEtLVtpZiBJRSBcIithK1wiXT48c3Bhbj48L3NwYW4+PCFbZW5kaWZdLS0+XCIsYi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNwYW5cIikubGVuZ3RoKXJldHVybiBiPW51bGwsYX1yZXR1cm4gZH0oKSxxPWZ1bmN0aW9uKCl7dmFyIGE9MDtyZXR1cm4gYi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGIubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxmdW5jdGlvbihiKXt2YXIgYyxkPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBjPU1hdGgubWF4KDAsMTYtKGQtYSkpLGE9ZCtjLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtiKGQrYyl9LGMpfX0oKSxyPWZ1bmN0aW9uKCl7dmFyIGE9Yi5wZXJmb3JtYW5jZXx8e307aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgYS5ub3cpe3ZhciBjPWEudGltaW5nJiZhLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQ/YS50aW1pbmcubmF2aWdhdGlvblN0YXJ0OihuZXcgRGF0ZSkuZ2V0VGltZSgpO2Eubm93PWZ1bmN0aW9uKCl7cmV0dXJuKG5ldyBEYXRlKS5nZXRUaW1lKCktY319cmV0dXJuIGF9KCkscz1mdW5jdGlvbigpe3ZhciBhPUFycmF5LnByb3RvdHlwZS5zbGljZTt0cnl7cmV0dXJuIGEuY2FsbChjLmRvY3VtZW50RWxlbWVudCksYX1jYXRjaChiKXtyZXR1cm4gZnVuY3Rpb24oYixjKXt2YXIgZD10aGlzLmxlbmd0aDtpZihcIm51bWJlclwiIT10eXBlb2YgYiYmKGI9MCksXCJudW1iZXJcIiE9dHlwZW9mIGMmJihjPWQpLHRoaXMuc2xpY2UpcmV0dXJuIGEuY2FsbCh0aGlzLGIsYyk7dmFyIGUsZj1bXSxnPWI+PTA/YjpNYXRoLm1heCgwLGQrYiksaD1jPDA/ZCtjOk1hdGgubWluKGMsZCksaT1oLWc7aWYoaT4wKWlmKGY9bmV3IEFycmF5KGkpLHRoaXMuY2hhckF0KWZvcihlPTA7ZTxpO2UrKylmW2VdPXRoaXMuY2hhckF0KGcrZSk7ZWxzZSBmb3IoZT0wO2U8aTtlKyspZltlXT10aGlzW2crZV07cmV0dXJuIGZ9fX0oKSx0PWZ1bmN0aW9uKCl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcz9mdW5jdGlvbihhLGIpe3JldHVybiBhLmluY2x1ZGVzKGIpfTpBcnJheS5wcm90b3R5cGUuaW5kZXhPZj9mdW5jdGlvbihhLGIpe3JldHVybiBhLmluZGV4T2YoYik+PTB9OmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTA7YzxhLmxlbmd0aDtjKyspaWYoYVtjXT09PWIpcmV0dXJuITA7cmV0dXJuITF9fSx1PXtpc051bWJlcjpmdW5jdGlvbihhKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgYX0saXNTdHJpbmc6ZnVuY3Rpb24oYSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGF9LGlzQXJyYXk6QXJyYXkuaXNBcnJheXx8ZnVuY3Rpb24oYSl7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpfSxpc0Z1bmN0aW9uOmZ1bmN0aW9uKGEpe3JldHVyblwiW29iamVjdCBGdW5jdGlvbl1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKX0saXNOb2RlOmZ1bmN0aW9uKGEpe3JldHVybiBhJiZhLm5vZGVUeXBlfSxpc1dyYXBwZWQ6ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJmEhPT1iJiZ1LmlzTnVtYmVyKGEubGVuZ3RoKSYmIXUuaXNTdHJpbmcoYSkmJiF1LmlzRnVuY3Rpb24oYSkmJiF1LmlzTm9kZShhKSYmKDA9PT1hLmxlbmd0aHx8dS5pc05vZGUoYVswXSkpfSxpc1NWRzpmdW5jdGlvbihhKXtyZXR1cm4gYi5TVkdFbGVtZW50JiZhIGluc3RhbmNlb2YgYi5TVkdFbGVtZW50fSxpc0VtcHR5T2JqZWN0OmZ1bmN0aW9uKGEpe2Zvcih2YXIgYiBpbiBhKWlmKGEuaGFzT3duUHJvcGVydHkoYikpcmV0dXJuITE7cmV0dXJuITB9fSx2PSExO2lmKGEuZm4mJmEuZm4uanF1ZXJ5PyhvPWEsdj0hMCk6bz1iLlZlbG9jaXR5LlV0aWxpdGllcyxwPD04JiYhdil0aHJvdyBuZXcgRXJyb3IoXCJWZWxvY2l0eTogSUU4IGFuZCBiZWxvdyByZXF1aXJlIGpRdWVyeSB0byBiZSBsb2FkZWQgYmVmb3JlIFZlbG9jaXR5LlwiKTtpZihwPD03KXJldHVybiB2b2lkKGpRdWVyeS5mbi52ZWxvY2l0eT1qUXVlcnkuZm4uYW5pbWF0ZSk7dmFyIHc9NDAwLHg9XCJzd2luZ1wiLHk9e1N0YXRlOntpc01vYmlsZTovQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksaXNBbmRyb2lkOi9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxpc0dpbmdlcmJyZWFkOi9BbmRyb2lkIDJcXC4zXFwuWzMtN10vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLGlzQ2hyb21lOmIuY2hyb21lLGlzRmlyZWZveDovRmlyZWZveC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkscHJlZml4RWxlbWVudDpjLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikscHJlZml4TWF0Y2hlczp7fSxzY3JvbGxBbmNob3I6bnVsbCxzY3JvbGxQcm9wZXJ0eUxlZnQ6bnVsbCxzY3JvbGxQcm9wZXJ0eVRvcDpudWxsLGlzVGlja2luZzohMSxjYWxsczpbXSxkZWxheWVkRWxlbWVudHM6e2NvdW50OjB9fSxDU1M6e30sVXRpbGl0aWVzOm8sUmVkaXJlY3RzOnt9LEVhc2luZ3M6e30sUHJvbWlzZTpiLlByb21pc2UsZGVmYXVsdHM6e3F1ZXVlOlwiXCIsZHVyYXRpb246dyxlYXNpbmc6eCxiZWdpbjpkLGNvbXBsZXRlOmQscHJvZ3Jlc3M6ZCxkaXNwbGF5OmQsdmlzaWJpbGl0eTpkLGxvb3A6ITEsZGVsYXk6ITEsbW9iaWxlSEE6ITAsX2NhY2hlVmFsdWVzOiEwLHByb21pc2VSZWplY3RFbXB0eTohMH0saW5pdDpmdW5jdGlvbihhKXtvLmRhdGEoYSxcInZlbG9jaXR5XCIse2lzU1ZHOnUuaXNTVkcoYSksaXNBbmltYXRpbmc6ITEsY29tcHV0ZWRTdHlsZTpudWxsLHR3ZWVuc0NvbnRhaW5lcjpudWxsLHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGU6e30sdHJhbnNmb3JtQ2FjaGU6e319KX0saG9vazpudWxsLG1vY2s6ITEsdmVyc2lvbjp7bWFqb3I6MSxtaW5vcjo1LHBhdGNoOjB9LGRlYnVnOiExLHRpbWVzdGFtcDohMCxwYXVzZUFsbDpmdW5jdGlvbihhKXt2YXIgYj0obmV3IERhdGUpLmdldFRpbWUoKTtvLmVhY2goeS5TdGF0ZS5jYWxscyxmdW5jdGlvbihiLGMpe2lmKGMpe2lmKGEhPT1kJiYoY1syXS5xdWV1ZSE9PWF8fGNbMl0ucXVldWU9PT0hMSkpcmV0dXJuITA7Y1s1XT17cmVzdW1lOiExfX19KSxvLmVhY2goeS5TdGF0ZS5kZWxheWVkRWxlbWVudHMsZnVuY3Rpb24oYSxjKXtjJiZoKGMsYil9KX0scmVzdW1lQWxsOmZ1bmN0aW9uKGEpe3ZhciBiPShuZXcgRGF0ZSkuZ2V0VGltZSgpO28uZWFjaCh5LlN0YXRlLmNhbGxzLGZ1bmN0aW9uKGIsYyl7aWYoYyl7aWYoYSE9PWQmJihjWzJdLnF1ZXVlIT09YXx8Y1syXS5xdWV1ZT09PSExKSlyZXR1cm4hMDtjWzVdJiYoY1s1XS5yZXN1bWU9ITApfX0pLG8uZWFjaCh5LlN0YXRlLmRlbGF5ZWRFbGVtZW50cyxmdW5jdGlvbihhLGMpe2MmJmkoYyxiKX0pfX07Yi5wYWdlWU9mZnNldCE9PWQ/KHkuU3RhdGUuc2Nyb2xsQW5jaG9yPWIseS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eUxlZnQ9XCJwYWdlWE9mZnNldFwiLHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlUb3A9XCJwYWdlWU9mZnNldFwiKTooeS5TdGF0ZS5zY3JvbGxBbmNob3I9Yy5kb2N1bWVudEVsZW1lbnR8fGMuYm9keS5wYXJlbnROb2RlfHxjLmJvZHkseS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eUxlZnQ9XCJzY3JvbGxMZWZ0XCIseS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eVRvcD1cInNjcm9sbFRvcFwiKTt2YXIgej1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoYSl7cmV0dXJuLWEudGVuc2lvbiphLngtYS5mcmljdGlvbiphLnZ9ZnVuY3Rpb24gYihiLGMsZCl7dmFyIGU9e3g6Yi54K2QuZHgqYyx2OmIuditkLmR2KmMsdGVuc2lvbjpiLnRlbnNpb24sZnJpY3Rpb246Yi5mcmljdGlvbn07cmV0dXJue2R4OmUudixkdjphKGUpfX1mdW5jdGlvbiBjKGMsZCl7dmFyIGU9e2R4OmMudixkdjphKGMpfSxmPWIoYywuNSpkLGUpLGc9YihjLC41KmQsZiksaD1iKGMsZCxnKSxpPTEvNiooZS5keCsyKihmLmR4K2cuZHgpK2guZHgpLGo9MS82KihlLmR2KzIqKGYuZHYrZy5kdikraC5kdik7cmV0dXJuIGMueD1jLngraSpkLGMudj1jLnYraipkLGN9cmV0dXJuIGZ1bmN0aW9uIGQoYSxiLGUpe3ZhciBmLGcsaCxpPXt4Oi0xLHY6MCx0ZW5zaW9uOm51bGwsZnJpY3Rpb246bnVsbH0saj1bMF0saz0wO2ZvcihhPXBhcnNlRmxvYXQoYSl8fDUwMCxiPXBhcnNlRmxvYXQoYil8fDIwLGU9ZXx8bnVsbCxpLnRlbnNpb249YSxpLmZyaWN0aW9uPWIsZj1udWxsIT09ZSxmPyhrPWQoYSxiKSxnPWsvZSouMDE2KTpnPS4wMTY7OylpZihoPWMoaHx8aSxnKSxqLnB1c2goMStoLngpLGsrPTE2LCEoTWF0aC5hYnMoaC54KT4xZS00JiZNYXRoLmFicyhoLnYpPjFlLTQpKWJyZWFrO3JldHVybiBmP2Z1bmN0aW9uKGEpe3JldHVybiBqW2EqKGoubGVuZ3RoLTEpfDBdfTprfX0oKTt5LkVhc2luZ3M9e2xpbmVhcjpmdW5jdGlvbihhKXtyZXR1cm4gYX0sc3dpbmc6ZnVuY3Rpb24oYSl7cmV0dXJuLjUtTWF0aC5jb3MoYSpNYXRoLlBJKS8yfSxzcHJpbmc6ZnVuY3Rpb24oYSl7cmV0dXJuIDEtTWF0aC5jb3MoNC41KmEqTWF0aC5QSSkqTWF0aC5leHAoNiotYSl9fSxvLmVhY2goW1tcImVhc2VcIixbLjI1LC4xLC4yNSwxXV0sW1wiZWFzZS1pblwiLFsuNDIsMCwxLDFdXSxbXCJlYXNlLW91dFwiLFswLDAsLjU4LDFdXSxbXCJlYXNlLWluLW91dFwiLFsuNDIsMCwuNTgsMV1dLFtcImVhc2VJblNpbmVcIixbLjQ3LDAsLjc0NSwuNzE1XV0sW1wiZWFzZU91dFNpbmVcIixbLjM5LC41NzUsLjU2NSwxXV0sW1wiZWFzZUluT3V0U2luZVwiLFsuNDQ1LC4wNSwuNTUsLjk1XV0sW1wiZWFzZUluUXVhZFwiLFsuNTUsLjA4NSwuNjgsLjUzXV0sW1wiZWFzZU91dFF1YWRcIixbLjI1LC40NiwuNDUsLjk0XV0sW1wiZWFzZUluT3V0UXVhZFwiLFsuNDU1LC4wMywuNTE1LC45NTVdXSxbXCJlYXNlSW5DdWJpY1wiLFsuNTUsLjA1NSwuNjc1LC4xOV1dLFtcImVhc2VPdXRDdWJpY1wiLFsuMjE1LC42MSwuMzU1LDFdXSxbXCJlYXNlSW5PdXRDdWJpY1wiLFsuNjQ1LC4wNDUsLjM1NSwxXV0sW1wiZWFzZUluUXVhcnRcIixbLjg5NSwuMDMsLjY4NSwuMjJdXSxbXCJlYXNlT3V0UXVhcnRcIixbLjE2NSwuODQsLjQ0LDFdXSxbXCJlYXNlSW5PdXRRdWFydFwiLFsuNzcsMCwuMTc1LDFdXSxbXCJlYXNlSW5RdWludFwiLFsuNzU1LC4wNSwuODU1LC4wNl1dLFtcImVhc2VPdXRRdWludFwiLFsuMjMsMSwuMzIsMV1dLFtcImVhc2VJbk91dFF1aW50XCIsWy44NiwwLC4wNywxXV0sW1wiZWFzZUluRXhwb1wiLFsuOTUsLjA1LC43OTUsLjAzNV1dLFtcImVhc2VPdXRFeHBvXCIsWy4xOSwxLC4yMiwxXV0sW1wiZWFzZUluT3V0RXhwb1wiLFsxLDAsMCwxXV0sW1wiZWFzZUluQ2lyY1wiLFsuNiwuMDQsLjk4LC4zMzVdXSxbXCJlYXNlT3V0Q2lyY1wiLFsuMDc1LC44MiwuMTY1LDFdXSxbXCJlYXNlSW5PdXRDaXJjXCIsWy43ODUsLjEzNSwuMTUsLjg2XV1dLGZ1bmN0aW9uKGEsYil7eS5FYXNpbmdzW2JbMF1dPWsuYXBwbHkobnVsbCxiWzFdKX0pO3ZhciBBPXkuQ1NTPXtSZWdFeDp7aXNIZXg6L14jKFtBLWZcXGRdezN9KXsxLDJ9JC9pLHZhbHVlVW53cmFwOi9eW0Etel0rXFwoKC4qKVxcKSQvaSx3cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkOi9bMC05Ll0rIFswLTkuXSsgWzAtOS5dKyggWzAtOS5dKyk/Lyx2YWx1ZVNwbGl0Oi8oW0Etel0rXFwoLitcXCkpfCgoW0EtejAtOSMtLl0rPykoPz1cXHN8JCkpL2dpfSxMaXN0czp7Y29sb3JzOltcImZpbGxcIixcInN0cm9rZVwiLFwic3RvcENvbG9yXCIsXCJjb2xvclwiLFwiYmFja2dyb3VuZENvbG9yXCIsXCJib3JkZXJDb2xvclwiLFwiYm9yZGVyVG9wQ29sb3JcIixcImJvcmRlclJpZ2h0Q29sb3JcIixcImJvcmRlckJvdHRvbUNvbG9yXCIsXCJib3JkZXJMZWZ0Q29sb3JcIixcIm91dGxpbmVDb2xvclwiXSx0cmFuc2Zvcm1zQmFzZTpbXCJ0cmFuc2xhdGVYXCIsXCJ0cmFuc2xhdGVZXCIsXCJzY2FsZVwiLFwic2NhbGVYXCIsXCJzY2FsZVlcIixcInNrZXdYXCIsXCJza2V3WVwiLFwicm90YXRlWlwiXSx0cmFuc2Zvcm1zM0Q6W1widHJhbnNmb3JtUGVyc3BlY3RpdmVcIixcInRyYW5zbGF0ZVpcIixcInNjYWxlWlwiLFwicm90YXRlWFwiLFwicm90YXRlWVwiXSx1bml0czpbXCIlXCIsXCJlbVwiLFwiZXhcIixcImNoXCIsXCJyZW1cIixcInZ3XCIsXCJ2aFwiLFwidm1pblwiLFwidm1heFwiLFwiY21cIixcIm1tXCIsXCJRXCIsXCJpblwiLFwicGNcIixcInB0XCIsXCJweFwiLFwiZGVnXCIsXCJncmFkXCIsXCJyYWRcIixcInR1cm5cIixcInNcIixcIm1zXCJdLGNvbG9yTmFtZXM6e2FsaWNlYmx1ZTpcIjI0MCwyNDgsMjU1XCIsYW50aXF1ZXdoaXRlOlwiMjUwLDIzNSwyMTVcIixhcXVhbWFyaW5lOlwiMTI3LDI1NSwyMTJcIixhcXVhOlwiMCwyNTUsMjU1XCIsYXp1cmU6XCIyNDAsMjU1LDI1NVwiLGJlaWdlOlwiMjQ1LDI0NSwyMjBcIixiaXNxdWU6XCIyNTUsMjI4LDE5NlwiLGJsYWNrOlwiMCwwLDBcIixibGFuY2hlZGFsbW9uZDpcIjI1NSwyMzUsMjA1XCIsYmx1ZXZpb2xldDpcIjEzOCw0MywyMjZcIixibHVlOlwiMCwwLDI1NVwiLGJyb3duOlwiMTY1LDQyLDQyXCIsYnVybHl3b29kOlwiMjIyLDE4NCwxMzVcIixjYWRldGJsdWU6XCI5NSwxNTgsMTYwXCIsY2hhcnRyZXVzZTpcIjEyNywyNTUsMFwiLGNob2NvbGF0ZTpcIjIxMCwxMDUsMzBcIixjb3JhbDpcIjI1NSwxMjcsODBcIixjb3JuZmxvd2VyYmx1ZTpcIjEwMCwxNDksMjM3XCIsY29ybnNpbGs6XCIyNTUsMjQ4LDIyMFwiLGNyaW1zb246XCIyMjAsMjAsNjBcIixjeWFuOlwiMCwyNTUsMjU1XCIsZGFya2JsdWU6XCIwLDAsMTM5XCIsZGFya2N5YW46XCIwLDEzOSwxMzlcIixkYXJrZ29sZGVucm9kOlwiMTg0LDEzNCwxMVwiLGRhcmtncmF5OlwiMTY5LDE2OSwxNjlcIixkYXJrZ3JleTpcIjE2OSwxNjksMTY5XCIsZGFya2dyZWVuOlwiMCwxMDAsMFwiLGRhcmtraGFraTpcIjE4OSwxODMsMTA3XCIsZGFya21hZ2VudGE6XCIxMzksMCwxMzlcIixkYXJrb2xpdmVncmVlbjpcIjg1LDEwNyw0N1wiLGRhcmtvcmFuZ2U6XCIyNTUsMTQwLDBcIixkYXJrb3JjaGlkOlwiMTUzLDUwLDIwNFwiLGRhcmtyZWQ6XCIxMzksMCwwXCIsZGFya3NhbG1vbjpcIjIzMywxNTAsMTIyXCIsZGFya3NlYWdyZWVuOlwiMTQzLDE4OCwxNDNcIixkYXJrc2xhdGVibHVlOlwiNzIsNjEsMTM5XCIsZGFya3NsYXRlZ3JheTpcIjQ3LDc5LDc5XCIsZGFya3R1cnF1b2lzZTpcIjAsMjA2LDIwOVwiLGRhcmt2aW9sZXQ6XCIxNDgsMCwyMTFcIixkZWVwcGluazpcIjI1NSwyMCwxNDdcIixkZWVwc2t5Ymx1ZTpcIjAsMTkxLDI1NVwiLGRpbWdyYXk6XCIxMDUsMTA1LDEwNVwiLGRpbWdyZXk6XCIxMDUsMTA1LDEwNVwiLGRvZGdlcmJsdWU6XCIzMCwxNDQsMjU1XCIsZmlyZWJyaWNrOlwiMTc4LDM0LDM0XCIsZmxvcmFsd2hpdGU6XCIyNTUsMjUwLDI0MFwiLGZvcmVzdGdyZWVuOlwiMzQsMTM5LDM0XCIsZnVjaHNpYTpcIjI1NSwwLDI1NVwiLGdhaW5zYm9ybzpcIjIyMCwyMjAsMjIwXCIsZ2hvc3R3aGl0ZTpcIjI0OCwyNDgsMjU1XCIsZ29sZDpcIjI1NSwyMTUsMFwiLGdvbGRlbnJvZDpcIjIxOCwxNjUsMzJcIixncmF5OlwiMTI4LDEyOCwxMjhcIixncmV5OlwiMTI4LDEyOCwxMjhcIixncmVlbnllbGxvdzpcIjE3MywyNTUsNDdcIixncmVlbjpcIjAsMTI4LDBcIixob25leWRldzpcIjI0MCwyNTUsMjQwXCIsaG90cGluazpcIjI1NSwxMDUsMTgwXCIsaW5kaWFucmVkOlwiMjA1LDkyLDkyXCIsaW5kaWdvOlwiNzUsMCwxMzBcIixpdm9yeTpcIjI1NSwyNTUsMjQwXCIsa2hha2k6XCIyNDAsMjMwLDE0MFwiLGxhdmVuZGVyYmx1c2g6XCIyNTUsMjQwLDI0NVwiLGxhdmVuZGVyOlwiMjMwLDIzMCwyNTBcIixsYXduZ3JlZW46XCIxMjQsMjUyLDBcIixsZW1vbmNoaWZmb246XCIyNTUsMjUwLDIwNVwiLGxpZ2h0Ymx1ZTpcIjE3MywyMTYsMjMwXCIsbGlnaHRjb3JhbDpcIjI0MCwxMjgsMTI4XCIsbGlnaHRjeWFuOlwiMjI0LDI1NSwyNTVcIixsaWdodGdvbGRlbnJvZHllbGxvdzpcIjI1MCwyNTAsMjEwXCIsbGlnaHRncmF5OlwiMjExLDIxMSwyMTFcIixsaWdodGdyZXk6XCIyMTEsMjExLDIxMVwiLGxpZ2h0Z3JlZW46XCIxNDQsMjM4LDE0NFwiLGxpZ2h0cGluazpcIjI1NSwxODIsMTkzXCIsbGlnaHRzYWxtb246XCIyNTUsMTYwLDEyMlwiLGxpZ2h0c2VhZ3JlZW46XCIzMiwxNzgsMTcwXCIsbGlnaHRza3libHVlOlwiMTM1LDIwNiwyNTBcIixsaWdodHNsYXRlZ3JheTpcIjExOSwxMzYsMTUzXCIsbGlnaHRzdGVlbGJsdWU6XCIxNzYsMTk2LDIyMlwiLGxpZ2h0eWVsbG93OlwiMjU1LDI1NSwyMjRcIixsaW1lZ3JlZW46XCI1MCwyMDUsNTBcIixsaW1lOlwiMCwyNTUsMFwiLGxpbmVuOlwiMjUwLDI0MCwyMzBcIixtYWdlbnRhOlwiMjU1LDAsMjU1XCIsbWFyb29uOlwiMTI4LDAsMFwiLG1lZGl1bWFxdWFtYXJpbmU6XCIxMDIsMjA1LDE3MFwiLG1lZGl1bWJsdWU6XCIwLDAsMjA1XCIsbWVkaXVtb3JjaGlkOlwiMTg2LDg1LDIxMVwiLG1lZGl1bXB1cnBsZTpcIjE0NywxMTIsMjE5XCIsbWVkaXVtc2VhZ3JlZW46XCI2MCwxNzksMTEzXCIsbWVkaXVtc2xhdGVibHVlOlwiMTIzLDEwNCwyMzhcIixtZWRpdW1zcHJpbmdncmVlbjpcIjAsMjUwLDE1NFwiLG1lZGl1bXR1cnF1b2lzZTpcIjcyLDIwOSwyMDRcIixtZWRpdW12aW9sZXRyZWQ6XCIxOTksMjEsMTMzXCIsbWlkbmlnaHRibHVlOlwiMjUsMjUsMTEyXCIsbWludGNyZWFtOlwiMjQ1LDI1NSwyNTBcIixtaXN0eXJvc2U6XCIyNTUsMjI4LDIyNVwiLG1vY2Nhc2luOlwiMjU1LDIyOCwxODFcIixuYXZham93aGl0ZTpcIjI1NSwyMjIsMTczXCIsbmF2eTpcIjAsMCwxMjhcIixvbGRsYWNlOlwiMjUzLDI0NSwyMzBcIixvbGl2ZWRyYWI6XCIxMDcsMTQyLDM1XCIsb2xpdmU6XCIxMjgsMTI4LDBcIixvcmFuZ2VyZWQ6XCIyNTUsNjksMFwiLG9yYW5nZTpcIjI1NSwxNjUsMFwiLG9yY2hpZDpcIjIxOCwxMTIsMjE0XCIscGFsZWdvbGRlbnJvZDpcIjIzOCwyMzIsMTcwXCIscGFsZWdyZWVuOlwiMTUyLDI1MSwxNTJcIixwYWxldHVycXVvaXNlOlwiMTc1LDIzOCwyMzhcIixwYWxldmlvbGV0cmVkOlwiMjE5LDExMiwxNDdcIixwYXBheWF3aGlwOlwiMjU1LDIzOSwyMTNcIixwZWFjaHB1ZmY6XCIyNTUsMjE4LDE4NVwiLHBlcnU6XCIyMDUsMTMzLDYzXCIscGluazpcIjI1NSwxOTIsMjAzXCIscGx1bTpcIjIyMSwxNjAsMjIxXCIscG93ZGVyYmx1ZTpcIjE3NiwyMjQsMjMwXCIscHVycGxlOlwiMTI4LDAsMTI4XCIscmVkOlwiMjU1LDAsMFwiLHJvc3licm93bjpcIjE4OCwxNDMsMTQzXCIscm95YWxibHVlOlwiNjUsMTA1LDIyNVwiLHNhZGRsZWJyb3duOlwiMTM5LDY5LDE5XCIsc2FsbW9uOlwiMjUwLDEyOCwxMTRcIixzYW5keWJyb3duOlwiMjQ0LDE2NCw5NlwiLHNlYWdyZWVuOlwiNDYsMTM5LDg3XCIsc2Vhc2hlbGw6XCIyNTUsMjQ1LDIzOFwiLHNpZW5uYTpcIjE2MCw4Miw0NVwiLHNpbHZlcjpcIjE5MiwxOTIsMTkyXCIsc2t5Ymx1ZTpcIjEzNSwyMDYsMjM1XCIsc2xhdGVibHVlOlwiMTA2LDkwLDIwNVwiLHNsYXRlZ3JheTpcIjExMiwxMjgsMTQ0XCIsc25vdzpcIjI1NSwyNTAsMjUwXCIsc3ByaW5nZ3JlZW46XCIwLDI1NSwxMjdcIixzdGVlbGJsdWU6XCI3MCwxMzAsMTgwXCIsdGFuOlwiMjEwLDE4MCwxNDBcIix0ZWFsOlwiMCwxMjgsMTI4XCIsdGhpc3RsZTpcIjIxNiwxOTEsMjE2XCIsdG9tYXRvOlwiMjU1LDk5LDcxXCIsdHVycXVvaXNlOlwiNjQsMjI0LDIwOFwiLHZpb2xldDpcIjIzOCwxMzAsMjM4XCIsd2hlYXQ6XCIyNDUsMjIyLDE3OVwiLHdoaXRlc21va2U6XCIyNDUsMjQ1LDI0NVwiLHdoaXRlOlwiMjU1LDI1NSwyNTVcIix5ZWxsb3dncmVlbjpcIjE1NCwyMDUsNTBcIix5ZWxsb3c6XCIyNTUsMjU1LDBcIn19LEhvb2tzOnt0ZW1wbGF0ZXM6e3RleHRTaGFkb3c6W1wiQ29sb3IgWCBZIEJsdXJcIixcImJsYWNrIDBweCAwcHggMHB4XCJdLGJveFNoYWRvdzpbXCJDb2xvciBYIFkgQmx1ciBTcHJlYWRcIixcImJsYWNrIDBweCAwcHggMHB4IDBweFwiXSxjbGlwOltcIlRvcCBSaWdodCBCb3R0b20gTGVmdFwiLFwiMHB4IDBweCAwcHggMHB4XCJdLGJhY2tncm91bmRQb3NpdGlvbjpbXCJYIFlcIixcIjAlIDAlXCJdLHRyYW5zZm9ybU9yaWdpbjpbXCJYIFkgWlwiLFwiNTAlIDUwJSAwcHhcIl0scGVyc3BlY3RpdmVPcmlnaW46W1wiWCBZXCIsXCI1MCUgNTAlXCJdfSxyZWdpc3RlcmVkOnt9LHJlZ2lzdGVyOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7YTxBLkxpc3RzLmNvbG9ycy5sZW5ndGg7YSsrKXt2YXIgYj1cImNvbG9yXCI9PT1BLkxpc3RzLmNvbG9yc1thXT9cIjAgMCAwIDFcIjpcIjI1NSAyNTUgMjU1IDFcIjtBLkhvb2tzLnRlbXBsYXRlc1tBLkxpc3RzLmNvbG9yc1thXV09W1wiUmVkIEdyZWVuIEJsdWUgQWxwaGFcIixiXX12YXIgYyxkLGU7aWYocClmb3IoYyBpbiBBLkhvb2tzLnRlbXBsYXRlcylpZihBLkhvb2tzLnRlbXBsYXRlcy5oYXNPd25Qcm9wZXJ0eShjKSl7ZD1BLkhvb2tzLnRlbXBsYXRlc1tjXSxlPWRbMF0uc3BsaXQoXCIgXCIpO3ZhciBmPWRbMV0ubWF0Y2goQS5SZWdFeC52YWx1ZVNwbGl0KTtcIkNvbG9yXCI9PT1lWzBdJiYoZS5wdXNoKGUuc2hpZnQoKSksZi5wdXNoKGYuc2hpZnQoKSksQS5Ib29rcy50ZW1wbGF0ZXNbY109W2Uuam9pbihcIiBcIiksZi5qb2luKFwiIFwiKV0pfWZvcihjIGluIEEuSG9va3MudGVtcGxhdGVzKWlmKEEuSG9va3MudGVtcGxhdGVzLmhhc093blByb3BlcnR5KGMpKXtkPUEuSG9va3MudGVtcGxhdGVzW2NdLGU9ZFswXS5zcGxpdChcIiBcIik7Zm9yKHZhciBnIGluIGUpaWYoZS5oYXNPd25Qcm9wZXJ0eShnKSl7dmFyIGg9YytlW2ddLGk9ZztBLkhvb2tzLnJlZ2lzdGVyZWRbaF09W2MsaV19fX0sZ2V0Um9vdDpmdW5jdGlvbihhKXt2YXIgYj1BLkhvb2tzLnJlZ2lzdGVyZWRbYV07cmV0dXJuIGI/YlswXTphfSxnZXRVbml0OmZ1bmN0aW9uKGEsYil7dmFyIGM9KGEuc3Vic3RyKGJ8fDAsNSkubWF0Y2goL15bYS16JV0rLyl8fFtdKVswXXx8XCJcIjtyZXR1cm4gYyYmdChBLkxpc3RzLnVuaXRzLGMpP2M6XCJcIn0sZml4Q29sb3JzOmZ1bmN0aW9uKGEpe3JldHVybiBhLnJlcGxhY2UoLyhyZ2JhP1xcKFxccyopPyhcXGJbYS16XStcXGIpL2csZnVuY3Rpb24oYSxiLGMpe3JldHVybiBBLkxpc3RzLmNvbG9yTmFtZXMuaGFzT3duUHJvcGVydHkoYyk/KGI/YjpcInJnYmEoXCIpK0EuTGlzdHMuY29sb3JOYW1lc1tjXSsoYj9cIlwiOlwiLDEpXCIpOmIrY30pfSxjbGVhblJvb3RQcm9wZXJ0eVZhbHVlOmZ1bmN0aW9uKGEsYil7cmV0dXJuIEEuUmVnRXgudmFsdWVVbndyYXAudGVzdChiKSYmKGI9Yi5tYXRjaChBLlJlZ0V4LnZhbHVlVW53cmFwKVsxXSksQS5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUoYikmJihiPUEuSG9va3MudGVtcGxhdGVzW2FdWzFdKSxifSxleHRyYWN0VmFsdWU6ZnVuY3Rpb24oYSxiKXt2YXIgYz1BLkhvb2tzLnJlZ2lzdGVyZWRbYV07aWYoYyl7dmFyIGQ9Y1swXSxlPWNbMV07cmV0dXJuIGI9QS5Ib29rcy5jbGVhblJvb3RQcm9wZXJ0eVZhbHVlKGQsYiksYi50b1N0cmluZygpLm1hdGNoKEEuUmVnRXgudmFsdWVTcGxpdClbZV19cmV0dXJuIGJ9LGluamVjdFZhbHVlOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1BLkhvb2tzLnJlZ2lzdGVyZWRbYV07aWYoZCl7dmFyIGUsZj1kWzBdLGc9ZFsxXTtyZXR1cm4gYz1BLkhvb2tzLmNsZWFuUm9vdFByb3BlcnR5VmFsdWUoZixjKSxlPWMudG9TdHJpbmcoKS5tYXRjaChBLlJlZ0V4LnZhbHVlU3BsaXQpLGVbZ109YixlLmpvaW4oXCIgXCIpfXJldHVybiBjfX0sTm9ybWFsaXphdGlvbnM6e3JlZ2lzdGVyZWQ6e2NsaXA6ZnVuY3Rpb24oYSxiLGMpe3N3aXRjaChhKXtjYXNlXCJuYW1lXCI6cmV0dXJuXCJjbGlwXCI7Y2FzZVwiZXh0cmFjdFwiOnZhciBkO3JldHVybiBBLlJlZ0V4LndyYXBwZWRWYWx1ZUFscmVhZHlFeHRyYWN0ZWQudGVzdChjKT9kPWM6KGQ9Yy50b1N0cmluZygpLm1hdGNoKEEuUmVnRXgudmFsdWVVbndyYXApLGQ9ZD9kWzFdLnJlcGxhY2UoLywoXFxzKyk/L2csXCIgXCIpOmMpLGQ7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuXCJyZWN0KFwiK2MrXCIpXCJ9fSxibHVyOmZ1bmN0aW9uKGEsYixjKXtzd2l0Y2goYSl7Y2FzZVwibmFtZVwiOnJldHVybiB5LlN0YXRlLmlzRmlyZWZveD9cImZpbHRlclwiOlwiLXdlYmtpdC1maWx0ZXJcIjtjYXNlXCJleHRyYWN0XCI6dmFyIGQ9cGFyc2VGbG9hdChjKTtpZighZCYmMCE9PWQpe3ZhciBlPWMudG9TdHJpbmcoKS5tYXRjaCgvYmx1clxcKChbMC05XStbQS16XSspXFwpL2kpO2Q9ZT9lWzFdOjB9cmV0dXJuIGQ7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuIHBhcnNlRmxvYXQoYyk/XCJibHVyKFwiK2MrXCIpXCI6XCJub25lXCJ9fSxvcGFjaXR5OmZ1bmN0aW9uKGEsYixjKXtpZihwPD04KXN3aXRjaChhKXtjYXNlXCJuYW1lXCI6cmV0dXJuXCJmaWx0ZXJcIjtjYXNlXCJleHRyYWN0XCI6dmFyIGQ9Yy50b1N0cmluZygpLm1hdGNoKC9hbHBoYVxcKG9wYWNpdHk9KC4qKVxcKS9pKTtyZXR1cm4gYz1kP2RbMV0vMTAwOjE7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuIGIuc3R5bGUuem9vbT0xLHBhcnNlRmxvYXQoYyk+PTE/XCJcIjpcImFscGhhKG9wYWNpdHk9XCIrcGFyc2VJbnQoMTAwKnBhcnNlRmxvYXQoYyksMTApK1wiKVwifWVsc2Ugc3dpdGNoKGEpe2Nhc2VcIm5hbWVcIjpyZXR1cm5cIm9wYWNpdHlcIjtjYXNlXCJleHRyYWN0XCI6cmV0dXJuIGM7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuIGN9fX0scmVnaXN0ZXI6ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEsYixjKXtpZihcImJvcmRlci1ib3hcIj09PUEuZ2V0UHJvcGVydHlWYWx1ZShiLFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKT09PShjfHwhMSkpe3ZhciBkLGUsZj0wLGc9XCJ3aWR0aFwiPT09YT9bXCJMZWZ0XCIsXCJSaWdodFwiXTpbXCJUb3BcIixcIkJvdHRvbVwiXSxoPVtcInBhZGRpbmdcIitnWzBdLFwicGFkZGluZ1wiK2dbMV0sXCJib3JkZXJcIitnWzBdK1wiV2lkdGhcIixcImJvcmRlclwiK2dbMV0rXCJXaWR0aFwiXTtmb3IoZD0wO2Q8aC5sZW5ndGg7ZCsrKWU9cGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYixoW2RdKSksaXNOYU4oZSl8fChmKz1lKTtyZXR1cm4gYz8tZjpmfXJldHVybiAwfWZ1bmN0aW9uIGIoYixjKXtyZXR1cm4gZnVuY3Rpb24oZCxlLGYpe3N3aXRjaChkKXtjYXNlXCJuYW1lXCI6cmV0dXJuIGI7Y2FzZVwiZXh0cmFjdFwiOnJldHVybiBwYXJzZUZsb2F0KGYpK2EoYixlLGMpO2Nhc2VcImluamVjdFwiOnJldHVybiBwYXJzZUZsb2F0KGYpLWEoYixlLGMpK1wicHhcIn19fXAmJiEocD45KXx8eS5TdGF0ZS5pc0dpbmdlcmJyZWFkfHwoQS5MaXN0cy50cmFuc2Zvcm1zQmFzZT1BLkxpc3RzLnRyYW5zZm9ybXNCYXNlLmNvbmNhdChBLkxpc3RzLnRyYW5zZm9ybXMzRCkpO2Zvcih2YXIgYz0wO2M8QS5MaXN0cy50cmFuc2Zvcm1zQmFzZS5sZW5ndGg7YysrKSFmdW5jdGlvbigpe3ZhciBhPUEuTGlzdHMudHJhbnNmb3Jtc0Jhc2VbY107QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2FdPWZ1bmN0aW9uKGIsYyxlKXtzd2l0Y2goYil7Y2FzZVwibmFtZVwiOnJldHVyblwidHJhbnNmb3JtXCI7Y2FzZVwiZXh0cmFjdFwiOnJldHVybiBnKGMpPT09ZHx8ZyhjKS50cmFuc2Zvcm1DYWNoZVthXT09PWQ/L15zY2FsZS9pLnRlc3QoYSk/MTowOmcoYykudHJhbnNmb3JtQ2FjaGVbYV0ucmVwbGFjZSgvWygpXS9nLFwiXCIpO2Nhc2VcImluamVjdFwiOnZhciBmPSExO3N3aXRjaChhLnN1YnN0cigwLGEubGVuZ3RoLTEpKXtjYXNlXCJ0cmFuc2xhdGVcIjpmPSEvKCV8cHh8ZW18cmVtfHZ3fHZofFxcZCkkL2kudGVzdChlKTticmVhaztjYXNlXCJzY2FsXCI6Y2FzZVwic2NhbGVcIjp5LlN0YXRlLmlzQW5kcm9pZCYmZyhjKS50cmFuc2Zvcm1DYWNoZVthXT09PWQmJmU8MSYmKGU9MSksZj0hLyhcXGQpJC9pLnRlc3QoZSk7YnJlYWs7Y2FzZVwic2tld1wiOmY9IS8oZGVnfFxcZCkkL2kudGVzdChlKTticmVhaztjYXNlXCJyb3RhdGVcIjpmPSEvKGRlZ3xcXGQpJC9pLnRlc3QoZSl9cmV0dXJuIGZ8fChnKGMpLnRyYW5zZm9ybUNhY2hlW2FdPVwiKFwiK2UrXCIpXCIpLGcoYykudHJhbnNmb3JtQ2FjaGVbYV19fX0oKTtmb3IodmFyIGU9MDtlPEEuTGlzdHMuY29sb3JzLmxlbmd0aDtlKyspIWZ1bmN0aW9uKCl7dmFyIGE9QS5MaXN0cy5jb2xvcnNbZV07QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2FdPWZ1bmN0aW9uKGIsYyxlKXtzd2l0Y2goYil7Y2FzZVwibmFtZVwiOnJldHVybiBhO2Nhc2VcImV4dHJhY3RcIjp2YXIgZjtpZihBLlJlZ0V4LndyYXBwZWRWYWx1ZUFscmVhZHlFeHRyYWN0ZWQudGVzdChlKSlmPWU7ZWxzZXt2YXIgZyxoPXtibGFjazpcInJnYigwLCAwLCAwKVwiLGJsdWU6XCJyZ2IoMCwgMCwgMjU1KVwiLGdyYXk6XCJyZ2IoMTI4LCAxMjgsIDEyOClcIixncmVlbjpcInJnYigwLCAxMjgsIDApXCIscmVkOlwicmdiKDI1NSwgMCwgMClcIix3aGl0ZTpcInJnYigyNTUsIDI1NSwgMjU1KVwifTsvXltBLXpdKyQvaS50ZXN0KGUpP2c9aFtlXSE9PWQ/aFtlXTpoLmJsYWNrOkEuUmVnRXguaXNIZXgudGVzdChlKT9nPVwicmdiKFwiK0EuVmFsdWVzLmhleFRvUmdiKGUpLmpvaW4oXCIgXCIpK1wiKVwiOi9ecmdiYT9cXCgvaS50ZXN0KGUpfHwoZz1oLmJsYWNrKSxmPShnfHxlKS50b1N0cmluZygpLm1hdGNoKEEuUmVnRXgudmFsdWVVbndyYXApWzFdLnJlcGxhY2UoLywoXFxzKyk/L2csXCIgXCIpfXJldHVybighcHx8cD44KSYmMz09PWYuc3BsaXQoXCIgXCIpLmxlbmd0aCYmKGYrPVwiIDFcIiksZjtjYXNlXCJpbmplY3RcIjpyZXR1cm4vXnJnYi8udGVzdChlKT9lOihwPD04PzQ9PT1lLnNwbGl0KFwiIFwiKS5sZW5ndGgmJihlPWUuc3BsaXQoL1xccysvKS5zbGljZSgwLDMpLmpvaW4oXCIgXCIpKTozPT09ZS5zcGxpdChcIiBcIikubGVuZ3RoJiYoZSs9XCIgMVwiKSwocDw9OD9cInJnYlwiOlwicmdiYVwiKStcIihcIitlLnJlcGxhY2UoL1xccysvZyxcIixcIikucmVwbGFjZSgvXFwuKFxcZCkrKD89LCkvZyxcIlwiKStcIilcIil9fX0oKTtBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQuaW5uZXJXaWR0aD1iKFwid2lkdGhcIiwhMCksQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkLmlubmVySGVpZ2h0PWIoXCJoZWlnaHRcIiwhMCksQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkLm91dGVyV2lkdGg9YihcIndpZHRoXCIpLEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5vdXRlckhlaWdodD1iKFwiaGVpZ2h0XCIpfX0sTmFtZXM6e2NhbWVsQ2FzZTpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKC8tKFxcdykvZyxmdW5jdGlvbihhLGIpe3JldHVybiBiLnRvVXBwZXJDYXNlKCl9KX0sU1ZHQXR0cmlidXRlOmZ1bmN0aW9uKGEpe3ZhciBiPVwid2lkdGh8aGVpZ2h0fHh8eXxjeHxjeXxyfHJ4fHJ5fHgxfHgyfHkxfHkyXCI7cmV0dXJuKHB8fHkuU3RhdGUuaXNBbmRyb2lkJiYheS5TdGF0ZS5pc0Nocm9tZSkmJihiKz1cInx0cmFuc2Zvcm1cIiksbmV3IFJlZ0V4cChcIl4oXCIrYitcIikkXCIsXCJpXCIpLnRlc3QoYSl9LHByZWZpeENoZWNrOmZ1bmN0aW9uKGEpe2lmKHkuU3RhdGUucHJlZml4TWF0Y2hlc1thXSlyZXR1cm5beS5TdGF0ZS5wcmVmaXhNYXRjaGVzW2FdLCEwXTtmb3IodmFyIGI9W1wiXCIsXCJXZWJraXRcIixcIk1velwiLFwibXNcIixcIk9cIl0sYz0wLGQ9Yi5sZW5ndGg7YzxkO2MrKyl7dmFyIGU7aWYoZT0wPT09Yz9hOmJbY10rYS5yZXBsYWNlKC9eXFx3LyxmdW5jdGlvbihhKXtyZXR1cm4gYS50b1VwcGVyQ2FzZSgpfSksdS5pc1N0cmluZyh5LlN0YXRlLnByZWZpeEVsZW1lbnQuc3R5bGVbZV0pKXJldHVybiB5LlN0YXRlLnByZWZpeE1hdGNoZXNbYV09ZSxbZSwhMF19cmV0dXJuW2EsITFdfX0sVmFsdWVzOntoZXhUb1JnYjpmdW5jdGlvbihhKXt2YXIgYixjPS9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2k7cmV0dXJuIGE9YS5yZXBsYWNlKC9eIz8oW2EtZlxcZF0pKFthLWZcXGRdKShbYS1mXFxkXSkkL2ksZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuIGIrYitjK2MrZCtkfSksYj1jLmV4ZWMoYSksYj9bcGFyc2VJbnQoYlsxXSwxNikscGFyc2VJbnQoYlsyXSwxNikscGFyc2VJbnQoYlszXSwxNildOlswLDAsMF19LGlzQ1NTTnVsbFZhbHVlOmZ1bmN0aW9uKGEpe3JldHVybiFhfHwvXihub25lfGF1dG98dHJhbnNwYXJlbnR8KHJnYmFcXCgwLCA/MCwgPzAsID8wXFwpKSkkL2kudGVzdChhKX0sZ2V0VW5pdFR5cGU6ZnVuY3Rpb24oYSl7cmV0dXJuL14ocm90YXRlfHNrZXcpL2kudGVzdChhKT9cImRlZ1wiOi8oXihzY2FsZXxzY2FsZVh8c2NhbGVZfHNjYWxlWnxhbHBoYXxmbGV4R3Jvd3xmbGV4SGVpZ2h0fHpJbmRleHxmb250V2VpZ2h0KSQpfCgob3BhY2l0eXxyZWR8Z3JlZW58Ymx1ZXxhbHBoYSkkKS9pLnRlc3QoYSk/XCJcIjpcInB4XCJ9LGdldERpc3BsYXlUeXBlOmZ1bmN0aW9uKGEpe3ZhciBiPWEmJmEudGFnTmFtZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7cmV0dXJuL14oYnxiaWd8aXxzbWFsbHx0dHxhYmJyfGFjcm9ueW18Y2l0ZXxjb2RlfGRmbnxlbXxrYmR8c3Ryb25nfHNhbXB8dmFyfGF8YmRvfGJyfGltZ3xtYXB8b2JqZWN0fHF8c2NyaXB0fHNwYW58c3VifHN1cHxidXR0b258aW5wdXR8bGFiZWx8c2VsZWN0fHRleHRhcmVhKSQvaS50ZXN0KGIpP1wiaW5saW5lXCI6L14obGkpJC9pLnRlc3QoYik/XCJsaXN0LWl0ZW1cIjovXih0cikkL2kudGVzdChiKT9cInRhYmxlLXJvd1wiOi9eKHRhYmxlKSQvaS50ZXN0KGIpP1widGFibGVcIjovXih0Ym9keSkkL2kudGVzdChiKT9cInRhYmxlLXJvdy1ncm91cFwiOlwiYmxvY2tcIn0sYWRkQ2xhc3M6ZnVuY3Rpb24oYSxiKXtpZihhKWlmKGEuY2xhc3NMaXN0KWEuY2xhc3NMaXN0LmFkZChiKTtlbHNlIGlmKHUuaXNTdHJpbmcoYS5jbGFzc05hbWUpKWEuY2xhc3NOYW1lKz0oYS5jbGFzc05hbWUubGVuZ3RoP1wiIFwiOlwiXCIpK2I7ZWxzZXt2YXIgYz1hLmdldEF0dHJpYnV0ZShwPD03P1wiY2xhc3NOYW1lXCI6XCJjbGFzc1wiKXx8XCJcIjthLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsYysoYz9cIiBcIjpcIlwiKStiKX19LHJlbW92ZUNsYXNzOmZ1bmN0aW9uKGEsYil7aWYoYSlpZihhLmNsYXNzTGlzdClhLmNsYXNzTGlzdC5yZW1vdmUoYik7ZWxzZSBpZih1LmlzU3RyaW5nKGEuY2xhc3NOYW1lKSlhLmNsYXNzTmFtZT1hLmNsYXNzTmFtZS50b1N0cmluZygpLnJlcGxhY2UobmV3IFJlZ0V4cChcIihefFxcXFxzKVwiK2Iuc3BsaXQoXCIgXCIpLmpvaW4oXCJ8XCIpK1wiKFxcXFxzfCQpXCIsXCJnaVwiKSxcIiBcIik7ZWxzZXt2YXIgYz1hLmdldEF0dHJpYnV0ZShwPD03P1wiY2xhc3NOYW1lXCI6XCJjbGFzc1wiKXx8XCJcIjthLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsYy5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxzKVwiK2Iuc3BsaXQoXCIgXCIpLmpvaW4oXCJ8XCIpK1wiKHN8JClcIixcImdpXCIpLFwiIFwiKSl9fX0sZ2V0UHJvcGVydHlWYWx1ZTpmdW5jdGlvbihhLGMsZSxmKXtmdW5jdGlvbiBoKGEsYyl7dmFyIGU9MDtpZihwPD04KWU9by5jc3MoYSxjKTtlbHNle3ZhciBpPSExOy9eKHdpZHRofGhlaWdodCkkLy50ZXN0KGMpJiYwPT09QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJkaXNwbGF5XCIpJiYoaT0hMCxBLnNldFByb3BlcnR5VmFsdWUoYSxcImRpc3BsYXlcIixBLlZhbHVlcy5nZXREaXNwbGF5VHlwZShhKSkpO3ZhciBqPWZ1bmN0aW9uKCl7aSYmQS5zZXRQcm9wZXJ0eVZhbHVlKGEsXCJkaXNwbGF5XCIsXCJub25lXCIpfTtpZighZil7aWYoXCJoZWlnaHRcIj09PWMmJlwiYm9yZGVyLWJveFwiIT09QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKXt2YXIgaz1hLm9mZnNldEhlaWdodC0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcImJvcmRlclRvcFdpZHRoXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3JkZXJCb3R0b21XaWR0aFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicGFkZGluZ1RvcFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicGFkZGluZ0JvdHRvbVwiKSl8fDApO3JldHVybiBqKCksa31pZihcIndpZHRoXCI9PT1jJiZcImJvcmRlci1ib3hcIiE9PUEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSl7dmFyIGw9YS5vZmZzZXRXaWR0aC0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcImJvcmRlckxlZnRXaWR0aFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm9yZGVyUmlnaHRXaWR0aFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicGFkZGluZ0xlZnRcIikpfHwwKS0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcInBhZGRpbmdSaWdodFwiKSl8fDApO3JldHVybiBqKCksbH19dmFyIG07bT1nKGEpPT09ZD9iLmdldENvbXB1dGVkU3R5bGUoYSxudWxsKTpnKGEpLmNvbXB1dGVkU3R5bGU/ZyhhKS5jb21wdXRlZFN0eWxlOmcoYSkuY29tcHV0ZWRTdHlsZT1iLmdldENvbXB1dGVkU3R5bGUoYSxudWxsKSxcImJvcmRlckNvbG9yXCI9PT1jJiYoYz1cImJvcmRlclRvcENvbG9yXCIpLGU9OT09PXAmJlwiZmlsdGVyXCI9PT1jP20uZ2V0UHJvcGVydHlWYWx1ZShjKTptW2NdLFwiXCIhPT1lJiZudWxsIT09ZXx8KGU9YS5zdHlsZVtjXSksaigpfWlmKFwiYXV0b1wiPT09ZSYmL14odG9wfHJpZ2h0fGJvdHRvbXxsZWZ0KSQvaS50ZXN0KGMpKXt2YXIgbj1oKGEsXCJwb3NpdGlvblwiKTsoXCJmaXhlZFwiPT09bnx8XCJhYnNvbHV0ZVwiPT09biYmL3RvcHxsZWZ0L2kudGVzdChjKSkmJihlPW8oYSkucG9zaXRpb24oKVtjXStcInB4XCIpfXJldHVybiBlfXZhciBpO2lmKEEuSG9va3MucmVnaXN0ZXJlZFtjXSl7dmFyIGo9YyxrPUEuSG9va3MuZ2V0Um9vdChqKTtlPT09ZCYmKGU9QS5nZXRQcm9wZXJ0eVZhbHVlKGEsQS5OYW1lcy5wcmVmaXhDaGVjayhrKVswXSkpLEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtrXSYmKGU9QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2tdKFwiZXh0cmFjdFwiLGEsZSkpLGk9QS5Ib29rcy5leHRyYWN0VmFsdWUoaixlKX1lbHNlIGlmKEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXSl7dmFyIGwsbTtsPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcIm5hbWVcIixhKSxcInRyYW5zZm9ybVwiIT09bCYmKG09aChhLEEuTmFtZXMucHJlZml4Q2hlY2sobClbMF0pLEEuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKG0pJiZBLkhvb2tzLnRlbXBsYXRlc1tjXSYmKG09QS5Ib29rcy50ZW1wbGF0ZXNbY11bMV0pKSxpPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcImV4dHJhY3RcIixhLG0pfWlmKCEvXltcXGQtXS8udGVzdChpKSl7dmFyIG49ZyhhKTtpZihuJiZuLmlzU1ZHJiZBLk5hbWVzLlNWR0F0dHJpYnV0ZShjKSlpZigvXihoZWlnaHR8d2lkdGgpJC9pLnRlc3QoYykpdHJ5e2k9YS5nZXRCQm94KClbY119Y2F0Y2gocSl7aT0wfWVsc2UgaT1hLmdldEF0dHJpYnV0ZShjKTtlbHNlIGk9aChhLEEuTmFtZXMucHJlZml4Q2hlY2soYylbMF0pfXJldHVybiBBLlZhbHVlcy5pc0NTU051bGxWYWx1ZShpKSYmKGk9MCkseS5kZWJ1Zz49MiYmY29uc29sZS5sb2coXCJHZXQgXCIrYytcIjogXCIraSksaX0sc2V0UHJvcGVydHlWYWx1ZTpmdW5jdGlvbihhLGMsZCxlLGYpe3ZhciBoPWM7aWYoXCJzY3JvbGxcIj09PWMpZi5jb250YWluZXI/Zi5jb250YWluZXJbXCJzY3JvbGxcIitmLmRpcmVjdGlvbl09ZDpcIkxlZnRcIj09PWYuZGlyZWN0aW9uP2Iuc2Nyb2xsVG8oZCxmLmFsdGVybmF0ZVZhbHVlKTpiLnNjcm9sbFRvKGYuYWx0ZXJuYXRlVmFsdWUsZCk7ZWxzZSBpZihBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10mJlwidHJhbnNmb3JtXCI9PT1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJuYW1lXCIsYSkpQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwiaW5qZWN0XCIsYSxkKSxoPVwidHJhbnNmb3JtXCIsZD1nKGEpLnRyYW5zZm9ybUNhY2hlW2NdO2Vsc2V7aWYoQS5Ib29rcy5yZWdpc3RlcmVkW2NdKXt2YXIgaT1jLGo9QS5Ib29rcy5nZXRSb290KGMpO2U9ZXx8QS5nZXRQcm9wZXJ0eVZhbHVlKGEsaiksZD1BLkhvb2tzLmluamVjdFZhbHVlKGksZCxlKSxjPWp9aWYoQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdJiYoZD1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJpbmplY3RcIixhLGQpLGM9QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwibmFtZVwiLGEpKSxoPUEuTmFtZXMucHJlZml4Q2hlY2soYylbMF0scDw9OCl0cnl7YS5zdHlsZVtoXT1kfWNhdGNoKGwpe3kuZGVidWcmJmNvbnNvbGUubG9nKFwiQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFtcIitkK1wiXSBmb3IgW1wiK2grXCJdXCIpfWVsc2V7dmFyIGs9ZyhhKTtrJiZrLmlzU1ZHJiZBLk5hbWVzLlNWR0F0dHJpYnV0ZShjKT9hLnNldEF0dHJpYnV0ZShjLGQpOmEuc3R5bGVbaF09ZH15LmRlYnVnPj0yJiZjb25zb2xlLmxvZyhcIlNldCBcIitjK1wiIChcIitoK1wiKTogXCIrZCl9cmV0dXJuW2gsZF19LGZsdXNoVHJhbnNmb3JtQ2FjaGU6ZnVuY3Rpb24oYSl7dmFyIGI9XCJcIixjPWcoYSk7aWYoKHB8fHkuU3RhdGUuaXNBbmRyb2lkJiYheS5TdGF0ZS5pc0Nocm9tZSkmJmMmJmMuaXNTVkcpe3ZhciBkPWZ1bmN0aW9uKGIpe3JldHVybiBwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLGIpKX0sZT17dHJhbnNsYXRlOltkKFwidHJhbnNsYXRlWFwiKSxkKFwidHJhbnNsYXRlWVwiKV0sc2tld1g6W2QoXCJza2V3WFwiKV0sc2tld1k6W2QoXCJza2V3WVwiKV0sc2NhbGU6MSE9PWQoXCJzY2FsZVwiKT9bZChcInNjYWxlXCIpLGQoXCJzY2FsZVwiKV06W2QoXCJzY2FsZVhcIiksZChcInNjYWxlWVwiKV0scm90YXRlOltkKFwicm90YXRlWlwiKSwwLDBdfTtvLmVhY2goZyhhKS50cmFuc2Zvcm1DYWNoZSxmdW5jdGlvbihhKXsvXnRyYW5zbGF0ZS9pLnRlc3QoYSk/YT1cInRyYW5zbGF0ZVwiOi9ec2NhbGUvaS50ZXN0KGEpP2E9XCJzY2FsZVwiOi9ecm90YXRlL2kudGVzdChhKSYmKGE9XCJyb3RhdGVcIiksZVthXSYmKGIrPWErXCIoXCIrZVthXS5qb2luKFwiIFwiKStcIikgXCIsZGVsZXRlIGVbYV0pfSl9ZWxzZXt2YXIgZixoO28uZWFjaChnKGEpLnRyYW5zZm9ybUNhY2hlLGZ1bmN0aW9uKGMpe2lmKGY9ZyhhKS50cmFuc2Zvcm1DYWNoZVtjXSxcInRyYW5zZm9ybVBlcnNwZWN0aXZlXCI9PT1jKXJldHVybiBoPWYsITA7OT09PXAmJlwicm90YXRlWlwiPT09YyYmKGM9XCJyb3RhdGVcIiksYis9YytmK1wiIFwifSksaCYmKGI9XCJwZXJzcGVjdGl2ZVwiK2grXCIgXCIrYil9QS5zZXRQcm9wZXJ0eVZhbHVlKGEsXCJ0cmFuc2Zvcm1cIixiKX19O0EuSG9va3MucmVnaXN0ZXIoKSxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyKCkseS5ob29rPWZ1bmN0aW9uKGEsYixjKXt2YXIgZTtyZXR1cm4gYT1mKGEpLG8uZWFjaChhLGZ1bmN0aW9uKGEsZil7aWYoZyhmKT09PWQmJnkuaW5pdChmKSxjPT09ZCllPT09ZCYmKGU9QS5nZXRQcm9wZXJ0eVZhbHVlKGYsYikpO2Vsc2V7dmFyIGg9QS5zZXRQcm9wZXJ0eVZhbHVlKGYsYixjKTtcInRyYW5zZm9ybVwiPT09aFswXSYmeS5DU1MuZmx1c2hUcmFuc2Zvcm1DYWNoZShmKSxlPWh9fSksZX07dmFyIEI9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKCl7cmV0dXJuIGs/ei5wcm9taXNlfHxudWxsOnB9ZnVuY3Rpb24gZShhLGUpe2Z1bmN0aW9uIGYoZil7dmFyIGssbjtpZihpLmJlZ2luJiYwPT09RCl0cnl7aS5iZWdpbi5jYWxsKHIscil9Y2F0Y2goVil7c2V0VGltZW91dChmdW5jdGlvbigpe3Rocm93IFZ9LDEpfWlmKFwic2Nyb2xsXCI9PT1HKXt2YXIgcCxxLHcseD0vXngkL2kudGVzdChpLmF4aXMpP1wiTGVmdFwiOlwiVG9wXCIsQj1wYXJzZUZsb2F0KGkub2Zmc2V0KXx8MDtpLmNvbnRhaW5lcj91LmlzV3JhcHBlZChpLmNvbnRhaW5lcil8fHUuaXNOb2RlKGkuY29udGFpbmVyKT8oaS5jb250YWluZXI9aS5jb250YWluZXJbMF18fGkuY29udGFpbmVyLHA9aS5jb250YWluZXJbXCJzY3JvbGxcIit4XSx3PXArbyhhKS5wb3NpdGlvbigpW3gudG9Mb3dlckNhc2UoKV0rQik6aS5jb250YWluZXI9bnVsbDoocD15LlN0YXRlLnNjcm9sbEFuY2hvclt5LlN0YXRlW1wic2Nyb2xsUHJvcGVydHlcIit4XV0scT15LlN0YXRlLnNjcm9sbEFuY2hvclt5LlN0YXRlW1wic2Nyb2xsUHJvcGVydHlcIisoXCJMZWZ0XCI9PT14P1wiVG9wXCI6XCJMZWZ0XCIpXV0sdz1vKGEpLm9mZnNldCgpW3gudG9Mb3dlckNhc2UoKV0rQiksaj17c2Nyb2xsOntyb290UHJvcGVydHlWYWx1ZTohMSxzdGFydFZhbHVlOnAsY3VycmVudFZhbHVlOnAsZW5kVmFsdWU6dyx1bml0VHlwZTpcIlwiLGVhc2luZzppLmVhc2luZyxzY3JvbGxEYXRhOntjb250YWluZXI6aS5jb250YWluZXIsZGlyZWN0aW9uOngsYWx0ZXJuYXRlVmFsdWU6cX19LGVsZW1lbnQ6YX0seS5kZWJ1ZyYmY29uc29sZS5sb2coXCJ0d2VlbnNDb250YWluZXIgKHNjcm9sbCk6IFwiLGouc2Nyb2xsLGEpfWVsc2UgaWYoXCJyZXZlcnNlXCI9PT1HKXtpZighKGs9ZyhhKSkpcmV0dXJuO2lmKCFrLnR3ZWVuc0NvbnRhaW5lcilyZXR1cm4gdm9pZCBvLmRlcXVldWUoYSxpLnF1ZXVlKTtcIm5vbmVcIj09PWsub3B0cy5kaXNwbGF5JiYoay5vcHRzLmRpc3BsYXk9XCJhdXRvXCIpLFwiaGlkZGVuXCI9PT1rLm9wdHMudmlzaWJpbGl0eSYmKGsub3B0cy52aXNpYmlsaXR5PVwidmlzaWJsZVwiKSxrLm9wdHMubG9vcD0hMSxrLm9wdHMuYmVnaW49bnVsbCxrLm9wdHMuY29tcGxldGU9bnVsbCx2LmVhc2luZ3x8ZGVsZXRlIGkuZWFzaW5nLHYuZHVyYXRpb258fGRlbGV0ZSBpLmR1cmF0aW9uLGk9by5leHRlbmQoe30say5vcHRzLGkpLG49by5leHRlbmQoITAse30saz9rLnR3ZWVuc0NvbnRhaW5lcjpudWxsKTtmb3IodmFyIEUgaW4gbilpZihuLmhhc093blByb3BlcnR5KEUpJiZcImVsZW1lbnRcIiE9PUUpe3ZhciBGPW5bRV0uc3RhcnRWYWx1ZTtuW0VdLnN0YXJ0VmFsdWU9bltFXS5jdXJyZW50VmFsdWU9bltFXS5lbmRWYWx1ZSxuW0VdLmVuZFZhbHVlPUYsdS5pc0VtcHR5T2JqZWN0KHYpfHwobltFXS5lYXNpbmc9aS5lYXNpbmcpLHkuZGVidWcmJmNvbnNvbGUubG9nKFwicmV2ZXJzZSB0d2VlbnNDb250YWluZXIgKFwiK0UrXCIpOiBcIitKU09OLnN0cmluZ2lmeShuW0VdKSxhKX1qPW59ZWxzZSBpZihcInN0YXJ0XCI9PT1HKXtrPWcoYSksayYmay50d2VlbnNDb250YWluZXImJmsuaXNBbmltYXRpbmc9PT0hMCYmKG49ay50d2VlbnNDb250YWluZXIpO3ZhciBIPWZ1bmN0aW9uKGUsZil7dmFyIGcsbD1BLkhvb2tzLmdldFJvb3QoZSksbT0hMSxwPWZbMF0scT1mWzFdLHI9ZlsyXVxuO2lmKCEoayYmay5pc1NWR3x8XCJ0d2VlblwiPT09bHx8QS5OYW1lcy5wcmVmaXhDaGVjayhsKVsxXSE9PSExfHxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbbF0hPT1kKSlyZXR1cm4gdm9pZCh5LmRlYnVnJiZjb25zb2xlLmxvZyhcIlNraXBwaW5nIFtcIitsK1wiXSBkdWUgdG8gYSBsYWNrIG9mIGJyb3dzZXIgc3VwcG9ydC5cIikpOyhpLmRpc3BsYXkhPT1kJiZudWxsIT09aS5kaXNwbGF5JiZcIm5vbmVcIiE9PWkuZGlzcGxheXx8aS52aXNpYmlsaXR5IT09ZCYmXCJoaWRkZW5cIiE9PWkudmlzaWJpbGl0eSkmJi9vcGFjaXR5fGZpbHRlci8udGVzdChlKSYmIXImJjAhPT1wJiYocj0wKSxpLl9jYWNoZVZhbHVlcyYmbiYmbltlXT8ocj09PWQmJihyPW5bZV0uZW5kVmFsdWUrbltlXS51bml0VHlwZSksbT1rLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbbF0pOkEuSG9va3MucmVnaXN0ZXJlZFtlXT9yPT09ZD8obT1BLmdldFByb3BlcnR5VmFsdWUoYSxsKSxyPUEuZ2V0UHJvcGVydHlWYWx1ZShhLGUsbSkpOm09QS5Ib29rcy50ZW1wbGF0ZXNbbF1bMV06cj09PWQmJihyPUEuZ2V0UHJvcGVydHlWYWx1ZShhLGUpKTt2YXIgcyx0LHYsdz0hMSx4PWZ1bmN0aW9uKGEsYil7dmFyIGMsZDtyZXR1cm4gZD0oYnx8XCIwXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bJUEtel0rJC8sZnVuY3Rpb24oYSl7cmV0dXJuIGM9YSxcIlwifSksY3x8KGM9QS5WYWx1ZXMuZ2V0VW5pdFR5cGUoYSkpLFtkLGNdfTtpZihyIT09cCYmdS5pc1N0cmluZyhyKSYmdS5pc1N0cmluZyhwKSl7Zz1cIlwiO3ZhciB6PTAsQj0wLEM9W10sRD1bXSxFPTAsRj0wLEc9MDtmb3Iocj1BLkhvb2tzLmZpeENvbG9ycyhyKSxwPUEuSG9va3MuZml4Q29sb3JzKHApO3o8ci5sZW5ndGgmJkI8cC5sZW5ndGg7KXt2YXIgSD1yW3pdLEk9cFtCXTtpZigvW1xcZFxcLi1dLy50ZXN0KEgpJiYvW1xcZFxcLi1dLy50ZXN0KEkpKXtmb3IodmFyIEo9SCxLPUksTD1cIi5cIixOPVwiLlwiOysrejxyLmxlbmd0aDspe2lmKChIPXJbel0pPT09TClMPVwiLi5cIjtlbHNlIGlmKCEvXFxkLy50ZXN0KEgpKWJyZWFrO0orPUh9Zm9yKDsrK0I8cC5sZW5ndGg7KXtpZigoST1wW0JdKT09PU4pTj1cIi4uXCI7ZWxzZSBpZighL1xcZC8udGVzdChJKSlicmVhaztLKz1JfXZhciBPPUEuSG9va3MuZ2V0VW5pdChyLHopLFA9QS5Ib29rcy5nZXRVbml0KHAsQik7aWYoeis9Ty5sZW5ndGgsQis9UC5sZW5ndGgsTz09PVApSj09PUs/Zys9SitPOihnKz1cIntcIitDLmxlbmd0aCsoRj9cIiFcIjpcIlwiKStcIn1cIitPLEMucHVzaChwYXJzZUZsb2F0KEopKSxELnB1c2gocGFyc2VGbG9hdChLKSkpO2Vsc2V7dmFyIFE9cGFyc2VGbG9hdChKKSxSPXBhcnNlRmxvYXQoSyk7Zys9KEU8NT9cImNhbGNcIjpcIlwiKStcIihcIisoUT9cIntcIitDLmxlbmd0aCsoRj9cIiFcIjpcIlwiKStcIn1cIjpcIjBcIikrTytcIiArIFwiKyhSP1wie1wiKyhDLmxlbmd0aCsoUT8xOjApKSsoRj9cIiFcIjpcIlwiKStcIn1cIjpcIjBcIikrUCtcIilcIixRJiYoQy5wdXNoKFEpLEQucHVzaCgwKSksUiYmKEMucHVzaCgwKSxELnB1c2goUikpfX1lbHNle2lmKEghPT1JKXtFPTA7YnJlYWt9Zys9SCx6KyssQisrLDA9PT1FJiZcImNcIj09PUh8fDE9PT1FJiZcImFcIj09PUh8fDI9PT1FJiZcImxcIj09PUh8fDM9PT1FJiZcImNcIj09PUh8fEU+PTQmJlwiKFwiPT09SD9FKys6KEUmJkU8NXx8RT49NCYmXCIpXCI9PT1IJiYtLUU8NSkmJihFPTApLDA9PT1GJiZcInJcIj09PUh8fDE9PT1GJiZcImdcIj09PUh8fDI9PT1GJiZcImJcIj09PUh8fDM9PT1GJiZcImFcIj09PUh8fEY+PTMmJlwiKFwiPT09SD8oMz09PUYmJlwiYVwiPT09SCYmKEc9MSksRisrKTpHJiZcIixcIj09PUg/KytHPjMmJihGPUc9MCk6KEcmJkY8KEc/NTo0KXx8Rj49KEc/NDozKSYmXCIpXCI9PT1IJiYtLUY8KEc/NTo0KSkmJihGPUc9MCl9fXo9PT1yLmxlbmd0aCYmQj09PXAubGVuZ3RofHwoeS5kZWJ1ZyYmY29uc29sZS5lcnJvcignVHJ5aW5nIHRvIHBhdHRlcm4gbWF0Y2ggbWlzLW1hdGNoZWQgc3RyaW5ncyBbXCInK3ArJ1wiLCBcIicrcisnXCJdJyksZz1kKSxnJiYoQy5sZW5ndGg/KHkuZGVidWcmJmNvbnNvbGUubG9nKCdQYXR0ZXJuIGZvdW5kIFwiJytnKydcIiAtPiAnLEMsRCxcIltcIityK1wiLFwiK3ArXCJdXCIpLHI9QyxwPUQsdD12PVwiXCIpOmc9ZCl9Z3x8KHM9eChlLHIpLHI9c1swXSx2PXNbMV0scz14KGUscCkscD1zWzBdLnJlcGxhY2UoL14oWystXFwvKl0pPS8sZnVuY3Rpb24oYSxiKXtyZXR1cm4gdz1iLFwiXCJ9KSx0PXNbMV0scj1wYXJzZUZsb2F0KHIpfHwwLHA9cGFyc2VGbG9hdChwKXx8MCxcIiVcIj09PXQmJigvXihmb250U2l6ZXxsaW5lSGVpZ2h0KSQvLnRlc3QoZSk/KHAvPTEwMCx0PVwiZW1cIik6L15zY2FsZS8udGVzdChlKT8ocC89MTAwLHQ9XCJcIik6LyhSZWR8R3JlZW58Qmx1ZSkkL2kudGVzdChlKSYmKHA9cC8xMDAqMjU1LHQ9XCJcIikpKTtpZigvW1xcLypdLy50ZXN0KHcpKXQ9djtlbHNlIGlmKHYhPT10JiYwIT09cilpZigwPT09cCl0PXY7ZWxzZXtoPWh8fGZ1bmN0aW9uKCl7dmFyIGQ9e215UGFyZW50OmEucGFyZW50Tm9kZXx8Yy5ib2R5LHBvc2l0aW9uOkEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicG9zaXRpb25cIiksZm9udFNpemU6QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJmb250U2l6ZVwiKX0sZT1kLnBvc2l0aW9uPT09TS5sYXN0UG9zaXRpb24mJmQubXlQYXJlbnQ9PT1NLmxhc3RQYXJlbnQsZj1kLmZvbnRTaXplPT09TS5sYXN0Rm9udFNpemU7TS5sYXN0UGFyZW50PWQubXlQYXJlbnQsTS5sYXN0UG9zaXRpb249ZC5wb3NpdGlvbixNLmxhc3RGb250U2l6ZT1kLmZvbnRTaXplO3ZhciBnPXt9O2lmKGYmJmUpZy5lbVRvUHg9TS5sYXN0RW1Ub1B4LGcucGVyY2VudFRvUHhXaWR0aD1NLmxhc3RQZXJjZW50VG9QeFdpZHRoLGcucGVyY2VudFRvUHhIZWlnaHQ9TS5sYXN0UGVyY2VudFRvUHhIZWlnaHQ7ZWxzZXt2YXIgaD1rJiZrLmlzU1ZHP2MuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcInJlY3RcIik6Yy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3kuaW5pdChoKSxkLm15UGFyZW50LmFwcGVuZENoaWxkKGgpLG8uZWFjaChbXCJvdmVyZmxvd1wiLFwib3ZlcmZsb3dYXCIsXCJvdmVyZmxvd1lcIl0sZnVuY3Rpb24oYSxiKXt5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsYixcImhpZGRlblwiKX0pLHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoaCxcInBvc2l0aW9uXCIsZC5wb3NpdGlvbikseS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLFwiZm9udFNpemVcIixkLmZvbnRTaXplKSx5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsXCJib3hTaXppbmdcIixcImNvbnRlbnQtYm94XCIpLG8uZWFjaChbXCJtaW5XaWR0aFwiLFwibWF4V2lkdGhcIixcIndpZHRoXCIsXCJtaW5IZWlnaHRcIixcIm1heEhlaWdodFwiLFwiaGVpZ2h0XCJdLGZ1bmN0aW9uKGEsYil7eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLGIsXCIxMDAlXCIpfSkseS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLFwicGFkZGluZ0xlZnRcIixcIjEwMGVtXCIpLGcucGVyY2VudFRvUHhXaWR0aD1NLmxhc3RQZXJjZW50VG9QeFdpZHRoPShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShoLFwid2lkdGhcIixudWxsLCEwKSl8fDEpLzEwMCxnLnBlcmNlbnRUb1B4SGVpZ2h0PU0ubGFzdFBlcmNlbnRUb1B4SGVpZ2h0PShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShoLFwiaGVpZ2h0XCIsbnVsbCwhMCkpfHwxKS8xMDAsZy5lbVRvUHg9TS5sYXN0RW1Ub1B4PShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShoLFwicGFkZGluZ0xlZnRcIikpfHwxKS8xMDAsZC5teVBhcmVudC5yZW1vdmVDaGlsZChoKX1yZXR1cm4gbnVsbD09PU0ucmVtVG9QeCYmKE0ucmVtVG9QeD1wYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShjLmJvZHksXCJmb250U2l6ZVwiKSl8fDE2KSxudWxsPT09TS52d1RvUHgmJihNLnZ3VG9QeD1wYXJzZUZsb2F0KGIuaW5uZXJXaWR0aCkvMTAwLE0udmhUb1B4PXBhcnNlRmxvYXQoYi5pbm5lckhlaWdodCkvMTAwKSxnLnJlbVRvUHg9TS5yZW1Ub1B4LGcudndUb1B4PU0udndUb1B4LGcudmhUb1B4PU0udmhUb1B4LHkuZGVidWc+PTEmJmNvbnNvbGUubG9nKFwiVW5pdCByYXRpb3M6IFwiK0pTT04uc3RyaW5naWZ5KGcpLGEpLGd9KCk7dmFyIFM9L21hcmdpbnxwYWRkaW5nfGxlZnR8cmlnaHR8d2lkdGh8dGV4dHx3b3JkfGxldHRlci9pLnRlc3QoZSl8fC9YJC8udGVzdChlKXx8XCJ4XCI9PT1lP1wieFwiOlwieVwiO3N3aXRjaCh2KXtjYXNlXCIlXCI6cio9XCJ4XCI9PT1TP2gucGVyY2VudFRvUHhXaWR0aDpoLnBlcmNlbnRUb1B4SGVpZ2h0O2JyZWFrO2Nhc2VcInB4XCI6YnJlYWs7ZGVmYXVsdDpyKj1oW3YrXCJUb1B4XCJdfXN3aXRjaCh0KXtjYXNlXCIlXCI6cio9MS8oXCJ4XCI9PT1TP2gucGVyY2VudFRvUHhXaWR0aDpoLnBlcmNlbnRUb1B4SGVpZ2h0KTticmVhaztjYXNlXCJweFwiOmJyZWFrO2RlZmF1bHQ6cio9MS9oW3QrXCJUb1B4XCJdfX1zd2l0Y2godyl7Y2FzZVwiK1wiOnA9citwO2JyZWFrO2Nhc2VcIi1cIjpwPXItcDticmVhaztjYXNlXCIqXCI6cCo9cjticmVhaztjYXNlXCIvXCI6cD1yL3B9altlXT17cm9vdFByb3BlcnR5VmFsdWU6bSxzdGFydFZhbHVlOnIsY3VycmVudFZhbHVlOnIsZW5kVmFsdWU6cCx1bml0VHlwZTp0LGVhc2luZzpxfSxnJiYoaltlXS5wYXR0ZXJuPWcpLHkuZGVidWcmJmNvbnNvbGUubG9nKFwidHdlZW5zQ29udGFpbmVyIChcIitlK1wiKTogXCIrSlNPTi5zdHJpbmdpZnkoaltlXSksYSl9O2Zvcih2YXIgSSBpbiBzKWlmKHMuaGFzT3duUHJvcGVydHkoSSkpe3ZhciBKPUEuTmFtZXMuY2FtZWxDYXNlKEkpLEs9ZnVuY3Rpb24oYixjKXt2YXIgZCxmLGc7cmV0dXJuIHUuaXNGdW5jdGlvbihiKSYmKGI9Yi5jYWxsKGEsZSxDKSksdS5pc0FycmF5KGIpPyhkPWJbMF0sIXUuaXNBcnJheShiWzFdKSYmL15bXFxkLV0vLnRlc3QoYlsxXSl8fHUuaXNGdW5jdGlvbihiWzFdKXx8QS5SZWdFeC5pc0hleC50ZXN0KGJbMV0pP2c9YlsxXTp1LmlzU3RyaW5nKGJbMV0pJiYhQS5SZWdFeC5pc0hleC50ZXN0KGJbMV0pJiZ5LkVhc2luZ3NbYlsxXV18fHUuaXNBcnJheShiWzFdKT8oZj1jP2JbMV06bChiWzFdLGkuZHVyYXRpb24pLGc9YlsyXSk6Zz1iWzFdfHxiWzJdKTpkPWIsY3x8KGY9Znx8aS5lYXNpbmcpLHUuaXNGdW5jdGlvbihkKSYmKGQ9ZC5jYWxsKGEsZSxDKSksdS5pc0Z1bmN0aW9uKGcpJiYoZz1nLmNhbGwoYSxlLEMpKSxbZHx8MCxmLGddfShzW0ldKTtpZih0KEEuTGlzdHMuY29sb3JzLEopKXt2YXIgTD1LWzBdLE89S1sxXSxQPUtbMl07aWYoQS5SZWdFeC5pc0hleC50ZXN0KEwpKXtmb3IodmFyIFE9W1wiUmVkXCIsXCJHcmVlblwiLFwiQmx1ZVwiXSxSPUEuVmFsdWVzLmhleFRvUmdiKEwpLFM9UD9BLlZhbHVlcy5oZXhUb1JnYihQKTpkLFQ9MDtUPFEubGVuZ3RoO1QrKyl7dmFyIFU9W1JbVF1dO08mJlUucHVzaChPKSxTIT09ZCYmVS5wdXNoKFNbVF0pLEgoSitRW1RdLFUpfWNvbnRpbnVlfX1IKEosSyl9ai5lbGVtZW50PWF9ai5lbGVtZW50JiYoQS5WYWx1ZXMuYWRkQ2xhc3MoYSxcInZlbG9jaXR5LWFuaW1hdGluZ1wiKSxOLnB1c2goaiksaz1nKGEpLGsmJihcIlwiPT09aS5xdWV1ZSYmKGsudHdlZW5zQ29udGFpbmVyPWosay5vcHRzPWkpLGsuaXNBbmltYXRpbmc9ITApLEQ9PT1DLTE/KHkuU3RhdGUuY2FsbHMucHVzaChbTixyLGksbnVsbCx6LnJlc29sdmVyLG51bGwsMF0pLHkuU3RhdGUuaXNUaWNraW5nPT09ITEmJih5LlN0YXRlLmlzVGlja2luZz0hMCxtKCkpKTpEKyspfXZhciBoLGk9by5leHRlbmQoe30seS5kZWZhdWx0cyx2KSxqPXt9O3N3aXRjaChnKGEpPT09ZCYmeS5pbml0KGEpLHBhcnNlRmxvYXQoaS5kZWxheSkmJmkucXVldWUhPT0hMSYmby5xdWV1ZShhLGkucXVldWUsZnVuY3Rpb24oYil7eS52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnPSEwO3ZhciBjPXkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLmNvdW50Kys7eS5TdGF0ZS5kZWxheWVkRWxlbWVudHNbY109YTt2YXIgZD1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXt5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1thXT0hMSxiKCl9fShjKTtnKGEpLmRlbGF5QmVnaW49KG5ldyBEYXRlKS5nZXRUaW1lKCksZyhhKS5kZWxheT1wYXJzZUZsb2F0KGkuZGVsYXkpLGcoYSkuZGVsYXlUaW1lcj17c2V0VGltZW91dDpzZXRUaW1lb3V0KGIscGFyc2VGbG9hdChpLmRlbGF5KSksbmV4dDpkfX0pLGkuZHVyYXRpb24udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKXtjYXNlXCJmYXN0XCI6aS5kdXJhdGlvbj0yMDA7YnJlYWs7Y2FzZVwibm9ybWFsXCI6aS5kdXJhdGlvbj13O2JyZWFrO2Nhc2VcInNsb3dcIjppLmR1cmF0aW9uPTYwMDticmVhaztkZWZhdWx0OmkuZHVyYXRpb249cGFyc2VGbG9hdChpLmR1cmF0aW9uKXx8MX1pZih5Lm1vY2shPT0hMSYmKHkubW9jaz09PSEwP2kuZHVyYXRpb249aS5kZWxheT0xOihpLmR1cmF0aW9uKj1wYXJzZUZsb2F0KHkubW9jayl8fDEsaS5kZWxheSo9cGFyc2VGbG9hdCh5Lm1vY2spfHwxKSksaS5lYXNpbmc9bChpLmVhc2luZyxpLmR1cmF0aW9uKSxpLmJlZ2luJiYhdS5pc0Z1bmN0aW9uKGkuYmVnaW4pJiYoaS5iZWdpbj1udWxsKSxpLnByb2dyZXNzJiYhdS5pc0Z1bmN0aW9uKGkucHJvZ3Jlc3MpJiYoaS5wcm9ncmVzcz1udWxsKSxpLmNvbXBsZXRlJiYhdS5pc0Z1bmN0aW9uKGkuY29tcGxldGUpJiYoaS5jb21wbGV0ZT1udWxsKSxpLmRpc3BsYXkhPT1kJiZudWxsIT09aS5kaXNwbGF5JiYoaS5kaXNwbGF5PWkuZGlzcGxheS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCksXCJhdXRvXCI9PT1pLmRpc3BsYXkmJihpLmRpc3BsYXk9eS5DU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGEpKSksaS52aXNpYmlsaXR5IT09ZCYmbnVsbCE9PWkudmlzaWJpbGl0eSYmKGkudmlzaWJpbGl0eT1pLnZpc2liaWxpdHkudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSxpLm1vYmlsZUhBPWkubW9iaWxlSEEmJnkuU3RhdGUuaXNNb2JpbGUmJiF5LlN0YXRlLmlzR2luZ2VyYnJlYWQsaS5xdWV1ZT09PSExKWlmKGkuZGVsYXkpe3ZhciBrPXkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLmNvdW50Kys7eS5TdGF0ZS5kZWxheWVkRWxlbWVudHNba109YTt2YXIgbj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXt5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1thXT0hMSxmKCl9fShrKTtnKGEpLmRlbGF5QmVnaW49KG5ldyBEYXRlKS5nZXRUaW1lKCksZyhhKS5kZWxheT1wYXJzZUZsb2F0KGkuZGVsYXkpLGcoYSkuZGVsYXlUaW1lcj17c2V0VGltZW91dDpzZXRUaW1lb3V0KGYscGFyc2VGbG9hdChpLmRlbGF5KSksbmV4dDpufX1lbHNlIGYoKTtlbHNlIG8ucXVldWUoYSxpLnF1ZXVlLGZ1bmN0aW9uKGEsYil7aWYoYj09PSEwKXJldHVybiB6LnByb21pc2UmJnoucmVzb2x2ZXIociksITA7eS52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnPSEwLGYoYSl9KTtcIlwiIT09aS5xdWV1ZSYmXCJmeFwiIT09aS5xdWV1ZXx8XCJpbnByb2dyZXNzXCI9PT1vLnF1ZXVlKGEpWzBdfHxvLmRlcXVldWUoYSl9dmFyIGosayxwLHEscixzLHYseD1hcmd1bWVudHNbMF0mJihhcmd1bWVudHNbMF0ucHx8by5pc1BsYWluT2JqZWN0KGFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzKSYmIWFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzLm5hbWVzfHx1LmlzU3RyaW5nKGFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzKSk7dS5pc1dyYXBwZWQodGhpcyk/KGs9ITEscT0wLHI9dGhpcyxwPXRoaXMpOihrPSEwLHE9MSxyPXg/YXJndW1lbnRzWzBdLmVsZW1lbnRzfHxhcmd1bWVudHNbMF0uZTphcmd1bWVudHNbMF0pO3ZhciB6PXtwcm9taXNlOm51bGwscmVzb2x2ZXI6bnVsbCxyZWplY3RlcjpudWxsfTtpZihrJiZ5LlByb21pc2UmJih6LnByb21pc2U9bmV3IHkuUHJvbWlzZShmdW5jdGlvbihhLGIpe3oucmVzb2x2ZXI9YSx6LnJlamVjdGVyPWJ9KSkseD8ocz1hcmd1bWVudHNbMF0ucHJvcGVydGllc3x8YXJndW1lbnRzWzBdLnAsdj1hcmd1bWVudHNbMF0ub3B0aW9uc3x8YXJndW1lbnRzWzBdLm8pOihzPWFyZ3VtZW50c1txXSx2PWFyZ3VtZW50c1txKzFdKSwhKHI9ZihyKSkpcmV0dXJuIHZvaWQoei5wcm9taXNlJiYocyYmdiYmdi5wcm9taXNlUmVqZWN0RW1wdHk9PT0hMT96LnJlc29sdmVyKCk6ei5yZWplY3RlcigpKSk7dmFyIEM9ci5sZW5ndGgsRD0wO2lmKCEvXihzdG9wfGZpbmlzaHxmaW5pc2hBbGx8cGF1c2V8cmVzdW1lKSQvaS50ZXN0KHMpJiYhby5pc1BsYWluT2JqZWN0KHYpKXt2YXIgRT1xKzE7dj17fTtmb3IodmFyIEY9RTtGPGFyZ3VtZW50cy5sZW5ndGg7RisrKXUuaXNBcnJheShhcmd1bWVudHNbRl0pfHwhL14oZmFzdHxub3JtYWx8c2xvdykkL2kudGVzdChhcmd1bWVudHNbRl0pJiYhL15cXGQvLnRlc3QoYXJndW1lbnRzW0ZdKT91LmlzU3RyaW5nKGFyZ3VtZW50c1tGXSl8fHUuaXNBcnJheShhcmd1bWVudHNbRl0pP3YuZWFzaW5nPWFyZ3VtZW50c1tGXTp1LmlzRnVuY3Rpb24oYXJndW1lbnRzW0ZdKSYmKHYuY29tcGxldGU9YXJndW1lbnRzW0ZdKTp2LmR1cmF0aW9uPWFyZ3VtZW50c1tGXX12YXIgRztzd2l0Y2gocyl7Y2FzZVwic2Nyb2xsXCI6Rz1cInNjcm9sbFwiO2JyZWFrO2Nhc2VcInJldmVyc2VcIjpHPVwicmV2ZXJzZVwiO2JyZWFrO2Nhc2VcInBhdXNlXCI6dmFyIEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG8uZWFjaChyLGZ1bmN0aW9uKGEsYil7aChiLEgpfSksby5lYWNoKHkuU3RhdGUuY2FsbHMsZnVuY3Rpb24oYSxiKXt2YXIgYz0hMTtiJiZvLmVhY2goYlsxXSxmdW5jdGlvbihhLGUpe3ZhciBmPXY9PT1kP1wiXCI6djtyZXR1cm4gZiE9PSEwJiZiWzJdLnF1ZXVlIT09ZiYmKHYhPT1kfHxiWzJdLnF1ZXVlIT09ITEpfHwoby5lYWNoKHIsZnVuY3Rpb24oYSxkKXtpZihkPT09ZSlyZXR1cm4gYls1XT17cmVzdW1lOiExfSxjPSEwLCExfSksIWMmJnZvaWQgMCl9KX0pLGEoKTtjYXNlXCJyZXN1bWVcIjpyZXR1cm4gby5lYWNoKHIsZnVuY3Rpb24oYSxiKXtpKGIsSCl9KSxvLmVhY2goeS5TdGF0ZS5jYWxscyxmdW5jdGlvbihhLGIpe3ZhciBjPSExO2ImJm8uZWFjaChiWzFdLGZ1bmN0aW9uKGEsZSl7dmFyIGY9dj09PWQ/XCJcIjp2O3JldHVybiBmIT09ITAmJmJbMl0ucXVldWUhPT1mJiYodiE9PWR8fGJbMl0ucXVldWUhPT0hMSl8fCghYls1XXx8KG8uZWFjaChyLGZ1bmN0aW9uKGEsZCl7aWYoZD09PWUpcmV0dXJuIGJbNV0ucmVzdW1lPSEwLGM9ITAsITF9KSwhYyYmdm9pZCAwKSl9KX0pLGEoKTtjYXNlXCJmaW5pc2hcIjpjYXNlXCJmaW5pc2hBbGxcIjpjYXNlXCJzdG9wXCI6by5lYWNoKHIsZnVuY3Rpb24oYSxiKXtnKGIpJiZnKGIpLmRlbGF5VGltZXImJihjbGVhclRpbWVvdXQoZyhiKS5kZWxheVRpbWVyLnNldFRpbWVvdXQpLGcoYikuZGVsYXlUaW1lci5uZXh0JiZnKGIpLmRlbGF5VGltZXIubmV4dCgpLGRlbGV0ZSBnKGIpLmRlbGF5VGltZXIpLFwiZmluaXNoQWxsXCIhPT1zfHx2IT09ITAmJiF1LmlzU3RyaW5nKHYpfHwoby5lYWNoKG8ucXVldWUoYix1LmlzU3RyaW5nKHYpP3Y6XCJcIiksZnVuY3Rpb24oYSxiKXt1LmlzRnVuY3Rpb24oYikmJmIoKX0pLG8ucXVldWUoYix1LmlzU3RyaW5nKHYpP3Y6XCJcIixbXSkpfSk7dmFyIEk9W107cmV0dXJuIG8uZWFjaCh5LlN0YXRlLmNhbGxzLGZ1bmN0aW9uKGEsYil7YiYmby5lYWNoKGJbMV0sZnVuY3Rpb24oYyxlKXt2YXIgZj12PT09ZD9cIlwiOnY7aWYoZiE9PSEwJiZiWzJdLnF1ZXVlIT09ZiYmKHYhPT1kfHxiWzJdLnF1ZXVlIT09ITEpKXJldHVybiEwO28uZWFjaChyLGZ1bmN0aW9uKGMsZCl7aWYoZD09PWUpaWYoKHY9PT0hMHx8dS5pc1N0cmluZyh2KSkmJihvLmVhY2goby5xdWV1ZShkLHUuaXNTdHJpbmcodik/djpcIlwiKSxmdW5jdGlvbihhLGIpe3UuaXNGdW5jdGlvbihiKSYmYihudWxsLCEwKX0pLG8ucXVldWUoZCx1LmlzU3RyaW5nKHYpP3Y6XCJcIixbXSkpLFwic3RvcFwiPT09cyl7dmFyIGg9ZyhkKTtoJiZoLnR3ZWVuc0NvbnRhaW5lciYmZiE9PSExJiZvLmVhY2goaC50d2VlbnNDb250YWluZXIsZnVuY3Rpb24oYSxiKXtiLmVuZFZhbHVlPWIuY3VycmVudFZhbHVlfSksSS5wdXNoKGEpfWVsc2VcImZpbmlzaFwiIT09cyYmXCJmaW5pc2hBbGxcIiE9PXN8fChiWzJdLmR1cmF0aW9uPTEpfSl9KX0pLFwic3RvcFwiPT09cyYmKG8uZWFjaChJLGZ1bmN0aW9uKGEsYil7bihiLCEwKX0pLHoucHJvbWlzZSYmei5yZXNvbHZlcihyKSksYSgpO2RlZmF1bHQ6aWYoIW8uaXNQbGFpbk9iamVjdChzKXx8dS5pc0VtcHR5T2JqZWN0KHMpKXtpZih1LmlzU3RyaW5nKHMpJiZ5LlJlZGlyZWN0c1tzXSl7aj1vLmV4dGVuZCh7fSx2KTt2YXIgSj1qLmR1cmF0aW9uLEs9ai5kZWxheXx8MDtyZXR1cm4gai5iYWNrd2FyZHM9PT0hMCYmKHI9by5leHRlbmQoITAsW10scikucmV2ZXJzZSgpKSxvLmVhY2gocixmdW5jdGlvbihhLGIpe3BhcnNlRmxvYXQoai5zdGFnZ2VyKT9qLmRlbGF5PUsrcGFyc2VGbG9hdChqLnN0YWdnZXIpKmE6dS5pc0Z1bmN0aW9uKGouc3RhZ2dlcikmJihqLmRlbGF5PUsrai5zdGFnZ2VyLmNhbGwoYixhLEMpKSxqLmRyYWcmJihqLmR1cmF0aW9uPXBhcnNlRmxvYXQoSil8fCgvXihjYWxsb3V0fHRyYW5zaXRpb24pLy50ZXN0KHMpPzFlMzp3KSxqLmR1cmF0aW9uPU1hdGgubWF4KGouZHVyYXRpb24qKGouYmFja3dhcmRzPzEtYS9DOihhKzEpL0MpLC43NSpqLmR1cmF0aW9uLDIwMCkpLHkuUmVkaXJlY3RzW3NdLmNhbGwoYixiLGp8fHt9LGEsQyxyLHoucHJvbWlzZT96OmQpfSksYSgpfXZhciBMPVwiVmVsb2NpdHk6IEZpcnN0IGFyZ3VtZW50IChcIitzK1wiKSB3YXMgbm90IGEgcHJvcGVydHkgbWFwLCBhIGtub3duIGFjdGlvbiwgb3IgYSByZWdpc3RlcmVkIHJlZGlyZWN0LiBBYm9ydGluZy5cIjtyZXR1cm4gei5wcm9taXNlP3oucmVqZWN0ZXIobmV3IEVycm9yKEwpKTpiLmNvbnNvbGUmJmNvbnNvbGUubG9nKEwpLGEoKX1HPVwic3RhcnRcIn12YXIgTT17bGFzdFBhcmVudDpudWxsLGxhc3RQb3NpdGlvbjpudWxsLGxhc3RGb250U2l6ZTpudWxsLGxhc3RQZXJjZW50VG9QeFdpZHRoOm51bGwsbGFzdFBlcmNlbnRUb1B4SGVpZ2h0Om51bGwsbGFzdEVtVG9QeDpudWxsLHJlbVRvUHg6bnVsbCx2d1RvUHg6bnVsbCx2aFRvUHg6bnVsbH0sTj1bXTtvLmVhY2gocixmdW5jdGlvbihhLGIpe3UuaXNOb2RlKGIpJiZlKGIsYSl9KSxqPW8uZXh0ZW5kKHt9LHkuZGVmYXVsdHMsdiksai5sb29wPXBhcnNlSW50KGoubG9vcCwxMCk7dmFyIE89MipqLmxvb3AtMTtpZihqLmxvb3ApZm9yKHZhciBQPTA7UDxPO1ArKyl7dmFyIFE9e2RlbGF5OmouZGVsYXkscHJvZ3Jlc3M6ai5wcm9ncmVzc307UD09PU8tMSYmKFEuZGlzcGxheT1qLmRpc3BsYXksUS52aXNpYmlsaXR5PWoudmlzaWJpbGl0eSxRLmNvbXBsZXRlPWouY29tcGxldGUpLEIocixcInJldmVyc2VcIixRKX1yZXR1cm4gYSgpfTt5PW8uZXh0ZW5kKEIseSkseS5hbmltYXRlPUI7dmFyIEM9Yi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fHE7aWYoIXkuU3RhdGUuaXNNb2JpbGUmJmMuaGlkZGVuIT09ZCl7dmFyIEQ9ZnVuY3Rpb24oKXtjLmhpZGRlbj8oQz1mdW5jdGlvbihhKXtyZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe2EoITApfSwxNil9LG0oKSk6Qz1iLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8cX07RCgpLGMuYWRkRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIixEKX1yZXR1cm4gYS5WZWxvY2l0eT15LGEhPT1iJiYoYS5mbi52ZWxvY2l0eT1CLGEuZm4udmVsb2NpdHkuZGVmYXVsdHM9eS5kZWZhdWx0cyksby5lYWNoKFtcIkRvd25cIixcIlVwXCJdLGZ1bmN0aW9uKGEsYil7eS5SZWRpcmVjdHNbXCJzbGlkZVwiK2JdPWZ1bmN0aW9uKGEsYyxlLGYsZyxoKXt2YXIgaT1vLmV4dGVuZCh7fSxjKSxqPWkuYmVnaW4saz1pLmNvbXBsZXRlLGw9e30sbT17aGVpZ2h0OlwiXCIsbWFyZ2luVG9wOlwiXCIsbWFyZ2luQm90dG9tOlwiXCIscGFkZGluZ1RvcDpcIlwiLHBhZGRpbmdCb3R0b206XCJcIn07aS5kaXNwbGF5PT09ZCYmKGkuZGlzcGxheT1cIkRvd25cIj09PWI/XCJpbmxpbmVcIj09PXkuQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShhKT9cImlubGluZS1ibG9ja1wiOlwiYmxvY2tcIjpcIm5vbmVcIiksaS5iZWdpbj1mdW5jdGlvbigpezA9PT1lJiZqJiZqLmNhbGwoZyxnKTtmb3IodmFyIGMgaW4gbSlpZihtLmhhc093blByb3BlcnR5KGMpKXtsW2NdPWEuc3R5bGVbY107dmFyIGQ9QS5nZXRQcm9wZXJ0eVZhbHVlKGEsYyk7bVtjXT1cIkRvd25cIj09PWI/W2QsMF06WzAsZF19bC5vdmVyZmxvdz1hLnN0eWxlLm92ZXJmbG93LGEuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIn0saS5jb21wbGV0ZT1mdW5jdGlvbigpe2Zvcih2YXIgYiBpbiBsKWwuaGFzT3duUHJvcGVydHkoYikmJihhLnN0eWxlW2JdPWxbYl0pO2U9PT1mLTEmJihrJiZrLmNhbGwoZyxnKSxoJiZoLnJlc29sdmVyKGcpKX0seShhLG0saSl9fSksby5lYWNoKFtcIkluXCIsXCJPdXRcIl0sZnVuY3Rpb24oYSxiKXt5LlJlZGlyZWN0c1tcImZhZGVcIitiXT1mdW5jdGlvbihhLGMsZSxmLGcsaCl7dmFyIGk9by5leHRlbmQoe30sYyksaj1pLmNvbXBsZXRlLGs9e29wYWNpdHk6XCJJblwiPT09Yj8xOjB9OzAhPT1lJiYoaS5iZWdpbj1udWxsKSxpLmNvbXBsZXRlPWUhPT1mLTE/bnVsbDpmdW5jdGlvbigpe2omJmouY2FsbChnLGcpLGgmJmgucmVzb2x2ZXIoZyl9LGkuZGlzcGxheT09PWQmJihpLmRpc3BsYXk9XCJJblwiPT09Yj9cImF1dG9cIjpcIm5vbmVcIikseSh0aGlzLGssaSl9fSkseX0od2luZG93LmpRdWVyeXx8d2luZG93LlplcHRvfHx3aW5kb3csd2luZG93LHdpbmRvdz93aW5kb3cuZG9jdW1lbnQ6dW5kZWZpbmVkKX0pOyIsIiFmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1hKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJ2ZWxvY2l0eVwiXSxhKTphKCl9KGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIGZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWEuVmVsb2NpdHk7aWYoIWV8fCFlLlV0aWxpdGllcylyZXR1cm4gdm9pZChiLmNvbnNvbGUmJmNvbnNvbGUubG9nKFwiVmVsb2NpdHkgVUkgUGFjazogVmVsb2NpdHkgbXVzdCBiZSBsb2FkZWQgZmlyc3QuIEFib3J0aW5nLlwiKSk7dmFyIGY9ZS5VdGlsaXRpZXMsZz1lLnZlcnNpb24saD17bWFqb3I6MSxtaW5vcjoxLHBhdGNoOjB9O2lmKGZ1bmN0aW9uKGEsYil7dmFyIGM9W107cmV0dXJuISghYXx8IWIpJiYoZi5lYWNoKFthLGJdLGZ1bmN0aW9uKGEsYil7dmFyIGQ9W107Zi5lYWNoKGIsZnVuY3Rpb24oYSxiKXtmb3IoO2IudG9TdHJpbmcoKS5sZW5ndGg8NTspYj1cIjBcIitiO2QucHVzaChiKX0pLGMucHVzaChkLmpvaW4oXCJcIikpfSkscGFyc2VGbG9hdChjWzBdKT5wYXJzZUZsb2F0KGNbMV0pKX0oaCxnKSl7dmFyIGk9XCJWZWxvY2l0eSBVSSBQYWNrOiBZb3UgbmVlZCB0byB1cGRhdGUgVmVsb2NpdHkgKHZlbG9jaXR5LmpzKSB0byBhIG5ld2VyIHZlcnNpb24uIFZpc2l0IGh0dHA6Ly9naXRodWIuY29tL2p1bGlhbnNoYXBpcm8vdmVsb2NpdHkuXCI7dGhyb3cgYWxlcnQoaSksbmV3IEVycm9yKGkpfWUuUmVnaXN0ZXJFZmZlY3Q9ZS5SZWdpc3RlclVJPWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYyhhLGIsYyxkKXt2YXIgZyxoPTA7Zi5lYWNoKGEubm9kZVR5cGU/W2FdOmEsZnVuY3Rpb24oYSxiKXtkJiYoYys9YSpkKSxnPWIucGFyZW50Tm9kZTt2YXIgaT1bXCJoZWlnaHRcIixcInBhZGRpbmdUb3BcIixcInBhZGRpbmdCb3R0b21cIixcIm1hcmdpblRvcFwiLFwibWFyZ2luQm90dG9tXCJdO1wiYm9yZGVyLWJveFwiPT09ZS5DU1MuZ2V0UHJvcGVydHlWYWx1ZShiLFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSYmKGk9W1wiaGVpZ2h0XCJdKSxmLmVhY2goaSxmdW5jdGlvbihhLGMpe2grPXBhcnNlRmxvYXQoZS5DU1MuZ2V0UHJvcGVydHlWYWx1ZShiLGMpKX0pfSksZS5hbmltYXRlKGcse2hlaWdodDooXCJJblwiPT09Yj9cIitcIjpcIi1cIikrXCI9XCIraH0se3F1ZXVlOiExLGVhc2luZzpcImVhc2UtaW4tb3V0XCIsZHVyYXRpb246YyooXCJJblwiPT09Yj8uNjoxKX0pfXJldHVybiBlLlJlZGlyZWN0c1thXT1mdW5jdGlvbihkLGcsaCxpLGosayxsKXt2YXIgbT1oPT09aS0xLG49MDtsPWx8fGIubG9vcCxcImZ1bmN0aW9uXCI9PXR5cGVvZiBiLmRlZmF1bHREdXJhdGlvbj9iLmRlZmF1bHREdXJhdGlvbj1iLmRlZmF1bHREdXJhdGlvbi5jYWxsKGosaik6Yi5kZWZhdWx0RHVyYXRpb249cGFyc2VGbG9hdChiLmRlZmF1bHREdXJhdGlvbik7Zm9yKHZhciBvPTA7bzxiLmNhbGxzLmxlbmd0aDtvKyspXCJudW1iZXJcIj09dHlwZW9mKHQ9Yi5jYWxsc1tvXVsxXSkmJihuKz10KTt2YXIgcD1uPj0xPzA6Yi5jYWxscy5sZW5ndGg/KDEtbikvYi5jYWxscy5sZW5ndGg6MTtmb3Iobz0wO288Yi5jYWxscy5sZW5ndGg7bysrKXt2YXIgcT1iLmNhbGxzW29dLHI9cVswXSxzPTFlMyx0PXFbMV0sdT1xWzJdfHx7fSx2PXt9O2lmKHZvaWQgMCE9PWcuZHVyYXRpb24/cz1nLmR1cmF0aW9uOnZvaWQgMCE9PWIuZGVmYXVsdER1cmF0aW9uJiYocz1iLmRlZmF1bHREdXJhdGlvbiksdi5kdXJhdGlvbj1zKihcIm51bWJlclwiPT10eXBlb2YgdD90OnApLHYucXVldWU9Zy5xdWV1ZXx8XCJcIix2LmVhc2luZz11LmVhc2luZ3x8XCJlYXNlXCIsdi5kZWxheT1wYXJzZUZsb2F0KHUuZGVsYXkpfHwwLHYubG9vcD0hYi5sb29wJiZ1Lmxvb3Asdi5fY2FjaGVWYWx1ZXM9dS5fY2FjaGVWYWx1ZXN8fCEwLDA9PT1vKXtpZih2LmRlbGF5Kz1wYXJzZUZsb2F0KGcuZGVsYXkpfHwwLDA9PT1oJiYodi5iZWdpbj1mdW5jdGlvbigpe2cuYmVnaW4mJmcuYmVnaW4uY2FsbChqLGopO3ZhciBiPWEubWF0Y2goLyhJbnxPdXQpJC8pO2ImJlwiSW5cIj09PWJbMF0mJnZvaWQgMCE9PXIub3BhY2l0eSYmZi5lYWNoKGoubm9kZVR5cGU/W2pdOmosZnVuY3Rpb24oYSxiKXtlLkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGIsXCJvcGFjaXR5XCIsMCl9KSxnLmFuaW1hdGVQYXJlbnRIZWlnaHQmJmImJmMoaixiWzBdLHMrdi5kZWxheSxnLnN0YWdnZXIpfSksbnVsbCE9PWcuZGlzcGxheSlpZih2b2lkIDAhPT1nLmRpc3BsYXkmJlwibm9uZVwiIT09Zy5kaXNwbGF5KXYuZGlzcGxheT1nLmRpc3BsYXk7ZWxzZSBpZigvSW4kLy50ZXN0KGEpKXt2YXIgdz1lLkNTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoZCk7di5kaXNwbGF5PVwiaW5saW5lXCI9PT13P1wiaW5saW5lLWJsb2NrXCI6d31nLnZpc2liaWxpdHkmJlwiaGlkZGVuXCIhPT1nLnZpc2liaWxpdHkmJih2LnZpc2liaWxpdHk9Zy52aXNpYmlsaXR5KX1pZihvPT09Yi5jYWxscy5sZW5ndGgtMSl7dmFyIHg9ZnVuY3Rpb24oKXt2b2lkIDAhPT1nLmRpc3BsYXkmJlwibm9uZVwiIT09Zy5kaXNwbGF5fHwhL091dCQvLnRlc3QoYSl8fGYuZWFjaChqLm5vZGVUeXBlP1tqXTpqLGZ1bmN0aW9uKGEsYil7ZS5DU1Muc2V0UHJvcGVydHlWYWx1ZShiLFwiZGlzcGxheVwiLFwibm9uZVwiKX0pLGcuY29tcGxldGUmJmcuY29tcGxldGUuY2FsbChqLGopLGsmJmsucmVzb2x2ZXIoanx8ZCl9O3YuY29tcGxldGU9ZnVuY3Rpb24oKXtpZihsJiZlLlJlZGlyZWN0c1thXShkLGcsaCxpLGosayxsPT09ITB8fE1hdGgubWF4KDAsbC0xKSksYi5yZXNldCl7Zm9yKHZhciBjIGluIGIucmVzZXQpaWYoYi5yZXNldC5oYXNPd25Qcm9wZXJ0eShjKSl7dmFyIGY9Yi5yZXNldFtjXTt2b2lkIDAhPT1lLkNTUy5Ib29rcy5yZWdpc3RlcmVkW2NdfHxcInN0cmluZ1wiIT10eXBlb2YgZiYmXCJudW1iZXJcIiE9dHlwZW9mIGZ8fChiLnJlc2V0W2NdPVtiLnJlc2V0W2NdLGIucmVzZXRbY11dKX12YXIgbj17ZHVyYXRpb246MCxxdWV1ZTohMX07bSYmKG4uY29tcGxldGU9eCksZS5hbmltYXRlKGQsYi5yZXNldCxuKX1lbHNlIG0mJngoKX0sXCJoaWRkZW5cIj09PWcudmlzaWJpbGl0eSYmKHYudmlzaWJpbGl0eT1nLnZpc2liaWxpdHkpfWUuYW5pbWF0ZShkLHIsdil9fSxlfSxlLlJlZ2lzdGVyRWZmZWN0LnBhY2thZ2VkRWZmZWN0cz17XCJjYWxsb3V0LmJvdW5jZVwiOntkZWZhdWx0RHVyYXRpb246NTUwLGNhbGxzOltbe3RyYW5zbGF0ZVk6LTMwfSwuMjVdLFt7dHJhbnNsYXRlWTowfSwuMTI1XSxbe3RyYW5zbGF0ZVk6LTE1fSwuMTI1XSxbe3RyYW5zbGF0ZVk6MH0sLjI1XV19LFwiY2FsbG91dC5zaGFrZVwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe3RyYW5zbGF0ZVg6LTExfV0sW3t0cmFuc2xhdGVYOjExfV0sW3t0cmFuc2xhdGVYOi0xMX1dLFt7dHJhbnNsYXRlWDoxMX1dLFt7dHJhbnNsYXRlWDotMTF9XSxbe3RyYW5zbGF0ZVg6MTF9XSxbe3RyYW5zbGF0ZVg6LTExfV0sW3t0cmFuc2xhdGVYOjB9XV19LFwiY2FsbG91dC5mbGFzaFwiOntkZWZhdWx0RHVyYXRpb246MTEwMCxjYWxsczpbW3tvcGFjaXR5OlswLFwiZWFzZUluT3V0UXVhZFwiLDFdfV0sW3tvcGFjaXR5OlsxLFwiZWFzZUluT3V0UXVhZFwiXX1dLFt7b3BhY2l0eTpbMCxcImVhc2VJbk91dFF1YWRcIl19XSxbe29wYWNpdHk6WzEsXCJlYXNlSW5PdXRRdWFkXCJdfV1dfSxcImNhbGxvdXQucHVsc2VcIjp7ZGVmYXVsdER1cmF0aW9uOjgyNSxjYWxsczpbW3tzY2FsZVg6MS4xLHNjYWxlWToxLjF9LC41LHtlYXNpbmc6XCJlYXNlSW5FeHBvXCJ9XSxbe3NjYWxlWDoxLHNjYWxlWToxfSwuNV1dfSxcImNhbGxvdXQuc3dpbmdcIjp7ZGVmYXVsdER1cmF0aW9uOjk1MCxjYWxsczpbW3tyb3RhdGVaOjE1fV0sW3tyb3RhdGVaOi0xMH1dLFt7cm90YXRlWjo1fV0sW3tyb3RhdGVaOi01fV0sW3tyb3RhdGVaOjB9XV19LFwiY2FsbG91dC50YWRhXCI6e2RlZmF1bHREdXJhdGlvbjoxZTMsY2FsbHM6W1t7c2NhbGVYOi45LHNjYWxlWTouOSxyb3RhdGVaOi0zfSwuMV0sW3tzY2FsZVg6MS4xLHNjYWxlWToxLjEscm90YXRlWjozfSwuMV0sW3tzY2FsZVg6MS4xLHNjYWxlWToxLjEscm90YXRlWjotM30sLjFdLFtcInJldmVyc2VcIiwuMTI1XSxbXCJyZXZlcnNlXCIsLjEyNV0sW1wicmV2ZXJzZVwiLC4xMjVdLFtcInJldmVyc2VcIiwuMTI1XSxbXCJyZXZlcnNlXCIsLjEyNV0sW3tzY2FsZVg6MSxzY2FsZVk6MSxyb3RhdGVaOjB9LC4yXV19LFwidHJhbnNpdGlvbi5mYWRlSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjUwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdfV1dfSxcInRyYW5zaXRpb24uZmFkZU91dFwiOntkZWZhdWx0RHVyYXRpb246NTAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV19XV19LFwidHJhbnNpdGlvbi5mbGlwWEluXCI6e2RlZmF1bHREdXJhdGlvbjo3MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0scm90YXRlWTpbMCwtNTVdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBYT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0scm90YXRlWTo1NX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCxyb3RhdGVZOjB9fSxcInRyYW5zaXRpb24uZmxpcFlJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHJvdGF0ZVg6WzAsLTQ1XX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MH19LFwidHJhbnNpdGlvbi5mbGlwWU91dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHJvdGF0ZVg6MjV9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAscm90YXRlWDowfX0sXCJ0cmFuc2l0aW9uLmZsaXBCb3VuY2VYSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjkwMCxjYWxsczpbW3tvcGFjaXR5OlsuNzI1LDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls0MDAsNDAwXSxyb3RhdGVZOlstMTAsOTBdfSwuNV0sW3tvcGFjaXR5Oi44LHJvdGF0ZVk6MTB9LC4yNV0sW3tvcGFjaXR5OjEscm90YXRlWTowfSwuMjVdXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MH19LFwidHJhbnNpdGlvbi5mbGlwQm91bmNlWE91dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6Wy45LDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls0MDAsNDAwXSxyb3RhdGVZOi0xMH1dLFt7b3BhY2l0eTowLHJvdGF0ZVk6OTB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAscm90YXRlWTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBCb3VuY2VZSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlsuNzI1LDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls0MDAsNDAwXSxyb3RhdGVYOlstMTAsOTBdfSwuNV0sW3tvcGFjaXR5Oi44LHJvdGF0ZVg6MTB9LC4yNV0sW3tvcGFjaXR5OjEscm90YXRlWDowfSwuMjVdXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MH19LFwidHJhbnNpdGlvbi5mbGlwQm91bmNlWU91dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6Wy45LDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls0MDAsNDAwXSxyb3RhdGVYOi0xNX1dLFt7b3BhY2l0eTowLHJvdGF0ZVg6OTB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAscm90YXRlWDowfX0sXCJ0cmFuc2l0aW9uLnN3b29wSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybU9yaWdpblg6W1wiMTAwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiMTAwJVwiLFwiMTAwJVwiXSxzY2FsZVg6WzEsMF0sc2NhbGVZOlsxLDBdLHRyYW5zbGF0ZVg6WzAsLTcwMF0sdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwifX0sXCJ0cmFuc2l0aW9uLnN3b29wT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiMTAwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjEwMCVcIixcIjEwMCVcIl0sc2NhbGVYOjAsc2NhbGVZOjAsdHJhbnNsYXRlWDotNzAwLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIixzY2FsZVg6MSxzY2FsZVk6MSx0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24ud2hpcmxJblwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDpbMSwwXSxzY2FsZVk6WzEsMF0scm90YXRlWTpbMCwxNjBdfSwxLHtlYXNpbmc6XCJlYXNlSW5PdXRTaW5lXCJ9XV19LFwidHJhbnNpdGlvbi53aGlybE91dFwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe29wYWNpdHk6WzAsXCJlYXNlSW5PdXRRdWludFwiLDFdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6MCxzY2FsZVk6MCxyb3RhdGVZOjE2MH0sMSx7ZWFzaW5nOlwic3dpbmdcIn1dXSxyZXNldDp7c2NhbGVYOjEsc2NhbGVZOjEscm90YXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNocmlua0luXCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOlsxLDEuNV0sc2NhbGVZOlsxLDEuNV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2hyaW5rT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo2MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOjEuMyxzY2FsZVk6MS4zLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7c2NhbGVYOjEsc2NhbGVZOjF9fSxcInRyYW5zaXRpb24uZXhwYW5kSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjcwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6WzEsLjYyNV0sc2NhbGVZOlsxLC42MjVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLmV4cGFuZE91dFwiOntkZWZhdWx0RHVyYXRpb246NzAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDouNSxzY2FsZVk6LjUsdHJhbnNsYXRlWjowfV1dLHJlc2V0OntzY2FsZVg6MSxzY2FsZVk6MX19LFwidHJhbnNpdGlvbi5ib3VuY2VJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sc2NhbGVYOlsxLjA1LC4zXSxzY2FsZVk6WzEuMDUsLjNdfSwuMzVdLFt7c2NhbGVYOi45LHNjYWxlWTouOSx0cmFuc2xhdGVaOjB9LC4yXSxbe3NjYWxlWDoxLHNjYWxlWToxfSwuNDVdXX0sXCJ0cmFuc2l0aW9uLmJvdW5jZU91dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe3NjYWxlWDouOTUsc2NhbGVZOi45NX0sLjM1XSxbe3NjYWxlWDoxLjEsc2NhbGVZOjEuMSx0cmFuc2xhdGVaOjB9LC4zNV0sW3tvcGFjaXR5OlswLDFdLHNjYWxlWDouMyxzY2FsZVk6LjN9LC4zXV0scmVzZXQ6e3NjYWxlWDoxLHNjYWxlWToxfX0sXCJ0cmFuc2l0aW9uLmJvdW5jZVVwSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVk6Wy0zMCwxZTNdfSwuNix7ZWFzaW5nOlwiZWFzZU91dENpcmNcIn1dLFt7dHJhbnNsYXRlWToxMH0sLjJdLFt7dHJhbnNsYXRlWTowfSwuMl1dfSxcInRyYW5zaXRpb24uYm91bmNlVXBPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjFlMyxjYWxsczpbW3t0cmFuc2xhdGVZOjIwfSwuMl0sW3tvcGFjaXR5OlswLFwiZWFzZUluQ2lyY1wiLDFdLHRyYW5zbGF0ZVk6LTFlM30sLjhdXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLmJvdW5jZURvd25JblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbMzAsLTFlM119LC42LHtlYXNpbmc6XCJlYXNlT3V0Q2lyY1wifV0sW3t0cmFuc2xhdGVZOi0xMH0sLjJdLFt7dHJhbnNsYXRlWTowfSwuMl1dfSxcInRyYW5zaXRpb24uYm91bmNlRG93bk91dFwiOntkZWZhdWx0RHVyYXRpb246MWUzLGNhbGxzOltbe3RyYW5zbGF0ZVk6LTIwfSwuMl0sW3tvcGFjaXR5OlswLFwiZWFzZUluQ2lyY1wiLDFdLHRyYW5zbGF0ZVk6MWUzfSwuOF1dLHJlc2V0Ont0cmFuc2xhdGVZOjB9fSxcInRyYW5zaXRpb24uYm91bmNlTGVmdEluXCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlszMCwtMTI1MF19LC42LHtlYXNpbmc6XCJlYXNlT3V0Q2lyY1wifV0sW3t0cmFuc2xhdGVYOi0xMH0sLjJdLFt7dHJhbnNsYXRlWDowfSwuMl1dfSxcInRyYW5zaXRpb24uYm91bmNlTGVmdE91dFwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe3RyYW5zbGF0ZVg6MzB9LC4yXSxbe29wYWNpdHk6WzAsXCJlYXNlSW5DaXJjXCIsMV0sdHJhbnNsYXRlWDotMTI1MH0sLjhdXSxyZXNldDp7dHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLmJvdW5jZVJpZ2h0SW5cIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVg6Wy0zMCwxMjUwXX0sLjYse2Vhc2luZzpcImVhc2VPdXRDaXJjXCJ9XSxbe3RyYW5zbGF0ZVg6MTB9LC4yXSxbe3RyYW5zbGF0ZVg6MH0sLjJdXX0sXCJ0cmFuc2l0aW9uLmJvdW5jZVJpZ2h0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7dHJhbnNsYXRlWDotMzB9LC4yXSxbe29wYWNpdHk6WzAsXCJlYXNlSW5DaXJjXCIsMV0sdHJhbnNsYXRlWDoxMjUwfSwuOF1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uc2xpZGVVcEluXCI6e2RlZmF1bHREdXJhdGlvbjo5MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlswLDIwXSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZVVwT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo5MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVZOi0yMCx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5zbGlkZURvd25JblwiOntkZWZhdWx0RHVyYXRpb246OTAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbMCwtMjBdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlRG93bk91dFwiOntkZWZhdWx0RHVyYXRpb246OTAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWToyMCx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5zbGlkZUxlZnRJblwiOntkZWZhdWx0RHVyYXRpb246MWUzLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbMCwtMjBdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlTGVmdE91dFwiOntkZWZhdWx0RHVyYXRpb246MTA1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVg6LTIwLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlUmlnaHRJblwiOntkZWZhdWx0RHVyYXRpb246MWUzLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbMCwyMF0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVSaWdodE91dFwiOntkZWZhdWx0RHVyYXRpb246MTA1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVg6MjAsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uc2xpZGVVcEJpZ0luXCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlswLDc1XSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZVVwQmlnT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVZOi03NSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5zbGlkZURvd25CaWdJblwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbMCwtNzVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlRG93bkJpZ091dFwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWTo3NSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5zbGlkZUxlZnRCaWdJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbMCwtNzVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlTGVmdEJpZ091dFwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWDotNzUsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uc2xpZGVSaWdodEJpZ0luXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlswLDc1XSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZVJpZ2h0QmlnT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVYOjc1LHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWDowfX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlVXBJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHRyYW5zZm9ybU9yaWdpblg6WzAsMF0sdHJhbnNmb3JtT3JpZ2luWTpbXCIxMDAlXCIsXCIxMDAlXCJdLHJvdGF0ZVg6WzAsLTE4MF19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIn19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZVVwT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjEwMCVcIixcIjEwMCVcIl0scm90YXRlWDotMTgwfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCIscm90YXRlWDowfX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlRG93bkluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVg6WzAsMTgwXX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwifX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlRG93bk91dFwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzgwMCw4MDBdLHRyYW5zZm9ybU9yaWdpblg6WzAsMF0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVYOjE4MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwiLHJvdGF0ZVg6MH19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZUxlZnRJblwiOntkZWZhdWx0RHVyYXRpb246OTUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzJlMywyZTNdLHRyYW5zZm9ybU9yaWdpblg6WzAsMF0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVZOlswLC0xODBdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCJ9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVMZWZ0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjo5NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbMmUzLDJlM10sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVk6LTE4MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwiLHJvdGF0ZVk6MH19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZVJpZ2h0SW5cIjp7ZGVmYXVsdER1cmF0aW9uOjk1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOlsyZTMsMmUzXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjEwMCVcIixcIjEwMCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVZOlswLDE4MF19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIn19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZVJpZ2h0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjo5NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbMmUzLDJlM10sdHJhbnNmb3JtT3JpZ2luWDpbXCIxMDAlXCIsXCIxMDAlXCJdLHRyYW5zZm9ybU9yaWdpblk6WzAsMF0scm90YXRlWToxODB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIixyb3RhdGVZOjB9fX07Zm9yKHZhciBqIGluIGUuUmVnaXN0ZXJFZmZlY3QucGFja2FnZWRFZmZlY3RzKWUuUmVnaXN0ZXJFZmZlY3QucGFja2FnZWRFZmZlY3RzLmhhc093blByb3BlcnR5KGopJiZlLlJlZ2lzdGVyRWZmZWN0KGosZS5SZWdpc3RlckVmZmVjdC5wYWNrYWdlZEVmZmVjdHNbal0pO2UuUnVuU2VxdWVuY2U9ZnVuY3Rpb24oYSl7dmFyIGI9Zi5leHRlbmQoITAsW10sYSk7Yi5sZW5ndGg+MSYmKGYuZWFjaChiLnJldmVyc2UoKSxmdW5jdGlvbihhLGMpe3ZhciBkPWJbYSsxXTtpZihkKXt2YXIgZz1jLm98fGMub3B0aW9ucyxoPWQub3x8ZC5vcHRpb25zLGk9ZyYmZy5zZXF1ZW5jZVF1ZXVlPT09ITE/XCJiZWdpblwiOlwiY29tcGxldGVcIixqPWgmJmhbaV0saz17fTtrW2ldPWZ1bmN0aW9uKCl7dmFyIGE9ZC5lfHxkLmVsZW1lbnRzLGI9YS5ub2RlVHlwZT9bYV06YTtqJiZqLmNhbGwoYixiKSxlKGMpfSxkLm8/ZC5vPWYuZXh0ZW5kKHt9LGgsayk6ZC5vcHRpb25zPWYuZXh0ZW5kKHt9LGgsayl9fSksYi5yZXZlcnNlKCkpLGUoYlswXSl9fSh3aW5kb3cualF1ZXJ5fHx3aW5kb3cuWmVwdG98fHdpbmRvdyx3aW5kb3csd2luZG93P3dpbmRvdy5kb2N1bWVudDp1bmRlZmluZWQpfSk7IiwiaW1wb3J0IHsgZWxDbGFzcyB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFuaW1hdGVNZW51SXRlbSgpIHtcclxuICBjb25zdCBtZW51SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWVudS1pdGVtJyk7XHJcbiAgY29uc3QgbGlzdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI21haW4tbmF2IGxpJyk7XHJcblxyXG4gIG1lbnVJdGVtcy5mb3JFYWNoKGVsID0+IGFkZFBpcGVzKGVsKSk7XHJcbiAgbWVudUl0ZW1zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgYW5pbWF0ZVBpcGUpKTtcclxuICBtZW51SXRlbXMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHVuQW5pbWF0ZVBpcGUpKTtcclxuXHJcbiAgZnVuY3Rpb24gYWRkUGlwZXMoZWwpIHtcclxuICAgIGNvbnN0IGVuZFBpcGUgPSBlbENsYXNzKCdkaXYnLCAnZW5kLXBpcGUnKTtcclxuICAgIGVuZFBpcGUuaW5uZXJIVE1MID0gJ3wnO1xyXG4gICAgY29uc3Qgc3RyID0gZWw7XHJcbiAgICBzdHIuaW5uZXJIVE1MID0gYCR7c3RyLmlubmVySFRNTC50b1VwcGVyQ2FzZSgpfSB8YDtcclxuICAgIHN0ci5hcHBlbmRDaGlsZChlbmRQaXBlKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFuaW1hdGVQaXBlKGUpIHtcclxuICAgIGNvbnN0IHNwYWNlV2lkdGggPSA1O1xyXG4gICAgY29uc3QgdyA9IGUudGFyZ2V0Lm9mZnNldFdpZHRoO1xyXG4gICAgY29uc3QgcGlwZSA9IHRoaXMucXVlcnlTZWxlY3RvcignZGl2Jyk7XHJcbiAgICBwaXBlLnN0eWxlID0gYFxyXG4gICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgkey13IC0gc3BhY2VXaWR0aH1weCk7XHJcbiAgICBgO1xyXG4gIH1cclxuICBmdW5jdGlvbiB1bkFuaW1hdGVQaXBlKGUpIHtcclxuICAgIGNvbnN0IHcgPSBlLnRhcmdldC5vZmZzZXRXaWR0aDtcclxuICAgIGNvbnN0IHBpcGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpO1xyXG4gICAgcGlwZS5zdHlsZSA9IGBcclxuICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMHB4KTtcclxuICAgIGA7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpbVVJKCkge1xyXG4gIGxldCBzUG9zaXRpb24gPSAwO1xyXG4gIGxldCB0aWNraW5nID0gZmFsc2U7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoZSkgPT4ge1xyXG4gICAgc1Bvc2l0aW9uID0gd2luZG93LnNjcm9sbFk7XHJcbiAgICBpZiAoIXRpY2tpbmcpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc29jaWFsLW1lZGlhLW5hdicpO1xyXG4gICAgICAgIChmdW5jdGlvbiBkaW1tZXIoKSB7IHVpLmNsYXNzTGlzdC5hZGQoJ2RpbS11aScpOyB9KCkpO1xyXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHVpLmNsYXNzTGlzdC5yZW1vdmUoJ2RpbS11aScpLCAxMDAwKTtcclxuICAgICAgICB0aWNraW5nID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdGlja2luZyA9IHRydWU7XHJcbiAgfSk7XHJcbn1cclxuIiwiY29uc3QgZmlsZSA9IChmdW5jdGlvbiBmaWxlKCkge1xuICBsZXQgc3JjO1xuICBsZXQgdmFsO1xuICBjb25zdCBiYXNlID0gJ2h0dHBzOi8vYnJhc3RydWxsby5naXRodWIuaW8vcmVzdW1lLyc7XG4gIGNvbnN0IHBkZiA9IGAke2Jhc2V9QnJhZFItSlNEZXYucGRmYDtcbiAgY29uc3QgZG9jID0gWydCcmFkUi1KU0Rldi5wZGYnLCAnQnJhZFItSlNEZXYuZG9jJ107XG5cbiAgZnVuY3Rpb24gc2V0U3JjKCkge1xuICAgIHN3aXRjaCAodmFsKSB7XG4gICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgc3JjID0gYmFzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwZGYnOlxuICAgICAgICBzcmMgPSBiYXNlICsgZG9jWzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RvYyc6XG4gICAgICAgIHNyYyA9IGJhc2UgKyBkb2NbMV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc3JjID0gYmFzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRWYWwoZmlsZXR5cGUpIHsgdmFsID0gZmlsZXR5cGU7IHNldFNyYygpOyB9XG4gIGZ1bmN0aW9uIGdldFZhbCgpIHsgcmV0dXJuIHZhbDsgfVxuICBmdW5jdGlvbiBnZXRTcmMoKSB7IHJldHVybiBzcmM7IH1cbiAgZnVuY3Rpb24gZ2V0UGRmKCkgeyByZXR1cm4gcGRmOyB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXRWYWwsXG4gICAgZ2V0VmFsLFxuICAgIGdldFNyYyxcbiAgICBnZXRQZGYsXG4gIH07XG59KCkpO1xuXG5leHBvcnQgZGVmYXVsdCBmaWxlO1xuIiwiaW1wb3J0IGxvYWRpbmdTY3JlZW4gZnJvbSAnLi9sb2FkaW5nU2NyZWVuJztcclxuaW1wb3J0IGFuaW1hdGVNZW51SXRlbXMgZnJvbSAnLi9hbmltYXRlTWVudUl0ZW0nO1xyXG5pbXBvcnQgZGltVUkgZnJvbSAnLi9kaW1VSSc7XHJcbmltcG9ydCBpbnRyb0FuaW1hdGlvbiBmcm9tICcuL2ludHJvQW5pbWF0aW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRlcigpIHtcclxuICBsb2FkaW5nU2NyZWVuKCk7XHJcbiAgYW5pbWF0ZU1lbnVJdGVtcygpO1xyXG4gIGludHJvQW5pbWF0aW9uKCk7XHJcbiAgZGltVUkoKTtcclxufVxyXG5cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW50cm9BbmltYXRpb24oKSB7XHJcbiAgd2luZG93LnNldFRpbWVvdXQoc3RhcnRJbnRybywgNDAwKTtcclxuICB3aW5kb3cuc2V0VGltZW91dChjbGVhckludHJvQW5pbSwgNDAwMCk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0YXJ0SW50cm8oKSB7XHJcbiAgICBtb3ZlVGV4dCgpO1xyXG4gICAgc2hvd1VpKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtb3ZlVGV4dCgpIHtcclxuICAgIGNvbnN0IGludHJvTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbnRyby1uYW1lJyk7XHJcbiAgICBjb25zdCBpbnRyb0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmludHJvLWJsb2NrJyk7XHJcbiAgICBpbnRyb05hbWUuY2xhc3NMaXN0LmFkZCgnaW50cm8tYW5pbS1tb3ZlLW5hbWUnKTtcclxuICAgIGludHJvQmxvY2suY2xhc3NMaXN0LmFkZCgnaW50cm8tYW5pbS1tb3ZlLWJsb2NrJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzaG93VWkoKSB7XHJcbiAgICBjb25zdCBoZWFkZXJMb2dvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ28nKTtcclxuICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmludHJvLWluaXQtdWknKTtcclxuICAgIGhlYWRlckxvZ28ucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgaGVhZGVyTG9nby5jbGFzc0xpc3QuYWRkKCdoZWFkZXItbG9nbycpO1xyXG4gICAgdWkuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKCdpbnRyby1hbmltLXNob3ctdWknKSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGVhckludHJvQW5pbSgpIHtcclxuICAgIGNvbnN0IGluaXRVSSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnRyby1pbml0LXVpJyk7XHJcbiAgICBjb25zdCBhbmltVUkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW50cm8tYW5pbS1zaG93LXVpJyk7XHJcblxyXG4gICAgaW5pdFVJLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnaW50cm8taW5pdC11aScpKTtcclxuICAgIGluaXRVSS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ludHJvLWFuaW0tc2hvdy11aScpKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IGxvZ28gZnJvbSAnLi9zdmcvbG9nbyc7XG5cbmZ1bmN0aW9uIGxvYWRpbmdTY3JlZW4oKSB7XG4gIGNvbnN0IGJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wJyk7XG4gIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2xvYWRpbmctc2NyZWVuLWJhY2tkcm9wJyk7XG4gIGJhY2tkcm9wLnN0eWxlLmJhY2tncm91bmQgPSBwYXN0ZWxDb2xvcnMoKTtcbiAgZG9jdW1lbnQuYm9keS5zdHlsZSA9ICdvdmVyZmxvdzogaGlkZGVuJztcbiAgYmFja2Ryb3AuaW5zZXJ0QmVmb3JlKGxvZ28oKSwgYmFja2Ryb3AuY2hpbGROb2Rlc1swXSk7XG5cbiAgd2luZG93LnNldFRpbWVvdXQoc2hvd0xvYWRpbmcsIDIwMCk7XG59XG5cbmZ1bmN0aW9uIHNob3dMb2FkaW5nKCkge1xuICBjb25zdCBwYXRoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmdCYXInKTtcbiAgY29uc3QgbGVuZ3RoID0gcGF0aC5nZXRUb3RhbExlbmd0aCgpO1xuXG4gIHBhdGguc3R5bGUudHJhbnNpdGlvbiA9ICdub25lJztcbiAgcGF0aC5zdHlsZS5XZWJraXRUcmFuc2l0aW9uID0gJ25vbmUnO1xuICBwYXRoLnN0eWxlID0gJ29wYWNpdHk6IDEnO1xuICBwYXRoLnN0eWxlLnN0cm9rZURhc2hhcnJheSA9IGAke2xlbmd0aH0gJHtsZW5ndGh9YDtcbiAgcGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gbGVuZ3RoO1xuICBwYXRoLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBwYXRoLnN0eWxlLnRyYW5zaXRpb24gPSAnc3Ryb2tlLWRhc2hvZmZzZXQgMTUwbXMgZWFzZS1pbic7XG4gIHBhdGguc3R5bGUuV2Via2l0VHJhbnNpdGlvbiA9ICdzdHJva2UtZGFzaG9mZnNldCAxNTBtcyBlYXNlLWluJztcbiAgcGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gJzAnO1xuXG4gIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIGNvbnN0IGJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wJyk7XG4gICAgYmFja2Ryb3AucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZSA9ICdvdmVyZmxvdzogdW5zZXQnO1xuICB9XG5cbiAgd2luZG93LnNldFRpbWVvdXQoc3RhcnQsIDM1MCk7XG4gIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHBhc3RlbENvbG9ycygpIHtcbiAgY29uc3QgciA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMjcpICsgMTI3KS50b1N0cmluZygxNik7XG4gIGNvbnN0IGcgPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTI3KSArIDEyNykudG9TdHJpbmcoMTYpO1xuICBjb25zdCBiID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEyNykgKyAxMjcpLnRvU3RyaW5nKDE2KTtcbiAgcmV0dXJuIGAjJHtyfSR7Z30ke2J9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbG9hZGluZ1NjcmVlbjtcbiIsImltcG9ydCBmaWxlIGZyb20gJy4vZG9jSGFuZGxlcic7XHJcbmltcG9ydCB2aWV3SGFuZGxlciBmcm9tICcuL3ZpZXdIYW5kbGVyJztcclxuaW1wb3J0IHsgZWxDbGFzcywgbWFrZUJ0biB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1vZGFsKCkge1xyXG4gIChmdW5jdGlvbiBhZGRNb2RhbCgpIHtcclxuICAgIGNvbnN0IGJnID0gZWxDbGFzcygnZGl2JywgJ21vZGFsLWJhY2tncm91bmQnKTtcclxuICAgIGNvbnN0IHdyYXBwZXIgPSBlbENsYXNzKCdkaXYnLCAnbW9kYWwtd3JhcHBlcicpO1xyXG4gICAgY29uc3QgbWVudSA9IG1vZGFsTWVudSgpO1xyXG4gICAgY29uc3QgY29udGVudCA9IG1vZGFsQ29udGVudCgpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiZyk7XHJcbiAgICBiZy5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobWVudSk7XHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gIH0oKSk7XHJcblxyXG4gIGZ1bmN0aW9uIG1vZGFsTWVudSgpIHtcclxuICAgIGNvbnN0IG1lbnUgPSBlbENsYXNzKCdkaXYnLCAnbW9kYWwtbWVudScpO1xyXG4gICAgY29uc3QgZHJvcGRvd24gPSBkb2NWaWV3RHJvcGRvd24oKTtcclxuICAgIGNvbnN0IHN3aXRjaEJ0biA9IGZpbGVUeXBlU3dpdGNoKCk7XHJcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IGRvd25sb2FkQnV0dHRvbigpO1xyXG4gICAgY29uc3QgcHJpbnRCdG4gPSBtYWtlQnRuKCdwcmludCcsICdwcmludC1idG4gYnRuJyk7XHJcbiAgICBjb25zdCBzaGFyZUJ0biA9IG1ha2VCdG4oJ3NoYXJlJywgJ3NoYXJlLWJ0biBidG4nKTtcclxuICAgIGNvbnN0IGNsb3NlQnRuID0gbWFrZUJ0bignY2xvc2UnLCAnY2xvc2UtYnRuIGJ0bicpO1xyXG4gICAgY29uc3QgY29sdW1uMSA9IGVsQ2xhc3MoJ2RpdicsICdvcHRpb25zLXZpZXcnKTtcclxuICAgIGNvbnN0IGNvbHVtbjIgPSBlbENsYXNzKCdkaXYnLCAnb3B0aW9ucy1hY3Rpb25zJyk7XHJcblxyXG5cclxuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1vZGFsO1xyXG5cclxuICAgIG1lbnUuYXBwZW5kQ2hpbGQoY29sdW1uMSk7XHJcbiAgICBtZW51LmFwcGVuZENoaWxkKGNvbHVtbjIpO1xyXG5cclxuXHJcbiAgICBjb2x1bW4xLmFwcGVuZENoaWxkKGRyb3Bkb3duKTtcclxuICAgIGNvbHVtbjEuYXBwZW5kQ2hpbGQoc3dpdGNoQnRuKTtcclxuXHJcbiAgICBjb2x1bW4yLmFwcGVuZENoaWxkKGRvd25sb2FkQnRuKTtcclxuICAgIGNvbHVtbjIuYXBwZW5kQ2hpbGQocHJpbnRCdG4pO1xyXG4gICAgY29sdW1uMi5hcHBlbmRDaGlsZChzaGFyZUJ0bik7XHJcbiAgICBjb2x1bW4yLmFwcGVuZENoaWxkKGNsb3NlQnRuKTtcclxuXHJcbiAgICBwcmludEJ0bi5pbm5lckhUTUwgPSAncHJpbnQnO1xyXG5cclxuICAgIHJldHVybiBtZW51O1xyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLm1vZGFsLWJhY2tncm91bmQnKS5yZW1vdmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vZGFsQ29udGVudCgpIHtcclxuICAgIGNvbnN0IGlmcmFtZSA9IGVsQ2xhc3MoJ2lmcmFtZScsICdyZXN1bWUtdmlld2VyJyk7XHJcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzcmMnLCAnaHR0cHM6Ly9icmFzdHJ1bGxvLmdpdGh1Yi5pby9yZXN1bWUvJyk7XHJcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCd0aXRsZScsICdyZXN1bWUnKTtcclxuICAgIGlmcmFtZS5pbm5lckhUTUwgPSAnPHA+WW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgaWZyYW1lcy48L3A+JztcclxuICAgIHJldHVybiBpZnJhbWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkb2NWaWV3RHJvcGRvd24oKSB7XHJcbiAgICBjb25zdCBkcm9wZG93biA9IGVsQ2xhc3MoJ3NlbGVjdCcsICdkb2MtdmlldycpO1xyXG4gICAgZHJvcGRvd24uaW5uZXJIVE1MID0gYFxyXG4gICAgICA8b3B0aW9uIHZhbHVlPSdodG1sJyBzZWxlY3RlZD5IVE1MPC9vcHRpb24+XHJcbiAgICAgIDxvcHRpb24gdmFsdWU9J3BkZic+UERGL0RPQzwvb3B0aW9uPlxyXG4gICAgYDtcclxuXHJcbiAgICBkcm9wZG93bi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVWaWV3KTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVWaWV3KCkge1xyXG4gICAgICBmaWxlLnNldFZhbCh0aGlzLnZhbHVlKTtcclxuICAgICAgdmlld0hhbmRsZXIoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkcm9wZG93bjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGZpbGVUeXBlU3dpdGNoKCkge1xyXG4gICAgY29uc3Qgc3dpdGNoQnRuID0gZWxDbGFzcygnbGFiZWwnLCAnZmlsZS10eXBlIHN3aXRjaCBoaWRkZW4nKTtcclxuICAgIGNvbnN0IGNoZWNrYm94ID0gZWxDbGFzcygnaW5wdXQnLCAnZmlsZS10eXBlIGNoZWNrYm94Jyk7XHJcbiAgICBjb25zdCBzbGlkZXIgPSBlbENsYXNzKCdzcGFuJywgJ2ZpbGUtdHlwZSBzbGlkZXIgcm91bmQnKTtcclxuXHJcbiAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcclxuICAgIHN3aXRjaEJ0bi5hcHBlbmRDaGlsZChjaGVja2JveCk7XHJcbiAgICBzd2l0Y2hCdG4uYXBwZW5kQ2hpbGQoc2xpZGVyKTtcclxuXHJcbiAgICBzd2l0Y2hCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVGaWxlVHlwZSk7XHJcbiAgICByZXR1cm4gc3dpdGNoQnRuO1xyXG5cclxuICAgIGZ1bmN0aW9uIHRvZ2dsZUZpbGVUeXBlKCkge1xyXG4gICAgICBjb25zdCBkb3dubG9hZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZC1idG4uYnRuJyk7XHJcbiAgICAgIGNvbnN0IHByaW50QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByaW50LWJ0bi5idG4nKTtcclxuXHJcbiAgICAgIGNvbnN0IHZhbCA9IGNoZWNrYm94LmNoZWNrZWQgPyAnZG9jJyA6ICdwZGYnO1xyXG4gICAgICBmaWxlLnNldFZhbCh2YWwpO1xyXG4gICAgICBkb3dubG9hZEJ0bi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBmaWxlLmdldFNyYygpKTtcclxuICAgICAgZG93bmxvYWRCdG4uc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGBicmFzdHJ1bGxvLWpzZGV2LXJlc3VtZS4ke3ZhbH1gKTtcclxuICAgICAgZG93bmxvYWRCdG4uaW5uZXJIVE1MID0gJ2Rvd25sb2FkICc7XHJcblxyXG4gICAgICBwcmludEJ0bi5zZXRBdHRyaWJ1dGUoJ3ByaW50JywgZmlsZS5nZXRTcmMoKSk7XHJcbiAgICAgIHByaW50QnRuLmlubmVySFRNTCA9ICdwcmludCc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkb3dubG9hZEJ1dHR0b24oKSB7XHJcbiAgICBjb25zdCBidXR0b24gPSBlbENsYXNzKCdhJywgJ2Rvd25sb2FkLWJ0biBidG4gaGlkZGVuJyk7XHJcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdocmVmJywgJ2h0dHBzOi8vYnJhc3RydWxsby5naXRodWIuaW8vcmVzdW1lL0JyYWRSLUpTRGV2LnBkZicpO1xyXG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCAnYnJhc3RydWxsby1qc2Rldi1yZXN1bWUucGRmJyk7XHJcbiAgICBidXR0b24uaW5uZXJIVE1MID0gJ2Rvd25sb2FkJztcclxuICAgIHJldHVybiBidXR0b247XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZ28oKSB7XG4gIGNvbnN0IG1haW5Mb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zaGFkb3dcbiAgbWFpbkxvZ28uaW5uZXJIVE1MID0gYFxuICAgIDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBjbGFzcz0nc3ZnLWxvZ28nIHdpZHRoPScyMDAnIGhlaWdodD0nMjAwJyB2aWV3Ym94PScwIDAgNTAwIDUwMCc+XG4gICAgICA8Zz5cbiAgICAgICAgPHRleHQgeD0nMTEwJyB5PScyNTAnIGZvbnQtZmFtaWx5PSdIZWx2ZXRpY2EnIGZvbnQtc2l6ZT0nMTgwJyBmaWxsPSdyZ2JhKDMwLCAzMCwgMzAsIC44KSc+XG4gICAgICAgICAgYnx8clxuICAgICAgICA8L3RleHQ+XG4gICAgICAgIDxwYXRoIGlkPSdsb2FkaW5nQmFyJyBkPSdNOTAgMzMwIGggMzIwJyBzdHlsZT0nb3BhY2l0eTogMDsnIHN0cm9rZS13aWR0aD0yMCBzdHJva2U9J3JnYmEoMjMwLCAyMzAsIDIzMCwgLjgpJyAvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICBgO1xuICByZXR1cm4gbWFpbkxvZ287XG59XG4iLCIvLyBjc3MgY2xhc3M9XCJzdmctJ3gnY2hldnJvblwiXHJcbmltcG9ydCB7IGVsQ2xhc3MsIG1ha2VCdG4gfSBmcm9tICcuLi8uLi91dGlscyc7XHJcblxyXG5mdW5jdGlvbiB1cENoZXZyb24oKSB7XHJcbiAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICBmcmFnLmlubmVySFRNTCA9IGBcclxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLXVwY2hldnJvblwiIHdpZHRoPVwiODBcIiB2aWV3Ym94PVwiMCAwIDMwIDEyXCI+XHJcbiAgICAgIDxwYXRoIHN0cm9rZS13aWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGQ9XCJNMiAxMCBMIDE1IDIgTCAyOCAxMFwiLz5cclxuICAgIDwvc3ZnPlxyXG4gIGA7XHJcbiAgcmV0dXJuIGZyYWc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRvd25DaGV2cm9uKCkge1xyXG4gIGNvbnN0IGJ1dHRvbiA9IG1ha2VCdG4oJ3Njcm9sbGRvd24nLCAnc2Nyb2xsZG93bicpO1xyXG4gIGJ1dHRvbi5pbm5lckhUTUwgPSBgXHJcbiAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBjbGFzcz1cInN2Zy1kb3duY2hldnJvblwiIHdpZHRoPVwiODBcIiB2aWV3Ym94PVwiMCAwIDMwIDE4XCI+XHJcbiAgICAgIDx0ZXh0IHg9XCI1XCIgeT1cIjRcIiBmb250LXNpemU9XCI0XCIgZm9udC1mYW1pbHk9XCJzYW5zLXNlcmlmXCI+c2Nyb2xsIGRvd248L3RleHQ+XHJcbiAgICAgIDxwYXRoIGNsYXNzPVwiYW5pbWF0ZS1kb3duY2hldnJvblwiIHN0cm9rZS13aWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGQ9XCJNMiA3IEwgMTUgMTUgTCAyOCA3XCIvPlxyXG4gICAgPC9zdmc+XHJcbiAgYDtcclxuICByZXR1cm4gYnV0dG9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsZWZ0Q2hldnJvbigpIHtcclxuICByZXR1cm4gYFxyXG4gIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLWxlZnRjaGV2cm9uXCIgaGVpZ2h0PVwiODBcIiB2aWV3Ym94PVwiMCAwIDEyIDMwXCI+XHJcbiAgICA8cGF0aCBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBkPVwiTTEwIDIgTCAyIDE1IEwgMTAgMjhcIi8+XHJcbiAgPC9zdmc+XHJcbiBgO1xyXG59XHJcblxyXG5mdW5jdGlvbiByaWdodENoZXZyb24oKSB7XHJcbiAgcmV0dXJuIGBcclxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLXJpZ2h0Y2hldnJvblwiIGhlaWdodD1cIjgwXCIgdmlld2JveD1cIjAgMCAxMiAzMFwiPlxyXG4gICAgICA8cGF0aCBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBkPVwiTTIgMiBMIDEwIDE1IEwgMiAyOFwiLz5cclxuICAgIDwvc3ZnPlxyXG4gIGA7XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVwQ2hldnJvbiwgZG93bkNoZXZyb24sIGxlZnRDaGV2cm9uLCByaWdodENoZXZyb24gfTtcclxuIiwiLyogZ2xvYmFsIFZlbG9jaXR5ICovXG5cbmNvbnN0IFZlbG9jaXR5ID0gcmVxdWlyZSgnLi4vLi4vbm9kZV9tb2R1bGVzL3ZlbG9jaXR5LWFuaW1hdGUvdmVsb2NpdHkubWluLmpzJyk7XG5yZXF1aXJlKCcuLi8uLi9ub2RlX21vZHVsZXMvdmVsb2NpdHktYW5pbWF0ZS92ZWxvY2l0eS51aS5taW4uanMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtYnV0dG9uJyk7XG4gIGNvbnN0IGhvbWVMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi1ob21lJyk7XG4gIGNvbnN0IHRleHQgPSBidXR0b24ucXVlcnlTZWxlY3RvcigndGV4dCcpO1xuXG4gIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ29mZicpID8gc2hvd01lbnUoKSA6IGNsb3NlTWVudSgpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgZnVuY3Rpb24gc2hvd01lbnUoKSB7XG4gICAgYnV0dG9uLmNsYXNzTGlzdCA9IGJ1dHRvbi5jbGFzc05hbWUucmVwbGFjZSgvXFxiKG9mZikvLCAnb24nKTtcbiAgICBzdGFnZ2VyLnNob3coKTtcbiAgICB0ZXh0LmlubmVySFRNTCA9ICdjbG9zZSc7XG4gICAgaG9tZUxpbmsuZm9jdXMoKTtcbiAgICBhbmltYXRlTWVudS5vcGVuKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZU1lbnUoKSB7XG4gICAgYnV0dG9uLmNsYXNzTGlzdCA9IGJ1dHRvbi5jbGFzc05hbWUucmVwbGFjZSgvXFxiKG9uKS8sICdvZmYnKTtcbiAgICBzdGFnZ2VyLmhpZGUoKTtcbiAgICB0ZXh0LmlubmVySFRNTCA9ICdtZW51JztcbiAgICBhbmltYXRlTWVudS5jbG9zZSgpO1xuICB9XG59XG5cbmNvbnN0IHN0YWdnZXIgPSAoZnVuY3Rpb24gc3RhZ2dlcigpIHtcbiAgY29uc3QgbWFpbk5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW5hdicpO1xuICBjb25zdCBtZW51SXRlbXMgPSBtYWluTmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG4gIGNvbnN0IGRlbGF5ID0gODA7XG5cbiAgZnVuY3Rpb24gc3RhZ2dlclNob3coKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIG1haW5OYXYuc3R5bGUgPSAnZGlzcGxheTogYmxvY2snO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uIHJ1bigpIHtcbiAgICAgIGlmIChpIDwgbWVudUl0ZW1zLmxlbmd0aCkge1xuICAgICAgICBtZW51SXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnc2hvdy1tZW51LWl0ZW0nKTtcbiAgICAgICAgc2V0VGltZW91dChydW4sIGRlbGF5KTtcbiAgICAgIH1cbiAgICAgIGkgKz0gMTtcbiAgICB9LCBkZWxheSk7XG4gICAgY2xlYXJUaW1lb3V0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFnZ2VySGlkZSgpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gcnVuKCkge1xuICAgICAgaWYgKGkgPCBtZW51SXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIG1lbnVJdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93LW1lbnUtaXRlbScpO1xuICAgICAgICBzZXRUaW1lb3V0KHJ1biwgZGVsYXkpO1xuICAgICAgfVxuICAgICAgaSArPSAxO1xuICAgIH0sIGRlbGF5KTtcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IG1haW5OYXYuc3R5bGUgPSAnZGlzcGxheTogbm9uZSc7IH0sIGRlbGF5ICogbWVudUl0ZW1zLmxlbmd0aCk7XG4gICAgY2xlYXJUaW1lb3V0KCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHNob3c6IHN0YWdnZXJTaG93LFxuICAgIGhpZGU6IHN0YWdnZXJIaWRlLFxuICB9O1xufSgpKTtcblxuY29uc3QgYW5pbWF0ZU1lbnUgPSAoZnVuY3Rpb24gYW5pbWF0ZU1lbnUoKSB7XG4gIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21lbnUtbGluZScpO1xuICBjb25zdCBiMSA9IHN2Z1swXTtcbiAgY29uc3QgYjIgPSBzdmdbMV07XG4gIGNvbnN0IGIzID0gc3ZnWzJdO1xuXG4gIGZ1bmN0aW9uIGFuaW1hdGVPcGVuQnRuKCkge1xuICAgIGNvbnN0IHRvcFNlcSA9IFtcbiAgICAgIHsgZTogYjEsIHA6IHsgdHJhbnNsYXRlWTogNiB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICAgIHsgZTogYjEsIHA6IHsgcm90YXRlWjogNDUgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgXTtcbiAgICBjb25zdCBib3R0b21TZXEgPSBbXG4gICAgICB7IGU6IGIzLCBwOiB7IHRyYW5zbGF0ZVk6IC02IH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgICAgeyBlOiBiMywgcDogeyByb3RhdGVaOiAtNDUgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgXTtcblxuICAgIGIxLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtLW9yaWdpbicsICdjZW50ZXIgY2VudGVyIDAnKTtcbiAgICBiMy5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybS1vcmlnaW4nLCAnY2VudGVyIGNlbnRlciAwJyk7XG4gICAgVmVsb2NpdHkuUnVuU2VxdWVuY2UodG9wU2VxKTtcbiAgICBWZWxvY2l0eShiMiwgeyBvcGFjaXR5OiAwIH0sIDEwMCk7XG4gICAgVmVsb2NpdHkuUnVuU2VxdWVuY2UoYm90dG9tU2VxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFuaW1hdGVDbG9zZUJ0bigpIHtcbiAgICBjb25zdCB0b3BMaW5lID0gW1xuICAgICAgeyBlOiBiMSwgcDogeyByb3RhdGVaOiAwIH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgICAgeyBlOiBiMSwgcDogeyB0cmFuc2xhdGVZOiAwIH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgIF07XG4gICAgY29uc3QgYm90dG9tTGluZSA9IFtcbiAgICAgIHsgZTogYjMsIHA6IHsgcm90YXRlWjogMCB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICAgIHsgZTogYjMsIHA6IHsgdHJhbnNsYXRlWTogMCB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICBdO1xuXG4gICAgVmVsb2NpdHkuUnVuU2VxdWVuY2UodG9wTGluZSk7XG4gICAgVmVsb2NpdHkoYjIsICdyZXZlcnNlJywgMTAwKTtcbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZShib3R0b21MaW5lKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb3BlbjogYW5pbWF0ZU9wZW5CdG4sXG4gICAgY2xvc2U6IGFuaW1hdGVDbG9zZUJ0bixcbiAgfTtcbn0oKSk7XG4iLCJpbXBvcnQgZmlsZSBmcm9tICcuL2RvY0hhbmRsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2aWV3SGFuZGxlcigpIHtcbiAgY29uc3QgZG93bmxvYWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG93bmxvYWQtYnRuLmJ0bicpO1xuICBjb25zdCBpZnJhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdW1lLXZpZXdlcicpO1xuICBjb25zdCBzd2l0Y2hCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsZS10eXBlLnN3aXRjaCcpO1xuXG4gIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGZpbGUuZ2V0U3JjKCkpO1xuXG4gIHN3aXRjaCAoZmlsZS5nZXRWYWwoKSkge1xuICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgc3dpdGNoQnRuLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgc3dpdGNoQnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG4gICAgICBkb3dubG9hZEJ0bi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgIGRvd25sb2FkQnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG4gICAgICBkb3dubG9hZEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncGRmJzpcbiAgICBjYXNlICdkb2MnOlxuICAgICAgc3dpdGNoQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgc3dpdGNoQnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgIGRvd25sb2FkQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgZG93bmxvYWRCdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG59XG4iLCIvKiBlc2xpbnQgaW1wb3J0L2ZpcnN0OiAwIG5vLXVuZGVmOiAwICovXG5pbXBvcnQgJ2JhYmVsLXBvbHlmaWxsJztcbmltcG9ydCB0b2dnbGVNZW51IGZyb20gJy4vY29tcG9uZW50cy90b2dnbGVNZW51JztcbmltcG9ydCBtb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvbW9kYWwnO1xuaW1wb3J0IGZpbGUgZnJvbSAnLi9jb21wb25lbnRzL2RvY0hhbmRsZXInO1xuaW1wb3J0IHsgZG93bkNoZXZyb24gfSBmcm9tICcuL2NvbXBvbmVudHMvc3ZnL3Njcm9sbENoZXZyb24nO1xuaW1wb3J0IGxvYWRlciBmcm9tICcuL2NvbXBvbmVudHMvaW1wb3J0TG9hZGVyJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICBjb25zdCBtZW51QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtYnV0dG9uJyk7XG4gIGNvbnN0IHJlc3VtZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXN1bWVWaWV3ZXInKTtcbiAgY29uc3QgaG9tZVNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1ob21lJyk7XG4gIGNvbnN0IHNjcm9sbENoZXZyb24gPSBkb3duQ2hldnJvbigpO1xuXG4gIG1lbnVCdXR0b24ub25jbGljayA9IHRvZ2dsZU1lbnU7XG4gIHJlc3VtZUJ1dHRvbi5vbmNsaWNrID0gbW9kYWw7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjci15ZWFyJykuaW5uZXJIVE1MID0gYC0gJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9YDtcblxuICBsb2FkZXIoKTtcbiAgZG9jdW1lbnQuYm9keS5zdHlsZSA9ICdkaXNwbGF5OiBibG9jayc7XG4gIG1lbnVCdXR0b24uZm9jdXMoKTtcbiAgaG9tZVNlY3Rpb24uYXBwZW5kQ2hpbGQoc2Nyb2xsQ2hldnJvbik7XG4gIHJldHVybiBldmVudDtcbn0pO1xuIiwiZnVuY3Rpb24gZWxDbGFzcyhlbGVtZW50ID0gJ2RpdicsIGNsYXNzZXMgPSAwKSB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50KTtcbiAgZWwuY2xhc3NMaXN0ID0gY2xhc3NlcztcbiAgcmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBtYWtlQnRuKG5hbWUsIGNsYXNzZXMgPSAwKSB7XG4gIGNvbnN0IGJ1dHRvbiA9IGVsQ2xhc3MoJ2J1dHRvbicsIGNsYXNzZXMpO1xuICBidXR0b24uc2V0QXR0cmlidXRlKCduYW1lJywgbmFtZSk7XG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gIGJ1dHRvbi5pbm5lckhUTUwgPSBuYW1lO1xuICByZXR1cm4gYnV0dG9uO1xufVxuXG5leHBvcnQgeyBlbENsYXNzLCBtYWtlQnRuIH07XG4iXX0=
