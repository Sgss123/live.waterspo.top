import { inherits as _inherits, createSuper as _createSuper, classCallCheck as _classCallCheck, createClass as _createClass } from "../../_virtual/_rollupPluginBabelHelpers.js";
import "../../utils/util.js";
import { PLAY, PAUSE, ENDED, EMPTIED, FPS_STUCK } from "../../events.js";
import "../../utils/debug.js";
import Plugin from "../../plugin/plugin.js";
var FpsDetect = /* @__PURE__ */ function(_BasePlugin) {
  _inherits(FpsDetect2, _BasePlugin);
  var _super = _createSuper(FpsDetect2);
  function FpsDetect2() {
    _classCallCheck(this, FpsDetect2);
    return _super.apply(this, arguments);
  }
  _createClass(FpsDetect2, [{
    key: "afterCreate",
    value: function afterCreate() {
      var _this = this;
      var player = this.player, config = this.config;
      this.timer = null;
      this._lastDecodedFrames = 0;
      this._currentStuckCount = 0;
      this._lastCheckPoint = null;
      if (config.disabled)
        return;
      var getVideoPlaybackQuality = player.media.getVideoPlaybackQuality;
      if (!getVideoPlaybackQuality)
        return;
      this.on(PLAY, function() {
        _this._startTick();
      });
      this.on(PAUSE, function() {
        _this._stopTick();
      });
      this.on(ENDED, function() {
        _this._stopTick();
      });
      this.on(EMPTIED, function() {
        _this._stopTick();
      });
    }
  }, {
    key: "_startTick",
    value: function _startTick() {
      var _this2 = this;
      this._stopTick();
      this._timer = setTimeout(function() {
        _this2._checkDecodeFPS();
        _this2._startTick();
      }, this.config.tick);
    }
  }, {
    key: "_stopTick",
    value: function _stopTick() {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }, {
    key: "_checkStuck",
    value: function _checkStuck(curDecodedFrames) {
      var media = this.player.media;
      var hidden = document.hidden;
      var paused = media.paused;
      if (typeof hidden === "boolean" && !hidden && !paused) {
        var curTime = media.currentTime;
        var buffered = media.buffered;
        var enoughBuffer = false;
        for (var i = 0; i < buffered.length; i++) {
          var start = buffered.start(i);
          var end = buffered.end(i);
          if (start <= curTime && curTime <= end - 1) {
            enoughBuffer = true;
            break;
          }
        }
        if (media.readyState === 4 && enoughBuffer) {
          if (this._currentStuckCount > this.config.stuckCount) {
            this.emit(FPS_STUCK);
            this._currentStuckCount = 0;
          } else {
            if (curDecodedFrames <= this.config.reportFrame) {
              this._currentStuckCount++;
            } else {
              this._currentStuckCount = 0;
            }
          }
        }
      }
    }
  }, {
    key: "_checkDecodeFPS",
    value: function _checkDecodeFPS() {
      if (!this.player.media) {
        return;
      }
      var _this$player$media$ge = this.player.media.getVideoPlaybackQuality(), totalVideoFrames = _this$player$media$ge.totalVideoFrames;
      var currTime = performance.now();
      if (totalVideoFrames) {
        if (this._lastCheckPoint) {
          var curDecoded = totalVideoFrames - this._lastDecodedFrames;
          this._checkStuck(curDecoded);
        }
      }
      this._lastDecodedFrames = totalVideoFrames;
      this._lastCheckPoint = currTime;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._stopTick();
    }
  }], [{
    key: "pluginName",
    get: function get() {
      return "FpsDetect";
    }
  }, {
    key: "defaultConfig",
    get: function get() {
      return {
        disabled: false,
        tick: 1e3,
        stuckCount: 3,
        reportFrame: 0
      };
    }
  }]);
  return FpsDetect2;
}(Plugin);
export { FpsDetect as default };
