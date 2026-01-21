import { _decorator, Component, Node, Prefab, instantiate, UITransform, Vec3, EventTarget, CCString } from 'cc';
import { GameState, CellType, ChipType, ChipColor } from '../Enums';
import { BoardPosition, BoardConfig, MatchResult, GameConstants } from '../Types';
import { BoardUtils } from '../Utils/BoardUtils';
import { Board } from '../Core/Board';
import { Cell } from '../Components/Cell';
import { Chip } from '../Components/Chip';
import { MatchDetector } from '../Systems/MatchDetector';
import { BoardPhysics } from '../Systems/BoardPhysics';
import { BonusExecutor } from '../Systems/BonusExecutor';
import { ChipFactory } from '../Systems/ChipFactory';

const { ccclass, property } = _decorator;

/**
 * Глобальные события игры
 */
export const GameEvents = new EventTarget();

export const GameEventTypes = {
    SCORE_CHANGED: 'score-changed',
    MOVES_CHANGED: 'moves-changed',
    GAME_OVER: 'game-over',
    GAME_WON: 'game-won',
    STATE_CHANGED: 'state-changed'
} as const;

/**
 * Главный контроллер игры Match-3
 */
@ccclass('GameController')
export class GameController extends Component {

    // --- Editor Properties ---

    @property(Prefab)
    cellPrefab: Prefab | null = null;

    @property(ChipFactory)
    chipFactory: ChipFactory | null = null;

    @property
    rows: number = GameConstants.DEFAULT_ROWS;

    @property
    cols: number = GameConstants.DEFAULT_COLS;

    @property
    cellSize: number = GameConstants.DEFAULT_CELL_SIZE;

    @property
    originX: number = -150;

    @property
    originY: number = 250;

    @property
    maxMoves: number = 20;

    @property
    targetScore: number = 1000;

    // --- Настройки карты ---

    /**
     * Создавать случайные пустые ячейки
     */
    @property
    needRandomVoidCell: boolean = false;

    /**
     * Шанс создания пустой ячейки (1/N). 25 = 4% шанс
     */
    @property
    chanceForVoidCell: number = 25;

    /**
     * Массив заблокированных ячеек (формат: "row,col")
     * Например: ["0,0", "0,6", "6,0", "6,6"] уберёт угловые ячейки
     */
    @property([CCString])
    blockedCells: string[] = [];

    /**
     * Блокировать область ячеек (формат: "startRow,startCol,endRow,endCol")
     * Например: "0,4,4,8" заблокирует прямоугольник
     */
    @property([CCString])
    blockedAreas: string[] = [];

    // --- Private State ---

    private board!: Board;
    private matchDetector!: MatchDetector;
    private boardPhysics!: BoardPhysics;
    private bonusExecutor!: BonusExecutor;

    private _state: GameState = GameState.Idle;
    private _score: number = 0;
    private _moves: number = 0;
    private _selectedCell: Cell | null = null;

    // --- Getters ---

    get state(): GameState {
        return this._state;
    }

    get score(): number {
        return this._score;
    }

    get moves(): number {
        return this._moves;
    }

    get movesLeft(): number {
        return this.maxMoves - this._moves;
    }

    // --- Lifecycle ---

    onLoad(): void {
        this.initializeGame();
    }

    // --- Public Methods ---

    /**
     * Перезапуск игры
     */
    restart(): void {
        this.clearBoard();
        this._score = 0;
        this._moves = 0;
        this._selectedCell = null;
        this.initializeGame();
        
        GameEvents.emit(GameEventTypes.SCORE_CHANGED, this._score);
        GameEvents.emit(GameEventTypes.MOVES_CHANGED, this.movesLeft);
    }

    /**
     * Использование бустера (уничтожает одну фишку)
     */
    useBuster(pos: BoardPosition): void {
        if (this._state !== GameState.Idle) return;

        const chip = this.board.getChip(pos);
        if (!chip) return;

        this.destroyChipsAt([pos]);
        this._moves++;
        GameEvents.emit(GameEventTypes.MOVES_CHANGED, this.movesLeft);
    }

    // --- Initialization ---

