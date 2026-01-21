import { _decorator, Component, Node, Sprite, Color, UITransform, EventTouch } from 'cc';
import { CellType } from '../Enums';
import { BoardPosition } from '../Types';

const { ccclass, property } = _decorator;

/**
 * Компонент ячейки игрового поля
 */
@ccclass('Cell')
export class Cell extends Component {

    @property
    isGenerator: boolean = false;

    private _type: CellType = CellType.Normal;
    private _position: BoardPosition = { row: 0, col: 0 };
    private _chip: Node | null = null;
    private _isEvenCell: boolean = false;

    // Callback для обработки клика
    public onCellClick: ((cell: Cell) => void) | null = null;

    // --- Цвета ---
    private static readonly COLOR_WHITE = new Color(240, 240, 240);
    private static readonly COLOR_GRAY = new Color(200, 200, 200);
    private static readonly COLOR_BLOCKED = new Color(100, 100, 100);

    // --- Getters/Setters ---

    get cellType(): CellType {
        return this._type;
    }

    get position(): BoardPosition {
        return this._position;
    }

    get row(): number {
        return this._position.row;
    }

    get col(): number {
        return this._position.col;
    }

    get chip(): Node | null {
        return this._chip;
    }

    set chip(value: Node | null) {
        this._chip = value;
    }

    get hasChip(): boolean {
        return this._chip !== null;
    }

    get canHoldChip(): boolean {
        return this._type === CellType.Normal || this._type === CellType.Generator;
    }

    // --- Lifecycle ---

    onLoad(): void {
        // Используем Node.EventType для событий на ноде
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    // --- Public Methods ---

    /**
     * Инициализация ячейки
     */
    initialize(position: BoardPosition, type: CellType = CellType.Normal): void {
        this._position = position;
        this._type = type;
        this._isEvenCell = (position.row + position.col) % 2 === 0;
        this.updateVisual();
    }

    /**
     * Установка типа ячейки
     */
    setType(type: CellType): void {
        this._type = type;
        this.updateVisual();
    }

    /**
     * Удаление фишки из ячейки
     */
    removeChip(): Node | null {
        const chip = this._chip;
        this._chip = null;
        return chip;
    }

    /**
     * Установка фишки в ячейку
     */
    setChip(chip: Node): void {
        this._chip = chip;
    }

    // --- Private Methods ---

    private onTouchStart(event: EventTouch): void {
        console.log(`Cell clicked: ${this._position.row}, ${this._position.col}`);
        
        if (this._type === CellType.Blocked) {
            console.log('Cell is blocked');
            return;
        }
        if (!this._chip) {
            console.log('Cell has no chip');
            return;
        }

        if (this.onCellClick) {
            this.onCellClick(this);
        } else {
            console.log('onCellClick callback not set');
        }
        
        // Останавливаем распространение события
        event.propagationStopped = true;
    }

    private updateVisual(): void {
        const sprite = this.node.getComponent(Sprite);
        if (!sprite) return;

        switch (this._type) {
            case CellType.Blocked:
                sprite.color = Cell.COLOR_BLOCKED;
                break;
            case CellType.Normal:
            case CellType.Generator:
                sprite.color = this._isEvenCell ? Cell.COLOR_WHITE : Cell.COLOR_GRAY;
                break;
        }
    }
}
