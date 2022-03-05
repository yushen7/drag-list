declare const enum MoveDirection {
    None = "",
    PositiveY = "+y",
    NegativeY = "-y"
}
interface DraggedItem {
    id: string;
    el: HTMLElement;
    disabled?: boolean;
    index: number;
    translate: {
        x: number;
        y: number;
    };
    moveDirection: MoveDirection;
    swapDirection: MoveDirection;
    position: {
        x: number;
        y: number;
    };
}
declare enum LayoutMode {
    Horizontal = "horizontal",
    Vertical = "vertical"
}
interface Config {
    container: string | HTMLElement;
    onSwap: (indexes: number[], changedIndexes: number[]) => void;
    items: DraggedItem[];
    layoutMode?: LayoutMode;
    activeClassName?: string;
    activeStyle?: string;
}
interface NormalizedConfig extends Config {
    container: HTMLElement;
}

export { Config, DraggedItem, MoveDirection, NormalizedConfig };
