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


@ccclass
export default class BattleCard extends cc.Component {

    @property(cc.Label)
    hpText: cc.Label = null;

    @property
    hp: number = 0;

    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;

    @property(cc.Node)
    hightlightNode: cc.Node = null;

    @property([cc.SpriteFrame])
    cardSpriteFrames: cc.SpriteFrame[] = [];

    // LIFE-CYCLE CALLBACKS:
    setInfo(cardId:number, initHp:number){
        this.hp = initHp;
        
        this.iconSprite.spriteFrame = this.cardSpriteFrames[cardId];

        this.setHighlight(false);
    }

    setHighlight(b: boolean){
        this.hightlightNode.active = b;
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
