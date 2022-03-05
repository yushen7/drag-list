import { DraggedItem, MoveDirection } from './../types/index';
import { insertAfter } from "../utils";

export function insertActiveItem(
  container: HTMLElement,
  activeItem: DraggedItem,
  willSwapEl: DraggedItem
) {
  const { el: src, swapDirection } = activeItem,
    { el: target } = willSwapEl;
  if (swapDirection === MoveDirection.NegativeY) {
    container.insertBefore(src, target);
  }
  if (swapDirection === MoveDirection.PositiveY) {
    insertAfter(container, src, target);
  }

  if (swapDirection === MoveDirection.None) {
    // 什么也不做
  }
}

export function getSwapItem(activeItem: DraggedItem, dragList: DraggedItem[]) {
  const { y } = activeItem.translate;
  const { moveDirection } = activeItem;
  for (const item of dragList) {
    const {
      translate: { y: nextY },
      id,
      el,
    } = item;
    const threshold = el.offsetTop + nextY;
    const targetHeight = el.offsetHeight / 2;
    const offsetTranslate = activeItem.el.offsetTop + y;
    if (activeItem.id !== id) {
      if (moveDirection === MoveDirection.PositiveY) {
        if (offsetTranslate > threshold) {
          continue;
        }
        if (offsetTranslate + targetHeight - threshold >= 0) {
          return item;
        }
      }
      if (moveDirection === MoveDirection.NegativeY) {
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
