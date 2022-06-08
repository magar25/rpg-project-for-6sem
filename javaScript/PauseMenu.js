class PauseMenu{
    constructor({onComplete}){
        this.onComplete=onComplete;

    }


    //different option in the option menu
    getOptions(pageKey){

        if(pageKey==="root"){
            //case 1 : show the  first option page
            const lineupPizzas=playerState.lineup.map(id=>{
                const {pizzaId}=playerState.pizzas[id];
                const base = Pizzas[pizzaId];
                return{
                    label:base.name,
                    description: base.description,
                    handler:()=>{
                        this.keyboardMenu.setOptions(this.getOptions(id))
                    }
                }
            })
            return[
                //..all of our pizzas
                ...lineupPizzas,
                {
                    label:"Save",
                    description:"Save your game",
                    handler:()=>{
                        //we'll come back to title
                    }
                },
                {
                    label:"Close",
                    description:"Close the pause menu",
                    handler:()=>{
                        this.close();
                    }
                }
            ]
        }

        //case 2: show the option fo rjust one pizza(by id)

        const unequipped = Object.keys(playerState.pizzas).filter(id=>{
            return playerState.lineup.indexOf(id) === -1; //pizzas not in the array
        }).map(id=>{
            const{pizzaId}=playerState.pizzas[id];
            const base=Pizzas[pizzaId];
            return{
                label:`Swap for ${base.name}`,
                description:base.description,
                handler:()=>{
                    playerState.swapLineup(pageKey,id);// swap the old id with the new one
                    this.keyboardMenu.setOptions(this.getOptions("root"));
                    
                }
            }
        })

        return [
               // swap for any unequipped pizza
               ...unequipped,

        {
            label:"Move to front",
            description:"Move this pizza to the front fo the list",
            handler:()=>{
                playerState.moveToFront(pageKey);
                this.keyboardMenu.setOptions(this.getOptions("root"));
            }   
        },
        {
            label:"Back",
            description:"Go back to root menu",
            handler:()=>{
                this.keyboardMenu.setOptions(this.getOptions("root"));
            }

        }
        ];

    }


    createElement(){
        this.element=document.createElement("div");
        this.element.classList.add("PauseMenu");
        this.element.classList.add("overlayMenu");
        this.element.innerHTML=(`
            <h2> Pause Menu </p>
        `)


    }

    close(){
        this.esc?.unbind();
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();

    }


    async main(container){
        this.createElement();
        this.keyboardMenu= new KeyboardMenu({
            //
            descriptionContainer: container

        })
        this.keyboardMenu.main(this.element);
        this.keyboardMenu.setOptions(this.getOptions("root"));
        container.appendChild(this.element);

        utils.wait(200);
        //esc key to close the menu
        this.esc = new keyPressListener("Escape",()=>{
            this.close();
        })

    }
}