# tjax

AjaxとpushStateを使用した非同期ページ置換JavaScriptライブラリ

## Download

[tjax.js](https://raw.githubusercontent.com/totoraj930/tjax/master/dest/tjax.js)


## デモ

[https://totoraj930.github.io/tjax](https://totoraj930.github.io/tjax)

## 使い方

### 基本

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <title>tjax</title>
    <script src="tjax.js"></script>
    <script>
        var tjax = new Tjax();

        if (!tjax.isSupported()) return;

        document.addEventListener("click", function (event) {
            var target = event.target;
            if (target.hasAttribute("data-tjax")) {
                event.preventDefault();
                event.stopPropagation();
                tjax.load(target.href);
                return false;
            }
        });
    </script>
</head>
<body>
    <a href="./page2.html" data-tjax>Go to page2</a>
</body>
</html>
```

## API

### `Tjax.setOptions`

オプションをセットします。

[Options](#options)を参照してください。

```javascript
tjax.setOptions({
    areas: ["#replace_area", "#foot"],
    wait: 400
});
```

### `Tjax.load`

オプションに従って、ページを読み込みElementを置き換えます。

```javascript
tjax.load("./page-2.html");
```

### `Tjax.isSupported`

ブラウザーをサポートしてるかを返します。

```javascript
tjax.isSupported();
```

### Options

|Name|Description|Default|
|-|-|-|
|`areas`|置き換えるelementのセレクタ配列|`["body"]`|
|`wait`|置き換えまでの待機時間(ms)|`0`|
|`changeTitle`|titleを変更するか|`true`|
|`loadScript`|scriptを読み込むか|`true`|
|`controlScroll`|スクロールを制御するか|`true`|
|`waitPopState`|"onpopstate"でも"wait"を利用するか|`true`|
|`onErrorNotMove`|エラーが出た時にページ移動を行わない|`false`|

### Events

全てのイベントが"document"にdispatchされます。

|Name|Description|
|-|-|
|`tjax:start`|処理が開始されたとき|
|`tjax:loaded`|XMLHttpRequestが完了したとき|
|`tjax:error`|エラーが発生したとき|
|`tjax:end`|処理が完了したとき|

## サポートブラウザ

* Google Chrome
* Firefox
* IE10+
* Edge

### わからない

* Safari

## Author
**Reona Oshima (totoraj)**
* [http://totoraj.net](http://totoraj.net/)
* [Twitter: @totoraj930](https://twitter.com/totoraj930/)


## License
Copyright &copy; 2017 Reona Oshima (totoraj)  
This work is released  under the MIT License.  
<http://opensource.org/licenses/mit-license.php>