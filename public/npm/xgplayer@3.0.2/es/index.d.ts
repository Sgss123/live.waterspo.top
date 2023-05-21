export * from "./presets";
export { default as langZhHk } from "./lang/zh-hk";
export { default as langJp } from "./lang/jp";
export { default as langZhCn } from "./lang/zh-cn";
export { default as TextTrack } from "./plugins/track";
export type IPlayerOptions = import('./defaultConfig').IPlayerOptions;
export type IDefinition = import('./defaultConfig').IDefinition;
export type IVideoProxy = any;
export type IBasePluginOptions = import('./plugin/basePlugin').IBasePluginOptions;
export type IPluginOptions = import('./plugin/plugin').IPluginOptions;
export type IError = import('./error').IError;
export type IXGI18nText = import('./lang/i18n').IXGI18nText;
import PresetPlayer from "./index.umd";
import Player from "./player";
import BasePlugin from "./plugin/basePlugin";
import Plugin from "./plugin/plugin";
import * as Events from "./events";
import Errors from "./error";
import Sniffer from "./utils/sniffer";
import Util from "./utils/util";
import STATE_CLASS from "./stateClassMap";
import I18N from "./lang/i18n";
import { STATES } from "./state";
export { PresetPlayer as default, Player as SimplePlayer, BasePlugin, Plugin, Events, Errors, Sniffer, Util, STATE_CLASS, I18N, STATES };
export { default as Danmu, DanmuIcon, DanmuPanel } from "./plugins/danmu";