class Battle {
    constructor() {
            this.combatants = {
                    "player1": new Combatant({
                        ...Pizzas.s001,
                        team: "player",
                        hp: 35,
                        maxHp: 50,
                        xp: 70,
                        maxXp: 100,
                        level: 1,
                        status: null,
                    }, this),
                    "player2": new Combatant({
                        ...Pizzas.c001,
                        team: "player",
                        hp: 25,
                        maxHp: 50,
                        xp: 40,
                        maxXp: 100,
                        level: 1,
                        status: null,
                    }, this),
                    "enemy1": new Combatant({
                        ...Pizzas.v001,
                        team: "enemy",
                        hp: 20,
                        maxHp: 50,
                        xp: 50,
                        maxXp: 100,
                        level: 1,
                        status: null,
                    }, this),
                    "enemy2": new Combatant({
                        ...Pizzas.f001,
                        team: "enemy",
                        hp: 25,
                        maxHp: 50,
                        xp: 40,
                        maxXp: 100,
                        level: 1,
                        status: null,
                    }, this),


                }
                // to show which pizza gets display on the screen first
            this.activeCombatants = {
                player: "player2",
                enemy: "enemy2",
            }
        }
        //creating dynamic battle sprites for hero and enemy
    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = (`
        <div class="Battle_hero">
        <img src="${'/images/characters/people/hero.png'}" alt="Hero" />
        </div>
        
        <div class ="Battle_enemy">
        <img src ="${'/images/characters/people/npc3.png'}" alt="Enemy" />
        </div>
         `)
    }


    main(container) {
        this.createElement();
        container.appendChild(this.element);

        //putting every thing form the combatant to battle

        Object.keys(this.combatants).forEach(key => {
                let combatant = this.combatants[key];
                combatant.id = key;
                combatant.main(this.element);
            })
            //for whose turn it is and what action it did
        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: event => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this) // passing battle(this)
                    battleEvent.main(resolve);
                })
            }
        })

        this.turnCycle.main();

    }



}