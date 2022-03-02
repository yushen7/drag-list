import { insertAfter } from "../utils";

export function insertdraggedSrc(
  container: HTMLElement,
  draggedSrc,
  willSwapEl
) {
  const { el: src, swapDirection } = draggedSrc,
    { el: target } = willSwapEl;
  if (swapDirection === "-y") {
    container.insertBefore(src, target);
  }
  if (swapDirection === "+y") {
    insertAfter(container, src, target);
  }

  if (swapDirection === "") {
  }
}

export function getSwapEl(draggedSrc, dragList) {
  const { x, y } = draggedSrc.translate;
  const { moveDirection } = draggedSrc;
  for (const item of dragList) {
    const {
      translate: { y: nextY },
      index,
      id,
      el,
    } = item;
    const threshold = el.offsetTop + nextY;
    const targetHeight = el.offsetHeight / 2;
    const offsetTranslate = draggedSrc.el.offsetTop + y;
    if (draggedSrc.id !== id) {
      if (moveDirection === "+y") {
        if (offsetTranslate > threshold) {
          continue;
        }
        if (offsetTranslate + targetHeight - threshold >= 0) {
          return item;
        }
      }
      if (moveDirection === "-y") {
        // debugger;
        if (offsetTranslate < threshold) {
          continue;
        }
        if (offsetTranslate - targetHeight - threshold <= 0) {
          return item;
        }
      }
    }
  }
  return null;
}

export function isDraggable(el: HTMLElement) {
  return el.classList.contains("item") && Boolean(el.dataset.canDrag);
}
