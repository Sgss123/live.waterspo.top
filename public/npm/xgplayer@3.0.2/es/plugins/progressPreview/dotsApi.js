import util from "../../utils/util.js";
import { DURATION_CHANGE } from "../../events.js";
import "../../utils/debug.js";
import "delegate";
var ISPOT = {
  time: 0,
  text: "",
  id: 1,
  duration: 1,
  color: "#fff",
  style: {},
  width: 6,
  height: 6
};
function mergeISPOT(iSpot) {
  Object.keys(ISPOT).map(function(key) {
    if (iSpot[key] === void 0) {
      iSpot[key] = ISPOT[key];
    }
  });
}
var APIS = {
  _updateDotDom: function _updateDotDom(iSpot, dotDom) {
    if (!dotDom) {
      return;
    }
    var ret = this.calcuPosition(iSpot.time, iSpot.duration);
    var style = iSpot.style || {};
    style.left = "".concat(ret.left, "%");
    style.width = "".concat(ret.width, "%");
    dotDom.setAttribute("data-text", iSpot.text);
    dotDom.setAttribute("data-time", iSpot.time);
    if (ret.isMini) {
      util.addClass(dotDom, "mini");
    } else {
      util.removeClass(dotDom, "mini");
    }
    Object.keys(style).map(function(key) {
      dotDom.style[key] = style[key];
    });
  },
  initDots: function initDots() {
    var _this = this;
    this._ispots.map(function(item) {
      _this.createDot(item, false);
    });
    this.ispotsInit = true;
  },
  createDot: function createDot(iSpot) {
    var isNew = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    var progress = this.player.plugins.progress;
    if (!progress) {
      return;
    }
    if (isNew) {
      mergeISPOT(iSpot);
      this._ispots.push(iSpot);
    }
    if (!this.ispotsInit && isNew) {
      return;
    }
    var ret = this.calcuPosition(iSpot.time, iSpot.duration);
    var style = iSpot.style || {};
    style.left = "".concat(ret.left, "%");
    style.width = "".concat(ret.width, "%");
    var className = "xgspot_".concat(iSpot.id, " xgplayer-spot");
    ret.isMini && (className += " mini");
    var dotDom = util.createDom("xg-spot", iSpot.template || "", {
      "data-text": iSpot.text,
      "data-time": iSpot.time,
      "data-id": iSpot.id
    }, className);
    Object.keys(style).map(function(key) {
      dotDom.style[key] = style[key];
    });
    progress.outer && progress.outer.appendChild(dotDom);
  },
  findDot: function findDot(id) {
    if (!this.player.plugins.progress) {
      return;
    }
    var ret = this._ispots.filter(function(cur, index) {
      return cur.id === id;
    });
    return ret.length > 0 ? ret[0] : null;
  },
  updateDot: function updateDot(iSpot) {
    var needShow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    var progress = this.player.plugins.progress;
    if (!progress) {
      return;
    }
    var dot = this.findDot(iSpot.id);
    if (dot) {
      Object.keys(iSpot).map(function(key) {
        dot[key] = iSpot[key];
      });
    }
    if (!this.ispotsInit) {
      return;
    }
    var dotDom = progress.find('xg-spot[data-id="'.concat(iSpot.id, '"]'));
    if (!dotDom) {
      return;
    }
    this._updateDotDom(iSpot, dotDom);
    if (needShow) {
      this.showDot(iSpot.id);
    }
  },
  deleteDot: function deleteDot(id) {
    var _ispots = this._ispots;
    var progress = this.player.plugins.progress;
    if (!progress) {
      return;
    }
    var del = [];
    for (var i = 0; i < _ispots.length; i++) {
      if (_ispots[i].id === id) {
        del.push(i);
      }
    }
    var len = del.length;
    for (var _i = len - 1; _i >= 0; _i--) {
      _ispots.splice(del[_i], 1);
      if (this.ispotsInit) {
        var dotDom = progress.find('xg-spot[data-id="'.concat(id, '"]'));
        if (dotDom) {
          dotDom.parentElement.removeChild(dotDom);
        }
      }
    }
  },
  deleteAllDots: function deleteAllDots() {
    var progress = this.player.plugins.progress;
    if (!progress) {
      return;
    }
    if (!this.ispotsInit) {
      this._ispots = [];
      return;
    }
    var dotDoms = progress.root.getElementsByTagName("xg-spot");
    for (var i = dotDoms.length - 1; i >= 0; i--) {
      progress.outer.removeChild(dotDoms[i]);
    }
    this._ispots = [];
  },
  updateAllDots: function updateAllDots() {
    var _this2 = this;
    var iSpots = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    var progress = this.player.plugins.progress;
    if (!progress) {
      return;
    }
    if (!this.ispotsInit) {
      this._ispots = iSpots;
      return;
    }
    this._ispots = [];
    var dotDoms = progress.root.getElementsByTagName("xg-spot");
    var len = dotDoms.length;
    if (len > iSpots.length) {
      for (var i = len - 1; i > iSpots.length - 1; i--) {
        progress.outer.removeChild(dotDoms[i]);
      }
    }
    iSpots.forEach(function(ispot, index) {
      if (index < len) {
        dotDoms[index].setAttribute("data-id", "".concat(ispot.id));
        _this2._ispots.push(ispot);
        _this2.updateDot(ispot);
      } else {
        _this2.createDot(ispot);
      }
    });
  },
  updateDuration: function updateDuration() {
    var _this3 = this;
    var progress = this.player.plugins.progress;
    if (!progress) {
      return;
    }
    var _ispots = this._ispots;
    _ispots.forEach(function(item) {
      var dotDom = progress.find('xg-spot[data-id="'.concat(item.id, '"]'));
      _this3._updateDotDom(item, dotDom);
    });
  },
  getAllDotsDom: function getAllDotsDom() {
    var progress = this.player.plugins.progress;
    if (!progress) {
      return [];
    }
    var dotDoms = progress.root.getElementsByTagName("xg-spot");
    return dotDoms;
  },
  getDotDom: function getDotDom(id) {
    var progress = this.player.plugins.progress;
    if (!progress) {
      return;
    }
    return progress.find('xg-spot[data-id="'.concat(id, '"]'));
  }
};
function initDotsAPI(plugin) {
  var config = plugin.config, player = plugin.player;
  Object.keys(APIS).map(function(item) {
    plugin[item] = APIS[item].bind(plugin);
  });
  var ispots = player.config.progressDot || config.ispots || [];
  plugin._ispots = ispots.map(function(item) {
    mergeISPOT(item);
    return item;
  });
  plugin.ispotsInit = false;
  plugin.on(DURATION_CHANGE, function() {
    if (!plugin.ispotsInit) {
      plugin.initDots();
    } else {
      plugin.updateDuration();
    }
  });
}
export { initDotsAPI as default };
