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

function isGenerator(fn) {
  return fn && fn.constructor && fn.constructor.name === 'GeneratorFunction';
}

function isThunk(value) {
  return typeof value === 'function';
}

function isThunkArray(value) {
  return Array.isArray(value) && value.length &&
         value.every(function(fn) {return isThunk(fn);});
}

function parallel (fns, next) {
  var len = fns.length;
  var values = new Array(len);
  function done(i, e, v) {
    values[i] = v;
    len--;
    if (len === 0) {
      next(e, values);
    }
  }
  fns.forEach(function (fn, i) {
    fn(function(e, v){done(i, e, v);});
  });
}

module.exports = exports = flow;