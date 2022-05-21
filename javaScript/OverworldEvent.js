<<<<<<< HEAD
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
        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.main(document.querySelector(".game-container"))
    }


    main() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
=======
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
        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.main(document.querySelector(".game-container"))
    }


    main() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
>>>>>>> 4fed23dfe4298a5a8a86e542e20805c97a23173f
}