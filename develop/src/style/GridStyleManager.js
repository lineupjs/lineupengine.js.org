import * as tslib_1 from "tslib";
import StyleManager from './StyleManager';
import { addScroll } from '../internal';
export var TEMPLATE = "\n  <header>\n    <article></article>\n  </header>\n  <main>\n    <footer>&nbsp;</footer>\n    <article></article>\n  </main>";
export function setTemplate(root) {
    root.innerHTML = TEMPLATE;
    return root;
}
export function setColumn(node, column) {
    node.dataset.id = column.id;
}
var GridStyleManager = (function (_super) {
    tslib_1.__extends(GridStyleManager, _super);
    function GridStyleManager(root, id) {
        var _this = _super.call(this, root) || this;
        _this.id = id;
        var headerScroller = root.querySelector('header');
        var bodyScroller = root.querySelector('main');
        var oldDelta = 0;
        var oldDeltaScroll = 0;
        addScroll(bodyScroller, 'animation', function (act) {
            var old = headerScroller.scrollLeft;
            var newValue = act.left;
            if (old !== newValue) {
                headerScroller.scrollLeft = newValue;
            }
            root.classList.toggle('le-shifted', act.left > 0);
            var delta = act.width - headerScroller.clientWidth;
            if (Math.abs(delta) < 2) {
                return;
            }
            var deltaScroll = bodyScroller.scrollWidth - headerScroller.scrollWidth;
            if (oldDelta === delta && oldDeltaScroll === deltaScroll) {
                return;
            }
            oldDelta = delta;
            oldDeltaScroll = deltaScroll;
            self.setTimeout(function () {
                _this.updateRule('__scollBarFix', "\n          " + _this.hashedId + " > header {\n            margin-right: " + -delta + "px;\n          }\n        ", false);
                _this.updateRule('__scollBarFix2', "\n          " + _this.hashedId + " > header > :last-child {\n            border-right: " + deltaScroll + "px solid transparent;\n          }");
            }, 0);
        });
        return _this;
    }
    Object.defineProperty(GridStyleManager.prototype, "hashedId", {
        get: function () {
            return this.id.startsWith('#') ? this.id : "#" + this.id;
        },
        enumerable: true,
        configurable: true
    });
    GridStyleManager.prototype.update = function (defaultRowHeight, columns, frozenShift, tableId, unit) {
        if (unit === void 0) { unit = 'px'; }
        var selectors = tableId !== undefined ? this.tableIds(tableId, true) : {
            header: this.id + " > header > article",
            body: this.id + " > main > article"
        };
        this.updateRule("__heightsRule" + selectors.body, selectors.body + " > div {\n      height: " + defaultRowHeight + "px;\n    }", false);
        this.updateColumns(columns, selectors, frozenShift, unit);
        this.updateRules();
    };
    GridStyleManager.prototype.remove = function (tableId) {
        var selectors = this.tableIds(tableId, true);
        this.deleteRule("__heightsRule" + selectors.body, false);
        this.deleteRule("__widthRule" + selectors.body, false);
        var prefix = "__col" + selectors.body + "_";
        var rules = this.ruleNames.reduce(function (a, b) { return a + (b.startsWith(prefix) ? 1 : 0); }, 0);
        for (var i = 0; i < rules; ++i) {
            this.deleteRule("" + prefix + i, false);
        }
        this.updateRules();
    };
    GridStyleManager.prototype.tableIds = function (tableId, asSelector) {
        if (asSelector === void 0) { asSelector = false; }
        var cleanId = this.id.startsWith('#') ? this.id.slice(1) : this.id;
        return {
            header: "" + (asSelector ? '#' : '') + cleanId + "_H" + tableId,
            body: "" + (asSelector ? '#' : '') + cleanId + "_B" + tableId
        };
    };
    GridStyleManager.prototype.updateColumns = function (columns, selectors, frozenShift, unit) {
        var _this = this;
        if (unit === void 0) { unit = 'px'; }
        var prefix = "__col" + selectors.body + "_";
        var rules = this.ruleNames.reduce(function (a, b) { return a + (b.startsWith(prefix) ? 1 : 0); }, 0);
        var frozen = 0;
        var ruleCounter = 0;
        columns.forEach(function (c) {
            var rule = selectors.body + " > div > [data-id=\"" + c.id + "\"], " + selectors.header + " [data-id=\"" + c.id + "\"] {\n        width: " + c.width + unit + ";\n        " + (c.frozen ? "left: " + frozen + "px;" : '') + "\n      }";
            if (frozenShift !== 0 && c.frozen) {
                var shiftRule = selectors.body + " > div > [data-id=\"" + c.id + "\"] {\n          width: " + c.width + unit + ";\n          left: " + (frozen + frozenShift) + "px;\n        }";
                rule = selectors.header + " [data-id=\"" + c.id + "\"] {\n          width: " + c.width + unit + ";\n          left: " + frozen + "px;\n        }";
                _this.updateRule("" + prefix + ruleCounter++, shiftRule, false);
            }
            if (c.frozen) {
                frozen += c.width;
            }
            _this.updateRule("" + prefix + ruleCounter++, rule, false);
        });
        for (var i = ruleCounter - 1; i < rules; ++i) {
            this.deleteRule("" + prefix + i, false);
        }
    };
    return GridStyleManager;
}(StyleManager));
export default GridStyleManager;
//# sourceMappingURL=GridStyleManager.js.map