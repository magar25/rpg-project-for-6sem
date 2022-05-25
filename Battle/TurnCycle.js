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
        const resultingEvents = submission.action.success;
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
        // to check turn order
        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();


    }


    async main() {
        await this.onNewEvent({
            type: "textMessage",
            text: "The battle is starting!"
        })

        //Start the first turn!
        this.turn();
    }
}