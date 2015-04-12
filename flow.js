
function flow(fn) {
  var gen;
  if (fn && fn.constructor && fn.constructor.name === 'GeneratorFunction') {
    gen = fn();
    next();
  } else {
    throw new Error('flow only supports a generator function');
  }
  function next(e, v) {
    var r = e ? gen.throw(e) : gen.next(v);
    if (!r.done) {
      if (typeof r.value === 'function') {
        r.value(function(e, v){next(e, v);});
      } else {
        next(null, r.value);
      }
    }
  }
}

module.exports = exports = flow;