export default PresetPlayer;
declare class PresetPlayer extends Player {
    static defaultPreset: typeof defaultPreset;
    static Util: typeof Util;
    static Sniffer: import("./utils/sniffer").ISniffer;
    static Errors: typeof Errors;
    static Events: typeof Events;
    static Plugin: typeof Plugin;
    static BasePlugin: typeof BasePlugin;
    static I18N: {
        readonly textKeys: any[];
        readonly langKeys: string[];
        readonly lang: {
            [propName: string]: {
                [propName: string]: string;
            };
        };
        extend: (I18nText: import("./lang/i18n").IXGI18nText) => {};
        use: (lang: import("./lang/i18n").IXGI18nText) => {};
        init: (id: any) => import("./lang/i18n").IXGI18n;
    };
    static STATE_CLASS: {
        DEFAULT: string;
        DEFAULT_SKIN: string;
        ENTER: string;
        PAUSED: string;
        PLAYING: string;
        ENDED: string;
        CANPLAY: string;
        LOADING: string;
        ERROR: string;
        REPLAY: string;
        NO_START: string;
        ACTIVE: string;
        INACTIVE: string;
        FULLSCREEN: string;
        CSS_FULLSCREEN: string;
        ROTATE_FULLSCREEN: string;
        PARENT_ROTATE_FULLSCREEN: string;
        PARENT_FULLSCREEN: string;
        INNER_FULLSCREEN: string;
        NO_CONTROLS: string;
        FLEX_CONTROLS: string;
        CONTROLS_FOLLOW: string;
        CONTROLS_AUTOHIDE: string;
        TOP_BAR_AUTOHIDE: string;
        NOT_ALLOW_AUTOPLAY: string;
        SEEKING: string;
        PC: string;
        MOBILE: string;
        MINI: string;
    };
}
import Player from "./player";
import defaultPreset from "./presets/default";
import Util from "./utils/util";
import Errors from "./error";
import * as Events from "./events";
import Plugin from "./plugin/plugin";
import BasePlugin from "./plugin/basePlugin";
