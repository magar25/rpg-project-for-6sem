class SubmissionMenu {

    constructor({ caster, enemy, onComplete,items }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;

        let quantityMap = {};
        items.forEach(item => {
          if (item.team === caster.team) {
            let existing = quantityMap[item.actionId];
            if (existing) {
              existing.quantity += 1;
            } else {
              quantityMap[item.actionId] = {
                actionId: item.actionId,
                quantity: 1,
                instanceId: item.instanceId,
              }
           }
          }
        })
        this.items = Object.values(quantityMap);
        
    }

    //Different option avilabel while battling to the player
    getPages(){
        // to go back to the main menu 
        const backOption={
            label:"Go Back",
                    description:"Return to previous page",
                    handler:()=>{
                        //do something when chosen..
                        this.keyboardMenu.setOptions(this.getPages().root)
                    }
        };

        return{
            root:[
                //choose different attack option
                {
                    label:"Attack",
                    description:"choose an attack",
                    handler:()=>{
                        //do something when chosen..
                        this.keyboardMenu.setOptions(this.getPages().attacks)
                    
                    }
                },
                //chooose differnt itmes to use
                {
                    label:"Items",
                    description:"Select Items",
                    handler:()=>{
                        //Go to items page...
                        this.keyboardMenu.setOptions(this.getPages().items)
                        
                    }
                },
                //swap between different healthy pizzas
                {
                    label:"Swap",
                    description:"Change to another pizza",
                    handler:()=>{
                        //see pizza options
                        this.keyboardMenu.setOptions(this.getPages().swap)

                    }
                },

            ],
            //for player to decide what attack to use
            attacks:[
                ...this.caster.actions.map(key=>{
                    const action = Actions[key];
                    return{
                        label:action.name,
                        description:action.description,
                        handler:() =>{
                            this.menuSubmit(action)
                        }
                    }
                }),
                backOption
            ],
            //for items
            items: [
                ...this.items.map(item => {
                  const action = Actions[item.actionId];
                  return {
                    label: action.name,
                    description: action.description,
                    right: () => {
                      return "x"+item.quantity;
                    },
                    handler: () => {
                      this.menuSubmit(action, item.instanceId)
                    }
                  }
                }),
                backOption
              ]
        }
    }

    //
    menuSubmit(action, instanceId=null) {

        this.keyboardMenu?.end(); //end the keyboardMenu binding

        this.onComplete({
            action,
            //checking who to perfomr the action on 
            target: action.targetType === "friendly" ? this.caster : this.enemy,
            instanceId
        })
    }

    decide() {
        //ememies should ramdomly decide what to do ..
        this.menuSubmit(Actions[this.caster.actions[0]]);
    }

    showMenu (container){
        
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.main(container);
        this.keyboardMenu.setOptions(this.getPages().root);
    }

    main(container) {

        if(this.caster.isPlayerControlled){
            // show some UI
            this.showMenu(container);

        }else {
            this.decide();
        }
    }

}