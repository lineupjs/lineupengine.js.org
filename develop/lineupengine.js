/*! lineupengine - v1.0.0-alpha.3 - 2018
* https://sgratzl.github.io/lineupengine/
* Copyright (c) 2018 Samuel Gratzl; Licensed MIT*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["lineupengine"] = factory();
	else
		root["lineupengine"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["e"] = uniformContext;
/* harmony export (immutable) */ __webpack_exports__["b"] = nonUniformContext;
/* harmony export (immutable) */ __webpack_exports__["c"] = randomContext;
/* harmony export (immutable) */ __webpack_exports__["d"] = range;
/* harmony export (immutable) */ __webpack_exports__["a"] = frozenDelta;
/* harmony export (immutable) */ __webpack_exports__["f"] = updateFrozen;
var RowHeightException = (function () {
    function RowHeightException(index, y, height) {
        this.index = index;
        this.y = y;
        this.height = height;
    }
    Object.defineProperty(RowHeightException.prototype, "y2", {
        get: function () {
            return this.y + this.height;
        },
        enumerable: true,
        configurable: true
    });
    return RowHeightException;
}());
function uniformContext(numberOfRows, rowHeight, rowPadding) {
    if (rowPadding === void 0) { rowPadding = 0; }
    rowHeight += rowPadding;
    var exceptionsLookup = {
        keys: function () { return [].values(); },
        get: function () { return rowHeight; },
        has: function () { return false; },
        size: 0
    };
    return {
        exceptions: [],
        exceptionsLookup: exceptionsLookup,
        totalHeight: numberOfRows * rowHeight,
        numberOfRows: numberOfRows,
        defaultRowHeight: rowHeight,
        padding: function () { return rowPadding; }
    };
}
function mostFrequentValue(values) {
    var lookup = new Map();
    values.forEach(function (value) {
        lookup.set(value, (lookup.get(value) || 0) + 1);
    });
    if (lookup.size === 0) {
        return 20;
    }
    var sorted = Array.from(lookup).sort(function (a, b) {
        if (a[1] !== b[1]) {
            return b[1] - a[1];
        }
        return a[0] - b[0];
    });
    var mostFrequent = sorted[0][0];
    if (mostFrequent === 0) {
        return sorted.length > 1 ? sorted[1][0] : 20;
    }
    return mostFrequent;
}
function nonUniformContext(rowHeights, defaultRowHeight, rowPadding) {
    if (defaultRowHeight === void 0) { defaultRowHeight = NaN; }
    if (rowPadding === void 0) { rowPadding = 0; }
    var exceptionsLookup = new Map();
    var exceptions = [];
    var padding = typeof rowPadding === 'function' ? rowPadding : function () { return rowPadding; };
    if (isNaN(defaultRowHeight)) {
        defaultRowHeight = mostFrequentValue(rowHeights);
    }
    defaultRowHeight += padding(-1);
    var prev = -1, acc = 0, totalHeight = 0, numberOfRows = 0;
    rowHeights.forEach(function (height, index) {
        height += padding(index);
        totalHeight += height;
        numberOfRows++;
        if (height === defaultRowHeight) {
            return;
        }
        exceptionsLookup.set(index, height);
        var between = (index - prev - 1) * defaultRowHeight;
        prev = index;
        var y = acc + between;
        acc = y + height;
        exceptions.push(new RowHeightException(index, y, height));
    });
    return { exceptionsLookup: exceptionsLookup, exceptions: exceptions, totalHeight: totalHeight, defaultRowHeight: defaultRowHeight, numberOfRows: numberOfRows, padding: padding };
}
function randomContext(numberOfRows, defaultRowHeight, minRowHeight, maxRowHeight, ratio, seed) {
    if (minRowHeight === void 0) { minRowHeight = 2; }
    if (maxRowHeight === void 0) { maxRowHeight = defaultRowHeight * 10; }
    if (ratio === void 0) { ratio = 0.2; }
    if (seed === void 0) { seed = Date.now(); }
    var actSeed = seed;
    var random = function () {
        var x = Math.sin(actSeed++) * 10000;
        return x - Math.floor(x);
    };
    var getter = function () {
        var coin = random();
        if (coin < ratio) {
            return minRowHeight + Math.round(random() * (maxRowHeight - minRowHeight));
        }
        return defaultRowHeight;
    };
    var forEach = function (callback) {
        for (var index = 0; index < numberOfRows; ++index) {
            callback(getter(), index);
        }
    };
    return nonUniformContext({ forEach: forEach }, defaultRowHeight);
}
function range(scrollTop, clientHeight, rowHeight, heightExceptions, numberOfRows) {
    if (numberOfRows === 0) {
        return { first: 0, last: -1, firstRowPos: 0, endPos: 0 };
    }
    if (numberOfRows === 1) {
        return {
            first: 0,
            last: 0,
            firstRowPos: 0,
            endPos: heightExceptions.length === 0 ? rowHeight : heightExceptions[0].y2
        };
    }
    var offset = scrollTop;
    var offset2 = offset + clientHeight;
    function indexOf(pos, indexShift) {
        return Math.min(numberOfRows - 1, indexShift + Math.max(0, Math.floor(pos / rowHeight)));
    }
    function calc(offsetShift, indexShift, isGuess) {
        if (isGuess === void 0) { isGuess = false; }
        var shifted = offset - offsetShift;
        var shifted2 = offset2 - offsetShift;
        var first = indexOf(shifted, indexShift);
        var last = indexOf(shifted2, indexShift);
        var firstRowPos = offsetShift + (first - indexShift) * rowHeight;
        var endPos = offsetShift + (last + 1 - indexShift) * rowHeight;
        console.assert(!isGuess || !(firstRowPos > offset || (endPos < offset2 && last < numberOfRows - 1)), 'error', isGuess, firstRowPos, endPos, offset, offset2, indexShift, offsetShift);
        return { first: first, last: last, firstRowPos: firstRowPos, endPos: endPos };
    }
    var r = calc(0, 0, true);
    if (heightExceptions.length === 0) {
        return r;
    }
    if (r.last < heightExceptions[0].index) {
        return r;
    }
    if (r.last === heightExceptions[0].index && heightExceptions[0].height > rowHeight) {
        return Object.assign(r, { endPos: heightExceptions[0].y2 });
    }
    var lastPos = heightExceptions[heightExceptions.length - 1];
    if (offset >= lastPos.y) {
        var rest = calc(lastPos.y2, lastPos.index + 1);
        if (offset < lastPos.y2) {
            return Object.assign(rest, { first: lastPos.index, firstRowPos: lastPos.y });
        }
        return rest;
    }
    var visible = [];
    var closest = heightExceptions[0];
    for (var _i = 0, heightExceptions_1 = heightExceptions; _i < heightExceptions_1.length; _i++) {
        var item = heightExceptions_1[_i];
        var y = item.y, y2 = item.y2;
        if (y >= offset2) {
            break;
        }
        if (y2 <= offset) {
            closest = item;
            continue;
        }
        visible.push(item);
    }
    if (visible.length === 0) {
        return calc(closest.y2, closest.index + 1);
    }
    {
        var firstException = visible[0];
        var lastException = visible[visible.length - 1];
        var first = Math.max(0, firstException.index - Math.max(0, Math.ceil((firstException.y - offset) / rowHeight)));
        var last = lastException.index;
        if (offset2 >= lastException.y2) {
            last = indexOf(offset2 - lastException.y2, lastException.index + 1);
        }
        var firstRowPos = firstException.y - (firstException.index - first) * rowHeight;
        var endPos = lastException.y2 + (last - lastException.index) * rowHeight;
        console.assert(firstRowPos <= offset && (endPos >= offset2 || last === numberOfRows - 1), 'error', firstRowPos, endPos, offset, offset2, firstException, lastException);
        return { first: first, last: last, firstRowPos: firstRowPos, endPos: endPos };
    }
}
function frozenDelta(current, target) {
    var clength = current.length;
    var tlength = target.length;
    if (clength === 0) {
        return { added: target, removed: [], common: 0 };
    }
    if (tlength === 0) {
        return { added: [], removed: current, common: 0 };
    }
    if (clength === tlength) {
        return { added: [], removed: [], common: clength };
    }
    var removed = current.slice(Math.min(tlength, clength));
    var added = target.slice(Math.min(tlength, clength));
    return { added: added, removed: removed, common: clength - removed.length };
}
function updateFrozen(old, columns, first) {
    var oldLast = old.length === 0 ? 0 : old[old.length - 1] + 1;
    var added = [];
    var removed = [];
    for (var i = old.length - 1; i >= 0; --i) {
        var index = old[i];
        if (index >= first) {
            removed.push(old.pop());
        }
        else {
            break;
        }
    }
    for (var i = oldLast; i < first; ++i) {
        if (columns[i].frozen) {
            added.push(i);
            old.push(i);
        }
    }
    return { target: old, added: added, removed: removed };
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__IMixin__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__IMixin__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__PrefetchMixin__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__PrefetchMixin__["a"]; });




/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = __extends;
/* unused harmony export __assign */
/* unused harmony export __rest */
/* unused harmony export __decorate */
/* unused harmony export __param */
/* unused harmony export __metadata */
/* unused harmony export __awaiter */
/* unused harmony export __generator */
/* unused harmony export __exportStar */
/* unused harmony export __values */
/* unused harmony export __read */
/* unused harmony export __spread */
/* unused harmony export __await */
/* unused harmony export __asyncGenerator */
/* unused harmony export __asyncDelegator */
/* unused harmony export __asyncValues */
/* unused harmony export __makeTemplateObject */
/* unused harmony export __importStar */
/* unused harmony export __importDefault */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ARowRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abortAble__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__animation__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__animation_KeyFinder__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__logic__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mixin__ = __webpack_require__(1);





