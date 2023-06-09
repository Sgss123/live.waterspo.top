export default Time;
declare class Time extends Plugin {
    static get defaultConfig(): {
        position: string;
        index: number;
        disable: boolean;
    };
    constructor(args: any);
    isActiving: boolean;
    get duration(): number;
    get currentTime(): any;
    get timeOffset(): number;
    mode: string;
    durationDom: HTMLElement;
    timeDom: HTMLElement;
    show(): void;
    onTimeUpdate(isEnded: any): void;
    onReset(): void;
    createCenterTime(): void;
    centerCurDom: HTMLElement;
    centerDurDom: HTMLElement;
    changeLiveState(isLive: any): void;
    updateTime(time: any): void;
    resetActive(): void;
    render(): string;
}
import Plugin from "../../plugin";
