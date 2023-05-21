import { inherits as _inherits, createSuper as _createSuper, classCallCheck as _classCallCheck, defineProperty as _defineProperty, assertThisInitialized as _assertThisInitialized, createClass as _createClass, typeof as _typeof } from "../../_virtual/_rollupPluginBabelHelpers.js";
import util from "../../utils/util.js";
import sniffer from "../../utils/sniffer.js";
import { CANPLAY, PLAYER_FOCUS } from "../../events.js";
import "../../utils/debug.js";
import Plugin, { POSITIONS } from "../../plugin/plugin.js";
import OptionList from "./optionList.js";
var LIST_TYPES = {
  RIGHT_SIDE: "rightSide",
  MIDDLE: "middle"
};
var IS_MOBILE = sniffer.device === "mobile";
var OptionsIcon = /* @__PURE__ */ function(_Plugin) {
  _inherits(OptionsIcon2, _Plugin);
  var _super = _createSuper(OptionsIcon2);
  function OptionsIcon2(args) {
    var _this;
    _classCallCheck(this, OptionsIcon2);
    _this = _super.call(this, args);
    _defineProperty(_assertThisInitialized(_this), "onEnter", function(e) {
      e.preventDefault();
      e.stopPropagation();
      _this.emit("icon_mouseenter", {
        pluginName: _this.pluginName
      });
      _this.toggle(true);
    });
    _defineProperty(_assertThisInitialized(_this), "onLeave", function(e) {
      e.preventDefault();
      e.stopPropagation();
      _this.emit("icon_mouseleave", {
        pluginName: _this.pluginName
      });
      if (_this.config.listType !== LIST_TYPES.RIGHT_SIDE) {
        _this.isActive && _this.toggle(false);
      }
    });
    _defineProperty(_assertThisInitialized(_this), "onListEnter", function(e) {
      console.log("onListEnter");
      _this.enterType = 2;
    });
    _defineProperty(_assertThisInitialized(_this), "onListLeave", function(e) {
      console.log("onListLeave", e.target);
      _this.enterType = 0;
      _this.isActive && _this.toggle(false);
    });
    _this.isIcons = false;
    _this.isActive = false;
    _this.curValue = null;
    _this.curIndex = 0;
    return _this;
  }
  _createClass(OptionsIcon2, [{
    key: "updateLang",
    value: function updateLang(value) {
      this.renderItemList(this.config.list, this.curIndex);
    }
  }, {
    key: "afterCreate",
    value: function afterCreate() {
      var _this2 = this;
      var config = this.config;
      this.initIcons();
      if (IS_MOBILE && config.listType !== LIST_TYPES.MIDDLE) {
        config.listType = "rightSide";
      }
      config.hidePortrait && util.addClass(this.root, "portrait");
      this.once(CANPLAY, function() {
        if (config.list && config.list.length > 0) {
          _this2.renderItemList(config.list);
          _this2.show();
        }
      });
      IS_MOBILE && this.on(PLAYER_FOCUS, function() {
        if (!_this2.isActive) {
          return;
        }
        _this2.optionsList && _this2.optionsList.hide();
        _this2.isActive = false;
      });
      this.activeEvent = IS_MOBILE ? "touchend" : "mouseenter";
      this.bind(this.activeEvent, this.onEnter);
      this.bind("mouseleave", this.onLeave);
      this.isIcons && this.bind("click", this.onIconClick);
    }
  }, {
    key: "initIcons",
    value: function initIcons() {
      var _this3 = this;
      var icons = this.icons;
      var _c = Object.keys(icons);
      var _isIcons = false;
      if (_c.length > 0) {
        _c.forEach(function(key) {
          _this3.appendChild(".xgplayer-icon", icons[key]);
          !_isIcons && (_isIcons = icons[key]);
        });
        this.isIcons = _isIcons;
      }
      if (_isIcons) {
        return;
      }
      this.appendChild(".xgplayer-icon", util.createDom("span", "", {}, "icon-text"));
      util.addClass(this.find(".xgplayer-icon"), "btn-text");
    }
  }, {
    key: "show",
    value: function show() {
      if (!this.config.list || this.config.list.length < 2) {
        return;
      }
      util.addClass(this.root, "show");
    }
  }, {
    key: "hide",
    value: function hide() {
      util.removeClass(this.root, "show");
    }
  }, {
    key: "getTextByLang",
    value: function getTextByLang(item, key, lang) {
      if (item === void 0) {
        return "";
      }
      var list = this.config.list;
      !lang && (lang = this.player.lang);
      key = !key || util.isUndefined(item[key]) ? "text" : key;
      typeof item === "number" && (item = list[item]);
      try {
        if (_typeof(item[key]) === "object") {
          return item[key][lang] || item[key].zh;
        } else {
          return item[key];
        }
      } catch (err) {
        console.warn(err);
        return "";
      }
    }
  }, {
    key: "toggle",
    value: function toggle(isActive) {
      if (isActive === this.isActive)
        return;
      var controls = this.player.controls;
      var listType = this.config.listType;
      if (isActive) {
        listType === "rightSide" ? controls.blur() : controls.focus();
        this.optionsList && this.optionsList.show();
      } else {
        listType === "rightSide" ? controls.focus() : controls.focusAwhile();
        this.optionsList && this.optionsList.hide();
      }
      this.isActive = isActive;
    }
  }, {
    key: "onItemClick",
    value: function onItemClick(e, data) {
      e.preventDefault();
      e.stopPropagation();
      var _this$config = this.config, listType = _this$config.listType, list = _this$config.list;
      this.curIndex = data.to.index;
      this.curItem = list[this.curIndex];
      this.changeCurrentText();
      var isItemClickHide = this.config.isItemClickHide;
      (isItemClickHide || IS_MOBILE || listType === LIST_TYPES.RIGHT_SIDE) && this.toggle(false);
    }
  }, {
    key: "onIconClick",
    value: function onIconClick(e) {
    }
  }, {
    key: "changeCurrentText",
    value: function changeCurrentText() {
      if (this.isIcons) {
        return;
      }
      var list = this.config.list;
      var index = this.curIndex < list.length ? this.curIndex : 0;
      var curItem = list[index];
      if (!curItem)
        return;
      this.find(".icon-text").innerHTML = this.getTextByLang(curItem, "iconText");
    }
  }, {
    key: "renderItemList",
    value: function renderItemList(itemList, curIndex) {
      var _this4 = this;
      var config = this.config, optionsList = this.optionsList, player = this.player;
      if (typeof curIndex === "number") {
        this.curIndex = curIndex;
        this.curItem = config.list[curIndex];
      }
      if (optionsList) {
        optionsList.renderItemList(itemList);
        this.changeCurrentText();
        return;
      }
      var options = {
        config: {
          data: itemList || [],
          className: config.listType === LIST_TYPES.RIGHT_SIDE ? "right-side" : "",
          onItemClick: function onItemClick(e, data) {
            _this4.onItemClick(e, data);
          }
        },
        root: config.listType === LIST_TYPES.RIGHT_SIDE ? player.root : this.root
      };
      if (this.config.isShowIcon) {
        this.optionsList = new OptionList(options);
        this.changeCurrentText();
        this.show();
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.unbind(this.activeEvent, this.onEnter);
      this.unbind("mouseleave", this.onLeave);
      if (this.optionsList) {
        this.optionsList.destroy();
        this.optionsList = null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.config.isShowIcon) {
        return;
      }
      return '<xg-icon class="xg-options-icon '.concat(this.config.className || "", '">\n    <div class="xgplayer-icon">\n    </div>\n   </xg-icon>');
    }
  }], [{
    key: "pluginName",
    get: function get() {
      return "optionsIcon";
    }
  }, {
    key: "defaultConfig",
    get: function get() {
      return {
        position: POSITIONS.CONTROLS_RIGHT,
        index: 100,
        list: [],
        listType: "middle",
        listStyle: {},
        hidePortrait: true,
        isShowIcon: false,
        isItemClickHide: true
      };
    }
  }]);
  return OptionsIcon2;
}(Plugin);
export { OptionsIcon as default };
