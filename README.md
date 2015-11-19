cocotte-flow
=====

# はじめに

非同期処理を簡単に行うモジュールです  
coの簡易バージョンで、thunkのみをサポートします  
coがいずれthunkをサポートしなくなった場合の代替モジュールです

# 利用方法

## node

nodeのバージョンによっては、harmonyオプション有効にする必要があります

```
npm install cocotte-flow
```

```
var flow = require('cocotte-flow');
```

## クライアントサイド

public/flow.min.jsを読み込んでください  
ジェネレータをサポートしていないブラウザでは動作しません

```
<script src="flow.min.js"></script>
<script>
  var flow = Cocotte.flow;
</script>
```

# 例

```
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
```

coと異なりメソッドを呼び出した時点で実行されます

```
// coでは実行は明示的に行う
co(generator).then();

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
```

# nodeの非同期処理をthunkに変換する

nodeのfsモジュールなどをthunkに変更することでflow内で簡単に使用することができます  

```
var flow = require('cocotte-flow');
var fs = require('fs');

flow(function * () {
  var readFile = fs.readFile.bind(fs, __filename, {encoding: 'utf-8'});
  console.log(yield readFile);
});
```

nodeに標準で用意されている非同期のメソッドは、最後の引数がcallback関数で
第一引数に例外を、第二引数に返したい値を設定します  
そのため、最後の引数以外をbindで固定してあげます

以下のように記述しても同じですが、bindを利用する方が簡単です

```
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
```

# coとの違い

coと異なり、yieldはthunkもしくはthunkの配列以外を受け取りません  
そのぶん記述は簡素で高速に動作します  

promiseも使用することはできないことに注意してください  
また、無限ループやあまりに多くのthunkを実行を一度のflowで記述するとスタックオーバーフローを起こします  
thunkの実行を1000以内におさえてください  
上記の点に注意して場合によりcoを代用してください
