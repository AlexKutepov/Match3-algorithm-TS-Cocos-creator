# Руководство по настройке Match-3 в Cocos Creator 3.8.8

> **ВАЖНО**: Префабы и сцены из версии 2.x несовместимы с 3.8.8. Следуйте этой инструкции для создания новых.

## Шаг 1: Удалить старые префабы

Удалите все файлы в `assets/prefabs/` — они в формате 2.x и не будут работать.

## Шаг 2: Создать Chip.prefab (фишка)

1. **Hierarchy** → ПКМ → Create Empty Node → назвать `Chip`
2. Выбрать `Chip`, в Inspector добавить компоненты:
   - Add Component → **2D** → **Sprite** (UITransform добавится автоматически)
   - Add Component → **Custom** → **Chip** (из `Script/Game/Components/`)

3. Настроить **UITransform** (уже добавлен):
   - Content Size: `47` x `47`

4. Настроить компонент **Chip**:
   - Color Sprites (Size: 6):
     - [0]: `picture/blue1` (перетащить SpriteFrame)
     - [1]: `picture/green1`
     - [2]: `picture/Orange1`
     - [3]: `picture/reed1`
     - [4]: `picture/Violet1`
     - [5]: `picture/yellow1`
   - Bonus Prefabs: пока оставить пустым (добавим после создания)

5. **Assets** → ПКМ на папку `prefabs/` → Create → Prefab → назвать `Chip`
6. Перетащить `Chip` из Hierarchy в созданный Chip.prefab
7. Удалить `Chip` из Hierarchy

## Шаг 3: Создать BonusHorizontal.prefab

1. **Hierarchy** → Create Empty Node → `BonusHorizontal`
2. Добавить компонент: **Sprite** (UITransform добавится автоматически!)
3. Настроить:
   - Sprite.SpriteFrame: `picture/horizont`
   - UITransform.Content Size: 47 x 47
4. Сохранить как `prefabs/BonusHorizontal.prefab`

## Шаг 4: Создать BonusVertical.prefab

1. **Hierarchy** → Create Empty Node → `BonusVertical`
2. Добавить **Sprite** (UITransform автоматически)
3. Sprite.SpriteFrame: `picture/vertycal`
4. UITransform.Content Size: 47 x 47
5. Сохранить как `prefabs/BonusVertical.prefab`

## Шаг 5: Создать BonusRainbow.prefab

1. **Hierarchy** → Create Empty Node → `BonusRainbow`
2. Добавить **Sprite** (UITransform автоматически)
3. Sprite.SpriteFrame: `picture/rainbow`
4. UITransform.Content Size: 47 x 47
5. Сохранить как `prefabs/BonusRainbow.prefab`

## Шаг 6: Обновить Chip.prefab

1. Двойной клик на `Chip.prefab` для редактирования
2. В компоненте **Chip**:
   - Bonus Prefabs (Size: 3):
     - [0]: `prefabs/BonusHorizontal`
     - [1]: `prefabs/BonusVertical`
     - [2]: `prefabs/BonusRainbow`
3. Сохранить (Ctrl+S)

## Шаг 7: Создать Cell.prefab (ячейка)

1. **Hierarchy** → Create Empty Node → `Cell`
2. Добавить компоненты:
   - **Sprite** (UITransform добавится автоматически)
   - **Custom** → **Cell** (из `Script/Game/Components/`)
3. Настроить:
   - Sprite.SpriteFrame: `Texture/singleColor`
   - Sprite.Color: серый (C5C5C5)
   - UITransform.Content Size: 62 x 62
4. Сохранить как `prefabs/Cell.prefab`

## Шаг 8: Создать сцену main.scene

1. **Assets** → ПКМ на папку `Scene/` → Create → Scene → `main`
2. Двойной клик для открытия

## Шаг 9: Настроить Canvas

1. В Hierarchy уже должен быть Canvas. Если нет:
   - ПКМ → Create → UI → Canvas

2. Выбрать **Canvas**, настроить:
   - Canvas.Design Resolution: 760 x 690
   - Canvas.Fit Height: ✓

## Шаг 10: Создать GameBoard

