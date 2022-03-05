import { DraggedItem, MoveDirection } from './types/index';
import { getSwapItem, insertActiveItem } from "./helpers";

export function processSwap(
  activeItem: DraggedItem,
  dragList: DraggedItem[],
  swapGap = activeItem.el.offsetHeight
) {
  const swapItem = getSwapItem(activeItem, dragList);
  if (!swapItem) return null;

  {
    const { translate: swapTranslate } = swapItem;
    if (activeItem.moveDirection === MoveDirection.PositiveY) swapTranslate.y -= swapGap;
    if (activeItem.moveDirection === MoveDirection.NegativeY) swapTranslate.y += swapGap;
    swapItem.el.style.transition = '.2s ease-out';
    swapItem.el.style.transform = `translate(0, ${swapTranslate.y}px)`;
  }

  {
    const temp = activeItem.index;
    activeItem.index = swapItem.index;
    swapItem.index = temp;
  }

  {
    const temp = activeItem.position;
    activeItem.position = swapItem.position;
    swapItem.position = temp;
  }

  {
    activeItem.swapDirection = activeItem.moveDirection;
  }

  return swapItem;
}

export async function processDragResult(activeItem: DraggedItem, willswapItem: DraggedItem, container: HTMLElement) {
  return new Promise((resolve, reject) => {
    const { el: draggedEl } = activeItem;

    const cb = () => {
      if (willswapItem) {
        insertActiveItem(container, activeItem, willswapItem);
      }
      draggedEl.removeEventListener("transitionend", cb);
      resolve("done");
    };

    draggedEl.addEventListener("transitionend", cb);

    {
      const {
        position: { x: targetX, y: targetY },
      } = activeItem;

      const targetTranslate = {
        x: targetX - draggedEl.offsetLeft,
        y: targetY - draggedEl.offsetTop,
      };
      draggedEl.style.transition = ".1s ease-out";
      draggedEl.style.transform = `translate(${targetTranslate.x}px, ${targetTranslate.y}px)`;
    }
  });
}
