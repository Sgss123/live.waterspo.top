import { defineProperty as _defineProperty, inherits as _inherits, createSuper as _createSuper, createClass as _createClass, classCallCheck as _classCallCheck, assertThisInitialized as _assertThisInitialized, possibleConstructorReturn as _possibleConstructorReturn, get as _get, getPrototypeOf as _getPrototypeOf, objectSpread2 as _objectSpread2 } from "./_virtual/_rollupPluginBabelHelpers.js";
import MediaProxy from "./mediaProxy.js";
import util, { checkIsCurrentVideo } from "./utils/util.js";
export { default as Util } from "./utils/util.js";
import sniffer from "./utils/sniffer.js";
export { default as Sniffer } from "./utils/sniffer.js";
import INDEXDB from "./utils/database.js";
import Errors from "./error.js";
export { default as Errors } from "./error.js";
import { CANPLAY, USER_ACTION, FULLSCREEN_CHANGE, READY, ERROR, LOADED_DATA, PLAY, URL_NULL, COMPLETE, AUTOPLAY_STARTED, AUTOPLAY_PREVENTED, DEFINITION_CHANGE, AFTER_DEFINITION_CHANGE, RESET, DESTROY, CSS_FULLSCREEN_CHANGE, PLAYER_FOCUS, PLAYER_BLUR, VIDEO_RESIZE, REPLAY, PLAYNEXT } from "./events.js";
import * as events from "./events.js";
export { events as Events };
import { PLATER_ID, FULLSCREEN_EVENTS, GET_FULLSCREEN_API, EXIT_FULLSCREEN_API } from "./constant.js";
import { POSITIONS } from "./plugin/plugin.js";
export { default as Plugin } from "./plugin/plugin.js";
import BasePlugin from "./plugin/basePlugin.js";
export { default as BasePlugin } from "./plugin/basePlugin.js";
import pluginsManager from "./plugin/pluginsManager.js";
import STATE_CLASS from "./stateClassMap.js";
export { default as STATE_CLASS } from "./stateClassMap.js";
import getDefaultConfig from "./defaultConfig.js";
import { usePreset } from "./plugin/preset.js";
import hooksDescriptor, { runHooks, delHooksDescriptor, hook, useHooks, removeHooks, usePluginHooks, removePluginHooks } from "./plugin/hooksDescriptor.js";
import Controls from "./plugins/controls/index.js";
import XG_DEBUG, { bindDebug } from "./utils/debug.js";
import I18N from "./lang/i18n.js";
export { default as I18N } from "./lang/i18n.js";
import version from "./version.js";
import { STATES, STATE_ARRAY } from "./state.js";
var PlAYER_HOOKS = ["play", "pause", "replay", "retry"];
var REAL_TIME_SPEED = 0;
var AVG_SPEED = 0;
var Player = /* @__PURE__ */ function(_MediaProxy) {
  _inherits(Player2, _MediaProxy);
  var _super = _createSuper(Player2);
  function Player2(options) {
    var _this;
    _classCallCheck(this, Player2);
    var _config = util.deepMerge(getDefaultConfig(), options);
    _this = _super.call(this, _config);
    _defineProperty(_assertThisInitialized(_this), "canPlayFunc", function() {
      if (!_this.config) {
        return;
      }
      var _this$config = _this.config, autoplay = _this$config.autoplay, startTime = _this$config.startTime, defaultPlaybackRate = _this$config.defaultPlaybackRate;
      XG_DEBUG.logInfo("player", "canPlayFunc, startTime", startTime);
      if (startTime) {
        _this.currentTime = startTime > _this.duration ? _this.duration : startTime;
        _this.config.startTime = 0;
      }
      _this.playbackRate = defaultPlaybackRate;
      (autoplay || _this._useAutoplay) && _this.mediaPlay();
      _this.off(CANPLAY, _this.canPlayFunc);
      _this.removeClass(STATE_CLASS.ENTER);
    });
    _defineProperty(_assertThisInitialized(_this), "onFullscreenChange", function(event, isFullScreen) {
      var delayResize = function delayResize2() {
        util.setTimeout(_assertThisInitialized(_this), function() {
          _this.resize();
        }, 100);
      };
      var fullEl = util.getFullScreenEl();
      if (_this._fullActionFrom) {
        _this._fullActionFrom = "";
      } else {
        _this.emit(USER_ACTION, {
          eventType: "system",
          action: "switch_fullscreen",
          pluginName: "player",
          currentTime: _this.currentTime,
          duration: _this.duration,
          props: [{
            prop: "fullscreen",
            from: true,
            to: false
          }]
        });
      }
      var isVideo = checkIsCurrentVideo(fullEl, _this.playerId, PLATER_ID);
      if (isFullScreen || fullEl && (fullEl === _this._fullscreenEl || isVideo)) {
        delayResize();
        !_this.config.closeFocusVideoFocus && _this.media.focus();
        _this.fullscreen = true;
        _this.changeFullStyle(_this.root, fullEl, STATE_CLASS.FULLSCREEN);
        _this.emit(FULLSCREEN_CHANGE, true, _this._fullScreenOffset);
        if (_this.cssfullscreen) {
          _this.exitCssFullscreen();
        }
      } else if (_this.fullscreen) {
        delayResize();
        var _assertThisInitialize = _assertThisInitialized(_this), _fullScreenOffset = _assertThisInitialize._fullScreenOffset, config = _assertThisInitialize.config;
        if (config.needFullscreenScroll) {
          window.scrollTo(_fullScreenOffset.left, _fullScreenOffset.top);
          util.setTimeout(_assertThisInitialized(_this), function() {
            _this.fullscreen = false;
            _this._fullScreenOffset = null;
          }, 100);
        } else {
          !_this.config.closeFocusVideoFocus && _this.media.focus();
          _this.fullscreen = false;
          _this._fullScreenOffset = null;
        }
        if (!_this.cssfullscreen) {
          _this.recoverFullStyle(_this.root, _this._fullscreenEl, STATE_CLASS.FULLSCREEN);
        } else {
          _this.removeClass(STATE_CLASS.FULLSCREEN);
        }
        _this._fullscreenEl = null;
        _this.emit(FULLSCREEN_CHANGE, false);
      }
    });
    _defineProperty(_assertThisInitialized(_this), "_onWebkitbeginfullscreen", function(e) {
      _this._fullscreenEl = _this.media;
      _this.onFullscreenChange(e, true);
    });
    _defineProperty(_assertThisInitialized(_this), "_onWebkitendfullscreen", function(e) {
      _this.onFullscreenChange(e, false);
    });
    hooksDescriptor(_assertThisInitialized(_this), PlAYER_HOOKS);
    _this.config = _config;
    _this._pluginInfoId = util.generateSessionId();
    bindDebug(_assertThisInitialized(_this));
    var defaultPreset = _this.constructor.defaultPreset;
    if (_this.config.presets.length) {
      var defaultIdx = _this.config.presets.indexOf("default");
      if (defaultIdx >= 0 && defaultPreset) {
        _this.config.presets[defaultIdx] = defaultPreset;
      }
    } else if (defaultPreset) {
      _this.config.presets.push(defaultPreset);
    }
    _this.userTimer = null;
    _this.waitTimer = null;
    _this._state = STATES.INITIAL;
    _this.isError = false;
    _this._hasStart = false;
    _this.isSeeking = false;
    _this.isCanplay = false;
    _this._useAutoplay = false;
    _this.rotateDeg = 0;
    _this.isActive = false;
    _this.fullscreen = false;
    _this.cssfullscreen = false;
    _this.isRotateFullscreen = false;
    _this._fullscreenEl = null;
    _this._cssfullscreenEl = null;
    _this.curDefinition = null;
    _this._orgCss = "";
    _this._fullScreenOffset = null;
    _this._videoHeight = 0;
    _this._videoWidth = 0;
    _this._accPlayed = {
      t: 0,
      acc: 0,
      loopAcc: 0
    };
    _this.innerContainer = null;
    _this.controls = null;
    _this.topBar = null;
    _this.root = null;
    _this.__i18n = I18N.init(_this._pluginInfoId);
    if (sniffer.os.isAndroid && sniffer.osVersion > 0 && sniffer.osVersion < 6) {
      _this.config.autoplay = false;
    }
    _this.database = new INDEXDB();
    _this.isUserActive = false;
    var rootInit = _this._initDOM();
    if (!rootInit) {
      console.error(new Error("can't find the dom which id is ".concat(_this.config.id, " or this.config.el does not exist")));
      return _possibleConstructorReturn(_this);
    }
    var _this$config2 = _this.config, _this$config2$definit = _this$config2.definition, definition = _this$config2$definit === void 0 ? {} : _this$config2$definit, url = _this$config2.url;
    if (!url && definition.list && definition.list.length > 0) {
      var defaultDefinitionObj = definition.list.find(function(e) {
        return e.definition && e.definition === definition.defaultDefinition;
      });
      if (!defaultDefinitionObj) {
        definition.defaultDefinition = definition.list[0].definition;
        defaultDefinitionObj = definition.list[0];
      }
      _this.config.url = defaultDefinitionObj.url;
      _this.curDefinition = defaultDefinitionObj;
    }
    _this._bindEvents();
    _this._registerPresets();
    _this._registerPlugins();
    pluginsManager.onPluginsReady(_assertThisInitialized(_this));
    _this.getInitDefinition();
    _this.setState(STATES.READY);
    util.setTimeout(_assertThisInitialized(_this), function() {
      _this.emit(READY);
    }, 0);
    _this.onReady && _this.onReady();
    if (_this.config.videoInit || _this.config.autoplay) {
      if (!_this.hasStart || _this.state < STATES.ATTACHED) {
        _this.start();
      }
    }
    return _this;
  }
  _createClass(Player2, [{
    key: "_initDOM",
    value: function _initDOM() {
      var _this2 = this;
      this.root = this.config.id ? document.getElementById(this.config.id) : null;
      if (!this.root) {
        var el = this.config.el;
        if (el && el.nodeType === 1) {
          this.root = el;
        } else {
          this.emit(ERROR, new Errors("use", this.config.vid, {
            line: 32,
            handle: "Constructor",
            msg: "container id can't be empty"
          }));
          console.error("this.confg.id or this.config.el can't be empty");
          return false;
        }
      }
      var ret = pluginsManager.checkPlayerRoot(this.root);
      if (ret) {
        XG_DEBUG.logWarn("The is an Player instance already exists in this.root, destroy it and reinitialize");
        ret.destroy();
      }
      this.root.setAttribute(PLATER_ID, this.playerId);
      pluginsManager.init(this);
      this._initBaseDoms();
      var XgVideoProxy = this.constructor.XgVideoProxy;
      if (XgVideoProxy && this.mediaConfig.mediaType === XgVideoProxy.mediaType) {
        var _el = this.innerContainer || this.root;
        this.detachVideoEvents(this.media);
        var _nVideo = new XgVideoProxy(_el, this.config, this.mediaConfig);
        this.attachVideoEvents(_nVideo);
        this.media = _nVideo;
      }
      this.media.setAttribute(PLATER_ID, this.playerId);
      if (this.config.controls) {
        var _root = this.config.controls.root || null;
        var controls = pluginsManager.register(this, Controls, {
          root: _root
        });
        this.controls = controls;
      }
      var device = this.config.isMobileSimulateMode === "mobile" ? "mobile" : sniffer.device;
      this.addClass("".concat(STATE_CLASS.DEFAULT, " ").concat(STATE_CLASS.INACTIVE, " xgplayer-").concat(device, " ").concat(this.config.controls ? "" : STATE_CLASS.NO_CONTROLS));
      if (this.config.autoplay) {
        this.addClass(STATE_CLASS.ENTER);
      } else {
        this.addClass(STATE_CLASS.NO_START);
      }
      if (this.config.fluid) {
        var _this$config3 = this.config, width = _this$config3.width, height = _this$config3.height;
        if (typeof width !== "number" || typeof height !== "number") {
          width = 600;
          height = 337.5;
        }
        var style = {
          width: "100%",
          height: "0",
          "max-width": "100%",
          "padding-top": "".concat(height * 100 / width, "%")
        };
        Object.keys(style).forEach(function(key) {
          _this2.root.style[key] = style[key];
        });
      } else {
        ["width", "height"].forEach(function(key) {
          if (_this2.config[key]) {
            if (typeof _this2.config[key] !== "number") {
              _this2.root.style[key] = _this2.config[key];
            } else {
              _this2.root.style[key] = "".concat(_this2.config[key], "px");
            }
          }
        });
      }
      return true;
    }
  }, {
    key: "_initBaseDoms",
    value: function _initBaseDoms() {
      this.topBar = null;
      this.leftBar = null;
      this.rightBar = null;
      if (this.config.marginControls) {
        this.innerContainer = util.createDom("xg-video-container", "", {
          "data-index": -1
        }, "xg-video-container");
        this.root.appendChild(this.innerContainer);
      }
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this3 = this;
      ["focus", "blur"].forEach(function(item) {
        _this3.on(item, _this3["on" + item.charAt(0).toUpperCase() + item.slice(1)]);
      });
      FULLSCREEN_EVENTS.forEach(function(item) {
        document && document.addEventListener(item, _this3.onFullscreenChange);
      });
      if (sniffer.os.isIos) {
        this.media.addEventListener("webkitbeginfullscreen", this._onWebkitbeginfullscreen);
        this.media.addEventListener("webkitendfullscreen", this._onWebkitendfullscreen);
      }
      this.once(LOADED_DATA, this.resize);
      this.playFunc = function() {
        if (!_this3.config.closeFocusVideoFocus) {
          _this3.media.focus();
        }
      };
      this.once(PLAY, this.playFunc);
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      var _this4 = this;
      this.root.removeEventListener("mousemove", this.mousemoveFunc);
      FULLSCREEN_EVENTS.forEach(function(item) {
        document.removeEventListener(item, _this4.onFullscreenChange);
      });
      this.playFunc && this.off(PLAY, this.playFunc);
      this.off(CANPLAY, this.canPlayFunc);
      this.media.removeEventListener("webkitbeginfullscreen", this._onWebkitbeginfullscreen);
      this.media.removeEventListener("webkitendfullscreen", this._onWebkitendfullscreen);
    }
  }, {
    key: "_startInit",
    value: function _startInit(url) {
      var _this5 = this;
      if (!this.media) {
        return;
      }
      if (!url || url === "" || util.typeOf(url) === "Array" && url.length === 0) {
        url = "";
        this.emit(URL_NULL);
        XG_DEBUG.logWarn("config.url is null, please get url and run player._startInit(url)");
        if (this.config.nullUrlStart) {
          return;
        }
      }
      this._detachSourceEvents(this.media);
      if (util.typeOf(url) === "Array" && url.length > 0) {
        this._attachSourceEvents(this.media, url);
      } else if (!this.media.src || this.media.src !== url) {
        this.media.src = url;
      } else if (!url) {
        this.media.removeAttribute("src");
      }
      if (util.typeOf(this.config.volume) === "Number") {
        this.volume = this.config.volume;
      }
      var _root = this.innerContainer ? this.innerContainer : this.root;
      if (this.media instanceof window.Element && !_root.contains(this.media)) {
        _root.insertBefore(this.media, _root.firstChild);
      }
      var readyState = this.media.readyState;
      XG_DEBUG.logInfo("_startInit readyState", readyState);
      if (this.config.autoplay) {
        !(/^blob/.test(this.media.currentSrc) || /^blob/.test(this.media.src)) && this.load();
        (sniffer.os.isIpad || sniffer.os.isPhone) && this.mediaPlay();
      }
      if (readyState >= 2) {
        this.canPlayFunc();
      } else {
        this.once(CANPLAY, this.canPlayFunc);
      }
      if (!this.hasStart || this.state < STATES.ATTACHED) {
        pluginsManager.afterInit(this);
      }
      this.hasStart = true;
      this.setState(STATES.ATTACHED);
      util.setTimeout(this, function() {
        _this5.emit(COMPLETE);
      }, 0);
    }
  }, {
    key: "_registerPlugins",
    value: function _registerPlugins() {
      var _this6 = this;
      var isInit = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      this._loadingPlugins = [];
      var ignores = this.config.ignores || [];
      var plugins = this.config.plugins || [];
      var i18n = this.config.i18n || [];
      isInit && I18N.extend(i18n, this.__i18n);
      var ignoresStr = ignores.join("||").toLowerCase().split("||");
      var cuPlugins = this.plugins;
      plugins.forEach(function(plugin) {
        try {
          var pluginName = plugin.plugin ? plugin.plugin.pluginName : plugin.pluginName;
          if (pluginName && ignoresStr.indexOf(pluginName.toLowerCase()) > -1) {
            return null;
          }
          if (!isInit && cuPlugins[pluginName.toLowerCase()]) {
            return;
          }
          if (plugin.lazy && plugin.loader) {
            var loadingPlugin = pluginsManager.lazyRegister(_this6, plugin);
            if (plugin.forceBeforeInit) {
              loadingPlugin.then(function() {
                _this6._loadingPlugins.splice(_this6._loadingPlugins.indexOf(loadingPlugin), 1);
              }).catch(function(e) {
                XG_DEBUG.logError("_registerPlugins:loadingPlugin", e);
                _this6._loadingPlugins.splice(_this6._loadingPlugins.indexOf(loadingPlugin), 1);
              });
              _this6._loadingPlugins.push(loadingPlugin);
            }
            return;
          }
          return _this6.registerPlugin(plugin);
        } catch (err) {
          XG_DEBUG.logError("_registerPlugins:", err);
        }
      });
    }
  }, {
    key: "_registerPresets",
    value: function _registerPresets() {
      var _this7 = this;
      this.config.presets.forEach(function(preset) {
        usePreset(_this7, preset);
      });
    }
  }, {
    key: "_getRootByPosition",
    value: function _getRootByPosition(position) {
      var _root = null;
      switch (position) {
        case POSITIONS.ROOT_RIGHT:
          if (!this.rightBar) {
            this.rightBar = util.createPositionBar("xg-right-bar", this.root);
          }
          _root = this.rightBar;
          break;
        case POSITIONS.ROOT_LEFT:
          if (!this.leftBar) {
            this.leftBar = util.createPositionBar("xg-left-bar", this.root);
          }
          _root = this.leftBar;
          break;
        case POSITIONS.ROOT_TOP:
          if (!this.topBar) {
            this.topBar = util.createPositionBar("xg-top-bar", this.root);
            if (this.config.topBarAutoHide) {
              util.addClass(this.topBar, STATE_CLASS.TOP_BAR_AUTOHIDE);
            }
          }
          _root = this.topBar;
          break;
        default:
          _root = this.innerContainer || this.root;
          break;
      }
      return _root;
    }
  }, {
    key: "registerPlugin",
    value: function registerPlugin(plugin, config) {
      var _retPlugin = pluginsManager.formatPluginInfo(plugin, config);
      var PLUFGIN = _retPlugin.PLUFGIN, options = _retPlugin.options;
      var plugins = this.config.plugins;
      var exits = pluginsManager.checkPluginIfExits(PLUFGIN.pluginName, plugins);
      !exits && plugins.push(PLUFGIN);
      var _pConfig = pluginsManager.getRootByConfig(PLUFGIN.pluginName, this.config);
      _pConfig.root && (options.root = _pConfig.root);
      _pConfig.position && (options.position = _pConfig.position);
      var position = options.position ? options.position : options.config && options.config.position || PLUFGIN.defaultConfig && PLUFGIN.defaultConfig.position;
      if (!options.root && typeof position === "string" && position.indexOf("controls") > -1) {
        return this.controls && this.controls.registerPlugin(PLUFGIN, options, PLUFGIN.pluginName);
      }
      if (!options.root) {
        options.root = this._getRootByPosition(position);
      }
      return pluginsManager.register(this, PLUFGIN, options);
    }
  }, {
    key: "deregister",
    value: function deregister(plugin) {
      if (typeof plugin === "string") {
        pluginsManager.unRegister(this, plugin);
      } else if (plugin instanceof BasePlugin) {
        pluginsManager.unRegister(this, plugin.pluginName);
      }
    }
  }, {
    key: "unRegisterPlugin",
    value: function unRegisterPlugin(plugin) {
      var removedFromConfig = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      this.deregister(plugin);
      if (removedFromConfig) {
        this.removePluginFromConfig(plugin);
      }
    }
  }, {
    key: "removePluginFromConfig",
    value: function removePluginFromConfig(plugin) {
      var pluginName;
      if (typeof plugin === "string") {
        pluginName = plugin;
      } else if (plugin instanceof BasePlugin) {
        pluginName = plugin.pluginName;
      }
      if (!pluginName) {
        return;
      }
      for (var i = this.config.plugins.length - 1; i > -1; i--) {
        var _plugin = this.config.plugins[i];
        if (_plugin.pluginName.toLowerCase() === pluginName.toLowerCase()) {
          this.config.plugins.splice(i, 1);
          break;
        }
      }
    }
  }, {
    key: "plugins",
    get: function get() {
      return pluginsManager.getPlugins(this);
    }
  }, {
    key: "getPlugin",
    value: function getPlugin(pluginName) {
      var plugin = pluginsManager.findPlugin(this, pluginName);
      return plugin && plugin.pluginName ? plugin : null;
    }
  }, {
    key: "addClass",
    value: function addClass(className) {
      if (!this.root) {
        return;
      }
      if (!util.hasClass(this.root, className)) {
        util.addClass(this.root, className);
      }
    }
  }, {
    key: "removeClass",
    value: function removeClass(className) {
      if (!this.root) {
        return;
      }
      util.removeClass(this.root, className);
    }
  }, {
    key: "hasClass",
    value: function hasClass(className) {
      if (!this.root) {
        return;
      }
      return util.hasClass(this.root, className);
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(key, value) {
      if (!this.root) {
        return;
      }
      this.root.setAttribute(key, value);
    }
  }, {
    key: "removeAttribute",
    value: function removeAttribute(key, value) {
      if (!this.root) {
        return;
      }
      this.root.removeAttribute(key, value);
    }
  }, {
    key: "start",
    value: function start(url) {
      var _this8 = this;
      if (this.state > STATES.ATTACHING) {
        return;
      }
      if (!url && !this.config.url) {
        this.getInitDefinition();
      }
      this.hasStart = true;
      this.setState(STATES.ATTACHING);
      this._registerPlugins(false);
      return pluginsManager.beforeInit(this).then(function() {
        if (!_this8.config) {
          return;
        }
        if (!url) {
          url = _this8.url || _this8.config.url;
        }
        var ret = _this8._startInit(url);
        return ret;
      }).catch(function(e) {
        e.fileName = "player";
        e.lineNumber = "236";
        XG_DEBUG.logError("start:beforeInit:", e);
        throw e;
      });
    }
  }, {
    key: "switchURL",
    value: function switchURL(url, options) {
      var _this9 = this;
      var _src = url;
      if (util.typeOf(url) === "Object") {
        _src = url.url;
      }
      var curTime = this.currentTime;
      var isPaused = this.paused && !this.isError;
      this.src = _src;
      return new Promise(function(resolve) {
        var _canplay = function _canplay2() {
          _this9.currentTime = curTime;
          if (isPaused) {
            _this9.once("canplay", function() {
              _this9.pause();
            });
          }
          resolve();
        };
        if (sniffer.os.isAndroid) {
          _this9.once("timeupdate", function() {
            _canplay();
          });
        } else {
          _this9.once("canplay", function() {
            _canplay();
          });
        }
        _this9.play();
      });
    }
  }, {
    key: "videoPlay",
    value: function videoPlay() {
      this.mediaPlay();
    }
  }, {
    key: "mediaPlay",
    value: function mediaPlay() {
      var _this10 = this;
      if (!this.hasStart && this.state < STATES.ATTACHED) {
        this.removeClass(STATE_CLASS.NO_START);
        this.addClass(STATE_CLASS.ENTER);
        this.start();
        this._useAutoplay = true;
        return;
      }
      if (this.state < STATES.RUNNING) {
        this.removeClass(STATE_CLASS.NO_START);
        !this.isCanplay && this.addClass(STATE_CLASS.ENTER);
      }
      var playPromise = _get(_getPrototypeOf(Player2.prototype), "play", this).call(this);
      if (playPromise !== void 0 && playPromise && playPromise.then) {
        playPromise.then(function() {
          _this10.removeClass(STATE_CLASS.NOT_ALLOW_AUTOPLAY);
          _this10.addClass(STATE_CLASS.PLAYING);
          if (_this10.state < STATES.RUNNING) {
            XG_DEBUG.logInfo(">>>>playPromise.then");
            _this10.setState(STATES.RUNNING);
            _this10.emit(AUTOPLAY_STARTED);
          }
        }).catch(function(e) {
          XG_DEBUG.logWarn(">>>>playPromise.catch", e.name);
          if (_this10.media && _this10.media.error) {
            _this10.onError();
            _this10.removeClass(STATE_CLASS.ENTER);
            return;
          }
          if (e.name === "NotAllowedError") {
            _this10._errorTimer = util.setTimeout(_this10, function() {
              _this10._errorTimer = null;
              _this10.emit(AUTOPLAY_PREVENTED);
              _this10.addClass(STATE_CLASS.NOT_ALLOW_AUTOPLAY);
              _this10.removeClass(STATE_CLASS.ENTER);
              _this10.pause();
              _this10.setState(STATES.NOTALLOW);
            }, 0);
          }
        });
      } else {
        XG_DEBUG.logWarn("video.play not return promise");
        if (this.state < STATES.RUNNING) {
          this.setState(STATES.RUNNING);
          this.removeClass(STATE_CLASS.NOT_ALLOW_AUTOPLAY);
          this.removeClass(STATE_CLASS.NO_START);
          this.removeClass(STATE_CLASS.ENTER);
          this.addClass(STATE_CLASS.PLAYING);
          this.emit(AUTOPLAY_STARTED);
        }
      }
      return playPromise;
    }
  }, {
    key: "mediaPause",
    value: function mediaPause() {
      _get(_getPrototypeOf(Player2.prototype), "pause", this).call(this);
    }
  }, {
    key: "videoPause",
    value: function videoPause() {
      _get(_getPrototypeOf(Player2.prototype), "pause", this).call(this);
    }
  }, {
    key: "play",
    value: function play() {
      var _this11 = this;
      this.removeClass(STATE_CLASS.PAUSED);
      runHooks(this, "play", function() {
        _this11.mediaPlay();
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      var _this12 = this;
      runHooks(this, "pause", function() {
        _get(_getPrototypeOf(Player2.prototype), "pause", _this12).call(_this12);
      });
    }
  }, {
    key: "seek",
    value: function seek(time, status) {
      var _this13 = this;
      if (!this.media || Number.isNaN(Number(time) || !this.hasStart)) {
        return;
      }
      var _this$config4 = this.config, isSeekedPlay = _this$config4.isSeekedPlay, seekedStatus = _this$config4.seekedStatus;
      var _status = status || (isSeekedPlay ? "play" : seekedStatus);
      time = time < 0 ? 0 : time > this.duration ? parseInt(this.duration, 10) : time;
      this.once(CANPLAY, function() {
        _this13.removeClass(STATE_CLASS.ENTER);
        _this13.isSeeking = false;
        switch (_status) {
          case "play":
            _this13.play();
            break;
          case "pause":
            _this13.pause();
            break;
          default:
            !_this13.paused && _this13.play();
        }
      });
      if (this.state < STATES.RUNNING) {
        this.removeClass(STATE_CLASS.NO_START);
        this.addClass(STATE_CLASS.ENTER);
        this.currentTime = time;
        _status === "play" && this.play();
      } else {
        this.currentTime = time;
      }
    }
  }, {
    key: "getInitDefinition",
    value: function getInitDefinition() {
      var _this14 = this;
      var _this$config5 = this.config, definition = _this$config5.definition, url = _this$config5.url;
      if (!url && definition && definition.list && definition.list.length > 0 && definition.defaultDefinition) {
        definition.list.map(function(item) {
          if (item.definition === definition.defaultDefinition) {
            _this14.config.url = item.url;
            _this14.curDefinition = item;
          }
        });
      }
    }
  }, {
    key: "changeDefinition",
    value: function changeDefinition(to, from) {
      var _this15 = this;
      var definition = this.config.definition;
      if (Array.isArray(definition === null || definition === void 0 ? void 0 : definition.list)) {
        definition.list.forEach(function(item) {
          if ((to === null || to === void 0 ? void 0 : to.definition) === item.definition) {
            _this15.curDefinition = item;
          }
        });
      }
      if (to !== null && to !== void 0 && to.bitrate && typeof to.bitrate !== "number") {
        to.bitrate = parseInt(to.bitrate, 10) || 0;
      }
      this.emit(DEFINITION_CHANGE, {
        from,
        to
      });
      if (!this.hasStart) {
        this.config.url = to.url;
        return;
      }
      var ret = this.switchURL(to.url, _objectSpread2({
        seamless: definition.seamless !== false && typeof MediaSource !== "undefined" && typeof MediaSource.isTypeSupported === "function"
      }, to));
      if (ret && ret.then) {
        ret.then(function() {
          _this15.emit(AFTER_DEFINITION_CHANGE, {
            from,
            to
          });
        });
      } else {
        this.emit(AFTER_DEFINITION_CHANGE, {
          from,
          to
        });
      }
    }
  }, {
    key: "reload",
    value: function reload() {
      this.load();
      this.reloadFunc = function() {
        this.play();
      };
      this.once(LOADED_DATA, this.reloadFunc);
    }
  }, {
    key: "resetState",
    value: function resetState() {
      var _this16 = this;
      var NOT_ALLOW_AUTOPLAY = STATE_CLASS.NOT_ALLOW_AUTOPLAY, PLAYING = STATE_CLASS.PLAYING, NO_START = STATE_CLASS.NO_START, PAUSED = STATE_CLASS.PAUSED, REPLAY2 = STATE_CLASS.REPLAY, ENTER = STATE_CLASS.ENTER, ENDED = STATE_CLASS.ENDED, ERROR2 = STATE_CLASS.ERROR, LOADING = STATE_CLASS.LOADING;
      var clsList = [NOT_ALLOW_AUTOPLAY, PLAYING, NO_START, PAUSED, REPLAY2, ENTER, ENDED, ERROR2, LOADING];
      this.hasStart = false;
      this.isError = false;
      this._useAutoplay = false;
      this.mediaPause();
      this._accPlayed.acc = 0;
      this._accPlayed.t = 0;
      this._accPlayed.loopAcc = 0;
      clsList.forEach(function(cls) {
        _this16.removeClass(cls);
      });
      this.addClass(STATE_CLASS.ENTER);
      this.emit(RESET);
    }
  }, {
    key: "reset",
    value: function reset() {
      var _this17 = this;
      var unregisterPlugins = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      var isResetConfig = arguments.length > 1 ? arguments[1] : void 0;
      this.resetState();
      var plugins = this.plugins;
      if (!plugins) {
        return;
      }
      unregisterPlugins.map(function(pn) {
        _this17.deregister(pn);
      });
      if (isResetConfig) {
        var de = getDefaultConfig();
        Object.keys(this.config).keys(function(k) {
          if (_this17.config[k] !== "undefined" && (k === "plugins" || k === "presets" || k === "el" || k === "id")) {
            _this17.config[k] = de[k];
          }
        });
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this18 = this;
      var innerContainer = this.innerContainer, root = this.root, media = this.media;
      if (!root || !media) {
        return;
      }
      this.hasStart = false;
      this._useAutoplay = false;
      root.removeAttribute(PLATER_ID);
      this.updateAcc("destroy");
      this._unbindEvents();
      this._detachSourceEvents(this.media);
      util.clearAllTimers(this);
      this.emit(DESTROY);
      pluginsManager.destroy(this);
      delHooksDescriptor(this);
      _get(_getPrototypeOf(Player2.prototype), "destroy", this).call(this);
      if (this.fullscreen && this._fullscreenEl === this.root) {
        this.exitFullscreen();
      }
      if (innerContainer) {
        var _c = innerContainer.children;
        for (var i = 0; i < _c.length; i++) {
          innerContainer.removeChild(_c[i]);
        }
      }
      !innerContainer && media instanceof window.Node && root.contains(media) && root.removeChild(media);
      ["topBar", "leftBar", "rightBar", "innerContainer"].map(function(item) {
        _this18[item] && root.removeChild(_this18[item]);
        _this18[item] = null;
      });
      var cList = root.className.split(" ");
      if (cList.length > 0) {
        root.className = cList.filter(function(name) {
          return name.indexOf("xgplayer") < 0;
        }).join(" ");
      } else {
        root.className = "";
      }
      this.removeAttribute("data-xgfill");
      ["isSeeking", "isCanplay", "isActive", "cssfullscreen", "fullscreen"].forEach(function(key) {
        _this18[key] = false;
      });
    }
  }, {
    key: "replay",
    value: function replay() {
      var _this19 = this;
      this.removeClass(STATE_CLASS.ENDED);
      this.currentTime = 0;
      this.isSeeking = false;
      runHooks(this, "replay", function() {
        _this19.once(CANPLAY, function() {
          var playPromise = _this19.mediaPlay();
          if (playPromise && playPromise.catch) {
            playPromise.catch(function(err) {
              console.log(err);
            });
          }
        });
        _this19.play();
        _this19.emit(REPLAY);
        _this19.onPlay();
      });
    }
  }, {
    key: "retry",
    value: function retry() {
      var _this20 = this;
      this.removeClass(STATE_CLASS.ERROR);
      this.addClass(STATE_CLASS.LOADING);
      runHooks(this, "retry", function() {
        var cur = _this20.currentTime;
        _this20.src = _this20.config.url;
        !_this20.config.isLive && (_this20.currentTime = cur);
        _this20.once(CANPLAY, function() {
          _this20.mediaPlay();
        });
      });
    }
  }, {
    key: "changeFullStyle",
    value: function changeFullStyle(root, el, rootClass, pClassName) {
      if (!root) {
        return;
      }
      if (!pClassName) {
        pClassName = STATE_CLASS.PARENT_FULLSCREEN;
      }
      if (!this._orgCss) {
        this._orgCss = util.filterStyleFromText(root);
      }
      util.addClass(root, rootClass);
      if (el && el !== root && !this._orgPCss) {
        this._orgPCss = util.filterStyleFromText(el);
        util.addClass(el, pClassName);
        el.setAttribute(PLATER_ID, this.playerId);
      }
    }
  }, {
    key: "recoverFullStyle",
    value: function recoverFullStyle(root, el, rootClass, pClassName) {
      if (!pClassName) {
        pClassName = STATE_CLASS.PARENT_FULLSCREEN;
      }
      if (this._orgCss) {
        util.setStyleFromCsstext(root, this._orgCss);
        this._orgCss = "";
      }
      util.removeClass(root, rootClass);
      if (el && el !== root && this._orgPCss) {
        util.setStyleFromCsstext(el, this._orgPCss);
        this._orgPCss = "";
        util.removeClass(el, pClassName);
        el.removeAttribute(PLATER_ID);
      }
    }
  }, {
    key: "getFullscreen",
    value: function getFullscreen() {
      var el = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.config.fullscreenTarget;
      var root = this.root, media = this.media;
      if (!el) {
        el = root;
      }
      this._fullScreenOffset = {
        top: util.scrollTop(),
        left: util.scrollLeft()
      };
      this._fullscreenEl = el;
      this._fullActionFrom = "get";
      var fullEl = util.getFullScreenEl();
      if (fullEl === this._fullscreenEl) {
        this.onFullscreenChange();
        return;
      }
      try {
        for (var i = 0; i < GET_FULLSCREEN_API.length; i++) {
          var key = GET_FULLSCREEN_API[i];
          if (el[key]) {
            var ret = key === "webkitRequestFullscreen" ? el.webkitRequestFullscreen(window.Element.ALLOW_KEYBOARD_INPUT) : el[key]();
            if (ret && ret.then) {
              return ret;
            } else {
              return Promise.resolve();
            }
          }
        }
        if (media.fullscreenEnabled || media.webkitSupportsFullscreen) {
          media.webkitEnterFullscreen();
          return Promise.resolve();
        }
        return Promise.reject(new Error("call getFullscreen fail"));
      } catch (err) {
        return Promise.reject(new Error("call getFullscreen fail"));
      }
    }
  }, {
    key: "exitFullscreen",
    value: function exitFullscreen(el) {
      if (this.isRotateFullscreen) {
        this.exitRotateFullscreen();
      }
      if (!this._fullscreenEl && !util.getFullScreenEl()) {
        return;
      }
      this.root;
      var media = this.media;
      this._fullActionFrom = "exit";
      try {
        for (var i = 0; i < EXIT_FULLSCREEN_API.length; i++) {
          var key = EXIT_FULLSCREEN_API[i];
          if (document[key]) {
            var ret = document[key]();
            if (ret && ret.then) {
              return ret;
            } else {
              return Promise.resolve();
            }
          }
        }
        if (media && media.webkitSupportsFullscreen) {
          media.webkitExitFullScreen();
          return Promise.resolve();
        }
        return Promise.reject(new Error("call exitFullscreen fail"));
      } catch (err) {
        return Promise.reject(new Error("call exitFullscreen fail"));
      }
    }
  }, {
    key: "getCssFullscreen",
    value: function getCssFullscreen() {
      var el = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.config.fullscreenTarget;
      if (this.isRotateFullscreen) {
        this.exitRotateFullscreen();
      } else if (this.fullscreen) {
        this.exitFullscreen();
      }
      var _class = el ? "".concat(STATE_CLASS.INNER_FULLSCREEN, " ").concat(STATE_CLASS.CSS_FULLSCREEN) : STATE_CLASS.CSS_FULLSCREEN;
      this.changeFullStyle(this.root, el, _class);
      var _this$config$fullscre = this.config.fullscreen, fullscreen = _this$config$fullscre === void 0 ? {} : _this$config$fullscre;
      var useCssFullscreen = fullscreen.useCssFullscreen === true || typeof fullscreen.useCssFullscreen === "function" && fullscreen.useCssFullscreen();
      if (useCssFullscreen) {
        this.fullscreen = true;
        this.emit(FULLSCREEN_CHANGE, true);
      }
      this._cssfullscreenEl = el;
      this.cssfullscreen = true;
      this.emit(CSS_FULLSCREEN_CHANGE, true);
    }
  }, {
    key: "exitCssFullscreen",
    value: function exitCssFullscreen() {
      var _class = this._cssfullscreenEl ? "".concat(STATE_CLASS.INNER_FULLSCREEN, " ").concat(STATE_CLASS.CSS_FULLSCREEN) : STATE_CLASS.CSS_FULLSCREEN;
      if (!this.fullscreen) {
        this.recoverFullStyle(this.root, this._cssfullscreenEl, _class);
      } else {
        var _this$config$fullscre2 = this.config.fullscreen, fullscreen = _this$config$fullscre2 === void 0 ? {} : _this$config$fullscre2;
        var useCssFullscreen = fullscreen.useCssFullscreen === true || typeof fullscreen.useCssFullscreen === "function" && fullscreen.useCssFullscreen();
        if (useCssFullscreen) {
          this.recoverFullStyle(this.root, this._cssfullscreenEl, _class);
          this.fullscreen = false;
          this.emit(FULLSCREEN_CHANGE, false);
        } else {
          this.removeClass(_class);
        }
      }
      this._cssfullscreenEl = null;
      this.cssfullscreen = false;
      this.emit(CSS_FULLSCREEN_CHANGE, false);
    }
  }, {
    key: "getRotateFullscreen",
    value: function getRotateFullscreen(el) {
      if (this.cssfullscreen) {
        this.exitCssFullscreen(el);
      }
      var _class = el ? "".concat(STATE_CLASS.INNER_FULLSCREEN, " ").concat(STATE_CLASS.ROTATE_FULLSCREEN) : STATE_CLASS.ROTATE_FULLSCREEN;
      this._fullscreenEl = el || this.root;
      this.changeFullStyle(this.root, el, _class, STATE_CLASS.PARENT_ROTATE_FULLSCREEN);
      this.isRotateFullscreen = true;
      this.fullscreen = true;
      this.setRotateDeg(90);
      this.emit(FULLSCREEN_CHANGE, true);
    }
  }, {
    key: "exitRotateFullscreen",
    value: function exitRotateFullscreen(el) {
      var _class = this._fullscreenEl !== this.root ? "".concat(STATE_CLASS.INNER_FULLSCREEN, " ").concat(STATE_CLASS.ROTATE_FULLSCREEN) : STATE_CLASS.ROTATE_FULLSCREEN;
      this.recoverFullStyle(this.root, this._fullscreenEl, _class, STATE_CLASS.PARENT_ROTATE_FULLSCREEN);
      this.isRotateFullscreen = false;
      this.fullscreen = false;
      this.setRotateDeg(0);
      this.emit(FULLSCREEN_CHANGE, false);
    }
  }, {
    key: "setRotateDeg",
    value: function setRotateDeg(deg) {
      if (window.orientation === 90 || window.orientation === -90) {
        this.rotateDeg = 0;
      } else {
        this.rotateDeg = deg;
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      var data = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        autoHide: !this.config.closeDelayBlur,
        delay: this.config.inactive
      };
      if (this.isActive) {
        this.onFocus(data);
        return;
      }
      this.emit(PLAYER_FOCUS, _objectSpread2({
        paused: this.paused,
        ended: this.ended
      }, data));
    }
  }, {
    key: "blur",
    value: function blur() {
      var data = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        ignorePaused: false
      };
      if (!this.isActive) {
        this.onBlur(data);
        return;
      }
      this.emit(PLAYER_BLUR, _objectSpread2({
        paused: this.paused,
        ended: this.ended
      }, data));
    }
  }, {
    key: "onFocus",
    value: function onFocus() {
      var _this21 = this;
      var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref$autoHide = _ref.autoHide, autoHide = _ref$autoHide === void 0 ? !this.config.closePlayerBlur : _ref$autoHide, _ref$delay = _ref.delay, delay = _ref$delay === void 0 ? this.config.inactive : _ref$delay;
      this.isActive = true;
      this.removeClass(STATE_CLASS.INACTIVE);
      if (this.userTimer) {
        util.clearTimeout(this, this.userTimer);
        this.userTimer = null;
      }
      if (!autoHide) {
        if (this.userTimer) {
          util.clearTimeout(this, this.userTimer);
          this.userTimer = null;
        }
        return;
      }
      this.userTimer = util.setTimeout(this, function() {
        _this21.userTimer = null;
        _this21.blur();
      }, delay);
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      var _ref2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref2$ignorePaused = _ref2.ignorePaused, ignorePaused = _ref2$ignorePaused === void 0 ? false : _ref2$ignorePaused;
      if (!this.isActive) {
        return;
      }
      var closePauseVideoFocus = this.config.closePauseVideoFocus;
      this.isActive = false;
      if (ignorePaused || closePauseVideoFocus || !this.paused && !this.ended) {
        this.addClass(STATE_CLASS.INACTIVE);
      }
    }
  }, {
    key: "onEmptied",
    value: function onEmptied() {
      this.updateAcc("emptied");
    }
  }, {
    key: "onCanplay",
    value: function onCanplay() {
      this.removeClass(STATE_CLASS.ENTER);
      this.removeClass(STATE_CLASS.ERROR);
      this.removeClass(STATE_CLASS.LOADING);
      this.isCanplay = true;
      this.waitTimer && util.clearTimeout(this, this.waitTimer);
    }
  }, {
    key: "onLoadeddata",
    value: function onLoadeddata() {
      this.isError = false;
    }
  }, {
    key: "onLoadstart",
    value: function onLoadstart() {
      this.removeClass(STATE_CLASS.ERROR);
      this.isCanplay = false;
    }
  }, {
    key: "onPlay",
    value: function onPlay() {
      if (this.state === STATES.ENDED) {
        this.setState(STATES.RUNNING);
      }
      this.removeClass(STATE_CLASS.PAUSED);
      this.ended && this.removeClass(STATE_CLASS.ENDED);
      !this.config.closePlayVideoFocus && this.focus();
    }
  }, {
    key: "onPause",
    value: function onPause() {
      this.addClass(STATE_CLASS.PAUSED);
      this.updateAcc("pause");
      if (!this.config.closePauseVideoFocus) {
        if (this.userTimer) {
          util.clearTimeout(this, this.userTimer);
          this.userTimer = null;
        }
        this.focus();
      }
    }
  }, {
    key: "onEnded",
    value: function onEnded() {
      this.updateAcc("ended");
      this.addClass(STATE_CLASS.ENDED);
      this.setState(STATES.ENDED);
    }
  }, {
    key: "onError",
    value: function onError() {
      this.isError = true;
      this.updateAcc("error");
      this.removeClass(STATE_CLASS.NOT_ALLOW_AUTOPLAY);
      this.removeClass(STATE_CLASS.NO_START);
      this.removeClass(STATE_CLASS.ENTER);
      this.removeClass(STATE_CLASS.LOADING);
      this.addClass(STATE_CLASS.ERROR);
    }
  }, {
    key: "onSeeking",
    value: function onSeeking() {
      if (!this.isSeeking) {
        this.updateAcc("seeking");
      }
      this.isSeeking = true;
      this.addClass(STATE_CLASS.SEEKING);
    }
  }, {
    key: "onSeeked",
    value: function onSeeked() {
      this.isSeeking = false;
      if (this.waitTimer) {
        util.clearTimeout(this, this.waitTimer);
      }
      this.removeClass(STATE_CLASS.LOADING);
      this.removeClass(STATE_CLASS.SEEKING);
    }
  }, {
    key: "onWaiting",
    value: function onWaiting() {
      var _this22 = this;
      if (this.waitTimer) {
        util.clearTimeout(this, this.waitTimer);
      }
      this.updateAcc("waiting");
      this.waitTimer = util.setTimeout(this, function() {
        _this22.addClass(STATE_CLASS.LOADING);
        util.clearTimeout(_this22, _this22.waitTimer);
        _this22.waitTimer = null;
      }, 200);
    }
  }, {
    key: "onPlaying",
    value: function onPlaying() {
      var _this23 = this;
      this.isError = false;
      var NO_START = STATE_CLASS.NO_START, PAUSED = STATE_CLASS.PAUSED, ENDED = STATE_CLASS.ENDED, ERROR2 = STATE_CLASS.ERROR, REPLAY2 = STATE_CLASS.REPLAY, LOADING = STATE_CLASS.LOADING;
      var clsList = [NO_START, PAUSED, ENDED, ERROR2, REPLAY2, LOADING];
      clsList.forEach(function(cls) {
        _this23.removeClass(cls);
      });
    }
  }, {
    key: "onTimeupdate",
    value: function onTimeupdate() {
      !this._videoHeight && this.resize();
      if ((this.waitTimer || this.hasClass(STATE_CLASS.LOADING)) && this.media.readyState > 2) {
        this.removeClass(STATE_CLASS.LOADING);
        util.clearTimeout(this, this.waitTimer);
        this.waitTimer = null;
      }
      if (!this.paused && this.state < STATES.RUNNING && this.duration) {
        this.setState(STATES.RUNNING);
        this.emit(AUTOPLAY_STARTED);
      }
      if (!this._accPlayed.t && !this.paused && !this.ended) {
        this._accPlayed.t = new Date().getTime();
      }
    }
  }, {
    key: "onVolumechange",
    value: function onVolumechange() {
      util.typeOf(this.config.volume) === "Number" && (this.config.volume = this.volume);
    }
  }, {
    key: "onRatechange",
    value: function onRatechange() {
      this.config.defaultPlaybackRate = this.playbackRate;
    }
  }, {
    key: "emitUserAction",
    value: function emitUserAction(event, action, params) {
      if (!this.media || !action || !event) {
        return;
      }
      var eventType = util.typeOf(event) === "String" ? event : event.type || "";
      if (params.props && util.typeOf(params.props) !== "Array") {
        params.props = [params.props];
      }
      this.emit(USER_ACTION, _objectSpread2({
        eventType,
        action,
        currentTime: this.currentTime,
        duration: this.duration,
        ended: this.ended,
        event
      }, params));
    }
  }, {
    key: "updateAcc",
    value: function updateAcc(endType) {
      if (this._accPlayed.t) {
        var _at = new Date().getTime() - this._accPlayed.t;
        this._accPlayed.acc += _at;
        this._accPlayed.t = 0;
        if (endType === "ended" || this.ended) {
          this._accPlayed.loopAcc = this._accPlayed.acc;
        }
      }
    }
  }, {
    key: "checkBuffer",
    value: function checkBuffer(time) {
      var buffered = this.media.buffered;
      if (!buffered || buffered.length === 0 || !this.duration) {
        return true;
      }
      var currentTime = time || this.media.currentTime || 0.2;
      var len = buffered.length;
      for (var i = 0; i < len; i++) {
        if (buffered.start(i) <= currentTime && buffered.end(i) > currentTime) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "position",
    value: function position() {
      var pos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        h: 0,
        y: 0,
        x: 0,
        w: 0
      };
      if (!this.media || !pos || !pos.h) {
        return;
      }
      var rvH = 1 / pos.h;
      var _transform = rvH !== 1 ? "scale(".concat(rvH, ")") : "";
      var _tx = 0;
      var _ty = 0;
      if (pos.y) {
        _ty = (100 - pos.h * 100) / 2 - pos.y * 100;
      }
      if (pos.w && pos.x) {
        _tx = (100 - pos.w * 100) / 2 - pos.x * 100;
      }
      _transform += " translate(".concat(_tx, "%, ").concat(_ty, "%)");
      this.media.style.transform = _transform;
      this.media.style.webkitTransform = _transform;
    }
  }, {
    key: "setConfig",
    value: function setConfig(config) {
      var _this24 = this;
      if (!config) {
        return;
      }
      Object.keys(config).map(function(key) {
        if (key !== "plugins") {
          _this24.config[key] = config[key];
          var plugin = _this24.plugins[key.toLowerCase()];
          if (plugin && util.typeOf(plugin.setConfig) === "Function") {
            plugin.setConfig(config[key]);
          }
        }
      });
    }
  }, {
    key: "playNext",
    value: function playNext(config) {
      var _this25 = this;
      this.resetState();
      this.setConfig(config);
      this._currentTime = 0;
      this._duration = 0;
      runHooks(this, "playnext", function() {
        _this25.start();
        _this25.emit(PLAYNEXT, config);
      });
    }
  }, {
    key: "resize",
    value: function resize() {
      var _this26 = this;
      if (!this.media) {
        return;
      }
      var _this$media = this.media, videoWidth = _this$media.videoWidth, videoHeight = _this$media.videoHeight;
      var _this$config6 = this.config, fitVideoSize = _this$config6.fitVideoSize, videoFillMode = _this$config6.videoFillMode;
      if (videoFillMode === "fill" || videoFillMode === "cover") {
        this.setAttribute("data-xgfill", videoFillMode);
      }
      if (!videoHeight || !videoWidth) {
        return;
      }
      this._videoHeight = videoHeight;
      this._videoWidth = videoWidth;
      var containerSize = this.root.getBoundingClientRect();
      var controlsHeight = this.controls && this.innerContainer ? this.controls.root.getBoundingClientRect().height : 0;
      var width = containerSize.width;
      var height = containerSize.height - controlsHeight;
      var videoFit = parseInt(videoWidth / videoHeight * 1e3, 10);
      var fit = parseInt(width / height * 1e3, 10);
      var rWidth = width;
      var rHeight = height;
      var _style = {};
      if (fitVideoSize === "auto" && fit > videoFit || fitVideoSize === "fixWidth") {
        rHeight = width / videoFit * 1e3;
        if (this.config.fluid) {
          _style.paddingTop = "".concat(rHeight * 100 / rWidth, "%");
        } else {
          _style.height = "".concat(rHeight + controlsHeight, "px");
        }
      } else if (fitVideoSize === "auto" && fit < videoFit || fitVideoSize === "fixHeight") {
        rWidth = videoFit * height / 1e3;
        _style.width = "".concat(rWidth, "px");
      }
      if (!this.fullscreen && !this.cssfullscreen) {
        Object.keys(_style).forEach(function(key) {
          _this26.root.style[key] = _style[key];
        });
      }
      if (videoFillMode === "fillHeight" && fit < videoFit || videoFillMode === "fillWidth" && fit > videoFit) {
        this.setAttribute("data-xgfill", "cover");
      }
      var data = {
        videoScale: videoFit,
        vWidth: rWidth,
        vHeight: rHeight,
        cWidth: rWidth,
        cHeight: rHeight + controlsHeight
      };
      this.emit(VIDEO_RESIZE, data);
    }
  }, {
    key: "updateObjectPosition",
    value: function updateObjectPosition() {
      var left = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      var top = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      if (this.media.updateObjectPosition) {
        this.media.updateObjectPosition(left, top);
        return;
      }
      this.media.style.objectPosition = "".concat(left * 100, "% ").concat(top * 100, "%");
    }
  }, {
    key: "setState",
    value: function setState(newState) {
      XG_DEBUG.logInfo("setState", "state from:".concat(STATE_ARRAY[this.state], " to:").concat(STATE_ARRAY[newState]));
      this._state = newState;
    }
  }, {
    key: "state",
    get: function get() {
      return this._state;
    }
  }, {
    key: "isFullscreen",
    get: function get() {
      return this.fullscreen;
    }
  }, {
    key: "isCssfullScreen",
    get: function get() {
      return this.cssfullscreen;
    }
  }, {
    key: "hasStart",
    get: function get() {
      return this._hasStart;
    },
    set: function set(bool) {
      if (typeof bool === "boolean") {
        this._hasStart = bool;
        if (bool === false) {
          this.setState(STATES.READY);
        }
        this.emit("hasstart");
      }
    }
  }, {
    key: "isPlaying",
    get: function get() {
      return this._state === STATES.RUNNING || this._state === STATES.ENDED;
    },
    set: function set(value) {
      if (value) {
        this.setState(STATES.RUNNING);
      } else {
        this._state >= STATES.RUNNING && this.setState(STATES.ATTACHED);
      }
    }
  }, {
    key: "definitionList",
    get: function get() {
      if (!this.config || !this.config.definition) {
        return [];
      }
      return this.config.definition.list || [];
    },
    set: function set(list) {
      var _this27 = this;
      var definition = this.config.definition;
      var curDef = null;
      var targetDef = null;
      definition.list = list;
      this.emit("resourceReady", list);
      list.forEach(function(item) {
        var _this27$curDefinition;
        if (((_this27$curDefinition = _this27.curDefinition) === null || _this27$curDefinition === void 0 ? void 0 : _this27$curDefinition.definition) === item.definition) {
          curDef = item;
        }
        if (definition.defaultDefinition === item.definition) {
          targetDef = item;
        }
      });
      if (!targetDef && list.length > 0) {
        targetDef = list[0];
      }
      curDef ? this.changeDefinition(curDef) : targetDef && this.changeDefinition(targetDef);
    }
  }, {
    key: "videoFrameInfo",
    get: function get() {
      var ret = {
        total: 0,
        dropped: 0,
        corrupted: 0,
        droppedRate: 0,
        droppedDuration: 0
      };
      if (!this.media || !this.media.getVideoPlaybackQuality) {
        return ret;
      }
      var _quality = this.media.getVideoPlaybackQuality();
      ret.dropped = _quality.droppedVideoFrames || 0;
      ret.total = _quality.totalVideoFrames || 0;
      ret.corrupted = _quality.corruptedVideoFrames || 0;
      if (ret.total > 0) {
        ret.droppedRate = ret.dropped / ret.total * 100;
        ret.droppedDuration = parseInt(this.cumulateTime / ret.total * ret.dropped, 0);
      }
      return ret;
    }
  }, {
    key: "lang",
    get: function get() {
      return this.config.lang;
    },
    set: function set(lang) {
      var result = I18N.langKeys.filter(function(key) {
        return key === lang;
      });
      if (result.length === 0 && lang !== "zh") {
        console.error("Sorry, set lang fail, because the language [".concat(lang, "] is not supported now, list of all supported languages is [").concat(I18N.langKeys.join(), "] "));
        return;
      }
      this.config.lang = lang;
      pluginsManager.setLang(lang, this);
    }
  }, {
    key: "i18n",
    get: function get() {
      var _l = this.config.lang;
      if (_l === "zh") {
        _l = "zh-cn";
      }
      return this.__i18n.lang[_l] || this.__i18n.lang.en;
    }
  }, {
    key: "i18nKeys",
    get: function get() {
      return this.__i18n.textKeys || {};
    }
  }, {
    key: "version",
    get: function get() {
      return version;
    }
  }, {
    key: "playerId",
    get: function get() {
      return this._pluginInfoId;
    }
  }, {
    key: "url",
    get: function get() {
      return this.__url || this.config.url;
    },
    set: function set(url) {
      this.__url = url;
    }
  }, {
    key: "poster",
    get: function get() {
      return this.plugins.poster ? this.plugins.poster.config.poster : this.config.poster;
    },
    set: function set(posterUrl) {
      this.plugins.poster && this.plugins.poster.update(posterUrl);
    }
  }, {
    key: "readyState",
    get: function get() {
      return _get(_getPrototypeOf(Player2.prototype), "readyState", this);
    }
  }, {
    key: "error",
    get: function get() {
      var key = _get(_getPrototypeOf(Player2.prototype), "error", this);
      return this.i18n[key] || key;
    }
  }, {
    key: "networkState",
    get: function get() {
      return _get(_getPrototypeOf(Player2.prototype), "networkState", this);
    }
  }, {
    key: "fullscreenChanging",
    get: function get() {
      return !(this._fullScreenOffset === null);
    }
  }, {
    key: "cumulateTime",
    get: function get() {
      var _accPlayed = this._accPlayed;
      this.updateAcc("get");
      return _accPlayed.acc;
    }
  }, {
    key: "zoom",
    get: function get() {
      return this.config.zoom;
    },
    set: function set(value) {
      this.config.zoom = value;
    }
  }, {
    key: "avgSpeed",
    get: function get() {
      return AVG_SPEED;
    },
    set: function set(val) {
      AVG_SPEED = val;
    }
  }, {
    key: "realTimeSpeed",
    get: function get() {
      return REAL_TIME_SPEED;
    },
    set: function set(val) {
      REAL_TIME_SPEED = val;
    }
  }, {
    key: "hook",
    value: function hook$1(hookName, handler) {
      return hook.call.apply(hook, [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "useHooks",
    value: function useHooks$1(hookName, handler) {
      return useHooks.call.apply(useHooks, [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "removeHooks",
    value: function removeHooks$1(hookName, handler) {
      return removeHooks.call.apply(removeHooks, [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "usePluginHooks",
    value: function usePluginHooks$1(pluginName, hookName, handler) {
      for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }
      return usePluginHooks.call.apply(usePluginHooks, [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "removePluginHooks",
    value: function removePluginHooks$1(pluginName, hookName, handler) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        args[_key2 - 3] = arguments[_key2];
      }
      return removePluginHooks.call.apply(removePluginHooks, [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "setUserActive",
    value: function setUserActive(isActive, isMuted) {
      if (typeof isMuted === "boolean" && isMuted !== this.muted) {
        this.addInnerOP("volumechange");
        this.muted = isMuted;
      }
      pluginsManager.setCurrentUserActive(this.playerId, isActive);
    }
  }], [{
    key: "debugger",
    get: function get() {
      return XG_DEBUG.config.debug;
    },
    set: function set(value) {
      XG_DEBUG.config.debug = value;
    }
  }, {
    key: "getCurrentUserActivePlayerId",
    value: function getCurrentUserActivePlayerId() {
      return pluginsManager.getCurrentUseActiveId();
    }
  }, {
    key: "setCurrentUserActive",
    value: function setCurrentUserActive(playerId, isActive) {
      pluginsManager.setCurrentUserActive(playerId, isActive);
    }
  }, {
    key: "isHevcSupported",
    value: function isHevcSupported() {
      return sniffer.isHevcSupported();
    }
  }, {
    key: "probeConfigSupported",
    value: function probeConfigSupported(info) {
      return sniffer.probeConfigSupported(info);
    }
  }, {
    key: "install",
    value: function install(name, descriptor) {
      if (!Player2.plugins) {
        Player2.plugins = {};
      }
      if (!Player2.plugins[name]) {
        Player2.plugins[name] = descriptor;
      }
    }
  }, {
    key: "use",
    value: function use(name, descriptor) {
      if (!Player2.plugins) {
        Player2.plugins = {};
      }
      Player2.plugins[name] = descriptor;
    }
  }]);
  return Player2;
}(MediaProxy);
_defineProperty(Player, "defaultPreset", null);
_defineProperty(Player, "XgVideoProxy", null);
export { Player as default };
