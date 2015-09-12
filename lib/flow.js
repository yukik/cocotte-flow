/*
 * @license
 * cocotte-flow v0.1.1
 * Copyright(c) 2015 Yuki Kurata <yuki.kurata@gmail.com>
 * MIT Licensed
 */

module.exports = flow;

// クライアント用
if (typeof window === 'object') {
  if (!window.Cocotte){
    window.Cocotte = {};
  }
  window.Cocotte.flow = flow;
}

/**
 * ジェネレータを実行
 * @method flow
 * @param  {GeneratorFunction} fn
 */
function flow(fn) {
  if (!isGenerator(fn)) {
    throw new Error('flow only supports a generator function');
  }
  var gen = fn();
  next();
  function next(e, v) {
    var r = e ? gen.throw(e) : gen.next(v);
    if (!r.done) {
      if (isThunk(r.value)) {
        r.value(function(e, v){next(e, v);});
      } else if (isThunkArray(r.value)) {
        parallel(r.value, next);
      } else {
        next(new Error('yield not-thunk'));
      }
    }
  }
}

/**
 * ジェネレータ判別
 * @method isGenerator
 * @param  {GeneratorFunction}  fn
 * @return {Boolean}
 */
function isGenerator(fn) {
  return fn && fn.constructor && fn.constructor.name === 'GeneratorFunction';
}

/**
 * thunk判別
 * @method isThunk
 * @param  {Function} value
 * @return {Boolean} 
 */
function isThunk(value) {
  return typeof value === 'function';
}

/**
 * thunk配列判別
 * @method isThunkArray
 * @param  {Array.Function}     value
 * @return {Boolean}
 */
function isThunkArray(value) {
  return Array.isArray(value) && value.length &&
         value.every(function(fn) {return isThunk(fn);});
}

/**
 * 並列処理
 * @method parallel
 * @param  {Array.Function} fns
 * @param  {Function}       next
 */
function parallel (fns, next) {
  var len = fns.length;
  var values = new Array(len);
  var err = null;
  function done(i, e, v) {
    if (err) {
      return;
    }
    err = err || e;
    values[i] = v;
    len--;
    if (e || len === 0) {
      next(e, e ? null : values);
    }
  }
  fns.forEach(function (fn, i) {
    fn(function(e, v){done(i, e, v);});
  });
}