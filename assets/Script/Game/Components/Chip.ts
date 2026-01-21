import { _decorator, Component, Node, Prefab, Sprite, SpriteFrame, UITransform, instantiate, Vec3, tween, Tween, Color, easing } from 'cc';
import { ChipColor, ChipType } from '../Enums';
import { GameConstants } from '../Types';

const { ccclass, property } = _decorator;

/**
 * Компонент фишки Match-3
 */
@ccclass('Chip')
export class Chip extends Component {

    @property([SpriteFrame])
    colorSprites: SpriteFrame[] = [];

    @property([Prefab])
    bonusPrefabs: Prefab[] = [];

    private _color: ChipColor = ChipColor.Blue;
    private _type: ChipType = ChipType.Normal;
    private _isMoving: boolean = false;
    private _currentTween: Tween<Node> | null = null;

    // --- Getters ---

    get color(): ChipColor {
        return this._color;
    }

    get type(): ChipType {
        return this._type;
    }

    get isMoving(): boolean {
        return this._isMoving;
    }

    // --- Public Methods ---

    /**
     * Инициализация фишки с случайным цветом
     */
    initialize(colorCount?: number): void {
        const maxColors = colorCount ?? this.colorSprites.length;
        const randomColor = Math.floor(Math.random() * maxColors);
        this.setColor(randomColor);
    }

    /**
     * Установка цвета фишки
     */
    setColor(color: ChipColor): void {
        this._color = color;
        this.updateSprite();
    }

    /**
     * Установка типа бонуса
     */
    setType(type: ChipType): void {
        this._type = type;
        this.updateBonusVisual();
    }

    /**
     * Анимация перемещения к позиции с easing
     */
    moveTo(targetPos: Vec3, duration: number = GameConstants.FALL_DURATION): Promise<void> {
        return new Promise((resolve) => {
            if (this._currentTween) {
                this._currentTween.stop();
            }

            this._isMoving = true;

            this._currentTween = tween(this.node)
                .to(duration, { position: targetPos }, { 
                    easing: 'quadIn'  // Ускорение падения (как гравитация)
                })
                .call(() => {
                    this._isMoving = false;
                    this._currentTween = null;
                    resolve();
                })
                .start();
        });
    }

    /**
     * Анимация уничтожения с эффектом сжатия
     */
    playDestroyAnimation(duration: number = GameConstants.DESTROY_DURATION): Promise<void> {
        return new Promise((resolve) => {
            if (this._currentTween) {
                this._currentTween.stop();
            }

            this._currentTween = tween(this.node)
                // Небольшое увеличение перед исчезновением
                .to(duration * 0.3, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'quadOut' })
                // Быстрое сжатие
                .to(duration * 0.7, { scale: new Vec3(0, 0, 0) }, { easing: 'backIn' })
                .call(() => {
                    this._currentTween = null;
                    resolve();
                })
                .start();
        });
    }

    /**
     * Анимация пересортировки (тряска + сброс scale)
     */
    playShuffleAnimation(): void {
        // Сбрасываем scale перед анимацией
        this.node.setScale(new Vec3(1, 1, 1));
        
        const originalPos = this.node.position.clone();
        const shakeAmount = 5;
        
        tween(this.node)
            .to(0.05, { position: new Vec3(originalPos.x + shakeAmount, originalPos.y, 0) })
            .to(0.05, { position: new Vec3(originalPos.x - shakeAmount, originalPos.y, 0) })
            .to(0.05, { position: new Vec3(originalPos.x + shakeAmount, originalPos.y, 0) })
            .to(0.05, { position: new Vec3(originalPos.x - shakeAmount, originalPos.y, 0) })
            .to(0.05, { position: originalPos })
            .start();
    }

    /**
     * Сброс состояния фишки (для пула объектов)
     */
    reset(): void {
        if (this._currentTween) {
            this._currentTween.stop();
            this._currentTween = null;
        }
        this._isMoving = false;
        this._type = ChipType.Normal;
        this.node.setScale(new Vec3(1, 1, 1));
        this.clearBonusVisuals();
    }

    // --- Private Methods ---

    private updateSprite(): void {
        const sprite = this.node.getComponent(Sprite);
        if (sprite && this.colorSprites[this._color]) {
            sprite.spriteFrame = this.colorSprites[this._color];
        }
    }

    private updateBonusVisual(): void {
        this.clearBonusVisuals();

        if (this._type === ChipType.Normal) return;

        const prefabIndex = this._type - 1;
        if (prefabIndex >= 0 && prefabIndex < this.bonusPrefabs.length) {
            this.createBonusNode(prefabIndex);
        }

        // Специальный случай: крестовая бомба (линия H + V)
        if (this._type === ChipType.Bomb) {
            if (this.bonusPrefabs.length >= 2) {
                this.createBonusNode(0); // Horizontal
                this.createBonusNode(1); // Vertical
            }
        }
    }

    private createBonusNode(prefabIndex: number): void {
        if (!this.bonusPrefabs[prefabIndex]) {
            console.warn(`Bonus prefab at index ${prefabIndex} is not set`);
            return;
        }
        
        const bonusNode = instantiate(this.bonusPrefabs[prefabIndex]);
        bonusNode.setParent(this.node);
        bonusNode.setPosition(Vec3.ZERO);

        // Устанавливаем размер
        const parentTransform = this.node.getComponent(UITransform);
        const bonusTransform = bonusNode.getComponent(UITransform);
        if (parentTransform && bonusTransform) {
            bonusTransform.setContentSize(parentTransform.contentSize);
        }

        // Убираем возможный цвет фона у спрайта (делаем полностью прозрачным кроме текстуры)
        const bonusSprite = bonusNode.getComponent(Sprite);
        if (bonusSprite) {
            // Устанавливаем белый цвет чтобы текстура отображалась как есть
            bonusSprite.color = Color.WHITE;
        }
    }

    private clearBonusVisuals(): void {
        // Удаляем все дочерние ноды (бонусные визуалы)
        const children = [...this.node.children];
        for (const child of children) {
            child.destroy();
        }
    }

    protected onDestroy(): void {
        if (this._currentTween) {
            this._currentTween.stop();
            this._currentTween = null;
        }
    }
}
