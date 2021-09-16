import { typeColorCircle } from "./CircleEnums";
import { tipeCircle } from "./CircleEnums";

const { ccclass, property } = cc._decorator;

@ccclass
export class Circle extends cc.Component {

  @property(cc.SpriteFrame)
  sprite: cc.SpriteFrame[] = [];

  @property(cc.Prefab)
  circlesTipe: cc.Prefab[] = [];

  @property
  CircleTypeColor: typeColorCircle;

  CircleType: tipeCircle = 0;

  randomNumber: number;

  inMove: boolean = false;

  onLoad() {
    this.setRandomColor();
  }

  setRandomColor(){
    var sp = this.node.getComponent(cc.Sprite);
    this.randomNumber = Math.floor(Math.random() * Math.floor(this.sprite.length));
    sp.spriteFrame = this.sprite[this.randomNumber];
    this.setColorTipe(this.randomNumber);
  }

  setTipe(tipe) {
    this.CircleType = tipe;
    if (tipe > 0) {
      if (tipe == 4) {
        this.setTipeTMP(1);
        this.setTipeTMP(2);
      } else {
        this.setTipeTMP(tipe - 1);
      }
    }
  }

  private setTipeTMP(tipe) {
    var newNode = cc.instantiate(this.circlesTipe[tipe]);
    newNode.setParent(this.node);
    newNode.setContentSize(this.node.getContentSize());
    newNode.setPosition(0, 0);
  }

  setColorTipe(tipe) {
    var sp = this.node.getComponent(cc.Sprite);
    this.CircleTypeColor = tipe;
    sp.spriteFrame = this.sprite[tipe];
  }

}



