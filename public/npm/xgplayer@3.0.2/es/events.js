var PLAY = "play";
var PLAYING = "playing";
var ENDED = "ended";
var PAUSE = "pause";
var ERROR = "error";
var SEEKING = "seeking";
var SEEKED = "seeked";
var TIME_UPDATE = "timeupdate";
var WAITING = "waiting";
var CANPLAY = "canplay";
var CANPLAY_THROUGH = "canplaythrough";
var DURATION_CHANGE = "durationchange";
var VOLUME_CHANGE = "volumechange";
var LOADED_DATA = "loadeddata";
var RATE_CHANGE = "ratechange";
var PROGRESS = "progress";
var LOAD_START = "loadstart";
var EMPTIED = "emptied";
var STALLED = "stalled";
var SUSPEND = "suspend";
var ABORT = "abort";
var BUFFER_CHANGE = "bufferedChange";
var PLAYER_FOCUS = "focus";
var PLAYER_BLUR = "blur";
var READY = "ready";
var URL_NULL = "urlNull";
var AUTOPLAY_STARTED = "autoplay_started";
var AUTOPLAY_PREVENTED = "autoplay_was_prevented";
var COMPLETE = "complete";
var REPLAY = "replay";
var DESTROY = "destroy";
var URL_CHANGE = "urlchange";
var DOWNLOAD_SPEED_CHANGE = "download_speed_change";
var FULLSCREEN_CHANGE = "fullscreen_change";
var CSS_FULLSCREEN_CHANGE = "cssFullscreen_change";
var MINI_STATE_CHANGE = "mini_state_change";
var DEFINITION_CHANGE = "definition_change";
var BEFORE_DEFINITION_CHANGE = "before_definition_change";
var AFTER_DEFINITION_CHANGE = "after_definition_change";
var SEI_PARSED = "SEI_PARSED";
var RETRY = "retry";
var VIDEO_RESIZE = "video_resize";
var PIP_CHANGE = "pip_change";
var ROTATE = "rotate";
var SCREEN_SHOT = "screenShot";
var PLAYNEXT = "playnext";
var SHORTCUT = "shortcut";
var XGLOG = "xglog";
var USER_ACTION = "user_action";
var RESET = "reset";
var SWITCH_SUBTITLE = "switch_subtitle";
var VIDEO_EVENTS = ["play", "playing", "ended", "pause", "error", "seeking", "seeked", "timeupdate", "waiting", "canplay", "canplaythrough", "durationchange", "volumechange", "loadeddata", "ratechange", "progress", "loadstart", "emptied", "stalled", "suspend", "abort", "lowdecode"];
var STATS_EVENTS = {
  STATS_INFO: "stats_info",
  STATS_DOWNLOAD: "stats_download",
  STATS_RESET: "stats_reset"
};
var FPS_STUCK = "fps_stuck";
export { ABORT, AFTER_DEFINITION_CHANGE, AUTOPLAY_PREVENTED, AUTOPLAY_STARTED, BEFORE_DEFINITION_CHANGE, BUFFER_CHANGE, CANPLAY, CANPLAY_THROUGH, COMPLETE, CSS_FULLSCREEN_CHANGE, DEFINITION_CHANGE, DESTROY, DOWNLOAD_SPEED_CHANGE, DURATION_CHANGE, EMPTIED, ENDED, ERROR, FPS_STUCK, FULLSCREEN_CHANGE, LOADED_DATA, LOAD_START, MINI_STATE_CHANGE, PAUSE, PIP_CHANGE, PLAY, PLAYER_BLUR, PLAYER_FOCUS, PLAYING, PLAYNEXT, PROGRESS, RATE_CHANGE, READY, REPLAY, RESET, RETRY, ROTATE, SCREEN_SHOT, SEEKED, SEEKING, SEI_PARSED, SHORTCUT, STALLED, STATS_EVENTS, SUSPEND, SWITCH_SUBTITLE, TIME_UPDATE, URL_CHANGE, URL_NULL, USER_ACTION, VIDEO_EVENTS, VIDEO_RESIZE, VOLUME_CHANGE, WAITING, XGLOG };