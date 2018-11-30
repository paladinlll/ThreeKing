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
import BattleCard from "./BattleCard";

@ccclass
export default class CellSlot extends cc.Component {

    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;

    @property(cc.Node)
    hightlightNode: cc.Node = null;

    @property(BattleCard)
    battleCard: BattleCard = null;

    slotIndex: number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    setSlot(no: number){
        this.slotIndex = no;
        
        if(no == 0 || no == 11){
            this.bgSprite.node.color = new cc.Color(0, 150, 150);
        } else if(no == 3 || no == 4){
            this.bgSprite.node.color = new cc.Color(150, 0, 150);
        } else if(no == 7 || no == 8){
            this.bgSprite.node.color = new cc.Color(150, 150, 0);
        } else {
            this.bgSprite.node.color = new cc.Color(150, 150, 150);
        }
        this.setHighlight(false);
    }

    setCard(cardId:number, cardHp:number){
        if(cardId == -1){
            this.battleCard.node.active = false;
            return;
        }
        this.battleCard.setInfo(cardId, cardHp);
    }

    setHighlight(b: boolean){
        this.hightlightNode.active = b;
    }



    start () {

    }

    // update (dt) {}
}
