import { ChipType, ChipColor } from '../Enums';
import { BoardPosition } from '../Types';
import { Board } from '../Core/Board';
import { Chip } from '../Components/Chip';

/**
 * Система выполнения бонусов
 * Определяет, какие фишки должны быть уничтожены при активации бонуса
 */
export class BonusExecutor {

    private readonly board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    /**
     * Получение позиций для уничтожения при активации бонуса
     */
    getDestroyPositions(pos: BoardPosition, chip: Chip): BoardPosition[] {
        const positions: BoardPosition[] = [];

        switch (chip.type) {
            case ChipType.LineHorizontal:
                positions.push(...this.getHorizontalLine(pos));
                break;

            case ChipType.LineVertical:
                positions.push(...this.getVerticalLine(pos));
                break;

            case ChipType.Bomb:
                positions.push(...this.getHorizontalLine(pos));
                positions.push(...this.getVerticalLine(pos));
                break;

            case ChipType.Rainbow:
                positions.push(...this.getRainbowTargets(chip.color));
                break;

            case ChipType.Normal:
            default:
                positions.push(pos);
                break;
        }

        return this.uniquePositions(positions);
    }

    /**
     * Проверка, является ли фишка бонусной
     */
    isBonus(chip: Chip): boolean {
        return chip.type !== ChipType.Normal;
    }

    /**
     * Обработка столкновения двух бонусов
     * Возвращает расширенный список позиций для уничтожения
     */
    handleBonusCollision(
        pos1: BoardPosition,
        chip1: Chip,
        pos2: BoardPosition,
        chip2: Chip
    ): BoardPosition[] {
        const positions: BoardPosition[] = [];

        // Два бонуса-линии = крест
        if (this.isLineBonus(chip1) && this.isLineBonus(chip2)) {
            positions.push(...this.getHorizontalLine(pos1));
            positions.push(...this.getVerticalLine(pos1));
            positions.push(...this.getHorizontalLine(pos2));
            positions.push(...this.getVerticalLine(pos2));
        }
        // Радуга + обычная фишка = уничтожить все фишки этого цвета
        else if (chip1.type === ChipType.Rainbow && chip2.type === ChipType.Normal) {
            positions.push(...this.getRainbowTargets(chip2.color));
        }
        else if (chip2.type === ChipType.Rainbow && chip1.type === ChipType.Normal) {
            positions.push(...this.getRainbowTargets(chip1.color));
        }
        // Радуга + линия = все фишки цвета становятся линиями (упрощённо: уничтожаем все)
        else if (chip1.type === ChipType.Rainbow && this.isLineBonus(chip2)) {
            positions.push(...this.getRainbowTargets(chip2.color));
            // Добавляем линии от каждой позиции
            for (const p of this.getRainbowTargets(chip2.color)) {
                positions.push(...this.getHorizontalLine(p));
                positions.push(...this.getVerticalLine(p));
            }
        }
        // Две радуги = уничтожить всё поле
        else if (chip1.type === ChipType.Rainbow && chip2.type === ChipType.Rainbow) {
            positions.push(...this.getAllPositions());
        }
        else {
            // Обычная обработка каждого бонуса
            positions.push(...this.getDestroyPositions(pos1, chip1));
            positions.push(...this.getDestroyPositions(pos2, chip2));
        }

        return this.uniquePositions(positions);
    }

    // --- Private Methods ---

    private isLineBonus(chip: Chip): boolean {
        return chip.type === ChipType.LineHorizontal || 
               chip.type === ChipType.LineVertical ||
               chip.type === ChipType.Bomb;
    }

    private getHorizontalLine(pos: BoardPosition): BoardPosition[] {
        const positions: BoardPosition[] = [];
        for (let col = 0; col < this.board.cols; col++) {
            const p: BoardPosition = { row: pos.row, col };
            if (this.board.hasChip(p)) {
                positions.push(p);
            }
        }
        return positions;
    }

    private getVerticalLine(pos: BoardPosition): BoardPosition[] {
        const positions: BoardPosition[] = [];
        for (let row = 0; row < this.board.rows; row++) {
            const p: BoardPosition = { row, col: pos.col };
            if (this.board.hasChip(p)) {
                positions.push(p);
            }
        }
        return positions;
    }

    private getRainbowTargets(color: ChipColor): BoardPosition[] {
        return this.board.getChipsByColor(color);
    }

    private getAllPositions(): BoardPosition[] {
        const positions: BoardPosition[] = [];
        this.board.forEachChip((_, pos) => {
            positions.push(pos);
        });
        return positions;
    }

    private uniquePositions(positions: BoardPosition[]): BoardPosition[] {
        const seen = new Set<string>();
        return positions.filter(pos => {
            const key = `${pos.row},${pos.col}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
}
