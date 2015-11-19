/*
 * @license
 * cocotte-flow v0.1.2
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

// エラーメッセージ
var NOT_GENERATOR = 'flowの引数がジェネレーターではありません';
var NOT_THUNK = 'yieldはthunkもしくはthunkの配列を設定しなければなりません';

/**
 * ジェネレータを実行
 * @method flow
 * @param  {GeneratorFunction} fn
 */
function flow(fn) {
  if (!isGenerator(fn)) {
    throw new Error(NOT_GENERATOR);
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
        next(new Error(NOT_THUNK));
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
  return Array.isArray(value) && value.every(function(fn) {return isThunk(fn);});
}

/**
 * 並列処理
 * @method parallel
 * @param  {Array.Function} fns
 * @param  {Function}       next
 */
function parallel (fns, next) {
  var len = fns.length;
  var values = [];
  var skip = false;
  function done(i, e, v) {
    values[i] = v;
    len--;
    if (!skip && (e || !len)) {
      skip = true;
      next(e, e ? null : values);
    }
  }
  fns.forEach(function (fn, i) {
    fn(function(e, v){done(i, e, v);});
  });
}