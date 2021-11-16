window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  CellEnums: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fd2f4r+EbtJnamSH2HbcfIE", "CellEnums");
    var typeCell;
    (function(typeCell) {
      typeCell[typeCell["normal"] = 0] = "normal";
      typeCell[typeCell["franzy"] = 1] = "franzy";
    })(typeCell || (typeCell = {}));
    var typeColor;
    (function(typeColor) {
      typeColor[typeColor["gray"] = 0] = "gray";
      typeColor[typeColor["white"] = 1] = "white";
    })(typeColor || (typeColor = {}));
    cc._RF.pop();
  }, {} ],
  Cell: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "93f68rzHqxJY5it62LGw3mz", "Cell");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Cell = void 0;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Cell = function(_super) {
      __extends(Cell, _super);
      function Cell() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.generator = false;
        _this.irow = 0;
        _this.jcolumn = 0;
        _this.TypeColor = 0;
        _this.typeCell = 0;
        _this._circle = null;
        _this.wasSelectCircle = false;
        _this.wasClick = false;
        _this.countClick = 0;
        return _this;
      }
      Cell.prototype.onLoad = function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.wasClickSet, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveCircle, this);
      };
      Cell.prototype.wasClickSet = function() {
        if (null != this._circle) {
          this.wasClick = true;
          cc.log("clicedInCell");
          this.selectCircle();
        }
      };
      Cell.prototype.start = function() {};
      Cell.prototype.moveCircle = function() {
        cc.log("circle is move");
      };
      Cell.prototype.setGrayColor = function() {
        this.node.color = new cc.Color(197, 197, 197);
      };
      Cell.prototype.setWhiteColor = function() {
        this.node.color = new cc.Color(255, 255, 255);
      };
      Cell.prototype.setColorInType = function() {
        1 == this.typeCell && this.setWhiteColor();
      };
      Cell.prototype.selectCircle = function() {
        if (null == this._circle) return;
        this.countClick++;
        if (this.countClick % 2 == 0) {
          this.wasSelectCircle = false;
          this.wasClick = false;
          this.setNormalSize();
          this.node.dispatchEvent(new cc.Event.EventCustom("wasTwoClickOnCell", true));
        } else {
          this.wasSelectCircle = true;
          this.node.dispatchEvent(new cc.Event.EventCustom("wasClickOnCell", true));
          this._circle.setContentSize(this.node.getContentSize());
        }
      };
      Cell.prototype.setNormalSize = function() {
        if (null == this._circle) return;
        var oldSize = cc.size(this.node.getContentSize());
        this._circle.setContentSize(oldSize.height - 15, oldSize.width - 15);
      };
      Cell.prototype.mousedown = function() {
        this.wasClick = true;
        this.destroyCircle();
      };
      Cell.prototype.destroyCircle = function() {
        if (null != this._circle) {
          this._circle.destroy();
          this._circle = null;
          this.node.dispatchEvent(new cc.Event.EventCustom("clickOnCellForDestroyCircle", true));
        }
      };
      Cell.prototype.circleIsNotNull = function() {
        if (null != this._circle) return true;
        return false;
      };
      Cell.prototype.CellIsNotNull = function() {
        if (null != this) return true;
        return false;
      };
      __decorate([ property ], Cell.prototype, "generator", void 0);
      Cell = __decorate([ ccclass ], Cell);
      return Cell;
    }(cc.Component);
    exports.Cell = Cell;
    cc._RF.pop();
  }, {} ],
  CircleEnums: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3b838rchfZDZ7EUO6w1VHtd", "CircleEnums");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.tipeCircle = exports.typeColorCircle = void 0;
    var typeColorCircle;
    (function(typeColorCircle) {
      typeColorCircle[typeColorCircle["blue"] = 0] = "blue";
      typeColorCircle[typeColorCircle["green"] = 1] = "green";
      typeColorCircle[typeColorCircle["orange"] = 2] = "orange";
      typeColorCircle[typeColorCircle["reed"] = 3] = "reed";
      typeColorCircle[typeColorCircle["violet"] = 4] = "violet";
      typeColorCircle[typeColorCircle["yellow"] = 5] = "yellow";
    })(typeColorCircle = exports.typeColorCircle || (exports.typeColorCircle = {}));
    var tipeCircle;
    (function(tipeCircle) {
      tipeCircle[tipeCircle["normal"] = 0] = "normal";
      tipeCircle[tipeCircle["lightningHorizont"] = 1] = "lightningHorizont";
      tipeCircle[tipeCircle["lightningVertical"] = 2] = "lightningVertical";
      tipeCircle[tipeCircle["rainbowBall"] = 3] = "rainbowBall";
      tipeCircle[tipeCircle["lightningVerticalAndlightningHorizont"] = 4] = "lightningVerticalAndlightningHorizont";
    })(tipeCircle = exports.tipeCircle || (exports.tipeCircle = {}));
    cc._RF.pop();
  }, {} ],
  Circle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7dbc7eE2d1AgKeAG34Dn73t", "Circle");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Circle = void 0;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Circle = function(_super) {
      __extends(Circle, _super);
      function Circle() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sprite = [];
        _this.circlesTipe = [];
        _this.CircleType = 0;
        _this.inMove = false;
        return _this;
      }
      Circle.prototype.onLoad = function() {
        this.setRandomColor();
      };
      Circle.prototype.setRandomColor = function() {
        var sp = this.node.getComponent(cc.Sprite);
        this.randomNumber = Math.floor(Math.random() * Math.floor(this.sprite.length));
        sp.spriteFrame = this.sprite[this.randomNumber];
        this.setColorTipe(this.randomNumber);
      };
      Circle.prototype.setTipe = function(tipe) {
        this.CircleType = tipe;
        if (tipe > 0) if (4 == tipe) {
          this.setTipeTMP(1);
          this.setTipeTMP(2);
        } else this.setTipeTMP(tipe - 1);
      };
      Circle.prototype.setTipeTMP = function(tipe) {
        var newNode = cc.instantiate(this.circlesTipe[tipe]);
        newNode.setParent(this.node);
        newNode.setContentSize(this.node.getContentSize());
        newNode.setPosition(0, 0);
      };
      Circle.prototype.setColorTipe = function(tipe) {
        var sp = this.node.getComponent(cc.Sprite);
        this.CircleTypeColor = tipe;
        sp.spriteFrame = this.sprite[tipe];
      };
      __decorate([ property(cc.SpriteFrame) ], Circle.prototype, "sprite", void 0);
      __decorate([ property(cc.Prefab) ], Circle.prototype, "circlesTipe", void 0);
      __decorate([ property ], Circle.prototype, "CircleTypeColor", void 0);
      Circle = __decorate([ ccclass ], Circle);
      return Circle;
    }(cc.Component);
    exports.Circle = Circle;
    cc._RF.pop();
  }, {} ],
  ClassHelpers: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "713b5j6l2pMO79Lgw9EqBJF", "ClassHelpers");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CheckerBoolean = void 0;
    var CheckerBoolean = function() {
      function CheckerBoolean() {}
      CheckerBoolean.checkTwoBoolean = function(one, two) {
        return one & two;
      };
      CheckerBoolean.checkTrheeBoolean = function(one, two, trhee) {
        return one & two & trhee;
      };
      CheckerBoolean.EqualsTwoObj = function(one, two) {
        return one === two;
      };
      CheckerBoolean.EqualsTrheeObj = function(one, two, trhee) {
        if (one === two && two === trhee) return true;
        return false;
      };
      return CheckerBoolean;
    }();
    exports.CheckerBoolean = CheckerBoolean;
    cc._RF.pop();
  }, {} ],
  GameField: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bfa611mBN1Ato8bmVTiNiGw", "GameField");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameField = void 0;
    var Circle_1 = require("./Circle");
    var Cell_1 = require("./Cell");
    var ClassHelpers_1 = require("./ClassHelpers");
    var CircleEnums_1 = require("./CircleEnums");
    var CircleEnums_2 = require("./CircleEnums");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameField = function(_super) {
      __extends(GameField, _super);
      function GameField() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Circle = null;
        _this.Cell = null;
        _this.needRandomVoidCell = true;
        _this.ChangeForCreateAnActiveCell = 25;
        _this.iter = .1;
        _this.StartCellPosX = -150;
        _this.StartCellPosY = 250;
        _this.lenghtCell = 62;
        _this.widthCell = 62;
        _this.countCircle = 0;
        _this.countProgressStep = 0;
        _this.previousCountCircle = 0;
        _this.busterClick = false;
        _this.Cells = [ [ , , , , , , , ,  ], [ , , , , , , , ,  ], [ , , , , , , , ,  ], [ , , , , , , , ,  ], [ , , , , , , , ,  ], [ , , , , , , , ,  ], [ , , , , , , , ,  ], [ , , , , , , , ,  ] ];
        _this.currentI_cell_click = 0;
        _this.currentJ_cell_click = 0;
        _this.timeForCheckFild = 0;
        _this.oneCheckField = true;
        _this.cellExist = false;
        _this.tmpCountCircle = 0;
        _this.horizont = false;
        _this.vertical = false;
        _this.goDestroyThreeInArow = false;
        _this.destroyExisted = false;
        _this.animationStart = true;
        return _this;
      }
      GameField.prototype.onLoad = function() {
        this.node.on("wasClickOnCell", this.workWithClickedCell, this);
        this.node.on("wasTwoClickOnCell", this.workWithTwoClickedCell, this);
        this.timeForCheckFild = this.Cells.length * this.iter + .1;
      };
      GameField.prototype.start = function() {
        this.createCells();
        this.setTypeCellsOnIandJ(4, 0, this.Cells.length, 4, 1);
        this.CreateCircles();
      };
      GameField.prototype.onEnable = function() {
        this.createCells();
        this.setTypeCellsOnIandJ(4, 0, this.Cells.length, 4, 1);
        this.CreateCircles();
        this.destroyTipeColors = new Array(Object.keys(CircleEnums_2.typeColorCircle).length);
        for (var i = 0; i < this.destroyTipeColors.length; i++) this.destroyTipeColors[i] = 0;
      };
      GameField.prototype.onDisable = function() {
        this.DestroyCircles();
      };
      GameField.prototype.workWithClickedCell = function() {
        this.currentCell = this.getClickCell();
        this.currentCell === this.prewCell && (this.prewCell = null);
        if (null != this.currentCell && !this.buster()) {
          this.setSelectPrewCell();
          if (null != this.prewCell) {
            this.tmpPrewCell = this.prewCell;
            this.checkNeighboringCell();
          }
          this.prewCell = this.currentCell;
        }
      };
      GameField.prototype.workWithTwoClickedCell = function() {
        cc.log("clear cells");
      };
      GameField.prototype.checkNeighboringCell = function() {
        if (this.prewCell._circle.getComponent(Circle_1.Circle).CircleTypeColor !== this.currentCell._circle.getComponent(Circle_1.Circle).CircleTypeColor && this.prewCell !== this.currentCell && null != this.prewCell._circle && null != this.currentI_cell_click && (this.prewCell.irow + 1 == this.currentCell.irow && this.prewCell.jcolumn == this.currentCell.jcolumn || this.prewCell.irow - 1 == this.currentCell.irow && this.prewCell.jcolumn == this.currentCell.jcolumn || this.prewCell.irow == this.currentCell.irow && this.prewCell.jcolumn + 1 == this.currentCell.jcolumn || this.prewCell.irow == this.currentCell.irow && this.prewCell.jcolumn - 1 == this.currentCell.jcolumn)) {
          this.node.dispatchEvent(new cc.Event.EventCustom("setBlockTouch", true));
          this.swapCircles(this.prewCell, this.currentCell);
          this.needCheckFieldAfterSwapCircle();
        }
      };
      GameField.prototype.needCheckFieldAfterSwapCircle = function() {
        this.scheduleOnce(function() {
          this.node.dispatchEvent(new cc.Event.EventCustom("needCheckField", true));
          this.setCellNoClick(this.prewCell);
          this.setCellNoClick(this.currentCell);
          this.oneCheckField = true;
        }, this.iter + this.iter + this.iter);
        this.scheduleOnce(function() {
          if (this.destroyExisted) {
            cc.log("countProgressStep");
            this.node.dispatchEvent(new cc.Event.EventCustom("setUnBlockTouch", true));
            this.node.dispatchEvent(new cc.Event.EventCustom("countProgressStep", true));
            this.prewCell = null;
            this.currentCell = null;
            this.tmpPrewCell = null;
          } else {
            cc.log("comeBackCircle");
            this.node.dispatchEvent(new cc.Event.EventCustom("setUnBlockTouch", true));
            this.swapCircles(this.currentCell, this.tmpPrewCell);
            this.setCellNoClick(this.tmpPrewCell);
            this.setCellNoClick(this.currentCell);
            this.prewCell = null;
            this.currentCell = null;
            this.tmpPrewCell = null;
          }
        }, this.timeForCheckFild);
      };
      GameField.prototype.swapCircles = function(cell1, cell2) {
        cc.log("swapCirle");
        this.animateMoveCircle(cell1, cell2);
        this.animateMoveCircle(cell2, cell1);
        var tmpCircle = cell2._circle;
        cell2._circle = cell1._circle;
        cell1._circle = tmpCircle;
        this.setCellNoClick(cell1);
        this.setCellNoClick(cell2);
      };
      GameField.prototype.setCellNoClick = function(cell) {
        cell.countClick = 0;
        cell.wasSelectCircle = false;
        cell.wasClick = false;
        cell.setNormalSize();
      };
      GameField.prototype.animateMoveCircle = function(Cell1, Cell2) {
        if (null == Cell1 || null == Cell2) return;
        cc.tween(Cell1._circle).parallel(cc.tween().to(this.iter, {
          scale: 1
        }), cc.tween().to(this.iter, {
          position: Cell2.node.position
        })).call(function() {
          cc.log("finish move");
        }).start();
      };
      GameField.prototype.setBuster = function() {
        cc.log("Buster Set");
        this.busterClick = true;
      };
      GameField.prototype.buster = function() {
        if (this.busterClick && null != this.currentCell) {
          this.startTypeDestroer(this.currentCell);
          this.animateDestroyCircle(this.currentCell);
          this.setCellNoClick(this.currentCell);
          this.busterClick = false;
          this.eventDestoyArow();
          this.currentCell = null;
          this.node.dispatchEvent(new cc.Event.EventCustom("countProgressStep", true));
          return true;
        }
        return false;
      };
      GameField.prototype.setSelectPrewCell = function() {
        null != this.prewCell && this.prewCell !== this.currentCell && this.prewCell.wasSelectCircle && this.prewCell.selectCircle();
      };
      GameField.prototype.setSelectCurrentCell = function() {
        null != this.currentCell && this.currentCell.wasSelectCircle && this.currentCell.selectCircle();
      };
      GameField.prototype.getClickCell = function() {
        for (var j = 0; j < this.Cells.length; j++) for (var i = 0; i < this.Cells[j].length; i++) if (this.Cells[j][i].wasClick) {
          this.Cells[j][i].wasClick = false;
          cc.log("cliced");
          return this.Cells[j][i];
        }
        return null;
      };
      GameField.prototype.clickDestroyCircleInCell = function() {
        this.countCircle--;
        this.node.dispatchEvent(new cc.Event.EventCustom("setPoint", true));
        this.allCirclesMove();
      };
      GameField.prototype.createOneLineCircles = function() {
        for (var i = 0; i < this.Cells[0].length; i++) this.createCircle(this.Cells[0][i]);
        this.allCirclesMove();
        if (this.oneCheckField) {
          this.oneCheckField = false;
          this.needCheckField();
        }
      };
      GameField.prototype.needCheckField = function() {
        this.scheduleOnce(function() {
          this.node.dispatchEvent(new cc.Event.EventCustom("needCheckField", true));
          this.oneCheckField = true;
        }, this.timeForCheckFild);
      };
      GameField.prototype.checkLine = function() {
        this.destroyExisted = false;
        this.InArow();
        cc.log("fied fullness");
        this.node.dispatchEvent(new cc.Event.EventCustom("setUnBlockTouch", true));
      };
      GameField.prototype.createCells = function() {
        var xPos = 0;
        var yPos = 0;
        var _cell;
        for (var j = 0; j < this.Cells.length; j++) {
          for (var i = 0; i < this.Cells[j].length; i++) {
            _cell = cc.instantiate(this.Cell);
            _cell.setContentSize(this.lenghtCell, this.widthCell);
            _cell.setParent(this.node);
            _cell.setPosition(this.StartCellPosX + xPos, this.StartCellPosY + yPos);
            this.Cells[j][i] = _cell.getComponent(Cell_1.Cell);
            i % 2 != 0 && j % 2 == 0 && this.Cells[j][i].setGrayColor();
            i % 2 == 0 && j % 2 != 0 && this.Cells[j][i].setGrayColor();
            this.needRandomVoidCell && this.createAnyTypeCell(this.Cells[j][i], 1);
            this.Cells[j][i].jcolumn = j;
            this.Cells[j][i].irow = i;
            xPos += this.lenghtCell;
          }
          xPos = 0;
          yPos -= this.widthCell;
        }
      };
      GameField.prototype.createAnyTypeCell = function(Cell, type) {
        if (1 == Math.floor(Math.random() * this.ChangeForCreateAnActiveCell + 1)) {
          Cell.typeCell = type;
          Cell.setColorInType();
        }
      };
      GameField.prototype.setTypeCellsOnIandJ = function(i_, j_, iLength, jLegth, type) {
        for (var j = j_; j < jLegth; j++) for (var i = i_; i < iLength; i++) {
          this.Cells[j][i].typeCell = type;
          this.Cells[j][i].setColorInType();
        }
      };
      GameField.prototype.CreateCircles = function() {
        for (var j = 0; j < this.Cells.length; j++) for (var i = 0; i < this.Cells[j].length; i++) 0 == this.Cells[j][i].typeCell && this.createCircle(this.Cells[j][i]);
        this.node.dispatchEvent(new cc.Event.EventCustom("needCheckField", true));
      };
      GameField.prototype.DestroyCircles = function() {
        for (var j = 0; j < this.Cells.length; j++) for (var i = 0; i < this.Cells[j].length; i++) if (this.Cells[j][i].circleIsNotNull()) {
          this.Cells[j][i]._circle.destroy();
          this.Cells[j][i]._circle = null;
        }
      };
      GameField.prototype.createCircle = function(Cell) {
        if (!Cell.circleIsNotNull() && 0 == Cell.typeCell) {
          Cell._circle = cc.instantiate(this.Circle);
          Cell._circle.setParent(this.node);
          Cell._circle.setPosition(Cell.node.position);
          Cell._circle.setContentSize(this.lenghtCell - 15, this.widthCell - 15);
          this.countCircle++;
        }
      };
      GameField.prototype.allCirclesMove = function() {
        for (var j = 0; j < this.Cells.length; j++) for (var i = 0; i < this.Cells[j].length; i++) if (this.Cells[j][i].CellIsNotNull() && !this.Cells[j][i].circleIsNotNull() && 0 == this.Cells[j][i].typeCell) {
          0 == j && this.scheduleOnce(function() {
            this.node.dispatchEvent(new cc.Event.EventCustom("moveCircleEnd", true));
          }, this.iter);
          j >= 1 && this.swapCircleInCell(i, j, i, j - 1);
          if (!this.cellExist) {
            if (j >= 1 && i < this.Cells[j].length - 1) {
              if (1 == Math.floor(Math.random() * Math.floor(2))) {
                this.swapCircleInCell(i, j, i - 1, j - 1);
                this.cellExist || this.swapCircleInCell(i, j, i + 1, j - 1);
              } else this.swapCircleInCell(i, j, i + 1, j - 1);
              this.cellExist || this.swapCircleInCell(i, j, i - 1, j - 1);
            }
            0 == i && j >= 1 && this.swapCircleInCell(i, j, i + 1, j - 1);
            i == this.Cells[j].length - 1 && j >= 1 && this.swapCircleInCell(i, j, i - 1, j - 1);
          }
        }
      };
      GameField.prototype.swapCircleInCell = function(i, j, newi, newj) {
        if (this.validateCircleMove(i, j, newi, newj)) {
          this.Cells[j][i]._circle = this.Cells[newj][newi]._circle;
          this.Cells[newj][newi]._circle = null;
          this.moveCircle(this.Cells[j][i]._circle, this.Cells[j][i].node.position);
          this.cellExist = true;
          return;
        }
        this.cellExist = false;
      };
      GameField.prototype.validateCircleMove = function(i, j, newi, newj) {
        if (ClassHelpers_1.CheckerBoolean.checkTwoBoolean(this.Cells[j][i].CellIsNotNull(), null != this.Cells[newj][newi]) && ClassHelpers_1.CheckerBoolean.checkTwoBoolean(0 == this.Cells[j][i].typeCell, 0 == this.Cells[newj][newi].typeCell) && ClassHelpers_1.CheckerBoolean.checkTwoBoolean(null == this.Cells[j][i]._circle, null != this.Cells[newj][newi]._circle)) return true;
        return false;
      };
      GameField.prototype.moveCircle = function(circle, toMove) {
        var _this = this;
        var _circle = circle.getComponent(Circle_1.Circle);
        _circle.inMove = true;
        cc.tween(circle).parallel(cc.tween().to(this.iter, {
          scale: 1
        }), cc.tween().to(this.iter, {
          position: toMove
        })).call(function() {
          _this.node.dispatchEvent(new cc.Event.EventCustom("moveCircleEnd", true));
          _circle.inMove = false;
        }).start();
      };
      GameField.prototype.fieldOnFilledWithCircles = function() {
        var allcirclenowinfield = 0;
        var allcirclenowinfieldandmove = 0;
        for (var j = 0; j < this.Cells[0].length; j++) for (var i = 0; i < this.Cells[j].length; i++) ClassHelpers_1.CheckerBoolean.checkTwoBoolean(0 == this.Cells[j][i].typeCell, this.Cells[j][i].circleIsNotNull()) && this.Cells[j][i]._circle.getComponent(Circle_1.Circle).inMove && allcirclenowinfieldandmove++;
        cc.log(allcirclenowinfield);
        cc.log(allcirclenowinfieldandmove);
        if (allcirclenowinfieldandmove == allcirclenowinfield) return false;
        return false;
      };
      GameField.prototype.InArow = function() {
        for (var j = 0; j < this.Cells.length; j++) for (var i = 0; i < this.Cells[j].length; i++) {
          this.goDestroyThreeInArow = true;
          if (j >= 2) {
            this.vertical = false;
            this.horizont = true;
            this.InArowTmp(i, j, i, j - 1, i, j - 2);
          }
          if (i < this.Cells[j].length - 2) {
            this.horizont = false;
            this.vertical = true;
            this.InArowTmp(i, j, i + 1, j, i + 2, j);
          }
        }
      };
      GameField.prototype.InArowTmp = function(i, j, iOne, jOne, iTwo, jTwo) {
        if (null != this.Cells[j][i] && null != this.Cells[jOne][iOne] && null != this.Cells[jTwo][iTwo]) {
          var tmpBool1 = ClassHelpers_1.CheckerBoolean.checkTwoBoolean(0 == this.Cells[j][i].typeCell, 0 == this.Cells[jOne][iOne].typeCell);
          var tmpBool2 = ClassHelpers_1.CheckerBoolean.checkTwoBoolean(tmpBool1, 0 == this.Cells[jTwo][iTwo].typeCell);
          if (!tmpBool2) return;
          tmpBool1 = ClassHelpers_1.CheckerBoolean.checkTwoBoolean(this.Cells[j][i].circleIsNotNull(), this.Cells[jOne][iOne].circleIsNotNull());
          tmpBool2 = ClassHelpers_1.CheckerBoolean.checkTwoBoolean(tmpBool1, this.Cells[jTwo][iTwo].circleIsNotNull());
          if (!tmpBool2) return;
          var tmpBool3 = ClassHelpers_1.CheckerBoolean.EqualsTrheeObj(this.Cells[j][i]._circle.getComponent(Circle_1.Circle).CircleTypeColor, this.Cells[jOne][iOne]._circle.getComponent(Circle_1.Circle).CircleTypeColor, this.Cells[jTwo][iTwo]._circle.getComponent(Circle_1.Circle).CircleTypeColor);
          if (!tmpBool3) return;
          if (this.vertical) {
            i < this.Cells[j].length - 4 && this.createRainbowBall(i, j, iOne, jOne, iTwo, jTwo, jTwo, iTwo + 1, jTwo, iTwo + 2, 3);
            i < this.Cells[j].length - 3 && this.goDestroyThreeInArow && this.createLightning(i, j, iOne, jOne, iTwo, jTwo, jTwo, iTwo + 1, 2);
          }
          if (this.horizont) {
            j >= 4 && this.createRainbowBall(i, j, iOne, jOne, iTwo, jTwo, jTwo - 1, iTwo, jTwo - 2, iTwo, 3);
            j >= 3 && this.goDestroyThreeInArow && this.createLightning(i, j, iOne, jOne, iTwo, jTwo, jTwo - 1, iTwo, 1);
          }
          if (this.goDestroyThreeInArow) {
            this.check3Circle(this.Cells[j][i], this.Cells[jOne][iOne], this.Cells[jTwo][iTwo]);
            this.eventDestoyArow();
          }
        }
      };
      GameField.prototype.createRainbowBall = function(i, j, iOne, jOne, iTwo, jTwo, iThree, jThree, iFour, jFour, tipe) {
        if (null == this.Cells[iThree][jThree] || null == this.Cells[iFour][jFour]) return;
        var bool1 = ClassHelpers_1.CheckerBoolean.checkTwoBoolean(0 == this.Cells[iThree][jThree].typeCell, this.Cells[iThree][jThree].circleIsNotNull());
        var bool2 = ClassHelpers_1.CheckerBoolean.checkTwoBoolean(0 == this.Cells[iFour][jFour].typeCell, this.Cells[iFour][jFour].circleIsNotNull());
        if (ClassHelpers_1.CheckerBoolean.checkTwoBoolean(bool1, bool2)) {
          var bool3 = ClassHelpers_1.CheckerBoolean.EqualsTrheeObj(this.Cells[jTwo][iTwo]._circle.getComponent(Circle_1.Circle).CircleTypeColor, this.Cells[iThree][jThree]._circle.getComponent(Circle_1.Circle).CircleTypeColor, this.Cells[iFour][jFour]._circle.getComponent(Circle_1.Circle).CircleTypeColor);
          if (bool3) {
            cc.log("RainbowCreate");
            this.Cells[j][i]._circle.getComponent(Circle_1.Circle).setTipe(tipe);
            cc.log(this.Cells[j][i]._circle.getComponent(Circle_1.Circle).CircleType);
            this.check3Circle(this.Cells[jOne][iOne], this.Cells[jTwo][iTwo], this.Cells[iThree][jThree]);
            this.startCheckCircleForDestroy(this.Cells[iFour][jFour]);
            this.goDestroyThreeInArow = false;
            this.eventDestoyArow();
          }
        }
      };
      GameField.prototype.createLightning = function(i, j, iOne, jOne, iTwo, jTwo, iThree, jThree, tipe) {
        if (null == this.Cells[iThree][jThree]) return;
        if (ClassHelpers_1.CheckerBoolean.checkTwoBoolean(0 == this.Cells[iThree][jThree].typeCell, this.Cells[iThree][jThree].circleIsNotNull()) && ClassHelpers_1.CheckerBoolean.EqualsTwoObj(this.Cells[jTwo][iTwo]._circle.getComponent(Circle_1.Circle).CircleTypeColor, this.Cells[iThree][jThree]._circle.getComponent(Circle_1.Circle).CircleTypeColor)) {
          var circle = this.Cells[j][i]._circle.getComponent(Circle_1.Circle);
          circle.setTipe(tipe);
          this.check3Circle(this.Cells[jOne][iOne], this.Cells[jTwo][iTwo], this.Cells[iThree][jThree]);
          this.goDestroyThreeInArow = false;
          this.eventDestoyArow();
        }
      };
      GameField.prototype.destroyRainbowBall = function(Cell, circle) {
        for (var j = 0; j < this.Cells.length; j++) for (var i = 0; i < this.Cells[j].length; i++) {
          if (!this.Cells[j][i].circleIsNotNull()) return;
          var currentCircle = this.Cells[j][i]._circle.getComponent(Circle_1.Circle);
          Cell != this.Cells[j][i] && circle.CircleTypeColor === currentCircle.CircleTypeColor && (circle.CircleType === currentCircle.CircleType ? this.animateDestroyCircle(this.Cells[j][i]) : this.startCheckCircleForDestroy(this.Cells[j][i]));
        }
      };
      GameField.prototype.destroyLightningVertical = function(Cell, circle) {
        var j = Cell.jcolumn;
        for (var i = 0; i < this.Cells[j].length; i++) {
          if (Cell != this.Cells[j][i] || this.Cells[j][i].CellIsNotNull()) return;
          if (!this.Cells[j][i].circleIsNotNull()) return;
          var currentCircle = this.Cells[j][i]._circle.getComponent(Circle_1.Circle);
          circle.CircleType === currentCircle.CircleType ? this.animateDestroyCircle(this.Cells[j][i]) : this.startCheckCircleForDestroy(this.Cells[j][i]);
        }
      };
      GameField.prototype.destroyLightningHorizont = function(Cell, circle) {
        var i = Cell.irow;
        var thisCircle = circle.getComponent(Circle_1.Circle);
        for (var j = 0; j < this.Cells.length; j++) {
          if (Cell != this.Cells[j][i] || null != this.Cells[j][i]) return;
          if (this.Cells[j][i].circleIsNotNull()) var currentCircle = this.Cells[j][i]._circle.getComponent(Circle_1.Circle);
          if (null == currentCircle) return;
          circle.CircleType === currentCircle.CircleType ? this.animateDestroyCircle(this.Cells[j][i]) : this.startCheckCircleForDestroy(this.Cells[j][i]);
        }
      };
      GameField.prototype.destroylightningVerticalAndlightningHorizont = function(Cell, circle) {
        this.destroyLightningVertical(Cell, circle);
        this.destroyLightningHorizont(Cell, circle);
      };
      GameField.prototype.check3Circle = function(Cell1, Cell2, Cell3) {
        this.startCheckCircleForDestroy(Cell1);
        this.startCheckCircleForDestroy(Cell2);
        this.startCheckCircleForDestroy(Cell3);
      };
      GameField.prototype.startCheckCircleForDestroy = function(Cell) {
        this.startTypeDestroer(Cell);
        this.animateDestroyCircle(Cell);
      };
      GameField.prototype.startTypeDestroer = function(Cell) {
        if (Cell.circleIsNotNull()) {
          var circle = Cell._circle.getComponent(Circle_1.Circle);
          switch (circle.CircleType) {
           case CircleEnums_1.tipeCircle.lightningVerticalAndlightningHorizont:
            this.destroylightningVerticalAndlightningHorizont(Cell, circle);
            break;

           case CircleEnums_1.tipeCircle.rainbowBall:
            this.destroyRainbowBall(Cell, circle);
            break;

           case CircleEnums_1.tipeCircle.lightningVertical:
            this.destroyLightningVertical(Cell, circle);
            break;

           case CircleEnums_1.tipeCircle.lightningHorizont:
            this.destroyLightningHorizont(Cell, circle);
            break;

           case CircleEnums_1.tipeCircle.normal:
            this.animateDestroyCircle(Cell);
          }
        }
      };
      GameField.prototype.destroyEveryCircles = function() {
        for (var j = 0; j < this.Cells.length; j++) for (var i = 0; i < this.Cells[j].length; i++) this.animateDestroyCircle(this.Cells[j][i]);
        this.scheduleOnce(function() {
          this.node.dispatchEvent(new cc.Event.EventCustom("destroyCircles", true));
        }, this.iter + .1);
        this.scheduleOnce(function() {
          this.node.dispatchEvent(new cc.Event.EventCustom("needCheckField", true));
        }, 4 * (this.iter + .2));
      };
      GameField.prototype.eventDestoyArow = function() {
        this.scheduleOnce(function() {
          this.node.dispatchEvent(new cc.Event.EventCustom("setBlockTouch", true));
          this.node.dispatchEvent(new cc.Event.EventCustom("destroyCircles", true));
          this.destroyExisted = true;
        }, this.iter + this.iter);
      };
      GameField.prototype.animateDestroyCircle = function(Cell) {
        var _this = this;
        if (null == Cell) return;
        cc.tween(Cell._circle).parallel(cc.tween().to(this.iter, {
          scale: 0
        }), cc.tween().to(this.iter, {})).call(function() {
          if (null == Cell._circle) return;
          _this.countCircle--;
          _this.getTypeDestroyCircle(Cell._circle.getComponent(Circle_1.Circle));
          _this.node.dispatchEvent(new cc.Event.EventCustom("setPoint", true));
          Cell._circle.destroy();
          Cell._circle = null;
        }).start();
      };
      GameField.prototype.getTypeDestroyCircle = function(circle) {
        this.destroyTipeColors[circle.CircleTypeColor]++;
        cc.log(this.destroyTipeColors[circle.CircleTypeColor]);
        this.node.dispatchEvent(new cc.Event.EventCustom("setDestroyCirclesType_", true));
      };
      __decorate([ property(cc.Prefab) ], GameField.prototype, "Circle", void 0);
      __decorate([ property(cc.Prefab) ], GameField.prototype, "Cell", void 0);
      __decorate([ property ], GameField.prototype, "needRandomVoidCell", void 0);
      __decorate([ property ], GameField.prototype, "ChangeForCreateAnActiveCell", void 0);
      __decorate([ property ], GameField.prototype, "iter", void 0);
      __decorate([ property ], GameField.prototype, "StartCellPosX", void 0);
      __decorate([ property ], GameField.prototype, "StartCellPosY", void 0);
      __decorate([ property ], GameField.prototype, "lenghtCell", void 0);
      __decorate([ property ], GameField.prototype, "widthCell", void 0);
      GameField = __decorate([ ccclass ], GameField);
      return GameField;
    }(cc.Component);
    exports.GameField = GameField;
    cc._RF.pop();
  }, {
    "./Cell": "Cell",
    "./Circle": "Circle",
    "./CircleEnums": "CircleEnums",
    "./ClassHelpers": "ClassHelpers"
  } ],
  GamesController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e906eWDGftIDL9q6NIO0kDr", "GamesController");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameController = void 0;
    var Circle_1 = require("./Circle");
    var GameField_1 = require("./GameField");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameController = function(_super) {
      __extends(GameController, _super);
      function GameController() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.countTypeAndMove = 12;
        _this.allpoints = 0;
        _this.taskType = null;
        _this.taskpoints = 0;
        _this.currentMove = null;
        _this.movepoints = 0;
        _this.testGame = true;
        _this.textPoint = null;
        _this.gameField = null;
        _this.gameOver = null;
        _this.gameWon = null;
        _this.typeTask = null;
        _this.testGameText = null;
        _this.blockField = null;
        return _this;
      }
      GameController.prototype.onLoad = function() {
        this.testGame && (this.testGameText.active = true);
        this.taskpoints = Number(this.taskType.string);
        this.movepoints = Number(this.currentMove.string);
        this.node.on("moveCircleEnd", this.gameField.createOneLineCircles, this.gameField);
        this.node.on("moveCircleEnd", function(event) {
          event.stopPropagation();
        });
        this.node.on("clickOnCellForDestroyCircle", this.gameField.clickDestroyCircleInCell, this.gameField);
        this.node.on("clickOnCellForDestroyCircle", function(event) {
          event.stopPropagation();
        });
        this.node.on("destroyCircles", this.gameField.allCirclesMove, this.gameField);
        this.node.on("destroyCircles", function(event) {
          event.stopPropagation();
        });
        this.node.on("needCheckField", this.gameField.checkLine, this.gameField);
        this.node.on("needCheckField", function(event) {
          event.stopPropagation();
        });
        this.node.on("setPoint", this.setPoint, this);
        this.node.on("setPoint", function(event) {
          event.stopPropagation();
        });
        this.node.on("getDestroyCirclesType", this.gameField.getTypeDestroyCircle, this.gameField);
        this.node.on("getDestroyCirclesType", function(event) {
          event.stopPropagation();
        });
        this.node.on("setDestroyCirclesType_", this.setTypeDestroyCircle, this);
        this.node.on("setDestroyCirclesType_", function(event) {
          event.stopPropagation();
        });
        this.node.on("countProgressStep", this.countProgressStep, this);
        this.node.on("countProgressStep", function(event) {
          event.stopPropagation();
        });
        this.node.on("countProgressDestrCirles", this.countProgressStep, this);
        this.node.on("countProgressDestrCirles", function(event) {
          event.stopPropagation();
        });
      };
      GameController.prototype.setPoint = function() {
        this.allpoints += 1;
        this.textPoint.string = this.allpoints.toString();
      };
      GameController.prototype.countProgressStep = function() {
        this.movepoints--;
        cc.log(this.movepoints);
        this.currentMove.string = String(this.movepoints);
        this.testGame || 0 == this.movepoints && (this.gameOver.active = true);
      };
      GameController.prototype.progressTargetDestoyCircle = function() {
        var circleTask = this.typeTask.getComponent(Circle_1.Circle);
        var countDestroyersTaskCircles = this.countTypeAndMove - this.gameField.destroyTipeColors[circleTask.CircleTypeColor];
        this.taskType.string = String(countDestroyersTaskCircles);
        this.testGame || countDestroyersTaskCircles <= 0 && (this.gameWon.active = true);
      };
      GameController.prototype.gameOverNodeDeActivate = function() {
        this.gameOver.active = false;
      };
      GameController.prototype.gameWonNodeDeActivate = function() {
        this.gameWon.active = false;
      };
      GameController.prototype.CheckGameOverIfColorChallengeIsComplete = function() {};
      GameController.prototype.RestartGame = function() {
        this.gameField.node.active = false;
        this.gameField.node.active = true;
        this.allpoints = 1;
        this.textPoint.string = this.allpoints.toString();
        this.movepoints = this.countTypeAndMove;
        this.taskType.string = this.countTypeAndMove.toString();
        this.currentMove.string = this.countTypeAndMove.toString();
        var circleTask = this.typeTask.getComponent(Circle_1.Circle);
        circleTask.setRandomColor();
      };
      GameController.prototype.setTypeDestroyCircle = function() {
        this.progressTargetDestoyCircle();
      };
      __decorate([ property ], GameController.prototype, "countTypeAndMove", void 0);
      __decorate([ property(cc.Label) ], GameController.prototype, "taskType", void 0);
      __decorate([ property(cc.Label) ], GameController.prototype, "currentMove", void 0);
      __decorate([ property ], GameController.prototype, "testGame", void 0);
      __decorate([ property(cc.Label) ], GameController.prototype, "textPoint", void 0);
      __decorate([ property(GameField_1.GameField) ], GameController.prototype, "gameField", void 0);
      __decorate([ property(cc.Node) ], GameController.prototype, "gameOver", void 0);
      __decorate([ property(cc.Node) ], GameController.prototype, "gameWon", void 0);
      __decorate([ property(cc.Node) ], GameController.prototype, "typeTask", void 0);
      __decorate([ property(cc.Node) ], GameController.prototype, "testGameText", void 0);
      __decorate([ property(cc.Node) ], GameController.prototype, "blockField", void 0);
      GameController = __decorate([ ccclass ], GameController);
      return GameController;
    }(cc.Component);
    exports.GameController = GameController;
    cc._RF.pop();
  }, {
    "./Circle": "Circle",
    "./GameField": "GameField"
  } ]
}, {}, [ "Cell", "CellEnums", "Circle", "CircleEnums", "ClassHelpers", "GameField", "GamesController" ]);