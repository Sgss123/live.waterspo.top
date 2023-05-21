/**
 * @typedef { {
 *   tick?: number,
 *   stuckCount?: number,
 *   disable?: boolean,
 *   reportFrame?: number
 * } } IFullscreenConfig
 */
export default class FpsDetect extends BasePlugin {
    static get defaultConfig(): {
        disabled: boolean;
        tick: number;
        stuckCount: number;
        reportFrame: number;
    };
    timer: any;
    _lastDecodedFrames: any;
    _currentStuckCount: number;
    _lastCheckPoint: number;
    _startTick(): void;
    _timer: NodeJS.Timeout;
    _stopTick(): void;
    _checkStuck(curDecodedFrames: any): void;
    _checkDecodeFPS(): void;
}
export type IFullscreenConfig = {
    tick?: number;
    stuckCount?: number;
    disable?: boolean;
    reportFrame?: number;
};
import BasePlugin from "../../plugin";
