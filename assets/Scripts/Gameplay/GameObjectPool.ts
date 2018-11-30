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
export default class GameObjectPool extends cc.Component {

    @property(cc.Prefab)
    gameObjectPrefabs: cc.Prefab[] = [];

    //@property(cc.Node)
    cachedGameObjects: cc.Node[] = [];

    //@property
    cachedPrefabNames: string[] = [];

    // LIFE-CYCLE CALLBACKS:    
    spawnGameObject = (prefabName: string) => {
        let gameObjectPrefab = null;
        for(let i=0;i<this.gameObjectPrefabs.length;i++){
            if(this.gameObjectPrefabs[i].name == prefabName){
                gameObjectPrefab = this.gameObjectPrefabs[i];
                break;
            }
        }
        if(gameObjectPrefab == null){
            return null;
        }
        
        let freeSlot = -1;
        for(let i=0;i<this.cachedGameObjects.length;i++){
            if(this.cachedPrefabNames[i] != prefabName){
                continue;
            }
            if(!this.cachedGameObjects[i].active){
                freeSlot = i;
                break;
            }
        }
        
       
        if(freeSlot != -1){            
            this.cachedGameObjects[freeSlot].active = true;
            return this.cachedGameObjects[freeSlot];
        }
        else{
            let obj = cc.instantiate(gameObjectPrefab);
            this.node.addChild(obj); 
            
            this.cachedGameObjects.push(obj);
            this.cachedPrefabNames.push(prefabName);
            return obj;
        }
    }

    clearAll = (prefabName: string) => {
        for(let i=0;i<this.cachedGameObjects.length;i++){
            if(this.cachedGameObjects[i].active){
                this.cachedGameObjects[i].active = false;
            }
        }
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