var ARowRenderer = (function () {
    function ARowRenderer(body, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.body = body;
        this.pool = [];
        this.loadingPool = [];
        this.loading = new Map();
        this.visible = {
            first: 0,
            forcedFirst: 0,
            last: -1,
            forcedLast: -1
        };
        this.visibleFirstRowPos = 0;
        this.abortAnimation = function () { return undefined; };
        this.options = {
            async: Boolean(window.chrome) ? 'animation' : 'immediate',
            minScrollDelta: 3,
            mixins: [],
            scrollingHint: false
        };
        this.adapter = this.createAdapter();
        Object.assign(this.options, options);
        this.mixins = this.options.mixins.map(function (mixinClass) { return new mixinClass(_this.adapter); });
        this.fragment = body.ownerDocument.createDocumentFragment();
    }
    ARowRenderer.prototype.addMixin = function (mixinClass, options) {
        this.mixins.push(new mixinClass(this.adapter, options));
    };
    ARowRenderer.prototype.createAdapter = function () {
        var _this = this;
        var r = {
            visible: this.visible,
            addAtBeginning: this.addAtBeginning.bind(this),
            addAtBottom: this.addAtBottom.bind(this),
            removeFromBeginning: this.removeFromBeginning.bind(this),
            removeFromBottom: this.removeFromBottom.bind(this),
            updateOffset: this.updateOffset.bind(this),
            scroller: this.bodyScroller
        };
        Object.defineProperties(r, {
            visibleFirstRowPos: {
                get: function () { return _this.visibleFirstRowPos; },
                enumerable: true
            },
            context: {
                get: function () { return _this.context; },
                enumerable: true
            }
        });
        return r;
    };
    Object.defineProperty(ARowRenderer.prototype, "bodyScroller", {
        get: function () {
            return this.body.parentElement;
        },
        enumerable: true,
        configurable: true
    });
    ARowRenderer.prototype.init = function () {
        var _this = this;
        var scroller = this.bodyScroller;
        var oldTop = scroller.scrollTop;
        var oldHeight = scroller.clientHeight;
        var handler = function () {
            var top = scroller.scrollTop;
            var height = scroller.clientHeight;
            if (Math.abs(oldTop - top) < _this.options.minScrollDelta && Math.abs(oldHeight - height) < _this.options.minScrollDelta) {
                return;
            }
            var isGoingDown = top > oldTop;
            oldTop = top;
            oldHeight = height;
            _this.onScrolledVertically(top, height, isGoingDown);
            if (_this.options.scrollingHint) {
                scroller.classList.remove('le-scrolling');
            }
        };
        this.scrollListener = this.createDelayedHandler(handler, function () {
            if (_this.options.scrollingHint) {
                scroller.classList.add('le-scrolling');
            }
        });
        scroller.addEventListener('scroll', this.scrollListener);
        this.recreate();
    };
    ARowRenderer.prototype.createDelayedHandler = function (delayedHandler, immediateCallback) {
        var _this = this;
        var hasImmediate = typeof (window.setImmediate) === 'function';
        var delayer;
        if (this.options.async === 'immediate' && hasImmediate) {
            delayer = setImmediate;
        }
        else if (this.options.async === 'animation' || this.options.async === 'immediate') {
            delayer = requestAnimationFrame;
        }
        else if (typeof this.options.async === 'number') {
            delayer = function (c) { return self.setTimeout(c, _this.options.async); };
        }
        else {
            delayer = function (c) {
                c();
                return -1;
            };
        }
        var timeOut = -1;
        var wrapper = function () {
            timeOut = -1;
            delayedHandler();
        };
        return function () {
            if (immediateCallback) {
                immediateCallback();
            }
            if (timeOut > -1) {
                return;
            }
            timeOut = delayer(wrapper);
        };
    };
    ARowRenderer.prototype.destroy = function () {
        this.bodyScroller.removeEventListener('scroll', this.scrollListener);
        this.body.remove();
    };
    ARowRenderer.cleanUp = function (item) {
        if (item.style.height) {
            item.style.height = null;
        }
    };
    ARowRenderer.prototype.select = function (index) {
        var item;
        var result;
        if (this.pool.length > 0) {
            item = this.pool.pop();
            result = this.updateRow(item, index);
        }
        else if (this.loadingPool.length > 0) {
            item = this.loadingPool.pop();
            item.classList.remove('loading');
            result = this.createRow(item, index);
        }
        else {
            item = this.body.ownerDocument.createElement('div');
            result = this.createRow(item, index);
        }
        item.dataset.index = String(index);
        return { item: item, result: result };
    };
    ARowRenderer.prototype.selectProxy = function () {
        var proxy;
        if (this.loadingPool.length > 0) {
            proxy = this.loadingPool.pop();
        }
        else {
            proxy = this.body.ownerDocument.createElement('div');
            proxy.classList.add('loading');
        }
        return proxy;
    };
    ARowRenderer.prototype.recycle = function (item) {
        ARowRenderer.cleanUp(item);
        if (this.loading.has(item)) {
            var abort = this.loading.get(item);
            abort.abort();
        }
        else {
            this.pool.push(item);
        }
    };
    ARowRenderer.prototype.proxy = function (item, result) {
        var _this = this;
        if (!Object(__WEBPACK_IMPORTED_MODULE_0__abortAble__["b" /* isAbortAble */])(result)) {
            return item;
        }
        var abort = result;
        var real = item;
        var proxy = this.selectProxy();
        proxy.dataset.index = real.dataset.index;
        proxy.style.height = real.style.height;
        this.loading.set(proxy, abort);
        abort.then(function (result) {
            if (result === __WEBPACK_IMPORTED_MODULE_0__abortAble__["a" /* ABORTED */]) {
                ARowRenderer.cleanUp(real);
                _this.pool.push(real);
            }
            else {
                _this.body.replaceChild(real, proxy);
            }
            _this.loading.delete(proxy);
            ARowRenderer.cleanUp(proxy);
            _this.loadingPool.push(proxy);
        });
        return proxy;
    };
    ARowRenderer.prototype.create = function (index) {
        var _a = this.select(index), item = _a.item, result = _a.result;
        var _b = this.context, ex = _b.exceptionsLookup, padding = _b.padding;
        if (ex.has(index)) {
            item.style.height = ex.get(index) - padding(index) + "px";
        }
        return this.proxy(item, result);
    };
    ARowRenderer.prototype.removeAll = function () {
        var _this = this;
        var arr = Array.from(this.body.children);
        this.body.innerHTML = '';
        arr.forEach(function (item) {
            _this.recycle(item);
        });
    };
    ARowRenderer.prototype.update = function () {
        var _this = this;
        var first = this.visible.first;
        var fragment = this.fragment;
        var items = Array.from(this.body.children);
        this.body.innerHTML = '';
        items.forEach(function (item, i) {
            if (_this.loading.has(item)) {
                return;
            }
            var abort = _this.updateRow(item, i + first);
            fragment.appendChild(_this.proxy(item, abort));
        });
        this.body.appendChild(fragment);
    };
    ARowRenderer.prototype.forEachRow = function (callback, inplace) {
        var _this = this;
        if (inplace === void 0) { inplace = false; }
        var rows = Array.from(this.body.children);
        var fragment = this.fragment;
        if (!inplace) {
            this.body.innerHTML = '';
        }
        rows.forEach(function (row, index) {
            if (!row.classList.contains('loading') && row.dataset.animation !== 'update_remove' && row.dataset.animation !== 'hide') {
                callback(row, index + _this.visible.first);
            }
            if (!inplace) {
                fragment.appendChild(row);
            }
        });
        if (!inplace) {
            this.body.appendChild(fragment);
        }
    };
    ARowRenderer.prototype.removeFromBeginning = function (from, to) {
        return this.remove(from, to, true);
    };
    ARowRenderer.prototype.removeFromBottom = function (from, to) {
        return this.remove(from, to, false);
    };
    ARowRenderer.prototype.remove = function (from, to, fromBeginning) {
        for (var i = from; i <= to; ++i) {
            var item = (fromBeginning ? this.body.firstChild : this.body.lastChild);
            item.remove();
            this.recycle(item);
        }
    };
    ARowRenderer.prototype.addAtBeginning = function (from, to) {
        if (from === to) {
            this.body.insertBefore(this.create(from), this.body.firstChild);
            return;
        }
        var fragment = this.fragment;
        for (var i = from; i <= to; ++i) {
            fragment.appendChild(this.create(i));
        }
        this.body.insertBefore(fragment, this.body.firstChild);
    };
    ARowRenderer.prototype.addAtBottom = function (from, to) {
        if (from === to) {
            this.body.appendChild(this.create(from));
            return;
        }
        var fragment = this.fragment;
        for (var i = from; i <= to; ++i) {
            fragment.appendChild(this.create(i));
        }
        this.body.appendChild(fragment);
    };
    ARowRenderer.prototype.updateOffset = function (firstRowPos) {
        var totalHeight = this.context.totalHeight;
        this.visibleFirstRowPos = firstRowPos;
        this.body.classList.toggle('odd', this.visible.first % 2 === 1);
        this.body.style.transform = "translate(0, " + firstRowPos.toFixed(0) + "px)";
        this.body.style.height = Math.max(1, totalHeight - firstRowPos).toFixed(0) + "px";
    };
    ARowRenderer.prototype.recreate = function (ctx) {
        this.abortAnimation();
        if (ctx) {
            return this.recreateAnimated(ctx);
        }
        return this.recreatePure();
    };
    ARowRenderer.prototype.recreatePure = function () {
        var context = this.context;
        var scroller = this.bodyScroller;
        this.updateOffset(0);
        this.removeAll();
        this.clearPool();
        var _a = Object(__WEBPACK_IMPORTED_MODULE_3__logic__["d" /* range */])(scroller.scrollTop, scroller.clientHeight, context.defaultRowHeight, context.exceptions, context.numberOfRows), first = _a.first, last = _a.last, firstRowPos = _a.firstRowPos;
        this.visible.first = this.visible.forcedFirst = first;
        this.visible.last = this.visible.forcedLast = last;
        if (first < 0) {
            this.updateOffset(0);
            return;
        }
        this.addAtBottom(first, last);
        this.updateOffset(firstRowPos);
    };
    ARowRenderer.prototype.recreateAnimated = function (ctx) {
        var _this = this;
        var lookup = new Map();
        var prev = new __WEBPACK_IMPORTED_MODULE_2__animation_KeyFinder__["a" /* default */](ctx.previous, ctx.previousKey);
        var cur = new __WEBPACK_IMPORTED_MODULE_2__animation_KeyFinder__["a" /* default */](this.context, ctx.currentKey);
        var next = Object(__WEBPACK_IMPORTED_MODULE_3__logic__["d" /* range */])(this.bodyScroller.scrollTop, this.bodyScroller.clientHeight, cur.context.defaultRowHeight, cur.context.exceptions, cur.context.numberOfRows);
        {
            var rows_1 = Array.from(this.body.children);
            var old = Object.assign({}, this.visible);
            prev.positions(old.first, Math.min(old.last, old.first + rows_1.length), this.visibleFirstRowPos, function (i, key, pos) {
                var n = rows_1[i];
                if (n) {
                    lookup.set(key, { n: n, pos: pos, i: i });
                }
            });
            this.body.innerHTML = "";
        }
        this.visible.first = this.visible.forcedFirst = next.first;
        this.visible.last = this.visible.forcedLast = next.last;
        var fragment = this.fragment;
        var animation = [];
        var nodeY = next.firstRowPos;
        cur.positions(next.first, next.last, next.firstRowPos, function (i, key, pos) {
            var node;
            var mode = __WEBPACK_IMPORTED_MODULE_1__animation__["a" /* EAnimationMode */].UPDATE;
            var previous;
            if (lookup.has(key)) {
                var item = lookup.get(key);
                lookup.delete(key);
                item.n.dataset.index = String(i);
                node = _this.proxy(item.n, _this.updateRow(item.n, i));
                previous = {
                    index: item.i,
                    y: item.pos,
                    height: prev.exceptionHeightOf(item.i, true)
                };
            }
            else {
                var old = prev.posByKey(key);
                node = _this.create(i);
                mode = old.index < 0 ? __WEBPACK_IMPORTED_MODULE_1__animation__["a" /* EAnimationMode */].SHOW : __WEBPACK_IMPORTED_MODULE_1__animation__["a" /* EAnimationMode */].UPDATE_CREATE;
                previous = {
                    index: old.index,
                    y: old.pos >= 0 ? old.pos : pos,
                    height: old.index < 0 ? cur.exceptionHeightOf(i, true) : prev.exceptionHeightOf(old.index, true)
                };
            }
            animation.push({
                node: node,
                key: key,
                mode: mode,
                previous: previous,
                nodeY: nodeY,
                nodeYCurrentHeight: pos,
                current: {
                    index: i,
                    y: pos,
                    height: cur.exceptionHeightOf(i)
                }
            });
            node.style.transform = "translate(0, " + (nodeY - pos) + "px)";
            nodeY += previous.height + (previous.index < 0 ? cur.padding(i) : prev.padding(previous.index));
            fragment.appendChild(node);
        });
        var nodeYCurrentHeight = next.endPos;
        lookup.forEach(function (item, key) {
            var r = cur.posByKey(key);
            var nextPos = r.pos >= 0 ? r.pos : item.pos;
            var node = item.n;
            node.style.transform = "translate(0, " + (item.pos - nodeY) + "px)";
            fragment.appendChild(node);
            var prevHeight = prev.exceptionHeightOf(item.i, true);
            animation.push({
                node: item.n,
                key: key,
                mode: r.index < 0 ? __WEBPACK_IMPORTED_MODULE_1__animation__["a" /* EAnimationMode */].HIDE : __WEBPACK_IMPORTED_MODULE_1__animation__["a" /* EAnimationMode */].UPDATE_REMOVE,
                previous: {
                    index: item.i,
                    y: item.pos,
                    height: prevHeight
                },
                nodeY: nodeY,
                nodeYCurrentHeight: nodeYCurrentHeight,
                current: {
                    index: r.index,
                    y: nextPos,
                    height: r.index < 0 ? null : cur.exceptionHeightOf(r.index)
                }
            });
            nodeYCurrentHeight += r.index < 0 ? cur.context.defaultRowHeight : (cur.exceptionHeightOf(r.index, true) + cur.padding(r.index));
            nodeY += prevHeight + prev.padding(item.i);
        });
        this.updateOffset(next.firstRowPos);
        this.animate(animation, ctx.phases || __WEBPACK_IMPORTED_MODULE_1__animation__["c" /* defaultPhases */], prev, cur, fragment);
    };
    ARowRenderer.prototype.animate = function (animation, phases, previousFinder, currentFinder, fragment) {
        var _this = this;
        if (animation.length <= 0) {
            this.body.appendChild(fragment);
            return;
        }
        var currentTimer = -1;
        var actPhase = 0;
        var executePhase = function (phase, items) {
            if (items === void 0) { items = animation; }
            items.forEach(function (anim) { return phase.apply(anim, previousFinder, currentFinder); });
        };
        var run = function () {
            console.assert(animation[0].node.offsetTop >= 0, 'dummy log for forcing dom update');
            executePhase(phases[actPhase++]);
            if (actPhase < phases.length) {
                var next = phases[actPhase];
                currentTimer = setTimeout(run, next.delay);
                return;
            }
            var body = _this.body.classList;
            Array.from(body).forEach(function (v) {
                if (v.startsWith('le-') && v.endsWith('-animation')) {
                    body.remove(v);
                }
            });
            animation.forEach(function (_a) {
                var node = _a.node, mode = _a.mode;
                if (mode !== __WEBPACK_IMPORTED_MODULE_1__animation__["a" /* EAnimationMode */].UPDATE_REMOVE && mode !== __WEBPACK_IMPORTED_MODULE_1__animation__["a" /* EAnimationMode */].HIDE) {
                    return;
                }
                node.remove();
                node.style.transform = null;
                _this.recycle(node);
            });
            _this.abortAnimation = function () { return undefined; };
            currentTimer = -1;
        };
        while (phases[actPhase].delay === 0) {
            executePhase(phases[actPhase++]);
        }
        var body = this.body;
        this.body.appendChild(fragment);
        var dummyAnimation = [];
        animation = animation.filter(function (d) {
            if (Object(__WEBPACK_IMPORTED_MODULE_1__animation__["d" /* noAnimationChange */])(d, previousFinder.context.defaultRowHeight, currentFinder.context.defaultRowHeight)) {
                dummyAnimation.push(d);
                return false;
            }
            return true;
        });
        if (dummyAnimation.length > 0) {
            phases.slice(actPhase).forEach(function (phase) { return executePhase(phase, dummyAnimation); });
        }
        if (animation.length === 0) {
            return;
        }
        body.classList.add('le-row-animation');
        (new Set(animation.map(function (d) { return d.mode; }))).forEach(function (mode) {
            body.classList.add("le-" + __WEBPACK_IMPORTED_MODULE_1__animation__["a" /* EAnimationMode */][mode].toLowerCase().split('_')[0] + "-animation");
        });
        this.abortAnimation = function () {
            if (currentTimer <= 0) {
                return;
            }
            clearTimeout(currentTimer);
            currentTimer = -1;
            actPhase = phases.length - 1;
            run();
        };
        currentTimer = setTimeout(run, phases[actPhase].delay);
    };
    ARowRenderer.prototype.clearPool = function () {
        this.pool.splice(0, this.pool.length);
    };
    ARowRenderer.prototype.revalidate = function () {
        var scroller = this.bodyScroller;
        this.onScrolledVertically(scroller.scrollTop, scroller.clientHeight, true);
        this.updateOffset(this.visibleFirstRowPos);
    };
    ARowRenderer.prototype.onScrolledVertically = function (scrollTop, clientHeight, isGoingDown) {
        var scrollResult = this.onScrolledImpl(scrollTop, clientHeight);
        this.mixins.forEach(function (mixin) { return mixin.onScrolled(isGoingDown, scrollResult); });
        return scrollResult;
    };
    ARowRenderer.prototype.onScrolledImpl = function (scrollTop, clientHeight) {
        var context = this.context;
        var _a = Object(__WEBPACK_IMPORTED_MODULE_3__logic__["d" /* range */])(scrollTop, clientHeight, context.defaultRowHeight, context.exceptions, context.numberOfRows), first = _a.first, last = _a.last, firstRowPos = _a.firstRowPos;
        var visible = this.visible;
        visible.forcedFirst = first;
        visible.forcedLast = last;
        if ((first - visible.first) >= 0 && (last - visible.last) <= 0) {
            return __WEBPACK_IMPORTED_MODULE_4__mixin__["a" /* EScrollResult */].NONE;
        }
        var r = __WEBPACK_IMPORTED_MODULE_4__mixin__["a" /* EScrollResult */].PARTIAL;
        if (first > visible.last || last < visible.first) {
            this.removeAll();
            this.addAtBottom(first, last);
            r = __WEBPACK_IMPORTED_MODULE_4__mixin__["a" /* EScrollResult */].ALL;
        }
        else if (first < visible.first) {
            this.removeFromBottom(last + 1, visible.last);
            this.addAtBeginning(first, visible.first - 1);
        }
        else {
            this.removeFromBeginning(visible.first, first - 1);
            this.addAtBottom(visible.last + 1, last);
        }
        visible.first = first;
        visible.last = last;
        this.updateOffset(firstRowPos);
        return r;
    };
    return ARowRenderer;
}());

