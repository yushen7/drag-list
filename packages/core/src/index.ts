import { isDraggable } from "./helpers";
import { processDragResult, processSwap } from "./interations";
import { normalizeConfig } from "./helpers/config";
import { Config, DraggedItem, MoveDirection } from "./types/index";

function createdragListByRaw(list: HTMLCollection) {
  const toArr = [...(list as any)];
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
  }));
  dragList.forEach((item) => {
    const { el, id } = item;
    el.dataset.canDrag = "true";
    el.dataset.id = id;
  });
  return dragList;
}

export function mountdragList(config: Config) {
  const normalizedConfig = normalizeConfig();
  const container = normalizedConfig.container;
  const rawList = container.children;
  let draggedSrc = null;
  let initOnStartDrag = false;
  let dragOffsetMove = {
    x: 0,
    y: 0,
  };
  let willSwapEl = null;
  let swapGap = 0;
  let processingDragResult = false;
  handleEvents(container);
  const dragList = createdragListByRaw(rawList);

  function handleEvents(container: HTMLElement) {
    // 点下去，开始拖拽，标记拖拽元素
    container.addEventListener("mousedown", dragStartHandler);
    /// 开始移动了，这时候有两个元素需要关注
    // 1. 拖拽元素，需要跟随鼠标改变样式，脱离文档流？
    // 2. 触碰元素，需要跟拖拽元素交换位置，显然这需要用 translate 实现
    container.addEventListener("mousemove", dragHandler);

    // 鼠标弹起来了，说明拖拽结束
    container.addEventListener("mouseup", dragEndHandler);

    container.addEventListener('mouseleave', dragEndHandler);
  }

  function dragStartHandler(e: MouseEvent) {
    if (processingDragResult) {
      return;
    }
    const el = e.target as HTMLElement;
    if (isDraggable(el)) {
      draggedSrc = dragList.find((item) => item.id === el.dataset.id);
    }
    // console.log("mousedown -> ", e.target.dataset.index);
  }

  function dragHandler(e: MouseEvent) {
    if (!draggedSrc || processingDragResult) {
      return;
    }
    if (!initOnStartDrag) {
      onDragMoveStart(draggedSrc, dragList, e);
      initOnStartDrag = true;
    } else {
      onDragMoving(draggedSrc, dragList, e);
    }
  }

  async function dragEndHandler(e: MouseEvent) {
    if (processingDragResult || !draggedSrc) {
      return;
    }
    processingDragResult = true;
    try {
      await processDragResult(draggedSrc, willSwapEl, container);
    } catch (error) {
      throw new Error("Something wrong in the drag end progress: " + error);
    }
    processingDragResult = false;
    clear();
  }

  function onDragMoveStart(draggedSrc: DraggedItem, dragList = [], e) {
    initDragData(draggedSrc, e);
    initListData(draggedSrc, dragList, swapGap);
  }

  function initDragData(draggedSrc: DraggedItem, e: MouseEvent) {
    dragOffsetMove = {
      x: e.pageX,
      y: e.pageY,
    };
    swapGap = draggedSrc.el.offsetHeight;
  }

  function onDragMoving(
    draggedSrc: DraggedItem,
    dragList: DraggedItem[],
    e: MouseEvent
  ) {
    const { x, y } = dragOffsetMove;
    const { el, translate } = draggedSrc;
    const result = {
      x: e.pageX - x,
      y: e.pageY - y,
    };
    if (result.y - translate.y > 0) {
      draggedSrc.moveDirection = MoveDirection.PositiveY;
    }
    if (result.y - translate.y < 0) {
      draggedSrc.moveDirection = MoveDirection.NegativeY;
    }
    // ??
    if (result.y - translate.y === 0) {
      // throw new Error("Direction is imposibble");
    }
    translate.y = result.y;
    translate.x = result.x;

    el.style.transform = `translate(0, ${translate.y}px)`;
    const processResult = processSwap(draggedSrc, dragList, swapGap);
    if (processResult) {
      willSwapEl = processResult;
    }
  }

  function clear() {
    dragList.forEach((item) => {
      item.el.setAttribute("style", "");
    });
    dragOffsetMove = {
      x: 0,
      y: 0,
    };
    draggedSrc = null;
    initOnStartDrag = false;
    willSwapEl = null;
    processingDragResult = false;
  }
}

function initListData(
  draggedSrc: DraggedItem,
  dragList: DraggedItem[],
  swapGap: number
) {
  const { el } = draggedSrc;
  console.log(dragList,' draglist')
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
    if (id !== draggedSrc.id) {
      const translateY = index > draggedSrc.index ? swapGap : 0;
      translate.y = translateY;
      el.style.transform = `translate(0, ${translateY}px)`;
    }
    // 处理拖拽的元素
    if (id === draggedSrc.id) {
      el.style.position = "fixed";
      el.style.top = ` ${offsetTop}px`;
      el.style.left = ` ${offsetLeft}px`;
      el.style.opacity = "0.8";
      el.style.zIndex = "1";
    }
  });
}
