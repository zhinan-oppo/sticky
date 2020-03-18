"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var scroll_handle_1 = tslib_1.__importDefault(require("@zhinan-oppo/scroll-handle"));
function setStyles(element, styles) {
    if (styles === void 0) { styles = {}; }
    [
        "left",
        "bottom",
        "top",
        "position",
        "transform",
        "margin",
        "width",
        "height"
    ].forEach(function (k) {
        element.style[k] = styles[k] || "";
    });
}
function warn(message) {
    // eslint-disable-next-line no-console
    console.warn("[sticky] " + message);
}
function initStickyItem(dom, _a, debug) {
    var _b = _a === void 0 ? { scrollHandlers: {} } : _a, container = _b.container, _c = _b.scrollHandlers, scrollHandlers = _c === void 0 ? {} : _c;
    if (debug === void 0) { debug = false; }
    var element;
    var parent;
    if (typeof dom === "string") {
        var doms = document.querySelectorAll(dom);
        if (doms.length === 0) {
            warn("\u672A\u9009\u4E2D\u4EFB\u4F55 DOM: " + dom);
            return null;
        }
        if (doms.length > 1) {
            warn("\u9009\u4E2D\u4E86\u591A\u4E2A DOM\uFF0C\u4F46\u53EA\u6709\u7B2C\u4E00\u4E2A\u4F1A\u751F\u6548: " + dom);
        }
        element = doms[0];
    }
    else {
        element = dom;
    }
    if (!container) {
        if (element.parentElement === null) {
            warn("没有指定或找不到 sticky container");
            return null;
        }
        else {
            parent = element.parentElement;
        }
    }
    else if (typeof container === "string") {
        parent = document.querySelectorAll(container)[0];
    }
    else {
        parent = container;
    }
    element.setAttribute("z-sticky-manually", "");
    element.style.position = "relative";
    element.style.width = "100%";
    parent.style.position = "relative";
    var itemRect = element.getBoundingClientRect();
    var containerRect = parent.getBoundingClientRect();
    if (debug) {
        // eslint-disable-next-line no-console
        console.debug({
            itemRect: itemRect,
            containerRect: containerRect,
            element: element
        });
    }
    var bottomToParentTop = itemRect.bottom - containerRect.top;
    var top = itemRect.top - containerRect.top + "px";
    var left = itemRect.left + "px";
    var width = itemRect.width + "px";
    var height = itemRect.height + "px";
    var removeHandle = scroll_handle_1.default({
        dom: parent,
        start: { placement: "top" },
        end: { distance: bottomToParentTop },
        handlers: {
            before: scrollHandlers.before,
            inView: scrollHandlers.inView,
            after: scrollHandlers.after,
            onStateChange: function (doms, state, oldState) {
                switch (state) {
                    case "inView":
                        setStyles(element, {
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            position: "fixed",
                            bottom: "auto",
                            transform: "none",
                            margin: "0"
                        });
                        break;
                    case "after":
                        setStyles(element, {
                            left: element.getBoundingClientRect().left -
                                parent.getBoundingClientRect().left + "px",
                            bottom: "0",
                            position: "absolute",
                            top: "auto",
                            transform: "none",
                            margin: "0"
                        });
                        break;
                    case "before":
                    default:
                        setStyles(element);
                }
                if (debug) {
                    var position = state === "inView" ? "fixed" : state === "after" ? "absolute" : "";
                    // eslint-disable-next-line no-console
                    console.debug("sticky item: " + position, element);
                }
                if (scrollHandlers.onStateChange) {
                    scrollHandlers.onStateChange(doms, state, oldState);
                }
            }
        }
    });
    var destroy = function () {
        if (removeHandle) {
            removeHandle();
        }
    };
    return destroy;
}
exports.initStickyItem = initStickyItem;
function init(_a) {
    var _b = (_a === void 0 ? {} : _a).debug, debug = _b === void 0 ? false : _b;
    document.querySelectorAll(".sticky-item").forEach(function (element) {
        var manually = element.getAttribute("z-sticky-manually");
        // eslint-disable-next-line eqeqeq
        if (manually == undefined || manually === "false") {
            initStickyItem(element, {}, debug);
        }
    });
}
exports.init = init;
//# sourceMappingURL=index.js.map