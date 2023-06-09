import { inherits as _inherits, createSuper as _createSuper, classCallCheck as _classCallCheck, defineProperty as _defineProperty, assertThisInitialized as _assertThisInitialized, createClass as _createClass } from "../../_virtual/_rollupPluginBabelHelpers.js";
import "../../utils/util.js";
import "../../utils/debug.js";
import Plugin from "../../plugin/plugin.js";
var Fullscreen = /* @__PURE__ */ function(_Plugin) {
  _inherits(Fullscreen2, _Plugin);
  var _super = _createSuper(Fullscreen2);
  function Fullscreen2() {
    var _this;
    _classCallCheck(this, Fullscreen2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "_onMouseenter", function(e) {
      _this.emit("icon_mouseenter", {
        pluginName: _this.pluginName
      });
    });
    _defineProperty(_assertThisInitialized(_this), "_onMouseLeave", function(e) {
      _this.emit("icon_mouseleave", {
        pluginName: _this.pluginName
      });
    });
    return _this;
  }
  _createClass(Fullscreen2, [{
    key: "afterCreate",
    value: function afterCreate() {
      this.bind("mouseenter", this._onMouseenter);
      this.bind("mouseleave", this._onMouseLeave);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.unbind("mouseenter", this._onMouseenter);
      this.unbind("mouseleave", this._onMouseLeave);
    }
  }]);
  return Fullscreen2;
}(Plugin);
export { Fullscreen as default };
