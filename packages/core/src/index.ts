import { insertdraggedSrc, getSwapEl, isDraggable } from "./helpers";
import { processDragResult, processSwap } from "./interations";
function main() {
  const container = document.querySelector("#container");
  const list = [...document.querySelectorAll(".item") as any];
  const draglist = list.map((item, index) => ({
    el: item,
    id: `${index}`,
    index,
    translate: {
      x: 0,
      y: 0,
    },
    moveDirection: "",
    swapDirection: "",
    position: {
      x: 0,
      y: 0,
    },
  }));
  let draggedSrc = null;
  let initOnStartDrag = false;
  let dragOffsetMove = {
    x: 0,
    y: 0
  };
  let willSwapEl = null;
  let swapGap = 0;
  let processingDragResult = false;

  // 点下去，开始拖拽，标记拖拽元素
  container.addEventListener("mousedown", dragStartHandler);

  /// 开始移动了，这时候有两个元素需要关注
  // 1. 拖拽元素，需要跟随鼠标改变样式，脱离文档流？
  // 2. 触碰元素，需要跟拖拽元素交换位置，显然这需要用 translate 实现
  container.addEventListener("mousemove", dragHandler);

  // 鼠标弹起来了，说明拖拽结束
  container.addEventListener("mouseup", dragEndHandler);

  draglist.forEach((item) => {
    const { el, id } = item;
    el.dataset.canDrag = true;
    el.dataset.id = id;
  });

  function dragStartHandler(e) {
    if (processingDragResult) {
      return;
    }
    init(e.target);
    // console.log("mousedown -> ", e.target.dataset.index);
  }

  function dragHandler(e) {
    if (!draggedSrc || processingDragResult) {
      return;
    }
    if (!initOnStartDrag) {
      onDragMoveStart(draggedSrc, draglist, e);
      initOnStartDrag = true;
    } else {
      onDragMoving(draggedSrc, draglist, e);
    }
  }

  async function dragEndHandler(e) {
    if (processingDragResult) {
      return;
    }
    processingDragResult = true;
    await processDragResult(draggedSrc, willSwapEl, container);
    processingDragResult = false;
    clear();
  }

  function onDragMoveStart(draggedSrc, dragList = [], e) {
    initElData(draggedSrc, dragList);
    initDragData(draggedSrc, e);
  }

  function initElData(draggedSrc, dragList) {
    const { el } = draggedSrc;
    dragList.sort((a, b) => a.index < b.index);

    let sumOffsetY = el.offsetHeight;
    dragList.forEach((item) => {
      const {
        el: { offsetLeft, offsetTop },
        position,
      } = item;

      position.x = offsetLeft;
      position.y = offsetTop;
    });
    dragList.forEach((item) => {
      const { el, index, translate, id, position } = item;
      const { offsetLeft, offsetTop } = el;

      // 处理非拖拽元素
      if (id !== draggedSrc.id) {
        const translateY = index > draggedSrc.index ? sumOffsetY : 0;
        let undraggedSrcStyle = "";
        undraggedSrcStyle += `transform: translate(0, ${translateY}px)`;
        translate.y = translateY;
        el.style = undraggedSrcStyle;
      }
      // 处理拖拽的元素
      if (id === draggedSrc.id) {
        let draggedSrcStyle;
        draggedSrcStyle = "position: fixed;";
        draggedSrcStyle += `top: ${offsetTop}px;`;
        draggedSrcStyle += `left: ${offsetLeft}px;`;
        draggedSrcStyle += "opacity: 0.8;";
        draggedSrcStyle += "z-index: 1;";
        el.style = draggedSrcStyle;
      }
    });
  }

  function initDragData(draggedSrc, e) {
    dragOffsetMove = {
      x: e.pageX,
      y: e.pageY,
    };
    swapGap = draggedSrc.el.offsetHeight;
  }

  function onDragMoving(draggedSrc, dragList, e) {
    const { x, y } = dragOffsetMove;
    const { el, translate } = draggedSrc;
    const result = {
      x: e.pageX - x,
      y: e.pageY - y,
    };
    if (result.y - translate.y > 0) {
      draggedSrc.moveDirection = "+y";
    }
    if (result.y - translate.y < 0) {
      draggedSrc.moveDirection = "-y";
    }
    // ??
    if (result.y - translate.y === 0) {
      draggedSrc.moveDirection = "";
    }
    translate.y = result.y;
    translate.x = result.x;

    el.style.transform = `translate(0, ${translate.y}px)`;
    const processResult = processSwap(draggedSrc, draglist, swapGap);
    if (processResult) {
      willSwapEl = processResult;
    }
  }

  function init(el: HTMLElement) {
    if (isDraggable(el)) {
      draggedSrc = draglist.find((item) => item.id === el.dataset.id);
    }
  }
  function clear() {
    draglist.forEach((item) => {
      item.el.style = "";
    });
    draggedSrc = null;
    initOnStartDrag = false;
    willSwapEl = null;
    processingDragResult = false;
  }
}

const config = {};

main();
