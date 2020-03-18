import scrollHandle, { ScrollHandlers } from "@zhinan-oppo/scroll-handle";

function setStyles(element: HTMLElement, styles = {}): void {
  [
    "left",
    "bottom",
    "top",
    "position",
    "transform",
    "margin",
    "width",
    "height"
  ].forEach((k: string) => {
    element.style[k] = styles[k] || "";
  });
}

function warn(message: string): void {
  // eslint-disable-next-line no-console
  console.warn(`[sticky] ${message}`);
}

export interface StickyOption {
  container?: string | HTMLElement;
  scrollHandlers?: ScrollHandlers;
}

export function initStickyItem(
  dom: string | Element,
  { container, scrollHandlers = {} }: StickyOption = { scrollHandlers: {} },
  debug = false
): null | (() => void) {
  let element: HTMLElement;
  let parent: HTMLElement;

  if (typeof dom === "string") {
    const doms = document.querySelectorAll(dom);
    if (doms.length === 0) {
      warn(`未选中任何 DOM: ${dom}`);
      return null;
    }
    if (doms.length > 1) {
      warn(`选中了多个 DOM，但只有第一个会生效: ${dom}`);
    }
    element = doms[0] as HTMLElement;
  } else {
    element = dom as HTMLElement;
  }

  if (!container) {
    if (element.parentElement === null) {
      warn("没有指定或找不到 sticky container");
      return null;
    } else {
      parent = element.parentElement;
    }
  } else if (typeof container === "string") {
    parent = document.querySelectorAll(container)[0] as HTMLElement;
  } else {
    parent = container;
  }

  element.setAttribute("z-sticky-manually", "");
  element.style.position = "relative";
  parent.style.position = "relative";

  const itemRect = element.getBoundingClientRect();
  const containerRect = parent.getBoundingClientRect();
  if (debug) {
    // eslint-disable-next-line no-console
    console.debug({
      itemRect,
      containerRect,
      element
    });
  }

  const bottomToParentTop = itemRect.bottom - containerRect.top;
  const top = `${itemRect.top - containerRect.top}px`;
  const left = `${itemRect.left}px`;
  const width = `${itemRect.width}px`;
  const height = `${itemRect.height}px`;

  const removeHandle = scrollHandle({
    dom: parent,
    start: { placement: "top" },
    end: { distance: bottomToParentTop },
    handlers: {
      before: scrollHandlers.before,
      inView: scrollHandlers.inView,
      after: scrollHandlers.after,
      onStateChange: (doms, state, oldState): void => {
        switch (state) {
          case "inView":
            setStyles(element, {
              left,
              top,
              width,
              height,
              position: "fixed",
              bottom: "auto",
              transform: "none",
              margin: "0"
            });
            break;
          case "after":
            setStyles(element, {
              left: `${element.getBoundingClientRect().left -
                parent.getBoundingClientRect().left}px`,
              top: "auto",
              bottom: "0",
              position: "absolute",
              transform: "none",
              margin: "0"
            });
            break;
          case "before":
          default:
            setStyles(element);
        }
        if (debug) {
          const position =
            state === "inView" ? "fixed" : state === "after" ? "absolute" : "";
          // eslint-disable-next-line no-console
          console.debug(`sticky item: ${position}`, element);
        }
        if (scrollHandlers.onStateChange) {
          scrollHandlers.onStateChange(doms, state, oldState);
        }
      }
    }
  });
  const destroy = (): void => {
    if (removeHandle) {
      removeHandle();
    }
  };
  return destroy;
}

export function init({ debug = false } = {}): void {
  document.querySelectorAll(".sticky-item").forEach(element => {
    const manually = element.getAttribute("z-sticky-manually");
    // eslint-disable-next-line eqeqeq
    if (manually == undefined || manually === "false") {
      initStickyItem(element, {}, debug);
    }
  });
}
