/**
 * Match-3 Game Module
 * Cocos Creator 3.8.8
 * 
 * Структура:
 * - Enums: перечисления типов
 * - Types: интерфейсы и константы
 * - Utils: утилиты
 * - Components: компоненты (Chip, Cell)
 * - Core: данные (Board)
 * - Systems: системы (MatchDetector, BoardPhysics, ChipFactory, BonusExecutor)
 * - Controllers: контроллеры (GameController, UIController)
 */

// Enums
export * from './Enums';

// Types
export * from './Types';

// Utils
export { BoardUtils } from './Utils/BoardUtils';

// Components
export { Chip } from './Components/Chip';
export { Cell } from './Components/Cell';

// Core
export { Board } from './Core/Board';

// Systems
export { MatchDetector } from './Systems/MatchDetector';
export { BoardPhysics } from './Systems/BoardPhysics';
export { ChipFactory } from './Systems/ChipFactory';
export { BonusExecutor } from './Systems/BonusExecutor';

// Controllers
export { GameController, GameEvents, GameEventTypes } from './Controllers/GameController';
export { UIController } from './Controllers/UIController';
