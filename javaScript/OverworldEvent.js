class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    //to check if standing events finished
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

    //to check if walking events finished
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

    changeMap(resolve) {
        this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
        resolve();
    }


    main() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }


}