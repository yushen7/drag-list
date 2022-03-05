export const enum MoveDirection {
  None = '',
  PositiveY = '+y',
  NegativeY = '-y'
}

export interface DraggedItem {
  id: string;
  /** dom 元素 */
  el: HTMLElement;
  /** 是否禁用 */
  disabled?: boolean;
  index: number;
  translate: {
    x: number;
    y: number;
  },
  moveDirection: MoveDirection;
  swapDirection: MoveDirection;
  position: {
    x: number;
    y: number
  }
}
enum LayoutMode {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

export interface Config {
  /** 挂载的元素 */
  container: string | HTMLElement;
  /** 发生交换触发的回调 */
  onSwap: (indexes: number[], changedIndexes: number[]) => void;
  /** 要渲染的元素们 */
  items: DraggedItem[];
  /** 方向 */
  layoutMode?: LayoutMode;
  /** 拖拽中的类名 */
  activeClassName?: string;
  /** 拖拽中的样式 */
  activeStyle?: string;
}

export interface NormalizedConfig extends Config {
  container: HTMLElement;
}
