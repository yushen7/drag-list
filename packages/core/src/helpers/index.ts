import { DraggedItem } from '../types';

export {
  insertActiveItem,
  getSwapItem,
  isDraggable
} from './draggedItem'


function initListData(
  activeItem: DraggedItem,
  dragList: DraggedItem[],
  swapGap: number
) {
  const { el } = activeItem;
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
    const { el, index, translate, id, position } = item;
    const { offsetLeft, offsetTop } = el;

    // 处理非拖拽元素
    if (id !== activeItem.id) {
      const translateY = index > activeItem.index ? swapGap : 0;
      translate.y = translateY;
      el.style.transform = `translate(0, ${translateY}px)`;
    }
    // 处理拖拽的元素
    if (id === activeItem.id) {
      el.style.position = "fixed";
      el.style.top = ` ${offsetTop}px`;
      el.style.left = ` ${offsetLeft}px`;
      el.style.opacity = "0.8";
      el.style.zIndex = "1";
    }
  });
}
