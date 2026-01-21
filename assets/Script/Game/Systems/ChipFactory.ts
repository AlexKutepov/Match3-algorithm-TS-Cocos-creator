import { _decorator, Component, Node, Prefab, instantiate, UITransform, Vec3 } from 'cc';
import { BoardPosition, GameConstants } from '../Types';
import { BoardUtils } from '../Utils/BoardUtils';
import { Chip } from '../Components/Chip';

const { ccclass, property } = _decorator;

/**
 * Фабрика фишек с пулом объектов
 * Переиспользует уничтоженные фишки вместо создания новых
 */
@ccclass('ChipFactory')
export class ChipFactory extends Component {

    @property(Prefab)
    chipPrefab: Prefab | null = null;

    @property
    poolSize: number = 64;

    @property
    chipSize: number = GameConstants.DEFAULT_CELL_SIZE - GameConstants.CHIP_PADDING;

    @property
    colorCount: number = 6;

    private pool: Node[] = [];
    private activeChips: Set<Node> = new Set();

    // --- Lifecycle ---

    onLoad(): void {
        this.warmupPool();
    }

    // --- Public Methods ---

    /**
     * Создание или получение фишки из пула
     */
    getChip(parent: Node, worldPos: Vec3): Node | null {
        let chipNode = this.pool.pop();

        if (!chipNode) {
            chipNode = this.createChipNode();
            if (!chipNode) return null;
        }

        this.setupChip(chipNode, parent, worldPos);
        this.activeChips.add(chipNode);

        return chipNode;
    }

    /**
     * Создание фишки в позиции на доске
     */
    createChipAtPosition(
        parent: Node,
        pos: BoardPosition,
        originX: number,
        originY: number,
        cellSize: number
    ): Node | null {
        const worldPos = BoardUtils.boardToWorld(pos, originX, originY, cellSize);
        return this.getChip(parent, new Vec3(worldPos.x, worldPos.y, 0));
    }

    /**
     * Создание фишки выше доски для анимации падения
     */
    createChipAboveBoard(
        parent: Node,
        col: number,
        originX: number,
        originY: number,
        cellSize: number,
        offsetRows: number = 1
    ): Node | null {
        const x = originX + col * cellSize;
        const y = originY + offsetRows * cellSize;
        return this.getChip(parent, new Vec3(x, y, 0));
    }

    /**
     * Возврат фишки в пул
     */
    recycleChip(chipNode: Node): void {
        if (!this.activeChips.has(chipNode)) return;

        this.activeChips.delete(chipNode);

        const chip = chipNode.getComponent(Chip);
        if (chip) {
            chip.reset();
        }

        chipNode.removeFromParent();
        chipNode.active = false;
        this.pool.push(chipNode);
    }

    /**
     * Уничтожение фишки с анимацией и возвратом в пул
     */
    async destroyChipAnimated(chipNode: Node): Promise<void> {
        const chip = chipNode.getComponent(Chip);
        if (!chip) {
            this.recycleChip(chipNode);
            return;
        }

        await chip.playDestroyAnimation();
        this.recycleChip(chipNode);
    }

    /**
     * Возврат всех активных фишек в пул
     */
    recycleAll(): void {
        const chips = Array.from(this.activeChips);
        for (let i = 0; i < chips.length; i++) {
            this.recycleChip(chips[i]);
        }
    }

    /**
     * Получение количества активных фишек
     */
    get activeCount(): number {
        return this.activeChips.size;
    }

    /**
     * Получение количества фишек в пуле
     */
    get poolCount(): number {
        return this.pool.length;
    }

    // --- Private Methods ---

    private warmupPool(): void {
        for (let i = 0; i < this.poolSize; i++) {
            const chipNode = this.createChipNode();
            if (chipNode) {
                chipNode.active = false;
                this.pool.push(chipNode);
            }
        }
    }

    private createChipNode(): Node | null {
        if (!this.chipPrefab) {
            console.error('ChipFactory: chipPrefab is not set');
            return null;
        }

        const chipNode = instantiate(this.chipPrefab);
        return chipNode;
    }

    private setupChip(chipNode: Node, parent: Node, worldPos: Vec3): void {
        chipNode.setParent(parent);
        chipNode.setPosition(worldPos);
        chipNode.active = true;

        // ВАЖНО: Сбрасываем scale в 1 ПЕРЕД установкой размера
        chipNode.setScale(1, 1, 1);

        // Установка размера
        const uiTransform = chipNode.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.setContentSize(this.chipSize, this.chipSize);
        }

        // Инициализация компонента
        const chip = chipNode.getComponent(Chip);
        if (chip) {
            chip.reset();
            chip.initialize(this.colorCount);
        }
    }

    protected onDestroy(): void {
        // Очистка пула
        for (let i = 0; i < this.pool.length; i++) {
            this.pool[i].destroy();
        }
        this.pool = [];

        // Очистка активных
        const activeArray = Array.from(this.activeChips);
        for (let i = 0; i < activeArray.length; i++) {
            activeArray[i].destroy();
        }
        this.activeChips.clear();
    }
}
