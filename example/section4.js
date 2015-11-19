var flow = require('cocotte-flow');
var fs = require('fs');

flow(function * () {
  console.log(yield readFile(__filename));
});

function readFile(filePath) {
  return function (callback) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
      callback(err, data);
    });
  };
}