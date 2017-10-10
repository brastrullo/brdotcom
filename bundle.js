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

},{"../utils":203}],191:[function(require,module,exports){
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
  return true;
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
    document.body.style.cssText = 'overflow: unset';
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

},{"../utils":203,"./docHandler":192,"./viewHandler":201}],197:[function(require,module,exports){
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

},{"../../utils":203}],199:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = viewIcon;
function viewIcon() {
  var eye = document.createElement('span'); // eslint-disable-line no-shadow
  eye.innerHTML = '\n    <svg xmlns=\'http://www.w3.org/2000/svg\' class=\'svg-view-icon\' width=\'20\' viewbox=\'0 0 210 140\'>\n       <path d="M5 70 A 110 100 0 0 1 200 70 A 110 100 0 0 1 5 70" stroke="none" fill="lightgrey" stroke-width="1"/>\n      <circle cx="105" cy="70" r="35" stroke="white" fill="lightgrey" stroke-width="5">\n    </svg>\n  ';
  eye.style.cssText = '\n    display: inline-block;\n    vertical-align: middle;\n    margin-top: .25em;\n    margin-right: .25em;\n  ';
  return eye;
}

},{}],200:[function(require,module,exports){
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

},{"../../node_modules/velocity-animate/velocity.min.js":188,"../../node_modules/velocity-animate/velocity.ui.min.js":189}],201:[function(require,module,exports){
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

},{"./docHandler":192}],202:[function(require,module,exports){
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
  var scrollChevron = (0, _scrollChevron.downChevron)();
  var iconSvg = (0, _viewIcon2.default)();

  resumeBtn.insertBefore(iconSvg, resumeBtn.childNodes[0]);

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
})(); // foreach

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

},{"./components/docHandler":192,"./components/importLoader":193,"./components/modal":196,"./components/svg/scrollChevron":198,"./components/svg/viewIcon":199,"./components/toggleMenu":200,"core-js/modules/es6.array.copy-within":102,"core-js/modules/es6.array.fill":103,"core-js/modules/es6.array.find":105,"core-js/modules/es6.array.find-index":104,"core-js/modules/es6.array.from":106,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.array.of":108,"core-js/modules/es6.function.name":109,"core-js/modules/es6.map":110,"core-js/modules/es6.math.acosh":111,"core-js/modules/es6.math.asinh":112,"core-js/modules/es6.math.atanh":113,"core-js/modules/es6.math.cbrt":114,"core-js/modules/es6.math.clz32":115,"core-js/modules/es6.math.cosh":116,"core-js/modules/es6.math.expm1":117,"core-js/modules/es6.math.fround":118,"core-js/modules/es6.math.hypot":119,"core-js/modules/es6.math.imul":120,"core-js/modules/es6.math.log10":121,"core-js/modules/es6.math.log1p":122,"core-js/modules/es6.math.log2":123,"core-js/modules/es6.math.sign":124,"core-js/modules/es6.math.sinh":125,"core-js/modules/es6.math.tanh":126,"core-js/modules/es6.math.trunc":127,"core-js/modules/es6.number.epsilon":128,"core-js/modules/es6.number.is-finite":129,"core-js/modules/es6.number.is-integer":130,"core-js/modules/es6.number.is-nan":131,"core-js/modules/es6.number.is-safe-integer":132,"core-js/modules/es6.number.max-safe-integer":133,"core-js/modules/es6.number.min-safe-integer":134,"core-js/modules/es6.object.assign":135,"core-js/modules/es6.object.is":136,"core-js/modules/es6.object.set-prototype-of":137,"core-js/modules/es6.promise":138,"core-js/modules/es6.reflect.apply":139,"core-js/modules/es6.reflect.construct":140,"core-js/modules/es6.reflect.define-property":141,"core-js/modules/es6.reflect.delete-property":142,"core-js/modules/es6.reflect.get":145,"core-js/modules/es6.reflect.get-own-property-descriptor":143,"core-js/modules/es6.reflect.get-prototype-of":144,"core-js/modules/es6.reflect.has":146,"core-js/modules/es6.reflect.is-extensible":147,"core-js/modules/es6.reflect.own-keys":148,"core-js/modules/es6.reflect.prevent-extensions":149,"core-js/modules/es6.reflect.set":151,"core-js/modules/es6.reflect.set-prototype-of":150,"core-js/modules/es6.regexp.flags":152,"core-js/modules/es6.regexp.match":153,"core-js/modules/es6.regexp.replace":154,"core-js/modules/es6.regexp.search":155,"core-js/modules/es6.regexp.split":156,"core-js/modules/es6.set":157,"core-js/modules/es6.string.code-point-at":158,"core-js/modules/es6.string.ends-with":159,"core-js/modules/es6.string.from-code-point":160,"core-js/modules/es6.string.includes":161,"core-js/modules/es6.string.raw":162,"core-js/modules/es6.string.repeat":163,"core-js/modules/es6.string.starts-with":164,"core-js/modules/es6.symbol":165,"core-js/modules/es6.typed.array-buffer":166,"core-js/modules/es6.typed.float32-array":167,"core-js/modules/es6.typed.float64-array":168,"core-js/modules/es6.typed.int16-array":169,"core-js/modules/es6.typed.int32-array":170,"core-js/modules/es6.typed.int8-array":171,"core-js/modules/es6.typed.uint16-array":172,"core-js/modules/es6.typed.uint32-array":173,"core-js/modules/es6.typed.uint8-array":174,"core-js/modules/es6.typed.uint8-clamped-array":175,"core-js/modules/es6.weak-map":176,"core-js/modules/es6.weak-set":177,"core-js/modules/es7.array.includes":178,"core-js/modules/es7.object.entries":179,"core-js/modules/es7.object.get-own-property-descriptors":180,"core-js/modules/es7.object.values":181,"core-js/modules/es7.string.pad-end":182,"core-js/modules/es7.string.pad-start":183,"core-js/modules/web.dom.iterable":184,"core-js/modules/web.immediate":185,"core-js/modules/web.timers":186,"regenerator-runtime/runtime":187}],203:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function elClass() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
  var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var el = document.createElement(element);
  el.classList.add(classes);
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

},{}]},{},[202])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi13ZWFrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2tleW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21hdGgtZXhwbTEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19tYXRoLWxvZzFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWF0aC1zaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21pY3JvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcG4tZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC10by1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX293bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcGFydGlhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3BhdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zYW1lLXZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctcGFkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLXJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdHlwZWQtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC1idWZmZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190eXBlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MtZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmluZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lm9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguYWNvc2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmFzaW5oLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5hdGFuaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY2JydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY2x6MzIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmNvc2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmV4cG0xLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5mcm91bmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmh5cG90LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5pbXVsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5sb2cxMC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgubG9nMXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmxvZzIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnNpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnNpbmguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnRhbmguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnRydW5jLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmVwc2lsb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtZmluaXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmlzLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtbmFuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmlzLXNhZmUtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5tYXgtc2FmZS1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLm1pbi1zYWZlLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5hcHBseS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuY29uc3RydWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlbGV0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5nZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5nZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0Lmhhcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuaXMtZXh0ZW5zaWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3Qub3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LnByZXZlbnQtZXh0ZW5zaW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3Quc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLmZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLm1hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuc2VhcmNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnNwbGl0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmNvZGUtcG9pbnQtYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuZW5kcy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yYXcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcucmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuYXJyYXktYnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuZmxvYXQzMi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLmZsb2F0NjQtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi50eXBlZC5pbnQxNi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLmludDMyLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQuaW50OC1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLnVpbnQxNi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLnVpbnQzMi1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnR5cGVkLnVpbnQ4LWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYudHlwZWQudWludDgtY2xhbXBlZC1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYud2Vhay1zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5hcnJheS5pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5lbnRyaWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QudmFsdWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3RyaW5nLnBhZC1lbmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcucGFkLXN0YXJ0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuaW1tZWRpYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIudGltZXJzLmpzIiwibm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlc1xcdmVsb2NpdHktYW5pbWF0ZVxcdmVsb2NpdHkubWluLmpzIiwibm9kZV9tb2R1bGVzXFx2ZWxvY2l0eS1hbmltYXRlXFx2ZWxvY2l0eS51aS5taW4uanMiLCJzcmNcXGNvbXBvbmVudHNcXGFuaW1hdGVNZW51SXRlbS5qcyIsInNyY1xcY29tcG9uZW50c1xcZGltVUkuanMiLCJzcmNcXGNvbXBvbmVudHNcXGRvY0hhbmRsZXIuanMiLCJzcmNcXGNvbXBvbmVudHNcXGltcG9ydExvYWRlci5qcyIsInNyY1xcY29tcG9uZW50c1xcaW50cm9BbmltYXRpb24uanMiLCJzcmNcXGNvbXBvbmVudHNcXGxvYWRpbmdTY3JlZW4uanMiLCJzcmNcXGNvbXBvbmVudHNcXG1vZGFsLmpzIiwic3JjXFxjb21wb25lbnRzXFxzdmdcXGxvZ28uanMiLCJzcmNcXGNvbXBvbmVudHNcXHN2Z1xcc2Nyb2xsQ2hldnJvbi5qcyIsInNyY1xcY29tcG9uZW50c1xcc3ZnXFx2aWV3SWNvbi5qcyIsInNyY1xcY29tcG9uZW50c1xcdG9nZ2xlTWVudS5qcyIsInNyY1xcY29tcG9uZW50c1xcdmlld0hhbmRsZXIuanMiLCJzcmNcXHNjcmlwdC5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTs7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDaHVCQTtBQUNBO0FBQ0EsQ0FBQyxVQUFTLENBQVQsRUFBVztBQUFDO0FBQWEsV0FBUyxDQUFULENBQVcsQ0FBWCxF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O0FBQ0Q7O1FBRVEsTyxHQUFBLE87UUFBUyxPLEdBQUEsTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyAyMi4xLjMuMzEgQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG52YXIgVU5TQ09QQUJMRVMgPSByZXF1aXJlKCcuL193a3MnKSgndW5zY29wYWJsZXMnKVxuICAsIEFycmF5UHJvdG8gID0gQXJyYXkucHJvdG90eXBlO1xuaWYoQXJyYXlQcm90b1tVTlNDT1BBQkxFU10gPT0gdW5kZWZpbmVkKXJlcXVpcmUoJy4vX2hpZGUnKShBcnJheVByb3RvLCBVTlNDT1BBQkxFUywge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICBBcnJheVByb3RvW1VOU0NPUEFCTEVTXVtrZXldID0gdHJ1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgQ29uc3RydWN0b3IsIG5hbWUsIGZvcmJpZGRlbkZpZWxkKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpe1xuICAgIHRocm93IFR5cGVFcnJvcihuYW1lICsgJzogaW5jb3JyZWN0IGludm9jYXRpb24hJyk7XG4gIH0gcmV0dXJuIGl0O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyAyMi4xLjMuMyBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCBlbmQgPSB0aGlzLmxlbmd0aClcbid1c2Ugc3RyaWN0JztcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgdG9JbmRleCAgPSByZXF1aXJlKCcuL190by1pbmRleCcpXG4gICwgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBbXS5jb3B5V2l0aGluIHx8IGZ1bmN0aW9uIGNvcHlXaXRoaW4odGFyZ2V0Lyo9IDAqLywgc3RhcnQvKj0gMCwgZW5kID0gQGxlbmd0aCovKXtcbiAgdmFyIE8gICAgID0gdG9PYmplY3QodGhpcylcbiAgICAsIGxlbiAgID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgLCB0byAgICA9IHRvSW5kZXgodGFyZ2V0LCBsZW4pXG4gICAgLCBmcm9tICA9IHRvSW5kZXgoc3RhcnQsIGxlbilcbiAgICAsIGVuZCAgID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWRcbiAgICAsIGNvdW50ID0gTWF0aC5taW4oKGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogdG9JbmRleChlbmQsIGxlbikpIC0gZnJvbSwgbGVuIC0gdG8pXG4gICAgLCBpbmMgICA9IDE7XG4gIGlmKGZyb20gPCB0byAmJiB0byA8IGZyb20gKyBjb3VudCl7XG4gICAgaW5jICA9IC0xO1xuICAgIGZyb20gKz0gY291bnQgLSAxO1xuICAgIHRvICAgKz0gY291bnQgLSAxO1xuICB9XG4gIHdoaWxlKGNvdW50LS0gPiAwKXtcbiAgICBpZihmcm9tIGluIE8pT1t0b10gPSBPW2Zyb21dO1xuICAgIGVsc2UgZGVsZXRlIE9bdG9dO1xuICAgIHRvICAgKz0gaW5jO1xuICAgIGZyb20gKz0gaW5jO1xuICB9IHJldHVybiBPO1xufTsiLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbid1c2Ugc3RyaWN0JztcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgdG9JbmRleCAgPSByZXF1aXJlKCcuL190by1pbmRleCcpXG4gICwgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmlsbCh2YWx1ZSAvKiwgc3RhcnQgPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcbiAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXG4gICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAsIGFMZW4gICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IHRvSW5kZXgoYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIGxlbmd0aClcbiAgICAsIGVuZCAgICA9IGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkXG4gICAgLCBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW5kZXgoZW5kLCBsZW5ndGgpO1xuICB3aGlsZShlbmRQb3MgPiBpbmRleClPW2luZGV4KytdID0gdmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgdG9JbmRleCAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGZyb21JbmRleCwgbGVuZ3RoKVxuICAgICAgLCB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjdG9JbmRleCBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07IiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyIGN0eCAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgYXNjICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUWVBFLCAkY3JlYXRlKXtcbiAgdmFyIElTX01BUCAgICAgICAgPSBUWVBFID09IDFcbiAgICAsIElTX0ZJTFRFUiAgICAgPSBUWVBFID09IDJcbiAgICAsIElTX1NPTUUgICAgICAgPSBUWVBFID09IDNcbiAgICAsIElTX0VWRVJZICAgICAgPSBUWVBFID09IDRcbiAgICAsIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDZcbiAgICAsIE5PX0hPTEVTICAgICAgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWFxuICAgICwgY3JlYXRlICAgICAgICA9ICRjcmVhdGUgfHwgYXNjO1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQpe1xuICAgIHZhciBPICAgICAgPSB0b09iamVjdCgkdGhpcylcbiAgICAgICwgc2VsZiAgID0gSU9iamVjdChPKVxuICAgICAgLCBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IDBcbiAgICAgICwgcmVzdWx0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZFxuICAgICAgLCB2YWwsIHJlcztcbiAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpe1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYoVFlQRSl7XG4gICAgICAgIGlmKElTX01BUClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2goVFlQRSl7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZihJU19FVkVSWSlyZXR1cm4gZmFsc2U7ICAgICAgICAgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaXNBcnJheSAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgU1BFQ0lFUyAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsKXtcbiAgdmFyIEM7XG4gIGlmKGlzQXJyYXkob3JpZ2luYWwpKXtcbiAgICBDID0gb3JpZ2luYWwuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZih0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpQyA9IHVuZGVmaW5lZDtcbiAgICBpZihpc09iamVjdChDKSl7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmKEMgPT09IG51bGwpQyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gcmV0dXJuIEMgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQztcbn07IiwiLy8gOS40LjIuMyBBcnJheVNwZWNpZXNDcmVhdGUob3JpZ2luYWxBcnJheSwgbGVuZ3RoKVxudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGVuZ3RoKXtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFGdW5jdGlvbiAgPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBpc09iamVjdCAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBpbnZva2UgICAgID0gcmVxdWlyZSgnLi9faW52b2tlJylcbiAgLCBhcnJheVNsaWNlID0gW10uc2xpY2VcbiAgLCBmYWN0b3JpZXMgID0ge307XG5cbnZhciBjb25zdHJ1Y3QgPSBmdW5jdGlvbihGLCBsZW4sIGFyZ3Mpe1xuICBpZighKGxlbiBpbiBmYWN0b3JpZXMpKXtcbiAgICBmb3IodmFyIG4gPSBbXSwgaSA9IDA7IGkgPCBsZW47IGkrKyluW2ldID0gJ2FbJyArIGkgKyAnXSc7XG4gICAgZmFjdG9yaWVzW2xlbl0gPSBGdW5jdGlvbignRixhJywgJ3JldHVybiBuZXcgRignICsgbi5qb2luKCcsJykgKyAnKScpO1xuICB9IHJldHVybiBmYWN0b3JpZXNbbGVuXShGLCBhcmdzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24uYmluZCB8fCBmdW5jdGlvbiBiaW5kKHRoYXQgLyosIGFyZ3MuLi4gKi8pe1xuICB2YXIgZm4gICAgICAgPSBhRnVuY3Rpb24odGhpcylcbiAgICAsIHBhcnRBcmdzID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBib3VuZCA9IGZ1bmN0aW9uKC8qIGFyZ3MuLi4gKi8pe1xuICAgIHZhciBhcmdzID0gcGFydEFyZ3MuY29uY2F0KGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIGJvdW5kID8gY29uc3RydWN0KGZuLCBhcmdzLmxlbmd0aCwgYXJncykgOiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xuICB9O1xuICBpZihpc09iamVjdChmbi5wcm90b3R5cGUpKWJvdW5kLnByb3RvdHlwZSA9IGZuLnByb3RvdHlwZTtcbiAgcmV0dXJuIGJvdW5kO1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGNyZWF0ZSAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBhbkluc3RhbmNlICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBkZWZpbmVkICAgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKVxuICAsIGZvck9mICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJylcbiAgLCBzdGVwICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgc2V0U3BlY2llcyAgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgZmFzdEtleSAgICAgPSByZXF1aXJlKCcuL19tZXRhJykuZmFzdEtleVxuICAsIFNJWkUgICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnO1xuXG52YXIgZ2V0RW50cnkgPSBmdW5jdGlvbih0aGF0LCBrZXkpe1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpLCBlbnRyeTtcbiAgaWYoaW5kZXggIT09ICdGJylyZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IoZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICBpZihlbnRyeS5rID09IGtleSlyZXR1cm4gZW50cnk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll9pID0gY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgLy8gZmlyc3QgZW50cnlcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7ICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKXtcbiAgICAgICAgZm9yKHZhciB0aGF0ID0gdGhpcywgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICAgLCBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmKGVudHJ5KXtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cbiAgICAgICAgICAgICwgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0Ll9mID09IGVudHJ5KXRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmKHRoYXQuX2wgPT0gZW50cnkpdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsICdmb3JFYWNoJyk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKVxuICAgICAgICAgICwgZW50cnk7XG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZil7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZihERVNDUklQVE9SUylkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBkZWZpbmVkKHRoaXNbU0laRV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSlcbiAgICAgICwgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYoZW50cnkpe1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYoIXRoYXQuX2YpdGhhdC5fZiA9IGVudHJ5O1xuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYoaW5kZXggIT09ICdGJyl0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbihDLCBOQU1FLCBJU19NQVApe1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICAkaXRlckRlZmluZShDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICAgICB0aGlzLl90ID0gaXRlcmF0ZWQ7ICAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7IC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgLCBraW5kICA9IHRoYXQuX2tcbiAgICAgICAgLCBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpe1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJyAsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciByZWRlZmluZUFsbCAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgZ2V0V2VhayAgICAgICAgICAgPSByZXF1aXJlKCcuL19tZXRhJykuZ2V0V2Vha1xuICAsIGFuT2JqZWN0ICAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBpc09iamVjdCAgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYW5JbnN0YW5jZSAgICAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZm9yT2YgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIGNyZWF0ZUFycmF5TWV0aG9kID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpXG4gICwgJGhhcyAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIGFycmF5RmluZCAgICAgICAgID0gY3JlYXRlQXJyYXlNZXRob2QoNSlcbiAgLCBhcnJheUZpbmRJbmRleCAgICA9IGNyZWF0ZUFycmF5TWV0aG9kKDYpXG4gICwgaWQgICAgICAgICAgICAgICAgPSAwO1xuXG4vLyBmYWxsYmFjayBmb3IgdW5jYXVnaHQgZnJvemVuIGtleXNcbnZhciB1bmNhdWdodEZyb3plblN0b3JlID0gZnVuY3Rpb24odGhhdCl7XG4gIHJldHVybiB0aGF0Ll9sIHx8ICh0aGF0Ll9sID0gbmV3IFVuY2F1Z2h0RnJvemVuU3RvcmUpO1xufTtcbnZhciBVbmNhdWdodEZyb3plblN0b3JlID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5hID0gW107XG59O1xudmFyIGZpbmRVbmNhdWdodEZyb3plbiA9IGZ1bmN0aW9uKHN0b3JlLCBrZXkpe1xuICByZXR1cm4gYXJyYXlGaW5kKHN0b3JlLmEsIGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcbiAgfSk7XG59O1xuVW5jYXVnaHRGcm96ZW5TdG9yZS5wcm90b3R5cGUgPSB7XG4gIGdldDogZnVuY3Rpb24oa2V5KXtcbiAgICB2YXIgZW50cnkgPSBmaW5kVW5jYXVnaHRGcm96ZW4odGhpcywga2V5KTtcbiAgICBpZihlbnRyeSlyZXR1cm4gZW50cnlbMV07XG4gIH0sXG4gIGhhczogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gISFmaW5kVW5jYXVnaHRGcm96ZW4odGhpcywga2V5KTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBmaW5kVW5jYXVnaHRGcm96ZW4odGhpcywga2V5KTtcbiAgICBpZihlbnRyeSllbnRyeVsxXSA9IHZhbHVlO1xuICAgIGVsc2UgdGhpcy5hLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSxcbiAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgdmFyIGluZGV4ID0gYXJyYXlGaW5kSW5kZXgodGhpcy5hLCBmdW5jdGlvbihpdCl7XG4gICAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcbiAgICB9KTtcbiAgICBpZih+aW5kZXgpdGhpcy5hLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuICEhfmluZGV4O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5faSA9IGlkKys7ICAgICAgLy8gY29sbGVjdGlvbiBpZFxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgLy8gbGVhayBzdG9yZSBmb3IgdW5jYXVnaHQgZnJvemVuIG9iamVjdHNcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjMuMy4yIFdlYWtNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy40LjMuMyBXZWFrU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgZGF0YSA9IGdldFdlYWsoa2V5KTtcbiAgICAgICAgaWYoZGF0YSA9PT0gdHJ1ZSlyZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZSh0aGlzKVsnZGVsZXRlJ10oa2V5KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgJiYgJGhhcyhkYXRhLCB0aGlzLl9pKSAmJiBkZWxldGUgZGF0YVt0aGlzLl9pXTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4zLjMuNCBXZWFrTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuNC4zLjQgV2Vha1NldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgZGF0YSA9IGdldFdlYWsoa2V5KTtcbiAgICAgICAgaWYoZGF0YSA9PT0gdHJ1ZSlyZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZSh0aGlzKS5oYXMoa2V5KTtcbiAgICAgICAgcmV0dXJuIGRhdGEgJiYgJGhhcyhkYXRhLCB0aGlzLl9pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZGF0YSA9IGdldFdlYWsoYW5PYmplY3Qoa2V5KSwgdHJ1ZSk7XG4gICAgaWYoZGF0YSA9PT0gdHJ1ZSl1bmNhdWdodEZyb3plblN0b3JlKHRoYXQpLnNldChrZXksIHZhbHVlKTtcbiAgICBlbHNlIGRhdGFbdGhhdC5faV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhhdDtcbiAgfSxcbiAgdWZzdG9yZTogdW5jYXVnaHRGcm96ZW5TdG9yZVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsICRleHBvcnQgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCByZWRlZmluZUFsbCAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgbWV0YSAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19tZXRhJylcbiAgLCBmb3JPZiAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgYW5JbnN0YW5jZSAgICAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgaXNPYmplY3QgICAgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGZhaWxzICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsICRpdGVyRGV0ZWN0ICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKVxuICAsIHNldFRvU3RyaW5nVGFnICAgID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGluaGVyaXRJZlJlcXVpcmVkID0gcmVxdWlyZSgnLi9faW5oZXJpdC1pZi1yZXF1aXJlZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gZ2xvYmFsW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICB2YXIgZml4TWV0aG9kID0gZnVuY3Rpb24oS0VZKXtcbiAgICB2YXIgZm4gPSBwcm90b1tLRVldO1xuICAgIHJlZGVmaW5lKHByb3RvLCBLRVksXG4gICAgICBLRVkgPT0gJ2RlbGV0ZScgPyBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gZmFsc2UgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdoYXMnID8gZnVuY3Rpb24gaGFzKGEpe1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoYSl7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IHVuZGVmaW5lZCA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2FkZCcgPyBmdW5jdGlvbiBhZGQoYSl7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTsgcmV0dXJuIHRoaXM7IH1cbiAgICAgICAgOiBmdW5jdGlvbiBzZXQoYSwgYil7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTsgcmV0dXJuIHRoaXM7IH1cbiAgICApO1xuICB9O1xuICBpZih0eXBlb2YgQyAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBwcm90by5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbigpe1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKXtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICAgIG1ldGEuTkVFRCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGluc3RhbmNlICAgICAgICAgICAgID0gbmV3IENcbiAgICAgIC8vIGVhcmx5IGltcGxlbWVudGF0aW9ucyBub3Qgc3VwcG9ydHMgY2hhaW5pbmdcbiAgICAgICwgSEFTTlRfQ0hBSU5JTkcgICAgICAgPSBpbnN0YW5jZVtBRERFUl0oSVNfV0VBSyA/IHt9IDogLTAsIDEpICE9IGluc3RhbmNlXG4gICAgICAvLyBWOCB+ICBDaHJvbWl1bSA0MC0gd2Vhay1jb2xsZWN0aW9ucyB0aHJvd3Mgb24gcHJpbWl0aXZlcywgYnV0IHNob3VsZCByZXR1cm4gZmFsc2VcbiAgICAgICwgVEhST1dTX09OX1BSSU1JVElWRVMgPSBmYWlscyhmdW5jdGlvbigpeyBpbnN0YW5jZS5oYXMoMSk7IH0pXG4gICAgICAvLyBtb3N0IGVhcmx5IGltcGxlbWVudGF0aW9ucyBkb2Vzbid0IHN1cHBvcnRzIGl0ZXJhYmxlcywgbW9zdCBtb2Rlcm4gLSBub3QgY2xvc2UgaXQgY29ycmVjdGx5XG4gICAgICAsIEFDQ0VQVF9JVEVSQUJMRVMgICAgID0gJGl0ZXJEZXRlY3QoZnVuY3Rpb24oaXRlcil7IG5ldyBDKGl0ZXIpOyB9KSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgICAgLy8gZm9yIGVhcmx5IGltcGxlbWVudGF0aW9ucyAtMCBhbmQgKzAgbm90IHRoZSBzYW1lXG4gICAgICAsIEJVR0dZX1pFUk8gPSAhSVNfV0VBSyAmJiBmYWlscyhmdW5jdGlvbigpe1xuICAgICAgICAvLyBWOCB+IENocm9taXVtIDQyLSBmYWlscyBvbmx5IHdpdGggNSsgZWxlbWVudHNcbiAgICAgICAgdmFyICRpbnN0YW5jZSA9IG5ldyBDKClcbiAgICAgICAgICAsIGluZGV4ICAgICA9IDU7XG4gICAgICAgIHdoaWxlKGluZGV4LS0pJGluc3RhbmNlW0FEREVSXShpbmRleCwgaW5kZXgpO1xuICAgICAgICByZXR1cm4gISRpbnN0YW5jZS5oYXMoLTApO1xuICAgICAgfSk7XG4gICAgaWYoIUFDQ0VQVF9JVEVSQUJMRVMpeyBcbiAgICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRhcmdldCwgaXRlcmFibGUpe1xuICAgICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gaW5oZXJpdElmUmVxdWlyZWQobmV3IEJhc2UsIHRhcmdldCwgQyk7XG4gICAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgfSk7XG4gICAgICBDLnByb3RvdHlwZSA9IHByb3RvO1xuICAgICAgcHJvdG8uY29uc3RydWN0b3IgPSBDO1xuICAgIH1cbiAgICBpZihUSFJPV1NfT05fUFJJTUlUSVZFUyB8fCBCVUdHWV9aRVJPKXtcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XG4gICAgfVxuICAgIGlmKEJVR0dZX1pFUk8gfHwgSEFTTlRfQ0hBSU5JTkcpZml4TWV0aG9kKEFEREVSKTtcbiAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIHNob3VsZCBub3QgY29udGFpbnMgLmNsZWFyIG1ldGhvZFxuICAgIGlmKElTX1dFQUsgJiYgcHJvdG8uY2xlYXIpZGVsZXRlIHByb3RvLmNsZWFyO1xuICB9XG5cbiAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogKEMgIT0gQmFzZSksIE8pO1xuXG4gIGlmKCFJU19XRUFLKWNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIGluZGV4LCB2YWx1ZSl7XG4gIGlmKGluZGV4IGluIG9iamVjdCkkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTsiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7IiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgcmVzdWx0ICAgICA9IGdldEtleXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICBpZihnZXRTeW1ib2xzKXtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpXG4gICAgICAsIGlzRW51bSAgPSBwSUUuZlxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoc3ltYm9scy5sZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmUgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pXG4gICAgLCBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYodGFyZ2V0KXJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmKGV4cG9ydHNba2V5XSAhPSBvdXQpaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWAgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwidmFyIE1BVENIID0gcmVxdWlyZSgnLi9fd2tzJykoJ21hdGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSl7XG4gIHZhciByZSA9IC8uLztcbiAgdHJ5IHtcbiAgICAnLy4vJ1tLRVldKHJlKTtcbiAgfSBjYXRjaChlKXtcbiAgICB0cnkge1xuICAgICAgcmVbTUFUQ0hdID0gZmFsc2U7XG4gICAgICByZXR1cm4gIScvLi8nW0tFWV0ocmUpO1xuICAgIH0gY2F0Y2goZil7IC8qIGVtcHR5ICovIH1cbiAgfSByZXR1cm4gdHJ1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGhpZGUgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgZmFpbHMgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgZGVmaW5lZCAgPSByZXF1aXJlKCcuL19kZWZpbmVkJylcbiAgLCB3a3MgICAgICA9IHJlcXVpcmUoJy4vX3drcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgbGVuZ3RoLCBleGVjKXtcbiAgdmFyIFNZTUJPTCAgID0gd2tzKEtFWSlcbiAgICAsIGZucyAgICAgID0gZXhlYyhkZWZpbmVkLCBTWU1CT0wsICcnW0tFWV0pXG4gICAgLCBzdHJmbiAgICA9IGZuc1swXVxuICAgICwgcnhmbiAgICAgPSBmbnNbMV07XG4gIGlmKGZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgdmFyIE8gPSB7fTtcbiAgICBPW1NZTUJPTF0gPSBmdW5jdGlvbigpeyByZXR1cm4gNzsgfTtcbiAgICByZXR1cm4gJydbS0VZXShPKSAhPSA3O1xuICB9KSl7XG4gICAgcmVkZWZpbmUoU3RyaW5nLnByb3RvdHlwZSwgS0VZLCBzdHJmbik7XG4gICAgaGlkZShSZWdFeHAucHJvdG90eXBlLCBTWU1CT0wsIGxlbmd0aCA9PSAyXG4gICAgICAvLyAyMS4yLjUuOCBSZWdFeHAucHJvdG90eXBlW0BAcmVwbGFjZV0oc3RyaW5nLCByZXBsYWNlVmFsdWUpXG4gICAgICAvLyAyMS4yLjUuMTEgUmVnRXhwLnByb3RvdHlwZVtAQHNwbGl0XShzdHJpbmcsIGxpbWl0KVxuICAgICAgPyBmdW5jdGlvbihzdHJpbmcsIGFyZyl7IHJldHVybiByeGZuLmNhbGwoc3RyaW5nLCB0aGlzLCBhcmcpOyB9XG4gICAgICAvLyAyMS4yLjUuNiBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdKHN0cmluZylcbiAgICAgIC8vIDIxLjIuNS45IFJlZ0V4cC5wcm90b3R5cGVbQEBzZWFyY2hdKHN0cmluZylcbiAgICAgIDogZnVuY3Rpb24oc3RyaW5nKXsgcmV0dXJuIHJ4Zm4uY2FsbChzdHJpbmcsIHRoaXMpOyB9XG4gICAgKTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG4vLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFnc1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aGF0ICAgPSBhbk9iamVjdCh0aGlzKVxuICAgICwgcmVzdWx0ID0gJyc7XG4gIGlmKHRoYXQuZ2xvYmFsKSAgICAgcmVzdWx0ICs9ICdnJztcbiAgaWYodGhhdC5pZ25vcmVDYXNlKSByZXN1bHQgKz0gJ2knO1xuICBpZih0aGF0Lm11bHRpbGluZSkgIHJlc3VsdCArPSAnbSc7XG4gIGlmKHRoYXQudW5pY29kZSkgICAgcmVzdWx0ICs9ICd1JztcbiAgaWYodGhhdC5zdGlja3kpICAgICByZXN1bHQgKz0gJ3knO1xuICByZXR1cm4gcmVzdWx0O1xufTsiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpXG4gICwgQlJFQUsgICAgICAgPSB7fVxuICAsIFJFVFVSTiAgICAgID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUil7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvciwgcmVzdWx0O1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZihpc0FycmF5SXRlcihpdGVyRm4pKWZvcihsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgcmVzdWx0ID0gZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIHJlc3VsdCA9IGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGhhdCwgdGFyZ2V0LCBDKXtcbiAgdmFyIFAsIFMgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIGlmKFMgIT09IEMgJiYgdHlwZW9mIFMgPT0gJ2Z1bmN0aW9uJyAmJiAoUCA9IFMucHJvdG90eXBlKSAhPT0gQy5wcm90b3R5cGUgJiYgaXNPYmplY3QoUCkgJiYgc2V0UHJvdG90eXBlT2Ype1xuICAgIHNldFByb3RvdHlwZU9mKHRoYXQsIFApO1xuICB9IHJldHVybiB0aGF0O1xufTsiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKXtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59OyIsIi8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBmbG9vciAgICA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzSW50ZWdlcihpdCl7XG4gIHJldHVybiAhaXNPYmplY3QoaXQpICYmIGlzRmluaXRlKGl0KSAmJiBmbG9vcihpdCkgPT09IGl0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwiLy8gNy4yLjggSXNSZWdFeHAoYXJndW1lbnQpXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGNvZiAgICAgID0gcmVxdWlyZSgnLi9fY29mJylcbiAgLCBNQVRDSCAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdtYXRjaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBpc1JlZ0V4cDtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiAoKGlzUmVnRXhwID0gaXRbTUFUQ0hdKSAhPT0gdW5kZWZpbmVkID8gISFpc1JlZ0V4cCA6IGNvZihpdCkgPT0gJ1JlZ0V4cCcpO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgSXRlcmF0b3JzICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEJVR0dZICAgICAgICAgID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgLCBGRl9JVEVSQVRPUiAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpe1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBpZighQlVHR1kgJiYga2luZCBpbiBwcm90bylyZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgICAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVNcbiAgICAsIFZBTFVFU19CVUcgPSBmYWxzZVxuICAgICwgcHJvdG8gICAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCAkbmF0aXZlICAgID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCAkZGVmYXVsdCAgID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVClcbiAgICAsICRlbnRyaWVzICAgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkXG4gICAgLCAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZVxuICAgICwgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZigkYW55TmF0aXZlKXtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSkpO1xuICAgIGlmKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKXtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZighTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUyl7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYywgc2tpcENsb3Npbmcpe1xuICBpZighc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyByZXR1cm4ge2RvbmU6IHNhZmUgPSB0cnVlfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwidmFyIGdldEtleXMgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGtleXMgICA9IGdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7IiwiLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcbnZhciAkZXhwbTEgPSBNYXRoLmV4cG0xO1xubW9kdWxlLmV4cG9ydHMgPSAoISRleHBtMVxuICAvLyBPbGQgRkYgYnVnXG4gIHx8ICRleHBtMSgxMCkgPiAyMjAyNS40NjU3OTQ4MDY3MTkgfHwgJGV4cG0xKDEwKSA8IDIyMDI1LjQ2NTc5NDgwNjcxNjUxNjhcbiAgLy8gVG9yIEJyb3dzZXIgYnVnXG4gIHx8ICRleHBtMSgtMmUtMTcpICE9IC0yZS0xN1xuKSA/IGZ1bmN0aW9uIGV4cG0xKHgpe1xuICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiB4ID4gLTFlLTYgJiYgeCA8IDFlLTYgPyB4ICsgeCAqIHggLyAyIDogTWF0aC5leHAoeCkgLSAxO1xufSA6ICRleHBtMTsiLCIvLyAyMC4yLjIuMjAgTWF0aC5sb2cxcCh4KVxubW9kdWxlLmV4cG9ydHMgPSBNYXRoLmxvZzFwIHx8IGZ1bmN0aW9uIGxvZzFwKHgpe1xuICByZXR1cm4gKHggPSAreCkgPiAtMWUtOCAmJiB4IDwgMWUtOCA/IHggLSB4ICogeCAvIDIgOiBNYXRoLmxvZygxICsgeCk7XG59OyIsIi8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcbm1vZHVsZS5leHBvcnRzID0gTWF0aC5zaWduIHx8IGZ1bmN0aW9uIHNpZ24oeCl7XG4gIHJldHVybiAoeCA9ICt4KSA9PSAwIHx8IHggIT0geCA/IHggOiB4IDwgMCA/IC0xIDogMTtcbn07IiwidmFyIE1FVEEgICAgID0gcmVxdWlyZSgnLi9fdWlkJykoJ21ldGEnKVxuICAsIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBoYXMgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgc2V0RGVzYyAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaWQgICAgICAgPSAwO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRydWU7XG59O1xudmFyIEZSRUVaRSA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBpc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbnZhciBzZXRNZXRhID0gZnVuY3Rpb24oaXQpe1xuICBzZXREZXNjKGl0LCBNRVRBLCB7dmFsdWU6IHtcbiAgICBpOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3OiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9fSk7XG59O1xudmFyIGZhc3RLZXkgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmKCFoYXMoaXQsIE1FVEEpKXtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBXS5pO1xufTtcbnZhciBnZXRXZWFrID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIGlmKCFoYXMoaXQsIE1FVEEpKXtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIGhhc2ggd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQV0udztcbn07XG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoRlJFRVpFICYmIG1ldGEuTkVFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEEpKXNldE1ldGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xudmFyIG1ldGEgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgS0VZOiAgICAgIE1FVEEsXG4gIE5FRUQ6ICAgICBmYWxzZSxcbiAgZmFzdEtleTogIGZhc3RLZXksXG4gIGdldFdlYWs6ICBnZXRXZWFrLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgbWFjcm90YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIE9ic2VydmVyICA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyXG4gICwgcHJvY2VzcyAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBQcm9taXNlICAgPSBnbG9iYWwuUHJvbWlzZVxuICAsIGlzTm9kZSAgICA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICB2YXIgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHBhcmVudCwgZm47XG4gICAgaWYoaXNOb2RlICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZShoZWFkKXtcbiAgICAgIGZuICAgPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICBpZihoZWFkKW5vdGlmeSgpO1xuICAgICAgICBlbHNlIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgIGlmKHBhcmVudClwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmKGlzTm9kZSl7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIC8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlclxuICB9IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICAgIHZhciB0b2dnbGUgPSB0cnVlXG4gICAgICAsIG5vZGUgICA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gIXRvZ2dsZTtcbiAgICB9O1xuICAvLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxuICB9IGVsc2UgaWYoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpe1xuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIHByb21pc2UudGhlbihmbHVzaCk7XG4gICAgfTtcbiAgLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbiAgLy8gLSBzZXRJbW1lZGlhdGVcbiAgLy8gLSBNZXNzYWdlQ2hhbm5lbFxuICAvLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4gIC8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4gIC8vIC0gc2V0VGltZW91dFxuICB9IGVsc2Uge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgICBtYWNyb3Rhc2suY2FsbChnbG9iYWwsIGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKXtcbiAgICB2YXIgdGFzayA9IHtmbjogZm4sIG5leHQ6IHVuZGVmaW5lZH07XG4gICAgaWYobGFzdClsYXN0Lm5leHQgPSB0YXNrO1xuICAgIGlmKCFoZWFkKXtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKVxuICAsIHBJRSAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpXG4gICwgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgJGFzc2lnbiAgPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICB2YXIgQSA9IHt9XG4gICAgLCBCID0ge31cbiAgICAsIFMgPSBTeW1ib2woKVxuICAgICwgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGspeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUICAgICA9IHRvT2JqZWN0KHRhcmdldClcbiAgICAsIGFMZW4gID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgaW5kZXggPSAxXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mXG4gICAgLCBpc0VudW0gICAgID0gcElFLmY7XG4gIHdoaWxlKGFMZW4gPiBpbmRleCl7XG4gICAgdmFyIFMgICAgICA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKVxuICAgICAgLCBrZXlzICAgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGogICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKGxlbmd0aCA+IGopaWYoaXNFbnVtLmNhbGwoUywga2V5ID0ga2V5c1tqKytdKSlUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjsiLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZFBzICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgRW1wdHkgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgUFJPVE9UWVBFICAgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0gZW51bUJ1Z0tleXMubGVuZ3RoXG4gICAgLCBsdCAgICAgPSAnPCdcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKXtcbiAgdmFyIHJlc3VsdDtcbiAgaWYoTyAhPT0gbnVsbCl7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKVxuICAsIHRvUHJpbWl0aXZlICAgID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJylcbiAgLCBkUCAgICAgICAgICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpe1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKXRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmKCd2YWx1ZScgaW4gQXR0cmlidXRlcylPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59OyIsInZhciBkUCAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpe1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgICA9IGdldEtleXMoUHJvcGVydGllcylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpID0gMFxuICAgICwgUDtcbiAgd2hpbGUobGVuZ3RoID4gaSlkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07IiwidmFyIHBJRSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpXG4gICwgY3JlYXRlRGVzYyAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCB0b0lPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvUHJpbWl0aXZlICAgID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgZ09QRCAgICAgICAgICAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QRCA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKXtcbiAgTyA9IHRvSU9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBnT1BEKE8sIFApO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKGhhcyhPLCBQKSlyZXR1cm4gY3JlYXRlRGVzYyghcElFLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBnT1BOICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmZcbiAgLCB0b1N0cmluZyAgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uKGl0KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG4iLCIvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG52YXIgJGtleXMgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pe1xuICByZXR1cm4gJGtleXMoTywgaGlkZGVuS2V5cyk7XG59OyIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7IiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9PYmplY3QgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbihPKXtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcil7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTsiLCJ2YXIgaGFzICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b0lPYmplY3QgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKVxuICAsIElFX1BST1RPICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIG5hbWVzKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwga2V5O1xuICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07IiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7IiwidmFyIGdldEtleXMgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBpc0VudW0gICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNFbnRyaWVzKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGl0KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KGl0KVxuICAgICAgLCBrZXlzICAgPSBnZXRLZXlzKE8pXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGkgICAgICA9IDBcbiAgICAgICwgcmVzdWx0ID0gW11cbiAgICAgICwga2V5O1xuICAgIHdoaWxlKGxlbmd0aCA+IGkpaWYoaXNFbnVtLmNhbGwoTywga2V5ID0ga2V5c1tpKytdKSl7XG4gICAgICByZXN1bHQucHVzaChpc0VudHJpZXMgPyBba2V5LCBPW2tleV1dIDogT1trZXldKTtcbiAgICB9IHJldHVybiByZXN1bHQ7XG4gIH07XG59OyIsIi8vIGFsbCBvYmplY3Qga2V5cywgaW5jbHVkZXMgbm9uLWVudW1lcmFibGUgYW5kIHN5bWJvbHNcbnZhciBnT1BOICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJylcbiAgLCBnT1BTICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgUmVmbGVjdCAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5SZWZsZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBSZWZsZWN0ICYmIFJlZmxlY3Qub3duS2V5cyB8fCBmdW5jdGlvbiBvd25LZXlzKGl0KXtcbiAgdmFyIGtleXMgICAgICAgPSBnT1BOLmYoYW5PYmplY3QoaXQpKVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgcmV0dXJuIGdldFN5bWJvbHMgPyBrZXlzLmNvbmNhdChnZXRTeW1ib2xzKGl0KSkgOiBrZXlzO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgcGF0aCAgICAgID0gcmVxdWlyZSgnLi9fcGF0aCcpXG4gICwgaW52b2tlICAgID0gcmVxdWlyZSgnLi9faW52b2tlJylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKC8qIC4uLnBhcmdzICovKXtcbiAgdmFyIGZuICAgICA9IGFGdW5jdGlvbih0aGlzKVxuICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgcGFyZ3MgID0gQXJyYXkobGVuZ3RoKVxuICAgICwgaSAgICAgID0gMFxuICAgICwgXyAgICAgID0gcGF0aC5fXG4gICAgLCBob2xkZXIgPSBmYWxzZTtcbiAgd2hpbGUobGVuZ3RoID4gaSlpZigocGFyZ3NbaV0gPSBhcmd1bWVudHNbaSsrXSkgPT09IF8paG9sZGVyID0gdHJ1ZTtcbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgLCBhTGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBqID0gMCwgayA9IDAsIGFyZ3M7XG4gICAgaWYoIWhvbGRlciAmJiAhYUxlbilyZXR1cm4gaW52b2tlKGZuLCBwYXJncywgdGhhdCk7XG4gICAgYXJncyA9IHBhcmdzLnNsaWNlKCk7XG4gICAgaWYoaG9sZGVyKWZvcig7bGVuZ3RoID4gajsgaisrKWlmKGFyZ3Nbal0gPT09IF8pYXJnc1tqXSA9IGFyZ3VtZW50c1trKytdO1xuICAgIHdoaWxlKGFMZW4gPiBrKWFyZ3MucHVzaChhcmd1bWVudHNbaysrXSk7XG4gICAgcmV0dXJuIGludm9rZShmbiwgYXJncywgdGhhdCk7XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjLCBzYWZlKXtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKXJlZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSwgc2FmZSk7XG4gIHJldHVybiB0YXJnZXQ7XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgU1JDICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpXG4gICwgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJ1xuICAsICR0b1N0cmluZyA9IEZ1bmN0aW9uW1RPX1NUUklOR11cbiAgLCBUUEwgICAgICAgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTywga2V5LCB2YWwsIHNhZmUpe1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYoaXNGdW5jdGlvbiloYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmKE9ba2V5XSA9PT0gdmFsKXJldHVybjtcbiAgaWYoaXNGdW5jdGlvbiloYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYoTyA9PT0gZ2xvYmFsKXtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaWYoIXNhZmUpe1xuICAgICAgZGVsZXRlIE9ba2V5XTtcbiAgICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihPW2tleV0pT1trZXldID0gdmFsO1xuICAgICAgZWxzZSBoaWRlKE8sIGtleSwgdmFsKTtcbiAgICB9XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pOyIsIi8vIDcuMi45IFNhbWVWYWx1ZSh4LCB5KVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaXMgfHwgZnVuY3Rpb24gaXMoeCwgeSl7XG4gIHJldHVybiB4ID09PSB5ID8geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkgOiB4ICE9IHggJiYgeSAhPSB5O1xufTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbihPLCBwcm90byl7XG4gIGFuT2JqZWN0KE8pO1xuICBpZighaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKXRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uKHRlc3QsIGJ1Z2d5LCBzZXQpe1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi9fY3R4JykoRnVuY3Rpb24uY2FsbCwgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgU1BFQ0lFUyAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSl7XG4gIHZhciBDID0gZ2xvYmFsW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59OyIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaGFzID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJ1xuICAsIHN0b3JlICA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XG59OyIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxudmFyIGFuT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgU1BFQ0lFUyAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTywgRCl7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3IsIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwiLy8gaGVscGVyIGZvciBTdHJpbmcje3N0YXJ0c1dpdGgsIGVuZHNXaXRoLCBpbmNsdWRlc31cbnZhciBpc1JlZ0V4cCA9IHJlcXVpcmUoJy4vX2lzLXJlZ2V4cCcpXG4gICwgZGVmaW5lZCAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGhhdCwgc2VhcmNoU3RyaW5nLCBOQU1FKXtcbiAgaWYoaXNSZWdFeHAoc2VhcmNoU3RyaW5nKSl0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZyMnICsgTkFNRSArIFwiIGRvZXNuJ3QgYWNjZXB0IHJlZ2V4IVwiKTtcbiAgcmV0dXJuIFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtc3RyaW5nLXBhZC1zdGFydC1lbmRcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgcmVwZWF0ICAgPSByZXF1aXJlKCcuL19zdHJpbmctcmVwZWF0JylcbiAgLCBkZWZpbmVkICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0aGF0LCBtYXhMZW5ndGgsIGZpbGxTdHJpbmcsIGxlZnQpe1xuICB2YXIgUyAgICAgICAgICAgID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgLCBzdHJpbmdMZW5ndGggPSBTLmxlbmd0aFxuICAgICwgZmlsbFN0ciAgICAgID0gZmlsbFN0cmluZyA9PT0gdW5kZWZpbmVkID8gJyAnIDogU3RyaW5nKGZpbGxTdHJpbmcpXG4gICAgLCBpbnRNYXhMZW5ndGggPSB0b0xlbmd0aChtYXhMZW5ndGgpO1xuICBpZihpbnRNYXhMZW5ndGggPD0gc3RyaW5nTGVuZ3RoIHx8IGZpbGxTdHIgPT0gJycpcmV0dXJuIFM7XG4gIHZhciBmaWxsTGVuID0gaW50TWF4TGVuZ3RoIC0gc3RyaW5nTGVuZ3RoXG4gICAgLCBzdHJpbmdGaWxsZXIgPSByZXBlYXQuY2FsbChmaWxsU3RyLCBNYXRoLmNlaWwoZmlsbExlbiAvIGZpbGxTdHIubGVuZ3RoKSk7XG4gIGlmKHN0cmluZ0ZpbGxlci5sZW5ndGggPiBmaWxsTGVuKXN0cmluZ0ZpbGxlciA9IHN0cmluZ0ZpbGxlci5zbGljZSgwLCBmaWxsTGVuKTtcbiAgcmV0dXJuIGxlZnQgPyBzdHJpbmdGaWxsZXIgKyBTIDogUyArIHN0cmluZ0ZpbGxlcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlcGVhdChjb3VudCl7XG4gIHZhciBzdHIgPSBTdHJpbmcoZGVmaW5lZCh0aGlzKSlcbiAgICAsIHJlcyA9ICcnXG4gICAgLCBuICAgPSB0b0ludGVnZXIoY291bnQpO1xuICBpZihuIDwgMCB8fCBuID09IEluZmluaXR5KXRocm93IFJhbmdlRXJyb3IoXCJDb3VudCBjYW4ndCBiZSBuZWdhdGl2ZVwiKTtcbiAgZm9yKDtuID4gMDsgKG4gPj4+PSAxKSAmJiAoc3RyICs9IHN0cikpaWYobiAmIDEpcmVzICs9IHN0cjtcbiAgcmV0dXJuIHJlcztcbn07IiwidmFyIGN0eCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faW52b2tlJylcbiAgLCBodG1sICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19odG1sJylcbiAgLCBjZWwgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgc2V0VGFzayAgICAgICAgICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxuICAsIGNsZWFyVGFzayAgICAgICAgICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxuICAsIGNvdW50ZXIgICAgICAgICAgICA9IDBcbiAgLCBxdWV1ZSAgICAgICAgICAgICAgPSB7fVxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXG4gICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24oKXtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIGlmKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmKE1lc3NhZ2VDaGFubmVsKXtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdGVuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZihPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbigpe1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogICBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIFMpe1xuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZighUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59OyIsIid1c2Ugc3RyaWN0JztcbmlmKHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykpe1xuICB2YXIgTElCUkFSWSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAgICwgZ2xvYmFsICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICAgLCBmYWlscyAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAgICwgJGV4cG9ydCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICAgLCAkdHlwZWQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdHlwZWQnKVxuICAgICwgJGJ1ZmZlciAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3R5cGVkLWJ1ZmZlcicpXG4gICAgLCBjdHggICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgICAsIGFuSW5zdGFuY2UgICAgICAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICAgLCBwcm9wZXJ0eURlc2MgICAgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICAgLCBoaWRlICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICAgLCByZWRlZmluZUFsbCAgICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgICAsIHRvSW50ZWdlciAgICAgICAgICAgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgICAsIHRvTGVuZ3RoICAgICAgICAgICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAgICwgdG9JbmRleCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4JylcbiAgICAsIHRvUHJpbWl0aXZlICAgICAgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAgICwgaGFzICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICAgLCBzYW1lICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fc2FtZS12YWx1ZScpXG4gICAgLCBjbGFzc29mICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICAgLCBpc09iamVjdCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgICAsIHRvT2JqZWN0ICAgICAgICAgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAgICwgaXNBcnJheUl0ZXIgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAgICwgY3JlYXRlICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAgICwgZ2V0UHJvdG90eXBlT2YgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAgICwgZ09QTiAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZlxuICAgICwgZ2V0SXRlckZuICAgICAgICAgICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJylcbiAgICAsIHVpZCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAgICwgd2tzICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpXG4gICAgLCBjcmVhdGVBcnJheU1ldGhvZCAgID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpXG4gICAgLCBjcmVhdGVBcnJheUluY2x1ZGVzID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKVxuICAgICwgc3BlY2llc0NvbnN0cnVjdG9yICA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKVxuICAgICwgQXJyYXlJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJylcbiAgICAsIEl0ZXJhdG9ycyAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAgICwgJGl0ZXJEZXRlY3QgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JylcbiAgICAsIHNldFNwZWNpZXMgICAgICAgICAgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpXG4gICAgLCBhcnJheUZpbGwgICAgICAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktZmlsbCcpXG4gICAgLCBhcnJheUNvcHlXaXRoaW4gICAgID0gcmVxdWlyZSgnLi9fYXJyYXktY29weS13aXRoaW4nKVxuICAgICwgJERQICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICAgLCAkR09QRCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKVxuICAgICwgZFAgICAgICAgICAgICAgICAgICA9ICREUC5mXG4gICAgLCBnT1BEICAgICAgICAgICAgICAgID0gJEdPUEQuZlxuICAgICwgUmFuZ2VFcnJvciAgICAgICAgICA9IGdsb2JhbC5SYW5nZUVycm9yXG4gICAgLCBUeXBlRXJyb3IgICAgICAgICAgID0gZ2xvYmFsLlR5cGVFcnJvclxuICAgICwgVWludDhBcnJheSAgICAgICAgICA9IGdsb2JhbC5VaW50OEFycmF5XG4gICAgLCBBUlJBWV9CVUZGRVIgICAgICAgID0gJ0FycmF5QnVmZmVyJ1xuICAgICwgU0hBUkVEX0JVRkZFUiAgICAgICA9ICdTaGFyZWQnICsgQVJSQVlfQlVGRkVSXG4gICAgLCBCWVRFU19QRVJfRUxFTUVOVCAgID0gJ0JZVEVTX1BFUl9FTEVNRU5UJ1xuICAgICwgUFJPVE9UWVBFICAgICAgICAgICA9ICdwcm90b3R5cGUnXG4gICAgLCBBcnJheVByb3RvICAgICAgICAgID0gQXJyYXlbUFJPVE9UWVBFXVxuICAgICwgJEFycmF5QnVmZmVyICAgICAgICA9ICRidWZmZXIuQXJyYXlCdWZmZXJcbiAgICAsICREYXRhVmlldyAgICAgICAgICAgPSAkYnVmZmVyLkRhdGFWaWV3XG4gICAgLCBhcnJheUZvckVhY2ggICAgICAgID0gY3JlYXRlQXJyYXlNZXRob2QoMClcbiAgICAsIGFycmF5RmlsdGVyICAgICAgICAgPSBjcmVhdGVBcnJheU1ldGhvZCgyKVxuICAgICwgYXJyYXlTb21lICAgICAgICAgICA9IGNyZWF0ZUFycmF5TWV0aG9kKDMpXG4gICAgLCBhcnJheUV2ZXJ5ICAgICAgICAgID0gY3JlYXRlQXJyYXlNZXRob2QoNClcbiAgICAsIGFycmF5RmluZCAgICAgICAgICAgPSBjcmVhdGVBcnJheU1ldGhvZCg1KVxuICAgICwgYXJyYXlGaW5kSW5kZXggICAgICA9IGNyZWF0ZUFycmF5TWV0aG9kKDYpXG4gICAgLCBhcnJheUluY2x1ZGVzICAgICAgID0gY3JlYXRlQXJyYXlJbmNsdWRlcyh0cnVlKVxuICAgICwgYXJyYXlJbmRleE9mICAgICAgICA9IGNyZWF0ZUFycmF5SW5jbHVkZXMoZmFsc2UpXG4gICAgLCBhcnJheVZhbHVlcyAgICAgICAgID0gQXJyYXlJdGVyYXRvcnMudmFsdWVzXG4gICAgLCBhcnJheUtleXMgICAgICAgICAgID0gQXJyYXlJdGVyYXRvcnMua2V5c1xuICAgICwgYXJyYXlFbnRyaWVzICAgICAgICA9IEFycmF5SXRlcmF0b3JzLmVudHJpZXNcbiAgICAsIGFycmF5TGFzdEluZGV4T2YgICAgPSBBcnJheVByb3RvLmxhc3RJbmRleE9mXG4gICAgLCBhcnJheVJlZHVjZSAgICAgICAgID0gQXJyYXlQcm90by5yZWR1Y2VcbiAgICAsIGFycmF5UmVkdWNlUmlnaHQgICAgPSBBcnJheVByb3RvLnJlZHVjZVJpZ2h0XG4gICAgLCBhcnJheUpvaW4gICAgICAgICAgID0gQXJyYXlQcm90by5qb2luXG4gICAgLCBhcnJheVNvcnQgICAgICAgICAgID0gQXJyYXlQcm90by5zb3J0XG4gICAgLCBhcnJheVNsaWNlICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZVxuICAgICwgYXJyYXlUb1N0cmluZyAgICAgICA9IEFycmF5UHJvdG8udG9TdHJpbmdcbiAgICAsIGFycmF5VG9Mb2NhbGVTdHJpbmcgPSBBcnJheVByb3RvLnRvTG9jYWxlU3RyaW5nXG4gICAgLCBJVEVSQVRPUiAgICAgICAgICAgID0gd2tzKCdpdGVyYXRvcicpXG4gICAgLCBUQUcgICAgICAgICAgICAgICAgID0gd2tzKCd0b1N0cmluZ1RhZycpXG4gICAgLCBUWVBFRF9DT05TVFJVQ1RPUiAgID0gdWlkKCd0eXBlZF9jb25zdHJ1Y3RvcicpXG4gICAgLCBERUZfQ09OU1RSVUNUT1IgICAgID0gdWlkKCdkZWZfY29uc3RydWN0b3InKVxuICAgICwgQUxMX0NPTlNUUlVDVE9SUyAgICA9ICR0eXBlZC5DT05TVFJcbiAgICAsIFRZUEVEX0FSUkFZICAgICAgICAgPSAkdHlwZWQuVFlQRURcbiAgICAsIFZJRVcgICAgICAgICAgICAgICAgPSAkdHlwZWQuVklFV1xuICAgICwgV1JPTkdfTEVOR1RIICAgICAgICA9ICdXcm9uZyBsZW5ndGghJztcblxuICB2YXIgJG1hcCA9IGNyZWF0ZUFycmF5TWV0aG9kKDEsIGZ1bmN0aW9uKE8sIGxlbmd0aCl7XG4gICAgcmV0dXJuIGFsbG9jYXRlKHNwZWNpZXNDb25zdHJ1Y3RvcihPLCBPW0RFRl9DT05TVFJVQ1RPUl0pLCBsZW5ndGgpO1xuICB9KTtcblxuICB2YXIgTElUVExFX0VORElBTiA9IGZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KG5ldyBVaW50MTZBcnJheShbMV0pLmJ1ZmZlcilbMF0gPT09IDE7XG4gIH0pO1xuXG4gIHZhciBGT1JDRURfU0VUID0gISFVaW50OEFycmF5ICYmICEhVWludDhBcnJheVtQUk9UT1RZUEVdLnNldCAmJiBmYWlscyhmdW5jdGlvbigpe1xuICAgIG5ldyBVaW50OEFycmF5KDEpLnNldCh7fSk7XG4gIH0pO1xuXG4gIHZhciBzdHJpY3RUb0xlbmd0aCA9IGZ1bmN0aW9uKGl0LCBTQU1FKXtcbiAgICBpZihpdCA9PT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihXUk9OR19MRU5HVEgpO1xuICAgIHZhciBudW1iZXIgPSAraXRcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoaXQpO1xuICAgIGlmKFNBTUUgJiYgIXNhbWUobnVtYmVyLCBsZW5ndGgpKXRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9O1xuXG4gIHZhciB0b09mZnNldCA9IGZ1bmN0aW9uKGl0LCBCWVRFUyl7XG4gICAgdmFyIG9mZnNldCA9IHRvSW50ZWdlcihpdCk7XG4gICAgaWYob2Zmc2V0IDwgMCB8fCBvZmZzZXQgJSBCWVRFUyl0aHJvdyBSYW5nZUVycm9yKCdXcm9uZyBvZmZzZXQhJyk7XG4gICAgcmV0dXJuIG9mZnNldDtcbiAgfTtcblxuICB2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbihpdCl7XG4gICAgaWYoaXNPYmplY3QoaXQpICYmIFRZUEVEX0FSUkFZIGluIGl0KXJldHVybiBpdDtcbiAgICB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIHR5cGVkIGFycmF5IScpO1xuICB9O1xuXG4gIHZhciBhbGxvY2F0ZSA9IGZ1bmN0aW9uKEMsIGxlbmd0aCl7XG4gICAgaWYoIShpc09iamVjdChDKSAmJiBUWVBFRF9DT05TVFJVQ1RPUiBpbiBDKSl7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0l0IGlzIG5vdCBhIHR5cGVkIGFycmF5IGNvbnN0cnVjdG9yIScpO1xuICAgIH0gcmV0dXJuIG5ldyBDKGxlbmd0aCk7XG4gIH07XG5cbiAgdmFyIHNwZWNpZXNGcm9tTGlzdCA9IGZ1bmN0aW9uKE8sIGxpc3Qpe1xuICAgIHJldHVybiBmcm9tTGlzdChzcGVjaWVzQ29uc3RydWN0b3IoTywgT1tERUZfQ09OU1RSVUNUT1JdKSwgbGlzdCk7XG4gIH07XG5cbiAgdmFyIGZyb21MaXN0ID0gZnVuY3Rpb24oQywgbGlzdCl7XG4gICAgdmFyIGluZGV4ICA9IDBcbiAgICAgICwgbGVuZ3RoID0gbGlzdC5sZW5ndGhcbiAgICAgICwgcmVzdWx0ID0gYWxsb2NhdGUoQywgbGVuZ3RoKTtcbiAgICB3aGlsZShsZW5ndGggPiBpbmRleClyZXN1bHRbaW5kZXhdID0gbGlzdFtpbmRleCsrXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBhZGRHZXR0ZXIgPSBmdW5jdGlvbihpdCwga2V5LCBpbnRlcm5hbCl7XG4gICAgZFAoaXQsIGtleSwge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXMuX2RbaW50ZXJuYWxdOyB9fSk7XG4gIH07XG5cbiAgdmFyICRmcm9tID0gZnVuY3Rpb24gZnJvbShzb3VyY2UgLyosIG1hcGZuLCB0aGlzQXJnICovKXtcbiAgICB2YXIgTyAgICAgICA9IHRvT2JqZWN0KHNvdXJjZSlcbiAgICAgICwgYUxlbiAgICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgbWFwZm4gICA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkXG4gICAgICAsIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkXG4gICAgICAsIGl0ZXJGbiAgPSBnZXRJdGVyRm4oTylcbiAgICAgICwgaSwgbGVuZ3RoLCB2YWx1ZXMsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhaXNBcnJheUl0ZXIoaXRlckZuKSl7XG4gICAgICBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgdmFsdWVzID0gW10sIGkgPSAwOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGkrKyl7XG4gICAgICAgIHZhbHVlcy5wdXNoKHN0ZXAudmFsdWUpO1xuICAgICAgfSBPID0gdmFsdWVzO1xuICAgIH1cbiAgICBpZihtYXBwaW5nICYmIGFMZW4gPiAyKW1hcGZuID0gY3R4KG1hcGZuLCBhcmd1bWVudHNbMl0sIDIpO1xuICAgIGZvcihpID0gMCwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpLCByZXN1bHQgPSBhbGxvY2F0ZSh0aGlzLCBsZW5ndGgpOyBsZW5ndGggPiBpOyBpKyspe1xuICAgICAgcmVzdWx0W2ldID0gbWFwcGluZyA/IG1hcGZuKE9baV0sIGkpIDogT1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgJG9mID0gZnVuY3Rpb24gb2YoLyouLi5pdGVtcyovKXtcbiAgICB2YXIgaW5kZXggID0gMFxuICAgICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIHJlc3VsdCA9IGFsbG9jYXRlKHRoaXMsIGxlbmd0aCk7XG4gICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpcmVzdWx0W2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleCsrXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIGlPUyBTYWZhcmkgNi54IGZhaWxzIGhlcmVcbiAgdmFyIFRPX0xPQ0FMRV9CVUcgPSAhIVVpbnQ4QXJyYXkgJiYgZmFpbHMoZnVuY3Rpb24oKXsgYXJyYXlUb0xvY2FsZVN0cmluZy5jYWxsKG5ldyBVaW50OEFycmF5KDEpKTsgfSk7XG5cbiAgdmFyICR0b0xvY2FsZVN0cmluZyA9IGZ1bmN0aW9uIHRvTG9jYWxlU3RyaW5nKCl7XG4gICAgcmV0dXJuIGFycmF5VG9Mb2NhbGVTdHJpbmcuYXBwbHkoVE9fTE9DQUxFX0JVRyA/IGFycmF5U2xpY2UuY2FsbCh2YWxpZGF0ZSh0aGlzKSkgOiB2YWxpZGF0ZSh0aGlzKSwgYXJndW1lbnRzKTtcbiAgfTtcblxuICB2YXIgcHJvdG8gPSB7XG4gICAgY29weVdpdGhpbjogZnVuY3Rpb24gY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0IC8qLCBlbmQgKi8pe1xuICAgICAgcmV0dXJuIGFycmF5Q29weVdpdGhpbi5jYWxsKHZhbGlkYXRlKHRoaXMpLCB0YXJnZXQsIHN0YXJ0LCBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICBldmVyeTogZnVuY3Rpb24gZXZlcnkoY2FsbGJhY2tmbiAvKiwgdGhpc0FyZyAqLyl7XG4gICAgICByZXR1cm4gYXJyYXlFdmVyeSh2YWxpZGF0ZSh0aGlzKSwgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgZmlsbDogZnVuY3Rpb24gZmlsbCh2YWx1ZSAvKiwgc3RhcnQsIGVuZCAqLyl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheUZpbGwuYXBwbHkodmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFja2ZuIC8qLCB0aGlzQXJnICovKXtcbiAgICAgIHJldHVybiBzcGVjaWVzRnJvbUxpc3QodGhpcywgYXJyYXlGaWx0ZXIodmFsaWRhdGUodGhpcyksIGNhbGxiYWNrZm4sXG4gICAgICAgIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKSk7XG4gICAgfSxcbiAgICBmaW5kOiBmdW5jdGlvbiBmaW5kKHByZWRpY2F0ZSAvKiwgdGhpc0FyZyAqLyl7XG4gICAgICByZXR1cm4gYXJyYXlGaW5kKHZhbGlkYXRlKHRoaXMpLCBwcmVkaWNhdGUsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIGZpbmRJbmRleDogZnVuY3Rpb24gZmluZEluZGV4KHByZWRpY2F0ZSAvKiwgdGhpc0FyZyAqLyl7XG4gICAgICByZXR1cm4gYXJyYXlGaW5kSW5kZXgodmFsaWRhdGUodGhpcyksIHByZWRpY2F0ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qLCB0aGlzQXJnICovKXtcbiAgICAgIGFycmF5Rm9yRWFjaCh2YWxpZGF0ZSh0aGlzKSwgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXggKi8pe1xuICAgICAgcmV0dXJuIGFycmF5SW5kZXhPZih2YWxpZGF0ZSh0aGlzKSwgc2VhcmNoRWxlbWVudCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCAqLyl7XG4gICAgICByZXR1cm4gYXJyYXlJbmNsdWRlcyh2YWxpZGF0ZSh0aGlzKSwgc2VhcmNoRWxlbWVudCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICAgIH0sXG4gICAgam9pbjogZnVuY3Rpb24gam9pbihzZXBhcmF0b3IpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICByZXR1cm4gYXJyYXlKb2luLmFwcGx5KHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uIGxhc3RJbmRleE9mKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCAqLyl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIHJldHVybiBhcnJheUxhc3RJbmRleE9mLmFwcGx5KHZhbGlkYXRlKHRoaXMpLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgbWFwOiBmdW5jdGlvbiBtYXAobWFwZm4gLyosIHRoaXNBcmcgKi8pe1xuICAgICAgcmV0dXJuICRtYXAodmFsaWRhdGUodGhpcyksIG1hcGZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgfSxcbiAgICByZWR1Y2U6IGZ1bmN0aW9uIHJlZHVjZShjYWxsYmFja2ZuIC8qLCBpbml0aWFsVmFsdWUgKi8peyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICByZXR1cm4gYXJyYXlSZWR1Y2UuYXBwbHkodmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICByZWR1Y2VSaWdodDogZnVuY3Rpb24gcmVkdWNlUmlnaHQoY2FsbGJhY2tmbiAvKiwgaW5pdGlhbFZhbHVlICovKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgcmV0dXJuIGFycmF5UmVkdWNlUmlnaHQuYXBwbHkodmFsaWRhdGUodGhpcyksIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICByZXZlcnNlOiBmdW5jdGlvbiByZXZlcnNlKCl7XG4gICAgICB2YXIgdGhhdCAgID0gdGhpc1xuICAgICAgICAsIGxlbmd0aCA9IHZhbGlkYXRlKHRoYXQpLmxlbmd0aFxuICAgICAgICAsIG1pZGRsZSA9IE1hdGguZmxvb3IobGVuZ3RoIC8gMilcbiAgICAgICAgLCBpbmRleCAgPSAwXG4gICAgICAgICwgdmFsdWU7XG4gICAgICB3aGlsZShpbmRleCA8IG1pZGRsZSl7XG4gICAgICAgIHZhbHVlICAgICAgICAgPSB0aGF0W2luZGV4XTtcbiAgICAgICAgdGhhdFtpbmRleCsrXSA9IHRoYXRbLS1sZW5ndGhdO1xuICAgICAgICB0aGF0W2xlbmd0aF0gID0gdmFsdWU7XG4gICAgICB9IHJldHVybiB0aGF0O1xuICAgIH0sXG4gICAgc29tZTogZnVuY3Rpb24gc29tZShjYWxsYmFja2ZuIC8qLCB0aGlzQXJnICovKXtcbiAgICAgIHJldHVybiBhcnJheVNvbWUodmFsaWRhdGUodGhpcyksIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICB9LFxuICAgIHNvcnQ6IGZ1bmN0aW9uIHNvcnQoY29tcGFyZWZuKXtcbiAgICAgIHJldHVybiBhcnJheVNvcnQuY2FsbCh2YWxpZGF0ZSh0aGlzKSwgY29tcGFyZWZuKTtcbiAgICB9LFxuICAgIHN1YmFycmF5OiBmdW5jdGlvbiBzdWJhcnJheShiZWdpbiwgZW5kKXtcbiAgICAgIHZhciBPICAgICAgPSB2YWxpZGF0ZSh0aGlzKVxuICAgICAgICAsIGxlbmd0aCA9IE8ubGVuZ3RoXG4gICAgICAgICwgJGJlZ2luID0gdG9JbmRleChiZWdpbiwgbGVuZ3RoKTtcbiAgICAgIHJldHVybiBuZXcgKHNwZWNpZXNDb25zdHJ1Y3RvcihPLCBPW0RFRl9DT05TVFJVQ1RPUl0pKShcbiAgICAgICAgTy5idWZmZXIsXG4gICAgICAgIE8uYnl0ZU9mZnNldCArICRiZWdpbiAqIE8uQllURVNfUEVSX0VMRU1FTlQsXG4gICAgICAgIHRvTGVuZ3RoKChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW5kZXgoZW5kLCBsZW5ndGgpKSAtICRiZWdpbilcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIHZhciAkc2xpY2UgPSBmdW5jdGlvbiBzbGljZShzdGFydCwgZW5kKXtcbiAgICByZXR1cm4gc3BlY2llc0Zyb21MaXN0KHRoaXMsIGFycmF5U2xpY2UuY2FsbCh2YWxpZGF0ZSh0aGlzKSwgc3RhcnQsIGVuZCkpO1xuICB9O1xuXG4gIHZhciAkc2V0ID0gZnVuY3Rpb24gc2V0KGFycmF5TGlrZSAvKiwgb2Zmc2V0ICovKXtcbiAgICB2YWxpZGF0ZSh0aGlzKTtcbiAgICB2YXIgb2Zmc2V0ID0gdG9PZmZzZXQoYXJndW1lbnRzWzFdLCAxKVxuICAgICAgLCBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgICAgLCBzcmMgICAgPSB0b09iamVjdChhcnJheUxpa2UpXG4gICAgICAsIGxlbiAgICA9IHRvTGVuZ3RoKHNyYy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IDA7XG4gICAgaWYobGVuICsgb2Zmc2V0ID4gbGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICB3aGlsZShpbmRleCA8IGxlbil0aGlzW29mZnNldCArIGluZGV4XSA9IHNyY1tpbmRleCsrXTtcbiAgfTtcblxuICB2YXIgJGl0ZXJhdG9ycyA9IHtcbiAgICBlbnRyaWVzOiBmdW5jdGlvbiBlbnRyaWVzKCl7XG4gICAgICByZXR1cm4gYXJyYXlFbnRyaWVzLmNhbGwodmFsaWRhdGUodGhpcykpO1xuICAgIH0sXG4gICAga2V5czogZnVuY3Rpb24ga2V5cygpe1xuICAgICAgcmV0dXJuIGFycmF5S2V5cy5jYWxsKHZhbGlkYXRlKHRoaXMpKTtcbiAgICB9LFxuICAgIHZhbHVlczogZnVuY3Rpb24gdmFsdWVzKCl7XG4gICAgICByZXR1cm4gYXJyYXlWYWx1ZXMuY2FsbCh2YWxpZGF0ZSh0aGlzKSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBpc1RBSW5kZXggPSBmdW5jdGlvbih0YXJnZXQsIGtleSl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHRhcmdldClcbiAgICAgICYmIHRhcmdldFtUWVBFRF9BUlJBWV1cbiAgICAgICYmIHR5cGVvZiBrZXkgIT0gJ3N5bWJvbCdcbiAgICAgICYmIGtleSBpbiB0YXJnZXRcbiAgICAgICYmIFN0cmluZygra2V5KSA9PSBTdHJpbmcoa2V5KTtcbiAgfTtcbiAgdmFyICRnZXREZXNjID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KXtcbiAgICByZXR1cm4gaXNUQUluZGV4KHRhcmdldCwga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKSlcbiAgICAgID8gcHJvcGVydHlEZXNjKDIsIHRhcmdldFtrZXldKVxuICAgICAgOiBnT1BEKHRhcmdldCwga2V5KTtcbiAgfTtcbiAgdmFyICRzZXREZXNjID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2Mpe1xuICAgIGlmKGlzVEFJbmRleCh0YXJnZXQsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpXG4gICAgICAmJiBpc09iamVjdChkZXNjKVxuICAgICAgJiYgaGFzKGRlc2MsICd2YWx1ZScpXG4gICAgICAmJiAhaGFzKGRlc2MsICdnZXQnKVxuICAgICAgJiYgIWhhcyhkZXNjLCAnc2V0JylcbiAgICAgIC8vIFRPRE86IGFkZCB2YWxpZGF0aW9uIGRlc2NyaXB0b3Igdy9vIGNhbGxpbmcgYWNjZXNzb3JzXG4gICAgICAmJiAhZGVzYy5jb25maWd1cmFibGVcbiAgICAgICYmICghaGFzKGRlc2MsICd3cml0YWJsZScpIHx8IGRlc2Mud3JpdGFibGUpXG4gICAgICAmJiAoIWhhcyhkZXNjLCAnZW51bWVyYWJsZScpIHx8IGRlc2MuZW51bWVyYWJsZSlcbiAgICApe1xuICAgICAgdGFyZ2V0W2tleV0gPSBkZXNjLnZhbHVlO1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9IGVsc2UgcmV0dXJuIGRQKHRhcmdldCwga2V5LCBkZXNjKTtcbiAgfTtcblxuICBpZighQUxMX0NPTlNUUlVDVE9SUyl7XG4gICAgJEdPUEQuZiA9ICRnZXREZXNjO1xuICAgICREUC5mICAgPSAkc2V0RGVzYztcbiAgfVxuXG4gICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIUFMTF9DT05TVFJVQ1RPUlMsICdPYmplY3QnLCB7XG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0RGVzYyxcbiAgICBkZWZpbmVQcm9wZXJ0eTogICAgICAgICAgICRzZXREZXNjXG4gIH0pO1xuXG4gIGlmKGZhaWxzKGZ1bmN0aW9uKCl7IGFycmF5VG9TdHJpbmcuY2FsbCh7fSk7IH0pKXtcbiAgICBhcnJheVRvU3RyaW5nID0gYXJyYXlUb0xvY2FsZVN0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgICByZXR1cm4gYXJyYXlKb2luLmNhbGwodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgdmFyICRUeXBlZEFycmF5UHJvdG90eXBlJCA9IHJlZGVmaW5lQWxsKHt9LCBwcm90byk7XG4gIHJlZGVmaW5lQWxsKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgJGl0ZXJhdG9ycyk7XG4gIGhpZGUoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCBJVEVSQVRPUiwgJGl0ZXJhdG9ycy52YWx1ZXMpO1xuICByZWRlZmluZUFsbCgkVHlwZWRBcnJheVByb3RvdHlwZSQsIHtcbiAgICBzbGljZTogICAgICAgICAgJHNsaWNlLFxuICAgIHNldDogICAgICAgICAgICAkc2V0LFxuICAgIGNvbnN0cnVjdG9yOiAgICBmdW5jdGlvbigpeyAvKiBub29wICovIH0sXG4gICAgdG9TdHJpbmc6ICAgICAgIGFycmF5VG9TdHJpbmcsXG4gICAgdG9Mb2NhbGVTdHJpbmc6ICR0b0xvY2FsZVN0cmluZ1xuICB9KTtcbiAgYWRkR2V0dGVyKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgJ2J1ZmZlcicsICdiJyk7XG4gIGFkZEdldHRlcigkVHlwZWRBcnJheVByb3RvdHlwZSQsICdieXRlT2Zmc2V0JywgJ28nKTtcbiAgYWRkR2V0dGVyKCRUeXBlZEFycmF5UHJvdG90eXBlJCwgJ2J5dGVMZW5ndGgnLCAnbCcpO1xuICBhZGRHZXR0ZXIoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCAnbGVuZ3RoJywgJ2UnKTtcbiAgZFAoJFR5cGVkQXJyYXlQcm90b3R5cGUkLCBUQUcsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzW1RZUEVEX0FSUkFZXTsgfVxuICB9KTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgQllURVMsIHdyYXBwZXIsIENMQU1QRUQpe1xuICAgIENMQU1QRUQgPSAhIUNMQU1QRUQ7XG4gICAgdmFyIE5BTUUgICAgICAgPSBLRVkgKyAoQ0xBTVBFRCA/ICdDbGFtcGVkJyA6ICcnKSArICdBcnJheSdcbiAgICAgICwgSVNOVF9VSU5UOCA9IE5BTUUgIT0gJ1VpbnQ4QXJyYXknXG4gICAgICAsIEdFVFRFUiAgICAgPSAnZ2V0JyArIEtFWVxuICAgICAgLCBTRVRURVIgICAgID0gJ3NldCcgKyBLRVlcbiAgICAgICwgVHlwZWRBcnJheSA9IGdsb2JhbFtOQU1FXVxuICAgICAgLCBCYXNlICAgICAgID0gVHlwZWRBcnJheSB8fCB7fVxuICAgICAgLCBUQUMgICAgICAgID0gVHlwZWRBcnJheSAmJiBnZXRQcm90b3R5cGVPZihUeXBlZEFycmF5KVxuICAgICAgLCBGT1JDRUQgICAgID0gIVR5cGVkQXJyYXkgfHwgISR0eXBlZC5BQlZcbiAgICAgICwgTyAgICAgICAgICA9IHt9XG4gICAgICAsIFR5cGVkQXJyYXlQcm90b3R5cGUgPSBUeXBlZEFycmF5ICYmIFR5cGVkQXJyYXlbUFJPVE9UWVBFXTtcbiAgICB2YXIgZ2V0dGVyID0gZnVuY3Rpb24odGhhdCwgaW5kZXgpe1xuICAgICAgdmFyIGRhdGEgPSB0aGF0Ll9kO1xuICAgICAgcmV0dXJuIGRhdGEudltHRVRURVJdKGluZGV4ICogQllURVMgKyBkYXRhLm8sIExJVFRMRV9FTkRJQU4pO1xuICAgIH07XG4gICAgdmFyIHNldHRlciA9IGZ1bmN0aW9uKHRoYXQsIGluZGV4LCB2YWx1ZSl7XG4gICAgICB2YXIgZGF0YSA9IHRoYXQuX2Q7XG4gICAgICBpZihDTEFNUEVEKXZhbHVlID0gKHZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSkpIDwgMCA/IDAgOiB2YWx1ZSA+IDB4ZmYgPyAweGZmIDogdmFsdWUgJiAweGZmO1xuICAgICAgZGF0YS52W1NFVFRFUl0oaW5kZXggKiBCWVRFUyArIGRhdGEubywgdmFsdWUsIExJVFRMRV9FTkRJQU4pO1xuICAgIH07XG4gICAgdmFyIGFkZEVsZW1lbnQgPSBmdW5jdGlvbih0aGF0LCBpbmRleCl7XG4gICAgICBkUCh0aGF0LCBpbmRleCwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIGdldHRlcih0aGlzLCBpbmRleCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIHJldHVybiBzZXR0ZXIodGhpcywgaW5kZXgsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfTtcbiAgICBpZihGT1JDRUQpe1xuICAgICAgVHlwZWRBcnJheSA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgZGF0YSwgJG9mZnNldCwgJGxlbmd0aCl7XG4gICAgICAgIGFuSW5zdGFuY2UodGhhdCwgVHlwZWRBcnJheSwgTkFNRSwgJ19kJyk7XG4gICAgICAgIHZhciBpbmRleCAgPSAwXG4gICAgICAgICAgLCBvZmZzZXQgPSAwXG4gICAgICAgICAgLCBidWZmZXIsIGJ5dGVMZW5ndGgsIGxlbmd0aCwga2xhc3M7XG4gICAgICAgIGlmKCFpc09iamVjdChkYXRhKSl7XG4gICAgICAgICAgbGVuZ3RoICAgICA9IHN0cmljdFRvTGVuZ3RoKGRhdGEsIHRydWUpXG4gICAgICAgICAgYnl0ZUxlbmd0aCA9IGxlbmd0aCAqIEJZVEVTO1xuICAgICAgICAgIGJ1ZmZlciAgICAgPSBuZXcgJEFycmF5QnVmZmVyKGJ5dGVMZW5ndGgpO1xuICAgICAgICB9IGVsc2UgaWYoZGF0YSBpbnN0YW5jZW9mICRBcnJheUJ1ZmZlciB8fCAoa2xhc3MgPSBjbGFzc29mKGRhdGEpKSA9PSBBUlJBWV9CVUZGRVIgfHwga2xhc3MgPT0gU0hBUkVEX0JVRkZFUil7XG4gICAgICAgICAgYnVmZmVyID0gZGF0YTtcbiAgICAgICAgICBvZmZzZXQgPSB0b09mZnNldCgkb2Zmc2V0LCBCWVRFUyk7XG4gICAgICAgICAgdmFyICRsZW4gPSBkYXRhLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgaWYoJGxlbmd0aCA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGlmKCRsZW4gJSBCWVRFUyl0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgICAgICAgICBieXRlTGVuZ3RoID0gJGxlbiAtIG9mZnNldDtcbiAgICAgICAgICAgIGlmKGJ5dGVMZW5ndGggPCAwKXRocm93IFJhbmdlRXJyb3IoV1JPTkdfTEVOR1RIKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnl0ZUxlbmd0aCA9IHRvTGVuZ3RoKCRsZW5ndGgpICogQllURVM7XG4gICAgICAgICAgICBpZihieXRlTGVuZ3RoICsgb2Zmc2V0ID4gJGxlbil0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxlbmd0aCA9IGJ5dGVMZW5ndGggLyBCWVRFUztcbiAgICAgICAgfSBlbHNlIGlmKFRZUEVEX0FSUkFZIGluIGRhdGEpe1xuICAgICAgICAgIHJldHVybiBmcm9tTGlzdChUeXBlZEFycmF5LCBkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJGZyb20uY2FsbChUeXBlZEFycmF5LCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBoaWRlKHRoYXQsICdfZCcsIHtcbiAgICAgICAgICBiOiBidWZmZXIsXG4gICAgICAgICAgbzogb2Zmc2V0LFxuICAgICAgICAgIGw6IGJ5dGVMZW5ndGgsXG4gICAgICAgICAgZTogbGVuZ3RoLFxuICAgICAgICAgIHY6IG5ldyAkRGF0YVZpZXcoYnVmZmVyKVxuICAgICAgICB9KTtcbiAgICAgICAgd2hpbGUoaW5kZXggPCBsZW5ndGgpYWRkRWxlbWVudCh0aGF0LCBpbmRleCsrKTtcbiAgICAgIH0pO1xuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZSA9IFR5cGVkQXJyYXlbUFJPVE9UWVBFXSA9IGNyZWF0ZSgkVHlwZWRBcnJheVByb3RvdHlwZSQpO1xuICAgICAgaGlkZShUeXBlZEFycmF5UHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBUeXBlZEFycmF5KTtcbiAgICB9IGVsc2UgaWYoISRpdGVyRGV0ZWN0KGZ1bmN0aW9uKGl0ZXIpe1xuICAgICAgLy8gVjggd29ya3Mgd2l0aCBpdGVyYXRvcnMsIGJ1dCBmYWlscyBpbiBtYW55IG90aGVyIGNhc2VzXG4gICAgICAvLyBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDU1MlxuICAgICAgbmV3IFR5cGVkQXJyYXkobnVsbCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgICBuZXcgVHlwZWRBcnJheShpdGVyKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICB9LCB0cnVlKSl7XG4gICAgICBUeXBlZEFycmF5ID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBkYXRhLCAkb2Zmc2V0LCAkbGVuZ3RoKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGF0LCBUeXBlZEFycmF5LCBOQU1FKTtcbiAgICAgICAgdmFyIGtsYXNzO1xuICAgICAgICAvLyBgd3NgIG1vZHVsZSBidWcsIHRlbXBvcmFyaWx5IHJlbW92ZSB2YWxpZGF0aW9uIGxlbmd0aCBmb3IgVWludDhBcnJheVxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vd2Vic29ja2V0cy93cy9wdWxsLzY0NVxuICAgICAgICBpZighaXNPYmplY3QoZGF0YSkpcmV0dXJuIG5ldyBCYXNlKHN0cmljdFRvTGVuZ3RoKGRhdGEsIElTTlRfVUlOVDgpKTtcbiAgICAgICAgaWYoZGF0YSBpbnN0YW5jZW9mICRBcnJheUJ1ZmZlciB8fCAoa2xhc3MgPSBjbGFzc29mKGRhdGEpKSA9PSBBUlJBWV9CVUZGRVIgfHwga2xhc3MgPT0gU0hBUkVEX0JVRkZFUil7XG4gICAgICAgICAgcmV0dXJuICRsZW5ndGggIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBuZXcgQmFzZShkYXRhLCB0b09mZnNldCgkb2Zmc2V0LCBCWVRFUyksICRsZW5ndGgpXG4gICAgICAgICAgICA6ICRvZmZzZXQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA/IG5ldyBCYXNlKGRhdGEsIHRvT2Zmc2V0KCRvZmZzZXQsIEJZVEVTKSlcbiAgICAgICAgICAgICAgOiBuZXcgQmFzZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBpZihUWVBFRF9BUlJBWSBpbiBkYXRhKXJldHVybiBmcm9tTGlzdChUeXBlZEFycmF5LCBkYXRhKTtcbiAgICAgICAgcmV0dXJuICRmcm9tLmNhbGwoVHlwZWRBcnJheSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIGFycmF5Rm9yRWFjaChUQUMgIT09IEZ1bmN0aW9uLnByb3RvdHlwZSA/IGdPUE4oQmFzZSkuY29uY2F0KGdPUE4oVEFDKSkgOiBnT1BOKEJhc2UpLCBmdW5jdGlvbihrZXkpe1xuICAgICAgICBpZighKGtleSBpbiBUeXBlZEFycmF5KSloaWRlKFR5cGVkQXJyYXksIGtleSwgQmFzZVtrZXldKTtcbiAgICAgIH0pO1xuICAgICAgVHlwZWRBcnJheVtQUk9UT1RZUEVdID0gVHlwZWRBcnJheVByb3RvdHlwZTtcbiAgICAgIGlmKCFMSUJSQVJZKVR5cGVkQXJyYXlQcm90b3R5cGUuY29uc3RydWN0b3IgPSBUeXBlZEFycmF5O1xuICAgIH1cbiAgICB2YXIgJG5hdGl2ZUl0ZXJhdG9yICAgPSBUeXBlZEFycmF5UHJvdG90eXBlW0lURVJBVE9SXVxuICAgICAgLCBDT1JSRUNUX0lURVJfTkFNRSA9ICEhJG5hdGl2ZUl0ZXJhdG9yICYmICgkbmF0aXZlSXRlcmF0b3IubmFtZSA9PSAndmFsdWVzJyB8fCAkbmF0aXZlSXRlcmF0b3IubmFtZSA9PSB1bmRlZmluZWQpXG4gICAgICAsICRpdGVyYXRvciAgICAgICAgID0gJGl0ZXJhdG9ycy52YWx1ZXM7XG4gICAgaGlkZShUeXBlZEFycmF5LCBUWVBFRF9DT05TVFJVQ1RPUiwgdHJ1ZSk7XG4gICAgaGlkZShUeXBlZEFycmF5UHJvdG90eXBlLCBUWVBFRF9BUlJBWSwgTkFNRSk7XG4gICAgaGlkZShUeXBlZEFycmF5UHJvdG90eXBlLCBWSUVXLCB0cnVlKTtcbiAgICBoaWRlKFR5cGVkQXJyYXlQcm90b3R5cGUsIERFRl9DT05TVFJVQ1RPUiwgVHlwZWRBcnJheSk7XG5cbiAgICBpZihDTEFNUEVEID8gbmV3IFR5cGVkQXJyYXkoMSlbVEFHXSAhPSBOQU1FIDogIShUQUcgaW4gVHlwZWRBcnJheVByb3RvdHlwZSkpe1xuICAgICAgZFAoVHlwZWRBcnJheVByb3RvdHlwZSwgVEFHLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIE5BTUU7IH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIE9bTkFNRV0gPSBUeXBlZEFycmF5O1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAoVHlwZWRBcnJheSAhPSBCYXNlKSwgTyk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUywgTkFNRSwge1xuICAgICAgQllURVNfUEVSX0VMRU1FTlQ6IEJZVEVTLFxuICAgICAgZnJvbTogJGZyb20sXG4gICAgICBvZjogJG9mXG4gICAgfSk7XG5cbiAgICBpZighKEJZVEVTX1BFUl9FTEVNRU5UIGluIFR5cGVkQXJyYXlQcm90b3R5cGUpKWhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgQllURVNfUEVSX0VMRU1FTlQsIEJZVEVTKTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5QLCBOQU1FLCBwcm90byk7XG5cbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuXG4gICAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBGT1JDRURfU0VULCBOQU1FLCB7c2V0OiAkc2V0fSk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqICFDT1JSRUNUX0lURVJfTkFNRSwgTkFNRSwgJGl0ZXJhdG9ycyk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChUeXBlZEFycmF5UHJvdG90eXBlLnRvU3RyaW5nICE9IGFycmF5VG9TdHJpbmcpLCBOQU1FLCB7dG9TdHJpbmc6IGFycmF5VG9TdHJpbmd9KTtcblxuICAgICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24oKXtcbiAgICAgIG5ldyBUeXBlZEFycmF5KDEpLnNsaWNlKCk7XG4gICAgfSksIE5BTUUsIHtzbGljZTogJHNsaWNlfSk7XG5cbiAgICAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChmYWlscyhmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIFsxLCAyXS50b0xvY2FsZVN0cmluZygpICE9IG5ldyBUeXBlZEFycmF5KFsxLCAyXSkudG9Mb2NhbGVTdHJpbmcoKVxuICAgIH0pIHx8ICFmYWlscyhmdW5jdGlvbigpe1xuICAgICAgVHlwZWRBcnJheVByb3RvdHlwZS50b0xvY2FsZVN0cmluZy5jYWxsKFsxLCAyXSk7XG4gICAgfSkpLCBOQU1FLCB7dG9Mb2NhbGVTdHJpbmc6ICR0b0xvY2FsZVN0cmluZ30pO1xuXG4gICAgSXRlcmF0b3JzW05BTUVdID0gQ09SUkVDVF9JVEVSX05BTUUgPyAkbmF0aXZlSXRlcmF0b3IgOiAkaXRlcmF0b3I7XG4gICAgaWYoIUxJQlJBUlkgJiYgIUNPUlJFQ1RfSVRFUl9OQU1FKWhpZGUoVHlwZWRBcnJheVByb3RvdHlwZSwgSVRFUkFUT1IsICRpdGVyYXRvcik7XG4gIH07XG59IGVsc2UgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCAkdHlwZWQgICAgICAgICA9IHJlcXVpcmUoJy4vX3R5cGVkJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHJlZGVmaW5lQWxsICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBmYWlscyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCBhbkluc3RhbmNlICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCB0b0ludGVnZXIgICAgICA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIHRvTGVuZ3RoICAgICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBnT1BOICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZlxuICAsIGRQICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGFycmF5RmlsbCAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktZmlsbCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgQVJSQVlfQlVGRkVSICAgPSAnQXJyYXlCdWZmZXInXG4gICwgREFUQV9WSUVXICAgICAgPSAnRGF0YVZpZXcnXG4gICwgUFJPVE9UWVBFICAgICAgPSAncHJvdG90eXBlJ1xuICAsIFdST05HX0xFTkdUSCAgID0gJ1dyb25nIGxlbmd0aCEnXG4gICwgV1JPTkdfSU5ERVggICAgPSAnV3JvbmcgaW5kZXghJ1xuICAsICRBcnJheUJ1ZmZlciAgID0gZ2xvYmFsW0FSUkFZX0JVRkZFUl1cbiAgLCAkRGF0YVZpZXcgICAgICA9IGdsb2JhbFtEQVRBX1ZJRVddXG4gICwgTWF0aCAgICAgICAgICAgPSBnbG9iYWwuTWF0aFxuICAsIFJhbmdlRXJyb3IgICAgID0gZ2xvYmFsLlJhbmdlRXJyb3JcbiAgLCBJbmZpbml0eSAgICAgICA9IGdsb2JhbC5JbmZpbml0eVxuICAsIEJhc2VCdWZmZXIgICAgID0gJEFycmF5QnVmZmVyXG4gICwgYWJzICAgICAgICAgICAgPSBNYXRoLmFic1xuICAsIHBvdyAgICAgICAgICAgID0gTWF0aC5wb3dcbiAgLCBmbG9vciAgICAgICAgICA9IE1hdGguZmxvb3JcbiAgLCBsb2cgICAgICAgICAgICA9IE1hdGgubG9nXG4gICwgTE4yICAgICAgICAgICAgPSBNYXRoLkxOMlxuICAsIEJVRkZFUiAgICAgICAgID0gJ2J1ZmZlcidcbiAgLCBCWVRFX0xFTkdUSCAgICA9ICdieXRlTGVuZ3RoJ1xuICAsIEJZVEVfT0ZGU0VUICAgID0gJ2J5dGVPZmZzZXQnXG4gICwgJEJVRkZFUiAgICAgICAgPSBERVNDUklQVE9SUyA/ICdfYicgOiBCVUZGRVJcbiAgLCAkTEVOR1RIICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19sJyA6IEJZVEVfTEVOR1RIXG4gICwgJE9GRlNFVCAgICAgICAgPSBERVNDUklQVE9SUyA/ICdfbycgOiBCWVRFX09GRlNFVDtcblxuLy8gSUVFRTc1NCBjb252ZXJzaW9ucyBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2llZWU3NTRcbnZhciBwYWNrSUVFRTc1NCA9IGZ1bmN0aW9uKHZhbHVlLCBtTGVuLCBuQnl0ZXMpe1xuICB2YXIgYnVmZmVyID0gQXJyYXkobkJ5dGVzKVxuICAgICwgZUxlbiAgID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gICAgLCBlTWF4ICAgPSAoMSA8PCBlTGVuKSAtIDFcbiAgICAsIGVCaWFzICA9IGVNYXggPj4gMVxuICAgICwgcnQgICAgID0gbUxlbiA9PT0gMjMgPyBwb3coMiwgLTI0KSAtIHBvdygyLCAtNzcpIDogMFxuICAgICwgaSAgICAgID0gMFxuICAgICwgcyAgICAgID0gdmFsdWUgPCAwIHx8IHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDAgPyAxIDogMFxuICAgICwgZSwgbSwgYztcbiAgdmFsdWUgPSBhYnModmFsdWUpXG4gIGlmKHZhbHVlICE9IHZhbHVlIHx8IHZhbHVlID09PSBJbmZpbml0eSl7XG4gICAgbSA9IHZhbHVlICE9IHZhbHVlID8gMSA6IDA7XG4gICAgZSA9IGVNYXg7XG4gIH0gZWxzZSB7XG4gICAgZSA9IGZsb29yKGxvZyh2YWx1ZSkgLyBMTjIpO1xuICAgIGlmKHZhbHVlICogKGMgPSBwb3coMiwgLWUpKSA8IDEpe1xuICAgICAgZS0tO1xuICAgICAgYyAqPSAyO1xuICAgIH1cbiAgICBpZihlICsgZUJpYXMgPj0gMSl7XG4gICAgICB2YWx1ZSArPSBydCAvIGM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogcG93KDIsIDEgLSBlQmlhcyk7XG4gICAgfVxuICAgIGlmKHZhbHVlICogYyA+PSAyKXtcbiAgICAgIGUrKztcbiAgICAgIGMgLz0gMjtcbiAgICB9XG4gICAgaWYoZSArIGVCaWFzID49IGVNYXgpe1xuICAgICAgbSA9IDA7XG4gICAgICBlID0gZU1heDtcbiAgICB9IGVsc2UgaWYoZSArIGVCaWFzID49IDEpe1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIHBvdygyLCBtTGVuKTtcbiAgICAgIGUgPSBlICsgZUJpYXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIHBvdygyLCBlQmlhcyAtIDEpICogcG93KDIsIG1MZW4pO1xuICAgICAgZSA9IDA7XG4gICAgfVxuICB9XG4gIGZvcig7IG1MZW4gPj0gODsgYnVmZmVyW2krK10gPSBtICYgMjU1LCBtIC89IDI1NiwgbUxlbiAtPSA4KTtcbiAgZSA9IGUgPDwgbUxlbiB8IG07XG4gIGVMZW4gKz0gbUxlbjtcbiAgZm9yKDsgZUxlbiA+IDA7IGJ1ZmZlcltpKytdID0gZSAmIDI1NSwgZSAvPSAyNTYsIGVMZW4gLT0gOCk7XG4gIGJ1ZmZlclstLWldIHw9IHMgKiAxMjg7XG4gIHJldHVybiBidWZmZXI7XG59O1xudmFyIHVucGFja0lFRUU3NTQgPSBmdW5jdGlvbihidWZmZXIsIG1MZW4sIG5CeXRlcyl7XG4gIHZhciBlTGVuICA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICAgICwgZU1heCAgPSAoMSA8PCBlTGVuKSAtIDFcbiAgICAsIGVCaWFzID0gZU1heCA+PiAxXG4gICAgLCBuQml0cyA9IGVMZW4gLSA3XG4gICAgLCBpICAgICA9IG5CeXRlcyAtIDFcbiAgICAsIHMgICAgID0gYnVmZmVyW2ktLV1cbiAgICAsIGUgICAgID0gcyAmIDEyN1xuICAgICwgbTtcbiAgcyA+Pj0gNztcbiAgZm9yKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltpXSwgaS0tLCBuQml0cyAtPSA4KTtcbiAgbSA9IGUgJiAoMSA8PCAtbkJpdHMpIC0gMTtcbiAgZSA+Pj0gLW5CaXRzO1xuICBuQml0cyArPSBtTGVuO1xuICBmb3IoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW2ldLCBpLS0sIG5CaXRzIC09IDgpO1xuICBpZihlID09PSAwKXtcbiAgICBlID0gMSAtIGVCaWFzO1xuICB9IGVsc2UgaWYoZSA9PT0gZU1heCl7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiBzID8gLUluZmluaXR5IDogSW5maW5pdHk7XG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBwb3coMiwgbUxlbik7XG4gICAgZSA9IGUgLSBlQmlhcztcbiAgfSByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIHBvdygyLCBlIC0gbUxlbik7XG59O1xuXG52YXIgdW5wYWNrSTMyID0gZnVuY3Rpb24oYnl0ZXMpe1xuICByZXR1cm4gYnl0ZXNbM10gPDwgMjQgfCBieXRlc1syXSA8PCAxNiB8IGJ5dGVzWzFdIDw8IDggfCBieXRlc1swXTtcbn07XG52YXIgcGFja0k4ID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gW2l0ICYgMHhmZl07XG59O1xudmFyIHBhY2tJMTYgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBbaXQgJiAweGZmLCBpdCA+PiA4ICYgMHhmZl07XG59O1xudmFyIHBhY2tJMzIgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBbaXQgJiAweGZmLCBpdCA+PiA4ICYgMHhmZiwgaXQgPj4gMTYgJiAweGZmLCBpdCA+PiAyNCAmIDB4ZmZdO1xufTtcbnZhciBwYWNrRjY0ID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gcGFja0lFRUU3NTQoaXQsIDUyLCA4KTtcbn07XG52YXIgcGFja0YzMiA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHBhY2tJRUVFNzU0KGl0LCAyMywgNCk7XG59O1xuXG52YXIgYWRkR2V0dGVyID0gZnVuY3Rpb24oQywga2V5LCBpbnRlcm5hbCl7XG4gIGRQKENbUFJPVE9UWVBFXSwga2V5LCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpc1tpbnRlcm5hbF07IH19KTtcbn07XG5cbnZhciBnZXQgPSBmdW5jdGlvbih2aWV3LCBieXRlcywgaW5kZXgsIGlzTGl0dGxlRW5kaWFuKXtcbiAgdmFyIG51bUluZGV4ID0gK2luZGV4XG4gICAgLCBpbnRJbmRleCA9IHRvSW50ZWdlcihudW1JbmRleCk7XG4gIGlmKG51bUluZGV4ICE9IGludEluZGV4IHx8IGludEluZGV4IDwgMCB8fCBpbnRJbmRleCArIGJ5dGVzID4gdmlld1skTEVOR1RIXSl0aHJvdyBSYW5nZUVycm9yKFdST05HX0lOREVYKTtcbiAgdmFyIHN0b3JlID0gdmlld1skQlVGRkVSXS5fYlxuICAgICwgc3RhcnQgPSBpbnRJbmRleCArIHZpZXdbJE9GRlNFVF1cbiAgICAsIHBhY2sgID0gc3RvcmUuc2xpY2Uoc3RhcnQsIHN0YXJ0ICsgYnl0ZXMpO1xuICByZXR1cm4gaXNMaXR0bGVFbmRpYW4gPyBwYWNrIDogcGFjay5yZXZlcnNlKCk7XG59O1xudmFyIHNldCA9IGZ1bmN0aW9uKHZpZXcsIGJ5dGVzLCBpbmRleCwgY29udmVyc2lvbiwgdmFsdWUsIGlzTGl0dGxlRW5kaWFuKXtcbiAgdmFyIG51bUluZGV4ID0gK2luZGV4XG4gICAgLCBpbnRJbmRleCA9IHRvSW50ZWdlcihudW1JbmRleCk7XG4gIGlmKG51bUluZGV4ICE9IGludEluZGV4IHx8IGludEluZGV4IDwgMCB8fCBpbnRJbmRleCArIGJ5dGVzID4gdmlld1skTEVOR1RIXSl0aHJvdyBSYW5nZUVycm9yKFdST05HX0lOREVYKTtcbiAgdmFyIHN0b3JlID0gdmlld1skQlVGRkVSXS5fYlxuICAgICwgc3RhcnQgPSBpbnRJbmRleCArIHZpZXdbJE9GRlNFVF1cbiAgICAsIHBhY2sgID0gY29udmVyc2lvbigrdmFsdWUpO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgYnl0ZXM7IGkrKylzdG9yZVtzdGFydCArIGldID0gcGFja1tpc0xpdHRsZUVuZGlhbiA/IGkgOiBieXRlcyAtIGkgLSAxXTtcbn07XG5cbnZhciB2YWxpZGF0ZUFycmF5QnVmZmVyQXJndW1lbnRzID0gZnVuY3Rpb24odGhhdCwgbGVuZ3RoKXtcbiAgYW5JbnN0YW5jZSh0aGF0LCAkQXJyYXlCdWZmZXIsIEFSUkFZX0JVRkZFUik7XG4gIHZhciBudW1iZXJMZW5ndGggPSArbGVuZ3RoXG4gICAgLCBieXRlTGVuZ3RoICAgPSB0b0xlbmd0aChudW1iZXJMZW5ndGgpO1xuICBpZihudW1iZXJMZW5ndGggIT0gYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gIHJldHVybiBieXRlTGVuZ3RoO1xufTtcblxuaWYoISR0eXBlZC5BQlYpe1xuICAkQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiBBcnJheUJ1ZmZlcihsZW5ndGgpe1xuICAgIHZhciBieXRlTGVuZ3RoID0gdmFsaWRhdGVBcnJheUJ1ZmZlckFyZ3VtZW50cyh0aGlzLCBsZW5ndGgpO1xuICAgIHRoaXMuX2IgICAgICAgPSBhcnJheUZpbGwuY2FsbChBcnJheShieXRlTGVuZ3RoKSwgMCk7XG4gICAgdGhpc1skTEVOR1RIXSA9IGJ5dGVMZW5ndGg7XG4gIH07XG5cbiAgJERhdGFWaWV3ID0gZnVuY3Rpb24gRGF0YVZpZXcoYnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKXtcbiAgICBhbkluc3RhbmNlKHRoaXMsICREYXRhVmlldywgREFUQV9WSUVXKTtcbiAgICBhbkluc3RhbmNlKGJ1ZmZlciwgJEFycmF5QnVmZmVyLCBEQVRBX1ZJRVcpO1xuICAgIHZhciBidWZmZXJMZW5ndGggPSBidWZmZXJbJExFTkdUSF1cbiAgICAgICwgb2Zmc2V0ICAgICAgID0gdG9JbnRlZ2VyKGJ5dGVPZmZzZXQpO1xuICAgIGlmKG9mZnNldCA8IDAgfHwgb2Zmc2V0ID4gYnVmZmVyTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoJ1dyb25nIG9mZnNldCEnKTtcbiAgICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA9PT0gdW5kZWZpbmVkID8gYnVmZmVyTGVuZ3RoIC0gb2Zmc2V0IDogdG9MZW5ndGgoYnl0ZUxlbmd0aCk7XG4gICAgaWYob2Zmc2V0ICsgYnl0ZUxlbmd0aCA+IGJ1ZmZlckxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFdST05HX0xFTkdUSCk7XG4gICAgdGhpc1skQlVGRkVSXSA9IGJ1ZmZlcjtcbiAgICB0aGlzWyRPRkZTRVRdID0gb2Zmc2V0O1xuICAgIHRoaXNbJExFTkdUSF0gPSBieXRlTGVuZ3RoO1xuICB9O1xuXG4gIGlmKERFU0NSSVBUT1JTKXtcbiAgICBhZGRHZXR0ZXIoJEFycmF5QnVmZmVyLCBCWVRFX0xFTkdUSCwgJ19sJyk7XG4gICAgYWRkR2V0dGVyKCREYXRhVmlldywgQlVGRkVSLCAnX2InKTtcbiAgICBhZGRHZXR0ZXIoJERhdGFWaWV3LCBCWVRFX0xFTkdUSCwgJ19sJyk7XG4gICAgYWRkR2V0dGVyKCREYXRhVmlldywgQllURV9PRkZTRVQsICdfbycpO1xuICB9XG5cbiAgcmVkZWZpbmVBbGwoJERhdGFWaWV3W1BST1RPVFlQRV0sIHtcbiAgICBnZXRJbnQ4OiBmdW5jdGlvbiBnZXRJbnQ4KGJ5dGVPZmZzZXQpe1xuICAgICAgcmV0dXJuIGdldCh0aGlzLCAxLCBieXRlT2Zmc2V0KVswXSA8PCAyNCA+PiAyNDtcbiAgICB9LFxuICAgIGdldFVpbnQ4OiBmdW5jdGlvbiBnZXRVaW50OChieXRlT2Zmc2V0KXtcbiAgICAgIHJldHVybiBnZXQodGhpcywgMSwgYnl0ZU9mZnNldClbMF07XG4gICAgfSxcbiAgICBnZXRJbnQxNjogZnVuY3Rpb24gZ2V0SW50MTYoYnl0ZU9mZnNldCAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHZhciBieXRlcyA9IGdldCh0aGlzLCAyLCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pO1xuICAgICAgcmV0dXJuIChieXRlc1sxXSA8PCA4IHwgYnl0ZXNbMF0pIDw8IDE2ID4+IDE2O1xuICAgIH0sXG4gICAgZ2V0VWludDE2OiBmdW5jdGlvbiBnZXRVaW50MTYoYnl0ZU9mZnNldCAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHZhciBieXRlcyA9IGdldCh0aGlzLCAyLCBieXRlT2Zmc2V0LCBhcmd1bWVudHNbMV0pO1xuICAgICAgcmV0dXJuIGJ5dGVzWzFdIDw8IDggfCBieXRlc1swXTtcbiAgICB9LFxuICAgIGdldEludDMyOiBmdW5jdGlvbiBnZXRJbnQzMihieXRlT2Zmc2V0IC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgcmV0dXJuIHVucGFja0kzMihnZXQodGhpcywgNCwgYnl0ZU9mZnNldCwgYXJndW1lbnRzWzFdKSk7XG4gICAgfSxcbiAgICBnZXRVaW50MzI6IGZ1bmN0aW9uIGdldFVpbnQzMihieXRlT2Zmc2V0IC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgcmV0dXJuIHVucGFja0kzMihnZXQodGhpcywgNCwgYnl0ZU9mZnNldCwgYXJndW1lbnRzWzFdKSkgPj4+IDA7XG4gICAgfSxcbiAgICBnZXRGbG9hdDMyOiBmdW5jdGlvbiBnZXRGbG9hdDMyKGJ5dGVPZmZzZXQgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICByZXR1cm4gdW5wYWNrSUVFRTc1NChnZXQodGhpcywgNCwgYnl0ZU9mZnNldCwgYXJndW1lbnRzWzFdKSwgMjMsIDQpO1xuICAgIH0sXG4gICAgZ2V0RmxvYXQ2NDogZnVuY3Rpb24gZ2V0RmxvYXQ2NChieXRlT2Zmc2V0IC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgcmV0dXJuIHVucGFja0lFRUU3NTQoZ2V0KHRoaXMsIDgsIGJ5dGVPZmZzZXQsIGFyZ3VtZW50c1sxXSksIDUyLCA4KTtcbiAgICB9LFxuICAgIHNldEludDg6IGZ1bmN0aW9uIHNldEludDgoYnl0ZU9mZnNldCwgdmFsdWUpe1xuICAgICAgc2V0KHRoaXMsIDEsIGJ5dGVPZmZzZXQsIHBhY2tJOCwgdmFsdWUpO1xuICAgIH0sXG4gICAgc2V0VWludDg6IGZ1bmN0aW9uIHNldFVpbnQ4KGJ5dGVPZmZzZXQsIHZhbHVlKXtcbiAgICAgIHNldCh0aGlzLCAxLCBieXRlT2Zmc2V0LCBwYWNrSTgsIHZhbHVlKTtcbiAgICB9LFxuICAgIHNldEludDE2OiBmdW5jdGlvbiBzZXRJbnQxNihieXRlT2Zmc2V0LCB2YWx1ZSAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHNldCh0aGlzLCAyLCBieXRlT2Zmc2V0LCBwYWNrSTE2LCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9LFxuICAgIHNldFVpbnQxNjogZnVuY3Rpb24gc2V0VWludDE2KGJ5dGVPZmZzZXQsIHZhbHVlIC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgc2V0KHRoaXMsIDIsIGJ5dGVPZmZzZXQsIHBhY2tJMTYsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0SW50MzI6IGZ1bmN0aW9uIHNldEludDMyKGJ5dGVPZmZzZXQsIHZhbHVlIC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgc2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIHBhY2tJMzIsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0VWludDMyOiBmdW5jdGlvbiBzZXRVaW50MzIoYnl0ZU9mZnNldCwgdmFsdWUgLyosIGxpdHRsZUVuZGlhbiAqLyl7XG4gICAgICBzZXQodGhpcywgNCwgYnl0ZU9mZnNldCwgcGFja0kzMiwgdmFsdWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfSxcbiAgICBzZXRGbG9hdDMyOiBmdW5jdGlvbiBzZXRGbG9hdDMyKGJ5dGVPZmZzZXQsIHZhbHVlIC8qLCBsaXR0bGVFbmRpYW4gKi8pe1xuICAgICAgc2V0KHRoaXMsIDQsIGJ5dGVPZmZzZXQsIHBhY2tGMzIsIHZhbHVlLCBhcmd1bWVudHNbMl0pO1xuICAgIH0sXG4gICAgc2V0RmxvYXQ2NDogZnVuY3Rpb24gc2V0RmxvYXQ2NChieXRlT2Zmc2V0LCB2YWx1ZSAvKiwgbGl0dGxlRW5kaWFuICovKXtcbiAgICAgIHNldCh0aGlzLCA4LCBieXRlT2Zmc2V0LCBwYWNrRjY0LCB2YWx1ZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9XG4gIH0pO1xufSBlbHNlIHtcbiAgaWYoIWZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgbmV3ICRBcnJheUJ1ZmZlcjsgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gIH0pIHx8ICFmYWlscyhmdW5jdGlvbigpe1xuICAgIG5ldyAkQXJyYXlCdWZmZXIoLjUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICB9KSl7XG4gICAgJEFycmF5QnVmZmVyID0gZnVuY3Rpb24gQXJyYXlCdWZmZXIobGVuZ3RoKXtcbiAgICAgIHJldHVybiBuZXcgQmFzZUJ1ZmZlcih2YWxpZGF0ZUFycmF5QnVmZmVyQXJndW1lbnRzKHRoaXMsIGxlbmd0aCkpO1xuICAgIH07XG4gICAgdmFyIEFycmF5QnVmZmVyUHJvdG8gPSAkQXJyYXlCdWZmZXJbUFJPVE9UWVBFXSA9IEJhc2VCdWZmZXJbUFJPVE9UWVBFXTtcbiAgICBmb3IodmFyIGtleXMgPSBnT1BOKEJhc2VCdWZmZXIpLCBqID0gMCwga2V5OyBrZXlzLmxlbmd0aCA+IGo7ICl7XG4gICAgICBpZighKChrZXkgPSBrZXlzW2orK10pIGluICRBcnJheUJ1ZmZlcikpaGlkZSgkQXJyYXlCdWZmZXIsIGtleSwgQmFzZUJ1ZmZlcltrZXldKTtcbiAgICB9O1xuICAgIGlmKCFMSUJSQVJZKUFycmF5QnVmZmVyUHJvdG8uY29uc3RydWN0b3IgPSAkQXJyYXlCdWZmZXI7XG4gIH1cbiAgLy8gaU9TIFNhZmFyaSA3LnggYnVnXG4gIHZhciB2aWV3ID0gbmV3ICREYXRhVmlldyhuZXcgJEFycmF5QnVmZmVyKDIpKVxuICAgICwgJHNldEludDggPSAkRGF0YVZpZXdbUFJPVE9UWVBFXS5zZXRJbnQ4O1xuICB2aWV3LnNldEludDgoMCwgMjE0NzQ4MzY0OCk7XG4gIHZpZXcuc2V0SW50OCgxLCAyMTQ3NDgzNjQ5KTtcbiAgaWYodmlldy5nZXRJbnQ4KDApIHx8ICF2aWV3LmdldEludDgoMSkpcmVkZWZpbmVBbGwoJERhdGFWaWV3W1BST1RPVFlQRV0sIHtcbiAgICBzZXRJbnQ4OiBmdW5jdGlvbiBzZXRJbnQ4KGJ5dGVPZmZzZXQsIHZhbHVlKXtcbiAgICAgICRzZXRJbnQ4LmNhbGwodGhpcywgYnl0ZU9mZnNldCwgdmFsdWUgPDwgMjQgPj4gMjQpO1xuICAgIH0sXG4gICAgc2V0VWludDg6IGZ1bmN0aW9uIHNldFVpbnQ4KGJ5dGVPZmZzZXQsIHZhbHVlKXtcbiAgICAgICRzZXRJbnQ4LmNhbGwodGhpcywgYnl0ZU9mZnNldCwgdmFsdWUgPDwgMjQgPj4gMjQpO1xuICAgIH1cbiAgfSwgdHJ1ZSk7XG59XG5zZXRUb1N0cmluZ1RhZygkQXJyYXlCdWZmZXIsIEFSUkFZX0JVRkZFUik7XG5zZXRUb1N0cmluZ1RhZygkRGF0YVZpZXcsIERBVEFfVklFVyk7XG5oaWRlKCREYXRhVmlld1tQUk9UT1RZUEVdLCAkdHlwZWQuVklFVywgdHJ1ZSk7XG5leHBvcnRzW0FSUkFZX0JVRkZFUl0gPSAkQXJyYXlCdWZmZXI7XG5leHBvcnRzW0RBVEFfVklFV10gPSAkRGF0YVZpZXc7IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBUWVBFRCAgPSB1aWQoJ3R5cGVkX2FycmF5JylcbiAgLCBWSUVXICAgPSB1aWQoJ3ZpZXcnKVxuICAsIEFCViAgICA9ICEhKGdsb2JhbC5BcnJheUJ1ZmZlciAmJiBnbG9iYWwuRGF0YVZpZXcpXG4gICwgQ09OU1RSID0gQUJWXG4gICwgaSA9IDAsIGwgPSA5LCBUeXBlZDtcblxudmFyIFR5cGVkQXJyYXlDb25zdHJ1Y3RvcnMgPSAoXG4gICdJbnQ4QXJyYXksVWludDhBcnJheSxVaW50OENsYW1wZWRBcnJheSxJbnQxNkFycmF5LFVpbnQxNkFycmF5LEludDMyQXJyYXksVWludDMyQXJyYXksRmxvYXQzMkFycmF5LEZsb2F0NjRBcnJheSdcbikuc3BsaXQoJywnKTtcblxud2hpbGUoaSA8IGwpe1xuICBpZihUeXBlZCA9IGdsb2JhbFtUeXBlZEFycmF5Q29uc3RydWN0b3JzW2krK11dKXtcbiAgICBoaWRlKFR5cGVkLnByb3RvdHlwZSwgVFlQRUQsIHRydWUpO1xuICAgIGhpZGUoVHlwZWQucHJvdG90eXBlLCBWSUVXLCB0cnVlKTtcbiAgfSBlbHNlIENPTlNUUiA9IGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQUJWOiAgICBBQlYsXG4gIENPTlNUUjogQ09OU1RSLFxuICBUWVBFRDogIFRZUEVELFxuICBWSUVXOiAgIFZJRVdcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZihuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKWRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHt2YWx1ZTogd2tzRXh0LmYobmFtZSl9KTtcbn07IiwiZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fd2tzJyk7IiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgIT0gdW5kZWZpbmVkKXJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07IiwiLy8gMjIuMS4zLjMgQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kID0gdGhpcy5sZW5ndGgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ0FycmF5Jywge2NvcHlXaXRoaW46IHJlcXVpcmUoJy4vX2FycmF5LWNvcHktd2l0aGluJyl9KTtcblxucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoJ2NvcHlXaXRoaW4nKTsiLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7ZmlsbDogcmVxdWlyZSgnLi9fYXJyYXktZmlsbCcpfSk7XG5cbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKCdmaWxsJyk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjIuMS4zLjkgQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGZpbmQgICA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSg2KVxuICAsIEtFWSAgICAgPSAnZmluZEluZGV4J1xuICAsIGZvcmNlZCAgPSB0cnVlO1xuLy8gU2hvdWxkbid0IHNraXAgaG9sZXNcbmlmKEtFWSBpbiBbXSlBcnJheSgxKVtLRVldKGZ1bmN0aW9uKCl7IGZvcmNlZCA9IGZhbHNlOyB9KTtcbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZm9yY2VkLCAnQXJyYXknLCB7XG4gIGZpbmRJbmRleDogZnVuY3Rpb24gZmluZEluZGV4KGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRmaW5kKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKShLRVkpOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDIyLjEuMy44IEFycmF5LnByb3RvdHlwZS5maW5kKHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkZmluZCAgID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDUpXG4gICwgS0VZICAgICA9ICdmaW5kJ1xuICAsIGZvcmNlZCAgPSB0cnVlO1xuLy8gU2hvdWxkbid0IHNraXAgaG9sZXNcbmlmKEtFWSBpbiBbXSlBcnJheSgxKVtLRVldKGZ1bmN0aW9uKCl7IGZvcmNlZCA9IGZhbHNlOyB9KTtcbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZm9yY2VkLCAnQXJyYXknLCB7XG4gIGZpbmQ6IGZ1bmN0aW9uIGZpbmQoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGZpbmQodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKEtFWSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgdG9PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIGNhbGwgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciAgICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIHRvTGVuZ3RoICAgICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpXG4gICwgZ2V0SXRlckZuICAgICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xuICAgIHZhciBPICAgICAgID0gdG9PYmplY3QoYXJyYXlMaWtlKVxuICAgICAgLCBDICAgICAgID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheVxuICAgICAgLCBhTGVuICAgID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBtYXBmbiAgID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWRcbiAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcbiAgICAgICwgaW5kZXggICA9IDBcbiAgICAgICwgaXRlckZuICA9IGdldEl0ZXJGbihPKVxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYobWFwcGluZyltYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKXtcbiAgICAgIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQzsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG5cbi8vIFdlYktpdCBBcnJheS5vZiBpc24ndCBnZW5lcmljXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgZnVuY3Rpb24gRigpe31cbiAgcmV0dXJuICEoQXJyYXkub2YuY2FsbChGKSBpbnN0YW5jZW9mIEYpO1xufSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjMgQXJyYXkub2YoIC4uLml0ZW1zKVxuICBvZjogZnVuY3Rpb24gb2YoLyogLi4uYXJncyAqLyl7XG4gICAgdmFyIGluZGV4ICA9IDBcbiAgICAgICwgYUxlbiAgID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCByZXN1bHQgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpKGFMZW4pO1xuICAgIHdoaWxlKGFMZW4gPiBpbmRleCljcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHJlc3VsdC5sZW5ndGggPSBhTGVuO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pOyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBoYXMgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBGUHJvdG8gICAgID0gRnVuY3Rpb24ucHJvdG90eXBlXG4gICwgbmFtZVJFICAgICA9IC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopL1xuICAsIE5BTUUgICAgICAgPSAnbmFtZSc7XG5cbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gMTkuMi40LjIgbmFtZVxuTkFNRSBpbiBGUHJvdG8gfHwgcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiBkUChGUHJvdG8sIE5BTUUsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgdHJ5IHtcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICAsIG5hbWUgPSAoJycgKyB0aGF0KS5tYXRjaChuYW1lUkUpWzFdO1xuICAgICAgaGFzKHRoYXQsIE5BTUUpIHx8ICFpc0V4dGVuc2libGUodGhhdCkgfHwgZFAodGhhdCwgTkFNRSwgY3JlYXRlRGVzYyg1LCBuYW1lKSk7XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjEgTWFwIE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdNYXAnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gTWFwKCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nLCB0cnVlKTsiLCIvLyAyMC4yLjIuMyBNYXRoLmFjb3NoKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgbG9nMXAgICA9IHJlcXVpcmUoJy4vX21hdGgtbG9nMXAnKVxuICAsIHNxcnQgICAgPSBNYXRoLnNxcnRcbiAgLCAkYWNvc2ggID0gTWF0aC5hY29zaDtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKCRhY29zaFxuICAvLyBWOCBidWc6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zNTA5XG4gICYmIE1hdGguZmxvb3IoJGFjb3NoKE51bWJlci5NQVhfVkFMVUUpKSA9PSA3MTBcbiAgLy8gVG9yIEJyb3dzZXIgYnVnOiBNYXRoLmFjb3NoKEluZmluaXR5KSAtPiBOYU4gXG4gICYmICRhY29zaChJbmZpbml0eSkgPT0gSW5maW5pdHlcbiksICdNYXRoJywge1xuICBhY29zaDogZnVuY3Rpb24gYWNvc2goeCl7XG4gICAgcmV0dXJuICh4ID0gK3gpIDwgMSA/IE5hTiA6IHggPiA5NDkwNjI2NS42MjQyNTE1NlxuICAgICAgPyBNYXRoLmxvZyh4KSArIE1hdGguTE4yXG4gICAgICA6IGxvZzFwKHggLSAxICsgc3FydCh4IC0gMSkgKiBzcXJ0KHggKyAxKSk7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkYXNpbmggID0gTWF0aC5hc2luaDtcblxuZnVuY3Rpb24gYXNpbmgoeCl7XG4gIHJldHVybiAhaXNGaW5pdGUoeCA9ICt4KSB8fCB4ID09IDAgPyB4IDogeCA8IDAgPyAtYXNpbmgoLXgpIDogTWF0aC5sb2coeCArIE1hdGguc3FydCh4ICogeCArIDEpKTtcbn1cblxuLy8gVG9yIEJyb3dzZXIgYnVnOiBNYXRoLmFzaW5oKDApIC0+IC0wIFxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKCRhc2luaCAmJiAxIC8gJGFzaW5oKDApID4gMCksICdNYXRoJywge2FzaW5oOiBhc2luaH0pOyIsIi8vIDIwLjIuMi43IE1hdGguYXRhbmgoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkYXRhbmggID0gTWF0aC5hdGFuaDtcblxuLy8gVG9yIEJyb3dzZXIgYnVnOiBNYXRoLmF0YW5oKC0wKSAtPiAwIFxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKCRhdGFuaCAmJiAxIC8gJGF0YW5oKC0wKSA8IDApLCAnTWF0aCcsIHtcbiAgYXRhbmg6IGZ1bmN0aW9uIGF0YW5oKHgpe1xuICAgIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IE1hdGgubG9nKCgxICsgeCkgLyAoMSAtIHgpKSAvIDI7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi45IE1hdGguY2JydCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHNpZ24gICAgPSByZXF1aXJlKCcuL19tYXRoLXNpZ24nKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBjYnJ0OiBmdW5jdGlvbiBjYnJ0KHgpe1xuICAgIHJldHVybiBzaWduKHggPSAreCkgKiBNYXRoLnBvdyhNYXRoLmFicyh4KSwgMSAvIDMpO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMTEgTWF0aC5jbHozMih4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBjbHozMjogZnVuY3Rpb24gY2x6MzIoeCl7XG4gICAgcmV0dXJuICh4ID4+Pj0gMCkgPyAzMSAtIE1hdGguZmxvb3IoTWF0aC5sb2coeCArIDAuNSkgKiBNYXRoLkxPRzJFKSA6IDMyO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMTIgTWF0aC5jb3NoKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgZXhwICAgICA9IE1hdGguZXhwO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGNvc2g6IGZ1bmN0aW9uIGNvc2goeCl7XG4gICAgcmV0dXJuIChleHAoeCA9ICt4KSArIGV4cCgteCkpIC8gMjtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkZXhwbTEgID0gcmVxdWlyZSgnLi9fbWF0aC1leHBtMScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICgkZXhwbTEgIT0gTWF0aC5leHBtMSksICdNYXRoJywge2V4cG0xOiAkZXhwbTF9KTsiLCIvLyAyMC4yLjIuMTYgTWF0aC5mcm91bmQoeClcbnZhciAkZXhwb3J0ICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHNpZ24gICAgICA9IHJlcXVpcmUoJy4vX21hdGgtc2lnbicpXG4gICwgcG93ICAgICAgID0gTWF0aC5wb3dcbiAgLCBFUFNJTE9OICAgPSBwb3coMiwgLTUyKVxuICAsIEVQU0lMT04zMiA9IHBvdygyLCAtMjMpXG4gICwgTUFYMzIgICAgID0gcG93KDIsIDEyNykgKiAoMiAtIEVQU0lMT04zMilcbiAgLCBNSU4zMiAgICAgPSBwb3coMiwgLTEyNik7XG5cbnZhciByb3VuZFRpZXNUb0V2ZW4gPSBmdW5jdGlvbihuKXtcbiAgcmV0dXJuIG4gKyAxIC8gRVBTSUxPTiAtIDEgLyBFUFNJTE9OO1xufTtcblxuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGZyb3VuZDogZnVuY3Rpb24gZnJvdW5kKHgpe1xuICAgIHZhciAkYWJzICA9IE1hdGguYWJzKHgpXG4gICAgICAsICRzaWduID0gc2lnbih4KVxuICAgICAgLCBhLCByZXN1bHQ7XG4gICAgaWYoJGFicyA8IE1JTjMyKXJldHVybiAkc2lnbiAqIHJvdW5kVGllc1RvRXZlbigkYWJzIC8gTUlOMzIgLyBFUFNJTE9OMzIpICogTUlOMzIgKiBFUFNJTE9OMzI7XG4gICAgYSA9ICgxICsgRVBTSUxPTjMyIC8gRVBTSUxPTikgKiAkYWJzO1xuICAgIHJlc3VsdCA9IGEgLSAoYSAtICRhYnMpO1xuICAgIGlmKHJlc3VsdCA+IE1BWDMyIHx8IHJlc3VsdCAhPSByZXN1bHQpcmV0dXJuICRzaWduICogSW5maW5pdHk7XG4gICAgcmV0dXJuICRzaWduICogcmVzdWx0O1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMTcgTWF0aC5oeXBvdChbdmFsdWUxWywgdmFsdWUyWywg4oCmIF1dXSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBhYnMgICAgID0gTWF0aC5hYnM7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgaHlwb3Q6IGZ1bmN0aW9uIGh5cG90KHZhbHVlMSwgdmFsdWUyKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHZhciBzdW0gID0gMFxuICAgICAgLCBpICAgID0gMFxuICAgICAgLCBhTGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBsYXJnID0gMFxuICAgICAgLCBhcmcsIGRpdjtcbiAgICB3aGlsZShpIDwgYUxlbil7XG4gICAgICBhcmcgPSBhYnMoYXJndW1lbnRzW2krK10pO1xuICAgICAgaWYobGFyZyA8IGFyZyl7XG4gICAgICAgIGRpdiAgPSBsYXJnIC8gYXJnO1xuICAgICAgICBzdW0gID0gc3VtICogZGl2ICogZGl2ICsgMTtcbiAgICAgICAgbGFyZyA9IGFyZztcbiAgICAgIH0gZWxzZSBpZihhcmcgPiAwKXtcbiAgICAgICAgZGl2ICA9IGFyZyAvIGxhcmc7XG4gICAgICAgIHN1bSArPSBkaXYgKiBkaXY7XG4gICAgICB9IGVsc2Ugc3VtICs9IGFyZztcbiAgICB9XG4gICAgcmV0dXJuIGxhcmcgPT09IEluZmluaXR5ID8gSW5maW5pdHkgOiBsYXJnICogTWF0aC5zcXJ0KHN1bSk7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4xOCBNYXRoLmltdWwoeCwgeSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkaW11bCAgID0gTWF0aC5pbXVsO1xuXG4vLyBzb21lIFdlYktpdCB2ZXJzaW9ucyBmYWlscyB3aXRoIGJpZyBudW1iZXJzLCBzb21lIGhhcyB3cm9uZyBhcml0eVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaW11bCgweGZmZmZmZmZmLCA1KSAhPSAtNSB8fCAkaW11bC5sZW5ndGggIT0gMjtcbn0pLCAnTWF0aCcsIHtcbiAgaW11bDogZnVuY3Rpb24gaW11bCh4LCB5KXtcbiAgICB2YXIgVUlOVDE2ID0gMHhmZmZmXG4gICAgICAsIHhuID0gK3hcbiAgICAgICwgeW4gPSAreVxuICAgICAgLCB4bCA9IFVJTlQxNiAmIHhuXG4gICAgICAsIHlsID0gVUlOVDE2ICYgeW47XG4gICAgcmV0dXJuIDAgfCB4bCAqIHlsICsgKChVSU5UMTYgJiB4biA+Pj4gMTYpICogeWwgKyB4bCAqIChVSU5UMTYgJiB5biA+Pj4gMTYpIDw8IDE2ID4+PiAwKTtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjIxIE1hdGgubG9nMTAoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgbG9nMTA6IGZ1bmN0aW9uIGxvZzEwKHgpe1xuICAgIHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGguTE4xMDtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjIwIE1hdGgubG9nMXAoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtsb2cxcDogcmVxdWlyZSgnLi9fbWF0aC1sb2cxcCcpfSk7IiwiLy8gMjAuMi4yLjIyIE1hdGgubG9nMih4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBsb2cyOiBmdW5jdGlvbiBsb2cyKHgpe1xuICAgIHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGguTE4yO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7c2lnbjogcmVxdWlyZSgnLi9fbWF0aC1zaWduJyl9KTsiLCIvLyAyMC4yLjIuMzAgTWF0aC5zaW5oKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgZXhwbTEgICA9IHJlcXVpcmUoJy4vX21hdGgtZXhwbTEnKVxuICAsIGV4cCAgICAgPSBNYXRoLmV4cDtcblxuLy8gVjggbmVhciBDaHJvbWl1bSAzOCBoYXMgYSBwcm9ibGVtIHdpdGggdmVyeSBzbWFsbCBudW1iZXJzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuICFNYXRoLnNpbmgoLTJlLTE3KSAhPSAtMmUtMTc7XG59KSwgJ01hdGgnLCB7XG4gIHNpbmg6IGZ1bmN0aW9uIHNpbmgoeCl7XG4gICAgcmV0dXJuIE1hdGguYWJzKHggPSAreCkgPCAxXG4gICAgICA/IChleHBtMSh4KSAtIGV4cG0xKC14KSkgLyAyXG4gICAgICA6IChleHAoeCAtIDEpIC0gZXhwKC14IC0gMSkpICogKE1hdGguRSAvIDIpO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMzMgTWF0aC50YW5oKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgZXhwbTEgICA9IHJlcXVpcmUoJy4vX21hdGgtZXhwbTEnKVxuICAsIGV4cCAgICAgPSBNYXRoLmV4cDtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICB0YW5oOiBmdW5jdGlvbiB0YW5oKHgpe1xuICAgIHZhciBhID0gZXhwbTEoeCA9ICt4KVxuICAgICAgLCBiID0gZXhwbTEoLXgpO1xuICAgIHJldHVybiBhID09IEluZmluaXR5ID8gMSA6IGIgPT0gSW5maW5pdHkgPyAtMSA6IChhIC0gYikgLyAoZXhwKHgpICsgZXhwKC14KSk7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4zNCBNYXRoLnRydW5jKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIHRydW5jOiBmdW5jdGlvbiB0cnVuYyhpdCl7XG4gICAgcmV0dXJuIChpdCA+IDAgPyBNYXRoLmZsb29yIDogTWF0aC5jZWlsKShpdCk7XG4gIH1cbn0pOyIsIi8vIDIwLjEuMi4xIE51bWJlci5FUFNJTE9OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtFUFNJTE9OOiBNYXRoLnBvdygyLCAtNTIpfSk7IiwiLy8gMjAuMS4yLjIgTnVtYmVyLmlzRmluaXRlKG51bWJlcilcbnZhciAkZXhwb3J0ICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIF9pc0Zpbml0ZSA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmlzRmluaXRlO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtcbiAgaXNGaW5pdGU6IGZ1bmN0aW9uIGlzRmluaXRlKGl0KXtcbiAgICByZXR1cm4gdHlwZW9mIGl0ID09ICdudW1iZXInICYmIF9pc0Zpbml0ZShpdCk7XG4gIH1cbn0pOyIsIi8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7aXNJbnRlZ2VyOiByZXF1aXJlKCcuL19pcy1pbnRlZ2VyJyl9KTsiLCIvLyAyMC4xLjIuNCBOdW1iZXIuaXNOYU4obnVtYmVyKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7XG4gIGlzTmFOOiBmdW5jdGlvbiBpc05hTihudW1iZXIpe1xuICAgIHJldHVybiBudW1iZXIgIT0gbnVtYmVyO1xuICB9XG59KTsiLCIvLyAyMC4xLjIuNSBOdW1iZXIuaXNTYWZlSW50ZWdlcihudW1iZXIpXG52YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBpc0ludGVnZXIgPSByZXF1aXJlKCcuL19pcy1pbnRlZ2VyJylcbiAgLCBhYnMgICAgICAgPSBNYXRoLmFicztcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7XG4gIGlzU2FmZUludGVnZXI6IGZ1bmN0aW9uIGlzU2FmZUludGVnZXIobnVtYmVyKXtcbiAgICByZXR1cm4gaXNJbnRlZ2VyKG51bWJlcikgJiYgYWJzKG51bWJlcikgPD0gMHgxZmZmZmZmZmZmZmZmZjtcbiAgfVxufSk7IiwiLy8gMjAuMS4yLjYgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge01BWF9TQUZFX0lOVEVHRVI6IDB4MWZmZmZmZmZmZmZmZmZ9KTsiLCIvLyAyMC4xLjIuMTAgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge01JTl9TQUZFX0lOVEVHRVI6IC0weDFmZmZmZmZmZmZmZmZmfSk7IiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpfSk7IiwiLy8gMTkuMS4zLjEwIE9iamVjdC5pcyh2YWx1ZTEsIHZhbHVlMilcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtpczogcmVxdWlyZSgnLi9fc2FtZS12YWx1ZScpfSk7IiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0fSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjbGFzc29mICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCAkZXhwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICAgICAgICAgID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgYW5JbnN0YW5jZSAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGZvck9mICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpXG4gICwgdGFzayAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIG1pY3JvdGFzayAgICAgICAgICA9IHJlcXVpcmUoJy4vX21pY3JvdGFzaycpKClcbiAgLCBQUk9NSVNFICAgICAgICAgICAgPSAnUHJvbWlzZSdcbiAgLCBUeXBlRXJyb3IgICAgICAgICAgPSBnbG9iYWwuVHlwZUVycm9yXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCAkUHJvbWlzZSAgICAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgICAgICAgICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgZW1wdHkgICAgICAgICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIEludGVybmFsLCBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIFdyYXBwZXI7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbigpe1xuICB0cnkge1xuICAgIC8vIGNvcnJlY3Qgc3ViY2xhc3Npbmcgd2l0aCBAQHNwZWNpZXMgc3VwcG9ydFxuICAgIHZhciBwcm9taXNlICAgICA9ICRQcm9taXNlLnJlc29sdmUoMSlcbiAgICAgICwgRmFrZVByb21pc2UgPSAocHJvbWlzZS5jb25zdHJ1Y3RvciA9IHt9KVtyZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpXSA9IGZ1bmN0aW9uKGV4ZWMpeyBleGVjKGVtcHR5LCBlbXB0eSk7IH07XG4gICAgLy8gdW5oYW5kbGVkIHJlamVjdGlvbnMgdHJhY2tpbmcgc3VwcG9ydCwgTm9kZUpTIFByb21pc2Ugd2l0aG91dCBpdCBmYWlscyBAQHNwZWNpZXMgdGVzdFxuICAgIHJldHVybiAoaXNOb2RlIHx8IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJykgJiYgcHJvbWlzZS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIEZha2VQcm9taXNlO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gd2l0aCBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIHJldHVybiBhID09PSBiIHx8IGEgPT09ICRQcm9taXNlICYmIGIgPT09IFdyYXBwZXI7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHJldHVybiBzYW1lQ29uc3RydWN0b3IoJFByb21pc2UsIEMpXG4gICAgPyBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICA6IG5ldyBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpO1xufTtcbnZhciBwZXJmb3JtID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB7ZXJyb3I6IGV9O1xuICB9XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uKHByb21pc2UsIGlzUmVqZWN0KXtcbiAgaWYocHJvbWlzZS5fbilyZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIG9rICAgID0gcHJvbWlzZS5fcyA9PSAxXG4gICAgICAsIGkgICAgID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24ocmVhY3Rpb24pe1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbFxuICAgICAgICAsIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlXG4gICAgICAgICwgcmVqZWN0ICA9IHJlYWN0aW9uLnJlamVjdFxuICAgICAgICAsIGRvbWFpbiAgPSByZWFjdGlvbi5kb21haW5cbiAgICAgICAgLCByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihoYW5kbGVyKXtcbiAgICAgICAgICBpZighb2spe1xuICAgICAgICAgICAgaWYocHJvbWlzZS5faCA9PSAyKW9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGhhbmRsZXIgPT09IHRydWUpcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmKGRvbWFpbilkb21haW4uZXhpdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2Upe1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZihpc1JlamVjdCAmJiAhcHJvbWlzZS5faClvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgLCBhYnJ1cHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xuICAgICAgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbil7XG4gICAgICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBwcm9taXNlLl9oID0gaXNOb2RlIHx8IGlzVW5oYW5kbGVkKHByb21pc2UpID8gMiA6IDE7XG4gICAgfSBwcm9taXNlLl9hID0gdW5kZWZpbmVkO1xuICAgIGlmKGFicnVwdCl0aHJvdyBhYnJ1cHQuZXJyb3I7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICBpZihwcm9taXNlLl9oID09IDEpcmV0dXJuIGZhbHNlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9hIHx8IHByb21pc2UuX2NcbiAgICAsIGkgICAgID0gMFxuICAgICwgcmVhY3Rpb247XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyIG9uSGFuZGxlVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYoaXNOb2RlKXtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCl7XG4gICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHByb21pc2UuX3Z9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmKCFwcm9taXNlLl9hKXByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpc1xuICAgICwgdGhlbjtcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZihwcm9taXNlID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB3cmFwcGVyID0ge193OiBwcm9taXNlLCBfZDogZmFsc2V9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCFVU0VfTkFUSVZFKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIHRoaXMuX2MgPSBbXTsgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgdGhpcy5fYSA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgIHRoaXMuX3MgPSAwOyAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICB0aGlzLl9kID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICB0aGlzLl92ID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIHZhbHVlXG4gICAgdGhpcy5faCA9IDA7ICAgICAgICAgICAgICAvLyA8LSByZWplY3Rpb24gc3RhdGUsIDAgLSBkZWZhdWx0LCAxIC0gaGFuZGxlZCwgMiAtIHVuaGFuZGxlZFxuICAgIHRoaXMuX24gPSBmYWxzZTsgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gIH07XG4gIEludGVybmFsLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpKCRQcm9taXNlLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gICAgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rICAgICA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCAgID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fYSl0aGlzLl9hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fcylub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcHJvbWlzZSAgPSBuZXcgSW50ZXJuYWw7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ICA9IGN0eCgkcmVqZWN0LCBwcm9taXNlLCAxKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwge1Byb21pc2U6ICRQcm9taXNlfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCl7XG4gICAgLy8gaW5zdGFuY2VvZiBpbnN0ZWFkIG9mIGludGVybmFsIHNsb3QgY2hlY2sgYmVjYXVzZSB3ZSBzaG91bGQgZml4IGl0IHdpdGhvdXQgcmVwbGFjZW1lbnQgbmF0aXZlIFByb21pc2UgY29yZVxuICAgIGlmKHggaW5zdGFuY2VvZiAkUHJvbWlzZSAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlc29sdmUgID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgICQkcmVzb2x2ZSh4KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gICRQcm9taXNlLmFsbChpdGVyKVsnY2F0Y2gnXShlbXB0eSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlc29sdmUgICAgPSBjYXBhYmlsaXR5LnJlc29sdmVcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdmFsdWVzICAgID0gW11cbiAgICAgICAgLCBpbmRleCAgICAgPSAwXG4gICAgICAgICwgcmVtYWluaW5nID0gMTtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIHZhciAkaW5kZXggICAgICAgID0gaW5kZXgrK1xuICAgICAgICAgICwgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIGlmKGFscmVhZHlDYWxsZWQpcmV0dXJuO1xuICAgICAgICAgIGFscmVhZHlDYWxsZWQgID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7IiwiLy8gMjYuMS4xIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpXG52YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBhbk9iamVjdCAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHJBcHBseSAgICA9IChyZXF1aXJlKCcuL19nbG9iYWwnKS5SZWZsZWN0IHx8IHt9KS5hcHBseVxuICAsIGZBcHBseSAgICA9IEZ1bmN0aW9uLmFwcGx5O1xuLy8gTVMgRWRnZSBhcmd1bWVudHNMaXN0IGFyZ3VtZW50IGlzIG9wdGlvbmFsXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJBcHBseShmdW5jdGlvbigpe30pO1xufSksICdSZWZsZWN0Jywge1xuICBhcHBseTogZnVuY3Rpb24gYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3Qpe1xuICAgIHZhciBUID0gYUZ1bmN0aW9uKHRhcmdldClcbiAgICAgICwgTCA9IGFuT2JqZWN0KGFyZ3VtZW50c0xpc3QpO1xuICAgIHJldHVybiByQXBwbHkgPyByQXBwbHkoVCwgdGhpc0FyZ3VtZW50LCBMKSA6IGZBcHBseS5jYWxsKFQsIHRoaXNBcmd1bWVudCwgTCk7XG4gIH1cbn0pOyIsIi8vIDI2LjEuMiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3VtZW50c0xpc3QgWywgbmV3VGFyZ2V0XSlcbnZhciAkZXhwb3J0ICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBjcmVhdGUgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgYUZ1bmN0aW9uICA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIGFuT2JqZWN0ICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGlzT2JqZWN0ICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGZhaWxzICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgYmluZCAgICAgICA9IHJlcXVpcmUoJy4vX2JpbmQnKVxuICAsIHJDb25zdHJ1Y3QgPSAocmVxdWlyZSgnLi9fZ2xvYmFsJykuUmVmbGVjdCB8fCB7fSkuY29uc3RydWN0O1xuXG4vLyBNUyBFZGdlIHN1cHBvcnRzIG9ubHkgMiBhcmd1bWVudHMgYW5kIGFyZ3VtZW50c0xpc3QgYXJndW1lbnQgaXMgb3B0aW9uYWxcbi8vIEZGIE5pZ2h0bHkgc2V0cyB0aGlyZCBhcmd1bWVudCBhcyBgbmV3LnRhcmdldGAsIGJ1dCBkb2VzIG5vdCBjcmVhdGUgYHRoaXNgIGZyb20gaXRcbnZhciBORVdfVEFSR0VUX0JVRyA9IGZhaWxzKGZ1bmN0aW9uKCl7XG4gIGZ1bmN0aW9uIEYoKXt9XG4gIHJldHVybiAhKHJDb25zdHJ1Y3QoZnVuY3Rpb24oKXt9LCBbXSwgRikgaW5zdGFuY2VvZiBGKTtcbn0pO1xudmFyIEFSR1NfQlVHID0gIWZhaWxzKGZ1bmN0aW9uKCl7XG4gIHJDb25zdHJ1Y3QoZnVuY3Rpb24oKXt9KTtcbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChORVdfVEFSR0VUX0JVRyB8fCBBUkdTX0JVRyksICdSZWZsZWN0Jywge1xuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIGNvbnN0cnVjdChUYXJnZXQsIGFyZ3MgLyosIG5ld1RhcmdldCovKXtcbiAgICBhRnVuY3Rpb24oVGFyZ2V0KTtcbiAgICBhbk9iamVjdChhcmdzKTtcbiAgICB2YXIgbmV3VGFyZ2V0ID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyBUYXJnZXQgOiBhRnVuY3Rpb24oYXJndW1lbnRzWzJdKTtcbiAgICBpZihBUkdTX0JVRyAmJiAhTkVXX1RBUkdFVF9CVUcpcmV0dXJuIHJDb25zdHJ1Y3QoVGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpO1xuICAgIGlmKFRhcmdldCA9PSBuZXdUYXJnZXQpe1xuICAgICAgLy8gdy9vIGFsdGVyZWQgbmV3VGFyZ2V0LCBvcHRpbWl6YXRpb24gZm9yIDAtNCBhcmd1bWVudHNcbiAgICAgIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBUYXJnZXQ7XG4gICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBUYXJnZXQoYXJnc1swXSk7XG4gICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBUYXJnZXQoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgIGNhc2UgMzogcmV0dXJuIG5ldyBUYXJnZXQoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgIGNhc2UgNDogcmV0dXJuIG5ldyBUYXJnZXQoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gICAgICB9XG4gICAgICAvLyB3L28gYWx0ZXJlZCBuZXdUYXJnZXQsIGxvdCBvZiBhcmd1bWVudHMgY2FzZVxuICAgICAgdmFyICRhcmdzID0gW251bGxdO1xuICAgICAgJGFyZ3MucHVzaC5hcHBseSgkYXJncywgYXJncyk7XG4gICAgICByZXR1cm4gbmV3IChiaW5kLmFwcGx5KFRhcmdldCwgJGFyZ3MpKTtcbiAgICB9XG4gICAgLy8gd2l0aCBhbHRlcmVkIG5ld1RhcmdldCwgbm90IHN1cHBvcnQgYnVpbHQtaW4gY29uc3RydWN0b3JzXG4gICAgdmFyIHByb3RvICAgID0gbmV3VGFyZ2V0LnByb3RvdHlwZVxuICAgICAgLCBpbnN0YW5jZSA9IGNyZWF0ZShpc09iamVjdChwcm90bykgPyBwcm90byA6IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICAsIHJlc3VsdCAgID0gRnVuY3Rpb24uYXBwbHkuY2FsbChUYXJnZXQsIGluc3RhbmNlLCBhcmdzKTtcbiAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IGluc3RhbmNlO1xuICB9XG59KTsiLCIvLyAyNi4xLjMgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKVxudmFyIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCAkZXhwb3J0ICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG5cbi8vIE1TIEVkZ2UgaGFzIGJyb2tlbiBSZWZsZWN0LmRlZmluZVByb3BlcnR5IC0gdGhyb3dpbmcgaW5zdGVhZCBvZiByZXR1cm5pbmcgZmFsc2VcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGRQLmYoe30sIDEsIHt2YWx1ZTogMX0pLCAxLCB7dmFsdWU6IDJ9KTtcbn0pLCAnUmVmbGVjdCcsIHtcbiAgZGVmaW5lUHJvcGVydHk6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpe1xuICAgIGFuT2JqZWN0KHRhcmdldCk7XG4gICAgcHJvcGVydHlLZXkgPSB0b1ByaW1pdGl2ZShwcm9wZXJ0eUtleSwgdHJ1ZSk7XG4gICAgYW5PYmplY3QoYXR0cmlidXRlcyk7XG4gICAgdHJ5IHtcbiAgICAgIGRQLmYodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufSk7IiwiLy8gMjYuMS40IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSlcbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgZ09QRCAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmZcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGRlbGV0ZVByb3BlcnR5OiBmdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5KXtcbiAgICB2YXIgZGVzYyA9IGdPUEQoYW5PYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xuICAgIHJldHVybiBkZXNjICYmICFkZXNjLmNvbmZpZ3VyYWJsZSA/IGZhbHNlIDogZGVsZXRlIHRhcmdldFtwcm9wZXJ0eUtleV07XG4gIH1cbn0pOyIsIi8vIDI2LjEuNyBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KVxudmFyIGdPUEQgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKVxuICAsICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpe1xuICAgIHJldHVybiBnT1BELmYoYW5PYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xuICB9XG59KTsiLCIvLyAyNi4xLjggUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGdldFByb3RvID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBnZXRQcm90b3R5cGVPZjogZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KXtcbiAgICByZXR1cm4gZ2V0UHJvdG8oYW5PYmplY3QodGFyZ2V0KSk7XG4gIH1cbn0pOyIsIi8vIDI2LjEuNiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5S2V5IFssIHJlY2VpdmVyXSlcbnZhciBnT1BEICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgaXNPYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5cbmZ1bmN0aW9uIGdldCh0YXJnZXQsIHByb3BlcnR5S2V5LyosIHJlY2VpdmVyKi8pe1xuICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXVxuICAgICwgZGVzYywgcHJvdG87XG4gIGlmKGFuT2JqZWN0KHRhcmdldCkgPT09IHJlY2VpdmVyKXJldHVybiB0YXJnZXRbcHJvcGVydHlLZXldO1xuICBpZihkZXNjID0gZ09QRC5mKHRhcmdldCwgcHJvcGVydHlLZXkpKXJldHVybiBoYXMoZGVzYywgJ3ZhbHVlJylcbiAgICA/IGRlc2MudmFsdWVcbiAgICA6IGRlc2MuZ2V0ICE9PSB1bmRlZmluZWRcbiAgICAgID8gZGVzYy5nZXQuY2FsbChyZWNlaXZlcilcbiAgICAgIDogdW5kZWZpbmVkO1xuICBpZihpc09iamVjdChwcm90byA9IGdldFByb3RvdHlwZU9mKHRhcmdldCkpKXJldHVybiBnZXQocHJvdG8sIHByb3BlcnR5S2V5LCByZWNlaXZlcik7XG59XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtnZXQ6IGdldH0pOyIsIi8vIDI2LjEuOSBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3BlcnR5S2V5KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBoYXM6IGZ1bmN0aW9uIGhhcyh0YXJnZXQsIHByb3BlcnR5S2V5KXtcbiAgICByZXR1cm4gcHJvcGVydHlLZXkgaW4gdGFyZ2V0O1xuICB9XG59KTsiLCIvLyAyNi4xLjEwIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldClcbnZhciAkZXhwb3J0ICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBhbk9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCAkaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uIGlzRXh0ZW5zaWJsZSh0YXJnZXQpe1xuICAgIGFuT2JqZWN0KHRhcmdldCk7XG4gICAgcmV0dXJuICRpc0V4dGVuc2libGUgPyAkaXNFeHRlbnNpYmxlKHRhcmdldCkgOiB0cnVlO1xuICB9XG59KTsiLCIvLyAyNi4xLjExIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7b3duS2V5czogcmVxdWlyZSgnLi9fb3duLWtleXMnKX0pOyIsIi8vIDI2LjEuMTIgUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpXG52YXIgJGV4cG9ydCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBhbk9iamVjdCAgICAgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsICRwcmV2ZW50RXh0ZW5zaW9ucyA9IE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucztcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBwcmV2ZW50RXh0ZW5zaW9uczogZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KXtcbiAgICBhbk9iamVjdCh0YXJnZXQpO1xuICAgIHRyeSB7XG4gICAgICBpZigkcHJldmVudEV4dGVuc2lvbnMpJHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufSk7IiwiLy8gMjYuMS4xNCBSZWZsZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHNldFByb3RvID0gcmVxdWlyZSgnLi9fc2V0LXByb3RvJyk7XG5cbmlmKHNldFByb3RvKSRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgc2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pe1xuICAgIHNldFByb3RvLmNoZWNrKHRhcmdldCwgcHJvdG8pO1xuICAgIHRyeSB7XG4gICAgICBzZXRQcm90by5zZXQodGFyZ2V0LCBwcm90byk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufSk7IiwiLy8gMjYuMS4xMyBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWIFssIHJlY2VpdmVyXSlcbnZhciBkUCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgZ09QRCAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5cbmZ1bmN0aW9uIHNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWLyosIHJlY2VpdmVyKi8pe1xuICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgNCA/IHRhcmdldCA6IGFyZ3VtZW50c1szXVxuICAgICwgb3duRGVzYyAgPSBnT1BELmYoYW5PYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpXG4gICAgLCBleGlzdGluZ0Rlc2NyaXB0b3IsIHByb3RvO1xuICBpZighb3duRGVzYyl7XG4gICAgaWYoaXNPYmplY3QocHJvdG8gPSBnZXRQcm90b3R5cGVPZih0YXJnZXQpKSl7XG4gICAgICByZXR1cm4gc2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgViwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgICBvd25EZXNjID0gY3JlYXRlRGVzYygwKTtcbiAgfVxuICBpZihoYXMob3duRGVzYywgJ3ZhbHVlJykpe1xuICAgIGlmKG93bkRlc2Mud3JpdGFibGUgPT09IGZhbHNlIHx8ICFpc09iamVjdChyZWNlaXZlcikpcmV0dXJuIGZhbHNlO1xuICAgIGV4aXN0aW5nRGVzY3JpcHRvciA9IGdPUEQuZihyZWNlaXZlciwgcHJvcGVydHlLZXkpIHx8IGNyZWF0ZURlc2MoMCk7XG4gICAgZXhpc3RpbmdEZXNjcmlwdG9yLnZhbHVlID0gVjtcbiAgICBkUC5mKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSwgZXhpc3RpbmdEZXNjcmlwdG9yKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gb3duRGVzYy5zZXQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogKG93bkRlc2Muc2V0LmNhbGwocmVjZWl2ZXIsIFYpLCB0cnVlKTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge3NldDogc2V0fSk7IiwiLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3MoKVxuaWYocmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAvLi9nLmZsYWdzICE9ICdnJylyZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mKFJlZ0V4cC5wcm90b3R5cGUsICdmbGFncycsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IHJlcXVpcmUoJy4vX2ZsYWdzJylcbn0pOyIsIi8vIEBAbWF0Y2ggbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgnbWF0Y2gnLCAxLCBmdW5jdGlvbihkZWZpbmVkLCBNQVRDSCwgJG1hdGNoKXtcbiAgLy8gMjEuMS4zLjExIFN0cmluZy5wcm90b3R5cGUubWF0Y2gocmVnZXhwKVxuICByZXR1cm4gW2Z1bmN0aW9uIG1hdGNoKHJlZ2V4cCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPICA9IGRlZmluZWQodGhpcylcbiAgICAgICwgZm4gPSByZWdleHAgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcmVnZXhwW01BVENIXTtcbiAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZCA/IGZuLmNhbGwocmVnZXhwLCBPKSA6IG5ldyBSZWdFeHAocmVnZXhwKVtNQVRDSF0oU3RyaW5nKE8pKTtcbiAgfSwgJG1hdGNoXTtcbn0pOyIsIi8vIEBAcmVwbGFjZSBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdyZXBsYWNlJywgMiwgZnVuY3Rpb24oZGVmaW5lZCwgUkVQTEFDRSwgJHJlcGxhY2Upe1xuICAvLyAyMS4xLjMuMTQgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlKHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpXG4gIHJldHVybiBbZnVuY3Rpb24gcmVwbGFjZShzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIE8gID0gZGVmaW5lZCh0aGlzKVxuICAgICAgLCBmbiA9IHNlYXJjaFZhbHVlID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNlYXJjaFZhbHVlW1JFUExBQ0VdO1xuICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkXG4gICAgICA/IGZuLmNhbGwoc2VhcmNoVmFsdWUsIE8sIHJlcGxhY2VWYWx1ZSlcbiAgICAgIDogJHJlcGxhY2UuY2FsbChTdHJpbmcoTyksIHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpO1xuICB9LCAkcmVwbGFjZV07XG59KTsiLCIvLyBAQHNlYXJjaCBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdzZWFyY2gnLCAxLCBmdW5jdGlvbihkZWZpbmVkLCBTRUFSQ0gsICRzZWFyY2gpe1xuICAvLyAyMS4xLjMuMTUgU3RyaW5nLnByb3RvdHlwZS5zZWFyY2gocmVnZXhwKVxuICByZXR1cm4gW2Z1bmN0aW9uIHNlYXJjaChyZWdleHApe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyAgPSBkZWZpbmVkKHRoaXMpXG4gICAgICAsIGZuID0gcmVnZXhwID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlZ2V4cFtTRUFSQ0hdO1xuICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkID8gZm4uY2FsbChyZWdleHAsIE8pIDogbmV3IFJlZ0V4cChyZWdleHApW1NFQVJDSF0oU3RyaW5nKE8pKTtcbiAgfSwgJHNlYXJjaF07XG59KTsiLCIvLyBAQHNwbGl0IGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ3NwbGl0JywgMiwgZnVuY3Rpb24oZGVmaW5lZCwgU1BMSVQsICRzcGxpdCl7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIGlzUmVnRXhwICAgPSByZXF1aXJlKCcuL19pcy1yZWdleHAnKVxuICAgICwgX3NwbGl0ICAgICA9ICRzcGxpdFxuICAgICwgJHB1c2ggICAgICA9IFtdLnB1c2hcbiAgICAsICRTUExJVCAgICAgPSAnc3BsaXQnXG4gICAgLCBMRU5HVEggICAgID0gJ2xlbmd0aCdcbiAgICAsIExBU1RfSU5ERVggPSAnbGFzdEluZGV4JztcbiAgaWYoXG4gICAgJ2FiYmMnWyRTUExJVF0oLyhiKSovKVsxXSA9PSAnYycgfHxcbiAgICAndGVzdCdbJFNQTElUXSgvKD86KS8sIC0xKVtMRU5HVEhdICE9IDQgfHxcbiAgICAnYWInWyRTUExJVF0oLyg/OmFiKSovKVtMRU5HVEhdICE9IDIgfHxcbiAgICAnLidbJFNQTElUXSgvKC4/KSguPykvKVtMRU5HVEhdICE9IDQgfHxcbiAgICAnLidbJFNQTElUXSgvKCkoKS8pW0xFTkdUSF0gPiAxIHx8XG4gICAgJydbJFNQTElUXSgvLj8vKVtMRU5HVEhdXG4gICl7XG4gICAgdmFyIE5QQ0cgPSAvKCk/Py8uZXhlYygnJylbMV0gPT09IHVuZGVmaW5lZDsgLy8gbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXBcbiAgICAvLyBiYXNlZCBvbiBlczUtc2hpbSBpbXBsZW1lbnRhdGlvbiwgbmVlZCB0byByZXdvcmsgaXRcbiAgICAkc3BsaXQgPSBmdW5jdGlvbihzZXBhcmF0b3IsIGxpbWl0KXtcbiAgICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgICBpZihzZXBhcmF0b3IgPT09IHVuZGVmaW5lZCAmJiBsaW1pdCA9PT0gMClyZXR1cm4gW107XG4gICAgICAvLyBJZiBgc2VwYXJhdG9yYCBpcyBub3QgYSByZWdleCwgdXNlIG5hdGl2ZSBzcGxpdFxuICAgICAgaWYoIWlzUmVnRXhwKHNlcGFyYXRvcikpcmV0dXJuIF9zcGxpdC5jYWxsKHN0cmluZywgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICB2YXIgZmxhZ3MgPSAoc2VwYXJhdG9yLmlnbm9yZUNhc2UgPyAnaScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5tdWx0aWxpbmUgPyAnbScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci51bmljb2RlID8gJ3UnIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3Iuc3RpY2t5ID8gJ3knIDogJycpO1xuICAgICAgdmFyIGxhc3RMYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIHNwbGl0TGltaXQgPSBsaW1pdCA9PT0gdW5kZWZpbmVkID8gNDI5NDk2NzI5NSA6IGxpbWl0ID4+PiAwO1xuICAgICAgLy8gTWFrZSBgZ2xvYmFsYCBhbmQgYXZvaWQgYGxhc3RJbmRleGAgaXNzdWVzIGJ5IHdvcmtpbmcgd2l0aCBhIGNvcHlcbiAgICAgIHZhciBzZXBhcmF0b3JDb3B5ID0gbmV3IFJlZ0V4cChzZXBhcmF0b3Iuc291cmNlLCBmbGFncyArICdnJyk7XG4gICAgICB2YXIgc2VwYXJhdG9yMiwgbWF0Y2gsIGxhc3RJbmRleCwgbGFzdExlbmd0aCwgaTtcbiAgICAgIC8vIERvZXNuJ3QgbmVlZCBmbGFncyBneSwgYnV0IHRoZXkgZG9uJ3QgaHVydFxuICAgICAgaWYoIU5QQ0cpc2VwYXJhdG9yMiA9IG5ldyBSZWdFeHAoJ14nICsgc2VwYXJhdG9yQ29weS5zb3VyY2UgKyAnJCg/IVxcXFxzKScsIGZsYWdzKTtcbiAgICAgIHdoaWxlKG1hdGNoID0gc2VwYXJhdG9yQ29weS5leGVjKHN0cmluZykpe1xuICAgICAgICAvLyBgc2VwYXJhdG9yQ29weS5sYXN0SW5kZXhgIGlzIG5vdCByZWxpYWJsZSBjcm9zcy1icm93c2VyXG4gICAgICAgIGxhc3RJbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF1bTEVOR1RIXTtcbiAgICAgICAgaWYobGFzdEluZGV4ID4gbGFzdExhc3RJbmRleCl7XG4gICAgICAgICAgb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgsIG1hdGNoLmluZGV4KSk7XG4gICAgICAgICAgLy8gRml4IGJyb3dzZXJzIHdob3NlIGBleGVjYCBtZXRob2RzIGRvbid0IGNvbnNpc3RlbnRseSByZXR1cm4gYHVuZGVmaW5lZGAgZm9yIE5QQ0dcbiAgICAgICAgICBpZighTlBDRyAmJiBtYXRjaFtMRU5HVEhdID4gMSltYXRjaFswXS5yZXBsYWNlKHNlcGFyYXRvcjIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBmb3IoaSA9IDE7IGkgPCBhcmd1bWVudHNbTEVOR1RIXSAtIDI7IGkrKylpZihhcmd1bWVudHNbaV0gPT09IHVuZGVmaW5lZCltYXRjaFtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZihtYXRjaFtMRU5HVEhdID4gMSAmJiBtYXRjaC5pbmRleCA8IHN0cmluZ1tMRU5HVEhdKSRwdXNoLmFwcGx5KG91dHB1dCwgbWF0Y2guc2xpY2UoMSkpO1xuICAgICAgICAgIGxhc3RMZW5ndGggPSBtYXRjaFswXVtMRU5HVEhdO1xuICAgICAgICAgIGxhc3RMYXN0SW5kZXggPSBsYXN0SW5kZXg7XG4gICAgICAgICAgaWYob3V0cHV0W0xFTkdUSF0gPj0gc3BsaXRMaW1pdClicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZihzZXBhcmF0b3JDb3B5W0xBU1RfSU5ERVhdID09PSBtYXRjaC5pbmRleClzZXBhcmF0b3JDb3B5W0xBU1RfSU5ERVhdKys7IC8vIEF2b2lkIGFuIGluZmluaXRlIGxvb3BcbiAgICAgIH1cbiAgICAgIGlmKGxhc3RMYXN0SW5kZXggPT09IHN0cmluZ1tMRU5HVEhdKXtcbiAgICAgICAgaWYobGFzdExlbmd0aCB8fCAhc2VwYXJhdG9yQ29weS50ZXN0KCcnKSlvdXRwdXQucHVzaCgnJyk7XG4gICAgICB9IGVsc2Ugb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgIHJldHVybiBvdXRwdXRbTEVOR1RIXSA+IHNwbGl0TGltaXQgPyBvdXRwdXQuc2xpY2UoMCwgc3BsaXRMaW1pdCkgOiBvdXRwdXQ7XG4gICAgfTtcbiAgLy8gQ2hha3JhLCBWOFxuICB9IGVsc2UgaWYoJzAnWyRTUExJVF0odW5kZWZpbmVkLCAwKVtMRU5HVEhdKXtcbiAgICAkc3BsaXQgPSBmdW5jdGlvbihzZXBhcmF0b3IsIGxpbWl0KXtcbiAgICAgIHJldHVybiBzZXBhcmF0b3IgPT09IHVuZGVmaW5lZCAmJiBsaW1pdCA9PT0gMCA/IFtdIDogX3NwbGl0LmNhbGwodGhpcywgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgfTtcbiAgfVxuICAvLyAyMS4xLjMuMTcgU3RyaW5nLnByb3RvdHlwZS5zcGxpdChzZXBhcmF0b3IsIGxpbWl0KVxuICByZXR1cm4gW2Z1bmN0aW9uIHNwbGl0KHNlcGFyYXRvciwgbGltaXQpe1xuICAgIHZhciBPICA9IGRlZmluZWQodGhpcylcbiAgICAgICwgZm4gPSBzZXBhcmF0b3IgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc2VwYXJhdG9yW1NQTElUXTtcbiAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZCA/IGZuLmNhbGwoc2VwYXJhdG9yLCBPLCBsaW1pdCkgOiAkc3BsaXQuY2FsbChTdHJpbmcoTyksIHNlcGFyYXRvciwgbGltaXQpO1xuICB9LCAkc3BsaXRdO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgJGF0ICAgICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKGZhbHNlKTtcbiRleHBvcnQoJGV4cG9ydC5QLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuMyBTdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KHBvcylcbiAgY29kZVBvaW50QXQ6IGZ1bmN0aW9uIGNvZGVQb2ludEF0KHBvcyl7XG4gICAgcmV0dXJuICRhdCh0aGlzLCBwb3MpO1xuICB9XG59KTsiLCIvLyAyMS4xLjMuNiBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKHNlYXJjaFN0cmluZyBbLCBlbmRQb3NpdGlvbl0pXG4ndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGNvbnRleHQgICA9IHJlcXVpcmUoJy4vX3N0cmluZy1jb250ZXh0JylcbiAgLCBFTkRTX1dJVEggPSAnZW5kc1dpdGgnXG4gICwgJGVuZHNXaXRoID0gJydbRU5EU19XSVRIXTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscy1pcy1yZWdleHAnKShFTkRTX1dJVEgpLCAnU3RyaW5nJywge1xuICBlbmRzV2l0aDogZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoU3RyaW5nIC8qLCBlbmRQb3NpdGlvbiA9IEBsZW5ndGggKi8pe1xuICAgIHZhciB0aGF0ID0gY29udGV4dCh0aGlzLCBzZWFyY2hTdHJpbmcsIEVORFNfV0lUSClcbiAgICAgICwgZW5kUG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZFxuICAgICAgLCBsZW4gICAgPSB0b0xlbmd0aCh0aGF0Lmxlbmd0aClcbiAgICAgICwgZW5kICAgID0gZW5kUG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IGxlbiA6IE1hdGgubWluKHRvTGVuZ3RoKGVuZFBvc2l0aW9uKSwgbGVuKVxuICAgICAgLCBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoU3RyaW5nKTtcbiAgICByZXR1cm4gJGVuZHNXaXRoXG4gICAgICA/ICRlbmRzV2l0aC5jYWxsKHRoYXQsIHNlYXJjaCwgZW5kKVxuICAgICAgOiB0aGF0LnNsaWNlKGVuZCAtIHNlYXJjaC5sZW5ndGgsIGVuZCkgPT09IHNlYXJjaDtcbiAgfVxufSk7IiwidmFyICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCB0b0luZGV4ICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4JylcbiAgLCBmcm9tQ2hhckNvZGUgICA9IFN0cmluZy5mcm9tQ2hhckNvZGVcbiAgLCAkZnJvbUNvZGVQb2ludCA9IFN0cmluZy5mcm9tQ29kZVBvaW50O1xuXG4vLyBsZW5ndGggc2hvdWxkIGJlIDEsIG9sZCBGRiBwcm9ibGVtXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghISRmcm9tQ29kZVBvaW50ICYmICRmcm9tQ29kZVBvaW50Lmxlbmd0aCAhPSAxKSwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4yLjIgU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cylcbiAgZnJvbUNvZGVQb2ludDogZnVuY3Rpb24gZnJvbUNvZGVQb2ludCh4KXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHZhciByZXMgID0gW11cbiAgICAgICwgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgaSAgICA9IDBcbiAgICAgICwgY29kZTtcbiAgICB3aGlsZShhTGVuID4gaSl7XG4gICAgICBjb2RlID0gK2FyZ3VtZW50c1tpKytdO1xuICAgICAgaWYodG9JbmRleChjb2RlLCAweDEwZmZmZikgIT09IGNvZGUpdGhyb3cgUmFuZ2VFcnJvcihjb2RlICsgJyBpcyBub3QgYSB2YWxpZCBjb2RlIHBvaW50Jyk7XG4gICAgICByZXMucHVzaChjb2RlIDwgMHgxMDAwMFxuICAgICAgICA/IGZyb21DaGFyQ29kZShjb2RlKVxuICAgICAgICA6IGZyb21DaGFyQ29kZSgoKGNvZGUgLT0gMHgxMDAwMCkgPj4gMTApICsgMHhkODAwLCBjb2RlICUgMHg0MDAgKyAweGRjMDApXG4gICAgICApO1xuICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcbiAgfVxufSk7IiwiLy8gMjEuMS4zLjcgU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyhzZWFyY2hTdHJpbmcsIHBvc2l0aW9uID0gMClcbid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgY29udGV4dCAgPSByZXF1aXJlKCcuL19zdHJpbmctY29udGV4dCcpXG4gICwgSU5DTFVERVMgPSAnaW5jbHVkZXMnO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzLWlzLXJlZ2V4cCcpKElOQ0xVREVTKSwgJ1N0cmluZycsIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcbiAgICByZXR1cm4gISF+Y29udGV4dCh0aGlzLCBzZWFyY2hTdHJpbmcsIElOQ0xVREVTKVxuICAgICAgLmluZGV4T2Yoc2VhcmNoU3RyaW5nLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pOyIsInZhciAkZXhwb3J0ICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4yLjQgU3RyaW5nLnJhdyhjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucylcbiAgcmF3OiBmdW5jdGlvbiByYXcoY2FsbFNpdGUpe1xuICAgIHZhciB0cGwgID0gdG9JT2JqZWN0KGNhbGxTaXRlLnJhdylcbiAgICAgICwgbGVuICA9IHRvTGVuZ3RoKHRwbC5sZW5ndGgpXG4gICAgICAsIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIHJlcyAgPSBbXVxuICAgICAgLCBpICAgID0gMDtcbiAgICB3aGlsZShsZW4gPiBpKXtcbiAgICAgIHJlcy5wdXNoKFN0cmluZyh0cGxbaSsrXSkpO1xuICAgICAgaWYoaSA8IGFMZW4pcmVzLnB1c2goU3RyaW5nKGFyZ3VtZW50c1tpXSkpO1xuICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcbiAgfVxufSk7IiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy4xMyBTdHJpbmcucHJvdG90eXBlLnJlcGVhdChjb3VudClcbiAgcmVwZWF0OiByZXF1aXJlKCcuL19zdHJpbmctcmVwZWF0Jylcbn0pOyIsIi8vIDIxLjEuMy4xOCBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIFssIHBvc2l0aW9uIF0pXG4ndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBjb250ZXh0ICAgICA9IHJlcXVpcmUoJy4vX3N0cmluZy1jb250ZXh0JylcbiAgLCBTVEFSVFNfV0lUSCA9ICdzdGFydHNXaXRoJ1xuICAsICRzdGFydHNXaXRoID0gJydbU1RBUlRTX1dJVEhdO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzLWlzLXJlZ2V4cCcpKFNUQVJUU19XSVRIKSwgJ1N0cmluZycsIHtcbiAgc3RhcnRzV2l0aDogZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XG4gICAgdmFyIHRoYXQgICA9IGNvbnRleHQodGhpcywgc2VhcmNoU3RyaW5nLCBTVEFSVFNfV0lUSClcbiAgICAgICwgaW5kZXggID0gdG9MZW5ndGgoTWF0aC5taW4oYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIHRoYXQubGVuZ3RoKSlcbiAgICAgICwgc2VhcmNoID0gU3RyaW5nKHNlYXJjaFN0cmluZyk7XG4gICAgcmV0dXJuICRzdGFydHNXaXRoXG4gICAgICA/ICRzdGFydHNXaXRoLmNhbGwodGhhdCwgc2VhcmNoLCBpbmRleClcbiAgICAgIDogdGhhdC5zbGljZShpbmRleCwgaW5kZXggKyBzZWFyY2gubGVuZ3RoKSA9PT0gc2VhcmNoO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgTUVUQSAgICAgICAgICAgPSByZXF1aXJlKCcuL19tZXRhJykuS0VZXG4gICwgJGZhaWxzICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgc2hhcmVkICAgICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIHVpZCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCB3a3MgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCB3a3NEZWZpbmUgICAgICA9IHJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKVxuICAsIGtleU9mICAgICAgICAgID0gcmVxdWlyZSgnLi9fa2V5b2YnKVxuICAsIGVudW1LZXlzICAgICAgID0gcmVxdWlyZSgnLi9fZW51bS1rZXlzJylcbiAgLCBpc0FycmF5ICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5JylcbiAgLCBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9JT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgY3JlYXRlRGVzYyAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBfY3JlYXRlICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGdPUE5FeHQgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4tZXh0JylcbiAgLCAkR09QRCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJylcbiAgLCAkRFAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgJGtleXMgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgZ09QRCAgICAgICAgICAgPSAkR09QRC5mXG4gICwgZFAgICAgICAgICAgICAgPSAkRFAuZlxuICAsIGdPUE4gICAgICAgICAgID0gZ09QTkV4dC5mXG4gICwgJFN5bWJvbCAgICAgICAgPSBnbG9iYWwuU3ltYm9sXG4gICwgJEpTT04gICAgICAgICAgPSBnbG9iYWwuSlNPTlxuICAsIF9zdHJpbmdpZnkgICAgID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5XG4gICwgUFJPVE9UWVBFICAgICAgPSAncHJvdG90eXBlJ1xuICAsIEhJRERFTiAgICAgICAgID0gd2tzKCdfaGlkZGVuJylcbiAgLCBUT19QUklNSVRJVkUgICA9IHdrcygndG9QcmltaXRpdmUnKVxuICAsIGlzRW51bSAgICAgICAgID0ge30ucHJvcGVydHlJc0VudW1lcmFibGVcbiAgLCBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5JylcbiAgLCBBbGxTeW1ib2xzICAgICA9IHNoYXJlZCgnc3ltYm9scycpXG4gICwgT1BTeW1ib2xzICAgICAgPSBzaGFyZWQoJ29wLXN5bWJvbHMnKVxuICAsIE9iamVjdFByb3RvICAgID0gT2JqZWN0W1BST1RPVFlQRV1cbiAgLCBVU0VfTkFUSVZFICAgICA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbidcbiAgLCBRT2JqZWN0ICAgICAgICA9IGdsb2JhbC5RT2JqZWN0O1xuLy8gRG9uJ3QgdXNlIHNldHRlcnMgaW4gUXQgU2NyaXB0LCBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTczXG52YXIgc2V0dGVyID0gIVFPYmplY3QgfHwgIVFPYmplY3RbUFJPVE9UWVBFXSB8fCAhUU9iamVjdFtQUk9UT1RZUEVdLmZpbmRDaGlsZDtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0NSSVBUT1JTICYmICRmYWlscyhmdW5jdGlvbigpe1xuICByZXR1cm4gX2NyZWF0ZShkUCh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gZFAodGhpcywgJ2EnLCB7dmFsdWU6IDd9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uKGl0LCBrZXksIEQpe1xuICB2YXIgcHJvdG9EZXNjID0gZ09QRChPYmplY3RQcm90bywga2V5KTtcbiAgaWYocHJvdG9EZXNjKWRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBkUChpdCwga2V5LCBEKTtcbiAgaWYocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bylkUChPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xufSA6IGRQO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uKHRhZyl7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2xbUFJPVE9UWVBFXSk7XG4gIHN5bS5fayA9IHRhZztcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IFVTRV9OQVRJVkUgJiYgdHlwZW9mICRTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcgPyBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpe1xuICBpZihpdCA9PT0gT2JqZWN0UHJvdG8pJGRlZmluZVByb3BlcnR5KE9QU3ltYm9scywga2V5LCBEKTtcbiAgYW5PYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBhbk9iamVjdChEKTtcbiAgaWYoaGFzKEFsbFN5bWJvbHMsIGtleSkpe1xuICAgIGlmKCFELmVudW1lcmFibGUpe1xuICAgICAgaWYoIWhhcyhpdCwgSElEREVOKSlkUChpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKWl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwge2VudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gZFAoaXQsIGtleSwgRCk7XG59O1xudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKVxuICAgICwgaSAgICA9IDBcbiAgICAsIGwgPSBrZXlzLmxlbmd0aFxuICAgICwga2V5O1xuICB3aGlsZShsID4gaSkkZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGl0LCBQKXtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpe1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpO1xuICBpZih0aGlzID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSlyZXR1cm4gZmFsc2U7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV0gPyBFIDogdHJ1ZTtcbn07XG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgaXQgID0gdG9JT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgaWYoaXQgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKXJldHVybjtcbiAgdmFyIEQgPSBnT1BEKGl0LCBrZXkpO1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnT1BOKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKXtcbiAgICBpZighaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4gJiYga2V5ICE9IE1FVEEpcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIElTX09QICA9IGl0ID09PSBPYmplY3RQcm90b1xuICAgICwgbmFtZXMgID0gZ09QTihJU19PUCA/IE9QU3ltYm9scyA6IHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKXtcbiAgICBpZihoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYgKElTX09QID8gaGFzKE9iamVjdFByb3RvLCBrZXkpIDogdHJ1ZSkpcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXG5pZighVVNFX05BVElWRSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZih0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvciEnKTtcbiAgICB2YXIgdGFnID0gdWlkKGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTtcbiAgICB2YXIgJHNldCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGlmKHRoaXMgPT09IE9iamVjdFByb3RvKSRzZXQuY2FsbChPUFN5bWJvbHMsIHZhbHVlKTtcbiAgICAgIGlmKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZihERVNDUklQVE9SUyAmJiBzZXR0ZXIpc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7Y29uZmlndXJhYmxlOiB0cnVlLCBzZXQ6ICRzZXR9KTtcbiAgICByZXR1cm4gd3JhcCh0YWcpO1xuICB9O1xuICByZWRlZmluZSgkU3ltYm9sW1BST1RPVFlQRV0sICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gICRHT1BELmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkRFAuZiAgID0gJGRlZmluZVByb3BlcnR5O1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmYgPSBnT1BORXh0LmYgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpLmYgID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpLmYgPSAkZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmKERFU0NSSVBUT1JTICYmICFyZXF1aXJlKCcuL19saWJyYXJ5Jykpe1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG5cbiAgd2tzRXh0LmYgPSBmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4gd3JhcCh3a3MobmFtZSkpO1xuICB9XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtTeW1ib2w6ICRTeW1ib2x9KTtcblxuZm9yKHZhciBzeW1ib2xzID0gKFxuICAvLyAxOS40LjIuMiwgMTkuNC4yLjMsIDE5LjQuMi40LCAxOS40LjIuNiwgMTkuNC4yLjgsIDE5LjQuMi45LCAxOS40LjIuMTAsIDE5LjQuMi4xMSwgMTkuNC4yLjEyLCAxOS40LjIuMTMsIDE5LjQuMi4xNFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGkgPSAwOyBzeW1ib2xzLmxlbmd0aCA+IGk7ICl3a3Moc3ltYm9sc1tpKytdKTtcblxuZm9yKHZhciBzeW1ib2xzID0gJGtleXMod2tzLnN0b3JlKSwgaSA9IDA7IHN5bWJvbHMubGVuZ3RoID4gaTsgKXdrc0RlZmluZShzeW1ib2xzW2krK10pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnU3ltYm9sJywge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xuICAgIGlmKGlzU3ltYm9sKGtleSkpcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xuICAgIHRocm93IFR5cGVFcnJvcihrZXkgKyAnIGlzIG5vdCBhIHN5bWJvbCEnKTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7IHNldHRlciA9IGZhbHNlOyB9XG59KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICRjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogJGRlZmluZVByb3BlcnR5LFxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiAkZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHZhciBTID0gJFN5bWJvbCgpO1xuICAvLyBNUyBFZGdlIGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyB7fVxuICAvLyBXZWJLaXQgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIG51bGxcbiAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgcmV0dXJuIF9zdHJpbmdpZnkoW1NdKSAhPSAnW251bGxdJyB8fCBfc3RyaW5naWZ5KHthOiBTfSkgIT0gJ3t9JyB8fCBfc3RyaW5naWZ5KE9iamVjdChTKSkgIT0gJ3t9Jztcbn0pKSwgJ0pTT04nLCB7XG4gIHN0cmluZ2lmeTogZnVuY3Rpb24gc3RyaW5naWZ5KGl0KXtcbiAgICBpZihpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSlyZXR1cm47IC8vIElFOCByZXR1cm5zIHN0cmluZyBvbiB1bmRlZmluZWRcbiAgICB2YXIgYXJncyA9IFtpdF1cbiAgICAgICwgaSAgICA9IDFcbiAgICAgICwgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZih0eXBlb2YgcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykkcmVwbGFjZXIgPSByZXBsYWNlcjtcbiAgICBpZigkcmVwbGFjZXIgfHwgIWlzQXJyYXkocmVwbGFjZXIpKXJlcGxhY2VyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgICBpZigkcmVwbGFjZXIpdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgIGlmKCFpc1N5bWJvbCh2YWx1ZSkpcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gICAgYXJnc1sxXSA9IHJlcGxhY2VyO1xuICAgIHJldHVybiBfc3RyaW5naWZ5LmFwcGx5KCRKU09OLCBhcmdzKTtcbiAgfVxufSk7XG5cbi8vIDE5LjQuMy40IFN5bWJvbC5wcm90b3R5cGVbQEB0b1ByaW1pdGl2ZV0oaGludClcbiRTeW1ib2xbUFJPVE9UWVBFXVtUT19QUklNSVRJVkVdIHx8IHJlcXVpcmUoJy4vX2hpZGUnKSgkU3ltYm9sW1BST1RPVFlQRV0sIFRPX1BSSU1JVElWRSwgJFN5bWJvbFtQUk9UT1RZUEVdLnZhbHVlT2YpO1xuLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoJFN5bWJvbCwgJ1N5bWJvbCcpO1xuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhnbG9iYWwuSlNPTiwgJ0pTT04nLCB0cnVlKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkdHlwZWQgICAgICAgPSByZXF1aXJlKCcuL190eXBlZCcpXG4gICwgYnVmZmVyICAgICAgID0gcmVxdWlyZSgnLi9fdHlwZWQtYnVmZmVyJylcbiAgLCBhbk9iamVjdCAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvSW5kZXggICAgICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4JylcbiAgLCB0b0xlbmd0aCAgICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGlzT2JqZWN0ICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgQXJyYXlCdWZmZXIgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuQXJyYXlCdWZmZXJcbiAgLCBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgLCAkQXJyYXlCdWZmZXIgPSBidWZmZXIuQXJyYXlCdWZmZXJcbiAgLCAkRGF0YVZpZXcgICAgPSBidWZmZXIuRGF0YVZpZXdcbiAgLCAkaXNWaWV3ICAgICAgPSAkdHlwZWQuQUJWICYmIEFycmF5QnVmZmVyLmlzVmlld1xuICAsICRzbGljZSAgICAgICA9ICRBcnJheUJ1ZmZlci5wcm90b3R5cGUuc2xpY2VcbiAgLCBWSUVXICAgICAgICAgPSAkdHlwZWQuVklFV1xuICAsIEFSUkFZX0JVRkZFUiA9ICdBcnJheUJ1ZmZlcic7XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogKEFycmF5QnVmZmVyICE9PSAkQXJyYXlCdWZmZXIpLCB7QXJyYXlCdWZmZXI6ICRBcnJheUJ1ZmZlcn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEkdHlwZWQuQ09OU1RSLCBBUlJBWV9CVUZGRVIsIHtcbiAgLy8gMjQuMS4zLjEgQXJyYXlCdWZmZXIuaXNWaWV3KGFyZylcbiAgaXNWaWV3OiBmdW5jdGlvbiBpc1ZpZXcoaXQpe1xuICAgIHJldHVybiAkaXNWaWV3ICYmICRpc1ZpZXcoaXQpIHx8IGlzT2JqZWN0KGl0KSAmJiBWSUVXIGluIGl0O1xuICB9XG59KTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LlUgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiAhbmV3ICRBcnJheUJ1ZmZlcigyKS5zbGljZSgxLCB1bmRlZmluZWQpLmJ5dGVMZW5ndGg7XG59KSwgQVJSQVlfQlVGRkVSLCB7XG4gIC8vIDI0LjEuNC4zIEFycmF5QnVmZmVyLnByb3RvdHlwZS5zbGljZShzdGFydCwgZW5kKVxuICBzbGljZTogZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCl7XG4gICAgaWYoJHNsaWNlICE9PSB1bmRlZmluZWQgJiYgZW5kID09PSB1bmRlZmluZWQpcmV0dXJuICRzbGljZS5jYWxsKGFuT2JqZWN0KHRoaXMpLCBzdGFydCk7IC8vIEZGIGZpeFxuICAgIHZhciBsZW4gICAgPSBhbk9iamVjdCh0aGlzKS5ieXRlTGVuZ3RoXG4gICAgICAsIGZpcnN0ICA9IHRvSW5kZXgoc3RhcnQsIGxlbilcbiAgICAgICwgZmluYWwgID0gdG9JbmRleChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IGVuZCwgbGVuKVxuICAgICAgLCByZXN1bHQgPSBuZXcgKHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkQXJyYXlCdWZmZXIpKSh0b0xlbmd0aChmaW5hbCAtIGZpcnN0KSlcbiAgICAgICwgdmlld1MgID0gbmV3ICREYXRhVmlldyh0aGlzKVxuICAgICAgLCB2aWV3VCAgPSBuZXcgJERhdGFWaWV3KHJlc3VsdClcbiAgICAgICwgaW5kZXggID0gMDtcbiAgICB3aGlsZShmaXJzdCA8IGZpbmFsKXtcbiAgICAgIHZpZXdULnNldFVpbnQ4KGluZGV4KyssIHZpZXdTLmdldFVpbnQ4KGZpcnN0KyspKTtcbiAgICB9IHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuXG5yZXF1aXJlKCcuL19zZXQtc3BlY2llcycpKEFSUkFZX0JVRkZFUik7IiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnRmxvYXQzMicsIDQsIGZ1bmN0aW9uKGluaXQpe1xuICByZXR1cm4gZnVuY3Rpb24gRmxvYXQzMkFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCl7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pOyIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ0Zsb2F0NjQnLCA4LCBmdW5jdGlvbihpbml0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIEZsb2F0NjRBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpe1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdJbnQxNicsIDIsIGZ1bmN0aW9uKGluaXQpe1xuICByZXR1cm4gZnVuY3Rpb24gSW50MTZBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpe1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdJbnQzMicsIDQsIGZ1bmN0aW9uKGluaXQpe1xuICByZXR1cm4gZnVuY3Rpb24gSW50MzJBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpe1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdJbnQ4JywgMSwgZnVuY3Rpb24oaW5pdCl7XG4gIHJldHVybiBmdW5jdGlvbiBJbnQ4QXJyYXkoZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKXtcbiAgICByZXR1cm4gaW5pdCh0aGlzLCBkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9O1xufSk7IiwicmVxdWlyZSgnLi9fdHlwZWQtYXJyYXknKSgnVWludDE2JywgMiwgZnVuY3Rpb24oaW5pdCl7XG4gIHJldHVybiBmdW5jdGlvbiBVaW50MTZBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpe1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuL190eXBlZC1hcnJheScpKCdVaW50MzInLCA0LCBmdW5jdGlvbihpbml0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFVpbnQzMkFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCl7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pOyIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ1VpbnQ4JywgMSwgZnVuY3Rpb24oaW5pdCl7XG4gIHJldHVybiBmdW5jdGlvbiBVaW50OEFycmF5KGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCl7XG4gICAgcmV0dXJuIGluaXQodGhpcywgZGF0YSwgYnl0ZU9mZnNldCwgbGVuZ3RoKTtcbiAgfTtcbn0pOyIsInJlcXVpcmUoJy4vX3R5cGVkLWFycmF5JykoJ1VpbnQ4JywgMSwgZnVuY3Rpb24oaW5pdCl7XG4gIHJldHVybiBmdW5jdGlvbiBVaW50OENsYW1wZWRBcnJheShkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpe1xuICAgIHJldHVybiBpbml0KHRoaXMsIGRhdGEsIGJ5dGVPZmZzZXQsIGxlbmd0aCk7XG4gIH07XG59LCB0cnVlKTsiLCIndXNlIHN0cmljdCc7XG52YXIgZWFjaCAgICAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDApXG4gICwgcmVkZWZpbmUgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIG1ldGEgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKVxuICAsIGFzc2lnbiAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKVxuICAsIHdlYWsgICAgICAgICA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24td2VhaycpXG4gICwgaXNPYmplY3QgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBnZXRXZWFrICAgICAgPSBtZXRhLmdldFdlYWtcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlXG4gICwgdW5jYXVnaHRGcm96ZW5TdG9yZSA9IHdlYWsudWZzdG9yZVxuICAsIHRtcCAgICAgICAgICA9IHt9XG4gICwgSW50ZXJuYWxNYXA7XG5cbnZhciB3cmFwcGVyID0gZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFdlYWtNYXAoKXtcbiAgICByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTtcbiAgfTtcbn07XG5cbnZhciBtZXRob2RzID0ge1xuICAvLyAyMy4zLjMuMyBXZWFrTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIGlmKGlzT2JqZWN0KGtleSkpe1xuICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrKGtleSk7XG4gICAgICBpZihkYXRhID09PSB0cnVlKXJldHVybiB1bmNhdWdodEZyb3plblN0b3JlKHRoaXMpLmdldChrZXkpO1xuICAgICAgcmV0dXJuIGRhdGEgPyBkYXRhW3RoaXMuX2ldIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgfSxcbiAgLy8gMjMuMy4zLjUgV2Vha01hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xuICAgIHJldHVybiB3ZWFrLmRlZih0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxufTtcblxuLy8gMjMuMyBXZWFrTWFwIE9iamVjdHNcbnZhciAkV2Vha01hcCA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdXZWFrTWFwJywgd3JhcHBlciwgbWV0aG9kcywgd2VhaywgdHJ1ZSwgdHJ1ZSk7XG5cbi8vIElFMTEgV2Vha01hcCBmcm96ZW4ga2V5cyBmaXhcbmlmKG5ldyAkV2Vha01hcCgpLnNldCgoT2JqZWN0LmZyZWV6ZSB8fCBPYmplY3QpKHRtcCksIDcpLmdldCh0bXApICE9IDcpe1xuICBJbnRlcm5hbE1hcCA9IHdlYWsuZ2V0Q29uc3RydWN0b3Iod3JhcHBlcik7XG4gIGFzc2lnbihJbnRlcm5hbE1hcC5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICBtZXRhLk5FRUQgPSB0cnVlO1xuICBlYWNoKFsnZGVsZXRlJywgJ2hhcycsICdnZXQnLCAnc2V0J10sIGZ1bmN0aW9uKGtleSl7XG4gICAgdmFyIHByb3RvICA9ICRXZWFrTWFwLnByb3RvdHlwZVxuICAgICAgLCBtZXRob2QgPSBwcm90b1trZXldO1xuICAgIHJlZGVmaW5lKHByb3RvLCBrZXksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgLy8gc3RvcmUgZnJvemVuIG9iamVjdHMgb24gaW50ZXJuYWwgd2Vha21hcCBzaGltXG4gICAgICBpZihpc09iamVjdChhKSAmJiAhaXNFeHRlbnNpYmxlKGEpKXtcbiAgICAgICAgaWYoIXRoaXMuX2YpdGhpcy5fZiA9IG5ldyBJbnRlcm5hbE1hcDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2Zba2V5XShhLCBiKTtcbiAgICAgICAgcmV0dXJuIGtleSA9PSAnc2V0JyA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICAvLyBzdG9yZSBhbGwgdGhlIHJlc3Qgb24gbmF0aXZlIHdlYWttYXBcbiAgICAgIH0gcmV0dXJuIG1ldGhvZC5jYWxsKHRoaXMsIGEsIGIpO1xuICAgIH0pO1xuICB9KTtcbn0iLCIndXNlIHN0cmljdCc7XG52YXIgd2VhayA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24td2VhaycpO1xuXG4vLyAyMy40IFdlYWtTZXQgT2JqZWN0c1xucmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdXZWFrU2V0JywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFdlYWtTZXQoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjQuMy4xIFdlYWtTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xuICAgIHJldHVybiB3ZWFrLmRlZih0aGlzLCB2YWx1ZSwgdHJ1ZSk7XG4gIH1cbn0sIHdlYWssIGZhbHNlLCB0cnVlKTsiLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9BcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcbnZhciAkZXhwb3J0ICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRpbmNsdWRlcyA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykodHJ1ZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7XG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhlbCAvKiwgZnJvbUluZGV4ID0gMCAqLyl7XG4gICAgcmV0dXJuICRpbmNsdWRlcyh0aGlzLCBlbCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcblxucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoJ2luY2x1ZGVzJyk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JqZWN0LXZhbHVlcy1lbnRyaWVzXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRlbnRyaWVzID0gcmVxdWlyZSgnLi9fb2JqZWN0LXRvLWFycmF5JykodHJ1ZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICBlbnRyaWVzOiBmdW5jdGlvbiBlbnRyaWVzKGl0KXtcbiAgICByZXR1cm4gJGVudHJpZXMoaXQpO1xuICB9XG59KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yc1xudmFyICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBvd25LZXlzICAgICAgICA9IHJlcXVpcmUoJy4vX293bi1rZXlzJylcbiAgLCB0b0lPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGdPUEQgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKVxuICAsIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCl7XG4gICAgdmFyIE8gICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICAgLCBnZXREZXNjID0gZ09QRC5mXG4gICAgICAsIGtleXMgICAgPSBvd25LZXlzKE8pXG4gICAgICAsIHJlc3VsdCAgPSB7fVxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoa2V5cy5sZW5ndGggPiBpKWNyZWF0ZVByb3BlcnR5KHJlc3VsdCwga2V5ID0ga2V5c1tpKytdLCBnZXREZXNjKE8sIGtleSkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLW9iamVjdC12YWx1ZXMtZW50cmllc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICR2YWx1ZXMgPSByZXF1aXJlKCcuL19vYmplY3QtdG8tYXJyYXknKShmYWxzZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICB2YWx1ZXM6IGZ1bmN0aW9uIHZhbHVlcyhpdCl7XG4gICAgcmV0dXJuICR2YWx1ZXMoaXQpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1zdHJpbmctcGFkLXN0YXJ0LWVuZFxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICRwYWQgICAgPSByZXF1aXJlKCcuL19zdHJpbmctcGFkJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnU3RyaW5nJywge1xuICBwYWRFbmQ6IGZ1bmN0aW9uIHBhZEVuZChtYXhMZW5ndGggLyosIGZpbGxTdHJpbmcgPSAnICcgKi8pe1xuICAgIHJldHVybiAkcGFkKHRoaXMsIG1heExlbmd0aCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIGZhbHNlKTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtc3RyaW5nLXBhZC1zdGFydC1lbmRcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCAkcGFkICAgID0gcmVxdWlyZSgnLi9fc3RyaW5nLXBhZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ1N0cmluZycsIHtcbiAgcGFkU3RhcnQ6IGZ1bmN0aW9uIHBhZFN0YXJ0KG1heExlbmd0aCAvKiwgZmlsbFN0cmluZyA9ICcgJyAqLyl7XG4gICAgcmV0dXJuICRwYWQodGhpcywgbWF4TGVuZ3RoLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgdHJ1ZSk7XG4gIH1cbn0pOyIsInZhciAkaXRlcmF0b3JzICAgID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKVxuICAsIHJlZGVmaW5lICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHdrcyAgICAgICAgICAgPSByZXF1aXJlKCcuL193a3MnKVxuICAsIElURVJBVE9SICAgICAgPSB3a3MoJ2l0ZXJhdG9yJylcbiAgLCBUT19TVFJJTkdfVEFHID0gd2tzKCd0b1N0cmluZ1RhZycpXG4gICwgQXJyYXlWYWx1ZXMgICA9IEl0ZXJhdG9ycy5BcnJheTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlXG4gICAgLCBrZXk7XG4gIGlmKHByb3RvKXtcbiAgICBpZighcHJvdG9bSVRFUkFUT1JdKWhpZGUocHJvdG8sIElURVJBVE9SLCBBcnJheVZhbHVlcyk7XG4gICAgaWYoIXByb3RvW1RPX1NUUklOR19UQUddKWhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICAgIEl0ZXJhdG9yc1tOQU1FXSA9IEFycmF5VmFsdWVzO1xuICAgIGZvcihrZXkgaW4gJGl0ZXJhdG9ycylpZighcHJvdG9ba2V5XSlyZWRlZmluZShwcm90bywga2V5LCAkaXRlcmF0b3JzW2tleV0sIHRydWUpO1xuICB9XG59IiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsICR0YXNrICAgPSByZXF1aXJlKCcuL190YXNrJyk7XG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuQiwge1xuICBzZXRJbW1lZGlhdGU6ICAgJHRhc2suc2V0LFxuICBjbGVhckltbWVkaWF0ZTogJHRhc2suY2xlYXJcbn0pOyIsIi8vIGllOS0gc2V0VGltZW91dCAmIHNldEludGVydmFsIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmaXhcbnZhciBnbG9iYWwgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCAkZXhwb3J0ICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBpbnZva2UgICAgID0gcmVxdWlyZSgnLi9faW52b2tlJylcbiAgLCBwYXJ0aWFsICAgID0gcmVxdWlyZSgnLi9fcGFydGlhbCcpXG4gICwgbmF2aWdhdG9yICA9IGdsb2JhbC5uYXZpZ2F0b3JcbiAgLCBNU0lFICAgICAgID0gISFuYXZpZ2F0b3IgJiYgL01TSUUgLlxcLi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTsgLy8gPC0gZGlydHkgaWU5LSBjaGVja1xudmFyIHdyYXAgPSBmdW5jdGlvbihzZXQpe1xuICByZXR1cm4gTVNJRSA/IGZ1bmN0aW9uKGZuLCB0aW1lIC8qLCAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gc2V0KGludm9rZShcbiAgICAgIHBhcnRpYWwsXG4gICAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICB0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pXG4gICAgKSwgdGltZSk7XG4gIH0gOiBzZXQ7XG59O1xuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LkIgKyAkZXhwb3J0LkYgKiBNU0lFLCB7XG4gIHNldFRpbWVvdXQ6ICB3cmFwKGdsb2JhbC5zZXRUaW1lb3V0KSxcbiAgc2V0SW50ZXJ2YWw6IHdyYXAoZ2xvYmFsLnNldEludGVydmFsKVxufSk7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuIShmdW5jdGlvbihnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICB2YXIgaW5Nb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiO1xuICB2YXIgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIGlmIChydW50aW1lKSB7XG4gICAgaWYgKGluTW9kdWxlKSB7XG4gICAgICAvLyBJZiByZWdlbmVyYXRvclJ1bnRpbWUgaXMgZGVmaW5lZCBnbG9iYWxseSBhbmQgd2UncmUgaW4gYSBtb2R1bGUsXG4gICAgICAvLyBtYWtlIHRoZSBleHBvcnRzIG9iamVjdCBpZGVudGljYWwgdG8gcmVnZW5lcmF0b3JSdW50aW1lLlxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBydW50aW1lO1xuICAgIH1cbiAgICAvLyBEb24ndCBib3RoZXIgZXZhbHVhdGluZyB0aGUgcmVzdCBvZiB0aGlzIGZpbGUgaWYgdGhlIHJ1bnRpbWUgd2FzXG4gICAgLy8gYWxyZWFkeSBkZWZpbmVkIGdsb2JhbGx5LlxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERlZmluZSB0aGUgcnVudGltZSBnbG9iYWxseSAoYXMgZXhwZWN0ZWQgYnkgZ2VuZXJhdGVkIGNvZGUpIGFzIGVpdGhlclxuICAvLyBtb2R1bGUuZXhwb3J0cyAoaWYgd2UncmUgaW4gYSBtb2R1bGUpIG9yIGEgbmV3LCBlbXB0eSBvYmplY3QuXG4gIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lID0gaW5Nb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA6IHt9O1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIHJ1bnRpbWUuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG4gICAgICAgICAgLy8gcmVzdWx0IGZvciB0aGlzIGl0ZXJhdGlvbiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHNhbWVcbiAgICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2VcbiAgICAgICAgICAvLyB3aGVuIGFuIGF3YWl0ZWQgUHJvbWlzZSBpcyByZWplY3RlZC4gVGhpcyBkaWZmZXJlbmNlIGluXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG4gICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIChzd2FsbG93IGl0IGFuZCBjb250aW51ZSwgbWFudWFsbHkgLnRocm93IGl0IGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcbiAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIHJlYXNvbiBvdXRzaWRlIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIHNvIHRoZVxuICAgICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwucHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBnbG9iYWwucHJvY2Vzcy5kb21haW4pIHtcbiAgICAgIGludm9rZSA9IGdsb2JhbC5wcm9jZXNzLmRvbWFpbi5iaW5kKGludm9rZSk7XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcnVudGltZS5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuICAvLyBBbW9uZyB0aGUgdmFyaW91cyB0cmlja3MgZm9yIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsXG4gIC8vIG9iamVjdCwgdGhpcyBzZWVtcyB0byBiZSB0aGUgbW9zdCByZWxpYWJsZSB0ZWNobmlxdWUgdGhhdCBkb2VzIG5vdFxuICAvLyB1c2UgaW5kaXJlY3QgZXZhbCAod2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kpLlxuICB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDpcbiAgdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiA/IHdpbmRvdyA6XG4gIHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiID8gc2VsZiA6IHRoaXNcbik7XG4iLCIvKiEgVmVsb2NpdHlKUy5vcmcgKDEuNS4wKS4gKEMpIDIwMTQgSnVsaWFuIFNoYXBpcm8uIE1JVCBAbGljZW5zZTogZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlICovXG4vKiEgVmVsb2NpdHlKUy5vcmcgalF1ZXJ5IFNoaW0gKDEuMC4xKS4gKEMpIDIwMTQgVGhlIGpRdWVyeSBGb3VuZGF0aW9uLiBNSVQgQGxpY2Vuc2U6IGVuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZS4gKi9cbiFmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGEpe3ZhciBiPWEubGVuZ3RoLGQ9Yy50eXBlKGEpO3JldHVyblwiZnVuY3Rpb25cIiE9PWQmJiFjLmlzV2luZG93KGEpJiYoISgxIT09YS5ub2RlVHlwZXx8IWIpfHwoXCJhcnJheVwiPT09ZHx8MD09PWJ8fFwibnVtYmVyXCI9PXR5cGVvZiBiJiZiPjAmJmItMSBpbiBhKSl9aWYoIWEualF1ZXJ5KXt2YXIgYz1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgYy5mbi5pbml0KGEsYil9O2MuaXNXaW5kb3c9ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJmE9PT1hLndpbmRvd30sYy50eXBlPWZ1bmN0aW9uKGEpe3JldHVybiBhP1wib2JqZWN0XCI9PXR5cGVvZiBhfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBhP2VbZy5jYWxsKGEpXXx8XCJvYmplY3RcIjp0eXBlb2YgYTphK1wiXCJ9LGMuaXNBcnJheT1BcnJheS5pc0FycmF5fHxmdW5jdGlvbihhKXtyZXR1cm5cImFycmF5XCI9PT1jLnR5cGUoYSl9LGMuaXNQbGFpbk9iamVjdD1mdW5jdGlvbihhKXt2YXIgYjtpZighYXx8XCJvYmplY3RcIiE9PWMudHlwZShhKXx8YS5ub2RlVHlwZXx8Yy5pc1dpbmRvdyhhKSlyZXR1cm4hMTt0cnl7aWYoYS5jb25zdHJ1Y3RvciYmIWYuY2FsbChhLFwiY29uc3RydWN0b3JcIikmJiFmLmNhbGwoYS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsXCJpc1Byb3RvdHlwZU9mXCIpKXJldHVybiExfWNhdGNoKGQpe3JldHVybiExfWZvcihiIGluIGEpO3JldHVybiBiPT09dW5kZWZpbmVkfHxmLmNhbGwoYSxiKX0sYy5lYWNoPWZ1bmN0aW9uKGEsYyxkKXt2YXIgZT0wLGY9YS5sZW5ndGgsZz1iKGEpO2lmKGQpe2lmKGcpZm9yKDtlPGYmJmMuYXBwbHkoYVtlXSxkKSE9PSExO2UrKyk7ZWxzZSBmb3IoZSBpbiBhKWlmKGEuaGFzT3duUHJvcGVydHkoZSkmJmMuYXBwbHkoYVtlXSxkKT09PSExKWJyZWFrfWVsc2UgaWYoZylmb3IoO2U8ZiYmYy5jYWxsKGFbZV0sZSxhW2VdKSE9PSExO2UrKyk7ZWxzZSBmb3IoZSBpbiBhKWlmKGEuaGFzT3duUHJvcGVydHkoZSkmJmMuY2FsbChhW2VdLGUsYVtlXSk9PT0hMSlicmVhaztyZXR1cm4gYX0sYy5kYXRhPWZ1bmN0aW9uKGEsYixlKXtpZihlPT09dW5kZWZpbmVkKXt2YXIgZj1hW2MuZXhwYW5kb10sZz1mJiZkW2ZdO2lmKGI9PT11bmRlZmluZWQpcmV0dXJuIGc7aWYoZyYmYiBpbiBnKXJldHVybiBnW2JdfWVsc2UgaWYoYiE9PXVuZGVmaW5lZCl7dmFyIGg9YVtjLmV4cGFuZG9dfHwoYVtjLmV4cGFuZG9dPSsrYy51dWlkKTtyZXR1cm4gZFtoXT1kW2hdfHx7fSxkW2hdW2JdPWUsZX19LGMucmVtb3ZlRGF0YT1mdW5jdGlvbihhLGIpe3ZhciBlPWFbYy5leHBhbmRvXSxmPWUmJmRbZV07ZiYmKGI/Yy5lYWNoKGIsZnVuY3Rpb24oYSxiKXtkZWxldGUgZltiXX0pOmRlbGV0ZSBkW2VdKX0sYy5leHRlbmQ9ZnVuY3Rpb24oKXt2YXIgYSxiLGQsZSxmLGcsaD1hcmd1bWVudHNbMF18fHt9LGk9MSxqPWFyZ3VtZW50cy5sZW5ndGgsaz0hMTtmb3IoXCJib29sZWFuXCI9PXR5cGVvZiBoJiYoaz1oLGg9YXJndW1lbnRzW2ldfHx7fSxpKyspLFwib2JqZWN0XCIhPXR5cGVvZiBoJiZcImZ1bmN0aW9uXCIhPT1jLnR5cGUoaCkmJihoPXt9KSxpPT09aiYmKGg9dGhpcyxpLS0pO2k8ajtpKyspaWYoZj1hcmd1bWVudHNbaV0pZm9yKGUgaW4gZilmLmhhc093blByb3BlcnR5KGUpJiYoYT1oW2VdLGQ9ZltlXSxoIT09ZCYmKGsmJmQmJihjLmlzUGxhaW5PYmplY3QoZCl8fChiPWMuaXNBcnJheShkKSkpPyhiPyhiPSExLGc9YSYmYy5pc0FycmF5KGEpP2E6W10pOmc9YSYmYy5pc1BsYWluT2JqZWN0KGEpP2E6e30saFtlXT1jLmV4dGVuZChrLGcsZCkpOmQhPT11bmRlZmluZWQmJihoW2VdPWQpKSk7cmV0dXJuIGh9LGMucXVldWU9ZnVuY3Rpb24oYSxkLGUpe2lmKGEpe2Q9KGR8fFwiZnhcIikrXCJxdWV1ZVwiO3ZhciBmPWMuZGF0YShhLGQpO3JldHVybiBlPyghZnx8Yy5pc0FycmF5KGUpP2Y9Yy5kYXRhKGEsZCxmdW5jdGlvbihhLGMpe3ZhciBkPWN8fFtdO3JldHVybiBhJiYoYihPYmplY3QoYSkpP2Z1bmN0aW9uKGEsYil7Zm9yKHZhciBjPStiLmxlbmd0aCxkPTAsZT1hLmxlbmd0aDtkPGM7KWFbZSsrXT1iW2QrK107aWYoYyE9PWMpZm9yKDtiW2RdIT09dW5kZWZpbmVkOylhW2UrK109YltkKytdO2EubGVuZ3RoPWUsYX0oZCxcInN0cmluZ1wiPT10eXBlb2YgYT9bYV06YSk6W10ucHVzaC5jYWxsKGQsYSkpLGR9KGUpKTpmLnB1c2goZSksZik6Znx8W119fSxjLmRlcXVldWU9ZnVuY3Rpb24oYSxiKXtjLmVhY2goYS5ub2RlVHlwZT9bYV06YSxmdW5jdGlvbihhLGQpe2I9Ynx8XCJmeFwiO3ZhciBlPWMucXVldWUoZCxiKSxmPWUuc2hpZnQoKTtcImlucHJvZ3Jlc3NcIj09PWYmJihmPWUuc2hpZnQoKSksZiYmKFwiZnhcIj09PWImJmUudW5zaGlmdChcImlucHJvZ3Jlc3NcIiksZi5jYWxsKGQsZnVuY3Rpb24oKXtjLmRlcXVldWUoZCxiKX0pKX0pfSxjLmZuPWMucHJvdG90eXBlPXtpbml0OmZ1bmN0aW9uKGEpe2lmKGEubm9kZVR5cGUpcmV0dXJuIHRoaXNbMF09YSx0aGlzO3Rocm93IG5ldyBFcnJvcihcIk5vdCBhIERPTSBub2RlLlwiKX0sb2Zmc2V0OmZ1bmN0aW9uKCl7dmFyIGI9dGhpc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3Q/dGhpc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTp7dG9wOjAsbGVmdDowfTtyZXR1cm57dG9wOmIudG9wKyhhLnBhZ2VZT2Zmc2V0fHxkb2N1bWVudC5zY3JvbGxUb3B8fDApLShkb2N1bWVudC5jbGllbnRUb3B8fDApLGxlZnQ6Yi5sZWZ0KyhhLnBhZ2VYT2Zmc2V0fHxkb2N1bWVudC5zY3JvbGxMZWZ0fHwwKS0oZG9jdW1lbnQuY2xpZW50TGVmdHx8MCl9fSxwb3NpdGlvbjpmdW5jdGlvbigpe3ZhciBhPXRoaXNbMF0sYj1mdW5jdGlvbihhKXtmb3IodmFyIGI9YS5vZmZzZXRQYXJlbnQ7YiYmXCJodG1sXCIhPT1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJmIuc3R5bGUmJlwic3RhdGljXCI9PT1iLnN0eWxlLnBvc2l0aW9uOyliPWIub2Zmc2V0UGFyZW50O3JldHVybiBifHxkb2N1bWVudH0oYSksZD10aGlzLm9mZnNldCgpLGU9L14oPzpib2R5fGh0bWwpJC9pLnRlc3QoYi5ub2RlTmFtZSk/e3RvcDowLGxlZnQ6MH06YyhiKS5vZmZzZXQoKTtyZXR1cm4gZC50b3AtPXBhcnNlRmxvYXQoYS5zdHlsZS5tYXJnaW5Ub3ApfHwwLGQubGVmdC09cGFyc2VGbG9hdChhLnN0eWxlLm1hcmdpbkxlZnQpfHwwLGIuc3R5bGUmJihlLnRvcCs9cGFyc2VGbG9hdChiLnN0eWxlLmJvcmRlclRvcFdpZHRoKXx8MCxlLmxlZnQrPXBhcnNlRmxvYXQoYi5zdHlsZS5ib3JkZXJMZWZ0V2lkdGgpfHwwKSx7dG9wOmQudG9wLWUudG9wLGxlZnQ6ZC5sZWZ0LWUubGVmdH19fTt2YXIgZD17fTtjLmV4cGFuZG89XCJ2ZWxvY2l0eVwiKyhuZXcgRGF0ZSkuZ2V0VGltZSgpLGMudXVpZD0wO2Zvcih2YXIgZT17fSxmPWUuaGFzT3duUHJvcGVydHksZz1lLnRvU3RyaW5nLGg9XCJCb29sZWFuIE51bWJlciBTdHJpbmcgRnVuY3Rpb24gQXJyYXkgRGF0ZSBSZWdFeHAgT2JqZWN0IEVycm9yXCIuc3BsaXQoXCIgXCIpLGk9MDtpPGgubGVuZ3RoO2krKyllW1wiW29iamVjdCBcIitoW2ldK1wiXVwiXT1oW2ldLnRvTG93ZXJDYXNlKCk7Yy5mbi5pbml0LnByb3RvdHlwZT1jLmZuLGEuVmVsb2NpdHk9e1V0aWxpdGllczpjfX19KHdpbmRvdyksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7XCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPWEoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGEpOmEoKX0oZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtyZXR1cm4gZnVuY3Rpb24oYSxiLGMsZCl7ZnVuY3Rpb24gZShhKXtmb3IodmFyIGI9LTEsYz1hP2EubGVuZ3RoOjAsZD1bXTsrK2I8Yzspe3ZhciBlPWFbYl07ZSYmZC5wdXNoKGUpfXJldHVybiBkfWZ1bmN0aW9uIGYoYSl7cmV0dXJuIHUuaXNXcmFwcGVkKGEpP2E9cy5jYWxsKGEpOnUuaXNOb2RlKGEpJiYoYT1bYV0pLGF9ZnVuY3Rpb24gZyhhKXt2YXIgYj1vLmRhdGEoYSxcInZlbG9jaXR5XCIpO3JldHVybiBudWxsPT09Yj9kOmJ9ZnVuY3Rpb24gaChhLGIpe3ZhciBjPWcoYSk7YyYmYy5kZWxheVRpbWVyJiYhYy5kZWxheVBhdXNlZCYmKGMuZGVsYXlSZW1haW5pbmc9Yy5kZWxheS1iK2MuZGVsYXlCZWdpbixjLmRlbGF5UGF1c2VkPSEwLGNsZWFyVGltZW91dChjLmRlbGF5VGltZXIuc2V0VGltZW91dCkpfWZ1bmN0aW9uIGkoYSxiKXt2YXIgYz1nKGEpO2MmJmMuZGVsYXlUaW1lciYmYy5kZWxheVBhdXNlZCYmKGMuZGVsYXlQYXVzZWQ9ITEsYy5kZWxheVRpbWVyLnNldFRpbWVvdXQ9c2V0VGltZW91dChjLmRlbGF5VGltZXIubmV4dCxjLmRlbGF5UmVtYWluaW5nKSl9ZnVuY3Rpb24gaihhKXtyZXR1cm4gZnVuY3Rpb24oYil7cmV0dXJuIE1hdGgucm91bmQoYiphKSooMS9hKX19ZnVuY3Rpb24gayhhLGMsZCxlKXtmdW5jdGlvbiBmKGEsYil7cmV0dXJuIDEtMypiKzMqYX1mdW5jdGlvbiBnKGEsYil7cmV0dXJuIDMqYi02KmF9ZnVuY3Rpb24gaChhKXtyZXR1cm4gMyphfWZ1bmN0aW9uIGkoYSxiLGMpe3JldHVybigoZihiLGMpKmErZyhiLGMpKSphK2goYikpKmF9ZnVuY3Rpb24gaihhLGIsYyl7cmV0dXJuIDMqZihiLGMpKmEqYSsyKmcoYixjKSphK2goYil9ZnVuY3Rpb24gayhiLGMpe2Zvcih2YXIgZT0wO2U8cDsrK2Upe3ZhciBmPWooYyxhLGQpO2lmKDA9PT1mKXJldHVybiBjO2MtPShpKGMsYSxkKS1iKS9mfXJldHVybiBjfWZ1bmN0aW9uIGwoKXtmb3IodmFyIGI9MDtiPHQ7KytiKXhbYl09aShiKnUsYSxkKX1mdW5jdGlvbiBtKGIsYyxlKXt2YXIgZixnLGg9MDtkb3tnPWMrKGUtYykvMixmPWkoZyxhLGQpLWIsZj4wP2U9ZzpjPWd9d2hpbGUoTWF0aC5hYnMoZik+ciYmKytoPHMpO3JldHVybiBnfWZ1bmN0aW9uIG4oYil7Zm9yKHZhciBjPTAsZT0xLGY9dC0xO2UhPT1mJiZ4W2VdPD1iOysrZSljKz11Oy0tZTt2YXIgZz0oYi14W2VdKS8oeFtlKzFdLXhbZV0pLGg9YytnKnUsaT1qKGgsYSxkKTtyZXR1cm4gaT49cT9rKGIsaCk6MD09PWk/aDptKGIsYyxjK3UpfWZ1bmN0aW9uIG8oKXt5PSEwLGE9PT1jJiZkPT09ZXx8bCgpfXZhciBwPTQscT0uMDAxLHI9MWUtNyxzPTEwLHQ9MTEsdT0xLyh0LTEpLHY9XCJGbG9hdDMyQXJyYXlcImluIGI7aWYoNCE9PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuITE7Zm9yKHZhciB3PTA7dzw0OysrdylpZihcIm51bWJlclwiIT10eXBlb2YgYXJndW1lbnRzW3ddfHxpc05hTihhcmd1bWVudHNbd10pfHwhaXNGaW5pdGUoYXJndW1lbnRzW3ddKSlyZXR1cm4hMTthPU1hdGgubWluKGEsMSksZD1NYXRoLm1pbihkLDEpLGE9TWF0aC5tYXgoYSwwKSxkPU1hdGgubWF4KGQsMCk7dmFyIHg9dj9uZXcgRmxvYXQzMkFycmF5KHQpOm5ldyBBcnJheSh0KSx5PSExLHo9ZnVuY3Rpb24oYil7cmV0dXJuIHl8fG8oKSxhPT09YyYmZD09PWU/YjowPT09Yj8wOjE9PT1iPzE6aShuKGIpLGMsZSl9O3ouZ2V0Q29udHJvbFBvaW50cz1mdW5jdGlvbigpe3JldHVyblt7eDphLHk6Y30se3g6ZCx5OmV9XX07dmFyIEE9XCJnZW5lcmF0ZUJlemllcihcIitbYSxjLGQsZV0rXCIpXCI7cmV0dXJuIHoudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gQX0sen1mdW5jdGlvbiBsKGEsYil7dmFyIGM9YTtyZXR1cm4gdS5pc1N0cmluZyhhKT95LkVhc2luZ3NbYV18fChjPSExKTpjPXUuaXNBcnJheShhKSYmMT09PWEubGVuZ3RoP2ouYXBwbHkobnVsbCxhKTp1LmlzQXJyYXkoYSkmJjI9PT1hLmxlbmd0aD96LmFwcGx5KG51bGwsYS5jb25jYXQoW2JdKSk6ISghdS5pc0FycmF5KGEpfHw0IT09YS5sZW5ndGgpJiZrLmFwcGx5KG51bGwsYSksYz09PSExJiYoYz15LkVhc2luZ3NbeS5kZWZhdWx0cy5lYXNpbmddP3kuZGVmYXVsdHMuZWFzaW5nOngpLGN9ZnVuY3Rpb24gbShhKXtpZihhKXt2YXIgYj15LnRpbWVzdGFtcCYmYSE9PSEwP2E6ci5ub3coKSxjPXkuU3RhdGUuY2FsbHMubGVuZ3RoO2M+MWU0JiYoeS5TdGF0ZS5jYWxscz1lKHkuU3RhdGUuY2FsbHMpLGM9eS5TdGF0ZS5jYWxscy5sZW5ndGgpO2Zvcih2YXIgZj0wO2Y8YztmKyspaWYoeS5TdGF0ZS5jYWxsc1tmXSl7dmFyIGg9eS5TdGF0ZS5jYWxsc1tmXSxpPWhbMF0saj1oWzJdLGs9aFszXSxsPSEhayxxPW51bGwscz1oWzVdLHQ9aFs2XTtpZihrfHwoaz15LlN0YXRlLmNhbGxzW2ZdWzNdPWItMTYpLHMpe2lmKHMucmVzdW1lIT09ITApY29udGludWU7az1oWzNdPU1hdGgucm91bmQoYi10LTE2KSxoWzVdPW51bGx9dD1oWzZdPWItaztmb3IodmFyIHY9TWF0aC5taW4odC9qLmR1cmF0aW9uLDEpLHc9MCx4PWkubGVuZ3RoO3c8eDt3Kyspe3ZhciB6PWlbd10sQj16LmVsZW1lbnQ7aWYoZyhCKSl7dmFyIEQ9ITE7aWYoai5kaXNwbGF5IT09ZCYmbnVsbCE9PWouZGlzcGxheSYmXCJub25lXCIhPT1qLmRpc3BsYXkpe2lmKFwiZmxleFwiPT09ai5kaXNwbGF5KXt2YXIgRT1bXCItd2Via2l0LWJveFwiLFwiLW1vei1ib3hcIixcIi1tcy1mbGV4Ym94XCIsXCItd2Via2l0LWZsZXhcIl07by5lYWNoKEUsZnVuY3Rpb24oYSxiKXtBLnNldFByb3BlcnR5VmFsdWUoQixcImRpc3BsYXlcIixiKX0pfUEuc2V0UHJvcGVydHlWYWx1ZShCLFwiZGlzcGxheVwiLGouZGlzcGxheSl9ai52aXNpYmlsaXR5IT09ZCYmXCJoaWRkZW5cIiE9PWoudmlzaWJpbGl0eSYmQS5zZXRQcm9wZXJ0eVZhbHVlKEIsXCJ2aXNpYmlsaXR5XCIsai52aXNpYmlsaXR5KTtmb3IodmFyIEYgaW4geilpZih6Lmhhc093blByb3BlcnR5KEYpJiZcImVsZW1lbnRcIiE9PUYpe3ZhciBHLEg9eltGXSxJPXUuaXNTdHJpbmcoSC5lYXNpbmcpP3kuRWFzaW5nc1tILmVhc2luZ106SC5lYXNpbmc7aWYodS5pc1N0cmluZyhILnBhdHRlcm4pKXt2YXIgSj0xPT09dj9mdW5jdGlvbihhLGIsYyl7dmFyIGQ9SC5lbmRWYWx1ZVtiXTtyZXR1cm4gYz9NYXRoLnJvdW5kKGQpOmR9OmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1ILnN0YXJ0VmFsdWVbYl0sZT1ILmVuZFZhbHVlW2JdLWQsZj1kK2UqSSh2LGosZSk7cmV0dXJuIGM/TWF0aC5yb3VuZChmKTpmfTtHPUgucGF0dGVybi5yZXBsYWNlKC97KFxcZCspKCEpP30vZyxKKX1lbHNlIGlmKDE9PT12KUc9SC5lbmRWYWx1ZTtlbHNle3ZhciBLPUguZW5kVmFsdWUtSC5zdGFydFZhbHVlO0c9SC5zdGFydFZhbHVlK0sqSSh2LGosSyl9aWYoIWwmJkc9PT1ILmN1cnJlbnRWYWx1ZSljb250aW51ZTtpZihILmN1cnJlbnRWYWx1ZT1HLFwidHdlZW5cIj09PUYpcT1HO2Vsc2V7dmFyIEw7aWYoQS5Ib29rcy5yZWdpc3RlcmVkW0ZdKXtMPUEuSG9va3MuZ2V0Um9vdChGKTt2YXIgTT1nKEIpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbTF07TSYmKEgucm9vdFByb3BlcnR5VmFsdWU9TSl9dmFyIE49QS5zZXRQcm9wZXJ0eVZhbHVlKEIsRixILmN1cnJlbnRWYWx1ZSsocDw5JiYwPT09cGFyc2VGbG9hdChHKT9cIlwiOkgudW5pdFR5cGUpLEgucm9vdFByb3BlcnR5VmFsdWUsSC5zY3JvbGxEYXRhKTtBLkhvb2tzLnJlZ2lzdGVyZWRbRl0mJihBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbTF0/ZyhCKS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW0xdPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtMXShcImV4dHJhY3RcIixudWxsLE5bMV0pOmcoQikucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtMXT1OWzFdKSxcInRyYW5zZm9ybVwiPT09TlswXSYmKEQ9ITApfX1qLm1vYmlsZUhBJiZnKEIpLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkPT09ZCYmKGcoQikudHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2Q9XCIoMHB4LCAwcHgsIDBweClcIixEPSEwKSxEJiZBLmZsdXNoVHJhbnNmb3JtQ2FjaGUoQil9fWouZGlzcGxheSE9PWQmJlwibm9uZVwiIT09ai5kaXNwbGF5JiYoeS5TdGF0ZS5jYWxsc1tmXVsyXS5kaXNwbGF5PSExKSxqLnZpc2liaWxpdHkhPT1kJiZcImhpZGRlblwiIT09ai52aXNpYmlsaXR5JiYoeS5TdGF0ZS5jYWxsc1tmXVsyXS52aXNpYmlsaXR5PSExKSxqLnByb2dyZXNzJiZqLnByb2dyZXNzLmNhbGwoaFsxXSxoWzFdLHYsTWF0aC5tYXgoMCxrK2ouZHVyYXRpb24tYiksayxxKSwxPT09diYmbihmKX19eS5TdGF0ZS5pc1RpY2tpbmcmJkMobSl9ZnVuY3Rpb24gbihhLGIpe2lmKCF5LlN0YXRlLmNhbGxzW2FdKXJldHVybiExO2Zvcih2YXIgYz15LlN0YXRlLmNhbGxzW2FdWzBdLGU9eS5TdGF0ZS5jYWxsc1thXVsxXSxmPXkuU3RhdGUuY2FsbHNbYV1bMl0saD15LlN0YXRlLmNhbGxzW2FdWzRdLGk9ITEsaj0wLGs9Yy5sZW5ndGg7ajxrO2orKyl7dmFyIGw9Y1tqXS5lbGVtZW50O2J8fGYubG9vcHx8KFwibm9uZVwiPT09Zi5kaXNwbGF5JiZBLnNldFByb3BlcnR5VmFsdWUobCxcImRpc3BsYXlcIixmLmRpc3BsYXkpLFwiaGlkZGVuXCI9PT1mLnZpc2liaWxpdHkmJkEuc2V0UHJvcGVydHlWYWx1ZShsLFwidmlzaWJpbGl0eVwiLGYudmlzaWJpbGl0eSkpO3ZhciBtPWcobCk7aWYoZi5sb29wIT09ITAmJihvLnF1ZXVlKGwpWzFdPT09ZHx8IS9cXC52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnL2kudGVzdChvLnF1ZXVlKGwpWzFdKSkmJm0pe20uaXNBbmltYXRpbmc9ITEsbS5yb290UHJvcGVydHlWYWx1ZUNhY2hlPXt9O3ZhciBuPSExO28uZWFjaChBLkxpc3RzLnRyYW5zZm9ybXMzRCxmdW5jdGlvbihhLGIpe3ZhciBjPS9ec2NhbGUvLnRlc3QoYik/MTowLGU9bS50cmFuc2Zvcm1DYWNoZVtiXTttLnRyYW5zZm9ybUNhY2hlW2JdIT09ZCYmbmV3IFJlZ0V4cChcIl5cXFxcKFwiK2MrXCJbXi5dXCIpLnRlc3QoZSkmJihuPSEwLGRlbGV0ZSBtLnRyYW5zZm9ybUNhY2hlW2JdKX0pLGYubW9iaWxlSEEmJihuPSEwLGRlbGV0ZSBtLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkKSxuJiZBLmZsdXNoVHJhbnNmb3JtQ2FjaGUobCksQS5WYWx1ZXMucmVtb3ZlQ2xhc3MobCxcInZlbG9jaXR5LWFuaW1hdGluZ1wiKX1pZighYiYmZi5jb21wbGV0ZSYmIWYubG9vcCYmaj09PWstMSl0cnl7Zi5jb21wbGV0ZS5jYWxsKGUsZSl9Y2F0Y2gocil7c2V0VGltZW91dChmdW5jdGlvbigpe3Rocm93IHJ9LDEpfWgmJmYubG9vcCE9PSEwJiZoKGUpLG0mJmYubG9vcD09PSEwJiYhYiYmKG8uZWFjaChtLnR3ZWVuc0NvbnRhaW5lcixmdW5jdGlvbihhLGIpe2lmKC9ecm90YXRlLy50ZXN0KGEpJiYocGFyc2VGbG9hdChiLnN0YXJ0VmFsdWUpLXBhcnNlRmxvYXQoYi5lbmRWYWx1ZSkpJTM2MD09MCl7dmFyIGM9Yi5zdGFydFZhbHVlO2Iuc3RhcnRWYWx1ZT1iLmVuZFZhbHVlLGIuZW5kVmFsdWU9Y30vXmJhY2tncm91bmRQb3NpdGlvbi8udGVzdChhKSYmMTAwPT09cGFyc2VGbG9hdChiLmVuZFZhbHVlKSYmXCIlXCI9PT1iLnVuaXRUeXBlJiYoYi5lbmRWYWx1ZT0wLGIuc3RhcnRWYWx1ZT0xMDApfSkseShsLFwicmV2ZXJzZVwiLHtsb29wOiEwLGRlbGF5OmYuZGVsYXl9KSksZi5xdWV1ZSE9PSExJiZvLmRlcXVldWUobCxmLnF1ZXVlKX15LlN0YXRlLmNhbGxzW2FdPSExO2Zvcih2YXIgcD0wLHE9eS5TdGF0ZS5jYWxscy5sZW5ndGg7cDxxO3ArKylpZih5LlN0YXRlLmNhbGxzW3BdIT09ITEpe2k9ITA7YnJlYWt9aT09PSExJiYoeS5TdGF0ZS5pc1RpY2tpbmc9ITEsZGVsZXRlIHkuU3RhdGUuY2FsbHMseS5TdGF0ZS5jYWxscz1bXSl9dmFyIG8scD1mdW5jdGlvbigpe2lmKGMuZG9jdW1lbnRNb2RlKXJldHVybiBjLmRvY3VtZW50TW9kZTtmb3IodmFyIGE9NzthPjQ7YS0tKXt2YXIgYj1jLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7aWYoYi5pbm5lckhUTUw9XCI8IS0tW2lmIElFIFwiK2ErXCJdPjxzcGFuPjwvc3Bhbj48IVtlbmRpZl0tLT5cIixiLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3BhblwiKS5sZW5ndGgpcmV0dXJuIGI9bnVsbCxhfXJldHVybiBkfSgpLHE9ZnVuY3Rpb24oKXt2YXIgYT0wO3JldHVybiBiLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8Yi5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGZ1bmN0aW9uKGIpe3ZhciBjLGQ9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIGM9TWF0aC5tYXgoMCwxNi0oZC1hKSksYT1kK2Msc2V0VGltZW91dChmdW5jdGlvbigpe2IoZCtjKX0sYyl9fSgpLHI9ZnVuY3Rpb24oKXt2YXIgYT1iLnBlcmZvcm1hbmNlfHx7fTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBhLm5vdyl7dmFyIGM9YS50aW1pbmcmJmEudGltaW5nLm5hdmlnYXRpb25TdGFydD9hLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQ6KG5ldyBEYXRlKS5nZXRUaW1lKCk7YS5ub3c9ZnVuY3Rpb24oKXtyZXR1cm4obmV3IERhdGUpLmdldFRpbWUoKS1jfX1yZXR1cm4gYX0oKSxzPWZ1bmN0aW9uKCl7dmFyIGE9QXJyYXkucHJvdG90eXBlLnNsaWNlO3RyeXtyZXR1cm4gYS5jYWxsKGMuZG9jdW1lbnRFbGVtZW50KSxhfWNhdGNoKGIpe3JldHVybiBmdW5jdGlvbihiLGMpe3ZhciBkPXRoaXMubGVuZ3RoO2lmKFwibnVtYmVyXCIhPXR5cGVvZiBiJiYoYj0wKSxcIm51bWJlclwiIT10eXBlb2YgYyYmKGM9ZCksdGhpcy5zbGljZSlyZXR1cm4gYS5jYWxsKHRoaXMsYixjKTt2YXIgZSxmPVtdLGc9Yj49MD9iOk1hdGgubWF4KDAsZCtiKSxoPWM8MD9kK2M6TWF0aC5taW4oYyxkKSxpPWgtZztpZihpPjApaWYoZj1uZXcgQXJyYXkoaSksdGhpcy5jaGFyQXQpZm9yKGU9MDtlPGk7ZSsrKWZbZV09dGhpcy5jaGFyQXQoZytlKTtlbHNlIGZvcihlPTA7ZTxpO2UrKylmW2VdPXRoaXNbZytlXTtyZXR1cm4gZn19fSgpLHQ9ZnVuY3Rpb24oKXtyZXR1cm4gQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzP2Z1bmN0aW9uKGEsYil7cmV0dXJuIGEuaW5jbHVkZXMoYil9OkFycmF5LnByb3RvdHlwZS5pbmRleE9mP2Z1bmN0aW9uKGEsYil7cmV0dXJuIGEuaW5kZXhPZihiKT49MH06ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrKylpZihhW2NdPT09YilyZXR1cm4hMDtyZXR1cm4hMX19LHU9e2lzTnVtYmVyOmZ1bmN0aW9uKGEpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBhfSxpc1N0cmluZzpmdW5jdGlvbihhKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYX0saXNBcnJheTpBcnJheS5pc0FycmF5fHxmdW5jdGlvbihhKXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSl9LGlzRnVuY3Rpb246ZnVuY3Rpb24oYSl7cmV0dXJuXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpfSxpc05vZGU6ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJmEubm9kZVR5cGV9LGlzV3JhcHBlZDpmdW5jdGlvbihhKXtyZXR1cm4gYSYmYSE9PWImJnUuaXNOdW1iZXIoYS5sZW5ndGgpJiYhdS5pc1N0cmluZyhhKSYmIXUuaXNGdW5jdGlvbihhKSYmIXUuaXNOb2RlKGEpJiYoMD09PWEubGVuZ3RofHx1LmlzTm9kZShhWzBdKSl9LGlzU1ZHOmZ1bmN0aW9uKGEpe3JldHVybiBiLlNWR0VsZW1lbnQmJmEgaW5zdGFuY2VvZiBiLlNWR0VsZW1lbnR9LGlzRW1wdHlPYmplY3Q6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiIGluIGEpaWYoYS5oYXNPd25Qcm9wZXJ0eShiKSlyZXR1cm4hMTtyZXR1cm4hMH19LHY9ITE7aWYoYS5mbiYmYS5mbi5qcXVlcnk/KG89YSx2PSEwKTpvPWIuVmVsb2NpdHkuVXRpbGl0aWVzLHA8PTgmJiF2KXRocm93IG5ldyBFcnJvcihcIlZlbG9jaXR5OiBJRTggYW5kIGJlbG93IHJlcXVpcmUgalF1ZXJ5IHRvIGJlIGxvYWRlZCBiZWZvcmUgVmVsb2NpdHkuXCIpO2lmKHA8PTcpcmV0dXJuIHZvaWQoalF1ZXJ5LmZuLnZlbG9jaXR5PWpRdWVyeS5mbi5hbmltYXRlKTt2YXIgdz00MDAseD1cInN3aW5nXCIseT17U3RhdGU6e2lzTW9iaWxlOi9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxpc0FuZHJvaWQ6L0FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLGlzR2luZ2VyYnJlYWQ6L0FuZHJvaWQgMlxcLjNcXC5bMy03XS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksaXNDaHJvbWU6Yi5jaHJvbWUsaXNGaXJlZm94Oi9GaXJlZm94L2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxwcmVmaXhFbGVtZW50OmMuY3JlYXRlRWxlbWVudChcImRpdlwiKSxwcmVmaXhNYXRjaGVzOnt9LHNjcm9sbEFuY2hvcjpudWxsLHNjcm9sbFByb3BlcnR5TGVmdDpudWxsLHNjcm9sbFByb3BlcnR5VG9wOm51bGwsaXNUaWNraW5nOiExLGNhbGxzOltdLGRlbGF5ZWRFbGVtZW50czp7Y291bnQ6MH19LENTUzp7fSxVdGlsaXRpZXM6byxSZWRpcmVjdHM6e30sRWFzaW5nczp7fSxQcm9taXNlOmIuUHJvbWlzZSxkZWZhdWx0czp7cXVldWU6XCJcIixkdXJhdGlvbjp3LGVhc2luZzp4LGJlZ2luOmQsY29tcGxldGU6ZCxwcm9ncmVzczpkLGRpc3BsYXk6ZCx2aXNpYmlsaXR5OmQsbG9vcDohMSxkZWxheTohMSxtb2JpbGVIQTohMCxfY2FjaGVWYWx1ZXM6ITAscHJvbWlzZVJlamVjdEVtcHR5OiEwfSxpbml0OmZ1bmN0aW9uKGEpe28uZGF0YShhLFwidmVsb2NpdHlcIix7aXNTVkc6dS5pc1NWRyhhKSxpc0FuaW1hdGluZzohMSxjb21wdXRlZFN0eWxlOm51bGwsdHdlZW5zQ29udGFpbmVyOm51bGwscm9vdFByb3BlcnR5VmFsdWVDYWNoZTp7fSx0cmFuc2Zvcm1DYWNoZTp7fX0pfSxob29rOm51bGwsbW9jazohMSx2ZXJzaW9uOnttYWpvcjoxLG1pbm9yOjUscGF0Y2g6MH0sZGVidWc6ITEsdGltZXN0YW1wOiEwLHBhdXNlQWxsOmZ1bmN0aW9uKGEpe3ZhciBiPShuZXcgRGF0ZSkuZ2V0VGltZSgpO28uZWFjaCh5LlN0YXRlLmNhbGxzLGZ1bmN0aW9uKGIsYyl7aWYoYyl7aWYoYSE9PWQmJihjWzJdLnF1ZXVlIT09YXx8Y1syXS5xdWV1ZT09PSExKSlyZXR1cm4hMDtjWzVdPXtyZXN1bWU6ITF9fX0pLG8uZWFjaCh5LlN0YXRlLmRlbGF5ZWRFbGVtZW50cyxmdW5jdGlvbihhLGMpe2MmJmgoYyxiKX0pfSxyZXN1bWVBbGw6ZnVuY3Rpb24oYSl7dmFyIGI9KG5ldyBEYXRlKS5nZXRUaW1lKCk7by5lYWNoKHkuU3RhdGUuY2FsbHMsZnVuY3Rpb24oYixjKXtpZihjKXtpZihhIT09ZCYmKGNbMl0ucXVldWUhPT1hfHxjWzJdLnF1ZXVlPT09ITEpKXJldHVybiEwO2NbNV0mJihjWzVdLnJlc3VtZT0hMCl9fSksby5lYWNoKHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLGZ1bmN0aW9uKGEsYyl7YyYmaShjLGIpfSl9fTtiLnBhZ2VZT2Zmc2V0IT09ZD8oeS5TdGF0ZS5zY3JvbGxBbmNob3I9Yix5LlN0YXRlLnNjcm9sbFByb3BlcnR5TGVmdD1cInBhZ2VYT2Zmc2V0XCIseS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eVRvcD1cInBhZ2VZT2Zmc2V0XCIpOih5LlN0YXRlLnNjcm9sbEFuY2hvcj1jLmRvY3VtZW50RWxlbWVudHx8Yy5ib2R5LnBhcmVudE5vZGV8fGMuYm9keSx5LlN0YXRlLnNjcm9sbFByb3BlcnR5TGVmdD1cInNjcm9sbExlZnRcIix5LlN0YXRlLnNjcm9sbFByb3BlcnR5VG9wPVwic2Nyb2xsVG9wXCIpO3ZhciB6PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhKXtyZXR1cm4tYS50ZW5zaW9uKmEueC1hLmZyaWN0aW9uKmEudn1mdW5jdGlvbiBiKGIsYyxkKXt2YXIgZT17eDpiLngrZC5keCpjLHY6Yi52K2QuZHYqYyx0ZW5zaW9uOmIudGVuc2lvbixmcmljdGlvbjpiLmZyaWN0aW9ufTtyZXR1cm57ZHg6ZS52LGR2OmEoZSl9fWZ1bmN0aW9uIGMoYyxkKXt2YXIgZT17ZHg6Yy52LGR2OmEoYyl9LGY9YihjLC41KmQsZSksZz1iKGMsLjUqZCxmKSxoPWIoYyxkLGcpLGk9MS82KihlLmR4KzIqKGYuZHgrZy5keCkraC5keCksaj0xLzYqKGUuZHYrMiooZi5kditnLmR2KStoLmR2KTtyZXR1cm4gYy54PWMueCtpKmQsYy52PWMuditqKmQsY31yZXR1cm4gZnVuY3Rpb24gZChhLGIsZSl7dmFyIGYsZyxoLGk9e3g6LTEsdjowLHRlbnNpb246bnVsbCxmcmljdGlvbjpudWxsfSxqPVswXSxrPTA7Zm9yKGE9cGFyc2VGbG9hdChhKXx8NTAwLGI9cGFyc2VGbG9hdChiKXx8MjAsZT1lfHxudWxsLGkudGVuc2lvbj1hLGkuZnJpY3Rpb249YixmPW51bGwhPT1lLGY/KGs9ZChhLGIpLGc9ay9lKi4wMTYpOmc9LjAxNjs7KWlmKGg9YyhofHxpLGcpLGoucHVzaCgxK2gueCksays9MTYsIShNYXRoLmFicyhoLngpPjFlLTQmJk1hdGguYWJzKGgudik+MWUtNCkpYnJlYWs7cmV0dXJuIGY/ZnVuY3Rpb24oYSl7cmV0dXJuIGpbYSooai5sZW5ndGgtMSl8MF19Omt9fSgpO3kuRWFzaW5ncz17bGluZWFyOmZ1bmN0aW9uKGEpe3JldHVybiBhfSxzd2luZzpmdW5jdGlvbihhKXtyZXR1cm4uNS1NYXRoLmNvcyhhKk1hdGguUEkpLzJ9LHNwcmluZzpmdW5jdGlvbihhKXtyZXR1cm4gMS1NYXRoLmNvcyg0LjUqYSpNYXRoLlBJKSpNYXRoLmV4cCg2Ki1hKX19LG8uZWFjaChbW1wiZWFzZVwiLFsuMjUsLjEsLjI1LDFdXSxbXCJlYXNlLWluXCIsWy40MiwwLDEsMV1dLFtcImVhc2Utb3V0XCIsWzAsMCwuNTgsMV1dLFtcImVhc2UtaW4tb3V0XCIsWy40MiwwLC41OCwxXV0sW1wiZWFzZUluU2luZVwiLFsuNDcsMCwuNzQ1LC43MTVdXSxbXCJlYXNlT3V0U2luZVwiLFsuMzksLjU3NSwuNTY1LDFdXSxbXCJlYXNlSW5PdXRTaW5lXCIsWy40NDUsLjA1LC41NSwuOTVdXSxbXCJlYXNlSW5RdWFkXCIsWy41NSwuMDg1LC42OCwuNTNdXSxbXCJlYXNlT3V0UXVhZFwiLFsuMjUsLjQ2LC40NSwuOTRdXSxbXCJlYXNlSW5PdXRRdWFkXCIsWy40NTUsLjAzLC41MTUsLjk1NV1dLFtcImVhc2VJbkN1YmljXCIsWy41NSwuMDU1LC42NzUsLjE5XV0sW1wiZWFzZU91dEN1YmljXCIsWy4yMTUsLjYxLC4zNTUsMV1dLFtcImVhc2VJbk91dEN1YmljXCIsWy42NDUsLjA0NSwuMzU1LDFdXSxbXCJlYXNlSW5RdWFydFwiLFsuODk1LC4wMywuNjg1LC4yMl1dLFtcImVhc2VPdXRRdWFydFwiLFsuMTY1LC44NCwuNDQsMV1dLFtcImVhc2VJbk91dFF1YXJ0XCIsWy43NywwLC4xNzUsMV1dLFtcImVhc2VJblF1aW50XCIsWy43NTUsLjA1LC44NTUsLjA2XV0sW1wiZWFzZU91dFF1aW50XCIsWy4yMywxLC4zMiwxXV0sW1wiZWFzZUluT3V0UXVpbnRcIixbLjg2LDAsLjA3LDFdXSxbXCJlYXNlSW5FeHBvXCIsWy45NSwuMDUsLjc5NSwuMDM1XV0sW1wiZWFzZU91dEV4cG9cIixbLjE5LDEsLjIyLDFdXSxbXCJlYXNlSW5PdXRFeHBvXCIsWzEsMCwwLDFdXSxbXCJlYXNlSW5DaXJjXCIsWy42LC4wNCwuOTgsLjMzNV1dLFtcImVhc2VPdXRDaXJjXCIsWy4wNzUsLjgyLC4xNjUsMV1dLFtcImVhc2VJbk91dENpcmNcIixbLjc4NSwuMTM1LC4xNSwuODZdXV0sZnVuY3Rpb24oYSxiKXt5LkVhc2luZ3NbYlswXV09ay5hcHBseShudWxsLGJbMV0pfSk7dmFyIEE9eS5DU1M9e1JlZ0V4Ontpc0hleDovXiMoW0EtZlxcZF17M30pezEsMn0kL2ksdmFsdWVVbndyYXA6L15bQS16XStcXCgoLiopXFwpJC9pLHdyYXBwZWRWYWx1ZUFscmVhZHlFeHRyYWN0ZWQ6L1swLTkuXSsgWzAtOS5dKyBbMC05Ll0rKCBbMC05Ll0rKT8vLHZhbHVlU3BsaXQ6LyhbQS16XStcXCguK1xcKSl8KChbQS16MC05Iy0uXSs/KSg/PVxcc3wkKSkvZ2l9LExpc3RzOntjb2xvcnM6W1wiZmlsbFwiLFwic3Ryb2tlXCIsXCJzdG9wQ29sb3JcIixcImNvbG9yXCIsXCJiYWNrZ3JvdW5kQ29sb3JcIixcImJvcmRlckNvbG9yXCIsXCJib3JkZXJUb3BDb2xvclwiLFwiYm9yZGVyUmlnaHRDb2xvclwiLFwiYm9yZGVyQm90dG9tQ29sb3JcIixcImJvcmRlckxlZnRDb2xvclwiLFwib3V0bGluZUNvbG9yXCJdLHRyYW5zZm9ybXNCYXNlOltcInRyYW5zbGF0ZVhcIixcInRyYW5zbGF0ZVlcIixcInNjYWxlXCIsXCJzY2FsZVhcIixcInNjYWxlWVwiLFwic2tld1hcIixcInNrZXdZXCIsXCJyb3RhdGVaXCJdLHRyYW5zZm9ybXMzRDpbXCJ0cmFuc2Zvcm1QZXJzcGVjdGl2ZVwiLFwidHJhbnNsYXRlWlwiLFwic2NhbGVaXCIsXCJyb3RhdGVYXCIsXCJyb3RhdGVZXCJdLHVuaXRzOltcIiVcIixcImVtXCIsXCJleFwiLFwiY2hcIixcInJlbVwiLFwidndcIixcInZoXCIsXCJ2bWluXCIsXCJ2bWF4XCIsXCJjbVwiLFwibW1cIixcIlFcIixcImluXCIsXCJwY1wiLFwicHRcIixcInB4XCIsXCJkZWdcIixcImdyYWRcIixcInJhZFwiLFwidHVyblwiLFwic1wiLFwibXNcIl0sY29sb3JOYW1lczp7YWxpY2VibHVlOlwiMjQwLDI0OCwyNTVcIixhbnRpcXVld2hpdGU6XCIyNTAsMjM1LDIxNVwiLGFxdWFtYXJpbmU6XCIxMjcsMjU1LDIxMlwiLGFxdWE6XCIwLDI1NSwyNTVcIixhenVyZTpcIjI0MCwyNTUsMjU1XCIsYmVpZ2U6XCIyNDUsMjQ1LDIyMFwiLGJpc3F1ZTpcIjI1NSwyMjgsMTk2XCIsYmxhY2s6XCIwLDAsMFwiLGJsYW5jaGVkYWxtb25kOlwiMjU1LDIzNSwyMDVcIixibHVldmlvbGV0OlwiMTM4LDQzLDIyNlwiLGJsdWU6XCIwLDAsMjU1XCIsYnJvd246XCIxNjUsNDIsNDJcIixidXJseXdvb2Q6XCIyMjIsMTg0LDEzNVwiLGNhZGV0Ymx1ZTpcIjk1LDE1OCwxNjBcIixjaGFydHJldXNlOlwiMTI3LDI1NSwwXCIsY2hvY29sYXRlOlwiMjEwLDEwNSwzMFwiLGNvcmFsOlwiMjU1LDEyNyw4MFwiLGNvcm5mbG93ZXJibHVlOlwiMTAwLDE0OSwyMzdcIixjb3Juc2lsazpcIjI1NSwyNDgsMjIwXCIsY3JpbXNvbjpcIjIyMCwyMCw2MFwiLGN5YW46XCIwLDI1NSwyNTVcIixkYXJrYmx1ZTpcIjAsMCwxMzlcIixkYXJrY3lhbjpcIjAsMTM5LDEzOVwiLGRhcmtnb2xkZW5yb2Q6XCIxODQsMTM0LDExXCIsZGFya2dyYXk6XCIxNjksMTY5LDE2OVwiLGRhcmtncmV5OlwiMTY5LDE2OSwxNjlcIixkYXJrZ3JlZW46XCIwLDEwMCwwXCIsZGFya2toYWtpOlwiMTg5LDE4MywxMDdcIixkYXJrbWFnZW50YTpcIjEzOSwwLDEzOVwiLGRhcmtvbGl2ZWdyZWVuOlwiODUsMTA3LDQ3XCIsZGFya29yYW5nZTpcIjI1NSwxNDAsMFwiLGRhcmtvcmNoaWQ6XCIxNTMsNTAsMjA0XCIsZGFya3JlZDpcIjEzOSwwLDBcIixkYXJrc2FsbW9uOlwiMjMzLDE1MCwxMjJcIixkYXJrc2VhZ3JlZW46XCIxNDMsMTg4LDE0M1wiLGRhcmtzbGF0ZWJsdWU6XCI3Miw2MSwxMzlcIixkYXJrc2xhdGVncmF5OlwiNDcsNzksNzlcIixkYXJrdHVycXVvaXNlOlwiMCwyMDYsMjA5XCIsZGFya3Zpb2xldDpcIjE0OCwwLDIxMVwiLGRlZXBwaW5rOlwiMjU1LDIwLDE0N1wiLGRlZXBza3libHVlOlwiMCwxOTEsMjU1XCIsZGltZ3JheTpcIjEwNSwxMDUsMTA1XCIsZGltZ3JleTpcIjEwNSwxMDUsMTA1XCIsZG9kZ2VyYmx1ZTpcIjMwLDE0NCwyNTVcIixmaXJlYnJpY2s6XCIxNzgsMzQsMzRcIixmbG9yYWx3aGl0ZTpcIjI1NSwyNTAsMjQwXCIsZm9yZXN0Z3JlZW46XCIzNCwxMzksMzRcIixmdWNoc2lhOlwiMjU1LDAsMjU1XCIsZ2FpbnNib3JvOlwiMjIwLDIyMCwyMjBcIixnaG9zdHdoaXRlOlwiMjQ4LDI0OCwyNTVcIixnb2xkOlwiMjU1LDIxNSwwXCIsZ29sZGVucm9kOlwiMjE4LDE2NSwzMlwiLGdyYXk6XCIxMjgsMTI4LDEyOFwiLGdyZXk6XCIxMjgsMTI4LDEyOFwiLGdyZWVueWVsbG93OlwiMTczLDI1NSw0N1wiLGdyZWVuOlwiMCwxMjgsMFwiLGhvbmV5ZGV3OlwiMjQwLDI1NSwyNDBcIixob3RwaW5rOlwiMjU1LDEwNSwxODBcIixpbmRpYW5yZWQ6XCIyMDUsOTIsOTJcIixpbmRpZ286XCI3NSwwLDEzMFwiLGl2b3J5OlwiMjU1LDI1NSwyNDBcIixraGFraTpcIjI0MCwyMzAsMTQwXCIsbGF2ZW5kZXJibHVzaDpcIjI1NSwyNDAsMjQ1XCIsbGF2ZW5kZXI6XCIyMzAsMjMwLDI1MFwiLGxhd25ncmVlbjpcIjEyNCwyNTIsMFwiLGxlbW9uY2hpZmZvbjpcIjI1NSwyNTAsMjA1XCIsbGlnaHRibHVlOlwiMTczLDIxNiwyMzBcIixsaWdodGNvcmFsOlwiMjQwLDEyOCwxMjhcIixsaWdodGN5YW46XCIyMjQsMjU1LDI1NVwiLGxpZ2h0Z29sZGVucm9keWVsbG93OlwiMjUwLDI1MCwyMTBcIixsaWdodGdyYXk6XCIyMTEsMjExLDIxMVwiLGxpZ2h0Z3JleTpcIjIxMSwyMTEsMjExXCIsbGlnaHRncmVlbjpcIjE0NCwyMzgsMTQ0XCIsbGlnaHRwaW5rOlwiMjU1LDE4MiwxOTNcIixsaWdodHNhbG1vbjpcIjI1NSwxNjAsMTIyXCIsbGlnaHRzZWFncmVlbjpcIjMyLDE3OCwxNzBcIixsaWdodHNreWJsdWU6XCIxMzUsMjA2LDI1MFwiLGxpZ2h0c2xhdGVncmF5OlwiMTE5LDEzNiwxNTNcIixsaWdodHN0ZWVsYmx1ZTpcIjE3NiwxOTYsMjIyXCIsbGlnaHR5ZWxsb3c6XCIyNTUsMjU1LDIyNFwiLGxpbWVncmVlbjpcIjUwLDIwNSw1MFwiLGxpbWU6XCIwLDI1NSwwXCIsbGluZW46XCIyNTAsMjQwLDIzMFwiLG1hZ2VudGE6XCIyNTUsMCwyNTVcIixtYXJvb246XCIxMjgsMCwwXCIsbWVkaXVtYXF1YW1hcmluZTpcIjEwMiwyMDUsMTcwXCIsbWVkaXVtYmx1ZTpcIjAsMCwyMDVcIixtZWRpdW1vcmNoaWQ6XCIxODYsODUsMjExXCIsbWVkaXVtcHVycGxlOlwiMTQ3LDExMiwyMTlcIixtZWRpdW1zZWFncmVlbjpcIjYwLDE3OSwxMTNcIixtZWRpdW1zbGF0ZWJsdWU6XCIxMjMsMTA0LDIzOFwiLG1lZGl1bXNwcmluZ2dyZWVuOlwiMCwyNTAsMTU0XCIsbWVkaXVtdHVycXVvaXNlOlwiNzIsMjA5LDIwNFwiLG1lZGl1bXZpb2xldHJlZDpcIjE5OSwyMSwxMzNcIixtaWRuaWdodGJsdWU6XCIyNSwyNSwxMTJcIixtaW50Y3JlYW06XCIyNDUsMjU1LDI1MFwiLG1pc3R5cm9zZTpcIjI1NSwyMjgsMjI1XCIsbW9jY2FzaW46XCIyNTUsMjI4LDE4MVwiLG5hdmFqb3doaXRlOlwiMjU1LDIyMiwxNzNcIixuYXZ5OlwiMCwwLDEyOFwiLG9sZGxhY2U6XCIyNTMsMjQ1LDIzMFwiLG9saXZlZHJhYjpcIjEwNywxNDIsMzVcIixvbGl2ZTpcIjEyOCwxMjgsMFwiLG9yYW5nZXJlZDpcIjI1NSw2OSwwXCIsb3JhbmdlOlwiMjU1LDE2NSwwXCIsb3JjaGlkOlwiMjE4LDExMiwyMTRcIixwYWxlZ29sZGVucm9kOlwiMjM4LDIzMiwxNzBcIixwYWxlZ3JlZW46XCIxNTIsMjUxLDE1MlwiLHBhbGV0dXJxdW9pc2U6XCIxNzUsMjM4LDIzOFwiLHBhbGV2aW9sZXRyZWQ6XCIyMTksMTEyLDE0N1wiLHBhcGF5YXdoaXA6XCIyNTUsMjM5LDIxM1wiLHBlYWNocHVmZjpcIjI1NSwyMTgsMTg1XCIscGVydTpcIjIwNSwxMzMsNjNcIixwaW5rOlwiMjU1LDE5MiwyMDNcIixwbHVtOlwiMjIxLDE2MCwyMjFcIixwb3dkZXJibHVlOlwiMTc2LDIyNCwyMzBcIixwdXJwbGU6XCIxMjgsMCwxMjhcIixyZWQ6XCIyNTUsMCwwXCIscm9zeWJyb3duOlwiMTg4LDE0MywxNDNcIixyb3lhbGJsdWU6XCI2NSwxMDUsMjI1XCIsc2FkZGxlYnJvd246XCIxMzksNjksMTlcIixzYWxtb246XCIyNTAsMTI4LDExNFwiLHNhbmR5YnJvd246XCIyNDQsMTY0LDk2XCIsc2VhZ3JlZW46XCI0NiwxMzksODdcIixzZWFzaGVsbDpcIjI1NSwyNDUsMjM4XCIsc2llbm5hOlwiMTYwLDgyLDQ1XCIsc2lsdmVyOlwiMTkyLDE5MiwxOTJcIixza3libHVlOlwiMTM1LDIwNiwyMzVcIixzbGF0ZWJsdWU6XCIxMDYsOTAsMjA1XCIsc2xhdGVncmF5OlwiMTEyLDEyOCwxNDRcIixzbm93OlwiMjU1LDI1MCwyNTBcIixzcHJpbmdncmVlbjpcIjAsMjU1LDEyN1wiLHN0ZWVsYmx1ZTpcIjcwLDEzMCwxODBcIix0YW46XCIyMTAsMTgwLDE0MFwiLHRlYWw6XCIwLDEyOCwxMjhcIix0aGlzdGxlOlwiMjE2LDE5MSwyMTZcIix0b21hdG86XCIyNTUsOTksNzFcIix0dXJxdW9pc2U6XCI2NCwyMjQsMjA4XCIsdmlvbGV0OlwiMjM4LDEzMCwyMzhcIix3aGVhdDpcIjI0NSwyMjIsMTc5XCIsd2hpdGVzbW9rZTpcIjI0NSwyNDUsMjQ1XCIsd2hpdGU6XCIyNTUsMjU1LDI1NVwiLHllbGxvd2dyZWVuOlwiMTU0LDIwNSw1MFwiLHllbGxvdzpcIjI1NSwyNTUsMFwifX0sSG9va3M6e3RlbXBsYXRlczp7dGV4dFNoYWRvdzpbXCJDb2xvciBYIFkgQmx1clwiLFwiYmxhY2sgMHB4IDBweCAwcHhcIl0sYm94U2hhZG93OltcIkNvbG9yIFggWSBCbHVyIFNwcmVhZFwiLFwiYmxhY2sgMHB4IDBweCAwcHggMHB4XCJdLGNsaXA6W1wiVG9wIFJpZ2h0IEJvdHRvbSBMZWZ0XCIsXCIwcHggMHB4IDBweCAwcHhcIl0sYmFja2dyb3VuZFBvc2l0aW9uOltcIlggWVwiLFwiMCUgMCVcIl0sdHJhbnNmb3JtT3JpZ2luOltcIlggWSBaXCIsXCI1MCUgNTAlIDBweFwiXSxwZXJzcGVjdGl2ZU9yaWdpbjpbXCJYIFlcIixcIjUwJSA1MCVcIl19LHJlZ2lzdGVyZWQ6e30scmVnaXN0ZXI6ZnVuY3Rpb24oKXtmb3IodmFyIGE9MDthPEEuTGlzdHMuY29sb3JzLmxlbmd0aDthKyspe3ZhciBiPVwiY29sb3JcIj09PUEuTGlzdHMuY29sb3JzW2FdP1wiMCAwIDAgMVwiOlwiMjU1IDI1NSAyNTUgMVwiO0EuSG9va3MudGVtcGxhdGVzW0EuTGlzdHMuY29sb3JzW2FdXT1bXCJSZWQgR3JlZW4gQmx1ZSBBbHBoYVwiLGJdfXZhciBjLGQsZTtpZihwKWZvcihjIGluIEEuSG9va3MudGVtcGxhdGVzKWlmKEEuSG9va3MudGVtcGxhdGVzLmhhc093blByb3BlcnR5KGMpKXtkPUEuSG9va3MudGVtcGxhdGVzW2NdLGU9ZFswXS5zcGxpdChcIiBcIik7dmFyIGY9ZFsxXS5tYXRjaChBLlJlZ0V4LnZhbHVlU3BsaXQpO1wiQ29sb3JcIj09PWVbMF0mJihlLnB1c2goZS5zaGlmdCgpKSxmLnB1c2goZi5zaGlmdCgpKSxBLkhvb2tzLnRlbXBsYXRlc1tjXT1bZS5qb2luKFwiIFwiKSxmLmpvaW4oXCIgXCIpXSl9Zm9yKGMgaW4gQS5Ib29rcy50ZW1wbGF0ZXMpaWYoQS5Ib29rcy50ZW1wbGF0ZXMuaGFzT3duUHJvcGVydHkoYykpe2Q9QS5Ib29rcy50ZW1wbGF0ZXNbY10sZT1kWzBdLnNwbGl0KFwiIFwiKTtmb3IodmFyIGcgaW4gZSlpZihlLmhhc093blByb3BlcnR5KGcpKXt2YXIgaD1jK2VbZ10saT1nO0EuSG9va3MucmVnaXN0ZXJlZFtoXT1bYyxpXX19fSxnZXRSb290OmZ1bmN0aW9uKGEpe3ZhciBiPUEuSG9va3MucmVnaXN0ZXJlZFthXTtyZXR1cm4gYj9iWzBdOmF9LGdldFVuaXQ6ZnVuY3Rpb24oYSxiKXt2YXIgYz0oYS5zdWJzdHIoYnx8MCw1KS5tYXRjaCgvXlthLXolXSsvKXx8W10pWzBdfHxcIlwiO3JldHVybiBjJiZ0KEEuTGlzdHMudW5pdHMsYyk/YzpcIlwifSxmaXhDb2xvcnM6ZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVwbGFjZSgvKHJnYmE/XFwoXFxzKik/KFxcYlthLXpdK1xcYikvZyxmdW5jdGlvbihhLGIsYyl7cmV0dXJuIEEuTGlzdHMuY29sb3JOYW1lcy5oYXNPd25Qcm9wZXJ0eShjKT8oYj9iOlwicmdiYShcIikrQS5MaXN0cy5jb2xvck5hbWVzW2NdKyhiP1wiXCI6XCIsMSlcIik6YitjfSl9LGNsZWFuUm9vdFByb3BlcnR5VmFsdWU6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gQS5SZWdFeC52YWx1ZVVud3JhcC50ZXN0KGIpJiYoYj1iLm1hdGNoKEEuUmVnRXgudmFsdWVVbndyYXApWzFdKSxBLlZhbHVlcy5pc0NTU051bGxWYWx1ZShiKSYmKGI9QS5Ib29rcy50ZW1wbGF0ZXNbYV1bMV0pLGJ9LGV4dHJhY3RWYWx1ZTpmdW5jdGlvbihhLGIpe3ZhciBjPUEuSG9va3MucmVnaXN0ZXJlZFthXTtpZihjKXt2YXIgZD1jWzBdLGU9Y1sxXTtyZXR1cm4gYj1BLkhvb2tzLmNsZWFuUm9vdFByb3BlcnR5VmFsdWUoZCxiKSxiLnRvU3RyaW5nKCkubWF0Y2goQS5SZWdFeC52YWx1ZVNwbGl0KVtlXX1yZXR1cm4gYn0saW5qZWN0VmFsdWU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPUEuSG9va3MucmVnaXN0ZXJlZFthXTtpZihkKXt2YXIgZSxmPWRbMF0sZz1kWzFdO3JldHVybiBjPUEuSG9va3MuY2xlYW5Sb290UHJvcGVydHlWYWx1ZShmLGMpLGU9Yy50b1N0cmluZygpLm1hdGNoKEEuUmVnRXgudmFsdWVTcGxpdCksZVtnXT1iLGUuam9pbihcIiBcIil9cmV0dXJuIGN9fSxOb3JtYWxpemF0aW9uczp7cmVnaXN0ZXJlZDp7Y2xpcDpmdW5jdGlvbihhLGIsYyl7c3dpdGNoKGEpe2Nhc2VcIm5hbWVcIjpyZXR1cm5cImNsaXBcIjtjYXNlXCJleHRyYWN0XCI6dmFyIGQ7cmV0dXJuIEEuUmVnRXgud3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZC50ZXN0KGMpP2Q9YzooZD1jLnRvU3RyaW5nKCkubWF0Y2goQS5SZWdFeC52YWx1ZVVud3JhcCksZD1kP2RbMV0ucmVwbGFjZSgvLChcXHMrKT8vZyxcIiBcIik6YyksZDtjYXNlXCJpbmplY3RcIjpyZXR1cm5cInJlY3QoXCIrYytcIilcIn19LGJsdXI6ZnVuY3Rpb24oYSxiLGMpe3N3aXRjaChhKXtjYXNlXCJuYW1lXCI6cmV0dXJuIHkuU3RhdGUuaXNGaXJlZm94P1wiZmlsdGVyXCI6XCItd2Via2l0LWZpbHRlclwiO2Nhc2VcImV4dHJhY3RcIjp2YXIgZD1wYXJzZUZsb2F0KGMpO2lmKCFkJiYwIT09ZCl7dmFyIGU9Yy50b1N0cmluZygpLm1hdGNoKC9ibHVyXFwoKFswLTldK1tBLXpdKylcXCkvaSk7ZD1lP2VbMV06MH1yZXR1cm4gZDtjYXNlXCJpbmplY3RcIjpyZXR1cm4gcGFyc2VGbG9hdChjKT9cImJsdXIoXCIrYytcIilcIjpcIm5vbmVcIn19LG9wYWNpdHk6ZnVuY3Rpb24oYSxiLGMpe2lmKHA8PTgpc3dpdGNoKGEpe2Nhc2VcIm5hbWVcIjpyZXR1cm5cImZpbHRlclwiO2Nhc2VcImV4dHJhY3RcIjp2YXIgZD1jLnRvU3RyaW5nKCkubWF0Y2goL2FscGhhXFwob3BhY2l0eT0oLiopXFwpL2kpO3JldHVybiBjPWQ/ZFsxXS8xMDA6MTtjYXNlXCJpbmplY3RcIjpyZXR1cm4gYi5zdHlsZS56b29tPTEscGFyc2VGbG9hdChjKT49MT9cIlwiOlwiYWxwaGEob3BhY2l0eT1cIitwYXJzZUludCgxMDAqcGFyc2VGbG9hdChjKSwxMCkrXCIpXCJ9ZWxzZSBzd2l0Y2goYSl7Y2FzZVwibmFtZVwiOnJldHVyblwib3BhY2l0eVwiO2Nhc2VcImV4dHJhY3RcIjpyZXR1cm4gYztjYXNlXCJpbmplY3RcIjpyZXR1cm4gY319fSxyZWdpc3RlcjpmdW5jdGlvbigpe2Z1bmN0aW9uIGEoYSxiLGMpe2lmKFwiYm9yZGVyLWJveFwiPT09QS5nZXRQcm9wZXJ0eVZhbHVlKGIsXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpPT09KGN8fCExKSl7dmFyIGQsZSxmPTAsZz1cIndpZHRoXCI9PT1hP1tcIkxlZnRcIixcIlJpZ2h0XCJdOltcIlRvcFwiLFwiQm90dG9tXCJdLGg9W1wicGFkZGluZ1wiK2dbMF0sXCJwYWRkaW5nXCIrZ1sxXSxcImJvcmRlclwiK2dbMF0rXCJXaWR0aFwiLFwiYm9yZGVyXCIrZ1sxXStcIldpZHRoXCJdO2ZvcihkPTA7ZDxoLmxlbmd0aDtkKyspZT1wYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShiLGhbZF0pKSxpc05hTihlKXx8KGYrPWUpO3JldHVybiBjPy1mOmZ9cmV0dXJuIDB9ZnVuY3Rpb24gYihiLGMpe3JldHVybiBmdW5jdGlvbihkLGUsZil7c3dpdGNoKGQpe2Nhc2VcIm5hbWVcIjpyZXR1cm4gYjtjYXNlXCJleHRyYWN0XCI6cmV0dXJuIHBhcnNlRmxvYXQoZikrYShiLGUsYyk7Y2FzZVwiaW5qZWN0XCI6cmV0dXJuIHBhcnNlRmxvYXQoZiktYShiLGUsYykrXCJweFwifX19cCYmIShwPjkpfHx5LlN0YXRlLmlzR2luZ2VyYnJlYWR8fChBLkxpc3RzLnRyYW5zZm9ybXNCYXNlPUEuTGlzdHMudHJhbnNmb3Jtc0Jhc2UuY29uY2F0KEEuTGlzdHMudHJhbnNmb3JtczNEKSk7Zm9yKHZhciBjPTA7YzxBLkxpc3RzLnRyYW5zZm9ybXNCYXNlLmxlbmd0aDtjKyspIWZ1bmN0aW9uKCl7dmFyIGE9QS5MaXN0cy50cmFuc2Zvcm1zQmFzZVtjXTtBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbYV09ZnVuY3Rpb24oYixjLGUpe3N3aXRjaChiKXtjYXNlXCJuYW1lXCI6cmV0dXJuXCJ0cmFuc2Zvcm1cIjtjYXNlXCJleHRyYWN0XCI6cmV0dXJuIGcoYyk9PT1kfHxnKGMpLnRyYW5zZm9ybUNhY2hlW2FdPT09ZD8vXnNjYWxlL2kudGVzdChhKT8xOjA6ZyhjKS50cmFuc2Zvcm1DYWNoZVthXS5yZXBsYWNlKC9bKCldL2csXCJcIik7Y2FzZVwiaW5qZWN0XCI6dmFyIGY9ITE7c3dpdGNoKGEuc3Vic3RyKDAsYS5sZW5ndGgtMSkpe2Nhc2VcInRyYW5zbGF0ZVwiOmY9IS8oJXxweHxlbXxyZW18dnd8dmh8XFxkKSQvaS50ZXN0KGUpO2JyZWFrO2Nhc2VcInNjYWxcIjpjYXNlXCJzY2FsZVwiOnkuU3RhdGUuaXNBbmRyb2lkJiZnKGMpLnRyYW5zZm9ybUNhY2hlW2FdPT09ZCYmZTwxJiYoZT0xKSxmPSEvKFxcZCkkL2kudGVzdChlKTticmVhaztjYXNlXCJza2V3XCI6Zj0hLyhkZWd8XFxkKSQvaS50ZXN0KGUpO2JyZWFrO2Nhc2VcInJvdGF0ZVwiOmY9IS8oZGVnfFxcZCkkL2kudGVzdChlKX1yZXR1cm4gZnx8KGcoYykudHJhbnNmb3JtQ2FjaGVbYV09XCIoXCIrZStcIilcIiksZyhjKS50cmFuc2Zvcm1DYWNoZVthXX19fSgpO2Zvcih2YXIgZT0wO2U8QS5MaXN0cy5jb2xvcnMubGVuZ3RoO2UrKykhZnVuY3Rpb24oKXt2YXIgYT1BLkxpc3RzLmNvbG9yc1tlXTtBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbYV09ZnVuY3Rpb24oYixjLGUpe3N3aXRjaChiKXtjYXNlXCJuYW1lXCI6cmV0dXJuIGE7Y2FzZVwiZXh0cmFjdFwiOnZhciBmO2lmKEEuUmVnRXgud3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZC50ZXN0KGUpKWY9ZTtlbHNle3ZhciBnLGg9e2JsYWNrOlwicmdiKDAsIDAsIDApXCIsYmx1ZTpcInJnYigwLCAwLCAyNTUpXCIsZ3JheTpcInJnYigxMjgsIDEyOCwgMTI4KVwiLGdyZWVuOlwicmdiKDAsIDEyOCwgMClcIixyZWQ6XCJyZ2IoMjU1LCAwLCAwKVwiLHdoaXRlOlwicmdiKDI1NSwgMjU1LCAyNTUpXCJ9Oy9eW0Etel0rJC9pLnRlc3QoZSk/Zz1oW2VdIT09ZD9oW2VdOmguYmxhY2s6QS5SZWdFeC5pc0hleC50ZXN0KGUpP2c9XCJyZ2IoXCIrQS5WYWx1ZXMuaGV4VG9SZ2IoZSkuam9pbihcIiBcIikrXCIpXCI6L15yZ2JhP1xcKC9pLnRlc3QoZSl8fChnPWguYmxhY2spLGY9KGd8fGUpLnRvU3RyaW5nKCkubWF0Y2goQS5SZWdFeC52YWx1ZVVud3JhcClbMV0ucmVwbGFjZSgvLChcXHMrKT8vZyxcIiBcIil9cmV0dXJuKCFwfHxwPjgpJiYzPT09Zi5zcGxpdChcIiBcIikubGVuZ3RoJiYoZis9XCIgMVwiKSxmO2Nhc2VcImluamVjdFwiOnJldHVybi9ecmdiLy50ZXN0KGUpP2U6KHA8PTg/ND09PWUuc3BsaXQoXCIgXCIpLmxlbmd0aCYmKGU9ZS5zcGxpdCgvXFxzKy8pLnNsaWNlKDAsMykuam9pbihcIiBcIikpOjM9PT1lLnNwbGl0KFwiIFwiKS5sZW5ndGgmJihlKz1cIiAxXCIpLChwPD04P1wicmdiXCI6XCJyZ2JhXCIpK1wiKFwiK2UucmVwbGFjZSgvXFxzKy9nLFwiLFwiKS5yZXBsYWNlKC9cXC4oXFxkKSsoPz0sKS9nLFwiXCIpK1wiKVwiKX19fSgpO0EuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5pbm5lcldpZHRoPWIoXCJ3aWR0aFwiLCEwKSxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQuaW5uZXJIZWlnaHQ9YihcImhlaWdodFwiLCEwKSxBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQub3V0ZXJXaWR0aD1iKFwid2lkdGhcIiksQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkLm91dGVySGVpZ2h0PWIoXCJoZWlnaHRcIil9fSxOYW1lczp7Y2FtZWxDYXNlOmZ1bmN0aW9uKGEpe3JldHVybiBhLnJlcGxhY2UoLy0oXFx3KS9nLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGIudG9VcHBlckNhc2UoKX0pfSxTVkdBdHRyaWJ1dGU6ZnVuY3Rpb24oYSl7dmFyIGI9XCJ3aWR0aHxoZWlnaHR8eHx5fGN4fGN5fHJ8cnh8cnl8eDF8eDJ8eTF8eTJcIjtyZXR1cm4ocHx8eS5TdGF0ZS5pc0FuZHJvaWQmJiF5LlN0YXRlLmlzQ2hyb21lKSYmKGIrPVwifHRyYW5zZm9ybVwiKSxuZXcgUmVnRXhwKFwiXihcIitiK1wiKSRcIixcImlcIikudGVzdChhKX0scHJlZml4Q2hlY2s6ZnVuY3Rpb24oYSl7aWYoeS5TdGF0ZS5wcmVmaXhNYXRjaGVzW2FdKXJldHVyblt5LlN0YXRlLnByZWZpeE1hdGNoZXNbYV0sITBdO2Zvcih2YXIgYj1bXCJcIixcIldlYmtpdFwiLFwiTW96XCIsXCJtc1wiLFwiT1wiXSxjPTAsZD1iLmxlbmd0aDtjPGQ7YysrKXt2YXIgZTtpZihlPTA9PT1jP2E6YltjXSthLnJlcGxhY2UoL15cXHcvLGZ1bmN0aW9uKGEpe3JldHVybiBhLnRvVXBwZXJDYXNlKCl9KSx1LmlzU3RyaW5nKHkuU3RhdGUucHJlZml4RWxlbWVudC5zdHlsZVtlXSkpcmV0dXJuIHkuU3RhdGUucHJlZml4TWF0Y2hlc1thXT1lLFtlLCEwXX1yZXR1cm5bYSwhMV19fSxWYWx1ZXM6e2hleFRvUmdiOmZ1bmN0aW9uKGEpe3ZhciBiLGM9L14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaTtyZXR1cm4gYT1hLnJlcGxhY2UoL14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaSxmdW5jdGlvbihhLGIsYyxkKXtyZXR1cm4gYitiK2MrYytkK2R9KSxiPWMuZXhlYyhhKSxiP1twYXJzZUludChiWzFdLDE2KSxwYXJzZUludChiWzJdLDE2KSxwYXJzZUludChiWzNdLDE2KV06WzAsMCwwXX0saXNDU1NOdWxsVmFsdWU6ZnVuY3Rpb24oYSl7cmV0dXJuIWF8fC9eKG5vbmV8YXV0b3x0cmFuc3BhcmVudHwocmdiYVxcKDAsID8wLCA/MCwgPzBcXCkpKSQvaS50ZXN0KGEpfSxnZXRVbml0VHlwZTpmdW5jdGlvbihhKXtyZXR1cm4vXihyb3RhdGV8c2tldykvaS50ZXN0KGEpP1wiZGVnXCI6LyheKHNjYWxlfHNjYWxlWHxzY2FsZVl8c2NhbGVafGFscGhhfGZsZXhHcm93fGZsZXhIZWlnaHR8ekluZGV4fGZvbnRXZWlnaHQpJCl8KChvcGFjaXR5fHJlZHxncmVlbnxibHVlfGFscGhhKSQpL2kudGVzdChhKT9cIlwiOlwicHhcIn0sZ2V0RGlzcGxheVR5cGU6ZnVuY3Rpb24oYSl7dmFyIGI9YSYmYS50YWdOYW1lLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtyZXR1cm4vXihifGJpZ3xpfHNtYWxsfHR0fGFiYnJ8YWNyb255bXxjaXRlfGNvZGV8ZGZufGVtfGtiZHxzdHJvbmd8c2FtcHx2YXJ8YXxiZG98YnJ8aW1nfG1hcHxvYmplY3R8cXxzY3JpcHR8c3BhbnxzdWJ8c3VwfGJ1dHRvbnxpbnB1dHxsYWJlbHxzZWxlY3R8dGV4dGFyZWEpJC9pLnRlc3QoYik/XCJpbmxpbmVcIjovXihsaSkkL2kudGVzdChiKT9cImxpc3QtaXRlbVwiOi9eKHRyKSQvaS50ZXN0KGIpP1widGFibGUtcm93XCI6L14odGFibGUpJC9pLnRlc3QoYik/XCJ0YWJsZVwiOi9eKHRib2R5KSQvaS50ZXN0KGIpP1widGFibGUtcm93LWdyb3VwXCI6XCJibG9ja1wifSxhZGRDbGFzczpmdW5jdGlvbihhLGIpe2lmKGEpaWYoYS5jbGFzc0xpc3QpYS5jbGFzc0xpc3QuYWRkKGIpO2Vsc2UgaWYodS5pc1N0cmluZyhhLmNsYXNzTmFtZSkpYS5jbGFzc05hbWUrPShhLmNsYXNzTmFtZS5sZW5ndGg/XCIgXCI6XCJcIikrYjtlbHNle3ZhciBjPWEuZ2V0QXR0cmlidXRlKHA8PTc/XCJjbGFzc05hbWVcIjpcImNsYXNzXCIpfHxcIlwiO2Euc2V0QXR0cmlidXRlKFwiY2xhc3NcIixjKyhjP1wiIFwiOlwiXCIpK2IpfX0scmVtb3ZlQ2xhc3M6ZnVuY3Rpb24oYSxiKXtpZihhKWlmKGEuY2xhc3NMaXN0KWEuY2xhc3NMaXN0LnJlbW92ZShiKTtlbHNlIGlmKHUuaXNTdHJpbmcoYS5jbGFzc05hbWUpKWEuY2xhc3NOYW1lPWEuY2xhc3NOYW1lLnRvU3RyaW5nKCkucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxcXHMpXCIrYi5zcGxpdChcIiBcIikuam9pbihcInxcIikrXCIoXFxcXHN8JClcIixcImdpXCIpLFwiIFwiKTtlbHNle3ZhciBjPWEuZ2V0QXR0cmlidXRlKHA8PTc/XCJjbGFzc05hbWVcIjpcImNsYXNzXCIpfHxcIlwiO2Euc2V0QXR0cmlidXRlKFwiY2xhc3NcIixjLnJlcGxhY2UobmV3IFJlZ0V4cChcIihefHMpXCIrYi5zcGxpdChcIiBcIikuam9pbihcInxcIikrXCIoc3wkKVwiLFwiZ2lcIiksXCIgXCIpKX19fSxnZXRQcm9wZXJ0eVZhbHVlOmZ1bmN0aW9uKGEsYyxlLGYpe2Z1bmN0aW9uIGgoYSxjKXt2YXIgZT0wO2lmKHA8PTgpZT1vLmNzcyhhLGMpO2Vsc2V7dmFyIGk9ITE7L14od2lkdGh8aGVpZ2h0KSQvLnRlc3QoYykmJjA9PT1BLmdldFByb3BlcnR5VmFsdWUoYSxcImRpc3BsYXlcIikmJihpPSEwLEEuc2V0UHJvcGVydHlWYWx1ZShhLFwiZGlzcGxheVwiLEEuVmFsdWVzLmdldERpc3BsYXlUeXBlKGEpKSk7dmFyIGo9ZnVuY3Rpb24oKXtpJiZBLnNldFByb3BlcnR5VmFsdWUoYSxcImRpc3BsYXlcIixcIm5vbmVcIil9O2lmKCFmKXtpZihcImhlaWdodFwiPT09YyYmXCJib3JkZXItYm94XCIhPT1BLmdldFByb3BlcnR5VmFsdWUoYSxcImJveFNpemluZ1wiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpe3ZhciBrPWEub2Zmc2V0SGVpZ2h0LShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm9yZGVyVG9wV2lkdGhcIikpfHwwKS0ocGFyc2VGbG9hdChBLmdldFByb3BlcnR5VmFsdWUoYSxcImJvcmRlckJvdHRvbVdpZHRoXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJwYWRkaW5nVG9wXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJwYWRkaW5nQm90dG9tXCIpKXx8MCk7cmV0dXJuIGooKSxrfWlmKFwid2lkdGhcIj09PWMmJlwiYm9yZGVyLWJveFwiIT09QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKXt2YXIgbD1hLm9mZnNldFdpZHRoLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwiYm9yZGVyTGVmdFdpZHRoXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJib3JkZXJSaWdodFdpZHRoXCIpKXx8MCktKHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJwYWRkaW5nTGVmdFwiKSl8fDApLShwYXJzZUZsb2F0KEEuZ2V0UHJvcGVydHlWYWx1ZShhLFwicGFkZGluZ1JpZ2h0XCIpKXx8MCk7cmV0dXJuIGooKSxsfX12YXIgbTttPWcoYSk9PT1kP2IuZ2V0Q29tcHV0ZWRTdHlsZShhLG51bGwpOmcoYSkuY29tcHV0ZWRTdHlsZT9nKGEpLmNvbXB1dGVkU3R5bGU6ZyhhKS5jb21wdXRlZFN0eWxlPWIuZ2V0Q29tcHV0ZWRTdHlsZShhLG51bGwpLFwiYm9yZGVyQ29sb3JcIj09PWMmJihjPVwiYm9yZGVyVG9wQ29sb3JcIiksZT05PT09cCYmXCJmaWx0ZXJcIj09PWM/bS5nZXRQcm9wZXJ0eVZhbHVlKGMpOm1bY10sXCJcIiE9PWUmJm51bGwhPT1lfHwoZT1hLnN0eWxlW2NdKSxqKCl9aWYoXCJhdXRvXCI9PT1lJiYvXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC9pLnRlc3QoYykpe3ZhciBuPWgoYSxcInBvc2l0aW9uXCIpOyhcImZpeGVkXCI9PT1ufHxcImFic29sdXRlXCI9PT1uJiYvdG9wfGxlZnQvaS50ZXN0KGMpKSYmKGU9byhhKS5wb3NpdGlvbigpW2NdK1wicHhcIil9cmV0dXJuIGV9dmFyIGk7aWYoQS5Ib29rcy5yZWdpc3RlcmVkW2NdKXt2YXIgaj1jLGs9QS5Ib29rcy5nZXRSb290KGopO2U9PT1kJiYoZT1BLmdldFByb3BlcnR5VmFsdWUoYSxBLk5hbWVzLnByZWZpeENoZWNrKGspWzBdKSksQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2tdJiYoZT1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRba10oXCJleHRyYWN0XCIsYSxlKSksaT1BLkhvb2tzLmV4dHJhY3RWYWx1ZShqLGUpfWVsc2UgaWYoQS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKXt2YXIgbCxtO2w9QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwibmFtZVwiLGEpLFwidHJhbnNmb3JtXCIhPT1sJiYobT1oKGEsQS5OYW1lcy5wcmVmaXhDaGVjayhsKVswXSksQS5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUobSkmJkEuSG9va3MudGVtcGxhdGVzW2NdJiYobT1BLkhvb2tzLnRlbXBsYXRlc1tjXVsxXSkpLGk9QS5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NdKFwiZXh0cmFjdFwiLGEsbSl9aWYoIS9eW1xcZC1dLy50ZXN0KGkpKXt2YXIgbj1nKGEpO2lmKG4mJm4uaXNTVkcmJkEuTmFtZXMuU1ZHQXR0cmlidXRlKGMpKWlmKC9eKGhlaWdodHx3aWR0aCkkL2kudGVzdChjKSl0cnl7aT1hLmdldEJCb3goKVtjXX1jYXRjaChxKXtpPTB9ZWxzZSBpPWEuZ2V0QXR0cmlidXRlKGMpO2Vsc2UgaT1oKGEsQS5OYW1lcy5wcmVmaXhDaGVjayhjKVswXSl9cmV0dXJuIEEuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKGkpJiYoaT0wKSx5LmRlYnVnPj0yJiZjb25zb2xlLmxvZyhcIkdldCBcIitjK1wiOiBcIitpKSxpfSxzZXRQcm9wZXJ0eVZhbHVlOmZ1bmN0aW9uKGEsYyxkLGUsZil7dmFyIGg9YztpZihcInNjcm9sbFwiPT09YylmLmNvbnRhaW5lcj9mLmNvbnRhaW5lcltcInNjcm9sbFwiK2YuZGlyZWN0aW9uXT1kOlwiTGVmdFwiPT09Zi5kaXJlY3Rpb24/Yi5zY3JvbGxUbyhkLGYuYWx0ZXJuYXRlVmFsdWUpOmIuc2Nyb2xsVG8oZi5hbHRlcm5hdGVWYWx1ZSxkKTtlbHNlIGlmKEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXSYmXCJ0cmFuc2Zvcm1cIj09PUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcIm5hbWVcIixhKSlBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJpbmplY3RcIixhLGQpLGg9XCJ0cmFuc2Zvcm1cIixkPWcoYSkudHJhbnNmb3JtQ2FjaGVbY107ZWxzZXtpZihBLkhvb2tzLnJlZ2lzdGVyZWRbY10pe3ZhciBpPWMsaj1BLkhvb2tzLmdldFJvb3QoYyk7ZT1lfHxBLmdldFByb3BlcnR5VmFsdWUoYSxqKSxkPUEuSG9va3MuaW5qZWN0VmFsdWUoaSxkLGUpLGM9an1pZihBLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10mJihkPUEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjXShcImluamVjdFwiLGEsZCksYz1BLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY10oXCJuYW1lXCIsYSkpLGg9QS5OYW1lcy5wcmVmaXhDaGVjayhjKVswXSxwPD04KXRyeXthLnN0eWxlW2hdPWR9Y2F0Y2gobCl7eS5kZWJ1ZyYmY29uc29sZS5sb2coXCJCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgW1wiK2QrXCJdIGZvciBbXCIraCtcIl1cIil9ZWxzZXt2YXIgaz1nKGEpO2smJmsuaXNTVkcmJkEuTmFtZXMuU1ZHQXR0cmlidXRlKGMpP2Euc2V0QXR0cmlidXRlKGMsZCk6YS5zdHlsZVtoXT1kfXkuZGVidWc+PTImJmNvbnNvbGUubG9nKFwiU2V0IFwiK2MrXCIgKFwiK2grXCIpOiBcIitkKX1yZXR1cm5baCxkXX0sZmx1c2hUcmFuc2Zvcm1DYWNoZTpmdW5jdGlvbihhKXt2YXIgYj1cIlwiLGM9ZyhhKTtpZigocHx8eS5TdGF0ZS5pc0FuZHJvaWQmJiF5LlN0YXRlLmlzQ2hyb21lKSYmYyYmYy5pc1NWRyl7dmFyIGQ9ZnVuY3Rpb24oYil7cmV0dXJuIHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGEsYikpfSxlPXt0cmFuc2xhdGU6W2QoXCJ0cmFuc2xhdGVYXCIpLGQoXCJ0cmFuc2xhdGVZXCIpXSxza2V3WDpbZChcInNrZXdYXCIpXSxza2V3WTpbZChcInNrZXdZXCIpXSxzY2FsZToxIT09ZChcInNjYWxlXCIpP1tkKFwic2NhbGVcIiksZChcInNjYWxlXCIpXTpbZChcInNjYWxlWFwiKSxkKFwic2NhbGVZXCIpXSxyb3RhdGU6W2QoXCJyb3RhdGVaXCIpLDAsMF19O28uZWFjaChnKGEpLnRyYW5zZm9ybUNhY2hlLGZ1bmN0aW9uKGEpey9edHJhbnNsYXRlL2kudGVzdChhKT9hPVwidHJhbnNsYXRlXCI6L15zY2FsZS9pLnRlc3QoYSk/YT1cInNjYWxlXCI6L15yb3RhdGUvaS50ZXN0KGEpJiYoYT1cInJvdGF0ZVwiKSxlW2FdJiYoYis9YStcIihcIitlW2FdLmpvaW4oXCIgXCIpK1wiKSBcIixkZWxldGUgZVthXSl9KX1lbHNle3ZhciBmLGg7by5lYWNoKGcoYSkudHJhbnNmb3JtQ2FjaGUsZnVuY3Rpb24oYyl7aWYoZj1nKGEpLnRyYW5zZm9ybUNhY2hlW2NdLFwidHJhbnNmb3JtUGVyc3BlY3RpdmVcIj09PWMpcmV0dXJuIGg9ZiwhMDs5PT09cCYmXCJyb3RhdGVaXCI9PT1jJiYoYz1cInJvdGF0ZVwiKSxiKz1jK2YrXCIgXCJ9KSxoJiYoYj1cInBlcnNwZWN0aXZlXCIraCtcIiBcIitiKX1BLnNldFByb3BlcnR5VmFsdWUoYSxcInRyYW5zZm9ybVwiLGIpfX07QS5Ib29rcy5yZWdpc3RlcigpLEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXIoKSx5Lmhvb2s9ZnVuY3Rpb24oYSxiLGMpe3ZhciBlO3JldHVybiBhPWYoYSksby5lYWNoKGEsZnVuY3Rpb24oYSxmKXtpZihnKGYpPT09ZCYmeS5pbml0KGYpLGM9PT1kKWU9PT1kJiYoZT1BLmdldFByb3BlcnR5VmFsdWUoZixiKSk7ZWxzZXt2YXIgaD1BLnNldFByb3BlcnR5VmFsdWUoZixiLGMpO1widHJhbnNmb3JtXCI9PT1oWzBdJiZ5LkNTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKGYpLGU9aH19KSxlfTt2YXIgQj1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoKXtyZXR1cm4gaz96LnByb21pc2V8fG51bGw6cH1mdW5jdGlvbiBlKGEsZSl7ZnVuY3Rpb24gZihmKXt2YXIgayxuO2lmKGkuYmVnaW4mJjA9PT1EKXRyeXtpLmJlZ2luLmNhbGwocixyKX1jYXRjaChWKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhyb3cgVn0sMSl9aWYoXCJzY3JvbGxcIj09PUcpe3ZhciBwLHEsdyx4PS9eeCQvaS50ZXN0KGkuYXhpcyk/XCJMZWZ0XCI6XCJUb3BcIixCPXBhcnNlRmxvYXQoaS5vZmZzZXQpfHwwO2kuY29udGFpbmVyP3UuaXNXcmFwcGVkKGkuY29udGFpbmVyKXx8dS5pc05vZGUoaS5jb250YWluZXIpPyhpLmNvbnRhaW5lcj1pLmNvbnRhaW5lclswXXx8aS5jb250YWluZXIscD1pLmNvbnRhaW5lcltcInNjcm9sbFwiK3hdLHc9cCtvKGEpLnBvc2l0aW9uKClbeC50b0xvd2VyQ2FzZSgpXStCKTppLmNvbnRhaW5lcj1udWxsOihwPXkuU3RhdGUuc2Nyb2xsQW5jaG9yW3kuU3RhdGVbXCJzY3JvbGxQcm9wZXJ0eVwiK3hdXSxxPXkuU3RhdGUuc2Nyb2xsQW5jaG9yW3kuU3RhdGVbXCJzY3JvbGxQcm9wZXJ0eVwiKyhcIkxlZnRcIj09PXg/XCJUb3BcIjpcIkxlZnRcIildXSx3PW8oYSkub2Zmc2V0KClbeC50b0xvd2VyQ2FzZSgpXStCKSxqPXtzY3JvbGw6e3Jvb3RQcm9wZXJ0eVZhbHVlOiExLHN0YXJ0VmFsdWU6cCxjdXJyZW50VmFsdWU6cCxlbmRWYWx1ZTp3LHVuaXRUeXBlOlwiXCIsZWFzaW5nOmkuZWFzaW5nLHNjcm9sbERhdGE6e2NvbnRhaW5lcjppLmNvbnRhaW5lcixkaXJlY3Rpb246eCxhbHRlcm5hdGVWYWx1ZTpxfX0sZWxlbWVudDphfSx5LmRlYnVnJiZjb25zb2xlLmxvZyhcInR3ZWVuc0NvbnRhaW5lciAoc2Nyb2xsKTogXCIsai5zY3JvbGwsYSl9ZWxzZSBpZihcInJldmVyc2VcIj09PUcpe2lmKCEoaz1nKGEpKSlyZXR1cm47aWYoIWsudHdlZW5zQ29udGFpbmVyKXJldHVybiB2b2lkIG8uZGVxdWV1ZShhLGkucXVldWUpO1wibm9uZVwiPT09ay5vcHRzLmRpc3BsYXkmJihrLm9wdHMuZGlzcGxheT1cImF1dG9cIiksXCJoaWRkZW5cIj09PWsub3B0cy52aXNpYmlsaXR5JiYoay5vcHRzLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCIpLGsub3B0cy5sb29wPSExLGsub3B0cy5iZWdpbj1udWxsLGsub3B0cy5jb21wbGV0ZT1udWxsLHYuZWFzaW5nfHxkZWxldGUgaS5lYXNpbmcsdi5kdXJhdGlvbnx8ZGVsZXRlIGkuZHVyYXRpb24saT1vLmV4dGVuZCh7fSxrLm9wdHMsaSksbj1vLmV4dGVuZCghMCx7fSxrP2sudHdlZW5zQ29udGFpbmVyOm51bGwpO2Zvcih2YXIgRSBpbiBuKWlmKG4uaGFzT3duUHJvcGVydHkoRSkmJlwiZWxlbWVudFwiIT09RSl7dmFyIEY9bltFXS5zdGFydFZhbHVlO25bRV0uc3RhcnRWYWx1ZT1uW0VdLmN1cnJlbnRWYWx1ZT1uW0VdLmVuZFZhbHVlLG5bRV0uZW5kVmFsdWU9Rix1LmlzRW1wdHlPYmplY3Qodil8fChuW0VdLmVhc2luZz1pLmVhc2luZykseS5kZWJ1ZyYmY29uc29sZS5sb2coXCJyZXZlcnNlIHR3ZWVuc0NvbnRhaW5lciAoXCIrRStcIik6IFwiK0pTT04uc3RyaW5naWZ5KG5bRV0pLGEpfWo9bn1lbHNlIGlmKFwic3RhcnRcIj09PUcpe2s9ZyhhKSxrJiZrLnR3ZWVuc0NvbnRhaW5lciYmay5pc0FuaW1hdGluZz09PSEwJiYobj1rLnR3ZWVuc0NvbnRhaW5lcik7dmFyIEg9ZnVuY3Rpb24oZSxmKXt2YXIgZyxsPUEuSG9va3MuZ2V0Um9vdChlKSxtPSExLHA9ZlswXSxxPWZbMV0scj1mWzJdXG47aWYoIShrJiZrLmlzU1ZHfHxcInR3ZWVuXCI9PT1sfHxBLk5hbWVzLnByZWZpeENoZWNrKGwpWzFdIT09ITF8fEEuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtsXSE9PWQpKXJldHVybiB2b2lkKHkuZGVidWcmJmNvbnNvbGUubG9nKFwiU2tpcHBpbmcgW1wiK2wrXCJdIGR1ZSB0byBhIGxhY2sgb2YgYnJvd3NlciBzdXBwb3J0LlwiKSk7KGkuZGlzcGxheSE9PWQmJm51bGwhPT1pLmRpc3BsYXkmJlwibm9uZVwiIT09aS5kaXNwbGF5fHxpLnZpc2liaWxpdHkhPT1kJiZcImhpZGRlblwiIT09aS52aXNpYmlsaXR5KSYmL29wYWNpdHl8ZmlsdGVyLy50ZXN0KGUpJiYhciYmMCE9PXAmJihyPTApLGkuX2NhY2hlVmFsdWVzJiZuJiZuW2VdPyhyPT09ZCYmKHI9bltlXS5lbmRWYWx1ZStuW2VdLnVuaXRUeXBlKSxtPWsucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtsXSk6QS5Ib29rcy5yZWdpc3RlcmVkW2VdP3I9PT1kPyhtPUEuZ2V0UHJvcGVydHlWYWx1ZShhLGwpLHI9QS5nZXRQcm9wZXJ0eVZhbHVlKGEsZSxtKSk6bT1BLkhvb2tzLnRlbXBsYXRlc1tsXVsxXTpyPT09ZCYmKHI9QS5nZXRQcm9wZXJ0eVZhbHVlKGEsZSkpO3ZhciBzLHQsdix3PSExLHg9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkO3JldHVybiBkPShifHxcIjBcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1slQS16XSskLyxmdW5jdGlvbihhKXtyZXR1cm4gYz1hLFwiXCJ9KSxjfHwoYz1BLlZhbHVlcy5nZXRVbml0VHlwZShhKSksW2QsY119O2lmKHIhPT1wJiZ1LmlzU3RyaW5nKHIpJiZ1LmlzU3RyaW5nKHApKXtnPVwiXCI7dmFyIHo9MCxCPTAsQz1bXSxEPVtdLEU9MCxGPTAsRz0wO2ZvcihyPUEuSG9va3MuZml4Q29sb3JzKHIpLHA9QS5Ib29rcy5maXhDb2xvcnMocCk7ejxyLmxlbmd0aCYmQjxwLmxlbmd0aDspe3ZhciBIPXJbel0sST1wW0JdO2lmKC9bXFxkXFwuLV0vLnRlc3QoSCkmJi9bXFxkXFwuLV0vLnRlc3QoSSkpe2Zvcih2YXIgSj1ILEs9SSxMPVwiLlwiLE49XCIuXCI7Kyt6PHIubGVuZ3RoOyl7aWYoKEg9clt6XSk9PT1MKUw9XCIuLlwiO2Vsc2UgaWYoIS9cXGQvLnRlc3QoSCkpYnJlYWs7Sis9SH1mb3IoOysrQjxwLmxlbmd0aDspe2lmKChJPXBbQl0pPT09TilOPVwiLi5cIjtlbHNlIGlmKCEvXFxkLy50ZXN0KEkpKWJyZWFrO0srPUl9dmFyIE89QS5Ib29rcy5nZXRVbml0KHIseiksUD1BLkhvb2tzLmdldFVuaXQocCxCKTtpZih6Kz1PLmxlbmd0aCxCKz1QLmxlbmd0aCxPPT09UClKPT09Sz9nKz1KK086KGcrPVwie1wiK0MubGVuZ3RoKyhGP1wiIVwiOlwiXCIpK1wifVwiK08sQy5wdXNoKHBhcnNlRmxvYXQoSikpLEQucHVzaChwYXJzZUZsb2F0KEspKSk7ZWxzZXt2YXIgUT1wYXJzZUZsb2F0KEopLFI9cGFyc2VGbG9hdChLKTtnKz0oRTw1P1wiY2FsY1wiOlwiXCIpK1wiKFwiKyhRP1wie1wiK0MubGVuZ3RoKyhGP1wiIVwiOlwiXCIpK1wifVwiOlwiMFwiKStPK1wiICsgXCIrKFI/XCJ7XCIrKEMubGVuZ3RoKyhRPzE6MCkpKyhGP1wiIVwiOlwiXCIpK1wifVwiOlwiMFwiKStQK1wiKVwiLFEmJihDLnB1c2goUSksRC5wdXNoKDApKSxSJiYoQy5wdXNoKDApLEQucHVzaChSKSl9fWVsc2V7aWYoSCE9PUkpe0U9MDticmVha31nKz1ILHorKyxCKyssMD09PUUmJlwiY1wiPT09SHx8MT09PUUmJlwiYVwiPT09SHx8Mj09PUUmJlwibFwiPT09SHx8Mz09PUUmJlwiY1wiPT09SHx8RT49NCYmXCIoXCI9PT1IP0UrKzooRSYmRTw1fHxFPj00JiZcIilcIj09PUgmJi0tRTw1KSYmKEU9MCksMD09PUYmJlwiclwiPT09SHx8MT09PUYmJlwiZ1wiPT09SHx8Mj09PUYmJlwiYlwiPT09SHx8Mz09PUYmJlwiYVwiPT09SHx8Rj49MyYmXCIoXCI9PT1IPygzPT09RiYmXCJhXCI9PT1IJiYoRz0xKSxGKyspOkcmJlwiLFwiPT09SD8rK0c+MyYmKEY9Rz0wKTooRyYmRjwoRz81OjQpfHxGPj0oRz80OjMpJiZcIilcIj09PUgmJi0tRjwoRz81OjQpKSYmKEY9Rz0wKX19ej09PXIubGVuZ3RoJiZCPT09cC5sZW5ndGh8fCh5LmRlYnVnJiZjb25zb2xlLmVycm9yKCdUcnlpbmcgdG8gcGF0dGVybiBtYXRjaCBtaXMtbWF0Y2hlZCBzdHJpbmdzIFtcIicrcCsnXCIsIFwiJytyKydcIl0nKSxnPWQpLGcmJihDLmxlbmd0aD8oeS5kZWJ1ZyYmY29uc29sZS5sb2coJ1BhdHRlcm4gZm91bmQgXCInK2crJ1wiIC0+ICcsQyxELFwiW1wiK3IrXCIsXCIrcCtcIl1cIikscj1DLHA9RCx0PXY9XCJcIik6Zz1kKX1nfHwocz14KGUscikscj1zWzBdLHY9c1sxXSxzPXgoZSxwKSxwPXNbMF0ucmVwbGFjZSgvXihbKy1cXC8qXSk9LyxmdW5jdGlvbihhLGIpe3JldHVybiB3PWIsXCJcIn0pLHQ9c1sxXSxyPXBhcnNlRmxvYXQocil8fDAscD1wYXJzZUZsb2F0KHApfHwwLFwiJVwiPT09dCYmKC9eKGZvbnRTaXplfGxpbmVIZWlnaHQpJC8udGVzdChlKT8ocC89MTAwLHQ9XCJlbVwiKTovXnNjYWxlLy50ZXN0KGUpPyhwLz0xMDAsdD1cIlwiKTovKFJlZHxHcmVlbnxCbHVlKSQvaS50ZXN0KGUpJiYocD1wLzEwMCoyNTUsdD1cIlwiKSkpO2lmKC9bXFwvKl0vLnRlc3QodykpdD12O2Vsc2UgaWYodiE9PXQmJjAhPT1yKWlmKDA9PT1wKXQ9djtlbHNle2g9aHx8ZnVuY3Rpb24oKXt2YXIgZD17bXlQYXJlbnQ6YS5wYXJlbnROb2RlfHxjLmJvZHkscG9zaXRpb246QS5nZXRQcm9wZXJ0eVZhbHVlKGEsXCJwb3NpdGlvblwiKSxmb250U2l6ZTpBLmdldFByb3BlcnR5VmFsdWUoYSxcImZvbnRTaXplXCIpfSxlPWQucG9zaXRpb249PT1NLmxhc3RQb3NpdGlvbiYmZC5teVBhcmVudD09PU0ubGFzdFBhcmVudCxmPWQuZm9udFNpemU9PT1NLmxhc3RGb250U2l6ZTtNLmxhc3RQYXJlbnQ9ZC5teVBhcmVudCxNLmxhc3RQb3NpdGlvbj1kLnBvc2l0aW9uLE0ubGFzdEZvbnRTaXplPWQuZm9udFNpemU7dmFyIGc9e307aWYoZiYmZSlnLmVtVG9QeD1NLmxhc3RFbVRvUHgsZy5wZXJjZW50VG9QeFdpZHRoPU0ubGFzdFBlcmNlbnRUb1B4V2lkdGgsZy5wZXJjZW50VG9QeEhlaWdodD1NLmxhc3RQZXJjZW50VG9QeEhlaWdodDtlbHNle3ZhciBoPWsmJmsuaXNTVkc/Yy5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwicmVjdFwiKTpjLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7eS5pbml0KGgpLGQubXlQYXJlbnQuYXBwZW5kQ2hpbGQoaCksby5lYWNoKFtcIm92ZXJmbG93XCIsXCJvdmVyZmxvd1hcIixcIm92ZXJmbG93WVwiXSxmdW5jdGlvbihhLGIpe3kuQ1NTLnNldFByb3BlcnR5VmFsdWUoaCxiLFwiaGlkZGVuXCIpfSkseS5DU1Muc2V0UHJvcGVydHlWYWx1ZShoLFwicG9zaXRpb25cIixkLnBvc2l0aW9uKSx5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsXCJmb250U2l6ZVwiLGQuZm9udFNpemUpLHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoaCxcImJveFNpemluZ1wiLFwiY29udGVudC1ib3hcIiksby5lYWNoKFtcIm1pbldpZHRoXCIsXCJtYXhXaWR0aFwiLFwid2lkdGhcIixcIm1pbkhlaWdodFwiLFwibWF4SGVpZ2h0XCIsXCJoZWlnaHRcIl0sZnVuY3Rpb24oYSxiKXt5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsYixcIjEwMCVcIil9KSx5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGgsXCJwYWRkaW5nTGVmdFwiLFwiMTAwZW1cIiksZy5wZXJjZW50VG9QeFdpZHRoPU0ubGFzdFBlcmNlbnRUb1B4V2lkdGg9KHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGgsXCJ3aWR0aFwiLG51bGwsITApKXx8MSkvMTAwLGcucGVyY2VudFRvUHhIZWlnaHQ9TS5sYXN0UGVyY2VudFRvUHhIZWlnaHQ9KHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGgsXCJoZWlnaHRcIixudWxsLCEwKSl8fDEpLzEwMCxnLmVtVG9QeD1NLmxhc3RFbVRvUHg9KHBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGgsXCJwYWRkaW5nTGVmdFwiKSl8fDEpLzEwMCxkLm15UGFyZW50LnJlbW92ZUNoaWxkKGgpfXJldHVybiBudWxsPT09TS5yZW1Ub1B4JiYoTS5yZW1Ub1B4PXBhcnNlRmxvYXQoQS5nZXRQcm9wZXJ0eVZhbHVlKGMuYm9keSxcImZvbnRTaXplXCIpKXx8MTYpLG51bGw9PT1NLnZ3VG9QeCYmKE0udndUb1B4PXBhcnNlRmxvYXQoYi5pbm5lcldpZHRoKS8xMDAsTS52aFRvUHg9cGFyc2VGbG9hdChiLmlubmVySGVpZ2h0KS8xMDApLGcucmVtVG9QeD1NLnJlbVRvUHgsZy52d1RvUHg9TS52d1RvUHgsZy52aFRvUHg9TS52aFRvUHgseS5kZWJ1Zz49MSYmY29uc29sZS5sb2coXCJVbml0IHJhdGlvczogXCIrSlNPTi5zdHJpbmdpZnkoZyksYSksZ30oKTt2YXIgUz0vbWFyZ2lufHBhZGRpbmd8bGVmdHxyaWdodHx3aWR0aHx0ZXh0fHdvcmR8bGV0dGVyL2kudGVzdChlKXx8L1gkLy50ZXN0KGUpfHxcInhcIj09PWU/XCJ4XCI6XCJ5XCI7c3dpdGNoKHYpe2Nhc2VcIiVcIjpyKj1cInhcIj09PVM/aC5wZXJjZW50VG9QeFdpZHRoOmgucGVyY2VudFRvUHhIZWlnaHQ7YnJlYWs7Y2FzZVwicHhcIjpicmVhaztkZWZhdWx0OnIqPWhbditcIlRvUHhcIl19c3dpdGNoKHQpe2Nhc2VcIiVcIjpyKj0xLyhcInhcIj09PVM/aC5wZXJjZW50VG9QeFdpZHRoOmgucGVyY2VudFRvUHhIZWlnaHQpO2JyZWFrO2Nhc2VcInB4XCI6YnJlYWs7ZGVmYXVsdDpyKj0xL2hbdCtcIlRvUHhcIl19fXN3aXRjaCh3KXtjYXNlXCIrXCI6cD1yK3A7YnJlYWs7Y2FzZVwiLVwiOnA9ci1wO2JyZWFrO2Nhc2VcIipcIjpwKj1yO2JyZWFrO2Nhc2VcIi9cIjpwPXIvcH1qW2VdPXtyb290UHJvcGVydHlWYWx1ZTptLHN0YXJ0VmFsdWU6cixjdXJyZW50VmFsdWU6cixlbmRWYWx1ZTpwLHVuaXRUeXBlOnQsZWFzaW5nOnF9LGcmJihqW2VdLnBhdHRlcm49ZykseS5kZWJ1ZyYmY29uc29sZS5sb2coXCJ0d2VlbnNDb250YWluZXIgKFwiK2UrXCIpOiBcIitKU09OLnN0cmluZ2lmeShqW2VdKSxhKX07Zm9yKHZhciBJIGluIHMpaWYocy5oYXNPd25Qcm9wZXJ0eShJKSl7dmFyIEo9QS5OYW1lcy5jYW1lbENhc2UoSSksSz1mdW5jdGlvbihiLGMpe3ZhciBkLGYsZztyZXR1cm4gdS5pc0Z1bmN0aW9uKGIpJiYoYj1iLmNhbGwoYSxlLEMpKSx1LmlzQXJyYXkoYik/KGQ9YlswXSwhdS5pc0FycmF5KGJbMV0pJiYvXltcXGQtXS8udGVzdChiWzFdKXx8dS5pc0Z1bmN0aW9uKGJbMV0pfHxBLlJlZ0V4LmlzSGV4LnRlc3QoYlsxXSk/Zz1iWzFdOnUuaXNTdHJpbmcoYlsxXSkmJiFBLlJlZ0V4LmlzSGV4LnRlc3QoYlsxXSkmJnkuRWFzaW5nc1tiWzFdXXx8dS5pc0FycmF5KGJbMV0pPyhmPWM/YlsxXTpsKGJbMV0saS5kdXJhdGlvbiksZz1iWzJdKTpnPWJbMV18fGJbMl0pOmQ9YixjfHwoZj1mfHxpLmVhc2luZyksdS5pc0Z1bmN0aW9uKGQpJiYoZD1kLmNhbGwoYSxlLEMpKSx1LmlzRnVuY3Rpb24oZykmJihnPWcuY2FsbChhLGUsQykpLFtkfHwwLGYsZ119KHNbSV0pO2lmKHQoQS5MaXN0cy5jb2xvcnMsSikpe3ZhciBMPUtbMF0sTz1LWzFdLFA9S1syXTtpZihBLlJlZ0V4LmlzSGV4LnRlc3QoTCkpe2Zvcih2YXIgUT1bXCJSZWRcIixcIkdyZWVuXCIsXCJCbHVlXCJdLFI9QS5WYWx1ZXMuaGV4VG9SZ2IoTCksUz1QP0EuVmFsdWVzLmhleFRvUmdiKFApOmQsVD0wO1Q8US5sZW5ndGg7VCsrKXt2YXIgVT1bUltUXV07TyYmVS5wdXNoKE8pLFMhPT1kJiZVLnB1c2goU1tUXSksSChKK1FbVF0sVSl9Y29udGludWV9fUgoSixLKX1qLmVsZW1lbnQ9YX1qLmVsZW1lbnQmJihBLlZhbHVlcy5hZGRDbGFzcyhhLFwidmVsb2NpdHktYW5pbWF0aW5nXCIpLE4ucHVzaChqKSxrPWcoYSksayYmKFwiXCI9PT1pLnF1ZXVlJiYoay50d2VlbnNDb250YWluZXI9aixrLm9wdHM9aSksay5pc0FuaW1hdGluZz0hMCksRD09PUMtMT8oeS5TdGF0ZS5jYWxscy5wdXNoKFtOLHIsaSxudWxsLHoucmVzb2x2ZXIsbnVsbCwwXSkseS5TdGF0ZS5pc1RpY2tpbmc9PT0hMSYmKHkuU3RhdGUuaXNUaWNraW5nPSEwLG0oKSkpOkQrKyl9dmFyIGgsaT1vLmV4dGVuZCh7fSx5LmRlZmF1bHRzLHYpLGo9e307c3dpdGNoKGcoYSk9PT1kJiZ5LmluaXQoYSkscGFyc2VGbG9hdChpLmRlbGF5KSYmaS5xdWV1ZSE9PSExJiZvLnF1ZXVlKGEsaS5xdWV1ZSxmdW5jdGlvbihiKXt5LnZlbG9jaXR5UXVldWVFbnRyeUZsYWc9ITA7dmFyIGM9eS5TdGF0ZS5kZWxheWVkRWxlbWVudHMuY291bnQrKzt5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1tjXT1hO3ZhciBkPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbigpe3kuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2FdPSExLGIoKX19KGMpO2coYSkuZGVsYXlCZWdpbj0obmV3IERhdGUpLmdldFRpbWUoKSxnKGEpLmRlbGF5PXBhcnNlRmxvYXQoaS5kZWxheSksZyhhKS5kZWxheVRpbWVyPXtzZXRUaW1lb3V0OnNldFRpbWVvdXQoYixwYXJzZUZsb2F0KGkuZGVsYXkpKSxuZXh0OmR9fSksaS5kdXJhdGlvbi50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpe2Nhc2VcImZhc3RcIjppLmR1cmF0aW9uPTIwMDticmVhaztjYXNlXCJub3JtYWxcIjppLmR1cmF0aW9uPXc7YnJlYWs7Y2FzZVwic2xvd1wiOmkuZHVyYXRpb249NjAwO2JyZWFrO2RlZmF1bHQ6aS5kdXJhdGlvbj1wYXJzZUZsb2F0KGkuZHVyYXRpb24pfHwxfWlmKHkubW9jayE9PSExJiYoeS5tb2NrPT09ITA/aS5kdXJhdGlvbj1pLmRlbGF5PTE6KGkuZHVyYXRpb24qPXBhcnNlRmxvYXQoeS5tb2NrKXx8MSxpLmRlbGF5Kj1wYXJzZUZsb2F0KHkubW9jayl8fDEpKSxpLmVhc2luZz1sKGkuZWFzaW5nLGkuZHVyYXRpb24pLGkuYmVnaW4mJiF1LmlzRnVuY3Rpb24oaS5iZWdpbikmJihpLmJlZ2luPW51bGwpLGkucHJvZ3Jlc3MmJiF1LmlzRnVuY3Rpb24oaS5wcm9ncmVzcykmJihpLnByb2dyZXNzPW51bGwpLGkuY29tcGxldGUmJiF1LmlzRnVuY3Rpb24oaS5jb21wbGV0ZSkmJihpLmNvbXBsZXRlPW51bGwpLGkuZGlzcGxheSE9PWQmJm51bGwhPT1pLmRpc3BsYXkmJihpLmRpc3BsYXk9aS5kaXNwbGF5LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSxcImF1dG9cIj09PWkuZGlzcGxheSYmKGkuZGlzcGxheT15LkNTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoYSkpKSxpLnZpc2liaWxpdHkhPT1kJiZudWxsIT09aS52aXNpYmlsaXR5JiYoaS52aXNpYmlsaXR5PWkudmlzaWJpbGl0eS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpLGkubW9iaWxlSEE9aS5tb2JpbGVIQSYmeS5TdGF0ZS5pc01vYmlsZSYmIXkuU3RhdGUuaXNHaW5nZXJicmVhZCxpLnF1ZXVlPT09ITEpaWYoaS5kZWxheSl7dmFyIGs9eS5TdGF0ZS5kZWxheWVkRWxlbWVudHMuY291bnQrKzt5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1trXT1hO3ZhciBuPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbigpe3kuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2FdPSExLGYoKX19KGspO2coYSkuZGVsYXlCZWdpbj0obmV3IERhdGUpLmdldFRpbWUoKSxnKGEpLmRlbGF5PXBhcnNlRmxvYXQoaS5kZWxheSksZyhhKS5kZWxheVRpbWVyPXtzZXRUaW1lb3V0OnNldFRpbWVvdXQoZixwYXJzZUZsb2F0KGkuZGVsYXkpKSxuZXh0Om59fWVsc2UgZigpO2Vsc2Ugby5xdWV1ZShhLGkucXVldWUsZnVuY3Rpb24oYSxiKXtpZihiPT09ITApcmV0dXJuIHoucHJvbWlzZSYmei5yZXNvbHZlcihyKSwhMDt5LnZlbG9jaXR5UXVldWVFbnRyeUZsYWc9ITAsZihhKX0pO1wiXCIhPT1pLnF1ZXVlJiZcImZ4XCIhPT1pLnF1ZXVlfHxcImlucHJvZ3Jlc3NcIj09PW8ucXVldWUoYSlbMF18fG8uZGVxdWV1ZShhKX12YXIgaixrLHAscSxyLHMsdix4PWFyZ3VtZW50c1swXSYmKGFyZ3VtZW50c1swXS5wfHxvLmlzUGxhaW5PYmplY3QoYXJndW1lbnRzWzBdLnByb3BlcnRpZXMpJiYhYXJndW1lbnRzWzBdLnByb3BlcnRpZXMubmFtZXN8fHUuaXNTdHJpbmcoYXJndW1lbnRzWzBdLnByb3BlcnRpZXMpKTt1LmlzV3JhcHBlZCh0aGlzKT8oaz0hMSxxPTAscj10aGlzLHA9dGhpcyk6KGs9ITAscT0xLHI9eD9hcmd1bWVudHNbMF0uZWxlbWVudHN8fGFyZ3VtZW50c1swXS5lOmFyZ3VtZW50c1swXSk7dmFyIHo9e3Byb21pc2U6bnVsbCxyZXNvbHZlcjpudWxsLHJlamVjdGVyOm51bGx9O2lmKGsmJnkuUHJvbWlzZSYmKHoucHJvbWlzZT1uZXcgeS5Qcm9taXNlKGZ1bmN0aW9uKGEsYil7ei5yZXNvbHZlcj1hLHoucmVqZWN0ZXI9Yn0pKSx4PyhzPWFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzfHxhcmd1bWVudHNbMF0ucCx2PWFyZ3VtZW50c1swXS5vcHRpb25zfHxhcmd1bWVudHNbMF0ubyk6KHM9YXJndW1lbnRzW3FdLHY9YXJndW1lbnRzW3ErMV0pLCEocj1mKHIpKSlyZXR1cm4gdm9pZCh6LnByb21pc2UmJihzJiZ2JiZ2LnByb21pc2VSZWplY3RFbXB0eT09PSExP3oucmVzb2x2ZXIoKTp6LnJlamVjdGVyKCkpKTt2YXIgQz1yLmxlbmd0aCxEPTA7aWYoIS9eKHN0b3B8ZmluaXNofGZpbmlzaEFsbHxwYXVzZXxyZXN1bWUpJC9pLnRlc3QocykmJiFvLmlzUGxhaW5PYmplY3Qodikpe3ZhciBFPXErMTt2PXt9O2Zvcih2YXIgRj1FO0Y8YXJndW1lbnRzLmxlbmd0aDtGKyspdS5pc0FycmF5KGFyZ3VtZW50c1tGXSl8fCEvXihmYXN0fG5vcm1hbHxzbG93KSQvaS50ZXN0KGFyZ3VtZW50c1tGXSkmJiEvXlxcZC8udGVzdChhcmd1bWVudHNbRl0pP3UuaXNTdHJpbmcoYXJndW1lbnRzW0ZdKXx8dS5pc0FycmF5KGFyZ3VtZW50c1tGXSk/di5lYXNpbmc9YXJndW1lbnRzW0ZdOnUuaXNGdW5jdGlvbihhcmd1bWVudHNbRl0pJiYodi5jb21wbGV0ZT1hcmd1bWVudHNbRl0pOnYuZHVyYXRpb249YXJndW1lbnRzW0ZdfXZhciBHO3N3aXRjaChzKXtjYXNlXCJzY3JvbGxcIjpHPVwic2Nyb2xsXCI7YnJlYWs7Y2FzZVwicmV2ZXJzZVwiOkc9XCJyZXZlcnNlXCI7YnJlYWs7Y2FzZVwicGF1c2VcIjp2YXIgSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gby5lYWNoKHIsZnVuY3Rpb24oYSxiKXtoKGIsSCl9KSxvLmVhY2goeS5TdGF0ZS5jYWxscyxmdW5jdGlvbihhLGIpe3ZhciBjPSExO2ImJm8uZWFjaChiWzFdLGZ1bmN0aW9uKGEsZSl7dmFyIGY9dj09PWQ/XCJcIjp2O3JldHVybiBmIT09ITAmJmJbMl0ucXVldWUhPT1mJiYodiE9PWR8fGJbMl0ucXVldWUhPT0hMSl8fChvLmVhY2gocixmdW5jdGlvbihhLGQpe2lmKGQ9PT1lKXJldHVybiBiWzVdPXtyZXN1bWU6ITF9LGM9ITAsITF9KSwhYyYmdm9pZCAwKX0pfSksYSgpO2Nhc2VcInJlc3VtZVwiOnJldHVybiBvLmVhY2gocixmdW5jdGlvbihhLGIpe2koYixIKX0pLG8uZWFjaCh5LlN0YXRlLmNhbGxzLGZ1bmN0aW9uKGEsYil7dmFyIGM9ITE7YiYmby5lYWNoKGJbMV0sZnVuY3Rpb24oYSxlKXt2YXIgZj12PT09ZD9cIlwiOnY7cmV0dXJuIGYhPT0hMCYmYlsyXS5xdWV1ZSE9PWYmJih2IT09ZHx8YlsyXS5xdWV1ZSE9PSExKXx8KCFiWzVdfHwoby5lYWNoKHIsZnVuY3Rpb24oYSxkKXtpZihkPT09ZSlyZXR1cm4gYls1XS5yZXN1bWU9ITAsYz0hMCwhMX0pLCFjJiZ2b2lkIDApKX0pfSksYSgpO2Nhc2VcImZpbmlzaFwiOmNhc2VcImZpbmlzaEFsbFwiOmNhc2VcInN0b3BcIjpvLmVhY2gocixmdW5jdGlvbihhLGIpe2coYikmJmcoYikuZGVsYXlUaW1lciYmKGNsZWFyVGltZW91dChnKGIpLmRlbGF5VGltZXIuc2V0VGltZW91dCksZyhiKS5kZWxheVRpbWVyLm5leHQmJmcoYikuZGVsYXlUaW1lci5uZXh0KCksZGVsZXRlIGcoYikuZGVsYXlUaW1lciksXCJmaW5pc2hBbGxcIiE9PXN8fHYhPT0hMCYmIXUuaXNTdHJpbmcodil8fChvLmVhY2goby5xdWV1ZShiLHUuaXNTdHJpbmcodik/djpcIlwiKSxmdW5jdGlvbihhLGIpe3UuaXNGdW5jdGlvbihiKSYmYigpfSksby5xdWV1ZShiLHUuaXNTdHJpbmcodik/djpcIlwiLFtdKSl9KTt2YXIgST1bXTtyZXR1cm4gby5lYWNoKHkuU3RhdGUuY2FsbHMsZnVuY3Rpb24oYSxiKXtiJiZvLmVhY2goYlsxXSxmdW5jdGlvbihjLGUpe3ZhciBmPXY9PT1kP1wiXCI6djtpZihmIT09ITAmJmJbMl0ucXVldWUhPT1mJiYodiE9PWR8fGJbMl0ucXVldWUhPT0hMSkpcmV0dXJuITA7by5lYWNoKHIsZnVuY3Rpb24oYyxkKXtpZihkPT09ZSlpZigodj09PSEwfHx1LmlzU3RyaW5nKHYpKSYmKG8uZWFjaChvLnF1ZXVlKGQsdS5pc1N0cmluZyh2KT92OlwiXCIpLGZ1bmN0aW9uKGEsYil7dS5pc0Z1bmN0aW9uKGIpJiZiKG51bGwsITApfSksby5xdWV1ZShkLHUuaXNTdHJpbmcodik/djpcIlwiLFtdKSksXCJzdG9wXCI9PT1zKXt2YXIgaD1nKGQpO2gmJmgudHdlZW5zQ29udGFpbmVyJiZmIT09ITEmJm8uZWFjaChoLnR3ZWVuc0NvbnRhaW5lcixmdW5jdGlvbihhLGIpe2IuZW5kVmFsdWU9Yi5jdXJyZW50VmFsdWV9KSxJLnB1c2goYSl9ZWxzZVwiZmluaXNoXCIhPT1zJiZcImZpbmlzaEFsbFwiIT09c3x8KGJbMl0uZHVyYXRpb249MSl9KX0pfSksXCJzdG9wXCI9PT1zJiYoby5lYWNoKEksZnVuY3Rpb24oYSxiKXtuKGIsITApfSksei5wcm9taXNlJiZ6LnJlc29sdmVyKHIpKSxhKCk7ZGVmYXVsdDppZighby5pc1BsYWluT2JqZWN0KHMpfHx1LmlzRW1wdHlPYmplY3Qocykpe2lmKHUuaXNTdHJpbmcocykmJnkuUmVkaXJlY3RzW3NdKXtqPW8uZXh0ZW5kKHt9LHYpO3ZhciBKPWouZHVyYXRpb24sSz1qLmRlbGF5fHwwO3JldHVybiBqLmJhY2t3YXJkcz09PSEwJiYocj1vLmV4dGVuZCghMCxbXSxyKS5yZXZlcnNlKCkpLG8uZWFjaChyLGZ1bmN0aW9uKGEsYil7cGFyc2VGbG9hdChqLnN0YWdnZXIpP2ouZGVsYXk9SytwYXJzZUZsb2F0KGouc3RhZ2dlcikqYTp1LmlzRnVuY3Rpb24oai5zdGFnZ2VyKSYmKGouZGVsYXk9SytqLnN0YWdnZXIuY2FsbChiLGEsQykpLGouZHJhZyYmKGouZHVyYXRpb249cGFyc2VGbG9hdChKKXx8KC9eKGNhbGxvdXR8dHJhbnNpdGlvbikvLnRlc3Qocyk/MWUzOncpLGouZHVyYXRpb249TWF0aC5tYXgoai5kdXJhdGlvbiooai5iYWNrd2FyZHM/MS1hL0M6KGErMSkvQyksLjc1KmouZHVyYXRpb24sMjAwKSkseS5SZWRpcmVjdHNbc10uY2FsbChiLGIsanx8e30sYSxDLHIsei5wcm9taXNlP3o6ZCl9KSxhKCl9dmFyIEw9XCJWZWxvY2l0eTogRmlyc3QgYXJndW1lbnQgKFwiK3MrXCIpIHdhcyBub3QgYSBwcm9wZXJ0eSBtYXAsIGEga25vd24gYWN0aW9uLCBvciBhIHJlZ2lzdGVyZWQgcmVkaXJlY3QuIEFib3J0aW5nLlwiO3JldHVybiB6LnByb21pc2U/ei5yZWplY3RlcihuZXcgRXJyb3IoTCkpOmIuY29uc29sZSYmY29uc29sZS5sb2coTCksYSgpfUc9XCJzdGFydFwifXZhciBNPXtsYXN0UGFyZW50Om51bGwsbGFzdFBvc2l0aW9uOm51bGwsbGFzdEZvbnRTaXplOm51bGwsbGFzdFBlcmNlbnRUb1B4V2lkdGg6bnVsbCxsYXN0UGVyY2VudFRvUHhIZWlnaHQ6bnVsbCxsYXN0RW1Ub1B4Om51bGwscmVtVG9QeDpudWxsLHZ3VG9QeDpudWxsLHZoVG9QeDpudWxsfSxOPVtdO28uZWFjaChyLGZ1bmN0aW9uKGEsYil7dS5pc05vZGUoYikmJmUoYixhKX0pLGo9by5leHRlbmQoe30seS5kZWZhdWx0cyx2KSxqLmxvb3A9cGFyc2VJbnQoai5sb29wLDEwKTt2YXIgTz0yKmoubG9vcC0xO2lmKGoubG9vcClmb3IodmFyIFA9MDtQPE87UCsrKXt2YXIgUT17ZGVsYXk6ai5kZWxheSxwcm9ncmVzczpqLnByb2dyZXNzfTtQPT09Ty0xJiYoUS5kaXNwbGF5PWouZGlzcGxheSxRLnZpc2liaWxpdHk9ai52aXNpYmlsaXR5LFEuY29tcGxldGU9ai5jb21wbGV0ZSksQihyLFwicmV2ZXJzZVwiLFEpfXJldHVybiBhKCl9O3k9by5leHRlbmQoQix5KSx5LmFuaW1hdGU9Qjt2YXIgQz1iLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8cTtpZigheS5TdGF0ZS5pc01vYmlsZSYmYy5oaWRkZW4hPT1kKXt2YXIgRD1mdW5jdGlvbigpe2MuaGlkZGVuPyhDPWZ1bmN0aW9uKGEpe3JldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YSghMCl9LDE2KX0sbSgpKTpDPWIucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxxfTtEKCksYy5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLEQpfXJldHVybiBhLlZlbG9jaXR5PXksYSE9PWImJihhLmZuLnZlbG9jaXR5PUIsYS5mbi52ZWxvY2l0eS5kZWZhdWx0cz15LmRlZmF1bHRzKSxvLmVhY2goW1wiRG93blwiLFwiVXBcIl0sZnVuY3Rpb24oYSxiKXt5LlJlZGlyZWN0c1tcInNsaWRlXCIrYl09ZnVuY3Rpb24oYSxjLGUsZixnLGgpe3ZhciBpPW8uZXh0ZW5kKHt9LGMpLGo9aS5iZWdpbixrPWkuY29tcGxldGUsbD17fSxtPXtoZWlnaHQ6XCJcIixtYXJnaW5Ub3A6XCJcIixtYXJnaW5Cb3R0b206XCJcIixwYWRkaW5nVG9wOlwiXCIscGFkZGluZ0JvdHRvbTpcIlwifTtpLmRpc3BsYXk9PT1kJiYoaS5kaXNwbGF5PVwiRG93blwiPT09Yj9cImlubGluZVwiPT09eS5DU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGEpP1wiaW5saW5lLWJsb2NrXCI6XCJibG9ja1wiOlwibm9uZVwiKSxpLmJlZ2luPWZ1bmN0aW9uKCl7MD09PWUmJmomJmouY2FsbChnLGcpO2Zvcih2YXIgYyBpbiBtKWlmKG0uaGFzT3duUHJvcGVydHkoYykpe2xbY109YS5zdHlsZVtjXTt2YXIgZD1BLmdldFByb3BlcnR5VmFsdWUoYSxjKTttW2NdPVwiRG93blwiPT09Yj9bZCwwXTpbMCxkXX1sLm92ZXJmbG93PWEuc3R5bGUub3ZlcmZsb3csYS5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwifSxpLmNvbXBsZXRlPWZ1bmN0aW9uKCl7Zm9yKHZhciBiIGluIGwpbC5oYXNPd25Qcm9wZXJ0eShiKSYmKGEuc3R5bGVbYl09bFtiXSk7ZT09PWYtMSYmKGsmJmsuY2FsbChnLGcpLGgmJmgucmVzb2x2ZXIoZykpfSx5KGEsbSxpKX19KSxvLmVhY2goW1wiSW5cIixcIk91dFwiXSxmdW5jdGlvbihhLGIpe3kuUmVkaXJlY3RzW1wiZmFkZVwiK2JdPWZ1bmN0aW9uKGEsYyxlLGYsZyxoKXt2YXIgaT1vLmV4dGVuZCh7fSxjKSxqPWkuY29tcGxldGUsaz17b3BhY2l0eTpcIkluXCI9PT1iPzE6MH07MCE9PWUmJihpLmJlZ2luPW51bGwpLGkuY29tcGxldGU9ZSE9PWYtMT9udWxsOmZ1bmN0aW9uKCl7aiYmai5jYWxsKGcsZyksaCYmaC5yZXNvbHZlcihnKX0saS5kaXNwbGF5PT09ZCYmKGkuZGlzcGxheT1cIkluXCI9PT1iP1wiYXV0b1wiOlwibm9uZVwiKSx5KHRoaXMsayxpKX19KSx5fSh3aW5kb3cualF1ZXJ5fHx3aW5kb3cuWmVwdG98fHdpbmRvdyx3aW5kb3csd2luZG93P3dpbmRvdy5kb2N1bWVudDp1bmRlZmluZWQpfSk7IiwiIWZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWEoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcInZlbG9jaXR5XCJdLGEpOmEoKX0oZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtyZXR1cm4gZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5WZWxvY2l0eTtpZighZXx8IWUuVXRpbGl0aWVzKXJldHVybiB2b2lkKGIuY29uc29sZSYmY29uc29sZS5sb2coXCJWZWxvY2l0eSBVSSBQYWNrOiBWZWxvY2l0eSBtdXN0IGJlIGxvYWRlZCBmaXJzdC4gQWJvcnRpbmcuXCIpKTt2YXIgZj1lLlV0aWxpdGllcyxnPWUudmVyc2lvbixoPXttYWpvcjoxLG1pbm9yOjEscGF0Y2g6MH07aWYoZnVuY3Rpb24oYSxiKXt2YXIgYz1bXTtyZXR1cm4hKCFhfHwhYikmJihmLmVhY2goW2EsYl0sZnVuY3Rpb24oYSxiKXt2YXIgZD1bXTtmLmVhY2goYixmdW5jdGlvbihhLGIpe2Zvcig7Yi50b1N0cmluZygpLmxlbmd0aDw1OyliPVwiMFwiK2I7ZC5wdXNoKGIpfSksYy5wdXNoKGQuam9pbihcIlwiKSl9KSxwYXJzZUZsb2F0KGNbMF0pPnBhcnNlRmxvYXQoY1sxXSkpfShoLGcpKXt2YXIgaT1cIlZlbG9jaXR5IFVJIFBhY2s6IFlvdSBuZWVkIHRvIHVwZGF0ZSBWZWxvY2l0eSAodmVsb2NpdHkuanMpIHRvIGEgbmV3ZXIgdmVyc2lvbi4gVmlzaXQgaHR0cDovL2dpdGh1Yi5jb20vanVsaWFuc2hhcGlyby92ZWxvY2l0eS5cIjt0aHJvdyBhbGVydChpKSxuZXcgRXJyb3IoaSl9ZS5SZWdpc3RlckVmZmVjdD1lLlJlZ2lzdGVyVUk9ZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBjKGEsYixjLGQpe3ZhciBnLGg9MDtmLmVhY2goYS5ub2RlVHlwZT9bYV06YSxmdW5jdGlvbihhLGIpe2QmJihjKz1hKmQpLGc9Yi5wYXJlbnROb2RlO3ZhciBpPVtcImhlaWdodFwiLFwicGFkZGluZ1RvcFwiLFwicGFkZGluZ0JvdHRvbVwiLFwibWFyZ2luVG9wXCIsXCJtYXJnaW5Cb3R0b21cIl07XCJib3JkZXItYm94XCI9PT1lLkNTUy5nZXRQcm9wZXJ0eVZhbHVlKGIsXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpJiYoaT1bXCJoZWlnaHRcIl0pLGYuZWFjaChpLGZ1bmN0aW9uKGEsYyl7aCs9cGFyc2VGbG9hdChlLkNTUy5nZXRQcm9wZXJ0eVZhbHVlKGIsYykpfSl9KSxlLmFuaW1hdGUoZyx7aGVpZ2h0OihcIkluXCI9PT1iP1wiK1wiOlwiLVwiKStcIj1cIitofSx7cXVldWU6ITEsZWFzaW5nOlwiZWFzZS1pbi1vdXRcIixkdXJhdGlvbjpjKihcIkluXCI9PT1iPy42OjEpfSl9cmV0dXJuIGUuUmVkaXJlY3RzW2FdPWZ1bmN0aW9uKGQsZyxoLGksaixrLGwpe3ZhciBtPWg9PT1pLTEsbj0wO2w9bHx8Yi5sb29wLFwiZnVuY3Rpb25cIj09dHlwZW9mIGIuZGVmYXVsdER1cmF0aW9uP2IuZGVmYXVsdER1cmF0aW9uPWIuZGVmYXVsdER1cmF0aW9uLmNhbGwoaixqKTpiLmRlZmF1bHREdXJhdGlvbj1wYXJzZUZsb2F0KGIuZGVmYXVsdER1cmF0aW9uKTtmb3IodmFyIG89MDtvPGIuY2FsbHMubGVuZ3RoO28rKylcIm51bWJlclwiPT10eXBlb2YodD1iLmNhbGxzW29dWzFdKSYmKG4rPXQpO3ZhciBwPW4+PTE/MDpiLmNhbGxzLmxlbmd0aD8oMS1uKS9iLmNhbGxzLmxlbmd0aDoxO2ZvcihvPTA7bzxiLmNhbGxzLmxlbmd0aDtvKyspe3ZhciBxPWIuY2FsbHNbb10scj1xWzBdLHM9MWUzLHQ9cVsxXSx1PXFbMl18fHt9LHY9e307aWYodm9pZCAwIT09Zy5kdXJhdGlvbj9zPWcuZHVyYXRpb246dm9pZCAwIT09Yi5kZWZhdWx0RHVyYXRpb24mJihzPWIuZGVmYXVsdER1cmF0aW9uKSx2LmR1cmF0aW9uPXMqKFwibnVtYmVyXCI9PXR5cGVvZiB0P3Q6cCksdi5xdWV1ZT1nLnF1ZXVlfHxcIlwiLHYuZWFzaW5nPXUuZWFzaW5nfHxcImVhc2VcIix2LmRlbGF5PXBhcnNlRmxvYXQodS5kZWxheSl8fDAsdi5sb29wPSFiLmxvb3AmJnUubG9vcCx2Ll9jYWNoZVZhbHVlcz11Ll9jYWNoZVZhbHVlc3x8ITAsMD09PW8pe2lmKHYuZGVsYXkrPXBhcnNlRmxvYXQoZy5kZWxheSl8fDAsMD09PWgmJih2LmJlZ2luPWZ1bmN0aW9uKCl7Zy5iZWdpbiYmZy5iZWdpbi5jYWxsKGosaik7dmFyIGI9YS5tYXRjaCgvKElufE91dCkkLyk7YiYmXCJJblwiPT09YlswXSYmdm9pZCAwIT09ci5vcGFjaXR5JiZmLmVhY2goai5ub2RlVHlwZT9bal06aixmdW5jdGlvbihhLGIpe2UuQ1NTLnNldFByb3BlcnR5VmFsdWUoYixcIm9wYWNpdHlcIiwwKX0pLGcuYW5pbWF0ZVBhcmVudEhlaWdodCYmYiYmYyhqLGJbMF0scyt2LmRlbGF5LGcuc3RhZ2dlcil9KSxudWxsIT09Zy5kaXNwbGF5KWlmKHZvaWQgMCE9PWcuZGlzcGxheSYmXCJub25lXCIhPT1nLmRpc3BsYXkpdi5kaXNwbGF5PWcuZGlzcGxheTtlbHNlIGlmKC9JbiQvLnRlc3QoYSkpe3ZhciB3PWUuQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShkKTt2LmRpc3BsYXk9XCJpbmxpbmVcIj09PXc/XCJpbmxpbmUtYmxvY2tcIjp3fWcudmlzaWJpbGl0eSYmXCJoaWRkZW5cIiE9PWcudmlzaWJpbGl0eSYmKHYudmlzaWJpbGl0eT1nLnZpc2liaWxpdHkpfWlmKG89PT1iLmNhbGxzLmxlbmd0aC0xKXt2YXIgeD1mdW5jdGlvbigpe3ZvaWQgMCE9PWcuZGlzcGxheSYmXCJub25lXCIhPT1nLmRpc3BsYXl8fCEvT3V0JC8udGVzdChhKXx8Zi5lYWNoKGoubm9kZVR5cGU/W2pdOmosZnVuY3Rpb24oYSxiKXtlLkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGIsXCJkaXNwbGF5XCIsXCJub25lXCIpfSksZy5jb21wbGV0ZSYmZy5jb21wbGV0ZS5jYWxsKGosaiksayYmay5yZXNvbHZlcihqfHxkKX07di5jb21wbGV0ZT1mdW5jdGlvbigpe2lmKGwmJmUuUmVkaXJlY3RzW2FdKGQsZyxoLGksaixrLGw9PT0hMHx8TWF0aC5tYXgoMCxsLTEpKSxiLnJlc2V0KXtmb3IodmFyIGMgaW4gYi5yZXNldClpZihiLnJlc2V0Lmhhc093blByb3BlcnR5KGMpKXt2YXIgZj1iLnJlc2V0W2NdO3ZvaWQgMCE9PWUuQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbY118fFwic3RyaW5nXCIhPXR5cGVvZiBmJiZcIm51bWJlclwiIT10eXBlb2YgZnx8KGIucmVzZXRbY109W2IucmVzZXRbY10sYi5yZXNldFtjXV0pfXZhciBuPXtkdXJhdGlvbjowLHF1ZXVlOiExfTttJiYobi5jb21wbGV0ZT14KSxlLmFuaW1hdGUoZCxiLnJlc2V0LG4pfWVsc2UgbSYmeCgpfSxcImhpZGRlblwiPT09Zy52aXNpYmlsaXR5JiYodi52aXNpYmlsaXR5PWcudmlzaWJpbGl0eSl9ZS5hbmltYXRlKGQscix2KX19LGV9LGUuUmVnaXN0ZXJFZmZlY3QucGFja2FnZWRFZmZlY3RzPXtcImNhbGxvdXQuYm91bmNlXCI6e2RlZmF1bHREdXJhdGlvbjo1NTAsY2FsbHM6W1t7dHJhbnNsYXRlWTotMzB9LC4yNV0sW3t0cmFuc2xhdGVZOjB9LC4xMjVdLFt7dHJhbnNsYXRlWTotMTV9LC4xMjVdLFt7dHJhbnNsYXRlWTowfSwuMjVdXX0sXCJjYWxsb3V0LnNoYWtlXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7dHJhbnNsYXRlWDotMTF9XSxbe3RyYW5zbGF0ZVg6MTF9XSxbe3RyYW5zbGF0ZVg6LTExfV0sW3t0cmFuc2xhdGVYOjExfV0sW3t0cmFuc2xhdGVYOi0xMX1dLFt7dHJhbnNsYXRlWDoxMX1dLFt7dHJhbnNsYXRlWDotMTF9XSxbe3RyYW5zbGF0ZVg6MH1dXX0sXCJjYWxsb3V0LmZsYXNoXCI6e2RlZmF1bHREdXJhdGlvbjoxMTAwLGNhbGxzOltbe29wYWNpdHk6WzAsXCJlYXNlSW5PdXRRdWFkXCIsMV19XSxbe29wYWNpdHk6WzEsXCJlYXNlSW5PdXRRdWFkXCJdfV0sW3tvcGFjaXR5OlswLFwiZWFzZUluT3V0UXVhZFwiXX1dLFt7b3BhY2l0eTpbMSxcImVhc2VJbk91dFF1YWRcIl19XV19LFwiY2FsbG91dC5wdWxzZVwiOntkZWZhdWx0RHVyYXRpb246ODI1LGNhbGxzOltbe3NjYWxlWDoxLjEsc2NhbGVZOjEuMX0sLjUse2Vhc2luZzpcImVhc2VJbkV4cG9cIn1dLFt7c2NhbGVYOjEsc2NhbGVZOjF9LC41XV19LFwiY2FsbG91dC5zd2luZ1wiOntkZWZhdWx0RHVyYXRpb246OTUwLGNhbGxzOltbe3JvdGF0ZVo6MTV9XSxbe3JvdGF0ZVo6LTEwfV0sW3tyb3RhdGVaOjV9XSxbe3JvdGF0ZVo6LTV9XSxbe3JvdGF0ZVo6MH1dXX0sXCJjYWxsb3V0LnRhZGFcIjp7ZGVmYXVsdER1cmF0aW9uOjFlMyxjYWxsczpbW3tzY2FsZVg6Ljksc2NhbGVZOi45LHJvdGF0ZVo6LTN9LC4xXSxbe3NjYWxlWDoxLjEsc2NhbGVZOjEuMSxyb3RhdGVaOjN9LC4xXSxbe3NjYWxlWDoxLjEsc2NhbGVZOjEuMSxyb3RhdGVaOi0zfSwuMV0sW1wicmV2ZXJzZVwiLC4xMjVdLFtcInJldmVyc2VcIiwuMTI1XSxbXCJyZXZlcnNlXCIsLjEyNV0sW1wicmV2ZXJzZVwiLC4xMjVdLFtcInJldmVyc2VcIiwuMTI1XSxbe3NjYWxlWDoxLHNjYWxlWToxLHJvdGF0ZVo6MH0sLjJdXX0sXCJ0cmFuc2l0aW9uLmZhZGVJblwiOntkZWZhdWx0RHVyYXRpb246NTAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF19XV19LFwidHJhbnNpdGlvbi5mYWRlT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo1MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXX1dXX0sXCJ0cmFuc2l0aW9uLmZsaXBYSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjcwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSxyb3RhdGVZOlswLC01NV19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjB9fSxcInRyYW5zaXRpb24uZmxpcFhPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjcwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSxyb3RhdGVZOjU1fV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHJvdGF0ZVk6MH19LFwidHJhbnNpdGlvbi5mbGlwWUluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0scm90YXRlWDpbMCwtNDVdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBZT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0scm90YXRlWDoyNX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCxyb3RhdGVYOjB9fSxcInRyYW5zaXRpb24uZmxpcEJvdW5jZVhJblwiOntkZWZhdWx0RHVyYXRpb246OTAwLGNhbGxzOltbe29wYWNpdHk6Wy43MjUsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzQwMCw0MDBdLHJvdGF0ZVk6Wy0xMCw5MF19LC41XSxbe29wYWNpdHk6Ljgscm90YXRlWToxMH0sLjI1XSxbe29wYWNpdHk6MSxyb3RhdGVZOjB9LC4yNV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBCb3VuY2VYT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbLjksMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzQwMCw0MDBdLHJvdGF0ZVk6LTEwfV0sW3tvcGFjaXR5OjAscm90YXRlWTo5MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCxyb3RhdGVZOjB9fSxcInRyYW5zaXRpb24uZmxpcEJvdW5jZVlJblwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6Wy43MjUsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzQwMCw0MDBdLHJvdGF0ZVg6Wy0xMCw5MF19LC41XSxbe29wYWNpdHk6Ljgscm90YXRlWDoxMH0sLjI1XSxbe29wYWNpdHk6MSxyb3RhdGVYOjB9LC4yNV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowfX0sXCJ0cmFuc2l0aW9uLmZsaXBCb3VuY2VZT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbLjksMV0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzQwMCw0MDBdLHJvdGF0ZVg6LTE1fV0sW3tvcGFjaXR5OjAscm90YXRlWDo5MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCxyb3RhdGVYOjB9fSxcInRyYW5zaXRpb24uc3dvb3BJblwiOntkZWZhdWx0RHVyYXRpb246ODUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtT3JpZ2luWDpbXCIxMDAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCIxMDAlXCIsXCIxMDAlXCJdLHNjYWxlWDpbMSwwXSxzY2FsZVk6WzEsMF0sdHJhbnNsYXRlWDpbMCwtNzAwXSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCJ9fSxcInRyYW5zaXRpb24uc3dvb3BPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCIxMDAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiMTAwJVwiLFwiMTAwJVwiXSxzY2FsZVg6MCxzY2FsZVk6MCx0cmFuc2xhdGVYOi03MDAsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwiLHNjYWxlWDoxLHNjYWxlWToxLHRyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi53aGlybEluXCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOlsxLDBdLHNjYWxlWTpbMSwwXSxyb3RhdGVZOlswLDE2MF19LDEse2Vhc2luZzpcImVhc2VJbk91dFNpbmVcIn1dXX0sXCJ0cmFuc2l0aW9uLndoaXJsT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCxcImVhc2VJbk91dFF1aW50XCIsMV0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDowLHNjYWxlWTowLHJvdGF0ZVk6MTYwfSwxLHtlYXNpbmc6XCJzd2luZ1wifV1dLHJlc2V0OntzY2FsZVg6MSxzY2FsZVk6MSxyb3RhdGVZOjB9fSxcInRyYW5zaXRpb24uc2hyaW5rSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6WzEsMS41XSxzY2FsZVk6WzEsMS41XSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zaHJpbmtPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjYwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybU9yaWdpblg6W1wiNTAlXCIsXCI1MCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbXCI1MCVcIixcIjUwJVwiXSxzY2FsZVg6MS4zLHNjYWxlWToxLjMsdHJhbnNsYXRlWjowfV1dLHJlc2V0OntzY2FsZVg6MSxzY2FsZVk6MX19LFwidHJhbnNpdGlvbi5leHBhbmRJblwiOntkZWZhdWx0RHVyYXRpb246NzAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtT3JpZ2luWDpbXCI1MCVcIixcIjUwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjUwJVwiLFwiNTAlXCJdLHNjYWxlWDpbMSwuNjI1XSxzY2FsZVk6WzEsLjYyNV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uZXhwYW5kT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjUwJVwiLFwiNTAlXCJdLHRyYW5zZm9ybU9yaWdpblk6W1wiNTAlXCIsXCI1MCVcIl0sc2NhbGVYOi41LHNjYWxlWTouNSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3NjYWxlWDoxLHNjYWxlWToxfX0sXCJ0cmFuc2l0aW9uLmJvdW5jZUluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSxzY2FsZVg6WzEuMDUsLjNdLHNjYWxlWTpbMS4wNSwuM119LC4zNV0sW3tzY2FsZVg6Ljksc2NhbGVZOi45LHRyYW5zbGF0ZVo6MH0sLjJdLFt7c2NhbGVYOjEsc2NhbGVZOjF9LC40NV1dfSxcInRyYW5zaXRpb24uYm91bmNlT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7c2NhbGVYOi45NSxzY2FsZVk6Ljk1fSwuMzVdLFt7c2NhbGVYOjEuMSxzY2FsZVk6MS4xLHRyYW5zbGF0ZVo6MH0sLjM1XSxbe29wYWNpdHk6WzAsMV0sc2NhbGVYOi4zLHNjYWxlWTouM30sLjNdXSxyZXNldDp7c2NhbGVYOjEsc2NhbGVZOjF9fSxcInRyYW5zaXRpb24uYm91bmNlVXBJblwiOntkZWZhdWx0RHVyYXRpb246ODAwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWTpbLTMwLDFlM119LC42LHtlYXNpbmc6XCJlYXNlT3V0Q2lyY1wifV0sW3t0cmFuc2xhdGVZOjEwfSwuMl0sW3t0cmFuc2xhdGVZOjB9LC4yXV19LFwidHJhbnNpdGlvbi5ib3VuY2VVcE91dFwiOntkZWZhdWx0RHVyYXRpb246MWUzLGNhbGxzOltbe3RyYW5zbGF0ZVk6MjB9LC4yXSxbe29wYWNpdHk6WzAsXCJlYXNlSW5DaXJjXCIsMV0sdHJhbnNsYXRlWTotMWUzfSwuOF1dLHJlc2V0Ont0cmFuc2xhdGVZOjB9fSxcInRyYW5zaXRpb24uYm91bmNlRG93bkluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlszMCwtMWUzXX0sLjYse2Vhc2luZzpcImVhc2VPdXRDaXJjXCJ9XSxbe3RyYW5zbGF0ZVk6LTEwfSwuMl0sW3t0cmFuc2xhdGVZOjB9LC4yXV19LFwidHJhbnNpdGlvbi5ib3VuY2VEb3duT3V0XCI6e2RlZmF1bHREdXJhdGlvbjoxZTMsY2FsbHM6W1t7dHJhbnNsYXRlWTotMjB9LC4yXSxbe29wYWNpdHk6WzAsXCJlYXNlSW5DaXJjXCIsMV0sdHJhbnNsYXRlWToxZTN9LC44XV0scmVzZXQ6e3RyYW5zbGF0ZVk6MH19LFwidHJhbnNpdGlvbi5ib3VuY2VMZWZ0SW5cIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVg6WzMwLC0xMjUwXX0sLjYse2Vhc2luZzpcImVhc2VPdXRDaXJjXCJ9XSxbe3RyYW5zbGF0ZVg6LTEwfSwuMl0sW3t0cmFuc2xhdGVYOjB9LC4yXV19LFwidHJhbnNpdGlvbi5ib3VuY2VMZWZ0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7dHJhbnNsYXRlWDozMH0sLjJdLFt7b3BhY2l0eTpbMCxcImVhc2VJbkNpcmNcIiwxXSx0cmFuc2xhdGVYOi0xMjUwfSwuOF1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uYm91bmNlUmlnaHRJblwiOntkZWZhdWx0RHVyYXRpb246NzUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNsYXRlWDpbLTMwLDEyNTBdfSwuNix7ZWFzaW5nOlwiZWFzZU91dENpcmNcIn1dLFt7dHJhbnNsYXRlWDoxMH0sLjJdLFt7dHJhbnNsYXRlWDowfSwuMl1dfSxcInRyYW5zaXRpb24uYm91bmNlUmlnaHRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3t0cmFuc2xhdGVYOi0zMH0sLjJdLFt7b3BhY2l0eTpbMCxcImVhc2VJbkNpcmNcIiwxXSx0cmFuc2xhdGVYOjEyNTB9LC44XV0scmVzZXQ6e3RyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi5zbGlkZVVwSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjkwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVk6WzAsMjBdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlVXBPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjkwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVk6LTIwLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlRG93bkluXCI6e2RlZmF1bHREdXJhdGlvbjo5MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlswLC0yMF0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVEb3duT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo5MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVZOjIwLHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlTGVmdEluXCI6e2RlZmF1bHREdXJhdGlvbjoxZTMsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlswLC0yMF0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVMZWZ0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjoxMDUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWDotMjAsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24uc2xpZGVSaWdodEluXCI6e2RlZmF1bHREdXJhdGlvbjoxZTMsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlswLDIwXSx0cmFuc2xhdGVaOjB9XV19LFwidHJhbnNpdGlvbi5zbGlkZVJpZ2h0T3V0XCI6e2RlZmF1bHREdXJhdGlvbjoxMDUwLGNhbGxzOltbe29wYWNpdHk6WzAsMV0sdHJhbnNsYXRlWDoyMCx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi5zbGlkZVVwQmlnSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVk6WzAsNzVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlVXBCaWdPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVk6LTc1LHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlRG93bkJpZ0luXCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVZOlswLC03NV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVEb3duQmlnT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVZOjc1LHRyYW5zbGF0ZVo6MH1dXSxyZXNldDp7dHJhbnNsYXRlWTowfX0sXCJ0cmFuc2l0aW9uLnNsaWRlTGVmdEJpZ0luXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2xhdGVYOlswLC03NV0sdHJhbnNsYXRlWjowfV1dfSxcInRyYW5zaXRpb24uc2xpZGVMZWZ0QmlnT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo3NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2xhdGVYOi03NSx0cmFuc2xhdGVaOjB9XV0scmVzZXQ6e3RyYW5zbGF0ZVg6MH19LFwidHJhbnNpdGlvbi5zbGlkZVJpZ2h0QmlnSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zbGF0ZVg6WzAsNzVdLHRyYW5zbGF0ZVo6MH1dXX0sXCJ0cmFuc2l0aW9uLnNsaWRlUmlnaHRCaWdPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjc1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zbGF0ZVg6NzUsdHJhbnNsYXRlWjowfV1dLHJlc2V0Ont0cmFuc2xhdGVYOjB9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVVcEluXCI6e2RlZmF1bHREdXJhdGlvbjo4MDAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOltcIjEwMCVcIixcIjEwMCVcIl0scm90YXRlWDpbMCwtMTgwXX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwifX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlVXBPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjg1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSx0cmFuc2Zvcm1PcmlnaW5YOlswLDBdLHRyYW5zZm9ybU9yaWdpblk6W1wiMTAwJVwiLFwiMTAwJVwiXSxyb3RhdGVYOi0xODB9XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIixyb3RhdGVYOjB9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVEb3duSW5cIjp7ZGVmYXVsdER1cmF0aW9uOjgwMCxjYWxsczpbW3tvcGFjaXR5OlsxLDBdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOls4MDAsODAwXSx0cmFuc2Zvcm1PcmlnaW5YOlswLDBdLHRyYW5zZm9ybU9yaWdpblk6WzAsMF0scm90YXRlWDpbMCwxODBdfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCJ9fSxcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVEb3duT3V0XCI6e2RlZmF1bHREdXJhdGlvbjo4NTAsY2FsbHM6W1t7b3BhY2l0eTpbMCwxXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbODAwLDgwMF0sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVg6MTgwfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCIscm90YXRlWDowfX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlTGVmdEluXCI6e2RlZmF1bHREdXJhdGlvbjo5NTAsY2FsbHM6W1t7b3BhY2l0eTpbMSwwXSx0cmFuc2Zvcm1QZXJzcGVjdGl2ZTpbMmUzLDJlM10sdHJhbnNmb3JtT3JpZ2luWDpbMCwwXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVk6WzAsLTE4MF19XV0scmVzZXQ6e3RyYW5zZm9ybVBlcnNwZWN0aXZlOjAsdHJhbnNmb3JtT3JpZ2luWDpcIjUwJVwiLHRyYW5zZm9ybU9yaWdpblk6XCI1MCVcIn19LFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZUxlZnRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjk1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOlsyZTMsMmUzXSx0cmFuc2Zvcm1PcmlnaW5YOlswLDBdLHRyYW5zZm9ybU9yaWdpblk6WzAsMF0scm90YXRlWTotMTgwfV1dLHJlc2V0Ont0cmFuc2Zvcm1QZXJzcGVjdGl2ZTowLHRyYW5zZm9ybU9yaWdpblg6XCI1MCVcIix0cmFuc2Zvcm1PcmlnaW5ZOlwiNTAlXCIscm90YXRlWTowfX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlUmlnaHRJblwiOntkZWZhdWx0RHVyYXRpb246OTUwLGNhbGxzOltbe29wYWNpdHk6WzEsMF0sdHJhbnNmb3JtUGVyc3BlY3RpdmU6WzJlMywyZTNdLHRyYW5zZm9ybU9yaWdpblg6W1wiMTAwJVwiLFwiMTAwJVwiXSx0cmFuc2Zvcm1PcmlnaW5ZOlswLDBdLHJvdGF0ZVk6WzAsMTgwXX1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwifX0sXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlUmlnaHRPdXRcIjp7ZGVmYXVsdER1cmF0aW9uOjk1MCxjYWxsczpbW3tvcGFjaXR5OlswLDFdLHRyYW5zZm9ybVBlcnNwZWN0aXZlOlsyZTMsMmUzXSx0cmFuc2Zvcm1PcmlnaW5YOltcIjEwMCVcIixcIjEwMCVcIl0sdHJhbnNmb3JtT3JpZ2luWTpbMCwwXSxyb3RhdGVZOjE4MH1dXSxyZXNldDp7dHJhbnNmb3JtUGVyc3BlY3RpdmU6MCx0cmFuc2Zvcm1PcmlnaW5YOlwiNTAlXCIsdHJhbnNmb3JtT3JpZ2luWTpcIjUwJVwiLHJvdGF0ZVk6MH19fTtmb3IodmFyIGogaW4gZS5SZWdpc3RlckVmZmVjdC5wYWNrYWdlZEVmZmVjdHMpZS5SZWdpc3RlckVmZmVjdC5wYWNrYWdlZEVmZmVjdHMuaGFzT3duUHJvcGVydHkoaikmJmUuUmVnaXN0ZXJFZmZlY3QoaixlLlJlZ2lzdGVyRWZmZWN0LnBhY2thZ2VkRWZmZWN0c1tqXSk7ZS5SdW5TZXF1ZW5jZT1mdW5jdGlvbihhKXt2YXIgYj1mLmV4dGVuZCghMCxbXSxhKTtiLmxlbmd0aD4xJiYoZi5lYWNoKGIucmV2ZXJzZSgpLGZ1bmN0aW9uKGEsYyl7dmFyIGQ9YlthKzFdO2lmKGQpe3ZhciBnPWMub3x8Yy5vcHRpb25zLGg9ZC5vfHxkLm9wdGlvbnMsaT1nJiZnLnNlcXVlbmNlUXVldWU9PT0hMT9cImJlZ2luXCI6XCJjb21wbGV0ZVwiLGo9aCYmaFtpXSxrPXt9O2tbaV09ZnVuY3Rpb24oKXt2YXIgYT1kLmV8fGQuZWxlbWVudHMsYj1hLm5vZGVUeXBlP1thXTphO2omJmouY2FsbChiLGIpLGUoYyl9LGQubz9kLm89Zi5leHRlbmQoe30saCxrKTpkLm9wdGlvbnM9Zi5leHRlbmQoe30saCxrKX19KSxiLnJldmVyc2UoKSksZShiWzBdKX19KHdpbmRvdy5qUXVlcnl8fHdpbmRvdy5aZXB0b3x8d2luZG93LHdpbmRvdyx3aW5kb3c/d2luZG93LmRvY3VtZW50OnVuZGVmaW5lZCl9KTsiLCJpbXBvcnQgeyBlbENsYXNzIH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYW5pbWF0ZU1lbnVJdGVtKCkge1xyXG4gIGNvbnN0IG1lbnVJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tZW51LWl0ZW0nKTtcclxuXHJcbiAgbWVudUl0ZW1zLmZvckVhY2goZWwgPT4gYWRkUGlwZXMoZWwpKTtcclxuICBtZW51SXRlbXMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBhbmltYXRlUGlwZSkpO1xyXG4gIG1lbnVJdGVtcy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdW5BbmltYXRlUGlwZSkpO1xyXG5cclxuICBmdW5jdGlvbiBhZGRQaXBlcyhlbCkge1xyXG4gICAgY29uc3QgcGlwZTEgPSBlbENsYXNzKCdkaXYnLCAnZW5kLXBpcGUnKTtcclxuICAgIGNvbnN0IHN0ciA9IGVsO1xyXG5cclxuICAgIHBpcGUxLmlubmVySFRNTCA9ICdbJztcclxuICAgIC8vIHN0ci5pbm5lckhUTUwgPSBgJHtzdHIuaW5uZXJIVE1MLnRvVXBwZXJDYXNlKCl9YDtcclxuICAgIHN0ci5hcHBlbmRDaGlsZChwaXBlMSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhbmltYXRlUGlwZShlKSB7XHJcbiAgICBjb25zdCBzcGFjZVdpZHRoID0gNTtcclxuICAgIGNvbnN0IHcgPSBlLnRhcmdldC5vZmZzZXRXaWR0aDtcclxuICAgIGNvbnN0IHBpcGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpO1xyXG4gICAgcGlwZS5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoJHstdyAtIHNwYWNlV2lkdGh9cHgpO1xyXG4gICAgYDtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1bkFuaW1hdGVQaXBlKGUpIHtcclxuICAgIGNvbnN0IHcgPSBlLnRhcmdldC5vZmZzZXRXaWR0aDtcclxuICAgIGNvbnN0IHBpcGUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpO1xyXG4gICAgcGlwZS5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMHB4KTtcclxuICAgIGA7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaW1VSSgpIHtcclxuICBsZXQgc1Bvc2l0aW9uID0gMDtcclxuICBsZXQgdGlja2luZyA9IGZhbHNlO1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKGUpID0+IHtcclxuICAgIHNQb3NpdGlvbiA9IHdpbmRvdy5zY3JvbGxZO1xyXG4gICAgaWYgKCF0aWNraW5nKSB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNvY2lhbC1tZWRpYS1uYXYnKTtcclxuICAgICAgICAoZnVuY3Rpb24gZGltbWVyKCkgeyB1aS5jbGFzc0xpc3QuYWRkKCdkaW0tdWknKTsgfSgpKTtcclxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB1aS5jbGFzc0xpc3QucmVtb3ZlKCdkaW0tdWknKSwgMTAwMCk7XHJcbiAgICAgICAgdGlja2luZyA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHRpY2tpbmcgPSB0cnVlO1xyXG4gIH0pO1xyXG59XHJcbiIsImNvbnN0IGZpbGUgPSAoZnVuY3Rpb24gZmlsZSgpIHtcbiAgbGV0IHNyYztcbiAgbGV0IHZhbDtcbiAgY29uc3QgYmFzZSA9ICdodHRwczovL2JyYXN0cnVsbG8uZ2l0aHViLmlvL3Jlc3VtZS8nO1xuICBjb25zdCBwZGYgPSBgJHtiYXNlfUJyYWRSLUpTRGV2LnBkZmA7XG4gIGNvbnN0IGRvYyA9IFsnQnJhZFItSlNEZXYucGRmJywgJ0JyYWRSLUpTRGV2LmRvYyddO1xuXG4gIGZ1bmN0aW9uIHNldFNyYygpIHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgIHNyYyA9IGJhc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncGRmJzpcbiAgICAgICAgc3JjID0gYmFzZSArIGRvY1swXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkb2MnOlxuICAgICAgICBzcmMgPSBiYXNlICsgZG9jWzFdO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHNyYyA9IGJhc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0VmFsKGZpbGV0eXBlKSB7IHZhbCA9IGZpbGV0eXBlOyBzZXRTcmMoKTsgfVxuICBmdW5jdGlvbiBnZXRWYWwoKSB7IHJldHVybiB2YWw7IH1cbiAgZnVuY3Rpb24gZ2V0U3JjKCkgeyByZXR1cm4gc3JjOyB9XG4gIGZ1bmN0aW9uIGdldFBkZigpIHsgcmV0dXJuIHBkZjsgfVxuXG4gIHJldHVybiB7XG4gICAgc2V0VmFsLFxuICAgIGdldFZhbCxcbiAgICBnZXRTcmMsXG4gICAgZ2V0UGRmLFxuICB9O1xufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgZmlsZTtcbiIsImltcG9ydCBsb2FkaW5nU2NyZWVuIGZyb20gJy4vbG9hZGluZ1NjcmVlbic7XHJcbmltcG9ydCBhbmltYXRlTWVudUl0ZW1zIGZyb20gJy4vYW5pbWF0ZU1lbnVJdGVtJztcclxuaW1wb3J0IGRpbVVJIGZyb20gJy4vZGltVUknO1xyXG5pbXBvcnQgaW50cm9BbmltYXRpb24gZnJvbSAnLi9pbnRyb0FuaW1hdGlvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkZXIoKSB7XHJcbiAgbG9hZGluZ1NjcmVlbigpO1xyXG4gIGFuaW1hdGVNZW51SXRlbXMoKTtcclxuICBpbnRyb0FuaW1hdGlvbigpO1xyXG4gIGRpbVVJKCk7XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW50cm9BbmltYXRpb24oKSB7XHJcbiAgd2luZG93LnNldFRpbWVvdXQoc3RhcnRJbnRybywgNDAwKTtcclxuICB3aW5kb3cuc2V0VGltZW91dChjbGVhckludHJvQW5pbSwgNDAwMCk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0YXJ0SW50cm8oKSB7XHJcbiAgICBtb3ZlVGV4dCgpO1xyXG4gICAgc2hvd1VpKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtb3ZlVGV4dCgpIHtcclxuICAgIGNvbnN0IGludHJvTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbnRyby1uYW1lJyk7XHJcbiAgICBjb25zdCBpbnRyb0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmludHJvLWJsb2NrJyk7XHJcbiAgICBpbnRyb05hbWUuY2xhc3NMaXN0LmFkZCgnaW50cm8tYW5pbS1tb3ZlLW5hbWUnKTtcclxuICAgIGludHJvQmxvY2suY2xhc3NMaXN0LmFkZCgnaW50cm8tYW5pbS1tb3ZlLWJsb2NrJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzaG93VWkoKSB7XHJcbiAgICBjb25zdCBoZWFkZXJMb2dvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ28nKTtcclxuICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmludHJvLWluaXQtdWknKTtcclxuICAgIGhlYWRlckxvZ28ucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgaGVhZGVyTG9nby5jbGFzc0xpc3QuYWRkKCdoZWFkZXItbG9nbycpO1xyXG4gICAgdWkuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKCdpbnRyby1hbmltLXNob3ctdWknKSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGVhckludHJvQW5pbSgpIHtcclxuICAgIGNvbnN0IGluaXRVSSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnRyby1pbml0LXVpJyk7XHJcbiAgICBjb25zdCBhbmltVUkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW50cm8tYW5pbS1zaG93LXVpJyk7XHJcblxyXG4gICAgaW5pdFVJLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnaW50cm8taW5pdC11aScpKTtcclxuICAgIGluaXRVSS5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ludHJvLWFuaW0tc2hvdy11aScpKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IGxvZ28gZnJvbSAnLi9zdmcvbG9nbyc7XG5cbmZ1bmN0aW9uIGxvYWRpbmdTY3JlZW4oKSB7XG4gIGNvbnN0IGJhY2tkcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tkcm9wJyk7XG4gIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2xvYWRpbmctc2NyZWVuLWJhY2tkcm9wJyk7XG4gIGJhY2tkcm9wLnN0eWxlLmJhY2tncm91bmQgPSBwYXN0ZWxDb2xvcnMoKTtcbiAgZG9jdW1lbnQuYm9keS5zdHlsZSA9ICdvdmVyZmxvdzogaGlkZGVuJztcbiAgYmFja2Ryb3AuaW5zZXJ0QmVmb3JlKGxvZ28oKSwgYmFja2Ryb3AuY2hpbGROb2Rlc1swXSk7XG5cbiAgd2luZG93LnNldFRpbWVvdXQoc2hvd0xvYWRpbmcsIDIwMCk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBzaG93TG9hZGluZygpIHtcbiAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nQmFyJyk7XG4gIGNvbnN0IGxlbmd0aCA9IHBhdGguZ2V0VG90YWxMZW5ndGgoKTtcblxuICBwYXRoLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSc7XG4gIHBhdGguc3R5bGUuV2Via2l0VHJhbnNpdGlvbiA9ICdub25lJztcbiAgcGF0aC5zdHlsZSA9ICdvcGFjaXR5OiAxJztcbiAgcGF0aC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBgJHtsZW5ndGh9ICR7bGVuZ3RofWA7XG4gIHBhdGguc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IGxlbmd0aDtcbiAgcGF0aC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgcGF0aC5zdHlsZS50cmFuc2l0aW9uID0gJ3N0cm9rZS1kYXNob2Zmc2V0IDE1MG1zIGVhc2UtaW4nO1xuICBwYXRoLnN0eWxlLldlYmtpdFRyYW5zaXRpb24gPSAnc3Ryb2tlLWRhc2hvZmZzZXQgMTUwbXMgZWFzZS1pbic7XG4gIHBhdGguc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9ICcwJztcblxuICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICBjb25zdCBiYWNrZHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZHJvcCcpO1xuICAgIGJhY2tkcm9wLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3NzVGV4dCA9ICdvdmVyZmxvdzogdW5zZXQnO1xuICB9XG5cbiAgd2luZG93LnNldFRpbWVvdXQoc3RhcnQsIDM1MCk7XG4gIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHBhc3RlbENvbG9ycygpIHtcbiAgY29uc3QgciA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMjcpICsgMTI3KS50b1N0cmluZygxNik7XG4gIGNvbnN0IGcgPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTI3KSArIDEyNykudG9TdHJpbmcoMTYpO1xuICBjb25zdCBiID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEyNykgKyAxMjcpLnRvU3RyaW5nKDE2KTtcbiAgcmV0dXJuIGAjJHtyfSR7Z30ke2J9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbG9hZGluZ1NjcmVlbjtcbiIsImltcG9ydCBmaWxlIGZyb20gJy4vZG9jSGFuZGxlcic7XHJcbmltcG9ydCB2aWV3SGFuZGxlciBmcm9tICcuL3ZpZXdIYW5kbGVyJztcclxuaW1wb3J0IHsgZWxDbGFzcywgbWFrZUJ0biB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1vZGFsKCkge1xyXG4gIChmdW5jdGlvbiBhZGRNb2RhbCgpIHtcclxuICAgIGNvbnN0IGJnID0gZWxDbGFzcygnZGl2JywgJ21vZGFsLWJhY2tncm91bmQnKTtcclxuICAgIGNvbnN0IHdyYXBwZXIgPSBlbENsYXNzKCdkaXYnLCAnbW9kYWwtd3JhcHBlcicpO1xyXG4gICAgY29uc3QgbWVudSA9IG1vZGFsTWVudSgpO1xyXG4gICAgY29uc3QgY29udGVudCA9IG1vZGFsQ29udGVudCgpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiZyk7XHJcbiAgICBiZy5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobWVudSk7XHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gIH0oKSk7XHJcblxyXG4gIGZ1bmN0aW9uIG1vZGFsTWVudSgpIHtcclxuICAgIGNvbnN0IG1lbnUgPSBlbENsYXNzKCdkaXYnLCAnbW9kYWwtbWVudScpO1xyXG4gICAgY29uc3QgZHJvcGRvd24gPSBkb2NWaWV3RHJvcGRvd24oKTtcclxuICAgIGNvbnN0IHN3aXRjaEJ0biA9IGZpbGVUeXBlU3dpdGNoKCk7XHJcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IGRvd25sb2FkQnV0dHRvbigpO1xyXG4gICAgY29uc3QgcHJpbnRCdG4gPSBtYWtlQnRuKCdwcmludCcsICdwcmludC1idG4gYnRuJyk7XHJcbiAgICBjb25zdCBzaGFyZUJ0biA9IG1ha2VCdG4oJ3NoYXJlJywgJ3NoYXJlLWJ0biBidG4nKTtcclxuICAgIGNvbnN0IGNsb3NlQnRuID0gbWFrZUJ0bignY2xvc2UnLCAnY2xvc2UtYnRuIGJ0bicpO1xyXG4gICAgY29uc3QgY29sdW1uMSA9IGVsQ2xhc3MoJ2RpdicsICdvcHRpb25zLXZpZXcnKTtcclxuICAgIGNvbnN0IGNvbHVtbjIgPSBlbENsYXNzKCdkaXYnLCAnb3B0aW9ucy1hY3Rpb25zJyk7XHJcblxyXG5cclxuICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBjbG9zZU1vZGFsO1xyXG5cclxuICAgIG1lbnUuYXBwZW5kQ2hpbGQoY29sdW1uMSk7XHJcbiAgICBtZW51LmFwcGVuZENoaWxkKGNvbHVtbjIpO1xyXG5cclxuXHJcbiAgICBjb2x1bW4xLmFwcGVuZENoaWxkKGRyb3Bkb3duKTtcclxuICAgIGNvbHVtbjEuYXBwZW5kQ2hpbGQoc3dpdGNoQnRuKTtcclxuXHJcbiAgICBjb2x1bW4yLmFwcGVuZENoaWxkKGRvd25sb2FkQnRuKTtcclxuICAgIGNvbHVtbjIuYXBwZW5kQ2hpbGQocHJpbnRCdG4pO1xyXG4gICAgY29sdW1uMi5hcHBlbmRDaGlsZChzaGFyZUJ0bik7XHJcbiAgICBjb2x1bW4yLmFwcGVuZENoaWxkKGNsb3NlQnRuKTtcclxuXHJcbiAgICBwcmludEJ0bi5pbm5lckhUTUwgPSAncHJpbnQnO1xyXG5cclxuICAgIHJldHVybiBtZW51O1xyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLm1vZGFsLWJhY2tncm91bmQnKS5yZW1vdmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vZGFsQ29udGVudCgpIHtcclxuICAgIGNvbnN0IGlmcmFtZSA9IGVsQ2xhc3MoJ2lmcmFtZScsICdyZXN1bWUtdmlld2VyJyk7XHJcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzcmMnLCAnaHR0cHM6Ly9icmFzdHJ1bGxvLmdpdGh1Yi5pby9yZXN1bWUvJyk7XHJcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCd0aXRsZScsICdyZXN1bWUnKTtcclxuICAgIGlmcmFtZS5pbm5lckhUTUwgPSAnPHA+WW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgaWZyYW1lcy48L3A+JztcclxuICAgIHJldHVybiBpZnJhbWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkb2NWaWV3RHJvcGRvd24oKSB7XHJcbiAgICBjb25zdCBkcm9wZG93biA9IGVsQ2xhc3MoJ3NlbGVjdCcsICdkb2MtdmlldycpO1xyXG4gICAgZHJvcGRvd24uaW5uZXJIVE1MID0gYFxyXG4gICAgICA8b3B0aW9uIHZhbHVlPSdodG1sJyBzZWxlY3RlZD5IVE1MPC9vcHRpb24+XHJcbiAgICAgIDxvcHRpb24gdmFsdWU9J3BkZic+UERGL0RPQzwvb3B0aW9uPlxyXG4gICAgYDtcclxuXHJcbiAgICBkcm9wZG93bi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVWaWV3KTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVWaWV3KCkge1xyXG4gICAgICBmaWxlLnNldFZhbCh0aGlzLnZhbHVlKTtcclxuICAgICAgdmlld0hhbmRsZXIoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkcm9wZG93bjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGZpbGVUeXBlU3dpdGNoKCkge1xyXG4gICAgY29uc3Qgc3dpdGNoQnRuID0gZWxDbGFzcygnbGFiZWwnLCAnZmlsZS10eXBlIHN3aXRjaCBoaWRkZW4nKTtcclxuICAgIGNvbnN0IGNoZWNrYm94ID0gZWxDbGFzcygnaW5wdXQnLCAnZmlsZS10eXBlIGNoZWNrYm94Jyk7XHJcbiAgICBjb25zdCBzbGlkZXIgPSBlbENsYXNzKCdzcGFuJywgJ2ZpbGUtdHlwZSBzbGlkZXIgcm91bmQnKTtcclxuXHJcbiAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcclxuICAgIHN3aXRjaEJ0bi5hcHBlbmRDaGlsZChjaGVja2JveCk7XHJcbiAgICBzd2l0Y2hCdG4uYXBwZW5kQ2hpbGQoc2xpZGVyKTtcclxuXHJcbiAgICBzd2l0Y2hCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVGaWxlVHlwZSk7XHJcbiAgICByZXR1cm4gc3dpdGNoQnRuO1xyXG5cclxuICAgIGZ1bmN0aW9uIHRvZ2dsZUZpbGVUeXBlKCkge1xyXG4gICAgICBjb25zdCBkb3dubG9hZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZC1idG4uYnRuJyk7XHJcbiAgICAgIGNvbnN0IHByaW50QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByaW50LWJ0bi5idG4nKTtcclxuXHJcbiAgICAgIGNvbnN0IHZhbCA9IGNoZWNrYm94LmNoZWNrZWQgPyAnZG9jJyA6ICdwZGYnO1xyXG4gICAgICBmaWxlLnNldFZhbCh2YWwpO1xyXG4gICAgICBkb3dubG9hZEJ0bi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBmaWxlLmdldFNyYygpKTtcclxuICAgICAgZG93bmxvYWRCdG4uc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGBicmFzdHJ1bGxvLWpzZGV2LXJlc3VtZS4ke3ZhbH1gKTtcclxuICAgICAgZG93bmxvYWRCdG4uaW5uZXJIVE1MID0gJ2Rvd25sb2FkICc7XHJcblxyXG4gICAgICBwcmludEJ0bi5zZXRBdHRyaWJ1dGUoJ3ByaW50JywgZmlsZS5nZXRTcmMoKSk7XHJcbiAgICAgIHByaW50QnRuLmlubmVySFRNTCA9ICdwcmludCc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkb3dubG9hZEJ1dHR0b24oKSB7XHJcbiAgICBjb25zdCBidXR0b24gPSBlbENsYXNzKCdhJywgJ2Rvd25sb2FkLWJ0biBidG4gaGlkZGVuJyk7XHJcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdocmVmJywgJ2h0dHBzOi8vYnJhc3RydWxsby5naXRodWIuaW8vcmVzdW1lL0JyYWRSLUpTRGV2LnBkZicpO1xyXG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCAnYnJhc3RydWxsby1qc2Rldi1yZXN1bWUucGRmJyk7XHJcbiAgICBidXR0b24uaW5uZXJIVE1MID0gJ2Rvd25sb2FkJztcclxuICAgIHJldHVybiBidXR0b247XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZ28oKSB7XG4gIGNvbnN0IG1haW5Mb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zaGFkb3dcbiAgbWFpbkxvZ28uaW5uZXJIVE1MID0gYFxuICAgIDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBjbGFzcz0nc3ZnLWxvZ28nIHdpZHRoPScyMDAnIGhlaWdodD0nMjAwJyB2aWV3Ym94PScwIDAgNTAwIDUwMCc+XG4gICAgICA8Zz5cbiAgICAgICAgPHRleHQgeD0nMTEwJyB5PScyNTAnIGZvbnQtZmFtaWx5PSdIZWx2ZXRpY2EnIGZvbnQtc2l6ZT0nMTgwJyBmaWxsPSdyZ2JhKDMwLCAzMCwgMzAsIC44KSc+XG4gICAgICAgICAgYnx8clxuICAgICAgICA8L3RleHQ+XG4gICAgICAgIDxwYXRoIGlkPSdsb2FkaW5nQmFyJyBkPSdNOTAgMzMwIGggMzIwJyBzdHlsZT0nb3BhY2l0eTogMDsnIHN0cm9rZS13aWR0aD0yMCBzdHJva2U9J3JnYmEoMjMwLCAyMzAsIDIzMCwgLjgpJyAvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICBgO1xuICByZXR1cm4gbWFpbkxvZ287XG59XG4iLCIvLyBjc3MgY2xhc3M9XCJzdmctJ3gnY2hldnJvblwiXHJcbmltcG9ydCB7IGVsQ2xhc3MsIG1ha2VCdG4gfSBmcm9tICcuLi8uLi91dGlscyc7XHJcblxyXG5mdW5jdGlvbiB1cENoZXZyb24oKSB7XHJcbiAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICBmcmFnLmlubmVySFRNTCA9IGBcclxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLXVwY2hldnJvblwiIHdpZHRoPVwiODBcIiB2aWV3Ym94PVwiMCAwIDMwIDEyXCI+XHJcbiAgICAgIDxwYXRoIHN0cm9rZS13aWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGQ9XCJNMiAxMCBMIDE1IDIgTCAyOCAxMFwiLz5cclxuICAgIDwvc3ZnPlxyXG4gIGA7XHJcbiAgcmV0dXJuIGZyYWc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRvd25DaGV2cm9uKCkge1xyXG4gIGNvbnN0IGJ1dHRvbiA9IG1ha2VCdG4oJ3Njcm9sbGRvd24nLCAnc2Nyb2xsZG93bicpO1xyXG4gIGJ1dHRvbi5pbm5lckhUTUwgPSBgXHJcbiAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBjbGFzcz1cInN2Zy1kb3duY2hldnJvblwiIHdpZHRoPVwiODBcIiB2aWV3Ym94PVwiMCAwIDMwIDE4XCI+XHJcbiAgICAgIDx0ZXh0IHg9XCI1XCIgeT1cIjRcIiBmb250LXNpemU9XCI0XCIgZm9udC1mYW1pbHk9XCJzYW5zLXNlcmlmXCI+c2Nyb2xsIGRvd248L3RleHQ+XHJcbiAgICAgIDxwYXRoIGNsYXNzPVwiYW5pbWF0ZS1kb3duY2hldnJvblwiIHN0cm9rZS13aWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGQ9XCJNMiA3IEwgMTUgMTUgTCAyOCA3XCIvPlxyXG4gICAgPC9zdmc+XHJcbiAgYDtcclxuICByZXR1cm4gYnV0dG9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsZWZ0Q2hldnJvbigpIHtcclxuICByZXR1cm4gYFxyXG4gIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLWxlZnRjaGV2cm9uXCIgaGVpZ2h0PVwiODBcIiB2aWV3Ym94PVwiMCAwIDEyIDMwXCI+XHJcbiAgICA8cGF0aCBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBkPVwiTTEwIDIgTCAyIDE1IEwgMTAgMjhcIi8+XHJcbiAgPC9zdmc+XHJcbiBgO1xyXG59XHJcblxyXG5mdW5jdGlvbiByaWdodENoZXZyb24oKSB7XHJcbiAgcmV0dXJuIGBcclxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3ZnLXJpZ2h0Y2hldnJvblwiIGhlaWdodD1cIjgwXCIgdmlld2JveD1cIjAgMCAxMiAzMFwiPlxyXG4gICAgICA8cGF0aCBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBkPVwiTTIgMiBMIDEwIDE1IEwgMiAyOFwiLz5cclxuICAgIDwvc3ZnPlxyXG4gIGA7XHJcbn1cclxuXHJcbmV4cG9ydCB7IHVwQ2hldnJvbiwgZG93bkNoZXZyb24sIGxlZnRDaGV2cm9uLCByaWdodENoZXZyb24gfTtcclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdmlld0ljb24oKSB7XHJcbiAgY29uc3QgZXllID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpOy8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2hhZG93XHJcbiAgZXllLmlubmVySFRNTCA9IGBcclxuICAgIDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBjbGFzcz0nc3ZnLXZpZXctaWNvbicgd2lkdGg9JzIwJyB2aWV3Ym94PScwIDAgMjEwIDE0MCc+XHJcbiAgICAgICA8cGF0aCBkPVwiTTUgNzAgQSAxMTAgMTAwIDAgMCAxIDIwMCA3MCBBIDExMCAxMDAgMCAwIDEgNSA3MFwiIHN0cm9rZT1cIm5vbmVcIiBmaWxsPVwibGlnaHRncmV5XCIgc3Ryb2tlLXdpZHRoPVwiMVwiLz5cclxuICAgICAgPGNpcmNsZSBjeD1cIjEwNVwiIGN5PVwiNzBcIiByPVwiMzVcIiBzdHJva2U9XCJ3aGl0ZVwiIGZpbGw9XCJsaWdodGdyZXlcIiBzdHJva2Utd2lkdGg9XCI1XCI+XHJcbiAgICA8L3N2Zz5cclxuICBgO1xyXG4gIGV5ZS5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcclxuICAgIG1hcmdpbi10b3A6IC4yNWVtO1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAuMjVlbTtcclxuICBgO1xyXG4gIHJldHVybiBleWU7XHJcbn1cclxuIiwiLyogZ2xvYmFsIFZlbG9jaXR5ICovXG5cbmNvbnN0IFZlbG9jaXR5ID0gcmVxdWlyZSgnLi4vLi4vbm9kZV9tb2R1bGVzL3ZlbG9jaXR5LWFuaW1hdGUvdmVsb2NpdHkubWluLmpzJyk7XG5yZXF1aXJlKCcuLi8uLi9ub2RlX21vZHVsZXMvdmVsb2NpdHktYW5pbWF0ZS92ZWxvY2l0eS51aS5taW4uanMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtYnV0dG9uJyk7XG4gIGNvbnN0IGhvbWVMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi1ob21lJyk7XG4gIGNvbnN0IHRleHQgPSBidXR0b24ucXVlcnlTZWxlY3RvcigndGV4dCcpO1xuXG4gIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ29mZicpID8gc2hvd01lbnUoKSA6IGNsb3NlTWVudSgpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgZnVuY3Rpb24gc2hvd01lbnUoKSB7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29mZicpO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdvbicpO1xuICAgIHN0YWdnZXIuc2hvdygpO1xuICAgIHRleHQuaW5uZXJIVE1MID0gJ2Nsb3NlJztcbiAgICBob21lTGluay5mb2N1cygpO1xuICAgIGFuaW1hdGVNZW51Lm9wZW4oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlTWVudSgpIHtcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb24nKTtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb2ZmJyk7XG4gICAgc3RhZ2dlci5oaWRlKCk7XG4gICAgdGV4dC5pbm5lckhUTUwgPSAnbWVudSc7XG4gICAgYW5pbWF0ZU1lbnUuY2xvc2UoKTtcbiAgfVxufVxuXG5jb25zdCBzdGFnZ2VyID0gKGZ1bmN0aW9uIHN0YWdnZXIoKSB7XG4gIGNvbnN0IG1haW5OYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1uYXYnKTtcbiAgY29uc3QgbWVudUl0ZW1zID0gbWFpbk5hdi5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuICBjb25zdCBkZWxheSA9IDgwO1xuXG4gIGZ1bmN0aW9uIHN0YWdnZXJTaG93KCkge1xuICAgIGxldCBpID0gMDtcbiAgICBtYWluTmF2LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogYmxvY2snO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uIHJ1bigpIHtcbiAgICAgIGlmIChpIDwgbWVudUl0ZW1zLmxlbmd0aCkge1xuICAgICAgICBtZW51SXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnc2hvdy1tZW51LWl0ZW0nKTtcbiAgICAgICAgc2V0VGltZW91dChydW4sIGRlbGF5KTtcbiAgICAgIH1cbiAgICAgIGkgKz0gMTtcbiAgICB9LCBkZWxheSk7XG4gICAgY2xlYXJUaW1lb3V0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFnZ2VySGlkZSgpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gcnVuKCkge1xuICAgICAgaWYgKGkgPCBtZW51SXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIG1lbnVJdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93LW1lbnUtaXRlbScpO1xuICAgICAgICBzZXRUaW1lb3V0KHJ1biwgZGVsYXkpO1xuICAgICAgfVxuICAgICAgaSArPSAxO1xuICAgIH0sIGRlbGF5KTtcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IG1haW5OYXYuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJzsgfSwgZGVsYXkgKiBtZW51SXRlbXMubGVuZ3RoKTtcbiAgICBjbGVhclRpbWVvdXQoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2hvdzogc3RhZ2dlclNob3csXG4gICAgaGlkZTogc3RhZ2dlckhpZGUsXG4gIH07XG59KCkpO1xuXG5jb25zdCBhbmltYXRlTWVudSA9IChmdW5jdGlvbiBhbmltYXRlTWVudSgpIHtcbiAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWVudS1saW5lJyk7XG4gIGNvbnN0IGIxID0gc3ZnWzBdO1xuICBjb25zdCBiMiA9IHN2Z1sxXTtcbiAgY29uc3QgYjMgPSBzdmdbMl07XG5cbiAgZnVuY3Rpb24gYW5pbWF0ZU9wZW5CdG4oKSB7XG4gICAgY29uc3QgdG9wU2VxID0gW1xuICAgICAgeyBlOiBiMSwgcDogeyB0cmFuc2xhdGVZOiA2IH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgICAgeyBlOiBiMSwgcDogeyByb3RhdGVaOiA0NSB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICBdO1xuICAgIGNvbnN0IGJvdHRvbVNlcSA9IFtcbiAgICAgIHsgZTogYjMsIHA6IHsgdHJhbnNsYXRlWTogLTYgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgICB7IGU6IGIzLCBwOiB7IHJvdGF0ZVo6IC00NSB9LCBvOiB7IGR1cmF0aW9uOiAnMTAwbXMnIH0gfSxcbiAgICBdO1xuXG4gICAgYjEuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0tb3JpZ2luJywgJ2NlbnRlciBjZW50ZXIgMCcpO1xuICAgIGIzLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtLW9yaWdpbicsICdjZW50ZXIgY2VudGVyIDAnKTtcbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZSh0b3BTZXEpO1xuICAgIFZlbG9jaXR5KGIyLCB7IG9wYWNpdHk6IDAgfSwgMTAwKTtcbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZShib3R0b21TZXEpO1xuICB9XG5cbiAgZnVuY3Rpb24gYW5pbWF0ZUNsb3NlQnRuKCkge1xuICAgIGNvbnN0IHRvcExpbmUgPSBbXG4gICAgICB7IGU6IGIxLCBwOiB7IHJvdGF0ZVo6IDAgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgICB7IGU6IGIxLCBwOiB7IHRyYW5zbGF0ZVk6IDAgfSwgbzogeyBkdXJhdGlvbjogJzEwMG1zJyB9IH0sXG4gICAgXTtcbiAgICBjb25zdCBib3R0b21MaW5lID0gW1xuICAgICAgeyBlOiBiMywgcDogeyByb3RhdGVaOiAwIH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgICAgeyBlOiBiMywgcDogeyB0cmFuc2xhdGVZOiAwIH0sIG86IHsgZHVyYXRpb246ICcxMDBtcycgfSB9LFxuICAgIF07XG5cbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZSh0b3BMaW5lKTtcbiAgICBWZWxvY2l0eShiMiwgJ3JldmVyc2UnLCAxMDApO1xuICAgIFZlbG9jaXR5LlJ1blNlcXVlbmNlKGJvdHRvbUxpbmUpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBvcGVuOiBhbmltYXRlT3BlbkJ0bixcbiAgICBjbG9zZTogYW5pbWF0ZUNsb3NlQnRuLFxuICB9O1xufSgpKTtcbiIsImltcG9ydCBmaWxlIGZyb20gJy4vZG9jSGFuZGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHZpZXdIYW5kbGVyKCkge1xuICBjb25zdCBkb3dubG9hZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZC1idG4uYnRuJyk7XG4gIGNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXN1bWUtdmlld2VyJyk7XG4gIGNvbnN0IHN3aXRjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWxlLXR5cGUuc3dpdGNoJyk7XG5cbiAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3JjJywgZmlsZS5nZXRTcmMoKSk7XG5cbiAgc3dpdGNoIChmaWxlLmdldFZhbCgpKSB7XG4gICAgY2FzZSAnaHRtbCc6XG4gICAgICBzd2l0Y2hCdG4uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICBzd2l0Y2hCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgIGRvd25sb2FkQnRuLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgZG93bmxvYWRCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgICAgIGRvd25sb2FkQnRuLnJlbW92ZUF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdwZGYnOlxuICAgIGNhc2UgJ2RvYyc6XG4gICAgICBzd2l0Y2hCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICBzd2l0Y2hCdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgZG93bmxvYWRCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICBkb3dubG9hZEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBoaXN0b3J5ICovXHJcbi8qIGVzbGludCBpbXBvcnQvZmlyc3Q6IDAgbm8tdW5kZWY6IDAgKi9cclxuLyogZXNsaW50IG5vLXJlc3RyaWN0ZWQtZ2xvYmFsczogW1wiZXJyb3JcIiwgXCJldmVudFwiXSAqL1xyXG5cclxuaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XHJcbmltcG9ydCB0b2dnbGVNZW51IGZyb20gJy4vY29tcG9uZW50cy90b2dnbGVNZW51JztcclxuaW1wb3J0IG1vZGFsIGZyb20gJy4vY29tcG9uZW50cy9tb2RhbCc7XHJcbmltcG9ydCBmaWxlIGZyb20gJy4vY29tcG9uZW50cy9kb2NIYW5kbGVyJztcclxuaW1wb3J0IHsgZG93bkNoZXZyb24gfSBmcm9tICcuL2NvbXBvbmVudHMvc3ZnL3Njcm9sbENoZXZyb24nO1xyXG5pbXBvcnQgbG9hZGVyIGZyb20gJy4vY29tcG9uZW50cy9pbXBvcnRMb2FkZXInO1xyXG5pbXBvcnQgdmlld0ljb24gZnJvbSAnLi9jb21wb25lbnRzL3N2Zy92aWV3SWNvbic7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWJ1dHRvbicpO1xyXG4gIGNvbnN0IGhvbWVTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlY3Rpb24taG9tZScpO1xyXG4gIGNvbnN0IGhvbWVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWhvbWUnKTtcclxuICBjb25zdCByZXN1bWVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdW1lLWJ0bicpO1xyXG4gIGNvbnN0IHNjcm9sbENoZXZyb24gPSBkb3duQ2hldnJvbigpO1xyXG4gIGNvbnN0IGljb25TdmcgPSB2aWV3SWNvbigpO1xyXG5cclxuICByZXN1bWVCdG4uaW5zZXJ0QmVmb3JlKGljb25TdmcsIHJlc3VtZUJ0bi5jaGlsZE5vZGVzWzBdKTtcclxuXHJcbiAgbWVudUJ1dHRvbi5vbmNsaWNrID0gdG9nZ2xlTWVudTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY3IteWVhcicpLmlubmVySFRNTCA9IGAtICR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfWA7XHJcblxyXG4gIGxvYWRlcigpO1xyXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBibG9jayc7XHJcbiAgbWVudUJ1dHRvbi5mb2N1cygpO1xyXG4gIGhvbWVTZWN0aW9uLmFwcGVuZENoaWxkKHNjcm9sbENoZXZyb24pO1xyXG4gIHNjcm9sbENoZXZyb24uY2xhc3NMaXN0LmFkZCgnaW50cm8taW5pdC11aScpO1xyXG5cclxuICBob21lQnRuLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgcmVtb3ZlSGFzaFVybCgpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcbiAgcmV0dXJuIGV2ZW50O1xyXG59KTtcclxuXHJcbi8vIFNoaW1zICYgUG9seWZpbGxzIG1zRWRnZVxyXG4oZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0eXBlb2YgTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcclxuICBOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xyXG4gIHJldHVybiB0cnVlO1xyXG59KCkpOyAvLyBmb3JlYWNoXHJcblxyXG5mdW5jdGlvbiByZW1vdmVIYXNoVXJsKCkge1xyXG4gIGNvbnN0IGxvYyA9IHdpbmRvdy5sb2NhdGlvbjtcclxuICBsZXQgc2Nyb2xsVjtcclxuICBsZXQgc2Nyb2xsSDtcclxuXHJcbiAgaWYgKCdyZXBsYWNlU3RhdGUnIGluIGhpc3RvcnkpIHtcclxuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKCcnLCBkb2N1bWVudC50aXRsZSwgbG9jLnBhdGhuYW1lICsgbG9jLnNlYXJjaCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIFByZXZlbnQgc2Nyb2xsaW5nIGJ5IHN0b3JpbmcgdGhlIHBhZ2UncyBjdXJyZW50IHNjcm9sbCBvZmZzZXRcclxuICAgIHNjcm9sbFYgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcclxuICAgIHNjcm9sbEggPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQ7XHJcblxyXG4gICAgbG9jLmhhc2ggPSAnJztcclxuXHJcbiAgICAvLyBSZXN0b3JlIHRoZSBzY3JvbGwgb2Zmc2V0LCBzaG91bGQgYmUgZmxpY2tlciBmcmVlXHJcbiAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IHNjcm9sbFY7XHJcbiAgICBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgPSBzY3JvbGxIO1xyXG4gIH1cclxufVxyXG5cclxuIiwiZnVuY3Rpb24gZWxDbGFzcyhlbGVtZW50ID0gJ2RpdicsIGNsYXNzZXMgPSAwKSB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50KTtcbiAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc2VzKTtcbiAgcmV0dXJuIGVsO1xufVxuXG5mdW5jdGlvbiBtYWtlQnRuKG5hbWUsIGNsYXNzZXMgPSAwKSB7XG4gIGNvbnN0IGJ1dHRvbiA9IGVsQ2xhc3MoJ2J1dHRvbicsIGNsYXNzZXMpO1xuICBidXR0b24uc2V0QXR0cmlidXRlKCduYW1lJywgbmFtZSk7XG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gIGJ1dHRvbi5pbm5lckhUTUwgPSBuYW1lO1xuICByZXR1cm4gYnV0dG9uO1xufVxuXG5leHBvcnQgeyBlbENsYXNzLCBtYWtlQnRuIH07XG4iXX0=
