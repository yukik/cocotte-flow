var flow = typeof window === 'object' ? Cocotte.flow : require('cocotte-flow');

var x = 0;
function thunk (callback) {
  setTimeout(function () {
    callback(null, x++);
  }, 150);
}

flow(function * () {
  var i = 3;
  while(i--) {
    console.log(yield thunk);
  }
});