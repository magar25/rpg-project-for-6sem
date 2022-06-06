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
        //check for post events(do things after your original tour sumbission)
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

        //checkfor status expire
        const expiredEvent = caster.decrementStatus();
        if(expiredEvent){
            await this.onNewEvent(expiredEvent)
        }
        
        // to check turn order
        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();


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