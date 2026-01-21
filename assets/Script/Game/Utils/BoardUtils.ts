import { BoardPosition, GameConstants } from '../Types';

/**
 * Утилиты для работы с доской
 */
export class BoardUtils {
    
    /**
     * Проверка валидности позиции
     */
    static isValidPosition(pos: BoardPosition, rows: number, cols: number): boolean {
        return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols;
    }

    /**
     * Проверка соседства двух позиций
     */
    static areNeighbors(pos1: BoardPosition, pos2: BoardPosition): boolean {
        const rowDiff = Math.abs(pos1.row - pos2.row);
        const colDiff = Math.abs(pos1.col - pos2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    /**
     * Проверка равенства позиций
     */
    static isSamePosition(pos1: BoardPosition, pos2: BoardPosition): boolean {
        return pos1.row === pos2.row && pos1.col === pos2.col;
    }

    /**
     * Получение соседних позиций
     */
    static getNeighbors(pos: BoardPosition, rows: number, cols: number): BoardPosition[] {
        const neighbors: BoardPosition[] = [];
        const offsets = [
            { row: -1, col: 0 },  // up
            { row: 1, col: 0 },   // down
            { row: 0, col: -1 },  // left
            { row: 0, col: 1 }    // right
        ];

        for (const offset of offsets) {
            const newPos: BoardPosition = {
                row: pos.row + offset.row,
                col: pos.col + offset.col
            };
            if (this.isValidPosition(newPos, rows, cols)) {
                neighbors.push(newPos);
            }
        }

        return neighbors;
    }

    /**
     * Конвертация позиции доски в мировые координаты
     */
    static boardToWorld(
        pos: BoardPosition, 
        originX: number, 
        originY: number, 
        cellSize: number
    ): { x: number; y: number } {
        return {
            x: originX + pos.col * cellSize,
            y: originY - pos.row * cellSize
        };
    }

    /**
     * Получение случайного числа в диапазоне [0, max)
     */
    static randomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }

    /**
     * Создание ключа для позиции (для использования в Set/Map)
     */
    static positionKey(pos: BoardPosition): string {
        return `${pos.row},${pos.col}`;
    }

    /**
     * Парсинг ключа позиции
     */
    static parsePositionKey(key: string): BoardPosition {
        const [row, col] = key.split(',').map(Number);
        return { row, col };
    }
}
