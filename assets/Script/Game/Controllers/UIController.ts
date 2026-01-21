import { _decorator, Component, Node, Label, Button } from 'cc';
import { GameEvents, GameEventTypes, GameController } from './GameController';

const { ccclass, property } = _decorator;

/**
 * Контроллер UI
 * Отвечает за отображение счёта, ходов и окон победы/поражения
 */
@ccclass('UIController')
export class UIController extends Component {

    @property(Label)
    scoreLabel: Label | null = null;

    @property(Label)
    movesLabel: Label | null = null;

    @property(Node)
    gameOverPanel: Node | null = null;

    @property(Node)
    gameWonPanel: Node | null = null;

    @property(Button)
    restartButton: Button | null = null;

    @property(GameController)
    gameController: GameController | null = null;

    // --- Lifecycle ---

    onLoad(): void {
        this.subscribeToEvents();
        this.setupButtons();
        this.hidePanels();
    }

    onDestroy(): void {
        this.unsubscribeFromEvents();
    }

    // --- Event Handlers ---

    private subscribeToEvents(): void {
        GameEvents.on(GameEventTypes.SCORE_CHANGED, this.onScoreChanged, this);
        GameEvents.on(GameEventTypes.MOVES_CHANGED, this.onMovesChanged, this);
        GameEvents.on(GameEventTypes.GAME_OVER, this.onGameOver, this);
        GameEvents.on(GameEventTypes.GAME_WON, this.onGameWon, this);
    }

    private unsubscribeFromEvents(): void {
        GameEvents.off(GameEventTypes.SCORE_CHANGED, this.onScoreChanged, this);
        GameEvents.off(GameEventTypes.MOVES_CHANGED, this.onMovesChanged, this);
        GameEvents.off(GameEventTypes.GAME_OVER, this.onGameOver, this);
        GameEvents.off(GameEventTypes.GAME_WON, this.onGameWon, this);
    }

    private onScoreChanged(score: number): void {
        if (this.scoreLabel) {
            this.scoreLabel.string = score.toString();
        }
    }

    private onMovesChanged(movesLeft: number): void {
        if (this.movesLabel) {
            this.movesLabel.string = movesLeft.toString();
        }
    }

    private onGameOver(): void {
        if (this.gameOverPanel) {
            this.gameOverPanel.active = true;
        }
    }

    private onGameWon(): void {
        if (this.gameWonPanel) {
            this.gameWonPanel.active = true;
        }
    }

    // --- Button Handlers ---

    private setupButtons(): void {
        if (this.restartButton) {
            this.restartButton.node.on(Button.EventType.CLICK, this.onRestartClick, this);
        }
    }

    private onRestartClick(): void {
        this.hidePanels();
        if (this.gameController) {
            this.gameController.restart();
        }
    }

    private hidePanels(): void {
        if (this.gameOverPanel) {
            this.gameOverPanel.active = false;
        }
        if (this.gameWonPanel) {
            this.gameWonPanel.active = false;
        }
    }

    // --- Public Methods ---

    /**
     * Показать сообщение (для отладки)
     */
    showMessage(message: string): void {
        console.log(`[UI] ${message}`);
    }
}
