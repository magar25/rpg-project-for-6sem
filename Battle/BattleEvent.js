class BattleEvent {
    constructor(event, battle) {
        this.event = event;
        this.battle = battle;
    }

    //getting all the  message happening  in turn cycle
    textMessage(resolve) {

        const text = this.event.text
            .replace("{CASTER}", this.event.caster ?.name) // replace caster with player/enemy name
            .replace("{TARGET}", this.event.target ?.name) // replace target with player/enemy name
            .replace("{ACTION}", this.event.action ?.name) // replace ation name

        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            }
        })
        message.main(this.battle.element); //showing the message in battle container
    }


    async stateChange(resolve){
        const{caster,target,damage}=this.event;
        if(damage){
        //modify the targets to have less hp after getting attacked
            target.update({
                hp:target.hp-damage
            })

        //start blinking when taking damage
        target.pizzaElement.classList.add("battle-damage-blink");

        }

        //wait a little bit
        await utils.wait(600);
        
        //stop blinking
        target.pizzaElement.classList.remove("battle-damage-blink");
        resolve();
    }

    //putting the menu on screen
    submissionMenu(resolve) {
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            onComplete: submission => {
                //submisson {what move to use and who to use it on }
                resolve(submission)
            }
        })
        menu.main(this.battle.element); //showing in battle container
    }


    animation(resolve){
        const fn=BattleAnimations[this.event.animation];
        fn(this.event, resolve);
    }
    main(resolve) {
        this[this.event.type](resolve);
    }



}