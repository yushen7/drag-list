import { DraggedItem } from './types/index';
import { getSwapItem, insertdraggedSrc } from "./helpers";

/**
 *
 * @param {*} draggedSrc
 * @param {*} dragList
 * @param {*} swapGap
 * @returns
 */
export function processSwap(
  draggedSrc: DraggedItem,
  dragList: DraggedItem[],
  swapGap = draggedSrc.el.offsetHeight
) {
  const swapItem = getSwapItem(draggedSrc, dragList);
  if (!swapItem) return null;

  {
    const { translate: swapTranslate } = swapItem;
    if (draggedSrc.moveDirection === "+y") swapTranslate.y -= swapGap;
    if (draggedSrc.moveDirection === "-y") swapTranslate.y += swapGap;
    swapItem.el.style.transition = '.2s ease-out';
    swapItem.el.style.transform = `translate(0, ${swapTranslate.y}px)`;
  }

  {
    const temp = draggedSrc.index;
    draggedSrc.index = swapItem.index;
    swapItem.index = temp;
  }

  {
    const temp = draggedSrc.position;
    draggedSrc.position = swapItem.position;
    swapItem.position = temp;
  }

  {
    draggedSrc.swapDirection = draggedSrc.moveDirection;
  }

  return swapItem;
}

export async function processDragResult(draggedSrc: DraggedItem, willswapItem: DraggedItem, container: HTMLElement) {
  return new Promise((resolve, reject) => {
    const { el: draggedEl } = draggedSrc;

    const cb = () => {
      if (willswapItem) {
        insertdraggedSrc(container, draggedSrc, willswapItem);
      }
      draggedEl.removeEventListener("transitionend", cb);
      resolve("done");
    };

    draggedEl.addEventListener("transitionend", cb);

    {
      const {
        position: { x: px, y: py },
      } = draggedSrc;
      const targetTranslate = {
        x: px - draggedEl.offsetLeft,
        y: py - draggedEl.offsetTop,
      };
      draggedEl.style.transition = ".1s ease-out";
      draggedEl.style.transform = `translate(${targetTranslate.x}px, ${targetTranslate.y}px)`;
    }
  });
}
