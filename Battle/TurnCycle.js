class TurnCycle {
    constructor({ battle, onNewEvent }) {
        this.battle = battle;
        this.onNewEvent = onNewEvent;
        this.currentTeam = "player"; //can also be enemy
    }


    //whose turn it is(hero or enemy)
    async turn() {

        //who is caster (palyer/enemy)
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];

        //who is enemy is
        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"]
        const enemy = this.battle.combatants[enemyId]

        //what action to be performed and on who
        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster,
            enemy

        })

        //stop here if we are switching the pizza
        if (submission.replacement) {
            await this.onNewEvent({
              type: "replace",
              //to replace the one from the deck
              replacement: submission.replacement
            })
            //inspirational message 
            await this.onNewEvent({
                type: "textMessage",
                text: `Go get 'em, ${submission.replacement.name}!`
              })
            this.nextTurn();
            return;
            
        }

        //to decrese the no of item after sucessfully using it 
        if(submission.instanceId){
            this.battle.items=this.battle.items.filter(i=>i.instanceId !==submission.instanceId);
        }


        //check for the negative status effect before attacking 
        const resultingEvents = caster.getReplacedEvents(submission.action.success);
        for (let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        //did the target die??
        const targetDead = submission.target.hp <=0;
        if(targetDead){
            await this.onNewEvent({
                type: "textMessage",
                text: `${submission.target.name} is ruined!`
              })
        }

        //do we have winning team???
        const winner = this.getWinningTeam();//to know who won
        if(winner){
            await this.onNewEvent({
                type: "textMessage",
                text: "Winner",
            })
            //end the battle if no active/healthy member are there
            return; 
        }


        //do we have a dead target and replacement
        if(targetDead){
            const replacement = await this.onNewEvent({
                type: "replacementMenu",
                team: submission.target.team,
            })
            await this.onNewEvent({
                type: "replace",
                //to replace the one from the deck
                replacement: replacement
              })
              //inspirational message 
              await this.onNewEvent({
                  type: "textMessage",
                  text: `Do your best ${submission.target.name}!`
                })
        }



        //check for post events(do things after your original turn sumbission)
        const postEvents = caster.getPostEvents();
        for (let i=0;i<postEvents.length;i++){
            const event={
                ...postEvents[i],
                submission,
                action:submission.action,
                caster,
                target:submission.target,
            }
            await this.onNewEvent(event);
        }

        //check for status expire
        const expiredEvent = caster.decrementStatus();
        if(expiredEvent){
            await this.onNewEvent(expiredEvent)
        }
        
        this.nextTurn();
       
    }
        // to check turn order
        nextTurn(){
            this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
            this.turn();
        }


        // to know who won the battle
        getWinningTeam(){
            let aliveTeams={};
            Object.values(this.battle.combatants).forEach(c=>{
                if(c.hp>0){
                    aliveTeams[c.team]=true;
                }
            })
            //enemy wins if all players team dies
            if(!aliveTeams["player"]) {return "enemy"}

            //player wins if all enemys team dies
            if(!aliveTeams["enemy"]) {return "player"}

            return null;

        }

    async main() {
        // await this.onNewEvent({
        //     type: "textMessage",
        //     text: "The battle is starting!"
        // })

        //Start the first turn!
        this.turn();
    }
}