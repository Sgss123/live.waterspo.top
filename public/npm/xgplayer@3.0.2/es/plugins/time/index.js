import { inherits as _inherits, createSuper as _createSuper, classCallCheck as _classCallCheck, createClass as _createClass, get as _get, getPrototypeOf as _getPrototypeOf } from "../../_virtual/_rollupPluginBabelHelpers.js";
import util from "../../utils/util.js";
import { DURATION_CHANGE, TIME_UPDATE, ENDED, EMPTIED, SEEKED } from "../../events.js";
import "../../utils/debug.js";
import Plugin, { POSITIONS } from "../../plugin/plugin.js";
var Time = /* @__PURE__ */ function(_Plugin) {
  _inherits(Time2, _Plugin);
  var _super = _createSuper(Time2);
  function Time2(args) {
    var _this;
    _classCallCheck(this, Time2);
    _this = _super.call(this, args);
    _this.isActiving = false;
    return _this;
  }
  _createClass(Time2, [{
    key: "duration",
    get: function get() {
      return this.playerConfig.customDuration || this.player.duration;
    }
  }, {
    key: "currentTime",
    get: function get() {
      return this.player.currentTime || 0;
    }
  }, {
    key: "timeOffset",
    get: function get() {
      return this.playerConfig.timeOffset || 0;
    }
  }, {
    key: "afterCreate",
    value: function afterCreate() {
      var _this2 = this;
      var constrolsMode = this.player.controls.config.mode;
      this.mode = constrolsMode === "flex" ? "flex" : "normal";
      if (this.config.disable) {
        return;
      }
      if (this.mode === "flex") {
        this.createCenterTime();
        this.hide();
      }
      this.durationDom = this.find(".time-duration");
      this.timeDom = this.find(".time-current");
      this.on(DURATION_CHANGE, function() {
        _this2.onTimeUpdate();
      });
      this.on(TIME_UPDATE, function() {
        _this2.onTimeUpdate();
      });
      this.on(ENDED, function() {
        _this2.onTimeUpdate(true);
      });
      this.on(EMPTIED, function() {
        _this2.onReset();
      });
    }
  }, {
    key: "show",
    value: function show() {
      if (this.mode === "flex") {
        return;
      }
      _get(_getPrototypeOf(Time2.prototype), "show", this).call(this);
    }
  }, {
    key: "onTimeUpdate",
    value: function onTimeUpdate(isEnded) {
      var player = this.player, config = this.config, duration = this.duration;
      if (config.disable || this.isActiving || !player.hasStart) {
        return;
      }
      var current = player.currentTime + this.timeOffset;
      current = util.adjustTimeByDuration(current, duration, isEnded);
      if (this.mode === "flex") {
        this.centerCurDom.innerHTML = util.format(current);
        if (duration !== Infinity && duration > 0) {
          this.centerDurDom.innerHTML = util.format(duration);
        }
      } else {
        this.timeDom.innerHTML = util.format(current);
        if (duration !== Infinity && duration > 0) {
          this.durationDom.innerHTML = util.format(duration);
        }
      }
    }
  }, {
    key: "onReset",
    value: function onReset() {
      if (this.mode === "flex") {
        this.centerCurDom.innerHTML = util.format(0);
        this.centerDurDom.innerHTML = util.format(0);
      } else {
        this.timeDom.innerHTML = util.format(0);
        this.durationDom.innerHTML = util.format(0);
      }
    }
  }, {
    key: "createCenterTime",
    value: function createCenterTime() {
      var player = this.player;
      if (!player.controls || !player.controls.center) {
        return;
      }
      var center = player.controls.center;
      this.centerCurDom = util.createDom("xg-icon", "00:00", {}, "xgplayer-time left");
      this.centerDurDom = util.createDom("xg-icon", "00:00", {}, "xgplayer-time right");
      center.children.length > 0 ? center.insertBefore(this.centerCurDom, center.children[0]) : center.appendChild(this.centerCurDom);
      center.appendChild(this.centerDurDom);
    }
  }, {
    key: "afterPlayerInit",
    value: function afterPlayerInit() {
      var config = this.config;
      if (this.duration === Infinity || this.playerConfig.isLive) {
        util.hide(this.durationDom);
        util.hide(this.timeDom);
        util.hide(this.find(".time-separator"));
        util.show(this.find(".time-live-tag"));
      } else {
        util.hide(this.find(".time-live-tag"));
      }
      if (config.hide) {
        this.hide();
        return;
      }
      this.show();
    }
  }, {
    key: "changeLiveState",
    value: function changeLiveState(isLive) {
      if (isLive) {
        util.hide(this.durationDom);
        util.hide(this.timeDom);
        util.hide(this.find(".time-separator"));
        util.show(this.find(".time-live-tag"));
      } else {
        util.hide(this.find(".time-live-tag"));
        util.show(this.find(".time-separator"));
        util.show(this.durationDom);
        util.show(this.timeDom);
      }
    }
  }, {
    key: "updateTime",
    value: function updateTime(time) {
      this.isActiving = true;
      if (!time && time !== 0 || time > this.duration) {
        return;
      }
      if (this.mode === "flex") {
        this.centerCurDom.innerHTML = util.format(time);
        return;
      }
      this.timeDom.innerHTML = util.format(time);
    }
  }, {
    key: "resetActive",
    value: function resetActive() {
      var _this3 = this;
      var player = this.player;
      var updateState = function updateState2() {
        _this3.isActiving = false;
      };
      this.off(SEEKED, updateState);
      if (player.isSeeking) {
        this.once(SEEKED, updateState);
      } else {
        this.isActiving = false;
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var center = this.player.controls.center;
      this.centerCurDom && center.removeChild(this.centerCurDom);
      this.centerCurDom = null;
      this.centerDurDom && center.removeChild(this.centerDurDom);
      this.centerDurDom = null;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.config.disable) {
        return;
      }
      return '<xg-icon class="xgplayer-time">\n    <span class="time-current">00:00</span>\n    <span class="time-separator">/</span>\n    <span class="time-duration">00:00</span>\n    <span class="time-live-tag">'.concat(this.i18n.LIVE_TIP, "</span>\n    </xg-icon>");
    }
  }], [{
    key: "pluginName",
    get: function get() {
      return "time";
    }
  }, {
    key: "defaultConfig",
    get: function get() {
      return {
        position: POSITIONS.CONTROLS_LEFT,
        index: 2,
        disable: false
      };
    }
  }]);
  return Time2;
}(Plugin);
export { Time as default };
