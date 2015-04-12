var flow = require('cocotte-flow');

var x = 0;
function thunk (callback) {
  setTimeout(function () {callback(null, x++);}, 250);
}

flow(function * () {
  console.log(yield thunk);
  console.log(yield thunk);
  console.log(yield thunk);
  console.log(yield thunk);
  console.log(yield thunk);
});