1. ПКМ на Canvas → Create Empty Node → `GameBoard`
2. Добавить компонент **GameController** (`Script/Game/Controllers/`)
3. Настроить **GameController**:
   - Cell Prefab: `prefabs/Cell`
   - Rows: 8
   - Cols: 8
   - Cell Size: 62
   - Origin X: -217 (центрирование: -(8/2 * 62) + 31)
   - Origin Y: 217
   - Max Moves: 20
   - Target Score: 1000

## Шаг 11: Создать ChipFactory

1. ПКМ на `GameBoard` → Create Empty Node → `ChipFactory`
2. Добавить компонент **ChipFactory** (`Script/Game/Systems/`)
3. Настроить:
   - Chip Prefab: `prefabs/Chip`
   - Pool Size: 64
   - Chip Size: 47
   - Color Count: 6

4. Вернуться к **GameBoard** → **GameController**:
   - Chip Factory: перетащить `ChipFactory` сюда

## Шаг 12: Создать UI

### 12.1 UI контейнер
1. ПКМ на Canvas → Create Empty Node → `UI`

### 12.2 Score Label
1. ПКМ на `UI` → Create Empty Node → `ScoreLabel`
2. Добавить компонент: Add Component → **2D** → **Label**
3. Настроить:
   - Position: (300, 330, 0)
   - Label.String: "0"
   - Label.Font Size: 40
   - Label.Color: белый

> Альтернатива: Add Component → 2D → RichText

### 12.3 Moves Label
1. ПКМ на `UI` → Create Empty Node → `MovesLabel`
2. Добавить компонент: Add Component → **2D** → **Label**
3. Настроить:
   - Position: (300, 280, 0)
   - Label.String: "20"
   - Label.Font Size: 40

### 12.4 GameOver Panel
1. ПКМ на `UI` → Create → UI → Sprite → `GameOverPanel`
2. Настроить:
   - Position: (0, 0, 0)
   - UITransform: 400 x 200
   - Sprite.Color: серый (777777)
   - **Active: false** (снять галочку!)
3. Добавить дочерний Label:
   - String: "Вы проиграли"
   - Position: (0, 40, 0)
4. Добавить дочерний Button → `RestartBtn`:
   - Position: (0, -40, 0)
   - Label: "Перезапустить"

### 12.5 GameWon Panel
1. Скопировать `GameOverPanel` → переименовать в `GameWonPanel`
2. Изменить текст на "Вы выиграли!"

## Шаг 13: Добавить UIController

1. Выбрать **Canvas**
2. Добавить компонент **UIController** (`Script/Game/Controllers/`)
3. Настроить:
   - Score Label: перетащить `UI/ScoreLabel`
   - Moves Label: перетащить `UI/MovesLabel`
   - Game Over Panel: перетащить `UI/GameOverPanel`
   - Game Won Panel: перетащить `UI/GameWonPanel`
   - Restart Button: перетащить `UI/GameOverPanel/RestartBtn`
   - Game Controller: перетащить `GameBoard`

## Шаг 14: Сохранить и запустить

1. Сохранить сцену: Ctrl+S
2. Нажать **Play** (▶)

---

## Структура Hierarchy

```
Canvas
├── Camera
├── GameBoard
│   ├── [GameController]
│   └── ChipFactory
│       └── [ChipFactory]
└── UI
    ├── ScoreLabel
    ├── MovesLabel
    ├── GameOverPanel (active=false)
    │   ├── Label "Вы проиграли"
    │   └── RestartBtn
    └── GameWonPanel (active=false)
        ├── Label "Вы выиграли"
        └── RestartBtn
```

---

## Решение проблем

### Скрипты не компилируются
- Проверьте, что все файлы в `assets/Script/Game/`
- Перезапустите Cocos Creator

### Компонент не найден в Add Component
- Developer → Refresh Extensions
- Перезапустите редактор

### Фишки не появляются
1. Проверьте `GameController.chipFactory` (должна быть ссылка)
2. Проверьте `ChipFactory.chipPrefab` (должен быть Chip.prefab)
3. Откройте Console (View → Console) — смотрите ошибки

### Клики не работают
- Проверьте UITransform на Cell
- Убедитесь что нет BlockInputEvents на родителях
