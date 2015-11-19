var flow = typeof window === 'object' ? Cocotte.flow : require('cocotte-flow');

function thunk (callback) {
  callback(null, 1);
}

flow(function * () {
  var i = 1000;
  while(i--) {
    yield thunk;
  }
  console.log('done');
});