/**
 * Типы фишек (бонусы)
 */
export enum ChipType {
    Normal = 0,
    LineHorizontal = 1,
    LineVertical = 2,
    Bomb = 3,
    Rainbow = 4
}

/**
 * Цвета фишек
 */
export enum ChipColor {
    Blue = 0,
    Green = 1,
    Orange = 2,
    Red = 3,
    Violet = 4,
    Yellow = 5
}

/**
 * Типы ячеек
 */
export enum CellType {
    Normal = 0,
    Blocked = 1,
    Generator = 2
}

/**
 * Состояния игры
 */
export enum GameState {
    Idle = 0,
    Input = 1,
    Swapping = 2,
    Matching = 3,
    Falling = 4,
    Refilling = 5
}

/**
 * Направления
 */
export enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3
}
