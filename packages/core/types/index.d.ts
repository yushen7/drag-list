declare const enum MoveDirection {
  None = '',
  PositiveY = '+y',
  NegativeY = '-y',
}
interface DraggedItem {
  id: string
  el: HTMLElement
  disabled?: boolean
  index: number
  translate: {
    x: number
    y: number
  }
  moveDirection: MoveDirection
  swapDirection: MoveDirection
  position: {
    x: number
    y: number
  }
}
declare enum LayoutMode {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}
interface ConfigItem {
  disabled?: boolean
  content?: string
}
interface Config {
  container: string | HTMLElement
  onSwap: (
    changedItemIndexInfo: {
      oldIndex: number
      newIndex: number
    },
    indexes: number[]
  ) => void
  onSwapEnd: (
    changedItemIndexInfo: {
      oldIndex: number
      newIndex: number
    },
    indexes: number[]
  ) => void
  items: ConfigItem[]
  layoutMode?: LayoutMode
  activeClassName?: string
  activeStyle?: string
}
interface NormalizedConfig extends Config {
  container: HTMLElement
}

export declare function mountDragList(config: Partial<Config>): void

export { Config, DraggedItem, MoveDirection, NormalizedConfig }
