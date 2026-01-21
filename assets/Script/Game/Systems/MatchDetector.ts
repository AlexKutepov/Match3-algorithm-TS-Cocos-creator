import { ChipColor, ChipType } from '../Enums';
import { BoardPosition, MatchResult, GameConstants } from '../Types';
import { BoardUtils } from '../Utils/BoardUtils';
import { Board } from '../Core/Board';

/**
 * Система поиска совпадений
 * Оптимизированный алгоритм O(n²) - один проход по доске
 */
export class MatchDetector {

    private readonly board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    /**
     * Поиск всех совпадений на доске
     * Возвращает массив результатов совпадений
     */
    findAllMatches(): MatchResult[] {
        const matches: MatchResult[] = [];
        const processedH = new Set<string>();
        const processedV = new Set<string>();

        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const pos: BoardPosition = { row, col };
                const key = BoardUtils.positionKey(pos);

                // Горизонтальные совпадения
                if (!processedH.has(key)) {
                    const hMatch = this.findHorizontalMatch(pos);
                    if (hMatch) {
                        matches.push(hMatch);
                        hMatch.positions.forEach(p => processedH.add(BoardUtils.positionKey(p)));
                    }
                }

                // Вертикальные совпадения
                if (!processedV.has(key)) {
                    const vMatch = this.findVerticalMatch(pos);
                    if (vMatch) {
                        matches.push(vMatch);
                        vMatch.positions.forEach(p => processedV.add(BoardUtils.positionKey(p)));
                    }
                }
            }
        }

        return matches;
    }

    /**
     * Поиск горизонтального совпадения начиная с позиции
     */
    findHorizontalMatch(startPos: BoardPosition): MatchResult | null {
        const color = this.board.getChipColor(startPos);
        if (color === null) return null;

        const positions: BoardPosition[] = [startPos];

        // Ищем вправо
        for (let col = startPos.col + 1; col < this.board.cols; col++) {
            const pos: BoardPosition = { row: startPos.row, col };
            if (this.board.getChipColor(pos) === color) {
                positions.push(pos);
            } else {
                break;
            }
        }

        if (positions.length < GameConstants.MIN_MATCH_LENGTH) {
            return null;
        }

        return {
            positions,
            isHorizontal: true,
            length: positions.length,
            color
        };
    }

    /**
     * Поиск вертикального совпадения начиная с позиции
     */
    findVerticalMatch(startPos: BoardPosition): MatchResult | null {
        const color = this.board.getChipColor(startPos);
        if (color === null) return null;

        const positions: BoardPosition[] = [startPos];

        // Ищем вниз
        for (let row = startPos.row + 1; row < this.board.rows; row++) {
            const pos: BoardPosition = { row, col: startPos.col };
            if (this.board.getChipColor(pos) === color) {
                positions.push(pos);
            } else {
                break;
            }
        }

        if (positions.length < GameConstants.MIN_MATCH_LENGTH) {
            return null;
        }

        return {
            positions,
            isHorizontal: false,
            length: positions.length,
            color
        };
    }

    /**
     * Проверка, приведёт ли свап к совпадению
     */
    wouldMatchAfterSwap(pos1: BoardPosition, pos2: BoardPosition): boolean {
        // Временно свапаем
        this.board.swapChips(pos1, pos2);

        // Проверяем совпадения в обеих позициях
        const hasMatch = 
            this.hasMatchAt(pos1) || 
            this.hasMatchAt(pos2);

        // Возвращаем обратно
        this.board.swapChips(pos1, pos2);

        return hasMatch;
    }

    /**
     * Проверка наличия совпадения в позиции
     */
    hasMatchAt(pos: BoardPosition): boolean {
        return this.countMatchHorizontal(pos) >= GameConstants.MIN_MATCH_LENGTH ||
               this.countMatchVertical(pos) >= GameConstants.MIN_MATCH_LENGTH;
    }

    /**
     * Подсчёт длины горизонтального совпадения через позицию
     */
    private countMatchHorizontal(pos: BoardPosition): number {
        const color = this.board.getChipColor(pos);
        if (color === null) return 0;

        let count = 1;

        // Влево
        for (let col = pos.col - 1; col >= 0; col--) {
            if (this.board.getChipColor({ row: pos.row, col }) === color) {
                count++;
            } else break;
        }

        // Вправо
        for (let col = pos.col + 1; col < this.board.cols; col++) {
            if (this.board.getChipColor({ row: pos.row, col }) === color) {
                count++;
            } else break;
        }

        return count;
    }

    /**
     * Подсчёт длины вертикального совпадения через позицию
     */
    private countMatchVertical(pos: BoardPosition): number {
        const color = this.board.getChipColor(pos);
        if (color === null) return 0;

        let count = 1;

        // Вверх
        for (let row = pos.row - 1; row >= 0; row--) {
            if (this.board.getChipColor({ row, col: pos.col }) === color) {
                count++;
            } else break;
        }

        // Вниз
        for (let row = pos.row + 1; row < this.board.rows; row++) {
            if (this.board.getChipColor({ row, col: pos.col }) === color) {
                count++;
            } else break;
        }

        return count;
    }

    /**
     * Определение типа бонуса для совпадения
     */
    getBonusType(match: MatchResult): ChipType {
        if (match.length >= GameConstants.BONUS_5_LENGTH) {
            return ChipType.Rainbow;
        }
        if (match.length >= GameConstants.BONUS_4_LENGTH) {
            return match.isHorizontal ? ChipType.LineVertical : ChipType.LineHorizontal;
        }
        return ChipType.Normal;
    }

    /**
     * Получение уникальных позиций из всех совпадений
     */
    getUniquePositions(matches: MatchResult[]): BoardPosition[] {
        const posSet = new Set<string>();
        const positions: BoardPosition[] = [];

        for (const match of matches) {
            for (const pos of match.positions) {
                const key = BoardUtils.positionKey(pos);
                if (!posSet.has(key)) {
                    posSet.add(key);
                    positions.push(pos);
                }
            }
        }

        return positions;
    }

    /**
     * Проверка наличия возможных ходов
     */
    hasValidMoves(): boolean {
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const pos: BoardPosition = { row, col };
                if (!this.board.hasChip(pos)) continue;

                // Проверяем свап вправо
                const rightPos: BoardPosition = { row, col: col + 1 };
                if (this.board.hasChip(rightPos)) {
                    if (this.wouldMatchAfterSwap(pos, rightPos)) {
                        return true;
                    }
                }

                // Проверяем свап вниз
                const downPos: BoardPosition = { row: row + 1, col };
                if (this.board.hasChip(downPos)) {
                    if (this.wouldMatchAfterSwap(pos, downPos)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