/* harmony default export */ __webpack_exports__["b"] = (ARowRenderer);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GridStyleManager__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__GridStyleManager__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_0__GridStyleManager__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_0__GridStyleManager__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_0__GridStyleManager__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StyleManager__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__StyleManager__["a"]; });




/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ABORTED; });
/* unused harmony export default */
/* harmony export (immutable) */ __webpack_exports__["b"] = isAbortAble;
var ABORTED = Symbol('aborted');
function abortAble(loader) {
    return {
        then: function (onfulfilled) {
            var aborted = null;
            var isAborted = function () { return aborted === null; };
            var aborter = new Promise(function (resolve) { return aborted = resolve; });
            var fullfiller = loader.then(function (r) {
                if (isAborted()) {
                    return ABORTED;
                }
                return Promise.resolve(onfulfilled(r)).then(function (r) { return isAborted() ? ABORTED : r; });
            });
            var p = Promise.race([aborter, fullfiller]);
            return _a = {
                    abort: function () {
                        if (aborted !== null) {
                            aborted(ABORTED);
                            aborted = null;
                        }
                    },
                    then: p.then.bind(p),
                    catch: p.catch.bind(p)
                },
                _a[Symbol.toStringTag] = p[Symbol.toStringTag],
                _a;
            var _a;
        }
    };
}
function isAbortAble(abortAble) {
    return abortAble !== undefined && abortAble !== null && abortAble && typeof abortAble.then === 'function' && typeof abortAble.abort === 'function';
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EAnimationMode; });
/* harmony export (immutable) */ __webpack_exports__["d"] = noAnimationChange;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return defaultPhases; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__KeyFinder__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__KeyFinder__["a"]; });

