import { DraggedItem, MoveDirection } from "./../types/index";
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
  const { index: activeIndex } =activeItem
  const { moveDirection } = activeItem;
  const activeOffset = activeItem.el.offsetTop + y;
  for (const item of dragList) {
    const {
      translate: { y: nextY },
      id,
      el,
      index
    } = item;

    const threshold = el.offsetTop + nextY;
    const checkGap = el.offsetHeight / 1.5;
    let checkPoint: number;
    if (activeItem.id !== id) {
      // - config
      if (item.disabled) {
        continue
      }
      if (moveDirection === MoveDirection.PositiveY) {
        checkPoint = activeOffset + checkGap;
        if (activeIndex > index) {
          continue;
        }
        if (checkPoint >= threshold) {
          return item;
        } 
      }
      if (moveDirection === MoveDirection.NegativeY) {
        checkPoint = activeOffset - checkGap;
        if (activeIndex < index) {
          continue;
        }
        if (checkPoint <= threshold) {
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
