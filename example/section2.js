var flow = typeof window === 'object' ? Cocotte.flow : require('cocotte-flow');

flow(function * () {
  console.log(yield [getThunk(1), getThunk(2), getThunk(3)]);
  console.log(yield [getThunk(4), getThunk(5), getThunk(6)]);
  console.log(yield [getThunk(7), getThunk(8), getThunk(9)]);
});

function getThunk (x) {
  return function thunk (callback) {
    setTimeout(function () {
      callback(null, x);
    }, randomTime());
  };
}

// 0.1秒から0.5秒の間をランダムで返す
function randomTime () {
  return 100 + Math.floor(Math.random() * 400);
}