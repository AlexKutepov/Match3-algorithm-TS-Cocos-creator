import { Node } from 'cc';
import { CellType, ChipColor } from '../Enums';
import { BoardPosition, BoardConfig, GameConstants } from '../Types';
import { BoardUtils } from '../Utils/BoardUtils';
import { Cell } from '../Components/Cell';
import { Chip } from '../Components/Chip';

/**
 * Логическое представление игрового поля
 * Отвечает только за данные, не за визуализацию
 */
export class Board {
    
    private readonly _rows: number;
    private readonly _cols: number;
    private readonly _cells: (Cell | null)[][];
    private readonly _config: BoardConfig;

    constructor(config: BoardConfig) {
        this._config = config;
        this._rows = config.rows;
        this._cols = config.cols;
        this._cells = this.createEmptyGrid();
    }

    // --- Getters ---

    get rows(): number {
        return this._rows;
    }

    get cols(): number {
        return this._cols;
    }

    get config(): BoardConfig {
        return this._config;
    }

    // --- Cell Access ---

    /**
     * Получение ячейки по позиции
     */
    getCell(pos: BoardPosition): Cell | null {
        if (!this.isValidPosition(pos)) return null;
        return this._cells[pos.row][pos.col];
    }

    /**
     * Получение ячейки по координатам
     */
    getCellAt(row: number, col: number): Cell | null {
        return this.getCell({ row, col });
    }

    /**
     * Установка ячейки
     */
    setCell(pos: BoardPosition, cell: Cell): void {
        if (!this.isValidPosition(pos)) return;
        this._cells[pos.row][pos.col] = cell;
    }

    // --- Chip Access ---

    /**
     * Получение фишки по позиции
     */
    getChip(pos: BoardPosition): Chip | null {
        const cell = this.getCell(pos);
        if (!cell || !cell.chip) return null;
        return cell.chip.getComponent(Chip);
    }

    /**
     * Получение цвета фишки по позиции
     */
    getChipColor(pos: BoardPosition): ChipColor | null {
        const chip = this.getChip(pos);
        return chip ? chip.color : null;
    }

    /**
     * Проверка наличия фишки
     */
    hasChip(pos: BoardPosition): boolean {
        const cell = this.getCell(pos);
        return cell !== null && cell.hasChip;
    }

    /**
     * Проверка, можно ли разместить фишку
     */
    canPlaceChip(pos: BoardPosition): boolean {
        const cell = this.getCell(pos);
        return cell !== null && cell.canHoldChip && !cell.hasChip;
    }

    // --- Validation ---

    /**
     * Проверка валидности позиции
     */
    isValidPosition(pos: BoardPosition): boolean {
        return BoardUtils.isValidPosition(pos, this._rows, this._cols);
    }

    /**
     * Проверка, является ли ячейка заблокированной
     */
    isBlocked(pos: BoardPosition): boolean {
        const cell = this.getCell(pos);
        return cell === null || cell.cellType === CellType.Blocked;
    }

    // --- Operations ---

    /**
     * Свап фишек между двумя ячейками
     */
    swapChips(pos1: BoardPosition, pos2: BoardPosition): boolean {
        const cell1 = this.getCell(pos1);
        const cell2 = this.getCell(pos2);

        if (!cell1 || !cell2) return false;
        if (!cell1.hasChip || !cell2.hasChip) return false;

        const chip1 = cell1.removeChip();
        const chip2 = cell2.removeChip();

        if (chip1) cell2.setChip(chip1);
        if (chip2) cell1.setChip(chip2);

        return true;
    }

    /**
     * Удаление фишки из позиции
     */
    removeChip(pos: BoardPosition): Node | null {
        const cell = this.getCell(pos);
        if (!cell) return null;
        return cell.removeChip();
    }

    /**
     * Размещение фишки в позиции
     */
    placeChip(pos: BoardPosition, chipNode: Node): boolean {
        const cell = this.getCell(pos);
        if (!cell || !cell.canHoldChip) return false;
        cell.setChip(chipNode);
        return true;
    }

    /**
     * Перемещение фишки из одной позиции в другую
     */
    moveChip(from: BoardPosition, to: BoardPosition): boolean {
        const fromCell = this.getCell(from);
        const toCell = this.getCell(to);

        if (!fromCell || !toCell) return false;
        if (!fromCell.hasChip || toCell.hasChip) return false;
        if (!toCell.canHoldChip) return false;

        const chip = fromCell.removeChip();
        if (chip) {
            toCell.setChip(chip);
            return true;
        }
        return false;
    }

    // --- Iteration ---

    /**
     * Итерация по всем ячейкам
     */
    forEachCell(callback: (cell: Cell, pos: BoardPosition) => void): void {
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                const cell = this._cells[row][col];
                if (cell) {
                    callback(cell, { row, col });
                }
            }
        }
    }

    /**
     * Итерация по всем фишкам
     */
    forEachChip(callback: (chip: Chip, pos: BoardPosition) => void): void {
        this.forEachCell((cell, pos) => {
            if (cell.hasChip) {
                const chip = cell.chip!.getComponent(Chip);
                if (chip) {
                    callback(chip, pos);
                }
            }
        });
    }

    /**
     * Получение всех пустых ячеек, которые могут содержать фишки
     */
    getEmptyCells(): BoardPosition[] {
        const empty: BoardPosition[] = [];
        this.forEachCell((cell, pos) => {
            if (cell.canHoldChip && !cell.hasChip) {
                empty.push(pos);
            }
        });
        return empty;
    }

    /**
     * Получение позиций всех фишек определённого цвета
     */
    getChipsByColor(color: ChipColor): BoardPosition[] {
        const positions: BoardPosition[] = [];
        this.forEachChip((chip, pos) => {
            if (chip.color === color) {
                positions.push(pos);
            }
        });
        return positions;
    }

    // --- Private ---

    private createEmptyGrid(): (Cell | null)[][] {
        const grid: (Cell | null)[][] = [];
        for (let row = 0; row < this._rows; row++) {
            grid[row] = [];
            for (let col = 0; col < this._cols; col++) {
                grid[row][col] = null;
            }
        }
        return grid;
    }
}
