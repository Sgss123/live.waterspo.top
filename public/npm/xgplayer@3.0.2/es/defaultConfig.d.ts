/**
 * @typedef {{
 *   url: any,
 *   definition: any,
 *   bitrate?: number,
 *   bandwidth?: number,
 *   text?: string | { [propName: string]: any },
 *   iconText?: string | { [propName: string]: any },
 *   [propName: string]: any
 * }} IDefinition
 */
/**
 * @typedef { {
 *   id?: string,
 *   el?: HTMLElement,
 *   url?: any,
 *   domEventType?: 'default' | 'touch' | 'mouse',
 *   nullUrlStart?: boolean,
 *   width?: number | string,
 *   height?: number | string,
 *   fluid?: boolean,
 *   fitVideoSize?: 'fixWidth'|'fixHeight'|'fixed',
 *   videoFillMode?: 'auto'|'fillHeight'|'fillWidth'|'fill'|'cover',
 *   volume?: number | { [propName: string]: any },
 *   autoplay?: boolean,
 *   autoplayMuted?: boolean,
 *   loop?: boolean,
 *   isLive?: boolean,
 *   zoom?: number,
 *   videoInit?: boolean,
 *   poster?: string | { [propName: string]: any },
 *   isMobileSimulateMode?: 'mobile' | 'pc',
 *   defaultPlaybackRate?: number,
 *   execBeforePluginsCall?: () => any,
 *   allowSeekAfterEnded?: boolean,
 *   enableContextmenu?: boolean,
 *   closeVideoClick?: boolean,
 *   closeVideoDblclick?: boolean,
 *   closePlayerBlur?: boolean,
 *   closeDelayBlur?: boolean,
 *   leavePlayerTime?: number,
 *   closePlayVideoFocus?: boolean,
 *   closePauseVideoFocus?: boolean,
 *   closeFocusVideoFocus?: boolean,
 *   closeControlsBlur?: boolean,
 *   topBarAutoHide?: boolean,
 *   videoAttributes?: { [propName: string]: any },
 *   startTime?: number,
 *   seekedStatus?: 'play' | 'pause' | 'auto',
 *   miniprogress?: boolean,
 *   disableSwipeHandler?: () => any,
 *   enableSwipeHandler?: () => any,
 *   ignores?: Array<'cssfullscreen' | 'screenshot' | 'pip' | 'miniscreen' | 'keyboard' | 'download' | 'playbackrate' | 'time' | 'definition' | 'error' | 'fullscreen' | 'loading' | 'mobile' | 'pc' | 'play' | 'poster' | 'progress' | 'replay' | 'start' | 'volume' | string>,
 *   inactive?: number,
 *   lang?: string,
 *   controls?: boolean | { [propName: string]: any },
 *   marginControls?: boolean,
 *   fullscreenTarget?: HTMLElement, // 全屏作用的dom元素
 *   screenShot?: boolean | { [propName: string]: any },
 *   rotate?: boolean | { [propName: string]: any },
 *   pip?: boolean | { [propName: string]: any },
 *   download?: boolean | { [propName: string]: any },
 *   mini?: boolean | { [propName: string]: any },
 *   cssFullscreen?: boolean | { [propName: string]: any },
 *   keyShortcut?: boolean,
 *   presets?: any[],
 *   plugins?: any[]
 *   playbackRate?: number | Array<number> | { [propName: string]: any },
 *   definition?: { list: Array<IDefinition> , defaultDefinition?: IDefinition['definition'], [propName: string]: any},
 *   playsinline?: boolean,
 *   customDuration?: number,
 *   timeOffset?: number,
 *   icons?: { [propName: string]: string | HTMLElement | () => HTMLElement | string },
 *   i18n?: Array<any>,
 *   tabindex?: number,
 *   thumbnail?: {
 *     urls: Array<string>,
 *     pic_num: number,
 *     col: number,
 *     row: number,
 *     height?: number,
 *     width?: number,
 *   },
 *   videoConfig?: { [propName: string]: any },
 *   isHideTips?: boolean,
 *   commonStyle?: {
 *     progressColor?: string,
 *     playedColor?: string,
 *     cachedColor?: string,
 *     sliderBtnStyle?: { [propName: string]: any },
 *     volumeColor?: string
 *   },
 *   [propName: string]: any;
 * } } IPlayerOptions
 */
