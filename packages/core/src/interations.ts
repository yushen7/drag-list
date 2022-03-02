import { getSwapEl, insertdraggedSrc } from "./helpers";

/**
 *
 * @param {*} draggedSrc
 * @param {*} dragList
 * @param {*} swapGap
 * @returns
 */
export function processSwap(
  draggedSrc,
  dragList,
  swapGap = draggedSrc.el.offsetHeight
) {
  const swapEl = getSwapEl(draggedSrc, dragList);
  if (!swapEl) return null;

  {
    const { translate: swapTranslate } = swapEl;
    if (draggedSrc.moveDirection === "+y") swapTranslate.y -= swapGap;
    if (draggedSrc.moveDirection === "-y") swapTranslate.y += swapGap;
    swapEl.el.style = `transition: .2s ease-out; transform: translate(0, ${swapTranslate.y}px)`;
  }

  {
    const temp = draggedSrc.index;
    draggedSrc.index = swapEl.index;
    swapEl.index = temp;
  }

  {
    const temp = draggedSrc.position;
    draggedSrc.position = swapEl.position;
    swapEl.position = temp;
  }

  {
    draggedSrc.swapDirection = draggedSrc.moveDirection;
  }

  return swapEl;
}

export async function processDragResult(draggedSrc, willSwapEl, container) {
  return new Promise((resolve, reject) => {
    const { el: draggedEl } = draggedSrc;

    const cb = () => {
      if (willSwapEl) {
        insertdraggedSrc(container, draggedSrc, willSwapEl);
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
      // animating = true;
    }
  });
}
