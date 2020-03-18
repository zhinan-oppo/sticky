import { ScrollHandlers } from "@zhinan-oppo/scroll-handle";
export interface StickyOption {
    container?: string | HTMLElement;
    scrollHandlers?: ScrollHandlers;
}
export declare function initStickyItem(dom: string | Element, { container, scrollHandlers }?: StickyOption, debug?: boolean): null | (() => void);
export declare function init({ debug }?: {
    debug?: boolean | undefined;
}): void;
