import { inherits as _inherits, createSuper as _createSuper, classCallCheck as _classCallCheck, defineProperty as _defineProperty, assertThisInitialized as _assertThisInitialized, createClass as _createClass, get as _get, getPrototypeOf as _getPrototypeOf } from "../../_virtual/_rollupPluginBabelHelpers.js";
import util from "../../utils/util.js";
import { COMPLETE, PIP_CHANGE } from "../../events.js";
import "../../utils/debug.js";
import { POSITIONS } from "../../plugin/plugin.js";
import { xgIconTips } from "../common/iconTools.js";
import Fullscreen from "../common/iconPlugin.js";
import PipIcon from "../assets/pipIcon.js";
import PipIconExit from "../assets/pipIconExit.js";
var PresentationMode = {
  PIP: "picture-in-picture",
  INLINE: "inline",
  FULLSCREEN: "fullscreen"
};
var PIP = /* @__PURE__ */ function(_IconPlugin) {
  _inherits(PIP2, _IconPlugin);
  var _super = _createSuper(PIP2);
  function PIP2() {
    var _this;
    _classCallCheck(this, PIP2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "switchPIP", function(e) {
      if (!_this.isPIPAvailable()) {
        return false;
      }
      e.stopPropagation();
      if (_this.isPip) {
        _this.exitPIP();
        _this.emitUserAction(e, "change_pip", {
          props: "pip",
          from: true,
          to: false
        });
        _this.setAttr("data-state", "normal");
      } else if (_this.player.media.readyState === 4) {
        _this.requestPIP();
        _this.emitUserAction(e, "change_pip", {
          props: "pip",
          from: false,
          to: true
        });
        _this.setAttr("data-state", "pip");
      }
    });
    return _this;
  }
  _createClass(PIP2, [{
    key: "beforeCreate",
    value: function beforeCreate(args) {
      if (typeof args.player.config.pip === "boolean") {
        args.config.showIcon = args.player.config.pip;
      }
    }
  }, {
    key: "afterCreate",
    value: function afterCreate() {
      var _this2 = this;
      if (!this.isPIPAvailable()) {
        return;
      }
      _get(_getPrototypeOf(PIP2.prototype), "afterCreate", this).call(this);
      this.pMode = PresentationMode.INLINE;
      this.initPipEvents();
      if (this.config.showIcon) {
        this.initIcons();
      }
      this.once(COMPLETE, function() {
        if (_this2.config.showIcon) {
          util.removeClass(_this2.find(".xgplayer-icon"), "xg-icon-disable");
          _this2.bind("click", _this2.switchPIP);
        }
      });
    }
  }, {
    key: "registerIcons",
    value: function registerIcons() {
      return {
        pipIcon: {
          icon: PipIcon,
          class: "xg-get-pip"
        },
        pipIconExit: {
          icon: PipIconExit,
          class: "xg-exit-pip"
        }
      };
    }
  }, {
    key: "initIcons",
    value: function initIcons() {
      var icons = this.icons;
      this.appendChild(".xgplayer-icon", icons.pipIcon);
      this.appendChild(".xgplayer-icon", icons.pipIconExit);
    }
  }, {
    key: "initPipEvents",
    value: function initPipEvents() {
      var _this3 = this;
      var player = this.player;
      this.leavePIPCallback = function() {
        var paused = player.paused;
        util.setTimeout(_this3, function() {
          !paused && player.mediaPlay();
        }, 0);
        !paused && player.mediaPlay();
        _this3.setAttr("data-state", "normal");
        player.emit(PIP_CHANGE, false);
      };
      this.enterPIPCallback = function(e) {
        player.emit(PIP_CHANGE, true);
        _this3.pipWindow = e.pictureInPictureWindow;
        _this3.setAttr("data-state", "pip");
      };
      this.onWebkitpresentationmodechanged = function(e) {
        var mode = player.media.webkitPresentationMode;
        if (_this3.pMode === PresentationMode.FULLSCREEN && mode !== PresentationMode.FULLSCREEN) {
          player.onFullscreenChange(null, false);
        }
        _this3.pMode = mode;
        if (mode === PresentationMode.PIP) {
          _this3.enterPIPCallback(e);
        } else if (mode === PresentationMode.INLINE) {
          _this3.leavePIPCallback(e);
        }
      };
      if (player.media) {
        player.media.addEventListener("enterpictureinpicture", this.enterPIPCallback);
        player.media.addEventListener("leavepictureinpicture", this.leavePIPCallback);
        PIP2.checkWebkitSetPresentationMode(player.media) && player.media.addEventListener("webkitpresentationmodechanged", this.onWebkitpresentationmodechanged);
      }
    }
  }, {
    key: "requestPIP",
    value: function requestPIP() {
      var player = this.player, playerConfig = this.playerConfig;
      if (!this.isPIPAvailable() || this.isPip) {
        return;
      }
      try {
        var poster = playerConfig.poster;
        if (poster) {
          player.media.poster = util.typeOf(poster) === "String" ? poster : poster.poster;
        }
        PIP2.checkWebkitSetPresentationMode(player.media) ? player.media.webkitSetPresentationMode("picture-in-picture") : player.media.requestPictureInPicture();
        return true;
      } catch (reason) {
        console.error("requestPiP", reason);
        return false;
      }
    }
  }, {
    key: "exitPIP",
    value: function exitPIP() {
      var player = this.player;
      try {
        if (this.isPIPAvailable() && this.isPip) {
          PIP2.checkWebkitSetPresentationMode(player.media) ? player.media.webkitSetPresentationMode("inline") : document.exitPictureInPicture();
        }
        return true;
      } catch (reason) {
        console.error("exitPIP", reason);
        return false;
      }
    }
  }, {
    key: "isPip",
    get: function get() {
      var player = this.player;
      return document.pictureInPictureElement && document.pictureInPictureElement === player.media || player.media.webkitPresentationMode === PresentationMode.PIP;
    }
  }, {
    key: "isPIPAvailable",
    value: function isPIPAvailable() {
      var video = this.player.media;
      var _isEnabled = util.typeOf(document.pictureInPictureEnabled) === "Boolean" ? document.pictureInPictureEnabled : true;
      return _isEnabled && (util.typeOf(video.disablePictureInPicture) === "Boolean" && !video.disablePictureInPicture || video.webkitSupportsPresentationMode && util.typeOf(video.webkitSetPresentationMode) === "Function");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(PIP2.prototype), "destroy", this).call(this);
      var player = this.player;
      player.media.removeEventListener("enterpictureinpicture", this.enterPIPCallback);
      player.media.removeEventListener("leavepictureinpicture", this.leavePIPCallback);
      PIP2.checkWebkitSetPresentationMode(player.media) && player.media.removeEventListener("webkitpresentationmodechanged", this.onWebkitpresentationmodechanged);
      this.exitPIP();
      this.unbind("click", this.btnClick);
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.config.showIcon || !this.isPIPAvailable()) {
        return;
      }
      return '<xg-icon class="xgplayer-pip">\n      <div class="xgplayer-icon xg-icon-disable">\n      </div>\n      '.concat(xgIconTips(this, "PIP", this.playerConfig.isHideTips), "\n    </xg-icon>");
    }
  }], [{
    key: "pluginName",
    get: function get() {
      return "pip";
    }
  }, {
    key: "defaultConfig",
    get: function get() {
      return {
        position: POSITIONS.CONTROLS_RIGHT,
        index: 6,
        showIcon: false
      };
    }
  }, {
    key: "checkWebkitSetPresentationMode",
    value: function checkWebkitSetPresentationMode(video) {
      return typeof video.webkitSetPresentationMode === "function";
    }
  }]);
  return PIP2;
}(Fullscreen);
export { PIP as default };
