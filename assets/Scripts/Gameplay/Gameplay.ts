// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import GameObjectPool from "./GameObjectPool";
import BattleCard from "./Objects/BattleCard";
import CellSlot from "./Objects/CellSlot";

@ccclass
export default class Gameplay extends cc.Component {

    @property(GameObjectPool)
    gameObjectPool: GameObjectPool = null;

    @property(cc.Node)
    nodeHolder: cc.Node = null;

    @property([cc.Node])
    playerCardsHolder: cc.Node[] = [];

    @property
    gameState: any = null;

    mySelectingCard: BattleCard = null;
    allHandCards: BattleCard[] = [];

    mySelectingSlot: CellSlot = null;
    allCellSlot: CellSlot[] = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var that = this;

        this.gameState = {
            turn: 0,
            step: 0,
            myId: 0,
            battlefield: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            players: [{
                id: 0,
                handCards: [0, 1, 2]
            },{
                id: 1,
                handCards: [1, 2, 0]
            },{
                id: 2,
                handCards: [2, 0, 1]
            }]
        };
        var lefttop = new cc.Vec2(-190, 110);
        var righttop = new cc.Vec2(190, 110);
        var bot = new cc.Vec2(0, -150);

        var nodePositions = [];

        nodePositions.push(bot.add(righttop.sub(bot).mul(0.2)));
        nodePositions.push(bot.add(righttop.sub(bot).mul(0.4)));
        nodePositions.push(bot.add(righttop.sub(bot).mul(0.6)));
        nodePositions.push(bot.add(righttop.sub(bot).mul(0.8)));

        nodePositions.push(righttop.add(lefttop.sub(righttop).mul(0.2)));
        nodePositions.push(righttop.add(lefttop.sub(righttop).mul(0.4)));
        nodePositions.push(righttop.add(lefttop.sub(righttop).mul(0.6)));
        nodePositions.push(righttop.add(lefttop.sub(righttop).mul(0.8)));
        
        nodePositions.push(lefttop.add(bot.sub(lefttop).mul(0.2)));
        nodePositions.push(lefttop.add(bot.sub(lefttop).mul(0.4)));
        nodePositions.push(lefttop.add(bot.sub(lefttop).mul(0.6)));
        nodePositions.push(lefttop.add(bot.sub(lefttop).mul(0.8)));

        

        

        for (var _i = 0; _i < 12; _i++) {
            let obj = this.gameObjectPool.spawnGameObject('CellSlot');
            if(obj){
                obj.parent = null;
                this.nodeHolder.addChild(obj);
                obj.setPosition(nodePositions[_i]);
                let cellSlot = obj.getComponent(CellSlot);
                this.allCellSlot.push(cellSlot);
                cellSlot.setSlot(_i);
                
                obj.on("mousemove", () => {
                    if(that.mySelectingCard != null){
                        that.lostFocusCell();
                        if(that.isMyAttackCell(cellSlot)){
                            cellSlot.setHighlight(true);
                        }
                    } 
                });

                obj.on(cc.Node.EventType.TOUCH_END, () => {
                    if(that.mySelectingCard != null){
                        that.lostFocusCell();
                        if(that.isMyAttackCell(cellSlot)){                            
                            cellSlot.setHighlight(true);
                        }
                    } 
                });

                {
                    let cardObj = this.gameObjectPool.spawnGameObject('BattleCard');
                    if(cardObj){
                        cardObj.parent = null;
                        obj.addChild(cardObj);
                        cardObj.setScale(0.3);       
                        cardObj.setPosition(0, -20);         
                        var battleCard = cardObj.getComponent(BattleCard);  
                        cellSlot.battleCard = battleCard;
                    }  
                }
            }              
        }

        
        for (var _i = 0; _i < 3; _i++) {
            for (var _j = 0; _j < 3; _j++) {
                let obj = this.gameObjectPool.spawnGameObject('BattleCard');
                if(obj){
                    obj.parent = null;
                    this.playerCardsHolder[_i].addChild(obj);                
                    var battleCard = obj.getComponent(BattleCard);
                    battleCard.setInfo(this.gameState.players[_i].handCards[_j], 1);
                    this.allHandCards.push(battleCard);
                    let slot = _i * 3 + _j;
                    obj.on(cc.Node.EventType.TOUCH_START, () => {
                        that.onCardSelected(slot);
                    });
                    obj.on(cc.Node.EventType.TOUCH_MOVE, () => {
                        that.onCardMoving(slot);
                    });

                    obj.on(cc.Node.EventType.TOUCH_END, () => {
                        that.onCardMoved(slot);
                    });
                }   
            }
        }       
    }

    lostFocusCell(){
        for(var i=0;i<this.allCellSlot.length;i++){
            this.allCellSlot[i].setHighlight(false);
        }
    }

    isMyAttackCell(cell: CellSlot){
        var cellA: CellSlot = null;
        var cellB: CellSlot = null;
        if(this.gameState.myId == 0){
            cellA = this.allCellSlot[0];
            cellB = this.allCellSlot[11];
        } else if(this.gameState.myId == 1){
            cellA = this.allCellSlot[3];
            cellB = this.allCellSlot[4];
        } else{
            cellA = this.allCellSlot[7];
            cellB = this.allCellSlot[8];
        }
        return (cell == cellA) || (cell == cellB);
    }

    getMyCellSlotAtPos(pos: cc.Vec2){
        var cellA: CellSlot = null;
        var cellB: CellSlot = null;
        if(this.gameState.myId == 0){
            cellA = this.allCellSlot[0];
            cellB = this.allCellSlot[11];
        } else if(this.gameState.myId == 1){
            cellA = this.allCellSlot[3];
            cellB = this.allCellSlot[4];
        } else{
            cellA = this.allCellSlot[7];
            cellB = this.allCellSlot[8];
        }

        if(cellA.node.getPosition().sub(pos).magSqr() < 5000){
            return cellA;
        }
        if(cellB.node.getPosition().sub(pos).magSqr() < 5000){
            return cellB;
        }
        return null;
    }

    isMyCard(slot:number){
        return Math.floor(slot / 3) == this.gameState.myId;
    }
    onCardSelected(slot:number){    
        if(this.gameState.step == 0){ //choice card
            if(this.isMyCard(slot)){
                if(this.mySelectingCard == this.allHandCards[slot]){
                    this.mySelectingCard.setHighlight(false);
                    this.mySelectingCard = null;
                } else{
                    if(this.mySelectingCard != null){
                        this.mySelectingCard.setHighlight(false);
                        this.mySelectingCard = null;
                    }

                    this.mySelectingCard = this.allHandCards[slot];
                    this.mySelectingCard.setHighlight(true);
                }
            }
        }
    }

    onCardMoving(slot:number){

    }

    onCardMoved(slot:number){
 
    }

    start () {

    }

    // update (dt) {}
}
 