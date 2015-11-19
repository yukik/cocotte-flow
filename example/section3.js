var flow = require('cocotte-flow');
var fs = require('fs');

flow(function * () {
  var readFile = fs.readFile.bind(fs, __filename, {encoding: 'utf-8'});
  console.log(yield readFile);
});
