import { defineProperty as _defineProperty, inherits as _inherits, createSuper as _createSuper, createClass as _createClass, classCallCheck as _classCallCheck } from "./_virtual/_rollupPluginBabelHelpers.js";
import Player from "./player.js";
import Plugin from "./plugin/plugin.js";
import BasePlugin from "./plugin/basePlugin.js";
import * as events from "./events.js";
import STATE_CLASS from "./stateClassMap.js";
import I18N from "./lang/i18n.js";
import Errors from "./error.js";
import sniffer from "./utils/sniffer.js";
import util from "./utils/util.js";
import DefaultPreset from "./presets/default.js";
var PresetPlayer = /* @__PURE__ */ function(_Player) {
  _inherits(PresetPlayer2, _Player);
  var _super = _createSuper(PresetPlayer2);
  function PresetPlayer2() {
    _classCallCheck(this, PresetPlayer2);
    return _super.apply(this, arguments);
  }
  return _createClass(PresetPlayer2);
}(Player);
_defineProperty(PresetPlayer, "defaultPreset", DefaultPreset);
_defineProperty(PresetPlayer, "Util", util);
_defineProperty(PresetPlayer, "Sniffer", sniffer);
_defineProperty(PresetPlayer, "Errors", Errors);
_defineProperty(PresetPlayer, "Events", events);
_defineProperty(PresetPlayer, "Plugin", Plugin);
_defineProperty(PresetPlayer, "BasePlugin", BasePlugin);
_defineProperty(PresetPlayer, "I18N", I18N);
_defineProperty(PresetPlayer, "STATE_CLASS", STATE_CLASS);
export { PresetPlayer as default };
