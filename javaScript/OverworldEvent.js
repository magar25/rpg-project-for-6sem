class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    //for standing event
    stand(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
                map: this.map
            }, {
                type: "stand",
                direction: this.event.direction,
                time: this.event.time
            })
            // set up a handler to complete when a correct person is done standing, then resolve the event
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonStandComplete", completeHandler);
    }

    //for walking event
    walk(resolve) {

        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })

        // set up a handler to complete when a correct person is done walking, then resolve the event
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler);

    }

    // to display text message
    textMessage(resolve) {

        // to make NPCs face the hero while talking
        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.main(document.querySelector(".game-container"))
    }

    //for Battle
    battle(resolve) {
        const battle = new Battle({
            enemy: Enemies[this.event.enemyId],
            onComplete: () => {
                resolve();
            }
        })
        battle.main(document.querySelector(".game-container"));
    }


    changeMap(resolve) {

        const sceneTransition = new SceneTransition();
        sceneTransition.main(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
            resolve();

            sceneTransition.fadeOut(); // we can see the new map after fadeout
        })
    }

    main() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }


}