var EAnimationMode;
(function (EAnimationMode) {
    EAnimationMode[EAnimationMode["UPDATE"] = 0] = "UPDATE";
    EAnimationMode[EAnimationMode["UPDATE_CREATE"] = 1] = "UPDATE_CREATE";
    EAnimationMode[EAnimationMode["UPDATE_REMOVE"] = 2] = "UPDATE_REMOVE";
    EAnimationMode[EAnimationMode["SHOW"] = 3] = "SHOW";
    EAnimationMode[EAnimationMode["HIDE"] = 4] = "HIDE";
})(EAnimationMode || (EAnimationMode = {}));
var NO_CHANGE_DELTA = 1;
function noAnimationChange(_a, previousHeight, currentHeight) {
    var previous = _a.previous, mode = _a.mode, nodeY = _a.nodeY, current = _a.current;
    var prev = previous.height == null ? previousHeight : previous.height;
    var curr = current.height == null ? currentHeight : current.height;
    return mode === EAnimationMode.UPDATE && (Math.abs(previous.y - nodeY) <= NO_CHANGE_DELTA) && (Math.abs(prev - curr) <= NO_CHANGE_DELTA);
}
var MAX_ANIMATION_TIME = 1100;
var defaultPhases = [
    {
        delay: 0,
        apply: function (_a) {
            var mode = _a.mode, previous = _a.previous, nodeY = _a.nodeY, current = _a.current, node = _a.node;
            node.dataset.animation = EAnimationMode[mode].toLowerCase();
            node.style.transform = "translate(0, " + (previous.y - nodeY) + "px)";
            if (mode === EAnimationMode.SHOW) {
                node.style.height = current.height !== null ? current.height + "px" : null;
            }
            else {
                node.style.height = previous.height + "px";
            }
            node.style.opacity = mode === EAnimationMode.SHOW ? '0' : (mode === EAnimationMode.HIDE ? '1' : null);
        }
    },
    {
        delay: 10,
        apply: function (_a) {
            var mode = _a.mode, current = _a.current, nodeY = _a.nodeY, node = _a.node;
            node.style.transform = (mode === EAnimationMode.HIDE || mode === EAnimationMode.UPDATE_REMOVE) ? "translate(0, " + (current.y - nodeY) + "px)" : null;
            if (mode !== EAnimationMode.HIDE) {
                node.style.height = current.height !== null ? current.height + "px" : null;
            }
            node.style.opacity = mode === EAnimationMode.SHOW ? '1' : (mode === EAnimationMode.HIDE ? '0' : null);
        }
    },
    {
        delay: MAX_ANIMATION_TIME,
        apply: function (_a) {
            var node = _a.node;
            delete node.dataset.animation;
            node.style.opacity = null;
            node.style.transform = null;
        }
    }
];


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var KeyFinder = (function () {
    function KeyFinder(context, key) {
        var _this = this;
        this.context = context;
        this.key = key;
        this.cache = [];
        this.lastFilled = 0;
        this.key2index = new Map();
        this.context.exceptions.forEach(function (e) {
            _this.cache[e.index] = e.y;
            _this.key2index.set(key(e.index), e.index);
        });
    }
    KeyFinder.prototype.findValidStart = function (before) {
        for (var i = before - 1; i >= 0; --i) {
            if (this.cache[i] !== undefined) {
                return i;
            }
        }
        return -1;
    };
    KeyFinder.prototype.posByKey = function (key) {
        if (this.key2index.has(key)) {
            var index = this.key2index.get(key);
            return { index: index, pos: this.pos(index) };
        }
        return this.fillCacheTillKey(key);
    };
    KeyFinder.prototype.pos = function (index) {
        if (this.context.exceptions.length === 0) {
            return index * this.context.defaultRowHeight;
        }
        var cached = this.cache[index];
        if (cached !== undefined) {
            return cached;
        }
        var start = this.findValidStart(index);
        if (start < 0) {
            this.fillCache(0, index, 0);
        }
        else {
            this.fillCache(start + 1, index, this.cache[start] + this.heightOf(start));
        }
        return this.cache[index];
    };
    KeyFinder.prototype.fillCache = function (first, last, offset, callback) {
        if (last <= this.lastFilled) {
            if (!callback) {
                return;
            }
            for (var i = first; i <= last; ++i) {
                callback(i, this.key(i), this.cache[i]);
            }
            return;
        }
        var pos = offset;
        for (var i = first; i <= last; ++i) {
            this.cache[i] = pos;
            var key = this.key(i);
            this.key2index.set(key, i);
            if (callback) {
                callback(i, key, pos);
            }
            pos += this.heightOf(i);
        }
    };
    KeyFinder.prototype.heightOf = function (index) {
        var lookup = this.context.exceptionsLookup;
        return lookup.has(index) ? lookup.get(index) : this.context.defaultRowHeight;
    };
    KeyFinder.prototype.exceptionHeightOf = function (index, returnDefault) {
        if (returnDefault === void 0) { returnDefault = false; }
        var padding = this.context.padding(index);
        var lookup = this.context.exceptionsLookup;
        if (lookup.has(index)) {
            return lookup.get(index) - padding;
        }
        return returnDefault ? this.context.defaultRowHeight - padding : null;
    };
    KeyFinder.prototype.padding = function (index) {
        return this.context.padding(index);
    };
    KeyFinder.prototype.fillCacheTillKey = function (target) {
        var pos = 0;
        for (var i = this.lastFilled; i < this.context.numberOfRows; ++i, ++this.lastFilled) {
            var c = this.cache[i];
            if (c !== undefined) {
                pos = c + this.heightOf(i);
                continue;
            }
            var key = this.key(i);
            this.cache[i] = pos;
            this.key2index.set(key, i);
            if (key === target) {
                return { index: i, pos: pos };
            }
            pos += this.heightOf(i);
        }
        return { index: -1, pos: -1 };
    };
    KeyFinder.prototype.positions = function (first, last, offset, callback) {
        this.fillCache(first, last, offset, callback);
    };
    return KeyFinder;
}());
/* harmony default export */ __webpack_exports__["a"] = (KeyFinder);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EScrollResult; });
var EScrollResult;
(function (EScrollResult) {
    EScrollResult[EScrollResult["NONE"] = 0] = "NONE";
    EScrollResult[EScrollResult["ALL"] = 1] = "ALL";
    EScrollResult[EScrollResult["PARTIAL"] = 2] = "PARTIAL";
})(EScrollResult || (EScrollResult = {}));


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TEMPLATE; });
/* harmony export (immutable) */ __webpack_exports__["d"] = setTemplate;
/* harmony export (immutable) */ __webpack_exports__["c"] = setColumn;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StyleManager__ = __webpack_require__(10);


var TEMPLATE = "\n  <header>\n    <article></article>\n  </header>\n  <main>\n    <article></article>\n  </main>";
function setTemplate(root) {
    root.innerHTML = TEMPLATE;
    return root;
}
function setColumn(node, column) {
    node.style.gridColumnStart = column.id;
    node.dataset.id = column.id;
}
var GridStyleManager = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](GridStyleManager, _super);
    function GridStyleManager(root, id) {
        var _this = _super.call(this, root) || this;
        _this.id = id;
        var headerScroller = root.querySelector('header');
        var bodyScroller = root.querySelector('main');
        bodyScroller.addEventListener('scroll', function () {
            headerScroller.scrollLeft = bodyScroller.scrollLeft;
        });
        return _this;
    }
    GridStyleManager.columnWidths = function (columns, unit) {
        if (unit === void 0) { unit = 'px'; }
        function repeatStandard(count, width) {
            return "repeat(" + count + ", " + width + ")";
        }
        var repeat = repeatStandard;
        var lastWidth = 0;
        var count = 0;
        var r = '';
        columns.forEach(function (_a) {
            var width = _a.width;
            if (lastWidth === width) {
                count++;
                return;
            }
            if (count > 0) {
                r += count === 1 ? "" + lastWidth + unit + " " : repeat(count, "" + lastWidth + unit) + " ";
            }
            count = 1;
            lastWidth = width;
        });
        if (count > 0) {
            r += count === 1 ? "" + lastWidth + unit : "" + repeat(count, "" + lastWidth + unit);
        }
        return r;
    };
    GridStyleManager.gridColumn = function (columns, unit) {
        if (unit === void 0) { unit = 'px'; }
        var widths = GridStyleManager.columnWidths(columns, unit);
        return "grid-template-columns: " + widths + ";\n      grid-template-areas: \"" + columns.map(function (c) { return c.id; }).join(' ') + "\";";
    };
    GridStyleManager.prototype.update = function (defaultRowHeight, columns, padding, tableId, unit) {
        if (unit === void 0) { unit = 'px'; }
        var selectors = tableId !== undefined ? this.tableIds(tableId, true) : {
            header: this.id + " > header > article",
            body: this.id + " > main > article"
        };
        this.updateRule("__heightsRule" + selectors.body, selectors.body + " > div {\n      height: " + defaultRowHeight + "px;\n    }");
        if (columns.length === 0) {
            this.deleteRule("__widthRule" + selectors.body);
            return;
        }
        var content = GridStyleManager.gridColumn(columns, unit);
        this.updateRule("__widthRule" + selectors.body, selectors.body + " > div, " + selectors.header + " { " + content + " }");
        this.updateFrozen(columns, selectors, padding, unit);
    };
    GridStyleManager.prototype.remove = function (tableId) {
        var selectors = this.tableIds(tableId, true);
        this.deleteRule("__heightsRule" + selectors.body);
        this.deleteRule("__widthRule" + selectors.body);
        var prefix = "__frozen" + selectors.body + "_";
        var rules = this.ruleNames.reduce(function (a, b) { return a + (b.startsWith(prefix) ? 1 : 0); }, 0);
        for (var i = 0; i < rules; ++i) {
            this.deleteRule("" + prefix + i);
        }
    };
    GridStyleManager.prototype.tableIds = function (tableId, asSelector) {
        if (asSelector === void 0) { asSelector = false; }
        var cleanId = this.id.startsWith('#') ? this.id.slice(1) : this.id;
        return {
            header: "" + (asSelector ? '#' : '') + cleanId + "_H" + tableId,
            body: "" + (asSelector ? '#' : '') + cleanId + "_B" + tableId
        };
    };
    GridStyleManager.prototype.updateFrozen = function (columns, selectors, _padding, unit) {
        var _this = this;
        var prefix = "__frozen" + selectors.body + "_";
        var rules = this.ruleNames.reduce(function (a, b) { return a + (b.startsWith(prefix) ? 1 : 0); }, 0);
        var frozen = columns.filter(function (c) { return c.frozen; });
        if (frozen.length <= 0) {
            for (var i = 0; i < rules; ++i) {
                this.deleteRule("" + prefix + i);
            }
            return;
        }
        var offset = frozen[0].width;
        frozen.slice(1).forEach(function (c, i) {
            var rule = selectors.body + " > div > .frozen[data-id=\"" + c.id + "\"], " + selectors.header + " .frozen[data-id=\"" + c.id + "\"] {\n        left: " + offset + unit + ";\n      }";
            offset += c.width;
            _this.updateRule("" + prefix + i, rule);
        });
        for (var i = frozen.length - 1; i < rules; ++i) {
            this.deleteRule("" + prefix + i);
        }
    };
    return GridStyleManager;
}(__WEBPACK_IMPORTED_MODULE_1__StyleManager__["a" /* default */]));
/* harmony default export */ __webpack_exports__["b"] = (GridStyleManager);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var StyleManager = (function () {
    function StyleManager(root) {
        this.rules = new Map();
        this.node = root.ownerDocument.createElement('style');
        root.appendChild(this.node);
    }
    StyleManager.prototype.destroy = function () {
        this.node.remove();
    };
    StyleManager.prototype.recreate = function () {
        this.node.innerHTML = Array.from(this.rules.values()).join('\n');
    };
    StyleManager.prototype.addRule = function (id, rule) {
        this.rules.set(id, rule);
        this.recreate();
        return id;
    };
    StyleManager.prototype.updateRule = function (id, rule) {
        this.rules.set(id, rule);
        this.recreate();
        return id;
    };
    StyleManager.prototype.deleteRule = function (id) {
        var r = this.rules.get(id);
        if (!r) {
            return;
        }
        this.rules.delete(id);
        this.recreate();
    };
    Object.defineProperty(StyleManager.prototype, "ruleNames", {
        get: function () {
            return Array.from(this.rules.keys());
        },
        enumerable: true,
        configurable: true
    });
    return StyleManager;
}());
/* harmony default export */ __webpack_exports__["a"] = (StyleManager);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ACellAdapter */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__logic__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style_GridStyleManager__ = __webpack_require__(9);