    private initializeGame(): void {
        // Парсим заблокированные ячейки
        const blocked: BoardPosition[] = this.blockedCells.map(s => {
            const [row, col] = s.split(',').map(Number);
            return { row, col };
        });

        const config: BoardConfig = {
            rows: this.rows,
            cols: this.cols,
            cellSize: this.cellSize,
            originX: this.originX,
            originY: this.originY,
            chipColors: 6,
            blockedCells: blocked
        };

        this.board = new Board(config);
        this.matchDetector = new MatchDetector(this.board);
        this.boardPhysics = new BoardPhysics(this.board);
        this.bonusExecutor = new BonusExecutor(this.board);

        this.createCells();
        this.createInitialChips();

        // Начальная проверка на совпадения
        this.scheduleOnce(async () => {
            await this.processMatchesLoop();
            this.setState(GameState.Idle);
            console.log('Game ready! State = Idle');
        }, 0.1);
    }

    private createCells(): void {
        if (!this.cellPrefab) {
            console.error('GameController: cellPrefab is not set');
            return;
        }

        // Собираем все заблокированные позиции
        const blockedSet = this.buildBlockedSet();

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const pos: BoardPosition = { row, col };
                const posKey = `${row},${col}`;
                
                // Пропускаем заблокированные ячейки
                if (blockedSet.has(posKey)) {
                    continue;
                }

                // Случайные пустые ячейки
                if (this.needRandomVoidCell && this.chanceForVoidCell > 0) {
                    if (Math.floor(Math.random() * this.chanceForVoidCell) === 0) {
                        continue; // Пропускаем — это будет пустая ячейка
                    }
                }

                const worldPos = BoardUtils.boardToWorld(pos, this.originX, this.originY, this.cellSize);

                const cellNode = instantiate(this.cellPrefab);
                cellNode.setParent(this.node);
                cellNode.setPosition(worldPos.x, worldPos.y, 0);

                const uiTransform = cellNode.getComponent(UITransform);
                if (uiTransform) {
                    uiTransform.setContentSize(this.cellSize, this.cellSize);
                }

                const cell = cellNode.getComponent(Cell);
                if (cell) {
                    cell.initialize(pos);
                    cell.onCellClick = this.onCellClicked.bind(this);
                    this.board.setCell(pos, cell);
                }
            }
        }
    }

    /**
     * Собирает Set всех заблокированных позиций
     */
    private buildBlockedSet(): Set<string> {
        const blockedSet = new Set<string>();

        // Добавляем отдельные ячейки
        for (const cell of this.blockedCells) {
            blockedSet.add(cell);
        }

        // Добавляем области (формат: "startRow,startCol,endRow,endCol")
        for (const area of this.blockedAreas) {
            const parts = area.split(',').map(Number);
            if (parts.length === 4) {
                const [startRow, startCol, endRow, endCol] = parts;
                for (let row = startRow; row < endRow; row++) {
                    for (let col = startCol; col < endCol; col++) {
                        blockedSet.add(`${row},${col}`);
                    }
                }
            }
        }

        return blockedSet;
    }

    private createInitialChips(): void {
        if (!this.chipFactory) {
            console.error('GameController: chipFactory is not set');
            return;
        }

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const pos: BoardPosition = { row, col };
                const cell = this.board.getCell(pos);

                if (cell && cell.canHoldChip) {
                    this.createChipAt(pos);
                }
            }
        }
    }

    private createChipAt(pos: BoardPosition): void {
        if (!this.chipFactory) return;

        const chipNode = this.chipFactory.createChipAtPosition(
            this.node,
            pos,
            this.originX,
            this.originY,
            this.cellSize
        );

        if (chipNode) {
            this.board.placeChip(pos, chipNode);
        }
    }

    // --- Input Handling ---

    private onCellClicked(cell: Cell): void {
        console.log(`GameController.onCellClicked: ${cell.position.row}, ${cell.position.col}, state=${this._state}`);
        
        if (this._state !== GameState.Idle) {
            console.log('State is not Idle, ignoring click');
            return;
        }

        if (!this._selectedCell) {
            console.log('First selection');
            this._selectedCell = cell;
            this.highlightCell(cell, true);
            return;
        }

        if (this._selectedCell === cell) {
            console.log('Deselecting same cell');
            this.highlightCell(cell, false);
            this._selectedCell = null;
            return;
        }

        console.log(`Checking neighbors: ${this._selectedCell.position.row},${this._selectedCell.position.col} -> ${cell.position.row},${cell.position.col}`);
        
        if (BoardUtils.areNeighbors(this._selectedCell.position, cell.position)) {
            console.log('Swapping!');
            this.trySwap(this._selectedCell.position, cell.position);
        } else {
            console.log('Not neighbors');
        }

        this.highlightCell(this._selectedCell, false);
        this._selectedCell = null;
    }

    private highlightCell(cell: Cell, highlight: boolean): void {
        // Визуальное выделение ячейки
        if (cell.chip) {
            const scale = highlight ? 1.1 : 1.0;
            cell.chip.setScale(new Vec3(scale, scale, scale));
        }
    }

    /**
     * Сброс scale у всех фишек
     */
    private resetAllChipScales(): void {
        this.board.forEachChip((chip) => {
            chip.node.setScale(new Vec3(1, 1, 1));
        });
    }

    // --- Swap Logic ---

    private async trySwap(pos1: BoardPosition, pos2: BoardPosition): Promise<void> {
        this.setState(GameState.Swapping);

        // Сбрасываем выделение
        this.resetAllChipScales();

        // Анимация свапа
        await this.animateSwap(pos1, pos2);

        // Логический свап
        this.board.swapChips(pos1, pos2);

        // Проверка на совпадения
        const matches = this.matchDetector.findAllMatches();

        if (matches.length > 0) {
            this._moves++;
            GameEvents.emit(GameEventTypes.MOVES_CHANGED, this.movesLeft);
            await this.processMatchesLoop();
        } else {
            // Откат свапа
            await this.animateSwap(pos1, pos2);
            this.board.swapChips(pos1, pos2);
        }

        this.setState(GameState.Idle);
        this.checkGameEnd();
    }

    private async animateSwap(pos1: BoardPosition, pos2: BoardPosition): Promise<void> {
        const chip1 = this.board.getChip(pos1);
        const chip2 = this.board.getChip(pos2);

        if (!chip1 || !chip2) return;

        const world1 = BoardUtils.boardToWorld(pos1, this.originX, this.originY, this.cellSize);
        const world2 = BoardUtils.boardToWorld(pos2, this.originX, this.originY, this.cellSize);

        await Promise.all([
            chip1.moveTo(new Vec3(world2.x, world2.y, 0), GameConstants.SWAP_DURATION),
            chip2.moveTo(new Vec3(world1.x, world1.y, 0), GameConstants.SWAP_DURATION)
        ]);
    }

    // --- Match Processing ---

    private async processMatchesLoop(): Promise<void> {
        let hasMatches = true;

        while (hasMatches) {
            this.setState(GameState.Matching);
            hasMatches = await this.processMatches();

            if (hasMatches) {
                this.setState(GameState.Falling);
                await this.processGravity();

                this.setState(GameState.Refilling);
                await this.refillBoard();
            }
        }
    }

    private async processMatches(): Promise<boolean> {
        const matches = this.matchDetector.findAllMatches();
        if (matches.length === 0) return false;

        // Собираем позиции для уничтожения
        const destroyPositions: BoardPosition[] = [];
        const bonusCreations: { pos: BoardPosition; type: ChipType }[] = [];

        for (const match of matches) {
            console.log(`Match found: length=${match.length}, horizontal=${match.isHorizontal}`);
            
            // Определяем бонус
            const bonusType = this.matchDetector.getBonusType(match);
            if (bonusType !== ChipType.Normal) {
                console.log(`Bonus type: ${bonusType} for match length ${match.length}`);
                bonusCreations.push({
                    pos: match.positions[0],
                    type: bonusType
                });
            }

            // Проверяем бонусы в совпадении
            for (const pos of match.positions) {
                const chip = this.board.getChip(pos);
                if (chip && this.bonusExecutor.isBonus(chip)) {
                    const bonusPositions = this.bonusExecutor.getDestroyPositions(pos, chip);
                    destroyPositions.push(...bonusPositions);
                }
                destroyPositions.push(pos);
            }
        }

        // Уникальные позиции
        const uniquePositions = this.matchDetector.getUniquePositions(
            matches.map(m => ({ ...m, positions: destroyPositions }))
        );

        // Добавляем очки
        this.addScore(uniquePositions.length * 10);

        // Уничтожаем фишки
        await this.destroyChipsAt(uniquePositions);

        // Создаём бонусы
        console.log(`Bonus creations: ${bonusCreations.length}`);
        for (const bonus of bonusCreations) {
            console.log(`Creating bonus at ${bonus.pos.row},${bonus.pos.col} type=${bonus.type}`);
            const cell = this.board.getCell(bonus.pos);
            if (cell && !cell.hasChip) {
                this.createChipAt(bonus.pos);
                const chip = this.board.getChip(bonus.pos);
                if (chip) {
                    chip.setType(bonus.type);
                    console.log(`Bonus created!`);
                }
            }
        }

        return true;
    }

    private async destroyChipsAt(positions: BoardPosition[]): Promise<void> {
        if (!this.chipFactory) return;

        const animations: Promise<void>[] = [];

        for (const pos of positions) {
            const cell = this.board.getCell(pos);
            if (!cell || !cell.chip) continue;

            const chipNode = cell.removeChip();
            if (chipNode) {
                animations.push(this.chipFactory.destroyChipAnimated(chipNode));
            }
        }

        await Promise.all(animations);
    }

    // --- Gravity ---

    private async processGravity(): Promise<void> {
        let hasFalls = true;

        while (hasFalls) {
            const falls = this.boardPhysics.calculateFalls();
            const diagonalFalls = this.boardPhysics.calculateDiagonalFalls();

            const allFalls = [...falls, ...diagonalFalls];

            if (allFalls.length === 0) {
                hasFalls = false;
            } else {
                await this.boardPhysics.executeFalls(allFalls);
            }
        }
    }

    // --- Refill ---

    /**
     * Плавное заполнение поля — каскадная анимация падения
     */
    private async refillBoard(): Promise<void> {
        if (!this.chipFactory) return;

        const maxIterations = 100;
        let iteration = 0;
        
        // Задержка между появлением фишек для каскадного эффекта
        const spawnDelay = 0.05; // секунды

        while (iteration < maxIterations) {
            iteration++;
            
            // Сначала плавная гравитация
            await this.processGravityAnimated();
            
            // Считаем сколько пустых ячеек в каждом столбце
            const emptyCountPerColumn = this.countEmptyPerColumn();
            const hasEmpty = emptyCountPerColumn.some(count => count > 0);
            
            if (!hasEmpty) {
                break; // Всё заполнено
            }
            
            // Создаём по одной фишке в каждом столбце с задержкой
            const fallPromises: Promise<void>[] = [];
            
            for (let col = 0; col < this.cols; col++) {
                if (emptyCountPerColumn[col] === 0) continue;
                
                // Находим верхнюю пустую ячейку в столбце
                const targetPos = this.findTopEmptyInColumn(col);
                if (!targetPos) continue;
                
                // Создаём фишку выше поля
                const chipNode = this.chipFactory.createChipAboveBoard(
                    this.node,
                    col,
                    this.originX,
                    this.originY,
                    this.cellSize,
                    1
                );

                if (chipNode) {
                    // Размещаем логически
                    this.board.placeChip(targetPos, chipNode);
                    
                    // Рассчитываем расстояние падения
                    const chip = chipNode.getComponent(Chip);
                    const targetWorld = BoardUtils.boardToWorld(targetPos, this.originX, this.originY, this.cellSize);
                    
                    if (chip) {
                        // Время падения зависит от расстояния
                        const fallDistance = targetPos.row + 1;
                        const fallDuration = GameConstants.FALL_DURATION * Math.sqrt(fallDistance);
                        
                        // Добавляем задержку для каскадного эффекта
                        const delayedFall = this.delayedMove(chip, targetWorld, fallDuration, col * spawnDelay);
                        fallPromises.push(delayedFall);
                    }
                }
            }
            
            // Ждём все анимации падения
            if (fallPromises.length > 0) {
                await Promise.all(fallPromises);
            }
        }
        
        if (iteration >= maxIterations) {
            console.error('Refill: max iterations reached!');
        }
    }

    /**
     * Плавная гравитация с анимацией
     */
    private async processGravityAnimated(): Promise<void> {
        let hasFalls = true;

        while (hasFalls) {
            // Прямые падения
            const falls = this.boardPhysics.calculateFalls();
            // Диагональные падения
            const diagonalFalls = this.boardPhysics.calculateDiagonalFalls();

            const allFalls = [...falls, ...diagonalFalls];

            if (allFalls.length === 0) {
                hasFalls = false;
            } else {
                await this.boardPhysics.executeFalls(allFalls);
            }
        }
    }

    /**
     * Анимация с задержкой
     */
    private async delayedMove(chip: Chip, target: { x: number; y: number }, duration: number, delay: number): Promise<void> {
        if (delay > 0) {
            await this.delay(delay);
        }
        await chip.moveTo(new Vec3(target.x, target.y, 0), duration);
    }

    /**
     * Считает пустые ячейки в каждом столбце
     */
    private countEmptyPerColumn(): number[] {
        const counts: number[] = [];
        
        for (let col = 0; col < this.cols; col++) {
            let count = 0;
            for (let row = 0; row < this.rows; row++) {
                const pos: BoardPosition = { row, col };
                const cell = this.board.getCell(pos);
                if (cell && cell.canHoldChip && !cell.hasChip) {
                    count++;
                }
            }
            counts.push(count);
        }
        
        return counts;
    }

    /**
     * Находит верхнюю пустую ячейку в столбце
     */
    private findTopEmptyInColumn(col: number): BoardPosition | null {
        for (let row = 0; row < this.rows; row++) {
            const pos: BoardPosition = { row, col };
            const cell = this.board.getCell(pos);
            
            if (cell && cell.canHoldChip) {
                if (!cell.hasChip) {
                    return pos;
                }
            }
        }
        return null;
    }

    /**
     * Получает все пустые позиции на доске
     */
    private getAllEmptyPositions(): BoardPosition[] {
        const empty: BoardPosition[] = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const pos: BoardPosition = { row, col };
                const cell = this.board.getCell(pos);
                if (cell && cell.canHoldChip && !cell.hasChip) {
                    empty.push(pos);
                }
            }
        }
        return empty;
    }

    private delay(seconds: number): Promise<void> {
        return new Promise(resolve => this.scheduleOnce(resolve, seconds));
    }

    // --- Game State ---

    private setState(state: GameState): void {
        this._state = state;
        GameEvents.emit(GameEventTypes.STATE_CHANGED, state);
    }

    private addScore(points: number): void {
        this._score += points;
        GameEvents.emit(GameEventTypes.SCORE_CHANGED, this._score);
    }

    private checkGameEnd(): void {
        if (this._score >= this.targetScore) {
            GameEvents.emit(GameEventTypes.GAME_WON);
            return;
        }

        if (this.movesLeft <= 0) {
            GameEvents.emit(GameEventTypes.GAME_OVER);
            return;
        }

        // Проверка возможных ходов
        if (!this.matchDetector.hasValidMoves()) {
            console.log('No valid moves - reshuffling');
            this.shuffleBoard();
        }
    }

    /**
     * Пересортировка фишек на доске (когда нет доступных ходов)
     */
    private async shuffleBoard(): Promise<void> {
        this.setState(GameState.Swapping);

        // Собираем все фишки
        const chips: { chip: Chip; color: ChipColor }[] = [];
        this.board.forEachChip((chip, pos) => {
            chips.push({ chip, color: chip.color });
        });

        // Перемешиваем цвета
        for (let i = chips.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chips[i].color, chips[j].color] = [chips[j].color, chips[i].color];
        }

        // Применяем новые цвета с анимацией
        let index = 0;
        this.board.forEachChip((chip) => {
            if (index < chips.length) {
                chip.setColor(chips[index].color);
                // Анимация "тряски"
                chip.playShuffleAnimation();
                index++;
            }
        });

        await this.delay(0.5);

        // Проверяем, появились ли совпадения после перемешивания
        await this.processMatchesLoop();
        
        this.setState(GameState.Idle);

        // Если всё ещё нет ходов — повторяем
        if (!this.matchDetector.hasValidMoves()) {
            await this.shuffleBoard();
        }
    }

    private clearBoard(): void {
        if (this.chipFactory) {
            this.chipFactory.recycleAll();
        }

        this.board.forEachCell((cell) => {
            cell.node.destroy();
        });
    }
}
