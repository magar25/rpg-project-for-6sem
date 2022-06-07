class PlayerState{

    constructor() {
        this.pizzas = {
          "p1": {
            pizzaId: "s001",
            hp: 30,
            maxHp: 50,
            xp: 90,
            maxXp: 100,
            level: 1,
            status: { type: "saucy" },
          },
          "p2": {
            pizzaId: "v001",
            hp: 50,
            maxHp: 50,
            xp: 75,
            maxXp: 100,
            level: 1,
            status: null,
          },
          "p3": {
            pizzaId: "c001",
            hp: 50,
            maxHp: 50,
            xp: 75,
            maxXp: 100,
            level: 1,
            status: null,
          },
        }
        this    
        this.lineup=["p1","p2"];
        this.items=[
            {actionId:"item_recoverStatus", instanceId:"item1"},
            {actionId:"item_recoverStatus", instanceId:"item2"},
            {actionId:"item_recoverHp", instanceId:"item3"},
            {actionId:"item_recoverHp", instanceId:"item4"},
        ]   

    }

      // to swap usind the id

    swapLineup(oldId,IncomingId){

      const oldIndex = this.lineup.indexOf(oldId); // take the old id
      this.lineup[oldIndex]=IncomingId; // replace it with the new one
      utils.emitEvent("LineupChanged");

    }

      // to move in front of the lineup
    moveToFront(futureFrontId){

      this.lineup=this.lineup.filter(id=> id !== futureFrontId); // remove the selected id for he list/array
      this.lineup.unshift(futureFrontId); // set the removed id in the front
      utils.emitEvent("LineupChanged");

    }
}


window.playerState= new PlayerState();