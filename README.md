cocotte-flow
=====

#はじめに

非同期処理を簡単に行うモジュールです  
coの簡易バージョンで、thunkのみをサポートします  

ジェネレーターを使用するため、harmonyオプションを有効にする必要があります

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

