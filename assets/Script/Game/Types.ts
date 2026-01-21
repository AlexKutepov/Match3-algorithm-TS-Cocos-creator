import { Node } from 'cc';
import { ChipColor, ChipType, CellType } from './Enums';

/**
 * Позиция на доске
 */
export interface BoardPosition {
    row: number;
    col: number;
}

/**
 * Данные фишки
 */
export interface ChipData {
    color: ChipColor;
    type: ChipType;
    node: Node | null;
}

/**
 * Данные ячейки
 */
export interface CellData {
    type: CellType;
    chip: ChipData | null;
    position: BoardPosition;
}

/**
 * Результат поиска совпадений
 */
export interface MatchResult {
    positions: BoardPosition[];
    isHorizontal: boolean;
    length: number;
    color: ChipColor;
}

/**
 * Конфигурация доски
 */
export interface BoardConfig {
    rows: number;
    cols: number;
    cellSize: number;
    originX: number;
    originY: number;
    chipColors: number;
    blockedCells: BoardPosition[];
}

/**
 * Событие свапа
 */
export interface SwapEvent {
    from: BoardPosition;
    to: BoardPosition;
}

/**
 * Константы игры
 */
export const GameConstants = {
    DEFAULT_ROWS: 8,
    DEFAULT_COLS: 8,
    DEFAULT_CELL_SIZE: 62,
    CHIP_PADDING: 15,
    
    // Анимации
    SWAP_DURATION: 0.15,      // Время свапа
    FALL_DURATION: 0.15,      // Базовое время падения (умножается на расстояние)
    DESTROY_DURATION: 0.12,   // Время уничтожения
    SPAWN_DELAY: 0.03,        // Задержка между появлением фишек в столбцах
    
    // Матчи
    MIN_MATCH_LENGTH: 3,
    BONUS_4_LENGTH: 4,
    BONUS_5_LENGTH: 5
} as const;