/**
 * @returns { IPlayerOptions }
 */
export default function getDefaultConfig(): IPlayerOptions;
export type IDefinition = {
    [propName: string]: any;
    url: any;
    definition: any;
    bitrate?: number;
    bandwidth?: number;
    text?: string | {
        [propName: string]: any;
    };
    iconText?: string | {
        [propName: string]: any;
    };
};
export type IPlayerOptions = {
    [propName: string]: any;
    id?: string;
    el?: HTMLElement;
    url?: any;
    domEventType?: 'default' | 'touch' | 'mouse';
    nullUrlStart?: boolean;
    width?: number | string;
    height?: number | string;
    fluid?: boolean;
    fitVideoSize?: 'fixWidth' | 'fixHeight' | 'fixed';
    videoFillMode?: 'auto' | 'fillHeight' | 'fillWidth' | 'fill' | 'cover';
    volume?: number | {
        [propName: string]: any;
    };
    autoplay?: boolean;
    autoplayMuted?: boolean;
    loop?: boolean;
    isLive?: boolean;
    zoom?: number;
    videoInit?: boolean;
    poster?: string | {
        [propName: string]: any;
    };
    isMobileSimulateMode?: 'mobile' | 'pc';
    defaultPlaybackRate?: number;
    execBeforePluginsCall?: () => any;
    allowSeekAfterEnded?: boolean;
    enableContextmenu?: boolean;
    closeVideoClick?: boolean;
    closeVideoDblclick?: boolean;
    closePlayerBlur?: boolean;
    closeDelayBlur?: boolean;
    leavePlayerTime?: number;
    closePlayVideoFocus?: boolean;
    closePauseVideoFocus?: boolean;
    closeFocusVideoFocus?: boolean;
    closeControlsBlur?: boolean;
    topBarAutoHide?: boolean;
    videoAttributes?: {
        [propName: string]: any;
    };
    startTime?: number;
    seekedStatus?: 'play' | 'pause' | 'auto';
    miniprogress?: boolean;
    disableSwipeHandler?: () => any;
    enableSwipeHandler?: () => any;
    ignores?: Array<'cssfullscreen' | 'screenshot' | 'pip' | 'miniscreen' | 'keyboard' | 'download' | 'playbackrate' | 'time' | 'definition' | 'error' | 'fullscreen' | 'loading' | 'mobile' | 'pc' | 'play' | 'poster' | 'progress' | 'replay' | 'start' | 'volume' | string>;
    inactive?: number;
    lang?: string;
    controls?: boolean | {
        [propName: string]: any;
    };
    marginControls?: boolean;
    fullscreenTarget?: HTMLElement;
    screenShot?: boolean | {
        [propName: string]: any;
    };
    rotate?: boolean | {
        [propName: string]: any;
    };
    pip?: boolean | {
        [propName: string]: any;
    };
    download?: boolean | {
        [propName: string]: any;
    };
    mini?: boolean | {
        [propName: string]: any;
    };
    cssFullscreen?: boolean | {
        [propName: string]: any;
    };
    keyShortcut?: boolean;
    presets?: any[];
    plugins?: any[];
    playbackRate?: number | number[] | {
        [propName: string]: any;
    };
    definition?: {
        [propName: string]: any;
        list: Array<IDefinition>;
        defaultDefinition?: IDefinition['definition'];
    };
    playsinline?: boolean;
    customDuration?: number;
    timeOffset?: number;
    icons?: {
        [propName: string]: string | HTMLElement | (() => HTMLElement | string);
    };
    i18n?: Array<any>;
    tabindex?: number;
    thumbnail?: {
        urls: Array<string>;
        pic_num: number;
        col: number;
        row: number;
        height?: number;
        width?: number;
    };
    videoConfig?: {
        [propName: string]: any;
    };
    isHideTips?: boolean;
    commonStyle?: {
        progressColor?: string;
        playedColor?: string;
        cachedColor?: string;
        sliderBtnStyle?: {
            [propName: string]: any;
        };
        volumeColor?: string;
    };
};
