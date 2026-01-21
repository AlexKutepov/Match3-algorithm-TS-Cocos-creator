import { Vec3 } from 'cc';
import { BoardPosition, GameConstants } from '../Types';
import { BoardUtils } from '../Utils/BoardUtils';
import { Board } from '../Core/Board';
import { Chip } from '../Components/Chip';

/**
 * Описание падения фишки
 */
export interface FallMove {
    from: BoardPosition;
    to: BoardPosition;
    chip: Chip;
}

/**
 * Система гравитации
 * Отвечает за падение фишек вниз после уничтожения
 */
export class BoardPhysics {

    private readonly board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    /**
     * Расчёт всех падений
     * Возвращает список перемещений фишек
     */
    calculateFalls(): FallMove[] {
        const moves: FallMove[] = [];

        // Обрабатываем столбцы справа налево
        for (let col = 0; col < this.board.cols; col++) {
            const columnMoves = this.calculateColumnFalls(col);
            moves.push(...columnMoves);
        }

        return moves;
    }

    /**
     * Расчёт падений в одном столбце
     */
    private calculateColumnFalls(col: number): FallMove[] {
        const moves: FallMove[] = [];

        // Идём снизу вверх, ищем пустые ячейки
        for (let row = this.board.rows - 1; row >= 0; row--) {
            const pos: BoardPosition = { row, col };
            const cell = this.board.getCell(pos);

            if (!cell || !cell.canHoldChip) continue;
            if (cell.hasChip) continue;

            // Нашли пустую ячейку, ищем фишку выше
            const sourcePos = this.findChipAbove(pos);
            if (sourcePos) {
                const move = this.createFallMove(sourcePos, pos);
                if (move) {
                    moves.push(move);
                }
            }
        }

        return moves;
    }

    /**
     * Поиск ближайшей фишки выше указанной позиции
     */
    private findChipAbove(emptyPos: BoardPosition): BoardPosition | null {
        for (let row = emptyPos.row - 1; row >= 0; row--) {
            const pos: BoardPosition = { row, col: emptyPos.col };
            const cell = this.board.getCell(pos);

            if (!cell) continue;
            if (!cell.canHoldChip) continue; // Заблокированная ячейка - стоп
            if (cell.hasChip) return pos;
        }
        return null;
    }

    /**
     * Создание записи о падении и обновление логики доски
     */
    private createFallMove(from: BoardPosition, to: BoardPosition): FallMove | null {
        const chip = this.board.getChip(from);
        if (!chip) return null;

        // Обновляем логику доски
        this.board.moveChip(from, to);

        return { from, to, chip };
    }

    /**
     * Выполнение анимаций падения
     */
    async executeFalls(moves: FallMove[]): Promise<void> {
        if (moves.length === 0) return;

        const config = this.board.config;
        const animations: Promise<void>[] = [];

        for (const move of moves) {
            const targetWorld = BoardUtils.boardToWorld(
                move.to,
                config.originX,
                config.originY,
                config.cellSize
            );

            const targetVec = new Vec3(targetWorld.x, targetWorld.y, 0);
            
            // Время падения пропорционально расстоянию
            const distance = move.to.row - move.from.row;
            const duration = GameConstants.FALL_DURATION * distance;

            animations.push(move.chip.moveTo(targetVec, duration));
        }

        await Promise.all(animations);
    }

    /**
     * Расчёт диагональных падений
     * Как в старом алгоритме: если прямо сверху нет фишки, ищем по диагонали
     */
    calculateDiagonalFalls(): FallMove[] {
        const moves: FallMove[] = [];

        // Идём снизу вверх, слева направо
        for (let row = this.board.rows - 1; row >= 1; row--) {
            for (let col = 0; col < this.board.cols; col++) {
                const pos: BoardPosition = { row, col };
                const cell = this.board.getCell(pos);

                // Пропускаем если ячейка не существует или не может содержать фишку
                if (!cell || !cell.canHoldChip) continue;
                // Пропускаем если уже есть фишка
                if (cell.hasChip) continue;

                // Проверяем прямо сверху
                const abovePos: BoardPosition = { row: row - 1, col };
                const aboveCell = this.board.getCell(abovePos);
                
                // Если сверху есть фишка — прямое падение, не нужна диагональ
                if (aboveCell && aboveCell.hasChip) continue;

                // Ищем фишку по диагонали
                const diagonalSource = this.findDiagonalChip(pos);
                if (diagonalSource) {
                    const move = this.createFallMove(diagonalSource, pos);
                    if (move) {
                        moves.push(move);
                    }
                }
            }
        }

        return moves;
    }

    /**
     * Поиск фишки для диагонального падения
     * Логика как в старом алгоритме (allCirclesMove)
     */
    private findDiagonalChip(emptyPos: BoardPosition): BoardPosition | null {
        const row = emptyPos.row - 1;
        if (row < 0) return null;

        // Случайный порядок проверки левой/правой диагонали (как в старом коде)
        const checkLeftFirst = Math.random() < 0.5;
        const offsets = checkLeftFirst ? [-1, 1] : [1, -1];

        for (const colOffset of offsets) {
            const col = emptyPos.col + colOffset;
            if (col < 0 || col >= this.board.cols) continue;

            const pos: BoardPosition = { row, col };
            const cell = this.board.getCell(pos);

            // Проверяем: ячейка существует, может содержать фишку, и имеет фишку
            if (cell && cell.canHoldChip && cell.hasChip) {
                return pos;
            }
        }

        // Крайние случаи (как в старом коде)
        if (emptyPos.col === 0) {
            // Левый край — только справа
            const rightPos: BoardPosition = { row, col: 1 };
            const rightCell = this.board.getCell(rightPos);
            if (rightCell && rightCell.canHoldChip && rightCell.hasChip) {
                return rightPos;
            }
        }
        
        if (emptyPos.col === this.board.cols - 1) {
            // Правый край — только слева
            const leftPos: BoardPosition = { row, col: this.board.cols - 2 };
            const leftCell = this.board.getCell(leftPos);
            if (leftCell && leftCell.canHoldChip && leftCell.hasChip) {
                return leftPos;
            }
        }

        return null;
    }

    /**
     * Получение позиций, требующих заполнения (верхний ряд)
     */
    getRefillPositions(): BoardPosition[] {
        const positions: BoardPosition[] = [];

        for (let col = 0; col < this.board.cols; col++) {
            // Ищем первую сверху ячейку, которая может содержать фишку
            for (let row = 0; row < this.board.rows; row++) {
                const pos: BoardPosition = { row, col };
                const cell = this.board.getCell(pos);

                if (cell && cell.canHoldChip) {
                    if (!cell.hasChip) {
                        positions.push(pos);
                    }
                    break; // Только верхняя ячейка столбца
                }
            }
        }

        return positions;
    }
}
