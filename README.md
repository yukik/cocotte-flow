cocotte-flow
=====

# はじめに

非同期処理を簡単に行うモジュールです  
coの簡易バージョンで、thunkのみをサポートします  
coがいずれthunkをサポートしなくなった場合の代替モジュールです  

ジェネレーターを使用するため、nodeのバージョンによっては
harmonyオプション有効にする必要があります

# 例

```
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
```

coと異なりメソッドを呼び出した時点で実行されます

```
// coでは実行は明示的に行う
co(generator)();

// flowは不要
flow(generator);
``` 

flowからcoに書き換える場合は注意してください

# thunkとは

引数にコールバックのみをもつ関数です  
第一引数に例外を、第二引数に返したい値を設定しコールバックを実行すると、
yieldで値を取得することができます


# 並列

thunkを配列にすることで並列処理します  
結果はすべてのthunkが完了した時に配列で返します


```
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
```






