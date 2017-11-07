"use strict"
class Tjax {
    constructor(options) {
        this._options = {
            areas: ["body"],
            wait: 0,
            changeTitle: true,
            loadScript: true,
            controlScroll: true,
            waitPopState: true,
            onErrorNotMove: false
        };
        this._objExtend(this._options, options);

        this._eventPrefix = "tjax:";
        this._req = null;// XMLHttpRequest
        this._reqTime = 0;// req開始時刻
        this._task = null;// TjaxTask
        this._active = this.isSupported();


        this._onPopStateListener = {
            that: this,
            handleEvent: this._onPopState
        };

        this._init();
    }

    /**
     * オプションを設定する
     * @param {Object} options 
     */
    setOptions(options) {
        this._objExtend(this._options, options);
        this._init();
    }

    /**
     * リスナー関連を初期化
     */
    _init() {
        if (!this._active) return;
        var ops = this._options;
        window.history.scrollRestoration =
            ops.controlScroll ? "manual" : "auto";
        window.removeEventListener("popstate", this._onPopStateListener);
        window.addEventListener("popstate", this._onPopStateListener, true);
    }

    /**
     * ブラウザをサポートしているか
     */
    isSupported() {
        if (!window.history
            || !window.history.pushState
            || !window.history.replaceState
            || !DOMParser
        ) {
            return false;
        }
        try {
            new DOMParser().parseFromString("", "text/html");
        } catch (err) {
            return false;
        }
        return true;
    }

    /**
     * オプションに従ってpathを読み込む
     * @param {String} path path
     */
    load(path) {
        if (!this._active) {
            return false;
        }
        this._getHtml(path);
        return true;
    }

    /**
     * htmlを受け取ってオプションに従って置き換え処理を行う
     * @param {String} htmlString html
     */
    _replaceHtml(htmlString, path, fromPopstate, scrollY) {

        // popstateイベント以外からならpushStateする
        if (!fromPopstate) {
            var stateObj = {
                scrollY: window.pageYOffset,
                href: window.location.href
            };
            window.history.replaceState(stateObj, null, window.location.href);
            window.history.pushState(null, null, path);
        }

        // 待機時間の計算
        var that = this,
            wait = this._options.wait - (new Date().getTime() - this._reqTime);
        if (wait < 0 || (!this._options.waitPopState && fromPopstate)) {
            wait = 0;
        }

        // Stringからdocumentを生成する
        var parser = new DOMParser(),
            dummyDoc = parser.parseFromString(htmlString, "text/html");

        // taskを生成する
        this._task = new TjaxTask(wait, function () {
            that._onWaitEnd.call(that, dummyDoc, scrollY);
        });
    }

    /**
     * popstateイベント受け取り用
     * @param {PopStateEvent} event 
     */
    _onPopState(event) {
        event.preventDefault();

        var that = this.that;

        // 非アクティブならなにもしない
        if (!that._active) return;
        var scrollY;
        // controlScrollがtrueならstateからscrollYを取得
        if (that._options.controlScroll
            && event.state
            && isFinite(event.state.scrollY)
        ) {
            scrollY = event.state.scrollY;
        }


        // tjaxによるページ遷移を実行
        that._getHtml(window.location.href, true, scrollY);

        return false;
    }

    /**
     * 処理待機後に呼び出されるやつ
     * _replaceHtml -> TjaxTask -> _onWaitEnd
     * @param {document} dummyDoc 
     * @param {int} scrollY 
     */
    _onWaitEnd(dummyDoc, scrollY) {
        var areas = this._options.areas;
        // タイトル更新
        if (this._options.changeTitle) {
            document.title = dummyDoc.title;
        }

        // スクロール位置を更新
        if (this._options.controlScroll) {
            if (isFinite(scrollY)) {
                window.scroll(0, scrollY);
            } else {
                window.scroll(0, 0);
            }
        }

        // areasにあるqueryのelementを置き換える
        for (var i = 0; i < areas.length; i++) {
            var query = areas[i],
                elm = dummyDoc.querySelector(query),
                oldElm = document.querySelector(query);
            if (!elm || !oldElm) continue;
            var oldElmParent = oldElm.parentNode;
            if (!oldElmParent) continue;
            oldElmParent.replaceChild(elm, oldElm);
            if (this._options.loadScript) {
                this._loadScript(elm);
            }
        }
        this._trigger("end");
    }

    /**
     * elm内のscriptをすべて読み込む
     * @param {Element} elm 対象となるelement
     */
    _loadScript(elm) {
        var scripts = elm.querySelectorAll("script");
        for (var i = 0; i < scripts.length; i++) {
            var oldScript = scripts[i];
            var newScript = document.createElement("script");
            for (var n = 0; n < oldScript.attributes.length; n++) {
                var prop = oldScript.attributes[n];
                newScript.setAttribute(prop.name, prop.value);
            }
            newScript.innerHTML = oldScript.innerHTML;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        }
    }

    /**
     * HttpRequestを使ってhtmlを読み込む
     * @param {String} path 取得するpath(URL)
     */
    _getHtml(path, fromPopstate, scrollTop) {
        if (this._req) {
            this._req.abort();
        }
        if (this._task) {
            this._task.cancel();
            this._task = null;
        }
        this._req = new XMLHttpRequest();
        var that = this,
            req = this._req;
        this._reqTime = new Date().getTime();
        req.open("GET", path);
        req.addEventListener("readystatechange", function () {
            if (4 == req.readyState) {
                if (req.status == 200 || req.status == 304) {
                    that._replaceHtml(req.responseText, path, fromPopstate, scrollTop);
                    that._req = null;
                    that._trigger("loaded");
                } else {
                    if (that._options.onErrorNotMove) {
                        that._trigger("error");
                    } else {
                        window.location = path;
                    }
                }
                that._loading = false;
            }
        });
        req.send();
        this._trigger("start");
    }

    /**
     * イベントを発火させる
     * @param {String} eventName 
     */
    _trigger(eventName) {
        var event;
        if (document.createEvent) {
            event = document.createEvent("Event");
        } else {
            event = document.createEventObject("Event");
        }
        event.initEvent(
            this._eventPrefix + eventName,
            true, true);
        if (document.dispatchEvent) {
            document.dispatchEvent(event);
        } else {
            document.fireEvent(event);
        }
    }

    /**
     * 引数1に引数2以降をくっつける
     * @param {Object} target 
     */
    _objExtend(target) {
        var arg = arguments,
            src, keys, key;
        for (var i = 1; i < arg.length; i++) {
            src = arg[i];
            if (src == undefined || src == null) {
                continue;
            }
            keys = Object.keys(src);
            for (var n = 0; n < keys.length; n++) {
                key = keys[n];
                target[key] = src[key];
            }
        }
        return target;
    }
}


class TjaxTask {
    constructor(wait, callback) {
        this._timer = setTimeout(callback, wait);
    }
    cancel() {
        clearTimeout(this._timer);
    }
}
