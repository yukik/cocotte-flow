var flow = require('cocotte-flow');

flow(function * () {
  console.log(yield [getThunk(1), getThunk(2), getThunk(3)]);
  console.log(yield [getThunk(4), getThunk(5), getThunk(6)]);
});

function getThunk (x) {
  return function (callback) {
    setTimeout(function () {
      callback(null, x);
    }, randomTime());
  };
}
function randomTime () {
  return 200 + Math.floor(Math.random() * 200);
}