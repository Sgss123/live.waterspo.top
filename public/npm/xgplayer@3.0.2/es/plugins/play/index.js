import { inherits as _inherits, createSuper as _createSuper, classCallCheck as _classCallCheck, createClass as _createClass, get as _get, getPrototypeOf as _getPrototypeOf } from "../../_virtual/_rollupPluginBabelHelpers.js";
import "../../utils/util.js";
import { PAUSE, ERROR, EMPTIED, PLAY } from "../../events.js";
import "../../utils/debug.js";
import { POSITIONS } from "../../plugin/plugin.js";
import { xgIconTips } from "../common/iconTools.js";
import Fullscreen from "../common/iconPlugin.js";
import PlaySvg from "../assets/play.js";
import PauseSvg from "../assets/pause.js";
var Play = /* @__PURE__ */ function(_IconPlugin) {
  _inherits(Play2, _IconPlugin);
  var _super = _createSuper(Play2);
  function Play2() {
    _classCallCheck(this, Play2);
    return _super.apply(this, arguments);
  }
  _createClass(Play2, [{
    key: "afterCreate",
    value: function afterCreate() {
      var _this = this;
      _get(_getPrototypeOf(Play2.prototype), "afterCreate", this).call(this);
      var player = this.player, config = this.config;
      if (config.disable) {
        return;
      }
      this.initIcons();
      this.btnClick = this.btnClick.bind(this);
      this.bind(["touchend", "click"], this.btnClick);
      this.on([PAUSE, ERROR, EMPTIED], function() {
        _this.animate(player.paused);
      });
      this.on(PLAY, function() {
        _this.animate(player.paused);
      });
      this.animate(true);
    }
  }, {
    key: "registerIcons",
    value: function registerIcons() {
      return {
        play: {
          icon: PlaySvg,
          class: "xg-icon-play"
        },
        pause: {
          icon: PauseSvg,
          class: "xg-icon-pause"
        }
      };
    }
  }, {
    key: "btnClick",
    value: function btnClick(e) {
      e.preventDefault();
      e.stopPropagation();
      var player = this.player;
      this.emitUserAction(e, "switch_play_pause", {
        prop: "paused",
        from: player.paused,
        to: !player.paused
      });
      if (player.ended) {
        player.replay();
      } else if (player.paused) {
        player.play();
        this.animate(false);
      } else {
        player.pause();
        this.animate(true);
      }
      return false;
    }
  }, {
    key: "initIcons",
    value: function initIcons() {
      var icons = this.icons;
      this.appendChild(".xgplayer-icon", icons.play);
      this.appendChild(".xgplayer-icon", icons.pause);
    }
  }, {
    key: "animate",
    value: function animate(paused) {
      if (!this.player) {
        return;
      }
      var i18nKeys = this.i18nKeys;
      var tipDom = this.find(".xg-tips");
      if (paused) {
        this.setAttr("data-state", "pause");
        tipDom && this.changeLangTextKey(tipDom, i18nKeys.PLAY_TIPS);
      } else {
        this.setAttr("data-state", "play");
        tipDom && this.changeLangTextKey(tipDom, i18nKeys.PAUSE_TIPS);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(Play2.prototype), "destroy", this).call(this);
      this.unbind(["touchend", "click"], this.btnClick);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.config.disable) {
        return;
      }
      return '<xg-icon class="xgplayer-play">\n    <div class="xgplayer-icon">\n    </div>\n    '.concat(xgIconTips(this, "PLAY_TIPS", this.playerConfig.isHideTips), "\n    </xg-icon>");
    }
  }], [{
    key: "pluginName",
    get: function get() {
      return "play";
    }
  }, {
    key: "defaultConfig",
    get: function get() {
      return {
        position: POSITIONS.CONTROLS_LEFT,
        index: 0,
        disable: false
      };
    }
  }]);
  return Play2;
}(Fullscreen);
export { Play as default };
