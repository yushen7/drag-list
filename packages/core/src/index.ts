
import { isDraggable } from "./helpers";
import { processDragResult, processSwap } from "./interations";
import { normalizeConfig } from "./helpers/config";
import { Config, DraggedItem, MoveDirection } from "./types/index";
import { NormalizedConfig } from "./types";

import { parseComponent } from "vue-template-compiler";

parseComponent;

function createdragListByRaw(list: HTMLCollection, config: NormalizedConfig) {
  const toArr = [...(list as any)];
  const configItems = config.items || [];
  const dragList: DraggedItem[] = toArr.map((item, index) => ({
    el: item,
    id: `${index}`,
    index,
    translate: {
      x: 0,
      y: 0,
    },
    moveDirection: MoveDirection.None,
    swapDirection: MoveDirection.None,
    position: {
      x: 0,
      y: 0,
    },
    disabled: configItems[index] ? configItems[index].disabled : false
  }));
  dragList.forEach((item, index) => {
    const { el, id } = item;
    el.dataset.canDrag = "true";
    el.dataset.id = id;
  });
  return dragList;
}

export function mountdragList(config: Config) {
  const normalizedConfig = normalizeConfig(config);
  const container = normalizedConfig.container;
  const rawList = container.children;
  let activeItem = null;
  let initOnStartDrag = false;
  let dragOffsetMove = {
    x: 0,
    y: 0,
  };
  let willSwapEl = null;
  let swapGap = 0;
  let processingDragResult = false;
  let dragging = false;

  handleEvents(container);
  const dragList = createdragListByRaw(rawList, normalizedConfig);

  function handleEvents(container: HTMLElement) {
    // 点下去，开始拖拽，标记拖拽元素
    container.addEventListener("mousedown", dragStartHandler);
    /// 开始移动了，这时候有两个元素需要关注
    // 1. 拖拽元素，需要跟随鼠标改变样式，脱离文档流？
    // 2. 触碰元素，需要跟拖拽元素交换位置，显然这需要用 translate 实现
    container.addEventListener("mousemove", dragHandler);

    // 鼠标弹起来了，说明拖拽结束
    container.addEventListener("mouseup", dragEndHandler);

    container.addEventListener("mouseleave", dragEndHandler);
  }

  function dragStartHandler(e: MouseEvent) {
    if (processingDragResult) {
      return;
    }
    const el = e.target as HTMLElement;
    if (isDraggable(el)) {
      const _activeItem = dragList.find((item) => item.id === el.dataset.id);
      if (!_activeItem.disabled) {
        activeItem = _activeItem;
      }
    }
  }

  function dragHandler(e: MouseEvent) {
    if (!activeItem || processingDragResult) {
      return;
    }
    if (!initOnStartDrag) {
      dragging = true;
      onDragMoveStart(activeItem, dragList, e, normalizedConfig);
      initOnStartDrag = true;
    } else {
      onDragMoving(activeItem, dragList, e);
    }
  }

  async function dragEndHandler() {
    if (processingDragResult || !activeItem) {
      return;
    }

    if (dragging) {
      processingDragResult = true;
      try {
        await processDragResult(activeItem, willSwapEl, container);
      } catch (error) {
        throw new Error("Something wrong in the drag end progress: " + error);
      }
      processingDragResult = false;
    }

    clear(normalizedConfig);
  }
  function initDragData(activeItem: DraggedItem, e: MouseEvent) {
    dragOffsetMove = {
      x: e.pageX,
      y: e.pageY,
    };
    swapGap = activeItem.el.offsetHeight;
  }

  function onDragMoveStart(
    activeItem: DraggedItem,
    dragList = [],
    e: MouseEvent,
    config: Config
  ) {
    initDragData(activeItem, e);
    initListData(activeItem, dragList, swapGap, config);
  }

  function onDragMoving(
    activeItem: DraggedItem,
    dragList: DraggedItem[],
    e: MouseEvent
  ) {
    const { x, y } = dragOffsetMove;
    const { el, translate } = activeItem;
    const result = {
      x: e.pageX - x,
      y: e.pageY - y,
    };
    if (result.y - translate.y > 0) {
      activeItem.moveDirection = MoveDirection.PositiveY;
    }
    if (result.y - translate.y < 0) {
      activeItem.moveDirection = MoveDirection.NegativeY;
    }
    // ??
    if (result.y - translate.y === 0) {
      // throw new Error("Direction is imposibble");
    }
    translate.y = result.y;
    translate.x = result.x;

    el.style.transform = `translate(0, ${translate.y}px)`;
    const processResult = processSwap(activeItem, dragList, swapGap);
    if (processResult) {
      willSwapEl = processResult;
    }
  }

  function clear(config: Config) {
    dragList.forEach((item) => {
      item.el.setAttribute("style", "");
    });
    // - config
    activeItem.el.classList.remove(config.activeClassName);
    dragOffsetMove = {
      x: 0,
      y: 0,
    };
    activeItem = null;
    initOnStartDrag = false;
    willSwapEl = null;
    processingDragResult = false;
    dragging = false;
  }
}

function initListData(
  activeItem: DraggedItem,
  dragList: DraggedItem[],
  swapGap: number,
  config: Pick<Config, "activeClassName" | "activeStyle">
) {
  // 保证 元素顺序和 index 保持一致
  dragList.sort((a, b) => (a.index < b.index ? -1 : 1));

  // 初始化每个元素的位置
  dragList.forEach((item) => {
    const {
      el: { offsetLeft, offsetTop },
      position,
    } = item;

    position.x = offsetLeft;
    position.y = offsetTop;
  });

  // 初始化每个元素的样式
  dragList.forEach((item) => {
    const { el, index, translate, id } = item;
    const { offsetLeft, offsetTop } = el;

    // 处理非拖拽元素
    if (id !== activeItem.id) {
      const translateY = index > activeItem.index ? swapGap : 0;
      translate.y = translateY;
      el.style.transform = `translate(0, ${translateY}px)`;
    }
    // 处理拖拽的元素
    if (id === activeItem.id) {
      // - config
      config.activeClassName && el.classList.add(config.activeClassName);
      // z-index 可以被覆盖
      el.style.zIndex = "1";
      config.activeStyle && el.setAttribute("style", config.activeStyle);
      // 以下的样式是必须的~
      el.style.position = "fixed";
      el.style.top = ` ${offsetTop}px`;
      el.style.left = ` ${offsetLeft}px`;
    }
  });
}


