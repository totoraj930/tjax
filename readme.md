# tjax

Asynchronous page replacement JavaScript library using Ajax and pushState.

## Download

[tjax.js](https://raw.githubusercontent.com/totoraj930/tjax/master/dest/tjax.js)

## Demo

[https://totoraj930.github.io/tjax](https://totoraj930.github.io/tjax)

## Usage

### Basic

```html
<!DOCTYPE html>
<html lang="en">
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

Set the option.

See [Options](#options).

```javascript
tjax.setOptions({
    areas: ["#replace_area", "#foot"],
    wait: 400
});
```

### `Tjax.load`

Load the page according to the option and replace the elements.

```javascript
tjax.load("./page-2.html");
```

### `Tjax.isSupported`

Return whether it supports browsers.

```javascript
tjax.isSupported();
```

### Options

|Name|Description|Default|
|-|-|-|
|`areas`|Selector array of elements to replace|`["body"]`|
|`wait`|Wait time to replace(ms)|`0`|
|`changeTitle`|Whether to change the title|`true`|
|`loadScript`|Whether to load the script|`true`|
|`controlScroll`|Whether to control the scroll|`true`|
|`waitPopState`|Whether to use "wait" for "onpopstate".|`true`|
|`onErrorNotMove`|Please feel it!!!(I can not write English!!!)|`false`|

### Events

All events dispatch to "document".

|Name|Description|
|-|-|
|`tjax:start`|When processing is started|
|`tjax:loaded`|When XMLHttpRequest completed|
|`tjax:error`|When an error occurs|
|`tjax:end`|When processing is completed|

## Supported Browsers

* Google Chrome
* Firefox
* IE10+
* Edge

### Do not know

* Safari

## Author
**Reona Oshima (totoraj)**
* [http://totoraj.net](http://totoraj.net/)
* [Twitter: @totoraj930](https://twitter.com/totoraj930/)


## License
Copyright &copy; 2017 Reona Oshima (totoraj)  
This work is released  under the MIT License.  
<http://opensource.org/licenses/mit-license.php>