var debug = false;
var ACellAdapter = (function () {
    function ACellAdapter(header, style, tableId) {
        var mixinClasses = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            mixinClasses[_i - 3] = arguments[_i];
        }
        var _this = this;
        this.header = header;
        this.style = style;
        this.tableId = tableId;
        this.cellPool = [];
        this.visibleColumns = {
            frozen: [],
            first: 0,
            forcedFirst: 0,
            last: -1,
            forcedLast: -1
        };
        this.visibleFirstColumnPos = 0;
        this.columnAdapter = this.createColumnAdapter();
        this.columnMixins = mixinClasses.map(function (mixinClass) { return new mixinClass(_this.columnAdapter); });
        this.columnFragment = header.ownerDocument.createDocumentFragment();
    }
    Object.defineProperty(ACellAdapter.prototype, "headerScroller", {
        get: function () {
            return this.header.parentElement;
        },
        enumerable: true,
        configurable: true
    });
    ACellAdapter.prototype.addColumnMixin = function (mixinClass, options) {
        this.columnMixins.push(new mixinClass(this.columnAdapter, options));
    };
    ACellAdapter.prototype.createColumnAdapter = function () {
        var _this = this;
        var r = {
            visible: this.visibleColumns,
            addAtBeginning: this.addColumnAtStart.bind(this),
            addAtBottom: this.addColumnAtEnd.bind(this),
            removeFromBeginning: this.removeColumnFromStart.bind(this),
            removeFromBottom: this.removeColumnFromEnd.bind(this),
            updateOffset: this.updateColumnOffset.bind(this),
            scroller: this.headerScroller,
            syncFrozen: this.syncFrozen.bind(this)
        };
        Object.defineProperties(r, {
            visibleFirstRowPos: {
                get: function () { return _this.visibleFirstColumnPos; },
                enumerable: true
            },
            context: {
                get: function () { return _this.context.column; },
                enumerable: true
            },
        });
        return r;
    };
    ACellAdapter.prototype.init = function () {
        var _this = this;
        var context = this.context;
        this.style.update(context.defaultRowHeight - context.padding(-1), context.columns, context.column.padding, this.tableId);
        context.columns.forEach(function () {
            _this.cellPool.push([]);
        });
    };
    ACellAdapter.prototype.onScrolledHorizontally = function (scrollLeft, clientWidth, isGoingRight) {
        var scrollResult = this.onScrolledHorizontallyImpl(scrollLeft, clientWidth);
        this.columnMixins.forEach(function (mixin) { return mixin.onScrolled(isGoingRight, scrollResult); });
        return scrollResult;
    };
    ACellAdapter.prototype.removeColumnFromStart = function (from, to, frozenShift) {
        var _this = this;
        if (frozenShift === void 0) { frozenShift = this.visibleColumns.frozen.length; }
        this.forEachRow(function (row) {
            _this.removeCellFromStart(row, from, to, frozenShift);
        });
        if (debug) {
            this.verifyRows();
        }
    };
    ACellAdapter.prototype.removeCellFromStart = function (row, from, to, frozenShift) {
        for (var i = from; i <= to; ++i) {
            var node = (frozenShift === 0 ? row.firstElementChild : row.children[frozenShift]);
            node.remove();
            this.recycleCell(node, i);
        }
        if (debug) {
            verifyRow(row, -1, this.context.columns);
        }
    };
    ACellAdapter.prototype.removeColumnFromEnd = function (from, to) {
        var _this = this;
        this.forEachRow(function (row) {
            _this.removeCellFromEnd(row, from, to);
        });
        if (debug) {
            this.verifyRows();
        }
    };
    ACellAdapter.prototype.removeCellFromEnd = function (row, from, to) {
        for (var i = to; i >= from; --i) {
            var node = row.lastElementChild;
            node.remove();
            this.recycleCell(node, i);
        }
        if (debug) {
            verifyRow(row, -1, this.context.columns);
        }
    };
    ACellAdapter.prototype.removeFrozenCells = function (row, columnIndices, shift) {
        for (var _i = 0, columnIndices_1 = columnIndices; _i < columnIndices_1.length; _i++) {
            var columnIndex = columnIndices_1[_i];
            var node = row.children[shift];
            node.remove();
            this.recycleCell(node, columnIndex);
        }
        if (debug) {
            verifyRow(row, -1, this.context.columns);
        }
    };
    ACellAdapter.prototype.removeFrozenColumns = function (columnIndices, shift) {
        var _this = this;
        this.forEachRow(function (row) {
            _this.removeFrozenCells(row, columnIndices, shift);
        });
        if (debug) {
            this.verifyRows();
        }
    };
    ACellAdapter.prototype.removeAllColumns = function (includingFrozen) {
        var _this = this;
        this.forEachRow(function (row) {
            _this.removeAllCells(row, includingFrozen);
        });
        if (debug) {
            this.verifyRows();
        }
    };
    ACellAdapter.prototype.removeAllCells = function (row, includingFrozen, shift) {
        var _this = this;
        if (shift === void 0) { shift = this.visibleColumns.first; }
        var arr = Array.from(row.children);
        var frozen = this.visibleColumns.frozen;
        row.innerHTML = '';
        if (includingFrozen || frozen.length === 0) {
            for (var _i = 0, frozen_1 = frozen; _i < frozen_1.length; _i++) {
                var i = frozen_1[_i];
                this.recycleCell(arr.shift(), i);
            }
        }
        else {
            for (var _a = 0, frozen_2 = frozen; _a < frozen_2.length; _a++) {
                var _1 = frozen_2[_a];
                row.appendChild(arr.shift());
            }
        }
        arr.forEach(function (item, i) {
            _this.recycleCell(item, i + shift);
        });
        if (debug) {
            verifyRow(row, -1, this.context.columns);
        }
    };
    ACellAdapter.prototype.selectCell = function (row, column, columns) {
        var pool = this.cellPool[column];
        var columnObj = columns[column];
        if (pool.length > 0) {
            var item = pool.pop();
            var r_1 = this.updateCell(item, row, columnObj);
            if (r_1 && r_1 !== item) {
                Object(__WEBPACK_IMPORTED_MODULE_2__style_GridStyleManager__["c" /* setColumn */])(r_1, columnObj);
            }
            return r_1 ? r_1 : item;
        }
        var r = this.createCell(this.header.ownerDocument, row, columnObj);
        Object(__WEBPACK_IMPORTED_MODULE_2__style_GridStyleManager__["c" /* setColumn */])(r, columnObj);
        return r;
    };
    ACellAdapter.prototype.recycleCell = function (item, column) {
        this.cellPool[column].push(item);
    };
    ACellAdapter.prototype.addColumnAtStart = function (from, to, frozenShift) {
        var _this = this;
        if (frozenShift === void 0) { frozenShift = this.visibleColumns.frozen.length; }
        var columns = this.context.columns;
        this.forEachRow(function (row, rowIndex) {
            _this.addCellAtStart(row, rowIndex, from, to, frozenShift, columns);
        });
        if (debug) {
            this.verifyRows();
        }
    };
    ACellAdapter.prototype.addCellAtStart = function (row, rowIndex, from, to, frozenShift, columns) {
        if (debug) {
            verifyRow(row, rowIndex, this.context.columns);
        }
        for (var i = to; i >= from; --i) {
            var cell = this.selectCell(rowIndex, i, columns);
            row.insertBefore(cell, frozenShift > 0 ? row.children[frozenShift] : row.firstChild);
        }
        if (debug) {
            verifyRow(row, rowIndex, this.context.columns);
        }
    };
    ACellAdapter.prototype.insertFrozenCells = function (row, rowIndex, columnIndices, shift, columns) {
        var before = row.children[shift];
        for (var _i = 0, columnIndices_2 = columnIndices; _i < columnIndices_2.length; _i++) {
            var i = columnIndices_2[_i];
            var cell = this.selectCell(rowIndex, i, columns);
            if (before) {
                row.insertBefore(cell, before);
            }
            else {
                row.appendChild(cell);
            }
        }
    };
    ACellAdapter.prototype.insertFrozenColumns = function (columnIndices, shift) {
        var _this = this;
        var columns = this.context.columns;
        this.forEachRow(function (row, rowIndex) {
            _this.insertFrozenCells(row, rowIndex, columnIndices, shift, columns);
        });
    };
    ACellAdapter.prototype.addColumnAtEnd = function (from, to) {
        var _this = this;
        var columns = this.context.columns;
        this.forEachRow(function (row, rowIndex) {
            _this.addCellAtEnd(row, rowIndex, from, to, columns);
        });
        if (debug) {
            this.verifyRows();
        }
    };
    ACellAdapter.prototype.verifyRows = function () {
        var columns = this.context.columns;
        this.forEachRow(function (row, rowIndex) { return verifyRow(row, rowIndex, columns); });
    };
    ACellAdapter.prototype.addCellAtEnd = function (row, rowIndex, from, to, columns) {
        for (var i = from; i <= to; ++i) {
            var cell = this.selectCell(rowIndex, i, columns);
            row.appendChild(cell);
        }
        if (debug) {
            verifyRow(row, rowIndex, this.context.columns);
        }
    };
    ACellAdapter.prototype.updateHeaders = function () {
        var _this = this;
        var columns = this.context.columns;
        Array.from(this.header.children).forEach(function (node, i) {
            _this.updateHeader(node, columns[i]);
        });
    };
    ACellAdapter.prototype.recreate = function (left, width) {
        var _this = this;
        var context = this.context;
        this.style.update(context.defaultRowHeight - context.padding(-1), context.columns, context.column.padding, this.tableId);
        this.clearPool();
        for (var i = this.cellPool.length; i < context.columns.length; ++i) {
            this.cellPool.push([]);
        }
        {
            var fragment_1 = this.columnFragment;
            var document_1 = fragment_1.ownerDocument;
            this.header.innerHTML = '';
            context.columns.forEach(function (col) {
                var n = _this.createHeader(document_1, col);
                Object(__WEBPACK_IMPORTED_MODULE_2__style_GridStyleManager__["c" /* setColumn */])(n, col);
                fragment_1.appendChild(n);
            });
            this.header.appendChild(fragment_1);
        }
        var _a = Object(__WEBPACK_IMPORTED_MODULE_0__logic__["d" /* range */])(left, width, context.column.defaultRowHeight, context.column.exceptions, context.column.numberOfRows), first = _a.first, last = _a.last, firstRowPos = _a.firstRowPos;
        this.visibleColumns.first = this.visibleColumns.forcedFirst = first;
        this.visibleColumns.last = this.visibleColumns.forcedLast = last;
        if (context.columns.some(function (c) { return c.frozen; })) {
            var target = Object(__WEBPACK_IMPORTED_MODULE_0__logic__["f" /* updateFrozen */])([], context.columns, first).target;
            this.visibleColumns.frozen = target;
        }
        else {
            this.visibleColumns.frozen = [];
        }
        this.updateColumnOffset(firstRowPos);
    };
    ACellAdapter.prototype.clearPool = function () {
        this.cellPool.forEach(function (p) { return p.splice(0, p.length); });
    };
    ACellAdapter.prototype.updateColumnOffset = function (firstColumnPos) {
        this.visibleFirstColumnPos = firstColumnPos;
    };
    ACellAdapter.prototype.createRow = function (node, rowIndex) {
        var columns = this.context.columns;
        var visible = this.visibleColumns;
        if (visible.frozen.length > 0) {
            for (var _i = 0, _a = visible.frozen; _i < _a.length; _i++) {
                var i = _a[_i];
                var cell = this.selectCell(rowIndex, i, columns);
                node.appendChild(cell);
            }
        }
        for (var i = visible.first; i <= visible.last; ++i) {
            var cell = this.selectCell(rowIndex, i, columns);
            node.appendChild(cell);
        }
    };
    ACellAdapter.prototype.updateRow = function (node, rowIndex) {
        var columns = this.context.columns;
        var visible = this.visibleColumns;
        var existing = Array.from(node.children);
        switch (existing.length) {
            case 0:
                if (visible.frozen.length > 0) {
                    this.insertFrozenCells(node, rowIndex, visible.frozen, 0, columns);
                }
                this.addCellAtEnd(node, rowIndex, visible.first, visible.last, columns);
                break;
            case 1:
                var old = existing[0];
                var id_1 = old.dataset.id;
                var columnIndex = columns.findIndex(function (c) { return c.id === id_1; });
                node.removeChild(old);
                if (columnIndex >= 0) {
                    this.recycleCell(old, columnIndex);
                }
                if (visible.frozen.length > 0) {
                    this.insertFrozenCells(node, rowIndex, visible.frozen, 0, columns);
                }
                this.addCellAtEnd(node, rowIndex, visible.first, visible.last, columns);
                break;
            default:
                this.mergeColumns(node, rowIndex, existing);
                break;
        }
    };
    ACellAdapter.prototype.mergeColumns = function (node, rowIndex, existing) {
        var _this = this;
        var columns = this.context.columns;
        var visible = this.visibleColumns;
        node.innerHTML = '';
        var ids = new Map(existing.map(function (e) { return [e.dataset.id, e]; }));
        var updateImpl = function (i) {
            var col = columns[i];
            var existing = ids.get(col.id);
            if (!existing) {
                var cell_1 = _this.selectCell(rowIndex, i, columns);
                node.appendChild(cell_1);
                return;
            }
            var cell = _this.updateCell(existing, rowIndex, col);
            if (cell && cell !== existing) {
                Object(__WEBPACK_IMPORTED_MODULE_2__style_GridStyleManager__["c" /* setColumn */])(cell, col);
            }
            node.appendChild(cell || existing);
        };
        visible.frozen.forEach(updateImpl);
        for (var i = visible.first; i <= visible.last; ++i) {
            updateImpl(i);
        }
    };
    ACellAdapter.prototype.syncFrozen = function (first) {
        var columns = this.context.columns;
        var visible = this.visibleColumns;
        if (!columns.some(function (d) { return d.frozen; })) {
            return 0;
        }
        if (first === 0) {
            if (visible.frozen.length > 0) {
                this.removeFrozenColumns(visible.frozen, 0);
                visible.frozen = [];
            }
            return 0;
        }
        var old = visible.frozen.length;
        var _a = Object(__WEBPACK_IMPORTED_MODULE_0__logic__["f" /* updateFrozen */])(visible.frozen, columns, first), target = _a.target, added = _a.added, removed = _a.removed;
        if (removed.length > 0) {
            this.removeFrozenColumns(removed, old - removed.length);
        }
        if (added.length > 0) {
            this.insertFrozenColumns(added, old - removed.length);
        }
        visible.frozen = target;
        return target.length;
    };
    ACellAdapter.prototype.onScrolledHorizontallyImpl = function (scrollLeft, clientWidth) {
        var column = this.context.column;
        var _a = Object(__WEBPACK_IMPORTED_MODULE_0__logic__["d" /* range */])(scrollLeft, clientWidth, column.defaultRowHeight, column.exceptions, column.numberOfRows), first = _a.first, last = _a.last, firstRowPos = _a.firstRowPos;
        var visible = this.visibleColumns;
        visible.forcedFirst = first;
        visible.forcedLast = last;
        if ((first - visible.first) >= 0 && (last - visible.last) <= 0) {
            return __WEBPACK_IMPORTED_MODULE_1__mixin__["a" /* EScrollResult */].NONE;
        }
        var r = __WEBPACK_IMPORTED_MODULE_1__mixin__["a" /* EScrollResult */].PARTIAL;
        var frozenShift = this.syncFrozen(first);
        if (first > visible.last || last < visible.first) {
            this.removeAllColumns(false);
            this.addColumnAtEnd(first, last);
            r = __WEBPACK_IMPORTED_MODULE_1__mixin__["a" /* EScrollResult */].ALL;
        }
        else if (first < visible.first) {
            this.removeColumnFromEnd(last + 1, visible.last);
            this.addColumnAtStart(first, visible.first - 1, frozenShift);
        }
        else {
            this.removeColumnFromStart(visible.first, first - 1, frozenShift);
            this.addColumnAtEnd(visible.last + 1, last);
        }
        visible.first = first;
        visible.last = last;
        this.updateColumnOffset(firstRowPos);
        return r;
    };
    return ACellAdapter;
}());

