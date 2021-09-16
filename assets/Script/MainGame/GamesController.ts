import { Circle } from "./Circle";
import { GameField } from "./GameField";
const { ccclass, property } = cc._decorator;

@ccclass
export class GameController extends cc.Component {

    @property
    countTypeAndMove: number = 12;

    private allpoints: number = 0;

    @property(cc.Label)
    taskType: cc.Label = null;

    private taskpoints: number = 0;

    @property(cc.Label)
    currentMove: cc.Label = null;

    private movepoints: number = 0;

    @property
    testGame: boolean = true;

    @property(cc.Label)
    textPoint: cc.Label = null;

    @property(GameField)
    gameField: GameField = null;

    @property(cc.Node)
    gameOver: cc.Node = null;

    @property(cc.Node)
    gameWon: cc.Node = null;

    @property(cc.Node)
    typeTask: cc.Node = null;

    @property(cc.Node)
    testGameText: cc.Node = null;

    @property(cc.Node)
    blockField: cc.Node = null;
    onLoad() {

        if(this.testGame) {
            this.testGameText.active=true;
        }

        this.taskpoints = Number(this.taskType.string);
        this.movepoints = Number(this.currentMove.string);

        this.node.on('moveCircleEnd', this.gameField.createOneLineCircles, this.gameField);
        this.node.on('moveCircleEnd', function (event) {
            event.stopPropagation();
        });

        this.node.on('clickOnCellForDestroyCircle', this.gameField.clickDestroyCircleInCell, this.gameField);
        this.node.on('clickOnCellForDestroyCircle', function (event) {
            event.stopPropagation();
        });

        this.node.on('destroyCircles', this.gameField.allCirclesMove, this.gameField);
        this.node.on('destroyCircles', function (event) {
            event.stopPropagation();
        });

        this.node.on('needCheckField', this.gameField.checkLine, this.gameField);
        this.node.on('needCheckField', function (event) {
            event.stopPropagation();
        });

        this.node.on('setPoint', this.setPoint, this);
        this.node.on('setPoint', function (event) {
            event.stopPropagation();
        });


        this.node.on('getDestroyCirclesType', this.gameField.getTypeDestroyCircle, this.gameField);
        this.node.on('getDestroyCirclesType', function (event) {
            event.stopPropagation();
        });

        this.node.on('setDestroyCirclesType_', this.setTypeDestroyCircle, this);
        this.node.on('setDestroyCirclesType_', function (event) {
            event.stopPropagation();
        });

        this.node.on('countProgressStep', this.countProgressStep, this);
        this.node.on('countProgressStep', function (event) {
            event.stopPropagation();
        });
        this.node.on('countProgressDestrCirles', this.countProgressStep, this);
        this.node.on('countProgressDestrCirles', function (event) {
            event.stopPropagation();
        });

        this.node.on('setBlockTouch', this.setBlockTouch, this);
        this.node.on('setBlockTouch', function (event) {
            event.stopPropagation();
        });
        this.node.on('setUnBlockTouch', this.setUnBlockTouch, this);
        this.node.on('setUnBlockTouch', function (event) {
            event.stopPropagation();
        });
    }

    private setBlockTouch() {
        this.blockField.active=true;
    }

    private setUnBlockTouch() {
        this.blockField.active=false;
    }

    private setPoint() {
        this.allpoints += 1;
        this.textPoint.string = this.allpoints.toString();
       
    }
/*
    setBuster() {
        this.gameField.
    }
*/

    private countProgressStep() {
      
        this.movepoints--;
        cc.log(this.movepoints)
        this. currentMove.string = String(this.movepoints);
        if (!this.testGame) {
            if (this.movepoints==0) {
                this.gameOver.active = true;
            }
        }

    }

    progressTargetDestoyCircle(){
     
        var circleTask = this.typeTask.getComponent(Circle);
        var countDestroyersTaskCircles = this.countTypeAndMove - this.gameField.destroyTipeColors[circleTask.CircleTypeColor];
        this.taskType.string = String(countDestroyersTaskCircles);
        if (!this.testGame) {
            if (countDestroyersTaskCircles<=0){
                this.gameWon.active = true;
            }
        }
    }

    gameOverNodeDeActivate(){
        this.gameOver.active = false;
    }

    gameWonNodeDeActivate(){
        this.gameWon.active = false;
    }

    private CheckGameOverIfColorChallengeIsComplete(){

    }

    RestartGame() {

        this.gameField.node.active = false;
        this.gameField.node.active = true;
        this.allpoints = 1;
        this.textPoint.string = this.allpoints.toString();
        this.movepoints = this.countTypeAndMove;
        this.taskType.string = this.countTypeAndMove.toString();
        this.currentMove.string = this.countTypeAndMove.toString();
        var circleTask = this.typeTask.getComponent(Circle);
        circleTask.setRandomColor();

    }

    setTypeDestroyCircle() {
        this.progressTargetDestoyCircle();
    }

}