/* harmony default export */ __webpack_exports__["a"] = (ACellAdapter);
function verifyRow(row, index, columns) {
    var cols = Array.from(row.children);
    if (cols.length <= 1) {
        return;
    }
    var colObjs = cols.map(function (c) { return columns.find(function (d) { return d.id === c.dataset.id; }); });
    console.assert(colObjs.every(function (d) { return Boolean(d); }), 'all columns must exist', index);
    console.assert(colObjs.every(function (d, i) { return i === 0 || d.index >= colObjs[i - 1].index; }), 'all columns in ascending order', index);
    console.assert((new Set(colObjs)).size === colObjs.length, 'unique columns', colObjs);
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ACellRenderer__ = __webpack_require__(13);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ACellRenderer", function() { return __WEBPACK_IMPORTED_MODULE_0__ACellRenderer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ARowRenderer__ = __webpack_require__(3);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ARowRenderer", function() { return __WEBPACK_IMPORTED_MODULE_1__ARowRenderer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic__ = __webpack_require__(0);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "uniformContext", function() { return __WEBPACK_IMPORTED_MODULE_2__logic__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "nonUniformContext", function() { return __WEBPACK_IMPORTED_MODULE_2__logic__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "randomContext", function() { return __WEBPACK_IMPORTED_MODULE_2__logic__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "range", function() { return __WEBPACK_IMPORTED_MODULE_2__logic__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "frozenDelta", function() { return __WEBPACK_IMPORTED_MODULE_2__logic__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "updateFrozen", function() { return __WEBPACK_IMPORTED_MODULE_2__logic__["f"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__abortAble__ = __webpack_require__(5);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ABORTED", function() { return __WEBPACK_IMPORTED_MODULE_3__abortAble__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isAbortAble", function() { return __WEBPACK_IMPORTED_MODULE_3__abortAble__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style__ = __webpack_require__(4);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "GridStyleManager", function() { return __WEBPACK_IMPORTED_MODULE_4__style__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "setColumn", function() { return __WEBPACK_IMPORTED_MODULE_4__style__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TEMPLATE", function() { return __WEBPACK_IMPORTED_MODULE_4__style__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "setTemplate", function() { return __WEBPACK_IMPORTED_MODULE_4__style__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "StyleManager", function() { return __WEBPACK_IMPORTED_MODULE_4__style__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mixin__ = __webpack_require__(1);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "EScrollResult", function() { return __WEBPACK_IMPORTED_MODULE_5__mixin__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "PrefetchMixin", function() { return __WEBPACK_IMPORTED_MODULE_5__mixin__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__table__ = __webpack_require__(15);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ACellTableSection", function() { return __WEBPACK_IMPORTED_MODULE_6__table__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "MultiTableRowRenderer", function() { return __WEBPACK_IMPORTED_MODULE_6__table__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__animation__ = __webpack_require__(6);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "KeyFinder", function() { return __WEBPACK_IMPORTED_MODULE_7__animation__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "EAnimationMode", function() { return __WEBPACK_IMPORTED_MODULE_7__animation__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "noAnimationChange", function() { return __WEBPACK_IMPORTED_MODULE_7__animation__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "defaultPhases", function() { return __WEBPACK_IMPORTED_MODULE_7__animation__["c"]; });








var version = "1.0.0-alpha.3";


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ACellRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ARowRenderer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__table_internal_ACellAdapter__ = __webpack_require__(11);




var ACellRenderer = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](ACellRenderer, _super);
    function ACellRenderer(root, htmlId, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, Object(__WEBPACK_IMPORTED_MODULE_2__style__["e" /* setTemplate */])(root).querySelector('main > article'), options) || this;
        _this.root = root;
        root.classList.add('lineup-engine');
        _this.style = new __WEBPACK_IMPORTED_MODULE_2__style__["a" /* GridStyleManager */](_this.root, htmlId);
        var that = _this;
        var LocalCell = (function (_super) {
            __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](LocalCell, _super);
            function LocalCell() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(LocalCell.prototype, "context", {
                get: function () {
                    return that.context;
                },
                enumerable: true,
                configurable: true
            });
            LocalCell.prototype.createHeader = function (document, column) {
                return that.createHeader(document, column);
            };
            LocalCell.prototype.updateHeader = function (node, column) {
                return that.updateHeader(node, column);
            };
            LocalCell.prototype.createCell = function (document, index, column) {
                return that.createCell(document, index, column);
            };
            LocalCell.prototype.updateCell = function (node, index, column) {
                return that.updateCell(node, index, column);
            };
            LocalCell.prototype.forEachRow = function (callback) {
                return that.forEachRow(callback);
            };
            return LocalCell;
        }(__WEBPACK_IMPORTED_MODULE_3__table_internal_ACellAdapter__["a" /* default */]));
        _this.cell = new (LocalCell.bind.apply(LocalCell, [void 0, _this.header, _this.style, undefined].concat((options.mixins || []))))();
        return _this;
    }
    Object.defineProperty(ACellRenderer.prototype, "header", {
        get: function () {
            return this.root.querySelector('header > article');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ACellRenderer.prototype, "headerScroller", {
        get: function () {
            return this.root.querySelector('header');
        },
        enumerable: true,
        configurable: true
    });
    ACellRenderer.prototype.addColumnMixin = function (mixinClass, options) {
        this.cell.addColumnMixin(mixinClass, options);
    };
    ACellRenderer.prototype.init = function () {
        var _this = this;
        this.cell.init();
        var scroller = this.body.parentElement;
        var oldLeft = scroller.scrollLeft;
        var oldWidth = scroller.clientWidth;
        var handler = function () {
            var left = scroller.scrollLeft;
            var width = scroller.clientWidth;
            if (Math.abs(oldLeft - left) < _this.options.minScrollDelta && Math.abs(oldWidth - width) < _this.options.minScrollDelta) {
                return;
            }
            var isGoingRight = left > oldLeft;
            oldLeft = left;
            oldWidth = width;
            _this.onScrolledHorizontally(left, width, isGoingRight);
        };
        scroller.addEventListener('scroll', this.createDelayedHandler(handler));
        _super.prototype.init.call(this);
    };
    ACellRenderer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.root.remove();
    };
    ACellRenderer.prototype.onScrolledHorizontally = function (scrollLeft, clientWidth, isGoingRight) {
        return this.cell.onScrolledHorizontally(scrollLeft, clientWidth, isGoingRight);
    };
    ACellRenderer.prototype.updateHeaders = function () {
        this.cell.updateHeaders();
    };
    ACellRenderer.prototype.updateColumnWidths = function () {
        var context = this.context;
        this.style.update(context.defaultRowHeight - context.padding(-1), context.columns, context.column.padding);
    };
    ACellRenderer.prototype.recreate = function (ctx) {
        var scroller = this.bodyScroller;
        var oldLeft = scroller.scrollLeft;
        this.cell.recreate(oldLeft, scroller.clientWidth);
        _super.prototype.recreate.call(this, ctx);
        scroller.scrollLeft = oldLeft;
    };
    ACellRenderer.prototype.clearPool = function () {
        _super.prototype.clearPool.call(this);
        this.cell.clearPool();
    };
    ACellRenderer.prototype.createRow = function (node, rowIndex) {
        this.cell.createRow(node, rowIndex);
    };
    ACellRenderer.prototype.updateRow = function (node, rowIndex) {
        this.cell.updateRow(node, rowIndex);
    };
    return ACellRenderer;
}(__WEBPACK_IMPORTED_MODULE_1__ARowRenderer__["a" /* ARowRenderer */]));

/* unused harmony default export */ var _unused_webpack_default_export = (ACellRenderer);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__logic__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__IMixin__ = __webpack_require__(8);


var PrefetchMixin = (function () {
    function PrefetchMixin(adapter, options) {
        this.adapter = adapter;
        this.prefetchTimeout = -1;
        this.options = {
            prefetchRows: 20,
            cleanUpRows: 3,
            delay: 50
        };
        Object.assign(this.options, options);
        return this;
    }
    PrefetchMixin.prototype.prefetchDown = function () {
        this.prefetchTimeout = -1;
        var context = this.adapter.context;
        var nextLast = Math.min(this.adapter.visible.last + this.options.prefetchRows, context.numberOfRows - 1);
        if (this.adapter.visible.last === nextLast && this.adapter.visible.last >= (this.adapter.visible.forcedLast + this.options.prefetchRows)) {
            return;
        }
        this.adapter.addAtBottom(this.adapter.visible.last + 1, nextLast);
        this.adapter.visible.last = nextLast;
    };
    PrefetchMixin.prototype.prefetchUp = function () {
        this.prefetchTimeout = -1;
        if (this.adapter.visible.first <= (this.adapter.visible.forcedFirst - this.options.prefetchRows)) {
            return;
        }
        var context = this.adapter.context;
        var scroller = this.adapter.scroller;
        var fakeOffset = Math.max(scroller.scrollTop - this.options.prefetchRows * context.defaultRowHeight, 0);
        var height = scroller.clientHeight;
        var _a = Object(__WEBPACK_IMPORTED_MODULE_0__logic__["d" /* range */])(fakeOffset, height, context.defaultRowHeight, context.exceptions, context.numberOfRows), first = _a.first, firstRowPos = _a.firstRowPos;
        if (first === this.adapter.visible.first) {
            return;
        }
        var frozenShift = this.adapter.syncFrozen ? this.adapter.syncFrozen(first) : 0;
        this.adapter.addAtBeginning(first, this.adapter.visible.first - 1, frozenShift);
        this.adapter.visible.first = first;
        this.adapter.updateOffset(firstRowPos);
    };
    PrefetchMixin.prototype.triggerPrefetch = function (isGoingDown) {
        if (this.prefetchTimeout >= 0) {
            clearTimeout(this.prefetchTimeout);
        }
        var prefetchDownPossible = this.adapter.visible.last < (this.adapter.visible.forcedLast + this.options.prefetchRows);
        var prefetchUpPossible = this.adapter.visible.first > (this.adapter.visible.forcedFirst - this.options.prefetchRows);
        var isLast = this.adapter.visible.last === this.adapter.context.numberOfRows;
        var isFirst = this.adapter.visible.first === 0;
        if ((isGoingDown && !prefetchDownPossible && !isLast) || (!isGoingDown && !prefetchUpPossible && !isFirst)) {
            return;
        }
        var op = (isGoingDown || isFirst) ? this.prefetchDown.bind(this) : this.prefetchUp.bind(this);
        this.prefetchTimeout = setTimeout(op, this.options.delay);
    };
    PrefetchMixin.prototype.cleanUpTop = function (first) {
        this.prefetchTimeout = -1;
        var newFirst = Math.max(0, first - this.options.cleanUpRows);
        if (newFirst <= this.adapter.visible.first) {
            return;
        }
        var frozenShift = this.adapter.syncFrozen ? this.adapter.syncFrozen(newFirst) : 0;
        this.adapter.removeFromBeginning(this.adapter.visible.first, newFirst - 1, frozenShift);
        var context = this.adapter.context;
        var shift = (newFirst - this.adapter.visible.first) * context.defaultRowHeight;
        if (context.exceptions.length > 0) {
            for (var i = this.adapter.visible.first; i < newFirst; ++i) {
                if (context.exceptionsLookup.has(i)) {
                    shift += context.exceptionsLookup.get(i) - context.defaultRowHeight;
                }
            }
        }
        this.adapter.visible.first = newFirst;
        this.adapter.updateOffset(this.adapter.visibleFirstRowPos + shift);
        this.prefetchDown();
    };
    PrefetchMixin.prototype.cleanUpBottom = function (last) {
        this.prefetchTimeout = -1;
        var newLast = last + this.options.cleanUpRows;
        if (this.adapter.visible.last <= newLast) {
            return;
        }
        this.adapter.removeFromBottom(newLast + 1, this.adapter.visible.last);
        this.adapter.visible.last = newLast;
        this.prefetchUp();
    };
    PrefetchMixin.prototype.triggerCleanUp = function (first, last, isGoingDown) {
        if (this.prefetchTimeout >= 0) {
            clearTimeout(this.prefetchTimeout);
        }
        if ((isGoingDown && (first - this.options.cleanUpRows) <= this.adapter.visible.first) || (!isGoingDown && this.adapter.visible.last <= (last + this.options.cleanUpRows))) {
            return;
        }
        this.prefetchTimeout = setTimeout(isGoingDown ? this.cleanUpTop.bind(this) : this.cleanUpBottom.bind(this), this.options.delay, isGoingDown ? first : last);
    };
    PrefetchMixin.prototype.onScrolled = function (isGoingDown, scrollResult) {
        if (scrollResult === __WEBPACK_IMPORTED_MODULE_1__IMixin__["a" /* EScrollResult */].NONE) {
            if (this.options.cleanUpRows > 0) {
                this.triggerCleanUp(this.adapter.visible.forcedFirst, this.adapter.visible.forcedLast, isGoingDown);
            }
        }
        else if (this.options.prefetchRows > 0) {
            this.triggerPrefetch(isGoingDown);
        }
    };
    return PrefetchMixin;
}());
/* harmony default export */ __webpack_exports__["a"] = (PrefetchMixin);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ACellTableSection__ = __webpack_require__(16);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__ACellTableSection__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MultiTableRowRenderer__ = __webpack_require__(17);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__MultiTableRowRenderer__["a"]; });




/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ACellTableSection; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ARowRenderer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__internal_ACellAdapter__ = __webpack_require__(11);




var ACellTableSection = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](ACellTableSection, _super);
    function ACellTableSection(header, body, tableId, style, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, body, options) || this;
        _this.header = header;
        _this.tableId = tableId;
        _this.style = style;
        var that = _this;
        var LocalCell = (function (_super) {
            __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](LocalCell, _super);
            function LocalCell() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(LocalCell.prototype, "context", {
                get: function () {
                    return that.context;
                },
                enumerable: true,
                configurable: true
            });
            LocalCell.prototype.createHeader = function (document, column) {
                return that.createHeader(document, column);
            };
            LocalCell.prototype.updateHeader = function (node, column) {
                return that.updateHeader(node, column);
            };
            LocalCell.prototype.createCell = function (document, index, column) {
                return that.createCell(document, index, column);
            };
            LocalCell.prototype.updateCell = function (node, index, column) {
                return that.updateCell(node, index, column);
            };
            LocalCell.prototype.forEachRow = function (callback) {
                return that.forEachRow(callback);
            };
            return LocalCell;
        }(__WEBPACK_IMPORTED_MODULE_3__internal_ACellAdapter__["a" /* default */]));
        _this.cell = new (LocalCell.bind.apply(LocalCell, [void 0, _this.header, _this.style, tableId].concat((options.mixins || []))))();
        return _this;
    }
    ACellTableSection.prototype.addColumnMixin = function (mixinClass, options) {
        this.cell.addColumnMixin(mixinClass, options);
    };
    Object.defineProperty(ACellTableSection.prototype, "width", {
        get: function () {
            return this.context.column.totalHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ACellTableSection.prototype, "hidden", {
        get: function () {
            return this.header.classList.contains('loading');
        },
        set: function (value) {
            var old = this.hidden;
            if (old === value) {
                return;
            }
            this.header.classList.toggle('loading', value);
            this.body.classList.toggle('loading', value);
            this.onVisibilityChanged(!value);
        },
        enumerable: true,
        configurable: true
    });
    ACellTableSection.prototype.onVisibilityChanged = function (_visible) {
    };
    ACellTableSection.prototype.hide = function () {
        this.hidden = true;
    };
    ACellTableSection.prototype.show = function (scrollLeft, clientWidth, isGoingRight) {
        this.hidden = false;
        this.cell.onScrolledHorizontally(scrollLeft, clientWidth, isGoingRight);
    };
    ACellTableSection.prototype.init = function () {
        this.hide();
        this.cell.init();
        _super.prototype.init.call(this);
    };
    ACellTableSection.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.header.remove();
        this.style.remove(this.tableId);
    };
    ACellTableSection.prototype.onScrolledVertically = function (scrollTop, clientHeight, isGoingDown) {
        if (this.hidden) {
            return __WEBPACK_IMPORTED_MODULE_2__mixin__["a" /* EScrollResult */].NONE;
        }
        return _super.prototype.onScrolledVertically.call(this, scrollTop, clientHeight, isGoingDown);
    };
    ACellTableSection.prototype.onScrolledHorizontally = function (scrollLeft, clientWidth, isGoingRight) {
        return this.cell.onScrolledHorizontally(scrollLeft, clientWidth, isGoingRight);
    };
    ACellTableSection.prototype.updateHeaders = function () {
        this.cell.updateHeaders();
    };
    ACellTableSection.prototype.updateColumnWidths = function () {
        var context = this.context;
        this.style.update(context.defaultRowHeight - context.padding(-1), context.columns, context.column.padding, this.tableId);
    };
    ACellTableSection.prototype.recreate = function (ctx) {
        var scroller = this.bodyScroller;
        var oldLeft = scroller.scrollLeft;
        this.cell.recreate(oldLeft, scroller.clientWidth);
        _super.prototype.recreate.call(this, ctx);
        scroller.scrollLeft = oldLeft;
    };
    ACellTableSection.prototype.clearPool = function () {
        _super.prototype.clearPool.call(this);
        this.cell.clearPool();
    };
    ACellTableSection.prototype.createRow = function (node, rowIndex) {
        this.cell.createRow(node, rowIndex);
    };
    ACellTableSection.prototype.updateRow = function (node, rowIndex) {
        this.cell.updateRow(node, rowIndex);
    };
    return ACellTableSection;
}(__WEBPACK_IMPORTED_MODULE_1__ARowRenderer__["b" /* default */]));



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__logic__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style_index__ = __webpack_require__(4);



var MultiTableRowRenderer = (function () {
    function MultiTableRowRenderer(node, htmlId, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.node = node;
        this.tableId = 0;
        this.sections = [];
        this.visible = {
            first: 0,
            forcedFirst: 0,
            last: 0,
            forcedLast: 0
        };
        this.options = {
            columnPadding: 0
        };
        this.context = Object(__WEBPACK_IMPORTED_MODULE_0__logic__["e" /* uniformContext */])(0, 500);
        Object.assign(this.options, options);
        node.innerHTML = "<header></header><main></main>";
        node.classList.add('lineup-engine', 'lineup-multi-engine');
        this.style = new __WEBPACK_IMPORTED_MODULE_2__style_index__["a" /* GridStyleManager */](this.node, htmlId);
        var main = this.main;
        var oldLeft = main.scrollLeft;
        var oldWidth = main.clientWidth;
        main.addEventListener('scroll', function () {
            var left = main.scrollLeft;
            var width = main.clientWidth;
            if (left === oldLeft && width === oldWidth) {
                return;
            }
            var isGoingRight = left > oldLeft;
            oldLeft = left;
            oldWidth = width;
            _this.onScrolledHorizontally(left, width, isGoingRight);
        });
    }
    MultiTableRowRenderer.prototype.update = function () {
        this.context = Object(__WEBPACK_IMPORTED_MODULE_0__logic__["b" /* nonUniformContext */])(this.sections.map(function (d) { return d.width; }), NaN, this.options.columnPadding);
        this.updateGrid();
        this.onScrolledHorizontally(this.main.scrollLeft, this.main.clientWidth, false);
    };
    MultiTableRowRenderer.prototype.updateGrid = function () {
        var content = __WEBPACK_IMPORTED_MODULE_2__style_index__["a" /* GridStyleManager */].gridColumn(this.sections);
        this.style.updateRule("multiTableRule", this.style.id + " > header, " + this.style.id + " > main { " + content + " }");
    };
    MultiTableRowRenderer.prototype.onScrolledHorizontally = function (scrollLeft, clientWidth, isGoingRight) {
        var _a = Object(__WEBPACK_IMPORTED_MODULE_0__logic__["d" /* range */])(scrollLeft, clientWidth, this.context.defaultRowHeight, this.context.exceptions, this.context.numberOfRows), first = _a.first, last = _a.last;
        var visible = this.visible;
        visible.forcedFirst = first;
        visible.forcedLast = last;
        var offset = 0;
        this.sections.forEach(function (s, i) {
            if (i >= first && i <= last) {
                s.show(Math.max(0, scrollLeft - offset), Math.min(scrollLeft + clientWidth - offset, s.width), isGoingRight);
            }
            else {
                s.hide();
            }
            offset += s.width;
        });
        visible.first = first;
        visible.last = last;
        return __WEBPACK_IMPORTED_MODULE_1__mixin__["a" /* EScrollResult */].PARTIAL;
    };
    MultiTableRowRenderer.prototype.destroy = function () {
        this.sections.forEach(function (d) { return d.destroy(); });
        this.node.remove();
    };
    Object.defineProperty(MultiTableRowRenderer.prototype, "doc", {
        get: function () {
            return this.node.ownerDocument;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiTableRowRenderer.prototype, "header", {
        get: function () {
            return this.node.querySelector('header');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiTableRowRenderer.prototype, "main", {
        get: function () {
            return this.node.querySelector('main');
        },
        enumerable: true,
        configurable: true
    });
    MultiTableRowRenderer.prototype.pushTable = function (factory) {
        var extras = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extras[_i - 1] = arguments[_i];
        }
        var header = this.doc.createElement('article');
        var body = this.doc.createElement('article');
        var tableId = "T" + this.tableId++;
        var ids = this.style.tableIds(tableId);
        header.id = ids.header;
        body.id = ids.body;
        this.header.appendChild(header);
        this.main.appendChild(body);
        var table = factory.apply(void 0, [header, body, tableId, this.style].concat(extras));
        table.init();
        this.sections.push(table);
        this.update();
        return table;
    };
    MultiTableRowRenderer.prototype.pushSeparator = function (factory) {
        var extras = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extras[_i - 1] = arguments[_i];
        }
        var header = this.doc.createElement('section');
        var body = this.doc.createElement('section');
        this.header.appendChild(header);
        this.main.appendChild(body);
        var separator = factory.apply(void 0, [header, body, this.style].concat(extras));
        separator.init();
        this.sections.push(separator);
        this.update();
        return separator;
    };
    MultiTableRowRenderer.prototype.remove = function (section) {
        var index = this.sections.indexOf(section);
        if (index < 0) {
            return false;
        }
        this.sections.splice(index, 1);
        section.destroy();
        this.update();
        return true;
    };
    MultiTableRowRenderer.prototype.clear = function () {
        this.sections.splice(0, this.sections.length).forEach(function (s) { return s.destroy(); });
        this.update();
    };
    MultiTableRowRenderer.prototype.widthChanged = function () {
        this.update();
    };
    return MultiTableRowRenderer;
}());
/* harmony default export */ __webpack_exports__["a"] = (MultiTableRowRenderer);


/***/ })
/******/ ]);
});